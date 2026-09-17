const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'lessons.js'), 'utf8'), sandbox);
const data = JSON.parse(JSON.stringify(sandbox.window.ODIN_GUIDE));
const sources = JSON.parse(fs.readFileSync(path.join(root, 'sources.json'), 'utf8'));
const expectedIds = [
  'how-this-course-will-work', 'introduction-to-web-development', 'motivation-and-mindset',
  'asking-for-help', 'join-the-odin-community', 'how-does-the-web-work', 'installations',
  'text-editors', 'command-line-basics', 'setting-up-git', 'introduction-to-git', 'git-basics',
  'introduction-to-html-and-css', 'elements-and-tags', 'html-boilerplate', 'working-with-text',
  'lists', 'links-and-images', 'commit-messages'
];
assert.deepEqual(data.lessons.map(l => l.id), expectedIds, '只包含官方 Recipes 之前的 19 课，顺序一致');
assert.deepEqual(data.lessons.map(l => l.title), sources.lessons.map(l => l.title), '英文名称与官方记录一致');
assert.deepEqual(data.lessons.map(l => l.url), sources.lessons.map(l => l.url), '每课来源 URL 一致');
assert.deepEqual(data.groups.map(g => g.en), ['Introduction', 'Prerequisites', 'Git Basics', 'HTML Foundations']);
assert.equal(data.verifiedAt, sources.verifiedAt);
for (const [i, lesson] of data.lessons.entries()) {
  for (const key of ['id', 'zh', 'title', 'summary', 'guide', 'url']) assert.ok(lesson[key].trim(), `${lesson.id}: ${key}`);
  assert.equal(lesson.group, i < 5 ? 0 : i < 10 ? 1 : i < 12 ? 2 : 3);
  assert.ok(lesson.understand.length >= 3);
  assert.ok(lesson.tasks.length >= 3);
  assert.ok(lesson.terms.length >= 3 && lesson.terms.every(t => t.en && t.zh));
  assert.ok(lesson.quiz.length >= 3 && lesson.quiz.length <= 5);
  assert.ok(lesson.quiz.every(q => q.question && q.answer));
  assert.ok(lesson.tasks.some(t => t.includes('Knowledge Check')));
  assert.ok(sources.lessons[i].hasAssignment && sources.lessons[i].hasKnowledgeCheck);
  assert.equal(sources.lessons[i].hasAdditionalResources, false);
  assert.match(lesson.url, /^https:\/\/www\.theodinproject\.com\/lessons\/foundations-[a-z-]+$/);
}
// 高遗漏风险任务：不是只查字段存在，而是保护官方的具体实践与可选边界。
const full = id => JSON.stringify(data.lessons.find(l => l.id === id));
for (const [id, fragments] of Object.entries({
  'motivation-and-mindset': ['AI', 'Success Stories', '第 5 课'],
  'join-the-odin-community': ['GitHub', 'Discord', 'rules', 'faq', 'Optional'],
  'text-editors': ['Disable AI Features', '不必跟写'],
  'command-line-basics': ['Download files', 'Introducing the Shell', 'Navigating Files and Directories', 'Working With Files and Directories', '第一组', '第二组', 'test.txt', '删除'],
  'setting-up-git': ['.DS_Store', '指纹', '.pub', '2FA'],
  'introduction-to-git': ['1.1–1.4', 'Where do I start?', 'contributors'],
  'git-basics': ['git_test', 'Add README', 'SSH', 'hello_world.txt', '推送', '提交编辑器'],
  'html-boilerplate': ['跟做', 'validator'],
  'working-with-text': ['博客文章页', '粗体', '斜体'],
  'lists': ['食物', '待办', '想去', '五个电子游戏或电影'],
  'links-and-images': ['Preparation', 'dog.jpg', 'alt', 'width', 'height', '三个视频', '阅读并跟做', '四种图片格式'],
  'commit-messages': ['72', '50', 'seven rules', '没有要求另做']
})) for (const fragment of fragments) assert.ok(full(id).includes(fragment), `${id} 漏掉 ${fragment}`);
assert.ok(data.lessons.find(l => l.id === 'installations').understand.some(s => s.includes('允许跳过')));
// v2 自足中文讲解格式：Recipes 之前的 19 课已全部升级，每课都必须满足 v2 数据结构。
const V2_LESSONS = data.lessons.map(l => l.id);
assert.equal(V2_LESSONS.length, 19, '全部 19 课都应进入 v2 数据结构');
// 动手 / 命令 / 代码类课程必须有示例；理念类课程 examples 为空数组即可
const EXAMPLES_REQUIRED = ['asking-for-help', 'join-the-odin-community', 'text-editors', 'command-line-basics', 'setting-up-git', 'git-basics', 'elements-and-tags', 'html-boilerplate', 'working-with-text', 'lists', 'links-and-images', 'commit-messages'];
const TRADITIONAL_CHARS = '個們來時說後過發對還進種會學將無現點實樣經麼頭開問間馬鳥魚車東長書電話腦見觀視聽寫讀記憶體軟網頁連線圖檔資訊號設計劃輸處變據庫係統應執碼鍵數單雙復複選擇載陣類參屬監觸獲擊佈顏';
for (const id of V2_LESSONS) {
  const lesson = data.lessons.find(l => l.id === id);
  assert.ok(lesson.why && lesson.why.trim(), `${id}: why 非空`);
  assert.ok(Array.isArray(lesson.sections) && lesson.sections.length >= 3, `${id}: sections >= 3`);
  for (const part of lesson.sections) {
    for (const key of Object.keys(part)) assert.ok(['h', 'p', 'list'].includes(key), `${id}: section 非法字段 ${key}`);
    assert.ok(part.h && part.h.trim(), `${id}: section 标题非空`);
    assert.ok(Array.isArray(part.p) && part.p.length && part.p.every(s => s.trim()), `${id}: ${part.h} 段落非空`);
    if (part.list !== undefined) assert.ok(Array.isArray(part.list) && part.list.every(s => s.trim()), `${id}: ${part.h} 列表项非空`);
  }
  assert.ok(Array.isArray(lesson.examples) && lesson.examples.every(e => e.lang && e.code && e.note), `${id}: examples 结构`);
  if (EXAMPLES_REQUIRED.includes(id)) assert.ok(lesson.examples.length >= 1, `${id}: 动手课需要代码示例`);
  assert.ok(Array.isArray(lesson.pitfalls) && lesson.pitfalls.length >= 2 && lesson.pitfalls.every(p => p.title && p.text), `${id}: pitfalls >= 2`);
  assert.ok(lesson.official && Array.isArray(lesson.official.assignment) && lesson.official.assignment.length >= 1, `${id}: official.assignment 非空`);
  assert.ok(Array.isArray(lesson.official.exercise), `${id}: official.exercise 数组`);
  assert.ok(Array.isArray(lesson.official.knowledgeCheck) && lesson.official.knowledgeCheck.length >= 1 && lesson.official.knowledgeCheck.every(k => k.q && k.a), `${id}: official.knowledgeCheck 非空`);
  assert.ok(Array.isArray(lesson.official.optional), `${id}: official.optional 数组`);
  assert.ok(lesson.sources && lesson.sources.basedOn.trim() && lesson.sources.verifiedAt.trim(), `${id}: sources 非空`);
  assert.equal(lesson.sources.sha256, sources.lessons.find(s => s.id === id).sha256, `${id}: sha256 与 sources.json 一致`);
  // 路线 A 保险：每课整课对象不得出现常见繁体字，防误抄第三方繁体课程内容
  const serialized = JSON.stringify(lesson);
  for (const char of TRADITIONAL_CHARS) assert.ok(!serialized.includes(char), `${id}: 出现繁体字 ${char}`);
  // 渲染时 official.optional 与旧字段 optional 会被合并显示，两者不得有重复条目
  for (const item of lesson.official.optional) assert.ok(!lesson.optional.includes(item), `${id}: optional 条目重复`);
}
// 不再存在 v1 薄导读课：每课都必须带 sections，全部走 v2 渲染路径
for (const lesson of data.lessons) {
  assert.ok(Array.isArray(lesson.sections), `${lesson.id}: 仍是 v1 薄导读格式，缺少 sections`);
  for (const key of ['why', 'examples', 'pitfalls', 'official', 'sources']) {
    assert.notEqual(lesson[key], undefined, `${lesson.id}: 缺少 v2 字段 ${key}`);
  }
}
for (const file of ['index.html', 'lesson.html']) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  assert.match(html, /lang="zh-CN"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /charset="UTF-8"/);
  for (const [, ref] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(https:|data:|#)/.test(ref)) continue;
    assert.ok(fs.existsSync(path.join(root, ref.split('?')[0])), `${file}: 本地引用 ${ref}`);
  }
}
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
assert.ok(!/\bfetch\(|XMLHttpRequest|localStorage|innerHTML/.test(app), '离线阅读无接口依赖，内容以文本渲染');
/* v3 断言迁移说明：学习进度需要持久化，但存储职责已整体移出 app.js，
 * 集中在职责单一的 progress.js。因此这里保留“app.js 禁用 localStorage”的原断言不放宽，
 * progress.js 的命名空间 key、敏感字段防护与导入白名单断言迁移至 tests/progress.test.cjs。
 * 两个模块都仍然不得联网、不得使用 innerHTML。 */
const progressSource = fs.readFileSync(path.join(root, 'progress.js'), 'utf8');
assert.ok(!/\bfetch\(|XMLHttpRequest|innerHTML/.test(progressSource), 'progress.js 不联网、不使用 innerHTML');
assert.match(progressSource, /the-odin-project-zh\.progress\.v\d+/, 'progress.js 使用公开仓命名空间的 storage key（发布准备轮改名；旧命名空间仅作只读回落）');
assert.ok(!/document\.cookie/.test(progressSource), 'progress.js 不读写 cookie');

/* ===== v3 外部资料清单（交接 §3、§4 第 11–13 项）===== */
const resourceSandbox = { window: {} };
vm.createContext(resourceSandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'external-resources.js'), 'utf8'), resourceSandbox);
const resourceData = JSON.parse(JSON.stringify(resourceSandbox.window.ODIN_RESOURCES));
const RES = resourceData.resources;
const RESOURCE_FIELDS = ['lessonId', 'title', 'titleZh', 'type', 'requirement', 'zone', 'originalUrl',
  'sourceDomain', 'originalUrlStatus', 'license', 'handling', 'verifiedAt', 'note'];
const GUIDE_FIELDS = ['why', 'points', 'terms', 'focus', 'takeaway'];
assert.ok(Array.isArray(RES) && RES.length > 0, '外部资料清单为非空数组');
assert.ok('zhUrl' in RES[0] && 'zhType' in RES[0], '每条资源都显式声明 zhUrl 与 zhType（无中文版时为 null，而不是缺字段）');

/* §4-12 lessonId 必须属于当前 19 课，不得出现第 20 课及以后的编号 */
const lessonIds = new Set(data.lessons.map(l => l.id));
RES.forEach(r => assert.ok(lessonIds.has(r.lessonId), `资源 ${r.title} 的 lessonId ${r.lessonId} 属于 19 课之内`));
assert.equal(new Set(RES.map(r => r.lessonId)).size, 19, '19 课每一课都至少有一条外部资料');

/* §4-11 数据结构完整性 */
RES.forEach(r => {
  RESOURCE_FIELDS.forEach(f => assert.equal(typeof r[f], 'string', `${r.title} 缺少字符串字段 ${f}`));
  assert.ok(r.lessonId && r.title && r.titleZh && r.originalUrl, `${r.title} 关键字段非空`);
  assert.ok(['required', 'optional', 'reference'].includes(r.requirement), `${r.title} 的 requirement 合法`);
  GUIDE_FIELDS.forEach(f => assert.ok(r.zhGuide && r.zhGuide[f] !== undefined, `${r.title} 缺少 zhGuide.${f}`));
  assert.ok(Array.isArray(r.zhGuide.points) && r.zhGuide.points.length >= 2, `${r.title} 的中文要点至少 2 条`);
  assert.ok(Array.isArray(r.zhGuide.terms) && r.zhGuide.terms.length >= 1, `${r.title} 至少给出 1 个重要英文词`);
  r.zhGuide.points.forEach(p => assert.ok(typeof p === 'string' && p.length > 10, `${r.title} 的要点为有意义的中文句子`));
  /* zhUrl 与 zhType 必须成对：给出中文地址就必须说明它的性质，反之亦然 */
  assert.ok(r.zhUrl === null || typeof r.zhUrl === 'string', `${r.title} 的 zhUrl 为字符串或 null`);
  assert.ok(r.zhType === null || typeof r.zhType === 'string', `${r.title} 的 zhType 为字符串或 null`);
  assert.equal(Boolean(r.zhUrl), Boolean(r.zhType), `${r.title} 的 zhUrl 与 zhType 必须同时存在或同时为空`);
  if (r.zhUrl) assert.match(r.verifiedAt, /^\d{4}-\d{2}-\d{2}$/, `${r.title} 的中文版有核验日期`);
});

/* §4-13 URL 格式与域名一致性校验 */
/* 官方短链域名到主域名的显式映射：youtu.be 是 YouTube 官方短链形式，指向同一站点。
 * 这里用白名单而不是放宽比较，避免出现 sourceDomain 与真实主机名任意不符也通过的情况。 */
const DOMAIN_ALIAS = { 'youtu.be': 'youtube.com' };
RES.forEach(r => {
  const u = new URL(r.originalUrl);
  assert.ok(['http:', 'https:'].includes(u.protocol), `${r.title} 的 originalUrl 为 http(s)`);
  assert.ok(u.hostname === r.sourceDomain || u.hostname === `www.${r.sourceDomain}`
    || DOMAIN_ALIAS[u.hostname] === r.sourceDomain,
    `${r.title} 的 sourceDomain 与 originalUrl 主机名一致`);
  if (r.zhUrl) {
    const z = new URL(r.zhUrl);
    assert.ok(['http:', 'https:'].includes(z.protocol), `${r.title} 的 zhUrl 为 http(s)`);
    assert.ok(!/\s/.test(r.zhUrl), `${r.title} 的 zhUrl 不含空白字符`);
  }
  /* 中文地址必须落在可信来源上：原站自身的语言版本或同项目的中文站点，不接受机器翻译镜像 */
  const MIRROR = /(translate\.google|translate\.bing|--zh\.|\.translate\.goog|fanyi\.|mt\.google)/;
  if (r.zhUrl) assert.ok(!MIRROR.test(r.zhUrl), `${r.title} 的中文版不是机器翻译镜像`);
});

/* 清单自洽：stats 与 audit.perLesson 必须与真实条数一致，防止统计数字与数据脱节 */
assert.equal(RES.length, resourceData.stats.total, 'stats.total 与实际条数一致');
assert.equal(RES.filter(r => r.zhUrl).length, resourceData.stats.withZh, 'stats.withZh 与实际中文条数一致');
assert.equal(RES.filter(r => !r.zhUrl).length, resourceData.stats.guideOnly, 'stats.guideOnly 与实际导读条数一致');
const counted = {};
RES.forEach(r => { counted[r.lessonId] = (counted[r.lessonId] || 0) + 1; });
Object.keys(resourceData.audit.perLesson).forEach(id => {
  assert.equal(counted[id], resourceData.audit.perLesson[id], `audit.perLesson 中 ${id} 的条数与实际一致`);
});
assert.equal(Object.values(resourceData.audit.perLesson).reduce((a, b) => a + b, 0), RES.length, 'audit.perLesson 合计等于总条数');

/* §3.2 没有可靠证据证明有中文字幕的视频，一律不得提供中文地址或声称有中文版 */
RES.filter(r => r.type === '视频').forEach(r => {
  assert.equal(r.zhUrl, null, `视频《${r.title}》未核验到中文字幕或中文版，zhUrl 必须为 null`);
  assert.equal(r.zhType, null, `视频《${r.title}》不得声称存在中文版`);
  assert.ok(!/有?中文字幕/.test(JSON.stringify(r.zhGuide)) || /不声称有中文字幕|没有可靠证据证明/.test(JSON.stringify(r.zhGuide)),
    `视频《${r.title}》的导读未声称有中文字幕`);
});

/* §3.3 不使用 iframe、不代理网页、不注入第三方页面；处理方式一律为仅链接 */
assert.ok(RES.every(r => r.handling === 'link-only'), '所有资源的处理方式均为 link-only');
const resourceSource = fs.readFileSync(path.join(root, 'external-resources.js'), 'utf8');
assert.ok(!/\bfetch\(|XMLHttpRequest|innerHTML|<iframe/.test(resourceSource), 'external-resources.js 不联网、不使用 innerHTML、不含 iframe');
/* §2.2 清单是公开教学数据，不得夹带任何账号凭据值 */
assert.ok(!/document\.cookie/.test(resourceSource), 'external-resources.js 不读写 cookie');
assert.ok(!/(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{10,})/.test(resourceSource), '清单中不含任何真实 token');
/* 沿用全站繁体保险，覆盖新增的中文导读文本 */
const resourceChinese = RES.map(r => r.titleZh + JSON.stringify(r.zhGuide) + r.note).join('');
TRADITIONAL_CHARS.split('').forEach(ch => {
  assert.ok(!resourceChinese.includes(ch), `外部资料导读未使用繁体字「${ch}」`);
});
assert.ok(!fs.existsSync(path.join(root, 'package.json')), '无构建与运行依赖');
const quizTotal = data.lessons.reduce((n, l) => n + l.quiz.length, 0);
console.log(`通过：19 课顺序与来源、每课六类内容、${quizTotal} 道自测、${V2_LESSONS.length} 课 v2 自足讲解格式与繁体保险、重点任务及范围边界、本地资源和无构建依赖、${RES.length} 条外部资料（其中 ${resourceData.stats.withZh} 条有已核验中文版、${resourceData.stats.guideOnly} 条为本站中文导读 + 英文原文）。`);
