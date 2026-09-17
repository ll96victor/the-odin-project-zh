/* 每日 / 每周学习系统测试（v4.2 交接 §8、§9、§22 Daily）。
 *
 * 覆盖：
 *   1. 每日简报：目标进度、今日完成数（按时间戳推导）、streak 差距、徽记；
 *   2. 每日目标：五档选择、默认值、非法值回落、持久化、达成一次性叶片防刷、跨日重置；
 *   3. 每周简报：ISO 周（周一开头）、每日分钟、本周/上周累计、环比、本周完成数；
 *   4. 每日目标连续成就（goal-streak-3/7/14）；
 *   5. 时间戳与设置的档案校验（非法值回安全默认）。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const sandbox = { window: {} };
sandbox.window = sandbox;
for (const file of ['lessons.js', 'economy.js', 'collections.js', 'daily.js', 'progress.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox);
}

const progress = sandbox.window.ODIN_PROGRESS;
const economy = sandbox.window.ODIN_ECONOMY;
const daily = sandbox.window.ODIN_DAILY;
const Logic = progress.Logic;
const lessons = JSON.parse(JSON.stringify(sandbox.window.ODIN_GUIDE.lessons));
const lessonIds = lessons.map(lesson => lesson.id);
const fresh = () => Logic.emptyState();
let checks = 0;
const check = label => { checks += 1; return label; };
const DAY = '2026-09-10';   /* 周四 */
const AT = '2026-09-10T09:00:00.000Z';

/* ===================== 1. 每日简报 ===================== */
{
  const state = fresh();
  let brief = daily.dailyBrief(state, lessons, DAY);
  assert.equal(brief.todaySeconds, 0, check('初始今日学习 0'));
  assert.equal(brief.goalMinutes, 20, check('默认每日目标 20 分钟'));
  assert.equal(brief.goalProgress, 0, check('初始进度 0%'));
  assert.equal(brief.goalDone, false, check('初始未达成目标'));
  assert.equal(brief.streakGapSeconds, 600, check('距 streak 达标还差 10 分钟'));
  assert.deepEqual([...brief.badges], [], check('初始无徽记'));
  assert.equal(brief.lessonsToday, 0, check('初始今日完成课程 0'));

  /* 学满 20 分钟：目标达成、徽记变化 */
  Logic.addActiveSeconds(state, null, 20 * 60, DAY);
  brief = daily.dailyBrief(state, lessons, DAY);
  assert.equal(brief.goalDone, true, check('学满 20 分钟目标达成'));
  assert.equal(brief.goalProgress, 100, check('达成后进度 100%'));
  assert.ok([...brief.badges].includes('goal'), check('达成目标获得 goal 徽记'));
  assert.ok(![...brief.badges].includes('half-hour'), check('20 分钟还没有半小时徽记'));
  assert.equal(brief.streakGapSeconds, 0, check('streak 已达标显示 0'));

  /* 超 30 分钟：half-hour 徽记 */
  Logic.addActiveSeconds(state, null, 10 * 60, DAY);
  brief = daily.dailyBrief(state, lessons, DAY);
  assert.ok([...brief.badges].includes('half-hour'), check('30 分钟获得 half-hour 徽记'));
  assert.equal(brief.goalProgress, 100, check('超出目标进度封顶 100%'));

  /* 今天完成一课 + 官方任务 + 自测：时间戳推导的今日计数与徽记 */
  Logic.setLessonFlag(state, lessonIds[0], 'completed', true, AT, Logic.XP_FIRST_LESSON_COMPLETE);
  Logic.setLessonFlag(state, lessonIds[0], 'officialCompleted', true, AT, Logic.XP_FIRST_OFFICIAL_COMPLETE);
  Logic.setLessonFlag(state, lessonIds[1], 'quizCompleted', true, AT, Logic.XP_FIRST_QUIZ_COMPLETE);
  /* 昨天完成的课不算今天 */
  Logic.setLessonFlag(state, lessonIds[2], 'completed', true, '2026-09-09T09:00:00.000Z', Logic.XP_FIRST_LESSON_COMPLETE);
  brief = daily.dailyBrief(state, lessons, DAY);
  assert.equal(brief.lessonsToday, 1, check('今日完成课程 1（昨天的完成不计入）'));
  assert.equal(brief.officialToday, 1, check('今日官方任务 1'));
  assert.equal(brief.quizToday, 1, check('今日自测 1'));
  assert.ok([...brief.badges].includes('lesson'), check('完成一课获得 lesson 徽记'));
  assert.ok([...brief.badges].includes('official'), check('完成官方任务获得 official 徽记'));
  assert.ok([...brief.badges].includes('quiz'), check('完成自测获得 quiz 徽记'));

  /* 撤销今天的完成 → 今日计数回落 */
  Logic.setLessonFlag(state, lessonIds[0], 'completed', false, AT, 0);
  brief = daily.dailyBrief(state, lessons, DAY);
  assert.equal(brief.lessonsToday, 0, check('撤销后今日完成课程回落 0'));
}

/* ===================== 2. 每日目标：设置、叶片、防刷、跨日 ===================== */
{
  const state = fresh();
  /* 非法目标回落默认 */
  assert.equal(daily.goalMinutesOf(fresh()), 20, check('无 settings 时目标回落 20'));
  state.settings.dailyGoalMinutes = 45;
  assert.equal(daily.goalMinutesOf(state), 45, check('45 分钟目标可读取'));
  assert.deepEqual([...daily.GOAL_CHOICES], [10, 20, 30, 45, 60], check('目标五档：10/20/30/45/60'));

  /* 达成目标 → 一次性 +10 叶片，重复结算不重复发 */
  Logic.addActiveSeconds(state, null, 45 * 60, DAY);
  assert.equal(daily.settleDailyGoal(state, DAY, economy), economy.COIN_DAILY_GOAL, check('达成每日目标 +10 叶片'));
  assert.equal(daily.settleDailyGoal(state, DAY, economy), 0, check('同一天重复结算不发放'));
  /* 未达成的另一天不发 */
  assert.equal(daily.settleDailyGoal(state, '2026-09-11', economy), 0, check('未达成的日子不发放'));
  /* 第二天再达成可再发 */
  Logic.addActiveSeconds(state, null, 45 * 60, '2026-09-11');
  assert.equal(daily.settleDailyGoal(state, '2026-09-11', economy), economy.COIN_DAILY_GOAL, check('第二天达成可再发'));
  /* 换目标不影响已发放的闩锁（币不收回也不重发） */
  state.settings.dailyGoalMinutes = 10;
  assert.equal(daily.settleDailyGoal(state, DAY, economy), 0, check('调低目标后同一天仍不重复发放'));
  /* 总账 = 两天的目标奖励 + 学习时长本身的分钟块叶片（90 分钟 = 9 块 × 5） */
  assert.equal(state.coins, economy.COIN_DAILY_GOAL * 2 + 9 * economy.COINS_PER_BLOCK, check('总账正确：两天 +10 与分钟块叶片'));
}

/* ===================== 3. 每周简报 ===================== */
{
  const state = fresh();
  /* 2026-09-10 是周四：本周一为 09-07，周日为 09-13 */
  const brief = daily.weeklyBrief(state, lessons, DAY);
  assert.deepEqual([...brief.weekDays], ['2026-09-07', '2026-09-08', '2026-09-09', '2026-09-10', '2026-09-11', '2026-09-12', '2026-09-13'], check('本周从周一 09-07 开始'));
  assert.equal(brief.todayIndexInWeek, 3, check('周四是本周第 4 天（下标 3）'));
  assert.equal(brief.thisWeekTotal, 0, check('初始本周累计 0'));
  assert.equal(brief.changePct, null, check('上周为 0 时环比为 null，不显示无穷大'));

  /* 本周学两天，上周学一天 */
  state.daily = { '2026-09-09': 1800, '2026-09-10': 900, '2026-08-31': 1800 };
  const week = daily.weeklyBrief(state, lessons, DAY);
  assert.deepEqual([...week.thisWeekMinutes], [0, 0, 30, 15, 0, 0, 0], check('每日分钟数组正确（周二 30 分、周三...实际按日期）'));
  assert.equal(week.thisWeekTotal, 45, check('本周累计 45 分钟'));
  assert.equal(week.lastWeekTotal, 30, check('上周累计 30 分钟（上周一 08-31）'));
  assert.equal(week.changePct, 50, check('环比 +50%'));

  /* 本周完成数：本周内标记的课 / 自测 */
  Logic.setLessonFlag(state, lessonIds[0], 'completed', true, '2026-09-08T09:00:00.000Z', Logic.XP_FIRST_LESSON_COMPLETE);
  Logic.setLessonFlag(state, lessonIds[1], 'completed', true, '2026-09-05T09:00:00.000Z', Logic.XP_FIRST_LESSON_COMPLETE);
  Logic.setLessonFlag(state, lessonIds[2], 'quizCompleted', true, '2026-09-10T09:00:00.000Z', Logic.XP_FIRST_QUIZ_COMPLETE);
  const week2 = daily.weeklyBrief(state, lessons, DAY);
  assert.equal(week2.lessonsThisWeek, 1, check('本周完成课程 1（上周日完成的不计入）'));
  assert.equal(week2.quizThisWeek, 1, check('本周完成自测 1'));

  /* 跨年边界：2027-01-01 是周五，本周一是 2026-12-28 */
  const yearEnd = daily.weeklyBrief(fresh(), lessons, '2027-01-01');
  assert.deepEqual([...yearEnd.weekDays], ['2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02', '2027-01-03'], check('跨年的一周正确跨到上一年'));
}

/* ===================== 4. 每日目标连续成就 ===================== */
{
  /* 连续 3 天达成 20 分钟目标 → goal-streak-3 */
  const state = fresh();
  state.daily = { '2026-09-08': 1200, '2026-09-09': 1200, '2026-09-10': 1200 };
  const unlocked = Logic.evaluateAchievements(state, lessons, AT, DAY);
  assert.ok(unlocked.includes('goal-streak-3'), check('连续 3 天达成每日目标解锁 goal-streak-3'));
  assert.ok(!unlocked.includes('goal-streak-7'), check('3 天不解锁 7 天档'));

  /* 目标档位影响判定：45 分钟目标下，20 分钟的天不算达成 */
  const harder = fresh();
  harder.settings.dailyGoalMinutes = 45;
  harder.daily = { '2026-09-08': 1200, '2026-09-09': 1200, '2026-09-10': 1200 };
  assert.ok(!Logic.evaluateAchievements(harder, lessons, AT, DAY).includes('goal-streak-3'), check('45 分钟目标下 20 分钟的天不算达成'));

  /* 今天未达成不打断昨天为止的连续记录（与 streak 同语义） */
  const yesterdayOnly = fresh();
  yesterdayOnly.daily = { '2026-09-07': 1200, '2026-09-08': 1200, '2026-09-09': 1200 };
  const progress3 = Logic.goalProgress(yesterdayOnly, { kind: 'dailyGoalDays', value: 3 }, lessons, DAY);
  assert.equal(progress3.current, 3, check('今天还没学不打断昨天为止的目标连续记录'));
  assert.equal(progress3.unit, 'days', check('目标连续的单位是天'));
}

/* ===================== 5. 档案校验 ===================== */
{
  const base = {
    schemaVersion: 3, lessons: {}, daily: {}, totalActiveSeconds: 0, xp: 0,
    minuteXpAwarded: 0, rewardFlags: {}, achievements: {}, lastLessonId: null,
    coins: 0, coinMinuteAwarded: 0, coinFlags: {}, cosmetics: { purchases: {}, companionId: 'sprout', themeId: 'garden' }
  };
  const mk = overrides => Logic.parseImport(JSON.stringify(Object.assign({}, base, overrides)), lessonIds);

  let r = mk({});
  assert.equal(r.state.settings.dailyGoalMinutes, 20, check('无 settings 的 v3 档案回落默认目标'));
  r = mk({ settings: { dailyGoalMinutes: 45 } });
  assert.equal(r.state.settings.dailyGoalMinutes, 45, check('合法目标随档案保留'));
  r = mk({ settings: { dailyGoalMinutes: 15 } });
  assert.equal(r.state.settings.dailyGoalMinutes, 20, check('非法档位（15）回落 20'));
  r = mk({ settings: { dailyGoalMinutes: 'lots' } });
  assert.equal(r.state.settings.dailyGoalMinutes, 20, check('非数字目标回落 20'));
  r = mk({ settings: null });
  assert.equal(r.ok, false, check('settings 为 null 拒绝整个档案'));

  /* 新时间戳字段的往返与非法值 */
  r = mk({ lessons: { [lessonIds[0]]: { started: true, completed: true, needsReview: false, officialCompleted: true, quizCompleted: false, activeSeconds: 10, startedAt: AT, lastVisitedAt: AT, completedAt: AT, officialCompletedAt: AT, quizCompletedAt: null } } });
  assert.equal(r.state.lessons[lessonIds[0]].officialCompletedAt, AT, check('官方任务时间戳随档案往返'));
  assert.equal(r.state.lessons[lessonIds[0]].quizCompletedAt, null, check('自测时间戳 null 保留'));
  r = mk({ lessons: { [lessonIds[0]]: { started: true, completed: true, needsReview: false, officialCompleted: true, quizCompleted: false, activeSeconds: 10, startedAt: AT, lastVisitedAt: AT, completedAt: AT, officialCompletedAt: 'not-a-date', quizCompletedAt: null } } });
  assert.equal(r.state.lessons[lessonIds[0]].officialCompletedAt, null, check('非法时间戳回落 null'));

  /* 旧 v2 档案：settings 默认值补齐，不丢任何旧数据 */
  const legacy = { schemaVersion: 2, lessons: {}, daily: {}, totalActiveSeconds: 100, xp: 10, minuteXpAwarded: 1, rewardFlags: {}, achievements: {}, lastLessonId: null };
  const migrated = Logic.parseImport(JSON.stringify(legacy), lessonIds);
  assert.equal(migrated.state.settings.dailyGoalMinutes, 20, check('v2 档案迁移后目标默认 20'));
  assert.equal(migrated.state.lessons[lessonIds[0]] === undefined, true, check('v2 档案没有课记录时不凭空造'));

  /* 导出含 settings */
  const exported = Logic.exportJson(fresh(), AT);
  assert.equal(JSON.parse(exported).settings.dailyGoalMinutes, 20, check('导出含每日目标'));
  assert.equal(Logic.containsSensitiveKey(exported), false, check('导出无敏感键'));
}

console.log(`通过：每日/每周学习系统 ${checks} 项断言（今日简报与徽记、每日目标五档与叶片防刷、ISO 周统计与环比、目标连续成就、档案校验与迁移）。`);
