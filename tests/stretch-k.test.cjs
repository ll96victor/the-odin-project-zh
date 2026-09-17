/* v4.5 Batch 11（交接 Stretch K）：增强项专项测试。
 *
 * 钉住六件事（K1 已由 Batch 5 实现、K6 已由 v4.4 实现，均不在本文件重复）：
 *   K2 装扮「随机搭配」试穿——只从已拥有（已解锁）部件里随机、绝不自动保存、
 *      「保存这套」才逐槽写档案、「撤销试穿」与关闭 picker 都丢弃、不跨会话残留；
 *   K3 升级庆祝联动——升级后 6 秒窗口内伙伴 bust 带 .is-celebrating（表情：庆祝），
 *      只存内存不写档案；
 *   K4 等级进度条——role=progressbar + aria 三值 + 本机总跨度分母（非线性曲线
 *      下每级宽度不同）；
 *   K5 新手 1–5 级奖励预览——Lv.1 固定行 + Lv.2–5 名单与升级轻提示同源
 *      （levelUnlockedCosmeticNames），已达到等级加 is-reached 标记；
 *   K7 复制诊断信息——只含 版本/页面/schema/存储模式/UA 五项，绝不含昵称等
 *      任何个人学习数据（红线：不得包含敏感数据）；
 *   K8 版本不匹配轻提示——档案 schemaVersion 比代码新（旧缓存 JS）或
 *      version.js 缺失（文件混装）时追加持久 role=status 提示（Ctrl+F5 +
 *      数据没有丢），不阻断学习；正常页面不出现。
 *
 * 运行：node tests/stretch-k.test.cjs */
const assert = require('node:assert/strict');
const vm = require('node:vm');

const {
  FIRST_LESSON, SCRIPTS, STORAGE_KEY, makeDom,
  querySelect, collectByClass, dispatch, makeStorage, newPage, archiveJson
} = require('./dom-stub.cjs');

let checks = 0;
const check = label => { checks += 1; return label; };

const lessonPage = storage => newPage({
  storage, page: 'lesson', search: `?id=${FIRST_LESSON}`,
  href: `http://127.0.0.1:8799/lesson.html?id=${FIRST_LESSON}`
});

/* K8c 专用：跳过 version.js 的“文件混装”页面（模拟旧缓存吞掉了一个脚本） */
function newPageWithoutVersion(options) {
  const page = makeDom(options);
  for (const script of SCRIPTS) {
    if (script.name === 'version.js') continue;
    vm.runInNewContext(script.src, page.sandbox, { filename: script.name });
  }
  page.progress = page.sandbox.window.ODIN_PROGRESS;
  return page;
}

function openProfile(page) {
  dispatch(querySelect(page.dom.body, '.player-entry'), 'click', {});
  const dialog = collectByClass(page.dom.body, 'profile-dialog').find(d => d.open === true);
  assert.ok(dialog, check('K：点击右上角玩家入口打开个人中心'));
  return dialog;
}

function openWardrobe(page) {
  const profile = openProfile(page);
  const card = collectByClass(profile, 'appearance-action').find(c => c.textContent.includes('更换伙伴装扮'));
  dispatch(card, 'click', {});
  return collectByClass(page.dom.body, 'picker-dialog').find(d => d.open === true);
}

/* ===================== K2. 随机搭配试穿：只选已拥有、不自动保存 ===================== */
{
  const page = newPage({ storage: makeStorage() });
  page.progress.equipCompanion('odin-boy');   /* 人形才有装扮舞台 */
  const wardrobe = page.sandbox.window.ODIN_COMPANION_WARDROBE;
  assert.ok(wardrobe, check('K2：装扮系统全局已载入'));

  const picker = openWardrobe(page);
  assert.ok(picker && picker.textContent.includes('学习伙伴装扮'), check('K2：打开装扮 picker'));
  /* 初始无试穿态 */
  assert.equal(querySelect(picker, '.wardrobe-trial-hint'), null, check('K2：初始没有「试穿中」提示'));
  assert.equal(querySelect(picker, '.wardrobe-trial-save'), null, check('K2：初始没有「保存这套」按钮'));
  const randomButton = querySelect(picker, '.wardrobe-random');
  assert.ok(randomButton, check('K2：人形舞台有「随机搭配」按钮'));
  assert.ok(randomButton.textContent.includes('只用已拥有'), check('K2：按钮明示「只用已拥有的」'));

  /* 记录初始（已保存）搭配：每槽 is-selected 的部件 id */
  const slots = wardrobe.manifest().slots;
  const readSelected = p => {
    const blocks = collectByClass(p, 'wardrobe-slot');
    assert.equal(blocks.length, slots.length, check('K2：四槽块数与 manifest 一致'));
    const selected = {};
    blocks.forEach((block, i) => {
      const cells = collectByClass(block, 'wardrobe-option');
      assert.equal(cells.length, slots[i].options.length, check(`K2：${slots[i].zh}槽选项数与 manifest 一致`));
      const idx = cells.findIndex(c => c.classList.contains('is-selected'));
      assert.ok(idx >= 0, check(`K2：${slots[i].zh}槽恰有选中件`));
      selected[slots[i].id] = slots[i].options[idx].id;
    });
    return selected;
  };
  const base = readSelected(picker);

  /* 点随机 → 进入试穿态 */
  dispatch(randomButton, 'click', {});
  let picker2 = collectByClass(page.dom.body, 'picker-dialog').find(d => d.open === true);
  assert.ok(querySelect(picker2, '.wardrobe-trial-hint'), check('K2：点随机后出现「试穿中，尚未保存」提示'));
  assert.ok(querySelect(picker2, '.wardrobe-trial-save'), check('K2：试穿态出现「保存这套」按钮'));
  assert.ok(querySelect(picker2, '.wardrobe-trial-undo'), check('K2：试穿态出现「撤销试穿」按钮'));
  assert.ok(querySelect(picker2, '.wardrobe-random').textContent.includes('再随机一次'), check('K2：随机按钮变为「再随机一次」'));

  /* 红线：随机绝不自动保存——存储里的 companionLook 仍是未自定义（null） */
  let stored = JSON.parse(page.sandbox.localStorage.getItem(STORAGE_KEY));
  assert.equal(stored.cosmetics.companionLook, null, check('K2 红线：随机试穿不写档案（companionLook 仍为 null）'));

  /* 红线：随机只选已拥有——每槽 is-selected 的格子不得带 is-locked */
  const ownedCheck = p => {
    const blocks = collectByClass(p, 'wardrobe-slot');
    blocks.forEach((block, i) => {
      const cells = collectByClass(block, 'wardrobe-option');
      const idx = cells.findIndex(c => c.classList.contains('is-selected'));
      assert.ok(idx >= 0, check(`K2：试穿后${slots[i].zh}槽有选中件`));
      assert.equal(cells[idx].classList.contains('is-locked'), false,
        check(`K2 红线：${slots[i].zh}槽随机选中的是已拥有部件（非锁定件）`));
    });
  };
  ownedCheck(picker2);

  /* 多轮随机：每轮都只落在已拥有集合里，且 20 轮内至少出现一次与初始不同
   * 的搭配（随机真的在随机；概率上失败 < 2^-20，非 flaky） */
  let sawDifferent = false;
  for (let round = 0; round < 20; round += 1) {
    const p = collectByClass(page.dom.body, 'picker-dialog').find(d => d.open === true);
    dispatch(querySelect(p, '.wardrobe-random'), 'click', {});
    const pNext = collectByClass(page.dom.body, 'picker-dialog').find(d => d.open === true);
    ownedCheck(pNext);
    const now = readSelected(pNext);
    if (slots.some(slot => now[slot.id] !== base[slot.id])) sawDifferent = true;
  }
  assert.ok(sawDifferent, check('K2：20 轮随机至少出现一次不同于初始的搭配（随机性成立）'));

  /* 撤销试穿 → 回到已保存搭配，试穿 UI 消失 */
  let p = collectByClass(page.dom.body, 'picker-dialog').find(d => d.open === true);
  const trialBefore = readSelected(p);
  dispatch(querySelect(p, '.wardrobe-trial-undo'), 'click', {});
  p = collectByClass(page.dom.body, 'picker-dialog').find(d => d.open === true);
  assert.equal(querySelect(p, '.wardrobe-trial-hint'), null, check('K2：撤销试穿后提示消失'));
  assert.equal(querySelect(p, '.wardrobe-trial-save'), null, check('K2：撤销试穿后保存按钮消失'));
  assert.deepEqual(readSelected(p), base, check('K2：撤销试穿回到已保存搭配（试穿组合被丢弃）'));

  /* 保存这套：随机 → 捕获试穿组合 → 保存 → 四槽写入档案与存储 */
  dispatch(querySelect(p, '.wardrobe-random'), 'click', {});
  p = collectByClass(page.dom.body, 'picker-dialog').find(d => d.open === true);
  const trial = readSelected(p);
  dispatch(querySelect(p, '.wardrobe-trial-save'), 'click', {});
  const look = page.progress.companionLook();
  slots.forEach(slot => {
    assert.equal(look[slot.id], trial[slot.id], check(`K2：保存后 ${slot.zh}槽 = 试穿所选`));
  });
  stored = JSON.parse(page.sandbox.localStorage.getItem(STORAGE_KEY));
  assert.ok(stored.cosmetics.companionLook, check('K2：保存这套已持久化 companionLook'));
  slots.forEach(slot => {
    assert.equal(stored.cosmetics.companionLook[slot.id], trial[slot.id], check(`K2：存储里 ${slot.zh}槽 = 试穿所选`));
  });
  p = collectByClass(page.dom.body, 'picker-dialog').find(d => d.open === true);
  assert.equal(querySelect(p, '.wardrobe-trial-hint'), null, check('K2：保存后试穿态结束'));
  assert.deepEqual(readSelected(p), trial, check('K2：保存后选中件 = 刚保存的搭配'));

  /* 关闭 picker 丢弃试穿：随机 → 关闭 → 重开无试穿态、选中仍是已保存搭配 */
  dispatch(querySelect(p, '.wardrobe-random'), 'click', {});
  p = collectByClass(page.dom.body, 'picker-dialog').find(d => d.open === true);
  assert.ok(querySelect(p, '.wardrobe-trial-hint'), check('K2：重开随机后再次进入试穿态'));
  dispatch(querySelect(p, '.dialog-close'), 'click', {});
  assert.equal(collectByClass(page.dom.body, 'picker-dialog').some(d => d.open === true), false, check('K2：picker 已关闭'));
  const picker3 = openWardrobe(page);
  assert.equal(querySelect(picker3, '.wardrobe-trial-hint'), null, check('K2 红线：关闭 picker 丢弃试穿（不跨会话残留）'));
  assert.deepEqual(readSelected(picker3), trial, check('K2：重开后选中件仍是已保存的搭配（未保存的随机被丢弃）'));
}

/* ===================== K3. 升级庆祝联动：bust 带 is-celebrating ===================== */
{
  /* 种子档案把载入即解锁的两个早期成就（first-steps/first-start）记在往日——
   * 否则新页面 startTimer 当场解锁它们，v4.4 I4 的「今天解锁过成就 → 庆祝脸」
   * 规则会让对照组自带庆祝，测不出 K3 的升级联动。 */
  const storage = makeStorage();
  storage.setItem(STORAGE_KEY, archiveJson({
    achievements: {
      'first-steps': '2026-01-01T08:00:00.000Z',
      'first-start': '2026-01-01T08:00:00.000Z'
    }
  }));
  const page = lessonPage(storage);
  /* 装备人形：人形 bust 的 alt 带「表情：xx」标注（生物形象只有名字），
   * 便于同时钉住 K3 的表情联动 */
  page.progress.equipCompanion('odin-boy');
  /* 打开学习伙伴面板（默认 auto 模式 → 大人形 bust） */
  dispatch(querySelect(page.dom.body, '.assistant-trigger'), 'click', {});
  let busts = collectByClass(page.dom.body, 'assistant-bust');
  assert.ok(busts.length >= 1, check('K3：伙伴面板打开后有 bust 形象'));
  assert.equal(busts.some(b => b.classList.contains('is-celebrating')), false, check('K3：未升级时 bust 不带庆祝动画类'));

  /* 完成第一课 → +40 XP → Lv.2 → onLevelUp → startCelebration + refreshAll */
  page.progress.setCompleted(true);
  assert.equal(page.progress.summary().level, 2, check('K3：完成第一课升到 Lv.2'));
  busts = collectByClass(page.dom.body, 'assistant-bust');
  assert.ok(busts.length >= 1, check('K3：升级后面板重画仍有 bust'));
  assert.ok(busts.some(b => b.classList.contains('is-celebrating')), check('K3：升级后 bust 带 .is-celebrating（庆祝轻动画）'));
  const celebrating = busts.find(b => b.classList.contains('is-celebrating'));
  assert.ok(celebrating.alt.includes('表情：庆祝'), check('K3：庆祝窗口内表情固定为「庆祝」'));

  /* 只存内存不写档案：存储里没有任何庆祝字段 */
  const stored = JSON.parse(storage.getItem(STORAGE_KEY));
  assert.equal(stored.celebrateUntil, undefined, check('K3 红线：庆祝窗口只存内存（档案无 celebrateUntil 字段）'));
  assert.equal(stored.xp, 40, check('K3：档案只记录了正常升级数据（xp=40）'));
}

/* ===================== K4. 等级进度条：aria 三值 + 本机总跨度分母 ===================== */
{
  /* 种子档案 xp=60：Lv.2（门槛 40），本级已得 20 / 跨度 60 → 33% */
  const storage = makeStorage();
  storage.setItem(STORAGE_KEY, archiveJson({ xp: 60 }));
  const page = newPage({ storage });
  const panel = querySelect(openProfile(page), '.profile-tabpanel');
  const bar = querySelect(panel, '.level-progress');
  assert.ok(bar, check('K4：形象 Tab 有等级进度条'));
  assert.equal(bar.getAttribute('role'), 'progressbar', check('K4：进度条 role=progressbar'));
  assert.equal(bar.getAttribute('aria-valuemin'), '0', check('K4：aria-valuemin=0'));
  assert.equal(bar.getAttribute('aria-valuemax'), '60', check('K4：aria-valuemax=本机总跨度（xpIntoLevel+xpToNext=60）'));
  assert.equal(bar.getAttribute('aria-valuenow'), '20', check('K4：aria-valuenow=本级已得 20'));
  assert.ok(bar.getAttribute('aria-label').includes('还差 40 XP'), check('K4：aria-label 报「还差 40 XP」（非线性曲线：Lv.2→3 跨度 60 不是 100）'));
  const fill = querySelect(bar, '.level-progress-fill');
  assert.equal(fill.style.width, '33%', check('K4：填充宽度 = round(20/60)=33%'));
  const label = querySelect(panel, '.level-progress-label');
  assert.ok(label.textContent.includes('Lv.2 → Lv.3') && label.textContent.includes('还差 40 XP'), check('K4：文字行含「Lv.2 → Lv.3：还差 40 XP」'));

  /* 全新档案 xp=0：0% 宽度、跨度 40（Lv.1→2 门槛） */
  const fresh = newPage({ storage: makeStorage() });
  const freshPanel = querySelect(openProfile(fresh), '.profile-tabpanel');
  const freshBar = querySelect(freshPanel, '.level-progress');
  assert.equal(freshBar.getAttribute('aria-valuemax'), '40', check('K4：Lv.1 跨度=40（新曲线首级门槛）'));
  assert.equal(querySelect(freshBar, '.level-progress-fill').style.width, '0%', check('K4：xp=0 时填充 0%'));
}

/* ===================== K5. 新手 1–5 级奖励预览 ===================== */
{
  const rowsOf = panel => {
    const preview = querySelect(panel, '.level-reward-preview');
    assert.ok(preview, check('K5：形象 Tab 有奖励预览 details'));
    assert.ok(querySelect(preview, 'summary').textContent.includes('1–5 级新手奖励预览'), check('K5：summary 文案'));
    return collectByClass(querySelect(preview, '.level-reward-list'), 'level-reward-lv')
      .map(lv => ({ lv: lv.textContent, names: lv.parentNode.children.find(c => c.classList.contains('level-reward-names')) }));
  };

  /* 全新 Lv.1：Lv.1 行已达到，Lv.2–5 行未达到 */
  const page = newPage({ storage: makeStorage() });
  const rows = rowsOf(querySelect(openProfile(page), '.profile-tabpanel'));
  assert.deepEqual(rows.map(r => r.lv), ['Lv.1', 'Lv.2', 'Lv.3', 'Lv.4', 'Lv.5'], check('K5：五行 = Lv.1 固定行 + Lv.2–5'));
  assert.ok(rows[0].names.classList.contains('is-reached'), check('K5：Lv.1 基础装束行标记已达到'));
  for (let i = 1; i < rows.length; i += 1) {
    assert.equal(rows[i].names.classList.contains('is-reached'), false, check(`K5：Lv.1 用户看 ${rows[i].lv} 行未标记已达到`));
    assert.ok(!rows[i].names.textContent.includes('已达到'), check(`K5：${rows[i].lv} 行文案无「已达到」`));
  }
  /* 名单与升级轻提示同源（level-curve 8a 钉住过 Lv.2 四件） */
  for (const name of ['新芽', '新芽框', '粗线毛衣', '圆框眼镜']) {
    assert.ok(rows[1].names.textContent.includes(name), check(`K5：Lv.2 预览行含「${name}」（与升级提示同一名单源）`));
  }
  for (const name of ['山顶旗帜', '暖炉', '终端狐']) {
    assert.ok(rows[4].names.textContent.includes(name), check(`K5：Lv.5 预览行含「${name}」`));
  }

  /* Lv.12 老用户：全部行已达到 */
  const storage = makeStorage();
  storage.setItem(STORAGE_KEY, archiveJson({ xp: 1180 }));
  const oldPage = newPage({ storage });
  const oldRows = rowsOf(querySelect(openProfile(oldPage), '.profile-tabpanel'));
  oldRows.forEach(row => {
    assert.ok(row.names.classList.contains('is-reached'), check(`K5：Lv.12 用户看 ${row.lv} 行全部 is-reached`));
  });
  /* Lv.1 固定行本来就不带「（已达到）」后缀（人人都在 Lv.1 之上）；Lv.2+ 行有 */
  oldRows.slice(1).forEach(row => {
    assert.ok(row.names.textContent.includes('已达到'), check(`K5：${row.lv} 行文案带「（已达到）」`));
  });
}

/* ===================== K8. 版本不匹配轻提示 ===================== */
{
  /* 正常页面：无提示 */
  const ok = newPage({ storage: makeStorage() });
  assert.equal(querySelect(ok.dom.body, '.version-mismatch-note'), null, check('K8：正常页面不出现版本提示'));
  assert.ok(querySelect(ok.dom.body, '.player-entry'), check('K8：正常页面功能齐全（对照组）'));

  /* 档案比代码新（schemaVersion 99）：持久轻提示 + 不阻断 */
  const storage = makeStorage();
  storage.setItem(STORAGE_KEY, archiveJson({ schemaVersion: 99 }));
  const page = newPage({ storage });
  assert.equal(page.progress.autoLoadInfo().failed, true, check('K8：schemaVersion 99 自动读档失败（前置条件）'));
  assert.ok(page.progress.autoLoadInfo().error.includes('schemaVersion'), check('K8：失败原因含 schemaVersion（前置条件）'));
  const note = querySelect(page.dom.body, '.version-mismatch-note');
  assert.ok(note, check('K8：出现版本不匹配轻提示'));
  assert.equal(note.getAttribute('role'), 'status', check('K8：提示 role=status（低干扰、可读屏）'));
  assert.ok(note.textContent.includes('Ctrl+F5'), check('K8：提示教用户强制刷新（Ctrl+F5）'));
  assert.ok(note.textContent.includes('数据没有丢'), check('K8：明确安抚「数据没有丢」'));
  assert.ok(querySelect(page.dom.body, '.player-entry'), check('K8：提示不阻断——页面照常渲染可用'));

  /* version.js 缺失（文件混装缓存）：另一条检测源 */
  const mixed = newPageWithoutVersion({ storage: makeStorage() });
  const mixedNote = querySelect(mixed.dom.body, '.version-mismatch-note');
  assert.ok(mixedNote, check('K8：version.js 缺失时出现轻提示'));
  assert.equal(mixedNote.getAttribute('role'), 'status', check('K8：缺失提示同样 role=status'));
  assert.ok(mixedNote.textContent.includes('version.js 缺失'), check('K8：文案点名 version.js 缺失'));
  assert.ok(mixedNote.textContent.includes('Ctrl+F5'), check('K8：同样建议强制刷新'));
  assert.equal(querySelect(mixed.dom.body, '.site-version'), null, check('K8：footer 版本行静默跳过（既有 A2 行为不变）'));
  assert.ok(querySelect(mixed.dom.body, '.player-entry'), check('K8：缺 version.js 页面其余功能照常'));
}

/* ===================== K7. 复制诊断信息（异步：剪贴板 Promise） ===================== */
(async () => {
  const storage = makeStorage();
  storage.setItem(STORAGE_KEY, archiveJson({
    coins: 123,
    profile: { nickname: '张三秘密', avatarId: 'terminal', avatarData: null, equippedFrameId: 'frame-basic' }
  }));
  const page = newPage({ storage });
  const dialog = openProfile(page);
  dispatch(querySelect(dialog, '#profile-tab-settings'), 'click', {});
  const settings = collectByClass(page.dom.body, 'profile-dialog').find(d => d.open === true);
  const copyButton = querySelect(settings, '.about-copy');
  assert.ok(copyButton, check('K7：设置 Tab「关于本站」有复制诊断信息按钮'));
  assert.ok(copyButton.getAttribute('aria-label').includes('不含任何学习数据'), check('K7：aria-label 明示不含学习数据'));

  /* stub 剪贴板：捕获写入文本 */
  let captured = null;
  page.sandbox.navigator.clipboard = {
    writeText(text) { captured = text; return Promise.resolve(); }
  };
  dispatch(copyButton, 'click', {});
  await new Promise(resolve => setImmediate(resolve));

  assert.ok(captured, check('K7：点击后调用了 clipboard.writeText'));
  const lines = captured.split('\n');
  assert.equal(lines.length, 5, check('K7：诊断信息恰好五行'));
  /* 产品名与版本从运行时 ODIN_VERSION 读取（version.js 同源），不硬编码品牌名——
   * 发布准备轮改名「Learning Garden → Odin 中文学习站」曾让旧硬编码断言失效。 */
  const k7Runtime = page.sandbox.window.ODIN_VERSION;
  assert.ok(lines[0].includes(`${k7Runtime.product} v${k7Runtime.version}`), check('K7：第 1 行 = 产品与版本（version.js 同源）'));
  assert.ok(lines[1].startsWith('页面：http'), check('K7：第 2 行 = 当前页面地址'));
  assert.ok(lines[2].includes('档案 schema：4'), check('K7：第 3 行 = 档案 schemaVersion'));
  assert.ok(lines[3].includes('存储模式：持久化'), check('K7：第 4 行 = 存储模式'));
  assert.ok(lines[4].includes('node-dom-stub'), check('K7：第 5 行 = UA'));
  /* 红线：绝不含个人数据（种子档案里埋了昵称与叶片余额做探针） */
  assert.equal(captured.includes('张三秘密'), false, check('K7 红线：诊断信息不含昵称'));
  assert.equal(captured.includes('123'), false, check('K7 红线：诊断信息不含叶片余额'));
  assert.equal(captured.includes('xp'), false, check('K7 红线：诊断信息不含 XP 字段'));
  assert.equal(copyButton.textContent, '已复制 ✓', check('K7：按钮反馈「已复制 ✓」'));

  console.log(`stretch-k.test.cjs：全部 ${checks} 项断言通过 ✔`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
