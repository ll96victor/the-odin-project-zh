/* v4.5 Batch 1（交接 A1）：学习伙伴拖动回归专项测试。
 *
 * 真实回归根因：按钮内头像 <img> 在真实浏览器里默认原生可拖——鼠标按在头像上
 * 拖动会触发 HTML5 dragstart 接管手势、隐式释放 pointer capture，pointermove/up
 * 不再送达按钮，自定义拖动整个失效。DOM stub 不模拟原生拖动语义，因此 v4.4 的
 * dom-mount 测试全绿而真机坏了。本文件把"真机才会暴露"的防御全部钉成契约：
 *
 *   1. 原生拖动防御：img draggable=false、dragstart preventDefault、touch-action none；
 *   2. trigger 通道拖动（鼠标 pointerdown/move/up）+ 位置持久化 + capture 释放；
 *   3. window 兜底通道拖动（capture 失败 / 指针滑出按钮的真实路径）；
 *   4. setPointerCapture 抛错时拖动仍可用；
 *   5. 拖动后的顺手 click 不打开面板，再点一次才打开；
 *   6. clamp：越界坐标拉回视口；手机 320×568 窄屏不越界；
 *   7. resize / orientationchange / visibilitychange 后重新 clamp；
 *   8. 「恢复默认位置」UI 路径可用且清空 companionPos；
 *   9. 触摸等价路径（pointerType=touch）可拖动。
 *
 * 运行：node tests/companion-drag.test.cjs */
const assert = require('node:assert/strict');

let checks = 0;
const check = label => { checks += 1; return label; };

const {
  querySelect, collectByClass, dispatch, makeStorage,
  newPage, archiveJson
} = require('./dom-stub.cjs');

/* ===================== 1. 原生拖动防御（真机回归根因） ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const trigger = querySelect(page.dom.body, '.assistant-trigger');
  assert.ok(trigger, check('学习伙伴按钮已挂载'));

  const avatar = querySelect(trigger, 'img');
  assert.ok(avatar, check('按钮内有头像 img'));
  assert.equal(avatar.draggable, false, check('A1：头像 img draggable=false（禁止 HTML5 原生图片拖动劫持手势）'));

  /* dragstart 必须被 preventDefault（第三道兜底防线） */
  let dragStartPrevented = false;
  dispatch(trigger, 'dragstart', { preventDefault() { dragStartPrevented = true; } });
  assert.equal(dragStartPrevented, true, check('A1：dragstart 被 preventDefault（原生拖动兜底拦截）'));

  assert.equal(trigger.style.touchAction, 'none', check('A1：touch-action:none（触摸拖动不被浏览器滚动手势接管）'));
}

/* ===================== 2. trigger 通道拖动 + 持久化 + capture 释放 ===================== */
{
  const storage = makeStorage();
  const page = newPage({ storage });
  const trigger = querySelect(page.dom.body, '.assistant-trigger');

  /* 记录 setPointerCapture / releasePointerCapture 的调用 */
  const captureCalls = [];
  trigger.setPointerCapture = id => captureCalls.push(['set', id]);
  trigger.releasePointerCapture = id => captureCalls.push(['release', id]);

  const startLeft = parseFloat(trigger.style.left);
  const startTop = parseFloat(trigger.style.top);
  dispatch(trigger, 'pointerdown', { button: 0, clientX: startLeft + 20, clientY: startTop + 20, pointerId: 7, pointerType: 'mouse' });
  assert.deepEqual(captureCalls[0], ['set', 7], check('A1：pointerdown 请求 pointer capture'));
  dispatch(trigger, 'pointermove', { clientX: startLeft + 20 - 120, clientY: startTop + 20 - 60, pointerId: 7, pointerType: 'mouse' });
  dispatch(trigger, 'pointerup', { pointerId: 7, pointerType: 'mouse' });

  assert.equal(trigger.style.left, `${startLeft - 120}px`, check('A1：鼠标拖动 left 跟随位移'));
  assert.equal(trigger.style.top, `${startTop - 60}px`, check('A1：鼠标拖动 top 跟随位移'));
  assert.deepEqual(captureCalls[1], ['release', 7], check('A1：pointerup 释放 pointer capture'));

  const saved = page.progress.settings().companionPos;
  assert.deepEqual(saved ? { x: saved.x, y: saved.y } : null,
    { x: startLeft - 120, y: startTop - 60 },
    check('A1：拖动结束位置持久化到 settings.companionPos'));

  /* 小于 6px 的微动不算拖动、不保存 */
  const page2 = newPage({ storage: makeStorage() });
  const t2 = querySelect(page2.dom.body, '.assistant-trigger');
  const left2 = parseFloat(t2.style.left);
  dispatch(t2, 'pointerdown', { button: 0, clientX: 100, clientY: 100, pointerId: 2, pointerType: 'mouse' });
  dispatch(t2, 'pointermove', { clientX: 103, clientY: 102, pointerId: 2, pointerType: 'mouse' });
  dispatch(t2, 'pointerup', { pointerId: 2, pointerType: 'mouse' });
  assert.equal(t2.style.left, `${left2}px`, check('A1：<6px 微动不移动按钮'));
  assert.equal(page2.progress.settings().companionPos, null, check('A1：<6px 微动不写 companionPos（点击不误存位置）'));
}

/* ===================== 3. window 兜底通道（capture 失败 / 指针滑出按钮） ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const trigger = querySelect(page.dom.body, '.assistant-trigger');
  const startLeft = parseFloat(trigger.style.left);
  const startTop = parseFloat(trigger.style.top);

  dispatch(trigger, 'pointerdown', { button: 0, clientX: startLeft + 10, clientY: startTop + 10, pointerId: 3, pointerType: 'mouse' });
  /* 后续事件走 window（真实浏览器里 capture 失败或指针离开按钮时事件冒泡到 window） */
  page.fireWindow('pointermove', { clientX: startLeft + 10 - 200, clientY: startTop + 10 - 100, pointerId: 3 });
  page.fireWindow('pointerup', { pointerId: 3 });

  assert.equal(trigger.style.left, `${startLeft - 200}px`, check('A1：window 兜底通道 pointermove 生效（指针滑出按钮仍可拖）'));
  assert.equal(trigger.style.top, `${startTop - 100}px`, check('A1：window 兜底通道 top 跟随'));
  const saved = page.progress.settings().companionPos;
  assert.deepEqual(saved ? { x: saved.x, y: saved.y } : null,
    { x: startLeft - 200, y: startTop - 100 },
    check('A1：window 兜底通道 pointerup 同样持久化位置'));
}

/* ===================== 4. setPointerCapture 抛错时拖动仍可用 ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const trigger = querySelect(page.dom.body, '.assistant-trigger');
  trigger.setPointerCapture = () => { throw new Error('NotFoundError'); };
  const startLeft = parseFloat(trigger.style.left);

  assert.doesNotThrow(() => {
    dispatch(trigger, 'pointerdown', { button: 0, clientX: startLeft + 10, clientY: 100, pointerId: 9, pointerType: 'mouse' });
  }, check('A1：setPointerCapture 抛错不炸 pointerdown 处理器'));
  dispatch(trigger, 'pointermove', { clientX: startLeft + 10 - 80, clientY: 40, pointerId: 9, pointerType: 'mouse' });
  dispatch(trigger, 'pointerup', { pointerId: 9, pointerType: 'mouse' });
  assert.equal(trigger.style.left, `${startLeft - 80}px`, check('A1：capture 失败时拖动仍跟随（window 兜底监听接管）'));
}

/* ===================== 5. 拖动后 click 抑制 / 触摸等价路径 ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const { dom } = page;
  const trigger = querySelect(dom.body, '.assistant-trigger');
  const startLeft = parseFloat(trigger.style.left);
  const startTop = parseFloat(trigger.style.top);

  /* 触摸路径：pointerType=touch 的 down/move/up 同样可拖 */
  dispatch(trigger, 'pointerdown', { button: 0, clientX: startLeft + 30, clientY: startTop + 20, pointerId: 11, pointerType: 'touch', isPrimary: true });
  dispatch(trigger, 'pointermove', { clientX: startLeft + 30 - 50, clientY: startTop + 20 - 30, pointerId: 11, pointerType: 'touch', isPrimary: true });
  dispatch(trigger, 'pointerup', { pointerId: 11, pointerType: 'touch', isPrimary: true });
  assert.equal(trigger.style.left, `${startLeft - 50}px`, check('A1：触摸（pointerType=touch）拖动可用'));

  /* 拖动后的顺手 click 不打开面板；再点一次才打开 */
  dispatch(trigger, 'click', {});
  assert.equal(querySelect(dom.body, '.assistant-dialog'), null, check('A1：拖动结束后的顺手 click 不打开面板'));
  dispatch(trigger, 'click', {});
  const dialog = querySelect(dom.body, '.assistant-dialog');
  assert.ok(dialog && dialog.open === true, check('A1：拖动后的下一次正常 click 打开面板'));
}

/* ===================== 6. clamp：越界拉回 + 手机 320px 窄屏 ===================== */
{
  const page = newPage({ storage: makeStorage(), innerWidth: 320, innerHeight: 568 });
  const trigger = querySelect(page.dom.body, '.assistant-trigger');
  /* 320 窄屏默认位：left = 320-152-12 = 156，top = 568-44-12 = 512 */
  assert.equal(trigger.style.left, '156px', check('A1：320px 窄屏默认位在视口内'));
  assert.equal(trigger.style.top, '512px', check('A1：320px 窄屏默认 top 在视口内'));

  /* 往右下越界拖 */
  dispatch(trigger, 'pointerdown', { button: 0, clientX: 160, clientY: 520, pointerId: 4, pointerType: 'touch' });
  dispatch(trigger, 'pointermove', { clientX: 900, clientY: 1200, pointerId: 4, pointerType: 'touch' });
  dispatch(trigger, 'pointerup', { pointerId: 4, pointerType: 'touch' });
  let left = parseFloat(trigger.style.left);
  let top = parseFloat(trigger.style.top);
  assert.ok(left >= 12 && left + 152 <= 320, check('A1：窄屏往右下越界拖被 clamp 回视口'));
  assert.ok(top >= 12 && top + 44 <= 568, check('A1：窄屏纵向越界同样 clamp'));

  /* 往左上越界拖 */
  dispatch(trigger, 'pointerdown', { button: 0, clientX: left + 10, clientY: top + 10, pointerId: 5, pointerType: 'touch' });
  dispatch(trigger, 'pointermove', { clientX: -500, clientY: -500, pointerId: 5, pointerType: 'touch' });
  dispatch(trigger, 'pointerup', { pointerId: 5, pointerType: 'touch' });
  left = parseFloat(trigger.style.left);
  top = parseFloat(trigger.style.top);
  assert.ok(left >= 12 && top >= 12, check('A1：往左上越界拖不小于边距（不会拖丢）'));

  const saved = page.progress.settings().companionPos;
  assert.ok(saved && saved.x >= 12 && saved.y >= 12 && saved.x + 152 <= 320 && saved.y + 44 <= 568,
    check('A1：窄屏持久化的位置本身就在视口内'));
}

/* ===================== 7. resize / orientationchange / visibilitychange 重新 clamp ===================== */
{
  const page = newPage({ storage: makeStorage({}) });
  const trigger = querySelect(page.dom.body, '.assistant-trigger');
  /* 先拖到右下区域并持久化 */
  dispatch(trigger, 'pointerdown', { button: 0, clientX: 1200, clientY: 780, pointerId: 6, pointerType: 'mouse' });
  dispatch(trigger, 'pointermove', { clientX: 1240, clientY: 790, pointerId: 6, pointerType: 'mouse' });
  dispatch(trigger, 'pointerup', { pointerId: 6, pointerType: 'mouse' });
  const saved = page.progress.settings().companionPos;
  assert.ok(saved && saved.x > 1000 && saved.y > 700, check('A1：先制造一个靠右下角的保存位置'));

  /* orientationchange：手机横转竖，视口变小 */
  page.sandbox.innerWidth = 375;
  page.sandbox.innerHeight = 667;
  page.fireWindow('orientationchange', {});
  let left = parseFloat(trigger.style.left);
  let top = parseFloat(trigger.style.top);
  assert.ok(left + 152 <= 375 && top + 44 <= 667, check('A1：orientationchange 后越界位置被 clamp 回视口'));

  /* 恢复视口后回到保存位置 */
  page.sandbox.innerWidth = 1280;
  page.sandbox.innerHeight = 800;
  page.fireWindow('orientationchange', {});
  assert.equal(trigger.style.left, `${saved.x}px`, check('A1：视口恢复后回到保存位置'));

  /* visibilitychange：后台改小窗口再切回前台，补一次 clamp */
  page.sandbox.innerWidth = 400;
  page.dom.visibilityState = 'hidden';
  (page.dom.listeners['visibilitychange'] || []).forEach(fn => fn({ type: 'visibilitychange' }));
  assert.equal(parseFloat(trigger.style.left), saved.x, check('A1：hidden 状态下 visibilitychange 不重排'));
  page.dom.visibilityState = 'visible';
  (page.dom.listeners['visibilitychange'] || []).forEach(fn => fn({ type: 'visibilitychange' }));
  assert.ok(parseFloat(trigger.style.left) + 152 <= 400, check('A1：回到前台时 visibilitychange 补 clamp'));
}

/* ===================== 8. 恢复默认位置（UI 路径） ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const { dom } = page;
  const trigger = querySelect(dom.body, '.assistant-trigger');
  const startLeft = parseFloat(trigger.style.left);
  const startTop = parseFloat(trigger.style.top);

  /* 拖离默认位 */
  dispatch(trigger, 'pointerdown', { button: 0, clientX: startLeft + 10, clientY: startTop + 10, pointerId: 8, pointerType: 'mouse' });
  dispatch(trigger, 'pointermove', { clientX: startLeft - 260, clientY: startTop - 320, pointerId: 8, pointerType: 'mouse' });
  dispatch(trigger, 'pointerup', { pointerId: 8, pointerType: 'mouse' });
  assert.ok(page.progress.settings().companionPos, check('A1：拖动后已有保存位置'));
  assert.notEqual(trigger.style.left, `${startLeft}px`, check('A1：按钮确实离开了默认位'));

  /* 打开面板 → 设置视图 → 恢复默认位置（拖动后的第一次 click 按设计被抑制） */
  dispatch(trigger, 'click', {});
  dispatch(trigger, 'click', {});
  const dialog = querySelect(dom.body, '.assistant-dialog');
  assert.ok(dialog && dialog.open === true, check('A1：点击打开学习伙伴面板'));
  const settingsNav = collectByClass(dialog, 'assistant-nav-btn').find(btn => btn.textContent === '设置');
  assert.ok(settingsNav, check('A1：面板有「设置」导航'));
  dispatch(settingsNav, 'click', {});
  const resetButton = collectByClass(dialog, 'button-secondary')
    .find(btn => String(btn.textContent).includes('恢复学习伙伴默认位置'));
  assert.ok(resetButton, check('A1：设置视图有「恢复默认位置」按钮'));
  dispatch(resetButton, 'click', {});

  assert.equal(page.progress.settings().companionPos, null, check('A1：恢复默认后 companionPos 清空（单一事实源）'));
  assert.equal(trigger.style.left, `${startLeft}px`, check('A1：按钮回到默认 left'));
  assert.equal(trigger.style.top, `${startTop}px`, check('A1：按钮回到默认 top'));
}

/* ===================== 9. 右键 / 非主键不启动拖动 ===================== */
{
  const page = newPage({ storage: makeStorage() });
  const trigger = querySelect(page.dom.body, '.assistant-trigger');
  const startLeft = parseFloat(trigger.style.left);
  dispatch(trigger, 'pointerdown', { button: 2, clientX: startLeft + 10, clientY: 100, pointerId: 10, pointerType: 'mouse' });
  dispatch(trigger, 'pointermove', { clientX: startLeft - 190, clientY: 40, pointerId: 10, pointerType: 'mouse' });
  assert.equal(trigger.style.left, `${startLeft}px`, check('A1：右键按下不启动拖动'));
  dispatch(trigger, 'pointerup', { pointerId: 10, pointerType: 'mouse' });
  assert.equal(page.progress.settings().companionPos, null, check('A1：右键路径不写 companionPos'));
}

console.log(`companion-drag.test.cjs：全部 ${checks} 项断言通过 ✔`);
