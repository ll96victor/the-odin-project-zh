/* Foundations 地图与章节 Boss 挑战测试（v4.3 交接 E1、E2、E3、P）。
 *
 * map.js / bosses.js 是纯逻辑与纯数据模块。这里在 vm 沙箱里与 catalog /
 * lessons / economy / tiers / history / progress 一起加载，验证：
 *   1. 节点状态五阶推导（未探索/已侦察/已破甲/已击破/已精通）与 locked 口径；
 *   2. 总地图结构：8 单元 46 节点、开放 44、未开放不可点、Boss 入口只在
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

/* World 2 第三批（2026-09-26）：路径课章节 Boss 的校验数据。
 * 刻意用**独立沙箱**只加载 courses/* 与 curriculum.js，不把 lesson-sources.js 塞进上面那个
 * 沙箱——上面那份是 Foundations 口径（map.js / progress.js 都按 catalog 46 课推导），
 * 混入汇总层会让本文件里与 Boss 无关的节点状态、计数断言全部改变口径（那是 dom-mount /
 * lesson-sources / content 三个文件的职责）。这里只需要两件事实：
 *   ① 路径课已开放课的 id 集合（courses/*.js 只放已开放课，是文件头写明的约定）；
 *   ② curriculum.js 里各官方章节（section）的 id 与 slug 清单，用来判定「本章是否全开放」。
 * 批次 4（2026-09-26）起 courses/ 目录动态枚举（不再写死单个文件名）——World 3 起
 * 每个 World 一个课程文件，本测试对新文件零迁移。 */
const courseFiles = fs.readdirSync(path.join(root, 'courses')).filter(name => name.endsWith('.js')).sort();
assert.ok(courseFiles.length >= 1, 'courses/ 至少有一个课程文件');
const pathSandbox = { window: {} };
pathSandbox.window = pathSandbox;
const pathCourses = [];
for (const name of courseFiles) {
  const before = new Set(Object.keys(pathSandbox.window));
  vm.runInNewContext(fs.readFileSync(path.join(root, 'courses', name), 'utf8'), pathSandbox, { filename: `courses/${name}` });
  const added = Object.keys(pathSandbox.window).filter(key => !before.has(key));
  assert.equal(added.length, 1, `courses/${name}: 恰好暴露一个新全局（课程文件单全局约定）`);
  pathCourses.push(pathSandbox.window[added[0]]);
}
vm.runInNewContext(fs.readFileSync(path.join(root, 'curriculum.js'), 'utf8'), pathSandbox, { filename: 'curriculum.js' });
const pathCurriculum = pathSandbox.window.ODIN_CURRICULUM;
/* 已开放的路径课 id（含中文课名等正文数据，用于「来源课程存在且已开放」断言） */
const pathLessons = pathCourses.flatMap(course => course.lessons);
const pathOpenIds = new Set(pathLessons.map(l => l.id));
const pathLessonById = id => pathLessons.find(l => l.id === id);
/* curriculum 里的官方章节表（批次 4 起按**带前缀键** `<courseId>/<sectionId>` 建，
 * 与路径课 Boss unitId 同形）：裸 section id 建表会让 javascript 与 react 的同名
 * introduction 互相覆盖——那是真实存在的跨 World 撞名，见下方 SECTION_ID_OCCURRENCES
 * 与 §3 的「已知撞名钉住」断言。 */
const SECTION_BY_UNIT = new Map();
const SECTION_ID_OCCURRENCES = new Map();
pathCurriculum.courses.forEach(course => {
  (course.sections || []).forEach(sec => {
    SECTION_BY_UNIT.set(`${course.id}/${sec.id}`, {
      courseId: course.id,
      courseOrder: course.order,
      zh: sec.zh,
      slugs: sec.lessons.map(l => l.slug),
      /* 非 Project 课（可出题课）清单：Boss 题目来源只能落在知识课上——
       * Project 课不出题（任务型课不考实现），来源覆盖上限受此约束（阶段 3 迁移） */
      knowledgeSlugs: sec.lessons.filter(l => l.type !== 'project').map(l => l.slug),
      /* Foundations 的章节不在这张表里（它走 catalog 口径），所以这里只可能是路径课 */
      fullyOpen: sec.lessons.length > 0 && sec.lessons.every(l => pathOpenIds.has(l.slug))
    });
    const owners = SECTION_ID_OCCURRENCES.get(sec.id) || [];
    owners.push(course.id);
    SECTION_ID_OCCURRENCES.set(sec.id, owners);
  });
});
/* Foundations 的单元 id 集合（= catalog 的 group id）——用来把 Boss 分成两类分别校验 */
const FOUNDATION_UNIT_IDS = new Set(catalog.groups.map(g => g.id));

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
  assert.equal(brief.openNodes, 46, check('当前开放 46 个节点（Foundations 全开）'));
  assert.equal(brief.counts.locked, 0, check('未开放 0 个节点（Foundations 全开，locked 机制为未来扩展保留）'));
  assert.equal(brief.counts.defeated, 1, check('第一课已击破'));
  assert.equal(brief.counts.broken, 1, check('第二课已破甲'));
  assert.equal(brief.counts.scouted, 1, check('第三课已侦察'));
  assert.equal(brief.counts.unexplored, 43, check('其余开放课未探索'));
  assert.equal(brief.units.length, 8, check('8 个单元'));

  /* 每单元：开放数、Boss 入口 */
  const byId = Object.fromEntries(brief.units.map(unit => [unit.group.id, unit]));
  assert.equal(byId['introduction'].openCount, 5, check('Introduction 开放 5 节点'));
  assert.equal(byId['html-foundations'].openCount, 8, check('HTML Foundations 本站开放 8 节点（与官方 8 课重合，含 Project: Recipes）'));
  assert.equal(byId['html-foundations'].totalCount, 8, check('HTML Foundations 官方 8 节点全部可见'));
  assert.equal(byId['css-foundations'].openCount, 5, check('CSS Foundations 开放 5 节点（v4.11.18 收组，官方 5 课全开放）'));
  assert.equal(byId['flexbox'].openCount, 5, check('Flexbox 开放 5 节点（v4.11.19 第三批收组，官方 5 课全开放）'));
  for (const unitId of ['introduction', 'prerequisites', 'git-basics', 'html-foundations', 'css-foundations', 'flexbox', 'javascript-basics']) {
    assert.ok(byId[unitId].boss, check(`已开放单元 ${unitId} 有 Boss 入口`));
  }
  /* v4.11.20 第九批：javascript-basics 组 15/15 收齐（第 45 课 Calculator 起补全），
   * 按 P3/P6 先例同批收组配 Boss「全栈试炼」（7 题）。 */
  assert.equal(byId['javascript-basics'].openCount, 15, check('JavaScript Basics 开放 15 节点（15/15 全组开放，官方该单元共 15 门）'));
  assert.equal(byId['conclusion'].openCount, 1, check('Conclusion 开放 1 节点（单课组，Foundations 毕业课）'));
  assert.ok(byId['javascript-basics'].boss, check('javascript-basics 全组开放，配 Boss「全栈试炼」（P3/P6 先例：全组开放的同批收组）'));
  assert.equal(byId['conclusion'].boss, null, check('conclusion 单课组不配 Boss（知识点不足以出综合预检题，题目必须来自已讲知识）'));
  /* v4.11.18：css-foundations 全组 5 课开放（用户在 v4.11.17 拍板「等全组开放再配 Boss」的
   * 时机已到），本轮配 Boss「层叠高塔」；v4.11.17 的「有开放节点但不配 Boss」特例断言随之删除。
   * v4.11.19 第三批：flexbox 组 5/5 全组开放（第 30 课 Project: Landing Page），
   * 本轮配 Boss「弹性矩阵」并从「没有 Boss 入口」名单移出。 */

  /* 未开放节点结构上不可点击；Project 节点有标记 */
  const lockedNodes = brief.units.flatMap(unit => unit.nodes).filter(node => node.status === 'locked');
  assert.equal(lockedNodes.length, 0, check('0 个 locked 节点'));
  assert.ok(lockedNodes.every(node => node.linkable === false), check('locked 节点不可点（linkable=false，UI 不生成链接）'));
  const allNodes = brief.units.flatMap(unit => unit.nodes);
  const projectNodes = allNodes.filter(node => node.type === 'project');
  assert.equal(projectNodes.length, 5, check('5 个 Project 节点（形状不同）'));
  /* v4.11.16：recipes 开放后不再是 locked——首个开放的 Project 节点。 */
  const recipesNode = projectNodes.find(node => node.slug === 'recipes');
  assert.ok(recipesNode && recipesNode.status !== 'locked' && recipesNode.linkable === true,
    check('recipes 是首个开放的 Project 节点（可点、非灰点）'));
  /* v4.11.20 第八批：calculator 开放，5 个 Project 节点全部可点。 */
  assert.equal(projectNodes.filter(node => node.status === 'locked').length, 0,
    check('全部 5 个 Project 节点已开放（无 locked Project）'));
  /* v4.11.20 第三批：rock-paper-scissors 开放，第三个可点的 Project 节点 */
  const rpsNode = projectNodes.find(node => node.slug === 'rock-paper-scissors');
  assert.ok(rpsNode && rpsNode.status !== 'locked' && rpsNode.linkable === true,
    check('rock-paper-scissors 是第三个开放的 Project 节点（可点、非灰点）'));
  /* v4.11.19 第三批：landing-page 开放，第二个可点的 Project 节点 */
  const landingNode = projectNodes.find(node => node.slug === 'landing-page');
  assert.ok(landingNode && landingNode.status !== 'locked' && landingNode.linkable === true,
    check('landing-page 是第二个开放的 Project 节点（可点、非灰点）'));

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
  /* World 2 第三批（2026-09-26）：Boss 分两类校验，粒度都是「官方章节」。
   * Foundations 侧 unitId = catalog 的 group id（8 组里 conclusion 单课组刻意不配 → 7 个）；
   * 路径课侧 unitId（批次 4 命名约定变更后）= `<courseId>/<sectionId>`——斜杠是两类
   * unitId 的形态分界：Foundations 分组 id 不含斜杠且原样保留（已写进用户真实档案），
   * 路径课带 course 前缀（裸 section id 已实测跨命名空间撞名：javascript 的
   * introduction 与 Foundations 分组 id 同名、又与 react 的 section id 同名，
   * state.bosses 以 unitId 单键存纪录，撞名会串档）。
   * **必要条件（双向钉死）**：路径课 Boss 只允许挂在「已全部开放的章节」上——题目只能来自
   * 站内已讲知识，半开章节配 Boss 必然超纲，这条断言就是防它。
   * 反向（「全开放的章节就必须配 Boss」）仍**不作为普遍规则钉死**：单课章节知识点不足
   * 不配 Boss 的先例（conclusion 单课组）依然有效。但 World 2 的四个已开放章节按
   * 2026-09-26 用户拍板已全部配齐（含补配的 intermediate-html-concepts 与 forms），
   * 该拍板结果由 §6b 的具名断言钉住——四个章节任何一个的 Boss 被删都会红。 */
  const foundBosses = bossesModule.BOSSES.filter(b => !b.unitId.includes('/'));
  const pathBosses = bossesModule.BOSSES.filter(b => b.unitId.includes('/'));
  assert.equal(foundBosses.length, 7, check('Foundations 侧 7 个已开放单元各一个 Boss（8 组减去刻意不配的 conclusion 单课组）'));
  assert.equal(bossesModule.BOSSES.length, foundBosses.length + pathBosses.length, check('BOSSES 里 unitId 只有两种形态：不带斜杠 = Foundations 分组 id，带斜杠 = 路径课 <courseId>/<sectionId>，不存在第三种'));
  for (const boss of foundBosses) {
    assert.ok(FOUNDATION_UNIT_IDS.has(boss.unitId), check(`Foundations 侧 Boss ${boss.unitId}: unitId 是 catalog.js 的真实分组 id（方案 B 承诺：Foundations 侧分组 id 原样保留不加前缀）`));
  }
  /* 方案 C 断言 ①（2026-09-26 批次 4）：全局唯一。撞名修复的根因就是同名键，
   * 唯一性是防回归的硬断言——任何两个 Boss 共用 unitId（含 Foundations 与路径课
   * 之间）都会让 state.bosses 串档，这里先红。 */
  const allUnitIds = bossesModule.BOSSES.map(b => b.unitId);
  assert.equal(new Set(allUnitIds).size, allUnitIds.length, check('BOSSES 全部 unitId 全局唯一（方案 C：state.bosses 单键存储，撞名 = 档案串档）'));
  /* 方案 C 断言 ②：路径课 unitId 的前缀必须是 curriculum.courses 里真实存在的
   * course id，后缀必须是该 course 里真实存在的 section id——前缀写错会让 Boss
   * 挂到不存在的章节上（地图入口永远不渲染，题库成孤儿）。 */
  for (const boss of pathBosses) {
    const segments = boss.unitId.split('/');
    assert.equal(segments.length, 2, check(`路径课 Boss ${boss.unitId}: unitId 恰好一个斜杠（<courseId>/<sectionId>，经 bosses.js pathBossUnitId 约定构造）`));
    assert.ok(pathCurriculum.courses.some(c => c.id === segments[0]), check(`路径课 Boss ${boss.unitId}: 前缀是 curriculum.js 里真实存在的 course id`));
    const sec = SECTION_BY_UNIT.get(boss.unitId);
    assert.ok(sec, check(`路径课 Boss ${boss.unitId}: 后缀是该 course 里真实官方章节的既有 id（批次 4 命名约定：不新造章节名，只在既有 id 前加 course 前缀隔离命名空间）`));
    assert.ok(sec.fullyOpen, check(`路径课 Boss ${boss.unitId}（${sec ? sec.zh : '?'}）: 该章节已全部开放才允许配 Boss（题目只能来自站内已讲知识，共 ${sec ? sec.slugs.length : 0} 课）`));
  }
  /* 方案 C 断言 ③（钉住事实、不修数据）：curriculum 全 section 的裸 id 跨 World
   * 重复清单。现存撞名实测恰有一组——javascript × react 的 introduction（前缀方案
   * 的动因之一）；本批不改 curriculum 数据（超出范围），等 World 5 开工前再定处置。
   * 断言钉成精确清单：出现**新**撞名立即红；该撞名若被修复同样红（届时更新清单
   * 并登记理由）。SECTION_BY_UNIT 按带前缀键建表，正是为了不被这组撞名覆盖。 */
  const duplicateSectionIds = [...SECTION_ID_OCCURRENCES.entries()]
    .filter(([, owners]) => owners.length > 1)
    .map(([id, owners]) => ({ id, owners: [...owners].sort() }))
    .sort((a, b) => (a.id < b.id ? -1 : 1));
  assert.deepEqual(local(duplicateSectionIds), [{ id: 'introduction', owners: ['javascript', 'react'] }],
    check('curriculum 跨 World 重复的裸 section id 已知清单恰为 introduction（javascript × react）——只钉住事实不修数据，新增撞名或修复本条都要同步改这里'));
  const catalogById = Object.fromEntries(catalog.lessons.map(entry => [entry.slug, entry]));
  for (const boss of bossesModule.BOSSES) {
    const isPath = boss.unitId.includes('/');
    assert.ok(boss.unitId && boss.zh && boss.desc, check(`${boss.unitId}: 元信息齐全`));
    assert.ok(boss.questions.length >= 5 && boss.questions.length <= 8, check(`${boss.unitId}: 题量 5–8（综合自测不是题库轰炸）`));
    for (const [index, question] of boss.questions.entries()) {
      assert.ok(question.q && question.q.length > 5, check(`${boss.unitId}#${index}: 有题干`));
      assert.equal(question.options.length, 4, check(`${boss.unitId}#${index}: 四个选项`));
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, check(`${boss.unitId}#${index}: 答案下标合法`));
      assert.ok(question.explain && question.explain.length > 5, check(`${boss.unitId}#${index}: 有解析`));
      /* 题目必须来自当前站内已讲知识：来源课程存在、已开放、且属于本单元——
       * 两条路径各自的「存在/已开放/属于本单元」判据不同，但三条保护一条不少。 */
      if (isPath) {
        const source = pathLessonById(question.lessonId);
        assert.ok(source, check(`${boss.unitId}#${index}: 来源课程在 courses/*.js 里（题目来自站内已讲知识）`));
        assert.ok(pathOpenIds.has(question.lessonId), check(`${boss.unitId}#${index}: 来源课程已开放（路径课正文在 courses 文件里即已开放）`));
        assert.ok(SECTION_BY_UNIT.get(boss.unitId).slugs.includes(question.lessonId), check(`${boss.unitId}#${index}: 来源课程属于本章节（curriculum.js 的 section 成员）`));
      } else {
        const source = lessonById(question.lessonId);
        assert.ok(source, check(`${boss.unitId}#${index}: 来源课程在 lessons.js 里（题目来自站内已讲知识）`));
        const catalogEntry = catalogById[question.lessonId];
        assert.ok(catalogEntry && catalogEntry.available === true, check(`${boss.unitId}#${index}: 来源课程已开放`));
        assert.equal(catalogEntry.group, boss.unitId, check(`${boss.unitId}#${index}: 来源课程属于本单元`));
      }
      assert.ok(question.options.every(option => typeof option === 'string' && option.length > 0), check(`${boss.unitId}#${index}: 选项文本齐全`));
    }
    /* 每题来源课程尽量分散：覆盖课数达到 min(3, 本单元开放课数, 题数)
     * （git-basics 单元本站只开放 2 课，来源最多 2 课；路径课单元按**非 Project 的
     * 开放课数**计——Project 课不出题，来源覆盖不可能超过知识课数：阶段 3 的
     * javascript/testing-javascript 章节 3 课全开但含 1 门 Project，来源上限 2） */
    const unitOpenLessons = isPath
      ? SECTION_BY_UNIT.get(boss.unitId).knowledgeSlugs.filter(slug => pathOpenIds.has(slug)).length
      : catalog.lessons.filter(entry => entry.group === boss.unitId && entry.available).length;
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
  assert.ok(bossesModule.bossForUnit('css-foundations'), check('css-foundations 已配 Boss（v4.11.18 全组开放）'));
  assert.ok(bossesModule.bossForUnit('flexbox'), check('flexbox 已配 Boss（v4.11.19 第三批全组开放，弹性矩阵）'));
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

  /* 未知单元拒绝：v4.11.20 第九批起 javascript-basics 已配 Boss——用不配 Boss 的
   * conclusion 单课组与不存在的单元 id 双重验证拒绝路径 */
  const unknown = page.submitBoss('conclusion', [0, 0, 0, 0, 0], false);
  assert.equal(unknown.ok, false, check('无 Boss 单元（conclusion）拒绝提交'));
  const notExist = page.submitBoss('not-a-unit', [0], false);
  assert.equal(notExist.ok, false, check('不存在的单元 id 拒绝提交'));

  /* bossBrief：UI 数据齐全且不泄漏答案 */
  const brief = page.bossBrief('introduction');
  assert.equal(brief.attempted, true, check('bossBrief 报告已挑战'));
  assert.equal(brief.record.bestPct, 100, check('bossBrief 带历史最佳'));
  assert.ok(!('questions' in brief), check('bossBrief 不含题目与答案（面板首屏不泄漏）'));

  /* 存储里确实写入了 bosses（刷新不丢） */
  const stored = JSON.parse(storage.getItem('the-odin-project-zh.progress.v1'));
  assert.equal(stored.bosses['introduction'].bestPct, 100, check('Boss 纪录已写入存储'));
  assert.equal(stored.schemaVersion, 4, check('存储档案 schemaVersion 4'));

  /* ---------- 6b. 路径课章节 Boss 走同一条引擎（World 2 第三批新增粒度） ----------
   * 证明的验收标准：Boss 引擎对 unitId 完全泛化——非 Foundations 的 unitId
   * （= curriculum.js 的 section id）同样能取题、提交、评分、持久化、进历史、
   * 参与 tiers 晋升，引擎侧零分支零特例。这一组断言是「Boss 粒度 = 官方章节」
   * 这个架构决定在数据层的唯一保护：若将来有人给路径课另建一套记录表或
   * 在 submitBoss 里加 unitId 白名单，这里先红。
   * 注意：本块刻意放在 tiers 相关断言之后——第三次高评价会把 boss 族推到银阶。 */
  const pathUnit = 'intermediate-html-and-css/intermediate-css-concepts';
  const pathBoss = pageBosses.bossForUnit(pathUnit);
  assert.ok(pathBoss, check('bossForUnit 取得路径课章节 Boss（unitId = <courseId>/<sectionId>，批次 4 前缀约定）'));
  assert.equal(pathBoss.zh, '精修工坊', check('路径课章节 Boss 中文名'));
  const pathSubmission = page.submitBoss(
    pathUnit, pathBoss.questions.map(question => question.answer), true);
  assert.equal(pathSubmission.ok, true, check('路径课章节 Boss 提交成功（引擎未对 unitId 设白名单）'));
  assert.equal(pathSubmission.unitId, pathUnit, check('submitBoss 原样回显路径课 unitId'));
  assert.equal(pathSubmission.result.pct, 100, check('路径课章节 Boss 评分 100%'));
  assert.equal(pathSubmission.result.rating, 'dominant', check('路径课章节 Boss 评级压倒性优势'));
  const pathState = page.getState();
  assert.equal(pathState.bosses[pathUnit].attempts, 1, check('路径课 Boss 记录与 Foundations 同住一张 bosses 表'));
  assert.equal(pathState.bosses[pathUnit].firstWasPrecheck, true, check('路径课 Boss 预检口径记录'));
  assert.equal(pathState.bosses[pathUnit].precheckBestPct, 100, check('路径课 Boss 预检最佳 100'));
  assert.ok(pathState.history.some(event => event.type === 'boss-attempt'
    && /精修工坊/.test(event.zh || (event.data && event.data.zh) || '')),
  check('路径课 Boss 挑战记入学习历史（事件文案带 Boss 中文名）'));
  /* 第三次高评价（introduction / prerequisites / 本章）→ boss 族银阶：
   * 晋升判定按跨单元计数，同样不认识「路径课」这个概念 */
  assert.equal(pathState.achievementTiers['boss'], 2, check('boss 族晋升银阶（高评价 3 次，跨 Foundations 与路径课单元累计）'));
  const pathBrief = page.bossBrief(pathUnit);
  assert.equal(pathBrief.attempted, true, check('bossBrief 对路径课 unitId 报告已挑战（地图圆点据此换成 ☗）'));
  assert.equal(pathBrief.record.bestPct, 100, check('bossBrief 带路径课 Boss 历史最佳'));
  assert.ok(!('questions' in pathBrief), check('bossBrief 不含题目与答案（路径课同样不泄漏）'));
  const pathStored = JSON.parse(storage.getItem('the-odin-project-zh.progress.v1'));
  assert.equal(pathStored.bosses[pathUnit].bestPct, 100, check('路径课 Boss 纪录已写入存储（刷新不丢）'));
  /* World 2 第五批（2026-09-26，v4.11.22）用户拍板落地钉：World 2 四个已开放章节
   * （中级 HTML 概念 / 中级 CSS 概念 / 表单 / Grid 布局）各配一个章节 Boss——
   * 补配了此前缓配的 intermediate-html-concepts 与 forms 两章，使四个章节口径一致。
   * 本断言钉的是**这次拍板的结果**（四个具名章节必须有 Boss），不是普遍规则
   * 「已全开必须配」——单课章节知识点不足不配 Boss 的先例（conclusion）仍然是
   * 有效的产品决定，普遍化会与之冲突。批次 4 起具名 id 带 course 前缀。 */
  for (const unit of ['intermediate-html-and-css/intermediate-html-concepts', 'intermediate-html-and-css/intermediate-css-concepts', 'intermediate-html-and-css/forms', 'intermediate-html-and-css/grid']) {
    assert.ok(pageBosses.bossForUnit(unit), check(`${unit}: World 2 已开放章节各配一个 Boss（2026-09-26 用户拍板补齐）`));
  }
  /* World 3 批次 4 阶段 1（2026-09-26，v4.11.23）：「组织 JavaScript 代码」章节
   * 14/14 全开即配（javascript/organizing-your-javascript-code「对象熔炉」8 题）；
   * 引言章节单课不配（conclusion 单课先例），负例清单里保留 javascript/introduction。 */
  assert.ok(pageBosses.bossForUnit('javascript/organizing-your-javascript-code'),
    check('javascript/organizing-your-javascript-code: World 3 首个全开章节按「全开即配」口径配有 Boss（批次 4 阶段 1）'));
  /* World 3 批次 4 阶段 2（2026-09-27，v4.11.24）：「真实世界的 JavaScript」3/3 与
   * 「异步 JavaScript 与 API」4/4 两章全开即配（「真实世界回廊」5 题 +「异步钟楼」
   * 7 题；Project 课 weather-app 不出题）。负向验证 NV2 实测：本断言补位前删除
   * 「异步钟楼」条目 map-boss 不红——缺口由负向验证发现、当轮补齐。 */
  assert.ok(pageBosses.bossForUnit('javascript/javascript-in-the-real-world'),
    check('javascript/javascript-in-the-real-world: 阶段 2 全开章节按「全开即配」口径配有 Boss'));
  assert.ok(pageBosses.bossForUnit('javascript/asynchronous-javascript-and-apis'),
    check('javascript/asynchronous-javascript-and-apis: 阶段 2 全开章节按「全开即配」口径配有 Boss'));
  /* World 3 批次 4 阶段 3（2026-09-27，v4.11.25）：「测试 JavaScript」3/3 与
   * 「一点计算机科学」11/11 两章全开即配（「试炼考馆」5 题 +「算法之塔」8 题；
   * 6 门 Project 课 testing-practice / recursion / linked-lists / hashmap /
   * binary-search-trees / knights-travails 不出题）。 */
  assert.ok(pageBosses.bossForUnit('javascript/testing-javascript'),
    check('javascript/testing-javascript: 阶段 3 全开章节按「全开即配」口径配有 Boss'));
  assert.ok(pageBosses.bossForUnit('javascript/a-bit-of-computer-science'),
    check('javascript/a-bit-of-computer-science: 阶段 3 全开章节按「全开即配」口径配有 Boss'));
  /* World 3 批次 4 阶段 4（2026-09-27，v4.11.26）：「Git 进阶」3/3 全开即配
   * （「时间线回廊」6 题）。「JavaScript 收尾」章节全开但**不配**——用户指令口径
   * 「finishing-up 按知识点判断」：本章 2 课中 battleship 为 Project 课不出题、
   * conclusion 为约 1.2KB 的结语祝贺信（官方无 Assignment 节、无知识点可考），
   * 无新增可出题课——与「单课章节不配」（introduction / conclusion 先例）同一
   * 精神；该章进入下方「未配 Boss 拒绝」负例名单（全站首个「已开放但不配」的
   * 真实负例）。World 3 全 41 课就此收组。 */
  assert.ok(bossesModule.bossForUnit('javascript/intermediate-git'),
    check('javascript/intermediate-git: 阶段 4 全开章节按「全开即配」口径配有 Boss'));
  /* World 4 批次 5 阶段 1（2026-09-27，v4.11.27）：「动画」章节 3/3 全开即配
   * （「幻化剧场」7 题，unitId = advanced-html-and-css/animation——World 4 首个
   * Boss 单元，前缀约定沿用阶段 0 的 pathBossUnitId 构造）。「无障碍」与「响应式
   * 设计」两章节尚未开放，进入下方负例名单（animation 随本批开放移出）。 */
  assert.ok(bossesModule.bossForUnit('advanced-html-and-css/animation'),
    check('advanced-html-and-css/animation: 批次 5 阶段 1 全开章节按「全开即配」口径配有 Boss'));
  /* World 4 批次 5 阶段 2（2026-09-27，v4.11.28）：「无障碍」章节 8/8 全开即配
   * （「回音廊道」7 题，unitId = advanced-html-and-css/accessibility，前缀约定
   * 沿用 pathBossUnitId 构造；auditing 为工具操作课不单独出题、知识点已被前七题
   * 覆盖）。负例名单随之迁移：accessibility 移出（本批已配）、「响应式设计」
   * 仍在（未开放章节——批次 5 阶段 3 已配后再次迁出，见下）。 */
  assert.ok(bossesModule.bossForUnit('advanced-html-and-css/accessibility'),
    check('advanced-html-and-css/accessibility: 批次 5 阶段 2 全开章节按「全开即配」口径配有 Boss'));
  /* World 4 批次 5 阶段 3（2026-09-27，v4.11.29，World 4 收组）：「响应式设计」
   * 章节 5/5 全开即配（「千形台」7 题，unitId = advanced-html-and-css/
   * responsive-design，前缀约定沿用；homepage 为 Project 课不出题——全站
   * Project 课不出 Boss 题纪律）。**World 4 全 16 课收组、全站 20 个 Boss 单元
   * 127 题**。负例名单随之迁移：responsive-design 移出（本批已配），换入
   * react/introduction（World 5 未开放章节的真实前缀形态）。 */
  assert.ok(bossesModule.bossForUnit('advanced-html-and-css/responsive-design'),
    check('advanced-html-and-css/responsive-design: 批次 5 阶段 3 全开章节按「全开即配」口径配有 Boss'));
  /* World 5 批次 6 阶段 1（2026-09-27，v4.11.30，World 5 开篇）：「引言」3/3 与
   * 「React 入门」5/5 两章全开即配（「启航栈桥」6 题 +「组件工坊」7 题，unitId =
   * react/introduction 与 react/getting-started-with-react，前缀约定沿用
   * pathBossUnitId 构造）。react/introduction 正是上方 duplicateSectionIds 撞名
   * 清单里的那组——前缀方案隔离后 Foundations 的 introduction Boss 原样保留、
   * javascript/introduction 仍取不到题（下方负例名单不动）。**全站 22 个 Boss
   * 单元 140 题**。负例名单随之迁移：react/introduction 移出（本批已配），换入
   * react/states-and-effects 与 react/class-components（阶段 2 未开放章节）。 */
  assert.ok(bossesModule.bossForUnit('react/introduction'),
    check('react/introduction: 批次 6 阶段 1 全开章节按「全开即配」口径配有 Boss（与 Foundations / javascript 的 introduction 三方撞名由前缀隔离）'));
  assert.ok(bossesModule.bossForUnit('react/getting-started-with-react'),
    check('react/getting-started-with-react: 批次 6 阶段 1 全开章节按「全开即配」口径配有 Boss'));
  /* World 5 批次 6 阶段 2（2026-09-28，v4.11.31）：「状态与副作用」5/5 与「类组件」
   * 2/2 两章全开即配（「潮汐观测所」7 题——cv-application 与 memory-card 两门
   * Project 课不出题、题源限三门知识课 +「齿轮档案厅」5 题，unitId = react/
   * states-and-effects 与 react/class-components，前缀约定沿用 pathBossUnitId 构造）。
   * **class-components 配 Boss 的判据结论（用户指令：按知识点是否足够判断）**：两课
   * 均为知识课且知识点密度足（类组件语法四步 / this 绑定两方案 / 生命周期四方法
   * 分工 / useEffect 四行对照），可支撑 5 题下限——与 finishing-up-with-javascript
   * 不配的先例（2 课中 1 门 Project 不出题 + 1 门结语信无知识点，实际 0 课可出题）
   * 本质不同，理由全文登记 bosses.js 单元注释与本断言。**全站 24 个 Boss 单元
   * 152 题**。负例名单随之迁移：states-and-effects 与 class-components 移出
   * （本批已配），换入 react/react-testing 与 react/the-react-ecosystem
   * （阶段 3 未开放章节）。 */
  assert.ok(bossesModule.bossForUnit('react/states-and-effects'),
    check('react/states-and-effects: 批次 6 阶段 2 全开章节按「全开即配」口径配有 Boss（两门 Project 课不出题）'));
  assert.ok(bossesModule.bossForUnit('react/class-components'),
    check('react/class-components: 批次 6 阶段 2 全开章节按知识点判据配有 Boss（两课知识密度足支撑 5 题下限，理由见上）'));
  /* World 5 批次 6 阶段 3（2026-09-28，v4.11.32，World 5 收组）：「React 测试」2/2、
   * 「React 生态」4/4、「更多 React 概念」3/3 三章全开即配（「试镜堂」6 题——两课
   * 均知识课、知识点密度判据沿用阶段 2 class-components 口径 +「百工市集」7 题——
   * shopping-cart 为 Project 课不出题、题源限三门知识课 +「隐枢阁」7 题，unitId 经
   * pathBossUnitId 构造前缀约定沿用）。**「结语」章 1/1 全开但不配 Boss**：react 版
   * conclusion 为祝贺信 + 下一步指引，无实打实可考知识点——与 finishing-up-with-
   * javascript 不配先例同型（「实际 0 课可出题」），本站第二个「已开放但不配」真实
   * 负例，理由全文登记 bosses.js 单元注释与本断言、负例名单换入 react/conclusion。
   * **全站 27 个 Boss 单元 172 题**。负例名单随之迁移：react/react-testing 与
   * react/the-react-ecosystem 移出（本批已配），换入 react/conclusion。 */
  assert.ok(bossesModule.bossForUnit('react/react-testing'),
    check('react/react-testing: 批次 6 阶段 3 全开章节按知识点判据配有 Boss（两课知识密度足支撑 5 题下限，class-components 判据沿用）'));
  assert.ok(bossesModule.bossForUnit('react/the-react-ecosystem'),
    check('react/the-react-ecosystem: 批次 6 阶段 3 全开章节按「全开即配」口径配有 Boss（shopping-cart Project 课不出题）'));
  assert.ok(bossesModule.bossForUnit('react/more-react-concepts'),
    check('react/more-react-concepts: 批次 6 阶段 3 全开章节按「全开即配」口径配有 Boss'));
  /* 超长轮批次 7 阶段 1（2026-09-28，v4.11.33，World 6 收组）：databases 课程
   * 「数据库」章节 3/3 全开即配「万卷地宫」6 题（unitId = databases/databases，
   * 前缀约定沿用 pathBossUnitId 构造；SQL Zoo 为 Project 课不出题，题源限导论与
   * 数据库与 SQL 两门知识课）。**World 6 全 3 课就此收组**。databases/databases
   * 已配故不入负例名单；负例名单维持不变——nodejs/introduction-to-nodejs 是
   * World 7 未开放章节的真实前缀形态（本批未触及 World 7）。 */
  assert.ok(bossesModule.bossForUnit('databases/databases'),
    check('databases/databases: 超长轮批次 7 阶段 1 全开章节按「全开即配」口径配有 Boss（SQL Zoo Project 课不出题）'));
  /* 超长轮批次 7 阶段 2（2026-09-28，v4.11.34，NodeJS 入门 6 课 + Express 11 课开放）：
   * nodejs 课程「NodeJS 入门」6/6 全开即配「机枢洞府」6 题（basic-info-site 为
   * Project 课不出题，题源限 5 门知识课）、「Express」11/11 全开即配「飞马驿城」7 题
   * （mini-message-board 与 inventory-application 两门 Project 课不出题；
   * installing-postgresql 为一次性安装操作无综合考点、psql 与 SQL 基础已由万卷地宫
   * 覆盖——不重复出题按「与已有信息重叠不配」同站口径）。unitId 均经 pathBossUnitId
   * 构造（nodejs/introduction-to-nodejs、nodejs/express）。**全站 30 个 Boss 单元、
   * 191 题**。负例名单随之迁移：nodejs/introduction-to-nodejs 移出（阶段 1 登记的
   * 「World 7 未开放章节真实前缀形态」占位就此转正），换入 nodejs/authentication
   * （World 7 下一章、本站未开放）。 */
  assert.ok(bossesModule.bossForUnit('nodejs/introduction-to-nodejs'),
    check('nodejs/introduction-to-nodejs: 超长轮批次 7 阶段 2 全开章节按「全开即配」口径配有 Boss（basic-info-site Project 课不出题）'));
  assert.ok(bossesModule.bossForUnit('nodejs/express'),
    check('nodejs/express: 超长轮批次 7 阶段 2 全开章节按「全开即配」口径配有 Boss（两门 Project 课不出题、installing-postgresql 无综合考点不出题）'));
  /* 超长续轮批次 7 阶段 3（2026-09-29，v4.11.35，World 7 后六章 13 课收组）：
   * 配 4 章 Boss——「符印秘阁」6 题（nodejs/authentication，members-only Project
   * 不出题、题源限 authentication-basics 单知识课但密度极高，databases-and-sql
   * 单课配 Boss 先例同型）+「铸模工坊」5 题（nodejs/orms，file-uploader Project
   * 不出题、题源限 prisma-orm 单知识课）+「传信云驿」6 题（nodejs/apis，blog-api
   * Project 不出题、题源限 api-basics 与 api-security 两知识课）+「验路校场」6 题
   * （nodejs/testing-express，题源限 testing-routes 与 testing-database 两知识课）。
   * **全站 34 个 Boss 单元、214 题**。不配 2 章进入负例名单：full-stack-projects
   * （wheres-waldo + messaging-app 皆 Project，题源为空）与 final-project
   * （odin-book Project + conclusion 结语祝贺信无可考知识点——finishing-up /
   * react-conclusion「已开放但不配」先例同型，全站第三个真实负例）。负例名单随之
   * 迁移：nodejs/authentication 移出（阶段 2 登记的「World 7 下一章未开放」占位
   * 就此转正配 Boss），换入 nodejs/full-stack-projects、nodejs/final-project 两个
   * 「已开放但不配」负例 + getting-hired/preparing-for-your-job-search（World 8
   * 下一章、本站未开放的真实前缀占位）。
   * 超长续轮批次 7 阶段 4（2026-09-29，v4.11.36，World 8 收组、全站收官）负例名单
   * 再迁移：getting-hired/preparing-for-your-job-search 移出转正（开放即配「秣马营」
   * 6 题）；getting-hired/applying-to-and-interviewing-for-jobs 同轮直接转正入列
   * （「折桂台」7 题）。**全站 36 个 Boss 单元、227 题**——8 个 World 全部开放后，
   * 所有可配章节均已配 Boss；负例名单定格 5 个：javascript/introduction（撞名
   * 回归钉）+ finishing-up / react-conclusion / nodejs/full-stack-projects /
   * nodejs/final-project 四个「已开放但不配」（Project 课与结语祝贺信无可考
   * 知识点）。 */
  assert.ok(bossesModule.bossForUnit('getting-hired/preparing-for-your-job-search'),
    check('getting-hired/preparing-for-your-job-search: 阶段 4 全开章节按「全开即配」口径配有 Boss（秣马营 6 题；htcww 导论与 portfolio Project 不出题）'));
  assert.ok(bossesModule.bossForUnit('getting-hired/applying-to-and-interviewing-for-jobs'),
    check('getting-hired/applying-to-and-interviewing-for-jobs: 阶段 4 全开章节按「全开即配」口径配有 Boss（折桂台 7 题；resume Project 与 conclusion 结语信不出题）'));
  assert.ok(bossesModule.bossForUnit('nodejs/authentication'),
    check('nodejs/authentication: 阶段 3 全开章节按「全开即配」口径配有 Boss（members-only Project 课不出题、题源限 authentication-basics）'));
  assert.ok(bossesModule.bossForUnit('nodejs/orms'),
    check('nodejs/orms: 阶段 3 全开章节按「全开即配」口径配有 Boss（file-uploader Project 课不出题、题源限 prisma-orm）'));
  assert.ok(bossesModule.bossForUnit('nodejs/apis'),
    check('nodejs/apis: 阶段 3 全开章节按「全开即配」口径配有 Boss（blog-api Project 课不出题、题源限 api-basics 与 api-security）'));
  assert.ok(bossesModule.bossForUnit('nodejs/testing-express'),
    check('nodejs/testing-express: 阶段 3 全开章节按「全开即配」口径配有 Boss（题源限 testing-routes 与 testing-database 两知识课）'));
  /* 未配 Boss 的路径课章节一律拒绝——「全组开放才配」的另一半保护：没配的章节
   * 不能靠 submitBoss 蒙混出记录。负例用**带前缀**的新约定 id（World 3+ 的真实
   * 章节，curriculum.js 里存在、本站未开放或未全开、BOSSES 里没有）。
   * 批次 4 撞名修复的回归钉：javascript/introduction 是曾与 Foundations 分组 id
   * 撞名的裸 id 的前缀形态——它必须取不到题，而 Foundations 的 introduction Boss
   * 原样保留（方案 B 承诺 Foundations 侧 8 个分组 id 不动、档案不失联）。 */
  assert.ok(pageBosses.bossForUnit('introduction'), check('Foundations 分组 id introduction 的 Boss 原样保留（方案 B：Foundations 侧不加前缀、已解锁记录不失联）'));
  assert.equal(pageBosses.bossForUnit('javascript/introduction'), null, check('javascript/introduction 无题库（前缀隔离后不再与 Foundations 的 introduction 混淆）'));
  for (const unit of ['javascript/introduction', 'javascript/finishing-up-with-javascript', 'react/conclusion', 'nodejs/full-stack-projects', 'nodejs/final-project']) {
    assert.equal(pageBosses.bossForUnit(unit), null, check(`${unit}: 未配 Boss 的章节取不到题`));
    assert.equal(page.submitBoss(unit, [0, 0, 0, 0, 0], false).ok, false, check(`${unit}: 未配 Boss 的章节拒绝提交`));
  }
}

/* ===================== 6c. 路径课 Boss 旧键一次性重映射（2026-09-26 批次 4，方案 B 档案兼容） =====================
 * 证明的验收标准：以旧约定（裸 section id 键）写进 state.bosses 的档案条目，
 * 读档时搬到 `<courseId>/<sectionId>` 新键、数据一条不丢（防御性处理，不静默丢弃）；
 * Foundations 键原样保留；新旧键并存时新键优先；带前缀新键能通过读档白名单
 * （BOSS_UNIT_ID_PATTERN——若仍用 ASSET_ID_PATTERN 的 32 字符上限，新键纪录会
 * 在每次读档时被整条丢掉，这是本组最重要的回归钉）。 */
{
  const rec = (bestPct, attempts) => ({ attempts, passCount: 1, highCount: 1, lastPassDay: DAY, lastHighDay: DAY, bestPct, firstPct: bestPct, lastPct: bestPct, firstWasPrecheck: false, precheckBestPct: null });
  const load = bosses => Logic.sanitizeState({ schemaVersion: 4, bosses }, [], { lenient: true });

  /* ① 旧 4 键全部搬到新键，纪录逐字段保留；Foundations 键不动 */
  const legacy = load({
    'intermediate-html-concepts': rec(60, 1),
    'intermediate-css-concepts': rec(71, 2),
    'forms': rec(80, 3),
    'grid': rec(100, 4),
    'introduction': rec(57, 5)
  });
  assert.equal(legacy.ok, true, check('旧键档案读档成功（宽容模式）'));
  assert.equal(Object.keys(Logic.LEGACY_PATH_BOSS_UNIT_IDS).length, 4, check('重映射表恰好覆盖 World 2 存量四个路径课 Boss 键（不多不少）'));
  for (const [oldId, newId] of Object.entries(Logic.LEGACY_PATH_BOSS_UNIT_IDS)) {
    assert.ok(!Object.prototype.hasOwnProperty.call(legacy.state.bosses, oldId), check(`旧键 ${oldId} 读档后不再存在（一次性搬运）`));
    assert.ok(legacy.state.bosses[newId], check(`旧键 ${oldId} 的纪录已落到新键 ${newId}`));
  }
  assert.equal(legacy.state.bosses['intermediate-html-and-css/grid'].bestPct, 100, check('grid 旧纪录的 bestPct 原样保留（数据不丢）'));
  assert.equal(legacy.state.bosses['intermediate-html-and-css/grid'].attempts, 4, check('grid 旧纪录的 attempts 原样保留'));
  assert.equal(legacy.state.bosses['intermediate-html-and-css/forms'].passCount, 1, check('forms 旧纪录的 passCount 原样保留'));
  assert.equal(legacy.state.bosses['introduction'].bestPct, 57, check('Foundations 键 introduction 原样保留（重映射只动路径课 4 键）'));
  assert.equal(Object.keys(legacy.state.bosses).length, 5, check('五条纪录一条不多一条不少（无静默丢弃、无重复）'));

  /* ② 新键直接通过读档白名单（BOSS_UNIT_ID_PATTERN 的核心回归）。
   * World 3 批次 4 迁移：示例键从 organizing-your-javascript-code（阶段 1 起已配
   * Boss，不再是「未来」）换成 javascript-in-the-real-world（阶段 2 已配 Boss）再换成 javascript/testing-javascript（阶段 3 已配 Boss）再换成 javascript/intermediate-git（阶段 4 章节，仍未配）。 */
  const modern = load({ 'intermediate-html-and-css/grid': rec(90, 2), 'javascript/intermediate-git': rec(70, 1) });
  assert.equal(modern.state.bosses['intermediate-html-and-css/grid'].bestPct, 90, check('带前缀新键通过读档白名单（ASSET_ID_PATTERN 的 32 上限装不下，必须走 BOSS_UNIT_ID_PATTERN）'));
  assert.equal(modern.state.bosses['javascript/intermediate-git'].bestPct, 70, check('未来章节的前缀键同样通过（javascript course id 真实存在于 curriculum）'));

  /* ③ 新旧键并存：新键优先，旧键不覆盖 */
  const both = load({ 'grid': rec(40, 9), 'intermediate-html-and-css/grid': rec(95, 1) });
  assert.equal(both.state.bosses['intermediate-html-and-css/grid'].bestPct, 95, check('新旧键并存时新键优先（旧键条目不覆盖新键）'));
  assert.equal(Object.keys(both.state.bosses).length, 1, check('并存时只落一条（合并到新键，不产生两份）'));

  /* ④ 白名单边界：非法形态照旧丢弃 */
  const junk = load({ 'GRID': rec(50, 1), 'a/b/c': rec(50, 1), '': rec(50, 1), 'Grid': rec(50, 1) });
  assert.equal(Object.keys(junk.state.bosses).length, 0, check('大写 / 双斜杠 / 空串等非法 unitId 形态仍被丢弃（白名单没有为前缀放宽字符集）'));
  /* 重映射表自身的形态钉：值 = `intermediate-html-and-css/` + 键，且全部通过新模式 */
  for (const [oldId, newId] of Object.entries(Logic.LEGACY_PATH_BOSS_UNIT_IDS)) {
    assert.equal(newId, `intermediate-html-and-css/${oldId}`, check(`重映射表 ${oldId}: 新键 = course 前缀 + 旧键（World 2 存量四章节）`));
    assert.ok(Logic.BOSS_UNIT_ID_PATTERN.test(newId), check(`重映射表 ${oldId}: 新键通过 BOSS_UNIT_ID_PATTERN`));
    assert.ok(!newId.includes('//') && newId.split('/').length === 2, check(`重映射表 ${oldId}: 恰好一个斜杠`));
  }
  /* BOSSES 里每个路径课 unitId 都必须通过读档白名单——写得进档案、读得回来 */
  for (const boss of bossesModule.BOSSES) {
    assert.ok(Logic.BOSS_UNIT_ID_PATTERN.test(boss.unitId), check(`${boss.unitId}: 通过 BOSS_UNIT_ID_PATTERN（题库 id 与读档白名单不脱节）`));
  }
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

console.log(`通过：Foundations 地图与 Boss 挑战 ${checks} 项断言（节点五阶状态推导、46 节点总地图、Boss 入口只在已开放单元、题库全部来自本站已讲课程、评分四档压线边界、同日幂等防刷、首战基线固定、submitBoss 集成解锁成就与晋升、预检口径、goalProgress 指标、无远程引用，「已破甲 / 已击破」两个状态的颜色必须可区分（旧合并规则已拆、击破保留绿底绿描边只把 gap 环换成金环、金对绿底对比度 ≥ 2.2:1、环宽与既有纸环逐字同宽所以几何零改动），以及批次 4 撞名修复三钉：BOSSES unitId 全局唯一、路径课 unitId = <courseId>/<sectionId> 且前缀是真实 course id（curriculum 跨 World 裸 section id 撞名清单钉住 introduction × javascript/react 不扩大）、旧键档案一次性重映射且新键通过读档白名单）。`);
