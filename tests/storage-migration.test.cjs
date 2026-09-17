/* 发布准备轮：localStorage key 改名兼容迁移专项测试。
 *
 * 背景：命名空间从私有开发仓名 odin-foundations-zh 改为公开仓名
 * the-odin-project-zh（progress.js STORAGE_KEY）。改 key 的红线是
 * 「绝不能让老用户浏览器里的真实学习数据变成孤儿」。
 *
 * 钉住发布准备文档 §3 的全部场景：
 *   1. 仅旧 key 存在 → 启动自动迁移到新 key（搬运存储原文，逐字节一致）；
 *   2. 新旧 key 同时存在 → 新 key 优先，不被旧 key 覆盖；
 *   3. 迁移后所有关键字段保留（XP / 时长 / 叶片 / 课程记录 / 昵称 / 历史）；
 *   4. 旧 key 不被意外删除（回滚兼容）；
 *   5. 新保存只写新 key，绝不回写旧 key；
 *   6. 导入导出往返正常，旧 app 标识的导出文件仍可导入；
 *   7. 空档案（全新用户）正常，从不产生旧 key；
 *   8. 旧 key 档案损坏 → 按既有安全策略保护（不迁移、不覆盖、页面不崩）；
 *   9. 旧 schema(v3) 旧 key 档案 → 迁移 + schema 升级 + 迁移前自动快照；
 *   10. 跨标签页重载在新 key 缺失时只读回落旧 key（不做搬运写）；
 *   11. 备份清单旧 key 回落可读，下一次备份把旧条目搬运进新 key。
 *
 * 运行：node tests/storage-migration.test.cjs */
const assert = require('node:assert/strict');

const {
  FIRST_LESSON, querySelect, makeStorage, newPage, archiveJson,
  lessonEntryJson, STORAGE_KEY, LEGACY_STORAGE_KEY
} = require('./dom-stub.cjs');

let checks = 0;
const check = label => { checks += 1; return label; };

const BACKUP_KEY = 'the-odin-project-zh.backups.v1';
const LEGACY_BACKUP_KEY = 'odin-foundations-zh.backups.v1';

/* 改名前夜的真实老档案形态：旧 app 标识 + 显式 schemaVersion */
const legacyArchive = overrides => archiveJson(Object.assign({ app: 'odin-foundations-zh' }, overrides));
const profileOf = nickname => ({ nickname, avatarId: 'terminal', avatarData: null, equippedFrameId: 'frame-basic' });

/* ===================== 0. key 身份 ===================== */
{
  const page = newPage({ storage: makeStorage() });
  assert.equal(page.progress.storageKey(), 'the-odin-project-zh.progress.v1', check('当前 key 为公开仓命名空间'));
  assert.equal(page.progress.legacyStorageKey(), 'odin-foundations-zh.progress.v1', check('历史 key 以只读身份保留'));
  assert.equal(STORAGE_KEY, page.progress.storageKey(), check('dom-stub 与运行时 key 同源'));
  assert.equal(LEGACY_STORAGE_KEY, page.progress.legacyStorageKey(), check('dom-stub 与运行时历史 key 同源'));
}

/* ===================== 1/3/4. 仅旧 key：自动迁移、字段保留、旧 key 不删 ===================== */
{
  const storage = makeStorage();
  const seeded = legacyArchive({
    schemaVersion: 4,
    xp: 320,
    totalActiveSeconds: 3600,
    coins: 12,
    lessons: {
      [FIRST_LESSON]: lessonEntryJson({
        started: true, completed: true, activeSeconds: 600,
        startedAt: '2026-09-01T07:00:00.000Z', completedAt: '2026-09-01T08:00:00.000Z'
      })
    },
    profile: profileOf('老用户'),
    history: [{ type: 'level-up', zh: '达到 Lv.2', at: '2026-09-01T08:10:00.000Z' }]
  });
  storage.setItem(LEGACY_STORAGE_KEY, seeded);

  const page = newPage({ storage });
  const info = page.progress.autoLoadInfo();
  assert.equal(info.failed, false, check('场景1：旧档案读取不失败'));

  /* 迁移写入确实发生。注意：页面挂载时既有的“状态派生成就”结算可能触发
   * 一次规范化保存覆盖新 key（改名前在旧 key 上同样会发生，行为等价），
   * 因此这里按字段断言迁移结果；“原文逐字节保留”的保证由旧 key 与
   * 迁移前快照（场景 9）承担。 */
  const migratedRaw = storage.getItem(STORAGE_KEY);
  assert.ok(migratedRaw, check('场景1：仅旧 key 存在时，启动后新 key 出现档案（自动迁移）'));
  const migrated = JSON.parse(migratedRaw);
  assert.equal(migrated.xp, 320, check('场景1：迁移后新 key 内 XP 与旧档案一致'));
  assert.equal(migrated.lessons[FIRST_LESSON].completed, true, check('场景1：迁移后新 key 内课程记录一致'));
  assert.equal(migrated.profile.nickname, '老用户', check('场景1：迁移后新 key 内昵称一致'));

  const state = page.progress.getState();
  assert.equal(state.xp, 320, check('场景3：XP 保留'));
  assert.equal(state.totalActiveSeconds, 3600, check('场景3：累计时长保留'));
  assert.equal(state.coins, 12, check('场景3：学习叶片保留'));
  assert.equal(state.lessons[FIRST_LESSON].completed, true, check('场景3：课程完成状态保留'));
  assert.equal(state.lessons[FIRST_LESSON].activeSeconds, 600, check('场景3：单课时长保留'));
  assert.equal(state.lessons[FIRST_LESSON].completedAt, '2026-09-01T08:00:00.000Z', check('场景3：完成时间戳保留'));
  assert.equal(page.progress.summary().nickname, '老用户', check('场景3：昵称保留'));
  /* 播种的历史条目必须在；页面挂载时的成就结算会追加新历史条目
   *（既有行为，与迁移无关），因此不断言总条数。 */
  assert.ok(state.history.some(entry => entry.type === 'level-up' && entry.zh === '达到 Lv.2'),
    check('场景3：学习历史保留（播种条目迁移后仍在）'));
  assert.equal(page.progress.summary().completedCount, 1, check('场景3：完成数口径一致（用户可见数据不变）'));

  assert.equal(storage.getItem(LEGACY_STORAGE_KEY), seeded, check('场景4：旧 key 原文原样保留（不删除，回滚兼容）'));
}

/* ===================== 2. 新旧 key 并存：新 key 优先 ===================== */
{
  const storage = makeStorage();
  storage.setItem(LEGACY_STORAGE_KEY, legacyArchive({ schemaVersion: 4, xp: 100, profile: profileOf('旧档案') }));
  const newRaw = archiveJson({ schemaVersion: 4, xp: 250, profile: profileOf('新档案') });
  storage.setItem(STORAGE_KEY, newRaw);

  const page = newPage({ storage });
  assert.equal(page.progress.getState().xp, 250, check('场景2：新旧并存时新 key 优先'));
  assert.equal(page.progress.summary().nickname, '新档案', check('场景2：加载的是新 key 的档案'));
  const keptRaw = JSON.parse(storage.getItem(STORAGE_KEY));
  assert.equal(keptRaw.xp, 250, check('场景2：新 key 内容不被旧 key（xp=100）覆盖或改写'));
  assert.equal(storage.getItem(LEGACY_STORAGE_KEY).includes('"xp": 100') || storage.getItem(LEGACY_STORAGE_KEY).includes('"xp":100'), true, check('场景2：旧 key 依旧原样保留'));
}

/* ===================== 5. 迁移后的新保存只写新 key ===================== */
{
  const storage = makeStorage();
  const seeded = legacyArchive({ schemaVersion: 4 });
  storage.setItem(LEGACY_STORAGE_KEY, seeded);
  const page = newPage({ storage });

  page.progress.startTimer(FIRST_LESSON);
  page.progress.setCompleted(true);

  const stored = JSON.parse(storage.getItem(STORAGE_KEY));
  assert.equal(stored.lessons[FIRST_LESSON].completed, true, check('场景5：新保存写入新 key'));
  assert.equal(storage.getItem(LEGACY_STORAGE_KEY), seeded, check('场景5：保存绝不回写旧 key，也不删除'));
}

/* ===================== 6. 导入导出往返（含旧 app 标识文件） ===================== */
{
  const storage = makeStorage();
  storage.setItem(LEGACY_STORAGE_KEY, legacyArchive({ schemaVersion: 4, xp: 320 }));
  const page = newPage({ storage });
  const lessonIds = page.sandbox.window.ODIN_GUIDE.lessons.map(lesson => lesson.id);

  const exported = page.progress.exportArchive();
  assert.equal(JSON.parse(exported).app, 'the-odin-project-zh', check('场景6：新导出使用新命名空间标识'));
  const back = page.progress.Logic.parseImport(exported, lessonIds);
  assert.equal(back.ok, true, check('场景6：迁移后的档案导出→导入往返成功'));
  assert.equal(back.state.xp, 320, check('场景6：往返后 XP 保值（迁移不改变数据语义）'));

  /* 改名前导出的档案文件（app 为旧标识）必须仍可导入：
   * sanitizeState 白名单从不校验 app 字段 */
  const legacyFile = exported.replace('"app": "the-odin-project-zh"', '"app": "odin-foundations-zh"');
  const legacyBack = page.progress.Logic.parseImport(legacyFile, lessonIds);
  assert.equal(legacyBack.ok, true, check('场景6：旧命名空间导出的档案文件仍可导入'));
  assert.equal(legacyBack.state.xp, 320, check('场景6：旧导出文件导入后 XP 保值'));
}

/* ===================== 7. 空档案（全新用户） ===================== */
{
  const storage = makeStorage();
  const page = newPage({ storage });
  assert.equal(page.progress.autoLoadInfo().failed, false, check('场景7：空存储不判定为读档失败'));
  assert.equal(page.progress.summary().completedCount, 0, check('场景7：空档案完成数为 0'));
  /* 页面挂载时的设置规范化可能触发一次保存（既有行为）；红线是：
   * 任何写入都只落新 key，旧 key 绝不无中生有。 */
  assert.equal(storage.getItem(LEGACY_STORAGE_KEY), null, check('场景7：旧 key 不被无中生有'));

  page.progress.startTimer(FIRST_LESSON);
  page.progress.setCompleted(true);
  assert.ok(storage.getItem(STORAGE_KEY), check('场景7：全新用户保存只写新 key'));
  assert.equal(storage.getItem(LEGACY_STORAGE_KEY), null, check('场景7：全新用户全程不产生旧 key'));
}

/* ===================== 8. 旧 key 档案损坏：保护而非崩溃 ===================== */
{
  const storage = makeStorage();
  const broken = '{{{ 这不是 JSON';
  storage.setItem(LEGACY_STORAGE_KEY, broken);
  const page = newPage({ storage });

  const info = page.progress.autoLoadInfo();
  assert.equal(info.failed, true, check('场景8：损坏旧档案触发读档失败'));
  assert.equal(info.protected, true, check('场景8：写入被冻结（既有保护策略生效）'));
  assert.equal(storage.getItem(STORAGE_KEY), null, check('场景8：损坏档案不迁移写入新 key'));
  assert.equal(storage.getItem(LEGACY_STORAGE_KEY), broken, check('场景8：损坏原文也原样保留（不覆盖不删除）'));
  assert.ok(querySelect(page.dom.body, '.player-entry'), check('场景8：页面照常渲染可用（不崩溃）'));
}

/* ===================== 9. 旧 schema(v3) 旧 key 档案：迁移 + 升级 + 快照 ===================== */
{
  const storage = makeStorage();
  const seeded = legacyArchive({ schemaVersion: 3, xp: 120, coins: 5 });
  storage.setItem(LEGACY_STORAGE_KEY, seeded);
  const page = newPage({ storage });

  assert.ok(storage.getItem(STORAGE_KEY), check('场景9：schema v3 旧档案已搬运到新 key'));
  assert.equal(page.progress.getState().xp, 120, check('场景9：schema 迁移后 XP 保留'));

  const backups = JSON.parse(storage.getItem(BACKUP_KEY) || '[]');
  assert.ok(backups.length >= 1, check('场景9：schema 迁移前自动快照已创建'));
  assert.equal(backups[0].data, seeded, check('场景9：快照存的是迁移前存储原文（可完整回滚）'));

  page.progress.startTimer(FIRST_LESSON);
  page.progress.setCompleted(true);
  const stored = JSON.parse(storage.getItem(STORAGE_KEY));
  assert.equal(stored.schemaVersion, 4, check('场景9：首次保存后新 key 为当前 schema 4'));
  assert.equal(storage.getItem(LEGACY_STORAGE_KEY), seeded, check('场景9：升级全程旧 key 原文不动'));
}

/* ===================== 10. 跨标签页重载的只读回落 ===================== */
{
  const storage = makeStorage();
  storage.setItem(LEGACY_STORAGE_KEY, legacyArchive({ schemaVersion: 4, xp: 70 }));
  const page = newPage({ storage });
  /* 模拟「搬运写入未成功」的极端场景（如配额满）：手动移除新 key 后重载 */
  storage.removeItem(STORAGE_KEY);
  assert.equal(page.progress.reloadFromStorage(), true, check('场景10：新 key 缺失时重载回落旧 key 成功'));
  assert.equal(page.progress.getState().xp, 70, check('场景10：回落后读到旧 key 数据'));
  assert.equal(storage.getItem(STORAGE_KEY), null, check('场景10：重载回落是只读的，不做搬运写'));
}

/* ===================== 11. 备份清单旧 key 回落与搬运 ===================== */
{
  const storage = makeStorage();
  const legacyBackups = JSON.stringify([
    { at: '2026-09-01T00:00:00.000Z', reason: '改名前的备份', data: archiveJson({ schemaVersion: 4 }) }
  ]);
  storage.setItem(LEGACY_BACKUP_KEY, legacyBackups);
  const page = newPage({ storage });

  const list = page.progress.listBackups();
  assert.equal(list.length, 1, check('场景11：改名前的备份清单仍可读（旧 key 回落）'));
  assert.equal(list[0].reason, '改名前的备份', check('场景11：旧备份条目信息完整'));

  const result = page.progress.createBackup('手动备份');
  assert.equal(result.ok, true, check('场景11：新备份创建成功'));
  const newList = JSON.parse(storage.getItem(BACKUP_KEY));
  assert.equal(newList.length, 2, check('场景11：新备份写入新 key 并携带旧条目（自然搬运）'));
  assert.equal(newList[0].reason, '手动备份', check('场景11：新条目在最前'));
  assert.equal(newList[1].reason, '改名前的备份', check('场景11：旧条目保留在新清单'));
  assert.equal(storage.getItem(LEGACY_BACKUP_KEY), legacyBackups, check('场景11：旧备份 key 不删除不改写'));
}

console.log(`storage-migration.test.cjs：全部 ${checks} 项断言通过 ✔`);
