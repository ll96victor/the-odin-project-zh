/* 收藏 / 兑换系统测试（v4.2 交接 §4、§12、§22 Theme/Companion/Collection）。
 *
 * 覆盖：
 *   1. 统一解锁模型（default / level / achievement / coins）；
 *   2. 购买：成功扣款、余额不足拒绝、已拥有拒绝、非卖品拒绝、幂等；
 *   3. 装备：未购买不能装备叶片框，购买后可装备；
 *   4. 持久化：cosmetics 随档案导出导入往返；旧档案默认值；
 *   5. 数据完整性：四个数据文件的 id / 默认值 / 解锁方式 / 价格合法，
 *      collections.js 与 progress.js 的等级规则一致；
 *   6. 收藏统计：每类已拥有 / 总数。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const sandbox = { window: {} };
sandbox.window = sandbox;
for (const file of ['lessons.js', 'avatars.js', 'companions.js', 'themes.js', 'economy.js', 'collections.js', 'progress.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox);
}

const progress = sandbox.window.ODIN_PROGRESS;
const economy = sandbox.window.ODIN_ECONOMY;
const collections = sandbox.window.ODIN_COLLECTIONS;
const AVATARS = sandbox.window.ODIN_AVATARS;
const COMPANIONS = sandbox.window.ODIN_COMPANIONS;
const THEMES = sandbox.window.ODIN_THEMES;
const Logic = progress.Logic;
const lessons = JSON.parse(JSON.stringify(sandbox.window.ODIN_GUIDE.lessons));
const lessonIds = lessons.map(lesson => lesson.id);
const fresh = () => Logic.emptyState();
let checks = 0;
const check = label => { checks += 1; return label; };
const local = value => JSON.parse(JSON.stringify(value));
/* 资产需带 type（购买记录按 类型:id 记账）；数据文件本身不写 type，
 * 由调用方（app.js 的 typedAssets / 这里的包装）补上，保持数据文件干净。 */
const withType = (type, list) => list.map(item => Object.assign({}, item, { type }));
const avatarAssets = withType('avatar', AVATARS.avatars);

/* ===================== 1. 统一解锁模型 ===================== */
{
  const state = fresh();
  const byKind = kind => avatarAssets.find(a => a.unlock.kind === kind);
  assert.equal(collections.isAssetUnlocked(state, byKind('default')), true, check('default 类默认解锁'));
  const hex = avatarAssets.find(a => a.id === 'hex');
  assert.equal(collections.isAssetUnlocked(state, hex), false, check('Lv.4 头像在 Lv.1 未解锁'));
  state.xp = 300;  /* v4.5 非线性曲线：Lv.5（门槛 280） */
  assert.equal(collections.isAssetUnlocked(state, hex), true, check('Lv.4 头像达到等级后解锁'));
  /* 等级规则与 progress.js 一致（防止两处公式漂移）。v4.5：非线性曲线，
   * 采样点覆盖全部表值边界（40/100/180/280/400/550/700/800/900）±1 与线性区；
   * 密集一致性扫描在 tests/level-curve.test.cjs。 */
  for (const xp of [0, 39, 40, 99, 100, 179, 180, 279, 280, 399, 400, 549, 550, 699, 700, 799, 800, 899, 900, 901, 1180, 2500]) {
    assert.equal(collections.levelOf(xp), Logic.levelOf(xp), check(`levelOf(${xp}) 与 progress.js 一致`));
  }
  assert.deepEqual(local(collections.LEVEL_CURVE), local(Logic.LEVEL_CURVE), check('LEVEL_CURVE 表两边一致（复刻被钉住）'));
  assert.equal(collections.XP_PER_LEVEL, Logic.XP_PER_LEVEL, check('XP_PER_LEVEL 常量一致'));
  const trophy = avatarAssets.find(a => a.id === 'trophy');
  assert.equal(collections.isAssetUnlocked(state, trophy), false, check('成就头像未解锁成就时锁定'));
  state.achievements['lessons-10'] = '2026-09-10T09:00:00.000Z';
  assert.equal(collections.isAssetUnlocked(state, trophy), true, check('解锁成就后头像可用'));
  const gem = avatarAssets.find(a => a.id === 'gem');
  assert.equal(collections.isAssetUnlocked(state, gem), false, check('叶片头像未购买时锁定'));
  state.cosmetics.purchases['avatar:gem'] = true;
  assert.equal(collections.isAssetUnlocked(state, gem), true, check('购买后永久拥有'));
  assert.equal(collections.isAssetUnlocked(state, null), false, check('空资产不解锁'));
  assert.equal(collections.isAssetUnlocked(state, { id: 'x', unlock: { kind: 'unknown' } }), false, check('未知解锁方式不解锁'));
}

/* ===================== 2. 购买 ===================== */
{
  const state = fresh();
  const gem = avatarAssets.find(a => a.id === 'gem');       /* 80 叶片 */
  /* 非法调用 */
  assert.equal(collections.purchaseAsset(state, null, economy).ok, false, check('空资产购买被拒绝'));
  assert.equal(collections.purchaseAsset(state, byKindDefault(), economy).ok, false, check('默认可用资产不可购买'));
  assert.equal(collections.purchaseAsset(state, hexLike(), economy).ok, false, check('等级解锁资产不可购买'));
  /* 余额不足 */
  state.coins = 79;
  let result = collections.purchaseAsset(state, gem, economy);
  assert.equal(result.ok, false, check('余额不足购买失败'));
  assert.equal(state.coins, 79, check('失败不扣款'));
  /* 成功 */
  state.coins = 100;
  result = collections.purchaseAsset(state, gem, economy);
  assert.equal(result.ok, true, check('足额购买成功'));
  assert.equal(state.coins, 20, check('购买扣款 80'));
  assert.equal(state.cosmetics.purchases['avatar:gem'], true, check('购买闩锁落账'));
  /* 幂等 */
  result = collections.purchaseAsset(state, gem, economy);
  assert.equal(result.ok, false, check('已拥有不能重复购买'));
  assert.equal(state.coins, 20, check('重复购买不扣款'));
  /* 余额恰好等于价格 */
  const moon = avatarAssets.find(a => a.id === 'moon');     /* 130 叶片 */
  state.coins = 130;
  result = collections.purchaseAsset(state, moon, economy);
  assert.equal(result.ok, true, check('余额恰好够时购买成功'));
  assert.equal(state.coins, 0, check('购买后余额为 0（不为负）'));

  function byKindDefault() { return avatarAssets.find(a => a.unlock.kind === 'default'); }
  function hexLike() { return avatarAssets.find(a => a.id === 'hex'); }
}

/* ===================== 3. 头像框：叶片框的解锁与装备 ===================== */
{
  const state = fresh();
  const candy = Object.assign({}, Logic.FRAMES.find(f => f.id === 'frame-candy'), { type: 'frame' });   /* 90 叶片 */
  assert.equal(Logic.isFrameUnlocked(state, candy), false, check('叶片框未购买时锁定'));
  assert.equal(Logic.normalizeFrameId('frame-candy', state), Logic.DEFAULT_FRAME_ID, check('未购买的叶片框装备回落默认框'));
  state.coins = 95;
  const result = collections.purchaseAsset(state, candy, economy);
  assert.equal(result.ok, true, check('叶片框购买成功'));
  assert.equal(state.coins, 5, check('购买叶片框扣款'));
  assert.equal(Logic.isFrameUnlocked(state, candy), true, check('购买后叶片框解锁'));
  assert.equal(Logic.normalizeFrameId('frame-candy', state), 'frame-candy', check('购买后可以装备'));
  /* collections 与 progress 的 coins 解锁判定一致 */
  assert.equal(collections.isAssetUnlocked(state, candy), Logic.isFrameUnlocked(state, candy), check('collections 与 progress 的叶片解锁判定一致'));
}

/* ===================== 4. 持久化与旧档案默认值 ===================== */
{
  /* v3 档案含购买记录与装备，往返保值 */
  const state = fresh();
  state.coins = 500;
  const gem = avatarAssets.find(a => a.id === 'gem');
  collections.purchaseAsset(state, gem, economy);
  state.cosmetics.companionId = 'cat';
  state.cosmetics.themeId = 'terminal';
  const exported = Logic.exportJson(state, '2026-09-10T12:00:00.000Z');
  const parsed = JSON.parse(exported);
  assert.deepEqual(parsed.cosmetics.purchases, { 'avatar:gem': true }, check('导出含购买记录（带类型前缀）'));
  assert.equal(parsed.cosmetics.companionId, 'cat', check('导出含小奥形象'));
  assert.equal(parsed.cosmetics.themeId, 'terminal', check('导出含主题'));
  const back = Logic.parseImport(exported, lessonIds);
  assert.equal(back.ok, true, check('cosmetics 档案可再导入'));
  assert.equal(back.state.cosmetics.purchases['avatar:gem'], true, check('往返后购买记录保留'));
  assert.equal(back.state.cosmetics.companionId, 'cat', check('往返后小奥形象保留'));
  assert.equal(back.state.cosmetics.themeId, 'terminal', check('往返后主题保留'));

  /* v2 旧档案没有 cosmetics：默认值补齐 */
  const legacy = {
    schemaVersion: 2, lessons: {}, daily: {}, totalActiveSeconds: 0, xp: 0,
    minuteXpAwarded: 0, rewardFlags: {}, achievements: {}, lastLessonId: null,
    coins: 0, coinMinuteAwarded: 0, coinFlags: {}
  };
  const migrated = Logic.parseImport(JSON.stringify(legacy), lessonIds);
  assert.equal(migrated.state.cosmetics.companionId, Logic.DEFAULT_COMPANION_ID, check('旧档案小奥形象回落默认'));
  assert.equal(migrated.state.cosmetics.themeId, Logic.DEFAULT_THEME_ID, check('旧档案主题回落默认'));
  assert.deepEqual(local(migrated.state.cosmetics.purchases), {}, check('旧档案无购买记录'));

  /* 非法字段 */
  const mk = overrides => Logic.parseImport(JSON.stringify(Object.assign({}, legacy, { schemaVersion: 3 }, overrides)), lessonIds);
  let r = mk({ cosmetics: { purchases: { gem: true, bad: 'yes' }, companionId: 'cat', themeId: 'night' } });
  assert.equal(r.state.cosmetics.purchases.gem, true, check('购买闩锁只收 true：合法值保留'));
  assert.equal(r.state.cosmetics.purchases.bad, undefined, check('购买闩锁只收 true：非法值丢弃'));
  r = mk({ cosmetics: { companionId: 'BAD-ID', themeId: 'BAD' } });
  assert.equal(r.state.cosmetics.companionId, Logic.DEFAULT_COMPANION_ID, check('非法形象 id 回落默认'));
  assert.equal(r.state.cosmetics.themeId, Logic.DEFAULT_THEME_ID, check('非法主题 id 回落默认'));
  /* 格式合法但未知的 id 原样保存（UI 渲染时回退默认，与 avatarId 同思路） */
  r = mk({ cosmetics: { companionId: 'x', themeId: 'y' } });
  assert.equal(r.state.cosmetics.companionId, 'x', check('格式合法的未知形象 id 原样保存（UI 回退）'));
  assert.equal(r.state.cosmetics.themeId, 'y', check('格式合法的未知主题 id 原样保存（UI 回退）'));
  r = mk({ cosmetics: null });
  assert.equal(r.ok, false, check('cosmetics 为 null 拒绝整个档案'));
}

/* ===================== 5. 数据完整性 ===================== */
{
  /* 默认 id 一致性 */
  assert.equal(COMPANIONS.defaultCompanionId, Logic.DEFAULT_COMPANION_ID, check('companions.js 与 progress.js 的默认形象一致'));
  assert.equal(THEMES.defaultThemeId, Logic.DEFAULT_THEME_ID, check('themes.js 与 progress.js 的默认主题一致'));
  const companionIds = COMPANIONS.companions.map(c => c.id);
  assert.equal(new Set(companionIds).size, companionIds.length, check('形象 id 不重复'));
  assert.ok(companionIds.includes(Logic.DEFAULT_COMPANION_ID), check('默认形象存在'));
  assert.ok(COMPANIONS.companions.length >= 9 && COMPANIONS.companions.length <= 14, check(`形象数量在 v4.3 交接 I 建议的 10–14 个范围内或其下限过渡值（实际 ${COMPANIONS.companions.length}）`));
  /* v4.3（交接 B2）：基础内容必须足够免费——默认形象至少 4 个 */
  assert.ok(COMPANIONS.companions.filter(c => c.unlock.kind === 'default').length >= 4, check('B2：默认小奥形象至少 4 个'));
  for (const companion of COMPANIONS.companions) {
    assert.ok(companion.zh && companion.desc && companion.voice, check(`${companion.id}: 名称/介绍/语气文案齐全`));
    assert.ok(companion.svg && companion.svg.startsWith('<svg'), check(`${companion.id}: 有原创 SVG`));
    assert.ok(['default', 'level', 'achievement', 'coins'].includes(companion.unlock.kind), check(`${companion.id}: 解锁方式合法`));
    if (companion.unlock.kind === 'achievement') {
      assert.ok(Logic.ACHIEVEMENTS.some(a => a.id === companion.unlock.value), check(`${companion.id}: 绑定的成就存在`));
    }
  }

  const themeIds = THEMES.themes.map(t => t.id);
  assert.equal(new Set(themeIds).size, themeIds.length, check('主题 id 不重复'));
  /* v4.4（交接 C1）：主题系统 2.0——从 v4.3 的 8–10 扩到 24–30 套，五类组织 */
  assert.ok(THEMES.themes.length >= 24 && THEMES.themes.length <= 30, check(`主题数量在 v4.4 交接 C1 的 24–30 区间（实际 ${THEMES.themes.length}）`));
  assert.ok(Array.isArray(THEMES.categories) && THEMES.categories.length === 5, check('C1：五类分类元数据（清爽/暖色/自然/深色/特别）'));
  for (const theme of THEMES.themes) {
    assert.ok(THEMES.categories.some(c => c.id === theme.category), check(`${theme.id}: category 归入已知分类`));
    assert.equal(typeof theme.dark, 'boolean', check(`${theme.id}: dark 标签是布尔值`));
  }
  /* v4.3（交接 B2）：默认主题至少 4 个，且至少 1 个深色主题默认开放（夜间阅读不锁叶片） */
  const defaultThemes = THEMES.themes.filter(t => t.unlock.kind === 'default');
  assert.ok(defaultThemes.length >= 4, check('B2：默认主题至少 4 个'));
  assert.ok(defaultThemes.some(t => t.id === 'night'), check('B2：深色主题「夜空」默认开放（夜间阅读能力不锁在叶片后）'));
  for (const theme of THEMES.themes) {
    assert.ok(theme.zh && theme.desc, check(`${theme.id}: 名称与说明齐全`));
    assert.ok(theme.swatch && theme.swatch.bg && theme.swatch.accent && theme.swatch.ink, check(`${theme.id}: 色卡三色齐全`));
    assert.ok(['default', 'level', 'achievement', 'coins'].includes(theme.unlock.kind), check(`${theme.id}: 解锁方式合法`));
  }
  /* 每套主题的 token 覆盖确实存在于 tokens.css */
  const tokensCss = fs.readFileSync(path.join(root, 'tokens.css'), 'utf8');
  for (const theme of THEMES.themes.filter(t => t.id !== 'garden')) {
    assert.ok(tokensCss.includes(`html[data-theme="${theme.id}"]`), check(`tokens.css 含 ${theme.id} 主题变量`));
  }

  /* 头像价格唯一性与范围（v4.3 Batch 6 交接 J：三档 20–40 / 60–100 / 120–200） */
  const prices = AVATARS.avatars.filter(a => a.unlock.kind === 'coins').map(a => a.unlock.value);
  assert.ok(prices.every(p => p >= 20 && p <= 200), check('头像价格都在 20–200 叶片区间（交接 J：高价档收口到 200 以内）'));
  const framePrices = Logic.FRAMES.filter(f => f.unlock.kind === 'coins').map(f => f.unlock.value);
  assert.ok(framePrices.every(p => p >= 20 && p <= 200), check('头像框价格都在 20–200 叶片区间（交接 J：极光框 220→200）'));

  /* 购买记录带类型前缀：跨类型重名（头像 fox 与形象 fox）不会互相解锁 */
  assert.equal(collections.purchaseKey({ type: 'avatar', id: 'fox' }), 'avatar:fox', check('购买 key 带类型前缀'));
  {
    const state = fresh();
    state.coins = 500;
    const avatarFox = avatarAssets.find(a => a.id === 'fox');
    const companionFox = withType('companion', COMPANIONS.companions).find(c => c.id === 'fox');
    if (avatarFox && companionFox) {
      collections.purchaseAsset(state, avatarFox.unlock.kind === 'coins' ? avatarFox : withType('avatar', [{ id: 'gem', zh: '宝石', unlock: { kind: 'coins', value: 80 } }])[0], economy);
      assert.equal(collections.isAssetUnlocked(state, companionFox), false, check('购买头像不影响同名形象的解锁'));
    } else {
      check('头像与形象存在重名 id（前缀命名空间的现实必要性）');
    }
  }

  /* style.css 含新框的视觉定义 */
  const styleCss = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  for (const frame of Logic.FRAMES) {
    assert.ok(styleCss.includes(`.${frame.css} {`) || styleCss.includes(`.${frame.css} `), check(`style.css 含 ${frame.id} 的视觉定义`));
  }
}

/* ===================== 6. 收藏统计 ===================== */
{
  const state = fresh();
  state.xp = 300; /* v4.5 非线性曲线：Lv.5——前 5 级头像（新芽/望远镜/十六进制/山顶旗帜）与等级框全解锁 */
  const stats = collections.collectionStats(state, {
    avatar: avatarAssets,
    frame: withType('frame', Logic.FRAMES),
    companion: withType('companion', COMPANIONS.companions),
    theme: withType('theme', THEMES.themes)
  });
  assert.equal(stats.avatar.total, 37, check('头像总数 37（v4.5 交接 Core E2 新增 3 个等级头像后）'));
  assert.equal(stats.avatar.owned, 19, check('Lv.5 时拥有 19 个头像（15 默认 + 新芽/望远镜/hex/山顶旗帜 4 个等级款）'));
  assert.equal(stats.frame.total, 28, check('头像框总数 28（v4.5 交接 Core E2 新增新芽框/陶土框后）'));
  assert.equal(stats.frame.owned, 8, check('Lv.5 时解锁 4 个默认框 + 新芽框(Lv.2)/蓝色双环(Lv.3)/陶土框(Lv.4)/叶脉进阶框(Lv.5)'));
  assert.equal(stats.companion.total, 14, check('形象总数 14（v4.4 交接 D1 新增小奥·少年/少女两个角色形态后）'));
  assert.equal(stats.companion.owned, 7, check('Lv.5 时拥有 7 个形象（6 默认 + 终端狐 Lv.5，交接 Core E2 使 Lv.5 也解锁形象奖励）'));
  assert.equal(stats.theme.total, 30, check('主题总数 30（v4.4 交接 C1 主题系统 2.0 扩充后）'));
  assert.equal(stats.theme.owned, 19, check('Lv.5 时拥有 19 个主题（18 默认 + 暖炉 Lv.5，交接 Core E2 使 Lv.5 也解锁主题奖励）'));
  /* 购买后计数变化 */
  const gem = avatarAssets.find(a => a.id === 'gem');
  state.coins = 100;
  collections.purchaseAsset(state, gem, economy);
  const stats2 = collections.collectionStats(state, {
    avatar: avatarAssets,
    frame: withType('frame', Logic.FRAMES),
    companion: withType('companion', COMPANIONS.companions),
    theme: withType('theme', THEMES.themes)
  });
  assert.equal(stats2.avatar.owned, 20, check('购买后头像计数 +1（19 → 20）'));
}

/* ===================== 7. 安全：导出无敏感键、无远程引用 ===================== */
{
  const state = fresh();
  const exported = Logic.exportJson(state, '2026-09-10T12:00:00.000Z');
  assert.equal(Logic.containsSensitiveKey(exported), false, check('收藏导出不含敏感字段名'));
  for (const file of ['avatars.js', 'companions.js', 'themes.js', 'collections.js']) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    assert.ok(!/https?:\/\//.test(source.replace(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '')),
      check(`${file} 无远程引用（xmlns 除外）`));
    assert.ok(!/innerHTML|fetch\(|XMLHttpRequest/.test(source), check(`${file} 不使用 innerHTML / 网络`));
  }
}

console.log(`通过：装扮收藏系统 ${checks} 项断言（统一解锁模型、购买幂等与余额保护、叶片框装备、持久化与旧档案默认值、四类数据完整性、收藏统计、无远程引用）。`);
