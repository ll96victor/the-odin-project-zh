/* 学习进度模块逻辑测试（对应 v3 交接 §4 的第 2–10、14、15 项）。
 * progress.js 的纯逻辑层不依赖 DOM 与 localStorage，因此可以在 Node 的 vm 沙箱中直接验证：
 * schema、XP 不可重复领取、撤销不刷 XP、streak、计时 idle 暂停、导入校验、导出、
 * 非法课程编号拒绝、file:// 回退、命名空间 key 与敏感字段防护。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'lessons.js'), 'utf8'), sandbox);
vm.runInNewContext(fs.readFileSync(path.join(root, 'progress.js'), 'utf8'), sandbox);

const progress = sandbox.window.ODIN_PROGRESS;
assert.ok(progress && progress.Logic, 'progress.js 应暴露 window.ODIN_PROGRESS.Logic');
const Logic = progress.Logic;
/* lessons 从沙箱复制一份到当前 realm：progress.js 在 vm 沙箱中运行，
 * 直接比较沙箱返回的数组会因 Array.prototype 不同而让 deepStrictEqual 误判失败。 */
const lessons = JSON.parse(JSON.stringify(sandbox.window.ODIN_GUIDE.lessons));
const lessonIds = lessons.map(lesson => lesson.id);
const fresh = () => Logic.emptyState();
let checks = 0;
const check = label => { checks += 1; return label; };
/* 统一把沙箱返回值转成当前 realm 数组后再做深度比较。 */
const local = value => [...value];

/* ---------- 2. progress schema ---------- */
{
  const state = fresh();
  assert.equal(state.schemaVersion, Logic.SCHEMA_VERSION, check('schemaVersion 与模块常量一致'));
  /* v4.2 迁移：schema 从 2 升到 3（新增 coins / coinMinuteAwarded / coinFlags 叶片三字段）。
   * 存储 key 刻意不变，避免让使用者浏览器里已有的真实数据变成孤儿。 */
  assert.equal(state.schemaVersion, 4, check('v4.3 档案 schemaVersion 为 4'));
  assert.deepEqual([...Logic.SUPPORTED_SCHEMA_VERSIONS], [1, 2, 3, 4], check('同时接受 v1 / v2 / v3 / v4 档案'));
  for (const key of ['lessons', 'daily', 'totalActiveSeconds', 'xp', 'minuteXpAwarded', 'rewardFlags', 'achievements', 'lastLessonId', 'profile', 'reviewEverMarked']) {
    assert.ok(key in state, check(`schema 含字段 ${key}`));
  }
  for (const key of ['nickname', 'avatarId', 'avatarData', 'equippedFrameId']) {
    assert.ok(key in state.profile, check(`profile 含字段 ${key}`));
  }
  const entry = Logic.emptyLessonEntry();
  for (const key of ['started', 'completed', 'needsReview', 'officialCompleted', 'quizCompleted', 'activeSeconds', 'startedAt', 'lastVisitedAt', 'completedAt']) {
    assert.ok(key in entry, check(`每课记录含字段 ${key}`));
  }
  // 交接 §2.2 要求命名字段齐全：daily 有效学习秒数、累计秒数、XP、一次性奖励标记、成就与解锁时间
  Logic.markVisited(state, lessonIds[0], '2026-09-10T09:00:00.000Z', '2026-09-10');
  Logic.addActiveSeconds(state, lessonIds[0], 30, '2026-09-10');
  assert.equal(state.lessons[lessonIds[0]].activeSeconds, 30, check('每课 activeSeconds 累计'));
  assert.equal(state.daily['2026-09-10'], 30, check('daily 有效学习秒数'));
  assert.equal(state.totalActiveSeconds, 30, check('totalActiveSeconds'));
  assert.equal(state.lessons[lessonIds[0]].startedAt, '2026-09-10T09:00:00.000Z', check('startedAt 记录'));
  assert.equal(state.lessons[lessonIds[0]].lastVisitedAt, '2026-09-10T09:00:00.000Z', check('lastVisitedAt 记录'));
}

/* ---------- 3. XP 不可重复领取 ---------- */
{
  const state = fresh();
  const id = lessonIds[0];
  Logic.setLessonFlag(state, id, 'completed', true, '2026-09-10T09:00:00.000Z', Logic.XP_FIRST_LESSON_COMPLETE);
  assert.equal(state.xp, 40, check('第一次完成一课 +40 XP'));
  Logic.setLessonFlag(state, id, 'completed', true, '2026-09-10T09:01:00.000Z', Logic.XP_FIRST_LESSON_COMPLETE);
  assert.equal(state.xp, 40, check('重复勾选不重复发 XP'));

  Logic.setLessonFlag(state, id, 'officialCompleted', true, '2026-09-10T09:02:00.000Z', Logic.XP_FIRST_OFFICIAL_COMPLETE);
  assert.equal(state.xp, 60, check('第一次标记官方任务完成 +20 XP'));
  Logic.setLessonFlag(state, id, 'officialCompleted', true, '2026-09-10T09:03:00.000Z', Logic.XP_FIRST_OFFICIAL_COMPLETE);
  assert.equal(state.xp, 60, check('官方任务重复勾选不重复发 XP'));

  Logic.setLessonFlag(state, id, 'quizCompleted', true, '2026-09-10T09:04:00.000Z', Logic.XP_FIRST_QUIZ_COMPLETE);
  assert.equal(state.xp, 70, check('第一次标记自测完成 +10 XP'));
  Logic.setLessonFlag(state, id, 'quizCompleted', true, '2026-09-10T09:05:00.000Z', Logic.XP_FIRST_QUIZ_COMPLETE);
  assert.equal(state.xp, 70, check('自测重复勾选不重复发 XP'));

  // 分钟 XP：按累计总秒数发放，重复调用幂等
  const before = state.xp;
  Logic.addActiveSeconds(state, id, 60, '2026-09-10');
  assert.equal(state.xp, before + 1, check('有效学习满 1 分钟 +1 XP'));
  const afterMinute = state.xp;
  Logic.awardMinuteXp(state);
  Logic.awardMinuteXp(state);
  assert.equal(state.xp, afterMinute, check('分钟 XP 重复结算不重复发放'));
  Logic.addActiveSeconds(state, id, 30, '2026-09-10');
  assert.equal(state.xp, afterMinute, check('未满下一分钟不发 XP'));
  Logic.addActiveSeconds(state, id, 30, '2026-09-10');
  assert.equal(state.xp, afterMinute + 1, check('累计满第二分钟再 +1 XP'));

  // needsReview 不发放 XP
  const xpBeforeReview = state.xp;
  Logic.setLessonFlag(state, id, 'needsReview', true, '2026-09-10T09:06:00.000Z', 0);
  assert.equal(state.xp, xpBeforeReview, check('标记需要复习不发 XP'));
}

/* ---------- 4. 撤销完成状态不能刷 XP ---------- */
{
  const state = fresh();
  const id = lessonIds[3];
  Logic.setLessonFlag(state, id, 'completed', true, '2026-09-10T09:00:00.000Z', Logic.XP_FIRST_LESSON_COMPLETE);
  assert.equal(state.xp, 40, check('首次完成得 40 XP'));
  Logic.setLessonFlag(state, id, 'completed', false, '2026-09-10T09:10:00.000Z', Logic.XP_FIRST_LESSON_COMPLETE);
  assert.equal(state.lessons[id].completed, false, check('撤销后状态为未完成'));
  assert.equal(state.lessons[id].completedAt, null, check('撤销后 completedAt 清空'));
  assert.equal(state.xp, 40, check('撤销不扣回已发 XP'));
  for (let round = 0; round < 5; round += 1) {
    Logic.setLessonFlag(state, id, 'completed', true, '2026-09-10T09:20:00.000Z', Logic.XP_FIRST_LESSON_COMPLETE);
    Logic.setLessonFlag(state, id, 'completed', false, '2026-09-10T09:30:00.000Z', Logic.XP_FIRST_LESSON_COMPLETE);
  }
  assert.equal(state.xp, 40, check('反复勾选/撤销 5 轮后 XP 仍为 40，无法刷分'));
  assert.equal(state.rewardFlags[`completed:${id}`], true, check('一次性奖励标记已保存'));
}

/* ---------- 5. streak 计算 ---------- */
{
  const state = fresh();
  const day = '2026-09-10';
  assert.equal(Logic.streakOf(state, day), 0, check('无任何记录时 streak 为 0'));

  state.daily['2026-09-10'] = 600;
  assert.equal(Logic.streakOf(state, '2026-09-10'), 1, check('今天恰好 10 分钟算 1 天'));

  state.daily['2026-09-10'] = 599;
  assert.equal(Logic.streakOf(state, '2026-09-10'), 0, check('今天 9 分 59 秒不算达标'));

  state.daily = { '2026-09-08': 700, '2026-09-09': 900, '2026-09-10': 600 };
  assert.equal(Logic.streakOf(state, '2026-09-10'), 3, check('连续三天达标 streak = 3'));

  state.daily = { '2026-09-08': 700, '2026-09-09': 900 };
  assert.equal(Logic.streakOf(state, '2026-09-10'), 2, check('今天尚未达标时不打断昨天为止的连续记录'));

  state.daily = { '2026-09-08': 700, '2026-09-10': 600 };
  assert.equal(Logic.streakOf(state, '2026-09-10'), 1, check('中间断档则 streak 从断档后重算'));

  state.daily = { '2026-09-04': 600, '2026-09-05': 600, '2026-09-06': 600, '2026-09-07': 600, '2026-09-08': 600, '2026-09-09': 600, '2026-09-10': 600 };
  assert.equal(Logic.streakOf(state, '2026-09-10'), 7, check('连续七天 streak = 7'));

  // 跨月与跨年边界
  assert.equal(Logic.shiftDayKey('2026-03-01', -1), '2026-02-28', check('跨月回退一天'));
  assert.equal(Logic.shiftDayKey('2024-03-01', -1), '2024-02-29', check('闰年跨月回退一天'));
  assert.equal(Logic.shiftDayKey('2026-01-01', -1), '2025-12-31', check('跨年回退一天'));
  state.daily = { '2025-12-31': 600, '2026-01-01': 600 };
  assert.equal(Logic.streakOf(state, '2026-01-01'), 2, check('跨年连续 streak 正确'));
  assert.equal(Logic.streakOf(state, 'not-a-date'), 0, check('非法日期键返回 0'));
}

/* ---------- 6. active timer idle pause ---------- */
{
  assert.equal(Logic.computeTick({ visible: true, idleSeconds: 5, elapsedSeconds: 1 }), 1, check('可见且近期有活动则累计'));
  assert.equal(Logic.computeTick({ visible: false, idleSeconds: 5, elapsedSeconds: 1 }), 0, check('页面不可见时暂停累计'));
  assert.equal(Logic.computeTick({ visible: true, idleSeconds: Logic.IDLE_LIMIT_SECONDS, elapsedSeconds: 1 }), 1, check('空闲恰好到上限仍累计'));
  assert.equal(Logic.computeTick({ visible: true, idleSeconds: Logic.IDLE_LIMIT_SECONDS + 1, elapsedSeconds: 1 }), 0, check('空闲超过 2 分钟则暂停'));
  assert.equal(Logic.computeTick({ visible: true, idleSeconds: 600, elapsedSeconds: 60 }), 0, check('长时间挂机不把整段时间算进去'));
  assert.equal(Logic.computeTick({ visible: true, idleSeconds: 5, elapsedSeconds: 0 }), 0, check('无经过时间不累计'));
  assert.equal(Logic.computeTick({ visible: true, idleSeconds: 5, elapsedSeconds: 1000 }), Logic.IDLE_LIMIT_SECONDS, check('单次 tick 累计不超过空闲上限'));
  assert.equal(Logic.IDLE_LIMIT_SECONDS, 120, check('空闲上限约 2 分钟'));
  assert.equal(Logic.SAVE_INTERVAL_MS, 15000, check('约 15 秒批量保存一次，不每秒写存储'));
  assert.equal(Logic.STREAK_MIN_DAY_SECONDS, 600, check('streak 门槛为每日 10 分钟'));
}

/* ---------- 7 & 8 & 9. 导入校验 / 导出 / 非法课程编号 ---------- */
{
  const state = fresh();
  Logic.markVisited(state, lessonIds[0], '2026-09-10T09:00:00.000Z', '2026-09-10');
  Logic.addActiveSeconds(state, lessonIds[0], 120, '2026-09-10');
  Logic.setLessonFlag(state, lessonIds[0], 'completed', true, '2026-09-10T09:05:00.000Z', Logic.XP_FIRST_LESSON_COMPLETE);
  Logic.evaluateAchievements(state, lessons, '2026-09-10T09:05:00.000Z', '2026-09-10');

  const exported = Logic.exportJson(state, '2026-09-10T10:00:00.000Z');
  const parsedExport = JSON.parse(exported);
  assert.equal(parsedExport.schemaVersion, 4, check('导出含当前 schemaVersion'));
  assert.ok('profile' in parsedExport, check('导出含 profile（头像随档案迁移）'));
  assert.ok('reviewEverMarked' in parsedExport, check('导出含 reviewEverMarked'));
  assert.equal(parsedExport.exportedAt, '2026-09-10T10:00:00.000Z', check('导出含 exportedAt'));
  assert.equal(parsedExport.app, 'the-odin-project-zh', check('导出含来源标识（发布准备轮改名后的新命名空间）'));

  /* 发布准备轮（改名迁移）：导入侧从不校验 app 字段——改名前导出的
   * app:'odin-foundations-zh' 档案文件必须仍可导入（老导出文件兼容）。 */
  const legacyExport = exported.replace('"app": "the-odin-project-zh"', '"app": "odin-foundations-zh"');
  const legacyRoundTrip = Logic.parseImport(legacyExport, lessonIds);
  assert.equal(legacyRoundTrip.ok, true, check('旧命名空间导出的档案仍可导入（app 字段不参与校验）'));
  assert.equal(legacyRoundTrip.state.xp, state.xp, check('旧命名空间档案导入后 XP 一致'));

  const roundTrip = Logic.parseImport(exported, lessonIds);
  assert.equal(roundTrip.ok, true, check('导出的档案可被重新导入'));
  assert.equal(roundTrip.state.xp, state.xp, check('往返后 XP 一致'));
  assert.equal(roundTrip.state.totalActiveSeconds, state.totalActiveSeconds, check('往返后累计时长一致'));
  assert.equal(roundTrip.state.lessons[lessonIds[0]].completed, true, check('往返后完成状态一致'));
  assert.deepEqual(Object.keys(roundTrip.state.achievements), Object.keys(state.achievements), check('往返后成就一致'));

  assert.equal(Logic.parseImport('not json at all', lessonIds).ok, false, check('非 JSON 拒绝导入'));
  assert.equal(Logic.parseImport('{ broken', lessonIds).ok, false, check('残缺 JSON 拒绝导入'));
  assert.equal(Logic.parseImport('[]', lessonIds).error !== undefined, true, check('数组不是合法档案'));
  assert.equal(Logic.parseImport('null', lessonIds).ok, false, check('null 拒绝导入'));

  const badVersion = JSON.parse(exported);
  badVersion.schemaVersion = 99;
  assert.equal(Logic.parseImport(JSON.stringify(badVersion), lessonIds).ok, false, check('schemaVersion 不符拒绝导入'));
  delete badVersion.schemaVersion;
  assert.equal(Logic.parseImport(JSON.stringify(badVersion), lessonIds).ok, false, check('缺少 schemaVersion 拒绝导入'));
  badVersion.schemaVersion = 0;
  assert.equal(Logic.parseImport(JSON.stringify(badVersion), lessonIds).ok, false, check('schemaVersion 0 拒绝导入'));
  badVersion.schemaVersion = '2';
  assert.equal(Logic.parseImport(JSON.stringify(badVersion), lessonIds).ok, false, check('字符串型 schemaVersion 拒绝导入'));

  /* v4 新增（交接 §11）：v1 旧档案必须能被接受并自动迁移，且一个数值都不许丢。
   * 这是本轮最重要的一条断言——使用者已经真实学习过，升级绝不能清空他的进度。 */
  const v1Archive = JSON.parse(exported);
  v1Archive.schemaVersion = 1;
  delete v1Archive.profile;
  delete v1Archive.reviewEverMarked;
  const migrated = Logic.parseImport(JSON.stringify(v1Archive), lessonIds);
  assert.equal(migrated.ok, true, check('v1 旧档案可以导入'));
  assert.equal(migrated.state.schemaVersion, 4, check('v1 档案导入后自动迁移到 schemaVersion 4'));
  assert.equal(migrated.state.xp, state.xp, check('迁移不丢 XP'));
  assert.equal(migrated.state.totalActiveSeconds, state.totalActiveSeconds, check('迁移不丢累计有效学习时长'));
  assert.equal(migrated.state.minuteXpAwarded, state.minuteXpAwarded, check('迁移不丢分钟 XP 结算位点（否则会重复发 XP）'));
  assert.deepEqual(local(Object.keys(migrated.state.lessons)).sort(), local(Object.keys(state.lessons)).sort(), check('迁移不丢课程记录'));
  assert.equal(migrated.state.lessons[lessonIds[0]].completed, true, check('迁移不丢完成状态'));
  assert.equal(migrated.state.lessons[lessonIds[0]].activeSeconds, state.lessons[lessonIds[0]].activeSeconds, check('迁移不丢单课时长'));
  assert.deepEqual({ ...migrated.state.daily }, { ...state.daily }, check('迁移不丢每日有效学习秒数（streak 依赖它）'));
  assert.deepEqual({ ...migrated.state.rewardFlags }, { ...state.rewardFlags }, check('迁移保留一次性奖励标记，旧奖励不会因成就扩充而重复发放'));
  assert.deepEqual(local(Object.keys(migrated.state.achievements)).sort(), local(Object.keys(state.achievements)).sort(), check('迁移保留已解锁成就'));
  assert.deepEqual({ ...migrated.state.achievements }, { ...state.achievements }, check('迁移保留成就的解锁时间'));
  assert.equal(migrated.state.lastLessonId, state.lastLessonId, check('迁移保留最近学习课程'));
  assert.equal(migrated.state.profile.nickname, '学习者', check('v1 档案迁移后昵称补默认值'));
  assert.equal(migrated.state.profile.avatarId, Logic.DEFAULT_AVATAR_ID, check('v1 档案迁移后头像补默认值'));
  assert.equal(migrated.state.profile.avatarData, null, check('v1 档案迁移后没有上传头像'));
  assert.equal(migrated.state.profile.equippedFrameId, Logic.DEFAULT_FRAME_ID, check('v1 档案迁移后装备默认头像框'));
  assert.equal(migrated.state.reviewEverMarked, false, check('v1 档案迁移后复习闩锁补默认值'));
  /* 迁移后再次导出，应当是明确的 v2 */
  assert.equal(JSON.parse(Logic.exportJson(migrated.state, '2026-09-11T00:00:00.000Z')).schemaVersion, 4, check('迁移后的档案再导出为 v4'));

  /* v4.11.20 第九批：46 课全开后不再有未开放课，反例 id 改用不存在的课程编号
   * 是合法 id，不再能被用来验证「范围外课程编号被拒绝」。 */
  const badLesson = JSON.parse(exported);
  badLesson.lessons['not-a-real-lesson'] = Logic.emptyLessonEntry();
  const rejected = Logic.parseImport(JSON.stringify(badLesson), lessonIds);
  assert.equal(rejected.ok, false, check('范围外课程编号 not-a-real-lesson 被拒绝'));
  assert.match(rejected.error, /未知的课程编号/, check('非法课程编号给出明确原因'));

  const badDay = JSON.parse(exported);
  badDay.daily['10/09/2026'] = 60;
  assert.equal(Logic.parseImport(JSON.stringify(badDay), lessonIds).ok, false, check('非法日期键被拒绝'));
  const negativeDay = JSON.parse(exported);
  negativeDay.daily['2026-09-10'] = -500;
  assert.equal(Logic.parseImport(JSON.stringify(negativeDay), lessonIds).ok, false, check('负数学习秒数被拒绝'));
  const badTotal = JSON.parse(exported);
  badTotal.totalActiveSeconds = 'many';
  assert.equal(Logic.parseImport(JSON.stringify(badTotal), lessonIds).ok, false, check('totalActiveSeconds 类型非法被拒绝'));
  const badXp = JSON.parse(exported);
  badXp.xp = Infinity;
  assert.equal(Logic.parseImport(JSON.stringify(badXp), lessonIds).ok, false, check('xp 非有限数被拒绝'));
  const badLessons = JSON.parse(exported);
  badLessons.lessons = [];
  assert.equal(Logic.parseImport(JSON.stringify(badLessons), lessonIds).ok, false, check('lessons 为数组时格式非法'));
  const badEntry = JSON.parse(exported);
  badEntry.lessons[lessonIds[0]] = 'oops';
  assert.equal(Logic.parseImport(JSON.stringify(badEntry), lessonIds).ok, false, check('单课记录非对象时拒绝'));

  // 字段类型宽松修正：布尔字段只接受 true，时间戳非法则回落 null
  const loose = JSON.parse(exported);
  loose.lessons[lessonIds[0]].started = 'yes';
  loose.lessons[lessonIds[0]].startedAt = '昨天';
  loose.lessons[lessonIds[0]].activeSeconds = 12.7;
  const looseResult = Logic.parseImport(JSON.stringify(loose), lessonIds);
  assert.equal(looseResult.ok, true, check('类型可修正的档案仍允许导入'));
  assert.equal(looseResult.state.lessons[lessonIds[0]].started, false, check('非布尔 true 的标记回落为 false'));
  assert.equal(looseResult.state.lessons[lessonIds[0]].startedAt, null, check('非法时间戳回落为 null'));
  assert.equal(looseResult.state.lessons[lessonIds[0]].activeSeconds, 12, check('小数秒数向下取整'));
}

/* ---------- 15. 命名空间 key 与敏感字段防护 ---------- */
{
  assert.equal(Logic.STORAGE_KEY, 'the-odin-project-zh.progress.v1', check('使用命名空间 storage key（发布准备轮改为公开仓命名空间）'));
  assert.match(Logic.STORAGE_KEY, /^the-odin-project-zh\.progress\.v\d+$/, check('key 含项目命名空间与版本号'));
  assert.equal(Logic.LEGACY_STORAGE_KEY, 'odin-foundations-zh.progress.v1', check('历史 key 以只读回落身份保留（改名迁移）'));

  const hostile = {
    schemaVersion: 1,
    token: 'ghp_should_never_be_stored',
    password: 'hunter2',
    cookie: 'session=abc',
    githubOAuth: { accessToken: 'x' },
    lessons: {}, daily: {}, totalActiveSeconds: 0, xp: 0, rewardFlags: {}, achievements: {}, lastLessonId: null
  };
  const sanitized = Logic.sanitizeState(hostile, lessonIds);
  assert.equal(sanitized.ok, true, check('含敏感字段的档案按白名单重建'));
  const rebuilt = JSON.stringify(sanitized.state);
  assert.ok(!rebuilt.includes('ghp_should_never_be_stored'), check('重建后不含 token 值'));
  assert.ok(!rebuilt.includes('hunter2'), check('重建后不含密码值'));
  for (const key of ['token', 'password', 'cookie', 'githubOAuth', 'accessToken']) {
    assert.ok(!(key in sanitized.state), check(`重建后丢弃未知字段 ${key}`));
  }
  assert.equal(Logic.containsSensitiveKey(JSON.stringify(hostile)), true, check('敏感字段检测能识别 hostile 档案'));
  assert.equal(Logic.containsSensitiveKey(rebuilt), false, check('重建后的档案不含敏感字段名'));

  const source = fs.readFileSync(path.join(root, 'progress.js'), 'utf8');
  assert.ok(!/\bfetch\(/.test(source), check('progress.js 不使用 fetch'));
  assert.ok(!/XMLHttpRequest/.test(source), check('progress.js 不使用 XMLHttpRequest'));
  assert.ok(!/innerHTML/.test(source), check('progress.js 不使用 innerHTML'));
  const setItemCalls = source.match(/\.setItem\(/g) || [];
  const getItemCalls = source.match(/\.getItem\(/g) || [];
  /* v4.2 后探针 + 正式保存 + 备份写入；发布准备轮（改名迁移）新增一处：
   * 启动读档时把校验通过的旧 key 原文一次性搬运写入新 key */
  assert.equal(setItemCalls.length, 4, check('仅四处 setItem：探针、改名迁移搬运、正式保存与备份写入'));
  /* v4.3 后启动读取 + 重载 + 备份清单 + 保护期原文快照；发布准备轮改为：
   * 启动路径显式两次（新 key 读 + 旧 key 回落读），重载/快照/备份清单三处
   * 统一走 readWithLegacyFallback 助手（内部恰好两次 getItem：新 key 优先 +
   * 旧 key 回落），总字面次数不变仍为四 */
  assert.equal(getItemCalls.length, 4, check('仅四处 getItem 字面调用：启动新 key 读、启动旧 key 回落、助手内新 key 读、助手内旧 key 回落'));
  assert.match(source, /store\.setItem\(STORAGE_KEY/, check('正式写入只使用命名空间 key'));
  assert.match(source, /store\.getItem\(STORAGE_KEY\)/, check('读取只使用命名空间 key'));
  assert.equal((source.match(/removeItem\(/g) || []).length, 1, check('全文件仅探针一处 removeItem：任何档案/备份 key 都不删除（含改名迁移旧 key）'));

  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.ok(!/\bfetch\(|XMLHttpRequest|localStorage|innerHTML/.test(app), check('app.js 仍禁止 fetch / XHR / localStorage / innerHTML'));
}

/* ---------- 10. file:// 回退 ---------- */
{
  assert.equal(Logic.isPersistentMode('file:', {}), false, check('file:// 模式不写存储'));
  assert.equal(Logic.isPersistentMode('http:', {}), true, check('http（localhost）模式可写存储'));
  assert.equal(Logic.isPersistentMode('https:', {}), true, check('https 模式可写存储'));
  assert.equal(Logic.isPersistentMode('http:', null), false, check('存储不可用时即使 http 也不写'));
  assert.equal(Logic.isPersistentMode(undefined, {}), false, check('协议缺失时不写存储'));
  assert.equal(progress.isPersistent(), false, check('Node 沙箱中无 location，模块处于非持久模式'));
}

/* ---------- Level / 成就 / 继续学习 ---------- */
{
  /* v4.5（交接 Core E1）：非线性等级曲线——第一课 +40 XP 必须升 Lv.2，
   * 前 7 级用交接建议表（40/100/180/280/400/550），Lv.8 起因「存量用户
   * 不得降级」硬约束收敛回旧线性门槛（700/800/900，之后 100/级）。
   * 曲线全量性质（单调、不降级、与 collections 同步）在 level-curve.test.cjs。 */
  assert.equal(Logic.levelOf(0), 1, check('0 XP 为 Lv.1'));
  assert.equal(Logic.levelOf(39), 1, check('39 XP 仍为 Lv.1'));
  assert.equal(Logic.levelOf(40), 2, check('40 XP 升 Lv.2（第一课 +40 XP 即升级，交接 E1）'));
  assert.equal(Logic.levelOf(99), 2, check('99 XP 仍为 Lv.2'));
  assert.equal(Logic.levelOf(100), 3, check('100 XP 升 Lv.3'));
  assert.equal(Logic.levelOf(250), 4, check('250 XP 为 Lv.4（门槛 180）'));
  assert.equal(Logic.nextLevelXp(0), 40, check('Lv.1 下一等级需 40 XP'));
  assert.equal(Logic.nextLevelXp(150), 180, check('Lv.3（150 XP）下一等级门槛 180 XP'));
  assert.equal(Logic.xpForLevel(11), 1000, check('Lv.10 以上线性延续：Lv.11 = 1000 XP'));

  const state = fresh();
  assert.deepEqual(local(Logic.evaluateAchievements(state, lessons, '2026-09-10T09:00:00.000Z', '2026-09-10')), [], check('空状态不解锁任何成就'));

  Logic.markVisited(state, lessonIds[0], '2026-09-10T09:00:00.000Z', '2026-09-10');
  const firstUnlock = Logic.evaluateAchievements(state, lessons, '2026-09-10T09:00:01.000Z', '2026-09-10');
  assert.deepEqual(local(firstUnlock), ['first-start', 'first-steps'], check('开始学习第一课解锁“迈出第一步”与 v4.3 早期成就“推开学习之门”（交接 C1）'));
  assert.ok(Logic.ACHIEVEMENTS.some(item => item.id === 'first-start'), check('成就定义含 first-start'));
  assert.equal(typeof state.achievements['first-start'], 'string', check('成就记录解锁时间'));

  assert.equal(Logic.evaluateAchievements(state, lessons, '2026-09-10T09:00:02.000Z', '2026-09-10').length, 0, check('同一成就不重复解锁'));

  Logic.setLessonFlag(state, lessonIds[0], 'completed', true, '2026-09-10T09:10:00.000Z', Logic.XP_FIRST_LESSON_COMPLETE);
  assert.ok(Logic.evaluateAchievements(state, lessons, '2026-09-10T09:10:01.000Z', '2026-09-10').includes('first-lesson'), check('完成第一课解锁对应成就'));

  Logic.addActiveSeconds(state, lessonIds[0], 30 * 60, '2026-09-10');
  assert.ok(Logic.evaluateAchievements(state, lessons, '2026-09-10T09:40:00.000Z', '2026-09-10').includes('active-30m'), check('累计 30 分钟解锁成就'));

  state.daily = { '2026-09-08': 600, '2026-09-09': 600, '2026-09-10': 600 };
  assert.ok(Logic.evaluateAchievements(state, lessons, '2026-09-10T10:00:00.000Z', '2026-09-10').includes('streak-3'), check('连续 3 天解锁成就'));
  state.daily = { '2026-09-04': 600, '2026-09-05': 600, '2026-09-06': 600, '2026-09-07': 600, '2026-09-08': 600, '2026-09-09': 600, '2026-09-10': 600 };
  assert.ok(Logic.evaluateAchievements(state, lessons, '2026-09-10T10:00:00.000Z', '2026-09-10').includes('streak-7'), check('连续 7 天解锁成就'));

  // Introduction 单元 = 前 5 课
  lessons.filter(lesson => lesson.group === 0).forEach(lesson => {
    Logic.setLessonFlag(state, lesson.id, 'completed', true, '2026-09-10T10:00:00.000Z', Logic.XP_FIRST_LESSON_COMPLETE);
  });
  assert.ok(Logic.evaluateAchievements(state, lessons, '2026-09-10T10:00:01.000Z', '2026-09-10').includes('unit-0'), check('完成 Introduction 单元解锁成就'));

  lessons.forEach(lesson => Logic.setLessonFlag(state, lesson.id, 'completed', true, '2026-09-10T11:00:00.000Z', Logic.XP_FIRST_LESSON_COMPLETE));
  const finalUnlock = Logic.evaluateAchievements(state, lessons, '2026-09-10T11:00:01.000Z', '2026-09-10');
  assert.ok(finalUnlock.includes('all-lessons'), check('完成全部 25 课解锁成就'));
  for (const group of [1, 2, 3, 4]) assert.ok(finalUnlock.includes(`unit-${group}`), check(`完成全部课程同时解锁 unit-${group}`));
  // 本轮只累计了 30 分钟，2 小时与 10 小时成就不应被解锁
  const unlockedIds = Object.keys(state.achievements);
  assert.ok(!unlockedIds.includes('active-2h'), check('未达 2 小时不解锁对应成就'));
  assert.ok(!unlockedIds.includes('active-10h'), check('未达 10 小时不解锁对应成就'));
  /* v4 迁移说明：原断言是“已解锁数 = 总数 - 2（两个未达标的时长成就）”，那是针对 v3
   * 的 12 个成就写死的减法。成就扩充到 35 个之后这个减法不再成立，但它的**意图**
   * （成就不许凭空多解锁）必须保留，而且可以保留得更强：直接断言此刻应当解锁的
   * **确切集合**，多一个少一个都算失败。 */
  const EXPECTED_UNLOCKED = [
    'active-15m', 'active-30m',
    'streak-2', 'streak-3', 'streak-5', 'streak-7',
    'first-lesson', 'lessons-3', 'lessons-5', 'lessons-10', 'lessons-15', 'all-lessons',
    'unit-0', 'unit-1', 'unit-2', 'unit-3', 'unit-4', 'unit-5', 'unit-6', 'unit-7',
    'first-start',
    /* v4.3（交接 C1）：进过第一课就会解锁的早期成就 */
    'first-steps',
    /* v4.2 新增三项：完成当时的全部课程解锁 level-5；
     * daily 被替换为 600 秒之前，今日一度累计过 1800 秒，day-30m 在那次求值时合法解锁。
     * v4.11.17：分母 19→23 后 XP 随之提高，本次求值跨过 Lv.10 门槛，level-10 亦合法解锁 */
    'level-5', 'level-10', 'day-30m',
    /* v4.11.3 C3：完成全部课程 = 包含全部大课，两个大课成就合法解锁 */
    'heavy-first', 'heavy-all'
  ];
  assert.deepEqual(local(unlockedIds).sort(), [...EXPECTED_UNLOCKED].sort(), check(`已解锁成就恰好是这 ${EXPECTED_UNLOCKED.length} 个，没有凭空多解锁`));
  assert.equal(unlockedIds.length, EXPECTED_UNLOCKED.length, check('已解锁成就数与预期集合一致'));
  /* 未达标的一律不许解锁：时长只到 30 分钟、streak 只到 7 天、官方任务与自测都没勾过、
   * 复习从没标记过。逐个点名，避免“集合断言通过但原因不对”。 */
  for (const notYet of ['active-1h', 'active-2h', 'active-5h', 'active-10h', 'active-20h', 'active-30h', 'active-50h', 'active-100h',
    'streak-14', 'streak-21', 'streak-30', 'streak-60', 'streak-100', 'official-first', 'official-3', 'official-5', 'official-10', 'official-all',
    'quiz-first', 'quiz-3', 'quiz-5', 'quiz-10', 'quiz-all', 'review-first', 'review-cleared',
    'day-1h', 'day-2h', 'level-20', 'purchase-first', 'purchase-5', 'purchase-10',
    'started-10', 'started-all']) {
    assert.ok(!unlockedIds.includes(notYet), check(`未达标成就不解锁：${notYet}`));
  }
  /* 成就总数按 v4.2 配置断言（交接 §7 要求约 55–65 个；Batch 4 交付 52 + Batch 5 的 3 个每日目标类） */
  /* v4.11.20 第九批：unit-6/unit-7 收组后 67 个，§7 上限同步扩到 70。 */
  assert.ok(Logic.ACHIEVEMENTS.length >= 55 && Logic.ACHIEVEMENTS.length <= 70, check('成就总数落在 §7 要求的 55–70 个之间'));
  assert.equal(Logic.ACHIEVEMENTS.length, 67, check('成就总数与本轮配置一致（67 = v4.3 的 61 + v4.11.3 的 heavy-first / heavy-all + v4.11.17 的 unit-4 + v4.11.19 的 unit-5 + v4.11.20 第九批的 unit-6/unit-7）'));
  /* v3 已有的 12 个 achievement id 必须全部原样保留（交接 §4：避免现有档案失效） */
  const V3_IDS = ['first-start', 'first-lesson', 'active-30m', 'active-2h', 'active-10h',
    'streak-3', 'streak-7', 'unit-0', 'unit-1', 'unit-2', 'unit-3', 'all-lessons'];
  const ALL_IDS = Logic.ACHIEVEMENTS.map(item => item.id);
  for (const required of V3_IDS) assert.ok(ALL_IDS.includes(required), check(`v3 已有成就 id 保留：${required}`));
  assert.equal(new Set(ALL_IDS).size, ALL_IDS.length, check('成就 id 不重复'));

  // 继续学习入口
  const partial = fresh();
  Logic.setLessonFlag(partial, lessonIds[0], 'completed', true, '2026-09-10T09:00:00.000Z', 40);
  Logic.setLessonFlag(partial, lessonIds[1], 'completed', true, '2026-09-10T09:00:00.000Z', 40);
  assert.equal(Logic.continueLessonId(partial, lessons), lessonIds[2], check('继续学习指向第一个未完成课'));
  const done = fresh();
  lessons.forEach(lesson => Logic.setLessonFlag(done, lesson.id, 'completed', true, '2026-09-10T09:00:00.000Z', 40));
  assert.equal(Logic.continueLessonId(done, lessons), lessonIds[lessonIds.length - 1], check('全部完成时继续学习指向最后一课'));

  // 首页面板数据
  const summary = Logic.summary(partial, lessons, '2026-09-10');
  assert.equal(summary.completedCount, 2, check('面板完成课程数'));
  assert.equal(summary.totalLessons, 46, check('面板课程总数'));
  assert.equal(summary.percent, Math.round((2 / 46) * 100), check('面板完成百分比'));
  assert.equal(summary.level, Logic.levelOf(partial.xp), check('面板 Level'));
  assert.equal(summary.xpToNext, Logic.nextLevelXp(partial.xp) - partial.xp, check('面板下一等级所需 XP'));
  assert.equal(summary.achievementTotal, Logic.ACHIEVEMENTS.length, check('面板成就总数'));
}

/* ---------- 时长显示 ---------- */
{
  assert.equal(Logic.formatSeconds(0), '0 秒', check('0 秒显示'));
  assert.equal(Logic.formatSeconds(59), '59 秒', check('不足 1 分钟显示秒'));
  assert.equal(Logic.formatSeconds(60), '1 分钟', check('1 分钟显示'));
  assert.equal(Logic.formatSeconds(600), '10 分钟', check('10 分钟显示'));
  assert.equal(Logic.formatSeconds(3600), '1 小时 0 分', check('1 小时显示'));
  assert.equal(Logic.formatSeconds(7260), '2 小时 1 分', check('多小时显示'));
  assert.equal(Logic.formatSeconds(-5), '0 秒', check('负数按 0 处理'));
}

/* ---------- v4.6：fixed-art skin 是 schema 4 可选字段 ---------- */
{
  const state = fresh();
  assert.deepEqual(Object.keys(state.cosmetics.companionSkins), [], check('旧档案缺 skin 映射时默认空对象'));
  state.cosmetics.companionSkins.mia = 'study';
  const exported = Logic.exportJson(state, '2026-09-13T12:00:00.000Z');
  const parsed = Logic.parseImport(exported, lessonIds);
  assert.equal(parsed.ok, true, check('含 fixed-art skin 的 schema 4 档案可导入'));
  assert.equal(parsed.state.cosmetics.companionSkins.mia, 'study', check('fixed-art skin 导出/导入往返'));

  const dirty = JSON.parse(exported);
  dirty.cosmetics.companionSkins = { mia: '../study', 'bad key': 'study', nono: 'default' };
  const cleaned = Logic.parseImport(JSON.stringify(dirty), lessonIds);
  assert.deepEqual(Object.keys(cleaned.state.cosmetics.companionSkins), ['nono'], check('非法 companion/skin id 被白名单清洗'));
  assert.equal(cleaned.state.cosmetics.companionSkins.nono, 'default', check('合法 skin id 保留'));
}

/* ---------- 21. v4.2：小奥位置的 clamp 与默认位（§6.1、§22 Companion drag） ---------- */
{
  const clamp = Logic.clampCompanionPosition;
  const def = Logic.defaultCompanionPosition;
  /* 基本钳制 */
  let p1 = clamp(500, 400, 1280, 800, 120, 48, 12);
  assert.deepEqual({ x: p1.x, y: p1.y }, { x: 500, y: 400 }, check('视口内的坐标原样保留（取整）'));
  let p2 = clamp(-50, -10, 1280, 800, 120, 48, 12);
  assert.deepEqual({ x: p2.x, y: p2.y }, { x: 12, y: 12 }, check('负坐标钳回最小边距'));
  let p3 = clamp(99999, 99999, 1280, 800, 120, 48, 12);
  assert.deepEqual({ x: p3.x, y: p3.y }, { x: 1280 - 120 - 12, y: 800 - 48 - 12 }, check('越界坐标钳回视口内'));
  /* resize 后视口变小：旧位置仍被拉回 */
  let p4 = clamp(1200, 700, 600, 400, 120, 48, 12);
  assert.ok(p4.x <= 600 - 120 - 12 && p4.y <= 400 - 48 - 12, check('resize 后旧位置不出视口'));
  /* 视口比元素还小：贴到 0（而不是负数），保证按钮永远可见 */
  let p5 = clamp(300, 300, 60, 30, 120, 48, 12);
  assert.deepEqual({ x: p5.x, y: p5.y }, { x: 0, y: 0 }, check('视口小于元素时贴到左上角'));
  /* 非法输入按 0 处理而不是崩溃 */
  let p6 = clamp('abc', null, 1280, 800, 120, 48, 12);
  assert.deepEqual({ x: p6.x, y: p6.y }, { x: 12, y: 12 }, check('非法输入按 0 处理'));
  /* 默认位 = 右下角，且永远在视口内 */
  let d1 = def(1280, 800, 120, 48, 12);
  assert.deepEqual({ x: d1.x, y: d1.y }, { x: 1280 - 120 - 12, y: 800 - 48 - 12 }, check('默认位是右下角'));
  let d2 = def(320, 568, 120, 48, 12);
  assert.ok(d2.x >= 0 && d2.y >= 0 && d2.x + 120 <= 320 && d2.y + 48 <= 568, check('手机视口的默认位也在视口内'));
  /* 档案字段：合法坐标往返，非法丢弃 */
  const base = { schemaVersion: 3, lessons: {}, daily: {}, totalActiveSeconds: 0, xp: 0, minuteXpAwarded: 0, rewardFlags: {}, achievements: {}, lastLessonId: null, coins: 0, coinMinuteAwarded: 0, coinFlags: {}, cosmetics: { purchases: {}, companionId: 'sprout', themeId: 'garden' }, settings: { dailyGoalMinutes: 20 } };
  let r = Logic.parseImport(JSON.stringify(Object.assign({}, base, { settings: { dailyGoalMinutes: 20, companionPos: { x: 300, y: 200 } } })), lessonIds);
  assert.deepEqual({ x: r.state.settings.companionPos.x, y: r.state.settings.companionPos.y }, { x: 300, y: 200 }, check('合法位置随档案往返'));
  r = Logic.parseImport(JSON.stringify(Object.assign({}, base, { settings: { dailyGoalMinutes: 20, companionPos: { x: -5, y: 10 } } })), lessonIds);
  assert.equal(r.state.settings.companionPos, null, check('负坐标丢弃（UI 会按默认位渲染）'));
  r = Logic.parseImport(JSON.stringify(Object.assign({}, base, { settings: { dailyGoalMinutes: 20, companionPos: 'bottom-right' } })), lessonIds);
  assert.equal(r.ok, false, check('非对象位置拒绝整个档案'));
  r = Logic.parseImport(JSON.stringify(Object.assign({}, base, { settings: { dailyGoalMinutes: 20, companionPos: null } })), lessonIds);
  assert.equal(r.state.settings.companionPos, null, check('null 位置合法（默认位）'));
  /* 导出含位置 */
  const state = fresh();
  state.settings.companionPos = { x: 42, y: 24 };
  const exported = Logic.exportJson(state, '2026-09-10T12:00:00.000Z');
  assert.deepEqual(JSON.parse(exported).settings.companionPos, { x: 42, y: 24 }, check('导出含小奥位置'));
}

console.log(`通过：学习进度模块 ${checks} 项逻辑断言（schema、XP 幂等与防刷、streak、计时 idle 暂停、导入校验与非法课程编号拒绝、导出往返、file:// 回退、命名空间 key 与敏感字段防护、Level/成就/继续学习、时长显示）。`);
