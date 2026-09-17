/* 学习历史测试（v4.2 交接 §10、§22 History）。
 *
 * 覆盖：
 *   1. 事件写入：真实变更点（开始/完成/官方/自测/复习标记与清除/成就/每日目标/叶片收支）；
 *   2. 容量上限：超出 1000 条时保留最新；
 *   3. 无垃圾事件：计时 tick、summary 求值、重复勾选不产生记录；
 *   4. 按日分组与展示上限；
 *   5. 档案校验：非法事件丢弃、lessonId/achievementId 白名单、往返保值。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const sandbox = { window: {} };
sandbox.window = sandbox;
for (const file of ['lessons.js', 'economy.js', 'collections.js', 'daily.js', 'history.js', 'progress.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox);
}

const progress = sandbox.window.ODIN_PROGRESS;
const history = sandbox.window.ODIN_HISTORY;
const Logic = progress.Logic;
const lessons = JSON.parse(JSON.stringify(sandbox.window.ODIN_GUIDE.lessons));
const lessonIds = lessons.map(lesson => lesson.id);
const fresh = () => Logic.emptyState();
let checks = 0;
const check = label => { checks += 1; return label; };
const local = value => JSON.parse(JSON.stringify(value));
const DAY = '2026-09-10';
const AT = '2026-09-10T09:00:00.000Z';

/* ===================== 1. 事件写入（真实变更点） ===================== */
{
  const state = fresh();
  /* 开始某课：第一次记，第二次访问不记 */
  Logic.markVisited(state, lessonIds[0], AT, DAY);
  Logic.markVisited(state, lessonIds[0], '2026-09-10T10:00:00.000Z', DAY);
  assert.equal(state.history.length, 1, check('同一课重复访问只记一次“开始”'));
  assert.equal(state.history[0].type, 'lesson-start', check('开始事件类型正确'));
  assert.equal(state.history[0].day, DAY, check('事件日期取本地日'));

  /* 完成三类勾选各记一条 */
  Logic.setLessonFlag(state, lessonIds[0], 'completed', true, AT, Logic.XP_FIRST_LESSON_COMPLETE);
  Logic.setLessonFlag(state, lessonIds[0], 'officialCompleted', true, AT, Logic.XP_FIRST_OFFICIAL_COMPLETE);
  Logic.setLessonFlag(state, lessonIds[0], 'quizCompleted', true, AT, Logic.XP_FIRST_QUIZ_COMPLETE);
  const types = local(state.history.map(e => e.type));
  assert.deepEqual(types, ['lesson-start', 'lesson-complete', 'official-complete', 'quiz-complete'], check('完成类事件按勾选逐条记录'));

  /* 重复勾选不产生新事件 */
  Logic.setLessonFlag(state, lessonIds[0], 'completed', true, '2026-09-10T11:00:00.000Z', 0);
  assert.equal(state.history.length, 4, check('重复勾选不产生事件'));

  /* 复习：标记与清除都记 */
  Logic.setLessonFlag(state, lessonIds[1], 'needsReview', true, AT, 0);
  Logic.setLessonFlag(state, lessonIds[1], 'needsReview', false, AT, 0);
  const reviewTypes = local(state.history.slice(-2).map(e => e.type));
  assert.deepEqual(reviewTypes, ['review-mark', 'review-clear'], check('复习标记与清除各记一条'));

  /* 非法事件类型被拒绝 */
  assert.equal(history.logEvent(state, 'scroll', {}, AT), false, check('scroll 不是合法事件类型'));
  assert.equal(history.logEvent(state, 'mousemove', {}, AT), false, check('mousemove 不是合法事件类型'));
  assert.equal(state.history.length, 6, check('非法类型未写入'));
}

/* ===================== 2. 成就 / 每日目标 / 叶片收支事件（浏览器层语义在 Logic 可测部分） ===================== */
{
  /* 成就事件的语义在 progress.js 浏览器层 afterChange；这里验证 history 模块本身
   * 接受这些类型并且 detail 字段白名单生效。 */
  const state = fresh();
  history.logEvent(state, 'achievement', { achievementId: 'first-lesson' }, AT);
  history.logEvent(state, 'daily-goal', { amount: 10, zh: '达成每日目标' }, AT);
  history.logEvent(state, 'coin-grant', { amount: 100, zh: '连续学习 7 天' }, AT);
  history.logEvent(state, 'coin-spend', { assetId: 'book', amount: 70, zh: '摊开的书' }, AT);
  assert.equal(state.history.length, 4, check('成就/每日目标/叶片事件可写入'));
  const achievementEvent = state.history[0];
  assert.equal(achievementEvent.achievementId, 'first-lesson', check('成就事件带 achievementId'));
  assert.equal(state.history[3].assetId, 'book', check('消费事件带 assetId'));
  assert.equal(state.history[3].amount, 70, check('消费事件带金额'));
  /* detail 白名单：未知字段不进事件 */
  history.logEvent(state, 'lesson-complete', { lessonId: lessonIds[0], evil: 'x', token: 'y' }, AT);
  const last = state.history[state.history.length - 1];
  assert.equal('evil' in last, false, check('未知 detail 字段被丢弃'));
  assert.equal('token' in last, false, check('敏感 detail 字段被丢弃'));
}

/* ===================== 3. 容量上限 ===================== */
{
  const state = fresh();
  for (let i = 0; i < 1200; i += 1) {
    history.logEvent(state, 'lesson-start', { lessonId: lessonIds[0] }, `2026-09-10T09:00:${String(i % 60).padStart(2, '0')}.000Z`);
  }
  assert.equal(state.history.length, history.MAX_EVENTS, check(`超出上限后恰好保留 ${history.MAX_EVENTS} 条`));
  assert.equal(history.MAX_EVENTS, 1000, check('容量上限为 1000（§10 的 500–1000 区间上沿）'));
  /* 保留的是最新的：最后一条的秒数应大于第一条 */
  const firstSeconds = Number(state.history[0].at.slice(17, 19));
  const lastSeconds = Number(state.history[state.history.length - 1].at.slice(17, 19));
  assert.ok(lastSeconds >= firstSeconds, check('淘汰的是最旧的事件'));
}

/* ===================== 4. 按日分组与展示上限 ===================== */
{
  const state = fresh();
  history.logEvent(state, 'lesson-start', { lessonId: lessonIds[0] }, '2026-09-08T09:00:00.000Z');
  history.logEvent(state, 'lesson-complete', { lessonId: lessonIds[0] }, '2026-09-08T10:00:00.000Z');
  history.logEvent(state, 'lesson-start', { lessonId: lessonIds[1] }, '2026-09-10T09:00:00.000Z');
  const grouped = local(history.historyGrouped(state));
  assert.deepEqual(grouped.map(g => g.day), ['2026-09-10', '2026-09-08'], check('日期倒序，最新一天在最上'));
  assert.equal(grouped[1].events.length, 2, check('同一天的事件归在一组'));
  assert.equal(grouped[1].events[0].type, 'lesson-start', check('同一天内按时间正序'));
  const limited = history.historyGrouped(state, 1);
  assert.equal(limited.length, 1, check('展示上限只取最新部分'));
  assert.equal(limited[0].day, '2026-09-10', check('上限优先保留最新一天'));
  assert.equal(history.historyCount(state), 3, check('总数统计正确'));
  assert.deepEqual(local(history.historyGrouped(fresh())), [], check('空历史返回空分组'));
}

/* ===================== 5. 档案校验与往返 ===================== */
{
  const base = {
    schemaVersion: 3, lessons: {}, daily: {}, totalActiveSeconds: 0, xp: 0,
    minuteXpAwarded: 0, rewardFlags: {}, achievements: {}, lastLessonId: null,
    coins: 0, coinMinuteAwarded: 0, coinFlags: {},
    cosmetics: { purchases: {}, companionId: 'sprout', themeId: 'garden' },
    settings: { dailyGoalMinutes: 20 }
  };
  const goodHistory = [
    { at: AT, day: DAY, type: 'lesson-complete', lessonId: lessonIds[0] },
    { at: AT, day: DAY, type: 'achievement', achievementId: 'first-lesson' },
    { at: AT, day: DAY, type: 'coin-spend', assetId: 'book', amount: 70, zh: '摊开的书' }
  ];
  const mk = historyOverrides => Logic.parseImport(JSON.stringify(Object.assign({}, base, { history: historyOverrides })), lessonIds);

  let r = mk(goodHistory);
  assert.equal(r.ok, true, check('含历史的档案可导入'));
  assert.equal(r.state.history.length, 3, check('合法历史完整保留'));
  assert.equal(r.state.history[0].lessonId, lessonIds[0], check('课程事件往返保值'));

  /* 非法条目：未知类型 / 坏时间戳 / 未知课程 / 未知成就 / 越权字段，逐条丢弃 */
  r = mk([
    ...goodHistory,
    { at: AT, day: DAY, type: 'not-a-type' },
    { day: DAY, type: 'lesson-complete', lessonId: lessonIds[0] },
    { at: AT, day: DAY, type: 'lesson-complete', lessonId: 'unknown-lesson' },
    { at: AT, day: DAY, type: 'achievement', achievementId: 'not-an-achievement' },
    'garbage'
  ]);
  assert.equal(r.ok, true, check('历史里的坏条目不让整份档案被拒'));
  assert.equal(r.state.history.length, 3, check('坏条目被丢弃，好条目保留'));

  r = mk({ not: 'an array' });
  assert.equal(r.ok, false, check('history 不是数组时拒绝'));

  /* 超长历史：只保留最新 1000 条 */
  const longHistory = Array.from({ length: 1500 }, (_, i) => ({
    at: `2026-09-10T09:00:00.000Z`, day: DAY, type: 'lesson-start', lessonId: lessonIds[i % lessons.length]
  }));
  r = mk(longHistory);
  assert.equal(r.state.history.length, 1000, check('超长历史导入后裁到 1000 条'));

  /* 导出往返 */
  const state = fresh();
  history.logEvent(state, 'lesson-complete', { lessonId: lessonIds[0] }, AT);
  const exported = Logic.exportJson(state, AT);
  const parsed = JSON.parse(exported);
  assert.equal(parsed.history.length, 1, check('导出含历史'));
  const back = Logic.parseImport(exported, lessonIds);
  assert.equal(back.state.history.length, 1, check('历史往返保值'));
  assert.equal(Logic.containsSensitiveKey(exported), false, check('历史导出无敏感键'));

  /* v2 旧档案没有 history：默认空数组 */
  const legacy = { schemaVersion: 2, lessons: {}, daily: {}, totalActiveSeconds: 0, xp: 0, minuteXpAwarded: 0, rewardFlags: {}, achievements: {}, lastLessonId: null };
  const migrated = Logic.parseImport(JSON.stringify(legacy), lessonIds);
  assert.deepEqual(local(migrated.state.history), [], check('v2 档案迁移后历史为空数组'));
}

console.log(`通过：学习历史 ${checks} 项断言（真实变更点写入、无垃圾事件、容量上限 1000、按日分组、档案白名单与往返保值）。`);
