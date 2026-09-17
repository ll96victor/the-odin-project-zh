/* 叶片经济系统测试（v4.2 交接 §3、§20、§22 Economy）。
 *
 * economy.js 是纯逻辑模块；progress.js 在状态变更点调用它。这里把两个文件
 * 一起装进 vm 沙箱，从两个层面验证：
 *   1. economy 纯函数：规则、幂等、防刷、消费、余额不为负；
 *   2. progress 集成：勾选/计时的真实路径上叶片正确发放，XP 与叶片互不影响；
 *   3. 迁移：v1/v2 旧档案不追溯补发，v3 导出导入往返保值。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const sandbox = { window: {} };
sandbox.window = sandbox;
vm.runInNewContext(fs.readFileSync(path.join(root, 'lessons.js'), 'utf8'), sandbox);
vm.runInNewContext(fs.readFileSync(path.join(root, 'economy.js'), 'utf8'), sandbox);
vm.runInNewContext(fs.readFileSync(path.join(root, 'progress.js'), 'utf8'), sandbox);

const progress = sandbox.window.ODIN_PROGRESS;
const economy = sandbox.window.ODIN_ECONOMY;
assert.ok(progress && progress.Logic, 'progress.js 应暴露 ODIN_PROGRESS');
assert.ok(economy, 'economy.js 应暴露 ODIN_ECONOMY');
const Logic = progress.Logic;
const lessons = JSON.parse(JSON.stringify(sandbox.window.ODIN_GUIDE.lessons));
const lessonIds = lessons.map(lesson => lesson.id);
const fresh = () => Logic.emptyState();
let checks = 0;
const check = label => { checks += 1; return label; };
/* 沙箱数组与本 realm 数组因 Array.prototype 不同会让 deepStrictEqual 误判失败，
 * 比较前先复制到当前 realm（progress.test.cjs 已知坑）。 */
const local = value => JSON.parse(JSON.stringify(value));

/* ---------- 1. 规则表 ---------- */
{
  assert.equal(economy.COIN_RULES.length, 7, check('规则表共 7 条'));
  const ids = local(economy.COIN_RULES.map(rule => rule.id));
  assert.deepEqual(ids, ['minute-block', 'first-lesson', 'first-official', 'first-quiz', 'read-complete', 'daily-goal', 'streak-7'],
    check('规则表 id 唯一且稳定（specs 与 UI 引用它们）；v4.5 交接 Core F 新增 read-complete'));
  assert.ok(economy.COIN_RULES.every(rule => rule.amount > 0 && rule.zh && rule.desc), check('每条规则有正数金额与中文说明'));
  assert.equal(economy.MINUTE_BLOCK_SECONDS, 600, check('分钟块为 10 分钟'));
  assert.equal(economy.COINS_PER_BLOCK, 5, check('每块 +5 叶片'));
}

/* ---------- 2. 分钟叶片：幂等、按累计量结算 ---------- */
{
  const state = fresh();
  assert.equal(state.coins, 0, check('初始余额 0'));
  economy.awardMinuteCoins(state);
  assert.equal(state.coins, 0, check('无学习时长不发放'));
  state.totalActiveSeconds = 599;
  assert.equal(economy.awardMinuteCoins(state), 0, check('不足 10 分钟不发放'));
  state.totalActiveSeconds = 600;
  assert.equal(economy.awardMinuteCoins(state), 5, check('满 10 分钟 +5'));
  assert.equal(economy.awardMinuteCoins(state), 0, check('重复结算不重复发放'));
  state.totalActiveSeconds = 1199;
  assert.equal(economy.awardMinuteCoins(state), 0, check('不足下一块不发放'));
  state.totalActiveSeconds = 1200;
  assert.equal(economy.awardMinuteCoins(state), 5, check('满第二块再 +5'));
  assert.equal(state.coins, 10, check('累计余额 10'));
  assert.equal(state.coinMinuteAwarded, 2, check('块计数器对齐'));
}

/* ---------- 3. 完成类一次性叶片：每课一次，撤销重勾不刷 ---------- */
{
  const state = fresh();
  const id = lessonIds[0];
  assert.equal(economy.awardLessonCoins(state, 'completed', id), economy.COIN_FIRST_LESSON, check('首次完成一课 +20'));
  assert.equal(economy.awardLessonCoins(state, 'completed', id), 0, check('同一课重复完成不再发'));
  assert.equal(economy.awardLessonCoins(state, 'officialCompleted', id), economy.COIN_FIRST_OFFICIAL, check('首次官方任务 +10'));
  assert.equal(economy.awardLessonCoins(state, 'quizCompleted', id), economy.COIN_FIRST_QUIZ, check('首次自测 +5'));
  assert.equal(economy.awardLessonCoins(state, 'needsReview', id), 0, check('标记需要复习不发叶片'));
  assert.equal(state.coins, economy.COIN_FIRST_LESSON + economy.COIN_FIRST_OFFICIAL + economy.COIN_FIRST_QUIZ,
    check('三类一次性奖励合计 35'));
  /* 撤销后重勾：闩锁仍在，不再发放 */
  Logic.setLessonFlag(state, id, 'completed', false, '2026-09-10T09:10:00.000Z', Logic.XP_FIRST_LESSON_COMPLETE);
  Logic.setLessonFlag(state, id, 'completed', true, '2026-09-10T09:11:00.000Z', Logic.XP_FIRST_LESSON_COMPLETE);
  assert.equal(state.coins, 35, check('撤销重勾无法刷叶片'));
  /* 第二课独立计费 */
  const other = lessonIds[1];
  economy.awardLessonCoins(state, 'completed', other);
  assert.equal(state.coins, 35 + economy.COIN_FIRST_LESSON, check('另一课首次完成独立 +20'));
}

/* ---------- 4. streak 一次性 +100 ---------- */
{
  const state = fresh();
  assert.equal(economy.settleStreakCoins(state, '2026-09-10', 6), 0, check('streak 6 天不发放'));
  assert.equal(economy.settleStreakCoins(state, '2026-09-10', 7), economy.COIN_STREAK_7, check('streak 7 天 +100'));
  assert.equal(economy.settleStreakCoins(state, '2026-09-10', 8), 0, check('streak 8 天不再重复发放'));
  assert.equal(economy.settleStreakCoins(state, '2026-09-20', 7), 0, check('跨周期再次 7 天仍不重复（终身一次）'));
  assert.equal(state.coins, economy.COIN_STREAK_7, check('余额只有一次 100'));
}

/* ---------- 5. 每日目标：每天最多一次 ---------- */
{
  const state = fresh();
  assert.equal(economy.awardDailyGoalCoins(state, '2026-09-10'), economy.COIN_DAILY_GOAL, check('达成每日目标 +10'));
  assert.equal(economy.awardDailyGoalCoins(state, '2026-09-10'), 0, check('同一天重复结算不发放'));
  assert.equal(economy.awardDailyGoalCoins(state, '2026-09-11'), economy.COIN_DAILY_GOAL, check('第二天可再发'));
}

/* ---------- 6. 消费：余额不可为负 ---------- */
{
  const state = fresh();
  state.coins = 50;
  assert.equal(economy.spendCoins(state, -5).ok, false, check('负数消费被拒绝'));
  assert.equal(economy.spendCoins(state, 0).ok, false, check('0 消费被拒绝'));
  assert.equal(economy.spendCoins(state, 51).ok, false, check('超额消费被拒绝'));
  assert.equal(state.coins, 50, check('失败消费不扣款'));
  const result = economy.spendCoins(state, 20);
  assert.equal(result.ok, true, check('足额消费成功'));
  assert.equal(result.coins, 30, check('消费后余额正确'));
  assert.equal(state.coins, 30, check('状态余额同步'));
  economy.spendCoins(state, 30);
  assert.equal(state.coins, 0, check('恰好花完余额为 0'));
}

/* ---------- 7. XP 与叶片分离 ---------- */
{
  const state = fresh();
  const id = lessonIds[0];
  Logic.setLessonFlag(state, id, 'completed', true, '2026-09-10T09:00:00.000Z', Logic.XP_FIRST_LESSON_COMPLETE);
  assert.equal(state.xp, 40, check('完成一课照常 +40 XP'));
  assert.equal(state.coins, economy.COIN_FIRST_LESSON, check('完成一课 +20 叶片'));
  assert.equal(state.coinFlags['completed:' + id], undefined, check('叶片闩锁不污染 XP 的 rewardFlags'));
  assert.equal(state.rewardFlags['coin:completed:' + id], undefined, check('XP 闩锁不污染叶片的 coinFlags'));
  Logic.addActiveSeconds(state, id, 600, '2026-09-10');
  assert.equal(state.totalActiveSeconds, 600, check('10 分钟有效学习入账'));
  assert.equal(state.xp, 50, check('每分钟 XP 照常（10 分钟 +10 XP）'));
  assert.equal(state.coins, economy.COIN_FIRST_LESSON + economy.COINS_PER_BLOCK, check('每 10 分钟 +5 叶片'));
  /* 消费叶片不影响 XP 与等级（等级由 XP 决定，与叶片余额无关）。
   * v4.5 非线性曲线下 50 XP = Lv.2，故不断言具体等级值，只断言消费前后不变。 */
  const levelBefore = Logic.levelOf(state.xp);
  state.coins = 100;
  economy.spendCoins(state, 100);
  assert.equal(state.xp, 50, check('花光叶片后 XP 不变'));
  assert.equal(Logic.levelOf(state.xp), levelBefore, check('花光叶片后等级不变（等级只由 XP 决定）'));
  /* summary 同源 */
  assert.equal(Logic.summary(state, lessons, '2026-09-10').coins, 0, check('summary().coins 与余额一致'));
}

/* ---------- 8. 旧档案迁移：不追溯补发 ---------- */
{
  /* v2 档案：已完成 2 课 + 官方任务 + 10 小时学习 */
  const legacy = {
    schemaVersion: 2,
    lessons: {
      [lessonIds[0]]: { started: true, completed: true, needsReview: false, officialCompleted: true, quizCompleted: false, activeSeconds: 1000, startedAt: '2026-08-01T09:00:00.000Z', lastVisitedAt: '2026-08-01T09:00:00.000Z', completedAt: '2026-08-01T10:00:00.000Z' },
      [lessonIds[1]]: { started: true, completed: true, needsReview: false, officialCompleted: false, quizCompleted: true, activeSeconds: 500, startedAt: '2026-08-02T09:00:00.000Z', lastVisitedAt: '2026-08-02T09:00:00.000Z', completedAt: '2026-08-02T10:00:00.000Z' }
    },
    daily: { '2026-08-01': 36000 },
    totalActiveSeconds: 36000,
    xp: 500,
    minuteXpAwarded: 600,
    rewardFlags: {},
    achievements: { 'first-lesson': '2026-08-01T10:00:00.000Z' },
    lastLessonId: lessonIds[1],
    profile: { nickname: '老用户', avatarId: 'terminal', avatarData: null, equippedFrameId: 'frame-basic' },
    reviewEverMarked: false
  };
  const imported = Logic.parseImport(JSON.stringify(legacy), lessonIds);
  assert.equal(imported.ok, true, check('v2 档案可导入并迁移到 v3'));
  const state = imported.state;
  assert.equal(state.schemaVersion, 4, check('迁移后 schemaVersion 为 4'));
  assert.equal(state.xp, 500, check('XP 一个不丢'));
  assert.equal(state.coins, 0, check('历史学习不追溯补发叶片（余额从 0 开始）'));
  assert.equal(state.coinMinuteAwarded, 60, check('已累计 10 小时对齐 60 个分钟块（旧时长不铸币）'));
  assert.equal(state.coinFlags[economy.flagKey('completed', lessonIds[0])], true, check('历史完成已闩锁，重勾不刷'));
  assert.equal(state.coinFlags[economy.flagKey('officialCompleted', lessonIds[0])], true, check('历史官方任务已闩锁'));
  assert.equal(state.coinFlags[economy.flagKey('quizCompleted', lessonIds[1])], true, check('历史自测已闩锁'));

  /* 迁移后的新行为正常获得叶片 */
  Logic.setLessonFlag(state, lessonIds[2], 'completed', true, '2026-09-10T09:00:00.000Z', Logic.XP_FIRST_LESSON_COMPLETE);
  assert.equal(state.coins, economy.COIN_FIRST_LESSON, check('迁移后新完成一课正常 +20'));
  state.totalActiveSeconds = 36600;
  economy.awardMinuteCoins(state);
  assert.equal(state.coins, economy.COIN_FIRST_LESSON + economy.COINS_PER_BLOCK, check('迁移后新学满 10 分钟正常 +5'));

  /* v1 档案同样迁移 */
  const v1 = { schemaVersion: 1, lessons: {}, daily: {}, totalActiveSeconds: 0, xp: 0, minuteXpAwarded: 0, rewardFlags: {}, achievements: {}, lastLessonId: null };
  const v1Imported = Logic.parseImport(JSON.stringify(v1), lessonIds);
  assert.equal(v1Imported.ok, true, check('v1 档案可导入'));
  assert.equal(v1Imported.state.schemaVersion, 4, check('v1 迁移后 schemaVersion 为 4'));
  assert.equal(v1Imported.state.coins, 0, check('v1 迁移余额 0'));
}

/* ---------- 9. v3 导出导入往返：叶片保值 ---------- */
{
  const state = fresh();
  const id = lessonIds[0];
  Logic.setLessonFlag(state, id, 'completed', true, '2026-09-10T09:00:00.000Z', Logic.XP_FIRST_LESSON_COMPLETE);
  state.totalActiveSeconds = 1300;
  Logic.addActiveSeconds(state, id, 1, '2026-09-10');
  const exported = Logic.exportJson(state, '2026-09-10T12:00:00.000Z');
  const parsed = JSON.parse(exported);
  assert.equal(parsed.coins, state.coins, check('导出含叶片余额'));
  assert.equal(parsed.coinMinuteAwarded, state.coinMinuteAwarded, check('导出含分钟块计数'));
  assert.ok(parsed.coinFlags, check('导出含叶片闩锁'));
  const reimported = Logic.parseImport(exported, lessonIds);
  assert.equal(reimported.ok, true, check('v3 档案可再导入'));
  assert.equal(reimported.state.coins, state.coins, check('往返后余额一致'));
  assert.equal(reimported.state.coinMinuteAwarded, state.coinMinuteAwarded, check('往返后块计数一致'));
  assert.deepEqual(reimported.state.coinFlags, state.coinFlags, check('往返后闩锁一致'));
  /* 同版导入后再结算：不重复发放 */
  economy.awardLessonCoins(reimported.state, 'completed', id);
  assert.equal(reimported.state.coins, state.coins, check('同版导入后不重复发放一次性叶片'));
}

/* ---------- 10. 档案校验：非法叶片字段回安全值 ---------- */
{
  const base = {
    schemaVersion: 3, lessons: {}, daily: {}, totalActiveSeconds: 100, xp: 0,
    minuteXpAwarded: 0, rewardFlags: {}, achievements: {}, lastLessonId: null,
    coins: 0, coinMinuteAwarded: 0, coinFlags: {}
  };
  const mk = overrides => Logic.parseImport(JSON.stringify(Object.assign({}, base, overrides)), lessonIds);

  let r = mk({ coins: -50 });
  assert.ok(r.ok, check('负余额档案可导入'));
  assert.equal(r.state.coins, 0, check('负余额回 0'));
  r = mk({ coins: 'abc' });
  assert.ok(r.ok, check('非数字余额可导入'));
  assert.equal(r.state.coins, 0, check('非数字余额回 0'));
  r = mk({ coins: 1e12 });
  assert.equal(r.state.coins, economy.COINS_MAX, check('天文数字余额夹到上限'));
  /* coinMinuteAwarded 大于已赚块数：夹回已赚块数，防手改档案追溯铸币 */
  r = mk({ coinMinuteAwarded: 999 });
  assert.equal(r.state.coinMinuteAwarded, 0, check('虚高的块计数夹回已赚块数'));
  r = mk({ coinMinuteAwarded: -5 });
  assert.equal(r.state.coinMinuteAwarded, 0, check('负块计数回 0'));
  r = mk({ coinFlags: { 'coin:completed:x': true, 'bad': 'yes' } });
  assert.ok(r.ok, check('coinFlags 可导入'));
  assert.equal(r.state.coinFlags['coin:completed:x'], true, check('true 闩锁保留'));
  assert.equal(r.state.coinFlags.bad, undefined, check('非布尔 true 的闩锁丢弃'));
  r = mk({ coinFlags: null });
  assert.equal(r.ok, false, check('coinFlags 为 null 时拒绝整个档案'));
  r = mk({ schemaVersion: 99 });
  assert.equal(r.ok, false, check('未知 schemaVersion 拒绝'));
  /* 手改档案把块计数调小 → 只能补领“真实学习时长对应”的块，不能凭空铸币：
   * 3600 秒真实学习最多领 6 块 = 30 币，与正常学习同等，无法放大。 */
  r = mk({ totalActiveSeconds: 3600, coinMinuteAwarded: 0 });
  assert.equal(r.state.coinMinuteAwarded, 0, check('块计数 0 合法（本来就是 0）'));
  economy.awardMinuteCoins(r.state);
  assert.equal(r.state.coins, 6 * economy.COINS_PER_BLOCK, check('手改块计数最多领回真实时长对应的 30 币'));
  economy.awardMinuteCoins(r.state);
  assert.equal(r.state.coins, 6 * economy.COINS_PER_BLOCK, check('再次结算不重复发放'));
}

/* ---------- 11. 序列化安全：无敏感键 ---------- */
{
  const state = fresh();
  const exported = Logic.exportJson(state, '2026-09-10T12:00:00.000Z');
  assert.equal(Logic.containsSensitiveKey(exported), false, check('叶片导出不含敏感字段名'));
}

console.log(`通过：叶片经济系统 ${checks} 项断言（规则表、分钟块幂等、一次性奖励防刷、streak/每日目标一次性、消费不为负、XP 分离、v1/v2 不追溯补发、v3 往返保值、非法字段回安全值）。`);
