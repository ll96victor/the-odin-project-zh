/* companion-wardrobe.js — v4.5（交接 Core D）：学习伙伴「人形装扮」参数化系统。
 *
 * 从「每个角色是一整张图」升级为「可组合的轻量角色」：用户档案只存部件 id
 * （body / hair / outfit / accessory / palette），运行时按图层拼装成 SVG，
 * 不把数百套组合存成数百张图（交接 D1）。单套组合是字符串级生成、约 2–3KB，
 * 无运行时图形库、无大 PNG、无联网——与 v4 以来 ODIN_COMPANION_BUST 同一路线。
 *
 * 设计思想参考（不复制代码、不引入依赖，逐条见 REUSE-NOTES.md v4.5 章节）：
 *   - Humation（MIT，零运行时依赖，TS/Bun 单体仓）：manifest = selectionSlots /
 *     layerSlots / colorSlots；createAvatar→toDataUri（data URL 进 <img>）+ toJSON
 *     （只持久化 selections/colors，不存渲染结果）。本站据此把「部件槽 + 色板槽 +
 *     图层顺序」收敛成 PALETTES / HAIRS / OUTFITS / ACCESSORIES + LAYERS。
 *   - DiceBear（MIT，零依赖 JS core）：确定性生成 + data URI 输出。本站的装扮是
 *     用户**显式选择**而非 seed 随机，因此只借「同输入必同输出、运行时拼装、
 *     data URL 渲染」这条，不引其 seed/PRNG（随机搭配留到 Stretch，且只随机已拥有）。
 *   - Universal LPC Spritesheet Character Generator（代码 GPL-3.0、LPC 素材
 *     CC-BY-SA-3.0）：分层纸娃娃（paper-doll）拼装的**概念**参考；代码与素材因
 *     GPL 传染性 + CC-BY-SA 相同方式共享，与本站「全部视觉原创、CC BY-NC-SA、
 *     不用第三方资产」红线冲突，**零复用**。
 *
 * 全部部件为本文件内程序化生成的原创几何 SVG，不复制任何第三方/商业/动漫资产。
 * 加载顺序：先于 progress.js（HTML 已按此排列），与 companions.js 同为纯数据+纯逻辑。 */
window.ODIN_COMPANION_WARDROBE = (() => {
  'use strict';

  /* ---------- 色板（palette）：7 套，每套是一组语义色 ----------
   * 部件 SVG 只引用语义色位（skin/hair/cloth/…），换色板即换整套配色，
   * 不必为每个颜色重画部件（Humation colorSlot 思路的本站简化版）。 */
  const PALETTES = [
    { id: 'garden', zh: '园地', unlock: { kind: 'default' },
      skin: '#f3d9bf', skinShade: '#e5c0a0', hair: '#33503c', hairLight: '#41624b',
      cloth: '#4a7c59', clothDark: '#38604a', accent: '#a4553f', eye: '#33261c', blush: null },
    { id: 'dawn', zh: '晨光', unlock: { kind: 'default' },
      skin: '#f6dcc3', skinShade: '#e7c3a4', hair: '#8a4b2a', hairLight: '#a25c37',
      cloth: '#c9714f', clothDark: '#a85b3d', accent: '#e0a458', eye: '#3a281e', blush: '#f0a898' },
    { id: 'dusk', zh: '暮色', unlock: { kind: 'level', value: 3 },
      skin: '#f0d6c0', skinShade: '#dfc0a8', hair: '#4a3a63', hairLight: '#5d4b7a',
      cloth: '#6b5b95', clothDark: '#54467a', accent: '#c8a2e0', eye: '#2e2440', blush: '#e0b0c8' },
    { id: 'sea', zh: '海风', unlock: { kind: 'coins', value: 40 },
      skin: '#f3d9bf', skinShade: '#e2c0a0', hair: '#2f4858', hairLight: '#3d5c70',
      cloth: '#4a7c9c', clothDark: '#38607a', accent: '#7fd3d3', eye: '#22303a', blush: null },
    { id: 'bloom', zh: '花信', unlock: { kind: 'achievement', value: 'streak-7' },
      skin: '#f7ddc6', skinShade: '#eac2a2', hair: '#a8556b', hairLight: '#c06a80',
      cloth: '#d98b9c', clothDark: '#bb6e7f', accent: '#f2d98b', eye: '#3a281e', blush: '#f0a898' },
    { id: 'earth', zh: '沃野', unlock: { kind: 'level', value: 5 },
      skin: '#e8c39e', skinShade: '#d6ac85', hair: '#4a3524', hairLight: '#5e452f',
      cloth: '#8a6a4f', clothDark: '#6e533d', accent: '#6f9c85', eye: '#2e2418', blush: null },
    /* v4.5 Batch 9（交接 I：色板 6→7 套，仍满足 D2 的 6+） */
    { id: 'pine', zh: '松林', unlock: { kind: 'level', value: 8 },
      skin: '#f0d4b8', skinShade: '#ddb994', hair: '#2b3a33', hairLight: '#3a4d43',
      cloth: '#3e5c50', clothDark: '#2f493e', accent: '#8fb8a0', eye: '#22302a', blush: null }
  ];
  const PALETTE_BY_ID = {};
  PALETTES.forEach(p => { PALETTE_BY_ID[p.id] = p; });
  const DEFAULT_PALETTE_ID = 'garden';

  /* ---------- 体型（body）：少年 / 少女，两个基础体型继续存在（交接 D2） ---------- */
  const BODIES = [
    { id: 'boy', zh: '少年' },
    { id: 'girl', zh: '少女' }
  ];
  const BODY_IDS = BODIES.map(b => b.id);
  const DEFAULT_BODY = 'boy';

  /* 躯干（outfit 之下的身体底色 + 手臂），按体型略有差异。 */
  function bodyBase(p, who) {
    const arms = who === 'girl'
      ? '<path d="M40 104q-4 12-2 20M88 104q4 12 2 20" stroke="' + p.skinShade + '" stroke-width="6" stroke-linecap="round" fill="none"/>'
      : '<path d="M40 104q-5 12-3 20M88 104q5 12 3 20" stroke="' + p.skinShade + '" stroke-width="6.5" stroke-linecap="round" fill="none"/>';
    return arms;
  }

  /* ---------- 表情（expression / mood）：5 种，确定性映射，沿用 v4.4 语义 ---------- */
  const MOODS = ['normal', 'happy', 'encourage', 'remind', 'celebrate'];
  const EXPRESSIONS = [
    { id: 'normal', zh: '普通' }, { id: 'happy', zh: '开心' },
    { id: 'encourage', zh: '鼓励' }, { id: 'remind', zh: '提醒' },
    { id: 'celebrate', zh: '庆祝' }
  ];

  function eyesFor(mood, p) {
    const round = '<circle cx="52" cy="52" r="4.6" fill="' + p.eye + '"/><circle cx="53.6" cy="50.3" r="1.6" fill="#fff"/><circle cx="76" cy="52" r="4.6" fill="' + p.eye + '"/><circle cx="77.6" cy="50.3" r="1.6" fill="#fff"/>';
    if (mood === 'happy') return '<path d="M46 54q6-7 12 0M70 54q6-7 12 0" stroke="' + p.eye + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
    if (mood === 'celebrate') return '<path d="M45 55q7-9 14 0M69 55q7-9 14 0" stroke="' + p.eye + '" stroke-width="3.2" fill="none" stroke-linecap="round"/>';
    if (mood === 'remind') return round + '<path d="M45 42q6-3 12-1" stroke="' + p.hair + '" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M70 40q6-3 11 1" stroke="' + p.hair + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    return round;
  }
  function mouthFor(mood, p) {
    if (mood === 'happy') return '<path d="M57 65q7 9 14 0z" fill="' + p.eye + '"/>';
    if (mood === 'celebrate') return '<path d="M54 64q10 16 20 0z" fill="' + p.eye + '"/><path d="M59.5 70.5q4.5 3.5 9 0" fill="#e88a7a"/>';
    if (mood === 'remind') return '<path d="M59 67h10" stroke="' + p.eye + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    if (mood === 'encourage') return '<ellipse cx="64" cy="67" rx="4.2" ry="5" fill="' + p.eye + '"/>';
    return '<path d="M58 66q6 5 12 0" stroke="' + p.eye + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
  }
  function moodExtra(mood) {
    if (mood === 'remind') return '<circle cx="105" cy="25" r="10" fill="#fdf8ee" stroke="#56625c" stroke-width="2"/><rect x="103.7" y="19" width="2.6" height="8" rx="1.3" fill="#56625c"/><circle cx="105" cy="30.5" r="1.6" fill="#56625c"/>';
    if (mood === 'celebrate') return '<circle cx="23" cy="26" r="2.6" fill="#e8a0b0"/><circle cx="105" cy="48" r="2.4" fill="#f2d98b"/><circle cx="17" cy="47" r="2.2" fill="#7f96e8"/><path d="M99 13l2 4.6 4.6 2-4.6 2-2 4.6-2-4.6-4.6-2 4.6-2z" fill="#6fc2a8"/>';
    if (mood === 'encourage') return '<path d="M25 33l1.8 4.2 4.2 1.8-4.2 1.8-1.8 4.2-1.8-4.2-4.2-1.8 4.2-1.8z" fill="#f2d98b"/><path d="M102 40l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" fill="#f2d98b"/>';
    return '';
  }

  /* ---------- 发型（hair）：8 款。back=脑后长发（在身体之后），front=刘海/顶部 ----------
   * 每款是 (palette, body) → SVG 片段的纯函数；同一款在少年/少女上共用，颜色随色板。 */
  const HAIRS = [
    { id: 'short', zh: '短发', unlock: { kind: 'default' },
      back: () => '',
      front: p => '<path d="M30 56C28 30 42 14 64 14s36 16 34 42l-7-4c1-14-8-24-27-24S39 38 40 52z" fill="' + p.hair + '"/><path d="M52 17l3-9 5 8M68 15l4-9 4 9" fill="' + p.hairLight + '"/><path d="M40 46q10-10 24-9 12 1 20 9-8-4-20-4-14 0-24 4z" fill="' + p.hairLight + '"/>' },
    { id: 'bob', zh: '波波头', unlock: { kind: 'default' },
      back: p => '<path d="M30 50c0-16 14-30 34-30s34 14 34 30v28q0 6-6 6H36q-6 0-6-6z" fill="' + p.hair + '"/>',
      front: p => '<path d="M35 47C37 27 48 18 64 18s27 9 29 29c-9-9-17-12-29-12-8 0-14 3-20 7-4 2-7 3-9 5z" fill="' + p.hairLight + '"/>' },
    { id: 'long', zh: '长直发', unlock: { kind: 'level', value: 3 },
      back: p => '<path d="M28 52c0-18 16-32 36-32s36 14 36 32v44q0 8-8 8l-6-2V60H42v42l-6 2q-8 0-8-8z" fill="' + p.hair + '"/>',
      front: p => '<path d="M34 48C36 28 48 18 64 18s28 10 30 30c-10-10-18-13-30-13s-20 3-30 13z" fill="' + p.hairLight + '"/>' },
    { id: 'ponytail', zh: '马尾', unlock: { kind: 'achievement', value: 'unit-1' },
      back: p => '<path d="M92 44q22 8 18 40-2 18-14 22 6-22-2-38-4-10-8-16z" fill="' + p.hair + '"/><ellipse cx="98" cy="46" rx="7" ry="6" fill="' + p.accent + '"/>',
      front: p => '<path d="M31 54C29 30 43 15 64 15s35 15 33 39l-8-5c1-13-8-22-25-22S40 37 41 50z" fill="' + p.hair + '"/><path d="M42 44q10-9 22-8" stroke="' + p.hairLight + '" stroke-width="4" fill="none" stroke-linecap="round"/>' },
    { id: 'curly', zh: '卷发', unlock: { kind: 'coins', value: 50 },
      back: p => '<g fill="' + p.hair + '"><circle cx="34" cy="46" r="12"/><circle cx="94" cy="46" r="12"/><circle cx="40" cy="70" r="11"/><circle cx="88" cy="70" r="11"/><circle cx="64" cy="24" r="14"/></g>',
      front: p => '<g fill="' + p.hairLight + '"><circle cx="46" cy="30" r="9"/><circle cx="64" cy="24" r="10"/><circle cx="82" cy="30" r="9"/><circle cx="38" cy="42" r="8"/><circle cx="90" cy="42" r="8"/></g>' },
    { id: 'bun', zh: '丸子头', unlock: { kind: 'coins', value: 45 },
      back: p => '<circle cx="64" cy="14" r="11" fill="' + p.hair + '"/><circle cx="64" cy="14" r="5" fill="' + p.hairLight + '"/>',
      front: p => '<path d="M32 52C31 30 44 16 64 16s33 14 32 36l-8-4c0-13-9-21-24-21S41 35 41 48z" fill="' + p.hair + '"/><path d="M43 44q9-8 21-7" stroke="' + p.hairLight + '" stroke-width="3.6" fill="none" stroke-linecap="round"/>' },
    /* v4.5 Batch 9（交接 I：资产继续扩充，6→8 款，仍在 D2 的 6–10 区间） */
    { id: 'twin', zh: '双马尾', unlock: { kind: 'achievement', value: 'lessons-5' },
      back: p => '<path d="M32 44q-16 8-16 34 0 18 9 24-3-20 1-34 2-9 8-16z" fill="' + p.hair + '"/><path d="M96 44q16 8 16 34 0 18-9 24 3-20-1-34-2-9-8-16z" fill="' + p.hair + '"/><circle cx="31" cy="46" r="4" fill="' + p.accent + '"/><circle cx="97" cy="46" r="4" fill="' + p.accent + '"/>',
      front: p => '<path d="M31 52C31 28 45 15 64 15s33 13 33 37c-9-11-18-15-33-15s-24 4-33 15z" fill="' + p.hair + '"/><path d="M44 40q9-8 20-7" stroke="' + p.hairLight + '" stroke-width="4" fill="none" stroke-linecap="round"/>' },
    { id: 'pixie', zh: '精灵短发', unlock: { kind: 'coins', value: 40 },
      back: () => '',
      front: p => '<path d="M30 52C29 28 43 14 64 14s35 14 34 38l-8-5 3-8-9 5-4-9-8 7-7-9-7 9-8-6-2 9z" fill="' + p.hair + '"/><path d="M50 22q11-6 24-2" stroke="' + p.hairLight + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>' }
  ];

  /* ---------- 服装 / 上装（outfit）：10 款 ---------- */
  const OUTFITS = [
    { id: 'hoodie', zh: '绿卫衣', unlock: { kind: 'default' },
      draw: (p, who) => torso(p, who) + '<path d="M47 92q17 11 34 0" stroke="' + p.clothDark + '" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M52 90q12 8 24 0l2 8q-14 7-28 0z" fill="' + p.clothDark + '" opacity=".5"/>' + sproutBadge(p) },
    { id: 'tee', zh: '圆领 T', unlock: { kind: 'default' },
      draw: (p, who) => torso(p, who) + '<path d="M50 92q14 8 28 0" stroke="' + p.clothDark + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>' },
    { id: 'dress', zh: '连衣裙', unlock: { kind: 'default' },
      draw: (p, who) => '<path d="M50 92l-14 36h56l-14-36q-14 9-28 0z" fill="' + p.cloth + '"/><path d="M50 92q14 9 28 0l2 6q-16 8-32 0z" fill="' + p.clothDark + '"/><path d="M40 116h48" stroke="' + p.accent + '" stroke-width="2.4" stroke-linecap="round"/>' + sproutBadge(p) },
    { id: 'sweater', zh: '粗线毛衣', unlock: { kind: 'level', value: 2 },
      draw: (p, who) => torso(p, who) + '<path d="M40 104h48M40 112h48M40 120h48" stroke="' + p.clothDark + '" stroke-width="2" opacity=".6"/><path d="M52 92q12 7 24 0" stroke="' + p.clothDark + '" stroke-width="3" fill="none" stroke-linecap="round"/>' },
    { id: 'jacket', zh: '开衫外套', unlock: { kind: 'achievement', value: 'first-lesson' },
      draw: (p, who) => torso(p, who) + '<path d="M62 92v36M66 92v36" stroke="' + p.clothDark + '" stroke-width="2"/><path d="M50 92l12 6 12-6" fill="' + p.skinShade + '" opacity=".4"/><circle cx="64" cy="104" r="1.8" fill="' + p.accent + '"/><circle cx="64" cy="114" r="1.8" fill="' + p.accent + '"/>' },
    { id: 'overalls', zh: '背带裤', unlock: { kind: 'coins', value: 55 },
      draw: (p, who) => '<path d="M40 100h48v28H40z" fill="' + p.clothDark + '"/>' + torso(p, who) + '<path d="M52 96v16M76 96v16" stroke="' + p.clothDark + '" stroke-width="5" stroke-linecap="round"/><rect x="50" y="108" width="28" height="14" rx="3" fill="' + p.cloth + '"/><circle cx="52" cy="98" r="2" fill="' + p.accent + '"/><circle cx="76" cy="98" r="2" fill="' + p.accent + '"/>' },
    { id: 'kimono', zh: '和风上衣', unlock: { kind: 'coins', value: 70 },
      draw: (p, who) => torso(p, who) + '<path d="M50 92l14 14 14-14" fill="' + p.skinShade + '" opacity=".35"/><path d="M62 104l-8 24M66 104l8 24" stroke="' + p.clothDark + '" stroke-width="2.4" fill="none"/><rect x="40" y="116" width="48" height="7" rx="2" fill="' + p.accent + '"/>' },
    { id: 'vest', zh: '马甲衬衫', unlock: { kind: 'level', value: 4 },
      draw: (p, who) => '<path d="M36 96q4-6 12-8v40q-8-2-12-8z" fill="#edf3ee"/><path d="M92 96q-4-6-12-8v40q8-2 12-8z" fill="#edf3ee"/>' + torso(p, who) + '<path d="M52 90l12 8 12-8v6l-12 8-12-8z" fill="' + p.clothDark + '"/>' },
    /* v4.5 Batch 9（交接 I：资产继续扩充，8→10 款，仍在 D2 的 8–12 区间） */
    { id: 'sailor', zh: '水手领上衣', unlock: { kind: 'achievement', value: 'quiz-3' },
      draw: (p, who) => torso(p, who) + '<path d="M48 90l16 14 16-14 9 5-7 11q-18 8-36 0l-7-11z" fill="#edf3ee"/><path d="M52 92l12 11 12-11" fill="none" stroke="' + p.clothDark + '" stroke-width="2.2"/><path d="M60 104h8l2 14h-12z" fill="' + p.accent + '"/>' },
    { id: 'raincoat', zh: '小雨披', unlock: { kind: 'coins', value: 65 },
      draw: (p, who) => torso(p, who) + '<path d="M31 128q3-30 15-38l8 6q-10 10-12 32z" fill="' + p.accent + '"/><path d="M97 128q-3-30-15-38l-8 6q10 10 12 32z" fill="' + p.accent + '"/><path d="M46 92q18 12 36 0l5 7q-23 13-46 0z" fill="' + p.accent + '"/><circle cx="64" cy="106" r="2.4" fill="' + p.clothDark + '"/><circle cx="64" cy="116" r="2.4" fill="' + p.clothDark + '"/>' }
  ];

  /* 躯干底版（卫衣/上衣通用轮廓），颜色用色板 cloth。 */
  function torso(p, who) {
    return '<path d="M33 128v-16c0-13 9-22 21-25l4 5c1 2 3 3 6 3s5-1 6-3l4-5c12 3 21 12 21 25v16z" fill="' + p.cloth + '"/>';
  }
  /* 胸前小芽徽章（与 sprout 原型同一株芽——「幼芽长大后」的呼应），默认款带。 */
  function sproutBadge(p) {
    return '<path d="M64 120v-8" stroke="#276148" stroke-width="2" stroke-linecap="round"/><path d="M64 114c-4 0-6.4-2.8-6.4-6 4.2 0 6.4 2.8 6.4 6z" fill="#6f9c85"/><path d="M64 113c4 0 6.4-2.8 6.4-6-4.2 0-6.4 2.8-6.4 6z" fill="#276148"/>';
  }

  /* ---------- 配饰（accessory）：8 款（含「无」） ---------- */
  const ACCESSORIES = [
    { id: 'none', zh: '无', unlock: { kind: 'default' }, draw: () => '' },
    { id: 'hairpin', zh: '叶发卡', unlock: { kind: 'default' },
      draw: p => '<path d="M37 34c-5-2-7-7-6-12 5 1 8 5 8 10z" fill="#4a7c59"/><path d="M38 33l-3-7" stroke="#276148" stroke-width="1.8" stroke-linecap="round"/>' },
    { id: 'glasses', zh: '圆框眼镜', unlock: { kind: 'level', value: 2 },
      draw: p => '<g fill="none" stroke="#3a3a3a" stroke-width="2"><circle cx="52" cy="52" r="9"/><circle cx="76" cy="52" r="9"/><path d="M61 52h6M43 50l-6-2M85 50l6-2"/></g>' },
    { id: 'headphones', zh: '耳机', unlock: { kind: 'coins', value: 60 },
      draw: p => '<path d="M32 52a32 32 0 0 1 64 0" fill="none" stroke="' + p.accent + '" stroke-width="4"/><rect x="26" y="48" width="12" height="20" rx="6" fill="' + p.accent + '"/><rect x="90" y="48" width="12" height="20" rx="6" fill="' + p.accent + '"/>' },
    { id: 'cap', zh: '棒球帽', unlock: { kind: 'achievement', value: 'active-10h' },
      draw: p => '<path d="M32 42a32 26 0 0 1 64 0z" fill="' + p.clothDark + '"/><path d="M30 42h50q14 0 16 6H30z" fill="' + p.cloth + '"/><circle cx="64" cy="30" r="3" fill="' + p.accent + '"/>' },
    { id: 'scarf', zh: '围巾', unlock: { kind: 'coins', value: 35 },
      draw: p => '<path d="M46 88q18 10 36 0l3 10q-21 10-42 0z" fill="' + p.accent + '"/><path d="M84 92l6 22-10-2z" fill="' + p.accent + '" opacity=".85"/>' },
    /* v4.5 Batch 9（交接 I：资产继续扩充，6→8 款，仍在 D2 的 6–10 区间） */
    { id: 'flower', zh: '小花头饰', unlock: { kind: 'achievement', value: 'streak-3' },
      draw: p => '<g><circle cx="88" cy="25" r="3.6" fill="' + p.accent + '"/><circle cx="92.8" cy="28.5" r="3.6" fill="' + p.accent + '"/><circle cx="91" cy="34" r="3.6" fill="' + p.accent + '"/><circle cx="85" cy="34" r="3.6" fill="' + p.accent + '"/><circle cx="83.2" cy="28.5" r="3.6" fill="' + p.accent + '"/><circle cx="88" cy="29.5" r="2.6" fill="#f2d98b"/></g>' },
    { id: 'bowtie', zh: '小领结', unlock: { kind: 'level', value: 6 },
      draw: p => '<path d="M64 91l-8-4.5v9z" fill="' + p.accent + '"/><path d="M64 91l8-4.5v9z" fill="' + p.accent + '"/><circle cx="64" cy="91" r="2.6" fill="' + p.clothDark + '"/>' }
  ];

  /* ---------- 图层顺序（Humation layerSlot 思路的本站固定版） ----------
   * 从后到前：脑后长发 → 手臂/身体底 → 服装 → 脖子 → 头 → 脸(腮红/眼/嘴) →
   * 刘海/顶部发 → 配饰。固定顺序保证任何组合都不穿帮。 */
  function build(look, mood) {
    const l = sanitizeLook(look);
    const p = PALETTE_BY_ID[l.palette] || PALETTE_BY_ID[DEFAULT_PALETTE_ID];
    const who = l.body;
    const hair = findPart(HAIRS, l.hair) || HAIRS[0];
    const outfit = findPart(OUTFITS, l.outfit) || OUTFITS[0];
    const acc = findPart(ACCESSORIES, l.accessory) || ACCESSORIES[0];
    const m = MOODS.includes(mood) ? mood : 'normal';
    const blush = p.blush
      ? '<ellipse cx="42" cy="61" rx="4.8" ry="2.8" fill="' + p.blush + '" opacity=".5"/><ellipse cx="86" cy="61" rx="4.8" ry="2.8" fill="' + p.blush + '" opacity=".5"/>'
      : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">'
      + hair.back(p, who)
      + bodyBase(p, who)
      + outfit.draw(p, who)
      + '<rect x="57" y="76" width="14" height="14" rx="4" fill="' + p.skinShade + '"/>'
      + '<circle cx="64" cy="50" r="33" fill="' + p.skin + '"/>'
      + '<ellipse cx="64" cy="80" rx="7" ry="3" fill="' + p.skinShade + '" opacity=".5"/>'
      + blush
      + eyesFor(m, p)
      + mouthFor(m, p)
      + hair.front(p, who)
      + acc.draw(p, who)
      + moodExtra(m)
      + '</svg>';
  }

  /* 小图标：同一张脸的头部裁切（viewBox 裁剪，不另画一套）。 */
  function icon(look) {
    return build(look, 'normal')
      .replace('width="128" height="128" viewBox="0 0 128 128"', 'width="64" height="64" viewBox="24 6 80 80"');
  }

  function findPart(list, id) {
    return list.find(item => item.id === id) || null;
  }

  /* ---------- 选择白名单清洗（交接 D1：档案只存部件 id / 色板，非法回落默认） ----------
   * 每个槽只接受目录里存在的 id；body 只接受 boy/girl；非法/缺失一律回落默认。
   * 这是纯函数，progress.js 持久化前调用一次，UI 渲染前也可调用，口径一致。 */
  const DEFAULT_LOOK = { body: DEFAULT_BODY, hair: 'short', outfit: 'hoodie', accessory: 'none', palette: DEFAULT_PALETTE_ID };
  function sanitizeLook(look) {
    const l = (look && typeof look === 'object' && !Array.isArray(look)) ? look : {};
    const inList = (list, id, fallback) => (typeof id === 'string' && list.some(item => item.id === id) ? id : fallback);
    return {
      body: BODY_IDS.includes(l.body) ? l.body : DEFAULT_BODY,
      hair: inList(HAIRS, l.hair, DEFAULT_LOOK.hair),
      outfit: inList(OUTFITS, l.outfit, DEFAULT_LOOK.outfit),
      accessory: inList(ACCESSORIES, l.accessory, DEFAULT_LOOK.accessory),
      palette: inList(PALETTES, l.palette, DEFAULT_LOOK.palette)
    };
  }

  /* 少女默认发型是波波头，少年是短发——按体型给一个协调的默认。 */
  function defaultLookFor(body) {
    const b = BODY_IDS.includes(body) ? body : DEFAULT_BODY;
    return Object.assign({}, DEFAULT_LOOK, { body: b, hair: b === 'girl' ? 'bob' : 'short' });
  }

  /* ---------- 持久化只存「装扮四槽」（交接 D1：档案只存部件 id / 色板） ----------
   * body（体型）不在装扮里持久化——它由装备的人形形象（odin-boy→少年 /
   * odin-girl→少女）决定，是两个继续存在的基础体型（交接 D2），不与装扮四槽
   * 制造第二事实源。companionLook 因此只有 hair / outfit / accessory / palette。 */
  const DRESS_SLOTS = ['hair', 'outfit', 'accessory', 'palette'];
  const DEFAULT_DRESS = { hair: 'short', outfit: 'hoodie', accessory: 'none', palette: DEFAULT_PALETTE_ID };
  function sanitizeDress(dress) {
    const d = (dress && typeof dress === 'object' && !Array.isArray(dress)) ? dress : {};
    const inList = (list, id, fallback) => (typeof id === 'string' && list.some(item => item.id === id) ? id : fallback);
    return {
      hair: inList(HAIRS, d.hair, DEFAULT_DRESS.hair),
      outfit: inList(OUTFITS, d.outfit, DEFAULT_DRESS.outfit),
      accessory: inList(ACCESSORIES, d.accessory, DEFAULT_DRESS.accessory),
      palette: inList(PALETTES, d.palette, DEFAULT_DRESS.palette)
    };
  }
  /* 少女默认波波头、少年默认短发（装备人形时若还没存过装扮，用它做协调默认）。 */
  function defaultDressFor(body) {
    return Object.assign({}, DEFAULT_DRESS, { hair: body === 'girl' ? 'bob' : 'short' });
  }

  /* UI 用的清单（picker 直接读它渲染槽位与选项，不在 UI 里另写判定）。
   * 装扮 picker 展示四个装扮槽（发型/服装/配饰/色板）；体型（少年/少女）由
   * 「学习伙伴形象」picker 装备 odin-boy/odin-girl 决定，不在装扮 picker 里。 */
  function manifest() {
    return {
      version: 1,
      slots: [
        { id: 'hair', zh: '发型', options: HAIRS.map(h => ({ id: h.id, zh: h.zh, unlock: h.unlock })) },
        { id: 'outfit', zh: '服装', options: OUTFITS.map(o => ({ id: o.id, zh: o.zh, unlock: o.unlock })) },
        { id: 'accessory', zh: '配饰', options: ACCESSORIES.map(a => ({ id: a.id, zh: a.zh, unlock: a.unlock })) },
        { id: 'palette', zh: '色板', options: PALETTES.map(p => ({ id: p.id, zh: p.zh, unlock: p.unlock, swatch: [p.hair, p.cloth, p.accent] })) }
      ],
      bodies: BODIES.slice(),
      moods: EXPRESSIONS.slice()
    };
  }

  /* 各类目录直接暴露，供 progress.js 白名单校验与 UI 解锁判定复用同一份数据。 */
  return {
    version: 1,
    PALETTES, BODIES, BODY_IDS, HAIRS, OUTFITS, ACCESSORIES, EXPRESSIONS, MOODS,
    DEFAULT_LOOK, DEFAULT_DRESS, DRESS_SLOTS, DEFAULT_PALETTE_ID, DEFAULT_BODY,
    build, icon, sanitizeLook, sanitizeDress, defaultLookFor, defaultDressFor, manifest, findPart
  };
})();
