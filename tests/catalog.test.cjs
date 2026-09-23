/* catalog.js 的独立测试：官方 Foundations 完整 46 课目录。
 *
 * 这个文件是纯数据，但它承担了一个很容易出错的责任：界面上的“总进度 X / 46”“已开放 20 / 46”
 * 全部由它决定。所以这里的断言重点不是“字段存在”，而是三件会真实伤害用户的事：
 *   1. 46 条目录与官方顺序、分组、Project 标记一致，且中英文标题都齐全；
 *   2. available 只在 01-20 为 true —— 一旦有人把 21-46 标成 true，界面就会生成
 *      指向不存在课程页的链接（红线：逐课开放，不得批量灌入）；
 *   3. lessons.js 里绝不会出现 21-46 的正文（同一红线），
 *      同时 01-20 的 slug / 英文标题 / 简体中文标题在两份文件里必须逐字一致，
 *      不允许同一个官方课程在本站有两种中文译名。
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function loadData(file, globalName) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox);
  /* 走一次 JSON 往返：确保目录是纯数据，没有函数、Date 或循环引用混进来 */
  return JSON.parse(JSON.stringify(sandbox.window[globalName]));
}

const catalog = loadData('catalog.js', 'ODIN_CATALOG');
const guide = loadData('lessons.js', 'ODIN_GUIDE');

/* 与 content.test.cjs 用同一份繁体字表：路线 A 要求全部中文内容为简体自研 */
const TRADITIONAL_CHARS = '個們來時說後過發對還進種會學將無現點實樣經麼頭開問間馬鳥魚車東長書電話腦見觀視聽寫讀記憶體軟網頁連線圖檔資訊號設計劃輸處變據庫係統應執碼鍵數單雙復複選擇載陣類參屬監觸獲擊佈顏';

const CATALOG_TOTAL = 46;
/* 本站当前开放到第几课（2026-09-23 开放第 20 课 Project: Recipes）。刻意保留为
 * 显式常量、逐轮人工更新，不改成从 catalog 推导——那会变成同义反复，失去
 * 「逼人复核开放范围」的作用（规划 20260923-1320 §3.3.3 的判断）。 */
const AVAILABLE_TOTAL = 20;
/* 官方 Foundations 的 5 个 Project；顺序号写死，是为了让“官方目录发生增删”时
 * 这个测试直接失败并逼人复核，而不是静默跟着数据漂移。 */
const EXPECTED_PROJECTS = [
  [20, 'recipes'],
  [30, 'landing-page'],
  [38, 'rock-paper-scissors'],
  [43, 'etch-a-sketch'],
  [45, 'calculator']
];
const EXPECTED_GROUP_IDS = [
  'introduction', 'prerequisites', 'git-basics', 'html-foundations',
  'css-foundations', 'flexbox', 'javascript-basics', 'conclusion'
];

/* ---------- 1. 顶层结构 ---------- */
assert.equal(catalog.version, 1, 'catalog 应带版本号');
assert.match(catalog.verifiedAt, /^\d{4}-\d{2}-\d{2}$/, '核对日期应为 YYYY-MM-DD');
assert.equal(catalog.courseUrl, 'https://www.theodinproject.com/paths/foundations/courses/foundations', '官方课程目录 URL');
assert.ok(Array.isArray(catalog.groups) && Array.isArray(catalog.lessons), 'groups 与 lessons 都必须是数组');
assert.equal(catalog.lessons.length, CATALOG_TOTAL, `官方 Foundations 共 ${CATALOG_TOTAL} 课`);
assert.equal(catalog.groups.length, EXPECTED_GROUP_IDS.length, '官方 Foundations 共 8 个分组');

/* ---------- 2. 分组 ---------- */
assert.deepEqual(catalog.groups.map(g => g.id), EXPECTED_GROUP_IDS, '分组 id 与官方顺序一致');
for (const group of catalog.groups) {
  for (const key of ['id', 'en', 'zh']) {
    assert.equal(typeof group[key], 'string', `${group.id}: ${key} 必须是字符串`);
    assert.ok(group[key].trim(), `${group.id}: ${key} 不得为空`);
  }
  assert.equal(typeof group.count, 'number', `${group.id}: count 必须是数字`);
  const actual = catalog.lessons.filter(l => l.group === group.id).length;
  assert.equal(group.count, actual, `${group.id}: count=${group.count} 与实际课程数 ${actual} 不一致`);
}
/* 前 4 个分组的中英文名必须与 lessons.js 逐字一致：同一个官方分组只能有一种中文说法 */
guide.groups.forEach((group, index) => {
  assert.equal(catalog.groups[index].en, group.en, `分组 ${index} 英文名与 lessons.js 不一致`);
  assert.equal(catalog.groups[index].zh, group.zh, `分组 ${index} 中文名与 lessons.js 不一致`);
});
/* 同一分组的课程在目录里必须是连续的一段，否则按分组渲染会漏课或重复 */
{
  const seen = [];
  for (const lesson of catalog.lessons) {
    if (!seen.length || seen[seen.length - 1] !== lesson.group) {
      assert.ok(!seen.includes(lesson.group), `${lesson.slug}: 分组 ${lesson.group} 在目录中不连续`);
      seen.push(lesson.group);
    }
  }
  assert.deepEqual(seen, EXPECTED_GROUP_IDS, '分组出现顺序应与 groups 一致');
}

/* ---------- 3. 46 条课程逐条校验 ---------- */
const slugs = new Set();
for (const [index, lesson] of catalog.lessons.entries()) {
  const label = `第 ${index + 1} 条`;
  assert.deepEqual(
    Object.keys(lesson).sort(),
    ['available', 'group', 'order', 'slug', 'title', 'type', 'zh'].sort(),
    `${label}: 字段集合应恰好是 §6.1 要求的 7 个`
  );
  assert.equal(lesson.order, index + 1, `${label}: order 应为 ${index + 1}，实际 ${lesson.order}`);
  assert.match(lesson.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${label}: slug 格式异常 ${lesson.slug}`);
  assert.ok(!slugs.has(lesson.slug), `${label}: slug 重复 ${lesson.slug}`);
  slugs.add(lesson.slug);
  assert.ok(lesson.title.trim(), `${label}: 缺少官方英文标题`);
  assert.ok(lesson.zh.trim(), `${label}: 缺少简体中文标题`);
  assert.ok(EXPECTED_GROUP_IDS.includes(lesson.group), `${label}: 未知分组 ${lesson.group}`);
  assert.ok(['lesson', 'project'].includes(lesson.type), `${label}: type 只能是 lesson 或 project，实际 ${lesson.type}`);
  assert.equal(typeof lesson.available, 'boolean', `${label}: available 必须是布尔值`);
  /* Project 的官方英文标题一律以 "Project: " 开头，中文标题一律以「项目」开头，
   * 这样界面上“项目”标记不会与数据打架（§6.2） */
  if (lesson.type === 'project') {
    assert.match(lesson.title, /^Project: /, `${label}: project 的英文标题应以 "Project: " 开头`);
    assert.ok(lesson.zh.startsWith('项目'), `${label}: project 的中文标题应以「项目」开头，实际 ${lesson.zh}`);
  } else {
    assert.ok(!lesson.title.startsWith('Project: '), `${label}: 英文标题是 Project 但 type 不是 project`);
  }
  /* 英文标题原样保留，不得被翻译成中文或加上本站后缀 */
  assert.ok(!/[一-鿿]/.test(lesson.title), `${label}: 英文标题里混入了中文字符`);
}

/* ---------- 4. Project 清单 ---------- */
assert.deepEqual(
  catalog.lessons.filter(l => l.type === 'project').map(l => [l.order, l.slug]),
  EXPECTED_PROJECTS,
  '官方 Foundations 的 5 个 Project 与顺序号一致'
);

/* ---------- 5. available 边界（§6.1 / §6.2 / §6.4 的核心红线） ---------- */
catalog.lessons.forEach(lesson => {
  const shouldBeAvailable = lesson.order <= AVAILABLE_TOTAL;
  assert.equal(
    lesson.available, shouldBeAvailable,
    `${lesson.slug}: order=${lesson.order} 的 available 应为 ${shouldBeAvailable}（本站当前开放前 ${AVAILABLE_TOTAL} 课，逐课开放、与 lessons.js 双向一致）`
  );
});
assert.equal(catalog.lessons.filter(l => l.available).length, AVAILABLE_TOTAL, '已开放课程数');
assert.equal(catalog.lessons.filter(l => !l.available).length, CATALOG_TOTAL - AVAILABLE_TOTAL, '未开放课程数');
/* 未开放课程不得携带任何本站正文入口信息 */
for (const lesson of catalog.lessons.filter(l => !l.available)) {
  assert.equal(lesson.url, undefined, `${lesson.slug}: 未开放课程不得带本站 url 字段`);
}

/* ---------- 6. 与 lessons.js 的双向交叉校验 ---------- */
const available = catalog.lessons.filter(l => l.available);
assert.deepEqual(available.map(l => l.slug), guide.lessons.map(l => l.id), '已开放 20 课的 slug 与 lessons.js 的 id 顺序完全一致');
assert.deepEqual(available.map(l => l.title), guide.lessons.map(l => l.title), '已开放 20 课的英文标题与 lessons.js 逐字一致');
assert.deepEqual(available.map(l => l.zh), guide.lessons.map(l => l.zh), '已开放 20 课的简体中文标题与 lessons.js 逐字一致（不得有第二种译名）');
/* lessons.js 的 group 是前 4 个分组的下标，catalog 的 group 是分组 id，两者必须指同一个分组 */
guide.lessons.forEach((lesson, index) => {
  const expectedGroupId = catalog.groups[lesson.group].id;
  assert.equal(available[index].group, expectedGroupId, `${lesson.id}: 分组归属不一致`);
});
/* 红线：未开放课程（当前 21-46）的正文绝不允许出现在 lessons.js 里。
 * 推导式断言——开放范围推进后自动继续保护剩余课程，不得改成 l.order > N 的范围写法。 */
const guideIds = new Set(guide.lessons.map(l => l.id));
const leaked = catalog.lessons.filter(l => !l.available && guideIds.has(l.slug));
assert.deepEqual(leaked.map(l => l.slug), [], '未开放的 26 课不得在 lessons.js 中出现（红线：未开放课程的正文绝不进 lessons.js）');
assert.equal(guide.lessons.length, AVAILABLE_TOTAL, 'lessons.js 的中文正文数必须等于 catalog 标记为 available 的课程数');

/* ---------- 7. §6.4 三个进度数字不得互相打架 ---------- */
/* 界面上的总进度分母取 catalog.lessons.length，已开放分母取 lessons.js 的长度，
 * 完成数只可能来自已开放课程。这里把这三个数字的关系钉死。 */
assert.equal(catalog.lessons.length, 46, '总进度分母必须是 46');
assert.equal(guide.lessons.length, AVAILABLE_TOTAL, '已开放分母必须等于 AVAILABLE_TOTAL');
assert.ok(guide.lessons.length < catalog.lessons.length, '已开放课程数必须小于总数，否则“20 / 46”就没有意义');
assert.equal(
  catalog.lessons.filter(l => l.available).length, guide.lessons.length,
  'available 的课程数必须等于 lessons.js 的课程数，否则完成数可能超过已开放数'
);

/* ---------- 8. 简体中文保险 ---------- */
const allChinese = catalog.lessons.map(l => l.zh).join('') + catalog.groups.map(g => g.zh).join('');
for (const char of TRADITIONAL_CHARS) {
  assert.ok(!allChinese.includes(char), `目录中文标题未使用繁体字「${char}」`);
}

/* ---------- 9. 源码级约束 ---------- */
const catalogSource = fs.readFileSync(path.join(root, 'catalog.js'), 'utf8');
assert.ok(!/\bfetch\(|XMLHttpRequest|innerHTML|document\.cookie/.test(catalogSource), 'catalog.js 不联网、不使用 innerHTML、不读写 cookie');
assert.ok(!/<iframe/.test(catalogSource), 'catalog.js 不含 iframe');
assert.ok(!/(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{10,})/.test(catalogSource), 'catalog.js 不含任何真实 token 形态字符串');
/* 目录是纯数据文件，除官方课程目录本身外不应出现其他外部 URL */
const urls = catalogSource.match(/https?:\/\/[^'"\s]+/g) || [];
assert.deepEqual([...new Set(urls)], [catalog.courseUrl], 'catalog.js 只应引用官方课程目录一个外部 URL');
assert.ok(!fs.existsSync(path.join(root, 'package.json')), '无构建与运行依赖');

/* ---------- 10. 两个页面都必须在 app.js 之前加载 catalog.js ---------- */
for (const file of ['index.html', 'lesson.html']) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const catalogAt = html.indexOf('src="catalog.js"');
  const appAt = html.indexOf('src="app.js"');
  assert.ok(catalogAt >= 0, `${file}: 未加载 catalog.js`);
  assert.ok(appAt >= 0, `${file}: 未加载 app.js`);
  assert.ok(catalogAt < appAt, `${file}: catalog.js 必须在 app.js 之前加载，否则 app.js 读不到目录`);
  assert.ok(html.lastIndexOf('src="progress.js"') < appAt, `${file}: progress.js 必须在 app.js 之前加载`);
}

const projectCount = catalog.lessons.filter(l => l.type === 'project').length;
console.log(`通过：官方 Foundations ${CATALOG_TOTAL} 课目录（8 个分组、${projectCount} 个 Project）、order 连续唯一、中英文标题齐全且与 lessons.js 逐字一致、已开放 ${AVAILABLE_TOTAL} 课 / 未开放 ${CATALOG_TOTAL - AVAILABLE_TOTAL} 课、未开放课程未混入 lessons.js、总进度分母 46 与已开放分母 ${AVAILABLE_TOTAL} 不打架、简体中文保险、纯数据无联网、两个 HTML 的加载顺序。`);
