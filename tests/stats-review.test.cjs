/* 学习统计（热力图/个人最佳/每课耗时）与轻量复习系统测试（v4.3 交接 F1-F3、G、P）。
 *
 * stats.js 与 progress.js 的复习调度都是纯函数推导。覆盖：
 *   1. F1 热力图：17 周结构、固定强度档位边界、今日/未来日、跨月跨年闰年、空态；
 *   2. F2 个人最佳：当前/历史最长连续（与 progress.streakOf 口径一致）、
 *      单日最高、近 7/30 天、累计学习天数、本周 vs 上周；
 *   3. F3 每课耗时：Top N 排序、0 时长不计入；
 *   4. G 复习系统：勾选联动开始调度、1/3/7/30 阶梯推进、同日幂等、
 *      最后一级完成自动清除复习标记、仍不熟回最短间隔、取消勾选停止调度、
 *      到期清单与“今天有 N 课建议复习”、review-done 历史事件、
 *      复习达人循环成就联动、地图已精通状态联动、逾期不惩罚；
 *   5. 浏览器适配层全链路（vm 沙箱 + localStorage 桩）。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const sandbox = { window: {} };
sandbox.window = sandbox;
for (const name of ['lessons.js', 'catalog.js', 'bosses.js', 'map.js', 'economy.js', 'collections.js', 'daily.js', 'stats.js', 'challenges.js', 'tiers.js', 'history.js', 'progress.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, name), 'utf8'), sandbox);
}
const progress = sandbox.window.ODIN_PROGRESS;
const Logic = progress.Logic;
const stats = sandbox.window.ODIN_STATS;
const mapModule = sandbox.window.ODIN_MAP;
const tiers = sandbox.window.ODIN_TIERS;
const daily = sandbox.window.ODIN_DAILY;
assert.ok(stats, 'stats.js 应暴露 ODIN_STATS');
const lessons = JSON.parse(JSON.stringify(sandbox.window.ODIN_GUIDE.lessons));
const lessonIds = lessons.map(lesson => lesson.id);
const fresh = () => Logic.emptyState();
const local = value => JSON.parse(JSON.stringify(value));
const DAY = '2026-09-10';
const AT = '2026-09-10T09:00:00.000Z';
let checks = 0;
const check = label => { checks += 1; return label; };

/* ===================== 1. F1 热力图 ===================== */
{
  /* 强度档位边界（固定档位：<15 / 15-30 / 30-60 / ≥60 分钟） */
  assert.equal(stats.levelOfSeconds(0), 0, check('0 秒是 level 0'));
  assert.equal(stats.levelOfSeconds(-5), 0, check('负数安全回落 level 0'));
  assert.equal(stats.levelOfSeconds(1), 1, check('1 秒进入 level 1'));
  assert.equal(stats.levelOfSeconds(899), 1, check('差 1 秒到 15 分钟仍是 level 1'));
  assert.equal(stats.levelOfSeconds(900), 2, check('15 分钟压线 level 2'));
  assert.equal(stats.levelOfSeconds(1799), 2, check('差 1 秒到 30 分钟是 level 2'));
  assert.equal(stats.levelOfSeconds(1800), 3, check('30 分钟压线 level 3'));
  assert.equal(stats.levelOfSeconds(3599), 3, check('差 1 秒到 60 分钟是 level 3'));
  assert.equal(stats.levelOfSeconds(3600), 4, check('60 分钟压线 level 4'));
  assert.equal(stats.levelOfSeconds(86400), 4, check('一整天也是 level 4（封顶）'));

  /* 17 周结构：17 列 × 7 行，最后一列含今天 */
  const state = fresh();
  state.daily = { [DAY]: 1800, [Logic.shiftDayKey(DAY, -1)]: 600, [Logic.shiftDayKey(DAY, -120)]: 7200 };
  const heat = stats.heatmapWeeks(state, DAY, 17);
  assert.equal(heat.weeks, 17, check('默认 17 周'));
  assert.equal(heat.columns.length, 17, check('17 列'));
  assert.ok(heat.columns.every(week => week.days.length === 7), check('每列 7 天'));
  const allDays = heat.columns.flatMap(week => week.days);
  assert.equal(allDays.length, 119, check('17×7=119 格'));
  const todayCell = allDays.find(day => day.isToday);
  assert.ok(todayCell && todayCell.dayKey === DAY, check('今天有且只有一格标记 isToday'));
  assert.equal(allDays.filter(day => day.isToday).length, 1, check('isToday 恰好一格'));
  assert.equal(todayCell.level, 3, check('今天 1800 秒 → level 3'));
  assert.ok(allDays.some(day => day.isFuture), check('本周未到的日子标 isFuture'));
  assert.ok(allDays.filter(day => day.isFuture).every(day => day.level === 0), check('未来日不显示强度'));
  /* 窗口外的老数据不计入 */
  assert.equal(heat.studiedDays, 2, check('120 天前的记录不在 17 周窗口内（studiedDays=2）'));
  assert.equal(heat.totalSeconds, 2400, check('窗口总秒数只含窗口内'));
  /* 每列从周一起 */
  heat.columns.forEach(week => {
    assert.equal(daily.mondayOf(week.days[0].dayKey), week.days[0].dayKey, check('每列第一天是周一'));
    assert.equal(week.monday, week.days[0].dayKey, check('列的 monday 与首日一致'));
  });
  /* 月标签：变化处标注，其余为 null；首个非空 */
  assert.ok(heat.monthLabels.length === 17, check('月标签与列数一致'));
  assert.ok(heat.monthLabels[0] !== null, check('第一列总有月标签'));
  assert.ok(heat.monthLabels.filter(Boolean).length >= 3, check('17 周窗口至少跨 3 个个月份标签（约 4 个月）'));

  /* 跨年：以 2027-01-05（周二）为今天，窗口应含 2026 年 12 月 */
  const newYear = stats.heatmapWeeks(fresh(), '2027-01-05', 17);
  const newYearDays = newYear.columns.flatMap(week => week.days.map(day => day.dayKey));
  assert.ok(newYearDays.some(key => key.startsWith('2026-12')), check('跨年窗口正确包含上一年 12 月'));
  assert.ok(newYearDays.includes('2027-01-05'), check('跨年窗口包含今天'));

  /* 闰年：2024-02-29 前后连续 */
  const leap = stats.heatmapWeeks(fresh(), '2024-03-03', 4);
  const leapDays = leap.columns.flatMap(week => week.days.map(day => day.dayKey));
  assert.ok(leapDays.includes('2024-02-29'), check('闰年窗口包含 2 月 29 日'));
  const leapIndex = leapDays.indexOf('2024-02-29');
  assert.equal(leapDays[leapIndex + 1], '2024-03-01', check('闰日次日衔接 3 月 1 日'));
  assert.equal(leapDays[leapIndex - 1], '2024-02-28', check('闰日前一天是 2 月 28 日'));

  /* 空数据：isEmpty 与 0 统计 */
  const empty = stats.heatmapWeeks(fresh(), DAY, 17);
  assert.equal(empty.isEmpty, true, check('无记录时 isEmpty=true（UI 给空态提示）'));
  assert.equal(empty.studiedDays, 0, check('空态 studiedDays 0'));
  assert.equal(empty.totalSeconds, 0, check('空态 totalSeconds 0'));
  assert.equal(stats.heatmapWeeks(fresh(), DAY, 0).weeks, 17, check('非法周数回落默认 17'));
  assert.ok(stats.heatmapWeeks(fresh(), DAY, 999).weeks <= 104, check('超大周数夹到上限（防 UI 爆炸）'));
}

/* ===================== 2. F2 个人最佳 ===================== */
{
  const state = fresh();
  /* 构造：一段 5 天连续（历史最长）、一段 3 天连续（含今天，当前）、一个单日纪录 */
  for (let i = 0; i < 5; i += 1) state.daily[Logic.shiftDayKey('2026-08-01', i)] = 700;
  for (let i = 0; i < 3; i += 1) state.daily[Logic.shiftDayKey(DAY, -i)] = 1300;
  state.daily['2026-08-03'] = 9000;   /* 单日最高 2.5 小时 */
  const bests = stats.personalBests(state, DAY);
  assert.equal(bests.currentStreak, 3, check('当前连续 3 天'));
  assert.equal(bests.currentStreak, Logic.streakOf(state, DAY), check('当前连续与 progress.streakOf 口径一致'));
  assert.equal(bests.longestStreakDays, 5, check('历史最长连续 5 天'));
  assert.equal(bests.longestStreakEndDay, '2026-08-05', check('最长连续的结束日期'));
  assert.equal(bests.bestDaySeconds, 9000, check('单日最高 9000 秒'));
  assert.equal(bests.bestDayKey, '2026-08-03', check('单日最高的日期'));
  assert.equal(bests.totalStudyDays, 8, check('累计学习天数 = 达标日总数（8 月 5 天 + 9 月 3 天）'));
  assert.equal(bests.last7Seconds, 1300 * 3, check('近 7 天只含最近 3 天的记录'));
  assert.ok(bests.last30Seconds >= 1300 * 3, check('近 30 天包含近 7 天'));
  assert.equal(bests.last30Seconds, 1300 * 3, check('近 30 天窗口不含 8 月初的记录（距 9-10 超过 30 天）'));
  /* 本周 vs 上周：今天周四（2026-09-10），本周一 09-07 */
  assert.equal(bests.thisWeekSeconds >= 1300, true, check('本周累计含今天'));
  assert.equal(bests.weekChangePct === null || Number.isFinite(bests.weekChangePct), true, check('环比是数字或 null（上周为 0）'));

  /* 今天没达标时当前连续不断（与 streakOf 同语义） */
  const noToday = fresh();
  noToday.daily[Logic.shiftDayKey(DAY, -1)] = 700;
  noToday.daily[Logic.shiftDayKey(DAY, -2)] = 700;
  assert.equal(stats.streakAt(noToday, DAY), 2, check('今天未达标不打断昨天为止的连续'));
  /* 最长连续跨过今天未达标的断点 */
  assert.equal(stats.longestStreak(noToday).days, 2, check('最长连续取历史最长段'));

  /* 空档案全 0 */
  const emptyBests = stats.personalBests(fresh(), DAY);
  assert.equal(emptyBests.currentStreak, 0, check('空档案当前连续 0'));
  assert.equal(emptyBests.longestStreakDays, 0, check('空档案最长连续 0'));
  assert.equal(emptyBests.bestDayKey, null, check('空档案无单日纪录'));
  assert.equal(emptyBests.weekChangePct, null, check('空档案上周为 0 不给百分比'));

  /* 常量一致性 */
  assert.equal(stats.STUDY_DAY_MIN_SECONDS, Logic.STREAK_MIN_DAY_SECONDS, check('达标日门槛与 progress.js 一致'));
}

/* ===================== 3. F3 每课耗时 ===================== */
{
  const state = fresh();
  Logic.lessonEntry(state, lessonIds[0]).activeSeconds = 3600;
  Logic.lessonEntry(state, lessonIds[1]).activeSeconds = 900;
  Logic.lessonEntry(state, lessonIds[2]).activeSeconds = 7200;
  Logic.lessonEntry(state, lessonIds[3]).activeSeconds = 0;      /* 0 时长不计入 */
  const times = stats.lessonTimes(state, lessons, 5);
  assert.equal(times.top.length, 3, check('只统计有时长的课'));
  assert.equal(times.top[0].lessonId, lessonIds[2], check('Top1 是最耗时的课'));
  assert.equal(times.top[0].seconds, 7200, check('Top1 时长正确'));
  assert.equal(times.top[1].lessonId, lessonIds[0], check('Top2 排序正确'));
  assert.ok(times.top[0].zh && times.top[0].title, check('排行带课程中英文名'));
  assert.equal(times.timedLessonCount, 3, check('记录过时长的课程数'));
  assert.equal(times.totalSeconds, 3600 + 900 + 7200, check('总时长求和'));
  assert.equal(stats.lessonTimes(fresh(), lessons, 5).top.length, 0, check('空档案 Top 为空（UI 给空态）'));
  /* limit 生效 */
  assert.equal(stats.lessonTimes(state, lessons, 2).top.length, 2, check('limit 截断生效'));
}

/* ===================== 4. G 复习系统：阶梯、幂等、联动 ===================== */
{
  const state = fresh();
  const id = lessonIds[0];

  /* 勾选「需要复习」→ 开始调度：due = 明天（第 1 级间隔 1 天） */
  Logic.setLessonFlag(state, id, 'needsReview', true, AT, 0);
  let schedule = state.reviews[id];
  assert.ok(schedule, check('勾选需要复习后建立复习安排'));
  assert.equal(schedule.everMarked, true, check('everMarked 记录这一课经历过复习周期'));
  assert.equal(schedule.intervalIndex, 0, check('从第 1 级间隔开始'));
  assert.equal(schedule.dueDay, '2026-09-11', check('下次复习 = 明天（间隔 1 天）'));
  assert.equal(schedule.doneCount, 0, check('还没完成过复习'));

  /* 到期清单：明天还没到期 → 今天 0 课；到明天 → 1 课 */
  assert.equal(Logic.reviewsDue(state, DAY).length, 0, check('还没到期不进今日清单'));
  assert.equal(Logic.reviewsDue(state, '2026-09-11').length, 1, check('到期日进今日清单（今天有 1 课建议复习）'));
  const dueItem = Logic.reviewsDue(state, '2026-09-11')[0];
  assert.equal(dueItem.lessonId, id, check('到期项带课程 id'));
  assert.equal(dueItem.overdueDays, 0, check('当天到期 overdue 0'));

  /* 完成复习：推进到第 2 级（3 天后） */
  let result = Logic.completeReview(state, id, '2026-09-11', '2026-09-11T09:00:00.000Z');
  assert.equal(result.ok, true, check('完成复习成功'));
  assert.equal(result.repeated, false, check('首次完成不是重复'));
  schedule = result.entry;
  assert.equal(schedule.intervalIndex, 1, check('阶梯推进到第 2 级'));
  assert.equal(schedule.dueDay, '2026-09-14', check('下次复习 = 3 天后'));
  assert.equal(schedule.doneCount, 1, check('复习完成次数 +1'));

  /* 同日重复调用幂等：doneCount 与阶梯都不动 */
  result = Logic.completeReview(state, id, '2026-09-11', '2026-09-11T20:00:00.000Z');
  assert.equal(result.ok, true, check('同日重复调用仍返回 ok'));
  assert.equal(result.repeated, true, check('同日重复被标记 repeated'));
  assert.equal(result.entry.doneCount, 1, check('同日重复不加 doneCount（幂等）'));
  assert.equal(result.entry.intervalIndex, 1, check('同日重复不推进阶梯'));

  /* 复习达人循环成就指标 = doneCount 累计 */
  assert.equal(tiers.metricValue(state, { kind: 'reviewActions' }, lessons), 1, check('复习达人指标从 doneCount 推导'));

  /* 走完阶梯：3 天后（9-14）完成 → 7 天后（9-21）→ 30 天后（10-21）完成 → 周期结束 */
  result = Logic.completeReview(state, id, '2026-09-14', '2026-09-14T09:00:00.000Z');
  assert.equal(result.entry.intervalIndex, 2, check('第 2 次完成推进到第 3 级'));
  assert.equal(result.entry.dueDay, '2026-09-21', check('下次复习 = 7 天后'));
  result = Logic.completeReview(state, id, '2026-09-21', '2026-09-21T09:00:00.000Z');
  assert.equal(result.entry.intervalIndex, 3, check('第 3 次完成推进到最后一级（30 天档）'));
  assert.equal(result.entry.dueDay, '2026-10-21', check('下次复习 = 30 天后'));
  result = Logic.completeReview(state, id, '2026-10-21', '2026-10-21T09:00:00.000Z');
  assert.equal(result.finished, true, check('最后一级完成：复习周期结束'));
  assert.equal(result.entry.dueDay, null, check('周期结束后不再排期'));
  assert.equal(result.entry.doneCount, 4, check('完整周期共 4 次复习（1/3/7/30 各一次）'));
  /* needsReview 自动清除 + review-clear 历史 */
  assert.equal(state.lessons[id].needsReview, false, check('阶梯走完自动清除复习标记'));
  assert.ok(state.history.some(event => event.type === 'review-done'), check('完成复习记入历史（review-done）'));
  assert.ok(state.history.filter(event => event.type === 'review-clear').length >= 1, check('自动清除也记 review-clear 历史'));
  /* 地图状态联动：击破 + 复习周期完成 → 已精通 */
  Logic.setLessonFlag(state, id, 'started', true, AT, 0);
  Logic.setLessonFlag(state, id, 'completed', true, AT, 0);
  Logic.setLessonFlag(state, id, 'officialCompleted', true, AT, 0);
  Logic.setLessonFlag(state, id, 'quizCompleted', true, AT, 0);
  const nodeStatus = mapModule.lessonNodeStatus({
    available: true, hasLesson: true,
    entry: state.lessons[id], review: state.reviews[id]
  });
  assert.equal(nodeStatus, 'mastered', check('击破 + 复习周期完成：地图显示已精通'));

  /* 「仍不熟」：回到最短间隔，doneCount 不加 */
  const id2 = lessonIds[1];
  Logic.setLessonFlag(state, id2, 'needsReview', true, '2026-09-11T09:00:00.000Z', 0);
  Logic.completeReview(state, id2, '2026-09-12', '2026-09-12T09:00:00.000Z');
  assert.equal(state.reviews[id2].intervalIndex, 1, check('第二课推进到第 2 级'));
  const weak = Logic.markStillWeak(state, id2, '2026-09-15');
  assert.equal(weak.ok, true, check('仍不熟成功'));
  assert.equal(weak.entry.intervalIndex, 0, check('仍不熟回到第 1 级'));
  assert.equal(weak.entry.dueDay, '2026-09-16', check('仍不熟后明天再复习'));
  assert.equal(weak.entry.doneCount, 1, check('仍不熟不加 doneCount'));

  /* 取消勾选 needsReview：停止调度但历史保留 */
  Logic.setLessonFlag(state, id2, 'needsReview', false, '2026-09-15T10:00:00.000Z', 0);
  assert.equal(state.reviews[id2].dueDay, null, check('取消勾选后停止调度（dueDay 清空）'));
  assert.equal(state.reviews[id2].doneCount, 1, check('复习历史保留（复习达人成就进度不回退）'));
  assert.equal(state.reviews[id2].everMarked, true, check('everMarked 保留'));
  assert.equal(Logic.reviewsDue(state, '2026-09-16').length, 0, check('停止调度后不再出现在到期清单'));

  /* 重新勾选：重新开始阶梯（回到第 1 级） */
  Logic.setLessonFlag(state, id2, 'needsReview', true, '2026-09-20T09:00:00.000Z', 0);
  assert.equal(state.reviews[id2].intervalIndex, 0, check('重新勾选回到第 1 级间隔'));
  assert.equal(state.reviews[id2].dueDay, '2026-09-21', check('重新勾选排期到明天'));
  assert.equal(state.reviews[id2].doneCount, 1, check('doneCount 不清零（累计口径）'));

  /* 没有复习安排的课不能“完成复习” */
  const noSchedule = Logic.completeReview(state, lessonIds[5], DAY, AT);
  assert.equal(noSchedule.ok, false, check('没有复习安排的课完成复习被拒'));
  assert.match(noSchedule.error, /先勾选/, check('拒绝原因指引先勾选需要复习'));

  /* 逾期不惩罚：过期 30 天也只是排在清单里，没有任何扣减 */
  const overdue = Logic.reviewsDue(state, '2026-12-01');
  assert.ok(overdue.length >= 1, check('逾期课仍在到期清单（不消失不惩罚）'));
  assert.ok(overdue[0].overdueDays > 0, check('逾期天数如实显示'));
  const coinsBefore = state.coins;
  const xpBefore = state.xp;
  Logic.completeReview(state, overdue[0].lessonId, '2026-12-01', '2026-12-01T09:00:00.000Z');
  assert.equal(state.coins, coinsBefore, check('逾期复习不扣叶片'));
  assert.equal(state.xp, xpBefore, check('逾期复习不扣 XP'));

  /* nextReviewDue：未来最近的一课 */
  const nextState = fresh();
  Logic.setLessonFlag(nextState, lessonIds[0], 'needsReview', true, AT, 0);
  Logic.setLessonFlag(nextState, lessonIds[1], 'needsReview', true, AT, 0);
  nextState.reviews[lessonIds[1]].dueDay = '2026-09-20';
  nextState.reviews[lessonIds[0]].dueDay = '2026-09-30';
  const next = Logic.nextReviewDue(nextState, '2026-09-12');
  assert.equal(next.lessonId, lessonIds[1], check('nextReviewDue 给最近的未来到期课'));
  assert.equal(Logic.nextReviewDue(nextState, '2026-10-01'), null, check('全部已过期时 nextReviewDue 为 null'));

  /* reviewUpcoming（Batch 9，交接 M20 复习日历的数据层） */
  const upState = fresh();
  for (let i = 0; i < 5; i += 1) Logic.setLessonFlag(upState, lessonIds[i], 'needsReview', true, AT, 0);
  upState.reviews[lessonIds[0]].dueDay = '2026-09-20';
  upState.reviews[lessonIds[1]].dueDay = '2026-09-15';
  upState.reviews[lessonIds[2]].dueDay = '2026-10-01';
  upState.reviews[lessonIds[3]].dueDay = null;   /* 已暂停调度 */
  upState.reviews[lessonIds[4]].dueDay = DAY;    /* 今天到期：归 reviewsDue 管 */
  const upcoming = Logic.reviewUpcoming(upState, DAY, 14);
  assert.equal(upcoming.length, 3, check('reviewUpcoming 只列未来的课（暂停与今天到期的不算）'));
  assert.deepEqual(local(upcoming.map(item => item.dueDay)), ['2026-09-15', '2026-09-20', '2026-10-01'], check('按到期日升序'));
  assert.equal(upcoming[0].lessonId, lessonIds[1], check('排序后第一条是最近的一课'));
  assert.ok(Number.isInteger(upcoming[0].intervalIndex), check('每条带轮次信息'));
  assert.equal(Logic.reviewUpcoming(upState, DAY, 2).length, 2, check('limit 截断生效'));
  assert.deepEqual(local(Logic.reviewUpcoming(upState, 'bad-day', 14)), [], check('非法日期回空数组'));
  assert.deepEqual(local(Logic.reviewUpcoming(fresh(), DAY, 14)), [], check('空档案回空数组'));
  assert.equal(Logic.reviewUpcoming(upState, DAY, 0).length, 3, check('limit 非法时回落默认（不截成 0 条）'));
}

/* ===================== 5. summary / 小奥提示联动 ===================== */
{
  const state = fresh();
  Logic.setLessonFlag(state, lessonIds[0], 'needsReview', true, AT, 0);
  /* 今天到期：把 dueDay 拨回今天（模拟第 2 天） */
  const summaryToday = Logic.summary(state, lessons, '2026-09-11');
  assert.equal(summaryToday.reviewDueToday, 1, check('summary：今天有 1 课建议复习'));
  assert.equal(summaryToday.needsReviewCount, 1, check('summary：需要复习计数并存'));
  const summaryTomorrow = Logic.summary(state, lessons, DAY);
  assert.equal(summaryTomorrow.reviewDueToday, 0, check('summary：没到期时今日建议复习为 0'));

  /* 小奥提示优先级：review-due 在 finish-current 之后、review-pending 之前 */
  const state2 = fresh();
  state2.daily[DAY] = 700;   /* 今天已达标（跳过 today-short） */
  Logic.setLessonFlag(state2, lessonIds[0], 'needsReview', true, AT, 0);
  Logic.setLessonFlag(state2, lessonIds[1], 'needsReview', true, AT, 0);
  state2.reviews[lessonIds[0]].dueDay = DAY;       /* 1 课今天到期 */
  state2.reviews[lessonIds[1]].dueDay = '2026-09-20';
  const brief = Logic.assistantBrief(state2, lessons, DAY, {});
  assert.equal(brief.reviewDueToday, 1, check('assistantBrief 带 reviewDueToday'));
  assert.equal(brief.tip.kind, 'review-due', check('今天有到期复习时提示 review-due'));
  assert.ok(brief.tip.text.includes('1 课'), check('review-due 文案给出课数'));
  assert.ok(brief.tip.text.includes('不扣'), check('review-due 文案明确逾期不惩罚'));
  /* 没有到期课时回落 review-pending（到期清单含逾期课，因此用未到期的独立档案验证） */
  const state3 = fresh();
  state3.daily[DAY] = 700;
  Logic.setLessonFlag(state3, lessonIds[0], 'needsReview', true, AT, 0);
  state3.reviews[lessonIds[0]].dueDay = '2026-09-20';
  const brief2 = Logic.assistantBrief(state3, lessons, DAY, {});
  assert.equal(brief2.reviewDueToday, 0, check('没有到期复习时 reviewDueToday 为 0'));
  assert.equal(brief2.tip.kind, 'review-pending', check('没有到期复习时提示回落 review-pending'));
  assert.ok(local(Logic.ASSISTANT_TIP_KINDS).includes('review-due'), check('review-due 在提示枚举里'));
}

/* ===================== 6. 浏览器适配层全链路 + schema 往返 ===================== */
{
  const storage = (() => {
    const map = new Map();
    return {
      setItem: (key, value) => map.set(String(key), String(value)),
      getItem: key => (map.has(String(key)) ? map.get(String(key)) : null),
      removeItem: key => map.delete(String(key)),
      key: index => [...map.keys()][index],
      get length() { return map.size; }
    };
  })();
  const pageSandbox = {
    window: {},
    location: { protocol: 'http:', href: 'http://127.0.0.1:8765/index.html' },
    document: { addEventListener() {}, visibilityState: 'visible', body: { append() {} } },
    setInterval: () => 0, setTimeout: () => 0, addEventListener() {},
    Date, JSON, console
  };
  pageSandbox.window = pageSandbox;
  pageSandbox.window.localStorage = storage;
  for (const name of ['lessons.js', 'catalog.js', 'bosses.js', 'map.js', 'economy.js', 'collections.js', 'daily.js', 'stats.js', 'challenges.js', 'tiers.js', 'history.js', 'progress.js']) {
    vm.runInNewContext(fs.readFileSync(path.join(root, name), 'utf8'), pageSandbox);
  }
  const page = pageSandbox.window.ODIN_PROGRESS;

  /* 勾选 → 完成复习 → 持久化 → 重载后调度仍在。
   * 注意：setNeedsReview 作用于 startTimer 锁定的当前课（适配层口径）。 */
  page.startTimer(lessonIds[0]);
  page.setNeedsReview(true);
  assert.ok(page.reviewSchedule(lessonIds[0]), check('适配层：勾选后复习安排可查'));
  assert.equal(page.reviewDueList().length, 0, check('适配层：今天还没到期'));
  /* 直接推进日期不可行（todayKey 用系统时间），改为验证调度数据已持久化 */
  const stored = JSON.parse(storage.getItem('the-odin-project-zh.progress.v1'));
  assert.ok(stored.reviews[lessonIds[0]], check('复习安排已写入存储'));
  assert.equal(stored.reviews[lessonIds[0]].everMarked, true, check('存储里的 everMarked 正确'));

  /* 导出导入往返保值 */
  const exported = page.exportArchive();
  const back = Logic.parseImport(exported, lessonIds);
  assert.equal(back.ok, true, check('含复习安排的档案可导入'));
  assert.deepEqual(local(back.state.reviews[lessonIds[0]]), local(page.reviewSchedule(lessonIds[0])), check('复习安排往返保值'));

  /* 复习间隔常量 */
  assert.deepEqual(local(page.reviewIntervalDays()), [1, 3, 7, 30], check('复习阶梯 1/3/7/30 天（交接 G）'));
}

/* ===================== 7. Batch 10（Stretch N1/N4/N5/N11/N12） ===================== */
{
  /* N1：近 30 天一致率（uhabits habit strength 的可解释简化版） */
  const state = fresh();
  for (let i = 0; i < 15; i += 1) state.daily[Logic.shiftDayKey(DAY, -i)] = 700;   /* 近 15 天全达标 */
  state.daily[Logic.shiftDayKey(DAY, -40)] = 700;                                    /* 30 天窗口外 */
  const bests = stats.personalBests(state, DAY);
  assert.equal(bests.last30StudyDays, 15, check('一致率只数近 30 天窗口内的达标日'));
  assert.equal(bests.consistencyPct, 50, check('15/30 天 → 一致率 50%'));
  const full = fresh();
  for (let i = 0; i < 30; i += 1) full.daily[Logic.shiftDayKey(DAY, -i)] = 700;
  assert.equal(stats.personalBests(full, DAY).consistencyPct, 100, check('30 天全达标 → 100%'));
  const emptyBests = stats.personalBests(fresh(), DAY);
  assert.equal(emptyBests.consistencyPct, 0, check('空档案一致率 0%'));
  assert.equal(emptyBests.last30StudyDays, 0, check('空档案窗口达标日 0'));

  /* N4：今天之前的单日最高（个人纪录刷新提示的数据源） */
  const prev = stats.bestDayBefore(state, DAY);
  assert.equal(prev.seconds, 700, check('bestDayBefore 取历史最高秒数'));
  assert.equal(prev.dayKey, Logic.shiftDayKey(DAY, -1), check('bestDayBefore 给对应日期'));
  assert.equal(stats.bestDayBefore(fresh(), DAY), null, check('无历史记录回 null（第一天不提示破纪录）'));
  const onlyToday = fresh();
  onlyToday.daily[DAY] = 5000;
  assert.equal(stats.bestDayBefore(onlyToday, DAY), null, check('今天不计入“此前纪录”'));

  /* N11/N12：summaryMarkdown 拼装（纯函数，字符串进字符串出） */
  const md = stats.summaryMarkdown({
    title: 'T', generatedDay: DAY, intro: 'I',
    overview: ['a', 'b'], bests: ['c'], week: ['w1'],
    heatLine: 'h', heatWeeks: 17, times: ['t1', 't2'],
    tiers: ['g1'], history: ['hi'], footer: 'F'
  });
  assert.ok(md.startsWith('# T（2026-09-10）'), check('Markdown 以标题与日期开头'));
  assert.ok(md.includes('## 总览') && md.includes('- a') && md.includes('- b'), check('总览节渲染为列表'));
  assert.ok(md.includes('## 本周总结') && md.includes('- w1'), check('本周总结节（N12）'));
  assert.ok(md.includes('## 近 17 周') && md.includes('h'), check('热力图汇总行'));
  assert.ok(md.includes('## 最花时间的 5 课') && md.includes('1. t1') && md.includes('2. t2'), check('耗时排行是有序列表'));
  assert.ok(md.includes('- hi'), check('历史节渲染'));
  assert.ok(md.endsWith('F'), check('footer 收尾'));
  const md2 = stats.summaryMarkdown({ generatedDay: DAY, overview: ['x'] });
  assert.ok(!md2.includes('## 本周总结'), check('空节不渲染标题'));
  assert.ok(!md2.includes('undefined') && !md2.includes('null'), check('无 undefined/null 泄漏'));
  assert.ok(typeof stats.summaryMarkdown({}).length === 'number' && stats.summaryMarkdown({}).includes('#'), check('空入参安全（仍有标题骨架）'));

  /* N5：masteredCount 指标与地图 mastered 状态同一口径 */
  const mState = fresh();
  const id = lessonIds[0];
  ['started', 'completed', 'officialCompleted', 'quizCompleted'].forEach(flag => Logic.setLessonFlag(mState, id, flag, true, AT, 0));
  Logic.setLessonFlag(mState, id, 'needsReview', true, AT, 0);
  Logic.setLessonFlag(mState, id, 'needsReview', false, AT, 0);
  const gp = Logic.goalProgress(mState, { kind: 'masteredCount', value: 3 }, lessons, DAY);
  assert.equal(gp.current, 1, check('走过复习周期并清空的击破课计入 masteredCount'));
  assert.equal(gp.unit, 'lessons', check('masteredCount 单位是课'));
  assert.equal(
    mapModule.lessonNodeStatus({ available: true, hasLesson: true, entry: mState.lessons[id], review: mState.reviews[id] }),
    'mastered',
    check('同一课在地图上是已精通（两口径一致）')
  );
  const id2 = lessonIds[1];
  ['started', 'completed', 'officialCompleted', 'quizCompleted'].forEach(flag => Logic.setLessonFlag(mState, id2, flag, true, AT, 0));
  assert.equal(Logic.goalProgress(mState, { kind: 'masteredCount', value: 3 }, lessons, DAY).current, 1, check('没走过复习周期的击破课不算精通'));

  /* N5：precheckUnits 指标、阈值与 bosses.js 一致、隐藏成就行为 */
  const pState = fresh();
  pState.bosses = {
    introduction: { attempts: 1, passCount: 1, highCount: 1, lastPassDay: null, lastHighDay: null, bestPct: 90, firstPct: 90, lastPct: 90, firstWasPrecheck: true, precheckBestPct: 70 },
    prerequisites: { attempts: 1, passCount: 0, highCount: 0, lastPassDay: null, lastHighDay: null, bestPct: 40, firstPct: 40, lastPct: 40, firstWasPrecheck: true, precheckBestPct: 40 }
  };
  const gp2 = Logic.goalProgress(pState, { kind: 'precheckUnits', value: 2 }, lessons, DAY);
  assert.equal(gp2.current, 1, check('预检 70% 压线计入、40% 不计入'));
  assert.equal(gp2.unit, 'items', check('precheckUnits 单位是个'));
  assert.equal(Logic.PRECHECK_HIGH_PCT, sandbox.window.ODIN_BOSSES.HIGH_PCT, check('预检高评价线与 bosses.js HIGH_PCT 一致（防漂移）'));
  const visible = Logic.nextVisibleGoals(pState, lessons, DAY, 99);
  assert.ok(!visible.some(g => g.id === 'precheck-master' || g.id === 'mastered-3'), check('隐藏成就不出现在可见目标提示里'));
  pState.bosses['git-basics'] = { attempts: 1, passCount: 1, highCount: 1, lastPassDay: null, lastHighDay: null, bestPct: 80, firstPct: 80, lastPct: 80, firstWasPrecheck: true, precheckBestPct: 80 };
  Logic.evaluateAchievements(pState, lessons, AT, DAY);
  assert.ok(pState.achievements['precheck-master'], check('2 个单元预检 ≥70% 解锁隐藏成就「未战先达」'));
  assert.ok(!pState.achievements['mastered-3'], check('没有 3 课精通时「精通的滋味」不解锁'));
}

console.log(`通过：学习统计与复习系统 ${checks} 项断言（热力图 17 周结构/固定档位边界/今日与未来日/跨月跨年闰年/空态；个人最佳当前与历史最长连续/单日纪录/近 7 与 30 天/本周环比且与 streakOf 口径一致；每课耗时 Top N 与 0 时长排除；复习 1/3/7/30 阶梯推进/同日幂等/走完自动清除标记/仍不熟回退/取消停止调度/逾期不惩罚/复习达人与地图精通联动；summary 与小奥 review-due 提示；适配层持久化与往返保值；Batch 10：近 30 天一致率/bestDayBefore 纪录对比/summaryMarkdown 拼装与空节安全/masteredCount 与地图口径一致/precheckUnits 阈值与 bosses.js 一致/隐藏成就解锁与不提示）。`);
