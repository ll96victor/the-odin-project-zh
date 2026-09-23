/* v4.3 Core A 组回归测试（交接 A1 / A2 / A3 / A4）。
 *
 * 与 progress.test.cjs 等纯逻辑测试不同，本文件用**最小 DOM stub** 在 Node vm
 * 沙箱里跑 app.js 的真实挂载路径（index.html 的完整脚本加载顺序），复刻浏览器
 * 的关键语义——尤其是“未连接进 document 的元素 getBoundingClientRect 返回
 * 0×0、display:none 的元素也返回 0×0”——因此能钉住 v4.2 小奥按钮“先测尺寸后
 * append”导致按钮落到视口外的真实缺陷（交接 A1），以及 bfcache/pageshow 同步
 * （A3）与自动读档安全（A2）的浏览器适配层行为。
 *
 * 覆盖：
 *   1. A1：挂载顺序（先 append 再测尺寸）、默认可见在右下角、resize 重新 clamp、
 *      拖动 + 位置持久化 + 拖动后点击抑制、showCompanion 开关的可见入口；
 *   2. A2：自动读档失败不覆盖原存储（写入冻结 + UI 告警 + console.warn）、
 *      未知 lesson id 宽容保留已知数据、显式导入仍然严格、导入成功解除保护；
 *   3. A3：pageshow(persisted) 重载——首页数字立即正确、课页勾选框同步、
 *      persisted=false 不触发重载；
 *   4. A4：v4.2 既有修复不回退（保存失败提示、file:// 回退）。 */
const assert = require('node:assert/strict');

let checks = 0;
const check = label => { checks += 1; return label; };

/* v4.4：stub 基础设施抽到 tests/dom-stub.cjs 与 home-ia.test.cjs 共享 */
const {
  FIRST_LESSON, STORAGE_KEY,
  querySelect, collectByClass, dispatch, makeStorage,
  newPage, archiveJson, lessonEntryJson, dom_consoleHas
} = require('./dom-stub.cjs');

/* ===================== 1. A1：挂载顺序与默认可见 ===================== */
{
  const storage = makeStorage();
  const page = newPage({ storage });
  const { dom, rectTrace } = page;

  const trigger = querySelect(dom.body, '.assistant-trigger');
  assert.ok(trigger, check('小奥按钮已挂载'));
  assert.equal(trigger.isConnected(), true, check('小奥按钮连接在 body 树里'));

  /* 挂载顺序契约：对该按钮的**第一次** getBoundingClientRect 必须发生在
   * append 之后（connected=true）。v4.2 的缺陷正是先测（0×0）后 append。 */
  const firstRect = rectTrace.find(record => record.cls.includes('assistant-trigger'));
  assert.ok(firstRect, check('定位过程测量过按钮尺寸'));
  assert.equal(firstRect.connected, true, check('A1：第一次测尺寸时按钮已 append 进 body（先 append 再测再定位）'));
  assert.ok(firstRect.width > 0 && firstRect.height > 0, check('A1：测到的是真实非零尺寸'));

  /* 默认位置：右下角且完整可见（1280×800 视口、152×44 按钮、12px 边距） */
  assert.equal(trigger.style.left, '1116px', check('A1：默认 left = 视口宽 - 按钮宽 - 边距'));
  assert.equal(trigger.style.top, '744px', check('A1：默认 top = 视口高 - 按钮高 - 边距'));
  const left = parseFloat(trigger.style.left);
  const top = parseFloat(trigger.style.top);
  assert.ok(left >= 0 && top >= 0, check('A1：默认位置非负'));
  assert.ok(left + 152 <= 1280 && top + 44 <= 800, check('A1：按钮完整落在视口内（默认可见）'));
  assert.ok(left > 1280 / 2 && top > 800 / 2, check('A1：默认位置在右下角区域'));
  assert.notEqual(trigger.style.display, 'none', check('A1：showCompanion=true 时按钮不被隐藏（有可见入口）'));

  /* resize 后重新 clamp（交接 A1） */
  page.sandbox.innerWidth = 600;
  page.sandbox.innerHeight = 400;
  page.fireWindow('resize', {});
  assert.equal(trigger.style.left, '436px', check('A1：resize 变小后重新 clamp（left）'));
  assert.equal(trigger.style.top, '344px', check('A1：resize 变小后重新 clamp（top）'));

  /* 拖动：pointerdown → move → up，位置持久化；拖动后的第一次 click 被抑制 */
  dispatch(trigger, 'pointerdown', { button: 0, clientX: 446, clientY: 354, pointerId: 1 });
  dispatch(trigger, 'pointermove', { clientX: 346, clientY: 304, pointerId: 1 });
  dispatch(trigger, 'pointerup', { pointerId: 1 });
  assert.equal(trigger.style.left, '336px', check('A1：拖动后 left 跟随位移'));
  assert.equal(trigger.style.top, '294px', check('A1：拖动后 top 跟随位移'));
  const savedPos = page.progress.settings().companionPos;
  assert.deepEqual(savedPos ? { x: savedPos.x, y: savedPos.y } : null, { x: 336, y: 294 },
    check('A1：拖动结束位置已持久化到 settings.companionPos'));

  /* 拖动后 click 不应打开面板（stopImmediatePropagation），再点一次才打开 */
  dispatch(trigger, 'click', {});
  assert.equal(querySelect(dom.body, '.assistant-dialog'), null, check('A1：拖动后的顺手点击不打开助手面板'));
  dispatch(trigger, 'click', {});
  const assistantDialog = querySelect(dom.body, '.assistant-dialog');
  assert.ok(assistantDialog && assistantDialog.open === true, check('A1：正常点击打开助手面板'));
  dispatch(assistantDialog, 'click', {});   /* 面板自身的关闭按钮走 dialog-close */
  const dialogClose = querySelect(assistantDialog, '.dialog-close');
  if (dialogClose) dispatch(dialogClose, 'click', {});

  /* 保存的位置在视口再次变小时被 clamp 拉回（越界防御） */
  page.sandbox.innerWidth = 300;
  page.fireWindow('resize', {});
  assert.equal(trigger.style.left, '136px', check('A1：保存位置越界时 resize 重新 clamp 回视口内'));
  page.sandbox.innerWidth = 1280;
  page.sandbox.innerHeight = 800;
  page.fireWindow('resize', {});
  assert.equal(trigger.style.left, '336px', check('A1：视口恢复后回到保存的位置'));
}

/* ===================== 2. A1：showCompanion 开关（真实 UI 路径） ===================== */
{
  const storage = makeStorage();
  const page = newPage({ storage });
  const { dom } = page;
  const trigger = querySelect(dom.body, '.assistant-trigger');

  /* 打开个人资料面板（玩家入口 → openProfilePanel） */
  const playerEntry = querySelect(dom.body, '.player-entry');
  assert.ok(playerEntry, check('玩家入口按钮已挂载'));
  dispatch(playerEntry, 'click', {});
  const profileDialog = querySelect(dom.body, '.profile-dialog');
  assert.ok(profileDialog && profileDialog.open === true, check('点击玩家入口打开个人资料面板'));

  /* v4.4（交接 B3）：设置住进「设置」Tab——先切过去再找开关 */
  const settingsTab = querySelect(profileDialog, '#profile-tab-settings');
  assert.ok(settingsTab, check('v4.4 B3：个人中心有「设置」Tab'));
  dispatch(settingsTab, 'click', {});

  /* 找到「显示小奥助手」的开关并关闭 */
  const toggles = collectByClass(profileDialog, 'setting-toggle');
  const companionToggle = toggles.find(label => label.textContent.includes('显示学习伙伴'));
  assert.ok(companionToggle, check('设置中心有「显示学习伙伴」开关'));
  const box = companionToggle.children.find(child => child.tagName === 'INPUT');
  assert.ok(box, check('开关里有 checkbox'));
  box.checked = false;
  dispatch(box, 'change', {});
  assert.equal(trigger.style.display, 'none', check('A1：关闭开关后小奥按钮隐藏'));

  /* 重新打开：入口必须恢复可见，且位置按真实尺寸重新应用（不是 0×0 估算） */
  box.checked = true;
  dispatch(box, 'change', {});
  assert.equal(trigger.style.display, '', check('A1：重新开启后小奥按钮恢复显示'));
  const left = parseFloat(trigger.style.left);
  const top = parseFloat(trigger.style.top);
  assert.ok(left >= 0 && top >= 0 && left + 152 <= 1280 && top + 44 <= 800,
    check('A1：恢复显示后位置仍完整在视口内（按真实尺寸重定位）'));
}

/* ===================== 3. A2：自动读档失败不覆盖 ===================== */
{
  const broken = JSON.stringify({ schemaVersion: 99, lessons: {}, xp: 500 });
  const storage = makeStorage();
  storage.setItem(STORAGE_KEY, broken);
  const page = newPage({ storage });

  /* 内存按空档案运行，但存储原文一个字都不能动 */
  assert.equal(page.progress.summary().xp, 0, check('A2：读档失败后内存按空档案显示'));
  const info = page.progress.autoLoadInfo();
  assert.equal(info.failed, true, check('A2：autoLoadInfo 报告读档失败'));
  assert.equal(info.protected, true, check('A2：写入已冻结（protectStorage）'));
  assert.equal(page.progress.storageHealth().saveOk, false, check('A2：storageHealth.saveOk 为 false'));
  assert.equal(page.progress.storageHealth().protected, true, check('A2：storageHealth 区分出“冻结保护”状态'));
  assert.equal(storage.getItem(STORAGE_KEY), broken,
    check('A2：startTimer/afterChange 的保存被拒，原始档案未被 emptyState 覆盖'));
  assert.ok(dom_consoleHas(page, '自动读档失败'), check('A2：console.warn 报告了读档失败（中文）'));

  /* UI 告警：Dashboard 里有中文 notice */
  const notices = collectByClass(page.dom.body, 'notice').map(element => element.textContent);
  assert.ok(notices.some(text => text.includes('学习档案读取失败') && text.includes('原始档案仍完整保留')),
    check('A2：Dashboard 显示“读取失败、原始数据保留”的中文告警'));

  /* 显式导入一份合法档案：成功并解除保护，此后恢复正常保存 */
  const good = archiveJson({ xp: 300, lessons: { [FIRST_LESSON]: lessonEntryJson({ started: true }) } });
  const result = page.progress.importArchive(good);
  assert.equal(result.ok, true, check('A2：显式导入合法档案成功'));
  assert.equal(page.progress.autoLoadInfo().protected, false, check('A2：导入成功后解除写入冻结'));
  assert.equal(page.progress.summary().xp, 300, check('A2：导入的档案已生效'));
  const written = JSON.parse(storage.getItem(STORAGE_KEY));
  assert.equal(written.xp, 300, check('A2：解除保护后存储恢复正常写入'));
}
/* ===================== 4. A2：未知 lesson id 宽容保留 ===================== */
{
  const withUnknown = archiveJson({
    xp: 250,
    totalActiveSeconds: 1200,
    lessons: {
      [FIRST_LESSON]: lessonEntryJson({ started: true, completed: true, completedAt: '2026-09-01T08:00:00.000Z' }),
      'lesson-from-future': lessonEntryJson({ started: true, completed: true })
    },
    daily: { '2026-09-01': 1200 }
  });
  const storage = makeStorage();
  storage.setItem(STORAGE_KEY, withUnknown);
  const page = newPage({ storage });

  const info = page.progress.autoLoadInfo();
  assert.equal(info.failed, false, check('A2：未知 id 不再导致整份档案被拒'));
  assert.ok(info.warnings.some(text => text.includes('lesson-from-future')),
    check('A2：宽容丢弃的未知 id 记入 warnings'));
  const summary = page.progress.summary();
  assert.equal(summary.completedCount, 1, check('A2：已知课程的完成状态保留'));
  assert.equal(summary.xp, 250, check('A2：XP 等已知数据保留'));
  assert.equal(page.progress.lessonState(FIRST_LESSON).completed, true, check('A2：已知课程条目完整'));
  assert.equal('lesson-from-future' in page.progress.getState().lessons, false, check('A2：未知课程条目被丢弃'));
  assert.ok(dom_consoleHas(page, '跳过部分无法识别的内容'), check('A2：console.warn 报告了丢弃内容（中文）'));
  const notices = collectByClass(page.dom.body, 'notice').map(element => element.textContent);
  assert.ok(notices.some(text => text.includes('部分内容无法识别')),
    check('A2：UI 显示“部分内容无法识别、已知数据保留”的中文告警'));

  /* 显式导入（previewImport / importArchive）对未知 id 仍然严格 */
  const preview = page.progress.previewImport(withUnknown);
  assert.equal(preview.ok, false, check('A2：显式导入未知 id 仍然整份拒绝'));
  assert.match(preview.error, /未知的课程编号/, check('A2：显式导入给出明确拒绝原因'));
}

/* ===================== 5. A3：pageshow / bfcache 同步 ===================== */
{
  /* 场景：首页 → 课程页勾选完成 → 浏览器后退（bfcache 恢复）→ 首页数字立即正确 */
  const storage = makeStorage();
  const home = newPage({ storage });
  assert.equal(home.progress.summary().completedCount, 0, check('A3：首页初始完成数为 0'));

  /* 课程页（同标签页导航后的新页面实例）勾选「本课已完成」并写入存储 */
  const lessonPage = newPage({
    storage,
    page: 'lesson',
    search: `?id=${FIRST_LESSON}`,
    href: `http://127.0.0.1:8765/lesson.html?id=${FIRST_LESSON}`
  });
  lessonPage.progress.setCompleted(true);
  const storedAfterLesson = JSON.parse(storage.getItem(STORAGE_KEY));
  assert.equal(storedAfterLesson.lessons[FIRST_LESSON].completed, true, check('A3：课页勾选已写入存储'));

  /* persisted=false 的 pageshow（正常加载流程）不触发重载 */
  home.fireWindow('pageshow', { persisted: false });
  assert.equal(home.progress.summary().completedCount, 0,
    check('A3：persisted=false 的 pageshow 不做重载（避免丢掉启动后的内存变更）'));

  /* bfcache 恢复：从存储重载 + 刷新首页视图 */
  home.fireWindow('pageshow', { persisted: true });
  assert.equal(home.progress.summary().completedCount, 1, check('A3：pageshow(persisted) 后首页完成数立即正确'));

  /* v4.4（交接 A2）：首页默认 DOM 不再平铺统计全文——stat 格只存在于
   * 「学习进度」sheet 里，点开二级入口后才可见。先断言默认不含，
   * 再点开入口卡断言 DOM 真的重画了（不只是内存重载）。 */
  assert.equal(collectByClass(home.dom.body, 'stat').length, 0,
    check('v4.4 A2：首页默认 DOM 不含统计格（大块内容已收进二级入口）'));
  const progressEntry = collectByClass(home.dom.body, 'entry-card')
    .find(card => card.textContent.includes('学习进度'));
  assert.ok(progressEntry, check('v4.4 A1：首页有「学习进度」二级入口卡'));
  progressEntry.click();
  const statCells = collectByClass(home.dom.body, 'stat');
  const doneCell = statCells.find(cell => cell.children[0] && cell.children[0].textContent === '已完成开放课程');
  assert.ok(doneCell, check('A3：学习进度 sheet 有「已完成开放课程」统计格'));
  assert.equal(doneCell.children[1].textContent, '1 / 20', check('A3：sheet DOM 显示 1 / 20'));
  const totalCell = statCells.find(cell => cell.children[0] && cell.children[0].textContent === 'Foundations 总进度');
  assert.equal(totalCell.children[1].textContent, '1 / 46', check('A3：三层进度同步刷新（1 / 46）'));
}

/* ===================== 6. A3：课页勾选框随 bfcache 恢复同步 ===================== */
{
  const storage = makeStorage();
  const pageA = newPage({
    storage, page: 'lesson',
    search: `?id=${FIRST_LESSON}`,
    href: `http://127.0.0.1:8765/lesson.html?id=${FIRST_LESSON}`
  });
  const boxesA = collectByClass(pageA.dom.body, 'progress-toggle')
    .map(label => label.children.find(child => child.tagName === 'INPUT'));
  assert.equal(boxesA.length, 4, check('A3：课页有四个勾选框'));
  assert.equal(boxesA[0].checked, false, check('A3：初始「本课已完成」未勾选'));

  /* 另一个页面实例勾选完成（模拟同标签页前进后的课页） */
  const pageB = newPage({
    storage, page: 'lesson',
    search: `?id=${FIRST_LESSON}`,
    href: `http://127.0.0.1:8765/lesson.html?id=${FIRST_LESSON}`
  });
  pageB.progress.setCompleted(true);

  /* pageA 从 bfcache 恢复：勾选框必须跟着存储走 */
  pageA.fireWindow('pageshow', { persisted: true });
  const boxesAfter = collectByClass(pageA.dom.body, 'progress-toggle')
    .map(label => label.children.find(child => child.tagName === 'INPUT'));
  assert.equal(boxesAfter[0].checked, true, check('A3：bfcache 恢复后课页勾选框同步为已勾选'));
  const statLine = collectByClass(pageA.dom.body, 'progress-stat')[0];
  assert.ok(statLine && statLine.textContent.includes('已完成'), check('A3：课页状态行同步为已完成'));
}

/* ===================== 7. A4：v4.2 既有修复不回退 ===================== */
{
  /* 存储写入失败必须可见（v4.2 §2）：先正常初始化，再让正式 key 的写入抛错 */
  const real = makeStorage();
  let failWrites = false;
  const wrapped = {
    setItem(key, value) { if (failWrites && key === STORAGE_KEY) throw new Error('QuotaExceededError'); real.setItem(key, value); },
    getItem: key => real.getItem(key),
    removeItem: key => real.removeItem(key),
    key: index => real.key(index),
    get length() { return real.length; }
  };
  const page = newPage({ storage: wrapped });
  failWrites = true;
  /* 触发一次真实保存路径（setDailyGoal 走 afterChange → save） */
  page.progress.setDailyGoal(30);
  assert.equal(page.progress.storageHealth().saveOk, false, check('A4：存储写入失败仍然可检测（saveOk=false）'));

  /* file:// 回退：不假装健康（v4.2 既有语义） */
  const filePage = newPage({ protocol: 'file:', storage: makeStorage(), href: 'file:///C:/x/index.html' });
  assert.equal(filePage.progress.isPersistent(), false, check('A4：file:// 模式不持久化'));
  const fileNotices = collectByClass(filePage.dom.body, 'notice').map(element => element.textContent);
  assert.ok(fileNotices.some(text => text.includes('直接文件模式')), check('A4：file:// 模式显示中文回退提示'));
}

console.log(`通过：v4.3 Core A 组 DOM 挂载路径回归 ${checks} 项断言（A1 小奥先 append 再测尺寸、默认可见右下角、resize/拖动 clamp、showCompanion 开关入口；A2 自动读档失败不覆盖 + 未知 id 宽容 + 显式导入严格 + 导入解除保护；A3 pageshow/bfcache 首页数字与课页勾选框同步、persisted=false 不重载；A4 保存失败可见与 file:// 回退不回退）。`);
