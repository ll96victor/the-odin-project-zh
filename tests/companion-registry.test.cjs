const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const root = { console }; root.window = root;
vm.runInNewContext(fs.readFileSync('companions.js', 'utf8'), root);
vm.runInNewContext(fs.readFileSync('companion-registry.js', 'utf8'), root);
vm.runInNewContext(fs.readFileSync('companion-view.js', 'utf8'), root);
const registry = root.ODIN_COMPANION_REGISTRY; const view = root.ODIN_COMPANION_VIEW;
const ids = registry.companions.map(item => item.id);
assert.strictEqual(ids.length, 28, '当前批次登记28条（事实快照）');
assert.strictEqual(new Set(ids).size, ids.length, 'stable id 唯一');
assert.ok(registry.companions.every(item => /^[a-z0-9-]+$/.test(item.id) && item.name), 'id/name 合法');
assert.strictEqual(registry.defaultCompanionId, 'nono', 'v4.8：默认角色是 nono');
/* v4.8 退役机制：retiredIds 单一事实源；数据保留在库（可回滚、老档案 id 不孤儿），
 * 但 resolve 回落默认角色、listByKind 与一切列角色 UI 不再显示。 */
assert.deepStrictEqual([...registry.retiredIds], ['sprout'], 'v4.8：退役名单单一事实源');
const sprout = registry.companions.find(item => item.id === 'sprout');
assert.ok(sprout, 'v4.8：退役角色数据仍保留在登记表（不删除、可回滚）');
assert.strictEqual(sprout.kind, 'creature'); assert.strictEqual(sprout.render.engine, 'inline');
assert.strictEqual(view.resolve('sprout').id, 'nono', 'v4.8：resolve 退役 sprout 回落默认角色 nono');
assert.ok(!view.listByKind().some(item => item.id === 'sprout'), 'v4.8：退役角色不出现在可选列表');
assert.strictEqual(view.capabilities('odin-boy').wardrobe, true);
assert.strictEqual(view.capabilities('kitty-white').wardrobe, false, 'fixed-art 宠物无装扮');
assert.strictEqual(view.capabilities('sprout').engine, 'fixedArt', 'v4.8：退役 sprout 的 capabilities 随回落角色 nono');
assert.strictEqual(view.listByKind('humanoid').length, 8);
assert.strictEqual(view.listByKind('creature').length, 19, 'v4.8：生物列表 19（20 − 退役 sprout）');
assert.strictEqual(view.listByKind().length, 27, 'v4.8：全部可选角色 27（28 − 退役 sprout）');
assert.strictEqual(view.skinFor('nono', null), 'study', 'v4.8：nono 默认皮肤 study（用户显式选择仍优先）');
assert.strictEqual(view.skinFor('nono', 'default'), 'default', 'v4.8：显式请求 default 皮肤不被覆盖');
assert.strictEqual(view.resolve('mia').id, 'mia');
assert.strictEqual(view.portrait('mia', { slot: 'hero' }).alt, '米娅');
assert.strictEqual(registry.companions.find(item => item.id === 'mia').pairPetId, 'bunny-peach');
const readyIds = [...registry.companions.filter(item => item.art && item.art.status === 'ready').map(item => item.id)];
assert.deepStrictEqual(readyIds, [
  'nono', 'ella', 'mia', 'riko', 'rin', 'hina',
  'kitty-white', 'kitty-ink', 'shiba-dou', 'fox-snow',
  'bunny-peach', 'dragon-lilac', 'penguin-bobo', 'hamster-mai'
]);
for (const item of registry.companions.filter(item => item.render.engine === 'fixedArt')) {
  assert.strictEqual(item.art.status, 'ready', `${item.id} 已具备正式资产`);
  if (item.art.status === 'pending') {
    assert.deepStrictEqual(Object.keys(item.art), ['status'], `${item.id} pending 不声明假文件`);
  }
}
assert.deepStrictEqual(Array.from(view.capabilities('mia').skins), ['default', 'study']);
assert.deepStrictEqual(Array.from(view.capabilities('nono').skins), ['default', 'study']);
assert.strictEqual(view.skinFor('ella', 'missing-skin'), 'default', '未知 skin 回退 default');
const miaStudy = registry.companions.find(item => item.id === 'mia').art.skins.study;
delete registry.companions.find(item => item.id === 'mia').art.skins.study;
assert.strictEqual(view.skinFor('mia', 'study'), 'default', '缺少 study 时回退 default');
registry.companions.find(item => item.id === 'mia').art.skins.study = miaStudy;
assert.strictEqual(view.portrait('nono', { slot: 'hero', mood: 'celebrate', skin: 'study' }).value, 'assets/companions/nono/study-celebrate.webp');
assert.strictEqual(view.portrait('mia', { slot: 'profile', mood: 'celebrate', skin: 'study' }).value, 'assets/companions/mia/study-celebrate.webp');
assert.strictEqual(view.portrait('mia', { slot: 'profile', mood: 'celebrate', skin: 'default' }).value, 'assets/companions/mia/default-normal.webp');
assert.strictEqual(view.portrait('kitty-white', { slot: 'hero', mood: 'celebrate' }).value, 'assets/companions/kitty-white/celebrate.webp');
assert.strictEqual(view.portrait('mia', { slot: 'listItem', mood: 'celebrate', skin: 'study' }).value, 'assets/companions/mia/icon.webp');
assert.strictEqual(view.moodFor({ tip: { kind: 'today-short' }, todaySeconds: 120 }), 'encourage');
assert.strictEqual(view.moodFor({ tip: { kind: 'review-due' }, reviewDueToday: 1 }), 'remind');
assert.strictEqual(view.moodFor({ tip: { kind: 'steady' }, todaySeconds: 1200 }), 'happy');
assert.strictEqual(view.moodFor({ tip: { kind: 'all-done' }, todaySeconds: 0 }), 'celebrate');
console.log('companion-registry.test.cjs：全部断言通过 ✔');
