/* v4.11.6 任务与资料对应关系标注的收口断言（交接 §3.2 / §3.6）。
 *
 * 标注证明的验收标准：
 *   N1 —— 出现范围：KC 标注恰在 6 课（A 类 2 + B 类 4）、Assignment 标注恰在
 *         3 课（未接链条目 ≥ 5 的课），其余 13 课零出现；名单与计数是本轮
 *         数据核对结论，写死钉住——数据变化让标注增减时必须是有意的改名单，
 *         而不是解析规则悄悄漂移（与 lesson-reader-fixes C 组 46/54/31 同法）。
 *   N2 —— 文案与数据一致：数字全部按 §3.2 规则从 lessons.js +
 *         lesson-task-links.js 现算比对（本文件独立复算，不抄 app.js 实现）；
 *         三类模板逐字钉住句式。
 *   N3 —— 渲染纪律：<p class="meta task-resource-note">、非 <a>、内部零链接
 *         元素、落点在对应 h3 与折叠容器之间（section-official 直接子级）、
 *         禁语零出现（「中文辅助」/ 以「其中」开头 / 审计口径字样 / 不实表述）。
 *   N4 —— 负向验证（交接 §3.6「必须能抓到数据变了文案没变」）：用篡改后的
 *         映射数据重新挂载页面，标注数字必须跟着变；钉死的旧文案必须不再
 *         匹配（assert.throws 捕获）；映射清空时标注整体消失。若有人把
 *         app.js 的文案改成写死数字，本组断言变红。
 *
 * 数据基线（2026-09-19 实测，交接 §2 复核一致）：
 *   KC A 类：how-does-the-web-work 15题全带链→去重7份；commit-messages 2题全带链→去重1份
 *   KC B 类：command-line-basics 11题9带链→2份；introduction-to-git 6题2带链→2份；
 *            introduction-to-html-and-css 4题2带链→1份；links-and-images 9题1带链→1份
 *   Assignment：git-basics 22条2带链；setting-up-git 17条4带链；command-line-basics 8条2带链
 *   （text-editors 6-2=4、installations 6-3=3、working-with-text 6-3=3，
 *     未接链条目 < 5，按 §3.2 条件不标注——条件命中即渲染，无任何课特判。） */
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

const { newPage, makeDom, makeStorage, collectByClass, querySelect, SCRIPTS } = require('./dom-stub.cjs');
const textOf = el => (!el ? '' : el.textContent || '');
const mountLesson = id => newPage({ storage: makeStorage(), page: 'lesson', search: `?id=${id}`, href: `http://127.0.0.1:8765/lesson.html?id=${id}` });
const mainOf = page => querySelect(page.dom.body, '#main');
const officialOf = page => collectByClass(mainOf(page), 'section-official')[0];
const notesOf = page => collectByClass(officialOf(page), 'task-resource-note');
const urlBase = u => String(u).split('#')[0].replace(/\/+$/, '');

/* ---------- 独立复算 §3.2 规则（刻意不复用 app.js 实现，防同源错误） ---------- */
function expectedNote(lesson, kind) {
  const entry = taskLinks.links[lesson.id];
  const links = entry ? entry[kind] || null : null;
  if (!links) return null;
  const linkedNums = Object.keys(links).filter(num => Array.isArray(links[num]) && links[num].length);
  if (!linkedNums.length) return null;
  if (kind === 'k') {
    const total = lesson.official.knowledgeCheck.length;
    const materials = new Set();
    linkedNums.forEach(num => links[num].forEach(url => materials.add(urlBase(url))));
    if (linkedNums.length === total && total > materials.size) {
      return `${total} 道自查题指向下方 ${materials.size} 份资料：多道题共用同一篇，点开就能看。`;
    }
    if (linkedNums.length < total) {
      return `${total} 道题中有 ${linkedNums.length} 道需要外部资料，指向下方 ${materials.size} 份；其余各题指向官方原课自身的章节，本站未接外链。`;
    }
    return null;
  }
  const total = lesson.official.assignment.length;
  if (total - linkedNums.length >= 5) {
    return `${total} 条任务大多是终端与 GitHub 上的动手操作；其中 ${linkedNums.length} 条需要外部文章，已附链接。`;
  }
  return null;
}

/* ---------- N1：出现范围名单写死（增减必须是有意的） ---------- */
const KC_NOTE_LESSONS = [
  'how-does-the-web-work', 'commit-messages',
  'command-line-basics', 'introduction-to-git', 'introduction-to-html-and-css', 'links-and-images'
];
const ASSIGNMENT_NOTE_LESSONS = ['git-basics', 'setting-up-git', 'command-line-basics'];

/* ---------- N2 + N3：逐课文案、位置与渲染纪律 ---------- */
const BANNED_IN_NOTE = ['中文辅助', '全部地址已于', '核验方法见首页', '自动核验受限', '资料不全', '部分参考', '核验'];
for (const lesson of guide.lessons) {
  const page = mountLesson(lesson.id);
  const official = officialOf(page);
  const notes = notesOf(page);
  const expectedKc = expectedNote(lesson, 'k');
  const expectedA = expectedNote(lesson, 'a');
  const expectedCount = (expectedKc ? 1 : 0) + (expectedA ? 1 : 0);
  assert.equal(notes.length, expectedCount,
    `N1: ${lesson.id} 标注数量应为 ${expectedCount}（KC:${expectedKc ? '有' : '无'} / A:${expectedA ? '有' : '无'}），实际 ${notes.length}`);
  assert.equal(KC_NOTE_LESSONS.includes(lesson.id), Boolean(expectedKc),
    `N1: ${lesson.id} 的 KC 标注出现性与名单不一致（名单变化必须是有意的）`);
  assert.equal(ASSIGNMENT_NOTE_LESSONS.includes(lesson.id), Boolean(expectedA),
    `N1: ${lesson.id} 的 Assignment 标注出现性与名单不一致`);

  const children = official.childNodes || [];
  const checkNote = (note, expectedText, headText, bodyId) => {
    assert.equal(textOf(note), expectedText, `N2: ${lesson.id} 标注文案与数据复算不一致`);
    assert.equal(note.tagName, 'P', `N3: ${lesson.id} 标注是 p 元素`);
    const classes = String(note.className).split(/\s+/);
    assert.ok(classes.includes('meta'), `N3: ${lesson.id} 标注带 meta class`);
    assert.ok(classes.includes('task-resource-note'), `N3: ${lesson.id} 标注带 task-resource-note class`);
    assert.equal(note.parentNode, official, `N3: ${lesson.id} 标注是 section-official 直接子级`);
    assert.equal(collectByClass(note, 'task-link').length, 0, `N3: ${lesson.id} 标注内零链接`);
    assert.ok(!(note.childNodes || []).some(n => n.tagName === 'A'), `N3: ${lesson.id} 标注不得含 <a>`);
    const at = children.indexOf(note);
    const prev = children[at - 1];
    const next = children[at + 1];
    assert.ok(prev && prev.tagName === 'H3' && textOf(prev).includes(headText),
      `N3: ${lesson.id} 标注紧跟「${headText}」h3 之后`);
    assert.ok(next && next.id === bodyId,
      `N3: ${lesson.id} 标注在折叠容器 ${bodyId} 之前（列表收起时仍可读）`);
    BANNED_IN_NOTE.forEach(banned => assert.ok(!textOf(note).includes(banned),
      `N3: ${lesson.id} 标注不得含「${banned}」（审计信息 / 不实表述 / D7 计数红线）`));
    assert.ok(!textOf(note).startsWith('其中'), `N3: ${lesson.id} 标注不得以「其中」开头（A1 前言禁语同一口径）`);
  };
  if (expectedA) {
    const note = notes.find(n => textOf(n).includes('条任务'));
    assert.ok(note, `N2: ${lesson.id} 缺 Assignment 标注`);
    checkNote(note, expectedA, 'Assignment（必做）', 'official-assignment-body');
    /* N2 加严：文案里的每个数字都必须能在数据里找到出处（防手写数字残留） */
    const nums = textOf(note).match(/\d+/g).map(Number);
    assert.deepEqual(nums, [lesson.official.assignment.length,
      Object.keys(taskLinks.links[lesson.id].a).filter(k => taskLinks.links[lesson.id].a[k].length).length],
      `N2: ${lesson.id} Assignment 标注数字 = [总条数, 带链条目数]`);
  }
  if (expectedKc) {
    const note = notes.find(n => textOf(n).includes('道题'));
    assert.ok(note, `N2: ${lesson.id} 缺 KC 标注`);
    checkNote(note, expectedKc, 'Knowledge Check（官方自查）', 'official-kc-body');
  }
}
/* N2：三类模板句式逐字钉住代表课（防模板被顺手改写；数字仍由上一条按数据校验） */
{
  const hwtw = notesOf(mountLesson('how-does-the-web-work'))[0];
  assert.equal(textOf(hwtw), '15 道自查题指向下方 7 份资料：多道题共用同一篇，点开就能看。', 'N2: KC-A 类模板代表课');
  const lai = notesOf(mountLesson('links-and-images'))[0];
  assert.equal(textOf(lai), '9 道题中有 1 道需要外部资料，指向下方 1 份；其余各题指向官方原课自身的章节，本站未接外链。', 'N2: KC-B 类模板代表课（最易写错的一课，交接 §5 人工实测点 2）');
  const gb = notesOf(mountLesson('git-basics'))[0];
  assert.equal(textOf(gb), '22 条任务大多是终端与 GitHub 上的动手操作；其中 2 条需要外部文章，已附链接。', 'N2: Assignment 模板代表课（交接 §5 人工实测点 3）');
}

/* ---------- N4：负向验证——篡改映射数据后重挂载，文案必须跟着变 ----------
 * app.js 的标注若被改成写死数字（或模板脱离数据），本组立刻红：
 *   1) how-does-the-web-work 删 k15 → 从 A 类翻成 B 类，数字 14/7 现算；
 *   2) git-basics 删 a17 → 「其中 1 条」；
 *   3) commit-messages 清空 k → 标注整体消失（null 路径）。 */
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
  /* 1) A 类 → B 类翻转 */
  const tampered = cloneLinks();
  delete tampered.links['how-does-the-web-work'].k[15];
  const page = mountWithLinks('how-does-the-web-work', tampered);
  const note = notesOf(page)[0];
  assert.ok(note, 'N4: 删一条映射后 KC 标注仍存在（翻成 B 类）');
  assert.equal(textOf(note), '15 道题中有 14 道需要外部资料，指向下方 7 份；其余各题指向官方原课自身的章节，本站未接外链。',
    'N4: 文案数字必须跟着数据变（14/7 现算）');
  assert.throws(() => assert.ok(textOf(note).includes('15 道自查题指向下方')),
    'N4: 旧 A 类文案必须不再匹配（若文案写死，本断言空转、上一条已红）');
  /* 2) Assignment 数字跟随 */
  const tampered2 = cloneLinks();
  delete tampered2.links['git-basics'].a[17];
  const note2 = notesOf(mountWithLinks('git-basics', tampered2))[0];
  assert.equal(textOf(note2), '22 条任务大多是终端与 GitHub 上的动手操作；其中 1 条需要外部文章，已附链接。',
    'N4: Assignment 标注数字跟着映射变');
  /* 3) 映射清空 → 标注消失（无线索不渲染） */
  const tampered3 = cloneLinks();
  tampered3.links['commit-messages'].k = {};
  assert.equal(notesOf(mountWithLinks('commit-messages', tampered3)).length, 0,
    'N4: 映射清空后标注整体消失（null 路径，不留空 p）');
  /* 4) 边界条件有牙齿：text-editors 未接链条目 4 < 5 → 无标注；
        人为把总条目差距拉大不现实（assignment 是 lessons.js 红线），
        改为验证「再多接一条仍不达标」方向：删 text-editors 一条映射
        （2→1，差距 5）→ 标注出现。证明 >=5 阈值不是摆设。 */
  const tampered4 = cloneLinks();
  delete tampered4.links['text-editors'].a[3];
  assert.equal(notesOf(mountLesson('text-editors')).length, 0, 'N4: text-editors 原始数据（差距 4）不标注');
  assert.equal(textOf(notesOf(mountWithLinks('text-editors', tampered4))[0]),
    '6 条任务大多是终端与 GitHub 上的动手操作；其中 1 条需要外部文章，已附链接。',
    'N4: 差距拉到 5 即触发标注（阈值边界两侧都有钉子）');
}

console.log('通过：任务与资料对应关系标注（v4.11.6）——N1 出现范围名单钉死（KC 6 课 / Assignment 3 课 / 其余 13 课零出现）、N2 三类模板文案与数据独立复算一致且代表课逐字钉住、N3 渲染纪律（p.meta.task-resource-note、非 <a>、h3 与折叠容器之间的直接子级、禁语零出现、不以「其中」开头）、N4 负向验证（篡改映射后数字跟随、A→B 类翻转、清空消失、>=5 阈值边界两侧有钉子）。');
