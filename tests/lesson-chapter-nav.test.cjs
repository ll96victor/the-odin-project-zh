const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { newPage, makeStorage, collectByClass, querySelect } = require('./dom-stub.cjs');

const root = path.resolve(__dirname, '..');

/* 章节标题事实源：链接文字必须逐字等于 lessons.js 里的 part.h，
 * 不允许渲染层加「章节 N：」之类的人工序号（序号由外层 <ol> 原生提供）。 */
const lessonSandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'lessons.js'), 'utf8'), lessonSandbox);
const guide = lessonSandbox.window.ODIN_GUIDE;

const mount = id => newPage({ storage: makeStorage(), page: 'lesson', search: `?id=${id}`, href: `http://127.0.0.1:8765/lesson.html?id=${id}` });
const manualChapterPrefix = /^章节 \d+[:：]/;

function assertChapterNav(lessonId, expectedCount) {
  const lesson = guide.lessons.find(item => item.id === lessonId);
  assert.ok(lesson, `lessons.js 中应存在课程 ${lessonId}`);
  assert.equal(lesson.sections.length, expectedCount, `${lessonId} 在 lessons.js 中应有 ${expectedCount} 个章节（事实源校准）`);
  const page = mount(lessonId);
  const main = querySelect(page.dom.body, '#main');
  const navs = collectByClass(main, 'lesson-chapter-nav');
  assert.equal(navs.length, 1, `${lessonId} 应显示且只显示一个章节导航`);
  const lists = collectByClass(navs[0], 'lesson-chapter-nav-list');
  assert.equal(lists.length, 1, '章节导航应包含一个目录列表');
  assert.equal(lists[0].tagName, 'OL', '章节目录外层必须是 <ol>（原生序号）');
  assert.equal(lists[0].children.length, expectedCount, `${lessonId} 目录应有 ${expectedCount} 个 <li>`);
  lists[0].children.forEach(item => assert.equal(item.tagName, 'LI', '目录条目必须是 <li>'));
  const links = collectByClass(navs[0], 'lesson-chapter-link');
  assert.equal(links.length, expectedCount, `${lessonId} 导航应覆盖全部 ${expectedCount} 章`);
  const headings = [...collectByClass(main, 'section-explain')[0].children || []]
    .filter(child => child.tagName === 'H3' && child.id);
  assert.equal(headings.length, expectedCount, `${lessonId} 应生成 ${expectedCount} 个稳定章节锚点`);
  links.forEach((item, index) => {
    assert.equal(item.tagName, 'A');
    assert.equal(item.href, `#${headings[index].id}`, `第 ${index + 1} 条链接应指向对应 h3 锚点`);
    assert.equal(querySelect(page.dom.body, `#${headings[index].id}`).tagName, 'H3', '锚点目标必须是真实 h3');
    assert.equal(item.textContent, lesson.sections[index].h, `第 ${index + 1} 条链接文字必须逐字等于 lessons.js 中的章节标题`);
    assert.ok(!manualChapterPrefix.test(item.textContent), `第 ${index + 1} 条链接不得再叠加人工「章节 N：」序号`);
  });
}

/* 长课合同：14 章与 16 章两门真实长课。 */
assertChapterNav('command-line-basics', 14);
assertChapterNav('git-basics', 16);

/* 短课合同：低于阈值（LESSON_CHAPTER_NAV_MIN = 12）的课不出现导航。 */
const shortPage = mount('how-this-course-will-work');
assert.equal(collectByClass(querySelect(shortPage.dom.body, '#main'), 'lesson-chapter-nav').length, 0, '短课不应显示章节导航');

/* --- CSS 合同：目录是纵向 <ol>，不是横向 flex+wrap --- */
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
function ruleBody(selector, label) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  assert.ok(match, `style.css 应存在 ${label} 规则`);
  return match[1];
}
const listRule = ruleBody('.lesson-chapter-nav-list', '章节目录列表');
assert.ok(!/\bflex\b/.test(listRule), '章节目录列表不得使用 flex 布局（横向换行会让一章挤进同一行）');
assert.ok(/display:\s*block/.test(listRule), '章节目录列表必须是纵向块级布局（每章独占一行）');
assert.ok(ruleBody('.lesson-chapter-nav-list li', '目录条目纵向间距').length > 0);

/* --- v4.11.9 锚点补偿合同：跳转后标题不得被顶部固定件遮住 ---
 * 真实 Chrome 实测过的缺陷形态：点击目录后目标 h3 落在 top=0，而 sticky .site-header
 * 占 0–111px、fixed .reading-position（z-index 30）占 0–35px，h3 被完全盖住，
 * elementFromPoint 取到的是 .reading-step 按钮而不是标题。
 * 补偿口径必须与 #lesson-resources 同源——两者是同一类页内跳转目标。 */
const chapterHeadRule = ruleBody('.section-explain h3', '章节标题滚动补偿');
const chapterOffset = /scroll-margin-top:\s*([^;]+);/.exec(chapterHeadRule);
assert.ok(chapterOffset, '章节 h3 必须有 scroll-margin-top，否则点击目录后标题被 sticky 站头遮住');
const resourceRule = ruleBody('#lesson-resources', '资源区锚点滚动补偿');
const resourceOffset = /scroll-margin-top:\s*([^;]+);/.exec(resourceRule);
assert.ok(resourceOffset, '资源区 h3 的 scroll-margin-top 应仍在位（对照基准）');
assert.equal(chapterOffset[1].trim(), resourceOffset[1].trim(),
  `章节 h3 与资源区 h3 的桌面档补偿必须同口径（实际 ${chapterOffset[1].trim()} vs ${resourceOffset[1].trim()}）`);
assert.ok(!/^0/.test(chapterOffset[1].trim()), '章节 h3 的滚动补偿不得为 0（等于没有补偿）');
/* 桌面档必须覆盖 1024px 实测的站头底边 111px（6.5rem=104px 不够，v4.11.9 上调为 8rem=128px） */
const desktopRem = parseFloat(chapterOffset[1]);
assert.ok(desktopRem >= 8, `桌面档补偿 ${desktopRem}rem 必须 ≥ 8rem（128px > 1024px 实测站头 111px）`);

/* 窄屏档：站头在 ≤40rem 因 flex-wrap 长高（390px 实测底边 145px），补偿必须更大，
 * 且必须**同时**覆盖两个跳转目标——同类锚点在不同断点各写一套就会漂移。 */
const narrowBlocks = css.match(/@media \(max-width: 40rem\)\s*\{[\s\S]*?\n\}/g) || [];
const narrowAnchorBlock = narrowBlocks.find(block => /scroll-margin-top/.test(block)
  && /\.section-explain h3/.test(block) && /#lesson-resources/.test(block));
assert.ok(narrowAnchorBlock, '必须存在一个 ≤40rem 的窄屏补偿块，同时覆盖章节 h3 与资源区 h3');
const narrowRem = parseFloat(/scroll-margin-top:\s*([\d.]+)rem/.exec(narrowAnchorBlock)[1]);
assert.ok(narrowRem > desktopRem,
  `窄屏档 ${narrowRem}rem 必须大于桌面档 ${desktopRem}rem（窄屏站头更高：390px 实测 145px vs 1024px 的 111px）`);
assert.ok(narrowRem * 16 >= 176, `窄屏档 ${narrowRem}rem(${narrowRem * 16}px) 必须 ≥ 176px，覆盖 390px 实测站头 145px 并留余量`);

/* --- print 合同：导航隐藏、正文 h3 / 章节内容保留 --- */
const printBlocks = css.match(/@media print\s*\{[\s\S]*?\n\}/g) || [];
assert.ok(printBlocks.length > 0, 'style.css 应存在 @media print 块');
const printCss = printBlocks.join('\n');
assert.ok(/\.lesson-chapter-nav\s*\{\s*display:\s*none/.test(printCss), '打印时章节导航必须隐藏');
const h3Hides = printCss.match(/(^|[}\s])(h3|\.section-explain h3)\s*(,[^{]*)?\{[^}]*display:\s*none/g);
assert.equal(h3Hides, null, '打印规则不得隐藏正文 h3');

/* --- 负向自检：证明上面的断言真能抓住旧实现的回归形态 --- */
const sample = guide.lessons.find(item => item.id === 'command-line-basics').sections;
sample.forEach((part, index) => {
  const regressed = `章节 ${index + 1}：${part.h}`;
  assert.ok(manualChapterPrefix.test(regressed), `负向自检失败：回归文字「${regressed}」未被序号断言命中`);
  assert.notEqual(regressed, part.h, '负向自检失败：回归文字不应等于事实源标题');
});
const flexRegression = 'display: flex; flex-wrap: wrap; gap: var(--space-xs) var(--space-md); margin: 0; padding-left: 1.25rem;';
assert.ok(/\bflex\b/.test(flexRegression), '负向自检失败：横向 flex 回归样式未被布局断言命中');

console.log('lesson-chapter-nav: vertical <ol> one chapter per line, single native numbering, anchors verified, print-degradable');
