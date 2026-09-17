/* companion-view.js — 学习伙伴唯一公共门面。 */
(function initCompanionView(root) {
  'use strict';
  const MOODS = ['normal', 'happy', 'encourage', 'remind', 'celebrate'];
  /* SLOTS 的第二项是「这个槽位该不该延迟加载」，它是全站图片加载策略的**唯一**
   * 判定处（app.js 的 fileImage 只照做，不按文件名或像素尺寸另猜一套）。
   * v4.10 起按用途分流，判据就是第一项的尺寸档位：
   *   - '32-64px' 小图标（art.icon，即 corner / listItem 两个槽：右下角按钮、
   *     header 头像、形象 picker 与头像面板的网格缩略图）→ lazy=false（eager）。
   *     这些图单张只有几 KB（14 张 icon.webp 合计 68 KB），而 serve.py 对静态
   *     资源发 no-cache、每次使用都要回源校验，lazy 只会让面板格子逐个填充、
   *     观感变差，省下的流量微不足道。
   *   - '600x800' 大立绘（hero / profile 槽：首屏立绘、个人中心预览、装扮皮肤
   *     预览）→ lazy=true。大图 lazy 有真实价值，保留。
   * v4.10 之前 listItem 标的是 true，但 app.js 又无条件写死 loading='lazy'，
   * 于是这个标志事实上没被消费过——现在两处对齐。 */
  const SLOTS = { corner: ['32-64px', false], hero: ['600x800', true], profile: ['600x800', true], listItem: ['32-64px', false] };
  const registry = () => root.ODIN_COMPANION_REGISTRY || null;
  const entries = () => { const r = registry(); return r && Array.isArray(r.companions) ? r.companions : []; };
  /* v4.8：退役角色（registry.retiredIds，单一事实源）——数据留在库里但 UI 永不
   * 显示：resolve 不做精确匹配、直接回落默认角色；listByKind 一并过滤。 */
  const isRetired = id => { const r = registry(); return !!r && Array.isArray(r.retiredIds) && r.retiredIds.includes(id); };
  /* v4.9：旧品牌默认昵称（registry.legacyCompanionNames，如「芽芽」）不是用户起
   * 的名，一律按「未命名」处理。progress 的读档清洗已经拦过一道（同一份名单、
   * 同一处事实源），这里再兜一道，保证任何调用路径都不会把旧默认名当昵称显示。 */
  const isLegacyName = value => { const r = registry(); return !!r && Array.isArray(r.legacyCompanionNames) && r.legacyCompanionNames.includes(value); };
  const ready = item => !!item && (item.render.engine === 'procedural' || item.render.engine === 'inline' || (item.render.engine === 'fixedArt' && item.art && item.art.status === 'ready'));
  function resolve(id) {
    const r = registry(); const list = entries(); if (!r || !list.length) return null;
    /* 退役 id（如老档案里的 sprout）跳过精确匹配，走 defaultCompanionId 回落——
     * 显示层自动接替，不迁移档案、不删除角色数据。 */
    const wanted = isRetired(id) ? null : id;
    return list.find(item => item.id === wanted && ready(item)) || list.find(item => item.id === r.defaultCompanionId && ready(item)) || list.find(ready) || null;
  }
  function displayName(id) {
    const item = resolve(id); if (!item) return '';
    const p = root.ODIN_PROGRESS;
    const s = p && typeof p.settings === 'function' ? p.settings() : null;
    const c = p && typeof p.cosmetics === 'function' ? p.cosmetics() : null;
    const nick = s && s.companionNicknames && s.companionNicknames[id || (c && c.companionId)];
    if (nick && !isLegacyName(nick)) return nick;
    /* 第二轮：未命名时按角色回落——默认角色（v4.8 起为 nono）回品牌默认名
     * 「小诺」，其余角色回自己的登记名；与 progress.companionIdentity 同一口径，
     * 不把「小诺」带到其他角色；退役 sprout 已由 resolve 回落成 nono，
     * 不会再显示形象名「幼芽」。 */
    const r = registry();
    if (item.id === ((r && r.defaultCompanionId) || 'nono')) {
      return (p && p.Logic && p.Logic.DEFAULT_COMPANION_NAME) || item.name || item.zh || '';
    }
    return item.name || item.zh || '';
  }
  function skinOf(item, requestedSkin) {
    const art = item && item.art;
    const skins = art && art.skins && typeof art.skins === 'object' ? art.skins : null;
    if (!skins) return null;
    if (requestedSkin && skins[requestedSkin]) return requestedSkin;
    if (art.defaultSkin && skins[art.defaultSkin]) return art.defaultSkin;
    return Object.keys(skins)[0] || null;
  }
  function skinFor(id, requestedSkin) {
    return skinOf(resolve(id), requestedSkin);
  }
  function capabilities(id) {
    const item = resolve(id); if (!item) return { wardrobe: false, skins: [], moods: [], hasPet: false, engine: null, kind: null };
    const skins = item.art && item.art.skins ? Object.keys(item.art.skins) : [];
    const moods = item.render.engine === 'procedural'
      ? MOODS.slice()
      : [...new Set(skins.flatMap(skin => Object.keys(item.art.skins[skin] || {})))];
    return { wardrobe: item.render.engine === 'procedural' && item.kind === 'humanoid', skins: item.kind === 'humanoid' ? skins : [], moods, hasPet: Boolean(item.pairPetId), engine: item.render.engine, kind: item.kind };
  }
  function moodFor(info) {
    const brief = info || {};
    const kind = brief.kind || (brief.tip && brief.tip.kind);
    if (brief.goalDone || kind === 'all-done' || kind === 'celebrate') return 'celebrate';
    if (kind === 'review-due' || brief.reviewDueToday > 0) return 'remind';
    if (kind === 'today-short' || brief.todaySeconds < 600) return 'encourage';
    if (kind === 'steady' || kind === 'finish-current') return 'happy';
    return 'normal';
  }
  function portrait(id, options) {
    const item = resolve(id); if (!item) return null;
    const opts = options || {}; const slot = SLOTS[opts.slot] ? opts.slot : 'listItem'; const mood = MOODS.includes(opts.mood) ? opts.mood : 'normal';
    if (item.render.engine === 'procedural' || item.render.engine === 'inline') return { source: 'inline', value: item.legacy && item.legacy.svg ? item.legacy.svg : item.svg || '', alt: displayName(id), sizeHint: SLOTS[slot][0], lazy: false };
    const art = item.art;
    const skin = skinOf(item, opts.skin);
    const bust = skin && art && art.skins ? art.skins[skin] : (art && art.bust) || {};
    let resolvedMood = mood;
    let file = (slot === 'corner' || slot === 'listItem') && art && art.icon ? art.icon : bust[mood];
    if (!file && art && art.moodAlias && bust[art.moodAlias[mood]]) {
      resolvedMood = art.moodAlias[mood];
      file = bust[resolvedMood];
    }
    if (!file && bust.normal) {
      resolvedMood = 'normal';
      file = bust.normal;
    }
    return file ? {
      source: 'file', value: `${registry().assetRoot}${art.dir || ''}${file}`,
      alt: displayName(id), sizeHint: SLOTS[slot][0], lazy: SLOTS[slot][1],
      skin, mood: (slot === 'corner' || slot === 'listItem') && art.icon ? 'icon' : resolvedMood
    } : null;
  }
  function listByKind(kind) { return entries().filter(item => ready(item) && !isRetired(item.id) && (!kind || item.kind === kind)); }
  function pairPetOf(id) { const item = resolve(id); return item && item.pairPetId ? item.pairPetId : null; }
  root.ODIN_COMPANION_VIEW = Object.freeze({ resolve, displayName, capabilities, skinFor, portrait, moodFor, listByKind, pairPetOf });
})(typeof window !== 'undefined' ? window : globalThis);
