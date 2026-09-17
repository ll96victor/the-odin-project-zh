/* P0 数据同步回归测试（v4.2 交接 §2）。
 *
 * 背景：用户真实反馈——课页勾选四项、成就已解锁，但首页仍显示
 * Foundations 总进度 0 / 46、成就 0 / 35，刷新多次无效。
 *
 * 本文件在 Node vm 沙箱里复刻浏览器适配层的真实链路：
 *   localStorage 桩 + http 协议 → 课页勾选 → 存储 → 重新加载（新沙箱）→ summary。
 * 覆盖四类根因与口径：
 *   1. 正常链路：勾选 → 刷新 → 统计正确（用户 Bug 的正向回归）；
 *   2. 完成口径：只有 completed 计入完成数，official / quiz / review 不计入；
 *   3. 不同源 = 不同存储：localhost 与 127.0.0.1 的进度互不可见（根因存档）；
 *   4. 存储写入失败不再静默：storageHealth().saveOk 变 false，UI 可显示警告。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const lessonsSrc = fs.readFileSync(path.join(root, 'lessons.js'), 'utf8');
const progressSrc = fs.readFileSync(path.join(root, 'progress.js'), 'utf8');
const FIRST_LESSON = 'how-this-course-will-work';
let checks = 0;
const check = label => { checks += 1; return label; };

/* localStorage 桩：与浏览器同源语义一致——每个 storage 实例就是一个独立源。 */
function makeStorage(overrides = {}) {
  const map = new Map();
  return Object.assign({
    setItem(key, value) { map.set(String(key), String(value)); },
    getItem(key) { return map.has(String(key)) ? map.get(String(key)) : null; },
    removeItem(key) { map.delete(String(key)); },
    key(index) { return [...map.keys()][index]; },
    get length() { return map.size; }
  }, overrides);
}

/* 复刻一个“页面”：progress.js 在 vm 沙箱中加载，window / location / document
 * 按浏览器行为提供最小桩。protocol 决定持久化模式，与真实浏览器一致。 */
function newPage(storage, protocol = 'http:') {
  const sandbox = {
    window: {},
    location: { protocol, href: 'http://127.0.0.1:8765/lesson.html?id=' + FIRST_LESSON },
    document: {
      addEventListener() {},
      removeEventListener() {},
      visibilityState: 'visible',
      body: { append() {} }
    },
    setInterval() { return 0; },
    setTimeout() { return 0; },
    addEventListener() {},
    Date,
    JSON,
    console
  };
  sandbox.window = sandbox;
  sandbox.window.localStorage = storage;
  vm.runInNewContext(lessonsSrc, sandbox);
  vm.runInNewContext(progressSrc, sandbox);
  return sandbox.window.ODIN_PROGRESS;
}

/* ---------- 1. 用户 Bug 的正向回归：课页勾选 → 刷新 → 统计正确 ---------- */
{
  const storage = makeStorage();
  const page = newPage(storage);
  assert.equal(page.isPersistent(), true, check('http 模式下为持久化模式'));
  /* 初始状态 */
  assert.equal(page.summary().completedCount, 0, check('初始 Foundations 完成数为 0'));
  assert.equal(page.summary().achievementCount, 0, check('初始成就数为 0'));

  /* 课页：启动计时（等价 app.js 调 startTimer）并勾选用户提到的四项 */
  page.startTimer(FIRST_LESSON);
  page.setCompleted(true);
  page.setOfficialCompleted(true);
  page.setQuizCompleted(true);
  page.setNeedsReview(true);
  const live = page.summary();
  assert.equal(live.completedCount, 1, check('勾选后课页实时完成数为 1'));
  assert.ok(live.achievementCount >= 1, check('勾选后课页实时成就数 ≥ 1（解锁提示的前提）'));

  /* 刷新 / 重新打开：新页面重新加载 progress.js，从同一存储读取 */
  const reloaded = newPage(storage);
  const after = reloaded.summary();
  assert.equal(after.completedCount, 1, check('刷新后完成数仍为 1（首页 0/46 回归）'));
  assert.equal(after.achievementCount, live.achievementCount, check('刷新后成就数与课页一致（首页 0/35 回归）'));
  assert.equal(after.officialCompletedCount, 1, check('刷新后官方任务计数为 1'));
  assert.equal(after.quizCompletedCount, 1, check('刷新后自测计数为 1'));
  assert.equal(after.needsReviewCount, 1, check('刷新后待复习计数为 1'));
  assert.equal(after.xp, live.xp, check('刷新后 XP 一致'));
  assert.equal(reloaded.storageHealth().saveOk, true, check('正常链路 storageHealth.saveOk 为 true'));

  /* 再刷新一次（“刷新多次”）：结果稳定 */
  const again = newPage(storage).summary();
  assert.equal(again.completedCount, 1, check('再次刷新完成数仍为 1'));
  assert.equal(again.achievementCount, after.achievementCount, check('再次刷新成就数不变'));
}

/* ---------- 2. 完成口径：只有 completed 计入完成数（§2.1） ---------- */
{
  const storage = makeStorage();
  const page = newPage(storage);
  page.startTimer(FIRST_LESSON);
  /* 只勾官方任务 / 自测 / 复习，不勾本课已完成 */
  page.setOfficialCompleted(true);
  page.setQuizCompleted(true);
  page.setNeedsReview(true);
  const summary = page.summary();
  assert.equal(summary.completedCount, 0, check('只勾官方任务/自测/复习时完成数为 0'));
  assert.equal(summary.percent, 0, check('完成百分比为 0'));
  assert.equal(summary.officialCompletedCount, 1, check('官方任务计数独立为 1'));
  assert.equal(summary.quizCompletedCount, 1, check('自测计数独立为 1'));
  assert.equal(summary.needsReviewCount, 1, check('复习计数独立为 1'));
  const reloaded = newPage(storage).summary();
  assert.equal(reloaded.completedCount, 0, check('刷新后完成数仍为 0，口径不漂移'));

  /* 补勾本课已完成 → 完成数 +1，其他计数不变 */
  page.setCompleted(true);
  const done = newPage(storage).summary();
  assert.equal(done.completedCount, 1, check('补勾本课完成后完成数变为 1'));
  assert.equal(done.officialCompletedCount, 1, check('补勾完成后官方任务计数不变'));
  assert.equal(done.quizCompletedCount, 1, check('补勾完成后自测计数不变'));
}

/* ---------- 3. 根因存档：不同源 = 不同存储（localhost ≠ 127.0.0.1） ----------
 * 这正是用户真实 Bug 的根因：localhost:8765 与 127.0.0.1:8765 在浏览器里
 * 是两个不同的源，localStorage 完全隔离。在另一边打开同一页面时一切正常、
 * 但数据是空的，刷新多少次都不会出现。前端无法跨源读取，修复落在
 * serve.py（localhost 一律 301 跳回 127.0.0.1，见 tests/serve_test.py）。
 * 这里把浏览器“按源隔离”的语义钉住，防止将来有人在存储层引入跨源合并。 */
{
  const storage127 = makeStorage();   // 源 A：http://127.0.0.1:8765
  const storageLocal = makeStorage(); // 源 B：http://localhost:8765
  const pageA = newPage(storage127);
  pageA.startTimer(FIRST_LESSON);
  pageA.setCompleted(true);
  const pageB = newPage(storageLocal);
  assert.equal(pageA.summary().completedCount, 1, check('源 A 勾选后完成数为 1'));
  assert.equal(pageB.summary().completedCount, 0, check('源 B（localhost）完成数为 0——不同源看不到彼此数据'));
  assert.equal(pageB.summary().achievementCount, 0, check('源 B 成就数为 0——根因复现并存档'));
  assert.equal(pageB.storageHealth().saveOk, true, check('源 B 存储本身健康（不是保存失败，是数据在另一个源）'));
}

/* ---------- 4. 存储写入失败不再静默（§2） ---------- */
{
  /* 模拟真实配额超限：safeStorage() 的小探测写入成功（否则整个站点会降级为
   * file:// 式的非持久化模式，那是另一类可检测场景），只有写整份档案时失败。 */
  const storage = makeStorage();
  const realSetItem = storage.setItem;
  storage.setItem = (key, value) => {
    if (key === 'the-odin-project-zh.progress.v1') throw new Error('QuotaExceededError');
    realSetItem(key, value);
  };
  const page = newPage(storage);
  page.startTimer(FIRST_LESSON);
  page.setCompleted(true);
  /* 内存里的状态仍然更新了（用户当场能看到成就解锁提示），但 save 失败 */
  assert.equal(page.summary().completedCount, 1, check('保存失败时内存态完成数仍为 1（用户当场看到勾选生效）'));
  const health = page.storageHealth();
  assert.equal(health.persistent, true, check('保存失败时仍报告为持久化模式'));
  assert.equal(health.saveOk, false, check('storageHealth.saveOk 为 false——刷新会丢数据的风险可被 UI 检测'));
  /* 刷新：数据确实丢失（存储从未写入成功）——这就是为什么必须把失败显示出来 */
  const reloaded = newPage(makeStorage());
  assert.equal(reloaded.summary().completedCount, 0, check('写入失败后刷新确实归零（静默失败的真实后果）'));
}

/* ---------- 5. file:// 模式：storageHealth 不假装健康 ---------- */
{
  const page = newPage(makeStorage(), 'file:');
  assert.equal(page.isPersistent(), false, check('file:// 模式不是持久化模式'));
  assert.equal(page.storageHealth().persistent, false, check('file:// 模式 storageHealth.persistent 为 false'));
  assert.equal(page.storageHealth().saveOk, false, check('file:// 模式 saveOk 为 false，不假装能保存'));
}

/* ---------- 6. 跨标签页同步：storage 事件 → reloadFromStorage → summary 更新 ---------- */
{
  const storage = makeStorage();
  /* 页面 A（首页）先加载，此刻还没有任何完成记录 */
  const home = newPage(storage);
  assert.equal(home.summary().completedCount, 0, check('首页初始完成数为 0'));

  /* 页面 B（课页，另一标签页）勾选完成并写入存储 */
  const lessonPage = newPage(storage);
  lessonPage.startTimer(FIRST_LESSON);
  lessonPage.setCompleted(true);

  /* 页面 A 收到 storage 事件后调用 reloadFromStorage（app.js watchStorage 的行为） */
  assert.equal(home.summary().completedCount, 0, check('未重载前首页内存态仍是旧副本 0（缺陷前提成立）'));
  assert.equal(home.reloadFromStorage(), true, check('reloadFromStorage 成功返回 true'));
  assert.equal(home.summary().completedCount, 1, check('重载后首页完成数为 1——跨标签页同步生效'));
  assert.equal(home.summary().achievementCount, lessonPage.summary().achievementCount,
    check('重载后首页成就数与课页一致'));

  /* 存储被清空或损坏时重载失败，本页状态保持不变而不是清零 */
  storage.removeItem('the-odin-project-zh.progress.v1');
  assert.equal(home.reloadFromStorage(), false, check('存储为空时 reloadFromStorage 返回 false'));
  assert.equal(home.summary().completedCount, 1, check('重载失败时本页状态不被清空'));
}

console.log(`通过：P0 数据同步回归 ${checks} 项断言（勾选→刷新统计一致、完成口径只认「本课已完成」、不同源存储隔离根因存档、存储写入失败可检测、file:// 不假装健康）。`);
