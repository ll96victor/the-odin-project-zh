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
  'lists', 'links-and-images', 'commit-messages', 'recipes',
  'intro-to-css', 'the-cascade', 'inspecting-html-and-css', 'the-box-model', 'block-and-inline',
  'introduction-to-flexbox', 'growing-and-shrinking', 'axes', 'alignment', 'landing-page',
  'variables-and-operators', 'installing-node-js', 'data-types-and-conditionals',
  'javascript-developer-tools', 'function-basics', 'problem-solving', 'understanding-errors',
  'rock-paper-scissors', 'clean-code', 'loops-and-arrays',
  'dom-manipulation-and-events', 'revisiting-rock-paper-scissors', 'etch-a-sketch', 'object-basics', 'calculator', 'choose-your-path-forward'
];
assert.deepEqual(data.lessons.map(l => l.id), expectedIds, '包含官方全部 46 课（Foundations 全开，v4.11.20 第九批），顺序一致');
assert.deepEqual(data.lessons.map(l => l.title), sources.lessons.map(l => l.title), '英文名称与官方记录一致');
assert.deepEqual(data.lessons.map(l => l.url), sources.lessons.map(l => l.url), '每课来源 URL 一致');
assert.deepEqual(data.groups.map(g => g.en), ['Introduction', 'Prerequisites', 'Git Basics', 'HTML Foundations', 'CSS Foundations', 'Flexbox', 'JavaScript Basics', 'Conclusion']);
assert.equal(data.verifiedAt, sources.verifiedAt);
/* v4.11.17：官方 2026-09-23 的 PR #31412 把全部课程的课末自查题一节整体移除
 * （216 文件 +190/-2309，只删不补；官方 LAYOUT_STYLE_GUIDE 已无该节且无替代节），
 * 本站全面跟随上游，把已开放课程里的官方自查题一并下线。因此 v4.11.16 的
 * 「按课型分支」不再存在，本文件改为**统一的反向钉子**：全部课程都必须为零，
 * 而不是恰好为空——任何人往任意一课塞回一道自查题、或在任务文案里写回该节名称，
 * 这里先红。反向验证（交付前实跑）：给任意一课塞回一条自查题 → 本文件与
 * lesson-reader-fixes.test.cjs 必须变红。
 * 节名只在这一个常量里出现一次，供下面的反向断言使用；改这里等于改被钉的字符串。 */
const KC_SECTION_NAME = 'Knowledge Check';
for (const [i, lesson] of data.lessons.entries()) {
  for (const key of ['id', 'zh', 'title', 'summary', 'guide', 'url']) assert.ok(lesson[key].trim(), `${lesson.id}: ${key}`);
  /* v4.11.16 加固：分组下标不再硬编码边界三元式（i<5?0:…，扩到第 21 课
   * css-foundations 时会静默出错），改为按 data.groups 推导——下标必须合法
   * 且随课序不回退（官方分组是连续段）；与 catalog 的逐课分组归属一致性
   * 由 catalog.test.cjs 第 6 节双向钉住。 */
  assert.ok(Number.isInteger(lesson.group) && lesson.group >= 0 && lesson.group < data.groups.length,
    `${lesson.id}: group 下标 ${lesson.group} 必须在 data.groups 范围内`);
  if (i > 0) assert.ok(lesson.group >= data.lessons[i - 1].group, `${lesson.id}: 分组下标不得回退（官方分组连续）`);
  assert.ok(lesson.understand.length >= 3);
  assert.ok(lesson.tasks.length >= 3);
  assert.ok(lesson.terms.length >= 3 && lesson.terms.every(t => t.en && t.zh));
  assert.ok(lesson.quiz.length >= 3 && lesson.quiz.length <= 5);
  assert.ok(lesson.quiz.every(q => q.question && q.answer));
  assert.ok(!lesson.tasks.some(t => t.includes(KC_SECTION_NAME)),
    `${lesson.id}: 官方已下线该节，任务文案不得再出现「${KC_SECTION_NAME}」（发现即说明有人把已删除的课节写回来了）`);
  if (lesson.id === 'choose-your-path-forward') {
    assert.equal(sources.lessons[i].hasAssignment, false, `${lesson.id}: 官方无 Assignment（结语课，官方文件顶部声明结构豁免——若官方补了 Assignment 节，先复核原文再迁移此断言）`);
  } else {
    assert.ok(sources.lessons[i].hasAssignment, `${lesson.id}: 官方有 Assignment`);
  }
  assert.equal(sources.lessons[i].hasKnowledgeCheck, false,
    `${lesson.id}: hasKnowledgeCheck 必须为 false（官方 2026-09-23 已移除该节；官方若恢复，先复核原文再迁移）`);
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
  'commit-messages': ['72', '50', 'seven rules', '没有要求另做'],
  /* v4.11.16 Project 课的高遗漏风险点：仓库名 / 外部灵感站 / 不提供成品代码的边界声明 /
   * GitHub Pages 可选项——漏掉任何一条都意味着项目要求或红线边界被删改。
   * v4.11.19 第三批新增课 30 的同族要点。 */
  'recipes': ['odin-recipes', 'Allrecipes', '不提供成品代码', 'GitHub Pages', 'Iteration'],
  'landing-page': ['不提供成品代码', 'GitHub Pages', '设计图', '一次只做一个区块', '像素级'],
  /* v4.11.20 第三批新增课 38 的同族要点：六步结构 / 两个官方 Hint 的边界词 /
   * 数学与输入两个 MDN 落点 / 不做 GUI / 不需要数组。 */
  'rock-paper-scissors': ['不提供成品代码', 'Hello World', 'Math.random', 'prompt', '大小写不敏感', '五轮', '数组不是必需的', 'commit early'],
  /* v4.11.20 第六批新增课 43 的同族要点：四步主线 / Flexbox 专属（官方明令不碰
   * CSS Grid）/ 悬停事件边界词 / prompt 上限 100 / Extra credit 两项。 */
  'etch-a-sketch': ['不提供成品代码', '16×16', 'Flexbox', 'CSS Grid', 'mouseenter', 'prompt', '100', '960px', 'Extra credit', 'opacity', 'commit early'],
  /* v4.11.20 第八批新增课 45 的同族要点：四运算函数 / operate 调度 / eval 禁令 /
   * 单对运算链的 12+7-1 演示 / 连续运算符只认最后一个 / 除以 0 不崩 / Extra credit 三项。 */
  'calculator': ['不提供成品代码', 'eval', 'new Function', 'add', 'subtract', 'multiply', 'divide', 'operate', 'clear', '12 + 7', '19 - 1', '除以 0', 'Extra credit', '键盘', '小数点', 'backspace', 'commit early']
})) for (const fragment of fragments) assert.ok(full(id).includes(fragment), `${id} 漏掉 ${fragment}`);
assert.ok(data.lessons.find(l => l.id === 'installations').understand.some(s => s.includes('允许跳过')));
/* Project 红线结构钉（v4.11.20 第三批加固）：所有 Project 课 examples 必须为空数组——
 * 塞入任何成品代码这里先红。此前该红线只靠「写课时留空 + 片段表」，无机械保障。 */
for (const lesson of data.lessons.filter(l => /Project/i.test(l.title))) {
  assert.ok(Array.isArray(lesson.examples) && lesson.examples.length === 0,
    `${lesson.id}: Project 课 examples 必须为空数组（红线：不给成品代码）`);
}
// v2 自足中文讲解格式：全部 46 课（含五个 Project）已全部采用，每课都必须满足 v2 数据结构。
const V2_LESSONS = data.lessons.map(l => l.id);
assert.equal(V2_LESSONS.length, 46, '全部 46 课都应进入 v2 数据结构');
// 动手 / 命令 / 代码类课程必须有示例；理念类课程 examples 为空数组即可
const EXAMPLES_REQUIRED = ['asking-for-help', 'join-the-odin-community', 'text-editors', 'command-line-basics', 'setting-up-git', 'git-basics', 'elements-and-tags', 'html-boilerplate', 'working-with-text', 'lists', 'links-and-images', 'commit-messages', 'intro-to-css', 'the-cascade'];
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
  if (id === 'choose-your-path-forward') {
    /* v4.11.20 第九批：第 46 课是官方唯一的无 Assignment 课（结语课，官方文件顶部声明
     * 结构豁免）——official.assignment 必须为空数组而非缺失；官方若补了该节，先复核再迁移。 */
    assert.ok(lesson.official && Array.isArray(lesson.official.assignment) && lesson.official.assignment.length === 0, `${id}: 官方无 Assignment（结语课结构豁免），assignment 应为空数组`);
  } else {
    assert.ok(lesson.official && Array.isArray(lesson.official.assignment) && lesson.official.assignment.length >= 1, `${id}: official.assignment 非空`);
  }
  assert.ok(Array.isArray(lesson.official.exercise), `${id}: official.exercise 数组`);
  /* v4.11.17：官方 2026-09-23 已移除课末自查题一节，本站同步下线——
   * 字段保留（语义＝本站收录的官方自查题数）但必须为空数组，不是缺失、
   * 也不是凑数假条目。反向验证：塞回任意一条即红（见文件头说明）。 */
  assert.ok(Array.isArray(lesson.official.knowledgeCheck) && lesson.official.knowledgeCheck.length === 0,
    `${id}: 官方已下线该节，自查题必须为空数组`);
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

/* §4-12 lessonId 必须属于已开放课程，不得出现未开放课程的编号 */
const lessonIds = new Set(data.lessons.map(l => l.id));
RES.forEach(r => assert.ok(lessonIds.has(r.lessonId), `资源 ${r.title} 的 lessonId ${r.lessonId} 属于已开放课程之内`));
/* v4.11.19：零外部资料课的显式豁免集合（先例：KC 下线前的 PROJECT_NO_KC 写法）。
 * 课 26 Introduction to Flexbox 官方原文的 3 条外链全部是 statically CDN 课程
 * 配图（非学习资料，按盘点范围剔除），Assignment 仅一句无作业声明——官方该课
 * 就没有任何外部学习资料。不凑数、不登记配图。集合里每加一课都必须在这里写明
 * 理由；除此集合外，每课至少一条的断言不放宽。 */
const NO_RESOURCE_LESSONS = new Set(['introduction-to-flexbox', 'installing-node-js']);
const coveredIds = new Set(RES.map(r => r.lessonId));
data.lessons.forEach(l => {
  if (NO_RESOURCE_LESSONS.has(l.id)) return;
  assert.ok(coveredIds.has(l.id), `${l.id} 应至少有一条外部资料（零资料课必须在 NO_RESOURCE_LESSONS 登记理由）`);
});
assert.equal(coveredIds.size, data.lessons.length - NO_RESOURCE_LESSONS.size, '有外部资料的课数 = 总课数 − 零资料豁免集合');

/* §4-11 数据结构完整性 */
RES.forEach(r => {
  RESOURCE_FIELDS.forEach(f => assert.equal(typeof r[f], 'string', `${r.title} 缺少字符串字段 ${f}`));
  assert.ok(r.lessonId && r.title && r.titleZh && r.originalUrl, `${r.title} 关键字段非空`);
  assert.ok(['required', 'optional', 'reference'].includes(r.requirement), `${r.title} 的 requirement 合法`);
  GUIDE_FIELDS.forEach(f => assert.ok(r.zhGuide && r.zhGuide[f] !== undefined, `${r.title} 缺少 zhGuide.${f}`));
  assert.ok(Array.isArray(r.zhGuide.points) && r.zhGuide.points.length >= 2, `${r.title} 的中文要点至少 2 条`);
  assert.ok(Array.isArray(r.zhGuide.terms) && r.zhGuide.terms.length >= 1, `${r.title} 至少给出 1 个重要英文词`);
  r.zhGuide.points.forEach(p => assert.ok(typeof p === 'string' && p.length > 10, `${r.title} 的要点为有意义的中文句子`));
  /* v4.11.1 B 档：每条资源都有中文速览 overview——沿用 points 的「有意义的中文句子」同类标准 */
  assert.ok(typeof r.zhGuide.overview === 'string' && r.zhGuide.overview.trim().length > 10, `${r.title} 缺少有意义的 zhGuide.overview 中文速览`);
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

/* §3.3 不使用 iframe、不代理网页、不注入第三方页面。
 * v4.11.1（C3）：handling 允许两个值——link-only（只链接与本站原创导读）与
 * zh-translation（对许可明确为 CC 系列的来源提供本站中文精译，译文采用与原作
 * 相同的 CC 许可并带署名）。精译是本站的译文内容，不改变“不代理、不 iframe、
 * 不注入第三方页面”的边界；除这两个值外不得出现其他处理方式。 */
assert.ok(RES.every(r => ['link-only', 'zh-translation'].includes(r.handling)), '所有资源的处理方式为 link-only 或 zh-translation，不得为其他值');
/* handling 与数据一致：当且仅当条目带有 zhTranslation 时才允许标 zh-translation */
RES.forEach(r => {
  assert.equal(Boolean(r.zhTranslation), r.handling === 'zh-translation', `${r.title}: handling 与 zhTranslation 存在性一致`);
});

/* ===== v4.11.1 C 档：中文精译的完整性与范围纪律 ===== */
const TRANSLATED = RES.filter(r => r.handling === 'zh-translation');
assert.equal(TRANSLATED.length, 14, 'zh-translation 共 14 条（15 条 CC 且无官方中文版中，shell-lesson-data.zip 为二进制数据文件无文本可译，保持 link-only）');
assert.equal(resourceData.stats.withTranslation, TRANSLATED.length, 'stats.withTranslation 与实际精译条数一致');
TRANSLATED.forEach(r => {
  const t = r.zhTranslation;
  /* C2：每篇精译必须带署名与来源标注、相同 CC 许可声明、译者与修改说明 */
  for (const f of ['attribution', 'licenseNote', 'translatorNote', 'modifications']) {
    assert.ok(typeof t[f] === 'string' && t[f].trim(), `${r.title}: zhTranslation.${f} 非空`);
  }
  assert.ok(['full', 'core'].includes(t.kind), `${r.title}: kind 为 full 或 core`);
  assert.ok(/CC/.test(t.licenseNote) && /相同/.test(t.licenseNote), `${r.title}: 许可声明写明采用与原作相同的 CC 许可`);
  assert.ok(Array.isArray(t.body) && t.body.length >= 3 && t.body.every(line => typeof line === 'string' && line.trim()), `${r.title}: body 为不少于 3 行的非空字符串数组`);
  /* C4：只有许可明确为 CC 系列的条目才允许精译 */
  assert.ok(/CC[ -]?BY/i.test(r.license), `${r.title}: 仅许可明确为 CC 系列的条目可为 zh-translation`);
  /* 已有官方中文版的条目不需要本站译文（官方中文版优先） */
  assert.equal(r.zhUrl, null, `${r.title}: zh-translation 条目应无官方中文版（有则应直接给官方链接）`);
});
/* C4 反向：许可未明确 CC 的条目一律保持 link-only、不得携带译文 */
RES.filter(r => !/CC[ -]?BY/i.test(r.license)).forEach(r => {
  assert.equal(r.handling, 'link-only', `${r.title}: 许可未明确为 CC 的条目保持 link-only`);
  assert.ok(!r.zhTranslation, `${r.title}: 许可未明确为 CC 的条目不得携带译文`);
});

/* ===== v4.11.1 A1 数据前提：受限地址可精确匹配、恰好分布于 3 课 ===== */
const LIMITED = resourceData.audit.verifyLimitedUrls;
assert.ok(Array.isArray(LIMITED) && LIMITED.length === 16, 'verifyLimitedUrls 共 16 条（v4.11.17 起含课 21 的 W3Schools 颜色值参考页，v4.11.18 起含课 25 的三条 W3Schools 字体与块级清单参考页，v4.11.19 起含课 30 的 Pexels 与 Pixabay 免费图库，v4.11.20 起含课 33 的 W3Schools 字符串方法教程，第四批起含课 39 的 reddit 缩进玩笑帖与 onextrapixel 原则清单，第八批起含课 45 的 StackOverflow eval 对比讨论，第九批起含课 46 的 Medium 选语言指南）');
LIMITED.forEach(entry => {
  const url = entry.split('（')[0];
  assert.ok(RES.some(r => r.originalUrl === url), `受限地址 ${url} 能按全角括号前缀与某条资源 originalUrl 精确匹配`);
});
const limitedLessons = new Set();
RES.forEach(r => { if (LIMITED.some(e => e.split('（')[0] === r.originalUrl)) limitedLessons.add(r.lessonId); });
assert.deepEqual([...limitedLessons].sort(), ['block-and-inline', 'calculator', 'choose-your-path-forward', 'clean-code', 'data-types-and-conditionals', 'html-boilerplate', 'intro-to-css', 'join-the-odin-community', 'landing-page', 'links-and-images'],
  '受限条目恰好分布于 10 课——「按课显示提示」的数据前提');
const resourceSource = fs.readFileSync(path.join(root, 'external-resources.js'), 'utf8');
assert.ok(!/\bfetch\(|XMLHttpRequest|innerHTML|<iframe/.test(resourceSource), 'external-resources.js 不联网、不使用 innerHTML、不含 iframe');
/* §2.2 清单是公开教学数据，不得夹带任何账号凭据值 */
assert.ok(!/document\.cookie/.test(resourceSource), 'external-resources.js 不读写 cookie');
assert.ok(!/(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{10,})/.test(resourceSource), '清单中不含任何真实 token');
/* 沿用全站繁体保险，覆盖新增的中文导读文本与 v4.11.1 的速览 / 精译文本 */
const resourceChinese = RES.map(r => r.titleZh + JSON.stringify(r.zhGuide) + JSON.stringify(r.zhTranslation || '') + r.note).join('');
TRADITIONAL_CHARS.split('').forEach(ch => {
  assert.ok(!resourceChinese.includes(ch), `外部资料导读与译文未使用繁体字「${ch}」`);
});
assert.ok(!fs.existsSync(path.join(root, 'package.json')), '无构建与运行依赖');

/* ===== v4.11.1 渲染验证：A1 按课提示 / B 档速览 / C 档译文（dom-stub 真实挂载路径） ===== */
const { newPage, makeStorage, collectByClass } = require('./dom-stub.cjs');
const textOf = el => (!el ? '' : el._text ? el._text : (el.childNodes || []).map(textOf).join(''));
const mountLesson = id => newPage({ storage: makeStorage(), page: 'lesson', search: `?id=${id}`, href: `http://127.0.0.1:8765/lesson.html?id=${id}` });
const noticeTexts = page => collectByClass(page.dom.body, 'notice').map(textOf).filter(t => t.includes('自动核验受限'));

/* A1（v4.11.4 反向钉子）：块级「自动核验受限」提示已从课页移除
 * （CONTENT-STYLE-GUIDE.md 第 1 节「读者页面零审计信息」）；受限条目由
 * 单卡「核验说明」（resource.note）承担——20 课全部不得出现块级提示，
 * 含此前确有受限条目的 join-the-odin-community / html-boilerplate / links-and-images。 */
for (const lesson of data.lessons) {
  assert.equal(noticeTexts(mountLesson(lesson.id)).length, 0, `${lesson.id} 课页零块级「自动核验受限」提示`);
}
{
  /* 受限条目的诚实记录仍在单卡核验说明里（唯一例外，不是全局审计块） */
  const page = mountLesson('join-the-odin-community');
  const notes = collectByClass(page.dom.body, 'resource-note').map(textOf);
  assert.ok(notes.some(t => t.includes('核验说明')), 'join-the-odin-community 单卡核验说明仍在（诚实记录保留）');
}
/* B 档：速览渲染为导读 dl 的第一行；C 档：译文块静态展开且署名可见 */
{
  const page = mountLesson('how-this-course-will-work');
  const dls = collectByClass(page.dom.body, 'resource-guide');
  assert.equal(dls.length, 2, '课01 两张资料卡');
  dls.forEach(dl => {
    const dtTexts = dl.childNodes.filter(n => n.tagName === 'DT').map(textOf);
    assert.equal(dtTexts[0], '中文速览', '导读第一行是中文速览');
  });
  const trs = collectByClass(page.dom.body, 'resource-translation');
  assert.equal(trs.length, 2, '课01 两条 CC 条目都有译文块');
  const firstText = textOf(trs[0]);
  assert.ok(firstText.includes('署名与来源：'), '译文块含署名与来源标注');
  assert.ok(firstText.includes('许可声明：') && firstText.includes('相同的'), '译文块含相同许可声明');
  assert.ok(firstText.includes('译者说明：') && firstText.includes('修改说明：'), '译文块含译者与修改说明');
  /* 译文块不得引入 details/summary（browser-smoke 钉住课页 details 数 = quiz 数；资源卡纪律为静态展开） */
  let detailsInTranslation = 0;
  const walk = n => { if (n.tagName === 'DETAILS' || n.tagName === 'SUMMARY') detailsInTranslation += 1; (n.childNodes || []).forEach(walk); };
  trs.forEach(walk);
  assert.equal(detailsInTranslation, 0, '译文块零 details/summary');
}
/* C 档反向：无 CC 精译条目的课不渲染译文块 */
assert.equal(collectByClass(mountLesson('working-with-text').dom.body, 'resource-translation').length, 0, '课16 无译文块');

const quizTotal = data.lessons.reduce((n, l) => n + l.quiz.length, 0);
console.log(`通过：46 课顺序与来源、每课六类内容、${quizTotal} 道自测、${V2_LESSONS.length} 课 v2 自足讲解格式与繁体保险、重点任务及范围边界（官方已下线课末自查题节，全课自查题为空数组且任务文案零残留，反向钉住）、本地资源和无构建依赖、${RES.length} 条外部资料（其中 ${resourceData.stats.withZh} 条有已核验中文版、${resourceData.stats.guideOnly} 条为本站中文导读 + 英文原文；${RES.length} 条全部带中文速览、${TRANSLATED.length} 条 CC 来源带本站中文精译；v4.11.4 课页零块级受限提示、单卡核验说明保留）。`);
