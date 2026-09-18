/* 页面主题清单（v4.2 创建；v4.4 主题系统 2.0，交接 Core C）。
 *
 * 主题只改视觉 token（颜色变量），不改变布局、字号与结构；
 * 每套颜色的对比度按 WCAG 相对亮度公式**程序化检查**（tests/themes-contrast.test.cjs：
 * 正文 / 次要文字 / 强调链接 / 代码块 / 按钮文字 / 警示色六组全部 ≥ 4.5:1），
 * 不达标进不了仓库。主题的生效方式是 app.js 给 <html> 设 data-theme 属性，
 * tokens.css 里的 html[data-theme="..."] 规则覆盖 :root 变量——不引入任何运行时样式计算。
 * 不做自由颜色 picker（用户选不出白字白底）。
 *
 * v4.4 新增字段（audit U2：daisyUI 5 的“主题=扁平变量集+分类组织”模式）：
 *   category  分类 id，对应下面的 categories（Picker 的分类筛选 chips）
 *   dark      是否深色主题（Picker 的 Light/Dark 标签；tokens.css 同步声明 color-scheme）
 *
 * 字段：
 *   id     与 progress.js 的 DEFAULT_THEME_ID 对应（tests 断言一致）
 *   zh     名称
 *   desc   一句话说明
 *   swatch 预览色卡（背景 / 强调 / 正文三色，UI 展示用）
 *   unlock 解锁方式，由 collections.js 统一判定
 *
 * 命名与配色纪律（交接 C1）：全部本站原创配色与中文命名；特别系只借“风格方向”
 * （复古荧光 / 像素 / 霓虹 / 冷灰极光），不复制第三方专有主题名称或配色资产。
 *
 * v4.11 批次 B（全主题视觉氛围统一）：除 garden（批次 A 已柔化）外的 29 套主题在
 * tokens.css 做同纪律的表面色降饱和柔化（浅色 paper/wash/rule + button-ink 跟随、
 * 深色 wash/rule），paper 变化主题的 swatch.bg 已逐字同步；accent / ink / warn /
 * desc / id / 解锁方式零改动。变换规则与 dune 定向补救见 tokens.css 批次 B 注释。
 */
window.ODIN_THEMES = {
  version: 2,
  /* v4.11 批次 F（B1）：默认主题由「园地」改为「夜空」。
   * 单一事实源仍是本字段 + progress.js 的 DEFAULT_THEME_ID，两处必须逐字一致
   * （tests/collections.test.cjs 断言相等，不允许出现第二套默认值字面量）。
   * 注意区分两层：tokens.css 的 `:root` 仍是园地配色——那是**token 层的兜底
   * 基线**（既有约定「garden 是 :root 默认值、不重复写块」，由
   * tests/themes-contrast.test.cjs 钉住），不是「默认主题」；默认主题由 app.js
   * 的 applyTheme() 在页面初始化时写到 <html data-theme>。
   * 本字段只作用于**新档案 / 缺合法主题的档案 / UI 回落**，绝不覆盖已存档案。 */
  defaultThemeId: 'night',
  /* v4.11 批次 F（B2）：主题选择器的**展示优先顺序**。白名单内的 id 排在其余
   * 主题之前、组内按本数组顺序；不在白名单的主题保持 themes[] 的原始顺序，
   * 因此分类筛选 / 搜索 / 计数一个不丢。这里只调「展示顺序」，不改任何主题定义
   * （id / 中文名 / category / dark / swatch / unlock 一字不动），也不改解锁判定,
   * 更不参与「最近使用」（那是会话内的时间序，独立于本数组）。 */
  recommendedThemeIds: ['night', 'graphite', 'glacier'],
  license: '本站原创配色，随本项目内容采用 CC BY-NC-SA 4.0。',
  /* Picker 分类筛选的顺序即展示顺序 */
  categories: [
    { id: 'fresh', zh: '清爽系' },
    { id: 'warm', zh: '暖色系' },
    { id: 'nature', zh: '自然系' },
    { id: 'dark', zh: '深色系' },
    { id: 'special', zh: '特别系' }
  ],
  themes: [
    {
      id: 'garden',
      zh: '园地',
      /* v4.11 批次 A：底色柔化为更舒缓的雾白（低刺激、适合长期学习）；
       * swatch 三色必须与 tokens.css :root 变量逐字一致（themes-contrast 钉住）。
       * v4.11 批次 F：desc 里的「默认主题：」前缀随之去掉——默认已改为夜空，
       * 留着会是一句假话（主题卡直接展示 desc）。配色与 token 一字未改。 */
      desc: '柔雾白底、靛紫点缀的清爽配色。',
      category: 'fresh',
      dark: false,
      swatch: { bg: '#f9f8f4', accent: '#51408f', ink: '#29243a' },
      unlock: { kind: 'default' }
    },
    {
      id: 'paper',
      zh: '稿纸',
      desc: '偏暖的米白纸面，适合长时间阅读。',
      category: 'warm',
      dark: false,
      swatch: { bg: '#faf7f1', accent: '#7a5230', ink: '#3d3427' },
      unlock: { kind: 'default' }
    },
    {
      id: 'warm',
      zh: '暖炉',
      desc: '奶油底色配暖红，冬夜学习用。',
      category: 'warm',
      dark: false,
      swatch: { bg: '#fbf7f5', accent: '#9c4736', ink: '#402e2c' },
      unlock: { kind: 'level', value: 5 }
    },
    {
      id: 'ocean',
      zh: '浅海',
      desc: '清爽的蓝绿色调，白天学习用。',
      category: 'fresh',
      dark: false,
      swatch: { bg: '#f4f7f8', accent: '#1d6f7e', ink: '#1d3a44' },
      unlock: { kind: 'achievement', value: 'streak-3' }
    },
    {
      id: 'terminal',
      zh: '终端',
      desc: '深绿底亮绿字的命令行配色。',
      category: 'dark',
      dark: true,
      swatch: { bg: '#1b2420', accent: '#58c98b', ink: '#cfe6d6' },
      unlock: { kind: 'coins', value: 120 }
    },
    {
      id: 'night',
      zh: '夜空',
      desc: '默认主题：深蓝夜色，暗光环境下的低刺激配色。',
      category: 'dark',
      dark: true,
      swatch: { bg: '#171c2b', accent: '#7f96e8', ink: '#d6dcf0' },
      /* v4.3（交接 B2）：夜间阅读是基础能力，不锁在叶片后——夜空改为默认开放，
       * 成为“至少 1 个默认深色主题”的硬指标落点。原本已解锁的用户不受影响。 */
      unlock: { kind: 'default' }
    },
    /* ---------- v4.3 扩充（交接 B2：默认主题至少 4 个；H：总数 8–10） ---------- */
    {
      id: 'linen',
      zh: '亚麻',
      desc: '中性灰绿的布纹纸色，久看不累。',
      category: 'fresh',
      dark: false,
      swatch: { bg: '#f5f4f1', accent: '#5f6f52', ink: '#33382e' },
      unlock: { kind: 'default' }
    },
    {
      id: 'moss',
      zh: '苔原',
      desc: '黄绿苔藓色，林间清晨的调子。',
      category: 'nature',
      dark: false,
      swatch: { bg: '#f3f5ee', accent: '#4a6b2f', ink: '#2c331f' },
      unlock: { kind: 'default' }
    },
    /* ---------- v4.3 Batch 6（交接 H/J）：总数扩到 10；陶土是低档位叶片款，
     * 让主题也有“前期买得起”的选择，不必都等 100+ 叶片 ---------- */
    {
      id: 'plum',
      zh: '梅子',
      desc: '梅子紫的安静配色，适合长文精读。',
      category: 'special',
      dark: false,
      swatch: { bg: '#f8f5f7', accent: '#7c4a63', ink: '#38272f' },
      unlock: { kind: 'level', value: 8 }
    },
    {
      id: 'clay',
      zh: '陶土',
      desc: '暖陶底色配赭石强调色，手作工坊的调子。',
      category: 'warm',
      dark: false,
      swatch: { bg: '#f5f2ef', accent: '#9c5e3a', ink: '#3a2e26' },
      unlock: { kind: 'coins', value: 40 }
    },
    /* ---------- v4.4 主题系统 2.0（交接 C1：扩到 24–30 套，五类组织） ----------
     * 解锁分布刻意保持“大多数直接可用”：主题是高频感知功能，13 套新主题默认开放；
     * 叶片款给收藏系统货源（40–150 叶片），等级款 1 套（墨黑 Lv.12）。
     * 既有 10 套的 id / 名称 / 解锁方式一律不动（红线 8：兼容既有档案与购买记录）。 */
    {
      id: 'mint',
      zh: '薄荷',
      desc: '鲜嫩的薄荷绿，提神醒脑的白天配色。',
      category: 'fresh',
      dark: false,
      swatch: { bg: '#f5f8f6', accent: '#2e7d5b', ink: '#22352c' },
      unlock: { kind: 'default' }
    },
    {
      id: 'glacier',
      zh: '冰川',
      desc: '冰河蓝的冷调浅色，适合专注的长阅读。',
      category: 'fresh',
      dark: false,
      swatch: { bg: '#f6f8f9', accent: '#3a6ea5', ink: '#24313d' },
      unlock: { kind: 'default' }
    },
    {
      id: 'seasalt',
      zh: '海盐',
      desc: '海雾灰蓝，咸而清爽的中性纸面。',
      category: 'fresh',
      dark: false,
      swatch: { bg: '#f7f8f8', accent: '#4a6b82', ink: '#2a3539' },
      unlock: { kind: 'default' }
    },
    {
      id: 'porcelain',
      zh: '白瓷',
      desc: '冷白瓷面配靛青，青花瓷的干净调子。',
      category: 'fresh',
      dark: false,
      swatch: { bg: '#fbfcfc', accent: '#33567a', ink: '#2a2e33' },
      unlock: { kind: 'default' }
    },
    {
      id: 'milktea',
      zh: '奶茶',
      desc: '一杯温奶茶的棕调纸面，秋冬皆宜。',
      category: 'warm',
      dark: false,
      swatch: { bg: '#f6f3ef', accent: '#7d6244', ink: '#3a302a' },
      unlock: { kind: 'default' }
    },
    {
      id: 'caramel',
      zh: '焦糖',
      desc: '熬到刚好的焦糖色，甜而不腻。',
      category: 'warm',
      dark: false,
      swatch: { bg: '#faf7f3', accent: '#8f5a1e', ink: '#3c2f22' },
      unlock: { kind: 'coins', value: 40 }
    },
    {
      id: 'autumn',
      zh: '秋叶',
      desc: '枫叶金橙，午后阳光穿过树影的颜色。',
      category: 'warm',
      dark: false,
      swatch: { bg: '#f8f6f2', accent: '#a05a1d', ink: '#3a2f26' },
      unlock: { kind: 'default' }
    },
    {
      id: 'dusk',
      zh: '黄昏',
      desc: '日落后的紫红余晖，暖色的收尾。',
      category: 'warm',
      dark: false,
      swatch: { bg: '#f7f3f2', accent: '#8a4a4e', ink: '#38292c' },
      unlock: { kind: 'coins', value: 60 }
    },
    {
      id: 'forest',
      zh: '森林',
      desc: '针叶林深处的绿，比园地更深更静。',
      category: 'nature',
      dark: false,
      swatch: { bg: '#f3f6f2', accent: '#2a5c43', ink: '#22301f' },
      unlock: { kind: 'default' }
    },
    {
      id: 'bamboo',
      zh: '竹影',
      desc: '竹纸窗前一竿瘦竹的低饱和绿。',
      category: 'nature',
      dark: false,
      swatch: { bg: '#f6f6f2', accent: '#587a46', ink: '#2c3323' },
      unlock: { kind: 'default' }
    },
    {
      id: 'lake',
      zh: '湖泊',
      desc: '高山湖水的深蓝，倒映着天空。',
      category: 'nature',
      dark: false,
      swatch: { bg: '#f3f6f7', accent: '#25608f', ink: '#1f2f3a' },
      unlock: { kind: 'default' }
    },
    {
      id: 'dune',
      zh: '沙丘',
      desc: '风积沙的金棕，干燥温暖的浅色。',
      category: 'nature',
      dark: false,
      swatch: { bg: '#f8f6f2', accent: '#8a6d2a', ink: '#38311f' },
      unlock: { kind: 'default' }
    },
    {
      id: 'deepsea',
      zh: '深海',
      desc: '深海的蓝黑，一点生物荧光照亮字行。',
      category: 'dark',
      dark: true,
      swatch: { bg: '#101f28', accent: '#4fa3c7', ink: '#c8dce6' },
      unlock: { kind: 'coins', value: 80 }
    },
    {
      id: 'graphite',
      zh: '石墨',
      desc: '铅笔芯的中性灰，无彩色的安静深色。',
      category: 'dark',
      dark: true,
      swatch: { bg: '#1c1c1e', accent: '#9db1c8', ink: '#d8d8da' },
      unlock: { kind: 'default' }
    },
    {
      id: 'violet',
      zh: '紫夜',
      desc: '深夜的紫，比夜空更暖一点的暗色。',
      category: 'dark',
      dark: true,
      swatch: { bg: '#1d1830', accent: '#a78bda', ink: '#ddd4f0' },
      unlock: { kind: 'coins', value: 100 }
    },
    {
      id: 'ink',
      zh: '墨黑',
      desc: '宣纸研墨的黑，配一点哑金。',
      category: 'dark',
      dark: true,
      swatch: { bg: '#161616', accent: '#c2a878', ink: '#d4d0c8' },
      unlock: { kind: 'level', value: 12 }
    },
    {
      id: 'crt',
      zh: '复古显像管',
      desc: '琥珀色荧光的老显示器，复古终端的暖意。',
      category: 'special',
      dark: true,
      swatch: { bg: '#1a140e', accent: '#e0a040', ink: '#e8c88a' },
      unlock: { kind: 'coins', value: 150 }
    },
    {
      id: 'pixel',
      zh: '像素纸',
      desc: '再生纸底色配高饱和像素蓝，8-bit 的明快。',
      category: 'special',
      dark: false,
      swatch: { bg: '#f2f1ec', accent: '#4a4ad8', ink: '#2a2a35' },
      unlock: { kind: 'default' }
    },
    {
      id: 'cyber',
      zh: '赛博',
      desc: '霓虹粉紫的夜之城，高对比暗色。',
      category: 'special',
      dark: true,
      swatch: { bg: '#16111f', accent: '#e05fa8', ink: '#ecd9f2' },
      unlock: { kind: 'coins', value: 150 }
    },
    {
      id: 'softpink',
      zh: '柔粉',
      desc: '糖果粉的浅色纸面，温柔但不甜腻。',
      category: 'special',
      dark: false,
      swatch: { bg: '#fbf7f8', accent: '#b04a76', ink: '#3d2a32' },
      unlock: { kind: 'default' }
    }
  ]
};
