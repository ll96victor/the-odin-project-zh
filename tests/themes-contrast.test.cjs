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

/* ============ 7. 预览条「已开放」状态文字的配色钉子（v4.11.7 立项）/ 语义色派生 ============
 * **本项刻意不假算对比度**。该文字的底色是 .world-preview-item::before 的
 * 径向 + 线性渐变叠在容器底上，不是 --color-paper / --color-wash 中的任何一个：
 * 实测 terminal 主题真实合成底是 #212c27（对 paper 按公式算只得 2.92），
 * 而真实浏览器量到 4.66——差 1.6 倍。按 token 算会**误判为不达标**，
 * 那样的断言是假的，不如不写。
 *
 * 因此这里只钉「取色规则本身」：规则必须在位、取色必须精确、不得改回低对比的
 * 固定色。换色必须重新用真实浏览器逐主题量（方法与本轮实测值见 answers 实施记录）。
 * 沿革：
 *   · v4.11.7–v4.11.14：两条分支（浅色 #336847 / 深色 var(--color-grow-soft)）；
 *     实测 深色 4.62（terminal，最低）～5.44（cyber）、浅色 4.95（pixel，最低）～5.46（porcelain）。
 *   · v4.11.15：语义层改主题派生后合并为**一条** --color-semantic 规则——该派生色
 *     在浅色主题自然偏深、深色主题自然偏亮，data-dark 分支不再需要。
 * **抽样会漏**：v4.11.7 中间稿只量了 3 套浅色主题（最差 4.85）就落值，全量复核
 * 发现 pixel（底色 #dee1da，最深的浅色纸）只有 4.42——**换色必须跑满 30 套**。 */
{
  const styleCss = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  const tokensCss = fs.readFileSync(path.join(root, 'tokens.css'), 'utf8');
  assert.ok(styleCss.includes('.world-preview-item.is-open .world-preview-state { color: var(--color-semantic);'),
    check('预览条已开放状态文字取 --color-semantic（浅深一套规则通吃；对比度仍须全 30 套 ≥ 4.5）'));
  const previewStateRules = styleCss.match(/[^{}\n]*\.world-preview-item\.is-open \.world-preview-state\s*\{[^}]*\}/g) || [];
  assert.equal(previewStateRules.length, 1,
    check('预览条状态文字只有一条配色规则（v4.11.15 起合并，不再需要 data-dark 分支）'));
  assert.ok(!/\.world-preview-item\.is-open \.world-preview-state[^{]*\{[^}]*color:\s*(#|rgba?\()/.test(styleCss),
    check('预览条状态文字不得写死 hex / rgba（必须走主题派生）'));

  /* ---------- v4.11.15：语义色（完成 / 成长）派生机制钉子 ---------- */
  assert.ok(tokensCss.includes('--color-semantic: color-mix(in srgb, var(--color-accent) 58%, var(--color-ink));'),
    check('语义色派生在位（accent 58% + ink 42%；:root 单行、逐主题解析。58% 由全 30 套真实浏览器实测选值，见下方注释）'));
  assert.ok(tokensCss.includes('--color-semantic-soft: color-mix(in srgb, var(--color-semantic) 52%, var(--color-wash));'),
    check('语义色 soft 派生在位（由 semantic 与 wash 混合，供进度条浅端；不直取 accent 以免色相漂移）'));
  assert.ok(!/--color-grow(-soft)?\s*:/.test(tokensCss),
    check('旧固定 grow / grow-soft 双值已退役（v4.11.15 起零消费者，不得复活）'));
  for (const t of THEMES.themes) {
    if (t.id === 'garden') continue;
    assert.ok(!/--color-semantic(-soft)?\s*:/.test(cssThemes[t.id].block),
      check(`${t.id}: 主题块不得覆盖语义色派生变量（覆盖即退回「每套主题人工核语义色」的老债）`));
  }
  /* 派生的明暗自动适配：浅色主题 semantic 比 wash 深、深色主题比 wash 亮——
   * 这是「热力图四档自动翻转、预览条状态文字免 data-dark 分支」成立的根据。 */
  const mixSrgb = (a, p, b, q) => {
    const A = hexToRgb(a), B = hexToRgb(b);
    const to = v => Math.round(v).toString(16).padStart(2, '0');
    return '#' + [0, 1, 2].map(i => to((A[i] * p + B[i] * q) / (p + q))).join('');
  };
  for (const t of THEMES.themes) {
    const vars = t.id === 'garden' ? rootVars : cssThemes[t.id].vars;
    const sem = mixSrgb(vars['--color-accent'], 58, vars['--color-ink'], 42);
    if (t.dark === true) {
      assert.ok(luminance(sem) > luminance(vars['--color-wash']),
        check(`${t.id}（深色）: 语义色比 wash 亮——热力图 L4 因此自动成为最亮档，data-dark 翻转分支已无必要`));
    } else {
      assert.ok(luminance(sem) < luminance(vars['--color-wash']),
        check(`${t.id}（浅色）: 语义色比 wash 深——热力图 L4 因此自动成为最深档`));
    }
  }
}

/* ============ 8. v4.11.9：wash 底上的文本对比度（课页长课模块与章节导航） ============
 * 课页有一批 wash 底容器（章节导航、流程复习、命令速查、引导块、常见错误卡、自测答案），
 * 里面的文字坐在 --color-wash 上。而第 3 节那六组对比查的前景都是对 --color-paper，
 * 因此「wash 底上的文本」此前**没有任何全量核验**——v4.11.8 的章节导航标题就因此
 * 带着 accent/wash 不达标进了仓库。本轮实测全部 30 套主题：
 *   ink/wash    最差 9.89:1（linen）→ **全部达标**
 *   muted/wash  最差 4.20:1（linen）→ 4 套 <4.5：linen 4.20 / moss 4.27 / milktea 4.44 / ocean 4.47
 *   accent/wash 最差 4.03:1（dune）  → 7 套 <4.5：dune 4.03 / bamboo 4.08 / clay 4.16 / mint 4.30 /
 *                                       autumn 4.38 / softpink 4.44 / linen 4.45
 * 结论：**wash 底上的正文与标题只能取 --color-ink**；层次靠字重（700 / 600）与字号
 * （--text-small）建立，不靠降低对比度。据此修正了章节导航标题（style.css 有注释记录）。
 *
 * **本节刻意不给 muted/wash 与 accent/wash 加全局达标断言**：扫描 style.css 发现这两组
 * 组合在既有规则里有 20+ 处（hover 态、锁定 / 已结算态、常态次级文本），全局断言一加即红，
 * 修复范围远超本轮。该未核验面已如实记入 MAINTENANCE.md 并交回规划，**不得当作已核验**。
 * 本节只钉新模块依赖的那条事实：ink/wash 在全部 30 套主题达标。
 * 具体规则的取色钉子（哪些选择器必须用 ink、不得改回 accent / muted）在
 * tests/lesson-visual-modules.test.cjs 第 7、8 组——两份不重复：这边管全量数值，那边管规则本身。 */
{
  let worst = { ratio: Infinity, id: '' };
  for (const t of THEMES.themes) {
    const vars = t.id === 'garden' ? rootVars : cssThemes[t.id].vars;
    const ratio = contrast(vars['--color-ink'], vars['--color-wash']);
    if (ratio < worst.ratio) worst = { ratio, id: t.id };
    assert.ok(ratio >= 4.5,
      check(`${t.id}（${t.zh}）wash 底上的正文 ink/wash 对比度 ${ratio.toFixed(2)} ≥ 4.5`));
  }
  /* 钉住余量：最差档必须仍有明显富余，避免日后微调 wash 深浅时静默跌破 4.5 */
  assert.ok(worst.ratio >= 9,
    check(`ink/wash 全部 ${THEMES.themes.length} 套的最差档 ${worst.ratio.toFixed(2)}（${worst.id}）≥ 9，余量充足`));
  /* 反向钉子：wash 底上的文本不得改取 muted / accent（实测分别有 4 套 / 7 套主题不达标）。
   * 这里钉的是「事实源里这两组确实不达标」，防止后人以为它们等价可用。 */
  for (const [fg, label, knownWorst] of [['--color-muted', 'muted', 4.2], ['--color-accent', 'accent', 4.03]]) {
    let min = Infinity;
    for (const t of THEMES.themes) {
      const vars = t.id === 'garden' ? rootVars : cssThemes[t.id].vars;
      min = Math.min(min, contrast(vars[fg], vars['--color-wash']));
    }
    assert.ok(min < 4.5,
      check(`${label}/wash 确实存在不达标主题（最差 ${min.toFixed(2)}），故 wash 底文本不得取 ${label}`));
    assert.ok(min >= knownWorst - 0.01,
      check(`${label}/wash 最差档 ${min.toFixed(2)} 未比本轮实测基线 ${knownWorst} 更差`));
  }
}

/* ===================== 8. v4.11.13 装饰图标接入主题：mask 结构 × 全 30 套 ===================== */
/* v4.11.12 用真实浏览器全 30 套实测证明「固定色 <img> 图标在深色主题下看不见」
 * （深墨 #3b3547 只有 1.02–1.24:1、旧绿 #276148 只有 1.56–2.00:1）。v4.11.13 结构改造：
 * mask 源族图标（achievementCategories / achievementMilestones / tierFamilies /
 * entryIcons / hidden）markup 颜色中性为 #000、只贡献 **alpha 通道**；可见颜色交给
 * `background-color: var(--color-icon)`（tokens.css :root，color-mix(muted 70%, accent 30%)
 * 逐主题派生），经 CSS mask-image 渲染——颜色不再写死在 markup 里，
 * 「每套主题人工核图标色」的老债到此终结。opacity 属性（progress .85 / stats .8 与 .55）
 * 经 alpha 自动保留层次，单色不丢层级。
 *
 * 为什么这一节可以在 Node 端算准（与第 7 节「不做 token 计算」并不冲突）：
 * 涉及的三个背景面都是**纯色**逐通道线性混合（entry 芯片底 = color-mix(accent 10%, wash)；
 * wash / paper 是主题原值），没有渐变、位图或透明度叠加，所以拿 tokens.css 的真实变量值
 * 复算与真实浏览器 getComputedStyle 逐通道一致（2026-09-21 实测对照，验证端口
 * 127.0.0.1:8899：garden 224.10/221.50/234.80、terminal 43.00/62.40/51.70、
 * night 46.00/53.70/78.10、pixel 214.40/212.60/221.40——8.1 把四组钉成断言）。
 * 第 7 节拒绝 token 计算是因为那里的前景坐在**渐变合成背景**上；本节不存在该前提。
 *
 * 下限沿用 Hero 道具装饰性形状的 **2.2:1**；余量钉 3.5（本轮实测最差 3.79）。
 * **默认主题是深色的 night**（themes.js `defaultThemeId`），所以深色档不是边缘情况。 */
{
  const iconsSrc = fs.readFileSync(path.join(root, 'icons.js'), 'utf8');
  const appSrc = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const styleSrc = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  const mixRgb = (fg, bg, alpha) => fg.map((v, i) => v * alpha + bg[i] * (1 - alpha));
  const lumRgb = rgb => {
    const [r, g, b] = rgb.map(v => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrastRgb = (a, b) => {
    const la = lumRgb(a);
    const lb = lumRgb(b);
    const [hi, lo] = la > lb ? [la, lb] : [lb, la];
    return (hi + 0.05) / (lo + 0.05);
  };
  const chipOf = id => {
    const vars = id === 'garden' ? rootVars : cssThemes[id].vars;
    return mixRgb(hexToRgb(vars['--color-accent']), hexToRgb(vars['--color-wash']), 0.10);
  };

  /* 8.1 芯片底复算与真实浏览器逐通道一致（四套对照，容差 0.06/255 只是浮点余量） */
  const MEASURED_CHIPS = {
    garden: [224.1, 221.5, 234.8],
    terminal: [43, 62.4, 51.7],
    night: [46, 53.7, 78.1],
    pixel: [214.4, 212.6, 221.4]
  };
  for (const [id, want] of Object.entries(MEASURED_CHIPS)) {
    const got = chipOf(id);
    assert.ok(got.every((v, i) => Math.abs(v - want[i]) < 0.06),
      check(`.entry-icon 底色复算 ${id} = ${got.map(v => v.toFixed(2)).join('/')} 与真实浏览器实测一致`));
  }

  /* 8.2 mask 结构钉：token 派生比例 / CSS 双前缀 mask 规则 / app.js 调用点 / 中性源 */
  const tokenDecl = /--color-icon:\s*color-mix\(in srgb,\s*var\(--color-muted\)\s*(\d+)%,\s*var\(--color-accent\)\s*(\d+)%\)/.exec(css);
  assert.ok(tokenDecl,
    check('--color-icon 在 tokens.css 以 color-mix(muted, accent) 派生声明（固定 hex 即退回人工核色老债，必红）'));
  assert.equal(Number(tokenDecl[1]) + Number(tokenDecl[2]), 100,
    check(`--color-icon 派生比例两段合计 100%（实际 ${tokenDecl[1]}+${tokenDecl[2]}）`));
  assert.equal(Number(tokenDecl[1]), 70,
    check(`--color-icon 派生比例钉 muted ${tokenDecl[1]} / accent ${tokenDecl[2]}（改比例必须重跑本节全 30 套）`));
  assert.ok(/\.mask-icon \{[^}]*-webkit-mask-image: var\(--icon-mask\);[^}]*mask-image: var\(--icon-mask\);[^}]*mask-size: 100% 100%;/.test(styleSrc),
    check('style.css .mask-icon 标准 + -webkit- 双前缀 mask 属性在位（旧内核兜底）'));
  assert.ok(/\.entry-icon\.mask-icon \{[^}]*mask-image: none;/.test(styleSrc),
    check('entry 图标取消元素级 mask（否则芯片底会被裁成图标形）'));
  assert.ok(/\.entry-icon\.mask-icon::before \{[^}]*background-color: var\(--color-icon\);/.test(styleSrc),
    check('entry 图标字形画在 ::before 并取 --color-icon（芯片底留在元素上，既有规则一字不动）'));
  assert.ok(/const maskIcon = \(markup, className\)/.test(appSrc)
    && appSrc.includes("el.setAttribute('aria-hidden', 'true')")
    && appSrc.includes("el.style.setProperty('--icon-mask'"),
    check('app.js maskIcon()：aria-hidden 装饰语义 + --icon-mask 内联自定义属性'));
  for (const call of [
    "maskIcon(iconMarkup, 'achievement-icon')",
    "maskIcon(icon, 'achievement-icon-sm')",
    "maskIcon(familyMarkup, 'tier-badge-img is-none')",
    "maskIcon(iconMarkup, 'entry-icon')"
  ]) {
    assert.ok(appSrc.includes(call), check(`消费点走 mask 路径：${call}`));
  }
  assert.ok(!appSrc.includes("svgImage(iconMarkup, '', 'entry-icon')")
    && !appSrc.includes("svgImage(iconMarkup, '', 'achievement-icon')"),
    check('mask 源族不再走 svgImage(<img>)——中性 #000 在 <img> 里会渲染成纯黑'));
  const familyBlock = name => {
    const i = iconsSrc.indexOf(name + ': {');
    let depth = 0;
    for (let j = i; j < iconsSrc.length; j++) {
      if (iconsSrc[j] === '{') depth += 1;
      else if (iconsSrc[j] === '}') {
        depth -= 1;
        if (depth === 0) return iconsSrc.slice(i, j + 1);
      }
    }
    throw new Error('block unclosed: ' + name);
  };
  for (const name of ['achievementCategories', 'achievementMilestones', 'tierFamilies', 'entryIcons']) {
    const hexes = [...new Set(familyBlock(name).match(/#[0-9a-fA-F]{3,8}/g) || [])];
    assert.deepEqual(hexes, ['#000'],
      check(`mask 源族 ${name} 的 markup 颜色仅中性 #000（可见色全交给 --color-icon）`));
  }
  /* 旧色清零只扫 markup：注释里允许引用历史色值做记录（G2a 教训：整段扫字面量会扫到注释假红） */
  const iconsMarkup = iconsSrc.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.ok(!iconsMarkup.includes('#276148') && !iconsMarkup.includes('#a4553f'),
    check('icons.js markup 全站旧绿 #276148 / 赭红 #a4553f 清零（含不渲染的 skill / collection / stats）'));
  const entryBlock = familyBlock('entryIcons');
  assert.ok(/progress: '<svg[^']*opacity="\.85"/.test(entryBlock),
    check('progress 的 opacity .85 填充条保留（alpha 是单色图标唯一的层次来源）'));
  assert.ok(/stats: '<svg[^']*opacity="\.8"[^']*opacity="\.55"/.test(entryBlock),
    check('stats 的 opacity .8 / .55 两档保留'));

  /* 8.3 派生色 × 三类背景面 × 全 30 套 ≥ 2.2，余量 ≥ 3.5 */
  const mutedShare = Number(tokenDecl[1]) / 100;
  let worst = { ratio: Infinity, where: '' };
  for (const t of THEMES.themes) {
    const vars = t.id === 'garden' ? rootVars : cssThemes[t.id].vars;
    const icon = mixRgb(hexToRgb(vars['--color-muted']), hexToRgb(vars['--color-accent']), mutedShare);
    const surfaces = {
      芯片底: chipOf(t.id),
      wash: hexToRgb(vars['--color-wash']),
      paper: hexToRgb(vars['--color-paper'])
    };
    for (const [sk, sv] of Object.entries(surfaces)) {
      const r = contrastRgb(icon, sv);
      if (r < worst.ratio) worst = { ratio: r, where: `${t.id}（${t.zh}）/${sk}` };
      assert.ok(r >= 2.2,
        check(`${t.id}（${t.zh}）图标色在${sk} ${r.toFixed(2)}:1 ≥ 2.2 装饰形状下限`));
    }
  }
  assert.ok(worst.ratio >= 3.5,
    check(`30 套 × 三背景面最差档 ${worst.ratio.toFixed(2)}:1（${worst.where}）≥ 3.5 余量钉（本轮实测 3.79）`));

  /* 8.4 反向钉子（v4.11.12 纪律保留）：改回固定深墨 / 旧绿必红 */
  for (const [bad, label, darkBase, lightBase] of [
    ['#3b3547', 'v4.11.12 中间稿的深墨紫灰主线', 1.02, 8.06],
    ['#4a4354', 'Hero 道具试过的深墨紫灰', 1.2, 6.48],
    ['#276148', 'v4.11.11 之前的旧成长绿', 1.56, 4.98]
  ]) {
    const dark = THEMES.themes.filter(t => t.dark).map(t => contrastRgb(hexToRgb(bad), chipOf(t.id)));
    const light = THEMES.themes.filter(t => !t.dark).map(t => contrastRgb(hexToRgb(bad), chipOf(t.id)));
    const minDark = Math.min(...dark);
    const minLight = Math.min(...light);
    assert.ok(minDark < 2.2,
      check(`${label} ${bad} 在 ${dark.length} 套深色主题芯片底上最差仅 ${minDark.toFixed(2)}:1 < 2.2——把图标改回该固定色必红`));
    assert.ok(Math.abs(minDark - darkBase) < 0.02 && Math.abs(minLight - lightBase) < 0.02,
      check(`${bad} 的最差档（深 ${minDark.toFixed(2)} / 浅 ${minLight.toFixed(2)}）与 2026-09-21 实测基线（深 ${darkBase} / 浅 ${lightBase}）一致，数值没被悄悄美化`));
  }
}
/* ============ 9. B+ 轮阶段 3（a11y，v4.11.38）：焦点环非文本对比 + 占位文字配色 ============
 * 9.1 焦点环（WCAG 1.4.11 非文本对比 ≥3:1）：全站 focus-visible 是 3px accent
 *   outline，画在 paper（页面底）或 wash（容器底）上——第 3 节六组钉的是 accent/paper
 *   的**文本**下限 4.5，本节把**非文本**下限 3 对 paper 与 wash 两个背景面显式钉死
 *   （阶段 3 实测最小：accent/paper 4.52 bamboo / accent/wash 4.03 dune）。
 * 9.2 占位文字（WCAG 1.4.3 文本对比 ≥4.5:1）：此前无 ::placeholder 规则、吃 UA
 *   默认色——Chrome 实测 #757575 落 night 输入底（paper）仅 3.68:1 不达标（浅色纸底
 *   同样约 4.3 不达标）。已改 color-mix(ink 72%, paper)：本节从 style.css 解析实际
 *   比例、对 tokens.css 逐主题现算，全 30 套 ≥4.5（阶段 3 实测最差 linen 4.80）；
 *   比例是解析来的不是硬编码——改 CSS 比例这里自动跟着算，跌破即红。
 * 9.3 反向钉：UA 默认灰对 night 输入底必须 <4.5（钉住修复动机——把规则删回
 *   UA 默认等于回到不达标态）。 */
{
  const styleCss = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  const varsOf = id => (cssThemes[id] ? cssThemes[id].vars : rootVars);

  /* 9.1 焦点环 */
  let worstFocus = { ratio: Infinity, where: '' };
  for (const t of THEMES.themes) {
    const vars = varsOf(t.id);
    for (const surface of ['paper', 'wash']) {
      const r = contrast(vars['--color-accent'], vars['--color-' + surface]);
      if (r < worstFocus.ratio) worstFocus = { ratio: r, where: `${t.id}（${t.zh}）/${surface}` };
      assert.ok(r >= 3,
        check(`9.1 ${t.id}（${t.zh}）焦点环 accent/${surface} ${r.toFixed(2)}:1 ≥ 3（WCAG 1.4.11 非文本）`));
    }
  }
  console.log(`  9.1 焦点环：30 套 × 两背景面最差 ${worstFocus.ratio.toFixed(2)}:1（${worstFocus.where}）`);

  /* 9.2 占位文字 */
  const phRule = /::placeholder\s*{[^}]*color-mix\(in srgb, var\(--color-ink\)\s*(\d+)%, var\(--color-paper\)\)/.exec(styleCss);
  assert.ok(phRule, check('9.2 style.css 有 ::placeholder 的 ink→paper color-mix 规则（缺规则 = 回落 UA 默认灰，必红）'));
  const pct = Number(phRule[1]);
  assert.ok(pct >= 50 && pct <= 90, check(`9.2 占位色 ink 比例 ${pct}% 在 50–90 合理带内（过低不达标、过高与值文字无区分）`));
  const mixHex = (a, b, p) => {
    const A = hexToRgb(a), B = hexToRgb(b);
    return '#' + A.map((v, i) => Math.round(v * p / 100 + B[i] * (1 - p / 100)).toString(16).padStart(2, '0')).join('');
  };
  let worstPh = { ratio: Infinity, where: '' };
  for (const t of THEMES.themes) {
    const vars = varsOf(t.id);
    const mixed = mixHex(vars['--color-ink'], vars['--color-paper'], pct);
    const r = contrast(mixed, vars['--color-paper']);
    if (r < worstPh.ratio) worstPh = { ratio: r, where: `${t.id}（${t.zh}）` };
    assert.ok(r >= 4.5,
      check(`9.2 ${t.id}（${t.zh}）占位色 mix(ink ${pct}%, paper) 对输入底 ${r.toFixed(2)}:1 ≥ 4.5（WCAG 1.4.3）`));
    const valueR = contrast(vars['--color-ink'], vars['--color-paper']);
    assert.ok(valueR - r >= 1.5,
      check(`9.2 ${t.id}（${t.zh}）值文字（${valueR.toFixed(2)}）与占位（${r.toFixed(2)}）对比度差 ≥1.5——占位与已输入值可区分`));
  }
  console.log(`  9.2 占位色：ink ${pct}% mix，30 套最差 ${worstPh.ratio.toFixed(2)}:1（${worstPh.where}）`);

  /* 9.3 反向钉：UA 默认灰对 night 输入底 <4.5 */
  const nightPaper = varsOf('night')['--color-paper'];
  const uaGray = contrast('#757575', nightPaper);
  assert.ok(uaGray < 4.5,
    check(`9.3 反向钉：Chrome UA 默认占位灰 #757575 对 night 输入底仅 ${uaGray.toFixed(2)}:1 < 4.5——删掉 ::placeholder 规则回落默认色即不达标（2026-09-29 真实浏览器实测 3.68 同族）`));
}

/* ============ 10. v4.11.40（B1）：概念图次级连线 PALETTE.line 非文本对比度（三口径现算） ============
 * 为什么需要它：B+ 轮阶段 3 审计量出概念图三条描边都低于 WCAG 1.4.11 非文本 3:1
 * （edge 1.46 / line 2.94 / accentEdge 1.70），当轮按「设计取舍」登记待拍板；
 * v4.11.40 用户拍板**只调次级连线 line**（#8b918b → #878c87）。本节把达标事实钉死。
 *
 * 三个口径都要算，因为「底色」在三种渲染情形下不是同一个东西：
 *   A 审计原口径 —— line 对生成器的 PALETTE.fill。阶段 3 报告的 2.94 就是这个口径
 *     （复现值 2.943），保留它是为了与历史报告可比。
 *   B 浅色真实渲染 —— 生成的 SVG **没有自带背景 rect**、.concept-diagram 也没有底色，
 *     spoke 连线跨的是透明区，实际衬底是 .diagram-img 的 var(--color-paper)。这才是
 *     浅色主题下用户真看到的对比度，而且它**比 A 严**：旧值 #8b918b 在 A 下是 2.943、
 *     在 B 下 22 套里最差只有 2.848（pixel），只看 A 会把「真实渲染仍不达标」漏过去。
 *   C 深色真实渲染 —— 8 套深色主题靠 style.css 的 filter 反相适配，且该规则下
 *     background:transparent、页面深色底透出，所以要算「反相后的 line 对深色 paper」。
 *     滤镜矩阵按 CSS Filter Effects 规范现算，参数**从 style.css 实解析**——改滤镜
 *     会让本节跟着重算，不会拿旧参数假算。
 *     ⚠️ 口径 C 是**规范矩阵模型**，不是浏览器像素读数。2026-09-30 用真实 Chrome 的
 *     Canvas 2D `ctx.filter` 让浏览器自己的滤镜实现产出像素对账：模型 #717671(113,118,113)
 *     vs 浏览器 #707570(112,117,112)，三通道各差 1/255（Skia 管线的量化差；同一探针对
 *     旧值 #8b918b 两边完全一致，无滤镜对照 #878c87→#878c87 证明探针链路无色彩管理偏移）。
 *     该偏差让模型比浏览器**乐观约 0.05**（模型 3.434 / 浏览器 3.385）。所以口径 C 不要
 *     贴着 3.0 调——保留 ≥0.1 余量才吃得住这个偏差；当前实测余量 0.385，安全。
 *     口径 A / B 是纯 hex 对 hex 的 WCAG 公式计算、无滤镜参与，两侧输入都由真实浏览器
 *     getComputedStyle 实证过（浅色 `.diagram-img` 背景 = tokens.css 的 --color-paper
 *     逐套相符、深色 filter 串与 background:transparent 逐套相符），不存在模型偏差。
 *
 * 设计取舍登记（用户拍板「只调次级连线」）：edge(#c9cec8，对 fill 1.460) 与
 * accentEdge(#a9bcb0，对 accentFill 1.698) **刻意保留不调深**——连线是背景语义层，
 * 文字节点与 alt 文本（>20 字，a11y.test.cjs §7 钉住）才承载完整语义；调深会明显
 * 改变 109 张生成概念图的视觉风格。下面 10.E 两条是「取舍登记钉」：日后有人调了这两个
 * 值这里会红，逼一次有意识的决定，而不是让取舍悄悄失效。
 *
 * 生成物一致性不在本节重复：diagrams.test.cjs 已钉「入库 SVG = 生成器产出」逐字节，
 * 改了 PALETTE 不重跑生成器那边就红。 */
{
  /* --- 从生成器源码解析 PALETTE（ESM，不能 require；与 diagrams.test 同一手法） --- */
  const genSrc = fs.readFileSync(path.join(root, 'tools/build-diagrams.mjs'), 'utf8');
  const palBlock = /export const PALETTE = \{([\s\S]*?)\n\};/.exec(genSrc);
  assert.ok(palBlock, check('10 build-diagrams.mjs 有 export const PALETTE 块（本节从源解析，不硬编码色值）'));
  const PAL = {};
  for (const m of palBlock[1].matchAll(/(\w+):\s*'(#[0-9a-fA-F]{6})'/g)) PAL[m[1]] = m[2];
  for (const k of ['fill', 'edge', 'line', 'accentFill', 'accentEdge']) {
    assert.ok(PAL[k], check(`10 PALETTE.${k} 可从生成器源码解析（实际 ${PAL[k]}）`));
  }

  /* --- 两个口径的前提要从 CSS 实证，不能默认 --- */
  const styleCss = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  assert.ok(/\.diagram-img\s*\{[^}]*background:\s*var\(--color-paper\)/.test(styleCss),
    check('10 口径 B 前提：.diagram-img 的底色是 var(--color-paper)（spoke 跨 SVG 透明区，衬底即此）'));
  assert.ok(/filter:\s*invert\(1\)[^}]*background:\s*transparent;/.test(styleCss),
    check('10 口径 C 前提：深色概念图规则 background:transparent（页面深色底透出，反相只作用于 SVG 内容）'));

  /* --- 反相 filter 实解析 + 规范矩阵现算 --- */
  const fr = /filter:\s*((?:invert|hue-rotate|saturate)\([^)]*\)(?:\s+(?:invert|hue-rotate|saturate)\([^)]*\))*)\s*;/.exec(styleCss);
  assert.ok(fr, check('10 style.css 的概念图反相 filter 可解析（本节按实解析的参数现算）'));
  const filterStr = fr[1];
  assert.equal(filterStr.replace(/\s+/g, ' '), 'invert(1) hue-rotate(180deg) saturate(.92)',
    check(`10 反相 filter 与 v4.11.5 基线逐字一致（实解析：${filterStr}）——改滤镜参数须同步复核本节三口径与 109 张图的深色观感`));
  const mat = (m, v) => m.map(row => row[0] * v[0] + row[1] * v[1] + row[2] * v[2]);
  function applyFilter(hexStr) {
    let rgb = hexToRgb(hexStr);
    for (const fn of filterStr.match(/[a-z-]+\([^)]*\)/g) || []) {
      const name = fn.slice(0, fn.indexOf('('));
      const arg = fn.slice(fn.indexOf('(') + 1, -1).trim();
      if (name === 'invert') {
        const a = parseFloat(arg);
        rgb = rgb.map(v => v * (1 - a) + (255 - v) * a);
      } else if (name === 'hue-rotate') {
        const ang = (parseFloat(arg) * Math.PI) / 180;
        const cos = Math.cos(ang), sin = Math.sin(ang);
        rgb = mat([
          [0.213 + cos * 0.787 - sin * 0.213, 0.715 - cos * 0.715 - sin * 0.715, 0.072 - cos * 0.072 + sin * 0.928],
          [0.213 - cos * 0.213 + sin * 0.143, 0.715 + cos * 0.285 + sin * 0.140, 0.072 - cos * 0.072 - sin * 0.283],
          [0.213 - cos * 0.213 - sin * 0.787, 0.715 - cos * 0.715 + sin * 0.715, 0.072 + cos * 0.928 + sin * 0.072]
        ], rgb);
      } else if (name === 'saturate') {
        const s = parseFloat(arg);
        rgb = mat([
          [0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s],
          [0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s],
          [0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s]
        ], rgb);
      } else {
        assert.fail(`10 未预期的滤镜函数 ${name}——本节只实现了 invert / hue-rotate / saturate，新增函数须同步补实现，不得静默跳过`);
      }
      rgb = rgb.map(v => Math.min(255, Math.max(0, v)));   /* 每步钳位到合法域，与浏览器一致 */
    }
    return '#' + rgb.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  }

  const varsOf10 = id => (cssThemes[id] ? cssThemes[id].vars : rootVars);
  const lightIds = THEMES.themes.filter(t => t.dark !== true).map(t => t.id);
  const darkIds10 = THEMES.themes.filter(t => t.dark === true).map(t => t.id);
  assert.equal(lightIds.length + darkIds10.length, THEMES.themes.length,
    check(`10 浅色 ${lightIds.length} 套 + 深色 ${darkIds10.length} 套 = 清单总数（分档无遗漏）`));

  /* --- 口径 A：审计原口径 --- */
  const rA = contrast(PAL.line, PAL.fill);
  assert.ok(rA >= 3,
    check(`10.A 口径 A（审计原口径）：PALETTE.line ${PAL.line} 对 PALETTE.fill ${PAL.fill} = ${rA.toFixed(3)}:1 ≥ 3（WCAG 1.4.11 非文本；v4.11.38 审计值 2.94）`));

  /* --- 口径 B：浅色真实渲染，全浅色主题逐套 --- */
  let worstB = { r: Infinity, id: '' };
  for (const id of lightIds) {
    const paper = varsOf10(id)['--color-paper'];
    const r = contrast(PAL.line, paper);
    assert.ok(r >= 3, check(`10.B 口径 B（浅色真实渲染）：line ${PAL.line} 对 ${id} 的 --color-paper ${paper} = ${r.toFixed(3)}:1 ≥ 3`));
    if (r < worstB.r) worstB = { r, id };
  }

  /* --- 口径 C：深色真实渲染（反相后），全深色主题逐套 --- */
  const invLine = applyFilter(PAL.line);
  const invRgb = hexToRgb(invLine);
  assert.ok(invRgb.every(v => v >= 0 && v <= 255),
    check(`10.C 反相结果 ${invLine} 三分量落在 0–255 合法域（常识区间自检——防解析形态出错算出荒谬值，§16.5 经验）`));
  const invL = luminance(invLine);
  assert.ok(invL > 0.05 && invL < 0.6,
    check(`10.C 反相后 line ${invLine} 相对亮度 ${invL.toFixed(3)} 落在中灰区间（0.05–0.6）——超出即滤镜解析或矩阵实现有误，数值不得采信`));
  let worstC = { r: Infinity, id: '' };
  for (const id of darkIds10) {
    const paper = varsOf10(id)['--color-paper'];
    const r = contrast(invLine, paper);
    assert.ok(r >= 3, check(`10.C 口径 C（深色真实渲染）：反相后 line ${invLine} 对 ${id} 的 --color-paper ${paper} = ${r.toFixed(3)}:1 ≥ 3`));
    if (r < worstC.r) worstC = { r, id };
  }

  /* --- 10.D 反向钉：旧值必红（含「只看口径 A 会漏」的实证） --- */
  const OLD_LINE = '#8b918b';
  assert.ok(PAL.line.toLowerCase() !== OLD_LINE,
    check(`10.D 反向钉：PALETTE.line 当前值 ${PAL.line} 不是 v4.11.39 旧值 ${OLD_LINE}`));
  const oldA = contrast(OLD_LINE, PAL.fill);
  assert.ok(oldA < 3, check(`10.D 反向钉：旧值 ${OLD_LINE} 对 PALETTE.fill 仅 ${oldA.toFixed(3)}:1 < 3——改回旧值本节必红`));
  let oldWorstB = { r: Infinity, id: '' };
  for (const id of lightIds) {
    const r = contrast(OLD_LINE, varsOf10(id)['--color-paper']);
    if (r < oldWorstB.r) oldWorstB = { r, id };
  }
  assert.ok(oldWorstB.r < 3,
    check(`10.D 反向钉：旧值在口径 B 下全 ${lightIds.length} 套最差 ${oldWorstB.r.toFixed(3)}:1（${oldWorstB.id}）< 3——比口径 A 的 ${oldA.toFixed(3)} 更差，实证「只看审计原口径会漏掉真实渲染面」`));

  /* --- 10.E 取舍登记钉：edge / accentEdge 刻意保留 <3（用户拍板只调次级连线） --- */
  const rEdge = contrast(PAL.edge, PAL.fill);
  assert.ok(rEdge < 3,
    check(`10.E 取舍登记钉：edge ${PAL.edge} 对 fill = ${rEdge.toFixed(3)}:1 < 3 是**已拍板的设计取舍**（连线为背景语义层，完整语义由文字节点与 >20 字 alt 承载，调深会明显改变 109 张图的视觉风格）；若你有意调深 edge，须同步改本断言与 build-diagrams.mjs 的取舍注释`));
  const rAccEdge = contrast(PAL.accentEdge, PAL.accentFill);
  assert.ok(rAccEdge < 3,
    check(`10.E 取舍登记钉：accentEdge ${PAL.accentEdge} 对 accentFill = ${rAccEdge.toFixed(3)}:1 < 3 同上（用户拍板：只调次级连线 line）`));

  console.log(`  10 概念图次级连线 PALETTE.line ${PAL.line}：口径 A(vs fill) ${rA.toFixed(3)} / 口径 B(浅色 ${lightIds.length} 套最差 ${worstB.r.toFixed(3)}，${worstB.id}) / 口径 C(深色反相 ${invLine}，${darkIds10.length} 套最差 ${worstC.r.toFixed(3)}，${worstC.id})——三口径全 ≥3:1`);
}

console.log(`通过：v4.4 主题系统 ${checks} 项断言（${THEMES.themes.length} 套主题 × 7 组对比度程序化检查、清单/CSS 一一对应、swatch 不骗人、color-scheme 与 dark 标签一致、既有解锁口径不回退、v4.11.5 深色清单与概念图反相适配一一对应 + 打印还原、v4.11.7 预览条状态文字配色规则在位且未回退、v4.11.9 wash 底文本 ink/wash 全 ${THEMES.themes.length} 套达标 + muted/accent 在 wash 上确实不达标的反向钉子、v4.11.13 mask 结构钉 + token 派生色全 ${THEMES.themes.length} 套 × 三背景面 ≥ 2.2 + 深墨/旧绿固定色必红的反向钉子、B+ 轮阶段 3 焦点环 accent 对 paper/wash 全 ${THEMES.themes.length} 套 ≥3 + 占位色 color-mix 现算全 ${THEMES.themes.length} 套 ≥4.5 + UA 默认灰必不达标的反向钉子、v4.11.40 概念图次级连线 PALETTE.line 从生成器源码解析后三口径现算（审计原口径 vs PALETTE.fill / 浅色真实渲染 vs 全浅色套 --color-paper / 深色真实渲染 vs 反相后对全深色套 --color-paper，滤镜参数从 style.css 实解析）全 ≥3 + 旧值 #8b918b 必红的反向钉 + edge/accentEdge 设计取舍登记钉）。`);
