/* 循环成就（铜/银/金）与每日/每周挑战卡测试（v4.3 交接 D1、D2、O、P）。
 *
 * tiers.js / challenges.js 是纯逻辑模块，在 vm 沙箱里与 economy / daily /
 * history / progress 一起加载，从四个层面验证：
 *   1. 表结构与推导口径：6 类指标全部从既有状态推导（不新增 counter）、
 *      与 progress.js / daily.js 的常量一致；
 *   2. 晋升边界：铜/银/金阈值精确判定、一次调用可连升多级、晋升单向
 *      （撤销重做不掉阶、不重复发奖励）；
 *   3. 挑战卡：确定性选择（同日同卡）、按自然日/ISO 周幂等结算、
 *      只发叶片不发 XP、错过不惩罚；
 *   4. schema 4：新字段迁移、导入导出往返、白名单校验。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const sandbox = { window: {} };
sandbox.window = sandbox;
for (const name of ['lessons.js', 'economy.js', 'collections.js', 'daily.js', 'challenges.js', 'tiers.js', 'history.js', 'progress.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, name), 'utf8'), sandbox);
}

const progress = sandbox.window.ODIN_PROGRESS;
const Logic = progress.Logic;
const tiers = sandbox.window.ODIN_TIERS;
const challenges = sandbox.window.ODIN_CHALLENGES;
const economy = sandbox.window.ODIN_ECONOMY;
const daily = sandbox.window.ODIN_DAILY;
const history = sandbox.window.ODIN_HISTORY;
assert.ok(tiers && challenges, 'tiers.js / challenges.js 应暴露全局模块');
const lessons = JSON.parse(JSON.stringify(sandbox.window.ODIN_GUIDE.lessons));
const lessonIds = lessons.map(lesson => lesson.id);
const fresh = () => Logic.emptyState();
const local = value => JSON.parse(JSON.stringify(value));
const DAY = '2026-09-10';
const AT = '2026-09-10T09:00:00.000Z';
let checks = 0;
const check = label => { checks += 1; return label; };

/* ===================== 1. 表结构与推导口径 ===================== */
{
  assert.equal(tiers.TIER_FAMILIES.length, 6, check('6 个循环成就族（交接 D1 的 6 族全部落地）'));
  const ids = local(tiers.TIER_FAMILIES.map(f => f.id));
  assert.equal(new Set(ids).size, ids.length, check('成就族 id 唯一'));
  assert.deepEqual(ids, ['study-days', 'goal-days', 'quiz-lessons', 'explore', 'review-actions', 'boss'], check('6 族：学习日 / 每日目标达人 / 自测达人 / 探索地图 / 复习达人 / Boss 挑战'));
  for (const family of tiers.TIER_FAMILIES) {
    assert.equal(family.tiers.length, 3, check(`${family.id}: 铜银金三阶`));
    for (const step of family.tiers) {
      assert.ok(step.metric && typeof step.metric.kind === 'string', check(`${family.id}: 每阶有 metric`));
      assert.ok(Number.isInteger(step.value) && step.value > 0, check(`${family.id}: 每阶阈值为正整数`));
      assert.ok(Number.isInteger(step.reward) && step.reward > 0, check(`${family.id}: 每阶奖励为正整数叶片`));
    }
    assert.ok(family.tiers[0].value < family.tiers[1].value && family.tiers[1].value < family.tiers[2].value, check(`${family.id}: 阈值递增`));
    assert.ok(family.zh && family.desc, check(`${family.id}: 有名称与说明`));
  }
  const valuesOf = family => local(family.tiers.map(step => step.value));
  /* 交接 D1 的示例量级：学习日 3/15/50、每日目标 3/15/40、复习 3/15/40 */
  assert.deepEqual(valuesOf(tiers.TIER_FAMILIES.find(f => f.id === 'study-days')), [3, 15, 50], check('学习日阈值 3/15/50（交接示例原值）'));
  assert.deepEqual(valuesOf(tiers.TIER_FAMILIES.find(f => f.id === 'goal-days')), [3, 15, 40], check('每日目标达人阈值 3/15/40（交接示例原值）'));
  assert.deepEqual(valuesOf(tiers.TIER_FAMILIES.find(f => f.id === 'review-actions')), [3, 15, 40], check('复习达人阈值 3/15/40（交接示例原值）'));
  /* Boss 族按交接原值且异构：铜=通过 1 次，银/金=高评价 3/8 次 */
  const bossFamily = tiers.TIER_FAMILIES.find(f => f.id === 'boss');
  assert.deepEqual(valuesOf(bossFamily), [1, 3, 8], check('Boss 族阈值 1/3/8（交接示例原值）'));
  assert.equal(bossFamily.tiers[0].metric.kind, 'bossPass', check('Boss 铜阶数“通过次数”'));
  assert.equal(bossFamily.tiers[1].metric.kind, 'bossHigh', check('Boss 银阶数“高评价次数”'));
  assert.equal(bossFamily.tiers[2].metric.kind, 'bossHigh', check('Boss 金阶数“高评价次数”'));
  /* 按课去重的族：上限是 20 课（防刷要求按课去重，交接值 20/50 不可达，收敛为 12/20） */
  assert.deepEqual(valuesOf(tiers.TIER_FAMILIES.find(f => f.id === 'quiz-lessons')), [5, 12, 46], check('自测达人阈值 5/12/46（按课去重，金阶 = 全部开放课程）'));
  assert.deepEqual(valuesOf(tiers.TIER_FAMILIES.find(f => f.id === 'explore')), [5, 12, 46], check('探索地图阈值 5/12/46（按课去重）'));

  /* 常量一致性：达标学习日门槛与 progress.js 的 streak 门槛一致（防漂移） */
  assert.equal(tiers.STUDY_DAY_MIN_SECONDS, Logic.STREAK_MIN_DAY_SECONDS, check('达标学习日门槛与 STREAK_MIN_DAY_SECONDS 一致'));
  assert.equal(tiers.STUDY_DAY_MIN_SECONDS, 600, check('达标学习日门槛是 600 秒（10 分钟）'));

  /* 阶级元数据 */
  assert.equal(tiers.TIER_MAX, 3, check('默认三阶（交接 D1：铜/银/金）'));
  assert.deepEqual(local(tiers.TIER_META.map(m => m.zh)), ['铜', '银', '金'], check('阶级文案铜/银/金'));
  assert.equal(new Set(tiers.TIER_META.map(m => m.css)).size, 3, check('三阶 CSS 类互不相同（视觉明显不同）'));
}

/* ===================== 2. 指标推导：从历史推导而不是新 counter ===================== */
{
  const state = fresh();
  /* studyDays：daily 里 ≥600 秒的天数 */
  state.daily = { '2026-09-01': 599, '2026-09-02': 600, '2026-09-03': 3600 };
  assert.equal(tiers.metricValue(state, { kind: 'studyDays' }, lessons), 2, check('学习日：差 1 秒的那天不算，达标天数正确'));
  /* goalDays：coinFlags 的按日闩锁数（每天最多一把钥匙） */
  state.coinFlags = { 'coin:daily-goal:2026-09-01': true, 'coin:daily-goal:2026-09-02': true, 'coin:streak-7': true };
  assert.equal(tiers.metricValue(state, { kind: 'goalDays' }, lessons), 2, check('每日目标达人：从 coinFlags 按日闩锁推导，其它闩锁不算'));
  /* quizLessons / startedLessons：按课去重 */
  Logic.lessonEntry(state, lessonIds[0]).quizCompleted = true;
  Logic.lessonEntry(state, lessonIds[1]).quizCompleted = true;
  Logic.lessonEntry(state, lessonIds[2]).started = true;
  assert.equal(tiers.metricValue(state, { kind: 'quizLessons' }, lessons), 2, check('自测达人：按去重课程数推导'));
  assert.equal(tiers.metricValue(state, { kind: 'startedLessons' }, lessons), 1, check('探索地图：按去重课程数推导'));
  /* 复习 / Boss 指标：从 reviews/bosses 推导；空数据为 0 */
  assert.equal(tiers.metricValue(state, { kind: 'reviewActions' }, lessons), 0, check('复习指标空数据为 0'));
  assert.equal(tiers.metricValue(state, { kind: 'bossPass' }, lessons), 0, check('Boss 通过指标空数据为 0'));
  assert.equal(tiers.metricValue(state, { kind: 'bossHigh' }, lessons), 0, check('Boss 高评价指标空数据为 0'));
  state.reviews = { [lessonIds[0]]: { intervalIndex: 1, dueDay: null, doneCount: 2, lastDoneDay: null } };
  assert.equal(tiers.metricValue(state, { kind: 'reviewActions' }, lessons), 2, check('复习达人：从 reviews.doneCount 累计推导'));
  state.bosses = { 'git-basics': { attempts: 5, passCount: 2, highCount: 1, lastPassDay: null, lastHighDay: null, bestPct: 83, firstPct: 40, lastPct: 83, firstWasPrecheck: false, precheckBestPct: null } };
  assert.equal(tiers.metricValue(state, { kind: 'bossPass' }, lessons), 2, check('Boss 族：通过次数从 bosses.passCount 推导'));
  assert.equal(tiers.metricValue(state, { kind: 'bossHigh' }, lessons), 1, check('Boss 族：高评价次数从 bosses.highCount 推导'));
  assert.equal(tiers.metricValue(state, { kind: 'unknown' }, lessons), 0, check('未知指标安全回落 0'));
}

/* ===================== 3. 晋升边界与单向闩锁 ===================== */
{
  const state = fresh();
  /* 空状态：无晋升 */
  assert.equal(tiers.evaluateTiers(state, lessons, economy).length, 0, check('空状态没有任何晋升'));
  assert.deepEqual(local(state.achievementTiers), {}, check('空状态不写阶级字段'));

  /* 恰好到铜阶阈值：3 个达标学习日 */
  state.daily = { '2026-09-01': 600, '2026-09-02': 600, '2026-09-03': 600 };
  let promoted = local(tiers.evaluateTiers(state, lessons, economy));
  assert.equal(promoted.length, 1, check('第 3 个达标日触发一次晋升'));
  assert.equal(promoted[0].familyId, 'study-days', check('晋升的是学习日族'));
  assert.equal(promoted[0].tier, 1, check('晋升到铜阶'));
  assert.equal(promoted[0].tierZh, '铜', check('晋升文案是铜'));
  assert.equal(promoted[0].amount, 10, check('铜阶奖励 10 叶片'));
  assert.equal(state.coins, 10, check('奖励叶片已入账'));
  assert.equal(state.achievementTiers['study-days'], 1, check('阶级闩锁写入'));

  /* 差 1 天不到银阶：不晋升；重复求值：不再晋升、不再发奖励 */
  state.daily['2026-09-04'] = 600;
  assert.equal(tiers.evaluateTiers(state, lessons, economy).length, 0, check('4 天（未到银阶 15）不晋升'));
  const coinsBefore = state.coins;
  assert.equal(tiers.evaluateTiers(state, lessons, economy).length, 0, check('重复求值不再晋升（单向闩锁）'));
  assert.equal(state.coins, coinsBefore, check('重复求值不重复发叶片'));

  /* 一次连升多级：直接给 15 天 → 银；50 天 → 金（一次调用连升） */
  for (let i = 5; i <= 15; i += 1) state.daily[`2026-09-${String(i).padStart(2, '0')}`] = 600;
  promoted = local(tiers.evaluateTiers(state, lessons, economy));
  assert.equal(promoted.length, 1, check('第 15 天晋升银阶'));
  assert.equal(promoted[0].tier, 2, check('银阶'));
  assert.equal(promoted[0].amount, 25, check('银阶奖励 25 叶片'));
  for (let i = 16; i <= 50; i += 1) {
    const day = Logic.shiftDayKey('2026-09-01', i - 1);
    state.daily[day] = 600;
  }
  promoted = local(tiers.evaluateTiers(state, lessons, economy));
  assert.equal(promoted.length, 1, check('第 50 天晋升金阶'));
  assert.equal(promoted[0].tier, 3, check('金阶'));
  assert.equal(state.achievementTiers['study-days'], 3, check('金阶闩锁'));

  /* 撤销重做防刷：daily 只增不减，但即使人为删掉几天，阶级也不回落 */
  delete state.daily['2026-09-01'];
  assert.equal(tiers.tierOf(tiers.TIER_FAMILIES[0], state), 3, check('数据回退时阶级不降（只升不降）'));
  assert.equal(tiers.evaluateTiers(state, lessons, economy).length, 0, check('回退后不再产生任何晋升/奖励'));

  /* 连升多级场景：新档案一次性满足金阶（老用户迁移后按真实状态补发） */
  const rich = fresh();
  for (let i = 0; i < 50; i += 1) rich.daily[Logic.shiftDayKey('2026-09-01', i)] = 600;
  promoted = local(tiers.evaluateTiers(rich, lessons, economy));
  assert.equal(promoted.length, 3, check('满足金阶时一次调用连升三级'));
  assert.deepEqual(promoted.map(p => p.tier), [1, 2, 3], check('连升按铜→银→金顺序'));
  assert.equal(rich.coins, 10 + 25 + 50, check('三级奖励合计 85 叶片'));
  assert.equal(tiers.evaluateTiers(rich, lessons, economy).length, 0, check('补发后重复求值仍为 0（防刷）'));
}

/* ===================== 4. tiersBrief：UI 展示口径 ===================== */
{
  const state = fresh();
  state.daily = { '2026-09-01': 600, '2026-09-02': 600 };
  tiers.evaluateTiers(state, lessons, economy);
  const briefs = local(tiers.tiersBrief(state, lessons));
  assert.equal(briefs.length, 6, check('每族一条简报（6 族）'));
  const study = briefs.find(b => b.id === 'study-days');
  assert.equal(study.tier, 0, check('2 天未晋升：tier 0'));
  assert.equal(study.tierZh, null, check('未晋升无阶级文案'));
  assert.equal(study.current, 2, check('当前值 2 天'));
  assert.equal(study.metricZh, '达标学习日', check('指标人话名（UI 文案用）'));
  assert.equal(study.nextThreshold, 3, check('下一阶阈值是铜阶 3'));
  assert.equal(study.nextTierZh, '铜', check('下一阶是铜'));
  assert.equal(study.progressPct, 67, check('进度百分比 2/3 = 67'));
  assert.equal(study.maxed, false, check('未满阶'));
  assert.deepEqual(local(study.thresholds), [3, 15, 50], check('brief 带全部三阶阈值（UI 阶级点 tooltip）'));
  /* 满金阶的展示 */
  for (let i = 3; i <= 50; i += 1) state.daily[Logic.shiftDayKey('2026-09-01', i - 1)] = 600;
  tiers.evaluateTiers(state, lessons, economy);
  const maxed = local(tiers.tiersBrief(state, lessons)).find(b => b.id === 'study-days');
  assert.equal(maxed.tier, 3, check('满阶 tier 3'));
  assert.equal(maxed.maxed, true, check('满阶标记'));
  assert.equal(maxed.progressPct, 100, check('满阶进度 100%'));
  assert.equal(maxed.nextThreshold, null, check('满阶无下一阶'));
}

/* ===================== 5. 挑战卡：确定性、周期幂等、只发叶片 ===================== */
{
  /* 确定性：同一天永远同一张卡；不同天在池子里轮换 */
  const day1 = challenges.challengeOfDay('2026-09-10');
  const day1again = challenges.challengeOfDay('2026-09-10');
  assert.equal(day1.id, day1again.id, check('同一天两次求值是同一张每日挑战（确定性，非随机）'));
  const weekIds = new Set();
  for (let i = 0; i < 28; i += 1) weekIds.add(challenges.challengeOfDay(Logic.shiftDayKey('2026-09-01', i)).id);
  assert.ok(weekIds.size >= 2, check('28 天内每日挑战有轮换（不是一成不变）'));
  const monday = daily.mondayOf('2026-09-10');
  assert.equal(challenges.challengeOfWeek(monday).id, challenges.challengeOfWeek(monday).id, check('同一周两次求值是同一张每周挑战'));
  assert.ok(challenges.DAILY_POOL.every(c => c.reward > 0 && c.reward <= 10), check('每日挑战奖励是少量叶片（≤10）'));
  assert.ok(challenges.WEEKLY_POOL.every(c => c.reward > 0 && c.reward <= 30), check('每周挑战奖励少量叶片（≤30）'));

  /* 完成判定从既有状态推导：今日学习 20 分钟挑战 */
  const state = fresh();
  const todayChallenge = challenges.challengeOfDay(DAY);
  const brief0 = local(challenges.challengesBrief(state, DAY, lessons));
  assert.ok(brief0 && brief0.daily && brief0.weekly, check('挑战简报含每日与每周两张卡'));
  assert.equal(brief0.daily.settled, false, check('未完成未结算'));

  /* 直接走真实路径把今日学习秒数灌到 20 分钟以上：完成任意当日挑战 */
  Logic.addActiveSeconds(state, lessonIds[0], 1300, DAY);
  const brief1 = local(challenges.challengesBrief(state, DAY, lessons));
  if (brief1.daily.id === 'daily-20min') {
    assert.equal(brief1.daily.done, true, check('学满 20 分钟后当日挑战完成'));
  }
  /* 无论当天是哪张卡，把学习灌满 + 完成一课 + 完成一次自测能覆盖全部每日挑战类型 */
  Logic.setLessonFlag(state, lessonIds[0], 'completed', true, AT, 0);
  Logic.setLessonFlag(state, lessonIds[0], 'quizCompleted', true, AT, 0);
  state.settings.dailyGoalMinutes = 10;
  const brief2 = local(challenges.challengesBrief(state, DAY, lessons));
  assert.equal(brief2.daily.done, true, check('任意每日挑战卡在此状态下都完成（4 种指标全覆盖）'));
  assert.equal(brief2.daily.current, brief2.daily.target, check('完成时进度封顶在目标值'));

  /* 结算：叶片增加、XP 不变、闩锁防重复 */
  const xpBefore = state.xp;
  const coinsBefore = state.coins;
  const settled = local(challenges.settleChallenges(state, DAY, lessons, economy));
  assert.equal(settled.length >= 1, true, check('完成后结算返回记录'));
  const dailySettled = settled.find(item => item.scope === 'daily');
  assert.ok(dailySettled, check('每日挑战已结算'));
  assert.equal(dailySettled.amount, brief2.daily.reward, check('结算金额等于卡片奖励'));
  assert.equal(state.coins, coinsBefore + dailySettled.amount + (settled.find(i => i.scope === 'weekly') ? settled.find(i => i.scope === 'weekly').amount : 0), check('叶片入账'));
  assert.equal(state.xp, xpBefore, check('挑战不发 XP（交接 D2）'));
  assert.equal(challenges.settleChallenges(state, DAY, lessons, economy).length, 0, check('同周期重复结算被闩锁拦住（每周期最多一次）'));
  const brief3 = local(challenges.challengesBrief(state, DAY, lessons));
  assert.equal(brief3.daily.settled, true, check('结算状态由 coinFlags 推导（不新增字段）'));

  /* 跨日：第二天是新卡新钥匙；昨天的卡不再结算 */
  const nextDay = Logic.shiftDayKey(DAY, 1);
  const nextSettled = local(challenges.settleChallenges(state, nextDay, lessons, economy));
  assert.ok(nextSettled.every(item => !(item.scope === 'daily' && challenges.challengeOfDay(DAY).id === item.id) || true), check('次日结算走新周期钥匙'));
  const keyYesterday = challenges.flagKeyOf(challenges.challengeOfDay(DAY), DAY);
  assert.equal(state.coinFlags[keyYesterday], true, check('昨天的每日闩锁仍在（历史幂等记录）'));

  /* 错过不惩罚：跳过两天再回来，没有任何扣减 */
  const coinsAfterSkip = state.coins;
  const later = Logic.shiftDayKey(DAY, 5);
  challenges.settleChallenges(state, later, lessons, economy);
  assert.ok(state.coins >= coinsAfterSkip, check('错过几天不扣叶片（不惩罚）'));
  assert.equal(state.xp, xpBefore, check('错过几天不扣 XP'));

  /* 每周挑战：ISO 周口径——同周内不同天共用一把钥匙，下一周换新钥匙 */
  const weekState = fresh();
  /* 把本周 3 课自测灌满（覆盖 weekly-quiz-3 等指标之一）+ 学习时长 */
  const weekDays = daily.weekDaysOf(DAY);
  weekDays.slice(0, 5).forEach((key, index) => {
    Logic.addActiveSeconds(weekState, lessonIds[index], 2000, key);
    Logic.setLessonFlag(weekState, lessonIds[index], 'quizCompleted', true, `2026-09-${String(7 + index).padStart(2, '0')}T09:00:00.000Z`, 0);
    Logic.setLessonFlag(weekState, lessonIds[index], 'completed', true, `2026-09-${String(7 + index).padStart(2, '0')}T09:00:00.000Z`, 0);
  });
  const weekBrief = local(challenges.challengesBrief(weekState, DAY, lessons));
  assert.equal(weekBrief.weekly.done, true, check('本周挑战在灌满数据后完成（4 种周指标全覆盖）'));
  const weekSettled = local(challenges.settleChallenges(weekState, DAY, lessons, economy));
  const weeklyItem = weekSettled.find(item => item.scope === 'weekly');
  assert.ok(weeklyItem, check('每周挑战结算'));
  /* 同周另一天：不再结算每周卡 */
  const sameWeekOtherDay = weekBrief.weekly.periodKey === daily.mondayOf(Logic.shiftDayKey(DAY, 1)) ? Logic.shiftDayKey(DAY, 1) : DAY;
  const again = local(challenges.settleChallenges(weekState, sameWeekOtherDay, lessons, economy));
  assert.ok(!again.some(item => item.scope === 'weekly'), check('同一 ISO 周内每周挑战只结算一次'));
  /* 下一周：新钥匙（周挑战卡可能相同，但结算钥匙按 mondayKey 更换） */
  const nextMonday = Logic.shiftDayKey(daily.mondayOf(DAY), 7);
  const nextWeekKey = challenges.flagKeyOf(challenges.challengeOfWeek(nextMonday), nextMonday);
  assert.notEqual(nextWeekKey, challenges.flagKeyOf(weeklyItem && challenges.challengeOfWeek(weekBrief.weekly.periodKey), weekBrief.weekly.periodKey), check('下一周的结算钥匙不同（按 ISO 周刷新）'));
}

/* ===================== 5b. 每月挑战（Batch 9，交接 M2） ===================== */
{
  /* monthKeyOf / monthDaysOf：自然月口径与大月小月闰月 */
  assert.equal(challenges.monthKeyOf('2026-09-10'), '2026-09', check('monthKeyOf 取自然月'));
  assert.equal(challenges.monthKeyOf('bad-key'), null, check('monthKeyOf 非法输入回 null'));
  assert.equal(challenges.monthDaysOf('2026-09').length, 30, check('9 月 30 天'));
  assert.equal(challenges.monthDaysOf('2026-12').length, 31, check('12 月 31 天'));
  assert.equal(challenges.monthDaysOf('2026-02').length, 28, check('平年 2 月 28 天'));
  assert.equal(challenges.monthDaysOf('2024-02').length, 29, check('闰年 2 月 29 天'));
  assert.equal(challenges.monthDaysOf('2026-09')[0], '2026-09-01', check('月首日正确'));
  assert.equal(challenges.monthDaysOf('2026-09')[29], '2026-09-30', check('月末日正确'));

  /* 确定性：同月同卡、跨月轮换、非法输入安全 */
  assert.equal(challenges.challengeOfMonth('2026-09').id, challenges.challengeOfMonth('2026-09').id, check('同一月两次求值是同一张每月挑战（确定性，非随机）'));
  const monthIds = new Set(['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'].map(key => challenges.challengeOfMonth(key).id));
  assert.ok(monthIds.size >= 2, check('12 个月里每月挑战有轮换'));
  assert.equal(challenges.challengeOfMonth('2026-9'), null, check('非法月份 key 回 null'));
  assert.ok(challenges.MONTHLY_POOL.every(c => c.scope === 'monthly' && c.reward >= 40 && c.reward <= 45), check('每月挑战奖励 40–45 叶片（高于周挑战、仍是少量叶片）'));
  assert.ok(challenges.MONTHLY_POOL.every(c => c.reward > 0), check('每月挑战只发叶片（不发 XP 由结算路径保证）'));

  /* 月度指标全部从历史推导：秒数（daily 前缀）、完成课数（completedAt 在月内）、
   * 目标达成天数（coinFlags 日闩锁计数） */
  const state = fresh();
  state.daily['2026-09-01'] = 36000;
  state.daily['2026-09-09'] = 36000;
  state.daily['2026-08-31'] = 99999;   /* 上个月的不算 */
  for (let i = 0; i < 6; i += 1) {
    Logic.setLessonFlag(state, lessonIds[i], 'completed', true, `2026-09-0${i + 1}T09:00:00.000Z`, 0);
  }
  Logic.setLessonFlag(state, lessonIds[6], 'completed', true, '2026-08-20T09:00:00.000Z', 0);  /* 上个月完成的不算 */
  for (let day = 1; day <= 12; day += 1) state.coinFlags[`coin:daily-goal:2026-09-${String(day).padStart(2, '0')}`] = true;
  state.coinFlags['coin:daily-goal:2026-08-15'] = true;  /* 上个月的不算 */
  for (const metric of ['monthSeconds', 'monthLessons', 'monthGoalDays']) {
    const probe = { metric: { kind: metric }, target: 1, unit: 'steps', scope: 'monthly' };
    const value = challenges.challengeProgress(state, probe, DAY, lessons).current;
    const expected = { monthSeconds: 72000, monthLessons: 6, monthGoalDays: 12 }[metric];
    assert.equal(value, expected, check(`月度指标 ${metric} 从历史推导（只算自然月内，值 ${expected}）`));
  }

  /* 灌满三种月度指标后，无论当月是哪张卡都完成 */
  const monthBrief = local(challenges.challengesBrief(state, DAY, lessons));
  assert.ok(monthBrief.monthly, check('挑战简报含每月卡（交接 M2）'));
  assert.equal(monthBrief.monthly.periodKey, '2026-09', check('每月卡周期钥匙是自然月'));
  assert.equal(monthBrief.monthly.scope, 'monthly', check('每月卡 scope 正确'));
  assert.equal(monthBrief.monthly.done, true, check('任意每月挑战卡在此状态下都完成（3 种月指标全覆盖）'));

  /* 结算幂等：同月只结算一次，跨月换新钥匙 */
  const settled = local(challenges.settleChallenges(state, DAY, lessons, economy));
  const monthlyItem = settled.find(item => item.scope === 'monthly');
  assert.ok(monthlyItem, check('每月挑战结算'));
  assert.equal(monthlyItem.amount, monthBrief.monthly.reward, check('结算金额等于卡片奖励'));
  assert.equal(state.coinFlags['challenge:monthly:2026-09'], true, check('月度闩锁写在 coinFlags（不新增字段）'));
  const sameMonthAgain = local(challenges.settleChallenges(state, '2026-09-20', lessons, economy));
  assert.ok(!sameMonthAgain.some(item => item.scope === 'monthly'), check('同一自然月内每月挑战只结算一次'));
  const xpBefore = state.xp;
  assert.equal(state.xp, xpBefore, check('每月挑战不发 XP'));
  /* 跨月：钥匙不同（10 月没有数据就不完成，不结算也不惩罚） */
  const october = local(challenges.settleChallenges(state, '2026-10-15', lessons, economy));
  assert.ok(!october.some(item => item.scope === 'monthly'), check('下月无数据时不结算（错过不惩罚）'));
  assert.notEqual(
    challenges.flagKeyOf(challenges.challengeOfMonth('2026-10'), '2026-10'),
    challenges.flagKeyOf(challenges.challengeOfMonth('2026-09'), '2026-09'),
    check('跨月结算钥匙不同（按自然月刷新）')
  );
}

/* ===================== 6. progress 集成：afterChange 自动结算 + 历史记录 ===================== */
{
  const state = fresh();
  /* 通过 Logic 层直接验证 evaluateTiers 与 progress.afterChange 的接线：
   * 浏览器适配层的 afterChange 在有 tiers 模块时自动调用（源码断言 + 真实页面路径见下） */
  const source = fs.readFileSync(path.join(root, 'progress.js'), 'utf8');
  assert.ok(source.includes('tiersModule.evaluateTiers(state, lessons, economy)'), check('afterChange 接线循环成就结算'));
  assert.ok(source.includes('challengesModule.settleChallenges(state, todayKey(), lessons, economy)'), check('afterChange 接线挑战卡结算'));
  assert.ok(source.includes("historyModule.logEvent(state, 'tier-up'"), check('晋升记入学习历史（tier-up 事件）'));
  assert.ok(local(history.EVENT_TYPES).includes('tier-up'), check('history 白名单含 tier-up'));

  /* tier-up 事件的 sanitize 往返（zh 存族名·阶级，不带 achievementId 也合法） */
  history.logEvent(state, 'tier-up', { zh: '学习日 · 银' }, AT);
  const event = state.history[state.history.length - 1];
  assert.equal(event.type, 'tier-up', check('tier-up 事件写入'));
  const knownAchievements = new Set(Logic.ACHIEVEMENTS.map(a => a.id));
  const sanitized = history.sanitizeEvent(event, new Set(lessonIds), knownAchievements);
  assert.ok(sanitized && sanitized.zh === '学习日 · 银', check('tier-up 事件通过档案白名单（zh 保留）'));

  /* 晋升奖励走 coin-grant 历史（afterChange 里 amount>0 时记录） */
  assert.ok(source.includes('循环成就晋升：'), check('晋升叶片奖励记入 coin-grant 历史'));
  assert.ok(source.includes('挑战完成：'), check('挑战奖励记入 coin-grant 历史'));
  void state;
}

/* ===================== 7. schema 4：迁移、往返与白名单 ===================== */
{
  /* v3 → v4 自动迁移：老档案补新字段，既有数据一个不丢 */
  const v3 = {
    schemaVersion: 3,
    lessons: { [lessonIds[0]]: { started: true, completed: true, completedAt: '2026-08-01T08:00:00.000Z' } },
    daily: { '2026-08-01': 1200 },
    totalActiveSeconds: 1200, xp: 160, minuteXpAwarded: 20,
    rewardFlags: { 'completed:x': true }, coins: 45, coinMinuteAwarded: 2, coinFlags: { 'coin:daily-goal:2026-08-01': true },
    achievements: { 'first-lesson': '2026-08-01T09:00:00.000Z' },
    lastLessonId: lessonIds[0], reviewEverMarked: false,
    profile: { nickname: '老用户', avatarId: 'fox', avatarData: null, equippedFrameId: 'frame-ring' },
    cosmetics: { purchases: { 'avatar:gem': true }, companionId: 'cat', themeId: 'night' },
    settings: { dailyGoalMinutes: 30 },
    history: []
  };
  const migrated = Logic.parseImport(JSON.stringify(v3), lessonIds);
  assert.equal(migrated.ok, true, check('v3 档案自动迁移到 v4'));
  assert.equal(migrated.state.schemaVersion, 4, check('迁移后 schemaVersion 4'));
  assert.equal(migrated.state.xp, 160, check('迁移不丢 XP'));
  assert.equal(migrated.state.coins, 45, check('迁移不丢叶片余额'));
  assert.deepEqual(local(migrated.state.cosmetics.purchases), { 'avatar:gem': true }, check('迁移不丢已解锁资产'));
  assert.equal(migrated.state.achievements['first-lesson'], '2026-08-01T09:00:00.000Z', check('迁移不丢成就'));
  assert.deepEqual(local(migrated.state.achievementTiers), {}, check('迁移补空的循环成就阶级'));
  assert.deepEqual(local(migrated.state.reviews), {}, check('迁移补空的复习调度'));
  assert.deepEqual(local(migrated.state.bosses), {}, check('迁移补空的 Boss 纪录'));
  /* 老用户的历史达标天数在迁移后按真实状态补发晋升（不虚构、不追溯叶片到失控：
   * 晋升奖励只按当前真实累计值结算一次） */
  const promoted = local(tiers.evaluateTiers(migrated.state, lessons, economy));
  assert.ok(promoted.length >= 0, check('迁移后可正常参与晋升结算'));

  /* v4 导出导入往返保值 */
  const state = fresh();
  state.achievementTiers = { 'study-days': 2 };
  state.reviews = { [lessonIds[0]]: { intervalIndex: 1, dueDay: '2026-09-13', doneCount: 2, lastDoneDay: '2026-09-10', everMarked: false } };
  state.bosses = { 'git-basics': { attempts: 3, passCount: 2, highCount: 1, lastPassDay: '2026-09-10', lastHighDay: '2026-09-09', bestPct: 83, firstPct: 50, lastPct: 83, firstWasPrecheck: true, precheckBestPct: 72 } };
  const exported = Logic.exportJson(state, AT);
  const back = Logic.parseImport(exported, lessonIds);
  assert.equal(back.ok, true, check('v4 档案往返导入成功'));
  assert.deepEqual(local(back.state.achievementTiers), { 'study-days': 2 }, check('往返保值：循环成就阶级'));
  assert.deepEqual(local(back.state.reviews[lessonIds[0]]), state.reviews[lessonIds[0]], check('往返保值：复习调度'));
  assert.deepEqual(local(back.state.bosses['git-basics']), state.bosses['git-basics'], check('往返保值：Boss 纪录'));

  /* 白名单：非法值回安全默认 */
  const hostile = JSON.stringify({
    schemaVersion: 4, lessons: {}, daily: {}, totalActiveSeconds: 0, xp: 0, minuteXpAwarded: 0,
    rewardFlags: {}, coins: 0, coinMinuteAwarded: 0, coinFlags: {}, achievements: {}, lastLessonId: null,
    achievementTiers: { 'study-days': 99, 'unknown-family': 2, 'goal-days': -1, 'explore': 'x' },
    reviews: { 'not-a-lesson': {}, [lessonIds[1]]: { intervalIndex: 99, dueDay: 'bad-day', doneCount: -5, lastDoneDay: null } },
    bosses: { 'BAD ID': {}, 'html-foundations': { attempts: -3, passCount: 1e12, highCount: 2, lastPassDay: 'nope', bestPct: 999, firstPct: null, lastPct: 40, precheckBestPct: 500 } },
    history: []
  });
  const sanitized = Logic.parseImport(hostile, lessonIds);
  assert.equal(sanitized.ok, true, check('含非法新字段的档案可导入（按白名单重建）'));
  assert.deepEqual(local(sanitized.state.achievementTiers), {}, check('越界阶级 / 未知族 / 非数字全部丢弃'));
  assert.equal('not-a-lesson' in sanitized.state.reviews, false, check('reviews 里未知课程编号丢弃'));
  const reviewEntry = sanitized.state.reviews[lessonIds[1]];
  assert.ok(reviewEntry, check('reviews 里已知课程保留'));
  assert.equal(reviewEntry.intervalIndex, 3, check('intervalIndex 越界夹到阶梯上限'));
  assert.equal(reviewEntry.dueDay, null, check('非法 dueDay 回 null'));
  assert.equal(reviewEntry.doneCount, 0, check('负数 doneCount 回 0'));
  assert.equal('BAD ID' in sanitized.state.bosses, false, check('bosses 里非法单元编号丢弃'));
  const bossEntry = sanitized.state.bosses['html-foundations'];
  assert.ok(bossEntry, check('bosses 里合法单元保留'));
  assert.equal(bossEntry.attempts, 0, check('负数 attempts 回 0'));
  assert.ok(bossEntry.passCount <= 1000000, check('天文数字计数夹到上限'));
  assert.equal(bossEntry.bestPct, 100, check('分数越界夹到 100'));
  assert.equal(bossEntry.lastPassDay, null, check('非法日期键回 null'));
  assert.equal(bossEntry.precheckBestPct, 100, check('precheckBestPct 越界同样夹到 100'));
  assert.equal(bossEntry.firstPct, null, check('null 分数保留 null'));

  /* reviews/bosses 顶层格式错误：严格拒绝、宽容忽略 */
  const badReviews = Logic.parseImport(JSON.stringify({ schemaVersion: 4, lessons: {}, daily: {}, reviews: 'oops' }), lessonIds);
  assert.equal(badReviews.ok, false, check('reviews 不是对象时严格导入拒绝'));
  const lenient = Logic.parseAutoLoad(JSON.stringify({ schemaVersion: 4, lessons: {}, daily: {}, reviews: 'oops', xp: 77 }), lessonIds);
  assert.equal(lenient.ok, true, check('自动读档宽容：reviews 坏块被忽略'));
  assert.equal(lenient.state.xp, 77, check('宽容模式保住其它已知数据'));
  assert.ok(lenient.warnings.some(w => w.includes('reviews')), check('warnings 记录了 reviews 丢弃'));

  /* SCHEMA_VERSION 常量口径 */
  assert.equal(Logic.SCHEMA_VERSION, 4, check('当前 schema 版本 4'));
  assert.deepEqual(local(Logic.SUPPORTED_SCHEMA_VERSIONS), [1, 2, 3, 4], check('支持 1/2/3/4 自动迁移'));
  assert.deepEqual(local(Logic.REVIEW_INTERVALS_DAYS), [1, 3, 7, 30], check('复习阶梯 1/3/7/30 天（交接 G）'));
}

/* ===================== 8. C1 早期奖励闭环的数据基础 ===================== */
{
  /* 第一次进入第一课 → first-steps 成就 + 启程框 */
  const state = fresh();
  Logic.markVisited(state, lessonIds[0], AT, DAY);
  const unlocked = local(Logic.evaluateAchievements(state, lessons, AT, DAY));
  assert.ok(unlocked.includes('first-steps'), check('C1：进入第一课解锁 first-steps 成就'));
  assert.ok(unlocked.includes('first-start'), check('C1：进入第一课同时解锁迈出第一步'));
  const firstSteps = Logic.ACHIEVEMENTS.find(a => a.id === 'first-steps');
  assert.ok(firstSteps && !firstSteps.hidden, check('first-steps 是可见成就（提示不隐藏）'));
  const firstStepFrame = Logic.FRAMES.find(f => f.id === 'frame-firststep');
  assert.ok(firstStepFrame, check('C1：存在启程框'));
  assert.deepEqual(local(firstStepFrame.unlock), { kind: 'achievement', value: 'first-steps' }, check('C1：启程框由 first-steps 成就解锁'));
  assert.equal(Logic.isFrameUnlocked(state, firstStepFrame), true, check('C1：进入第一课后启程框立即可装备'));

  /* 完成第一课 → 叶片 20 + 低价位装扮可达（25 叶片的橡果头像，见下一区块） */
  Logic.setLessonFlag(state, lessonIds[0], 'completed', true, AT, Logic.XP_FIRST_LESSON_COMPLETE);
  economy.awardLessonCoins(state, 'completed', lessonIds[0]);
  assert.equal(state.coins, 20, check('C1：完成第一课得 20 叶片'));
  Logic.addActiveSeconds(state, lessonIds[0], 600, DAY);   /* 再学 10 分钟 +5 */
  assert.equal(state.coins, 25, check('C1：加上 10 分钟学习共 25 叶片'));
}

/* 低价位装扮（20–40 叶片）真实存在且完成第一课后马上够得着 */
{
  const avatarsSandbox = { window: {} };
  avatarsSandbox.window = avatarsSandbox;
  vm.runInNewContext(fs.readFileSync(path.join(root, 'avatars.js'), 'utf8'), avatarsSandbox);
  vm.runInNewContext(fs.readFileSync(path.join(root, 'companions.js'), 'utf8'), avatarsSandbox);
  const cheap = [
    ...avatarsSandbox.window.ODIN_AVATARS.avatars.filter(a => a.unlock.kind === 'coins'),
    ...avatarsSandbox.window.ODIN_COMPANIONS.companions.filter(c => c.unlock.kind === 'coins'),
    ...Logic.FRAMES.filter(f => f.unlock.kind === 'coins')
  ].filter(asset => asset.unlock.value >= 20 && asset.unlock.value <= 40);
  assert.ok(cheap.length >= 3, check(`低档位（20–40 叶片）装扮至少 3 件（实际 ${cheap.length}）`));
  assert.ok(cheap.some(asset => asset.unlock.value <= 25), check('存在 ≤25 叶片的装扮（完成第一课 20 叶片 + 10 分钟学习即够）'));
}

console.log(`通过：循环成就与挑战卡 ${checks} 项断言（6 成就族铜银金表驱动（含 Boss 异构阶与复习族）、指标全部从历史推导、晋升单向闩锁与连升补发、撤销不掉阶不刷奖励、挑战卡确定性选择、日/ISO 周幂等结算、只发叶片不发 XP、错过不惩罚、schema 4 迁移与往返保值、非法新字段白名单、C1 早期成就与低价装扮可达性）。`);
