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
  /* v4.11 批次 F（B1）：默认主题由园地改为夜空——新用户 / 缺合法主题的档案
   * 默认进夜间阅读。这里钉的是数据文件的事实；「新档案真的落到 night 且老用户
   * 已存的 garden 不被覆盖」由 collections.test.cjs 与真实浏览器验证承担。 */
  assert.equal(THEMES.defaultThemeId, 'night', check('默认主题是夜空'));
  {
    const night = THEMES.themes.find(t => t.id === THEMES.defaultThemeId);
    assert.ok(night, check('默认主题 id 在主题清单里存在'));
    assert.equal(night.dark, true, check('默认主题是深色主题（暗光环境的低刺激默认）'));
    assert.equal(night.unlock.kind, 'default',
      check('默认主题默认开放——新用户第一眼看到的一定是自己已经拥有的主题'));
  }

  /* v4.11 批次 F（B2）：主题选择器的展示优先顺序。白名单只影响**展示顺序**，
   * 因此这里同时钉住「白名单本身合法」与「其存在不改变主题集合」。 */
  assert.deepEqual(THEMES.recommendedThemeIds, ['night', 'graphite', 'glacier'],
    check('推荐展示顺序是 夜空 → 石墨 → 冰川'));
  {
    const ids = new Set(THEMES.themes.map(t => t.id));
    for (const id of THEMES.recommendedThemeIds) {
      assert.ok(ids.has(id), check(`推荐顺序里的 ${id} 是清单内真实存在的主题（改名时这里先红）`));
    }
  }

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

/* ============ 6. v4.11.5（交接 3.F）：深色主题 ↔ 概念图反相适配清单同步 ============
 * 概念图经 <img> 引入、不继承 CSS 变量，浅色硬编码在深色主题下是亮斑；
 * style.css 用 invert + hue-rotate 做近似反相。选择器清单必须与 themes.js 的
 * dark:true 清单**一一对应**：新增深色主题而漏加反相规则 → 这里红；
 * 反相规则写成深色清单之外的选择器（误伤浅色主题）→ 同样红。 */
{
  const styleCss = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  const darkIds = THEMES.themes.filter(t => t.dark === true).map(t => t.id);
  assert.deepEqual(darkIds.slice().sort(),
    ['crt', 'cyber', 'deepsea', 'graphite', 'ink', 'night', 'terminal', 'violet'],
    check('深色主题集合 = v4.11.5 基线 8 套（新增深色主题需同步 3.F 适配与本文断言）'));
  /* 从 style.css 反解反相规则的选择器集合 */
  const filterRule = styleCss.match(/([^{}]+)\{\s*filter:\s*invert\(1\)\s*hue-rotate\(180deg\)\s*saturate\(\.92\);/);
  assert.ok(filterRule, check('style.css 存在概念图反相规则（invert + hue-rotate + saturate）'));
  const selectorIds = (filterRule[1].match(/html\[data-theme="([a-z-]+)"\]\s*\.concept-diagram\s*img/g) || [])
    .map(selector => selector.match(/data-theme="([a-z-]+)"/)[1]);
  assert.deepEqual(selectorIds.slice().sort(), darkIds.slice().sort(),
    check('反相规则选择器与 themes.js 深色清单一一对应（不漏不误伤）'));
  /* 打印兜底：纸上出图必须还原原色与原底 */
  assert.ok(styleCss.includes('html[data-theme] .concept-diagram img { filter: none; background: var(--color-paper); }'),
    check('打印媒体下概念图反相与透明底还原（filter: none + 原底色）'));
}

/* ============ 7. v4.11.7：预览条「已开放」状态文字配色钉子 ============
 * **本项刻意不假算对比度**。该文字的底色是 .world-preview-item::before 的
 * 径向 + 线性渐变叠在容器底上，不是 --color-paper / --color-wash 中的任何一个：
 * 实测 terminal 主题真实合成底是 #212c27（对 paper 按公式算只得 2.92），
 * 而真实浏览器量到 4.66——差 1.6 倍。按 token 算会**误判为不达标**，
 * 那样的断言是假的，不如不写。
 *
 * 因此这里只钉「取色规则本身」：两条规则必须在位、颜色精确、不得改回低对比的原色。
 * 换色必须重新用真实浏览器逐主题量（方法与本轮实测值见 answers 实施记录）。
 * 实测基线（2026-09-19，chromium 像素采样，**全部 30 套主题**）：
 *   深色 8 套 var(--color-grow-soft) → 4.62（terminal，最低）～5.44（cyber）
 *   浅色 22 套 #336847               → 4.95（pixel，最低）～5.46（porcelain）
 *   修复前同口径：#3f7b58 深色 2.88–3.33 / 浅色 4.19–4.21（两档都 < 4.5）。
 * **抽样会漏**：中间稿取 #38704f 时只量了 3 套浅色主题（最差 4.85）就落值，
 * 全量复核发现 pixel（底色 #dee1da，最深的浅色纸）只有 4.42——**换色必须跑满 30 套**。 */
{
  const styleCss = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  assert.ok(styleCss.includes('.world-preview-item.is-open .world-preview-state { color: #336847;'),
    check('浅色：预览条已开放状态文字取 #336847（全部 22 套浅色主题实测 4.95–5.46 ≥ 4.5）'));
  assert.ok(styleCss.includes('html[data-dark] .world-preview-item.is-open .world-preview-state { color: var(--color-grow-soft); }'),
    check('深色：预览条已开放状态文字取 --color-grow-soft（全部 8 套深色主题实测 4.62–5.44 ≥ 4.5）'));
  /* 反向钉子：不得改回原色 --color-grow（深色 2.88–3.33 / 浅色 4.19–4.21，两档都不达标） */
  const previewStateRules = styleCss.match(/[^{}\n]*\.world-preview-item\.is-open \.world-preview-state\s*\{[^}]*\}/g) || [];
  assert.ok(previewStateRules.length >= 2, check('预览条状态文字的两条配色规则都在位'));
  previewStateRules.forEach(rule => assert.ok(!/color:\s*var\(--color-grow\)\s*;/.test(rule),
    check('预览条状态文字不得直接取 --color-grow（对比度两档都不达标）')));
}

console.log(`通过：v4.4 主题系统 ${checks} 项断言（${THEMES.themes.length} 套主题 × 7 组对比度程序化检查、清单/CSS 一一对应、swatch 不骗人、color-scheme 与 dark 标签一致、既有解锁口径不回退、v4.11.5 深色清单与概念图反相适配一一对应 + 打印还原、v4.11.7 预览条状态文字配色规则在位且未回退）。`);
