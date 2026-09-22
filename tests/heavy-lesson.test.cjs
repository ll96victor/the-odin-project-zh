/* v4.11.3（长难课反馈强度 + 引导视觉层级 + 资源卡文案）收口断言。
 *
 * 每组断言证明的验收标准写在分组注释里：
 *   A  —— 课页三处「本站中文辅助已自足」引导不再使用 muted class，改用带
 *          左色条的 lesson-guide 提示块；样式规则钉死在 body[data-page="lesson"]
 *          作用域内，不泄漏到首页与个人中心；
 *   B1 —— 无中文版条目的 fallback 文案按资源类型分支：视频卡说「这是视频」、
 *          网站 / 工具卡说「这是网站 / 工具」、文章等文本类保持原措辞、
 *          未覆盖类型（如「文章（存档）」）回落到通用文案（兜底）；
 *   B2 —— 同一张视频卡内「中文字幕」声明只出现 1 次（归位在许可字段）；
 *   B3 —— EXTERNAL-RESOURCES.md 含「按资源类型的文案规则（v4.11.3）」一节；
 *   B4 —— 无中文版条目的链接按钮按类型分动作标签（v4.11.4）：视频「观看视频」、
 *          操作入口「前往操作」、工具 / 网站「打开工具」、数据文件「下载文件」、
 *          素材「查看素材」、文本类与精译兜底「打开英文原文」；zhUrl 卡维持
 *          双按钮文字不变；标签表与 CONTENT-STYLE-GUIDE.md 第 4 节同源；
 *   C1 —— 大课集合由真实数据算出（读 sections / knowledgeCheck），恰为 4 课；
 *          故意调低阈值后集合变大 —— 证明不是硬编码课 id；
 *   C2 —— 大课课页渲染体量提示（中性事实：章节数 / 自查题数），普通课不渲染；
 *          勾选完成时大课多发一条「大课拿下」低干扰提示，普通课没有；
 *   C3 —— 新成就 heavy-first / heavy-all：完成 4 门大课的档案解锁、完成 3 门
 *          只解锁第一级；61 个既有成就的判定与 XP / 等级曲线零改动
 *          （对照改前备份 history/progress_20260919-v4.11.3-heavy-lessons.js）；
 *          存量档案补发解锁后 XP 与等级不降。
 *
 * 负向对照（证明这些断言真的能抓到回归）：
 *   N1 阈值扰动（C1 组内）；N2 完成 3 门大课不解锁 heavy-all（C3 组内）；
 *   N3 普通课无体量提示、无强化反馈（C2 组内）；N4 未覆盖类型回落兜底（B1 组内）。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const loadData = (file, globalName) => {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox);
  return JSON.parse(JSON.stringify(sandbox.window[globalName]));
};
const guide = loadData('lessons.js', 'ODIN_GUIDE');
const resourceData = loadData('external-resources.js', 'ODIN_RESOURCES');

/* ---------- 内部工程文档存在性判断（v4.11.6 公开发布轮新增） ----------
 * B3 / B4 的文档部分检查「实现与规则文档同步」，检查对象是
 * EXTERNAL-RESOURCES.md 与 CONTENT-STYLE-GUIDE.md —— 这两份是**面向维护者**的
 * 工程文档，不进公开仓白名单（release/export-public-repo.py 的 WHITELIST_*）。
 * 公开仓内它们不存在，对应的同步断言没有检查对象，按跳过处理：打印原因、
 * 不增加 checks 计数（未冒充通过），其余断言逐字不变。
 * 私人仓内文档存在，断言与 v4.11.3–v4.11.6 完全一致。
 * 先例：tests/userscript-gm-sync.test.cjs 的源文件存在性判断（v4.11 公开发布轮）。 */
const externalDocPath = path.join(root, 'EXTERNAL-RESOURCES.md');
const styleGuidePath = path.join(root, 'CONTENT-STYLE-GUIDE.md');
const hasExternalDoc = fs.existsSync(externalDocPath);
const hasStyleGuide = fs.existsSync(styleGuidePath);
const skippedBlocks = [];

const { newPage, makeStorage, collectByClass, querySelect, dispatch } = require('./dom-stub.cjs');
const textOf = el => (!el ? '' : el._text ? el._text : (el.childNodes || []).map(textOf).join(''));
const mountLesson = id => newPage({ storage: makeStorage(), page: 'lesson', search: `?id=${id}`, href: `http://127.0.0.1:8765/lesson.html?id=${id}` });
const mainOf = page => querySelect(page.dom.body, '#main');

/* 在 vm 里加载 progress.js（可换成改过阈值的源码） */
const loadProgress = (file, replacements) => {
  let src = fs.readFileSync(path.join(root, file), 'utf8');
  for (const [from, to] of replacements || []) src = src.split(from).join(to);
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'lessons.js'), 'utf8') + '\n' + src, sandbox);
  return sandbox.window.ODIN_PROGRESS;
};
const PROGRESS = loadProgress('progress.js');
/* history/ 下 v4.11.3 轮次的改前备份，供 C3 组做「既有判定零改动」对照。
 * history/ 是私人仓的改前备份目录，不进公开仓白名单——公开仓内该备份不存在，
 * 对应的对照断言没有对照对象，按跳过处理（见文件头存在性判断）。 */
const oldProgressRel = 'history/progress_20260919-v4.11.3-heavy-lessons.js';
const hasOldProgress = fs.existsSync(path.join(root, oldProgressRel));
const OLD_PROGRESS = hasOldProgress ? loadProgress(oldProgressRel) : null;
const lessons = guide.lessons;

let checks = 0;
const check = label => { checks += 1; return label; };

/* ===== A：三处引导的视觉层级 ===== */
{
  const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  assert.ok(css.includes('body[data-page="lesson"] .lesson-guide'),
    check('A: style.css 含课页作用域的 .lesson-guide 规则（带左色条提示块）'));
  /* 不泄漏：style.css 里每个 .lesson-guide **规则选择器**都必须带课页前缀。
   * v4.11.9 修正实现方式：原来是数全文字面量出现次数（css.split('.lesson-guide')），
   * 于是**注释里提到这个类名就会造假红**——断言声明的语义是「选择器带前缀」，
   * 实现却在数「字面量出现」，两者不是一回事。VISUAL-DESIGN-PLAYBOOK §5.4 第 2 条
   * 记过同一坑型（.entry-icon 那次）。现在先剥离 CSS 注释，再提取真实规则选择器，
   * 逐个检查前缀；末尾附负向自检，证明它仍然抓得住未带前缀的泄漏规则。 */
  const stripCssComments = source => source.replace(/\/\*[\s\S]*?\*\//g, '');
  const guideRuleSelectors = source => [...stripCssComments(source).matchAll(/([^{}]+)\{/g)]
    .map(match => match[1])
    .filter(selector => selector.includes('.lesson-guide'));
  const guideSelectors = guideRuleSelectors(css);
  assert.ok(guideSelectors.length >= 1,
    check('A: style.css 至少存在一条 .lesson-guide 规则（选择器口径，注释里的字面量不计）'));
  guideSelectors.forEach(selector => assert.ok(selector.includes('body[data-page="lesson"]'),
    check(`A: .lesson-guide 规则选择器带 body[data-page="lesson"] 前缀，不泄漏到其它页面（…${selector.trim().slice(-46)}）`)));
  /* 负向自检：未带前缀的规则必须被判为泄漏，否则上面的断言是空转的 */
  const leakedSample = '/* 注释里出现 .lesson-guide 不该被计入 */\n.lesson-guide { color: red; }';
  const leakedSelectors = guideRuleSelectors(leakedSample);
  assert.equal(leakedSelectors.length, 1,
    check('A 负向自检: 注释里的 .lesson-guide 字面量不计入，只数到那条真实规则'));
  assert.ok(!leakedSelectors[0].includes('body[data-page="lesson"]'),
    check('A 负向自检: 未带课页前缀的 .lesson-guide 规则确实会被判为泄漏'));

  /* 三处引导（今天实际要做什么 / section-why / section-official）全部换用 lesson-guide，
   * 不再是 muted。前两处在当前 19 课都会渲染，第一处（D3 兼容分支）只留在源码里。 */
  const appSrc = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.equal(appSrc.split("'lesson-guide'").length - 1, 3,
    check('A: app.js 恰有 3 处引导使用 lesson-guide class（三处引导全部覆盖）'));

  const page = mountLesson('how-does-the-web-work');
  const main = mainOf(page);
  for (const sectionClass of ['section-why', 'section-official']) {
    const sec = collectByClass(main, sectionClass)[0];
    assert.ok(sec, check(`A: 课页渲染出 ${sectionClass}`));
    const guideP = (sec.childNodes || []).find(n => n.tagName === 'P' && String(n.className).split(/\s+/).includes('lesson-guide'));
    assert.ok(guideP, check(`A: ${sectionClass} 的引导段使用 lesson-guide（非 muted）`));
    assert.ok(!String(guideP.className).split(/\s+/).includes('muted'),
      check(`A: ${sectionClass} 的引导段不再使用 muted`));
    assert.ok(textOf(guideP).includes('中文辅助') || textOf(guideP).includes('本页'), check(`A: ${sectionClass} 引导文案未改动（v4.11.2 定稿内容保持）`));
  }
}

/* ===== B1 / B2：资源卡 fallback 按类型分支 + 卡内去重 ===== */
{
  /* 与 app.js resourceFallbackText 同一套类别归属判定（测试镜像，防止实现悄悄漂移） */
  const expectedFallback = resource => {
    if (resource.zhTranslation) {
      return '本站未找到可靠的官方中文版本，因此提供上面的本站中文精译（采用与原作相同的 CC 许可）与英文原文链接。';
    }
    const type = String(resource.type || '');
    if (/视频/.test(type)) return '这是视频：本站不翻译视频，上面的中文导读已把要点讲清，点开按钮直接观看。';
    if (/工具|操作入口|网站/.test(type)) return '这是网站 / 工具：本站不翻译网站界面，上面的中文导读已说明它的用途与用法，点开按钮直达。';
    if (/数据文件|素材/.test(type)) return '这是数据 / 图片文件，没有可翻译的正文；上面的中文导读说明它的用途，文件请从官方地址获取。';
    return '本站未找到可靠的官方中文版本，因此只提供上面这份本站原创中文导读，加上英文原文链接。';
  };
  const affected = resourceData.resources.filter(r => !r.zhUrl && !r.zhTranslation);
  assert.equal(affected.length, 46, check('B1: 前提——受 fallback 影响的无中文版条目共 46 条'));

  /* 数据层：每张视频卡的「中文字幕」声明恰好 1 次，且在许可字段（B2） */
  const videos = resourceData.resources.filter(r => r.type === '视频');
  assert.equal(videos.length, 15, check('B2: 前提——视频条目共 15 条'));
  for (const v of videos) {
    const inLicense = (v.license.match(/中文字幕/g) || []).length;
    const elsewhere = [v.zhGuide.overview, ...v.zhGuide.points, v.note || ''].join('|||').match(/中文字幕/g) || [];
    assert.equal(inLicense, 1, check(`B2: 《${v.titleZh}》的字幕声明归位在许可字段`));
    assert.equal(elsewhere.length, 0, check(`B2: 《${v.titleZh}》导读 / 速览 / 核验说明不再重复该声明`));
    assert.equal(JSON.stringify(v).match(/中文字幕/g).length, 1, check(`B2: 《${v.titleZh}》整张卡数据只出现 1 次`));
  }

  /* 渲染层：逐课逐卡核对 fallback 文案与类型的对应（B1 全量 + B2 渲染计数）。
   * resource-guide-only 卡 = 全部 !zhUrl 条目（含 14 条精译卡），与渲染分支一致。 */
  let videoCards = 0, toolCards = 0, articleCards = 0, fallbackCards = 0, archiveCards = 0, dataCards = 0, translationCards = 0;
  for (const lesson of lessons) {
    const page = mountLesson(lesson.id);
    const cards = collectByClass(mainOf(page), 'resource-guide-only');
    const expectedItems = resourceData.resources.filter(r => r.lessonId === lesson.id && !r.zhUrl);
    assert.equal(cards.length, expectedItems.length, check(`B1: ${lesson.id} 无中文版卡片数与数据一致`));
    expectedItems.forEach((resource, i) => {
      const zhType = collectByClass(cards[i], 'resource-zh-type')[0];
      assert.ok(zhType, check(`B1: 《${resource.titleZh}》渲染出 resource-zh-type 说明行`));
      assert.equal(textOf(zhType), expectedFallback(resource),
        check(`B1: 《${resource.titleZh}》（${resource.type}）的 fallback 文案与类别归属一致`));
      if (resource.zhTranslation) {
        translationCards += 1;
        assert.ok(textOf(zhType).includes('本站中文精译') && textOf(zhType).includes('CC 许可'),
          check(`B1: 精译卡《${resource.titleZh}》的说明句如实指向精译（不再与译文块自相矛盾）`));
      } else if (resource.type === '视频') {
        videoCards += 1;
        const whole = textOf(cards[i]);
        assert.equal((whole.match(/中文字幕/g) || []).length, 1, check(`B2: 渲染后的《${resource.titleZh}》整卡「中文字幕」恰 1 次`));
        assert.ok(textOf(zhType).includes('这是视频') && !textOf(zhType).includes('未找到可靠的官方中文版本'),
          check(`B1: 视频卡不再被套上「未找到官方中文版本」的不准确说法`));
      } else if (/工具|操作入口|网站/.test(resource.type)) {
        toolCards += 1;
        assert.ok(textOf(zhType).includes('这是网站 / 工具'), check(`B1: 工具卡（${resource.type}）渲染「网站 / 工具」措辞`));
      } else if (/数据文件|素材/.test(resource.type)) {
        dataCards += 1;
      } else if (resource.type === '文章（存档）') {
        archiveCards += 1;
        assert.ok(textOf(zhType).includes('未找到可靠的官方中文版本'),
          check('B1/N4: 未覆盖类型（文章（存档））回落到既有通用文案（安全兜底）'));
      } else if (/文章|文档/.test(resource.type)) {
        articleCards += 1;
        assert.ok(textOf(zhType).includes('未找到可靠的官方中文版本'), check(`B1: 文本类（${resource.type}）保持原措辞`));
      } else {
        fallbackCards += 1;
      }
    });
  }
  assert.equal(videoCards, 15, check('B1: 15 张视频卡全部渲染视频措辞'));
  assert.equal(translationCards, 14, check('B1: 14 张精译卡的说明句全部改指精译（v4.11.2 遗留的矛盾句修正）'));
  assert.equal(toolCards, 8, check('B1: 8 张工具 / 操作入口卡全部渲染工具措辞'));
  assert.equal(articleCards, 15, check('B1: 15 张文章 / 文档类卡片保持原措辞'));
  assert.equal(archiveCards, 1, check('B1: 「文章（存档）」这条未覆盖类型走了兜底'));
}

/* ===== B3：规则入库（公开仓内该文档不存在 → 跳过，见文件头存在性判断） ===== */
if (hasExternalDoc) {
  const doc = fs.readFileSync(externalDocPath, 'utf8');
  assert.ok(doc.includes('## 按资源类型的文案规则（v4.11.3）'), check('B3: EXTERNAL-RESOURCES.md 含新增规则节'));
  for (const keyword of ['这是视频', '这是网站 / 工具', '兜底', '全卡只出现一次', 'resourceFallbackText']) {
    assert.ok(doc.includes(keyword), check(`B3: 规则节覆盖关键内容（${keyword}）`));
  }
} else {
  skippedBlocks.push('B3（EXTERNAL-RESOURCES.md 不存在，公开仓场景）');
}

/* ===== B4：资源卡按钮文字按类型分动作标签（v4.11.4） =====
 * 与 app.js resourceLinkLabel 同一套判定（测试镜像，防止实现悄悄漂移）；
 * 标签表的规则源是 CONTENT-STYLE-GUIDE.md 第 4 节，改标签 = 三处同源。 */
{
  const expectedLabel = resource => {
    const type = String(resource.type || '');
    if (/视频/.test(type)) return '观看视频 ↗';
    if (/操作入口/.test(type)) return '前往操作 ↗';
    if (/工具|网站/.test(type)) return '打开工具 ↗';
    if (/数据文件/.test(type)) return '下载文件 ↗';
    if (/素材/.test(type)) return '查看素材 ↗';
    return '打开英文原文 ↗';
  };
  const anchorsOf = card => (collectByClass(card, 'resource-links')[0].childNodes || []).filter(n => n.tagName === 'A');
  const counts = { 双按钮中文版: 0, 观看视频: 0, 前往操作: 0, 打开工具: 0, 下载文件: 0, 查看素材: 0, 打开英文原文: 0 };
  for (const lesson of lessons) {
    const page = mountLesson(lesson.id);
    const cards = collectByClass(mainOf(page), 'resource-card');
    const expectedItems = resourceData.resources.filter(r => r.lessonId === lesson.id);
    assert.equal(cards.length, expectedItems.length, check(`B4: ${lesson.id} 卡片数与数据一致`));
    expectedItems.forEach((resource, i) => {
      const links = anchorsOf(cards[i]);
      if (resource.zhUrl) {
        counts.双按钮中文版 += 1;
        assert.equal(links.length, 2, check(`B4: 《${resource.titleZh}》官方中文版卡维持双按钮`));
        assert.equal(textOf(links[0]), '打开中文版 ↗', check(`B4: 《${resource.titleZh}》首按钮「打开中文版 ↗」不变`));
        assert.equal(textOf(links[1]), '打开英文原文 ↗', check(`B4: 《${resource.titleZh}》次按钮「打开英文原文 ↗」不变`));
      } else {
        assert.equal(links.length, 1, check(`B4: 《${resource.titleZh}》无中文版卡只有单按钮`));
        const label = textOf(links[0]);
        assert.equal(label, expectedLabel(resource),
          check(`B4: 《${resource.titleZh}》（${resource.type}）按钮「${label}」与标签表一致`));
        counts[label.replace(' ↗', '')] += 1;
      }
    });
  }
  assert.equal(counts.双按钮中文版, 24, check('B4: 24 张官方中文版卡维持双按钮（文字不变）'));
  assert.equal(counts.观看视频, 15, check('B4: 15 张视频卡按钮为「观看视频 ↗」'));
  assert.equal(counts.前往操作, 3, check('B4: 3 张操作入口卡按钮为「前往操作 ↗」'));
  assert.equal(counts.打开工具, 5, check('B4: 5 张工具 / 网站卡按钮为「打开工具 ↗」'));
  assert.equal(counts.下载文件, 1, check('B4: 1 张数据文件卡按钮为「下载文件 ↗」'));
  assert.equal(counts.查看素材, 1, check('B4: 1 张素材卡按钮为「查看素材 ↗」'));
  assert.equal(counts.打开英文原文, 35, check('B4: 35 张文本类 / 精译卡按钮保持「打开英文原文 ↗」（兜底）'));
  /* CONTENT-STYLE-GUIDE.md 第 4 节标签表与实现同源（三处同源的第三处）。
   * 公开仓内该文档不存在 → 只跳过这一小段文档同步检查，上方按钮计数断言照跑。 */
  if (hasStyleGuide) {
    const guideDoc = fs.readFileSync(styleGuidePath, 'utf8');
    for (const keyword of ['观看视频 ↗', '前往操作 ↗', '打开工具 ↗', '下载文件 ↗', '查看素材 ↗', 'resourceLinkLabel']) {
      assert.ok(guideDoc.includes(keyword), check(`B4: CONTENT-STYLE-GUIDE.md 标签表覆盖（${keyword}）`));
    }
  } else {
    skippedBlocks.push('B4-文档（CONTENT-STYLE-GUIDE.md 不存在，公开仓场景；按钮计数断言仍执行）');
  }
}

/* ===== C1：大课集合由数据算出 ===== */
{
  const heavy = PROGRESS.Logic.heavyLessonList(lessons);
  assert.deepEqual([...heavy.map(l => l.id)].sort(),
    ['command-line-basics', 'git-basics', 'how-does-the-web-work', 'links-and-images'],
    check('C1: 大课集合由真实数据算出，恰为 4 课（与规划实测一致）'));
  /* 公式一致性：判定与阈值公式逐课等价 */
  for (const l of lessons) {
    const sections = (l.sections || []).length;
    const kc = ((l.official || {}).knowledgeCheck || []).length;
    assert.equal(PROGRESS.Logic.isHeavyLesson(l), sections >= 14 || kc >= 10,
      check(`C1: ${l.id} 的判定与「章≥14 或 KC≥10」公式一致`));
  }
  /* N1 负向对照：故意调低阈值 → 集合必须变大（证明不是硬编码 id 清单） */
  const perturbed = loadProgress('progress.js', [
    ['HEAVY_LESSON_MIN_SECTIONS = 14', 'HEAVY_LESSON_MIN_SECTIONS = 12'],
    ['HEAVY_LESSON_MIN_KC = 10', 'HEAVY_LESSON_MIN_KC = 8']
  ]);
  const heavyPerturbed = perturbed.Logic.heavyLessonList(lessons);
  assert.ok(heavyPerturbed.length > heavy.length, check('C1/N1: 阈值调低后大课集合变大（非硬编码）'));
  assert.ok(heavyPerturbed.some(l => l.id === 'html-boilerplate'), check('C1/N1: 阈值 12/8 时 html-boilerplate（12 章）进入集合'));
}

/* ===== C2：体量提示（事前）与强化反馈（完课时） ===== */
{
  const heavyPage = mountLesson('how-does-the-web-work');
  const heavyNotices = collectByClass(mainOf(heavyPage), 'notice');
  const scaleNotice = heavyNotices.find(n => textOf(n).includes('本课体量较大'));
  assert.ok(scaleNotice, check('C2: 大课课页渲染体量提示'));
  assert.ok(textOf(scaleNotice).includes('8 章') && textOf(scaleNotice).includes('15 道'),
    check('C2: 体量提示用中性事实（章节数 / 自查题数）表述'));
  assert.ok(!/难|放弃|劝退/.test(textOf(scaleNotice)), check('C2: 体量提示无负面措辞'));

  const lightPage = mountLesson('introduction-to-html-and-css');
  assert.ok(!collectByClass(mainOf(lightPage), 'notice').some(n => textOf(n).includes('本课体量较大')),
    check('C2/N3: 最轻课不渲染体量提示'));

  /* 完课强化反馈：勾选「本课已完成」后，大课多一条「大课拿下」提示 */
  const toggleCompleted = page => {
    const fieldset = collectByClass(page.dom.body, 'lesson-progress')[0];
    const labels = collectByClass(fieldset, 'progress-toggle');
    const target = labels.find(l => textOf(l).includes('本课已完成'));
    const box = (target.childNodes || []).find(n => n.tagName === 'INPUT');
    box.checked = true;
    dispatch(box, 'change', {});
  };
  const notesWith = page => collectByClass(page.dom.body, 'achievement-note').map(textOf)
    .filter(t => t.includes('大课拿下'));
  toggleCompleted(heavyPage);
  assert.equal(notesWith(heavyPage).length, 1, check('C2: 大课勾选完成出现 1 条「大课拿下」强化反馈'));
  assert.ok(notesWith(heavyPage)[0].includes('8 章讲解') && notesWith(heavyPage)[0].includes('15 道官方自查题'),
    check('C2: 强化反馈点出体量事实'));
  toggleCompleted(lightPage);
  assert.equal(notesWith(lightPage).length, 0, check('C2/N3: 普通课勾选完成没有强化反馈'));
}

/* ===== C3：新成就 + 既有判定零改动 + 存量档案兼容 ===== */
{
  const nowIds = PROGRESS.Logic.ACHIEVEMENTS.map(a => a.id);
  assert.equal(nowIds.length, 63, check('C3: 当前 63 个成就 = 61 既有 + 2 新增'));

  /* 与 history/ 改前备份的对照断言（公开仓内无该备份 → 跳过整段） */
  if (hasOldProgress) {
    const oldIds = OLD_PROGRESS.Logic.ACHIEVEMENTS.map(a => a.id);
    assert.equal(oldIds.length, 61, check('C3: 前提——改前备份里是 61 个成就'));
    assert.deepEqual([...nowIds].sort(), [...new Set([...oldIds, 'heavy-first', 'heavy-all'])].sort(),
      check('C3: 新增恰为 heavy-first / heavy-all 两个，既有 id 零改动'));

    /* 61 个既有成就的定义逐字段不变（goal / 文案 / 分类 / milestone / hidden）。
     * 两份定义来自不同 vm 上下文（原型不同），用 JSON 序列化对比内容。 */
    const oldById = new Map(OLD_PROGRESS.Logic.ACHIEVEMENTS.map(a => [a.id, a]));
    for (const a of PROGRESS.Logic.ACHIEVEMENTS) {
      if (!oldById.has(a.id)) continue;
      assert.equal(JSON.stringify(a), JSON.stringify(oldById.get(a.id)), check(`C3: 既有成就 ${a.id} 定义逐字段不变`));
    }

    /* XP 数值与等级曲线零改动 */
    assert.equal(PROGRESS.Logic.XP_PER_ACTIVE_MINUTE, OLD_PROGRESS.Logic.XP_PER_ACTIVE_MINUTE, check('C3: XP_PER_ACTIVE_MINUTE 零改动'));
    assert.equal(PROGRESS.Logic.XP_FIRST_LESSON_COMPLETE, OLD_PROGRESS.Logic.XP_FIRST_LESSON_COMPLETE, check('C3: XP_FIRST_LESSON_COMPLETE 零改动'));
    assert.equal(PROGRESS.Logic.XP_FIRST_OFFICIAL_COMPLETE, OLD_PROGRESS.Logic.XP_FIRST_OFFICIAL_COMPLETE, check('C3: XP_FIRST_OFFICIAL_COMPLETE 零改动'));
    assert.equal(PROGRESS.Logic.XP_FIRST_QUIZ_COMPLETE, OLD_PROGRESS.Logic.XP_FIRST_QUIZ_COMPLETE, check('C3: XP_FIRST_QUIZ_COMPLETE 零改动'));
    assert.equal(PROGRESS.Logic.READ_COMPLETE_XP, OLD_PROGRESS.Logic.READ_COMPLETE_XP, check('C3: READ_COMPLETE_XP 零改动'));
    assert.equal(PROGRESS.Logic.XP_PER_LEVEL, OLD_PROGRESS.Logic.XP_PER_LEVEL, check('C3: XP_PER_LEVEL 零改动'));
    assert.equal(JSON.stringify(PROGRESS.Logic.LEVEL_CURVE), JSON.stringify(OLD_PROGRESS.Logic.LEVEL_CURVE), check('C3: LEVEL_CURVE 零改动'));
  } else {
    skippedBlocks.push('C3-对照（history/ 改前备份不存在，公开仓场景；新成就判定与存量档案兼容断言仍执行）');
  }

  /* 解锁判定：完成 4 门大课 → 两个都解锁；完成 3 门 → 只解锁第一级（N2 负向对照） */
  const heavyIds = PROGRESS.Logic.heavyLessonList(lessons).map(l => l.id);
  const makeState = completedIds => {
    const state = PROGRESS.Logic.emptyState();
    completedIds.forEach(id => {
      state.lessons[id] = Object.assign(PROGRESS.Logic.emptyLessonEntry(), { completed: true, started: true });
    });
    return state;
  };
  const NOW = '2026-09-19T12:00:00.000Z';
  const TODAY = '2026-09-19';
  const state4 = makeState(heavyIds);
  const unlocked4 = PROGRESS.Logic.evaluateAchievements(state4, lessons, NOW, TODAY);
  assert.ok(unlocked4.includes('heavy-first'), check('C3: 完成 4 门大课解锁「啃下一门大课」'));
  assert.ok(unlocked4.includes('heavy-all'), check('C3: 完成 4 门大课解锁「大课全数拿下」'));

  const state3 = makeState(heavyIds.slice(0, 3));
  const unlocked3 = PROGRESS.Logic.evaluateAchievements(state3, lessons, NOW, TODAY);
  assert.ok(unlocked3.includes('heavy-first'), check('C3: 完成 3 门大课解锁「啃下一门大课」'));
  assert.ok(!unlocked3.includes('heavy-all'), check('C3/N2: 完成 3 门大课不解锁「大课全数拿下」'));

  /* 与 history/ 改前备份的新旧解算对照（公开仓内无该备份 → 跳过整段） */
  if (hasOldProgress) {
    /* 既有 61 个成就的判定不变：同一档案在新旧两版下解锁集合一致（去掉新增两个） */
    const makeOldState = completedIds => {
      const state = OLD_PROGRESS.Logic.emptyState();
      completedIds.forEach(id => {
        state.lessons[id] = Object.assign(OLD_PROGRESS.Logic.emptyLessonEntry(), { completed: true, started: true });
      });
      return state;
    };
    for (const [name, completedIds] of [['4门大课', heavyIds], ['3门大课', heavyIds.slice(0, 3)], ['空档案', []]]) {
      const oldUnlocked = OLD_PROGRESS.Logic.evaluateAchievements(makeOldState(completedIds), lessons, NOW, TODAY);
      const currentUnlocked = PROGRESS.Logic.evaluateAchievements(makeState(completedIds), lessons, NOW, TODAY);
      const legacyOnly = currentUnlocked.filter(id => !oldUnlocked.includes(id));
      assert.ok(legacyOnly.every(id => ['heavy-first', 'heavy-all'].includes(id)),
        check(`C3: ${name}的新增解锁只可能是两个新成就`));
      assert.deepEqual([...currentUnlocked.filter(id => oldUnlocked.includes(id))].sort(), [...oldUnlocked].sort(),
        check(`C3: ${name}在新旧两版下的既有成就解锁集合一致（61 个判定零改动）`));
    }
  } else {
    skippedBlocks.push('C3-新旧解算对照（history/ 改前备份不存在，公开仓场景）');
  }

  /* 存量档案兼容：已完成 4 门大课 + 有等级的旧档案，载入即补发解锁，XP 与等级不降 */
  const legacy = PROGRESS.Logic.emptyState();
  heavyIds.forEach(id => {
    legacy.lessons[id] = Object.assign(PROGRESS.Logic.emptyLessonEntry(), { completed: true, started: true, completedAt: '2026-09-01T00:00:00.000Z' });
  });
  legacy.xp = 550;
  const levelBefore = PROGRESS.Logic.levelOf(legacy.xp);
  const unlockedLegacy = PROGRESS.Logic.evaluateAchievements(legacy, lessons, NOW, TODAY);
  assert.ok(unlockedLegacy.includes('heavy-first') && unlockedLegacy.includes('heavy-all'),
    check('C3: 存量档案（已完成 4 门大课）按历史状态补发解锁两个新成就'));
  assert.equal(legacy.xp, 550, check('C3: 补发解锁不改变 XP（成就不带 XP）'));
  assert.equal(PROGRESS.Logic.levelOf(legacy.xp), levelBefore, check('C3: 等级不降'));

  /* 存量档案**载入路径**实测：v3 档案 JSON 播种进 localStorage，挂载首页后
   * 新成就自动解锁、XP / 等级原样（走真实 restore + afterChange 链路，不是纯函数直调） */
  const { newPage: mountHome, makeStorage: homeStorage, archiveJson, lessonEntryJson, STORAGE_KEY } = require('./dom-stub.cjs');
  const seeded = homeStorage();
  const legacyLessons = {};
  heavyIds.forEach(id => {
    legacyLessons[id] = lessonEntryJson({ completed: true, started: true, completedAt: '2026-09-01' });
  });
  seeded.setItem(STORAGE_KEY, archiveJson({ xp: 550, lessons: legacyLessons }));
  const homePage = mountHome({ storage: seeded, page: 'home', href: 'http://127.0.0.1:8765/index.html' });
  const loadedState = homePage.progress.getState();
  assert.ok(loadedState.achievements['heavy-first'] && loadedState.achievements['heavy-all'],
    check('C3: 旧档案载入后新成就自动解锁（补发解锁的端到端路径）'));
  assert.equal(loadedState.xp, 550, check('C3: 旧档案载入后 XP 不变（550）'));
  assert.equal(PROGRESS.Logic.levelOf(loadedState.xp), levelBefore, check('C3: 旧档案载入后等级不降'));
  assert.ok(homePage.progress.Logic.isHeavyLesson(lessons.find(l => l.id === 'how-does-the-web-work')),
    check('C3: 挂载后的 progress 实例带 isHeavyLesson（供课页判定用）'));
}

console.log(`heavy-lesson.test.cjs: 全部断言通过（${checks} 项检查）`
  + (skippedBlocks.length
    ? `；跳过 ${skippedBlocks.length} 项（未冒充通过）：${skippedBlocks.join('、')}`
    : ''));
