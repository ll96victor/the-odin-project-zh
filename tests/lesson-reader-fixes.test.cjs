/* v4.11.2 课页读者向修复的收口断言（交接 §5）。
 *
 * 每项断言证明的验收标准写在分组注释里：
 *   A1 —— 资源区前言三分类计数与该课卡片实际渲染类别数**逐课一致**（由数据算出，
 *         消除课 01「0 条中文版、2 条没有可靠中文版」却渲染两篇精译的自相矛盾）；
 *   A2 —— 资源区前言不再出现核验方法论字样（HTTP 状态码 / 重定向 / 汉字数 / oEmbed），
 *         只保留核验日期与「见首页关于本站」指引（方法论全文由 home-ia.test.cjs
 *         钉住在首页 FAQ 第 4 项）；
 *   B  —— git-areas 渲染在 git-basics（图数 ≥ 1）、introduction-to-git 为 0 图
 *         （数据层绑定由 diagrams.test.cjs 钉住，这里钉渲染结果）；
 *   C  —— 映射文件完整性（19 课、条目号合法、地址零悬空）+ 渲染层（有映射的条目
 *         渲染出链接且 href 属于该课资源、外链纪律、本地动作条目**不渲染**链接、
 *         条目文本一字不改）；
 *   D  —— 修订版立场（D0 本站自足）：section-why 与 section-official 均出现
 *         「中文辅助」引导；末节不再写「仍需在原课逐项完成」；D5 三条保留项在位；
 *         D6 红线禁语（「本站即官方课程」「在本站完成即完成官方课程」等）零出现；
 *         D7 引导语不堆砌（单页「中文辅助」出现次数设上限）。
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

const { newPage, makeStorage, collectByClass, querySelect } = require('./dom-stub.cjs');
const textOf = el => (!el ? '' : el._text ? el._text : (el.childNodes || []).map(textOf).join(''));
const mountLesson = id => newPage({ storage: makeStorage(), page: 'lesson', search: `?id=${id}`, href: `http://127.0.0.1:8765/lesson.html?id=${id}` });
const mainOf = page => querySelect(page.dom.body, '#main');
const officialOf = page => collectByClass(mainOf(page), 'section-official')[0];
/* 资源区前言 = section-official 的直接子 p（资源卡全部住在 ul.resource-list 里） */
const preambleTexts = page => (officialOf(page).childNodes || []).filter(n => n.tagName === 'P').map(textOf);
const taskLinksOf = page => collectByClass(mainOf(page), 'task-link');
const urlBase = u => String(u).split('#')[0].replace(/\/+$/, '');

const LESSON_IDS = guide.lessons.map(l => l.id);
assert.equal(LESSON_IDS.length, 19, '前提：19 课');

/* ===== C-数据层：映射文件完整性（防悬空引用） ===== */
assert.equal(taskLinks.version, 1, 'C: 映射文件带版本号');
assert.deepEqual(Object.keys(taskLinks.links).sort(), [...LESSON_IDS].sort(),
  'C: 映射文件恰好覆盖 19 课，无未知 lessonId（防悬空课程引用）');
const sourceOf = fs.readFileSync(path.join(root, 'lesson-task-links.js'), 'utf8');
assert.ok(!/\bfetch\(|XMLHttpRequest|innerHTML|document\.cookie/.test(sourceOf),
  'C: 映射文件不联网、不注入标记、不读写 cookie（与其他数据文件同纪律）');
let mappedAssignmentItems = 0, mappedAssignmentUrls = 0, mappedKcItems = 0;
for (const lesson of guide.lessons) {
  const entry = taskLinks.links[lesson.id];
  const lessonUrls = new Set();
  resourceData.resources.filter(r => r.lessonId === lesson.id).forEach(r => {
    lessonUrls.add(urlBase(r.originalUrl));
    if (r.zhUrl) lessonUrls.add(urlBase(r.zhUrl));
  });
  for (const [kind, limit] of [['a', lesson.official.assignment.length], ['k', lesson.official.knowledgeCheck.length]]) {
    for (const [num, urls] of Object.entries(entry[kind] || {})) {
      const n = Number(num);
      assert.ok(Number.isInteger(n) && n >= 1 && n <= limit,
        `C: ${lesson.id} ${kind}${num} 条目号必须在 1..${limit} 内（与 lessons.js 渲染顺序一致）`);
      assert.ok(Array.isArray(urls) && urls.length >= 1, `C: ${lesson.id} ${kind}${num} 链接组非空`);
      urls.forEach(u => {
        assert.ok(/^https?:\/\//.test(u), `C: ${lesson.id} ${kind}${num} 地址为 http(s)`);
        assert.ok(lessonUrls.has(urlBase(u)),
          `C: ${lesson.id} ${kind}${num} 的地址（去锚点）必须属于本课资源清单——防悬空引用：${u}`);
      });
      if (kind === 'a') { mappedAssignmentItems += 1; mappedAssignmentUrls += urls.length; }
      else mappedKcItems += 1;
    }
  }
}
/* 覆盖率钉住：本轮人工核对的映射规模（46/108 与 31/96）。数字变化必须是有意的
 * （新增映射或课程数据变更），而不是解析规则悄悄失效。 */
assert.equal(mappedAssignmentItems, 46, 'C: Assignment 接链条目数 = 46（本轮语义核对结论）');
assert.equal(mappedAssignmentUrls, 54, 'C: Assignment 链接总数 = 54');
assert.equal(mappedKcItems, 31, 'C: Knowledge Check 接链题数 = 31');

/* ===== C-渲染层 ===== */
for (const lesson of guide.lessons) {
  const page = mountLesson(lesson.id);
  const rendered = taskLinksOf(page);
  const entry = taskLinks.links[lesson.id];
  const expectedUrls = [...Object.values(entry.a || {}), ...Object.values(entry.k || {})].flat();
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
  /* 条目文本一字不改：li / kc-q 仍以 lessons.js 原文开头 */
  const ols = (officialOf(page).childNodes || []).filter(n => n.tagName === 'OL');
  if (ols.length) {
    const lis = ols[0].childNodes;
    assert.equal(lis.length, lesson.official.assignment.length, `C: ${lesson.id} Assignment 条目数不变`);
    lis.forEach((li, i) => assert.ok(textOf(li).startsWith(lesson.official.assignment[i]),
      `C: ${lesson.id} A${i + 1} 条目文本未被改动（链接只追加在尾部）`));
  }
  const kcQs = collectByClass(officialOf(page), 'kc-q');
  kcQs.forEach((q, i) => assert.ok(textOf(q).startsWith(lesson.official.knowledgeCheck[i].q),
    `C: ${lesson.id} K${i + 1} 题目文本未被改动`));
}
/* 负向钉住：本地动作 / 纯练习条目不得渲染链接 */
{
  const gb = mountLesson('git-basics');
  const gbOl = (officialOf(gb).childNodes || []).filter(n => n.tagName === 'OL')[0];
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
  const sugOl = (officialOf(sug).childNodes || []).filter(n => n.tagName === 'OL')[0];
  assert.equal(collectByClass(sugOl.childNodes[5], 'task-link').length, 0, 'C: setting-up-git A6 本地命令不接链');
  /* commit-messages A3（无编码项目说明）不接 */
  const cm = mountLesson('commit-messages');
  const cmOl = (officialOf(cm).childNodes || []).filter(n => n.tagName === 'OL')[0];
  assert.equal(collectByClass(cmOl.childNodes[2], 'task-link').length, 0, 'C: commit-messages A3 不接链');
}
/* KC 锚点映射抽查：command-line-basics K1/K2（官方页内锚点）不接，K3–K11 接；
 * how-does-the-web-work 15 题全接（官方 KC 全部是题目即链接） */
{
  const clb = mountLesson('command-line-basics');
  const kcQs = collectByClass(officialOf(clb), 'kc-q');
  assert.equal(collectByClass(kcQs[0], 'task-link').length, 0, 'C: clb K1 页内锚点题不接链');
  assert.equal(collectByClass(kcQs[1], 'task-link').length, 0, 'C: clb K2 页内锚点题不接链');
  for (let i = 2; i <= 10; i += 1) {
    assert.equal(collectByClass(kcQs[i], 'task-link').length, 1, `C: clb K${i + 1} 接 1 个链接`);
  }
  assert.ok(kcQs[2].childNodes.some(n => n.tagName === 'A' && n.href.includes('#sec-basics-cd')),
    'C: clb K3 沿用官方原锚点直达对应小节');
  const hwtw = mountLesson('how-does-the-web-work');
  const hwtwKc = collectByClass(officialOf(hwtw), 'kc-q');
  assert.equal(hwtwKc.length, 15, 'C: how-does-the-web-work 15 题');
  hwtwKc.forEach((q, i) => assert.equal(collectByClass(q, 'task-link').length, 1, `C: hwtw K${i + 1} 接 1 个链接`));
  /* 中文优先：MDN 三篇的 KC 链接用已核验中文版地址 */
  const zhLinks = taskLinksOf(hwtw).filter(a => a.href.includes('developer.mozilla.org'));
  assert.ok(zhLinks.length >= 10 && zhLinks.every(a => a.href.includes('/zh-CN/')),
    'C: MDN 资源一律给已核验中文版地址（与本站中文自足口径一致）');
}

/* ===== A1：前言三分类计数逐课与数据一致 ===== */
for (const lesson of guide.lessons) {
  const items = resourceData.resources.filter(r => r.lessonId === lesson.id);
  const zh = items.filter(r => r.zhUrl).length;
  const tr = items.filter(r => !r.zhUrl && r.zhTranslation).length;
  const go = items.length - zh - tr;
  const preambles = preambleTexts(mountLesson(lesson.id));
  const countLine = preambles.find(t => t.startsWith('其中'));
  assert.ok(countLine, `A1: ${lesson.id} 前言含「其中 …」计数句`);
  const expectParts = [];
  if (zh) expectParts.push(`${zh} 条有已核验的官方中文版`);
  if (tr) expectParts.push(`${tr} 条提供本站中文精译`);
  if (go) expectParts.push(`${go} 条只有本站中文导读与速览`);
  expectParts.forEach(part => assert.ok(countLine.includes(part), `A1: ${lesson.id} 计数句含「${part}」`));
  /* 0 条的类别不得出现（旧二分法正是把 0 也念出来才自相矛盾） */
  if (!zh) assert.ok(!countLine.includes('官方中文版'), `A1: ${lesson.id} 无官方中文版则计数句不得提及`);
  if (!tr) assert.ok(!countLine.includes('中文精译'), `A1: ${lesson.id} 无精译则计数句不得提及`);
  if (!go) assert.ok(!countLine.includes('只有本站中文导读'), `A1: ${lesson.id} 无导读类则计数句不得提及`);
  /* 直接反例钉住：课 01 不得再出现旧口径 */
  if (lesson.id === 'how-this-course-will-work') {
    assert.ok(!countLine.includes('没有可靠中文版'), 'A1: 课01 旧矛盾句「没有可靠中文版」已消除');
    assert.ok(countLine.includes('2 条提供本站中文精译'), 'A1: 课01 如实渲染 2 条精译');
    const cards = collectByClass(mainOf(mountLesson(lesson.id)), 'resource-translation');
    assert.equal(cards.length, 2, 'A1: 课01 计数（2 条精译）与页面译文卡数量一致');
  }
}

/* ===== A2：资源区前言无核验方法论 ===== */
for (const lesson of guide.lessons) {
  preambleTexts(mountLesson(lesson.id)).forEach(t => {
    assert.ok(!/HTTP 状态码|oEmbed|重定向|汉字数/.test(t),
      `A2: ${lesson.id} 资源区前言不得出现核验方法论字样：${t.slice(0, 50)}`);
  });
  const countLine = preambleTexts(mountLesson(lesson.id)).find(t => t.startsWith('其中'));
  assert.ok(countLine.includes(`已于 ${resourceData.verifiedAt} 逐条核验`), `A2: ${lesson.id} 保留核验日期`);
  assert.ok(countLine.includes('核验方法见首页「关于本站」'), `A2: ${lesson.id} 给出方法论指引`);
}

/* ===== B-渲染：配图归位 ===== */
{
  const gb = mountLesson('git-basics');
  const figures = collectByClass(mainOf(gb), 'concept-diagram');
  assert.ok(figures.length >= 1, 'B: git-basics 至少渲染 1 张概念图');
  assert.equal(figures.length, 1, 'B: git-basics 恰好 1 张（git-areas，一课 ≤2 张纪律）');
  assert.ok(textOf(figures[0]).includes('Git 的四个区域'), 'B: 该图为四区域工作流图');
  const img = figures[0].childNodes.find(n => n.tagName === 'IMG');
  assert.ok(img && img.src.endsWith('assets/diagrams/git-areas.svg'), 'B: 引用 git-areas.svg 文件');
  assert.equal(collectByClass(mainOf(mountLesson('introduction-to-git')), 'concept-diagram').length, 0,
    'B: introduction-to-git 不再渲染四区域图（概念课 0 图，补图属独立下一轮）');
}

/* ===== D：修订版立场（D0 本站自足）与引导 ===== */
const D6_BANNED = ['本站即官方课程', '在本站完成即完成官方课程', '替代官方课程', '不必去官方', '不用去官方'];
const OLD_COPY = ['仍需在原课逐项完成', '请在原课中查看', '正式完成动作仍在', '没有可靠中文版，只提供本站中文导读要点'];
for (const lesson of guide.lessons) {
  const page = mountLesson(lesson.id);
  const mainText = textOf(mainOf(page));
  const why = textOf(collectByClass(mainOf(page), 'section-why')[0]);
  const officialFirstP = textOf((officialOf(page).childNodes || []).find(n => n.tagName === 'P'));
  const back = textOf(collectByClass(mainOf(page), 'section-back')[0]);
  /* D1：section-why 出现中文辅助引导 + 「不必先啃英文原文」 */
  assert.ok(why.includes('中文辅助'), `D1: ${lesson.id} section-why 含「中文辅助」引导`);
  assert.ok(why.includes('不必先去啃英文原文'), `D1: ${lesson.id} section-why 明确不必先看英文`);
  assert.ok(why.includes('官方自查题（Knowledge Check）的题目与中文答案也全部渲染在本页'),
    `D1: ${lesson.id} section-why 告知自查题中文答案在本页`);
  /* D2：官方任务开头（渲染在「在原课中查看 Assignment ↗」按钮之前） */
  assert.ok(officialFirstP.includes('中文辅助') && officialFirstP.includes('先在本页看懂'),
    `D2: ${lesson.id} 官方任务开头引导在位`);
  const officialChildren = officialOf(page).childNodes || [];
  const pIndex = officialChildren.findIndex(n => n.tagName === 'P');
  const btnIndex = officialChildren.findIndex(n => n.tagName === 'A' && textOf(n).includes('在原课中查看 Assignment'));
  assert.ok(pIndex >= 0 && btnIndex >= 0 && pIndex < btnIndex,
    `D2: ${lesson.id} 引导段渲染在「在原课中查看 Assignment ↗」之前`);
  /* D4：末节如实陈述（可学完并自查；官方原页 = 来源与延伸） */
  assert.ok(back.includes('可以在这里学完并自查'), `D4: ${lesson.id} 末节声明本页可学完并自查`);
  assert.ok(back.includes('来源') && back.includes('Project') && back.includes('社区'),
    `D4: ${lesson.id} 末节把官方原页定位为来源与延伸（Project/社区/后续课程）`);
  assert.ok(!back.includes('仍需在原课逐项完成'), `D4: ${lesson.id} 旧的失实陈述已移除`);
  /* D5：保留项在位（以原课为准 / 来源与核对日期；非官方声明在页尾 tagline） */
  assert.ok(mainText.includes('官方内容若有更新，以原课为准'), `D5: ${lesson.id} 「以原课为准」来源声明保留`);
  assert.ok(mainText.includes('来源：The Odin Project'), `D5: ${lesson.id} 来源与核对日期行保留`);
  /* D6 红线 + 旧口径清零 */
  D6_BANNED.forEach(banned => assert.ok(!mainText.includes(banned), `D6: ${lesson.id} 不得出现「${banned}」`));
  OLD_COPY.forEach(old => assert.ok(!mainText.includes(old), `D: ${lesson.id} 旧口径「${old.slice(0, 12)}…」已清零`));
  /* 顶部官方入口说明与自足口径一致 */
  assert.ok(textOf(collectByClass(mainOf(page), 'official-start')[0]).includes('原课是本课内容的来源'),
    `D: ${lesson.id} 顶部官方入口说明已改写`);
  /* D7：不堆砌——渲染层的「中文辅助」引导固定 5 处（why / 官方任务开头 /
   * 资源区 h3 / 资源区前言 / 末节）；lessons.js 正文数据里的合法提及按课加回
   * （当前只有课 01 的中文讲解正文含 1 处，数据文件是红线不改）。
   * 三条引导措辞各自全页唯一，防同一意思换措辞重复出现。 */
  const dataCount = (JSON.stringify(lesson).match(/中文辅助/g) || []).length;
  const zhAssistCount = (mainText.match(/中文辅助/g) || []).length;
  assert.equal(zhAssistCount, 5 + dataCount,
    `D7: ${lesson.id} 「中文辅助」出现 ${zhAssistCount} 次，应为渲染层 5 处 + 数据层 ${dataCount} 处（防堆砌也防丢失）`);
  assert.equal((mainText.match(/不必先去啃英文原文/g) || []).length, 1,
    `D7: ${lesson.id} 「不必先去啃英文原文」只在第 1 节说一次`);
  assert.equal((mainText.match(/先在本页看懂/g) || []).length, 1,
    `D7: ${lesson.id} 「先在本页看懂」只在官方任务开头说一次`);
  assert.equal((mainText.match(/可以在这里学完并自查/g) || []).length, 1,
    `D7: ${lesson.id} 「可以在这里学完并自查」只在末节说一次`);
}
/* D5：页尾非官方声明与 19 课边界（静态 HTML 与首页 FAQ） */
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
  assert.ok(usage.includes('其余课程请回官方原课学习'), 'D5: 19 课覆盖边界声明保留（事实边界）');
  assert.ok(usage.includes('Project、Discord 社区与其后课程在 TOP 官方进行'), 'D5/D6: Project 与社区仍明确在官方（事实边界，非过度承诺）');
}

console.log(`通过：v4.11.2 课页读者向修复——A1 三分类计数 19 课逐课与卡片数据一致（课01 矛盾句消除）、A2 资源区前言零方法论字样（19 课）、B git-areas 渲染于 git-basics 且 introduction-to-git 0 图、C 映射完整性（19 课 / Assignment 46 条 54 链接 / KC 31 题，地址零悬空）+ 渲染一致 + 本地动作条目负向钉住 + 条目文本零改动、D 修订版立场（D1/D2 引导在位且先于官方按钮、D4 末节如实、D5 三条保留项在位、D6 禁语零出现、D7 引导固定 5 处 + 三条措辞各自唯一不堆砌）。`);
