/* 学习进度模块（v4）。
 * 职责：localStorage 持久化、有效学习时长计时、XP / Level / streak / 成就、
 *       个人资料（昵称 / 头像 / 头像框）、学习档案导入导出与 schema 迁移。
 * 设计：纯逻辑层 Logic 不依赖 DOM 与 localStorage，可在 Node 中直接测试
 *       （tests/progress.test.cjs、tests/profile.test.cjs）；
 *       浏览器适配层只负责事件绑定、定时、真实存储读写与头像图片编码。
 *       app.js 不直接触碰 localStorage。
 * 边界：仅在 http/https（含 localhost）模式写存储；file:// 模式课程照常可读，进度不保存。
 *       不存储 token、cookie、密码、GitHub / TOP 登录信息或任何敏感数据；导入按字段白名单重建。
 *       不读取系统用户名、GitHub 用户名或浏览器账号信息；昵称由使用者自己填。 */
(() => {
  'use strict';

  /* v4.2：叶片规则与纯逻辑放在独立的 economy.js（先于本文件加载）。
   * 这里只拿引用、在状态变更点调用；缺失时自动降级为不发叶片，
   * 课程阅读与进度记录不受影响。 */
  const economy = (typeof window !== 'undefined' && window.ODIN_ECONOMY) || null;
  /* v4.2：每日 / 每周统计的纯逻辑在 daily.js（同样先于本文件加载）。 */
  const dailyModule = (typeof window !== 'undefined' && window.ODIN_DAILY) || null;
  /* v4.2：学习历史的记录与分组在 history.js（同样先于本文件加载）。 */
  const historyModule = (typeof window !== 'undefined' && window.ODIN_HISTORY) || null;
  /* v4.3（交接 D1/D2）：循环成就（铜/银/金）与挑战卡的纯逻辑分别在
   * tiers.js / challenges.js（同样先于本文件加载）；缺失时对应功能降级，
   * 一次性成就与课程进度不受影响。 */
  const tiersModule = (typeof window !== 'undefined' && window.ODIN_TIERS) || null;
  const challengesModule = (typeof window !== 'undefined' && window.ODIN_CHALLENGES) || null;
  /* v4.5（交接 D）：人形装扮部件目录在 companion-wardrobe.js（同样先于本文件
   * 加载）；持久化 companionLook 时用它的 sanitizeDress 做部件 id 白名单校验，
   * 缺失时降级为只存原样、渲染端再兜底，不影响课程与进度。 */
  const wardrobeModule = (typeof window !== 'undefined' && window.ODIN_COMPANION_WARDROBE) || null;
  /* 第二轮（发布前查漏补缺）：按角色解析「默认名」需要读登记表——品牌默认名
   * 只属于默认角色（v4.8 起为 nono → 「小诺」；历史上是 sprout → 「芽芽」），
   * 其余角色未命名时回落各自登记名（艾拉/米娅/少年…），不再一律回落全局默认名。
   * v4.8 起还从登记表读 retiredIds（退役角色回落默认名）。companion-registry.js
   * 先于本文件加载；缺失时降级为全局默认名（旧口径），进度与课程不受影响。 */
  const companionRegistry = (typeof window !== 'undefined' && window.ODIN_COMPANION_REGISTRY) || null;

  /* 存储 key 里的 v1 是**命名空间版本**，不是 schema 版本，刻意保持不变：
   * schema 的演进由档案内部的 schemaVersion 字段负责，见 SUPPORTED_SCHEMA_VERSIONS。
   * 这样既满足“导出新格式应明确版本”，又满足“绝不能通过升级把现有数据清空”。
   * 发布准备轮：命名空间从私有开发仓名 odin-foundations-zh 改为公开仓名
   * the-odin-project-zh。改 key 绝不能让老用户浏览器里的真实学习数据变成
   * 孤儿——因此启动读档路径带兼容迁移：
   *   1. 优先读新 key；2. 新 key 无值时回落旧 key；3. 旧 key 有档案且通过
   *   既有宽容校验后，把**原文**搬运写入新 key；4. 旧 key 一律保留不删除
   *   （回滚兼容）；5. 此后所有保存只写新 key；6. 导入导出不校验 app 字段，
   *   旧版导出文件天然可导入（见 sanitizeState 白名单）。 */
  const STORAGE_KEY = 'the-odin-project-zh.progress.v1';
  /* 改名前的历史 key：只做只读回落与一次性搬运，绝不回写、绝不删除 */
  const LEGACY_STORAGE_KEY = 'odin-foundations-zh.progress.v1';

  /* ---------- 本地备份命名空间（v4.2 交接 §16；发布准备轮改名迁移） ----------
   * 备份清单同步切换到新命名空间；改名前的旧备份 key 做只读回落：新 key 为
   * 空时仍能读到旧清单，下一次 createBackup 会把读到的整份清单（含旧条目）
   * 写入新 key，旧条目自然搬运。旧 key 不删除。
   * 声明位置红线：必须在启动读档块**之前**——读取旧 schema 档案时读档块内
   * 会调用 createBackup 做「迁移前快照」，而此前这些常量声明在读档块之后，
   * 快照调用因 TDZ 抛 ReferenceError 并被“快照失败不阻止正常加载”的
   * try/catch 静默吞掉，等于迁移前快照安全网从未生效。发布准备轮的迁移
   * 测试（storage-migration.test.cjs 场景 9）暴露了它，此处修复。 */
  const BACKUP_KEY = 'the-odin-project-zh.backups.v1';
  const LEGACY_BACKUP_KEY = 'odin-foundations-zh.backups.v1';
  const BACKUP_KEEP = 5;
  const SCHEMA_VERSION = 4;
  /* 1 = v3 档案（无 profile / reviewEverMarked），读取时自动迁移；
   * 2 = v4 档案（无叶片字段），读取时自动迁移；
   * 3 = v4.2 档案（新增 coins / coinMinuteAwarded / coinFlags）；
   * 4 = v4.3 档案（新增 achievementTiers 循环成就阶级 / reviews 复习调度 /
   *   bosses 章节挑战纪录）。每一版都是纯增量迁移，旧数据一个不丢。
   * 旧版站点读到不认识的版本会明确拒绝，而不是静默丢掉新字段。 */
  const SUPPORTED_SCHEMA_VERSIONS = [1, 2, 3, SCHEMA_VERSION];
  const IDLE_LIMIT_SECONDS = 120;          // 约 2 分钟无活动即暂停计时
  const TICK_MS = 1000;                    // 计时心跳
  const SAVE_INTERVAL_MS = 15000;          // 约 15 秒批量保存一次，不每秒写存储
  const XP_PER_ACTIVE_MINUTE = 1;
  const XP_FIRST_LESSON_COMPLETE = 40;
  const XP_FIRST_OFFICIAL_COMPLETE = 20;
  const XP_FIRST_QUIZ_COMPLETE = 10;
  /* v4.5（交接 Core F）：首次有效读到本课结尾的一次性奖励。
   * 红线：滚到 100% ≠ 完成课程——该奖励不勾选任何完成状态、不触发官方
   * 任务/自测、不改变地图 defeated/mastered 语义。门槛「本次会话有效阅读
   * ≥60 秒」由 UI 侧会话计数器提供（防 End 键秒到底白拿），持久防刷闩锁
   * 是 rewardFlags['read:<lessonId>']（XP）+ coinFlags['coin:read:<id>']（叶片），
   * 与课程完成奖励同一套「一次性闩锁、分开记账」模式。 */
  const READ_COMPLETE_XP = 10;
  const READ_COMPLETE_MIN_SECONDS = 60;
  /* v4.5（交接 Core E1）：非线性等级曲线。
   * XP_PER_LEVEL = 100 保留两个语义：① Lv.9 起线性延续的每级步长；
   * ② 旧曲线（v4.4 及以前）的每级步长——旧 Lv.N 门槛 = 100×(N−1)。
   * LEVEL_CURVE[i] = 到达 Lv.(i+1) 所需累计 XP（Lv.1–Lv.10）。
   * 前 7 级取交接建议表值（40/100/180/280/400/550）：完成第一课（+40 XP）
   * 即可升 Lv.2，前期奖励节奏快。
   * 交接建议的 Lv.8–10（730/940/1180）高于旧线性曲线门槛（700/800/900），
   * 会让存量高 XP 用户降级，违反 E2「已有用户不得降级」硬约束；按交接
   * 「建议起点可根据真实数据微调」的授权，Lv.8–10 收敛为 700/800/900，
   * 自 Lv.9 起回到线性（100/级）。由此保证：任意 XP 下新曲线等级 ≥ 旧
   * 曲线等级（存量用户永不降级），且 XP < 700 时新曲线比旧曲线更宽松。
   * 代价：每级增量从 40 爬升到 150（Lv.7→8）后稳定在 100——「后期增量
   * 持续增长」与「不降级」在数学上不可兼得（旧曲线恒为 100/级，任何
   * 持续 >100 的增量迟早高于旧门槛），不降级是硬要求、优先。取舍已
   * 如实记录在 answers/ 执行日志与最终结果包。 */
  const XP_PER_LEVEL = 100;
  const LEVEL_CURVE = [0, 40, 100, 180, 280, 400, 550, 700, 800, 900];
  const CURVE_LINEAR_XP = 800;             // Lv.9（含）起的线性区起点 = XP_PER_LEVEL × (9−1)
  const STREAK_MIN_DAY_SECONDS = 600;      // 一个自然日至少 10 分钟有效学习才算学习一天
  /* v4.3 Batch 10（Stretch N5）：预检高评价线，与 bosses.js 的 HIGH_PCT 同值
   * （tests/map-boss.test.cjs 钉住两边一致，防漂移）。隐藏成就「未战先达」
   * 用它数“预检就拿到高评价的单元数”。 */
  const PRECHECK_HIGH_PCT = 70;
  const SENSITIVE_KEYS = ['token', 'password', 'cookie', 'secret', 'session', 'auth', 'credential', 'apikey', 'api_key'];

  /* ---------- 个人资料（v4 新增） ---------- */
  const DEFAULT_NICKNAME = '学习者';
  const NICKNAME_MAX_LENGTH = 24;
  /* 头像 id 只做格式校验，具体有哪些头像由 avatars.js（几何清单）与
   * companion-<stableId> 命名空间（companion-view 渲染期派生）决定；
   * 找不到时 UI 回退默认头像。id 清单只有一处事实源，不各自维护列表。 */
  const AVATAR_ID_PATTERN = /^[a-z][a-z0-9-]{0,31}$/;
  /* v4.8：产品默认头像改为默认学习伙伴小诺的 companion 命名空间头像
   * （companion-view 渲染期解析成 nono 的正式 icon），新用户首屏即见品牌角色；
   * 'terminal' 仍是 avatars.js 几何清单内部的回落默认（resolveAvatar 第二级）。 */
  const DEFAULT_AVATAR_ID = 'companion-nono';
  /* §2.3：持久化后的头像 Data URL 控制在约 200 KB 以内。
   * base64 每 3 字节变 4 字符，200KB 约 273068 字符，留出前缀与余量取 280000。 */
  const AVATAR_DATA_MAX_LENGTH = 280000;
  const AVATAR_DATA_PATTERN = /^data:image\/(?:webp|png);base64,[A-Za-z0-9+/]+={0,2}$/;
  const AVATAR_MAX_EDGE = 256;             // 建议缩放 / 裁切为约 256×256
  const AVATAR_INPUT_MAX_BYTES = 12 * 1024 * 1024;
  /* 刻意不接受 image/svg+xml：SVG 可以携带脚本，虽然放进 <img> 不会执行，
   * 但一旦将来被别的代码以别的方式使用就有风险，直接在入口拒绝更稳妥。 */
  const AVATAR_INPUT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
  const DEFAULT_FRAME_ID = 'frame-basic';
  /* v4.2：形象与页面主题的默认 id。具体清单在 companions.js / themes.js
   * （UI 数据文件），Logic 层只做格式校验；找不到时 UI 回退默认，与头像同思路。
   * v4.8：默认形象取登记表 defaultCompanionId（nono）作单一事实源；登记表
   * 缺失时回落历史值 'sprout'（降级路径，正常两页 registry 都先于本文件加载）。 */
  const ASSET_ID_PATTERN = /^[a-z][a-z0-9-]{0,31}$/;
  const DEFAULT_COMPANION_ID = (companionRegistry && companionRegistry.defaultCompanionId) || 'sprout';
  /* v4.11 批次 F（B1）：默认主题「园地」→「夜空」，与 themes.js 的
   * defaultThemeId 逐字一致（collections.test 断言两处相等，项目不允许出现
   * 第二套默认值字面量）。作用范围只有**新档案**（emptyCosmetics）与
   * **缺失 / 非法主题的回落**（sanitize）；已存档案里合法的 themeId——包括
   * 老用户的 garden——一律原样保留，不迁移、不覆盖、不改 storage key /
   * schemaVersion。 */
  const DEFAULT_THEME_ID = 'night';

  /* ---------- v4.9：退役默认值的读取层归一化 ----------
   * v4.8 把产品默认形象 / 头像 / 默认名换成了小诺，但只改了默认值：老档案里
   * 登记表（companion-registry.js）的 retiredAvatarIds / legacyCompanionNames
   * 是这两类值的**唯一**事实源（与 retiredIds 同一处声明，本文件不另抄字面量）；
   * 登记表缺失时回落空数组——降级路径下行为与 v4.8 一致，不抛错。
   * 归一化只作用于内存 state，绝不写回 localStorage、不改 schemaVersion。 */
  const retiredDefaults = key => {
    const list = companionRegistry && companionRegistry[key];
    return Array.isArray(list) ? list : [];
  };
  const RETIRED_AVATAR_IDS = retiredDefaults('retiredAvatarIds');
  const LEGACY_COMPANION_NAMES = retiredDefaults('legacyCompanionNames');

  /* ---------- v4.5（交接 C1/C2）：学习伙伴的昵称与显示模式 ----------
   * 去 Odin 化：系统称谓统一为「学习伙伴」，默认伙伴名「小诺」（v4.8 起默认
   * 角色为 nono；历史默认名「芽芽」随 sprout 退役，只留在历史文档里），
   * 可由用户自定义。内部仍用 ODIN_COMPANION_* 命名与 companionId
   * （nono / sprout / odin-boy / …）——交接 C1 明确「本轮可以保留以避免无价值
   * 大迁移」，UI 改名不碰任何旧 id / 旧数据。
   *
   * 这两个字段是 schema 4 内的**可选增量字段**（与 settings 里其它字段同一
   * 「旧档案缺省按默认值补齐」模式）：老档案导入时 companionName 缺失 → 默认
   * 小诺、companionDisplay 缺失 → 默认 auto，一个旧字段都不丢、不重算，因此
   * 不需要升 SCHEMA_VERSION（与 v4.4「不为版本感强升」同一取舍）。 */
  const DEFAULT_COMPANION_NAME = '小诺';
  const COMPANION_NAME_MAX_LENGTH = 12;   /* 交接 C1：建议 1–12 个字符 */
  const COMPANION_DISPLAY_MODES = ['auto', 'always', 'minimal'];
  const DEFAULT_COMPANION_DISPLAY = 'auto';

  /* 成就表（v4.2 扩充到 52 个，交接 §7）。
   * v4 已有的 35 个 id 全部原样保留，已解锁状态与解锁时间不受影响；
   * 新增成就会在下一次 evaluateAchievements 时按现有历史状态补发解锁
   * （成就不带 XP，补发不会补发出经验值）。
   * 每条带一个声明式 goal，evaluateAchievements 只做表驱动判定；同一份 goal
   * 也用于 UI 的进度条与学习助手的“距下一个成就还差多少”，避免三处各写一遍条件。
   * goal.kind：
   *   seconds      累计有效学习秒数达到 value
   *   streak       连续学习天数达到 value
   *   completed    已完成课程数达到 value
   *   completedAll 完成当前收录的全部课程
   *   official     标记官方任务已完成的课程数达到 value
   *   officialAll  当前收录课程全部标记官方任务已完成
   *   quiz         标记本站自测已完成的课程数达到 value
   *   quizAll      当前收录课程全部标记本站自测已完成
   *   unit         指定单元（lessons.js 的 group 下标）内课程全部完成
   *   firstLesson  完成课程列表中的第一课
   *   started      打开过任意一课
   *   startedCount 打开过的课程数达到 value
   *   reviewEver   曾经标记过“需要复习”
   *   reviewCleared 曾经标记过“需要复习”，且当前复习项已全部清零
   *   daySeconds   单日有效学习秒数的最高纪录达到 value
   *   level        等级达到 value
   *   purchases    叶片解锁的收藏品件数达到 value
   * hidden 为 true 的成就在 UI 上只显示“隐藏成就”，不公开名称与条件（§7 限 4–6 个）。
   * milestone 为 true 的成就在 UI 上用独立 SVG 图标（§7.1 重要里程碑）。 */
  const ACHIEVEMENTS = [
    /* A. 学习时长（15m → 100h） */
    { id: 'active-15m', zh: '有效学习 15 分钟', desc: '累计有效学习时长达到 15 分钟', category: 'time', goal: { kind: 'seconds', value: 15 * 60 } },
    { id: 'active-30m', zh: '有效学习 30 分钟', desc: '累计有效学习时长达到 30 分钟', category: 'time', goal: { kind: 'seconds', value: 30 * 60 } },
    { id: 'active-1h', zh: '有效学习 1 小时', desc: '累计有效学习时长达到 1 小时', category: 'time', goal: { kind: 'seconds', value: 60 * 60 } },
    { id: 'active-2h', zh: '有效学习 2 小时', desc: '累计有效学习时长达到 2 小时', category: 'time', goal: { kind: 'seconds', value: 2 * 60 * 60 } },
    { id: 'active-5h', zh: '有效学习 5 小时', desc: '累计有效学习时长达到 5 小时', category: 'time', goal: { kind: 'seconds', value: 5 * 60 * 60 } },
    { id: 'active-10h', zh: '有效学习 10 小时', desc: '累计有效学习时长达到 10 小时', category: 'time', goal: { kind: 'seconds', value: 10 * 60 * 60 } },
    { id: 'active-20h', zh: '有效学习 20 小时', desc: '累计有效学习时长达到 20 小时', category: 'time', goal: { kind: 'seconds', value: 20 * 60 * 60 } },
    { id: 'active-30h', zh: '有效学习 30 小时', desc: '累计有效学习时长达到 30 小时', category: 'time', goal: { kind: 'seconds', value: 30 * 60 * 60 } },
    { id: 'active-50h', zh: '有效学习 50 小时', desc: '累计有效学习时长达到 50 小时', category: 'time', goal: { kind: 'seconds', value: 50 * 60 * 60 }, hidden: true },
    { id: 'active-100h', zh: '百小时俱乐部', desc: '累计有效学习时长达到 100 小时', category: 'time', goal: { kind: 'seconds', value: 100 * 60 * 60 }, hidden: true, milestone: true },

    /* B. 连续学习（2 → 100 天） */
    { id: 'streak-2', zh: '连续学习 2 天', desc: '连续 2 天每天有效学习至少 10 分钟', category: 'streak', goal: { kind: 'streak', value: 2 } },
    { id: 'streak-3', zh: '连续学习 3 天', desc: '连续 3 天每天有效学习至少 10 分钟', category: 'streak', goal: { kind: 'streak', value: 3 } },
    { id: 'streak-5', zh: '连续学习 5 天', desc: '连续 5 天每天有效学习至少 10 分钟', category: 'streak', goal: { kind: 'streak', value: 5 } },
    { id: 'streak-7', zh: '连续学习 7 天', desc: '连续 7 天每天有效学习至少 10 分钟', category: 'streak', goal: { kind: 'streak', value: 7 } },
    { id: 'streak-14', zh: '连续学习 14 天', desc: '连续 14 天每天有效学习至少 10 分钟', category: 'streak', goal: { kind: 'streak', value: 14 } },
    { id: 'streak-21', zh: '连续学习 21 天', desc: '连续 21 天每天有效学习至少 10 分钟', category: 'streak', goal: { kind: 'streak', value: 21 } },
    { id: 'streak-30', zh: '连续学习 30 天', desc: '连续 30 天每天有效学习至少 10 分钟', category: 'streak', goal: { kind: 'streak', value: 30 } },
    { id: 'streak-60', zh: '连续学习 60 天', desc: '连续 60 天每天有效学习至少 10 分钟', category: 'streak', goal: { kind: 'streak', value: 60 }, milestone: true },
    { id: 'streak-100', zh: '百日不辍', desc: '连续 100 天每天有效学习至少 10 分钟', category: 'streak', goal: { kind: 'streak', value: 100 }, hidden: true },

    /* C. 课程完成数 */
    { id: 'first-lesson', zh: '完成第一课', desc: '完成本站收录的第一课', category: 'lesson', goal: { kind: 'firstLesson' } },
    { id: 'lessons-3', zh: '完成 3 课', desc: '累计完成 3 课', category: 'lesson', goal: { kind: 'completed', value: 3 } },
    { id: 'lessons-5', zh: '完成 5 课', desc: '累计完成 5 课', category: 'lesson', goal: { kind: 'completed', value: 5 } },
    { id: 'lessons-10', zh: '完成 10 课', desc: '累计完成 10 课', category: 'lesson', goal: { kind: 'completed', value: 10 } },
    { id: 'lessons-15', zh: '完成 15 课', desc: '累计完成 15 课', category: 'lesson', goal: { kind: 'completed', value: 15 } },
    { id: 'all-lessons', zh: '完成当前全部课程', desc: '完成本站当前收录的全部课程（Recipes 之前 19 课）', category: 'lesson', goal: { kind: 'completedAll' }, milestone: true },
    /* C2. 大课体量（v4.11.3 交接 C3）：既有 61 个成就全部按数量维度（完成数 /
     * 时长 / 连续天数），没有任何一个考察「单课体量」——最重的课
     * （links-and-images，22 章 5151 字）与最轻的课（866 字 5 章）在完成
     * 反馈上毫无区别。补两个只看「体量较大的课」的成就；XP 与等级曲线
     * 零改动（用户已明确选择不改数值），成就不带 XP，补发不会补发经验值。
     * 体量判定见 isHeavyLesson（由真实数据算出，不硬编码课 id）。 */
    { id: 'heavy-first', zh: '啃下一门大课', desc: '完成一门内容体量明显更大的课程（章节或官方自查题数量显著高于其余课程）', category: 'lesson', goal: { kind: 'completedHeavy', value: 1 } },
    { id: 'heavy-all', zh: '大课全数拿下', desc: '把本站体量最大的几门课（当前 4 门）全部完成', category: 'lesson', goal: { kind: 'completedHeavy' } },

    /* D. 官方任务 */
    { id: 'official-first', zh: '首次完成官方任务', desc: '第一次把任意一课标记为官方任务已完成', category: 'official', goal: { kind: 'official', value: 1 } },
    { id: 'official-3', zh: '完成 3 课官方任务', desc: '累计 3 课标记为官方任务已完成', category: 'official', goal: { kind: 'official', value: 3 } },
    { id: 'official-5', zh: '完成 5 课官方任务', desc: '累计 5 课标记为官方任务已完成', category: 'official', goal: { kind: 'official', value: 5 } },
    { id: 'official-10', zh: '完成 10 课官方任务', desc: '累计 10 课标记为官方任务已完成', category: 'official', goal: { kind: 'official', value: 10 } },
    { id: 'official-all', zh: '完成当前开放课程的官方任务', desc: '当前收录的 19 课全部标记为官方任务已完成', category: 'official', goal: { kind: 'officialAll' }, milestone: true },

    /* E. 本站自测 */
    { id: 'quiz-first', zh: '首次完成本站自测', desc: '第一次把任意一课标记为本站自测已完成', category: 'quiz', goal: { kind: 'quiz', value: 1 } },
    { id: 'quiz-3', zh: '完成 3 课本站自测', desc: '累计 3 课标记为本站自测已完成', category: 'quiz', goal: { kind: 'quiz', value: 3 } },
    { id: 'quiz-5', zh: '完成 5 课本站自测', desc: '累计 5 课标记为本站自测已完成', category: 'quiz', goal: { kind: 'quiz', value: 5 } },
    { id: 'quiz-10', zh: '完成 10 课本站自测', desc: '累计 10 课标记为本站自测已完成', category: 'quiz', goal: { kind: 'quiz', value: 10 } },
    { id: 'quiz-all', zh: '完成当前开放课程的本站自测', desc: '当前收录的 19 课全部标记为本站自测已完成', category: 'quiz', goal: { kind: 'quizAll' } },

    /* F. 单元。unit-3 的文案按交接 §4.1 F 修正：本站只覆盖 Recipes 之前的
     * HTML Foundations（官方该单元共 8 课，本站开放 7 课，缺 Project: Recipes），
     * 因此不能写成“完成 HTML Foundations 单元”。id 保持兼容，已解锁状态不受影响。 */
    { id: 'unit-0', zh: '完成 Introduction 单元', desc: '完成 Introduction 单元全部课程', category: 'unit', goal: { kind: 'unit', value: 0 } },
    { id: 'unit-1', zh: '完成 Prerequisites 单元', desc: '完成 Prerequisites 单元全部课程', category: 'unit', goal: { kind: 'unit', value: 1 } },
    { id: 'unit-2', zh: '完成 Git Basics 单元', desc: '完成 Git Basics 单元全部课程', category: 'unit', goal: { kind: 'unit', value: 2 } },
    { id: 'unit-3', zh: '完成 HTML Foundations 已开放课程', desc: '完成当前 HTML Foundations 已开放的 7 课（不含 Project: Recipes）', category: 'unit', goal: { kind: 'unit', value: 3 } },

    /* G. 复习与使用 */
    { id: 'first-start', zh: '迈出第一步', desc: '第一次开始学习任意一课', category: 'usage', goal: { kind: 'started' } },
    /* v4.3（交接 C1）：第一次进入第一课就解锁的早期成就——10 分钟内可达成，
     * 同时解锁「起步框」，让新用户立刻拿到一件可装备的外观奖励。 */
    { id: 'first-steps', zh: '推开学习之门', desc: '第一次进入本站第一课', category: 'usage', goal: { kind: 'firstLessonVisit' } },
    { id: 'review-first', zh: '第一次标记需要复习', desc: '第一次把任意一课标记为需要复习', category: 'usage', goal: { kind: 'reviewEver' } },
    { id: 'review-cleared', zh: '复习清零', desc: '曾经标记过需要复习，之后把所有复习项都清空', category: 'usage', goal: { kind: 'reviewCleared' }, hidden: true },

    /* H. 单日学习（v4.2 新增，交接 §7 单日组） */
    { id: 'day-30m', zh: '单日学习 30 分钟', desc: '单日有效学习时长达到 30 分钟', category: 'day', goal: { kind: 'daySeconds', value: 30 * 60 } },
    { id: 'day-1h', zh: '单日学习 1 小时', desc: '单日有效学习时长达到 1 小时', category: 'day', goal: { kind: 'daySeconds', value: 60 * 60 }, milestone: true },
    { id: 'day-2h', zh: '单日沉浸 2 小时', desc: '单日有效学习时长达到 2 小时', category: 'day', goal: { kind: 'daySeconds', value: 2 * 60 * 60 }, hidden: true },
    /* H2. 连续达成每日目标（v4.2 交接 §7 单日组 + §8.1；分母是用户自选的每日目标） */
    { id: 'goal-streak-3', zh: '连续 3 天达成每日目标', desc: '连续 3 天每天都学满你自己设定的每日目标', category: 'day', goal: { kind: 'dailyGoalDays', value: 3 } },
    { id: 'goal-streak-7', zh: '连续 7 天达成每日目标', desc: '连续 7 天每天都学满你自己设定的每日目标', category: 'day', goal: { kind: 'dailyGoalDays', value: 7 } },
    { id: 'goal-streak-14', zh: '连续 14 天达成每日目标', desc: '连续 14 天每天都学满你自己设定的每日目标', category: 'day', goal: { kind: 'dailyGoalDays', value: 14 } },

    /* I. 等级（v4.2 新增） */
    { id: 'level-5', zh: '达到 Lv.5', desc: '学习经验累计达到等级 5', category: 'level', goal: { kind: 'level', value: 5 } },
    { id: 'level-10', zh: '达到 Lv.10', desc: '学习经验累计达到等级 10', category: 'level', goal: { kind: 'level', value: 10 } },
    { id: 'level-20', zh: '达到 Lv.20', desc: '学习经验累计达到等级 20', category: 'level', goal: { kind: 'level', value: 20 } },

    /* J. 装扮收藏（v4.2 新增；v4.3 B1 改名） */
    { id: 'purchase-first', zh: '第一件收藏', desc: '第一次用叶片解锁收藏品', category: 'collection', goal: { kind: 'purchases', value: 1 } },
    { id: 'purchase-5', zh: '收藏 5 件', desc: '累计用叶片解锁 5 件收藏品', category: 'collection', goal: { kind: 'purchases', value: 5 } },
    { id: 'purchase-10', zh: '收藏 10 件', desc: '累计用叶片解锁 10 件收藏品', category: 'collection', goal: { kind: 'purchases', value: 10 } },

    /* K. 学习广度（v4.2 新增） */
    { id: 'started-10', zh: '读过 10 课', desc: '打开过 10 节课程页面', category: 'exploration', goal: { kind: 'startedCount', value: 10 } },
    { id: 'started-all', zh: '全部课程都看过', desc: '打开过当前收录的全部 19 课', category: 'exploration', goal: { kind: 'startedCount', value: 19 } },

    /* L. 章节挑战（v4.3 新增，交接 E3）。高分只代表“已有相关背景知识 /
     * 当前题目掌握良好”，成就文案不宣称“无需学习整章”。 */
    { id: 'boss-first', zh: '首破章节 Boss', desc: '第一次通过任意单元的 Boss 挑战（得分 50% 及以上）', category: 'boss', goal: { kind: 'bossPass', value: 1 } },
    { id: 'boss-precheck-high', zh: '未战先知', desc: '还没学这个单元就先做预检，得分达到 70% 及以上——你是带着相关经验来的', category: 'boss', goal: { kind: 'bossPrecheckHigh', value: 70 } },
    /* v4.3 Batch 10（Stretch N5）：隐藏成就扩充——两个都从既有数据推导
     * （bosses.precheckBestPct / 复习精通口径），不加任何新字段。
     * 隐藏成就解锁前不公开名称与条件（UI 只显示上锁图标）。 */
    { id: 'precheck-master', zh: '未战先达', desc: '有 2 个单元在学习前预检就拿到 70% 及以上', category: 'boss', goal: { kind: 'precheckUnits', value: 2 }, hidden: true },
    { id: 'mastered-3', zh: '精通的滋味', desc: '让 3 课走完 1/3/7/30 复习阶梯进入「已精通」状态', category: 'usage', goal: { kind: 'masteredCount', value: 3 }, hidden: true }
  ];

  const ACHIEVEMENT_CATEGORIES = [
    { id: 'time', zh: '学习时长' },
    { id: 'streak', zh: '连续学习' },
    { id: 'lesson', zh: '课程完成' },
    { id: 'official', zh: '官方任务' },
    { id: 'quiz', zh: '本站自测' },
    { id: 'unit', zh: '单元' },
    { id: 'usage', zh: '复习与使用' },
    { id: 'day', zh: '单日学习' },
    { id: 'level', zh: '等级' },
    { id: 'collection', zh: '装扮收藏' },
    { id: 'exploration', zh: '学习广度' },
    { id: 'boss', zh: '章节挑战' }
  ];

  /* 头像框（v4 新增，交接 §5；v4.3 Batch 6 扩充到 26 个）。四类来源：
   * 默认（Lv.1）、等级、成就与叶片解锁（价格三档 20–40 / 60–100 / 120–200，
   * 交接 J：高价只留给明显更特殊的收藏款）。
   * 头像框本身不提供 XP，也不构成成就，避免出现“为了拿框而刷分”的递归奖励体系。
   * 视觉全部用 CSS 实现（见 style.css 的同名 class），不引外部图片。 */
  const FRAMES = [
    { id: 'frame-basic', zh: '基础框', desc: '默认头像框，随时可用', unlock: { kind: 'level', value: 1 }, css: 'frame-basic' },
    /* v4.3（交接 B2：默认头像框至少 4 个）：新增 3 个零门槛默认框。
     * 基础内容先给足选择，等级 / 成就 / 叶片解锁的款仍然保留原解锁方式，
     * 不做任何“原本免费 → 叶片解锁”的倒退。 */
    { id: 'frame-slim', zh: '细线框', desc: '默认头像框，随时可用', unlock: { kind: 'level', value: 1 }, css: 'frame-slim' },
    { id: 'frame-dotted', zh: '点线框', desc: '默认头像框，随时可用', unlock: { kind: 'level', value: 1 }, css: 'frame-dotted' },
    { id: 'frame-moss', zh: '苔痕框', desc: '默认头像框，随时可用', unlock: { kind: 'level', value: 1 }, css: 'frame-moss' },
    /* v4.5（交接 Core E2）：前 5 级每级都有可见奖励——Lv.2 新芽框、Lv.4 陶土框
     * 为新增（Lv.3 蓝色双环 / Lv.5 叶脉进阶框已有）。只增新 id，旧框零改动。 */
    { id: 'frame-sprout', zh: '新芽框', desc: '等级达到 Lv.2 解锁', unlock: { kind: 'level', value: 2 }, css: 'frame-sprout' },
    { id: 'frame-ring', zh: '蓝色双环', desc: '等级达到 Lv.3 解锁', unlock: { kind: 'level', value: 3 }, css: 'frame-ring' },
    { id: 'frame-terra', zh: '陶土框', desc: '等级达到 Lv.4 解锁', unlock: { kind: 'level', value: 4 }, css: 'frame-terra' },
    { id: 'frame-leaf', zh: '叶脉进阶框', desc: '等级达到 Lv.5 解锁', unlock: { kind: 'level', value: 5 }, css: 'frame-leaf' },
    { id: 'frame-wave', zh: '波纹高级框', desc: '等级达到 Lv.8 解锁', unlock: { kind: 'level', value: 8 }, css: 'frame-wave' },
    { id: 'frame-gold', zh: '金色高阶框', desc: '等级达到 Lv.10 解锁', unlock: { kind: 'level', value: 10 }, css: 'frame-gold' },
    /* v4.3 Batch 6（交接 H）：高等级纪念框，给长线学习者一个可见的下一站 */
    { id: 'frame-dawn', zh: '晨光框', desc: '等级达到 Lv.15 解锁', unlock: { kind: 'level', value: 15 }, css: 'frame-dawn' },
    { id: 'frame-start', zh: '起步框', desc: '完成 Introduction 单元全部课程', unlock: { kind: 'achievement', value: 'unit-0' }, css: 'frame-start' },
    /* v4.3（交接 C1）：第一次进入第一课就解锁的轻量外观奖励——新用户
     * 10 分钟内就能拿到并装备，形成“学习 → 成就 → 奖励 → 换装扮”闭环。 */
    { id: 'frame-firststep', zh: '启程框', desc: '第一次进入本站第一课即解锁', unlock: { kind: 'achievement', value: 'first-steps' }, css: 'frame-firststep' },
    { id: 'frame-git', zh: 'Git 分支节点框', desc: '完成 Git Basics 单元全部课程', unlock: { kind: 'achievement', value: 'unit-2' }, css: 'frame-git' },
    { id: 'frame-streak', zh: '连续学习框', desc: '连续学习 7 天', unlock: { kind: 'achievement', value: 'streak-7' }, css: 'frame-streak' },
    { id: 'frame-time', zh: '时间框', desc: '累计有效学习 10 小时', unlock: { kind: 'achievement', value: 'active-10h' }, css: 'frame-time' },
    { id: 'frame-quiz', zh: '自测框', desc: '完成当前开放全部课程的本站自测', unlock: { kind: 'achievement', value: 'quiz-all' }, css: 'frame-quiz' },
    { id: 'frame-task', zh: '任务框', desc: '完成当前开放全部课程的官方任务', unlock: { kind: 'achievement', value: 'official-all' }, css: 'frame-task' },
    { id: 'frame-graduate', zh: '当前阶段毕业框', desc: '完成当前开放的全部 19 课', unlock: { kind: 'achievement', value: 'all-lessons' }, css: 'frame-graduate' },
    /* v4.3 Batch 6（交接 H/E3）：Boss 挑战的纪念框——首破任意单元 Boss 即解锁 */
    { id: 'frame-boss', zh: '破甲框', desc: '第一次通过任意单元的 Boss 挑战', unlock: { kind: 'achievement', value: 'boss-first' }, css: 'frame-boss' },
    /* v4.2 叶片解锁框（交接 §4、§5）：解锁方式是花叶片解锁后永久拥有。
     * 与等级/成就框一样不提供 XP、不构成成就，避免“为拿框刷分”的循环；
     * 花的是学习换来的叶片，也不是充值。 */
    { id: 'frame-candy', zh: '蜜糖框', desc: '90 叶片解锁', unlock: { kind: 'coins', value: 90 }, css: 'frame-candy' },
    { id: 'frame-mint', zh: '薄荷框', desc: '100 叶片解锁', unlock: { kind: 'coins', value: 100 }, css: 'frame-mint' },
    { id: 'frame-jade', zh: '墨玉框', desc: '160 叶片解锁', unlock: { kind: 'coins', value: 160 }, css: 'frame-jade' },
    { id: 'frame-dusk', zh: '暮色框', desc: '140 叶片解锁', unlock: { kind: 'coins', value: 140 }, css: 'frame-dusk' },
    { id: 'frame-starlight', zh: '星轨框', desc: '180 叶片解锁', unlock: { kind: 'coins', value: 180 }, css: 'frame-starlight' },
    /* v4.3 Batch 6（交接 J）：高价档收口到 200 以内——高价只留给明显更特殊
     * 的收藏款，且不再超出 120–200 的高档位区间。 */
    { id: 'frame-aurora', zh: '极光框', desc: '200 叶片解锁', unlock: { kind: 'coins', value: 200 }, css: 'frame-aurora' },
    /* v4.3（交接 C1/J）：低档位（20–40 叶片）——完成第一课（+20）加上
     * 十几分钟学习（每 10 分钟 +5）就够解锁一件，让第一次使用者立刻
     * 体验“叶片 → 装扮”的选择感。 */
    { id: 'frame-vine', zh: '藤蔓框', desc: '30 叶片解锁', unlock: { kind: 'coins', value: 30 }, css: 'frame-vine' },
    /* v4.3 Batch 6（交接 J）：25 叶片低档位——完成第一课（+20）再学 10 分钟
     * （+5）就正好够，给新用户第二个“立刻买得起”的选择 */
    { id: 'frame-cocoa', zh: '可可框', desc: '25 叶片解锁', unlock: { kind: 'coins', value: 25 }, css: 'frame-cocoa' }
  ];

  /* ===================== 纯逻辑层（无 DOM / 无 localStorage） ===================== */

  const isPositiveNumber = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
  const isIsoText = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
  const isDayKey = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

  function emptyLessonEntry() {
    return {
      started: false, completed: false, needsReview: false,
      officialCompleted: false, quizCompleted: false,
      activeSeconds: 0, startedAt: null, lastVisitedAt: null, completedAt: null,
      /* v4.2：官方任务与自测也记录标记时间（与 completedAt 同一口径），
       * 供“今日完成数 / 本周完成数”按日期推导，不需要额外计数器。 */
      officialCompletedAt: null, quizCompletedAt: null
    };
  }

  function emptyProfile() {
    return {
      nickname: DEFAULT_NICKNAME,
      avatarId: DEFAULT_AVATAR_ID,
      avatarData: null,
      equippedFrameId: DEFAULT_FRAME_ID
    };
  }

  /* v4.2：外观收藏状态——叶片购买记录（闩锁）、装备的小奥形象、当前主题。
   * 解锁判定统一走 collections.js / isFrameUnlocked；这里只存事实。 */
  function emptyCosmetics() {
    return {
      purchases: {},
      companionId: DEFAULT_COMPANION_ID,
      themeId: DEFAULT_THEME_ID,
      /* v4.5（交接 D1）：人形装扮四槽（发型/服装/配饰/色板）；null = 未自定义，
       * 由 UI 按装备的人形体型给协调默认。只存部件 id，不存渲染结果。
       * 体型（少年/少女）不在这里——由装备的 odin-boy/odin-girl 形象决定。 */
      companionLook: null,
      /* v4.6：fixed-art 人形的预制皮肤按角色保存；键和值都只存稳定 id。
       * procedural wardrobe 仍只使用 companionLook，两种机制互不混用。 */
      companionSkins: {}
    };
  }

  /* v4.2：学习设置。每日目标是每日系统的分母；其余开关由设置中心（后续批次）
   * 逐个补充。旧档案没有 settings 时按默认值补齐，界面行为不变。 */
  const DAILY_GOAL_CHOICES = [10, 20, 30, 45, 60];
  const DEFAULT_DAILY_GOAL_MINUTES = 20;

  /* v4.2：界面开关（交接 §15）。全部默认开启；旧档案缺省时按默认值补齐。
   * 只有显式的 false 才算关闭，其余任何值（含 true / 缺省 / 非法值）都是开。 */
  const SETTING_BOOLEAN_KEYS = [
    'showCompanion', 'showAchievementNotes', 'showReadingPosition',
    'showUnavailableLessons', 'showEnglishTitles', 'shortcutsEnabled'
  ];

  function emptySettings() {
    return {
      dailyGoalMinutes: DEFAULT_DAILY_GOAL_MINUTES,
      /* v4.2：小奥按钮的拖动位置（左上角像素坐标）。null = 默认位置
       * （右下角，由 UI 按视口实时计算）。只有持久化模式下才会保存。 */
      companionPos: null,
      /* v4.5（交接 C1）：学习伙伴昵称，默认「小诺」，可自定义（1–12 字符） */
      companionName: DEFAULT_COMPANION_NAME,
      /* v4.6：按角色保存昵称；旧 companionName 保留用于兼容导出。 */
      companionNicknames: {},
      /* v4.5（交接 C2）：学习伙伴显示模式 auto / always / minimal，默认 auto */
      companionDisplay: DEFAULT_COMPANION_DISPLAY,
      /* v4.11.5（交接 3.A2）：课页「官方任务」节 Assignment / Knowledge Check
       * 列表是否默认收起。默认 false = 展开。**刻意不进 SETTING_BOOLEAN_KEYS**：
       * 那份白名单的语义是「每键默认必须 true、只有显式 false 才关」
       * （tests/settings.test.cjs 钉住），本字段方向相反（默认 false、只有显式
       * true 才折叠），读写走专用 API setOfficialTasksCollapsed。 */
      collapseOfficialTasks: false,
      showCompanion: true,
      showAchievementNotes: true,
      showReadingPosition: true,
      showUnavailableLessons: true,
      showEnglishTitles: true,
      shortcutsEnabled: true
    };
  }

  /* ---------- v4.2：小奥位置的纯逻辑（交接 §6.1、§22 Companion drag） ----------
   * 坐标是“距离视口左/上的像素”，clamp 保证任何输入（包括手改档案塞进的
   * 越界值、resize 后变小的视口）都落回视口内。 */
  const COMPANION_MARGIN = 12;

  function clampCompanionPosition(x, y, viewportWidth, viewportHeight, width, height, margin) {
    const m = Number.isFinite(margin) ? margin : COMPANION_MARGIN;
    const w = Math.max(0, Number(width) || 0);
    const h = Math.max(0, Number(height) || 0);
    const vw = Math.max(0, Number(viewportWidth) || 0);
    const vh = Math.max(0, Number(viewportHeight) || 0);
    /* 视口比元素还小时贴到左上角，避免永远不可见 */
    const maxX = Math.max(0, vw - w - m);
    const maxY = Math.max(0, vh - h - m);
    const clamp = (value, min, max) => Math.min(max, Math.max(min, Math.round(Number(value) || 0)));
    return { x: clamp(x, m, maxX), y: clamp(y, m, maxY) };
  }

  /* 默认位置：右下角（与小奥原本的固定位置一致）。 */
  function defaultCompanionPosition(viewportWidth, viewportHeight, width, height, margin) {
    const m = Number.isFinite(margin) ? margin : COMPANION_MARGIN;
    return clampCompanionPosition(
      Number(viewportWidth) - Number(width) - m,
      Number(viewportHeight) - Number(height) - m,
      viewportWidth, viewportHeight, width, height, m
    );
  }

  function emptyState() {
    return {
      schemaVersion: SCHEMA_VERSION,
      lessons: {},
      daily: {},
      totalActiveSeconds: 0,
      xp: 0,
      minuteXpAwarded: 0,
      rewardFlags: {},
      /* v4.5（交接 Core E2）：已祝贺过的最高等级（单向棘轮，见
       * settleLevelCelebration）。旧档案缺该字段时按当前等级种入，
       * 保证曲线调整/迁移不触发追溯祝贺。 */
      celebratedLevel: 1,
      achievements: {},
      lastLessonId: null,
      /* v4.2 新增：叶片（与 XP 分离，见 economy.js）。
       * coins = 当前余额；coinMinuteAwarded = 已结算的 10 分钟块数（幂等计数器）；
       * coinFlags = 一次性叶片奖励闩锁（与 XP 的 rewardFlags 分开记账）。 */
      coins: 0,
      coinMinuteAwarded: 0,
      coinFlags: {},
      /* v4.2：学习历史（有意义事件流水，容量上限见 history.js）。 */
      history: [],
      /* v4.3（交接 D1）：循环成就的阶级闩锁 { familyId: 1|2|3 }。
       * 只升不降：当前指标回落不掉阶，撤销重做也刷不出第二次晋升奖励
       * （奖励另有 coinFlags 'tier:<family>:<tier>' 闩锁）。 */
      achievementTiers: {},
      /* v4.3（交接 G）：轻量复习调度 { lessonId: { intervalIndex, dueDay,
       * doneCount, lastDoneDay } }。固定阶梯 1/3/7/30 天；doneCount 是
       * “复习完成”动作的幂等累计（同一课同一自然日最多 +1），
       * 也是循环成就「复习达人」的推导来源。 */
      reviews: {},
      /* v4.3（交接 E3）：章节 Boss 挑战纪录 { unitId: { attempts, passCount,
       * highCount, lastCountDay, bestPct, firstPct, lastPct, firstWasPrecheck } }。
       * passCount/highCount 按“同一单元同一自然日最多 +1”幂等累计。 */
      bosses: {},
      /* v4 新增：个人资料，以及“是否曾经标记过需要复习”的单向闩锁。
       * 后者是 review-cleared 成就的必要条件——只看当前复习项为 0，无法区分
       * “从来没标记过”和“标记过又清空了”。 */
      profile: emptyProfile(),
      reviewEverMarked: false,
      cosmetics: emptyCosmetics(),
      settings: emptySettings()
    };
  }

  /* ---------- 个人资料字段校验（纯函数，可直接测试） ---------- */

  /* 昵称：可选、不要求实名，也不读取系统用户名、GitHub 用户名或浏览器账号信息。
   * 剔除控制字符、零宽字符与双向控制字符（避免破坏排版或被用来伪装界面文本），
   * 压掉连续空格，超长截断；空值回落默认昵称。 */
  /* 带 g 标志的正则配合 .test() 会因 lastIndex 产生交替真假的诡异结果，
   * 因此这个常量只允许与 String.prototype.replace 搭配使用（replace 每次都会复位 lastIndex）。
   * 覆盖范围已实测：NUL、US、DEL、C1、ZWSP、ZWNJ、LRM、LRE、RLO、BOM 全部命中；
   * U+2028 / U+2029 属行分隔符，由后面的 \s 折叠成普通空格。 */
  const NICKNAME_STRIP = /[\p{Cc}\p{Cf}]/gu;

  function normalizeNickname(value) {
    if (typeof value !== 'string') return DEFAULT_NICKNAME;
    const cleaned = value.replace(NICKNAME_STRIP, '').replace(/\s+/g, ' ').trim();
    if (!cleaned) return DEFAULT_NICKNAME;
    /* 用 Array.from 按码点截断，避免把代理对（emoji 等）切成半个字符 */
    const points = Array.from(cleaned);
    return points.length > NICKNAME_MAX_LENGTH ? points.slice(0, NICKNAME_MAX_LENGTH).join('') : cleaned;
  }

  /* v4.5（交接 C1）：学习伙伴昵称清洗——与昵称同一套安全规则（去控制/格式
   * 字符、折叠空白、按码点截断），但上限收紧到 12（交接建议 1–12 字符）。
   * 空串 / 非字符串 / 全空白 → 回落默认「小诺」，绝不存空名字。
   * 这是用户可自定义的**伙伴昵称**，与 profile.nickname（用户自己的昵称）无关。 */
  function normalizeCompanionName(value) {
    if (typeof value !== 'string') return DEFAULT_COMPANION_NAME;
    const cleaned = value.replace(NICKNAME_STRIP, '').replace(/\s+/g, ' ').trim();
    if (!cleaned) return DEFAULT_COMPANION_NAME;
    /* v4.9：旧品牌默认名（registry.legacyCompanionNames，如「芽芽」）不是用户
     * 起的名——老档案把它当「用户自定义昵称」继续显示，是 v4.8 的验证盲区。
     * 清洗成默认名后，读档路径不会把它写进 companionNicknames、companionIdentity
     * 与 companion-view.displayName 都会走按角色默认名回落（最终「小诺」）；
     * 用户此后也无法再把昵称起成它（已知副作用，用户已接受）。 */
    if (LEGACY_COMPANION_NAMES.includes(cleaned)) return DEFAULT_COMPANION_NAME;
    const points = Array.from(cleaned);
    return points.length > COMPANION_NAME_MAX_LENGTH
      ? points.slice(0, COMPANION_NAME_MAX_LENGTH).join('') : cleaned;
  }

  /* 第二轮（发布前查漏补缺）：按角色的「默认名」——品牌默认名只属于默认角色
   * （v4.8 起 nono → 「小诺」；历史上是 sprout → 「芽芽」）；其余角色没有专属
   * 昵称时回落自己在登记表里的名字（艾拉 / 米娅 / 少年…），不再一律回落全局
   * 默认名。这是「切换到其他角色后仍显示默认名」的数据层根因修复：昵称
   * （settings.companionNicknames）永远优先于本函数；登记表缺失或 id 未知时
   * 降级回全局默认名（异常兜底，不抛错）。
   * v4.8：退役角色（registry.retiredIds，如 sprout）显示层已由 companion-view
   * 回落成默认角色，默认名同样回落品牌默认名「小诺」，不再返回其登记名「幼芽」。 */
  function defaultCompanionNameFor(id) {
    const defaultId = (companionRegistry && companionRegistry.defaultCompanionId) || DEFAULT_COMPANION_ID;
    if (!id || id === defaultId) return DEFAULT_COMPANION_NAME;
    const retired = companionRegistry && Array.isArray(companionRegistry.retiredIds) ? companionRegistry.retiredIds : [];
    if (retired.includes(id)) return DEFAULT_COMPANION_NAME;
    const list = companionRegistry && Array.isArray(companionRegistry.companions) ? companionRegistry.companions : [];
    const item = list.find(entry => entry && entry.id === id);
    return (item && (item.name || item.zh)) || DEFAULT_COMPANION_NAME;
  }

  /* v4.5（交接 C2）：显示模式白名单——非三态之一（含旧档案缺省 / 非法值）
   * 一律回落 'auto'，避免手改档案塞进未知模式让面板渲染分叉。 */
  function normalizeCompanionDisplay(value) {
    return COMPANION_DISPLAY_MODES.includes(value) ? value : DEFAULT_COMPANION_DISPLAY;
  }

  /* 头像 id 只校验格式；具体有哪些头像由 avatars.js 决定，UI 找不到时回退默认头像。
   * 这样“合法 id 清单”只有一处事实源，两个文件不会各自维护一份列表而漂移。 */
  /* v4.9：退役默认头像（registry.retiredAvatarIds，如 v4.8 前的 'terminal'）
   * 视为「用户没选过」，归一化为当前产品默认头像。这是读取层归一化：命中的
   * 老档案在内存里读成 companion-nono，存储原文一个字节都不动（不写回、
   * 不迁移），因此老档案随时可以一键回滚。 */
  function normalizeAvatarId(value) {
    if (typeof value !== 'string' || !AVATAR_ID_PATTERN.test(value)) return DEFAULT_AVATAR_ID;
    return RETIRED_AVATAR_IDS.includes(value) ? DEFAULT_AVATAR_ID : value;
  }

  /* 头像数据：只接受本站自己生成的 WebP / PNG data URL，且限制长度。
   * 不接受 svg（SVG 可携带脚本），不接受 http(s) 远程地址（会引入联网与版权风险），
   * 不接受任意 data: 类型。非法值一律回落 null，即“使用默认头像”。 */
  function normalizeAvatarData(value) {
    if (typeof value !== 'string') return null;
    if (value.length > AVATAR_DATA_MAX_LENGTH) return null;
    return AVATAR_DATA_PATTERN.test(value) ? value : null;
  }

  /* 上传入口的前置校验：在读取文件之前就用中文说明拒绝不合适的文件，
   * 避免把 20MB 的原图先读进内存再失败。 */
  function checkAvatarFile(fileInfo) {
    if (!fileInfo || typeof fileInfo !== 'object') return { ok: false, error: '没有读到文件，请重新选择一张图片。' };
    const type = String(fileInfo.type || '');
    const size = Number(fileInfo.size) || 0;
    if (type === 'image/svg+xml') {
      return { ok: false, error: '不支持 SVG 图片：SVG 可以包含脚本，出于安全考虑请改用 JPG、PNG 或 WebP。' };
    }
    if (!AVATAR_INPUT_TYPES.includes(type)) {
      return { ok: false, error: `不支持的图片类型${type ? '（' + type + '）' : ''}，请选择 JPG、PNG、WebP、GIF 或 BMP 图片。` };
    }
    if (size <= 0) return { ok: false, error: '这个文件是空的，请换一张图片。' };
    if (size > AVATAR_INPUT_MAX_BYTES) {
      return { ok: false, error: '图片太大了（超过 12 MB），请先在本机压缩后再上传。' };
    }
    return { ok: true };
  }

  /* 头像框：只有已解锁的才能装备；非法或未解锁一律回落默认框（§5）。
   * 解锁条件看等级、成就与叶片购买记录（v4.2），全部都在 state 里，
   * 因此不需要课程列表。coins 类解锁的判定规则与 collections.js 的
   * isAssetUnlocked 一致（tests/collections.test.cjs 钉住两边不漂移）。 */
  function isFrameUnlocked(state, frame) {
    if (!frame || !frame.unlock) return false;
    if (frame.unlock.kind === 'level') return levelOf(state.xp) >= frame.unlock.value;
    if (frame.unlock.kind === 'achievement') return Boolean(state.achievements[frame.unlock.value]);
    if (frame.unlock.kind === 'coins') {
      const cosmetics = state.cosmetics || {};
      /* 购买 key 带 frame: 类型前缀，与 collections.js 的 purchaseKey 一致 */
      return Boolean(cosmetics.purchases && cosmetics.purchases[`frame:${frame.id}`] === true);
    }
    return false;
  }

  /* 未解锁或未知的框一律回落默认框（§5：未解锁不能装备）。 */
  function normalizeFrameId(value, state) {
    if (typeof value !== 'string') return DEFAULT_FRAME_ID;
    const frame = FRAMES.find(item => item.id === value);
    if (!frame) return DEFAULT_FRAME_ID;
    return isFrameUnlocked(state, frame) ? frame.id : DEFAULT_FRAME_ID;
  }

  function unlockedFrames(state) {
    return FRAMES.filter(frame => isFrameUnlocked(state, frame));
  }

  function profileOf(state) {
    const profile = state.profile || emptyProfile();
    return {
      nickname: normalizeNickname(profile.nickname),
      avatarId: normalizeAvatarId(profile.avatarId),
      avatarData: normalizeAvatarData(profile.avatarData),
      equippedFrameId: profile.equippedFrameId || DEFAULT_FRAME_ID
    };
  }

  function setProfileField(state, field, value) {
    if (!state.profile) state.profile = emptyProfile();
    if (field === 'nickname') state.profile.nickname = normalizeNickname(value);
    else if (field === 'avatarId') state.profile.avatarId = normalizeAvatarId(value);
    else if (field === 'avatarData') state.profile.avatarData = normalizeAvatarData(value);
    else return false;
    return true;
  }

  /* 每课记录按需创建，避免为空课程写入无意义对象。 */
  function lessonEntry(state, lessonId) {
    if (!state.lessons[lessonId]) state.lessons[lessonId] = emptyLessonEntry();
    return state.lessons[lessonId];
  }

  /* 浏览器本地日期 → YYYY-MM-DD。streak 按本地自然日计算，不用 UTC。 */
  function dayKeyFromDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  /* 用 UTC 运算平移日期字符串，避免本地时区把日期算错一天。 */
  function shiftDayKey(dayKey, delta) {
    const [year, month, day] = dayKey.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day + delta)).toISOString().slice(0, 10);
  }

  /* 到达某等级所需的累计 XP。Lv.1–Lv.10 查表；Lv.10 以上线性延续
   * （每级 +XP_PER_LEVEL），与表尾无缝衔接：Lv.10=900，Lv.11=1000……
   * 该函数对 level 单调不减，是 levelOf 的逆运算。 */
  function xpForLevel(level) {
    const lv = Math.max(1, Math.floor(Number(level) || 1));
    const top = LEVEL_CURVE.length - 1;    // 表内最高等级 Lv.10 的下标
    if (lv <= top) return LEVEL_CURVE[lv - 1];
    return LEVEL_CURVE[top] + (lv - top - 1) * XP_PER_LEVEL;
  }

  /* XP → Level。前 10 级查表（非线性，前期快速），Lv.10 以上线性。
   * 单调不减；旧用户 XP 不重算，只映射到新曲线，且任意 XP 下
   * 新等级 ≥ 旧线性等级（floor(xp/100)+1），存量用户永不降级。 */
  function levelOf(xp) {
    const x = Math.max(0, Math.floor(Number(xp) || 0));
    const top = LEVEL_CURVE.length - 1;
    if (x >= LEVEL_CURVE[top]) return (top + 1) + Math.floor((x - LEVEL_CURVE[top]) / XP_PER_LEVEL);
    for (let level = top; level >= 2; level -= 1) {
      if (x >= LEVEL_CURVE[level - 1]) return level;
    }
    return 1;
  }

  function nextLevelXp(xp) {
    return xpForLevel(levelOf(xp) + 1);
  }

  /* 有效学习时长：只有页面可见且近期有活动才累计。
   * 返回本 tick 应计入的秒数；不可见或已空闲超过上限则返回 0（暂停计时）。 */
  function computeTick(options) {
    const visible = options.visible !== false;
    const idleSeconds = Number(options.idleSeconds) || 0;
    const elapsedSeconds = Number(options.elapsedSeconds) || 0;
    if (!visible || elapsedSeconds <= 0) return 0;
    if (idleSeconds > IDLE_LIMIT_SECONDS) return 0;
    return Math.min(elapsedSeconds, IDLE_LIMIT_SECONDS);
  }

  /* 分钟 XP 按累计总秒数发放，天然幂等：重复调用或撤销状态都不会重复领取。 */
  function awardMinuteXp(state) {
    const due = Math.floor(state.totalActiveSeconds / 60);
    if (due <= state.minuteXpAwarded) return 0;
    const gained = (due - state.minuteXpAwarded) * XP_PER_ACTIVE_MINUTE;
    state.minuteXpAwarded = due;
    state.xp += gained;
    return gained;
  }

  function awardOnce(state, flagKey, amount) {
    if (state.rewardFlags[flagKey]) return 0;
    state.rewardFlags[flagKey] = true;
    state.xp += amount;
    return amount;
  }

  /* v4.5（交接 Core E2）：升级结算（纯逻辑，afterChange 调用）。
   * celebratedLevel = 已经祝贺过的最高等级，单向棘轮：
   *   - 没升级返回 null（不触发任何提示）；
   *   - 升级返回 { fromLevel, toLevel }——一次结算跨多级也只产生一条事件，
   *     UI 合并成一条轻提示，不连弹 Modal；
   *   - 旧档案载入 / 导入时 celebratedLevel 被种到当前等级（见 sanitizeState），
   *     因此曲线调整、档案迁移导致的等级变化只补「已达到等级」状态，
   *     绝不追溯狂发祝贺；等级奖励本体是 level 解锁的装扮（无经济发放），
   *     解锁判定是等级的纯函数，天然无重复发放问题（交接测试要求 #11）。 */
  function settleLevelCelebration(state) {
    const current = levelOf(state.xp);
    const celebrated = Math.max(1, Math.floor(Number(state.celebratedLevel) || 1));
    if (current <= celebrated) return null;
    state.celebratedLevel = current;
    return { fromLevel: celebrated, toLevel: current };
  }

  /* v4.5（交接 Core F）：首次有效读到本课结尾的结算（纯逻辑）。
   * 三道闸门：① reachedEnd（阅读位置 100%）；② 本次会话有效阅读秒数 ≥
   * READ_COMPLETE_MIN_SECONDS（UI 侧会话计数，End 键秒到底不满足）；
   * ③ rewardFlags['read:<lessonId>'] 终身一次（刷新 / 来回滚动 / 重复调用
   * 都不重发）。发放：+10 XP（rewardFlags 闩锁）+ 5 叶片（coinFlags 闩锁，
   * 与 XP 分开记账，同一模式见 setLessonFlag）。**绝不触碰** lessons[id] 的
   * completed / officialCompleted / quizCompleted，也不写 reviews / bosses——
   * 「滚到 100% ≠ 完成课程」是红线。history 记一条 read-complete 事件，
   * 不为统计新增第二计数器（完成数等仍只看 completed 标记）。 */
  function settleReadComplete(state, lessonId, sessionSeconds, reachedEnd, nowIso) {
    if (!lessonId) return { ok: false, reason: 'no-lesson' };
    if (!reachedEnd) return { ok: false, reason: 'not-end' };
    const secs = Math.floor(Number(sessionSeconds) || 0);
    if (secs < READ_COMPLETE_MIN_SECONDS) return { ok: false, reason: 'too-fast', sessionSeconds: secs };
    const flagKey = `read:${lessonId}`;
    if (state.rewardFlags[flagKey]) return { ok: false, reason: 'already' };
    const awardedXp = awardOnce(state, flagKey, READ_COMPLETE_XP);
    let coins = 0;
    if (economy) coins = economy.awardOnce(state, economy.flagKey('read', lessonId), economy.COIN_READ_COMPLETE);
    if (historyModule) historyModule.logEvent(state, 'read-complete', { lessonId }, nowIso);
    return { ok: true, xp: awardedXp, coins, lessonId };
  }

  function addActiveSeconds(state, lessonId, seconds, dayKey) {
    const whole = Math.floor(Number(seconds) || 0);
    if (whole <= 0) return state;
    if (lessonId) lessonEntry(state, lessonId).activeSeconds += whole;
    state.totalActiveSeconds += whole;
    if (isDayKey(dayKey)) state.daily[dayKey] = (state.daily[dayKey] || 0) + whole;
    awardMinuteXp(state);
    if (economy) economy.awardMinuteCoins(state);
    return state;
  }

  /* streak：从今天往回数连续达标天数。今天还没达标时不打断昨天为止的连续记录。 */
  function streakOf(state, todayKey) {
    if (!isDayKey(todayKey)) return 0;
    const reached = key => (state.daily[key] || 0) >= STREAK_MIN_DAY_SECONDS;
    let cursor = reached(todayKey) ? todayKey : shiftDayKey(todayKey, -1);
    let count = 0;
    while (reached(cursor)) {
      count += 1;
      cursor = shiftDayKey(cursor, -1);
    }
    return count;
  }

  function markVisited(state, lessonId, nowIso, dayKey) {
    if (!lessonId) return state;
    const entry = lessonEntry(state, lessonId);
    if (!entry.started) {
      entry.started = true;
      entry.startedAt = nowIso;
      /* v4.2：每课第一次打开记一条“开始某课”（§10）。 */
      if (historyModule) historyModule.logEvent(state, 'lesson-start', { lessonId }, nowIso);
    }
    entry.lastVisitedAt = nowIso;
    state.lastLessonId = lessonId;
    if (isDayKey(dayKey) && !state.daily[dayKey]) state.daily[dayKey] = 0;
    return state;
  }

  /* 完成状态全部由用户主动确认；撤销时保留一次性奖励标记，因此无法反复刷 XP，
   * 也无法反复刷叶片（coinFlags 同样只在首次勾选时落闩锁）。 */
  function setLessonFlag(state, lessonId, field, value, nowIso, xpAmount) {
    const entry = lessonEntry(state, lessonId);
    const next = Boolean(value);
    if (entry[field] === next) return state;
    entry[field] = next;
    if (field === 'completed') entry.completedAt = next ? nowIso : null;
    /* v4.2：官方任务 / 自测的标记时间与 completedAt 同一口径（§8 今日完成数） */
    if (field === 'officialCompleted') entry.officialCompletedAt = next ? nowIso : null;
    if (field === 'quizCompleted') entry.quizCompletedAt = next ? nowIso : null;
    /* reviewEverMarked 是单向闩锁：一旦标记过需要复习就永远为真。
     * review-cleared 成就要靠它区分“从来没标记过”和“标记过又清空了”。 */
    if (field === 'needsReview' && next) state.reviewEverMarked = true;
    /* v4.3（交接 G）：复习标记联动轻量调度——勾上开始 1/3/7/30 阶梯，
     * 取消则停止调度（doneCount 等历史记录保留，供复习达人成就推导）。 */
    if (field === 'needsReview') {
      const dayKey = isIsoText(nowIso) ? dayKeyFromDate(new Date(nowIso)) : null;
      if (next) ensureReviewSchedule(state, lessonId, dayKey);
      else pauseReviewSchedule(state, lessonId);
    }
    if (next && xpAmount) awardOnce(state, `${field}:${lessonId}`, xpAmount);
    /* v4.2：完成类一次性叶片（needsReview 无对应奖励，awardLessonCoins 返回 0） */
    if (next && economy) economy.awardLessonCoins(state, field, lessonId);
    /* v4.2：学习历史（§10 的有意义事件；撤销完成不记，避免刷出无意义流水） */
    if (historyModule) {
      const historyType = {
        completed: 'lesson-complete',
        officialCompleted: 'official-complete',
        quizCompleted: 'quiz-complete'
      }[field];
      if (historyType && next) historyModule.logEvent(state, historyType, { lessonId }, nowIso);
      if (field === 'needsReview') {
        historyModule.logEvent(state, next ? 'review-mark' : 'review-clear', { lessonId }, nowIso);
      }
    }
    return state;
  }

  /* 各类计数一律只统计**当前收录课程**范围内的真实状态，绝不外推到未开放课程。 */
  function countBy(lessons, state, field) {
    if (!Array.isArray(lessons)) return 0;
    return lessons.filter(lesson => (state.lessons[lesson.id] || emptyLessonEntry())[field] === true).length;
  }

  function needsReviewCount(state) {
    return Object.values(state.lessons || {}).filter(entry => entry && entry.needsReview === true).length;
  }

  /* ---------- v4.11.3 C1：课程体量判定（「大课」） ----------
   * 判定由真实数据算出（读 lessons.js 现成的 sections 与 official.knowledgeCheck
   * 字段，不硬编码课 id，不改 lessons.js）：
   *   章节数 >= 14 或 官方自查题数 >= 10。
   * 阈值稳健性：规划阶段用三种独立阈值（章≥14 或 KC≥10 / 章+KC≥20 / 章+KC×1.5≥25）
   * 对 19 课实测，判定集合完全相同——{ links-and-images(22章/9题),
   * git-basics(16/11), command-line-basics(14/11), how-does-the-web-work(8/15) }，
   * 且与第 5 名（html-boilerplate 12 章/4 题）之间有明确间隔，因此该集合
   * 不依赖阈值的精确取值；调整阈值 ±2 不会改变集合。
   * 语义边界：这只描述「体量」（内容多、值得多花时间），不评价难度——
   * 展示文案不得写成「这课很难」之类的负面暗示。 */
  const HEAVY_LESSON_MIN_SECTIONS = 14;
  const HEAVY_LESSON_MIN_KC = 10;

  function isHeavyLesson(lesson) {
    if (!lesson) return false;
    const sections = Array.isArray(lesson.sections) ? lesson.sections.length : 0;
    const kc = lesson.official && Array.isArray(lesson.official.knowledgeCheck)
      ? lesson.official.knowledgeCheck.length : 0;
    return sections >= HEAVY_LESSON_MIN_SECTIONS || kc >= HEAVY_LESSON_MIN_KC;
  }

  function heavyLessonList(lessons) {
    return (Array.isArray(lessons) ? lessons : []).filter(isHeavyLesson);
  }

  /* 表驱动的成就判定：goal 描述条件，这里只算“当前值 / 目标值”。
   * UI 的进度条与学习助手的“距下一个成就还差多少”复用同一个函数，
   * 因此不会出现说明文字与实际判定条件不一致的情况。 */
  function goalProgress(state, goal, lessons, todayKey) {
    const total = Array.isArray(lessons) ? lessons.length : 0;
    switch (goal.kind) {
      case 'seconds':
        return { current: state.totalActiveSeconds, target: goal.value, unit: 'seconds' };
      case 'streak':
        return { current: streakOf(state, todayKey), target: goal.value, unit: 'days' };
      case 'completed':
        return { current: countBy(lessons, state, 'completed'), target: goal.value, unit: 'lessons' };
      case 'completedAll':
        return { current: countBy(lessons, state, 'completed'), target: total, unit: 'lessons' };
      /* v4.11.3 C3：大课体量成就——lessons 数组已传入判定函数，直接读
       * sections / knowledgeCheck 算体量（isHeavyLesson），保持表驱动风格。
       * goal.value 给出时目标为该值（如「第一门大课」= 1）；缺省时目标为
       * 当前大课总数（与 completedAll 同一「总数由数据算出」模式，课程
       * 收录变化时目标自动跟随）。 */
      case 'completedHeavy': {
        const heavy = heavyLessonList(lessons);
        const done = heavy.filter(lesson => (state.lessons[lesson.id] || emptyLessonEntry()).completed === true).length;
        return { current: done, target: goal.value || heavy.length, unit: 'lessons' };
      }
      case 'official':
        return { current: countBy(lessons, state, 'officialCompleted'), target: goal.value, unit: 'lessons' };
      case 'officialAll':
        return { current: countBy(lessons, state, 'officialCompleted'), target: total, unit: 'lessons' };
      case 'quiz':
        return { current: countBy(lessons, state, 'quizCompleted'), target: goal.value, unit: 'lessons' };
      case 'quizAll':
        return { current: countBy(lessons, state, 'quizCompleted'), target: total, unit: 'lessons' };
      case 'unit': {
        const inGroup = Array.isArray(lessons) ? lessons.filter(lesson => lesson.group === goal.value) : [];
        return { current: countBy(inGroup, state, 'completed'), target: inGroup.length, unit: 'lessons' };
      }
      case 'firstLesson': {
        const firstId = Array.isArray(lessons) && lessons.length ? lessons[0].id : null;
        const done = Boolean(firstId && (state.lessons[firstId] || emptyLessonEntry()).completed);
        return { current: done ? 1 : 0, target: 1, unit: 'lessons' };
      }
      case 'started': {
        const started = Array.isArray(lessons)
          && lessons.some(lesson => (state.lessons[lesson.id] || emptyLessonEntry()).started);
        return { current: started ? 1 : 0, target: 1, unit: 'lessons' };
      }
      /* v4.3（交接 C1）：第一次进入第一课（早期成就 first-steps 的判定） */
      case 'firstLessonVisit': {
        const firstId = Array.isArray(lessons) && lessons.length ? lessons[0].id : null;
        const visited = Boolean(firstId && (state.lessons[firstId] || emptyLessonEntry()).started);
        return { current: visited ? 1 : 0, target: 1, unit: 'lessons' };
      }
      /* v4.2 新增的四类 goal（交接 §7）：全部只依赖 state 与 lessons，
       * 不需要外部资产清单，Logic 层保持纯函数。 */
      case 'startedCount':
        return { current: countBy(lessons, state, 'started'), target: goal.value, unit: 'lessons' };
      case 'daySeconds': {
        const values = Object.values(state.daily || {});
        const best = values.length ? Math.max(...values) : 0;
        return { current: Math.floor(best), target: goal.value, unit: 'seconds' };
      }
      case 'level':
        return { current: levelOf(state.xp), target: goal.value, unit: 'levels' };
      case 'purchases':
        return { current: Object.keys((state.cosmetics || {}).purchases || {}).length, target: goal.value, unit: 'items' };
      /* v4.2（交接 §7 单日组 / §8.1）：连续 N 天达成每日学习目标。
       * 今天还没达标时不打断昨天为止的连续记录（与 streakOf 同一语义）。 */
      case 'dailyGoalDays': {
        const goalSeconds = ((state.settings || {}).dailyGoalMinutes || DEFAULT_DAILY_GOAL_MINUTES) * 60;
        const reached = key => isDayKey(key) && (state.daily[key] || 0) >= goalSeconds;
        let cursor = reached(todayKey) ? todayKey : shiftDayKey(todayKey, -1);
        let count = 0;
        while (reached(cursor)) {
          count += 1;
          cursor = shiftDayKey(cursor, -1);
        }
        return { current: count, target: goal.value, unit: 'days' };
      }
      case 'reviewEver':
        return { current: state.reviewEverMarked ? 1 : 0, target: 1, unit: 'steps' };
      case 'reviewCleared':
        return {
          current: state.reviewEverMarked && needsReviewCount(state) === 0 ? 1 : 0,
          target: 1,
          unit: 'steps'
        };
      /* v4.3（交接 E3）：Boss 挑战的两类一次性成就指标。计数口径与循环
       * 成就 boss 族一致（bosses[*].passCount 带同日幂等），推导不另存。 */
      case 'bossPass': {
        const total = Object.values(state.bosses || {}).reduce(
          (sum, entry) => sum + (entry && Number(entry.passCount) > 0 ? Math.floor(entry.passCount) : 0), 0);
        return { current: total, target: goal.value, unit: 'times' };
      }
      case 'bossPrecheckHigh': {
        let best = 0;
        for (const entry of Object.values(state.bosses || {})) {
          const pct = entry && Number.isFinite(Number(entry.precheckBestPct)) && entry.precheckBestPct !== null
            ? Number(entry.precheckBestPct) : 0;
          if (pct > best) best = pct;
        }
        return { current: best, target: goal.value, unit: 'percent' };
      }
      /* v4.3 Batch 10（Stretch N5）：隐藏成就的两个推导指标 */
      case 'precheckUnits': {
        const count = Object.values(state.bosses || {}).filter(entry => entry
          && entry.precheckBestPct !== null && entry.precheckBestPct !== undefined
          && Number(entry.precheckBestPct) >= PRECHECK_HIGH_PCT).length;
        return { current: count, target: goal.value, unit: 'items' };
      }
      case 'masteredCount': {
        /* 与 map.js 的 mastered 状态同一口径：三项齐全 + 复习周期经历过
         * （everMarked）且当前没有待复习标记。tests 钉住两边结果一致。 */
        const count = (Array.isArray(lessons) ? lessons : []).filter(lesson => {
          const entry = state.lessons[lesson.id] || emptyLessonEntry();
          const review = (state.reviews || {})[lesson.id];
          return entry.completed === true && entry.officialCompleted === true && entry.quizCompleted === true
            && Boolean(review) && review.everMarked === true && entry.needsReview !== true;
        }).length;
        return { current: count, target: goal.value, unit: 'lessons' };
      }
      default:
        return { current: 0, target: 0, unit: 'unknown' };
    }
  }

  function isGoalDone(state, goal, lessons, todayKey) {
    const progress = goalProgress(state, goal, lessons, todayKey);
    return progress.target > 0 && progress.current >= progress.target;
  }

  function evaluateAchievements(state, lessons, nowIso, todayKey) {
    if (!Array.isArray(lessons) || !lessons.length) return [];
    const unlocked = [];
    ACHIEVEMENTS.forEach(achievement => {
      if (state.achievements[achievement.id]) return;   // 已解锁的绝不重复解锁
      if (!isGoalDone(state, achievement.goal, lessons, todayKey)) return;
      state.achievements[achievement.id] = nowIso;
      unlocked.push(achievement.id);
    });
    return unlocked;
  }

  /* 学习助手与个人资料面板用：按“还差多少”排序，给出最近的若干条**可见**目标。
   * 隐藏成就不出现在提示里，否则等于公开了它的条件。 */
  function nextVisibleGoals(state, lessons, todayKey, limit) {
    const wanted = Number(limit) > 0 ? Number(limit) : 3;
    return ACHIEVEMENTS
      .filter(achievement => !achievement.hidden && !state.achievements[achievement.id])
      .map(achievement => {
        const progress = goalProgress(state, achievement.goal, lessons, todayKey);
        return {
          id: achievement.id, zh: achievement.zh, desc: achievement.desc,
          category: achievement.category, unit: progress.unit,
          current: progress.current, target: progress.target,
          remaining: Math.max(0, progress.target - progress.current)
        };
      })
      .filter(item => item.target > 0)
      .sort((a, b) => a.remaining - b.remaining || a.target - b.target)
      .slice(0, wanted);
  }

  /* 未解锁的头像框按“还差多少”排序，供助手提示“距下一个头像框”。
   * v4.2：叶片解锁框按“还差多少叶片”提示（§6.4 距下一个外观解锁）。 */
  function nextFrames(state, lessons, todayKey, limit) {
    const wanted = Number(limit) > 0 ? Number(limit) : 2;
    return FRAMES
      .filter(frame => !isFrameUnlocked(state, frame))
      .map(frame => {
        if (frame.unlock.kind === 'level') {
          return {
            id: frame.id, zh: frame.zh, desc: frame.desc, unit: 'levels',
            remaining: Math.max(0, frame.unlock.value - levelOf(state.xp))
          };
        }
        if (frame.unlock.kind === 'coins') {
          return {
            id: frame.id, zh: frame.zh, desc: frame.desc, unit: 'coins',
            remaining: Math.max(0, frame.unlock.value - (state.coins || 0))
          };
        }
        const achievement = ACHIEVEMENTS.find(item => item.id === frame.unlock.value);
        if (!achievement) return null;
        const progress = goalProgress(state, achievement.goal, lessons, todayKey);
        return {
          id: frame.id, zh: frame.zh, desc: frame.desc, unit: progress.unit,
          remaining: Math.max(0, progress.target - progress.current),
          /* 由隐藏成就解锁的框不公开具体条件 */
          hidden: Boolean(achievement.hidden)
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.remaining - b.remaining)
      .slice(0, wanted);
  }

  /* ---------- v4：学习助手「小奥」的确定性信息（§10） ----------
   * 交接 §10 写得很硬：本轮不是 AI 聊天机器人，不接模型 API，不联网，面板里的每一条
   * 信息和那唯一一条情境提示都必须由确定性规则算出来；也不做自由输入框。
   * 所以这套逻辑放在 Logic 层（纯函数、不碰 DOM、不碰存储），app.js 只负责把返回的
   * 普通对象渲染出来。规则因此可以被 Node 直接测，不需要浏览器。
   * 同一份档案、同一个今天，任何时候打开都得到逐字相同的内容。 */

  const ASSISTANT_TIP_KINDS = ['all-done', 'today-short', 'finish-current', 'review-due', 'review-pending', 'steady'];

  /* “还差多少”的人话版本。单位来自 goalProgress / nextFrames，
   * 这里集中翻译，避免 UI 各处自己拼字符串拼出不一致的口径。 */
  function remainingText(remaining, unit) {
    if (unit === 'seconds') return formatSeconds(remaining);
    if (unit === 'days') return `${remaining} 天`;
    if (unit === 'lessons') return `${remaining} 课`;
    if (unit === 'levels') return `${remaining} 级`;
    if (unit === 'coins') return `${remaining} 叶片`;
    if (unit === 'items') return `${remaining} 件`;
    if (unit === 'times') return `${remaining} 次`;
    if (unit === 'percent') return `${remaining} 个百分点`;
    return `${remaining} 步`;
  }

  /* 只回传 UI 需要的三个字段，不把整课正文带出去 */
  function briefLesson(lessons, lessonId) {
    if (!Array.isArray(lessons) || !lessonId) return null;
    const lesson = lessons.find(item => item.id === lessonId);
    return lesson ? { id: lesson.id, zh: lesson.zh, title: lesson.title } : null;
  }

  /* 最近解锁的成就：按解锁时间倒序取第一条。时间戳是 ISO 字符串，
   * 字典序即时间序，因此直接比较字符串就够了。 */
  function latestAchievement(state) {
    const ids = Object.keys(state.achievements);
    if (!ids.length) return null;
    ids.sort((a, b) => {
      const left = String(state.achievements[a]);
      const right = String(state.achievements[b]);
      if (left === right) return 0;
      return left < right ? 1 : -1;
    });
    const definition = ACHIEVEMENTS.find(item => item.id === ids[0]);
    if (!definition) return null;
    return { id: definition.id, zh: definition.zh, date: String(state.achievements[ids[0]]).slice(0, 10) };
  }

  /* §10 的那一条情境提示。规则从上往下，命中即返回，因此优先级是显式的：
   *   1. 已开放课程全部完成 —— 这是终局状态，此时任何“再学一点”的催促都是错的；
   *   2. 今天还不足 10 分钟 —— 唯一有时间压力的一条，错过今天连续天数就断了；
   *   3. 当前课还没收尾 —— 正在读的这一课比复习旧课更该先做完；
   *   4. 今天有到期的复习（v4.3 交接 G：小奥提醒复习，逾期不惩罚只陈述事实）；
   *   5. 有标记需要复习的课；
   *   6. 以上都不成立时的兜底，只陈述事实，不编造夸奖。 */
  function assistantTip(brief) {
    if (brief.totalLessons > 0 && brief.completedCount >= brief.totalLessons) {
      return { kind: 'all-done', text: '当前开放课程已全部完成，后续课程尚未开放。' };
    }
    if (brief.todaySeconds < STREAK_MIN_DAY_SECONDS) {
      const missingMinutes = Math.ceil((STREAK_MIN_DAY_SECONDS - brief.todaySeconds) / 60);
      return { kind: 'today-short', text: `再学 ${missingMinutes} 分钟，今天就计入连续学习。` };
    }
    if (brief.currentLesson && !brief.currentLesson.completed) {
      return { kind: 'finish-current', text: `先把当前课「${brief.currentLesson.zh}」收尾，再开下一课。` };
    }
    if (brief.reviewDueToday > 0) {
      return { kind: 'review-due', text: `今天有 ${brief.reviewDueToday} 课到了建议复习的日子，逾期不扣分，抽空看一眼就好。` };
    }
    if (brief.needsReviewCount > 0) {
      return { kind: 'review-pending', text: `有 ${brief.needsReviewCount} 课标记为需要复习。` };
    }
    return { kind: 'steady', text: `今天已经学了 ${formatSeconds(brief.todaySeconds)}，保持这个节奏就好。` };
  }

  /* 助手面板需要的全部信息，一次算完。
   * options.catalogTotal 由调用方传入官方目录总课数（catalog.js 是 UI 层的数据文件，
   * Logic 层不认识它）；没传就是 null，面板据此只显示已开放口径，绝不虚构 46 分母。
   * options.currentLessonId 用来判断“当前课有没有收尾”，首页传 null。 */
  function assistantBrief(state, lessons, todayKey, options) {
    const opts = options || {};
    const base = summary(state, lessons, todayKey);
    const goals = nextVisibleGoals(state, lessons, todayKey, 1);
    const frames = nextFrames(state, lessons, todayKey, 1);
    const current = briefLesson(lessons, opts.currentLessonId);
    const currentEntry = current ? state.lessons[current.id] || emptyLessonEntry() : null;
    const catalogTotal = Number(opts.catalogTotal) > 0 ? Number(opts.catalogTotal) : null;
    const brief = {
      nickname: base.nickname,
      todaySeconds: base.todaySeconds,
      todayText: formatSeconds(base.todaySeconds),
      streak: base.streak,
      streakDayMinutes: Math.round(STREAK_MIN_DAY_SECONDS / 60),
      level: base.level,
      xp: base.xp,
      xpToNext: base.xpToNext,
      coins: base.coins,
      completedCount: base.completedCount,
      totalLessons: base.totalLessons,
      catalogTotal,
      percent: base.percent,
      recentLesson: briefLesson(lessons, base.recentLessonId),
      continueLesson: briefLesson(lessons, base.continueLessonId),
      needsReviewCount: base.needsReviewCount,
      /* v4.3（交接 G）：今天到期的复习课数（小奥 review-due 提示的数据源） */
      reviewDueToday: base.reviewDueToday,
      achievementCount: base.achievementCount,
      achievementTotal: base.achievementTotal,
      unlockedFrameCount: base.unlockedFrameCount,
      frameTotal: base.frameTotal,
      currentLesson: current ? Object.assign({ completed: Boolean(currentEntry.completed) }, current) : null,
      nextGoal: null,
      nextFrame: null,
      latestAchievement: latestAchievement(state)
    };
    if (goals.length) {
      brief.nextGoal = {
        id: goals[0].id,
        zh: goals[0].zh,
        desc: goals[0].desc,
        current: goals[0].current,
        target: goals[0].target,
        unit: goals[0].unit,
        remaining: goals[0].remaining,
        remainingText: remainingText(goals[0].remaining, goals[0].unit)
      };
    }
    if (frames.length) {
      brief.nextFrame = {
        id: frames[0].id,
        zh: frames[0].zh,
        desc: frames[0].desc,
        unit: frames[0].unit,
        remaining: frames[0].remaining,
        /* 由隐藏成就解锁的框不公开还差多少，与成就面板的口径保持一致 */
        hidden: frames[0].hidden === true,
        remainingText: frames[0].hidden ? '达成隐藏条件后解锁' : remainingText(frames[0].remaining, frames[0].unit)
      };
    }
    brief.tip = assistantTip(brief);
    return brief;
  }

  /* “继续学习”：按课程顺序取第一个未完成课；全部完成则回到最后一课。 */
  function continueLessonId(state, lessons) {
    if (!Array.isArray(lessons) || !lessons.length) return null;
    const pending = lessons.find(lesson => !(state.lessons[lesson.id] || {}).completed);
    return pending ? pending.id : lessons[lessons.length - 1].id;
  }

  function recentLesson(state, lessons) {
    const id = state.lastLessonId;
    if (!id || !Array.isArray(lessons)) return null;
    return lessons.find(lesson => lesson.id === id) || null;
  }

  function summary(state, lessons, todayKey) {
    const total = Array.isArray(lessons) ? lessons.length : 0;
    /* 所有计数都只在当前收录课程范围内统计，不外推到未开放课程。 */
    const completedCount = countBy(lessons, state, 'completed');
    const xp = state.xp;
    /* v4.5（交接 Core E1）：非线性曲线下「本级已得」= xp − 本级门槛，
     * 不再对 100 取模。 */
    const level = levelOf(xp);
    const profile = profileOf(state);
    return {
      level,
      xp,
      xpIntoLevel: xp - xpForLevel(level),
      xpToNext: nextLevelXp(xp) - xp,
      coins: state.coins || 0,
      completedCount,
      totalLessons: total,
      percent: total ? Math.round((completedCount / total) * 100) : 0,
      todaySeconds: state.daily[todayKey] || 0,
      totalSeconds: state.totalActiveSeconds,
      streak: streakOf(state, todayKey),
      achievementCount: Object.keys(state.achievements).length,
      achievementTotal: ACHIEVEMENTS.length,
      officialCompletedCount: countBy(lessons, state, 'officialCompleted'),
      quizCompletedCount: countBy(lessons, state, 'quizCompleted'),
      startedCount: countBy(lessons, state, 'started'),
      needsReviewCount: needsReviewCount(state),
      /* v4.3（交接 G）：今天建议复习的课数（dueDay <= 今天且调度未停） */
      reviewDueToday: reviewsDue(state, todayKey).length,
      reviewEverMarked: state.reviewEverMarked === true,
      continueLessonId: continueLessonId(state, lessons),
      recentLessonId: state.lastLessonId,
      nickname: profile.nickname,
      avatarId: profile.avatarId,
      avatarData: profile.avatarData,
      equippedFrameId: profile.equippedFrameId,
      equippedFrame: FRAMES.find(frame => frame.id === profile.equippedFrameId) || FRAMES[0],
      unlockedFrameCount: unlockedFrames(state).length,
      frameTotal: FRAMES.length
    };
  }

  /* v1 / v2 / v3 → v4 自动迁移（交接 §11、§20；v4.3 O.2）。
   * 每一版都是**纯增量**改动：v2 补 profile 与 reviewEverMarked；v3 补叶片三字段；
   * v4 补 achievementTiers / reviews / bosses（循环成就、复习调度、Boss 纪录）。
   * 旧档案里 lessons / daily / totalActiveSeconds / xp / minuteXpAwarded /
   * rewardFlags / achievements / lastLessonId / profile / coins 的语义完全没变，
   * 因此迁移不重算任何数值——已有的 XP、有效学习时长、完成状态、成就、
   * 叶片余额与已解锁资产一个都不丢。
   * 叶片按“不追溯”原则处理（交接 §3.2：导入旧档案不能补发到失控）：v1/v2 历史
   * 完成的课、已累计的学习分钟都标记为已结算（coinFlags + coinMinuteAwarded 对齐），
   * 余额从 0 开始，只有迁移后的新行为才获得叶片。v3 → v4 不动叶片字段。
   * 循环成就同理不追溯发放奖励吗？——不：achievementTiers 从 0 开始，
   * 老用户的历史学习天数 / 自测数会在下一次 evaluateTiers 时按真实状态
   * 一次性晋升到应得阶级并领取对应叶片（与 v4.2 成就补发同一思路：
   * 按当前真实状态补发，不是虚构历史）。
   * rewardFlags 原样保留，因此旧的一次性 XP 不会因为迁移而被重复发放。 */
  function migrateState(candidate) {
    if (!candidate || typeof candidate !== 'object') return null;
    const version = candidate.schemaVersion;
    if (version === SCHEMA_VERSION) return candidate;
    if (!SUPPORTED_SCHEMA_VERSIONS.includes(version)) return null;
    const migrated = Object.assign({}, candidate, { schemaVersion: SCHEMA_VERSION });
    if (version === 1 || version === 2) {
      migrated.coins = 0;
      migrated.coinMinuteAwarded = 0;
      migrated.coinFlags = {};
      if (economy) economy.baselineMigratedState(migrated);
    }
    /* v3 → v4：achievementTiers / reviews / bosses 缺省即可，
     * sanitizeState 的白名单会补上默认空对象。 */
    return migrated;
  }

  /* ---------- v4.3：复习调度（交接 G） ----------
   * 固定阶梯 1 / 3 / 7 / 30 天：复习完成后推进到下一间隔；手动标记“仍不熟”
   * 回到最短间隔。不引入 SM-2/FSRS 的完整算法（交接 G：除非确认能在当前
   * 架构内轻量、可测、无依赖地实现——固定阶梯已经满足“逾期不惩罚、
   * 完成推进、不熟回退”的全部产品要求）。到期只提示，不扣任何资源。 */
  const REVIEW_INTERVALS_DAYS = [1, 3, 7, 30];
  const COUNTER_MAX = 1000000;   /* 计数类字段的异常防护上限（手改档案灌天文数字） */

  /* reviews 条目白名单：坏条目整条丢弃（尽力而为的调度数据，不值得拒绝整份档案） */
  function sanitizeReviewEntry(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    const intervalIndex = Math.floor(Number(raw.intervalIndex) || 0);
    const doneCount = Math.floor(Number(raw.doneCount) || 0);
    return {
      intervalIndex: Math.min(Math.max(0, intervalIndex), REVIEW_INTERVALS_DAYS.length - 1),
      dueDay: isDayKey(raw.dueDay) ? raw.dueDay : null,
      doneCount: Math.min(Math.max(0, doneCount), COUNTER_MAX),
      lastDoneDay: isDayKey(raw.lastDoneDay) ? raw.lastDoneDay : null,
      everMarked: raw.everMarked === true
    };
  }

  /* ---------- v4.3：轻量复习调度（交接 G） ----------
   * 固定阶梯 1 / 3 / 7 / 30 天：
   *   - 勾选「需要复习」→ 开始调度，下次复习 = 明天（第 1 级间隔）；
   *   - 「完成复习」→ 推进到下一间隔（1→3→7→30）；最后一次（30 天档）
   *     完成后本课复习周期结束，自动清除复习标记；
   *   - 「仍不熟」→ 回到最短间隔（明天），不算完成复习；
   *   - 到期只在首页/课页提示“今天有 N 课建议复习”，逾期不惩罚、不扣资源。
   * doneCount 按“同一课同一自然日最多 +1”幂等累计（lastDoneDay 日闩锁），
   * 是循环成就「复习达人」的推导来源；everMarked 记录“这一课曾经标记过
   * 复习”，供地图的「已精通」状态推导（交接 E2）。 */

  function emptyReviewEntry() {
    return { intervalIndex: 0, dueDay: null, doneCount: 0, lastDoneDay: null, everMarked: false };
  }

  /* 勾选「需要复习」时调用：开始（或重新开始）调度 */
  function ensureReviewSchedule(state, lessonId, todayKey) {
    if (!state.reviews || typeof state.reviews !== 'object') state.reviews = {};
    const entry = Object.assign(emptyReviewEntry(), state.reviews[lessonId] || {});
    entry.everMarked = true;
    entry.intervalIndex = 0;
    entry.dueDay = isDayKey(todayKey) ? shiftDayKey(todayKey, REVIEW_INTERVALS_DAYS[0]) : null;
    state.reviews[lessonId] = entry;
    return entry;
  }

  /* 取消勾选「需要复习」时调用：停止调度（历史记录保留） */
  function pauseReviewSchedule(state, lessonId) {
    const entry = (state.reviews || {})[lessonId];
    if (entry) entry.dueDay = null;
    return entry || null;
  }

  /* 「完成复习」：推进阶梯。同一课同一自然日重复调用幂等（doneCount 与
   * 阶梯都不重复推进）。最后一级完成 → 复习周期结束，needsReview 自动清除
   * （走 setLessonFlag 保持历史事件与全局闩锁口径一致）。 */
  function completeReview(state, lessonId, todayKey, nowIso) {
    const entry = (state.reviews || {})[lessonId];
    if (!entry) return { ok: false, error: '这一课还没有复习安排：先勾选「需要复习」开始调度。' };
    if (!isDayKey(todayKey)) return { ok: false, error: '日期不合法。' };
    if (entry.lastDoneDay === todayKey) {
      return { ok: true, repeated: true, entry, dueDay: entry.dueDay };
    }
    entry.doneCount += 1;
    entry.lastDoneDay = todayKey;
    let finished = false;
    if (entry.intervalIndex >= REVIEW_INTERVALS_DAYS.length - 1) {
      /* 30 天档也复习完了：本课复习周期结束 */
      entry.dueDay = null;
      finished = true;
      const lesson = lessonEntry(state, lessonId);
      if (lesson.needsReview) {
        lesson.needsReview = false;
        if (historyModule) historyModule.logEvent(state, 'review-clear', { lessonId }, nowIso);
      }
    } else {
      entry.intervalIndex += 1;
      entry.dueDay = shiftDayKey(todayKey, REVIEW_INTERVALS_DAYS[entry.intervalIndex]);
    }
    if (historyModule) historyModule.logEvent(state, 'review-done', { lessonId }, nowIso);
    return { ok: true, repeated: false, finished, entry, dueDay: entry.dueDay, intervalDays: REVIEW_INTERVALS_DAYS[entry.intervalIndex] };
  }

  /* 「仍不熟」：回到最短间隔，不算完成复习（doneCount 不加） */
  function markStillWeak(state, lessonId, todayKey) {
    const entry = (state.reviews || {})[lessonId];
    if (!entry) return { ok: false, error: '这一课还没有复习安排：先勾选「需要复习」开始调度。' };
    if (!isDayKey(todayKey)) return { ok: false, error: '日期不合法。' };
    entry.intervalIndex = 0;
    entry.dueDay = shiftDayKey(todayKey, REVIEW_INTERVALS_DAYS[0]);
    return { ok: true, entry, dueDay: entry.dueDay };
  }

  /* 今天建议复习的课：dueDay <= today 且调度未停（dueDay 非空）。
   * 逾期不惩罚——过期多久的课也只是排在列表前面，不扣任何资源。 */
  function reviewsDue(state, todayKey) {
    if (!isDayKey(todayKey)) return [];
    return Object.entries(state.reviews || {})
      .filter(([, entry]) => entry && isDayKey(entry.dueDay) && entry.dueDay <= todayKey)
      .map(([lessonId, entry]) => ({
        lessonId,
        dueDay: entry.dueDay,
        overdueDays: Math.round((Date.parse(`${todayKey}T00:00:00Z`) - Date.parse(`${entry.dueDay}T00:00:00Z`)) / 86400000),
        doneCount: entry.doneCount,
        intervalIndex: entry.intervalIndex
      }))
      .sort((a, b) => (a.dueDay < b.dueDay ? -1 : a.dueDay > b.dueDay ? 1 : 0));
  }

  /* 下一课到期复习（今天没有到期课时，UI 显示“下次复习”用） */
  function nextReviewDue(state, todayKey) {
    const upcoming = Object.entries(state.reviews || {})
      .filter(([, entry]) => entry && isDayKey(entry.dueDay) && entry.dueDay > todayKey)
      .map(([lessonId, entry]) => ({ lessonId, dueDay: entry.dueDay }))
      .sort((a, b) => (a.dueDay < b.dueDay ? -1 : 1));
    return upcoming.length ? upcoming[0] : null;
  }

  /* v4.3 Batch 9（交接 M20 复习日历）：未来复习安排一览。
   * 只列 dueDay 在未来的课（到期与逾期的归 reviewsDue 管），按日期升序，
   * 默认最多 14 条——是“接下来的节奏预览”，不是全量台账。 */
  function reviewUpcoming(state, todayKey, limit) {
    if (!isDayKey(todayKey)) return [];
    const wanted = Number.isInteger(limit) && limit > 0 ? limit : 14;
    return Object.entries(state.reviews || {})
      .filter(([, entry]) => entry && isDayKey(entry.dueDay) && entry.dueDay > todayKey)
      .map(([lessonId, entry]) => ({ lessonId, dueDay: entry.dueDay, intervalIndex: entry.intervalIndex }))
      .sort((a, b) => (a.dueDay < b.dueDay ? -1 : a.dueDay > b.dueDay ? 1 : 0))
      .slice(0, wanted);
  }

  /* bosses 条目白名单：分数夹在 0–100，计数夹在 [0, COUNTER_MAX]，
   * 字段结构与 bosses.js 的 emptyBossRecord 一致（tests/map-boss.test.cjs 钉住） */
  function sanitizeBossEntry(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    const int = (value, max) => Math.min(Math.max(0, Math.floor(Number(value) || 0)), max);
    const pct = value => (value === null || value === undefined ? null : Math.min(100, Math.max(0, Math.floor(Number(value) || 0))));
    return {
      attempts: int(raw.attempts, COUNTER_MAX),
      passCount: int(raw.passCount, COUNTER_MAX),
      highCount: int(raw.highCount, COUNTER_MAX),
      lastPassDay: isDayKey(raw.lastPassDay) ? raw.lastPassDay : null,
      lastHighDay: isDayKey(raw.lastHighDay) ? raw.lastHighDay : null,
      bestPct: pct(raw.bestPct),
      firstPct: pct(raw.firstPct),
      lastPct: pct(raw.lastPct),
      firstWasPrecheck: raw.firstWasPrecheck === true,
      precheckBestPct: pct(raw.precheckBestPct)
    };
  }

  /* tiers.js 缺失时的降级校验：只认 1–3 的整数阶级（族 id 不做白名单） */
  function sanitizeTiersFallback(raw) {
    const result = {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return result;
    for (const [familyId, tier] of Object.entries(raw)) {
      const value = Math.floor(Number(tier) || 0);
      if (typeof familyId === 'string' && familyId && value >= 1 && value <= 3) result[familyId] = value;
    }
    return result;
  }

  /* 按字段白名单重建：未知字段（含任何敏感字段）一律丢弃，非法值回退默认值。
   *
   * v4.3（交接 A2）：区分两种读档口径——
   *   严格模式（默认，显式导入 / previewImport 用）：任何非法内容都拒绝整份档案，
   *     让用户先看清原因再决定，绝不让半坏的档案静默覆盖本机数据；
   *   宽容模式（options.lenient，自动读取本站已有档案用）：本站自己写出去的档案
   *     因版本演进或个别字段损坏而不完整时，跳过坏的部分、保住已知数据，并把
   *     丢弃内容记进 warnings。未知 lesson id 不再导致整份档案被拒。
   * 两种模式下 schemaVersion 不受支持与“根本不是对象”都仍然拒绝：无法安全猜测
   * 未知版本的字段含义，宽容只会造成静默丢数据。 */
  function sanitizeState(candidate, validLessonIds, options) {
    const lenient = Boolean(options && options.lenient);
    const warnings = [];
    /* 严格模式返回拒绝结果；宽容模式记录 warning 并返回 null（调用处跳过坏块） */
    const reject = error => {
      if (!lenient) return { ok: false, error };
      warnings.push(error);
      return null;
    };
    const allowed = new Set(validLessonIds);
    const state = emptyState();
    if (!candidate || typeof candidate !== 'object') return { ok: false, error: '档案内容不是有效的对象' };
    if (!SUPPORTED_SCHEMA_VERSIONS.includes(candidate.schemaVersion)) {
      return {
        ok: false,
        error: `schemaVersion 必须是 ${SUPPORTED_SCHEMA_VERSIONS.join(' 或 ')}（${SCHEMA_VERSION} 为当前版本，1 会自动迁移），实际是 ${JSON.stringify(candidate.schemaVersion)}`
      };
    }
    /* 旧档案先迁移再走同一套白名单，避免出现两条不同的校验路径 */
    candidate = migrateState(candidate) || candidate;

    if (candidate.lessons !== undefined && (typeof candidate.lessons !== 'object' || candidate.lessons === null || Array.isArray(candidate.lessons))) {
      const rejection = reject('lessons 字段格式不正确（自动读档已忽略该字段）');
      if (rejection) return rejection;
    } else {
      for (const [id, raw] of Object.entries(candidate.lessons || {})) {
        if (!allowed.has(id)) {
          /* v4.3（交接 A2）：宽容模式下未知课程编号只跳过这一条，其余已知
           * 课程的进度原样保留；严格模式（显式导入）仍然整份拒绝。 */
          const rejection = reject(`未知的课程编号：${id}`);
          if (rejection) return rejection;
          continue;
        }
        if (!raw || typeof raw !== 'object') {
          const rejection = reject(`课程 ${id} 的记录格式不正确`);
          if (rejection) return rejection;
          continue;
        }
        const entry = emptyLessonEntry();
        for (const flag of ['started', 'completed', 'needsReview', 'officialCompleted', 'quizCompleted']) {
          entry[flag] = raw[flag] === true;
        }
        entry.activeSeconds = isPositiveNumber(raw.activeSeconds) ? Math.floor(raw.activeSeconds) : 0;
        for (const stamp of ['startedAt', 'lastVisitedAt', 'completedAt', 'officialCompletedAt', 'quizCompletedAt']) {
          entry[stamp] = isIsoText(raw[stamp]) ? raw[stamp] : null;
        }
        state.lessons[id] = entry;
      }
    }

    if (candidate.daily !== undefined && (typeof candidate.daily !== 'object' || candidate.daily === null || Array.isArray(candidate.daily))) {
      const rejection = reject('daily 字段格式不正确（自动读档已忽略该字段）');
      if (rejection) return rejection;
    } else {
      for (const [day, seconds] of Object.entries(candidate.daily || {})) {
        if (!isDayKey(day)) {
          const rejection = reject(`非法的日期键：${day}`);
          if (rejection) return rejection;
          continue;
        }
        if (!isPositiveNumber(seconds)) {
          const rejection = reject(`非法的学习秒数：${day}`);
          if (rejection) return rejection;
          continue;
        }
        state.daily[day] = Math.floor(seconds);
      }
    }

    if (candidate.totalActiveSeconds !== undefined && !isPositiveNumber(candidate.totalActiveSeconds)) {
      const rejection = reject('totalActiveSeconds 非法');
      if (rejection) return rejection;
    }
    state.totalActiveSeconds = isPositiveNumber(candidate.totalActiveSeconds) ? Math.floor(candidate.totalActiveSeconds) : 0;
    if (candidate.xp !== undefined && !isPositiveNumber(candidate.xp)) {
      const rejection = reject('xp 非法');
      if (rejection) return rejection;
    }
    state.xp = isPositiveNumber(candidate.xp) ? Math.floor(candidate.xp) : 0;
    if (candidate.minuteXpAwarded !== undefined && !isPositiveNumber(candidate.minuteXpAwarded)) {
      const rejection = reject('minuteXpAwarded 非法');
      if (rejection) return rejection;
    }
    state.minuteXpAwarded = isPositiveNumber(candidate.minuteXpAwarded) ? Math.floor(candidate.minuteXpAwarded) : 0;

    /* v4.5（交接 Core E2）：celebratedLevel——带合法值就沿用（夹在
     * [1, 当前等级]，手改的垃圾高值不会吞掉之后的升级祝贺）；字段缺失
     * （v4.5 之前的旧档案）则种到当前等级：曲线变化导致的等级升高只
     * 补「已达到等级」状态，不追溯狂发祝贺。新档案 xp=0、当前等级=1，
     * 与 emptyState 默认一致，无需特判。 */
    if (candidate.celebratedLevel !== undefined && !isPositiveNumber(candidate.celebratedLevel)) {
      const rejection = reject('celebratedLevel 非法');
      if (rejection) return rejection;
    }
    state.celebratedLevel = isPositiveNumber(candidate.celebratedLevel)
      ? Math.max(1, Math.min(Math.floor(candidate.celebratedLevel), levelOf(state.xp)))
      : levelOf(state.xp);

    if (candidate.rewardFlags !== undefined && (typeof candidate.rewardFlags !== 'object' || candidate.rewardFlags === null)) {
      const rejection = reject('rewardFlags 字段格式不正确（自动读档已忽略该字段）');
      if (rejection) return rejection;
    } else {
      for (const [key, value] of Object.entries(candidate.rewardFlags || {})) {
        if (value === true) state.rewardFlags[key] = true;
      }
    }

    /* v4.2 叶片字段。coins 夹在 [0, 上限]；coinMinuteAwarded 与已累计秒数对齐
     * （手改档案把它调小不会凭空铸币——分钟块本来就是按真实累计秒数结算的）；
     * coinFlags 只接受布尔 true，与 rewardFlags 同一处理方式。 */
    if (economy) {
      state.coins = economy.normalizeCoins(candidate.coins);
      const earnedBlocks = Math.floor(state.totalActiveSeconds / (economy.MINUTE_BLOCK_SECONDS || 600));
      const claimedBlocks = Math.floor(Number(candidate.coinMinuteAwarded) || 0);
      state.coinMinuteAwarded = Math.max(0, Math.min(claimedBlocks, Math.max(earnedBlocks, 0)));
    }
    if (candidate.coinFlags !== undefined && (typeof candidate.coinFlags !== 'object' || candidate.coinFlags === null)) {
      const rejection = reject('coinFlags 字段格式不正确（自动读档已忽略该字段）');
      if (rejection) return rejection;
    } else {
      for (const [key, value] of Object.entries(candidate.coinFlags || {})) {
        if (value === true) state.coinFlags[key] = true;
      }
    }

    if (candidate.achievements !== undefined && (typeof candidate.achievements !== 'object' || candidate.achievements === null)) {
      const rejection = reject('achievements 字段格式不正确（自动读档已忽略该字段）');
      if (rejection) return rejection;
    } else {
      const knownAchievements = new Set(ACHIEVEMENTS.map(item => item.id));
      for (const [key, value] of Object.entries(candidate.achievements || {})) {
        if (knownAchievements.has(key) && isIsoText(value)) state.achievements[key] = value;
      }
    }

    state.lastLessonId = allowed.has(candidate.lastLessonId) ? candidate.lastLessonId : null;

    /* v4 新增字段。v1 档案没有这两项，emptyState() 的默认值已经补上，
     * 因此旧档案升级后昵称回到“学习者”、头像回到默认、头像框回到基础框，
     * 而 XP / 时长 / 完成状态 / 成就 / rewardFlags 全部原样保留。 */
    if (candidate.profile !== undefined
      && (typeof candidate.profile !== 'object' || candidate.profile === null || Array.isArray(candidate.profile))) {
      const rejection = reject('profile 字段格式不正确（自动读档已忽略该字段）');
      if (rejection) return rejection;
    }
    const rawProfile = (candidate.profile && typeof candidate.profile === 'object' && !Array.isArray(candidate.profile)) ? candidate.profile : {};
    state.profile.nickname = normalizeNickname(rawProfile.nickname);
    state.profile.avatarId = normalizeAvatarId(rawProfile.avatarId);
    /* 非法或超大的头像数据一律丢弃（回落默认头像），不让它污染状态 */
    state.profile.avatarData = normalizeAvatarData(rawProfile.avatarData);
    state.reviewEverMarked = candidate.reviewEverMarked === true;
    /* 装备的框必须已知且已解锁，否则回落默认框。这一步要放在 xp 与 achievements
     * 都就位之后，因为解锁条件依赖它们。 */
    state.profile.equippedFrameId = normalizeFrameId(rawProfile.equippedFrameId, state);

    /* v4.2 外观收藏。purchases 只收布尔 true（购买闩锁，与 rewardFlags 同思路）；
     * companionId / themeId 只做格式校验，具体清单在 companions.js / themes.js，
     * 找不到时 UI 回退默认——与 avatarId 的处理方式一致。 */
    if (candidate.cosmetics !== undefined
      && (typeof candidate.cosmetics !== 'object' || candidate.cosmetics === null || Array.isArray(candidate.cosmetics))) {
      const rejection = reject('cosmetics 字段格式不正确（自动读档已忽略该字段）');
      if (rejection) return rejection;
    }
    const rawCosmetics = (candidate.cosmetics && typeof candidate.cosmetics === 'object' && !Array.isArray(candidate.cosmetics)) ? candidate.cosmetics : {};
    if (rawCosmetics.purchases !== undefined
      && (typeof rawCosmetics.purchases !== 'object' || rawCosmetics.purchases === null)) {
      const rejection = reject('cosmetics.purchases 字段格式不正确（自动读档已忽略该字段）');
      if (rejection) return rejection;
    } else {
      for (const [key, value] of Object.entries(rawCosmetics.purchases || {})) {
        if (value === true) state.cosmetics.purchases[key] = true;
      }
    }
    state.cosmetics.companionId = typeof rawCosmetics.companionId === 'string' && ASSET_ID_PATTERN.test(rawCosmetics.companionId)
      ? rawCosmetics.companionId : DEFAULT_COMPANION_ID;
    state.cosmetics.themeId = typeof rawCosmetics.themeId === 'string' && ASSET_ID_PATTERN.test(rawCosmetics.themeId)
      ? rawCosmetics.themeId : DEFAULT_THEME_ID;
    /* v4.5（交接 D1）：人形装扮四槽。缺省 / null / 非对象 → null（未自定义，
     * 由 UI 按体型给默认）；是对象则走 wardrobe.sanitizeDress 做部件 id 白名单
     * 校验（非法槽回落默认 id），保证档案里只可能出现真实存在的部件。 */
    if (rawCosmetics.companionLook && typeof rawCosmetics.companionLook === 'object'
      && !Array.isArray(rawCosmetics.companionLook)) {
      state.cosmetics.companionLook = wardrobeModule
        ? wardrobeModule.sanitizeDress(rawCosmetics.companionLook)
        : { hair: rawCosmetics.companionLook.hair, outfit: rawCosmetics.companionLook.outfit,
            accessory: rawCosmetics.companionLook.accessory, palette: rawCosmetics.companionLook.palette };
    } else {
      state.cosmetics.companionLook = null;
    }
    /* v4.6：fixed-art 预制皮肤是 schema 4 下的可选增量字段。progress 层只做
     * stable-id 格式白名单；角色是否真的拥有该 skin 由 companion-view 回退。 */
    const rawSkins = rawCosmetics.companionSkins;
    if (rawSkins && typeof rawSkins === 'object' && !Array.isArray(rawSkins)) {
      for (const [companionId, skinId] of Object.entries(rawSkins)) {
        if (ASSET_ID_PATTERN.test(companionId) && typeof skinId === 'string' && ASSET_ID_PATTERN.test(skinId)) {
          state.cosmetics.companionSkins[companionId] = skinId;
        }
      }
    }

    /* v4.2 学习设置。每日目标只接受 10/20/30/45/60 五档，其它值（含旧档案的
     * 缺省）回落默认 20 分钟，避免手改档案塞进 0 分钟或 9999 分钟的目标。 */
    if (candidate.settings !== undefined
      && (typeof candidate.settings !== 'object' || candidate.settings === null || Array.isArray(candidate.settings))) {
      const rejection = reject('settings 字段格式不正确（自动读档已忽略该字段）');
      if (rejection) return rejection;
    }
    const rawSettings = (candidate.settings && typeof candidate.settings === 'object' && !Array.isArray(candidate.settings)) ? candidate.settings : {};
    state.settings.dailyGoalMinutes = DAILY_GOAL_CHOICES.includes(Number(rawSettings.dailyGoalMinutes))
      ? Number(rawSettings.dailyGoalMinutes) : DEFAULT_DAILY_GOAL_MINUTES;
    /* 小奥位置：只接受 {x, y} 正数对，越界值交给 UI 的 clamp 修正（宽容处理，
     * 因为视口大小在档案导出的另一台设备上很可能不同）。 */
    if (rawSettings.companionPos !== null && rawSettings.companionPos !== undefined) {
      if (typeof rawSettings.companionPos !== 'object' || Array.isArray(rawSettings.companionPos)) {
        const rejection = reject('settings.companionPos 字段格式不正确（自动读档已忽略该字段）');
        if (rejection) return rejection;
      } else {
        const x = Number(rawSettings.companionPos.x);
        const y = Number(rawSettings.companionPos.y);
        if (Number.isFinite(x) && x >= 0 && Number.isFinite(y) && y >= 0) {
          state.settings.companionPos = { x: Math.round(x), y: Math.round(y) };
        }
      }
    }
    /* v4.2 界面开关：只有显式 false 才关闭（旧档案缺省 → 全开） */
    for (const key of SETTING_BOOLEAN_KEYS) {
      if (rawSettings[key] === false) state.settings[key] = false;
    }
    /* v4.6：按角色保存昵称。非法 key/value 静默丢弃；默认名不写入增量表。 */
    const rawNicknames = rawSettings.companionNicknames;
    const hasCompanionNicknamesField = Object.prototype.hasOwnProperty.call(rawSettings, 'companionNicknames');
    if (rawNicknames && typeof rawNicknames === 'object' && !Array.isArray(rawNicknames)) {
      for (const [id, value] of Object.entries(rawNicknames)) {
        if (ASSET_ID_PATTERN.test(id) && typeof value === 'string') {
          const normalized = normalizeCompanionName(value);
          if (normalized !== DEFAULT_COMPANION_NAME) state.settings.companionNicknames[id] = normalized;
        }
      }
    }
    state.settings.companionName = normalizeCompanionName(rawSettings.companionName);
    /* 只有真正的旧档案（尚无 per-character 字段）才把 companionName 迁入
     * 当时装备的角色。现代档案有昵称表但当前角色无记录，语义是默认名。 */
    if (!hasCompanionNicknamesField && state.settings.companionName !== DEFAULT_COMPANION_NAME && !state.settings.companionNicknames[state.cosmetics.companionId]) {
      state.settings.companionNicknames[state.cosmetics.companionId] = state.settings.companionName;
    }
    state.settings.companionDisplay = normalizeCompanionDisplay(rawSettings.companionDisplay);
    /* v4.11.5（交接 3.A2）：官方任务节折叠偏好——只有显式 true 才算折叠，
     * 其余（缺省 / 字符串 / 数字等非法值）一律按展开处理。方向与
     * SETTING_BOOLEAN_KEYS 的「只有显式 false 才关」相反：本字段默认展开，
     * 档案损坏或手工乱改时的安全兜底是「内容全部可见」。 */
    state.settings.collapseOfficialTasks = rawSettings.collapseOfficialTasks === true;

    /* v4.2 学习历史：逐条走 history.sanitizeEvent 白名单，坏条目丢弃
     * （历史是尽力而为的流水数据，单条损坏不应让整份档案被拒）；
     * 超出容量上限时保留最新部分。 */
    if (candidate.history !== undefined && !Array.isArray(candidate.history)) {
      const rejection = reject('history 字段格式不正确（自动读档已忽略该字段）');
      if (rejection) return rejection;
    } else if (historyModule) {
      const knownAchievementIds = new Set(ACHIEVEMENTS.map(item => item.id));
      for (const raw of (candidate.history || []).slice(-historyModule.MAX_EVENTS)) {
        const event = historyModule.sanitizeEvent(raw, allowed, knownAchievementIds);
        if (event) state.history.push(event);
      }
    }

    /* ---------- v4.3 新字段（schema 4）：循环成就 / 复习调度 / Boss 纪录 ---------- */
    if (candidate.achievementTiers !== undefined
      && (typeof candidate.achievementTiers !== 'object' || candidate.achievementTiers === null || Array.isArray(candidate.achievementTiers))) {
      const rejection = reject('achievementTiers 字段格式不正确（自动读档已忽略该字段）');
      if (rejection) return rejection;
    } else if (candidate.achievementTiers) {
      /* 族 id 白名单与阶级范围校验在 tiers.js；模块缺失时只做范围校验 */
      state.achievementTiers = tiersModule
        ? tiersModule.sanitizeTiers(candidate.achievementTiers)
        : sanitizeTiersFallback(candidate.achievementTiers);
    }

    if (candidate.reviews !== undefined
      && (typeof candidate.reviews !== 'object' || candidate.reviews === null || Array.isArray(candidate.reviews))) {
      const rejection = reject('reviews 字段格式不正确（自动读档已忽略该字段）');
      if (rejection) return rejection;
    } else {
      /* reviews 是尽力而为的调度数据（与 history 同一理由）：坏条目丢弃，
       * 不让整份档案被拒——丢了一课的复习排期，重新标记就能重建。 */
      for (const [lessonId, raw] of Object.entries(candidate.reviews || {})) {
        if (!allowed.has(lessonId)) continue;
        const entry = sanitizeReviewEntry(raw);
        if (entry) state.reviews[lessonId] = entry;
      }
    }

    if (candidate.bosses !== undefined
      && (typeof candidate.bosses !== 'object' || candidate.bosses === null || Array.isArray(candidate.bosses))) {
      const rejection = reject('bosses 字段格式不正确（自动读档已忽略该字段）');
      if (rejection) return rejection;
    } else {
      /* bosses 同理：坏条目丢弃（Boss 可以重新挑战），不拒绝整份档案 */
      for (const [unitId, raw] of Object.entries(candidate.bosses || {})) {
        if (typeof unitId !== 'string' || !ASSET_ID_PATTERN.test(unitId)) continue;
        const entry = sanitizeBossEntry(raw);
        if (entry) state.bosses[unitId] = entry;
      }
    }

    /* v4.3：宽容模式下把丢弃内容一并返回，供 UI 显示中文告警（交接 A2） */
    return lenient ? { ok: true, state, warnings } : { ok: true, state };
  }

  function parseImport(text, validLessonIds) {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      return { ok: false, error: 'JSON 无法解析' };
    }
    return sanitizeState(parsed, validLessonIds);
  }

  /* v4.3（交接 A2）：自动读取本站已有档案专用入口——宽容模式。
   * 与 parseImport 的唯一区别是坏内容按块跳过并记入 warnings，
   * 已知数据尽量保住；JSON 整体无法解析或 schemaVersion 不受支持仍然失败，
   * 失败处理（不覆盖原存储）在浏览器适配层。 */
  function parseAutoLoad(text, validLessonIds) {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      return { ok: false, error: 'JSON 无法解析' };
    }
    return sanitizeState(parsed, validLessonIds, { lenient: true });
  }

  function exportJson(state, nowIso) {
    return JSON.stringify({
      /* 来源标识跟随公开仓命名空间；导入侧从不校验该字段（sanitizeState 白名单），
       * 因此改名前导出的 app:'odin-foundations-zh' 档案文件仍可正常导入。 */
      app: 'the-odin-project-zh',
      schemaVersion: SCHEMA_VERSION,
      exportedAt: nowIso,
      lessons: state.lessons,
      daily: state.daily,
      totalActiveSeconds: state.totalActiveSeconds,
      xp: state.xp,
      minuteXpAwarded: state.minuteXpAwarded,
      /* v4.5（交接 Core E2）：升级祝贺棘轮随档案走，换设备导入不重复祝贺 */
      celebratedLevel: Math.max(1, Math.floor(Number(state.celebratedLevel) || 1)),
      rewardFlags: state.rewardFlags,
      coins: state.coins,
      coinMinuteAwarded: state.coinMinuteAwarded,
      coinFlags: state.coinFlags,
      achievements: state.achievements,
      lastLessonId: state.lastLessonId,
      reviewEverMarked: state.reviewEverMarked === true,
      /* 头像随档案一起导出/导入，保证 Windows → Mac 手工迁移后仍然是同一张脸。
       * 未上传头像时 avatarData 为 null，只带一个默认头像 id，不存 SVG 内容副本。 */
      profile: profileOf(state),
      /* v4.2：外观收藏（购买记录、小奥形象、主题）随档案一起走 */
      cosmetics: {
        purchases: state.cosmetics ? state.cosmetics.purchases : {},
        companionId: state.cosmetics ? state.cosmetics.companionId : DEFAULT_COMPANION_ID,
        themeId: state.cosmetics ? state.cosmetics.themeId : DEFAULT_THEME_ID,
        /* v4.5（交接 D1）：人形装扮四槽随档案走；null 表示未自定义 */
        companionLook: state.cosmetics && state.cosmetics.companionLook ? state.cosmetics.companionLook : null,
        /* v4.6：fixed-art 预制皮肤按角色随档案走；旧档案缺省为空对象。 */
        companionSkins: state.cosmetics ? state.cosmetics.companionSkins || {} : {}
      },
      /* v4.2：学习设置（每日目标等）随档案一起走 */
      settings: (state.settings ? Object.assign(emptySettings(), state.settings) : emptySettings()),
      /* v4.2：学习历史随档案一起走（容量上限内） */
      history: Array.isArray(state.history) ? state.history.slice(-1000) : [],
      /* v4.3：循环成就阶级 / 复习调度 / Boss 纪录随档案一起走 */
      achievementTiers: state.achievementTiers || {},
      reviews: state.reviews || {},
      bosses: state.bosses || {}
    }, null, 2);
  }

  /* 序列化结果不应包含任何敏感字段名；用于测试与导入白名单的双重保险。 */
  function containsSensitiveKey(text) {
    const lowered = String(text).toLowerCase();
    return SENSITIVE_KEYS.some(key => lowered.includes(key));
  }

  /* file:// 直接打开时不写存储：课程照常可读，进度不做不可靠承诺。 */
  function isPersistentMode(protocol, store) {
    return /^https?:$/.test(String(protocol || '')) && Boolean(store);
  }

  function formatSeconds(totalSeconds) {
    const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours) return `${hours} 小时 ${minutes} 分`;
    if (minutes) return `${minutes} 分钟`;
    return `${seconds} 秒`;
  }

  const Logic = {
    STORAGE_KEY, LEGACY_STORAGE_KEY, SCHEMA_VERSION, SUPPORTED_SCHEMA_VERSIONS,
    IDLE_LIMIT_SECONDS, TICK_MS, SAVE_INTERVAL_MS,
    XP_PER_ACTIVE_MINUTE, XP_FIRST_LESSON_COMPLETE, XP_FIRST_OFFICIAL_COMPLETE, XP_FIRST_QUIZ_COMPLETE,
    READ_COMPLETE_XP, READ_COMPLETE_MIN_SECONDS, settleReadComplete,
    XP_PER_LEVEL, LEVEL_CURVE, STREAK_MIN_DAY_SECONDS, PRECHECK_HIGH_PCT, ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, SENSITIVE_KEYS,
    FRAMES, DEFAULT_FRAME_ID,
    ASSET_ID_PATTERN, DEFAULT_COMPANION_ID, DEFAULT_THEME_ID,
    DEFAULT_COMPANION_NAME, COMPANION_NAME_MAX_LENGTH, COMPANION_DISPLAY_MODES, DEFAULT_COMPANION_DISPLAY,
    normalizeCompanionName, normalizeCompanionDisplay, defaultCompanionNameFor,
    DEFAULT_NICKNAME, NICKNAME_MAX_LENGTH, DEFAULT_AVATAR_ID, AVATAR_ID_PATTERN,
    AVATAR_DATA_MAX_LENGTH, AVATAR_DATA_PATTERN, AVATAR_MAX_EDGE, AVATAR_INPUT_MAX_BYTES, AVATAR_INPUT_TYPES,
    emptyState, emptyLessonEntry, emptyProfile, emptyCosmetics, emptySettings, lessonEntry, dayKeyFromDate, shiftDayKey,
    DAILY_GOAL_CHOICES, DEFAULT_DAILY_GOAL_MINUTES, SETTING_BOOLEAN_KEYS,
    COMPANION_MARGIN, clampCompanionPosition, defaultCompanionPosition,
    levelOf, nextLevelXp, xpForLevel, settleLevelCelebration, computeTick, awardMinuteXp, addActiveSeconds, streakOf,
    markVisited, setLessonFlag, evaluateAchievements, continueLessonId, recentLesson,
    countBy, needsReviewCount, goalProgress, isGoalDone, nextVisibleGoals, nextFrames,
    HEAVY_LESSON_MIN_SECTIONS, HEAVY_LESSON_MIN_KC, isHeavyLesson, heavyLessonList,
    ASSISTANT_TIP_KINDS, remainingText, briefLesson, latestAchievement, assistantTip, assistantBrief,
    normalizeNickname, normalizeAvatarId, normalizeAvatarData, checkAvatarFile,
    isFrameUnlocked, normalizeFrameId, unlockedFrames, profileOf, setProfileField,
    summary, migrateState, sanitizeState, parseImport, parseAutoLoad, exportJson, containsSensitiveKey,
    isPersistentMode, formatSeconds,
    /* v4.3：复习阶梯与 Boss/复习条目的白名单校验（测试直接可测） */
    REVIEW_INTERVALS_DAYS, sanitizeReviewEntry, sanitizeBossEntry,
    /* v4.3（交接 G）：轻量复习调度纯函数 */
    emptyReviewEntry, ensureReviewSchedule, pauseReviewSchedule, completeReview, markStillWeak,
    reviewsDue, nextReviewDue, reviewUpcoming
  };

  /* ===================== 浏览器适配层 ===================== */

  function safeStorage() {
    try {
      const store = window.localStorage;
      const probe = '__odin_probe__';
      store.setItem(probe, '1');
      store.removeItem(probe);
      return store;
    } catch (error) {
      return null;
    }
  }

  const store = typeof window === 'undefined' ? null : safeStorage();
  const persistent = typeof location === 'undefined' ? false : Logic.isPersistentMode(location.protocol, store);
  const guide = typeof window === 'undefined' ? null : window.ODIN_GUIDE;
  const lessons = guide && Array.isArray(guide.lessons) ? guide.lessons : [];
  const lessonIds = lessons.map(lesson => lesson.id);

  let state = emptyState();
  /* v4.3（交接 A2）：自动读档的三种结果都要向 UI 交代清楚——
   *   failed    整份档案读不出来。此时 state 是空档，但 protectStorage 冻结了
   *             对 STORAGE_KEY 的写入：绝不把 emptyState 覆盖到用户原数据上，
   *             原始数据留在存储里等用户显式处理（导入 / 恢复备份 / 重置）。
   *   warnings  宽容模式丢掉了部分坏内容（如未知 lesson id），已知数据已保住；
   *             UI 显示中文告警，用户可以导出核对。
   *   正常      无告警。 */
  const autoLoad = { failed: false, error: null, warnings: [] };
  let protectStorage = false;
  /* 发布准备轮（改名迁移）：档案/备份清单读取的统一回落入口——新 key 优先，
   * 新 key 无值时回落改名前的旧 key。回落是**只读**的：不删除、不改写旧 key；
   * 搬运写入新 key 只发生在启动读档路径（且必须先通过校验）。
   * reloadFromStorage / archiveSnapshotData / readBackups 共用这一个实现，
   * 避免三处各写一遍回落逻辑导致行为漂移。 */
  function readWithLegacyFallback(primaryKey, legacyKey) {
    const text = store.getItem(primaryKey);
    return text ? text : store.getItem(legacyKey);
  }

  if (persistent) {
    try {
      let raw = store.getItem(STORAGE_KEY);
      /* 发布准备轮（改名迁移）：新 key 下没有档案时回落旧 key。旧 key 有内容
       * 且通过既有宽容校验（parseAutoLoad）后，把存储原文搬运写入新 key——
       * 损坏的旧档案不搬运，落入下方既有的“读档失败冻结写入、保护原文”路径。
       * 搬运写原文而不是重新序列化结果：与旧 key 内容逐字节一致，schema 升级
       * 仍由下方“先快照再迁移”的既有流程负责。旧 key 一律保留不删除。 */
      if (!raw) {
        const legacyRaw = store.getItem(LEGACY_STORAGE_KEY);
        if (legacyRaw) {
          const migrationProbe = Logic.parseAutoLoad(legacyRaw, lessonIds);
          if (migrationProbe.ok) {
            try {
              store.setItem(STORAGE_KEY, legacyRaw);
            } catch (error) {
              /* 搬运写入失败（配额满等）不阻断本次读档：本轮照常用旧 key 的
               * 原文加载，下次启动再试搬运。绝不删除旧 key。 */
            }
          }
          raw = legacyRaw;
        }
      }
      if (raw) {
        /* v4.2（交接 §16）：读到旧 schema 档案要先快照再迁移——迁移是不可逆动作，
         * 万一新版有缺陷，用户还能恢复迁移前的原样。
         * v4.3 修复：快照必须存**存储里的原文**。此前 createBackup 快照的是
         * 内存 state，而加载路径调用它时 state 还是 emptyState()，等于把
         * “迁移前快照”写成了空档案，恢复它反而会清空用户数据。 */
        try {
          const versionInStorage = JSON.parse(raw).schemaVersion;
          if (versionInStorage !== SCHEMA_VERSION) createBackup(`schema v${versionInStorage} → v${SCHEMA_VERSION} 迁移前自动快照`, raw);
        } catch (error) { /* 快照失败不阻止正常加载 */ }
        /* v4.3（交接 A2）：自动读取本站已有档案走宽容模式——未知 lesson id
         * 或个别坏字段只丢弃坏的部分，已知数据保留并给出告警；
         * 整份读不出来时冻结写入，绝不覆盖原始数据。 */
        const parsed = Logic.parseAutoLoad(raw, lessonIds);
        if (parsed.ok) {
          state = parsed.state;
          autoLoad.warnings = parsed.warnings || [];
          if (autoLoad.warnings.length && typeof console !== 'undefined' && console.warn) {
            console.warn('[the-odin-project-zh] 自动读档已跳过部分无法识别的内容，已知学习数据已保留：', autoLoad.warnings.join('；'));
          }
        } else {
          autoLoad.failed = true;
          autoLoad.error = parsed.error;
          protectStorage = true;
          if (typeof console !== 'undefined' && console.warn) {
            console.warn('[the-odin-project-zh] 自动读档失败，原始档案数据已保留、不会被覆盖：', parsed.error);
          }
        }
      }
    } catch (error) {
      /* 存储本身读取异常（浏览器策略等）：同样按“失败不覆盖”处理 */
      autoLoad.failed = true;
      autoLoad.error = `读取本地存储时发生异常：${error && error.message ? error.message : error}`;
      protectStorage = true;
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('[the-odin-project-zh] 自动读档失败，原始档案数据已保留、不会被覆盖：', autoLoad.error);
      }
    }
  }

  let currentLessonId = null;
  let achievementListeners = [];
  /* v4.3：循环成就晋升与挑战完成的 UI 回调（与成就提示同一条低干扰通道） */
  let tierListeners = [];
  let challengeListeners = [];
  /* v4.5（交接 Core E2）：升级祝贺回调（同一低干扰通道，合并式一条提示） */
  let levelListeners = [];
  /* v4.5（交接 Core F）：首次读到本课结尾的回调（同一低干扰通道）。
   * 只在持久化模式、真实发放成功后触发；file:// 不发不触发。 */
  let readCompleteListeners = [];

  function nowIso() {
    return new Date().toISOString();
  }

  function todayKey() {
    return Logic.dayKeyFromDate(new Date());
  }

  /* v4.2（交接 §2）：localStorage 写入失败此前是完全静默的——用户在课页勾选
   * 完成、当场看到成就解锁提示，但 save() 因配额满或存储被浏览器策略禁用而失败时，
   * 刷新后一切归零，且界面没有任何解释。现在记录最近一次保存结果，由 UI 显式提示。 */
  let lastSaveFailed = false;

  function save() {
    if (!persistent) return false;
    /* v4.3（交接 A2）：自动读档失败后冻结写入。内存里此时是空档案，
     * 若照常保存会用 emptyState 覆盖用户留在存储里的原始数据——这是
     * “读档失败不得覆盖”红线的最后一道闸。解除条件只有用户显式动作：
     * 成功导入档案、恢复备份或重置进度。 */
    if (protectStorage) return false;
    try {
      store.setItem(STORAGE_KEY, JSON.stringify(state));
      lastSaveFailed = false;
      return true;
    } catch (error) {
      lastSaveFailed = true;
      return false;
    }
  }

  function storageHealth() {
    return {
      persistent,
      saveOk: persistent && !lastSaveFailed && !protectStorage,
      /* v4.3：区分“写不进去”（配额/策略）与“刻意冻结保护原数据”两种状态，
       * UI 的告警文案不同。 */
      protected: protectStorage
    };
  }

  /* v4.3（交接 A2）：自动读档结果，UI 据此显示中文告警。
   * failed=true 时原始数据仍在存储里（protectStorage 冻结了写入）。 */
  function autoLoadInfo() {
    return {
      failed: autoLoad.failed,
      error: autoLoad.error,
      warnings: autoLoad.warnings.slice(),
      protected: protectStorage
    };
  }

  /* ---------- v4.2：本地备份 / 恢复 / 重置（交接 §16、§17） ----------
   * 备份是当前档案的整份快照，存在独立 key 下，只保留最近 5 份（不做无限
   * 版本历史）。高风险动作（schema 迁移、导入、重置、恢复）前自动快照。 */
  /* ---------- v4.2：本地备份 / 恢复 / 重置（交接 §16、§17） ----------
   * 备份是当前档案的整份快照，存在独立 key 下，只保留最近 5 份（不做无限
   * 版本历史）。高风险动作（schema 迁移、导入、重置、恢复）前自动快照。
   * BACKUP_KEY / LEGACY_BACKUP_KEY / BACKUP_KEEP 三个常量已前移到启动读档块
   * 之前声明（迁移前快照的 TDZ 修复，见文件前部注释），本节只含函数。 */

  function readBackups() {
    if (!persistent) return [];
    try {
      const raw = readWithLegacyFallback(BACKUP_KEY, LEGACY_BACKUP_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list.filter(item => item && typeof item.data === 'string' && typeof item.at === 'string') : [];
    } catch (error) {
      return [];
    }
  }

  function writeBackups(list) {
    if (!persistent) return false;
    try {
      store.setItem(BACKUP_KEY, JSON.stringify(list));
      return true;
    } catch (error) {
      return false;
    }
  }

  /* v4.3：dataOverride 供初始加载路径使用——迁移前快照必须存“存储里的原文”，
   * 而不是当时还在 emptyState 的内存副本（原实现的真实缺陷，恢复这种快照
   * 反而会清空用户数据）。不传时快照当前内存状态，语义不变。 */
  function createBackup(reason, dataOverride) {
    if (!persistent) return { ok: false, error: FILE_MODE_ERROR };
    const list = readBackups();
    const data = typeof dataOverride === 'string' ? dataOverride : JSON.stringify(state);
    list.unshift({ at: nowIso(), reason: String(reason || '').slice(0, 80), data });
    while (list.length > BACKUP_KEEP) list.pop();
    if (!writeBackups(list)) return { ok: false, error: '备份写入失败：本地存储不可用或已满。' };
    return { ok: true, at: list[0].at, kept: list.length };
  }

  function listBackups() {
    return readBackups().map((item, index) => ({ index, at: item.at, reason: item.reason, size: item.data.length }));
  }

  /* 恢复前先把当前状态再快照一份（§16：恢复前再次生成当前状态备份）。 */
  /* v4.3（交接 A2）：高风险动作的快照数据——平时快照内存档案（返回 undefined
   * 走 createBackup 默认路径）；读档失败保护期内内存是空档，必须快照存储里的
   * 原文，否则用户的真实数据会随重置/导入/恢复彻底丢失。 */
  function archiveSnapshotData() {
    if (!protectStorage) return undefined;
    try {
      /* 改名迁移期同样适用：损坏的旧 key 档案触发保护时，新 key 还是空的，
       * 快照必须回落到旧 key 的原文，否则重置/导入会把用户仅存的数据丢掉。 */
      return readWithLegacyFallback(STORAGE_KEY, LEGACY_STORAGE_KEY) || undefined;
    } catch (error) {
      return undefined;
    }
  }

  /* v4.3：用户显式修复动作（导入成功 / 恢复备份 / 重置）后解除写入冻结 */
  function clearLoadProtection() {
    protectStorage = false;
    autoLoad.failed = false;
    autoLoad.error = null;
    autoLoad.warnings = [];
  }

  function restoreBackup(index) {
    if (!persistent) return { ok: false, error: FILE_MODE_ERROR };
    const list = readBackups();
    const backup = list[index];
    if (!backup) return { ok: false, error: '没有这份备份。' };
    createBackup('恢复备份前自动快照', archiveSnapshotData());
    const parsed = parseImport(backup.data, lessonIds);
    if (!parsed.ok) return { ok: false, error: `这份备份无法读取：${parsed.error}` };
    state = parsed.state;
    clearLoadProtection();
    afterChange();
    return { ok: true, restoredAt: backup.at };
  }

  /* 重置学习进度（§17）：清空学习数据；昵称 / 头像 / 头像框 / 收藏 / 主题 /
   * 界面设置是个人化配置而不是学习进度，刻意保留。重置前自动快照。 */
  function resetProgress() {
    if (!persistent) return { ok: false, error: FILE_MODE_ERROR };
    createBackup('重置学习进度前自动快照', archiveSnapshotData());
    const kept = {
      profile: state.profile,
      cosmetics: state.cosmetics,
      settings: state.settings
    };
    state = Object.assign(emptyState(), kept);
    clearLoadProtection();
    afterChange();
    return { ok: true };
  }

  /* v4.2（交接 §2.2）：另一个标签页修改了同一份存储时（storage 事件），
   * 本页内存里的 state 还是页面加载时的旧副本，直接重画只会把旧数字再画一遍。
   * 这里从存储重载整份状态，再让 UI 刷新，首页 Dashboard 才会真正跟上
   * 课页刚刚勾选的完成状态。
   * 放弃的本页未保存内容最多是最近一个保存周期（15 秒）内的计时秒数：
   * 触发方是另一个标签页的写入，说明用户此刻在另一个页面上学习，
   * 本页按 idle 规则本来就基本不再累计时长。
   * v4.3（交接 A3）：bfcache 恢复（pageshow persisted）也走这里——同标签页
   * 后退/前进不会触发 storage 事件，只靠跨标签页事件会漏掉这条路径。
   * 重载同样按“自动读取”口径走宽容模式：失败返回 false、内存状态保持不动，
   * 绝不覆盖存储；成功则顺带解除读档失败保护（数据已被另一页修好）。 */
  function reloadFromStorage() {
    if (!persistent) return false;
    try {
      const raw = readWithLegacyFallback(STORAGE_KEY, LEGACY_STORAGE_KEY);
      if (!raw) return false;
      const parsed = Logic.parseAutoLoad(raw, lessonIds);
      if (!parsed.ok) return false;
      state = parsed.state;
      if (protectStorage) clearLoadProtection();
      return true;
    } catch (error) {
      return false;
    }
  }

  function afterChange() {
    const now = nowIso();
    const unlocked = Logic.evaluateAchievements(state, lessons, now, todayKey());
    /* v4.5（交接 Core E2）：升级结算——celebratedLevel 棘轮，一次结算跨多级
     * 也只产生一条 levelUp 事件（UI 合并成一条轻提示，不连弹 Modal）。 */
    const levelUp = Logic.settleLevelCelebration(state);
    /* v4.2：连续学习 7 天的一次性叶片在每次状态变更时结算（幂等闩锁）。 */
    if (economy) {
      const streakCoins = economy.settleStreakCoins(state, todayKey(), Logic.streakOf(state, todayKey()));
      if (streakCoins > 0 && historyModule) historyModule.logEvent(state, 'coin-grant', { amount: streakCoins, zh: '连续学习 7 天' }, now);
    }
    /* v4.2：每日学习目标达成时一次性 +10 叶片（每天最多一次，闩锁在 economy）。
     * afterChange 由保存钩子按周期调用，目标未达成时这里是 0。 */
    if (dailyModule) {
      const goalCoins = dailyModule.settleDailyGoal(state, todayKey(), economy);
      if (goalCoins > 0 && historyModule) historyModule.logEvent(state, 'daily-goal', { amount: goalCoins, zh: '达成每日目标' }, now);
    }
    /* v4.3（交接 D1）：循环成就铜/银/金晋升结算——晋升单向闩锁，
     * 每阶奖励叶片走 coinFlags（重复调用返回空）。晋升是有意义事件，记入历史。 */
    if (tiersModule) {
      const promoted = tiersModule.evaluateTiers(state, lessons, economy);
      promoted.forEach(item => {
        if (historyModule) {
          historyModule.logEvent(state, 'tier-up', { zh: `${item.familyZh} · ${item.tierZh}` }, now);
          if (item.amount > 0) historyModule.logEvent(state, 'coin-grant', { amount: item.amount, zh: `循环成就晋升：${item.familyZh} · ${item.tierZh}` }, now);
        }
      });
      if (promoted.length) tierListeners.forEach(listener => listener(promoted));
    }
    /* v4.3（交接 D2）：每日 / 每周挑战卡结算——每周期最多一次（coinFlags
     * 闩锁内嵌 dayKey / mondayKey），只发叶片不发 XP，错过不惩罚。 */
    if (challengesModule) {
      const settled = challengesModule.settleChallenges(state, todayKey(), lessons, economy);
      settled.forEach(item => {
        if (historyModule) historyModule.logEvent(state, 'coin-grant', { amount: item.amount, zh: `挑战完成：${item.zh}` }, now);
      });
      if (settled.length) challengeListeners.forEach(listener => listener(settled));
    }
    /* v4.2：解锁成就是有意义事件（§10）。 */
    if (historyModule && unlocked.length) {
      unlocked.forEach(id => historyModule.logEvent(state, 'achievement', { achievementId: id }, now));
    }
    /* v4.5（交接 Core E2）：升级同样是有意义事件——一批只记一条（zh 存
     * 「达到 Lv.N」）；旧档案首次载入时 celebratedLevel 已种到当前等级，
     * 不会产生追溯流水。 */
    if (historyModule && levelUp) {
      historyModule.logEvent(state, 'level-up', { zh: `达到 Lv.${levelUp.toLevel}` }, now);
    }
    save();
    if (unlocked.length) achievementListeners.forEach(listener => listener(unlocked));
    if (levelUp) levelListeners.forEach(listener => listener(levelUp));
    return unlocked;
  }

  function startTimer(lessonId) {
    currentLessonId = lessonId || null;
    if (!persistent) return false;
    Logic.markVisited(state, currentLessonId, nowIso(), todayKey());
    afterChange();

    let lastActivity = Date.now();
    let lastTick = Date.now();
    let lastSave = Date.now();
    const markActivity = () => { lastActivity = Date.now(); };
    ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(eventName => {
      document.addEventListener(eventName, markActivity, { passive: true });
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        lastActivity = Date.now();
        lastTick = Date.now();
      }
    });

    window.setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = (now - lastTick) / 1000;
      const idleSeconds = (now - lastActivity) / 1000;
      lastTick = now;
      const counted = Logic.computeTick({
        visible: document.visibilityState === 'visible',
        idleSeconds,
        elapsedSeconds
      });
      if (counted > 0) Logic.addActiveSeconds(state, currentLessonId, counted, todayKey());
      if (now - lastSave >= SAVE_INTERVAL_MS) {
        lastSave = now;
        afterChange();
      }
    }, TICK_MS);

    const finalSave = () => {
      const now = Date.now();
      const counted = Logic.computeTick({
        visible: document.visibilityState === 'visible',
        idleSeconds: (now - lastActivity) / 1000,
        elapsedSeconds: (now - lastTick) / 1000
      });
      lastTick = now;
      if (counted > 0) Logic.addActiveSeconds(state, currentLessonId, counted, todayKey());
      afterChange();
    };
    window.addEventListener('pagehide', finalSave);
    window.addEventListener('beforeunload', finalSave);
    return true;
  }

  function setFlag(field, value, xpAmount) {
    if (!currentLessonId || !persistent) return false;
    Logic.setLessonFlag(state, currentLessonId, field, value, nowIso(), xpAmount);
    afterChange();
    return true;
  }

  function downloadArchive() {
    const text = Logic.exportJson(state, nowIso());
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `odin-learning-progress-${todayKey()}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    return anchor.download;
  }

  function importArchive(text) {
    const parsed = Logic.parseImport(text, lessonIds);
    if (!parsed.ok) return parsed;
    /* v4.2（交接 §16）：覆盖本机档案是高风险动作，导入前自动快照当前状态。
     * v4.3：读档失败保护期内快照的是存储原文（内存此时是空档）。 */
    createBackup('导入学习档案前自动快照', archiveSnapshotData());
    state = parsed.state;
    /* 显式导入成功 = 用户已经给出一份可读的档案，解除写入冻结 */
    clearLoadProtection();
    afterChange();
    return { ok: true, state };
  }

  /* ---------- 头像上传（v4）：全部在本机完成，不上传网络 ----------
   * 流程：FileReader 读成 data URL → Image 解码 → canvas 居中裁成正方形并缩放
   * → 导出 WebP；浏览器不支持 WebP 时 toDataURL 会忽略类型参数并返回 PNG，
   * 正好就是我们要的降级。结果仍超过大小上限时逐级降质量、再降边长，
   * 都不行就拒绝——绝不把超大原图塞进 localStorage。 */

  function drawAvatar(image, edge, quality) {
    const canvas = document.createElement('canvas');
    canvas.width = edge;
    canvas.height = edge;
    const context = canvas.getContext('2d');
    if (!context) return null;
    const width = image.naturalWidth || image.width || 0;
    const height = image.naturalHeight || image.height || 0;
    if (!width || !height) return null;
    /* 居中裁成正方形（cover），避免非正方形原图被拉伸变形 */
    const source = Math.min(width, height);
    context.drawImage(image, (width - source) / 2, (height - source) / 2, source, source, 0, 0, edge, edge);
    const webp = canvas.toDataURL('image/webp', quality);
    if (String(webp).indexOf('data:image/webp') === 0) return webp;
    return canvas.toDataURL('image/png');
  }

  function renderAvatar(image) {
    const attempts = [
      { edge: AVATAR_MAX_EDGE, quality: 0.85 },
      { edge: AVATAR_MAX_EDGE, quality: 0.7 },
      { edge: AVATAR_MAX_EDGE, quality: 0.55 },
      { edge: 192, quality: 0.6 },
      { edge: 160, quality: 0.5 },
      { edge: 128, quality: 0.45 }
    ];
    for (const attempt of attempts) {
      let dataUrl = null;
      try {
        dataUrl = drawAvatar(image, attempt.edge, attempt.quality);
      } catch (error) {
        dataUrl = null;
      }
      if (dataUrl && dataUrl.length <= AVATAR_DATA_MAX_LENGTH) {
        /* 再过一次白名单：只接受 WebP / PNG data URL，其它一律不入库 */
        const normalized = Logic.normalizeAvatarData(dataUrl);
        if (normalized) return { ok: true, dataUrl: normalized };
      }
    }
    return { ok: false, error: '这张图片压缩到 256×256 之后仍然超过 200 KB，请换一张更简单的图片。' };
  }

  /* 返回 Promise；类型与大小的前置校验是同步的，不合适的文件在读盘之前就被中文说明拒绝。 */
  function encodeAvatarFile(file) {
    const gate = Logic.checkAvatarFile(file);
    if (!gate.ok) return Promise.resolve(gate);
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const image = new Image();
        image.addEventListener('load', () => resolve(renderAvatar(image)));
        image.addEventListener('error', () => {
          resolve({ ok: false, error: '这张图片无法解码，可能已经损坏，请换一张试试。' });
        });
        image.src = String(reader.result || '');
      });
      reader.addEventListener('error', () => {
        resolve({ ok: false, error: '读取文件失败，请重新选择一张图片。' });
      });
      reader.readAsDataURL(file);
    });
  }

  /* ---------- 个人资料写入（v4） ----------
   * file:// 模式下一律拒绝并给出中文原因：与进度勾选框的处理保持一致，
   * 不做“看起来改成功了但其实没保存”的假动作。 */

  const FILE_MODE_ERROR = '当前为直接文件模式，这一项无法保存。请用 start.bat 打开后再修改。';

  function updateProfile(field, value) {
    if (!persistent) return { ok: false, error: FILE_MODE_ERROR };
    if (!Logic.setProfileField(state, field, value)) return { ok: false, error: `未知的资料字段：${field}` };
    afterChange();
    return { ok: true, profile: Logic.profileOf(state) };
  }

  function setAvatarData(dataUrl) {
    /* null 表示清除上传头像、回到默认头像 */
    if (dataUrl === null) return updateProfile('avatarData', null);
    const normalized = Logic.normalizeAvatarData(dataUrl);
    if (!normalized) {
      return { ok: false, error: '头像数据格式不正确：只接受本站生成的 WebP 或 PNG 图片，且大小需在 200 KB 以内。' };
    }
    return updateProfile('avatarData', normalized);
  }

  function equipFrame(frameId) {
    if (!persistent) return { ok: false, error: FILE_MODE_ERROR };
    const frame = Logic.FRAMES.find(item => item.id === frameId);
    if (!frame) return { ok: false, error: '没有这个头像框。' };
    /* §5：未解锁不能装备 */
    if (!Logic.isFrameUnlocked(state, frame)) return { ok: false, error: `「${frame.zh}」还没有解锁：${frame.desc}` };
    state.profile.equippedFrameId = frame.id;
    afterChange();
    return { ok: true, profile: Logic.profileOf(state) };
  }

  /* ---------- v4.2：装扮收藏（交接 §4、§12；v4.3 B1 改名） ----------
   * 解锁与叶片消费的判定规则在 collections.js（纯逻辑，可测）；这里负责
   * 校验资产存在性、调用规则并持久化。所有操作在 file:// 下与其它
   * 个人资料修改一样明确拒绝，不做“看起来成功但其实没保存”的假动作。 */

  const collections = typeof window !== 'undefined' ? window.ODIN_COLLECTIONS || null : null;

  /* ---------- v4.3：章节 Boss 挑战（交接 E3） ----------
   * 题库与评分在 bosses.js（纯数据 + 纯函数）；这里负责校验、记录与持久化。
   * Boss 是综合自测不是小游戏：提交即评分、评分即记录，没有重开一局刷分的
   * 空间（passCount / highCount 同日幂等，attempts 如实累计）。 */
  const bossesModule = typeof window !== 'undefined' ? window.ODIN_BOSSES || null : null;

  function submitBoss(unitId, answers, isPrecheck) {
    if (!persistent) return { ok: false, error: FILE_MODE_ERROR };
    if (!bossesModule) return { ok: false, error: 'Boss 挑战模块未载入。' };
    const boss = bossesModule.bossForUnit(unitId);
    if (!boss) return { ok: false, error: '这个单元没有 Boss 挑战：题目只来自本站已开放讲解的单元。' };
    const result = bossesModule.scoreBoss(boss, answers);
    if (!result) return { ok: false, error: '评分失败：题目数据不完整。' };
    const now = nowIso();
    const recorded = bossesModule.recordAttempt(state, unitId, result, todayKey(), isPrecheck === true);
    /* Boss 挑战是有意义事件（§10 同思路）：一次挑战一条，记分数与评级 */
    if (historyModule) {
      historyModule.logEvent(state, 'boss-attempt', { zh: `${boss.zh} ${result.pct}% · ${result.ratingZh}` }, now);
    }
    afterChange();
    return { ok: true, unitId, result, counts: recorded.counts, entry: recorded.entry };
  }

  function purchaseCosmetic(asset) {
    if (!persistent) return { ok: false, error: FILE_MODE_ERROR };
    if (!collections) return { ok: false, error: '收藏模块未载入，无法解锁。' };
    const result = collections.purchaseAsset(state, asset);
    if (result.ok) {
      /* v4.2：叶片消费记入学习历史（§10；v4.3 展示文案是“用 N 叶片解锁”）。 */
      if (historyModule) {
        historyModule.logEvent(state, 'coin-spend', { assetId: asset.id, amount: collections.assetPrice(asset), zh: asset.zh }, nowIso());
      }
      afterChange();
    }
    return result;
  }

  /* 装备小奥形象 / 切换主题。id 只做格式校验（清单在 companions.js / themes.js），
   * 是否已解锁由 UI 在调用前用 collections.isAssetUnlocked 判定并给出条件说明。 */
  function equipCompanion(companionId) {
    if (!persistent) return { ok: false, error: FILE_MODE_ERROR };
    if (typeof companionId !== 'string' || !Logic.ASSET_ID_PATTERN.test(companionId)) {
      return { ok: false, error: '形象编号格式不正确。' };
    }
    state.cosmetics.companionId = companionId;
    afterChange();
    return { ok: true, companionId };
  }

  function setTheme(themeId) {
    if (!persistent) return { ok: false, error: FILE_MODE_ERROR };
    if (typeof themeId !== 'string' || !Logic.ASSET_ID_PATTERN.test(themeId)) {
      return { ok: false, error: '主题编号格式不正确。' };
    }
    state.cosmetics.themeId = themeId;
    afterChange();
    return { ok: true, themeId };
  }

  window.ODIN_PROGRESS = {
    Logic,
    ACHIEVEMENTS,
    ACHIEVEMENT_CATEGORIES: Logic.ACHIEVEMENT_CATEGORIES,
    FRAMES: Logic.FRAMES,
    isPersistent: () => persistent,
    storageKey: () => STORAGE_KEY,
    /* 发布准备轮（改名迁移）：历史 key 只读暴露，供测试与诊断核对迁移行为 */
    legacyStorageKey: () => LEGACY_STORAGE_KEY,
    /* v4.2：保存失败不再静默，UI 据此向用户显示中文警告（交接 §2） */
    storageHealth,
    /* v4.3（交接 A2）：自动读档结果——failed（已冻结写入保护原数据）与
     * warnings（宽容模式丢弃的坏内容），UI 据此显示中文告警 */
    autoLoadInfo,
    /* v4.2：跨标签页同步——另一页写入存储后，本页用它重载内存状态（§2.2）；
     * v4.3：bfcache 恢复（pageshow persisted）同样用它（交接 A3） */
    reloadFromStorage,
    getState: () => state,
    summary: () => Logic.summary(state, lessons, todayKey()),
    lessonState: lessonId => state.lessons[lessonId] || Logic.emptyLessonEntry(),
    todayKey,
    formatSeconds: Logic.formatSeconds,
    startTimer,
    markVisited: lessonId => {
      if (!persistent) return false;
      Logic.markVisited(state, lessonId, nowIso(), todayKey());
      afterChange();
      return true;
    },
    setCompleted: value => setFlag('completed', value, Logic.XP_FIRST_LESSON_COMPLETE),
    setOfficialCompleted: value => setFlag('officialCompleted', value, Logic.XP_FIRST_OFFICIAL_COMPLETE),
    setQuizCompleted: value => setFlag('quizCompleted', value, Logic.XP_FIRST_QUIZ_COMPLETE),
    setNeedsReview: value => setFlag('needsReview', value, 0),
    /* v4.5（交接 Core F）：首次有效读到本课结尾的结算入口。只在持久化模式生效；
     * file:// 直接返回 { ok:false, reason:'file-mode' }，不写状态、不发奖励、不触发回调。
     * reachedEnd 由 UI 判定（阅读位置到 100%），sessionSeconds 是本次会话有效阅读秒数
     * （UI 侧 idle-aware 计数）。真实发放（rewardFlags.read:<id> 终身一次）后才 afterChange
     * 持久化并触发 onReadComplete 回调；重复 / 未达时长 / 未到结尾都安全返回 ok:false。 */
    settleReadComplete: (sessionSeconds, reachedEnd) => {
      if (!persistent) return { ok: false, reason: 'file-mode' };
      if (!currentLessonId) return { ok: false, reason: 'no-lesson' };
      const result = Logic.settleReadComplete(state, currentLessonId, sessionSeconds, reachedEnd !== false, nowIso());
      if (result.ok) {
        afterChange();
        readCompleteListeners.forEach(listener => listener(result));
      }
      return result;
    },
    onReadComplete: listener => { readCompleteListeners.push(listener); },
    readCompleteMinSeconds: () => Logic.READ_COMPLETE_MIN_SECONDS,
    isReadCompleteAwarded: lessonId => Boolean(state.rewardFlags[`read:${lessonId || currentLessonId}`]),
    /* ---------- v4.3 新增：轻量复习调度（交接 G） ----------
     * 完成复习推进 1/3/7/30 阶梯（同一课同日幂等）；“仍不熟”回到最短间隔；
     * 到期清单供首页“今天有 N 课建议复习”。逾期不惩罚。 */
    completeReview: lessonId => {
      if (!persistent) return { ok: false, error: FILE_MODE_ERROR };
      const result = Logic.completeReview(state, lessonId, todayKey(), nowIso());
      if (result.ok) afterChange();
      return result;
    },
    markStillWeak: lessonId => {
      if (!persistent) return { ok: false, error: FILE_MODE_ERROR };
      const result = Logic.markStillWeak(state, lessonId, todayKey());
      if (result.ok) afterChange();
      return result;
    },
    reviewDueList: () => Logic.reviewsDue(state, todayKey()),
    nextReviewDue: () => Logic.nextReviewDue(state, todayKey()),
    reviewUpcomingList: limit => Logic.reviewUpcoming(state, todayKey(), limit),
    reviewSchedule: lessonId => (state.reviews || {})[lessonId] || null,
    reviewIntervalDays: () => Logic.REVIEW_INTERVALS_DAYS.slice(),
    /* v4.2：叶片消费入口（装扮收藏系统使用）。校验与扣减在 economy.js，
     * 这里负责持久化；失败时不写存储。 */
    spendCoins: amount => {
      if (!persistent) return { ok: false, error: FILE_MODE_ERROR };
      if (!economy) return { ok: false, error: '叶片模块未载入，无法消费。' };
      const result = economy.spendCoins(state, amount);
      if (result.ok) afterChange();
      return result;
    },
    /* 叶片规则表：UI 的说明文字与收藏柜价格说明引用同一张表，避免两处漂移 */
    coinRules: () => (economy ? economy.COIN_RULES : []),
    onAchievement: listener => { achievementListeners.push(listener); },
    /* ---------- v4.3 新增：循环成就（铜/银/金）与挑战卡（交接 D1/D2） ----------
     * tiersBrief / challengesBrief 都是确定性推导（tiers.js / challenges.js），
     * UI 只渲染不自己算；onTierUp / onChallenge 供低干扰提示（与成就提示同通道）。 */
    tiersBrief: () => (tiersModule ? tiersModule.tiersBrief(state, lessons) : []),
    tierFamilies: () => (tiersModule ? tiersModule.TIER_FAMILIES : []),
    challengesBrief: () => (challengesModule ? challengesModule.challengesBrief(state, todayKey(), lessons) : null),
    onTierUp: listener => { tierListeners.push(listener); },
    onChallenge: listener => { challengeListeners.push(listener); },
    /* v4.5（交接 Core E2）：升级事件回调 { fromLevel, toLevel }——UI 合并成
     * 一条「升级 + 新解锁」轻提示；celebratedLevel 棘轮保证不重复触发。 */
    onLevelUp: listener => { levelListeners.push(listener); },
    /* ---------- v4.3 新增：章节 Boss 挑战（交接 E3） ---------- */
    submitBoss,
    bossBrief: unitId => (bossesModule ? bossesModule.bossBrief(state, unitId) : null),
    bosses: () => Object.assign({}, state.bosses || {}),
    exportArchive: () => Logic.exportJson(state, nowIso()),
    /* 只校验不写入：导入前先用它检查档案是否合法，再向用户确认覆盖。 */
    previewImport: text => Logic.parseImport(text, lessonIds),
    downloadArchive,
    importArchive,
    /* ---------- v4 新增：个人资料 / 头像 / 头像框 / 目标提示 ---------- */
    profile: () => Logic.profileOf(state),
    /* 带上解锁状态，UI 据此决定能否装备（未解锁只展示条件，不给装备按钮） */
    frames: () => Logic.FRAMES.map(frame => Object.assign({}, frame, { unlocked: Logic.isFrameUnlocked(state, frame) })),
    nextGoals: limit => Logic.nextVisibleGoals(state, lessons, todayKey(), limit),
    nextFrames: limit => Logic.nextFrames(state, lessons, todayKey(), limit),
    goalProgress: goal => Logic.goalProgress(state, goal, lessons, todayKey()),
    /* ---------- v4 新增：学习助手「小奥」 ----------
     * 返回的是一个普通对象，里面全部由确定性规则算出；不联网、不调模型、
     * 也不接受任何自由文本输入（§10）。 */
    assistantBrief: options => Logic.assistantBrief(state, lessons, todayKey(), options),
    setNickname: value => updateProfile('nickname', value),
    setAvatarId: value => updateProfile('avatarId', value),
    setAvatarData,
    clearAvatarData: () => setAvatarData(null),
    encodeAvatarFile,
    equipFrame,
    /* ---------- v4.2 新增：装扮收藏 ---------- */
    cosmetics: () => (state.cosmetics ? {
      purchases: Object.assign({}, state.cosmetics.purchases),
      companionId: state.cosmetics.companionId,
      themeId: state.cosmetics.themeId,
      companionLook: state.cosmetics.companionLook ? Object.assign({}, state.cosmetics.companionLook) : null,
      companionSkins: Object.assign({}, state.cosmetics.companionSkins || {})
    } : Logic.emptyCosmetics()),
    purchaseCosmetic,
    equipCompanion,
    setTheme,
    /* ---------- v4.5（交接 D1/D2）：人形装扮四槽 ----------
     * 一次设置一个槽（part = hair / outfit / accessory / palette），id 走
     * wardrobe 白名单校验；非法槽或非法 id 拒绝，不污染档案。只存部件 id。
     * file:// 下拒绝写入（与其它装扮一致），但返回清洗后的值供 UI 即时预览。 */
    setCompanionLook: (part, id) => {
      if (!wardrobeModule || !wardrobeModule.DRESS_SLOTS.includes(part)) {
        return { ok: false, error: `未知的装扮槽：${part}` };
      }
      const current = state.cosmetics.companionLook
        ? Object.assign({}, state.cosmetics.companionLook)
        : Object.assign({}, wardrobeModule.DEFAULT_DRESS);
      const candidate = Object.assign({}, current, { [part]: id });
      const cleaned = wardrobeModule.sanitizeDress(candidate);
      if (cleaned[part] !== id) {
        return { ok: false, error: `「${id}」不是有效的${part}部件。` };
      }
      if (!persistent) return { ok: false, error: FILE_MODE_ERROR, companionLook: cleaned };
      state.cosmetics.companionLook = cleaned;
      afterChange();
      return { ok: true, companionLook: Object.assign({}, cleaned) };
    },
    /* 便捷读取：当前已存的人形装扮四槽；未自定义时返回 null，由 UI 按装备的
     * 人形体型（companion.bust）调 wardrobe.defaultDressFor 给协调默认。 */
    companionLook: () => {
      const stored = state.cosmetics ? state.cosmetics.companionLook : null;
      return stored ? Object.assign({}, stored) : null;
    },
    /* v4.6：fixed-art preset skin 与 procedural wardrobe 分离。这里不复制
     * registry 清单，只保存公共门面已经确认存在的 companionId / skinId。 */
    setCompanionSkin: (companionId, skinId) => {
      if (typeof companionId !== 'string' || !Logic.ASSET_ID_PATTERN.test(companionId)) {
        return { ok: false, error: '学习伙伴 id 格式不正确。' };
      }
      if (typeof skinId !== 'string' || !Logic.ASSET_ID_PATTERN.test(skinId)) {
        return { ok: false, error: '预制皮肤 id 格式不正确。' };
      }
      if (!persistent) return { ok: false, error: FILE_MODE_ERROR };
      state.cosmetics.companionSkins[companionId] = skinId;
      afterChange();
      return { ok: true, companionId, skinId };
    },
    companionSkin: companionId => {
      if (!state.cosmetics || !state.cosmetics.companionSkins) return null;
      return state.cosmetics.companionSkins[companionId] || null;
    },
    /* ---------- v4.2 新增：每日 / 每周学习系统 ---------- */
    settings: () => (state.settings ? Object.assign({}, state.settings) : Logic.emptySettings()),
    setDailyGoal: minutes => {
      if (!persistent) return { ok: false, error: FILE_MODE_ERROR };
      if (!Logic.DAILY_GOAL_CHOICES.includes(Number(minutes))) {
        return { ok: false, error: `每日目标只能是 ${Logic.DAILY_GOAL_CHOICES.join(' / ')} 分钟。` };
      }
      state.settings.dailyGoalMinutes = Number(minutes);
      afterChange();
      return { ok: true, dailyGoalMinutes: state.settings.dailyGoalMinutes };
    },
    dailyBrief: () => (dailyModule ? dailyModule.dailyBrief(state, lessons, todayKey()) : null),
    weeklyBrief: () => (dailyModule ? dailyModule.weeklyBrief(state, lessons, todayKey()) : null),
    dailyGoalChoices: () => Logic.DAILY_GOAL_CHOICES,
    /* ---------- v4.2 新增：学习历史 ---------- */
    historyGrouped: limit => (historyModule ? historyModule.historyGrouped(state, limit) : []),
    historyCount: () => (historyModule ? historyModule.historyCount(state) : 0),
    /* ---------- v4.2 新增：小奥拖动位置（§6.1） ----------
     * 保存的是视口内像素坐标；应用时的 clamp 在 UI 层做（视口大小设备相关）。
     * file:// 下与其它个人设置一样拒绝保存，但拖动本身在内存里仍然生效。 */
    setCompanionPosition: (x, y) => {
      if (!persistent) return { ok: false, error: FILE_MODE_ERROR };
      if (!Number.isFinite(Number(x)) || !Number.isFinite(Number(y))) return { ok: false, error: '位置坐标不合法。' };
      state.settings.companionPos = { x: Math.round(Number(x)), y: Math.round(Number(y)) };
      afterChange();
      return { ok: true, companionPos: state.settings.companionPos };
    },
    resetCompanionPosition: () => {
      if (!persistent) return { ok: false, error: FILE_MODE_ERROR };
      state.settings.companionPos = null;
      afterChange();
      return { ok: true };
    },
    /* ---------- v4.5（交接 C1/C2）：学习伙伴昵称与显示模式 ----------
     * 与位置一样：只有持久化模式才写入；file:// 下返回错误，UI 据此提示，
     * 但内存里的当前会话仍即时生效（settings() 读的是内存 state）。
     * 昵称走 normalizeCompanionName 清洗；空/非法清洗为默认值后按「恢复角色
     * 默认名」处理（删除 per-character 记录，显示层经 defaultCompanionNameFor
     * 按角色回落——默认角色 nono 回「小诺」，退役 sprout 同回「小诺」，
     * 其余角色回各自登记名）。 */
    setCompanionName: value => {
      const cleaned = Logic.normalizeCompanionName(value);
      if (!persistent) return { ok: false, error: FILE_MODE_ERROR, companionName: cleaned };
      state.settings.companionName = cleaned;
      const id = state.cosmetics && state.cosmetics.companionId;
      if (id && cleaned !== Logic.DEFAULT_COMPANION_NAME) state.settings.companionNicknames[id] = cleaned;
      else if (id) delete state.settings.companionNicknames[id];
      afterChange();
      return { ok: true, companionName: cleaned };
    },
    resetCompanionName: () => {
      const id = state.cosmetics && state.cosmetics.companionId;
      if (!persistent) return { ok: false, error: FILE_MODE_ERROR };
      if (id) delete state.settings.companionNicknames[id];
      state.settings.companionName = Logic.DEFAULT_COMPANION_NAME;
      afterChange();
      return { ok: true, companionName: Logic.DEFAULT_COMPANION_NAME };
    },
    setCompanionDisplay: mode => {
      const normalized = Logic.normalizeCompanionDisplay(mode);
      if (!persistent) return { ok: false, error: FILE_MODE_ERROR, companionDisplay: normalized };
      state.settings.companionDisplay = normalized;
      afterChange();
      return { ok: true, companionDisplay: normalized };
    },
    /* ---------- v4.11.5（交接 3.A2）：官方任务节折叠偏好 ----------
     * 专用 API，不走 setSetting：SETTING_BOOLEAN_KEYS 白名单要求「每键默认
     * true、只有显式 false 才关」（tests/settings.test.cjs 钉住），本字段
     * 默认 false（展开）、只有显式 true 才折叠，语义相反不能混用。
     * 任何非 true 的入参都按 false（展开）落库——与读档校验同一口径。
     * file:// 非持久化时返回 FILE_MODE_ERROR，课页折叠按钮的当页交互不受
     * 影响（DOM 状态独立于档案），与既有 FILE_MODE_NOTE 口径一致。 */
    setOfficialTasksCollapsed: collapsed => {
      const normalized = collapsed === true;
      if (!persistent) return { ok: false, error: FILE_MODE_ERROR, collapseOfficialTasks: normalized };
      state.settings.collapseOfficialTasks = normalized;
      afterChange();
      return { ok: true, collapseOfficialTasks: normalized };
    },
    /* 便捷读取：学习伙伴的昵称与显示模式（UI 多处用，集中一处口径）。
     * progress 缺失或 settings 为空时回落默认值，永不返回 undefined。 */
    companionIdentity: () => {
      const s = state.settings || Logic.emptySettings();
      const id = state.cosmetics && state.cosmetics.companionId;
      const named = s.companionNicknames && s.companionNicknames[id];
      return {
        /* companionName 只保留给旧档案迁移；sanitize 已把它归入读档时的
         * 当前角色。运行中切换到没有专属记录的角色必须回到「该角色自己的」
         * 默认名（nono → 小诺，退役 sprout → 小诺，其余 → 登记名），既不继承
         * 上一个角色的昵称，也不把全局默认名带到其他角色（名称泄漏根因修复）。 */
        name: named ? Logic.normalizeCompanionName(named) : Logic.defaultCompanionNameFor(id),
        display: Logic.normalizeCompanionDisplay(s.companionDisplay)
      };
    },
    /* ---------- v4.2 新增：学习设置（§15） ---------- */
    setSetting: (key, value) => {
      if (!persistent) return { ok: false, error: FILE_MODE_ERROR };
      if (!SETTING_BOOLEAN_KEYS.includes(key)) return { ok: false, error: `未知的设置项：${key}` };
      state.settings[key] = value !== false;
      afterChange();
      return { ok: true, settings: Object.assign({}, state.settings) };
    },
    /* ---------- v4.2 新增：备份 / 恢复 / 重置（§16、§17） ---------- */
    createBackup,
    listBackups,
    restoreBackup,
    resetProgress,
    backupKeepCount: () => BACKUP_KEEP
  };
})();
