/* 陈旧声明机械断言：让「开放到第几课」「当前开放几课」「产品版本」这类硬编码
 * 数字在扩课时漏改，直接变成红色失败，而不是等用户看到过时信息。
 *
 * 为什么需要它（本轮记录的真实事故）：v4.11.16 开放第 20 课时，app.js 的技能树
 * 图例仍写着「第 20–46 课」（实际应为 21–46）——同一文件 :2391 改了、:6329 漏了；
 * 同一轮里 version.js 头注释也漏改。散落在产品代码与测试里的同类硬编码没有
 * 机械保障，只能靠人逐行读。
 *
 * 三条规则：
 *   R1 未开放范围端点 —— 「N–46 课 /（N–46）」式的未开放范围声明，N 必须 = 已开放数 + 1；
 *   R2 当前态计数     —— 「当前 / 本站 / 已开放 … N 课」式的开放数声明，N 必须 = 已开放数；
 *   R3 版本号一致性   —— version.js 源码里的 vX.Y.Z 字面量必须与 version: 的实际值一致。
 *
 * 事实来源：本文件**不写任何课数或版本字面量**，全部从 catalog.js / version.js 推导。
 * 这样它是跟着事实走的看门狗，而不是第二个事实源。
 * 注意：tests/catalog.test.cjs 里刻意硬编码 AVAILABLE_TOTAL = 20，那是为了「逼人
 * 复核开放范围」；这里推导是为了「不产生第二个源」。两处目的不同，刻意不统一。
 *
 * 扫描范围：根级 *.js（产品代码）+ tests/*.test.cjs + tests/browser-smoke.js。
 *   · 不扫 .md —— 公开仓不含 AGENTS.md / MAINTENANCE.md 等文档，且本规则要守的是
 *     随版本发布的产品与测试源码（与 heavy-lesson.test.cjs 的 hasStyleGuide 守卫同理）。
 *   · 不扫本文件自身 —— 它的注释需要引用这些句式作为说明，自扫会造成自我命中。
 *
 * 运行：node tests/stale-claims.test.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

let checks = 0;
const check = label => { checks += 1; return label; };

const root = path.resolve(__dirname, '..');
const SELF = path.basename(__filename);

const loadData = (file, globalName) => {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox);
  return JSON.parse(JSON.stringify(sandbox.window[globalName]));
};

/* ===================== 事实来源（零硬编码） =====================
 * 路径课试点批次 3（2026-09-25）起，本站已开放数 = Foundations 目录 available 数
 * + courses/*.js 已并入的路径课数。事实源跟着汇总层走（lesson-sources.js 同款
 * 推导），不在这里硬编码「49」——扩下一批课时这里自动前进。 */
const CATALOG = loadData('catalog.js', 'ODIN_CATALOG');
const CATALOG_TOTAL = CATALOG.lessons.length;                             /* 官方 Foundations 总课数 */
const COURSE_DIR = path.join(root, 'courses');
const COURSE_FILES = fs.readdirSync(COURSE_DIR).filter(f => f.endsWith('.js'));
const COURSE_LESSON_COUNT = COURSE_FILES.reduce((sum, f) => {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(COURSE_DIR, f), 'utf8'), sandbox);
  /* 与 lesson-sources.js 同款逐 course 守卫：结构不完整不计入 */
  for (const key of Object.keys(sandbox.window)) {
    const course = sandbox.window[key];
    if (course && Array.isArray(course.lessons) && Array.isArray(course.groups)) sum += course.lessons.length;
  }
  return sum;
}, 0);
const AVAILABLE_TOTAL = CATALOG.lessons.filter(l => l.available).length + COURSE_LESSON_COUNT; /* 本站已开放中文正文的课数（Foundations + 路径课） */
const LOCKED_FROM = AVAILABLE_TOTAL + 1;                                  /* 未开放范围起点 */

/* version.js 的真实版本值（与 version-identity.test.cjs 同一解析口径） */
const versionSource = fs.readFileSync(path.join(root, 'version.js'), 'utf8');
const realVersion = /version:\s*'([^']+)'/.exec(versionSource)[1];

/* ===================== 扫描范围 ===================== */
const productFiles = fs.readdirSync(root).filter(f => f.endsWith('.js'));
const testFiles = fs.readdirSync(path.join(root, 'tests'))
  .filter(f => (f.endsWith('.test.cjs') || f === 'browser-smoke.js') && f !== SELF)
  .map(f => `tests/${f}`);
const SCAN_FILES = [...productFiles, ...testFiles];

const norm = s => s.replace(/\s+/g, '');
const keyOf = hit => `${hit.rel}|${norm(hit.raw)}`;
/* 只扫含中日韩文字的行：R1/R2 守的是面向中文读者的课数声明，纯代码行里的
 * 数字碰撞（SVG path 的坐标串等）不属此类，纳入只会制造无常的假红。 */
const CJK = /[㐀-䶿一-鿿]/;

const scan = (makeRe, { cjkOnly = false, numberGroup = 1 } = {}) => {
  const hits = [];
  for (const rel of SCAN_FILES) {
    fs.readFileSync(path.join(root, rel), 'utf8').split(/\r?\n/).forEach((line, i) => {
      if (cjkOnly && !CJK.test(line)) return;
      const re = makeRe();
      let m;
      while ((m = re.exec(line))) {
        hits.push({ rel, line: i + 1, raw: m[0], n: Number(m[numberGroup]), text: line.trim() });
      }
    });
  }
  return hits;
};

/* =====================================================================
 * 豁免清单（显式集合；每条注明为什么这条陈述是对的）
 * 原则：**不放宽正则**。凡是命中但确实正确的陈述，在这里逐条登记；将来新出现的
 * 同类命中会立刻变红，逼人判断它是漏改还是又一条正确陈述。
 * 另有「死豁免」自检：登记了却再也扫不到的条目同样会变红，提示删除，防止清单腐化。
 * ===================================================================== */
const R1_EXEMPT = new Set([
  /* catalog.js「官方目录里的序号，1-46」——这是官方课程的**序号范围**（第 1 课到
   * 第 46 课全覆盖），不是「未开放范围起点」，不随开放进度变化。 */
  'catalog.js|1-46'
]);

const R2_EXEMPT = new Set([
  /* —— 课程序号引用：「第 N 课」指某一课，不是全站开放计数 —— */
  /* external-resources.js「本站第 1 课官方正文已给出核心定位」：指 Introduction 第 1 课。 */
  'external-resources.js|本站第1课',
  /* lessons.js「本站建议再用第 15 课的 W3C 校验器」：指 HTML Boilerplate（第 15 课）。 */
  'lessons.js|本站建议再用第15课',
  /* —— 单元级计数：某个单元内的课数，不随全站开放数前进 —— */
  /* bosses.js「HTML Foundations 单元综合预检（本站已开放 7 课范围）」：
   * 7 = 该单元 8 课减去不出题的 Project: Recipes。 */
  'bosses.js|本站已开放7课',
  /* progress.js「已开放的 8 课（含 Project: Recipes）」：unit-3 = HTML Foundations
   * 单元的 8 课（官方该单元共 8 课）。单元级成就，不是全站计数。 */
  'progress.js|已开放的8课',
  /* profile.test.cjs 同上（unit-3 单元）：两处同串，共用一条豁免键。 */
  'tests/profile.test.cjs|已开放的8课',
  'tests/profile.test.cjs|本站开放8课',
  /* map-boss.test.cjs「git-basics 单元本站只开放 2 课，来源最多 2 课」：该单元内计数。 */
  'tests/map-boss.test.cjs|本站只开放2课',
  /* progress.js / profile.test.cjs 等处的 unit-4（CSS Foundations）：与 unit-3 同理，
   * v4.11.18 全组开放后 5 = 该单元本站已开放的课数（官方该单元共 5 课），不是全站开放数。 */
  'progress.js|已开放的5课',
  /* progress.js unit-6「完成当前 JavaScript Basics 已开放的 15 课（含三门 Project）」：
   * 单元级计数（15 = 该单元全部 15 课），不是全站开放数。v4.11.20 第九批登记。 */
  'progress.js|已开放的15课',
  'bosses.js|本站已开放5课',
  /* bosses.js「JavaScript Basics 单元综合预检（本站已开放 15 课）」：单元级计数（15 = 该单元
   * 全部 15 课），不是全站开放数。v4.11.20 第九批登记。 */
  'bosses.js|本站已开放15课',
  /* bosses.js「『中级 CSS 概念』章节综合预检（本站已开放 10 课）」：路径课**章节级**计数
   * （10 = curriculum.js 里 intermediate-css-concepts 章节的全部 10 课，本章已全开放才配 Boss），
   * 不是全站开放数。World 2 第三批登记。 */
  'bosses.js|本站已开放10课',
  /* bosses.js「『中级 HTML 概念』/『表单』章节综合预检（本站已开放 3 课）」：路径课章节级
   * 计数（3 = 各自章节的全部课数，两章均已全开放；World 2 第五批补配 Boss 时登记）。
   * 两条 desc 同串，共用一条豁免键（与 profile.test「两处同串」先例一致）。 */
  'bosses.js|本站已开放3课',
  /* bosses.js「『Grid 布局』章节综合预检（本站已开放 6 课）」：路径课章节级计数
   * （6 = grid 章节全部课数，本章 6/6 全开即配）。World 2 第五批登记。 */
  'bosses.js|本站已开放6课',
  /* bosses.js「『组织 JavaScript 代码』章节综合预检（本站已开放 14 课）」：路径课章节级
   * 计数（14 = curriculum.js 里 organizing-your-javascript-code 章节的全部 14 课，本章
   * 14/14 全开即配）。World 3 批次 4 阶段 1 登记。 */
  'bosses.js|本站已开放14课',
  /* bosses.js「『异步 JavaScript 与 API』章节综合预检（本站已开放 4 课）」：路径课章节级
   * 计数（4 = curriculum.js 里 asynchronous-javascript-and-apis 章节的全部 4 课，本章
   * 4/4 全开即配；「真实世界的 JavaScript」desc 为「本站已开放 3 课」，与既有 World 2
   * 表单章节同串、共用上方既有豁免键）。World 3 批次 4 阶段 2 登记。 */
  'bosses.js|本站已开放4课',
  /* bosses.js「『一点计算机科学』章节综合预检（本站已开放 11 课）」：路径课章节级
   * 计数（11 = curriculum.js 里 a-bit-of-computer-science 章节的全部 11 课，本章
   * 11/11 全开即配，其中 6 门 Project 课不出题）。「试炼考馆」desc 为「本站已开放
   * 3 课」，与「真实世界回廊」及 World 2 表单章节同串、共用上方既有豁免键。
   * World 3 批次 4 阶段 3 登记。 */
  'bosses.js|本站已开放11课',
  /* bosses.js「『无障碍』章节综合预检（本站已开放 8 课）」：路径课章节级计数
   * （8 = curriculum.js 里 accessibility 章节的全部 8 课，本章 8/8 全开即配）。
   * World 4 批次 5 阶段 2 登记。 */
  'bosses.js|本站已开放8课',
  /* bosses.js「『类组件』章节综合预检（本站已开放 2 课）」：路径课章节级计数
   * （2 = curriculum.js 里 class-components 章节的全部 2 课，本章 2/2 全开即配——
   * 「齿轮档案厅」；配 Boss 判据为知识点密度足，理由登记 bosses.js 单元注释与
   * map-boss 断言）。「潮汐观测所」desc 为「本站已开放 5 课」（states-and-effects
   * 章节全部 5 课），与既有 5 课豁免键同串共用。World 5 批次 6 阶段 2 登记。 */
  'bosses.js|本站已开放2课',
  'tests/profile.test.cjs|已开放的5课',
  'tests/profile.test.cjs|本站开放5课',
  /* browser-smoke.js 目录注释：灰化课数紧邻「已开放」字样被 R2 就近取数。
   * v4.11.20 第八批迁移 44+2 → 45+1；第九批 46 课全开后灰化为零、注释改写
   * 避开句式，键随之删除。 */

  /* external-resources.js 头注释「v4.11.19 第三批：开放第 30 课 Project: Landing Page」：
   * 历史批次记录的课号引用（事件叙述），非当前开放计数。 */
  'external-resources.js|开放第30课',
  /* external-resources.js 头注释「v4.11.20 第三批：开放第 38 课 Project: Rock Paper Scissors」：
   * 历史批次记录的课号引用（事件叙述），非当前开放计数。v4.11.20 第四批迁移，键随新批次登记。 */
  'external-resources.js|开放第38课',
  /* external-resources.js 头注释「v4.11.20 第六批：开放第 43 课 Project: Etch-A-Sketch」：
   * 历史批次记录的课号引用（事件叙述），非当前开放计数。v4.11.20 第七批迁移，键随新批次登记。 */
  'external-resources.js|开放第43课',
  /* external-resources.js 头注释「v4.11.20 第七批：开放第 44 课 Object Basics」：
   * 历史批次记录的课号引用（事件叙述），非当前开放计数。v4.11.20 第八批迁移，键随新批次登记。 */
  'external-resources.js|开放第44课',
  /* external-resources.js 头注释「v4.11.20 第八批：开放第 45 课 Project: Calculator」：
   * 历史批次记录的课号引用（事件叙述），非当前开放计数。v4.11.20 第九批迁移，键随新批次登记。 */
  'external-resources.js|开放第45课',
  /* external-resources.js 头注释「v4.11.20 第九批：开放第 46 课 Choose Your Path Forward」：
   * 历史批次记录的课号引用（事件叙述）。第九批时 46 恰为全站开放数无需豁免；
   * 路径课试点批次 3 起全站开放数含 World 2 的 3 课（49），该课号引用转为豁免。 */
  'external-resources.js|开放第46课',
  /* catalog.test.cjs 头注释「2026-09-25 开放第 46 课 Choose Your Path Forward」：
   * 历史事件叙述 + Foundations 目录口径（catalog.test 的 AVAILABLE_TOTAL 刻意硬编码
   * 逼人复核，与本文件的全站推导口径刻意不统一——见本文件头注释）。 */
  'tests/catalog.test.cjs|开放第46课',
  /* map-boss.test.cjs 注释「v4.11.19 第三批：flexbox 组 5/5 全组开放（第 30 课…）」：
   * 历史批次记录的课号引用，非当前开放计数。 */
  'tests/map-boss.test.cjs|开放（第30课',
  /* lessons.js 课 32 正文「本站在第 07 课（准备工具）已经讲过」：课号引用
   * （指回第 07 课 installations 的环境选择），非当前开放计数。 */
  'lessons.js|本站在第07课',
  /* catalog.test.cjs 旧键「开放的 8 课」：第九批 46 课全开后断言改写为不带课数的
   * 「未开放课程不得在 lessons.js 中出现」，键随之删除。 */

  /* catalog.js 头注释的 flexbox 单元开放数：历史键「开放前 2 课」随第二批改写为
   * 「开放第 26–29 课（4/5）」——新句式「开放第 26–29 课」正则取到 29 恰为真值，
   * 无需豁免，旧键删除。 */
]);

/* ===================== R1 · 未开放范围端点 ===================== */
{
  const hits = scan(() => new RegExp(`(\\d+)\\s*[–—-]\\s*${CATALOG_TOTAL}`, 'g'), { cjkOnly: true });
  /* 防空转：正则写错或声明被删光时，下面的循环会一条都判不到 —— 那等于没守。
   * v4.11.20 第八批（第 45 课开放）起只剩 1 课未开放，「N–46」式范围声明已无
   * 合法用例（唯一常驻命中是豁免的 catalog.js|1-46 序号范围）；阈值随语义降到 1。
   * 批次 9（第 46 课开放、未开放归零）后本节需整体重表述。 */
  assert.ok(hits.length >= 1,
    check(`R1 至少命中 1 处「N–${CATALOG_TOTAL}」式未开放范围声明（实际 ${hits.length}；过少说明正则失效）`));

  let exemptUsed = 0;
  for (const hit of hits) {
    if (hit.n === LOCKED_FROM) continue;
    const key = keyOf(hit);
    assert.ok(R1_EXEMPT.has(key),
      check(`R1: ${hit.rel}:${hit.line} 未开放范围起点应为 ${LOCKED_FROM}，实为 ${hit.n}（${hit.text.slice(0, 72)}）`));
    exemptUsed += 1;
  }
  for (const key of R1_EXEMPT) {
    assert.ok(hits.some(h => keyOf(h) === key),
      check(`R1 死豁免「${key}」：该文案已不存在，请从豁免清单删除`));
  }
  console.log(`  R1 未开放范围端点：命中 ${hits.length} 处，豁免 ${exemptUsed} 处（应为 ${LOCKED_FROM}）`);
}

/* ===================== R2 · 当前态计数 ===================== */
{
  /* 数字两侧都要卡死，否则范围表达式会被拆着取数：
   *   (?<![\d–—-]) —— 前面不能是数字或破折号，保证取到的是完整数字（不是「46」里的「6」）；
   *   (?!\s*[–—-]) —— 后面不能紧跟破折号，排除范围起点（「21–46 课」里的 21）。
   * 范围声明归 R1 管，这里不重复断言，避免同一句话被两条规则要求成两个不同的值。 */
  const hits = scan(
    () => new RegExp('(当前|本站|已开放|开放)[^\\n]{0,8}?(?<![\\d–—-])(\\d+)(?!\\s*[–—-])\\s*课', 'g'),
    { numberGroup: 2 });
  assert.ok(hits.length >= 5,
    check(`R2 至少命中 5 处「开放 … N 课」式计数声明（实际 ${hits.length}；过少说明正则失效）`));

  let exemptUsed = 0;
  for (const hit of hits) {
    if (hit.n === AVAILABLE_TOTAL) continue;
    const key = keyOf(hit);
    assert.ok(R2_EXEMPT.has(key),
      check(`R2: ${hit.rel}:${hit.line} 当前开放数应为 ${AVAILABLE_TOTAL}，实为 ${hit.n}（${hit.text.slice(0, 72)}）`));
    exemptUsed += 1;
  }
  for (const key of R2_EXEMPT) {
    assert.ok(hits.some(h => keyOf(h) === key),
      check(`R2 死豁免「${key}」：该文案已不存在，请从豁免清单删除`));
  }
  console.log(`  R2 当前态计数：命中 ${hits.length} 处，豁免 ${exemptUsed} 处（应为 ${AVAILABLE_TOTAL}）`);
}

/* ===================== R3 · 版本号一致性 ===================== */
{
  const hits = [];
  versionSource.split(/\r?\n/).forEach((line, i) => {
    const re = /v\d+\.\d+\.\d+/g;
    let m;
    while ((m = re.exec(line))) hits.push({ line: i + 1, raw: m[0] });
  });
  /* 防空转：version.js 里一个 vX.Y.Z 字面量都没有时，下面的断言等于没跑。 */
  assert.ok(hits.length >= 1,
    check(`R3 version.js 至少含 1 处 vX.Y.Z 字面量可核（实际 ${hits.length}）`));
  for (const hit of hits) {
    assert.equal(hit.raw, `v${realVersion}`,
      check(`R3: version.js:${hit.line} 版本字面量 ${hit.raw} 必须等于实际版本 v${realVersion}`));
  }
  console.log(`  R3 版本号一致性：命中 ${hits.length} 处（应为 v${realVersion}）`);
}

console.log(`stale-claims.test.cjs：全部 ${checks} 项断言通过 ✔`);
