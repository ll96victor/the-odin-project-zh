/* userscript WebDAV 桥专项（v4.11.44 云同步轮；v4.11.45 补 FIX-1 根因测试 G/G2 组）。
 *
 * 被测对象：userscripts/odin-cloud-sync.user.js 的 WebDAV 桥（headless 部分）。
 * 方法：dom-stub 真实挂载整站（progress.js 等页面 API 齐备，桥用它们做校验）+ 注入
 * GM_setValue / GM_getValue / GM_xmlhttpRequest 桩，然后**验证最终数据与请求构造**而不是
 * 「函数执行成功」：
 *   A. 桥协议边界：方法白名单、命名空间/请求 id/source/origin 四项校验；
 *   B. 凭据边界：账号与应用密码只进 GM storage，站点 localStorage 全文零凭据；
 *   C. WebDAV 请求构造：MKCOL 幂等建目录 + PUT 上传（Basic auth 头）+ GET 下载 +
 *      PROPFIND 时间戳；每个请求的 URL 都落在单域白名单 dav.jianguoyun.com；
 *   D. 错误分支中文映射与「失败不静默」：401 / 403 / 404 / 429 / 网络不可达，
 *      429 标记 rateLimited 且状态落盘；
 *   E. 恢复兼容：坏 JSON / 格式不符拒绝；兼容读旧 odin-gm-sync-check 信封；
 *   F. 纯函数：maskAccount 掩码、base64、describeStatus。
 * 真实坚果云连通性无法在 Node 验证——见 TEST-REPORT 与 userscripts/README.md 的
 * 「Ready for Human Verification」。
 *
 * 运行：node tests/userscript-webdav-bridge.test.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const { newPage, makeStorage, STORAGE_KEY, archiveJson, lessonEntryJson, FIRST_LESSON } = require('./dom-stub.cjs');

const root = path.resolve(__dirname, '..');
const bridgePath = path.join(root, 'userscripts', 'odin-cloud-sync.user.js');

if (!fs.existsSync(bridgePath)) {
  console.log('跳过：userscript WebDAV 桥专项 —— 被测源文件 userscripts/odin-cloud-sync.user.js 不存在。0 项断言、退出码 0（未冒充通过）。');
  process.exit(0);
}
const bridgeSrc = fs.readFileSync(bridgePath, 'utf8');

let checks = 0;
const check = label => { checks += 1; return label; };

/* ---------- 挂载：整站页面 + GM 桩 + GM_xmlhttpRequest 桩 + 脚本 ---------- */
function mountBridge(options = {}) {
  const storage = options.storage || makeStorage();
  const page = newPage(Object.assign({ storage }, options));
  const gmStore = new Map();
  page.sandbox.GM_setValue = (key, value) => { gmStore.set(String(key), value === null ? null : JSON.parse(JSON.stringify(value))); };
  page.sandbox.GM_getValue = (key, def) => (gmStore.has(String(key)) ? gmStore.get(String(key)) : (gmStore.get(String(key)) === null ? null : def));
  page.sandbox.unsafeWindow = page.sandbox;
  const calls = [];
  let handler = () => ({ status: 200, responseText: '' });
  page.sandbox.GM_xmlhttpRequest = opts => {
    calls.push(opts);
    const result = handler(opts) || {};
    if (result.__networkError) { opts.onerror(); return; }
    if (result.__timeout) { opts.ontimeout(); return; }
    opts.onload({ status: result.status === undefined ? 200 : result.status, responseText: result.responseText || '', responseHeaders: result.responseHeaders || '' });
  };
  page.sandbox.module = { exports: {} };
  vm.runInNewContext(bridgeSrc, page.sandbox, { filename: 'odin-cloud-sync.user.js' });
  page.api = page.sandbox.module.exports;
  /* vm 上下文内的 window 对象（contextify 后与宿主 sandbox 不是同一引用）——
   * 桥用它做来源校验，测试必须用同一个对象伪造 message 事件才等同于真实页面。 */
  const innerWindow = vm.runInNewContext('window', page.sandbox);
  return {
    page, calls, gmStore, innerWindow,
    setHandler(fn) { handler = fn; },
    respondWith(map) { handler = opts => map(opts); }
  };
}

const seedArchive = () => archiveJson({
  xp: 120, coins: 30, totalActiveSeconds: 600,
  lessons: { [FIRST_LESSON]: lessonEntryJson({ started: true, completed: true, completedAt: '2026-10-01T08:00:00.000Z' }) }
});
const makeEnvelope = (data, extra = {}) => JSON.stringify(Object.assign({
  format: 'odin-webdav-sync', envelopeVersion: 1, savedAt: '2026-10-09T10:00:00.000Z',
  source: 'site', schemaVersion: 4, rawSchemaVersion: 4, data
}, extra));

const tick = () => new Promise(resolve => setImmediate(resolve));

/* WebDAV 桩：MKCOL 报「已存在」（405 也算成功）/ PROPFIND 按 cloudAt 决定（null = 云端无文件
 * → 404）/ PUT 与 GET 默认成功。**云同步 v1.1.1 起 PUT 之前必有一次 PROPFIND 复查**，
 * 所以每个备份场景都要显式给出云端那一侧的样子，否则桩会以 404 放行。 */
function davHandler(options = {}) {
  const cloudAt = options.cloudAt === undefined ? null : options.cloudAt;
  const overrides = options.overrides || {};
  return opts => {
    if (overrides[opts.method]) return overrides[opts.method];
    if (opts.method === 'MKCOL') return { status: 405 };
    if (opts.method === 'PROPFIND') {
      if (!cloudAt) return { status: 404 };
      return {
        status: 207,
        responseText: `<d:multistatus xmlns:d="DAV:"><d:response><d:propstat><d:prop><d:getlastmodified>${cloudAt}</d:getlastmodified></d:prop></d:propstat></d:response></d:multistatus>`
      };
    }
    return { status: 201 };
  };
}

(async () => {
  /* ===================== A. 桥协议边界 ===================== */
  {
    const bridge = mountBridge();
    const api = bridge.page.api;
    assert.deepEqual([...api.bridgeMethods].sort(),
      ['backup', 'clear-config', 'configure', 'ping', 'restore', 'set-auto-backup', 'status', 'test'],
      check('A：桥方法白名单恰好 8 项'));
    assert.ok(api.WEBDAV_BASE.startsWith('https://dav.jianguoyun.com/'),
      check('A：WebDAV 端点固定在 dav.jianguoyun.com 单域'));
    assert.equal(api.WEBDAV_FORMAT, 'odin-webdav-sync', check('A：云同步信封格式标识 = odin-webdav-sync'));
    assert.deepEqual([...api.WEBDAV_COMPAT_FORMATS].sort(), ['odin-gm-sync-check', 'odin-webdav-sync'],
      check('A：恢复侧兼容读旧 odin-gm-sync-check 信封'));

    /* 非本命名空间 / 回复消息 / 缺 id —— 三种都要被忽略（返回 false，不产生任何回复） */
    assert.equal(api.handleBridgeMessage({ hello: 1 }, () => {}), false, check('A：非命名空间消息被忽略'));
    assert.equal(api.handleBridgeMessage({ __odinCloudSync: true, reply: true, id: 'x', method: 'ping' }, () => {}), false,
      check('A：桥对自己发出的回复不再回应（防回声死循环）'));
    assert.equal(api.handleBridgeMessage({ __odinCloudSync: true, method: 'ping' }, () => {}), false,
      check('A：缺请求 id 的消息被忽略'));

    /* 未知方法：受理但明确拒绝 */
    const replies = [];
    assert.equal(api.handleBridgeMessage({ __odinCloudSync: true, id: 'r1', method: 'open-proxy' }, (id, res) => replies.push({ id, res })), true,
      check('A：未知方法被受理（有回复）'));
    await tick();
    assert.equal(replies.length, 1, check('A：未知方法收到一条回复'));
    assert.equal(replies[0].res.ok, false, check('A：未知方法回复 ok=false（拒绝，不被当开放代理）'));
    assert.match(replies[0].res.error, /未知方法/, check('A：未知方法错误文案明确'));

    /* ping 经完整消息入口：source 与 origin 校验 */
    api.sentReplies.length = 0;
    bridge.page.fireWindow('message', { data: { __odinCloudSync: true, id: 'p1', method: 'ping' }, source: bridge.innerWindow, origin: 'http://127.0.0.1:8765' });
    await tick();
    assert.equal(api.sentReplies.length, 1, check('A：source/origin 合法时 ping 得到回复'));
    assert.equal(api.sentReplies[0].reply, true, check('A：回复带 reply 标记'));
    assert.equal(api.sentReplies[0].ok, true, check('A：ping 回复 ok'));
    assert.equal(api.sentReplies[0].version, api.version, check('A：ping 回复带脚本版本'));

    api.sentReplies.length = 0;
    bridge.page.fireWindow('message', { data: { __odinCloudSync: true, id: 'p2', method: 'ping' }, source: { fake: true }, origin: 'http://127.0.0.1:8765' });
    await tick();
    assert.equal(api.sentReplies.length, 0, check('A：source 不是本窗口的消息被丢弃'));

    bridge.page.fireWindow('message', { data: { __odinCloudSync: true, id: 'p3', method: 'ping' }, source: bridge.innerWindow, origin: 'https://evil.example' });
    await tick();
    assert.equal(api.sentReplies.length, 0, check('A：origin 不是本页面 origin 的消息被丢弃'));

    /* 页面加载不写 GM */
    assert.equal(bridge.gmStore.size, 0, check('A：页面加载零 GM 写入'));
  }

  /* ===================== B/C. 配置、凭据边界与请求构造 ===================== */
  {
    const storage = makeStorage();
    storage.setItem(STORAGE_KEY, seedArchive());
    const bridge = mountBridge({ storage });
    const api = bridge.page.api;
    bridge.setHandler(davHandler());

    /* 未配置时的状态 */
    const s0 = await api.webdavStatus({});
    assert.equal(s0.installed, true, check('B：状态 installed=true'));
    assert.equal(s0.configured, false, check('B：未配置时 configured=false'));
    assert.equal(s0.server, 'https://dav.jianguoyun.com/dav/', check('B：状态给出服务器地址'));
    assert.equal(s0.remotePath, 'Odin学习站/odin-progress.json', check('B：状态给出远端路径（专用子目录单文件）'));

    /* 配置校验 */
    assert.equal(api.davConfigure({ account: '', password: 'x' }).ok, false, check('C：空账号被拒'));
    assert.equal(api.davConfigure({ account: 'someone', password: 'x' }).ok, false, check('C：账号不是邮箱形态被拒'));
    assert.equal(api.davConfigure({ account: 'someone@example.com', password: '' }).ok, false, check('C：缺应用密码被拒'));

    const configured = api.davConfigure({ account: 'someone@example.com', password: 'app-pass-123' });
    assert.equal(configured.ok, true, check('C：合法账号 + 应用密码配置成功'));
    assert.equal(configured.accountMask, 's***@example.com', check('C：账号按掩码回显（只留首字符与域名）'));

    /* 密码留空且账号未变 → 沿用已存密码 */
    const kept = api.davConfigure({ account: 'someone@example.com', password: '' });
    assert.equal(kept.ok, true, check('C：密码留空且账号未变时沿用已存密码'));
    assert.equal(kept.passwordKept, true, check('C：沿用已存密码时如实标记 passwordKept'));
    assert.equal(api.readWebdavConfig().password, 'app-pass-123', check('C：GM 里密码仍是原值（未被空串清掉）'));

    /* 状态快照不含明文密码 */
    const s1 = await api.webdavStatus({});
    assert.equal(s1.configured, true, check('C：配置后 configured=true'));
    assert.equal(s1.accountMask, 's***@example.com', check('C：状态回显账号掩码'));
    assert.ok(!JSON.stringify(s1).includes('app-pass-123'), check('C：状态快照绝不含明文密码'));
    assert.ok(!('password' in s1), check('C：状态快照根本没有 password 字段'));

    /* 站点 localStorage 全文零凭据（凭据只进 GM） */
    const stored = String(storage.getItem(STORAGE_KEY) || '');
    assert.ok(!stored.includes('app-pass-123'), check('C：站点 localStorage 不含应用密码'));
    assert.ok(!stored.includes('someone@example.com'), check('C：站点 localStorage 不含账号'));
    assert.ok(bridge.gmStore.has('odinWebdavConfig'), check('C：配置落在油猴 GM 存储'));
    assert.ok(String(typeof bridge.gmStore.get('odinWebdavConfig')) === 'object', check('C：GM 配置是结构化对象'));

    /* 备份：MKCOL（405 已存在也算成功）→ **PROPFIND 实时复查** → PUT，URL 全在白名单域，带 Basic auth */
    bridge.calls.length = 0;
    const envelope = JSON.parse(makeEnvelope(seedArchive()));
    const backup = await api.davBackup(envelope);
    assert.equal(backup.ok, true, check('D：备份成功'));
    assert.equal(bridge.calls.length, 3, check('D：备份恰好三次请求（MKCOL + PROPFIND 复查 + PUT）'));
    assert.equal(bridge.calls[0].method, 'MKCOL', check('D：第一次是 MKCOL 建目录'));
    assert.equal(bridge.calls[1].method, 'PROPFIND', check('D：第二次是 PUT 前的云端实时复查'));
    assert.equal(bridge.calls[2].method, 'PUT', check('D：第三次才是 PUT 上传（复查通过后才写）'));
    assert.ok(bridge.calls.every(call => call.url.startsWith('https://dav.jianguoyun.com/')),
      check('D：所有请求 URL 都落在白名单域 dav.jianguoyun.com'));
    assert.ok(!bridge.calls.some(call => /^(?!https:\/\/dav\.jianguoyun\.com)/.test(call.url)),
      check('D：无任何域外请求'));
    const expectedAuth = `Basic ${api.base64('someone@example.com:app-pass-123')}`;
    assert.equal(bridge.calls[2].headers.Authorization, expectedAuth, check('D：PUT 带正确的 Basic auth 头'));
    assert.equal(bridge.calls[2].data, JSON.stringify(envelope), check('D：PUT 上传的是信封原文'));
    assert.equal(backup.savedAt, envelope.savedAt, check('D：备份回报云端 savedAt'));
    const st1 = api.readWebdavState();
    assert.equal(st1.lastBackupResult, 'ok', check('D：成功后 GM 状态记录 lastBackupResult=ok'));
    assert.equal(st1.lastBackedUpSavedAt, envelope.savedAt, check('D：GM 状态记录已备份到的 savedAt（供节流比对）'));

    /* 429（PUT 阶段）：中文文案 + rateLimited 标记 + 失败落盘（不静默） */
    bridge.setHandler(davHandler({ overrides: { PUT: { status: 429 } } }));
    const limited = await api.davBackup(envelope);
    assert.equal(limited.ok, false, check('D：429 时备份失败'));
    assert.equal(limited.rateLimited, true, check('D：429 标记 rateLimited（调用方据此不做重试轰炸）'));
    assert.match(limited.error, /太频繁/, check('D：429 错误文案说明是限流'));
    assert.equal(api.readWebdavState().lastBackupResult, 'failed', check('D：失败结果落盘（下次打开仍可见）'));

    /* 401 */
    bridge.setHandler(davHandler({ overrides: { PUT: { status: 401 } } }));
    const unauthorized = await api.davBackup(envelope);
    assert.match(unauthorized.error, /应用密码/, check('D：401 文案指向「第三方应用密码」'));

    /* 403 */
    bridge.setHandler(davHandler({ overrides: { PUT: { status: 403 } } }));
    const forbidden = await api.davBackup(envelope);
    assert.match(forbidden.error, /权限/, check('D：403 文案说明是权限问题'));

    /* 网络不可达（PUT 阶段） */
    bridge.setHandler(davHandler({ overrides: { PUT: { __networkError: true } } }));
    const offline = await api.davBackup(envelope);
    assert.match(offline.error, /网络不可达/, check('D：网络错误文案说明不可达'));
    assert.equal(api.readWebdavState().lastBackupResult, 'failed', check('D：网络失败同样落盘，不静默'));

    /* 未配置时备份被拒 */
    api.davClearConfig();
    const cleared = await api.webdavStatus({});
    assert.equal(cleared.configured, false, check('C：清除配置后 configured=false'));
    assert.equal(api.readWebdavConfig(), null, check('C：清除配置后 GM 里无配置'));
    assert.ok(!bridge.gmStore.has('odinWebdavConfig') || bridge.gmStore.get('odinWebdavConfig') === null,
      check('C：清除配置后 GM 配置键为空值'));
    const noConfig = await api.davBackup(envelope);
    assert.equal(noConfig.ok, false, check('C：未配置时备份被拒'));
  }

  /* ===================== E. 恢复（含兼容旧信封与拒绝路径） ===================== */
  {
    const bridge = mountBridge();
    const api = bridge.page.api;
    api.davConfigure({ account: 'someone@example.com', password: 'pw' });
    const archived = seedArchive();

    /* 未配置的拒绝路径在上一组已覆盖；这里覆盖云端文件的各种形态 */
    bridge.setHandler(() => ({ status: 404 }));
    const missing = await api.davRestore();
    assert.equal(missing.ok, false, check('E：云端无文件时 ok=false'));
    assert.equal(missing.empty, true, check('E：云端无文件标记 empty（提示先在另一台备份）'));

    bridge.setHandler(() => ({ status: 200, responseText: 'not-json' }));
    const badJson = await api.davRestore();
    assert.match(badJson.error, /JSON/, check('E：云端非 JSON 被拒'));

    bridge.setHandler(() => ({ status: 200, responseText: JSON.stringify({ format: 'something-else', data: '{}' }) }));
    const badFormat = await api.davRestore();
    assert.match(badFormat.error, /format/, check('E：格式标识不符被拒（防误恢复别的格式）'));

    bridge.setHandler(() => ({ status: 200, responseText: makeEnvelope(archived) }));
    const restored = await api.davRestore();
    assert.equal(restored.ok, true, check('E：合法信封读取成功'));
    assert.equal(restored.envelope.data, archived, check('E：信封 data 原文保留（逐字节交给站点校验）'));
    assert.equal(restored.savedAt, '2026-10-09T10:00:00.000Z', check('E：回报云端 savedAt'));

    bridge.setHandler(() => ({ status: 200, responseText: JSON.stringify({ format: 'odin-gm-sync-check', envelopeVersion: 1, savedAt: '2026-09-17T00:00:00.000Z', data: archived }) }));
    const legacy = await api.davRestore();
    assert.equal(legacy.ok, true, check('E：兼容读旧 odin-gm-sync-check 信封'));

    /* test 连接：MKCOL + PROPFIND，失败路径 401 */
    bridge.calls.length = 0;
    bridge.setHandler(opts => (opts.method === 'MKCOL' ? { status: 405 } : { status: 207, responseText: '<d:multistatus/>' }));
    const tested = await api.davTest();
    assert.equal(tested.ok, true, check('E：测试连接成功'));
    assert.deepEqual(bridge.calls.map(c => c.method), ['MKCOL', 'PROPFIND'], check('E：测试连接 = MKCOL + PROPFIND'));
    assert.ok(bridge.calls.every(c => c.url.startsWith('https://dav.jianguoyun.com/')), check('E：测试连接请求也在白名单域'));

    bridge.setHandler(() => ({ status: 401 }));
    const testedBad = await api.davTest();
    assert.equal(testedBad.ok, false, check('E：测试连接 401 失败'));
    assert.match(testedBad.error, /应用密码/, check('E：测试连接 401 文案一致'));
  }

  /* ===================== G. 写入前实时复查云端（v1.1.1 FIX-1 根因测试） =====================
   * 根因形状：站点在打开设置页时把 cloudSavedAt 缓存成 T1；之后另一台设备上传了 T2（T2 > T1）。
   * 旧实现只在打开设置页时查一次云端，PUT 只依赖那份缓存 → 直接用本机旧档案覆盖 T2。
   * 新实现在 PUT 前**现场 PROPFIND**，拿到的是 T2，于是阻止。
   * 本组用「有没有发出 PUT」作为直接证据（比断言提示文案强：没有 PUT 就等于云端没被覆盖）。 */
  {
    const bridge = mountBridge();
    const api = bridge.page.api;
    api.davConfigure({ account: 'someone@example.com', password: 'pw' });
    const envelope = JSON.parse(makeEnvelope(seedArchive()));

    const LOCAL = '2026-10-09T09:00:00.000Z';   /* 本机最近一次成功写档 */
    const CACHE = '2026-10-09T08:00:00.000Z';   /* 打开设置页时缓存到的云端时间（旧值） */
    const FRESH = '2026-10-09T10:00:00.000Z';   /* 另一台设备随后上传，云端现在的时间 */

    /* ① 缓存会放行（这就是根因），实时复查不放行 */
    assert.ok(Date.parse(CACHE) < Date.parse(LOCAL),
      check('G：缓存里的云端时间比本机旧 → 旧实现据此放行（根因前提成立）'));
    bridge.calls.length = 0;
    bridge.setHandler(davHandler({ cloudAt: FRESH }));
    const blocked = await api.davBackup(envelope, 'sig', { localSavedAt: LOCAL, allowOverwrite: false });
    assert.equal(blocked.ok, false, check('G：云端在本机缓存之后被更新 → 备份被阻止'));
    assert.equal(blocked.cloudNewer, true, check('G：阻止原因明确标记 cloudNewer'));
    assert.ok(!bridge.calls.some(call => call.method === 'PUT'),
      check('G（根因）：被阻止时没有发出任何 PUT —— 较新的云端档案未被覆盖'));
    assert.equal(bridge.calls.filter(call => call.method === 'PROPFIND').length, 1,
      check('G：阻止发生在 PUT 前的实时 PROPFIND 之后'));
    assert.match(blocked.error, /云端档案比本机新/, check('G：中文提示说明是云端更新'));
    assert.equal(api.readWebdavState().lastBackupResult, 'failed', check('G：阻止结果落盘（不静默）'));

    /* ② 用户显式授权覆盖 → 才 PUT（证明 ① 的阻止来自复查，不是代码路径坏了） */
    bridge.calls.length = 0;
    const forced = await api.davBackup(envelope, 'sig', { localSavedAt: LOCAL, allowOverwrite: true });
    assert.equal(forced.ok, true, check('G：用户在页面内确认覆盖后备份成功'));
    assert.ok(bridge.calls.some(call => call.method === 'PUT'), check('G：显式授权时 PUT 正常发出'));

    /* ③ 正向对照：云端更旧 → 正常 PUT（证明阻止不是恒真） */
    bridge.calls.length = 0;
    bridge.setHandler(davHandler({ cloudAt: '2026-10-09T08:30:00.000Z' }));
    const normal = await api.davBackup(envelope, 'sig', { localSavedAt: LOCAL, allowOverwrite: false });
    assert.equal(normal.ok, true, check('G：云端更旧时正常备份'));
    assert.ok(bridge.calls.some(call => call.method === 'PUT'), check('G：云端更旧时 PUT 发出'));

    /* ④ 云端没有文件（首次备份）→ 放行 */
    bridge.calls.length = 0;
    bridge.setHandler(davHandler({ cloudAt: null }));
    const first = await api.davBackup(envelope, 'sig', { localSavedAt: LOCAL, allowOverwrite: false });
    assert.equal(first.ok, true, check('G：云端还没有文件时首次备份放行'));

    /* ⑤ 读不到云端状态 → 停止，且不把「读不到」当「不存在」 */
    for (const [label, handler] of [
      ['429 限流', davHandler({ overrides: { PROPFIND: { status: 429 } } })],
      ['网络不可达', davHandler({ overrides: { PROPFIND: { __networkError: true } } })],
      ['请求超时', davHandler({ overrides: { PROPFIND: { __timeout: true } } })],
      ['其它非 2xx', davHandler({ overrides: { PROPFIND: { status: 500 } } })],
      ['文件在但时间戳读不出', davHandler({ overrides: { PROPFIND: { status: 207, responseText: '<d:multistatus xmlns:d="DAV:"><d:response/></d:multistatus>' } } })]
    ]) {
      bridge.calls.length = 0;
      bridge.setHandler(handler);
      const unknown = await api.davBackup(envelope, 'sig', { localSavedAt: LOCAL, allowOverwrite: false });
      assert.equal(unknown.ok, false, check(`G：${label} → 备份停止`));
      assert.equal(unknown.cloudUnknown, true, check(`G：${label} → 标记 cloudUnknown（读不到 ≠ 不存在）`));
      assert.ok(!bridge.calls.some(call => call.method === 'PUT'), check(`G（根因）：${label} 时没有 PUT`));
    }
    /* 限流时即使用户点了「确认覆盖」也不 PUT —— 不得为了继续备份而绕过检查 */
    bridge.calls.length = 0;
    bridge.setHandler(davHandler({ overrides: { PROPFIND: { status: 429 } } }));
    const forcedUnknown = await api.davBackup(envelope, 'sig', { localSavedAt: LOCAL, allowOverwrite: true });
    assert.equal(forcedUnknown.ok, false, check('G：限流时显式授权也不 PUT（不绕过检查）'));

    /* ⑥ 本机没有可用写档时间 → 无从比较，不覆盖 */
    bridge.calls.length = 0;
    bridge.setHandler(davHandler({ cloudAt: FRESH }));
    const noLocal = await api.davBackup(envelope, 'sig', { localSavedAt: null, allowOverwrite: false });
    assert.equal(noLocal.cloudUnknown, true, check('G：本机没有可用写档时间 → 判为无法确认、停止'));
    assert.ok(!bridge.calls.some(call => call.method === 'PUT'), check('G：本机时间不可用时没有 PUT'));
  }

  /* ===================== G2. evaluateCloudGuard 纯函数表 ===================== */
  {
    const api = mountBridge().page.api;
    const g = api.evaluateCloudGuard;
    const local = '2026-10-09T09:00:00.000Z';
    /* 沙箱对象与宿主 Object 原型不同，逐字段断言（不用 deepStrictEqual） */
    const noCloud = g(null, local, false);
    assert.equal(noCloud.allow, false, check('G2：无云端结果 → 不放行'));
    assert.equal(noCloud.reason, 'unknown', check('G2：无云端结果 → 归因 unknown'));
    assert.equal(noCloud.error, '云端状态未知', check('G2：无云端结果 → 给出中文原因'));
    assert.equal(g({ exists: false, error: '网络不可达' }, local, false).allow, false, check('G2：读不到 → 不放行'));
    assert.equal(g({ exists: false, error: '网络不可达' }, local, true).allow, false, check('G2：读不到时显式覆盖也不放行'));
    assert.equal(g({ exists: false, missing: true }, local, false).allow, true, check('G2：404 无文件 → 放行'));
    assert.equal(g({ exists: true, lastModified: '2026-10-09T10:00:00.000Z' }, local, false).reason, 'cloud-newer', check('G2：云端更新 → 阻止'));
    assert.equal(g({ exists: true, lastModified: '2026-10-09T08:00:00.000Z' }, local, false).allow, true, check('G2：云端更旧 → 放行'));
    assert.equal(g({ exists: true, lastModified: '2026-10-09T10:00:00.000Z' }, local, true).reason, 'overwrite-authorized', check('G2：显式授权 → 放行'));
    assert.equal(g({ exists: true, lastModified: null }, local, false).reason, 'unknown', check('G2：时间戳读不出 → 不放行'));
    assert.equal(g({ exists: true, lastModified: '2026-10-09T08:00:00.000Z' }, null, false).reason, 'unknown', check('G2：本机时间缺失 → 不放行'));
  }

  /* ===================== F. 纯函数 ===================== */
  {
    const bridge = mountBridge();
    const api = bridge.page.api;
    assert.equal(api.maskAccount('ab@example.com'), 'a***@example.com', check('F：掩码保留域名'));
    assert.equal(api.maskAccount('noat'), 'n***', check('F：非邮箱形态也能掩码'));
    assert.equal(api.maskAccount(''), '', check('F：空账号掩码为空'));
    assert.equal(api.base64('abc'), 'YWJj', check('F：base64 基本形态'));
    assert.equal(api.base64('a@b.c:pw'), Buffer.from('a@b.c:pw', 'utf8').toString('base64'), check('F：base64 与标准实现一致'));
    assert.equal(api.base64('中文:密码'), Buffer.from('中文:密码', 'utf8').toString('base64'), check('F：base64 对非 ASCII 安全'));
    assert.match(api.describeStatus(429, '备份'), /太频繁/, check('F：describeStatus 覆盖 429'));
    assert.match(api.describeStatus(0, '备份'), /网络不可达/, check('F：describeStatus 覆盖网络不可达'));
    assert.equal(api.davPaths().label, 'Odin学习站/odin-progress.json', check('F：远端路径 = 专用子目录单文件'));
  }

  console.log(`通过：userscript WebDAV 桥专项 ${checks} 项断言（桥协议四项校验与方法白名单 / 凭据只进 GM 而站点存储零凭据 / MKCOL·PROPFIND·PUT·GET 构造与单域白名单 / 401·403·404·429·网络不可达中文映射与失败落盘 / **写入前实时复查云端：缓存之后云端被更新则不发 PUT、显式授权才覆盖、云端更旧与无文件正常放行、429·网络·超时·非 2xx·时间戳读不出一律停止且不可被授权绕过** / 兼容旧信封与坏数据拒绝 / 掩码与 base64 纯函数）。真实坚果云连通性与跨设备互通不在 Node 范围，见 userscripts/README.md 与 TEST-REPORT「Ready for Human Verification」。`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
