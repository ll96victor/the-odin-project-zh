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
 * 历史区区段排除（B+ 轮阶段 1 增，2026-09-29 豁免瘦身）：MAINTENANCE.md（变更历史
 *   账本）与 project-achievements.md（版本演进史）按**显式标记**区段排除——「doc-numbers:
 *   历史区起点」标记行起（含标记行）全部跳过，标记之前的现状区照旧全量扫描；文件存在
 *   但标记缺失 → 断言失败（不得静默降级）。合法排除三判据与红线见 HISTORY_MARKER
 *   常量处注释。此机制取代了此前两文件内逐键登记的三百余条历史快照豁免。
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

/* ===================== 事实来源（零硬编码，全部现算） =====================
 * 路径课试点批次 3（2026-09-25）：开放数与课数真值走汇总层——lessons.js +
 * courses/*.js + lesson-sources.js 与 HTML 同序装载（lesson-sources 会把路径课
 * 并入 ODIN_GUIDE）。T_AVAIL 从合并后课程数现算（lessons.js 红线：未开放课的
 * 正文不进 lessons.js，故合并层总数即全站开放数），与 stale-claims R2 同口径。
 * T_REMAIN 保持 Foundations 目录口径（catalog available 已 46/46，恒 0）。 */
const CATALOG = loadData('catalog.js', 'ODIN_CATALOG');

const GUIDE = (() => {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'lessons.js'), 'utf8'), sandbox, { filename: 'lessons.js' });
  const coursesDir = path.join(root, 'courses');
  for (const f of fs.readdirSync(coursesDir).filter(f => f.endsWith('.js')).sort()) {
    vm.runInNewContext(fs.readFileSync(path.join(coursesDir, f), 'utf8'), sandbox, { filename: 'courses/' + f });
  }
  vm.runInNewContext(fs.readFileSync(path.join(root, 'lesson-sources.js'), 'utf8'), sandbox, { filename: 'lesson-sources.js' });
  return JSON.parse(JSON.stringify(sandbox.window.ODIN_GUIDE));
})();
const T_AVAIL = GUIDE.lessons.length;                                     /* 全站已开放课数（Foundations + 路径课） */
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

/* ===================== 资产族真值（v4.11.20 后 FIX 批次 0-B 新增） ===================== */
/* 加载顺序与 HTML 一致：companions.js 先于 companion-registry.js——且必须同一 sandbox
 * 顺序执行（registry 组装依赖 window.ODIN_COMPANIONS 的 legacy 清单；loadRaw 每次新
 * sandbox，分开加载 registry 只会拿到 fallback 的 14 项而非 28 项——D14 真值实测踩过） */
const companionSandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'companions.js'), 'utf8'), companionSandbox, { filename: 'companions.js' });
vm.runInNewContext(fs.readFileSync(path.join(root, 'companion-registry.js'), 'utf8'), companionSandbox, { filename: 'companion-registry.js' });
const REGISTRY = companionSandbox.window.ODIN_COMPANION_REGISTRY;
const AVATARS = loadData('avatars.js', 'ODIN_AVATARS');
const THEMES = loadRaw('themes.js', 'ODIN_THEMES');
const readyC = item => item && (item.render.engine === 'procedural' || item.render.engine === 'inline' || (item.render.engine === 'fixedArt' && item.art && item.art.status === 'ready'));
const notRetired = (item, ids) => !ids.includes(item.id);
const T_AVATAR_DATA = AVATARS.avatars.length;                          /* avatars.js 数据总数（含退役 terminal） */
const T_AVATAR_PANEL_GEO = AVATARS.avatars.filter(x => !REGISTRY.retiredAvatarIds.includes(x.id)).length;  /* 面板几何口径 */
const T_COMPANION_AVATAR = REGISTRY.companions.filter(x => readyC(x) && !REGISTRY.retiredIds.includes(x.id)).length; /* 伙伴形象头像口径 */
const T_PANEL_TOTAL = T_AVATAR_PANEL_GEO + T_COMPANION_AVATAR;         /* 面板格子总数 */
const T_THEMES = Array.isArray(THEMES) ? THEMES.length : (THEMES.themes ? THEMES.themes.length : Object.keys(THEMES).length);
const DIAGRAM_LESSONS = new Set(DIAGRAMS.diagrams.map(d => d.lessonId));
const T_KNOWLEDGE_WITH_DIAGRAM = GUIDE.lessons.filter(l => !/Project/i.test(l.title) && DIAGRAM_LESSONS.has(l.id)).length; /* 有图知识课数 */
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

/* ===================== 历史区显式标记（B+ 轮阶段 1，2026-09-29 豁免瘦身） =====================
 * 问题：豁免清单三轮涨到五百余条，其中约七成全落在 MAINTENANCE.md（变更历史账本）与
 * project-achievements.md（版本演进史）——这两份文件里的数字语义是「变更当时的结果值
 * 快照」（自带时间戳 / 用「→」表增量），用「当前真值」去核对历史账本本身就是错的用法。
 * 机制：两文件的历史区起点各有一条显式 HTML 注释标记（不依赖行号——行号会随文档增长漂移）。
 *   · 读到标记后，该文件其余行全部跳过（标记行自身也跳过）；
 *   · 标记之前的现状区继续受全部规则管辖；
 *   · 文件存在但标记缺失 → 断言失败（不得静默降级——标记被误删就会静默失去区段保护）。
 * 合法排除三判据（规划轮定死，全中才算合法）：① 被排除内容语义上就是历史快照；
 * ② 该文件有明确现状区且现状区不被排除；③ 排除边界是显式标记而非行号/正则巧合。
 * 🔴 本机制不是放宽断言：任何 runRule 的正则与真值零改动；带现状陈述的文件
 * （AGENTS / NEXT-PHASE / README / specs / CODEx入口说明 / EXTERNAL-RESOURCES /
 * SOURCES / PROGRESS-SCHEMA / LESSON-PAGE-GUIDE 等）一律照旧全文件扫描。 */
const HISTORY_MARKER = 'doc-numbers: 历史区起点';
const HISTORY_MARKER_FILES = new Set(['MAINTENANCE.md', 'project-achievements.md']);
/* 标记存在性自检（先于一切扫描执行；导出模式文件不存在时跳过——与 DOCS 的 existsSync 守卫同口径） */
for (const rel of HISTORY_MARKER_FILES) {
  if (!DOCS.includes(rel)) continue;
  assert.ok(readDoc(rel).includes(HISTORY_MARKER),
    check(`${rel}: 缺少「${HISTORY_MARKER}」显式标记——历史区排除边界依赖该标记；标记被误删时不得静默降级为全文件扫描（历史条目会被当前真值误伤），请在历史区起点恢复标记原文`));
}
/* 可扫描行：历史标记文件只返回标记之前的现状区；其余文件全量返回（行为不变） */
const scannableLines = rel => {
  const lines = readDoc(rel).split(/\r?\n/);
  if (!HISTORY_MARKER_FILES.has(rel)) return lines;
  const idx = lines.findIndex(l => l.includes(HISTORY_MARKER));
  /* idx < 0 不可达：上方存在性自检已断言标记在位（断言失败即中止） */
  return idx >= 0 ? lines.slice(0, idx) : lines;
};

function scanLines(makeRe) {
  const hits = [];
  for (const rel of DOCS) {
    scannableLines(rel).forEach((line, i) => {
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

/* ---- World 3 批次 4 阶段 3（2026-09-27）历史叙述豁免 ---- */

exempt('D3|AGENTS.md|前缀、CS#课|11',
  '历史叙述（批次 4 阶段 1/2 条目与版本沿革旧值，阶段 3 轮登记；语境：- 代码版本：**v4.11.25**（2026-09-27，**本地领先线上、）');
exempt('D3|AGENTS.md|本站已开放#课|11',
  '历史叙述（批次 4 阶段 1/2 条目与版本沿革旧值，阶段 3 轮登记；语境：- 代码版本：**v4.11.25**（2026-09-27，**本地领先线上、）');
exempt('D3|CODEx入口说明-odin-foundations-zh.md|前缀、CS#课|11',
  '历史叙述（批次 4 阶段 1/2 条目与版本沿革旧值，阶段 3 轮登记；语境：| 产品 / 版本 | Odin 中文学习站（The Odin Project ）');
exempt('D3|NEXT-PHASE.md|前缀、CS#课|11',
  '历史叙述（批次 4 阶段 1/2 条目与版本沿革旧值，阶段 3 轮登记；语境：- **批次 4 阶段 3 已完成（2026-09-27，v4.11.25）');
exempt('D3|SOURCES.md|前缀；CS#课|11',
  '历史叙述（批次 4 阶段 1/2 条目与版本沿革旧值，阶段 3 轮登记；语境：- **World 3 javascript 课程「测试 JavaScript」）');
exempt('D3|README.md|已开放全部八章#课|41',
  '历史叙述（批次 4 阶段 1/2 条目与版本沿革旧值，阶段 3 轮登记；语境：- Foundations 的 46 课与 World 2「中级 HTML 与 ）');
exempt('D5e|AGENTS.md|A类#|158',
  '历史叙述（批次 4 阶段 1/2 条目与版本沿革旧值，阶段 3 轮登记；语境：- 代码版本：**v4.11.26**（2026-09-27，**本地领先线上、）');
exempt('D5f|EXTERNAL-RESOURCES.md|C类#|3',
  '历史叙述（批次 4 阶段 1/2 条目与版本沿革旧值，阶段 3 轮登记；语境：> **World 3 批次 4 阶段 4（2026-09-27，v4.11.2）');

/* ---- 批次 5 阶段 2 转历史豁免（2026-09-27 v4.11.28 轮登记）----
 * 阶段 2 新真值（120 课 / 92 图覆盖 61 知识课 / 529 资料 A179 C350 / 809 章 /
 * Boss 19 单元 120 题 / 244 条 312 链接）前进后，上一批（批次 5 阶段 1，
 * v4.11.27）条目里的当时真值陈述与成就快照转为历史值，按既有惯例逐键补登。 */
exempt('D8d|AGENTS.md|Boss#→#单元|18',
  '版本沿革句：批次 5 阶段 1 段「Boss 17 → **18** 单元 113 题」迁移叙述的当轮终点值（批次 5 阶段 2 起真值 19，转历史豁免）');
exempt('D8d|CODEx入口说明-odin-foundations-zh.md|Boss#→#单元|18',
  '版本沿革句：入口说明版本行批次 5 阶段 1 句 17→18 迁移叙述的当轮终点值（批次 5 阶段 2 起真值 19，转历史豁免）');
exempt('D8d|SOURCES.md|Boss合计#单元|18',
  '历史核验记录：批次 5 阶段 1 核验 bullet 里的当时真值（批次 5 阶段 2 起真值 19，转历史豁免）');

/* ---- 批次 5 阶段 3 转历史豁免（2026-09-27 v4.11.29 轮登记）----
 * 阶段 3 新真值（125 课 / 93 图覆盖 62 知识课 / 540 资料 A186 C354 / 830 章 /
 * Boss 20 单元 127 题 / 251 条 321 链接）前进后，上一批（批次 5 阶段 2，
 * v4.11.28）条目里的当时真值陈述与成就快照转为历史值，按既有惯例逐键补登。 */
exempt('D8d|AGENTS.md|Boss#→#单元|19',
  '版本沿革句：批次 5 阶段 2 段「Boss 18 → **19** 单元 120 题」迁移叙述的当轮终点值（批次 5 阶段 3 起真值 20，转历史豁免）');
exempt('D8d|CODEx入口说明-odin-foundations-zh.md|Boss#→#单元|19',
  '版本沿革句：入口说明版本行批次 5 阶段 2 句 18→19 迁移叙述的当轮终点值（批次 5 阶段 3 起真值 20，转历史豁免）');
exempt('D8d|SOURCES.md|Boss合计#单元|19',
  '历史核验记录：批次 5 阶段 2 核验 bullet 里的当时真值（批次 5 阶段 3 起真值 20，转历史豁免）');
exempt('D1a|SOURCES.md|#条#链接|244,312',
  '历史核验记录：批次 5 阶段 2 核验 bullet「任务映射 +18 条 / +22 链接 → 244 条 312 链接」的当轮真值（批次 5 阶段 3 起 251/321，转历史豁免）');

/* ---- 批次 6 阶段 1 转历史豁免（2026-09-27 v4.11.30 轮登记）----
 * 阶段 1 新真值（133 课 / 95 图覆盖 64 知识课 / 563 资料 A202 C361 / 865 章 /
 * Boss 22 单元 140 题 / 262 条 332 链接 / 命令面板 147 条）前进后，批次 5 阶段 3
 * （v4.11.29）条目里的当时真值陈述与成就快照转为历史值，按既有惯例逐键补登。 */

exempt('D1a|SOURCES.md|#条#链接|251,321',
  '历史核验记录（批次 5 及更早条目的当时真值，批次 6 阶段 1 轮登记；SOURCES.md 行 133）');
exempt('D8d|AGENTS.md|Boss#→#单元|20',
  '增量句起点值（AGENTS 版本节批次 6 阶段 1 句「Boss 20 → 22 单元 127 → 140 题」的当时起点，照批次 5 各轮同键先例登记）');
exempt('D8d|CODEx入口说明-odin-foundations-zh.md|Boss#→#单元|20',
  '历史增量句（批次 5 阶段 3「Boss 19 → 20 单元 127 题」的到达点，批次 6 阶段 1 真值 22 后转历史，照 AGENTS 同键先例登记）');
exempt('D8d|SOURCES.md|Boss合计#单元|20',
  '历史核验记录（批次 5 及更早条目的当时真值，批次 6 阶段 1 轮登记；SOURCES.md 行 133）');
exempt('D1a|NEXT-PHASE.md|#条#链接|262,332',
  '历史批次叙述（批次 6 阶段 1 及更早条目的当时真值，批次 6 阶段 2 轮转历史登记；NEXT-PHASE.md 行 84）');


exempt('D14e|AGENTS.md|覆盖#个知识课|64',
  '历史批次叙述（批次 6 阶段 1 及更早条目的当时真值，批次 6 阶段 2 轮转历史登记；AGENTS.md 行 11）');
exempt('D5e|NEXT-PHASE.md|A类#|202',
  '历史批次叙述（批次 6 阶段 1 及更早条目的当时真值，批次 6 阶段 2 轮转历史登记；NEXT-PHASE.md 行 84）');
exempt('D5f|NEXT-PHASE.md|C类#|361',
  '历史批次叙述（批次 6 阶段 1 及更早条目的当时真值，批次 6 阶段 2 轮转历史登记；NEXT-PHASE.md 行 84）');
exempt('D8d|AGENTS.md|Boss#→#单元|22',
  '历史批次叙述（批次 6 阶段 1 及更早条目的当时真值，批次 6 阶段 2 轮转历史登记；AGENTS.md 行 11）');
exempt('D8d|NEXT-PHASE.md|Boss+#→#单元|22',
  '历史批次叙述（批次 6 阶段 1 及更早条目的当时真值，批次 6 阶段 2 轮转历史登记；NEXT-PHASE.md 行 84）');
exempt('D13|AGENTS.md|#门|22',
  '历史批次叙述（批次 6 阶段 1 及更早条目的当时真值，批次 6 阶段 2 轮转历史登记；AGENTS.md 行 11）');
exempt('D1a|NEXT-PHASE.md|#条#链接|272,348',
  '历史批次叙述（批次 6 阶段 2 及更早条目的当时真值，批次 6 阶段 3 轮转历史登记；NEXT-PHASE.md 行 85）');
exempt('D3|AGENTS.md|前#课|25',
  'World 5 课级开放数引文（批次 6 阶段 3 文本引用 World 5 收组事实「25 课」或World 5 卡实测原文「25 课 · 前 25 课已有中文学习内容」——25 是该 World 开放数、非全站开放数，真值域不同；与「前#课|3」「前#课|41」引文豁免同一惯例；AGENTS.md 行 11）');
exempt('D14e|AGENTS.md|覆盖#个知识课|66',
  '历史批次叙述（批次 6 阶段 2 及更早条目的当时真值，批次 6 阶段 3 轮转历史登记；AGENTS.md 行 11）');
exempt('D5e|NEXT-PHASE.md|A类#|214',
  '历史批次叙述（批次 6 阶段 2 及更早条目的当时真值，批次 6 阶段 3 轮转历史登记；NEXT-PHASE.md 行 85）');
exempt('D5f|NEXT-PHASE.md|C类#|377',
  '历史批次叙述（批次 6 阶段 2 及更早条目的当时真值，批次 6 阶段 3 轮转历史登记；NEXT-PHASE.md 行 85）');
exempt('D8d|AGENTS.md|Boss#→#单元|24',
  '历史批次叙述（批次 6 阶段 2 及更早条目的当时真值，批次 6 阶段 3 轮转历史登记；AGENTS.md 行 11）');
exempt('D8d|NEXT-PHASE.md|Boss+#→#单元|24',
  '历史批次叙述（批次 6 阶段 2 及更早条目的当时真值，批次 6 阶段 3 轮转历史登记；NEXT-PHASE.md 行 85）');
exempt('D13|AGENTS.md|#门|23',
  'Project 门数引文（批次 6 阶段 3 文本「全站第 23 门 Project」——23 是 Project 课累计门数、非 D13 大课/长课真值域，不同真值域豁免；AGENTS.md 行 11）');
exempt('D13|NEXT-PHASE.md|#门|23',
  'Project 门数引文（批次 6 阶段 3 条目「新增一门 Project 课全站第 23 门」——23 是 Project 课累计门数、非 D13 大课/长课真值域，不同真值域豁免；NEXT-PHASE.md）');
/* ---- D1 任务映射数 ---- */
exempt('D1a|CODEx入口说明-odin-foundations-zh.md|#条（#链接|46,54',
  '版本沿革句：描述 v4.11.2 新建映射文件时的规模，历史事实不变');

exempt('D1b|CODEx入口说明-odin-foundations-zh.md|KnowledgeCheck#题|31',
  '版本沿革句：v4.11.2 新建时的 KC 映射规模；v4.11.17 已随官方下线整体移除');

exempt('D3|EXTERNAL-RESOURCES.md|开放第#课|30',
  '历史批次说明块：v4.11.19 第三批开放 Project: Landing Page 的当轮记录，非当前开放计数');
exempt('D3|AGENTS.md|开放第#课|38',
  '版本沿革句：v4.11.20 第三批开放 Project: Rock Paper Scissors 的当轮记录，非当前开放计数');
exempt('D3|AGENTS.md|开放第#课|43',
  '版本沿革句：v4.11.20 第六批开放 Project: Etch-A-Sketch 的当轮记录，非当前开放计数');
exempt('D3|AGENTS.md|开放第#课|44',
  '版本沿革句：v4.11.20 第七批开放 Object Basics 的当轮记录，非当前开放计数');
exempt('D3|AGENTS.md|开放第#课|45',
  '版本沿革句：v4.11.20 第八批开放 Project: Calculator 的当轮记录，非当前开放计数');
exempt('D3|AGENTS.md|开放第#课|46',
  '版本沿革句：v4.11.20 第九批的课号引用（Choose Your Path Forward，该批课序 46）。第九批时 46 恰为全站开放数无需豁免；路径课试点批次 3 起全站开放数含 World 2 的 3 门课（49），转为历史课号引用豁免');

/* ---- D2 官方自查题数（现值真值为 0，命中的都是历史记录或阈值陈述） ---- */
exempt('D2|CODEx入口说明-odin-foundations-zh.md|#道官方自查题|96',
  '版本沿革句：v4.11.17 下线时已开放课程的官方自查题总数');
exempt('D2|LESSON-PAGE-GUIDE.md|#道自查题|15',
  '§3.5 设计动机叙述：引用当时 how-does-the-web-work 官方页结构（自查题 15 道 + 任务 22 条）解释标注落点为何在资源区标题下，非现状声明');

/* ---- D3 已开放课数（真值 T_AVAIL；历史轮次与单元级计数豁免） ---- */
exempt('D3|EXTERNAL-RESOURCES.md|前#课|19',
  'v4.11.1 历史说明：描述改动前的页面状态（:21）');
exempt('D3|NEXT-PHASE.md|本站第#课|7',
  '课号引用：§4-4 环境课处置指回第 07 课 installations 的运行环境选择，非开放计数');
exempt('D3|NEXT-PHASE.md|开放第#课|20',
  '课号引用：§3 批次表 P1 行 answers 实施记录文件名里的 Recipes 开放事件叙述，正则就近取到课号');
/* 旧键 D3|project-achievements.md|本站开放#/#课|46 已删：46/46 全开后该历史口径行被
 * 重写，扫描不再命中（死豁免自检逼删）。 */
exempt('D3|SOURCES.md|前）、第#课|20',
  '核验批次划分叙述（:66）：正则跨词取到「第 20 课」课号引用，非开放计数');
/* 旧键 D3|project-achievements.md|开放#/#课|46 已删：同上，46/46 全开后该行不再命中。 */
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

/* ---- D4 概念图数 ---- */
exempt('D4a|AGENTS.md|全站#张|47',
  'v4.11.6 历史记录：当时全站概念图总数（:12）');
exempt('D4a|CODEx入口说明-odin-foundations-zh.md|全站#→#张|51',
  '版本沿革句：v4.11.18 轮 49→51 迁移叙述，正则取到该轮终点值；现值已 52');
exempt('D4a|AGENTS.md|全站铺开：新增#张|33',
  'v4.11.6 历史记录：该轮新生成图数量，正则从「全站铺开」跨词取到（:12）');
exempt('D4a|CODEx入口说明-odin-foundations-zh.md|全站#张|47',
  '版本沿革句：v4.11.6 轮全站概念图总数');
exempt('D4c|CODEx入口说明-odin-foundations-zh.md|#张概念图|2',
  '版本沿革句：当轮新增概念图数（v4.11.17 / v4.11.18 增量），非全站总数');
exempt('D4c|CODEx入口说明-odin-foundations-zh.md|#张概念图|39',
  '版本沿革句：v4.11.6 发布基线里白名单新增的概念图 SVG 数（生成图口径）');
exempt('D4c|SOURCES.md|#张概念图|8',
  '发布准备轮（2026-09-14）视觉资产登记快照：当时手工概念图 8 张，属带日期的历史记录（:159）');
exempt('D4d|AGENTS.md|#张图|7',
  'v4.11.6 历史记录：该轮补 sectionIndex 归位的存量图数（:12）');

/* ---- D5 外部资料条数 ---- */
exempt('D5a|AGENTS.md|#条外部资料|84',
  'v4.11.1 历史记录：当时清单规模（:12）');
exempt('D5a|CODEx入口说明-odin-foundations-zh.md|#条外部资料|84',
  '版本沿革句：v4.11.1 轮规模');
exempt('D5a|CODEx入口说明-odin-foundations-zh.md|#条外部资料|3',
  '版本沿革句：v4.11.19 轮课 27 的新增条数，非全站总数');
exempt('D5a|CODEx入口说明-odin-foundations-zh.md|#条外部资料|12',
  '版本沿革句：v4.11.17 轮新增条数');
exempt('D5e|EXTERNAL-RESOURCES.md|A类#|28',
  'v4.11.19 变更记录：28→30 迁移叙述，正则取到起点值（:7）');
exempt('D5e|EXTERNAL-RESOURCES.md|A类#|31',
  'v4.11.20 变更记录：31→43 迁移叙述，正则取到起点值（zh.javascript.info 首批入库 7 条 + MDN 新路径 5 条）');
exempt('D5f|EXTERNAL-RESOURCES.md|C类#|87',
  'v4.11.20 变更记录：87→89 迁移叙述，正则取到起点值（Live Preview + W3Schools 两条 C 类）');
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

/* ---- D6 成就总数 ---- */
exempt('D6d|specs.md|成就#个|2',
  '子集计数（:101）：「大课体量成就 2 个」指 heavy-first / heavy-all 两条，非成就总数');

/* ---- D8d「Boss 限定语 + N 单元」裸形态历史值（批次 5 阶段 0 建规则时登记，2026-09-27）----
 * 建规则时普查命中 48 处：现值陈述恰为真值直接通过，其余全部是历史沿革叙述与
 * 历史成就快照（各批条目里的当时真值），逐键登记。批后现值前进时（如阶段 1 起
 * Boss 单元数增加），上一批的现值陈述句转为历史值、按同一惯例补键。 */
exempt('D8d|AGENTS.md|Boss#单元|7',
  '版本沿革句：v4.11.20 第九批「Boss 7 单元 43 题」与 World 2 第二批「（旧值…）」引用的当时真值');
exempt('D8d|AGENTS.md|Boss#单元|8',
  '版本沿革句：World 2 第四批条目「Boss 8 单元 50 题均不变」的当时真值');
exempt('D8d|AGENTS.md|Boss#→#单元|11',
  '版本沿革句：World 2 第五批条目 8→11 迁移叙述的当轮终点值');
exempt('D8d|AGENTS.md|Boss#→#单元|12',
  '版本沿革句：批次 4 阶段 1 条目 11→12 迁移叙述的当轮终点值');
exempt('D8d|AGENTS.md|Boss#→#单元|14',
  '版本沿革句：批次 4 阶段 2 条目 12→14 迁移叙述的当轮终点值');
exempt('D8d|AGENTS.md|Boss#→#单元|16',
  '版本沿革句：批次 4 阶段 3 条目 14→16 迁移叙述的当轮终点值');
exempt('D8d|AGENTS.md|Boss#→#单元|17',
  '版本沿革句：批次 4 阶段 4 条目 16→17 迁移叙述的当轮终点值（批次 5 阶段 1 起真值 18，转历史豁免）');
exempt('D8d|CODEx入口说明-odin-foundations-zh.md|Boss#单元|7',
  '版本沿革句：入口说明版本行 World 2 第二批条目引用的当时真值（旧值括注形态）');
exempt('D8d|CODEx入口说明-odin-foundations-zh.md|Boss#单元|8',
  '版本沿革句：入口说明版本行 World 2 第四批条目「Boss 8 单元 50 题均不变」的当时真值');
exempt('D8d|CODEx入口说明-odin-foundations-zh.md|Boss#→#单元|11',
  '版本沿革句：入口说明版本行 World 2 第五批条目 8→11 迁移叙述的当轮终点值');
exempt('D8d|CODEx入口说明-odin-foundations-zh.md|Boss#→#单元|12',
  '版本沿革句：入口说明版本行批次 4 阶段 1 条目 11→12 迁移叙述的当轮终点值');
exempt('D8d|CODEx入口说明-odin-foundations-zh.md|Boss#→#单元|14',
  '版本沿革句：入口说明版本行批次 4 阶段 2 条目 12→14 迁移叙述的当轮终点值');
exempt('D8d|CODEx入口说明-odin-foundations-zh.md|Boss#→#单元|16',
  '版本沿革句：入口说明版本行批次 4 阶段 3 条目 14→16 迁移叙述的当轮终点值');
exempt('D8d|CODEx入口说明-odin-foundations-zh.md|Boss#→#单元|17',
  '版本沿革句：入口说明版本行批次 4 阶段 4 条目 16→17 迁移叙述的当轮终点值（批次 5 阶段 1 起真值 18，转历史豁免）');
exempt('D8d|NEXT-PHASE.md|Boss（合计#单元|11',
  '历史轮次记录：World 2 收组批条目「四个章节就此全部开放，且全部配有 Boss（合计 11 单元）」的当时真值');
exempt('D8d|SOURCES.md|Boss合计#单元|11',
  '历史核验记录：World 2 第五批（收组）核验 bullet 里的当时真值');
exempt('D8d|SOURCES.md|Boss合计#单元|12',
  '历史核验记录：批次 4 阶段 1 核验 bullet 里的当时真值');
exempt('D8d|SOURCES.md|Boss合计#单元|14',
  '历史核验记录：批次 4 阶段 2 核验 bullet 里的当时真值');
exempt('D8d|SOURCES.md|Boss合计#单元|16',
  '历史核验记录：批次 4 阶段 3 核验 bullet 里的当时真值');
exempt('D8d|SOURCES.md|Boss合计#单元|17',
  '历史核验记录：批次 4 阶段 4 核验 bullet 里的当时真值（批次 5 阶段 1 起真值 18，转历史豁免）');

/* ---- D9 金阶 / 阈值三元组 ---- */
exempt('D9a|AGENTS.md|金阶#|5',
  'v4.11.16 历史迁移清单：「金阶 5/12/20」是当时阈值三元组，正则取到首值（:12）');
exempt('D9a|CODEx入口说明-odin-foundations-zh.md|金阶#|23',
  '版本沿革句：v4.11.18 变化叙述（23→25），正则取到起点值');
exempt('D9a|CODEx入口说明-odin-foundations-zh.md|金阶#|25',
  '版本沿革句：v4.11.19 变化叙述（25→27），正则取到起点值');

/* ---- D10 单元成就分母（同文件一致性） ---- */
exempt('D10|PROGRESS-SCHEMA.md|分母#|u4|3',
  '历史沿革：unit-4 新增时（开放第 21–23 课）的分母；:279 表格、:281 解释段、:283 来历段三处「表格+解释段」叙述共用本豁免，现值均为真值');
exempt('D10|PROGRESS-SCHEMA.md|分母#|u403|3',
  '历史沿革（:283）：3→5 变化叙述；同行还提及 unit-0～unit-3，单元串按出现顺序就近取得');


exempt('D4a|CODEx入口说明-odin-foundations-zh.md|全站#→#张|52',
  '历史沿革值：同上（v4.11.19 第二批 51→52）。试点批次起 53 不再是真值，53 历史句一并豁免');
exempt('D4a|CODEx入口说明-odin-foundations-zh.md|全站#张|53',
  '历史沿革值：v4.11.19–v4.11.20 时代全站图数为 53（入口说明版本段两处）；路径课试点批次 3 起 56 张，历史句豁免');
exempt('D4a|CODEx入口说明-odin-foundations-zh.md|全站#→#张|52',
  '版本沿革句：v4.11.19 第一批 51→52 迁移叙述取到终点值；第二批后现值 53');
exempt('D5a|CODEx入口说明-odin-foundations-zh.md|#条外部资料|5',
  '当轮增量：v4.11.19 第二批（28–29 课）新增条数，非全站总数');
exempt('D5e|EXTERNAL-RESOURCES.md|A类#|30',
  'v4.11.19 第二批后的历史值豁免（批次 1 条目的当时值）');
exempt('D5f|EXTERNAL-RESOURCES.md|C类#|80',
  'v4.11.19 第二批后的历史值豁免（批次 1 条目的当时值）');
exempt('D5f|EXTERNAL-RESOURCES.md|C类#|84',
  '变更记录：v4.11.19 第三批迁移叙述的起点值（批次 2 条目或本轮条目内的历史值）');
exempt('D6b|CODEx入口说明-odin-foundations-zh.md|成就总数#|64',
  '版本沿革句：v4.11.19 第三批变化叙述（成就总数 64→65），正则取到起点值');


/* 旧键 D10|u54|3 已删：行 11 措辞随第九批重写后旧命中消失（新键 u6754|3 已登记）。 */
exempt('D10|CODEx入口说明-odin-foundations-zh.md|分母#|u6754|3',
  '变更记录：v4.11.18 条目「unit-4 成就分母 3→5」的历史迁移叙述起点值；行 11 同行含第九批新句的 unit-6/unit-7 引用属就近碰撞，均非当前态分母声明');
/* ---- D13 大课门数 ---- */
exempt('D13|AGENTS.md|#门|2',
  'v4.11.8 历史记录：长课章节导航覆盖数此前误记为两门的订正叙述，非大课集合门数（:12）');
exempt('D13|CODEx入口说明-odin-foundations-zh.md|#门|4',
  '版本沿革句：第五批第 41 课（14 章达大课阈值）开放后大课门数才升到 5，此为之前的当时值');
exempt('D13|CODEx入口说明-odin-foundations-zh.md|#门|2',
  '版本沿革句：v4.11.8 条目里同一订正叙述');
exempt('D13|AGENTS.md|#门|4',
  '历史版本行（:12）：v4.11.16 交付记录里的大课门数当时值，第 41 课开放（第五批）前的真值');

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
/* ---- World 2 第三批（2026-09-26）历史快照豁免：第四批（表单 3 课）起真值前进，
 * 第三批维护条目与成就条目里的当时值转为历史豁免（键与理由文案都不含
 * 「前缀词+数字+课」式可触发句，避免自身构成 stale-claims R2 的命中）。 ---- */
exempt('D13|AGENTS.md|#门|5',
  '历史轮次记录：v4.11.20 第五批叙述里的当时大课门数，World 2 第四批起为 6');
exempt('D13|CODEx入口说明-odin-foundations-zh.md|#门|5',
  '历史轮次记录：v4.11.20 第五批叙述里的当时大课门数，World 2 第四批起为 6');
exempt('D13|NEXT-PHASE.md|#门|5',
  '历史轮次记录：v4.11.20 第五批完成标注里的当时大课门数，World 2 第四批起为 6');
exempt('D13|SOURCES.md|#门|5',
  '历史轮次记录：课 41 逐课核验记录里的当时大课门数，World 2 第四批起为 6');
/* ---- 超长轮批次 7 阶段 1（2026-09-28，v4.11.33，World 6 收组）：批次 6 阶段 3 旧值转历史豁免 ---- */
exempt('D1a|NEXT-PHASE.md|#条#链接|296,378',
  '历史批次叙述（批次 6 阶段 3 条目的当时真值，批次 7 阶段 1 轮转历史登记；NEXT-PHASE.md 行 86）');
exempt('D14e|AGENTS.md|覆盖#个知识课|69',
  '历史叙述（批次 6 阶段 3 及更早条目的当时真值，批次 7 阶段 1 轮转历史登记）（AGENTS.md:11）');
exempt('D5f|AGENTS.md|C类#|430',
  '历史叙述（批次 6 阶段 3 及更早条目的当时真值，批次 7 阶段 1 轮转历史登记）（AGENTS.md:11）');
exempt('D5f|NEXT-PHASE.md|C类#|430',
  '历史叙述（批次 6 阶段 3 及更早条目的当时真值，批次 7 阶段 1 轮转历史登记）（NEXT-PHASE.md:86）');
exempt('D8d|AGENTS.md|Boss#→#单元|27',
  '历史叙述（批次 6 阶段 3 及更早条目的当时真值，批次 7 阶段 1 轮转历史登记）（AGENTS.md:11）');
exempt('D8d|NEXT-PHASE.md|Boss+#→#单元|27',
  '历史叙述（批次 6 阶段 3 及更早条目的当时真值，批次 7 阶段 1 轮转历史登记）（NEXT-PHASE.md:86）');
exempt('D13|AGENTS.md|#门|24',
  'Project 门数引文（批次 7 阶段 1 文本「全站第 24 门 Project」——24 是 Project 课累计门数、非 D13 大课/长课真值域，不同真值域豁免；AGENTS.md 行 11）');
exempt('D13|NEXT-PHASE.md|#门|24',
  'Project 门数引文（批次 7 阶段 1 条目「新增一门 Project 课全站第 24 门」——24 是 Project 课累计门数、非 D13 大课/长课真值域，不同真值域豁免；NEXT-PHASE.md 行 88）');
exempt('D13|NEXT-PHASE.md|#门|27',
  'Project 门数引文（批次 7 阶段 2 文本「全站第 25/26/27 门 Project」——门数是 Project 课累计计数、非 D13 大课/长课真值域，不同真值域豁免（D13|AGENTS|#门|24 阶段 1 先例同型）；NEXT-PHASE.md:88 语境「- **超长轮批次 7 阶段 2 已完成（2026-09-28，v4.11.34」）');
exempt('D13|CODEx入口说明-odin-foundations-zh.md|#门|27',
  'Project 门数引文（批次 7 阶段 2 文本「全站第 25/26/27 门 Project」——门数是 Project 课累计计数、非 D13 大课/长课真值域，不同真值域豁免（D13|AGENTS|#门|24 阶段 1 先例同型）；CODEx入口说明-odin-foundations-zh.md:11 语境「| 产品 / 版本 | Odin 中文学习站（The Odin Project Chinese Learning Com」）');
exempt('D13|AGENTS.md|#门|27',
  '历史叙述（批次 7 阶段 1 条目的当时真值，批次 7 阶段 2 轮转历史登记；AGENTS.md:11 语境「- 代码版本：**v4.11.34**（2026-09-28，**本地领先线上、尚未发布**——线上为已发布的 v4.1」）');
exempt('D8d|NEXT-PHASE.md|Boss+#→#单元|28',
  '历史叙述（批次 7 阶段 1 条目的当时真值，批次 7 阶段 2 轮转历史登记；NEXT-PHASE.md:89 语境「- **超长轮批次 7 阶段 1 已完成（2026-09-28，v4.11.33，World 6 收组」）');
exempt('D8d|NEXT-PHASE.md|Boss合计#单元|28',
  '历史叙述（批次 7 阶段 1 条目的当时真值，批次 7 阶段 2 轮转历史登记；NEXT-PHASE.md:49 语境「- 全站当前 8 个已开放分组全部收组（HTML Foundations 含 Project: Recipes 8/8、」）');
exempt('D8d|AGENTS.md|Boss#→#单元|28',
  '历史叙述（批次 7 阶段 1 条目的当时真值，批次 7 阶段 2 轮转历史登记；AGENTS.md:11 语境「- 代码版本：**v4.11.34**（2026-09-28，**本地领先线上、尚未发布**——线上为已发布的 v4.1」）');
exempt('D5f|NEXT-PHASE.md|C类#|440',
  '历史叙述（批次 7 阶段 1 条目的当时真值，批次 7 阶段 2 轮转历史登记；NEXT-PHASE.md:88 语境「- **超长轮批次 7 阶段 2 已完成（2026-09-28，v4.11.34」）');
exempt('D5f|EXTERNAL-RESOURCES.md|C类#|70',
  '批次增量叙述（EXTERNAL-RESOURCES.md 批次 7 阶段 2 说明行的本批新增条数、非全站总数——D5e|MAINTENANCE A类#|13 批次增量豁免先例同型；EXTERNAL-RESOURCES.md:13 语境「> **超长轮批次 7 阶段 2（2026-09-28，v4.11.34」）');
exempt('D5f|AGENTS.md|C类#|440',
  '历史叙述（批次 7 阶段 1 条目的当时真值，批次 7 阶段 2 轮转历史登记；AGENTS.md:11 语境「- 代码版本：**v4.11.34**（2026-09-28，**本地领先线上、尚未发布**——线上为已发布的 v4.1」）');
exempt('D5e|NEXT-PHASE.md|A类#|224',
  '历史叙述（批次 7 阶段 1 条目的当时真值，批次 7 阶段 2 轮转历史登记；NEXT-PHASE.md:86 语境「- **批次 6 阶段 3 已完成（2026-09-28，v4.11.32，World 5 收组」）');
/* ---- 超长续轮批次 7 阶段 2（2026-09-29，v4.11.34，World 7 nodejs 两章 17 课）：批次 7 阶段 1 旧值转历史豁免 ---- */
exempt('D5e|AGENTS.md|A类#|224',
  '历史叙述（批次 7 阶段 1 条目的当时真值，批次 7 阶段 2 轮转历史登记；AGENTS.md:11 语境「- 代码版本：**v4.11.34**（2026-09-28，**本地领先线上、尚未发布**——线上为已发布的 v4.1」）');
exempt('D14e|AGENTS.md|覆盖#个知识课|70',
  '历史叙述（批次 7 阶段 1 条目的当时真值，批次 7 阶段 2 轮转历史登记；AGENTS.md:11 语境「- 代码版本：**v4.11.34**（2026-09-28，**本地领先线上、尚未发布**——线上为已发布的 v4.1」）');
exempt('D3c|NEXT-PHASE.md|#课中文正文|153',
  '历史叙述（批次 7 阶段 1 条目的当时真值，批次 7 阶段 2 轮转历史登记；NEXT-PHASE.md:7 语境「- 官方 Foundations 全课程数：**46 课**；本站 Foundations 已覆盖全部 **46 课**」）');
exempt('D3|NEXT-PHASE.md|前缀、其余#课|13',
  '历史叙述（批次 7 阶段 1 条目的当时真值，批次 7 阶段 2 轮转历史登记；NEXT-PHASE.md:88 语境「- **超长轮批次 7 阶段 2 已完成（2026-09-28，v4.11.34」）');
/* ---- 超长续轮批次 7 阶段 2（2026-09-29，v4.11.34，World 7 nodejs 两章 17 课）：批次 7 阶段 1 旧值转历史豁免 ---- */
exempt('D1a|NEXT-PHASE.md|#条#链接|303,385',
  '历史叙述（批次 7 阶段 1 条目的当时真值，批次 7 阶段 2 轮转历史登记；NEXT-PHASE.md:89 语境「- **超长轮批次 7 阶段 1 已完成（2026-09-28，v4.11.33，World 6 收组」）');
/* ---- 超长续轮批次 7 阶段 3（2026-09-29，v4.11.35，World 7 收组）：批次 7 阶段 2 旧值转历史豁免 + 阶段 3 增量叙述与不同真值域豁免（35 键） ---- */
exempt('D3|AGENTS.md|前缀一致#课|170',
  '历史叙述（批次 7 阶段 2 版本行 check_links 当时值「前缀一致 170 课页」，批次 7 阶段 3 轮转历史登记；AGENTS.md:11）');
exempt('D3|NEXT-PHASE.md|前缀一致、#课|170',
  '历史叙述（批次 7 阶段 2 条目 check_links 当时值，批次 7 阶段 3 轮转历史登记；NEXT-PHASE.md:89）');
exempt('D5e|AGENTS.md|A类#|234',
  '历史叙述 + 增量起点（批次 7 阶段 2 版本行「A 类 224 → 234」终点值与阶段 3 版本行「A 类 234 → 243」起点值，批次 7 阶段 3 轮转历史登记；AGENTS.md:11）');
exempt('D5e|EXTERNAL-RESOURCES.md|A类#|9',
  '增量叙述（批次 7 阶段 3 批次说明行与覆盖段「A 类 9 / C 类 65」「A 类 9 条——zh.wikipedia ×5…」为本批增量数非全站 A 类总数，与阶段 2「A 类 10 / C 类 70」增量豁免同型；EXTERNAL-RESOURCES.md:13/72）');
exempt('D5e|NEXT-PHASE.md|A类#|234',
  '历史叙述 + 增量起点（批次 7 阶段 2 条目「A 类 224 → 234」终点与阶段 3 条目「A 类 234 → 243」起点；NEXT-PHASE.md:88/89）');
exempt('D5f|AGENTS.md|C类#|510',
  '历史叙述 + 增量起点（批次 7 阶段 2 版本行「C 类 440 → 510」终点值与阶段 3 版本行「C 类 510 → 575」起点值；AGENTS.md:11）');
exempt('D5f|EXTERNAL-RESOURCES.md|C类#|65',
  '增量叙述（批次 7 阶段 3 批次说明行「A 类 9 / C 类 65」为本批增量数非全站 C 类总数；EXTERNAL-RESOURCES.md:13）');
exempt('D5f|NEXT-PHASE.md|C类#|510',
  '历史叙述 + 增量起点（批次 7 阶段 2 条目终点与阶段 3 条目起点；NEXT-PHASE.md:88/89）');
exempt('D8d|AGENTS.md|Boss#→#单元|30',
  '历史叙述 + 增量起点（批次 7 阶段 2 版本行「Boss 28 → 30 单元」终点与阶段 3 版本行「Boss 30 → 34 单元」起点；AGENTS.md:11）');
exempt('D8d|NEXT-PHASE.md|Boss+#→#单元|30',
  '历史叙述（批次 7 阶段 2 条目「Boss +2 → 30 单元 191 题」当时值；NEXT-PHASE.md:89）');
exempt('D13|AGENTS.md|#门|33',
  '不同真值域（批次 7 阶段 3 版本行「六门为全站第 28–33 门 Project」序号尾数，非大课集合门数——大课真值 6 由 controllers 等六门钉住；AGENTS.md:11）');
exempt('D13|AGENTS.md|#门|9',
  '不同真值域（批次 7 阶段 3 版本行「slug 前缀混杂累计 9 门」为 nodejs 课程前缀混杂课数，非大课集合门数；AGENTS.md:11）');
exempt('D13|CODEx入口说明-odin-foundations-zh.md|#门|33',
  '不同真值域（批次 7 阶段 3 增量段「六门 Project 为全站第 28–33 门」序号尾数，非大课集合门数；CODEx入口说明:11）');
exempt('D13|NEXT-PHASE.md|#门|9',
  '不同真值域（批次 7 阶段 3 条目「slug 前缀混杂累计 9 门」与「全站第 9 门零资料课」序号/课数，非大课集合门数；NEXT-PHASE.md:88/89）');
exempt('D13|NEXT-PHASE.md|#门|33',
  '不同真值域（批次 7 阶段 3 条目「六门 Project 为全站第 28–33 门」序号尾数；NEXT-PHASE.md:88）');
exempt('D13|NEXT-PHASE.md|#门|2',
  '不同真值域（批次 7 阶段 3 条目「全站第 2 门跨课合并后零条目课」序号，非大课集合门数；NEXT-PHASE.md:88）');
/* ---- 批次 7 阶段 4（2026-09-29，v4.11.36）：D1a/D3/D3c 豁免须在对应 runRule 之前注册（阶段 4 教训——豁免块统一放文件尾对先执行的规则无效）---- */
exempt('D1a|AGENTS.md|#条#链接|349,451',
  '阶段 3 转历史（AGENTS.md:11 版本行阶段 3 粗体段的任务映射定格值——阶段 4 真值 365/488 已写入阶段 4 段）');
exempt('D1a|EXTERNAL-RESOURCES.md|#条#链接|349,451',
  '阶段 3 转历史（EXTERNAL-RESOURCES.md:14 阶段 3 说明行的当轮定格值）');
exempt('D1a|NEXT-PHASE.md|#条#链接|349,451',
  '阶段 3 转历史（NEXT-PHASE.md:89 阶段 3 条目的当轮定格值）');
exempt('D1a|NEXT-PHASE.md|#条#链接|16,37',
  '批次增量叙述（NEXT-PHASE.md:88 阶段 4 条目「任务映射 16 条 37 链接」为本批新增数、非全站总数——阶段 3 条目「21 条 34 链」增量豁免先例同型）');
exempt('D3|NEXT-PHASE.md|前缀一致收组、#课|183',
  '阶段 3 转历史（NEXT-PHASE.md:89 阶段 3 条目「全站 183 课」定格值）');
runRule('D1a', '映射规模 N 条 M 链接', () => /(\d+)\s*条\s*[（(]?\s*(\d+)\s*链接/g,
  [T_MAP_ITEMS, T_MAP_URLS], 3, [1, 2]);
runRule('D1b', 'KC 映射数（v4.11.17 起应为 0）', () => /(?:KC|Knowledge\s+Check)\s*(\d+)\s*题/g,
  [T_KC_MAPS], 1);
runRule('D1c', '任务映射条数', () => /(\d+)\s*条任务映射/g, [T_MAP_ITEMS], 1);

/* ===================== D2 · 官方自查题数（现值 0） =====================
 * 防空转 4→2（B+ 轮阶段 1）：MAINTENANCE / project-achievements 历史区排除后，
 * 扫描面命中只剩 2 处（入口说明版本行与 LESSON-PAGE-GUIDE 设计动机叙述，均已豁免）。
 * 命中下降是区段排除的预期结果、非正则失效；该句式在现状区再出现仍照旧被咬。 */
runRule('D2', '官方自查题数', () => /(\d+)\s*[道条]\s*(?:官方)?自查题/g, [T_KC], 2);

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
const T_REMAIN = CATALOG.lessons.length - CATALOG.lessons.filter(l => l.available).length;   /* 未开放课数（Foundations 目录口径：官方目录减已开放，46/46 后恒 0） */
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

/* ===================== D3d · 已开放课数·「N 门已上线 / 已开放」句式（World 2 第五批补位，2026-09-26） =====================
 * 缺口成因（与 D3b / D3c / D14e 同型，第四次）：D3 族单位词只认「课」且须落在
 * P_OPEN_PREFIX 前缀上，README 的「两个章节共 8 门已上线」整句隐形——规划轮已独立
 * 复现（8 ≠ 真值，且与同文件「三个章节共 16 课」自相矛盾）。
 * 先普查再建规则（2026-09-26 全量扫描扫描面文档）：「N 门」全部命中约 60 处，分布是
 * ① 大课 / 长课计数（含历史倒装叙述，D13 / D13b 管辖或已有历史豁免）；② 「N 门课」
 * 「N 门路径课程」等其他量词句；③ 真正断言已开放总数的后置句式「门已上线 / 门已开放」
 * 仅 2 处（README 的旧值 8——本轮 B1 订正对象；EXTERNAL-RESOURCES 的旧值 62——同轮订正）。
 * 规则设计据此取**后置信号**而不是 D3 式前缀：
 *   · 命中 = 数字 + 门 +（已）上线 / 开放——只有开放计数断言会带这个尾巴；
 *   · 「N 门覆盖」（EXTERNAL-RESOURCES 的速览覆盖句：「全站 N 门已开放课程中 M 门覆盖」
 *     的 M，语义是其中 M 门有覆盖 ≠ 开放总数，且该句当前是正确的）被后置集合天然排除，
 *     **不误伤**；同行的 N（门已开放）恰是本规则该管的开放总数断言；
 *   · 「当前恰 N 门」「此前只记 N 门」等前缀式命中（普查清单里的全部大课 / 长课历史
 *     计数句）不带上线 / 开放尾巴——本句式**刻意不覆盖**：它们语义上归 D13（大课）、
 *     D13b（长课）或既有历史豁免管辖；若改用前缀式抓取，会把三种不同真值的句式混进
 *     一条规则、豁免将淹没断言（与 D3c「精准咬人优先于覆盖广」同一判据）。
 * 数字两侧卡死同 D3（范围式被环视排除）、容忍加粗星号；不跨句（后置尾巴紧邻数字短语）。
 * 普查时点命中 2 处；本轮 B1 把 README 句改写为课字句后常驻命中为 1 处（EXTERNAL-RESOURCES
 * 覆盖句的开放总数），minHits 定 1——该句式再出现即被咬住。 */
const P_WORD_GATE = '门';
const P_OPEN_TAIL = '(?:上线|开放)';
runRule('D3d', '已开放课数·门已上线/已开放句式',
  () => new RegExp('(?<![\\d–—-])(\\d+)\\s*\\*{0,2}\\s*' + P_WORD_GATE + '\\*{0,2}\\s*(?:已)?' + P_OPEN_TAIL, 'g'),
  [T_AVAIL], 1);

/* ===================== D14 · 资产族计数（v4.11.20 后 FIX 批次 0-B，句式清单机制首批） =====================
 * 机制背景：连续三轮扩课各有一种新数字句式从规则缝隙溜过（「当前 N 门」→
 * 「N 课中文正文」→「N 个知识课」），被动补漏改为主动枚举。本族覆盖资产族
 * 四句式；其余族（课数 / 内容 / 成就 / Boss / 版本）已由 D1–D13 各族覆盖。
 * 命中普查（2026-09-25）：四句式合计命中约 12 处，当前态陈述约 6 处、历史
 * 叙述约 6 处——豁免占比可控，规则有效。真值全部从数据文件现算零硬编码。 */
runRule('D14a', '面板头像总数「面板 N 款可选」', () => /面板\s*(\d+)\s*款可选/g, [T_PANEL_TOTAL], 1);
runRule('D14b', '面板几何头像「N 个原创几何头像」', () => /(\d+)\s*个原创几何头像/g, [T_AVATAR_PANEL_GEO], 1);
runRule('D14c', '伙伴形象头像「N 个学习伙伴形象头像」', () => /(\d+)\s*个学习伙伴形象头像/g, [T_COMPANION_AVATAR], 2);
runRule('D14d', '页面主题「N 套页面主题」', () => /(\d+)\s*套页面主题/g, [T_THEMES], 1);
exempt('D5e|EXTERNAL-RESOURCES.md|A类#|10',
  '批次增量叙述（EXTERNAL-RESOURCES.md 批次 7 阶段 2 说明行「A 类 10」为本批新增条数、非全站 A 类总数——D5e|MAINTENANCE A类#|13 与 A类#|7 批次增量豁免先例同型）');
/* ---- 超长续轮批次 7 阶段 4（2026-09-29，v4.11.36，World 8 收组、全站 197 课收官）：批次 7 阶段 3 旧值转历史豁免 + 阶段 4 增量叙述与不同真值域豁免（31 键） ----
 * 转历史：映射 349/451、当轮全站课数 183、A 类 243 / C 类 575、Boss 34 单元等阶段 3 定格值仍住在各文档的阶段 3 条目与成就快照里；
 * 增量叙述：阶段 4 新写文本中的「A 类 2 / C 类 95」「16 条 37 链」「Boss 34 → 36」「A 类 243 → 245 起点值」等为本批增量/迁移起点，非全站总数；
 * 不同真值域：「全站第 34、35 门 Project」为 Project 累计门数、「3 门零资料课」为零资料课计数，均非 D13 大课真值域。
 * 文档实值侧本轮已同步修四处：AGENTS 文件清单 818→915、README 112→117 张 / 81→86 课、MAINTENANCE 阶段 4 条目 stale-claims 段「开放+十四课」字面文本改汉字数字避开 D3。 */
exempt('D5e|AGENTS.md|A类#|243',
  '阶段 3 转历史 + 阶段 4 增量起点（AGENTS.md:11 阶段 3 段「A 类 243」定格值与阶段 4 段「A 类 243 → 245」迁移起点，非当前全站 A 类总数 245）');
exempt('D5e|EXTERNAL-RESOURCES.md|A类#|2',
  '批次增量叙述（EXTERNAL-RESOURCES.md:13 阶段 4 说明行「A 类 2 / C 类 95」与 :73 总览 World 8 段「A 类 2 条」均为本批新增条数——阶段 2「A 类 10」增量豁免先例同型）');
exempt('D5e|EXTERNAL-RESOURCES.md|A类#|243',
  '批次增量叙述（EXTERNAL-RESOURCES.md:13 阶段 4 说明行「全站 A 类 243 → 245」迁移起点值——阶段 3「A 类 9」增量豁免先例同型）');
exempt('D5e|NEXT-PHASE.md|A类#|243',
  '批次增量叙述（NEXT-PHASE.md:88 阶段 4 条目「A 类 243 → 245」迁移起点值）');
exempt('D5f|AGENTS.md|C类#|575',
  '阶段 3 转历史 + 阶段 4 增量起点（AGENTS.md:11 阶段 3 段「C 类 575」定格值与阶段 4 段「C 类 575 → 670」迁移起点）');
exempt('D5f|EXTERNAL-RESOURCES.md|C类#|95',
  '批次增量叙述（EXTERNAL-RESOURCES.md:13 阶段 4 说明行「C 类 95 条」为本批新增条数）');
exempt('D5f|EXTERNAL-RESOURCES.md|C类#|575',
  '批次增量叙述（EXTERNAL-RESOURCES.md:13 阶段 4 说明行「C 类 575 → 670」迁移起点值）');
exempt('D8d|AGENTS.md|Boss#→#单元|34',
  '批次增量叙述（AGENTS.md:11 阶段 4 段「Boss 34 → 36 单元」迁移起点值——阶段 3「32 → 34」同键豁免转历史后本轮新起点）');
exempt('D8d|NEXT-PHASE.md|Boss+#→#单元|34',
  '阶段 3 转历史（NEXT-PHASE.md:89 阶段 3 条目当轮定格值）');
exempt('D13|AGENTS.md|#门|35',
  'Project 门数引文（阶段 4 文本「全站第 34、35 门 Project」——门数是 Project 课累计计数、非 D13 大课真值域，阶段 2「25/26/27 门」豁免先例同型）');
exempt('D13|AGENTS.md|#门|3',
  '不同真值域（阶段 4 文本「3 门零资料课」为零资料课计数、非 D13 大课真值域——阶段 3「9 门零资料课」豁免先例同型）');
exempt('D13|CODEx入口说明-odin-foundations-zh.md|#门|35',
  'Project 门数引文（阶段 4 增量列表「两门 Project 为全站第 34/35 门」——D13|AGENTS|#门|35 先例同型）');
exempt('D13|NEXT-PHASE.md|#门|35',
  'Project 门数引文（阶段 4 条目「全站第 34、35 门」——D13|AGENTS|#门|35 先例同型）');
runRule('D14e', '概念图覆盖「覆盖/绑 N 个知识课」', () => /(?:覆盖|绑)\s*(\d+)\s*个知识课/g, [T_KNOWLEDGE_WITH_DIAGRAM], 2);
/* D14f（NV-3 补位）：specs 的「头像 N 个（…解锁分布…）」是 avatars.js 数据总数口径
 * （含退役 terminal）——与 D14b 的面板口径（36，去退役）刻意区分，两个口径都有人写。 */
runRule('D14f', '头像数据总数「头像 N 个」', () => /头像\s*\*{0,2}(\d+)\*{0,2}\s*个（/g, [T_AVATAR_DATA], 1);

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

/* ===================== D7 · 课数 / 章数配对与总章数 =====================
 * 防空转 1→0（B+ 轮阶段 1，按 D3b「正向零命中」先例）：两句式的全部既有陈述都住在
 * 两份历史账本的历史条目里，历史区排除后扫描面为零命中。零命中不是失效：任何文档
 * 再写出「N 课 / M 章」「共 N 章」句式，命中即必须等于当前真值或登记豁免。 */
runRule('D7a', 'N 课 / M 章', () => /(\d+)\s*课\s*[/／]\s*(\d+)\s*章/g,
  [T_LESSONS, T_CHAPTERS], 0, [1, 2]);
runRule('D7b', '共 N 章', () => /共\s*(\d+)\s*章/g, [T_CHAPTERS], 0);

/* ===================== D8 · Boss 单元数与总题数 ===================== */
runRule('D8a', 'N 个单元 Boss', () => /(\d+)\s*个单元\s*Boss/g, [T_BOSS], 1);
/* 防空转 2→1（B+ 轮阶段 1）：历史区排除后两句式扫描面各剩 1 处命中、且均为真值的
 * 现状陈述——命中下降是区段排除的预期结果、非正则失效，句式再出现仍照旧被咬。 */
runRule('D8b', 'N 个配置了 Boss 的单元', () => /(\d+)\s*个配置了\s*Boss\s*的单元/g, [T_BOSS], 1);
runRule('D8c', 'Boss 总题数（共 N 题）', () => /共\s*(\d+)\s*题/g, [T_BOSS_Q], 1);

/* ===================== D8d · Boss 单元数·「Boss 限定语 + N 单元」裸形态（批次 5 阶段 0 补位，2026-09-27） =====================
 * 缺口成因（与 D3 / D13 / D3b / D3c / D3d 同型，第五次）：D8a 要求「N 个单元 Boss」
 * （含「个」、数字在 Boss 之前）、D8b 要求「N 个配置了 Boss 的单元」——而
 * NEXT-PHASE.md 统计节的现状陈述形态是「全站 Boss 合计 12 单元」：无「个」、语序
 * 相反，整句不匹配，陈旧值长期隐形（阶段 2/3/4 各加 Boss 均未回头更新该句）。
 *
 * ⚠️ 设计陷阱（建规则前全量普查 80 处独立复现，规划交接预警属实且不止两个真值域）：
 * 「单元」一词在本项目对应**三个**互不相干的真值域——
 *   ① Boss 单元数（T_BOSS，现算）；
 *   ② Foundations 地图分组数（8：「8 单元纵向纯 CSS 路线图」、specs 地图 / 技能路线节）；
 *   ③ 伙伴成长阶段阶梯（specs.md「Lv.10 或 2 单元或 30h → Lv.15 或 4 单元或 60h」式）。
 * 裸匹配「N 单元」会把 ②③ 的语义正确陈述一次判红。故本规则**限定语驱动**：
 * 「Boss」之后 12 字符内（不跨句）数字直接跟「单元」（无「个」，与 D8a/D8b 互补
 * 不重叠）。普查证明 ②③ 全部命中行内近旁无 Boss 字样，被结构性排除——负向验证
 * 以「把地图分组 8 改成别的数，本规则不得咬住」为核心对照。
 * (?<!\+) 排除「Boss +N 单元」纯增量形态（增量数不是全站真值；「+1 单元 → 17 单元」
 * 式混合句仍经间隔跨段取到终点值，普查实测符合预期）。
 *
 * 刻意不覆盖的形态与理由（照 D3d「精准咬人优先于覆盖广」判据，不放宽断言）：
 *   · 「数据层 N 单元 N 题」（MAINTENANCE / project-achievements 批次验证记录）与
 *     「bosses.js → N 单元 M 题」——无紧邻 Boss 限定语；放宽成裸形态会扫进 ②③
 *     两个错误真值域，宁可不覆盖。历史验证记录数字按惯例保持原样；
 *   · Boss 与数字被长题名列表隔开的「共 N 单元 N 题」（NEXT-PHASE 阶段 2/3 完成
 *     条目）——12 字符间隔上限刻意不追；同文件的现状陈述行已由「Boss 合计 N 单元」
 *     相邻形态管辖；
 *   · 小写「bosses 7 单元」与全大写「BOSSES 6 单元」——限定语大小写敏感取「Boss」，
 *     忽略大小写会误咬 pathBossUnitId 等标识符内嵌片段，且两形态均为历史记录；
 *   · 「Boss 6 单元 36 题 → **7 单元 43 题**」的终点值段——首个匹配消费掉起点段后
 *     终点值无 Boss 前缀不再命中；该形态仅历史叙述，起点值已被豁免键管辖。
 * 模式串拆常量拼装（同 D3 / D13b 纪律），避免规则定义行自身构成字面触发句。
 * 命名订正：规划交接称本规则为「D8c」，但 D8c 槽位已被「Boss 总题数（共 N 题）」
 * 占用（规划轮未察觉既有编号），按既有编号顺序落为 D8d——规则内容与规划要求一致。 */
const P_BOSS_WORD = 'Bo' + 'ss';
const P_UNIT_WORD = '单' + '元';
const RE_BOSS_UNIT_BARE = () => new RegExp(
  P_BOSS_WORD + '[^。\\n]{0,12}?(?<!\\+)(\\d+)\\*{0,2}\\s*' + P_UNIT_WORD, 'g');
runRule('D8d', 'Boss 单元数（Boss 限定语裸形态）', RE_BOSS_UNIT_BARE, [T_BOSS], 10);

/* ===================== D9 · tiers 金阶与阈值三元组 ===================== */
runRule('D9a', 'tiers 金阶 N', () => /金阶\s*(\d+)/g, [T_GOLD], 2);
/* D9b：阈值表行「| `family-id` | 指标 | a / b / c |」——族 id 清单来自 tiers.js */
{
  const hits = [];
  for (const rel of DOCS) {
    scannableLines(rel).forEach((line, i) => {
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
    scannableLines(rel).forEach((line, i) => {
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
    scannableLines(rel).forEach((line, i) => {
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

/* ===================== D13b · 长课门数（「N 门长课」句式，World 2 第五批补位，2026-09-26） =====================
 * 缺口成因：D13 有原文门槛（行内须含「大课 / heavy」才扫「N 门」），LESSON-PAGE-GUIDE
 * 的「当前真实覆盖 5 门长课」整句隐形——规划轮已独立复现（真值 7 门时代名单就与集合
 * 不符：漏 dom-manipulation-and-events 与 form-basics 两门在册长课）。与 D3b / D3c / D3d
 * 同型，第四次。
 * **真值 ≠ T_HEAVY（关键区分，用错会把正确陈述判红）**：本项目
 *   「长课」= sections 数 ≥ app.js 的 LESSON_CHAPTER_NAV_MIN（章节导航渲染阈值，
 *             本规则从 app.js 源码现读该常量、不硬编码数值）；
 *   「大课」= isHeavyLesson（sections ≥ 14 或官方自查题 ≥ 10，D13 的真值 T_HEAVY）。
 * 两者不同源：批后长课 8 门（含恰达 12 章的 html-boilerplate 与 advanced-grid-properties），
 * 大课 6 门——集合有交集但不相等。
 * 先普查再建规则（2026-09-26）：「门长课」相邻句式在扫描面文档仅 LESSON-PAGE-GUIDE
 * §4.8 一处计数命中（本轮 B1 按现算重写门数与名单）；同文件 §4.9 的「两门长课」是
 * 汉字数词且属样板覆盖范围的局部陈述，数字正则天然不命中、也无需豁免；倒装形
 * 「长课实际 N 门」出现在 AGENTS / CODEx入口说明的 v4.11.8 历史叙述行——那些行含
 * heavy 字样、其「N 门」由 D13 的既有历史豁免管辖，本句式不重复覆盖（一行一义，
 * 避免同一数字被两条规则要求成两个不同真值）。
 * 模式串按 D3 同款纪律拆常量拼装，避免模式定义行自身构成字面触发句。 */
const APP_SRC_FOR_NAV = fs.existsSync(path.join(root, 'app.js'))
  ? fs.readFileSync(path.join(root, 'app.js'), 'utf8') : '';
const NAV_MIN_MATCH = /LESSON_CHAPTER_NAV_MIN\s*=\s*(\d+)/.exec(APP_SRC_FOR_NAV);
assert.ok(NAV_MIN_MATCH,
  check('D13b 前提：app.js 源码可读且含 LESSON_CHAPTER_NAV_MIN 常量（长课阈值的唯一事实源）'));
const T_LONG = GUIDE.lessons.filter(l => l.sections.length >= Number(NAV_MIN_MATCH[1])).length; /* 长课门数（章节导航阈值口径，非 T_HEAVY） */
const P_WORD_LONG = '门' + '长课';
runRule('D13b', '长课门数（门长课句式）',
  () => new RegExp('(?<![\\d–—-])(\\d+)\\s*\\*{0,2}\\s*' + P_WORD_LONG, 'g'),
  [T_LONG], 1);

/* ===================== 死豁免自检 ===================== */
if (FULL_MODE) {
  for (const key of EXEMPT.keys()) {
    assert.ok(usedExempt.has(key),
      check(`死豁免「${key}」：已扫不到该命中，请从豁免清单删除（原理由：${EXEMPT.get(key)}）`));
  }
  console.log(`  死豁免自检：${EXEMPT.size} 条豁免全部命中`);
}

console.log(`doc-numbers.test.cjs：全部 ${checks} 项断言通过 ✔（FULL_MODE=${FULL_MODE}；扫描 ${DOCS.length} 份文档；真值：开放 ${T_AVAIL} 课 / ${T_CHAPTERS} 章 / 成就 ${T_ACH} / 图 ${T_DIAGRAMS} / 资料 ${T_RES}（A ${T_ZH} / C ${T_C} / 精译 ${T_TRANS}）/ Boss ${T_BOSS} 单元 ${T_BOSS_Q} 题 / 映射 ${T_MAP_ITEMS} 条 ${T_MAP_URLS} 链接 / 金阶 ${T_GOLD} / 大课 ${T_HEAVY} 门 / 长课 ${T_LONG} 门）`);
