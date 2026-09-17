/* v4.5 Batch 8（交接 Core G）：个人中心 / 学习伙伴 / 主题入口收口审计。
 *
 * Core G 的收口目标（大部分实现已随 Batch 3/4/5 落地，本测试把不变量钉死，
 * 防止后续改动悄悄回退）：
 *   1. 个人中心第一屏是「我的形象」，不是设置后台——默认 Tab = 形象，
 *      Tab 顺序 形象 / 成就收藏 / 统计 / 设置；
 *   2. 形象 Tab 顶部按三个用户概念区块组织：我的形象 / 学习伙伴 / 页面主题。
 *      头像与头像框、伙伴与伙伴装扮分别在对应区块内提供五个紧邻操作入口，
 *      每张卡直接打开对应 picker；
 *   3. 主题不埋深：header 常驻快捷入口 + 形象 Tab 卡，两路直达同一 picker；
 *   4. 学习设置在个人中心只有一个入口（设置 Tab），学习伙伴面板「设置」
 *      打开同一套内容——同一构建函数（buildUiSettingsFields）、同一份
 *      progress.settings() 事实源：字段清单一一对应，任一侧改动两侧同步；
 *   5. 伙伴装扮从形象 Tab 与伙伴面板均可进入同一个 picker（Batch 5 已实现，
 *      此处钉住双入口的存在性，行为细节见 companion-wardrobe.test.cjs）。
 *
 * 运行：node tests/profile-ia.test.cjs */
const assert = require('node:assert/strict');

let checks = 0;
const check = label => { checks += 1; return label; };

const {
  querySelect, collectByClass, dispatch, makeStorage, newPage
} = require('./dom-stub.cjs');

function openProfile(page) {
  dispatch(querySelect(page.dom.body, '.player-entry'), 'click', {});
  const dialog = collectByClass(page.dom.body, 'profile-dialog').find(d => d.open === true);
  assert.ok(dialog, check('G：点击右上角玩家入口打开个人中心'));
  return dialog;
}

/* ===================== 1. 第一屏 =「我的形象」，不是设置后台 ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const dialog = openProfile(page);
  const tabs = collectByClass(dialog, 'profile-tab');
  assert.deepEqual(tabs.map(t => t.textContent), ['形象', '成就收藏', '统计', '设置'],
    check('G：Tab 顺序 = 形象 / 成就收藏 / 统计 / 设置（形象打头）'));
  const selected = tabs.filter(t => t.getAttribute('aria-selected') === 'true');
  assert.equal(selected.length, 1, check('G：恰有一个选中 Tab'));
  assert.equal(selected[0].textContent, '形象', check('G：默认第一屏是「形象」（不是设置后台）'));
  const panel = querySelect(dialog, '.profile-tabpanel');
  assert.ok(panel.textContent.includes('我的形象'), check('G：第一屏面板标题「我的形象」'));
  assert.ok(!panel.textContent.includes('学习档案'), check('G：第一屏不含档案/设置后台内容'));
  /* 用户身份行：昵称编辑入口位于首屏顶部，旧“当前装备”朗读句删除 */
  assert.ok(querySelect(panel, '.identity-name-field'), check('v4.5.1：昵称编辑入口位于用户身份区首位'));
  assert.ok(querySelect(panel, '.profile-nickname'), check('G：第一屏有昵称'));
  assert.ok(!panel.textContent.includes('当前装备：'), check('v4.5.1：第一屏不再显示当前装备长句'));
}

/* ===================== 2. 形象 Tab 三个概念区块与五个 picker 操作 ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const dialog = openProfile(page);
  const grid = querySelect(dialog, '.identity-entries');
  assert.ok(grid, check('G：形象 Tab 有概念区块网格'));
  const groups = collectByClass(grid, 'appearance-group');
  assert.deepEqual(groups.map(c => querySelect(c, '.appearance-name').textContent),
    ['我的形象', '学习伙伴', '页面主题'],
    check('v4.5.1：区块顺序 = 我的形象 / 学习伙伴 / 页面主题'));
  assert.equal(collectByClass(grid, 'appearance-group-avatar').length, 1, check('v4.5.1：头像+头像框只有一个组合预览区'));
  assert.equal(collectByClass(grid, 'appearance-group-companion').length, 1, check('v4.5.1：伙伴+装扮只有一个组合预览区'));
  assert.equal(collectByClass(grid, 'appearance-group-avatar')[0].children.filter(c => c.classList && c.classList.contains('avatar')).length, 0,
    check('v4.5.1：组合预览主体嵌在 group body，不重复渲染同级头像'));

  const CASES = [
    ['更换头像', '更换头像'],
    ['更换头像框', '更换头像框'],
    ['更换伙伴形象', '更换学习伙伴形象'],
    ['更换伙伴装扮', '学习伙伴装扮'],
    ['更换主题', '更换页面主题']
  ];
  for (const [actionName, pickerTitle] of CASES) {
    const p2 = newPage({ storage: makeStorage() });
    const d2 = openProfile(p2);
    const action = collectByClass(d2, 'appearance-action').find(c => c.textContent === actionName);
    assert.ok(action, check(`G：「${actionName}」操作存在`));
    dispatch(action, 'click', {});
    const picker = collectByClass(p2.dom.body, 'picker-dialog').find(d => d.open === true);
    assert.ok(picker, check(`G：点「${actionName}」打开 picker`));
    assert.ok(picker.textContent.includes(pickerTitle), check(`G：「${actionName}」打开的是「${pickerTitle}」`));
  }
}

/* ===================== 3. 主题不埋深：header 常驻快捷入口（两页都有） ===================== */
{
  for (const pageKind of ['index', 'lesson']) {
    const page = pageKind === 'index'
      ? newPage({ storage: makeStorage() })
      : newPage({ storage: makeStorage(), page: 'lesson', search: '?id=how-this-course-will-work' });
    const quick = querySelect(page.dom.body, '.theme-quick');
    assert.ok(quick, check(`G：${pageKind} 页 header 有主题快捷入口（不埋深）`));
    assert.ok(quick.getAttribute('aria-label').includes('更换页面主题'), check(`G：${pageKind} 主题按钮 aria-label 含当前主题`));
    dispatch(quick, 'click', {});
    const picker = collectByClass(page.dom.body, 'picker-dialog').find(d => d.open === true);
    assert.ok(picker && picker.textContent.includes('更换页面主题'), check(`G：${pageKind} 一键直达主题 picker`));
  }
}

/* ===================== 4. 学习设置：个人中心单入口 + 伙伴面板同源同步 ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const dialog = openProfile(page);
  /* 个人中心只有一个设置入口：设置 Tab（形象/成就/统计 Tab 里没有第二份设置字段） */
  const identityToggles = collectByClass(querySelect(dialog, '.profile-tabpanel'), 'setting-toggle');
  assert.equal(identityToggles.length, 0, check('G：形象 Tab 不塞界面开关（第一屏不是设置后台）'));

  /* 打开设置 Tab */
  dispatch(querySelect(dialog, '#profile-tab-settings') || collectByClass(dialog, 'profile-tab').find(t => t.textContent === '设置'), 'click', {});
  const settingsDialog = collectByClass(page.dom.body, 'profile-dialog').find(d => d.open === true);
  const panel = querySelect(settingsDialog, '.profile-tabpanel');
  assert.ok(panel.textContent.includes('学习设置'), check('G：设置 Tab 有「学习设置」'));
  assert.ok(panel.textContent.includes('学习档案'), check('G：设置 Tab 有「学习档案」（导出/导入唯一入口）'));
  assert.ok(panel.textContent.includes('关于本站'), check('G：设置 Tab 有「关于本站」（Batch 2 A2 同源区块）'));
  const profileToggles = collectByClass(panel, 'setting-toggle');
  const profileLabels = profileToggles.map(t => t.children.find(c => c.tagName === 'SPAN').textContent);
  assert.deepEqual(profileLabels,
    ['显示学习伙伴', '成就解锁提示', '显示本页阅读位置', '显示未开放课程', '显示英文标题', '键盘快捷键'],
    check('G：个人中心设置 Tab 六个界面开关（唯一实现）'));
  assert.ok(panel.textContent.includes('学习伙伴面板里的「设置」打开的就是这一套'),
    check('G：设置 Tab 明示与伙伴面板同源'));

  /* 伙伴面板「设置」视图：同一套字段（六个开关 + 每日目标 + 昵称 + 显示模式） */
  const trigger = querySelect(page.dom.body, '.assistant-trigger');
  dispatch(trigger, 'click', {});
  const assistant = collectByClass(page.dom.body, 'assistant-dialog').find(d => d.open === true);
  const nav = collectByClass(assistant, 'assistant-nav-btn').find(b => b.textContent === '设置');
  dispatch(nav, 'click', {});
  const assistantDialog = collectByClass(page.dom.body, 'assistant-dialog').find(d => d.open === true);
  const assistantToggles = collectByClass(assistantDialog, 'setting-toggle');
  const assistantLabels = assistantToggles.map(t => t.children.find(c => c.tagName === 'SPAN').textContent);
  assert.deepEqual(assistantLabels, profileLabels, check('G：伙伴面板设置视图的开关清单与个人中心逐项一致（同一构建函数）'));
  assert.ok(assistantDialog.textContent.includes('与个人中心 → 设置是同一套设置'), check('G：伙伴面板明示同源'));
  assert.ok(querySelect(assistantDialog, '.daily-goal-field'), check('G：每日目标两处同在'));
  assert.ok(collectByClass(assistantDialog, 'button-secondary').some(b => b.textContent.includes('打开伙伴装扮')),
    check('G5：伙伴面板设置有「打开伙伴装扮」入口（与形象 Tab 同一 picker，行为见 companion-wardrobe.test）'));

  /* 单份事实源：伙伴面板里关一个开关 → progress.settings() 与个人中心重渲染同步 */
  const notesToggle = assistantToggles.find(t => t.textContent.includes('成就解锁提示'));
  const notesBox = notesToggle.children.find(c => c.tagName === 'INPUT');
  notesBox.checked = false;
  dispatch(notesBox, 'change', {});
  assert.equal(page.progress.settings().showAchievementNotes, false, check('G：伙伴面板改动写入唯一事实源 progress.settings()'));
  /* 个人中心设置 Tab 重画后开关同步为关 */
  const panel2 = querySelect(collectByClass(page.dom.body, 'profile-dialog').find(d => d.open === true), '.profile-tabpanel');
  const profileToggle2 = collectByClass(panel2, 'setting-toggle').find(t => t.textContent.includes('成就解锁提示'));
  const box2 = profileToggle2.children.find(c => c.tagName === 'INPUT');
  assert.equal(box2.checked, false, check('G：伙伴面板改动后个人中心同一开关同步为关（不允许两套状态）'));
  /* 反向：个人中心开回来 → 伙伴面板也同步 */
  box2.checked = true;
  dispatch(box2, 'change', {});
  assert.equal(page.progress.settings().showAchievementNotes, true, check('G：个人中心改回同样写入唯一事实源'));
  const assistantDialog2 = collectByClass(page.dom.body, 'assistant-dialog').find(d => d.open === true);
  const assistantToggle3 = collectByClass(assistantDialog2, 'setting-toggle').find(t => t.textContent.includes('成就解锁提示'));
  assert.equal(assistantToggle3.children.find(c => c.tagName === 'INPUT').checked, true, check('G：反向同步成立（双向都只有一份数据）'));
}

/* ===================== 5. 命令面板直达四个 Tab（收口后的寻路兜底） ===================== */
{
  /* 四个 Tab 都能被外部直达（首页入口卡与命令面板共用 openProfilePanel(tab) 路由） */
  for (const [tabId, marker] of [['identity', '我的形象'], ['achievements', '成就'], ['stats', '统计'], ['settings', '学习设置']]) {
    const p = newPage({ storage: makeStorage() });
    dispatch(querySelect(p.dom.body, '.player-entry'), 'click', {});
    const d = collectByClass(p.dom.body, 'profile-dialog').find(x => x.open === true);
    const tabBtn = collectByClass(d, 'profile-tab').find(t => t.id === `profile-tab-${tabId}`);
    assert.ok(tabBtn, check(`G：Tab 按钮 #profile-tab-${tabId} 存在`));
    dispatch(tabBtn, 'click', {});
    const panel = querySelect(collectByClass(p.dom.body, 'profile-dialog').find(x => x.open === true), '.profile-tabpanel');
    assert.ok(panel.textContent.includes(marker), check(`G：直达 ${tabId} Tab 渲染「${marker}」内容`));
  }
}

/* ===================== 6. 第二轮：头像系统复用 Companion 正式图片 ===================== */
{
  /* id 命名空间可写档、刷新不丢（sanitize 不误回落默认头像） */
  const storage = makeStorage();
  const page = newPage({ storage });
  const setResult = page.progress.setAvatarId('companion-mia');
  assert.equal(setResult.ok, true, check('第二轮：companion-mia 通过档案校验可写入'));
  assert.equal(page.progress.profile().avatarId, 'companion-mia', check('第二轮：profile.avatarId 原样保存'));
  const reloaded = newPage({ storage });
  assert.equal(reloaded.progress.profile().avatarId, 'companion-mia',
    check('第二轮：companion 头像 id 刷新后不被清洗回落'));
  /* 渲染走 companion 正式 icon（fixed-art 角色） */
  const headerAvatar = querySelect(reloaded.dom.body, '.avatar-img');
  assert.ok(headerAvatar && headerAvatar.src.includes('assets/companions/mia/icon.webp'),
    check('第二轮：头像 img 指向学习伙伴正式 icon'));

  /* 未知 companion id 回落默认 SVG 头像，不崩不空。v4.8：默认头像本身已是
   * companion-nono（文件图），必须落盘 + 重载后断言渲染结果，才能真正验证
   * 「未知 id → 几何清单回落」这条链路（此前默认就是 SVG，断言区分不出刷新）。 */
  const bogusStorage = makeStorage();
  const bogusPage = newPage({ storage: bogusStorage });
  bogusPage.progress.setAvatarId('companion-not-exist');
  const bogus = newPage({ storage: bogusStorage });
  const bogusImg = querySelect(bogus.dom.body, '.avatar-img');
  assert.ok(bogusImg && bogusImg.src.startsWith('data:image/svg+xml'),
    check('第二轮：未知 companion 头像 id 回落默认 SVG 头像'));

  /* picker（v4.8 信息架构重排）：companion 头像与几何头像合并同一面板——
   * 「已拥有」组置顶（少女→宠物→几何图标），四类解锁组只列未拥有款；
   * companion 头像解锁与角色 picker 同源（type:'companion' 购买记录） */
  const pickPage = newPage({ storage: makeStorage() });
  dispatch(querySelect(pickPage.dom.body, '.player-entry'), 'click', {});
  const dialog = collectByClass(pickPage.dom.body, 'profile-dialog').find(d => d.open === true);
  const openAvatar = collectByClass(dialog, 'appearance-action').find(b => b.textContent.includes('更换头像'));
  dispatch(openAvatar, 'click', {});
  const picker = collectByClass(pickPage.dom.body, 'picker-dialog').find(d => d.open === true);
  assert.ok(picker, check('第二轮：头像 picker 正常打开'));
  const titles = collectByClass(picker, 'collection-group-title').map(h => h.textContent);
  assert.ok(titles.length && titles[0].startsWith('已拥有'), check('v4.8：第一组是「已拥有」置顶'));
  assert.ok(/^已拥有 \d+ \/ \d+$/.test(titles[0]), check('v4.8：已拥有组标题沿用「已拥有 N / M」口径'));
  assert.ok(!titles.some(t => t.includes('默认可用')), check('v4.8：默认款全部置顶后「默认可用」组不再渲染'));
  assert.ok(titles.some(t => t.includes('学习解锁')) && titles.some(t => t.includes('叶片解锁')),
    check('v4.8：四类解锁分组保留（只列未拥有款）'));
  const grids = collectByClass(picker, 'avatar-options');
  const ownedNames = [...grids[0].children].map(li => (querySelect(li, '.avatar-option-name') || {}).textContent);
  const idx = name => ownedNames.indexOf(name);
  assert.ok(idx('小诺') === 0 && idx('米娅') === 1, check('v4.8：已拥有组内少女最前且维持 registry humans 顺序（小诺→米娅）'));
  assert.ok(idx('小白') > idx('少女') && idx('桃桃') > idx('小白'), check('v4.8：宠物排在少女（含其他人形）之后'));
  /* v4.10 改写：本条原来用「终端提示符」当几何图标的代表项，而它已进登记表
   * retiredAvatarIds（v4.9 起选中即被归一化，v4.10 起不再渲染成面板格子），
   * 因此换成同为 default 解锁、仍在面板里的「尖括号与斜杠」。钉住的不变量
   * （几何图标组排在宠物之后）一字未改，强度不降；退役项本身由下方 v4.10
   * 专项断言覆盖，覆盖面只增不减。 */
  assert.ok(idx('尖括号与斜杠') > idx('叶舟'), check('v4.8：几何图标排在宠物之后'));
  assert.ok(idx('艾拉') === -1, check('v4.8：未拥有的艾拉不在已拥有组（列在学习解锁组，不重复出现）'));
  assert.ok(!ownedNames.includes('幼芽'), check('v4.8：退役 sprout 不出现在已拥有组'));
  const options = collectByClass(picker, 'avatar-option');
  const nameOf = o => (querySelect(o, '.avatar-option-name') || {}).textContent;
  const w = pickPage.sandbox.window;
  /* v4.10 改写：期望总数从「avatars.js 全清单 + 非退役角色」改成「全清单减去
   * 登记表退役头像 + 非退役角色」。原断言钉的是「几何头像与角色头像全部并入
   * 面板且各出现一次」，这条不变量原样保留，只是几何侧口径跟着 v4.10 的新事实
   * （退役头像不进面板）走；仍然由事实源推导、不写死数字，强度不降。 */
  const retiredAvatarIds = w.ODIN_COMPANION_REGISTRY.retiredAvatarIds;
  assert.ok(retiredAvatarIds.length > 0, check('v4.10：登记表确有退役头像（下面的过滤断言不是空跑）'));
  const expectedTotal = w.ODIN_AVATARS.avatars.filter(a => !retiredAvatarIds.includes(a.id)).length
    + w.ODIN_COMPANION_VIEW.listByKind().length;
  assert.equal(options.length, expectedTotal, check('v4.10：可选几何头像 + 非退役角色头像全部并入面板且各出现一次'));
  assert.equal(new Set(options.map(nameOf)).size, options.length, check('v4.8：面板内无重复项'));
  assert.ok(!options.some(o => nameOf(o) === '幼芽'), check('v4.8：退役 sprout 不出现在头像面板'));
  /* v4.10 新增：退役头像（如 v4.8 之前的默认头像「终端提示符」）在面板里
   * 一格都不渲染——不留「能点、点了没反应、也没说明」的项。资产数据仍在
   * avatars.js（37 项，profile.test 钉住），只是不再出现在选择层。 */
  for (const retired of w.ODIN_AVATARS.avatars.filter(a => retiredAvatarIds.includes(a.id))) {
    assert.ok(!options.some(o => nameOf(o) === retired.zh),
      check(`v4.10：退役头像「${retired.zh}」不渲染成面板格子`));
    assert.equal(idx(retired.zh), -1, check(`v4.10：退役头像「${retired.zh}」不在已拥有组`));
  }
  const miaOption = options.find(o => nameOf(o) === '米娅');
  assert.ok(miaOption, check('第二轮：米娅的 companion 头像入口存在'));
  assert.equal(miaOption.disabled, false, check('第二轮：默认解锁的 companion 头像可选'));
  dispatch(miaOption, 'click', {});
  assert.equal(pickPage.progress.profile().avatarId, 'companion-mia',
    check('第二轮：点击即选中 companion 头像并写入档案'));
  const lockedOption = options.find(o => nameOf(o) === '小紫');
  assert.ok(lockedOption && lockedOption.disabled === true, check('第二轮：coins 未解锁的 companion 头像不可点'));
  assert.ok(((querySelect(lockedOption, '.collection-state') || {}).textContent || '').length > 0,
    check('第二轮：锁定 companion 头像显示具体解锁条件'));
}

console.log(`profile-ia.test.cjs：全部 ${checks} 项断言通过 ✔`);
