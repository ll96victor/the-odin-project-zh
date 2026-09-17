/* 站内图标（v4）。全部为本站原创的极简线条图标，不引用任何远程资源、
 * 不使用第三方图标库、不含脚本或外部字体。
 *
 * 与 avatars.js 一样用 data URL 放进 <img> 渲染：放进 <img> 的 SVG 是惰性的，
 * 浏览器不会执行其中的脚本，也避开了本项目“运行时不得用字符串直接注入标记”的约束。
 *
 * 颜色写死在 SVG 里（<img> 内的 currentColor 不会继承页面 CSS），
 * 未解锁状态由 CSS 的 filter: grayscale() 处理，因此每个图标只需要一份。 */
window.ODIN_ICONS = {
  version: 1,
  dataUrlPrefix: 'data:image/svg+xml;charset=utf-8,',
  license: '本站原创极简线条图标，随本项目内容采用 CC BY-NC-SA 4.0；未使用任何第三方图标库。',
  /* 成就类别图标：键与 progress.js 的 ACHIEVEMENT_CATEGORIES 一一对应，
   * tests/profile.test.cjs 会断言两边键集合一致，避免各自维护一份清单而漂移。 */
  achievementCategories: {
    /* 学习时长：时钟 */
    time: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#276148" stroke-width="2"/><path d="M12 7v5.2l3.6 2.1" fill="none" stroke="#276148" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    /* 连续学习：火苗 */
    streak: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2c2.6 3.6 5 5.6 5 9.6A5 5 0 0 1 7 11.6C7 9.1 8.5 7.6 9.5 6.1c.2 1.5 1 2.4 2 2.6C11.7 6.6 11.6 4.3 12 2z" fill="#a4553f"/><path d="M12 13.2c1.1 1.3 1.8 2.1 1.8 3.3a1.8 1.8 0 0 1-3.6 0c0-1.2.7-2 1.8-3.3z" fill="#edf3ee"/></svg>',
    /* 课程完成：书 + 勾 */
    lesson: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="#276148" stroke-width="2"/><path d="M8 12.2l2.6 2.6L16.2 9" fill="none" stroke="#276148" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    /* 官方任务：写字板 + 勾 */
    official: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 3h6v2.5H9z" fill="#276148"/><rect x="5" y="4.5" width="14" height="16.5" rx="2" fill="none" stroke="#276148" stroke-width="2"/><path d="M8.8 13l2.2 2.2 4.2-4.4" fill="none" stroke="#a4553f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    /* 本站自测：问号 */
    quiz: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#276148" stroke-width="2"/><path d="M9.4 9.4a2.6 2.6 0 1 1 3.5 2.4c-.6.3-.9.8-.9 1.5v.6" fill="none" stroke="#276148" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17.2" r="1.2" fill="#a4553f"/></svg>',
    /* 单元：层叠 */
    unit: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2.6l8.4 4.2-8.4 4.2-8.4-4.2z" fill="#276148"/><path d="M3.6 12L12 16.2 20.4 12" fill="none" stroke="#276148" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><path d="M3.6 16.8L12 21l8.4-4.2" fill="none" stroke="#a4553f" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>',
    /* 复习与使用：书签 */
    usage: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 3h11a1 1 0 0 1 1 1v17.2l-6.5-4.3-6.5 4.3V4a1 1 0 0 1 1-1z" fill="none" stroke="#276148" stroke-width="2" stroke-linejoin="round"/><path d="M12 7.5v5" stroke="#a4553f" stroke-width="2" stroke-linecap="round"/></svg>',
    /* 单日学习（v4.2）：太阳（只看“今天/单日”，与累计时钟区分） */
    day: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5" fill="#a8791c"/><path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7" stroke="#a8791c" stroke-width="2" stroke-linecap="round"/></svg>',
    /* 等级（v4.2）：上升台阶 */
    level: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 20h5v-5h5v-5h6" fill="none" stroke="#276148" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><path d="M15 4.5L20.5 10 15 10z" fill="#a4553f"/></svg>',
    /* 收藏与兑换（v4.2）：礼盒 */
    collection: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="4" y="9" width="16" height="11" rx="1.5" fill="none" stroke="#276148" stroke-width="2"/><path d="M12 9v11M4 13h16" stroke="#276148" stroke-width="2"/><path d="M12 9c-3 0-4.5-1.5-4.5-3S9.5 3.5 12 9zM12 9c3 0 4.5-1.5 4.5-3S14.5 3.5 12 9z" fill="none" stroke="#a4553f" stroke-width="2" stroke-linejoin="round"/></svg>',
    /* 学习广度（v4.2）：放大镜 */
    exploration: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="#276148" stroke-width="2"/><path d="M15.5 15.5L21 21" stroke="#25312c" stroke-width="2.4" stroke-linecap="round"/><path d="M8 10.5a2.5 2.5 0 0 1 2.5-2.5" fill="none" stroke="#a4553f" stroke-width="1.8" stroke-linecap="round"/></svg>',
    /* 章节挑战（v4.3，交接 E3）：盾与剑——Boss 是单元综合自测的比喻，
     * 与循环成就 tierFamilies.boss（盾+勾）刻意不同稿 */
    boss: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 4.5l6 2 6-2v7c0 4.2-2.6 7.4-6 9-3.4-1.6-6-4.8-6-9z" fill="none" stroke="#276148" stroke-width="2" stroke-linejoin="round"/><path d="M12 7.5v7M9.5 10l2.5-2.5L14.5 10" fill="none" stroke="#a4553f" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  },
  /* 重要里程碑的独立 SVG（§7.1：里程碑不能和普通成就长一个样）。
   * 键是 achievement id；隐藏里程碑在解锁前仍显示上锁图标，解锁后才亮出。
   * v4.3 Batch 6（交接 H）：独立图标不再要求 milestone 标记——凡是在这张表里
   * 有专属图标的成就（重要成就/成就族代表）都优先用专属图标，显著减少
   * “多人共用同一个类别图标”的重复感；其余成就仍按类别图标族渲染。 */
  achievementMilestones: {
    'active-100h': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 3h11M6.5 21h11" stroke="#a8791c" stroke-width="2" stroke-linecap="round"/><path d="M7 3v3.5c0 1.5 2.2 3 5 3.5 2.8-.5 5-2 5-3.5V3" fill="none" stroke="#a8791c" stroke-width="2" stroke-linejoin="round"/><path d="M7 21v-3.5c0-1.5 2.2-3 5-3.5 2.8.5 5 2 5 3.5V21" fill="none" stroke="#a8791c" stroke-width="2" stroke-linejoin="round"/><path d="M12 10.8v2.4" stroke="#a4553f" stroke-width="1.8" stroke-linecap="round"/></svg>',
    'streak-60': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 21V3.5" stroke="#25312c" stroke-width="2.2" stroke-linecap="round"/><path d="M6 4h11l-2.5 3.5L17 11H6z" fill="#a4553f" stroke="#a4553f" stroke-width="1.5" stroke-linejoin="round"/><path d="M4.5 21h3" stroke="#25312c" stroke-width="2.2" stroke-linecap="round"/></svg>',
    'all-lessons': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3l9 4.5L12 12 3 7.5z" fill="#276148"/><path d="M6.5 10.5v4.2c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.2" fill="none" stroke="#276148" stroke-width="2" stroke-linejoin="round"/><path d="M21 7.5v5" stroke="#a4553f" stroke-width="2" stroke-linecap="round"/></svg>',
    'official-all': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="9" r="5.5" fill="none" stroke="#a8791c" stroke-width="2"/><path d="M9 9l2 2 3.5-4" fill="none" stroke="#a8791c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5" fill="none" stroke="#276148" stroke-width="2" stroke-linejoin="round"/></svg>',
    'day-1h': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="#a8791c"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" stroke="#a4553f" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="12" r="7" fill="none" stroke="#a8791c" stroke-width="1.6" stroke-dasharray="2.5 2.5"/></svg>',
    /* ---------- v4.3 Batch 6 扩充：重要成就的专属图标（交接 H） ---------- */
    /* 推开学习之门：门 + 进入箭头 */
    'first-steps': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3h10l4 4v14H5z" fill="none" stroke="#276148" stroke-width="2" stroke-linejoin="round"/><path d="M15 3v4h4" fill="none" stroke="#276148" stroke-width="2" stroke-linejoin="round"/><path d="M8.5 13.5h6M12 11l2.5 2.5L12 16" fill="none" stroke="#a4553f" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    /* 完成第一课：书页上的小旗 */
    'first-lesson': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 5.5A2 2 0 0 1 6 3.5h13v13H6a2 2 0 0 0-2 2z" fill="none" stroke="#276148" stroke-width="2" stroke-linejoin="round"/><path d="M4 18.5A2 2 0 0 1 6 16.5h13" fill="none" stroke="#276148" stroke-width="2"/><path d="M10 6.5v6M10 7l4 1.4-4 1.6" fill="none" stroke="#a4553f" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    /* 连续 7 天：火苗 + 四溅的火星 */
    'streak-7': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3.5c2.3 3.2 4.4 5 4.4 8.4a4.4 4.4 0 0 1-8.8 0c0-2.2 1.3-3.5 2.2-4.9.2 1.3.9 2.1 1.7 2.3.2-1.8.1-3.8.5-5.8z" fill="#a4553f"/><path d="M12 12.8c.9 1.1 1.5 1.8 1.5 2.8a1.5 1.5 0 0 1-3 0c0-1 .6-1.7 1.5-2.8z" fill="#edf3ee"/><path d="M4.6 6.8L6 7.8M19.4 6.8L18 7.8M3.6 12.5h1.7M18.7 12.5h1.7" stroke="#a8791c" stroke-width="1.6" stroke-linecap="round"/></svg>',
    /* 连续 30 天：点线月环里的火苗 */
    'streak-30': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.2" fill="none" stroke="#276148" stroke-width="1.7" stroke-dasharray="0.1 3.3" stroke-linecap="round"/><path d="M12 6.2c1.8 2.4 3.4 3.8 3.4 6.3a3.4 3.4 0 0 1-6.8 0c0-1.7 1-2.7 1.7-3.7.1 1 .6 1.6 1.3 1.7.1-1.4 0-2.9.4-4.3z" fill="#a4553f"/></svg>',
    /* 完成 10 课：三本叠起的书 */
    'lessons-10': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="3.5" y="15" width="17" height="4.2" rx="1.2" fill="none" stroke="#276148" stroke-width="1.8"/><rect x="5" y="9.9" width="14" height="4.2" rx="1.2" fill="none" stroke="#276148" stroke-width="1.8"/><rect x="6.5" y="4.8" width="11" height="4.2" rx="1.2" fill="none" stroke="#a4553f" stroke-width="1.8"/><path d="M6.3 17.1h2.2M7.8 12h2.2" stroke="#276148" stroke-width="1.5" stroke-linecap="round"/></svg>',
    /* 全部自测完成：靶心 + 勾 */
    'quiz-all': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.8" fill="none" stroke="#276148" stroke-width="1.8"/><circle cx="12" cy="12" r="5" fill="none" stroke="#276148" stroke-width="1.4" stroke-dasharray="2 2.2"/><path d="M8.6 12.2l2.3 2.3 4.5-4.9" fill="none" stroke="#a4553f" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    /* 累计 10 小时：填了进度楔形的钟面（与 100h 的纪念杯区分） */
    'active-10h': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.8" fill="none" stroke="#276148" stroke-width="1.8"/><path d="M12 12V6.2a5.8 5.8 0 0 1 5.2 8.4z" fill="#6f9c85"/><path d="M12 12l-3.6 3.6" stroke="#25312c" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="12" r="1.2" fill="#25312c"/></svg>',
    /* 连续 7 天达成每日目标：靶心 + 小火苗 */
    'goal-streak-7': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="10.2" cy="13.8" r="7.4" fill="none" stroke="#276148" stroke-width="1.8"/><circle cx="10.2" cy="13.8" r="3.4" fill="none" stroke="#276148" stroke-width="1.5"/><circle cx="10.2" cy="13.8" r="1.1" fill="#a4553f"/><path d="M18.4 2.8c1 1.5 1.9 2.3 1.9 4a1.9 1.9 0 0 1-3.8 0c0-1 .5-1.7 1.1-2.3.1.5.4.9.8 1 0-.9 0-1.8 0-2.7z" fill="#a8791c"/></svg>',
    /* 首破章节 Boss：裂纹盾牌（破甲的瞬间） */
    'boss-first': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2.8l7.5 3.2v5.2c0 4.6-3.2 8-7.5 9.8-4.3-1.8-7.5-5.2-7.5-9.8V6z" fill="none" stroke="#276148" stroke-width="2" stroke-linejoin="round"/><path d="M12.6 5.8L10 10.4h3.1L9.8 15.6l5-5.4h-2.9l2.4-3.2z" fill="#a4553f"/></svg>',
    /* 未战先知：先看见的眼睛 */
    'boss-precheck-high': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.8 12.5S6.2 7 12 7s9.2 5.5 9.2 5.5S17.8 18 12 18s-9.2-5.5-9.2-5.5z" fill="none" stroke="#276148" stroke-width="1.9" stroke-linejoin="round"/><circle cx="12" cy="12.5" r="2.8" fill="#a8791c"/><path d="M12 2.6v1.8M5.6 4.6l1.2 1.3M18.4 4.6l-1.2 1.3" stroke="#a4553f" stroke-width="1.6" stroke-linecap="round"/></svg>',
    /* 复习清零：走完一圈的循环 + 大勾（与复习族的“循环 + 时针”区分） */
    'review-cleared': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.2 12a8.2 8.2 0 1 1-2.7-6.1" fill="none" stroke="#276148" stroke-width="2" stroke-linecap="round"/><path d="M20.4 3.4V7h-3.6" fill="none" stroke="#276148" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.2 12.3l2.5 2.5 4.8-5.2" fill="none" stroke="#a4553f" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    /* 全部课程都看过：书页上的眼睛 */
    'started-all': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 5.5A2 2 0 0 1 6 3.5h13v13H6a2 2 0 0 0-2 2z" fill="none" stroke="#276148" stroke-width="2" stroke-linejoin="round"/><path d="M4 18.5A2 2 0 0 1 6 16.5h13" fill="none" stroke="#276148" stroke-width="2"/><path d="M7.6 10.2s1.8-2.4 4.4-2.4 4.4 2.4 4.4 2.4-1.8 2.4-4.4 2.4-4.4-2.4-4.4-2.4z" fill="none" stroke="#a4553f" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="10.2" r="1.1" fill="#a4553f"/></svg>'
  },
  /* 隐藏成就：上锁的盒子。未解锁的普通成就仍用类别图标 + CSS 灰化，
   * 只有隐藏成就换成这个图标，因为它的名称与条件都不公开。 */
  /* 学习助手「小奥」的角色形象（§10）。本站原创的小芽：圆角方块身体、两片叶子、
   * 两个圆点眼睛和一道笑弧，与本站 style.css 声明的 Garden 主题一致；
   * 刻意不复制 Codex 宠物、王者荣耀角色或任何其他商业角色。 */
  assistant: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path d="M32 22V12" stroke="#276148" stroke-width="2.6" stroke-linecap="round" fill="none"/><path d="M32 15c-6 0-9.5-4-9.5-8.5C28.5 6.5 32 10.5 32 15z" fill="#6f9c85"/><path d="M32 13c6 0 9.5-4 9.5-8.5C35.5 4.5 32 8.5 32 13z" fill="#276148"/><rect x="14" y="22" width="36" height="34" rx="9" fill="#edf3ee" stroke="#276148" stroke-width="2.4"/><circle cx="25" cy="37" r="2.7" fill="#22302a"/><circle cx="39" cy="37" r="2.7" fill="#22302a"/><path d="M26 45q6 5 12 0" stroke="#22302a" stroke-width="2.4" stroke-linecap="round" fill="none"/></svg>',
  hidden: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="4.5" y="10" width="15" height="11" rx="2.5" fill="#56625c"/><path d="M8 10V7.2a4 4 0 0 1 8 0V10" fill="none" stroke="#56625c" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="15.2" r="1.6" fill="#fafbf9"/><path d="M12 16.4v2.2" stroke="#fafbf9" stroke-width="1.8" stroke-linecap="round"/></svg>',
  /* v4.3（交接 D1）：循环成就的铜 / 银 / 金阶级徽章。同一套骨架（外环 +
   * 内盾 + 顶部星点）参数化换色换装饰：铜单环无星、银双环一颗星、
   * 金双环加光芒三颗星——阶级视觉明显不同，但一眼能认出是同一家族。 */
  tierBadges: {
    bronze: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.2" fill="none" stroke="#b08d57" stroke-width="2.2"/><path d="M12 6.4l4.8 2.6v5.2L12 17l-4.8-2.8V9z" fill="#c9a06a" stroke="#8a6a3b" stroke-width="1.3" stroke-linejoin="round"/></svg>',
    silver: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.2" fill="none" stroke="#9ca3af" stroke-width="2.2"/><circle cx="12" cy="12" r="6.8" fill="none" stroke="#c7ccd4" stroke-width="1.2"/><path d="M12 6.4l4.8 2.6v5.2L12 17l-4.8-2.8V9z" fill="#d5d9e0" stroke="#7d838c" stroke-width="1.3" stroke-linejoin="round"/><path d="M12 9.2l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2L9.1 11.4l2-.3z" fill="#7d838c"/></svg>',
    gold: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.2" fill="none" stroke="#d4af37" stroke-width="2.4"/><circle cx="12" cy="12" r="6.8" fill="none" stroke="#f0dc9a" stroke-width="1.2"/><path d="M12 2v2.2M22 12h-2.2M12 22v-2.2M2 12h2.2" stroke="#d4af37" stroke-width="1.6" stroke-linecap="round"/><path d="M12 6.4l4.8 2.6v5.2L12 17l-4.8-2.8V9z" fill="#f2d98b" stroke="#a8791c" stroke-width="1.3" stroke-linejoin="round"/><path d="M12 9.2l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2L9.1 11.4l2-.3z" fill="#a8791c"/></svg>'
  },
  /* v4.3（交接 D1）：循环成就族的类别图标（与一次性成就的类别图标同一线条语言） */
  tierFamilies: {
    'study-days': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="2" fill="none" stroke="#276148" stroke-width="2"/><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" stroke="#276148" stroke-width="2" stroke-linecap="round"/><path d="M8.5 14l2 2 4-4.2" fill="none" stroke="#a4553f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    'goal-days': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="#276148" stroke-width="2"/><circle cx="12" cy="12" r="4.5" fill="none" stroke="#a4553f" stroke-width="2"/><circle cx="12" cy="12" r="1.4" fill="#276148"/></svg>',
    'quiz-lessons': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 4.5h9.5L19 9v10.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" fill="none" stroke="#276148" stroke-width="2" stroke-linejoin="round"/><path d="M9.6 11.4a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.5" fill="none" stroke="#a4553f" stroke-width="1.8" stroke-linecap="round"/><circle cx="12.1" cy="17.6" r="1" fill="#a4553f"/></svg>',
    explore: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 19c3-1 4.5-4 4.5-7S10 5.5 12 4c2 1.5 3.5 4.5 3.5 8s1.5 6 4.5 7z" fill="none" stroke="#276148" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="11" r="2.2" fill="#a4553f"/><path d="M12 13.2V19" stroke="#276148" stroke-width="1.8" stroke-linecap="round"/></svg>',
    'review-actions': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.6-5.9" fill="none" stroke="#276148" stroke-width="2" stroke-linecap="round"/><path d="M20 3.5V7h-3.5" fill="none" stroke="#a4553f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8v4.4l3 1.8" fill="none" stroke="#276148" stroke-width="1.8" stroke-linecap="round"/></svg>',
    boss: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3l7 3.2v5.1c0 4.4-3 7.6-7 9.4-4-1.8-7-5-7-9.4V6.2z" fill="none" stroke="#276148" stroke-width="2" stroke-linejoin="round"/><path d="M9 10.2l1.6 1.6L14 8.4M9 14.4h6" fill="none" stroke="#a4553f" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  },
  /* v4.4（交接 A1）：首页 6 个二级入口卡的图标。与成就/循环成就同一线条语言
   * （accent 绿主线 + warn 赭红点缀、24 viewBox、fill:none 线条风）；
   * 图标只做装饰（aria-hidden），入口卡永远带文字标题，不依赖图标传达信息。 */
  entryIcons: {
    progress: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 20h18" fill="none" stroke="#276148" stroke-width="2" stroke-linecap="round"/><rect x="4.5" y="11" width="3.6" height="7" rx="1" fill="none" stroke="#276148" stroke-width="1.8"/><rect x="10.2" y="6" width="3.6" height="12" rx="1" fill="none" stroke="#276148" stroke-width="1.8"/><rect x="15.9" y="13.5" width="3.6" height="4.5" rx="1" fill="#a4553f" opacity=".85"/></svg>',
    tasks: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="16" rx="2.5" fill="none" stroke="#276148" stroke-width="2"/><path d="M7.8 12.6l2.7 2.7 5.7-6" fill="none" stroke="#a4553f" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    skill: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 20.5c0-3.6 10-2.9 10-6.6S7 10.6 7 6.9 10.4 3.5 13 3.5" fill="none" stroke="#276148" stroke-width="2" stroke-linecap="round"/><circle cx="7" cy="20.5" r="1.9" fill="#a4553f"/><circle cx="14.8" cy="3.8" r="1.7" fill="none" stroke="#276148" stroke-width="1.8"/></svg>',
    world: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.8" fill="none" stroke="#276148" stroke-width="2"/><path d="M3.4 12h17.2M12 3.2c2.9 3.4 2.9 14.2 0 17.6M12 3.2c-2.9 3.4-2.9 14.2 0 17.6" fill="none" stroke="#276148" stroke-width="1.6"/><circle cx="12" cy="12" r="1.5" fill="#a4553f"/></svg>',
    collection: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3.2l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9L3.5 9.4l5.9-.8z" fill="none" stroke="#276148" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="11.6" r="1.6" fill="#a4553f"/></svg>',
    stats: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="3.4" y="3.4" width="7.2" height="7.2" rx="1.6" fill="none" stroke="#276148" stroke-width="1.9"/><rect x="13.4" y="3.4" width="7.2" height="7.2" rx="1.6" fill="#a4553f" opacity=".8"/><rect x="3.4" y="13.4" width="7.2" height="7.2" rx="1.6" fill="#276148" opacity=".55"/><rect x="13.4" y="13.4" width="7.2" height="7.2" rx="1.6" fill="none" stroke="#276148" stroke-width="1.9"/></svg>'
  }
};
