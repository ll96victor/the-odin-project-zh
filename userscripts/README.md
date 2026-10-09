# userscripts/ — 站点官方伴随油猴脚本

本目录存放 Odin 中文学习站的**官方伴随油猴脚本**。站点本身仍是零依赖纯静态页（AGENTS.md 红线 1/2）——不装脚本时站点功能完全不减，云同步只是一项**可选能力**。v4.11.44 起本目录进入公开仓白名单，用户可直接从公开站安装。

## odin-cloud-sync.user.js（v1.1.1）

**用途**（两部分）：

1. **WebDAV 同步桥（headless，v1.1.0 新增）**：站点「个人中心 → 设置 → 云同步（坚果云）」区块通过 `window.postMessage` 调用它，把学习档案存进**你自己的**坚果云账号、换设备一键取回。真正的网络请求全部发生在脚本层。
2. **GM storage 面板（v1.0.x 起保留）**：验证 / 应急通道——把档案在本机 localStorage ⇄ 油猴 GM storage ⇄ JSON 文件之间搬运（原 `odin-gm-sync-check.user.js` 的全部功能）。默认收起为左下角小胶囊，不影响学习。

**前身**：`odin-gm-sync-check.user.js`（v1.0.0 / v1.0.1，开发阶段验证工具）。v1.1.0 把它升级并重命名为 `odin-cloud-sync.user.js`：面板功能全保留，新增 WebDAV 桥。用户只需安装这一个脚本。

### 网络边界（v1.1.0 变更，务必知悉）

| 层 | 网络行为 |
|---|---|
| 站点代码（页面里的 JS） | **零网络请求**——`fetch` / `XMLHttpRequest` 零出现（源码扫描钉住）。站点也不保存任何凭据。 |
| 本脚本 | 只在**你主动配置并使用云同步**时，向**唯一白名单域名 `dav.jianguoyun.com`** 发 WebDAV 请求（`MKCOL` / `PROPFIND` / `PUT` / `GET`）。不加载任何远程脚本、字体或第三方接口，不向任何其他域名发请求。 |

> v1.0.x 头部曾写「本脚本零网络请求」。v1.1.0 起这句话**不再成立**——新增的 WebDAV 桥是显式的网络能力。依据用户 2026-10-09 的显式授权变更，不静默突破。

### 凭据边界

- 坚果云**账号邮箱 + 第三方应用密码**只经页面 `postMessage` 交给本脚本，写入**油猴自己的存储**（Tampermonkey 自有存储，位于本机浏览器 profile）。
- **站点存储（localStorage）永不出现凭据字段**；站点 UI 只回显账号掩码，**永不回显密码**。
- 面板与配置区都引导你使用坚果云「**第三方应用密码**」（账户信息 → 安全选项 → 第三方应用管理），它可随时单独吊销、不是登录密码。
- ⚠️ **如实披露**：应用密码以明文形式保存在本机油猴存储里（业界同做法：Tampermonkey 内建同步、legado 等均如此）。任何能读你浏览器 profile 的人/程序都能拿到它——所以请用**专用、可吊销**的应用密码，别用主账号登录密码。

### 匹配与权限

| 项 | 值 | 理由 |
|---|---|---|
| `@match` ① | `http://127.0.0.1/*` | 本地开发服务的环回地址（match pattern 不含端口 = 任意端口）。刻意不匹配 `localhost`（与本站存储不同源）。 |
| `@match` ② | `https://ll96victor.github.io/the-odin-project-zh/*` | 公开仓 GitHub Pages 的**项目路径**通配（覆盖首页与 `lesson.html?id=…`）。不匹配该站根路径、不匹配任何其他域名。 |
| `@grant GM_setValue` / `GM_getValue` | 档案信封 / 恢复点 / 云同步配置与节流状态写入油猴存储 | 核心能力 |
| `@grant GM_xmlhttpRequest` | WebDAV 请求（v1.1.0 新增） | 绕开浏览器 CORS（坚果云 WebDAV 不返回 `Access-Control-Allow-Origin`，页面内 `fetch` 物理不可行） |
| `@grant unsafeWindow` | 访问页面 `ODIN_PROGRESS` / `ODIN_GUIDE` / `ODIN_VERSION`（复用站点 sanitize 规则）与派发 `storage` 事件 | 面板通道；**WebDAV 桥不依赖它**（桥只走 postMessage，兼容更多脚本管理器） |
| `@connect dav.jianguoyun.com` | GM_xmlhttpRequest 的单域白名单 | 只允许这一个域名，绝不用全网通配 |

### 覆盖安全（v1.1.1 起，务必知悉）

**每次 PUT 之前，脚本都会现场 `PROPFIND` 一次云端文件**，把「读云端最新状态 → 与本机最近一次写档时间比较 → 决定是否覆盖」收口到紧邻写入的位置。判断依据**永远不是**站点打开设置页时的缓存——缓存可能已被另一台设备的新档案作废，只信缓存就是「用旧档案覆盖新档案」。

| 复查结果 | 行为 |
|---|---|
| 云端比本机新（另一台设备刚备份过） | **不 PUT**。自动备份跳过并告警；手动备份由站点弹出页面内二次确认，你点了「确认覆盖云端」才带授权重试 |
| 云端没有文件 | 正常 PUT（首次备份） |
| **读不到云端**（网络不可达 / 超时 / 429 / 其它非 2xx / 文件在但时间戳读不出） | **不 PUT**，并如实说明原因。**不把「读不到云端」当成「云端不存在」**；这种停止**不可被覆盖授权绕过**（429 与网络失败不得为了「继续备份」而绕过检查） |

同一次离开页面（`visibilitychange` 转 hidden 与 `pagehide` 先后触发）只跑一条「检查 + PUT」链路，不会并发两套。

### 远端文件布局

`https://dav.jianguoyun.com/dav/Odin学习站/odin-progress.json`（子目录 `Odin学习站`，MKCOL 幂等创建；坚果云不支持根目录建文件）。只维护**一份当前档**，不做云端多版本轮替——坚果云自带文件历史与回收站兜底，站点侧另有 5 份本地备份轮替，脚本内另有 GM 恢复点。

信封：`format: 'odin-webdav-sync'` / `envelopeVersion` / `savedAt`（ISO）/ `app` 与 `productVersion` / `schemaVersion` 与 `rawSchemaVersion` / `data`（档案原文逐字节）。恢复侧**兼容读旧 `odin-gm-sync-check` 信封**。

### 安装（三端通道）

| 平台 | 做法 |
|---|---|
| 桌面 Chrome / Edge / Firefox | 装 Tampermonkey → 打开脚本文件（或从公开站下载）→ 确认安装。 |
| Android | Firefox（或 Kiwi）浏览器 + Tampermonkey 扩展，把脚本文件传到手机后打开安装，或走 Tampermonkey「实用工具 → 导入」。 |
| iOS / iPadOS | Safari 上装 **Tampermonkey iOS 版**（App Store，iOS 15+），或 **Stay** / **Userscripts** 等支持 `GM_xmlhttpRequest` 的用户脚本管理器。⚠️ **iOS 通道的坚果云 WebDAV 真实连通性未经本站实机验证**，属 `Ready for Human Verification`——装上脚本不等于云同步一定能用，需真机实测。 |

### 验证状态

| 链路 | 状态 |
|---|---|
| GM 面板：localStorage → GM → localStorage（两段确认 + 双恢复点 + 就地刷新） | ✅ Node 已验证（`tests/userscript-gm-sync.test.cjs`） |
| WebDAV 桥：postMessage 协议 / 凭据与配置存储 / MKCOL·PROPFIND·PUT·GET 构造 / 401·403·404·429·网络错误分支 / 非白名单域拒绝 | ✅ Node 已验证（`tests/userscript-webdav-bridge.test.cjs`，mock `GM_xmlhttpRequest`） |
| **写入前实时复查云端**：缓存之后云端被更新 → 不发 PUT；显式授权才覆盖；云端更旧 / 无文件正常放行；429·网络·超时·非 2xx·时间戳读不出一律停止且不可被授权绕过 | ✅ Node 已验证（同上 G/G2 组）+ ✅ 真实浏览器已验证（独立端口，真实脚本 + 模拟坚果云：确认覆盖 PUT 1 次带授权 / 取消 PUT 0 次 / 读不到云端 PUT 0 次） |
| 站点侧云同步纯逻辑（桥探测 / 信封 / 节流 / 时间戳对比 / 手动备份决策 / 页面内两段确认） | ✅ Node 已验证（`tests/cloud-sync.test.cjs`）+ ✅ 真实浏览器已验证（同一次离开只发一次 PUT） |
| 真实坚果云账号下的跨设备互通（桌面 ↔ Android） | ⏳ **Ready for Human Verification**（需用户真机，用你自己的账号） |
| 真实坚果云能返回 `DAV:getlastmodified` | ⏳ **Ready for Human Verification**。复查依赖它取云端时间戳；若真机读不出，脚本会**保守停止备份并给出中文原因**（不会覆盖云端）。RFC 4918 规定 `DAV:getlastmodified` 是必需的 live property，仍以真机为准 |
| iOS 通道连通性 | ⏳ **Ready for Human Verification**（Tampermonkey iOS / Stay / Userscripts 任选一） |
| 自动备份在真实使用一天后成功 | ⏳ **Ready for Human Verification** |

### 维护约定

- 行为门禁：改脚本必须跑 `tests/userscript-gm-sync.test.cjs` + `tests/userscript-webdav-bridge.test.cjs` + `node --check`；全量命令见根目录 AGENTS.md。
- 版本：`@version` 是唯一权威版本号，每次修改递增并在头部「更新日志」块补一条（全局脚本规范）。
- `@match` 白名单只有两条、`@connect` 只有一条、`@grant` 逐项在源码里注明用途；测试以清单级断言钉住：多一条、少一条、出现站点根通配或全网通配都会红。
- 回滚 / 卸载：直接在脚本管理器卸载即可（GM 数据随脚本删除）；站点 localStorage 数据与站点备份体系完全不受影响。云同步配置与凭据也随脚本删除而消失。
