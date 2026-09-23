/* Foundations 地图与章节 Boss 挑战测试（v4.3 交接 E1、E2、E3、P）。
 *
 * map.js / bosses.js 是纯逻辑与纯数据模块。这里在 vm 沙箱里与 catalog /
 * lessons / economy / tiers / history / progress 一起加载，验证：
 *   1. 节点状态五阶推导（未探索/已侦察/已破甲/已击破/已精通）与 locked 口径；
 *   2. 总地图结构：8 单元 46 节点、开放 19、未开放不可点、Boss 入口只在
 *      有题库的已开放单元；
 *   3. Boss 题库质量：题目全部标注来源课程且来源属于本单元已开放课、
 *      选项与答案合法、无远程引用；
 *   4. 评分四档边界（尚未破甲/已破甲/优势明显/压倒性优势）；
 *   5. 记录幂等：同一单元同一自然日 passCount/highCount 最多各 +1，
 *      attempts/bestPct 如实累计，firstPct/firstWasPrecheck 只写一次；
 *   6. progress.submitBoss 浏览器适配层集成：评分、历史事件、
 *      boss-first / 未战先知成就、tiers boss 族晋升联动。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const sandbox = { window: {} };
sandbox.window = sandbox;
for (const name of ['lessons.js', 'catalog.js', 'bosses.js', 'map.js', 'economy.js', 'collections.js', 'daily.js', 'challenges.js', 'tiers.js', 'history.js', 'progress.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, name), 'utf8'), sandbox);
}
const progress = sandbox.window.ODIN_PROGRESS;
const Logic = progress.Logic;
const mapModule = sandbox.window.ODIN_MAP;
const bossesModule = sandbox.window.ODIN_BOSSES;
const tiers = sandbox.window.ODIN_TIERS;
const history = sandbox.window.ODIN_HISTORY;
const economy = sandbox.window.ODIN_ECONOMY;
assert.ok(mapModule && bossesModule, 'map.js / bosses.js 应暴露全局模块');
const lessons = JSON.parse(JSON.stringify(sandbox.window.ODIN_GUIDE.lessons));
const catalog = JSON.parse(JSON.stringify(sandbox.window.ODIN_CATALOG));
const lessonIds = lessons.map(lesson => lesson.id);
const fresh = () => Logic.emptyState();
const local = value => JSON.parse(JSON.stringify(value));
const DAY = '2026-09-10';
const AT = '2026-09-10T09:00:00.000Z';
let checks = 0;
const check = label => { checks += 1; return label; };
const lessonById = id => lessons.find(lesson => lesson.id === id);

/* ===================== 1. 节点状态五阶推导（交接 E2） ===================== */
{
  const status = opts => mapModule.lessonNodeStatus(opts);
  assert.equal(status({ available: false, hasLesson: false }), 'locked', check('未开放：locked'));
  assert.equal(status({ available: true, hasLesson: false }), 'locked', check('目录说开放但正文缺失：按 locked（与目录同一口径）'));
  assert.equal(status({ available: true, hasLesson: true }), 'unexplored', check('已开放没打开过：未探索'));
  assert.equal(status({ available: true, hasLesson: true, entry: { started: true } }), 'scouted', check('打开过课程页：已侦察'));
  assert.equal(status({ available: true, hasLesson: true, entry: { started: true, completed: true } }), 'broken', check('勾选本课已完成：已破甲'));
  assert.equal(status({
    available: true, hasLesson: true,
    entry: { started: true, completed: true, officialCompleted: true, quizCompleted: true }
  }), 'defeated', check('完成 + 官方任务 + 自测：已击破'));
  /* 精通 = 击破 + 经历过复习周期（everMarked）且当前没有待复习任务（交接 E2
   * “完成后在后续复习通过 / 复习状态清除”两条路径） */
  const defeatedEntry = { started: true, completed: true, officialCompleted: true, quizCompleted: true };
  assert.equal(status({ available: true, hasLesson: true, entry: Object.assign({ needsReview: true }, defeatedEntry), review: { everMarked: true, doneCount: 1 } }), 'defeated', check('还挂着复习标记（needsReview 未清）：仍是已击破'));
  assert.equal(status({ available: true, hasLesson: true, entry: Object.assign({ needsReview: true }, defeatedEntry), review: { everMarked: true, doneCount: 4 } }), 'defeated', check('复习中（needsReview=true）：仍是已击破'));
  assert.equal(status({ available: true, hasLesson: true, entry: defeatedEntry, review: { everMarked: false, doneCount: 0 } }), 'defeated', check('从没经历复习周期：仍是已击破'));
  assert.equal(status({ available: true, hasLesson: true, entry: defeatedEntry, review: { everMarked: true, doneCount: 4 } }), 'mastered', check('击破 + 复习阶梯走完自动清除标记：已精通'));
  assert.equal(status({ available: true, hasLesson: true, entry: defeatedEntry, review: { everMarked: true, doneCount: 0 } }), 'mastered', check('击破 + 手动清除复习状态：也算已精通（交接 E2 第二条路径）'));
  /* 状态枚举与元数据齐全 */
  assert.equal(mapModule.NODE_STATUSES.length, 6, check('节点状态共 6 种（含 locked）'));
  for (const statusId of mapModule.NODE_STATUSES) {
    assert.ok(mapModule.STATUS_META[statusId] && mapModule.STATUS_META[statusId].zh, check(`状态 ${statusId} 有中文元数据`));
  }
  /* 状态阶梯是纯学习比喻：元数据里没有数值属性 */
  const metaJson = JSON.stringify(local(mapModule.STATUS_META));
  assert.ok(!/hp|attack|blood|damage|critical/i.test(metaJson), check('状态元数据没有血量/攻击力等重 RPG 数值'));
}

/* ===================== 2. 总地图结构（交接 E1） ===================== */
{
  const state = fresh();
  /* 真实路径推进几课：第一课击破、第二课破甲、第三课侦察 */
  Logic.markVisited(state, lessonIds[0], AT, DAY);
  Logic.setLessonFlag(state, lessonIds[0], 'completed', true, AT, 0);
  Logic.setLessonFlag(state, lessonIds[0], 'officialCompleted', true, AT, 0);
  Logic.setLessonFlag(state, lessonIds[0], 'quizCompleted', true, AT, 0);
  Logic.markVisited(state, lessonIds[1], AT, DAY);
  Logic.setLessonFlag(state, lessonIds[1], 'completed', true, AT, 0);
  Logic.markVisited(state, lessonIds[2], AT, DAY);

  const brief = mapModule.mapBrief(state, catalog, lessons, Logic.continueLessonId(state, lessons));
  assert.equal(brief.totalNodes, 46, check('总地图 46 个节点（官方全目录）'));
  assert.equal(brief.openNodes, 20, check('当前开放 20 个节点'));
  assert.equal(brief.counts.locked, 26, check('未开放 26 个节点仍可见（灰点）'));
  assert.equal(brief.counts.defeated, 1, check('第一课已击破'));
  assert.equal(brief.counts.broken, 1, check('第二课已破甲'));
  assert.equal(brief.counts.scouted, 1, check('第三课已侦察'));
  assert.equal(brief.counts.unexplored, 17, check('其余开放课未探索'));
  assert.equal(brief.units.length, 8, check('8 个单元'));

  /* 每单元：开放数、Boss 入口 */
  const byId = Object.fromEntries(brief.units.map(unit => [unit.group.id, unit]));
  assert.equal(byId['introduction'].openCount, 5, check('Introduction 开放 5 节点'));
  assert.equal(byId['html-foundations'].openCount, 8, check('HTML Foundations 本站开放 8 节点（与官方 8 课重合，含 Project: Recipes）'));
  assert.equal(byId['html-foundations'].totalCount, 8, check('HTML Foundations 官方 8 节点全部可见'));
  assert.equal(byId['css-foundations'].openCount, 0, check('CSS Foundations 未开放'));
  for (const unitId of ['introduction', 'prerequisites', 'git-basics', 'html-foundations']) {
    assert.ok(byId[unitId].boss, check(`已开放单元 ${unitId} 有 Boss 入口`));
  }
  for (const unitId of ['css-foundations', 'flexbox', 'javascript-basics', 'conclusion']) {
    assert.equal(byId[unitId].boss, null, check(`未开放单元 ${unitId} 没有 Boss 入口（题目必须来自已讲知识）`));
  }

  /* 未开放节点结构上不可点击；Project 节点有标记 */
  const lockedNodes = brief.units.flatMap(unit => unit.nodes).filter(node => node.status === 'locked');
  assert.equal(lockedNodes.length, 26, check('26 个 locked 节点'));
  assert.ok(lockedNodes.every(node => node.linkable === false), check('locked 节点不可点（linkable=false，UI 不生成链接）'));
  const allNodes = brief.units.flatMap(unit => unit.nodes);
  const projectNodes = allNodes.filter(node => node.type === 'project');
  assert.equal(projectNodes.length, 5, check('5 个 Project 节点（形状不同）'));
  /* v4.11.16：recipes 开放后不再是 locked——首个开放的 Project 节点。 */
  const recipesNode = projectNodes.find(node => node.slug === 'recipes');
  assert.ok(recipesNode && recipesNode.status !== 'locked' && recipesNode.linkable === true,
    check('recipes 是首个开放的 Project 节点（可点、非灰点）'));
  assert.equal(projectNodes.filter(node => node.status === 'locked').length, 4,
    check('其余 4 个 Project 未开放（Landing Page 起）'));

  /* 当前节点标记唯一且落在第一个未完成课 */
  const currentNodes = allNodes.filter(node => node.isCurrent);
  assert.equal(currentNodes.length, 1, check('当前节点恰好一个'));
  assert.equal(currentNodes[0].slug, Logic.continueLessonId(state, lessons), check('当前节点 = 继续学习推荐课'));

  /* 开放节点顺序与官方 order 一致（每个单元内递增） */
  for (const unit of brief.units) {
    const orders = unit.nodes.map(node => node.order);
    assert.deepEqual(orders, [...orders].sort((a, b) => a - b), check(`单元 ${unit.group.id} 节点按官方顺序`));
  }
}

/* ===================== 3. Boss 题库质量（交接 E3） ===================== */
{
  assert.equal(bossesModule.BOSSES.length, 4, check('4 个已开放单元各一个 Boss'));
  const catalogById = Object.fromEntries(catalog.lessons.map(entry => [entry.slug, entry]));
  for (const boss of bossesModule.BOSSES) {
    assert.ok(boss.unitId && boss.zh && boss.desc, check(`${boss.unitId}: 元信息齐全`));
    assert.ok(boss.questions.length >= 5 && boss.questions.length <= 8, check(`${boss.unitId}: 题量 5–8（综合自测不是题库轰炸）`));
    for (const [index, question] of boss.questions.entries()) {
      assert.ok(question.q && question.q.length > 5, check(`${boss.unitId}#${index}: 有题干`));
      assert.equal(question.options.length, 4, check(`${boss.unitId}#${index}: 四个选项`));
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, check(`${boss.unitId}#${index}: 答案下标合法`));
      assert.ok(question.explain && question.explain.length > 5, check(`${boss.unitId}#${index}: 有解析`));
      /* 题目必须来自当前站内已讲知识：来源课程存在、已开放、且属于本单元 */
      const source = lessonById(question.lessonId);
      assert.ok(source, check(`${boss.unitId}#${index}: 来源课程在 lessons.js 里（题目来自站内已讲知识）`));
      const catalogEntry = catalogById[question.lessonId];
      assert.ok(catalogEntry && catalogEntry.available === true, check(`${boss.unitId}#${index}: 来源课程已开放`));
      assert.equal(catalogEntry.group, boss.unitId, check(`${boss.unitId}#${index}: 来源课程属于本单元`));
      assert.ok(question.options.every(option => typeof option === 'string' && option.length > 0), check(`${boss.unitId}#${index}: 选项文本齐全`));
    }
    /* 每题来源课程尽量分散：覆盖课数达到 min(3, 本单元开放课数, 题数)
     * （git-basics 单元本站只开放 2 课，来源最多 2 课） */
    const unitOpenLessons = catalog.lessons.filter(entry => entry.group === boss.unitId && entry.available).length;
    const sourceIds = new Set(boss.questions.map(question => question.lessonId));
    const wantedSources = Math.min(3, unitOpenLessons, boss.questions.length);
    assert.ok(sourceIds.size >= wantedSources, check(`${boss.unitId}: 题目来源覆盖至少 ${wantedSources} 课（实际 ${sourceIds.size}）`));
  }
  /* 纯数据无联网、无脚本 */
  const bossSource = fs.readFileSync(path.join(root, 'bosses.js'), 'utf8');
  assert.ok(!/https?:\/\/(?!www\.w3\.org)/.test(bossSource), check('bosses.js 无远程引用'));
  assert.ok(!/<script|innerHTML|fetch\(|XMLHttpRequest/.test(bossSource), check('bosses.js 无脚本注入与网络调用'));
  assert.ok(!/答案[:：].*正确答案/.test(bossSource), check('题干不泄漏答案文本'));
}

/* ===================== 4. 评分四档边界（交接 E3） ===================== */
{
  const boss = bossesModule.bossForUnit('introduction');
  assert.ok(boss, check('bossForUnit 找到 Introduction Boss'));
  assert.equal(bossesModule.bossForUnit('css-foundations'), null, check('未开放单元没有 Boss'));
  const allCorrect = boss.questions.map(question => question.answer);
  const allWrong = boss.questions.map(() => (0));
  /* 全对：100% 压倒性优势 */
  let result = bossesModule.scoreBoss(boss, allCorrect);
  assert.equal(result.correct, boss.questions.length, check('全对：correct = 题数'));
  assert.equal(result.pct, 100, check('全对：100%'));
  assert.equal(result.rating, 'dominant', check('全对：压倒性优势'));
  assert.equal(result.passed, true, check('全对：通过'));
  assert.equal(result.high, true, check('全对：高评价'));
  /* 全错（第 0 项若恰为答案则按实际算）：构造必然全错的作答 */
  const guaranteedWrong = boss.questions.map(question => (question.answer + 1) % 4);
  result = bossesModule.scoreBoss(boss, guaranteedWrong);
  assert.equal(result.correct, 0, check('全错：0 分'));
  assert.equal(result.pct, 0, check('全错：0%'));
  assert.equal(result.rating, 'none', check('全错：尚未破甲'));
  assert.equal(result.passed, false, check('全错：未通过'));
  /* 档位边界：ratingOf 精确压线 */
  assert.equal(bossesModule.ratingOf(0).id, 'none', check('0% 尚未破甲'));
  assert.equal(bossesModule.ratingOf(49).id, 'none', check('49% 尚未破甲'));
  assert.equal(bossesModule.ratingOf(50).id, 'broken', check('50% 已破甲（压线通过）'));
  assert.equal(bossesModule.ratingOf(69).id, 'broken', check('69% 已破甲'));
  assert.equal(bossesModule.ratingOf(70).id, 'advantage', check('70% 优势明显（压线高评价）'));
  assert.equal(bossesModule.ratingOf(84).id, 'advantage', check('84% 优势明显'));
  assert.equal(bossesModule.ratingOf(85).id, 'dominant', check('85% 压倒性优势（压线）'));
  assert.equal(bossesModule.ratingOf(100).id, 'dominant', check('100% 压倒性优势'));
  assert.equal(bossesModule.ratingOf(-5).id, 'none', check('负分夹到尚未破甲'));
  assert.equal(bossesModule.ratingOf(999).id, 'dominant', check('异常高分夹到顶档'));
  /* 未作答按答错计 */
  result = bossesModule.scoreBoss(boss, [null, undefined, ...boss.questions.slice(2).map(question => question.answer)]);
  assert.equal(result.correct, boss.questions.length - 2, check('未作答的两题按答错计'));
  assert.equal(result.details[0].given, null, check('未作答的 detail.given 为 null'));
  /* 评分不改动题库数据 */
  const before = JSON.stringify(boss);
  bossesModule.scoreBoss(boss, allCorrect);
  assert.equal(JSON.stringify(boss), before, check('评分是只读操作'));
  void allWrong;
}

/* ===================== 5. 记录幂等与首战基线（交接 D1/O） ===================== */
{
  const state = fresh();
  const boss = bossesModule.bossForUnit('git-basics');
  const high = { pct: 83, passed: true, high: true };
  const low = { pct: 40, passed: false, high: false };

  /* 第一次：预检高评价 */
  let recorded = bossesModule.recordAttempt(state, 'git-basics', high, DAY, true);
  assert.equal(recorded.entry.attempts, 1, check('attempts 累计'));
  assert.equal(recorded.entry.passCount, 1, check('通过 +1'));
  assert.equal(recorded.entry.highCount, 1, check('高评价 +1'));
  assert.equal(recorded.entry.firstPct, 83, check('首战成绩记录'));
  assert.equal(recorded.entry.firstWasPrecheck, true, check('首战是预检'));
  assert.equal(recorded.entry.bestPct, 83, check('历史最佳 83'));
  assert.equal(recorded.entry.precheckBestPct, 83, check('预检最佳 83'));
  assert.equal(recorded.counts.passed && recorded.counts.high, true, check('本次两项计数都增加'));

  /* 同日再挑战：attempts/best 照常，passCount/highCount 不再 +1（同日幂等） */
  recorded = bossesModule.recordAttempt(state, 'git-basics', high, DAY, false);
  assert.equal(recorded.entry.attempts, 2, check('同日再战 attempts 累计'));
  assert.equal(recorded.entry.passCount, 1, check('同日再战 passCount 不重复 +1（防刷）'));
  assert.equal(recorded.entry.highCount, 1, check('同日再战 highCount 不重复 +1（防刷）'));
  assert.equal(recorded.counts.passed, false, check('本次没有新增通过计数'));
  assert.equal(recorded.entry.firstPct, 83, check('firstPct 不被覆盖（首战基线固定）'));
  assert.equal(recorded.entry.firstWasPrecheck, true, check('firstWasPrecheck 不被覆盖'));

  /* 次日低分：pass/high 都不加；best 不回退 */
  const nextDay = Logic.shiftDayKey(DAY, 1);
  recorded = bossesModule.recordAttempt(state, 'git-basics', low, nextDay, false);
  assert.equal(recorded.entry.attempts, 3, check('次日 attempts 累计'));
  assert.equal(recorded.entry.passCount, 1, check('低分不加通过数'));
  assert.equal(recorded.entry.highCount, 1, check('低分不加高评价数'));
  assert.equal(recorded.entry.bestPct, 83, check('历史最佳不回退'));
  assert.equal(recorded.entry.lastPct, 40, check('最近成绩如实记录'));

  /* 次日高分（新的一天）：pass/high 各 +1 */
  const day3 = Logic.shiftDayKey(DAY, 2);
  recorded = bossesModule.recordAttempt(state, 'git-basics', { pct: 100, passed: true, high: true }, day3, false);
  assert.equal(recorded.entry.passCount, 2, check('新一天通过 +1'));
  assert.equal(recorded.entry.highCount, 2, check('新一天高评价 +1'));
  assert.equal(recorded.entry.bestPct, 100, check('最佳刷新到 100'));
  assert.equal(recorded.entry.precheckBestPct, 83, check('非预检成绩不进 precheckBestPct'));

  /* 通过（≥50 但 <70）只加 passCount 不加 highCount */
  const day4 = Logic.shiftDayKey(DAY, 3);
  recorded = bossesModule.recordAttempt(state, 'git-basics', { pct: 60, passed: true, high: false }, day4, false);
  assert.equal(recorded.entry.passCount, 3, check('60% 通过 +1'));
  assert.equal(recorded.entry.highCount, 2, check('60% 不是高评价，highCount 不加'));

  /* emptyBossRecord 与 progress.js 的 sanitizeBossEntry 字段一致（防漂移） */
  const record = bossesModule.emptyBossRecord();
  const sanitized = Logic.sanitizeBossEntry(JSON.parse(JSON.stringify(record)));
  assert.deepEqual(local(Object.keys(record).sort()), local(Object.keys(sanitized).sort()), check('emptyBossRecord 与档案白名单字段集合一致'));
}

/* ===================== 6. progress.submitBoss 浏览器适配层集成 ===================== */
{
  /* 复刻浏览器页面：http + localStorage 桩 */
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
    setInterval: () => 0,
    setTimeout: () => 0,
    addEventListener() {},
    Date, JSON, console
  };
  pageSandbox.window = pageSandbox;
  pageSandbox.window.localStorage = storage;
  for (const name of ['lessons.js', 'catalog.js', 'bosses.js', 'map.js', 'economy.js', 'collections.js', 'daily.js', 'challenges.js', 'tiers.js', 'history.js', 'progress.js']) {
    vm.runInNewContext(fs.readFileSync(path.join(root, name), 'utf8'), pageSandbox);
  }
  const page = pageSandbox.window.ODIN_PROGRESS;
  const pageBosses = pageSandbox.window.ODIN_BOSSES;

  const boss = pageBosses.bossForUnit('introduction');
  /* 预检全对：解锁 boss-first + 未战先知 + tiers boss 族铜阶 */
  const allCorrect = boss.questions.map(question => question.answer);
  const submission = page.submitBoss('introduction', allCorrect, true);
  assert.equal(submission.ok, true, check('submitBoss 成功'));
  assert.equal(submission.result.pct, 100, check('评分 100%'));
  assert.equal(submission.result.rating, 'dominant', check('评级压倒性优势'));
  const state = page.getState();
  assert.equal(state.bosses['introduction'].attempts, 1, check('Boss 记录已持久化'));
  assert.equal(state.bosses['introduction'].firstWasPrecheck, true, check('预检口径记录'));
  assert.ok(state.achievements['boss-first'], check('解锁成就「首破章节 Boss」'));
  assert.ok(state.achievements['boss-precheck-high'], check('预检 100% 解锁成就「未战先知」'));
  assert.equal(state.achievementTiers['boss'], 1, check('tiers boss 族晋升铜阶（通过 1 次）'));
  assert.ok(state.history.some(event => event.type === 'boss-attempt'), check('Boss 挑战记入学习历史'));
  assert.ok(state.history.some(event => event.type === 'tier-up'), check('晋升记入学习历史'));
  /* 叶片：boss 族铜阶 10（挑战本身不发叶片——Boss 是成就/晋升渠道，不是刷币机） */
  assert.ok(state.coins >= 10, check('晋升奖励叶片入账'));

  /* 非预检高分不再触发未战先知（成就已解锁，幂等）；同日第二个单元高评价
   * 累计 2 次 < 银阶 3 次，boss 族阶级保持铜 */
  const again = page.submitBoss('prerequisites', pageBosses.bossForUnit('prerequisites').questions.map(question => question.answer), false);
  assert.equal(again.ok, true, check('第二个 Boss 提交成功'));
  assert.equal(page.getState().achievementTiers['boss'], 1, check('高评价 2 次未到银阶（3 次），阶级保持铜'));

  /* 未知单元拒绝 */
  const unknown = page.submitBoss('css-foundations', [0, 0, 0, 0, 0], false);
  assert.equal(unknown.ok, false, check('未开放单元没有 Boss，拒绝提交'));

  /* bossBrief：UI 数据齐全且不泄漏答案 */
  const brief = page.bossBrief('introduction');
  assert.equal(brief.attempted, true, check('bossBrief 报告已挑战'));
  assert.equal(brief.record.bestPct, 100, check('bossBrief 带历史最佳'));
  assert.ok(!('questions' in brief), check('bossBrief 不含题目与答案（面板首屏不泄漏）'));

  /* 存储里确实写入了 bosses（刷新不丢） */
  const stored = JSON.parse(storage.getItem('the-odin-project-zh.progress.v1'));
  assert.equal(stored.bosses['introduction'].bestPct, 100, check('Boss 纪录已写入存储'));
  assert.equal(stored.schemaVersion, 4, check('存储档案 schemaVersion 4'));
}

/* ===================== 7. goalProgress 的 Boss 指标 ===================== */
{
  const state = fresh();
  state.bosses = {
    'git-basics': { attempts: 2, passCount: 2, highCount: 1, lastPassDay: DAY, lastHighDay: DAY, bestPct: 83, firstPct: 50, lastPct: 83, firstWasPrecheck: false, precheckBestPct: null },
    introduction: { attempts: 1, passCount: 1, highCount: 1, lastPassDay: DAY, lastHighDay: DAY, bestPct: 100, firstPct: 100, lastPct: 100, firstWasPrecheck: true, precheckBestPct: 100 }
  };
  const passGoal = Logic.goalProgress(state, { kind: 'bossPass', value: 1 }, lessons, DAY);
  assert.equal(passGoal.current, 3, check('bossPass：跨单元通过次数求和'));
  const precheckGoal = Logic.goalProgress(state, { kind: 'bossPrecheckHigh', value: 70 }, lessons, DAY);
  assert.equal(precheckGoal.current, 100, check('bossPrecheckHigh：取各单元预检最佳的最大值'));
  assert.equal(precheckGoal.unit, 'percent', check('预检指标单位是 percent'));
  assert.equal(Logic.remainingText(15, 'percent'), '15 个百分点', check('remainingText 支持 percent'));
  assert.equal(Logic.remainingText(2, 'times'), '2 次', check('remainingText 支持 times'));
  /* 非预检单元的 bestPct 不算进 precheckBestPct（firstWasPrecheck=false 的单元 precheckBestPct 为 null） */
  const noPrecheck = fresh();
  noPrecheck.bosses = { 'git-basics': { attempts: 1, passCount: 1, highCount: 1, lastPassDay: DAY, lastHighDay: DAY, bestPct: 100, firstPct: 100, lastPct: 100, firstWasPrecheck: false, precheckBestPct: null } };
  assert.equal(Logic.goalProgress(noPrecheck, { kind: 'bossPrecheckHigh', value: 70 }, lessons, DAY).current, 0, check('没做过预检时未战先知进度为 0（学后高分不算）'));
  /* Boss 成就：核心两个一次性、可见、不发 XP；Batch 10（Stretch N5）追加的
   * 「未战先达」是隐藏惊喜（同样从 Boss 纪录推导，不发 XP） */
  const bossAchievements = Logic.ACHIEVEMENTS.filter(item => item.category === 'boss');
  assert.equal(bossAchievements.length, 3, check('boss 类别 3 个成就（首破 + 未战先知 + Batch 10 隐藏「未战先达」）'));
  const visibleBoss = bossAchievements.filter(item => !item.hidden);
  assert.deepEqual(local(visibleBoss.map(item => item.id)), ['boss-first', 'boss-precheck-high'], check('核心两个 Boss 成就保持可见（正向反馈不隐藏），只有追加惊喜是隐藏的'));
  assert.ok(Logic.ACHIEVEMENT_CATEGORIES.some(category => category.id === 'boss'), check('成就类别表含 boss'));
}

/* ===================== v4.11 补丁：已破甲 / 已击破 必须可区分 =====================
 * 证明的验收标准：Foundations 地图路线上「已破甲（只勾了本课完成）」与
 * 「已击破（完成 + 官方任务 + 本站自测三项齐全）」在**颜色**上可区分，而
 * **几何零改动**（节点尺寸 / 间距 / gap 环外径 / 层级全部不变）。
 *
 * 为什么要这一组：Sprout Signal 段曾把 is-broken 与 is-defeated 合并成同一条规则，
 * 而 base 规则原本留给击破的金色描边又被 .foundation-map 的纸色 gap 环按特异性盖掉；
 * 真实浏览器实测两个状态的 background / border-color / box-shadow / color 逐项相同。
 * 纯逻辑测试（本文件上面那些）查不出这类问题——它们只看状态推导、不看渲染。
 * 这一组把「两个状态必须有不同的有效颜色声明、且差异只落在颜色上」钉成回归网。 */
{
  const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  const patchStart = css.indexOf('v4.11 补丁：Foundations 地图');
  assert.ok(patchStart > 0, check('补丁段存在（地图节点状态色）'));
  const patch = css.slice(patchStart);
  const patchRules = patch.split('\n').filter(line => /^\s*\.map-node\.is-defeated/.test(line));

  /* ---------- 1. 旧的合并规则必须已经消失 ---------- */
  assert.equal(css.indexOf('.map-node.is-broken, .map-node.is-defeated'), -1,
    check('旧合并规则已拆掉——两个状态不再共用同一条声明（回退到同色会立刻红）'));
  assert.equal(patchRules.length, 1,
    check('补丁只新增 1 条规则（一条就够：它的特异性天然压过 .foundation-map 的纸环，不必写上下文特例）'));

  /* ---------- 2. 已破甲 = 纯绿实心（生效的那条是文件里最后一个 .is-broken 声明） ----------
   * 注意：`.map-node.is-broken` 在文件里有两处——base 规则（accent 底，v4.3 原版）与
   * Sprout Signal 段（绿底，现行）。生效的是最后一条，所以要取 last，不能取第一个匹配。 */
  const brokenRules = [...css.matchAll(/\.map-node\.is-broken \{([^}]*)\}/g)];
  assert.ok(brokenRules.length >= 2,
    check(`已破甲在文件里有两处声明（base 与 Sprout Signal，count=${brokenRules.length}），取最后一条生效`));
  const broken = brokenRules[brokenRules.length - 1][1];
  assert.ok(broken.includes('background: var(--color-semantic)'), check('已破甲：主题语义色实心（v4.11.15 起由固定绿改派生）'));
  assert.ok(broken.includes('border-color: var(--color-semantic)'), check('已破甲：描边同色（纯色一档，没有金色）'));
  assert.ok(!broken.includes('#d4af37'), check('已破甲不含金色——金色专属「已击破」及以上'));

  /* ---------- 3. 已击破 = 绿实心 + 金环（底色与描边不动，只换 gap 环） ---------- */
  const defeated = /\.map-node\.is-defeated:not\(\.is-current\) \{([^}]*)\}/.exec(patch)[1];
  assert.ok(defeated.includes('background: var(--color-semantic)'), check('已击破：底色与已破甲同色（不换底色，只在其上加金环）'));
  assert.ok(defeated.includes('border-color: var(--color-semantic)'), check('已击破：描边同色——填充本体不变，区分靠外圈金环'));
  assert.ok(/box-shadow:\s*0 0 0 3px #d4af37/.test(defeated), check('已击破：gap 环换成金色 #d4af37（金环）'));
  assert.ok(!defeated.includes('var(--color-paper)'),
    check('已击破的 gap 环不再用纸色——纸色环在浅底上等于隐形，那正是它被击破与击破混同的原因之一'));

  /* ---------- 4. 两个状态的有效颜色声明确实不同（这条直接对应「看不看得出来」） ---------- */
  const colorDecls = decl => (decl.match(/(?:background|border-color|box-shadow|color):[^;]+/g) || [])
    .map(item => item.trim()).join(' | ');
  assert.notEqual(colorDecls(broken), colorDecls(defeated),
    check('两个状态的颜色声明集合不同（不再是同一套值）'));
  assert.ok(/border-color:\s*var\(--color-semantic\)/.test(colorDecls(broken))
    && /box-shadow:\s*0 0 0 3px #d4af37/.test(colorDecls(defeated)),
    check('差异落在外圈：破甲无金环、击破有金环（填充同色，靠金环区分）'));

  /* ---------- 5. 只改颜色：规则里不许出现其它几何属性 ---------- */
  const geometry = /(?:^|;)\s*(width|height|min-width|min-height|padding|margin|inset|top|right|bottom|left|position|transform|border-width|border-style|border-radius|font-size|gap|flex)\s*:/;
  assert.ok(!geometry.test(defeated),
    check('已击破的补丁规则零几何属性——只改颜色，不改尺寸 / 位置 / 描边宽度'));
  assert.ok(!geometry.test(broken), check('已破甲的规则同样零几何属性'));

  /* ---------- 6. 环宽与既有纸色 gap 环逐字一致（这才叫「外径没被撑大」） ---------- */
  const ringWidth = ruleText => {
    const m = /box-shadow:\s*0 0 0 (\d+)px/.exec(ruleText);
    return m ? Number(m[1]) : null;
  };
  const existingRings = [...css.matchAll(/\.foundation-map \.map-node \{ box-shadow: 0 0 0 (\d+)px var\(--color-paper\); \}/g)]
    .map(m => Number(m[1]));
  assert.ok(existingRings.length >= 1, check('既有 Foundations 纸色 gap 环规则在位'));
  const effectiveRing = existingRings[existingRings.length - 1];
  assert.equal(ringWidth(defeated), effectiveRing,
    check(`补丁金环 ${ringWidth(defeated)}px 与既有生效纸环 ${effectiveRing}px 同宽——外径逐字不变，零布局影响`));
  assert.ok(css.includes(`.foundation-map .map-node { box-shadow: 0 0 0 ${effectiveRing}px var(--color-paper); }`),
    check('既有纸色 gap 环规则原样在位，未被本轮改写'));
  assert.ok(css.includes('.map-node { display: inline-flex; align-items: center; justify-content: center; width: 2.3rem;'),
    check('节点自身的尺寸规则零改动（宽度 / 圆角 / 描边位置都没碰）'));

  /* ---------- 7. 当前课节点的强调环不被这条补丁改写 ---------- */
  assert.ok(/:not\(\.is-current\)/.test(patchRules[0]),
    check('带 :not(.is-current) 守卫——当前课节点的强调环不受影响（守卫在选择器上，不在声明块里）'));
  assert.ok(css.includes('.map-node.is-current { outline-color: var(--color-accent); box-shadow: 0 0 0 3px var(--color-paper), 0 0 0 5px var(--color-accent); }'),
    check('当前课节点的既有强调环规则原样在位'));

  /* ---------- 8. 金色真的分得出来（对比度，不是「alpha 等于某个值」） ---------- */
  const lin = c => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const hexToRgb = h => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16));
  const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const contrast = (a, b) => {
    const [x, y] = [lum(hexToRgb(a)), lum(hexToRgb(b))];
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };
  /* v4.11.15：语义色改主题派生后，判据从「对那一支固定绿」改为**环与相邻底色的
   * 关系在全部 30 套主题下都成立**。环夹在节点填充（--color-semantic）与卡底
   * （--color-paper）之间，与其中一侧拉开反差就能从那一侧被看见：
   *   · 浅色主题——语义色深，金环对填充有反差（内缘清晰）；
   *   · 深色主题——语义色亮，金环对卡底有反差（外缘清晰）。
   * 而「已破甲」那条环是 var(--color-paper)，两侧都等于卡底色、整圈不可见——
   * 「纸色环 vs 金环」的区分因此在两种模式下都成立。 */
  const mixSrgb = (a, p, b, q) => {
    const A = hexToRgb(a), B = hexToRgb(b);
    const to = v => Math.round(v).toString(16).padStart(2, '0');
    return '#' + [0, 1, 2].map(i => to((A[i] * p + B[i] * q) / (p + q))).join('');
  };
  const tokensCss = fs.readFileSync(path.join(root, 'tokens.css'), 'utf8');
  const parseVars = block => {
    const v = {};
    for (const m of block.matchAll(/(--color-[a-z-]+)\s*:\s*(#[0-9a-fA-F]{6})/g)) v[m[1]] = m[2];
    return v;
  };
  const rootVars = parseVars(/:root\s*{([^}]*)}/.exec(tokensCss)[1]);
  const themeVars = [['garden', rootVars]];
  for (const m of tokensCss.matchAll(/html\[data-theme="([a-z-]+)"\]\s*{([^}]*)}/g)) {
    themeVars.push([m[1], Object.assign({}, rootVars, parseVars(m[2]))]);
  }
  assert.equal(themeVars.length, 30, check('复算覆盖全部 30 套主题（garden + 29 套 data-theme）'));
  const semOf = vars => mixSrgb(vars['--color-accent'], 58, vars['--color-ink'], 42);
  let worstRing = { ratio: Infinity, id: '' };
  for (const [id, vars] of themeVars) {
    const sem = semOf(vars);
    const best = Math.max(contrast('#d4af37', sem), contrast('#d4af37', vars['--color-paper']));
    if (best < worstRing.ratio) worstRing = { ratio: best, id };
  }
  assert.ok(worstRing.ratio >= 2.2,
    check(`金环全 30 套最差 ${worstRing.ratio.toFixed(2)}:1（${worstRing.id}）≥ 2.2:1（与本项目「非文本图形下限」同一口径）`));
  assert.ok(worstRing.ratio >= 2.5,
    check(`金环最差档仍留有余量（${worstRing.ratio.toFixed(2)}:1 ≥ 2.5，最差 ${worstRing.id}）——改 --color-semantic 的派生比例必须重跑本组`));
  /* 反向钉子：环不得退回卡底色。已破甲的环是 var(--color-paper)，两侧都等于卡底、
   * 整圈不可见；把已击破的环也写成纸色，等于把两个状态重新画成同一副样子。 */
  assert.ok(!/box-shadow:\s*0 0 0 3px var\(--color-paper\)/.test(defeated),
    check('已击破的 gap 环不得用纸色——纸色环与卡底同色、整圈不可见，那正是两个状态混同的成因'));
  assert.ok(/box-shadow:\s*0 0 0 3px #d4af37/.test(defeated),
    check('环色仍是亮金 #d4af37（与「已精通」渐变同族；本轮「填充改派生、环机制不变」只换了填充色源）'));

  /* ---------- 9. 纪律：零动画 / 零外链 / 零新 token ---------- */
  for (const [name, body] of [['已破甲规则', broken], ['已击破补丁规则', defeated]]) {
    assert.ok(!/animation\s*:/.test(body) && !/@keyframes/.test(body), check(`${name}零动画`));
    assert.ok(!/url\s*\(|https?:/.test(body), check(`${name}零外链零位图`));
    assert.ok(!/--color-[a-z-]+\s*:/.test(body), check(`${name}零新 token 定义`));
  }

  /* ---------- 10. 图例与节点同源：修一处两处都好 ---------- */
  const appSrc = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.ok(/dotClass:\s*`map-node \$\{meta\.css\}`/.test(appSrc),
    check('图例色点仍复用节点的同一批 class（修好节点样式，图例两个色点跟着一起可区分）'));
}

console.log(`通过：Foundations 地图与 Boss 挑战 ${checks} 项断言（节点五阶状态推导、46 节点总地图、Boss 入口只在已开放单元、题库全部来自本站已讲课程、评分四档压线边界、同日幂等防刷、首战基线固定、submitBoss 集成解锁成就与晋升、预检口径、goalProgress 指标、无远程引用，以及「已破甲 / 已击破」两个状态的颜色必须可区分（旧合并规则已拆、击破保留绿底绿描边只把 gap 环换成金环、金对绿底对比度 ≥ 2.2:1、环宽与既有纸环逐字同宽所以几何零改动））。`);
