/* v4.11.2 课页读者向修复的收口断言（交接 §5）。
 *
 * 每项断言证明的验收标准写在分组注释里：
 *   A1 —— 资源区前言三分类计数与该课卡片实际渲染类别数**逐课一致**（由数据算出，
 *         消除课 01「0 条中文版、2 条没有可靠中文版」却渲染两篇精译的自相矛盾）；
 *   A2 —— 资源区前言不再出现核验方法论字样（HTTP 状态码 / 重定向 / 汉字数 / oEmbed），
 *         只保留核验日期与「见首页关于本站」指引（方法论全文由 home-ia.test.cjs
 *         钉住在首页 FAQ 第 4 项）；
 *   B  —— 概念图渲染归位（v4.11.6 全站，v4.11.17 起 49 张）：逐课渲染图数 = 清单数、全部
 *         住在 section-explain 对应章之后（零 main 级漂浮）、git-areas 仍归
 *         git-basics 且 introduction-to-git 只有自己的对比图（数据层绑定由
 *         diagrams.test.cjs 钉住，这里钉渲染结果）；
 *   C  —— 映射文件完整性（20 课、条目号合法、地址零悬空）+ 渲染层（有映射的条目
 *         渲染出链接且 href 属于该课资源、外链纪律、本地动作条目**不渲染**链接、
 *         条目文本一字不改）；
 *   D  —— 修订版立场（D0 本站自足）：section-why 与 section-official 均出现
 *         「中文辅助」引导；末节不再写「仍需在原课逐项完成」；D5 三条保留项在位；
 *         D6 红线禁语（「本站即官方课程」「在本站完成即完成官方课程」等）零出现；
 *         D7 引导语不堆砌（单页「中文辅助」出现次数设上限）。
 *   E  —— v4.11.5（交接 3.A / 3.B / 3.A2）：官方任务节折叠头为
 *         button[aria-expanded] + 受控容器（零新增 details/summary）、资源区
 *         不被折叠容器包裹、页内跳转入口挂在 Assignment 标题内指向
 *         #lesson-resources、折叠偏好随档案（collapseOfficialTasks）生效。
 *
 * v4.11.5（交接 3.C）同步修复：C 组「Assignment 条目文本一字不改」的 OL 取法
 * 由「节级直接子」改为穿透收集——折叠容器包裹 <ol> 后旧取法拿到 0 个，
 * if 守卫静默跳过整段保护（测试全绿但保护空转）；负向验证见「C-负向验证」块。
 *
 * 负向对照（证明这些断言真的能抓到回归）由 .tmpfiles 下的反向补丁实验执行，
 * 结果记录在 answers/ 实施记录中。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const loadData = (file, globalName) => {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox);
  return JSON.parse(JSON.stringify(sandbox.window[globalName]));
};
const guide = loadData('lessons.js', 'ODIN_GUIDE');
const resourceData = loadData('external-resources.js', 'ODIN_RESOURCES');
const taskLinks = loadData('lesson-task-links.js', 'ODIN_TASK_LINKS');

const { newPage, makeStorage, collectByClass, querySelect, archiveJson, STORAGE_KEY } = require('./dom-stub.cjs');
/* v4.11.5（交接 3.B/3.C）：textOf 改用 stub 的 textContent（= 自身文本 + 全部后代
 * 文本），与真实浏览器语义一致。旧实现「有 _text 就忽略子节点」会漏数挂在 h3 内的
 * 跳转链接文字（D7 计数失真），也会让「条目文本一字不改」在 li 带内联链接时
 * 检查不到链接文字。startsWith 类断言在两种语义下结论相同（链接只追加在尾部）。 */
const textOf = el => (!el ? '' : el.textContent || '');
const mountLesson = id => newPage({ storage: makeStorage(), page: 'lesson', search: `?id=${id}`, href: `http://127.0.0.1:8765/lesson.html?id=${id}` });
const mainOf = page => querySelect(page.dom.body, '#main');
const officialOf = page => collectByClass(mainOf(page), 'section-official')[0];
/* 资源区前言 = section-official 的直接子 p（资源卡全部住在 ul.resource-list 里；
 * v4.11.5 折叠容器只包 Assignment / KC 列表，资源区保持节级直接子——被包裹即前言断言碎） */
const preambleTexts = page => (officialOf(page).childNodes || []).filter(n => n.tagName === 'P').map(textOf);
const taskLinksOf = page => collectByClass(mainOf(page), 'task-link');
const urlBase = u => String(u).split('#')[0].replace(/\/+$/, '');
/* v4.11.5（交接 3.C）：按文档序穿透收集 root 下所有指定 tag 的元素。
 * Assignment <ol> 被包进 div.collapse-body 之后，「节级直接子 OL」取法是 0 个，
 * 旧的 if (ols.length) 守卫会整段静默跳过条目文本保护（测试全绿但保护空转）。
 * 前序 DFS：shift 出的元素先入结果，其子节点 unshift 回队首——父先于子、兄先于弟。 */
const collectTagDeep = (root, tagName) => {
  const found = [];
  const stack = [...(root.childNodes || [])];
  while (stack.length) {
    const element = stack.shift();
    if (!element || !element.tagName) continue;
    if (element.tagName === tagName) found.push(element);
    stack.unshift(...(element.childNodes || []));
  }
  return found;
};

const LESSON_IDS = guide.lessons.map(l => l.id);
assert.equal(LESSON_IDS.length, 46, '前提：46 课');

/* ===== C-数据层：映射文件完整性（防悬空引用） ===== */
assert.equal(taskLinks.version, 1, 'C: 映射文件带版本号');
assert.deepEqual(Object.keys(taskLinks.links).sort(), [...LESSON_IDS].sort(),
  'C: 映射文件恰好覆盖全部课程，无未知 lessonId（防悬空课程引用）');
const sourceOf = fs.readFileSync(path.join(root, 'lesson-task-links.js'), 'utf8');
assert.ok(!/\bfetch\(|XMLHttpRequest|innerHTML|document\.cookie/.test(sourceOf),
  'C: 映射文件不联网、不注入标记、不读写 cookie（与其他数据文件同纪律）');
/* v4.11.17：官方 2026-09-23 移除课末自查题一节，本站同步下线——映射文件只剩
 * Assignment 一类。反向钉住：任何一课重新出现 k（自查题）映射即红，
 * 防止有人在数据里把已下线的课节悄悄接回来。 */
assert.ok(Object.values(taskLinks.links).every(entry => entry.k === undefined),
  'C: 自查题映射已整体下线，任何一课都不得再有 k 映射');
/* v4.11.17 反向钉子（数据层）：渲染层已把该区块整体删除——正则里塞回题目不会让
 * 页面上多出元素，因此这道数据层的钉子是该事实的第一道防线。 */
assert.ok(guide.lessons.every(l => l.official.knowledgeCheck.length === 0),
  'C: 官方已下线课末自查题节，全部课程的自查题必须为空数组（塞回任意一条即红）');
let mappedAssignmentItems = 0, mappedAssignmentUrls = 0;
for (const lesson of guide.lessons) {
  const entry = taskLinks.links[lesson.id];
  const lessonUrls = new Set();
  resourceData.resources.filter(r => r.lessonId === lesson.id).forEach(r => {
    lessonUrls.add(urlBase(r.originalUrl));
    if (r.zhUrl) lessonUrls.add(urlBase(r.zhUrl));
  });
  for (const [num, urls] of Object.entries(entry.a || {})) {
    const n = Number(num);
    assert.ok(Number.isInteger(n) && n >= 1 && n <= lesson.official.assignment.length,
      `C: ${lesson.id} a${num} 条目号必须在 1..${lesson.official.assignment.length} 内（与 lessons.js 渲染顺序一致）`);
    assert.ok(Array.isArray(urls) && urls.length >= 1, `C: ${lesson.id} a${num} 链接组非空`);
    urls.forEach(u => {
      assert.ok(/^https?:\/\//.test(u), `C: ${lesson.id} a${num} 地址为 http(s)`);
      assert.ok(lessonUrls.has(urlBase(u)),
        `C: ${lesson.id} a${num} 的地址（去锚点）必须属于本课资源清单——防悬空引用：${u}`);
    });
    mappedAssignmentItems += 1;
    mappedAssignmentUrls += urls.length;
  }
}
/* 覆盖率钉住：本轮人工核对的映射规模（73/149）。数字变化必须是有意的
 * （新增映射或课程数据变更），而不是解析规则悄悄失效。 */
assert.equal(mappedAssignmentItems, 76, 'C: Assignment 接链条目数 = 76（本轮语义核对结论，课 44 两个跟练视频接链、Project 课均显式空映射，课 45/46 显式空映射——课 46 官方无 Assignment）；');
assert.equal(mappedAssignmentUrls, 117, 'C: Assignment 链接总数 = 117');

/* ===== C-渲染层 ===== */
for (const lesson of guide.lessons) {
  const page = mountLesson(lesson.id);
  const rendered = taskLinksOf(page);
  const entry = taskLinks.links[lesson.id];
  const expectedUrls = Object.values(entry.a || {}).flat();
  /* 每个映射地址都渲染且只渲染一次（全部地址都能按 titleZh 反查到资源） */
  assert.equal(rendered.length, expectedUrls.length,
    `C: ${lesson.id} 渲染链接数 ${rendered.length} ≠ 映射数 ${expectedUrls.length}（存在未渲染的悬空地址或重复渲染）`);
  assert.deepEqual(rendered.map(a => a.href).sort(), expectedUrls.slice().sort(),
    `C: ${lesson.id} 渲染的 href 与映射一致`);
  rendered.forEach(a => {
    assert.equal(a.tagName, 'A', 'C: 任务链接是 a 元素');
    assert.equal(a.target, '_blank', 'C: 任务链接新标签页打开');
    assert.equal(a.rel, 'noopener noreferrer', 'C: 任务链接带 noopener noreferrer');
    assert.ok(/↗$/.test(textOf(a)), 'C: 任务链接文字以 ↗ 结尾（离开本站提示，与资源卡同语言）');
  });
  /* 条目文本一字不改：li 仍以 lessons.js 原文开头。
   * v4.11.5（交接 3.C）：OL 取法改为穿透折叠容器，且「取不到」从静默跳过
   * 升级为断言失败——旧写法在 Assignment <ol> 被包进 div.collapse-body 后
   * ols.length 变 0，if 整段跳过，这条保护空转而测试仍然全绿。
   * 文档序第一个 OL 必是 Assignment 列表（Exercise 列表在其后，
   * 「官方可选项」是无序列表）。负向验证见下方独立块。
   * v4.11.17：自查题列表整体下线，改为反向钉住整页不得再出现该类元素。 */
  /* v4.11.20 第九批：第 46 课（结语课）官方无 Assignment——OL 与条目数断言按空数组口径
   * 执行（ols 可为 0，条目数为 0），其余课仍要求 OL 必须取到（防静默跳过不变）。 */
  const ols = collectTagDeep(officialOf(page), 'OL');
  if (lesson.official.assignment.length > 0) {
    assert.ok(ols.length >= 1, `C: ${lesson.id} Assignment OL 必须能穿透折叠容器取到（防静默跳过）`);
  }
  const lis = ols.length ? ols[0].childNodes : [];
  assert.equal(lis.length, lesson.official.assignment.length, `C: ${lesson.id} Assignment 条目数不变`);
  lis.forEach((li, i) => assert.ok(textOf(li).startsWith(lesson.official.assignment[i]),
    `C: ${lesson.id} A${i + 1} 条目文本未被改动（链接只追加在尾部）`));
  assert.equal(collectByClass(officialOf(page), 'kc-q').length, 0,
    `C: ${lesson.id} 课页不得再出现自查题题目元素（官方 2026-09-23 已下线该节）`);
}
/* 负向钉住：本地动作 / 纯练习条目不得渲染链接（OL 取法与上方同为穿透收集，v4.11.5） */
{
  const gb = mountLesson('git-basics');
  const gbOl = collectTagDeep(officialOf(gb), 'OL')[0];
  /* git-basics 22 条里只有 A1（renaming 背景页）与 A17（HTTPS→SSH 排错文档）接链，
   * 其余全部是终端命令与 GitHub 界面操作——逐条钉住不接 */
  const gbLinked = new Set(Object.keys(taskLinks.links['git-basics'].a).map(Number));
  assert.deepEqual([...gbLinked].sort((x, y) => x - y), [1, 17], 'C: git-basics 只接 A1/A17');
  gbOl.childNodes.forEach((li, i) => {
    const links = collectByClass(li, 'task-link');
    if (!gbLinked.has(i + 1)) assert.equal(links.length, 0, `C: git-basics A${i + 1} 是本地动作条目，不得渲染链接`);
    else assert.ok(links.length >= 1, `C: git-basics A${i + 1} 应有链接`);
  });
  /* lists：全课 0 链接（资源都在正文区，任务是动手建列表） */
  assert.equal(taskLinksOf(mountLesson('lists')).length, 0, 'C: lists 全课不接链（正文区资源 + 纯动手任务）');
  /* setting-up-git A6（git config 本地命令）不接 */
  const sug = mountLesson('setting-up-git');
  const sugOl = collectTagDeep(officialOf(sug), 'OL')[0];
  assert.equal(collectByClass(sugOl.childNodes[5], 'task-link').length, 0, 'C: setting-up-git A6 本地命令不接链');
  /* commit-messages A3（无编码项目说明）不接 */
  const cm = mountLesson('commit-messages');
  const cmOl = collectTagDeep(officialOf(cm), 'OL')[0];
  assert.equal(collectByClass(cmOl.childNodes[2], 'task-link').length, 0, 'C: commit-messages A3 不接链');
}
/* 自查题映射整体下线后的反向抽查（v4.11.17）：
 * 官方 2026-09-23 移除该节，课页不得再出现自查题区块的任何形态；
 * 原本接在自查题上的两份资料（课 09 softcover、课 13 Bryt Designs）也已随之
 * 从资源清单移除，映射文件里不得再引用。 */
{
  for (const id of ['command-line-basics', 'how-does-the-web-work']) {
    const page = mountLesson(id);
    const official = officialOf(page);
    assert.equal(collectByClass(official, 'kc-q').length, 0, `C: ${id} 零自查题题目`);
    assert.equal(collectByClass(official, 'kc-list').length, 0, `C: ${id} 零自查题列表容器`);
    assert.equal(collectByClass(official, 'kc-item').length, 0, `C: ${id} 零自查题条目`);
    assert.ok(!querySelect(official, '#official-kc-body'), `C: ${id} 无自查题折叠容器`);
  }
  /* 中文优先：MDN 资源的 Assignment 链接一律用已核验中文版地址 */
  const hwtw = mountLesson('how-does-the-web-work');
  const zhLinks = taskLinksOf(hwtw).filter(a => a.href.includes('developer.mozilla.org'));
  assert.equal(zhLinks.length, 4, 'C: 本课 Assignment 的 4 处 MDN 链接全部渲染');
  assert.ok(zhLinks.every(a => a.href.includes('/zh-CN/')),
    'C: MDN 资源一律给已核验中文版地址（与本站中文自足口径一致）');
}

/* ===== C-负向验证（v4.11.5 交接 3.C）：证明「穿透取 OL」真的生效 =====
 * 人为把 Assignment OL 再包进一层 div，复刻折叠容器之外的任意未来包裹场景：
 *   1) 「只看节级直接子」的取法（v4.11.5 之前的旧实现）此时取不到该 OL——
 *      旧 if (ols.length) 守卫会静默跳过整段条目文本保护，这正是修掉的缺陷形态；
 *   2) 穿透收集仍取到同一个 OL——若有人把收集器改回只看直接子，本断言变红；
 *   3) 篡改条目文本后，与主循环同款 startsWith 断言必须变红（assert.throws 捕获），
 *      证明穿透之后断言链路仍在真正工作，而不是换了个地方空转。 */
{
  const page = mountLesson('git-basics');
  const official = officialOf(page);
  const ol = collectTagDeep(official, 'OL')[0];
  const gb = guide.lessons.find(l => l.id === 'git-basics');
  const wrapper = new page.StubElement('div');
  ol.parentNode.replaceChild(wrapper, ol);
  wrapper.append(ol);
  const directOls = (official.childNodes || []).filter(n => n.tagName === 'OL');
  assert.ok(!directOls.includes(ol),
    'C-负向: 额外包裹后「节级直接子」取法拿不到 Assignment OL（旧实现会从这里开始静默跳过）');
  assert.equal(collectTagDeep(official, 'OL')[0], ol,
    'C-负向: 穿透收集仍能拿到被包裹的 OL（收集器退回直接子取法时本断言变红）');
  const li0 = ol.childNodes[0];
  assert.ok(textOf(li0).startsWith(gb.official.assignment[0]), 'C-负向: 篡改前条目文本与原文一致');
  li0.textContent = '被篡改的条目文本';
  assert.throws(() => assert.ok(textOf(li0).startsWith(gb.official.assignment[0])),
    'C-负向: 篡改条目文本后，穿透断言必须变红（保护不是空转）');
}

/* ===== A1：资源区前言零审计信息（v4.11.4 反向钉子） =====
 * 三分类计数句、全局核验日期句、核验方法指引已随 v4.11.4 文案瘦身移出课页
 * （CONTENT-STYLE-GUIDE.md 第 1 节「读者页面零审计信息」）。 */
for (const lesson of guide.lessons) {
  const preambles = preambleTexts(mountLesson(lesson.id));
  preambles.forEach(t => {
    assert.ok(!t.startsWith('其中'), `A1: ${lesson.id} 前言不得出现「其中 …」计数句`);
    assert.ok(!t.includes('全部地址已于'), `A1: ${lesson.id} 前言不得出现全局核验日期句`);
    assert.ok(!t.includes('核验方法见首页'), `A1: ${lesson.id} 前言不得出现核验方法指引`);
  });
  const mainText = textOf(mainOf(mountLesson(lesson.id)));
  assert.ok(!mainText.includes('自动核验受限：本课'), `A1: ${lesson.id} 课页不得出现块级「自动核验受限」提示`);
  /* 课 01 译文卡仍如实渲染（数据一致性不依赖计数句） */
  if (lesson.id === 'how-this-course-will-work') {
    const cards = collectByClass(mainOf(mountLesson(lesson.id)), 'resource-translation');
    assert.equal(cards.length, 2, 'A1: 课01 仍渲染 2 张精译卡（与数据一致）');
  }
}

/* ===== A2：资源区前言无核验方法论 ===== */
for (const lesson of guide.lessons) {
  preambleTexts(mountLesson(lesson.id)).forEach(t => {
    assert.ok(!/HTTP 状态码|oEmbed|重定向|汉字数/.test(t),
      `A2: ${lesson.id} 资源区前言不得出现核验方法论字样：${t.slice(0, 50)}`);
  });
}

/* ===== B-渲染：概念图归位（v4.11.6 扩为全站） =====
 * v4.11.2 钉 git-areas 归属修正、v4.11.5 钉第 6 课按章归位试点；v4.11.6
 * （交接 §3.4/§3.5）全站按章铺开：47 张（14 存量 + 33 新增），19 个知识课全部图
 * 都带 sectionIndex 并插入 section-explain 对应章之后（v4.11.16：第 20 课 recipes
 * 是 Project 课，按 LESSON-PAGE-GUIDE 第 4 节配图判据第一条不配图，渲染数 = 清单数 = 0）。
 * 通用断言逐课钉：
 * 渲染图数 = 清单数、全部住在 section-explain（零 main 级漂浮）、文档序
 * 章节序列 = 清单 sectionIndex 的稳定排序（同章按清单顺序）。
 * 渲染层「无 sectionIndex 的图保持旧位置（main 直接子级）」的兼容分支
 * 保留未动，但当前数据已没有无 sectionIndex 的图——旧位置断言随事实迁移。 */
{
  const diagramData = loadData('diagrams.js', 'ODIN_DIAGRAMS');
  let totalFigures = 0;
  for (const lesson of guide.lessons) {
    const page = mountLesson(lesson.id);
    const main = mainOf(page);
    const explain = collectByClass(main, 'section-explain')[0];
    const expected = diagramData.diagrams.filter(item => item.lessonId === lesson.id);
    const figures = collectByClass(main, 'concept-diagram');
    totalFigures += figures.length;
    assert.equal(figures.length, expected.length,
      `B: ${lesson.id} 渲染图数 ${figures.length} 必须等于清单数 ${expected.length}`);
    if (!expected.length) continue;
    assert.equal(collectByClass(explain, 'concept-diagram').length, expected.length,
      `B: ${lesson.id} 全部图住在 section-explain 内（v4.11.6 全量归位，零 main 级漂浮）`);
    const chapterSequence = [];
    let chapter = -1;
    for (const child of explain.childNodes || []) {
      if (!child || !child.tagName) continue;
      if (child.tagName === 'H3') chapter += 1;
      if (String(child.className || '').split(/\s+/).includes('concept-diagram')) chapterSequence.push(chapter);
    }
    assert.deepEqual(chapterSequence, expected.map(item => item.sectionIndex).sort((a, b) => a - b),
      `B: ${lesson.id} 每张图落在其 sectionIndex 章节之后（同章按清单顺序稳定排序）`);
  }
  assert.equal(totalFigures, 53, 'B: 全站渲染 53 张图（v4.11.6 的 47 张 + v4.11.17 第 21/22 课 2 张 + v4.11.18 第 24/25 课 2 张 + v4.11.19 第 27/28 课各 1 张）');
  /* 抽查：git-areas 的归属与文件引用（v4.11.2 B 组的两个事实继续沿用） */
  const gb = mountLesson('git-basics');
  const gbFigures = collectByClass(mainOf(gb), 'concept-diagram');
  assert.equal(gbFigures.length, 4,
    'B: git-basics 4 张（git-areas 归位第 6 章 + v4.11.6 新增暂存区 / 三段式 / 原子提交）');
  assert.ok(textOf(gbFigures[0]).includes('Git 的四个区域'), 'B: 清单序第一张为四区域工作流图');
  const img = gbFigures[0].childNodes.find(n => n.tagName === 'IMG');
  assert.ok(img && img.src.endsWith('assets/diagrams/git-areas.svg'), 'B: 引用 git-areas.svg 文件');
  /* 抽查：introduction-to-git v4.11.6 起有自己的图，但四区域图仍不归它 */
  const itg = collectByClass(mainOf(mountLesson('introduction-to-git')), 'concept-diagram');
  assert.equal(itg.length, 1, 'B: introduction-to-git 恰 1 张（git-save-vs-editor-save，v4.11.6 补图）');
  assert.ok(textOf(itg[0]).includes('Git 的保存'), 'B: 该图为「Git 的保存 vs 编辑器保存」对比图');
  assert.ok(!textOf(itg[0]).includes('Git 的四个区域'), 'B: 四区域图仍不渲染在 introduction-to-git');
}

/* ===== D：修订版立场（D0 本站自足）与引导 ===== */
const D6_BANNED = ['本站即官方课程', '在本站完成即完成官方课程', '替代官方课程', '不必去官方', '不用去官方'];
const OLD_COPY = ['仍需在原课逐项完成', '请在原课中查看', '正式完成动作仍在', '没有可靠中文版，只提供本站中文导读要点'];
for (const lesson of guide.lessons) {
  const page = mountLesson(lesson.id);
  const mainText = textOf(mainOf(page));
  const why = textOf(collectByClass(mainOf(page), 'section-why')[0]);
  const officialFirstP = textOf((officialOf(page).childNodes || []).find(n => n.tagName === 'P'));
  /* D1：section-why 出现中文辅助引导 + 「不必先啃英文原文」
   * v4.11.17：官方移除课末自查题节后，页面上只剩本站自测一种自查，引导语
   * 固定为这一种说法（v4.11.16 的按课型分支随之取消）。反向钉住：课页不得
   * 再声称有官方自查题渲染在本页。 */
  assert.ok(why.includes('中文辅助'), `D1: ${lesson.id} section-why 含「中文辅助」引导`);
  assert.ok(why.includes('不必先去啃英文原文'), `D1: ${lesson.id} section-why 明确不必先看英文`);
  assert.ok(why.includes('本站自测题的答案也全部渲染在本页'),
    `D1: ${lesson.id} section-why 告知本站自测答案在本页`);
  assert.ok(!why.includes('官方自查题'), `D1: ${lesson.id} 不得声称有官方自查题渲染在本页`);
  /* D2：官方任务开头引导（v4.11.5 更新：仍是两句——第一句在 v4.11.4 版基础上
   * 增补「列表可以用标题旁的按钮收起或展开」，第二句不变；改口依据
   * CONTENT-STYLE-GUIDE.md 第 3、9 节，交接 3.B。正文跳转按钮已删、节级无直接子
   * 链接的 v4.11.4 口径保持——页内跳转入口挂在 Assignment 标题内，见 E 组。
   * v4.11.17：自查题节下线后，引导语只按「本课有没有 Exercise」分支——
   * 不得描述页面上不存在的列表（app.js 同源分支）。
   * v4.11.19：零外部资料课（首个为课 26 introduction-to-flexbox）再补分支——
   * 第二句不说「就在本节末尾的『本课外部资料』」（不存在的落点），如实说明
   * 本课没有外部资料。与 app.js renderLessonV2 的三分支同源。 */
  const lessonHasResources = resourceData.resources.some(resource => resource.lessonId === lesson.id);
  /* v4.11.20 第九批：官方无 Assignment 的课（当前仅第 46 课结语课）第四分支——
   * 如实说明无 Assignment，不描述不存在的列表（与 app.js renderLessonV2 同源）。 */
  const expectedOfficialGuide = lesson.official.assignment.length === 0
    ? '这一课官方没有布置 Assignment（结语课，官方文件顶部声明因独特的课结构豁免常规布局）。本站只收录官方正文的中文化梳理与本站自拟的回顾任务；正文推荐的外部文章在下方「本课外部资料」有中文辅助入口。'
    : (!lessonHasResources
    ? '以下是官方原课的 Assignment 的中文化版本，Assignment 列表可以用标题旁的按钮收起或展开。这一课官方没有布置外部资料，跟着本页讲解与任务说明往下走即可。'
    : (lesson.official.exercise.length
      ? '以下是官方原课的 Assignment 与 Exercise 的中文化版本，Assignment 列表可以用标题旁的按钮收起或展开。这些任务要求的外部文章与视频，本站已备好中文辅助，就在本节末尾的「本课外部资料」。'
      : '以下是官方原课的 Assignment 的中文化版本，Assignment 列表可以用标题旁的按钮收起或展开。这些任务要求的外部文章与视频，本站已备好中文辅助，就在本节末尾的「本课外部资料」。'));
  assert.equal(officialFirstP, expectedOfficialGuide,
    `D2: ${lesson.id} 官方任务开头引导为当前数据的逐字全文`);
  const officialChildren = officialOf(page).childNodes || [];
  assert.ok(officialChildren.filter(n => n.tagName === 'A').length === 0,
    `D2: ${lesson.id} 官方任务节不得有节级跳转按钮（官方入口只在页顶）`);
  /* D4：末节「回到官方原课」已移除（v4.11.4；CONTENT-STYLE-GUIDE.md 第 6 节） */
  assert.equal(collectByClass(mainOf(page), 'section-back').length, 0,
    `D4: ${lesson.id} 不得再有 section-back 末节`);
  assert.ok(!mainText.includes('本页已提供这一课的完整中文学习内容'),
    `D4: ${lesson.id} 末节旧声明文案不得出现在课页`);
  /* D5：保留项在位（以原课为准；非官方声明在页尾 tagline——见文件尾静态断言） */
  assert.ok(mainText.includes('官方内容若有更新，以原课为准'), `D5: ${lesson.id} 「以原课为准」来源声明保留`);
  /* 反向断言用「全局核对日期 / 本课来源：」收窄：精译卡 CC 署名行含
   * 「来源：The Odin Project 官网…」字样且必须保留，不得误伤 */
  assert.ok(!mainText.includes('全局核对日期'), `D5: ${lesson.id} 课页 main 不得出现全局来源核对行（审计信息，事实源在 SOURCES.md）`);
  assert.ok(!mainText.includes('本课来源：'), `D5: ${lesson.id} 课页 main 不得出现本课来源核对行`);
  /* D6 红线 + 旧口径清零 */
  D6_BANNED.forEach(banned => assert.ok(!mainText.includes(banned), `D6: ${lesson.id} 不得出现「${banned}」`));
  OLD_COPY.forEach(old => assert.ok(!mainText.includes(old), `D: ${lesson.id} 旧口径「${old.slice(0, 12)}…」已清零`));
  /* 顶部官方入口说明与自足口径一致 */
  assert.ok(textOf(collectByClass(mainOf(page), 'official-start')[0]).includes('原课是本课内容的来源'),
    `D: ${lesson.id} 顶部官方入口说明已改写`);
  /* D7：不堆砌——渲染层的「中文辅助」引导固定 5 处（why / 官方任务开头 /
   * Assignment 标题内的页内跳转链接 / 资源区 h3 / 资源区前言）。
   * v4.11.4 删末节后曾由 5 处收为 4 处；v4.11.5 基数回到 5，增加的唯一一处是
   * 页内跳转链接——其文字按交接 3.B 与资源区标题逐字一致（「本课外部资料
   * （本站中文辅助 · N 条）」，CONTENT-STYLE-GUIDE.md 第 9 节），属于导航入口
   * 而不是新增引导语，不违反「引导语不堆砌」的本意。
   * v4.11.19：零外部资料课的基数是 1——资源分句（why 的资源形态 + 跳转链接 +
   * 资源区 h3 + 资源区前言四处全不渲染，官方任务开头也不提「中文辅助」），
   * 唯一一处在 why 的零资源分句里（「本站的中文辅助就是本页的中文讲解与自测」）。
   * lessons.js 正文数据里的合法提及按课加回（当前只有课 01 的中文讲解正文
   * 含 1 处，数据文件是红线不改）。 */
  /* v4.11.20 第九批：官方无 Assignment 的课（当前仅第 46 课，有 1 条正文资源）基数 4——
   * Assignment 标题内的跳转链接随标题整块不渲染，前言第四分支自带 1 处「中文辅助入口」。 */
  const noAssignmentBase = !lessonHasResources ? 1 : (lesson.official.assignment.length === 0 ? 4 : 5);
  const dataCount = (JSON.stringify(lesson).match(/中文辅助/g) || []).length;
  const zhAssistCount = (mainText.match(/中文辅助/g) || []).length;
  assert.equal(zhAssistCount, noAssignmentBase + dataCount,
    `D7: ${lesson.id} 「中文辅助」出现 ${zhAssistCount} 次，应为渲染层 ${noAssignmentBase} 处 + 数据层 ${dataCount} 处（防堆砌也防丢失）`);
  assert.equal((mainText.match(/不必先去啃英文原文/g) || []).length, 1,
    `D7: ${lesson.id} 「不必先去啃英文原文」只在第 1 节说一次`);
  assert.equal((mainText.match(/先在本页看懂/g) || []).length, 0,
    `D7: ${lesson.id} 「先在本页看懂」不得出现（v4.11.4 删重复引导）`);
  assert.equal((mainText.match(/可以在这里学完并自查/g) || []).length, 0,
    `D7: ${lesson.id} 「可以在这里学完并自查」不得出现（v4.11.4 删末节）`);
}
/* D5：页尾非官方声明与 20 课边界（静态 HTML 与首页 FAQ） */
{
  const lessonHtml = fs.readFileSync(path.join(root, 'lesson.html'), 'utf8');
  const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const [name, html] of [['lesson.html', lessonHtml], ['index.html', indexHtml]]) {
    assert.ok(html.includes('非官方中文辅助页 · 正课始终是 The Odin Project'),
      `D5: ${name} 页尾非官方声明保留（防冒充官方，不是防读者留下）`);
  }
  const home = newPage({ storage: makeStorage() });
  const usage = textOf(querySelect(home.dom.body, '.site-usage'));
  assert.ok(usage.includes('可以在本站学完并自查'), 'D5/D0: 首页 FAQ「本站怎么用」与自足口径一致');
  assert.ok(!usage.includes('正式完成动作仍在 TOP 原课进行'), 'D5/D0: 首页 FAQ 旧口径已移除');
  assert.ok(usage.includes('Foundations 之后的路径课程请回官方原课学习'), 'D5: 覆盖边界声明保留（事实边界；v4.11.20 第九批起 Foundations 46 课全开，边界指向路径课程）');
  assert.ok(usage.includes('项目提交、Discord 社区与其后课程在 TOP 官方进行'), 'D5/D6: 项目提交与社区仍明确在官方（事实边界，非过度承诺）');
  assert.ok(usage.includes('不提供成品答案'), 'D5: FAQ 明确 Project 课不提供成品答案（红线第 4 条的首页口径）');
}

/* ===== E：官方任务节折叠头与页内跳转（v4.11.5 交接 3.A / 3.B） =====
 * E1 —— 折叠头必须是 button[aria-expanded] + aria-controls 指向受控容器，
 *         默认展开；**零新增 details / summary**（browser-smoke 钉住课页
 *         details 数量 = quiz 数量、第一个 summary 属于简单自测——官方任务节
 *         排在自测之前，用 details 折叠会抢走它们）；
 * E2 —— 资源区不得被折叠容器包裹（交接 3.A 红线：跳转目标必须同节可见；
 *         前言 = 节级直接子 p 由 A1/A2 组天然钉住，这里再钉 resource-list
 *         的祖先链上没有 .collapse-body）；
 * E3 —— 页内跳转入口恰好 1 个：<a> 挂在 Assignment 标题（h3）内、指向
 *         #lesson-resources、目标存在且是资源区标题；节级直接子 <a> 仍为 0
 *         （D2 组既有断言）；
 * E4 —— 折叠偏好从档案读取：档案里 collapseOfficialTasks=true 时两个受控
 *         容器默认收起、aria-expanded=false、按钮文字为「展开…」；非法值按展开。 */
for (const lesson of guide.lessons) {
  const page = mountLesson(lesson.id);
  const main = mainOf(page);
  const official = officialOf(page);
  /* v4.11.19：与 D 组同一判定——本课有没有外部资料（决定 E2/E3 的分支）。 */
  const lessonHasResources = resourceData.resources.some(resource => resource.lessonId === lesson.id);
  /* E1：折叠头恒为 1 个（只有 Assignment）——v4.11.17 起官方自查题节整体下线，
   * 页面上只剩一个可折叠列表；button + aria 契约不变。
   * v4.11.20 第九批：官方无 Assignment 的课（结语课）折叠头随 Assignment 整块
   * 不渲染，为 0 个——「恒为 1」的前提（每课必有 Assignment 列表）对该课不成立。 */
  const expectedToggles = lesson.official.assignment.length === 0 ? 0 : 1;
  const buttons = collectByClass(official, 'collapse-toggle');
  assert.equal(buttons.length, expectedToggles, `E1: ${lesson.id} 恰有 1 个折叠头（只有 Assignment）`);
  buttons.forEach(button => {
    assert.equal(button.tagName, 'BUTTON', `E1: ${lesson.id} 折叠头是 button 元素`);
    assert.equal(button.getAttribute('aria-expanded'), 'true', `E1: ${lesson.id} 默认展开（aria-expanded=true）`);
    const bodyId = button.getAttribute('aria-controls');
    assert.ok(bodyId, `E1: ${lesson.id} 折叠头带 aria-controls`);
    const body = querySelect(official, `#${bodyId}`);
    assert.ok(body, `E1: ${lesson.id} aria-controls 指向存在的受控容器 ${bodyId}`);
    assert.ok(String(body.className).split(/\s+/).includes('collapse-body'), `E1: ${lesson.id} 受控容器带 collapse-body class`);
    assert.equal(body.hidden, false, `E1: ${lesson.id} 默认展开（受控容器未 hidden）`);
    assert.ok(/收起/.test(textOf(button)) && !/展开/.test(textOf(button)), `E1: ${lesson.id} 展开态按钮文字是「收起…」（读者的动作）`);
    assert.equal(button.parentNode.tagName, 'H3', `E1: ${lesson.id} 折叠头挂在对应 h3 内`);
  });
  /* E1：零新增 details——全课页 details 数量仍恰好等于 quiz 数量，且全部住在自测节 */
  assert.equal(collectTagDeep(main, 'DETAILS').length, lesson.quiz.length,
    `E1: ${lesson.id} details 数量 = quiz 数量（折叠零引入 details/summary）`);
  assert.equal(collectTagDeep(official, 'DETAILS').length, 0, `E1: ${lesson.id} 官方任务节零 details`);
  /* E2：Assignment OL 住在受控容器里；资源区不在任何受控容器里；
   * v4.11.17 反向：全课不得再出现自查题的折叠容器 */
  const assignmentBody = querySelect(official, '#official-assignment-body');
  /* v4.11.20 第九批：官方无 Assignment 的课（结语课）受控容器随 Assignment 整块不渲染；
   * 其余课必须住在受控容器里（防渲染回归静默溜过）。 */
  if (lesson.official.assignment.length === 0) {
    assert.ok(!assignmentBody, `E2: ${lesson.id} 官方无 Assignment，受控容器不得出现`);
  } else {
    assert.ok(assignmentBody && collectTagDeep(assignmentBody, 'OL').length === 1, `E2: ${lesson.id} Assignment OL 住在受控容器内`);
  }
  assert.ok(!querySelect(official, '#official-kc-body'), `E2: ${lesson.id} 已下线的自查题折叠容器不得出现`);
  /* E2：Assignment OL 住在受控容器里；资源区不在任何受控容器里；
   * v4.11.17 反向：全课不得再出现自查题的折叠容器
   * v4.11.19：零外部资料课没有资源列表，「未被折叠包裹」的检查天然跳过——
   * 但有资源的课必须有资源列表（防渲染回归静默溜过），见下方断言。 */
  const resourceList = collectByClass(official, 'resource-list')[0];
  if (lessonHasResources) {
    assert.ok(resourceList, `E2: ${lesson.id} 资源列表在位`);
  } else {
    assert.ok(!resourceList, `E2: ${lesson.id} 零外部资料课不渲染资源列表`);
  }
  if (resourceList) {
    let cursor = resourceList.parentNode;
    let resourceWrapped = false;
    while (cursor && cursor !== official) {
      if (String(cursor.className || '').split(/\s+/).includes('collapse-body')) resourceWrapped = true;
      cursor = cursor.parentNode;
    }
    assert.equal(resourceWrapped, false, `E2: ${lesson.id} 资源区未被折叠容器包裹（跳转目标必须同节可见）`);
  }
  /* E3：页内跳转入口。v4.11.19：零外部资料课（首个为课 26）整块不渲染——
   * 跳转入口、资源区列表与锚点都不存在（不承诺不存在的落点，app.js 的
   * officialResourceCount 守卫与 buildResourceBlock 空列表 return []）。 */
  const jumps = collectByClass(official, 'resource-jump');
  /* v4.11.20 第九批：官方无 Assignment 的课（结语课，有正文资源）跳转入口随 Assignment
   * 标题整块不渲染（挂载点消失）——资源区锚点仍在、前言文字指向它。 */
  const noAssignmentLesson = lesson.official.assignment.length === 0;
  if (!lessonHasResources) {
    assert.equal(jumps.length, 0, `E3: ${lesson.id} 零外部资料课不渲染页内跳转入口`);
    assert.ok(!querySelect(official, '#lesson-resources'), `E3: ${lesson.id} 零外部资料课不渲染资源区锚点`);
  } else if (noAssignmentLesson) {
    assert.equal(jumps.length, 0, `E3: ${lesson.id} 官方无 Assignment，跳转挂载点（Assignment 标题）不渲染`);
    assert.ok(querySelect(official, '#lesson-resources'), `E3: ${lesson.id} 资源区锚点在位（前言文字指向它）`);
  } else {
    assert.equal(jumps.length, 1, `E3: ${lesson.id} 恰有 1 个页内跳转入口`);
    assert.equal(jumps[0].tagName, 'A', `E3: ${lesson.id} 跳转入口是 a 元素`);
    assert.equal(jumps[0].href, '#lesson-resources', `E3: ${lesson.id} 跳转入口指向 #lesson-resources`);
    assert.equal(jumps[0].parentNode.tagName, 'H3', `E3: ${lesson.id} 跳转入口挂在 h3 内（节级直接子 <a> 仍为 0，D2 组钉住）`);
    assert.ok(textOf(jumps[0]).includes('本课外部资料（本站中文辅助 · '), `E3: ${lesson.id} 跳转文字与资源区标题同款`);
    const anchor = querySelect(official, '#lesson-resources');
    assert.ok(anchor && anchor.tagName === 'H3', `E3: ${lesson.id} 锚点目标是资源区标题 h3`);
    assert.equal(textOf(anchor), textOf(jumps[0]), `E3: ${lesson.id} 跳转文字与资源区标题逐字一致`);
  }
  /* E3：跳转入口不伪装外链（页内锚点，无 target/rel/↗；stub 未设 target 时为 undefined，真实 DOM 为 ''，统一按 falsy 判） */
  if (jumps[0]) {
    assert.ok(!jumps[0].target, `E3: ${lesson.id} 页内跳转不设 target（↗ 专属离开本站语义）`);
    assert.ok(!/↗$/.test(textOf(jumps[0])), `E3: ${lesson.id} 页内跳转文字不带 ↗`);
  }
}
/* E4：折叠偏好随档案生效（progress 读档 → 渲染默认态） */
{
  const mountWithArchive = archive => {
    const storage = makeStorage();
    storage.setItem(STORAGE_KEY, JSON.stringify(archive));
    return newPage({ storage, page: 'lesson', search: '?id=git-basics', href: 'http://127.0.0.1:8765/lesson.html?id=git-basics' });
  };
  const collapsedArchive = JSON.parse(archiveJson());
  collapsedArchive.settings.collapseOfficialTasks = true;
  const page = mountWithArchive(collapsedArchive);
  const official = officialOf(page);
  const buttons = collectByClass(official, 'collapse-toggle');
  assert.equal(buttons.length, 1, 'E4: 折叠档案下恰有 1 个折叠头（只有 Assignment）');
  buttons.forEach(button => {
    assert.equal(button.getAttribute('aria-expanded'), 'false', 'E4: 档案 collapseOfficialTasks=true → aria-expanded=false');
    assert.ok(/展开/.test(textOf(button)), 'E4: 收起态按钮文字是「展开…」（恢复出口就是折叠头本身）');
  });
  assert.equal(querySelect(official, '#official-assignment-body').hidden, true, 'E4: Assignment 受控容器默认收起');
  /* 非法值按展开（读档校验只有显式 true 才算折叠） */
  const badArchive = JSON.parse(archiveJson());
  badArchive.settings.collapseOfficialTasks = 'yes';
  const badPage = mountWithArchive(badArchive);
  assert.equal(querySelect(officialOf(badPage), '#official-assignment-body').hidden, false, 'E4: 非法值按展开处理');
}

console.log(`通过：课页读者向断言（v4.11.20 第九批口径）——A1 资源区零审计信息（有资源的课无计数句 / 核验日期句 / 块级受限提示；课01 精译卡仍 2 张与数据一致）、A2 前言零方法论字样（全 46 课）、B 概念图全站归位（53 张逐课渲染数 = 清单数、全部住在 section-explain 对应章之后、git-areas 仍归 git-basics 且 introduction-to-git 只有自己的对比图、Project 课 recipes 零配图）、C 映射完整性（46 课 / Assignment 76 条 117 链接，地址零悬空；自查题映射已整体下线且反向钉住；recipes 与课 26、课 30、课 32、课 33、课 38、课 40、课 43、课 45、课 46 显式空映射）+ 渲染一致 + 本地动作条目负向钉住 + 条目文本零改动（OL 穿透折叠容器取到，含负向验证：包裹后直接子取法拿不到、穿透仍拿到、篡改文本必红）、D 修订版立场（D1 第 1 节引导在位且不再声称有官方自查题在本页、D2 官方任务开头按数据逐字钉住且节内零直接子链接（v4.11.19 起零资料课三分支）、D4 末节已移除、D5 「以原课为准」保留且来源核对行零出现、D6 禁语零出现、D7 引导按资源分支不堆砌（有资源 5 处 / 零资源 1 处））、E 折叠与跳转（折叠头 button[aria-expanded] 恰 1 个且挂在 h3 内、零新增 details、资源区未被折叠包裹、跳转入口在 Assignment 标题内指向 #lesson-resources 且无外链标记（零资料课跳转与锚点整块不渲染）、折叠偏好随档案生效且非法值按展开）。`);
