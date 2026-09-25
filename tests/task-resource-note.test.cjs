/* v4.11.7 资料条数与题目数对应关系说明的收口断言（v4.11.17 口径）。
 *
 * 标注证明的验收标准：
 *   N1 —— 出现范围：恰在 3 课（assignment 未接链条目 ≥ 5），其余 17 课零出现；
 *         名单与计数是数据核对结论，写死钉住——数据变化让标注增减时必须是有意
 *         改名单，而不是规则悄悄漂移。
 *   N2 —— 文案与数据一致：数字全部从 lessons.js + external-resources.js +
 *         lesson-task-links.js 现算比对（本文件独立复算，不抄 app.js 实现）；
 *         模板句式逐字钉住。
 *   N3 —— 落点纪律：<p class="meta task-resource-note">、**紧跟资源区标题
 *         （#lesson-resources）之后**、非 <a>、内部零链接、禁语零出现。
 *         v4.11.7 的核心修复即落点：v4.11.6 曾把它挂在任务列表下方，
 *         那里没有数字可对照，且与资源区条数并列成两个打架的数字。
 *         本组断言**反向钉住不得回到旧落点**（Assignment 标题与列表之间零标注）。
 *   N4 —— 负向验证：篡改映射数据后重挂载，数字必须跟着变（防写死）；
 *         清空映射 → 标注整体消失（null 路径不留空 p）；阈值边界两侧都有钉子。
 *
 * v4.11.17：官方 2026-09-23 移除课末自查题一节，本站同步下线——标注只剩
 * Assignment 一类模板，命中的课由 7 课收缩为 3 课，两类合成两句的情形随之消失。
 *
 * 数据基线（2026-09-24 实测）：
 *   资源条数：how-does-the-web-work 9 / links-and-images 9 / command-line-basics 7
 *             setting-up-git 6 / git-basics 3 / introduction-to-git 5 / intro-html-css 1
 *   Assignment 接链/总条：git-basics 2/21、setting-up-git 4/16、command-line 2/7
 *   条件命中即渲染，无任何课特判（join-the-odin-community 5-2=3、
 *   text-editors 5-2=3 等未达阈值即不标）。 */
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
const taskLinks = loadData('lesson-task-links.js', 'ODIN_TASK_LINKS');
const resourceData = loadData('external-resources.js', 'ODIN_RESOURCES');
const resourceCountOf = lessonId => resourceData.resources.filter(r => r.lessonId === lessonId).length;

const { newPage, makeDom, makeStorage, collectByClass, querySelect, SCRIPTS } = require('./dom-stub.cjs');
const textOf = el => (!el ? '' : el.textContent || '');
const mountLesson = id => newPage({ storage: makeStorage(), page: 'lesson', search: `?id=${id}`, href: `http://127.0.0.1:8765/lesson.html?id=${id}` });
const mainOf = page => querySelect(page.dom.body, '#main');
const officialOf = page => collectByClass(mainOf(page), 'section-official')[0];
const notesOf = page => collectByClass(officialOf(page), 'task-resource-note');

/* ---------- 独立复算规则（刻意不复用 app.js 实现，防同源错误） ---------- */
function expectedNote(lesson) {
  const entry = taskLinks.links[lesson.id];
  if (!entry) return null;
  const parts = [];
  const aLinks = entry.a || null;
  if (aLinks) {
    const linked = Object.keys(aLinks).filter(num => Array.isArray(aLinks[num]) && aLinks[num].length);
    const total = lesson.official.assignment.length;
    if (linked.length && total - linked.length >= 5) {
      parts.push(`官方 ${total} 条任务大多是终端与 GitHub 上的动手操作，其中 ${linked.length} 条需要外部文章，已附链接。`);
    }
  }
  return parts.length ? parts.join(' ') : null;
}

/* ---------- N1：出现范围名单写死（增减必须是有意的） ---------- */
const NOTE_LESSONS = ['command-line-basics', 'setting-up-git', 'git-basics'];

/* ---------- N2 + N3：逐课文案、落点与渲染纪律 ---------- */
const BANNED_IN_NOTE = ['中文辅助', '全部地址已于', '核验方法见首页', '自动核验受限', '资料不全', '部分参考', '核验'];
for (const lesson of guide.lessons) {
  const page = mountLesson(lesson.id);
  const official = officialOf(page);
  const notes = notesOf(page);
  const expected = expectedNote(lesson);

  /* N1：每课至多一条，名单写死 */
  assert.equal(notes.length, expected ? 1 : 0,
    `N1: ${lesson.id} 标注数量应为 ${expected ? 1 : 0}，实际 ${notes.length}`);
  assert.equal(NOTE_LESSONS.includes(lesson.id), Boolean(expected),
    `N1: ${lesson.id} 标注出现性与名单不一致（名单变化必须是有意的）`);
  if (!expected) continue;
  /* v4.11.17：自查题类模板下线后不再有「两类合成两句」的课，命中的课一律恰一句 */
  const sentenceCount = textOf(notes[0]).split('。').filter(s => s.trim()).length;
  assert.equal(sentenceCount, 1, `N1: ${lesson.id} 标注恰一句（自查题类模板已下线，无两句合成）`);

  const note = notes[0];
  /* N2：文案与独立复算逐字一致 */
  assert.equal(textOf(note), expected, `N2: ${lesson.id} 标注文案与数据复算不一致`);

  /* N3：渲染纪律 */
  assert.equal(note.tagName, 'P', `N3: ${lesson.id} 标注是 p 元素`);
  const classes = String(note.className).split(/\s+/);
  assert.ok(classes.includes('meta'), `N3: ${lesson.id} 标注带 meta class`);
  assert.ok(classes.includes('task-resource-note'), `N3: ${lesson.id} 标注带 task-resource-note class`);
  assert.equal(note.parentNode, official, `N3: ${lesson.id} 标注是 section-official 直接子级`);
  assert.equal(collectByClass(note, 'task-link').length, 0, `N3: ${lesson.id} 标注内零链接`);
  assert.ok(!(note.childNodes || []).some(n => n.tagName === 'A'), `N3: ${lesson.id} 标注不得含 <a>`);

  /* N3 核心：紧跟资源区标题之后——数字出现的位置 */
  const children = official.childNodes || [];
  const at = children.indexOf(note);
  const prev = children[at - 1];
  assert.ok(prev && prev.tagName === 'H3' && prev.id === 'lesson-resources',
    `N3: ${lesson.id} 标注必须紧跟资源区标题（#lesson-resources）之后——数字出现的地方`);
  assert.ok(textOf(prev).includes('本课外部资料'),
    `N3: ${lesson.id} 标注前一个兄弟是资源区标题`);

  /* N3 反向钉子：不得回到 v4.11.6 的旧落点（Assignment 标题与列表之间）。
   * v4.11.7 的旧落点在自查题与任务列表下方；自查题列表已下线，等价的反向保护
   * 保留为「Assignment 标题之后到资源区标题之前，除 Exercise / 可选项 / note
   * 之外不得再插标注」。 */
  const assignmentIndex = children.findIndex(n => n.tagName === 'H3' && textOf(n).startsWith('Assignment'));
  assert.ok(assignmentIndex >= 0, `N3: ${lesson.id} Assignment 标题在位`);
  const between = children.slice(assignmentIndex + 1, at);
  assert.equal(between.filter(n => String(n.className).includes('task-resource-note')).length, 0,
    `N3: ${lesson.id} Assignment 标题之后、资源区之前不得再有标注（v4.11.6 旧落点）`);
  assert.ok(at > assignmentIndex, `N3: ${lesson.id} 标注必须排在 Assignment 标题之后`);

  BANNED_IN_NOTE.forEach(banned => assert.ok(!textOf(note).includes(banned),
    `N3: ${lesson.id} 标注不得含「${banned}」（审计信息 / 不实表述 / D7 计数红线）`));
  assert.ok(!textOf(note).startsWith('其中'), `N3: ${lesson.id} 标注不得以「其中」开头（A1 前言禁语同一口径）`);
}

/* N2：模板代表课逐字钉住（防模板被顺手改写；数字仍由上一条按数据校验） */
{
  assert.equal(textOf(notesOf(mountLesson('git-basics'))[0]),
    '官方 21 条任务大多是终端与 GitHub 上的动手操作，其中 2 条需要外部文章，已附链接。',
    'N2: Assignment 模板代表课（总条数含 v4.11.17 删掉的原末条）');
  assert.equal(textOf(notesOf(mountLesson('command-line-basics'))[0]),
    '官方 7 条任务大多是终端与 GitHub 上的动手操作，其中 2 条需要外部文章，已附链接。',
    'N2: 阈值恰好命中（7 − 2 = 5）的代表课');
  assert.equal(textOf(notesOf(mountLesson('setting-up-git'))[0]),
    '官方 16 条任务大多是终端与 GitHub 上的动手操作，其中 4 条需要外部文章，已附链接。',
    'N2: 大条数课的代表');
}

/* N4：负向验证——篡改数据后重挂载，文案必须跟着变
 * app.js 的标注若被改成写死数字（或模板脱离数据），本组立刻红。 */
const mountWithLinks = (lessonId, tamperedLinks) => {
  const page = makeDom({ storage: makeStorage(), page: 'lesson', search: `?id=${lessonId}`, href: `http://127.0.0.1:8765/lesson.html?id=${lessonId}` });
  for (const script of SCRIPTS) {
    const src = script.name === 'lesson-task-links.js'
      ? `window.ODIN_TASK_LINKS = ${JSON.stringify(tamperedLinks)};`
      : script.src;
    vm.runInNewContext(src, page.sandbox, { filename: script.name });
  }
  return page;
};
const cloneLinks = () => JSON.parse(JSON.stringify(taskLinks));
{
  /* 1) 删映射 → 数字必须跟着变（21 → 20 条，1 条带链） */
  const tampered = cloneLinks();
  delete tampered.links['git-basics'].a[17];
  const note = notesOf(mountWithLinks('git-basics', tampered))[0];
  assert.ok(note, 'N4: 删一条映射后标注仍存在（带链数仍 > 0）');
  assert.equal(textOf(note), '官方 21 条任务大多是终端与 GitHub 上的动手操作，其中 1 条需要外部文章，已附链接。',
    'N4: 文案数字必须跟着数据变（1 现算）');
  assert.throws(() => assert.ok(textOf(note).includes('其中 2 条')),
    'N4: 旧数字必须不再匹配（若文案写死，本断言空转、上一条已红）');
  /* 2) 映射清空 → 标注消失（无线索不渲染，不留空 p） */
  const tampered2 = cloneLinks();
  tampered2.links['command-line-basics'].a = {};
  assert.equal(notesOf(mountWithLinks('command-line-basics', tampered2)).length, 0,
    'N4: 映射清空后标注整体消失（null 路径）');
  /* 3) 阈值边界两侧都有钉子：how-does-the-web-work 共 6 条任务、原始 6 条全接链
   *    → 差值 0 不标；删到只剩 2 条映射 → 差值 4 仍不标；只剩 1 条 → 差值 5 触发。 */
  assert.equal(notesOf(mountLesson('how-does-the-web-work')).length, 0,
    'N4: 原始数据（6 − 6 = 0）不标注');
  const tampered3 = cloneLinks();
  const keep2 = Object.entries(tampered3.links['how-does-the-web-work'].a).slice(0, 2);
  tampered3.links['how-does-the-web-work'].a = Object.fromEntries(keep2);
  assert.equal(notesOf(mountWithLinks('how-does-the-web-work', tampered3)).length, 0,
    'N4: 差值 4（6 − 2）仍不标注——阈值下边界');
  const tampered4 = cloneLinks();
  tampered4.links['how-does-the-web-work'].a = Object.fromEntries(keep2.slice(0, 1));
  assert.equal(textOf(notesOf(mountWithLinks('how-does-the-web-work', tampered4))[0]),
    '官方 6 条任务大多是终端与 GitHub 上的动手操作，其中 1 条需要外部文章，已附链接。',
    'N4: 差值拉到 5（6 − 1）即触发标注——阈值上边界');
}

console.log('通过：资料条数与题目数对应关系说明（v4.11.17）——N1 出现范围名单钉死（3 课命中 / 其余 17 课零出现，自查题类模板下线后不再有两句合成）、N2 模板文案与数据独立复算一致且代表课逐字钉住、N3 落点纪律（p.meta.task-resource-note 紧跟 #lesson-resources 之后、反向钉住不得回到 v4.11.6 旧落点、非 <a>、禁语零出现）、N4 负向验证（篡改映射后数字跟随、清空消失、>=5 阈值上下边界两侧都有钉子）。');
