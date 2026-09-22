/* 开发期视觉资产最小登记表：不参与运行时业务、进度、解锁或主题持久化，
 * 也不接入产品 HTML——只在开发期由 tests/visual-assets.test.cjs 消费。
 *
 * v4.11.8 样板验收修正（2026-09-21）收口：
 *  - 本表不再复制事实源内容（lessonId、alt、caption、license 等），只登记
 *    跨资产公共纪律（byteBudget）与对事实源的 sourceRef 引用；内容事实住
 *    源文件——概念图是 diagrams.js，伙伴资产是 companion-registry.js，
 *    交叉核对由测试钉住，避免第二事实源漂移。
 *  - World 场景样板改按「运行时派生来源」如实登记：没有独立资产文件，
 *    file / byteBudget 为 null（不再用假路径与假预算让 schema 看似完整）。 */
(function registerVisualAssets(root) {
  root.ODIN_VISUAL_ASSETS = Object.freeze({
    version: 2,
    scope: '代表性样板：登记两张概念图与一个 fixed-art 伙伴图标的引用、一个运行时派生 World 场景样板；未覆盖全部历史资产。',
    assets: Object.freeze([
      {
        id: 'diagram-command-line-tree',
        kind: 'diagram',
        sourceType: 'registry',
        sourceRef: 'diagrams.js#command-line-tree',
        worldId: 'foundations',
        themeMode: 'approximate-dark',
        byteBudget: 20000,
        status: 'active'
      },
      {
        id: 'diagram-git-areas',
        kind: 'diagram',
        sourceType: 'registry',
        sourceRef: 'diagrams.js#git-areas',
        worldId: 'foundations',
        themeMode: 'approximate-dark',
        byteBudget: 20000,
        status: 'active'
      },
      {
        id: 'companion-nono-icon',
        kind: 'companion',
        sourceType: 'registry',
        sourceRef: 'companion-registry.js#nono',
        worldId: '',
        themeMode: 'fixed-art',
        byteBudget: 150000,
        status: 'active'
      },
      {
        id: 'world-card-foundations-scene',
        kind: 'world-scene',
        sourceType: 'runtime-derived',
        sourceRef: 'app.js#WORLD_CARD_TONES + style.css .world-card[data-world-tone]',
        worldId: 'foundations',
        themeMode: 'token',
        file: null,
        byteBudget: null,
        status: 'active'
      }
    ])
  });
})(typeof window !== 'undefined' ? window : globalThis);
