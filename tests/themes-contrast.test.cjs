/* v4.4 主题系统 2.0 测试（交接 C1/C2/C3 + §13.4/13.5/13.15）。
 *
 * C3 的硬要求：每套主题**程序化**检查可读性——用 WCAG 2.x 相对亮度公式
 * 计算六组对比（正文 ink/paper、次要 muted/paper、强调 accent/paper、
 * 代码块 code-ink/code-bg、按钮文字 button-ink/accent、警示 warn/paper），
 * 全部 ≥ 4.5:1（强调色同时用于链接正文与按钮底，按正文尺寸从严）。
 * “宁可少一套，不要白字白底”由本文件钉死：不达标的配色进不了仓库。
 *
 * 数据源双重解析：themes.js（清单）与 tokens.css（真实生效的变量值）——
 * 两边必须一一对应，防止“清单改了 CSS 没跟上”的漂移。 */
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
let checks = 0;
const check = label => { checks += 1; return label; };

/* ---------- WCAG 2.x 相对亮度与对比度 ---------- */
function hexToRgb(hex) {
  const h = String(hex).replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  assert.match(full, /^[0-9a-fA-F]{6}$/, `颜色必须是合法 hex：${hex}`);
  return [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16));
}
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/* ---------- 载入 themes.js 清单 ---------- */
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'themes.js'), 'utf8'), sandbox);
const THEMES = JSON.parse(JSON.stringify(sandbox.window.ODIN_THEMES));

/* ---------- 解析 tokens.css 的真实变量值 ---------- */
const css = fs.readFileSync(path.join(root, 'tokens.css'), 'utf8');
function parseVars(block) {
  const vars = {};
  for (const m of block.matchAll(/(--color-[a-z-]+)\s*:\s*(#[0-9a-fA-F]{3,8})/g)) vars[m[1]] = m[2];
  return vars;
}
const rootMatch = /:root\s*{([^}]*)}/.exec(css);
assert.ok(rootMatch, check('tokens.css 有 :root 块'));
const rootVars = parseVars(rootMatch[1]);
const cssThemes = {};
for (const m of css.matchAll(/html\[data-theme="([a-z-]+)"\]\s*{([^}]*)}/g)) {
  cssThemes[m[1]] = { vars: Object.assign({}, rootVars, parseVars(m[2])), block: m[2] };
}
/* color-scheme 声明表（audit U1） */
const cssScheme = {};
for (const m of css.matchAll(/html\[data-theme="([a-z-]+)"\]\s*{[^}]*color-scheme:\s*(light|dark)/g)) {
  cssScheme[m[1]] = m[2];
}

/* ===================== 1. 清单结构（C1：24–30 套 + 五类） ===================== */
{
  assert.ok(THEMES.themes.length >= 24 && THEMES.themes.length <= 30,
    check(`主题总数在交接 C1 的 24–30 区间（实际 ${THEMES.themes.length}）`));
  assert.equal(THEMES.defaultThemeId, 'garden', check('默认主题仍是园地'));

  const ids = THEMES.themes.map(t => t.id);
  assert.equal(new Set(ids).size, ids.length, check('主题 id 不重复'));
  for (const id of ids) {
    assert.match(id, /^[a-z][a-z0-9-]{0,31}$/, check(`${id}: id 通过 progress.js 的 ASSET_ID_PATTERN 格式`));
  }

  /* 分类元数据完整、每个主题都归入已知分类 */
  const categoryIds = THEMES.categories.map(c => c.id);
  assert.deepEqual(categoryIds, ['fresh', 'warm', 'nature', 'dark', 'special'], check('五类分类齐全且顺序固定'));
  for (const t of THEMES.themes) {
    assert.ok(categoryIds.includes(t.category), check(`${t.id}: category「${t.category}」是已知分类`));
    assert.equal(typeof t.dark, 'boolean', check(`${t.id}: dark 是布尔值`));
    assert.ok(typeof t.zh === 'string' && t.zh.trim(), check(`${t.id}: 有中文名`));
    assert.ok(typeof t.desc === 'string' && t.desc.trim(), check(`${t.id}: 有一句话说明`));
  }
  const zhNames = THEMES.themes.map(t => t.zh);
  assert.equal(new Set(zhNames).size, zhNames.length, check('主题中文名不重复'));

  /* 每类至少 3 套（C1 建议类别都要有实际货源，不能一类是空的） */
  for (const cat of THEMES.categories) {
    const count = THEMES.themes.filter(t => t.category === cat.id).length;
    assert.ok(count >= 3, check(`分类「${cat.zh}」至少 3 套（实际 ${count}）`));
  }

  /* 深色主题至少 6 套且 dark 标签与分类一致性（dark 分类的全部 dark:true；
   * special 分类允许明暗混布，但 dark:true 的必须声明 dark） */
  const darkThemes = THEMES.themes.filter(t => t.dark);
  assert.ok(darkThemes.length >= 6, check(`深色主题至少 6 套（实际 ${darkThemes.length}）`));
  for (const t of THEMES.themes.filter(item => item.category === 'dark')) {
    assert.equal(t.dark, true, check(`${t.id}: dark 分类的主题 dark:true`));
  }

  /* swatch 三色齐全且是合法 hex（Picker 色块预览的数据源） */
  for (const t of THEMES.themes) {
    for (const key of ['bg', 'accent', 'ink']) {
      assert.ok(t.swatch && typeof t.swatch[key] === 'string', check(`${t.id}: swatch.${key} 存在`));
      hexToRgb(t.swatch[key]);
      checks += 1;
    }
  }

  /* 解锁方式合法；默认开放的主题至少 15 套（C 章“用户非常喜欢主题”——
   * 大多数不锁在叶片后）；既有 v4.3 的解锁口径不回退 */
  const legacyUnlocks = {
    garden: 'default', paper: 'default', night: 'default', linen: 'default', moss: 'default',
    warm: 'level', ocean: 'achievement', terminal: 'coins', plum: 'level', clay: 'coins'
  };
  for (const t of THEMES.themes) {
    assert.ok(['default', 'level', 'achievement', 'coins'].includes(t.unlock.kind), check(`${t.id}: unlock.kind 合法`));
    if (legacyUnlocks[t.id]) {
      assert.equal(t.unlock.kind, legacyUnlocks[t.id], check(`${t.id}: 既有解锁方式不变（红线 8）`));
    }
  }
  const defaults = THEMES.themes.filter(t => t.unlock.kind === 'default');
  assert.ok(defaults.length >= 15, check(`默认开放主题至少 15 套（实际 ${defaults.length}）`));
  assert.ok(defaults.some(t => t.dark), check('默认开放里有深色主题（夜间阅读零门槛）'));
}

/* ===================== 2. themes.js 与 tokens.css 一一对应 ===================== */
{
  const cssIds = Object.keys(cssThemes);
  /* garden 是 :root 默认值，不重复写块（既有约定） */
  const expectedCssIds = THEMES.themes.filter(t => t.id !== 'garden').map(t => t.id);
  assert.deepEqual(cssIds.slice().sort(), expectedCssIds.slice().sort(),
    check('tokens.css 的主题块与清单一一对应（garden 除外，它是 :root）'));

  /* swatch 三色必须与 CSS 真实变量一致（Picker 预览不能骗人） */
  for (const t of THEMES.themes) {
    const vars = t.id === 'garden' ? rootVars : cssThemes[t.id].vars;
    assert.equal(t.swatch.bg.toLowerCase(), vars['--color-paper'].toLowerCase(), check(`${t.id}: swatch.bg = --color-paper`));
    assert.equal(t.swatch.accent.toLowerCase(), vars['--color-accent'].toLowerCase(), check(`${t.id}: swatch.accent = --color-accent`));
    assert.equal(t.swatch.ink.toLowerCase(), vars['--color-ink'].toLowerCase(), check(`${t.id}: swatch.ink = --color-ink`));
  }

  /* color-scheme 声明与 dark 标签一致（audit U1） */
  assert.equal(/:root\s*{[^}]*color-scheme:\s*light/.test(css), true, check(':root 声明 color-scheme: light'));
  for (const t of THEMES.themes) {
    if (t.id === 'garden') continue;
    assert.equal(cssScheme[t.id], t.dark ? 'dark' : 'light', check(`${t.id}: color-scheme 与 dark 标签一致`));
  }
}

/* ===================== 3. 对比度程序化检查（C3 核心） ===================== */
{
  const CHECKS = [
    ['--color-ink', '--color-paper', '正文前景/背景'],
    ['--color-muted', '--color-paper', 'muted 文本'],
    ['--color-accent', '--color-paper', 'accent 链接/强调'],
    ['--color-code-ink', '--color-code-bg', 'code block'],
    ['--color-button-ink', '--color-accent', '按钮文字/accent 底'],
    ['--color-warn', '--color-paper', '警示文本']
  ];
  for (const t of THEMES.themes) {
    const vars = t.id === 'garden' ? rootVars : cssThemes[t.id].vars;
    for (const [fg, bg, label] of CHECKS) {
      const ratio = contrast(vars[fg], vars[bg]);
      assert.ok(ratio >= 4.5,
        check(`${t.id}（${t.zh}）${label} 对比度 ${ratio.toFixed(2)} ≥ 4.5`));
    }
    /* focus outline 用 accent 画在 paper 上：非文本对比 ≥3 已被 4.5 覆盖；
     * 再查 accent 与 wash（hover 底色）的可辨识度 ≥1.5，避免焦点圈消失在底色里 */
    const focusRatio = contrast(vars['--color-accent'], vars['--color-wash']);
    assert.ok(focusRatio >= 1.5, check(`${t.id}: accent 对 wash 可辨识（${focusRatio.toFixed(2)} ≥ 1.5）`));
  }
}

console.log(`通过：v4.4 主题系统 ${checks} 项断言（${THEMES.themes.length} 套主题 × 7 组对比度程序化检查、清单/CSS 一一对应、swatch 不骗人、color-scheme 与 dark 标签一致、既有解锁口径不回退）。`);
