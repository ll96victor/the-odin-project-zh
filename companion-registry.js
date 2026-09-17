/* companion-registry.js — 学习伙伴角色单一事实源。 */
(function initCompanionRegistry(root) {
  'use strict';
  const humanArt = id => ({
    status: 'ready', dir: `${id}/`, icon: 'icon.webp', defaultSkin: 'default',
    skins: {
      default: { normal: 'default-normal.webp', happy: 'default-happy.webp', celebrate: 'default-celebrate.webp' },
      study: { normal: 'study-normal.webp', happy: 'study-happy.webp', celebrate: 'study-celebrate.webp' }
    },
    moodAlias: { encourage: 'happy', remind: 'normal' }
  });
  const petArt = id => ({
    status: 'ready', dir: `${id}/`, icon: 'icon.webp', defaultSkin: 'default',
    skins: { default: { normal: 'normal.webp', happy: 'happy.webp', celebrate: 'celebrate.webp' } },
    moodAlias: { encourage: 'happy', remind: 'normal' }
  });
  const readyArt = {
    /* v4.8：默认角色小诺的默认皮肤用 study（抱书校服像，更契合学习站场景；
     * Hero 与个人中心等所有走 skin 的 slot 一致生效）。用户显式选过的皮肤
     * （cosmetics.companionSkins）仍然优先；icon.webp 头像不受 skin 影响。 */
    nono: Object.assign(humanArt('nono'), { defaultSkin: 'study' }),
    ella: humanArt('ella'),
    mia: {
      status: 'ready', dir: 'mia/', icon: 'icon.webp', defaultSkin: 'default',
      skins: {
        default: { normal: 'default-normal.webp' },
        study: { normal: 'study-normal.webp', happy: 'study-happy.webp', celebrate: 'study-celebrate.webp' }
      },
      moodAlias: { encourage: 'happy', remind: 'normal' }
    },
    riko: humanArt('riko'),
    rin: humanArt('rin'),
    hina: humanArt('hina'),
    'kitty-white': petArt('kitty-white'),
    'kitty-ink': petArt('kitty-ink'),
    'shiba-dou': petArt('shiba-dou'),
    'fox-snow': petArt('fox-snow'),
    'bunny-peach': petArt('bunny-peach'),
    'dragon-lilac': petArt('dragon-lilac'),
    'penguin-bobo': petArt('penguin-bobo'),
    'hamster-mai': petArt('hamster-mai')
  };
  const legacy = root.ODIN_COMPANIONS && Array.isArray(root.ODIN_COMPANIONS.companions) ? root.ODIN_COMPANIONS.companions : [];
  const humanoids = new Set(['odin-boy', 'odin-girl']);
  const existing = legacy.map(item => ({
    id: item.id, zh: item.zh, name: item.zh, desc: item.desc, voice: item.voice,
    svg: item.svg, bust: item.bust || null, latin: item.id,
    kind: humanoids.has(item.id) ? 'humanoid' : 'creature',
    earType: humanoids.has(item.id) ? 'plain' : null, persona: item.desc,
    unlock: item.unlock, pairPetId: null,
    render: { engine: humanoids.has(item.id) ? 'procedural' : 'inline' },
    procedural: humanoids.has(item.id) ? { body: item.bust } : null,
    art: null, legacy: item
  }));
  const humans = [
    ['nono', '小诺', '温柔可靠的学习伙伴', 'kitty-white', { kind: 'default' }],
    ['ella', '艾拉', '活泼元气的应援担当', 'kitty-ink', { kind: 'level', value: 3 }],
    ['mia', '米娅', '可爱治愈的暖心陪伴', 'bunny-peach', { kind: 'default' }],
    ['riko', '小璃', '酷飒有趣的挑战搭档', 'dragon-lilac', { kind: 'coins', value: 60 }],
    ['rin', '小凛', '冷静聪明的技术助手', 'fox-snow', { kind: 'level', value: 5 }],
    ['hina', '小晴', '温暖贴心的日常陪伴', 'shiba-dou', { kind: 'coins', value: 35 }]
  ].map(([id, name, persona, pairPetId, unlock]) => ({
    id, zh: name, name, latin: id, desc: persona, kind: 'humanoid',
    earType: ['rin', 'hina'].includes(id) ? 'plain' : 'beast', persona, voice: persona,
    unlock, pairPetId, render: { engine: 'fixedArt' }, procedural: null,
    art: readyArt[id] || { status: 'pending' }
  }));
  const pets = [
    ['kitty-white', '小白', '绒毛白猫·温柔治愈', { kind: 'default' }],
    ['kitty-ink', '墨墨', '酷酷黑猫·高冷傲娇', { kind: 'coins', value: 35 }],
    ['shiba-dou', '豆豆', '元气柴犬·活泼开朗', { kind: 'level', value: 3 }],
    ['fox-snow', '雪球', '雪狐·聪明优雅', { kind: 'coins', value: 60 }],
    ['bunny-peach', '桃桃', '软萌兔兔·可爱治愈', { kind: 'default' }],
    ['dragon-lilac', '小紫', '幻萌小龙·特别的陪伴', { kind: 'coins', value: 120 }],
    ['penguin-bobo', '啵啵', '呆萌企鹅·快乐加油', { kind: 'achievement', value: 'streak-7' }],
    ['hamster-mai', '麦麦', '仓鼠·踏实勤快', { kind: 'coins', value: 40 }]
  ].map(([id, name, persona, unlock]) => ({
    id, zh: name, name, latin: id, desc: persona, kind: 'creature', earType: null,
    persona, voice: persona, unlock, pairPetId: null, render: { engine: 'fixedArt' },
    procedural: null, art: readyArt[id] || { status: 'pending' }
  }));
  root.ODIN_COMPANION_REGISTRY = Object.freeze({
    /* v4.8：默认角色从几何芽芽（sprout）换成紫发少女小诺（nono）。
     * retiredIds 是「退役角色」的单一事实源：数据仍保留在 companions 里
     * （老档案 id 不成孤儿、可一键回滚），但 companion-view.resolve 对退役 id
     * 不做精确匹配、直接回落 defaultCompanionId，listByKind 与一切列出角色的
     * UI 都不再显示它们。不删除数据、不做 localStorage 迁移。 */
    version: 1, defaultCompanionId: 'nono', retiredIds: Object.freeze(['sprout']),
    /* v4.9：v4.8 品牌切换遗留的「旧默认值」退役名单——与上面的 retiredIds 同一
     * 思路，是这两类值的**唯一**声明处（progress.js / companion-view.js 只读
     * 这里，各自文件里不散落字面量）。它们与 retiredIds 的区别：retiredIds 管
     * 「角色」，这里管「值」——老档案里这些值写于 v4.8 之前，格式完全合法，
     * 所以永远过不了格式校验这道关，只能靠**读取层归一化**把它认成「没选过」，
     * 否则会顶着「用户主动选择」的身份永久保留（v4.8 的验证盲区根因）。
     *   - retiredAvatarIds：产品级旧默认头像。v4.8 前 DEFAULT_AVATAR_ID 是
     *     'terminal'，老档案 profile.avatarId 存的就是它，命中即归一化为当前
     *     DEFAULT_AVATAR_ID（companion-nono）；用户此后无法再主动选它。
     *   - legacyCompanionNames：旧品牌默认昵称。sprout 时代的默认名「芽芽」
     *     被当成「用户自定义昵称」继续显示，命中即视为**未命名**，走既有的
     *     按角色默认名回落（最终得到「小诺」）；用户此后无法再把昵称起成它。
     * 归一化只作用于内存 state，**不写 localStorage、不改 schemaVersion、
     * 不动任何学习进度字段**；清空这两个数组即一步回滚。 */
    retiredAvatarIds: Object.freeze(['terminal']),
    legacyCompanionNames: Object.freeze(['芽芽']),
    dataUrlPrefix: 'data:image/svg+xml;charset=utf-8,',
    license: '既有几何形象与本地 fixed-art 正式资产均为本站项目使用资产；未具备正式图的角色保持 pending。',
    assetRoot: 'assets/companions/', companions: existing.concat(humans, pets)
  });
})(typeof window !== 'undefined' ? window : globalThis);
