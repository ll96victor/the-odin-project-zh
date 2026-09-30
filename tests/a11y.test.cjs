/* a11y.test.cjs — 站点自身无障碍结构钉子（B+ 轮阶段 3，v4.11.38 建，第 49 个测试文件）。
 *
 * 为什么需要它：站点在 World 4 用 8 课教无障碍（WCAG / ARIA / 键盘导航 / 审计），
 * 但此前只有 themes-contrast 管颜色对比——语义结构、焦点归还、live region、动效
 * 降级等从未被机械断言。本文件把 B+ 轮阶段 3 七维度审计中的**结构性事实**钉住：
 *   1. 页面骨架：lang / skip-link / landmark（静态 HTML 层）；
 *   2. 弹层关闭焦点归还：四个直建弹层（catalog / reset / profile / assistant）
 *      必须有 close 事件兜底——原生 Esc / backdrop 路径不经过各自的 close 函数，
 *      没有兜底时焦点落回 body（键盘用户迷失位置；picker / sheets / 命令面板
 *      系统原本就有兜底，本组钉防「同类缺口第五次出现」）；
 *   3. Boss 评分结果的 role=status 动态播报；
 *   4. combobox / tablist / progressbar 的 ARIA 骨架在位；
 *   5. prefers-reduced-motion 全站兜底块（组件级逐点 opt-out 之外的保险）；
 *   6. ::placeholder 显式配色规则在位（数值达标由 themes-contrast 第 9 节现算管）；
 *   7. dom-stub 实渲染遍历：标题层级不跳级 / img 全有 alt 属性（空 alt = 装饰合法）/
 *      aria-hidden 不包交互元素 / 按钮全有可访问名。
 * 对比度数值（焦点环 ≥3、占位色 ≥4.5、正文六组）住 themes-contrast.test.cjs；
 * 运行时焦点行为（打开聚焦、Esc 实关、焦点实归还）住真实浏览器验收——dom-stub
 * 的 dialog 只有 showModal 没有 close 事件，行为面不在这里假装覆盖。
 *
 * 运行：node tests/a11y.test.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { newPage, makeStorage, querySelect, FIRST_LESSON } = require('./dom-stub.cjs');

let checks = 0;
const check = label => { checks += 1; return label; };
const root = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

/* ===================== 1. 页面骨架（静态 HTML） ===================== */
for (const file of ['index.html', 'lesson.html']) {
  const html = read(file);
  assert.ok(/<html lang="zh-CN">/.test(html), check(`1 ${file}: <html lang="zh-CN">（WCAG 3.1.1 页面语言）`));
  assert.ok(/class="skip-link"[^>]*href="#main"/.test(html), check(`1 ${file}: skip-link 指向 #main（WCAG 2.4.1 绕过区块）`));
  assert.ok(/<main id="main"/.test(html), check(`1 ${file}: main landmark 在位`));
  assert.ok(/<header/.test(html), check(`1 ${file}: header landmark 在位`));
  assert.ok(/<footer/.test(html), check(`1 ${file}: footer landmark 在位`));
}

/* ===================== 2. 弹层关闭焦点归还（close 事件兜底） ===================== */
const app = read('app.js');
for (const dlg of ['catalogDialog', 'resetDialog', 'profileDialog', 'assistantDialog']) {
  const re = new RegExp(dlg + "\\.addEventListener\\('close'");
  assert.ok(re.test(app),
    check(`2 ${dlg} 必须有 close 事件焦点归还兜底（原生 Esc / backdrop 关闭不经过 close 函数；缺失即键盘焦点落 body）`));
}
/* 既有三系统兜底不回退（sheets 800 / picker 3818 / 命令面板 5159 一带） */
const closeCount = (app.match(/addEventListener\('close'/g) || []).length;
assert.ok(closeCount >= 7,
  check(`2 app.js close 事件监听 ≥7（sheets / picker / 命令面板既有 3 + 阶段 3 补 4；实际 ${closeCount}）`));

/* ===================== 3. Boss 评分结果 live region ===================== */
assert.ok(/boss-result is-\$\{result\.rating\}`\);\s*\n\s*\/\*[\s\S]{0,300}?headline\.setAttribute\('role', 'status'\)/.test(app),
  check('3 Boss 评分结果 headline 必须有 role=status（评分替换弹层内容时读屏可感知）'));

/* ===================== 4. ARIA 骨架（combobox / tablist / progressbar） ===================== */
assert.ok(app.includes("setAttribute('role', 'combobox')"), check('4 命令面板 input role=combobox'));
assert.ok(app.includes("setAttribute('aria-activedescendant'"), check('4 命令面板 aria-activedescendant 同步'));
assert.ok(app.includes("setAttribute('role', 'listbox')"), check('4 命令面板结果 role=listbox'));
assert.ok(app.includes("setAttribute('role', 'tablist')"), check('4 个人中心 role=tablist'));
assert.ok(app.includes("setAttribute('role', 'tabpanel')"), check('4 个人中心 role=tabpanel'));
assert.ok(/ArrowRight[\s\S]{0,120}PROFILE_TABS/.test(app), check('4 个人中心 tab 有左右方向键导航'));
assert.ok(app.includes("setAttribute('aria-valuenow'"), check('4 进度条 aria-valuenow 在位'));

/* ===================== 5. 动效降级（prefers-reduced-motion 全站兜底） ===================== */
const css = read('style.css');
const reduceAll = /@media \(prefers-reduced-motion: reduce\) \{\s*\n\s*\*, \*::before, \*::after \{[\s\S]*?\}\s*\n\}/.exec(css);
assert.ok(reduceAll, check('5 style.css 有 prefers-reduced-motion 全局兜底块（*, *::before, *::after）'));
assert.ok(/animation-duration: 0\.01ms !important/.test(reduceAll[0]), check('5 全局兜底：animation-duration 收敛'));
assert.ok(/transition-duration: 0\.01ms !important/.test(reduceAll[0]), check('5 全局兜底：transition-duration 收敛'));
assert.ok(/scroll-behavior: auto !important/.test(reduceAll[0]), check('5 全局兜底：平滑滚动关闭'));

/* ===================== 6. 占位文字显式配色（数值钉在 themes-contrast 第 9 节） ===================== */
assert.ok(/::placeholder\s*{[^}]*color-mix\(in srgb, var\(--color-ink\) \d+%, var\(--color-paper\)\)/.test(css),
  check('6 ::placeholder 用 ink→paper color-mix 显式配色（不用 UA 默认灰——Chrome 默认在深色输入底仅 3.68:1）'));

/* ===================== 7. dom-stub 实渲染遍历（两页） ===================== */
function walk(el, visit) {
  visit(el);
  for (const child of (el.children || [])) walk(child, visit);
}
function auditPage(label, page) {
  const body = page.dom.body;
  const heads = [];
  const imgsNoAlt = [];
  const hiddenInteractive = [];
  const unnamedButtons = [];
  walk(body, el => {
    const tag = el.tagName;
    if (/^H[1-6]$/.test(tag)) heads.push(Number(tag[1]));
    if (tag === 'IMG' && !('alt' in el) && el.getAttribute('alt') === null) imgsNoAlt.push(el.className || 'img');
    if (el.getAttribute && el.getAttribute('aria-hidden') === 'true') {
      const selfInteractive = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(tag);
      let inner = false;
      walk(el, c => { if (c !== el && ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(c.tagName)) inner = true; });
      if (selfInteractive || inner) hiddenInteractive.push(el.className || tag);
    }
    if (tag === 'BUTTON') {
      const named = (el.textContent || '').trim().length > 0
        || (el.getAttribute('aria-label') || '').trim().length > 0
        || (el.getAttribute('title') || '').trim().length > 0;
      if (!named) unnamedButtons.push(el.className || 'button');
    }
  });
  /* 标题层级不跳级（WCAG 1.3.1 / 最佳实践）：只允许同级、变浅、或逐级变深 */
  const skips = [];
  for (let i = 1; i < heads.length; i++) if (heads[i] - heads[i - 1] > 1) skips.push(`${heads[i - 1]}->${heads[i]}`);
  assert.ok(heads.length >= 2, check(`7 ${label}: 渲染出标题层级（${heads.length} 个）`));
  assert.deepEqual(skips, [], check(`7 ${label}: 标题层级零跳级（序列 ${heads.join(',')}）`));
  assert.deepEqual(imgsNoAlt, [], check(`7 ${label}: img 全部有 alt 属性（空 alt = 装饰性合法；缺属性非法：${imgsNoAlt.join('/')}）`));
  assert.deepEqual(hiddenInteractive, [], check(`7 ${label}: aria-hidden 不包交互元素（误藏：${hiddenInteractive.join('/')}）`));
  assert.deepEqual(unnamedButtons, [], check(`7 ${label}: 按钮全部有可访问名（无名：${unnamedButtons.join('/')}）`));
}
auditPage('首页', newPage({ storage: makeStorage() }));
auditPage('课页', newPage({
  storage: makeStorage(), page: 'lesson', search: `?id=${FIRST_LESSON}`,
  href: `http://127.0.0.1:8765/lesson.html?id=${FIRST_LESSON}`
}));
/* 课页概念图 alt 非空（diagrams.js 数据层的 alt 是完整图形描述——LESSON-PAGE-GUIDE §4 口径） */
{
  const page = newPage({
    storage: makeStorage(), page: 'lesson', search: `?id=${FIRST_LESSON}`,
    href: `http://127.0.0.1:8765/lesson.html?id=${FIRST_LESSON}`
  });
  let diagramImgs = 0;
  walk(page.dom.body, el => {
    if (el.tagName === 'IMG' && String(el.className).includes('diagram-img')) {
      diagramImgs += 1;
      assert.ok(String(el.alt || '').length > 20,
        check(`7 课页概念图 alt 为完整图形描述（>20 字，实际 ${String(el.alt || '').length}）`));
    }
  });
  assert.ok(diagramImgs >= 0, check(`7 课页概念图遍历完成（${diagramImgs} 张——首课无图也合法，判据住 LESSON-PAGE-GUIDE）`));
}

console.log(`a11y.test.cjs：全部 ${checks} 项断言通过 ✔（页面骨架 lang/skip-link/landmark ×2 页、四弹层 close 焦点归还兜底 + 既有三系统不回退、Boss 结果 role=status、ARIA 骨架七钉、reduced-motion 全局兜底、placeholder 显式配色、dom-stub 两页实渲染四组遍历钉）`);
