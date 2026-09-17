/* v4.5 Batch 4（交接 C1/C2）：学习伙伴品牌去 Odin 化 + 昵称 + 三种显示模式。
 * v4.8：默认角色从 sprout（芽芽）换成 nono（小诺）——本文件的默认名期望值
 * 全部按新事实源更新（'芽芽' → '小诺'），退役 sprout 的断言按「存储层保留、
 * 显示层回落 nono/小诺」的新语义改写；断言语义（回落机制正确 / 昵称清洗
 * 正确 / 不跨角色泄漏名字）与强度不降。
 *
 * 覆盖：
 *   1. 默认值：companionName=小诺、companionDisplay=auto、companionId=nono、
 *      avatarId=companion-nono（progress.Logic 口径）；
 *   2. 昵称清洗 normalizeCompanionName：1–12 码点、去控制字符、空/非法回落小诺、
 *      超长截断；setCompanionName 持久化与 file:// 降级；
 *   3. 显示模式白名单 normalizeCompanionDisplay：三态接受、非法回落 auto；
 *   4. 旧 v4.4 档案（无这两个字段）导入自动补默认、其它字段一个不丢（增量迁移）；
 *   5. UI 品牌：触发按钮**只出头像**（昵称改在 aria-label，读屏仍可读）、
 *      面板标题「学习助手 · 昵称」（v4.9 语序）、不再出现「小奥」；
 *   6. 三种显示模式的面板渲染：auto=默认视图大人形/二级视图无大图、
 *      always=二级视图也带大人形、minimal=只显示小头像无大人形；
 *   7. 设置同源：个人中心设置 Tab 与伙伴面板设置视图都有昵称 + 显示模式字段。
 *   8. 第二轮（发布前查漏补缺）：按角色默认名——品牌默认名只属于默认角色，
 *      其余未命名角色回落登记名；companionIdentity / companion-view.displayName /
 *      UI 三层同口径；「昵称 · 形象名」双维度标签同名时不重复拼接。
 *   9. v4.8 退役机制：resolve('sprout') 回落 nono、退役角色不出现在可选列表、
 *      老档案 sprout 存储层不迁移、显示层自动显示小诺、页面全文无「芽芽」。
 *
 * 运行：node tests/companion-brand.test.cjs */
const assert = require('node:assert/strict');

let checks = 0;
const check = label => { checks += 1; return label; };

const {
  querySelect, collectByClass, dispatch, makeStorage,
  newPage, archiveJson, STORAGE_KEY
} = require('./dom-stub.cjs');

function seededStorage(overrides) {
  const storage = makeStorage();
  storage.setItem(STORAGE_KEY, archiveJson(overrides));
  return storage;
}
const fullSettings = extra => Object.assign({
  dailyGoalMinutes: 20, companionPos: null, showCompanion: true,
  showAchievementNotes: true, showReadingPosition: true, showUnavailableLessons: true,
  showEnglishTitles: true, shortcutsEnabled: true
}, extra || {});

/* 打开伙伴面板并切到某个二级视图（今天/复习/成就/设置），返回 dialog */
function openAssistant(page, view) {
  const trigger = querySelect(page.dom.body, '.assistant-trigger');
  dispatch(trigger, 'click', {});
  const dialog = collectByClass(page.dom.body, 'assistant-dialog').find(d => d.open === true);
  if (view) {
    const nav = collectByClass(dialog, 'assistant-nav-btn').find(b => b.textContent === view);
    dispatch(nav, 'click', {});
  }
  return dialog;
}

/* ===================== 1. 默认值（Logic 口径） ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const Logic = page.progress.Logic;
  assert.equal(Logic.DEFAULT_COMPANION_NAME, '小诺', check('v4.8：默认伙伴名是小诺'));
  assert.equal(Logic.DEFAULT_COMPANION_DISPLAY, 'auto', check('C2：默认显示模式是 auto'));
  assert.deepEqual([...Logic.COMPANION_DISPLAY_MODES], ['auto', 'always', 'minimal'],
    check('C2：显示模式三态白名单'));
  const identity = page.progress.companionIdentity();
  assert.equal(identity.name, '小诺', check('v4.8：空档案昵称回落小诺'));
  assert.equal(identity.display, 'auto', check('C2：空档案显示模式回落 auto'));
  assert.equal(page.progress.settings().companionName, '小诺', check('v4.8：settings 含 companionName 默认值'));
  assert.equal(page.progress.settings().companionDisplay, 'auto', check('C2：settings 含 companionDisplay 默认值'));
  /* v4.8（⑮）：默认档案的形象与头像 */
  assert.equal(page.progress.cosmetics().companionId, 'nono', check('v4.8：空档案默认形象是 nono'));
  assert.equal(page.progress.profile().avatarId, 'companion-nono', check('v4.8：空档案默认头像是 companion-nono'));
}

/* ===================== 2. 昵称清洗 normalizeCompanionName ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const norm = page.progress.Logic.normalizeCompanionName;
  assert.equal(norm('小绿'), '小绿', check('C1：合法昵称原样保留'));
  assert.equal(norm('  小绿  '), '小绿', check('C1：首尾空白被 trim'));
  assert.equal(norm(''), '小诺', check('v4.8：空串回落默认小诺'));
  assert.equal(norm('   '), '小诺', check('v4.8：全空白回落默认小诺'));
  assert.equal(norm(null), '小诺', check('v4.8：null 回落默认小诺'));
  assert.equal(norm(123), '小诺', check('v4.8：非字符串回落默认小诺'));
  assert.equal(norm('芽'.repeat(20)), '芽'.repeat(12), check('C1：超过 12 字符截断到 12'));
  assert.equal(Array.from(norm('名'.repeat(13))).length, 12, check('C1：按码点截断到 12'));
  /* 控制字符 / 零宽字符被剥离（与用户昵称同一套 NICKNAME_STRIP 规则） */
  const withControl = '小' + String.fromCharCode(0x200b) + '绿' + String.fromCharCode(0x07);
  assert.equal(norm(withControl), '小绿', check('C1：零宽与控制字符被剥离'));
  assert.equal(norm(String.fromCharCode(0x200b)), '小诺', check('v4.8：只剩零宽字符时回落默认'));
}

/* ===================== 3. setCompanionName / setCompanionDisplay ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const r1 = page.progress.setCompanionName('小绿');
  assert.equal(r1.ok, true, check('C1：setCompanionName 持久化模式成功'));
  assert.equal(r1.companionName, '小绿', check('C1：返回清洗后的昵称'));
  assert.equal(page.progress.settings().companionName, '小绿', check('C1：昵称写入 settings'));
  assert.equal(page.progress.companionIdentity().name, '小绿', check('C1：companionIdentity 读到新昵称'));
  page.progress.equipCompanion('mia');
  assert.equal(page.progress.companionIdentity().name, '米娅', check('第二轮：未命名的新角色回落登记默认名米娅，不继承上一角色昵称、也不再是全局默认名'));
  page.progress.setCompanionName('小粉');
  page.progress.equipCompanion('nono');
  assert.equal(page.progress.companionIdentity().name, '小绿', check('C1：切回原角色恢复其专属昵称'));
  page.progress.equipCompanion('mia');
  assert.equal(page.progress.companionIdentity().name, '小粉', check('C1：不同角色昵称各自保存'));
  const r2 = page.progress.setCompanionName('   ');
  assert.equal(r2.companionName, '小诺', check('v4.8：空昵称经清洗返回默认值小诺'));
  assert.equal(page.progress.companionIdentity().name, '米娅', check('第二轮：非默认角色清空昵称后生效名回落登记名米娅'));
  /* v4.8 退役语义：sprout 存储层仍可写入（不迁移档案），显示层生效名回落
   * 品牌默认名「小诺」——不再返回其登记名「幼芽」，也不继承其他角色昵称。 */
  page.progress.equipCompanion('sprout');
  assert.equal(page.progress.cosmetics().companionId, 'sprout', check('v4.8：存储层不迁移，退役 id 原样保留'));
  assert.equal(page.progress.companionIdentity().name, '小诺', check('v4.8：未命名退役 sprout 生效名回落小诺'));
  const r3 = page.progress.setCompanionDisplay('minimal');
  assert.equal(r3.ok, true, check('C2：setCompanionDisplay 成功'));
  assert.equal(page.progress.settings().companionDisplay, 'minimal', check('C2：显示模式写入 settings'));
  const r4 = page.progress.setCompanionDisplay('bogus');
  assert.equal(r4.companionDisplay, 'auto', check('C2：非法显示模式回落 auto'));
  assert.equal(page.progress.settings().companionDisplay, 'auto', check('C2：非法值不污染 settings'));

  /* file:// 降级：拒绝写入但返回清洗后的值供 UI 即时显示 */
  const filePage = newPage({ storage: null, protocol: 'file:' });
  const fr = filePage.progress.setCompanionName('小绿');
  assert.equal(fr.ok, false, check('C1：file:// 下 setCompanionName 返回 ok:false'));
  assert.equal(fr.companionName, '小绿', check('C1：file:// 下仍返回清洗后的昵称（内存即时生效）'));
}

/* 现代档案已含 companionNicknames 时，刷新不能把 legacy companionName
 * 错迁给当前未命名角色；旧档案缺字段的迁移由下方导入用例继续覆盖。 */
{
  const storage = makeStorage();
  const page = newPage({ storage });
  page.progress.setCompanionName('小绿');
  page.progress.equipCompanion('mia');
  const reloaded = newPage({ storage });
  assert.equal(reloaded.progress.companionIdentity().name, '米娅', check('第二轮：现代档案刷新后未命名角色回落登记名米娅'));
  reloaded.progress.equipCompanion('nono');
  assert.equal(reloaded.progress.companionIdentity().name, '小绿', check('C1：现代档案刷新后原角色专属昵称仍保留'));
  /* v4.8：老档案里的退役 sprout 刷新后显示层回落小诺，且回落不清空任何昵称 */
  reloaded.progress.equipCompanion('sprout');
  assert.equal(reloaded.progress.companionIdentity().name, '小诺', check('v4.8：退役 sprout 刷新后生效名回落小诺'));
  reloaded.progress.equipCompanion('nono');
  assert.equal(reloaded.progress.companionIdentity().name, '小绿', check('v4.8：退役回落不清空其他角色的专属昵称'));
}

/* ============ 按角色默认名（品牌默认名只属于默认角色）+ v4.8 退役语义 ============ */
{
  const page = newPage({ storage: makeStorage() });
  const Logic = page.progress.Logic;
  /* 数据层：defaultCompanionNameFor 的回落规则 */
  assert.equal(Logic.defaultCompanionNameFor('nono'), '小诺', check('v4.8：默认角色小诺的默认名是小诺'));
  assert.equal(Logic.defaultCompanionNameFor('sprout'), '小诺', check('v4.8：退役 sprout 默认名回落小诺，不再返回形象名幼芽'));
  assert.equal(Logic.defaultCompanionNameFor('mia'), '米娅', check('第二轮：未命名米娅默认名是登记名米娅'));
  assert.equal(Logic.defaultCompanionNameFor('odin-boy'), '少年', check('第二轮：旧角色回落形象名少年'));
  assert.equal(Logic.defaultCompanionNameFor(null), '小诺', check('v4.8：缺省 id 回落全局默认名小诺'));
  assert.equal(Logic.defaultCompanionNameFor('not-exist'), '小诺', check('v4.8：未知 id 降级全局默认名小诺'));

  /* 门面层：companion-view 与 companionIdentity 同口径 + 退役回落（⑮） */
  const view = page.sandbox.window.ODIN_COMPANION_VIEW;
  assert.equal(view.resolve('sprout').id, 'nono', check('v4.8：resolve 退役 sprout 回落默认角色 nono'));
  assert.equal(view.displayName('sprout'), '小诺', check('v4.8：view 层未命名退役 sprout 显示小诺而不是形象名幼芽'));
  assert.equal(view.displayName('mia'), '米娅', check('第二轮：view 层未命名米娅显示米娅'));
  assert.ok(!view.listByKind().some(item => item.id === 'sprout'), check('v4.8：退役角色不出现在可选列表'));
  assert.equal(view.listByKind().length, 27, check('v4.8：可选角色列表 27 个（28 登记 − 1 退役）'));
  assert.ok(!view.listByKind('creature').some(item => item.id === 'sprout'), check('v4.8：宠物分类同样过滤退役角色'));

  /* v4.8：空档案（默认小诺）整页文本无「芽芽」——默认名已全面接替 */
  assert.ok(!page.dom.body.textContent.includes('芽芽'), check('v4.8：空档案整页文本无「芽芽」'));

  /* UI 层：未命名米娅档案——触发按钮只出头像（名字在 aria-label）、面板标题
   * 显示「学习助手 · 米娅」，全程无「芽芽」 */
  const miaPage = newPage({ storage: seededStorage({
    cosmetics: { purchases: {}, companionId: 'mia', themeId: 'garden' },
    settings: fullSettings()
  }) });
  assert.equal(miaPage.progress.companionIdentity().name, '米娅', check('第二轮：未命名米娅 identity 显示米娅'));
  const miaTrigger = querySelect(miaPage.dom.body, '.assistant-trigger');
  assert.equal(querySelect(miaTrigger, '.assistant-name'), null,
    check('v4.9：触发按钮不再渲染角色名节点（只出头像）'));
  assert.ok(miaTrigger.getAttribute('aria-label').includes('米娅'),
    check('v4.9：按钮 aria-label 仍含角色名米娅（无障碍不退化）'));
  assert.ok(!miaTrigger.textContent.includes('芽芽'), check('第二轮：非默认角色触发按钮不再出现芽芽'));
  const miaDialog = openAssistant(miaPage);
  assert.equal(querySelect(miaDialog, '#assistant-panel-title').textContent, '学习助手 · 米娅',
    check('v4.9：面板标题「学习助手 · 米娅」语序'));
  assert.ok(!miaDialog.textContent.includes('芽芽'), check('第二轮：未命名米娅的面板正文不再出现芽芽'));

  /* 命名角色：昵称优先，封面行显示「昵称 · 形象名」双维度 */
  const namedPage = newPage({ storage: seededStorage({
    cosmetics: { purchases: {}, companionId: 'mia', themeId: 'garden' },
    settings: fullSettings({ companionNicknames: { mia: '小米' } })
  }) });
  assert.equal(namedPage.progress.companionIdentity().name, '小米', check('第二轮：专属昵称优先于登记默认名'));
  dispatch(querySelect(namedPage.dom.body, '.player-entry'), 'click', {});
  const namedProfile = collectByClass(namedPage.dom.body, 'profile-dialog').find(d => d.open === true);
  assert.equal(querySelect(namedProfile, '.cover-companion-name').textContent, '小米 · 米娅',
    check('第二轮：命名角色封面行显示「昵称 · 形象名」'));

  /* 未命名角色封面行只显示单名，不再「米娅 · 米娅」重复；
   * v4.8 起默认角色小诺的默认名与登记名同为「小诺」，同样走同名跳过分支 */
  dispatch(querySelect(miaPage.dom.body, '.player-entry'), 'click', {});
  const miaProfile = collectByClass(miaPage.dom.body, 'profile-dialog').find(d => d.open === true);
  const miaCoverName = querySelect(miaProfile, '.cover-companion-name');
  assert.equal(miaCoverName.textContent, '米娅', check('第二轮：未命名角色封面行单名不重复'));
  assert.ok(!miaCoverName.textContent.includes('芽芽'), check('第二轮：封面行不再出现「芽芽 + 当前角色名」'));
  dispatch(querySelect(page.dom.body, '.player-entry'), 'click', {});
  const defProfile = collectByClass(page.dom.body, 'profile-dialog').find(d => d.open === true);
  assert.equal(querySelect(defProfile, '.cover-companion-name').textContent, '小诺',
    check('v4.8：默认角色封面行单名「小诺」不重复拼接'));
}

/* ===================== 4. 显示模式白名单 ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const normD = page.progress.Logic.normalizeCompanionDisplay;
  ['auto', 'always', 'minimal'].forEach(mode => {
    assert.equal(normD(mode), mode, check(`C2：显示模式 ${mode} 合法`));
  });
  assert.equal(normD('bogus'), 'auto', check('C2：未知模式回落 auto'));
  assert.equal(normD(undefined), 'auto', check('C2：缺省回落 auto'));
  assert.equal(normD(null), 'auto', check('C2：null 回落 auto'));
}

/* ===================== 5. 旧档案增量迁移不丢字段 ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const Logic = page.progress.Logic;
  /* 构造一份 v4.4 老档案：schemaVersion 4，settings 里没有 companionName/companionDisplay */
  const legacy = JSON.parse(archiveJson());
  legacy.settings = { dailyGoalMinutes: 45, companionPos: { x: 100, y: 80 }, showCompanion: true,
    showAchievementNotes: true, showReadingPosition: true, showUnavailableLessons: true,
    showEnglishTitles: true, shortcutsEnabled: false };
  legacy.xp = 320; legacy.coins = 55;
  const r = Logic.parseImport(JSON.stringify(legacy), []);
  assert.equal(r.ok, true, check('C1：v4.4 老档案可导入'));
  assert.equal(r.state.settings.companionName, '小诺', check('v4.8：老档案缺 companionName → 补默认小诺'));
  assert.equal(r.state.settings.companionDisplay, 'auto', check('C2：老档案缺 companionDisplay → 补默认 auto'));
  assert.equal(r.state.cosmetics.companionId, 'sprout', check('v4.8：老档案退役 companionId 存储层原样保留（不迁移）'));
  /* 其它字段一个不丢、不重算 */
  assert.equal(r.state.settings.dailyGoalMinutes, 45, check('C：老档案每日目标不丢'));
  const pos = r.state.settings.companionPos;
  assert.ok(pos && pos.x === 100 && pos.y === 80, check('C：老档案伙伴位置不丢'));
  assert.equal(r.state.settings.shortcutsEnabled, false, check('C：老档案显式 false 开关保留'));
  assert.equal(r.state.xp, 320, check('C：老档案 XP 不重算'));
  assert.equal(r.state.coins, 55, check('C：老档案叶片不丢'));
  /* 老档案里已有的自定义昵称应保留（若旧代码写过），不被默认覆盖 */
  const legacy2 = JSON.parse(archiveJson());
  legacy2.settings = fullSettings({ companionName: '旧名', companionDisplay: 'always' });
  const r2 = Logic.parseImport(JSON.stringify(legacy2), []);
  assert.equal(r2.state.settings.companionName, '旧名', check('C1：已有的自定义昵称保留'));
  assert.equal(r2.state.settings.companionDisplay, 'always', check('C2：已有的显示模式保留'));
}

/* ===================== 6. UI 品牌：按钮显示昵称 + 面板标题 + 去小奥 ===================== */
{
  /* 默认昵称小诺（v4.8：默认角色 nono） */
  const page = newPage({ storage: makeStorage() });
  const trigger = querySelect(page.dom.body, '.assistant-trigger');
  assert.equal(querySelect(trigger, '.assistant-name'), null,
    check('v4.9：触发按钮不再渲染角色名节点（只出头像）'));
  assert.ok(trigger.getAttribute('aria-label').includes('小诺'),
    check('v4.9：按钮 aria-label 仍含默认昵称小诺'));
  /* v4.9：Hero 也不出角色名（原来会显示「小诺 · 幼苗」） */
  assert.equal(querySelect(page.dom.body, '.hero-companion-name'), null,
    check('v4.9：Hero 不再渲染 .hero-companion-name 节点'));
  const heroFigure = querySelect(page.dom.body, '.hero-companion');
  assert.ok(heroFigure && !heroFigure.textContent.includes('小诺'),
    check('v4.9：Hero 角色区文本不含角色名（只出立绘）'));
  assert.ok(trigger.getAttribute('aria-label').includes('学习伙伴'), check('C1：按钮 aria-label 用「学习伙伴」'));
  assert.ok(!trigger.getAttribute('aria-label').includes('小奥'), check('C1：按钮 aria-label 不再出现「小奥」'));
  /* v4.8（⑮/⑲）：空档案首屏三处形象都是小诺正式图 */
  const triggerImg = querySelect(trigger, '.assistant-avatar');
  assert.ok(triggerImg && triggerImg.src.includes('assets/companions/nono/icon.webp'),
    check('v4.8：触发按钮形象是小诺正式 icon'));
  const headerAvatar = querySelect(page.dom.body, '.avatar-img');
  assert.ok(headerAvatar && headerAvatar.src.includes('assets/companions/nono/icon.webp'),
    check('v4.8：空档案 header 头像渲染小诺 icon（不是空白或几何回退图）'));
  const heroImg = querySelect(page.dom.body, '.hero-companion-img');
  assert.ok(heroImg && heroImg.src.includes('assets/companions/nono/study-happy.webp'),
    check('v4.8：空档案 Hero 是小诺 study 正式立绘'));

  const dialog = openAssistant(page);
  const title = querySelect(dialog, '#assistant-panel-title');
  assert.equal(title.textContent, '学习助手 · 小诺', check('v4.9：面板标题「学习助手 · 小诺」'));
  assert.ok(!dialog.textContent.includes('小奥'), check('C1：面板正文不再出现「小奥」'));
  assert.ok(dialog.textContent.includes('不是 AI'), check('C1：非 AI 边界声明保留'));

  /* 自定义昵称：seeded 档案（老档案 companionId=sprout + 旧 companionName 字段）
   * 里 companionName=小绿——旧昵称迁入退役角色 id 后仍保留（'小绿' 不在
   * legacyCompanionNames 里，是用户自己起的名字），按钮 aria-label 与面板标题
   * 都跟着变；形象层由 resolve 回落成小诺（v4.8 退役语义与旧昵称保留共存）。
   * v4.9 对照：同一份档案若把 companionName 写成本轮退役的旧默认名「芽芽」，
   * 则视为未命名、回落「小诺」——那条断言在 tests/legacy-identity.test.cjs。 */
  const page2 = newPage({ storage: seededStorage({ settings: fullSettings({ companionName: '小绿' }) }) });
  const trigger2 = querySelect(page2.dom.body, '.assistant-trigger');
  assert.equal(querySelect(trigger2, '.assistant-name'), null, check('v4.9：按钮无可见名字节点'));
  assert.ok(trigger2.getAttribute('aria-label').includes('小绿'), check('C1：自定义昵称保留在按钮 aria-label'));
  const triggerImg2 = querySelect(trigger2, '.assistant-avatar');
  assert.ok(triggerImg2 && triggerImg2.src.includes('assets/companions/nono/icon.webp'),
    check('v4.8：老档案 sprout 的触发按钮形象回落小诺 icon'));
  const dialog2 = openAssistant(page2);
  assert.equal(querySelect(dialog2, '#assistant-panel-title').textContent, '学习助手 · 小绿',
    check('C1：自定义昵称显示在面板标题'));
}

/* ===================== 7. 三种显示模式的面板渲染 ===================== */
{
  /* auto：默认视图有大人形 bust，二级视图（今天）没有大图 */
  const autoPage = newPage({ storage: seededStorage({ settings: fullSettings({ companionDisplay: 'auto' }) }) });
  let dialog = openAssistant(autoPage);
  assert.ok(querySelect(dialog, '.assistant-bust'), check('C2 auto：默认视图显示大人形'));
  assert.equal(querySelect(dialog, '.assistant-avatar-lg'), null, check('C2 auto：默认视图不是小头像模式'));
  dialog = openAssistant(autoPage, '今天');
  assert.equal(querySelect(dialog, '.assistant-always-bust'), null, check('C2 auto：二级视图不带大人形'));

  /* always：默认视图有 bust，二级视图也持续带大人形 */
  const alwaysPage = newPage({ storage: seededStorage({ settings: fullSettings({ companionDisplay: 'always' }) }) });
  dialog = openAssistant(alwaysPage);
  assert.ok(querySelect(dialog, '.assistant-bust'), check('C2 always：默认视图显示大人形'));
  dialog = openAssistant(alwaysPage, '今天');
  const alwaysBust = querySelect(dialog, '.assistant-always-bust');
  assert.ok(alwaysBust, check('C2 always：二级视图也持续显示大人形'));
  assert.ok(querySelect(alwaysBust, '.assistant-bust'), check('C2 always：二级视图大人形是 bust'));

  /* minimal：默认视图只有小头像，没有大人形 bust */
  const minPage = newPage({ storage: seededStorage({ settings: fullSettings({ companionDisplay: 'minimal' }) }) });
  dialog = openAssistant(minPage);
  assert.ok(querySelect(dialog, '.assistant-avatar-lg'), check('C2 minimal：默认视图显示小头像'));
  assert.equal(querySelect(dialog, '.assistant-bust'), null, check('C2 minimal：默认视图不显示大人形'));
  dialog = openAssistant(minPage, '今天');
  assert.equal(querySelect(dialog, '.assistant-always-bust'), null, check('C2 minimal：二级视图也不显示大人形'));
}

/* ===================== 8. 设置同源：两处都有昵称 + 显示模式字段 ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const { dom } = page;

  /* 伙伴面板设置视图 */
  const dialog = openAssistant(page, '设置');
  assert.ok(dialog.textContent.includes('学习伙伴昵称'), check('C1：伙伴面板设置含昵称字段'));
  assert.ok(dialog.textContent.includes('伙伴显示模式'), check('C2：伙伴面板设置含显示模式字段'));
  const nameInput = collectByClass(dialog, 'profile-input').find(el => el.tagName === 'INPUT');
  assert.ok(nameInput, check('C1：昵称字段是 input'));
  assert.equal(nameInput.value, '小诺', check('v4.8：昵称 input 当前值是小诺'));
  const displaySelect = collectByClass(dialog, 'profile-input')
    .find(el => el.tagName === 'SELECT' && [...el.children].some(o => o.value === 'minimal'));
  assert.ok(displaySelect, check('C2：显示模式字段是含 minimal 选项的 select'));

  /* 在伙伴面板改昵称 → 同一 settings，个人中心也读到（单一事实源） */
  nameInput.value = '小蓝';
  dispatch(nameInput, 'change', {});
  assert.equal(page.progress.settings().companionName, '小蓝', check('C1：面板改昵称写入同一 settings'));

  /* 个人中心设置 Tab 也有同款字段，且读到刚改的昵称 */
  dispatch(querySelect(dom.body, '.player-entry'), 'click', {});
  const profile = collectByClass(dom.body, 'profile-dialog').find(d => d.open === true);
  dispatch(querySelect(profile, '#profile-tab-settings'), 'click', {});
  assert.ok(profile.textContent.includes('学习伙伴昵称'), check('C1：个人中心设置含昵称字段'));
  assert.ok(profile.textContent.includes('伙伴显示模式'), check('C2：个人中心设置含显示模式字段'));
  const profileNameInput = collectByClass(profile, 'profile-input')
    .find(el => el.tagName === 'INPUT' && el.getAttribute('aria-label') && el.getAttribute('aria-label').includes('昵称'));
  assert.equal(profileNameInput.value, '小蓝', check('C1：个人中心昵称 input 读到同一份数据（小蓝）'));
}

/* ============ 9. 改昵称后触发按钮即时刷新（v4.9：观察点从可见文字改为 aria-label） ============ */
{
  const page = newPage({ storage: makeStorage() });
  const trigger = querySelect(page.dom.body, '.assistant-trigger');
  /* v4.9：按钮不再有可见文字，昵称的唯一可观察入口是 aria-label；断言强度不变
   * ——仍然要求「改完昵称按钮立刻跟上」，只是观察点跟着新的渲染口径走。 */
  assert.ok(trigger.getAttribute('aria-label').includes('小诺'), check('v4.9：初始按钮 aria-label 含小诺'));
  /* 模拟 UI 改昵称：走设置字段的 change（会触发 refreshAll → refreshAssistantTrigger） */
  const dialog = openAssistant(page, '设置');
  const nameInput = collectByClass(dialog, 'profile-input').find(el => el.tagName === 'INPUT');
  nameInput.value = '团团子';
  dispatch(nameInput, 'change', {});
  assert.ok(trigger.getAttribute('aria-label').includes('团团子'),
    check('C1：改昵称后右下角按钮 aria-label 即时刷新为新名字'));
  assert.equal(querySelect(trigger, '.assistant-name'), null,
    check('v4.9：刷新路径同样不引入可见名字节点'));
}

console.log(`companion-brand.test.cjs：全部 ${checks} 项断言通过 ✔`);
