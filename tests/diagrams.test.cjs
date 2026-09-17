/* diagrams.js 与 assets/diagrams/ 下 SVG 概念图的独立测试（交接 §9）。
 *
 * 这些图是手工编写的 SVG 源码，没有经过任何构建或压缩，因此最容易出的问题是：
 * 标签没闭合（浏览器直接渲染成空白）、不小心引入远程字体或图片（违反“不依赖网络、
 * 不引入第三方图片版权”）、体积失控、以及绑定到不存在或尚未开放的课程。
 * 这里逐项钉住，另外把 §9 优先要求的那 8 个概念写死成期望绑定，
 * 这样日后有人删图或改绑定时测试会直接失败，而不是静默少一张图。
 */
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

/* §9 优先要求的 8 张图：概念 → 绑定的课程 id。
 * 写死绑定关系，是为了让“官方课程顺序变化”或“有人改绑定”时测试直接报警。 */
const EXPECTED_BINDINGS = [
  ['roles-html-css-js', 'introduction-to-html-and-css'],
  ['how-the-web-works', 'how-does-the-web-work'],
  ['command-line-tree', 'command-line-basics'],
  ['git-areas', 'introduction-to-git'],
  ['structure-and-style', 'introduction-to-html-and-css'],
  ['tag-anatomy', 'elements-and-tags'],
  ['html-boilerplate', 'html-boilerplate'],
  ['url-and-paths', 'links-and-images']
];
const MAX_EACH_BYTES = 20 * 1024;
const MAX_TOTAL_BYTES = 200 * 1024;
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
/* §9 要求 6-10 张，本轮做满优先清单里的 8 张 */
assert.ok(diagrams.diagrams.length >= 6 && diagrams.diagrams.length <= 10, `§9 要求 6-10 张图，实际 ${diagrams.diagrams.length}`);
assert.equal(diagrams.diagrams.length, EXPECTED_BINDINGS.length, '本轮做满 §9 优先要求的 8 张');

/* ---------- 2. 逐条校验 ---------- */
const ids = new Set();
const files = new Set();
let totalBytes = 0;
for (const item of diagrams.diagrams) {
  const label = item.id || '(缺 id)';
  assert.deepEqual(
    Object.keys(item).sort(),
    ['alt', 'caption', 'file', 'id', 'lessonId', 'points', 'zhTitle'].sort(),
    `${label}: 字段集合应恰好是这 7 个`
  );
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

  /* ---------- 6. 简体中文保险 ---------- */
  const chinese = item.zhTitle + item.alt + item.caption + item.points.join('');
  for (const char of TRADITIONAL_CHARS) {
    assert.ok(!chinese.includes(char), `${label}: 出现繁体字「${char}」`);
  }
}
assert.ok(totalBytes < MAX_TOTAL_BYTES, `8 张图合计 ${totalBytes} B 超过 §9 的 200 KB 上限`);

/* ---------- 7. 绑定关系与分布 ---------- */
assert.deepEqual(
  diagrams.diagrams.map(item => [item.id, item.lessonId]).sort(),
  [...EXPECTED_BINDINGS].sort(),
  '§9 优先要求的 8 个概念与绑定课程必须完全一致'
);
const perLesson = new Map();
diagrams.diagrams.forEach(item => perLesson.set(item.lessonId, (perLesson.get(item.lessonId) || 0) + 1));
for (const [lessonId, count] of perLesson) {
  assert.ok(count <= 2, `${lessonId}: 一课挂了 ${count} 张图，图是补充不是主体（§9 不替代正文）`);
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

console.log(`通过：${diagrams.diagrams.length} 张本站原创 SVG 概念图（合计 ${(totalBytes / 1024).toFixed(1)} KB，单张最大 ${(Math.max(...diagrams.diagrams.map(d => fs.statSync(path.join(root, diagrams.directory, d.file)).size)) / 1024).toFixed(1)} KB）、覆盖 ${perLesson.size} 节课、§9 优先 8 个概念绑定一致、XML 良构、含 title/desc 与 role=img、只用系统字体、无远程引用与脚本、单张 < 20 KB 且合计 < 200 KB、简体中文保险、两个 HTML 的加载顺序。`);
