/* version.js — 版本身份单一事实源（v4.5 交接 A2）。
 *
 * 为什么需要它：用户实际遇到过“本地旧服务还在跑，浏览器打开的是旧版本页面，
 * 但页面上没有任何版本号”，导致误判代码没更新。本文件是产品版本号的**唯一**
 * 出处，以下消费方全部从这里读，不允许在别处硬编码版本字符串：
 *   - app.js：页面 footer 版本行、「关于本站」区块；
 *   - serve.py：启动控制台打印（解析本文件）、/version.json 动态端点；
 *   - serve.py：端口被占用时探测对方 /version.json，识别旧版本服务（交接 A3）。
 *
 * 升版本时只改这一处（配合 specs.md / README 的版本文案）。
 * 本文件不依赖任何其它脚本，必须在 app.js 之前加载（两页的 defer 顺序已固定）。 */
(function () {
  'use strict';
  window.ODIN_VERSION = {
    /* 档案/服务命名空间标识（serve.py 用它识别“对方是不是本站”，不是给用户看的）。
     * 发布准备轮起与公开仓 the-odin-project-zh 对齐；serve.py 的旧服务探测
     * 同时接受历史值 'odin-foundations-zh'，保证改名前启动的旧服务仍能被识别。 */
    app: 'the-odin-project-zh',
    /* 产品名：面向用户的品牌（发布准备轮定名「Odin 中文学习站」，
     * 英文定位 The Odin Project Chinese Learning Companion） */
    product: 'Odin 中文学习站',
    /* 产品版本：footer 显示为「Odin 中文学习站 v4.11.20」 */
    version: '4.11.20'
  };
})();
