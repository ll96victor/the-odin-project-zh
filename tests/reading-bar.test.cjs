/* v4.4 阅读位置条 2.0 测试（交接 Core G + §13 测试重点 10）。
 *
 * 钉住四件事：
 *   G1 sticky 条 = 课程短标题 · 当前章节 · 百分比（单一口径，无第二个标签元素）；
 *   G2 章节节点按真实页面结构生成（main 直接子级里带 h2 的 section），
 *      当前高亮、点击 scrollIntoView 跳转、上一节/下一节可用；
 *   G3 语义红线：全部文案只说「本页阅读位置」，不出现「课程完成度」，
 *      不修改任何课程完成状态；
 *   G4 读到底轻提示（is-done + ✓，只改条内文字）。
 * 另钉：showReadingPosition 设置能整体隐藏/恢复 bar；首页不挂 bar。 */
const assert = require('node:assert/strict');

const {
  FIRST_LESSON, querySelect, collectByClass, dispatch, makeStorage, newPage, STORAGE_KEY
} = require('./dom-stub.cjs');

let checks = 0;
const check = label => { checks += 1; return label; };

function lessonPage() {
  return newPage({ storage: makeStorage(), page: 'lesson', search: `?id=${FIRST_LESSON}` });
}

/* 触发一次 scroll 重算（stub 的 updateReadingPosition 挂在 window scroll 上） */
function rescroll(page) { page.fireWindow('scroll', {}); }

/* ===================== 1. G1/G2 结构：真实章节 → 节点 ===================== */
{
  const page = lessonPage();
  const { dom } = page;
  const bar = querySelect(dom.body, '.reading-position');
  assert.ok(bar, check('课程页挂上阅读位置条'));
  assert.equal(bar.getAttribute('role'), 'progressbar', check('role=progressbar'));
  assert.equal(bar.getAttribute('aria-valuemin'), '0', check('aria-valuemin=0'));
  assert.equal(bar.getAttribute('aria-valuemax'), '100', check('aria-valuemax=100'));
  /* G3：aria-label 明确「不代表课程完成度」 */
  assert.ok(bar.getAttribute('aria-label').includes('本页阅读位置'), check('G3：aria-label 说「本页阅读位置」'));
  assert.ok(bar.getAttribute('aria-label').includes('不代表课程完成度'), check('G3：aria-label 声明不代表课程完成度'));

  /* 第三轮：课页顶部轻量返回入口（品牌 Logo 回首页链路在 header，不变） */
  const backLink = querySelect(dom.body, '.lesson-back');
  assert.ok(backLink, check('第三轮：课页顶部有轻量返回入口'));
  assert.ok(backLink.textContent.includes('Foundations'), check('第三轮：返回入口显示所属 World 名'));
  assert.ok(backLink.href.includes('index.html'), check('第三轮：返回入口指向首页'));

  /* G1 课程短标题：01 + 真实课程中文名（与 lessons.js 同源） */
  const guide = page.sandbox.window.ODIN_GUIDE;
  const first = guide.lessons.find(l => l.id === FIRST_LESSON);
  const short = querySelect(bar, '.reading-lesson-short');
  assert.ok(short, check('G1：bar 内有课程短标题'));
  assert.ok(short.textContent.startsWith('01 '), check(`短标题带补零编号（实际「${short.textContent}」）`));
  assert.ok(short.textContent.includes(first.zh), check('G1：短标题 = lessons.js 的中文标题（同源，不另维护清单）'));

  /* G2 章节节点数量 = main 直接子级中带 h2 的 section（独立重算期望值） */
  const main = dom.getElementById('main');
  const expected = main.children.filter(el =>
    el.tagName === 'SECTION' && el.querySelector('h2'));
  const dots = collectByClass(bar, 'reading-dot');
  assert.ok(expected.length >= 5, check(`课程页真实章节 ≥5（实际 ${expected.length}）`));
  assert.equal(dots.length, expected.length, check('G2：节点数 = 真实页面章节数（按 DOM 生成，不假设每课相同）'));
  expected.forEach((sec, i) => {
    const title = sec.querySelector('h2').textContent.trim();
    assert.equal(dots[i].getAttribute('aria-label'), `跳到章节：${title}`,
      check(`G2：节点 ${i + 1} aria-label 用真实 h2 文本「${title}」`));
    assert.equal(dots[i].title, title, check(`节点 ${i + 1} title 提示同名`));
    assert.equal(dots[i].type, 'button', check(`节点 ${i + 1} 是 button`));
  });
  const nav = querySelect(bar, '.reading-sections');
  assert.ok(nav && nav.tagName === 'NAV', check('G2：节点行是 nav（跳转地标）'));
  assert.equal(nav.getAttribute('aria-label'), '本页章节跳转', check('nav aria-label'));

  /* G1 当前章节名 + 百分比 + fill */
  assert.ok(querySelect(bar, '.reading-current-section'), check('G1：bar 内有当前章节名'));
  const pct = querySelect(bar, '.reading-pct');
  assert.ok(pct, check('G1：bar 内有百分比'));
  assert.match(pct.textContent, /^\d+%( ✓)?$/, check(`百分比格式（实际「${pct.textContent}」）`));
  assert.ok(querySelect(bar, '.reading-position-fill'), check('fill 线在 bar 内部（v4.2 独立右上标签已移除）'));
  assert.equal(querySelect(dom.body, '.reading-position-label'), null, check('v4.2 的独立标签元素不再生成'));

  /* G4 上一节/下一节 */
  const steps = collectByClass(bar, 'reading-step');
  assert.equal(steps.length, 2, check('G4：上一节/下一节两个按钮'));
  assert.equal(steps[0].getAttribute('aria-label'), '跳到上一节', check('上一节 aria-label'));
  assert.equal(steps[1].getAttribute('aria-label'), '跳到下一节', check('下一节 aria-label'));
}

/* ===================== 2. 滚动：百分比、当前章节、节点状态 ===================== */
{
  const page = lessonPage();
  const { dom, sandbox } = page;
  const bar = querySelect(dom.body, '.reading-position');
  const fill = querySelect(bar, '.reading-position-fill');
  const pct = querySelect(bar, '.reading-pct');
  const sectionLabel = querySelect(bar, '.reading-current-section');
  const dots = collectByClass(bar, 'reading-dot');
  const main = dom.getElementById('main');
  const sections = main.children.filter(el => el.tagName === 'SECTION' && el.querySelector('h2'));

  /* stub 几何：documentElement.scrollHeight=2400、innerHeight=800 → max=1600。
   * section 的 rect.top 取自 style.top（parseFloat），bar 的 rect.bottom=20，
   * 判定阈值 = 20+8=28。前 3 节设 10px（已滚过），其余 500px（未滚到）。 */
  sandbox.scrollY = 800; /* 50% */
  sections.forEach((sec, i) => { sec.style.top = i < 3 ? '10px' : '500px'; });
  rescroll(page);
  assert.equal(pct.textContent, '50%', check('滚动到一半 → 50%'));
  assert.equal(fill.style.width, '50%', check('fill 宽度同步 50%'));
  assert.equal(bar.getAttribute('aria-valuenow'), '50', check('aria-valuenow=50'));
  assert.ok(bar.getAttribute('aria-valuetext').includes('本页阅读位置 50%'), check('aria-valuetext 口径仍是「本页阅读位置」'));
  const thirdTitle = sections[2].querySelector('h2').textContent.trim();
  assert.equal(sectionLabel.textContent, thirdTitle, check(`当前章节 = 第 3 节「${thirdTitle}」`));
  assert.ok(bar.getAttribute('aria-valuetext').includes(thirdTitle), check('aria-valuetext 带当前章节名'));
  assert.ok(dots[2].classList.contains('is-current'), check('G2：当前节点高亮'));
  assert.equal(dots[2].getAttribute('aria-current'), 'true', check('当前节点 aria-current=true'));
  assert.ok(dots[0].classList.contains('is-passed') && dots[1].classList.contains('is-passed'), check('已滚过的节点 is-passed'));
  assert.ok(!dots[3].classList.contains('is-passed') && !dots[3].classList.contains('is-current'), check('未滚到的节点无状态'));
  assert.equal(dots.filter(d => d.getAttribute('aria-current') === 'true').length, 1, check('同一时刻只有一个当前节点'));

  /* 开篇（还没滚到任何 section）→「开篇」 */
  sections.forEach(sec => { sec.style.top = '500px'; });
  sandbox.scrollY = 0;
  rescroll(page);
  assert.equal(sectionLabel.textContent, '开篇', check('未滚到第一节时显示「开篇」'));
  assert.equal(dots.filter(d => d.classList.contains('is-current')).length, 0, check('开篇时无当前节点'));

  /* G4 读到底：100% ✓ + is-done（轻提示，只改条内文字） */
  sandbox.scrollY = 1600; /* = scrollHeight - innerHeight */
  rescroll(page);
  assert.equal(pct.textContent, '100% ✓', check('G4：读到底显示 100% ✓'));
  assert.ok(bar.classList.contains('is-done'), check('G4：bar 加 is-done 状态'));
  assert.equal(bar.getAttribute('aria-valuenow'), '100', check('aria-valuenow=100'));

  /* G3：bar 全文不出现「课程完成」字样，滚动不写任何完成状态 */
  assert.ok(!bar.textContent.includes('课程完成'), check('G3：bar 文案不含「课程完成」'));
  const raw = page.sandbox.localStorage.getItem(STORAGE_KEY);
  const lessonsState = raw ? JSON.parse(raw).lessons : {};
  const entry = lessonsState[FIRST_LESSON];
  assert.ok(!entry || entry.completed !== true, check('G3：滚动到 100% 不会把课程标记为完成'));
}

/* ===================== 3. 跳转：节点点击、上一节/下一节 ===================== */
{
  const page = lessonPage();
  const { dom, sandbox } = page;
  const bar = querySelect(dom.body, '.reading-position');
  const dots = collectByClass(bar, 'reading-dot');
  const steps = collectByClass(bar, 'reading-step');
  const main = dom.getElementById('main');
  const sections = main.children.filter(el => el.tagName === 'SECTION' && el.querySelector('h2'));

  /* 点第 4 个节点 → 对应 section 的 scrollIntoView（smooth + start） */
  dispatch(dots[3], 'click', {});
  assert.equal(page.scrollIntoViewCalls.length, 1, check('点节点触发一次 scrollIntoView'));
  assert.ok(page.scrollIntoViewCalls[0].cls.includes(String(sections[3].className).split(' ')[1] || 'section'),
    check('跳转目标是点击的章节本体'));
  /* 逐字段比较：opts 对象创建在 vm 沙箱 realm，prototype 与宿主不同，deepStrictEqual 会误报 */
  assert.equal(page.scrollIntoViewCalls[0].opts.behavior, 'smooth', check('smooth 滚动（reduced-motion 时降为 auto）'));
  assert.equal(page.scrollIntoViewCalls[0].opts.block, 'start', check('block:start（CSS scroll-margin-top 负责避开 sticky 条）'));

  /* 建立「当前在第 2 节」的状态，再测上一节/下一节 */
  sections.forEach((sec, i) => { sec.style.top = i < 2 ? '10px' : '500px'; });
  sandbox.scrollY = 400;
  rescroll(page);
  page.scrollIntoViewCalls.length = 0;
  dispatch(steps[1], 'click', {}); /* 下一节 → 第 3 节（index 2） */
  assert.equal(page.scrollIntoViewCalls.length, 1, check('下一节触发跳转'));
  assert.ok(page.scrollIntoViewCalls[0].text.includes(sections[2].querySelector('h2').textContent.trim().slice(0, 6)),
    check('G4：下一节跳到当前章节的下一节'));
  page.scrollIntoViewCalls.length = 0;
  dispatch(steps[0], 'click', {}); /* 上一节 → 第 1 节（index 0 之前是 index 1-1=0… 当前=1 → 跳 0） */
  assert.equal(page.scrollIntoViewCalls.length, 1, check('上一节触发跳转'));
  assert.ok(page.scrollIntoViewCalls[0].text.includes(sections[0].querySelector('h2').textContent.trim().slice(0, 6)),
    check('G4：上一节跳到当前章节的上一节'));

  /* 开篇时上一节 = 回顶部（window.scrollTo，不是章节跳转） */
  sections.forEach(sec => { sec.style.top = '500px'; });
  sandbox.scrollY = 0;
  rescroll(page);
  page.scrollIntoViewCalls.length = 0;
  dispatch(steps[0], 'click', {});
  assert.equal(page.scrollIntoViewCalls.length, 0, check('开篇时上一节不跳章节（走 window.scrollTo 回顶部）'));
}

/* ===================== 4. 设置联动与首页不挂 ===================== */
{
  const page = lessonPage();
  const { dom } = page;
  const bar = querySelect(dom.body, '.reading-position');

  /* 打开个人中心 → 设置 Tab → 关掉「显示本页阅读位置」 */
  dispatch(querySelect(dom.body, '.player-entry'), 'click', {});
  const dialog = collectByClass(dom.body, 'profile-dialog').find(d => d.open) ||
    collectByClass(dom.body, 'dialog').find(d => d.open);
  assert.ok(dialog, check('个人中心已打开'));
  dispatch(querySelect(dialog, '#profile-tab-settings'), 'click', {});
  const toggle = collectByClass(dialog, 'setting-toggle')
    .find(row => row.textContent.includes('显示本页阅读位置'));
  assert.ok(toggle, check('设置里有「显示本页阅读位置」开关'));
  const box = toggle.children.find(c => c.tagName === 'INPUT');
  box.checked = false;
  dispatch(box, 'change', {});
  assert.equal(bar.style.display, 'none', check('关掉设置 → bar 整体隐藏（含 fill/节点，无残留元素）'));
  box.checked = true;
  dispatch(box, 'change', {});
  assert.equal(bar.style.display, '', check('重新开启 → bar 恢复'));
}

{
  const page = newPage({ storage: makeStorage() });
  assert.equal(querySelect(page.dom.body, '.reading-position'), null, check('首页不挂阅读位置条（仅课程页）'));
}

console.log(`通过：阅读位置条 2.0 ${checks} 项断言（G1 短标题·当前章节·百分比、G2 真实章节节点/高亮/跳转、G3 口径红线不混课程完成度、G4 上一节下一节与读完轻提示、设置联动、首页不挂）。`);
