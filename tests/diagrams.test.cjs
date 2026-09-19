/* diagrams.js 与 assets/diagrams/ 下 SVG 概念图的独立测试（交接 §9）。
 *
 * 这些图是本站原创 SVG 源码（v4.11.4 及以前全部手工编写；v4.11.5 起新增图由
 * tools/build-diagrams.mjs 生成，运行时形态不变），最容易出的问题是：
 * 标签没闭合（浏览器直接渲染成空白）、不小心引入远程字体或图片（违反“不依赖网络、
 * 不引入第三方图片版权”）、体积失控、以及绑定到不存在或尚未开放的课程。
 * 这里逐项钉住；绑定关系自 v4.11.5 起数据驱动——手工世代 8 条写死在 LEGACY_BINDINGS，
 * 生成世代的绑定读自生成器 GEOMETRY_SPECS，两者并集必须与清单完全一致，
 * 这样日后有人删图或改绑定时测试会直接失败，而不是静默少一张图。
 * 生成图另有三道钉：生成器幂等、入库 SVG 与生成器产出逐字节一致（防「改了数据
 * 忘了重新生成」）、sectionIndex 范围合法（按章归位试点）。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function loadData(file, globalName) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox);
  return JSON.parse(JSON.stringify(sandbox.window[globalName]));
}

const diagrams = loadData('diagrams.js', 'ODIN_DIAGRAMS');
const guide = loadData('lessons.js', 'ODIN_GUIDE');

const TRADITIONAL_CHARS = '個們來時說後過發對還進種會學將無現點實樣經麼頭開問間馬鳥魚車東長書電話腦見觀視聽寫讀記憶體軟網頁連線圖檔資訊號設計劃輸處變據庫係統應執碼鍵數單雙復複選擇載陣類參屬監觸獲擊佈顏';

/* §9 首轮手工编写的 8 张图：概念 → 绑定的课程 id。
 * 写死绑定关系，是为了让「官方课程顺序变化」或「有人改绑定」时测试直接报警。
 * v4.11.5（交接 3.G）起绑定关系改为**数据驱动**：生成图（tools/build-diagrams.mjs
 * 的 GEOMETRY_SPECS）的绑定从生成器读取，本清单只继续钉住手工世代的 8 条——
 * 两者并集必须与 diagrams.js 清单完全一致（防静默少图的保护不变：少任何一条、
 * 改任何一条绑定，这里都会红）。 */
const LEGACY_BINDINGS = [
  ['roles-html-css-js', 'introduction-to-html-and-css'],
  ['how-the-web-works', 'how-does-the-web-work'],
  ['command-line-tree', 'command-line-basics'],
  ['git-areas', 'git-basics'], /* v4.11.2 B：四区域工作流图归位到实际讲 add/commit/push 的课 */
  ['structure-and-style', 'introduction-to-html-and-css'],
  ['tag-anatomy', 'elements-and-tags'],
  ['html-boilerplate', 'html-boilerplate'],
  ['url-and-paths', 'links-and-images']
];
const MAX_EACH_BYTES = 20 * 1024;
/* v4.11.5（交接 3.G）：图可规模化生产后总量上限 200 KB → 600 KB；
 * 单张 20 KB 上限不变（手机流量与加载体验的红线没变）。 */
const MAX_TOTAL_BYTES = 600 * 1024;
/* SVG 里允许出现的系统字体（§9：使用系统字体，不打包字体） */
const ALLOWED_FONTS = [
  'PingFang SC', 'Microsoft YaHei', 'system-ui', 'sans-serif', 'serif',
  'ui-monospace', 'Cascadia Mono', 'Consolas', 'Courier New', 'monospace'
];

/* ---------- 极简 XML 良构检查 ----------
 * Node 没有内置 XML 解析器，而本项目不允许装依赖，所以自己写一个只够用的扫描器：
 * 它要抓的是“标签没闭合 / 引号不配对”这类会让浏览器渲染成空白的真实错误，
 * 不是要做完整的 XML 校验。 */
function checkWellFormed(source, label) {
  const problems = [];
  const text = source.replace(/<!--[\s\S]*?-->/g, '');
  const stack = [];
  const tagPattern = /<(\/?)([A-Za-z_][\w.-]*)((?:\s+[^\s=>]+="[^"]*")*)\s*(\/?)>/g;
  let consumed = 0;
  let match;
  while ((match = tagPattern.exec(text)) !== null) {
    /* 标签之间的裸文本里不应该再出现 <，否则说明有一个标签没被正则匹配上
     * （通常是属性引号没配对），这正是最容易导致整张图渲染失败的错误。 */
    const between = text.slice(consumed, match.index);
    if (between.includes('<')) {
      problems.push(`${label}: 位置 ${consumed} 之后存在无法解析的 "<"，多半是属性引号没配对`);
    }
    consumed = tagPattern.lastIndex;
    const [, closing, name, attrs, selfClose] = match;
    if (attrs) {
      const stray = attrs.replace(/\s+[^\s=>]+="[^"]*"/g, '').trim();
      if (stray) problems.push(`${label}: <${name}> 的属性写法异常：${stray}`);
    }
    if (closing) {
      const open = stack.pop();
      if (open !== name) problems.push(`${label}: 结束标签 </${name}> 与最近的开始标签 <${open || '（无）'}> 不配对`);
    } else if (!selfClose) {
      stack.push(name);
    }
  }
  if (text.slice(consumed).includes('<')) {
    problems.push(`${label}: 文末存在无法解析的 "<"`);
  }
  if (stack.length) problems.push(`${label}: 有标签未闭合：${stack.join(', ')}`);
  return problems;
}

/* ---------- 1. 清单结构 ---------- */
assert.equal(diagrams.version, 1, 'diagrams 清单应带版本号');
assert.equal(typeof diagrams.directory, 'string', 'directory 必须是字符串');
assert.ok(diagrams.directory.endsWith('/'), 'directory 应以斜杠结尾，便于与文件名直接拼接');
assert.ok(/原创/.test(diagrams.license), '许可说明应写明本站原创（§9：不引入第三方图片版权）');
assert.ok(/CC BY-NC-SA 4\.0/.test(diagrams.license), '许可说明应与全站内容一致采用 CC BY-NC-SA 4.0');
assert.ok(Array.isArray(diagrams.diagrams), 'diagrams 必须是数组');
/* §9 下限保持（图是补充不是主体，至少 6 张才构成一套概念骨架）；
 * 精确数量由文件尾的「绑定并集」断言钉住（手工 8 条 + 生成器 specs）。 */
assert.ok(diagrams.diagrams.length >= 6, `§9 要求至少 6 张图，实际 ${diagrams.diagrams.length}`);

/* ---------- 2. 逐条校验 ---------- */
const ids = new Set();
const files = new Set();
let totalBytes = 0;
for (const item of diagrams.diagrams) {
  const label = item.id || '(缺 id)';
  /* v4.11.5（交接 3.E）：字段集合 = 原 7 个必需 + 可选 sectionIndex
   * （带该字段的图插入「中文讲解」对应章节之后；不带的保持旧位置）。 */
  const keys = Object.keys(item).sort();
  const hasSectionIndex = keys.includes('sectionIndex');
  const expectedKeys = ['alt', 'caption', 'file', 'id', 'lessonId', 'points', 'zhTitle']
    .concat(hasSectionIndex ? ['sectionIndex'] : []).sort();
  assert.deepEqual(keys, expectedKeys, `${label}: 字段集合应恰好是 7 个必需${hasSectionIndex ? ' + sectionIndex' : ''}`);
  if (hasSectionIndex) {
    assert.ok(Number.isInteger(item.sectionIndex) && item.sectionIndex >= 0,
      `${label}: sectionIndex 必须是非负整数（章节下标）`);
  }
  for (const key of ['id', 'file', 'lessonId', 'zhTitle', 'alt', 'caption']) {
    assert.equal(typeof item[key], 'string', `${label}: ${key} 必须是字符串`);
    assert.ok(item[key].trim(), `${label}: ${key} 不得为空`);
  }
  assert.match(item.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${label}: id 格式异常`);
  assert.ok(!ids.has(item.id), `${label}: id 重复`);
  ids.add(item.id);
  assert.match(item.file, /^[a-z0-9-]+\.svg$/, `${label}: file 应为小写 .svg 文件名`);
  assert.ok(!files.has(item.file), `${label}: file 重复 ${item.file}`);
  files.add(item.file);
  /* §9：每张图配 figcaption 或等价文字说明；alt 与 caption 都必须真的能替代图片 */
  assert.ok(item.alt.length >= 40, `${label}: alt 过短（${item.alt.length} 字），不足以替代整张图的信息`);
  assert.ok(item.caption.length >= 16, `${label}: caption 过短，起不到 figcaption 的作用`);
  assert.ok(Array.isArray(item.points) && item.points.length >= 2 && item.points.length <= 4, `${label}: points 应为 2-4 条`);
  item.points.forEach((point, index) => {
    assert.ok(typeof point === 'string' && point.trim().length >= 8, `${label}: 第 ${index + 1} 条要点过短`);
  });

  /* ---------- 3. 文件必须真实存在且是本地 SVG ---------- */
  const filePath = path.join(root, diagrams.directory, item.file);
  assert.ok(fs.existsSync(filePath), `${label}: 文件不存在 ${diagrams.directory}${item.file}`);
  const source = fs.readFileSync(filePath, 'utf8');
  const bytes = fs.statSync(filePath).size;
  totalBytes += bytes;
  assert.ok(bytes < MAX_EACH_BYTES, `${label}: 单张 ${bytes} B 超过 §9 的 20 KB 上限`);

  assert.ok(source.startsWith('<svg '), `${label}: 文件应以 <svg 开头，不能有 XML 声明或 BOM`);
  assert.ok(source.includes('xmlns="http://www.w3.org/2000/svg"'), `${label}: 缺少 SVG 命名空间，浏览器会当成普通 XML`);
  const viewBox = source.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);
  assert.ok(viewBox, `${label}: 缺少 viewBox，图片无法等比缩放`);
  const widthAttr = source.match(/<svg [^>]*\swidth="(\d+(?:\.\d+)?)"/);
  const heightAttr = source.match(/<svg [^>]*\sheight="(\d+(?:\.\d+)?)"/);
  assert.ok(widthAttr && heightAttr, `${label}: 根元素缺少 width/height，<img> 的固有宽高比会有歧义`);
  assert.equal(widthAttr[1], viewBox[1], `${label}: width 与 viewBox 宽度不一致`);
  assert.equal(heightAttr[1], viewBox[2], `${label}: height 与 viewBox 高度不一致`);
  assert.ok(source.includes('role="img"'), `${label}: 缺少 role="img"`);
  const labelledBy = source.match(/aria-labelledby="([^"]+)"/);
  assert.ok(labelledBy, `${label}: 缺少 aria-labelledby`);
  /* §8.2：SVG 图要有文本替代。图内自带的 title/desc 是第二层替代，
   * 必须真实存在且 id 与 aria-labelledby 对得上。 */
  labelledBy[1].split(/\s+/).forEach(id => {
    assert.ok(source.includes(`id="${id}"`), `${label}: aria-labelledby 指向的 id="${id}" 不存在`);
  });
  assert.ok(new RegExp(`<title id="${labelledBy[1].split(/\s+/)[0]}">`).test(source), `${label}: 缺少 <title>`);
  assert.ok(new RegExp(`<desc id="${labelledBy[1].split(/\s+/)[1]}">`).test(source), `${label}: 缺少 <desc>`);

  /* ---------- 4. 不依赖网络、不含脚本、不打包字体 ---------- */
  const problems = checkWellFormed(source, label);
  assert.deepEqual(problems, [], `${label}: SVG 不是良构的 XML`);
  assert.ok(!/<script/i.test(source), `${label}: SVG 里不得有 <script>`);
  assert.ok(!/<foreignObject/i.test(source), `${label}: SVG 里不得有 foreignObject`);
  assert.ok(!/<image\b/i.test(source), `${label}: SVG 里不得内嵌位图 <image>（必须全部是矢量线条）`);
  assert.ok(!/javascript:/i.test(source), `${label}: SVG 里不得出现 javascript: 协议`);
  assert.ok(!/\son[a-z]+\s*=/i.test(source), `${label}: SVG 里不得有内联事件属性`);
  assert.ok(!/@font-face/i.test(source), `${label}: §9 要求使用系统字体，不得打包字体`);
  assert.ok(!/fonts\.(googleapis|gstatic)/i.test(source), `${label}: 不得引用在线字体`);
  /* 除 SVG 命名空间本身以外，不得出现任何远程 URL；
   * 唯一例外是 url-and-paths.svg 把官方网址当作“绝对 URL”的教学示例写在 <text> 里，
   * 那是文字内容而不是资源引用，所以下面只检查会真正发起请求的属性。 */
  const remoteRefs = source.match(/(?:href|src|xlink:href)\s*=\s*"(https?:)?\/\/[^"]*"/gi) || [];
  assert.deepEqual(remoteRefs, [], `${label}: SVG 里不得有远程资源引用`);
  const cssUrls = source.match(/url\(\s*['"]?([^)'"]+)['"]?\s*\)/gi) || [];
  cssUrls.forEach(value => {
    assert.ok(/url\(\s*['"]?#/.test(value), `${label}: CSS url() 只允许引用同文件内的片段，实际 ${value}`);
  });
  const httpMentions = source.match(/https?:\/\/[^\s<"']+/g) || [];
  httpMentions.forEach(value => {
    const allowed = value === 'http://www.w3.org/2000/svg'
      || value.startsWith('https://www.theodinproject.com/');
    assert.ok(allowed, `${label}: 出现意外的外部 URL ${value}`);
  });
  /* 字体白名单：font-family 里只允许系统字体名 */
  const families = source.match(/font-family:\s*([^;}]+)/g) || [];
  families.forEach(declaration => {
    const value = declaration.replace(/^font-family:\s*/, '');
    value.split(',').forEach(rawName => {
      const name = rawName.trim().replace(/^["']|["']$/g, '');
      assert.ok(ALLOWED_FONTS.includes(name), `${label}: 使用了非系统字体「${name}」`);
    });
  });

  /* ---------- 5. 绑定到真实存在、且已经开放的课程 ---------- */
  const lesson = guide.lessons.find(entry => entry.id === item.lessonId);
  assert.ok(lesson, `${label}: 绑定到不存在的课程 ${item.lessonId}`);
  assert.ok(Array.isArray(lesson.sections), `${label}: 绑定的课程 ${item.lessonId} 不是 v2 自足讲解格式，渲染路径里没有插图位置`);
  /* v4.11.5（交接 3.E）：sectionIndex 范围校验——0..sections.length-1。
   * 渲染层对越界值有回落（不崩），但数据层越界必须在这里红：坏数据不进仓库。 */
  if (hasSectionIndex) {
    assert.ok(item.sectionIndex < lesson.sections.length,
      `${label}: sectionIndex ${item.sectionIndex} 越界（本课共 ${lesson.sections.length} 章，合法范围 0..${lesson.sections.length - 1}）`);
  }

  /* ---------- 6. 简体中文保险 ---------- */
  const chinese = item.zhTitle + item.alt + item.caption + item.points.join('');
  for (const char of TRADITIONAL_CHARS) {
    assert.ok(!chinese.includes(char), `${label}: 出现繁体字「${char}」`);
  }
}
assert.ok(totalBytes < MAX_TOTAL_BYTES, `全部图合计 ${totalBytes} B 超过 600 KB 上限（v4.11.5 起图可规模化生产，交接 3.G）`);

/* ---------- 7. 绑定关系与分布（v4.11.5 数据驱动） ---------- */
/* 绑定并集断言（手工 8 条 + 生成器 GEOMETRY_SPECS）在文件尾第 9 节执行——
 * 生成器是 ESM，只能异步 import；防静默少图的保护在那里：清单与
 * 「手工清单 + 生成器几何数据」的并集必须完全一致。 */
const perLesson = new Map();
diagrams.diagrams.forEach(item => perLesson.set(item.lessonId, (perLesson.get(item.lessonId) || 0) + 1));
for (const [lessonId, count] of perLesson) {
  if (count <= 2) continue;
  /* 按章归位试点纪律（v4.11.5 交接 3.E）：超过 2 张图的课，每张图都必须带
   * 互不相同的 sectionIndex（一章一图）。「图堆在整节末尾」是旧做法，
   * 试点课作为例外放开数量，但放开的方式是逐章归位而不是无限制堆图。 */
  const items = diagrams.diagrams.filter(entry => entry.lessonId === lessonId);
  const lesson = guide.lessons.find(entry => entry.id === lessonId);
  const indexes = items.map(entry => entry.sectionIndex);
  assert.ok(indexes.every(value => Number.isInteger(value)),
    `${lessonId}: 一课 ${count} 张图必须全部带 sectionIndex（按章归位纪律）`);
  assert.equal(new Set(indexes).size, indexes.length,
    `${lessonId}: sectionIndex 必须互不相同（一章一图）`);
  assert.ok(indexes.every(value => value >= 0 && value < lesson.sections.length),
    `${lessonId}: sectionIndex 越出章节范围`);
}
assert.ok(perLesson.size >= 6, `图应分布在多节课上，实际只覆盖 ${perLesson.size} 节`);

/* ---------- 8. 源码级约束与加载顺序 ---------- */
const source = fs.readFileSync(path.join(root, 'diagrams.js'), 'utf8');
assert.ok(!/\bfetch\(|XMLHttpRequest|innerHTML|document\.cookie/.test(source), 'diagrams.js 不联网、不注入标记、不读写 cookie');
for (const file of ['index.html', 'lesson.html']) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const at = html.indexOf('src="diagrams.js"');
  const appAt = html.indexOf('src="app.js"');
  assert.ok(at >= 0, `${file}: 未加载 diagrams.js`);
  assert.ok(at < appAt, `${file}: diagrams.js 必须在 app.js 之前加载`);
}
/* 清单里引用的每个文件都要真实存在，且目录里没有清单外的孤儿 SVG */
const onDisk = fs.readdirSync(path.join(root, diagrams.directory)).filter(name => name.endsWith('.svg')).sort();
assert.deepEqual(onDisk, [...files].sort(), 'assets/diagrams/ 下的文件应与清单完全对应，不多不少');

/* ---------- 9. 生成器一致性（v4.11.5 交接 3.D / 3.G） ----------
 * 生成器是 ESM 且是开发期工具，这里动态 import 它的纯函数做四件事：
 *   9a 绑定并集：diagrams.js 清单 = 手工 8 条 + GEOMETRY_SPECS，逐条 lessonId /
 *      sectionIndex / file 交叉一致——少一条、改一条绑定、清单与生成器任一边
 *      漂移都会红（防静默少图的保护，取代 v4.11.4 之前写死 8 条的写法）；
 *   9b 幂等：同一 spec 连续两次 buildSvg 产出逐字节一致；
 *   9c 入库一致：assets/diagrams/ 下的生成图必须与 buildSvg 产出逐字节一致
 *      （CRLF 归一后比——autocrlf 检出可能带 \r\n），防止「改了数据忘了重新生成」；
 *   9d 清单文字同步：生成 SVG 的 <title>/<desc> 内容必须等于清单 zhTitle/alt
 *      （buildSvg 直接读清单，这里反向钉住清单与磁盘的对应关系）。 */
(async () => {
  const { pathToFileURL } = require('node:url');
  const tool = await import(pathToFileURL(path.join(root, 'tools', 'build-diagrams.mjs')).href);
  const specs = tool.GEOMETRY_SPECS;
  assert.ok(Array.isArray(specs) && specs.length >= 1, '9a: 生成器必须有几何数据 specs');
  const specIds = new Set(specs.map(spec => spec.id));
  assert.equal(specIds.size, specs.length, '9a: specs 的 id 不得重复');
  /* 9a 绑定并集 */
  const expectedBindings = [...LEGACY_BINDINGS, ...specs.map(spec => [spec.id, spec.lessonId])];
  assert.deepEqual(
    diagrams.diagrams.map(item => [item.id, item.lessonId]).sort(),
    expectedBindings.slice().sort(),
    '9a: diagrams.js 清单必须恰好等于「手工 8 条 + 生成器 specs」的绑定并集'
  );
  for (const spec of specs) {
    const manifestEntry = diagrams.diagrams.find(item => item.id === spec.id);
    assert.ok(manifestEntry, `9a: 清单缺少生成图条目 ${spec.id}（静默少图保护）`);
    assert.equal(manifestEntry.file, spec.file, `9a: ${spec.id} 清单 file 与生成器不一致`);
    assert.equal(manifestEntry.lessonId, spec.lessonId, `9a: ${spec.id} 绑定课程被改动`);
    assert.equal(manifestEntry.sectionIndex, spec.sectionIndex, `9a: ${spec.id} sectionIndex 清单与生成器不一致`);
    /* 9b 幂等 */
    const first = tool.buildSvg(manifestEntry, spec);
    const second = tool.buildSvg(manifestEntry, spec);
    assert.equal(first, second, `9b: ${spec.id} 生成器不幂等（同样输入两次产出不同）`);
    /* 9c 入库一致（autocrlf 检出可能带 \r\n，归一后比） */
    const filePath = path.join(root, diagrams.directory, spec.file);
    const onDiskText = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
    assert.equal(onDiskText, first,
      `9c: ${spec.file} 入库内容与生成器产出不一致——数据改过但忘了跑 node tools/build-diagrams.mjs`);
    /* 9d title/desc 与清单文字同源 */
    assert.ok(onDiskText.includes(`<title id="t-${spec.id}">`), `9d: ${spec.id} SVG title id 规范`);
    assert.ok(onDiskText.includes(`<desc id="d-${spec.id}">`), `9d: ${spec.id} SVG desc id 规范`);
    assert.ok(onDiskText.includes(manifestEntry.zhTitle), `9d: ${spec.id} SVG title 应等于清单 zhTitle`);
  }
  console.log(`通过：${diagrams.diagrams.length} 张本站原创 SVG 概念图（合计 ${(totalBytes / 1024).toFixed(1)} KB，单张最大 ${(Math.max(...diagrams.diagrams.map(d => fs.statSync(path.join(root, diagrams.directory, d.file)).size)) / 1024).toFixed(1)} KB）、覆盖 ${perLesson.size} 节课；手工 8 条绑定 + 生成器 ${specs.length} 条 specs 数据驱动并集一致、XML 良构、含 title/desc 与 role=img、只用系统字体、无远程引用与脚本、单张 < 20 KB 且合计 < 600 KB、简体中文保险、sectionIndex 范围合法（按章归位试点）、两个 HTML 的加载顺序、生成器幂等且入库 SVG 与产出逐字节一致。`);
})().catch(error => {
  console.error(error && error.message ? error.message : error);
  process.exitCode = 1;
});
