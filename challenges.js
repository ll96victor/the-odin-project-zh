/* 循环挑战卡（v4.3 交接 D2）。
 *
 * 与循环成就（tiers.js，长期晋升）互补：挑战卡是**按周期刷新的可重复任务**——
 * 每日挑战按自然日刷新，每周挑战按 ISO 周（周一起）刷新；完成后给少量叶片，
 * 不发 XP；错过不惩罚、不扣资源、不掉级。
 *
 * 防重复结算（交接 D2“每个周期最多结算一次”）：
 *   结算奖励走 economy.awardOnce，闩锁 key 内嵌周期标识——
 *   'challenge:daily:<dayKey>' / 'challenge:weekly:<mondayKey>'，
 *   同一自然日 / 同一 ISO 周无论调用多少次都只结算一次，跨周期自动换新钥匙。
 *   不新增任何 counter 字段（交接 O.3：优先从历史推导）。
 *
 * 确定性（非 AI、非随机）：当天的挑战由 dayKey 的字符串哈希从池子里选出，
 * 同一天任何时候打开都是同一张卡；同一周的周挑战同理（用周一日期做 key）。
 *
 * 完成判定全部从既有状态推导：今日/本周有效学习秒数（state.daily）、
 * 今日/本周完成数（每课时间戳，与 daily.js 同口径）、每日目标达成
 * （daily.js 的 goalSecondsOf）。
 *
 * 设计：纯逻辑，不依赖 DOM 与存储；progress.js 在 afterChange 里调用
 * settleChallenges。加载顺序：daily.js 之后、progress.js 之前（HTML 已按此排列）。 */
(() => {
  'use strict';

  const dailyModule = (typeof window !== 'undefined' && window.ODIN_DAILY) || null;

  /* 每日挑战池。目标值都刻意放在“认真学一小段就能完成”的量级：
   * 挑战卡是正反馈，不是第二份 KPI（交接 D2：错过不惩罚）。 */
  const DAILY_POOL = [
    { id: 'daily-20min', zh: '今天学习 20 分钟', desc: '今日有效学习累计满 20 分钟', scope: 'daily', metric: { kind: 'todaySeconds' }, target: 1200, unit: 'seconds', reward: 8 },
    { id: 'daily-lesson', zh: '今天完成 1 课', desc: '今天把任意一课标记为「本课已完成」', scope: 'daily', metric: { kind: 'todayLessons' }, target: 1, unit: 'lessons', reward: 8 },
    { id: 'daily-quiz', zh: '今天完成 1 次自测', desc: '今天把任意一课标记为「本站自测已完成」', scope: 'daily', metric: { kind: 'todayQuiz' }, target: 1, unit: 'lessons', reward: 6 },
    { id: 'daily-goal', zh: '今天达成每日目标', desc: '今日有效学习达到你自己设定的每日目标', scope: 'daily', metric: { kind: 'todayGoal' }, target: 1, unit: 'steps', reward: 6 }
  ];

  /* 每周挑战池（ISO 周，周一起） */
  const WEEKLY_POOL = [
    { id: 'weekly-quiz-3', zh: '本周完成 3 次自测', desc: '本 ISO 周内把 3 课标记为「本站自测已完成」', scope: 'weekly', metric: { kind: 'weekQuiz' }, target: 3, unit: 'lessons', reward: 20 },
    { id: 'weekly-lessons-2', zh: '本周完成 2 课', desc: '本 ISO 周内把 2 课标记为「本课已完成」', scope: 'weekly', metric: { kind: 'weekLessons' }, target: 2, unit: 'lessons', reward: 20 },
    { id: 'weekly-min-150', zh: '本周累计学习 150 分钟', desc: '本 ISO 周有效学习累计满 150 分钟', scope: 'weekly', metric: { kind: 'weekSeconds' }, target: 9000, unit: 'seconds', reward: 25 },
    { id: 'weekly-goal-3', zh: '连续 3 个学习日达标', desc: '连续 3 天每天都学满你设定的每日目标', scope: 'weekly', metric: { kind: 'goalStreak' }, target: 3, unit: 'days', reward: 25 }
  ];

  /* 每月挑战池（v4.3 Batch 9，交接 M2：自然月刷新）。目标值按“每天学一点
   * 就能凑到”的量级设定，仍然是正反馈不是第二份 KPI。 */
  const MONTHLY_POOL = [
    { id: 'monthly-min-1200', zh: '本月累计学习 20 小时', desc: '本自然月有效学习累计满 20 小时', scope: 'monthly', metric: { kind: 'monthSeconds' }, target: 72000, unit: 'seconds', reward: 40 },
    { id: 'monthly-lessons-6', zh: '本月完成 6 课', desc: '本自然月内把 6 课标记为「本课已完成」', scope: 'monthly', metric: { kind: 'monthLessons' }, target: 6, unit: 'lessons', reward: 40 },
    { id: 'monthly-goal-12', zh: '本月 12 天达成每日目标', desc: '本自然月内累计 12 天达成你自己设定的每日目标', scope: 'monthly', metric: { kind: 'monthGoalDays' }, target: 12, unit: 'days', reward: 45 }
  ];

  /* 确定性选择：djb2 字符串哈希。不用 Math.random——同一份档案、同一个
   * 日期，任何时候打开都必须是同一张挑战卡（与小奥同一条“非随机”红线）。 */
  function hashText(text) {
    let hash = 5381;
    const value = String(text || '');
    for (let index = 0; index < value.length; index += 1) {
      hash = ((hash << 5) + hash + value.charCodeAt(index)) >>> 0;
    }
    return hash;
  }

  function challengeOfDay(todayKey) {
    if (!dailyModule || typeof todayKey !== 'string' || !todayKey) return null;
    return DAILY_POOL[hashText(todayKey) % DAILY_POOL.length];
  }

  function challengeOfWeek(mondayKey) {
    if (!dailyModule || typeof mondayKey !== 'string' || !mondayKey) return null;
    return WEEKLY_POOL[hashText(mondayKey) % WEEKLY_POOL.length];
  }

  /* 月挑战：monthKey 形如 '2026-09'（自然月），同样由哈希确定性选出 */
  function challengeOfMonth(monthKey) {
    if (!dailyModule || typeof monthKey !== 'string' || !/^\d{4}-\d{2}$/.test(monthKey)) return null;
    return MONTHLY_POOL[hashText(monthKey) % MONTHLY_POOL.length];
  }

  const monthKeyOf = todayKey => (typeof todayKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(todayKey) ? todayKey.slice(0, 7) : null);

  /* 一个自然月的全部 day key（28–31 天），供 countMarkedInRange 复用周口径 */
  function monthDaysOf(monthKey) {
    const [year, month] = String(monthKey).split('-').map(Number);
    const total = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const days = [];
    for (let day = 1; day <= total; day += 1) days.push(`${monthKey}-${String(day).padStart(2, '0')}`);
    return days;
  }

  function shiftDayKeyLocal(dayKey, delta) {
    const [year, month, day] = String(dayKey).split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day + delta)).toISOString().slice(0, 10);
  }

  /* 当前连续达成每日目标的天数（与 progress.js 的 dailyGoalDays goal 同一语义：
   * 今天没达标时不打断昨天为止的连续记录）。 */
  function goalStreakNow(state, todayKey) {
    if (!dailyModule || typeof todayKey !== 'string' || !todayKey) return 0;
    const goalSeconds = dailyModule.goalSecondsOf(state);
    const reached = key => Number((state.daily || {})[key]) >= goalSeconds;
    let cursor = reached(todayKey) ? todayKey : shiftDayKeyLocal(todayKey, -1);
    let count = 0;
    while (reached(cursor)) {
      count += 1;
      cursor = shiftDayKeyLocal(cursor, -1);
    }
    return count;
  }

  /* 挑战当前进度（从既有状态推导；lessons 用于按课时间戳计数） */
  function challengeProgress(state, challenge, todayKey, lessons) {
    if (!challenge || !dailyModule) return { current: 0, target: challenge ? challenge.target : 0, done: false };
    const monday = dailyModule.mondayOf(todayKey);
    const weekDays = dailyModule.weekDaysOf(todayKey);
    let current = 0;
    switch (challenge.metric.kind) {
      case 'todaySeconds':
        current = Number((state.daily || {})[todayKey]) || 0;
        break;
      case 'todayLessons':
        current = dailyModule.countMarkedToday(state, lessons, todayKey, 'completedAt');
        break;
      case 'todayQuiz':
        current = dailyModule.countMarkedToday(state, lessons, todayKey, 'quizCompletedAt');
        break;
      case 'todayGoal':
        current = (Number((state.daily || {})[todayKey]) || 0) >= dailyModule.goalSecondsOf(state) ? 1 : 0;
        break;
      case 'weekLessons':
        current = dailyModule.countMarkedInRange(state, lessons, weekDays, 'completedAt');
        break;
      case 'weekQuiz':
        current = dailyModule.countMarkedInRange(state, lessons, weekDays, 'quizCompletedAt');
        break;
      case 'weekSeconds':
        current = weekDays.reduce((total, key) => total + (Number((state.daily || {})[key]) || 0), 0);
        break;
      case 'goalStreak':
        current = goalStreakNow(state, todayKey);
        break;
      /* ---------- v4.3 Batch 9（交接 M2）：月度指标 ----------
       * 秒数从 daily 按月前缀求和；完成数复用周口径的 countMarkedInRange
       * （自然月全部 day key）；目标达成天数从 coinFlags 的日闩锁推导——
       * 全部“从历史推导”，不新增 counter（交接 O.3/O.4）。 */
      case 'monthSeconds': {
        const prefix = monthKeyOf(todayKey);
        current = prefix
          ? Object.entries(state.daily || {}).reduce((total, entry) => (String(entry[0]).startsWith(prefix) ? total + (Number(entry[1]) || 0) : total), 0)
          : 0;
        break;
      }
      case 'monthLessons': {
        const prefix = monthKeyOf(todayKey);
        current = prefix ? dailyModule.countMarkedInRange(state, lessons, monthDaysOf(prefix), 'completedAt') : 0;
        break;
      }
      case 'monthGoalDays': {
        const prefix = monthKeyOf(todayKey);
        current = prefix
          ? Object.keys(state.coinFlags || {}).filter(key => key.startsWith(`coin:daily-goal:${prefix}`)).length
          : 0;
        break;
      }
      default:
        current = 0;
    }
    return { current, target: challenge.target, done: current >= challenge.target, weekMonday: monday };
  }

  const flagKeyOf = (challenge, periodKey) => `challenge:${challenge.scope}:${periodKey}`;

  /* UI 一次拿全：今天与本周的挑战卡、进度、结算状态。
   * settled 由 coinFlags 闩锁推导（不新增字段）：本周期已发过奖励即已结算。 */
  function challengesBrief(state, todayKey, lessons) {
    if (!dailyModule || typeof todayKey !== 'string' || !todayKey) return null;
    const monday = dailyModule.mondayOf(todayKey);
    const monthKey = monthKeyOf(todayKey);
    const build = (challenge, periodKey) => {
      if (!challenge) return null;
      const progress = challengeProgress(state, challenge, todayKey, lessons);
      return {
        id: challenge.id,
        zh: challenge.zh,
        desc: challenge.desc,
        scope: challenge.scope,
        unit: challenge.unit,
        reward: challenge.reward,
        periodKey,
        current: Math.min(progress.current, challenge.target),
        rawCurrent: progress.current,
        target: challenge.target,
        done: progress.done,
        settled: Boolean((state.coinFlags || {})[flagKeyOf(challenge, periodKey)])
      };
    };
    return {
      todayKey,
      weekMonday: monday,
      monthKey,
      daily: build(challengeOfDay(todayKey), todayKey),
      weekly: build(challengeOfWeek(monday), monday),
      monthly: build(challengeOfMonth(monthKey), monthKey)
    };
  }

  /* 结算：完成且本周期未结算 → 发叶片（awardOnce 闩锁，每周期最多一次）。
   * 由 progress.js 的 afterChange 调用；返回本次结算的清单（UI / 历史用）。
   * 只发叶片、不发 XP（交接 D2）；错过不结算、不惩罚。 */
  function settleChallenges(state, todayKey, lessons, economyModule) {
    const economy = economyModule || (typeof window !== 'undefined' ? window.ODIN_ECONOMY : null);
    if (!economy || !dailyModule || typeof todayKey !== 'string' || !todayKey) return [];
    const settled = [];
    const monday = dailyModule.mondayOf(todayKey);
    const attempt = (challenge, periodKey) => {
      if (!challenge) return;
      const key = flagKeyOf(challenge, periodKey);
      if (state.coinFlags && state.coinFlags[key]) return;
      const progress = challengeProgress(state, challenge, todayKey, lessons);
      if (!progress.done) return;
      const amount = economy.awardOnce(state, key, challenge.reward);
      if (amount > 0) settled.push({ scope: challenge.scope, id: challenge.id, zh: challenge.zh, amount });
    };
    attempt(challengeOfDay(todayKey), todayKey);
    attempt(challengeOfWeek(monday), monday);
    attempt(challengeOfMonth(monthKeyOf(todayKey)), monthKeyOf(todayKey));
    return settled;
  }

  window.ODIN_CHALLENGES = {
    DAILY_POOL, WEEKLY_POOL, MONTHLY_POOL,
    hashText, challengeOfDay, challengeOfWeek, challengeOfMonth, monthKeyOf, monthDaysOf,
    challengeProgress, challengesBrief, settleChallenges, goalStreakNow, flagKeyOf
  };
})();
