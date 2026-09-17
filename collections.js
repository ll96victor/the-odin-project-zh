/* 装扮收藏系统（v4.2 交接 §4、§12；v4.3 B1 改名，原“收藏 / 兑换系统”）。
 *
 * 职责：全部外观类收藏品（头像、头像框、小奥形象、主题）的统一解锁模型。
 *   解锁方式（unlock.kind）：
 *     default      默认可用；
 *     level        等级达到 value 解锁；
 *     achievement  解锁指定成就（value 为成就 id）后可用；
 *     coins        叶片解锁（value 为叶片价格），解锁后永久拥有。
 *
 * 设计：纯逻辑模块，不依赖 DOM 与存储。资产清单分布在外（avatars.js /
 * progress.js 的 FRAMES / companions.js / themes.js），本模块只认
 * { id, unlock } 形状的资产对象，因此对四类资产一视同仁；
 * 状态由 progress.js 持久化（state.cosmetics.purchases），
 * 消费走 economy.js 的 spendCoins（余额不可为负、不可解锁任何非外观内容）。
 * 加载顺序：先于 progress.js 加载（HTML 已按此排列）。 */
(() => {
  'use strict';

  const UNLOCK_KINDS = ['default', 'level', 'achievement', 'coins'];
  const ASSET_TYPES = ['avatar', 'frame', 'companion', 'theme'];

  /* 解锁记录是全局命名空间，key 必须带类型前缀：头像、形象、主题各有自己的
   * id 清单，跨类型重名（例如头像 fox 与形象 fox）不能互相解锁。 */
  const purchaseKey = asset => `${asset.type}:${asset.id}`;

  /* 等级需要从 XP 推算。v4.5（交接 Core E1）：非线性曲线——Lv.2 只要 40 XP
   * （完成第一课即升级），Lv.9 起回到 100/级的线性延续（保证存量用户永不
   * 降级）。这里不引 progress.js（避免互相依赖，且本模块加载顺序在前），
   * 而是复刻 progress.js 的同一张表 + 同一公式，并用 tests/collections.test.cjs
   * 与 tests/level-curve.test.cjs 密集采样断言两边永远一致——曲线只有一处
   * 真源（progress.js），本模块的复刻被测试钉住，漂移即失败。 */
  const XP_PER_LEVEL = 100;
  const LEVEL_CURVE = [0, 40, 100, 180, 280, 400, 550, 700, 800, 900];

  function levelOf(xp) {
    const x = Math.max(0, Math.floor(Number(xp) || 0));
    const top = LEVEL_CURVE.length - 1;
    if (x >= LEVEL_CURVE[top]) return (top + 1) + Math.floor((x - LEVEL_CURVE[top]) / XP_PER_LEVEL);
    for (let level = top; level >= 2; level -= 1) {
      if (x >= LEVEL_CURVE[level - 1]) return level;
    }
    return 1;
  }

  /* 是否已拥有。注意“已拥有”与“已装备”是两回事：装备状态分别存在
   * profile.avatarId / equippedFrameId / cosmetics.companionId / themeId。 */
  function isAssetUnlocked(state, asset) {
    if (!asset || !asset.unlock) return false;
    const cosmetics = state.cosmetics || {};
    switch (asset.unlock.kind) {
      case 'default':
        return true;
      case 'level':
        return levelOf(state.xp) >= asset.unlock.value;
      case 'achievement':
        return Boolean(state.achievements && state.achievements[asset.unlock.value]);
      case 'coins':
        return cosmetics.purchases && cosmetics.purchases[purchaseKey(asset)] === true;
      default:
        return false;
    }
  }

  /* 叶片价格：只有 coins 类资产有价格，其它解锁方式没有“花叶片”这个动作。 */
  function assetPrice(asset) {
    if (!asset || !asset.unlock || asset.unlock.kind !== 'coins') return null;
    const price = Math.floor(Number(asset.unlock.value) || 0);
    return price > 0 ? price : null;
  }

  /* 解锁条件的人话版本（供 UI 显示；隐藏成就引用由调用方先转成 hidden 文案）。 */
  function unlockText(asset, options) {
    const opts = options || {};
    if (!asset || !asset.unlock) return '未知';
    switch (asset.unlock.kind) {
      case 'default':
        return '默认可用';
      case 'level':
        return `等级达到 Lv.${asset.unlock.value} 解锁`;
      case 'achievement': {
        const zh = opts.achievementName ? opts.achievementName(asset.unlock.value) : null;
        return zh ? `解锁成就「${zh}」后可用` : '解锁指定成就后可用';
      }
      case 'coins':
        return `${asset.unlock.value} 叶片解锁`;
      default:
        return '未知';
    }
  }

  /* 叶片解锁（只针对 coins 类资产）：余额不足直接失败，不出现负数；
   * 已拥有、非叶片解锁品一律拒绝。成功时扣减叶片并写入 purchases 闩锁。 */
  function purchaseAsset(state, asset, economyModule) {
    const economy = economyModule || (typeof window !== 'undefined' ? window.ODIN_ECONOMY : null);
    if (!economy) return { ok: false, error: '叶片模块未载入，无法解锁。' };
    const price = assetPrice(asset);
    if (!asset || !asset.unlock) return { ok: false, error: '没有这个收藏品。' };
    if (!price) return { ok: false, error: `「${asset.zh || asset.id}」不是叶片解锁品。` };
    if (isAssetUnlocked(state, asset)) return { ok: false, error: `已经拥有「${asset.zh || asset.id}」。` };
    if (!state.cosmetics) state.cosmetics = { purchases: {}, companionId: 'sprout', themeId: 'garden' };
    const spend = economy.spendCoins(state, price);
    if (!spend.ok) return spend;
    state.cosmetics.purchases[purchaseKey(asset)] = true;
    return { ok: true, coins: spend.coins, assetId: asset.id, purchaseKey: purchaseKey(asset) };
  }

  /* 收藏统计：每类“已拥有 / 总数”。成就不是外观但同样进收藏柜（交接 §12），
   * 其计数由调用方从 summary 带入，本函数只管四类外观资产。 */
  function collectionStats(state, assetsByType) {
    const stats = {};
    ASSET_TYPES.forEach(type => {
      const list = assetsByType[type] || [];
      stats[type] = {
        total: list.length,
        owned: list.filter(asset => isAssetUnlocked(state, asset)).length
      };
    });
    return stats;
  }

  window.ODIN_COLLECTIONS = {
    UNLOCK_KINDS, ASSET_TYPES, XP_PER_LEVEL, LEVEL_CURVE,
    purchaseKey, levelOf, isAssetUnlocked, assetPrice, unlockText, purchaseAsset, collectionStats
  };
})();
