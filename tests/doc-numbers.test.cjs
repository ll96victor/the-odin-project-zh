/* doc-numbers.test.cjs — 文档数字机械断言（v4.11.18 补轮，不升版本）。
 *
 * 为什么需要它（本轮记录的真实事故）：v4.11.18 开放课轮交付后，规划侧验收发现
 * 文档层 4 处陈旧声明——README（能力清单里任务映射规模仍写旧值 46/31，条/道）、
 * EXTERNAL-RESOURCES（Assignment 映射数仍写旧值）、specs（引用的引导语还是
 * v4.11.17 改版前的旧文案；另一行映射数连同已下线的 KC 题数一起陈旧）、
 * PROGRESS-SCHEMA（unit-4 分母解释段与同文件表格自相矛盾）。都不是当轮引入：
 * 3 处是 v4.11.17 自查题下线遗留、1 处是本轮漏改。根因：「四类数字全 .md grep」
 * 收尾纪律类别不全，且 .md 里的数字没有机械保障（stale-claims.test.cjs 刻意
 * 不扫 .md——公开仓不含大部分内部文档）。
 * 本轮摸底又暴露 4 处同族陈旧声明，一并订正：README 单元 Boss 数（旧值 4）、
 * specs 金阶三元组（自测/探索两族仍写旧值 20）、specs 映射数与 KC 题数、
 * EXTERNAL-RESOURCES A 类条数与域名分布表（旧值 24 / MDN 行旧值 8）。
 *
 * 机制（沿用 stale-claims.test.cjs 已验证的模式，不另发明一套）：
 *   1. 事实来源零硬编码：全部从数据文件现算——catalog.js（开放课数）、
 *      lessons.js（课数 / 章数 / 各单元分组课数 / 官方自查题总数）、progress.js
 *      （成就总数 / 大课门数）、diagrams.js（概念图数）、external-resources.js
 *      （资料条数 / A 类 / C 类 / 精译数 / A 类域名分布）、bosses.js（Boss 单元数 /
 *      总题数）、lesson-task-links.js（映射条目数 / 链接数 / KC 映射数）、tiers.js
 *      （循环成就族阈值三元组）；引导语引文用 dom-stub 挂载课页取 .lesson-guide
 *      实渲染文本（与 lesson-reader-fixes.test.cjs D1 同口径）。
 *   2. 模式清单 + 豁免清单：每条模式 → 派生真值；命中但确实正确的（版本沿革句、
 *      变化叙述、历史快照、单元级计数等）逐条登记豁免并注明理由。禁止放宽正则
 *      去躲命中。豁免键 = 规则|文件|形状|数值：形状是命中原文去空白与加粗星号、
 *      数字换 # 后的串。数值进键有两个目的：a) 同形状不同数值不共享豁免（防整片
 *      放行）；b) 本文件自身在 stale-claims.test.cjs 的扫描范围内（它扫
 *      tests/*.test.cjs），键与理由文案里不出现「前缀词+数字+课」式可触发句。
 *   3. 两条自检（stale-claims 已有先例，照搬）：防空转（每条模式至少命中 N 处，
 *      过少说明正则失效或声明被删光，直接红）；死豁免自检（登记了却再也扫不到
 *      的键 → 红，提示删除，防止清单腐化）。
 *   4. 环境兼容：公开仓导出内容只含 README / CONTRIBUTING / SOURCES + tests/——
 *      每份文档扫描前经 fs.existsSync 守卫，不存在就跳过；防空转与死豁免自检只在
 *      FULL_MODE（内部文档齐全）执行；导出目录里只校验「命中的数字必须等于真值
 *      或已登记豁免」，不会因缺文件而红。
 *
 * 扫描范围：根目录现行 *.md。排除：history/、answers/、release/、tasks/（非根级）、
 *   TEST-REPORT.md、PLAN-v2.md、REUSE-NOTES.md（历史记录类，按惯例保持原样）。
 *
 * 至少覆盖本轮暴露的三类盲区（本文件存在的理由）：
 *   - 任务映射数：D1（N 条 M 链接 / KC 映射数 / N 条任务映射）；
 *   - 引导语引用：D11（specs 课页节的引导语引文必须与实渲染文本逐字一致）；
 *   - 同文件内一致性：D10（凡提及 unit-N 的行，其「分母 M」必须与 lessons.js
 *     分组课数一致——PROGRESS-SCHEMA「表格 + 解释段」双处陈述都会被扫到）。
 *
 * 收尾纪律（v4.11.18 补轮起）：每批文档同步后跑本测试，取代人工「四类数字全
 * .md grep」。维护记录里要引用历史数值时，先跑本文件——要么写成不触发模式的
 * 形态（如倒装「任务 46 条」、括号「（旧值 24）」），要么按规则登记豁免。
 *
 * 运行：node tests/doc-numbers.test.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

let checks = 0;
const check = label => { checks += 1; return label; };

const root = path.resolve(__dirname, '..');

/* ---------- 数据文件加载（与 stale-claims.test.cjs 同一口径） ---------- */
const loadRaw = (file, globalName) => {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox);
  return sandbox.window[globalName];
};
const loadData = (file, globalName) => JSON.parse(JSON.stringify(loadRaw(file, globalName)));

/* ===================== 事实来源（零硬编码，全部现算） ===================== */
const CATALOG = loadData('catalog.js', 'ODIN_CATALOG');
const T_AVAIL = CATALOG.lessons.filter(l => l.available).length;          /* 已开放课数 */

const GUIDE = loadData('lessons.js', 'ODIN_GUIDE');
const T_LESSONS = GUIDE.lessons.length;                                    /* 课数 */
const T_CHAPTERS = GUIDE.lessons.reduce((s, l) => s + l.sections.length, 0); /* 总章数 */
const T_KC = GUIDE.lessons.reduce((s, l) => s + l.official.knowledgeCheck.length, 0); /* 官方自查题总数（v4.11.17 起应为 0） */
const GROUP_SIZE = {};                                                     /* lessons.js 分组下标 → 课数（unit-N 成就分母真值） */
GUIDE.lessons.forEach(l => { GROUP_SIZE[l.group] = (GROUP_SIZE[l.group] || 0) + 1; });

/* progress.js 需要函数引用（Logic.heavyLessonList 现算大课门数），不做 JSON 深拷贝 */
const PROGRESS = loadRaw('progress.js', 'ODIN_PROGRESS');
const T_ACH = PROGRESS.ACHIEVEMENTS.length;                                /* 成就总数 */
const T_HEAVY = PROGRESS.Logic.heavyLessonList(GUIDE.lessons).length;      /* 大课门数 */

const DIAGRAMS = loadData('diagrams.js', 'ODIN_DIAGRAMS');
const T_DIAGRAMS = DIAGRAMS.diagrams.length;                               /* 概念图数 */

const RES = loadData('external-resources.js', 'ODIN_RESOURCES');
const T_RES = RES.resources.length;                                        /* 资料条数 */
const T_ZH = RES.resources.filter(r => r.zhUrl).length;                    /* A 类：有已核验官方中文版 */
const T_C = T_RES - T_ZH;                                                  /* C 类：只有本站导读 */
const T_TRANS = RES.resources.filter(r => r.zhTranslation).length;         /* 本站精译数 */
const ZH_DOMAINS = {};                                                     /* A 类中文来源域名分布 */
RES.resources.forEach(r => {
  if (!r.zhUrl) return;
  const host = new URL(r.zhUrl).hostname;
  ZH_DOMAINS[host] = (ZH_DOMAINS[host] || 0) + 1;
});

const BOSSES = loadData('bosses.js', 'ODIN_BOSSES');
const T_BOSS = BOSSES.BOSSES.length;                                       /* Boss 单元数 */
const T_BOSS_Q = BOSSES.BOSSES.reduce((s, b) => s + b.questions.length, 0); /* Boss 总题数 */

const TASK_LINKS = loadData('lesson-task-links.js', 'ODIN_TASK_LINKS');
let T_MAP_ITEMS = 0, T_MAP_URLS = 0, T_KC_MAPS = 0;
Object.values(TASK_LINKS.links).forEach(entry => {
  if (entry.k !== undefined) T_KC_MAPS += 1;
  Object.values(entry.a || {}).forEach(urls => { T_MAP_ITEMS += 1; T_MAP_URLS += urls.length; });
});

const TIERS = loadData('tiers.js', 'ODIN_TIERS');
const TIER_TRIPLE = {};                                                    /* 族 id → [铜, 银, 金] */
TIERS.TIER_FAMILIES.forEach(f => { TIER_TRIPLE[f.id] = f.tiers.map(t => t.value); });
/* 文档里「tiers 金阶 N」的措辞历史上指按课去重两族（自测 / 探索）的金阶，两族金阶必须相等 */
const T_GOLD = TIER_TRIPLE['quiz-lessons'][2];
assert.equal(T_GOLD, TIER_TRIPLE['explore'][2],
  check('前提：quiz-lessons 与 explore 两个按课去重族的金阶相等（否则「金阶 N」措辞没有单一真值，需重设计 D9a）'));

/* ===================== 扫描范围 ===================== */
const EXCLUDED_DOCS = new Set(['TEST-REPORT.md', 'PLAN-v2.md', 'REUSE-NOTES.md']);
const DOCS = fs.readdirSync(root)
  .filter(f => f.endsWith('.md') && !EXCLUDED_DOCS.has(f))
  .filter(f => fs.existsSync(path.join(root, f)));  /* existsSync 守卫：公开仓导出目录缺文件时跳过 */
/* FULL_MODE = 完整仓库（内部文档齐全）。公开仓导出只含 README / CONTRIBUTING / SOURCES，
 * 此时跳过防空转与死豁免自检，只保留「命中必须等于真值或已登记豁免」。 */
const FULL_MODE = ['AGENTS.md', 'MAINTENANCE.md', 'specs.md', 'PROGRESS-SCHEMA.md']
  .every(f => DOCS.includes(f));

const readDoc = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const norm = s => s.replace(/[\s*]/g, '');               /* 去空白与 markdown 加粗星号 */
const shapeOf = raw => norm(raw).replace(/\d+/g, '#');   /* 数字 → # 形状（豁免键的一部分） */

function scanLines(makeRe) {
  const hits = [];
  for (const rel of DOCS) {
    readDoc(rel).split(/\r?\n/).forEach((line, i) => {
      const re = makeRe();
      let m;
      while ((m = re.exec(line))) hits.push({ rel, line: i + 1, raw: m[0], m, text: line.trim() });
    });
  }
  return hits;
}

/* ===================== 豁免清单 =====================
 * 键 = 规则|文件|形状|数值（形状里数字已换 #；数值是文中实际出现的数字）。
 * 每条必须注明「为什么这句陈述是对的」。禁止放宽正则去躲命中。
 * 措辞纪律：键与理由里不得出现「前缀词+数字+课」式触发句——本文件自身在
 * stale-claims.test.cjs 的扫描范围内（它扫 tests/*.test.cjs 的 R2 规则）。 */
const EXEMPT = new Map();
const usedExempt = new Set();
const exempt = (key, reason) => { EXEMPT.set(key, reason); };

/* ---- D1 任务映射数 ---- */
exempt('D1a|CODEx入口说明-odin-foundations-zh.md|#条（#链接|46,54',
  '版本沿革句：描述 v4.11.2 新建映射文件时的规模，历史事实不变');
exempt('D1a|MAINTENANCE.md|#条#链接|51,63',
  '历史轮次记录：v4.11.17 轮测试迁移清单里当时规模的引用（:219）');
exempt('D1a|MAINTENANCE.md|#条#链接|60,73',
  '历史轮次记录：v4.11.18 轮测试迁移清单里当时规模的引用（覆盖率 60/118 时代值）');
exempt('D1a|MAINTENANCE.md|#条#链接|68,84',
  '历史轮次记录：v4.11.20 第一批维护条目里的当时规模（143 条 Assignment 时代值）');
exempt('D1a|MAINTENANCE.md|#条#链接|72,103',
  '历史轮次记录：v4.11.20 第三批维护条目里的当时规模（154 条 Assignment 时代值）');
exempt('D1a|MAINTENANCE.md|#条#链接|75,115',
  '历史轮次记录：v4.11.20 第六批修改句的当时规模（157 条 Assignment 时代值）');
exempt('D1a|MAINTENANCE.md|#条#链接|73,106',
  '历史轮次记录：v4.11.20 第四批维护条目里的当时规模（156 条 Assignment 时代值）');
exempt('D1b|CODEx入口说明-odin-foundations-zh.md|KnowledgeCheck#题|31',
  '版本沿革句：v4.11.2 新建时的 KC 映射规模；v4.11.17 已随官方下线整体移除');

exempt('D3|EXTERNAL-RESOURCES.md|开放第#课|30',
  '历史批次说明块：v4.11.19 第三批开放 Project: Landing Page 的当轮记录，非当前开放计数');
exempt('D3|MAINTENANCE.md|开放第#课|30',
  '历史轮次标题：v4.11.19 第三批维护条目的事件叙述（开放 Project: Landing Page），非当前开放计数');
exempt('D3|project-achievements.md|开放第#课|30',
  '历史成就快照：v4.11.19 第三批补充条目的事件叙述（开放 Project: Landing Page），非当前开放计数');
exempt('D3|AGENTS.md|开放第#课|38',
  '版本沿革句：v4.11.20 第三批开放 Project: Rock Paper Scissors 的当轮记录，非当前开放计数');
exempt('D3|AGENTS.md|开放第#课|43',
  '版本沿革句：v4.11.20 第六批开放 Project: Etch-A-Sketch 的当轮记录，非当前开放计数');
exempt('D3|AGENTS.md|开放第#课|44',
  '版本沿革句：v4.11.20 第七批开放 Object Basics 的当轮记录，非当前开放计数');
exempt('D3|AGENTS.md|开放第#课|45',
  '版本沿革句：v4.11.20 第八批开放 Project: Calculator 的当轮记录，非当前开放计数');
exempt('D3|MAINTENANCE.md|开放第#课|43',
  '历史轮次标题：v4.11.20 第六批维护条目的事件叙述，非当前开放计数');
exempt('D3|MAINTENANCE.md|开放第#课|44',
  '历史轮次标题：v4.11.20 第七批维护条目的事件叙述（开放 Object Basics），非当前开放计数');
exempt('D3|MAINTENANCE.md|开放第#课|45',
  '历史轮次标题：v4.11.20 第八批维护条目的事件叙述（开放 Project: Calculator），非当前开放计数');
exempt('D3|MAINTENANCE.md|开放第#课|38',
  '历史轮次标题：v4.11.20 第三批维护条目的事件叙述（开放 Project: Rock Paper Scissors），非当前开放计数');

/* ---- D2 官方自查题数（现值真值为 0，命中的都是历史记录或阈值陈述） ---- */
exempt('D2|CODEx入口说明-odin-foundations-zh.md|#道官方自查题|96',
  '版本沿革句：v4.11.17 下线时已开放课程的官方自查题总数');
exempt('D2|LESSON-PAGE-GUIDE.md|#道自查题|15',
  '§3.5 设计动机叙述：引用当时 how-does-the-web-work 官方页结构（自查题 15 道 + 任务 22 条）解释标注落点为何在资源区标题下，非现状声明');
exempt('D2|MAINTENANCE.md|#道自查题|96',
  '历史轮次记录：v4.11.17 官方移除的自查题总数（:120/:168）');
exempt('D2|MAINTENANCE.md|#道自查题|15',
  '历史轮次记录：how-does-the-web-work 单课原自查题数（:157/:213）');
exempt('D2|project-achievements.md|#道自查题|10',
  'isHeavyLesson 体量阈值陈述（KC≥10 分支判据），不是计数；阈值公式刻意保留，官方恢复该节即自动复活');

/* ---- D3 已开放课数（真值 T_AVAIL；历史轮次与单元级计数豁免） ---- */
exempt('D3|EXTERNAL-RESOURCES.md|前#课|19',
  'v4.11.1 历史说明：描述改动前的页面状态（:21）');
exempt('D3|MAINTENANCE.md|当前#课|23',
  '历史轮次记录：引用当时待迁移的 app.js 注释文本（:14）与当时欠账值（:69）');
exempt('D3|MAINTENANCE.md|当前#课|19',
  '变更记录：heavy-lesson.test 注释迁移叙述（:256/:303）');
exempt('D3|MAINTENANCE.md|前两处在当前#课|19',
  '变更记录：heavy-lesson.test:110 注释迁移叙述（旧值为 19 课时代值、新值 20，:256/:303）');
exempt('D3|MAINTENANCE.md|当前#课|20',
  '变更记录：同一迁移的目标值，v4.11.16 轮事实（:294/:303）');
exempt('D3|MAINTENANCE.md|本站#课|19',
  '变更记录：bosses.js 头注释迁移叙述（:256/:303）');
exempt('D3|MAINTENANCE.md|本站#课|20',
  '变更记录：同一迁移的目标值，v4.11.16 轮事实（:256/:303）');
exempt('D3|MAINTENANCE.md|前#课|19',
  '历史轮次记录：指纹复核范围与 FAQ 旧文案（:288/:293/:751/:760/:961）');
exempt('D3|MAINTENANCE.md|前#课|20',
  '变更记录：FAQ 与课页文案迁移叙述（:211/:293/:297）');
exempt('D3|MAINTENANCE.md|前#课|23',
  '变更记录：FAQ 迁移目标值，v4.11.17 轮事实（:211）');
exempt('D3|MAINTENANCE.md|开放#课|3',
  '历史轮次记录：v4.11.17 时 css-foundations 单元级状态（:77/:238），非全站开放数');
exempt('D3|MAINTENANCE.md|本站只开放#课|3',
  '历史补记记录：引用当时补进 PROGRESS-SCHEMA 的解释句原文（v4.11.17 轮单元级状态，:77）');
exempt('D3|MAINTENANCE.md|已开放的#课|3',
  '变更记录：v4.11.18 轮 stale-claims R2 豁免键迁移叙述引用的旧键名（:17），单元级计数非全站开放数');
exempt('D3|MAINTENANCE.md|已开放的#课|5',
  '变更记录：同一迁移叙述引用的新键名（:17），unit-4 单元级计数非全站开放数');
exempt('D3|MAINTENANCE.md|已开放+#课|21',
  '「N 已开放 + M 课灰化」式表述：M 是灰化（未开放）课数，正则就近取到——与 stale-claims R2 对 browser-smoke 同形状豁免同一理由（:24）');
exempt('D3|MAINTENANCE.md|开放的#课|21',
  '变更记录：引用 stale-claims R2 豁免迁移叙述里的「未开放的 N 课」措辞（N = 未开放数，:24）');
exempt('D3|NEXT-PHASE.md|本站第#课|7',
  '课号引用：§4-4 环境课处置指回第 07 课 installations 的运行环境选择，非开放计数');
exempt('D3|NEXT-PHASE.md|开放第#课|20',
  '课号引用：§3 批次表 P1 行 answers 实施记录文件名里的 Recipes 开放事件叙述，正则就近取到课号');
exempt('D3|MAINTENANCE.md|已开放的#课|8',
  'v4.11.16 轮记录：引用 unit-3 单元级开放数（含 Recipes 后 8 课），非全站开放数（:283）');
exempt('D3|MAINTENANCE.md|开放课、D#/D#课|2',
  '变更记录：课页文案按课型分支的 D1/D2 引导语迁移叙述（:289），正则跨词取到分支编号');
exempt('D3|MAINTENANCE.md|本站覆盖前#课|19',
  'v4.11.2 轮记录：引用当时三条保留项之一的事实边界文案（:961），该文案此后已随扩课更新');
/* 旧键 D3|project-achievements.md|本站开放#/#课|46 已删：46/46 全开后该历史口径行被
 * 重写，扫描不再命中（死豁免自检逼删）。 */
exempt('D3|SOURCES.md|前）、第#课|20',
  '核验批次划分叙述（:66）：正则跨词取到「第 20 课」课号引用，非开放计数');
exempt('D3|MAINTENANCE.md|前#课|25',
  '历史轮次记录：v4.11.18 轮测试迁移清单里「前 25 课」的当时表述（:77）');
/* 旧键 D3|project-achievements.md|开放#/#课|46 已删：同上，46/46 全开后该行不再命中。 */
exempt('D3|project-achievements.md|本站#课|19',
  '历史叙述：v4.11.17 自查题下线前的全站状态（:447）');
exempt('D3|PROGRESS-SCHEMA.md|当前开放的#课|8',
  '单元级计数：unit-3（HTML Foundations）开放课数，非全站开放数（:278）');
exempt('D3|PROGRESS-SCHEMA.md|当前开放的#课|5',
  '单元级计数：unit-4（CSS Foundations）开放课数，非全站开放数（:279）');
exempt('D3|PROGRESS-SCHEMA.md|开放范围与官方重合（#课|8',
  '单元级计数：unit-3 开放范围与官方重合的课数（:281）');
exempt('D3|SOURCES.md|前#课|19',
  '核验批次划分与历史审计记录（:66/:107）：指首批核验批次覆盖的课范围，非当前开放数');
/* 「开放第 N 课」课号引用族：事件叙述（v4.11.16 轮的标题与行文），不是计数声明——
 * 与 stale-claims R2 豁免清单的「课程序号引用」同一语义类别。逐文件登记。 */
exempt('D3|AGENTS.md|开放第#课|20', '课号引用：「开放第 N 课」事件叙述（v4.11.16），非计数声明');
exempt('D3|CODEx入口说明-odin-foundations-zh.md|开放第#课|20', '课号引用：同上（版本行 v4.11.16 条目）');
exempt('D3|EXTERNAL-RESOURCES.md|开放第#课|20', '课号引用：同上（v4.11.16 说明块标题）');
exempt('D3|MAINTENANCE.md|开放第#课|20', '课号引用：同上（v4.11.16 维护条目标题与行文）');
exempt('D3|project-achievements.md|开放第#课|20', '课号引用：同上（v4.11.16 成就记录标题行文）');

/* ---- D4 概念图数 ---- */
exempt('D4a|AGENTS.md|全站#张|47',
  'v4.11.6 历史记录：当时全站概念图总数（:12）');
exempt('D4a|project-achievements.md|全站概念图#→#张|51',
  '历史成就快照：v4.11.18 轮全站概念图 49→51 迁移叙述（:490），正则取到该轮终点值；现值已 52');
exempt('D4a|project-achievements.md|全站#→#张|51',
  '历史成就快照：v4.11.18 轮 49→51 迁移叙述（:481），正则取到该轮终点值；现值已 52');
exempt('D4a|MAINTENANCE.md|全站#→#张|51',
  '历史轮次记录：v4.11.18 轮 49→51 迁移叙述（:76），正则取到该轮终点值；现值已 52');
exempt('D4a|CODEx入口说明-odin-foundations-zh.md|全站#→#张|51',
  '版本沿革句：v4.11.18 轮 49→51 迁移叙述，正则取到该轮终点值；现值已 52');
exempt('D4a|MAINTENANCE.md|全站#→#张|49',
  '历史变更记录：v4.11.17 轮 47→49 迁移叙述，正则取到该轮新总数（:205）');
exempt('D4a|MAINTENANCE.md|全站#张|47',
  '历史轮次记录：v4.11.6 轮测试迁移描述（:1018）');
exempt('D4a|AGENTS.md|全站铺开：新增#张|33',
  'v4.11.6 历史记录：该轮新生成图数量，正则从「全站铺开」跨词取到（:12）');
exempt('D4a|CODEx入口说明-odin-foundations-zh.md|全站#张|47',
  '版本沿革句：v4.11.6 轮全站概念图总数');
exempt('D4c|CODEx入口说明-odin-foundations-zh.md|#张概念图|2',
  '版本沿革句：当轮新增概念图数（v4.11.17 / v4.11.18 增量），非全站总数');
exempt('D4c|MAINTENANCE.md|#张概念图|1',
  '当轮逐课配图记录：课 24 / 25 各一张（:7），非全站总数');
exempt('D4c|project-achievements.md|#张概念图|49',
  '历史成就快照：v4.11.17 时状态（:471）');
exempt('D4b|project-achievements.md|#张原创|8',
  'v4 时代历史成就记录：当时概念图数（:25）');
exempt('D4c|CODEx入口说明-odin-foundations-zh.md|#张概念图|39',
  '版本沿革句：v4.11.6 发布基线里白名单新增的概念图 SVG 数（生成图口径）');
exempt('D4c|project-achievements.md|#张概念图|8',
  '历史成就记录：v4 时代快照（:66/:125/:161/:208 共用）');
exempt('D4c|project-achievements.md|#张概念图|1',
  '历史成就记录：v4.11.17 轮课 21/22 逐课配一张（:458）');
exempt('D4c|project-achievements.md|#张概念图|2',
  '历史成就记录：v4.11.18 轮新增两张（:481）');
exempt('D4c|SOURCES.md|#张概念图|8',
  '发布准备轮（2026-09-14）视觉资产登记快照：当时手工概念图 8 张，属带日期的历史记录（:159）');
exempt('D4d|MAINTENANCE.md|#张图|49',
  '历史轮次记录：v4.11.17 轮测试迁移清单（:219）');
exempt('D4d|AGENTS.md|#张图|7',
  'v4.11.6 历史记录：该轮补 sectionIndex 归位的存量图数（:12）');
exempt('D4d|MAINTENANCE.md|#张图|72',
  '伙伴位图资产计数（72 张 WebP，:804），另一资产族，非概念图');
exempt('D4d|MAINTENANCE.md|#张图|7',
  '已退役项记录（:880）：World 卡位图从未生成的七张，非概念图');
exempt('D4d|MAINTENANCE.md|#张图|2',
  '配图纪律条款（:1000）：「一课 >2 张图」逐课阈值规则，非全站总数');
exempt('D4d|MAINTENANCE.md|#张图|33',
  '历史回滚指引（:1025）：v4.11.6 批 2 的改动范围描述');
exempt('D4d|project-achievements.md|#张图|47',
  '历史成就记录：v4.11.6 轮全站概念图总数（:340）');

/* ---- D5 外部资料条数 ---- */
exempt('D5a|AGENTS.md|#条外部资料|84',
  'v4.11.1 历史记录：当时清单规模（:12）');
exempt('D5a|CODEx入口说明-odin-foundations-zh.md|#条外部资料|84',
  '版本沿革句：v4.11.1 轮规模');
exempt('D5a|CODEx入口说明-odin-foundations-zh.md|#条外部资料|3',
  '版本沿革句：v4.11.19 轮课 27 的新增条数，非全站总数');
exempt('D5a|CODEx入口说明-odin-foundations-zh.md|#条外部资料|12',
  '版本沿革句：v4.11.17 轮新增条数');
exempt('D5a|MAINTENANCE.md|#条外部资料|1',
  '每课下限语义：引用 content.test「每课至少一条」断言内容（:175），非清单总数');
exempt('D5a|MAINTENANCE.md|#条外部资料|12',
  '历史轮次记录：v4.11.17 轮新增条数（:239）');
exempt('D5a|project-achievements.md|#条外部资料|84',
  '历史成就记录：v4.11.1–v4.11.15 多轮快照（:7/:66/:125/:161/:208）');
exempt('D5a|project-achievements.md|#条外部资料|12',
  '历史成就记录：v4.11.17 轮新增条数（:458）');
exempt('D5a|project-achievements.md|#条外部资料|97',
  '历史成就快照：v4.11.17 时状态（:471）');
exempt('D5a|project-achievements.md|#条外部资料|10',
  '历史成就记录：v4.11.18 轮新增条数（:481）');
exempt('D5e|MAINTENANCE.md|A类#|28',
  '历史补记记录：doc-numbers 补轮表格引用 v4.11.18 的终点值 24→28（:49），现值已 30');
exempt('D5e|EXTERNAL-RESOURCES.md|A类#|28',
  'v4.11.19 变更记录：28→30 迁移叙述，正则取到起点值（:7）');
exempt('D5e|EXTERNAL-RESOURCES.md|A类#|31',
  'v4.11.20 变更记录：31→43 迁移叙述，正则取到起点值（zh.javascript.info 首批入库 7 条 + MDN 新路径 5 条）');
exempt('D5f|EXTERNAL-RESOURCES.md|C类#|87',
  'v4.11.20 变更记录：87→89 迁移叙述，正则取到起点值（Live Preview + W3Schools 两条 C 类）');
exempt('D7a|MAINTENANCE.md|#课/#章|30,277',
  '历史轮次记录：v4.11.19 第三批验证句的当时真值快照');
exempt('D7a|MAINTENANCE.md|#课/#章|33,300',
  '历史轮次记录：v4.11.20 第一批验证句的当时真值快照');
exempt('D7a|MAINTENANCE.md|#课/#章|43,389',
  '历史轮次记录：v4.11.20 第六批验证句的当时真值快照');
exempt('D7a|MAINTENANCE.md|#课/#章|44,396',
  '历史轮次记录：v4.11.20 第七批验证句的当时真值快照');
exempt('D7a|MAINTENANCE.md|#课/#章|45,405',
  '历史轮次记录：v4.11.20 第八批验证句的当时真值快照');
exempt('D7a|MAINTENANCE.md|#课/#章|42,382',
  '历史轮次记录：v4.11.20 第五批验证句的当时真值快照');
exempt('D7a|MAINTENANCE.md|#课/#章|40,361',
  '历史轮次记录：v4.11.20 第四批验证句的当时真值快照');
exempt('D7a|MAINTENANCE.md|#课/#章|38,341',
  '历史轮次记录：v4.11.20 第三批验证句的当时真值快照');
exempt('D7a|MAINTENANCE.md|#课/#章|37,333',
  '历史轮次记录：v4.11.20 第二批验证句的当时真值快照');
exempt('D9a|MAINTENANCE.md|金阶#|30',
  '历史轮次记录：v4.11.19 第三批验证句的当时真值快照');
exempt('D9a|MAINTENANCE.md|金阶#|33',
  '历史轮次记录：v4.11.20 第一批验证句的当时真值快照');
exempt('D9a|MAINTENANCE.md|金阶#|43',
  '历史轮次记录：v4.11.20 第六批验证句的当时真值快照');
exempt('D9a|MAINTENANCE.md|金阶#|44',
  '历史轮次记录：v4.11.20 第七批修改句与验证句的当时真值快照');
exempt('D9a|MAINTENANCE.md|金阶#|45',
  '历史轮次记录：v4.11.20 第八批修改句与验证句的当时真值快照');
exempt('D9a|MAINTENANCE.md|金阶#|42',
  '历史轮次记录：v4.11.20 第五批验证句的当时真值快照');
exempt('D9a|MAINTENANCE.md|金阶#|40',
  '历史轮次记录：v4.11.20 第四批验证句的当时真值快照');
exempt('D9a|MAINTENANCE.md|金阶#|38',
  '历史轮次记录：v4.11.20 第三批验证句的当时真值快照');
exempt('D9a|MAINTENANCE.md|金阶#|37',
  '历史轮次记录：v4.11.20 第二批验证句的当时真值快照');
exempt('D5e|project-achievements.md|A类#|31',
  '历史成就快照：v4.11.19 第二批补充条目记录的当时值，非当前值');
exempt('D5e|MAINTENANCE.md|A类#|11',
  '历史轮次记录：v4.11.20 第二批条目「A 类 11 + C 类 11」是该批四课的增量计数，非全站 A 类总数');
exempt('D5f|MAINTENANCE.md|C类#|11',
  '历史轮次记录：同上行的 C 类增量计数（该批四课 22 条中 C 类 11 条），非全站 C 类总数');
exempt('D5e|EXTERNAL-RESOURCES.md|A类#|26',
  'v4.11.18 变更记录：26→28 迁移叙述，正则取到起点值（:7）');
exempt('D5e|EXTERNAL-RESOURCES.md|A类#|24',
  'v4.11.16 历史说明：「A 类 24 不变」是当时事实（:9）');
exempt('D5f|EXTERNAL-RESOURCES.md|C类#|79',
  'v4.11.19 变更记录：79→80 迁移叙述，正则取到起点值（:7）');
exempt('D5f|EXTERNAL-RESOURCES.md|C类#|71',
  'v4.11.18 变更记录：71→79 迁移叙述，正则取到起点值（:7）');
exempt('D5f|EXTERNAL-RESOURCES.md|C类#|60',
  'v4.11.16 历史说明：60→63 变化叙述，正则取到起点值（:9）');
exempt('D5f|SOURCES.md|C类#|60',
  '首批核验记录（「本轮盘点了官方 19 课……共 84 条」批次范围，:139）：当时批次内 C 类条数，属带日期的历史记录；当前分类计数的事实源在 EXTERNAL-RESOURCES.md 统计表（本测试 D5gC 钉住）');
exempt('D5h|SOURCES.md|#条A类|24',
  '首批核验记录（84 条批次范围，:141）：当时批次内 A 类条数，属带日期的历史记录；当前 A 类计数由 D5gA/D5h 对 EXTERNAL-RESOURCES.md 统计表与域名分布引言钉住');

/* ---- D3c 「N 课中文正文」历史快照（v4.11.20 发布前 FIX 轮登记） ---- */
exempt('D3c|project-achievements.md|#课中文正文|19',
  '历史成就快照：v4.11.1–v4.11.3 轮「19 课中文正文（本轮一字未改）」的当时规模（:125/:161/:208 三行同键）');

/* ---- D6 成就总数 ---- */
exempt('D6b|MAINTENANCE.md|成就总数#|61',
  '变更记录：61→64 迁移叙述（:79），正则取到起点值');
exempt('D6b|MAINTENANCE.md|成就总数#|65',
  '历史轮次记录：批次 8 之前条目引用的当时成就总数（65 个时代值）');
exempt('D6b|project-achievements.md|成就总数#|65',
  '历史成就快照：v4.11.19 第三批补充条目引用的当时成就总数（65 个时代值）');
exempt('D6c|MAINTENANCE.md|这样#个成就|61',
  '历史欠账记录：引用当时 PROGRESS-SCHEMA 的欠账值（:71），补记轮已修正');
exempt('D6d|MAINTENANCE.md|成就#个|63',
  '历史补记记录（:482）：引用当时修正 specs 计数不一致时的正文旧值');
exempt('D6d|MAINTENANCE.md|成就#个|2',
  '历史补记记录（:482）：引用大课体量成就子集叙述');
exempt('D6d|specs.md|成就#个|2',
  '子集计数（:101）：「大课体量成就 2 个」指 heavy-first / heavy-all 两条，非成就总数');

/* ---- D7 课数 / 章数 ---- */
exempt('D7a|project-achievements.md|#课/#章|23,227',
  '历史成就快照：v4.11.17 轮当时规模（:471）');
exempt('D7b|MAINTENANCE.md|共#章|382',
  '历史轮次记录：v4.11.20 第五批修改句的当时总章数');
exempt('D7b|MAINTENANCE.md|共#章|396',
  '历史轮次记录：v4.11.20 第七批修改句的当时总章数');
exempt('D7b|MAINTENANCE.md|共#章|405',
  '历史轮次记录：v4.11.20 第八批修改句的当时总章数');
exempt('D7b|MAINTENANCE.md|共#章|35',
  '历史轮次记录：v4.11.17 新增三课的合计章数（:186），非全站总章数');

/* ---- D8 Boss ---- */
exempt('D8b|MAINTENANCE.md|#个配置了Boss的单元|4',
  '历史补记记录：v4.11.17 轮修订 specs 措辞时的引用（:78），当时 Boss 单元为四个');
exempt('D8c|MAINTENANCE.md|共#题|22',
  '历史补记记录：v4.11.17 时 Boss 总题数（:78）；v4.11.18 新增层叠高塔后为现值');

/* ---- D9 金阶 / 阈值三元组 ---- */
exempt('D9a|AGENTS.md|金阶#|5',
  'v4.11.16 历史迁移清单：「金阶 5/12/20」是当时阈值三元组，正则取到首值（:12）');
exempt('D9a|CODEx入口说明-odin-foundations-zh.md|金阶#|23',
  '版本沿革句：v4.11.18 变化叙述（23→25），正则取到起点值');
exempt('D9a|CODEx入口说明-odin-foundations-zh.md|金阶#|25',
  '版本沿革句：v4.11.19 变化叙述（25→27），正则取到起点值');
exempt('D9a|MAINTENANCE.md|金阶#|23',
  '变更记录：tiers.js 金阶迁移叙述（:14），正则取到起点值');

/* ---- D10 单元成就分母（同文件一致性） ---- */
exempt('D10|PROGRESS-SCHEMA.md|分母#|u4|3',
  '历史沿革：unit-4 新增时（开放第 21–23 课）的分母；:279 表格、:281 解释段、:283 来历段三处「表格+解释段」叙述共用本豁免，现值均为真值');
exempt('D10|MAINTENANCE.md|分母#|u4|3',
  '变更记录：unit-4 desc 分母 3→5 迁移叙述（:14/:22），正则取到起点值');
exempt('D10|MAINTENANCE.md|分母#|u4|23',
  '同一行里的全课程分母变更记录（started-all / quiz-all 等 23→25），因行内含 unit-4 字样被就近取到，非 unit-4 分母（:14）');
exempt('D10|MAINTENANCE.md|分母#|u3|7',
  '变更记录：20 课开放之后 unit-3 分母 7→8 迁移叙述（:297），正则取到起点值');
exempt('D10|project-achievements.md|分母#|u4|3',
  '历史成就记录：3→5 变化叙述与解锁边界说明（:487）');
exempt('D10|PROGRESS-SCHEMA.md|分母#|u403|3',
  '历史沿革（:283）：3→5 变化叙述；同行还提及 unit-0～unit-3，单元串按出现顺序就近取得');
exempt('D10|MAINTENANCE.md|分母因此取#|u4|3',
  '历史补记记录（:77）：引用当时补进 PROGRESS-SCHEMA 的解释句原文');

exempt('D3|MAINTENANCE.md|当前#课|25',
  '变更记录：v4.11.19 轮迁移叙述，正则取到起点值（MAINTENANCE 本轮条目）');
exempt('D3|MAINTENANCE.md|开放前#课|2',
  '变更记录：v4.11.19 轮迁移叙述，正则取到起点值（MAINTENANCE 本轮条目）');
exempt('D9a|MAINTENANCE.md|金阶#|25',
  '变更记录：v4.11.19 轮迁移叙述，正则取到起点值（MAINTENANCE 本轮条目）');
exempt('D3|project-achievements.md|前两课，其中第#课|26',
  '课号引用：「其中第 26 课」指 Introduction to Flexbox 这一课，正则从前文「前」跨词取到，非开放计数（v4.11.19 成就条目）');

exempt('D3|MAINTENANCE.md|前#课|27',
  '历史轮次记录：v4.11.19 批次 1 条目里的当时值（27 课时代），第二批开放后为 29');
exempt('D3|project-achievements.md|开放#课|27',
  '历史轮次记录：v4.11.19 批次 1 条目里的当时值（27 课时代），第二批开放后为 29');
exempt('D4a|CODEx入口说明-odin-foundations-zh.md|全站#→#张|52',
  '版本沿革句：v4.11.19 第一批 51→52 迁移叙述取到终点值；第二批后现值 53');
exempt('D4a|MAINTENANCE.md|全站#→#张|52',
  '历史轮次记录：v4.11.19 第一批的终点值；第二批后现值 53');
exempt('D4a|project-achievements.md|全站#张|52',
  '历史成就快照：v4.11.19 第一批的终点值；第二批后现值 53');
exempt('D5a|CODEx入口说明-odin-foundations-zh.md|#条外部资料|5',
  '当轮增量：v4.11.19 第二批（28–29 课）新增条数，非全站总数');
exempt('D5e|EXTERNAL-RESOURCES.md|A类#|30',
  'v4.11.19 第二批后的历史值豁免（批次 1 条目的当时值）');
exempt('D5e|project-achievements.md|A类#|30',
  'v4.11.19 第二批后的历史值豁免（批次 1 条目的当时值）');
exempt('D5f|EXTERNAL-RESOURCES.md|C类#|80',
  'v4.11.19 第二批后的历史值豁免（批次 1 条目的当时值）');
exempt('D9a|MAINTENANCE.md|金阶#|27',
  '变更记录：v4.11.19 第二批迁移叙述，正则取到起点值（MAINTENANCE 本轮条目）');
exempt('D10|MAINTENANCE.md|分母#|u5|27',
  '变更记录：v4.11.19 第二批「started-all 阈值 27→29」迁移叙述的起点值 27 与行内 unit-5 字样就近碰撞，非 unit-5 分母声明（flexbox 组现 4 课）');
exempt('D5f|EXTERNAL-RESOURCES.md|C类#|84',
  '变更记录：v4.11.19 第三批迁移叙述的起点值（批次 2 条目或本轮条目内的历史值）');
exempt('D6b|MAINTENANCE.md|成就总数#|64',
  '变更记录：v4.11.19 第三批迁移叙述的起点值（批次 2 条目或本轮条目内的历史值）');
exempt('D6b|CODEx入口说明-odin-foundations-zh.md|成就总数#|64',
  '版本沿革句：v4.11.19 第三批变化叙述（成就总数 64→65），正则取到起点值');

exempt('D6d|project-achievements.md|成就#个|64',
  '历史成就快照：v4.11.17 轮当时状态（23 课时代值，:471）');

/* 旧键 D10|u54|3 已删：行 11 措辞随第九批重写后旧命中消失（新键 u6754|3 已登记）。 */
exempt('D10|CODEx入口说明-odin-foundations-zh.md|分母#|u6754|3',
  '变更记录：v4.11.18 条目「unit-4 成就分母 3→5」的历史迁移叙述起点值；行 11 同行含第九批新句的 unit-6/unit-7 引用属就近碰撞，均非当前态分母声明');
exempt('D9a|MAINTENANCE.md|金阶#|29',
  '变更记录：v4.11.19 第三批金阶 29→30 迁移叙述，正则取到起点值');
/* ---- D13 大课门数 ---- */
exempt('D13|AGENTS.md|#门|2',
  'v4.11.8 历史记录：长课章节导航覆盖数此前误记为两门的订正叙述，非大课集合门数（:12）');
exempt('D13|CODEx入口说明-odin-foundations-zh.md|#门|4',
  '版本沿革句：第五批第 41 课（14 章达大课阈值）开放后大课门数才升到 5，此为之前的当时值');
exempt('D13|CODEx入口说明-odin-foundations-zh.md|#门|2',
  '版本沿革句：v4.11.8 条目里同一订正叙述');
exempt('D13|project-achievements.md|#门|4',
  '历史成就记录（:468）：v4.11.17 轮的当时真值（第 41 课开放后变 5）');
exempt('D13|MAINTENANCE.md|#门|3',
  '历史变更记录（:170）：v4.11.17 自查题下线使大课集合短暂收为三门，同轮第 21 课进入后恢复');
exempt('D13|AGENTS.md|#门|4',
  '历史版本行（:12）：v4.11.16 交付记录里的大课门数当时值，第 41 课开放（第五批）前的真值');
exempt('D13|MAINTENANCE.md|#门|4',
  '历史轮次记录：第五批前各维护条目里的大课门数当时值（第 41 课 14 章达标后变 5）');

/* ===================== 通用判定 ===================== */
function resolveKey(rule, key, hit, nums, truth) {
  const ok = nums.length === truth.length && nums.every((n, i) => n === truth[i]);
  if (ok) return false;
  assert.ok(EXEMPT.has(key),
    check(`${rule}: ${hit.rel}:${hit.line} 应为 ${truth.join('/')}，实为 ${nums.join('/')}——要么改文档，要么登记豁免并注明理由（键 ${key}；语境：${hit.text.slice(0, 60)}）`));
  usedExempt.add(key);
  return true;
}
function resolve(rule, hit, nums, truth) {
  return resolveKey(rule, `${rule}|${hit.rel}|${shapeOf(hit.raw)}|${nums.join(',')}`, hit, nums, truth);
}
function runRule(rule, label, makeRe, truth, minHits, numGroups = [1]) {
  const hits = scanLines(makeRe);
  if (FULL_MODE) assert.ok(hits.length >= minHits,
    check(`${rule} 防空转（${label}）：命中 ${hits.length} 处 ≥ ${minHits}（过少说明正则失效或声明被删光）`));
  let ex = 0;
  for (const hit of hits) if (resolve(rule, hit, numGroups.map(g => Number(hit.m[g])), truth)) ex += 1;
  console.log(`  ${rule} ${label}：命中 ${hits.length} 处，豁免 ${ex} 处（真值 ${truth.join('/')}）`);
}

/* ===================== D1 · 任务映射数（盲区一） ===================== */
runRule('D1a', '映射规模 N 条 M 链接', () => /(\d+)\s*条\s*[（(]?\s*(\d+)\s*链接/g,
  [T_MAP_ITEMS, T_MAP_URLS], 3, [1, 2]);
runRule('D1b', 'KC 映射数（v4.11.17 起应为 0）', () => /(?:KC|Knowledge\s+Check)\s*(\d+)\s*题/g,
  [T_KC_MAPS], 1);
runRule('D1c', '任务映射条数', () => /(\d+)\s*条任务映射/g, [T_MAP_ITEMS], 1);

/* ===================== D2 · 官方自查题数（现值 0） ===================== */
runRule('D2', '官方自查题数', () => /(\d+)\s*[道条]\s*(?:官方)?自查题/g, [T_KC], 4);

/* ===================== D3 · 已开放课数（.md 侧，stale-claims R2 的文档补位） =====================
 * 前缀词与「课」字拆成常量拼装：本文件在 stale-claims.test.cjs 的扫描范围内，
 * 拼装可避免模式定义行自身构成字面触发句（结构性规避，非放宽断言）。
 * 数字两侧卡死（同 stale-claims R2）：范围式「第 21–23 课」被环视排除。
 * 间隔排除句号：计数声明不跨句——「……全组开放。其余 N 课……」式跨句就近取数
 * 属于语义错配（那是未开放数），在间隔层就排除，比逐条豁免更准确。 */
const P_OPEN_PREFIX = '(当前|本站|已开放|开放|前)';
const P_WORD_LESSON = '课';
const RE_OPEN_COUNT = () => new RegExp(
  P_OPEN_PREFIX + '[^。\\n]{0,8}?(?<![\\d–—-])(\\d+)(?!\\s*[–—-])\\*{0,2}\\s*' + P_WORD_LESSON, 'g');
runRule('D3', '已开放课数', RE_OPEN_COUNT, [T_AVAIL], 20, [2]);

/* ===================== D3b · 未开放课数（「余 N 课」句式，v4.11.18 收尾轮补位） =====================
 * 缺口成因：D3 前缀白名单不含「剩余」，NEXT-PHASE 三处该句式的陈旧数值（官方总数
 * 减已开放数的旧值）完全逃过扫描——补位轮实测含 27 的行命中数为 0。
 * 机制要点：本句式真值与 D3 **不同向**（D3 真值 = 已开放数；本句式真值 = 官方总课数
 * 减已开放数，未开放数）。因此独立成规则并各自现算真值，而不是把「剩余」塞进
 * P_OPEN_PREFIX——那样每条正确陈述都得靠豁免放行，规则就失去了防陈旧能力。
 * 前缀词与「课」字拆常量拼装（同 D3）：避免模式定义行自身构成 stale-claims R2
 * 的触发句（结构性规避，非放宽断言）。数字两侧卡死与 D3 同款（排除两端夹数字
 * 的未开放范围式声明）。 */
const P_REMAIN_PREFIX = '剩' + '余';
const T_REMAIN = CATALOG.lessons.length - T_AVAIL;   /* 未开放课数（官方总课数现算减已开放数） */
const RE_REMAIN_COUNT = () => new RegExp(
  P_REMAIN_PREFIX + '[^。\\n]{0,6}?(?<![\\d–—-])(\\d+)(?!\\s*[–—-])\\*{0,2}\\s*' + P_WORD_LESSON, 'g');
/* v4.11.20 第九批（46/46 全开）：T_REMAIN = 0，且「剩余 N 课」句式在文档中已全部
 * 改写为收口表述——本规则从「防空转 ≥3」转为「正向零命中」：任何「余 N 课」
 * 声明都是陈旧的（minHits 降 0；若未来扩展新课出现未开放课，先复核再恢复阈值）。 */
runRule('D3b', '未开放课数（余量句式）', RE_REMAIN_COUNT, [T_REMAIN], 0, [1]);

/* ===================== D3c · 已开放课数·「N 课中文正文」句式（v4.11.20 发布前 FIX 轮补位） =====================
 * 缺口成因：D3 前缀白名单（当前|本站|已开放|开放|前）不含无前缀词的
 * 「N 课中文正文」形态——AGENTS.md 两处「30 课中文正文」在 46 课全开后漏网。
 * 实测（2026-09-25）：泛化成「任意 N 课」会命中 453 处（几乎全是历史叙述与
 * 课号引用），断言将被豁免淹没；收紧为本句式 + 「(?<!第\s?)」排除课号引用
 * （「第 20 课中文正文」指单课不是计数）后仅 6 处命中：2 处真陈旧（本轮已修）
 * + 3 处历史快照（project-achievements 19 课时代值；TEST-REPORT 的同类句在
 * EXCLUDED_DOCS 排除清单内不扫描）。豁免 1 条键换来对「事实源描述行」的常态守护——
 * 符合「精准咬人优先于覆盖广」的判据。 */
const P_BODY_WORD = '课中文' + '正文';   /* 拆装避免模式定义行自身命中 */
runRule('D3c', '已开放课数·中文正文句式',
  () => new RegExp('(?<!第\\s?)(?<![\\d–—-])(\\d+)\\s*' + P_BODY_WORD, 'g'),
  [T_AVAIL], 2);

/* ===================== D4 · 概念图数 ===================== */
runRule('D4a', '全站 N 张', () => /全站[^。\n]{0,12}?(\d+)\s*\*{0,2}\s*张/g, [T_DIAGRAMS], 3);
runRule('D4b', 'N 张原创', () => /(\d+)\s*张原创/g, [T_DIAGRAMS], 2);
runRule('D4c', 'N 张概念图', () => /(\d+)\s*张概念图/g, [T_DIAGRAMS], 2);
runRule('D4d', 'N 张图', () => /(\d+)\s*张图/g, [T_DIAGRAMS], 1);

/* ===================== D5 · 外部资料条数 ===================== */
runRule('D5a', 'N 条外部资料', () => /(\d+)\s*条外部资料/g, [T_RES], 8);
runRule('D5b', 'N 条官方中文版', () => /(\d+)\s*条官方中文版/g, [T_ZH], 1);
runRule('D5c', 'N 条本站导读', () => /(\d+)\s*条本站导读/g, [T_C], 1);
runRule('D5d', 'N 条（文本）来源（精译）', () => /(\d+)\s*条[^。\n]{0,6}来源/g, [T_TRANS], 2);
runRule('D5e', 'A 类 N', () => /A\s*类\s*(\d+)/g, [T_ZH], 2);
runRule('D5f', 'C 类 N', () => /C\s*类\s*(\d+)/g, [T_C], 2);
runRule('D5gA', 'A 类统计表行', () => /^\|\s*A\s*类[^|\n]*\|\s*(\d+)\s*\|/g, [T_ZH], 1);
runRule('D5gC', 'C 类统计表行', () => /^\|\s*C\s*类[^|\n]*\|\s*(\d+)\s*\|/g, [T_C], 1);
runRule('D5h', 'N 条 A 类（域名分布引言）', () => /(\d+)\s*条\s*A\s*类/g, [T_ZH], 1);
/* D5i：A 类域名分布表逐行核对——每个 zhUrl 域名必须在表内有条目且条数与数据一致 */
if (DOCS.includes('EXTERNAL-RESOURCES.md')) {
  const docText = readDoc('EXTERNAL-RESOURCES.md');
  const domains = Object.keys(ZH_DOMAINS);
  if (FULL_MODE) assert.ok(domains.length >= 5,
    check(`D5i 防空转：A 类域名数 ${domains.length} ≥ 5（过少说明 zhUrl 解析失效）`));
  for (const d of domains) {
    const re = new RegExp('^\\|\\s*`' + d.replace(/\./g, '\\.') + '`\\s*\\|\\s*(\\d+)\\s*\\|', 'm');
    const m = re.exec(docText);
    assert.ok(m,
      check(`D5i: EXTERNAL-RESOURCES.md 的 A 类域名分布表必须有 ${d} 行（数据现算 ${ZH_DOMAINS[d]} 条）`));
    assert.equal(Number(m[1]), ZH_DOMAINS[d],
      check(`D5i: ${d} 行条数应为 ${ZH_DOMAINS[d]}，实为 ${m[1]}（必须与 external-resources.js 的 zhUrl 域名分布一致）`));
  }
  console.log(`  D5i A 类域名分布表：${domains.length} 个域名逐行与数据一致`);
}

/* ===================== D6 · 成就总数 ===================== */
runRule('D6a', 'N 个一次性成就', () => /(\d+)\s*个一次性成就/g, [T_ACH], 1);
runRule('D6b', '成就总数 N', () => /成就总数\s*(\d+)/g, [T_ACH], 2);
runRule('D6c', '这样 N 个成就', () => /这样\s*(\d+)\s*个成就/g, [T_ACH], 1);
runRule('D6d', '成就 N 个', () => /成就\s*\*{0,2}\s*(\d+)\s*\*{0,2}\s*个/g, [T_ACH], 1);

/* ===================== D7 · 课数 / 章数配对与总章数 ===================== */
runRule('D7a', 'N 课 / M 章', () => /(\d+)\s*课\s*[/／]\s*(\d+)\s*章/g,
  [T_LESSONS, T_CHAPTERS], 1, [1, 2]);
runRule('D7b', '共 N 章', () => /共\s*(\d+)\s*章/g, [T_CHAPTERS], 1);

/* ===================== D8 · Boss 单元数与总题数 ===================== */
runRule('D8a', 'N 个单元 Boss', () => /(\d+)\s*个单元\s*Boss/g, [T_BOSS], 1);
runRule('D8b', 'N 个配置了 Boss 的单元', () => /(\d+)\s*个配置了\s*Boss\s*的单元/g, [T_BOSS], 2);
runRule('D8c', 'Boss 总题数（共 N 题）', () => /共\s*(\d+)\s*题/g, [T_BOSS_Q], 2);

/* ===================== D9 · tiers 金阶与阈值三元组 ===================== */
runRule('D9a', 'tiers 金阶 N', () => /金阶\s*(\d+)/g, [T_GOLD], 2);
/* D9b：阈值表行「| `family-id` | 指标 | a / b / c |」——族 id 清单来自 tiers.js */
{
  const hits = [];
  for (const rel of DOCS) {
    readDoc(rel).split(/\r?\n/).forEach((line, i) => {
      const m = /^\|\s*`([a-z][a-z-]*)`\s*\|[^|\n]*\|\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)/.exec(line);
      if (m && TIER_TRIPLE[m[1]]) {
        hits.push({ rel, line: i + 1, raw: m[0], m, text: line.trim(), id: m[1], nums: [Number(m[2]), Number(m[3]), Number(m[4])] });
      }
    });
  }
  if (FULL_MODE) assert.ok(hits.length >= 6,
    check(`D9b 防空转：阈值表行命中 ${hits.length} ≥ 6（过少说明表结构变了或正则失效）`));
  let ex = 0;
  for (const hit of hits) {
    if (resolveKey('D9b', `D9b|${hit.rel}|阈值表|${hit.id}|${hit.nums.join(',')}`, hit, hit.nums, TIER_TRIPLE[hit.id])) ex += 1;
  }
  console.log(`  D9b 阈值表行：命中 ${hits.length} 处，豁免 ${ex} 处（真值来自 tiers.js TIER_FAMILIES）`);
}
/* D9c：行内昵称三元组「自测课程 5/12/25」——昵称→族 id 是解释层映射，阈值真值仍来自 tiers.js */
{
  const TIER_NICK = { '学习日': 'study-days', '每日目标': 'goal-days', '自测课程': 'quiz-lessons', '探索课程': 'explore', '复习次数': 'review-actions' };
  const hits = scanLines(() => /(学习日|每日目标|自测课程|探索课程|复习次数)\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)/g);
  if (FULL_MODE) assert.ok(hits.length >= 4,
    check(`D9c 防空转：昵称三元组命中 ${hits.length} ≥ 4（过少说明正则失效）`));
  let ex = 0;
  for (const hit of hits) {
    const nums = [Number(hit.m[2]), Number(hit.m[3]), Number(hit.m[4])];
    if (resolve(`D9c/${hit.m[1]}`, hit, nums, TIER_TRIPLE[TIER_NICK[hit.m[1]]])) ex += 1;
  }
  console.log(`  D9c 昵称阈值三元组：命中 ${hits.length} 处，豁免 ${ex} 处`);
}
runRule('D9d', 'Boss 族行内三元组', () => /Boss（通过\s*(\d+)\s*\/\s*高评价\s*(\d+)\s*\/\s*高评价\s*(\d+)）/g,
  TIER_TRIPLE['boss'], 1, [1, 2, 3]);

/* ===================== D10 · 单元成就分母（盲区三：同文件内一致性） =====================
 * 凡行内提及 unit-N，该行所有「分母 M」都必须等于 lessons.js 里该分组的课数。
 * PROGRESS-SCHEMA 的表格行与解释段因此都会被扫到——:281 解释段写旧值即红。 */
{
  const hits = [];
  for (const rel of DOCS) {
    readDoc(rel).split(/\r?\n/).forEach((line, i) => {
      const ure = /unit-(\d)/g;
      const units = [];
      let u;
      while ((u = ure.exec(line))) if (!units.includes(Number(u[1]))) units.push(Number(u[1]));
      if (!units.length) return;
      const re = /分母[^0-9]{0,6}?(\d+)/g;
      let m;
      while ((m = re.exec(line))) hits.push({ rel, line: i + 1, raw: m[0], m, units, text: line.trim() });
    });
  }
  if (FULL_MODE) assert.ok(hits.length >= 5,
    check(`D10 防空转：分母声明命中 ${hits.length} ≥ 5（过少说明正则失效）`));
  let ex = 0;
  for (const hit of hits) {
    const n = Number(hit.m[1]);
    if (hit.units.some(u => GROUP_SIZE[u] === n)) continue;
    const key = `D10|${hit.rel}|${shapeOf(hit.raw)}|u${hit.units.join('')}|${n}`;
    assert.ok(EXEMPT.has(key),
      check(`D10: ${hit.rel}:${hit.line} 分母 ${n} 与行内 unit-${hit.units.join('/unit-')} 的分组课数（${hit.units.map(u => GROUP_SIZE[u]).join('/')}）不符——要么改文档，要么登记豁免（键 ${key}；语境：${hit.text.slice(0, 60)}）`));
    usedExempt.add(key);
    ex += 1;
  }
  console.log(`  D10 单元成就分母：命中 ${hits.length} 处，豁免 ${ex} 处（真值来自 lessons.js 分组课数 ${JSON.stringify(GROUP_SIZE)}）`);
}

/* ===================== D11 · 引导语引用（盲区二：与实渲染一致） =====================
 * specs.md 课页节引用的 section-why 引导语必须与实渲染文本逐字一致。
 * 真值用 dom-stub 在 Node 里挂载课页读取（与 lesson-reader-fixes.test.cjs 同路径）。
 * href 只是 dom-stub 的 location 解析字符串（与 lesson-reader-fixes 同一惯例）：
 * 全程零网络请求、不起服务，不触碰任何真实端口。 */
{
  const { newPage, makeStorage, collectByClass, querySelect } = require('./dom-stub.cjs');
  const resLesson = GUIDE.lessons.find(l => RES.resources.some(r => r.lessonId === l.id));
  assert.ok(resLesson, check('D11 防空转：存在带外部资料的课（引导语取该分支的实渲染文本）'));
  const page = newPage({
    storage: makeStorage(), page: 'lesson', search: `?id=${resLesson.id}`,
    href: `http://127.0.0.1:8765/lesson.html?id=${resLesson.id}`
  });
  const main = querySelect(page.dom.body, '#main');
  const why = collectByClass(main, 'section-why')[0];
  assert.ok(why, check(`D11 防空转：${resLesson.id} 课页渲染出 section-why`));
  const guides = collectByClass(why, 'lesson-guide');
  assert.equal(guides.length, 1, check('D11 防空转：section-why 内恰渲染 1 个 lesson-guide'));
  const GUIDE_WHY = guides[0].textContent;
  assert.ok(GUIDE_WHY.includes('中文辅助') && GUIDE_WHY.length > 50,
    check('D11 防空转：引导语为含「中文辅助」的完整长句（实渲染文本，非空壳）'));
  if (DOCS.includes('specs.md')) {
    assert.ok(readDoc('specs.md').includes(GUIDE_WHY),
      check('D11: specs.md 课页节的引导语引文必须与 .lesson-guide 实渲染文本逐字一致（v4.11.17 改版口径；改 app.js 引导语必须同步 specs 引文）'));
  }
  console.log(`  D11 引导语引用：实渲染 ${GUIDE_WHY.length} 字，specs.md ${DOCS.includes('specs.md') ? '引文逐字一致' : '不在扫描范围（导出模式，跳过引文核对）'}`);
}

/* ===================== D13 · 大课门数 =====================
 * 含「大课 / heavy」的行里出现的「N 门」必须等于 isHeavyLesson 现算门数。 */
{
  const hits = [];
  for (const rel of DOCS) {
    readDoc(rel).split(/\r?\n/).forEach((line, i) => {
      if (!/大课|heavy/i.test(line)) return;
      const re = /(\d+)\s*门/g;
      let m;
      while ((m = re.exec(line))) hits.push({ rel, line: i + 1, raw: m[0], m, text: line.trim() });
    });
  }
  if (FULL_MODE) assert.ok(hits.length >= 2,
    check(`D13 防空转：大课门数命中 ${hits.length} ≥ 2（过少说明正则失效）`));
  let ex = 0;
  for (const hit of hits) if (resolve('D13', hit, [Number(hit.m[1])], [T_HEAVY])) ex += 1;
  console.log(`  D13 大课门数：命中 ${hits.length} 处，豁免 ${ex} 处（真值 ${T_HEAVY}）`);
}

/* ===================== 死豁免自检 ===================== */
if (FULL_MODE) {
  for (const key of EXEMPT.keys()) {
    assert.ok(usedExempt.has(key),
      check(`死豁免「${key}」：已扫不到该命中，请从豁免清单删除（原理由：${EXEMPT.get(key)}）`));
  }
  console.log(`  死豁免自检：${EXEMPT.size} 条豁免全部命中`);
}

console.log(`doc-numbers.test.cjs：全部 ${checks} 项断言通过 ✔（FULL_MODE=${FULL_MODE}；扫描 ${DOCS.length} 份文档；真值：开放 ${T_AVAIL} 课 / ${T_CHAPTERS} 章 / 成就 ${T_ACH} / 图 ${T_DIAGRAMS} / 资料 ${T_RES}（A ${T_ZH} / C ${T_C} / 精译 ${T_TRANS}）/ Boss ${T_BOSS} 单元 ${T_BOSS_Q} 题 / 映射 ${T_MAP_ITEMS} 条 ${T_MAP_URLS} 链接 / 金阶 ${T_GOLD} / 大课 ${T_HEAVY} 门）`);
