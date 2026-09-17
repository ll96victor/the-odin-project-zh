/* 学习助手「小奥」的逻辑测试（v4 交接 §10 + §13 的 Assistant 一节）。
 *
 * §10 的硬要求是：本轮不是 AI 聊天机器人，不接模型 API，不联网，面板里每一条信息与
 * 那唯一一条情境提示都必须由确定性规则算出来。§13 要求测试覆盖“提示由确定性规则生成、
 * 无网络调用、today / streak / review / continue lesson 情况正确”。
 *
 * 所以这里测的不是“文案好不好听”，而是四件可判定的事：
 *   1. 同样的档案 → 逐字相同的输出（确定性）；
 *   2. 求值过程不改动任何状态、不触碰任何存储与网络（只读）；
 *   3. 五条提示规则的优先级与边界数值完全符合 §10 列出的四种情形 + 一个兜底；
 *   4. §10 点名要的九类信息一类都不少，且数值与 summary / nextGoals / nextFrames 一致。
 */
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
const lessons = JSON.parse(JSON.stringify(sandbox.window.ODIN_GUIDE.lessons));
const lessonIds = lessons.map(lesson => lesson.id);
const local = value => [...value];
const fresh = () => Logic.emptyState();
const DAY = '2026-09-10';
const AT = '2026-09-10T09:00:00.000Z';
const MIN = Logic.STREAK_MIN_DAY_SECONDS;

let checks = 0;
const check = label => { checks += 1; return label; };
const brief = (state, options) => Logic.assistantBrief(state, lessons, DAY, options);
/* 造出连续 n 天达标的 daily（含今天） */
const dailyFor = days => {
  const daily = {};
  for (let i = 0; i < days; i += 1) daily[Logic.shiftDayKey(DAY, -i)] = MIN;
  return daily;
};
/* 走真实入口把某一课标记完成，而不是直接改字段：完成状态不应能被凭空推导出来。
 * setLessonFlag 的第 6 个参数是一次性奖励 XP 的额度（不是 dayKey），
 * 照 app.js 适配层的写法传，才能同时验证 rewardFlags 的幂等。 */
const complete = (state, index, dayKey) => {
  const id = lessons[index].id;
  Logic.markVisited(state, id, AT, dayKey || DAY);
  Logic.setLessonFlag(state, id, 'completed', true, AT, Logic.XP_FIRST_LESSON_COMPLETE);
  return id;
};
/* 把 19 课的三个完成标记全部走完：只有这样才能让可见成就与头像框真的全部解锁，
 * 从而验证“没有下一个目标时助手不许编一个假目标出来”。 */
const completeEverything = state => {
  lessons.forEach((lesson, index) => {
    complete(state, index);
    Logic.setLessonFlag(state, lesson.id, 'officialCompleted', true, AT, Logic.XP_FIRST_OFFICIAL_COMPLETE);
    Logic.setLessonFlag(state, lesson.id, 'quizCompleted', true, AT, Logic.XP_FIRST_QUIZ_COMPLETE);
  });
};
/* 复习闩锁是单向的：只能靠“标记过又清空”这个真实路径置位，
 * 直接把 reviewEverMarked 写成 true 会绕开产品行为，测出来的东西不算数。
 * Batch 10（Stretch N5）：满状态 fixture 要解锁隐藏成就「精通的滋味」，
 * 需要 3 课都走过这条真实路径。 */
const exerciseReview = state => {
  [0, 1, 2].forEach(index => {
    Logic.setLessonFlag(state, lessons[index].id, 'needsReview', true, AT, 0);
    Logic.setLessonFlag(state, lessons[index].id, 'needsReview', false, AT, 0);
  });
};

/* ===================== 1. §10 点名要的九类信息一类都不能少 ===================== */
{
  const state = fresh();
  const item = brief(state);
  const required = [
    'todaySeconds', 'todayText',            // ① 今天有效学习多少
    'streak', 'streakDayMinutes',           // ② 当前连续学习天数
    'level', 'xp', 'xpToNext',              // ③ 当前等级 / XP
    'completedCount', 'totalLessons', 'percent', // ④ 当前进度
    'recentLesson',                         // ⑤ 最近学习课程
    'continueLesson',                       // ⑥ 推荐继续哪一课
    'needsReviewCount',                     // ⑦ 有多少课需要复习
    'nextGoal', 'nextFrame',                // ⑧ 距下一个可见成就 / 头像框
    'latestAchievement',                    // ⑨ 最近解锁成就
    'tip'                                   // 那一条情境提示
  ];
  required.forEach(key => assert.ok(key in item, check(`助手信息包含 ${key}`)));
  assert.equal(item.tip.kind, 'today-short', check('空档案的提示是“今天还不足 10 分钟”'));
  assert.equal(item.streakDayMinutes, 10, check('连续学习的一天门槛写成分钟是 10'));
  assert.equal(item.streakDayMinutes * 60, MIN, check('分钟门槛与 STREAK_MIN_DAY_SECONDS 一致'));
  assert.equal(item.recentLesson, null, check('没学过任何课时最近学习为 null'));
  assert.equal(item.latestAchievement, null, check('没解锁任何成就时最近解锁为 null'));
  assert.equal(item.needsReviewCount, 0, check('空档案需要复习为 0'));
  assert.equal(item.completedCount, 0, check('空档案完成数为 0'));
  assert.equal(item.totalLessons, lessons.length, check('已开放课程数等于 lessons.js 的课程数'));
  assert.equal(item.catalogTotal, null, check('没传官方目录总数时 catalogTotal 为 null，不虚构 46 分母'));
  assert.ok(local(Logic.ASSISTANT_TIP_KINDS).includes(item.tip.kind), check('提示 kind 在允许的枚举里'));
  assert.ok(item.tip.text.trim().length > 0, check('提示文字非空'));
}

/* ===================== 2. 确定性：同一份档案永远得到逐字相同的输出 ===================== */
{
  const state = fresh();
  complete(state, 0);
  complete(state, 1);
  Logic.addActiveSeconds(state, lessons[2].id, 900, DAY);
  Logic.setLessonFlag(state, lessons[3].id, 'needsReview', true, AT, DAY);
  Logic.evaluateAchievements(state, lessons, AT, DAY);

  const first = brief(state, { catalogTotal: 46, currentLessonId: lessons[2].id });
  const second = brief(state, { catalogTotal: 46, currentLessonId: lessons[2].id });
  assert.equal(JSON.stringify(first), JSON.stringify(second), check('同样的档案与参数 → 逐字相同的输出'));
  /* 输出里不得出现时间戳、随机数之类会让两次结果不同的东西 */
  assert.ok(!/T\d\d:\d\d/.test(JSON.stringify(first)), check('输出里不含具体时刻，只有日期'));
  const before = JSON.stringify(state);
  brief(state, { catalogTotal: 46, currentLessonId: lessons[2].id });
  assert.equal(JSON.stringify(state), before, check('求值过程不改动任何状态（只读）'));
  assert.equal(first.catalogTotal, 46, check('传入官方目录总数时按 46 显示'));
}

/* ===================== 3. 只读：不联网、不碰存储 ===================== */
{
  const source = fs.readFileSync(path.join(root, 'progress.js'), 'utf8');
  assert.ok(!/\bfetch\(|XMLHttpRequest/.test(source), check('progress.js 没有任何网络调用'));
  assert.ok(!/document\.cookie/.test(source), check('progress.js 不读写 cookie'));
  assert.ok(!/\brequire\(|\bimport\(/.test(source), check('progress.js 不引入任何外部模块'));
  /* 助手逻辑不得写入存储：storage 调用次数必须仍是既有枚举值；
   * v4.2 起 getItem 为 2 处（启动读取 + 跨标签页 reloadFromStorage），都不是助手触发的 */
  /* v4.2 起为 3 处（启动读取 + 跨标签页重载之外，新增备份写入），都不是助手触发的
   * v4.3 起 getItem 为 4 处（新增读档失败保护期的原文快照，交接 A2），仍非助手触发
   * 发布准备轮（改名迁移）起 setItem 为 4 处：新增“旧 key 校验通过后一次性
   * 搬运写入新 key”；getItem 字面仍为 4 处：启动路径显式 2 处（新 key 读 +
   * 旧 key 回落读），重载/保护期快照/备份清单统一走 readWithLegacyFallback
   * 助手（内部恰好 2 处）。全部仍非助手（assistant）触发 */
  assert.equal((source.match(/\.setItem\(/g) || []).length, 4, check('setItem 是 4 处（保存 / 探针 / 改名迁移搬运 / 备份），均非助手触发'));
  assert.equal((source.match(/\.getItem\(/g) || []).length, 4, check('getItem 是 4 处（启动新 key / 启动旧 key 回落 / 助手内新 key / 助手内旧 key），均非助手触发'));
  /* §10：不做自由输入框。助手层不接受任何文本输入参数，只接受 id 与数字 */
  const signature = source.match(/function assistantBrief\(([^)]*)\)/);
  assert.ok(signature, check('assistantBrief 存在'));
  assert.deepEqual(
    signature[1].split(',').map(part => part.trim()),
    ['state', 'lessons', 'todayKey', 'options'],
    check('assistantBrief 只接受状态与选项，不接受任何用户自由文本')
  );
}

/* ===================== 4. 规则一：今天不足 10 分钟 ===================== */
{
  const cases = [
    [0, 10], [1, 10], [59, 10], [60, 9], [300, 5], [540, 1], [599, 1]
  ];
  cases.forEach(([seconds, minutes]) => {
    const state = fresh();
    Logic.addActiveSeconds(state, null, seconds, DAY);
    const item = brief(state);
    assert.equal(item.tip.kind, 'today-short', check(`${seconds} 秒时提示类型是 today-short`));
    assert.equal(item.tip.text, `再学 ${minutes} 分钟，今天就计入连续学习。`, check(`${seconds} 秒 → 还差 ${minutes} 分钟`));
    assert.equal(item.todaySeconds, seconds, check(`${seconds} 秒原样回传`));
  });
  /* 边界：刚好 600 秒就不再催促 */
  const exact = fresh();
  Logic.addActiveSeconds(exact, null, MIN, DAY);
  assert.notEqual(brief(exact).tip.kind, 'today-short', check('刚好 10 分钟时不再提示 today-short'));
  assert.equal(brief(exact).streak, 1, check('刚好 10 分钟就算学习一天'));
  /* 不足门槛的那天不计入连续天数 */
  const shortDay = fresh();
  Logic.addActiveSeconds(shortDay, null, MIN - 1, DAY);
  assert.equal(brief(shortDay).streak, 0, check('差 1 秒不到 10 分钟，连续天数为 0'));
}

/* ===================== 5. 规则二：当前课未收尾（优先级低于今日不足） ===================== */
{
  const state = fresh();
  Logic.markVisited(state, lessons[0].id, AT, DAY);
  Logic.addActiveSeconds(state, lessons[0].id, 1200, DAY);
  const item = brief(state, { currentLessonId: lessons[0].id });
  assert.equal(item.tip.kind, 'finish-current', check('今天已达标且当前课未完成 → 提示先收尾'));
  assert.ok(item.tip.text.includes(lessons[0].zh), check('提示里点出当前课的中文名'));
  assert.equal(item.currentLesson.id, lessons[0].id, check('currentLesson 回传当前课'));
  assert.equal(item.currentLesson.completed, false, check('currentLesson.completed 为 false'));

  /* 当前课已完成，就不该再催 */
  complete(state, 0);
  const done = brief(state, { currentLessonId: lessons[0].id });
  assert.equal(done.currentLesson.completed, true, check('完成后 currentLesson.completed 为 true'));
  assert.notEqual(done.tip.kind, 'finish-current', check('当前课已完成后不再提示收尾'));

  /* 首页没有“当前课” */
  assert.equal(brief(state).currentLesson, null, check('首页不传 currentLessonId 时 currentLesson 为 null'));
  /* 传了一个不存在的 id 也不该炸 */
  assert.equal(brief(state, { currentLessonId: 'no-such-lesson' }).currentLesson, null, check('未知课程 id 安全回落为 null'));
  /* 优先级：今天不足 10 分钟时，即使当前课未完成也先催促今日 */
  const shortButCurrent = fresh();
  Logic.markVisited(shortButCurrent, lessons[0].id, AT, DAY);
  Logic.addActiveSeconds(shortButCurrent, lessons[0].id, 60, DAY);
  assert.equal(brief(shortButCurrent, { currentLessonId: lessons[0].id }).tip.kind, 'today-short', check('今日不足优先于当前课收尾'));
}

/* ===================== 6. 规则三：有需要复习的课 ===================== */
{
  const state = fresh();
  Logic.addActiveSeconds(state, null, 1200, DAY);
  Logic.setLessonFlag(state, lessons[0].id, 'needsReview', true, AT, 0);
  Logic.setLessonFlag(state, lessons[1].id, 'needsReview', true, AT, 0);
  const item = brief(state);
  assert.equal(item.needsReviewCount, 2, check('需要复习的课数正确'));
  assert.equal(item.tip.kind, 'review-pending', check('有复习项且今日已达标 → review-pending'));
  assert.equal(item.tip.text, '有 2 课标记为需要复习。', check('复习提示文字与 §10 一致'));
  /* 清掉复习标记后回到兜底 */
  Logic.setLessonFlag(state, lessons[0].id, 'needsReview', false, AT, 0);
  Logic.setLessonFlag(state, lessons[1].id, 'needsReview', false, AT, 0);
  const cleared = brief(state);
  assert.equal(cleared.needsReviewCount, 0, check('清掉标记后复习数为 0'));
  assert.equal(cleared.tip.kind, 'steady', check('没有复习项时走兜底提示'));
  assert.ok(cleared.tip.text.includes(Logic.formatSeconds(1200)), check('兜底提示陈述今天真实学了多久'));
  /* 兜底也不许编造：不足 10 分钟时不可能走到兜底，因此兜底文案里的时长必然 >= 10 分钟 */
  assert.ok(cleared.todaySeconds >= MIN, check('走到兜底时今天必然已达标'));
}

/* ===================== 7. 规则四：已开放课程全部完成（最高优先级） ===================== */
{
  const state = fresh();
  completeEverything(state);
  Logic.evaluateAchievements(state, lessons, AT, DAY);
  /* 刻意让今天为 0 秒：如果优先级写错，就会给出“再学 10 分钟”的荒谬提示 */
  const item = brief(state, { currentLessonId: lessons[0].id });
  assert.equal(item.completedCount, lessons.length, check('19 课全部完成'));
  assert.equal(item.percent, 100, check('完成百分比为 100'));
  assert.equal(item.todaySeconds, 0, check('今天 0 秒'));
  assert.equal(item.tip.kind, 'all-done', check('全部完成时 all-done 优先于 today-short'));
  assert.equal(item.tip.text, '当前开放课程已全部完成，后续课程尚未开放。', check('终局提示文字与 §10 一致'));
  /* §6.4：完成数最大就是已开放的 19，绝不能被说成 46 */
  assert.equal(item.totalLessons, 19, check('分母是已开放的 19 课'));
  assert.notEqual(item.completedCount, 46, check('完成数不会是 46'));
  const withCatalog = brief(state, { catalogTotal: 46 });
  assert.equal(withCatalog.catalogTotal, 46, check('官方总数单独作为 catalogTotal 回传'));
  assert.equal(withCatalog.completedCount, 19, check('完成数仍然只统计已开放课程'));
}

/* ===================== 8. 最近学习 / 推荐继续 ===================== */
{
  const state = fresh();
  complete(state, 0);
  complete(state, 1);
  /* 最后访问第 5 课：最近学习应该是它，而推荐继续应该是第一门未完成的第 3 课 */
  Logic.markVisited(state, lessons[4].id, AT, DAY);
  const item = brief(state);
  assert.equal(item.recentLesson.id, lessons[4].id, check('最近学习是最后访问的那一课'));
  assert.equal(item.recentLesson.zh, lessons[4].zh, check('最近学习回传中文名'));
  assert.equal(item.recentLesson.title, lessons[4].title, check('最近学习回传官方英文标题'));
  assert.deepEqual(Object.keys(item.recentLesson).sort(), ['id', 'title', 'zh'], check('最近学习只带三个字段，不外泄整课正文'));
  assert.equal(item.continueLesson.id, lessons[2].id, check('推荐继续是第一门未完成的课'));
  /* 完成到第 5 课后，推荐应推进到第 6 课 */
  complete(state, 2);
  complete(state, 3);
  complete(state, 4);
  assert.equal(brief(state).continueLesson.id, lessons[5].id, check('推荐继续随真实完成状态推进'));
}

/* ===================== 9. 下一个成就 / 下一个头像框 ===================== */
{
  const state = fresh();
  Logic.addActiveSeconds(state, null, 900, DAY);
  Logic.evaluateAchievements(state, lessons, AT, DAY);
  const item = brief(state);
  const expectedGoal = local(Logic.nextVisibleGoals(state, lessons, DAY, 1))[0];
  assert.ok(item.nextGoal, check('有可见目标时 nextGoal 非空'));
  assert.equal(item.nextGoal.id, expectedGoal.id, check('nextGoal 与 nextVisibleGoals 的第一条一致'));
  assert.equal(item.nextGoal.remaining, expectedGoal.remaining, check('nextGoal 的剩余量一致'));
  assert.equal(item.nextGoal.remainingText, Logic.remainingText(expectedGoal.remaining, expectedGoal.unit), check('remainingText 由 remainingText() 统一生成'));
  /* 隐藏成就绝不允许出现在助手提示里（§4.2） */
  const hidden = Logic.ACHIEVEMENTS.filter(achievement => achievement.hidden).map(achievement => achievement.id);
  assert.ok(!hidden.includes(item.nextGoal.id), check('nextGoal 不是隐藏成就'));

  const expectedFrame = local(Logic.nextFrames(state, lessons, DAY, 1))[0];
  assert.ok(item.nextFrame, check('有未解锁头像框时 nextFrame 非空'));
  assert.equal(item.nextFrame.id, expectedFrame.id, check('nextFrame 与 nextFrames 的第一条一致'));
  assert.equal(item.nextFrame.remainingText, Logic.remainingText(expectedFrame.remaining, expectedFrame.unit), check('头像框剩余量文案一致'));

  /* 全部解锁后两者都为 null，面板不该编一个假目标出来 */
  const maxed = fresh();
  maxed.xp = 100000;
  completeEverything(maxed);
  maxed.daily = dailyFor(100);            /* v4.2：连续 100 天，9 档 streak 全解锁 */
  Object.keys(maxed.daily).forEach(key => { maxed.daily[key] = 1300; });  /* 每天超 20 分钟目标：3 档目标连续成就全解锁 */
  maxed.daily[DAY] = 8000;                /* v4.2：单日 2 小时+，3 档单日全解锁 */
  maxed.totalActiveSeconds = 400000;      /* 111 小时，10 档时长全解锁（含 100h） */
  for (let i = 0; i < 10; i += 1) maxed.cosmetics.purchases[`avatar:fixture-${i}`] = true;  /* 10 件兑换 */
  /* v4.3：Boss 成就（首破章节 Boss / 未战先知）需要真实的 Boss 纪录；
   * Batch 10（Stretch N5）：隐藏成就「未战先达」需要第 2 个单元预检 ≥70% */
  maxed.bosses = {
    introduction: { attempts: 1, passCount: 1, highCount: 1, lastPassDay: DAY, lastHighDay: DAY, bestPct: 100, firstPct: 100, lastPct: 100, firstWasPrecheck: true, precheckBestPct: 100 },
    prerequisites: { attempts: 1, passCount: 1, highCount: 1, lastPassDay: DAY, lastHighDay: DAY, bestPct: 90, firstPct: 90, lastPct: 90, firstWasPrecheck: true, precheckBestPct: 85 }
  };
  exerciseReview(maxed);
  Logic.evaluateAchievements(maxed, lessons, AT, DAY);
  const done = brief(maxed);
  /* v4.2：叶片解锁框不会被成就/等级解锁，因此满成就时 nextFrame 指向最便宜的
   * 叶片框（提示“还差多少叶片”），而不是 null；unlockedFrameCount 不含未购买框。 */
  assert.ok(done.nextFrame && done.nextFrame.unit === 'coins', check('满成就后 nextFrame 是叶片框（还差多少叶片）'));
  assert.equal(done.unlockedFrameCount, done.frameTotal - 8, check('非叶片头像框确实全解锁（8 个叶片框未解锁）'));
  assert.equal(done.achievementCount, done.achievementTotal, check('成就确实全解锁'));
  assert.equal(done.nextGoal, null, check('成就全解锁后 nextGoal 为 null'));
}

/* ===================== 10. 最近解锁的成就 ===================== */
{
  const state = fresh();
  /* 第一天只访问了一课：解锁“迈出第一步”，它就是当时的最近解锁 */
  Logic.markVisited(state, lessons[0].id, '2026-09-01T08:00:00.000Z', '2026-09-01');
  Logic.evaluateAchievements(state, lessons, '2026-09-01T08:00:00.000Z', '2026-09-01');
  const first = brief(state).latestAchievement;
  assert.ok(first, check('解锁过成就后 latestAchievement 非空'));
  assert.equal(first.date, '2026-09-01', check('最近解锁只回传日期，不回传具体时刻'));
  /* 第二天再解锁一批，最近一条应该换成新的 */
  Logic.addActiveSeconds(state, null, 1800, '2026-09-02');
  Logic.evaluateAchievements(state, lessons, '2026-09-02T08:00:00.000Z', '2026-09-02');
  const second = brief(state).latestAchievement;
  assert.notEqual(second.id, first.id, check('再次解锁后最近一条发生变化'));
  assert.equal(second.date, '2026-09-02', check('最近解锁取时间最新的那条'));
  assert.ok(second.zh.trim().length > 0, check('最近解锁回传中文名'));
}

/* ===================== 11. 连续学习天数 ===================== */
{
  [0, 1, 3, 7, 14, 30].forEach(days => {
    const state = fresh();
    state.daily = dailyFor(days);
    assert.equal(brief(state).streak, days, check(`连续 ${days} 天的档案回传 ${days}`));
  });
  /* 中间断一天，只能算到断点为止 */
  const broken = fresh();
  broken.daily = dailyFor(5);
  delete broken.daily[Logic.shiftDayKey(DAY, -2)];
  assert.equal(brief(broken).streak, 2, check('中间断一天后连续天数从断点重新算'));
}

/* ===================== 12. catalogTotal 的健壮性 ===================== */
{
  const state = fresh();
  [0, -1, NaN, 'abc', null, undefined, ''].forEach(value => {
    assert.equal(brief(state, { catalogTotal: value }).catalogTotal, null, check(`catalogTotal=${String(value)} 安全回落为 null`));
  });
  assert.equal(brief(state, { catalogTotal: 46 }).catalogTotal, 46, check('catalogTotal=46 正常回传'));
  assert.equal(brief(state, { catalogTotal: '46' }).catalogTotal, 46, check('catalogTotal 字符串数字被规整为数字'));
  /* 不传 options 也不能炸 */
  assert.ok(Logic.assistantBrief(state, lessons, DAY), check('省略 options 参数仍可求值'));
}

/* ===================== 13. 与真实档案（v1 迁移后）协同 ===================== */
{
  /* 模拟一份 v3 老档案：schemaVersion 1，没有 profile 与 reviewEverMarked */
  const legacy = {
    schemaVersion: 1,
    xp: 240,
    totalActiveSeconds: 3600,
    minuteXpAwarded: 60,
    lessons: { 'how-this-course-will-work': { started: true, completed: true, officialCompleted: true, quizCompleted: false, needsReview: true, activeSeconds: 1200 } },
    daily: { '2026-09-09': 1800, '2026-09-10': 1800 },
    rewardFlags: { firstLessonComplete: true, firstOfficialComplete: true, firstQuizComplete: false },
    achievements: { 'first-lesson': AT, 'active-30m': AT },
    lastLessonId: 'how-this-course-will-work'
  };
  /* sanitizeState 返回的是 { ok, state } 或 { ok:false, error }，不是状态本身 */
  const sanitized = Logic.sanitizeState(legacy, lessonIds);
  assert.equal(sanitized.ok, true, check('v1 老档案可以被清洗'));
  const migrated = sanitized.state;
  assert.ok(migrated && migrated.lessons, check('清洗后拿到的是可用状态'));
  assert.equal(migrated.schemaVersion, 4, check('v1 老档案被自动迁移到 schemaVersion 4'));
  const item = Logic.assistantBrief(migrated, lessons, DAY, { catalogTotal: 46, currentLessonId: 'how-this-course-will-work' });
  assert.equal(item.xp, 240, check('迁移后 XP 原样保留'));
  assert.equal(item.level, Logic.levelOf(240), check('等级由保留下来的 XP 算出'));
  assert.equal(item.todaySeconds, 1800, check('今日时长按今天的 daily 回传'));
  assert.equal(item.streak, 2, check('连续天数按迁移后的 daily 算出'));
  assert.equal(item.needsReviewCount, 1, check('复习标记在迁移后仍然有效'));
  assert.equal(item.recentLesson.id, 'how-this-course-will-work', check('最近学习在迁移后仍然有效'));
  assert.equal(item.latestAchievement.zh.length > 0, true, check('老成就也能作为“最近解锁”回传'));
  assert.equal(item.tip.kind, 'review-pending', check('老档案的提示按迁移后的真实状态给出'));
  assert.equal(item.tip.text, '有 1 课标记为需要复习。', check('老档案的提示文字正确'));
}

console.log(`通过：学习助手「小奥」${checks} 项断言（§10 九类信息齐全、同档案输出逐字相同、求值只读且不联网不接受自由文本、五条提示规则的优先级与边界、最近学习/推荐继续随真实状态推进、下一个成就与头像框和 nextGoals/nextFrames 一致且排除隐藏成就、连续天数断点重算、catalogTotal 健壮回落、v1 老档案迁移后协同正确）。`);
