/* v4.4 Batch 10 Stretch 功能测试（交接 §11 Stretch I）。
 *
 * 钉住六件事：
 *   I6/I7/I8 目录搜索 + 「已开放中文」「需要复习」过滤——默认视图仍是
 *            完整 46 课（19 链接 + 27 锁定红线不动），过滤只影响可见行，
 *            计数行客观事实不漂移；
 *   I9 命令面板 Ctrl/Cmd+K——全量 33 条命令无静默截断、输入过滤、
 *      ↑↓ 循环高亮（aria-activedescendant）、Enter 执行、关闭焦点归还；
 *   I1 最近使用主题（内存级）——「使用」成功才记录，重开 picker 可见、
 *      点击即预览、不新增持久化 key；
 *   I4 小奥当日成就庆祝——成就日期 == 今天才有祝贺行（确定性规则）；
 *   I5 世界地图 Foundations 完成度进度条——口径 = completedCount/已开放数；
 *   I12 microcopy——设置 Tab 不再出现「危险操作」后台腔。 */
const assert = require('node:assert/strict');

const {
  FIRST_LESSON, querySelect, collectByClass, dispatch, makeStorage, newPage, archiveJson, STORAGE_KEY
} = require('./dom-stub.cjs');

let checks = 0;
const check = label => { checks += 1; return label; };

const lessonPage = (storage, overrides) => newPage({
  storage: storage || makeStorage(), page: 'lesson', search: `?id=${FIRST_LESSON}`, ...(overrides || {})
});

/* 种子档案：makeStorage 的参数是方法覆盖不是数据，档案必须 setItem 进去
 *（STORAGE_KEY 从 dom-stub 导入，改名迁移后与 progress.js 当前 key 同源） */
function seededStorage(overrides) {
  const storage = makeStorage();
  storage.setItem(STORAGE_KEY, archiveJson(overrides));
  return storage;
}

function openCatalog(page) {
  dispatch(querySelect(page.dom.body, '.catalog-trigger'), 'click', {});
  const dialog = collectByClass(page.dom.body, 'catalog-dialog').find(d => d.open);
  assert.ok(dialog, check('目录 dialog 已打开'));
  return dialog;
}

function setSearch(dialog, value) {
  const search = querySelect(dialog, '.catalog-search');
  assert.ok(search, check('目录有搜索框'));
  search.value = value;
  dispatch(search, 'input', {});
}

function clickChip(dialog, label) {
  const chip = collectByClass(dialog, 'catalog-chip').find(c => c.textContent.includes(label));
  assert.ok(chip, check(`目录有「${label}」过滤 chip`));
  dispatch(chip, 'click', {});
  return chip;
}

/* ===================== 1. I6/I7/I8 目录搜索与过滤 ===================== */
{
  const page = lessonPage();
  const dialog = openCatalog(page);
  /* 默认视图 = 完整目录（红线不动） */
  assert.equal(collectByClass(dialog, 'lesson-link').length, 19, check('默认 19 个可点链接'));
  assert.equal(collectByClass(dialog, 'lesson-locked').length, 27, check('默认 27 个未开放锁定行'));
  const count0 = querySelect(dialog, '.catalog-count');
  assert.equal(count0.textContent, '', check('无过滤时计数行不出现（不打扰）'));

  /* 搜索：中英文都匹配 */
  setSearch(dialog, 'git');
  const links = collectByClass(dialog, 'lesson-link');
  const locked = collectByClass(dialog, 'lesson-locked');
  assert.ok(links.length + locked.length >= 1, check('搜索 git 有结果'));
  assert.ok(links.length + locked.length < 46, check('搜索确实过滤了列表'));
  assert.match(count0.textContent, /^显示 \d+ \/ 46 课$/, check(`计数行「${count0.textContent}」`));
  [...links, ...locked].forEach(row => {
    assert.match(row.textContent.toLowerCase(), /git/, check('每条结果都含关键词（zh/en/slug 三路匹配）'));
  });
  setSearch(dialog, '不存在这个词');
  assert.equal(collectByClass(dialog, 'lesson-link').length, 0, check('无匹配时列表为空'));
  assert.ok(querySelect(dialog, '.empty-state'), check('无匹配显示统一空状态（H5 语法）'));
  setSearch(dialog, '');
  assert.equal(collectByClass(dialog, 'lesson-link').length, 19, check('清空搜索恢复完整目录'));

  /* 过滤：已开放中文 */
  clickChip(dialog, '已开放中文');
  assert.equal(collectByClass(dialog, 'lesson-link').length, 19, check('「已开放中文」= 19 课'));
  assert.equal(collectByClass(dialog, 'lesson-locked').length, 0, check('「已开放中文」不含锁定行'));
  assert.match(querySelect(dialog, '.catalog-count').textContent, /^显示 19 \/ 46 课$/, check('计数行 19/46'));
  /* 分组计数不被过滤漂移 */
  const unitState = collectByClass(dialog, 'unit-state')[0];
  assert.match(unitState.textContent, /本站已开放 \d+ \/ \d+ 课/, check('分组计数仍是客观全量（不随过滤漂移）'));

  /* 过滤：需要复习（无标记 → 空态；标记一课 → 出现） */
  clickChip(dialog, '需要复习');
  assert.equal(collectByClass(dialog, 'lesson-link').length, 0, check('无复习标记时列表为空'));
  assert.ok(querySelect(dialog, '.empty-state').textContent.includes('需要复习'), check('复习空态给出行动指引'));
  /* 复习过滤：课页实例的当前课就是 FIRST_LESSON（setNeedsReview 走课程上下文） */
  assert.equal(page.progress.setNeedsReview(true), true, check('课页可标记需要复习'));
  clickChip(dialog, '全部'); /* 重开渲染（chip 点击触发 refresh） */
  clickChip(dialog, '需要复习');
  const reviewLinks = collectByClass(dialog, 'lesson-link');
  assert.equal(reviewLinks.length, 1, check('标记一课后「需要复习」过滤出它'));
  assert.ok(reviewLinks[0].textContent.includes('这套课程怎么学') || reviewLinks[0].getAttribute('href').includes(FIRST_LESSON),
    check('过滤出的正是标记的课'));
  /* 复习过滤尊重 progress 缺失降级：只依赖 lessonState，不炸 */
  clickChip(dialog, '全部');
  assert.equal(collectByClass(dialog, 'lesson-link').length, 19, check('回到全部恢复 19 链接'));
}

/* ===================== 2. I9 命令面板 ===================== */
{
  const page = lessonPage();
  const fireKey = props => page.fireWindow('keydown', Object.assign({ preventDefault() {} }, props));

  fireKey({ key: 'k', ctrlKey: true });
  const dialog = collectByClass(page.dom.body, 'command-dialog').find(d => d.open);
  assert.ok(dialog, check('Ctrl+K 打开命令面板'));
  assert.equal(page.dom.activeElement && page.dom.activeElement.className.includes('command-input'), true, check('打开即聚焦搜索框'));
  const items = collectByClass(dialog, 'command-item');
  assert.equal(items.length, 33, check('全量 33 条命令（14 动作 + 19 课），无静默截断'));
  assert.equal(querySelect(dialog, '.command-input').getAttribute('role'), 'combobox', check('input 有 combobox 角色'));
  const list = querySelect(dialog, '.command-list');
  assert.equal(list.getAttribute('role'), 'listbox', check('结果列表 role=listbox'));

  const input = querySelect(dialog, '.command-input');
  assert.equal(input.getAttribute('aria-activedescendant'), 'command-item-0', check('初始高亮第一条'));
  /* ↑↓ 循环 */
  dispatch(input, 'keydown', { key: 'ArrowDown', preventDefault() {} });
  assert.equal(input.getAttribute('aria-activedescendant'), 'command-item-1', check('↓ 移到第二条'));
  dispatch(input, 'keydown', { key: 'ArrowUp', preventDefault() {} });
  dispatch(input, 'keydown', { key: 'ArrowUp', preventDefault() {} });
  assert.equal(input.getAttribute('aria-activedescendant'), `command-item-${items.length - 1}`, check('↑ 在头部环绕到尾部'));
  dispatch(input, 'keydown', { key: 'Home', preventDefault() {} });
  assert.equal(input.getAttribute('aria-activedescendant'), 'command-item-0', check('Home 回头部'));
  dispatch(input, 'keydown', { key: 'End', preventDefault() {} });
  assert.equal(input.getAttribute('aria-activedescendant'), `command-item-${collectByClass(dialog, 'command-item').length - 1}`, check('End 到尾部'));

  /* 过滤：中文课程名 */
  dispatch(input, 'keydown', { key: 'Home', preventDefault() {} });
  input.value = 'git';
  dispatch(input, 'input', {});
  const filtered = collectByClass(dialog, 'command-item');
  assert.ok(filtered.length >= 1 && filtered.length < 33, check('输入 git 过滤生效'));
  filtered.forEach(item => {
    assert.match(item.textContent.toLowerCase(), /git/, check('命令面板过滤结果都含关键词'));
  });
  input.value = 'zzz 没有这个';
  dispatch(input, 'input', {});
  assert.ok(querySelect(dialog, '.command-empty'), check('命令面板无匹配显示空态'));
  input.value = '';
  dispatch(input, 'input', {});

  /* Enter 执行高亮项（第一条 = 回到首页） */
  dispatch(input, 'keydown', { key: 'Enter', preventDefault() {} });
  assert.equal(page.sandbox.location.href, 'index.html', check('Enter 执行「回到首页」'));
  assert.equal(dialog.open, false, check('执行后面板关闭'));

  /* 重开：课程跳转命令真实可用 */
  fireKey({ key: 'k', ctrlKey: true });
  const d2 = collectByClass(page.dom.body, 'command-dialog').find(d => d.open);
  const input2 = querySelect(d2, '.command-input');
  input2.value = FIRST_LESSON; /* slug 匹配 */
  dispatch(input2, 'input', {});
  const lessonItems = collectByClass(d2, 'command-item');
  assert.ok(lessonItems.length >= 1, check('slug 能搜到课程命令'));
  dispatch(lessonItems[0], 'click', {});
  assert.ok(page.sandbox.location.href.includes('lesson.html'), check(`点击课程命令跳转（${page.sandbox.location.href}）`));

  /* metaKey（Cmd+K）同样打开；其他修饰键组合不拦 */
  page.sandbox.location.href = 'http://127.0.0.1:8765/lesson.html';
  fireKey({ key: 'k', metaKey: true });
  assert.ok(collectByClass(page.dom.body, 'command-dialog').some(d => d.open), check('Cmd+K 同样打开'));
  collectByClass(page.dom.body, 'command-dialog').forEach(d => { if (d.open) d.close(); });
  fireKey({ key: 'j', ctrlKey: true });
  assert.equal(page.sandbox.location.href, 'http://127.0.0.1:8765/lesson.html', check('Ctrl+J 等浏览器快捷键不被拦截'));

  /* shortcutsEnabled=false 时 Ctrl+K 也不响应 */
  const page2 = lessonPage(seededStorage({ settings: { dailyGoalMinutes: 20, companionPos: null, showCompanion: true, showAchievementNotes: true, showReadingPosition: true, showUnavailableLessons: true, showEnglishTitles: true, shortcutsEnabled: false } }));
  page2.fireWindow('keydown', { key: 'k', ctrlKey: true, preventDefault() {} });
  assert.equal(collectByClass(page2.dom.body, 'command-dialog').length, 0, check('关闭快捷键设置后 Ctrl+K 不响应'));
}

/* ===================== 3. I1 最近使用主题（内存级） ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const { dom } = page;
  const openPicker = () => {
    dispatch(querySelect(dom.body, '.theme-quick'), 'click', {});
    return collectByClass(dom.body, 'picker-dialog').find(d => d.open);
  };
  let picker = openPicker();
  assert.equal(collectByClass(picker, 'theme-recent-chip').length, 0, check('没用过主题时「最近使用」行不渲染'));
  /* 预览夜空（解锁的 dark 主题）→ 使用 */
  const nightCard = collectByClass(picker, 'theme-card').find(c => c.textContent.includes('夜空'));
  assert.ok(!nightCard.classList.contains('is-locked'), check('夜空主题已解锁（既有 10 套）'));
  dispatch(querySelect(nightCard, '.theme-card-preview'), 'click', {});
  assert.equal(dom.documentElement.dataset.theme, 'night', check('点卡进入预览'));
  /* 预览点击触发 refresh()，按钮已在同一 dialog 内变为「使用预览中的主题」——
   * 不能重新 openPicker（openThemePicker 会先重置预览，这是设计行为） */
  const useBtn = collectByClass(picker, 'button-secondary').find(b => b.textContent.includes('使用预览中的主题'));
  assert.ok(useBtn, check('预览后出现「使用预览中的主题」'));
  dispatch(useBtn, 'click', {});
  assert.equal(dom.documentElement.dataset.theme, 'night', check('使用后主题持久切换'));
  /* 重开 picker：最近使用行出现，点击即预览 */
  picker = openPicker();
  const recent = collectByClass(picker, 'theme-recent-chip');
  assert.equal(recent.length, 1, check('重开 picker 出现 1 个最近使用 chip'));
  assert.ok(recent[0].textContent.includes('夜空'), check('最近使用 = 刚用的「夜空」'));
  /* 切回园地再开 picker：最近使用含两个（去重、新的在前） */
  const gardenCard = collectByClass(picker, 'theme-card').find(c => c.textContent.includes('园地'));
  dispatch(querySelect(gardenCard, '.theme-card-preview'), 'click', {});
  const useGarden = collectByClass(picker, 'button-secondary').find(b => b.textContent.includes('使用预览中的主题'));
  dispatch(useGarden, 'click', {});
  picker = openPicker();
  const recent2 = collectByClass(picker, 'theme-recent-chip');
  assert.equal(recent2.length, 2, check('最近使用累计 2 个'));
  assert.ok(recent2[0].textContent.includes('园地') && recent2[1].textContent.includes('夜空'), check('最近使用按时间倒序'));
  /* 点击最近使用 chip = 预览（不保存） */
  dispatch(recent2[1], 'click', {});
  assert.equal(dom.documentElement.dataset.theme, 'night', check('点最近使用 chip 即预览'));
  assert.equal(JSON.parse(page.sandbox.localStorage.getItem(STORAGE_KEY)).cosmetics.themeId, 'garden', check('预览不保存：档案里仍是园地'));
  /* 不新增持久化 key：档案 key 之外没有任何新 localStorage 条目 */
  const keys = [];
  for (let i = 0; i < page.sandbox.localStorage.length; i += 1) keys.push(page.sandbox.localStorage.key(i));
  assert.deepEqual(keys, [STORAGE_KEY], check('最近使用纯内存：localStorage 无新增 key'));
}

/* ===================== 4. I4 小奥当日成就庆祝 ===================== */
{
  const today = new Date().toISOString().slice(0, 10);
  /* 今天解锁了成就的档案。companionId 用 odin-boy（procedural 人形带 bust
   * 多表情生成器，celebrate 走生成器输出；v4.8 起默认角色是 fixed-art 整图
   * 的小诺，历史默认 sprout 已退役） */
  const storage = seededStorage({
    achievements: { 'first-lesson': `${today}T09:00:00.000Z` },
    cosmetics: { purchases: {}, companionId: 'odin-boy', themeId: 'garden' }
  });
  const page = newPage({ storage });
  dispatch(querySelect(page.dom.body, '.assistant-trigger'), 'click', {});
  const dialog = collectByClass(page.dom.body, 'assistant-dialog').find(d => d.open);
  const cheer = querySelect(dialog, '.assistant-cheer');
  assert.ok(cheer, check('今天解锁成就 → 小奥 home 有祝贺行'));
  assert.ok(cheer.textContent.includes('今天解锁了成就'), check('祝贺行陈述事实'));
  const bust = querySelect(dialog, '.assistant-bust');
  assert.ok(bust && String(bust.alt).includes('庆祝'), check(`当日成就 → celebrate 表情（alt=${bust ? bust.alt : ''}）`));
  dialog.close();

  /* 成就是昨天的 → 不祝贺（确定性规则：日期 == 今天） */
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const page2 = newPage({
    storage: seededStorage({ achievements: { 'first-lesson': `${yesterday}T09:00:00.000Z` } })
  });
  dispatch(querySelect(page2.dom.body, '.assistant-trigger'), 'click', {});
  const dialog2 = collectByClass(page2.dom.body, 'assistant-dialog').find(d => d.open);
  assert.equal(querySelect(dialog2, '.assistant-cheer'), null, check('昨天的成就不触发今日祝贺'));
}

/* ===================== 5. I5 世界地图完成度进度条 ===================== */
{
  const page = newPage({ storage: makeStorage() });
  /* v4.5（交接 B）：世界地图不再是首页独立卡，改从「学习地图」sheet 的世界地图 Tab 进入 */
  const mapCard = collectByClass(page.dom.body, 'entry-card').find(c => c.textContent.includes('学习地图'));
  dispatch(mapCard, 'click', {});
  const sheet = collectByClass(page.dom.body, 'sheet').find(s => s.open);
  const worldTab = collectByClass(sheet, 'map-tab').find(t => t.textContent.includes('世界地图'));
  dispatch(worldTab, 'click', {});
  const fnd = collectByClass(sheet, 'world-card').find(c => c.classList.contains('is-open'));
  const mini = querySelect(fnd, '.world-mini-progress');
  assert.ok(mini, check('Foundations 卡有完成度进度条'));
  assert.equal(mini.getAttribute('aria-hidden'), 'true', check('进度条装饰性（数字已在 stats 文本里）'));
  const fill = querySelect(mini, '.today-mini-fill');
  assert.equal(fill.style.width, '0%', check('零完成时 width 0%'));
  /* 锁定 World 无进度条（没有可完成的中文内容，不放假进度） */
  const locked = collectByClass(sheet, 'world-card').find(c => c.classList.contains('is-locked'));
  assert.equal(querySelect(locked, '.world-mini-progress'), null, check('未开放 World 不放进度条'));
  sheet.close();
}

/* ===================== 6. I12 microcopy ===================== */
{
  const page = newPage({ storage: makeStorage() });
  dispatch(querySelect(page.dom.body, '.player-entry'), 'click', {});
  const dialog = collectByClass(page.dom.body, 'profile-dialog').find(d => d.open);
  dispatch(querySelect(dialog, '#profile-tab-settings'), 'click', {});
  assert.ok(!dialog.textContent.includes('危险操作'), check('设置 Tab 不再有「危险操作」后台腔'));
  assert.ok(dialog.textContent.includes('请谨慎操作'), check('换成直说后果的「请谨慎操作」'));
  assert.ok(dialog.textContent.includes('自动留一份备份'), check('安全网（重置前自动备份）讲在明处'));
  assert.ok(dialog.textContent.includes('重置学习进度'), check('重置按钮本体不变'));
}

console.log(`通过：Batch 10 Stretch 功能 ${checks} 项断言（目录搜索/已开放/需要复习过滤、命令面板 Ctrl+K 全量 33 条无截断/键盘导航/执行跳转、最近使用主题内存级零新 key、小奥当日成就庆祝、世界地图完成度进度条、microcopy 去后台腔）。`);
