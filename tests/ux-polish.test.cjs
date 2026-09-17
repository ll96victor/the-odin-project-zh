/* v4.10：两项 UX 改进的回归网。
 *
 * 改进 1「小图标不该懒加载」——app.js 原来对所有正式位图无条件写
 * `loading='lazy'`，于是 companion-view 的 SLOTS 里那个 lazy 标志形同虚设。
 * 形象 picker 的滚动容器内容高约 3476px、可视仅 544px，serve.py 又对所有静态
 * 资源发 no-cache（每次使用都要回源校验），结果打开面板时缩略图逐格填充；
 * 而全部小图标合计只有 68 KB，省下的流量微不足道。v4.10 起按用途分流：
 * 小图标（SLOTS 的 '32-64px' 档：corner / listItem）eager，大立绘
 * （'600x800' 档：hero / profile / 装扮预览）继续 lazy。
 *
 * 改进 2「消除能点但没反应的头像格子」——v4.9 起退役头像（registry 的
 * retiredAvatarIds）选中即被读取层归一化成 DEFAULT_AVATAR_ID，头像面板里那一格
 * 点了毫无反应、也没有任何说明。v4.10 起选择层直接不渲染退役项，面板格子数与
 * 收藏柜计数同源；资产数据一项不删（avatars.js 仍 37 项）。
 *
 * 本文件钉住的是「不变量」而不是某一次的数字：
 *   - 位图 portrait 的 lazy 标志与 SLOTS 尺寸档位严格对应；
 *   - 真实 DOM 上小图标 loading='eager'、大立绘 loading='lazy'；
 *   - app.js 不再写死 lazy、也不引入尺寸 / 文件名魔数（判定只在 SLOTS）；
 *   - 退役头像不出现在面板任何一组，且三处计数与格子数逐项一致；
 *   - 退役头像的数据与老档案渲染路径不受过滤影响。
 *
 * 运行：node tests/ux-polish.test.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

let checks = 0;
const check = label => { checks += 1; return label; };

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const {
  querySelect, collectByClass, dispatch, makeStorage, newPage, archiveJson, STORAGE_KEY
} = require('./dom-stub.cjs');

/* fileImage 创建的位图会带 is-file 类；内联 SVG data URL 不带（也不是网络请求，
 * 加载策略对它没有意义）。所有断言只针对位图，避免把 SVG 混进来变成空跑。 */
const isFile = img => Boolean(img && img.classList && img.classList.contains('is-file'));

function openProfile(page) {
  dispatch(querySelect(page.dom.body, '.player-entry'), 'click', {});
  const dialog = collectByClass(page.dom.body, 'profile-dialog').find(d => d.open === true);
  assert.ok(dialog, check('v4.10：点右上角玩家入口打开个人中心'));
  return dialog;
}

function openPicker(page, actionName) {
  const dialog = openProfile(page);
  const action = collectByClass(dialog, 'appearance-action').find(b => b.textContent === actionName);
  assert.ok(action, check(`v4.10：形象 Tab 有「${actionName}」入口`));
  dispatch(action, 'click', {});
  const picker = collectByClass(page.dom.body, 'picker-dialog').find(d => d.open === true);
  assert.ok(picker, check(`v4.10：点「${actionName}」打开对应 picker`));
  return picker;
}

function openAssistant(page) {
  dispatch(querySelect(page.dom.body, '.assistant-trigger'), 'click', {});
  const dialog = collectByClass(page.dom.body, 'assistant-dialog').find(d => d.open === true);
  assert.ok(dialog, check('v4.10：点右下角打开学习助手面板'));
  return dialog;
}

/* ============ 1. 改进 1（门面层）：SLOTS 是加载策略的唯一判定处 ============ */
{
  const page = newPage({ storage: makeStorage() });
  const view = page.sandbox.window.ODIN_COMPANION_VIEW;
  const roster = view.listByKind();
  assert.ok(roster.length > 0, check('v4.10：登记表有非退役 ready 角色可供断言（不是空跑）'));

  const SMALL_SLOTS = ['corner', 'listItem'];   /* '32-64px' → eager */
  const BIG_SLOTS = ['hero', 'profile'];        /* '600x800' → lazy  */
  let smallFiles = 0;
  let bigFiles = 0;

  for (const item of roster) {
    for (const slot of SMALL_SLOTS) {
      const d = view.portrait(item.id, { slot, mood: 'normal' });
      if (!d) continue;
      assert.equal(d.sizeHint, '32-64px', check(`v4.10：${slot} 槽是小图标档（${item.id}）`));
      /* 内联 SVG 也标 false：它不是网络请求，eager/lazy 无意义，但绝不能是 lazy */
      assert.equal(d.lazy, false, check(`v4.10：小图标槽 ${slot} 的 portrait 标 eager（${item.id}）`));
      if (d.source === 'file') smallFiles += 1;
    }
    for (const slot of BIG_SLOTS) {
      const d = view.portrait(item.id, { slot, mood: 'normal' });
      if (!d) continue;
      assert.equal(d.sizeHint, '600x800', check(`v4.10：${slot} 槽是大立绘档（${item.id}）`));
      if (d.source === 'file') {
        bigFiles += 1;
        assert.equal(d.lazy, true, check(`v4.10：大立绘槽 ${slot} 的位图 portrait 仍标 lazy（${item.id}）`));
      }
    }
  }
  assert.ok(smallFiles >= 4, check(`v4.10：小图标位图断言确实覆盖到多张图（实际 ${smallFiles} 张）`));
  assert.ok(bigFiles >= 4, check(`v4.10：大立绘位图断言确实覆盖到多张图（实际 ${bigFiles} 张）`));
}

/* ============ 2. 改进 1（DOM 层）：小图标 eager、大立绘 lazy ============ */
{
  const page = newPage({ storage: makeStorage() });   /* 默认角色 nono 是 fixed-art */

  /* ① 首屏 Hero 大立绘：保持 lazy（不改这一条就是本轮的红线之一） */
  const heroImg = querySelect(page.dom.body, '.hero-companion-img');
  assert.ok(isFile(heroImg), check('v4.10：Hero 立绘是正式位图'));
  assert.equal(heroImg.loading, 'lazy', check('v4.10：Hero 大立绘仍 loading=lazy'));
  assert.ok(heroImg.src.includes('assets/companions/'), check('v4.10：Hero 立绘走正式资产路径'));

  /* ② 右下角按钮小头像：eager */
  const trigger = querySelect(page.dom.body, '.assistant-trigger');
  const cornerImg = querySelect(trigger, '.assistant-avatar');
  assert.ok(isFile(cornerImg), check('v4.10：右下角头像是正式位图'));
  assert.equal(cornerImg.loading, 'eager', check('v4.10：右下角小头像 loading=eager'));

  /* ③ header 头像：走 buildAvatar（不设 loading，即浏览器默认 eager），
   *    本轮不把它改成 lazy——首屏可见的小图标没有延迟加载的理由 */
  const headerImg = querySelect(page.dom.body, '.avatar-img');
  assert.ok(headerImg, check('v4.10：header 头像存在'));
  assert.notEqual(headerImg.loading, 'lazy', check('v4.10：header 头像不被强制 lazy'));

  /* ④ 形象 picker：全部网格缩略图 eager（用户「不滚动就看见整屏」的那一批） */
  const picker = openPicker(page, '更换伙伴形象');
  const thumbs = collectByClass(picker, 'companion-img').filter(isFile);
  assert.ok(thumbs.length >= 5, check(`v4.10：形象 picker 有位图缩略图可断言（实际 ${thumbs.length} 张）`));
  for (const img of thumbs) {
    assert.equal(img.loading, 'eager',
      check(`v4.10：形象 picker 缩略图 eager（${path.basename(img.src)}）——打开即整屏就位，不逐格填充`));
  }

  /* ⑤ 助手面板大立绘：lazy */
  const panel = openAssistant(page);
  const bust = querySelect(panel, '.assistant-bust');
  assert.ok(isFile(bust), check('v4.10：助手面板大人形是正式位图'));
  assert.equal(bust.loading, 'lazy', check('v4.10：助手面板大立绘仍 loading=lazy'));
}

/* 头像面板里的 companion 头像格子（corner 槽）同样 eager */
{
  const page = newPage({ storage: makeStorage() });
  const picker = openPicker(page, '更换头像');
  const cells = collectByClass(picker, 'avatar-option-img').filter(isFile);
  assert.ok(cells.length >= 5, check(`v4.10：头像面板有位图格子可断言（实际 ${cells.length} 张）`));
  for (const img of cells) {
    assert.equal(img.loading, 'eager', check(`v4.10：头像面板缩略图 eager（${path.basename(img.src)}）`));
  }
  /* 同一面板里的几何头像仍是内联 SVG data URL（不是网络请求，不参与加载策略） */
  const svgCells = collectByClass(picker, 'avatar-option-img').filter(img => !isFile(img));
  assert.ok(svgCells.length >= 10, check(`v4.10：几何头像仍是内联 SVG（实际 ${svgCells.length} 张，不受本轮影响）`));
  for (const img of svgCells) {
    assert.ok(String(img.src).startsWith('data:image/svg+xml'), check('v4.10：几何头像 src 仍是 data URL'));
  }
}

/* 装扮 picker 的固定皮肤预览与缩略图是 600×800 大图，保持 lazy */
{
  const page = newPage({ storage: makeStorage() });
  const picker = openPicker(page, '更换伙伴装扮');
  const preview = querySelect(picker, '.fixed-skin-preview');
  assert.ok(isFile(preview), check('v4.10：装扮 picker 预览是正式位图（默认角色为 fixed-art）'));
  assert.equal(preview.loading, 'lazy', check('v4.10：装扮预览大图仍 loading=lazy'));
  const skinThumbs = collectByClass(picker, 'fixed-skin-thumb').filter(isFile);
  assert.ok(skinThumbs.length >= 2, check(`v4.10：装扮皮肤缩略图可断言（实际 ${skinThumbs.length} 张）`));
  for (const img of skinThumbs) {
    assert.equal(img.loading, 'lazy', check('v4.10：装扮皮肤缩略图（600×800 大图）仍 lazy'));
  }
}

/* ============ 3. 改进 1（源码层）：不许回退成写死 lazy，不许新引魔数 ============ */
{
  const appSource = read('app.js');
  assert.ok(!appSource.includes("image.loading = 'lazy';"),
    check('v4.10：app.js 不再无条件写死 loading=lazy（这就是逐格填充的根因）'));
  assert.ok(appSource.includes("image.loading = lazy ? 'lazy' : 'eager'"),
    check('v4.10：loading 由门面给出的 lazy 标志决定'));
  /* 判定依据只在 companion-view 的 SLOTS：app.js 不得自带尺寸档位或文件名字面量，
   * 否则就会出现第二套判定，两边迟早漂移。 */
  for (const magic of ['600x800', '32-64px', 'icon.webp', '.webp']) {
    assert.ok(!appSource.includes(magic),
      check(`v4.10：app.js 不含尺寸/文件名魔数「${magic}」（加载策略判定只在 SLOTS）`));
  }
  const viewSource = read('companion-view.js');
  assert.ok(viewSource.includes("corner: ['32-64px', false]"), check('v4.10：corner 槽 = 小图标 + eager'));
  assert.ok(viewSource.includes("listItem: ['32-64px', false]"),
    check('v4.10：listItem 槽 = 小图标 + eager（v4.10 从 true 改为 false）'));
  assert.ok(viewSource.includes("hero: ['600x800', true]"), check('v4.10：hero 槽 = 大立绘 + lazy'));
  assert.ok(viewSource.includes("profile: ['600x800', true]"), check('v4.10：profile 槽 = 大立绘 + lazy'));
}

/* ============ 4. 改进 2：退役头像不进选择层，三处计数与格子数同源 ============ */
{
  const page = newPage({ storage: makeStorage() });
  const w = page.sandbox.window;
  const retiredIds = w.ODIN_COMPANION_REGISTRY.retiredAvatarIds;
  const retiredItems = w.ODIN_AVATARS.avatars.filter(a => retiredIds.includes(a.id));
  assert.ok(retiredItems.length > 0, check('v4.10：登记表确有退役头像（下面的过滤断言不是空跑）'));

  /* 红线：资产一项不删、id 不改名（过滤只发生在 UI 选择层） */
  assert.equal(w.ODIN_AVATARS.avatars.length, 37,
    check('v4.10：几何头像数据仍是 37 项（退役头像的资产与 id 都保留）'));
  assert.equal(w.ODIN_AVATARS.defaultAvatarId, retiredItems[0].id,
    check('v4.10：几何清单内部回落默认仍是退役那一项（数据层口径未被本轮改动）'));

  /* 收藏柜（成就收藏 Tab）：头像区块标题的 N / M 与面板真实格子数一致 */
  const dialog = openProfile(page);
  dispatch(querySelect(dialog, '#profile-tab-achievements'), 'click', {});
  const tabpanel = querySelect(dialog, '.profile-tabpanel');
  assert.ok(tabpanel, check('v4.10：切到「成就收藏」Tab'));
  const cells = collectByClass(tabpanel, 'avatar-option');
  const names = cells.map(c => (querySelect(c, '.avatar-option-name') || {}).textContent);
  const expectedCells = (w.ODIN_AVATARS.avatars.length - retiredItems.length) + w.ODIN_COMPANION_VIEW.listByKind().length;
  assert.equal(cells.length, expectedCells,
    check(`v4.10：收藏柜头像格子数 = 可选几何头像 + 非退役角色头像（${cells.length} 个）`));
  for (const item of retiredItems) {
    assert.ok(!names.includes(item.zh),
      check(`v4.10：退役头像「${item.zh}」不再渲染成格子（不留「能点、没反应、没说明」的项）`));
  }

  const heading = /头像（已拥有 (\d+) \/ (\d+)）/.exec(tabpanel.textContent);
  assert.ok(heading, check('v4.10：收藏柜有「头像（已拥有 N / M）」区块标题'));
  assert.equal(Number(heading[2]), cells.length,
    check('v4.10：区块标题的总数 M 与面板格子数同源（计数已随过滤修正）'));
  const ownedInHeading = Number(heading[1]);
  const ownedGroupTitle = collectByClass(tabpanel, 'collection-group-title')
    .map(h => h.textContent).find(t => /^已拥有 \d+ \/ \d+$/.test(t));
  assert.ok(ownedGroupTitle, check('v4.10：「已拥有」组标题仍在'));
  const ownedTotal = Number(/\/ (\d+)$/.exec(ownedGroupTitle)[1]);
  assert.equal(ownedTotal, cells.length,
    check('v4.10：「已拥有 N / M」的 M 也是整个面板的格子数（三处计数同源）'));

  /* 概览行（.collection-progress）的头像计数与区块标题一致 */
  const overview = collectByClass(tabpanel, 'collection-progress')[0];
  assert.ok(overview, check('v4.10：收藏进度概览存在'));
  const overviewLine = [...overview.children].map(li => li.textContent).find(t => t.startsWith('头像 '));
  assert.ok(overviewLine, check('v4.10：概览里有头像计数行'));
  assert.equal(overviewLine, `头像 ${ownedInHeading}/${cells.length}`,
    check('v4.10：概览计数 = 区块标题计数 = 面板格子数'));

  /* 已拥有组的格子数与 N 一致（默认档案下退役头像本来是「已拥有」的，
   * 过滤后它既不占格子也不占计数——这正是「计数同步修正」要证明的事） */
  const ownedGrid = collectByClass(tabpanel, 'avatar-options')[0];
  assert.equal(ownedGrid.children.length, ownedInHeading,
    check('v4.10：已拥有组格子数 = 标题里的已拥有数'));
  const ownedNames = [...ownedGrid.children].map(li => (querySelect(li, '.avatar-option-name') || {}).textContent);
  for (const item of retiredItems) {
    assert.ok(!ownedNames.includes(item.zh), check(`v4.10：退役头像「${item.zh}」不在已拥有组`));
  }
}

/* 头像 picker（更换头像）里同样不出现退役头像 */
{
  const page = newPage({ storage: makeStorage() });
  const w = page.sandbox.window;
  const retiredZh = w.ODIN_AVATARS.avatars
    .filter(a => w.ODIN_COMPANION_REGISTRY.retiredAvatarIds.includes(a.id)).map(a => a.zh);
  const picker = openPicker(page, '更换头像');
  const names = collectByClass(picker, 'avatar-option')
    .map(o => (querySelect(o, '.avatar-option-name') || {}).textContent);
  for (const zh of retiredZh) {
    assert.ok(!names.includes(zh), check(`v4.10：头像 picker 里没有退役头像「${zh}」`));
  }
  const groupTitles = collectByClass(picker, 'collection-group-title').map(h => h.textContent);
  assert.ok(groupTitles.some(t => t.includes('学习解锁')) && groupTitles.some(t => t.includes('叶片解锁')),
    check('v4.10：过滤退役头像不影响四类解锁分组的既有信息架构'));
}

/* ============ 5. 改进 2 不误伤：老档案与数据层路径照常 ============ */
{
  /* 老档案存的就是退役头像 id：归一化 + 渲染链路必须照常（过滤只作用于选择层，
   * resolveAvatar 仍读完整的 avatars.js 清单，老档案不会变成孤儿） */
  const storage = makeStorage();
  storage.setItem(STORAGE_KEY, archiveJson({
    schemaVersion: 4,
    profile: { nickname: '老用户', avatarId: 'terminal', avatarData: null, equippedFrameId: 'frame-basic' }
  }));
  const page = newPage({ storage });
  assert.equal(page.progress.profile().avatarId, 'companion-nono',
    check('v4.10：老档案退役头像 id 仍被读取层归一化（v4.9 行为未回退）'));
  const headerImg = querySelect(page.dom.body, '.avatar-img');
  assert.ok(headerImg && headerImg.src.includes('assets/companions/nono/icon.webp'),
    check('v4.10：老档案 header 头像仍渲染小诺正式图（过滤没把渲染路径打断）'));
  assert.notEqual(headerImg.loading, 'lazy', check('v4.10：老档案 header 头像也不被强制 lazy'));

  /* 用户仍可以自己选任意未退役头像（过滤没有把选择功能一起削掉） */
  const result = page.progress.setAvatarId('fox');
  assert.equal(result.ok, true, check('v4.10：未退役头像仍可正常选择'));
  assert.equal(page.progress.profile().avatarId, 'fox', check('v4.10：选择结果写入档案'));
}

/* ============ 6. 改进 2（源码层）：名单只读登记表，app.js 不抄字面量 ============ */
{
  const appSource = read('app.js');
  assert.ok(appSource.includes('companionRegistry.retiredAvatarIds'),
    check('v4.10：app.js 从登记表读退役头像名单'));
  assert.ok(!/\[\s*'terminal'\s*\]/.test(appSource) && !appSource.includes("'terminal'"),
    check('v4.10：app.js 里没有退役头像 id 字面量（单一事实源在 companion-registry.js）'));
  assert.ok(appSource.includes('function selectableAvatarList'),
    check('v4.10：面板与收藏柜共用同一个可选头像清单函数'));
  /* 面板与收藏柜都必须走过滤后的清单，漏一处就会出现「格子数与计数不一致」 */
  const selectableCalls = appSource.match(/typedAssets\('avatar', selectableAvatarList\(\)\)/g) || [];
  assert.equal(selectableCalls.length, 3,
    check(`v4.10：头像面板 / 收藏柜 / 装扮目标提示三处都用可选清单（实际 ${selectableCalls.length} 处）`));
  assert.ok(!/typedAssets\('avatar', avatarList\(\)\)/.test(appSource),
    check('v4.10：没有遗留未过滤的头像资产清单调用'));
}

console.log(`ux-polish.test.cjs：全部 ${checks} 项断言通过 ✔`);
