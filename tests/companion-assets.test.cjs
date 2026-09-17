const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const sandbox = { window: {} };
for (const name of ['companions.js', 'companion-registry.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, name), 'utf8'), sandbox);
}

const registry = sandbox.window.ODIN_COMPANION_REGISTRY;
const ready = registry.companions.filter(item => item.art && item.art.status === 'ready');
assert.equal(ready.length, 14, '14 个 fixed-art 角色均 ready');
for (const item of registry.companions.filter(item => item.render.engine === 'fixedArt')) {
  if (item.art.status === 'pending') {
    assert.deepEqual(Object.keys(item.art), ['status'], `${item.id} pending 不声明假文件`);
  }
}
const files = [];
for (const item of ready) {
  assert.ok(item.art.icon, `${item.id} 有独立 icon`);
  files.push({ id: item.id, file: item.art.icon });
  for (const moods of Object.values(item.art.skins || {})) {
    for (const file of Object.values(moods)) files.push({ id: item.id, file });
  }
}

assert.equal(files.length, 72, '正式运行时资产共 72 张');
let total = 0;
for (const entry of files) {
  assert.match(entry.file, /\.webp$/, `${entry.id}/${entry.file} 使用 WebP`);
  const target = path.join(root, registry.assetRoot, ready.find(item => item.id === entry.id).art.dir, entry.file);
  assert.ok(fs.existsSync(target), `${entry.id}/${entry.file} 存在`);
  const bytes = fs.statSync(target).size;
  total += bytes;
  assert.ok(bytes > 0 && bytes <= 150 * 1024, `${entry.id}/${entry.file} 为非空且不超过 150KB（${bytes} bytes）`);
  const content = fs.readFileSync(target);
  const header = content.subarray(0, 12);
  assert.equal(header.toString('ascii', 0, 4), 'RIFF', `${entry.file} 是 RIFF WebP`);
  assert.equal(header.toString('ascii', 8, 12), 'WEBP', `${entry.file} 是 WebP`);
  assert.ok(content.includes(Buffer.from('ALPH')) || content.includes(Buffer.from('VP8L')), `${entry.id}/${entry.file} 保留透明度`);
}
assert.ok(total < 10 * 1024 * 1024, `整套正式资产低于 10MB（${total} bytes）`);
console.log(`companion-assets.test.cjs：72 张正式 WebP 共 ${total} bytes，全部通过 ✔`);
