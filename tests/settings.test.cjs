/* 学习设置 / 备份 / 重置测试（v4.2 交接 §15、§16、§17、§22）。
 *
 * 设置的纯逻辑（默认值、显式 false、导出往返）在 Logic 层验证；
 * 备份与重置发生在浏览器适配层（需要 localStorage），用与 sync.test.cjs
 * 相同的“页面桩”在 Node 里复刻真实链路。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const sources = {};
for (const file of ['lessons.js', 'economy.js', 'collections.js', 'daily.js', 'history.js', 'progress.js']) {
  sources[file] = fs.readFileSync(path.join(root, file), 'utf8');
}
let checks = 0;
const check = label => { checks += 1; return label; };
const local = value => JSON.parse(JSON.stringify(value));
const AT = '2026-09-10T09:00:00.000Z';

function makeStorage() {
  const map = new Map();
  return {
    setItem(key, value) { map.set(String(key), String(value)); },
    getItem(key) { return map.has(String(key)) ? map.get(String(key)) : null; },
    removeItem(key) { map.delete(String(key)); },
    key(index) { return [...map.keys()][index]; },
    get length() { return map.size; }
  };
}

/* 一个“页面”：先注入指定存储内容，再加载全部模块。 */
function newPage(storage) {
  const sandbox = {
    window: {},
    location: { protocol: 'http:', href: 'http://127.0.0.1:8765/index.html' },
    document: { addEventListener() {}, removeEventListener() {}, visibilityState: 'visible', body: { append() {} } },
    setInterval() { return 0; },
    setTimeout() { return 0; },
    addEventListener() {},
    Date, JSON, URLSearchParams, console
  };
  sandbox.window = sandbox;
  sandbox.window.localStorage = storage;
  for (const file of Object.keys(sources)) vm.runInNewContext(sources[file], sandbox);
  return sandbox.window.ODIN_PROGRESS;
}

/* ===================== 1. 设置：默认值与显式 false（Logic 层） ===================== */
{
  const sandbox = { window: {} };
  sandbox.window = sandbox;
  for (const file of Object.keys(sources)) vm.runInNewContext(sources[file], sandbox);
  const Logic = sandbox.window.ODIN_PROGRESS.Logic;

  const fresh = Logic.emptySettings();
  for (const key of Logic.SETTING_BOOLEAN_KEYS) {
    assert.equal(fresh[key], true, check(`默认设置 ${key} 为开`));
  }
  assert.equal(fresh.dailyGoalMinutes, 20, check('默认每日目标 20 分钟'));

  /* 档案校验：只有显式 false 关闭，其余（缺省 / true / 字符串）都是开 */
  const base = {
    schemaVersion: 3, lessons: {}, daily: {}, totalActiveSeconds: 0, xp: 0,
    minuteXpAwarded: 0, rewardFlags: {}, achievements: {}, lastLessonId: null,
    coins: 0, coinMinuteAwarded: 0, coinFlags: {},
    cosmetics: { purchases: {}, companionId: 'sprout', themeId: 'garden' }
  };
  const lessonIds = [];
  const mk = settingsOverrides => Logic.parseImport(JSON.stringify(Object.assign({}, base, { settings: settingsOverrides })), lessonIds);
  let r = mk({ showCompanion: false, shortcutsEnabled: false });
  assert.equal(r.state.settings.showCompanion, false, check('显式 false 关闭 showCompanion'));
  assert.equal(r.state.settings.shortcutsEnabled, false, check('显式 false 关闭 shortcutsEnabled'));
  assert.equal(r.state.settings.showEnglishTitles, true, check('未提及的设置保持默认开'));
  r = mk({ showCompanion: 'no', showEnglishTitles: 0 });
  assert.equal(r.state.settings.showCompanion, true, check('非布尔值不算关闭（字符串）'));
  assert.equal(r.state.settings.showEnglishTitles, true, check('非布尔值不算关闭（数字 0）'));
  r = mk({});
  assert.equal(r.state.settings.showCompanion, true, check('旧档案缺省全部按开处理'));

  /* 导出往返 */
  const state = Logic.emptyState();
  state.settings.showCompanion = false;
  state.settings.shortcutsEnabled = false;
  const exported = Logic.exportJson(state, AT);
  const parsed = JSON.parse(exported);
  assert.equal(parsed.settings.showCompanion, false, check('导出含关闭的设置'));
  const back = Logic.parseImport(exported, lessonIds);
  assert.equal(back.state.settings.showCompanion, false, check('设置往返保值'));
  assert.equal(Logic.containsSensitiveKey(exported), false, check('设置导出无敏感键'));
}

/* ===================== 2. setSetting 浏览器层 ===================== */
{
  const page = newPage(makeStorage());
  assert.equal(page.setSetting('showCompanion', false).ok, true, check('setSetting 接受合法键'));
  assert.equal(page.settings().showCompanion, false, check('设置后立即生效'));
  assert.equal(page.setSetting('not-a-key', false).ok, false, check('setSetting 拒绝未知键'));
  assert.equal(page.setSetting('showCompanion', true).ok, true, check('重新开启'));
  assert.equal(page.settings().showCompanion, true, check('重新开启后生效'));
}

/* ===================== 3. 备份：创建 / 上限 / 恢复 ===================== */
{
  const storage = makeStorage();
  const page = newPage(storage);
  /* 造一些真实数据 */
  page.startTimer('how-this-course-will-work');
  page.setCompleted(true);
  const summaryBefore = page.summary();

  /* 手动备份 ×7：只保留最近 5 份 */
  for (let i = 0; i < 7; i += 1) page.createBackup(`手动备份 ${i + 1}`);
  const list = page.listBackups();
  assert.equal(list.length, 5, check('备份只保留最近 5 份'));
  assert.equal(list[0].reason, '手动备份 7', check('最新的备份排在最前'));
  assert.equal(list[4].reason, '手动备份 3', check('最旧的被淘汰'));
  assert.ok(list.every(item => item.size > 10), check('每份备份带大小'));

  /* 恢复最新备份：状态一致（先自动快照当前，再恢复） */
  const restoreResult = page.restoreBackup(0);
  assert.equal(restoreResult.ok, true, check('恢复成功'));
  const after = page.summary();
  assert.equal(after.completedCount, summaryBefore.completedCount, check('恢复后完成数与备份时一致'));
  assert.equal(after.xp, summaryBefore.xp, check('恢复后 XP 一致'));
  /* 恢复前自动快照：现在最新的一份是“恢复备份前自动快照” */
  const list2 = page.listBackups();
  assert.equal(list2[0].reason, '恢复备份前自动快照', check('恢复前自动生成了当前状态快照'));
  assert.equal(list2.length, 5, check('自动快照同样受 5 份上限约束'));

  /* 越界与损坏：恢复不存在的下标失败 */
  assert.equal(page.restoreBackup(99).ok, false, check('恢复不存在的备份失败'));
}

/* ===================== 4. 重置：清学习数据、保个人配置、先备份 ===================== */
{
  const storage = makeStorage();
  const page = newPage(storage);
  page.startTimer('how-this-course-will-work');
  page.setCompleted(true);
  page.setOfficialCompleted(true);
  page.setNickname('夜行者');
  page.setAvatarId('fox');
  const coinsBefore = page.summary().coins;

  const result = page.resetProgress();
  assert.equal(result.ok, true, check('重置成功'));
  const after = page.summary();
  assert.equal(after.completedCount, 0, check('重置后完成数归零'));
  assert.equal(after.xp, 0, check('重置后 XP 归零'));
  assert.equal(after.coins, 0, check('重置后叶片归零（不保留可刷余额）'));
  assert.equal(after.achievementCount, 0, check('重置后成就清空'));
  assert.equal(page.historyCount(), 0, check('重置后学习历史清空'));
  /* 个人配置保留 */
  assert.equal(after.nickname, '夜行者', check('昵称保留'));
  assert.equal(after.avatarId, 'fox', check('头像保留'));
  assert.equal(page.settings().dailyGoalMinutes, 20, check('界面设置保留'));
  /* 重置前自动快照 */
  const list = page.listBackups();
  assert.equal(list[0].reason, '重置学习进度前自动快照', check('重置前自动备份'));
  assert.ok(list[0].size > 10, check('备份里有重置前的完整档案'));
  /* 从备份恢复可以把学习数据找回来 */
  const restored = page.restoreBackup(0);
  assert.equal(restored.ok, true, check('可从重置前备份恢复'));
  assert.ok(page.summary().completedCount >= 1 || page.summary().xp > 0, check('恢复后学习数据回来了'));
}

/* ===================== 5. 导入前自动备份 ===================== */
{
  const storage = makeStorage();
  const page = newPage(storage);
  page.startTimer('how-this-course-will-work');
  page.setCompleted(true);
  assert.equal(page.summary().completedCount, 1, check('导入前有一课完成'));
  /* 导入一份空档案（模拟覆盖） */
  const emptyArchive = JSON.stringify({
    schemaVersion: 3, lessons: {}, daily: {}, totalActiveSeconds: 0, xp: 0,
    minuteXpAwarded: 0, rewardFlags: {}, achievements: {}, lastLessonId: null,
    coins: 0, coinMinuteAwarded: 0, coinFlags: {},
    cosmetics: { purchases: {}, companionId: 'sprout', themeId: 'garden' },
    settings: { dailyGoalMinutes: 20 }
  });
  const imported = page.importArchive(emptyArchive);
  assert.equal(imported.ok, true, check('导入成功'));
  assert.equal(page.summary().completedCount, 0, check('导入覆盖了本机数据'));
  const list = page.listBackups();
  assert.equal(list[0].reason, '导入学习档案前自动快照', check('导入前自动备份了原状态'));
  /* 备份里的原状态可以恢复 */
  page.restoreBackup(0);
  assert.equal(page.summary().completedCount, 1, check('导入前的数据可从备份找回'));
}

console.log(`通过：学习设置 / 备份 / 重置 ${checks} 项断言（设置默认值与显式 false、导出往返、setSetting 校验、备份 5 份上限与恢复、重置清学习保配置且先备份、导入前自动快照）。`);
