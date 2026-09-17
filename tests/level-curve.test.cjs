/* v4.5 Batch 6（交接 Core E）：非线性等级曲线 + 前 5 级等级奖励测试。
 *
 * 覆盖（交接测试要求 #9/#10/#11 + Core E1/E2 硬约束）：
 *   1. E1 曲线值：Lv.2 门槛 = 40（第一课 +40 XP 必升级）、Lv.2–Lv.7 取交接
 *      建议表值、Lv.8 起因「不降级」硬约束收敛回旧线性门槛、Lv.10 以上线性延续；
 *   2. 单调性 + 逆运算：levelOf 随 XP 单调不减、xpForLevel 随等级严格递增、
 *      两者互为逆运算（#9 level curve monotonic + Lv1→2 at 40 XP）；
 *   3. 不降级：任意 XP 下新等级 ≥ 旧线性等级 floor(xp/100)+1（E2 硬要求）；
 *   4. 旧用户兼容（#10 旧用户 XP 不丢、不负增长）：导入旧档案 XP 原样保留、
 *      高 XP 用户等级与已解锁资产不缩水；
 *   5. collections.js 复刻与 progress.js 真源同步（表值一致 + 密集采样一致）；
 *   6. E2 奖励编排：Lv.2–Lv.5 每级 ≥ 头像×1 + 头像框×1 + 主题/伙伴形象/
 *      伙伴装扮×1，Lv.5 更丰富；等级奖励全部是装扮（零经济发放，不发叶片）；
 *   7. settleLevelCelebration 棘轮（#11 level reward flags 防重复）：重复调用
 *      返回空、一次跨多级只产生一条事件、旧档案载入种到当前等级不追溯祝贺、
 *      celebratedLevel 随档案导出导入往返；
 *   8. UI 集成：完成第一课 → 一条合并式「升级 + 新解锁」轻提示（非 Modal）、
 *      不连弹；重载不再祝贺；导入高级档案一条「连升」合并提示。
 *
 * 运行：node tests/level-curve.test.cjs */
const assert = require('node:assert/strict');

let checks = 0;
const check = label => { checks += 1; return label; };

const {
  querySelect, collectByClass, makeStorage,
  newPage, archiveJson, FIRST_LESSON, STORAGE_KEY
} = require('./dom-stub.cjs');

const page0 = newPage({ storage: makeStorage() });
const Logic = page0.progress.Logic;
const collections = page0.sandbox.window.ODIN_COLLECTIONS;
const local = value => JSON.parse(JSON.stringify(value));

/* 交接 Core E1 建议表（Lv.1–Lv.7 原样采用；Lv.8–Lv.10 因「已有用户不得
 * 降级」硬约束收敛为旧线性门槛 700/800/900，取舍记录见 progress.js 常量注释）。 */
const EXPECTED_CURVE = [0, 40, 100, 180, 280, 400, 550, 700, 800, 900];

/* ===================== 1. E1：曲线值 ===================== */
{
  assert.deepEqual(local(Logic.LEVEL_CURVE), EXPECTED_CURVE, check('E1：LEVEL_CURVE 表值（Lv.2=40 … Lv.7=550 取交接建议值，Lv.8–10 收敛为不降级门槛）'));
  assert.equal(Logic.XP_FIRST_LESSON_COMPLETE, 40, check('E1：第一课首次完成 +40 XP（既有经济不变）'));
  assert.equal(Logic.levelOf(0), 1, check('E1：0 XP 为 Lv.1'));
  assert.equal(Logic.levelOf(39), 1, check('E1：39 XP 仍为 Lv.1'));
  assert.equal(Logic.levelOf(40), 2, check('E1 硬要求：第一课 +40 XP 必须升 Lv.2'));
  assert.equal(Logic.levelOf(100), 3, check('E1：Lv.3 门槛 100'));
  assert.equal(Logic.levelOf(180), 4, check('E1：Lv.4 门槛 180'));
  assert.equal(Logic.levelOf(280), 5, check('E1：Lv.5 门槛 280'));
  assert.equal(Logic.levelOf(400), 6, check('E1：Lv.6 门槛 400'));
  assert.equal(Logic.levelOf(550), 7, check('E1：Lv.7 门槛 550'));
  assert.equal(Logic.levelOf(700), 8, check('E1：Lv.8 门槛 700（= 旧线性，不降级）'));
  assert.equal(Logic.levelOf(900), 10, check('E1：Lv.10 门槛 900（= 旧线性，不降级）'));
  assert.equal(Logic.xpForLevel(11), 1000, check('E1：Lv.10 以上线性延续（每级 +100）'));
  assert.equal(Logic.xpForLevel(21), 2000, check('E1：Lv.21 门槛 2000（与旧线性区无缝）'));
  /* 前期确实比旧曲线快：同 XP 下新等级 ≥ 旧等级，且 Lv.2–Lv.7 严格更快 */
  assert.ok(Logic.levelOf(40) > Math.floor(40 / 100) + 1, check('E1：40 XP 新曲线（Lv.2）快于旧线性（Lv.1）'));
  assert.ok(Logic.levelOf(280) > Math.floor(280 / 100) + 1, check('E1：280 XP 新曲线（Lv.5）快于旧线性（Lv.3）'));
}

/* ===================== 2. 单调性 + 逆运算（测试要求 #9） ===================== */
{
  let prevLevel = 0;
  let monotonic = true;
  let inverse = true;
  for (let xp = 0; xp <= 3000; xp += 1) {
    const level = Logic.levelOf(xp);
    if (level < prevLevel) monotonic = false;
    prevLevel = level;
    /* levelOf 与 xpForLevel 互为逆运算：本级门槛 ≤ xp < 下一级门槛 */
    if (!(Logic.xpForLevel(level) <= xp && xp < Logic.xpForLevel(level + 1))) inverse = false;
  }
  assert.ok(monotonic, check('#9：levelOf 在 0–3000 XP 全域单调不减'));
  assert.ok(inverse, check('#9：xpForLevel(levelOf(x)) ≤ x < xpForLevel(levelOf(x)+1) 全域成立'));
  let strictlyIncreasing = true;
  for (let level = 1; level <= 40; level += 1) {
    if (Logic.xpForLevel(level + 1) <= Logic.xpForLevel(level)) strictlyIncreasing = false;
  }
  assert.ok(strictlyIncreasing, check('#9：xpForLevel 在 Lv.1–Lv.41 严格递增'));
}

/* ===================== 3. 不降级（E2 硬要求） ===================== */
{
  let noDemotion = true;
  let worst = null;
  for (let xp = 0; xp <= 5000; xp += 1) {
    const oldLevel = Math.floor(xp / 100) + 1;   /* v4.4 及以前的线性曲线 */
    const newLevel = Logic.levelOf(xp);
    if (newLevel < oldLevel) { noDemotion = false; worst = worst || { xp, oldLevel, newLevel }; }
  }
  assert.ok(noDemotion, check(`E2 硬要求：0–5000 XP 全域新等级 ≥ 旧线性等级，存量用户永不降级${worst ? `（反例 ${JSON.stringify(worst)}）` : ''}`));
  /* Lv.10 以上与旧曲线完全重合（线性延续），高等级老用户的后续升级节奏不变 */
  assert.equal(Logic.levelOf(1180), Math.floor(1180 / 100) + 1, check('E2：1180 XP 新旧同为 Lv.12（线性区无缝）'));
  assert.equal(Logic.levelOf(2500), Math.floor(2500 / 100) + 1, check('E2：2500 XP 新旧同为 Lv.26（线性区无缝）'));
}

/* ===================== 4. 旧用户兼容（测试要求 #10） ===================== */
{
  /* 旧档案（无 celebratedLevel 字段、xp=1180 → 旧曲线 Lv.12）导入：
   * XP 原样保留不重算不扣除；等级不降；已解锁资产不缩水。 */
  const legacyText = archiveJson({ xp: 1180, schemaVersion: 4 });
  const parsed = Logic.parseImport(legacyText, []);
  assert.equal(parsed.ok, true, check('#10：旧档案可导入'));
  assert.equal(parsed.state.xp, 1180, check('#10：旧用户 XP 数值不重算、不扣除'));
  assert.equal(Logic.levelOf(parsed.state.xp), 12, check('#10：旧 Lv.12 用户（1180 XP）新曲线下仍是 Lv.12，不降级'));
  assert.equal(parsed.state.celebratedLevel, 12, check('#10/E2：旧档案缺 celebratedLevel → 种到当前等级（补「已达到等级」状态，不追溯祝贺）'));
  /* 等级解锁资产不缩水：Lv.10 金框、Lv.6 键盘头像仍解锁；Lv.15 芯片仍锁 */
  const gold = Logic.FRAMES.find(f => f.id === 'frame-gold');
  const keyboard = page0.sandbox.window.ODIN_AVATARS.avatars.find(a => a.id === 'keyboard');
  const chip = page0.sandbox.window.ODIN_AVATARS.avatars.find(a => a.id === 'chip');
  assert.equal(collections.isAssetUnlocked(parsed.state, { type: 'frame', id: gold.id, unlock: gold.unlock }), true, check('#10：Lv.10 金色框对旧 Lv.12 用户保持解锁'));
  assert.equal(collections.isAssetUnlocked(parsed.state, { type: 'avatar', id: keyboard.id, unlock: keyboard.unlock }), true, check('#10：Lv.6 键盘头像保持解锁'));
  assert.equal(collections.isAssetUnlocked(parsed.state, { type: 'avatar', id: chip.id, unlock: chip.unlock }), false, check('#10：Lv.15 芯片头像在 Lv.12 仍未解锁（解锁语义不变）'));
  /* 新档案：celebratedLevel 默认 1 */
  const freshParsed = Logic.parseImport(archiveJson(), []);
  assert.equal(freshParsed.state.celebratedLevel, 1, check('E2：新档案 celebratedLevel 默认 1'));
  /* 手改垃圾高值被夹回当前等级（不会吞掉之后的升级祝贺） */
  const dirty = Logic.parseImport(archiveJson({ xp: 300, celebratedLevel: 99 }), []);
  assert.equal(dirty.state.celebratedLevel, 5, check('E2：celebratedLevel 垃圾高值被夹到当前等级（300 XP → Lv.5）'));
  /* celebratedLevel 随导出导入往返 */
  const exported = JSON.parse(Logic.exportJson(dirty.state, '2026-09-11T08:00:00.000Z'));
  assert.equal(exported.celebratedLevel, 5, check('E2：导出档案带 celebratedLevel'));
  assert.equal(Logic.parseImport(JSON.stringify(exported), []).state.celebratedLevel, 5, check('E2：celebratedLevel 导出导入往返一致'));
}

/* ===================== 5. collections.js 复刻同步 ===================== */
{
  assert.deepEqual(local(collections.LEVEL_CURVE), EXPECTED_CURVE, check('collections.LEVEL_CURVE 与 progress.js 真源一致'));
  assert.equal(collections.XP_PER_LEVEL, Logic.XP_PER_LEVEL, check('collections.XP_PER_LEVEL 与真源一致（线性区步长）'));
  let same = true;
  for (let xp = 0; xp <= 2000; xp += 1) {
    if (collections.levelOf(xp) !== Logic.levelOf(xp)) { same = false; break; }
  }
  assert.ok(same, check('collections.levelOf 与 progress.levelOf 在 0–2000 全域逐点一致（复刻被钉住）'));
}

/* ===================== 6. E2：前 5 级奖励编排 ===================== */
{
  const W = page0.sandbox.window.ODIN_COMPANION_WARDROBE;
  const AVATARS = page0.sandbox.window.ODIN_AVATARS.avatars;
  const THEMES = page0.sandbox.window.ODIN_THEMES.themes;
  const COMPANIONS = page0.sandbox.window.ODIN_COMPANIONS.companions;
  const FRAMES = Logic.FRAMES;
  const atLevel = (list, lv) => [...list].filter(a => a.unlock && a.unlock.kind === 'level' && a.unlock.value === lv).map(a => a.zh);

  for (const lv of [2, 3, 4, 5]) {
    const avatars = atLevel(AVATARS, lv);
    const frames = atLevel(FRAMES, lv);
    const looks = [...atLevel(THEMES, lv), ...atLevel(COMPANIONS, lv),
      ...atLevel(W.HAIRS, lv), ...atLevel(W.OUTFITS, lv), ...atLevel(W.ACCESSORIES, lv), ...atLevel(W.PALETTES, lv)];
    assert.ok(avatars.length >= 1, check(`E2：Lv.${lv} 有头像奖励（${avatars.join('、')}）`));
    assert.ok(frames.length >= 1, check(`E2：Lv.${lv} 有头像框奖励（${frames.join('、')}）`));
    assert.ok(looks.length >= 1, check(`E2：Lv.${lv} 有主题/伙伴形象/伙伴装扮奖励（${looks.join('、')}）`));
  }
  /* Lv.5 明显更丰富：四类加起来 ≥ 4 件 */
  const lv5Total = [...AVATARS, ...FRAMES, ...THEMES, ...COMPANIONS,
    ...W.HAIRS, ...W.OUTFITS, ...W.ACCESSORIES, ...W.PALETTES]
    .filter(a => a.unlock && a.unlock.kind === 'level' && a.unlock.value === 5).length;
  assert.ok(lv5Total >= 4, check(`E2：Lv.5 奖励明显更多（共 ${lv5Total} 件 ≥ 4）`));
  /* 不要全部只给叶片：等级奖励全部是装扮解锁；叶片规则表里没有任何
   * 「按等级发叶片」的经济规则（升级零经济发放 → 无追溯狂发风险）。 */
  const levelRewards = [...AVATARS, ...FRAMES, ...THEMES, ...COMPANIONS]
    .filter(a => a.unlock && a.unlock.kind === 'level');
  assert.ok(levelRewards.length >= 10, check(`E2：等级解锁装扮已成体系（四类共 ${levelRewards.length} 件 ≥ 10）`));
  const coinRules = [...page0.sandbox.window.ODIN_ECONOMY.COIN_RULES];
  assert.ok(coinRules.every(rule => !String(rule.id).includes('level') && !String(rule.zh).includes('等级')),
    check('E2：叶片规则表无「按等级发放」条目（等级奖励全是装扮，不是叶片）'));
  /* 新增资产 id 卫生：seedling/telescope/summit + frame-sprout/frame-terra 存在且唯一 */
  for (const id of ['seedling', 'telescope', 'summit']) {
    assert.equal(AVATARS.filter(a => a.id === id).length, 1, check(`E2：新头像 ${id} 存在且 id 唯一`));
  }
  for (const id of ['frame-sprout', 'frame-terra']) {
    assert.equal(FRAMES.filter(f => f.id === id).length, 1, check(`E2：新头像框 ${id} 存在且 id 唯一`));
  }
  /* 旧资产 id 一个不删不改名（红线）：既有等级款仍在原位 */
  for (const id of ['hex', 'keyboard', 'server', 'chip', 'frame-ring', 'frame-leaf', 'frame-wave', 'frame-gold', 'frame-dawn']) {
    const pool = id.startsWith('frame-') ? FRAMES : AVATARS;
    assert.ok([...pool].some(a => a.id === id), check(`E2 红线：旧资产 ${id} 未被删除/改名`));
  }
}

/* ===================== 7. settleLevelCelebration 棘轮（测试要求 #11） ===================== */
{
  const state = Logic.emptyState();
  assert.equal(Logic.settleLevelCelebration(state), null, check('#11：Lv.1 无升级不触发'));
  state.xp = 40;
  const first = Logic.settleLevelCelebration(state);
  assert.equal(first.fromLevel, 1, check('#11：首次升级事件 fromLevel=1'));
  assert.equal(first.toLevel, 2, check('#11：首次升级事件 toLevel=2'));
  assert.equal(state.celebratedLevel, 2, check('#11：celebratedLevel 棘轮写入状态'));
  assert.equal(Logic.settleLevelCelebration(state), null, check('#11 防重复：同等级重复结算返回空（刷新/重复 tick 不重发）'));
  /* 一次跨多级只产生一条合并事件（UI 只发一条提示，不连弹） */
  state.xp = 319;
  const jump = Logic.settleLevelCelebration(state);
  assert.equal(jump.fromLevel, 2, check('#11：跨多级事件 fromLevel=2'));
  assert.equal(jump.toLevel, 5, check('#11：319 XP 一步到 Lv.5，只产生一条 {2→5} 合并事件'));
  assert.equal(Logic.settleLevelCelebration(state), null, check('#11：跨级结算后再次防重复'));
  /* XP 回落（理论不可能，手改档案）也不会倒退祝贺 */
  state.xp = 100;
  assert.equal(Logic.settleLevelCelebration(state), null, check('#11：XP 回落不产生事件（棘轮只升不降）'));
}

/* ===================== 8. UI 集成：合并式升级轻提示 ===================== */
function levelNotes(page) {
  return collectByClass(page.dom.body, 'achievement-note').filter(n => n.textContent.includes('升级啦'));
}
function lessonPage(storage, id) {
  return newPage({
    storage, page: 'lesson',
    search: `?id=${id || FIRST_LESSON}`,
    href: `http://127.0.0.1:8799/lesson.html?id=${id || FIRST_LESSON}`
  });
}

{
  /* 8a. 完成第一课：+40 XP → Lv.2 → 一条合并提示（升级 + 新解锁名单） */
  const storage = makeStorage();
  const page = lessonPage(storage);
  assert.equal(page.progress.summary().level, 1, check('UI：初始 Lv.1'));
  page.progress.setCompleted(true);
  assert.equal(page.progress.summary().level, 2, check('E1 端到端：完成第一课（+40 XP）升到 Lv.2'));
  const notes = levelNotes(page);
  assert.equal(notes.length, 1, check('E2：升级只发一条合并式轻提示（不连弹）'));
  assert.equal(notes[0].tagName, 'P', check('E2：提示是底部静态小条（achievement-note），不是 Modal'));
  assert.equal(notes[0].getAttribute('role'), 'status', check('E2：提示带 role=status（低干扰、可读屏）'));
  assert.ok(notes[0].textContent.includes('Lv.1 → Lv.2'), check('E2：提示文案含「Lv.1 → Lv.2」'));
  for (const name of ['新芽', '新芽框', '粗线毛衣', '圆框眼镜']) {
    assert.ok(notes[0].textContent.includes(name), check(`E2：Lv.2 新解锁名单报出「${name}」（头像+头像框+装扮×2）`));
  }
  /* 棘轮与历史已持久化 */
  const stored = JSON.parse(storage.getItem(STORAGE_KEY));
  assert.equal(stored.celebratedLevel, 2, check('#11：celebratedLevel 已写入存储（重载不重复祝贺）'));
  assert.ok(stored.history.some(e => e.type === 'level-up' && e.zh === '达到 Lv.2'), check('E2：升级记入学习历史（level-up · 达到 Lv.2，一批一条）'));

  /* 8b. 重载（同存储新课页）：不重复祝贺 */
  const page2 = lessonPage(storage);
  assert.equal(page2.progress.summary().level, 2, check('UI：重载后仍 Lv.2'));
  assert.equal(levelNotes(page2).length, 0, check('#11：重载不重复弹升级提示（celebratedLevel 棘轮生效）'));

  /* 8c. 再升一级（跨到 Lv.4 边界）：新的一条合并提示 */
  const page3 = lessonPage(storage);
  page3.progress.setOfficialCompleted(true);   /* +20 → 60 XP，仍 Lv.2 */
  assert.equal(levelNotes(page3).length, 0, check('UI：未跨门槛不发提示'));
  page3.progress.setQuizCompleted(true);       /* +10 → 70 XP，仍 Lv.2 */
  assert.equal(levelNotes(page3).length, 0, check('UI：70 XP 仍 Lv.2 不发提示'));
}

{
  /* 8d. 旧高级档案载入：静默补状态，绝不追溯狂发祝贺 */
  const storage = makeStorage();
  storage.setItem(STORAGE_KEY, archiveJson({ xp: 1180, schemaVersion: 4 }));
  const page = lessonPage(storage);
  assert.equal(page.progress.summary().level, 12, check('E2：旧 Lv.12 用户载入后仍 Lv.12（不降级）'));
  assert.equal(levelNotes(page).length, 0, check('E2 安全策略：旧档案载入选种 celebratedLevel，不追溯弹升级提示'));
  const stored = JSON.parse(storage.getItem(STORAGE_KEY));
  assert.equal(stored.celebratedLevel, 12, check('E2：「已达到等级」状态已静默补记并持久化'));
  assert.equal(stored.xp, 1180, check('#10：载入后 XP 未被改动'));
}

{
  /* 8e. 会话内连续升级：每次跨门槛恰好一条，内容含该级新解锁 */
  const storage = makeStorage();
  storage.setItem(STORAGE_KEY, archiveJson({ xp: 239, celebratedLevel: 4 }));
  const page = lessonPage(storage);
  assert.equal(page.progress.summary().level, 4, check('UI：种子档案 239 XP = Lv.4'));
  page.progress.setCompleted(true);            /* +40 → 279，仍 Lv.4 */
  assert.equal(levelNotes(page).length, 0, check('UI：279 XP 差 1 XP 到 Lv.5，不发提示'));
  page.progress.setOfficialCompleted(true);    /* +20 → 299 → Lv.5 */
  const notes = levelNotes(page);
  assert.equal(notes.length, 1, check('UI：跨过 Lv.5 门槛恰好一条提示'));
  assert.ok(notes[0].textContent.includes('Lv.4 → Lv.5'), check('UI：文案含「Lv.4 → Lv.5」'));
  for (const name of ['山顶旗帜', '叶脉进阶框', '暖炉', '终端狐', '沃野']) {
    assert.ok(notes[0].textContent.includes(name), check(`E2：Lv.5 合并提示报出「${name}」（Lv.5 奖励明显更丰富）`));
  }
}

{
  /* 8f. 一次导入跨多级：一条「连升」合并提示，不是 N 条、更不是 Modal */
  const storage = makeStorage();
  const page = newPage({ storage });
  page.progress.importArchive(archiveJson({ xp: 280, celebratedLevel: 1 }));
  const notes = levelNotes(page);
  assert.equal(notes.length, 1, check('E2：导入跨 4 级只产生一条合并提示（不连弹 4 条/4 个 Modal）'));
  assert.ok(notes[0].textContent.includes('Lv.1 → Lv.5'), check('UI：连升文案含「Lv.1 → Lv.5」'));
  assert.ok(notes[0].textContent.includes('连升 4 级'), check('UI：连升提示标注级数'));
  const openDialogs = ['profile-dialog', 'picker-dialog', 'assistant-dialog', 'catalog-dialog']
    .flatMap(cls => collectByClass(page.dom.body, cls)).filter(d => d.open === true);
  assert.equal(openDialogs.length, 0, check('E2：升级祝贺不弹任何 Modal（资料/装扮/伙伴/目录对话框全未打开）'));
}

/* ===================== 9. summary 曲线口径 ===================== */
{
  const state = Logic.emptyState();
  state.xp = 250;
  const s = Logic.summary(state, [], '2026-09-11');
  assert.equal(s.level, 4, check('summary：250 XP = Lv.4'));
  assert.equal(s.xpIntoLevel, 70, check('summary：本级已得 = 250 − 180 = 70（非线性口径，不再对 100 取模）'));
  assert.equal(s.xpToNext, 30, check('summary：距下一级 = 280 − 250 = 30'));
  state.xp = 950;
  const s2 = Logic.summary(state, [], '2026-09-11');
  assert.equal(s2.level, 10, check('summary：950 XP = Lv.10（线性区）'));
  assert.equal(s2.xpIntoLevel, 50, check('summary：线性区本级已得 = 950 − 900 = 50'));
  assert.equal(s2.xpToNext, 50, check('summary：线性区距下一级 = 1000 − 950 = 50'));
}

console.log(`level-curve.test.cjs：全部 ${checks} 项断言通过 ✔`);
