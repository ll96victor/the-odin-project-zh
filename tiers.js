/* 循环成就（Achievement 3.0，v4.3 交接 D1）。
 *
 * 与 progress.js 的一次性成就（单向解锁 + 时间戳）不同，循环成就是**成就族**：
 * 同一个学习行为持续累计，按 铜 → 银 → 金 三阶晋升。阶段是同一族的进度，
 * 不是三个无关成就；晋升单向锁定（state.achievementTiers 闩锁），当前值回落
 * （例如撤销自测勾选）不会掉阶，也无法通过撤销重做反复刷奖励。
 *
 * 防刷设计（交接 D1“重要”清单）：
 *   - 指标优先**从历史推导**，不另存容易重复的 counter：
 *       studyDays   ← state.daily 里达标（≥10 分钟）的天数（daily 只增不减，天然幂等）
 *       goalDays    ← coinFlags 里 'coin:daily-goal:<dayKey>' 闩锁数（每天一把钥匙，天然幂等）
 *       quizLessons ← 当前 quizCompleted=true 的去重课程数
 *       startedLessons ← 当前 started=true 的去重课程数
 *   - 少数天然可重复的行为（复习完成、Boss 挑战）用带日闩锁的计数：
 *       reviewActions ← reviews[*].doneCount（复习系统按“同一课同一自然日最多 +1”累计）
 *       bossPass / bossHigh ← bosses[*].passCount / highCount（Boss 系统按“同一单元同一自然日最多 +1”累计）
 *   - 晋升写入 achievementTiers 后只升不降；每阶的叶片奖励走 economy.awardOnce
 *     （coinFlags 闩锁 'tier:<family>:<tier>'），重复求值 / 撤销重做都无法重复发放。
 *
 * 阈值说明：交接 D1 的示例数值（如自测 5/20/50、探索 5/15/30）按本站实际
 * 收敛——本站开放 19 课，且“同一行为不得通过撤销重做反复刷计数”，因此按课
 * 去重的族阈值上限就是 19（5/12/19）。按天/按次累计的族保留交接量级。
 * Boss 族按交接原值：通过 1 次 / 高评价 3 次 / 高评价 8 次（铜阶用“通过数”、
 * 银金阶用“高评价数”，因此每阶可以有自己的 metric——tiers 结构是 tier 级的）。
 *
 * 设计：纯逻辑，不依赖 DOM 与存储；progress.js 在 afterChange 里调用
 * evaluateTiers 结算晋升。加载顺序：先于 progress.js（HTML 已按此排列）。 */
(() => {
  'use strict';

  /* 与 progress.js 的 STREAK_MIN_DAY_SECONDS 一致（tests/tiers.test.cjs 钉住两边不漂移） */
  const STUDY_DAY_MIN_SECONDS = 600;

  /* 阶级元数据：视觉（CSS 类 + icons.js 的 tierBadges SVG）与文案集中一处 */
  const TIER_META = [
    { tier: 1, zh: '铜', css: 'tier-bronze' },
    { tier: 2, zh: '银', css: 'tier-silver' },
    { tier: 3, zh: '金', css: 'tier-gold' }
  ];
  const TIER_MAX = 3;

  /* 指标的人话单位（UI 的“当前 X / Y 天”文案用，避免各处自己拼） */
  const METRIC_LABELS = {
    studyDays: { zh: '达标学习日', unit: 'days' },
    goalDays: { zh: '达成每日目标', unit: 'days' },
    quizLessons: { zh: '完成自测课程', unit: 'lessons' },
    startedLessons: { zh: '探索课程节点', unit: 'lessons' },
    reviewActions: { zh: '复习完成动作', unit: 'times' },
    bossPass: { zh: 'Boss 通过', unit: 'times' },
    bossHigh: { zh: 'Boss 高评价', unit: 'times' }
  };

  /* 成就族表（表驱动，Habitica 式：条件与奖励都声明在数据里，判定只有一处）。
   * 每阶自带 metric 与 value（Boss 族铜阶数“通过”、银金阶数“高评价”）；
   * rewards 是每一阶晋升的一次性叶片奖励，走 economy.awardOnce 闩锁；
   * 刻意不奖励 XP——成就与叶片都不参与等级数值（既有红线）。 */
  const TIER_FAMILIES = [
    {
      id: 'study-days',
      zh: '学习日',
      desc: '累计达标学习天数（单日有效学习至少 10 分钟算一天）',
      tiers: [
        { metric: { kind: 'studyDays' }, value: 3, reward: 10 },
        { metric: { kind: 'studyDays' }, value: 15, reward: 25 },
        { metric: { kind: 'studyDays' }, value: 50, reward: 50 }
      ]
    },
    {
      id: 'goal-days',
      zh: '每日目标达人',
      desc: '累计达成每日学习目标的天数（按你设定的目标分钟数）',
      tiers: [
        { metric: { kind: 'goalDays' }, value: 3, reward: 10 },
        { metric: { kind: 'goalDays' }, value: 15, reward: 25 },
        { metric: { kind: 'goalDays' }, value: 40, reward: 50 }
      ]
    },
    {
      id: 'quiz-lessons',
      zh: '自测达人',
      desc: '累计完成本站自测的课程数（每课只计一次，撤销重勾不重复累计）',
      tiers: [
        { metric: { kind: 'quizLessons' }, value: 5, reward: 10 },
        { metric: { kind: 'quizLessons' }, value: 12, reward: 25 },
        { metric: { kind: 'quizLessons' }, value: 19, reward: 50 }
      ]
    },
    {
      id: 'explore',
      zh: '探索地图',
      desc: '累计探索的课程节点数（打开过课程页即算侦察，每课只计一次）',
      tiers: [
        { metric: { kind: 'startedLessons' }, value: 5, reward: 10 },
        { metric: { kind: 'startedLessons' }, value: 12, reward: 25 },
        { metric: { kind: 'startedLessons' }, value: 19, reward: 50 }
      ]
    },
    {
      id: 'review-actions',
      zh: '复习达人',
      desc: '累计完成复习动作的次数（在复习到期后点“完成复习”；同一课同一天只计一次）',
      tiers: [
        { metric: { kind: 'reviewActions' }, value: 3, reward: 10 },
        { metric: { kind: 'reviewActions' }, value: 15, reward: 25 },
        { metric: { kind: 'reviewActions' }, value: 40, reward: 50 }
      ]
    },
    {
      id: 'boss',
      zh: 'Boss 挑战',
      desc: '章节 Boss 综合自测：铜阶通过 1 次；银、金阶按高评价（优势明显及以上）次数，同一单元同一天最多计 1 次',
      tiers: [
        { metric: { kind: 'bossPass' }, value: 1, reward: 10 },
        { metric: { kind: 'bossHigh' }, value: 3, reward: 25 },
        { metric: { kind: 'bossHigh' }, value: 8, reward: 50 }
      ]
    }
  ];

  function countLessonFlag(state, lessons, field) {
    if (!Array.isArray(lessons)) return 0;
    return lessons.filter(lesson => {
      const entry = (state.lessons || {})[lesson.id];
      return Boolean(entry && entry[field] === true);
    }).length;
  }

  function sumBossField(state, field) {
    return Object.values(state.bosses || {}).reduce(
      (total, entry) => total + (entry && Number(entry[field]) > 0 ? Math.floor(entry[field]) : 0),
      0
    );
  }

  /* 指标当前值：全部从既有状态推导（交接 D1“优先从历史推导”） */
  function metricValue(state, metric, lessons) {
    switch (metric.kind) {
      case 'studyDays':
        return Object.values(state.daily || {}).filter(seconds => Number(seconds) >= STUDY_DAY_MIN_SECONDS).length;
      case 'goalDays':
        /* 每日目标达成日是 economy 的按日闩锁（coin:daily-goal:<dayKey>），
         * 天然一天最多一把钥匙——比另存 counter 更不可能重复。 */
        return Object.keys(state.coinFlags || {}).filter(key => key.indexOf('coin:daily-goal:') === 0).length;
      case 'quizLessons':
        return countLessonFlag(state, lessons, 'quizCompleted');
      case 'startedLessons':
        return countLessonFlag(state, lessons, 'started');
      case 'reviewActions':
        /* 复习完成动作累计（reviews[*].doneCount，复习系统按日幂等 +1） */
        return Object.values(state.reviews || {}).reduce(
          (total, entry) => total + (entry && Number(entry.doneCount) > 0 ? Math.floor(entry.doneCount) : 0),
          0
        );
      case 'bossPass':
        return sumBossField(state, 'passCount');
      case 'bossHigh':
        return sumBossField(state, 'highCount');
      default:
        return 0;
    }
  }

  function tierOf(family, state) {
    const held = (state.achievementTiers || {})[family.id];
    return Number.isInteger(held) && held >= 1 && held <= TIER_MAX ? held : 0;
  }

  function tierMeta(tier) {
    return TIER_META.find(item => item.tier === tier) || null;
  }

  /* 一族成就的完整展示信息：当前阶级、当前进度、下一阶条件。
   * current 取**下一阶的指标**当前值（Boss 族铜→银时指标从通过数换成
   * 高评价数，UI 文案用 metricZh 说清楚在数什么）。
   * UI（个人资料面板）与小奥提示共用，不各自再算一遍。 */
  function familyBrief(family, state, lessons) {
    const tier = tierOf(family, state);
    const meta = tierMeta(tier);
    const nextTierDef = tier < TIER_MAX ? family.tiers[tier] : null;
    const currentMetric = nextTierDef ? nextTierDef.metric : family.tiers[TIER_MAX - 1].metric;
    const current = metricValue(state, currentMetric, lessons);
    const label = METRIC_LABELS[currentMetric.kind] || { zh: '进度', unit: 'times' };
    const nextThreshold = nextTierDef ? nextTierDef.value : null;
    const nextMeta = tier < TIER_MAX ? tierMeta(tier + 1) : null;
    return {
      id: family.id,
      zh: family.zh,
      desc: family.desc,
      unit: label.unit,
      metricZh: label.zh,
      tier,
      tierZh: meta ? meta.zh : null,
      tierCss: meta ? meta.css : null,
      current,
      maxed: tier >= TIER_MAX,
      nextTier: tier < TIER_MAX ? tier + 1 : null,
      nextTierZh: nextMeta ? nextMeta.zh : null,
      nextThreshold,
      /* 进度条按“当前值 / 下一阶阈值”；已满金时按最高阶阈值显示 100% */
      progressPct: nextThreshold
        ? Math.min(100, Math.round((current / nextThreshold) * 100))
        : Math.min(100, Math.round((current / family.tiers[TIER_MAX - 1].value) * 100)),
      thresholds: family.tiers.map(step => step.value),
      rewards: family.tiers.map(step => step.reward)
    };
  }

  function tiersBrief(state, lessons) {
    return TIER_FAMILIES.map(family => familyBrief(family, state, lessons));
  }

  /* 结算晋升：返回本次新晋升的阶级列表（含奖励叶片数）。
   * 一次调用可能连升多级（例如老档案第一次进来就满足金阶）——每级分别
   * 走 awardOnce 闩锁，重复调用返回空数组。 */
  function evaluateTiers(state, lessons, economyModule) {
    const economy = economyModule || (typeof window !== 'undefined' ? window.ODIN_ECONOMY : null);
    if (!state.achievementTiers || typeof state.achievementTiers !== 'object') state.achievementTiers = {};
    const promoted = [];
    TIER_FAMILIES.forEach(family => {
      const held = tierOf(family, state);
      let target = held;
      for (let index = 0; index < TIER_MAX; index += 1) {
        if (target >= index + 1) continue;
        const step = family.tiers[index];
        if (metricValue(state, step.metric, lessons) >= step.value) target = index + 1;
      }
      if (target <= held) return;
      state.achievementTiers[family.id] = target;   /* 单向闩锁：只升不降 */
      for (let tier = held + 1; tier <= target; tier += 1) {
        const reward = family.tiers[tier - 1].reward;
        const granted = economy ? economy.awardOnce(state, `tier:${family.id}:${tier}`, reward) : 0;
        promoted.push({
          familyId: family.id,
          familyZh: family.zh,
          tier,
          tierZh: (tierMeta(tier) || {}).zh || String(tier),
          amount: granted
        });
      }
    });
    return promoted;
  }

  /* 档案字段校验（供 progress.js sanitizeState 调用）：
   * 只接受已知族 id 与 1–3 的整数阶级；未知族（旧版本试验数据）丢弃。 */
  function sanitizeTiers(raw, families) {
    const list = families || TIER_FAMILIES;
    const known = new Set(list.map(family => family.id));
    const result = {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return result;
    for (const [familyId, tier] of Object.entries(raw)) {
      if (!known.has(familyId)) continue;
      const value = Math.floor(Number(tier) || 0);
      if (value >= 1 && value <= TIER_MAX) result[familyId] = value;
    }
    return result;
  }

  window.ODIN_TIERS = {
    STUDY_DAY_MIN_SECONDS, TIER_META, TIER_MAX, TIER_FAMILIES, METRIC_LABELS,
    metricValue, tierOf, tierMeta, familyBrief, tiersBrief, evaluateTiers, sanitizeTiers
  };
})();
