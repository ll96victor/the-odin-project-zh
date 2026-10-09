/* 站内云同步纯逻辑专项（v4.11.44 云同步轮）。
 *
 * 被测对象：cloud-sync.js（站点侧云同步纯逻辑）+ app.js 的设置页「云同步（坚果云）」区块。
 * 方法：cloud-sync.js 在 vm 沙箱里直接驱动（协议用注入的假 deps + 假桥，零真实网络）；
 *   app.js 区块用 dom-stub 真实挂载整站后按真实交互打开设置 Tab 断言。
 *   A. 模块契约与源码边界：零网络 API、零浏览器存储 API（红线：网络只在脚本层、凭据不进站点存储）；
 *   B. 信封构建与合法性判定（含兼容旧 GM 面板信封）；
 *   C. 内容签名（判断「有没有变化」的主判据）；
 *   D. 云端/本机时间戳对比与自动备份决策全分支（含 30 分钟节流边界）；
 *   E. 状态机与中文状态文案；
 *   F. postMessage 协议：请求编号、回复校验（命名空间 / reply 标记 / origin / id）、超时降级；
 *   G. app.js 区块 UI 钉：三态渲染要素、账号与应用密码输入、旧「无云同步」文案清零、
 *      站点存储零凭据、云同步开关不进「六个界面开关」清单、progress 只读 API 可用。
 * 真实坚果云连通性不在 Node 范围（见 userscripts/README.md 的 Ready for Human Verification）。
 *
 * 运行：node tests/cloud-sync.test.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const { newPage, makeStorage, dispatch, querySelect, collectByClass, STORAGE_KEY, archiveJson, lessonEntryJson, FIRST_LESSON } = require('./dom-stub.cjs');

const root = path.resolve(__dirname, '..');
const cloudSrc = fs.readFileSync(path.join(root, 'cloud-sync.js'), 'utf8');
const appSrc = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

let checks = 0;
const check = label => { checks += 1; return label; };

/* ---------- cloud-sync.js 载入（沙箱里 window 就是全局） ---------- */
function loadCloud() {
  const sandbox = { window: {} };
  vm.runInNewContext(cloudSrc, sandbox);
  return sandbox.window.ODIN_CLOUD_SYNC;
}
const C = loadCloud();
const flush = () => new Promise(resolve => setImmediate(resolve));

/* ---------- 假桥客户端：注入 deps + 假 postMessage，零真实网络 ---------- */
function makeClientHarness(options = {}) {
  const listeners = [];
  const sent = [];
  const timers = [];
  let nowMs = options.nowMs || 1_000_000_000_000;
  const bridge = { handler: msg => ({ ok: true, installed: true, version: '1.1.1' }) };
  const client = C.createClient({
    origin: 'http://127.0.0.1:8765',
    addEventListener: (type, handler) => { if (type === 'message') listeners.push(handler); },
    removeEventListener: () => {},
    postMessage: message => {
      sent.push(message);
      if (options.drop) return;                     /* 模拟「没人回」 */
      const reply = bridge.handler(message);
      if (!reply) return;
      const data = Object.assign({ __odinCloudSync: true, reply: true, id: message.id }, reply);
      if (options.badOrigin) data.__badOrigin = true;
      listeners.forEach(handler => handler({ origin: options.badOrigin ? 'https://evil.example' : 'http://127.0.0.1:8765', data }));
    },
    now: () => nowMs,
    timeout: (handler, ms) => { const timer = { handler, ms, fired: false }; timers.push(timer); return timer; },
    clearTimeout: timer => { if (timer) timer.fired = true; },
    timeoutMs: 8000
  });
  return {
    client, sent, timers, listeners,
    setHandler(fn) { bridge.handler = fn; },
    setNow(value) { nowMs = value; },
    fireTimeout(index) { const timer = timers[index]; if (timer) { timer.fired = true; timer.handler(); } },
    liveTimers() { return timers.filter(t => !t.fired).length; }
  };
}

/* ===================== A. 模块契约与源码边界 ===================== */
{
  assert.equal(C.FORMAT, 'odin-webdav-sync', check('A：云同步信封 format = odin-webdav-sync'));
  assert.ok(C.COMPAT_FORMATS.includes('odin-gm-sync-check'), check('A：兼容清单含旧 GM 面板信封'));
  assert.equal(C.NAMESPACE, '__odinCloudSync', check('A：消息命名空间标记位固定'));
  assert.equal(C.MIN_BACKUP_INTERVAL_MS, 30 * 60 * 1000, check('A：自动备份节流 = 30 分钟'));
  assert.deepEqual([...C.BRIDGE_METHODS].sort(),
    ['backup', 'clear-config', 'configure', 'ping', 'restore', 'set-auto-backup', 'status', 'test'],
    check('A：桥方法白名单与脚本侧一致（8 项）'));
  assert.ok(C.SERVER_URL.includes('dav.jianguoyun.com'), check('A：服务器地址是坚果云 WebDAV 单域'));
  assert.equal(C.REMOTE_LABEL, 'Odin学习站/odin-progress.json', check('A：远端文件 = 专用子目录单文件'));
  assert.deepEqual([...C.STATES].sort(),
    ['backing-up', 'configured', 'error', 'no-bridge', 'unconfigured'],
    check('A：状态机五态齐全'));

  /* 源码边界：不联网、不碰浏览器存储（网络与凭据都在脚本层） */
  assert.ok(!/\bfetch\s*\(/.test(cloudSrc), check('A：cloud-sync.js 不含 fetch 调用'));
  assert.ok(!/XMLHttpRequest/.test(cloudSrc), check('A：cloud-sync.js 不含 XMLHttpRequest'));
  assert.ok(!/localStorage|sessionStorage/.test(cloudSrc), check('A：cloud-sync.js 不碰浏览器存储'));
  assert.ok(!/GM_[a-zA-Z]+/.test(cloudSrc), check('A：cloud-sync.js 不使用任何油猴 API（那是脚本层的事）'));
  assert.ok(!/innerHTML/.test(cloudSrc), check('A：cloud-sync.js 不使用 innerHTML'));
  /* app.js 仍禁用网络与存储 API（content/progress.test 同款源码扫描，这里对云同步改动再钉一次） */
  assert.ok(!/\bfetch\(|XMLHttpRequest|localStorage|innerHTML/.test(appSrc),
    check('A：app.js 仍禁止 fetch / XHR / 浏览器存储 / innerHTML（含新增云同步区块）'));
  assert.ok(appSrc.includes('ODIN_CLOUD_SYNC'), check('A：app.js 消费 cloud-sync 模块（缺失时降级）'));
}

/* ===================== B. 信封 ===================== */
{
  const raw = JSON.stringify({ app: 'the-odin-project-zh', schemaVersion: 4, xp: 10 });
  const env = C.buildEnvelope(raw, { savedAt: '2026-10-09T12:00:00.000Z', source: 'site-manual', app: 'the-odin-project-zh', productVersion: '4.11.44' });
  assert.equal(env.format, 'odin-webdav-sync', check('B：信封 format 正确'));
  assert.equal(env.envelopeVersion, 1, check('B：信封版本为 1'));
  assert.equal(env.savedAt, '2026-10-09T12:00:00.000Z', check('B：savedAt 采用传入值'));
  assert.equal(env.data, raw, check('B：data 是档案原文逐字节'));
  assert.equal(env.rawSchemaVersion, 4, check('B：rawSchemaVersion 从原文解析'));
  assert.equal(env.schemaVersion, null, check('B：未传 schemaVersion 时为 null（不猜）'));
  assert.equal(env.source, 'site-manual', check('B：source 记录来源'));
  const auto = C.buildEnvelope(raw, {});
  assert.ok(typeof auto.savedAt === 'string' && auto.savedAt.includes('T'), check('B：未传 savedAt 时自动补 ISO 时间戳'));

  assert.equal(C.validateEnvelope(null).ok, false, check('B：null 信封被拒'));
  assert.equal(C.validateEnvelope({ format: 'other', data: '{}' }).ok, false, check('B：格式不符被拒'));
  assert.equal(C.validateEnvelope({ format: 'odin-webdav-sync', data: '' }).ok, false, check('B：缺档案原文被拒'));
  const good = C.validateEnvelope({ format: 'odin-webdav-sync', data: raw, savedAt: '2026-10-09T12:00:00.000Z' });
  assert.equal(good.ok, true, check('B：合法信封通过'));
  assert.equal(good.legacy, false, check('B：新格式不标 legacy'));
  assert.equal(good.data, raw, check('B：校验结果回传档案原文'));
  const legacy = C.validateEnvelope({ format: 'odin-gm-sync-check', data: raw });
  assert.equal(legacy.ok, true, check('B：旧 GM 面板信封可通过（兼容读）'));
  assert.equal(legacy.legacy, true, check('B：旧格式标记 legacy'));
}

/* ===================== C. 内容签名 ===================== */
{
  const a = C.archiveSignature('{"xp":1}');
  const b = C.archiveSignature('{"xp":1}');
  const c = C.archiveSignature('{"xp":2}');
  assert.equal(a, b, check('C：同一内容签名相同'));
  assert.notEqual(a, c, check('C：不同内容签名不同'));
  assert.notEqual(C.archiveSignature('ab'), C.archiveSignature('ba'), check('C：顺序敏感（非简单长度哈希）'));
  assert.ok(typeof C.archiveSignature('') === 'string' && C.archiveSignature('').length > 0, check('C：空串也能算出签名'));
}

/* ===================== D. 时间戳与自动备份决策 ===================== */
{
  assert.equal(C.isCloudNewer('2026-10-09T12:00:00.000Z', '2026-10-09T11:00:00.000Z'), true, check('D：云端更新时 isCloudNewer=true'));
  assert.equal(C.isCloudNewer('2026-10-09T10:00:00.000Z', '2026-10-09T11:00:00.000Z'), false, check('D：云端更旧时为 false'));
  assert.equal(C.isCloudNewer(null, '2026-10-09T11:00:00.000Z'), false, check('D：缺云端时间判 false（不误拦）'));
  assert.equal(C.isCloudNewer('not-a-date', '2026-10-09T11:00:00.000Z'), false, check('D：非法时间判 false'));

  const base = {
    configured: true, autoBackup: true, raw: '{"xp":1}',
    signature: 'sig-a', lastBackedUpSignature: 'sig-b',
    localSavedAt: '2026-10-09T12:00:00.000Z', lastBackedUpSavedAt: null,
    lastBackupAt: null, cloudSavedAt: null, nowMs: Date.parse('2026-10-09T13:00:00.000Z')
  };
  const run = overrides => C.shouldAutoBackup(Object.assign({}, base, overrides));
  assert.equal(run({}).should, true, check('D：条件齐备时应该备份'));
  assert.equal(run({ configured: false }).reason, 'unconfigured', check('D：未配置不备份'));
  assert.equal(run({ autoBackup: false }).reason, 'disabled', check('D：开关关闭不备份'));
  assert.equal(run({ raw: '' }).reason, 'empty', check('D：无档案内容不备份'));
  assert.equal(run({ lastBackedUpSignature: 'sig-a' }).reason, 'unchanged', check('D：签名一致 = 内容没变，不备份'));
  assert.equal(run({ lastBackupAt: '2026-10-09T12:45:00.000Z' }).reason, 'throttled', check('D：距上次备份不足 30 分钟被节流'));
  assert.equal(run({ lastBackupAt: '2026-10-09T12:30:00.000Z' }).should, true, check('D：正好 30 分钟可备份（边界含等号）'));
  assert.equal(run({ lastBackupAt: '2026-10-09T12:30:01.000Z' }).reason, 'throttled', check('D：差 1 秒仍被节流'));
  assert.equal(run({ cloudSavedAt: '2026-10-09T12:30:00.000Z' }).reason, 'cloud-newer', check('D：云端更新时跳过自动备份（防旧设备覆盖新数据）'));
  assert.equal(run({ cloudSavedAt: '2026-10-09T11:00:00.000Z' }).should, true, check('D：云端更旧时正常备份'));
  /* 无签名（旧版脚本）时退回时间戳判据 */
  assert.equal(run({ signature: null, lastBackedUpSignature: null, lastBackedUpSavedAt: '2026-10-09T12:00:00.000Z' }).reason, 'unchanged',
    check('D：无签名时用时间戳兜底判「没变化」'));
  assert.equal(run({ signature: null, lastBackedUpSignature: null, localSavedAt: null }).reason, 'unchanged',
    check('D：无签名且本机没写过档 → 不备份'));

  assert.match(C.manualBackupWarning('2026-10-09T12:30:00.000Z', '2026-10-09T11:00:00.000Z'), /云端档案比本机新/,
    check('D：手动备份前的云端更新警告'));
  assert.equal(C.manualBackupWarning('2026-10-09T10:00:00.000Z', '2026-10-09T11:00:00.000Z'), '',
    check('D：云端不新时不产生警告'));
}

/* ===================== E. 状态机与文案 ===================== */
{
  assert.equal(C.bridgeStateOf(null, false), 'no-bridge', check('E：无状态 = 未安装'));
  assert.equal(C.bridgeStateOf({ installed: true, configured: false }, false), 'unconfigured', check('E：装了没配'));
  assert.equal(C.bridgeStateOf({ installed: true, configured: true }, false), 'configured', check('E：已配置'));
  assert.equal(C.bridgeStateOf({ installed: true, configured: true }, true), 'backing-up', check('E：busy 优先'));
  assert.equal(C.bridgeStateOf({ installed: true, configured: true, lastBackupResult: 'failed' }, false), 'error', check('E：上次失败 = error'));
  assert.equal(C.stateLabel('no-bridge'), '未安装伴随脚本', check('E：状态中文标签'));
  assert.equal(C.formatTimestamp('2026-10-09T12:34:56.000Z'), '2026-10-09 12:34', check('E：时间戳格式化'));
  assert.equal(C.formatTimestamp(null), '未知', check('E：缺时间戳显示未知'));
  assert.match(C.describeStatus(null, false), /未检测到伴随脚本/, check('E：未安装时状态行给安装指引'));
  assert.match(C.describeStatus({ installed: true, configured: false }, false), /尚未配置|填好/, check('E：未配置时状态行提示填账号'));
  const errText = C.describeStatus({ installed: true, configured: true, lastBackupResult: 'failed', lastError: '账号或应用密码不正确（401）。', lastBackupAt: '2026-10-09T12:00:00.000Z' }, false);
  assert.match(errText, /401/, check('E：失败态状态行带出失败原因（失败不静默）'));
}

/* ===================== F. postMessage 协议 ===================== */
(async () => {
  {
    const h = makeClientHarness();
    const bad = await h.client.request('open-proxy', {});
    assert.equal(bad.ok, false, check('F：非白名单方法直接拒绝，不发消息'));
    assert.equal(h.sent.length, 0, check('F：非白名单方法零消息发出'));

    const ping = await h.client.probe();
    assert.equal(ping.installed, true, check('F：ping 得到回复 → installed'));
    assert.equal(ping.version, '1.1.1', check('F：ping 回传脚本版本'));
    assert.equal(h.sent.length, 1, check('F：每次请求只发一条消息'));
    assert.equal(h.sent[0].__odinCloudSync, true, check('F：消息带命名空间标记'));
    assert.equal(h.sent[0].method, 'ping', check('F：消息带方法名'));
    assert.ok(typeof h.sent[0].id === 'string' && h.sent[0].id, check('F：消息带请求 id'));
    assert.equal(h.liveTimers(), 0, check('F：收到回复后清掉超时定时器'));

    /* 每个方法都走白名单并带上 payload */
    h.setHandler(msg => ({ ok: true, method: msg.method }));
    for (const method of ['status', 'clear-config', 'test', 'restore']) {
      const reply = await h.client.request(method, {});
      assert.equal(reply.ok, true, check(`F：${method} 可发可收`));
    }
    const backupReply = await h.client.backup({ format: 'odin-webdav-sync', data: '{}' }, 'sig-1');
    assert.equal(backupReply.ok, true, check('F：backup 可发可收'));
    const lastSent = h.sent[h.sent.length - 1];
    assert.equal(lastSent.payload.signature, 'sig-1', check('F：backup 带上内容签名（脚本只存不算）'));
    const configureReply = await h.client.configure({ account: 'a@b.c', password: 'x' });
    assert.equal(configureReply.ok, true, check('F：configure 可发可收'));
    assert.equal(h.sent[h.sent.length - 1].payload.account, 'a@b.c', check('F：配置经消息通道交给脚本（站点不落盘）'));
  }

  /* 无人应答 → 超时降级（不抛错、给中文原因） */
  {
    const h = makeClientHarness({ drop: true });
    const promise = h.client.probe();
    assert.equal(h.liveTimers(), 1, check('F：未收到回复时挂起一个超时定时器'));
    h.fireTimeout(0);
    const result = await promise;
    assert.equal(result.installed, false, check('F：超时判为未安装'));
    assert.equal(result.timeout, true, check('F：超时结果带 timeout 标记'));
    assert.match(result.error, /没有响应/, check('F：超时给出中文原因'));
  }

  /* origin 不符的回复必须被忽略 → 请求继续等到超时 */
  {
    const h = makeClientHarness({ badOrigin: true });
    const promise = h.client.probe();
    h.fireTimeout(0);
    const result = await promise;
    assert.equal(result.installed, false, check('F：origin 不符的回复被丢弃（不得采信）'));
  }

  /* 缺 reply 标记 / 命名空间不符的消息不得被当作回复 */
  {
    const listeners = [];
    const sent = [];
    let resolveTimer = null;
    const client = C.createClient({
      origin: 'http://127.0.0.1:8765',
      addEventListener: (type, handler) => { if (type === 'message') listeners.push(handler); },
      removeEventListener: () => {},
      postMessage: message => { sent.push(message); },
      now: () => 1,
      timeout: handler => { resolveTimer = handler; return 1; },
      clearTimeout: () => {},
      timeoutMs: 8000
    });
    const promise = client.probe();
    listeners.forEach(handler => handler({ origin: 'http://127.0.0.1:8765', data: { __odinCloudSync: true, id: sent[0].id, ok: true } }));
    listeners.forEach(handler => handler({ origin: 'http://127.0.0.1:8765', data: { other: true, reply: true, id: sent[0].id, ok: true } }));
    let settled = false;
    promise.then(() => { settled = true; });
    await Promise.resolve();
    await Promise.resolve();
    assert.equal(settled, false, check('F：缺 reply 标记 / 命名空间不符的消息不被采信（仍在等）'));
    resolveTimer();
    const result = await promise;
    assert.equal(result.installed, false, check('F：只有合法回复才能结束等待，这里以超时收场'));
  }

  /* 没有 postMessage 的环境 → 明确降级，不发请求 */
  {
    const client = C.createClient({
      origin: '', postMessage: null, addEventListener: () => {}, removeEventListener: () => {},
      now: () => 0, timeout: () => 0, clearTimeout: () => {}, timeoutMs: 8000
    });
    const result = await client.probe();
    assert.equal(result.installed, false, check('F：无消息通道时判为未安装'));
    assert.equal(result.unavailable, true, check('F：无消息通道时标记 unavailable（明确降级）'));
    const status = await client.status({});
    assert.equal(status.unavailable, true, check('F：无消息通道时状态查询同样降级'));
  }

  /* ===================== G. app.js 区块 UI 钉 ===================== */
  {
    const storage = makeStorage();
    const page = newPage({ storage });
    /* progress 只读 API：站内启动就会写一次档（计时/结算链路），因此挂载后它已是 ISO
     * 时间戳——这正是云同步不能用时间戳判「有没有变化」的原因（页面加载会推进时间戳），
     * 主判据是内容签名，时间戳只作兜底与展示。 */
    const bootSavedAt = page.progress.getLastSavedAt();
    assert.ok(typeof bootSavedAt === 'string' && bootSavedAt.includes('T'),
      check('G：站点启动即写档，getLastSavedAt 是 ISO 时间戳（故变化判定以内容签名为准）'));
    page.progress.markVisited(FIRST_LESSON);
    const savedAt = page.progress.getLastSavedAt();
    assert.ok(typeof savedAt === 'string' && savedAt.includes('T'), check('G：写档后 getLastSavedAt 仍是 ISO 时间戳'));
    assert.equal(typeof page.progress.getLastSavedAt, 'function', check('G：getLastSavedAt 是公开只读 API'));
    /* 只读暴露：它不进档案（无新 schema 字段）、也不改存储 key */
    const liveState = page.progress.getState();
    assert.equal('lastSavedAt' in liveState, false, check('G：getLastSavedAt 不进档案（无新 schema 字段）'));
    assert.equal(liveState.schemaVersion, 4, check('G：schemaVersion 仍是 4（云同步不升 schema）'));
    assert.ok(!STORAGE_KEY.includes('undefined'), check('G：存储 key 未被云同步改动'));

    /* 打开个人中心 → 设置 Tab：云同步区块三态渲染要素齐备 */
    dispatch(querySelect(page.dom.body, '.player-entry'), 'click', {});
    const dialog = collectByClass(page.dom.body, 'profile-dialog').find(d => d.open === true);
    dispatch(querySelect(dialog, '#profile-tab-settings'), 'click', {});
    const panelEl = querySelect(collectByClass(page.dom.body, 'profile-dialog').find(d => d.open === true), '.profile-tabpanel');
    const text = panelEl.textContent;
    assert.ok(text.includes('云同步（坚果云）'), check('G：设置 Tab 有「云同步（坚果云）」区块'));
    assert.ok(text.includes('dav.jianguoyun.com'), check('G：区块展示固定的坚果云服务器地址'));
    assert.ok(text.includes('Odin学习站/odin-progress.json'), check('G：区块展示云端文件路径'));
    assert.ok(!text.includes('无云同步'), check('G：旧「无云同步」文案已清零'));
    assert.ok(!text.includes('本站没有账号'), check('G：旧「本站没有账号」文案已清零'));
    assert.ok(text.includes('第三方应用管理'), check('G：区块引导到坚果云「第三方应用管理」生成应用密码'));
    assert.ok(text.includes('本站不保存你的账号'), check('G：区块明示站点不保存账号'));

    const inputs = collectByClass(panelEl, 'cloud-sync-input');
    assert.equal(inputs.length, 2, check('G：区块恰有账号与应用密码两个输入框'));
    assert.equal(inputs[0].type, 'email', check('G：账号输入框类型 email'));
    assert.equal(inputs[1].type, 'password', check('G：密码输入框类型 password（不回显）'));
    assert.ok(String(inputs[1].placeholder).includes('第三方应用密码'), check('G：密码框提示使用第三方应用密码'));
    const buttons = collectByClass(panelEl, 'cloud-sync-actions')
      .flatMap(row => collectByClass(row, 'button-secondary').concat(collectByClass(row, 'button-danger')));
    const labels = buttons.map(b => b.textContent);
    for (const need of ['保存配置', '清除配置', '检测脚本', '测试连接', '立即备份到云端']) {
      assert.ok(labels.includes(need), check(`G：区块有「${need}」按钮`));
    }
    assert.ok(labels.some(l => l.startsWith('从云端恢复')), check('G：区块有「从云端恢复」按钮'));
    assert.ok(querySelect(panelEl, '.cloud-sync-status'), check('G：区块有 role=status 状态行'));
    assert.ok(querySelect(panelEl, '.cloud-sync-toggle'), check('G：区块有自动备份开关'));
    /* 云同步开关不得混进「六个界面开关」清单（profile-ia.test 逐项钉死那六个） */
    assert.equal(collectByClass(panelEl, 'setting-toggle').length, 6, check('G：界面开关仍是六个（云同步开关用独立类名）'));

    /* 站点存储里不得出现云同步凭据字段（凭据只在脚本存储里） */
    const stored = String(storage.getItem(STORAGE_KEY) || '');
    assert.ok(!/cloudAppPassword|cloudAccount|odinWebdavConfig/.test(stored), check('G：站点存储不含云同步凭据字段'));
    assert.ok(!/password/i.test(stored), check('G：站点存储不含 password 字段'));

    /* 防回归（v4.11.44 真实浏览器验证抓出的缺陷）：恢复前的「云端 vs 本机」对比，
     * 云端那一列必须由**云端档案**现算，不得把本机摘要当云端摘要展示。
     * 这是真实浏览器端到端跑出来的：初版把 progress.summary()（本机数字）塞进对比，
     * 界面上看起来像云端数据，与实际云端档案完全不符。 */
    assert.ok(appSrc.includes('cloudSummaryOf'), check('G：恢复对比用云端档案现算摘要（cloudSummaryOf）'));
    assert.ok(appSrc.includes('cloudCompareText'), check('G：恢复对比按「云端 X / 本机 Y」逐项并列'));
    assert.ok(!/summary:\s*progress\.summary\(\)/.test(appSrc),
      check('G（防回归）：恢复对比不得拿本机摘要冒充云端摘要'));
  }

  /* ===================== H. 手动备份决策（实时复查云端之后的纯函数，v4.11.45 FIX-1） ===================== */
  {
    const status = overrides => Object.assign({
      ok: true, installed: true, configured: true,
      cloudChecked: true, cloudExists: true,
      cloudSavedAt: '2026-10-09T08:00:00.000Z', cloudError: null
    }, overrides);
    const local = '2026-10-09T09:00:00.000Z';
    assert.equal(C.manualBackupDecision(status({}), local).action, 'backup', check('H：云端更旧 → 直接备份'));
    assert.equal(C.manualBackupDecision(status({ cloudSavedAt: '2026-10-09T10:00:00.000Z' }), local).action, 'confirm',
      check('H：云端更新 → 页面内二次确认'));
    assert.match(C.manualBackupDecision(status({ cloudSavedAt: '2026-10-09T10:00:00.000Z' }), local).message, /云端档案比本机新/,
      check('H：确认文案说明是云端更新'));
    assert.equal(C.manualBackupDecision(status({ cloudChecked: false, cloudError: '读取云端状态失败：坚果云提示请求太频繁（429）。' }), local).action, 'stop',
      check('H：读不到云端状态（429）→ 停止'));
    assert.match(C.manualBackupDecision(status({ cloudChecked: false, cloudError: '读取云端状态失败：网络不可达。' }), local).message, /无法确认云端最新状态/,
      check('H：停止文案说明无法确认云端状态'));
    assert.equal(C.manualBackupDecision(null, local).action, 'stop', check('H：没有状态快照 → 停止'));
    assert.equal(C.manualBackupDecision({ installed: false }, local).action, 'stop', check('H：未装伴随脚本 → 停止'));
    assert.equal(C.manualBackupDecision({ installed: true, configured: false }, local).action, 'stop', check('H：未配置账号 → 停止'));
    assert.equal(C.manualBackupDecision(status({ cloudExists: false, cloudSavedAt: null }), local).action, 'backup',
      check('H：云端还没有文件 → 直接备份（不误拦首次备份）'));
  }

  /* ===================== I. app.js 备份路径的云端复查行为（v4.11.45 FIX-1） =====================
   * dom-stub 真实挂载整站，并在打开设置 Tab **之前**给页面注入一条假伴随脚本通道
   * （postMessage 同步回包）——这样才能真实驱动按钮与页面内确认，而不是只测纯函数。
   * 关键证据一律用「有没有发出 backup 请求 / 请求里带什么」，不看提示文案。 */
  {
    const nowMs = Date.now();
    const OLD = new Date(nowMs - 3600 * 1000).toISOString();    /* 云端更旧 */
    const FRESH = new Date(nowMs + 3600 * 1000).toISOString();  /* 云端更新（另一台设备刚备份过） */
    const cloudStatusReply = overrides => Object.assign({
      ok: true, installed: true, configured: true, autoBackup: true, version: '1.1.1',
      cloudChecked: true, cloudExists: true, cloudSavedAt: OLD, cloudError: null,
      lastBackupAt: null, lastBackedUpSignature: null, lastBackedUpSavedAt: null, lastError: null
    }, overrides);
    function mountWithBridge(statusReply) {
      const storage = makeStorage();
      const page = newPage({ storage });
      const sent = [];
      page.sandbox.postMessage = message => {
        sent.push(message);
        const reply = message.method === 'status' ? statusReply : { ok: true, savedAt: '2026-10-09T13:00:00.000Z', bytes: 321 };
        page.fireWindow('message', {
          origin: 'http://127.0.0.1:8765',
          data: Object.assign({ __odinCloudSync: true, reply: true, id: message.id }, reply)
        });
      };
      dispatch(querySelect(page.dom.body, '.player-entry'), 'click', {});
      const dialog = collectByClass(page.dom.body, 'profile-dialog').find(d => d.open === true);
      dispatch(querySelect(dialog, '#profile-tab-settings'), 'click', {});
      return { page, sent };
    }
    const panelOf = page => querySelect(collectByClass(page.dom.body, 'profile-dialog').find(d => d.open === true), '.profile-tabpanel');
    const buttonOf = (panel, label) => collectByClass(panel, 'button-secondary')
      .concat(collectByClass(panel, 'button-danger')).find(b => b.textContent === label);
    const backupsOf = sent => sent.filter(m => m.method === 'backup');

    /* I1 云端更新 → 页面内二次确认；点「取消」不发 PUT */
    {
      const { page, sent } = mountWithBridge(cloudStatusReply({ cloudSavedAt: FRESH }));
      await flush();
      buttonOf(panelOf(page), '立即备份到云端').click();
      await flush();
      assert.equal(backupsOf(sent).length, 0, check('I：云端比本机新 → 点「立即备份」不发 backup（先二次确认）'));
      const confirm = querySelect(panelOf(page), '.cloud-sync-confirm');
      assert.ok(confirm, check('I：出现页面内二次确认面板（不再用会卡死自动化通道的原生 confirm）'));
      assert.ok(confirm.textContent.includes('确认覆盖云端'), check('I：确认面板有「确认覆盖云端」按钮'));
      assert.ok(confirm.textContent.includes('云端档案比本机新'), check('I：确认面板说明云端更新'));
      buttonOf(confirm, '取消').click();
      await flush();
      assert.equal(backupsOf(sent).length, 0,
        check('I（根因）：点「取消」后依然没有 backup —— 较新的云端档案未被覆盖'));
      assert.equal(querySelect(panelOf(page), '.cloud-sync-confirm'), null, check('I：取消后确认面板消失'));
      assert.match(panelOf(page).textContent, /已取消/, check('I：取消后状态行如实说明没有改动'));
    }

    /* I2 云端更新 → 确认覆盖 → 才发 PUT，且带 allowOverwrite=true 与本机写档时间 */
    {
      const { page, sent } = mountWithBridge(cloudStatusReply({ cloudSavedAt: FRESH }));
      await flush();
      buttonOf(panelOf(page), '立即备份到云端').click();
      await flush();
      buttonOf(querySelect(panelOf(page), '.cloud-sync-confirm'), '确认覆盖云端').click();
      await flush();
      const backups = backupsOf(sent);
      assert.equal(backups.length, 1, check('I：确认覆盖后恰好发出一条 backup 请求'));
      assert.equal(backups[0].payload.allowOverwrite, true, check('I：确认覆盖时带 allowOverwrite=true'));
      assert.ok(typeof backups[0].payload.localSavedAt === 'string' && backups[0].payload.localSavedAt.includes('T'),
        check('I：backup 请求带本机最近写档时间（供脚本侧 PUT 前复查）'));
    }

    /* I3 云端更旧 → 不弹确认，直接备份；allowOverwrite 仍为 false（脚本侧还会再复查一次） */
    {
      const { page, sent } = mountWithBridge(cloudStatusReply({ cloudSavedAt: OLD }));
      await flush();
      buttonOf(panelOf(page), '立即备份到云端').click();
      await flush();
      const backups = backupsOf(sent);
      assert.equal(backups.length, 1, check('I：云端更旧时点备份直接发出 backup'));
      assert.equal(backups[0].payload.allowOverwrite, false, check('I：未确认覆盖时 allowOverwrite 为 false'));
      assert.equal(querySelect(panelOf(page), '.cloud-sync-confirm'), null, check('I：云端更旧时不弹二次确认'));
    }

    /* I4 读不到云端状态 → 停止，不发 backup */
    {
      const { page, sent } = mountWithBridge(cloudStatusReply({ cloudChecked: false, cloudError: '读取云端状态失败：坚果云提示请求太频繁（429）。' }));
      await flush();
      buttonOf(panelOf(page), '立即备份到云端').click();
      await flush();
      assert.equal(backupsOf(sent).length, 0, check('I：读不到云端状态 → 不发 backup（不把读不到当不存在）'));
      assert.match(panelOf(page).textContent, /无法确认云端最新状态/, check('I：状态行如实说明无法确认云端状态'));
    }

    /* I5 自动备份：同一次离开只发一次（visibilitychange + pagehide 进行中保护） */
    {
      const { page, sent } = mountWithBridge(cloudStatusReply({ cloudSavedAt: OLD }));
      await flush();
      page.dom.visibilityState = 'hidden';
      (page.dom.listeners.visibilitychange || []).forEach(handler => handler({ type: 'visibilitychange' }));
      page.fireWindow('pagehide', {});
      await flush();
      const backups = backupsOf(sent);
      assert.equal(backups.length, 1, check('I：同一次离开（visibilitychange + pagehide）只发出一次 backup'));
      assert.equal(backups[0].payload.allowOverwrite, false, check('I：自动备份永不携带覆盖授权'));
    }

    /* I6 自动备份：站点缓存已知云端更新 → 提前跳过（不发 backup） */
    {
      const { page, sent } = mountWithBridge(cloudStatusReply({ cloudSavedAt: FRESH }));
      await flush();
      page.fireWindow('pagehide', {});
      await flush();
      assert.equal(backupsOf(sent).length, 0, check('I：自动备份发现云端更新 → 不发 backup'));
      assert.match(panelOf(page).textContent, /云端档案比本机新/, check('I：自动跳过时状态行说明原因'));
    }

    /* I7 根因（UI 级）：打开设置页那一刻云端更旧（这份值会进内存缓存），点「立即备份」之前
     * 云端已被另一台设备更新。旧实现只信打开设置页时的缓存 → 会直接 PUT 覆盖新档案；
     * 新实现在点击时**实时复查** → 不发 PUT，改走页面内二次确认。
     * 假桥在这里按调用次数变脸：第 1 次 status 回旧值（缓存），第 2 次起回新值（实时复查）。 */
    {
      let statusCalls = 0;
      const storage = makeStorage();
      const page = newPage({ storage });
      const sent = [];
      page.sandbox.postMessage = message => {
        sent.push(message);
        let reply;
        if (message.method === 'status') {
          statusCalls += 1;
          reply = cloudStatusReply({ cloudSavedAt: statusCalls === 1 ? OLD : FRESH });
        } else {
          reply = { ok: true, savedAt: '2026-10-09T13:00:00.000Z', bytes: 321 };
        }
        page.fireWindow('message', {
          origin: 'http://127.0.0.1:8765',
          data: Object.assign({ __odinCloudSync: true, reply: true, id: message.id }, reply)
        });
      };
      dispatch(querySelect(page.dom.body, '.player-entry'), 'click', {});
      const dialog = collectByClass(page.dom.body, 'profile-dialog').find(d => d.open === true);
      dispatch(querySelect(dialog, '#profile-tab-settings'), 'click', {});
      await flush();
      assert.equal(statusCalls, 1, check('I（根因）：打开设置页时缓存过一次云端时间（旧实现只信这一份）'));
      buttonOf(panelOf(page), '立即备份到云端').click();
      await flush();
      assert.ok(statusCalls >= 2, check('I（根因）：点备份时会重新问一次云端状态（不靠缓存）'));
      assert.equal(backupsOf(sent).length, 0,
        check('I（根因）：缓存之后云端被更新 → 点备份不发 PUT —— 较新的云端档案未被覆盖'));
      assert.ok(querySelect(panelOf(page), '.cloud-sync-confirm'), check('I（根因）：改为弹出页面内确认，而不是直接覆盖'));
    }
  }

  console.log(`通过：站内云同步纯逻辑专项 ${checks} 项断言（模块契约与零网络/零存储边界 / 信封构建与合法性含旧格式兼容 / 内容签名 / 时间戳对比与 30 分钟节流全分支 / 状态机与中文文案 / postMessage 协议四项校验与超时降级 / **手动备份决策与备份路径的云端实时复查：云端更新→页面内确认、取消不发 PUT、确认才带 allowOverwrite、读不到云端即停、自动备份一次离开只发一次** / app.js 设置区块 UI 钉与凭据零落盘）。真实坚果云连通性与跨设备互通不在 Node 范围，见 TEST-REPORT 与 userscripts/README.md 的 Ready for Human Verification。`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
