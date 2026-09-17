/* v4.5 Batch 2（交接 A2/A3）：版本身份可见化测试。
 *
 * 覆盖：
 *   1. version.js 单一事实源：window.ODIN_VERSION 结构 + 与磁盘文件逐字段一致；
 *   2. footer 版本行（首页与课页都挂）；
 *   3. 「关于本站」在学习伙伴面板设置视图：产品版本 / schemaVersion / 页面地址；
 *   4. 「关于本站」在个人中心设置 Tab：同一构建函数（同源）；
 *   5. app.js / index.html / lesson.html 不硬编码产品名与版本字符串（防散落五处）；
 *   6. HTML 脚本顺序：version.js 在 app.js 之前（defer 依赖顺序）。
 *
 * serve.py 侧的版本打印、/version.json 与旧服务识别在 tests/serve_test.py 覆盖。
 * 运行：node tests/version-identity.test.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

let checks = 0;
const check = label => { checks += 1; return label; };

const {
  querySelect, collectByClass, dispatch, makeStorage, newPage
} = require('./dom-stub.cjs');

const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

/* ===================== 1. version.js 单一事实源 ===================== */
{
  const source = read('version.js');
  const diskApp = /app:\s*'([^']+)'/.exec(source);
  const diskProduct = /product:\s*'([^']+)'/.exec(source);
  const diskVersion = /version:\s*'([^']+)'/.exec(source);
  assert.ok(diskApp && diskProduct && diskVersion, check('version.js 含 app/product/version 三字段'));

  const page = newPage({ storage: makeStorage() });
  const runtime = page.sandbox.window.ODIN_VERSION;
  assert.ok(runtime, check('window.ODIN_VERSION 已暴露'));
  assert.equal(runtime.app, diskApp[1], check('运行时 app 与磁盘 version.js 一致'));
  assert.equal(runtime.product, diskProduct[1], check('运行时 product 与磁盘一致'));
  assert.equal(runtime.version, diskVersion[1], check('运行时 version 与磁盘一致'));
  assert.equal(runtime.app, 'the-odin-project-zh', check('app 标识为 the-odin-project-zh（发布准备轮改名；serve.py 旧服务识别同时接受历史值 odin-foundations-zh）'));
  assert.match(runtime.version, /^\d+\.\d+/, check('版本号是 X.Y 形态'));
}

/* ===================== 2. footer 版本行（两页） ===================== */
for (const pageName of ['home', 'lesson']) {
  const page = newPage({ storage: makeStorage(), page: pageName });
  const footer = querySelect(page.dom.body, '.site-footer');
  assert.ok(footer, check(`${pageName}：footer 存在`));
  const versionLine = querySelect(footer, '.site-version');
  assert.ok(versionLine, check(`${pageName}：footer 有版本行`));
  const runtime = page.sandbox.window.ODIN_VERSION;
  assert.equal(versionLine.textContent, `${runtime.product} v${runtime.version}`,
    check(`${pageName}：版本行文本 = 产品名 + v + 版本（读自 version.js）`));
}

/* ===================== 3. 伙伴面板设置视图的「关于本站」 ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const { dom } = page;
  const trigger = querySelect(dom.body, '.assistant-trigger');
  dispatch(trigger, 'click', {});
  const dialog = collectByClass(dom.body, 'assistant-dialog').find(item => item.open === true);
  assert.ok(dialog, check('伙伴面板已打开'));
  const settingsNav = collectByClass(dialog, 'assistant-nav-btn').find(btn => btn.textContent === '设置');
  dispatch(settingsNav, 'click', {});

  const about = querySelect(dialog, '.about-section');
  assert.ok(about, check('A2：伙伴面板设置视图有「关于本站」区块'));
  assert.ok(about.textContent.includes('关于本站'), check('A2：区块标题'));
  const facts = querySelect(about, '.about-facts');
  assert.ok(facts, check('A2：关于事实列表存在'));
  const text = facts.textContent;
  const runtime = page.sandbox.window.ODIN_VERSION;
  assert.ok(text.includes(`${runtime.product} v${runtime.version}`), check('A2：关于含产品版本'));
  assert.ok(text.includes(String(page.progress.Logic.SCHEMA_VERSION)), check('A2：关于含当前 schemaVersion（读自 progress.Logic，非硬编码）'));
  assert.ok(text.includes(page.sandbox.window.location.href), check('A2：关于含当前页面地址'));
}

/* ===================== 4. 个人中心设置 Tab 的「关于本站」（同源） ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const { dom } = page;
  const playerEntry = querySelect(dom.body, '.player-entry');
  assert.ok(playerEntry, check('header 玩家入口存在'));
  dispatch(playerEntry, 'click', {});
  const profile = collectByClass(dom.body, 'profile-dialog').find(item => item.open === true);
  assert.ok(profile, check('个人中心已打开'));
  const settingsTab = collectByClass(profile, 'profile-tab').find(tab => tab.textContent === '设置');
  dispatch(settingsTab, 'click', {});

  const about = querySelect(profile, '.about-section');
  assert.ok(about, check('A2：个人中心设置 Tab 有「关于本站」区块（同一构建函数）'));
  const text = querySelect(about, '.about-facts').textContent;
  const runtime = page.sandbox.window.ODIN_VERSION;
  assert.ok(text.includes(`${runtime.product} v${runtime.version}`), check('A2：个人中心关于含产品版本'));
  assert.ok(text.includes(String(page.progress.Logic.SCHEMA_VERSION)), check('A2：个人中心关于含 schemaVersion'));
  assert.ok(text.includes(page.sandbox.window.location.href), check('A2：个人中心关于含页面地址'));
}

/* ===================== 5. 版本字符串不散落（单一事实源红线） ===================== */
{
  const appSource = read('app.js');
  const indexSource = read('index.html');
  const lessonSource = read('lesson.html');
  /* 产品名只允许出现在 version.js；app.js 与 HTML 只引用 window.ODIN_VERSION */
  assert.ok(!appSource.includes("'Odin 中文学习站'"), check('A2：app.js 不硬编码产品名'));
  assert.ok(!indexSource.includes('Odin 中文学习站 v'), check('A2：index.html 不硬编码版本行'));
  assert.ok(!lessonSource.includes('Odin 中文学习站 v'), check('A2：lesson.html 不硬编码版本行'));
  /* 发布准备轮改名红线：旧品牌 Learning Garden 不得在运行时文件残留（history/ 备份除外） */
  assert.ok(!appSource.includes('Learning Garden'), check('改名：app.js 无旧品牌 Learning Garden 残留'));
  assert.ok(!indexSource.includes('Learning Garden'), check('改名：index.html 无旧品牌残留'));
  assert.ok(!lessonSource.includes('Learning Garden'), check('改名：lesson.html 无旧品牌残留'));
  const serveSource = read('serve.py');
  /* 注释里的「v4.5（交接 …）」是本仓库的版本标注惯例，不算硬编码；
   * 要禁的是引号里的版本字面量（打印/比对用的值必须来自 version.js） */
  assert.ok(!serveSource.includes("'4.5'") && !serveSource.includes('"4.5"'),
    check('A2：serve.py 不硬编码版本字符串（运行时解析 version.js）'));
  assert.ok(serveSource.includes('version.js'), check('A2：serve.py 从 version.js 读取版本'));
}

/* ===================== 6. 脚本加载顺序 ===================== */
{
  for (const file of ['index.html', 'lesson.html']) {
    const source = read(file);
    const versionAt = source.indexOf('<script src="version.js" defer></script>');
    const appAt = source.indexOf('<script src="app.js" defer></script>');
    assert.ok(versionAt > -1, check(`A2：${file} 加载 version.js`));
    assert.ok(appAt > -1, check(`A2：${file} 加载 app.js`));
    assert.ok(versionAt < appAt, check(`A2：${file} version.js 在 app.js 之前（defer 依赖顺序）`));
  }
}

console.log(`version-identity.test.cjs：全部 ${checks} 项断言通过 ✔`);
