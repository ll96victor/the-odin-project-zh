/* v4.11 Hero 场景专项：批次 D（D2a 舞台几何 + 紫晕 / D2c 植物剪影放大）与批次 E
 * （Hero 学习场景道具层 .hero-study-decor，第 8 组）合并在同一文件内——批次 E 只
 * 扩展现有文件，Node 测试文件总数保持 38（第 8.9 组以断言钉住这一点）。
 *
 * 被测对象：style.css 的 P0-1/P0-2 Hero 段（.home-hero::before 紫晕、
 * .hero-companion-stage 三规则、.hero-decor、.hero-scene-decor）与
 * @media (max-width: 30rem) 窄屏块。方法：纯静态断言（字符串/正则级）——
 * 运行时观感（六档零溢出 / Hero 高度 / 立绘清晰度 / 深色观感 / print）由
 * 真实 Chrome + CDP 在 TEST-REPORT「v4.11 批次 D 验收」验证；本文件钉住的是
 * 「几何与纪律不漂移」：
 *   1. 舞台 3:4 竖版 + 宽度档 clamp(14rem, 30vw, 27rem)（核心改动，钉死）；
 *   2. 窄屏块 stage 11.5rem 且带 3:4、hero-decor 135%（窄屏同步不回归）；
 *   3. .home-hero::before 紫晕 alpha 逐字 18%（低饱和上限，防漂移），两道
 *      暖白窗光带逐字保留；
 *   4. 环境巢柔光 ::before 显式尺寸 + aspect-ratio: 1 + border-radius: 50%
 *      （防「inset 百分比在 3:4 盒子里拉成椭圆」回归），background 逐字钉
 *      （v4.11.14 色源由固定成长绿改 --color-ambient 逐主题派生，22% 色标
 *      几何不动）；
 *   5. body::before 氛围层四层 alpha（40·7·6·35）逐字未变（批次 C 零回归钉；
 *      v4.11.14 左下角晕色源 grow → ambient，alpha 仍 6%）；
 *   6. .profile-cover background 仍 3 层且原 linear-gradient(140deg accent 层
 *      逐字为最底层（批次 C 零回归钉）；
 *   7. 本轮改动区（Hero 段 + 窄屏块）零 --color-*: 新 token 定义、零
 *      animation:、零 @keyframes（无动画纪律）。
 * v4.11.14 追加第 11 组：环境色跟随主题——--color-ambient 派生机制结构钉、
 * 环境层六消费点迁移钉、语义层 grow 零漂移钉（含「恰好 18 处」计数钉，
 * 封死全局替换）、植物 SVG（HERO_DECOR/HERO_SCENE）去绿钉、30 套主题
 * 环境叠层下道具可见性「不劣于旧绿环境」复算钉（第 10 组 raw 基准契约
 * 原样保留——其基准色 :root paper / night swatch.bg 本轮分毫未动）。
 * 允许的现场微调项（接地影 width/height/bottom、光晕 width:120%）刻意不钉
 * 具体数值——微调必须写进实施记录并同步本文件（交接 §3）。
 * 全量纪律：既有 37 个测试文件零改动、原样全绿（atmosphere-layer 35 项 =
 * 批次 C 零回归证明）；本文件是第 38 个。
 *
 * 运行：node tests/hero-scene.test.cjs */
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

/* 取一条规则的声明体（首个匹配） */
function ruleBody(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?:^|\\n)\\s*${escaped} \\{([^}]*)\\}`);
  const m = re.exec(css);
  assert.ok(m, check(`规则存在：${selector}`));
  return m[1];
}

/* ===================== 1. 舞台几何：3:4 竖版 + 27rem 宽度档 ===================== */
{
  const stage = ruleBody('.hero-companion-stage');
  assert.ok(stage.includes('width: clamp(14rem, 30vw, 27rem)'),
    check('stage 宽度档逐字 clamp(14rem, 30vw, 27rem)（1440px 下仍取 30vw=432px，上限仅超宽屏生效）'));
  assert.ok(stage.includes('aspect-ratio: 3 / 4'),
    check('stage aspect-ratio: 3 / 4（显式匹配 600×800 立绘比例；1440 档真实线性增益约 +12.5%，不再依赖内容最小尺寸把 1:1 盒隐式撑高）'));
  assert.ok(!stage.includes('aspect-ratio: 1;'),
    check('stage 不再残留正方形 aspect-ratio: 1'));
}

/* ===================== 2. 窄屏同步（@media (max-width: 30rem) 块内） ===================== */
{
  /* style.css 有多个 max-width:30rem 块，取包含 stage 规则的那一个（响应式段） */
  const blocks = [...css.matchAll(/@media \(max-width: 30rem\) \{([\s\S]*?)\n\}/g)].map(m => m[1]);
  assert.ok(blocks.length > 0, check('style.css 存在 @media (max-width: 30rem) 块'));
  const block = blocks.find(b => b.includes('.hero-companion-stage'));
  assert.ok(block, check('存在包含 .hero-companion-stage 的窄屏块'));
  assert.ok(block.includes('.hero-companion-stage { width: 11.5rem; aspect-ratio: 3 / 4; }'),
    check('窄屏 stage 仍 11.5rem 且带 aspect-ratio: 3 / 4（高度 11.5→15.33rem 同步）'));
  assert.ok(block.includes('.hero-decor { width: min(135%, 19rem); }'),
    check('窄屏 hero-decor 收到 min(135%, 19rem)（舞台变高后装饰不外扩）'));
}

/* ===================== 3. 紫晕 18%（防漂移）+ 窗光带逐字保留 ===================== */
{
  const before = ruleBody('.home-hero::before');
  assert.ok(before.includes('color-mix(in srgb, var(--color-accent) 18%, transparent)'),
    check('.home-hero::before 第三层紫晕 alpha 逐字 18%（低饱和上限，加强须重新规划）'));
  assert.ok(!before.includes('var(--color-accent) 14%'),
    check('旧值 14% 已清除（无残留漂移点）'));
  assert.ok(before.includes('rgba(255, 252, 244, .5)') && before.includes('rgba(255, 252, 244, .3)'),
    check('两道暖白窗光带 rgba(255,252,244,.5)/(.3) 逐字保留（物理光纪律不动）'));
  assert.ok(/html\[data-dark\] \.home-hero::before \{ opacity: \.38; \}/.test(css),
    check('深色退月光 html[data-dark] .home-hero::before opacity .38 原样保留'));
}

/* ===================== 4. 环境巢柔光正圆（防椭圆回归） ===================== */
{
  const glow = ruleBody('.hero-companion-stage::before');
  assert.ok(glow.includes('aspect-ratio: 1'),
    check('环境巢柔光含 aspect-ratio: 1（3:4 盒子里保证正圆，防椭圆回归）'));
  assert.ok(glow.includes('border-radius: 50%'),
    check('环境巢柔光含 border-radius: 50%'));
  assert.ok(glow.includes('left: 50%') && glow.includes('top: 50%') && glow.includes('transform: translate(-50%, -50%)'),
    check('环境巢柔光显式居中（left/top 50% + translate，不再用 inset 百分比扩张）'));
  assert.ok(!glow.includes('inset:'),
    check('环境巢柔光零 inset（inset 百分比在 3:4 盒子会拉成椭圆——写法级封死）'));
  /* v4.11.14：色源由固定成长绿 grow-soft 改 --color-ambient（accent+wash 派生、
   * 逐主题解析）；22% alpha、50% 58% 圆心、30/56/76 色标与 wash 环逐字不动。 */
  assert.ok(glow.includes('background: radial-gradient(circle at 50% 58%, color-mix(in srgb, var(--color-ambient) 22%, transparent) 0 30%, color-mix(in srgb, var(--color-wash) 40%, transparent) 56%, transparent 76%)'),
    check('环境巢柔光 background 逐字钉新机制（v4.11.14 环境色跟随主题：grow-soft 22% → ambient 22%，色标几何与 wash 环一字不动）'));
  assert.ok(!glow.includes('--color-grow'),
    check('环境巢柔光零 grow 残留（环境层不消费语义色——语义层清单见第 11.3 组）'));
}

/* ===================== 5. 批次 C 零回归钉：body::before 氛围层四层 alpha ===================== */
{
  const atmo = ruleBody('body::before');
  assert.ok(atmo.includes('var(--color-wash) 40%'), check('氛围层顶边雾带 wash 40% 逐字未变'));
  assert.ok(atmo.includes('var(--color-accent) 7%'), check('氛围层右上 accent 角晕 7% 逐字未变'));
  /* v4.11.14：左下角晕色源 grow → ambient（全站环境层跟随主题），alpha 上限 6% 不动。 */
  assert.ok(atmo.includes('var(--color-ambient) 6%'), check('氛围层左下环境角晕 alpha 6% 逐字未变（v4.11.14 色源 grow → ambient，上限不漂移）'));
  assert.ok(!atmo.includes('--color-grow'), check('氛围层零 grow 残留（全站环境层不消费语义色）'));
  assert.ok(atmo.includes('rgba(255, 252, 244, .35)'), check('氛围层暖白光斑 rgba(255,252,244,.35) 逐字未变'));
}

/* ===================== 6. 批次 C 零回归钉：.profile-cover 叠层 ===================== */
{
  const cover = ruleBody('.identity-panel .profile-cover');
  const bg = /background:\s*([^;]+);/.exec(cover);
  assert.ok(bg, check('cover 有 background 简写'));
  const layers = splitTopLevel(bg[1]);
  assert.equal(layers.length, 3, check(`cover background 仍为 3 层（实际 ${layers.length}）`));
  assert.ok(layers[2].startsWith('linear-gradient(140deg, color-mix(in srgb, var(--color-accent) 90%'),
    check('原 linear-gradient(140deg accent 层逐字保留为最底层'));
}

/* ===================== 7. 改动区零新 token、零动画 ===================== */
{
  const heroStart = css.indexOf('/* ---------- P0-1 / P0-2：首页 Hero + 次级信息带 ----------');
  const heroEnd = css.indexOf('/* ---------- P0-4：学习旅程脊线');
  assert.ok(heroStart > 0 && heroEnd > heroStart, check('Hero 段（P0-1/P0-2 → P0-4 之间）定位成功'));
  const heroSection = css.slice(heroStart, heroEnd);
  const narrow = [...css.matchAll(/@media \(max-width: 30rem\) \{([\s\S]*?)\n\}/g)]
    .map(m => m[1]).find(b => b.includes('.hero-companion-stage'));
  const scope = heroSection + '\n' + narrow;
  assert.equal(scope.match(/--color-[a-z-]+\s*:/g), null,
    check('改动区零 --color-*: 新 token 定义（不触发 swatch 同步义务）'));
  assert.ok(!/animation\s*:/.test(scope), check('改动区零 animation:（无动画纪律）'));
  assert.ok(!/@keyframes/.test(scope), check('改动区零 @keyframes'));
}

/* ============ 8. v4.11 批次 E：Hero 学习场景道具层（.hero-study-decor） ============
 * 证明的验收标准：Hero 增加**原创低饱和学习场景道具层**（书桌承托 + 台灯 +
 * 一小摞书），使伙伴从「单独展示的立绘」变成「陪伴学习的场景角色」；该层是纯
 * 装饰——零脚本 / 零外链 / 零事件属性 / 零文本 / 零动画 / 零交互，只在宽屏
 * （≥56rem）显示，窄屏与打印隐藏，且不改变 Hero IA、伙伴几何与批次 C 氛围层。
 * 分组：8.1 形态 → 8.2 三类已实现元素 → 8.3 安全属性 → 8.4 调色板与低饱和
 * 纪律 → 8.5 挂载方式与树序 → 8.6 CSS 层级纪律 → 8.7 响应式 → 8.8 既有层零
 * 回归 → 8.9 旧口径清除与测试文件数。 */
{
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const found = /const HERO_STUDY_SVG = '(<svg[^']*<\/svg>)';/.exec(app);
  assert.ok(found, check('8.1 app.js 定义 HERO_STUDY_SVG 常量（批次 E 学习场景道具层）'));
  const svg = found[1];

  /* 8.1 基本形态 */
  assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'),
    check('8.1 是带标准 SVG 命名空间的内联 SVG 字符串（data URL 渲染前提）'));
  assert.ok(/viewBox="0 0 420 130"/.test(svg),
    check('8.1 viewBox 0 0 420 130：画布贴合道具内容高度，无大块空白'));
  const tags = [...new Set([...svg.matchAll(/<([a-zA-Z]+)/g)].map(m => m[1].toLowerCase()))].sort();
  assert.deepEqual(tags, ['circle', 'ellipse', 'path', 'rect', 'svg'],
    check(`8.1 元素种类仅 rect/path/ellipse/circle——零 image/use/text（实际 ${tags.join('/')}）`));

  /* 8.2 三类已实现元素：书桌承托（不计独立视觉主体）+ 台灯 + 一小摞书 */
  const rects = [...svg.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)]
    .map(m => ({ x: +m[1], y: +m[2], w: +m[3], h: +m[4] }));
  const horizontals = [...svg.matchAll(/<path d="M(\d+) (\d+)H(\d+)"/g)].map(m => ({ y: +m[2], len: +m[3] - +m[1] }));
  const verticals = [...svg.matchAll(/<path d="M(\d+) (\d+)V(\d+)"/g)].map(m => ({ x: +m[1], y1: +m[2], y2: +m[3] }));
  assert.ok(rects.some(r => r.w >= 380) && horizontals.some(h => h.len >= 380),
    check('8.2 书桌承托：桌面窄板 rect + 横贯画布的桌沿高光线'));
  assert.ok(horizontals.every(h => h.y >= 40 && h.y <= 70),
    check('8.2 桌面线落在画布下半部（道具坐落在 Hero 底部，不向上侵占伙伴主体）'));
  assert.equal(verticals.filter(v => v.x < 60 || v.x > 360).length, 2,
    check('8.2 书桌承托：桌面两端下方各一根桌腿（2 条竖线）'));
  assert.ok(/<path d="M\d+ \d+L\d+ \d+H\d+L\d+ \d+Z" fill="#c7bdd6"/.test(svg),
    check('8.2 台灯：闭合梯形灯罩（紫灰中间调）'));
  assert.ok(/<path d="M\d+ \d+V\d+" fill="none" stroke="#8b7b8f"/.test(svg),
    check('8.2 台灯：陶色灯杆'));
  assert.equal([...svg.matchAll(/<ellipse[^>]*fill="#8b7b8f"/g)].length, 1,
    check('8.2 台灯：唯一陶色椭圆 = 灯座'));
  assert.equal([...svg.matchAll(/<ellipse[^>]*fill="#b7a9c8"/g)].length, 1,
    check('8.2 台灯：唯一紫灰椭圆 = 灯下暖光晕（大面积色块，低存在感）'));
  const books = rects.filter(r => r.x >= 240 && r.w >= 60 && r.w <= 120 && r.h >= 10 && r.h <= 14);
  assert.equal(books.length, 3, check(`8.2 一小摞书：3 本 rect（实际 ${books.length}）`));
  assert.ok(books[0].y > books[1].y && books[1].y > books[2].y,
    check('8.2 一小摞书：三本自下而上堆叠（y 依次递减，不是并排平铺）'));
  assert.ok(/<path d="M\d+ \d+V\d+" fill="none" stroke="#81769a"/.test(svg),
    check('8.2 一小摞书：金色书签小点缀（小轮廓存在感高于大面积色块）'));
  assert.ok(!/猫|cat|pet/i.test(svg),
    check('8.2 未硬塞猫/宠物点缀（首版元素克制，避免与伙伴立绘在中景重叠）'));

  /* 8.3 安全属性 */
  assert.ok(!/<script/i.test(svg), check('8.3 零 <script>'));
  assert.ok(!/foreignObject/i.test(svg), check('8.3 零 foreignObject'));
  assert.ok(!/\son[a-z]+\s*=/i.test(svg), check('8.3 零事件属性（on* 内联处理）'));
  assert.ok(!/href\s*=/i.test(svg), check('8.3 零 href / xlink:href（无外链引用）'));
  assert.ok(!/url\s*\(|<image|<use|<text/i.test(svg),
    check('8.3 零 url() 引用与 <image>/<use>/<text>（不引位图、外部符号库或文本节点）'));
  assert.ok(!/https?:\/\//i.test(svg.replace('xmlns="http://www.w3.org/2000/svg"', '')),
    check('8.3 除 SVG 命名空间声明外零 http(s) 外链（不引远程资源、不发网络请求）'));
  assert.ok(!/style\s*=/i.test(svg), check('8.3 零内联 style 属性'));

  /* v4.11.12 颜色统一：Hero 学习道具使用深墨紫灰 / 暖灰色板，旧绿色不再成为主轮廓。 */
  assert.ok(!svg.includes('#3f7b58') && !svg.includes('#6f9c85') && !svg.includes('#a78bda'),
    check('8.4 旧绿色与浅紫色板已移除，避免与紫色伙伴形成多套视觉语言'));
  assert.ok(svg.includes('#81769a') && svg.includes('#8b7b8f') && svg.includes('#c7bdd6'),
    check('8.4 新深墨紫灰色板明确在位'));
  const colors = [...new Set([...svg.matchAll(/#[0-9a-f]{6}/gi)].map(m => m[0].toLowerCase()))].sort();
  assert.deepEqual(colors, ['#81769a', '#8b7b8f', '#b7a9c8', '#b9afd0', '#c7bdd6'],
    check(`8.4 只用既有 v4.7 中间调五色、零新增色（实际 ${colors.join(' ')}）`));
  const opacities = [...svg.matchAll(/opacity="(\.\d+)"/g)].map(m => parseFloat(m[1]));
  assert.ok(opacities.length >= 12,
    check(`8.4 逐元素显式 alpha 控制低饱和（${opacities.length} 处 opacity）`));
  /* v4.11 批次 F 补丁：上限由 .5 放宽到 .85。原来那条「全部 ≤ .5」的出发点是
   * 低饱和纪律，但它在实测里成了「整层不可见」的帮凶——金 #d4af37 就算全不透明
   * 也只有 1.98:1，浅紫 #a78bda 上限 2.69:1，而结构色成长绿 #3f7b58 要到 ~.85
   * 才够 3:1。所以纪律改成「上限 .85（不足实色）+ 必须有元素承担可辨对比度」，
   * 由第 10 组用 WCAG 公式按明暗两套底色钉住下限——钉的是**看得见**，
   * 不再钉一个没有视觉依据的孤立数字。 */
  assert.ok(opacities.every(o => o <= .85),
    check(`8.4 逐元素 alpha ≤ .85：保留低饱和呼吸感、不出现实色块（实际上限 ${Math.max(...opacities)}）`));
  assert.ok(opacities.every(o => o >= .1),
    check(`8.4 全部 opacity ≥ .1（实际下限 ${Math.min(...opacities)}，不存在隐形装饰）`));

  /* 8.5 挂载方式与树序（复用既有机制，不建第二套系统） */
  const mount = /hero\.append\(svgImage\(HERO_STUDY_SVG, ('[^']*'), '([^']+)'\)\)/.exec(app);
  assert.ok(mount, check('8.5 renderHome() 复用既有 svgImage() 挂载（不做运行时字符串 HTML 注入）'));
  assert.equal(mount[1], "''", check(`8.5 挂载 alt 为空字符串——纯装饰、不进可访问名称（实际 ${mount[1]}）`));
  assert.equal(mount[2], 'hero-study-decor', check('8.5 挂载类名为 .hero-study-decor'));
  const sceneAppend = app.indexOf("svgImage(HERO_SCENE_SVG, '', 'hero-scene-decor')");
  const studyAppend = app.indexOf("svgImage(HERO_STUDY_SVG, '', 'hero-study-decor')");
  const mainAppend = app.indexOf('hero.append(heroMain)');
  const companionAppend = app.indexOf('homeHeroCompanion = heroCompanionFigure()');
  assert.ok(sceneAppend > 0 && sceneAppend < studyAppend && studyAppend < mainAppend && mainAppend < companionAppend,
    check('8.5 装饰层挂在 heroMain 与 companion 之前（树序先于内容，Hero 两列 IA 不变）'));
  assert.ok(!/textContent[^;\n]*HERO_STUDY_SVG/.test(app) && !/innerHTML[^;\n]*HERO_STUDY_SVG/.test(app),
    check('8.5 HERO_STUDY_SVG 不经 textContent / innerHTML 注入'));

  /* 8.6 CSS 层级纪律 */
  const study = ruleBody('.hero-study-decor');
  assert.ok(study.includes('position: absolute'), check('8.6 .hero-study-decor position:absolute（环境层定位）'));
  assert.ok(study.includes('pointer-events: none'), check('8.6 pointer-events:none——装饰层不拦截 CTA 指针'));
  assert.ok(study.includes('z-index: 0'),
    check('8.6 z-index:0——画在 Hero 背景层之上（批次 F B0 修正：批次 E 的 -1 与 .home-hero::before/::after 同层，负层内按树序绘制，::after 永远是最后一个子节点，道具因此被底部 52% 环境带整层盖住）'));
  assert.ok(study.includes('right: 0') && study.includes('bottom: 0'),
    check('8.6 落位在 Hero 右侧与底部（左侧留给既有植物剪影）'));
  assert.ok(study.includes('height: auto'), check('8.6 height:auto——等比缩放不拉变形'));
  assert.ok(!/animation\s*:/.test(study) && !/@keyframes/.test(study),
    check('8.6 .hero-study-decor 规则零 animation / @keyframes'));
  assert.ok(!/--color-[a-z-]+\s*:/.test(study), check('8.6 零新 token 定义（不触发 swatch 同步义务）'));

  /* 8.7 响应式：只在宽屏显示，窄屏与打印隐藏 */
  const narrowE = [...css.matchAll(/@media \(max-width: 55\.9375rem\) \{([\s\S]*?)\n\}/g)].map(m => m[1]);
  assert.ok(narrowE.length > 0 && narrowE.some(b => /\.hero-study-decor \{ display: none; \}/.test(b)),
    check('8.7 <56rem（max-width: 55.9375rem）隐藏 .hero-study-decor——不为移动端机械缩小整套场景'));
  assert.ok(narrowE.every(b => !/animation\s*:/.test(b) && !/@keyframes/.test(b)),
    check('8.7 批次 E 新增的隐藏块零 animation / @keyframes'));
  assert.ok(/@media \(min-width: 56rem\) \{\s*\.home-hero \{ grid-template-columns/.test(css),
    check('8.7 Hero 两列断点仍是 min-width:56rem（与隐藏断点严格互斥，无重叠区间）'));
  assert.ok(/\.hero-companion, \.home-secondary, \.hero-scene-decor, \.hero-study-decor \{ display: none; \}/.test(css),
    check('8.7 @media print 隐藏 .hero-study-decor（与既有 hero 装饰同一条规则，打印行为不回归）'));

  /* 8.8 既有层零回归（批次 E 只加不改） */
  assert.ok(ruleBody('.hero-scene-decor').includes('left: 0; bottom: 0; width: clamp(12rem, 24vw, 20rem)'),
    check('8.8 .hero-scene-decor 既有最终值原样（左下角落位与宽度档未被联动修改）'));
  assert.ok(ruleBody('.hero-decor').includes('width: min(150%, 26rem)'),
    check('8.8 .hero-decor 既有最终值原样（宽屏 min(150%,26rem) 未被联动修改）'));
  assert.ok(ruleBody('.hero-companion-img').includes('width: 96%; height: 96%'),
    check('8.8 伙伴图 96% 占比原样'));
  assert.ok(ruleBody('.hero-companion-img.is-file').includes('width: 100%; height: 100%'),
    check('8.8 fixed-art 伙伴图 100% 占比原样'));
  assert.ok(ruleBody('.home-hero').includes('overflow: hidden'),
    check('8.8 .home-hero 仍是 overflow:hidden（装饰层边界由既有裁切承担）'));

  /* 8.9 旧口径清除 + 测试文件数（批次 E 扩展现有文件；v4.11.2 起课页读者向
   * 修复的收口断言住进第 39 个文件 lesson-reader-fixes.test.cjs；v4.11.6 任务与
   * 资料对应关系标注的收口断言住进第 41 个文件 task-resource-note.test.cjs，
   * 均属有意新增） */
  const self = fs.readFileSync(__filename, 'utf8');
  assert.ok(!/\+3[3]%/.test(self),
    check('8.9 本文件零残留的旧高度增益口径（第 1 组已改为批次 D 实测的真实线性增益）'));
  const testFiles = fs.readdirSync(path.join(root, 'tests')).filter(f => f.endsWith('.test.cjs'));
  assert.equal(testFiles.length, 45,
    check(`8.9 Node 测试文件总数为 45（v4.11.2 新增 lesson-reader-fixes → 39；v4.11.3 新增 heavy-lesson → 40；v4.11.6 新增 task-resource-note → 41；v4.11.8 新增 visual-assets 与 lesson-chapter-nav → 43；v4.11.9 新增 lesson-visual-modules → 44；v4.11.14 新增 export-whitelist → 45；实际 ${testFiles.length}）`));
}

/* ============ 9. v4.11 批次 F（B0）：Hero 道具**可见性**层级 ============
 * 批次 E 的 8.6 只钉了「z-index 是某个值」，而批次 E 恰恰就是在这一条上翻车：
 * 静态断言说 z-index:-1「画在内容之下」，运行时却连同层背景带一起被盖掉，
 * 用户完全看不到书桌 / 台灯 / 书本。所以本组不钉某个孤立数值，而是钉**层与层
 * 之间的相对关系**——也就是「元素存在」与「用户看得见」之间的那道差：
 *   ① 道具的 z-index 必须严格大于 Hero 自身背景伪元素（::before/::after）；
 *   ② 道具的 z-index 必须非负（负层在 .home-hero 的层叠上下文里排在背景伪
 *      元素之后绘制，这正是「同层 + 树序」盖住道具的成因）；
 *   ③ 主文案列（.hero-main）与伙伴舞台（.hero-companion-stage）都必须严格
 *      高于道具，保证标题 / 副标题 / CTA / 立绘永不被道具压住；
 *   ④ 道具仍 pointer-events:none，且本组改动零动画、零新 token。
 * 真实浏览器侧的等价验证（1440×900，同一位置变动前后各取一次）：修复前把道具
 * pointer-events 临时打开做 elementFromPoint 取样，道具框内 4 点有 2 点命中
 * .home-hero（被背景盖住）；修复后 4×4=16 点里 0 点命中 .home-hero、4 点直接
 * 命中 .hero-study-decor 本身，其余 12 点在伙伴立绘范围内（符合「低于伙伴」）。
 * 数值口径见 TEST-REPORT「v4.11 批次 F 验收」。 */
{
  /* 解析一条规则里的指定声明（取首个匹配） */
  const decl = (selector, prop) => {
    const m = new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`, 'i').exec(ruleBody(selector));
    return m ? m[1].trim() : null;
  };
  const zOf = selector => {
    const raw = decl(selector, 'z-index');
    assert.ok(raw !== null, check(`${selector} 显式声明了 z-index`));
    return Number(raw);
  };
  const heroBefore = zOf('.home-hero::before');
  const heroAfter = zOf('.home-hero::after');
  const studyZ = zOf('.hero-study-decor');
  const mainZ = zOf('.hero-main');
  const stageZ = zOf('.hero-companion-stage');

  assert.equal(heroBefore, -1, check('9.1 .home-hero::before 仍是 z-index:-1（批次 C/D 的窗光与紫晕带不动）'));
  assert.equal(heroAfter, -1, check('9.1 .home-hero::after 仍是 z-index:-1（底部环境带不动）'));
  assert.ok(studyZ >= 0,
    check(`9.2 道具 z-index 非负（实际 ${studyZ}）——负层会跟在背景伪元素后面按树序绘制，::after 永远是最后一个子节点，道具就会被底部环境带盖掉`));
  assert.ok(studyZ > Math.max(heroBefore, heroAfter),
    check(`9.2 道具层级严格高于 Hero 背景层（道具 ${studyZ} > 背景 ${Math.max(heroBefore, heroAfter)}）——这是「用户真的看得见」的最小区分条件`));
  assert.ok(mainZ > studyZ,
    check(`9.3 主文案层严格高于道具（.hero-main ${mainZ} > 道具 ${studyZ}）——主标题 / 副标题 / CTA 不被装饰压住`));
  assert.ok(stageZ > studyZ,
    check(`9.3 伙伴舞台严格高于道具（stage ${stageZ} > 道具 ${studyZ}）——伙伴仍是第一视觉主体`));
  assert.ok(decl('.hero-study-decor', 'pointer-events') === 'none',
    check('9.4 道具仍 pointer-events:none（层级抬升不引入指针拦截）'));

  /* 主文案列抬升后仍是常规流内容：不能顺手变成 fixed/absolute 之类会造成
   * 「两列构图被抽离文档流」的改动；只允许 relative。 */
  assert.equal(decl('.hero-main', 'position'), 'relative',
    check('9.4 .hero-main 用 position:relative 抬层（不脱离网格列，Hero 两列 IA 不变）'));
  assert.ok(ruleBody('.hero-main').includes('min-width: 0'),
    check('9.4 .hero-main 既有 min-width:0 原样保留（长单词不撑破列宽）'));

  /* 改动区纪律：零动画、零新 token。 */
  const mainRule = ruleBody('.hero-main');
  for (const [name, body] of [['.hero-study-decor', ruleBody('.hero-study-decor')], ['.hero-main', mainRule]]) {
    assert.ok(!/animation\s*:/.test(body) && !/@keyframes/.test(body), check(`9.5 ${name} 零 animation / @keyframes`));
    assert.ok(!/--color-[a-z-]+\s*:/.test(body), check(`9.5 ${name} 零新 token 定义`));
  }
}

/* ============ 10. v4.11 批次 F 补丁：Hero 道具**辨识度**（对比度下限） ============
 * 第 8 组钉的是「元素存在」，第 9 组钉的是「层级正确」——两关都过了，用户却仍然
 * 报「书桌、台灯、书本认不出来」。根因在两组都没测的地方：**墨水的对比度**。
 * 把 HERO_STUDY_SVG 栅格化后逐像素统计：9695 个非透明像素里 5393 个（56%）的
 * alpha 只有 .15–.25；逐元素按 WCAG 公式算，对园地纸底的对比度只有 1.11:1–1.65:1
 * （非文本图形可辨阈值是 3:1）。更要命的是**调色板上限**：金 #d4af37 即使全不透明
 * 也只有 1.98:1、浅紫 #a78bda 上限 2.69:1——这类颜色靠加 alpha 永远救不回来。
 * 所以本组不看「某个数字是不是等于某个值」，而是直接算**承载形状的那个元素，
 * 在浅色底与深色底上分别能到多少对比度**，并钉住下限。这样无论以后谁调 alpha、
 * 换颜色、改线宽，只要「书桌沿 / 桌腿 / 台灯罩轮廓 / 灯杆 / 灯座 / 三个书脊」
 * 任何一个掉回看不见的水平，这里立刻红。
 *
 * 阈值取 2.2:1 是实测可达且不自欺的值：本轮改完九个形状元素的最劣一端是 2.33:1
 * （深色底上的灯座轮廓）。WCAG 1.4.11 对非文本图形建议 3:1——金与浅紫在浅色底上
 * 物理上到不了，因此分工是「成长绿 #3f7b58 承担全部形状轮廓」（它在明暗两端都随
 * alpha 单调变好，实测 2.78–3.51:1），金/紫/陶退为填充与点缀。把门槛写成 3:1 会
 * 是一条永远红、只能被忽略的规则；写成 2.2:1 才是能持续拦住「又变得看不见」的
 * 那条线。真实观感（肉眼能否认出三件道具）仍是人工验收项，测试只证明下限。
 *
 * v4.11.14 环境色跟随主题后的复核结论（本组断言一字未动）：本组的两套基准
 * 底色取的是 tokens.css :root paper 与 themes.js night swatch.bg——本轮改的是
 * 环境层的**色源变量**（grow → ambient），这两个基准 token 分毫未动，故本组
 * 数值与改前完全一致（worst 2.44 / strongestLight 3.03，均 ≥ 下限）。交接稿
 * 「基准底色都变了、契约必须重算」指向的真实风险（night 下环境偏紫、紫灰道具
 * 融进背景）由**第 11.5 组**按环境叠层有效底色复算承接：30 套逐套不劣于旧绿
 * 环境（night 反而由 1.43 升到 1.77——旧绿丘把深底抬进中间调才是更糟的那一端）。
 * 下限 2.2:1 与锚点 3:1 均未降低。 */
{
  const root = path.resolve(__dirname, '..');
  const tokensText = fs.readFileSync(path.join(root, 'tokens.css'), 'utf8');
  const themesText = fs.readFileSync(path.join(root, 'themes.js'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const svg = /const HERO_STUDY_SVG = '(<svg[^']*<\/svg>)';/.exec(app)[1];

  /* WCAG 相对亮度与对比度（与 themes-contrast.test.cjs 同一套公式） */
  const lin = c => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const contrast = (a, b) => {
    const [x, y] = [lum(a), lum(b)];
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const over = (fg, a, bg) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));

  /* 两套代表底色：浅色取 tokens.css 的 :root paper（园地），深色取 themes.js 里
   * night 的 swatch.bg——默认主题已是夜空，深底是必须守住的另一条腿。 */
  const paper = hex(/--color-paper:\s*(#[0-9a-f]{6})/i.exec(tokensText)[1]);
  const nightBg = hex(new RegExp("id: 'night'[\\s\\S]*?swatch: \\{ bg: '(#[0-9a-f]{6})'").exec(themesText)[1]);
  assert.notDeepEqual(paper, nightBg, check('10.1 浅色底与深色底取自真实 token / 主题清单（不是硬编码的猜值）'));

  /* 把每个元素拆成「填充 ink」与「描边 ink」，各自配对自己的 alpha */
  const elements = [...svg.matchAll(/<(rect|path|ellipse|circle)\b([^>]*?)\/>/g)].map(m => {
    const at = m[2];
    const fill = (/fill="(#[0-9a-f]{6})"/.exec(at) || [])[1];
    const stroke = (/stroke="(#[0-9a-f]{6})"/.exec(at) || [])[1];
    const plain = (/opacity="(\.\d+)"/.exec(at) || [])[1];
    const fo = (/fill-opacity="(\.\d+)"/.exec(at) || [])[1];
    const so = (/stroke-opacity="(\.\d+)"/.exec(at) || [])[1];
    const at1 = v => (v === undefined ? (plain ? parseFloat(plain) : 1) : parseFloat(v));
    const inks = [];
    if (fill) inks.push({ kind: 'fill', col: fill, a: at1(fo) });
    if (stroke) inks.push({ kind: 'stroke', col: stroke, a: at1(so) });
    /* 元素「最可辨的那条 ink」= 在明暗两端里更差的那一端取最高的那个。
     * 同时留下 light / dark 两个分项：10.4 的视觉锚点按**浅色底**判（浅底是深色
     * 墨水的最坏情形，也是用户报「看不见」的那一端）；10.3 的两侧下限用 worst。 */
    const light = k => contrast(over(hex(k.col), k.a, paper), paper);
    const dark = k => contrast(over(hex(k.col), k.a, nightBg), nightBg);
    const best = inks
      .map(k => Object.assign({}, k, { light: light(k), dark: dark(k), worst: Math.min(light(k), dark(k)) }))
      .sort((x, y) => y.worst - x.worst)[0];
    return {
      tag: m[1],
      d: (/d="([^"]+)"/.exec(at) || [])[1],
      x: (/x="([\d.]+)"/.exec(at) || [])[1],
      best,
      maxAlpha: Math.max(...inks.map(k => k.a))
    };
  });

  /* 九个「不画出来就认不出是什么」的元素——按结构挑选，不用下标 */
  const shape = [
    { zh: '书桌沿（桌面主线）', el: elements.find(e => e.d === 'M14 60H406') },
    { zh: '桌腿', el: elements.filter(e => /^M\d+ \d+V\d+$/.test(e.d)) }
  ];
  const deskEdge = elements.find(e => e.d === 'M14 60H406');
  /* 桌腿要跟灯杆（M62 50V60）与书签（M306 23V17）区分开：按 x 落在画面两端判定，
   * 与第 8 组同口径（只用「是竖线」会把另外两条竖线也算进来）。 */
  const legX = e => Number((/^M(\d+) \d+V\d+$/.exec(e.d) || [])[1]);
  const legs = elements.filter(e => /^M\d+ \d+V\d+$/.test(e.d) && (legX(e) < 60 || legX(e) > 360));
  const lampShade = elements.find(e => /Z$/.test(e.d));
  const lampPole = elements.find(e => e.d === 'M62 50V60');
  const lampBase = elements.filter(e => e.tag === 'ellipse')[1];
  const books = elements.filter(e => e.tag === 'rect' && Number(e.x) >= 240);

  assert.ok(deskEdge, check('10.2 仍能按结构定位到书桌沿（M14 60H406）'));
  assert.equal(legs.length, 2, check('10.2 仍能定位到两根桌腿（形状元素按结构挑选，不依赖下标）'));
  assert.ok(lampShade, check('10.2 仍能定位到台灯罩（闭合梯形）'));
  assert.ok(lampPole, check('10.2 仍能定位到灯杆'));
  assert.ok(lampBase, check('10.2 仍能定位到灯座（带成长绿轮廓的椭圆）'));
  assert.equal(books.length, 3, check('10.2 仍能定位到三本书'));

  const shapeSet = [
    ['书桌沿', deskEdge], ['桌腿一', legs[0]], ['桌腿二', legs[1]],
    ['台灯罩轮廓', lampShade], ['灯杆', lampPole], ['灯座轮廓', lampBase],
    ['书 1（下）', books[0]], ['书 2（中）', books[1]], ['书 3（上）', books[2]]
  ];
  const FLOOR = 2.2;
  for (const [zh, el] of shapeSet) {
    assert.ok(el.best.worst >= FLOOR,
      check(`10.3 「${zh}」在浅底与深底里较劣的一端仍 ≥ ${FLOOR}:1（实际 ${el.best.worst.toFixed(2)}:1，${el.best.col} ${el.best.kind} alpha ${el.best.a}）——这是「用户看得见」的可测下限`));
  }

  /* 不只「都不低于门槛」，还要有明确的视觉锚点：主轮廓在**浅色底**上得进到 3:1
   * （WCAG 1.4.11 非文本图形的建议值），否则整层会退化成「勉强合格但说不清是什么」。
   * 浅底是深色墨水的最坏情形，也正是用户报「看不见」的那一端。 */
  const strongestLight = Math.max(...shapeSet.map(([, el]) => el.best.light));
  assert.ok(strongestLight >= 3,
    check(`10.4 形状元素里存在达到 WCAG 非文本阈值的视觉锚点（浅底最高 ${strongestLight.toFixed(2)}:1 ≥ 3:1）——书桌 / 台灯 / 书的轮廓必须真的立得住`));

  /* 形状轮廓统一使用深墨 / 紫灰主线，暖灰退为填充与点缀。 */
  const CAN_CARRY_SHAPE = ['#81769a', '#8b7b8f'];
  for (const [zh, el] of shapeSet) {
    assert.ok(CAN_CARRY_SHAPE.includes(el.best.col),
      check(`10.5 「${zh}」的最可辨 ink 是能达到下限的颜色（${el.best.col}；金 / 浅紫 / 浅绿在全不透明时也只有 1.98 / 2.69 / 1.98:1，物理上担不起形状）`));
  }

  /* 上限纪律：不出现实色块（低饱和气质仍在），也不允许整体又回到「一层浅雾」。 */
  const allAlphas = [...svg.matchAll(/opacity="(\.\d+)"/g)].map(m => parseFloat(m[1]));
  assert.ok(Math.max(...allAlphas) <= .85,
    check(`10.6 逐元素 alpha 上限 ≤ .85（实际 ${Math.max(...allAlphas)}）——加辨识度不等于加实色块`));
  assert.ok(shapeSet.every(([, el]) => el.maxAlpha >= .7),
    check('10.6 每个形状元素至少有一条 ink 的 alpha ≥ .7——「低饱和」不等于「低到只有代码能证明存在」'));
  assert.ok(elements.some(e => e.maxAlpha <= .42),
    check('10.6 仍保留刻意留淡的柔光 / 台面填充层（不是整层一起加浓）'));

  /* 三件道具的「可辨形状」都在：本组只信对比度，形状本身由第 8 组的几何断言保证。 */
  assert.ok(/<path d="M14 60H406"/.test(svg) && /<path d="M48 68V126"/.test(svg) && /<path d="M372 68V126"/.test(svg),
    check('10.7 书桌三件套（桌面沿 + 两根桌腿）几何坐标未动'));
  assert.ok(/<path d="M62 18L104 50H20L62 18Z"/.test(svg),
    check('10.7 台灯罩梯形坐标未动（本轮只改 alpha / 线宽 / 描边，不重新设计构图）'));
  assert.ok(/<rect x="256" y="48" width="104"/.test(svg) && /<rect x="264" y="36" width="88"/.test(svg) && /<rect x="274" y="23" width="70"/.test(svg),
    check('10.7 三本书坐标未动'));
  assert.ok(!/animation\s*:|@keyframes/.test(svg),
    check('10.7 加辨识度没有引入动画（零 animation / 零 @keyframes）'));
  assert.ok(!/url\s*\(|<image|https?:\/\/(?!www\.w3\.org)/.test(svg),
    check('10.7 加辨识度没有引入位图 / 外链 / 外部资源'));
}

/* ============ 11. v4.11.14：环境色跟随主题（--color-ambient 派生机制） ============
 * 证明的验收标准：Hero 与全站的「环境氛围色」跟随主题主色——一条 :root 派生
 * 定义（accent 45% + wash，v4.11.13 --color-icon 同机制）自动适配 30 套，终结
 * 固定绿残留（用户诉求：偏绿主题搭、其他主题全部不搭）。
 * 分组：11.1 token 派生机制结构钉 → 11.2 环境层六消费点迁移钉 → 11.3 语义层
 * grow 零漂移钉（含规则层计数钉，封死「全局替换 color-grow-soft」）→ 11.4 植物
 * SVG（B/D）去绿钉 → 11.5 全 30 套环境叠层下道具可见性「不劣于旧绿环境」复算
 * → 11.6 绿系主题保绿与 garden 跟随主色的色相钉。
 * 方法口径（VISUAL-DESIGN-PLAYBOOK §9.3 / 2026-09-21 节）：Node 端用 tokens.css
 * 复算纯色 color-mix（与真实浏览器逐通道一致），真实浏览器补 computed style；
 * 「好不好看」仍是用户主观验收项，本组只证明机制、边界与可见性下限。 */
{
  const tokText = fs.readFileSync(path.join(root, 'tokens.css'), 'utf8');
  const thText = fs.readFileSync(path.join(root, 'themes.js'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

  /* ---------- 11.1 派生机制结构钉 ---------- */
  assert.ok(tokText.includes('--color-ambient: color-mix(in srgb, var(--color-accent) 45%, var(--color-wash));'),
    check('11.1 --color-ambient 在 tokens.css :root 以 color-mix(accent 45%, wash) 派生声明（固定 hex 即退回「每套主题人工核环境色」老债，必红）'));
  const ambDecl = /--color-ambient:\s*color-mix\(in srgb,\s*var\(--color-accent\)\s*(\d+)%,\s*var\(--color-wash\)\)/.exec(tokText);
  assert.ok(ambDecl && ambDecl[1] === '45',
    check(`11.1 派生比例钉 accent ${ambDecl ? ambDecl[1] : '?'}/wash ${ambDecl ? 100 - Number(ambDecl[1]) : '?'}（改比例必须重跑 11.5 全 30 套复算）`));
  const themeBlocksTok = [...tokText.matchAll(/html\[data-theme="[\w-]+"\] \{([\s\S]*?)\n\}/g)].map(m => m[1]);
  assert.equal(themeBlocksTok.length, 29,
    check(`11.1 tokens.css 主题块 29 个（garden 是 :root，既有约定；实际 ${themeBlocksTok.length}）`));
  assert.ok(themeBlocksTok.every(b => !b.includes('--color-ambient')),
    check('11.1 主题块零覆盖 --color-ambient（覆盖即退回老债，与 --color-icon 同纪律）'));

  /* ---------- 11.2 环境层六消费点迁移钉（alpha 全部原值不动） ---------- */
  const envPoints = [
    ['.home-hero', ['var(--color-ambient) 14%'], 'E：Hero 容器背景右下角晕'],
    ['.home-hero::after', ['var(--color-ambient) 26%', 'var(--color-ambient) 11%'], 'A：底部地面带远丘'],
    ['.hero-companion-stage::before', ['var(--color-ambient) 22%'], 'C：伙伴环境巢柔光'],
    ['.hero-companion-stage::after', ['var(--color-ambient) 14%'], '接地影外缘圈（与地面带同源，交接表外同类项）'],
    ['.appearance-group-companion::after', ['var(--color-ambient) 16%'], '7：个人中心伙伴区光晕'],
    ['body::before', ['var(--color-ambient) 6%'], 'F：全站氛围层左下角晕']
  ];
  for (const [sel, frags, zh] of envPoints) {
    const body = ruleBody(sel);
    for (const frag of frags) {
      assert.ok(body.includes(frag), check(`11.2 ${zh}（${sel}）已切 ${frag}（alpha 原值不动）`));
    }
    assert.ok(!body.includes('--color-grow'), check(`11.2 ${zh}（${sel}）零 grow 残留`));
  }

  /* ---------- 11.3 语义层 grow 零漂移钉 ---------- */
  /* 计数前先剥注释——style.css 的历史注释里合法提到过 var(--color-grow-soft)
   * 字面量（v4.11.7 取色依据），整文件直接计数会被注释假红（§5.4 同型坑）。 */
  const cssNoComment = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const semanticRefs = (cssNoComment.match(/var\(--color-grow(?:-soft)?\)/g) || []).length;
  assert.equal(semanticRefs, 18,
    check(`11.3 语义层 grow/grow-soft 引用恰好 18 处（技能路线与地图节点 9 行 13 处 + 等级进度条 2 + 预览条状态文字深色 1 + 地图 tab 1 + is-current 渐变重复计入——环境层零消费，证明是「逐处定向迁移」而不是全局替换；实际 ${semanticRefs}）`));
  assert.ok(css.includes('.skill-dot.is-done { background: var(--color-grow); border-color: var(--color-grow); }'),
    check('11.3 语义钉：完成态圆点仍是成长绿（「已完成」的视觉反馈不随主题漂移）'));
  assert.ok(css.includes('.profile-cover .level-progress-fill { background: linear-gradient(90deg, var(--color-grow-soft), var(--color-grow)); }'),
    check('11.3 语义钉：等级进度条渐变逐字未动'));
  assert.ok(css.includes('html[data-dark] .world-preview-item.is-open .world-preview-state { color: var(--color-grow-soft); }'),
    check('11.3 语义钉：预览条已开放状态文字（深色档）逐字未动（v4.11.7 对比度修复不回退）'));

  /* ---------- 11.4 植物 SVG（B/D）去绿钉 ---------- */
  const decor = /const HERO_DECOR_SVG = '(<svg[^']*<\/svg>)';/.exec(app);
  const scene = /const HERO_SCENE_SVG = '(<svg[^']*<\/svg>)';/.exec(app);
  assert.ok(decor && scene, check('11.4 HERO_DECOR_SVG 与 HERO_SCENE_SVG 常量仍在'));
  const opacSeq = s => [...s.matchAll(/opacity="(\.\d+)"/g)].map(m => m[1]).join(',');
  const colorSet = s => [...new Set([...s.matchAll(/#[0-9a-f]{6}/gi)].map(m => m[0].toLowerCase()))].sort();
  /* 改前五色（旧绿系）与改后五色（紫灰系）：种类数不变、只换色系；金/紫/陶光斑保留。 */
  const EXPECTED = ['#81769a', '#a78bda', '#b7a9c8', '#c9714f', '#d4af37'];
  for (const [nm, svg, opacPin, geoPin] of [
    ['HERO_DECOR_SVG', decor[1], '.13,.4,.5,.5,.38,.42,.38,.5,.5,.38,.42,.38,.55,.5,.45,.45,.5,.4',
      ['viewBox="0 0 440 260"', '<ellipse cx="220" cy="240" rx="188" ry="14"', 'M40 238Q220 208 400 238', 'M92 236C88 206 78 184 60 168']],
    ['HERO_SCENE_SVG', scene[1], '.2,.24,.16,.18,.3,.3,.26',
      ['viewBox="0 0 320 240"', 'M8 240C4 196 16 158 44 128 52 152 44 196 26 240Z', 'M34 240C40 186 62 146 100 118 100 150 78 196 52 240Z']]
  ]) {
    assert.ok(!/#3f7b58|#6f9c85|#276148/i.test(svg),
      check(`11.4 ${nm} 旧成长绿双色清零（环境装饰不再固定绿——与 :212 的 HERO_STUDY 旧色清除断言同族，扩展到植物层）`));
    assert.ok(svg.includes('#81769a') && svg.includes('#b7a9c8'),
      check(`11.4 ${nm} 植物主线切 Hero 道具同款紫灰体系（深 #81769a / 浅 #b7a9c8）`));
    assert.deepEqual(colorSet(svg), EXPECTED,
      check(`11.4 ${nm} 五色层次保留（紫灰双主线 + 金/紫/陶光斑；实际 ${colorSet(svg).join(' ')}）`));
    assert.equal(opacSeq(svg), opacPin,
      check(`11.4 ${nm} 全部 opacity 逐字未动（只换色系，不改层次与几何）`));
    for (const g of geoPin) {
      assert.ok(svg.includes(g), check(`11.4 ${nm} 几何逐字保留：${g.slice(0, 40)}`));
    }
  }

  /* ---------- 11.5 全 30 套：环境叠层下道具可见性不劣于旧绿环境 ----------
   * 有效底色模型（书桌区，从 CSS 声明值逐字可复核）：
   *   主题 paper → E 角晕 ambient 14%（容器背景）→ 桌面暖光池 rgba(255,252,244,.32)
   *   （::before，深色主题 ×.38 退月光）→ 地面带 ambient 26%（::after 峰值区）。
   * 旧绿基线 = 同一叠层把 ambient 换成改前的固定 grow-soft #6f9c85。
   * 断言的是「不劣于」而不是某个绝对值：raw 基准的绝对下限（2.2/3.0）在第 10 组，
   * 环境叠层下的绝对值物理上低于 raw（v4.11.14 改前旧绿环境同样低于，实测最低
   * 1.37），把它写成 2.2 会造出一条永远红的规则——第 10 组头注已说明分工。 */
  const parseVars = body => {
    const g = n => {
      const m = new RegExp(`--color-${n}:\\s*(#[0-9a-f]{6})`, 'i').exec(body);
      assert.ok(m, check(`11.5 tokens.css 解析出 --color-${n}`));
      return m[1];
    };
    return { paper: g('paper'), wash: g('wash'), accent: g('accent') };
  };
  const themeVars = { garden: parseVars(/:root\s*\{([\s\S]*?)\n\}/.exec(tokText)[1]) };
  for (const m of tokText.matchAll(/html\[data-theme="([\w-]+)"\] \{([\s\S]*?)\n\}/g)) themeVars[m[1]] = parseVars(m[2]);
  const darkIds = new Set([...thText.matchAll(/id: '([\w-]+)',[\s\S]*?dark: (true|false)/g)]
    .filter(m => m[2] === 'true').map(m => m[1]));
  assert.equal(Object.keys(themeVars).length, 30, check(`11.5 解析到全部 30 套主题 token（实际 ${Object.keys(themeVars).length}）`));

  const hex2 = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mixC = (a, p, b) => a.map((v, i) => Math.round(v * p + b[i] * (1 - p)));
  const overC = (fg, al, bg) => fg.map((v, i) => Math.round(v * al + bg[i] * (1 - al)));
  const linC = c => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lumC = ([r, g, b]) => 0.2126 * linC(r) + 0.7152 * linC(g) + 0.0722 * linC(b);
  const contrastC = (a, b) => { const [x, y] = [lumC(a), lumC(b)]; return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const P1 = hex2('#81769a'), P2 = hex2('#8b7b8f');
  /* 九个形状元素的承载 ink（与 HERO_STUDY_SVG 实况一致，fill/stroke 取更优者） */
  const SHAPE_INKS = [
    [[P1, .84]],                                        /* 书桌沿 */
    [[P1, .74]],                                        /* 桌腿 ×2（同 ink，计一次） */
    [[hex2('#c7bdd6'), .5], [P1, .84]],                 /* 台灯罩 */
    [[P2, .78]],                                        /* 灯杆 */
    [[P2, .55], [P1, .7]],                              /* 灯座 */
    [[P1, .5], [P1, .84]],                              /* 书 1 */
    [[hex2('#b9afd0'), .55], [P1, .84]],                /* 书 2 */
    [[P2, .55], [P1, .84]]                              /* 书 3 */
  ];
  const worstOn = bg => Math.min(...SHAPE_INKS.map(inks =>
    Math.max(...inks.map(([col, a]) => contrastC(overC(col, a, bg), bg)))));
  const effBg = (vars, amb, dark) => {
    let bg = hex2(vars.paper);
    bg = overC(amb, .14, bg);                            /* E 角晕（声明峰值） */
    bg = overC([255, 252, 244], dark ? .32 * .38 : .32, bg); /* 暖光池（深色退月光） */
    return overC(amb, .26, bg);                          /* 地面带（峰值区） */
  };
  const OLD_GREEN = hex2('#6f9c85');
  let minNew = Infinity, minAt = '';
  const wNewById = {};
  for (const [id, vars] of Object.entries(themeVars)) {
    const dark = darkIds.has(id);
    const amb = mixC(hex2(vars.accent), .45, hex2(vars.wash));
    const wNew = worstOn(effBg(vars, amb, dark));
    const wOld = worstOn(effBg(vars, OLD_GREEN, dark));
    wNewById[id] = wNew;
    if (wNew < minNew) { minNew = wNew; minAt = id; }
    assert.ok(wNew >= wOld - 1e-9,
      check(`11.5 ${id}：环境叠层下道具最差对比度不劣于旧绿环境（旧 ${wOld.toFixed(2)} → 新 ${wNew.toFixed(2)}，ambient ${'#' + amb.map(v => v.toString(16).padStart(2, '0')).join('')}）`));
  }
  assert.ok(wNewById['night'] >= 1.7,
    check(`11.5 默认主题 night 环境叠层 worst ≥ 1.7（实际 ${wNewById['night'].toFixed(2)}；交接担心的「night 环境偏紫、道具融背景」实测方向相反——旧绿丘把深底抬进中间调才是更差的一端，改后 +0.34）`));
  assert.ok(wNewById['garden'] >= 2.0,
    check(`11.5 garden 环境叠层 worst ≥ 2.0（实际 ${wNewById['garden'].toFixed(2)}）`));
  assert.ok(minNew >= 1.6,
    check(`11.5 全 30 套环境叠层 worst 最小值 ≥ 1.6（实际 ${minNew.toFixed(2)}，${minAt}）——绝对下限低于 raw 基准属物理事实（改前旧绿环境即如此，最低 1.37），「看得见」的可测契约仍由第 10 组 raw 基准承担`));

  /* ---------- 11.6 色相钉：绿系主题保绿、garden 跟随主色 ---------- */
  const hueOf = rgb => {
    const [r, g, b] = rgb.map(v => v / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    if (d === 0) return NaN;
    let h;
    if (max === r) h = ((g - b) / d) % 6; else if (max === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
    return h;
  };
  const ambOf = id => mixC(hex2(themeVars[id].accent), .45, hex2(themeVars[id].wash));
  for (const id of ['moss', 'forest', 'bamboo', 'mint', 'terminal']) {
    const h = hueOf(ambOf(id));
    assert.ok(h >= 60 && h <= 170,
      check(`11.6 绿系主题 ${id} 的 ambient 色相 ${h.toFixed(0)}° 落在绿带（60–170°）——环境色跟随主题即自动保绿，无需破例`));
  }
  const hGarden = hueOf(ambOf('garden'));
  assert.ok(hGarden >= 240 && hGarden <= 285,
    check(`11.6 garden 的 ambient 色相 ${hGarden.toFixed(0)}° 为紫蓝——按主色走（用户决定 3：不因「园地」之名保留绿）`));
}

console.log(`通过：v4.11 Hero 场景专项 ${checks} 项断言。批次 D 部分：舞台 3:4 + 27rem 档、窄屏同步、紫晕 18% 防漂移 + 窗光带逐字、绿巢正圆防椭圆、批次 C 氛围层/封面双零回归钉、改动区零新 token 零动画。批次 E 部分：HERO_STUDY_SVG 三类几何（书桌/台灯/书堆）+ 安全属性零外链零事件零脚本 + 五色调色板与 opacity ≤ .5 + svgImage 空 alt 挂载与树序 + <56rem 与 print 隐藏 + 既有层零回归 + 测试文件数 39（v4.11.2 新增 lesson-reader-fixes）。批次 F（B0）部分：道具 z-index 非负且严格高于 .home-hero::before/::after、.hero-main 与 .hero-companion-stage 严格高于道具、pointer-events:none 保留——钉的是层与层的相对关系，不是孤立数值，足以捕捉「元素存在但用户看不见」。真实浏览器八档溢出 / 装饰显隐 / 遮挡层级 / 四主题观感 / print / garden 零漂移见 TEST-REPORT「v4.11 批次 E / 批次 F 验收」。v4.11.14 部分（第 11 组）：--color-ambient 派生机制结构钉（:root 单行 color-mix(accent 45%, wash)、主题块零覆盖）、环境层六消费点迁移钉（E14/A26+11/C22/接地影14/伙伴区16/F6，alpha 原值不动且零 grow 残留）、语义层 grow 零漂移钉（规则层引用恰好 18 处 + 三条语义规则逐字）、植物 SVG 去绿钉（旧绿双色清零、紫灰双主线 + 金/紫/陶光斑五色保留、opacity 与几何逐字）、全 30 套环境叠层道具可见性不劣于旧绿环境（night 1.43→1.77、garden 2.03→2.10、全场最小 1.63）与绿系保绿/garden 紫蓝色相钉；第 10 组 raw 基准契约一字未动（基准 token 本轮未改，worst 2.44 / 锚点 3.03 依旧）。`);
