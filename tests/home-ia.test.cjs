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
const fs = require('node:fs');
const path = require('node:path');

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
  for (const fact of ['8 个 World', '197 课', '前 20 课']) {
    assert.ok(!hero.textContent.includes(fact), check(`第三轮：Hero 不再塞「${fact}」`));
  }
  assert.ok(!main.textContent.includes('核对日期 2026-09-09'), check('v4.5.1：首页主内容移除核对日期'));
}

/* ===================== 1c. v4.5.1 关于本站只有短 FAQ（v4.11.2 起 4 个） ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const usage = querySelect(page.dom.body, '.site-usage');
  assert.ok(usage, check('v4.5.1：首页保留低打扰「关于本站」折叠区'));
  const faqItems = collectByClass(usage, 'site-faq-item');
  assert.equal(faqItems.length, 4, check('v4.5.1：关于本站恰好 4 个 FAQ 主项（v4.11.2 A2：第 4 项承接从课页资源区移出的核验方法论）'));
  assert.deepEqual(faqItems.map(item => querySelect(item, '.site-faq-question').textContent),
    ['本站怎么用？', '中文内容覆盖到哪里？', '哪些内容需要联网？', '外部资料链接是怎么核验的？'],
    check('v4.5.1：FAQ 标题精确且顺序稳定（第二轮：移除「为什么只有前 19 课」的误导设问；v4.11.2：新增核验方法 FAQ）'));
  /* v4.11.2 A2 证明：核验方法论（状态码 / oEmbed 等审计信息）完整落在首页 FAQ 第 4 项，
   * 课页资源区前言不再出现（对应断言在 content.test.cjs 的渲染段）。
   * method 字段的原话是「逐条 curl 核验状态码」「YouTube oEmbed 公开接口」，按子串断言。 */
  const methodAnswer = faqItems[3].textContent;
  assert.ok(methodAnswer.includes('oEmbed') && methodAnswer.includes('状态码'), check('v4.11.2 A2：核验方法论全文在首页 FAQ 第 4 项'));
  assert.ok(methodAnswer.includes('逐条核验') && /\d{4}-\d{2}-\d{2}/.test(methodAnswer), check('v4.11.2 A2：FAQ 第 4 项含核验日期'));
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
  assert.ok(worldCards[0].textContent.includes('前 20 课已有中文学习内容'),
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
  assert.equal(collectByClass(catalogDialog, 'lesson-link').length, 20,
    check('目录 dialog 内已开放课程链接恰好 20 条（21-46 课无链接的红线不变）'));
  assert.equal(collectByClass(catalogDialog, 'lesson-locked').length, 26,
    check('目录 dialog 内 26 课灰化不可点'));
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

/* ============ v4.11 批次 F（B3）：首页路线预览条的轻量场景化 ============
 * 证明的验收标准：首页四格路线预览（Foundations / HTML & CSS / JavaScript /
 * Node.js）各自带一层低饱和环境暗示，而**结构、数量、状态、进度与点击语义
 * 一字不变**——整条仍是一个 button，四格仍不可聚焦、不可单独点击；学习地图
 * sheet 里的 8 张 .world-card 不属于本组范围（它们的场景层是 v4.11 G2a 的
 * 独立任务，下面另有一组断言专项钉住）。
 * 说明：交接原文写的是「首页四张 World 卡」，但本地真实首页没有 .world-card
 * （那 8 张在学习地图 sheet 内），首页对应物是这条 .world-preview 预览条——
 * 已与用户确认按真实 DOM 收敛为「路线预览条四项」，属于实现锚点纠正。 */
{
  const root = path.resolve(__dirname, '..');
  const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  const page = newPage({ storage: makeStorage() });
  const { dom } = page;

  const bar = querySelect(dom.body, '.world-preview');
  assert.ok(bar, check('F/B3：首页有路线预览条 .world-preview'));
  assert.equal(bar.tagName, 'BUTTON', check('F/B3：整条预览条仍是**一个** button（没有改造成四张大卡）'));
  assert.equal(bar.type, 'button', check('F/B3：button type=button 原样'));

  const items = collectByClass(bar, 'world-preview-item');
  assert.equal(items.length, 4, check('F/B3：预览条仍是 4 格'));
  assert.deepEqual(items.map(i => querySelect(i, '.world-preview-name').textContent),
    ['Foundations', 'HTML & CSS', 'JavaScript', 'Node.js'],
    check('F/B3：四格名称一字不变'));
  assert.deepEqual(items.map(i => querySelect(i, '.world-preview-state').textContent),
    ['0 / 46', '尚未开放', '尚未开放', '尚未开放'],
    check('F/B3：四格状态文案与进度口径一字不变（Foundations 带真实进度）'));
  assert.deepEqual(items.map(i => i.classList.contains('is-open')), [true, false, false, false],
    check('F/B3：开放/未开放标记不变（只有 Foundations 是 is-open）'));

  /* 场景化的钩子：色相写在 data-world-tone 上，是纯展示层，不是课程数据 */
  assert.deepEqual(items.map(i => i.dataset.worldTone),
    ['foundations', 'html-css', 'javascript', 'nodejs'],
    check('F/B3：四格各带一个 data-world-tone tone 钩子（v4.11.15 起为主题派生色晕，四格靠几何区分）'));
  const curriculum = page.sandbox.window.ODIN_CURRICULUM;
  const tones = new Set(items.map(i => i.dataset.worldTone));
  assert.equal(tones.size, 4, check('F/B3：四个 tone 两两不同（四格各画各的几何）'));
  assert.ok(!/world-tone[^"']*"\s*:\s*(true|false|\d)/.test(JSON.stringify(curriculum)),
    check('F/B3：tone 没有写进课程数据（curriculum.js 一字未动）'));

  /* 点击语义：整条仍打开学习地图，四格本身不可聚焦、不可点击 */
  for (const item of items) {
    assert.equal(item.tagName, 'SPAN', check('F/B3：格子仍是 span（不是 button/link，保持不可聚焦）'));
    assert.equal(item.getAttribute('tabindex'), null, check('F/B3：格子没有 tabindex（不进 Tab 序列）'));
    assert.equal((item.listeners && item.listeners.click) || null, null, check('F/B3：格子自身没有 click 监听'));
  }
  dispatch(bar, 'click', {});
  const sheet = collectByClass(dom.body, 'sheet').find(s => s.open);
  assert.ok(sheet, check('F/B3：点击整条预览条仍打开学习地图 sheet'));
  assert.equal(collectByClass(sheet, 'world-card').length, 8,
    check('F/B3：点开学习地图仍是 8 张 .world-card（B3 只加首页预览条色晕，未改动这 8 张的数量与结构）'));
  sheet.close();

  /* ---------- 色晕的 CSS 纪律 ----------
   * 只在批次 F（B3）那一段里找规则：`.world-preview-item` 在文件里有多条（基础
   * 排版那条在前），全文件取首个匹配会拿到基础排版规则而不是色晕规则。 */
  const b3 = css.slice(css.indexOf('v4.11 批次 F（B3）'));
  assert.ok(b3.length > 0, check('F/B3：style.css 里有批次 F（B3）色晕段'));
  const ruleBody = selector => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = new RegExp(`(?:^|\\n)\\s*${escaped} \\{([^}]*)\\}`).exec(b3);
    assert.ok(m, check(`规则存在：${selector}`));
    return m[1];
  };
  const base = ruleBody('.world-preview-item');
  assert.ok(base.includes('position: relative') && base.includes('isolation: isolate'),
    check('F/B3：.world-preview-item 建自己的层叠上下文（色晕只压在本格文字之下）'));
  const veil = ruleBody('.world-preview-item::before');
  assert.ok(veil.includes("content: ''"), check('F/B3：色晕由 ::before 生成'));
  assert.ok(veil.includes('pointer-events: none'), check('F/B3：色晕 pointer-events:none——绝不拦截指针'));
  assert.ok(veil.includes('z-index: -1'), check('F/B3：色晕 z-index:-1——画在名称与状态文字之下，不遮挡'));
  assert.ok(/opacity:\s*\.55/.test(veil), check('F/B3：未开放三格统一降到 55% 不透明度'));
  assert.ok(/opacity:\s*1/.test(ruleBody('.world-preview-item.is-open::before')),
    check('F/B3：已开放的 Foundations 是唯一满强度的一格（未开放项视觉权重严格更低）'));

  const toneRules = ['foundations', 'html-css', 'javascript', 'nodejs']
    .map(tone => ruleBody(`.world-preview-item[data-world-tone="${tone}"]::before`));
  assert.equal(toneRules.filter(body => /background:/.test(body)).length, 4,
    check('F/B3：四个 tone 各有自己的 background（不是四格同一套）'));
  /* v4.11.15：色源只能是 --color-accent 的 color-mix 派生。这条不写在别处——
   * 「零固定色」的断言原先只覆盖地图卡，负向验证（把 foundations 色晕改回旧绿
   * rgba）正是从预览条这一侧漏过去的，所以这里单独补一条同名纪律。 */
  ['foundations', 'html-css', 'javascript', 'nodejs'].forEach((tone, i) => {
    assert.ok(!/#[0-9a-fA-F]{3,8}\b|rgba?\(/.test(toneRules[i]),
      check(`F/B3：${tone} 的色晕零固定色（旧五色已清零，色值只经 color-mix 派生）`));
    const stripped = toneRules[i].replace(/var\(--color-accent\)\s+[\d.]+%,\s*transparent\)/g, '');
    assert.ok(!/var\(--color-accent\)/.test(stripped),
      check(`F/B3：${tone} 不裸用 --color-accent，一律经 color-mix 低饱和派生`));
  });

  /* 低饱和与无动画：整段色晕里每个色标的 alpha ≤ .16 */
  const alphas = [];
  for (const body of [veil, ...toneRules]) {
    for (const m of body.matchAll(/rgba?\(([^)]+)\)/g)) {
      const parts = m[1].split(',').map(s => s.trim());
      alphas.push(parts.length === 4 ? Number(parts[3]) : 1);
    }
    /* v4.11.15：色源由固定 rgba 改「主题主色 + 百分比」的 color-mix 派生。alpha
     * 语义等价——color-mix 在预乘 alpha 空间插值，16% 就是 rgba 的 .16。纪律与上限
     * 一字未动，只是换了写法，所以两种写法都收（上限断言因此对两代值同等生效）。 */
    for (const m of body.matchAll(/color-mix\(in srgb, var\(--color-accent\) ([\d.]+)%, transparent\)/g)) {
      alphas.push(Number(m[1]) / 100);
    }
    assert.ok(!/animation\s*:/.test(body) && !/@keyframes/.test(body),
      check('F/B3：色晕规则零 animation / @keyframes'));
    assert.ok(!/--color-[a-z-]+\s*:/.test(body), check('F/B3：色晕规则零新 token 定义'));
    assert.ok(!/url\s*\(|https?:/.test(body), check('F/B3：色晕只用渐变，零位图 / 零外链'));
  }
  assert.ok(alphas.length >= 12, check(`F/B3：色晕逐层显式控制透明度（${alphas.length} 个色标）`));
  assert.ok(alphas.every(a => a <= .16),
    check(`F/B3：全部色标 alpha ≤ .16（实际上限 ${Math.max(...alphas)}）——低饱和、不抢课程标题`));

  /* 窄屏与打印：装饰收起，文字与状态保留 */
  const narrow = [...css.matchAll(/@media \(max-width: 40rem\) \{([\s\S]*?)\n\}/g)].map(m => m[1]);
  assert.ok(narrow.some(b => /\.world-preview-item::before \{ display: none; \}/.test(b)),
    check('F/B3：<40rem 收起色晕（四项文字与状态由基础规则保留，不做第二套小尺寸装饰）'));
  assert.ok(/@media print \{[\s\S]*?\.world-preview-item::before \{ display: none; \}/.test(css),
    check('F/B3：print 不残留色晕（兜底；预览条本身已在 .home-secondary 里被打印隐藏）'));
}

/* ===================== v4.11 G2a：学习地图 8 张 World 卡的轻量场景层 =====================
 * 证明的验收标准（交接 §十 的 1–15 条）：
 *   1. 8 张 .world-card 的数量、World 1–8 顺序、button 语义、开放/锁定状态、文案结构、
 *      进度条有无、aria-label 与点击路径**一字不变**；
 *   2. 每张卡多一个**纯展示**色相钩子 data-world-tone，与 course.order 一一对应，
 *      不写进 curriculum.js、不进 localStorage；
 *   3. 对应的 CSS 场景层满足层级 / 强度 / 零动画 / 零外链纪律，且未开放卡严格弱于
 *      唯一开放的 Foundations；
 *   4. 首页路线预览条（批次 F B3 的成果）零回归。
 * **映射按 curriculum.js 的真实顺序绑定**：G2a 规划交接的语义表把 Node.js 写在
 * World 4，与本地数据不符（真实 World 4 是 advanced-html-and-css「高级 HTML 与
 * CSS」，NodeJS 在 World 7），已由用户 2026-09-18 确认按真实数据修正。本组用真实
 * 中文名与 id 逐张钉住，任何回退到「World 4 = Node.js」的写法都会立刻变红。 */
{
  const G2A_TONES = ['foundations', 'html-css', 'javascript', 'html-css-deep',
    'world-generic-a', 'world-generic-b', 'nodejs', 'world-generic-c'];
  const G2A_ZH = ['Foundations 前端基础', '中级 HTML 与 CSS', 'JavaScript', '高级 HTML 与 CSS',
    'React', '数据库', 'NodeJS', '求职之路'];
  const root = path.resolve(__dirname, '..');
  const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  const page = newPage({ storage: makeStorage() });
  const { dom } = page;

  const storageKeys = () => {
    const list = [];
    for (let i = 0; i < page.sandbox.localStorage.length; i += 1) list.push(page.sandbox.localStorage.key(i));
    return list.sort();
  };
  const keysAtStart = storageKeys();

  clickEntry(page, '学习地图');
  const sheet = openSheetOf(page);
  const worldTab = collectByClass(sheet, 'map-tab').find(t => t.textContent.includes('世界地图'));
  dispatch(worldTab, 'click', {});
  const cards = collectByClass(sheet, 'world-card');
  const textAt = (card, cls) => (querySelect(card, '.' + cls) || { textContent: '' }).textContent;

  /* ---------- 1. 卡片业务事实零改动（G2a 只加表现层） ---------- */
  assert.equal(cards.length, 8, check('G2a：学习地图仍是 8 张 World 卡'));
  assert.deepEqual(cards.map(c => textAt(c, 'world-order')),
    ['World 1', 'World 2', 'World 3', 'World 4', 'World 5', 'World 6', 'World 7', 'World 8'],
    check('G2a：World 1–8 顺序一字不变'));
  assert.deepEqual(cards.map(c => textAt(c, 'world-zh')), G2A_ZH,
    check('G2a：8 个 World 的中文名与 curriculum.js 真实顺序一致（钉住 World 4 = 高级 HTML 与 CSS，不是 Node.js）'));
  assert.ok(cards.every(c => c.tagName === 'BUTTON' && c.type === 'button'),
    check('G2a：8 张卡仍然都是 button（type=button），没有变成 div 或链接'));
  assert.deepEqual(cards.map(c => c.classList.contains('is-open')), [true, false, false, false, false, false, false, false],
    check('G2a：开放状态不变——只有 World 1 Foundations 是 is-open'));
  assert.deepEqual(cards.map(c => c.classList.contains('is-locked')), [false, true, true, true, true, true, true, true],
    check('G2a：锁定状态不变——其余 7 张仍是 is-locked'));
  assert.ok(cards.every(c => ['world-order', 'world-zh', 'world-en', 'world-stats', 'world-hint']
    .every(cls => querySelect(c, '.' + cls))),
    check('G2a：每张卡的文案结构（编号 / 中文名 / 英文名 / 统计 / 提示）完整保留'));
  assert.deepEqual(cards.map(c => Boolean(querySelect(c, '.world-mini-progress'))),
    [true, false, false, false, false, false, false, false],
    check('G2a：只有开放的 World 1 带完成度进度条，未开放卡不放假进度'));
  assert.ok(cards[0].textContent.includes('前 20 课已有中文学习内容'),
    check('G2a：World 1 的中文覆盖说明保留（自 Hero 下沉的那句）'));
  assert.ok(cards.slice(1).every(c => c.textContent.includes('尚未开放中文内容')),
    check('G2a：7 张未开放卡仍明确写「尚未开放中文内容」——装饰不替代状态文案'));
  assert.ok(cards.every((c, i) => {
    const label = c.getAttribute('aria-label') || '';
    return label.startsWith('World ' + (i + 1) + ' ') && label.includes(G2A_ZH[i]);
  }), check('G2a：aria-label 仍按「World N + 中文名」组织，没有被色相钩子改写'));
  const focusables = [];
  for (const card of cards) {
    if (card.getAttribute('tabindex') !== null) focusables.push('tabindex');
    (function walk(el) {
      for (const child of el.children) {
        if (['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(child.tagName)) focusables.push(child.tagName);
        walk(child);
      }
    })(card);
  }
  assert.equal(focusables.length, 0,
    check('G2a：卡内没有新增任何可聚焦元素（仍是每张卡一个 Tab 停靠点）'));

  /* ---------- 2. 纯展示色相钩子：与 course.order 一一对应 ---------- */
  assert.deepEqual(cards.map(c => c.dataset.worldTone), G2A_TONES,
    check('G2a：8 张卡各带一个 data-world-tone，逐项等于锁定映射（1 foundations … 4 html-css-deep … 7 nodejs … 8 world-generic-c）'));
  assert.equal(new Set(cards.map(c => c.dataset.worldTone)).size, 8,
    check('G2a：8 个 tone 两两不同——无缺失、无重复错误'));
  assert.equal(cards.filter(c => c.dataset.worldTone === 'nodejs').length, 1,
    check('G2a：青绿的 nodejs 只出现在 1 张卡上'));
  assert.equal(cards.findIndex(c => c.dataset.worldTone === 'nodejs'), 6,
    check('G2a：nodejs 绑定的是第 7 张（NodeJS）'));
  assert.notEqual(cards[3].dataset.worldTone, 'nodejs',
    check('G2a：World 4（高级 HTML 与 CSS）不得被画成 Node.js——交接表错误已被钉死'));
  assert.equal(cards.filter(c => c.dataset.worldTone.startsWith('world-generic')).length, 3,
    check('G2a：World 5 / 6 / 8 三张走统一的后续世界弱化 tone'));

  /* 映射依据是真实课程数据，不是中文名匹配 */
  const cur = page.sandbox.window.ODIN_CURRICULUM;
  const byOrder = [...cur.courses].sort((a, b) => a.order - b.order);
  assert.deepEqual(byOrder.map(c => c.order), [1, 2, 3, 4, 5, 6, 7, 8],
    check('G2a：curriculum 的 course.order 是 1–8 连续（映射键本身稳定）'));
  assert.equal(byOrder[3].id, 'advanced-html-and-css',
    check('G2a：第 4 个 World 的真实 id 是 advanced-html-and-css（交接表把它写成 Node.js 是错的）'));
  assert.equal(byOrder[6].id, 'nodejs',
    check('G2a：NodeJS 的真实位置是第 7 个 World'));
  assert.ok(byOrder.every((c, i) => c.zh === G2A_ZH[i]),
    check('G2a：DOM 第 i 张卡的中文名与 order=i+1 的真实课程逐一对应（顺序与色相共用同一把尺）'));

  /* 色相不进课程数据、不进存档 */
  const curJson = JSON.stringify(cur);
  /* 这里刻意**不**用「tone 字面量都不出现」来判：tone 词汇故意沿用了官方命名，
   * 'javascript' 与 'nodejs' 本身就是 World 3 / World 7 的 course.id，字符串层
   * 判定必然假红。改成结构化判定——课程对象里不许出现任何色相 / 装饰类字段。 */
  assert.ok(byOrder.every(c => !Object.prototype.hasOwnProperty.call(c, 'tone')),
    check('G2a：curriculum 的课程对象里没有 tone 字段'));
  assert.ok(byOrder.every(c => !Object.keys(c).some(k => /tone|decor|scene/i.test(k))),
    check('G2a：课程对象里没有任何色相 / 装饰类新字段'));
  assert.ok(curJson.indexOf('world-generic') === -1 && curJson.indexOf('html-css-deep') === -1,
    check('G2a：只有 G2a 才有的两个 tone（world-generic / html-css-deep）不出现在 curriculum.js 里'));
  assert.ok(!/worldTone|data-world-tone/.test(curJson),
    check('G2a：curriculum 里没有色相钩子字段（纯表现层）'));

  /* ---------- 3. 点击路径与零持久化 ---------- */
  dispatch(cards[0], 'click', {});
  assert.ok(collectByClass(sheet, 'map-nodes').length >= 1,
    check('G2a：World 1 仍能进入 Foundations 探索地图（装饰层没有拦截点击）'));
  dispatch(collectByClass(sheet, 'world-back')[0], 'click', {});
  assert.equal(collectByClass(sheet, 'world-card').length, 8,
    check('G2a：返回后回到 8 张 World 卡'));
  dispatch(collectByClass(sheet, 'world-card')[4], 'click', {});
  assert.ok(sheet.textContent.includes('React') && collectByClass(sheet, 'lesson-link').length === 0,
    check('G2a：未开放 World 仍是结构占位、零 lesson.html 链接（F3 红线不回归）'));
  dispatch(collectByClass(sheet, 'world-back')[0], 'click', {});
  assert.deepEqual(storageKeys(), keysAtStart,
    check('G2a：整条「开列表 → 进 World → 返回」链路零新增 localStorage key（色相不进存档、不进 schema）'));
  sheet.close();

  /* ---------- 4. CSS 场景层纪律（只在 G2a 段里找规则） ---------- */
  const g2a = css.slice(css.indexOf('v4.11 G2a'));
  assert.ok(g2a.length > 0, check('G2a：style.css 里有 G2a 段'));
  const ruleBody = selector => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = new RegExp('(?:^|\\n)\\s*' + escaped + ' \\{([^}]*)\\}').exec(g2a);
    assert.ok(m, check('G2a：规则存在 ' + selector));
    return m[1];
  };
  const cardBase = ruleBody('.world-card');
  assert.ok(/position:\s*relative/.test(cardBase) && /isolation:\s*isolate/.test(cardBase),
    check('G2a：卡片建立自己的叠加上下文（position:relative + isolation:isolate）——装饰才可能只压在本卡背景之上、内容之下'));

  const pseudo = /\.world-card::before,\s*\.world-card::after \{([^}]*)\}/.exec(g2a);
  assert.ok(pseudo, check('G2a：::before / ::after 共用一条基础规则'));
  const pseudoBody = pseudo ? pseudo[1] : '';
  for (const pair of [
    ['z-index: -1', '两层装饰都在负层，文字永远画在它们之上'],
    ['inset: 0', '两层都铺满卡片'],
    ['pointer-events: none', '不拦截指针、不参与命中'],
    ['border-radius: inherit', '铺满时不溢出卡片圆角'],
    ['opacity: .68', '未开放档的强度']
  ]) {
    assert.ok(pseudoBody.indexOf(pair[0]) !== -1, check('G2a：装饰基础规则含 ' + pair[0] + '（' + pair[1] + '）'));
  }
  const openBody = /\.world-card\.is-open::before,\s*\.world-card\.is-open::after \{([^}]*)\}/.exec(g2a);
  assert.ok(openBody && /opacity:\s*1/.test(openBody[1]),
    check('G2a：唯一开放的 Foundations 走满强度（未开放的 7 张停在 .68，视觉权重严格更低）'));

  /* 每个 tone 都有色晕层；主场景另有轮廓层；三个 generic 只有一层 */
  const toneVeils = {};
  const toneOutlines = {};
  for (const tone of G2A_TONES) {
    const veil = ruleBody('.world-card[data-world-tone="' + tone + '"]::before');
    assert.ok(/background:/.test(veil), check('G2a：' + tone + ' 的色晕层有自己的 background（不是所有卡同一套）'));
    toneVeils[tone] = veil;
    const outline = new RegExp('\\.world-card\\[data-world-tone="' + tone + '"\\]::after \\{([^}]*)\\}').exec(g2a);
    if (outline) toneOutlines[tone] = outline[1];
  }
  assert.deepEqual(Object.keys(toneOutlines).sort(),
    ['foundations', 'html-css', 'html-css-deep', 'javascript', 'nodejs'],
    check('G2a：四个主场景（foundations / html-css / html-css-deep / javascript / nodejs）各有轮廓层，共 5 个'));
  assert.ok(G2A_TONES.filter(t => t.startsWith('world-generic')).every(t => !toneOutlines[t]),
    check('G2a：三个后续世界只有一层色晕、没有轮廓层（层级上就更弱）'));

  /* 强度与低饱和 */
  /* v4.11.15：色源由固定 rgba 改「主题主色 + 百分比」的 color-mix 派生；alpha
   * 语义等价（预乘 alpha 空间插值，16% == rgba 的 .16），上限纪律一字未动。 */
  const alphaOf = body => [
    ...[...body.matchAll(/rgba?\(([^)]+)\)/g)].map(m => {
      const parts = m[1].split(',').map(s => s.trim());
      return parts.length === 4 ? Number(parts[3]) : 1;
    }),
    ...[...body.matchAll(/color-mix\(in srgb, var\(--color-accent\) ([\d.]+)%, transparent\)/g)]
      .map(m => Number(m[1]) / 100)
  ];
  const allBodies = [...Object.values(toneVeils), ...Object.values(toneOutlines), pseudoBody];
  const allAlphas = allBodies.reduce((acc, b) => acc.concat(alphaOf(b)), []);
  assert.ok(allAlphas.length >= 30, check('G2a：逐层显式控制透明度（' + allAlphas.length + ' 个色标）'));
  assert.ok(allAlphas.every(a => a <= .22),
    check('G2a：全部色标 alpha ≤ .22（实际上限 ' + Math.max.apply(null, allAlphas) + '）——低饱和、不抢 World 名称与状态'));
  const fndAlphas = alphaOf(toneVeils.foundations).concat(alphaOf(toneOutlines.foundations));
  assert.ok(Math.max.apply(null, fndAlphas) >= .16,
    check('G2a：Foundations 至少有一处 ≥ .16 ——「最清楚的一档」不是空话'));
  const genAlphas = G2A_TONES.filter(t => t.startsWith('world-generic'))
    .reduce((acc, t) => acc.concat(alphaOf(toneVeils[t])), []);
  assert.ok(genAlphas.every(a => a <= .09),
    check('G2a：三个后续世界色标全部 ≤ .09（实际上限 ' + Math.max.apply(null, genAlphas) + '）——比任何主场景都弱'));
  assert.notEqual(toneVeils['html-css-deep'], toneVeils['html-css'],
    check('G2a：World 4 的 html-css-deep 与 World 2 的 html-css 同源但不重样（v4.11.15 起靠几何：双向密网格 vs 单向竖线）'));
  assert.ok(toneOutlines['html-css-deep'].indexOf('.34rem') !== -1 && toneOutlines['html-css'].indexOf('.66rem') !== -1,
    check('G2a：World 4 的结构线比 World 2 更密（.34rem vs .66rem），两张卡不会看成同一张'));

  /* ---------- v4.11.15：色源统一到主题主色派生（取代原来的固定五色） ---------- */
  {
    /* tone 规则里零固定色：不能有 hex 也不能有 rgba 字面量，色源只能是
     * --color-accent 的 color-mix 派生（裸引用 accent 会把装饰读成操作色）。 */
    const toneBodies = [...Object.values(toneVeils), ...Object.values(toneOutlines)];
    for (const [tone, body] of Object.entries(Object.assign({}, toneVeils, toneOutlines))) {
      assert.ok(!/#[0-9a-fA-F]{3,8}\b|rgba?\(/.test(body),
        check('G2a：' + tone + ' 的装饰层零固定色（旧五色已清零，色值只经 color-mix 派生）'));
    }
    for (const [tone, body] of Object.entries(Object.assign({}, toneVeils, toneOutlines))) {
      const colors = body.match(/(?:background|linear-gradient|radial-gradient|repeating-linear-gradient)[^;]*/g) || [];
      colors.forEach(decl => {
        const refs = decl.match(/(?:var\(--[a-z-]+\)|#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|transparent)/g) || [];
        refs.filter(r => r.startsWith('var(')).forEach(ref => assert.equal(ref, 'var(--color-accent)',
          check('G2a：' + tone + ' 的色源只允许 --color-accent（实际出现 ' + ref + '）')));
      });
      const stripped = body.replace(/var\(--color-accent\)\s+[\d.]+%,\s*transparent\)/g, '');
      assert.ok(!/var\(--color-accent\)/.test(stripped),
        check('G2a：' + tone + ' 不裸用 --color-accent，一律经 color-mix 低饱和派生'));
    }
    /* 同一个 World 在两处颜色一致：首页预览条与地图卡用的是同一套色源 */
    const b3Section = css.slice(css.indexOf('v4.11 批次 F（B3）'), css.indexOf('v4.11 G2a'));
    assert.ok(b3Section.length > 0, check('G2a：能切出批次 F（B3）预览条段做同源比对'));
    for (const tone of ['foundations', 'html-css', 'javascript', 'nodejs']) {
      const sel = '.world-preview-item\\[data-world-tone="' + tone + '"\\]';
      const m = new RegExp(sel + '::before \\{([^}]*)\\}').exec(b3Section);
      assert.ok(m && /color-mix\(in srgb, var\(--color-accent\)/.test(m[1]),
        check('G2a：预览条 ' + tone + ' 与地图卡同源（--color-accent 派生）'));
    }
  }

  /* 零动画 / 零外链 / 零新 token */
  const named = Object.assign({}, toneVeils, toneOutlines);
  for (const name of Object.keys(named)) {
    const body = named[name];
    assert.ok(!/animation\s*:/.test(body) && !/@keyframes/.test(body),
      check('G2a：' + name + ' 零 animation / @keyframes'));
    assert.ok(!/url\s*\(|https?:/.test(body), check('G2a：' + name + ' 只用渐变，零位图 / 零外链'));
    assert.ok(!/transition\s*:/.test(body), check('G2a：' + name + ' 没有新增 transition（卡片既有过渡不受影响）'));
    assert.ok(!/--color-[a-z-]+\s*:/.test(body), check('G2a：' + name + ' 零新 token 定义'));
  }

  /* 响应式与打印 */
  const narrow = [...css.matchAll(/@media \(max-width: 40rem\) \{([\s\S]*?)\n\}/g)].map(m => m[1]);
  assert.ok(narrow.some(b => /\.world-card::before, \.world-card::after \{ content: none; \}/.test(b)),
    check('G2a：<40rem 收起整套装饰（8 张卡的文字 / 状态 / 提示由基础规则完整保留）'));
  assert.ok(/@media print \{[\s\S]{0,220}?\.world-card::before, \.world-card::after \{ content: none; \}/.test(css),
    check('G2a：print 不残留装饰（兜底；.world-list 本身在既有 print 规则里已整体 display:none）'));
  assert.ok(/@media print \{[\s\S]{0,220}?\.world-list, \.world-back \{ display: none; \}/.test(css),
    check('G2a：既有「打印隐藏 World 列表」规则原样在位（本轮没有放开打印）'));

  /* ---------- 5. 首页路线预览条零回归（G2a 不碰首页） ---------- */
  const bar = querySelect(dom.body, '.world-preview');
  assert.ok(bar && bar.tagName === 'BUTTON', check('G2a：首页路线预览条仍是一个 button（G2a 未改动首页）'));
  assert.deepEqual(collectByClass(bar, 'world-preview-item').map(i => i.dataset.worldTone),
    ['foundations', 'html-css', 'javascript', 'nodejs'],
    check('G2a：首页预览条四项色相仍是批次 F 那四个，未被 G2a 改写成地图卡的八色'));
}

/* ============ v4.11：World 图片原型定向撤回 + 首页信息带（两轮）============
 * 组内有三条互不替代的验收线：
 *   A. **定向撤回**（不是回滚）：v5 Foundations 单卡场景图原型经真实页面比较后不采用，
 *      图片资产 / 挂载代码 / 样式段 / 上一版本文件里的旧断言组一起移除。**同时保留**：
 *      G2a 的纯 CSS/SVG 场景层、8 张 World 卡、tone 映射、地图状态色补丁、
 *      Hero、默认夜空、课程 / 状态 / 进度 / 存储逻辑。
 *   B. **首页信息带第一轮（结构语言）**：Hero 下方 `.home-secondary` 从「三块堆叠」
 *      收成「一条带」——统一左轨 / 两道细分隔线 / 虚线框退场 / hover 降重。
 *   C. **首页信息带第二轮（呼吸与圆角）**：第一轮把留白全换成线，真实页面实测三段
 *      **零间距顶格**、三入口**列间距只有 8px**、容器圆角 8px 偏硬 → 本轮补呼吸
 *      （线两侧留白 + 列间距 24px + Hero 与带拉开到 48px）与抬圆角（容器 14px、
 *      带内可点元素 `--radius-medium`），并**删掉第一轮那条把图标圆角从项目原本的
 *      12px 压到 4px 的误解覆盖**（该覆盖的注释写的是「补齐缺失的圆角」，与事实不符）。
 * 三段的结构、数量、状态、文案、aria 与点击路径在 B/C 两轮里都一字未变。
 * 本组是**替换**：最早的「单卡原型」断言组整组删除——它钉的是已撤回的挂载方式，
 * 留着就是一组永远红的规则。G2a 组与批次 F（B3）组原样保留，一条未删改。
 * 「首页看起来是否更连贯 / 更有呼吸」属于用户主观验收，不在本组范围。 */
{
  const root = path.resolve(__dirname, '..');
  const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  const appSrc = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const page = newPage({ storage: makeStorage() });
  const { dom } = page;

  const storageKeys = () => {
    const list = [];
    for (let i = 0; i < page.sandbox.localStorage.length; i += 1) list.push(page.sandbox.localStorage.key(i));
    return list.sort();
  };
  const keysAtStart = storageKeys();

  /* ---------- A1–A2. v5 定向撤回：产品源码与资产里零残留 ---------- */
  /* 逐个字面量扫，而不是「看起来没有了」：撤回最容易留下的就是孤儿标识符与孤儿路径。 */
  for (const literal of ['WORLD_CARD_ART', 'worldCardArt', 'world-card-art', 'has-world-art', 'foundations-v5', 'assets/worlds']) {
    assert.ok(!appSrc.includes(literal), check(`撤回：app.js 不含已删除的字面量「${literal}」`));
    assert.ok(!css.includes(literal), check(`撤回：style.css 不含已删除的字面量「${literal}」`));
  }
  assert.ok(!fs.existsSync(path.join(root, 'assets', 'worlds')),
    check('撤回：assets/worlds/ 目录已随资产一并移除（不留空目录）'));
  const assetFiles = [];
  const walkAssets = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walkAssets(full);
      else assetFiles.push(path.relative(root, full).replace(/\\/g, '/'));
    }
  };
  walkAssets(path.join(root, 'assets'));
  assert.ok(!assetFiles.some(f => /\.png$/i.test(f)),
    check('撤回：assets/ 下不再有任何 PNG（v5 是唯一一张，未留残影）'));

  /* ---------- A3–A6. G2a 与地图状态色补丁必须原样在位 ---------- */
  clickEntry(page, '学习地图');
  const sheet = openSheetOf(page);
  dispatch(collectByClass(sheet, 'map-tab').find(t => t.textContent.includes('世界地图')), 'click', {});
  const cards = collectByClass(sheet, 'world-card');

  assert.equal(cards.length, 8, check('撤回：学习地图仍是 8 张 World 卡（撤回没有动到卡片数量）'));
  assert.deepEqual(cards.map(c => (querySelect(c, '.world-order') || {}).textContent),
    ['World 1', 'World 2', 'World 3', 'World 4', 'World 5', 'World 6', 'World 7', 'World 8'],
    check('撤回：World 1–8 顺序一字不变'));
  assert.ok(cards.every(c => c.tagName === 'BUTTON' && c.type === 'button'),
    check('撤回：8 张卡仍然都是 button'));
  assert.equal(collectByClass(sheet, 'world-card-art').length, 0,
    check('撤回：整张地图上零个 .world-card-art（场景图原型已完全卸下）'));
  assert.deepEqual(cards.map(c => c.classList.contains('has-world-art')),
    [false, false, false, false, false, false, false, false],
    check('撤回：8 张卡都没有 .has-world-art 钩子（没有留下半截样式钩子）'));
  assert.equal(cards[0].children[0], querySelect(cards[0], '.world-head'),
    check('撤回：World 1 的第一块重新是 .world-head（DOM 与 G2a 阶段逐字一致）'));
  assert.deepEqual(cards.map(c => c.dataset.worldTone),
    ['foundations', 'html-css', 'javascript', 'html-css-deep', 'world-generic-a', 'world-generic-b', 'nodejs', 'world-generic-c'],
    check('撤回：G2a 的 8 个 tone 映射逐项未变（World 4 仍是 html-css-deep、World 7 仍是 nodejs）'));
  assert.deepEqual(cards.map(c => c.classList.contains('is-open')),
    [true, false, false, false, false, false, false, false],
    check('撤回：开放/锁定状态未变——只有 World 1 是 is-open'));
  assert.ok(cards.every((c, i) => (c.getAttribute('aria-label') || '').startsWith(`World ${i + 1} `)),
    check('撤回：8 张卡的 aria-label 仍按「World N + 中文名」组织'));
  assert.ok(css.includes('v4.11 G2a：学习地图 8 张 World 卡的轻量场景层'),
    check('撤回：G2a 段仍在 style.css 里（只撤图片原型，不动 CSS/SVG 场景层）'));
  assert.ok(/\.world-card\[data-world-tone="foundations"\]::before \{/.test(css),
    check('撤回：Foundations 的 G2a 色晕规则原样在位'));
  assert.ok(/\.map-node\.is-defeated:not\(\.is-current\) \{[^}]*box-shadow: 0 0 0 3px #d4af37/.test(css),
    check('撤回：地图状态色补丁仍在（已击破的金色 gap 环没有被本轮碰到）'));
  dispatch(cards[0], 'click', {});
  assert.ok(collectByClass(sheet, 'map-nodes').length >= 1,
    check('撤回：World 1 仍能进入 Foundations 探索地图（DOM 回到 G2a 阶段后点击路径不变）'));
  dispatch(collectByClass(sheet, 'world-back')[0], 'click', {});
  assert.equal(collectByClass(sheet, 'world-card').length, 8, check('撤回：返回后仍回到 8 张 World 卡'));
  sheet.close();

  /* ---------- B1–B4. 首页信息带：结构、数量、语义零改动 ---------- */
  const band = querySelect(dom.body, '.home-secondary');
  assert.ok(band, check('信息带：首页仍有 .home-secondary 次级信息带'));
  assert.deepEqual(band.children.map(c => c.className),
    ['today-strip', 'entry-grid-wrap', 'world-preview'],
    check('信息带：三段 DOM 顺序仍是 今日条 → 入口网格 → 路线预览条（收口只动样式，不动结构）'));

  const strip = querySelect(band, '.today-strip');
  assert.equal(strip.tagName, 'BUTTON', check('信息带：today-strip 仍是一个 button'));
  assert.equal(strip.type, 'button', check('信息带：today-strip type=button 原样'));
  assert.equal(strip.getAttribute('aria-haspopup'), 'dialog', check('信息带：today-strip 仍带 aria-haspopup="dialog"'));
  assert.ok((strip.getAttribute('aria-label') || '').includes('打开今日计划详情'),
    check('信息带：today-strip 的 aria-label 仍描述「打开今日计划详情」的操作语义'));
  assert.deepEqual(strip.children.map(c => c.className.split(' ')[0]),
    ['today-item', 'today-mini-progress', 'today-item', 'today-item', 'today-more'],
    check('信息带：今日条四类内容顺序未变（今日时长+目标进度 / 迷你进度 / 连续天数 / 待复习 / 详情）'));
  assert.ok(!/target|_blank/.test(strip.getAttribute('target') || ''), check('信息带：今日条不是外链（仍走站内 sheet）'));
  const todayText = strip.textContent;
  assert.match(todayText, /今日/, check('信息带：今日条仍显示今日学习'));
  assert.match(todayText, /连续 \d+ 天/, check('信息带：今日条仍显示连续天数'));
  assert.match(todayText, /复习/, check('信息带：今日条仍显示待复习状态'));

  const wrap = querySelect(band, '.entry-grid-wrap');
  assert.equal(wrap.tagName, 'NAV', check('信息带：entry-grid-wrap 仍是 nav'));
  assert.equal(wrap.getAttribute('aria-label'), '功能入口', check('信息带：entry-grid-wrap 的 aria-label 未变'));
  const entryCards = collectByClass(wrap, 'entry-card');
  assert.equal(entryCards.length, 3, check('信息带：入口卡仍是 3 个（本轮不增不减）'));
  assert.ok(entryCards.every(c => c.tagName === 'BUTTON' && c.type === 'button'),
    check('信息带：三个入口仍都是 button（没有被改成展示块）'));
  assert.deepEqual(entryCards.map(c => querySelect(c, '.entry-title').textContent),
    ['学习进度', '今日计划', '学习地图'],
    check('信息带：三个入口标题与顺序一字不变'));
  assert.ok(entryCards.every(c => querySelect(c, '.entry-desc') && querySelect(c, '.entry-icon') && querySelect(c, '.entry-badge')),
    check('信息带：三个入口的 图标 / 描述 / badge 三件套都还在'));
  assert.ok(entryCards.every((c, i) => (c.getAttribute('aria-label') || '').startsWith(['学习进度', '今日计划', '学习地图'][i])),
    check('信息带：三个入口的 aria-label 仍以各自标题开头'));
  /* aria-label 由「标题：描述（badge）」拼成（entryGridChildren）——按真实 DOM 的
   * 标题与描述逐卡比对，不硬编码文案，任何一处无障碍降级都会红。 */
  assert.ok(entryCards.every(c => {
    const title = querySelect(c, '.entry-title').textContent;
    const desc = querySelect(c, '.entry-desc').textContent;
    const label = c.getAttribute('aria-label') || '';
    return label.startsWith(`${title}：${desc}`) && label.includes(querySelect(c, '.entry-badge').textContent);
  }), check('信息带：三个入口的 aria-label 仍是「标题：描述（badge）」的完整等价（无障碍未降级）'));
  assert.ok(entryCards.every(c => c.getAttribute('aria-haspopup') === 'dialog'),
    check('信息带：三个入口仍带 aria-haspopup="dialog"'));

  /* 点击路径：今日条 → 今日计划；三个入口 → 各自 sheet；路线预览条 → 学习地图 */
  dispatch(strip, 'click', {});
  const tasksSheet = openSheetOf(page);
  assert.ok(tasksSheet, check('信息带：今日条点击仍打开今日计划'));
  dispatch(querySelect(tasksSheet, '.dialog-close'), 'click', {});
  for (const [label, marker] of [['学习进度', 'stat-grid'], ['今日计划', 'challenge-list'], ['学习地图', 'map-tab']]) {
    const card = entryCards.find(c => querySelect(c, '.entry-title').textContent.includes(label));
    dispatch(card, 'click', {});
    const opened = openSheetOf(page);
    assert.ok(opened && collectByClass(opened, marker).length >= 1,
      check(`信息带：「${label}」入口点击仍开启对应面板（含 .${marker}）`));
    dispatch(querySelect(opened, '.dialog-close'), 'click', {});
  }

  const bar = querySelect(band, '.world-preview');
  assert.equal(bar.tagName, 'BUTTON', check('信息带：world-preview 仍是一个 button（没有改成四张卡 / 多个按钮）'));
  assert.equal(bar.type, 'button', check('信息带：world-preview type=button 原样'));
  const previewItems = collectByClass(bar, 'world-preview-item');
  assert.equal(previewItems.length, 4, check('信息带：路线预览条仍是 4 格'));
  assert.deepEqual(previewItems.map(i => querySelect(i, '.world-preview-name').textContent),
    ['Foundations', 'HTML & CSS', 'JavaScript', 'Node.js'],
    check('信息带：预览条四项名称与顺序一字不变'));
  assert.deepEqual(previewItems.map(i => querySelect(i, '.world-preview-state').textContent),
    ['0 / 46', '尚未开放', '尚未开放', '尚未开放'],
    check('信息带：预览条四项状态文案未变（状态没有因为收口被改写）'));
  assert.deepEqual(previewItems.map(i => i.classList.contains('is-open')), [true, false, false, false],
    check('信息带：预览条开放标记未变（只有 Foundations 是 is-open）'));
  assert.deepEqual(previewItems.map(i => i.dataset.worldTone),
    ['foundations', 'html-css', 'javascript', 'nodejs'],
    check('信息带：预览条四项 data-world-tone 未漂移'));
  dispatch(bar, 'click', {});
  const mapSheet = openSheetOf(page);
  assert.ok(mapSheet && collectByClass(mapSheet, 'world-card').length === 8,
    check('信息带：路线预览条点击仍进入学习地图，8 张 World 卡齐备'));
  dispatch(querySelect(mapSheet, '.dialog-close'), 'click', {});
  assert.deepEqual(storageKeys(), keysAtStart,
    check('信息带：整条链路零新增 localStorage key（收口不进存档、不进 schema）'));

  /* ---------- B5–B6. 收口的 CSS 事实（只在收口段里找规则） ---------- */
  const bandCss = css.slice(css.indexOf('v4.11 首页信息带：连续学习工作台的容器语言'));
  assert.ok(bandCss.length > 0, check('信息带：style.css 里有首页信息带收口段'));
  const ruleBody = selector => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = new RegExp('(?:^|\\n)\\s*' + escaped + ' \\{([^}]*)\\}').exec(bandCss);
    assert.ok(m, check(`信息带：规则存在 ${selector}`));
    return m[1];
  };
  const P = 'body[data-page="home"] .home-secondary ';
  const stripBody = ruleBody(P + '.today-strip');
  const cardBody = ruleBody(P + '.entry-card');
  const barBody = ruleBody(P + '.world-preview');
  const wrapBody = ruleBody(P + '.entry-grid-wrap');

  /* 一条左轨：三段的左内边距同值，左边缘才落在同一条竖线上。
   * 三段的 padding 写法不同（今日条 / 入口卡用 padding-inline，预览条用四值简写），
   * 所以按 CSS padding 简写的取值规则解出「左」值再比对，而不是让三段都写同一个字符串——
   * 第二轮给预览条补了上下留白，它必须仍是三值简写，匹配固定字符串会假红。 */
  const padLeftOf = body => {
    const shorthand = /(?:^|;)\s*padding:\s*([^;]+);/.exec(body);
    if (shorthand) {
      const v = shorthand[1].trim().split(/\s+/);
      return v.length === 1 ? v[0] : v.length === 2 ? v[1] : v.length === 3 ? v[1] : v[3];
    }
    const inline = /(?:^|;)\s*padding-inline:\s*([^;]+);/.exec(body);
    return inline ? inline[1].trim() : null;
  };
  assert.deepEqual([stripBody, cardBody, barBody].map(padLeftOf),
    ['var(--space-sm)', 'var(--space-sm)', 'var(--space-sm)'],
    check('信息带：三段统一到同一条 --space-sm 左轨（今日条文字 / 入口图标 / 预览标签左对齐）'));
  /* 两道细分隔线：留白改成线，三段才连成一条带 */
  assert.ok(/border-top:\s*1px solid color-mix\(in srgb, var\(--color-rule\) 80%, transparent\)/.test(wrapBody),
    check('信息带：今日条与三入口之间是细分隔线（不再是留白堆叠）'));
  assert.ok(/margin-top:\s*0/.test(wrapBody), check('信息带：入口网格与今日条之间零外边距——分离靠分隔线而不是空白'));
  assert.ok(/border:\s*none/.test(barBody)
    && /border-top:\s*1px solid color-mix\(in srgb, var\(--color-rule\) 80%, transparent\)/.test(barBody),
    check('信息带：路线预览条的虚线框退场，换成与第一道同值的第二道细分隔线'));
  assert.ok(/border-radius:\s*0/.test(barBody),
    check('信息带：预览条不再自带圆角——它现在是带的尾段而不是一张独立的框'));
  assert.ok(/margin-top:\s*0/.test(barBody), check('信息带：预览条与入口组之间零外边距（垂直间距由分隔线的 padding 承担）'));
  /* hover 降重：厚重感来自 hover 那一下（实心纸面 + 边框 + 浮起阴影） */
  assert.ok(/box-shadow:\s*none/.test(ruleBody(P + '.entry-card:hover')),
    check('信息带：入口卡 hover 不再浮起（去掉 shadow-lift）——「厚重卡片感」来自这一下而不是常态'));
  assert.ok(/background:\s*transparent/.test(barBody),
    check('信息带：预览条自带底色退场，露出容器同一条底（三段共享一个 surface）'));
  assert.ok(/color-mix\(in srgb, var\(--color-wash\) 32%, transparent\)/.test(ruleBody('body[data-page="home"] .home-secondary')),
    check('信息带：容器底由 wash 40% 收到 32%（从「面板」回到「带」）'));

  /* ---------- C1–C4. 第二轮：呼吸（留白与节奏） ----------
   * 第一轮把「留白」整个换成了「线」，连接感有了但实测三段 gap 为 0、三入口列间距只有 8px
   * ——整条带读起来是顶格密排。下面四条把本轮的松绑逐项钉住。 */
  const bandBase = ruleBody('body[data-page="home"] .home-secondary');
  assert.ok(/margin-top:\s*var\(--space-2xl\)/.test(bandBase),
    check('信息带：带与 Hero 的间距抬到 --space-2xl(48px)——Hero 一级、带二级，主次分层拉开一档'));
  assert.ok(/padding:\s*var\(--space-md\)/.test(bandBase),
    check('信息带：容器四周留白 --space-md(16px)——带子自己的呼吸（原为上下 8px）'));
  assert.ok(/padding:\s*var\(--space-md\) 0 var\(--space-sm\)/.test(wrapBody),
    check('信息带：第一道分隔线上 16px / 下 8px——线两侧补回留白，三段不再顶格紧贴'));
  assert.ok(/padding:\s*var\(--space-md\) var\(--space-sm\) var\(--space-sm\)/.test(barBody),
    check('信息带：第二道分隔线上 16px / 下 8px——与第一道同值，两道线的节奏一致'));
  assert.ok(/gap:\s*var\(--space-lg\)/.test(ruleBody(P + '.entry-grid')),
    check('信息带：三入口列间距 --space-lg(24px)——入口卡透明无边框，列间距就是这条带读得出的节奏（原为 8px）'));

  /* ---------- C5–C7. 第二轮：圆角层级 ---------- */
  assert.ok(/border-radius:\s*14px/.test(bandBase),
    check('信息带：容器圆角 14px——与 .dashboard / .map-unit 等二级容器同档，仍低于 Hero 一级容器的 20px'));
  assert.ok(/border-radius:\s*var\(--radius-medium\)/.test(stripBody)
    && /border-radius:\s*var\(--radius-medium\)/.test(cardBody),
    check('信息带：今日条与入口卡圆角同档（--radius-medium），带内可点元素的圆角语言统一'));
  /* 第一轮曾在这里加过一条 `.entry-icon` 覆盖，把项目原本的 `border-radius: .75rem` 压成
   * `--radius-small`(4px)。本轮整条删除：40px 的徽章配 4px 几乎读不出圆角，是视觉退化；
   * 回到 L1442 那条共享规则后三项仍天然一致（三项共用同一条规则）。 */
  /* 注意：不能用 `bandCss.includes('.entry-icon')` 判定——本段注释里为了记录这次纠正
   * 会提到该选择器，任何「整段扫类名字面量」的断言都会扫到注释而假红（G2a 段与单卡
   * 原型段都在这个坑上摔过）。改成匹配**完整规则选择器**，只认真存在的规则。 */
  assert.ok(!/\.home-secondary \.entry-icon \{/.test(bandCss),
    check('信息带：收口段不再有 .entry-icon 规则（第一轮那条把项目原本的 12px 圆角压成 4px，本轮整条删除）'));
  assert.ok(/\.entry-icon \{[^}]*border-radius: \.75rem/.test(css),
    check('信息带：图标圆角回到项目原本的 .75rem(12px)，三项共用同一条规则因而天然一致'));

  /* ---------- B7–B8. 纪律：零新 token / 零位图 / 零外链 / 零动效 / 零新增 transition ---------- */
  assert.equal(bandCss.match(/--color-[a-z-]+\s*:/g), null,
    check('信息带：收口段零新 token 定义（不触发 swatch 与主题对比度同步义务）'));
  assert.ok(!/url\s*\(/.test(bandCss), check('信息带：收口段零位图引用'));
  assert.ok(!/https?:/.test(bandCss), check('信息带：收口段零外链'));
  assert.ok(!/animation\s*:/.test(bandCss) && !/@keyframes/.test(bandCss), check('信息带：收口段零动效'));
  assert.ok(!/transition\s*:/.test(bandCss),
    check('信息带：收口段零新增 transition（入口卡既有过渡一个字未动）'));
  /* 收口段每条规则的选择器都带首页前缀——不允许出现裸类名，避免污染课页 / 个人中心 */
  const bandSelectors = [...bandCss.matchAll(/(?:^|\n)([^\n{}]+)\{/g)]
    .map(m => m[1].trim())
    .filter(sel => !sel.startsWith('*') && !sel.startsWith('/*') && !sel.startsWith('@'));
  assert.ok(bandSelectors.length >= 6, check(`信息带：收口段解析出 ${bandSelectors.length} 条规则选择器`));
  assert.ok(bandSelectors.every(sel => sel.startsWith('body[data-page="home"]')),
    check('信息带：收口段每条规则都带 body[data-page="home"] 前缀（不泄漏到课页 / 个人中心）'));

  /* ---------- B9. 响应式规则与打印规则仍在 ---------- */
  const narrow30 = [...css.matchAll(/@media \(max-width: 30rem\) \{([\s\S]*?)\n\}/g)].map(m => m[1]);
  assert.ok(narrow30.some(b => /\.entry-grid \{ grid-template-columns: minmax\(0, 1fr\); \}/.test(b)),
    check('信息带：窄屏三入口单列规则仍在（320px 仍单列易点）'));
  assert.ok(narrow30.some(b => /body\[data-page="home"\] \.home-secondary \{ padding: var\(--space-sm\); \}/.test(b)),
    check('信息带：收口段的窄屏容器内边距与既有窄屏收口同值（320px 无横向尺寸）'));
  assert.ok(/\.world-preview-more \{ display: none; \}/.test(narrow30.join('\n')),
    check('信息带：窄屏「进学习地图 →」收起规则仍在'));
  assert.ok(css.includes('.today-strip:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 2px; }'),
    check('信息带：今日条焦点环规则逐字未变'));
  assert.ok(css.includes('.entry-card:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 2px; }'),
    check('信息带：入口卡焦点环规则逐字未变'));
  assert.ok(css.includes('.world-preview:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 2px; }'),
    check('信息带：路线预览条焦点环规则逐字未变'));
  assert.ok(css.includes('.today-strip, .entry-grid-wrap, .theme-quick, .sheet, .site-usage { display: none; }'),
    check('信息带：首页新块的整体打印隐藏规则逐字未变'));
  assert.ok(css.includes('.hero-companion, .home-secondary, .hero-scene-decor, .hero-study-decor { display: none; }'),
    check('信息带：信息带的打印隐藏规则逐字未变（打印隐藏逻辑零改动）'));
  assert.ok(/@media print \{[\s\S]*?\.world-preview-item::before \{ display: none; \}/.test(css),
    check('信息带：预览条色晕的打印兜底仍在'));
}

/* ============ v4.11 Hero 场景一体化：统一光场 / 地面承托 / 信息带过渡 ============
 * 证明的验收标准（本轮交接 §七 的 1–8 条）。本组只钉**结构、层级与纪律**——
 * 「首页是否更接近参考效果图」是用户主观美感验收，自动化测不出，也不冒充。
 *   1. Hero 没有新增业务组件（子节点仍是 装饰图 ×2 + 主文案列 + 伙伴）；
 *   2. Hero 仍有唯一主 CTA（Hero 作用域内 continue-primary 恰好 1 个）；
 *   3. Hero 与信息带之间的视觉衔接规则存在（地面带 / 底部化入页面的渐变 /
 *      向下柔光承托 + 带自身 --space-2xl 的间距不变）；
 *   4. 伙伴、主文案、CTA 的层级关系没有下降（主文案 > 伙伴 > 道具 > 背景伪元素）；
 *   5. 新规则不引入图片、外链、动画或新 token；
 *   6. 移动端与 print 规则仍在；
 *   7. Hero 高度与伙伴尺寸的关键约束仍保留；
 *   8. G2a World 卡与地图状态色没有回归。
 * 本轮只改 style.css 的表现层，app.js / 课程数据 / 主题 token / 存储逻辑未动。 */
{
  const root = path.resolve(__dirname, '..');
  const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  const page = newPage({ storage: makeStorage() });
  const { dom } = page;
  const hero = querySelect(dom.body, '.home-hero');
  assert.ok(hero, check('一体化：首页仍有 .home-hero'));

  /* 取一条规则的声明体（首个匹配） */
  const ruleBody = selector => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = new RegExp(`(?:^|\\n)\\s*${escaped} \\{([^}]*)\\}`).exec(css);
    assert.ok(m, check(`一体化：规则存在 ${selector}`));
    return m[1];
  };
  const zIndexOf = selector => {
    const m = /(?:^|;)\s*z-index\s*:\s*(-?\d+)/.exec(ruleBody(selector));
    assert.ok(m, check(`一体化：${selector} 显式声明 z-index`));
    return Number(m[1]);
  };
  const descendants = (rootEl, predicate) => {
    const found = [];
    (function walk(el) {
      for (const child of el.children) {
        if (predicate(child)) found.push(child);
        walk(child);
      }
    })(rootEl);
    return found;
  };

  /* ---------- 1. Hero 没有新增业务组件 ---------- */
  assert.equal(hero.children.length, 4,
    check(`一体化：Hero 仍是 4 个子节点（实际 ${hero.children.length}）——零新增 DOM 组件`));
  assert.deepEqual(hero.children.map(c => c.className),
    ['hero-scene-decor', 'hero-study-decor', 'hero-main', 'hero-companion'],
    check('一体化：Hero 子节点仍只有 装饰层 ×2 + 主文案列 + 伙伴，树序不变'));
  const heroImgs = descendants(hero, el => el.tagName === 'IMG').map(el => el.className.split(' ')[0]);
  assert.deepEqual(heroImgs.slice().sort(),
    ['hero-companion-img', 'hero-decor', 'hero-scene-decor', 'hero-study-decor'].sort(),
    check(`一体化：Hero 内 4 张图全部是既有装饰层与伙伴立绘（实际 ${heroImgs.join(' / ')}）——本轮零新增图片资产`));
  const heroFocusables = descendants(hero, el => ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName));
  assert.equal(heroFocusables.length, 2,
    check(`一体化：Hero 内可聚焦元素仍是 2 个（实际 ${heroFocusables.length}）——主 CTA + 查看全部 World，入口数量与交互语义不变`));

  /* ---------- 2. Hero 仍有唯一主 CTA ---------- */
  assert.equal(collectByClass(hero, 'continue-primary').length, 1,
    check('一体化：Hero 作用域内 continue-primary 恰好 1 个（唯一主 CTA）'));
  const cta = heroFocusables.find(el => /continue-primary/.test(el.className));
  assert.ok(cta && String(cta.href || '').includes('lesson.html?id='),
    check('一体化：唯一主 CTA 仍是指向课程页的「继续学习」链接（文案与目标一字未改）'));
  assert.equal(heroFocusables.filter(el => /continue-primary/.test(el.className)).length, 1,
    check('一体化：Hero 内没有第二个同等级主按钮（CTA 主次关系未被装饰改动稀释）'));
  assert.equal(cta.parentNode.className, 'continue-actions',
    check('一体化：主 CTA 仍住在 .continue-actions 里（结构层级未变）'));

  /* ---------- 3. Hero 与信息带之间的视觉衔接规则存在 ---------- */
  const heroBody = ruleBody('.home-hero');
  assert.ok(/box-shadow:\s*var\(--shadow-primary\), 0 24px 48px -26px/.test(heroBody),
    check('一体化：Hero 在 --shadow-primary 之上再叠一层向下柔光承托——Hero 与下方信息带被连进同一平面，而不是两块硬边面板'));
  assert.ok(/radial-gradient\(50rem 34rem at 92% 82%/.test(heroBody),
    check('一体化：Hero 右下（伙伴与书桌一侧）有一块主题环境色面（v4.11.14 起 --color-ambient 逐主题派生）——左 wash 与环境色合成一个空间'));
  assert.ok(heroBody.includes('linear-gradient(150deg, var(--color-wash) 0%, color-mix(in srgb, var(--color-wash) 42%, var(--color-paper)) 48%, var(--color-paper) 78%)'),
    check('一体化：原 150deg 环境底逐字保留为最底层（新增层是叠上去的，不是替换）'));
  const heroAfter = ruleBody('.home-hero::after');
  assert.ok(/height:\s*60%/.test(heroAfter),
    check('一体化：底部环境带由 52% 扩到 60%——地面从「伙伴脚下」扩成整条 Hero 的地面'));
  assert.ok(/radial-gradient\(140% 92% at 50% 126%/.test(heroAfter),
    check('一体化：地面带横向铺到 140%、峰值压到 126%（左右植物与右下书桌落在同一块地上）'));
  assert.ok(/color-mix\(in srgb, var\(--color-paper\) 46%, transparent\)/.test(heroAfter),
    check('一体化：地面带末层是朝页面纸色的底部渐变——Hero 下缘向下自然化入页面，不再是色面突然截断'));
  const heroBefore = ruleBody('.home-hero::before');
  assert.ok(/rgba\(255, 252, 244, \.32\)/.test(heroBefore),
    check('一体化：窗光层追加桌面暖光池（同一支固定暖白 rgba，深色主题随 html[data-dark] 一起退月光）'));
  assert.ok(heroBefore.includes('color-mix(in srgb, var(--color-accent) 18%, transparent)'),
    check('一体化：紫晕仍是 18%——本轮加强的是地面与暖光，没有动紫晕上限'));
  /* 生效值取「最后一条带 margin-top 的声明」——文件末尾的窄屏块里还有一条只改
   * padding 的 .home-secondary 规则，直接取最后一个匹配会拿到它。 */
  const bandBodies = [...css.matchAll(/body\[data-page="home"\] \.home-secondary \{([^}]*)\}/g)].map(m => m[1]);
  const bandEffective = bandBodies.filter(b => /margin-top/.test(b)).pop();
  assert.ok(/margin-top:\s*var\(--space-2xl\)/.test(bandEffective),
    check('一体化：信息带与 Hero 的间距仍是 --space-2xl——衔接靠色面与光，不靠挪间距'));

  /* ---------- 4. 伙伴 / 主文案 / CTA 的层级没有下降 ---------- */
  const zBefore = zIndexOf('.home-hero::before');
  const zAfter = zIndexOf('.home-hero::after');
  const zStudy = zIndexOf('.hero-study-decor');
  const zStage = zIndexOf('.hero-companion-stage');
  const zMain = zIndexOf('.hero-main');
  assert.ok(zBefore === -1 && zAfter === -1,
    check(`一体化：Hero 两层背景伪元素仍在负层（实际 ${zBefore} / ${zAfter}）`));
  assert.ok(zStudy >= 0 && zStudy > Math.max(zBefore, zAfter),
    check(`一体化：道具层严格高于背景层（道具 ${zStudy} > 背景 ${Math.max(zBefore, zAfter)}）——批次 F B0 的可见性结论未被削弱`));
  assert.ok(zMain > zStudy && zStage > zStudy,
    check(`一体化：主文案 ${zMain} 与伙伴舞台 ${zStage} 都严格高于道具 ${zStudy}——标题 / 副标题 / CTA / 立绘永不被装饰压住`));
  for (const selector of ['.hero-study-decor', '.hero-decor', '.hero-scene-decor']) {
    assert.ok(/pointer-events:\s*none/.test(ruleBody(selector)),
      check(`一体化：${selector} 仍 pointer-events:none——装饰层绝不拦截 CTA 指针`));
  }
  assert.equal(zIndexOf('.hero-companion-stage::before'), -1,
    check('一体化：伙伴环境巢柔光仍在舞台负层（装饰不盖立绘）'));

  /* ---------- 5. 新规则不引入图片、外链、动画或新 token ---------- */
  const heroStart = css.indexOf('/* ---------- P0-1 / P0-2：首页 Hero + 次级信息带 ----------');
  const heroEnd = css.indexOf('/* ---------- P0-4：学习旅程脊线');
  assert.ok(heroStart > 0 && heroEnd > heroStart, check('一体化：Hero 段（P0-1/P0-2 → P0-4）定位成功'));
  const heroCss = css.slice(heroStart, heroEnd);
  assert.ok(!/url\s*\(/.test(heroCss), check('一体化：Hero 段零位图引用（本轮未生成、未接入任何图片）'));
  assert.ok(!/https?:/.test(heroCss), check('一体化：Hero 段零外链（不引远程资源）'));
  assert.ok(!/animation\s*:/.test(heroCss) && !/@keyframes/.test(heroCss),
    check('一体化：Hero 段零动画 / 零关键帧（本轮的视觉强化全在静态渐变与层级上）'));
  assert.equal(heroCss.match(/--color-[a-z-]+\s*:/g), null,
    check('一体化：Hero 段零新 token 定义（只引用既有 --color-* / --space-* / --radius-*）'));
  assert.ok(css.includes('body[data-page="home"] .home-hero .continue-primary { box-shadow: 0 12px 26px rgba(81, 64, 143, .28), 0 2px 6px rgba(81, 64, 143, .16); }'),
    check('一体化：主 CTA 的投影加强只落在首页 Hero 作用域内（不泄漏到课页 / 个人中心）'));

  /* ---------- 6. 移动端与 print 规则仍在 ---------- */
  const narrow30 = [...css.matchAll(/@media \(max-width: 30rem\) \{([\s\S]*?)\n\}/g)].map(m => m[1]);
  assert.ok(narrow30.some(b => /\.hero-companion-stage \{ width: 11\.5rem; aspect-ratio: 3 \/ 4; \}/.test(b)),
    check('一体化：窄屏伙伴舞台 11.5rem + 3:4 仍在（手机端不机械缩放整套场景）'));
  assert.ok(narrow30.some(b => /\.home-hero \{ padding: var\(--space-lg\) var\(--space-md\); \}/.test(b)),
    check('一体化：窄屏 Hero 内边距收口仍在'));
  assert.ok(/@media print \{[\s\S]*?\.hero-companion, \.home-secondary, \.hero-scene-decor, \.hero-study-decor \{ display: none; \}/.test(css),
    check('一体化：打印隐藏 Hero 装饰与信息带的规则逐字未变'));
  assert.ok(/@media print \{[\s\S]*?\.home-hero::before, \.home-hero::after \{ content: none; \}/.test(css),
    check('一体化：打印仍整体移除 Hero 环境层（新增的暖光池与地面带一并被同一条规则收走）'));
  assert.ok(/@media print \{[\s\S]*?\.home-hero \{ background: #fff; border: 1px solid #000; box-shadow: none; \}/.test(css),
    check('一体化：打印仍是白底无阴影（新增的承托投影被既有 print 规则覆盖，打印行为不回归）'));

  /* ---------- 7. Hero 高度与伙伴尺寸的关键约束仍保留 ---------- */
  assert.ok(heroBody.includes('padding: clamp(1.5rem, 4vw, 2.75rem)'),
    check('一体化：Hero 内边距档 clamp(1.5rem, 4vw, 2.75rem) 未变'));
  assert.ok(!/(?:^|;)\s*(?:height|min-height|max-height)\s*:/.test(heroBody),
    check('一体化：Hero 仍未设显式高度——高度只由内容与既有内边距决定，本轮没有引入高度跃升的来源'));
  assert.ok(ruleBody('.hero-companion-stage').includes('width: clamp(14rem, 30vw, 27rem)'),
    check('一体化：伙伴舞台宽度档 clamp(14rem, 30vw, 27rem) 未变'));
  assert.ok(ruleBody('.hero-companion-stage').includes('aspect-ratio: 3 / 4'),
    check('一体化：舞台仍是 3:4 竖版'));
  assert.ok(ruleBody('.hero-companion-img').includes('width: 96%; height: 96%'),
    check('一体化：伙伴立绘 96% 占比未变（本轮未放大、未改资产）'));
  assert.ok(css.includes('body[data-page="home"] .home-hero .continue-actions { margin-top: var(--space-xl); max-width: 26rem; }'),
    check('一体化：CTA 区与上方文案的间距只抬一档（--space-lg → --space-xl），是本轮唯一的纵向加高来源'));
  assert.ok(/height:\s*auto/.test(ruleBody('.hero-study-decor')) && ruleBody('.hero-study-decor').includes('z-index: 0'),
    check('一体化：学习场景道具层的落位与层级保持现状（本轮只动背景与光，不动道具）'));

  /* ---------- 8. G2a World 卡与地图状态色没有回归 ---------- */
  assert.ok(css.includes('v4.11 G2a：学习地图 8 张 World 卡的轻量场景层'),
    check('一体化：G2a 段仍在 style.css 里'));
  assert.ok(/\.world-card\[data-world-tone="foundations"\]::before \{/.test(css),
    check('一体化：G2a 的 Foundations 色晕规则原样在位'));
  assert.ok(/\.map-node\.is-broken \{ background: var\(--color-semantic\); border-color: var\(--color-semantic\); \}/.test(css),
    check('一体化：地图「已破甲」是主题语义色实心（v4.11.15 起固定绿改派生，两处声明都要跟着走）'));
  assert.ok(/\.map-node\.is-defeated:not\(\.is-current\) \{[^}]*background: var\(--color-semantic\)[^}]*box-shadow: 0 0 0 3px #d4af37/.test(css),
    check('一体化：地图「已击破」仍是同色实心 + 金色 gap 环（与已破甲靠金环区分，未回归到同色）'));
  const previewBar = querySelect(dom.body, '.world-preview');
  assert.deepEqual(collectByClass(previewBar, 'world-preview-item').map(i => i.dataset.worldTone),
    ['foundations', 'html-css', 'javascript', 'nodejs'],
    check('一体化：首页路线预览条四项色相未漂移'));
}

  /* ============ v4.11.10 首页主界面视觉层级样板 ============
   * 只验证本轮新增的表现层契约：不改 Hero IA / button / nav / World 四项，
   * 不泄漏到课页，不引入持久化字段、位图、动画或新 token。主观「更好看」不在此冒充。 */
{
  const css = fs.readFileSync(path.join(path.resolve(__dirname, '..'), 'style.css'), 'utf8');
  const page = newPage({ storage: makeStorage() });
  const { dom } = page;
  const hero = querySelect(dom.body, '.home-hero');
  const secondary = querySelect(dom.body, '.home-secondary');
  const strip = querySelect(dom.body, '.today-strip');
  const nav = querySelect(dom.body, '.entry-grid-wrap');
  const preview = querySelect(dom.body, '.world-preview');
  assert.ok(hero && secondary && strip && nav && preview, check('层级样板：首页四层主结构全部存在'));
  assert.equal(strip.tagName, 'BUTTON', check('层级样板：今日状态带仍是一个 button'));
  assert.equal(nav.tagName, 'NAV', check('层级样板：三个入口仍在 nav 中'));
  assert.equal(collectByClass(nav, 'entry-card').length, 3, check('层级样板：入口数量仍为 3'));
  assert.deepEqual(collectByClass(nav, 'entry-title').map(item => item.textContent), ['学习进度', '今日计划', '学习地图'], check('层级样板：入口顺序未变'));
  assert.equal(preview.tagName, 'BUTTON', check('层级样板：路线预览仍是一个 button'));
  assert.equal(collectByClass(preview, 'world-preview-item').length, 4, check('层级样板：路线预览仍有四项'));
  assert.deepEqual(collectByClass(preview, 'world-preview-item').map(item => item.dataset.worldTone), ['foundations', 'html-css', 'javascript', 'nodejs'], check('层级样板：World tone 未变'));
  assert.ok(/body\[data-page="home"\] \.home-hero h1 \{/.test(css), check('层级样板：Hero 主标题有首页限定规则'));
  assert.ok(/body\[data-page="home"\] \.home-secondary \.today-strip \{/.test(css), check('层级样板：今日状态带有首页限定规则'));
  assert.ok(/body\[data-page="home"\] \.home-secondary \.entry-grid \{/.test(css), check('层级样板：入口组有首页限定规则'));
  assert.ok(/body\[data-page="home"\] \.home-secondary \.world-preview \{/.test(css), check('层级样板：路线预览有首页限定规则'));
  assert.ok(!/body\[data-page="lesson"\] \.(?:home-hero|home-secondary|entry-card|world-preview)/.test(css), check('层级样板：首页视觉规则未泄漏到课页选择器'));
  assert.ok(!/assets\/.*\.(?:png|jpe?g|webp)/i.test(css), check('层级样板：本轮 CSS 未新增位图引用'));
  assert.ok(!/body\[data-page="home"\][^{]*\{[^}]*animation\s*:/.test(css), check('层级样板：首页新增规则未引入动画'));
  assert.equal(collectByClass(dom.body, 'lesson-process').length, 0, check('层级样板：首页没有课页 lesson-process 模块'));
  assert.equal(collectByClass(dom.body, 'lesson-reference').length, 0, check('层级样板：首页没有课页 lesson-reference 模块'));
}

/* ============ v4.11.11 首页信息层级收口（2026-09-21） ============
 * 证明的验收标准（执行提示词 §八 清单）：结构契约（Hero 主结构 / 伙伴 / 道具数 /
 * 唯一主 CTA / 今日条单一 button / 三入口数量顺序 nav / World 预览单一 button 四项
 * tone）在本组全部重钉一遍，不依赖前组的通过；再钉本轮四个收口事实：
 *   ① 区块标签改名「当前继续学习」——与主 CTA 不再同词互抢；
 *   ② 位置 meta 行（06 / 46 · 已开始）降权到 muted/600，靛紫只留给主 CTA；
 *   ③ 未开放 World 名称 muted/500，与 is-open 格（600/墨色）拉开两档；
 *   ④ ≤30rem 今日时长项独占一行 + 允许内部折行（320px 文本叠印修复）。
 * 纪律断言：本段选择器全部带 body[data-page="home"] 前缀；零位图 / 零外链 /
 * 零动效 / 零新增 transition / 零新 token；零新增 storage key；print 规则零回归；
 * Hero 层级合同（背景 < 道具 < 伙伴/主文案）零回归；首页零课页模块类名。
 * 所有断言先显式断言目标存在，再断言数量 / 顺序 / 内容——零静默跳过。 */
{
  const root = path.resolve(__dirname, '..');
  const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  const page = newPage({ storage: makeStorage() });
  const { dom } = page;

  const storageKeys = () => {
    const list = [];
    for (let i = 0; i < page.sandbox.localStorage.length; i += 1) list.push(page.sandbox.localStorage.key(i));
    return list.sort();
  };
  const keysAtStart = storageKeys();

  /* ---------- 1. Hero 主结构 / 伙伴 / 道具 / CTA 零回归 ---------- */
  const hero = querySelect(dom.body, '.home-hero');
  assert.ok(hero, check('收口：首页有 .home-hero'));
  assert.deepEqual(hero.children.map(c => c.className),
    ['hero-scene-decor', 'hero-study-decor', 'hero-main', 'hero-companion'],
    check('收口：Hero 仍是 4 个子节点（装饰 ×2 + 主文案列 + 伙伴），零新增 DOM'));
  const heroImgs = [];
  (function walk(el) {
    for (const child of el.children) {
      if (child.tagName === 'IMG') heroImgs.push(child.className.split(' ')[0]);
      walk(child);
    }
  })(hero);
  assert.deepEqual(heroImgs.slice().sort(),
    ['hero-companion-img', 'hero-decor', 'hero-scene-decor', 'hero-study-decor'].sort(),
    check(`收口：Hero 内仍是既有 4 张图（实际 ${heroImgs.length}）——零新增图片 / SVG / 道具`));
  assert.ok(querySelect(hero, '.hero-companion-img'), check('收口：伙伴立绘仍存在（未删除、未更换）'));
  const heroFocusables = [];
  (function walkF(el) {
    for (const child of el.children) {
      if (['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(child.tagName)) heroFocusables.push(child);
      walkF(child);
    }
  })(hero);
  assert.equal(heroFocusables.length, 2, check('收口：Hero 可聚焦元素仍是 2 个（主 CTA + 查看全部 World）'));
  assert.equal(collectByClass(hero, 'continue-primary').length, 1, check('收口：continue-primary 恰好 1 个（唯一主行动）'));
  const primaryCta = querySelect(hero, '.continue-primary');
  assert.ok(primaryCta && String(primaryCta.href || '').includes('lesson.html?id='),
    check('收口：主 CTA 仍是指向课程页的链接（点击路径不变）'));
  assert.equal(collectByClass(hero, 'button-secondary').length, 1,
    check('收口：次级动作仍只有一个「查看全部 World」（没有新增第二个主 CTA）'));

  /* ---------- 2. ① 区块标签改名：与 CTA 不再同词 ---------- */
  const label = querySelect(hero, '.continue-label');
  assert.ok(label, check('收口：continue-label 存在'));
  assert.equal(label.textContent, '当前继续学习', check('①：区块标签已改名「当前继续学习」'));
  assert.ok(!primaryCta.textContent.includes(label.textContent) && !label.textContent.includes('→'),
    check('①：标签与主 CTA 文案不再同词（标签指认区块，CTA 是唯一动作表述）'));
  /* 主文案事实一字未动 */
  assert.equal(querySelect(hero, 'h1').textContent, 'Full Stack JavaScript 路线', check('收口：Hero 主标题事实未动'));
  assert.equal(querySelect(hero, '.home-lead').textContent, '沿 The Odin Project 路线学习 Web 开发。', check('收口：副标题事实未动'));
  const eyebrowEl = querySelect(hero, '.continue-eyebrow');
  assert.ok(eyebrowEl, check('收口：位置 meta 行（continue-eyebrow）存在'));
  assert.match(eyebrowEl.textContent, /^\d{2} \/ 46 · /, check('收口：位置 meta 行仍是「NN / 46 · 状态」口径（数据未动）'));

  /* ---------- 3. ②③④ 本轮 CSS 事实（只在本轮收口段里找规则） ---------- */
  const segStart = css.indexOf('v4.11.11 首页信息层级收口');
  assert.ok(segStart > 0, check('收口：style.css 里有 v4.11.11 收口段'));
  const seg = css.slice(segStart);
  const ruleBody = selector => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = new RegExp('(?:^|\\n)\\s*' + escaped + ' \\{([^}]*)\\}').exec(seg);
    assert.ok(m, check(`收口：规则存在 ${selector}`));
    return m[1];
  };
  const eyebrowBody = ruleBody('body[data-page="home"] .home-hero .continue-eyebrow');
  assert.ok(/color:\s*var\(--color-muted\)/.test(eyebrowBody) && /font-weight:\s*600/.test(eyebrowBody),
    check('②：位置 meta 行降权为 muted/600（accent/700 退场，靛紫只留给主 CTA）'));
  assert.ok(!/var\(--color-accent\)/.test(eyebrowBody), check('②：meta 行不再引用 accent（操作色语义收干净）'));
  const closedBody = ruleBody('body[data-page="home"] .home-secondary .world-preview-item:not(.is-open) .world-preview-name');
  assert.ok(/color:\s*var\(--color-muted\)/.test(closedBody) && /font-weight:\s*500/.test(closedBody),
    check('③：未开放 World 名称收口到 muted/500'));
  assert.ok(/\.world-preview-name \{ font-weight: 600; \}/.test(css),
    check('③：is-open 格名称仍是基础规则的 600/墨色——与未开放格拉开两档权重差'));
  assert.ok(/\.world-preview-item\.is-open \.world-preview-state \{ color: var\(--color-semantic\)/.test(css),
    check('③：Foundations 状态文字取主题语义色（v4.11.15 起派生；对比度仍须全 30 套达标，见 themes-contrast 第 7 节）'));
  const narrow30 = [...css.matchAll(/@media \(max-width: 30rem\) \{([\s\S]*?)\n\}/g)].map(m => m[1]);
  const wrapFix = narrow30.find(b => b.includes('body[data-page="home"] .home-secondary .today-item:first-child'));
  assert.ok(wrapFix, check('④：≤30rem 有今日时长项的收口规则（320px 叠印修复）'));
  assert.ok(/grid-column:\s*1 \/ -1/.test(wrapFix) && /flex-wrap:\s*wrap/.test(wrapFix) && /white-space:\s*normal/.test(wrapFix),
    check('④：≤30rem 时长项独占一行 + 允许内部折行（nowrap 溢盒叠印的来源被移除）'));

  /* ---------- 4. 今日条 / 三入口 / World 预览：结构与语义零回归 ---------- */
  const strip = querySelect(dom.body, '.today-strip');
  assert.ok(strip, check('收口：今日条存在'));
  assert.equal(strip.tagName, 'BUTTON', check('收口：今日条仍是单一 button'));
  assert.equal(strip.type, 'button', check('收口：今日条 type=button 原样'));
  assert.deepEqual(strip.children.map(c => c.className.split(' ')[0]),
    ['today-item', 'today-mini-progress', 'today-item', 'today-item', 'today-more'],
    check('收口：今日条五段内容与顺序未变（时长 / 迷你进度 / 连续 / 复习 / 详情）'));
  const nav = querySelect(dom.body, '.entry-grid-wrap');
  assert.ok(nav, check('收口：入口容器存在'));
  assert.equal(nav.tagName, 'NAV', check('收口：三个入口仍在 nav 中'));
  const cards = collectByClass(nav, 'entry-card');
  assert.equal(cards.length, 3, check('收口：入口数量仍为 3'));
  assert.deepEqual(cards.map(c => querySelect(c, '.entry-title').textContent),
    ['学习进度', '今日计划', '学习地图'], check('收口：入口顺序不变'));
  assert.ok(cards.every(c => c.tagName === 'BUTTON' && c.type === 'button'), check('收口：三个入口仍是 button'));
  const bar = querySelect(dom.body, '.world-preview');
  assert.ok(bar, check('收口：路线预览存在'));
  assert.equal(bar.tagName, 'BUTTON', check('收口：路线预览仍是单一 button'));
  const items = collectByClass(bar, 'world-preview-item');
  assert.equal(items.length, 4, check('收口：预览仍为 4 项'));
  assert.deepEqual(items.map(i => querySelect(i, '.world-preview-name').textContent),
    ['Foundations', 'HTML & CSS', 'JavaScript', 'Node.js'], check('收口：四项名称与顺序不变'));
  assert.deepEqual(items.map(i => i.dataset.worldTone),
    ['foundations', 'html-css', 'javascript', 'nodejs'], check('收口：data-world-tone 不变'));
  assert.deepEqual(items.map(i => i.classList.contains('is-open')), [true, false, false, false],
    check('收口：开放标记不变（只有 Foundations 是 is-open）'));

  /* ---------- 5. 点击路径与零持久化 ---------- */
  dispatch(strip, 'click', {});
  assert.ok(openSheetOf(page), check('收口：今日条点击仍打开今日计划 sheet'));
  dispatch(querySelect(openSheetOf(page), '.dialog-close'), 'click', {});
  dispatch(cards[2], 'click', {});
  assert.ok(openSheetOf(page) && collectByClass(openSheetOf(page), 'map-tab').length === 3,
    check('收口：「学习地图」入口点击仍打开地图 sheet（3 个 Tab）'));
  dispatch(querySelect(openSheetOf(page), '.dialog-close'), 'click', {});
  dispatch(bar, 'click', {});
  const mapSheet = openSheetOf(page);
  assert.ok(mapSheet && collectByClass(mapSheet, 'world-card').length === 8,
    check('收口：路线预览点击仍进学习地图（8 张 World 卡）'));
  dispatch(querySelect(mapSheet, '.dialog-close'), 'click', {});
  assert.deepEqual(storageKeys(), keysAtStart, check('收口：整条链路零新增 localStorage key（不进存档、不进 schema）'));

  /* ---------- 6. 作用域与纪律：零泄漏 / 零动效 / 零位图 / 零新 token ---------- */
  const segSelectors = [...seg.matchAll(/(?:^|\n)([^\n{}]+)\{/g)]
    .map(m => m[1].trim())
    .filter(s => !s.startsWith('*') && !s.startsWith('/*') && !s.startsWith('@'));
  assert.ok(segSelectors.length >= 3, check(`收口：本段解析出 ${segSelectors.length} 条规则选择器`));
  assert.ok(segSelectors.every(s => s.startsWith('body[data-page="home"]')),
    check('收口：本段每条规则都带 body[data-page="home"] 前缀（课页 / 个人中心零污染）'));
  assert.ok(!/body\[data-page="lesson"\]/.test(seg), check('收口：本段零课页作用域选择器'));
  assert.ok(!/url\s*\(/.test(seg), check('收口：本段零位图 / 零 url()'));
  assert.ok(!/https?:/.test(seg), check('收口：本段零外链'));
  assert.ok(!/animation\s*:/.test(seg) && !/@keyframes/.test(seg), check('收口：本段零动效'));
  assert.ok(!/transition\s*:/.test(seg), check('收口：本段零新增 transition'));
  assert.equal(seg.match(/--color-[a-z-]+\s*:/g), null, check('收口：本段零新 token 定义'));

  /* ---------- 7. 首页零课页模块 / Hero 层级合同 / print 零回归 ---------- */
  for (const cls of ['lesson-process', 'lesson-reference', 'lesson-chapter-nav', 'section-explain', 'section-official']) {
    assert.equal(collectByClass(dom.body, cls).length, 0, check(`收口：首页没有课页模块类名 .${cls}`));
  }
  const fullRuleBody = selector => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = new RegExp('(?:^|\\n)\\s*' + escaped + ' \\{([^}]*)\\}').exec(css);
    assert.ok(m, check(`收口：全文件规则存在 ${selector}`));
    return m[1];
  };
  const zFull = selector => Number(/z-index:\s*(-?\d+)/.exec(fullRuleBody(selector))[1]);
  assert.ok(zFull('.home-hero::before') === -1 && zFull('.home-hero::after') === -1,
    check('收口：Hero 背景伪元素仍在负层（层级合同第 1 层）'));
  assert.equal(zFull('.hero-study-decor'), 0, check('收口：道具层仍是 z-index 0（背景 < 道具）'));
  assert.equal(zFull('.hero-main'), 1, check('收口：主文案列仍是 z-index 1（道具 < 主文案）'));
  assert.ok(/pointer-events:\s*none/.test(fullRuleBody('.hero-study-decor')), check('收口：道具层仍 pointer-events:none'));
  assert.ok(css.includes('.hero-companion, .home-secondary, .hero-scene-decor, .hero-study-decor { display: none; }'),
    check('收口：print 隐藏伙伴 / 信息带 / 装饰的规则逐字未变'));
  assert.ok(/@media print \{[\s\S]*?\.world-preview-item::before \{ display: none; \}/.test(css),
    check('收口：print 预览条色晕兜底规则未变'));
  assert.ok(css.includes('.today-strip, .entry-grid-wrap, .theme-quick, .sheet, .site-usage { display: none; }'),
    check('收口：print 首页块隐藏规则逐字未变'));
}

  /* ---------- v4.11.12 首页资产颜色统一：三个入口图标 ---------- */
  {
    const root = path.resolve(__dirname, '..');
    const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
    const page = newPage({ storage: makeStorage() });
    const { dom } = page;
    const icons = page.sandbox.window.ODIN_ICONS.entryIcons;
    const keys = ['progress', 'tasks', 'world'];
    assert.ok(icons, check('颜色统一：entryIcons 事实源存在'));
    for (const key of keys) {
      assert.ok(icons[key], check(`颜色统一：entryIcons.${key} 存在`));
      assert.match(icons[key], /^<svg[\s\S]*<\/svg>$/, check(`颜色统一：${key} 是完整 SVG`));
      assert.ok(!/<script|href=|url\s*\(|on[a-z]+\s*=|https?:/.test(icons[key].replace('xmlns="http://www.w3.org/2000/svg"', '')), check(`颜色统一：${key} 无脚本 / 外链 / 事件属性`));
      assert.ok(!icons[key].includes('#276148') && !icons[key].includes('#a4553f'), check(`颜色统一：${key} 不再使用旧绿 / 旧红棕`));
    }
    assert.ok(new Set(keys.map(key => icons[key].match(/stroke-width="([\d.]+)"/)[1])).size <= 2, check('颜色统一：三个入口图标 stroke-width 处于同一线条语言'));
    const entryCards = collectByClass(dom.body, 'entry-card');
    assert.equal(entryCards.length, 3, check('颜色统一：首页仍只渲染 3 个入口'));

    /* ---------- v4.11.13 新机制断言：mask 渲染路径（旧色断言之上追加，不替换） ---------- */
    const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
    for (const key of keys) {
      const hexes = [...new Set(icons[key].match(/#[0-9a-fA-F]{3,8}/g) || [])];
      assert.deepEqual(hexes, ['#000'], check(`新机制：${key} 是中性 mask 源（颜色仅 #000，只贡献 alpha）`));
    }
    assert.ok(/^<svg[^']*opacity="\.85"/.test(icons.progress), check('新机制：progress 的 opacity .85 填充条保留（alpha 保层次）'));
    const entryIconEls = entryCards.map(card => querySelect(card, '.entry-icon')).filter(Boolean);
    assert.equal(entryIconEls.length, 3, check('新机制：三个入口卡里都能取到 .entry-icon'));
    for (const el of entryIconEls) {
      assert.equal(el.tagName, 'SPAN', check('新机制：入口图标是 span（mask 载体），不再是 <img>'));
      assert.ok(el.className.includes('mask-icon'), check('新机制：入口图标带 mask-icon 类'));
      assert.equal(el.getAttribute('aria-hidden'), 'true', check('新机制：入口图标 aria-hidden 装饰语义'));
      assert.ok(String(el.style.getPropertyValue('--icon-mask')).startsWith('url("data:image/svg+xml'), check('新机制：--icon-mask 是内联 data URL（file:// 可用）'));
    }
    assert.ok(/const maskIcon = \(markup, className\)/.test(app) && app.includes("maskIcon(iconMarkup, 'entry-icon')"), check('新机制：app.js 定义 maskIcon 且入口消费点已切换'));
    assert.ok(!app.includes("svgImage(iconMarkup, '', 'entry-icon')"), check('新机制：入口图标不再走 svgImage(<img>)'));
    assert.ok(/\.mask-icon \{[^}]*-webkit-mask-image: var\(--icon-mask\);/.test(css) && /\.entry-icon\.mask-icon::before \{[^}]*background-color: var\(--color-icon\);/.test(css), check('新机制：style.css mask 双前缀与 ::before 字形规则在位'));
    assert.ok(/\.entry-icon \{ width: 40px; height: 40px; padding: 7px; background: color-mix\(in srgb, var\(--color-accent\) 10%, var\(--color-wash\)\)/.test(css), check('新机制：芯片底既有规则一字不动（底 / 边框 / 圆角仍留在元素上）'));
  }

  /* ---------- v4.11.12 首页资产颜色统一：Hero 学习道具 ---------- */
  {
    const root = path.resolve(__dirname, '..');
    const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
    const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
    const match = /const HERO_STUDY_SVG = '(<svg[^']*<\/svg>)'/.exec(app);
    assert.ok(match, check('颜色统一：HERO_STUDY_SVG 仍存在'));
    const svg = match[1];
    assert.ok(svg.includes('viewBox="0 0 420 130"') && svg.includes('M14 60H406'), check('颜色统一：Hero 道具既有几何保留'));
    assert.ok(app.includes("svgImage(HERO_STUDY_SVG, '', 'hero-study-decor')"), check('颜色统一：Hero 道具既有挂载类名保留'));
    assert.ok(!svg.includes('#3f7b58') && !svg.includes('#6f9c85') && !svg.includes('#a78bda'), check('颜色统一：Hero 道具不再使用旧绿色 / 旧绿色系轮廓'));

    /* v4.11.15：几何头像去绿钉。头像走 data:image/svg+xml 进 <img>（封闭文档，
     * 读不到 CSS 变量），因此**不跟随主题**，按纪律换成中性墨灰 / 暖灰。旧绿系统的
     * 七个字面量必须清零——它们是「旧绿色系统全面清零」这条目标在头像层的唯一凭据；
     * 陶土 #a4553f 是多色结构的点缀、不属于旧绿系统，必须保留。 */
    {
      const avatarsSrc = fs.readFileSync(path.join(root, 'avatars.js'), 'utf8');
      for (const old of ['#276148', '#6f9c85', '#7fd3a5', '#edf3ee', '#c8d3cb', '#3f7b58', '#336847']) {
        assert.ok(!avatarsSrc.includes(old), check(`颜色统一：几何头像不再使用旧绿 ${old}`));
      }
      for (const oldInk of ['#25312c', '#22302a']) {
        assert.ok(!avatarsSrc.includes(oldInk), check(`颜色统一：头像的绿调墨色 ${oldInk} 已改中性墨`));
      }
      assert.ok(avatarsSrc.includes('#a4553f'), check('颜色统一：几何头像保留陶土点缀 #a4553f（不属旧绿色系统）'));
      assert.equal((avatarsSrc.match(/\n\s+id: '/g) || []).length, 37,
        check('颜色统一：几何头像仍是 37 项（本轮只改色值，不增删资产）'));
    }
    assert.ok(svg.includes('#81769a') && svg.includes('#8b7b8f') && svg.includes('#c7bdd6'), check('颜色统一：Hero 道具新深墨紫灰色板明确在位'));
    assert.ok(!/<script|href=|url\s*\(|on[a-z]+\s*=|https?:/i.test(svg.replace('xmlns="http://www.w3.org/2000/svg"', '')), check('颜色统一：Hero 道具无脚本 / 外链 / 事件属性'));
    assert.ok([...svg.matchAll(/opacity="(\.\d+)"/g)].every(m => Number(m[1]) <= .85), check('颜色统一：Hero 道具 opacity 上限仍为 .85'));
    assert.ok(css.includes('z-index: 0') && css.includes('pointer-events: none'), check('颜色统一：Hero 道具层级与指针纪律仍在'));
  }
