/* 每日 / 每周学习系统（v4.2，交接 §8、§9）。
 *
 * 职责：今日学习简报（目标、进度、今日完成数、每日徽记）与本周统计
 * （周一至周日柱状数据、环比）。全部是**确定性推导**：
 *   - 今日有效学习秒数来自 state.daily[今天]；
 *   - 今日完成课程 / 官方任务 / 自测数来自每课记录的时间戳（completedAt /
 *     officialCompletedAt / quizCompletedAt 以今天日期开头即视为今天完成）；
 *   - 每日徽记（§8.2）完全由当前状态推导，不落存储——同一份档案任何时候
 *     算出的徽记都相同，第二天回看历史时按历史日的 daily 与时间戳重算即可。
 * 设计：纯逻辑，不依赖 DOM 与存储；progress.js 在保存钩子里调用
 * settleDailyGoal 结算每日目标叶片（幂等闩锁在 economy.js 的 coinFlags）。
 * 每日目标本体存在 state.settings.dailyGoalMinutes（设置中心在后续批次接管 UI）。 */
(() => {
  'use strict';

  const GOAL_CHOICES = [10, 20, 30, 45, 60];
  const DEFAULT_GOAL_MINUTES = 20;

  function goalMinutesOf(state) {
    const value = state && state.settings ? Number(state.settings.dailyGoalMinutes) : NaN;
    return GOAL_CHOICES.includes(value) ? value : DEFAULT_GOAL_MINUTES;
  }

  function goalSecondsOf(state) {
    return goalMinutesOf(state) * 60;
  }

  /* 用 UTC 运算平移日期字符串，与 progress.js 的 shiftDayKey 同一规则。 */
  function shiftDayKey(dayKey, delta) {
    const [year, month, day] = dayKey.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day + delta)).toISOString().slice(0, 10);
  }

  /* 某天的星期一（ISO 周，周一为一周开始）。 */
  function mondayOf(dayKey) {
    const [year, month, day] = dayKey.split('-').map(Number);
    const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();   // 0=周日
    const back = weekday === 0 ? 6 : weekday - 1;
    return shiftDayKey(dayKey, -back);
  }

  /* 一周七天（周一 → 周日）的日期键数组。 */
  function weekDaysOf(dayKey) {
    const monday = mondayOf(dayKey);
    return Array.from({ length: 7 }, (_, i) => shiftDayKey(monday, i));
  }

  /* 今日完成了多少课 / 官方任务 / 自测：按时间戳的日期前缀统计。
   * 撤销会把时间戳清空，重新勾选则记当天——口径是“今天标记为完成”。 */
  function countMarkedToday(state, lessons, dayKey, stampField) {
    if (!Array.isArray(lessons)) return 0;
    return lessons.filter(lesson => {
      const entry = (state.lessons || {})[lesson.id] || {};
      return typeof entry[stampField] === 'string' && entry[stampField].slice(0, 10) === dayKey;
    }).length;
  }

  function countMarkedInRange(state, lessons, dayKeys, stampField) {
    const range = new Set(dayKeys);
    if (!Array.isArray(lessons)) return 0;
    return lessons.filter(lesson => {
      const entry = (state.lessons || {})[lesson.id] || {};
      return typeof entry[stampField] === 'string' && range.has(entry[stampField].slice(0, 10));
    }).length;
  }

  /* ---------- 今日简报（§8.1） ---------- */
  function dailyBrief(state, lessons, todayKey) {
    const goalMinutes = goalMinutesOf(state);
    const goalSeconds = goalMinutes * 60;
    const todaySeconds = (state.daily || {})[todayKey] || 0;
    const streakMinSeconds = 600;   /* 与 progress.js 的 STREAK_MIN_DAY_SECONDS 一致（测试钉住） */
    const badges = [];
    if (todaySeconds >= goalSeconds) badges.push('goal');
    if (countMarkedToday(state, lessons, todayKey, 'completedAt') > 0) badges.push('lesson');
    if (countMarkedToday(state, lessons, todayKey, 'quizCompletedAt') > 0) badges.push('quiz');
    if (countMarkedToday(state, lessons, todayKey, 'officialCompletedAt') > 0) badges.push('official');
    if (todaySeconds >= 30 * 60) badges.push('half-hour');
    if (todaySeconds >= 60 * 60) badges.push('hour');
    return {
      todayKey,
      todaySeconds,
      todayText: formatMinutes(todaySeconds),
      goalMinutes,
      goalSeconds,
      goalProgress: goalSeconds ? Math.min(100, Math.round((todaySeconds / goalSeconds) * 100)) : 0,
      goalDone: todaySeconds >= goalSeconds,
      streakGapSeconds: Math.max(0, streakMinSeconds - todaySeconds),
      lessonsToday: countMarkedToday(state, lessons, todayKey, 'completedAt'),
      officialToday: countMarkedToday(state, lessons, todayKey, 'officialCompletedAt'),
      quizToday: countMarkedToday(state, lessons, todayKey, 'quizCompletedAt'),
      badges
    };
  }

  /* ---------- 每周简报（§9） ---------- */
  function weeklyBrief(state, lessons, todayKey) {
    const thisWeek = weekDaysOf(todayKey);
    const lastWeekMonday = shiftDayKey(thisWeek[0], -7);
    const lastWeek = Array.from({ length: 7 }, (_, i) => shiftDayKey(lastWeekMonday, i));
    const daily = state.daily || {};
    const minutesOf = keys => keys.map(key => Math.round((daily[key] || 0) / 60));
    const sum = list => list.reduce((total, value) => total + value, 0);
    const thisWeekMinutes = minutesOf(thisWeek);
    const lastWeekMinutes = minutesOf(lastWeek);
    const thisWeekTotal = sum(thisWeekMinutes);
    const lastWeekTotal = sum(lastWeekMinutes);
    return {
      todayIndexInWeek: thisWeek.indexOf(todayKey),
      weekDays: thisWeek,
      weekDayLabels: ['一', '二', '三', '四', '五', '六', '日'],
      thisWeekMinutes,
      thisWeekTotal,
      lastWeekTotal,
      /* 上周为 0 时不给百分比（避免“无穷大”），只说本周已学了多少 */
      changePct: lastWeekTotal > 0 ? Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100) : null,
      lessonsThisWeek: countMarkedInRange(state, lessons, thisWeek, 'completedAt'),
      quizThisWeek: countMarkedInRange(state, lessons, thisWeek, 'quizCompletedAt')
    };
  }

  /* ---------- 每日目标叶片结算（§8.1：达成一次性奖励，防刷） ----------
   * 幂等闩锁在 economy.awardDailyGoalCoins 的 coinFlags（每天一把钥匙）。
   * 由 progress.js 的保存钩子每次调用：目标未达成时是 0。 */
  function settleDailyGoal(state, todayKey, economyModule) {
    const economy = economyModule || (typeof window !== 'undefined' ? window.ODIN_ECONOMY : null);
    if (!economy) return 0;
    const todaySeconds = (state.daily || {})[todayKey] || 0;
    if (todaySeconds < goalSecondsOf(state)) return 0;
    return economy.awardDailyGoalCoins(state, todayKey);
  }

  function formatMinutes(totalSeconds) {
    const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours) return `${hours} 小时 ${minutes} 分`;
    if (minutes) return `${minutes} 分钟`;
    return `${seconds} 秒`;
  }

  window.ODIN_DAILY = {
    GOAL_CHOICES, DEFAULT_GOAL_MINUTES,
    goalMinutesOf, goalSecondsOf, shiftDayKey, mondayOf, weekDaysOf,
    countMarkedToday, countMarkedInRange,
    dailyBrief, weeklyBrief, settleDailyGoal, formatMinutes
  };
})();
