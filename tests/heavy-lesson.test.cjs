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
 *   C1 —— 大课集合由真实数据算出（读 sections / 自查题字段），恰为 3 课；
 *          C1b —— heavy-all 成就 desc 的「当前 N 门」必须等于大课集合真值（现算）；
 *          故意调低阈值后集合变大 —— 证明不是硬编码课 id；
 *   C2 —— 大课课页渲染体量提示（中性事实：章节数），普通课不渲染；
 *          勾选完成时大课多发一条「大课拿下」低干扰提示，普通课没有；
 *   C3 —— 新成就 heavy-first / heavy-all：完成全部大课的档案解锁、只差一门
 *          只解锁第一级；61 个既有成就的判定与 XP / 等级曲线零改动
 *          （对照改前备份 history/progress_20260919-v4.11.3-heavy-lessons.js）；
 *          存量档案补发解锁后 XP 与等级不降。
 *
 * 负向对照（证明这些断言真的能抓到回归）：
 *   N1 阈值扰动（C1 组内）；N2 只差一门大课不解锁 heavy-all（C3 组内）；
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
/* 路径课试点批次 3（2026-09-25）：开放数口径走汇总层——lessons.js + courses/*.js
 * + lesson-sources.js 与 dom-stub / app.js 同源装载，guide.lessons 是合并后的
 * 全站课程（Foundations 46 课 + 已开放路径课），C3 的 openCount 才能对上
 * 成就 desc 里的「49 课」全站口径。JSON 拷贝带出的 __coursesMerged 幂等标记
 * 是汇总层自有字段，不影响 lessons.length 等断言。 */
const guide = (() => {
  const sandbox = { window: {} };
  const courseFiles = fs.readdirSync(path.join(root, 'courses'))
    .filter(f => f.endsWith('.js')).map(f => 'courses/' + f);
  const scripts = ['lessons.js', ...courseFiles, 'lesson-sources.js'];
  vm.runInNewContext(scripts.map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n'), sandbox);
  return JSON.parse(JSON.stringify(sandbox.window.ODIN_GUIDE));
})();
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
/* 🔴 防「静默降级」钉（v4.11.40 阶段 5 history 分级清理轮加）：
 * 本文件用 existsSync 决定跑不跑 C3 的两组对照断言——公开仓内没有 history/，
 * 跳过是预期；但**私人仓内该备份缺失不是预期**：那意味着 history/ 清理把测试的
 * 对照基准删掉了，C3-对照 与 C3-新旧解算对照 两组断言会静默变成跳过，覆盖被削弱
 * 却不会有任何红（本文件照旧退出码 0）。这正是「静默失效的断言」形态。
 * 私人仓判据 = 根目录有 AGENTS.md（公开仓白名单不含它，导出内 .md 仅
 * README / SOURCES / CONTRIBUTING 三份）。
 * 若确要删除该备份，必须同时删掉 C3 那两组对照断言，不允许留着断言抽掉基准。
 * 误删后的恢复：git checkout <删除前的提交> -- odin-foundations-zh/history/progress_20260919-v4.11.3-heavy-lessons.js */
const isPrivateRepo = fs.existsSync(path.join(root, 'AGENTS.md'));
assert.ok(!isPrivateRepo || hasOldProgress,
  `私人仓内必须存在 C3 对照基准 ${oldProgressRel}——缺失会让 C3-对照 / C3-新旧解算对照两组断言静默跳过（history/ 分级清理不得删它）`);
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
   * 不再是 muted。前两处在当前每一课都会渲染，第一处（D3 兼容分支）只留在源码里。 */
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
  assert.equal(affected.length, 656, check('B1: 前提——受 fallback 影响的无中文版条目共 416 条（v4.11.17：随自查题节下线 −2，随第 21–23 课开放 +12，其中 2 条有官方中文版；v4.11.18 随第 24–25 课开放 +10，其中 2 条 MDN 有官方中文版；v4.11.19 随第 26–30 课开放 +10，其中 3 条 MDN 有官方中文版；v4.11.20 三批随第 31–38 课开放 +38，其中 23 条有官方中文版；第四批随第 39–40 课开放 +10，其中 5 条有官方中文版；第五批随第 41–42 课开放 +15，其中 6 条有官方中文版；第七批随第 44 课开放 +5，其中 2 条有官方中文版；第八批随第 45 课开放 +3，其中 1 条有官方中文版；第九批随第 46 课开放 +1，无中文版；路径课试点批次 3 随 World 2 第 1 章节 3 课开放 +5 条（A 类 ×6 均有官方中文版，不入此口径；C 类 ×5——CSS Cheat Sheet、Material icons、Feather icons、CSS-Tricks SVG 属性与 CSS、Josh Comeau SVG 指南——均无中文版）；v4.11.21 World 2 第二批随「中级 CSS 概念」前 5 课开放 +35 条（A 类 ×18 均为 MDN 官方中文版不入此口径；C 类 ×35——css-tricks 正文五篇与 almanac 伪选择器条目十六条、mattbrictson 对比文、Josh Comeau 定制 reset、codyloyd 存档文、web.dev 两篇、字体库三个、GDPR 新闻、fileinfo 格式清单、W3Schools 支持表、CSS Diner、Shay Howe、StackOverflow :root 讨论——均无中文版）；World 2 第三批（2026-09-26）随「中级 CSS 概念」后 5 课开放 +12 条 C 类（4 视频 + Can I Use 工具 + 7 篇文本：css-tricks / Kevin Powell / web.dev / adactio / Medium / LambdaTest / Adam Silver），A 类 ×5 不入此口径；World 2 第五批（2026-09-26，v4.11.22）随「Grid 布局」6 课开放 +9 条 C 类（2 视频：Wes Bos 隐式显式轨道 / Kevin Powell 取舍演示 + 4 篇文本：CSS-Tricks 指南与取代论 / Chrome DevTools Grid 文档 / Tuts+ 对比文 + 2 工具：Grid Garden / Pictogrammers MDI + 1 规范：W3C Grid #auto-repeat），A 类 ×2（MDN 基于线的定位 / MDN min-content）不入此口径；World 3 批次 4 阶段 1（2026-09-26，v4.11.23）随 javascript 课程前两章 15 课开放 +28 条 C 类（2 视频含 1 播放列表：WDS SOLID 列表 / mpj 组合优于继承 + 2 存档：Beary 早餐吧 / innoarchitech 耦合文 + 2 受限：npmjs 包页 / Medium SOLID 文 + 工具与站点 5：VS Code Live Preview / JSON formatter / Things / any.do / date-fns + 文本 17：dev.to 两篇 / DigitalOcean / JavaScript Tutorial / Wes Bos 两篇 / ayweb / npm 官方文档两篇 / peterxjang / 维基 Minification / webpack 官方四页 / W3Schools JSON 两页；Todoist 按官方中文站登记为 A 类，不入此口径），A 类 ×24（MDN zh-CN ×20、zh.javascript.info ×3、Todoist 官网中文版 ×1）不入此口径；World 3 批次 4 阶段 2（2026-09-27，v4.11.24）随 javascript 课程第三、四章 7 课开放 +40 条 C 类（7 视频：Prettier 作者 React Conf 演讲 / WDS Promise 十分钟 / Philip Roberts 事件循环演讲 / Lydia Hallie 两支可视化 / MuleSoft API 三分钟 / Wes Bos dotJS 演讲，全部 oEmbed 核验、不声称有中文字幕 + 1 存档：devfactor 2375 美元亚马逊 EC2 事故文——官方给的存档链接原路径有笔误（2014-12-30 应为 2014/12/30），按 CDX 索引修正后实测 200 + 工具与扩展 12：ESLint 官网与文档三页 / Prettier 官网与文档两页与 playground / Babel 官网 / Visual Crossing 四页（服务/文档/定价/查询构造器）与注册入口 / Giphy 平台与开发者文档两页 / jsbin 演示 bin（命令行 403、真实浏览器实测在位）/ VSCode 两扩展 + 文档与文章 20：三大风格指南 / codacy 与 codeburst 两文（后者 Medium 系 403、真实浏览器实测 h1）/ GFG 回调地狱 / art-of-node callbacks 节 / davidwalsh Promise 文 / es6features、axios、superagent、Public-APIs 四仓库 / Wikipedia 版本史英文条目 / webpack Module Methods），A 类 ×10（MDN zh-CN ×7、zh.javascript.info ×2、zh.wikipedia ×1）不入此口径——本批无新增受限条目，jsbin 与 codeburst 均经真实浏览器核验；阶段 3（2026-09-27，v4.11.25）随 javascript 课程第五、六章 14 课开放 +55 条 C 类（25 视频含 1 播放列表 / 5 工具：Mocha / Jasmine / Tape / Jest 主页与 Merge Sort Visualizer / 3 存档：TDD 两文与 CMU 链表讲义——官方即给存档地址 / 18 文本：jest 官方文档 ×4、gfg 五篇、dev.to ×3、Medium 纯函数文、doabledanny、sahinarslan、samwho.dev、nodejs.dev Node CLI 文档、crypto.interactive-maths / 问答 3 与速查表 1 走通用兜底），A 类 ×13 不入此口径；新增受限 6 条均经真实浏览器核验；阶段 4（2026-09-27，v4.11.26）随「Git 进阶」3 课 +「JavaScript 收尾」2 课开放（World 3 全 41 课收组）+3 条 C 类（1 视频：Git Revert vs Git Reset / 1 教程文章：Think Like (a) Git / 1 工具：battleship-game.org 在线版），A 类 ×7（Pro Git 三章中文版 / GitHub 合并冲突中文版 / 约定式提交中文版 / 维基海战棋 / React 官方中文文档）不入此口径；本批无新增受限条目；World 4 批次 5 阶段 1（2026-09-27，v4.11.27）随「动画」章节 3 课开放 +13 条 C 类（10 文章/文档：MDN scaleZ 与 scale3d 两函数页 zh-CN 实测 404 无中文版 + web.dev 渲染性能 + QHMIT rotate3d + desandro perspective + Josh Comeau 四篇（transforms 全景 / 层叠上下文 / 过渡交互指南 / 关键帧交互指南）+ dzhavat repaint 实录 + 1 存档：CSS Triggers 对照表（官方即给存档地址）+ 1 工具扩展：CSS Stacking Context inspector + 1 代码仓库视图：css-exercises animation 练习目录），A 类 ×7（MDN zh-CN ×5：transform-function 总览 / rotate3d / translate3d / 过渡教程 / 动画教程与 @keyframes 参考——共 6 页中 5 页有中文版 + 维基图形处理器）不入此口径；本批无新增受限条目；批次 5 阶段 2（2026-09-27，v4.11.28）随「无障碍」章节 8 课开放 +21 条 C 类（5 视频 + 4 工具 + 12 文本类：文章 2 / 教程文章 3 / 参考文档 4 / 速查表 1 / 规范 1 / 社区讨论 1），A 类 ×7 不入此口径；本批无新增受限条目；批次 5 阶段 3（2026-09-27，v4.11.29，World 4 收组）随「响应式设计」章节 5 课开放 +4 条 C 类（1 工具：codyloyd 纯 HTML 演示页 + 1 存档：Using Percentages in CSS——官方即给 web.archive.org 地址 + 2 文本：CSS-Tricks 响应式图片语法指南 / devicon 图标库），A 类 ×7（Chrome device-mode ?hl=zh-cn + MDN zh-CN ×6）不入此口径；本批无新增受限条目——pexels 命令行 403 为既有受限条目、真实浏览器复核发现 /zh-cn/ 官方中文版的事实已追加其 note；批次 6 阶段 0（2026-09-27，用户拍板）pexels 条目升级 A 类（zhUrl 登记官方简体中文站 /zh-cn/、直连实测 200）移出本口径 −1——A 类卡改双按钮不走 fallback）；批次 6 阶段 1（2026-09-27，v4.11.30）随 react 两章 8 课开放 +8 条 C 类（文章 4：Medium 框架生命周期文——受限，命令行 403、真实浏览器核验标题 / RisingStack React 历史时间线 / freeCodeCamp 框架与库的区别 / GFG React 主要优势 + 工具 2：react.new 浏览器沙箱 / React Developer Tools 商店扩展——商店界面中文但列项 meta description 实测英文判 C 类 + 教程文章 1：Chrome 里的 React DevTools 入门 + 视频 1：Codevolution index-as-key 反模式），A 类 ×15（zh-hans.react.dev ×7 / cn.vite.dev ×2 / zh.wikipedia ×3 / MDN zh-CN ×2 / javascript.info 柯里化 ×1）不入此口径；批次 6 阶段 2（2026-09-28，v4.11.31）随 react「状态与副作用」5 课 +「类组件」2 课开放 +16 条 C 类（文章/文档 7：Academind state 预读（tutorials→articles 路径迁移）/ GFG 调和算法（路径 301 迁移）/ Netlify 文档 / Vercel 文档 / Cloudflare Pages 文档（zh-cn 分区存在但 Pages 子区实测 404——CF 中文覆盖按产品分区新事实）/ CF Vite 部署指南（官方原文带 #:~:text 片段按 qr.ae 先例登记规范地址）/ dmitripavlutin useEffect 无限循环文 + 网站/工具 6：Netlify 主站 / Vercel 主站（宣传语已更新为 Agentic Infrastructure 如实登记）/ Cloudflare Pages 产品页（301 到 www.cloudflare.com/products/pages/ 现役路径）/ heldersrvio 学生成品演示 / PokéAPI / wojtekmaj 生命周期交互图 + 操作入口 2：Netlify 与 Vercel 导入入口 + 代码仓库视图 1：react-examples 练习仓库——TOP 自有练习仓库按 css-exercises 练习目录先例登记），A 类 ×12（zh-hans.react.dev ×9 / MDN zh-CN ×2 / cn.vite.dev ×1）不入此口径——本批无新增受限条目（29 维持）；批次 6 阶段 3（2026-09-28，v4.11.32，World 5 收组）随 react「React 测试」2 课 +「React 生态」4 课 +「更多 React 概念」3 课 +「结语」1 课开放 +53 条 C 类（Testing Library 六页文档 / Vitest 两页 / React Router 七个 API 页与文档首页 / Netlify·Vercel·Cloudflare 三平台部署文档（三处 301 迁移现役路径登记）/ LogRocket 两文 / CSS-Tricks / MakeUseOf / kentcdodds 三文 / bholmes / overreacted / robinwieruch 两文 / TOP 官网 submissions 两源码视图 / c2 wiki AAA 词条 / jest-dom·css-modules·zustand·rfcs 四仓库 / FakeStore·Tailwind·MUI·Radix·Chakra·patterns.dev 六站 + smashing Local Storage 存档文）——A 类 ×10（MDN History 中文版 + zh-hans.react.dev ×9）不入此口径；受限 +1（Medium mock 子组件文命令行 403 + 真实浏览器可达双通路登记，29 → 30）；超长轮批次 7 阶段 1（2026-09-28，v4.11.33，World 6 收组）随 databases 3 课开放 +10 条 C 类（LaunchSchool SQL 书引言 / 关系型数据库视频 / 可汗 SQL 欢迎页与 W3Schools 两页受限 / circleci 对比文 / SQL Teaching / SQLBolt / SQL Zoo），A 类 ×0；超长轮批次 7 阶段 2（2026-09-28，v4.11.34）随 nodejs 两章 17 课开放 +70 条 C 类（视频 7 / 工具与网站 9 / 文章与文档 31 / 百科条目、官方指南、参考文档、代码仓库、问答等走通用兜底 23），A 类 ×10（nodejs.org 中文站站点页 1 / MDN zh-CN 3 / expressjs zh-cn guide 区 3 / zh.wikipedia 3）不入此口径；受限 +4（npmjs 包页 ×2 / Medium 中间件文 / StackOverflow scripts 回答，33 → 37）；超长轮批次 7 阶段 3（2026-09-29，v4.11.35）随 nodejs 后六章 13 课开放 +65 条 C 类（视频 9 / 工具与网站 15 / 文章与文档 25 / 存档 2 / 代码仓库、说明仓库、社区讨论、社区板块、代码仓库视图、书籍、官方指南等走通用兜底 14），A 类 ×9（zh.wikipedia ×5 / simple.wikipedia REST 条对应中文版 ×1 / MDN zh-CN 同源策略 ×1 / expressjs zh-cn advanced 区安全与性能 ×2）不入此口径；受限 +4（npmjs connect-pg-simple 包页 403 / Medium 无状态认证文 403 / StackOverflow Serial-Identity 答 403 / gravatar 官网命令行 000，37 → 41）；超长续轮批次 7 阶段 4（2026-09-29，v4.11.36，World 8 求职 14 课、全站 197 课收官）随 getting-hired 14 课开放 +95 条 C 类（97 条新增中 2 条 A 类：leetcode.cn 力扣中文站——真实浏览器实测首页渲染 3288 汉字全中文题库界面、visualgo.net/zh 中文界面——内容级核验 3285 汉字，A 类走双按钮不入此口径）'));

  /* 数据层：每张视频卡的「中文字幕」声明恰好 1 次，且在许可字段（B2） */
  const videos = resourceData.resources.filter(r => r.type === '视频');
  assert.equal(videos.length, 88, check('B2: 前提——视频条目共 69 条（v4.11.20 第二批起含课 36 的 Coding Tech 演讲，第四批起含课 40 的数组速览视频，第五批起含课 41 的 XSS 攻防视频，第七批起含课 44 的两个 Array Cardio 跟练视频；World 2 第五批起含 Grid 批的 Wes Bos 隐式显式轨道与 Kevin Powell 取舍演示 2 条；World 3 批次 4 起含 OOP 原则课的 WDS SOLID 播放列表与 mpj 组合优于继承 2 条；World 3 批次 4 阶段 2 起含异步三部曲与 linting 课的 7 张：Prettier 作者演讲 / WDS Promise 十分钟 / Philip Roberts 事件循环 / Lydia Hallie 两支可视化 / MuleSoft API 三分钟 / Wes Bos dotJS；阶段 3 起含 25 条：Unit testing 播放列表与 Jest Crash Course / Sandi Metz 演讲 / CS 引言 4 支 / 递归 3 支 / 项目递归资料 5 支 / 常见数据结构 7 支 / 链表 1 支 / CS50 哈希表讲座 / BST 构造 1 支；阶段 4 起含 1 条：Git Revert vs Git Reset（Boot dev）；批次 5 阶段 2 起 +5 支（W3C 无障碍视角合集页 / Pope Tech 表格演示 / A11ycasts #18、#03、#04））；批次 6 阶段 1 起 +1 条：Codevolution index-as-key 反模式（oEmbed 核验、不声称有中文字幕）；批次 7 阶段 1 起 +1 条：关系型数据库简介视频（databases 导论课）；批次 7 阶段 2 起 +7 条：NodeJS 入门短视频 / Net Ninja 速成播放列表 / VS Code 调试视频 / PedroTech MVC 与路由两支 / WDS Express 35 分钟 / Fireship PostgreSQL 100 秒（全部 oEmbed 核验、不声称有中文字幕）；批次 7 阶段 3 起 +9 条：Express 会话与 Passport 播放列表 / 完全理解 express-session / Passport 本地策略配置 / 数据库存储密码的方法与风险 / Prisma 速成课（Traversy Media）/ 创建与验证 JWT / JWT 能派上用场的不同方式 / 反对 JWT 的一个论证 / 更多关于 API 如何工作（全部 oEmbed 核验、不声称有中文字幕）；超长续轮批次 7 阶段 4（2026-09-29，v4.11.36，World 8 求职 14 课、全站 197 课收官） +1（networking 课 YouTube「开发者如何用 LinkedIn 求职」视频，oEmbed 核验、英文视频）'));
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
  assert.equal(videoCards, 88, check('B1: 69 张视频卡全部渲染视频措辞（v4.11.18 起含课 24 的 2 张，v4.11.20 第二批起含课 36 的 Coding Tech 演讲，第四批起含课 40 的数组速览视频，第五批起含课 41 的 XSS 攻防视频，第七批起含课 44 的两个 Array Cardio 跟练视频；World 2 第五批起含 Grid 批 2 张；World 3 批次 4 起含 OOP 原则课的 WDS SOLID 播放列表与 mpj 组合优于继承 2 张；World 3 批次 4 阶段 2 起含异步三部曲与 linting 课的 7 张：Prettier 作者演讲 / WDS Promise 十分钟 / Philip Roberts 事件循环 / Lydia Hallie 两支可视化 / MuleSoft API 三分钟 / Wes Bos dotJS；阶段 3 起含 25 张（同 B2 口径）；阶段 4 起含 1 张：Git Revert vs Git Reset；批次 5 阶段 2 起 +5 张（无障碍章节，全部页面或 oEmbed 核验、不声称有中文字幕））；批次 6 阶段 1 起 +1 张：Codevolution index-as-key 反模式；批次 7 阶段 2 起 +7 张（nodejs 章 7 支视频，全部 oEmbed 核验、不声称有中文字幕）；批次 7 阶段 3 起 +9 张（nodejs 后六章 9 支视频，全部 oEmbed 核验、不声称有中文字幕）；超长续轮批次 7 阶段 4（2026-09-29，v4.11.36，World 8 求职 14 课、全站 197 课收官） +1（networking 课 YouTube LinkedIn 求职视频卡）'));
  assert.equal(translationCards, 14, check('B1: 14 张精译卡的说明句全部改指精译（v4.11.2 遗留的矛盾句修正）'));
  assert.equal(toolCards, 94, check('B1: 63 张工具 / 操作入口 / 网站卡全部渲染工具措辞（v4.11.16 起含 Allrecipes，v4.11.19 起含 Flexbox Froggy，v4.11.20 起含课 31 的 Live Preview 扩展，第八批起含课 45 的 CalculatorSoup 在线计算器，v4.11.21 起含高级选择器课的 CSS Diner。路径课试点批次 3 的 World 2 新增 3 条不属工具类：Material icons / Feather icons 是素材库、CSS Cheat Sheet 是速查表走通用兜底；第二批的字体库 ×3 同为素材库走素材分支；World 2 第五批起含 Grid Garden 通关游戏（工具类）；World 3 批次 4 起含 7 张：VS Code Live Preview / npmjs 包页 / JSON formatter / date-fns 四个工具 + Things / any.do / Beary 早餐吧三个网站；阶段 2 起含 11 张：ESLint 与 Prettier 官网及 playground / Babel 官网 / VSCode 两扩展 / Visual Crossing 服务页与查询构造器 / Giphy 平台 / jsbin 演示（工具与网站 10 张）+ Visual Crossing 注册页（操作入口 1 张）；阶段 3 起含 5 张：Mocha / Jasmine / Tape / Jest 四个测试框架主页与 Merge Sort Visualizer；阶段 4 起含 1 张：battleship-game.org 在线版；批次 5 阶段 1 起含 1 张：CSS Stacking Context inspector 扩展；批次 5 阶段 2 起含 4 张：NVDA 下载 / WebAIM Contrast Checker / axe DevTools 商店页 / WAVE；批次 5 阶段 3 起含 1 张：codyloyd 纯 HTML 演示页）；批次 6 阶段 1 起含 2 张：react.new 沙箱 / React Developer Tools 商店扩展；批次 6 阶段 2 起含 8 张：Netlify / Vercel / Cloudflare Pages 三平台主站与产品页 + Netlify 与 Vercel 两个导入入口（操作入口）+ PokéAPI + heldersrvio 学生演示站 + wojtekmaj 生命周期图工具；批次 6 阶段 3 起含 7 张：Vitest / FakeStore API / Tailwind / MUI / Radix / Chakra 六工具 + patterns.dev 网站；批次 7 阶段 2 起 +9 张：Postman 下载页 + Railway / Render / Neon / Aiven 四家 PaaS 主站 + free-for.dev 名录 + EJS 官网 + PostgreSQL 官网 + Express 官网主站；批次 7 阶段 3 起 +15 张：Passport.js 官网 / Prisma 产品页 / Prisma 官方 VS Code 扩展 / Google Drive / Cloudinary / Heroku / DigitalOcean / GitHub Pages / jamstack.org / Socket.IO / Gravatar / Redis / Learn MongoDB / syntax.fm / Node.js 官方博客；超长续轮批次 7 阶段 4（2026-09-29，v4.11.36，World 8 求职 14 课、全站 197 课收官） +3（BrandYourself / Novorésumé / FlowCV 三个工具卡；VisuaLgo 可视化工具为 A 类 zhUrl 走双按钮不入此口径）'));
  assert.equal(articleCards, 314, check('B1: 216 张文章 / 文档类卡片保持原措辞（v4.11.20 第九批起含课 46 的 Medium 选语言指南（v4.11.17 起含第 21–23 课的 7 张文档 / 文章卡，v4.11.18 起含第 24–25 课的 5 张：CSS-Tricks margin 文档 + W3Schools 参考文档×3 + DigitalOcean 文章，v4.11.19 起含课 29 的 2 张：joshwcomeau 教程文章 + CSS-Tricks 参考文档，v4.11.20 第一批起含课 33 的 W3Schools 字符串方法教程，第二批起含第 34–37 课的 9 张：chrome 文档×6 + 教程文章 / 文章，第三批起含课 38 的 wikiHow 教程与 dev.to 文章，第四批起含课 39 的 onextrapixel 教程与 codinghorror 两篇博客文章，第五批起含第 41 课的 JavaScript Tutorial 六篇教程 + W3Schools 事件参考 + dev.to 回调文章共 8 张，第七批起含课 44 的 JavaScript.info 对象与 MDN 对象基础 2 张）；路径课试点批次 3 起含 World 2 的 CSS-Tricks SVG 属性与 CSS 文档 + Josh Comeau SVG 指南 2 张；v4.11.21 World 2 第二批起含「中级 CSS 概念」前 5 课的 26 张：css-tricks 教程文章 ×3（reset 历史 / 视口单位 / 特异性）+ almanac 伪选择器文档 ×16 + 博客文章 ×2（mattbrictson / Josh Comeau reset）+ web.dev ×2 + 参考文档 ×2（fileinfo / W3Schools）+ Shay Howe 教程文章；World 2 第四批起含表单 3 课的 3 张 C 类教程文章卡：moderncss 自定义复选框样式 + internetingishard 表单教程 + SitePoint 表单与约束校验完全指南；World 2 第五批起含 Grid 批 4 张 C 类文章 / 文档卡：CSS-Tricks Grid 指南（参考文档）+ Chrome DevTools Grid 检查文档（官方文档）+ CSS-Tricks 取代论与 Tuts+ 对比文（教程文章）——W3C Grid 规范卡类型为「规范」走通用兜底不入此计数；World 3 批次 4 起含 javascript 课程 18 张 C 类文章 / 文档卡：dev.to 两篇 + DigitalOcean + JavaScript Tutorial + Wes Bos 两篇 + ayweb + npm 官方文档两篇 + peterxjang + 维基 Minification + webpack 官方四页 + W3Schools JSON 两页 + Medium SOLID 文；阶段 2 起含 16 张 C 类文章 / 文档卡：三大风格指南 + ESLint 文档两页 + Prettier 文档两页 + codacy 与 codeburst 两文 + GFG 回调地狱 + art-of-node + davidwalsh + Giphy 文档两页 + webpack Module Methods；阶段 3 起含 18 张：jest 官方文档 ×4 + gfg 五篇（cartesian / 主存 / 建平衡树 / 插入 / 删除）+ dev.to ×3 + Medium 纯函数文 + doabledanny + sahinarslan + samwho.dev + nodejs.dev Node CLI 文档 + crypto.interactive-maths；阶段 4 起含 Think Like (a) Git 教程站；批次 5 阶段 1 起含 10 张 C 类文章/文档卡：MDN scaleZ 与 scale3d（zh-CN 未译）+ web.dev 渲染性能 + QHMIT rotate3d + desandro perspective + Josh Comeau 四篇 + dzhavat repaint 实录；批次 5 阶段 2 起含 9 张 C 类文章/文档卡：W3C Diverse Abilities 与 tink.uk 两文 + WebAIM 三教程 + WCAG Overview / Orca / Lighthouse / Firefox 无障碍面板四参考文档；批次 5 阶段 3 起含 1 张 C 类文章卡：CSS-Tricks 响应式图片语法指南）；批次 6 阶段 1 起含 5 张 C 类文章卡：Medium 框架生命周期文（受限）/ RisingStack 历史时间线 / freeCodeCamp 框架与库的区别 / GFG 主要优势 / Chrome DevTools React 入门教程文章；批次 6 阶段 2 起含 7 张 C 类文章/文档卡：Academind state 预读 / GFG 调和算法 / Netlify 文档 / Vercel 文档 / Cloudflare Pages 文档 / CF Vite 部署指南 / dmitripavlutin 无限循环文（Vite 静态部署文档为 A 类不入此计数）；批次 6 阶段 3 起 +36 张文章/文档类卡：Testing Library 六页 / Vitest 两页 / React Router 八页 / 三平台部署文档 / LogRocket·CSS-Tricks·MakeUseOf·kentcdodds×3·bholmes·overreacted·robinwieruch×2 各文 / submissions 两源码视图 / c2 词条 / 四仓库页 / styled-components·redux 官方文档 / A 类 react.dev 十页（教程文章与参考文档类型同入此措辞计数）；批次 7 阶段 2 起 +31 张文章/文档类卡（nodejs 课程 C 类文章与文档：MDN 英文区三页、expressjs api 与 guide 区、express-validator 五页、nodejs.org Learn 与 API 区、curriculum 官方安装指南两份、PaaS 三平台文档与 Node 指南、presidentbeef 现役路径文、Team Treehouse / TechTerms / Codecademy / dev.to / freeCodeCamp / LogRocket 等文本条目）；批次 7 阶段 3 起 +25 张文章/文档类卡（nodejs 后六章 C 类：官方文档 19 / 参考文档 2 / 文章 2 / 博客文章 1 / 教程文章 1——文章与文档类型同入此措辞计数）；超长续轮批次 7 阶段 4（2026-09-29，v4.11.36，World 8 求职 14 课、全站 197 课收官） +38（博客文章 26 + 杂志文章 4 + 博客文章（存档）2——Happy Bear 与 Rob.by + 杂志文章（存档）1——HBR 转型文 + 文章 2 + 文档指南 1——Write the Docs + 官方博客文章 1——Hire Beware + 示例文档 1——CareerCup 简历）'));
  assert.equal(archiveCards, 16, check('B1: 「文章（存档）」类型走兜底（共 10 张；v4.11.21 World 2 第二批起含 codyloyd CSS units 存档文——官方即给 web.archive.org 地址；World 3 批次 4 起含 OOP 原则课的 innoarchitech 耦合文存档；阶段 2 起含 API 课的 devfactor 2375 美元亚马逊事故存档——官方给的存档链接原路径有笔误，按 CDX 索引修正后实测可达；阶段 3 起含 3 张：TDD 存档两文（godswillokwara / jrsinclair——官方即给存档地址）与 CMU 链表讲义存档；批次 5 阶段 1 起含 1 张：CSS Triggers 对照表——官方即给 web.archive.org 存档地址；批次 5 阶段 3 起含 1 张：Using Percentages in CSS 存档文——官方即给存档地址）；批次 6 阶段 3 起 +1 张：smashingmagazine Local Storage 2010 经典文（官方原链接 http coding. 子域 404、https 301 到 www 子域现役路径——devfactor 存档先例登记现役地址）；批次 7 阶段 3 起 +2 张：laptrinhx JWT 认证实践指南存档（api-security 课，官方 Markdown 原文给的即 web.archive 存档地址、原站已下线）与 expressjs frameworks 名录存档（conclusion 课，官方即给存档地址、原 resources/frameworks 页已下线）；超长续轮批次 7 阶段 4（2026-09-29，v4.11.36，World 8 求职 14 课、全站 197 课收官） +4（「文章（存档）」类型：Monster 在线声誉 / Career Tool Belt 简历工具 / carlcheo 40 个 CS 概念 / Coding for Interviews 标准库——全部为官方给的 web.archive 存档地址）'));
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
  assert.equal(counts.双按钮中文版, 245, check('B4: 224 张官方中文版卡维持双按钮（v4.11.20 第八批起含课 45 的 MDN eval 中文版（文字不变；v4.11.17 起含课 22 的两篇 MDN 中文版，v4.11.18 起含课 24/25 的两篇 MDN 中文版，v4.11.19 起含课 27/28 的 MDN 中文版，v4.11.20 第一批起含第 31–33 课的 12 张，第二批起含第 34–37 课的 11 张，第三批起含课 38 的 MDN Math.random 与 prompt，第四批起含第 39–40 课的 MDN 循环教程 / Array 与 JavaScript.info 循环 / 数组 / 数组方法共 5 张）；路径课试点批次 3 起含 World 2 第 1 章节 3 课的 A 类 ×6（MDN HTML 元素参考 zh-CN、MDN SVG use / SVG 元素列表 zh-CN、MDN 表格基础 / 进阶 / 行星数据评估 zh-CN）；v4.11.21 World 2 第二批起含「中级 CSS 概念」前 5 课的 A 类 ×18（MDN 单位总览 / length 值 / Web fonts / em 元素 / text-transform / text-shadow / background / border / border-radius / box-shadow / overflow / opacity / 选择器评估 / 组合器 / 伪类与伪元素 / 伪类参考 / 伪元素参考 / 属性选择器，全部 zh-CN 内容级核验）；World 2 第五批起含 Grid 批 A 类 ×2：MDN 基于线的定位与 MDN min-content；World 3 批次 4 起含 javascript 课程 A 类 ×24：MDN zh-CN ×20 + zh.javascript.info ×3 + Todoist 官网中文版；阶段 2 起含 A 类 ×10：MDN zh-CN ×7（表单校验教程 / 约束验证 / form 元素 / 回调术语 / Response / try...catch / import() 运算符）+ zh.javascript.info ×2（promise-basics / async-await）+ zh.wikipedia ECMAScript 条目 ×1；阶段 3 起含 A 类 ×13：MDN zh-CN ×4（Set / Map / MAX_SAFE_INTEGER / throw）+ zh.javascript.info 递归 ×1 + zh.wikipedia ×6（分治法 / 斐波那契数 / 数据结构 / 记忆化 / 鸽巢原理 / 二叉搜索树）+ 可汗学院官方中文版 ×2（描述图 / 表示图）；阶段 4 起含 A 类 ×7：Pro Git 三章中文版（分支的新建与合并 / 变基 / 重置揭密）+ GitHub 合并冲突中文版 + 约定式提交中文版 + 维基海战棋 + React 官方中文文档；批次 5 阶段 1 起含 A 类 ×7：MDN zh-CN ×6（transform-function 总览 / rotate3d / translate3d / 过渡教程 / 动画教程 / @keyframes 参考）+ 维基图形处理器 ×1；批次 5 阶段 2 起含 A 类 ×7：VoiceOver 旁白中文手册 / ChromeVox 中文帮助 / MDN ARIA 实时区域 zh-CN / 中文维基「盲文」/ Chrome 开发者文档三条 ?hl=zh-cn 形态；批次 5 阶段 3 起含 A 类 ×7：Chrome device-mode ?hl=zh-cn + MDN zh-CN ×6（viewport 属性参考 / background-size / background-position / object-fit / 响应式图片教程 / 使用媒体查询；批次 6 阶段 0 起含 Pexels 免费图库——升级 A 类（官方简体中文站 /zh-cn/ 直连实测 200，工具/网站类先例）））；批次 6 阶段 1 起含 A 类 ×15：React 官方中文文档 ×7（createElement / Fragment / 书写 JSX / 使用大括号 / 传递 Props / 条件渲染 / 渲染列表）+ Vite 中文官网 cn.vite.dev ×2（官网与开始指南）+ zh.wikipedia ×3（CDN / 工具链 / Web 应用框架）+ MDN zh-CN ×2（String.prototype.startsWith / Crypto.randomUUID）+ javascript.info 中文版柯里化 ×1；批次 6 阶段 2 起含 A 类 ×12：React 官方中文文档 ×9（State：组件的记忆 / 渲染和提交 / state 如同一张快照 / 选择 State 结构 / 在组件间共享状态 / StrictMode 参考页 / 响应式 Effect 的生命周期 / 你可能不需要 Effect / Component 参考页）+ MDN zh-CN ×2（Object.is / super）+ cn.vite.dev 静态部署指南 ×1；批次 6 阶段 3 起含 A 类 ×10：MDN zh-CN「使用历史记录 API」×1 + React 官方中文文档 ×9（使用 Context 深层传递参数 / 迁移状态逻辑至 Reducer 中 / useReducer / Profiler / React 开发者工具 / memo / useRef / 使用 ref 操作 DOM / React 编译器——zh-hans.react.dev 子域累计 26 条）；超长轮批次 7 阶段 2 +10 张：nodejs.org 中文站站点页 1 / MDN zh-CN 3（First_steps 与 Web_frameworks 与 Status/400）/ expressjs zh-cn guide 区 3（部分翻译、待用户拍板）/ zh.wikipedia 3（localhost、跨站脚本、SQL注入）；超长轮批次 7 阶段 3 +9 张：zh.wikipedia ×5（彩虹表 / 字典攻击 / 密码散列函数 / REST / 威利在哪里）+ simple.wikipedia REST 条对应中文版 ×1 + MDN zh-CN 同源策略 ×1 + expressjs zh-cn advanced 区 ×2（安全最佳实践 2318 汉字 / 性能最佳实践 3806 汉字正文级翻译——比阶段 2 guide 区部分翻译更完整，待用户拍板）；超长续轮批次 7 阶段 4（2026-09-29，v4.11.36，World 8 求职 14 课、全站 197 课收官） +2（leetcode.cn 力扣中文站与 visualgo.net/zh 中文界面——2 条 A 类中文版走双按钮）'));
  assert.equal(counts.观看视频, 88, check('B4: 69 张视频卡按钮为「观看视频 ↗」（World 2 第五批起含 Grid 批 2 张；World 3 批次 4 起含 OOP 原则课 2 张；阶段 2 起含 7 张：异步三部曲与 linting 课的 7 张：Prettier 作者演讲 / WDS Promise 十分钟 / Philip Roberts 事件循环 / Lydia Hallie 两支可视化 / MuleSoft API 三分钟 / Wes Bos dotJS；阶段 3 起含 25 张：测试 2 + Sandi Metz 演讲 + CS 引言 4 + 递归 3 + 项目递归 5 + 常见数据结构 7 + 链表 1 + CS50 哈希表 + BST 构造；阶段 4 起含 1 张：Git Revert vs Git Reset；批次 5 阶段 2 起 +5 张（无障碍章节））；批次 6 阶段 1 起 +1 张：Codevolution index-as-key 反模式；批次 7 阶段 1 起 +1 张：关系型数据库简介视频；批次 7 阶段 2 起 +7 张（nodejs 章 7 支视频）；批次 7 阶段 3 起 +9 张（nodejs 后六章 9 支视频）；超长续轮批次 7 阶段 4（2026-09-29，v4.11.36，World 8 求职 14 课、全站 197 课收官） +1（networking 课 YouTube LinkedIn 求职视频）'));
  assert.equal(counts.前往操作, 6, check('B4: 6 张操作入口卡按钮为「前往操作 ↗」（阶段 2 起含 Visual Crossing 注册页）；批次 6 阶段 2 起 +2 张：Netlify 与 Vercel 项目导入入口（app.netlify.com/start / vercel.com/new）'));
  assert.equal(counts.打开工具, 88, check('B4: 57 张工具 / 网站卡按钮为「打开工具 ↗」（v4.11.16 起含 Allrecipes，v4.11.19 起含 Flexbox Froggy，v4.11.20 起含课 31 的 Live Preview 扩展，第八批起含课 45 的 CalculatorSoup 在线计算器，v4.11.21 起含高级选择器课的 CSS Diner；World 2 第五批起含定位网格元素课的 Grid Garden；World 3 批次 4 起含 javascript 课程 7 张：4 工具 + 3 网站；阶段 2 起含 10 张：ESLint 与 Prettier 官网 / playground / Babel 官网 / VSCode 两扩展 / Visual Crossing 服务页与查询构造器 / Giphy 平台 / jsbin 演示；阶段 3 起含 5 张：Mocha / Jasmine / Tape / Jest 主页与 Merge Sort Visualizer；阶段 4 起含 1 张：battleship-game.org；批次 5 阶段 1 起含 1 张：CSS Stacking Context inspector 扩展；批次 5 阶段 2 起含 4 张（NVDA / Contrast Checker / axe / WAVE）；批次 5 阶段 3 起含 1 张（codyloyd 演示页））；批次 6 阶段 1 起 +2 张：react.new 沙箱 / React Developer Tools 商店扩展；批次 6 阶段 2 起 +6 张：Netlify / Vercel / Cloudflare Pages 三平台主站与产品页 + PokéAPI + heldersrvio 学生演示站 + wojtekmaj 生命周期图；批次 6 阶段 3 起 +7 张：Vitest / FakeStore / Tailwind / MUI / Radix / Chakra / patterns.dev；批次 7 阶段 2 起 +9 张：Postman / Railway / Render / Neon / Aiven / free-for.dev / EJS 官网 / PostgreSQL 官网 / Express 官网主站；批次 7 阶段 3 起 +15 张：Passport.js 官网 / Prisma 产品页 / Prisma VS Code 扩展 / Google Drive / Cloudinary / Heroku / DigitalOcean / GitHub Pages / jamstack.org / Socket.IO / Gravatar / Redis / Learn MongoDB / syntax.fm / Node.js 官方博客；超长续轮批次 7 阶段 4（2026-09-29，v4.11.36，World 8 求职 14 课、全站 197 课收官） +3（BrandYourself / Novorésumé / FlowCV 三个工具；VisuaLgo 为 A 类走双按钮不入此口径）'));
  assert.equal(counts.下载文件, 1, check('B4: 1 张数据文件卡按钮为「下载文件 ↗」'));
  assert.equal(counts.查看素材, 12, check('B4: 12 张素材卡按钮为「查看素材 ↗」（v4.11.19 起含课 30 的三个免费图库；路径课试点批次 3 起含 World 2 的 Material Icons / Feather Icons 两个图标素材库；v4.11.21 起含更多文本样式课的 Font Library / Bunny Fonts / Google Fonts 三个字体库；World 2 第四批起含注册表单项目课的 Unsplash 背景图与 Norse 字体页 2 张；World 2 第五批起含管理仪表盘项目课的 Pictogrammers MDI 图标库；World 4 批次 5 阶段 3 起含 homepage 项目课的 devicon 图标库；批次 6 阶段 0（2026-09-27）Pexels 免费图库升级 A 类后改双按钮、素材单按钮卡 −1——课 30 三个免费图库只剩 Pixabay 与 Unsplash 两张单按钮）'));
  assert.equal(counts.打开英文原文, 475, check('B4: 285 张文本类 / 精译卡按钮保持「打开英文原文 ↗」（兜底；v4.11.20 第九批起含课 46 的 Medium 博客文章v4.11.20 第八批起含课 45 的 StackOverflow 社区讨论v4.11.17 起含第 21–23 课的 10 张无中文版文本卡，v4.11.18 起含第 24–25 课的 6 张：5 张文本类 + 1 张代码仓库视图，v4.11.19 起含课 27 的 W3C 规范卡与课 29 的 3 张：教程文章 + 参考文档 + 代码仓库视图，v4.11.20 第一批起含课 33 的 W3Schools 字符串方法，第二批起含第 34–36 课的 9 张：chrome 文档×6 + 教程文章 / 文章，第三批起含课 38 的 wikiHow 教程与 dev.to 文章，第四批起含课 39 的 reddit 社区讨论与 onextrapixel 教程 / codinghorror 两篇博客共 4 张，第五批起含第 41 课的 8 张 C 类文本卡，第七批起含课 44 的 JavaScript30 仓库视图 1 张；路径课试点批次 3 起含 World 2 的 3 张 C 类文本卡：CSS Cheat Sheet 速查表 + CSS-Tricks SVG 属性与 CSS + Josh Comeau SVG 指南；v4.11.21 World 2 第二批起含 31 张 C 类文本卡：35 条新增减去 CSS Diner（工具）与字体库 ×3（素材）——含文章 / 文档类 26 张、代码片段 ×2、新闻报道 ×1、社区讨论 ×1、存档文 ×1；World 2 第五批起含 Grid 批 5 张 C 类文本卡：CSS-Tricks 指南与取代论 + Chrome DevTools 文档 + Tuts+ 对比文 + W3C Grid 规范；World 3 批次 4 起含 javascript 课程 19 张 C 类文本卡：18 张文章 / 文档 + 1 张存档文；阶段 2 起含 22 张 C 类兜底文本卡：16 张文章 / 文档 + 4 张代码仓库视图（es6features / axios / superagent / Public-APIs）+ 1 张存档文（devfactor 2375 美元事故）+ 1 张官方页面（Visual Crossing 定价）；阶段 3 起含 25 张 C 类兜底文本卡：文本 18 + 存档 3 + 问答 3（Quora / cs.stackexchange / StackOverflow）+ 速查表 1（Big-O cheat sheet）；阶段 4 起含 1 张：Think Like (a) Git 教程站；批次 5 阶段 1 起含 12 张 C 类兜底卡：10 文章/文档 + 1 存档（CSS Triggers）+ 1 代码仓库视图（css-exercises animation 目录）；批次 5 阶段 2 起含 12 张 C 类兜底卡：文章 2 + 教程 3 + 参考文档 4 + 速查表 / 规范 / 社区讨论各 1；批次 5 阶段 3 起含 2 张 C 类兜底卡：percentages 存档文 + CSS-Tricks 指南）；批次 6 阶段 1 起 +5 张 C 类兜底文本卡：Medium 框架生命周期文（受限）/ RisingStack / freeCodeCamp / GFG / Chrome DevTools React 入门；批次 6 阶段 2 起 +8 张 C 类兜底文本卡：Academind / GFG / 三平台文档 / CF 部署指南 / dmitripavlutin 七张文章文档 + react-examples 仓库视图；批次 6 阶段 3 起 +46 张 C 类兜底文本卡（53 条 C 类减 7 张工具/网站卡——工具类走「打开工具」按钮）；超长轮批次 7 阶段 1 起 +9 张（databases 10 条 C 类减 1 张视频卡）；批次 7 阶段 2 起 +54 张（nodejs 70 条 C 类减 7 张视频卡减 9 张工具/网站卡——文章/文档 31 + 通用兜底 23）；批次 7 阶段 3 起 +41 张（nodejs 后六章 65 条 C 类减 9 张视频卡减 15 张工具/网站卡——文章/文档 25 + 存档 2 + 通用兜底 14）；超长续轮批次 7 阶段 4（2026-09-29，v4.11.36，World 8 求职 14 课、全站 197 课收官） +91（97 条新增中 2 条 A 类走双按钮、1 条视频走「观看视频」、3 条工具走「打开工具」，其余 91 条走通用兜底：个人作品集站 17 / 招聘板 9 / 练习平台 8 / 存档 7 / 薪酬数据站 5 / 平台 3 / 在线课程 2 / 文章与文档类 38 / 社区与问答与官方指南与书籍官网与招聘平台等 2）'));
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
    ['command-line-basics', 'dom-manipulation-and-events', 'git-basics', 'intro-to-css', 'links-and-images',
      'node-path-intermediate-html-and-css-form-basics'],
    check('C1: 大课集合由真实数据算出，恰为 6 课（自查题下线后 how-does-the-web-work 掉出，第 21 课 16 章进入；v4.11.18 的第 24 课 8 章 / 第 25 课 9 章均未达 14 章阈值；第五批的第 41 课 14 章恰好达标进入，4 门 → 5 门）'));
  /* 公式一致性：判定与阈值公式逐课等价 */
  for (const l of lessons) {
    const sections = (l.sections || []).length;
    const kc = ((l.official || {}).knowledgeCheck || []).length;
    assert.equal(PROGRESS.Logic.isHeavyLesson(l), sections >= 14 || kc >= 10,
      check(`C1: ${l.id} 的判定与「章≥14 或 自查题≥10」公式一致（自查题恒 0，官方若恢复该节即自动复活）`));
  }
  /* C1b（v4.11.20 发布前 FIX 轮 / 2026-09-25 补位）：heavy-all 成就 desc 的门数必须与大课
   * 集合的真值一致——desc 是成就面板直接显示给学习者的话，写错门数（历史上
   * desc 的门数在大课集合增长后漏改）会误导用户对达成条件的理解。
   * 语义钉在 C1 组（大课集合的事实源），N 从 heavyLessonList(lessons) 现算、
   * 不写死——大课集合变化时 desc 必须跟着改，否则这里先红。
   * 为什么不把「门」加进 stale-claims R2：「门」在别处也有（如「4 门大课」的
   * 历史叙述），放宽 R2 正则会制造假命中；此处用数据源直连的精准断言。 */
  const heavyAllAchievement = PROGRESS.Logic.ACHIEVEMENTS.find(a => a.id === 'heavy-all');
  assert.ok(heavyAllAchievement, check('C1b: heavy-all 成就存在'));
  const doorCountMatch = /当前\s*(\d+)\s*门/.exec(heavyAllAchievement.desc || '');
  assert.ok(doorCountMatch, check('C1b: heavy-all desc 含「当前 N 门」句式（句式变更需同步本断言）'));
  assert.equal(Number(doorCountMatch[1]), heavy.length,
    check(`C1b: heavy-all desc 的门数（${doorCountMatch[1]}）等于大课集合真值（${heavy.length}）`));

  /* N1 负向对照：故意调低阈值 → 集合必须变大（证明不是硬编码 id 清单） */
  const perturbed = loadProgress('progress.js', [
    ['HEAVY_LESSON_MIN_SECTIONS = 14', 'HEAVY_LESSON_MIN_SECTIONS = 12'],
    ['HEAVY_LESSON_MIN_KC = 10', 'HEAVY_LESSON_MIN_KC = 8']
  ]);
  const heavyPerturbed = perturbed.Logic.heavyLessonList(lessons);
  assert.ok(heavyPerturbed.length > heavy.length, check('C1/N1: 阈值调低后大课集合变大（非硬编码）'));
  assert.ok(heavyPerturbed.some(l => l.id === 'html-boilerplate'), check('C1/N1: 章节阈值调到 12 时 html-boilerplate（12 章）进入集合'));
}

/* ===== C2：体量提示（事前）与强化反馈（完课时） ===== */
{
  const heavyPage = mountLesson('command-line-basics');
  const heavyNotices = collectByClass(mainOf(heavyPage), 'notice');
  const scaleNotice = heavyNotices.find(n => textOf(n).includes('本课体量较大'));
  assert.ok(scaleNotice, check('C2: 大课课页渲染体量提示'));
  assert.ok(textOf(scaleNotice).includes('14 章') && !textOf(scaleNotice).includes('自查题'),
    check('C2: 体量提示只讲章节数这一项中性事实（自查题节已下线，不再出现在提示里）'));
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
  assert.ok(notesWith(heavyPage)[0].includes('14 章讲解') && !notesWith(heavyPage)[0].includes('自查题'),
    check('C2: 强化反馈点出体量事实（只讲章节数）'));
  toggleCompleted(lightPage);
  assert.equal(notesWith(lightPage).length, 0, check('C2/N3: 普通课勾选完成没有强化反馈'));
}

/* ===== C3：新成就 + 既有判定零改动 + 存量档案兼容 ===== */
{
  const nowIds = PROGRESS.Logic.ACHIEVEMENTS.map(a => a.id);
  assert.equal(nowIds.length, 67, check('C3: 当前 67 个成就 = 61 既有 + v4.11.3 的 2 个 + v4.11.17 的 unit-4 + v4.11.19 的 unit-5 + v4.11.20 第九批的 unit-6/unit-7（JS Basics 与 Conclusion 收组）'));

  /* 与 history/ 改前备份的对照断言（公开仓内无该备份 → 跳过整段） */
  if (hasOldProgress) {
    const oldIds = OLD_PROGRESS.Logic.ACHIEVEMENTS.map(a => a.id);
    assert.equal(oldIds.length, 61, check('C3: 前提——改前备份里是 61 个成就'));
    assert.deepEqual([...nowIds].sort(), [...new Set([...oldIds, 'heavy-first', 'heavy-all', 'unit-4', 'unit-5', 'unit-6', 'unit-7'])].sort(),
      check('C3: 新增为 heavy-first / heavy-all / unit-4 / unit-5 / unit-6 / unit-7 六个，既有 id 零改动'));

    /* 61 个既有成就的定义逐字段不变（goal / 文案 / 分类 / milestone / hidden）。
     * 两份定义来自不同 vm 上下文（原型不同），用 JSON 序列化对比内容。
     * desc 例外名单（**只放行 desc，其余字段仍逐字段冻结**）：
     *   · v4.11.16 那批（Project: Recipes 开放）：all-lessons / official-all / quiz-all /
     *     unit-3 / started-all（unit-3 的 desc 改「8 课（含 Project: Recipes）」；
     *     started-all 另放行 goal.value 19→20）；
     *   · v4.11.17 本批（第 21–23 课）：上列 5 个再迁移一次（分母 20→23），
     *     并新增 frame-graduate（「完成当前开放的全部课程」那句）与
     *     heavy-first / heavy-all（体量判定只看章节数，desc 去掉自查题口径；分母 3→4）。
     *   · v4.11.18 本批（第 24–25 课）：上列 7 个再迁移一次（分母 23→25），
     *     并新增 unit-4（css-foundations 收组，分母 3→5）。
     * 其余 55 个既有成就保持逐字段零改动。 */
    const DESC_MIGRATED = new Set(['all-lessons', 'official-all', 'quiz-all', 'unit-3', 'unit-4', 'started-all',
      'frame-graduate', 'heavy-first', 'heavy-all']);
    const stripMigrated = a => JSON.stringify(Object.assign({}, a, { desc: null },
      a.id === 'started-all' ? { goal: null } : {}));
    const oldById = new Map(OLD_PROGRESS.Logic.ACHIEVEMENTS.map(a => [a.id, a]));
    for (const a of PROGRESS.Logic.ACHIEVEMENTS) {
      if (!oldById.has(a.id)) continue;
      if (DESC_MIGRATED.has(a.id)) {
        assert.equal(stripMigrated(a), stripMigrated(oldById.get(a.id)),
          check(`C3: 迁移成就 ${a.id} 除 desc${a.id === 'started-all' ? ' / goal' : ''} 外零字段改动`));
        const openCount = lessons.length;
        assert.ok(new RegExp(`(${openCount} 课|8 课|4 门|5 课)`).test(a.desc),
          check(`C3: ${a.id} 的新 desc 写明当前开放数（${openCount} 课 / unit-3 为 8 课 / unit-4 为 5 课）`));
        if (a.id === 'started-all') assert.equal(a.goal.value, openCount, check(`C3: started-all 阈值迁移为 ${openCount}（数值硬编码，漏改会提前解锁）`));
        continue;
      }
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

  /* 解锁判定：完成全部大课 → 两个都解锁；只差一门 → 只解锁第一级（N2 负向对照） */
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
  assert.ok(unlocked4.includes('heavy-first'), check('C3: 完成全部大课解锁「啃下一门大课」'));
  assert.ok(unlocked4.includes('heavy-all'), check('C3: 完成全部大课解锁「大课全数拿下」'));

  const state3 = makeState(heavyIds.slice(0, 2));
  const unlocked3 = PROGRESS.Logic.evaluateAchievements(state3, lessons, NOW, TODAY);
  assert.ok(unlocked3.includes('heavy-first'), check('C3: 完成部分大课解锁「啃下一门大课」'));
  assert.ok(!unlocked3.includes('heavy-all'), check('C3/N2: 只差一门时不解锁「大课全数拿下」'));

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
    for (const [name, completedIds] of [['全部大课', heavyIds], ['部分大课', heavyIds.slice(0, 2)], ['空档案', []]]) {
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
    check('C3: 存量档案（已完成全部大课）按历史状态补发解锁两个新成就'));
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
  assert.ok(homePage.progress.Logic.isHeavyLesson(lessons.find(l => l.id === 'command-line-basics')),
    check('C3: 挂载后的 progress 实例带 isHeavyLesson（供课页判定用）'));
}

console.log(`heavy-lesson.test.cjs: 全部断言通过（${checks} 项检查）`
  + (skippedBlocks.length
    ? `；跳过 ${skippedBlocks.length} 项（未冒充通过）：${skippedBlocks.join('、')}`
    : ''));
