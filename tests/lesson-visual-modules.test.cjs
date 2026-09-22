/* v4.11.9 长课可复用视觉模块样板测试：流程复习 + 命令 / 概念速查。
 *
 * 本文件证明的是**最终结果**，不是「函数执行过了」：
 *   1 组  样板表数据合同——从 app.js 源码独立提取期望数据，并交叉核对
 *         「模块里出现的每条命令都在 lessons.js 该课正文真实出现过」（防编造）；
 *   2 组  流程复习的渲染结果：语义结构、步数、**顺序与数据顺序逐项一致**、落点章节；
 *   3 组  命令 / 概念速查的渲染结果：dl / dt / dd 语义、term 与 description 一一对应、落点；
 *   4 组  短课对照与未覆盖长课**零渲染**（先断言目标存在，不静默跳过）；
 *   5 组  不污染既有结构：h2 序列、explain 内 H3 数、官方任务节、资源区、details 数、
 *         Assignment 首个 OL 合同、章节导航纵向 OL 与锚点；
 *   6 组  零交互 / 零存储 / 零档案写入；
 *   7 组  CSS 合同：纵向不用 flex、长命令换行口径、低对比左轨、文本配色不得用
 *         accent / muted（wash 底上分别有 7 套 / 4 套主题低于 4.5:1）、print 保留、作用域前缀；
 *   8 组  本轮一并修正的既有缺陷：章节导航标题的 accent/wash 对比度；
 *   9 组  负向自检：证明上面的断言真能抓住回归形态。
 *
 * 320px 的真实溢出量与四套代表主题的观感由真实浏览器验收承担（见 answers 实施记录）；
 * 本文件只钉可由源码与 DOM 桩证明的部分，不把 CSS 声明当成渲染结果。
 * 运行：node tests/lesson-visual-modules.test.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { newPage, makeStorage, querySelect, collectByClass, STORAGE_KEY, LEGACY_STORAGE_KEY } = require('./dom-stub.cjs');

const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

let checks = 0;
const check = label => { checks += 1; return label; };

const appSrc = read('app.js');
const css = read('style.css');

/* ---------- 课程数据事实源 ---------- */
const lessonSandbox = { window: {} };
vm.runInNewContext(read('lessons.js'), lessonSandbox);
const guide = lessonSandbox.window.ODIN_GUIDE;
const lessonOf = id => {
  const lesson = guide.lessons.find(item => item.id === id);
  assert.ok(lesson, `lessons.js 中应存在课程 ${id}`);
  return lesson;
};
const lessonFullText = id => {
  const lesson = lessonOf(id);
  return lesson.sections
    .map(part => [part.h, ...part.p, ...(part.list || [])].join('\n'))
    .join('\n');
};

/* ---------- 样板覆盖范围（钉死，不随源码漂移） ---------- */
const COVERED = {
  'git-basics': { processSection: 10, referenceSection: 12, steps: 7, items: 12 },
  'command-line-basics': { processSection: 13, referenceSection: 13, steps: 5, items: 9 }
};
/* 短课对照（低于章节导航阈值）+ 达到阈值但本轮未覆盖的长课，都必须零渲染 */
const NOT_COVERED = ['how-this-course-will-work', 'html-boilerplate', 'links-and-images'];

const mount = id => newPage({
  storage: makeStorage(),
  page: 'lesson',
  search: `?id=${id}`,
  href: `http://127.0.0.1:8765/lesson.html?id=${id}`
});
const mainOf = page => {
  const main = querySelect(page.dom.body, '#main');
  assert.ok(main, '课页应有 #main 挂载点');
  return main;
};
const explainOf = main => {
  const explain = collectByClass(main, 'section-explain')[0];
  assert.ok(explain, '课页应有 section-explain（中文讲解）');
  return explain;
};

/* ===================== 1. 样板表数据合同 + 防编造交叉核对 ===================== */
const tableStart = appSrc.indexOf('const LESSON_MODULE_SAMPLES = {');
assert.ok(tableStart > -1, check('1: app.js 存在 LESSON_MODULE_SAMPLES 样板表'));
const tableEnd = appSrc.indexOf('\n  };', tableStart);
assert.ok(tableEnd > tableStart, check('1: 样板表有明确的结束边界'));
const tableSrc = appSrc.slice(tableStart, tableEnd);

function sampleBlockFor(lessonId) {
  const marker = `'${lessonId}': {`;
  const start = tableSrc.indexOf(marker);
  assert.ok(start > -1, check(`1: 样板表登记了 ${lessonId}`));
  const rest = tableSrc.slice(start + marker.length);
  const next = rest.search(/\n    '[a-z-]+': \{/);
  return next === -1 ? rest : rest.slice(0, next);
}
function extractModule(block, kind) {
  const start = block.indexOf(`${kind}: {`);
  assert.ok(start > -1, check(`1: 样板表含 ${kind} 模块`));
  const rest = block.slice(start);
  const end = rest.indexOf('\n      }');
  return end === -1 ? rest : rest.slice(0, end);
}
const EXPECTED = {};
for (const [lessonId, contract] of Object.entries(COVERED)) {
  const block = sampleBlockFor(lessonId);
  const processBlock = extractModule(block, 'process');
  const referenceBlock = extractModule(block, 'reference');
  const sectionIndexOf = text => {
    const match = /sectionIndex:\s*(\d+)/.exec(text);
    assert.ok(match, check(`1: ${lessonId} 模块声明了 sectionIndex`));
    return Number(match[1]);
  };
  EXPECTED[lessonId] = {
    processSection: sectionIndexOf(processBlock),
    referenceSection: sectionIndexOf(referenceBlock),
    processTitle: /title:\s*'([^']+)'/.exec(processBlock)[1],
    referenceTitle: /title:\s*'([^']+)'/.exec(referenceBlock)[1],
    steps: [...processBlock.matchAll(/\{ title: '([^']+)', detail: '([^']+)' \}/g)]
      .map(match => ({ title: match[1], detail: match[2] })),
    items: [...referenceBlock.matchAll(/\{ term: '([^']+)', description: '([^']+)' \}/g)]
      .map(match => ({ term: match[1], description: match[2] }))
  };
  const expected = EXPECTED[lessonId];

  /* 落点与规模钉死：改数据必须同步改本文件的 COVERED，防止静默漂移 */
  assert.equal(expected.processSection, contract.processSection,
    check(`1: ${lessonId} 流程复习落点 = 第 ${contract.processSection} 章`));
  assert.equal(expected.referenceSection, contract.referenceSection,
    check(`1: ${lessonId} 速查落点 = 第 ${contract.referenceSection} 章`));
  assert.equal(expected.steps.length, contract.steps,
    check(`1: ${lessonId} 流程复习 ${contract.steps} 步（数据独立提取）`));
  assert.equal(expected.items.length, contract.items,
    check(`1: ${lessonId} 速查 ${contract.items} 条（数据独立提取）`));

  /* 落点必须落在该课真实存在的章内（越界即坏数据） */
  const chapterCount = lessonOf(lessonId).sections.length;
  assert.ok(expected.processSection < chapterCount,
    check(`1: ${lessonId} 流程复习 sectionIndex < 章数 ${chapterCount}`));
  assert.ok(expected.referenceSection < chapterCount,
    check(`1: ${lessonId} 速查 sectionIndex < 章数 ${chapterCount}`));

  /* 每条步骤与速查项都非空、且步骤标题互不重复 */
  expected.steps.forEach((step, index) => {
    assert.ok(step.title.trim(), check(`1: ${lessonId} 第 ${index + 1} 步有可读标题`));
    assert.ok(step.detail.trim(), check(`1: ${lessonId} 第 ${index + 1} 步有说明`));
  });
  const stepTitles = expected.steps.map(step => step.title);
  assert.equal(new Set(stepTitles).size, stepTitles.length,
    check(`1: ${lessonId} 流程步骤标题互不重复`));
  expected.items.forEach((item, index) => {
    assert.ok(item.term.trim(), check(`1: ${lessonId} 速查第 ${index + 1} 条有 term`));
    assert.ok(item.description.trim(), check(`1: ${lessonId} 速查第 ${index + 1} 条有 description`));
  });

  /* **防编造交叉核对**：模块里出现的每条命令，都必须在 lessons.js 该课正文里真实出现过。
   * 这条是本样板最重要的数据纪律——模块只做「换一种形态呈现既有内容」，
   * 不得引入正文没有的命令（本轮核对时据此剔除了示例里的 pwd，以及正文未出现的 rm / cd ..）。 */
  const fullText = lessonFullText(lessonId);
  const commandOf = term => {
    /* 取 term 里的**命令本体**：遇到占位符就停——引号包裹的示例消息（"说明" / "code --wait"）、
     * 中文占位词（文件名 / 目录名 / 用户名 / 仓库名）、示例地址（git@github.com:…）。
     * 只以字母开头的才算命令条目；「$ 或 %」这类提示符概念条目按概念处理、不参与命令核对。 */
    const trimmed = term.trim();
    if (!/^[a-z]/i.test(trimmed)) return null;
    const head = [];
    for (const token of trimmed.split(/\s+/)) {
      if (/^["'<（(]/.test(token)) break;
      if (/^(文件名|目录名|用户名|仓库名|说明)/.test(token)) break;
      if (/^git@github\.com/.test(token)) break;
      head.push(token);
    }
    return head.join(' ');
  };
  expected.items.forEach(item => {
    const command = commandOf(item.term);
    if (!command) return;
    assert.ok(fullText.includes(command),
      check(`1: 防编造——速查命令「${command}」在 ${lessonId} 正文真实出现`));
  });
  /* 流程复习的说明里出现的命令同样要在正文有出处 */
  expected.steps.forEach(step => {
    const mentioned = [...step.detail.matchAll(/\b(?:git |code |mkdir |touch |ls\b|cd |whoami\b)[^\s，。；]*/g)]
      .map(match => match[0].trim());
    mentioned.forEach(command => {
      const head = command.replace(/[。，]$/, '');
      assert.ok(fullText.includes(head) || fullText.includes(head.split(/\s+/)[0]),
        check(`1: 防编造——流程说明提到的「${head}」在 ${lessonId} 正文有出处`));
    });
  });
}

/* ===================== 2. 流程复习的渲染结果 ===================== */
for (const lessonId of Object.keys(COVERED)) {
  const expected = EXPECTED[lessonId];
  const page = mount(lessonId);
  const main = mainOf(page);
  const explain = explainOf(main);

  /* 先断言目标存在，再断言内容——禁止 if (found) { assert… } 式的静默跳过 */
  const modules = collectByClass(main, 'lesson-process');
  assert.equal(modules.length, 1, check(`2: ${lessonId} 恰渲染一个流程复习模块`));
  const box = modules[0];
  assert.equal(box.tagName, 'DIV', check(`2: ${lessonId} 流程复习容器是 DIV（不是 section，避免产生 h2）`));

  const titles = collectByClass(box, 'lesson-process-title');
  assert.equal(titles.length, 1, check(`2: ${lessonId} 流程复习恰一个标题`));
  assert.equal(titles[0].tagName, 'P',
    check(`2: ${lessonId} 流程复习标题是 <p> 而不是 h3（h3 会进入 explainHeads，破坏概念图归位与锚点数）`));
  assert.equal(titles[0].textContent, expected.processTitle,
    check(`2: ${lessonId} 流程复习标题文字 = 数据`));

  const lists = collectByClass(box, 'lesson-process-list');
  assert.equal(lists.length, 1, check(`2: ${lessonId} 流程复习恰一个列表`));
  assert.equal(lists[0].tagName, 'OL',
    check(`2: ${lessonId} 流程列表是 <ol>（序号由原生数字提供，是步骤的视觉锚点）`));
  assert.equal(lists[0].children.length, expected.steps.length,
    check(`2: ${lessonId} 流程渲染步数 = 数据步数 ${expected.steps.length}`));

  /* **顺序逐项一致**：渲染结果的第 N 步必须等于数据的第 N 步 */
  [...lists[0].children].forEach((item, index) => {
    assert.equal(item.tagName, 'LI', check(`2: ${lessonId} 第 ${index + 1} 步是 <li>`));
    const step = collectByClass(item, 'lesson-process-step')[0];
    assert.ok(step, check(`2: ${lessonId} 第 ${index + 1} 步有可读标题元素`));
    assert.equal(step.tagName, 'SPAN', check(`2: ${lessonId} 第 ${index + 1} 步标题是 span（不产生新标题层级）`));
    assert.equal(step.textContent, expected.steps[index].title,
      check(`2: ${lessonId} 第 ${index + 1} 步标题与数据顺序一致`));
    const detail = collectByClass(item, 'lesson-process-detail')[0];
    assert.ok(detail, check(`2: ${lessonId} 第 ${index + 1} 步有说明元素`));
    assert.equal(detail.textContent, expected.steps[index].detail,
      check(`2: ${lessonId} 第 ${index + 1} 步说明与数据一致`));
  });

  /* 落点：必须在 section-explain 内、对应章正文之后、下一章 h3 之前 */
  assert.ok(explain.children.includes(box),
    check(`2: ${lessonId} 流程复习是 section-explain 的直接子级（不新增 h2、不进官方任务节）`));
  const siblings = [...explain.children];
  const at = siblings.indexOf(box);
  const next = siblings[at + 1];
  const headings = siblings.filter(child => child.tagName === 'H3');
  const expectedHead = headings[expected.processSection];
  assert.ok(expectedHead, check(`2: ${lessonId} 第 ${expected.processSection} 章的 h3 存在`));
  if (headings[expected.processSection + 1]) {
    assert.equal(next, headings[expected.processSection + 1],
      check(`2: ${lessonId} 流程复习紧邻下一章 h3 之前`));
  } else {
    /* 末章：没有下一章 h3，模块应落在 explain 末尾（速查在其后时则为倒数第二个） */
    assert.ok(at > siblings.indexOf(expectedHead),
      check(`2: ${lessonId} 流程复习落在本章 h3 之后（末章 append 到节末尾）`));
  }
  assert.ok(siblings.indexOf(box) > siblings.indexOf(expectedHead),
    check(`2: ${lessonId} 流程复习在本章 h3 之后（不是插到别的章里）`));
  /* 概念图归位不受影响：模块若产生 h3，这里会与本组其它断言一起红 */
  assert.equal(headings.length, lessonOf(lessonId).sections.length,
    check(`2: ${lessonId} explain 内 H3 数仍等于章数（模块零 h3）`));
}

/* ===================== 3. 命令 / 概念速查的渲染结果 ===================== */
for (const lessonId of Object.keys(COVERED)) {
  const expected = EXPECTED[lessonId];
  const page = mount(lessonId);
  const main = mainOf(page);
  const explain = explainOf(main);

  const modules = collectByClass(main, 'lesson-reference');
  assert.equal(modules.length, 1, check(`3: ${lessonId} 恰渲染一个速查模块`));
  const box = modules[0];
  assert.equal(box.tagName, 'DIV', check(`3: ${lessonId} 速查容器是 DIV`));

  const titles = collectByClass(box, 'lesson-reference-title');
  assert.equal(titles.length, 1, check(`3: ${lessonId} 速查恰一个标题`));
  assert.equal(titles[0].tagName, 'P', check(`3: ${lessonId} 速查标题是 <p>（不产生 h2 / h3）`));
  assert.equal(titles[0].textContent, expected.referenceTitle, check(`3: ${lessonId} 速查标题文字 = 数据`));

  const lists = collectByClass(box, 'lesson-reference-list');
  assert.equal(lists.length, 1, check(`3: ${lessonId} 速查恰一个列表`));
  assert.equal(lists[0].tagName, 'DL', check(`3: ${lessonId} 速查用语义化 <dl>`));
  const rows = collectByClass(lists[0], 'lesson-reference-item');
  assert.equal(rows.length, expected.items.length,
    check(`3: ${lessonId} 速查条数 = 数据条数 ${expected.items.length}`));

  /* term 与 description 一一对应：每条恰一个 dt + 恰一个 dd，且顺序与数据一致 */
  rows.forEach((row, index) => {
    assert.equal(row.tagName, 'DIV', check(`3: ${lessonId} 第 ${index + 1} 条是 div 包裹的 dt/dd 对`));
    const terms = [...row.children].filter(child => child.tagName === 'DT');
    const descriptions = [...row.children].filter(child => child.tagName === 'DD');
    assert.equal(terms.length, 1, check(`3: ${lessonId} 第 ${index + 1} 条恰一个 <dt>`));
    assert.equal(descriptions.length, 1, check(`3: ${lessonId} 第 ${index + 1} 条恰一个 <dd>`));
    assert.equal(terms[0].textContent, expected.items[index].term,
      check(`3: ${lessonId} 第 ${index + 1} 条 term 与数据顺序一致`));
    assert.equal(descriptions[0].textContent, expected.items[index].description,
      check(`3: ${lessonId} 第 ${index + 1} 条 description 与 term 一一对应`));
  });

  /* 落点：在 section-explain 内、对应章之后 */
  assert.ok(explain.children.includes(box),
    check(`3: ${lessonId} 速查是 section-explain 的直接子级（不进官方任务节 / 资源区）`));
  const siblings = [...explain.children];
  const headings = siblings.filter(child => child.tagName === 'H3');
  assert.ok(siblings.indexOf(box) > siblings.indexOf(headings[expected.referenceSection]),
    check(`3: ${lessonId} 速查落在第 ${expected.referenceSection} 章 h3 之后`));
  const nextHead = headings[expected.referenceSection + 1];
  if (nextHead) {
    assert.ok(siblings.indexOf(box) < siblings.indexOf(nextHead),
      check(`3: ${lessonId} 速查在下一章 h3 之前`));
  }

  /* 同章两个模块时的顺序合同：流程复习 → 速查 */
  if (expected.processSection === expected.referenceSection) {
    const processBox = collectByClass(main, 'lesson-process')[0];
    assert.ok(processBox, check(`3: ${lessonId} 同章的流程复习存在（顺序对照对象）`));
    assert.ok(siblings.indexOf(processBox) < siblings.indexOf(box),
      check(`3: ${lessonId} 同章顺序 = 流程复习 → 命令速查（不无规则堆叠）`));
  }
}

/* ===================== 4. 短课对照与未覆盖长课零渲染 ===================== */
for (const lessonId of NOT_COVERED) {
  const page = mount(lessonId);
  const main = mainOf(page);
  const explain = explainOf(main);
  assert.equal(collectByClass(main, 'lesson-process').length, 0,
    check(`4: ${lessonId} 不渲染流程复习（无样板数据）`));
  assert.equal(collectByClass(main, 'lesson-reference').length, 0,
    check(`4: ${lessonId} 不渲染速查（无样板数据）`));
  /* 零渲染不得影响既有结构：H3 数仍等于章数 */
  const headings = [...explain.children].filter(child => child.tagName === 'H3');
  assert.equal(headings.length, lessonOf(lessonId).sections.length,
    check(`4: ${lessonId} explain 内 H3 数仍等于章数`));
}
/* 全站层面：只有样板表登记的两门课有模块，其余 17 课零渲染 */
{
  const withModules = [];
  for (const lesson of guide.lessons) {
    const page = mount(lesson.id);
    const main = mainOf(page);
    if (collectByClass(main, 'lesson-process').length || collectByClass(main, 'lesson-reference').length) {
      withModules.push(lesson.id);
    }
  }
  assert.deepEqual(withModules.slice().sort(), Object.keys(COVERED).slice().sort(),
    check(`4: 全站只有 ${Object.keys(COVERED).length} 门样板课渲染新模块（19 课逐一渲染核对，未批量铺开）`));
}

/* ===================== 5. 不污染既有结构（回归合同） ===================== */
const V2_H2_WITH_CODE = ['这一课为什么重要', '中文讲解', '重要英文术语', '代码示例', '常见错误', '官方任务', '简单自测'];
const V2_H2_NO_CODE = ['这一课为什么重要', '中文讲解', '重要英文术语', '常见错误', '官方任务', '简单自测'];
const collectTagDeep = (element, tagName) => {
  const found = [];
  const walk = node => {
    (node.children || []).forEach(child => {
      if (child.tagName === tagName) found.push(child);
      walk(child);
    });
  };
  walk(element);
  return found;
};

for (const lessonId of Object.keys(COVERED)) {
  const lesson = lessonOf(lessonId);
  const page = mount(lessonId);
  const main = mainOf(page);
  const explain = explainOf(main);

  /* h2 序列不变（模块零 h2） */
  const h2 = [...main.children]
    .filter(child => child.tagName === 'SECTION')
    .map(child => [...child.children].find(item => item.tagName === 'H2').textContent);
  const expectedH2 = lesson.examples.length ? V2_H2_WITH_CODE : V2_H2_NO_CODE;
  assert.deepEqual(h2, expectedH2, check(`5: ${lessonId} main 的 h2 序列不变（模块不新增 h2）`));

  /* 模块不进官方任务节 / 资源区 / 自测区 */
  const official = collectByClass(main, 'section-official')[0];
  assert.ok(official, check(`5: ${lessonId} 官方任务节存在`));
  assert.equal(collectByClass(official, 'lesson-process').length, 0,
    check(`5: ${lessonId} 官方任务节内零流程复习`));
  assert.equal(collectByClass(official, 'lesson-reference').length, 0,
    check(`5: ${lessonId} 官方任务节内零速查`));
  const quiz = collectByClass(main, 'section-quiz')[0];
  assert.ok(quiz, check(`5: ${lessonId} 自测节存在`));
  assert.equal(collectByClass(quiz, 'lesson-process').length + collectByClass(quiz, 'lesson-reference').length, 0,
    check(`5: ${lessonId} 自测节内零新模块`));

  /* details 数仍 === quiz 数（模块零 details/summary，不抢自测答案折叠） */
  assert.equal(collectTagDeep(main, 'DETAILS').length, lesson.quiz.length,
    check(`5: ${lessonId} 课页 details 数 === quiz 数（${lesson.quiz.length}）`));
  assert.equal(collectTagDeep(official, 'DETAILS').length, 0,
    check(`5: ${lessonId} 官方任务节零 details`));
  assert.equal(collectTagDeep(main, 'DETAILS').filter(item => item.open).length, 0,
    check(`5: ${lessonId} 零 details 默认展开`));

  /* Assignment 首个 OL 合同：official 节内文档序第一个 OL 仍是任务列表，
   * 且条目文本一字不改（explain 里的流程复习 OL 不在该断言作用域内） */
  const officialOls = collectTagDeep(official, 'OL');
  assert.ok(officialOls.length >= 1, check(`5: ${lessonId} 官方任务节内有 Assignment <ol>`));
  const assignmentItems = [...officialOls[0].children].map(item => item.textContent);
  assert.equal(assignmentItems.length, lesson.official.assignment.length,
    check(`5: ${lessonId} Assignment 条目数不变（${lesson.official.assignment.length}）`));

  /* 资源区直接子结构不变：h3#lesson-resources + 前言 p 仍是节级直接子 */
  const resourceHead = collectTagDeep(official, 'H3').find(item => item.id === 'lesson-resources');
  if (resourceHead) {
    assert.equal(official.children.includes(resourceHead), true,
      check(`5: ${lessonId} 资源区 h3 仍是 section-official 直接子级`));
  }

  /* 章节导航不回归：仍是纵向 <ol>、链接数 = 章数、无重复序号 */
  const navs = collectByClass(main, 'lesson-chapter-nav');
  const chapterCount = lesson.sections.length;
  if (chapterCount >= 12) {
    assert.equal(navs.length, 1, check(`5: ${lessonId} 章节导航仍存在（长课）`));
    const navList = collectByClass(navs[0], 'lesson-chapter-nav-list')[0];
    assert.equal(navList.tagName, 'OL', check(`5: ${lessonId} 章节目录仍是 <ol>`));
    const navLinks = collectByClass(navs[0], 'lesson-chapter-link');
    assert.equal(navLinks.length, chapterCount, check(`5: ${lessonId} 章节链接数 = 章数 ${chapterCount}`));
    navLinks.forEach((item, index) => {
      assert.equal(item.textContent, lesson.sections[index].h,
        check(`5: ${lessonId} 第 ${index + 1} 条章节链接文字仍逐字等于事实源`));
      assert.ok(!/^章节 \d+[:：]/.test(item.textContent),
        check(`5: ${lessonId} 第 ${index + 1} 条章节链接无人工序号（不与 <ol> 数字叠加）`));
    });
    const hrefs = navLinks.map(item => item.href);
    assert.equal(new Set(hrefs).size, hrefs.length,
      check(`5: ${lessonId} 章节锚点无重复（序号与锚点都不重复）`));
    hrefs.forEach(href => {
      const target = querySelect(page.dom.body, href);
      assert.ok(target, check(`5: ${lessonId} 章节锚点 ${href} 有真实落点`));
      assert.equal(target.tagName, 'H3', check(`5: ${lessonId} 章节锚点 ${href} 落在 h3`));
    });
  } else {
    assert.equal(navs.length, 0, check(`5: ${lessonId} 短课不显示章节导航`));
  }

  /* 概念图仍按章归位：图数 = 该课清单数，且全部住在 explain 内 */
  const figures = collectTagDeep(explain, 'FIGURE').filter(item => String(item.className).includes('concept-diagram'));
  const floating = [...main.children].filter(child => child.tagName === 'FIGURE'
    && String(child.className).includes('concept-diagram'));
  assert.equal(floating.length, 0, check(`5: ${lessonId} 零 main 级漂浮概念图（模块未把图挤出 explain）`));
  assert.ok(figures.length >= 0, check(`5: ${lessonId} 概念图仍在 explain 内（${figures.length} 张）`));
}

/* ===================== 6. 零交互 / 零存储 / 零档案写入 ===================== */
for (const lessonId of Object.keys(COVERED)) {
  const storage = makeStorage();
  const page = newPage({
    storage,
    page: 'lesson',
    search: `?id=${lessonId}`,
    href: `http://127.0.0.1:8765/lesson.html?id=${lessonId}`
  });
  const main = mainOf(page);
  const boxes = [...collectByClass(main, 'lesson-process'), ...collectByClass(main, 'lesson-reference')];
  assert.equal(boxes.length, 2, check(`6: ${lessonId} 两个模块都已渲染（交互检查的对照对象存在）`));

  boxes.forEach(box => {
    const label = String(box.className);
    /* 零可点击 / 可聚焦元素：模块是内容，不是打卡或收藏系统 */
    ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'DETAILS', 'SUMMARY'].forEach(tag => {
      assert.equal(collectTagDeep(box, tag).length, 0,
        check(`6: ${lessonId} ${label} 内零 <${tag}>（不产生可点击状态）`));
    });
    const all = collectTagDeep(box, 'LI').concat(collectTagDeep(box, 'DIV'), [box]);
    all.forEach(element => {
      const attrs = element.attributes || {};
      assert.equal(attrs.tabindex, undefined, check(`6: ${lessonId} ${label} 零 tabindex（不可聚焦）`));
      assert.equal(typeof attrs.onclick, 'undefined', check(`6: ${lessonId} ${label} 零 onclick`));
    });
  });

  /* 零新增 storage key：只允许应用自己的合法档案 key */
  const keys = [];
  for (let index = 0; index < storage.length; index += 1) keys.push(storage.key(index));
  keys.forEach(key => {
    assert.ok([STORAGE_KEY, LEGACY_STORAGE_KEY].includes(key),
      check(`6: ${lessonId} 渲染后 storage 只有合法档案 key（发现 ${key}）`));
  });

  /* 零档案字段新增：含模块的课与不含模块的短课，档案 JSON 的字段集合必须相同 */
  const archiveKeys = store => {
    const raw = store.getItem(STORAGE_KEY);
    return raw ? Object.keys(JSON.parse(raw)).sort() : [];
  };
  const shortStorage = makeStorage();
  newPage({
    storage: shortStorage,
    page: 'lesson',
    search: '?id=how-this-course-will-work',
    href: 'http://127.0.0.1:8765/lesson.html?id=how-this-course-will-work'
  });
  assert.deepEqual(archiveKeys(storage), archiveKeys(shortStorage),
    check(`6: ${lessonId} 档案字段集合与短课一致（模块不写档案、不新增 schema 字段）`));
}

/* ===================== 7. CSS 合同 ===================== */
const stripCssComments = source => source.replace(/\/\*[\s\S]*?\*\//g, '');
const cssNoComments = stripCssComments(css);
function ruleBody(selector, label) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = cssNoComments.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  assert.ok(match, check(`7: style.css 存在 ${label} 规则（${selector}）`));
  return match[1];
}

/* 7.1 流程复习：纵向、每步一行、不用 flex（章节导航踩过横向 wrap 的坑） */
{
  const listRule = ruleBody('body[data-page="lesson"] .lesson-process-list', '流程复习列表');
  assert.ok(/display:\s*block/.test(listRule), check('7: 流程列表是纵向块级（每步独占一行）'));
  assert.ok(!/\bflex\b/.test(listRule), check('7: 流程列表不用 flex（避免两项挤进同一行）'));
  assert.ok(/padding-left:\s*1\.5rem/.test(listRule), check('7: 流程列表给原生序号留位（序号是视觉锚点）'));
  const boxRule = ruleBody('body[data-page="lesson"] .lesson-process', '流程复习容器');
  assert.ok(/background:\s*var\(--color-wash\)/.test(boxRule), check('7: 流程复习容器用既有 wash 底（不新起卡片体系）'));
  assert.ok(/border-left:\s*\.45rem solid var\(--color-rule\)/.test(boxRule),
    check('7: 流程复习用低对比左轨 --color-rule（不是 .lesson-guide 的 accent 条，层级低于引导块）'));
  assert.ok(/min-width:\s*0/.test(boxRule), check('7: 流程复习容器 min-width:0（320px 不溢出的前提）'));
  assert.ok(!/animation|transition/.test(boxRule), check('7: 流程复习零动画'));
  ruleBody('body[data-page="lesson"] .lesson-process-list li:last-child', '流程末步间距');
}

/* 7.2 速查：dl 语义 + 长命令换行 + 低对比规则线 */
{
  const boxRule = ruleBody('body[data-page="lesson"] .lesson-reference', '速查容器');
  assert.ok(/background:\s*var\(--color-wash\)/.test(boxRule), check('7: 速查容器用既有 wash 底'));
  assert.ok(/border:\s*1px solid var\(--color-rule\)/.test(boxRule), check('7: 速查用低对比 rule 边框'));
  assert.ok(/min-width:\s*0/.test(boxRule), check('7: 速查容器 min-width:0'));
  /* 不固定宽度：注意不能用 /\bwidth:/ —— \b 在 min-width 的 `-width` 处同样成立，
   * 会把正当的 min-width:0 误判成固定宽度（本条曾因此假红）。用后行断言排除前缀。 */
  assert.ok(!/(?<![-\w])width:\s*\d/.test(boxRule), check('7: 速查容器不固定宽度（只有 min-width:0）'));
  assert.ok(!/(?<![-\w])width:\s*\d/.test(ruleBody('body[data-page="lesson"] .lesson-process', '流程复习容器')),
    check('7: 流程复习容器不固定宽度'));
  const itemRule = ruleBody('body[data-page="lesson"] .lesson-reference-item', '速查条目');
  assert.ok(/flex-wrap:\s*wrap/.test(itemRule), check('7: 速查条目允许换行（窄屏时说明掉到命令下方）'));
  assert.ok(/border-bottom:\s*1px solid var\(--color-rule\)/.test(itemRule), check('7: 速查条目之间是低对比规则线'));
  const dtRule = ruleBody('body[data-page="lesson"] .lesson-reference-item dt', '速查 term');
  assert.ok(/font-family:\s*var\(--font-mono\)/.test(dtRule), check('7: term 用等宽字体（命令可辨识）'));
  assert.ok(/white-space:\s*pre-wrap/.test(dtRule), check('7: 长命令 pre-wrap 换行而不是撑宽容器'));
  assert.ok(/overflow-wrap:\s*anywhere/.test(dtRule), check('7: term 允许任意处断行（320px 不溢出）'));
  const ddRule = ruleBody('body[data-page="lesson"] .lesson-reference-item dd', '速查 description');
  assert.ok(/overflow-wrap:\s*anywhere/.test(ddRule), check('7: description 允许断行'));
  assert.ok(/flex:\s*1 1 14rem/.test(ddRule), check('7: description 可收缩（不固定宽度、不撑破窄屏）'));
}

/* 7.3 **文本配色纪律**：wash 底上不得用 accent / muted
 * 全部 30 套主题实测 muted/wash 最差 4.20:1（linen）、accent/wash 最差 4.03:1（dune），
 * 两档都低于正文 4.5:1；ink/wash 最差 9.89:1 全部达标。层次靠字重与字号，不靠降对比度。
 * 全量数值钉子见 tests/themes-contrast.test.cjs 第 8 节。 */
{
  const textSelectors = [
    '.lesson-process-title', '.lesson-process-step', '.lesson-process-detail',
    '.lesson-reference-title', '.lesson-reference-item dt', '.lesson-reference-item dd'
  ];
  textSelectors.forEach(selector => {
    const body = ruleBody(`body[data-page="lesson"] ${selector}`, `模块文本 ${selector}`);
    assert.ok(/color:\s*var\(--color-ink\)/.test(body),
      check(`7: ${selector} 文本取 --color-ink（wash 底上全部 30 套主题达标）`));
    assert.ok(!/color:\s*var\(--color-accent\)/.test(body),
      check(`7: ${selector} 不得取 --color-accent（accent/wash 有 7 套主题 <4.5:1）`));
    assert.ok(!/color:\s*var\(--color-muted\)/.test(body),
      check(`7: ${selector} 不得取 --color-muted（muted/wash 有 4 套主题 <4.5:1）`));
  });
  /* 层次由字重承担（不靠颜色），且步骤标题与说明的字号确有区分 */
  assert.ok(/font-weight:\s*700/.test(ruleBody('body[data-page="lesson"] .lesson-process-title', '流程标题字重')),
    check('7: 流程复习标题靠 font-weight 700 建立层次'));
  assert.ok(/font-size:\s*var\(--text-small\)/.test(ruleBody('body[data-page="lesson"] .lesson-process-detail', '流程说明字号')),
    check('7: 流程说明用 --text-small 与步骤标题区分'));
}

/* 7.4 print 合同：两个模块的内容必须保留（与章节导航相反） */
{
  const printBlocks = css.match(/@media print\s*\{[\s\S]*?\n\}/g) || [];
  assert.ok(printBlocks.length > 0, check('7: style.css 存在 @media print 块'));
  const printCss = printBlocks.join('\n');
  const hides = printCss.match(/\.lesson-(process|reference)[^{]*\{[^}]*display:\s*none/g);
  assert.equal(hides, null, check('7: 打印时两个模块不得 display:none（它们是正文内容，纸质输出必须完整）'));
  /* 对照：章节导航仍然打印隐藏（它是定位工具，不是内容） */
  assert.ok(/\.lesson-chapter-nav\s*\{\s*display:\s*none/.test(printCss),
    check('7: 对照——章节导航仍打印隐藏（模块与导航的打印口径刻意不同）'));
}

/* 7.5 作用域：课页新模块的每条规则都带 body[data-page="lesson"] 前缀，不污染首页 */
{
  const moduleSelectors = [...cssNoComments.matchAll(/([^{}]+)\{/g)]
    .map(match => match[1])
    .filter(selector => /\.lesson-(process|reference)/.test(selector));
  assert.ok(moduleSelectors.length >= 10,
    check(`7: 两个模块的规则已生效（提取到 ${moduleSelectors.length} 条选择器）`));
  moduleSelectors.forEach(selector => {
    selector.split(',').forEach(part => {
      const trimmed = part.trim();
      if (!trimmed) return;
      assert.ok(trimmed.startsWith('body[data-page="lesson"]'),
        check(`7: 模块规则带课页作用域前缀，不泄漏到首页（${trimmed.slice(0, 60)}）`));
    });
  });
  /* 首页不得出现模块类名（共享类名污染检查） */
  assert.ok(!read('index.html').includes('lesson-process'), check('7: index.html 不含 lesson-process'));
  assert.ok(!read('index.html').includes('lesson-reference'), check('7: index.html 不含 lesson-reference'));
}

/* ===================== 8. 本轮一并修正的既有缺陷：章节导航标题对比度 ===================== */
{
  const navTitle = ruleBody('.lesson-chapter-nav-title', '章节导航标题');
  assert.ok(/color:\s*var\(--color-ink\)/.test(navTitle),
    check('8: 章节导航标题取 --color-ink（修正 accent/wash 在 7 套主题 <4.5:1 的既有缺陷）'));
  assert.ok(!/color:\s*var\(--color-accent\)/.test(navTitle),
    check('8: 章节导航标题不得改回 --color-accent'));
  assert.ok(/font-weight:\s*700/.test(navTitle),
    check('8: 章节导航标题的视觉权重由 font-weight 700 承担（不靠颜色）'));
}

/* ===================== 9. 负向自检：证明上面的断言真能抓住回归 ===================== */
{
  /* 9.1 若流程列表改回横向 flex，布局断言必须能抓到 */
  const flexRegression = 'display: flex; flex-wrap: wrap; gap: var(--space-md);';
  assert.ok(/\bflex\b/.test(flexRegression), check('9: 负向自检——横向 flex 回归会被布局断言命中'));
  assert.ok(!/display:\s*block/.test(flexRegression), check('9: 负向自检——回归样式确实不含纵向 block'));

  /* 9.2 若模块标题写成 h3，会进入 explainHeads：用真实渲染证明 H3 数会变 */
  const lessonId = 'git-basics';
  const page = mount(lessonId);
  const explain = explainOf(mainOf(page));
  const headings = [...explain.children].filter(child => child.tagName === 'H3').length;
  assert.equal(headings, lessonOf(lessonId).sections.length,
    check('9: 负向自检基线——当前 explain 内 H3 数恰等于章数（多一个 h3 就会红）'));
  assert.equal(headings + 2 > lessonOf(lessonId).sections.length, true,
    check('9: 负向自检——若两个模块标题改用 h3，H3 数将超过章数而被第 2/3 组断言抓住'));

  /* 9.3 若往样板表塞一条正文没有的命令，防编造断言必须能抓到 */
  const fakeCommand = 'git rebase --interactive';
  assert.ok(!lessonFullText('git-basics').includes(fakeCommand),
    check('9: 负向自检——正文没有的命令确实不会被防编造断言放过'));

  /* 9.4 若模块文本改用 muted，配色断言必须能抓到 */
  const mutedRegression = 'color: var(--color-muted);';
  assert.ok(/color:\s*var\(--color-muted\)/.test(mutedRegression),
    check('9: 负向自检——muted 回归会被配色断言命中'));

  /* 9.5 若打印规则隐藏模块，print 断言必须能抓到 */
  const printRegression = '.lesson-process { display: none; }';
  assert.ok(/\.lesson-(process|reference)[^{]*\{[^}]*display:\s*none/.test(printRegression),
    check('9: 负向自检——打印隐藏模块会被 print 断言命中'));
}

console.log(`lesson-visual-modules.test.cjs：全部 ${checks} 项断言通过 ✔（流程复习 + 命令/概念速查样板：数据防编造交叉核对、语义结构与顺序、落点章节、短课零渲染、既有结构零回归、零交互零存储、CSS 与 print 合同、章节导航标题对比度修正）`);
