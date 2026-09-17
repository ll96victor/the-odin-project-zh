/* v4.3 Batch 6（交接 H/I/J）：视觉资产扩充、小奥成长阶段、收藏体验重做。
 *
 * 覆盖：
 *   1. 成长阶段（I）：数据形状、阈值边界、阶梯语义（不跳阶）、单调不回退、
 *      确定性纯函数（不改入参、无 Date/random）、与皮肤 id 彻底分离、
 *      无死亡/枯萎/掉级语义；
 *   2. 资产总量（H）：四类资产都落进交接建议区间，B2 的默认免费底线不回退；
 *   3. 资产数据完整性：解锁方式合法、id 唯一合法、成就引用真实存在、
 *      SVG 良构无脚本无远程引用；
 *   4. 价格三档（J）：20–40 / 60–100 / 120–200，每类都有低档位，
 *      存在 20 叶片档（第一课 +20 叶片立刻买得起），高价收口 200；
 *   5. 购买集成：模拟第一课奖励 → 恰好解锁一件便宜装扮；
 *   6. 成就独立图标（H）：≥15 个、键都是真实成就、SVG 互不相同、
 *      app.js 不再要求 milestone 标记；
 *   7. CSS / token / UI 接线同步：新框与新主题有样式定义，
 *      收藏柜分组、已拥有徽章、收藏进度、成长角标都接进了 app.js。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const sandbox = { window: {} };
sandbox.window = sandbox;
for (const name of ['lessons.js', 'catalog.js', 'avatars.js', 'icons.js', 'companions.js', 'themes.js', 'bosses.js', 'map.js', 'economy.js', 'collections.js', 'daily.js', 'stats.js', 'challenges.js', 'tiers.js', 'history.js', 'progress.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, name), 'utf8'), sandbox);
}
const progress = sandbox.window.ODIN_PROGRESS;
const Logic = progress.Logic;
const collections = sandbox.window.ODIN_COLLECTIONS;
const economy = sandbox.window.ODIN_ECONOMY;
const COMPANIONS = sandbox.window.ODIN_COMPANIONS;
const AVATARS = sandbox.window.ODIN_AVATARS;
const THEMES = sandbox.window.ODIN_THEMES;
const ICONS = sandbox.window.ODIN_ICONS;
const lessons = JSON.parse(JSON.stringify(sandbox.window.ODIN_GUIDE.lessons));
const lessonIds = lessons.map(lesson => lesson.id);
const fresh = () => Logic.emptyState();
const withType = (type, list) => list.map(item => Object.assign({}, item, { type }));
/* vm 沙箱返回的数组/对象属于另一个 realm，deepEqual 前先 JSON 往返拉回本 realm */
const local = value => JSON.parse(JSON.stringify(value));
let checks = 0;
const check = label => { checks += 1; return label; };

/* SVG 良构与安全（与 profile.test 同一口径：data URL 渲染路径的前提） */
function assertSvgOk(svg, label) {
  assert.ok(typeof svg === 'string' && svg.startsWith('<svg') && svg.endsWith('</svg>'), check(`${label}: SVG 良构`));
  assert.ok(!svg.includes('<script'), check(`${label}: 不含脚本`));
  assert.ok(!svg.replace(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '').includes('http'), check(`${label}: 无远程引用`));
}

/* ===================== 1. 小奥成长阶段（交接 I） ===================== */
{
  const stages = COMPANIONS.growthStages;
  assert.equal(stages.length, 5, check('成长阶段共 5 阶：幼芽→幼苗→小树→开花→结果'));
  assert.deepEqual(local(stages.map(s => s.zh)), ['幼芽', '幼苗', '小树', '开花', '结果'], check('阶段中文名与交接 I 建议一致'));
  assert.equal(stages[0].ornament, null, check('幼芽阶段不挂角标（初始状态保持干净）'));
  for (let i = 1; i < stages.length; i += 1) {
    assertSvgOk(stages[i].ornament, `阶段 ${stages[i].zh} 角标`);
    assert.ok(stages[i].reach && stages[i].reach.length > 5, check(`阶段 ${stages[i].zh} 有达成条件文案`));
  }
  const ornaments = stages.slice(1).map(s => s.ornament);
  assert.equal(new Set(ornaments).size, ornaments.length, check('四个阶段角标互不相同'));
  for (const stage of stages) {
    assert.ok(!/枯萎|死亡|掉级|生病|凋零/.test(`${stage.zh}${stage.desc}`), check(`阶段 ${stage.zh} 无死亡/枯萎/掉级语义（Finch 式无惩罚陪伴）`));
  }
  assert.equal(COMPANIONS.growthThresholds.length, 5, check('阈值表与阶段一一对应'));
  assert.equal(COMPANIONS.growthThresholds[0], null, check('第 0 阶无条件（初始即是）'));

  const stageOf = m => COMPANIONS.growthStageOf(m);
  /* 边界：每一阶的三个维度分别压线 */
  assert.equal(stageOf({}), 0, check('空输入安全回落幼芽'));
  assert.equal(stageOf({ level: 1, totalSeconds: 0, completedUnits: 0 }), 0, check('新档案是幼芽'));
  assert.equal(stageOf({ level: 2, totalSeconds: 2 * 3600 - 1, completedUnits: 0 }), 0, check('差 1 秒到 2 小时仍是幼芽'));
  assert.equal(stageOf({ level: 2, totalSeconds: 2 * 3600, completedUnits: 0 }), 1, check('累计 2 小时压线进幼苗'));
  assert.equal(stageOf({ level: 3, totalSeconds: 0, completedUnits: 0 }), 1, check('Lv.3 压线进幼苗'));
  assert.equal(stageOf({ level: 5, totalSeconds: 10 * 3600 - 1, completedUnits: 0 }), 1, check('差 1 秒到 10 小时仍是幼苗'));
  assert.equal(stageOf({ level: 6, totalSeconds: 0, completedUnits: 0 }), 2, check('Lv.6 进小树'));
  assert.equal(stageOf({ level: 1, totalSeconds: 10 * 3600, completedUnits: 0 }), 2, check('10 小时也能进小树（时长路径）'));
  assert.equal(stageOf({ level: 10, totalSeconds: 0, completedUnits: 0 }), 3, check('Lv.10 进开花'));
  assert.equal(stageOf({ level: 6, totalSeconds: 0, completedUnits: 2 }), 3, check('完成 2 个单元进开花（单元路径，先过小树阶）'));
  assert.equal(stageOf({ level: 15, totalSeconds: 0, completedUnits: 0 }), 4, check('Lv.15 进结果'));
  assert.equal(stageOf({ level: 6, totalSeconds: 0, completedUnits: 4 }), 4, check('完成 4 个单元进结果'));
  assert.equal(stageOf({ level: 1, totalSeconds: 60 * 3600, completedUnits: 0 }), 4, check('累计 60 小时直通结果（时长逐阶满足）'));

  /* 阶梯语义：不跳阶——单元数再高也要先满足幼苗/小树的条件 */
  assert.equal(stageOf({ level: 1, totalSeconds: 0, completedUnits: 4 }), 0, check('单元满格但没过幼苗门槛：不跳阶，仍是幼芽'));
  assert.equal(stageOf({ level: 3, totalSeconds: 0, completedUnits: 4 }), 1, check('Lv.3 + 4 单元：过了幼苗但小树没有单元条件，停在幼苗'));

  /* 单调性：任何一维只增不减时阶段绝不回退（遍历支配对） */
  const samples = [];
  for (const level of [0, 1, 3, 6, 10, 15, 20]) {
    for (const hours of [0, 1, 2, 9, 10, 29, 30, 59, 60]) {
      for (const units of [0, 1, 2, 3, 4]) samples.push({ level, totalSeconds: hours * 3600, completedUnits: units });
    }
  }
  for (const a of samples) {
    for (const b of samples) {
      if (b.level >= a.level && b.totalSeconds >= a.totalSeconds && b.completedUnits >= a.completedUnits) {
        assert.ok(stageOf(b) >= stageOf(a), `成长单调：${JSON.stringify(a)} → ${JSON.stringify(b)} 不回退`);
      }
    }
  }
  checks += 1;

  /* 确定性 + 纯度：同输入同输出、不改入参、无 Date/random 参与 */
  const input = { level: 5, totalSeconds: 3600, completedUnits: 1 };
  const copy = JSON.parse(JSON.stringify(input));
  assert.equal(stageOf(input), stageOf(input), check('同输入必同输出（确定性）'));
  assert.deepEqual(input, copy, check('growthStageOf 不修改入参（纯函数）'));
  const companionSource = fs.readFileSync(path.join(root, 'companions.js'), 'utf8');
  assert.ok(!companionSource.includes('Date.now'), check('companions.js 不用 Date.now（阶段推导与时刻无关）'));
  assert.ok(!companionSource.includes('Math.random'), check('companions.js 不用随机数'));

  /* growthBrief：UI 简报与皮肤彻底分离 */
  const brief0 = COMPANIONS.growthBrief({ level: 1, totalSeconds: 0, completedUnits: 0 });
  assert.equal(brief0.stage, 0, check('简报：新档案 stage 0'));
  assert.equal(brief0.zh, '幼芽', check('简报带阶段中文名'));
  assert.equal(brief0.maxed, false, check('简报：未满阶'));
  assert.equal(brief0.next.zh, '幼苗', check('简报：下一阶段是幼苗'));
  assert.ok(brief0.next.reach.includes('Lv.3'), check('简报：下一阶段条件提到 Lv.3'));
  assert.equal(brief0.ornament, null, check('简报：幼芽无角标'));
  assert.ok(!('companionId' in brief0) && !('skin' in brief0), check('成长简报不含皮肤 id——两个维度不混用一个字段'));
  const briefMax = COMPANIONS.growthBrief({ level: 20, totalSeconds: 100 * 3600, completedUnits: 4 });
  assert.equal(briefMax.stage, 4, check('简报：满阶 stage 4'));
  assert.equal(briefMax.maxed, true, check('简报：满阶 maxed'));
  assert.equal(briefMax.next, null, check('简报：满阶没有下一阶段'));
  assertSvgOk(briefMax.ornament, '满阶角标');
  /* 同一 metrics 换任何皮肤都不影响阶段（皮肤 id 根本不进函数） */
  assert.equal(COMPANIONS.growthStageOf({ level: 6, totalSeconds: 0, completedUnits: 0 }), 2, check('阶段推导与装备的形象无关'));
}

/* ===================== 2. 资产总量（交接 H 目标区间 + B2 底线） ===================== */
{
  const avatars = AVATARS.avatars;
  const frames = Logic.FRAMES;
  const companions = COMPANIONS.companions;
  const themes = THEMES.themes;
  assert.ok(avatars.length >= 32 && avatars.length <= 40, check(`头像总数在 H 目标 32–40（实际 ${avatars.length}）`));
  assert.ok(frames.length >= 24 && frames.length <= 30, check(`头像框总数在 H 目标 24–30（实际 ${frames.length}）`));
  assert.ok(companions.length >= 10 && companions.length <= 14, check(`小奥形象总数在 H 目标 10–14（实际 ${companions.length}）`));
  assert.ok(themes.length >= 24 && themes.length <= 30, check(`主题总数在 v4.4 交接 C1 目标 24–30（实际 ${themes.length}）`));
  /* B2 免费底线不回退 */
  assert.ok(avatars.filter(a => a.unlock.kind === 'default').length >= 12, check('B2：默认头像仍 ≥12'));
  assert.ok(frames.filter(f => f.unlock.kind === 'level' && f.unlock.value === 1).length >= 4, check('B2：默认可用框仍 ≥4'));
  assert.ok(companions.filter(c => c.unlock.kind === 'default').length >= 4, check('B2：默认形象仍 ≥4'));
  const defaultThemes = themes.filter(t => t.unlock.kind === 'default');
  assert.ok(defaultThemes.length >= 4, check('B2：默认主题仍 ≥4'));
  assert.ok(defaultThemes.some(t => t.id === 'night'), check('B2：深色主题「夜空」仍默认开放'));
  /* H 视觉方向：新增资产不引大图——四类数据文件体积合计 < 120 KB */
  const totalBytes = ['avatars.js', 'companions.js', 'themes.js', 'icons.js']
    .reduce((sum, file) => sum + fs.statSync(path.join(root, file)).size, 0);
  assert.ok(totalBytes < 120 * 1024, check(`资产数据文件合计 ${(totalBytes / 1024).toFixed(1)} KB < 120 KB（H 体积原则：SVG/CSS 数据驱动，无大图）`));
}

/* ===================== 3. 资产数据完整性 ===================== */
{
  const ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
  const achievementIds = new Set(Logic.ACHIEVEMENTS.map(a => a.id));
  const checkList = (list, label, hasSvg) => {
    const ids = list.map(item => item.id);
    assert.equal(new Set(ids).size, ids.length, check(`${label}: id 不重复`));
    for (const item of list) {
      assert.ok(ID_PATTERN.test(item.id), check(`${label}: ${item.id} id 合法（小写字母数字连字符）`));
      assert.ok(typeof item.zh === 'string' && item.zh.trim(), check(`${label}: ${item.id} 有中文名`));
      assert.ok(collections.UNLOCK_KINDS.includes(item.unlock.kind), check(`${label}: ${item.id} 解锁方式合法`));
      if (item.unlock.kind === 'achievement') {
        assert.ok(achievementIds.has(item.unlock.value), check(`${label}: ${item.id} 绑定的成就真实存在`));
      }
      if (item.unlock.kind === 'level') {
        assert.ok(Number.isInteger(item.unlock.value) && item.unlock.value >= 1, check(`${label}: ${item.id} 解锁等级为正整数`));
      }
      if (item.unlock.kind === 'coins') {
        assert.ok(Number.isInteger(item.unlock.value) && item.unlock.value >= 20, check(`${label}: ${item.id} 叶片价格为 ≥20 的整数`));
      }
      if (hasSvg) assertSvgOk(item.svg, `${label}: ${item.id}`);
    }
  };
  checkList(AVATARS.avatars, '头像', true);
  checkList(COMPANIONS.companions, '形象', true);
  checkList(Logic.FRAMES, '头像框', false);
  checkList(THEMES.themes, '主题', false);
  for (const companion of COMPANIONS.companions) {
    assert.ok(typeof companion.voice === 'string' && companion.voice.trim(), check(`形象 ${companion.id} 有固定语气文案`));
  }
  for (const theme of THEMES.themes) {
    assert.ok(theme.swatch && theme.swatch.bg && theme.swatch.accent && theme.swatch.ink, check(`主题 ${theme.id} 色卡三色齐全`));
  }
}

/* ===================== 4. 叶片价格三档（交接 J） ===================== */
{
  const coinAssets = [
    ...withType('avatar', AVATARS.avatars),
    ...withType('frame', Logic.FRAMES),
    ...withType('companion', COMPANIONS.companions),
    ...withType('theme', THEMES.themes)
  ].filter(asset => asset.unlock.kind === 'coins');
  const inBand = p => (p >= 20 && p <= 40) || (p >= 60 && p <= 100) || (p >= 120 && p <= 200);
  for (const asset of coinAssets) {
    assert.ok(inBand(asset.unlock.value), check(`${asset.type}:${asset.id} 价格 ${asset.unlock.value} 落在三档区间（20–40 / 60–100 / 120–200）`));
  }
  /* 每个类型都有低档位（20–40）——好看的不都集中在 100+ */
  for (const type of collections.ASSET_TYPES) {
    const low = coinAssets.filter(a => a.type === type && a.unlock.value <= 40);
    assert.ok(low.length >= 1, check(`${type} 类有 20–40 低档位叶片收藏`));
  }
  /* 第一课完成 +20 叶片：必须存在恰好 ≤20 叶片的装扮（立刻买得起） */
  assert.ok(coinAssets.some(a => a.unlock.value <= 20), check('存在 ≤20 叶片的装扮（交接 J：第一课完成后至少能解锁 1 件）'));
  const byId = (list, id) => list.find(item => item.id === id);
  assert.equal(byId(AVATARS.avatars, 'pencil').unlock.value, 20, check('铅笔头 20 叶片（低档位锚点）'));
  assert.equal(byId(Logic.FRAMES, 'frame-cocoa').unlock.value, 25, check('可可框 25 叶片'));
  assert.equal(byId(AVATARS.avatars, 'bulb').unlock.value, 120, check('灯泡 110→120（收进高档位区间）'));
  assert.equal(byId(Logic.FRAMES, 'frame-aurora').unlock.value, 200, check('极光框 220→200（交接 J：高价档上限 200）'));
  const maxPrice = Math.max(...coinAssets.map(a => a.unlock.value));
  assert.ok(maxPrice <= 200, check(`全部叶片价格 ≤200（实际最高 ${maxPrice}）`));
}

/* ===================== 5. 购买集成：第一课奖励恰好解锁一件 ===================== */
{
  const state = fresh();
  const gained = economy.awardLessonCoins(state, 'completed', lessonIds[0]);
  assert.equal(gained, 20, check('首次完成一课 +20 叶片（economy 规则表）'));
  assert.equal(state.coins, 20, check('叶片入账'));
  const pencil = withType('avatar', AVATARS.avatars).find(a => a.id === 'pencil');
  const result = collections.purchaseAsset(state, pencil, economy);
  assert.equal(result.ok, true, check('20 叶片恰好解锁铅笔头（交接 J 的第一课→装扮闭环）'));
  assert.equal(state.coins, 0, check('解锁后余额归零'));
  assert.equal(collections.isAssetUnlocked(state, pencil), true, check('解锁闩锁生效'));
  /* 再买 25 叶片的可可框：余额不足，明确拒绝且不出现负数 */
  const cocoa = withType('frame', Logic.FRAMES).find(f => f.id === 'frame-cocoa');
  const fail = collections.purchaseAsset(state, cocoa, economy);
  assert.equal(fail.ok, false, check('余额不足拒绝解锁'));
  assert.equal(state.coins, 0, check('拒绝后余额不为负'));
}

/* ===================== 6. 成就独立图标（交接 H） ===================== */
{
  const unique = ICONS.achievementMilestones;
  const ids = Object.keys(unique);
  assert.ok(ids.length >= 15, check(`独立成就图标 ≥15 个（实际 ${ids.length}，v4.2 的 5 个 + Batch 6 的 12 个）`));
  const achievementIds = new Set(Logic.ACHIEVEMENTS.map(a => a.id));
  for (const id of ids) {
    assert.ok(achievementIds.has(id), check(`独立图标 ${id} 是真实成就 id`));
    assertSvgOk(unique[id], `独立图标 ${id}`);
  }
  const svgs = ids.map(id => unique[id]);
  assert.equal(new Set(svgs).size, svgs.length, check('独立图标互不相同（差异化，不复用同一稿）'));
  /* 类别图标仍然齐全（没有独立图标的成就按类别渲染） */
  for (const category of Logic.ACHIEVEMENT_CATEGORIES) {
    assert.ok(ICONS.achievementCategories[category.id], check(`类别 ${category.id} 有图标`));
  }
  /* 铜/银/金阶级徽章：独立但同骨架（参数化），三阶互不相同 */
  const badges = ICONS.tierBadges;
  assert.ok(badges.bronze && badges.silver && badges.gold, check('铜/银/金三阶徽章齐全'));
  assert.notEqual(badges.bronze, badges.silver, check('铜银徽章不同稿'));
  assert.notEqual(badges.silver, badges.gold, check('银金徽章不同稿'));
  for (const tier of ['bronze', 'silver', 'gold']) assertSvgOk(badges[tier], `阶级徽章 ${tier}`);
  /* app.js：独立图标不再要求 milestone 标记（Batch 6 去掉门槛） */
  const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.ok(!appSource.includes('achievement.milestone && icons.achievementMilestones'), check('achievementIcon 不再用 milestone 标记挡独立图标'));
  assert.ok(appSource.includes('icons.achievementMilestones[achievement.id]'), check('独立图标查找仍然在位'));
}

/* ===================== 7. CSS / token / UI 接线同步 ===================== */
{
  const styleCss = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  const tokensCss = fs.readFileSync(path.join(root, 'tokens.css'), 'utf8');
  const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  /* 新头像框的视觉定义 */
  for (const css of ['frame-cocoa', 'frame-dawn', 'frame-boss']) {
    assert.ok(styleCss.includes(`.${css} `), check(`style.css 含 .${css} 视觉定义`));
  }
  /* 每个框的 css 类都有定义（防“数据有、样式无”的开天窗） */
  for (const frame of Logic.FRAMES) {
    assert.ok(styleCss.includes(`.${frame.css}`), check(`style.css 含 ${frame.id} 的 .${frame.css}`));
  }
  /* 新主题的 token 覆盖 */
  for (const id of ['plum', 'clay']) {
    assert.ok(tokensCss.includes(`html[data-theme="${id}"]`), check(`tokens.css 含 ${id} 主题变量`));
  }
  /* 成长角标样式 */
  assert.ok(styleCss.includes('.companion-growth'), check('style.css 含成长角标样式'));
  /* 收藏柜重做（J）的 UI 接线 */
  assert.ok(appSource.includes('UNLOCK_GROUPS'), check('app.js 有解锁方式分组表'));
  for (const zh of ['默认可用', '学习解锁', '成就解锁', '叶片解锁']) {
    assert.ok(appSource.includes(zh), check(`app.js 分组标签「${zh}」在位（交接 J 四类）`));
  }
  assert.ok(appSource.includes('collection-progress'), check('app.js 渲染收藏进度概览'));
  assert.ok(appSource.includes('已拥有') && appSource.includes('未拥有'), check('app.js 渲染已拥有/未拥有徽章'));
  assert.ok(appSource.includes('companion-growth'), check('app.js 挂成长角标'));
  assert.ok(appSource.includes('成长阶段'), check('app.js 助手面板显示成长阶段'));
  assert.ok(!/function buildFrameOptionsList[\s\S]{0,2200}node\('p', '未解锁'/.test(appSource), check('头像框未解锁不再只显示「未解锁」，而是具体解锁方式'));
  /* v4.3 Batch 7（交接 K）：四类 picker 与身份卡快速装扮入口、移动端收口 */
  for (const fn of ['openAvatarPicker', 'openFramePicker', 'openCompanionPicker', 'openThemePicker']) {
    assert.ok(appSource.includes(`function ${fn}`), check(`app.js 有独立 picker：${fn}（交接 K：四类装扮各自弹窗）`));
  }
  /* v4.4（交接 B1）：身份卡快速装扮入口升级为「我的形象」四并列卡（头像/头像框/小奥/主题） */
  assert.ok(appSource.includes('identity-entries') && appSource.includes('appearance-group'), check('B1：我的形象第一屏按用户概念合并装扮入口'));
  /* v4.4：picker 工厂重构后 Esc 降级列表改为遍历注册表（不再点名四个变量） */
  assert.ok(appSource.includes('pickerRegistry') && /Escape[\s\S]{0,400}pickerRegistry/.test(appSource), check('Esc 降级关闭遍历 picker/sheet 注册表'));
  assert.ok(styleCss.includes('@media (max-width: 30rem)'), check('style.css 有移动端（≤480px）收口'));
  /* v4.4：移动端收口块会随版本追加（不再只有一个），把所有 ≤30rem 块合并后检查 */
  const mobileBlock = styleCss.split('@media (max-width: 30rem)').slice(1).join('\n');
  for (const hook of ['.heatmap-grid', '.tier-list', '.map-node', '.collection-progress']) {
    assert.ok(mobileBlock.includes(hook), check(`移动端收口覆盖 ${hook}（v4.3 新区块 320px 可用）`));
  }
  /* 热力图月份标签列宽与格子列宽一致（对齐修复） */
  assert.ok(styleCss.includes('.heatmap-months { display: grid; grid-auto-flow: column; grid-auto-columns: .95rem'), check('月份标签列宽 = 格子列宽 .95rem（Batch 7 对齐修复）'));
  /* ---------- v4.3 Batch 9（交接 M）：Expansion 接线 ---------- */
  const challengesSource = fs.readFileSync(path.join(root, 'challenges.js'), 'utf8');
  const progressSource = fs.readFileSync(path.join(root, 'progress.js'), 'utf8');
  const mapSource = fs.readFileSync(path.join(root, 'map.js'), 'utf8');
  assert.ok(challengesSource.includes('MONTHLY_POOL') && challengesSource.includes('challengeOfMonth'), check('M2：challenges.js 有每月挑战池与确定性选择'));
  assert.ok(challengesSource.includes('monthGoalDays') && challengesSource.includes('coin:daily-goal:'), check('M2：月度目标天数从 coinFlags 日闩锁推导（不新增 counter）'));
  assert.ok(appSource.includes("'每月'"), check('M2：挑战卡 UI 显示每月行'));
  assert.ok(mapSource.includes('rating: bossRating ? bossRating.id : null'), check('M3：unitViews 暴露评级 id（徽章可见化的数据源）'));
  assert.ok(appSource.includes('map-boss-rating'), check('M3：地图上渲染 Boss 评级徽章'));
  assert.ok(appSource.includes('map-unit-summary') && appSource.includes('章节完成'), check('M17：章节完成小结'));
  assert.ok(appSource.includes('print-summary') && appSource.includes('打印学习总结') && appSource.includes('window.print()'), check('M19：可打印学习总结'));
  assert.ok(progressSource.includes('function reviewUpcoming') && progressSource.includes('reviewUpcomingList'), check('M20：reviewUpcoming 逻辑与适配层'));
  assert.ok(appSource.includes('review-upcoming-list') && appSource.includes('接下来的复习安排'), check('M20：复习卡渲染未来安排列表'));
  assert.ok(appSource.includes('collection-controls') && appSource.includes('只看已拥有') && appSource.includes('只看未拥有'), check('M21：收藏筛选控件'));
  assert.ok(appSource.includes('叶片价格从低到高') && appSource.includes('function collectionView'), check('M21：收藏排序（叶片价格）'));
  assert.ok(appSource.includes('最近解锁') && appSource.includes('recent-unlocks'), check('M22：成就区最近解锁'));
  assert.ok(appSource.includes('function nextCosmeticHint') && appSource.includes('下一件装扮'), check('M23：小奥面板下一件可解锁装扮提示'));
  for (const hook of ['.collection-controls', '.recent-unlocks', '.map-boss-rating', '.map-unit-summary', '.review-upcoming-list', '.print-summary']) {
    assert.ok(styleCss.includes(hook), check(`style.css 含 ${hook}（Batch 9 样式落点）`));
  }
  assert.ok(styleCss.includes('body:has(> .print-summary)'), check('打印样式用 :has 条件生效（无总结时不破坏普通打印）'));
  /* ---------- v4.3 Batch 10（Stretch N）：接线 ---------- */
  const statsSource = fs.readFileSync(path.join(root, 'stats.js'), 'utf8');
  assert.ok(statsSource.includes('consistencyPct') && statsSource.includes('last30StudyDays'), check('N1：stats.js 有近 30 天一致率'));
  assert.ok(statsSource.includes('function bestDayBefore'), check('N4：stats.js 有今天之前单日纪录函数'));
  assert.ok(statsSource.includes('function summaryMarkdown'), check('N11/N12：stats.js 有 Markdown 拼装纯函数'));
  assert.ok(progressSource.includes('precheck-master') && progressSource.includes('mastered-3'), check('N5：两个新隐藏成就在 ACHIEVEMENTS 表里'));
  assert.ok(progressSource.includes('PRECHECK_HIGH_PCT'), check('N5：预检高评价线常量（与 bosses.js 钉住一致）'));
  assert.ok(appSource.includes('record-note') && appSource.includes('新的单日学习纪录'), check('N4：今日学习卡渲染纪录刷新提示'));
  assert.ok(appSource.includes('近 30 天一致率'), check('N1：个人最佳区渲染一致率格'));
  assert.ok(appSource.includes('导出 Markdown 总结') && appSource.includes('summaryMarkdown(collectSummaryData())'), check('N11/N12：导出按钮与打印总结同源数据'));
  assert.ok(appSource.includes('本周总结') && appSource.includes('countMarkedInRange'), check('N12：本周总结与每日/每周卡同口径'));
  assert.ok(appSource.includes('current-unit-card') && appSource.includes('当前章节'), check('N14：全局当前章节卡'));
  assert.ok(appSource.includes('buildCurrentUnitCard()'), check('N14：当前章节卡接入 Dashboard 刷新链'));
  assert.ok(styleCss.includes('.record-note') && styleCss.includes('.current-unit-card'), check('N4/N14 的 CSS 落点'));
}

console.log(`通过：Batch 6 资产扩充与成长系统 ${checks} 项断言（成长阶段五阶阈值边界/阶梯不跳阶/全域单调不回退/确定性纯函数/与皮肤分离/无枯萎死亡语义；四类资产总量落进 H 目标区间且 B2 免费底线不回退；资产数据完整性与 SVG 安全；价格三档 20–40/60–100/120–200 且每类有低档位、20 叶片档立刻买得起；第一课奖励恰好解锁铅笔头；≥15 个独立成就图标且不再要求 milestone 标记；新框/新主题/角标/分组/徽章的 CSS 与 UI 接线同步）。`);
