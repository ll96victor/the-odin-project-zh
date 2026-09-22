/* v4.11.8 最小视觉资产登记表的跨事实源测试（2026-09-21 收口版）。
 *
 * 本测试证明的不是「manifest 存在」，而是每条引用都能落到真实事实源与真实文件：
 *  - 概念图引用在 diagrams.js 真实存在、文件真实存在、大小不超预算；
 *  - 伙伴引用在 companion-registry.js 有对应 fixed-art ready 记录、
 *    文件真实存在、大小不超预算；
 *  - World 场景样板按运行时派生登记：WORLD_CARD_TONES 有对应 tone、
 *    style.css 有对应表现规则，且不使用虚构路径 / 虚构预算；
 *  - manifest 明确声明「未覆盖全部历史资产」。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
function loadScript(name, sandboxKey) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, name), 'utf8'), sandbox);
  const value = sandbox.window[sandboxKey];
  assert.ok(value, `${name} 应导出 ${sandboxKey}`);
  return value;
}

const registry = loadScript('visual-assets.js', 'ODIN_VISUAL_ASSETS');
const diagrams = loadScript('diagrams.js', 'ODIN_DIAGRAMS');
const companions = loadScript('companion-registry.js', 'ODIN_COMPANION_REGISTRY');
const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const cssSource = fs.readFileSync(path.join(root, 'style.css'), 'utf8');

const allowedKinds = new Set(['diagram', 'companion', 'world-scene', 'lesson-art']);
const allowedThemeModes = new Set(['token', 'approximate-dark', 'fixed-art', 'theme-specific']);
const allowedStatuses = new Set(['active', 'prototype', 'retired']);
const allowedSourceTypes = new Set(['registry', 'runtime-derived']);

/* --- manifest 基础合同 --- */
assert.equal(registry.version, 2);
assert.ok(registry.scope.includes('未覆盖全部历史资产'), 'manifest 必须明确声明未覆盖全部历史资产');
assert.ok(Array.isArray(registry.assets) && registry.assets.length > 0);

const ids = new Set();
function parseSourceRef(asset) {
  const ref = String(asset.sourceRef || '');
  const hash = ref.indexOf('#');
  assert.ok(hash > 0 && hash < ref.length - 1, `sourceRef 必须是「文件#条目」形态：${asset.id}`);
  return { file: ref.slice(0, hash), anchor: ref.slice(hash + 1) };
}

for (const asset of registry.assets) {
  assert.ok(!ids.has(asset.id), `资产 id 重复：${asset.id}`);
  ids.add(asset.id);
  assert.ok(allowedKinds.has(asset.kind), `kind 非法：${asset.id}`);
  assert.ok(allowedThemeModes.has(asset.themeMode), `themeMode 非法：${asset.id}`);
  assert.ok(allowedStatuses.has(asset.status), `status 非法：${asset.id}`);
  assert.ok(allowedSourceTypes.has(asset.sourceType), `sourceType 非法：${asset.id}`);
  parseSourceRef(asset);
  if (asset.sourceType === 'runtime-derived') {
    assert.equal(asset.file, null, `运行时派生资产不得登记虚构文件路径：${asset.id}`);
    assert.equal(asset.byteBudget, null, `运行时派生资产不得登记虚构字节预算：${asset.id}`);
  } else {
    assert.ok(typeof asset.byteBudget === 'number' && asset.byteBudget > 0, `byteBudget 非法：${asset.id}`);
    assert.ok(asset.file === undefined, `registry 引用资产的文件路径应从事实源推导，不在 manifest 复制：${asset.id}`);
  }
}

/* --- 概念图：引用、文件与预算都要对到 diagrams.js 与磁盘 --- */
const diagramAssets = registry.assets.filter(asset => asset.kind === 'diagram');
assert.equal(diagramAssets.length, 2, '样板应登记两张代表性概念图');
for (const asset of diagramAssets) {
  assert.equal(asset.sourceType, 'registry', `概念图必须走事实源引用：${asset.id}`);
  const { file, anchor } = parseSourceRef(asset);
  assert.equal(file, 'diagrams.js', `概念图事实源必须是 diagrams.js：${asset.id}`);
  const entry = diagrams.diagrams.find(item => item.id === anchor);
  assert.ok(entry, `diagrams.js 中应存在被引用的条目：${anchor}`);
  const filePath = path.join(diagrams.directory, entry.file);
  const fullPath = path.join(root, filePath);
  assert.ok(fs.existsSync(fullPath), `概念图文件不存在：${filePath}`);
  const size = fs.statSync(fullPath).size;
  assert.ok(size <= asset.byteBudget, `概念图 ${filePath} 实际 ${size}B 超出预算 ${asset.byteBudget}B`);
  assert.equal(typeof entry.alt, 'string', `diagrams.js 条目应自带 alt（manifest 不复制）：${anchor}`);
  assert.equal(typeof entry.caption, 'string', `diagrams.js 条目应自带 caption（manifest 不复制）：${anchor}`);
  assert.ok(entry.lessonId, `diagrams.js 条目应自带课程归属（manifest 不复制）：${anchor}`);
}

/* --- 伙伴图标：fixed-art 记录、文件与预算对到 companion-registry.js 与磁盘 --- */
const companionAssets = registry.assets.filter(asset => asset.kind === 'companion');
assert.equal(companionAssets.length, 1, '样板应登记一个代表性伙伴图标');
for (const asset of companionAssets) {
  assert.equal(asset.sourceType, 'registry', `伙伴资产必须走事实源引用：${asset.id}`);
  const { file, anchor } = parseSourceRef(asset);
  assert.equal(file, 'companion-registry.js', `伙伴资产事实源必须是 companion-registry.js：${asset.id}`);
  const record = companions.companions.find(item => item.id === anchor);
  assert.ok(record, `companion-registry.js 中应存在被引用的角色：${anchor}`);
  assert.equal(record.render.engine, 'fixedArt', `被引用的伙伴应是 fixed-art 资产：${anchor}`);
  assert.ok(record.art && record.art.status === 'ready', `被引用的伙伴资产应处于 ready 状态：${anchor}`);
  const iconPath = path.join(companions.assetRoot, record.art.dir, record.art.icon);
  const fullPath = path.join(root, iconPath);
  assert.ok(fs.existsSync(fullPath), `伙伴图标文件不存在：${iconPath}`);
  const size = fs.statSync(fullPath).size;
  assert.ok(size <= asset.byteBudget, `伙伴图标 ${iconPath} 实际 ${size}B 超出预算 ${asset.byteBudget}B`);
}

/* --- World 场景样板：运行时派生来源必须可在真实代码中核对 --- */
const worldScenes = registry.assets.filter(asset => asset.kind === 'world-scene');
assert.equal(worldScenes.length, 1, '样板应登记一个运行时派生 World 场景');
for (const asset of worldScenes) {
  assert.equal(asset.sourceType, 'runtime-derived', `World 场景样板必须按运行时派生登记：${asset.id}`);
  assert.ok(asset.worldId, `World 场景样板必须登记归属 World：${asset.id}`);
  const tonesMatch = appSource.match(/const WORLD_CARD_TONES = \{[\s\S]*?\};/);
  assert.ok(tonesMatch, 'app.js 中应存在 WORLD_CARD_TONES 表');
  assert.ok(new RegExp(`\\d+:\\s*'${asset.worldId}'`).test(tonesMatch[0]), `WORLD_CARD_TONES 中应存在 ${asset.worldId} tone`);
  assert.ok(cssSource.includes(`.world-card[data-world-tone="${asset.worldId}"]`), `style.css 中应存在 ${asset.worldId} tone 的世界卡场景规则`);
}

console.log(`visual-assets: ${registry.assets.length} representative assets verified against diagrams.js / companion-registry.js / runtime sources; full coverage is explicitly not claimed`);
