/* v4.5 Batch 7（交接 Core F）：首次有效读到本课结尾的奖励测试。
 *
 * 红线（必须永远成立）：滚到 100% ≠ 完成课程——本奖励绝不勾选
 * completed / officialCompleted / quizCompleted，绝不动 reviews / bosses，
 * 地图 defeated/mastered 语义不受影响。
 *
 * 覆盖：
 *   1. Logic.settleReadComplete（纯逻辑）：三道闸门（到结尾 / 本次会话有效
 *      阅读 ≥60s / rewardFlags.read:<id> 终身一次）、+10 XP（rewardFlags 闩锁）
 *      +5 叶片（coinFlags 闩锁，分开记账）、history 记一条 read-complete、
 *      完成状态字段一个不动；
 *   2. 浏览器 API：持久化模式发放并持久化；file:// 返回 file-mode 零副作用
 *      （交接：file:// 只显示阅读位置，不发持久奖励）；
 *   3. UI 防刷（End 键场景）：真实滚动到 100% 但会话有效阅读不足 60s →
 *      阅读条 is-done 出现、但零奖励零提示、completed 仍为 false；
 *   4. UI 正向路径：会话有效阅读满 60s 后滚到 100% → 自动结算，出现
 *      「已读到本课结尾」轻提示（底部小条，非 Modal），存储落闩锁，
 *      完成勾选框保持未勾；重复滚动不重复发。
 *
 * 运行：node tests/read-complete.test.cjs */
const assert = require('node:assert/strict');

let checks = 0;
const check = label => { checks += 1; return label; };

const {
  querySelect, collectByClass, makeStorage,
  newPage, archiveJson, FIRST_LESSON, STORAGE_KEY
} = require('./dom-stub.cjs');

const page0 = newPage({ storage: makeStorage() });
const Logic = page0.progress.Logic;
const economy = page0.sandbox.window.ODIN_ECONOMY;

function lessonPage(storage, options) {
  return newPage(Object.assign({
    storage: storage || makeStorage(),
    page: 'lesson',
    search: `?id=${FIRST_LESSON}`,
    href: `http://127.0.0.1:8799/lesson.html?id=${FIRST_LESSON}`
  }, options || {}));
}

/* 触发一次 scroll 重算（stub 的 updateReadingPosition 挂在 window scroll 上） */
const rescroll = page => page.fireWindow('scroll', {});
const stored = storage => JSON.parse(storage.getItem(STORAGE_KEY));
const readNotes = page => collectByClass(page.dom.body, 'achievement-note')
  .filter(n => n.textContent.includes('已读到本课结尾'));

/* ===================== 1. Logic 纯逻辑：三道闸门 + 发放语义 ===================== */
{
  assert.equal(Logic.READ_COMPLETE_XP, 10, check('F：奖励 +10 XP（交接定值）'));
  assert.equal(Logic.READ_COMPLETE_MIN_SECONDS, 60, check('F：本次会话有效阅读门槛 60s（交接建议值）'));
  assert.equal(economy.COIN_READ_COMPLETE, 5, check('F：奖励 +5 叶片（交接定值）'));
  assert.ok(economy.COIN_RULES.some(r => r.id === 'read-complete' && r.amount === 5), check('F：叶片规则表新增 read-complete（UI 规则说明同源可见）'));

  const state = Logic.emptyState();
  /* 闸门①：没读到结尾不发 */
  const r1 = Logic.settleReadComplete(state, FIRST_LESSON, 999, false, '2026-09-11T09:00:00.000Z');
  assert.equal(r1.ok, false, check('F：未到结尾（reachedEnd=false）不发放'));
  assert.equal(r1.reason, 'not-end', check('F：not-end 原因可辨识'));
  /* 闸门②：End 键秒到底（会话有效阅读 <60s）不发 */
  const r2 = Logic.settleReadComplete(state, FIRST_LESSON, 59, true, '2026-09-11T09:00:01.000Z');
  assert.equal(r2.ok, false, check('F：59s 差 1 秒不发放（End 键防刷）'));
  assert.equal(r2.reason, 'too-fast', check('F：too-fast 原因可辨识'));
  assert.equal(state.xp, 0, check('F：未发放时 XP 分文未动'));
  assert.equal(state.rewardFlags[`read:${FIRST_LESSON}`], undefined, check('F：未发放时不落闩锁（满了 60s 还能领）'));
  /* 正发：60s 压线 */
  const r3 = Logic.settleReadComplete(state, FIRST_LESSON, 60, true, '2026-09-11T09:01:00.000Z');
  assert.equal(r3.ok, true, check('F：60s 压线 + 到结尾 → 发放'));
  assert.equal(r3.xp, 10, check('F：+10 XP'));
  assert.equal(r3.coins, 5, check('F：+5 叶片'));
  assert.equal(state.xp, 10, check('F：XP 入账'));
  assert.equal(state.coins, 5, check('F：叶片入账'));
  assert.equal(state.rewardFlags[`read:${FIRST_LESSON}`], true, check('F：rewardFlags.read:<lessonId> 单一事实源闩锁（交接指定）'));
  assert.equal(state.coinFlags[economy.flagKey('read', FIRST_LESSON)], true, check('F：叶片走 coinFlags 分开记账（与既有模式一致）'));
  /* 闸门③：终身一次——重复调用 / 刷新重进都不重发 */
  const xpAfter = state.xp;
  const r4 = Logic.settleReadComplete(state, FIRST_LESSON, 600, true, '2026-09-11T09:02:00.000Z');
  assert.equal(r4.ok, false, check('F：重复结算不重发'));
  assert.equal(r4.reason, 'already', check('F：already 原因可辨识'));
  assert.equal(state.xp, xpAfter, check('F：重复结算 XP 分文未动'));
  /* 红线：完成语义分毫不动 */
  const entry = state.lessons[FIRST_LESSON] || Logic.emptyLessonEntry();
  assert.equal(entry.completed, false, check('F 红线：不勾选「本课已完成」'));
  assert.equal(entry.officialCompleted, false, check('F 红线：不触发官方任务完成'));
  assert.equal(entry.quizCompleted, false, check('F 红线：不触发本站自测完成'));
  assert.deepEqual(Object.keys(state.reviews), [], check('F 红线：不写复习调度'));
  assert.deepEqual(Object.keys(state.bosses), [], check('F 红线：不写 Boss 纪录（地图 defeated/mastered 语义不受影响）'));
  /* history 恰一条 read-complete，不带第二计数器 */
  const readEvents = state.history.filter(e => e.type === 'read-complete');
  assert.equal(readEvents.length, 1, check('F：history 记一条 read-complete（重复结算不再记）'));
  assert.equal(readEvents[0].lessonId, FIRST_LESSON, check('F：read-complete 事件带 lessonId'));
  assert.equal(state.history.filter(e => e.type === 'lesson-complete').length, 0, check('F 红线：不产生 lesson-complete 事件（统计无第二计数器）'));
  /* 无 lessonId / 未知参数防御 */
  assert.equal(Logic.settleReadComplete(state, null, 999, true, '2026-09-11T09:03:00.000Z').ok, false, check('F：无 lessonId 拒绝'));
}

/* ===================== 2. 浏览器 API：持久化 / file:// 降级 ===================== */
{
  const storage = makeStorage();
  const page = lessonPage(storage);
  const before = page.progress.summary();
  const r = page.progress.settleReadComplete(61, true);
  assert.equal(r.ok, true, check('F API：持久化模式发放成功'));
  const after = page.progress.summary();
  assert.equal(after.xp, before.xp + 10, check('F API：XP +10 并进入 summary'));
  assert.equal(after.coins, before.coins + 5, check('F API：叶片 +5 并进入 summary'));
  const s = stored(storage);
  assert.equal(s.rewardFlags[`read:${FIRST_LESSON}`], true, check('F API：闩锁已持久化（刷新/重开不重发）'));
  assert.ok(s.history.some(e => e.type === 'read-complete'), check('F API：read-complete 已随档案持久化'));
  assert.equal(page.progress.isReadCompleteAwarded(FIRST_LESSON), true, check('F API：isReadCompleteAwarded 可查询'));
  /* 再调一次：already，不双发 */
  const r2 = page.progress.settleReadComplete(120, true);
  assert.equal(r2.ok, false, check('F API：重复调用 already'));
  assert.equal(page.progress.summary().xp, after.xp, check('F API：重复调用 XP 不变'));

  /* file:// 只显示阅读位置，不发持久奖励 */
  const filePage = lessonPage(null, { storage: null, protocol: 'file:' });
  const fr = filePage.progress.settleReadComplete(999, true);
  assert.equal(fr.ok, false, check('F API：file:// 返回 ok:false'));
  assert.equal(fr.reason, 'file-mode', check('F API：file:// 原因 file-mode'));
  assert.equal(filePage.progress.summary().xp, 0, check('F API：file:// XP 分文未动'));
}

/* ===================== 3. UI 防刷：End 键秒到底（100% 但会话不足 60s） ===================== */
{
  const storage = makeStorage();
  const page = lessonPage(storage);
  /* stub 几何：scrollHeight=2400、innerHeight=800 → max=1600；scrollY=1600 即 100% */
  page.sandbox.scrollY = 1600;
  rescroll(page);
  const bar = querySelect(page.dom.body, '.reading-position');
  assert.ok(bar.classList.contains('is-done'), check('F UI：滚到底阅读条出现 is-done（100% ✓ 轻提示照旧）'));
  assert.equal(querySelect(bar, '.reading-pct').textContent, '100% ✓', check('F UI：条内文字 100% ✓（既有 G4 行为不变）'));
  assert.equal(readNotes(page).length, 0, check('F UI 防刷：会话有效阅读 0s，滚到 100% 也不发奖励不弹提示'));
  const s = stored(storage);
  assert.equal(s.rewardFlags[`read:${FIRST_LESSON}`], undefined, check('F UI 防刷：不落闩锁（之后真读满 60s 仍可领）'));
  assert.equal(s.xp, 0, check('F UI 防刷：XP 分文未动'));
  const entry = (s.lessons || {})[FIRST_LESSON];
  assert.ok(!entry || entry.completed !== true, check('F UI 红线：滚到 100% 不会把课程标记为完成'));
}

/* ===================== 4. UI 正向路径：会话读满 60s + 100% → 自动结算 ===================== */
{
  const storage = makeStorage();
  const page = lessonPage(storage);
  /* 用真实导入通道把累计有效秒数抬到 120s（baseline 在挂载时已定格为 0，
   * 会话秒数 = 120 − 0 ≥ 60；生产环境该增量由 idle-aware 计时器自然累计，
   * 真实浏览器侧走 65s 有机等待验证，见执行日志）。 */
  page.progress.importArchive(archiveJson({ totalActiveSeconds: 120 }));
  page.sandbox.scrollY = 800;
  rescroll(page);
  assert.equal(readNotes(page).length, 0, check('F UI：50% 位置即使读满 60s 也不发（必须到 100%）'));
  page.sandbox.scrollY = 1600;
  rescroll(page);
  const notes = readNotes(page);
  assert.equal(notes.length, 1, check('F UI：读满 60s 后滚到 100% 自动结算，出现一条轻提示'));
  assert.equal(notes[0].tagName, 'P', check('F UI：提示是底部静态小条（与成就同通道），不是 Modal'));
  assert.ok(notes[0].textContent.includes('+10 XP'), check('F UI：提示含 +10 XP'));
  assert.ok(notes[0].textContent.includes('+5 叶片'), check('F UI：提示含 +5 叶片'));
  assert.ok(notes[0].textContent.includes('不等于课程完成'), check('F UI：提示明确「阅读里程碑 ≠ 课程完成」（红线文案）'));
  assert.equal([...page.dom.body.children].filter(el => el.tagName === 'DIALOG' && el.open === true).length, 0, check('F UI：不弹任何 Modal'));
  const s = stored(storage);
  assert.equal(s.rewardFlags[`read:${FIRST_LESSON}`], true, check('F UI：闩锁落库'));
  assert.equal(s.xp, 10, check('F UI：XP +10 落库'));
  assert.equal(s.coins, 5, check('F UI：叶片 +5 落库'));
  const entry = (s.lessons || {})[FIRST_LESSON];
  assert.ok(!entry || entry.completed !== true, check('F UI 红线：奖励发放后「本课已完成」仍未勾选'));
  /* 勾选框 DOM 保持未勾（用户必须自己确认完成） */
  const boxes = collectByClass(page.dom.body, 'progress-toggle')
    .map(label => label.children.find(child => child.tagName === 'INPUT'));
  assert.equal(boxes[0].checked, false, check('F UI 红线：完成勾选框未被程序勾选'));
  /* 来回滚动 / 重复触发不再发 */
  page.sandbox.scrollY = 400;
  rescroll(page);
  page.sandbox.scrollY = 1600;
  rescroll(page);
  assert.equal(readNotes(page).length, 1, check('F UI 防刷：来回滚动不重复发（仍是那一条）'));
  assert.equal(stored(storage).xp, 10, check('F UI 防刷：XP 不再增加'));
}

/* ===================== 5. 旧档案兼容：历史学习不追溯补发 ===================== */
{
  /* v4.4 老用户档案（大量 activeSeconds、完成过多课、无 read:<id> 闩锁）：
   * 载入不结算（settle 只由 UI 在「本次会话」触发），历史阅读不追溯发奖励；
   * 但之后在本课页真实读满 60s + 100% 仍可正常领取（新事件新奖励）。 */
  const legacy = JSON.parse(archiveJson({ totalActiveSeconds: 36000, xp: 500 }));
  legacy.lessons[FIRST_LESSON] = { started: true, completed: true, needsReview: false, officialCompleted: false, quizCompleted: false, activeSeconds: 3600, startedAt: null, lastVisitedAt: null, completedAt: '2026-08-01T08:00:00.000Z', officialCompletedAt: null, quizCompletedAt: null };
  const storage = makeStorage();
  storage.setItem(STORAGE_KEY, JSON.stringify(legacy));
  const page = lessonPage(storage);
  const s0 = stored(storage);
  assert.equal(s0.xp, 500, check('F 兼容：旧档案载入 XP 原样（不重算）'));
  assert.equal(s0.rewardFlags[`read:${FIRST_LESSON}`], undefined, check('F 兼容：载入不追溯补发 read 闩锁'));
  assert.equal(readNotes(page).length, 0, check('F 兼容：载入旧档案不弹阅读奖励提示'));
  assert.equal(page.progress.summary().xp, 500, check('F 兼容：summary XP 与档案一致'));
}

console.log(`read-complete.test.cjs：全部 ${checks} 项断言通过 ✔`);
