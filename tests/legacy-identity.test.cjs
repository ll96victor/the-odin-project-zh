/* v4.9：老档案的「退役默认值」归一化 —— 读取层归一化 + 界面去角色名。
 *
 * 为什么单独建这个文件：v4.8 的全部验证都在**空档案**下完成，「整页无芽芽」
 * 因此成立但无意义——真实用户都是老档案。规划阶段用真实浏览器读用户真实档案
 * （http://127.0.0.1:8765）拿到的事实是：
 *   avatarId: 'terminal'  （v4.8 前的产品默认头像；格式合法，永远过得了格式校验）
 *   companionId: 'sprout' （已在 retiredIds 里，显示层回落 nono）
 *   companionName: '芽芽'  （v4.8 前的品牌默认名；被当成「用户自定义昵称」继续显示）
 * 于是老档案真实渲染成：Hero「芽芽 · 幼苗」、右下角「芽芽」、面板标题「芽芽 ·
 * 学习伙伴」、header 头像还是终端 SVG。本文件把这条**老档案路径**钉进回归网。
 *
 * 覆盖：
 *   1. P0-1 归一化：terminal → companion-nono、'芽芽' → 视为未命名回落「小诺」；
 *   2. P0-1 零存储改动：读取层归一化**不写回** localStorage、不改 schemaVersion、
 *      不动任何学习进度字段（lessons / xp / coins / daily / totalActiveSeconds /
 *      achievements / history 逐字段比对）；
 *   3. P0-1 单一事实源：退役名单只在 companion-registry.js 声明一处；
 *   4. P0-1 不误伤：用户自己起的昵称、未退役的头像 id 都原样保留；
 *   5. P0-2 界面：右下角与 Hero 不出角色名、aria-label 仍含名字、面板标题
 *      「学习助手 · 昵称」语序；
 *   6. P0-3 界面：右下角触发按钮上无 .companion-growth 角标。
 *
 * 运行：node tests/legacy-identity.test.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

let checks = 0;
const check = label => { checks += 1; return label; };

const root = path.join(__dirname, '..');
const {
  querySelect, collectByClass, dispatch, makeStorage,
  newPage, archiveJson, lessonEntryJson, STORAGE_KEY, FIRST_LESSON
} = require('./dom-stub.cjs');

/* ---------- 造一份「v4.8 之前」的真实老档案 ----------
 * schemaVersion 用 4（与用户真实档案一致）：既覆盖真实场景，也避开 v3→v4 迁移
 * 快照写入，让「原文未被写回」这条断言只反映本轮的归一化行为。
 * 学习进度按真实形状填满：两课已完成、有 XP / 叶片 / 活跃秒数 / 成就 / 日统计 /
 * 历史事件——归一化必须一个字段都不碰。 */
const LEGACY_LESSONS = {
  [FIRST_LESSON]: lessonEntryJson({
    started: true, completed: true, activeSeconds: 900,
    startedAt: '2026-01-02T09:00:00.000Z', completedAt: '2026-01-02T09:15:00.000Z',
    lastVisitedAt: '2026-01-03T09:00:00.000Z'
  }),
  'introduction-to-web-development': lessonEntryJson({
    started: true, completed: true, officialCompleted: true, quizCompleted: true,
    activeSeconds: 1500, startedAt: '2026-01-04T09:00:00.000Z',
    completedAt: '2026-01-04T09:30:00.000Z', officialCompletedAt: '2026-01-04T09:20:00.000Z',
    quizCompletedAt: '2026-01-04T09:25:00.000Z', lastVisitedAt: '2026-01-05T09:00:00.000Z'
  }),
  'asking-for-help': lessonEntryJson({ started: true, needsReview: true, activeSeconds: 240 })
};
const LEGACY_XP = 1630;
const LEGACY_COINS = 456;
const LEGACY_TOTAL_SECONDS = 3600;
const LEGACY_DAILY = { '2026-01-02': 900, '2026-01-04': 2400 };
const LEGACY_ACHIEVEMENTS = { 'first-lesson': '2026-01-02T09:15:00.000Z' };
const LEGACY_HISTORY = [
  { type: 'lesson-complete', day: '2026-01-02', at: '2026-01-02T09:15:00.000Z', slug: FIRST_LESSON }
];

/* legacyArchiveJson()：老档案全文（含本轮要被归一化的三个旧默认值） */
function legacyArchiveJson(overrides = {}) {
  return archiveJson(Object.assign({
    schemaVersion: 4,
    lessons: LEGACY_LESSONS,
    xp: LEGACY_XP,
    coins: LEGACY_COINS,
    totalActiveSeconds: LEGACY_TOTAL_SECONDS,
    daily: LEGACY_DAILY,
    achievements: LEGACY_ACHIEVEMENTS,
    history: LEGACY_HISTORY,
    lastLessonId: FIRST_LESSON,
    reviewEverMarked: true,
    profile: { nickname: '老用户', avatarId: 'terminal', avatarData: null, equippedFrameId: 'frame-basic' },
    cosmetics: { purchases: {}, companionId: 'sprout', themeId: 'garden' },
    settings: {
      dailyGoalMinutes: 45, companionPos: { x: 120, y: 90 }, companionName: '芽芽',
      showCompanion: true, showAchievementNotes: true, showReadingPosition: true,
      showUnavailableLessons: true, showEnglishTitles: true, shortcutsEnabled: true
    }
  }, overrides));
}

/* seededLegacyPage()：把老档案播种进存储，再像真实浏览器那样加载整页 */
function seededLegacyPage(overrides) {
  const storage = makeStorage();
  const raw = legacyArchiveJson(overrides);
  storage.setItem(STORAGE_KEY, raw);
  const page = newPage({ storage });
  page.rawArchive = raw;
  page.storageObj = storage;   /* newPage 不把 storage 挂到 page 上，自己留一份引用 */
  return page;
}

/* ============ 1. P0-1 读取层归一化：旧默认头像与旧默认昵称 ============ */
{
  const page = seededLegacyPage();
  const { progress } = page;

  /* ① 旧默认头像 'terminal' → 当前产品默认头像 */
  assert.equal(progress.profile().avatarId, 'companion-nono',
    check("v4.9：老档案 avatarId='terminal' 归一化为 companion-nono"));
  assert.equal(progress.profile().avatarId, progress.Logic.DEFAULT_AVATAR_ID,
    check('v4.9：归一化目标就是 DEFAULT_AVATAR_ID（单一事实源，不写死字面量）'));
  assert.equal(progress.summary().avatarId, 'companion-nono',
    check('v4.9：summary 里的头像 id 同样已归一化（页面各处读到一致值）'));

  /* ② 旧默认昵称「芽芽」→ 视为未命名，回落按角色默认名「小诺」 */
  assert.equal(progress.companionIdentity().name, '小诺',
    check("v4.9：老档案 companionName='芽芽' 视为未命名，生效名回落「小诺」"));
  assert.equal(progress.settings().companionName, '小诺',
    check('v4.9：settings.companionName 读出来已清洗成「小诺」'));
  assert.ok(!Object.prototype.hasOwnProperty.call(progress.settings().companionNicknames, 'sprout'),
    check('v4.9：旧默认名没有迁进 companionNicknames[当前退役角色]'));

  /* ③ 形象：存储层 companionId 原样保留（不迁移），显示层是 nono */
  assert.equal(progress.cosmetics().companionId, 'sprout',
    check('v4.9：存储层退役 id 原样保留（不写迁移，可一键回滚）'));
  const view = page.sandbox.window.ODIN_COMPANION_VIEW;
  assert.equal(view.resolve(progress.cosmetics().companionId).id, 'nono',
    check('v4.9：老档案形象经 resolve 回落 nono'));
  assert.equal(view.displayName(progress.cosmetics().companionId), '小诺',
    check('v4.9：companion-view 层显示名同样是「小诺」（两条昵称路径同口径）'));
  const portrait = view.portrait(progress.cosmetics().companionId, { slot: 'corner', mood: 'normal' });
  assert.ok(portrait && portrait.value.includes('assets/companions/nono/'),
    check('v4.9：老档案角落形象图指向 nono 正式资产'));

  /* ④ 显式写着旧默认名的 per-character 昵称表：同样视为未命名 */
  const explicit = seededLegacyPage({ settings: Object.assign(legacyArchiveJson().settings ? {} : {}, {
    dailyGoalMinutes: 20, companionPos: null,
    companionNicknames: { sprout: '芽芽', nono: '芽芽' },
    showCompanion: true, showAchievementNotes: true, showReadingPosition: true,
    showUnavailableLessons: true, showEnglishTitles: true, shortcutsEnabled: true
  }) });
  assert.equal(explicit.progress.companionIdentity().name, '小诺',
    check('v4.9：per-character 昵称表里的旧默认名同样按未命名处理'));
  assert.ok(!Object.values(explicit.progress.settings().companionNicknames).includes('芽芽'),
    check('v4.9：旧默认名不会残留在昵称表里'));
}

/* ============ 2. P0-1 零迁移：归一化不新增任何写入、不碰学习数据 ============
 *
 * 关于「不写回 localStorage」这条要求，先把事实说清楚（本文件用断言把它钉住，
 * 而不是含糊带过）：
 *   - **归一化自身不产生任何写入**：它发生在 Logic.parseAutoLoad / sanitizeState
 *     这两个纯函数里，纯函数碰不到 localStorage。下面 ①② 用直接调用纯函数证明。
 *   - **但整页加载本来就会保存一次**：app.js 启动时调用 progress.startTimer()
 *     → afterChange() → save()，把内存 state 整体序列化写回。这是 v4.9 之前就
 *     存在的行为（② 的对照组用「值都不退役的档案」证明写入照样发生），不是本轮
 *     引入的。因此归一化后的身份值会随这次**常规保存**落盘。
 *   - 结论：本轮没有新增迁移、没有改 schemaVersion、没有动 storage-migration，
 *     学习进度字段逐字段不变（③④）。回滚「清空两个名单」复原的是**行为**，
 *     不保证存储里的 'terminal' 字面量还在——这一点在实施记录里如实写明。 */
{
  const page = seededLegacyPage();
  const raw = page.rawArchive;
  const Logic = page.progress.Logic;
  /* progress.js 内部就是 lessons.map(l => l.id)（19 课中文自足讲解的 id） */
  const lessonIds = page.sandbox.window.ODIN_GUIDE.lessons.map(l => l.id);

  /* ① 纯函数直证：parseAutoLoad 归一化后，学习数据逐字段与原文一致 */
  const parsed = Logic.parseAutoLoad(raw, lessonIds);
  assert.equal(parsed.ok, true, check('v4.9：老档案能被 parseAutoLoad 正常读取'));
  assert.equal(parsed.state.profile.avatarId, 'companion-nono',
    check('v4.9：parseAutoLoad 返回值里 avatarId 已归一化（纯函数层，不碰存储）'));
  assert.equal(parsed.state.settings.companionName, '小诺',
    check('v4.9：parseAutoLoad 返回值里 companionName 已归一化为默认名'));
  assert.deepEqual(JSON.parse(JSON.stringify(parsed.state.lessons)), LEGACY_LESSONS,
    check('v4.9：parseAutoLoad 后 lessons 逐字段未变'));
  assert.equal(parsed.state.xp, LEGACY_XP, check('v4.9：parseAutoLoad 后 xp 未变'));
  assert.equal(parsed.state.coins, LEGACY_COINS, check('v4.9：parseAutoLoad 后 coins 未变'));
  assert.deepEqual(JSON.parse(JSON.stringify(parsed.state.daily)), LEGACY_DAILY,
    check('v4.9：parseAutoLoad 后 daily 未变'));
  assert.equal(raw, page.rawArchive, check('v4.9：parseAutoLoad 是纯函数，调用后原文串一字未动'));

  /* ② 对照组：值都不退役的档案在整页加载时同样产生一次写入 —— 证明写回与
   * 归一化无关，来源是既有的启动保存（startTimer → afterChange → save）。 */
  {
    const plainStorage = makeStorage();
    plainStorage.setItem(STORAGE_KEY, archiveJson({ schemaVersion: 4, xp: 100, coins: 10 }));
    const originalSetItem = plainStorage.setItem;
    let writes = 0;
    plainStorage.setItem = (key, value) => {
      if (String(key) === STORAGE_KEY) writes += 1;
      return originalSetItem(key, value);
    };
    newPage({ storage: plainStorage });
    assert.equal(writes, 1,
      check('v4.9 对照：非退役档案启动时同样写 1 次（既有启动保存，不是本轮引入）'));
  }

  /* ③ 整页加载后，落盘档案里的学习进度字段逐字段未变 */
  const stored = JSON.parse(page.storageObj.getItem(STORAGE_KEY));
  assert.equal(Logic.SCHEMA_VERSION, 4, check('v4.9：SCHEMA_VERSION 仍是 4（归一化不升 schema）'));
  assert.equal(stored.schemaVersion, 4, check('v4.9：落盘档案 schemaVersion 未被改动'));
  assert.deepEqual(stored.lessons, LEGACY_LESSONS,
    check('v4.9：落盘档案 lessons 逐字段未变（完成状态 / 时长 / 时间戳全保留）'));
  assert.equal(stored.xp, LEGACY_XP, check('v4.9：落盘档案 xp 未变'));
  assert.equal(stored.coins, LEGACY_COINS, check('v4.9：落盘档案 coins（学习叶片）未变'));
  assert.equal(stored.totalActiveSeconds, LEGACY_TOTAL_SECONDS,
    check('v4.9：落盘档案 totalActiveSeconds 未变'));
  assert.deepEqual(stored.daily, LEGACY_DAILY, check('v4.9：落盘档案 daily 日统计未变'));
  assert.equal(stored.lastLessonId, FIRST_LESSON, check('v4.9：落盘档案 lastLessonId 未变'));
  assert.equal(stored.reviewEverMarked, true, check('v4.9：落盘档案 reviewEverMarked 未变'));
  assert.equal(stored.profile.nickname, '老用户', check('v4.9：落盘档案用户昵称未变'));
  assert.equal(stored.cosmetics.companionId, 'sprout',
    check("v4.9：落盘档案 companionId 仍是 'sprout'（退役角色不迁移）"));

  /* ④ 内存读出的派生数字与老档案一致（没有因为归一化重算） */
  const exported = JSON.parse(page.progress.exportArchive());
  assert.equal(exported.xp, LEGACY_XP, check('v4.9：导出档案 xp 与老档案一致'));
  assert.equal(exported.coins, LEGACY_COINS, check('v4.9：导出档案 coins 与老档案一致'));
  const summary = page.progress.summary();
  assert.equal(summary.xp, LEGACY_XP, check('v4.9：summary.xp 与老档案一致'));
  assert.equal(summary.coins, LEGACY_COINS, check('v4.9：summary.coins 与老档案一致'));

  /* ③ 学习设置里的非身份项也一个不丢 */
  const settings = page.progress.settings();
  assert.equal(settings.dailyGoalMinutes, 45, check('v4.9：老档案每日目标不丢'));
  assert.ok(settings.companionPos && settings.companionPos.x === 120 && settings.companionPos.y === 90,
    check('v4.9：老档案伙伴位置不丢'));

  /* ⑤ 学习设置里的非身份项也一个不丢 */
  const legacySettings = page.progress.settings();
  assert.equal(legacySettings.dailyGoalMinutes, 45, check('v4.9：老档案每日目标不丢'));
  assert.ok(legacySettings.companionPos
    && legacySettings.companionPos.x === 120 && legacySettings.companionPos.y === 90,
    check('v4.9：老档案伙伴位置不丢'));
}

/* ============ 3. P0-1 单一事实源：退役名单只声明一处 ============ */
{
  const page = seededLegacyPage();
  const registry = page.sandbox.window.ODIN_COMPANION_REGISTRY;
  assert.deepEqual([...registry.retiredAvatarIds], ['terminal'],
    check('v4.9：retiredAvatarIds 声明在 companion-registry.js（与 retiredIds 同处）'));
  assert.deepEqual([...registry.legacyCompanionNames], ['芽芽'],
    check('v4.9：legacyCompanionNames 与 retiredAvatarIds 同处声明'));
  assert.deepEqual([...registry.retiredIds], ['sprout'],
    check('v4.9：v4.8 的 retiredIds 未被本轮改动'));

  /* 名单是只读的：任何运行时改写都不会生效（Object.freeze） */
  assert.ok(Object.isFrozen(registry.retiredAvatarIds) && Object.isFrozen(registry.legacyCompanionNames),
    check('v4.9：两份退役名单已 freeze，运行时改不动'));

  /* 回滚方式：清空这两个集合即可一步复原（用登记表缺失的降级路径等价验证） */
  const progressSource = fs.readFileSync(path.join(root, 'progress.js'), 'utf8');
  assert.ok(progressSource.includes("retiredDefaults('retiredAvatarIds')")
    && progressSource.includes("retiredDefaults('legacyCompanionNames')"),
    check('v4.9：progress.js 从登记表读名单，没有另抄字面量'));
  for (const literal of ["['terminal']", "['芽芽']"]) {
    assert.ok(!progressSource.includes(literal),
      check(`v4.9：progress.js 里没有硬编码退役名单字面量 ${literal}`));
  }
}

/* ============ 4. P0-1 不误伤：用户自己的选择与名字原样保留 ============ */
{
  const page = seededLegacyPage({
    profile: { nickname: '老用户', avatarId: 'fox', avatarData: null, equippedFrameId: 'frame-basic' },
    settings: Object.assign(legacyArchiveJson().settings ? {} : {}, {
      dailyGoalMinutes: 20, companionPos: null, companionName: '小绿',
      showCompanion: true, showAchievementNotes: true, showReadingPosition: true,
      showUnavailableLessons: true, showEnglishTitles: true, shortcutsEnabled: true
    })
  });
  assert.equal(page.progress.profile().avatarId, 'fox',
    check('v4.9：未退役的头像 id 原样保留（归一化不误伤用户选择）'));
  assert.equal(page.progress.companionIdentity().name, '小绿',
    check('v4.9：用户自己起的昵称原样保留（只在命中旧默认名时才视为未命名）'));

  /* 用户此后无法再主动选终端头像 / 起名「芽芽」——已知副作用，用户已接受 */
  page.progress.setAvatarId('terminal');
  assert.equal(page.progress.profile().avatarId, 'companion-nono',
    check('v4.9：setAvatarId("terminal") 同样归一化为默认头像（副作用已接受）'));
  page.progress.setCompanionName('芽芽');
  assert.equal(page.progress.companionIdentity().name, '小诺',
    check('v4.9：setCompanionName("芽芽") 视为清空，回落「小诺」（副作用已接受）'));
}

/* ============ 5. P0-2 界面：右下角与 Hero 不出角色名 ============ */
{
  const page = seededLegacyPage();
  const trigger = querySelect(page.dom.body, '.assistant-trigger');

  /* ① 右下角：无可见角色名节点，但 aria-label 仍含名字（无障碍不退化） */
  assert.equal(querySelect(trigger, '.assistant-name'), null,
    check('v4.9：右下角按钮不再渲染 .assistant-name 节点'));
  assert.equal(trigger.textContent.trim(), '',
    check('v4.9：右下角按钮可见文本为空（只有头像）'));
  assert.ok(trigger.getAttribute('aria-label').includes('小诺'),
    check('v4.9：右下角按钮 aria-label 仍含角色名「小诺」（读屏可读）'));
  assert.ok(!trigger.textContent.includes('芽芽') && !trigger.textContent.includes('幼苗'),
    check('v4.9：右下角按钮文本不含「芽芽」「幼苗」'));

  /* ② Hero：不再渲染角色名行 */
  assert.equal(querySelect(page.dom.body, '.hero-companion-name'), null,
    check('v4.9：Hero 不再渲染 .hero-companion-name 节点'));
  const heroFigure = querySelect(page.dom.body, '.hero-companion');
  assert.ok(heroFigure, check('v4.9：Hero 角色区仍在（只去掉名字，不删立绘）'));
  assert.ok(!heroFigure.textContent.includes('芽芽') && !heroFigure.textContent.includes('幼苗')
    && !heroFigure.textContent.includes('小诺'),
    check('v4.9：Hero 角色区文本不含任何角色名 / 成长阶段名'));
  assert.equal(heroFigure.getAttribute('aria-hidden'), 'true',
    check('v4.9：Hero 角色区保持 aria-hidden（纯装饰语义不变）'));

  /* ③ 助手面板标题：「学习助手 · 小诺」语序 */
  const dialogTrigger = querySelect(page.dom.body, '.assistant-trigger');
  dispatch(dialogTrigger, 'click', {});
  const dialog = collectByClass(page.dom.body, 'assistant-dialog').find(d => d.open === true);
  assert.equal(querySelect(dialog, '#assistant-panel-title').textContent, '学习助手 · 小诺',
    check('v4.9：面板标题「学习助手 · 小诺」'));
}

/* ============ 6. P0-3 界面：右下角按钮上无成长角标 ============ */
{
  /* 造一份「成长阶段 > 0」的老档案——角标原本只在 stage>0 时才挂，
   * 空档案下没有角标，断言会假通过。这里用足够的学习数据把阶段顶上去。 */
  const page = seededLegacyPage({
    xp: 3200, coins: 500, totalActiveSeconds: 36000
  });
  const growth = page.sandbox.window.ODIN_COMPANIONS.growthBrief({
    xp: page.progress.summary().xp,
    totalSeconds: 36000,
    completedUnits: page.progress.summary().completedLessons
  });
  assert.ok(growth && growth.stage > 0,
    check(`v4.9：造出的老档案成长阶段 > 0（stage=${growth ? growth.stage : 'null'}），角标断言不是假通过`));
  assert.ok(growth.ornament, check('v4.9：成长阶段数据仍带 ornament（能力保留，只撤展示）'));

  const trigger = querySelect(page.dom.body, '.assistant-trigger');
  assert.equal(querySelect(trigger, '.companion-growth'), null,
    check('v4.9：右下角按钮上无 .companion-growth 角标节点'));
  assert.ok(trigger.getAttribute('aria-label').includes('小诺'),
    check('v4.9：撤掉角标后按钮 aria-label 仍含角色名'));

  /* 成长阶段能力本身没有丢：函数与数据都还在 */
  const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.ok(appSource.includes('function growthOrnament()'),
    check('v4.9：growthOrnament() 函数保留（个人中心 / 成长页将来可直接复用）'));
  const companionsSource = fs.readFileSync(path.join(root, 'companions.js'), 'utf8');
  assert.ok(companionsSource.includes('ornament'),
    check('v4.9：companions.js 的 growthStages / ornament 数据保留'));
}

/* ============ 7. 老档案整页全文：无「芽芽」无「幼苗」 ============ */
{
  const page = seededLegacyPage();
  const text = page.dom.body.textContent;
  assert.ok(!text.includes('芽芽'), check('v4.9：老档案整页文本不含「芽芽」'));
  assert.ok(!text.includes('幼苗'), check('v4.9：老档案整页文本不含「幼苗」'));
}

console.log(`legacy-identity.test.cjs：全部 ${checks} 项断言通过 ✔`);
