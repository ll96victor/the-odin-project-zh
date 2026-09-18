/* v4.11 批次 C：氛围背景层专项（D1 全局氛围背景 + D4 个人中心封面氛围带）。
 *
 * 被测对象：style.css 的批次 C 新段（EOF 的 body::before 氛围层）与 P0-5 节
 * .profile-cover 的 background 叠层。方法：纯静态断言（字符串/正则级）——本层是
 * 表现层 CSS，运行时行为（计算样式 / 绘制顺序 / print 媒体）由真实 Chrome + CDP
 * 在 TEST-REPORT「v4.11 批次 C 验收」验证；本文件钉住的是「纪律不漂移」：
 *   1. body 规则背景逐字回归钉（html 无背景 → body 背景传播为 canvas 底色不变）；
 *   2. body::before 存在性与引用面（fixed / z-1 / pointer-events:none；只引用
 *      wash/accent/grow 三个既有变量 + 固定暖白 rgba，alpha 上限 40·7·6·35 锁死）；
 *   3. 中心中性——每个渐变层最后一个色标为 transparent（阅读区中心零染，
 *      dune/bamboo 薄冰点配对安全的前提）；
 *   4. 深色退月光 html[data-dark] opacity .38（hero 窗光同档先例）；
 *   5. 打印完全移除 @media print content: none；
 *   6. 封面 background ≥3 层、原 accent 渐变逐字保留为最底层、新两层只引用
 *      button-ink；print 的 background:#fff 覆盖仍在；
 *   7. 批次 C 新段零新 token、零 animation/@keyframes（prefers-reduced-motion
 *      零涉及）。
 * 全量纪律：既有 36 个测试文件零改动、原样全绿（themes-contrast 721 项通过 =
 * 未触发 swatch 同步义务的证明）；本文件是第 37 个。
 *
 * 运行：node tests/atmosphere-layer.test.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
let checks = 0;
const check = label => { checks += 1; return label; };

const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');

/* 顶层逗号切分 background 简写的层（括号内的逗号属于 gradient / color-mix 参数） */
function splitTopLevel(value) {
  const parts = [];
  let depth = 0;
  let cur = '';
  for (const ch of value) {
    if (ch === '(') depth += 1;
    if (ch === ')') depth -= 1;
    if (ch === ',' && depth === 0) { parts.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  parts.push(cur.trim());
  return parts;
}

/* 批次 C 新段：段首注释起到 EOF（段在文件末尾、批次 A 节奏段之后） */
const sectionStart = css.indexOf('/* ===================== v4.11 批次 C：氛围背景层');
assert.ok(sectionStart > 0, check('style.css 存在 v4.11 批次 C 段首（EOF 追加、批次 A 节奏段之后）'));
const batchC = css.slice(sectionStart);

/* 全部 @media print 块的内部内容（块内规则均缩进，行首 } 即块结束） */
const printBlocks = [...css.matchAll(/@media print \{([\s\S]*?)\n\}/g)].map(m => m[1]);
assert.ok(printBlocks.length > 0, check('style.css 存在 @media print 块'));

/* ===================== 1. body 规则逐字回归钉（canvas 传播不变） ===================== */
{
  const bodyRule = /(?:^|\n)body \{([^}]*)\}/.exec(css);
  assert.ok(bodyRule, check('裸 body 规则存在'));
  assert.ok(bodyRule[1].includes('background: var(--color-paper)'),
    check('body 背景仍 var(--color-paper)（传播为 canvas 底色，氛围层画在其上、内容画在其下之上）'));
}

/* ===================== 2. body::before 存在性与引用面 ===================== */
let beforeBg = '';
{
  const rule = /body::before \{([^}]*)\}/.exec(batchC);
  assert.ok(rule, check('批次 C 段内存在 body::before 规则'));
  const decl = rule[1];
  assert.ok(decl.includes("content: ''"), check("body::before 有 content: ''"));
  assert.ok(decl.includes('position: fixed'), check('body::before position: fixed（视口锚定）'));
  assert.ok(decl.includes('inset: 0'), check('body::before inset: 0'));
  assert.ok(decl.includes('z-index: -1'), check('body::before z-index: -1（画在内容之下）'));
  assert.ok(decl.includes('pointer-events: none'), check('body::before pointer-events: none（绝不拦截交互）'));

  const bg = /background:\s*([^;]+);/.exec(decl);
  assert.ok(bg, check('body::before 有 background 简写'));
  beforeBg = bg[1];
  const layers = splitTopLevel(beforeBg);
  assert.equal(layers.length, 4, check(`氛围层恰为四层（实际 ${layers.length}）`));

  /* 引用面：只允许 wash/accent/grow 三个既有变量的 color-mix + 固定暖白 rgba */
  const vars = [...new Set([...beforeBg.matchAll(/var\((--[\w-]+)\)/g)].map(m => m[1]))].sort();
  assert.deepEqual(vars, ['--color-accent', '--color-grow', '--color-wash'],
    check('background 仅引用 wash/accent/grow 三个既有变量（零新 token、零 per-theme 值）'));
  const rgbas = [...beforeBg.matchAll(/rgba?\([^)]*\)/g)].map(m => m[0]);
  assert.deepEqual(rgbas, ['rgba(255, 252, 244, .35)'],
    check('唯一固定色值 = 暖白光斑 rgba(255, 252, 244, .35)（L1358 物理光纪律，不随主题色相漂移）'));
  assert.ok(!/#[0-9a-fA-F]{3,8}/.test(beforeBg), check('background 无 hex 色值'));

  /* alpha 上限 40·7·6·35 锁死（加强必须重新规划） */
  assert.ok(beforeBg.includes('var(--color-wash) 40%'), check('顶边雾带 wash alpha = 40%（上限锁死）'));
  assert.ok(beforeBg.includes('var(--color-accent) 7%'), check('右上 accent 角晕 alpha = 7%（上限锁死）'));
  assert.ok(beforeBg.includes('var(--color-grow) 6%'), check('左下 grow 绿角晕 alpha = 6%（上限锁死）'));
}

/* ===================== 3. 中心中性：每层最后一个色标为 transparent ===================== */
{
  const layers = splitTopLevel(beforeBg);
  layers.forEach((layer, i) => {
    const inner = layer.slice(layer.indexOf('(') + 1, layer.lastIndexOf(')'));
    const stops = splitTopLevel(inner);
    assert.ok(stops[stops.length - 1].startsWith('transparent'),
      check(`第 ${i + 1} 层以 transparent 收尾（角/边锚定、中心零染）`));
  });
}

/* ===================== 4. 深色退月光（hero 窗光同档先例） ===================== */
{
  assert.ok(/html\[data-dark\] body::before \{ opacity: \.38; \}/.test(batchC),
    check('html[data-dark] body::before opacity .38（深色退月光，与 .home-hero::before 同档）'));
}

/* ===================== 5. 打印完全移除 ===================== */
{
  assert.ok(printBlocks.some(b => /body::before \{ content: none; \}/.test(b)),
    check('@media print 含 body::before { content: none; }（打印完全移除氛围层）'));
}

/* ===================== 6. D4 封面氛围带 ===================== */
{
  const coverRule = /\.identity-panel \.profile-cover \{([^}]*)\}/.exec(css);
  assert.ok(coverRule, check('.identity-panel .profile-cover 规则存在'));
  const bg = /background:\s*([^;]+);/.exec(coverRule[1]);
  assert.ok(bg, check('cover 有 background 简写'));
  const layers = splitTopLevel(bg[1]);
  assert.ok(layers.length >= 3, check(`cover background ≥3 层（实际 ${layers.length}）`));
  assert.equal(layers[layers.length - 1],
    'linear-gradient(140deg, color-mix(in srgb, var(--color-accent) 90%, var(--color-paper)), color-mix(in srgb, var(--color-accent) 58%, var(--color-wash)))',
    check('原 accent 渐变层逐字保留为最底层'));
  assert.equal(layers[0],
    'radial-gradient(26rem 18rem at 108% 118%, color-mix(in srgb, var(--color-button-ink) 12%, transparent), transparent 72%)',
    check('新增层①右下径向光斑逐字（button-ink 12%，与既有 ::before 13% 光斑同量级）'));
  assert.equal(layers[1],
    'linear-gradient(200deg, color-mix(in srgb, var(--color-button-ink) 10%, transparent), transparent 42%)',
    check('新增层②左上斜向光带逐字（button-ink 10%）'));
  const newVars = [...new Set(layers.slice(0, 2).join(' ').match(/--color-[\w-]+/g) || [])];
  assert.deepEqual(newVars, ['--color-button-ink'],
    check('新增两层仅引用 --color-button-ink（color-mix 变量驱动，深色主题自动适配）'));
  assert.ok(printBlocks.some(b => /\.profile-cover \{ background: #fff/.test(b)),
    check('print 的 .profile-cover { background: #fff 覆盖仍在（简写自动剥离叠层）'));
}

/* ===================== 7. 批次 C 新段零新 token、零动画 ===================== */
{
  assert.equal(batchC.match(/--color-[a-z-]+\s*:/g), null,
    check('批次 C 段内零 --color-*: 新 token 定义'));
  assert.ok(!/animation\s*:/.test(batchC), check('批次 C 段内零 animation:（prefers-reduced-motion 零涉及）'));
  assert.ok(!/@keyframes/.test(batchC), check('批次 C 段内零 @keyframes'));
}

console.log(`通过：v4.11 批次 C 氛围背景层专项 ${checks} 项断言（body 背景逐字回归钉、body::before 存在性与引用面、中心中性 transparent 收尾、data-dark .38、print content:none、cover ≥3 层且原层逐字 + print #fff 覆盖在、新段零新 token 零 animation）。真实浏览器计算样式与 30 套主题主观观感见 TEST-REPORT「v4.11 批次 C 验收」。`);
