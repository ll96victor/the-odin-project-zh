/* 默认头像（v4，交接 §2.2）。
 * 全部为本站原创的几何 / Web / 代码 / 终端 / 小机器人 / 抽象小动物图标，
 * 不复制任何第三方产品角色，不使用受版权保护的头像，也不引用任何远程资源。
 *
 * 为什么把 SVG 源码放在数据文件里、并且用 data URL 放进 <img> 渲染：
 * 1. 上传头像本来就要存成 data URL，默认头像走同一条渲染路径，代码只有一套；
 * 2. 放进 <img> 的 SVG 是惰性的，浏览器不会执行其中的脚本，比注入标记更安全，
 *    也避开了本项目“运行时不得用字符串直接注入标记”的约束；
 * 3. file:// 直接双击打开时不需要额外请求文件，离线照样显示。
 *
 * 本清单的 defaultAvatarId（'terminal'）是**几何头像清单内部**的回落默认；
 * v4.8 起产品级默认头像是 progress.js 的 DEFAULT_AVATAR_ID='companion-nono'
 * （companion-<stableId> 命名空间，由 companion-view 渲染期解析成 nono 的正式
 * icon，不在本清单里）。tests/profile.test.cjs 断言两层默认口径，避免漂移。
 *
 * v4.9：'terminal' 作为「v4.8 之前的旧产品默认头像」已进退役名单——
 * 声明处**不在这里**，在 companion-registry.js 的 retiredAvatarIds（与
 * legacyCompanionNames 同处一组，见那里的说明），progress.normalizeAvatarId
 * 把老档案里存的 'terminal' 读成当前的 DEFAULT_AVATAR_ID。本清单仍保留它作为
 * 几何回落默认与可选头像数据，不删除任何资产。 */
window.ODIN_AVATARS = {
  version: 1,
  defaultAvatarId: 'terminal',
  /* 渲染时统一用这个前缀把 SVG 源码变成 data URL */
  dataUrlPrefix: 'data:image/svg+xml;charset=utf-8,',
  license: '本站原创几何图标，随本项目内容采用 CC BY-NC-SA 4.0；未使用任何第三方角色或受版权保护的形象。',
  avatars: [
    {
      id: 'terminal',
      unlock: { kind: 'default' },
      zh: '终端提示符',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#24262e"/><path d="M16 22l9 8-9 8" fill="none" stroke="#c6c5ce" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M31 40h16" stroke="#c6c5ce" stroke-width="4" stroke-linecap="round"/></svg>'
    },
    {
      id: 'code',
      unlock: { kind: 'default' },
      zh: '尖括号与斜杠',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#eeece8"/><path d="M24 20L12 32l12 12M40 20l12 12-12 12" fill="none" stroke="#494c5a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M35 17l-6 30" stroke="#a4553f" stroke-width="4" stroke-linecap="round"/></svg>'
    },
    {
      id: 'browser',
      unlock: { kind: 'default' },
      zh: '浏览器窗口',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#fafbf9"/><rect x="10" y="14" width="44" height="36" rx="5" fill="none" stroke="#2f3138" stroke-width="3"/><path d="M10 25h44" stroke="#2f3138" stroke-width="3"/><circle cx="16.5" cy="19.5" r="2" fill="#a4553f"/><circle cx="23.5" cy="19.5" r="2" fill="#494c5a"/><rect x="16" y="31" width="32" height="4" rx="2" fill="#d5d3ce"/><rect x="16" y="39" width="20" height="4" rx="2" fill="#d5d3ce"/></svg>'
    },
    {
      id: 'branch',
      unlock: { kind: 'default' },
      zh: 'Git 分支',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#eeece8"/><path d="M20 16v32" stroke="#494c5a" stroke-width="4" stroke-linecap="round"/><path d="M20 36c12 0 10-14 22-14" fill="none" stroke="#494c5a" stroke-width="4" stroke-linecap="round"/><circle cx="20" cy="16" r="6" fill="#fafbf9" stroke="#2f3138" stroke-width="3"/><circle cx="20" cy="48" r="6" fill="#fafbf9" stroke="#2f3138" stroke-width="3"/><circle cx="44" cy="22" r="6" fill="#a4553f"/></svg>'
    },
    {
      id: 'robot',
      unlock: { kind: 'default' },
      zh: '小机器人',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#fafbf9"/><path d="M32 11v7" stroke="#2f3138" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="9" r="3.5" fill="#a4553f"/><rect x="14" y="18" width="36" height="30" rx="8" fill="#eeece8" stroke="#2f3138" stroke-width="3"/><circle cx="25" cy="31" r="4" fill="#494c5a"/><circle cx="39" cy="31" r="4" fill="#494c5a"/><path d="M26 41h12" stroke="#2f3138" stroke-width="3" stroke-linecap="round"/><path d="M9 27v12M55 27v12" stroke="#2f3138" stroke-width="3" stroke-linecap="round"/></svg>'
    },
    {
      id: 'fox',
      unlock: { kind: 'default' },
      zh: '几何小狐',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#eeece8"/><path d="M13 13l17 8-3 12z" fill="#a4553f"/><path d="M51 13L34 21l3 12z" fill="#a4553f"/><path d="M32 20c11 0 19 8 19 18s-8 16-19 16-19-6-19-16 8-18 19-18z" fill="#c9714f"/><circle cx="25" cy="36" r="3" fill="#2f3138"/><circle cx="39" cy="36" r="3" fill="#2f3138"/><path d="M32 43l-4 5h8z" fill="#2f3138"/></svg>'
    },
    {
      id: 'owl',
      unlock: { kind: 'default' },
      zh: '夜读猫头鹰',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#24262e"/><path d="M15 22l7-10 3 10zM49 22l-7-10-3 10z" fill="#c6c5ce"/><circle cx="32" cy="36" r="19" fill="#eeece8"/><circle cx="25" cy="32" r="6.5" fill="#fafbf9" stroke="#2f3138" stroke-width="2.5"/><circle cx="39" cy="32" r="6.5" fill="#fafbf9" stroke="#2f3138" stroke-width="2.5"/><circle cx="25" cy="32" r="2.5" fill="#2f3138"/><circle cx="39" cy="32" r="2.5" fill="#2f3138"/><path d="M32 39l-4 6h8z" fill="#a4553f"/></svg>'
    },
    {
      id: 'spark',
      unlock: { kind: 'default' },
      zh: '四角星火花',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#494c5a"/><path d="M32 8l6 18 18 6-18 6-6 18-6-18-18-6 18-6z" fill="#fafbf9"/><circle cx="32" cy="32" r="4" fill="#a4553f"/></svg>'
    },
    {
      id: 'layers',
      unlock: { kind: 'default' },
      zh: '层叠方块',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#fafbf9"/><path d="M32 11l20 10-20 10-20-10z" fill="#494c5a"/><path d="M12 31l20 10 20-10" fill="none" stroke="#8d8e98" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M12 42l20 10 20-10" fill="none" stroke="#a4553f" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/></svg>'
    },
    {
      id: 'compass',
      unlock: { kind: 'default' },
      zh: '指南针',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#eeece8"/><circle cx="32" cy="32" r="20" fill="none" stroke="#2f3138" stroke-width="3"/><path d="M41 23l-5 13-13 5 5-13z" fill="#a4553f"/><circle cx="32" cy="32" r="2.5" fill="#2f3138"/></svg>'
    },
    /* ---------- v4.3 扩充（交接 B2：默认头像至少 12 个，先给足选择再逐渐解锁） ---------- */
    {
      id: 'seed',
      unlock: { kind: 'default' },
      zh: '破土的种子',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#fafbf9"/><path d="M10 46q22-7 44 0v8H10z" fill="#8a6a4f"/><ellipse cx="32" cy="40" rx="9" ry="7" fill="#a4553f"/><path d="M32 34v-9" stroke="#494c5a" stroke-width="2.6" stroke-linecap="round"/><path d="M32 26c-5 0-7.5-3-7.5-6.5C29.5 19.5 32 22.5 32 26z" fill="#8d8e98"/><path d="M32 25c5 0 7.5-3 7.5-6.5C34.5 18.5 32 21.5 32 25z" fill="#494c5a"/></svg>'
    },
    {
      id: 'htmltag',
      unlock: { kind: 'default' },
      zh: 'HTML 标签',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#24262e"/><path d="M22 20l-9 12 9 12" fill="none" stroke="#c6c5ce" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M42 20l9 12-9 12" fill="none" stroke="#c6c5ce" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/><rect x="26" y="26" width="12" height="12" rx="2" fill="none" stroke="#a4553f" stroke-width="3"/></svg>'
    },
    {
      id: 'mushroom',
      unlock: { kind: 'default' },
      zh: '林间小菇',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#eeece8"/><path d="M14 34a18 14 0 0 1 36 0z" fill="#a4553f"/><circle cx="24" cy="27" r="3.4" fill="#fafbf9"/><circle cx="38" cy="25" r="2.6" fill="#fafbf9"/><circle cx="43" cy="31" r="2" fill="#fafbf9"/><rect x="26" y="34" width="12" height="16" rx="5" fill="#f3ead9" stroke="#2f3138" stroke-width="2"/><path d="M12 50h40" stroke="#8d8e98" stroke-width="3" stroke-linecap="round"/></svg>'
    },
    {
      id: 'lantern',
      unlock: { kind: 'default' },
      zh: '夜读小灯',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#171c2b"/><path d="M26 12h12" stroke="#d6dcf0" stroke-width="3" stroke-linecap="round"/><path d="M32 12v5" stroke="#d6dcf0" stroke-width="2.6" stroke-linecap="round"/><rect x="21" y="17" width="22" height="32" rx="7" fill="#2a3352" stroke="#7f96e8" stroke-width="2.4"/><circle cx="32" cy="33" r="7" fill="#f2d98b"/><path d="M32 26c2.6 3 4 5 4 7a4 4 0 0 1-8 0c0-2 1.4-4 4-7z" fill="#e8a94f"/><path d="M24 53h16" stroke="#d6dcf0" stroke-width="3" stroke-linecap="round"/></svg>'
    },
    /* v4.3 Batch 6（交接 H）：默认头像继续加量——基础选择越多，“免费够用”越成立 */
    {
      id: 'paperplane',
      unlock: { kind: 'default' },
      zh: '纸飞机',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#eeece8"/><path d="M10 30L54 12 38 54l-8-16z" fill="#fafbf9" stroke="#494c5a" stroke-width="2.6" stroke-linejoin="round"/><path d="M54 12L30 38" stroke="#a4553f" stroke-width="2.4" stroke-linecap="round"/><path d="M30 38l8 16" stroke="#494c5a" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>'
    },
    /* ---------- v4.2 扩充（交接 §5）：等级 / 成就解锁 ---------- */
    /* v4.5（交接 Core E2）：前 5 级每级都有可见头像奖励——Lv.2 新芽、
     * Lv.3 望远镜、Lv.5 山顶旗帜为新增（Lv.4 已有「十六进制」）。
     * 全部为本站原创几何图标，只增新 id，旧头像零改动。 */
    {
      id: 'seedling',
      zh: '新芽',
      desc: '等级达到 Lv.2 解锁',
      unlock: { kind: 'level', value: 2 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#eeece8"/><path d="M32 52V30" stroke="#494c5a" stroke-width="4" stroke-linecap="round"/><path d="M31 36c-10 0-16-6-16-14 8 0 16 4 16 14z" fill="#c6c5ce"/><path d="M33 30c0-10 6-16 14-16 0 8-4 16-14 16z" fill="#494c5a"/><ellipse cx="32" cy="53" rx="10" ry="3" fill="#d5d3ce"/></svg>'
    },
    {
      id: 'telescope',
      zh: '望远镜',
      desc: '等级达到 Lv.3 解锁',
      unlock: { kind: 'level', value: 3 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#171c2b"/><path d="M14 42L36 16l9 8-22 26z" fill="#2a3352" stroke="#7f96e8" stroke-width="2.5" stroke-linejoin="round"/><path d="M36 16l4-5 9 8-5 4z" fill="#e8a94f"/><path d="M27 36l-8 16M27 36l12 14" stroke="#d6dcf0" stroke-width="2.6" stroke-linecap="round"/><circle cx="50" cy="13" r="2.6" fill="#f2d98b"/><circle cx="55" cy="24" r="1.7" fill="#d6dcf0"/><circle cx="12" cy="16" r="1.7" fill="#7f96e8"/></svg>'
    },
    {
      id: 'hex',
      zh: '十六进制',
      desc: '等级达到 Lv.4 解锁',
      unlock: { kind: 'level', value: 4 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#eeece8"/><path d="M22 16L12 32l10 16h20l10-16-10-16z" fill="none" stroke="#494c5a" stroke-width="3.5" stroke-linejoin="round"/><path d="M25 30v8l5 3 5-3v-8l-5-3z" fill="#a4553f"/></svg>'
    },
    {
      id: 'summit',
      zh: '山顶旗帜',
      desc: '等级达到 Lv.5 解锁',
      unlock: { kind: 'level', value: 5 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#fafbf9"/><path d="M6 52L26 20l12 18 6-8 12 22z" fill="#494c5a"/><path d="M26 20l-6.5 10.5h13z" fill="#eeece8"/><path d="M26 21V7" stroke="#2f3138" stroke-width="3" stroke-linecap="round"/><path d="M27.5 8h13l-3.5 4.5 3.5 4.5h-13z" fill="#a4553f"/><circle cx="45" cy="14" r="4" fill="#c6c5ce"/></svg>'
    },
    {
      id: 'keyboard',
      zh: '机械键盘',
      desc: '等级达到 Lv.6 解锁',
      unlock: { kind: 'level', value: 6 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#24262e"/><rect x="10" y="18" width="44" height="28" rx="4" fill="none" stroke="#c6c5ce" stroke-width="2.5"/><path d="M16 24h4M24 24h4M32 24h4M40 24h4M16 30h4M24 30h4M32 30h4M40 30h4M16 36h4M24 36h4M32 36h12" stroke="#c6c5ce" stroke-width="2.5" stroke-linecap="round"/></svg>'
    },
    {
      id: 'server',
      zh: '服务器机柜',
      desc: '等级达到 Lv.12 解锁',
      unlock: { kind: 'level', value: 12 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#eeece8"/><rect x="16" y="12" width="32" height="12" rx="2" fill="none" stroke="#2f3138" stroke-width="2.5"/><rect x="16" y="27" width="32" height="12" rx="2" fill="none" stroke="#2f3138" stroke-width="2.5"/><rect x="16" y="42" width="32" height="12" rx="2" fill="none" stroke="#2f3138" stroke-width="2.5"/><circle cx="22" cy="18" r="2" fill="#494c5a"/><circle cx="22" cy="33" r="2" fill="#a4553f"/><circle cx="22" cy="48" r="2" fill="#494c5a"/><path d="M40 18h2M40 33h2M40 48h2" stroke="#2f3138" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    /* v4.3 Batch 6（交接 H）：高等级纪念头像 */
    {
      id: 'chip',
      zh: '芯片',
      desc: '等级达到 Lv.15 解锁',
      unlock: { kind: 'level', value: 15 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#24262e"/><rect x="18" y="18" width="28" height="28" rx="4" fill="none" stroke="#c6c5ce" stroke-width="2.6"/><rect x="26" y="26" width="12" height="12" rx="2" fill="#a4553f"/><path d="M24 18v-6M32 18v-6M40 18v-6M24 52v-6M32 52v-6M40 52v-6M18 24h-6M18 32h-6M18 40h-6M52 24h-6M52 32h-6M52 40h-6" stroke="#c6c5ce" stroke-width="2.4" stroke-linecap="round"/></svg>'
    },
    {
      id: 'flame',
      zh: '不灭火苗',
      desc: '连续学习 7 天解锁',
      unlock: { kind: 'achievement', value: 'streak-7' },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#fafbf9"/><path d="M32 8c4 8 12 12 12 24a12 12 0 0 1-24 0C20 22 28 18 26 12c3 2 5 5 6 8 1-4 0-8 0-12z" fill="#a4553f"/><path d="M32 34c3 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9z" fill="#eeece8"/></svg>'
    },
    {
      id: 'trophy',
      zh: '奖杯',
      desc: '完成 10 课解锁',
      unlock: { kind: 'achievement', value: 'lessons-10' },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#eeece8"/><path d="M20 14h24v10a12 12 0 0 1-24 0z" fill="#a8791c"/><path d="M20 16h-6v4a8 8 0 0 0 8 8M44 16h6v4a8 8 0 0 1-8 8" fill="none" stroke="#a8791c" stroke-width="3"/><path d="M29 36h6v8h-6z" fill="#a8791c"/><rect x="22" y="44" width="20" height="6" rx="2" fill="#494c5a"/></svg>'
    },
    {
      id: 'rocket',
      zh: '小火箭',
      desc: '完成当前全部开放课程解锁',
      unlock: { kind: 'achievement', value: 'all-lessons' },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#24262e"/><path d="M32 10c8 6 12 14 12 24l-6 8h-12l-6-8c0-10 4-18 12-24z" fill="#eeece8"/><circle cx="32" cy="26" r="5" fill="#24262e" stroke="#c6c5ce" stroke-width="2"/><path d="M26 42l-8 10 10-4zM38 42l8 10-10-4z" fill="#a4553f"/><path d="M32 46v8" stroke="#a4553f" stroke-width="3" stroke-linecap="round"/></svg>'
    },
    /* v4.3 Batch 6（交接 H）：成就解锁头像——给里程碑成就配可佩戴的纪念 */
    {
      id: 'laurel',
      zh: '月桂冠',
      desc: '连续 7 天达成每日目标解锁',
      unlock: { kind: 'achievement', value: 'goal-streak-7' },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#fafbf9"/><path d="M20 14c-6 8-7 20-2 30M44 14c6 8 7 20 2 30" fill="none" stroke="#494c5a" stroke-width="2.8" stroke-linecap="round"/><path d="M20 20c-4 0-6-2-7-5 4 0 6 2 7 5zM19 30c-4 0-7-2-8-5 4 0 7 2 8 5zM19 40c-4 0-7-2-8-5 4 0 7 2 8 5zM44 20c4 0 6-2 7-5-4 0-6 2-7 5zM45 30c4 0 7-2 8-5-4 0-7 2-8 5zM45 40c4 0 7-2 8-5-4 0-7 2-8 5z" fill="#8d8e98"/><circle cx="32" cy="32" r="8" fill="#a8791c"/><path d="M28.5 32l2.5 2.5 4.5-5" stroke="#fafbf9" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    {
      id: 'crane',
      zh: '纸鹤',
      desc: '连续学习 30 天解锁',
      unlock: { kind: 'achievement', value: 'streak-30' },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#eeece8"/><path d="M8 38l22-8 10 14z" fill="#fafbf9" stroke="#2f3138" stroke-width="2.4" stroke-linejoin="round"/><path d="M30 30l14-16 4 18-8 12z" fill="#d98b5f" stroke="#2f3138" stroke-width="2.4" stroke-linejoin="round"/><path d="M44 14l12 4-8 6z" fill="#a4553f" stroke="#2f3138" stroke-width="2.2" stroke-linejoin="round"/><path d="M30 30l-4 22 14-8" fill="none" stroke="#2f3138" stroke-width="2.2" stroke-linejoin="round"/></svg>'
    },
    /* ---------- v4.2 扩充：叶片解锁 ---------- */
    /* v4.3（交接 C1/J）：低档位收藏（20–40 叶片）——完成第一课（+20 叶片）
     * 加十几分钟学习就够解锁一件，第一次使用者立刻有“叶片 → 装扮”的选择感。 */
    {
      id: 'pencil',
      zh: '铅笔头',
      desc: '20 叶片解锁',
      unlock: { kind: 'coins', value: 20 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#fafbf9"/><path d="M18 40l24-24 8 8-24 24-10 2z" fill="#e8b45f" stroke="#2f3138" stroke-width="2.4" stroke-linejoin="round"/><path d="M42 16l4-4a2.8 2.8 0 0 1 4 0l2 2a2.8 2.8 0 0 1 0 4l-4 4z" fill="#a4553f" stroke="#2f3138" stroke-width="2.2" stroke-linejoin="round"/><path d="M18 40l-2 8 8-2z" fill="#2f3138"/><path d="M38 20l8 8" stroke="#2f3138" stroke-width="2"/></svg>'
    },
    {
      id: 'acorn',
      zh: '小橡果',
      desc: '25 叶片解锁',
      unlock: { kind: 'coins', value: 25 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#fafbf9"/><path d="M20 28h24c0 12-5 20-12 20s-12-8-12-20z" fill="#c9714f"/><path d="M17 22a15 8 0 0 1 30 0v4a2 2 0 0 1-2 2H19a2 2 0 0 1-2-2z" fill="#8a6a4f"/><path d="M32 14v6" stroke="#494c5a" stroke-width="2.6" stroke-linecap="round"/><path d="M32 20c-3.5 0-5.5-2-5.5-4.5 3.5 0 5.5 2 5.5 4.5z" fill="#8d8e98"/><circle cx="27" cy="36" r="2.2" fill="#24262e"/><circle cx="37" cy="36" r="2.2" fill="#24262e"/><path d="M28 42q4 3 8 0" stroke="#24262e" stroke-width="2" stroke-linecap="round" fill="none"/></svg>'
    },
    {
      id: 'book',
      zh: '摊开的书',
      desc: '70 叶片解锁',
      unlock: { kind: 'coins', value: 70 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#fafbf9"/><path d="M32 18c-5-4-12-5-18-4v32c6-1 13 0 18 4 5-4 12-5 18-4V14c-6-1-13 0-18 4z" fill="#eeece8" stroke="#494c5a" stroke-width="2.5" stroke-linejoin="round"/><path d="M32 18v32" stroke="#494c5a" stroke-width="2.5"/><path d="M20 24h7M20 30h7M37 24h7M37 30h7" stroke="#8d8e98" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    {
      id: 'coffee',
      zh: '热咖啡',
      desc: '90 叶片解锁',
      unlock: { kind: 'coins', value: 90 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#eeece8"/><path d="M14 24h30v14a12 12 0 0 1-24 0h-6z" fill="#a4553f"/><path d="M44 26h6a6 6 0 0 1 0 12h-6" fill="none" stroke="#a4553f" stroke-width="3"/><path d="M22 14c0-3 4-3 4-6M32 14c0-3 4-3 4-6" stroke="#8d8e98" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>'
    },
    {
      id: 'gem',
      zh: '切割宝石',
      desc: '80 叶片解锁',
      unlock: { kind: 'coins', value: 80 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#24262e"/><path d="M20 18h24l10 12-22 22L10 30z" fill="#c6c5ce" opacity=".9"/><path d="M20 18l12 12 12-12M10 30h44M32 30v22" stroke="#24262e" stroke-width="2" fill="none"/></svg>'
    },
    {
      id: 'bulb',
      zh: '点亮的灯泡',
      /* v4.3 Batch 6（交接 J）：110 → 120，收进 120–200 高档位区间 */
      desc: '120 叶片解锁',
      unlock: { kind: 'coins', value: 120 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#fafbf9"/><circle cx="32" cy="27" r="14" fill="#eeece8" stroke="#a8791c" stroke-width="3"/><path d="M27 41h10M28 46h8" stroke="#2f3138" stroke-width="3" stroke-linecap="round"/><path d="M32 6v4M12 27h4M48 27h4M18 13l3 3M46 13l-3 3" stroke="#a8791c" stroke-width="2.5" stroke-linecap="round"/></svg>'
    },
    {
      id: 'planet',
      zh: '环带行星',
      desc: '100 叶片解锁',
      unlock: { kind: 'coins', value: 100 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#24262e"/><circle cx="32" cy="30" r="13" fill="#7f96e8"/><ellipse cx="32" cy="32" rx="24" ry="8" fill="none" stroke="#eeece8" stroke-width="2.5" transform="rotate(-18 32 32)"/><circle cx="27" cy="27" r="3" fill="#a4553f" opacity=".7"/></svg>'
    },
    {
      id: 'moon',
      zh: '新月',
      desc: '130 叶片解锁',
      unlock: { kind: 'coins', value: 130 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#171c2b"/><path d="M40 12a20 20 0 1 0 12 34A22 22 0 0 1 40 12z" fill="#d6dcf0"/><path d="M46 18l1.5 4.5L52 24l-4.5 1.5L46 30l-1.5-4.5L40 24l4.5-1.5z" fill="#7f96e8"/></svg>'
    },
    {
      id: 'anchor',
      zh: '船锚',
      desc: '120 叶片解锁',
      unlock: { kind: 'coins', value: 120 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#f2f8fa"/><circle cx="32" cy="16" r="5" fill="none" stroke="#1d6f7e" stroke-width="3"/><path d="M32 21v26M20 32h24" stroke="#1d6f7e" stroke-width="3.5" stroke-linecap="round"/><path d="M18 42c2 8 8 12 14 12s12-4 14-12" fill="none" stroke="#1d6f7e" stroke-width="3.5" stroke-linecap="round"/></svg>'
    },
    {
      id: 'sun',
      zh: '正午太阳',
      desc: '160 叶片解锁',
      unlock: { kind: 'coins', value: 160 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#fdf8ee"/><circle cx="32" cy="32" r="11" fill="#a8791c"/><path d="M32 10v8M32 46v8M10 32h8M46 32h8M17 17l6 6M41 41l6 6M47 17l-6 6M23 41l-6 6" stroke="#a8791c" stroke-width="3" stroke-linecap="round"/></svg>'
    }
  ]
};
