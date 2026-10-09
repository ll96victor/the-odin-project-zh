// ==UserScript==
// @name         Odin 中文学习站 · 云同步（坚果云 WebDAV + GM 面板）
// @namespace    the-odin-project-zh.companion
// @version      1.1.1
// @description  站点官方伴随脚本。① WebDAV 同步桥（headless）：站点「设置 → 云同步（坚果云）」经 postMessage 调用它，把学习档案存进你自己的坚果云账号、换设备一键取回。② GM storage 面板：localStorage ⇄ GM storage ⇄ JSON 文件的本机搬运（应急 / 开发验证，默认收起）。凭据只存油猴存储、永不进站点 localStorage；网络仅白名单单域 dav.jianguoyun.com。
// @author       ll96victor（AI 辅助编写）
// @match        http://127.0.0.1/*
// @match        https://ll96victor.github.io/the-odin-project-zh/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      dav.jianguoyun.com
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

/**
 * 更新日志：
 * v1.1.1 (2026-10-09)
 * - 修复：上传前**实时复查云端**。此前「云端比本机新就不覆盖」只在站点打开设置页时
 *   查一次、之后一路用内存缓存；期间另一台设备若备份过，本机仍会拿旧缓存判断并 PUT
 *   覆盖掉更新的云端档案。现在每次 PUT 之前都先 PROPFIND 云端文件、现场比较时间戳，
 *   把「读云端 → 比较 → 决定是否覆盖」收口到紧邻写入的位置，不再依赖任何缓存。
 * - 修复：读不到云端状态（网络不可达 / 超时 / 429 / 其它非 2xx / 云端文件时间戳读不出来）
 *   一律**停止本次备份**，绝不 PUT——不再把「读不到云端」当成「云端不存在」。
 * - 新增：`backup` 请求可带 `localSavedAt`（本机最近一次成功写档时间）与 `allowOverwrite`
 *   （只有用户在站内二次确认里点了「确认覆盖云端」才为 true）。
 * - 说明：手动「立即备份到云端」在云端更新时的二次确认改在**站内页面内**做（站点侧），
 *   不再用 window.confirm —— 原生对话框会把真实浏览器的自动化通道整条卡死。
 *
 * v1.1.0 (2026-10-09)
 * - 新增：WebDAV 同步桥（headless）——站点设置页「云同步（坚果云）」经 window.postMessage 调用本脚本，
 *   用 GM_xmlhttpRequest 直连 dav.jianguoyun.com 做 MKCOL（幂等建目录）/ PROPFIND / PUT / GET；
 *   账号与应用密码只写入油猴自己的存储，站点 localStorage 永不出现凭据；同步文件固定为专用子目录下的单文件。
 * - 调整：脚本由 odin-gm-sync-check.user.js 重命名合并为 odin-cloud-sync.user.js（v1.0.1 → v1.1.0）；
 *   原有的 GM storage 面板功能全部保留（保存到油猴 / 从油猴恢复 / 导出与导入 JSON / 回滚到恢复点）。
 * - 调整：@grant 新增 GM_xmlhttpRequest，新增 @connect dav.jianguoyun.com（单域白名单，绝不用全网通配）。
 * - 说明：v1.0.x 头部「本脚本零网络请求」这句承诺自本版起不再成立——新增的 WebDAV 桥是显式的网络能力，
 *   依用户 2026-10-09 的显式授权变更，不静默突破；网络请求只在你主动配置并使用云同步时发生，
 *   且只发往 dav.jianguoyun.com。站点代码本身仍零网络请求。
 * - 说明：真实坚果云连通性、iOS 通道（Tampermonkey iOS / Stay / Userscripts）与跨设备互通
 *   仍是 Ready for Human Verification，需用户用自己的账号真机实测，未写成已完成。
 *
 * v1.0.1 (2026-09-17)
 * - 调整：@match 增加第二条——公开仓 GitHub Pages 的**项目路径**通配（首页与子路径都覆盖），
 *   供公开网页做人工验证；本地开发地址匹配保留。不匹配该站根路径、不匹配任何其他域名。
 * - 说明：GM storage 按脚本共享、不分页面源——本地页与公开页的面板看到同一份油猴存档，
 *   可互为搬运中介；两处的 localStorage 仍各自独立（浏览器同源隔离，key 同名不同源）。
 * - 说明：公开站当前跑 v4.10.0 导出包，本脚本依赖的页面 API 全部齐备（已静态核对）；
 *   跨设备同步边界不变，仍是 Ready for Human Verification，未写成已完成。
 *
 * v1.0.0 (2026-09-17)
 * - 新增：首建浮动验证面板（默认收起为左下角小胶囊，不遮挡学习内容），提供
 *   「保存到油猴 / 从油猴恢复 / 导出 JSON / 导入 JSON」四个入口 + 真实结果状态行。
 * - 说明：校验不自造规则——JSON 导入侧走站点严格口径（ODIN_PROGRESS.previewImport，
 *   整份拒绝），保存/恢复侧走启动读档同款宽容口径（Logic.parseAutoLoad）；
 *   恢复需两段确认，且先落两个恢复点（站点 createBackup + GM odinRestorePoint）；
 *   写入 localStorage 后派发 storage 事件触发站点既有刷新链路，并读回内存态验证同步。
 * - 说明：@match 只写 http://127.0.0.1/*（匹配环回地址任意端口——serve.py 默认 8765，
 *   排错时文档建议 8766+；刻意不匹配 localhost：与本站存储不同源，serve.py 已 301 收敛）。
 *   绝不使用全站通配 match。跨设备同步（油猴自带的脚本导出 / Tampermonkey 云同步是否
 *   携带 GM storage）本脚本无法自证，状态：Ready for Human Verification，需两台电脑实测。
 */

/* grant 用途说明（每个都必要，不用的一律不声明）：
 * - GM_setValue：把学习档案信封 / 恢复点 / 云同步配置与节流状态写入油猴自己的存储
 *   （GM storage 可行性验证的核心；也是凭据唯一落点——站点存储永不碰凭据）。
 * - GM_getValue：从油猴存储读回上述值（含写入后的回读比对）。
 * - GM_xmlhttpRequest：WebDAV 请求（MKCOL / PROPFIND / PUT / GET）。它是绕开浏览器
 *   CORS 的必需通道——坚果云 WebDAV 不返回 Access-Control-Allow-Origin，页面内
 *   直接发请求会被浏览器拦下，物理不可行。仅配合下面的 @connect 单域白名单使用。
 * - unsafeWindow：访问页面真实 window——① 读 ODIN_PROGRESS / ODIN_GUIDE / ODIN_VERSION，
 *   复用站点自己的 sanitize 与 schema 规则（红线：不自造第二套校验）；② 在页面 window 上
 *   派发 storage 事件，触发 app.js watchStorage 的既有「重载 + 整体刷新」链路。
 *   **WebDAV 桥不依赖 unsafeWindow**——桥只走 window.postMessage（标准 API），
 *   以最大化对 Tampermonkey 桌面 / Android / iOS 与 Stay / Userscripts 等管理器的兼容。
 * 网络域名白名单：@connect 只声明 dav.jianguoyun.com 一个域名，绝不用全网通配。 */

(() => {
  'use strict';

  /* ---------- 常量 ---------- */
  const SCRIPT_VERSION = '1.1.1';
  /* 本脚本自己的 GM storage key（与站点 localStorage key 完全独立） */
  const GM_ARCHIVE_KEY = 'odinArchive';
  const GM_RESTORE_POINT_KEY = 'odinRestorePoint';
  /* 云同步（WebDAV）的 GM storage key：配置（含凭据）与节流/结果状态分开存 */
  const GM_WEBDAV_CONFIG_KEY = 'odinWebdavConfig';
  const GM_WEBDAV_STATE_KEY = 'odinWebdavState';
  /* 面板信封格式标识：恢复时校验它，防止 GM 存储里躺着别的脚本/别的格式的值被误恢复 */
  const ENVELOPE_FORMAT = 'odin-gm-sync-check';
  const ENVELOPE_VERSION = 1;
  /* 云同步信封格式标识（站点侧同值）。恢复侧兼容读旧的 ENVELOPE_FORMAT 信封。 */
  const WEBDAV_FORMAT = 'odin-webdav-sync';
  const WEBDAV_COMPAT_FORMATS = [WEBDAV_FORMAT, ENVELOPE_FORMAT];
  /* 坚果云 WebDAV 端点与远端布局：只维护一份当前档，放专用子目录
   * （坚果云不支持在根目录建文件，MKCOL 幂等建目录）。 */
  const WEBDAV_BASE = 'https://dav.jianguoyun.com/dav/';
  const WEBDAV_DIR = 'Odin学习站';
  const WEBDAV_FILE = 'odin-progress.json';
  /* 站内桥协议：站点 → 脚本的消息必须带这个标记位，且只接受下列固定方法 */
  const BRIDGE_FLAG = '__odinCloudSync';
  const BRIDGE_METHODS = ['ping', 'status', 'configure', 'clear-config', 'set-auto-backup', 'test', 'backup', 'restore'];
  /* 站点历史 key（progress.js 同款只读回落口径；当前 key 永远优先从页面 API 读） */
  const LEGACY_PAGE_KEY = 'odin-foundations-zh.progress.v1';

  /* 页面真实 window（Tampermonkey 沙箱下页面全局变量必须经 unsafeWindow 访问） */
  const page = (typeof unsafeWindow !== 'undefined' && unsafeWindow) ? unsafeWindow : window;
  const hasGm = typeof GM_setValue === 'function' && typeof GM_getValue === 'function';
  /* GM_xmlhttpRequest 两级形态：老式全局函数 / GM4 的 GM.xmlHttpRequest 方法 */
  const gmXhr = (typeof GM_xmlhttpRequest === 'function')
    ? GM_xmlhttpRequest
    : (typeof GM !== 'undefined' && GM && typeof GM.xmlHttpRequest === 'function' ? GM.xmlHttpRequest.bind(GM) : null);

  /* ---------- 页面 API 访问（全部带缺失保护，缺了就明确报错，绝不裸信任） ---------- */
  function progressApi() { return page.ODIN_PROGRESS || null; }
  function pageLogic() { const p = progressApi(); return (p && p.Logic) || null; }
  function storageKeyOf() {
    const p = progressApi();
    try { if (p && typeof p.storageKey === 'function') return p.storageKey(); } catch (error) { /* 忽略，走回落 */ }
    return null;
  }
  function lessonIdsOf() {
    const guide = page.ODIN_GUIDE;
    return guide && Array.isArray(guide.lessons) ? guide.lessons.map(lesson => lesson.id) : null;
  }
  function pageStorage() {
    try { return page.localStorage || null; } catch (error) { return null; }
  }
  function gmReady() {
    return hasGm ? null : '油猴 GM 存储 API 不可用（GM_setValue/GM_getValue 未注入），操作已拒绝。';
  }
  function gmXhrReady() {
    return gmXhr ? null : '油猴网络 API 不可用（GM_xmlhttpRequest 未注入），云同步操作已拒绝。';
  }
  function pageOrigin() {
    try { return page.location.origin || `${page.location.protocol}//${page.location.host}`; }
    catch (error) { return ''; }
  }

  /* ---------- 校验（复用站点规则，两条口径与 progress.js 完全一致） ---------- */
  /* 宽容口径 = 站点启动读档（parseAutoLoad）：坏块跳过、已知数据保留；
   * 用于「保存当前页面档案」与「恢复到页面」——页面里实际躺着的数据可能带
   * 未知课程编号（跨版本前向数据），启动时站点就是这么宽容加载的，恢复必须同口径。 */
  function validateLenient(text) {
    const logic = pageLogic();
    if (!logic || typeof logic.parseAutoLoad !== 'function') {
      return { ok: false, error: '页面 ODIN_PROGRESS 未加载，无法按站点规则校验（拒绝直接信任原始 JSON）。' };
    }
    const ids = lessonIdsOf();
    if (!ids) return { ok: false, error: '页面课程清单（ODIN_GUIDE）缺失，无法校验课程编号白名单。' };
    try { return logic.parseAutoLoad(text, ids); } catch (error) {
      return { ok: false, error: `校验执行异常：${error && error.message ? error.message : error}` };
    }
  }
  /* 严格口径 = 站点显式导入（previewImport → parseImport，整份拒绝）：
   * 用于「导入 JSON」——外部文件不可信任，与站点设置页导入同一条规则；
   * 额外叠加站点的敏感字段名检查（containsSensitiveKey），命中即拒绝。 */
  function validateStrict(text) {
    const p = progressApi();
    if (!p || typeof p.previewImport !== 'function') {
      return { ok: false, error: '页面 ODIN_PROGRESS 未加载，无法按站点规则做严格校验（拒绝导入）。' };
    }
    const logic = pageLogic();
    if (logic && typeof logic.containsSensitiveKey === 'function' && logic.containsSensitiveKey(text)) {
      return { ok: false, error: '内容含敏感字段名（token/password 类），按站点红线拒绝导入。' };
    }
    try { return p.previewImport(text); } catch (error) {
      return { ok: false, error: `校验执行异常：${error && error.message ? error.message : error}` };
    }
  }

  /* ---------- 档案摘要（面板展示 + 回读比对 + 恢复验证都用它） ---------- */
  function summarize(state) {
    if (!state || typeof state !== 'object') return null;
    const logic = pageLogic();
    let level = null;
    try { level = logic && typeof logic.levelOf === 'function' ? logic.levelOf(Number(state.xp) || 0) : null; } catch (error) { level = null; }
    const lessons = state.lessons || {};
    return {
      xp: Math.floor(Number(state.xp) || 0),
      level,
      completed: Object.keys(lessons).filter(id => lessons[id] && lessons[id].completed).length,
      coins: Math.floor(Number(state.coins) || 0),
      achievements: Object.keys(state.achievements || {}).length,
      totalActiveSeconds: Math.floor(Number(state.totalActiveSeconds) || 0),
      nickname: (state.profile && typeof state.profile.nickname === 'string') ? state.profile.nickname : '',
      schemaVersion: Number(state.schemaVersion) || null
    };
  }
  function summaryText(s) {
    if (!s) return '（无档案）';
    const parts = [];
    parts.push(s.level !== null ? `Lv.${s.level}` : 'Lv.?');
    parts.push(`XP ${s.xp}`);
    parts.push(`完成 ${s.completed} 课`);
    parts.push(`${s.coins} 叶片`);
    parts.push(`${s.achievements} 成就`);
    if (s.nickname) parts.push(`昵称「${s.nickname}」`);
    return parts.join(' · ');
  }
  /* 回读/恢复验证比对的字段清单：等级、XP、连续学习相关（时长）、成就、叶片、昵称 */
  const COMPARE_FIELDS = ['xp', 'level', 'completed', 'coins', 'achievements', 'totalActiveSeconds', 'nickname'];
  function compareSummaries(a, b) {
    const diff = [];
    for (const field of COMPARE_FIELDS) {
      if (!a || !b || a[field] !== b[field]) diff.push(field);
    }
    return diff;
  }

  /* ---------- 页面档案读取（当前 key 优先，历史 key 只读回落——progress.js 同口径） ---------- */
  function readPageArchiveRaw() {
    const store = pageStorage();
    if (!store) return { ok: false, error: '页面 localStorage 不可用（file:// 或浏览器策略限制），无法读取档案。' };
    const primary = storageKeyOf();
    const keys = primary ? [primary, LEGACY_PAGE_KEY] : [LEGACY_PAGE_KEY];
    for (const key of keys) {
      try {
        const raw = store.getItem(key);
        if (raw) return { ok: true, raw, key };
      } catch (error) { /* 单个 key 读取异常，继续回落 */ }
    }
    return { ok: true, raw: null, key: primary || LEGACY_PAGE_KEY };
  }

  function nowIso() { return new Date().toISOString(); }
  function dayStamp() {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  /* ---------- 信封（版本号 / 时间戳 / 来源 / 校验状态都在里面，恢复时逐项核对） ---------- */
  function buildEnvelope(source, rawText, parsedState, extra) {
    let rawSchemaVersion = null;
    try { rawSchemaVersion = Number(JSON.parse(rawText).schemaVersion) || null; } catch (error) { rawSchemaVersion = null; }
    return Object.assign({
      format: ENVELOPE_FORMAT,
      envelopeVersion: ENVELOPE_VERSION,
      savedAt: nowIso(),
      source,                       // 'localStorage' | 'json-file'
      app: (page.ODIN_VERSION && page.ODIN_VERSION.app) || null,
      productVersion: (page.ODIN_VERSION && page.ODIN_VERSION.version) || null,
      schemaVersion: parsedState ? Number(parsedState.schemaVersion) || null : null,
      rawSchemaVersion,             // 原文的 schema（可能是旧版 1/2/3，载入时由站点自动迁移）
      data: rawText                 // 存储原文逐字节保留（与站点 key 迁移「搬原文」同语义）
    }, extra || {});
  }
  function envelopeMetaText(env) {
    if (!env) return '油猴存档：无';
    const when = env.savedAt ? env.savedAt.replace('T', ' ').slice(0, 19) : '时间未知';
    const src = env.source === 'json-file' ? `JSON 导入${env.sourceFilename ? `（${env.sourceFilename}）` : ''}` : '页面 localStorage';
    const schema = env.rawSchemaVersion && env.schemaVersion && env.rawSchemaVersion !== env.schemaVersion
      ? `schema v${env.rawSchemaVersion}→v${env.schemaVersion}`
      : `schema v${env.schemaVersion || '?'}`;
    return `油猴存档：${when} · 来自${src} · ${schema} · 信封 v${env.envelopeVersion || '?'}`;
  }

  /* ===================== 核心动作 ===================== */

  /* A. localStorage → GM：读页面档案原文 → 宽容校验 → 写信封 → 回读逐字段比对 */
  function saveToGm() {
    const gate = gmReady();
    if (gate) return { ok: false, error: gate };
    const read = readPageArchiveRaw();
    if (!read.ok) return read;
    if (!read.raw) return { ok: false, empty: true, error: '当前页面还没有学习档案（数据为空）。先在站里学习一下，或先「导入 JSON」。' };
    const probe = validateLenient(read.raw);
    if (!probe.ok) return { ok: false, error: `当前页面档案未通过站点校验，已拒绝写入油猴存储（页面数据未动）：${probe.error}` };
    const envelope = buildEnvelope('localStorage', read.raw, probe.state, { storageKey: read.key, warnings: probe.warnings || [] });
    try { GM_setValue(GM_ARCHIVE_KEY, envelope); } catch (error) {
      return { ok: false, error: `GM_setValue 写入失败（页面数据未动）：${error && error.message ? error.message : error}` };
    }
    /* 验证最终数据而不是「函数没抛错」：回读 GM → 原文一致 → 再按站点规则解析 → 关键字段逐一比对 */
    let back = null;
    try { back = GM_getValue(GM_ARCHIVE_KEY, null); } catch (error) {
      return { ok: false, error: `GM_getValue 回读失败：${error && error.message ? error.message : error}` };
    }
    if (!back || typeof back !== 'object' || back.data !== envelope.data) {
      return { ok: false, error: '写入油猴存储后回读不一致，按失败处理（页面数据未动，可重试）。' };
    }
    const backProbe = validateLenient(back.data);
    const pageSummary = summarize(probe.state);
    const gmSummary = backProbe.ok ? summarize(backProbe.state) : null;
    const diff = compareSummaries(pageSummary, gmSummary);
    if (diff.length) {
      return { ok: false, error: `回读比对不一致（字段：${diff.join('、')}），按失败处理。`, pageSummary, gmSummary };
    }
    return { ok: true, summary: pageSummary, comparedFields: COMPARE_FIELDS.slice(), warnings: envelope.warnings };
  }

  /* 读 GM 信封（面板展示用；带有效性诊断，不做任何写入） */
  function getGmInfo() {
    const gate = gmReady();
    if (gate) return { ok: false, error: gate };
    let env = null;
    try { env = GM_getValue(GM_ARCHIVE_KEY, null); } catch (error) {
      return { ok: false, error: `GM_getValue 读取失败：${error && error.message ? error.message : error}` };
    }
    if (!env || typeof env !== 'object') return { ok: true, empty: true, envelope: null, metaText: '油猴存档：无（数据为空）' };
    if (env.format !== ENVELOPE_FORMAT || typeof env.data !== 'string') {
      return { ok: false, envelope: env, metaText: '油猴存档：格式标识不符，已拒绝使用（见状态行）', error: 'GM 存储里的值不是本脚本写入的档案信封（format 标识不符），拒绝恢复。' };
    }
    const probe = validateLenient(env.data);
    return {
      ok: probe.ok, envelope: env, metaText: envelopeMetaText(env),
      summary: probe.ok ? summarize(probe.state) : null,
      error: probe.ok ? undefined : `油猴档案未通过站点校验（恢复会被拒绝）：${probe.error}`
    };
  }

  /* 恢复前的公共写入链路：校验 → 双恢复点 → 写 localStorage → 触发站点刷新 → 验证内存态 */
  function writeArchiveToPage(rawText, label) {
    const store = pageStorage();
    const key = storageKeyOf();
    if (!store) return { ok: false, error: '页面 localStorage 不可用，拒绝写入（油猴存档未动）。' };
    if (!key) return { ok: false, error: '页面 ODIN_PROGRESS.storageKey 不可用，拒绝写入（避免猜 key 写错位置）。' };
    const probe = validateLenient(rawText);
    if (!probe.ok) return { ok: false, error: `${label}未通过站点校验，拒绝写入页面（当前学习数据未动）：${probe.error}` };
    /* 恢复点 1：站点自己的备份体系（与设置页「恢复备份」同一函数，保留 5 份轮替）。
     * 失败不阻断（GM 恢复点仍在），但如实记录并展示。 */
    let siteBackup = '未执行（页面 API 缺失）';
    try {
      const p = progressApi();
      if (p && typeof p.createBackup === 'function') {
        const result = p.createBackup('油猴 GM 恢复前自动快照');
        siteBackup = result && result.ok ? `已建（${String(result.at).replace('T', ' ').slice(0, 19)}）` : `失败（${(result && result.error) || '未知原因'}）`;
      }
    } catch (error) { siteBackup = `异常（${error && error.message ? error.message : error}）`; }
    /* 恢复点 2：把当前页面存储原文存进 GM（覆盖旧恢复点，只留最近一份） */
    let gmRestorePoint = false;
    try {
      const current = readPageArchiveRaw();
      GM_setValue(GM_RESTORE_POINT_KEY, { format: ENVELOPE_FORMAT, envelopeVersion: ENVELOPE_VERSION, savedAt: nowIso(), source: 'pre-restore', data: current.ok ? current.raw : null });
      gmRestorePoint = true;
    } catch (error) { gmRestorePoint = false; }
    /* 写入：存储原文逐字节落回当前 key（schema 迁移由站点加载路径自己处理，与 key 迁移同语义） */
    try { store.setItem(key, rawText); } catch (error) {
      return { ok: false, error: `localStorage 写入失败：${error && error.message ? error.message : error}（页面内存态未动，油猴存档完好）`, siteBackup, gmRestorePoint };
    }
    /* 触发站点既有刷新链路：storage 事件 → app.js watchStorage → reloadFromStorage + refreshAll。
     * 不派发成功的后果：页面内存态仍是旧档案，pagehide 时 finalSave 会用旧内存态覆盖刚恢复的
     * 存储——所以派发后必须验证内存态，未同步就明确告诉用户刷新页面。 */
    const dispatched = notifyPageRefresh(key);
    const p = progressApi();
    const expected = summarize(probe.state);
    let memory = null;
    try { memory = p && typeof p.getState === 'function' ? summarize(p.getState()) : null; } catch (error) { memory = null; }
    const diff = compareSummaries(expected, memory);
    if (diff.length) {
      return {
        ok: false, needsReload: true, siteBackup, gmRestorePoint, dispatched,
        error: `档案已写入 localStorage，但页面内存态未同步（字段：${diff.join('、')}）。请点击「刷新页面」完成恢复——不刷新的话离开页面时旧内存态可能覆盖恢复结果。`
      };
    }
    return { ok: true, summary: memory, siteBackup, gmRestorePoint, dispatched };
  }

  /* B. GM → localStorage（面板上必须先经过两段确认才会调到这里） */
  function restoreFromGm() {
    const gate = gmReady();
    if (gate) return { ok: false, error: gate };
    const info = getGmInfo();
    if (info.empty) return { ok: false, empty: true, error: '油猴存储里没有档案（数据为空），请先「保存到油猴」或「导入 JSON」。' };
    if (!info.ok) return { ok: false, error: info.error || '油猴存档不可用，拒绝恢复（当前学习数据未动）。' };
    const result = writeArchiveToPage(info.envelope.data, '油猴存档');
    if (result.ok) result.metaText = envelopeMetaText(info.envelope);
    return result;
  }

  /* 回滚：把「从油猴恢复」之前存下的恢复点写回页面（同样两段确认 + 同一条写入链路） */
  function restoreFromRestorePoint() {
    const gate = gmReady();
    if (gate) return { ok: false, error: gate };
    let point = null;
    try { point = GM_getValue(GM_RESTORE_POINT_KEY, null); } catch (error) {
      return { ok: false, error: `恢复点读取失败：${error && error.message ? error.message : error}` };
    }
    if (!point || typeof point.data !== 'string') return { ok: false, empty: true, error: '没有可用的恢复点（数据为空）。恢复点在每次「从油猴恢复」前自动生成。' };
    const probe = validateLenient(point.data);
    if (!probe.ok) return { ok: false, error: `恢复点未通过站点校验，拒绝写入（当前数据未动）：${probe.error}` };
    return writeArchiveToPage(point.data, '恢复点档案');
  }

  function getRestorePointInfo() {
    const gate = gmReady();
    if (gate) return { ok: false, error: gate };
    try {
      const point = GM_getValue(GM_RESTORE_POINT_KEY, null);
      if (!point || typeof point.data !== 'string') return { ok: true, empty: true };
      const probe = validateLenient(point.data);
      return { ok: probe.ok, savedAt: point.savedAt || null, summary: probe.ok ? summarize(probe.state) : null };
    } catch (error) { return { ok: false, error: String(error && error.message || error) }; }
  }

  /* C. 导出 JSON（人工兜底）：优先导出油猴存档，没有则导出当前页面档案。
   * 导出的是站点档案原文——与本站设置页「导出档案」同一格式，站点原生导入也能吃。 */
  function buildExportPayload() {
    let env = null;
    if (hasGm) { try { env = GM_getValue(GM_ARCHIVE_KEY, null); } catch (error) { env = null; } }
    let text = null;
    let source = null;
    if (env && typeof env === 'object' && env.format === ENVELOPE_FORMAT && typeof env.data === 'string') {
      text = env.data;
      source = `油猴存档（${envelopeMetaText(env)}）`;
    } else {
      const read = readPageArchiveRaw();
      if (!read.ok) return read;
      if (read.raw) { text = read.raw; source = `页面 localStorage（key：${read.key}）`; }
    }
    if (!text) return { ok: false, empty: true, error: '油猴存储与页面都没有档案（数据为空），无可导出内容。' };
    const probe = validateLenient(text);
    if (!probe.ok) return { ok: false, error: `档案未通过站点校验，拒绝导出坏数据：${probe.error}` };
    return { ok: true, text, source, summary: summarize(probe.state), filename: `odin-gm-archive-${dayStamp()}.json` };
  }
  function exportJson() {
    const payload = buildExportPayload();
    if (!payload.ok) return payload;
    try {
      if (typeof page.Blob === 'function' && page.URL && typeof page.URL.createObjectURL === 'function') {
        const blob = new page.Blob([payload.text], { type: 'application/json' });
        const url = page.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = payload.filename;
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
        page.URL.revokeObjectURL(url);
        return Object.assign({ downloaded: true }, payload);
      }
      return Object.assign({ downloaded: false, error: '当前环境不支持文件下载（无 URL.createObjectURL），档案文本已生成但未落盘。' }, payload);
    } catch (error) {
      return { ok: false, error: `导出失败：${error && error.message ? error.message : error}` };
    }
  }

  /* D. 导入 JSON（严格校验）：外部文件走站点显式导入口径（previewImport 整份拒绝 +
   * 敏感字段名检查）。校验通过只写入油猴存储——落到页面必须再走「从油猴恢复」的
   * 两段确认，页面加载时绝不静默覆盖任何数据。 */
  function importJsonText(text, filename) {
    const gate = gmReady();
    if (gate) return { ok: false, error: gate };
    if (typeof text !== 'string' || !text.trim()) return { ok: false, empty: true, error: '文件内容为空（数据为空），已拒绝导入。' };
    const strict = validateStrict(text);
    if (!strict.ok) return { ok: false, error: `导入被拒绝（油猴存储与页面数据都没有被修改）：${strict.error}` };
    const envelope = buildEnvelope('json-file', text, strict.state, { sourceFilename: String(filename || '').slice(0, 120) });
    try { GM_setValue(GM_ARCHIVE_KEY, envelope); } catch (error) {
      return { ok: false, error: `GM_setValue 写入失败：${error && error.message ? error.message : error}` };
    }
    let back = null;
    try { back = GM_getValue(GM_ARCHIVE_KEY, null); } catch (error) { back = null; }
    if (!back || back.data !== text) return { ok: false, error: '写入油猴存储后回读不一致，按失败处理（页面数据未动）。' };
    return { ok: true, summary: summarize(strict.state), metaText: envelopeMetaText(envelope) };
  }

  /* 刷新链路：在页面 window 上派发 storage 事件（key = 档案 key）。
   * app.js watchStorage 的既有监听会做 reloadFromStorage + refreshAll——这是站点
   * 跨标签页同步的同一条公共链路，本脚本零改动站点代码。构造器三级降级：
   * StorageEvent → Event+defineProperty → 普通对象（仅供 Node 测试桩，真实浏览器必有前两者）。 */
  function notifyPageRefresh(key) {
    try {
      let event = null;
      if (typeof page.StorageEvent === 'function') {
        try { event = new page.StorageEvent('storage', { key, storageArea: page.localStorage }); } catch (error) { event = null; }
      }
      if (!event && typeof page.Event === 'function') {
        event = new page.Event('storage');
        try { Object.defineProperty(event, 'key', { value: key }); } catch (error) { event.key = key; }
      }
      if (!event) event = { type: 'storage', key };
      if (typeof page.dispatchEvent === 'function') { page.dispatchEvent(event); return true; }
    } catch (error) { /* 派发失败由调用方的内存态验证兜底 */ }
    return false;
  }

  /* ===================== WebDAV 桥（v1.1.0 新增，headless） =====================
   * 站内 UI 通过 window.postMessage 调用下列方法；本脚本用 GM_xmlhttpRequest 直连坚果云。
   * 凭据（账号 + 应用密码）只写入 GM storage，站点 localStorage 永不出现凭据。 */

  /* ---- 配置与状态（GM storage） ---- */
  function readWebdavConfig() {
    if (!hasGm) return null;
    try {
      const config = GM_getValue(GM_WEBDAV_CONFIG_KEY, null);
      if (!config || typeof config !== 'object') return null;
      return {
        account: typeof config.account === 'string' ? config.account : '',
        password: typeof config.password === 'string' ? config.password : '',
        autoBackup: config.autoBackup !== false
      };
    } catch (error) { return null; }
  }
  function writeWebdavConfig(config) {
    GM_setValue(GM_WEBDAV_CONFIG_KEY, config);
  }
  function readWebdavState() {
    if (!hasGm) return {};
    try {
      const state = GM_getValue(GM_WEBDAV_STATE_KEY, null);
      return (state && typeof state === 'object') ? state : {};
    } catch (error) { return {}; }
  }
  function writeWebdavState(patch) {
    const next = Object.assign({}, readWebdavState(), patch);
    try { GM_setValue(GM_WEBDAV_STATE_KEY, next); } catch (error) { /* 状态写失败不影响本次结果反馈 */ }
    return next;
  }
  /* 账号掩码：只显示首字符与域名，绝不回显密码 */
  function maskAccount(account) {
    const text = String(account || '');
    if (!text) return '';
    const at = text.indexOf('@');
    if (at <= 0) return `${text.slice(0, 1)}***`;
    return `${text.slice(0, 1)}***${text.slice(at)}`;
  }

  /* ---- GM_xmlhttpRequest 的 Promise 包装（回调风格，兼容面最广） ---- */
  function davRequest(options) {
    return new Promise((resolve, reject) => {
      const gate = gmXhrReady();
      if (gate) { reject(new Error(gate)); return; }
      try {
        gmXhr({
          method: options.method,
          url: options.url,
          headers: options.headers || {},
          data: options.data,
          timeout: 20000,
          onload: response => resolve(response),
          onerror: () => reject(new Error('network')),
          ontimeout: () => reject(new Error('timeout')),
          onabort: () => reject(new Error('network'))
        });
      } catch (error) { reject(error); }
    });
  }
  /* UTF-8 安全的 base64（账号邮箱基本是 ASCII，但 Base64 不能对非 ASCII 直接 btoa） */
  function base64(text) {
    const raw = String(text);
    try {
      if (typeof btoa === 'function' && /^[\x00-\x7F]*$/.test(raw)) return btoa(raw);
    } catch (error) { /* 落到下面的手工实现 */ }
    const bytes = [];
    for (let i = 0; i < raw.length; i += 1) {
      let code = raw.charCodeAt(i);
      if (code < 0x80) bytes.push(code);
      else if (code < 0x800) bytes.push(0xC0 | (code >> 6), 0x80 | (code & 0x3F));
      else bytes.push(0xE0 | (code >> 12), 0x80 | ((code >> 6) & 0x3F), 0x80 | (code & 0x3F));
    }
    const table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let out = '';
    for (let i = 0; i < bytes.length; i += 3) {
      const b0 = bytes[i];
      const b1 = bytes[i + 1];
      const b2 = bytes[i + 2];
      out += table[b0 >> 2];
      out += table[((b0 & 3) << 4) | ((b1 === undefined ? 0 : b1) >> 4)];
      out += b1 === undefined ? '=' : table[((b1 & 15) << 2) | ((b2 === undefined ? 0 : b2) >> 6)];
      out += b2 === undefined ? '=' : table[b2 & 63];
    }
    return out;
  }
  function authHeader(config) {
    return { Authorization: `Basic ${base64(`${config.account}:${config.password}`)}` };
  }
  function davPaths() {
    const dir = `${WEBDAV_BASE}${encodeURIComponent(WEBDAV_DIR)}/`;
    return { server: WEBDAV_BASE, dir, file: `${dir}${WEBDAV_FILE}`, label: `${WEBDAV_DIR}/${WEBDAV_FILE}` };
  }
  /* HTTP 状态码 → 中文原因（错误不静默、不重试轰炸） */
  function describeStatus(status, action) {
    switch (Number(status)) {
      case 401: return `${action}失败：账号或应用密码不正确（401）。请用坚果云「第三方应用密码」，不是登录密码。`;
      case 403: return `${action}失败：这个账号没有该目录的读写权限（403）。`;
      case 404: return `${action}失败：云端还没有备份文件（404）。`;
      case 405: return `${action}失败：服务器不接受该操作（405）。`;
      case 409: return `${action}失败：父目录不存在（409）。坚果云不允许在根目录建文件，请确认用的是专用子目录。`;
      case 429: return `${action}失败：坚果云提示请求太频繁（429）。已停止本次操作、不做自动重试，请稍后再试。`;
      case 507: return `${action}失败：坚果云空间或流量配额不足（507）。`;
      case 0: return `${action}失败：网络不可达（没有拿到响应）。`;
      default: return `${action}失败：服务器返回 ${status}。`;
    }
  }
  function isRateLimited(response) { return Number(response && response.status) === 429; }

  /* MKCOL 幂等建目录：已存在（405）与「已在」（301）都算成功 */
  async function ensureCloudDir(config) {
    const paths = davPaths();
    let response;
    try {
      response = await davRequest({ method: 'MKCOL', url: paths.dir, headers: authHeader(config) });
    } catch (error) {
      return { ok: false, error: error.message === 'timeout' ? '建云端目录失败：请求超时。' : '建云端目录失败：网络不可达。' };
    }
    const status = Number(response.status);
    if (status >= 200 && status < 300) return { ok: true, created: true, status };
    if (status === 405 || status === 301) return { ok: true, created: false, status };
    return { ok: false, status, rateLimited: status === 429, error: describeStatus(status, '建云端目录') };
  }

  /* 探活 / 测试连接：建目录 + PROPFIND 该目录 */
  async function davTest() {
    if (!hasGm) return { ok: false, error: '油猴 GM 存储 API 不可用，操作已拒绝。' };
    const config = readWebdavConfig();
    if (!config || !config.account || !config.password) return { ok: false, error: '还没有配置坚果云账号与应用密码。' };
    const dir = await ensureCloudDir(config);
    if (!dir.ok) return dir;
    let response;
    try {
      response = await davRequest({ method: 'PROPFIND', url: davPaths().dir, headers: Object.assign({ Depth: '1' }, authHeader(config)) });
    } catch (error) {
      return { ok: false, error: error.message === 'timeout' ? '测试连接失败：请求超时。' : '测试连接失败：网络不可达。' };
    }
    const status = Number(response.status);
    if (status >= 200 && status < 300) return { ok: true, status, dirCreated: dir.created, label: davPaths().label };
    return { ok: false, status, error: describeStatus(status, '测试连接') };
  }

  /* PROPFIND 单文件 → 云端时间戳（getlastmodified）。**三态必须分开**：
   *   - `{ exists:true, lastModified }` 读到了云端文件与其时间；
   *   - `{ exists:false, missing:true }` 404——云端**确实没有**这个文件（首次备份的正常情形）；
   *   - `{ exists:false, error }` **读不到**（网络不可达 / 超时 / 429 / 其它非 2xx / 文件在但
   *     时间戳解析不出来）。写入前的复查把这个当「云端不存在」就会在状态未知时覆盖云端，
   *     所以 v1.1.1 起它带 error 标记，调用方据此停止。 */
  async function davCloudTimestamp(config) {
    let response;
    try {
      response = await davRequest({ method: 'PROPFIND', url: davPaths().file, headers: Object.assign({ Depth: '0' }, authHeader(config)) });
    } catch (error) {
      return { exists: false, error: error.message === 'timeout' ? '请求超时' : '网络不可达' };
    }
    const status = Number(response.status);
    if (status === 404) return { exists: false, missing: true, status };
    if (status < 200 || status >= 300) return { exists: false, status, error: describeStatus(status, '读取云端状态') };
    const raw = String(response.responseText || '');
    const match = /<[^>]*getlastmodified[^>]*>([^<]+)</i.exec(raw);
    let lastModified = match ? match[1].trim() : null;
    if (lastModified) { const parsed = Date.parse(lastModified); lastModified = Number.isNaN(parsed) ? null : new Date(parsed).toISOString(); }
    if (!lastModified) return { exists: true, lastModified: null, status, error: '云端文件没有可读的时间戳' };
    return { exists: true, lastModified, status };
  }

  /* 写入前的云端复查判定（纯函数，测试直接驱动，v1.1.1 FIX-1 的核心）。
   * 输入：davCloudTimestamp 的结果 + 本机最近一次成功写档时间 + 是否已获用户显式覆盖授权。
   * 输出 { allow, reason }：allow=false 时**绝不 PUT**。
   *   - cloud.error        → 'unknown'：读不到云端状态（含 429 / 网络失败 / 时间戳读不出），
   *                          不把「读不到」当「不存在」，宁可不覆盖；
   *   - 云端无文件（404）    → 'no-cloud-file'：首次备份，放行；
   *   - allowOverwrite=true → 'overwrite-authorized'：用户在站内二次确认里明确选了覆盖，放行；
   *   - 云端时间 > 本机时间  → 'cloud-newer'：另一台设备刚备份过，阻止；
   *   - 本机时间不可解析     → 'unknown'：无从比较就不覆盖；
   *   - 其余                → 'ok'。 */
  function evaluateCloudGuard(cloud, localSavedAt, allowOverwrite) {
    if (!cloud || cloud.error) {
      return { allow: false, reason: 'unknown', error: (cloud && cloud.error) || '云端状态未知' };
    }
    if (!cloud.exists) return { allow: true, reason: 'no-cloud-file' };
    if (allowOverwrite === true) return { allow: true, reason: 'overwrite-authorized' };
    const remote = Date.parse(String(cloud.lastModified || ''));
    if (Number.isNaN(remote)) return { allow: false, reason: 'unknown', error: '云端文件没有可读的时间戳' };
    const local = Date.parse(String(localSavedAt || ''));
    if (Number.isNaN(local)) return { allow: false, reason: 'unknown', error: '本机没有可用的写档时间' };
    if (remote > local) return { allow: false, reason: 'cloud-newer', cloudSavedAt: cloud.lastModified };
    return { allow: true, reason: 'ok' };
  }

  /* 备份：ensureDir → **实时复查云端** → PUT 信封。
   * payload 里可带 signature（站点计算的档案内容签名，本脚本只当不透明字符串存储与回传，
   * 不自己计算——签名算法的事实源在站点 cloud-sync.js）、localSavedAt（本机最近一次成功
   * 写档时间）与 allowOverwrite（用户在站内二次确认里明确选了覆盖才为 true）。
   *
   * v1.1.1（FIX-1）：复查紧贴在 PUT 之前，是**最终拦截点**——站点设置页的缓存可能已被
   * 另一台设备的新档案作废，只信缓存就是「用旧档案覆盖新档案」。失败不静默：结果落盘，
   * 下次打开设置仍可见。 */
  async function davBackup(envelope, signature, options) {
    if (!hasGm) return { ok: false, error: '油猴 GM 存储 API 不可用，操作已拒绝。' };
    if (!envelope || typeof envelope !== 'object' || typeof envelope.data !== 'string') {
      return { ok: false, error: '要上传的档案信封不合法，已拒绝。' };
    }
    const config = readWebdavConfig();
    if (!config || !config.account || !config.password) return { ok: false, error: '还没有配置坚果云账号与应用密码。' };
    const opts = (options && typeof options === 'object') ? options : {};
    const dir = await ensureCloudDir(config);
    if (!dir.ok) { writeWebdavState({ lastBackupAt: nowIso(), lastBackupResult: 'failed', lastError: dir.error }); return dir; }
    const cloud = await davCloudTimestamp(config);
    const guard = evaluateCloudGuard(cloud, opts.localSavedAt, opts.allowOverwrite);
    if (!guard.allow) {
      const cloudNewer = guard.reason === 'cloud-newer';
      const message = cloudNewer
        ? `备份已停止：云端档案比本机新（云端 ${guard.cloudSavedAt}），另一台设备可能刚备份过。要强制覆盖请点「立即备份到云端」并在页面内确认。`
        : `备份已停止：无法确认云端最新状态（${guard.error}），不会在状态未知时覆盖云端（本机与云端都没有改动）。`;
      const patch = { lastBackupAt: nowIso(), lastBackupResult: 'failed', lastError: message };
      if (guard.cloudSavedAt) patch.cloudSavedAt = guard.cloudSavedAt;
      writeWebdavState(patch);
      return {
        ok: false, cloudNewer, cloudUnknown: !cloudNewer,
        cloudSavedAt: guard.cloudSavedAt || null, error: message
      };
    }
    let response;
    try {
      response = await davRequest({
        method: 'PUT',
        url: davPaths().file,
        headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, authHeader(config)),
        data: JSON.stringify(envelope)
      });
    } catch (error) {
      const message = error.message === 'timeout' ? '备份失败：请求超时（云端数据未变）。' : '备份失败：网络不可达（云端数据未变）。';
      writeWebdavState({ lastBackupAt: nowIso(), lastBackupResult: 'failed', lastError: message });
      return { ok: false, error: message };
    }
    const status = Number(response.status);
    if (status >= 200 && status < 300) {
      const savedAt = typeof envelope.savedAt === 'string' ? envelope.savedAt : nowIso();
      const bytes = JSON.stringify(envelope).length;
      writeWebdavState({
        lastBackupAt: nowIso(),
        lastBackupResult: 'ok',
        lastError: null,
        lastBackedUpSavedAt: savedAt,
        lastBackedUpSignature: typeof signature === 'string' ? signature : (readWebdavState().lastBackedUpSignature || null),
        cloudSavedAt: savedAt
      });
      return { ok: true, status, savedAt, bytes, label: davPaths().label };
    }
    const error = describeStatus(status, '备份');
    writeWebdavState({ lastBackupAt: nowIso(), lastBackupResult: 'failed', lastError: error });
    return { ok: false, status, error, rateLimited: isRateLimited(response) };
  }

  /* 恢复：GET 信封原文 → 校验 format 与 data → 交给站点做严格校验（桥不自己判档案合法性） */
  async function davRestore() {
    if (!hasGm) return { ok: false, error: '油猴 GM 存储 API 不可用，操作已拒绝。' };
    const config = readWebdavConfig();
    if (!config || !config.account || !config.password) return { ok: false, error: '还没有配置坚果云账号与应用密码。' };
    let response;
    try {
      response = await davRequest({ method: 'GET', url: davPaths().file, headers: authHeader(config) });
    } catch (error) {
      return { ok: false, error: error.message === 'timeout' ? '读取云端失败：请求超时。' : '读取云端失败：网络不可达。' };
    }
    const status = Number(response.status);
    if (status === 404) return { ok: false, empty: true, error: '云端还没有备份文件。请先在另一台设备点「立即备份」。' };
    if (status < 200 || status >= 300) return { ok: false, status, error: describeStatus(status, '读取云端') };
    let envelope = null;
    try { envelope = JSON.parse(String(response.responseText || '')); } catch (error) {
      return { ok: false, error: '云端文件不是合法的 JSON，已拒绝恢复（本机数据未动）。' };
    }
    if (!envelope || typeof envelope !== 'object' || WEBDAV_COMPAT_FORMATS.indexOf(envelope.format) === -1 || typeof envelope.data !== 'string') {
      return { ok: false, error: '云端文件不是本站的档案信封（format 标识不符），已拒绝恢复（本机数据未动）。' };
    }
    writeWebdavState({ cloudSavedAt: typeof envelope.savedAt === 'string' ? envelope.savedAt : readWebdavState().cloudSavedAt || null });
    return { ok: true, status, envelope, savedAt: envelope.savedAt || null };
  }

  /* ---- 配置写入：账号 + 应用密码（密码留空且账号未变时沿用已存密码） ---- */
  function davConfigure(payload) {
    if (!hasGm) return { ok: false, error: '油猴 GM 存储 API 不可用，操作已拒绝。' };
    const account = typeof payload.account === 'string' ? payload.account.trim() : '';
    const password = typeof payload.password === 'string' ? payload.password : '';
    if (!account || account.indexOf('@') === -1) return { ok: false, error: '请填写坚果云账号（注册邮箱）。' };
    const existing = readWebdavConfig();
    const keepPassword = (!password && existing && existing.account === account && existing.password);
    const nextPassword = keepPassword ? existing.password : password;
    if (!nextPassword) return { ok: false, error: '请填写坚果云「第三方应用密码」（不是登录密码）。' };
    const autoBackup = payload.autoBackup === undefined
      ? (existing ? existing.autoBackup : true)
      : payload.autoBackup !== false;
    writeWebdavConfig({ account, password: nextPassword, autoBackup });
    writeWebdavState({ lastError: null });
    return { ok: true, accountMask: maskAccount(account), autoBackup, passwordKept: Boolean(keepPassword) };
  }
  function davClearConfig() {
    if (!hasGm) return { ok: false, error: '油猴 GM 存储 API 不可用，操作已拒绝。' };
    try {
      GM_setValue(GM_WEBDAV_CONFIG_KEY, null);
      GM_setValue(GM_WEBDAV_STATE_KEY, null);
      return { ok: true };
    } catch (error) { return { ok: false, error: `清除失败：${error && error.message ? error.message : error}` }; }
  }
  function davSetAutoBackup(payload) {
    const config = readWebdavConfig();
    if (!config || !config.account || !config.password) return { ok: false, error: '还没有配置坚果云账号与应用密码。' };
    writeWebdavConfig(Object.assign({}, config, { autoBackup: payload.autoBackup !== false }));
    return { ok: true, autoBackup: payload.autoBackup !== false };
  }

  /* ---- 统一状态快照（站点设置页状态行的唯一数据源，不含密码） ----
   * `checkCloud:true` 时才读云端，并且**如实区分三种结果**（v1.1.1）：
   *   cloudChecked=true  → 本次确实读到了云端状态（cloudExists / cloudSavedAt 可信）；
   *   cloudChecked=false → 读不到（网络 / 429 / 时间戳读不出），带 cloudError；
   *                       站点据此**停止**手动备份，而不是拿旧缓存或「云端不存在」继续。
   * 不请求 checkCloud 时 cloudChecked=false，cloudSavedAt 退回上次成功备份记下的值（仅供展示）。 */
  async function webdavStatus(payload) {
    if (!hasGm) return { ok: false, installed: true, error: '油猴 GM 存储 API 不可用。' };
    const config = readWebdavConfig();
    const state = readWebdavState();
    const configured = Boolean(config && config.account && config.password);
    const wantCloud = Boolean(configured && payload && payload.checkCloud);
    let cloud = null;
    if (wantCloud) cloud = await davCloudTimestamp(config);
    const cloudChecked = Boolean(cloud && !cloud.error);
    return {
      ok: true,
      installed: true,
      version: SCRIPT_VERSION,
      configured,
      accountMask: configured ? maskAccount(config.account) : '',
      autoBackup: configured ? config.autoBackup !== false : true,
      lastBackupAt: state.lastBackupAt || null,
      lastBackupResult: state.lastBackupResult || null,
      lastError: state.lastError || null,
      lastBackedUpSavedAt: state.lastBackedUpSavedAt || null,
      lastBackedUpSignature: state.lastBackedUpSignature || null,
      cloudChecked,
      cloudError: cloud && cloud.error ? cloud.error : null,
      cloudExists: Boolean(cloud && cloud.exists),
      cloudSavedAt: cloudChecked
        ? (cloud.exists ? (cloud.lastModified || null) : null)
        : (state.cloudSavedAt || null),
      server: davPaths().server,
      remotePath: davPaths().label
    };
  }

  /* ---- 桥消息受理（站点 → 脚本）：四项校验 + 固定方法 + 固定域名 ---- */
  async function dispatchBridgeMethod(method, payload) {
    const safe = (payload && typeof payload === 'object') ? payload : {};
    switch (method) {
      case 'ping': return { ok: true, installed: true, version: SCRIPT_VERSION };
      case 'status': return webdavStatus(safe);
      case 'configure': return davConfigure(safe);
      case 'clear-config': return davClearConfig();
      case 'set-auto-backup': return davSetAutoBackup(safe);
      case 'test': return davTest();
      case 'backup': return davBackup(safe.envelope, safe.signature, { localSavedAt: safe.localSavedAt, allowOverwrite: safe.allowOverwrite });
      case 'restore': return davRestore();
      default: return { ok: false, error: '未知方法，已拒绝。' };
    }
  }
  /* 已发出的回复（测试接缝 + 保证即使 postMessage 不可用也能观测结果） */
  const sentReplies = [];
  function deliverReply(id, result) {
    const payload = Object.assign({ [BRIDGE_FLAG]: true, reply: true, id }, result || {});
    sentReplies.push(payload);
    try {
      if (typeof page.postMessage === 'function') page.postMessage(payload, pageOrigin());
    } catch (error) { /* 回复失败由站点侧超时兜底 */ }
    return payload;
  }
  function handleBridgeMessage(data, reply) {
    if (!data || typeof data !== 'object') return false;
    if (data[BRIDGE_FLAG] !== true) return false;
    if (data.reply === true) return false;                     /* 不回自己的回复 */
    if (typeof data.id !== 'string' || !data.id) return false;  /* 必须有请求 id */
    if (BRIDGE_METHODS.indexOf(data.method) === -1) {
      (reply || deliverReply)(data.id, { ok: false, error: '未知方法，已拒绝。' });
      return true;
    }
    Promise.resolve()
      .then(() => dispatchBridgeMethod(data.method, data.payload))
      .then(result => { (reply || deliverReply)(data.id, result); })
      .catch(error => { (reply || deliverReply)(data.id, { ok: false, error: `桥接执行异常：${error && error.message ? error.message : error}` }); });
    return true;
  }
  /* 消息来源必须是本窗口：真实浏览器里 `event.source === unsafeWindow`（页面真实 window）；
   * 沙箱内的 `window` 作为第二比对。某些管理器/环境不提供 source，此时交给下面的
   * origin 校验兜底（source 缺失不等于来源可信，只是本项无法判定）。 */
  function isSameWindow(source) {
    if (!source) return true;
    if (source === page) return true;
    try { if (source === window) return true; } catch (error) { /* 忽略 */ }
    return false;
  }
  /* 消息入口：四项校验——命名空间前缀、请求 id、source 必须是本窗口、
   * origin 必须是本页面 origin（防其它窗口/页面伪造与开放代理）。 */
  function onBridgeMessage(event) {
    try {
      if (!event || !event.data) return;
      if (!isSameWindow(event.source)) return;
      const expected = pageOrigin();
      if (expected && event.origin && event.origin !== expected) return;
      handleBridgeMessage(event.data, deliverReply);
    } catch (error) { /* 任何异常都不得影响页面 */ }
  }
  function installBridge() {
    try { window.addEventListener('message', onBridgeMessage); } catch (error) { /* 挂不上不影响面板 */ }
  }

  /* ===================== 浮动面板（轻量、默认收起、不遮挡学习内容） ===================== */
  const CSS_PREFIX = 'odin-gm-check';
  const PANEL_STYLE_ID = 'odin-gm-check-style';
  /* 面板配色刻意独立于站点 30 套主题（固定深灰蓝底、高对比文字）：验证工具在任何主题下
   * 都可读，且不注入站点 token 造成观感耦合。 */
  const PANEL_CSS = `
.${CSS_PREFIX}-pill{position:fixed;left:12px;bottom:12px;z-index:2147483000;display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#232a3b;color:#e8ecf5;border:1px solid #3d4663;border-radius:999px;font:600 12px/1.4 system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 10px rgba(10,14,24,.35);user-select:none}
.${CSS_PREFIX}-pill:hover{border-color:#6f7ea8}
.${CSS_PREFIX}-panel{position:fixed;left:12px;bottom:12px;z-index:2147483000;width:296px;max-width:calc(100vw - 24px);padding:12px;background:#232a3b;color:#e8ecf5;border:1px solid #3d4663;border-radius:12px;font:12px/1.6 system-ui,sans-serif;box-shadow:0 8px 28px rgba(10,14,24,.45)}
.${CSS_PREFIX}-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}
.${CSS_PREFIX}-title{font-weight:700;font-size:13px}
.${CSS_PREFIX}-collapse{background:transparent;border:1px solid #3d4663;color:#aab4d0;border-radius:6px;padding:2px 8px;cursor:pointer;font:inherit}
.${CSS_PREFIX}-meta{color:#aab4d0;margin:2px 0;word-break:break-all}
.${CSS_PREFIX}-summary{color:#d7def0;margin:2px 0 8px;word-break:break-all}
.${CSS_PREFIX}-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}
.${CSS_PREFIX}-btn{flex:1 1 auto;min-height:30px;padding:5px 8px;background:#2f3950;color:#e8ecf5;border:1px solid #4a5678;border-radius:8px;cursor:pointer;font:600 12px/1.3 system-ui,sans-serif}
.${CSS_PREFIX}-btn:hover{background:#39445f}
.${CSS_PREFIX}-btn-danger{background:#5a3346;border-color:#8a4a63}
.${CSS_PREFIX}-btn-danger:hover{background:#6d3d54}
.${CSS_PREFIX}-btn-quiet{background:transparent;border-color:#3d4663;color:#aab4d0;font-weight:400}
.${CSS_PREFIX}-status{margin-top:6px;padding:6px 8px;border-radius:8px;background:#1c2231;border:1px solid #3d4663;color:#d7def0;word-break:break-all;white-space:pre-wrap}
.${CSS_PREFIX}-status-ok{border-color:#3f7b58;color:#a8dcc0}
.${CSS_PREFIX}-status-err{border-color:#a4483c;color:#f0b8ae}
.${CSS_PREFIX}-status-warn{border-color:#a8842c;color:#ecd08a}
.${CSS_PREFIX}-note{margin-top:8px;color:#8b96b5;font-size:11px;line-height:1.5}
.${CSS_PREFIX}-hidden{display:none}
.${CSS_PREFIX}-file{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
`;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function buildPanel() {
    if (document.getElementById(PANEL_STYLE_ID)) return;
    const style = el('style');
    style.id = PANEL_STYLE_ID;
    style.textContent = PANEL_CSS;
    (document.head || document.documentElement).append(style);

    /* 收起态：左下角小胶囊 */
    const pill = el('div', `${CSS_PREFIX}-pill`, `🌿 云同步 v${SCRIPT_VERSION}`);
    pill.title = 'Odin 云同步 / GM storage 面板（点击展开）';

    /* 展开态面板 */
    const panel = el('div', `${CSS_PREFIX}-panel ${CSS_PREFIX}-hidden`);
    const head = el('div', `${CSS_PREFIX}-head`);
    head.append(el('span', `${CSS_PREFIX}-title`, 'Odin 云同步 · GM storage'));
    const collapse = el('button', `${CSS_PREFIX}-collapse`, '收起');
    head.append(collapse);
    panel.append(head);

    const metaLine = el('p', `${CSS_PREFIX}-meta`, '读取中…');
    const summaryLine = el('p', `${CSS_PREFIX}-summary`, '');
    panel.append(metaLine, summaryLine);

    const rowMain = el('div', `${CSS_PREFIX}-row`);
    const btnSave = el('button', `${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-save`, '保存到油猴');
    const btnRestore = el('button', `${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-restore`, '从油猴恢复');
    rowMain.append(btnSave, btnRestore);
    const rowFile = el('div', `${CSS_PREFIX}-row`);
    const btnExport = el('button', `${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-export`, '导出 JSON');
    const btnImport = el('button', `${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-import`, '导入 JSON');
    rowFile.append(btnExport, btnImport);
    const rowConfirm = el('div', `${CSS_PREFIX}-row ${CSS_PREFIX}-hidden`);
    const btnConfirmYes = el('button', `${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-danger ${CSS_PREFIX}-btn-confirm-yes`, '确认恢复（覆盖当前页面数据）');
    const btnConfirmNo = el('button', `${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-confirm-no`, '取消');
    rowConfirm.append(btnConfirmYes, btnConfirmNo);
    const rowUtil = el('div', `${CSS_PREFIX}-row`);
    const btnRollback = el('button', `${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-quiet ${CSS_PREFIX}-btn-rollback`, '回滚到恢复点');
    const btnReload = el('button', `${CSS_PREFIX}-btn ${CSS_PREFIX}-btn-quiet ${CSS_PREFIX}-btn-reload ${CSS_PREFIX}-hidden`, '刷新页面');
    rowUtil.append(btnRollback, btnReload);
    panel.append(rowMain, rowFile, rowConfirm, rowUtil);

    const fileInput = el('input', `${CSS_PREFIX}-file`);
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';
    panel.append(fileInput);

    const statusLine = el('div', `${CSS_PREFIX}-status`, '就绪。云同步请在站点「设置 → 云同步（坚果云）」里配置；本面板负责本机搬运 —— 两条通道都在本机或你自己的网盘之间。');
    panel.append(statusLine);
    panel.append(el('p', `${CSS_PREFIX}-note`, '边界：云同步把档案存进你自己的坚果云（网络请求只发往 dav.jianguoyun.com，凭据只存油猴存储）。「从油猴恢复」永远需要你在本面板两段确认，页面加载时不会静默覆盖任何数据。iOS 通道的连通性需真机实测。'));

    document.body.append(pill, panel);

    /* ---------- 状态行 ---------- */
    function setStatus(kind, text) {
      statusLine.className = `${CSS_PREFIX}-status` + (kind === 'ok' ? ` ${CSS_PREFIX}-status-ok` : kind === 'err' ? ` ${CSS_PREFIX}-status-err` : kind === 'warn' ? ` ${CSS_PREFIX}-status-warn` : '');
      statusLine.textContent = text;
    }
    function refreshInfo() {
      const info = getGmInfo();
      if (!info.ok && !info.empty) {
        metaLine.textContent = info.metaText || '油猴存档：不可用';
        summaryLine.textContent = '';
        setStatus('err', info.error || '油猴存档不可用。');
        return info;
      }
      metaLine.textContent = info.metaText || '油猴存档：无';
      summaryLine.textContent = info.summary ? `存档内容：${summaryText(info.summary)}` : (info.empty ? '存档内容：（数据为空）' : '');
      const point = getRestorePointInfo();
      btnRollback.textContent = point && point.ok && point.savedAt
        ? `回滚到恢复点（${String(point.savedAt).replace('T', ' ').slice(0, 19)}）`
        : '回滚到恢复点（无）';
      btnRollback.disabled = !(point && point.ok && point.savedAt);
      return info;
    }

    /* ---------- 展开 / 收起 ---------- */
    pill.addEventListener('click', () => {
      panel.classList.remove(`${CSS_PREFIX}-hidden`);
      pill.classList.add(`${CSS_PREFIX}-hidden`);
      refreshInfo();
    });
    collapse.addEventListener('click', () => {
      panel.classList.add(`${CSS_PREFIX}-hidden`);
      pill.classList.remove(`${CSS_PREFIX}-hidden`);
    });

    /* ---------- 两段确认状态机：恢复 / 回滚都必须先点入口、再点确认 ---------- */
    let pendingAction = null;   // { kind:'restore'|'rollback' }
    function enterConfirm(kind, describe) {
      pendingAction = { kind };
      rowMain.classList.add(`${CSS_PREFIX}-hidden`);
      rowFile.classList.add(`${CSS_PREFIX}-hidden`);
      rowConfirm.classList.remove(`${CSS_PREFIX}-hidden`);
      setStatus('warn', `第二段确认：${describe}\n点「确认恢复」才会覆盖当前页面数据；点「取消」什么都不改。`);
    }
    function exitConfirm() {
      pendingAction = null;
      rowConfirm.classList.add(`${CSS_PREFIX}-hidden`);
      rowMain.classList.remove(`${CSS_PREFIX}-hidden`);
      rowFile.classList.remove(`${CSS_PREFIX}-hidden`);
    }
    btnRestore.addEventListener('click', () => {
      const info = refreshInfo();
      if (info.empty) { setStatus('warn', '油猴存储里没有档案（数据为空），请先「保存到油猴」或「导入 JSON」。'); return; }
      if (!info.ok) { setStatus('err', info.error || '油猴存档不可用，恢复已拒绝。'); return; }
      enterConfirm('restore', `将用油猴存档覆盖当前页面学习数据。\n存档：${summaryText(info.summary)}`);
    });
    btnRollback.addEventListener('click', () => {
      const point = getRestorePointInfo();
      if (!point || !point.ok || !point.savedAt) { setStatus('warn', '没有可用的恢复点（数据为空）。恢复点在每次「从油猴恢复」前自动生成。'); return; }
      enterConfirm('rollback', `将回滚到最近一次恢复（${String(point.savedAt).replace('T', ' ').slice(0, 19)}）之前的页面数据。\n恢复点：${summaryText(point.summary)}`);
    });
    btnConfirmNo.addEventListener('click', () => { exitConfirm(); setStatus('', '已取消，没有修改任何数据。'); });
    btnConfirmYes.addEventListener('click', () => {
      const kind = pendingAction ? pendingAction.kind : null;
      exitConfirm();
      if (kind === 'restore') {
        const result = restoreFromGm();
        reportWriteResult('从油猴恢复', result);
      } else if (kind === 'rollback') {
        const result = restoreFromRestorePoint();
        reportWriteResult('回滚到恢复点', result);
      }
      refreshInfo();
    });

    function reportWriteResult(label, result) {
      if (result && result.ok) {
        setStatus('ok', `${label}成功 ✅\n当前页面数据：${summaryText(result.summary)}\n站点备份：${result.siteBackup || '未执行'} · GM 恢复点：${result.gmRestorePoint ? '已存' : '失败'}\n刷新链路：storage 事件${result.dispatched ? '已派发，页面已就地更新' : '派发失败'}。`);
      } else if (result && result.needsReload) {
        btnReload.classList.remove(`${CSS_PREFIX}-hidden`);
        setStatus('err', `${label}未完成 ⚠️\n${result.error}`);
      } else {
        setStatus('err', `${label}失败 ❌（当前学习数据未被修改）\n${(result && result.error) || '未知错误'}`);
      }
    }

    /* ---------- 保存 / 导出 / 导入 ---------- */
    btnSave.addEventListener('click', () => {
      const result = saveToGm();
      if (result.ok) {
        setStatus('ok', `保存到油猴成功 ✅（已回读比对 ${result.comparedFields.length} 个关键字段：XP/等级/完成课数/叶片/成就/累计时长/昵称，全部一致）\n${summaryText(result.summary)}${result.warnings && result.warnings.length ? `\n宽容校验告警：${result.warnings.join('；')}` : ''}`);
      } else if (result.empty) {
        setStatus('warn', result.error);
      } else {
        setStatus('err', `保存到油猴失败 ❌\n${result.error}`);
      }
      refreshInfo();
    });
    btnExport.addEventListener('click', () => {
      const result = exportJson();
      if (result.ok && result.downloaded) setStatus('ok', `导出 JSON 成功 ✅\n文件：${result.filename}（${result.text.length} 字符）\n来源：${result.source}\n该文件与本站设置页导出的档案同格式，可人工传到另一台电脑后「导入 JSON」。`);
      else if (result.ok) setStatus('warn', result.error);
      else if (result.empty) setStatus('warn', result.error);
      else setStatus('err', `导出 JSON 失败 ❌\n${result.error}`);
    });
    btnImport.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      const reader = new (page.FileReader || FileReader)();
      reader.addEventListener('load', () => {
        const result = importJsonText(String(reader.result || ''), file.name);
        if (result.ok) setStatus('ok', `导入 JSON 成功 ✅（已通过站点严格校验 + 敏感字段检查，已写入油猴存储）\n${summaryText(result.summary)}\n${result.metaText}\n注意：还没有写回页面——确认无误后点「从油猴恢复」。`);
        else if (result.empty) setStatus('warn', result.error);
        else setStatus('err', `导入 JSON 被拒绝 ❌（油猴存储与页面数据都未修改）\n${result.error}`);
        fileInput.value = '';
        refreshInfo();
      });
      reader.addEventListener('error', () => {
        setStatus('err', '文件读取失败 ❌（数据未修改）');
        fileInput.value = '';
      });
      try { reader.readAsText(file); } catch (error) {
        setStatus('err', `文件读取失败 ❌：${error && error.message ? error.message : error}`);
      }
    });
    btnReload.addEventListener('click', () => { try { page.location.reload(); } catch (error) { setStatus('err', '自动刷新失败，请手动按 F5。'); } });

    refreshInfo();
  }

  /* ===================== 启动与测试接缝 ===================== */
  const Api = {
    version: SCRIPT_VERSION,
    /* 面板通道 */
    saveToGm, getGmInfo, restoreFromGm, restoreFromRestorePoint, getRestorePointInfo,
    buildExportPayload, exportJson, importJsonText, notifyPageRefresh,
    validateLenient, validateStrict, summarize, summaryText,
    /* WebDAV 桥通道 */
    bridgeMethods: BRIDGE_METHODS.slice(),
    handleBridgeMessage, onBridgeMessage, dispatchBridgeMethod, deliverReply, sentReplies,
    webdavStatus, davTest, davConfigure, davClearConfig, davSetAutoBackup, davBackup, davRestore,
    davCloudTimestamp, evaluateCloudGuard,
    readWebdavConfig, readWebdavState, maskAccount, describeStatus, base64, davPaths,
    WEBDAV_BASE, WEBDAV_DIR, WEBDAV_FILE, WEBDAV_FORMAT, WEBDAV_COMPAT_FORMATS: WEBDAV_COMPAT_FORMATS.slice()
  };

  function boot() {
    installBridge();
    try { buildPanel(); } catch (error) {
      /* 面板挂载失败不影响页面本身；在控制台留下明确线索 */
      if (typeof console !== 'undefined' && console.warn) console.warn('[odin-cloud-sync] 验证面板挂载失败：', error);
    }
  }
  if (document.body) boot();
  else document.addEventListener('DOMContentLoaded', boot);

  /* Node 测试接缝：真实浏览器 / Tampermonkey 里 module 不存在，此导出永不生效。
   * tests/userscript-gm-sync.test.cjs 与 tests/userscript-webdav-bridge.test.cjs 用它驱动核心动作。 */
  if (typeof module !== 'undefined' && module && module.exports) module.exports = Api;
})();
