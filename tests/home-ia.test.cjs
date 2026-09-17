/* v4.4 首页信息架构测试（交接 §3 Core A + §13 测试重点 1/2/16）。
 *
 * 钉住三件本轮重构的核心承诺：
 *   1. 首页默认 DOM 不再包含任何大模块的完整展开内容（统计格、热力图、
 *      成就墙、技能路线、地图、挑战卡、周图表、46 行目录）——交接 §13.1；
 *   2. 每个二级入口都能真实打开对应 UI，且内容确实构建出来——交接 §13.2；
 *   3. sheet 关闭后焦点归还触发元素（audit U4 / Shoelace 模式）——交接 §13.16
 *      的 stub 可测子集（真实 Esc/Tab 行为由原生 showModal 保证，浏览器实测项）。
 *
 * 基础设施与 dom-mount.test.cjs 共享（tests/dom-stub.cjs）。 */
const assert = require('node:assert/strict');

const {
  FIRST_LESSON, querySelect, collectByClass, dispatch, makeStorage, newPage
} = require('./dom-stub.cjs');

let checks = 0;
const check = label => { checks += 1; return label; };

/* 打开某张入口卡（按可见文字匹配 .entry-card） */
function clickEntry(page, text) {
  const card = collectByClass(page.dom.body, 'entry-card')
    .find(item => item.textContent.includes(text));
  assert.ok(card, check(`首页有「${text}」入口卡`));
  dispatch(card, 'click', {});
  return card;
}

/* 找到当前打开的 sheet（dialog.sheet 且 open） */
function openSheetOf(page) {
  return collectByClass(page.dom.body, 'sheet').find(item => item.open === true) || null;
}

/* ===================== 1. 首页默认 DOM 极简（§13.1 / A2） ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const { dom } = page;
  const main = querySelect(dom.body, '#main');
  assert.ok(main, check('首页 main 存在'));

  /* 必须存在的三件事结构（A1）：hero 主卡、今日条、入口网格 */
  assert.ok(querySelect(dom.body, '.continue-card'), check('A1：首页有「继续学习」主卡'));
  assert.ok(querySelect(dom.body, '.today-strip'), check('A1：首页有「今天」摘要条'));
  const entryCards = collectByClass(dom.body, 'entry-card');
  assert.equal(entryCards.length, 3, check('B：首页恰好 3 个主入口卡（6→3 收口）'));
  /* 用卡片的标题（.entry-title）判定，不用整卡文本——学习地图卡的 desc 会
   * 合法地提到「技能路线 / 世界地图」（那是它内部 Tab 的说明，不是独立卡）。 */
  const entryTitles = entryCards.map(card => (querySelect(card, '.entry-title') || { textContent: '' }).textContent);
  for (const expected of ['学习进度', '今日计划', '学习地图']) {
    assert.ok(entryTitles.some(text => text.includes(expected)), check(`B：入口卡标题包含「${expected}」`));
  }
  /* v4.5（交接 B）：被收掉的 4 个入口不再是首页独立卡（按标题判定） */
  for (const removed of ['任务与挑战', '技能路线', '世界地图', '收藏与成就', '学习统计']) {
    assert.ok(!entryTitles.some(text => text.includes(removed)),
      check(`B：「${removed}」不再是首页独立入口卡标题`));
  }

  /* hero 主卡：CTA 链接指向第一课（空档案时 continueLessonId = 第一课） */
  const hero = querySelect(dom.body, '.continue-card');
  const cta = collectByClass(hero, 'button').find(item => item.href && item.href.includes('lesson.html?id='));
  assert.ok(cta, check('A1：hero 卡有指向课程页的主 CTA'));
  assert.equal(cta.textContent, '开始学习 →', check('v4.5.1：空档案 CTA 精确为「开始学习」'));
  assert.equal(collectByClass(hero, 'continue-primary').length, 1, check('v4.5.1：hero 只有一个 primary CTA'));
  const heroSecondary = collectByClass(hero, 'button-secondary');
  assert.equal(heroSecondary.length, 1, check('v4.5.1：hero 只有一个 secondary action'));
  assert.ok(heroSecondary[0].textContent.includes('查看全部 World'), check('第三轮：hero 次级入口是「查看全部 World」'));
  assert.ok(!hero.textContent.includes('打开课程页即开始累计有效学习时长'), check('v4.5.1：主卡不常驻内部计时规则'));
  /* hero 不含完整统计（交接 A1：不要在主卡塞统计） */
  assert.equal(collectByClass(hero, 'stat').length, 0, check('A1：hero 卡内没有统计格'));

  /* 大模块默认全部不在首页 DOM（A2 清单逐项） */
  const forbidden = [
    ['stat', '统计格'],
    ['heatmap-grid', '热力图'],
    ['achievement-grid', '成就墙'],
    ['skill-list', '技能路线'],
    ['map-nodes', 'Foundations 地图'],
    ['challenge-list', '挑战卡'],
    ['week-chart', '本周图表'],
    ['lesson-link', '目录课程行'],
    ['daily-card', '今日学习卡全文'],
    ['tier-list', '循环成就列表'],
    ['collection-groups', '收藏柜']
  ];
  for (const [cls, zh] of forbidden) {
    assert.equal(collectByClass(dom.body, cls).length, 0, check(`A2：首页默认不含「${zh}」（.${cls}）`));
  }

  /* 今日条是整条按钮（手机可点，不依赖 hover——红线 9） */
  const strip = querySelect(dom.body, '.today-strip');
  assert.equal(strip.tagName, 'BUTTON', check('A1：今日条整条是 button（移动端可点）'));
  assert.match(strip.textContent, /今日/, check('A1：今日条显示今日学习'));
  assert.match(strip.textContent, /连续 \d+ 天/, check('A1：今日条显示连续天数'));
  assert.match(strip.textContent, /复习/, check('A1：今日条显示待复习状态'));
}

/* ===================== 1b. Hero 主文案收敛（第三轮：两行主文案，World 信息下沉） ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const main = querySelect(page.dom.body, '#main');
  const hero = querySelect(main, '.home-hero');
  const lead = querySelect(main, '.home-lead');
  assert.ok(lead, check('第三轮：Hero 保留一句副标题 lead'));
  assert.equal(lead.textContent, '沿 The Odin Project 路线学习 Web 开发。', check('第三轮：副标题是一句话定位'));
  assert.equal(querySelect(hero, 'h1').textContent, 'Full Stack JavaScript 路线', check('第三轮：主标题承担路线名'));
  /* World 数量与中文覆盖下沉到世界地图与 World 1 卡片，不再塞进 Hero */
  for (const fact of ['8 个 World', '197 课', '前 19 课']) {
    assert.ok(!hero.textContent.includes(fact), check(`第三轮：Hero 不再塞「${fact}」`));
  }
  assert.ok(!main.textContent.includes('核对日期 2026-09-09'), check('v4.5.1：首页主内容移除核对日期'));
}

/* ===================== 1c. v4.5.1 关于本站只有三个短 FAQ ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const usage = querySelect(page.dom.body, '.site-usage');
  assert.ok(usage, check('v4.5.1：首页保留低打扰「关于本站」折叠区'));
  const faqItems = collectByClass(usage, 'site-faq-item');
  assert.equal(faqItems.length, 3, check('v4.5.1：关于本站恰好 3 个 FAQ 主项'));
  assert.deepEqual(faqItems.map(item => querySelect(item, '.site-faq-question').textContent),
    ['本站怎么用？', '中文内容覆盖到哪里？', '哪些内容需要联网？'],
    check('v4.5.1：三个 FAQ 标题精确且顺序稳定（第二轮：移除「为什么只有前 19 课」的误导设问）'));
  assert.ok(!usage.textContent.includes('Additional Resources'), check('v4.5.1：首页不再长篇解释 Additional Resources'));
  assert.ok(!usage.textContent.includes('不会同步 TOP 学习进度'), check('v4.5.1：首页移除同步规则长说明'));
}

/* ===================== 2. 四个 sheet 入口真实打开对应 UI（§13.2） ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const { dom } = page;

  /* 学习进度 sheet：stat 格 + 三层进度 + 档案操作 + 课程目录入口（交接 B） */
  const progressCard = clickEntry(page, '学习进度');
  let sheet = openSheetOf(page);
  assert.ok(sheet, check('§13.2：点击「学习进度」打开 sheet'));
  assert.ok(collectByClass(sheet, 'stat').length >= 10, check('§13.2：学习进度 sheet 有学习统计格'));
  assert.ok(sheet.textContent.includes('Foundations 总进度'), check('§13.2：学习进度 sheet 有三层进度'));
  for (const kept of ['今日有效学习', '累计有效学习', '连续学习', '需要复习', '今日建议复习']) {
    assert.ok(sheet.textContent.includes(kept), check(`v4.5.1：学习进度保留「${kept}」`));
  }
  assert.equal(collectByClass(sheet, 'coin-rules').length, 0, check('v4.5.1：学习进度移除叶片规则主块'));
  assert.ok(!sheet.textContent.includes('叶片怎么获得'), check('v4.5.1：学习进度不再朗读叶片规则'));
  assert.equal(collectByClass(sheet, 'achievement-grid').length, 0, check('v4.5.1：学习进度不包含成就墙'));
  assert.equal(collectByClass(sheet, 'collection-groups').length, 0, check('v4.5.1：学习进度不包含收藏统计'));
  assert.ok(sheet.textContent.includes('导出学习档案'), check('§13.2：学习进度 sheet 有档案操作'));
  assert.ok(collectByClass(sheet, 'button-secondary').some(b => b.textContent.includes('课程目录')),
    check('B：学习进度 sheet 内含课程目录入口（总进度/目录/档案三合一）'));
  /* 关闭 → 焦点归还触发元素（audit U4） */
  const closeBtn = querySelect(sheet, '.dialog-close');
  assert.ok(closeBtn, check('§13.16：sheet 有常驻关闭按钮'));
  dispatch(closeBtn, 'click', {});
  assert.equal(sheet.open, false, check('§13.16：点击关闭后 sheet 关闭'));
  assert.equal(dom.activeElement, progressCard, check('§13.16：关闭后焦点归还入口卡（Shoelace originalTrigger 模式）'));

  /* 今日计划 sheet（原「任务与挑战」）：今日卡全文在这里（首页只有摘要条） */
  clickEntry(page, '今日计划');
  sheet = openSheetOf(page);
  assert.ok(sheet, check('B：点击「今日计划」打开 sheet'));
  assert.ok(collectByClass(sheet, 'daily-card').length === 1, check('B：今日计划 sheet 含今日学习卡'));
  assert.ok(sheet.textContent.includes('每日目标'), check('B：今日计划 sheet 含每日目标设置'));
  dispatch(querySelect(sheet, '.dialog-close'), 'click', {});

  /* 学习地图 sheet（交接 B）：三个内部 Tab——技能路线 / 世界地图 / Foundations 探索。
   * 切 Tab 走 refreshSheetById，dialog 元素不变、只换 body，因此 sheet 引用持续有效。 */
  const clickMapTab = text => {
    const tab = collectByClass(sheet, 'map-tab').find(item => item.textContent.includes(text));
    assert.ok(tab, check(`B：学习地图有「${text}」Tab`));
    dispatch(tab, 'click', {});
  };
  clickEntry(page, '学习地图');
  sheet = openSheetOf(page);
  assert.ok(sheet, check('B：点击「学习地图」打开 sheet'));
  assert.equal(collectByClass(sheet, 'map-tab').length, 3, check('B：学习地图恰好 3 个内部 Tab'));
  /* 默认 Tab = 技能路线 */
  assert.ok(collectByClass(sheet, 'skill-list').length === 1, check('B：默认 Tab 是技能路线（含路线列表）'));
  assert.ok(collectByClass(sheet, 'skill-node').length === 8, check('§13.2：技能路线 8 个单元节点'));
  /* 切到世界地图 Tab（交接 F2/F3/F4：顶层 8 个 World 卡，不进内部不平铺） */
  clickMapTab('世界地图');
  const worldCards = collectByClass(sheet, 'world-card');
  assert.equal(worldCards.length, 8, check('F2：世界地图 Tab 顶层是 8 个 World 卡（官方全路线）'));
  assert.ok(worldCards[0].textContent.includes('Foundations'), check('F2：World 1 是 Foundations'));
  assert.ok(worldCards[0].textContent.includes('前 19 课已有中文学习内容'),
    check('第三轮：World 1 卡片承载中文覆盖说明（自 Hero 下沉）'));
  assert.ok(worldCards[7].textContent.includes('求职之路'), check('F2：World 8 是求职之路（Getting Hired）'));
  assert.ok(worldCards[1].textContent.includes('尚未开放中文内容'), check('F3：后续 World 卡明确「尚未开放中文内容」'));
  assert.equal(collectByClass(sheet, 'map-nodes').length, 0, check('F4：World 列表层不平铺 46 节点地图'));
  /* 进 Foundations World：五阶节点地图 + Boss 入口 */
  dispatch(worldCards[0], 'click', {});
  assert.ok(collectByClass(sheet, 'map-nodes').length >= 1, check('F2：Foundations World 内是探索地图'));
  assert.ok(sheet.textContent.includes('Foundations 地图'), check('F2：Foundations 地图标题在位'));
  const backBtn = collectByClass(sheet, 'world-back')[0];
  assert.ok(backBtn, check('F2：World 内部有返回列表按钮'));
  dispatch(backBtn, 'click', {});
  assert.equal(collectByClass(sheet, 'world-card').length, 8, check('F2：返回后回到 World 列表'));
  /* 进未开放 World（React）：结构占位、无 lesson 链接（F3 结构红线） */
  dispatch(collectByClass(sheet, 'world-card')[4], 'click', {});
  assert.ok(sheet.textContent.includes('React'), check('F2：World 5 是 React'));
  assert.ok(sheet.textContent.includes('尚未开放中文内容'), check('F3：占位视图明确未开放'));
  assert.ok(collectByClass(sheet, 'world-lesson').length >= 20, check('F2：React World 展示官方课程结构占位'));
  assert.equal(collectByClass(sheet, 'lesson-link').length, 0, check('F3：占位课程结构上没有进入本站正文的链接'));
  const anchors = [];
  (function walk(el) {
    el.children.forEach(child => {
      if (child.tagName === 'A' && String(child.href || '').includes('lesson.html')) anchors.push(child.href);
      walk(child);
    });
  })(sheet);
  assert.equal(anchors.length, 0, check('F3：占位视图不存在任何 lesson.html 链接'));
  assert.ok(sheet.textContent.includes('官方共 25 课'), check('F5：占位视图带官方课数（快照口径）'));
  /* 切到 Foundations 探索 Tab：独立入口直达节点地图（交接 B「按信息架构合理归位」） */
  clickMapTab('Foundations 探索');
  assert.ok(collectByClass(sheet, 'map-nodes').length >= 1, check('B：Foundations 探索 Tab 直达五阶节点地图'));
  assert.equal(collectByClass(sheet, 'world-card').length, 0, check('B：Foundations 探索 Tab 不显示 World 列表'));
  /* 切回技能路线 Tab：世界地图内容清空，路线列表回来 */
  clickMapTab('技能路线');
  assert.ok(collectByClass(sheet, 'skill-list').length === 1, check('B：切回技能路线 Tab 内容正确'));
  assert.equal(collectByClass(sheet, 'world-card').length, 0, check('B：技能路线 Tab 不含 World 卡'));
  dispatch(querySelect(sheet, '.dialog-close'), 'click', {});

  /* 收藏与成就 / 学习统计不再是首页卡，但归个人中心（交接 B）：
   * 走 header 玩家入口打开个人中心，确认成就收藏 / 统计 Tab 仍在。 */
  const playerEntry = querySelect(dom.body, '.player-entry');
  dispatch(playerEntry, 'click', {});
  const profileDialog = collectByClass(dom.body, 'profile-dialog').find(item => item.open === true);
  assert.ok(profileDialog, check('B：header 玩家入口打开个人中心'));
  const profileTabTexts = collectByClass(profileDialog, 'profile-tab').map(tab => tab.textContent);
  assert.ok(profileTabTexts.some(t => t.includes('成就收藏')), check('B：成就收藏归个人中心 Tab'));
  assert.ok(profileTabTexts.some(t => t.includes('统计')), check('B：学习统计归个人中心 Tab'));
}

/* ===================== 3. 今日条与目录 dialog 入口 ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const { dom } = page;

  /* 今日条整条可点 → 任务 sheet（移动端路径，红线 9） */
  const strip = querySelect(dom.body, '.today-strip');
  dispatch(strip, 'click', {});
  assert.ok(openSheetOf(page), check('红线 9：今日条点击打开任务面板（不依赖 hover）'));
  dispatch(querySelect(openSheetOf(page), '.dialog-close'), 'click', {});

  /* hero 卡「查看全部 World」→ 学习地图 sheet 世界地图 Tab（第三轮：World 信息下沉） */
  const hero = querySelect(dom.body, '.continue-card');
  const worldsButton = collectByClass(hero, 'button-secondary')
    .find(item => item.textContent.includes('查看全部 World'));
  assert.ok(worldsButton, check('第三轮：hero 卡有次级「查看全部 World」入口'));
  dispatch(worldsButton, 'click', {});
  const worldSheet = openSheetOf(page);
  assert.ok(worldSheet, check('第三轮：「查看全部 World」打开学习地图 sheet'));
  assert.equal(collectByClass(worldSheet, 'world-card').length, 8,
    check('第三轮：直达世界地图 Tab，顶层 8 个 World 卡'));
  dispatch(querySelect(worldSheet, '.dialog-close'), 'click', {});

  /* 课程目录 dialog 入口收敛到 header 按钮（hero 不再重复摆放），红线不变 */
  dispatch(querySelect(dom.body, '.catalog-trigger'), 'click', {});
  const catalogDialog = collectByClass(dom.body, 'catalog-dialog').find(item => item.open === true);
  assert.ok(catalogDialog, check('A1：header 目录按钮打开课程目录 dialog'));
  assert.equal(collectByClass(catalogDialog, 'lesson-link').length, 19,
    check('目录 dialog 内已开放课程链接恰好 19 条（20-46 课无链接的红线不变）'));
  assert.equal(collectByClass(catalogDialog, 'lesson-locked').length, 27,
    check('目录 dialog 内 27 课灰化不可点'));
  const officialCatalog = querySelect(catalogDialog, '.catalog-official-link');
  assert.ok(officialCatalog, check('v4.5.1：本站目录内有 TOP 官方目录外链'));
  assert.equal(officialCatalog.href, 'https://www.theodinproject.com/paths/foundations/courses/foundations', check('v4.5.1：官方目录 URL 正确'));
  assert.equal(officialCatalog.target, '_blank', check('v4.5.1：官方目录新标签打开'));
  assert.match(officialCatalog.rel, /noopener/, check('v4.5.1：官方目录外链带 noopener'));
  dispatch(querySelect(catalogDialog, '.dialog-close'), 'click', {});

  /* header：目录按钮（两页都挂）+ 主题快捷 + 玩家 chip 带叶片 */
  const headerTrigger = querySelect(dom.body, '.catalog-trigger');
  assert.ok(headerTrigger, check('A1：首页 header 有且仅有本站课程目录按钮'));
  const header = querySelect(dom.body, '.site-header');
  assert.ok(!header.textContent.includes('官方课程目录'), check('v4.5.1：首页 header 不再并列官方目录入口'));
  dispatch(headerTrigger, 'click', {});
  assert.ok(collectByClass(dom.body, 'catalog-dialog').some(item => item.open === true),
    check('A1：header 目录按钮同样打开目录 dialog'));
  const openedCatalog = collectByClass(dom.body, 'catalog-dialog').find(item => item.open === true);
  dispatch(querySelect(openedCatalog, '.dialog-close'), 'click', {});

  const themeQuick = querySelect(dom.body, '.theme-quick');
  assert.ok(themeQuick, check('B2：header 有主题快捷入口'));
  dispatch(themeQuick, 'click', {});
  const themePicker = collectByClass(dom.body, 'picker-dialog').find(item => item.open === true);
  assert.ok(themePicker, check('B2：主题快捷入口打开主题选择器'));
  assert.ok(themePicker.textContent.includes('园地'), check('B2：主题选择器列出主题'));
  dispatch(querySelect(themePicker, '.dialog-close'), 'click', {});
  assert.equal(dom.activeElement, themeQuick, check('§13.16：主题选择器关闭后焦点归还 header 按钮'));

  const playerEntry = querySelect(dom.body, '.player-entry');
  assert.ok(playerEntry, check('A1：header 有玩家入口 chip'));
  assert.match(playerEntry.textContent, /Lv\.\d+/, check('A1：玩家 chip 显示等级'));
  assert.match(playerEntry.textContent, /\d+ 叶片/, check('A1：玩家 chip 显示叶片'));
}

/* ===================== 4. 数据变化后首页轻视图同步（refresh 链路） ===================== */
{
  const storage = makeStorage();
  const page = newPage({ storage });
  const { dom } = page;
  /* 真实链路：课程页勾选完成 → 写入存储 → 首页 bfcache 恢复（pageshow）→
   * 首页轻视图（hero / badge）立即正确。setCompleted 需要课程上下文，
   * 因此必须在课程页实例上调用（与 dom-mount A3 同一模式）。 */
  const lessonPage = newPage({
    storage,
    page: 'lesson',
    search: `?id=${FIRST_LESSON}`,
    href: `http://127.0.0.1:8765/lesson.html?id=${FIRST_LESSON}`
  });
  lessonPage.progress.setCompleted(true);
  page.fireWindow('pageshow', { persisted: true });
  assert.equal(page.progress.summary().completedCount, 1, check('首页 pageshow 后完成数重载为 1'));
  /* 完成数 badge 在入口卡上可见（1 / 46） */
  const progressCard = collectByClass(dom.body, 'entry-card').find(item => item.textContent.includes('学习进度'));
  assert.match(progressCard.textContent, /1 \/ 46/, check('A1：入口卡 badge 随数据刷新（1 / 46 课）'));
  /* hero CTA 指向第二课（不再指向已完成的第一课） */
  const hero = querySelect(dom.body, '.continue-card');
  const cta = collectByClass(hero, 'button').find(item => item.href && item.href.includes('lesson.html?id='));
  assert.ok(cta && !cta.href.includes(FIRST_LESSON), check('A1：完成第一课后 hero CTA 指向下一课'));
  assert.equal(cta.textContent, '开始学习 →', check('v4.5.1：下一课尚未开始时 CTA 仍为「开始学习」'));
}

/* ===================== 5. 个人中心 Tabs（交接 B1/B2/B3 + audit U3/U5） ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const { dom } = page;

  /* 默认打开是「形象」Tab：昵称优先 + 三个用户概念区块 */
  const playerEntry = querySelect(dom.body, '.player-entry');
  dispatch(playerEntry, 'click', {});
  const dialog = collectByClass(dom.body, 'profile-dialog').find(item => item.open === true);
  assert.ok(dialog, check('B3：玩家入口打开个人中心'));
  const tabs = collectByClass(dialog, 'profile-tab');
  assert.equal(tabs.length, 4, check('B3：个人中心恰好 4 个 Tab（形象/成就收藏/统计/设置）'));
  const selectedTab = tabs.find(tab => tab.getAttribute('aria-selected') === 'true');
  assert.equal(selectedTab.textContent, '形象', check('B3：默认停在「形象」Tab'));
  const groups = collectByClass(dialog, 'appearance-group');
  assert.equal(groups.length, 3, check('v4.5.1：形象 Tab 合并为我的形象/学习伙伴/页面主题三块'));
  for (const expected of ['我的形象', '学习伙伴', '页面主题']) {
    assert.ok(groups.some(item => item.textContent.includes(expected)), check(`v4.5.1：概念区块包含「${expected}」`));
  }
  assert.ok(!dialog.textContent.includes('当前装备：'), check('v4.5.1：删除首屏当前装备长句'));
  assert.equal(collectByClass(dialog, 'appearance-group-avatar').length, 1, check('v4.5.1：头像与头像框共用一个主预览'));
  assert.equal(collectByClass(dialog, 'appearance-group-companion').length, 1, check('v4.5.1：伙伴与装扮共用一个主预览'));
  /* ARIA 契约：tablist / tab / tabpanel（U3） */
  assert.ok(collectByClass(dialog, 'profile-tabs').some(item => item.getAttribute('role') === 'tablist'), check('U3：tablist 角色在位'));
  assert.ok(collectByClass(dialog, 'profile-tabpanel').length === 1, check('U3：同一时间只渲染一个 tabpanel'));
  /* 形象 Tab 不再平铺完整 stat grid（B1：数字住在「学习进度」sheet） */
  assert.equal(collectByClass(dialog, 'stat').length, 0, check('B1：形象 Tab 不重复平铺统计格'));

  /* 设置 Tab：每日目标 + 小奥形态 + 6 个开关 + 重置（B3 提前，不再长滚动） */
  const settingsTab = querySelect(dialog, '#profile-tab-settings');
  dispatch(settingsTab, 'click', {});
  assert.ok(collectByClass(dialog, 'setting-toggle').length === 6, check('B3：设置 Tab 有 6 个界面开关'));
  assert.ok(dialog.textContent.includes('每日学习目标'), check('B3：每日目标在设置 Tab 顶部区域'));
  assert.ok(dialog.textContent.includes('学习伙伴形象'), check('D4：学习伙伴形态选择在设置里'));
  assert.ok(dialog.textContent.includes('重置学习进度'), check('B3：危险操作（重置）在设置 Tab'));
  assert.ok(dialog.textContent.includes('导出学习档案') || dialog.textContent.includes('学习档案'), check('B3：档案区块在设置 Tab'));
  /* 方向键导航（U3 roving tabindex 契约） */
  dispatch(settingsTab, 'keydown', { key: 'ArrowRight' });
  const selectedAfter = collectByClass(dialog, 'profile-tab').find(tab => tab.getAttribute('aria-selected') === 'true');
  assert.equal(selectedAfter.textContent, '形象', check('U3：ArrowRight 从「设置」环绕到「形象」'));
  dispatch(selectedAfter, 'keydown', { key: 'ArrowRight' });
  const achievementsTab = collectByClass(dialog, 'profile-tab').find(tab => tab.getAttribute('aria-selected') === 'true');
  assert.equal(achievementsTab.textContent, '成就收藏', check('U3：ArrowRight 顺序切换 Tab'));
  assert.ok(collectByClass(dialog, 'achievement-grid').length >= 1, check('成就收藏 Tab 渲染成就墙'));
  assert.ok(collectByClass(dialog, 'collection-groups').length >= 1, check('成就收藏 Tab 渲染收藏柜'));
  dispatch(querySelect(dialog, '.dialog-close'), 'click', {});

  /* v4.5（交接 B）：成就收藏 / 学习统计不再是首页独立卡，改由个人中心承载。
   * 走 header 玩家入口打开个人中心，直接点两个 Tab，验证内容仍完整可达。 */
  dispatch(querySelect(dom.body, '.player-entry'), 'click', {});
  const dialog2 = collectByClass(dom.body, 'profile-dialog').find(item => item.open === true);
  dispatch(querySelect(dialog2, '#profile-tab-achievements'), 'click', {});
  const selected2 = collectByClass(dialog2, 'profile-tab').find(tab => tab.getAttribute('aria-selected') === 'true');
  assert.equal(selected2.textContent, '成就收藏', check('B：成就收藏在个人中心 Tab 可达'));
  assert.ok(collectByClass(dialog2, 'achievement-grid').length >= 1, check('B：成就收藏 Tab 渲染成就墙'));
  dispatch(querySelect(dialog2, '#profile-tab-stats'), 'click', {});
  const selected3 = collectByClass(dialog2, 'profile-tab').find(tab => tab.getAttribute('aria-selected') === 'true');
  assert.equal(selected3.textContent, '统计', check('B：学习统计在个人中心 Tab 可达'));
  assert.ok(collectByClass(dialog2, 'heatmap-grid').length === 1, check('B：统计 Tab 渲染热力图'));
  assert.ok(dialog2.textContent.includes('学习历史'), check('B：统计 Tab 含学习历史'));
}

/* ===================== 6. 小奥面板 2.0（交接 D1/D2/D3/D4） ===================== */
{
  const storage = makeStorage();
  const page = newPage({ storage });
  const { dom } = page;

  /* 打开小奥面板 */
  const trigger = querySelect(dom.body, '.assistant-trigger');
  dispatch(trigger, 'click', {});
  const dialog = collectByClass(dom.body, 'assistant-dialog').find(item => item.open === true);
  assert.ok(dialog, check('D2：点击小奥打开面板'));

  /* 默认视图极简四件套：角色 + 今日一句话 + 下一步 + 今日进度 */
  assert.ok(querySelect(dialog, '.assistant-stage'), check('D2：默认视图有角色舞台'));
  assert.ok(querySelect(dialog, '.assistant-bust'), check('D1：舞台里有角色形象图'));
  assert.ok(querySelect(dialog, '.assistant-mood-line'), check('D2：默认视图有今日一句话'));
  assert.ok(querySelect(dialog, '.assistant-tip'), check('D2：默认视图有一个最重要的下一步'));
  assert.ok(querySelect(dialog, '.assistant-today'), check('D2：默认视图有今日学习进度'));
  assert.ok(dialog.textContent.includes('不是 AI'), check('D2：非 AI 边界声明保留在默认视图'));
  /* 默认视图不塞完整事实清单（交接 D2：不要一打开全是统计） */
  assert.equal(collectByClass(dialog, 'assistant-facts').length, 0, check('D2：默认视图不含完整事实清单'));
  assert.equal(dialog.textContent.includes('成长阶段'), false, check('D2：成长阶段等全文数据收进二级视图'));

  /* D3：四个二级入口，全部是真实 button（手机可点，不依赖 hover） */
  const navButtons = collectByClass(dialog, 'assistant-nav-btn');
  assert.equal(navButtons.length, 4, check('D3：二级入口恰好 4 个（今天/复习/成就/设置）'));
  assert.deepEqual(navButtons.map(b => b.textContent), ['今天', '复习', '成就', '设置'], check('D3：入口名称与顺序'));
  navButtons.forEach(btn => assert.equal(btn.tagName, 'BUTTON', check('D3：入口是 button 元素')));

  /* 「今天」视图：完整事实清单 + 返回 */
  dispatch(navButtons[0], 'click', {});
  assert.ok(querySelect(dialog, '.assistant-facts'), check('D3：「今天」视图展开完整事实清单'));
  assert.ok(dialog.textContent.includes('成长阶段'), check('D3：成长阶段在「今天」视图'));
  assert.ok(querySelect(dialog, '.assistant-back'), check('D3：二级视图有返回按钮'));
  const navAfter = collectByClass(dialog, 'assistant-nav-btn');
  assert.equal(navAfter[0].getAttribute('aria-pressed'), 'true', check('D3：当前视图入口高亮（aria-pressed）'));
  dispatch(querySelect(dialog, '.assistant-back'), 'click', {});
  assert.equal(collectByClass(dialog, 'assistant-facts').length, 0, check('D3：返回后回到极简默认视图'));

  /* 「复习」视图：到期清单或空态说明 + 总标记数 */
  dispatch(collectByClass(dialog, 'assistant-nav-btn')[1], 'click', {});
  assert.ok(dialog.textContent.includes('复习'), check('D3：「复习」视图标题'));
  assert.ok(dialog.textContent.includes('需要复习') || dialog.textContent.includes('标记了'), check('D3：复习视图有真实复习数据口径'));
  dispatch(querySelect(dialog, '.assistant-back'), 'click', {});

  /* 「成就」视图：轻量成就 facts + 个人中心直达 */
  dispatch(collectByClass(dialog, 'assistant-nav-btn')[2], 'click', {});
  assert.ok(querySelect(dialog, '.assistant-facts'), check('D3：「成就」视图有成就进度'));
  const moreButton = collectByClass(dialog, 'button-secondary').find(b => b.textContent.includes('完整成就墙'));
  assert.ok(moreButton, check('D3：成就视图有个人中心直达按钮'));
  dispatch(moreButton, 'click', {});
  const profileFromAssistant = collectByClass(dom.body, 'profile-dialog').find(item => item.open === true);
  assert.ok(profileFromAssistant, check('B4：从小奥成就入口打开个人中心'));
  const selectedTab = collectByClass(profileFromAssistant, 'profile-tab').find(tab => tab.getAttribute('aria-selected') === 'true');
  assert.equal(selectedTab.textContent, '成就收藏', check('B4：直达「成就收藏」Tab'));
  dispatch(querySelect(profileFromAssistant, '.dialog-close'), 'click', {});

  /* 「设置」视图（D4）：与个人中心同一套字段（每日目标 + 6 开关 + 小奥形态）。
   * 上一步跳个人中心时小奥面板已被关闭（跨面板导航的预期行为），
   * 重新打开再进设置——打开会重置回默认视图（D2 会话边界）。 */
  dispatch(trigger, 'click', {});
  assert.equal(collectByClass(dialog, 'assistant-nav-btn')[0].getAttribute('aria-pressed'), 'false',
    check('D2：重新打开小奥回到默认视图（二级视图不跨会话残留）'));
  dispatch(collectByClass(dialog, 'assistant-nav-btn')[3], 'click', {});
  assert.ok(dialog.textContent.includes('每日学习目标'), check('D4：小奥设置含每日目标'));
  assert.equal(collectByClass(dialog, 'setting-toggle').length, 6, check('D4：小奥设置含 6 个界面开关（与个人中心同一构建函数）'));
  assert.ok(dialog.textContent.includes('学习伙伴形象'), check('D4：学习伙伴设置含形象选择'));
  assert.ok(dialog.textContent.includes('恢复学习伙伴默认位置'), check('D4：恢复默认位置入口在设置视图'));
  /* B4 同一数据源：在小奥里改每日目标，个人中心与 progress.settings 同步 */
  const goalSelect = collectByClass(dialog, 'profile-input').find(el => el.tagName === 'SELECT');
  goalSelect.value = '45';
  dispatch(goalSelect, 'change', {});
  assert.equal(page.progress.settings().dailyGoalMinutes, 45, check('B4：小奥里改每日目标写入同一 settings'));
  dispatch(querySelect(dialog, '.dialog-close'), 'click', {});

  /* D1：角色形态——装备「小奥 · 少年」后面板渲染 bust（多表情生成器输出） */
  const equip = page.progress.equipCompanion('odin-boy');
  assert.equal(equip.ok, true, check('D1：小奥·少年默认解锁可直接装备'));
  dispatch(trigger, 'click', {});
  const dialog2 = collectByClass(dom.body, 'assistant-dialog').find(item => item.open === true);
  const bust = querySelect(dialog2, '.assistant-bust');
  assert.ok(bust, check('D1：装备角色后面板有 bust 大图'));
  assert.ok(bust.src.includes(encodeURIComponent('viewBox="0 0 128 128"')), check('D1：bust 是 128 viewBox 角色图（表情生成器输出）'));
  assert.ok(dialog2.querySelector('.assistant-trigger') === null, check('D1：bust 只在面板内，触发按钮仍是小图标'));
  /* 触发按钮的形象也跟着装备走。v4.8：默认角色是 file 图（nono icon.webp），
   * 直接调 API 不重绘触发按钮——重新挂载页面后断言真实渲染结果，
   * 防止旧断言因「默认值恰好也是长 data URL」而假通过。 */
  const equipPage = newPage({ storage });
  const triggerImg = querySelect(querySelect(equipPage.dom.body, '.assistant-trigger'), '.assistant-avatar');
  assert.ok(triggerImg && triggerImg.src.startsWith('data:image/svg+xml') && triggerImg.src.length > 100,
    check('D1：触发按钮形象随装备更新（odin-boy procedural 图标）'));
  assert.equal(page.progress.cosmetics().companionId, 'odin-boy', check('D1：装备状态持久'));
}

console.log(`通过：首页信息架构 ${checks} 项断言（首页默认 DOM 极简、v4.5 主入口 6→3=学习进度/今日计划/学习地图、学习地图三 Tab 技能路线/世界地图/Foundations 探索、sheet 真实打开、焦点归还、目录 dialog 19+27 红线、header 玩家区/主题快捷、badge 随数据刷新、成就收藏与统计归个人中心、小奥面板 2.0 默认极简/四入口/双角色/设置同源）。`);
