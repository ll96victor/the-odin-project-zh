/* 学习历史（v4.2，交接 §10）。
 *
 * 只记录有意义的事件：开始/完成课程、完成官方任务、完成自测、标记或清除
 * 复习、解锁成就、达成每日目标、一次性叶片获得（streak-7 / 每日目标）、
 * 叶片消费（兑换外观）。刻意不记录：scroll、mousemove、每秒计时、每次刷新，
 * 以及每 10 分钟一次的分钟块叶片收益（太碎，事件里会重复出现“+5 叶片”）。
 *
 * 设计：纯逻辑，不依赖 DOM 与存储。事件按发生顺序追加在数组末尾，
 * 超出容量上限时从最旧的开始丢弃（保留最近 MAX_EVENTS 条，防止
 * localStorage 无限增长——§10 要求 500–1000，取 1000）。
 * 事件结构刻意最小：at（ISO 时刻）、day（本地日期键）、type、以及 0–2 个
 * 事件详情字段（lessonId / achievementId / amount / assetId / zh）。
 * 展示文案由 UI 按事件类型拼装（history.js 不持课程清单）。 */
(() => {
  'use strict';

  const MAX_EVENTS = 1000;

  const EVENT_TYPES = [
    'lesson-start',       // 开始某课（每课只记第一次）
    'lesson-complete',    // 完成某课
    'official-complete',  // 完成官方任务
    'quiz-complete',      // 完成本站自测
    'review-mark',        // 标记需要复习
    'review-clear',       // 清除复习标记
    'review-done',        // v4.3：完成一次复习（推进 1/3/7/30 阶梯，交接 G）
    'read-complete',      // v4.5：首次有效读到本课结尾（交接 Core F；阅读里程碑，≠ 课程完成）
    'achievement',        // 解锁成就
    'level-up',           // v4.5：等级提升（zh 存「达到 Lv.N」；一批结算只记一条，曲线迁移补记不产生流水）
    'tier-up',            // v4.3：循环成就晋升（铜/银/金，zh 存「族名 · 阶级」）
    'boss-attempt',       // v4.3：章节 Boss 挑战（zh 存「Boss 名 分数% · 评级」）
    'daily-goal',         // 达成每日学习目标
    'coin-grant',         // 一次性叶片获得（streak-7 / 每日目标 / 晋升奖励 / 挑战奖励之外不记，见文件头）
    'coin-spend'          // 叶片消费（解锁外观）
  ];

  function logEvent(state, type, detail, nowIso) {
    if (!EVENT_TYPES.includes(type)) return false;
    if (!state.history) state.history = [];
    const at = typeof nowIso === 'string' ? nowIso : new Date().toISOString();
    const event = { at, day: at.slice(0, 10), type };
    if (detail && typeof detail === 'object') {
      if (typeof detail.lessonId === 'string') event.lessonId = detail.lessonId;
      if (typeof detail.achievementId === 'string') event.achievementId = detail.achievementId;
      if (typeof detail.assetId === 'string') event.assetId = detail.assetId;
      if (Number.isFinite(Number(detail.amount))) event.amount = Math.floor(Number(detail.amount));
      if (typeof detail.zh === 'string' && detail.zh) event.zh = detail.zh.slice(0, 40);
    }
    state.history.push(event);
    if (state.history.length > MAX_EVENTS) {
      state.history.splice(0, state.history.length - MAX_EVENTS);
    }
    return true;
  }

  /* 按日期分组、日期倒序（最新的一天在最上面），同一天内按时间正序。
   * limit 限制返回的事件总数（UI 分页用），默认全部。 */
  function historyGrouped(state, limit) {
    const events = Array.isArray(state.history) ? state.history : [];
    const wanted = Number(limit) > 0 ? Number(limit) : events.length;
    const byDay = new Map();
    for (const event of events) {
      if (!event || typeof event !== 'object' || !event.day) continue;
      if (!byDay.has(event.day)) byDay.set(event.day, []);
      byDay.get(event.day).push(event);
    }
    const days = [...byDay.keys()].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
    const grouped = [];
    let remaining = wanted;
    for (const day of days) {
      if (remaining <= 0) break;
      const dayEvents = byDay.get(day);
      const take = Math.min(dayEvents.length, remaining);
      grouped.push({ day, events: take === dayEvents.length ? dayEvents : dayEvents.slice(dayEvents.length - take) });
      remaining -= take;
    }
    return grouped;
  }

  function historyCount(state) {
    return Array.isArray(state.history) ? state.history.length : 0;
  }

  /* ---------- 档案条目校验（供 progress.js 的 sanitizeState 调用） ----------
   * 单条历史是尽力而为的流水数据：坏条目直接丢弃，不让整份档案被拒。
   * 事件必需的详情字段缺失（例如课程事件没有合法 lessonId）视为坏条目。 */
  const LESSON_EVENTS = ['lesson-start', 'lesson-complete', 'official-complete', 'quiz-complete', 'review-mark', 'review-clear'];
  const ISO_PREFIX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
  const ID_PATTERN = /^[a-z][a-z0-9-]{0,63}$/;

  function sanitizeEvent(raw, validLessonIds, validAchievementIds) {
    if (!raw || typeof raw !== 'object') return null;
    if (!EVENT_TYPES.includes(raw.type)) return null;
    if (typeof raw.at !== 'string' || !ISO_PREFIX.test(raw.at)) return null;
    const event = { at: raw.at, day: raw.at.slice(0, 10), type: raw.type };
    if (typeof raw.lessonId === 'string' && validLessonIds.has(raw.lessonId)) event.lessonId = raw.lessonId;
    if (typeof raw.achievementId === 'string' && validAchievementIds.has(raw.achievementId)) event.achievementId = raw.achievementId;
    if (typeof raw.assetId === 'string' && ID_PATTERN.test(raw.assetId)) event.assetId = raw.assetId;
    if (typeof raw.amount === 'number' && Number.isFinite(raw.amount) && raw.amount >= 0) event.amount = Math.floor(raw.amount);
    if (typeof raw.zh === 'string' && raw.zh) event.zh = raw.zh.slice(0, 40);
    /* 必需字段：课程事件必须有合法 lessonId，成就事件必须有合法 achievementId */
    if (LESSON_EVENTS.includes(event.type) && !event.lessonId) return null;
    if (event.type === 'achievement' && !event.achievementId) return null;
    return event;
  }

  window.ODIN_HISTORY = {
    MAX_EVENTS, EVENT_TYPES,
    logEvent, historyGrouped, historyCount, sanitizeEvent
  };
})();
