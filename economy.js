/* 学习叶片模块（v4.2 交接 §3；v4.3 B1 定名：正式名「学习叶片」，UI 简称「叶片」）。
 *
 * 职责：叶片的唯一规则表与纯逻辑（获得、一次性奖励、消费）。叶片与 XP 彻底分离：
 *   XP   只决定 Level，不消费，历史兼容，不因解锁外观下降；
 *   叶片 只通过有效学习、完成课程、每日目标等学习行为获得；完全免费，不支持
 *        充值，不涉及真实货币，只用于解锁额外装扮与收藏，不影响课程完成、成就
 *        判定，不可换取 XP，也不可换取任何完成状态。
 *
 * 设计：纯逻辑层，不依赖 DOM 与 localStorage，与 progress.js 的 Logic 层同一风格，
 *       可在 Node 中直接测试（tests/economy.test.cjs）。
 *       状态本身仍由 progress.js 持久化（单一事实源）；本模块只定义规则与变更函数，
 *       在 progress.js 的对应变更点被调用，自己不读写存储。
 * 边界：所有发放都幂等——按累计量的计数器（分钟块）或一次性闩锁（coinFlags），
 *       重复勾选、重复调用、撤销重勾都无法刷币；旧档案迁移不追溯补发（见
 *       progress.js migrateState），导入档案无法凭历史数据铸币。
 * 加载顺序：必须先于 progress.js 加载（HTML 已按此排列）；缺失时 progress.js
 *       自动降级为不发叶片，课程阅读与进度记录不受影响。 */
(() => {
  'use strict';

  /* ---------- 唯一规则表（交接 §3.2） ----------
   * 规则值允许微调，但只能改这里；specs.md 与收藏柜文案都引用同一张表。 */
  const COIN_RULES = [
    { id: 'minute-block', zh: '有效学习每累计 10 分钟', amount: 5, desc: '按累计有效学习秒数结算，天然幂等' },
    { id: 'first-lesson', zh: '首次完成一课', amount: 20, desc: '每课只发一次，撤销重勾不重复发' },
    { id: 'first-official', zh: '首次完成官方任务', amount: 10, desc: '每课只发一次' },
    { id: 'first-quiz', zh: '首次完成本站自测', amount: 5, desc: '每课只发一次' },
    /* v4.5（交接 Core F）：首次有效读到本课结尾。阅读里程碑 ≠ 课程完成：
     * 需要本次会话有效阅读 ≥60 秒且滚动到 100%，不勾选任何完成状态。 */
    { id: 'read-complete', zh: '首次读到一课结尾', amount: 5, desc: '每课只发一次；需本次有效阅读 ≥60 秒且阅读位置到 100%，不代表课程完成' },
    { id: 'daily-goal', zh: '达成每日学习目标', amount: 10, desc: '每天最多一次（每日目标见 daily 系统）' },
    { id: 'streak-7', zh: '连续学习 7 天', amount: 100, desc: '一次性奖励，终身只发一次' }
  ];
  const MINUTE_BLOCK_SECONDS = 600;    // 10 分钟一块
  const COINS_PER_BLOCK = 5;
  const COIN_FIRST_LESSON = 20;
  const COIN_FIRST_OFFICIAL = 10;
  const COIN_FIRST_QUIZ = 5;
  const COIN_READ_COMPLETE = 5;        // v4.5（交接 Core F）：首次有效读到本课结尾
  const COIN_DAILY_GOAL = 10;          // 每日目标达成奖励（daily.js 结算时调用）
  const COIN_STREAK_7 = 100;
  const STREAK_REWARD_DAYS = 7;
  /* 消费上限只做异常防护（手改档案灌入天文数字），正常使用远碰不到。 */
  const COINS_MAX = 1000000000;

  /* ---------- 一次性闩锁的 key 构造（集中一处，避免散落拼写漂移） ---------- */
  const flagKey = (kind, lessonId) => `coin:${kind}:${lessonId}`;
  const STREAK_FLAG = 'coin:streak-7';
  const DAILY_FLAG_PREFIX = 'coin:daily-goal:';

  /* ---------- 获得 ---------- */

  /* 分钟叶片按累计总秒数发放，与 awardMinuteXp 同一思路：重复调用幂等，
   * 撤销状态不会重复领取（秒数只增不减）。 */
  function awardMinuteCoins(state) {
    const due = Math.floor(state.totalActiveSeconds / MINUTE_BLOCK_SECONDS);
    if (due <= state.coinMinuteAwarded) return 0;
    const gained = (due - state.coinMinuteAwarded) * COINS_PER_BLOCK;
    state.coinMinuteAwarded = due;
    state.coins += gained;
    return gained;
  }

  /* 一次性叶片：与 XP 的 rewardFlags 分开记账（coinFlags），否则 XP 领过之后
   * 叶片会被误判为已发放。返回本次发放数量，0 表示已领过。 */
  function awardOnce(state, key, amount) {
    if (!key || !(amount > 0)) return 0;
    if (state.coinFlags[key]) return 0;
    state.coinFlags[key] = true;
    state.coins += amount;
    return amount;
  }

  /* 课程完成类一次性奖励。kind 与 progress.js 的勾选字段一一对应；
   * needsReview 没有 kind——标记需要复习不发叶片。 */
  const LESSON_COINS = {
    completed: COIN_FIRST_LESSON,
    officialCompleted: COIN_FIRST_OFFICIAL,
    quizCompleted: COIN_FIRST_QUIZ
  };

  function awardLessonCoins(state, field, lessonId) {
    const amount = LESSON_COINS[field] || 0;
    if (!amount || !lessonId) return 0;
    return awardOnce(state, flagKey(field, lessonId), amount);
  }

  /* 连续学习 7 天的一次性奖励。由 progress.js 的保存钩子每次结算；
   * streak 是按当前档案实时计算的派生值，所以闩锁落在 coinFlags 上。 */
  function settleStreakCoins(state, todayKey, streakNow) {
    if (!streakNow || streakNow < STREAK_REWARD_DAYS) return 0;
    return awardOnce(state, STREAK_FLAG, COIN_STREAK_7);
  }

  /* 每日目标达成奖励（每天最多一次）。dayKey 是本地自然日，跨日自然重置。 */
  function awardDailyGoalCoins(state, dayKey) {
    if (!dayKey) return 0;
    return awardOnce(state, DAILY_FLAG_PREFIX + dayKey, COIN_DAILY_GOAL);
  }

  /* ---------- 消费（装扮收藏系统使用） ---------- */

  /* 只减不加护栏：余额不足直接失败，绝不出现负数。
   * amount 非正数视为非法调用，直接拒绝。 */
  function spendCoins(state, amount) {
    const whole = Math.floor(Number(amount) || 0);
    if (whole <= 0) return { ok: false, error: '消费数量必须大于 0' };
    if (whole > state.coins) return { ok: false, error: `叶片不足：当前 ${state.coins}，需要 ${whole}` };
    state.coins -= whole;
    return { ok: true, coins: state.coins };
  }

  /* ---------- 旧档案基线（不追溯补发） ----------
   * v1/v2 档案升级到 v3 时调用：把“历史上已经满足条件”的一次性奖励全部标记为
   * 已发放（但不发币），分钟块计数也对齐到已累计秒数。这样旧用户的历史学习
   * 不追溯铸币，之后的新行为正常获得叶片。同一份 v3 档案导出/导入不走这里。 */
  function baselineMigratedState(state) {
    state.coins = 0;
    state.coinMinuteAwarded = Math.floor((state.totalActiveSeconds || 0) / MINUTE_BLOCK_SECONDS);
    state.coinFlags = state.coinFlags || {};
    for (const [lessonId, entry] of Object.entries(state.lessons || {})) {
      if (entry && entry.completed === true) state.coinFlags[flagKey('completed', lessonId)] = true;
      if (entry && entry.officialCompleted === true) state.coinFlags[flagKey('officialCompleted', lessonId)] = true;
      if (entry && entry.quizCompleted === true) state.coinFlags[flagKey('quizCompleted', lessonId)] = true;
    }
    return state;
  }

  /* 档案字段规范化：非法值回安全默认，超大值夹到上限。供 sanitizeState 调用。 */
  function normalizeCoins(value) {
    const whole = Math.floor(Number(value) || 0);
    if (!Number.isFinite(whole) || whole < 0) return 0;
    return Math.min(whole, COINS_MAX);
  }

  window.ODIN_ECONOMY = {
    /* 规则表与常量 */
    COIN_RULES, MINUTE_BLOCK_SECONDS, COINS_PER_BLOCK,
    COIN_FIRST_LESSON, COIN_FIRST_OFFICIAL, COIN_FIRST_QUIZ, COIN_READ_COMPLETE,
    COIN_DAILY_GOAL, COIN_STREAK_7, STREAK_REWARD_DAYS, COINS_MAX,
    flagKey, STREAK_FLAG, DAILY_FLAG_PREFIX,
    /* 获得 */
    awardMinuteCoins, awardOnce, awardLessonCoins,
    settleStreakCoins, awardDailyGoalCoins,
    /* 消费 */
    spendCoins,
    /* 迁移与校验 */
    baselineMigratedState, normalizeCoins
  };
})();
