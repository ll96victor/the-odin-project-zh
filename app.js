/* 普通脚本而非 module：直接双击 HTML 也能使用，不需要服务器或构建。 */
(() => {
  'use strict';
  const main = document.getElementById('main');
  const data = window.ODIN_GUIDE;
  /* 学习进度的存储与计时全部由 progress.js 负责；本文件只调用它暴露的接口，不直接读写浏览器存储。 */
  const progress = window.ODIN_PROGRESS || null;
  /* 外部资料清单同样是纯数据文件，本文件只读取并渲染，不在这里做联网校验。 */
  const resourceData = window.ODIN_RESOURCES || null;
  /* v4.11.2 C：任务条目 → 外部资料的内联链接映射（lesson-task-links.js 纯数据）。
   * 缺失时全部任务条目回落纯文本渲染（与 v4.11.1 行为一致），不影响课程阅读。 */
  const taskLinkData = window.ODIN_TASK_LINKS || null;
  /* 以下三个也都是纯数据文件；缺任何一个都只降级对应的界面区块，不影响课程阅读。 */
  const avatars = window.ODIN_AVATARS || null;
  const icons = window.ODIN_ICONS || null;
  const catalog = window.ODIN_CATALOG || null;
  const diagrams = window.ODIN_DIAGRAMS || null;
  /* v4.2：小奥形象 / 主题 / 收藏规则同样是纯数据与纯逻辑文件，缺失只降级对应区块 */
  /* v4.10：登记表（companion-registry.js）。app.js 只**读**它的退役名单
   * （retiredAvatarIds），不在本文件里另抄任何 id 字面量——名单的唯一声明处
   * 在登记表（AGENTS.md 事实源约定，legacy-identity.test 用源码扫描钉住）。 */
  const companionRegistry = window.ODIN_COMPANION_REGISTRY || null;
  const companionView = window.ODIN_COMPANION_VIEW || null;
  const companions = window.ODIN_COMPANIONS || null;
  /* v4.5（交接 D）：人形装扮参数化系统（companion-wardrobe.js，纯数据+纯逻辑）；
   * 缺失时人形回落到 companions.js 的 ODIN_COMPANION_BUST（v4.4 行为），不报错。 */
  const wardrobe = window.ODIN_COMPANION_WARDROBE || null;
  const themes = window.ODIN_THEMES || null;
  const collections = window.ODIN_COLLECTIONS || null;
  /* v4.3：地图节点状态推导（map.js）与 Boss 题库（bosses.js），缺失只降级对应区块 */
  const mapModule = window.ODIN_MAP || null;
  const bossesModule = window.ODIN_BOSSES || null;
  /* v4.4（交接 Core F）：官方 Full Stack JS 全路线结构快照（curriculum.js 纯数据），
   * 缺失时世界地图降级为只显示 Foundations 地图（v4.3 行为） */
  const curriculum = window.ODIN_CURRICULUM || null;
  /* v4.3：热力图 / 个人最佳 / 每课耗时（stats.js，全部从 daily 纯函数推导） */
  const stats = window.ODIN_STATS || null;
  /* v4.3 Batch 10（Stretch N12）：本周总结复用 daily.js 的周期口径函数 */
  const dailyModule = window.ODIN_DAILY || null;
  /* v4.5（交接 A2）：版本身份单一事实源（version.js）。footer 版本行与
   * 「关于本站」区块只从这里读，不允许在任何别处硬编码版本字符串。 */
  const versionInfo = window.ODIN_VERSION || null;
  const REQUIREMENT_LABEL = { required: '必做', optional: '可选', reference: '参考' };
  const FILE_MODE_NOTE = '当前为直接文件模式。课程可以正常阅读，但学习进度无法保证可靠保存。需要记录进度时，请使用 start.bat 打开。';
  let activeLessonId = null;
  /* v4.4（交接 C2）：主题即时预览状态（仅内存，绝不持久化）。
   * 非空时 applyTheme 优先应用预览主题——“使用”确认才写档案，
   * 关闭 picker 或点“恢复”即回到已存主题，hover 不触发任何存储。 */
  let previewThemeId = null;
  /* 主题选择器的筛选状态（body 重建时保留，避免输一个字筛选就复位） */
  const themeFilter = { query: '', category: 'all' };
  /* Stretch I1：最近使用主题——刻意只做内存级（本次会话），不新增任何
   * 持久化偏好 key：主题是「选定一次长期用」的东西，跨会话记住最近使用
   * 价值低，还要多发明一个独立存储 key 与 file:// 降级分支。
   * 交接原文允许「如不增加 schema 可先内存」。 */
  let recentThemeIds = [];

  function rememberRecentTheme(themeId) {
    recentThemeIds = [themeId].concat(recentThemeIds.filter(id => id !== themeId)).slice(0, 3);
  }
  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  const link = (label, href, className, external = false) => {
    const element = node('a', label, className);
    element.href = href;
    if (external) {
      element.target = '_blank';
      element.rel = 'noopener noreferrer';
    }
    return element;
  };
  const lessonHref = lesson => `lesson.html?id=${encodeURIComponent(lesson.id)}`;
  /* modifier 只是给 section 多加一个类名，用来在视觉上区分不同类型的区块（§8.1）。
   * 它不改变 h2 的文字，因此 browser-smoke 对 main h2 序列的精确断言不受影响。 */
  const section = (title, modifier) => {
    const element = node('section', undefined, modifier ? `section ${modifier}` : 'section');
    element.append(node('h2', title));
    return element;
  };
  const list = (items, ordered = false) => {
    const element = node(ordered ? 'ol' : 'ul');
    items.forEach(item => element.append(node('li', item)));
    return element;
  };
  const officialButton = lesson => link('打开 The Odin Project 官方课程', lesson.url, 'button-secondary', true);

  /* ---------- v4：头像 / 图标 / 个人资料面板 ----------
   * 头像与图标都是本站原创的 SVG，统一用 data URL 放进 <img> 渲染：
   * 放进 <img> 的 SVG 是惰性的，浏览器不会执行其中的脚本，比注入标记更安全，
   * 也避开了本项目“运行时不得用字符串直接注入标记”的约束；file:// 双击打开时也
   * 不需要额外请求文件。 */
  const SVG_PREFIX = 'data:image/svg+xml;charset=utf-8,';

  const svgImage = (markup, alt, className) => {
    const image = node('img', undefined, className);
    image.alt = alt || '';
    image.src = SVG_PREFIX + encodeURIComponent(markup);
    /* v4.5（交接 A1）：<img> 在真实浏览器里默认原生可拖（draggable）。学习伙伴
     * 按钮内的头像 img 一旦被鼠标按住拖动，浏览器会发起 HTML5 原生拖放
     * （dragstart），隐式释放 pointer capture、停发 pointermove/pointerup，
     * 伙伴按钮的自定义拖动整个失效。本站所有 img 都是装饰性 SVG data URL，
     * 统一关闭原生拖动（CSS 里另有 -webkit-user-drag:none 兜底旧 Safari）。 */
    image.draggable = false;
    return image;
  };

  /* v4.11.13：mask 渲染路径（mask 源族图标的唯一出口）。SVG 只提供 alpha 通道
   * （CSS mask-image），可见颜色交给 background-color: var(--color-icon)，随主题变化——
   * 把 v4.11.12 实测到的「固定色 <img> 图标在深色主题下看不见」（深墨 1.02–1.24:1、
   * 旧绿 1.56–2.00:1）从根上解除：颜色不再写死在 markup 里。data URL 是内联资源，
   * file:// 双击打开同样可用（真实浏览器验证过，见 TEST-REPORT / answers 记录）。
   * opacity 属性（如 progress 的 .85 填充条）经 alpha 通道自动保留层次，无需特殊处理。
   * 只接受 mask 源族（icons.js 头注释列名）；固定色族（tierBadges 金属 / assistant
   * 角色）继续走 svgImage——单色 alpha 会把角色的不透明身体与眼点合并成无脸剪影。 */
  const maskIcon = (markup, className) => {
    const el = node('span', undefined, className ? `mask-icon ${className}` : 'mask-icon');
    el.setAttribute('aria-hidden', 'true');
    el.style.setProperty('--icon-mask', `url("${SVG_PREFIX + encodeURIComponent(markup)}")`);
    return el;
  };

  /* v4.6：公共门面返回 file portrait 时统一走这一条安全创建路径。
   * 正式位图异步解码并关闭原生拖放；只使用安全 DOM API。
   * v4.10：加载策略不再一律 lazy——由 companion-view 的 SLOTS 给出 lazy 标志
   * （小图标槽 eager，大立绘槽 lazy），本函数只照做，不自己判尺寸也不看文件名。
   * 之前这里写死 loading='lazy'，导致 SLOTS 的标志形同虚设：形象 picker 的滚动
   * 容器内容高约 3476px、可视仅 544px，加上 serve.py 对静态资源发 no-cache，
   * 打开面板时缩略图会逐格填充；而全部小图标合计只有 68 KB，延迟加载省不下什么。
   * 大图（hero / profile / 装扮预览）继续 lazy，那才是 lazy 真正有价值的地方。 */
  const fileImage = (src, alt, className, lazy) => {
    const image = node('img', undefined, className);
    image.alt = alt || '';
    image.src = src;
    image.loading = lazy ? 'lazy' : 'eager';
    image.decoding = 'async';
    image.draggable = false;
    image.classList.add('is-file');
    return image;
  };

  /* 找不到指定 id 时回落默认头像，再回落清单第一项；清单没载入则返回 null，
   * 调用方按“不显示图片”处理，而不是报错。 */
  function resolveAvatar(avatarId) {
    if (!avatars || !Array.isArray(avatars.avatars) || !avatars.avatars.length) return null;
    return avatars.avatars.find(item => item.id === avatarId)
      || avatars.avatars.find(item => item.id === avatars.defaultAvatarId)
      || avatars.avatars[0];
  }

  /* 第二轮：头像系统复用 Companion 正式图片——`companion-<stableId>` 命名空间的
   * 头像 id 指向登记表里 ready 的角色：fixed-art 角色用各自 icon，既有几何角色
   * 复用原 SVG；清单与图片路径都由 companion-view 门面给出（app.js 不复制
   * 路径判断）。解锁沿用角色既有 default / level / achievement / coins 模型，
   * 不新增第二套资产、不改 schema 与存储 key。 */
  const COMPANION_AVATAR_PREFIX = 'companion-';
  function companionAvatarEntry(avatarId) {
    if (!companionView || typeof companionView.resolve !== 'function') return null;
    if (typeof avatarId !== 'string' || avatarId.indexOf(COMPANION_AVATAR_PREFIX) !== 0) return null;
    const id = avatarId.slice(COMPANION_AVATAR_PREFIX.length);
    const entry = companionView.resolve(id);
    return entry && entry.id === id ? entry : null;
  }
  function companionAvatarDescriptor(avatarId) {
    const entry = companionAvatarEntry(avatarId);
    if (!entry || typeof companionView.portrait !== 'function') return null;
    return companionView.portrait(entry.id, { slot: 'corner', mood: 'normal' });
  }

  function resolveFrame(frameId) {
    if (!progress) return null;
    return progress.FRAMES.find(item => item.id === frameId) || progress.FRAMES[0];
  }

  /* ---------- v4.2：小奥形象 / 主题 / 收藏（交接 §4、§6、§12、§13） ---------- */

  /* 找不到指定 id 时回落默认形象；清单没载入则返回 null（调用方按不显示处理）。
   * companionId 只做格式校验存进档案，这里的回退保证界面永远有形象可渲染。 */
  let companionFilter = 'all';

  function companionEntries() {
    if (companionView && typeof companionView.listByKind === 'function') return companionView.listByKind(companionFilter === 'all' ? undefined : companionFilter);
    return companions && Array.isArray(companions.companions) ? companions.companions : [];
  }

  function companionFilterControls() {
    const row = node('div', undefined, 'companion-filter');
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', '学习伙伴分类');
    [['all', '全部'], ['humanoid', '人形'], ['creature', '宠物']].forEach(([value, label]) => {
      const button = node('button', label, `button-secondary${companionFilter === value ? ' is-active' : ''}`);
      button.type = 'button';
      button.setAttribute('aria-pressed', String(companionFilter === value));
      button.addEventListener('click', () => {
        companionFilter = value;
        refreshCompanionPickerBody();
      });
      row.append(button);
    });
    return row;
  }

  function resolveCompanion(companionId) {
    if (companionView && typeof companionView.resolve === 'function') return companionView.resolve(companionId);
    if (!companions || !Array.isArray(companions.companions) || !companions.companions.length) return null;
    return companions.companions.find(item => item.id === companionId)
      || companions.companions.find(item => item.id === companions.defaultCompanionId)
      || companions.companions[0];
  }

  /* ---------- v4.5（交接 C1/C2）：学习伙伴的昵称与显示模式 ----------
   * 去 Odin 化：系统称谓统一「学习伙伴」，默认伙伴名「小诺」（v4.8 起默认
   * 角色为 nono），可自定义。
   * 昵称与显示模式都存在 settings（progress.companionIdentity 单一口径），
   * progress 缺失时回落默认值，永不抛错。形象（companionId）是另一个维度，
   * 与昵称互不影响——换形象不改名字，改名字也不换形象。 */
  function companionDisplayName() {
    if (progress && typeof progress.companionIdentity === 'function') {
      const identity = progress.companionIdentity();
      if (identity && identity.name) return identity.name;
    }
    if (companionView && typeof companionView.displayName === 'function' && progress) {
      return companionView.displayName(progress.cosmetics().companionId);
    }
    return (progress && progress.Logic && progress.Logic.DEFAULT_COMPANION_NAME) || '小诺';
  }
  /* 第二轮：「昵称 · 形象名」双维度标签。角色未命名时显示名就是登记默认名
   * （如「米娅」），与形象名再拼接会出现「米娅 · 米娅」，同名时跳过拼接；
   * 昵称与形象名不同（如「小米 · 米娅」）时保持双维度展示。默认角色小诺的
   * 默认名与登记名同为「小诺」，天然走同名跳过分枝。 */
  function companionNameWithForm(name, companion) {
    const form = companion && companion.zh ? companion.zh : '';
    return form && form !== name ? `${name} · ${form}` : name;
  }
  function companionDisplayMode() {
    if (progress && typeof progress.companionIdentity === 'function') {
      return progress.companionIdentity().display;
    }
    return 'auto';
  }
  /* 显示模式语义（交接 C2）：
   *   auto    —— 默认：面板默认视图显示大人形，二级视图不带大图（v4.4 行为）；
   *   always  —— 面板每个视图都持续显示大人形；
   *   minimal —— 面板只显示小头像 + 文字，任何视图都不显示大人形。
   * 右下角触发按钮始终是“小头像”（由 showCompanion 总开关控制显隐），
   * 显示模式只影响**面板内部**是否/在哪展示大人形。 */
  function companionShowsBustIn(view) {
    const mode = companionDisplayMode();
    if (mode === 'minimal') return false;
    if (mode === 'always') return true;
    return view === 'home'; /* auto */
  }

  /* ---------- v4.5（交接 D）：人形装扮的运行时组合 ----------
   * 完整 look = 体型（来自装备的 odin-boy/odin-girl 的 bust，是两个继续存在的
   * 基础体型）+ 装扮四槽（progress.companionLook()；未自定义时按体型给协调默认）。
   * 组合结果只在运行时生成，档案里只存四槽部件 id（交接 D1：不存整图）。 */
  function currentCompanionLook(companion) {
    if (!wardrobe) return null;
    const body = companion && companion.procedural && companion.procedural.body
      ? companion.procedural.body : (companion && companion.bust ? companion.bust : wardrobe.DEFAULT_BODY);
    const stored = (progress && typeof progress.companionLook === 'function') ? progress.companionLook() : null;
    const dress = stored || wardrobe.defaultDressFor(body);
    return wardrobe.sanitizeLook(Object.assign({ body: body }, dress));
  }

  function currentCompanionSkin(companion) {
    if (!companion || !companionView || typeof companionView.skinFor !== 'function') return null;
    const stored = progress && typeof progress.companionSkin === 'function'
      ? progress.companionSkin(companion.id) : null;
    return companionView.skinFor(companion.id, stored);
  }

  /* 伙伴的统一图片入口：procedural 人形继续生成当前装扮 icon；fixed-art 与
   * inline 都通过 companion-view portrait 获取，页面不复制资产路径或 fallback。 */
  function companionPortraitImage(companion, options, className, altOverride) {
    const opts = options || {};
    if (companion && companion.procedural && companion.procedural.body && wardrobe) {
      const look = currentCompanionLook(companion);
      if (look) return svgImage(wardrobe.icon(look), altOverride || companionDisplayName(), className);
    }
    if (companion && companionView && typeof companionView.portrait === 'function') {
      const portraitOptions = Object.assign({}, opts, {
        skin: opts.skin || currentCompanionSkin(companion)
      });
      const descriptor = companionView.portrait(companion.id, portraitOptions);
      if (descriptor && descriptor.source === 'file') {
        /* lazy 标志来自门面 descriptor（SLOTS 单一事实源），不在这里另判尺寸 */
        return fileImage(descriptor.value, altOverride === undefined ? descriptor.alt : altOverride, className, descriptor.lazy);
      }
      if (descriptor && descriptor.source === 'inline') {
        return svgImage(descriptor.value, altOverride === undefined ? descriptor.alt : altOverride, className);
      }
    }
    const fallback = companion && companion.legacy ? companion.legacy.svg
      : companion && companion.svg ? companion.svg : (icons && icons.assistant) || null;
    return fallback ? svgImage(fallback, altOverride || '', className) : null;
  }

  /* ---------- v4.3 Batch 6（交接 I）：小奥成长阶段 ----------
   * 阶段由 Level / 累计有效时长 / 完成单元数纯函数推导（companions.js
   * growthStageOf），不新增存储字段；与皮肤 id 是两个独立维度——换形象不
   * 影响阶段，阶段也不锁定形象。完成单元数从 unit-* 成就推导（成就本身
   * 由真实完成状态解锁，不可手改刷出来）。不死亡、不枯萎、不掉阶段。 */
  function growthMetrics() {
    const state = progress.getState();
    const summary = progress.summary();
    const unitIds = progress.ACHIEVEMENTS
      .filter(item => item.id.indexOf('unit-') === 0)
      .map(item => item.id);
    return {
      level: summary.level,
      totalSeconds: state.totalActiveSeconds || 0,
      completedUnits: unitIds.filter(id => state.achievements && state.achievements[id]).length
    };
  }

  function companionGrowth() {
    if (!companions || typeof companions.growthBrief !== 'function') return null;
    return companions.growthBrief(growthMetrics());
  }

  /* 生长阶段徽章（stage 0 不挂，保持干净）。纯装饰：alt 空、pointer-events none。
   * v4.9：**已不从右下角按钮渲染**——18×18px 圆形徽章（一根竖线 + 两片叶）在
   * 那个尺寸下极像感叹号，且是纯装饰 <img> 没有点击处理器，用户「点不掉」。
   * 函数与 companions.js 的 growthStages / ornament 数据都保留（成长阶段仍是
   * 系统能力，将来个人中心 / 成长页有正式展示位可直接复用），只撤掉按钮角上的
   * 这一处展示；本文件目前没有任何调用点，属于有意保留的能力而非死代码。 */
  function growthOrnament() {
    const growth = companionGrowth();
    if (!growth || !growth.ornament) return null;
    const ornament = svgImage(growth.ornament, '', 'companion-growth');
    ornament.title = `学习伙伴成长阶段：${growth.zh}`;
    return ornament;
  }

  function resolveTheme(themeId) {
    if (!themes || !Array.isArray(themes.themes) || !themes.themes.length) return null;
    return themes.themes.find(item => item.id === themeId)
      || themes.themes.find(item => item.id === themes.defaultThemeId)
      || themes.themes[0];
  }

  /* 主题生效：<html data-theme="..."> + tokens.css 的变量覆盖。
   * 幂等，每次刷新界面时调用一次即可；主题只改颜色 token，不改布局。
   * v4.4：预览状态优先——picker 里的即时预览期间，任何 refreshAll 都不会
   * 把页面弹回已存主题（预览只在内存，关闭 picker 时统一恢复）。 */
  function applyTheme() {
    if (!progress || !themes) return;
    const theme = resolveTheme(previewThemeId || progress.cosmetics().themeId);
    if (!theme) return;
    document.documentElement.dataset.theme = theme.id;
    /* v4.4（交接 H14）：data-dark 标记——清单里的 dark 布尔是事实源，
     * CSS 用它做暗色视觉修正（热力图档位亮度翻转、金属色文字提亮等）。
     * 预览（previewThemeId）同样生效，退出预览随 applyTheme 重算。 */
    if (theme.dark) document.documentElement.dataset.dark = '1';
    else delete document.documentElement.dataset.dark;
  }

  /* 收藏品的解锁条件文案。成就类引用会查出中文名；隐藏成就不公开条件。 */
  function cosmeticUnlockText(asset) {
    if (!collections) return '条件未知';
    return collections.unlockText(asset, {
      achievementName: achievementId => {
        const definition = progress.ACHIEVEMENTS.find(item => item.id === achievementId);
        if (!definition) return null;
        return definition.hidden ? null : definition.zh;
      }
    });
  }

  function isCosmeticUnlocked(asset) {
    return collections ? collections.isAssetUnlocked(progress.getState(), asset) : false;
  }

  /* 给资产补 type（购买记录按 类型:id 记账，跨类型重名不会互相解锁） */
  function typedAssets(type, list) {
    return (list || []).map(item => Object.assign({}, item, { type }));
  }

  /* ---------- v4.3 Batch 6（交接 J）：收藏柜按解锁方式分组 ----------
   * 四种解锁方式各成一组：默认可用 / 学习解锁（等级）/ 成就解锁 / 叶片解锁。
   * 空组不渲染。组内顺序保持数据文件的原始顺序（价格/等级递增的编排）。 */
  const UNLOCK_GROUPS = [
    { kind: 'default', zh: '默认可用' },
    { kind: 'level', zh: '学习解锁' },
    { kind: 'achievement', zh: '成就解锁' },
    { kind: 'coins', zh: '叶片解锁' }
  ];

  function groupByUnlock(assets) {
    return UNLOCK_GROUPS
      .map(group => Object.assign({}, group, {
        items: (assets || []).filter(asset => unlockGroupKind(asset) === group.kind)
      }))
      .filter(group => group.items.length);
  }

  /* 展示归类：「Lv.1 即可用」的等级资产就是默认款（头像框历史上用 level:1
   * 建模默认框），归进“默认可用”组；解锁判定本身仍走 collections.js，不受影响。 */
  function unlockGroupKind(asset) {
    const unlock = asset.unlock || {};
    if (unlock.kind === 'level' && Number(unlock.value) === 1) return 'default';
    return unlock.kind;
  }

  /* 已拥有 / 未拥有徽章（交接 J：每件资产都要显示拥有状态） */
  function ownedChip(unlocked) {
    return node('span', unlocked ? '已拥有' : '未拥有', `collection-owned${unlocked ? ' is-owned' : ''}`);
  }

  /* 单件资产的拥有判定：头像框走 frames() 预算好的 unlocked，其余走 collections */
  function itemOwned(item) {
    return typeof item.unlocked === 'boolean' ? item.unlocked : isCosmeticUnlocked(item);
  }

  /* 组内已拥有数 */
  function groupOwnedCount(items) {
    return items.filter(itemOwned).length;
  }

  /* v4.3 Batch 9（交接 M21）：收藏筛选 / 排序。面板级视图选项只记在内存里
   * （不写档案——它是浏览偏好不是学习数据），收藏柜与选择弹窗同时生效；
   * 排序按叶片价格，非叶片款排最后且保持原有相对顺序（sort 是稳定的）。 */
  let collectionFilter = 'all';    // all | owned | unowned
  let collectionSort = 'default';  // default | price-asc | price-desc

  function collectionView(items) {
    let list = items;
    if (collectionFilter === 'owned') list = list.filter(itemOwned);
    else if (collectionFilter === 'unowned') list = list.filter(item => !itemOwned(item));
    if (collectionSort !== 'default') {
      const price = item => (collections && collections.assetPrice(item)) || Number.MAX_SAFE_INTEGER;
      list = list.slice().sort((a, b) => (collectionSort === 'price-asc' ? price(a) - price(b) : price(b) - price(a)));
    }
    return list;
  }

  function buildCollectionControls() {
    const controls = node('div', undefined, 'collection-controls');
    const makeSelect = (labelText, ariaLabel, options, current, onChange) => {
      const wrap = node('label', undefined, 'collection-control');
      wrap.append(node('span', labelText, 'meta'));
      const select = document.createElement('select');
      select.setAttribute('aria-label', ariaLabel);
      options.forEach(pair => {
        const option = document.createElement('option');
        option.value = pair[0];
        option.textContent = pair[1];
        select.append(option);
      });
      select.value = current;
      select.addEventListener('change', () => { onChange(select.value); refreshProfilePanel(); });
      wrap.append(select);
      return wrap;
    };
    controls.append(makeSelect('筛选', '按拥有状态筛选收藏品', [
      ['all', '全部显示'], ['owned', '只看已拥有'], ['unowned', '只看未拥有']
    ], collectionFilter, value => { collectionFilter = value; }));
    controls.append(makeSelect('排序', '收藏品排序', [
      ['default', '默认顺序'], ['price-asc', '叶片价格从低到高'], ['price-desc', '叶片价格从高到低']
    ], collectionSort, value => { collectionSort = value; }));
    controls.append(node('span', '排序只影响叶片解锁品；筛选与排序是浏览偏好，不写进学习档案。', 'meta'));
    return controls;
  }

  /* 叶片解锁按钮：解锁走 collections.purchaseAsset（余额校验 + 闩锁），
   * 成功后整体刷新界面（叶片余额、收藏计数都会变）。
   * v4.3（交接 B1）：按钮文案用「叶片解锁」，不用“购买 / 兑换”这类货币动词。 */
  function buildBuyButton(asset, onDone) {
    const price = collections ? collections.assetPrice(asset) : null;
    const buy = node('button', `叶片解锁（${price}）`, 'button-secondary');
    buy.type = 'button';
    buy.addEventListener('click', () => {
      const result = progress.purchaseCosmetic(asset);
      profileNotice = result.ok ? `已用 ${price} 叶片解锁「${asset.zh}」。` : result.error;
      if (result.ok && typeof onDone === 'function') onDone();
      refreshAll();
    });
    return buy;
  }

  /* 头像 + 当前装备的头像框。框的视觉全部由 CSS 类实现（见 style.css），
   * 这里只负责挂上对应的 class，不内联任何样式。
   * alt 为空表示这是装饰性图片：旁边一定有昵称与等级文字作为可访问名称。 */
  function buildAvatar(profile, size) {
    const frame = resolveFrame(profile.equippedFrameId);
    const wrap = node('div', undefined, `avatar avatar-${size}${frame ? ' ' + frame.css : ''}`);
    const image = document.createElement('img');
    image.className = 'avatar-img';
    image.alt = '';
    if (profile.avatarData) {
      image.src = profile.avatarData;
    } else {
      const companionDescriptor = companionAvatarDescriptor(profile.avatarId);
      if (companionDescriptor) {
        image.src = companionDescriptor.source === 'file'
          ? companionDescriptor.value : SVG_PREFIX + encodeURIComponent(companionDescriptor.value);
      } else {
        const avatar = resolveAvatar(profile.avatarId);
        if (avatar) image.src = SVG_PREFIX + encodeURIComponent(avatar.svg);
      }
    }
    wrap.append(image);
    return wrap;
  }

  /* 成就图标（§7.1 + v4.3 交接 H）：隐藏成就在解锁前一律用上锁图标，不泄露
   * 它属于哪一类；凡是在 achievementMilestones 里有专属图标的成就（里程碑与
   * 重要成就）都优先用专属图标——不再要求 milestone 标记，显著减少“多人共用
   * 同一个类别图标”的重复感；其余成就按类别图标族渲染。 */
  function achievementIcon(achievement, unlockedAt) {
    if (!icons) return null;
    if (achievement.hidden && !unlockedAt) return icons.hidden;
    if (icons.achievementMilestones && icons.achievementMilestones[achievement.id]) {
      return icons.achievementMilestones[achievement.id];
    }
    return icons.achievementCategories ? icons.achievementCategories[achievement.category] || icons.hidden : icons.hidden;
  }

  /* ---------- v4：本站原创 SVG 概念图（§9） ----------
   * 图是本地 .svg 文件，用 <img> 引用而不是把标记注入页面：既避开本项目
   * “运行时不得用字符串直接注入标记”的约束，也让 file:// 双击打开时不需要
   * 任何额外配置。每张图都同时给出 alt、figcaption 与要点列表，因此图片加载
   * 失败或被关掉时，信息本身一点都不会丢。
   * 清单缺失时返回空数组，对应的课只是少一张图，正文照常渲染。 */
  function diagramsFor(lessonId) {
    if (!diagrams || !Array.isArray(diagrams.diagrams)) return [];
    return diagrams.diagrams.filter(item => item.lessonId === lessonId);
  }

  function buildDiagram(item) {
    const figure = node('figure', undefined, 'concept-diagram');
    const image = document.createElement('img');
    image.className = 'diagram-img';
    image.src = `${diagrams.directory || ''}${item.file}`;
    image.alt = item.alt;
    figure.append(image);
    const caption = node('figcaption', undefined, 'diagram-caption');
    caption.append(node('p', item.zhTitle, 'diagram-title'));
    caption.append(node('p', item.caption));
    const points = node('ul', undefined, 'diagram-points');
    item.points.forEach(point => points.append(node('li', point)));
    caption.append(points);
    figure.append(caption);
    return figure;
  }

  /* ---------- 学习进度 UI（v3） ---------- */

  /* v4.2（交接 §2.2）：跨标签页实时同步。storage 事件只在“其他标签页”修改
   * 本站存储时触发，正好用来在课页勾选完成的瞬间刷新已打开的首页 Dashboard，
   * 不需要用户手动刷新。file:// 或存储不可用时事件不会来，界面保持原行为。
   * v4.3（交接 A3）：补上**同标签页**的后退/前进——bfcache 恢复的页面
   * JS 内存还是离开时的旧状态，而 storage 事件对同标签页导航不触发。
   * pageshow 且 event.persisted 为真时从存储重载并整体刷新：
   * 首页 → 课程页勾选完成 → 后退，首页数字立即正确。 */
  function watchStorage() {
    if (!progress || typeof window.addEventListener !== 'function') return;
    const reloadAndRefresh = () => {
      /* 先从存储重载内存状态，再刷新界面：本页的 state 是加载时的副本，
       * 不重载的话只会把旧数字重画一遍（v4.2 §2.2 的真实缺陷）。 */
      if (!progress.reloadFromStorage()) return;
      refreshAll();
      /* 课页的四个勾选框也跟着变化走，避免两页各显示一种状态 */
      if (lessonToggleSync && lessonToggleSync.lessonId === activeLessonId) lessonToggleSync.sync();
    };
    window.addEventListener('storage', event => {
      if (event.key !== null && event.key !== progress.storageKey()) return;
      reloadAndRefresh();
    });
    window.addEventListener('pageshow', event => {
      /* persisted=false 的 pageshow 是正常加载流程，页面本来就刚读过存储，
       * 重载反而会把启动后、首次保存前的内存变更丢掉，因此只处理 bfcache 恢复。 */
      if (!event || event.persisted !== true) return;
      reloadAndRefresh();
    });
  }

  /* 课页勾选框的跨标签页同步句柄。只在课页存在，由 buildLessonProgress 登记。 */
  let lessonToggleSync = null;

  /* v4.2（交接 §2）：保存失败与“打开了另一份存储”都曾有真实用户踩坑。
   * 这里集中给出中文提示：存储写入失败（配额 / 浏览器策略），以及
   * 当前数据绑定在哪个地址（localhost / 127.0.0.1 / 不同端口互不相通）。
   * v4.3（交接 A2）：新增自动读档的两种告警——整份读不出来（已冻结写入、
   * 原始数据仍在）与宽容模式丢弃了部分坏内容（已知数据已保留）。 */
  function storageWarningText() {
    if (!progress) return null;
    if (progress.autoLoadInfo) {
      const info = progress.autoLoadInfo();
      if (info.failed) {
        return `学习档案读取失败（${info.error}）。为避免覆盖你已有的数据，本站已停止写入学习进度，原始档案仍完整保留在这台设备里；当前页面按空档案显示。请在「个人资料 → 学习档案」里恢复备份、导入之前导出的档案，或重置学习进度；处理之前新的勾选与计时不会保存。`;
      }
      if (info.warnings.length) {
        return `学习档案里有部分内容无法识别（可能来自其它版本或被手工修改过），已自动跳过：${info.warnings.join('；')}。其余已知学习数据已完整保留，建议导出一份档案核对。`;
      }
    }
    const health = progress.storageHealth();
    if (health.persistent && !health.saveOk) {
      return '学习进度保存失败：浏览器本地存储不可用或已满。刚才的勾选只保留在当前页面，刷新后会丢失。请检查浏览器是否允许本站使用本地存储，或清理浏览器数据后重试。';
    }
    return null;
  }

  function dataLocationText() {
    if (!progress.isPersistent()) {
      return '学习数据只保存在这台设备的这个浏览器里。本站不上传、不同步、不需要账号；换设备或换浏览器请用下方的导出与导入。';
    }
    return `学习数据只保存在这台设备的这个浏览器里，并与打开本站的地址绑定（当前地址：${location.host}）。请始终用同一个地址打开本站：localhost 与 127.0.0.1、或不同端口是不同的存储空间，换地址打开会看到一份全新的空进度，原来的数据仍留在原来的地址里，可用导出 / 导入学习档案搬过去。`;
  }

  const statCell = (label, value, hint) => {
    const cell = node('div', undefined, 'stat');
    cell.append(node('span', label, 'stat-label'), node('span', value, 'stat-value'));
    if (hint) cell.append(node('span', hint, 'stat-hint'));
    return cell;
  };

  const findLesson = id => data.lessons.find(lesson => lesson.id === id) || null;

  /* 成就首次解锁只做低干扰提示：底部静态小条，自动消失，不弹窗、无动画。
   * v4.2：可在学习设置里关闭（§15）。 */
  function showAchievementNote(unlockedIds) {
    if (progress && progress.settings().showAchievementNotes === false) return;
    unlockedIds.forEach(id => {
      const definition = progress.ACHIEVEMENTS.find(item => item.id === id);
      if (!definition) return;
      showRewardNote(`解锁成就 · ${definition.zh}：${definition.desc}`);
      /* v4.3（交接 C1）：新成就连带解锁了新装扮时，追加一条“新奖励可使用”
       * 提示——第一次进入第一课解锁「启程框」正是这条链路的第一个落点。
       * 提示与成就条同样是底部静态小条，低干扰但明显，不弹窗轰炸。 */
      newlyUnlockedCosmeticNames([id]).forEach(name => {
        showRewardNote(`新装扮可使用 · ${name}：打开右上角个人资料 → 装扮收藏，马上就能装备。`);
      });
    });
  }

  /* v4.3（交接 C1）：通用低干扰提示条（成就 / 晋升 / 挑战 / 新装扮共用样式）。
   * 与成就提示同一开关（showAchievementNotes）控制，避免提示渠道各自为政。 */
  function showRewardNote(text) {
    if (progress && progress.settings().showAchievementNotes === false) return;
    const note = node('p', text, 'achievement-note');
    note.setAttribute('role', 'status');
    document.body.append(note);
    window.setTimeout(() => note.remove(), 10000);
  }

  /* 刚解锁的成就连带解锁了哪些装扮（成就类 unlock 的资产）。
   * 只扫四类外观资产的 unlock.kind === 'achievement'，返回「类型「名称」」。 */
  function newlyUnlockedCosmeticNames(unlockedIds) {
    const idSet = new Set(unlockedIds);
    const names = [];
    const scan = (list, typeZh) => {
      (list || []).forEach(asset => {
        if (asset && asset.unlock && asset.unlock.kind === 'achievement' && idSet.has(asset.unlock.value) && asset.zh) {
          names.push(`${typeZh}「${asset.zh}」`);
        }
      });
    };
    if (progress) scan(progress.frames(), '头像框');
    scan(avatarList(), '头像');
    if (companions && Array.isArray(companions.companions)) scan(companions.companions, '学习伙伴形象');
    if (themes && Array.isArray(themes.themes)) scan(themes.themes, '主题');
    return names;
  }

  /* v4.5（交接 Core E2）：等级区间 (fromLevel, toLevel] 内新解锁的装扮名单。
   * 扫五类资产（头像框 / 头像 / 伙伴形象 / 主题 / 伙伴装扮四槽）的
   * unlock.kind === 'level'，供合并式升级轻提示报出「新解锁」——升级奖励
   * 全部是装扮解锁（无经济发放），一次升级跨多级也只发一条提示。 */
  function levelUnlockedCosmeticNames(fromLevel, toLevel) {
    const names = [];
    const scan = (list, typeZh) => {
      (list || []).forEach(asset => {
        if (asset && asset.unlock && asset.unlock.kind === 'level' &&
            asset.unlock.value > fromLevel && asset.unlock.value <= toLevel && asset.zh) {
          names.push(`${typeZh}「${asset.zh}」`);
        }
      });
    };
    if (progress) scan(progress.frames(), '头像框');
    scan(avatarList(), '头像');
    if (companions && Array.isArray(companions.companions)) scan(companions.companions, '学习伙伴形象');
    if (themes && Array.isArray(themes.themes)) scan(themes.themes, '主题');
    if (wardrobe) {
      scan(wardrobe.HAIRS, '伙伴发型');
      scan(wardrobe.OUTFITS, '伙伴服装');
      scan(wardrobe.ACCESSORIES, '伙伴配饰');
      scan(wardrobe.PALETTES, '伙伴色板');
    }
    return names;
  }

  /* 学习档案的导出 / 导入控件。首页 Dashboard 与个人资料面板共用同一套实现，
   * 因此两处的行为、文案与二次确认完全一致，不会出现“面板里能导入、首页不能”
   * 之类的分叉。沿用 v3 的两步流程：先 previewImport 只校验不写入，
   * 校验通过后再次确认会覆盖本机档案，取消则什么都不改。 */
  function buildArchiveControls() {
    const status = node('p', undefined, 'progress-status');
    status.setAttribute('role', 'status');
    if (archiveNotice) status.textContent = archiveNotice;
    /* 提示同时写进 archiveNotice 与当前 status 元素：
     * 导入成功后会重建 Dashboard 与面板，只写元素的话这条 status 节点会被
     * 一起替换掉，用户根本看不到“导入成功”。这是 v3 就存在的缺陷，本轮修掉。 */
    const say = message => { archiveNotice = message; status.textContent = message; };
    const actions = node('div', undefined, 'progress-actions');
    const exportButton = node('button', '导出学习档案', 'button-secondary');
    exportButton.type = 'button';
    exportButton.addEventListener('click', () => {
      if (!progress.isPersistent()) {
        say(FILE_MODE_NOTE);
        return;
      }
      const fileName = progress.downloadArchive();
      say(`已导出到下载目录：${fileName}。档案里包含完成状态、有效学习时长、XP、成就，以及昵称、头像与头像框。`);
    });
    const importButton = node('button', '导入学习档案', 'button-secondary');
    importButton.type = 'button';
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';
    fileInput.className = 'visually-hidden';
    /* 直接文件模式下导入无法落盘：importArchive 只会改内存里的状态，
     * 刷新页面就全没了，却仍然会提示“导入成功”。这与导出同样按不可用处理，
     * 给出明确原因，而不是让用户以为档案已经保存。 */
    fileInput.disabled = !progress.isPersistent();
    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const text = String(reader.result || '');
        const preview = progress.previewImport(text);
        if (!preview.ok) {
          say(`导入失败，已保持当前档案不变：${preview.error}`);
          return;
        }
        if (!window.confirm('导入会覆盖当前保存在这台设备上的学习档案（完成状态、有效学习时长、XP、成就，以及昵称、头像与头像框）。确定继续吗？')) {
          say('已取消导入，当前档案未改变。');
          return;
        }
        const result = progress.importArchive(text);
        if (result.ok) {
          /* 先记下提示再重建：重建会换掉当前 status 节点，archiveNotice 保证
           * 新节点渲染出来时仍然带着这句话。 */
          say('导入成功，档案已更新。');
          refreshAll();
        } else {
          say(`导入失败，已保持当前档案不变：${result.error}`);
        }
      });
      reader.addEventListener('error', () => {
        say('读取文件失败，请确认选择的是导出的 JSON 档案。');
      });
      reader.readAsText(file);
      fileInput.value = '';
    });
    importButton.addEventListener('click', () => {
      if (!progress.isPersistent()) {
        say(FILE_MODE_NOTE);
        return;
      }
      fileInput.click();
    });
    actions.append(exportButton, importButton, fileInput);
    return [actions, status];
  }

  /* 面板与提示的模块级引用。提示文字放在模块变量里而不是只放在 DOM 节点上，
   * 是为了在面板重建之后仍然能显示出来。 */
  let playerEntry = null;
  let profileDialog = null;
  let profileBody = null;
  let profileNotice = '';
  let archiveNotice = '';
  /* 面板里会随时间变化的两个数值格。单独留引用是为了只更新它们、
   * 不整体重建面板——重建会销毁正在输入的昵称框，也会打断刚显示的提示。 */
  let liveStatToday = null;
  let liveStatTotal = null;

  /* ---------- v4.4：统一二级容器 sheet（交接 A3 + audit U3/U4） ----------
   * 首页极简化后，所有大块内容都住进 sheet：原生 <dialog> + showModal，
   * 焦点陷阱、Esc、backdrop 是浏览器免费给的可访问性行为。
   * 形态由 CSS 决定（shadcn Sheet 模式的纯 CSS 复刻）：
   *   宽屏 ≥760px：右侧滑入的定宽抽屉；窄屏：全屏 sheet。
   * 焦点管理补 Shoelace 的两件事：打开时记录 trigger，关闭后焦点归还。
   * 内容惰性构建 + 每次打开都重建 bodyBuilder()——数据永远新鲜，
   * 也避免常驻 DOM 里挂着一堆看不见的统计节点。 */
  const sheetRegistry = {};

  function buildSheetDialog(id, titleText, bodyBuilder) {
    const dialog = node('dialog', undefined, 'sheet');
    dialog.setAttribute('aria-labelledby', `sheet-title-${id}`);
    /* 原生 Esc / cancel 路径不经过 closeSheet——用 close 事件统一做焦点归还，
     * 任何关闭方式（Esc、关闭按钮、代码调用）行为一致（audit U4）。 */
    dialog.addEventListener('close', () => {
      const entry = sheetRegistry[id];
      if (entry && entry.trigger && typeof entry.trigger.focus === 'function') entry.trigger.focus();
    });
    const head = node('div', undefined, 'sheet-head dialog-head');
    const title = node('h2', titleText);
    title.id = `sheet-title-${id}`;
    const closeButton = node('button', '关闭', 'dialog-close');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', `关闭${titleText}`);
    closeButton.addEventListener('click', () => closeSheet(id));
    head.append(title, closeButton);
    const body = node('div', undefined, 'sheet-body');
    body.append(...bodyBuilder());
    dialog.append(head, body);
    return { dialog, body };
  }

  function registerSheet(id, titleText, bodyBuilder, onOpen) {
    sheetRegistry[id] = { titleText, bodyBuilder, dialog: null, body: null, trigger: null, onOpen: onOpen || null };
  }

  function isSheetOpen(id) {
    const entry = sheetRegistry[id];
    if (!entry || !entry.dialog) return false;
    if (entry.dialog.open) return true;
    return typeof entry.dialog.hasAttribute === 'function' && entry.dialog.hasAttribute('open');
  }

  function openSheet(id, triggerElement) {
    const entry = sheetRegistry[id];
    if (!entry) return null;
    /* onOpen 钩子：视图状态复位等（如世界地图每次打开都回到 World 列表） */
    if (typeof entry.onOpen === 'function') entry.onOpen();
    if (!entry.dialog) {
      const built = buildSheetDialog(id, entry.titleText, entry.bodyBuilder);
      entry.dialog = built.dialog;
      entry.body = built.body;
      document.body.append(entry.dialog);
    } else {
      entry.body.replaceChildren(...entry.bodyBuilder());
    }
    if (triggerElement) entry.trigger = triggerElement;
    if (typeof entry.dialog.showModal === 'function') {
      if (!entry.dialog.open) entry.dialog.showModal();
    } else {
      entry.dialog.setAttribute('open', '');
    }
    return entry.dialog;
  }

  function closeSheet(id) {
    const entry = sheetRegistry[id];
    if (!entry || !entry.dialog) return;
    if (typeof entry.dialog.close === 'function') entry.dialog.close();
    else entry.dialog.open = false;
    /* 焦点归还触发元素（audit U4）；trigger 可能已随首页重建脱离 DOM，
     * 此时浏览器把焦点放回 body，不会出现焦点悬空。 */
    if (entry.trigger && typeof entry.trigger.focus === 'function') entry.trigger.focus();
  }

  /* 打开中的 sheet 全部重建（状态变化后调用；没打开的一个都不碰）。 */
  function refreshOpenSheets() {
    Object.keys(sheetRegistry).forEach(id => {
      const entry = sheetRegistry[id];
      if (entry.dialog && entry.body && isSheetOpen(id)) {
        entry.body.replaceChildren(...entry.bodyBuilder());
      }
    });
  }

  /* ---------- 右上角常驻玩家入口（§2.1） ----------
   * 首页与所有课程页都显示。刻意用 <button> 而不是 <a>：它打开的是本页面板，
   * 不做导航，用链接会让浏览器的“返回”行为变得含糊。 */

  function playerEntryChildren(summary) {
    const meta = node('span', undefined, 'player-meta');
    meta.append(
      node('span', `Lv.${summary.level}`, 'player-level'),
      node('span', summary.nickname, 'player-name'),
      /* v4.4（交接 A1）：叶片进 chip——它是解锁装扮的货币，属于“我是谁/我有什么”
       * 的一等信息；窄屏由 CSS 隐藏文字只留数字。 */
      node('span', `${summary.coins} 叶片`, 'player-coins')
    );
    return [buildAvatar(summary, 'sm'), meta];
  }

  function buildPlayerEntry() {
    const summary = progress.summary();
    const button = node('button', undefined, 'player-entry');
    button.type = 'button';
    button.append(...playerEntryChildren(summary));
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-label', `打开个人资料：${summary.nickname}，等级 Lv.${summary.level}`);
    button.addEventListener('click', () => openProfilePanel(null, button));
    return button;
  }

  /* 把品牌之外的原有头部链接收进右侧组，保持“品牌在左、操作在右”，
   * 并且不改动 HTML 里已有的链接本身。
   * 单独抽出容器是因为“课程目录”按钮也要放进同一个容器，而它在 progress.js
   * 缺失时仍然应该可用。 */
  function mountHeaderRight() {
    const header = document.querySelector('.site-header');
    if (!header) return null;
    const right = node('div', undefined, 'header-right');
    [...header.children].slice(1).forEach(child => right.append(child));
    header.append(right);
    return right;
  }

  function mountPlayerEntry(right) {
    if (!right) return null;
    playerEntry = buildPlayerEntry();
    right.append(playerEntry);
    return playerEntry;
  }

  /* ---------- 课程页的“课程目录”抽屉（§6.5） ----------
   * 用 dialog 覆盖层而不是常驻左侧栏：常驻侧栏会压缩正文阅读宽度（§6.5 明确禁止），
   * 覆盖层在宽屏窄屏都不影响 .reading 的版心。
   * 与个人资料面板同样的约束：挂在 document.body 上、全程不用 details/summary，
   * 因此既不影响课页 main h2 的章节序列，也不会让“页面第一个 summary 是自测答案”失效。 */
  let catalogDialog = null;
  let catalogBody = null;
  let catalogButton = null;
  /* v4.4 Stretch I6/I7/I8：目录搜索与过滤（纯视图状态，不进 progress 档案）。
   * filter: all=全部 / open=只看已开放中文内容 / review=只看标记了需要复习的课 */
  let catalogQuery = '';
  let catalogFilter = 'all';

  function catalogEntryMatches(entry) {
    const lesson = findLesson(entry.slug);
    const usable = Boolean(entry.available) && Boolean(lesson);
    if (catalogFilter === 'open' && !usable) return false;
    if (catalogFilter === 'review') {
      if (!usable || !progress) return false;
      if (progress.lessonState(entry.slug).needsReview !== true) return false;
    }
    if (catalogQuery) {
      const q = catalogQuery.toLowerCase();
      const zh = String((lesson ? lesson.zh : entry.zh) || '').toLowerCase();
      const en = String((lesson ? lesson.title : entry.title) || '').toLowerCase();
      const slug = String(entry.slug || '').toLowerCase();
      if (!zh.includes(q) && !en.includes(q) && !slug.includes(q)) return false;
    }
    return true;
  }

  function catalogBodyChildren() {
    const total = catalogTotal();
    const intro = node('p', total
      ? `官方 Foundations 完整目录，共 ${total} 课。本站已开放 ${data.lessons.length} 课中文自足讲解，可以直接点开；标为“暂未开放”的课程还没有中文正文，请回官方原课学习。`
      : `本站已开放 ${data.lessons.length} 课中文自足讲解。完整目录数据未载入，请确认 catalog.js 与 HTML 文件在同一个文件夹里。`, 'muted');

    const officialCatalog = link('查看 The Odin Project 官方课程目录 ↗', 'https://www.theodinproject.com/paths/foundations/courses/foundations', 'catalog-official-link', true);
    officialCatalog.setAttribute('rel', 'noopener noreferrer');

    /* 搜索 + 过滤控件：视觉语法与主题 picker 同一套（theme-search-row / theme-chip，
     * 交接 H4 统一 modal 与控件语法），类名前缀保持既有 CSS 不动 */
    const searchRow = node('div', undefined, 'theme-search-row catalog-controls');
    const search = document.createElement('input');
    search.type = 'search';
    search.className = 'profile-input theme-search catalog-search';
    search.placeholder = '搜索课程：中文名、英文原题或 slug…';
    search.setAttribute('aria-label', '搜索课程目录');
    search.value = catalogQuery;
    const countLine = node('p', '', 'theme-count catalog-count meta');
    searchRow.append(search, countLine);
    const chips = node('div', undefined, 'theme-chips catalog-chips');
    chips.setAttribute('role', 'group');
    chips.setAttribute('aria-label', '目录过滤');

    const wrap = node('div', undefined, 'catalog-compact');
    const CATALOG_FILTERS = [['all', '全部'], ['open', '已开放中文'], ['review', '需要复习']];
    const chipButtons = [];
    CATALOG_FILTERS.forEach(([id, label]) => {
      const chip = node('button', label, `theme-chip catalog-chip${catalogFilter === id ? ' is-active' : ''}`);
      chip.type = 'button';
      chip.setAttribute('aria-pressed', catalogFilter === id ? 'true' : 'false');
      chip.addEventListener('click', () => {
        catalogFilter = id;
        chipButtons.forEach(item => {
          const active = item === chip;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        refresh();
      });
      chipButtons.push(chip);
      chips.append(chip);
    });

    function refresh() {
      const units = catalogSections(catalogEntryMatches);
      const source = effectiveCatalog();
      const shown = source.lessons.filter(catalogEntryMatches).length;
      const filtering = Boolean(catalogQuery) || catalogFilter !== 'all';
      countLine.textContent = filtering ? `显示 ${shown} / ${total || source.lessons.length} 课` : '';
      if (!units.length) {
        wrap.replaceChildren(node('p', catalogFilter === 'review'
          ? '没有标记「需要复习」的课。在任意一课勾选「需要复习」后，这里会出现它。'
          : '没有匹配的课程。换个关键词，或点「全部」清除筛选。', 'muted empty-state'));
        return;
      }
      wrap.replaceChildren(...units);
    }
    search.addEventListener('input', () => {
      catalogQuery = search.value.trim();
      refresh();
    });
    refresh();
    return [intro, officialCatalog, searchRow, chips, wrap];
  }

  function buildCatalogDialog() {
    const dialog = node('dialog', undefined, 'catalog-dialog');
    dialog.setAttribute('aria-labelledby', 'catalog-panel-title');
    const head = node('div', undefined, 'dialog-head');
    const title = node('h2', '课程目录');
    title.id = 'catalog-panel-title';
    const closeButton = node('button', '关闭', 'dialog-close');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', '关闭课程目录');
    closeButton.addEventListener('click', closeCatalogDialog);
    head.append(title, closeButton);
    catalogBody = node('div', undefined, 'catalog-body');
    catalogBody.append(...catalogBodyChildren());
    dialog.append(head, catalogBody);
    return dialog;
  }

  /* v4.4：目录 dialog 可从 header 按钮或首页 hero 卡打开——记录真实触发者，
   * 关闭后焦点归还原处（audit U4）。listener 直接传函数引用时收到的是事件
   * 对象，没有 focus 方法，会落到 activeElement 分支，因此两种写法都安全。 */
  let catalogTriggerEl = null;

  function openCatalogDialog(triggerElement) {
    if (triggerElement && typeof triggerElement.focus === 'function') {
      catalogTriggerEl = triggerElement;
    } else {
      const active = document.activeElement;
      if (active && active !== document.body && typeof active.focus === 'function') catalogTriggerEl = active;
    }
    if (!catalogDialog) {
      catalogDialog = buildCatalogDialog();
      document.body.append(catalogDialog);
    } else {
      /* 每次打开都重建内容：当前课高亮要跟着 activeLessonId 走 */
      catalogBody.replaceChildren(...catalogBodyChildren());
    }
    if (typeof catalogDialog.showModal === 'function') catalogDialog.showModal();
    else catalogDialog.setAttribute('open', '');
  }

  function closeCatalogDialog() {
    if (!catalogDialog) return;
    if (typeof catalogDialog.close === 'function') catalogDialog.close();
    else catalogDialog.open = false;
    /* 焦点还给触发按钮，键盘用户不会丢失位置 */
    const target = catalogTriggerEl || catalogButton;
    if (target && typeof target.focus === 'function') target.focus();
  }

  function mountCatalogButton(right) {
    if (!right) return null;
    catalogButton = node('button', '课程目录', 'catalog-trigger');
    catalogButton.type = 'button';
    catalogButton.setAttribute('aria-haspopup', 'dialog');
    catalogButton.addEventListener('click', openCatalogDialog);
    right.append(catalogButton);
    return catalogButton;
  }

  /* ---------- v4.4（交接 A1/B2）：header 主题快捷入口 ----------
   * 色块按钮显示当前主题预览色，点击直接打开主题选择器。主题是高频、
   * 感知强的功能，不应该埋在个人资料面板深处（交接 B2）。
   * 色块用内联 style 的三色小条（bg/accent/ink），跟随当前主题刷新。 */
  let themeQuickButton = null;

  function themeQuickSwatch() {
    const current = resolveTheme(progress ? progress.cosmetics().themeId : null);
    const swatch = node('span', undefined, 'theme-quick-swatch');
    swatch.setAttribute('aria-hidden', 'true');
    if (current && current.swatch) {
      swatch.style.background = `linear-gradient(135deg, ${current.swatch.bg} 0 33%, ${current.swatch.accent} 33% 66%, ${current.swatch.ink} 66% 100%)`;
    }
    return swatch;
  }

  function mountThemeButton(right) {
    if (!right || !themes || !progress) return null;
    themeQuickButton = node('button', undefined, 'theme-quick');
    themeQuickButton.type = 'button';
    themeQuickButton.append(themeQuickSwatch(), node('span', '主题'));
    const current = resolveTheme(progress.cosmetics().themeId);
    themeQuickButton.setAttribute('aria-haspopup', 'dialog');
    themeQuickButton.setAttribute('aria-label', `更换页面主题（当前：${current ? current.zh : '园地'}）`);
    themeQuickButton.addEventListener('click', () => openThemePicker(themeQuickButton));
    right.append(themeQuickButton);
    return themeQuickButton;
  }

  function refreshThemeButton() {
    if (!themeQuickButton) return;
    themeQuickButton.replaceChildren(themeQuickSwatch(), node('span', '主题'));
    const current = resolveTheme(progress.cosmetics().themeId);
    themeQuickButton.setAttribute('aria-label', `更换页面主题（当前：${current ? current.zh : '园地'}）`);
  }

  function refreshPlayerEntry() {
    if (!playerEntry) return;
    const summary = progress.summary();
    playerEntry.replaceChildren(...playerEntryChildren(summary));
    playerEntry.setAttribute('aria-label', `打开个人资料：${summary.nickname}，等级 Lv.${summary.level}`);
  }

  /* 状态变化后统一刷新三处显示。每处都自带“不存在就跳过”的保护，
   * 因此首页没有课页控件、面板没打开时调用也不会出错。 */
  /* 形象或主题变化后刷新右下角按钮（不重建 dialog 本身） */
  function refreshAssistantTrigger() {
    if (!assistantTrigger) return;
    const companion = resolveCompanion(progress.cosmetics().companionId);
    const portrait = companionPortraitImage(companion, { slot: 'corner' }, 'assistant-avatar', '');
    const name = companionDisplayName();
    assistantTrigger.replaceChildren();
    if (portrait) assistantTrigger.append(portrait);
    /* v4.9：按钮**只显示头像，不显示任何角色名**（用户要求：主页与右下角都不
     * 出名字，只有点开面板后才显示）。昵称没有丢——它仍在 aria-label 里，读屏
     * 用户照样能听到「打开学习伙伴小诺…」，只是不再有可见文字，无障碍不退化。 */
    assistantTrigger.setAttribute('aria-label', `打开学习伙伴${name}：查看今天的学习情况与下一步建议`);
  }

  function refreshAll() {
    applyTheme();
    applyUiSettings();
    refreshDashboard();
    refreshHomeCompanion();
    refreshPlayerEntry();
    refreshThemeButton();
    refreshProfilePanel();
    refreshAssistantPanel();
    refreshAssistantTrigger();
  }

  /* ---------- 个人资料面板（§2.1、§3、§4.2、§5） ----------
   * 用原生 <dialog> + showModal()：焦点困在面板内、Esc 可关闭、自带 backdrop，
   * 这些都是浏览器免费给的可访问性行为，不需要引入第三方 UI 库。
   * 面板挂在 document.body 上而不是 <main> 里，因此不影响课页 main h2 的章节
   * 序列；面板内也不使用 details/summary，避免与“自测答案是页面第一个
   * summary”的既有渲染结构冲突。
   * 四个区块：概览、成就、头像与头像框、学习档案。不做多页路由。 */

  function panelNoticeLine() {
    const line = node('p', undefined, 'panel-notice');
    line.setAttribute('role', 'status');
    if (profileNotice) line.textContent = profileNotice;
    return line;
  }

  /* ---------- v4.4（交接 B1/B2）：我的形象——个人中心第一屏 ----------
   * 三个概念区块（我的形象 / 学习伙伴 / 页面主题）承载五个紧邻操作入口：
   * 头像、头像框、学习伙伴、伙伴装扮、主题，每张卡带当前值预览，点击打开对应 picker。
   * 装备入口收敛为一套（B1：消除“快速更换按钮 + 收藏柜”两套重复入口）；主题卡
   * 直接显示当前主题色卡，不用滚动就一眼看到（B2 前置）。
   * 原「概览」的完整 stat grid 不再在这里重复：数字住在首页「学习进度」sheet，
   * 继续学习住在首页 hero 卡——同一信息只有一个家（B1）。 */
  function buildIdentitySection() {
    const summary = progress.summary();
    const cosmetics = progress.cosmetics();
    const block = node('section', undefined, 'profile-section identity-panel');

    /* ---------- v4.5.2 Final Concept Match（P0-5）：学习档案封面 ----------
     * 形象 Tab 首屏重组成一张真正的档案封面（一级容器）：头像（唯一主预览）+
     * 昵称 + 等级 / XP + 等级进度条 + 少量身份信息 + 学习伙伴小关联行。全部字段
     * 来自 progress.summary() 既有口径，不新增任何用户字段；「学习档案」四字
     * 仍只由 CSS content 装饰出现，不进 DOM 文本（profile-ia 红线不变）。 */
    const cover = node('div', undefined, 'profile-cover');
    cover.append(buildAvatar(summary, 'lg'));
    const coverMain = node('div', undefined, 'cover-main');
    coverMain.append(node('p', summary.nickname, 'cover-name'));
    coverMain.append(node('p', `Lv.${summary.level} · ${summary.xp} XP`, 'identity-level cover-level'));
    const levelSpan = summary.xpIntoLevel + summary.xpToNext;
    const levelBar = node('div', undefined, 'level-progress');
    levelBar.setAttribute('role', 'progressbar');
    levelBar.setAttribute('aria-valuemin', '0');
    levelBar.setAttribute('aria-valuemax', String(levelSpan));
    levelBar.setAttribute('aria-valuenow', String(summary.xpIntoLevel));
    levelBar.setAttribute('aria-label', `等级 ${summary.level} 进度：本级已得 ${summary.xpIntoLevel} XP，距 Lv.${summary.level + 1} 还差 ${summary.xpToNext} XP`);
    const levelFill = node('div', undefined, 'level-progress-fill');
    levelFill.style.width = `${levelSpan > 0 ? Math.min(100, Math.max(0, Math.round((summary.xpIntoLevel / levelSpan) * 100))) : 100}%`;
    levelBar.append(levelFill);
    coverMain.append(levelBar);
    coverMain.append(node('p', `Lv.${summary.level} → Lv.${summary.level + 1}：还差 ${summary.xpToNext} XP（本级已得 ${summary.xpIntoLevel} / ${levelSpan}）`, 'meta level-progress-label'));
    const coverTotal = catalogTotal();
    coverMain.append(node('p',
      `已完成 ${summary.completedCount}${coverTotal ? ` / ${coverTotal}` : ''} 课 · 连续 ${summary.streak} 天 · ${summary.coins} 叶片`,
      'meta cover-facts'));
    const coverCompanion = companionCoverLine();
    if (coverCompanion) coverMain.append(coverCompanion);
    cover.append(coverMain);
    block.append(cover);

    /* 昵称编辑是低频操作，收为封面下的次级控件行（测试钉住 .identity-name-field）。 */
    const nickField = node('div', undefined, 'profile-field identity-name-field');
    nickField.append(node('span', `昵称：${summary.nickname}`, 'profile-nickname'));
    const nickInput = document.createElement('input');
    nickInput.type = 'text';
    nickInput.value = summary.nickname;
    nickInput.maxLength = progress.Logic.NICKNAME_MAX_LENGTH;
    nickInput.className = 'profile-input';
    nickInput.setAttribute('aria-label', '昵称（可选，不需要实名）');
    nickInput.disabled = !progress.isPersistent();
    const nickSave = node('button', '修改', 'button-secondary');
    nickSave.type = 'button';
    nickSave.disabled = !progress.isPersistent();
    nickSave.addEventListener('click', () => {
      const result = progress.setNickname(nickInput.value);
      if (!result.ok) {
        profileNotice = result.error;
        refreshProfilePanel();
        return;
      }
      profileNotice = `昵称已保存为「${result.profile.nickname}」。昵称只存在这台设备上，不需要实名。`;
      refreshAll();
    });
    nickField.append(nickInput, nickSave);
    block.append(nickField);

    const frame = resolveFrame(summary.equippedFrameId);
    const companion = resolveCompanion(cosmetics.companionId);
    const theme = resolveTheme(cosmetics.themeId);
    const companionAvatar = companionAvatarEntry(summary.avatarId);
    const avatarName = summary.avatarData
      ? '已上传头像'
      : companionAvatar
        ? `学习伙伴 ${companionAvatar.zh}`
        : ((resolveAvatar(summary.avatarId) || {}).zh || '默认头像');

    /* v4.5（Stretch K5）：新手 1–5 级奖励预览——升级能拿到什么一目了然，
     * 名单与升级轻提示同源（levelUnlockedCosmeticNames），不另维护清单。 */
    const rewardPreview = node('details', undefined, 'level-reward-preview');
    rewardPreview.append(node('summary', '查看 1–5 级新手奖励预览'));
    const rewardList = node('ul', undefined, 'level-reward-list');
    const lv1Row = node('li');
    lv1Row.append(node('span', 'Lv.1', 'level-reward-lv'),
      node('span', '四个默认头像框 + 基础头像 / 主题 / 装扮，随时可用', 'level-reward-names is-reached'));
    rewardList.append(lv1Row);
    for (let lv = 2; lv <= 5; lv += 1) {
      const names = levelUnlockedCosmeticNames(lv - 1, lv);
      if (!names.length) continue;
      const row = node('li');
      const reached = summary.level >= lv;
      row.append(node('span', `Lv.${lv}`, 'level-reward-lv'),
        node('span', `${names.join('、')}${reached ? '（已达到）' : ''}`, reached ? 'level-reward-names is-reached' : 'level-reward-names'));
      rewardList.append(row);
    }
    rewardPreview.append(rewardList);
    block.append(rewardPreview);

    /* 主题色卡预览（三色斜分圆卡，与 header 快捷入口同一语言） */
    const themeSwatch = node('span', undefined, 'appearance-theme-swatch');
    themeSwatch.setAttribute('aria-hidden', 'true');
    if (theme && theme.swatch) {
      themeSwatch.style.background = `linear-gradient(135deg, ${theme.swatch.bg} 0 33%, ${theme.swatch.accent} 33% 66%, ${theme.swatch.ink} 66% 100%)`;
    }
    const companionName = companionDisplayName();
    const companionLabel = companionName;
    const groups = node('div', undefined, 'identity-entries');

    /* kind / title / preview / current / actions / mood：mood 仅伙伴区块使用
     * （P0-6 的一句轻量心情反馈，与伙伴面板同一 mood 规则同源）。 */
    function appearanceGroup(kind, title, preview, current, actions, mood) {
      const card = node('section', undefined, `appearance-group appearance-group-${kind}`);
      card.append(node('h4', title, 'appearance-name'));
      const body = node('div', undefined, 'appearance-group-body');
      if (preview) body.append(preview);
      const text = node('div', undefined, 'appearance-text');
      if (mood) text.append(node('p', mood, 'appearance-mood'));
      text.append(node('span', current, 'appearance-current meta'));
      const actionRow = node('div', undefined, 'appearance-actions');
      actions.forEach(item => {
        const button = node('button', item.label, 'button-secondary appearance-action');
        button.type = 'button';
        button.setAttribute('aria-label', `${item.label}（当前：${current}）`);
        button.addEventListener('click', () => item.open(button));
        actionRow.append(button);
      });
      text.append(actionRow);
      body.append(text);
      card.append(body);
      return card;
    }

    groups.append(
      /* 头像主预览已上移到档案封面，这里保留当前值与两个更换入口（二级容器） */
      appearanceGroup('avatar', '我的形象', null, `${avatarName} · ${frame ? frame.zh : '无头像框'}`, [
        { label: '更换头像', open: openAvatarPicker },
        { label: '更换头像框', open: openFramePicker }
      ]),
      appearanceGroup('companion', '学习伙伴', companion ? companionPortraitImage(companion, { slot: 'profile', mood: 'normal' }, 'appearance-companion-img', '') : null, `${companionLabel} · ${wardrobeSummaryText()}`, [
        { label: '更换伙伴形象', open: openCompanionPicker },
        { label: '更换伙伴装扮', open: openWardrobePicker }
      ], companionMoodLine()),
      appearanceGroup('theme', '页面主题', themeSwatch, theme ? `${theme.zh}${theme.dark ? ' · 深色' : ''}` : '园地', [
        { label: '更换主题', open: openThemePicker }
      ])
    );
    block.append(groups);

    const settingsJump = node('button', '学习设置', 'button-secondary identity-settings-jump');
    settingsJump.type = 'button';
    settingsJump.addEventListener('click', () => switchProfileTab('settings'));
    block.append(settingsJump);
    if (!progress.isPersistent()) block.append(node('p', FILE_MODE_NOTE, 'notice'));
    const profileStorageWarning = storageWarningText();
    if (profileStorageWarning) block.append(node('p', profileStorageWarning, 'notice'));
    return block;
  }

  /* 档案封面上的学习伙伴小关联行：小形象 + 昵称/形象名 + 一句心情（P0-5）。 */
  function companionCoverLine() {
    const companion = resolveCompanion(progress.cosmetics().companionId);
    const portrait = companionPortraitImage(companion, { slot: 'listItem' }, 'cover-companion-img', '');
    if (!portrait) return null;
    const line = node('p', undefined, 'cover-companion');
    line.append(portrait);
    const name = companionDisplayName();
    line.append(node('span', companionNameWithForm(name, companion), 'cover-companion-name'));
    line.append(node('span', companionMoodLine(), 'cover-companion-mood'));
    return line;
  }

  /* 学习伙伴的一句轻量心情反馈（P0-6）：与伙伴面板同一套确定性规则
   * （progress.assistantBrief → companionMood → MOOD_LINES），不新增状态、
   * 不复制判定逻辑；progress 缺助手口径时回落通用一句。 */
  function companionMoodLine() {
    if (progress && typeof progress.assistantBrief === 'function') {
      const info = progress.assistantBrief({ catalogTotal: catalogTotal(), currentLessonId: null });
      const mood = companionMood(info);
      return MOOD_LINES[mood] || MOOD_LINES.normal;
    }
    return MOOD_LINES.normal;
  }

  function buildAchievementCell(achievement, unlockedAt) {
    const unlocked = Boolean(unlockedAt);
    /* 隐藏成就在解锁前不公开名称与条件（§4.2） */
    const concealed = Boolean(achievement.hidden) && !unlocked;
    const cell = node('li', undefined, `achievement-cell ${unlocked ? 'is-unlocked' : 'is-locked'}`);
    const iconMarkup = achievementIcon(achievement, unlockedAt);
    if (iconMarkup) cell.append(maskIcon(iconMarkup, 'achievement-icon'));
    if (concealed) {
      cell.append(node('p', '隐藏成就', 'achievement-name'));
      cell.append(node('p', '达成之后才会公开名称与条件。', 'achievement-desc'));
    } else {
      cell.append(node('p', achievement.zh, 'achievement-name'));
      cell.append(node('p', achievement.desc, 'achievement-desc'));
      cell.append(node('p', unlocked ? `解锁于 ${String(unlockedAt).slice(0, 10)}` : '尚未解锁', 'achievement-date'));
    }
    return cell;
  }

  function buildAchievementSection() {
    const state = progress.getState();
    const block = node('section', undefined, 'profile-section');
    const unlockedCount = Object.keys(state.achievements).length;
    block.append(node('h3', `成就（${unlockedCount} / ${progress.ACHIEVEMENTS.length}）`));
    block.append(node('p', '成就按真实学习状态自动解锁，不会因为你打开页面或点开答案就发放。已解锁的显示名称、条件与解锁日期；未解锁的灰化并给出条件；少数隐藏成就在达成前只显示“隐藏成就”。', 'muted'));
    /* v4.3 Batch 9（交接 M22）：最近解锁——按解锁时间倒序取最近 5 条。
     * 时间戳是 ISO 字符串，字典序即时间序（与 latestAchievement 同一口径）。 */
    const recent = Object.entries(state.achievements)
      .sort((a, b) => (String(b[1]) < String(a[1]) ? -1 : String(b[1]) > String(a[1]) ? 1 : 0))
      .slice(0, 5);
    if (recent.length) {
      const recentBox = node('div', undefined, 'recent-unlocks');
      recentBox.append(node('h4', '最近解锁'));
      const recentList = node('ul', undefined, 'recent-unlocks-list');
      recent.forEach(entry => {
        const definition = progress.ACHIEVEMENTS.find(item => item.id === entry[0]);
        if (!definition) return;
        const row = node('li');
        const icon = achievementIcon(definition, entry[1]);
        if (icon) row.append(maskIcon(icon, 'achievement-icon-sm'));
        row.append(node('span', `${definition.zh} · ${String(entry[1]).slice(0, 10)}`));
        recentList.append(row);
      });
      recentBox.append(recentList);
      block.append(recentBox);
    }
    progress.ACHIEVEMENT_CATEGORIES.forEach(category => {
      const items = progress.ACHIEVEMENTS.filter(item => item.category === category.id);
      if (!items.length) return;
      const got = items.filter(item => state.achievements[item.id]).length;
      const group = node('div', undefined, 'achievement-group');
      group.append(node('h4', `${category.zh} · ${got} / ${items.length}`));
      const grid = node('ul', undefined, 'achievement-grid');
      items.forEach(item => grid.append(buildAchievementCell(item, state.achievements[item.id])));
      group.append(grid);
      block.append(group);
    });
    return block;
  }

  /* ---------- v4.2：可复用的头像网格 / 头像框列表（§5.2 选择弹窗与收藏柜共用） ----------
   * onDone：装备或叶片解锁成功后的回调（选择弹窗用它关闭自己；收藏柜不传）。
   *
   * v4.8 信息架构重排（用户反馈「几何图标在前、少女头像藏在伙伴面板」是反的）：
   *   - companion 命名空间头像与几何头像合并进同一面板，不再单独成组；
   *   - 「已拥有」组置顶，组内排序：二次元少女（humanoid fixed-art，维持
   *     registry humans 顺序）→ 其他人形 → 宠物（creature fixed-art）→
   *     其余生物 → avatars.js 几何图标；
   *   - 四类解锁方式分组保留，但只列未拥有款（已拥有的置顶后不再重复出现；
   *     默认可用款全部已拥有，该组自然不渲染）；
   *   - companion 项带 type:'companion' 走 collections 统一解锁模型——与角色
   *     picker 的购买记录（companion:<id>）完全同源，形象买过后头像面板
   *     立即显示已拥有（修掉第二轮遗留的 undefined 前缀判定缺口）。
   * 图片路径仍全部经 companion-view 门面解析，不复制第二套资产清单。 */

  /* 非退役、ready 的角色清单（companion-view.listByKind 单一事实源，已过滤
   * retiredIds），带 type 前缀供 collections 解锁模型使用；门面缺失时回落
   * companions.js 旧清单（降级路径）。 */
  function companionRosterAssets() {
    if (companionView && typeof companionView.listByKind === 'function') {
      return typedAssets('companion', companionView.listByKind());
    }
    return companions && Array.isArray(companions.companions) ? typedAssets('companion', companions.companions) : [];
  }

  /* 头像面板的两个来源：companion 头像项（少女→人形→宠物→生物稳定排序）
   * 与几何头像项（avatars.js 原顺序，v4.10 起去掉退役项）。 */
  function avatarPanelSources() {
    const rank = entry => (entry.kind === 'humanoid' ? 0 : 2) + (entry.render && entry.render.engine === 'fixedArt' ? 0 : 1);
    const companionItems = companionRosterAssets().slice().sort((a, b) => rank(a) - rank(b));
    return { companionItems, geometricItems: typedAssets('avatar', selectableAvatarList()) };
  }

  /* 几何头像格子（avatars.js 的原创 SVG 图标）：选中 / 装备 / 叶片解锁购买。 */
  function buildGeometricAvatarCell(avatar, profile, persistent, onDone) {
    const unlocked = isCosmeticUnlocked(avatar);
    const selected = unlocked && !profile.avatarData && profile.avatarId === avatar.id;
    const item = node('li', undefined, 'collection-cell');
    const option = node('button', undefined, `avatar-option${selected ? ' is-selected' : ''}`);
    option.type = 'button';
    option.append(svgImage(avatar.svg, avatar.zh, 'avatar-option-img'));
    option.append(node('span', avatar.zh, 'avatar-option-name'));
    option.setAttribute('aria-label', `使用「${avatar.zh}」头像`);
    option.setAttribute('aria-pressed', String(selected));
    if (selected) {
      option.disabled = true;
      option.append(node('span', '当前使用', 'collection-state'));
    } else if (unlocked) {
      option.disabled = !persistent;
      option.addEventListener('click', () => {
        const hadUpload = Boolean(profile.avatarData);
        const idResult = progress.setAvatarId(avatar.id);
        if (!idResult.ok) {
          profileNotice = idResult.error;
          refreshProfilePanel();
          return;
        }
        /* 选了默认头像就让上传的头像让位，否则界面上看不出任何变化 */
        if (hadUpload) progress.setAvatarData(null);
        profileNotice = hadUpload
          ? `已切换为默认头像「${avatar.zh}」，之前上传的图片已移除；需要的话可以重新上传。`
          : `已选择默认头像「${avatar.zh}」。`;
        if (typeof onDone === 'function') onDone();
        refreshAll();
      });
    } else {
      option.disabled = true;
      option.classList.add('is-locked');
      option.append(node('span', cosmeticUnlockText(avatar), 'collection-state'));
    }
    item.append(option);
    item.append(ownedChip(unlocked));
    /* 叶片解锁品在卡片下方给「叶片解锁」按钮（不挤在头像按钮里） */
    if (!unlocked && collections && collections.assetPrice(avatar)) {
      const buy = buildBuyButton(avatar, onDone);
      buy.disabled = !persistent;
      item.append(buy);
    }
    return item;
  }

  /* companion 命名空间头像格子：复用各角色正式 icon / 原 SVG（companion-view
   * 门面解析）。解锁状态与条件文案与角色 picker 完全同源；coins 角色的解锁
   * 购买在角色 picker 完成，本格不重复购买入口、只展示条件（第二轮决策延续）。 */
  function buildCompanionAvatarCell(entry, profile, persistent, onDone) {
    const avatarId = COMPANION_AVATAR_PREFIX + entry.id;
    const unlocked = isCosmeticUnlocked(entry);
    const selected = unlocked && !profile.avatarData && profile.avatarId === avatarId;
    const item = node('li', undefined, 'collection-cell');
    const option = node('button', undefined, `avatar-option${selected ? ' is-selected' : ''}`);
    option.type = 'button';
    const descriptor = companionView && typeof companionView.portrait === 'function'
      ? companionView.portrait(entry.id, { slot: 'corner', mood: 'normal' }) : null;
    if (descriptor) {
      option.append(descriptor.source === 'file'
        ? fileImage(descriptor.value, entry.zh, 'avatar-option-img', descriptor.lazy)
        : svgImage(descriptor.value, entry.zh, 'avatar-option-img'));
    }
    option.append(node('span', entry.zh, 'avatar-option-name'));
    option.setAttribute('aria-label', `使用学习伙伴形象头像「${entry.zh}」`);
    option.setAttribute('aria-pressed', String(selected));
    if (selected) {
      option.disabled = true;
      option.append(node('span', '当前使用', 'collection-state'));
    } else if (unlocked) {
      option.disabled = !persistent;
      option.addEventListener('click', () => {
        const hadUpload = Boolean(profile.avatarData);
        const idResult = progress.setAvatarId(avatarId);
        if (!idResult.ok) {
          profileNotice = idResult.error;
          refreshProfilePanel();
          return;
        }
        if (hadUpload) progress.setAvatarData(null);
        profileNotice = hadUpload
          ? `已切换为学习伙伴形象头像「${entry.zh}」，之前上传的图片已移除；需要的话可以重新上传。`
          : `已选择学习伙伴形象头像「${entry.zh}」。`;
        if (typeof onDone === 'function') onDone();
        refreshAll();
      });
    } else {
      option.disabled = true;
      option.classList.add('is-locked');
      option.append(node('span', cosmeticUnlockText(entry), 'collection-state'));
    }
    item.append(option);
    item.append(ownedChip(unlocked));
    return item;
  }

  function buildAvatarOptionsGrid(onDone) {
    const profile = progress.profile();
    const persistent = progress.isPersistent();
    const { companionItems, geometricItems } = avatarPanelSources();
    const allItems = companionItems.concat(geometricItems);
    const wrap = node('div', undefined, 'collection-groups');
    const renderCell = entry => (entry.type === 'companion'
      ? buildCompanionAvatarCell(entry, profile, persistent, onDone)
      : buildGeometricAvatarCell(entry, profile, persistent, onDone));
    const renderGroup = items => {
      const options = node('ul', undefined, 'avatar-options collection-grid');
      items.forEach(entry => options.append(renderCell(entry)));
      return options;
    };

    /* 「已拥有」组置顶：标题给整个面板的总拥有进度（沿用「已拥有 N / M」口径） */
    const ownedItems = allItems.filter(itemOwned);
    const ownedView = collectionView(ownedItems);
    if (ownedView.length) {
      wrap.append(node('h5', `已拥有 ${ownedItems.length} / ${allItems.length}`, 'collection-group-title'));
      wrap.append(renderGroup(ownedView));
    }
    /* 四类解锁方式分组：只列未拥有款（v4.3 Batch 6 分组样式保留） */
    groupByUnlock(allItems.filter(entry => !itemOwned(entry))).forEach(group => {
      const items = collectionView(group.items);
      if (!items.length) return;
      wrap.append(node('h5', `${group.zh}（已拥有 ${groupOwnedCount(group.items)} / ${group.items.length}）`, 'collection-group-title'));
      wrap.append(renderGroup(items));
    });
    return wrap;
  }

  function buildFrameOptionsList(onDone) {
    const profile = progress.profile();
    const persistent = progress.isPersistent();
    /* v4.3 Batch 6（交接 J）：分组 + 已拥有徽章；未解锁的非叶片框也显示
     * 具体解锁方式（原来只有一句“未解锁”，看不出目标是什么） */
    const wrap = node('div', undefined, 'collection-groups');
    groupByUnlock(typedAssets('frame', progress.frames())).forEach(group => {
      const items = collectionView(group.items);
      if (!items.length) return;
      wrap.append(node('h5', `${group.zh}（已拥有 ${groupOwnedCount(group.items)} / ${group.items.length}）`, 'collection-group-title'));
      const frameList = node('ul', undefined, 'frame-options');
      items.forEach(frame => {
        const item = node('li', undefined, `frame-option${frame.unlocked ? '' : ' is-locked'}`);
        const preview = buildAvatar({
          avatarData: profile.avatarData,
          avatarId: profile.avatarId,
          equippedFrameId: frame.id
        }, 'md');
        item.append(preview);
        const text = node('div', undefined, 'frame-text');
        text.append(node('p', frame.zh, 'frame-name'));
        text.append(node('p', frame.desc, 'frame-desc'));
        text.append(ownedChip(frame.unlocked));
        const equipped = profile.equippedFrameId === frame.id;
        if (equipped) {
          text.append(node('p', '当前装备', 'frame-state'));
        } else if (frame.unlocked) {
          const equip = node('button', '装备这个框', 'button-secondary');
          equip.type = 'button';
          equip.disabled = !persistent;
          equip.addEventListener('click', () => {
            const result = progress.equipFrame(frame.id);
            profileNotice = result.ok ? `已装备「${frame.zh}」。` : result.error;
            if (result.ok && typeof onDone === 'function') onDone();
            refreshAll();
          });
          text.append(equip);
        } else if (collections && collections.assetPrice(frame)) {
          text.append(buildBuyButton(frame, onDone));
        } else {
          text.append(node('p', cosmeticUnlockText(frame), 'frame-state'));
        }
        item.append(text);
        frameList.append(item);
      });
      wrap.append(frameList);
    });
    return wrap;
  }

  /* v4.3 Batch 7（交接 K）：小奥形象 / 主题列表抽成独立函数——收藏柜与
   * 各自的 picker 弹窗共用同一套渲染（分组、徽章、装备/解锁逻辑零重复）。 */
  function buildCompanionOptionsList(onDone) {
    const persistent = progress.isPersistent();
    const cosmetics = progress.cosmetics();
    const wrap = node('div', undefined, 'collection-groups');
    groupByUnlock(typedAssets('companion', companionEntries())).forEach(group => {
      const items = collectionView(group.items);
      if (!items.length) return;
      wrap.append(node('h5', `${group.zh}（已拥有 ${groupOwnedCount(group.items)} / ${group.items.length}）`, 'collection-group-title'));
      const companionList = node('ul', undefined, 'companion-options');
      items.forEach(item => {
        const entry = node('li', undefined, 'companion-option');
        const portrait = companionPortraitImage(item, { slot: 'listItem' }, 'companion-img', item.zh || item.name);
        if (portrait) entry.append(portrait);
        const text = node('div', undefined, 'frame-text');
        text.append(node('p', item.zh, 'frame-name'));
        text.append(node('p', item.desc, 'frame-desc'));
        const equipped = cosmetics.companionId === item.id;
        const unlocked = isCosmeticUnlocked(item);
        text.append(ownedChip(unlocked));
        if (equipped) {
          text.append(node('p', '当前形象', 'frame-state'));
        } else if (unlocked) {
          const equip = node('button', '使用这个形象', 'button-secondary');
          equip.type = 'button';
          equip.disabled = !persistent;
          equip.addEventListener('click', () => {
            const result = progress.equipCompanion(item.id);
            profileNotice = result.ok ? `已切换为「${item.zh}」。` : result.error;
            if (result.ok && typeof onDone === 'function') onDone();
            refreshAll();
          });
          text.append(equip);
        } else if (collections && collections.assetPrice(item)) {
          text.append(buildBuyButton(item, onDone));
        } else {
          text.append(node('p', cosmeticUnlockText(item), 'frame-state'));
        }
        entry.append(text);
        companionList.append(entry);
      });
      wrap.append(companionList);
    });
    return wrap;
  }

  function buildThemeOptionsList(onDone) {
    const persistent = progress.isPersistent();
    const cosmetics = progress.cosmetics();
    const wrap = node('div', undefined, 'collection-groups');
    groupByUnlock(typedAssets('theme', themes && Array.isArray(themes.themes) ? themes.themes : [])).forEach(group => {
      const items = collectionView(group.items);
      if (!items.length) return;
      wrap.append(node('h5', `${group.zh}（已拥有 ${groupOwnedCount(group.items)} / ${group.items.length}）`, 'collection-group-title'));
      const themeList = node('ul', undefined, 'theme-options');
      items.forEach(item => {
        const entry = node('li', undefined, 'theme-option');
        const swatch = node('span', undefined, 'theme-swatch');
        swatch.setAttribute('aria-hidden', 'true');
        swatch.style.backgroundColor = item.swatch.bg;
        const chip = node('span', undefined, 'theme-swatch-chip');
        chip.style.backgroundColor = item.swatch.accent;
        const ink = node('span', undefined, 'theme-swatch-chip');
        ink.style.backgroundColor = item.swatch.ink;
        swatch.append(chip, ink);
        entry.append(swatch);
        const text = node('div', undefined, 'frame-text');
        text.append(node('p', item.zh, 'frame-name'));
        text.append(node('p', item.desc, 'frame-desc'));
        const active = cosmetics.themeId === item.id;
        const unlocked = isCosmeticUnlocked(item);
        text.append(ownedChip(unlocked));
        if (active) {
          text.append(node('p', '当前主题', 'frame-state'));
        } else if (unlocked) {
          const apply = node('button', '使用这个主题', 'button-secondary');
          apply.type = 'button';
          apply.disabled = !persistent;
          apply.addEventListener('click', () => {
            const result = progress.setTheme(item.id);
            profileNotice = result.ok ? `已切换为「${item.zh}」主题。` : result.error;
            if (result.ok && typeof onDone === 'function') onDone();
            refreshAll();
          });
          text.append(apply);
        } else if (collections && collections.assetPrice(item)) {
          text.append(buildBuyButton(item, onDone));
        } else {
          text.append(node('p', cosmeticUnlockText(item), 'frame-state'));
        }
        entry.append(text);
        themeList.append(entry);
      });
      wrap.append(themeList);
    });
    return wrap;
  }

  /* 上传头像的一行控件（选择弹窗顶部与收藏柜头像类目共用，§5.2）。 */
  function buildAvatarUploadRow(onDone) {
    const profile = progress.profile();
    const persistent = progress.isPersistent();
    const uploadRow = node('div', undefined, 'profile-field');
    const uploadButton = node('button', profile.avatarData ? '更换上传的头像' : '上传自己的头像', 'button-secondary');
    uploadButton.type = 'button';
    uploadButton.disabled = !persistent;
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/png,image/jpeg,image/webp,image/gif,image/bmp';
    imageInput.className = 'visually-hidden';
    imageInput.disabled = !persistent;
    imageInput.setAttribute('aria-label', '选择要作为头像的图片文件');
    imageInput.addEventListener('change', () => {
      const file = imageInput.files && imageInput.files[0];
      imageInput.value = '';
      if (!file) return;
      profileNotice = '正在处理图片…';
      refreshProfilePanel();
      progress.encodeAvatarFile(file).then(result => {
        if (!result.ok) {
          profileNotice = result.error;
          refreshProfilePanel();
          return;
        }
        const saved = progress.setAvatarData(result.dataUrl);
        if (!saved.ok) {
          profileNotice = saved.error;
        } else {
          const kb = Math.round(result.dataUrl.length / 1024);
          profileNotice = `头像已更新，保存大小约 ${kb} KB。图片只存在这台设备上。`;
          if (typeof onDone === 'function') onDone();
        }
        refreshAll();
      });
    });
    uploadButton.addEventListener('click', () => imageInput.click());
    uploadRow.append(uploadButton, imageInput);
    if (profile.avatarData) {
      const clearButton = node('button', '移除上传的头像', 'button-secondary');
      clearButton.type = 'button';
      clearButton.disabled = !persistent;
      clearButton.addEventListener('click', () => {
        const result = progress.clearAvatarData();
        profileNotice = result.ok ? '已移除上传的头像，现在使用默认头像。' : result.error;
        refreshAll();
      });
      uploadRow.append(clearButton);
      uploadRow.append(node('span', `已上传，约 ${Math.round(profile.avatarData.length / 1024)} KB`, 'meta'));
    }
    return uploadRow;
  }

  /* ---------- v4.2：装扮收藏（交接 §4、§12；v4.3 B1 改名，不叫“商店/商城”） ----------
   * 收藏柜是个人资料面板的一个 section（§12）：每类收藏品显示
   * 已拥有 / 总数，未拥有的显示解锁方式，叶片解锁品有价格与「叶片解锁」按钮，
   * 已拥有的可以直接装备。成就也在收藏柜里显示计数（详细网格仍在“成就”区块）。
   * 四类外观全部走 collections.js 的统一解锁模型，UI 不自己写判定条件。 */
  function buildCollectionSection() {
    const profile = progress.profile();
    const persistent = progress.isPersistent();
    const summary = progress.summary();
    const block = node('section', undefined, 'profile-section');
    block.append(node('h3', '装扮收藏'));
    block.append(node('p', `叶片余额：${summary.coins}。学习叶片只通过有效学习、完成课程、每日目标等学习行为获得（规则见首页“叶片怎么获得”）。完全免费，不支持充值，不涉及真实货币，只用于解锁下面的额外装扮与收藏：不影响等级、成就与课程完成状态，也不可换取 XP。全部收藏品都是本站原创的几何图形与配色，不涉及任何第三方角色。`, 'muted'));

    /* v4.3 Batch 6（交接 J）：四类资产 + 成就的收藏进度概览，一眼看清 x/y。
     * v4.8：伙伴形象计数改走登记表门面（companionRosterAssets 已过滤退役
     * 角色，与实际列表同源——此前用 companions.js 旧 14 项清单，与 registry
     * 列表不一致且把退役 sprout 计入总数）；头像计数 = 几何清单 +
     * companion-<id> 命名空间头像，与下方合并后的头像面板同口径。
     * v4.10：几何侧改用 selectableAvatarList()（去掉 registry.retiredAvatarIds
     * 命中的退役头像），于是概览计数、区块标题的 N / M 与面板里真实渲染的格子
     * 数三者永远同源——退役头像不再占一个「点了没反应」的格子，也不再被算进
     * 用户永远拿不到手的总数里。 */
    const geometricAvatars = typedAssets('avatar', selectableAvatarList());
    const companionItems = companionRosterAssets();
    const avatarAssets = geometricAvatars.concat(companionItems);
    const frameAssets = typedAssets('frame', progress.frames());
    const themeItems = themes && Array.isArray(themes.themes) ? typedAssets('theme', themes.themes) : [];
    const overview = node('ul', undefined, 'collection-progress');
    [['头像', avatarAssets], ['头像框', frameAssets], ['学习伙伴形象', companionItems], ['页面主题', themeItems]].forEach(pair => {
      const items = pair[1];
      if (!items.length) return;
      const owned = groupOwnedCount(items);
      overview.append(node('li', `${pair[0]} ${owned}/${items.length}`, owned === items.length ? 'is-complete' : undefined));
    });
    overview.append(node('li', `成就 ${summary.achievementCount}/${summary.achievementTotal}`, summary.achievementCount === summary.achievementTotal ? 'is-complete' : undefined));
    block.append(overview);
    block.append(node('p', '收藏品按解锁方式分成四组：默认可用、学习解锁（等级）、成就解锁、叶片解锁；头像面板「已拥有」组置顶，四类分组只列未拥有款。每件都标注已拥有 / 未拥有、解锁方式或价格、装备状态。', 'meta'));
    /* v4.3 Batch 9（交接 M21）：筛选与排序控件 */
    block.append(buildCollectionControls());

    /* --- 头像 --- */
    block.append(node('h4', `头像（已拥有 ${groupOwnedCount(avatarAssets)} / ${avatarAssets.length}）`));
    if (!geometricAvatars.length) {
      block.append(node('p', '头像清单未载入。请确认 avatars.js 与 HTML 文件在同一个文件夹里。', 'notice'));
    } else {
      block.append(buildAvatarOptionsGrid());

      /* 上传头像：仍保留在本类目下（§5.2 要求上传入口放在头像选择器显眼处） */
      block.append(buildAvatarUploadRow());
      block.append(node('p', '上传的图片只在这台设备的浏览器里处理：居中裁成正方形、缩放到约 256×256、控制在约 200 KB 以内。不接受 SVG。', 'meta'));
    }

    /* --- 头像框 --- */
    block.append(node('h4', `头像框（已解锁 ${frameAssets.filter(item => item.unlocked).length} / ${progress.FRAMES.length}）`));
    block.append(node('p', '头像框由等级、成就解锁或叶片解锁，未解锁的不能装备。头像框不提供 XP，也不构成成就，避免形成“为了拿框而刷分”的循环。', 'muted'));
    block.append(buildFrameOptionsList());

    /* --- 小奥形象 --- */
    if (companionItems.length) {
      block.append(node('h4', `学习伙伴形象（已拥有 ${groupOwnedCount(companionItems)} / ${companionItems.length}）`));
      block.append(node('p', '不同形象只改变外观、名称与一句固定语气，不改变学习建议的算法；学习伙伴仍然不是 AI，不联网。形象（皮肤）与成长阶段是两个独立维度：阶段由学习数据推导，不可装备、不会回退。', 'muted'));
      block.append(buildCompanionOptionsList());
    }

    /* --- 主题 --- */
    if (themeItems.length) {
      block.append(node('h4', `页面主题（已拥有 ${groupOwnedCount(themeItems)} / ${themeItems.length}）`));
      block.append(node('p', '主题只改变颜色，不改变布局与字号；正文与代码块的对比度都按可读标准调过。', 'muted'));
      block.append(buildThemeOptionsList());
    }

    /* --- 成就计数（收藏柜里的第五类；详细网格在“成就”区块） --- */
    block.append(node('h4', `成就（已解锁 ${summary.achievementCount} / ${summary.achievementTotal}）`));
    block.append(node('p', '成就按真实学习状态自动解锁，叶片解锁不了成就，成就也不发放叶片以外的任何数值；详见上方“成就”区块。', 'meta'));

    if (!persistent) block.append(node('p', FILE_MODE_NOTE, 'notice'));
    return block;
  }

  /* 头像清单（含解锁信息）。旧档案里的 avatarData 上传头像优先于清单。 */
  function avatarList() {
    return avatars && Array.isArray(avatars.avatars) ? avatars.avatars : [];
  }

  /* v4.10：退役头像判定。名单读登记表的 retiredAvatarIds（单一事实源，与
   * retiredIds / legacyCompanionNames 同处声明），本文件不写任何退役头像 id
   * 字面量；登记表缺失时退化为「没有退役项」，与 progress.js 同一降级口径。 */
  function isRetiredAvatar(avatarId) {
    return Boolean(companionRegistry && Array.isArray(companionRegistry.retiredAvatarIds)
      && companionRegistry.retiredAvatarIds.includes(avatarId));
  }

  /* v4.10：可选头像清单 = 几何清单去掉退役项。头像面板与收藏柜计数同源用它，
   * 保证「看到的格子数」与「标题里的 N / M」永远一致。
   * 为什么要过滤而不是留一个禁用格：v4.9 起选中退役头像会被读取层归一化成
   * DEFAULT_AVATAR_ID（companion-nono），于是面板里「终端提示符」那一格点了
   * 毫无反应、也没有任何说明——正是用户明确反感的「能点但没反应」（同类问题：
   * v4.9 已撤掉的点不掉的成长角标）。
   * 过滤只发生在**选择层**：avatars.js 的 37 项资产一项不删、id 不改名，
   * resolveAvatar 的回落链仍认得退役 id（老档案渲染不受影响），档案里存过的
   * 值也不会变成孤儿；回滚 = 清空登记表的 retiredAvatarIds。 */
  function selectableAvatarList() {
    return avatarList().filter(item => !isRetiredAvatar(item.id));
  }

  /* ---------- v4.3：学习统计（交接 F1、F2、F3） ----------
   * 数据全部来自 stats.js 的纯函数推导（daily + 每课 activeSeconds），
   * 不新增任何存储字段。热力图用 CSS grid 小格（GitHub 风格），
   * 每格 title 显示日期与分钟数；无图表库、无 SVG 注入。 */

  function buildHeatmap(heat) {
    const wrap = node('div', undefined, 'heatmap-wrap');
    const months = node('div', undefined, 'heatmap-months');
    months.setAttribute('aria-hidden', 'true');
    heat.monthLabels.forEach(label => {
      months.append(node('span', label ? `${Number(label.slice(5, 7))} 月` : ''));
    });
    wrap.append(months);
    const body = node('div', undefined, 'heatmap-body');
    const weekdayLabels = node('div', undefined, 'heatmap-weekdays');
    weekdayLabels.setAttribute('aria-hidden', 'true');
    ['一', '', '三', '', '五', '', '日'].forEach(text => weekdayLabels.append(node('span', text)));
    body.append(weekdayLabels);
    const grid = node('div', undefined, 'heatmap-grid');
    grid.setAttribute('role', 'img');
    grid.setAttribute('aria-label', `近 ${heat.weeks} 周学习热力图：${heat.studiedDays} 个学习日，累计有效学习 ${progress.formatSeconds(heat.totalSeconds)}。每格是一天，颜色越深学得越久。`);
    heat.columns.forEach(week => {
      week.days.forEach(day => {
        const cell = node('span', undefined, `heatmap-cell is-level-${day.level}${day.isToday ? ' is-today' : ''}${day.isFuture ? ' is-future' : ''}`);
        cell.title = day.isFuture
          ? `${day.dayKey}（还没到）`
          : `${day.dayKey}：${day.seconds > 0 ? `有效学习 ${progress.formatSeconds(day.seconds)}` : '没有学习记录'}`;
        grid.append(cell);
      });
    });
    body.append(grid);
    wrap.append(body);
    /* 图例：Less → More 五档 */
    const legend = node('div', undefined, 'heatmap-legend');
    legend.append(node('span', '少', 'meta'));
    [0, 1, 2, 3, 4].forEach(level => {
      const cell = node('span', undefined, `heatmap-cell is-level-${level} is-static`);
      cell.title = level === 0 ? '没有学习记录' : (stats.HEATMAP_LEVELS[level - 1] || {}).zh || '';
      legend.append(cell);
    });
    legend.append(node('span', '多', 'meta'));
    wrap.append(legend);
    return wrap;
  }

  function buildStatsSection() {
    if (!stats) return null;
    const state = progress.getState();
    const todayKey = progress.todayKey();
    const block = node('section', undefined, 'profile-section');
    block.append(node('h3', '学习统计'));

    /* F1 热力图 */
    const heat = stats.heatmapWeeks(state, todayKey, stats.HEATMAP_DEFAULT_WEEKS);
    block.append(node('h4', `近 ${heat.weeks} 周学习热力图`));
    if (heat.isEmpty) {
      block.append(node('p', '近 17 周还没有学习记录。打开任意一课开始计时后，这里会一天一天亮起来；每一格都代表一个真实学习过的日子。', 'muted empty-state'));
    } else {
      block.append(node('p', `近 ${heat.weeks} 周共 ${heat.studiedDays} 个学习日、累计 ${progress.formatSeconds(heat.totalSeconds)}。格子颜色是固定档位（不足 15 分 / 15–30 分 / 30–60 分 / 60 分以上），不随个人最大值浮动；把指针停在一格上可以看当天日期与时长。`, 'meta'));
    }
    block.append(buildHeatmap(heat));

    /* F2 个人最佳记录 */
    const bests = stats.personalBests(state, todayKey);
    block.append(node('h4', '个人最佳'));
    const grid = node('div', undefined, 'stat-grid');
    grid.append(
      statCell('当前连续学习', `${bests.currentStreak} 天`, '每天至少 10 分钟才计入'),
      statCell('历史最长连续', `${bests.longestStreakDays} 天`, bests.longestStreakEndDay ? `那段连续结束于 ${bests.longestStreakEndDay}` : '还没有连续记录'),
      statCell('单日最高时长', bests.bestDaySeconds > 0 ? progress.formatSeconds(bests.bestDaySeconds) : '—', bests.bestDayKey ? `发生在 ${bests.bestDayKey}` : '还没有单日记录'),
      statCell('最近 7 天', progress.formatSeconds(bests.last7Seconds), '含今天'),
      statCell('最近 30 天', progress.formatSeconds(bests.last30Seconds), '含今天'),
      statCell('累计学习天数', `${bests.totalStudyDays} 天`, '单日至少 10 分钟算一天'),
      statCell('本周 vs 上周', bests.weekChangePct === null ? '上周为 0' : `${bests.weekChangePct > 0 ? '+' : ''}${bests.weekChangePct}%`, `${progress.formatSeconds(bests.thisWeekSeconds)} 对 ${progress.formatSeconds(bests.lastWeekSeconds)}`),
      /* v4.3 Batch 10（Stretch N1）：轻量一致率——uhabits habit strength 的
       * 可解释简化版：近 30 天里有几天达标，不用需要解释公式的加权分数 */
      statCell('近 30 天一致率', `${bests.consistencyPct}%`, `30 天里 ${bests.last30StudyDays} 天达标（每天至少 10 分钟）`)
    );
    block.append(grid);

    /* F3 每课学习耗时 Top 5 */
    const times = stats.lessonTimes(state, data.lessons, 5);
    block.append(node('h4', '最花时间的 5 课'));
    if (times.top.length) {
      const list = node('ol', undefined, 'lesson-times');
      times.top.forEach(item => {
        list.append(node('li', `${item.zh}（${item.title}）— ${progress.formatSeconds(item.seconds)}`));
      });
      block.append(list);
      block.append(node('p', `共 ${times.timedLessonCount} 课记录过学习时长。耗时长短不是好坏评价——在一课上花很久，往往只是把它啃得更细。这只是你的学习痕迹。`, 'meta'));
    } else {
      block.append(node('p', '还没有课程记录过学习时长。打开课程页并开始学习后，这里会出现你的耗时排行。', 'muted empty-state'));
    }

    /* v4.3 Batch 9（交接 M19）+ Batch 10（Stretch N11/N12）：可打印学习总结
     * 与 Markdown 导出——两者共用 collectSummaryData() 的同一份数据，
     * 不联网、不新增存储、不改变任何状态。 */
    const printRow = node('div', undefined, 'dashboard-row');
    const printButton = node('button', '打印学习总结', 'button-secondary');
    printButton.type = 'button';
    printButton.addEventListener('click', () => {
      let mount = document.querySelector('.print-summary');
      if (!mount) {
        mount = node('div', undefined, 'print-summary');
        mount.setAttribute('aria-hidden', 'true');
        document.body.append(mount);
      }
      mount.replaceChildren(...buildPrintSummary());
      window.print();
    });
    const exportButton = node('button', '导出 Markdown 总结', 'button-secondary');
    exportButton.type = 'button';
    exportButton.addEventListener('click', () => {
      if (!stats || typeof stats.summaryMarkdown !== 'function') return;
      const text = stats.summaryMarkdown(collectSummaryData());
      const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `odin-中文学习站-学习总结-${progress.todayKey()}.md`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    });
    printRow.append(printButton, exportButton);
    printRow.append(node('span', '打印：生成一页纯文本总结再调用浏览器打印（可另存为 PDF）。导出：下载一份同源数据的 Markdown 文件（含本周总结），只存到这台设备。', 'meta'));
    block.append(printRow);
    return block;
  }

  /* 总结数据收集（M19 打印与 N11/N12 Markdown 导出共用同一份数据源）：
   * 全部从当前档案推导成字符串数组，无 DOM、无存储写入。 */
  function collectSummaryData() {
    const state = progress.getState();
    const summary = progress.summary();
    const todayKey = progress.todayKey();
    const payload = {
      title: 'Odin 中文学习站 · 学习总结',
      generatedDay: todayKey,
      intro: `生成日期：${todayKey} · 数据来源：这台设备上保存的学习档案`,
      overview: [
        `学习者：${summary.nickname}`,
        `等级：Lv.${summary.level}（${summary.xp} XP）`,
        `累计有效学习：${progress.formatSeconds(state.totalActiveSeconds || 0)}`,
        `课程完成：${summary.completedCount} / ${summary.totalLessons}`,
        `学习叶片：${summary.coins}（只由学习行为获得）`,
        `成就：${summary.achievementCount} / ${summary.achievementTotal}`,
        `需要复习：${summary.needsReviewCount} 课 · 今日建议复习：${summary.reviewDueToday || 0} 课`
      ],
      bests: [],
      week: [],
      heatLine: null,
      heatWeeks: stats ? stats.HEATMAP_DEFAULT_WEEKS : 17,
      times: [],
      tiers: [],
      history: [],
      footer: '本页由学习档案实时生成：所有数字都来自这台设备上的真实学习记录，不含任何联网数据。'
    };
    if (stats) {
      const bests = stats.personalBests(state, todayKey);
      payload.bests = [
        `当前连续学习：${bests.currentStreak} 天`,
        `历史最长连续：${bests.longestStreakDays} 天${bests.longestStreakEndDay ? `（结束于 ${bests.longestStreakEndDay}）` : ''}`,
        `单日最高：${bests.bestDaySeconds > 0 ? `${progress.formatSeconds(bests.bestDaySeconds)}（${bests.bestDayKey}）` : '—'}`,
        `最近 7 天：${progress.formatSeconds(bests.last7Seconds)} · 最近 30 天：${progress.formatSeconds(bests.last30Seconds)}`,
        `累计学习天数：${bests.totalStudyDays} 天 · 近 30 天一致率：${bests.consistencyPct}%（${bests.last30StudyDays} 天达标）`
      ];
      const heat = stats.heatmapWeeks(state, todayKey, stats.HEATMAP_DEFAULT_WEEKS);
      payload.heatLine = `${heat.studiedDays} 个学习日 · 合计 ${progress.formatSeconds(heat.totalSeconds)}`;
      const times = stats.lessonTimes(state, data.lessons, 5);
      payload.times = times.top.map(item => `${item.zh}（${item.title}）— ${progress.formatSeconds(item.seconds)}`);
      /* N12 本周总结：与每日/每周卡同一口径（daily.js 的 ISO 周函数） */
      if (dailyModule) {
        const weekDays = dailyModule.weekDaysOf(todayKey);
        const weekLessons = dailyModule.countMarkedInRange(state, data.lessons, weekDays, 'completedAt');
        const weekQuiz = dailyModule.countMarkedInRange(state, data.lessons, weekDays, 'quizCompletedAt');
        const goalSeconds = dailyModule.goalSecondsOf(state);
        const goalDays = goalSeconds > 0 ? weekDays.filter(key => Number((state.daily || {})[key]) >= goalSeconds).length : 0;
        payload.week = [
          `本周累计：${progress.formatSeconds(bests.thisWeekSeconds)}${bests.weekChangePct === null ? '（上周为 0）' : `（对比上周 ${bests.weekChangePct > 0 ? '+' : ''}${bests.weekChangePct}%）`}`,
          `本周完成课程：${weekLessons} 课 · 完成自测：${weekQuiz} 次`,
          `本周达成每日目标：${goalDays} / 7 天`
        ];
      }
    }
    const tierBriefs = progress.tiersBrief ? progress.tiersBrief() : [];
    payload.tiers = tierBriefs.map(item => {
      const stage = item.maxed ? '金阶 · 已满阶' : item.tierZh ? `${item.tierZh}阶` : '未晋升';
      return `${item.zh}：${stage}（当前累计 ${item.current}${item.maxed ? '' : ` / 下一阶 ${item.nextThreshold}`}）`;
    });
    payload.history = (state.history || []).slice(-10).reverse().map(event => {
      const text = HISTORY_EVENT_TEXT[event.type];
      return `${event.day || ''} · ${text ? text(event) : event.type}`;
    });
    return payload;
  }

  /* 打印总结的正文（纯文本节点，无图表——打印件以可读为先；数据同源 collectSummaryData） */
  function buildPrintSummary() {
    const payload = collectSummaryData();
    const children = [];
    children.push(node('h1', payload.title));
    children.push(node('p', payload.intro));
    const sectionDom = (title, items, ordered) => {
      if (!items || !items.length) return;
      children.push(node('h2', title));
      const list = node(ordered ? 'ol' : 'ul');
      items.forEach(text => list.append(node('li', text)));
      children.push(list);
    };
    sectionDom('总览', payload.overview);
    sectionDom('个人最佳', payload.bests);
    sectionDom('本周总结', payload.week);
    if (payload.heatLine) {
      children.push(node('h2', `近 ${payload.heatWeeks} 周`));
      children.push(node('p', payload.heatLine));
    }
    sectionDom('最花时间的 5 课', payload.times, true);
    sectionDom('循环成就（铜 / 银 / 金）', payload.tiers);
    sectionDom('最近 10 条学习历史', payload.history);
    children.push(node('p', payload.footer));
    return children;
  }

  /* ---------- v4.2：学习历史（交接 §10） ----------
   * 事件由 progress.js 在真实变更点记录（history.js），这里只负责按日分组
   * 渲染。展示上限 200 条（最新的在前），超出时说明还有多少条更早的。 */
  const HISTORY_EVENT_TEXT = {
    'lesson-start': event => `开始学习 ${historyLessonLabel(event.lessonId)}`,
    'lesson-complete': event => `完成课程 ${historyLessonLabel(event.lessonId)}`,
    'official-complete': event => `完成官方任务 ${historyLessonLabel(event.lessonId)}`,
    'quiz-complete': event => `完成本站自测 ${historyLessonLabel(event.lessonId)}`,
    'review-mark': event => `标记需要复习 ${historyLessonLabel(event.lessonId)}`,
    'review-clear': event => `清除复习标记 ${historyLessonLabel(event.lessonId)}`,
    /* v4.3（交接 G）：完成一次复习（推进 1/3/7/30 阶梯） */
    'review-done': event => `完成一次复习 ${historyLessonLabel(event.lessonId)}`,
    achievement: event => {
      const definition = progress.ACHIEVEMENTS.find(item => item.id === event.achievementId);
      return `解锁成就 ${definition ? definition.zh : event.achievementId}`;
    },
    /* v4.5（交接 Core F）：首次有效读到一课结尾（阅读里程碑，≠ 课程完成） */
    'read-complete': event => `首次读到结尾 ${historyLessonLabel(event.lessonId)}`,
    /* v4.5（交接 Core E2）：升级事件（zh 存「达到 Lv.N」；一批结算只记一条，
     * 曲线迁移的补记不会追溯狂发） */
    'level-up': event => `等级提升 · ${event.zh || ''}`,
    /* v4.3（交接 D1）：循环成就晋升事件（zh 存「族名 · 阶级」） */
    'tier-up': event => `循环成就晋升：${event.zh || ''}`,
    /* v4.3（交接 E3）：Boss 挑战事件（zh 存「Boss 名 分数% · 评级」） */
    'boss-attempt': event => `挑战章节 Boss · ${event.zh || ''}`,
    'daily-goal': event => `达成每日学习目标${event.amount ? `（+${event.amount} 叶片）` : ''}`,
    'coin-grant': event => `获得 ${event.amount} 叶片（${event.zh || '一次性奖励'}）`,
    'coin-spend': event => `用 ${event.amount} 叶片解锁「${event.zh || event.assetId}」`
  };

  function historyLessonLabel(lessonId) {
    const lesson = findLesson(lessonId);
    return lesson ? `「${lesson.zh}」` : lessonId || '';
  }

  function buildHistorySection() {
    const total = progress.historyCount();
    const block = node('section', undefined, 'profile-section');
    block.append(node('h3', `学习历史（共 ${total} 条）`));
    block.append(node('p', '只记录有意义的事件：开始与完成课程、官方任务、自测、复习标记、首次读到结尾、解锁成就、等级提升、达成每日目标与叶片收支。滚动、计时与刷新不会产生记录；最多保留最近 1000 条。', 'muted'));
    const grouped = progress.historyGrouped(200);
    if (!grouped.length) {
      block.append(node('p', '还没有学习历史。开始学习任意一课、勾选完成状态或解锁成就后，这里会出现记录。', 'muted empty-state'));
      return block;
    }
    if (total > 200) {
      block.append(node('p', `下面显示最近 200 条，更早的 ${total - 200} 条仍保存在档案里，可用导出查看。`, 'meta'));
    }
    grouped.forEach(dayGroup => {
      const dayBlock = node('div', undefined, 'history-day');
      dayBlock.append(node('h4', dayGroup.day));
      const list = node('ul', undefined, 'history-list');
      dayGroup.events.forEach(event => {
        const describe = HISTORY_EVENT_TEXT[event.type];
        const time = String(event.at).slice(11, 16);
        list.append(node('li', `${time} · ${describe ? describe(event) : event.type}`));
      });
      dayBlock.append(list);
      block.append(dayBlock);
    });
    return block;
  }

  /* ---------- v4.2：学习设置中心（交接 §15） ----------
   * 开关全部落在 progress 的 settings（随档案导入导出，旧档案默认全开）；
   * UI 只读写设置，不自己记状态。设置变化后用 applyUiSettings 统一生效。 */
  function applyUiSettings() {
    if (!progress) return;
    const settings = progress.settings();
    document.documentElement.classList.toggle('hide-english', settings.showEnglishTitles === false);
    document.documentElement.classList.toggle('hide-unavailable', settings.showUnavailableLessons === false);
    if (assistantTrigger) {
      const wasHidden = assistantTrigger.style.display === 'none';
      const nowHidden = settings.showCompanion === false;
      assistantTrigger.style.display = nowHidden ? 'none' : '';
      /* v4.3（交接 A1）：从隐藏恢复显示时按真实尺寸重新定位一次——
       * 隐藏期间元素测不出尺寸（0×0），位置只是估算值，显示后要修正，
       * 保证 showCompanion=true 时入口一定完整可见。 */
      if (wasHidden && !nowHidden) applyCompanionPosition();
    }
    /* v4.4：阅读位置条 2.0 是单行 sticky bar（fill 在 bar 内部），显隐只控 bar */
    const bar = document.querySelector('.reading-position');
    if (bar) bar.style.display = settings.showReadingPosition === false ? 'none' : '';
  }

  function buildToggleRow(key, labelText, hint) {
    const settings = progress.settings();
    const row = node('label', undefined, 'progress-toggle setting-toggle');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = settings[key] !== false;
    box.disabled = !progress.isPersistent();
    box.addEventListener('change', () => {
      progress.setSetting(key, box.checked);
      applyUiSettings();
      /* 未开放课程的显隐影响目录渲染，整体重画最稳 */
      if (key === 'showUnavailableLessons') rebuildCatalog();
      profileNotice = `已${box.checked ? '开启' : '关闭'}「${labelText}」。`;
      refreshProfilePanel();
      /* v4.4（交接 B4/D4）：同一套设置字段也会渲染在小奥面板的「设置」
       * 视图里——改动后两个面板都要跟上（各自有 isPanelOpen 守卫）。 */
      refreshAssistantPanel();
    });
    row.append(box, node('span', labelText), node('span', hint, 'meta'));
    return row;
  }

  /* 已解锁形象的快速选择（完整收藏柜仍在「装扮收藏」） */
  function buildCompanionSelect() {
    const listed = companionEntries();
    if (!listed.length) return null;
    const settings = progress.cosmetics();
    const row = node('label', undefined, 'daily-goal-field');
    row.append(node('span', '学习伙伴形象', 'profile-field-label'));
    const select = document.createElement('select');
    select.className = 'profile-input';
    select.setAttribute('aria-label', '学习伙伴形象');
    listed.forEach(item => {
      if (!isCosmeticUnlocked(Object.assign({}, item, { type: 'companion', zh: item.name, desc: item.persona }))) return;
      const option = node('option', item.name);
      option.value = item.id;
      if (item.id === settings.companionId) option.selected = true;
      select.append(option);
    });
    select.disabled = !progress.isPersistent();
    select.addEventListener('change', () => {
      const result = progress.equipCompanion(select.value);
      profileNotice = result.ok ? '学习伙伴形象已更新。' : result.error;
      refreshAll();
    });
    row.append(select);
    return row;
  }

  /* 已解锁主题的快速选择（完整收藏柜仍在「装扮收藏」） */
  /* v4.4：buildThemeSelect 已移除——主题的装备路径统一为「形象」Tab 四卡入口、
   * header 主题快捷按钮与收藏柜（B1：同一功能不再维护第三处下拉入口）。
   * 快速选择只保留小奥形象一项（交接 D4 的设置清单明确要求它）。 */

  /* ---------- v4.2：重置学习进度（交接 §17） ----------
   * 二次确认要求输入“重置”两个字；执行前 progress.resetProgress 自动快照。 */
  let resetDialog = null;

  function openResetDialog() {
    if (!resetDialog) {
      resetDialog = buildPickerDialog('重置学习进度', resetDialogBody, closeResetDialog, 'reset-dialog-title');
      document.body.append(resetDialog);
    } else {
      resetDialog.querySelector('.picker-body').replaceChildren(...resetDialogBody());
    }
    if (typeof resetDialog.showModal === 'function') {
      if (!resetDialog.open) resetDialog.showModal();
    } else {
      resetDialog.setAttribute('open', '');
    }
  }

  function closeResetDialog() {
    closeDialogHelper(resetDialog, playerEntry);
  }

  function resetDialogBody() {
    const parts = [];
    parts.push(node('p', '这会清空这台设备上保存的全部学习数据：完成状态、有效学习时长、XP、等级、叶片、成就、每日目标记录与学习历史。', 'notice'));
    parts.push(node('p', '不会删除：课程内容与本站文件、你的昵称 / 头像 / 头像框 / 收藏 / 主题 / 界面设置。执行前会自动保存一份当前状态的备份（可用“恢复”找回）。', 'meta'));
    const field = node('div', undefined, 'profile-field');
    field.append(node('span', '确认输入', 'profile-field-label'));
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'profile-input';
    input.setAttribute('aria-label', '输入“重置”以确认');
    input.placeholder = '输入“重置”以确认';
    const confirm = node('button', '确认重置', 'button');
    confirm.type = 'button';
    confirm.disabled = true;
    input.addEventListener('input', () => { confirm.disabled = input.value.trim() !== '重置'; });
    confirm.addEventListener('click', () => {
      if (input.value.trim() !== '重置') return;
      const result = progress.resetProgress();
      profileNotice = result.ok ? '学习进度已重置。重置前的状态已自动备份，可在“学习档案”里恢复。' : result.error;
      closeResetDialog();
      refreshAll();
    });
    field.append(input, confirm);
    parts.push(field);
    const cancel = node('button', '取消', 'button-secondary');
    cancel.type = 'button';
    cancel.addEventListener('click', closeResetDialog);
    parts.push(cancel);
    return parts;
  }

  /* v4.5（交接 C1）：学习伙伴昵称输入。1–12 个字符，走
   * progress.normalizeCompanionName 同一套清洗（去控制字符、折叠空白、按码点
   * 截断）。留空即恢复「该角色」的默认名（默认角色 nono=小诺，其余=登记名）。
   * 只改称呼，不动形象与任何学习数据。change（失焦/回车）时提交，
   * 不在 input 每键提交，避免重建面板抢走焦点。 */
  function buildCompanionNameField() {
    const row = node('label', undefined, 'daily-goal-field');
    row.append(node('span', '学习伙伴昵称', 'profile-field-label'));
    const input = document.createElement('input');
    input.className = 'profile-input';
    input.type = 'text';
    if (progress.Logic && progress.Logic.COMPANION_NAME_MAX_LENGTH) {
      input.maxLength = progress.Logic.COMPANION_NAME_MAX_LENGTH;
    }
    input.value = companionDisplayName();
    input.setAttribute('aria-label', '学习伙伴昵称（1 到 12 个字符，留空恢复该角色默认名）');
    input.disabled = !progress.isPersistent();
    input.addEventListener('change', () => {
      const result = progress.setCompanionName(input.value);
      /* 第二轮：提示用「生效显示名」——留空时 result.companionName 是清洗
       * 默认值「小诺」，但未命名角色实际回落各自登记名，不能报错名字。 */
      profileNotice = result.ok ? `学习伙伴现在叫「${companionDisplayName()}」。` : result.error;
      refreshAll();
    });
    row.append(input);
    return row;
  }

  /* v4.5（交接 C2）：显示模式 auto / always / minimal。与昵称同为单一事实源
   * （progress.settings().companionDisplay），个人中心设置与伙伴面板设置共用。 */
  function buildCompanionDisplayField() {
    const row = node('label', undefined, 'daily-goal-field');
    row.append(node('span', '伙伴显示模式', 'profile-field-label'));
    const select = document.createElement('select');
    select.className = 'profile-input';
    select.setAttribute('aria-label', '学习伙伴显示模式');
    const MODES = [
      ['auto', '自动 · 打开面板显示大人形'],
      ['always', '常显 · 每个视图都显示大人形'],
      ['minimal', '极简 · 只显示小头像与文字']
    ];
    const current = companionDisplayMode();
    MODES.forEach(pair => {
      const option = node('option', pair[1]);
      option.value = pair[0];
      if (pair[0] === current) option.selected = true;
      select.append(option);
    });
    select.disabled = !progress.isPersistent();
    select.addEventListener('change', () => {
      const result = progress.setCompanionDisplay(select.value);
      if (!result.ok) profileNotice = result.error;
      refreshAll();
    });
    row.append(select);
    return row;
  }

  /* ---------- v4.4（交接 B4/D4）：学习设置字段（唯一事实源） ----------
   * 个人中心「设置」Tab 与学习伙伴面板的「设置」二级视图共用这一个构建函数——
   * 两个入口、一套 UI、一份数据（progress.settings()），不允许维护两套状态。
   * 字段覆盖 D4 要求的全部项：每日目标、伙伴显示/隐藏、伙伴形象、成就提示、
   * 阅读进度条、快捷键、是否显示未开放课程、是否显示英文标题；
   * v4.5 追加伙伴昵称与显示模式（交接 C1/C2）。
   * 主题不放进设置字段：形象 Tab 四卡与 header 快捷入口是主题的装备路径
   * （B1/B2，避免同一功能第三处重复入口）。 */
  function buildUiSettingsFields() {
    const fields = [];
    /* 每日目标（与今日学习卡片同一入口，两处改同一份数据） */
    const goalRow = node('label', undefined, 'daily-goal-field');
    goalRow.append(node('span', '每日学习目标', 'profile-field-label'));
    const goalSelect = document.createElement('select');
    goalSelect.className = 'profile-input';
    goalSelect.setAttribute('aria-label', '每日学习目标（分钟）');
    progress.dailyGoalChoices().forEach(choice => {
      const option = node('option', `${choice} 分钟`);
      option.value = String(choice);
      if (choice === progress.settings().dailyGoalMinutes) option.selected = true;
      goalSelect.append(option);
    });
    goalSelect.disabled = !progress.isPersistent();
    goalSelect.addEventListener('change', () => {
      const result = progress.setDailyGoal(Number(goalSelect.value));
      if (!result.ok) profileNotice = result.error;
      refreshAll();
    });
    goalRow.append(goalSelect);
    fields.push(goalRow);

    const companionSelect = buildCompanionSelect();
    if (companionSelect) fields.push(companionSelect);
    /* v4.5（交接 C1/C2）：伙伴昵称 + 显示模式，紧跟形象选择（同一“伙伴”语境） */
    fields.push(buildCompanionNameField());
    fields.push(buildCompanionDisplayField());

    fields.push(node('h4', '界面开关'));
    fields.push(buildToggleRow('showCompanion', '显示学习伙伴', '关闭后右下角按钮隐藏'));
    fields.push(buildToggleRow('showAchievementNotes', '成就解锁提示', '解锁时页面底部的小条提示'));
    fields.push(buildToggleRow('showReadingPosition', '显示本页阅读位置', '课程页顶部的滚动进度条'));
    fields.push(buildToggleRow('showUnavailableLessons', '显示未开放课程', '目录里未开放课程的灰化行（Foundations 46 课已全部开放，当前无灰化行——为未来扩展保留开关）'));
    fields.push(buildToggleRow('showEnglishTitles', '显示英文标题', '课程与目录中的英文原题'));
    fields.push(buildToggleRow('shortcutsEnabled', '键盘快捷键', 'J / K / G H / G C / G P / ? 等，见课程页按 ? 的说明'));
    /* v4.11.5（交接 3.A2 第 6 条，CONTENT-STYLE-GUIDE.md 第 9 节）：官方任务节
     * 折叠偏好的说明文字。刻意不做成第 7 个开关——设置面板恰好 6 个
     * setting-toggle 被测试钉住，且该偏好的真实控制入口是课页折叠头本身
     * （展开态就是恢复出口）。不带 setting-toggle class，纯说明。 */
    fields.push(node('p', '课页「官方任务」节的 Assignment 列表可以用标题旁的按钮收起；收起一次后，所有课页都会默认收起。这个偏好随学习档案保存，点任意标题旁的「展开」即恢复。', 'meta'));
    return fields;
  }

  function buildSettingsSection() {
    const block = node('section', undefined, 'profile-section');
    block.append(node('h3', '学习设置'));
    block.append(node('p', '设置保存在这台设备的浏览器里，并随学习档案一起导出 / 导入；旧档案全部按默认值（开）处理。学习伙伴面板里的「设置」打开的就是这一套。', 'muted'));
    buildUiSettingsFields().forEach(field => block.append(field));

    /* Stretch I12 microcopy：「危险操作」是后台管理系统的腔调——
     * 换成直说后果的人话，并把安全网（重置前自动备份）讲在前面 */
    block.append(node('h4', '请谨慎操作'));
    block.append(node('p', '重置会清空这台设备上的学习记录。动手前会自动留一份备份，随时可以从「备份与恢复」找回。', 'muted'));
    const resetRow = node('div', undefined, 'profile-field');
    const resetButton = node('button', '重置学习进度…', 'button-danger');
    resetButton.type = 'button';
    resetButton.disabled = !progress.isPersistent();
    resetButton.addEventListener('click', openResetDialog);
    resetRow.append(resetButton);
    block.append(resetRow);
    if (!progress.isPersistent()) block.append(node('p', FILE_MODE_NOTE, 'notice'));
    return block;
  }

  /* ---------- v4.5（交接 A2）：关于本站（版本身份可见化） ----------
   * 个人中心「设置」Tab 与学习伙伴面板「设置」视图共用这一个构建函数
   *（与 buildUiSettingsFields 的同源策略一致）：产品版本、档案 schemaVersion、
   * 当前页面地址。用户真实踩过的坑：旧服务还在跑、浏览器开的是旧版本页面、
   * 页面上没有任何版本号可对照——这里把三件事实摆出来，一眼能核对。 */
  /* v4.5（Stretch K7）：复制文本到剪贴板。优先 navigator.clipboard（http/localhost
   * 安全上下文可用），失败或未提供时回落隐藏 textarea + execCommand('copy')。
   * 返回 Promise<boolean>，不抛错——复制失败只影响按钮文案，不影响任何功能。 */
  function legacyCopyText(text) {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.className = 'visually-hidden';
      document.body.append(area);
      area.select();
      const ok = typeof document.execCommand === 'function' && document.execCommand('copy');
      area.remove();
      return Boolean(ok);
    } catch (error) {
      return false;
    }
  }

  function copyTextToClipboard(text) {
    const nav = window.navigator;
    if (nav && nav.clipboard && typeof nav.clipboard.writeText === 'function') {
      return nav.clipboard.writeText(text).then(() => true, () => legacyCopyText(text));
    }
    return Promise.resolve(legacyCopyText(text));
  }

  /* v4.5（Stretch K7）：诊断信息纯文本——只含版本 / 页面地址 / 档案 schema /
   * 存储模式 / UA 五项，**绝不含**学习档案内容、昵称、叶片余额等任何个人数据
   * （交接红线：不得包含敏感数据）。用户求助时一键复制，省得来回截图。 */
  function diagnosticText() {
    return [
      `产品：${versionInfo ? `${versionInfo.product} v${versionInfo.version}` : '未知（version.js 未加载）'}`,
      `页面：${window.location.href}`,
      `档案 schema：${progress && progress.Logic ? progress.Logic.SCHEMA_VERSION : '未知'}`,
      `存储模式：${progress && progress.isPersistent() ? '持久化（http/localhost 服务）' : '仅内存（file:// 直接打开）'}`,
      `UA：${window.navigator && window.navigator.userAgent ? window.navigator.userAgent : '未知'}`
    ].join('\n');
  }

  function buildAboutSection() {
    const block = node('section', undefined, 'profile-section about-section');
    block.append(node('h3', '关于本站'));
    const list = node('dl', undefined, 'about-facts');
    const rows = [
      ['产品版本', versionInfo ? `${versionInfo.product} v${versionInfo.version}` : '未知（version.js 未加载）'],
      ['档案 schemaVersion', progress && progress.Logic ? String(progress.Logic.SCHEMA_VERSION) : '未知'],
      ['当前页面地址', window.location.href]
    ];
    rows.forEach(pair => {
      list.append(node('dt', pair[0]));
      list.append(node('dd', pair[1], 'about-value'));
    });
    block.append(list);
    /* Stretch K7：复制诊断信息按钮（版本/地址/schema/存储模式/UA，无个人数据） */
    const copyRow = node('div', undefined, 'dashboard-row');
    const copyButton = node('button', '复制诊断信息', 'button-secondary about-copy');
    copyButton.type = 'button';
    copyButton.setAttribute('aria-label', '复制诊断信息（版本、页面地址、档案 schema、UA；不含任何学习数据）');
    copyButton.addEventListener('click', () => {
      copyTextToClipboard(diagnosticText()).then(ok => {
        copyButton.textContent = ok ? '已复制 ✓' : '复制失败，请手动记录上面三项';
        window.setTimeout(() => { copyButton.textContent = '复制诊断信息'; }, 2500);
      });
    });
    copyRow.append(copyButton);
    block.append(copyRow);
    block.append(node('p', '本站是纯本地静态页面：无账号、无后端、无云同步。学习数据与「当前页面地址」绑定——如果这个地址和你平时用的不一致（端口不同、或 localhost 与 127.0.0.1 混用），你打开的可能是另一个服务实例，两边数据互不相通。', 'muted'));
    return block;
  }

  /* ---------- v4.2：备份与恢复（交接 §16） ---------- */
  function buildBackupBlock() {
    const block = node('div', undefined, 'backup-block');
    const backups = progress.listBackups();
    block.append(node('h4', `本地备份（最近 ${backups.length} / ${progress.backupKeepCount()} 份）`));
    block.append(node('p', '在 schema 迁移、导入档案、恢复备份与重置进度之前，本站会自动保存当前状态的快照；也可以现在手动保存一份。只保留最近几份，不是无限版本历史。', 'muted'));
    const manual = node('button', '立即备份当前状态', 'button-secondary');
    manual.type = 'button';
    manual.addEventListener('click', () => {
      const result = progress.createBackup('手动备份');
      profileNotice = result.ok ? '已保存一份当前状态的备份。' : result.error;
      refreshProfilePanel();
    });
    block.append(manual);
    if (backups.length) {
      const list = node('ul', undefined, 'backup-list');
      backups.forEach(item => {
        const row = node('li', undefined, 'backup-item');
        const text = node('div', undefined, 'backup-text');
        text.append(node('p', `${String(item.at).slice(0, 16).replace('T', ' ')} · 约 ${Math.max(1, Math.round(item.size / 1024))} KB`, 'backup-time'));
        text.append(node('p', item.reason || '（无说明）', 'backup-reason'));
        row.append(text);
        const restore = node('button', '恢复这份备份', 'button-secondary');
        restore.type = 'button';
        restore.addEventListener('click', () => {
          if (!window.confirm(`恢复 ${String(item.at).slice(0, 16).replace('T', ' ')} 的备份会覆盖当前的全部学习数据（恢复前会先自动备份当前状态）。确定继续吗？`)) return;
          const result = progress.restoreBackup(item.index);
          profileNotice = result.ok ? `已恢复 ${String(item.at).slice(0, 10)} 的备份。` : result.error;
          refreshAll();
        });
        row.append(restore);
        list.append(row);
      });
      block.append(list);
    }
    return block;
  }

  function buildArchiveSection() {
    const block = node('section', undefined, 'profile-section');
    block.append(node('h3', '学习档案'));
    block.append(node('p', '档案是一份 JSON 文件，包含完成状态、有效学习时长、XP、成就，以及昵称、头像与头像框。数据只存在这台设备的这个浏览器里，本站没有账号、没有云同步；换设备或换浏览器时用导出与导入手工搬运。', 'muted'));
    block.append(node('p', '导入会先只做校验不写入：档案不合法时给出中文原因并保持当前档案不变；校验通过后还会再确认一次，明确告知会覆盖本机档案。旧版（schemaVersion 1）档案会自动迁移，XP、时长与完成状态一个都不会丢。', 'meta'));
    buildArchiveControls().forEach(part => block.append(part));
    /* v4.2：本地备份与恢复（§16） */
    block.append(buildBackupBlock());
    return block;
  }

  /* ---------- v4.4（交接 B3/B4 + audit U3/U5）：个人中心 Tabs ----------
   * 四个 Tab：形象 / 成就收藏 / 统计 / 设置——设置不再需要长滚动才能找到
   * （B3）。Tab 用 ARIA tablist/tab/tabpanel 三件套 + roving tabindex +
   * 左右方向键（U3 shadcn Tabs 语法）；面板体惰性按 Tab 重建，同一时间
   * DOM 里只有一个 Tab 的内容，不再把九个 section 全部平铺。
   * 首页「收藏与成就」「学习统计」入口卡通过 openProfilePanel(tab) 直达对应
   * Tab——同一系统多入口，内容只有一份实现（B4）。 */
  const PROFILE_TABS = [
    { id: 'identity', zh: '形象' },
    { id: 'achievements', zh: '成就收藏' },
    { id: 'stats', zh: '统计' },
    { id: 'settings', zh: '设置' }
  ];

  function profileTabChildren(tabId) {
    if (tabId === 'achievements') {
      const children = [buildAchievementSection()];
      /* v4.3（交接 D1）：循环成就（铜/银/金）紧跟一次性成就，同一“成就”语境 */
      const tierSection = buildTierSection();
      if (tierSection) children.push(tierSection);
      children.push(buildCollectionSection());
      return children;
    }
    if (tabId === 'stats') {
      const children = [];
      /* v4.3（交接 F）：热力图 / 个人最佳 / 每课耗时（全部从 daily 纯函数推导） */
      const statsSection = buildStatsSection();
      if (statsSection) children.push(statsSection);
      /* v4.4：学习历史归入统计 Tab——它是数据的另一种视图，不再单列长滚动 */
      children.push(buildHistorySection());
      return children;
    }
    if (tabId === 'settings') {
      return [buildSettingsSection(), buildArchiveSection(), buildAboutSection()];
    }
    return [buildIdentitySection()];
  }

  function buildProfileTablist() {
    const tablist = node('div', undefined, 'profile-tabs');
    tablist.setAttribute('role', 'tablist');
    tablist.setAttribute('aria-label', '个人资料分区');
    PROFILE_TABS.forEach((tab, index) => {
      const selected = tab.id === profileActiveTab;
      const button = node('button', tab.zh, `profile-tab${selected ? ' is-selected' : ''}`);
      button.type = 'button';
      button.id = `profile-tab-${tab.id}`;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', 'profile-tabpanel');
      button.setAttribute('aria-selected', String(selected));
      /* roving tabindex：Tab 键只停一次，方向键在 Tab 间移动（U3） */
      button.tabIndex = selected ? 0 : -1;
      button.addEventListener('click', () => switchProfileTab(tab.id));
      button.addEventListener('keydown', event => handleProfileTabKeydown(event, index));
      tablist.append(button);
    });
    return tablist;
  }

  function handleProfileTabKeydown(event, index) {
    let next = null;
    if (event.key === 'ArrowRight') next = (index + 1) % PROFILE_TABS.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + PROFILE_TABS.length) % PROFILE_TABS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = PROFILE_TABS.length - 1;
    if (next === null) return;
    if (typeof event.preventDefault === 'function') event.preventDefault();
    switchProfileTab(PROFILE_TABS[next].id);
  }

  function switchProfileTab(tabId) {
    profileActiveTab = tabId;
    refreshProfilePanel();
    /* 重建后焦点回到新选中的 Tab 按钮（roving tabindex 的键盘契约） */
    if (profileBody) {
      const button = profileBody.querySelector(`#profile-tab-${tabId}`);
      if (button && typeof button.focus === 'function') button.focus();
    }
  }

  function profileBodyChildren() {
    const children = [panelNoticeLine(), buildProfileTablist()];
    const panel = node('div', undefined, 'profile-tabpanel');
    panel.id = 'profile-tabpanel';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `profile-tab-${profileActiveTab}`);
    profileTabChildren(profileActiveTab).forEach(child => {
      if (child) panel.append(child);
    });
    children.push(panel);
    return children;
  }

  function buildProfilePanel() {
    const dialog = node('dialog', undefined, 'profile-dialog');
    dialog.setAttribute('aria-labelledby', 'profile-panel-title');
    const head = node('div', undefined, 'dialog-head');
    const title = node('h2', '个人中心');
    title.id = 'profile-panel-title';
    const closeButton = node('button', '关闭', 'dialog-close');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', '关闭个人中心');
    closeButton.addEventListener('click', closeProfilePanel);
    head.append(title, closeButton);
    profileBody = node('div', undefined, 'profile-body');
    profileBody.append(...profileBodyChildren());
    dialog.append(head, profileBody);
    return dialog;
  }

  /* 只更新时长数值，不重建面板。面板没打开时直接返回。 */
  function tickLiveStats() {
    if (!progress) return;
    const summary = progress.summary();
    /* statCell 的结构固定是 label / value / hint，因此 value 一定是第 2 个子节点。
     * v4.4：liveStat 引用可能来自个人资料面板或「学习进度」sheet——两处都是
     * 每次重建时重新登记，更新脱链节点无副作用。 */
    if (liveStatToday && liveStatToday.children[1]) {
      liveStatToday.children[1].textContent = progress.formatSeconds(summary.todaySeconds);
    }
    if (liveStatTotal && liveStatTotal.children[1]) {
      liveStatTotal.children[1].textContent = progress.formatSeconds(summary.totalSeconds);
    }
    /* v4.4：首页今日条的分钟数跟着保存周期走（整条重建，节点很小） */
    if (homeTodayStrip) {
      homeTodayStrip.replaceChildren(...todayStripChildren());
      if (homeTodayStrip._relabel) homeTodayStrip._relabel();
    }
    refreshAssistantPanel();
  }

  function isPanelOpen() {
    if (!profileDialog) return false;
    if (profileDialog.open) return true;
    return typeof profileDialog.hasAttribute === 'function' && profileDialog.hasAttribute('open');
  }

  /* 面板没打开时什么都不做，避免后台每 15 秒白重建一次 DOM。 */
  function refreshProfilePanel() {
    if (!profileDialog || !profileBody) return;
    if (!isPanelOpen()) return;
    profileBody.replaceChildren(...profileBodyChildren());
  }

  /* v4.4（交接 B3/B4）：可选 tab 参数——首页「收藏与成就」「学习统计」入口
   * 直接定位到个人中心对应 Tab（同一系统多入口，内容只有一份实现）。
   * tab 的完整 Tabs UI 在个人中心重构里实现；这里先记录意图并保证旧调用
   * （无参数）完全不受影响。 */
  let profileActiveTab = 'identity';
  let profileTrigger = null;

  function openProfilePanel(tab, triggerElement) {
    if (!progress) return;
    if (tab) profileActiveTab = tab;
    /* 显式 trigger 优先；否则按 activeElement 记录（audit U4 焦点归还） */
    if (triggerElement) profileTrigger = triggerElement;
    else {
      const active = document.activeElement;
      profileTrigger = active && active !== document.body && typeof active.focus === 'function' ? active : profileTrigger;
    }
    const firstBuild = !profileDialog;
    if (firstBuild) {
      profileDialog = buildProfilePanel();
      document.body.append(profileDialog);
    }
    /* 每次打开都清掉上一轮的操作提示，避免旧消息看起来像刚发生的 */
    profileNotice = '';
    /* 先打开、再刷新内容：refreshProfilePanel 只在面板已打开时才重建。
     * 顺序反过来的话，第二次打开时刷新会被 isPanelOpen() 挡掉，
     * 用户看到的仍是上一轮遗留的提示文字与旧数值。 */
    if (typeof profileDialog.showModal === 'function') {
      if (!profileDialog.open) profileDialog.showModal();
    } else {
      /* 极旧的浏览器没有 showModal：退回非模态显示。关闭按钮始终存在，
       * 因此仍然有明确的关闭方式；原生路径下 Esc 也可以关闭。 */
      profileDialog.setAttribute('open', '');
    }
    if (!firstBuild) refreshProfilePanel();
  }

  function closeProfilePanel() {
    if (!profileDialog) return;
    if (typeof profileDialog.close === 'function') profileDialog.close();
    else profileDialog.open = false;
    /* 把焦点还给触发它的按钮（v4.4：可能是 header 玩家 chip，也可能是首页
     * 入口卡——不再固定回 playerEntry），键盘用户不会丢失位置 */
    const target = profileTrigger && typeof profileTrigger.focus === 'function' ? profileTrigger : playerEntry;
    if (target && typeof target.focus === 'function') target.focus();
  }

  /* ---------- v4：官方 Foundations 完整 46 课目录（§6） ---------- */

  /* 目录总课数。catalog.js 没载入时返回 null，界面据此降级为只显示已开放口径，
   * 绝不把 20 / 20 说成 46 / 46（§6.4）。 */
  function catalogTotal() {
    return catalog && Array.isArray(catalog.lessons) && catalog.lessons.length ? catalog.lessons.length : null;
  }

  /* catalog.js 缺失时（例如只把部分文件复制到别处），用 lessons.js 现造一份只含已开放
   * 课程的目录。界面降级成“看不到完整 46 课”，但已开放的课仍然完整可点，不会因为少
   * 一个数据文件就整页开天窗。 */
  function effectiveCatalog() {
    if (catalog && Array.isArray(catalog.lessons) && catalog.lessons.length) return catalog;
    return {
      groups: data.groups.map((group, index) => ({ id: `fallback-${index}`, en: group.en, zh: group.zh })),
      lessons: data.lessons.map((lesson, index) => ({
        order: index + 1,
        slug: lesson.id,
        title: lesson.title,
        zh: lesson.zh,
        group: `fallback-${lesson.group}`,
        type: 'lesson',
        available: true
      }))
    };
  }

  /* §6.4 的三个进度数字。首页 Dashboard 与个人资料面板共用这一个函数，因此两处永远
   * 给出同样的口径，不会出现“面板说 20 / 46、首页说 20 / 20”的分叉。
   * 层级刻意是：主目标 46 → 本站开放到第几课 → 你完成了多少。
   * 完成数只可能来自已开放课程，所以 X 最大就是 20，不会虚构后续完成状态。 */
  function progressCells(summary) {
    const total = catalogTotal();
    if (!total) {
      return [statCell('完成课程', `${summary.completedCount} / ${summary.totalLessons}`, `完成 ${summary.percent}%`)];
    }
    /* 主目标是官方 46 课，因此这一格加重显示，让三个数字的层级一眼可辨（§6.4） */
    const primary = statCell('Foundations 总进度', `${summary.completedCount} / ${total}`, '官方 Foundations 全部课程');
    primary.className = 'stat stat-primary';
    return [
      primary,
      statCell('本站已开放中文课程', `${summary.totalLessons} / ${total}`, '本站当前开放的课程范围'),
      /* v4.2（交接 §2.1）：把完成口径写在数字旁边——只有勾选「本课已完成」才计入这里，
       * 官方任务 / 自测 / 复习是独立记录，不会让完成数 +1。 */
      statCell('已完成开放课程', `${summary.completedCount} / ${summary.totalLessons}`, `完成 ${summary.percent}% · 仅统计勾选了「本课已完成」的课`)
    ];
  }

  const pad2 = value => String(value).padStart(2, '0');

  /* 目录里的一行。
   * 已开放：渲染成 <a class="lesson-link">，结构与 v3 完全一致（序号 / 名称 / 箭头三列）。
   * 未开放：渲染成 <div class="lesson-locked">，刻意不是链接、也没有 href ——
   *   §6.2 要求“不能点击进入不存在的课程页”，最可靠的做法是根本不生成链接，
   *   而不是生成 href="#" 再靠脚本拦截。
   * 它也刻意不带 lesson-link 这个 class：首页 .lesson-link 的数量必须恰好等于本站已开放
   *   中文正文的课程数，这个语义被测试钉住了。 */
  function catalogRow(entry) {
    const lesson = findLesson(entry.slug);
    /* 目录说某课已开放、lessons.js 里却没有正文，属于数据不一致：按未开放处理。
     * 宁可少给一个入口，也不能生成一个点进去是“未找到这节课”的链接。 */
    const usable = Boolean(entry.available) && Boolean(lesson);
    const item = node('li');
    item.value = entry.order;
    const name = node('span');
    if (entry.type === 'project') name.append(node('span', '项目', 'lesson-type'));
    name.append(
      node('strong', usable ? lesson.zh : entry.zh),
      node('span', usable ? lesson.title : entry.title, 'english')
    );
    const number = node('span', pad2(entry.order), 'number');
    if (usable) {
      const row = link('', lessonHref(lesson), 'lesson-link');
      const arrow = node('span', '→', 'arrow');
      arrow.setAttribute('aria-hidden', 'true');
      row.append(number, name, arrow);
      if (entry.slug === activeLessonId) {
        row.classList.add('is-current');
        row.setAttribute('aria-current', 'true');
      }
      item.append(row);
      return item;
    }
    const row = node('div', undefined, 'lesson-locked');
    row.append(number, name, node('span', '暂未开放', 'lesson-flag'));
    item.append(row);
    return item;
  }

  /* 完整目录：官方 8 个分组、46 课。首页直接内联展示，课程页的“课程目录”抽屉复用
   * 同一个函数，因此两处的顺序、分组、灰化规则与“项目”标记永远一致。 */
  function catalogSections(matchFn) {
    const source = effectiveCatalog();
    return source.groups.map(group => {
      const allEntries = source.lessons.filter(entry => entry.group === group.id);
      /* v4.4 Stretch I6-I8：可选过滤（搜索 / 已开放 / 需要复习）。
       * 计数行始终用全量 entries——「本站已开放 x / y 课」是客观事实，
       * 不随过滤漂移；过滤后无匹配行的分组整组不渲染。 */
      const entries = matchFn ? allEntries.filter(matchFn) : allEntries;
      if (matchFn && !entries.length) return null;
      const unit = node('section', undefined, 'unit');
      /* 技能路线的“在目录中查看这一单元”锚点落在这里 */
      unit.id = `unit-${group.id}`;
      const heading = node('div', undefined, 'unit-heading');
      heading.append(node('h2', group.zh), node('span', group.en, 'meta'));
      const openCount = allEntries.filter(entry => entry.available && findLesson(entry.slug)).length;
      heading.append(node(
        'span',
        openCount ? `本站已开放 ${openCount} / ${allEntries.length} 课` : '本站暂未开放',
        'meta unit-state'
      ));
      unit.append(heading);
      const courseList = node('ol', undefined, 'lesson-list');
      entries.forEach(entry => courseList.append(catalogRow(entry)));
      unit.append(courseList);
      return unit;
    }).filter(Boolean);
  }

  /* ---------- v4：右下角学习助手「小奥」（§10） ----------
   * §10 的边界写得很清楚：本轮它不是 AI 聊天机器人，不接模型 API，不联网，
   * 也刻意不做自由输入框 —— 面板里每一条信息与那一条建议，全部由
   * Logic.assistantBrief() 按确定性规则从本机学习数据算出来。
   * 所以这个面板里只有一个关闭按钮和一个“继续学习”链接，没有任何能输入文字的地方，
   * 也不会伪装成能回答编程问题的 AI。
   * 角色形象是本站原创的小芽（与本站 Garden 主题一致），不复制任何商业角色。
   * 与另外两个面板同样的约束：dialog 挂在 document.body 上、不用 details/summary，
   * 因此不影响 main h2 序列，也不影响“页面第一个 summary 是自测答案”。 */
  let assistantDialog = null;
  let assistantBody = null;
  let assistantTrigger = null;
  /* v4.5（交接 C1）：面板标题元素引用——昵称可在面板内改，标题要跟着刷新，
   * 因此单独留住引用，refreshAssistantPanel 时同步更新（否则标题会停留在旧名）。 */
  let assistantTitleEl = null;

  /* 一条信息一行：dt 是项目名，dd 里放数值与可选的补充说明。
   * 补充说明放在 dd 内部而不是 dl 的直接子节点，这样 dl 的结构始终合法。 */
  function assistantFact(term, value, hint) {
    const row = node('div', undefined, 'assistant-fact');
    row.append(node('dt', term));
    const dd = node('dd');
    dd.append(node('span', value, 'assistant-value'));
    if (hint) dd.append(node('span', hint, 'assistant-hint'));
    row.append(dd);
    return row;
  }

  const lessonLabel = item => (item ? `${item.zh}（${item.title}）` : null);

  /* v4.3 Batch 9（交接 M23）：下一件可解锁装扮提示。
   * 四类资产统一扫描，只挑“最近的一个”给确定性提示：
   *   1. 余额已经够的叶片款（立刻可解锁，行动最近）；
   *   2. 等级款里目标等级最低的一个（进度型，升级自然到达）；
   *   3. 最便宜的叶片款（还差多少叶片）；
   *   4. 只剩成就款时给一句泛指（成就条件差异大，且隐藏成就不公开条件）。
   * 全部拥有时返回 null，面板不显示这一行（不编造假目标）。 */
  function nextCosmeticHint() {
    if (!collections) return null;
    const state = progress.getState();
    const summary = progress.summary();
    const all = [
      /* v4.10：可选头像清单——提示「下一个装扮目标」必须是用户真能选到的东西，
       * 退役头像即便未解锁也不该被报出来（当前退役项是 default 解锁，本就不会
       * 进这个列表，这里改的是语义正确性与未来防呆）。 */
      typedAssets('avatar', selectableAvatarList()),
      typedAssets('frame', progress.FRAMES),
      companions && Array.isArray(companions.companions) ? typedAssets('companion', companions.companions) : [],
      themes && Array.isArray(themes.themes) ? typedAssets('theme', themes.themes) : []
    ].flat().filter(asset => asset.unlock && !collections.isAssetUnlocked(state, asset));
    const coinItems = all.filter(asset => asset.unlock.kind === 'coins')
      .sort((a, b) => a.unlock.value - b.unlock.value);
    if (coinItems.length && coinItems[0].unlock.value <= summary.coins) {
      return {
        text: `「${coinItems[0].zh}」现在就能解锁`,
        hint: `叶片解锁品 · ${coinItems[0].unlock.value} 叶片，当前余额 ${summary.coins}（装扮收藏里解锁）`
      };
    }
    const levelItems = all.filter(asset => asset.unlock.kind === 'level' && Number(asset.unlock.value) > 1)
      .sort((a, b) => a.unlock.value - b.unlock.value);
    if (levelItems.length) {
      return {
        text: `Lv.${levelItems[0].unlock.value} 解锁「${levelItems[0].zh}」`,
        hint: `当前 Lv.${summary.level}；继续学习升级即可，不需要叶片`
      };
    }
    if (coinItems.length) {
      return {
        text: `还差 ${coinItems[0].unlock.value - summary.coins} 叶片解锁「${coinItems[0].zh}」`,
        hint: '有效学习、完成课程、每日目标与挑战卡都会获得叶片'
      };
    }
    if (all.some(asset => asset.unlock.kind === 'achievement')) {
      return { text: '剩下的装扮都由成就解锁', hint: '具体条件在个人资料「装扮收藏」里逐项标注' };
    }
    return null;
  }

  /* ---------- v4.4（交接 D2/D3/D4）：小奥面板 2.0 ----------
   * 默认视图极简：角色（带表情）+ 今日一句话 + 一个最重要的下一步 + 今日进度。
   * 二级视图（今天 / 复习 / 成就 / 设置）点击才展开——全部入口是真实 button，
   * 手机永远可点，hover 只是增强（红线 9）。
   * 表情由确定性规则从学习数据映射（companionMood），不随机、不联网、
   * 无动画大包——只是五张静态 bust 的切换；「非 AI」边界与 v4 一致。 */
  let assistantView = 'home';

  /* v4.5（Stretch K3）：升级/晋升触发的庆祝窗口——窗口期内伙伴表情固定为
   * celebrate 并给 bust 加轻量 CSS 动画（.is-celebrating，两遍小幅弹跳，
   * prefers-reduced-motion 下动画自动关闭、静态庆祝脸保留）。成就联动走
   * 下面 companionMood 里既有的「今天解锁过成就」确定性规则（v4.4 I4）。
   * 只存内存、不写档案：刷新即恢复，绝不影响任何状态。 */
  let celebrateUntil = 0;
  function startCelebration() {
    celebrateUntil = Date.now() + 6000;
    window.setTimeout(() => {
      if (Date.now() >= celebrateUntil) refreshAssistantPanel();
    }, 6200);
  }

  const MOOD_ZH = { normal: '普通', happy: '开心', encourage: '鼓励', remind: '提醒', celebrate: '庆祝' };
  const MOOD_LINES = {
    normal: '你来啦。按自己的节奏，一步一步来。',
    happy: '今天已经学过了，干得不错！',
    encourage: '就差一点点，今天就能计入连续学习。加油！',
    remind: '今天有课到了建议复习的日子，抽空看一眼就好。',
    celebrate: '今日目标达成，你太厉害了！'
  };

  /* 表情映射（确定性）：今日目标达成 → 庆祝；其余跟随 assistantTip 的 kind——
   * tip 本来就是「现在最该做什么」的规则推导，表情与它同源，不打架。 */
  function companionMood(info) {
    /* v4.5（Stretch K3）：升级/晋升庆祝窗口优先（6 秒，内存态） */
    if (Date.now() < celebrateUntil) return 'celebrate';
    const brief = progress.dailyBrief ? progress.dailyBrief() : null;
    if (brief && brief.goalDone) return 'celebrate';
    /* Stretch I4：今天解锁过成就（首次完成 / 铜银金晋升 / Boss 高分等全部
     * 统一记在成就表里）时小奥同喜。确定性规则：成就日期 == 今天，
     * 无随机、无事件动画、不改任何数据。 */
    if (info && info.latestAchievement && progress.Logic && progress.Logic.dayKeyFromDate
      && info.latestAchievement.date === progress.Logic.dayKeyFromDate(new Date())) {
      return 'celebrate';
    }
    if (companionView && typeof companionView.moodFor === 'function') {
      return companionView.moodFor(info);
    }
    const MOOD_BY_TIP = { 'all-done': 'celebrate', 'today-short': 'encourage', 'review-due': 'remind', steady: 'happy' };
    return (info && info.tip && MOOD_BY_TIP[info.tip.kind]) || 'normal';
  }

  function assistantBust(companion, mood) {
    const name = companionDisplayName();
    const label = companionNameWithForm(name, companion);
    const moodLabel = `${label}（表情：${MOOD_ZH[mood] || mood}）`;
    /* v4.5（Stretch K3）：庆祝表情时给 bust 加轻动画类（CSS 里尊重
     * prefers-reduced-motion：减弱动画设置下只保留静态庆祝脸，不弹跳）。 */
    const celebrating = mood === 'celebrate' ? ' is-celebrating' : '';
    /* v4.5（交接 D）：人形（带 bust）优先走装扮参数化系统，按当前四槽 + 体型
     * 运行时拼装；wardrobe 缺失时回落 v4.4 的 ODIN_COMPANION_BUST 生成器。 */
    if (companion && companion.bust) {
      const look = currentCompanionLook(companion);
      if (wardrobe && look) return svgImage(wardrobe.build(look, mood), moodLabel, `assistant-bust${celebrating}`);
      const busts = window.ODIN_COMPANION_BUST;
      if (busts) return svgImage(busts.build(companion.bust, mood), moodLabel, `assistant-bust${celebrating}`);
    }
    if (companion) {
      const creatureClass = companion.kind === 'creature' ? ' is-creature' : '';
      const portrait = companionPortraitImage(companion, { slot: 'profile', mood }, `assistant-bust${creatureClass}${celebrating}`, moodLabel);
      if (portrait) return portrait;
    }
    if (icons && icons.assistant) return svgImage(icons.assistant, name, `assistant-bust is-creature${celebrating}`);
    return null;
  }

  /* v4.5（交接 C2 minimal）：面板只显示小头像 + 文字时用的紧凑头像。
   * 人形走当前装扮的 icon（反映装扮），生物用自身 svg；只是尺寸类名不同。 */
  function assistantSmallAvatar(companion) {
    const name = companionDisplayName();
    const label = companionNameWithForm(name, companion);
    const portrait = companionPortraitImage(companion, { slot: 'corner' }, 'assistant-avatar-lg', label);
    if (portrait) return portrait;
    if (icons && icons.assistant) return svgImage(icons.assistant, name, 'assistant-avatar-lg');
    return null;
  }

  /* 面板舞台的形象：按显示模式决定大人形还是小头像（交接 C2）。
   *   minimal → 小头像；auto / always → 大人形（带表情）。 */
  function assistantStagePortrait(companion, mood) {
    if (companionDisplayMode() === 'minimal') return assistantSmallAvatar(companion);
    return assistantBust(companion, mood);
  }

  /* always 模式：二级视图（今天/复习/成就/设置）顶部也持续带一个大人形，
   * 让“伙伴一直在”这件事在每个视图都成立（交接 C2 always 的语义）。
   * auto / minimal 模式返回 null，二级视图不带大图（与 v4.4 一致 / 极简）。 */
  function assistantAlwaysBust(companion, mood) {
    if (companionDisplayMode() !== 'always') return null;
    const bust = assistantBust(companion, mood);
    if (!bust) return null;
    const wrap = node('div', undefined, 'assistant-always-bust');
    wrap.append(bust);
    return wrap;
  }

  /* 二级视图的标题行：标题 + 返回（默认视图） */
  function assistantViewHead(titleText) {
    const head = node('div', undefined, 'assistant-view-head');
    head.append(node('h3', titleText));
    const back = node('button', '← 返回', 'assistant-back button-secondary');
    back.type = 'button';
    back.addEventListener('click', () => {
      assistantView = 'home';
      refreshAssistantPanel();
    });
    head.append(back);
    return head;
  }

  /* D3 二级入口行：今天 / 复习 / 成就 / 设置。当前视图高亮，再点回默认。 */
  function assistantNavRow() {
    const row = node('div', undefined, 'assistant-nav');
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', '学习伙伴面板分区');
    [['today', '今天'], ['review', '复习'], ['achievements', '成就'], ['settings', '设置']].forEach(pair => {
      const active = assistantView === pair[0];
      const btn = node('button', pair[1], `assistant-nav-btn${active ? ' is-active' : ''}`);
      btn.type = 'button';
      btn.setAttribute('aria-pressed', String(active));
      btn.addEventListener('click', () => {
        assistantView = active ? 'home' : pair[0];
        refreshAssistantPanel();
      });
      row.append(btn);
    });
    return row;
  }

  /* 默认视图（D2）：角色 + 今日一句话 + 一个下一步 + 今日进度，别的都不塞 */
  function assistantHomeView(info) {
    const companion = resolveCompanion(progress.cosmetics().companionId);
    const mood = companionMood(info);
    const children = [];
    const stage = node('div', undefined, 'assistant-stage');
    /* v4.5（交接 C2）：minimal 显示小头像，auto/always 显示大人形 */
    const portrait = assistantStagePortrait(companion, mood);
    if (portrait) stage.append(portrait);
    const voiceBox = node('div', undefined, 'assistant-voice-box');
    voiceBox.append(node('p', MOOD_LINES[mood] || MOOD_LINES.normal, 'assistant-mood-line'));
    /* v4.2：形象只改外观与一句固定语气（§6.2），不改变任何数值与建议规则 */
    if (companion) voiceBox.append(node('p', companion.voice, 'assistant-voice'));
    stage.append(voiceBox);
    children.push(stage);

    /* Stretch I4：今天解锁过成就时给一句具体祝贺（mood 已是 celebrate）；
     * 只陈述事实（成就名 + 日期），不发奖励、不弹独立窗口 */
    if (info.latestAchievement && progress.Logic && progress.Logic.dayKeyFromDate
      && info.latestAchievement.date === progress.Logic.dayKeyFromDate(new Date())) {
      children.push(node('p', `今天解锁了成就：${info.latestAchievement.zh}`, 'assistant-cheer'));
    }

    const tip = node('p', undefined, 'assistant-tip');
    tip.append(node('span', '下一步', 'assistant-tip-label'), node('span', info.tip.text, 'assistant-tip-text'));
    children.push(tip);
    if (info.continueLesson) {
      const row = node('div', undefined, 'dashboard-row');
      const go = link(`继续学习：${info.continueLesson.zh} →`, lessonHref(info.continueLesson), 'button');
      go.addEventListener('click', closeAssistantPanel);
      row.append(go);
      children.push(row);
    }

    /* 今日学习进度（轻条；完整数字在「今天」视图） */
    const brief = progress.dailyBrief ? progress.dailyBrief() : null;
    if (brief) {
      const todayRow = node('div', undefined, 'assistant-today');
      todayRow.append(node('span', `今日 ${brief.todayText} / 目标 ${brief.goalMinutes} 分钟${brief.goalDone ? ' · 已达成' : ''}`, 'meta'));
      const bar = node('div', undefined, 'daily-progress');
      const fill = node('div', undefined, `daily-progress-fill${brief.goalDone ? ' is-done' : ''}`);
      fill.style.width = `${brief.goalProgress}%`;
      bar.append(fill);
      bar.setAttribute('role', 'progressbar');
      bar.setAttribute('aria-valuemin', '0');
      bar.setAttribute('aria-valuemax', '100');
      bar.setAttribute('aria-valuenow', String(brief.goalProgress));
      bar.setAttribute('aria-label', `学习伙伴面板今日学习进度：${brief.goalProgress}%`);
      todayRow.append(bar);
      todayRow.append(node('span', `连续 ${info.streak} 天`, 'meta'));
      children.push(todayRow);
    }

    children.push(assistantNavRow());
    children.push(node('p', `${companionDisplayName()}不是 AI 聊天机器人，也不联网：每条数字与建议都按固定规则从这台设备的学习数据算出，没有输入框，也不会回答编程问题。点「今天」看完整数据。`, 'assistant-disclaimer'));
    return children;
  }

  /* 「今天」视图：v4.3 的完整事实清单原样搬进来（口径零变化） */
  function assistantTodayView(info) {
    const children = [assistantViewHead('今天')];
    const facts = node('dl', undefined, 'assistant-facts');
    facts.append(assistantFact('今天有效学习', info.todayText, `满 ${info.streakDayMinutes} 分钟才计入连续学习`));
    facts.append(assistantFact('连续学习', `${info.streak} 天`, '中间断一天就从断点重新算'));
    facts.append(assistantFact('等级 / XP', `Lv.${info.level} · ${info.xp} XP`, `距下一级还需 ${info.xpToNext} XP`));
    /* v4.3 Batch 6（交接 I）：成长阶段——由学习数据纯函数推导，与皮肤无关；
     * 不死亡、不枯萎、不掉阶段，文案只陈述事实与下一阶条件 */
    const growth = companionGrowth();
    if (growth) {
      facts.append(assistantFact(
        '成长阶段',
        growth.maxed ? `${growth.zh}（已长成）` : growth.zh,
        growth.next ? `下一阶段「${growth.next.zh}」：${growth.next.reach}` : '陪伴不会枯萎，阶段也不会回退'
      ));
    }
    facts.append(assistantFact('叶片', `${info.coins}`, '学习行为获得，只用于解锁装扮收藏，不影响等级'));
    facts.append(assistantFact(
      '当前进度',
      `${info.completedCount} / ${info.totalLessons}`,
      info.catalogTotal ? `本站已开放课程；官方 Foundations 共 ${info.catalogTotal} 课` : `完成 ${info.percent}%`
    ));
    facts.append(assistantFact('最近学习', lessonLabel(info.recentLesson) || '还没有学习记录'));
    facts.append(assistantFact('建议继续', lessonLabel(info.continueLesson) || '当前开放课程已全部完成'));
    facts.append(assistantFact('需要复习', `${info.needsReviewCount} 课`, '只统计你自己标记过的'));
    children.push(facts);
    children.push(assistantNavRow());
    return children;
  }

  /* 「复习」视图：到期清单 + 动作（完成复习 / 仍不熟）+ 接下来的安排 */
  function assistantReviewView() {
    const children = [assistantViewHead('复习')];
    const summary = progress.summary();
    const dueList = progress.reviewDueList ? progress.reviewDueList() : [];
    if (dueList.length) {
      children.push(node('p', `今天有 ${dueList.length} 课建议复习。逾期不扣分、不掉进度，什么时候想起来都可以补。`, 'meta'));
      const list = node('ul', undefined, 'review-due-list');
      dueList.forEach(item => {
        const lesson = findLesson(item.lessonId);
        const row = node('li', undefined, 'review-due-item');
        const text = node('div', undefined, 'review-due-text');
        text.append(node('span', lesson ? lesson.zh : item.lessonId, 'review-due-name'));
        text.append(node('span', item.overdueDays > 0 ? `建议复习日 ${item.dueDay}（已过 ${item.overdueDays} 天，随时可以补）` : `今天到期（第 ${item.intervalIndex + 1} 轮，已完成 ${item.doneCount} 次复习）`, 'meta'));
        row.append(text);
        const actions = node('div', undefined, 'review-due-actions');
        const doneButton = node('button', '完成复习', 'button-secondary');
        doneButton.type = 'button';
        doneButton.disabled = !progress.isPersistent();
        doneButton.addEventListener('click', () => {
          progress.completeReview(item.lessonId);
          refreshAll();
        });
        const weakButton = node('button', '仍不熟', 'button-secondary');
        weakButton.type = 'button';
        weakButton.disabled = !progress.isPersistent();
        weakButton.addEventListener('click', () => {
          progress.markStillWeak(item.lessonId);
          refreshAll();
        });
        actions.append(doneButton, weakButton);
        row.append(actions);
        list.append(row);
      });
      children.push(list);
    } else {
      const next = progress.nextReviewDue ? progress.nextReviewDue() : null;
      const nextLesson = next ? findLesson(next.lessonId) : null;
      children.push(node('p', next
        ? `今天没有到期的复习。下一次建议复习：${next.dueDay} ·「${nextLesson ? nextLesson.zh : next.lessonId}」。`
        : '今天没有到期的复习。在任意一课勾选「需要复习」就会开始 1 / 3 / 7 / 30 天的复习阶梯。', 'muted empty-state'));
    }
    children.push(node('p', `你一共标记了 ${summary.needsReviewCount} 课「需要复习」。`, 'meta'));
    const upcoming = progress.reviewUpcomingList ? progress.reviewUpcomingList(7) : [];
    if (upcoming.length) {
      children.push(node('h4', '接下来的复习安排'));
      const upcomingList = node('ul', undefined, 'review-upcoming-list');
      upcoming.forEach(item => {
        const lesson = findLesson(item.lessonId);
        upcomingList.append(node('li', `${item.dueDay} · ${lesson ? lesson.zh : item.lessonId}（第 ${item.intervalIndex + 1} 轮）`));
      });
      children.push(upcomingList);
    }
    children.push(assistantNavRow());
    return children;
  }

  /* 「成就」视图：轻量进度 + 下一目标；完整成就墙去个人中心（一个按钮直达） */
  function assistantAchievementsView(info) {
    const children = [assistantViewHead('成就')];
    const facts = node('dl', undefined, 'assistant-facts');
    facts.append(assistantFact('成就', `${info.achievementCount} / ${info.achievementTotal}`, '按真实学习状态自动解锁'));
    facts.append(assistantFact(
      '下一个成就',
      info.nextGoal ? `${info.nextGoal.zh} — 还差 ${info.nextGoal.remainingText}` : '可见成就已全部解锁',
      info.nextGoal ? info.nextGoal.desc : undefined
    ));
    facts.append(assistantFact(
      '下一个头像框',
      info.nextFrame ? `${info.nextFrame.zh} — 还差 ${info.nextFrame.remainingText}` : '头像框已全部解锁'
    ));
    /* v4.3 Batch 9（交接 M23）：下一件可解锁装扮（四类资产里最近的一个） */
    const cosmeticHint = nextCosmeticHint();
    if (cosmeticHint) facts.append(assistantFact('下一件装扮', cosmeticHint.text, cosmeticHint.hint));
    facts.append(assistantFact(
      '最近解锁成就',
      info.latestAchievement ? `${info.latestAchievement.zh}（${info.latestAchievement.date}）` : '还没有解锁成就'
    ));
    facts.append(assistantFact(
      '成就 / 头像框',
      `${info.achievementCount} / ${info.achievementTotal} · ${info.unlockedFrameCount} / ${info.frameTotal}`
    ));
    children.push(facts);
    const more = node('button', '查看完整成就墙与收藏柜（个人中心）→', 'button-secondary');
    more.type = 'button';
    more.addEventListener('click', () => {
      closeAssistantPanel();
      openProfilePanel('achievements');
    });
    children.push(more);
    children.push(assistantNavRow());
    return children;
  }

  /* 「设置」视图（D4）：与个人中心「设置」Tab 共用 buildUiSettingsFields——
   * 同一套构建函数、同一份 progress.settings() 数据源（交接 B4）。 */
  function assistantSettingsView() {
    const children = [assistantViewHead('学习设置')];
    children.push(node('p', '与个人中心 → 设置是同一套设置：这里改动，两边同步。', 'meta'));
    buildUiSettingsFields().forEach(field => children.push(field));
    /* v4.2：恢复小奥默认位置（§6.1；个人中心设置里同款入口由字段函数给出） */
    const resetRow = node('div', undefined, 'dashboard-row');
    const resetButton = node('button', '恢复学习伙伴默认位置', 'button-secondary');
    resetButton.type = 'button';
    resetButton.addEventListener('click', () => {
      resetCompanionPosition();
      refreshAssistantPanel();
    });
    resetRow.append(resetButton);
    children.push(resetRow);
    /* v4.5（交接 D3/G）：伙伴装扮入口——与「形象」Tab 的装扮卡共用同一个
     * openWardrobePicker（一份实现、两处入口）。 */
    const wardrobeRow = node('div', undefined, 'dashboard-row');
    const wardrobeButton = node('button', '打开伙伴装扮（发型 / 服装 / 配饰 / 色板）', 'button-secondary');
    wardrobeButton.type = 'button';
    wardrobeButton.addEventListener('click', () => openWardrobePicker(wardrobeButton));
    wardrobeRow.append(wardrobeButton);
    children.push(wardrobeRow);
    /* v4.2：小奥可拖动的说明（含 file:// 下不保存的边界） */
    children.push(node('p', '学习伙伴按钮可以拖到屏幕任意位置（拖动后自动记住）；直接文件模式下可以拖，但位置不会保存。', 'meta'));
    /* v4.5（交接 A2）：关于本站与个人中心设置 Tab 同一构建函数（版本身份可见化） */
    children.push(buildAboutSection());
    children.push(assistantNavRow());
    return children;
  }

  function assistantBodyChildren() {
    const info = progress.assistantBrief({ catalogTotal: catalogTotal(), currentLessonId: activeLessonId });
    let view;
    if (assistantView === 'today') view = assistantTodayView(info);
    else if (assistantView === 'review') view = assistantReviewView();
    else if (assistantView === 'achievements') view = assistantAchievementsView(info);
    else if (assistantView === 'settings') view = assistantSettingsView();
    else return assistantHomeView(info);   /* home 视图自带舞台形象，不在这里加 */
    /* v4.5（交接 C2 always）：二级视图顶部也持续显示大人形，让“伙伴一直在”
     * 在每个视图都成立；auto / minimal 模式返回 null，二级视图不带大图。 */
    const companion = resolveCompanion(progress.cosmetics().companionId);
    const alwaysBust = assistantAlwaysBust(companion, companionMood(info));
    if (alwaysBust) view.unshift(alwaysBust);
    return view;
  }

  function buildAssistantPanel() {
    const dialog = node('dialog', undefined, 'assistant-dialog');
    dialog.setAttribute('aria-labelledby', 'assistant-panel-title');
    const head = node('div', undefined, 'dialog-head');
    /* v4.5（交接 C1）：面板标题 = 系统称谓 + 昵称。
     * v4.9：语序反转为「学习助手 · 昵称」并把系统称谓改为「学习助手」——用户
     * 要求主页 / 右下角不出名字，名字只在点开面板后以「学习助手 · 小诺」的形式
     * 出现。称谓口径见 specs.md「Companion」小节：面板标题用「学习助手」，
     * 其余 UI 文案（设置项、aria-label、边界声明）仍用「学习伙伴」，一处规则、
     * 不留两套互相矛盾的说明。 */
    const title = node('h2', `学习助手 · ${companionDisplayName()}`);
    title.id = 'assistant-panel-title';
    assistantTitleEl = title;
    const closeButton = node('button', '关闭', 'dialog-close');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', '关闭学习伙伴面板');
    closeButton.addEventListener('click', closeAssistantPanel);
    head.append(title, closeButton);
    assistantBody = node('div', undefined, 'assistant-body');
    assistantBody.append(...assistantBodyChildren());
    dialog.append(head, assistantBody);
    return dialog;
  }

  function isAssistantOpen() {
    if (!assistantDialog) return false;
    if (assistantDialog.open) return true;
    return typeof assistantDialog.hasAttribute === 'function' && assistantDialog.hasAttribute('open');
  }

  function refreshAssistantPanel() {
    if (!assistantDialog || !assistantBody) return;
    if (!isAssistantOpen()) return;
    /* v4.5（交接 C1）：昵称可在面板内改，标题跟着刷新（v4.9 语序：学习助手 · 昵称） */
    if (assistantTitleEl) assistantTitleEl.textContent = `学习助手 · ${companionDisplayName()}`;
    /* 保留滚动位置：面板每 15 秒跟着时长刷新一次，重建时把人弹回顶部很难受 */
    const top = assistantBody.scrollTop || 0;
    assistantBody.replaceChildren(...assistantBodyChildren());
    assistantBody.scrollTop = top;
  }

  function openAssistantPanel() {
    if (!progress) return;
    /* v4.4（交接 D2）：每次打开都从默认极简视图开始——二级视图不跨会话残留 */
    assistantView = 'home';
    const firstBuild = !assistantDialog;
    if (firstBuild) {
      assistantDialog = buildAssistantPanel();
      document.body.append(assistantDialog);
    }
    if (typeof assistantDialog.showModal === 'function') {
      if (!assistantDialog.open) assistantDialog.showModal();
    } else {
      assistantDialog.setAttribute('open', '');
    }
    if (!firstBuild) refreshAssistantPanel();
  }

  function closeAssistantPanel() {
    if (!assistantDialog) return;
    if (typeof assistantDialog.close === 'function') assistantDialog.close();
    else assistantDialog.open = false;
    if (assistantTrigger && typeof assistantTrigger.focus === 'function') assistantTrigger.focus();
  }

  function mountAssistant() {
    if (!progress) return null;
    /* v4.5（交接 C1）：按钮形象跟随装备的形象，名称是伙伴昵称（默认名按角色，第二轮） */
    const companion = resolveCompanion(progress.cosmetics().companionId);
    const portrait = companionPortraitImage(companion, { slot: 'corner' }, 'assistant-avatar', '');
    const name = companionDisplayName();
    assistantTrigger = node('button', undefined, 'assistant-trigger');
    assistantTrigger.type = 'button';
    if (portrait) assistantTrigger.append(portrait);
    /* v4.9：按钮只显示头像，不显示角色名（见 refreshAssistantTrigger 的说明）；
     * 昵称仍在 aria-label 里，读屏不退化。 */
    assistantTrigger.setAttribute('aria-haspopup', 'dialog');
    assistantTrigger.setAttribute('aria-label', `打开学习伙伴${name}：查看今天的学习情况与下一步建议`);
    /* v4.3（交接 A1）修复挂载顺序：必须**先 append 到 body，再测尺寸、再定位**。
     * v4.2 的顺序是先 applyCompanionPosition 后 append——getBoundingClientRect
     * 对未入 DOM 的元素返回 0×0，默认位置按 0×0 算出来是 (视口宽-12, 视口高-12)，
     * 按钮整体落在视口外，用户完全看不到小奥。现在先入 DOM 拿到真实尺寸，
     * 默认定位右下角、保存位置 clamp 后才应用。
     * 拖动的 click 抑制监听仍须先于打开面板的监听注册（stopImmediatePropagation
     * 才能拦住“拖完顺手触发点击打开面板”）。 */
    document.body.append(assistantTrigger);
    enableCompanionDrag(assistantTrigger);
    applyCompanionPosition();
    assistantTrigger.addEventListener('click', openAssistantPanel);
    return assistantTrigger;
  }

  /* ---------- v4.2：今日学习 / 本周学习卡片（交接 §8、§9） ----------
   * 数据全部来自 progress.dailyBrief / weeklyBrief（daily.js 的确定性推导），
   * UI 不自己算任何口径。徽记是推导值，不落存储。 */

  const DAILY_BADGE_LABELS = {
    goal: '今日目标达成',
    lesson: '今日完成一课',
    quiz: '今日完成自测',
    official: '今日完成官方任务',
    'half-hour': '今日学习满 30 分钟',
    hour: '今日学习满 1 小时'
  };

  function buildDailyCard() {
    const brief = progress.dailyBrief();
    if (!brief) return null;
    const card = node('section', undefined, 'section daily-card');
    card.append(node('h2', '今日学习'));
    const head = node('div', undefined, 'daily-head');
    const timeText = node('p', undefined, 'daily-time');
    timeText.append(
      node('strong', brief.todayText),
      node('span', brief.goalDone ? ` · 今日目标（${brief.goalMinutes} 分钟）已达成` : ` / 目标 ${brief.goalMinutes} 分钟`, 'meta')
    );
    head.append(timeText);
    /* 每日目标选择：五档，改完立即生效（§8.1） */
    const goalField = node('label', undefined, 'daily-goal-field');
    goalField.append(node('span', '每日目标', 'profile-field-label'));
    const goalSelect = document.createElement('select');
    goalSelect.className = 'profile-input';
    goalSelect.setAttribute('aria-label', '每日学习目标（分钟）');
    progress.dailyGoalChoices().forEach(choice => {
      const option = node('option', `${choice} 分钟`);
      option.value = String(choice);
      if (choice === brief.goalMinutes) option.selected = true;
      goalSelect.append(option);
    });
    goalSelect.disabled = !progress.isPersistent();
    goalSelect.addEventListener('change', () => {
      const result = progress.setDailyGoal(Number(goalSelect.value));
      if (!result.ok) goalSelect.value = String(brief.goalMinutes);
      refreshAll();
    });
    goalField.append(goalSelect);
    head.append(goalField);
    card.append(head);

    /* v4.3 Batch 10（Stretch N4）：个人纪录刷新提示——纯推导无闩锁：
     * 今天秒数超过“今天之前的单日最高”才显示，第二天自然消失；
     * 是陈述事实的轻提示，不弹窗、不打断。 */
    if (stats) {
      const todayKey = progress.todayKey();
      const todaySeconds = Number((progress.getState().daily || {})[todayKey]) || 0;
      const prevBest = stats.bestDayBefore(progress.getState(), todayKey);
      if (prevBest && todaySeconds > prevBest.seconds) {
        card.append(node('p', `新的单日学习纪录：${progress.formatSeconds(todaySeconds)}，超过此前最高的 ${progress.formatSeconds(prevBest.seconds)}（${prevBest.dayKey}）。`, 'record-note'));
      }
    }

    /* 进度条：纯 CSS，宽度按百分比（目标未达成时的真实进度） */
    const bar = node('div', undefined, 'daily-progress');
    const fill = node('div', undefined, 'daily-progress-fill');
    fill.style.width = `${brief.goalProgress}%`;
    if (brief.goalDone) fill.classList.add('is-done');
    bar.append(fill);
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-valuenow', String(brief.goalProgress));
    bar.setAttribute('aria-label', `今日学习进度：${brief.goalProgress}%（目标 ${brief.goalMinutes} 分钟）`);
    card.append(bar);

    const grid = node('div', undefined, 'stat-grid daily-stats');
    grid.append(statCell('今日完成课程', `${brief.lessonsToday} 课`, '今天标记为本课已完成'));
    grid.append(statCell('今日完成自测', `${brief.quizToday} 课`, '今天标记为本站自测已完成'));
    grid.append(statCell('今日官方任务', `${brief.officialToday} 课`, '今天标记为官方任务已完成'));
    grid.append(statCell('连续学习还差', brief.streakGapSeconds > 0 ? progress.formatSeconds(brief.streakGapSeconds) : '已达标', '每天至少 10 分钟才计入连续'));
    card.append(grid);

    /* 每日徽记（§8.2）：确定性规则推导，当天即时生成，历史里可回看 */
    const badgeLine = node('p', undefined, 'daily-badges');
    badgeLine.append(node('span', '今日徽记：', 'meta'));
    if (brief.badges.length) {
      brief.badges.forEach(badge => {
        const chip = node('span', DAILY_BADGE_LABELS[badge] || badge, 'daily-badge');
        chip.setAttribute('title', '按你今天的学习数据自动记录，只反映今天，不累积成永久成就');
        badgeLine.append(chip);
      });
    } else {
      badgeLine.append(node('span', '今天还没有徽记。学满目标、完成一课或一次自测都会记录。', 'meta'));
    }
    card.append(badgeLine);
    return card;
  }

  function buildWeeklyCard() {
    const brief = progress.weeklyBrief();
    if (!brief) return null;
    const card = node('section', undefined, 'section weekly-card');
    card.append(node('h2', '本周学习'));
    /* 柱状图：纯 CSS 的七列小柱（§9：不引入 Chart.js 或图表框架） */
    const chart = node('div', undefined, 'week-chart');
    chart.setAttribute('role', 'img');
    chart.setAttribute('aria-label', `本周每日学习分钟柱状图：${brief.weekDays.map((day, index) => `周${brief.weekDayLabels[index]} ${brief.thisWeekMinutes[index]} 分钟`).join('，')}`);
    const maxMinutes = Math.max(1, ...brief.thisWeekMinutes);
    brief.thisWeekMinutes.forEach((minutes, index) => {
      const column = node('div', undefined, 'week-column');
      const bar = node('div', undefined, 'week-bar');
      bar.style.height = `${Math.round((minutes / maxMinutes) * 100)}%`;
      if (index === brief.todayIndexInWeek) column.classList.add('is-today');
      if (minutes === 0) column.classList.add('is-empty');
      column.append(bar);
      column.append(node('span', `周${brief.weekDayLabels[index]}`, 'week-label'));
      column.append(node('span', minutes ? `${minutes} 分` : '—', 'week-value'));
      chart.append(column);
    });
    card.append(chart);
    const grid = node('div', undefined, 'stat-grid');
    grid.append(statCell('本周累计', progress.formatSeconds(brief.thisWeekTotal * 60), '周一至今天'));
    grid.append(statCell('上周同期', progress.formatSeconds(brief.lastWeekTotal * 60), '上周一至周日全天'));
    grid.append(statCell('与上周比较', brief.changePct === null ? '上周为 0' : `${brief.changePct > 0 ? '+' : ''}${brief.changePct}%`, brief.changePct === null ? '无法计算百分比' : '本周累计 / 上周累计 - 1'));
    grid.append(statCell('本周完成课程', `${brief.lessonsThisWeek} 课`, '本周标记为本课已完成'));
    grid.append(statCell('本周完成自测', `${brief.quizThisWeek} 课`, '本周标记为本站自测已完成'));
    card.append(grid);
    return card;
  }

  /* ---------- v4.3：每日 / 每周挑战卡（交接 D2） ----------
   * 数据全部来自 progress.challengesBrief（challenges.js 的确定性推导）：
   * 挑战按日期哈希从池子里选出（同一天永远同一张卡），完成判定从既有
   * 学习状态推导，结算闩锁在 coinFlags（每周期最多一次），UI 不自己算。 */

  function challengeValueText(value, unit) {
    if (unit === 'seconds') return progress.formatSeconds(value);
    if (unit === 'days') return `${value} 天`;
    if (unit === 'lessons') return `${value} 课`;
    return `${value}`;
  }

  function buildChallengeCard() {
    const brief = progress.challengesBrief ? progress.challengesBrief() : null;
    if (!brief || (!brief.daily && !brief.weekly && !brief.monthly)) return null;
    const card = node('section', undefined, 'section challenge-card');
    card.append(node('h2', '挑战卡'));
    card.append(node('p', '按周期刷新的小挑战：每日挑战按自然日刷新，每周挑战按 ISO 周（周一起）刷新，每月挑战按自然月刷新。完成给少量叶片，不发 XP；每张卡每个周期最多结算一次；没完成只是过期，不惩罚、不扣资源、不掉级。挑战卡由日期按固定规则选出——不是随机，也不是 AI。', 'muted'));
    const list = node('ul', undefined, 'challenge-list');
    [brief.daily, brief.weekly, brief.monthly].forEach(item => {
      if (!item) return;
      const entry = node('li', undefined, `challenge-item${item.settled ? ' is-settled' : ''}`);
      const head = node('div', undefined, 'challenge-head');
      head.append(node('span', item.scope === 'daily' ? '每日' : item.scope === 'weekly' ? '每周' : '每月', 'challenge-scope'));
      head.append(node('span', item.zh, 'challenge-name'));
      entry.append(head);
      entry.append(node('p', `${item.desc} · 奖励 ${item.reward} 叶片`, 'challenge-desc'));
      const pct = item.target > 0 ? Math.min(100, Math.round((Math.min(item.rawCurrent, item.target) / item.target) * 100)) : 0;
      const bar = node('div', undefined, 'daily-progress');
      const fill = node('div', undefined, 'daily-progress-fill');
      fill.style.width = `${pct}%`;
      if (item.done) fill.classList.add('is-done');
      bar.append(fill);
      bar.setAttribute('role', 'progressbar');
      bar.setAttribute('aria-valuemin', '0');
      bar.setAttribute('aria-valuemax', '100');
      bar.setAttribute('aria-valuenow', String(pct));
      bar.setAttribute('aria-label', `${item.zh}进度：${pct}%`);
      entry.append(bar);
      const stateText = item.settled
        ? `已结算：+${item.reward} 叶片已到账`
        : item.done
          ? '已完成，稍后自动结算叶片'
          : `进度 ${challengeValueText(Math.min(item.rawCurrent, item.target), item.unit)} / ${challengeValueText(item.target, item.unit)}`;
      entry.append(node('p', stateText, 'challenge-state'));
      list.append(entry);
    });
    card.append(list);
    return card;
  }

  /* ---------- v4.3：循环成就铜 / 银 / 金（交接 D1） ----------
   * 与一次性成就分开展示：这是同一成就族的阶段进度（当前阶级、下一阶
   * 条件、当前进度），不是三个无关成就。数据来自 progress.tiersBrief
   * （tiers.js 的确定性推导），徽章 SVG 在 icons.js 的 tierBadges。 */

  const TIER_BADGE_KEYS = ['bronze', 'silver', 'gold'];
  const TIER_CSS = ['is-bronze', 'is-silver', 'is-gold'];
  const TIER_ZH = ['铜', '银', '金'];

  function buildTierSection() {
    const briefs = progress.tiersBrief ? progress.tiersBrief() : [];
    if (!briefs.length) return null;
    const block = node('section', undefined, 'profile-section');
    block.append(node('h3', '循环成就（铜 / 银 / 金）'));
    block.append(node('p', '循环成就按学习行为持续累计，沿 铜 → 银 → 金 三阶晋升，是同一成就族的进度而不是三个无关成就。晋升只升不降：撤销勾选不会掉阶，也无法靠撤销重做反复刷奖励。每阶晋升给少量叶片（铜 10 / 银 25 / 金 50），不发 XP。', 'muted'));
    const list = node('ul', undefined, 'tier-list');
    briefs.forEach(item => {
      const entry = node('li', undefined, `tier-card${item.tier >= 1 ? ' ' + TIER_CSS[item.tier - 1] : ''}`);
      const head = node('div', undefined, 'tier-head');
      /* v4.11.13：金属阶级徽章是固定色族（颜色即语义），继续走 <img>；
       * 族图标是 mask 源族，走 maskIcon 接主题 token。两条路径的类名保持原样
       * （tier-badge-img / is-none），CSS 与既有断言不受影响。 */
      if (item.tier >= 1) {
        const badgeMarkup = icons && icons.tierBadges ? icons.tierBadges[TIER_BADGE_KEYS[item.tier - 1]] : null;
        if (badgeMarkup) head.append(svgImage(badgeMarkup, '', 'tier-badge-img'));
      } else {
        const familyMarkup = icons && icons.tierFamilies ? icons.tierFamilies[item.id] : null;
        if (familyMarkup) head.append(maskIcon(familyMarkup, 'tier-badge-img is-none'));
      }
      head.append(node('span', item.zh, 'tier-name'));
      head.append(node('span', item.maxed ? '金阶 · 已满阶' : item.tierZh ? `${item.tierZh}阶` : '未晋升', 'tier-current'));
      const steps = node('span', undefined, 'tier-steps');
      steps.setAttribute('aria-hidden', 'true');
      TIER_ZH.forEach((label, index) => {
        const dot = node('span', undefined, `tier-step${item.tier >= index + 1 ? ` is-reached-${TIER_BADGE_KEYS[index]}` : ''}`);
        dot.title = `${label}阶：${item.thresholds[index]} ${item.unit === 'days' ? '天' : item.unit === 'lessons' ? '课' : ''}`;
        steps.append(dot);
      });
      head.append(steps);
      entry.append(head);
      entry.append(node('p', item.desc, 'tier-desc'));
      const bar = node('div', undefined, 'tier-progress');
      const fill = node('div', undefined, 'tier-progress-fill');
      fill.style.width = `${item.progressPct}%`;
      bar.append(fill);
      bar.setAttribute('role', 'progressbar');
      bar.setAttribute('aria-valuemin', '0');
      bar.setAttribute('aria-valuemax', '100');
      bar.setAttribute('aria-valuenow', String(item.progressPct));
      bar.setAttribute('aria-label', `${item.zh}晋升进度：${item.progressPct}%`);
      entry.append(bar);
      const unitZh = item.unit === 'days' ? '天' : item.unit === 'lessons' ? '课' : '';
      const nextText = item.maxed
        ? `已达金阶（累计 ${item.current} ${unitZh}）。这一族不会再晋升，但学习记录会继续累计。`
        : `当前 ${item.current} / ${item.nextThreshold} ${unitZh}，距${item.nextTierZh}阶还差 ${Math.max(0, item.nextThreshold - item.current)} ${unitZh}。`;
      entry.append(node('p', nextText, 'tier-next'));
      list.append(entry);
    });
    block.append(list);
    return block;
  }

  /* ---------- v4.3 Batch 10（Stretch N14）：全局「当前章节」卡 ----------
   * 首页一眼看清：我正在哪个单元、这个单元推进了几课、Boss 状态如何、
   * 下一课是谁。数据全部来自 mapBrief（与地图同一推导），无新存储。 */
  function buildCurrentUnitCard() {
    if (!mapModule || !progress) return null;
    const summary = progress.summary();
    const continueId = summary.continueLessonId;
    if (!continueId) return null;
    const brief = mapModule.mapBrief(progress.getState(), effectiveCatalog(), data.lessons, continueId);
    const unit = brief.units.find(item => item.nodes.some(n => n.slug === continueId && n.status !== 'locked'));
    if (!unit || !unit.openCount) return null;
    const doneCount = unit.nodes.filter(n => n.status === 'broken' || n.status === 'defeated' || n.status === 'mastered').length;
    const card = node('section', undefined, 'section current-unit-card');
    card.append(node('h2', '当前章节'));
    const title = node('p', undefined, 'daily-time');
    title.append(
      node('strong', unit.group.zh),
      node('span', ` · ${unit.group.en}`, 'meta english')
    );
    card.append(title);
    const pct = Math.round((doneCount / unit.openCount) * 100);
    const bar = node('div', undefined, 'daily-progress');
    const fill = node('div', undefined, 'daily-progress-fill');
    fill.style.width = `${pct}%`;
    if (pct >= 100) fill.classList.add('is-done');
    bar.append(fill);
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-valuenow', String(pct));
    bar.setAttribute('aria-label', `${unit.group.zh}章节完成进度：${doneCount} / ${unit.openCount} 课`);
    card.append(bar);
    const bossText = unit.boss
      ? (unit.boss.attempted && unit.boss.ratingZh ? ` · Boss 最佳评级「${unit.boss.ratingZh}」` : ' · Boss 还没挑战')
      : '';
    const lesson = findLesson(continueId);
    card.append(node('p', `已完成 ${doneCount} / ${unit.openCount} 课${bossText}${doneCount === unit.openCount ? ' · 本章课程已全部完成，去挑战 Boss 或进入下一单元' : ''}`, 'muted'));
    if (lesson) {
      const row = node('div', undefined, 'dashboard-row');
      row.append(link(`继续学习：${lesson.zh} →`, lessonHref(lesson), 'button'));
      card.append(row);
    }
    return card;
  }

  /* ---------- v4.3：今日复习卡（交接 G） ----------
   * 首页显示“今天有 N 课建议复习”，每课直接给「完成复习 / 仍不熟」动作；
   * 没有到期课时显示下一次复习日期；从未安排复习时不打扰（不渲染卡片）。
   * 逾期不惩罚：过期的课只是排在前面，没有任何扣减文案。 */
  let reviewCardMount = null;

  function buildReviewCard() {
    if (!progress || !progress.reviewDueList) return null;
    const dueList = progress.reviewDueList();
    const scheduled = Object.keys(progress.getState().reviews || {});
    if (!dueList.length && !scheduled.length) return null;
    const card = node('section', undefined, 'section review-card');
    card.append(node('h2', '复习安排'));
    if (dueList.length) {
      card.append(node('p', `今天有 ${dueList.length} 课建议复习。复习按 1 / 3 / 7 / 30 天的固定阶梯推进：完成一次复习就走到下一个间隔；觉得仍不熟就回到最短间隔。逾期不扣分、不掉进度，什么时候想起来都可以补。`, 'muted'));
      const list = node('ul', undefined, 'review-due-list');
      dueList.forEach(item => {
        const lesson = findLesson(item.lessonId);
        const row = node('li', undefined, 'review-due-item');
        const text = node('div', undefined, 'review-due-text');
        text.append(node('span', lesson ? lesson.zh : item.lessonId, 'review-due-name'));
        text.append(node('span', item.overdueDays > 0 ? `建议复习日 ${item.dueDay}（已过 ${item.overdueDays} 天，随时可以补）` : `今天到期（第 ${item.intervalIndex + 1} 轮，已完成 ${item.doneCount} 次复习）`, 'meta'));
        row.append(text);
        const actions = node('div', undefined, 'review-due-actions');
        const doneButton = node('button', '完成复习', 'button-secondary');
        doneButton.type = 'button';
        doneButton.disabled = !progress.isPersistent();
        doneButton.addEventListener('click', () => {
          progress.completeReview(item.lessonId);
          refreshAll();
        });
        const weakButton = node('button', '仍不熟', 'button-secondary');
        weakButton.type = 'button';
        weakButton.disabled = !progress.isPersistent();
        weakButton.addEventListener('click', () => {
          progress.markStillWeak(item.lessonId);
          refreshAll();
        });
        actions.append(doneButton, weakButton);
        row.append(actions);
        list.append(row);
      });
      card.append(list);
    } else {
      const next = progress.nextReviewDue();
      if (next) {
        const lesson = findLesson(next.lessonId);
        card.append(node('p', `今天没有到期的复习。下一次建议复习：${next.dueDay} ·「${lesson ? lesson.zh : next.lessonId}」。`, 'muted'));
      } else {
        card.append(node('p', '今天没有到期的复习。在任意一课勾选「需要复习」就会开始 1 / 3 / 7 / 30 天的复习阶梯。', 'muted'));
      }
    }
    /* v4.3 Batch 9（交接 M20 复习日历）：未来 14 条复习安排一览——
     * 轻量列表式“日历”，让接下来的节奏可预期；逾期课不在此列（上面已给）。 */
    const upcoming = progress.reviewUpcomingList ? progress.reviewUpcomingList(14) : [];
    if (upcoming.length) {
      card.append(node('h3', '接下来的复习安排'));
      const upcomingList = node('ul', undefined, 'review-upcoming-list');
      upcoming.forEach(item => {
        const lesson = findLesson(item.lessonId);
        upcomingList.append(node('li', `${item.dueDay} · ${lesson ? lesson.zh : item.lessonId}（第 ${item.intervalIndex + 1} 轮）`));
      });
      card.append(upcomingList);
      card.append(node('p', '安排会随每次「完成复习」自动后移；到期不提醒也不惩罚，打开页面看这里就好。', 'meta'));
    }
    return card;
  }

  /* ---------- v4.2 → v4.4：装扮选择弹窗（picker 工厂） ----------
   * 与其它面板同一约束：dialog 挂在 body 上、showModal 焦点困在面板内、
   * Esc 可关闭（原生路径），不用 details/summary。网格与收藏柜共用同一套
   * 渲染函数，装备 / 叶片解锁逻辑零重复。
   * v4.4 把头像 / 头像框 / 形象 / 主题四个 picker 抽成同一工厂，并修两个旧缺陷：
   *   1. 头像 picker 二次打开不重建 body，会显示过期的解锁状态与叶片余额；
   *   2. 关闭时焦点固定回 playerEntry——从 header 主题快捷按钮或小奥面板打开时
   *      焦点不归位（audit U4：Shoelace 的 originalTrigger 模式）。 */
  const pickerRegistry = {};
  let pickerTrigger = null;

  function rememberPickerTrigger() {
    const active = document.activeElement;
    pickerTrigger = active && active !== document.body && typeof active.focus === 'function' ? active : null;
  }

  function buildPickerDialog(titleText, bodyBuilder, closePicker, labelledBy) {
    const dialog = node('dialog', undefined, 'picker-dialog');
    dialog.setAttribute('aria-labelledby', labelledBy);
    const head = node('div', undefined, 'dialog-head');
    const title = node('h2', titleText);
    title.id = labelledBy;
    const closeButton = node('button', '关闭', 'dialog-close');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', `关闭${titleText}`);
    closeButton.addEventListener('click', closePicker);
    head.append(title, closeButton);
    const body = node('div', undefined, 'picker-body');
    body.append(...bodyBuilder());
    dialog.append(head, body);
    return dialog;
  }

  function closeDialogHelper(dialog, fallbackFocus) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.open = false;
    if (fallbackFocus && typeof fallbackFocus.focus === 'function') fallbackFocus.focus();
  }

  function definePicker(id, titleText, labelledBy, bodyBuilder, onClose) {
    pickerRegistry[id] = { titleText, labelledBy, bodyBuilder, dialog: null, onClose: onClose || null };
  }

  function openPicker(id, triggerElement) {
    if (!progress) return;
    const entry = pickerRegistry[id];
    if (!entry) return;
    /* 显式 trigger 优先（调用方知道自己是谁）；否则按 activeElement 记录。 */
    if (triggerElement) pickerTrigger = triggerElement;
    else rememberPickerTrigger();
    const closeFn = () => closePickerById(id);
    if (!entry.dialog) {
      entry.dialog = buildPickerDialog(entry.titleText, entry.bodyBuilder, closeFn, entry.labelledBy);
      /* 原生 Esc 路径不经过 closePickerById——close 事件兜底：onClose 钩子
       * （主题预览恢复等清理）+ 焦点归还，与 sheet 同一保险（audit U4）。
       * onClose 必须幂等：closePickerById 与 close 事件可能各触发一次。 */
      entry.dialog.addEventListener('close', () => {
        if (typeof entry.onClose === 'function') entry.onClose();
        const target = pickerTrigger || playerEntry;
        if (target && typeof target.focus === 'function' && target.isConnected !== false) target.focus();
      });
      document.body.append(entry.dialog);
    } else {
      entry.dialog.querySelector('.picker-body').replaceChildren(...entry.bodyBuilder());
    }
    if (typeof entry.dialog.showModal === 'function') {
      if (!entry.dialog.open) entry.dialog.showModal();
    } else {
      entry.dialog.setAttribute('open', '');
    }
  }

  function closePickerById(id) {
    const entry = pickerRegistry[id];
    if (!entry) return;
    if (typeof entry.onClose === 'function') entry.onClose();
    closeDialogHelper(entry.dialog, pickerTrigger || playerEntry);
  }

  /* 旧函数名薄封装（收藏柜 / 身份卡快捷入口 / 设置界面都有引用，签名不变） */
  function openAvatarPicker() { openPicker('avatar'); }
  function closeAvatarPicker() { closePickerById('avatar'); }
  function openFramePicker() { openPicker('frame'); }
  function closeFramePicker() { closePickerById('frame'); }
  function openCompanionPicker(trigger) { openPicker('companion', trigger); }
  function closeCompanionPicker() { closePickerById('companion'); }
  function openThemePicker(trigger) {
    /* 每次打开从已存主题开始（上一次的预览不跨会话残留）；筛选状态保留，
     * 用户回到 picker 还停在自己常用的分类里。 */
    previewThemeId = null;
    openPicker('theme', trigger);
  }
  function closeThemePicker() { closePickerById('theme'); }

  /* ---------- v4.4（交接 C2）：Theme Picker 2.0 ----------
   * 30 套主题的完整选择器：搜索框 + 分类 chips（五类 + 全部/浅色/深色）、
   * mini 页面色卡预览、Light/Dark 标签、已拥有/解锁条件、点卡即时预览、
   * 「使用这个主题」才持久化。预览只在内存（previewThemeId），关闭 picker
   * 的任何路径（关闭按钮 / Esc / 确认后关闭）都经 onClose 钩子恢复已存主题——
   * “hover 不存储、预览不外漏”。 */

  function themeMatchesFilter(theme) {
    const cat = themeFilter.category;
    if (cat === 'light' && theme.dark) return false;
    if (cat === 'dark' && !theme.dark) return false;
    if (cat !== 'all' && cat !== 'light' && cat !== 'dark' && theme.category !== cat) return false;
    if (themeFilter.query) {
      const q = themeFilter.query.toLowerCase();
      if (!theme.zh.toLowerCase().includes(q) && !theme.id.includes(q) && !theme.desc.toLowerCase().includes(q)) return false;
    }
    return true;
  }

  /* v4.11 批次 F（B2）：主题选择器的**展示顺序**。
   * themes.js 的 recommendedThemeIds 是这份顺序的唯一事实源（当前为
   * 夜空 / 石墨 / 冰川）；白名单内的主题排到最前、组内按白名单顺序，其余主题
   * 保持清单里的原始相对顺序（Array#sort 在现代 JS 里是稳定排序，靠的就是这条）。
   * 只重排**展示副本**：themes.themes 与其中每个主题对象一字不动，因此分类筛选、
   * 搜索、计数、解锁判定、预览/保存全部照旧；「最近使用」是独立的时间序行，
   * 不经过这里，不会被静态推荐顺序顶掉。
   * 白名单里的未知 id 静默忽略（清单改名不会让 picker 抛错）；白名单缺失/为空时
   * 原样返回，退回 v4.4 的清单顺序。 */
  function orderThemesForDisplay(list) {
    const recommended = themes && Array.isArray(themes.recommendedThemeIds) ? themes.recommendedThemeIds : [];
    if (!recommended.length) return list;
    const rank = id => {
      const index = recommended.indexOf(id);
      return index < 0 ? recommended.length : index;
    };
    return list.slice().sort((a, b) => rank(a.id) - rank(b.id));
  }

  function themeCategoryZh(theme) {
    const cat = themes.categories.find(item => item.id === theme.category);
    return cat ? cat.zh.replace('系', '') : '';
  }

  /* mini 页面模拟：底色 + accent 标题条 + 两条 ink 文字线（比三色圆片更直观） */
  function buildThemeMiniPreview(theme) {
    const mini = node('span', undefined, 'theme-mini');
    mini.setAttribute('aria-hidden', 'true');
    mini.style.background = theme.swatch.bg;
    const bar = node('span', undefined, 'theme-mini-bar');
    bar.style.background = theme.swatch.accent;
    const line1 = node('span', undefined, 'theme-mini-line');
    line1.style.background = theme.swatch.ink;
    const line2 = node('span', undefined, 'theme-mini-line is-short');
    line2.style.background = theme.swatch.ink;
    mini.append(bar, line1, line2);
    return mini;
  }

  function themePickerBody() {
    /* v4.11 批次 F（B2）：items 是展示序副本——「全部 / 分类 / 浅色深色 / 搜索」
     * 四个视图都从它过滤，所以推荐顺序在各视图内自然生效；主题数量与分类计数
     * 不受重排影响（计数只看集合，不看顺序）。 */
    const items = orderThemesForDisplay(typedAssets('theme', themes && Array.isArray(themes.themes) ? themes.themes : []));
    const children = [];
    children.push(node('p', `${items.length} 套主题按五大类组织：点主题卡即时预览（整页换色但不保存），点「使用这个主题」才真正保存；关闭窗口会自动恢复原主题。主题只改颜色，不改布局与字号；每套配色的六组对比度都经过程序化检查（正文 / 次要文字 / 链接 / 代码块 / 按钮 / 警示全部达标）。`, 'meta'));

    /* 四个动态区：最近使用 / chips / 卡片网格 / 底部状态行——refresh() 一次全刷 */
    const recentMount = node('div', undefined, 'theme-recent');
    const chipMount = node('div', undefined, 'theme-chips');
    const gridMount = node('ul', undefined, 'theme-grid');
    const statusMount = node('div', undefined, 'theme-status');

    const searchRow = node('div', undefined, 'theme-search-row');
    const search = document.createElement('input');
    search.type = 'search';
    search.className = 'profile-input theme-search';
    search.placeholder = '搜索主题名或说明…';
    search.setAttribute('aria-label', '按名称或说明搜索主题');
    search.value = themeFilter.query;
    search.addEventListener('input', () => {
      themeFilter.query = String(search.value || '').trim();
      refresh();
    });
    searchRow.append(search);
    const countLine = node('span', undefined, 'theme-count meta');
    searchRow.append(countLine);
    children.push(searchRow, recentMount, chipMount, gridMount, statusMount);

    /* Stretch I1：最近使用（本次会话内换过的主题，最多 3 个）——点了即预览，
     * 仍是「使用这个主题」才保存；没有记录时整行不渲染 */
    function buildRecent() {
      const usable = recentThemeIds
        .map(id => items.find(theme => theme.id === id))
        .filter(theme => theme && isCosmeticUnlocked(theme));
      if (!usable.length) return [];
      const row = [node('span', '最近使用', 'theme-recent-label meta')];
      usable.forEach(theme => {
        const chip = node('button', theme.zh, `theme-chip theme-recent-chip${previewThemeId === theme.id ? ' is-active' : ''}`);
        chip.type = 'button';
        chip.setAttribute('aria-label', `预览最近使用的「${theme.zh}」主题`);
        chip.addEventListener('click', () => {
          previewThemeId = theme.id;
          applyTheme();
          refreshThemeButton();
          refresh();
        });
        row.push(chip);
      });
      return row;
    }

    function buildChips() {
      const defs = [['all', `全部 ${items.length}`]];
      (themes.categories || []).forEach(cat => {
        defs.push([cat.id, `${cat.zh} ${items.filter(t => t.category === cat.id).length}`]);
      });
      defs.push(['light', `浅色 ${items.filter(t => !t.dark).length}`]);
      defs.push(['dark', `深色 ${items.filter(t => t.dark).length}`]);
      return defs.map(pair => {
        const active = themeFilter.category === pair[0];
        const chip = node('button', pair[1], `theme-chip${active ? ' is-active' : ''}`);
        chip.type = 'button';
        chip.setAttribute('aria-pressed', String(active));
        chip.addEventListener('click', () => {
          themeFilter.category = pair[0];
          refresh();
        });
        return chip;
      });
    }

    function buildCards() {
      const visible = items.filter(themeMatchesFilter);
      countLine.textContent = `显示 ${visible.length} / ${items.length} 套`;
      if (!visible.length) {
        const empty = node('li', undefined, 'theme-empty');
        empty.append(node('p', '没有匹配的主题。换个关键词，或点「全部」清除筛选。', 'muted empty-state'));
        return [empty];
      }
      return visible.map(theme => {
        const unlocked = isCosmeticUnlocked(theme);
        const active = progress.cosmetics().themeId === theme.id;
        const previewing = previewThemeId === theme.id;
        const item = node('li', undefined, `theme-card${active ? ' is-active' : ''}${previewing ? ' is-previewing' : ''}${unlocked ? '' : ' is-locked'}`);

        const previewButton = node('button', undefined, 'theme-card-preview');
        previewButton.type = 'button';
        previewButton.append(buildThemeMiniPreview(theme));
        const nameRow = node('span', undefined, 'theme-card-name');
        nameRow.append(node('span', theme.zh));
        if (active) nameRow.append(node('span', '使用中', 'theme-card-flag'));
        else if (previewing) nameRow.append(node('span', '预览中', 'theme-card-flag is-preview'));
        previewButton.append(nameRow);
        previewButton.append(node('span', `${themeCategoryZh(theme)} · ${theme.dark ? 'Dark 深色' : 'Light 浅色'}`, 'theme-card-tags meta'));
        if (unlocked) {
          previewButton.setAttribute('aria-label', `即时预览「${theme.zh}」主题（${theme.dark ? '深色' : '浅色'}，${themeCategoryZh(theme)}）${active ? '，当前使用中' : ''}`);
          previewButton.addEventListener('click', () => {
            /* 点使用中的卡 = 取消预览回到已存主题；预览是纯内存操作 */
            previewThemeId = active ? null : theme.id;
            applyTheme();
            refreshThemeButton();
            refresh();
          });
        } else {
          previewButton.disabled = true;
          previewButton.setAttribute('aria-label', `「${theme.zh}」主题未解锁：${cosmeticUnlockText(theme)}`);
        }
        item.append(previewButton);

        const actions = node('div', undefined, 'theme-card-actions');
        if (active) {
          actions.append(node('p', '当前已存主题', 'frame-state'));
        } else if (unlocked) {
          const use = node('button', previewing ? '使用预览中的主题' : '使用这个主题', 'button-secondary');
          use.type = 'button';
          use.disabled = !progress.isPersistent();
          use.addEventListener('click', () => {
            const result = progress.setTheme(theme.id);
            if (!result.ok) {
              profileNotice = result.error;
              refresh();
              return;
            }
            previewThemeId = null;
            rememberRecentTheme(theme.id);
            profileNotice = `已切换为「${theme.zh}」主题并保存。`;
            refreshAll();
            closeThemePicker();
          });
          actions.append(use);
        } else if (collections && collections.assetPrice(theme)) {
          const buy = buildBuyButton(theme, refresh);
          buy.disabled = !progress.isPersistent();
          actions.append(buy);
        } else {
          actions.append(node('p', cosmeticUnlockText(theme), 'frame-state'));
        }
        item.append(actions);
        return item;
      });
    }

    function buildStatus() {
      const saved = resolveTheme(progress.cosmetics().themeId);
      const savedName = saved ? saved.zh : '—';
      const nodes = [];
      if (previewThemeId) {
        const preview = resolveTheme(previewThemeId);
        nodes.push(node('p', `正在预览「${preview ? preview.zh : previewThemeId}」（未保存）· 已存主题仍是「${savedName}」`, 'theme-status-text'));
        const restore = node('button', `恢复「${savedName}」`, 'button-secondary');
        restore.type = 'button';
        restore.addEventListener('click', () => {
          previewThemeId = null;
          applyTheme();
          refreshThemeButton();
          refresh();
        });
        nodes.push(restore);
      } else {
        nodes.push(node('p', `当前主题「${savedName}」· 点主题卡即时预览，点「使用」才保存`, 'theme-status-text meta'));
      }
      return nodes;
    }

    function refresh() {
      recentMount.replaceChildren(...buildRecent());
      chipMount.replaceChildren(...buildChips());
      gridMount.replaceChildren(...buildCards());
      statusMount.replaceChildren(...buildStatus());
    }
    refresh();
    return children;
  }

  /* 上传入口放在弹窗最顶部（§5.2），下面是完整头像网格 */
  function avatarPickerBody() {
    return [
      buildAvatarUploadRow(closeAvatarPicker),
      node('p', '选择一个默认头像立即生效；未解锁的显示条件，收藏款可直接用叶片解锁。上传的图片只存在这台设备上。', 'meta'),
      buildAvatarOptionsGrid(closeAvatarPicker)
    ];
  }

  function framePickerBody() {
    return [buildFrameOptionsList(closeFramePicker)];
  }

  /* ---------- v4.3 Batch 7（交接 K）：小奥形象 / 主题 picker ----------
   * 与头像/头像框弹窗同一套约束；v4.4 起同走 picker 工厂。 */
  function companionPickerBody() {
    return [
      node('p', '形象只改外观、名称与一句固定语气，不改变学习建议的算法；成长阶段由学习数据独立推导，换形象不影响阶段。', 'meta'),
      companionFilterControls(),
      buildCompanionOptionsList(closeCompanionPicker)
    ];
  }

  function refreshCompanionPickerBody() {
    const entry = pickerRegistry.companion;
    if (entry && entry.dialog) {
      const body = entry.dialog.querySelector('.picker-body');
      if (body) body.replaceChildren(...companionPickerBody());
    }
  }

  /* ---------- v4.5（交接 D2/D3/G）：人形装扮 picker ----------
   * 四个槽（发型 / 服装 / 配饰 / 色板）各自列可选项；每项给实时预览（把该部件
   * 套到当前 look 上生成小图）、名称与状态（当前 / 选用 / 叶片解锁 / 解锁条件）。
   * 顶部一个大人形实时预览，改一件立刻重拼——档案只存部件 id（交接 D1）。
   * 体型（少年/少女）不在这里换，由「学习伙伴形象」picker 装备 odin-boy/odin-girl。
   * 与「形象」Tab、伙伴面板共用同一个 picker（交接 G：多入口、一份实现）。 */
  function wardrobePartAsset(slotId, opt) {
    return { id: opt.id, zh: opt.zh, unlock: opt.unlock || { kind: 'default' }, type: `w-${slotId}` };
  }

  function wardrobeSummaryText() {
    if (!wardrobe || !progress) return '发型 · 服装 · 配饰 · 色板';
    const companion = resolveCompanion(progress.cosmetics().companionId);
    const capabilities = companion && companionView && typeof companionView.capabilities === 'function'
      ? companionView.capabilities(companion.id) : null;
    if (capabilities && capabilities.skins && capabilities.skins.length) {
      const labels = { default: '默认', study: '学习装' };
      const skin = currentCompanionSkin(companion);
      return `预制皮肤 · ${labels[skin] || skin}`;
    }
    if (!companion || !(capabilities ? capabilities.wardrobe : companion.procedural && companion.procedural.body)) return '当前形象没有可换装内容';
    const look = currentCompanionLook(companion);
    const nameOf = (list, id) => (wardrobe.findPart(list, id) || {}).zh || id;
    return `${nameOf(wardrobe.HAIRS, look.hair)} · ${nameOf(wardrobe.OUTFITS, look.outfit)}`;
  }

  function refreshWardrobePickerBody() {
    const entry = pickerRegistry.wardrobe;
    if (entry && entry.dialog) {
      const body = entry.dialog.querySelector('.picker-body');
      if (body) body.replaceChildren(...wardrobePickerBody());
    }
  }

  /* v4.5（Stretch K2）：随机搭配「试穿」——只从**已拥有**（已解锁）部件里随机，
   * 结果只进内存预览（wardrobeTrialLook），**绝不自动保存**；用户点「保存这套」
   * 才逐槽写入档案，点「撤销试穿」或关闭 picker 即丢弃。picker 关闭时清空，
   * 试穿态不跨会话残留（与 v4.4 二级视图语义一致）。 */
  let wardrobeTrialLook = null;

  function fixedArtSkinPickerBody(companion, capabilities, persistent) {
    const children = [node('p', '这是完整预制皮肤，不参与发型、服装、配饰与色板的自由组合。只显示该角色实际拥有的皮肤。', 'meta')];
    const current = currentCompanionSkin(companion);
    const labels = { default: '默认', study: '学习装' };
    const stage = node('div', undefined, 'wardrobe-stage fixed-skin-stage');
    const preview = companionPortraitImage(companion, { slot: 'profile', mood: 'happy', skin: current }, 'wardrobe-preview-img fixed-skin-preview', companionNameWithForm(companionDisplayName(), companion));
    if (preview) stage.append(preview);
    stage.append(node('p', `${companionNameWithForm(companionDisplayName(), companion)} · ${labels[current] || current}`, 'wardrobe-preview-name'));
    children.push(stage);
    if (!persistent) children.push(node('p', FILE_MODE_NOTE, 'notice'));
    const grid = node('div', undefined, 'fixed-skin-options');
    capabilities.skins.forEach(skinId => {
      const cell = node('div', undefined, `fixed-skin-option${skinId === current ? ' is-selected' : ''}`);
      const thumb = companionPortraitImage(companion, { slot: 'profile', mood: 'happy', skin: skinId }, 'fixed-skin-thumb', `${labels[skinId] || skinId}皮肤预览`);
      if (thumb) cell.append(thumb);
      cell.append(node('span', labels[skinId] || skinId, 'wardrobe-name'));
      if (skinId === current) {
        cell.append(node('span', '当前', 'wardrobe-state is-current'));
      } else {
        const use = node('button', `使用${labels[skinId] || skinId}皮肤`, 'button-secondary fixed-skin-use');
        use.type = 'button';
        use.disabled = !persistent;
        use.addEventListener('click', () => {
          const result = progress.setCompanionSkin(companion.id, skinId);
          profileNotice = result.ok ? `已切换为「${labels[skinId] || skinId}」皮肤。` : result.error;
          refreshAll();
          refreshWardrobePickerBody();
        });
        cell.append(use);
      }
      grid.append(cell);
    });
    children.push(grid);
    return children;
  }

  function randomOwnedLook(currentLook) {
    const next = { body: currentLook.body };
    wardrobe.manifest().slots.forEach(slot => {
      const owned = slot.options.filter(opt => isCosmeticUnlocked(wardrobePartAsset(slot.id, opt)));
      next[slot.id] = owned.length ? owned[Math.floor(Math.random() * owned.length)].id : currentLook[slot.id];
    });
    return wardrobe.sanitizeLook(next);
  }

  function buildWardrobeSlot(slot, look, isHumanoid, persistent) {
    const block = node('div', undefined, 'wardrobe-slot');
    block.append(node('h4', slot.zh, 'wardrobe-slot-title'));
    const grid = node('div', undefined, 'wardrobe-options');
    slot.options.forEach(opt => {
      const asset = wardrobePartAsset(slot.id, opt);
      const unlocked = isCosmeticUnlocked(asset);
      const selected = look[slot.id] === opt.id;
      const cell = node('div', undefined, `wardrobe-option${selected ? ' is-selected' : ''}${unlocked ? '' : ' is-locked'}`);
      /* 预览：色板显示三色卡，其它槽把该部件套到当前 look 上生成小图 */
      if (slot.id === 'palette' && opt.swatch) {
        const sw = node('span', undefined, 'wardrobe-swatch');
        sw.style.background = `linear-gradient(135deg, ${opt.swatch[0]} 0 33%, ${opt.swatch[1]} 33% 66%, ${opt.swatch[2]} 66% 100%)`;
        cell.append(sw);
      } else if (isHumanoid) {
        const previewLook = wardrobe.sanitizeLook(Object.assign({}, look, { [slot.id]: opt.id }));
        cell.append(svgImage(wardrobe.icon(previewLook), opt.zh, 'wardrobe-thumb'));
      } else {
        const ph = node('span', undefined, 'wardrobe-thumb wardrobe-thumb-ph');
        cell.append(ph);
      }
      cell.append(node('span', opt.zh, 'wardrobe-name'));
      if (selected) {
        cell.append(node('span', '当前', 'wardrobe-state is-current'));
      } else if (!isHumanoid) {
        cell.append(node('span', '需人形', 'wardrobe-state'));
      } else if (unlocked) {
        const use = node('button', '选用', 'button-secondary wardrobe-use');
        use.type = 'button';
        use.disabled = !persistent;
        use.addEventListener('click', () => {
          const result = progress.setCompanionLook(slot.id, opt.id);
          profileNotice = result.ok ? null : result.error;
          /* Stretch K2：手动选用任一件即结束试穿态（预览回到已保存搭配） */
          wardrobeTrialLook = null;
          refreshAll();
          refreshWardrobePickerBody();
        });
        cell.append(use);
      } else if (collections && collections.assetPrice(asset)) {
        const buy = buildBuyButton(asset, null);
        buy.addEventListener('click', refreshWardrobePickerBody);
        cell.append(buy);
      } else {
        cell.append(node('span', cosmeticUnlockText(asset), 'wardrobe-state'));
      }
      grid.append(cell);
    });
    block.append(grid);
    return block;
  }

  function wardrobePickerBody() {
    if (!wardrobe || !progress) return [node('p', '装扮系统未载入（companion-wardrobe.js 缺失）。', 'muted')];
    const children = [];
    children.push(node('p', '给学习伙伴换发型、服装、配饰与配色。档案只记住你选了哪些部件（不存整图），随时可换回；基础款免费，其余靠等级 / 成就 / 叶片解锁。', 'meta'));
    const companion = resolveCompanion(progress.cosmetics().companionId);
    const capabilities = companion && companionView && typeof companionView.capabilities === 'function'
      ? companionView.capabilities(companion.id) : null;
    const persistent = progress.isPersistent();
    if (capabilities && capabilities.skins && capabilities.skins.length) {
      return fixedArtSkinPickerBody(companion, capabilities, persistent);
    }
    const isHumanoid = Boolean(capabilities ? capabilities.wardrobe : companion && ((companion.procedural && companion.procedural.body) || companion.bust));
    const savedLook = currentCompanionLook(companion) || (wardrobe ? wardrobe.defaultLookFor(wardrobe.DEFAULT_BODY) : null);
    /* Stretch K2：有试穿组合时预览试穿效果，否则预览已保存的搭配 */
    const look = (wardrobeTrialLook && savedLook) ? wardrobe.sanitizeLook(Object.assign({}, wardrobeTrialLook, { body: savedLook.body })) : savedLook;
    /* 顶部实时大人形预览 */
    const stage = node('div', undefined, 'wardrobe-stage');
    if (isHumanoid && look) {
      stage.append(svgImage(wardrobe.build(look, 'happy'), '当前装扮预览', 'wardrobe-preview-img'));
      stage.append(node('p', companionNameWithForm(companionDisplayName(), companion), 'wardrobe-preview-name'));
      /* Stretch K2：随机搭配（只随机已拥有、不自动保存）+ 试穿的保存/撤销 */
      const actions = node('div', undefined, 'wardrobe-stage-actions');
      const randomButton = node('button', wardrobeTrialLook ? '再随机一次' : '随机搭配（只用已拥有的）', 'button-secondary wardrobe-random');
      randomButton.type = 'button';
      randomButton.addEventListener('click', () => {
        const base = currentCompanionLook(companion) || wardrobe.defaultLookFor(companion.bust);
        wardrobeTrialLook = randomOwnedLook(base);
        refreshWardrobePickerBody();
      });
      actions.append(randomButton);
      if (wardrobeTrialLook) {
        actions.append(node('span', '试穿中，尚未保存', 'wardrobe-trial-hint'));
        const saveButton = node('button', '保存这套', 'button wardrobe-trial-save');
        saveButton.type = 'button';
        saveButton.disabled = !persistent;
        saveButton.addEventListener('click', () => {
          ['hair', 'outfit', 'accessory', 'palette'].forEach(part => {
            progress.setCompanionLook(part, wardrobeTrialLook[part]);
          });
          wardrobeTrialLook = null;
          refreshAll();
          refreshWardrobePickerBody();
        });
        const undoButton = node('button', '撤销试穿', 'button-secondary wardrobe-trial-undo');
        undoButton.type = 'button';
        undoButton.addEventListener('click', () => {
          wardrobeTrialLook = null;
          refreshWardrobePickerBody();
        });
        actions.append(saveButton, undoButton);
      }
      stage.append(actions);
    } else {
      stage.append(node('p', '当前装备的是生物形象（不是人形）。先在「学习伙伴形象」里装备「少年」或「少女」，就能自定义发型、服装、配饰与配色。', 'notice'));
    }
    children.push(stage);
    if (!persistent) children.push(node('p', FILE_MODE_NOTE, 'notice'));
    wardrobe.manifest().slots.forEach(slot => {
      children.push(buildWardrobeSlot(slot, look || {}, isHumanoid, persistent));
    });
    return children;
  }

  function openWardrobePicker(trigger) { openPicker('wardrobe', trigger); }
  function closeWardrobePicker() { closePickerById('wardrobe'); }

  definePicker('avatar', '更换头像', 'avatar-picker-title', avatarPickerBody);
  definePicker('frame', '更换头像框', 'frame-picker-title', framePickerBody);
  definePicker('companion', '更换学习伙伴形象', 'companion-picker-title', companionPickerBody);
  /* Stretch K2：关闭 picker（任何路径）丢弃未保存的试穿组合——试穿态不跨会话残留 */
  definePicker('wardrobe', '学习伙伴装扮', 'wardrobe-picker-title', wardrobePickerBody, () => {
    wardrobeTrialLook = null;
  });
  /* 主题的 onClose 钩子：任何关闭路径（关闭按钮 / Esc / 代码调用）都恢复
   * 已存主题——预览绝不外漏（交接 C2）。幂等：previewThemeId 为空时什么都不做，
   * closePickerById 与 dialog close 事件各触发一次也无副作用。 */
  definePicker('theme', '更换页面主题', 'theme-picker-title', themePickerBody, () => {
    if (previewThemeId) {
      previewThemeId = null;
      applyTheme();
      refreshThemeButton();
    }
  });

  /* ---------- v4.3：章节 Boss 挑战（交接 E3） ----------
   * Boss 的本质是单元综合自测/预检，不是小游戏：题目全部来自本站已讲知识
   * （bosses.js 从既有自测题改写），单选评分，
   * 提交后逐题给解析与来源课程。两种进入方式同一套题、不同记录口径：
   * 学习前预检（检测背景知识，高分有「未战先知」成就）与学完复测（总结，
   * firstPct 与 lastPct 的差值就是真实进步）。评分四档：尚未破甲 <50 /
   * 已破甲 50–69 / 优势明显 70–84 / 压倒性优势 ≥85。 */
  let bossDialog = null;
  let bossBody = null;
  let bossUnitId = null;

  const BOSS_DISCLAIMER = '得分只代表你对这些题目的掌握程度：高分说明你已有相关背景知识，但不代表可以跳过整个单元——正课里还有题目之外的练习与项目；低分很正常，把本站中文讲解学完再回来复测，对比首战成绩就能看到进步。';

  function openBossDialog(unitId) {
    if (!progress || !bossesModule) return;
    const brief = progress.bossBrief(unitId);
    if (!brief) return;
    bossUnitId = unitId;
    if (!bossDialog) {
      bossDialog = buildPickerDialog('章节挑战', bossLandingBody, closeBossDialog, 'boss-panel-title');
      document.body.append(bossDialog);
    } else {
      replaceBossBody();
    }
    bossBody = bossDialog.querySelector('.picker-body');
    if (typeof bossDialog.showModal === 'function') {
      if (!bossDialog.open) bossDialog.showModal();
    } else {
      bossDialog.setAttribute('open', '');
    }
  }

  function replaceBossBody() {
    if (!bossDialog) return;
    const body = bossDialog.querySelector('.picker-body');
    if (body) body.replaceChildren(...bossLandingBody());
  }

  function closeBossDialog() {
    closeDialogHelper(bossDialog, null);
    bossUnitId = null;
    /* 关掉面板后地图上的 Boss 节点状态要跟上（历史最佳/已挑战标记）。
     * v4.4：地图住进「世界地图」sheet 后，refreshAll 内部的
     * refreshOpenSheets 会重建打开中的 sheet body，不再需要单独的
     * rebuildMap（旧实现依赖首页内联的 mapMount 容器，已随首页重构移除）。 */
    refreshAll();
  }

  /* Boss 面板首屏：介绍 + 历史记录 + 两个进入方式 */
  function bossLandingBody() {
    const brief = progress.bossBrief(bossUnitId);
    if (!brief) return [node('p', 'Boss 题库未载入。', 'notice')];
    const children = [];
    children.push(node('p', brief.desc, 'boss-desc'));
    children.push(node('p', `共 ${brief.questionCount} 道单选题，全部改写自本单元课程已讲解并考核过的知识点；评分四档：尚未破甲（<50%）/ 已破甲（50–69%）/ 优势明显（70–84%）/ 压倒性优势（≥85%）。不联网、不是 AI 出题、不提供任何项目成品答案。`, 'meta'));

    if (brief.record && brief.record.attempts > 0) {
      const record = brief.record;
      const grid = node('div', undefined, 'stat-grid boss-record');
      grid.append(
        statCell('挑战次数', `${record.attempts} 次`, '同一单元可以反复挑战'),
        statCell('历史最佳', record.bestPct === null ? '—' : `${record.bestPct}%`, record.bestPct !== null ? (bossesModule.ratingOf(record.bestPct) || {}).zh || '' : ''),
        statCell('首战成绩', record.firstPct === null ? '—' : `${record.firstPct}%`, record.firstWasPrecheck ? '首战是学习前预检' : '首战是学完复测'),
        statCell('最近成绩', record.lastPct === null ? '—' : `${record.lastPct}%`, record.firstPct !== null && record.lastPct !== null && record.lastPct > record.firstPct ? `比首战高 ${record.lastPct - record.firstPct} 个百分点` : '首战 vs 最近的差值就是你的进步')
      );
      children.push(grid);
    } else {
      children.push(node('p', '还没有挑战记录。可以在学习前直接挑战（检测已有背景知识），也可以学完本单元后挑战（总结）。', 'muted empty-state'));
    }
    children.push(node('p', BOSS_DISCLAIMER, 'boss-disclaimer'));

    const actions = node('div', undefined, 'boss-actions');
    const precheck = node('button', brief.record && brief.record.attempts > 0 ? '再做一次学习前预检' : '学习前直接挑战（预检）', 'button');
    precheck.type = 'button';
    precheck.addEventListener('click', () => showBossQuiz(true));
    const review = node('button', '学完后挑战（复测总结）', 'button-secondary');
    review.type = 'button';
    review.addEventListener('click', () => showBossQuiz(false));
    actions.append(precheck, review);
    children.push(actions);
    return children;
  }

  /* 答题视图：全部题目一屏（5–7 题），radio 单选，提交后评分 */
  function showBossQuiz(isPrecheck) {
    const boss = bossesModule.bossForUnit(bossUnitId);
    if (!boss || !bossBody) return;
    const children = [];
    children.push(node('p', isPrecheck
      ? '学习前预检：先别翻课程，凭现有理解作答——这是为了检测你已经会多少，答错完全没有代价。'
      : '学完复测：按你在本单元学到的内容作答，交卷后逐题给解析。', 'boss-quiz-intro'));
    const groups = [];
    boss.questions.forEach((question, index) => {
      const fieldset = node('fieldset', undefined, 'boss-question');
      fieldset.append(node('legend', `${index + 1}. ${question.q}`));
      const radios = [];
      question.options.forEach((option, optionIndex) => {
        const label = node('label', undefined, 'boss-option');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `boss-q-${index}`;
        radio.value = String(optionIndex);
        label.append(radio, node('span', option));
        fieldset.append(label);
        radios.push(radio);
      });
      groups.push(radios);
      children.push(fieldset);
    });
    const submit = node('button', '交卷评分', 'button');
    submit.type = 'button';
    submit.addEventListener('click', () => {
      const answers = groups.map(radios => {
        const picked = radios.find(radio => radio.checked);
        return picked ? Number(picked.value) : null;
      });
      const unanswered = answers.filter(answer => answer === null).length;
      if (unanswered > 0 && !window.confirm(`还有 ${unanswered} 题没有作答，未作答按答错计分。确定交卷吗？`)) return;
      const submission = progress.submitBoss(bossUnitId, answers, isPrecheck);
      if (!submission.ok) {
        showBossResult(null, submission.error, isPrecheck);
        return;
      }
      showBossResult(submission, null, isPrecheck);
    });
    children.push(submit);
    const back = node('button', '返回（不交卷）', 'button-secondary');
    back.type = 'button';
    back.addEventListener('click', () => { bossBody.replaceChildren(...bossLandingBody()); });
    children.push(back);
    bossBody.replaceChildren(...children);
  }

  /* 结果视图：得分 + 评级 + 逐题解析（含来源课程链接）+ 固定声明 */
  function showBossResult(submission, error, isPrecheck) {
    if (!bossBody) return;
    if (!submission || !submission.ok) {
      bossBody.replaceChildren(node('p', error || '评分失败。', 'notice'));
      return;
    }
    const result = submission.result;
    const boss = bossesModule.bossForUnit(bossUnitId);
    const children = [];
    const headline = node('div', undefined, `boss-result is-${result.rating}`);
    headline.append(node('p', `${result.ratingZh} · ${result.pct}%`, 'boss-result-rating'));
    headline.append(node('p', `答对 ${result.correct} / ${result.total} 题 · ${result.ratingDesc}`, 'boss-result-meta'));
    if (isPrecheck && result.pct >= 70) {
      headline.append(node('p', '你是带着经验来的：还没正式学这个单元就答对了大部分。这份背景会让正课学起来更快——但正课里仍有练习与项目等你亲手完成。', 'boss-precheck-praise'));
    }
    children.push(headline);

    const list = node('ol', undefined, 'boss-review-list');
    result.details.forEach(detail => {
      const question = boss.questions[detail.index];
      const item = node('li', undefined, `boss-review-item ${detail.correct ? 'is-correct' : 'is-wrong'}`);
      item.append(node('p', `${detail.correct ? '✓ 答对' : '✗ 答错'} · ${question.q}`, 'boss-review-q'));
      const answerLine = node('p', undefined, 'boss-review-a');
      answerLine.append(node('span', `正确答案：${question.options[question.answer]}`));
      if (!detail.correct) {
        answerLine.append(node('span', detail.given === null ? '（未作答）' : `；你的选择：${question.options[detail.given]}`, 'meta'));
      }
      item.append(answerLine);
      item.append(node('p', question.explain, 'boss-review-explain'));
      const source = findLesson(question.lessonId);
      if (source) {
        const sourceLine = node('p', undefined, 'meta');
        sourceLine.append(node('span', '来源课程：'));
        sourceLine.append(link(`${source.zh} →`, lessonHref(source)));
        item.append(sourceLine);
      }
      list.append(item);
    });
    children.push(list);
    children.push(node('p', BOSS_DISCLAIMER, 'boss-disclaimer'));
    const done = node('button', '完成', 'button-secondary');
    done.type = 'button';
    done.addEventListener('click', closeBossDialog);
    children.push(done);
    bossBody.replaceChildren(...children);
    /* 挑战可能解锁成就（首破章节 Boss / 未战先知）与循环成就晋升：
     * afterChange 已在 submitBoss 里跑过，这里把地图与面板刷新一并触发
     * （refreshAll 内部会重建打开中的世界地图 sheet） */
    refreshAll();
  }

  /* ---------- v4.2：小奥可拖动（§6.1） ----------
   * Pointer Events 一套代码覆盖鼠标与触摸（touch-action: none 防止拖动时
   * 触发滚动）。位移小于 6px 视为点击（打开面板），不保存位置；拖出视口
   * 会被 clamp 拉回。持久化模式下位置存进 settings.companionPos；
   * file:// 下可以拖，但不承诺保存。 */
  /* v4.3（交接 A1）：元素不可测时的估算尺寸（display:none 或未入 DOM 时
   * getBoundingClientRect 返回 0×0）。按 CSS 的 min-height 44px 与实际渲染
   * 宽度估一个值，保证隐藏期间 resize 重定位后按钮仍在视口内；
   * 重新显示时 applyUiSettings 会再按真实尺寸修正一次。 */
  const COMPANION_FALLBACK_SIZE = { width: 140, height: 44 };

  function companionRectForPositioning() {
    const rect = assistantTrigger.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return { width: rect.width, height: rect.height };
    return COMPANION_FALLBACK_SIZE;
  }

  function applyCompanionPosition() {
    if (!assistantTrigger || !progress) return;
    const size = companionRectForPositioning();
    const saved = progress.settings().companionPos;
    const target = saved
      ? progress.Logic.clampCompanionPosition(saved.x, saved.y, window.innerWidth, window.innerHeight, size.width, size.height)
      : progress.Logic.defaultCompanionPosition(window.innerWidth, window.innerHeight, size.width, size.height);
    assistantTrigger.style.left = `${target.x}px`;
    assistantTrigger.style.top = `${target.y}px`;
    assistantTrigger.style.right = 'auto';
    assistantTrigger.style.bottom = 'auto';
  }

  function resetCompanionPosition() {
    if (progress) progress.resetCompanionPosition();
    applyCompanionPosition();
  }

  function enableCompanionDrag(trigger) {
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let originX = 0;
    let originY = 0;
    let capturedPointerId = null;
    trigger.style.touchAction = 'none';
    /* v4.5（交接 A1）根因修复：头像 <img> 的原生拖动会劫持手势（见 svgImage
     * 注释）。属性 draggable=false + CSS -webkit-user-drag:none 之外，这里再
     * 兜底拦截 dragstart——三道防御任何一道生效，pointer 事件流就不会被打断。 */
    trigger.addEventListener('dragstart', event => {
      if (typeof event.preventDefault === 'function') event.preventDefault();
    });
    trigger.addEventListener('pointerdown', event => {
      if (event.button !== undefined && event.button !== 0) return;
      dragging = true;
      moved = false;
      startX = event.clientX;
      startY = event.clientY;
      const rect = trigger.getBoundingClientRect();
      originX = rect.left;
      originY = rect.top;
      try {
        trigger.setPointerCapture(event.pointerId);
        capturedPointerId = event.pointerId;
      } catch (error) {
        /* 捕获失败不中断拖动：下面的 window 级兜底监听仍能让位置跟随指针。 */
        capturedPointerId = null;
      }
    });
    const move = event => {
      if (!dragging) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < 6) return;
      moved = true;
      const rect = trigger.getBoundingClientRect();
      const next = progress.Logic.clampCompanionPosition(
        originX + dx, originY + dy,
        window.innerWidth, window.innerHeight, rect.width, rect.height
      );
      trigger.style.left = `${next.x}px`;
      trigger.style.top = `${next.y}px`;
    };
    const finish = () => {
      if (!dragging) return;
      dragging = false;
      if (capturedPointerId !== null) {
        try { trigger.releasePointerCapture(capturedPointerId); } catch (error) { /* 浏览器可能已自动释放 */ }
        capturedPointerId = null;
      }
      if (moved && progress) {
        /* 拖动结束才保存一次；file:// 下返回错误并不影响当前显示位置 */
        const rect = trigger.getBoundingClientRect();
        progress.setCompanionPosition(Math.round(rect.left), Math.round(rect.top));
      }
    };
    /* 双通道监听：pointer capture 成功时事件重定向到 trigger（再冒泡到
     * window）；capture 失败或指针滑出按钮时事件落在指针下方元素并冒泡到
     * window——window 级兜底保证任何一条路径都不丢。两个处理器对同一事件
     * 幂等：finish 先置 dragging=false，move 重算的是同一组坐标。 */
    trigger.addEventListener('pointermove', move);
    trigger.addEventListener('pointerup', finish);
    trigger.addEventListener('pointercancel', finish);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
    /* 拖动过就不再当作点击（打开面板） */
    trigger.addEventListener('click', event => {
      if (moved) {
        event.stopImmediatePropagation();
        moved = false;
      }
    }, true);
    /* 视口变化（含旋转）后把按钮拉回视口内 */
    window.addEventListener('resize', applyCompanionPosition);
    /* v4.5（交接 A1）：手机旋转屏幕时部分浏览器只发 orientationchange、
     * resize 延迟或缺失——单独监听一次，成本同样是一次纯计算 clamp。 */
    window.addEventListener('orientationchange', applyCompanionPosition);
    /* v4.4（交接 H12）：后台标签页里 resize 会被节流甚至合并丢失——
     * 用户改了窗口尺寸再切回来时按钮可能还停在旧坐标（视口外）。
     * 回到前台时补一次 clamp，成本是一次纯计算，无副作用。 */
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') applyCompanionPosition();
    });
  }

  /* ---------- v4.5（交接 A2）：footer 版本行 ----------
   * 版本身份可见化的第一道：不进任何面板、不需要点击，页面底部直接看到
   * 「Odin 中文学习站 v4.6.0」。version.js 未加载（理论上只在脚本被拦截时）
   * 或页面没有 footer（DOM stub 早期骨架）时静默跳过，不影响任何功能。 */
  function mountFooterVersion() {
    if (!versionInfo) return;
    const footer = document.querySelector('.site-footer');
    if (!footer) return;
    footer.append(node('p', `${versionInfo.product} v${versionInfo.version}`, 'site-version'));
  }

  /* ---------- v4.5（Stretch K8）：版本不匹配轻提示 ----------
   * 两个检测源，都来自用户真实踩过的「旧服务 / 旧缓存页面 + 新档案」坑：
   *   ① window.ODIN_VERSION 缺失 —— version.js 没加载成功，最常见原因是
   *      页面文件混装（一部分来自旧缓存、一部分是新文件）或脚本被拦截；
   *   ② 自动读档失败且错误信息含 schemaVersion —— 存储里的档案由**更新的
   *      代码**写入，当前运行的 JS 是旧版（缓存没刷新），认不出新档案。
   * 命中任一条就在 body 末尾追加一条持久轻提示（role=status）：建议
   * Ctrl+F5 强制刷新，并明确「数据没有丢」。不弹窗、不阻断学习，与
   * storageWarningText 的既有告警互补（那条讲“怎么处理档案”，这条讲
   * “为什么会出现、先试试强刷”）。 */
  function versionMismatchText() {
    const info = (progress && progress.autoLoadInfo) ? progress.autoLoadInfo() : null;
    const schemaMismatch = Boolean(info && info.failed
      && typeof info.error === 'string' && info.error.indexOf('schemaVersion') !== -1);
    if (schemaMismatch) {
      return '页面文件可能不是最新版：本地学习档案由更新版本的本站写入，当前脚本认不出它（schemaVersion 不受支持）。请按 Ctrl+F5（Mac 为 Cmd+Shift+R）强制刷新；若仍如此，请关闭旧的服务窗口后重新运行 start.bat。你的数据没有丢——档案原文仍完整保留在浏览器里，本站已停止写入以免覆盖。';
    }
    if (!versionInfo) {
      return '页面版本信息未能加载（version.js 缺失），可能是页面文件混装：一部分来自浏览器旧缓存、一部分是新文件。请按 Ctrl+F5（Mac 为 Cmd+Shift+R）强制刷新。学习数据单独保存在浏览器存储里，不会因刷新丢失。';
    }
    return null;
  }

  function mountVersionMismatchNote() {
    const text = versionMismatchText();
    if (!text || !document.body) return;
    const note = node('p', text, 'version-mismatch-note');
    note.setAttribute('role', 'status');
    document.body.append(note);
  }

  /* ---------- v4.2：返回顶部 / 返回底部（§14.1） ----------
   * 固定在右侧中部（离右下角的小奥足够远，手机上也不重叠）；
   * 已在顶部时隐藏 ↑，已在底部时隐藏 ↓。 */
  let scrollTopButton = null;
  let scrollBottomButton = null;

  function updateScrollButtons() {
    if (!scrollTopButton || !scrollBottomButton) return;
    const top = window.scrollY || document.documentElement.scrollTop || 0;
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    scrollTopButton.hidden = top < 80;
    scrollBottomButton.hidden = max - top < 80;
  }

  function mountScrollButtons() {
    const wrap = node('div', undefined, 'scroll-buttons');
    scrollTopButton = node('button', '↑', 'scroll-button');
    scrollTopButton.type = 'button';
    scrollTopButton.setAttribute('aria-label', '返回页面顶部');
    scrollTopButton.title = '返回顶部';
    scrollTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    scrollBottomButton = node('button', '↓', 'scroll-button');
    scrollBottomButton.type = 'button';
    scrollBottomButton.setAttribute('aria-label', '到页面底部');
    scrollBottomButton.title = '到页面底部';
    scrollBottomButton.addEventListener('click', () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }));
    wrap.append(scrollTopButton, scrollBottomButton);
    document.body.append(wrap);
    window.addEventListener('scroll', updateScrollButtons, { passive: true });
    updateScrollButtons();
  }

  /* ---------- v4.4：本页阅读位置 2.0（交接 Core G，仅课程页） ----------
   * G1 章节感知 sticky 条：课程短标题 · 当前 section · 阅读百分比；
   * G2 章节节点按真实 DOM 生成（扫 main 里带 h2 的 section，不假设每课相同），
   *    当前高亮、可点击跳转、手机只显示点；
   * G3 口径红线：永远叫「本页阅读位置」，只反映滚动进度，不与课程完成 /
   *    官方任务 / 自测状态混成一个百分比；
   * G4 上一节 / 下一节按钮 + 读到底的轻提示（100% ✓，只改条内文字，不弹窗）。
   * v4.2 的 4px 细条 + 右上角独立标签被这个单行 bar 取代。 */
  let readingBar = null;
  let readingFill = null;
  let readingPct = null;
  let readingSectionLabel = null;
  let readingDots = [];
  let readingSections = [];   /* [{ el, title }]，来自真实页面结构 */
  let readingCurrent = -1;    /* -1 = 开篇（第一个 section 之前） */

  /* v4.5（交接 Core F）：首次有效读到本课结尾的会话侧闸门状态。
   * 「本次会话有效阅读秒数」不另立计数器，而是复用 progress 的 idle-aware 计时：
   * baselineTotalSeconds = 进入本课页时的累计有效秒数，会话秒数 = 当前累计 − baseline。
   * 计时器只在页面可见且非空闲时累加，且 file:// 不计时（会话秒数恒 0 → 不发奖励，
   * 恰好满足「file:// 只显示阅读位置、不发持久奖励」）。lastReadingPct = 最近阅读位置；
   * readRewardSettled = 本会话已结算（发放/已领过/file://），不再每帧重试。
   * 三道闸门（到 100% + 会话有效阅读 ≥60s + rewardFlags.read:<id> 终身一次）的
   * 权威判定在 progress.settleReadComplete，这里只喂入会话秒数并在成功后轻提示。 */
  let baselineTotalSeconds = 0;
  let lastReadingPct = 0;
  let readRewardSettled = false;

  function maybeFireReadReward() {
    if (readRewardSettled) return;
    if (lastReadingPct < 100) return;
    if (!progress || !progress.settleReadComplete) return;
    const sessionSeconds = Math.max(0, progress.summary().totalSeconds - baselineTotalSeconds);
    const minSeconds = progress.readCompleteMinSeconds ? progress.readCompleteMinSeconds() : 60;
    if (sessionSeconds < minSeconds) return;   /* End 键秒到底：会话有效阅读不足，不发 */
    const result = progress.settleReadComplete(sessionSeconds, true);
    /* ok=发放成功、already=此前已领、file-mode=非持久化：三种都停止重试。
     * too-fast / not-end 不会走到这里（前面已 guard），保守起见不停止。 */
    if (result && (result.ok || result.reason === 'already' || result.reason === 'file-mode')) {
      readRewardSettled = true;
    }
  }

  function readingScrollBehavior() {
    /* prefers-reduced-motion 下不做平滑滚动（跳转仍是即时到位，功能不缺失） */
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto' : 'smooth';
  }

  function readingScrollTo(index) {
    const entry = readingSections[index];
    if (entry && entry.el.scrollIntoView) {
      entry.el.scrollIntoView({ behavior: readingScrollBehavior(), block: 'start' });
    }
  }

  function updateReadingPosition() {
    if (!readingBar) return;
    const top = window.scrollY || document.documentElement.scrollTop || 0;
    const max = Math.max(0, (document.documentElement.scrollHeight || 0) - window.innerHeight);
    const pct = max > 0 ? Math.min(100, Math.round((top / max) * 100)) : 100;
    readingFill.style.width = `${pct}%`;
    /* G2 当前章节 = 滚过 sticky 条下缘的最后一个 section（真实 DOM 顺序）。
     * 全部还在下方时是「开篇」（标题 / 摘要 / 官方入口区）。
     * 阈值 = 条底 + 16px：必须大于 CSS scroll-margin-top（3rem≈48px）与条高（≈35px）
     * 的差，否则点节点跳转到章节顶部后（top=48）仍判成上一节（真实浏览器实测发现）。 */
    const barBottom = readingBar.getBoundingClientRect ? readingBar.getBoundingClientRect().bottom : 0;
    let current = -1;
    readingSections.forEach((entry, index) => {
      if (entry.el.getBoundingClientRect().top <= barBottom + 16) current = index;
    });
    readingCurrent = current;
    const title = current >= 0 ? readingSections[current].title : '开篇';
    if (readingSectionLabel) readingSectionLabel.textContent = title;
    readingDots.forEach((dot, index) => {
      dot.classList.toggle('is-current', index === current);
      dot.classList.toggle('is-passed', index < current);
      dot.setAttribute('aria-current', index === current ? 'true' : 'false');
    });
    /* G4 读到底的轻提示：只改条内文字与状态类，不打断阅读 */
    readingBar.classList.toggle('is-done', pct >= 100);
    readingPct.textContent = pct >= 100 ? '100% ✓' : `${pct}%`;
    readingBar.setAttribute('aria-valuenow', String(pct));
    readingBar.setAttribute('aria-valuetext', `本页阅读位置 ${pct}%，当前章节：${title}`);
    /* v4.5（交接 Core F）：记下阅读位置并尝试结算「首次有效读到结尾」。
     * 注意：这里的 100% 只是滚动位置，与「本课已完成」勾选框完全无关——
     * 结算只发一次性 XP/叶片奖励与轻提示，绝不改动完成 / 官方 / 自测状态。 */
    lastReadingPct = pct;
    maybeFireReadReward();
  }

  function mountReadingPosition() {
    /* G2：章节清单来自真实页面结构——main 直接子级里带 h2 的 section 才算节点。
     * v2 课 8 节、旧布局课 5 节、没有代码示例的课更少；概念图 figure 不带 h2，
     * 不会被误当成章节。节点名直接用真实 h2 文本，不维护第二份标题清单。 */
    readingSections = Array.prototype.slice.call(main.children)
      .filter(el => el.tagName === 'SECTION' && el.querySelector('h2'))
      .map(el => ({ el, title: el.querySelector('h2').textContent.trim() }));

    const bar = node('div', undefined, 'reading-position');
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-valuenow', '0');
    bar.setAttribute('aria-label', '本页阅读位置（只反映滚动进度，不代表课程完成度）');
    /* G1 课程短标题：编号 + 中文短标题（lessons 数据与页面 H1 同源） */
    const lessonIndex = data.lessons.findIndex(lesson => lesson.id === activeLessonId);
    if (lessonIndex >= 0) {
      bar.append(node('span', `${String(lessonIndex + 1).padStart(2, '0')} ${data.lessons[lessonIndex].zh}`, 'reading-lesson-short'));
      bar.append(node('span', '·', 'reading-sep'));
    }
    readingSectionLabel = node('span', '开篇', 'reading-current-section');
    bar.append(readingSectionLabel);

    /* G4 上一节 / 下一节（窄屏隐藏：手机上点节点即可跳转，不占宽度） */
    if (readingSections.length > 1) {
      const stepPrev = node('button', '‹', 'reading-step');
      stepPrev.type = 'button';
      stepPrev.title = '上一节';
      stepPrev.setAttribute('aria-label', '跳到上一节');
      stepPrev.addEventListener('click', () => {
        if (readingCurrent <= 0) window.scrollTo({ top: 0, behavior: readingScrollBehavior() });
        else readingScrollTo(readingCurrent - 1);
      });
      const stepNext = node('button', '›', 'reading-step');
      stepNext.type = 'button';
      stepNext.title = '下一节';
      stepNext.setAttribute('aria-label', '跳到下一节');
      stepNext.addEventListener('click', () => {
        readingScrollTo(Math.min(readingSections.length - 1, readingCurrent + 1));
      });
      bar.append(stepPrev, stepNext);
    }

    /* G2 章节节点：视觉是点（::before 画圆），名字在 aria-label 与 title 里。
     * 命中区 24px（WCAG 2.5.8 AA 最小目标尺寸）——sticky 条必须保持紧凑，
     * 不能按 44px 常规按钮撑高，否则遮挡正文；桌面 hover 有 title 提示补强。 */
    if (readingSections.length) {
      const nav = node('nav', undefined, 'reading-sections');
      nav.setAttribute('aria-label', '本页章节跳转');
      readingDots = readingSections.map((entry, index) => {
        const dot = node('button', undefined, 'reading-dot');
        dot.type = 'button';
        dot.title = entry.title;
        dot.setAttribute('aria-label', `跳到章节：${entry.title}`);
        dot.setAttribute('aria-current', 'false');
        dot.addEventListener('click', () => readingScrollTo(index));
        nav.append(dot);
        return dot;
      });
      bar.append(nav);
    }

    readingPct = node('span', '0%', 'reading-pct');
    bar.append(readingPct);
    readingFill = node('div', undefined, 'reading-position-fill');
    bar.append(readingFill);
    readingBar = bar;
    document.body.append(bar);
    window.addEventListener('scroll', updateReadingPosition, { passive: true });
    updateReadingPosition();
    /* v4.5（交接 Core F）：会话有效阅读秒数的基线 = 进入本页时的累计值。
     * 之后的会话秒数 = summary().totalSeconds − baseline（计时器 idle-aware，
     * file:// 不计时）。再补一个 2 秒的轻量复查：用户滚到底后停住不动时
     * 不再有 scroll 事件，靠它把「秒数刚满 60」的时刻接住。 */
    if (progress) baselineTotalSeconds = progress.summary().totalSeconds;
    window.setInterval(() => {
      if (readRewardSettled || lastReadingPct < 100) return;
      maybeFireReadReward();
    }, 2000);
  }

  /* ---------- v4.2：快捷键（§14.3） ----------
   * J / → 下一课、K / ← 上一课、G H 首页、G C 课程目录、G P 个人资料、
   * ? 说明、Esc 关闭（原生 dialog 自带，降级路径这里补）。输入框 /
   * 文本域 / 下拉框聚焦时不触发单键；带修饰键（Ctrl/Alt/Meta）一律不拦。
   * Home / End 保持浏览器默认行为。 */
  let shortcutHelpDialog = null;
  let pendingG = false;
  let pendingGTimer = 0;

  const SHORTCUT_HELP = [
    ['Ctrl + K', '快速跳转（搜索课程与功能）'],
    ['J 或 →', '下一课（课程页）'],
    ['K 或 ←', '上一课（课程页）'],
    ['G 然后 H', '回首页'],
    ['G 然后 C', '打开课程目录（课程页）/ 滚到目录（首页）'],
    ['G 然后 P', '打开个人资料'],
    ['?', '显示本说明'],
    ['Esc', '关闭弹窗'],
    ['Home / End', '浏览器默认行为（本站不拦截）']
  ];

  function openShortcutHelp() {
    if (!shortcutHelpDialog) {
      shortcutHelpDialog = buildPickerDialog('快捷键说明', () => {
        const list = node('dl', undefined, 'shortcut-list');
        SHORTCUT_HELP.forEach(([keys, desc]) => {
          const row = node('div', undefined, 'shortcut-row');
          /* H8：按键用 <kbd> 呈现（视觉上是键帽，读屏按单词读），
           * 连接词「或 / 然后 / /」保持普通文本——不再是一串等宽纯文字 */
          const dt = node('dt');
          keys.split(/\s+/).forEach(part => {
            if (part === '或' || part === '然后' || part === '/' || part === '+') dt.append(node('span', part, 'key-or'));
            else dt.append(node('kbd', part));
          });
          row.append(dt, node('dd', desc));
          list.append(row);
        });
        return [list, node('p', '输入框、文本域与下拉框聚焦时，单键快捷键不会触发。', 'meta')];
      }, closeShortcutHelp, 'shortcut-help-title');
      document.body.append(shortcutHelpDialog);
    }
    if (typeof shortcutHelpDialog.showModal === 'function') {
      if (!shortcutHelpDialog.open) shortcutHelpDialog.showModal();
    } else {
      shortcutHelpDialog.setAttribute('open', '');
    }
  }

  function closeShortcutHelp() {
    closeDialogHelper(shortcutHelpDialog, null);
  }

  function shortcutTargetIsEditable(target) {
    if (!target || !target.tagName) return false;
    const tag = String(target.tagName).toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable === true;
  }

  function handleShortcut(event) {
    if (progress && progress.settings().shortcutsEnabled === false) return;
    /* v4.4 Stretch I9：Ctrl/Cmd+K 命令面板——唯一带修饰键的快捷键，
     * 必须在「带修饰键一律不拦」之前处理 */
    if ((event.ctrlKey || event.metaKey) && !event.altKey && String(event.key).toLowerCase() === 'k') {
      if (event.preventDefault) event.preventDefault();
      openCommandDialog();
      return;
    }
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    if (shortcutTargetIsEditable(event.target)) return;
    /* Esc：原生 dialog 自己会关；这里只兜极旧浏览器的降级路径。
     * v4.4：picker 与 sheet 都走注册表遍历（工厂重构后不再有四个独立的
     * dialog 模块变量），并补上 boss / reset 两个此前遗漏的弹窗。 */
    if (event.key === 'Escape') {
      const dialogs = [
        ...Object.keys(pickerRegistry).map(id => pickerRegistry[id].dialog),
        ...Object.keys(sheetRegistry).map(id => sheetRegistry[id].dialog),
        shortcutHelpDialog, profileDialog, catalogDialog, assistantDialog, bossDialog, resetDialog, commandDialog
      ];
      dialogs.forEach(dialog => {
        if (dialog && dialog.open === true && typeof dialog.close !== 'function') dialog.open = false;
      });
      return;
    }
    const key = event.key.toLowerCase();
    if (pendingG) {
      pendingG = false;
      window.clearTimeout(pendingGTimer);
      if (key === 'h') { window.location.href = 'index.html'; return; }
      if (key === 'p') { openProfilePanel(); return; }
      if (key === 'c') {
        /* v4.4：目录两页都住在 dialog 里（首页不再内联 46 行），G C 统一开目录 */
        openCatalogDialog();
        return;
      }
    }
    if (key === 'g') {
      pendingG = true;
      window.clearTimeout(pendingGTimer);
      pendingGTimer = window.setTimeout(() => { pendingG = false; }, 900);
      return;
    }
    if (key === '?') { openShortcutHelp(); return; }
    /* 翻页只在课程页有意义 */
    if (document.body.dataset.page !== 'lesson' || !activeLessonId) return;
    const index = data.lessons.findIndex(lesson => lesson.id === activeLessonId);
    if ((key === 'j' || event.key === 'ArrowRight') && index < data.lessons.length - 1) {
      window.location.href = lessonHref(data.lessons[index + 1]);
    } else if ((key === 'k' || event.key === 'ArrowLeft') && index > 0) {
      window.location.href = lessonHref(data.lessons[index - 1]);
    }
  }

  function mountShortcuts() {
    window.addEventListener('keydown', handleShortcut);
  }

  /* ---------- v4.4 Stretch I9：命令面板（Ctrl/Cmd + K） ----------
   * 原生 dialog + input 过滤 + ↑↓/Enter 键盘导航，零依赖、无网络。
   * 定位是桌面加速器而非新信息源：面板里能到的每一课、每一个功能，
   * 首页入口卡 / 目录 dialog（已有搜索与过滤）都有移动端路径——
   * 键盘快捷键只做增强（红线：Hover/键盘只能增强）。
   * 命令 = 静态动作（面板/页面入口）+ 20 课已开放课程（可跳转的才列出，
   * 未开放课程进目录看结构，不在这里给假入口）。 */
  let commandDialog = null;
  let commandInput = null;
  let commandList = null;
  let commandItems = [];
  let commandActiveIndex = 0;
  let commandTrigger = null;

  function commandEntries() {
    const actions = [
      { label: '回到首页', hint: '导航', run: () => { window.location.href = 'index.html'; } },
      { label: '打开课程目录', hint: '46 课完整目录 · 可搜索过滤', run: () => openCatalogDialog() },
      { label: '打开学习进度', hint: '总进度 · 学习时长 · 档案导出导入', run: () => openSheet('progress') },
      { label: '打开今日计划', hint: '每日 · 复习 · 每周 · 挑战卡', run: () => openSheet('tasks') },
      { label: '打开学习地图 · 技能路线', hint: 'S 型路线 · 8 个单元', run: () => openMapSheet('skill') },
      { label: '打开学习地图 · 世界地图', hint: '官方全路线 8 个 World', run: () => openMapSheet('world') },
      { label: '打开学习地图 · Foundations 探索', hint: '五阶节点地图 · Boss 挑战', run: () => openMapSheet('found') },
      { label: '打开个人中心 · 形象', hint: '头像 · 头像框 · 伙伴 · 主题', run: () => openProfilePanel('identity') },
      { label: '打开个人中心 · 成就收藏', hint: '', run: () => openProfilePanel('achievements') },
      { label: '打开个人中心 · 统计', hint: '热力图 · 个人最佳', run: () => openProfilePanel('stats') },
      { label: '打开个人中心 · 设置', hint: '界面开关 · 每日目标 · 备份', run: () => openProfilePanel('settings') },
      { label: '打开主题选择', hint: '30 套主题 · 即时预览', run: () => openThemePicker() },
      { label: '唤出学习伙伴', hint: '今天 · 复习 · 成就 · 设置', run: () => openAssistantPanel() },
      { label: '快捷键说明', hint: '', run: () => openShortcutHelp() }
    ];
    const lessons = data.lessons.map(lesson => ({
      label: lesson.zh,
      hint: lesson.title,
      keywords: lesson.id,
      run: () => { window.location.href = lessonHref(lesson); }
    }));
    return actions.concat(lessons);
  }

  function commandMatches(item, query) {
    if (!query) return true;
    const text = `${item.label} ${item.hint || ''} ${item.keywords || ''}`.toLowerCase();
    return query.toLowerCase().split(/\s+/).filter(Boolean)
      .every(part => text.includes(part));
  }

  function syncCommandActive() {
    const items = commandList.children.filter
      ? commandList.children.filter(el => el.classList && el.classList.contains('command-item'))
      : Array.prototype.slice.call(commandList.children).filter(el => el.classList && el.classList.contains('command-item'));
    items.forEach((li, index) => {
      const active = index === commandActiveIndex;
      li.classList.toggle('is-active', active);
      li.setAttribute('aria-selected', active ? 'true' : 'false');
      if (active && li.scrollIntoView) li.scrollIntoView({ block: 'nearest' });
    });
    commandInput.setAttribute('aria-activedescendant', commandItems.length ? `command-item-${commandActiveIndex}` : '');
  }

  function renderCommandResults() {
    const query = commandInput.value.trim();
    /* 上限 60：当前全量 = 14 个动作 + 20 课 = 34 条，必须全部可见——
     * 静默截断会让「所有课都能搜到」变成假话；60 也给未来课程留余量 */
    commandItems = commandEntries().filter(item => commandMatches(item, query)).slice(0, 60);
    commandActiveIndex = 0;
    if (!commandItems.length) {
      commandList.replaceChildren(node('li', '没有匹配的课程或功能。试试「Git」「复习」「主题」这样的关键词。', 'command-empty muted empty-state'));
    } else {
      commandList.replaceChildren(...commandItems.map((item, index) => {
        const li = node('li', undefined, 'command-item');
        li.id = `command-item-${index}`;
        li.setAttribute('role', 'option');
        li.append(node('span', item.label, 'command-label'));
        if (item.hint) li.append(node('span', item.hint, 'command-hint meta'));
        li.addEventListener('click', () => runCommand(index));
        return li;
      }));
    }
    syncCommandActive();
  }

  function runCommand(index) {
    const item = commandItems[index];
    if (!item) return;
    closeCommandDialog();
    item.run();
  }

  function handleCommandKeydown(event) {
    if (event.key === 'ArrowDown') {
      if (event.preventDefault) event.preventDefault();
      if (commandItems.length) commandActiveIndex = (commandActiveIndex + 1) % commandItems.length;
      syncCommandActive();
    } else if (event.key === 'ArrowUp') {
      if (event.preventDefault) event.preventDefault();
      if (commandItems.length) commandActiveIndex = (commandActiveIndex - 1 + commandItems.length) % commandItems.length;
      syncCommandActive();
    } else if (event.key === 'Enter') {
      if (event.preventDefault) event.preventDefault();
      runCommand(commandActiveIndex);
    } else if (event.key === 'Home' && commandItems.length) {
      if (event.preventDefault) event.preventDefault();
      commandActiveIndex = 0;
      syncCommandActive();
    } else if (event.key === 'End' && commandItems.length) {
      if (event.preventDefault) event.preventDefault();
      commandActiveIndex = commandItems.length - 1;
      syncCommandActive();
    }
    /* Esc 不拦：原生 dialog 自己关（close 事件里归还焦点） */
  }

  function buildCommandDialog() {
    const dialog = node('dialog', undefined, 'picker-dialog command-dialog');
    dialog.setAttribute('aria-labelledby', 'command-panel-title');
    const head = node('div', undefined, 'dialog-head');
    const title = node('h2', '快速跳转');
    title.id = 'command-panel-title';
    const closeButton = node('button', '关闭', 'dialog-close');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', '关闭快速跳转');
    closeButton.addEventListener('click', closeCommandDialog);
    head.append(title, closeButton);
    const body = node('div', undefined, 'picker-body command-body');
    commandInput = document.createElement('input');
    commandInput.type = 'search';
    commandInput.className = 'theme-search command-input';
    commandInput.placeholder = '搜索课程或功能…（↑↓ 选择，Enter 打开）';
    commandInput.setAttribute('aria-label', '搜索课程或功能');
    commandInput.setAttribute('role', 'combobox');
    commandInput.setAttribute('aria-expanded', 'true');
    commandInput.setAttribute('aria-controls', 'command-results');
    commandInput.setAttribute('autocomplete', 'off');
    commandInput.addEventListener('input', renderCommandResults);
    commandInput.addEventListener('keydown', handleCommandKeydown);
    commandList = node('ul', undefined, 'command-list');
    commandList.id = 'command-results';
    commandList.setAttribute('role', 'listbox');
    commandList.setAttribute('aria-label', '匹配的课程与功能');
    body.append(node('p', '输入即过滤：课程按中文名 / 英文原题匹配，功能按名称匹配。未开放中文的课程不在这里出现——完整结构请进课程目录或世界地图。', 'meta command-note'));
    body.append(commandInput, commandList);
    dialog.append(head, body);
    /* 原生 Esc / backdrop 关闭也走 close 事件：焦点统一在这里归还 */
    dialog.addEventListener('close', () => {
      const target = commandTrigger;
      commandTrigger = null;
      if (target && typeof target.focus === 'function') target.focus();
    });
    return dialog;
  }

  function openCommandDialog(triggerElement) {
    const active = triggerElement || document.activeElement;
    commandTrigger = active && active !== document.body && typeof active.focus === 'function' ? active : null;
    if (!commandDialog) {
      commandDialog = buildCommandDialog();
      document.body.append(commandDialog);
    }
    commandInput.value = '';
    renderCommandResults();
    if (typeof commandDialog.showModal === 'function') {
      if (!commandDialog.open) commandDialog.showModal();
    } else {
      commandDialog.setAttribute('open', '');
    }
    if (commandInput.focus) commandInput.focus();
  }

  function closeCommandDialog() {
    if (!commandDialog) return;
    if (typeof commandDialog.close === 'function') commandDialog.close();
    else commandDialog.open = false;
  }

  /* ---------- v4.5：首页三件事（交接 §1.1/1.2/A1） ----------
   * 1. 我现在在哪   → 继续学习主卡（当前单元 / 第几课 / 状态）；
   * 2. 今天最该做什么 → 今日条（分钟/目标、连续、待复习），整条可点开任务面板；
   * 3. 下一步点哪里  → 主卡 CTA + 3 个主入口卡。
   * 统计全文、任务卡、技能路线、地图、成就墙、热力图、目录 46 行等大块
   * 全部搬进 sheet / 个人中心 / 目录 dialog，首页只留轻摘要与 badge
   * （渐进披露；audit U6：Habitica 把游戏化数值全部收进入口后面，同一思想）。
   * 数据口径零新增：所有数字仍来自 progress.summary / dailyBrief / mapBrief。 */

  let homeContinueCard = null;
  let homeTodayStrip = null;
  let homeEntryGrid = null;
  let homeHeroCompanion = null;

  function refreshHomeCompanion() {
    if (!homeHeroCompanion || !homeHeroCompanion.parentNode) return;
    const replacement = heroCompanionFigure();
    const parent = homeHeroCompanion.parentNode;
    if (replacement) {
      parent.replaceChild(replacement, homeHeroCompanion);
      homeHeroCompanion = replacement;
    } else {
      homeHeroCompanion.remove();
      homeHeroCompanion = null;
    }
  }

  /* ---------- v4.7 视觉气质升级：首页 Hero 场景化构图 ----------
   * Hero = 文字 + 大角色 + 环境背景。v4.5.2 把 lead + continue-card 组合成
   * 英雄区，发布准备轮 A1/A2 修过同心光环与形象占比；本轮告别「圆盘 +
   * 小角色」，改为「角色站在花园场景里」：
   *   - HERO_DECOR_SVG：地面弧线 + 左右植物剪影 + 光斑（角色脚下的场景，
   *     取代旧版同心光环；stage 圆盘底座已在 style.css 同步退役）；
   *   - HERO_SCENE_SVG：Hero 左下角大植物剪影（renderHome 挂载）；
   *   - 窗光柔光带 / 紫晕 / 底部环境丘是 style.css 的渐变环境层（v4.11.14
   *     起环境丘颜色走 --color-ambient 逐主题派生，不再固定绿）。
   * 全部原创几何线稿（不引位图、不用动画库）。v4.11.14 植物去绿：调色板原
   * 延续成长绿双色，但环境色跟随主题后，固定绿只在绿系主题成立（用户实测
   * 「偏绿主题搭、其他主题全部不搭」），故植物主线改用 Hero 道具同款紫灰
   * 体系——浅 #b7a9c8 / 深 #81769a（固定色不接 token，与 HERO_STUDY_SVG
   * 同类处置；五色层次、全部几何 / viewBox / opacity 逐字保留）；光斑点缀
   * 金 #d4af37、紫 #a78bda、陶 #c9714f 保留——与 .home-hero::after 地面带
   * 三枚光斑同族同语言。都是中间调，浅色 / 深色主题下都成立。学习伙伴形象
   * 资产仍来自 companion-view 单一事实源，本区块只是装饰层，不碰 companion
   * 生成逻辑。 */
  const HERO_DECOR_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="440" height="260" viewBox="0 0 440 260"><ellipse cx="220" cy="240" rx="188" ry="14" fill="#b7a9c8" opacity=".13"/><path d="M40 238Q220 208 400 238" fill="none" stroke="#b7a9c8" stroke-width="2" stroke-linecap="round" opacity=".4"/><path d="M92 236C88 206 78 184 60 168" fill="none" stroke="#81769a" stroke-width="2.4" stroke-linecap="round" opacity=".5"/><path d="M60 168C46 156 42 138 50 122 64 132 70 152 60 168Z" fill="#b7a9c8" opacity=".5"/><path d="M84 208C70 200 62 186 64 170 78 176 86 192 84 208Z" fill="#81769a" opacity=".38"/><path d="M92 236C94 214 104 198 120 190 120 206 108 224 92 236Z" fill="#b7a9c8" opacity=".42"/><path d="M56 238C50 222 40 212 26 206" fill="none" stroke="#b7a9c8" stroke-width="2" stroke-linecap="round" opacity=".38"/><path d="M352 236C356 202 368 180 388 164" fill="none" stroke="#81769a" stroke-width="2.4" stroke-linecap="round" opacity=".5"/><path d="M388 164C402 150 404 130 394 114 380 126 376 148 388 164Z" fill="#b7a9c8" opacity=".5"/><path d="M360 204C374 196 382 182 380 166 366 172 358 188 360 204Z" fill="#81769a" opacity=".38"/><path d="M352 236C350 216 340 202 324 194 324 210 336 226 352 236Z" fill="#b7a9c8" opacity=".42"/><path d="M392 238C398 224 408 214 420 208" fill="none" stroke="#b7a9c8" stroke-width="2" stroke-linecap="round" opacity=".38"/><circle cx="118" cy="72" r="3.4" fill="#d4af37" opacity=".55"/><circle cx="330" cy="58" r="2.8" fill="#a78bda" opacity=".5"/><circle cx="64" cy="106" r="2.2" fill="#c9714f" opacity=".45"/><circle cx="384" cy="96" r="2.2" fill="#d4af37" opacity=".45"/><circle cx="206" cy="40" r="2" fill="#b7a9c8" opacity=".5"/><circle cx="264" cy="30" r="2.6" fill="#a78bda" opacity=".4"/></svg>';
  /* Hero 左下角植物剪影：挂在 .home-hero 上（.hero-scene-decor），纯装饰
   * z-index:-1 + pointer-events:none，绝不拦截交互；窄屏（≤30rem）与打印隐藏。 */
  const HERO_SCENE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240"><path d="M8 240C4 196 16 158 44 128 52 152 44 196 26 240Z" fill="#81769a" opacity=".2"/><path d="M34 240C40 186 62 146 100 118 100 150 78 196 52 240Z" fill="#b7a9c8" opacity=".24"/><path d="M66 240C84 198 112 170 150 154 140 182 112 214 86 240Z" fill="#81769a" opacity=".16"/><path d="M104 240C126 214 152 198 184 192 168 212 140 230 120 240Z" fill="#b7a9c8" opacity=".18"/><circle cx="128" cy="92" r="3" fill="#d4af37" opacity=".3"/><circle cx="196" cy="136" r="2.4" fill="#a78bda" opacity=".3"/><circle cx="56" cy="82" r="2.2" fill="#c9714f" opacity=".26"/></svg>';
  /* Hero 右下角学习场景道具层（v4.11 批次 E）：书桌轮廓 + 台灯 + 一小摞书，
   * 挂在 .home-hero 上（.hero-study-decor）。v4.7 起 Hero 已有窗光 / 紫晕 /
   * 植物 / 地面弧线，但角色周围缺少「正在学习」的具体语义——本层补的就是
   * 这件道具叙事，让伙伴从「单独展示的立绘」变成「陪伴学习的场景角色」。
   * 依旧纯装饰：空 alt + pointer-events:none，不遮主文案与 CTA、不进可访问名称、
   * 不拦截指针；窄屏（<56rem）与打印隐藏。层级见 style.css 的 .hero-study-decor
   * （z-index:0，画在 Hero 自身背景层之上、伙伴与主文案之下）。
   * 沿用 v4.7 中间调（成长绿 / 深成长绿 / 金 / 陶 / 浅紫），全部原创低饱和
   * 几何线稿——零位图、零外链、零脚本、零动画、零交互，不碰 companion 资产。
   *
   * v4.11 批次 F 补丁（辨识度）：批次 E 的原始 alpha 让整层几乎不可见——把 SVG
   * 栅格化后测像素，9695 个非透明像素里 5393 个（56%）的 alpha 只有 .15–.25，
   * 逐元素算 WCAG 对比度只有 1.11:1–1.65:1（文本/图形可辨阈值是 3:1）。根因不是
   * 位置也不是被伙伴挡住（实测伙伴立绘 ink 只压住台灯顶部 5px），而是**调色板
   * 在浅色底上的对比度上限**：金 #d4af37 即使全不透明也只有 1.98:1、浅紫 #a78bda
   * 上限 2.69:1，靠加 alpha 永远救不回来。所以本轮改的是**分工**而不是整体加浓：
   *   · 结构骨架（桌面沿 / 桌腿 / 台灯罩轮廓 / 三个书脊轮廓）用成长绿 #3f7b58
   *     —— 它是五色里唯一在明暗两端都随 alpha 单调变好的颜色（浅底 .84→~3.0:1，
   *     深底 .84→~2.6:1），靠它把「书桌 / 台灯 / 一摞书」三个形状读出来；
   *   · 金 / 浅紫 / 陶 退为**填充与点缀**（≤ .78），保留原有色相与低饱和气质，
   *     不再承担「必须被认出来」的职责。
   * 逐元素 alpha 上限 .84（不到实色），元素种类、坐标、viewBox 与五色调色板
   * 一律未动；对比度下限由 tests/hero-scene.test.cjs 第 10 组按 WCAG 公式钉住。 */
  const HERO_STUDY_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="420" height="130" viewBox="0 0 420 130"><ellipse cx="62" cy="56" rx="42" ry="16" fill="#b7a9c8" opacity=".2"/><rect x="14" y="60" width="392" height="8" rx="4" fill="#b7a9c8" opacity=".42"/><path d="M14 60H406" fill="none" stroke="#81769a" stroke-width="3.2" stroke-linecap="round" opacity=".84"/><path d="M48 68V126" fill="none" stroke="#81769a" stroke-width="4.6" stroke-linecap="round" opacity=".74"/><path d="M372 68V126" fill="none" stroke="#81769a" stroke-width="4.6" stroke-linecap="round" opacity=".74"/><path d="M62 18L104 50H20L62 18Z" fill="#c7bdd6" fill-opacity=".5" stroke="#81769a" stroke-opacity=".84" stroke-width="2.2" stroke-linejoin="round"/><path d="M28 50H96" fill="none" stroke="#81769a" stroke-width="2.4" stroke-linecap="round" opacity=".7"/><path d="M62 50V60" fill="none" stroke="#8b7b8f" stroke-width="3.4" stroke-linecap="round" opacity=".78"/><ellipse cx="62" cy="60" rx="16" ry="3.5" fill="#8b7b8f" fill-opacity=".55" stroke="#81769a" stroke-opacity=".7" stroke-width="1.6"/><rect x="256" y="48" width="104" height="12" rx="3" fill="#81769a" fill-opacity=".5" stroke="#81769a" stroke-opacity=".84" stroke-width="1.8"/><rect x="264" y="36" width="88" height="12" rx="3" fill="#b9afd0" fill-opacity=".55" stroke="#81769a" stroke-opacity=".84" stroke-width="1.8"/><rect x="274" y="23" width="70" height="13" rx="3" fill="#8b7b8f" fill-opacity=".55" stroke="#81769a" stroke-opacity=".84" stroke-width="1.8"/><path d="M306 23V17" fill="none" stroke="#81769a" stroke-width="2.8" stroke-linecap="round" opacity=".78"/><circle cx="196" cy="32" r="2.8" fill="#81769a" opacity=".55"/></svg>';;

  function heroCompanionFigure() {
    if (!progress) return null;
    const cosmetics = progress.cosmetics();
    const companion = resolveCompanion(cosmetics.companionId);
    const portrait = companionPortraitImage(companion, { slot: 'hero', mood: 'happy' }, 'hero-companion-img', '');
    if (!portrait) return null;
    const figure = node('div', undefined, 'hero-companion');
    figure.setAttribute('aria-hidden', 'true'); /* 形象在 header 触发按钮与伙伴面板已有具名入口，这里纯陪伴装饰 */
    figure.append(svgImage(HERO_DECOR_SVG, '', 'hero-decor'));
    const stage = node('div', undefined, 'hero-companion-stage');
    stage.append(portrait);
    figure.append(stage);
    /* v4.9：Hero **不再渲染角色名**（原来这里是「昵称 · 成长阶段」，老档案下
     * 会显示成「芽芽 · 幼苗」）。用户要求主页只出头像 / 立绘，名字只在点开的
     * 助手面板里出现。figure 本身已 aria-hidden="true"（纯装饰），去掉名字后
     * 语义不变：角色仍有 header 按钮与伙伴面板两处具名入口。 */
    return figure;
  }

  /* 在目录里找一课的 entry 与所属 group（hero 卡的“当前单元 · 第 X / 46 课”）。 */
  function catalogEntryOf(slug) {
    const source = effectiveCatalog();
    const entry = source.lessons.find(item => item.slug === slug);
    if (!entry) return null;
    const group = source.groups.find(item => item.id === entry.group);
    return { entry, group };
  }

  function continueCardChildren() {
    const summary = progress.summary();
    const next = findLesson(summary.continueLessonId);
    const total = catalogTotal();
    const children = [];
    const actions = node('div', undefined, 'continue-actions');
    /* 第三轮：Hero 次级入口由「课程目录」改为「查看全部 World」——World 信息
     * 从 Hero 下沉到世界地图；目录入口仍保留在 header 按钮、学习进度 sheet
     * 与命令面板，Hero 不再重复摆放。 */
    const worldsButton = node('button', '查看全部 World →', 'button-secondary continue-worlds');
    worldsButton.type = 'button';
    worldsButton.addEventListener('click', () => openMapSheet('world', worldsButton));
    if (next) {
      const located = catalogEntryOf(next.id);
      const state = progress.lessonState(next.id);
      const learningStatus = state.started || state.completed ? '已开始' : '开始之前';
      const eyebrow = located
        ? `${String(located.entry.order).padStart(2, '0')} / ${total || data.lessons.length} · ${learningStatus}`
        : learningStatus;
      /* v4.11.11 首页信息层级收口：区块标签由「继续学习」改为「当前继续学习」——
       * 原文案与下方主 CTA「继续学习 →」完全同词，区块标签和动作按钮互相抢读；
       * 改名后标签只指认区块（回答「我现在学到哪里」），CTA 是唯一的动作表述。
       * 只改这一处标签文字：CTA 文案、数据口径、DOM 结构与点击路径一字不动。 */
      children.push(node('p', '当前继续学习', 'continue-label'));
      children.push(node('p', eyebrow, 'continue-eyebrow'));
      children.push(node('h2', next.zh, 'continue-title'));
      children.push(node('p', next.title, 'english continue-en'));
      if (state.started || state.completed) {
        children.push(node('p', `已学习 ${progress.formatSeconds(state.activeSeconds)}`, 'continue-status'));
      }
      actions.append(link(`${state.started || state.completed ? '继续学习' : '开始学习'} →`, lessonHref(next), 'button continue-primary'));
    } else {
      children.push(node('p', 'Foundations · 本站已开放课程全部完成', 'continue-eyebrow'));
      children.push(node('h2', `已开放的 ${summary.totalLessons} 课全部学完了`, 'continue-title'));
      /* v4.11.16：第 20 课（Project: Recipes）开放后，旧文案「下一站是 Project:
       * Recipes——回官方原课自己动手完成」失实；改为从 catalog.js 动态取下一个
       * 未开放课程，后续扩课不再需要改这段。 */
      const nextLocked = catalog && Array.isArray(catalog.lessons) ? catalog.lessons.find(entry => !entry.available) : null;
      children.push(node('p', nextLocked
        ? `下一课《${nextLocked.zh}》尚未开放中文正文——可以回 TOP 官方原课继续学习，或在完整目录与世界地图里查看路线位置。`
        : '之后的课程可以在完整目录与世界地图里查看路线位置。', 'continue-status'));
    }
    actions.append(worldsButton);
    children.push(actions);
    return children;
  }

  function todayStripChildren() {
    const summary = progress.summary();
    const brief = progress.dailyBrief();
    const children = [];
    if (brief) {
      const timePart = node('span', undefined, 'today-item');
      timePart.append(
        node('span', '今日 ', 'today-label'),
        node('strong', brief.todayText),
        node('span', brief.goalDone ? ` / ${brief.goalMinutes} 分钟 · 已达成` : ` / 目标 ${brief.goalMinutes} 分钟`, 'meta')
      );
      children.push(timePart);
      const miniBar = node('span', undefined, 'today-mini-progress');
      const miniFill = node('span', undefined, `today-mini-fill${brief.goalDone ? ' is-done' : ''}`);
      miniFill.style.width = `${brief.goalProgress}%`;
      miniBar.append(miniFill);
      miniBar.setAttribute('aria-hidden', 'true');
      children.push(miniBar);
    } else {
      children.push(node('span', `今日 ${progress.formatSeconds(summary.todaySeconds)}`, 'today-item'));
    }
    children.push(node('span', `连续 ${summary.streak} 天`, 'today-item'));
    const due = summary.reviewDueToday || 0;
    const reviewPart = node('span', due > 0 ? '今日待复习 ' + due + ' 课' : '今日无待复习', `today-item${due > 0 ? ' is-due' : ''}`);
    children.push(reviewPart);
    children.push(node('span', '详情 →', 'today-more meta'));
    return children;
  }

  /* 3 个主入口卡：学习进度 / 今日计划 / 学习地图，均打开对应 sheet。 */
  function entryGridChildren() {
    const summary = progress.summary();
    const total = catalogTotal();
    const brief = progress.dailyBrief();
    const due = summary.reviewDueToday || 0;
    const located = summary.continueLessonId ? catalogEntryOf(summary.continueLessonId) : null;
    const mapBriefData = mapModule ? mapModule.mapBrief(progress.getState(), effectiveCatalog(), data.lessons, summary.continueLessonId) : null;
    /* v4.5（交接 B）：首页主入口 6 → 3。首页只回答三件事——
     *   我在哪（学习进度）/ 今天做什么（今日计划）/ 下一步去哪（学习地图）。
     * 技能路线、世界地图、Foundations 探索全部收进「学习地图」的内部 Tab；
     * 收藏与成就、学习统计不再是首页独立卡，归个人中心（命令面板仍可直达）。
     * 刻意不把删掉的卡换成别的大块组件填回来（交接 B 红线）。 */
    const entries = [
      {
        sheet: 'progress',
        zh: '学习进度',
        desc: '总进度、学习时长、复习与档案导出导入',
        badge: total ? `${summary.completedCount} / ${total} 课` : `${summary.completedCount} / ${summary.totalLessons} 课`,
        icon: 'progress'
      },
      {
        sheet: 'tasks',
        zh: '今日计划',
        desc: '今日目标、每日 / 每周 / 月挑战、到期复习与今日摘要',
        badge: due > 0 ? `${due} 待复习` : brief && brief.goalDone ? '今日目标已达成' : '进行中',
        badgeTone: due > 0 ? 'warn' : brief && brief.goalDone ? 'good' : '',
        icon: 'tasks'
      },
      {
        sheet: 'map',
        zh: '学习地图',
        desc: '技能路线 · 世界地图 · Foundations 探索与 Boss',
        badge: located && located.group
          ? located.group.zh
          : mapBriefData ? `${mapBriefData.openNodes} / ${mapBriefData.totalNodes} 节点` : '8 个单元',
        icon: 'world'
      }
    ];
    return entries.map(item => {
      const card = node('button', undefined, 'entry-card');
      card.type = 'button';
      card.setAttribute('aria-haspopup', 'dialog');
      const iconMarkup = icons && icons.entryIcons ? icons.entryIcons[item.icon] : null;
      if (iconMarkup) card.append(maskIcon(iconMarkup, 'entry-icon'));
      const text = node('span', undefined, 'entry-text');
      text.append(node('span', item.zh, 'entry-title'));
      text.append(node('span', item.desc, 'entry-desc'));
      card.append(text);
      if (item.badge) card.append(node('span', item.badge, `entry-badge${item.badgeTone ? ` is-${item.badgeTone}` : ''}`));
      card.setAttribute('aria-label', `${item.zh}：${item.desc}（${item.badge || '查看详情'}）`);
      card.addEventListener('click', () => {
        if (item.sheet) openSheet(item.sheet, card);
        else openProfilePanel(item.profileTab, card);
      });
      return card;
    });
  }

  function buildContinueCard() {
    homeContinueCard = node('section', undefined, 'continue-card');
    homeContinueCard.append(...continueCardChildren());
    return homeContinueCard;
  }

  /* 今日条整条是一个大按钮：手机上最容易点中，且不依赖 hover（交接红线 9）。 */
  function buildTodayStrip() {
    homeTodayStrip = node('button', undefined, 'today-strip');
    homeTodayStrip.type = 'button';
    homeTodayStrip.setAttribute('aria-haspopup', 'dialog');
    homeTodayStrip.append(...todayStripChildren());
    const labelStrip = () => {
      const summary = progress.summary();
      const brief = progress.dailyBrief();
      homeTodayStrip.setAttribute('aria-label', `今日学习摘要：${brief ? brief.todayText : progress.formatSeconds(summary.todaySeconds)}，连续 ${summary.streak} 天，今日待复习 ${summary.reviewDueToday || 0} 课。打开今日计划详情`);
    };
    labelStrip();
    homeTodayStrip.addEventListener('click', () => openSheet('tasks', homeTodayStrip));
    homeTodayStrip._relabel = labelStrip;
    return homeTodayStrip;
  }

  function buildEntryGrid() {
    const wrap = node('nav', undefined, 'entry-grid-wrap');
    wrap.setAttribute('aria-label', '功能入口');
    homeEntryGrid = node('div', undefined, 'entry-grid');
    homeEntryGrid.append(...entryGridChildren());
    wrap.append(homeEntryGrid);
    return wrap;
  }

  /* ---------- 二级 sheet 的 body builders（数据与原 Dashboard 同源） ---------- */

  function progressSheetChildren() {
    const summary = progress.summary();
    const total = catalogTotal();
    const children = [];
    if (!progress.isPersistent()) children.push(node('p', FILE_MODE_NOTE, 'notice'));
    const storageWarning = storageWarningText();
    if (storageWarning) children.push(node('p', storageWarning, 'notice'));

    const grid = node('div', undefined, 'stat-grid');
    grid.append(
      statCell('等级', `Lv.${summary.level}`, `距下一级还需 ${summary.xpToNext} XP`),
      /* v4.5（交接 Core E1）：非线性曲线下每级跨度不同，分母用「本级总跨度」
       * （= 已得 + 距下一级），不再钉死 100。 */
      statCell('XP', String(summary.xp), `本级已得 ${summary.xpIntoLevel} / ${summary.xpIntoLevel + summary.xpToNext}`)
    );
    /* §6.4：总进度 46 / 已开放 19 / 已完成开放课程 X，三个数字由 progressCells 统一给出 */
    progressCells(summary).forEach(cell => grid.append(cell));
    liveStatToday = statCell('今日有效学习', progress.formatSeconds(summary.todaySeconds), '当日累计');
    liveStatTotal = statCell('累计有效学习', progress.formatSeconds(summary.totalSeconds), '全部课程');
    grid.append(liveStatToday, liveStatTotal);
    grid.append(
      statCell('连续学习', `${summary.streak} 天`, '每天至少 10 分钟'),
      statCell('需要复习', `${summary.needsReviewCount} 课`, '你自己标记的'),
      statCell('今日建议复习', `${summary.reviewDueToday || 0} 课`, '按 1/3/7/30 天阶梯到期，逾期不惩罚'),
      statCell('官方任务', `${summary.officialCompletedCount} / ${summary.totalLessons}`, '你标记已完成的课数'),
      statCell('本站自测', `${summary.quizCompletedCount} / ${summary.totalLessons}`, '你标记已完成的课数')
    );
    children.push(grid);

    const row = node('div', undefined, 'dashboard-row');
    const recent = findLesson(summary.recentLessonId);
    const next = findLesson(summary.continueLessonId);
    if (recent) row.append(node('p', `最近学习：${recent.zh}（${recent.title}）`, 'meta'));
    if (next) row.append(link(`继续学习：${next.zh} →`, lessonHref(next), 'button'));
    /* v4.5（交接 B）：课程目录归「学习进度」入口——打开完整 46 课目录 dialog
     * （与 header、hero 主卡同一 openCatalogDialog，同一份实现）。 */
    const catalogJump = node('button', '课程目录', 'button-secondary');
    catalogJump.type = 'button';
    catalogJump.addEventListener('click', () => openCatalogDialog(catalogJump));
    row.append(catalogJump);
    children.push(row);

    /* 档案导出导入放在进度 sheet（数据管理一步可达）；备份 / 重置等完整
     * 数据管理仍在个人中心「设置」Tab，两边共用 buildArchiveControls。 */
    children.push(node('h3', '学习档案'));
    children.push(node('p', '档案是一份 JSON 文件，只存在这台设备上。换设备或换浏览器时用导出与导入手工搬运。备份与恢复在个人中心 → 设置里。', 'muted'));
    buildArchiveControls().forEach(part => children.push(part));
    children.push(node('p', dataLocationText(), 'meta'));
    children.push(node('p', '有效学习时长只在页面可见且你近期有操作时累计：约 2 分钟无操作会自动暂停，回来继续操作就接着计。把页面挂在后台不会累积时长。', 'meta'));
    return children;
  }

  function tasksSheetChildren() {
    const children = [];
    const dailyCard = buildDailyCard();
    if (dailyCard) children.push(dailyCard);
    /* v4.3 Batch 10（Stretch N14）：当前章节卡——今天学到哪儿了，一眼看清 */
    const currentUnitCard = buildCurrentUnitCard();
    if (currentUnitCard) children.push(currentUnitCard);
    /* v4.3（交接 G）：复习安排卡——今天有 N 课建议复习（没有安排时不出现） */
    const reviewCard = buildReviewCard();
    if (reviewCard) children.push(reviewCard);
    const weeklyCard = buildWeeklyCard();
    if (weeklyCard) children.push(weeklyCard);
    /* v4.3（交接 D2）：挑战卡放在今日/本周之后——它是“下一步做什么”的
     * 轻量建议，不抢学习数据的主体位置。 */
    const challengeCard = buildChallengeCard();
    if (challengeCard) children.push(challengeCard);
    if (!children.length) children.push(node('p', '任务数据暂不可用（daily / challenges 模块未载入）。', 'muted'));
    return children;
  }

  /* sheet 注册：renderHome 时执行一次。学习地图三个 Tab 的 body 直接复用既有
   * buildSkillTree / worldListChildren / buildMapSection——同一份实现，只是换了住处。 */
  /* ---------- v4.4（交接 Core F）：世界地图——官方全路线总览 ----------
   * 双层视图（交接 F4：不要把 100+ 节平铺首页/首屏）：
   *   World 列表 → 8 张 World 卡（总节点 / 已开放中文 / 完成数）；
   *   World 内部 → Foundations 嵌既有五阶节点地图；其余 7 个 World 是
   *   **结构占位**：官方 section / lesson 名称与顺序（curriculum.js 快照），
   *   明确「尚未开放中文内容」。
   * 红线（F3）：占位课不生成任何 lesson.html 链接、不伪装已完成、
   * 不计入「本站已完成中文课程」统计（progress 的完成口径只认 lessons.js
   * 的 20 课，curriculum 数据根本不进 progress）。 */
  let worldView = null; /* null = World 列表；course id = 该 World 内部 */
  /* v4.5（交接 B）：学习地图统一入口的内部 Tab 状态——首页 6 卡收口成 3 卡后，
   * 技能路线 / 世界地图 / Foundations 探索（节点 + Boss）住进同一个 sheet。 */
  let mapView = 'skill';
  /* 命令面板等外部入口的预设 Tab：sheet 的 onOpen 消费一次后清空，
   * 与 v4.4「二级视图不跨会话残留」同一语义。 */
  let mapPendingView = null;

  const MAP_TABS = [['skill', '技能路线'], ['world', '世界地图'], ['found', 'Foundations 探索']];

  function curriculumTotalLessons() {
    if (!curriculum) return 0;
    return curriculum.courses.reduce((sum, course) => sum + course.totalLessons, 0);
  }

  /* v4.11 G2a：8 张 World 卡的**纯展示**色相钩子（写进 data-world-tone，
   * style.css 的 G2a 段据此给卡片加一层低饱和环境暗示）。
   *
   * 为什么要有这张表：.world-card 上没有任何 per-World 的表现层钩子（只有
   * is-open / is-locked 两个状态类），只靠 CSS 的 :nth-child 去猜顺序，一旦
   * 卡片增删或顺序变动就会**无声错配**——把绿色的山谷画到 NodeJS 卡上。
   * 键用 `course.order`（稳定业务事实），不按中文名匹配、不复制课程名称 /
   * 数量 / 进度，也**不参与**开放判定、aria-label 与点击行为。
   *
   * ⚠️ 映射以 curriculum.js 的**真实**顺序为准（G2a 规划交接的 §六 语义表把
   * Node.js 写在 World 4，与本地数据不符：真实 World 4 是 advanced-html-and-css
   * 「高级 HTML 与 CSS」，NodeJS 在 World 7）。已由用户 2026-09-18 确认按真实
   * 数据绑定，避免把「高级 HTML 与 CSS」画成网络服务。前四个 tone 的名字与
   * 批次 F 首页路线预览条 PREVIEW_STAGES 共用同一套词汇（同一个 World 在首页
   * 预览条与地图卡上是同一色相）。
   *
   * 缺表项时（例如日后官方路线扩到第 9 个 World）不设钩子——CSS 没有对应选择器，
   * 卡片自然退回无装饰的原样，不会画错色，也不会报错。 */
  const WORLD_CARD_TONES = {
    1: 'foundations',      /* Foundations 前端基础——成长绿 / 山谷弧线（唯一开放，最强一档） */
    2: 'html-css',         /* 中级 HTML 与 CSS——冷蓝 / 结构网格 */
    3: 'javascript',       /* JavaScript——暖橙 / 节点连接 */
    4: 'html-css-deep',    /* 高级 HTML 与 CSS——冷蓝深化 + 更密结构线（与 World 2 同族但不重样） */
    5: 'world-generic-a',  /* React——后续世界弱化层 */
    6: 'world-generic-b',  /* 数据库——后续世界弱化层 */
    7: 'nodejs',           /* NodeJS——青绿 / 网络服务连接（未开放，仍走弱化档） */
    8: 'world-generic-c'   /* 求职之路——后续世界弱化层 */
  };
  /* v4.11 的 World 1 单卡场景图原型已于 2026-09-18 **定向撤回**：真实页面比较后，
   * 用户判定图片接入与既有 World 卡结构不协调，不采用。图片资产与挂载代码一并移除，
   * 上一段（G2a）的纯 CSS/SVG 场景层原样保留——这里不留任何残留钩子。
   * 撤回原因、证据与“不是视觉事故”的口径见 MAINTENANCE.md「废弃功能与旧方案库」。
   * 本注释刻意不写出已删除的标识符与资产路径：产品源码里不留它们的字面量。 */

  function worldListChildren() {
    const summary = progress.summary();
    const children = [];
    children.push(node('p', `官方 Full Stack JavaScript 路线共 ${curriculum.courses.length} 个 World（Foundations 是前置 World，其后 7 个按官方顺序），合计 ${curriculumTotalLessons()} 课。本站目前只开放 World 1 Foundations 前 ${summary.totalLessons} 课的中文正文；其余 World 展示官方结构占位（课程名与顺序），明确「尚未开放中文内容」，不计入本站完成统计。`, 'muted'));
    children.push(node('p', `结构快照 ${curriculum.snapshotAt} · 来源 theodinproject.com 官方课程页（curriculum.js 可维护刷新）`, 'meta'));
    const list = node('ul', undefined, 'world-list');
    curriculum.courses.forEach(course => {
      const open = Boolean(course.lessonsInCatalog);
      const card = node('button', undefined, `world-card${open ? ' is-open' : ' is-locked'}`);
      card.type = 'button';
      /* G2a：纯展示色相钩子（见 WORLD_CARD_TONES 注释）——只回答「这张卡画什么
       * 环境」，不改状态、不改 aria-label、不改点击行为。 */
      if (WORLD_CARD_TONES[course.order]) card.dataset.worldTone = WORLD_CARD_TONES[course.order];
      const head = node('span', undefined, 'world-head');
      head.append(node('span', `World ${course.order}`, 'world-order'));
      head.append(node('span', course.zh, 'world-zh'));
      head.append(node('span', course.en, 'world-en meta'));
      card.append(head);
      const stats = node('span', undefined, 'world-stats meta');
      if (open) {
        /* 第三轮：「前 N 课已有中文学习内容」的覆盖说明从首页 Hero 下沉到
         * 对应 World 卡片（当前仅 World 1 开放，N = 已开放课数）。 */
        stats.textContent = `${course.totalLessons} 课 · 前 ${summary.totalLessons} 课已有中文学习内容 · 你已完成 ${summary.completedCount}`;
      } else {
        const sections = Array.isArray(course.sections) ? course.sections.length : 0;
        stats.textContent = `${course.totalLessons} 课 · ${sections} 个章节 · 尚未开放中文内容`;
      }
      card.append(stats);
      /* Stretch I5：开放 World 的完成度视觉——细进度条复用今日条的
       * mini 进度条样式（同一视觉语法），数字口径就是 stats 行那一句
       * （completedCount / 已开放课数），装饰性 aria-hidden，读屏已有文本 */
      if (open && summary.totalLessons > 0) {
        const pct = Math.min(100, Math.round((summary.completedCount / summary.totalLessons) * 100));
        const mini = node('span', undefined, 'today-mini-progress world-mini-progress');
        const fill = node('span', undefined, `today-mini-fill${pct >= 100 ? ' is-done' : ''}`);
        fill.style.width = `${pct}%`;
        mini.append(fill);
        mini.setAttribute('aria-hidden', 'true');
        card.append(mini);
      }
      const hint = node('span', open ? '进入探索地图 →' : '查看官方结构 →', 'world-hint meta');
      card.append(hint);
      card.setAttribute('aria-label', `World ${course.order} ${course.zh}（${course.en}）：${stats.textContent}。${open ? '进入 Foundations 探索地图' : '查看官方课程结构占位'}`);
      card.addEventListener('click', () => {
        worldView = course.id;
        refreshSheetById('map');
      });
      list.append(card);
    });
    children.push(list);
    return children;
  }

  /* 单个 World 内部。Foundations 走既有地图；其余 World 渲染结构占位清单。 */
  function worldDetailChildren(courseId) {
    const course = curriculum.courses.find(item => item.id === courseId);
    if (!course) {
      worldView = null;
      return worldListChildren();
    }
    const children = [];
    const back = node('button', '← 返回 World 列表', 'button-secondary world-back');
    back.type = 'button';
    back.addEventListener('click', () => {
      worldView = null;
      refreshSheetById('map');
    });
    children.push(back);
    if (course.lessonsInCatalog) {
      const mapSection = buildMapSection();
      if (mapSection) children.push(mapSection);
      else children.push(node('p', 'Foundations 地图数据未载入（map.js 缺失）。', 'muted'));
      return children;
    }
    /* 未开放 World：结构占位（F3 红线——无链接、无伪装、明确未开放） */
    children.push(node('h3', `World ${course.order} · ${course.zh}`));
    children.push(node('p', `${course.en} · 官方共 ${course.totalLessons} 课。本站尚未开放这个 World 的中文内容：下面是官方课程结构占位（快照 ${curriculum.snapshotAt}），课程名保留英文原题；学习内容请去官方原课，本站不提供这些课程的正文或项目答案。`, 'notice'));
    children.push(link('在官方打开这门课程 ↗', course.url, 'button-secondary', true));
    (course.sections || []).forEach(sec => {
      const secBlock = node('div', undefined, 'world-section');
      const head = node('div', undefined, 'world-section-head');
      head.append(node('h4', sec.zh), node('span', sec.en, 'meta english'));
      head.append(node('span', `${sec.lessons.length} 课`, 'meta world-section-count'));
      secBlock.append(head);
      const lessonList = node('ol', undefined, 'world-lesson-list');
      sec.lessons.forEach(lesson => {
        /* 刻意用 div/span 而不是 <a>：结构上不存在进入本站正文的路径（F3） */
        const row = node('li', undefined, 'world-lesson');
        row.append(node('span', lesson.title, 'world-lesson-title'));
        if (lesson.type === 'project') row.append(node('span', '项目', 'lesson-type'));
        row.append(node('span', '尚未开放中文内容', 'world-lesson-flag meta'));
        lessonList.append(row);
      });
      secBlock.append(lessonList);
      children.push(secBlock);
    });
    return children;
  }

  /* v4.5（交接 B）：学习地图 sheet——顶部三个内部 Tab，内容全部复用既有
   * 单一实现（buildSkillTree / worldListChildren / buildMapSection），
   * 不复制任何地图渲染逻辑。 */
  function mapTabChildren(view) {
    if (view === 'world') {
      if (!curriculum || !Array.isArray(curriculum.courses) || !curriculum.courses.length) {
        /* curriculum.js 缺失的降级：World Tab 退回只显示 Foundations 地图（v4.3 行为） */
        const fallback = [node('p', '官方全路线结构快照未载入（curriculum.js 缺失），下面是 Foundations 探索地图。', 'notice')];
        const mapSection = buildMapSection();
        if (mapSection) fallback.push(mapSection);
        return fallback;
      }
      return worldView ? worldDetailChildren(worldView) : worldListChildren();
    }
    if (view === 'found') {
      const mapSection = buildMapSection();
      return mapSection ? [mapSection] : [node('p', '地图数据未载入（map.js 缺失）。', 'muted')];
    }
    const tree = buildSkillTree();
    return tree ? [tree] : [node('p', '技能路线数据未载入。', 'muted')];
  }

  function mapSheetChildren() {
    const children = [];
    const tabs = node('div', undefined, 'map-tabs');
    tabs.setAttribute('role', 'group');
    tabs.setAttribute('aria-label', '学习地图视图切换');
    MAP_TABS.forEach(pair => {
      const active = mapView === pair[0];
      const btn = node('button', pair[1], `map-tab${active ? ' is-active' : ''}`);
      btn.type = 'button';
      btn.setAttribute('aria-pressed', String(active));
      btn.addEventListener('click', () => {
        if (mapView === pair[0]) return;
        mapView = pair[0];
        worldView = null; /* 回到 World Tab 时从列表层开始（v4.4 语义不变） */
        refreshSheetById('map');
      });
      tabs.append(btn);
    });
    children.push(tabs);
    mapTabChildren(mapView).forEach(child => children.push(child));
    return children;
  }

  function openMapSheet(view, triggerElement) {
    mapPendingView = view || null;
    openSheet('map', triggerElement);
  }

  /* 打开中的指定 sheet 重建 body（Boss 挑战后地图节点状态、World/Tab 视图切换用） */
  function refreshSheetById(id) {
    const entry = sheetRegistry[id];
    if (entry && entry.dialog && entry.body && isSheetOpen(id)) {
      entry.body.replaceChildren(...entry.bodyBuilder());
    }
  }

  function registerHomeSheets() {
    registerSheet('progress', '学习进度', progressSheetChildren);
    /* v4.5（交接 B）：「任务与挑战」更名「今日计划」——首页第二入口回答
     * “今天做什么”：今日目标 / 每日每周月挑战 / 到期复习 / 今日行为摘要。
     * sheet id 保持 tasks（内部标识不进档案，无数据兼容问题）。 */
    registerSheet('tasks', '今日计划', tasksSheetChildren);
    /* v4.5（交接 B）：技能路线 / 世界地图 / Foundations 探索合并为「学习地图」
     * 统一入口；每次打开回到预设或默认 Tab，不残留上次的 World 内部视图。 */
    registerSheet('map', '学习地图', mapSheetChildren, () => {
      mapView = mapPendingView || 'skill';
      mapPendingView = null;
      worldView = null;
    });
  }

  /* refreshDashboard 保持原函数名（refreshAll / watchStorage / pageshow 链路
   * 全部经过它），语义升级为：刷新首页轻视图 + 所有打开中的 sheet。 */
  function refreshDashboard() {
    if (!progress) return;
    if (homeContinueCard) homeContinueCard.replaceChildren(...continueCardChildren());
    if (homeTodayStrip) {
      homeTodayStrip.replaceChildren(...todayStripChildren());
      if (homeTodayStrip._relabel) homeTodayStrip._relabel();
    }
    if (homeEntryGrid) homeEntryGrid.replaceChildren(...entryGridChildren());
    refreshOpenSheets();
  }

  /* 每课的完成状态全部由用户主动勾选；打开页面、点外链或展开答案都不会自动判完成。 */
  function buildLessonProgress(lesson) {
    const persistent = progress.isPersistent();
    const fieldset = node('fieldset', undefined, 'lesson-progress');
    fieldset.append(node('legend', '我的学习进度'));
    if (!persistent) fieldset.append(node('p', FILE_MODE_NOTE, 'notice'));
    fieldset.append(node('p', '以下四项都由你自己勾选：打开页面、点击外链或展开参考答案都不会自动判定完成。只有第一项「本课已完成」计入课程完成数量与首页总进度，其余三项是独立的学习记录，不会让完成数 +1。', 'meta'));

    const stored = progress.lessonState(lesson.id);
    const statLine = node('p', undefined, 'progress-stat');
    const storageWarning = storageWarningText();
    if (storageWarning) fieldset.append(node('p', storageWarning, 'notice'));
    const toggles = [
      { field: 'completed', label: '本课已完成（计入课程完成数与总进度）', xp: `首次勾选 +${progress.Logic.XP_FIRST_LESSON_COMPLETE} XP` },
      { field: 'officialCompleted', label: '官方任务已完成（Assignment，不计入完成数）', xp: `首次勾选 +${progress.Logic.XP_FIRST_OFFICIAL_COMPLETE} XP` },
      { field: 'quizCompleted', label: '本站自测已完成（不计入完成数）', xp: `首次勾选 +${progress.Logic.XP_FIRST_QUIZ_COMPLETE} XP` },
      { field: 'needsReview', label: '需要复习（不计入完成数）', xp: '稍后回来再看这一课' }
    ];
    const updateStat = () => {
      const current = progress.lessonState(lesson.id);
      const stateText = current.completed ? '已完成' : current.started ? '学习中' : '未开始';
      statLine.textContent = `本课状态：${stateText} · 本课有效学习时长：${progress.formatSeconds(current.activeSeconds)} · 标记完成的时间：${current.completedAt ? String(current.completedAt).slice(0, 10) : '—'}`;
    };
    /* v4.3（交接 G）：本课复习安排——勾选「需要复习」后显示 1/3/7/30 阶梯的
     * 当前位置、下次复习日期与累计次数，并给「完成复习 / 仍不熟」两个动作。
     * 逾期不惩罚：到期日只是建议，文案不催促、不扣分。 */
    const reviewLine = node('p', undefined, 'review-schedule meta');
    const reviewActions = node('div', undefined, 'review-schedule-actions');
    const updateReviewBlock = () => {
      const schedule = progress.reviewSchedule ? progress.reviewSchedule(lesson.id) : null;
      const current = progress.lessonState(lesson.id);
      reviewActions.replaceChildren();
      if (!schedule || (!schedule.everMarked && !current.needsReview)) {
        reviewLine.textContent = '复习安排：勾选下面的「需要复习」后，这一课会按 1 / 3 / 7 / 30 天的阶梯提醒你回来复习；逾期不扣分。';
        return;
      }
      const intervals = progress.reviewIntervalDays ? progress.reviewIntervalDays() : [1, 3, 7, 30];
      const stage = schedule.dueDay
        ? `下一轮间隔 ${intervals[schedule.intervalIndex]} 天，建议复习日 ${schedule.dueDay}`
        : '本轮复习已结束（阶梯走完或已清除标记）';
      reviewLine.textContent = `复习安排：已完成 ${schedule.doneCount} 次复习 · ${stage}。`;
      if (schedule.dueDay && persistent) {
        const doneButton = node('button', '完成复习', 'button-secondary');
        doneButton.type = 'button';
        doneButton.addEventListener('click', () => {
          progress.completeReview(lesson.id);
          updateStat();
          updateReviewBlock();
          toggles.forEach(toggle => { toggle.box.checked = Boolean(progress.lessonState(lesson.id)[toggle.field]); });
        });
        const weakButton = node('button', '仍不熟', 'button-secondary');
        weakButton.type = 'button';
        weakButton.addEventListener('click', () => {
          progress.markStillWeak(lesson.id);
          updateReviewBlock();
        });
        reviewActions.append(doneButton, weakButton);
      }
    };
    toggles.forEach(toggle => {
      const label = node('label', undefined, 'progress-toggle');
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = Boolean(stored[toggle.field]);
      box.disabled = !persistent;
      box.addEventListener('change', () => {
        const setter = {
          completed: progress.setCompleted,
          officialCompleted: progress.setOfficialCompleted,
          quizCompleted: progress.setQuizCompleted,
          needsReview: progress.setNeedsReview
        }[toggle.field];
        setter(box.checked);
        updateStat();
        /* v4.3：复习勾选联动复习安排的显示（阶梯位置 / 动作按钮） */
        if (toggle.field === 'needsReview') updateReviewBlock();
        /* v4.11.3 C2（完课时）：大课完成的强化反馈——比普通课多一条低干扰
         * 提示（底部静态小条，走 showAchievementNotes 同一开关）+ 伙伴庆祝
         * 动画窗口（startCelebration，6 秒内存态，与升级 / 晋升同一通道）。
         * 不弹窗、不新增 details、不轰炸；普通课路径零变化。取消勾选不发。 */
        if (toggle.field === 'completed' && box.checked && persistent
            && progress.Logic.isHeavyLesson(lesson)) {
          showRewardNote(`大课拿下 · 《${lesson.zh}》全 ${lesson.sections.length} 章讲解都走完了，这一门的分量实打实。`);
          startCelebration();
        }
      });
      label.append(box, node('span', toggle.label), node('span', toggle.xp, 'meta'));
      fieldset.append(label);
      toggle.box = box;
    });
    /* 登记跨标签页同步句柄：另一页改了这一课的勾选状态时，本页勾选框跟着走 */
    lessonToggleSync = {
      lessonId: lesson.id,
      sync() {
        const current = progress.lessonState(lesson.id);
        toggles.forEach(toggle => { toggle.box.checked = Boolean(current[toggle.field]); });
        updateStat();
        updateReviewBlock();
      }
    };
    fieldset.append(statLine);
    fieldset.append(reviewLine, reviewActions);
    updateStat();
    updateReviewBlock();
    /* 与 15 秒保存周期一致地刷新时长，不做每秒重绘。 */
    if (persistent) window.setInterval(updateStat, progress.Logic.SAVE_INTERVAL_MS);
    return fieldset;
  }

  /* ---------- 本课外部资料（v3） ----------
   * 交接 §3.3：不使用 iframe、不做代理网页、不注入第三方页面，所有外链一律在新标签页打开。
   * 卡片刻意不使用 details/summary：一是中文导读要点需要直接可读，二是保持“简单自测”的
   * 折叠答案仍是页面第一个 summary，避免与既有渲染结构断言冲突。 */

  /* v4.11.3 B1：无中文版条目的 fallback 文案按资源类型分支。
   * 背景：旧的单句通用文案把「本站未找到可靠的官方中文版本」套在全部无中文版
   * 条目上——但视频不存在「中文版」这个概念（视频只有中文字幕一说），网站界面
   * 也没有「中文版」这个选项，这两类被套上「未找到中文版」是说法不准确。
   * 判定用类别归属（关键词匹配）而不是硬编码 type 清单（type 实测有 24 种取值，
   * 清单式硬编码新增类型时会漏）；未命中任何类别的回落到既有通用文案——
   * 对文章 / 文档类资源那仍是准确说法。
   * 规则全文见 EXTERNAL-RESOURCES.md「按资源类型的文案规则（v4.11.3）」。
   * 注意：视频分支刻意不写「中文字幕」——该声明全卡只出现一次，归位在许可字段。
   * 精译分支（用户确认顺手修正）：带 zhTranslation 的卡此前也渲染通用句
   * 「只提供本站原创中文导读」，与卡内的中文精译块自相矛盾（v4.11.2 遗留），
   * 改为如实说提供精译。 */
  function resourceFallbackText(resource) {
    if (resource.zhTranslation) {
      return '本站未找到可靠的官方中文版本，因此提供上面的本站中文精译（采用与原作相同的 CC 许可）与英文原文链接。';
    }
    const type = String(resource.type || '');
    if (/视频/.test(type)) {
      return '这是视频：本站不翻译视频，上面的中文导读已把要点讲清，点开按钮直接观看。';
    }
    if (/工具|操作入口|网站/.test(type)) {
      return '这是网站 / 工具：本站不翻译网站界面，上面的中文导读已说明它的用途与用法，点开按钮直达。';
    }
    if (/数据文件|素材/.test(type)) {
      return '这是数据 / 图片文件，没有可翻译的正文；上面的中文导读说明它的用途，文件请从官方地址获取。';
    }
    return '本站未找到可靠的官方中文版本，因此只提供上面这份本站原创中文导读，加上英文原文链接。';
  }

  /* v4.11.4 A5：资源卡按钮文字按资源类型分动作标签。规则出处 CONTENT-STYLE-GUIDE.md
   * 第 4 节「按钮文字 = 读者的动作」与 EXTERNAL-RESOURCES.md「按资源类型的文案规则」。
   * 判定关键词与 resourceFallbackText() 同一套：有官方中文版（zhUrl）的卡不进
   * 类型判定（调用方维持双按钮）；其余按 type 匹配，兜底「打开英文原文 ↗」——
   * 对文章 / 文档类资源那仍是准确说法。新增资源类型时先定标签再写代码
   * （CONTENT-STYLE-GUIDE.md 第 8 节流程纪律）。 */
  function resourceLinkLabel(resource) {
    const type = String(resource.type || '');
    if (/视频/.test(type)) return '观看视频 ↗';
    if (/操作入口/.test(type)) return '前往操作 ↗';
    if (/工具|网站/.test(type)) return '打开工具 ↗';
    if (/数据文件/.test(type)) return '下载文件 ↗';
    if (/素材/.test(type)) return '查看素材 ↗';
    return '打开英文原文 ↗';
  }

  function buildResourceCard(resource) {
    const card = node('li', undefined, resource.zhUrl ? 'resource-card' : 'resource-card resource-guide-only');
    const head = node('div', undefined, 'resource-head');
    head.append(
      node('span', resource.type, 'resource-type'),
      node('span', REQUIREMENT_LABEL[resource.requirement] || resource.requirement, `resource-req resource-req-${resource.requirement}`)
    );
    card.append(head);
    card.append(node('p', resource.titleZh, 'resource-title-zh'));
    card.append(node('p', resource.title, 'resource-title-en'));
    card.append(node('p', `官方位置：${resource.zone}`, 'resource-zone'));

    const guide = node('dl', undefined, 'resource-guide');
    const guideRow = (term, value) => { guide.append(node('dt', term), value); };
    /* v4.11.1 B 档：中文速览——一段连贯的中文概览，让读者不点开外链也知道这篇讲什么、
     * 为什么要读。放在导读 dl 的第一行；字段缺失时静默跳过（数据分批补齐期间的兼容）。 */
    if (resource.zhGuide.overview) guideRow('中文速览', node('dd', resource.zhGuide.overview));
    guideRow('为什么要看', node('dd', resource.zhGuide.why));
    const pointsValue = node('dd');
    pointsValue.append(list(resource.zhGuide.points));
    guideRow('中文核心要点', pointsValue);
    const termsValue = node('dd', undefined, 'resource-terms');
    resource.zhGuide.terms.forEach(term => termsValue.append(node('span', term, 'resource-term')));
    guideRow('重要英文词', termsValue);
    guideRow('阅读 / 观看重点', node('dd', resource.zhGuide.focus));
    guideRow('看完应理解', node('dd', resource.zhGuide.takeaway));
    card.append(guide);

    /* v4.11.1 C 档：CC 许可来源的本站中文精译。静态展开，不使用 details/summary
     * 折叠——资源卡既有纪律是静态展开，且 browser-smoke 钉住「课页 details 数量 =
     * quiz 数量」，卡片里加 summary 会破坏这两条。
     * body 行前缀规则（与数据文件约定一致）：'# ' → 小节标题；'- ' → 列表项
     * （连续行合并为一个 ul）；其余 → 段落。全部经 textContent 渲染，无标记注入。
     * 署名 / 许可声明 / 译者与修改说明按 C2 要求逐条渲染在译文之后。 */
    if (resource.zhTranslation) {
      const translation = resource.zhTranslation;
      const box = node('div', undefined, 'resource-translation');
      box.append(node('p', `本站中文精译：${resource.titleZh}`, 'resource-translation-title'));
      let bulletList = null;
      translation.body.forEach(line => {
        if (line.startsWith('- ')) {
          if (!bulletList) {
            bulletList = node('ul', undefined, 'resource-translation-list');
            box.append(bulletList);
          }
          bulletList.append(node('li', line.slice(2)));
          return;
        }
        bulletList = null;
        if (line.startsWith('# ')) box.append(node('p', line.slice(2), 'resource-translation-h'));
        else box.append(node('p', line));
      });
      box.append(node('p', `署名与来源：${translation.attribution}`, 'meta'));
      box.append(node('p', `许可声明：${translation.licenseNote}`, 'meta'));
      box.append(node('p', `译者说明：${translation.translatorNote}`, 'meta'));
      box.append(node('p', `修改说明：${translation.modifications}`, 'meta'));
      card.append(box);
    }

    const links = node('div', undefined, 'resource-links');
    if (resource.zhUrl) {
      links.append(link('打开中文版 ↗', resource.zhUrl, 'button', true));
      links.append(link('打开英文原文 ↗', resource.originalUrl, 'button-secondary', true));
      links.append(node('p', `中文版性质：${resource.zhType}`, 'resource-zh-type'));
    } else {
      links.append(link(resourceLinkLabel(resource), resource.originalUrl, 'button', true));
      links.append(node('p', resourceFallbackText(resource), 'resource-zh-type'));
    }
    card.append(links);
    card.append(node('p', `许可：${resource.license}`, 'resource-license'));
    if (resource.note) card.append(node('p', `核验说明：${resource.note}`, 'resource-note'));
    return card;
  }

  /* 返回一组待插入的节点；本课没有外部资料时返回空数组，调用方不必判空。 */
  function buildResourceBlock(lesson) {
    if (!resourceData || !Array.isArray(resourceData.resources)) return [];
    const items = resourceData.resources.filter(resource => resource.lessonId === lesson.id);
    if (!items.length) return [];
    const block = [];
    /* v4.11.5（交接 3.B）：资源区标题是页内跳转锚点（#lesson-resources），
     * 跳转入口挂在「官方任务」节 Assignment 标题内（renderLessonV2）。
     * 资源区永不进折叠容器——跳转目标必须在同一节里保持可见（交接 3.A 红线），
     * 因此锚点跳转用原生 href 即可直达，不存在「跳过去是折叠空白」的情况。 */
    const resourceHead = node('h3', `本课外部资料（本站中文辅助 · ${items.length} 条）`);
    resourceHead.id = 'lesson-resources';
    block.push(resourceHead);
    /* v4.11.7：条数与题目数的对应关系说明——紧贴条数标题，读者一看到「N 条」
     * 就能读到「为什么不是 15 条」。v4.11.6 挂在自查题 / 任务列表下方是错位：
     * 那里没有数字可对照，反而与资源区的条数并列成两个打架的数字。 */
    const relationshipNote = taskResourceNote(lesson, items.length);
    if (relationshipNote) block.push(node('p', relationshipNote, 'meta task-resource-note'));
    block.push(node('p', '以下是官方原课在正文与 Assignment 中明确要求学习的外部资料。本站提供中文辅助入口与本站原创导读；对许可明确为 CC 系列且没有官方中文版的来源，本站另提供采用与原作相同许可的中文精译（卡内附署名与来源标注）；其余第三方内容不搬运、不翻译，只做原创导读与原文链接。链接一律在新标签页打开，打开后会离开本站。', 'muted'));
    /* v4.11.4 文案瘦身（规则出处 CONTENT-STYLE-GUIDE.md 第 1 节「读者页面零审计信息」）：
     * v4.11.2 的三分类计数句（「其中 X 条有已核验的官方中文版……」）、全局核验日期句
     * 与 v4.11.1 的块级「自动核验受限」提示已从课页移除——条数统计与核验信息属审计
     * 内容，住在数据文件、SOURCES.md 与首页「关于本站」FAQ；audit.verifyLimitedUrls
     * 等字段保留在 external-resources.js 作审计。唯一例外是单卡「核验说明」
     * （buildResourceCard 对 resource.note 的渲染）：针对具体资料的诚实记录，保留。 */
    const cards = node('ul', undefined, 'resource-list');
    items.forEach(resource => cards.append(buildResourceCard(resource)));
    block.push(cards);
    return block;
  }

  /* ---------- v4.11.2 C：任务条目内联链接 ----------
   * 映射数据住在 lesson-task-links.js（独立数据文件，lessons.js 红线不动）。
   * 渲染纪律：
   *   · 链接文字用资源清单的 titleZh，按地址在本课资源里反查；查不到的地址
   *     整条不渲染链接——宁可少一个链接也不出悬空引用（测试钉住映射文件里
   *     每个地址都能反查到本课资源）；
   *   · 地址比对去掉锚点与尾部斜杠：部分长页面沿用官方 KC 的原锚点
   *     （softcover 各命令小节、cbea.ms #intro/#limit-50 等）；
   *   · 全部是外链：新标签页 + noopener noreferrer，与资源卡同一纪律；
   *   · 条目文本本身一字不改，链接追加在文本之后（li 的内联尾部）。 */
  function taskLinkBase(url) {
    return String(url).split('#')[0].replace(/\/+$/, '');
  }

  function taskLinkResource(lessonId, url) {
    if (!resourceData || !Array.isArray(resourceData.resources)) return null;
    const wanted = taskLinkBase(url);
    return resourceData.resources.find(resource => resource.lessonId === lessonId
      && (taskLinkBase(resource.originalUrl) === wanted
        || (resource.zhUrl && taskLinkBase(resource.zhUrl) === wanted))) || null;
  }

  /* v4.11.17：官方移除课末自查题节后，映射文件只剩 Assignment 一类，
   * kind 参数随之去掉（原 'k' 分支已无数据可用）。 */
  function taskLinkMap(lessonId) {
    if (!taskLinkData || !taskLinkData.links) return null;
    const entry = taskLinkData.links[lessonId];
    return entry ? entry.a || null : null;
  }

  function appendTaskLinks(container, lessonId, urls) {
    urls.forEach((url, index) => {
      const resource = taskLinkResource(lessonId, url);
      if (!resource) return;
      container.append(node('span', index === 0 ? ' ' : '、', 'task-link-sep'));
      container.append(link(`${resource.titleZh} ↗`, url, 'task-link', true));
    });
  }

  /* 带内联链接的任务列表：links 为 { 1-based 条目号: [href] }；无映射数据时
   * 与 list() 行为完全一致。只用于 v2 官方任务区（v1 兼容分支不接）。 */
  function taskList(items, lessonId, links, ordered = false) {
    const element = node(ordered ? 'ol' : 'ul');
    items.forEach((item, index) => {
      const li = node('li', item);
      const urls = links ? links[index + 1] : null;
      if (Array.isArray(urls) && urls.length) appendTaskLinks(li, lessonId, urls);
      element.append(li);
    });
    return element;
  }

  /* ---------- v4.11.7：资料条数与题目数的对应关系说明 ----------
   * 读者最容易困惑的时刻是**在资源区看到条数**：官方明明有 22 条任务，
   * 这里为什么只有 9 条？v4.11.6 曾把说明挂在任务列表下方，
   * 但那里既不是数字出现的位置，又让页面上同时出现两个互相打架的数字
   * （实测 how-does-the-web-work：资源区「9 条」2 处 vs 标注「7 份」1 处，
   * 读者比不理解时更困惑）。v4.11.7 改为**只在资源区说一次**——数字出现的地方。
   *
   * 文案是关于**官方课程结构**的事实说明（CONTENT-STYLE-GUIDE.md 第 1 节例外条款），
   * 不是本站核验审计信息——绝不写「本站核验了 N 条 / 资料不全 / 只提供部分参考」。
   * 纯函数：数字全部由课数据 + lesson-task-links.js 映射现算，无线索返回 null、
   * 调用方不渲染（tests/task-resource-note.test.cjs 钉住「数据变了文案没变」必红）。
   *
   * v4.11.17：官方 2026-09-23 移除课末自查题节后，只剩一种情形——
   *   · 任务未接链条目 ≥ 5 → 说明多数任务是终端 / 界面上的动手操作。
   *
   * 渲染纪律：<p class="meta">，不得用 <a>（节级直接子链接为 0 是既有断言）；
   * 不得含「中文辅助」（D7 计数钉死渲染层恰 5 处）；不以「其中」开头
   * （A1 前言禁语的同一口径）。落点是 section-official 直接子级；资源区永不
   * 折叠（v4.11.5 红线），因此这条说明始终可见。 */
  function taskResourceNote(lesson, resourceCount) {
    const official = lesson.official || {};
    const parts = [];
    const aLinks = taskLinkMap(lesson.id);
    if (aLinks && Array.isArray(official.assignment)) {
      const aLinked = Object.keys(aLinks).filter(num => Array.isArray(aLinks[num]) && aLinks[num].length);
      const aTotal = official.assignment.length;
      if (aLinked.length && aTotal - aLinked.length >= 5) {
        parts.push(`官方 ${aTotal} 条任务大多是终端与 GitHub 上的动手操作，其中 ${aLinked.length} 条需要外部文章，已附链接。`);
      }
    }
    return parts.length ? parts.join(' ') : null;
  }

  /* ---------- v4.11.5（交接 3.A / 3.A2 / 3.B）：官方任务节折叠与页内跳转 ----------
   * 折叠实现是 button[aria-expanded] + 受控容器（div.collapse-body + hidden 属性），
   * **零新增 details / summary**：browser-smoke 钉住「课页 details 数量 = quiz 数量」
   * 「details[open] = 0」「第一个 summary 属于简单自测」，官方任务节排在自测之前，
   * 用 details 做折叠会抢走 summary.first()（交接 §2 活断言 1–4）。
   * button 天然可聚焦可回车触发，键盘可达性不输 summary。
   * 折叠偏好住学习档案 settings.collapseOfficialTasks（progress.js 专用 API，
   * 不在 SETTING_BOOLEAN_KEYS / 设置面板开关里——面板恰好 6 个开关被测试钉住）；
   * file:// 非持久化时记忆不生效，按钮当页交互照常（FILE_MODE_NOTE 既有口径）。
   * 按钮文字 = 读者的动作（CONTENT-STYLE-GUIDE.md 第 9 节）。 */
  const OFFICIAL_COLLAPSE_LABELS = {
    assignment: { collapse: '收起任务列表', expand: '展开任务列表' }
  };

  /* 读档案里的折叠偏好：只有显式 true 才算折叠（progress 读档已校验，这里再兜一层）。 */
  function officialTasksCollapsed() {
    return Boolean(progress && progress.settings().collapseOfficialTasks === true);
  }

  function buildCollapseToggle(bodyId, labels, collapsed) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'collapse-toggle';
    button.setAttribute('aria-controls', bodyId);
    button.setAttribute('aria-expanded', String(!collapsed));
    button.textContent = collapsed ? labels.expand : labels.collapse;
    button.addEventListener('click', () => {
      const body = document.getElementById(bodyId);
      if (!body) return;
      const willCollapse = !body.hidden;
      body.hidden = willCollapse;
      button.setAttribute('aria-expanded', String(!willCollapse));
      button.textContent = willCollapse ? labels.expand : labels.collapse;
      /* 任何一个折叠头的点击结果都写入全局偏好：收起一次后所有课页默认收起，
       * 点「展开」同样全站恢复——展开态的折叠头就是恢复出口（交接 3.A2 第 6 条）。
       * file:// 下 API 返回 ok:false，仅表示不记忆，页面交互不回滚、不弹错。 */
      if (progress) progress.setOfficialTasksCollapsed(willCollapse);
    });
    return button;
  }

  /* 折叠受控容器：包裹 Assignment 的 <ol>，绝不包资源区（buildResourceBlock 的返回
   * 节点必须保持是 section 的直接子级——资源区前言 = 直接子 p 被测试钉住）。 */
  function buildCollapseBody(bodyId, collapsed) {
    const body = node('div', undefined, 'collapse-body');
    body.id = bodyId;
    body.hidden = collapsed;
    return body;
  }

  if (!data || !Array.isArray(data.lessons)) {
    main.replaceChildren(node('h1', '课程内容暂未载入'), node('p', '请确认 lessons.js 与 HTML 文件放在同一文件夹，再刷新页面。'));
    main.append(link('打开官方课程目录', 'https://www.theodinproject.com/paths/foundations/courses/foundations'));
    return;
  }

  /* ---------- v4.2：技能路线视图（交接 §11） ----------
   * 按官方 8 个单元呈现一条纵向路线，不取代完整目录（目录仍在下方）。
   * 状态：已完成 / 当前进行 / 已开放未完成 / 未开放；Project 单独标识。
   * 未开放课程（Foundations 之后的新课）只显示为灰点，不生成任何进入正文的链接（与目录同一红线）。
   * 纯 CSS 实现（节点 + 连接线 + 课点方格），不引图形库。 */

  const UNIT_STATUS_LABEL = {
    done: '已完成',
    current: '当前进行',
    open: '已开放未完成',
    locked: '未开放'
  };

  /* ---------- v4.5.2 Final Concept Match（P0-4）：学习旅程脊线 ----------
   * 概念确认稿不是复杂蛇形地图：左侧一条竖直进度脊线 + 右侧单元 / 课程清单。
   * 官方 8 个单元按官方顺序归入三个**表现层**阶段（起步 / 页面 / 编程收官），
   * 只用于脊线的阶段标记与分组排版；不复制状态推导——阶段状态由成员单元
   * 既有的 status 聚合而来，单元状态仍只出自 skillTreeUnits / map.js。 */
  const JOURNEY_PHASES = [
    { zh: '起步与准备', groups: ['introduction', 'prerequisites', 'git-basics'] },
    { zh: '页面结构与样式', groups: ['html-foundations', 'css-foundations', 'flexbox'] },
    { zh: '编程与收官', groups: ['javascript-basics', 'conclusion'] }
  ];

  const JOURNEY_PHASE_STATE = {
    done: '已完成',
    current: '进行中',
    upcoming: '待开始',
    locked: '未开放'
  };

  function journeyPhaseIndex(groupId) {
    for (let i = 0; i < JOURNEY_PHASES.length; i += 1) {
      if (JOURNEY_PHASES[i].groups.indexOf(groupId) >= 0) return i;
    }
    return JOURNEY_PHASES.length - 1; /* 兜底：未知单元归入最后一段，永不丢节点 */
  }

  function journeyPhaseStatus(statuses) {
    if (!statuses.length) return 'locked';
    if (statuses.every(item => item === 'done')) return 'done';
    if (statuses.some(item => item === 'current')) return 'current';
    if (statuses.some(item => item === 'done')) return 'current';
    if (statuses.every(item => item === 'locked')) return 'locked';
    return 'upcoming';
  }

  function journeyPhaseLabel(phaseIndex, status) {
    return {
      name: `阶段 ${phaseIndex + 1} · ${JOURNEY_PHASES[phaseIndex].zh}`,
      state: JOURNEY_PHASE_STATE[status]
    };
  }

  /* 技能路线脊线上的阶段标记（li 但非 skill-node，测试钉住的 8 节点不变） */
  function buildJourneyMarker(phaseIndex, status) {
    const label = journeyPhaseLabel(phaseIndex, status);
    const marker = node('li', undefined, `journey-phase is-${status}`);
    const dot = node('span', undefined, 'journey-dot');
    dot.setAttribute('aria-hidden', 'true');
    marker.append(dot);
    const text = node('span', undefined, 'journey-phase-text');
    text.append(node('span', label.name, 'journey-phase-name'));
    text.append(node('span', label.state, 'journey-phase-state'));
    marker.append(text);
    return marker;
  }

  /* Foundations 地图的阶段包裹块：头行挂脊线圆点，单元卡住在右侧列 */
  function buildJourneyPhaseBlock(phaseIndex, status) {
    const label = journeyPhaseLabel(phaseIndex, status);
    const section = node('section', undefined, `journey-phase is-${status}`);
    const head = node('div', undefined, 'journey-phase-head');
    const dot = node('span', undefined, 'journey-dot');
    dot.setAttribute('aria-hidden', 'true');
    head.append(dot);
    head.append(node('span', label.name, 'journey-phase-name'));
    head.append(node('span', label.state, 'journey-phase-state'));
    section.append(head);
    const unitsBox = node('div', undefined, 'journey-units');
    section.append(unitsBox);
    return { section, unitsBox };
  }

  /* 地图单元的阶段状态：由 mapBrief 已给出的节点状态聚合，不重读原始档案 */
  function mapUnitPhaseStatus(unit) {
    if (!unit.openCount) return 'locked';
    if (unit.nodes.some(item => item.isCurrent)) return 'current';
    const doneStatus = status => status === 'broken' || status === 'defeated' || status === 'mastered';
    const openNodes = unit.nodes.filter(item => item.status !== 'locked');
    if (openNodes.length && openNodes.every(item => doneStatus(item.status))) return 'done';
    return 'upcoming';
  }

  function skillTreeUnits() {
    const source = effectiveCatalog();
    const state = progress.getState();
    const summary = progress.summary();
    return source.groups.map(group => {
      const entries = source.lessons.filter(entry => entry.group === group.id);
      /* “可用”与目录同一口径：catalog 说开放且 lessons.js 确有正文 */
      const usable = entries.filter(entry => entry.available && findLesson(entry.slug));
      const completedCount = usable.filter(entry => (state.lessons[entry.slug] || {}).completed).length;
      let status = 'open';
      if (!usable.length) status = 'locked';
      else if (completedCount === usable.length) status = 'done';
      else if (usable.some(entry => entry.slug === summary.continueLessonId)) status = 'current';
      return {
        group, entries, usable, completedCount,
        availableCount: usable.length,
        total: entries.length,
        status
      };
    });
  }

  /* ---------- v4.4（交接 E1/E2）：S 型技能路线 ----------
   * DOM 顺序 = 官方单元真实顺序（测试钉住），视觉蛇形完全由 CSS 承担
   * （audit U7：卡片左右交替 + 弧线连接段，纯 border 虚线弧，不引图形库、
   * 不做运行时 SVG 计算）；连接线颜色用主题变量，深色主题自适应。
   * 图例精简（E2）：默认单行 chips（色点 + 短名，title 给细节），完整解释
   * 收进可点击展开的 details——手机上不依赖 hover（红线 9）。 */

  /* 通用精简图例组件：技能路线与地图共用 */
  function buildCompactLegend(items) {
    const wrap = node('div', undefined, 'legend-compact');
    const chips = node('ul', undefined, 'legend-chips');
    items.forEach(item => {
      const chip = node('li', undefined, 'legend-chip');
      chip.title = item.hint;
      const dot = node('span', undefined, `${item.dotClass} is-static`);
      dot.setAttribute('aria-hidden', 'true');
      chip.append(dot, node('span', item.zh));
      chips.append(chip);
    });
    wrap.append(chips);
    const details = node('details', undefined, 'legend-details');
    details.append(node('summary', '图例说明'));
    const list = node('ul');
    items.forEach(item => list.append(node('li', `${item.zh}：${item.hint}`)));
    details.append(list);
    wrap.append(details);
    return wrap;
  }

  const SKILL_LEGEND_ITEMS = [
    { dotClass: 'skill-dot is-done', zh: '已完成', hint: '这个单元里本站已开放的课全部勾选完成' },
    { dotClass: 'skill-dot is-current', zh: '当前进行', hint: '建议继续的那一课所在单元' },
    { dotClass: 'skill-dot', zh: '已开放', hint: '本站有中文正文，还没学完' },
    { dotClass: 'skill-dot is-locked', zh: '未开放', hint: '本站的中文正文尚未覆盖这一课，请回官方原课学习（Foundations 46 课已全部开放）' },
    { dotClass: 'skill-dot is-project', zh: '项目', hint: '官方 Project 节点（五角星），由你动手完成，本站不提供成品答案' }
  ];

  function buildSkillTreeNode(unit, isLast) {
    const item = node('li', undefined, `skill-node is-${unit.status}`);
    const card = node('div', undefined, 'skill-card');
    const head = node('div', undefined, 'skill-head');
    /* 状态标记进卡头（脊线圆点承担“走到哪”，卡头标记承担单元状态语义） */
    const marker = node('span', undefined, 'skill-marker');
    marker.setAttribute('aria-hidden', 'true');
    if (unit.status === 'done') marker.textContent = '✓';
    if (unit.status === 'current') marker.textContent = '●';
    head.append(marker);
    head.append(node('h3', unit.group.zh), node('span', unit.group.en, 'english'));
    const stateLabel = node('span', UNIT_STATUS_LABEL[unit.status], `skill-state skill-state-${unit.status}`);
    head.append(stateLabel);
    card.append(head);
    card.append(node('p', unit.availableCount
      ? `已完成 ${unit.completedCount} / ${unit.availableCount} 课（本站已开放；官方该单元共 ${unit.total} 课）`
      : `官方该单元共 ${unit.total} 课，本站暂未开放中文正文`, 'meta'));
    /* 课点：每个官方课程一个小方格。实心=已完成，描边=已开放未完成，
     * 灰=未开放；Project 用五角星标识。当前进行的那课高亮。 */
    const dots = node('div', undefined, 'skill-dots');
    dots.setAttribute('role', 'img');
    dots.setAttribute('aria-label', `该单元 ${unit.total} 课的完成情况：${unit.completedCount} 课已完成`);
    const summary = progress.summary();
    unit.entries.forEach(entry => {
      const usable = entry.available && Boolean(findLesson(entry.slug));
      const completed = usable && (progress.getState().lessons[entry.slug] || {}).completed;
      const isCurrent = usable && entry.slug === summary.continueLessonId;
      const dot = node('span', undefined, 'skill-dot');
      if (entry.type === 'project') dot.classList.add('is-project');
      if (completed) dot.classList.add('is-done');
      else if (isCurrent) dot.classList.add('is-current');
      else if (usable) dot.classList.add('is-open');
      else dot.classList.add('is-locked');
      dot.title = `${String(entry.order).padStart(2, '0')} ${entry.zh}${entry.type === 'project' ? '（项目）' : ''}${completed ? ' · 已完成' : usable ? ' · 已开放' : ' · 暂未开放'}`;
      dots.append(dot);
    });
    card.append(dots);
    /* v4.5.2 Final Concept Match（P0-4）：当前课整行强调——当前单元内给一条
     * 全宽「现在学到」行直达该课，而不是只靠一个小方格徽标。数据来自
     * summary.continueLessonId 与既有 entries，不新增第二事实来源。 */
    if (summary.continueLessonId) {
      const currentEntry = unit.entries.find(entry => entry.slug === summary.continueLessonId && entry.available && findLesson(entry.slug));
      if (currentEntry) {
        card.append(link(
          `现在学到 ${String(currentEntry.order).padStart(2, '0')} · ${currentEntry.zh} →`,
          lessonHref({ id: currentEntry.slug }),
          'skill-current-row'
        ));
      }
    }
    /* v4.4：目录住进 dialog 后，原「跳到目录对应分区」的页内锚点失效——
     * 改为打开课程目录 dialog 的按钮（红线：不生成任何进入未开放正文的链接）。 */
    if (unit.availableCount) {
      const goCatalog = node('button', '在目录中查看这一单元', 'button-secondary');
      goCatalog.type = 'button';
      goCatalog.addEventListener('click', () => openCatalogDialog(goCatalog));
      card.append(goCatalog);
    }
    item.append(card);
    /* 弧线连接段（纯装饰；最后一个节点后面没有路） */
    if (!isLast) {
      const connector = node('span', undefined, 'skill-connector');
      connector.setAttribute('aria-hidden', 'true');
      item.append(connector);
    }
    return item;
  }

  function buildSkillTree() {
    const sectionNode = node('section', undefined, 'section skill-tree');
    sectionNode.append(node('h2', '技能路线'));
    sectionNode.append(node('p', '官方 Foundations 的 8 个单元沿一条竖直学习脊线从上到下排布：绿色是已走完的阶段，靛紫是你现在的位置，灰色是还没到的路。学习顺序永远是官方顺序。', 'muted'));
    sectionNode.append(buildCompactLegend(SKILL_LEGEND_ITEMS));
    const list = node('ol', undefined, 'skill-list');
    const units = skillTreeUnits();
    let lastPhase = -1;
    units.forEach((unit, index) => {
      const phaseIndex = journeyPhaseIndex(unit.group.id);
      if (phaseIndex !== lastPhase) {
        const phaseStatuses = units
          .filter(item => journeyPhaseIndex(item.group.id) === phaseIndex)
          .map(item => item.status);
        list.append(buildJourneyMarker(phaseIndex, journeyPhaseStatus(phaseStatuses)));
        lastPhase = phaseIndex;
      }
      list.append(buildSkillTreeNode(unit, index === units.length - 1));
    });
    sectionNode.append(list);
    return sectionNode;
  }

  /* ---------- v4.3：Foundations 地图（交接 E1、E2） ----------
   * 官方 8 单元 / 46 节点的探索路线，不替代目录也不替代技能路线：
   * 技能路线看“单元完成度”，地图看“每课的学习状态比喻”与 Boss 入口。
   * 节点状态五阶（未探索/已侦察/已破甲/已击破/已精通）由 map.js 从
   * state 推导；未开放课程是灰点，结构上不可点击（与目录同一红线）。
   * 纯 HTML/CSS（节点 = 链接/按钮 + 形状类），不引图形库；移动端 flex 换行，
   * 不做全页横向滚动。这些只是学习状态比喻：没有血量、攻击力与装备属性。 */

  function buildMapSection() {
    if (!mapModule || !progress) return null;
    const summary = progress.summary();
    const brief = mapModule.mapBrief(progress.getState(), effectiveCatalog(), data.lessons, summary.continueLessonId);
    if (!brief.units.length) return null;
    const sectionNode = node('section', undefined, 'section foundation-map');
    sectionNode.append(node('h2', 'Foundations 地图'));
    sectionNode.append(node('p', `官方 ${brief.totalNodes} 个课程节点按学习顺序排成探索路线，本站已开放 ${brief.openNodes} 个。节点状态是学习进度的比喻，不是游戏数值：没有血量和攻击力，不惩罚、不掉级，错过什么都不扣。已开放节点可以直接点开；灰色节点尚未开放中文正文，请回官方原课学习。`, 'muted'));

    /* 图例（v4.4 交接 E2：精简单行 chips + details 完整解释，
     * 不再满屏图例文字；含 Boss 与 Project 形状说明） */
    const legendItems = brief.statuses.map(status => {
      const meta = brief.statusMeta[status];
      return { dotClass: `map-node ${meta.css}`, zh: meta.zh, hint: meta.hint };
    });
    legendItems.push({ dotClass: 'map-node map-boss-dot', zh: 'Boss', hint: '单元综合自测入口（盾形），题目全部来自本站已讲内容' });
    legendItems.push({ dotClass: 'map-node is-project', zh: '项目', hint: '官方 Project 节点（方形），由你动手完成，本站不提供成品答案' });
    sectionNode.append(buildCompactLegend(legendItems));

    /* 每个单元一行短路线（交接 E2：单元章节地图与总地图同一视图）。
     * v4.5.2 Final Concept Match（P0-4）：单元按三个表现层阶段分组，
     * 共用技能路线同一种「学习旅程」脊线语言；节点 / Boss / 小结结构不变。 */
    const journey = node('div', undefined, 'map-journey');
    let lastPhase = -1;
    let unitsBox = null;
    brief.units.forEach(unit => {
      const phaseIndex = journeyPhaseIndex(unit.group.id);
      if (phaseIndex !== lastPhase) {
        const phaseStatuses = brief.units
          .filter(item => journeyPhaseIndex(item.group.id) === phaseIndex)
          .map(mapUnitPhaseStatus);
        const phase = buildJourneyPhaseBlock(phaseIndex, journeyPhaseStatus(phaseStatuses));
        journey.append(phase.section);
        unitsBox = phase.unitsBox;
        lastPhase = phaseIndex;
      }
      unitsBox.append(buildMapUnit(unit, brief.statusMeta));
    });
    sectionNode.append(journey);
    return sectionNode;
  }

  function buildMapUnit(unit, statusMeta) {
    const unitBlock = node('div', undefined, 'map-unit');
    const head = node('div', undefined, 'map-unit-head');
    head.append(node('h3', unit.group.zh), node('span', unit.group.en, 'english'));
    head.append(node(
      'span',
      unit.openCount
        ? `已开放 ${unit.openCount} 课 · 侦察 ${unit.exploredCount} · 破甲 ${unit.brokenCount} · 击破 ${unit.defeatedCount}${unit.masteredCount ? ` · 精通 ${unit.masteredCount}` : ''}`
        : '本站暂未开放',
      'meta map-unit-count'
    ));
    unitBlock.append(head);
    /* v4.5.2 Final Concept Match（P0-4）：当前课整行强调——含当前课的单元
     * 在节点行之前给一条全宽「现在学到」行（数据 = mapBrief 的 isCurrent）。 */
    const currentNode = unit.nodes.find(item => item.isCurrent);
    if (currentNode && currentNode.linkable) {
      unitBlock.append(link(
        `现在学到 ${String(currentNode.order).padStart(2, '0')} · ${currentNode.zh} →`,
        lessonHref({ id: currentNode.slug }),
        'map-current-row'
      ));
    }
    const nodesRow = node('div', undefined, 'map-nodes');
    unit.nodes.forEach(item => {
      const meta = statusMeta[item.status];
      const classes = `map-node ${meta.css}${item.type === 'project' ? ' is-project' : ''}${item.isCurrent ? ' is-current' : ''}`;
      const label = String(item.order).padStart(2, '0');
      const titleText = `${label} ${item.zh}${item.type === 'project' ? '（项目）' : ''} · ${meta.zh}（${meta.hint}）`;
      let element;
      if (item.linkable) {
        element = link(label, lessonHref({ id: item.slug }), classes);
      } else {
        element = node('span', label, classes);
      }
      element.title = titleText;
      element.setAttribute('aria-label', titleText);
      if (item.isCurrent) element.setAttribute('aria-current', 'true');
      nodesRow.append(element);
    });
    /* Boss 节点：只有存在题库的已开放单元才有（题目必须来自已讲知识） */
    if (unit.boss) {
      const bossButton = node('button', unit.boss.attempted ? '☗' : '?', `map-node map-boss-dot${unit.boss.attempted ? ' is-attempted' : ''}`);
      bossButton.type = 'button';
      const bossTitle = `Boss · ${unit.boss.zh}${unit.boss.attempted && unit.boss.bestPct !== null ? `（历史最佳 ${unit.boss.bestPct}% · ${unit.boss.ratingZh}）` : '（还没挑战过）'}`;
      bossButton.title = bossTitle;
      bossButton.setAttribute('aria-label', `打开${unit.group.zh}单元的 Boss 挑战：${unit.boss.zh}`);
      bossButton.addEventListener('click', () => openBossDialog(unit.group.id));
      nodesRow.append(bossButton);
      /* v4.3 Batch 9（交接 M3）：Boss 专属徽章可见化——挑战过就把最佳评级
       * 直接标在路线末尾，不用悬停 title 才能看到 */
      if (unit.boss.attempted && unit.boss.ratingZh) {
        const rating = node('span', unit.boss.ratingZh, `map-boss-rating is-${unit.boss.rating || 'none'}`);
        rating.title = bossTitle;
        nodesRow.append(rating);
      }
    }
    unitBlock.append(nodesRow);
    /* v4.3 Batch 9（交接 M17）：章节完成小结——本单元已开放课程全部
     * 勾选完成时给一行总结（完成/击破/精通/Boss 评级），是事实陈述不是奖励 */
    if (unit.openCount > 0) {
      const doneCount = unit.nodes.filter(item => item.status === 'broken' || item.status === 'defeated' || item.status === 'mastered').length;
      if (doneCount === unit.openCount) {
        const bossNote = unit.boss
          ? (unit.boss.attempted && unit.boss.ratingZh ? ` · Boss 最佳评级「${unit.boss.ratingZh}」` : ' · Boss 还没挑战')
          : '';
        unitBlock.append(node('p', `章节完成：全部 ${unit.openCount} 课已完成 · 击破 ${unit.defeatedCount} · 精通 ${unit.masteredCount || 0}${bossNote}`, 'map-unit-summary'));
      }
    }
    return unitBlock;
  }

  /* 目录容器：progress 缺失的降级路径才内联目录；正常路径下目录住在
   * catalog dialog 里（首页 hero 卡与 header 都有入口）。 */
  let catalogMount = null;

  function rebuildCatalog() {
    if (catalogMount) catalogMount.replaceChildren(...catalogSections());
    /* 目录 dialog 已打开时同步重画（设置里切换“显示未开放课程”立刻可见） */
    if (catalogDialog && catalogBody && catalogDialog.open) {
      catalogBody.replaceChildren(...catalogBodyChildren());
    }
  }

  /* ---------- v4.7 P1-1：World 路线预览条（紧凑版） ----------
   * 首页次级信息带内一行显示路线四个关键节点的「名称 + 状态」；数据只从
   * curriculum.js（course 清单与官方中文名）与 progress.summary()（Foundations
   * 真实进度）读取，不建第二套课程数据副本；整条是一个 button，点击直达
   * 现有学习地图 sheet 的世界地图 Tab（与「查看全部 World」同一入口实现）。
   * curriculum 缺失时降级不渲染（与世界地图降级同口径）。home-ia 钉住的
   * 三入口 / 今日条 / 继续学习卡结构不变，预览条用全新类名。
   *
   * 课程定位一律走 curriculum 的 order（稳定标识），不按中文名匹配：官方目录
   * 更新时中文名是会调整的（见 MAINTENANCE.md「官方更新了课程怎么办」），
   * 靠 zh 正则/等值判断会在改名后静默少一个节点且无测试可捕捉。
   * PREVIEW_STAGES 里的 name 是刻意精简的**展示文案**（单行预览条要短，
   * 故写 'Node.js' 而非目录里的 'NodeJS'），不是课程数据副本。 */
  /* v4.11 批次 F（B3）：每个节点多带一个 `tone`——**纯表现层**的色相钩子
   * （写进 `data-world-tone`，style.css 据此给该节点加低饱和环境暗示）。
   * 它不是课程数据：order 仍是唯一匹配键，name 仍是展示文案，tone 只回答
   * 「这一格用什么色相」，不进 curriculum、不进档案、不参与任何判定。 */
  const PREVIEW_STAGES = [
    { order: 2, name: 'HTML & CSS', tone: 'html-css' },
    { order: 3, name: 'JavaScript', tone: 'javascript' },
    { order: 7, name: 'Node.js', tone: 'nodejs' }
  ];
  function worldPreviewBar() {
    if (!progress || !curriculum || !Array.isArray(curriculum.courses) || !curriculum.courses.length) return null;
    const courseAt = order => curriculum.courses.find(item => item.order === order) || null;
    if (!courseAt(1)) return null;
    const summary = progress.summary();
    /* 总数拿不到时只报已完成数，不硬编码课程总数（与 catalogBodyChildren 同口径：
       catalog.js 未载入就换一套不提总数的文案，绝不让页面说出未经核对的数字）。 */
    const total = catalogTotal();
    const stages = [{
      name: 'Foundations',
      state: total ? `${summary.completedCount} / ${total}` : `已完成 ${summary.completedCount}`,
      open: true,
      tone: 'foundations'
    }];
    PREVIEW_STAGES.forEach(stage => {
      /* tone 必须一起带过去（B3）：这里是从 PREVIEW_STAGES 重建展示对象，
       * 漏掉 tone 会让四格里的三格没有色相钩子。 */
      if (courseAt(stage.order)) stages.push({ name: stage.name, state: '尚未开放', open: false, tone: stage.tone });
    });
    const bar = node('button', undefined, 'world-preview');
    bar.type = 'button';
    bar.append(node('span', '路线预览', 'world-preview-label'));
    stages.forEach(stage => {
      const item = node('span', undefined, `world-preview-item${stage.open ? ' is-open' : ''}`);
      /* 纯展示钩子（B3）：色相由 CSS 消费，读屏与 aria-label 不受影响——
       * 整条 bar 仍是单个 button，节点本身不可聚焦、不可点击，点击行为不变。 */
      if (stage.tone) item.dataset.worldTone = stage.tone;
      item.append(node('span', stage.name, 'world-preview-name'));
      item.append(node('span', stage.state, 'world-preview-state'));
      bar.append(item);
    });
    bar.append(node('span', '进学习地图 →', 'world-preview-more'));
    bar.addEventListener('click', () => openMapSheet('world', bar));
    return bar;
  }

  /* ---------- v4.5：首页极简化（交接 A1/A2） ----------
   * 首页默认只回答三件事：我在哪（hero 主卡）、今天最该做什么（今日条）、
   * 下一步点哪里（主 CTA + 3 个主入口）。原来内联的 Dashboard 统计全文、
   * 今日/本周/挑战/复习卡、技能路线、地图、46 行目录、成就列表全部搬进
   * sheet / dialog / 个人中心——功能一个没删，只是不再默认平铺（交接 A2）。 */
  function renderHome() {
    /* v4.5.2 Final Concept Match（P0-1/P0-2）：lead + continue-card 组合成一个
     * 完整 Hero（一级容器），右侧学习伙伴陪伴；今日条与三个入口收进同一条次级
     * 信息带（二级容器），不再与 Hero 抢视觉权重。DOM 类名全部保留，
     * home-ia 测试钉住的结构不变。
     * v4.7 场景化：Hero 增加环境装饰层（角落植物剪影 + 窗光/绿丘渐变 +
     * 角色立足场景），全部纯装饰、零文本、零交互，IA 结构不变。 */
    const hero = node('section', undefined, 'home-hero');
    /* 左下角植物剪影（内联 SVG data URL）：alt 为空、CSS 层 z-index:-1 +
     * pointer-events:none，不进 textContent、不拦截交互。 */
    hero.append(svgImage(HERO_SCENE_SVG, '', 'hero-scene-decor'));
    /* v4.11 批次 E：右下角学习场景道具层（书桌 / 台灯 / 一小摞书），与左侧
     * 植物剪影同属 Hero 纯装饰环境层。挂在文字列与伙伴列之前——装饰层只在
     * 树序上先于内容，不进可访问名称、不进交互流，IA 仍是 Hero 两列结构。 */
    hero.append(svgImage(HERO_STUDY_SVG, '', 'hero-study-decor'));
    const heroMain = node('div', undefined, 'hero-main');
    /* 第三轮（首页与课页导航收口）：Hero 主文案收敛为两行——主标题承担路线名，
     * 副标题一句话定位；World 数量、中文覆盖与官方任务说明全部下沉到
     * 「学习地图 · 世界地图」、World 1 卡片与课页局部，不再塞进 Hero，
     * 也不用大量换行硬拆说明文字。 */
    heroMain.append(node('h1', 'Full Stack JavaScript 路线'));
    heroMain.append(node('p', '沿 The Odin Project 路线学习 Web 开发。', 'lead home-lead'));
    if (progress) {
      if (!progress.isPersistent()) heroMain.append(node('p', FILE_MODE_NOTE, 'notice'));
      const storageWarning = storageWarningText();
      if (storageWarning) heroMain.append(node('p', storageWarning, 'notice'));
      registerHomeSheets();
      heroMain.append(buildContinueCard());
    } else {
      /* progress 体系没载入的降级路径：目录保持完整内联，页面不开天窗 */
      heroMain.append(node('p', '学习进度系统未载入（progress.js 缺失或加载失败）。课程与目录仍可正常阅读，但进度不会保存。', 'notice'));
      catalogMount = node('div', undefined, 'catalog-mount');
      catalogSections().forEach(unit => catalogMount.append(unit));
      heroMain.append(catalogMount);
    }
    hero.append(heroMain);
    homeHeroCompanion = heroCompanionFigure();
    if (homeHeroCompanion) hero.append(homeHeroCompanion);
    main.append(hero);
    if (progress) {
      const secondary = node('div', undefined, 'home-secondary');
      secondary.append(buildTodayStrip());
      secondary.append(buildEntryGrid());
      /* v4.7 P1-1：路线预览条住进次级信息带末尾（紧凑单行，不与 Hero 抢权重） */
      const preview = worldPreviewBar();
      if (preview) secondary.append(preview);
      main.append(secondary);
    }
    /* 关于本站：低频解释收进唯一的 details（渐进披露——交接 1.2 反对的是
     * “十几个 details 继续堆”，单个说明性折叠正是它建议的形态）。 */
    const usage = node('details', undefined, 'site-usage');
    usage.append(node('summary', '关于本站'));
    const usageBody = node('div', undefined, 'site-usage-body');
    const faqItems = [
      ['本站怎么用？', 'Foundations 全部 46 课有完整中文学习内容：讲解、示例、本站自测，以及官方 Assignment 的中文化版本——可以在本站学完并自查。Project 课的代码要你自己写：本站提供要求中文版、拆解与验收清单，不提供成品答案；项目提交、Discord 社区与其后课程在 TOP 官方进行，每课页面都提供官方直达入口。'],
      ['中文内容覆盖到哪里？', 'Foundations 的全部 46 课已有完整中文学习内容（八个分组全部开放，含 46 课 Choose Your Path Forward）；本站同时展示 8 个 World、197 课的完整路线结构，Foundations 之后的路径课程请回官方原课学习。'],
      ['哪些内容需要联网？', '中文课程与学习记录可在本地使用；TOP 原课、视频及外部资料需要联网。官方课程如有更新，以 TOP 为准。'],
      /* v4.11.2 A2：外部资料核验方法论从课页资源区移到这里。方法论（状态码、
       * 重定向、内容级语言核验、oEmbed）是审计信息，读者主动打开「关于本站」时
       * 才需要看到；课页资源区只保留一句「核验方法见首页『关于本站』」。
       * 文案直接引用数据文件的 method 字段，不在这里另抄一份方法论。 */
      ['外部资料链接是怎么核验的？', resourceData
        ? `${resourceData.method}全部地址都已逐条核验，最近一批于 ${resourceData.verifiedAt}；自动核验受限的条目已在对应课程页的资源卡内如实标注，未声称为“已验证可访问”。`
        : '外部资料地址均逐条核验过可达性与语言；细节见各课资源卡内的核验说明。']
    ];
    faqItems.forEach(([question, answer]) => {
      const item = node('section', undefined, 'site-faq-item');
      item.append(node('h2', question, 'site-faq-question'), node('p', answer));
      usageBody.append(item);
    });
    usage.append(usageBody);
    main.append(usage);
  }

  function renderLesson() {
    const id = new URLSearchParams(location.search).get('id');
    const index = data.lessons.findIndex(lesson => lesson.id === id);
    if (index < 0) {
      document.title = '未找到课程 · Odin 中文学习站';
      main.append(node('h1', '未找到这节课'), node('p', `链接缺少课程编号，或该课程不在本版已开放的 ${data.lessons.length} 课范围内。`));
      main.append(link('返回课程列表', 'index.html', 'button'));
      return;
    }
    const lesson = data.lessons[index];
    activeLessonId = lesson.id;
    document.title = `${lesson.zh} · ${lesson.title} · Odin 中文学习站`;
    /* 第三轮：课页顶部轻量返回入口——当前 46 课均属 World 1，直接显示
     * 「← Foundations」；左上品牌 Logo 回首页的既有链路不变。不做显眼大按钮。 */
    main.append(link('← Foundations', 'index.html', 'lesson-back'));
    /* v4.11.16：分母改为 data.lessons.length 推导，扩课不再需要改这一行。 */
    main.append(node('p', `第 ${String(index + 1).padStart(2, '0')} / ${data.lessons.length} 课 · ${data.groups[lesson.group].zh}`, 'meta'));
    main.append(node('h1', lesson.zh), node('p', lesson.title, 'english'), node('p', lesson.summary, 'lead'));
    /* v4.11.3 C2（事前）：大课的体量提示——判定由数据算出（progress.Logic.isHeavyLesson，
     * 读 sections，不硬编码课 id）。用中性事实（章节数）帮读者建立预期，
     * 把「重」表达为「值得多安排时间」；措辞纪律：不写
     * 「这课很难」「容易放弃」等负面暗示。普通课不渲染，避免提示通胀。
     * v4.11.17：官方移除自查题节后，isHeavyLesson 实际只看章节数。 */
    if (progress && progress.Logic.isHeavyLesson(lesson)) {
      main.append(node('p', `本课体量较大：讲解共 ${lesson.sections.length} 章，值得多安排一些学习时间。`, 'notice'));
    }
    const start = node('div', undefined, 'official-start');
    start.append(officialButton(lesson));
    /* v4.11.2 D：顶部官方入口的说明与「本站自足」口径一致——原课是内容来源
     * 与延伸（Project、社区、后续课程），不再是「完成任务必须去的地方」。 */
    start.append(node('p', lesson.sections ? '新标签页打开 · 原课是本课内容的来源，也通向 Project、社区与其后课程' : '新标签页打开 · 中文导读与英文原课对照使用', 'meta'));
    main.append(start);

    if (Array.isArray(lesson.sections)) {
      renderLessonV2(lesson);
    } else {
      const guide = section('中文导读');
      guide.append(node('h3', '这一课是干什么的'), node('p', lesson.guide), node('h3', '你必须理解什么'), list(lesson.understand));
      main.append(guide);
      const terms = section('重要英文术语', 'section-terms');
      const definitions = node('dl', undefined, 'terms');
      lesson.terms.forEach(term => {
        const row = node('div', undefined, 'term');
        row.append(node('dt', term.en), node('dd', term.zh));
        definitions.append(row);
      });
      terms.append(definitions);
      main.append(terms);

      const tasks = section('今天实际要做什么');
      /* v4.11.2 D3：兼容分支的口径与 v2 路径一致——先说本页有中文辅助，
       * 原课只作为英文原文的核对处，不再是「请去原课查看」。
       * v4.11.3 A：class 由 muted 提升为 lesson-guide（带左色条的提示块），
       * 文案一字不改。 */
      tasks.append(node('p', '以下是官方正文与 Assignment 的执行提示。这些外部资料的中文辅助（官方中文版入口 / 本站中文精译 / 中文速览）与本站原创导读见本节末尾的「本课外部资料」，可先在本页看懂；具体命令与示例的英文原文可在原课中核对。', 'lesson-guide'));
      if (lesson.note) tasks.append(node('p', lesson.note, 'notice'));
      tasks.append(list(lesson.tasks, true));
      if (lesson.optional.length) {
        tasks.append(node('h3', '官方可选项 / 替代方式'), list(lesson.optional));
      }
      tasks.append(node('p', '官方原课未单列 Additional Resources 栏目。下方「本课外部资料」是官方正文与 Assignment 中明确要求学习的外部资料，属于任务的一部分而不是可选补充；不要把 Assignment 误当成可选。', 'meta'));
      buildResourceBlock(lesson).forEach(part => tasks.append(part));
      main.append(tasks);

      const quiz = section('简单自测', 'section-quiz');
      quiz.append(node('p', '先用自己的话回答，再展开参考答案。这是本站编写的小检查，不是官方试题。', 'muted'));
      const questions = node('ol', undefined, 'quiz-list');
      lesson.quiz.forEach((item, questionIndex) => {
        const question = node('li', undefined, 'quiz-item');
        question.append(node('p', `${questionIndex + 1}. ${item.question}`, 'quiz-question'));
        const details = node('details');
        details.append(node('summary', '查看参考答案'), node('p', item.answer, 'answer'));
        question.append(details);
        questions.append(question);
      });
      quiz.append(questions);
      main.append(quiz);
    }
    if (progress) main.append(buildLessonProgress(lesson));
    const navigation = node('nav', undefined, 'lesson-nav');
    navigation.setAttribute('aria-label', '中文导读翻页');
    if (index > 0) navigation.append(link('← 上一课导读', lessonHref(data.lessons[index - 1])));
    navigation.append(link('课程列表', 'index.html'));
    if (index < data.lessons.length - 1) navigation.append(link('下一课导读 →', lessonHref(data.lessons[index + 1])));
    main.append(navigation);
    /* v4.11.16：旧文案「接下来的 Recipes 项目请回 TOP 自己完成」在第 20 课开放后
     * 失实（最后一页就是 Recipes 本身）；改为从 catalog.js 动态取下一个未开放课程。
     * 「本站不提供项目答案」的边界声明由 recipes 课自己的 note 字段承担，不在此重复
     * （CONTENT-STYLE-GUIDE 第 2 节：同一事实整页只说一次）。 */
    if (index === data.lessons.length - 1) {
      const nextLocked = catalog && Array.isArray(catalog.lessons) ? catalog.lessons.find(entry => !entry.available) : null;
      main.append(node('p', nextLocked
        ? `本版中文内容到此结束。下一课《${nextLocked.zh}》尚未开放，请回 TOP 官方原课继续学习。`
        : '本版中文内容到此结束。', 'end-note'));
    }
  }

  /* v4.11.8 最小长课样板：章节达到阈值时提供文档流内定位，不参与进度或档案。 */
  const LESSON_CHAPTER_NAV_MIN = 12;
  function chapterAnchorId(title, index, used) {
    const base = String(title).normalize('NFKD').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `chapter-${index + 1}`;
    const safeBase = base === `chapter-${index + 1}` ? base : base.replace(/^chapter-/, '');
    let id = `lesson-chapter-${safeBase}`;
    let suffix = 2;
    while (used.has(id)) id = `lesson-chapter-${base}-${suffix++}`;
    used.add(id);
    return id;
  }

  function buildChapterNav(lesson, chapterIds) {
    if (!Array.isArray(lesson.sections) || lesson.sections.length < LESSON_CHAPTER_NAV_MIN) return null;
    const navigation = node('nav', undefined, 'lesson-chapter-nav');
    navigation.setAttribute('aria-label', '本课章节');
    navigation.append(node('p', '本课章节', 'lesson-chapter-nav-title'));
    const list = node('ol', undefined, 'lesson-chapter-nav-list');
    lesson.sections.forEach((part, index) => {
      const item = node('li');
      /* v4.11.8 样板验收修正（2026-09-21）：链接文字只放章节真实标题——
       * 序号由外层 <ol> 原生提供。此前「章节 N：标题」与 <ol> 数字叠加出两套序号。 */
      item.append(link(part.h, `#${chapterIds[index]}`, 'lesson-chapter-link'));
      list.append(item);
    });
    navigation.append(list);
    return navigation;
  }

  /* ---------- v4.11.9 长课可复用视觉模块样板（开发期） ----------
   * 目的：验证「流程复习」与「命令 / 概念速查」两种轻量模块是否真的比连续段落
   * 更适合长课回看与查阅。只挂两门长课样板 + 一门短课对照。
   *
   * **数据落点纪律**：本表是开发期样板，**不是课程内容的第二事实源**。全部条目
   * 提炼自 lessons.js 对应章节的既有正文与列表，每条注明出处章节，不新增课程事实、
   * 不引入正文没有的命令（核对记录见 answers 实施回答文件）。验证通过后应按正式
   * 流程迁入 lessons.js 的 sections 字段并删除本表；验证失败则整段删除即可回滚，
   * 不触碰课程数据文件。
   *
   * **渲染纪律**（与 LESSON-PAGE-GUIDE 第 5 节活断言逐条对齐）：
   *  - 标题用 <p> 而不是 h3——h3 会进入 renderLessonV2 的 explainHeads，破坏概念图
   *    sectionIndex 归位与「h3 数量 === 章数」的锚点断言；更不产生 h2（browser-smoke
   *    钉 main 的 h2 序列）。
   *  - 零 details / summary（browser-smoke 钉课页 details 数 === quiz 数）。
   *  - 只渲染在 section-explain 内，不进 section-official：该节「文档序第一个 <ol>
   *    必须是 Assignment 列表」的断言作用域是 official 节内（collectTagDeep(official)），
   *    explain 里的 <ol> 不影响它——章节导航已是先例。
   *  - 零 <a>、零事件绑定、零 storage、零可交互状态：模块是内容，不是打卡 / 进度 /
   *    成就系统，因此不新增 storage key、schema 字段、XP 或完成状态。
   *  - 同章顺序固定：本章正文 → 概念图（如有）→ 流程复习 → 命令 / 概念速查 → 下一章 h3。
   *  - sectionIndex 越界（坏数据）时**不渲染**，不回落也不崩；合法性由
   *    tests/lesson-visual-modules.test.cjs 钉住，坏数据进不了仓库。 */
  const LESSON_MODULE_SAMPLES = {
    'git-basics': {
      /* 落点第 10 章「你已走完一个完整闭环」：该章正文原本是一行箭头串
       * （GitHub 建仓 → clone → 改文件 → add → commit → push → 网页核对），
       * 挤在一句里无法快速扫描；这里把同一条闭环展开成每步一行。 */
      process: {
        sectionIndex: 10,
        title: '流程复习',
        steps: [
          { title: '在 GitHub 上创建仓库', detail: '网页上建好远端仓库，复制 SSH 地址——复制成 HTTPS 地址最后推送会失败。' },
          { title: '克隆到本地', detail: 'git clone 加上那行 SSH 地址，本地就有一份完整副本。' },
          { title: '修改或创建文件', detail: '在本地仓库目录里改动内容。' },
          { title: '暂存变化', detail: 'git add 把改动请进暂存区，官方把它比喻成「等候室」。' },
          { title: '创建提交', detail: 'git commit -m 加上说明，把等候室里的改动打包成一次快照。' },
          { title: '推送到远端', detail: 'git push 把本地提交上传到 GitHub。' },
          { title: '在网页上核对', detail: '刷新仓库页面，确认文件与内容已经在线。' }
        ]
      },
      /* 落点第 12 章「Cheatsheet：命令速查表与三段式语法」：该章正文把命令按
       * 「远端相关 / 工作流相关 / 状态与历史检查」挤在 3 条长句里；这里改成一行一条
       * 的命令对照，并把本课其它章节出现过的命令一并汇总，便于查阅。 */
      reference: {
        sectionIndex: 12,
        title: '命令速查',
        items: [
          { term: 'git --version', description: '检查 Git 版本；本课要求至少 2.28，才配合 main 作为默认分支。' },
          { term: 'git config --global init.defaultBranch main', description: '把本地新建仓库的默认分支设为 main。' },
          { term: 'git clone git@github.com:用户名/仓库名.git', description: '把远端仓库完整复制到本地。' },
          { term: 'git remote -v', description: '查看本地副本连接的远端地址，两行分别以 (fetch) 和 (push) 结尾。' },
          { term: 'git status', description: '查看工作区与暂存区状态；官方要求每做完一步就跑一次。' },
          { term: 'git add 文件名', description: '把指定文件放进暂存区。' },
          { term: 'git add .', description: '把当前目录及全部子目录的改动都放进暂存区。' },
          { term: 'git commit -m "说明"', description: '把暂存区的改动打包成一次提交；只敲 git commit 会打开提交信息编辑器。' },
          { term: 'git log', description: '查看提交历史；停在显示 (END) 的界面时按 q 退出。' },
          { term: 'git push', description: '把本地提交上传到远端。' },
          { term: 'git push origin main', description: '完整写法：origin 指明推到哪个远端、main 指明推哪个分支；本课只和一个远端的 main 打交道，与 git push 等效。' },
          { term: 'git config --global core.editor "code --wait"', description: '把 VS Code 设为提交信息编辑器；执行后终端没有任何输出是正常的。' }
        ]
      }
    },
    'command-line-basics': {
      /* 落点第 13 章「官方的收尾：让它变成第二天性」：收尾章讲的就是「这些命令会变成
       * 第二天性」，在这里回看整课的操作顺序最贴合语境。五步全部来自正文既有命令
       * （whoami 第 2 章、cd 与 Tab 补全第 5/6 章、ls 与 mkdir 第 8 章、touch 第 11/12 章、
       * code 第 5/7 章）；正文没有出现 pwd / rm，因此不写进模块。 */
      process: {
        sectionIndex: 13,
        title: '流程复习',
        steps: [
          { title: '确认自己在哪', detail: 'whoami 返回你的用户名；cd ~ 回到主目录。' },
          { title: '移动到目标目录', detail: 'cd 加目录名；只敲开头几个字母再按 Tab 会自动补全。' },
          { title: '看看目录里有什么', detail: 'ls 列出当前目录的内容，常用来确认上一条命令是否生效。' },
          { title: '创建目录或文件', detail: 'mkdir 建目录，touch 建空文件。' },
          { title: '用编辑器打开', detail: 'code . 打开整个项目文件夹（带那个句点），code 加文件名打开单个文件。' }
        ]
      },
      /* 同样落第 13 章，顺序在流程复习之后：把散在各章的命令汇总成一处对照表。
       * 最后一条是第 2 章讲过的提示符阅读约定，属于「概念」而非命令。 */
      reference: {
        sectionIndex: 13,
        title: '命令速查',
        items: [
          { term: 'whoami', description: '返回你的用户名。' },
          { term: 'cd ~', description: '回到主目录；~ 就代表主目录。' },
          { term: 'cd 目录名', description: '进入指定目录；输入开头几个字母再按 Tab 会自动补全。' },
          { term: 'ls', description: '列出当前目录里的内容，用来确认命令是否生效。' },
          { term: 'mkdir 目录名', description: '创建一个新目录。' },
          { term: 'touch 文件名', description: '创建一个空文件。' },
          { term: 'code .', description: '启动 VS Code 并在侧边栏打开当前整个项目文件夹（注意那个句点）。' },
          { term: 'code 文件名', description: '用 VS Code 打开指定的文件或文件夹。' },
          { term: '$ 或 %', description: '提示符，表示终端在等你输入命令；教程里写在命令前的 $ 不要跟着输入。' }
        ]
      }
    }
  };

  /* 流程复习：纵向 <ol>，每步独占一行，序号是原生数字（视觉锚点）。
   * 不用 flex——章节导航踩过横向 wrap 让两项挤进同一行的坑。 */
  function buildProcessModule(spec) {
    const box = node('div', undefined, 'lesson-process');
    box.append(node('p', spec.title, 'lesson-process-title'));
    const steps = node('ol', undefined, 'lesson-process-list');
    spec.steps.forEach(item => {
      const step = node('li');
      step.append(node('span', item.title, 'lesson-process-step'));
      if (item.detail) step.append(node('span', item.detail, 'lesson-process-detail'));
      steps.append(step);
    });
    box.append(steps);
    return box;
  }

  /* 命令 / 概念速查：语义化 dl，一条 = 一个 dt（命令 / 概念）+ 一个 dd（说明）。
   * 结构与既有「重要英文术语」的 .term 同族，因此复用同一套已验证的窄屏换行形态。 */
  function buildReferenceModule(spec) {
    const box = node('div', undefined, 'lesson-reference');
    box.append(node('p', spec.title, 'lesson-reference-title'));
    const definitions = node('dl', undefined, 'lesson-reference-list');
    spec.items.forEach(item => {
      const row = node('div', undefined, 'lesson-reference-item');
      row.append(node('dt', item.term), node('dd', item.description));
      definitions.append(row);
    });
    box.append(definitions);
    return box;
  }

  /* 把两个模块插进「中文讲解」：本章正文与概念图之后、下一章 h3 之前。
   * 必须在概念图归位之后调用——复用同一份 explainHeads，顺序才是
   * 正文 → 概念图 → 流程复习 → 速查。坏数据（sectionIndex 越界）不渲染。 */
  function appendLessonModules(explain, explainHeads, lessonId) {
    const sample = LESSON_MODULE_SAMPLES[lessonId];
    if (!sample) return;
    [['process', buildProcessModule], ['reference', buildReferenceModule]].forEach(([kind, build]) => {
      const spec = sample[kind];
      if (!spec) return;
      const at = spec.sectionIndex;
      if (!Number.isInteger(at) || at < 0 || at >= explainHeads.length) return;
      const module = build(spec);
      const nextHead = explainHeads[at + 1];
      if (nextHead) explain.insertBefore(module, nextHead);
      else explain.append(module);
    });
  }

  /* v2 中文自足讲解布局：当前 46 课均带 sections 字段，都走此分支；上方旧导读布局作为兼容分支保留。 */
  function renderLessonV2(lesson) {
    main.classList.add('lesson-v2');
    const chapterIds = [];
    const usedChapterIds = new Set();
    lesson.sections.forEach((part, index) => chapterIds.push(chapterAnchorId(part.h, index, usedChapterIds)));
    const chapterNav = buildChapterNav(lesson, chapterIds);
    const why = section('这一课为什么重要', 'section-why');
    why.append(node('p', lesson.why));
    /* v4.11.2 D1：读者点任何外链离开本页之前，第 1 节就明确告知本站的中文辅助
     * 已自足（D0）：外部资料三种中文形态 + 官方自查题中文答案全部在本页，
     * 不必先去啃英文原文。红线（D6）：不声称本站即官方课程——Project、社区
     * 与其后课程仍在官方，末节与页尾的既有声明保持不变。
     * 资源分句按数据存在性拼接：external-resources.js 缺失时不承诺不存在的辅助。 */
    const whyHasResources = Boolean(resourceData && Array.isArray(resourceData.resources)
      && resourceData.resources.some(resource => resource.lessonId === lesson.id));
    /* v4.11.3 A：class 由 muted 提升为 lesson-guide（带左色条的提示块）。
     * v4.11.5（交接 3.B）：补一个分句告知 Assignment 标题旁有直达「本课外部
     * 资料」的页内链接（该事实全页只在这里说一次，官方任务节引导语不复述）。
     * v4.11.16 起按课型分支的说法（Project 课无官方自查题）在 v4.11.17 统一：
     * 官方 2026-09-23 移除课末自查题节后，全站课页的自查答案都只有本站自测一类，
     * 因此该分句固定为本站自测的说法，不再分支；D1 三要素
     * （中文辅助 / 自查答案在本页 / 不必先啃英文）保持齐全。
     * v4.11.19：零外部资料课（首个为课 26 Introduction to Flexbox，官方该课
     * 无任何学习资料外链）补第三分支——不承诺不存在的「本课外部资料」（与下方
     * 跳转链接守卫同一口径），但「中文辅助」三要素仍齐：此语境下本站的中文
     * 辅助就是本页中文讲解与自测本身。 */
    why.append(node('p', `${whyHasResources
      ? '本课要求的外部文章与视频，本站都备好了中文辅助——官方中文版入口、本站中文精译或中文速览，都在「官方任务」一节末尾的「本课外部资料」里，任务标题旁的链接可直达；'
      : '这一课官方没有布置外部文章与视频，本站的中文辅助就是本页的中文讲解与自测。'}本站自测题的答案也全部渲染在本页。你可以直接在本页学完这一课并自查，不必先去啃英文原文。`, 'lesson-guide'));
    main.append(why);

    const explain = section('中文讲解', 'section-explain');
    if (chapterNav) explain.append(chapterNav);
    explain.append(node('p', '以下讲解由本站依据官方原课自行编写，覆盖正文要点；官方内容若有更新，以原课为准。', 'muted'));
    lesson.sections.forEach((part, index) => {
      const heading = node('h3', part.h);
      heading.id = chapterIds[index];
      explain.append(heading);
      part.p.forEach(paragraph => explain.append(node('p', paragraph)));
      if (Array.isArray(part.list) && part.list.length) explain.append(list(part.list));
    });
    main.append(explain);

    /* §9 + v4.11.5（交接 3.E）：概念图按 sectionIndex 归位到「中文讲解」对应章节
     * 之后（下一章 h3 之前）；不带 sectionIndex 的图保持旧位置（整节之后追加）。
     * figure 不产生 h2，browser-smoke 对 main h2 序列的断言不受影响；正文一字未改。
     * sectionIndex 越界（坏数据）时回落旧位置，不让渲染崩——范围合法性由
     * diagrams.test.cjs 钉住，不会静默流入仓库。 */
    const explainHeads = [...explain.children].filter(child => child.tagName === 'H3');
    const floatingDiagrams = [];
    diagramsFor(lesson.id).forEach(item => {
      const figure = buildDiagram(item);
      if (Number.isInteger(item.sectionIndex) && item.sectionIndex >= 0 && item.sectionIndex < explainHeads.length) {
        const nextHead = explainHeads[item.sectionIndex + 1];
        if (nextHead) explain.insertBefore(figure, nextHead);
        else explain.append(figure);
      } else {
        floatingDiagrams.push(figure);
      }
    });
    floatingDiagrams.forEach(figure => main.append(figure));

    /* v4.11.9：流程复习 / 命令速查样板插在概念图归位**之后**——复用同一份
     * explainHeads，顺序才是「本章正文 → 概念图（如有）→ 流程复习 → 速查 → 下一章 h3」。
     * 只有样板表里有数据的课才渲染；短课与未覆盖的长课完全不受影响。
     * explainHeads 里只有 H3（模块标题是 <p>），因此模块不会污染概念图归位与锚点数量。 */
    appendLessonModules(explain, explainHeads, lesson.id);

    const terms = section('重要英文术语', 'section-terms');
    const definitions = node('dl', undefined, 'terms');
    lesson.terms.forEach(term => {
      const row = node('div', undefined, 'term');
      row.append(node('dt', term.en), node('dd', term.zh));
      definitions.append(row);
    });
    terms.append(definitions);
    main.append(terms);

    if (lesson.examples.length) {
      const examples = section('代码示例', 'section-examples');
      lesson.examples.forEach(example => {
        const figure = node('figure', undefined, 'code-example');
        const pre = node('pre');
        pre.append(node('code', example.code, `lang-${example.lang}`));
        figure.append(pre, node('figcaption', example.note, 'meta'));
        examples.append(figure);
      });
      main.append(examples);
    }

    const pitfalls = section('常见错误', 'section-pitfalls');
    lesson.pitfalls.forEach(item => {
      const card = node('div', undefined, 'pitfall');
      card.append(node('h3', item.title), node('p', item.text));
      pitfalls.append(card);
    });
    main.append(pitfalls);

    const official = section('官方任务', 'section-official');
    /* v4.11.5（交接 3.A / 3.B，CONTENT-STYLE-GUIDE.md 第 3、9 节）：仍是两句——
     * 第一句说本页有什么 + 列表可以用标题旁的按钮收起展开，第二句说外部资料
     * 去哪里找。v4.11.4 口径不变：官方入口全页只剩页顶 .official-start 一个，
     * 节级直接子 <a> 保持为 0（跳转入口挂在 Assignment 标题内，见下）。
     * v4.11.17：官方 2026-09-23 移除课末自查题节后，本节固定只有 Assignment
     * 一个列表（部分课另有 Exercise），引导语按数据分支只说实际存在的区块——
     * 不得描述页面上不存在的列表；两句结构不变。
     * v4.11.19：零外部资料课（首个为课 26）再补一分支——第二句不说「就在
     * 本节末尾的『本课外部资料』」，那是不存在的落点；改为如实说明本课
     * 没有外部资料。与第 1 节引导、下方跳转链接守卫同一口径。 */
    const officialResourceCount = (resourceData && Array.isArray(resourceData.resources))
      ? resourceData.resources.filter(resource => resource.lessonId === lesson.id).length : 0;
    /* v4.11.20 第九批：第 46 课（结语课）是官方唯一的无 Assignment 课——前言如实说明，
     * 不描述页面上不存在的 Assignment 列表（与零资料课分支同一口径）。 */
    const noOfficialAssignment = lesson.official.assignment.length === 0;
    official.append(node('p', noOfficialAssignment
      ? '这一课官方没有布置 Assignment（结语课，官方文件顶部声明因独特的课结构豁免常规布局）。本站只收录官方正文的中文化梳理与本站自拟的回顾任务；正文推荐的外部文章在下方「本课外部资料」有中文辅助入口。'
      : (officialResourceCount === 0
      ? '以下是官方原课的 Assignment 的中文化版本，Assignment 列表可以用标题旁的按钮收起或展开。这一课官方没有布置外部资料，跟着本页讲解与任务说明往下走即可。'
      : (lesson.official.exercise.length
        ? '以下是官方原课的 Assignment 与 Exercise 的中文化版本，Assignment 列表可以用标题旁的按钮收起或展开。这些任务要求的外部文章与视频，本站已备好中文辅助，就在本节末尾的「本课外部资料」。'
        : '以下是官方原课的 Assignment 的中文化版本，Assignment 列表可以用标题旁的按钮收起或展开。这些任务要求的外部文章与视频，本站已备好中文辅助，就在本节末尾的「本课外部资料」。')), 'lesson-guide'));
    /* v4.11.5（交接 3.B）：页内跳转入口——<a> 挂在 Assignment 标题（h3）内，
     * 不是节级直接子 <a>；文字与资源区标题逐字一致（风格指南第 9 节），是页内
     * 锚点不是外链，不加 ↗。目标资源区永不折叠，原生锚点直达、无需先展开。
     * 本课没有外部资料时不渲染——不承诺不存在的落点（与第 1 节引导同一口径）。 */
    const collapseNow = officialTasksCollapsed();
    /* v4.11.20 第九批：官方无 Assignment 的课（当前仅第 46 课结语课）不渲染
     * 「Assignment（必做）」标题与空列表——渲染空的「必做」列表是对官方结构的失实。 */
    if (!noOfficialAssignment) {
      const assignmentHead = node('h3', 'Assignment（必做）');
      if (officialResourceCount) {
        assignmentHead.append(link(`本课外部资料（本站中文辅助 · ${officialResourceCount} 条）`, '#lesson-resources', 'resource-jump'));
      }
      assignmentHead.append(buildCollapseToggle('official-assignment-body', OFFICIAL_COLLAPSE_LABELS.assignment, collapseNow));
      const assignmentBody = buildCollapseBody('official-assignment-body', collapseNow);
      assignmentBody.append(taskList(lesson.official.assignment, lesson.id, taskLinkMap(lesson.id), true));
      official.append(assignmentHead);
      official.append(assignmentBody);
    }
    if (lesson.official.exercise.length) official.append(node('h3', 'Exercise（动手练习）'), list(lesson.official.exercise, true));
    /* v4.11.17：官方 2026-09-23 移除课末自查题节，本站同步下线——这一段的
     * 自查题渲染区块（标题 + 折叠按钮 + 受控容器 + 题目列表）整块删除，
     * 不留永远不走的 if 分支与死样式。数据侧的自查题字段保留为空数组
     * （语义＝本站收录的官方自查题数），由 content.test.cjs 反向钉住：
     * 官方若恢复该节、有人往任意一课塞回一道题，测试先红。 */
    const optionalItems = lesson.official.optional.concat(lesson.optional);
    if (optionalItems.length) official.append(node('h3', '官方可选项 / 替代方式'), list(optionalItems));
    if (lesson.note) official.append(node('p', lesson.note, 'notice'));
    /* v4.11.19：零外部资料课不渲染这句说明——它描述的是下方资源区的内容来源，
     * 资源区整块不渲染时这句话就成了对不存在区块的悬空引用。 */
    if (officialResourceCount > 0) {
      official.append(node('p', noOfficialAssignment
        ? '官方原课未单列 Additional Resources 栏目。下方「本课外部资料」是官方正文中明确推荐阅读的外部资料（本课无 Assignment）；官方语气为推荐而非必做，资料卡内已如实标注。'
        : '官方原课未单列 Additional Resources 栏目。下方「本课外部资料」是官方正文与 Assignment 中明确要求学习的外部资料，属于任务的一部分而不是可选补充；不要把 Assignment 误当成可选。', 'meta'));
    }
    buildResourceBlock(lesson).forEach(part => official.append(part));
    main.append(official);

    const quiz = section('简单自测', 'section-quiz');
    quiz.append(node('p', '先用自己的话回答，再展开参考答案。这是本站编写的小检查，不是官方试题，答案在下面的折叠区里。', 'muted'));
    const questions = node('ol', undefined, 'quiz-list');
    lesson.quiz.forEach((item, questionIndex) => {
      const question = node('li', undefined, 'quiz-item');
      question.append(node('p', `${questionIndex + 1}. ${item.question}`, 'quiz-question'));
      const details = node('details');
      details.append(node('summary', '查看参考答案'), node('p', item.answer, 'answer'));
      question.append(details);
      questions.append(question);
    });
    quiz.append(questions);
    main.append(quiz);
    /* v4.11.4 A4（CONTENT-STYLE-GUIDE.md 第 6 节「课页末不设收束节」）：
     * 「回到官方原课」末节整节移除——功能上翻页导航与页顶 .official-start 入口
     * 已覆盖（本课与下一课、官方原页都可达）；合规上署名与非官方声明由
     * lesson.html 页脚固定承担（CC BY-NC-SA 红线，页脚不动）；审计信息
     * （来源 / 核对日期）的事实源在 SOURCES.md 与 sources.json。 */
  }

  if (document.body.dataset.page === 'lesson') renderLesson();
  else renderHome();

  /* v4.5（交接 A2）：footer 版本行——版本号只读 version.js（单一事实源），
   * HTML 不硬编码；file:// 双击打开时 version.js 同样加载，照常显示。 */
  mountFooterVersion();

  /* v4.5（Stretch K8）：版本不匹配轻提示——文件混装缓存 / 档案比代码新时
   * 给一条持久 role=status 提示（Ctrl+F5 + 数据没有丢），不阻断任何功能。 */
  mountVersionMismatchNote();

  /* 计时与成就：课页按课累计有效学习时长，首页累计但不归属具体课程。
   * 顺序有硬约束：先挂玩家入口，再注册成就回调，最后启动计时——
   * startTimer 会立刻记录本次访问并可能当场解锁“迈出第一步”，回调晚注册的话
   * 这条提示就永远不会出现（v3 实际发现并修复过的缺陷，本轮保持同样的约束）。 */
  /* header 右侧容器先建好：课程目录按钮不依赖 progress，玩家入口依赖。
   * 顺序即视觉顺序 —— 目录（导航类）在左，头像入口（个人类）在右。 */
  const headerRight = mountHeaderRight();
  /* v4.4（交接 A1）：课程目录按钮两页都挂——首页不再内联 46 行目录，
   * 目录住进 dialog，header 按钮与 hero 卡内按钮是两个入口。
   * 顺序即视觉顺序：目录（导航类）→ 主题（外观类）→ 头像（个人类）。 */
  mountCatalogButton(headerRight);
  /* 学习助手挂在 body 上、固定在右下角，首页与课程页都有（§10） */
  mountAssistant();
  /* v4.2：返回顶部/底部（两页都有）；阅读位置条只在课程页（§14） */
  mountScrollButtons();
  if (document.body.dataset.page === 'lesson') mountReadingPosition();
  /* v4.2：快捷键（§14.3；输入框聚焦不触发，见 handleShortcut） */
  mountShortcuts();
  if (progress) {
    /* v4.4（交接 A1/B2）：主题快捷入口挂在头像左侧——高频、感知强的功能
     * 在 header 一步直达，不埋进个人资料面板。 */
    mountThemeButton(headerRight);
    mountPlayerEntry(headerRight);
    /* v4.2：启动即应用当前主题与界面设置（幂等） */
    applyTheme();
    applyUiSettings();
    /* v4.2：跨标签页同步——课页勾选完成时，已打开的首页 Dashboard 立即更新（§2.2） */
    watchStorage();
    progress.onAchievement(unlockedIds => {
      showAchievementNote(unlockedIds);
      /* 新成就可能同时解锁头像框，玩家入口与面板都要跟着刷新 */
      refreshAll();
    });
    /* v4.5（交接 Core E2）：升级合并式祝贺——一次升级（哪怕跨多级）只发
     * 一条轻提示「升级 + 新解锁装扮名单」，走成就同一条低干扰通道（底部
     * 静态小条 + 同一开关），绝不连弹 Modal。旧档案载入时 celebratedLevel
     * 已被 progress 种到当前等级，曲线调整 / 导入档案不会追溯狂发祝贺；
     * 回调注册必须在 startTimer 之前——startTimer 会立刻触发第一次结算。 */
    if (progress.onLevelUp) {
      progress.onLevelUp(levelUp => {
        const names = levelUnlockedCosmeticNames(levelUp.fromLevel, levelUp.toLevel);
        const jump = levelUp.toLevel > levelUp.fromLevel + 1 ? `（连升 ${levelUp.toLevel - levelUp.fromLevel} 级）` : '';
        const unlockedText = names.length
          ? `新解锁：${names.slice(0, 6).join('、')}${names.length > 6 ? ` 等 ${names.length} 项` : ''}，打开右上角个人资料 → 装扮收藏 / 伙伴装扮就能装备。`
          : '';
        showRewardNote(`升级啦 · Lv.${levelUp.fromLevel} → Lv.${levelUp.toLevel}${jump}！${unlockedText}`);
        /* Stretch K3：升级联动伙伴庆祝表情 + 轻动画（6 秒窗口，内存态） */
        startCelebration();
        /* 等级变了：玩家入口 / 面板 / 等级解锁的装扮都要重画 */
        refreshAll();
      });
    }
    /* v4.3（交接 D1/D2）：循环成就晋升与挑战完成的低干扰提示（与成就同通道、
     * 同开关）。晋升 / 结算发生在 afterChange（保存钩子）里，回调注册必须
     * 在 startTimer 之前——startTimer 会立刻触发第一次结算。 */
    if (progress.onTierUp) {
      progress.onTierUp(promoted => {
        promoted.forEach(item => {
          showRewardNote(`循环成就晋升 · ${item.familyZh} → ${item.tierZh}阶${item.amount > 0 ? `（+${item.amount} 叶片）` : ''}`);
        });
        /* Stretch K3：晋升也是成就时刻，联动伙伴庆祝（6 秒窗口，内存态） */
        startCelebration();
        refreshAll();
      });
    }
    if (progress.onChallenge) {
      progress.onChallenge(settled => {
        settled.forEach(item => {
          showRewardNote(`挑战完成 · ${item.zh}（+${item.amount} 叶片，每周期只结算一次）`);
        });
        refreshAll();
      });
    }
    /* v4.5（交接 Core F）：首次有效读到本课结尾——轻提示走成就同一条低干扰
     * 通道（底部静态小条 + 同一开关），文案明确「阅读里程碑 ≠ 课程完成」，
     * 不勾选任何完成状态、不弹窗。发放判定与防刷闩锁全在 progress 侧。 */
    if (progress.onReadComplete) {
      progress.onReadComplete(result => {
        showRewardNote(`已读到本课结尾（+${result.xp} XP · +${result.coins} 叶片，每课一次）。阅读里程碑不等于课程完成——真正学完后，请自己勾选「本课已完成」。`);
        refreshAll();
      });
    }
    progress.startTimer(activeLessonId);
    /* 与 15 秒保存周期一致地推进面板里的时长数值；不做每秒重绘。 */
    window.setInterval(tickLiveStats, progress.Logic.SAVE_INTERVAL_MS);
  }
})();
