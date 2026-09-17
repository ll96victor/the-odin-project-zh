/* v4.5 Batch 5（交接 Core D）：人形装扮参数化系统测试。
 *
 * 覆盖：
 *   1. 部件数量达到 D2 第一批最低值（6–10 发型 / 8–12 服装 / 6–10 配饰 /
 *      5+ 表情 / 6+ 色板 / 少年少女两体型），且基础款足够免费（不一墙锁）；
 *   2. build 确定性 + 合法 SVG（viewBox 128）+ 不同部件产出不同图 + 单套小体积；
 *   3. sanitizeLook / sanitizeDress 白名单：非法回落默认、合法保留（test #8）；
 *   4. progress 集成：companionLook 默认 null、setCompanionLook 持久化 + 白名单
 *      拒绝、file:// 降级、导出导入往返、旧档案缺字段补 null 不丢其它；
 *   5. UI：装扮 picker 从形象 Tab 与伙伴面板均可打开（交接 G 同源）、四槽渲染、
 *      实时大人形预览、选用免费件即时生效、未解锁件显示解锁条件/叶片购买而非选用。
 *
 * 运行：node tests/companion-wardrobe.test.cjs */
const assert = require('node:assert/strict');

let checks = 0;
const check = label => { checks += 1; return label; };

const {
  querySelect, collectByClass, dispatch, makeStorage,
  newPage, archiveJson, STORAGE_KEY
} = require('./dom-stub.cjs');

function seededStorage(overrides) {
  const storage = makeStorage();
  storage.setItem(STORAGE_KEY, archiveJson(overrides));
  return storage;
}

/* 取一个已载入 wardrobe 的页面（wardrobe 在 sandbox 里，build/sanitize 返回
 * 字符串/普通对象，跨 realm 比较标量与 JSON 安全）。 */
function wardrobeOf(page) { return page.sandbox.window.ODIN_COMPANION_WARDROBE; }

/* ===================== 1. 部件数量与免费度（D2） ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const W = wardrobeOf(page);
  assert.ok(W, check('D：ODIN_COMPANION_WARDROBE 已载入'));
  assert.ok(W.HAIRS.length >= 6 && W.HAIRS.length <= 10, check(`D2：发型 6–10（实际 ${W.HAIRS.length}）`));
  assert.ok(W.OUTFITS.length >= 8 && W.OUTFITS.length <= 12, check(`D2：服装 8–12（实际 ${W.OUTFITS.length}）`));
  assert.ok(W.ACCESSORIES.length >= 6 && W.ACCESSORIES.length <= 10, check(`D2：配饰 6–10（实际 ${W.ACCESSORIES.length}）`));
  assert.ok(W.MOODS.length >= 5, check(`D2：表情 5+（实际 ${W.MOODS.length}）`));
  assert.ok(W.PALETTES.length >= 6, check(`D2：色板 6+（实际 ${W.PALETTES.length}）`));
  assert.deepEqual([...W.BODY_IDS], ['boy', 'girl'], check('D2：少年/少女两个基础体型继续存在'));

  /* 基础款足够免费（交接 D2：不能又做成一墙锁） */
  const freeCount = list => list.filter(x => x.unlock && x.unlock.kind === 'default').length;
  assert.ok(freeCount(W.HAIRS) >= 2, check(`D2：免费发型 ≥2（实际 ${freeCount(W.HAIRS)}）`));
  assert.ok(freeCount(W.OUTFITS) >= 3, check(`D2：免费服装 ≥3（实际 ${freeCount(W.OUTFITS)}）`));
  assert.ok(freeCount(W.ACCESSORIES) >= 2, check(`D2：免费配饰 ≥2（含「无」，实际 ${freeCount(W.ACCESSORIES)}）`));
  assert.ok(freeCount(W.PALETTES) >= 2, check(`D2：免费色板 ≥2（实际 ${freeCount(W.PALETTES)}）`));
  /* 解锁来源多样：default / level / achievement / coins 都要有（交接 D2 四种来源） */
  const kinds = new Set();
  [...W.HAIRS, ...W.OUTFITS, ...W.ACCESSORIES, ...W.PALETTES].forEach(p => kinds.add(p.unlock.kind));
  ['default', 'level', 'achievement', 'coins'].forEach(k => {
    assert.ok(kinds.has(k), check(`D2：解锁来源覆盖「${k}」`));
  });

  /* 部件 id 白名单卫生：同槽内 id 唯一、格式合法（小写字母数字连字符） */
  const idOk = /^[a-z][a-z0-9-]{0,31}$/;
  [['HAIRS', W.HAIRS], ['OUTFITS', W.OUTFITS], ['ACCESSORIES', W.ACCESSORIES], ['PALETTES', W.PALETTES]].forEach(pair => {
    const ids = pair[1].map(x => x.id);
    assert.equal(new Set(ids).size, ids.length, check(`D：${pair[0]} id 唯一`));
    ids.forEach(id => assert.ok(idOk.test(id), check(`D：${pair[0]} id「${id}」格式合法`)));
  });
}

/* ===================== 2. build 确定性 / 合法 SVG / 差异化 / 体积 ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const W = wardrobeOf(page);
  const look = { body: 'girl', hair: 'long', outfit: 'dress', accessory: 'glasses', palette: 'bloom' };
  const a = W.build(look, 'happy');
  const b = W.build(look, 'happy');
  assert.equal(a, b, check('D1：同输入必同输出（确定性，无随机无时间依赖）'));
  assert.ok(a.startsWith('<svg') && a.endsWith('</svg>'), check('D1：build 产出合法 <svg>'));
  assert.ok(a.includes('viewBox="0 0 128 128"'), check('D1：viewBox 128（与既有 bust 一致，测试锚点）'));
  assert.ok(a.length < 4096, check(`D1：单套组合体积极小（${a.length} 字节 < 4KB）`));
  /* 不同部件 → 不同图（证明部件真的参与拼装，不是一张死图） */
  assert.notEqual(W.build(look, 'happy'), W.build(Object.assign({}, look, { outfit: 'hoodie' }), 'happy'),
    check('D1：换服装产出不同 SVG'));
  assert.notEqual(W.build(look, 'happy'), W.build(Object.assign({}, look, { palette: 'sea' }), 'happy'),
    check('D1：换色板产出不同 SVG'));
  assert.notEqual(W.build(look, 'happy'), W.build(look, 'celebrate'),
    check('D1：换表情产出不同 SVG'));
  /* icon 是头部裁切（64 viewBox），与 build 不同尺寸 */
  const ic = W.icon(look);
  assert.ok(ic.includes('viewBox="24 6 80 80"'), check('D1：icon 是头部裁切（小图标）'));
  /* 所有部件组合都不抛错、都产出合法 svg（全量冒烟；不计入具名断言以免爆量） */
  let combos = 0;
  W.BODY_IDS.forEach(body => W.HAIRS.forEach(h => W.OUTFITS.forEach(o => W.ACCESSORIES.forEach(ac => W.PALETTES.forEach(p => {
    const svg = W.build({ body, hair: h.id, outfit: o.id, accessory: ac.id, palette: p.id }, 'normal');
    if (!(svg.startsWith('<svg') && svg.endsWith('</svg>'))) throw new Error(`非法 svg：${body}/${h.id}/${o.id}/${ac.id}/${p.id}`);
    combos += 1;
  })))));
  assert.equal(combos, 2 * W.HAIRS.length * W.OUTFITS.length * W.ACCESSORIES.length * W.PALETTES.length,
    check(`D1：全量 ${combos} 套组合运行时生成合法 SVG，不预存图片`));
}

/* ===================== 3. sanitize 白名单（test #8） ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const W = wardrobeOf(page);
  const clean = W.sanitizeDress({ hair: 'long', outfit: 'nope', accessory: null, palette: 'sea' });
  assert.equal(clean.hair, 'long', check('D1：合法 hair 保留'));
  assert.equal(clean.outfit, W.DEFAULT_DRESS.outfit, check('D1：非法 outfit 回落默认'));
  assert.equal(clean.accessory, W.DEFAULT_DRESS.accessory, check('D1：null accessory 回落默认'));
  assert.equal(clean.palette, 'sea', check('D1：合法 palette 保留'));
  const empty = W.sanitizeDress(null);
  assert.deepEqual(Object.keys(empty).sort(), ['accessory', 'hair', 'outfit', 'palette'], check('D1：sanitizeDress 只含四槽'));
  assert.equal(empty.hair, 'short', check('D1：空输入回落默认发型'));
  const full = W.sanitizeLook({ body: 'xxx', hair: 'long', outfit: 'dress', accessory: 'glasses', palette: 'bloom' });
  assert.equal(full.body, 'boy', check('D1：非法 body 回落默认体型'));
  assert.equal(full.hair, 'long', check('D1：sanitizeLook 保留合法槽'));
  assert.equal(W.defaultDressFor('girl').hair, 'bob', check('D1：少女默认波波头'));
  assert.equal(W.defaultDressFor('boy').hair, 'short', check('D1：少年默认短发'));
}

/* ===================== 4. progress 集成：持久化 / 白名单 / 迁移 ===================== */
{
  const page = newPage({ storage: makeStorage() });
  assert.equal(page.progress.companionLook(), null, check('D1：新档案 companionLook 默认 null（未自定义）'));
  const r1 = page.progress.setCompanionLook('hair', 'ponytail');
  assert.equal(r1.ok, true, check('D1：setCompanionLook 持久化模式成功'));
  const look = page.progress.companionLook();
  assert.equal(look.hair, 'ponytail', check('D1：发型写入'));
  assert.equal(look.outfit, 'hoodie', check('D1：未改的槽回落默认（不丢其它槽）'));
  /* 非法槽 / 非法 id 拒绝，不污染档案 */
  assert.equal(page.progress.setCompanionLook('bogus', 'x').ok, false, check('D1：未知槽拒绝'));
  assert.equal(page.progress.setCompanionLook('hair', '不存在').ok, false, check('D1：非法部件 id 拒绝'));
  assert.equal(page.progress.companionLook().hair, 'ponytail', check('D1：拒绝后原值不变'));

  /* 导出含 companionLook，导入往返一致 */
  const exported = JSON.parse(page.progress.exportArchive());
  assert.ok(exported.cosmetics && exported.cosmetics.companionLook, check('D1：导出档案含 companionLook'));
  assert.equal(exported.cosmetics.companionLook.hair, 'ponytail', check('D1：导出发型正确'));

  /* 旧档案（无 companionLook）导入 → 补 null，其它 cosmetics 字段不丢 */
  const legacy = JSON.parse(archiveJson());
  legacy.cosmetics = { purchases: { 'companion:cat': true }, companionId: 'cat', themeId: 'forest' };
  const rp = page.progress.Logic.parseImport(JSON.stringify(legacy), []);
  assert.equal(rp.ok, true, check('D1：旧档案可导入'));
  assert.equal(rp.state.cosmetics.companionLook, null, check('D1：旧档案缺 companionLook → null'));
  assert.equal(rp.state.cosmetics.companionId, 'cat', check('D1：旧档案 companionId 不丢'));
  assert.equal(rp.state.cosmetics.themeId, 'forest', check('D1：旧档案 themeId 不丢'));
  assert.equal(rp.state.cosmetics.purchases['companion:cat'], true, check('D1：旧档案购买记录不丢'));

  /* 非法 companionLook（塞了不存在的部件）导入 → 白名单回落，不入库脏 id */
  const dirty = JSON.parse(archiveJson());
  dirty.cosmetics = { purchases: {}, companionId: 'odin-boy', themeId: 'garden',
    companionLook: { hair: '不存在', outfit: 'dress', accessory: 'xxx', palette: 'bloom' } };
  const rd = page.progress.Logic.parseImport(JSON.stringify(dirty), []);
  assert.equal(rd.state.cosmetics.companionLook.hair, 'short', check('D1：导入时非法发型回落默认'));
  assert.equal(rd.state.cosmetics.companionLook.outfit, 'dress', check('D1：导入时合法服装保留'));
  assert.equal(rd.state.cosmetics.companionLook.accessory, 'none', check('D1：导入时非法配饰回落默认'));

  /* file:// 降级：拒绝写入但返回清洗值供即时预览 */
  const filePage = newPage({ storage: null, protocol: 'file:' });
  const fr = filePage.progress.setCompanionLook('hair', 'curly');
  assert.equal(fr.ok, false, check('D1：file:// 下 setCompanionLook ok:false'));
  assert.equal(fr.companionLook.hair, 'curly', check('D1：file:// 下仍返回清洗后的 look（内存即时预览）'));
}

/* ===================== 5. UI：装扮 picker 双入口 + 四槽 + 预览 + 选用/解锁 ===================== */
function openWardrobeViaProfile(page) {
  dispatch(querySelect(page.dom.body, '.player-entry'), 'click', {});
  const profile = collectByClass(page.dom.body, 'profile-dialog').find(d => d.open === true);
  const card = collectByClass(profile, 'appearance-action').find(c => c.textContent.includes('更换伙伴装扮'));
  assert.ok(card, check('D3/G：形象 Tab 有「伙伴装扮」入口卡'));
  dispatch(card, 'click', {});
  return collectByClass(page.dom.body, 'picker-dialog').find(d => d.open === true);
}

function openCompanionViaProfile(page) {
  dispatch(querySelect(page.dom.body, '.player-entry'), 'click', {});
  const profile = collectByClass(page.dom.body, 'profile-dialog').find(d => d.open === true);
  const card = collectByClass(profile, 'appearance-action').find(c => c.textContent.includes('更换伙伴形象'));
  assert.ok(card, check('picker：形象 Tab 有“更换伙伴形象”入口'));
  dispatch(card, 'click', {});
  return collectByClass(page.dom.body, 'picker-dialog').find(d => d.open === true);
}

/* v4.6：picker 分类按钮必须即时重绘当前弹窗，并且只暴露 ready 角色。 */
{
  const page = newPage({ storage: makeStorage() });
  const picker = openCompanionViaProfile(page);
  assert.equal(collectByClass(picker, 'companion-option').length, 27, check('picker：全部分类显示 27 个可选角色（28 ready − 退役 sprout，v4.8）'));
  assert.equal(picker.textContent.includes('艾拉'), true, check('picker：第二批 ready 人形正常显示'));
  assert.equal(picker.textContent.includes('麦麦'), true, check('picker：第二批 ready 宠物正常显示'));

  const humanoid = collectByClass(picker, 'button-secondary').find(b => b.textContent === '人形');
  dispatch(humanoid, 'click', {});
  assert.equal(collectByClass(picker, 'companion-option').length, 8, check('picker：人形分类即时显示 8 个 ready 角色'));

  const creature = collectByClass(picker, 'button-secondary').find(b => b.textContent === '宠物');
  dispatch(creature, 'click', {});
  assert.equal(collectByClass(picker, 'companion-option').length, 19, check('picker：宠物分类即时显示 19 个可选角色（20 − 退役 sprout，v4.8）'));
}

{
  const page = newPage({ storage: makeStorage() });
  page.progress.equipCompanion('odin-boy');   /* 装备人形，装扮才有意义 */
  const picker = openWardrobeViaProfile(page);
  assert.ok(picker, check('D3/G：形象 Tab 打开装扮 picker'));
  assert.ok(picker.textContent.includes('学习伙伴装扮'), check('D：装扮 picker 标题'));
  assert.equal(collectByClass(picker, 'wardrobe-slot').length, 4, check('D2：装扮 picker 四槽（发型/服装/配饰/色板）'));
  assert.ok(querySelect(picker, '.wardrobe-preview-img'), check('D3：装备人形时顶部有实时大人形预览'));
  assert.ok(collectByClass(picker, 'wardrobe-option').length >= 20, check('D2：四槽选项总数充足'));

  /* 选用一个免费发型（bob 是 default 解锁），即时生效并写入 companionLook */
  const options = collectByClass(picker, 'wardrobe-option');
  const bobCell = options.find(c => {
    const nm = querySelect(c, '.wardrobe-name');
    return nm && nm.textContent === '波波头';
  });
  assert.ok(bobCell, check('D：装扮列表里有免费发型「波波头」'));
  const useBtn = querySelect(bobCell, '.wardrobe-use');
  assert.ok(useBtn, check('D2：免费件给「选用」按钮（不是锁）'));
  dispatch(useBtn, 'click', {});
  assert.equal(page.progress.companionLook().hair, 'bob', check('D1：选用免费发型即时写入 companionLook'));

  /* 未解锁件（长直发=Lv.3）在 Lv.1 显示解锁条件而非选用按钮 */
  const picker2 = collectByClass(page.dom.body, 'picker-dialog').find(d => d.open === true);
  const longCell = collectByClass(picker2, 'wardrobe-option').find(c => {
    const nm = querySelect(c, '.wardrobe-name');
    return nm && nm.textContent === '长直发';
  });
  assert.ok(longCell, check('D：装扮列表里有「长直发」'));
  assert.equal(querySelect(longCell, '.wardrobe-use'), null, check('D2：未达等级的件没有「选用」按钮'));
  const stateText = querySelect(longCell, '.wardrobe-state');
  assert.ok(stateText && /Lv\.3|等级/.test(stateText.textContent), check('D2：未解锁件显示等级解锁条件'));
}

/* 伙伴面板入口（交接 G：与形象 Tab 同一 picker） */
{
  const page = newPage({ storage: makeStorage() });
  page.progress.equipCompanion('odin-girl');
  const trigger = querySelect(page.dom.body, '.assistant-trigger');
  dispatch(trigger, 'click', {});
  const dialog = collectByClass(page.dom.body, 'assistant-dialog').find(d => d.open === true);
  const nav = collectByClass(dialog, 'assistant-nav-btn').find(b => b.textContent === '设置');
  dispatch(nav, 'click', {});
  const wardrobeBtn = collectByClass(dialog, 'button-secondary').find(b => b.textContent.includes('打开伙伴装扮'));
  assert.ok(wardrobeBtn, check('D3/G：伙伴面板设置视图有「打开伙伴装扮」入口'));
  dispatch(wardrobeBtn, 'click', {});
  const picker = collectByClass(page.dom.body, 'picker-dialog').find(d => d.open === true);
  assert.ok(picker && picker.textContent.includes('学习伙伴装扮'), check('D3/G：伙伴面板打开的是同一个装扮 picker'));
  assert.equal(collectByClass(picker, 'wardrobe-slot').length, 4, check('D3/G：伙伴面板入口的装扮 picker 同样四槽'));
}

/* v4.6：fixed-art 人形使用预制皮肤，不进入 procedural 四槽。 */
{
  const storage = makeStorage();
  const page = newPage({ storage });
  const companionPicker = openCompanionViaProfile(page);
  const mia = collectByClass(companionPicker, 'companion-option').find(cell => cell.textContent.includes('米娅'));
  dispatch(querySelect(mia, '.button-secondary'), 'click', {});
  assert.ok(querySelect(page.dom.body, '.hero-companion-img').src.includes('assets/companions/mia/default-normal.webp'),
    check('fixed-art：切换伙伴后首页 Hero 即时刷新为正式图片'));
  const picker = openWardrobeViaProfile(page);
  assert.equal(collectByClass(picker, 'wardrobe-slot').length, 0, check('fixed-art 不进入 procedural 四槽'));
  assert.equal(collectByClass(picker, 'fixed-skin-option').length, 2, check('米娅只显示实际存在的 default / study'));
  const study = collectByClass(picker, 'fixed-skin-option').find(cell => cell.textContent.includes('学习装'));
  const use = querySelect(study, '.fixed-skin-use');
  assert.ok(use, check('非当前 fixed-art skin 有切换按钮'));
  dispatch(use, 'click', {});
  assert.equal(page.progress.companionSkin('mia'), 'study', check('fixed-art skin 按角色写入档案'));
  assert.ok(querySelect(page.dom.body, '.hero-companion-img').src.includes('assets/companions/mia/study-happy.webp'),
    check('fixed-art：切换 skin 后首页 Hero 即时刷新并使用 mood 对应图'));
  assert.equal(page.progress.companionLook(), null, check('fixed-art skin 不污染 procedural companionLook'));

  const reloaded = newPage({ storage });
  assert.equal(reloaded.progress.cosmetics().companionId, 'mia', check('刷新后仍装备米娅'));
  assert.equal(reloaded.progress.companionSkin('mia'), 'study', check('刷新后 study skin 保持'));
}

/* 生物形象（非人形）时装扮 picker 给引导而非空白（v4.8：sprout 已退役，
 * 改用非退役的 fixed-art 宠物小白做同一验证） */
{
  const page = newPage({ storage: makeStorage() });
  page.progress.equipCompanion('kitty-white');   /* 生物形象（fixed-art 宠物） */
  const picker = openWardrobeViaProfile(page);
  assert.ok(picker.textContent.includes('生物形象') || picker.textContent.includes('人形'),
    check('D：装备生物形象时装扮 picker 提示需先换人形'));
  assert.equal(querySelect(picker, '.wardrobe-preview-img'), null, check('D：生物形象不渲染人形预览'));
}

console.log(`companion-wardrobe.test.cjs：全部 ${checks} 项断言通过 ✔`);
