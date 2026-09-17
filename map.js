/* Foundations 地图（v4.3 交接 E1、E2）。
 *
 * 把官方 8 个单元 / 46 个课程节点渲染成一条“可探索的路线”：不替代原目录
 * （目录仍然是完整清单），也不替代技能路线（那是单元完成度概览）——地图的
 * 重点是**每课的学习状态比喻**与 Boss 入口。
 *
 * 节点状态五阶（交接 E2，全部是学习状态比喻，刻意不引入攻击力、血量、
 * 装备属性、暴击等重 RPG 数值）：
 *   unexplored 未探索：本站已开放，但还没打开过课程页
 *   scouted    已侦察：打开过课程页（started）
 *   broken     已破甲：勾选了「本课已完成」（与全站完成口径一致）
 *   defeated   已击破：本课完成 + 官方任务 + 本站自测三项齐全
 *   mastered   已精通：击破后经历过复习周期且当前没有待复习任务——
 *              复习通过（走完 1/3/7/30 阶梯时系统自动清除复习标记）
 *              或用户手动清除了复习标记（交接 E2“复习通过 / 复习状态清除”）。
 * 未开放课程（20–46）是 locked：仍然可见（灰点），但结构上不可点击。
 *
 * 一切状态都从 state 推导（确定性、可测），不落任何新存储字段。
 * 设计：纯逻辑，不依赖 DOM；app.js 负责渲染。加载顺序：bosses.js 之后。 */
(() => {
  'use strict';

  const bossesModule = (typeof window !== 'undefined' && window.ODIN_BOSSES) || null;

  /* 状态枚举与展示元数据（图例、节点 title、颜色 class 都从这里取） */
  const NODE_STATUSES = ['locked', 'unexplored', 'scouted', 'broken', 'defeated', 'mastered'];
  const STATUS_META = {
    locked: { zh: '未开放', hint: '本站尚未开放中文正文，请回官方原课学习', css: 'is-locked' },
    unexplored: { zh: '未探索', hint: '已开放，还没打开过这一课', css: 'is-unexplored' },
    scouted: { zh: '已侦察', hint: '打开过课程页，还没勾选完成', css: 'is-scouted' },
    broken: { zh: '已破甲', hint: '已勾选「本课已完成」', css: 'is-broken' },
    defeated: { zh: '已击破', hint: '本课完成 + 官方任务 + 本站自测三项齐全', css: 'is-defeated' },
    mastered: { zh: '已精通', hint: '击破后走完了 1/3/7/30 天复习阶梯', css: 'is-mastered' }
  };

  /* 单课节点状态推导。输入是原始事实，不依赖 catalog 对象形状：
   *   available    目录说这一课本站已开放
   *   hasLesson    lessons.js 里确有正文（与目录口径一致的“可用”判定）
   *   entry        state.lessons[slug]（可缺省）
   *   review       state.reviews[slug]（可缺省；everMarked 表示这一课
   *                经历过复习周期——阶梯走完自动清除或手动清除都算） */
  function lessonNodeStatus(options) {
    const opts = options || {};
    if (!opts.available || !opts.hasLesson) return 'locked';
    const entry = opts.entry || {};
    if (!entry.started) return 'unexplored';
    if (!entry.completed) return 'scouted';
    const allThree = entry.completed === true && entry.officialCompleted === true && entry.quizCompleted === true;
    if (!allThree) return 'broken';
    const review = opts.review || null;
    if (review && review.everMarked === true && entry.needsReview !== true) return 'mastered';
    return 'defeated';
  }

  /* 每个单元的路线视图：节点数组 + Boss 入口 + 汇总计数 */
  function unitViews(state, catalog, lessons, continueLessonId) {
    if (!catalog || !Array.isArray(catalog.lessons) || !Array.isArray(catalog.groups)) return [];
    const lessonById = new Map((lessons || []).map(lesson => [lesson.id, lesson]));
    return catalog.groups.map(group => {
      const entries = catalog.lessons.filter(entry => entry.group === group.id);
      const nodes = entries.map(entry => {
        const available = Boolean(entry.available) && lessonById.has(entry.slug);
        const status = lessonNodeStatus({
          available,
          hasLesson: lessonById.has(entry.slug),
          entry: (state.lessons || {})[entry.slug],
          review: (state.reviews || {})[entry.slug]
        });
        return {
          order: entry.order,
          slug: entry.slug,
          zh: entry.zh,
          title: entry.title,
          type: entry.type,
          status,
          isCurrent: available && entry.slug === continueLessonId,
          linkable: status !== 'locked'
        };
      });
      const boss = bossesModule ? bossesModule.bossForUnit(group.id) : null;
      const bossRecord = boss ? (state.bosses || {})[group.id] || null : null;
      /* v4.3 Batch 9（交接 M3）：评级同时给 id 与中文——地图上显示可见的
       * 评级徽章（is-dominant / is-advantage / …），不只藏在 title 里 */
      const bossRating = boss && bossRecord && bossRecord.bestPct !== null && bossRecord.bestPct !== undefined
        ? bossesModule.ratingOf(bossRecord.bestPct) || null
        : null;
      const openNodes = nodes.filter(node => node.status !== 'locked');
      return {
        group,
        nodes,
        openCount: openNodes.length,
        totalCount: nodes.length,
        exploredCount: openNodes.filter(node => !['locked', 'unexplored'].includes(node.status)).length,
        brokenCount: openNodes.filter(node => ['broken', 'defeated', 'mastered'].includes(node.status)).length,
        defeatedCount: openNodes.filter(node => ['defeated', 'mastered'].includes(node.status)).length,
        masteredCount: openNodes.filter(node => node.status === 'mastered').length,
        boss: boss ? {
          unitId: group.id,
          zh: boss.zh,
          desc: boss.desc,
          questionCount: boss.questions.length,
          attempted: Boolean(bossRecord && bossRecord.attempts > 0),
          bestPct: bossRecord ? bossRecord.bestPct : null,
          rating: bossRating ? bossRating.id : null,
          ratingZh: bossRating ? bossRating.zh || null : null
        } : null
      };
    });
  }

  /* 全图汇总：总节点 / 开放节点 / 各状态计数（首页地图区顶部一句话用） */
  function mapBrief(state, catalog, lessons, continueLessonId) {
    const units = unitViews(state, catalog, lessons, continueLessonId);
    const allNodes = units.reduce((list, unit) => list.concat(unit.nodes), []);
    const countOf = status => allNodes.filter(node => node.status === status).length;
    return {
      units,
      totalNodes: allNodes.length,
      openNodes: allNodes.filter(node => node.status !== 'locked').length,
      counts: {
        locked: countOf('locked'),
        unexplored: countOf('unexplored'),
        scouted: countOf('scouted'),
        broken: countOf('broken'),
        defeated: countOf('defeated'),
        mastered: countOf('mastered')
      },
      statuses: NODE_STATUSES.slice(),
      statusMeta: STATUS_META
    };
  }

  window.ODIN_MAP = {
    NODE_STATUSES, STATUS_META,
    lessonNodeStatus, unitViews, mapBrief
  };
})();
