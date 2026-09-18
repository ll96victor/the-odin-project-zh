/* userscript GM storage 同步验证专项（v4.11 批次 A）。
 *
 * 被测对象：userscripts/odin-gm-sync-check.user.js（开发阶段验证工具，不进公开仓）。
 * **公开仓内为 skip 语义**：被测源文件不在公开仓白名单里（release/PUBLIC-REPO-PLAN.md §3），
 * 因此公开仓内本文件找不到被测对象，会打印一行明确的跳过说明并以退出码 0 结束——
 * 既不让公开仓的测试套件出现一个必崩文件，也不静默冒充「已通过」。
 * 完整断言只在私人开发仓（源文件存在）运行，行为与改造前逐字一致。
 * 方法：dom-stub 真实挂载整站（index.html 全部脚本按 defer 顺序）+ 注入 GM_setValue /
 * GM_getValue / unsafeWindow / dispatchEvent 桩，把 userscript 跑进同一个 vm 沙箱，
 * 然后**验证最终数据结果**而不是「函数执行成功」：
 *   A. localStorage → GM：保存后回读 GM，档案原文逐字节一致 + 关键字段逐项比对；
 *   B. GM → localStorage：两段确认后恢复，存储原文一致、内存态同步（storage 事件 →
 *      app.js watchStorage → reloadFromStorage + refreshAll 真实链路）、DOM 数字更新、
 *      站点备份与 GM 恢复点都落盘；
 *   C. 旧数据兼容：schema 3 旧档案 / 缺可选字段档案可导入可恢复；无效 JSON、未知课程
 *      编号、敏感字段名一律拒绝且 GM 与页面数据零修改；损坏档案冻结页可被恢复解冻；
 *   D. 边界：页面加载零写入（不静默覆盖）、数据为空提示、信封格式保护、刷新失败兜底
 *      （needsReload）、旧 key 回落读取、导出内容与站点档案同格式。
 * 油猴实机（真实 GM storage / 云同步 / 文件下载）无法在 Node 验证——见 TEST-REPORT
 * 「Ready for Human Verification」。
 *
 * 运行：node tests/userscript-gm-sync.test.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const {
  newPage, makeStorage, dispatch, querySelect, collectByClass,
  STORAGE_KEY, LEGACY_STORAGE_KEY, archiveJson, lessonEntryJson, FIRST_LESSON
} = require('./dom-stub.cjs');

const root = path.resolve(__dirname, '..');
const userscriptPath = path.join(root, 'userscripts', 'odin-gm-sync-check.user.js');

/* 源文件存在性判断（v4.11 公开发布轮新增）：只加这一道门，源文件存在时下面逐字不变。
 * 源文件缺失 = 公开仓场景（该目录不进白名单），按跳过处理：打印原因 + 退出码 0。 */
if (!fs.existsSync(userscriptPath)) {
  console.log('跳过：userscript GM storage 同步验证专项 —— 被测源文件 userscripts/odin-gm-sync-check.user.js 不存在。'
    + '该脚本是开发阶段验证工具，不进公开仓白名单，故公开仓内本文件无被测对象，0 项断言、退出码 0（未冒充通过）。');
  process.exit(0);
}
const userscriptSrc = fs.readFileSync(userscriptPath, 'utf8');

let checks = 0;
const check = label => { checks += 1; return label; };

/* ---------- 挂载：整站页面 + GM 桩 + userscript ---------- */
/* 把 userscript 注入一个已建好的页面沙箱（分开两步是为了能断言
 * 「注入前 vs 注入后」的存储零变化——站点自身的启动迁移不算在脚本头上） */
function attachUserscript(page) {
  const gmStore = new Map();
  /* JSON 深拷贝模拟 GM storage 的结构化存储语义（写入后改动原对象不影响存储值） */
  page.sandbox.GM_setValue = (key, value) => { gmStore.set(String(key), JSON.parse(JSON.stringify(value))); };
  page.sandbox.GM_getValue = (key, def) => (gmStore.has(String(key)) ? gmStore.get(String(key)) : def);
  page.sandbox.unsafeWindow = page.sandbox;
  /* 桩沙箱没有 StorageEvent/Event 构造器，userscript 会降级派发普通对象——
   * 这里把它路由进 dom-stub 的 fireWindow，等价于真实浏览器的 window storage 事件。 */
  page.sandbox.dispatchEvent = event => page.fireWindow(event.type, event);
  page.sandbox.module = { exports: {} };
  vm.runInNewContext(userscriptSrc, page.sandbox, { filename: 'odin-gm-sync-check.user.js' });
  page.gmStore = gmStore;
  page.api = page.sandbox.module.exports;
  return page;
}
function newScriptedPage(options = {}) {
  return attachUserscript(newPage(options));
}

const btn = (page, cls) => querySelect(page.dom.body, `.odin-gm-check-${cls}`);
const statusText = page => querySelect(page.dom.body, '.odin-gm-check-status').textContent;
const seededArchive = overrides => archiveJson(Object.assign({
  xp: 321,
  totalActiveSeconds: 600,
  coins: 55,
  lessons: { [FIRST_LESSON]: lessonEntryJson({ started: true, completed: true, completedAt: '2026-09-16T08:00:00.000Z' }) },
  profile: { nickname: '验证水手', avatarId: 'terminal', avatarData: null, equippedFrameId: 'frame-basic' }
}, overrides));

/* ===================== 0. 元数据与安全边界（源码扫描） ===================== */
{
  /* v1.0.1 起 @match 恰好两条：本地开发环回 + 公开仓 GitHub Pages 项目路径。
   * 清单级断言：不多不少、不含 localhost、不含站点根通配、不含全网通配。 */
  const matchLines = (userscriptSrc.match(/^\/\/ @match\s+\S+$/gm) || []).map(line => line.replace(/^\/\/ @match\s+/, ''));
  assert.deepEqual(matchLines, ['http://127.0.0.1/*', 'https://ll96victor.github.io/the-odin-project-zh/*'],
    check('@match 清单恰好 = 本地环回任意端口 + 公开仓 Pages 项目路径（/* 覆盖首页与子路径）'));
  assert.ok(!matchLines.includes('https://ll96victor.github.io/*'), check('不匹配 GitHub 站点根（只到项目路径）'));
  assert.ok(!userscriptSrc.includes('*://*/*'), check('源码无 *://*/* 全网匹配'));
  const grants = [...userscriptSrc.matchAll(/^\/\/ @grant\s+(\S+)/gm)].map(m => m[1]).sort();
  assert.deepEqual(grants, ['GM_getValue', 'GM_setValue', 'unsafeWindow'], check('@grant 恰好三项：GM_setValue / GM_getValue / unsafeWindow（无网络类 grant）'));
  for (const banned of ['GM_xmlhttpRequest', 'XMLHttpRequest', 'fetch(', '@require', '@connect']) {
    assert.ok(!userscriptSrc.includes(banned), check(`源码无网络/远程依赖字样：${banned}`));
  }
  /* 除 @match 外不得出现任何 http(s) URL（不加载远程资源） */
  const urlLines = userscriptSrc.split('\n').filter(line => /https?:\/\//.test(line) && !line.includes('@match'));
  assert.equal(urlLines.length, 0, check('除 @match 外源码零 URL（零远程字体/脚本/接口）'));
  assert.match(userscriptSrc, /更新日志：/, check('头部有更新日志块（全局脚本规范）'));
  /* 历史条目保留（最新版本在最上面的规范由下方 newestEntry 断言钉住） */
  assert.match(userscriptSrc, /v1\.0\.0 \(2026-09-17\)/, check('历史更新日志条目保留（v1.0.0 首建）'));
  const metaVersion = /@version\s+(\S+)/.exec(userscriptSrc)[1];
  const constVersion = /SCRIPT_VERSION = '([^']+)'/.exec(userscriptSrc)[1];
  assert.equal(metaVersion, constVersion, check(`@version 与 SCRIPT_VERSION 常量一致（${metaVersion}）`));
  /* 更新日志最新一条必须等于当前 @version */
  const logBlock = /更新日志：([\s\S]*?)\n \*\//.exec(userscriptSrc)[1];
  const newestEntry = /v(\d+\.\d+\.\d+) \(\d{4}-\d{2}-\d{2}\)/.exec(logBlock);
  assert.ok(newestEntry, check('更新日志能解析出最新版本条目'));
  assert.equal(newestEntry[1], metaVersion, check(`更新日志最新一条 = 当前 @version（${metaVersion}）`));
  assert.match(userscriptSrc, /Ready for Human Verification/, check('源码明确标注跨设备同步为 Ready for Human Verification'));
}

/* ===================== 1. 面板挂载与「加载零写入」 ===================== */
{
  const storage = makeStorage();
  storage.setItem(STORAGE_KEY, seededArchive());
  /* 先让站点自己完成启动加载（v3 种子档案会被站点迁移到 v4 并结算成就——
   * 这是站点既有行为，storage-migration.test 专项钉住，不属于 userscript） */
  const page = newPage({ storage });
  const rawBefore = storage.getItem(STORAGE_KEY);
  assert.ok(rawBefore && JSON.parse(rawBefore).schemaVersion === 4, check('前置：站点启动已把种子档案迁到 schema 4'));
  /* 注入 userscript 后：存储必须逐字节不动、GM 必须为空（需求 9：加载零静默写入） */
  attachUserscript(page);
  assert.ok(page.api && typeof page.api.saveToGm === 'function', check('测试接缝：module.exports 暴露核心 API'));
  const pill = btn(page, 'pill');
  const panel = btn(page, 'panel');
  assert.ok(pill && panel, check('面板挂载：胶囊与面板都在 body 上'));
  assert.ok(panel.className.includes('odin-gm-check-hidden'), check('面板默认收起（不遮挡学习内容）'));
  dispatch(pill, 'click', {});
  assert.ok(!panel.className.includes('odin-gm-check-hidden'), check('点击胶囊展开面板'));
  assert.ok(pill.className.includes('odin-gm-check-hidden'), check('展开后胶囊隐藏'));
  for (const name of ['btn-save', 'btn-restore', 'btn-export', 'btn-import', 'btn-confirm-yes', 'btn-confirm-no', 'btn-rollback', 'btn-reload']) {
    assert.ok(btn(page, name), check(`面板按钮存在：${name}`));
  }
  const confirmRow = btn(page, 'btn-confirm-yes').parentNode;
  assert.ok(confirmRow.className.includes('odin-gm-check-hidden'), check('两段确认行初始隐藏（恢复必须先点入口再确认）'));
  /* 需求 9：页面加载绝不静默写数据 */
  assert.equal(storage.getItem(STORAGE_KEY), rawBefore, check('userscript 加载后 localStorage 逐字节未动（零静默写入）'));
  assert.equal(page.gmStore.size, 0, check('userscript 加载后 GM storage 为空（零静默保存）'));
}

/* ===================== 2. 数据为空路径 ===================== */
{
  const storage = makeStorage();
  const page = newScriptedPage({ storage });
  /* 站点初始化会自动建出空档案（既有行为，发布实施轮 TEST-REPORT 有记录）；
   * 「存储里还没有档案」的数据为空路径要先移除 key 才能触达。 */
  assert.ok(storage.getItem(STORAGE_KEY), check('前置：站点初始化自动建出空档案 key（既有行为）'));
  storage.removeItem(STORAGE_KEY);
  const save = page.api.saveToGm();
  assert.equal(save.ok, false, check('空页面保存：失败'));
  assert.equal(save.empty, true, check('空页面保存：标记为数据为空（不是错误）'));
  assert.match(save.error, /数据为空/, check('空页面保存：中文「数据为空」提示'));
  const restore = page.api.restoreFromGm();
  assert.equal(restore.ok, false, check('空 GM 恢复：失败'));
  assert.equal(restore.empty, true, check('空 GM 恢复：标记为数据为空'));
  const payload = page.api.buildExportPayload();
  assert.equal(payload.ok, false, check('双空导出：失败并标记数据为空'));
  assert.equal(payload.empty, true, check('双空导出：empty=true'));
  const rollback = page.api.restoreFromRestorePoint();
  assert.equal(rollback.ok, false, check('无恢复点回滚：失败'));
  assert.equal(rollback.empty, true, check('无恢复点回滚：标记为数据为空'));
}

/* ===================== 3. 场景 A：localStorage → GM（保存 + 回读比对） ===================== */
let envelopeFromA = null;
{
  const storage = makeStorage();
  const page = newScriptedPage({ storage });
  /* 用站点公共 API 造一组可识别的学习数据（importArchive 会持久化到 localStorage） */
  const imported = page.progress.importArchive(seededArchive());
  assert.equal(imported.ok, true, check('A 前置：站点 importArchive 造数据成功'));
  const raw = storage.getItem(STORAGE_KEY);
  assert.ok(raw && JSON.parse(raw).xp === 321, check('A 前置：localStorage 已落盘 xp=321 档案'));

  /* 走面板按钮路径（验证按钮接线），再用 API 断言数据 */
  dispatch(btn(page, 'pill'), 'click', {});
  dispatch(btn(page, 'btn-save'), 'click', {});
  assert.match(statusText(page), /保存到油猴成功/, check('A：点击「保存到油猴」状态行显示成功'));
  assert.match(statusText(page), /XP 321/, check('A：状态行展示真实摘要（XP 321）'));
  assert.match(statusText(page), /回读比对 7 个关键字段/, check('A：状态行说明回读比对了 7 个关键字段'));

  const env = page.gmStore.get('odinArchive');
  assert.ok(env, check('A：GM storage 里有 odinArchive 信封'));
  assert.equal(env.format, 'odin-gm-sync-check', check('A：信封 format 标识正确'));
  assert.equal(env.envelopeVersion, 1, check('A：信封版本 = 1'));
  assert.equal(env.source, 'localStorage', check('A：来源标记 = localStorage'));
  assert.equal(env.data, raw, check('A：信封 data 与 localStorage 原文逐字节一致'));
  assert.equal(env.schemaVersion, 4, check('A：schemaVersion = 4'));
  assert.ok(/^\d{4}-\d{2}-\d{2}T/.test(env.savedAt), check('A：savedAt 是 ISO 时间戳'));
  assert.equal(env.app, 'the-odin-project-zh', check('A：记录页面 app 标识'));
  assert.ok(env.productVersion, check('A：记录页面产品版本'));

  const result = page.api.saveToGm();
  assert.equal(result.ok, true, check('A：API 级保存成功（重复保存幂等）'));
  assert.deepEqual(Array.from(result.comparedFields), ['xp', 'level', 'completed', 'coins', 'achievements', 'totalActiveSeconds', 'nickname'], check('A：回读比对字段清单 = XP/等级/完成课数/叶片/成就/累计时长/昵称'));
  assert.equal(result.summary.xp, 321, check('A：摘要 xp=321'));
  assert.equal(result.summary.completed, 1, check('A：摘要完成课数=1'));
  assert.equal(result.summary.coins, 55, check('A：摘要叶片=55'));
  assert.equal(result.summary.nickname, '验证水手', check('A：摘要昵称=「验证水手」'));
  envelopeFromA = page.gmStore.get('odinArchive');
}

/* ===================== 4. 场景 B：GM → localStorage（两段确认恢复） ===================== */
{
  const storage = makeStorage();
  const page = newScriptedPage({ storage });
  /* 先把 A 的信封放进本页 GM（模拟「另一台电脑同步过来的存档」） */
  page.sandbox.GM_setValue('odinArchive', envelopeFromA);
  /* 当前页面数据改成另一份可识别档案（xp=50），恢复前它就是「会被覆盖的现状」 */
  page.progress.importArchive(seededArchive({ xp: 50, totalActiveSeconds: 60, coins: 5, lessons: {}, profile: { nickname: '临时状态', avatarId: 'terminal', avatarData: null, equippedFrameId: 'frame-basic' } }));
  const changedRaw = storage.getItem(STORAGE_KEY);
  assert.equal(JSON.parse(changedRaw).xp, 50, check('B 前置：当前页面档案已变为 xp=50'));

  dispatch(btn(page, 'pill'), 'click', {});
  /* 第一段：点「从油猴恢复」只进入确认态，不写任何数据 */
  dispatch(btn(page, 'btn-restore'), 'click', {});
  assert.equal(storage.getItem(STORAGE_KEY), changedRaw, check('B：第一段点击后 localStorage 未动（无静默覆盖）'));
  assert.match(statusText(page), /第二段确认/, check('B：状态行进入第二段确认'));
  assert.match(statusText(page), /XP 321/, check('B：确认文案展示将要恢复的存档摘要'));
  /* 取消路径 */
  dispatch(btn(page, 'btn-confirm-no'), 'click', {});
  assert.equal(storage.getItem(STORAGE_KEY), changedRaw, check('B：取消后数据未动'));
  assert.match(statusText(page), /已取消/, check('B：取消有明确提示'));
  /* 第二段：确认恢复 */
  dispatch(btn(page, 'btn-restore'), 'click', {});
  dispatch(btn(page, 'btn-confirm-yes'), 'click', {});
  assert.equal(storage.getItem(STORAGE_KEY), envelopeFromA.data, check('B：localStorage 已恢复为 GM 存档原文（逐字节一致）'));
  assert.equal(page.progress.getState().xp, 321, check('B：页面内存态已同步 xp=321（storage 事件 → reloadFromStorage 真实链路）'));
  assert.equal(page.progress.getState().profile.nickname, '验证水手', check('B：内存态昵称已恢复'));
  assert.equal(page.progress.autoLoadInfo().failed, false, check('B：恢复后无读档失败冻结'));
  /* UI 真实刷新：header 玩家 chip（等级/昵称/叶片）已就地重画为恢复后的数据。
   * 首页默认 DOM 无大块内容（home-ia 红线），XP 明细住在懒加载 sheet 里，
   * 玩家 chip 是首页可见的刷新证据。xp=321 → Lv.5（LEVEL_CURVE 280≤321<400）。 */
  assert.equal(querySelect(page.dom.body, '.player-name').textContent, '验证水手', check('B：header 昵称已就地重画为「验证水手」（refreshAll 真实执行）'));
  assert.equal(querySelect(page.dom.body, '.player-level').textContent, 'Lv.5', check('B：header 等级已就地重画为 Lv.5（xp=321）'));
  assert.match(querySelect(page.dom.body, '.player-coins').textContent, /55 叶片/, check('B：header 叶片已就地重画为 55'));
  assert.match(statusText(page), /从油猴恢复成功/, check('B：状态行显示恢复成功'));
  /* 双恢复点 */
  const point = page.gmStore.get('odinRestorePoint');
  assert.ok(point && point.data === changedRaw, check('B：GM 恢复点 = 恢复前的页面原文（xp=50 那份）'));
  const backups = page.progress.listBackups();
  assert.ok(backups.some(item => item.reason === '油猴 GM 恢复前自动快照'), check('B：站点备份体系里有「油猴 GM 恢复前自动快照」'));
  assert.match(statusText(page), /GM 恢复点：已存/, check('B：状态行如实报告恢复点结果'));
  /* 回滚：把恢复点写回（同样两段确认走 API 直测数据） */
  const rollback = page.api.restoreFromRestorePoint();
  assert.equal(rollback.ok, true, check('B：回滚到恢复点成功'));
  assert.equal(storage.getItem(STORAGE_KEY), changedRaw, check('B：回滚后 localStorage = 恢复点原文（xp=50）'));
  assert.equal(page.progress.getState().xp, 50, check('B：回滚后内存态 xp=50（刷新链路再次生效）'));
}

/* ===================== 5. 刷新链路机制与失败兜底 ===================== */
{
  const storage = makeStorage();
  const page = newScriptedPage({ storage });
  page.progress.importArchive(seededArchive({ xp: 100 }));
  /* 外部直写存储（模拟另一标签页），再派发刷新 → 内存态应跟上（app.js watchStorage 公共链路） */
  const outside = seededArchive({ xp: 999 });
  storage.setItem(STORAGE_KEY, outside);
  const dispatched = page.api.notifyPageRefresh(STORAGE_KEY);
  assert.equal(dispatched, true, check('刷新：notifyPageRefresh 派发成功'));
  assert.equal(page.progress.getState().xp, 999, check('刷新：storage 事件使内存态重载为 xp=999（userscript 依赖的既有机制成立）'));

  /* 失败兜底：派发被阻断时，恢复必须报 needsReload，且如实说明存储已写、内存未同步 */
  const page2 = newScriptedPage({ storage: makeStorage() });
  page2.progress.importArchive(seededArchive({ xp: 10 }));
  page2.sandbox.GM_setValue('odinArchive', { format: 'odin-gm-sync-check', envelopeVersion: 1, savedAt: '2026-09-17T00:00:00.000Z', source: 'localStorage', schemaVersion: 4, data: seededArchive({ xp: 800 }) });
  page2.sandbox.dispatchEvent = () => { throw new Error('派发被测试阻断'); };
  const result = page2.api.restoreFromGm();
  assert.equal(result.ok, false, check('兜底：刷新链路失效时恢复按未完成处理'));
  assert.equal(result.needsReload, true, check('兜底：needsReload=true，提示用户刷新页面'));
  assert.match(result.error, /刷新页面/, check('兜底：错误文案明确指引刷新（防 finalSave 旧内存态覆盖）'));
  assert.equal(page2.sandbox.localStorage.getItem(STORAGE_KEY) && JSON.parse(page2.sandbox.localStorage.getItem(STORAGE_KEY)).xp, 800, check('兜底：存储本身已写入成功（差的是页面同步）'));
}

/* ===================== 6. 场景 C：旧数据兼容与无效数据防御 ===================== */
{
  /* C1：schema 3 旧档案（archiveJson 默认 v3，不含 celebratedLevel 等 v4.5+ 可选字段） */
  const page = newScriptedPage({ storage: makeStorage() });
  const oldArchive = seededArchive({ schemaVersion: 3, xp: 180 });
  const imported = page.api.importJsonText(oldArchive, 'old-v3.json');
  assert.equal(imported.ok, true, check('C1：schema 3 旧档案通过严格校验导入 GM'));
  assert.equal(imported.summary.xp, 180, check('C1：导入摘要 xp=180'));
  const env = page.gmStore.get('odinArchive');
  assert.equal(env.source, 'json-file', check('C1：来源标记 = json-file'));
  assert.equal(env.sourceFilename, 'old-v3.json', check('C1：记录来源文件名'));
  assert.equal(env.rawSchemaVersion, 3, check('C1：信封记录原文 schema v3'));
  assert.equal(env.schemaVersion, 4, check('C1：信封记录迁移后 schema v4'));
  const restored = page.api.restoreFromGm();
  assert.equal(restored.ok, true, check('C1：旧档案恢复到页面成功（站点加载路径自动迁移）'));
  assert.equal(page.progress.getState().xp, 180, check('C1：恢复后 xp=180'));
  assert.equal(JSON.parse(page.sandbox.localStorage.getItem(STORAGE_KEY)).schemaVersion, 3, check('C1：存储原文保持 v3（迁移交给站点加载路径，脚本不改写原文）'));

  /* C2：缺少可选字段的 v4 档案不会导致页面崩溃 */
  const partial = JSON.parse(archiveJson({ schemaVersion: 4, xp: 222 }));
  for (const field of ['settings', 'history', 'achievementTiers', 'reviews', 'bosses', 'celebratedLevel', 'cosmetics']) delete partial[field];
  const partialText = JSON.stringify(partial);
  const importedPartial = page.api.importJsonText(partialText, 'partial.json');
  assert.equal(importedPartial.ok, true, check('C2：缺可选字段的档案通过严格校验（白名单补默认）'));
  const restoredPartial = page.api.restoreFromGm();
  assert.equal(restoredPartial.ok, true, check('C2：缺字段档案恢复成功，页面无崩溃'));
  const state = page.progress.getState();
  assert.equal(state.xp, 222, check('C2：恢复后 xp=222'));
  assert.ok(state.settings && typeof state.settings.dailyGoalMinutes === 'number', check('C2：settings 补种默认值'));
  assert.ok(Array.isArray(state.history), check('C2：history 补种空数组'));
  assert.ok(state.cosmetics && state.cosmetics.themeId, check('C2：cosmetics 补种默认主题'));

  /* C3：无效 JSON / 未知课程编号 / 敏感字段——一律拒绝且零修改 */
  const before = page.gmStore.get('odinArchive');
  const storageBefore = page.sandbox.localStorage.getItem(STORAGE_KEY);
  const badJson = page.api.importJsonText('{"xp": 123,,,}', 'bad.json');
  assert.equal(badJson.ok, false, check('C3：无效 JSON 导入被拒绝'));
  assert.deepEqual(page.gmStore.get('odinArchive'), before, check('C3：无效 JSON 后 GM 存档原样（未覆盖有效数据）'));
  const unknownLesson = page.api.importJsonText(archiveJson({ lessons: { 'not-a-real-lesson': lessonEntryJson({ completed: true }) } }), 'unknown.json');
  assert.equal(unknownLesson.ok, false, check('C3：未知课程编号被严格模式整份拒绝'));
  assert.match(unknownLesson.error, /未知的课程编号/, check('C3：拒绝原因是中文「未知的课程编号」'));
  const sensitive = page.api.importJsonText(archiveJson({ password: 'hunter2' }), 'leak.json');
  assert.equal(sensitive.ok, false, check('C3：含敏感字段名的文件被拒绝（红线：敏感数据不进档案）'));
  assert.match(sensitive.error, /敏感字段/, check('C3：拒绝原因明示敏感字段'));
  const emptyFile = page.api.importJsonText('   ', 'empty.json');
  assert.equal(emptyFile.ok, false, check('C3：空文件被拒绝并标记数据为空'));
  assert.equal(emptyFile.empty, true, check('C3：空文件 empty=true'));
  assert.deepEqual(page.gmStore.get('odinArchive'), before, check('C3：全部拒绝路径后 GM 存档仍原样'));
  assert.equal(page.sandbox.localStorage.getItem(STORAGE_KEY), storageBefore, check('C3：全部拒绝路径后 localStorage 原样'));

  /* C4：信封格式保护——GM 里躺着别的格式的值时拒绝恢复 */
  page.sandbox.GM_setValue('odinArchive', { format: 'some-other-script', data: '{}' });
  const info = page.api.getGmInfo();
  assert.equal(info.ok, false, check('C4：外来格式信封被识别为不可用'));
  assert.match(info.error, /format 标识不符/, check('C4：错误明示 format 标识不符'));
  const refused = page.api.restoreFromGm();
  assert.equal(refused.ok, false, check('C4：外来格式信封恢复被拒绝（页面数据未动）'));
}

/* ===================== 7. 损坏档案冻结页：恢复合法档案可解冻 ===================== */
{
  const storage = makeStorage();
  storage.setItem(STORAGE_KEY, '{"xp": 123,,,}');   // 损坏原文
  const page = newScriptedPage({ storage });
  assert.equal(page.progress.autoLoadInfo().failed, true, check('冻结：损坏档案使页面进入读档失败保护'));
  page.progress.markVisited(FIRST_LESSON);
  assert.equal(storage.getItem(STORAGE_KEY), '{"xp": 123,,,}', check('冻结：保护期内写入被冻结，损坏原文未被覆盖'));
  /* 用严格校验把一份合法档案放进 GM，再恢复 */
  const seeded = page.api.importJsonText(seededArchive({ xp: 77 }), 'good.json');
  assert.equal(seeded.ok, true, check('冻结页：合法档案可导入 GM'));
  const restored = page.api.restoreFromGm();
  assert.equal(restored.ok, true, check('冻结页：从 GM 恢复成功'));
  assert.equal(page.progress.autoLoadInfo().failed, false, check('冻结页：恢复后写入冻结解除'));
  assert.equal(page.progress.getState().xp, 77, check('冻结页：内存态 xp=77'));
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)).xp, 77, check('冻结页：存储已是合法档案（xp=77）'));
  /* 恢复点此时是损坏原文：回滚必须被校验拒绝，而不是把损坏数据写回 */
  const rollback = page.api.restoreFromRestorePoint();
  assert.equal(rollback.ok, false, check('冻结页：恢复点是损坏原文时回滚被拒绝（校验兜底）'));
  assert.equal(page.progress.getState().xp, 77, check('冻结页：被拒绝的回滚没有破坏已恢复的数据'));
  const backups = page.progress.listBackups();
  assert.ok(backups.some(item => item.reason === '油猴 GM 恢复前自动快照'), check('冻结页：恢复前站点快照存的是存储原文（损坏档案也保住）'));
}

/* ===================== 8. 旧 key 回落读取 ===================== */
{
  const storage = makeStorage();
  const legacyRaw = seededArchive({ xp: 66 });
  storage.setItem(LEGACY_STORAGE_KEY, legacyRaw);
  const page = newScriptedPage({ storage });
  assert.ok(storage.getItem(STORAGE_KEY), check('旧 key：站点启动迁移已把原文搬到新 key（既有行为）'));
  const saved = page.api.saveToGm();
  assert.equal(saved.ok, true, check('旧 key：老用户档案可保存到 GM'));
  assert.equal(page.gmStore.get('odinArchive').data, storage.getItem(STORAGE_KEY), check('旧 key：信封 data 与当前 key 存储原文逐字节一致'));
  assert.equal(JSON.parse(page.gmStore.get('odinArchive').data).xp, 66, check('旧 key：老档案学习数据（xp=66）完整进入 GM'));
  assert.equal(storage.getItem(LEGACY_STORAGE_KEY), legacyRaw, check('旧 key：历史 key 原文保留、未被脚本删除或改写'));
  assert.equal(page.gmStore.get('odinArchive').storageKey, STORAGE_KEY, check('旧 key：信封记录实际读取的 key = 当前 key'));
}

/* ===================== 9. 导出（人工兜底）内容 ===================== */
{
  const page = newScriptedPage({ storage: makeStorage() });
  page.progress.importArchive(seededArchive({ xp: 404 }));
  page.api.saveToGm();
  const payload = page.api.buildExportPayload();
  assert.equal(payload.ok, true, check('导出：payload 构建成功'));
  assert.equal(payload.text, page.gmStore.get('odinArchive').data, check('导出：内容 = GM 存档原文（与本站导出档案同格式，站点原生导入可吃）'));
  assert.match(payload.filename, /^odin-gm-archive-\d{4}-\d{2}-\d{2}\.json$/, check('导出：文件名带日期戳'));
  assert.match(payload.source, /油猴存档/, check('导出：来源标注为油猴存档'));
  /* 导出内容本身能通过站点严格导入校验（人工兜底文件是可用的） */
  const strict = page.progress.previewImport(payload.text);
  assert.equal(strict.ok, true, check('导出：文件内容通过站点 previewImport 严格校验'));
  assert.equal(strict.state.xp, 404, check('导出：校验后 xp=404'));
  /* GM 为空时导出当前页面档案 */
  const page2 = newScriptedPage({ storage: makeStorage() });
  page2.progress.importArchive(seededArchive({ xp: 11 }));
  const payload2 = page2.api.buildExportPayload();
  assert.equal(payload2.ok, true, check('导出：GM 为空时回落导出页面档案'));
  assert.match(payload2.source, /localStorage/, check('导出：回落来源标注为页面 localStorage'));
  assert.equal(JSON.parse(payload2.text).xp, 11, check('导出：回落内容 xp=11'));
  /* 桩环境无真实 Blob/URL 下载链路：exportJson 走「不支持下载」分支且不抛错 */
  page2.sandbox.Blob = undefined;
  const exported = page2.api.exportJson();
  assert.equal(exported.ok, true, check('导出：无下载能力环境返回 ok + downloaded=false（真实浏览器下载 = Ready for Human Verification）'));
  assert.equal(exported.downloaded, false, check('导出：downloaded=false 如实标注'));
}

console.log(`通过：userscript GM storage 同步验证专项 ${checks} 项断言（元数据/零网络边界、面板挂载与加载零写入、A 保存回读逐字段、B 两段确认恢复+双恢复点+UI 就地刷新+回滚、刷新链路与失败兜底、C 旧 schema/缺字段/无效 JSON/未知课程/敏感字段/外来信封、损坏档案冻结页恢复解冻、旧 key 回落、导出兜底内容）。油猴实机与跨设备同步不在 Node 范围，见 TEST-REPORT「Ready for Human Verification」。（本文件在公开仓内为 skip 语义：被测源文件不进公开仓，缺失时打印跳过说明并以退出码 0 结束。）`);
