/* cloud-sync.js — 云同步（坚果云 WebDAV）的**站内纯逻辑**（v4.11.44 新增，v4.11.45 FIX）。
 *
 * 职责边界（刻意保持最薄）：
 *   - 站内 UI（app.js 设置区块）↔ 用户自愿安装的伴随脚本（userscripts/odin-cloud-sync.user.js）
 *     之间的 postMessage 协议：请求编号、超时、回复校验；
 *   - 档案信封构建（format 新值 odin-webdav-sync，data 是站点档案原文逐字节）；
 *   - 三类判定：①「该不该自动备份」（节流 + 有变化 + 云端是否更新）；② 信封合法性；
 *     ③「手动备份在**实时复查云端之后**怎么走」（直接备份 / 页面内二次确认 / 停止）。
 *   - 状态机与中文状态文案（供设置页状态行直接渲染）。
 *
 * v4.11.45（FIX-1）的关键纪律：**真正写入前的云端复查是脚本侧的最后一道闸**
 * （`evaluateCloudGuard`，紧邻 PUT）。本文件里的判定只用于 UI 决策，不承担安全责任——
 * 站点侧缓存可能已被另一台设备的新档案作废，任何「只信缓存就 PUT」的路径都不允许存在。
 *
 * **不做什么**（红线，测试源码扫描钉住）：
 *   - 本文件不发任何网络请求（没有网络 API 调用），网络请求只在脚本层；
 *   - 本文件不读不写任何浏览器存储（凭据与节流状态都由脚本写进油猴存储）；
 *   - 本文件不碰 DOM、不渲染 UI（纯逻辑，可在 Node 里直接驱动）。
 *
 * 校验口径：信封里的档案原文交给 progress.js 的既有严格口径（previewImport）判定，
 * 本模块只判「这是不是一个本站信封」，绝不自己解析学习数据。
 *
 * 载入顺序：两页都在 progress.js 之后、app.js 之前加载（同 version-identity 三方同步钉）。 */
(() => {
  'use strict';

  /* 云同步信封格式标识（脚本侧同值）。恢复侧兼容读旧的 GM 面板信封。 */
  const FORMAT = 'odin-webdav-sync';
  const COMPAT_FORMATS = [FORMAT, 'odin-gm-sync-check'];
  const ENVELOPE_VERSION = 1;
  /* postMessage 的命名空间标记位：两侧都只认带这个标记的消息 */
  const NAMESPACE = '__odinCloudSync';
  /* 自动备份节流：距上次成功备份不足这个间隔就不再自动发（手动备份不受限） */
  const MIN_BACKUP_INTERVAL_MS = 30 * 60 * 1000;
  /* 桥请求超时：超过即认为「脚本没装 / 被禁用 / 卡住」，给出明确中文原因而不是一直等 */
  const BRIDGE_TIMEOUT_MS = 8000;
  /* 桥只接受这些固定方法（白名单，拒绝任何转发请求） */
  const BRIDGE_METHODS = ['ping', 'status', 'configure', 'clear-config', 'set-auto-backup', 'test', 'backup', 'restore'];
  /* 展示用常量（服务器地址只读展示，不可改——脚本侧 @connect 只白名单这一个域） */
  const SERVER_URL = 'https://dav.jianguoyun.com/dav/';
  const REMOTE_LABEL = 'Odin学习站/odin-progress.json';

  /* 状态机取值与中文标签（设置页状态行、安装引导都从这里取，不各写一份） */
  const STATE_LABELS = {
    'no-bridge': '未安装伴随脚本',
    unconfigured: '已安装脚本，尚未配置坚果云账号',
    configured: '已配置，云同步可用',
    'backing-up': '正在备份…',
    error: '上次备份失败'
  };

  const tsOf = value => {
    if (!value) return null;
    const ms = Date.parse(value);
    return Number.isNaN(ms) ? null : ms;
  };

  /* ---------- 信封 ---------- */
  /* 构建上传信封：data 是站点档案原文（逐字节），供另一台设备原样交回站点校验。 */
  function buildEnvelope(rawText, meta) {
    const m = meta || {};
    let rawSchemaVersion = null;
    try { rawSchemaVersion = Number(JSON.parse(rawText).schemaVersion) || null; } catch (error) { rawSchemaVersion = null; }
    return {
      format: FORMAT,
      envelopeVersion: ENVELOPE_VERSION,
      savedAt: typeof m.savedAt === 'string' && m.savedAt ? m.savedAt : new Date().toISOString(),
      source: m.source || 'site',
      app: m.app || null,
      productVersion: m.productVersion || null,
      schemaVersion: Number(m.schemaVersion) || null,
      rawSchemaVersion,
      data: rawText
    };
  }

  /* 信封合法性：只判「是不是本站信封 + 有没有档案原文」。
   * 档案内容本身合法与否由站点严格口径（previewImport）判定，本模块不越界。 */
  function validateEnvelope(envelope) {
    if (!envelope || typeof envelope !== 'object') return { ok: false, error: '云端内容不是一个信封对象。' };
    if (COMPAT_FORMATS.indexOf(envelope.format) === -1) {
      return { ok: false, error: '云端文件的格式标识不是本站档案信封，已拒绝恢复。' };
    }
    if (typeof envelope.data !== 'string' || !envelope.data) {
      return { ok: false, error: '云端信封里没有档案原文，已拒绝恢复。' };
    }
    return { ok: true, data: envelope.data, savedAt: envelope.savedAt || null, legacy: envelope.format !== FORMAT };
  }

  /* ---------- 时间戳对比与自动备份判定 ---------- */
  /* 云端是否比本机更新：任一时间为空 → 判 false（宁可不拦，也不误拦手动流程）。 */
  function isCloudNewer(cloudSavedAt, localSavedAt) {
    const cloud = tsOf(cloudSavedAt);
    const local = tsOf(localSavedAt);
    if (!cloud || !local) return false;
    return cloud > local;
  }

  /* 档案内容签名（djb2 变体 + 长度前缀，非加密用途）。
   * 用途：判断「本机档案相对上次成功备份有没有变化」——比时间戳可靠，因为
   * 页面加载时的正常存盘会推进时间戳但内容没变，只看时间戳会白备一次；
   * 而「改了又改回原样」时间戳会变、内容其实没变。签名只在站内计算，
   * 对外只是一个不透明字符串（脚本侧只存不算）。 */
  function archiveSignature(text) {
    const raw = String(text || '');
    let hash = 5381;
    for (let i = 0; i < raw.length; i += 1) {
      hash = ((hash * 33) ^ raw.charCodeAt(i)) >>> 0;
    }
    return `${raw.length.toString(36)}-${hash.toString(36)}`;
  }

  /* 自动备份判定（纯函数，测试直接驱动）。
   * 输入：configured / autoBackup / raw（档案原文，空则视为无内容）/
   *      signature 与 lastBackedUpSignature（内容签名，主判据）/
   *      localSavedAt（本机最近一次成功写档时间）与 lastBackedUpSavedAt（时间戳兜底判据）/
   *      lastBackupAt（上次备份动作时间）/ cloudSavedAt（云端档案时间）/ nowMs。 */
  function shouldAutoBackup(input) {
    const data = input || {};
    if (!data.configured) return { should: false, reason: 'unconfigured' };
    if (!data.autoBackup) return { should: false, reason: 'disabled' };
    if (!data.raw) return { should: false, reason: 'empty' };
    /* 主判据：内容签名一致 = 没有变化（页面加载存盘、改回原样都不会误触发） */
    if (data.signature && data.lastBackedUpSignature && data.signature === data.lastBackedUpSignature) {
      return { should: false, reason: 'unchanged' };
    }
    /* 兜底判据：没有签名（旧版本脚本）时退回时间戳比较 */
    if (!data.signature || !data.lastBackedUpSignature) {
      const local = tsOf(data.localSavedAt);
      if (!local) return { should: false, reason: 'unchanged' };
      const backed = tsOf(data.lastBackedUpSavedAt);
      if (backed && local <= backed) return { should: false, reason: 'unchanged' };
    }
    const last = tsOf(data.lastBackupAt);
    const now = Number(data.nowMs) || 0;
    if (last && now && (now - last) < MIN_BACKUP_INTERVAL_MS) return { should: false, reason: 'throttled' };
    if (isCloudNewer(data.cloudSavedAt, data.localSavedAt)) return { should: false, reason: 'cloud-newer' };
    return { should: true, reason: 'ok' };
  }

  /* 手动备份前的云端更新警告：云端更新时不算失败，但要二次确认后才覆盖。 */
  function manualBackupWarning(cloudSavedAt, localSavedAt) {
    return isCloudNewer(cloudSavedAt, localSavedAt)
      ? '云端档案比本机新（另一台设备可能刚备份过）。继续会覆盖云端 —— 确认后再备份。'
      : '';
  }

  /* 手动备份在**实时复查云端之后**的决策（纯函数，v4.11.45 FIX-1）。
   * 入参 status 必须是刚从脚本取回的新鲜快照（`checkCloud:true`），**绝不接受设置面板
   * 打开时的缓存值**——缓存可能已被另一台设备的新档案作废。
   * 返回 action：
   *   'backup'  → 云端不比本机新，直接备份；
   *   'confirm' → 云端更新，走页面内二次确认，取消则不 PUT、接受才 PUT；
   *   'stop'    → 读不到云端状态（未装脚本 / 未配置 / 网络失败 / 429 / 时间戳读不出），
   *               停止并如实提示——**不把「读不到」当「云端不存在」**。 */
  function manualBackupDecision(status, localSavedAt) {
    if (!status || !status.installed) {
      return { action: 'stop', message: '检测不到已配置的伴随脚本，备份已停止（本机与云端都没有改动）。' };
    }
    if (!status.configured) {
      return { action: 'stop', message: '还没有配置坚果云账号与应用密码，备份已停止。' };
    }
    if (status.cloudChecked !== true) {
      const reason = status.cloudError ? `（${status.cloudError}）` : '';
      return { action: 'stop', message: `无法确认云端最新状态${reason}，已停止备份；不会在状态未知时覆盖云端。` };
    }
    if (isCloudNewer(status.cloudSavedAt, localSavedAt)) {
      return { action: 'confirm', message: manualBackupWarning(status.cloudSavedAt, localSavedAt) };
    }
    return { action: 'backup' };
  }

  /* ---------- 状态机与文案 ---------- */
  function bridgeStateOf(status, busy) {
    if (busy) return 'backing-up';
    if (!status || !status.installed) return 'no-bridge';
    if (!status.configured) return 'unconfigured';
    if (status.lastBackupResult === 'failed') return 'error';
    return 'configured';
  }
  function stateLabel(state) { return STATE_LABELS[state] || '状态未知'; }

  function formatTimestamp(value) {
    const ms = tsOf(value);
    if (!ms) return '未知';
    try { return new Date(ms).toISOString().slice(0, 16).replace('T', ' '); } catch (error) { return '未知'; }
  }

  /* 设置页状态行的一行摘要（纯函数，可测）。 */
  function describeStatus(status, busy) {
    const state = bridgeStateOf(status, busy);
    if (state === 'no-bridge') return '未检测到伴随脚本：请按下方指引安装后点「检测」。';
    if (state === 'unconfigured') return '已安装伴随脚本；填好坚果云账号与应用密码并保存后即可使用云同步。';
    if (state === 'backing-up') return '正在与坚果云同步…';
    const parts = [`最近备份：${status.lastBackupAt ? formatTimestamp(status.lastBackupAt) : '还没有'}`];
    if (state === 'error' && status.lastError) parts.push(`失败原因：${status.lastError}`);
    if (status.cloudSavedAt) parts.push(`云端档案时间：${formatTimestamp(status.cloudSavedAt)}`);
    return parts.join(' · ');
  }

  /* ---------- 与伴随脚本通信（postMessage 协议） ---------- */
  function defaultDeps() {
    let win = null;
    try { win = window; } catch (error) { win = null; }
    const origin = win && win.location ? (win.location.origin || `${win.location.protocol}//${win.location.host}`) : '';
    return {
      origin,
      postMessage: win && typeof win.postMessage === 'function' ? (message, target) => win.postMessage(message, target) : null,
      addEventListener: win && typeof win.addEventListener === 'function' ? (type, handler) => win.addEventListener(type, handler) : () => {},
      removeEventListener: win && typeof win.removeEventListener === 'function' ? (type, handler) => win.removeEventListener(type, handler) : () => {},
      now: () => Date.now(),
      timeout: (handler, ms) => setTimeout(handler, ms),
      clearTimeout: handle => clearTimeout(handle),
      timeoutMs: BRIDGE_TIMEOUT_MS
    };
  }

  function createClient(rawDeps) {
    const deps = Object.assign(defaultDeps(), rawDeps || {});
    const pending = new Map();
    let seq = 0;
    let listening = false;

    function onMessage(event) {
      const data = event && event.data;
      if (!data || typeof data !== 'object') return;
      if (data[NAMESPACE] !== true || data.reply !== true) return;
      if (deps.origin && event.origin && event.origin !== deps.origin) return;
      const entry = pending.get(data.id);
      if (!entry) return;
      pending.delete(data.id);
      if (entry.timer !== null && entry.timer !== undefined) deps.clearTimeout(entry.timer);
      entry.resolve(data);
    }
    function ensureListening() {
      if (listening) return;
      deps.addEventListener('message', onMessage);
      listening = true;
    }
    function nextId() {
      seq += 1;
      return `${NAMESPACE}-${seq}-${deps.now()}`;
    }

    /* 发一条请求并等回复。任何异常路径都返回结构化结果，绝不抛给调用方。 */
    function request(method, payload) {
      if (BRIDGE_METHODS.indexOf(method) === -1) {
        return Promise.resolve({ ok: false, error: `未支持的云同步操作：${method}` });
      }
      if (typeof deps.postMessage !== 'function') {
        return Promise.resolve({ ok: false, unavailable: true, error: '当前环境不支持页面消息通道，云同步不可用。' });
      }
      ensureListening();
      const id = nextId();
      return new Promise(resolve => {
        const timer = deps.timeout(() => {
          pending.delete(id);
          resolve({ ok: false, timeout: true, error: '伴随脚本没有响应（可能未安装、被禁用或页面已休眠）。' });
        }, deps.timeoutMs);
        pending.set(id, { resolve, timer });
        try {
          deps.postMessage(Object.assign({ [NAMESPACE]: true, id, method }, { payload: payload || {} }), deps.origin);
        } catch (error) {
          if (timer !== null && timer !== undefined) deps.clearTimeout(timer);
          pending.delete(id);
          resolve({ ok: false, error: `发送云同步请求失败：${error && error.message ? error.message : error}` });
        }
      });
    }

    /* 探测伴随脚本：装了就回 ping。 */
    async function probe() {
      const reply = await request('ping');
      const installed = reply.ok === true;
      return {
        installed,
        version: reply.version || null,
        error: reply.ok ? null : (reply.error || '未知原因'),
        timeout: Boolean(reply.timeout),
        unavailable: Boolean(reply.unavailable)
      };
    }
    const status = payload => request('status', payload);
    const configure = payload => request('configure', payload);
    const clearConfig = () => request('clear-config');
    const setAutoBackup = enabled => request('set-auto-backup', { autoBackup: Boolean(enabled) });
    const testConnection = () => request('test');
    /* options（v4.11.45）：localSavedAt 让脚本在 PUT 前现场比较云端时间；
     * allowOverwrite 只有用户在站内二次确认里明确选了「确认覆盖云端」才为 true。 */
    const backup = (envelope, signature, options) => {
      const opts = (options && typeof options === 'object') ? options : {};
      return request('backup', {
        envelope,
        signature: typeof signature === 'string' ? signature : null,
        localSavedAt: typeof opts.localSavedAt === 'string' && opts.localSavedAt ? opts.localSavedAt : null,
        allowOverwrite: opts.allowOverwrite === true
      });
    };
    const restore = () => request('restore');

    return {
      request, probe, status, configure, clearConfig, setAutoBackup, testConnection, backup, restore,
      /* 测试与诊断用 */
      dispose() { if (listening) { deps.removeEventListener('message', onMessage); listening = false; } }
    };
  }

  let sharedClient = null;
  function client() {
    if (!sharedClient) sharedClient = createClient();
    return sharedClient;
  }

  window.ODIN_CLOUD_SYNC = {
    FORMAT,
    COMPAT_FORMATS: COMPAT_FORMATS.slice(),
    ENVELOPE_VERSION,
    NAMESPACE,
    MIN_BACKUP_INTERVAL_MS,
    BRIDGE_TIMEOUT_MS,
    BRIDGE_METHODS: BRIDGE_METHODS.slice(),
    SERVER_URL,
    REMOTE_LABEL,
    STATES: Object.keys(STATE_LABELS),
    buildEnvelope,
    validateEnvelope,
    archiveSignature,
    isCloudNewer,
    shouldAutoBackup,
    manualBackupWarning,
    manualBackupDecision,
    bridgeStateOf,
    stateLabel,
    formatTimestamp,
    describeStatus,
    createClient,
    client
  };
})();
