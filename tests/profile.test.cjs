/* 个人资料 / 头像 / 成就扩充 / 头像框 的逻辑测试（v4 交接 §13）。
 *
 * 与 tests/progress.test.cjs 的分工：那边覆盖 v3 已有的进度核心与 v1→v2 无损迁移，
 * 这边覆盖 v4 新增的四块——Profile / Avatar、Achievements、Frames，以及 avatars.js
 * 与 progress.js 之间的一致性。两边都只在 Node 的 vm 沙箱里跑纯逻辑层，不需要浏览器。
 *
 * 头像的 canvas 缩放与 WebP 编码属于浏览器能力，无法在这里验证，已列入待实测。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'lessons.js'), 'utf8'), sandbox);
vm.runInNewContext(fs.readFileSync(path.join(root, 'avatars.js'), 'utf8'), sandbox);
vm.runInNewContext(fs.readFileSync(path.join(root, 'icons.js'), 'utf8'), sandbox);
vm.runInNewContext(fs.readFileSync(path.join(root, 'economy.js'), 'utf8'), sandbox);
vm.runInNewContext(fs.readFileSync(path.join(root, 'collections.js'), 'utf8'), sandbox);
vm.runInNewContext(fs.readFileSync(path.join(root, 'progress.js'), 'utf8'), sandbox);

const progress = sandbox.window.ODIN_PROGRESS;
assert.ok(progress && progress.Logic, 'progress.js 应暴露 window.ODIN_PROGRESS.Logic');
const Logic = progress.Logic;
const AVATARS = JSON.parse(JSON.stringify(sandbox.window.ODIN_AVATARS));
const ICONS = JSON.parse(JSON.stringify(sandbox.window.ODIN_ICONS));
/* 沙箱返回的数组与宿主 realm 的 Array.prototype 不同，deepStrictEqual 会误判，
 * 因此统一先展开成宿主数组再比较。 */
const local = value => [...value];
const lessons = JSON.parse(JSON.stringify(sandbox.window.ODIN_GUIDE.lessons));
const lessonIds = lessons.map(lesson => lesson.id);
const fresh = () => Logic.emptyState();
const DAY = '2026-09-10';
const AT = '2026-09-10T09:00:00.000Z';
const cp = n => String.fromCodePoint(n);

let checks = 0;
const check = label => { checks += 1; return label; };
/* 在一份干净状态上只求值一次成就，返回解锁到的 id 集合 */
const unlocksWith = mutate => {
  const state = fresh();
  mutate(state);
  Logic.evaluateAchievements(state, lessons, AT, DAY);
  return new Set(Object.keys(state.achievements));
};
/* 造出连续 n 天达标的 daily（含今天） */
const dailyFor = days => {
  const daily = {};
  for (let i = 0; i < days; i += 1) daily[Logic.shiftDayKey(DAY, -i)] = Logic.STREAK_MIN_DAY_SECONDS;
  return daily;
};

/* ===================== 1. 默认头像数据（§2.2） ===================== */
{
  assert.ok(Array.isArray(AVATARS.avatars) && AVATARS.avatars.length >= 8, check('至少 8 个默认头像'));
  assert.equal(AVATARS.avatars.length, 37, check('v4.5 Core E2 提供 37 个头像（15 默认 + 7 等级 + 5 成就 + 10 叶片解锁，仍在交接 H 目标 32–40 区间）'));
  const unlockKinds = AVATARS.avatars.map(a => a.unlock && a.unlock.kind);
  assert.equal(unlockKinds.filter(k => k === 'default').length, 15, check('15 个默认可用头像（v4 的 10 个原样保留 + v4.3 交接 B2 新增 4 个 + Batch 6 纸飞机）'));
  assert.equal(unlockKinds.filter(k => k === 'level').length, 7, check('7 个等级解锁头像（v4.5 Core E2 新增 seedling Lv.2 / telescope Lv.3 / summit Lv.5 + 原有 hex/keyboard/server/chip）'));
  assert.equal(unlockKinds.filter(k => k === 'achievement').length, 5, check('5 个成就解锁头像（flame/trophy/rocket + Batch 6 laurel/crane）'));
  assert.equal(unlockKinds.filter(k => k === 'coins').length, 10, check('10 个叶片解锁头像（含低档位橡果与 Batch 6 铅笔头 20 叶片）'));
  for (const avatar of AVATARS.avatars) {
    assert.ok(avatar.unlock && ['default', 'level', 'achievement', 'coins'].includes(avatar.unlock.kind), check(`${avatar.id}: 有解锁方式`));
    if (avatar.unlock.kind === 'achievement') assert.ok(Logic.ACHIEVEMENTS.some(a => a.id === avatar.unlock.value), check(`${avatar.id}: 绑定的成就存在`));
  }

  const ids = AVATARS.avatars.map(a => a.id);
  assert.equal(new Set(ids).size, ids.length, check('头像 id 不重复'));
  /* v4.8：默认头像分两层——产品级默认是 companion 命名空间的 companion-nono
   * （companion-view 渲染期解析成 nono 正式 icon，不在 avatars.js 清单里）；
   * avatars.js 的 defaultAvatarId 是几何清单内部的回落默认（resolveAvatar 第二级）。 */
  assert.equal(Logic.DEFAULT_AVATAR_ID, 'companion-nono', check('v4.8：产品默认头像是 companion-nono'));
  assert.ok(Logic.AVATAR_ID_PATTERN.test(Logic.DEFAULT_AVATAR_ID), check('v4.8：默认头像 id 通过格式校验'));
  assert.equal(AVATARS.defaultAvatarId, 'terminal', check('v4.8：几何清单内部回落默认仍是 terminal'));
  assert.ok(ids.includes(AVATARS.defaultAvatarId), check('几何默认头像确实存在于清单中'));

  /* 每个头像都要有明显区别：靠 svg 源码互不相同来保证，避免复制粘贴出两个一样的图 */
  const svgs = AVATARS.avatars.map(a => a.svg);
  assert.equal(new Set(svgs).size, svgs.length, check('每个头像的 SVG 互不相同'));

  let totalBytes = 0;
  for (const avatar of AVATARS.avatars) {
    assert.ok(typeof avatar.id === 'string' && avatar.id.trim(), check(`${avatar.id}: id 非空`));
    assert.ok(typeof avatar.zh === 'string' && avatar.zh.trim(), check(`${avatar.id}: 有中文名`));
    assert.ok(Logic.AVATAR_ID_PATTERN.test(avatar.id), check(`${avatar.id}: id 通过 progress.js 的格式校验`));
    assert.ok(avatar.svg.startsWith('<svg') && avatar.svg.endsWith('</svg>'), check(`${avatar.id}: SVG 结构完整`));
    assert.ok(avatar.svg.includes('xmlns="http://www.w3.org/2000/svg"'), check(`${avatar.id}: 声明 SVG 命名空间`));
    assert.ok(avatar.svg.includes('viewBox='), check(`${avatar.id}: 有 viewBox，可缩放`));
    const bytes = Buffer.byteLength(avatar.svg, 'utf8');
    totalBytes += bytes;
    assert.ok(bytes < 1200, check(`${avatar.id}: 单个 SVG 体积很小（${bytes} 字节 < 1200）`));

    /* 不得引用任何远程资源或可执行内容 */
    const withoutXmlns = avatar.svg.replace('xmlns="http://www.w3.org/2000/svg"', '');
    assert.ok(!/https?:\/\//.test(withoutXmlns), check(`${avatar.id}: 不引用远程地址`));
    for (const banned of ['<script', '<image', '<foreignObject', '<use', 'xlink:href', 'url(', 'onload', 'onerror']) {
      assert.ok(!avatar.svg.toLowerCase().includes(banned.toLowerCase()), check(`${avatar.id}: 不含 ${banned}`));
    }
    /* 不打包字体：不得出现 @font-face 或 font-family 依赖外部字体 */
    assert.ok(!/@font-face/.test(avatar.svg), check(`${avatar.id}: 不打包字体`));
  }
  /* v4.3 Batch 6（交接 H）：总量上限随数量伸缩——单张 <1200 字节（上面逐项钉住）
   * 且平均 <500 字节，数量扩充不会让“轻资产”原则失守 */
  assert.ok(totalBytes < AVATARS.avatars.length * 500, check(`头像 SVG 总体积随数量伸缩（${totalBytes} 字节 < ${AVATARS.avatars.length}×500，平均单张 <500 字节）`));

  /* §2.2：不复制其他产品角色 */
  const serialized = JSON.stringify(AVATARS).toLowerCase();
  for (const brand of ['王者荣耀', 'honor of kings', 'codex', 'nintendo', 'pokemon', 'pikachu', 'mario', 'disney', 'marvel']) {
    assert.ok(!serialized.includes(brand), check(`头像不含第三方产品角色名 ${brand}`));
  }
  assert.ok(AVATARS.license.includes('原创'), check('头像清单声明为本站原创'));
}

/* ===================== 2. 昵称（§2.4） ===================== */
{
  assert.equal(Logic.DEFAULT_NICKNAME, '学习者', check('默认昵称为“学习者”'));
  assert.equal(fresh().profile.nickname, '学习者', check('新状态带默认昵称'));
  assert.equal(Logic.normalizeNickname(undefined), '学习者', check('未提供昵称回落默认'));
  assert.equal(Logic.normalizeNickname(null), '学习者', check('null 回落默认'));
  assert.equal(Logic.normalizeNickname(123), '学习者', check('非字符串回落默认'));
  assert.equal(Logic.normalizeNickname('   '), '学习者', check('纯空白回落默认'));
  assert.equal(Logic.normalizeNickname('  小明  '), '小明', check('去掉首尾空白'));
  assert.equal(Logic.normalizeNickname('多   个   空格'), '多 个 空格', check('折叠连续空格'));
  assert.equal(Logic.normalizeNickname('正常昵称'), '正常昵称', check('正常昵称原样保留'));

  /* 控制字符、零宽字符与双向控制字符一律剔除。
   * 已实测确认 \p{Cc}\p{Cf} 覆盖：NUL、US、DEL、C1、ZWSP、ZWNJ、LRM、LRE、RLO、BOM。 */
  const dirty = 'a' + cp(0x00) + 'b' + cp(0x1f) + 'c' + cp(0x7f) + 'd' + cp(0x9f) + 'e'
    + cp(0x200b) + 'f' + cp(0x200c) + 'g' + cp(0x200e) + 'h' + cp(0x202a) + 'i' + cp(0x202e) + 'j' + cp(0xfeff) + 'k';
  assert.equal(Logic.normalizeNickname(dirty), 'abcdefghijk', check('剔除控制字符、零宽字符与双向控制字符'));
  /* U+2028 / U+2029 属行分隔符，被 \s 折叠成普通空格而不是留下换行 */
  assert.equal(Logic.normalizeNickname('a' + cp(0x2028) + 'b' + cp(0x2029) + 'c'), 'a b c', check('行分隔符折叠为空格'));

  /* 超长截断按码点，不把 emoji 的代理对切成半个 */
  assert.equal(Logic.NICKNAME_MAX_LENGTH, 24, check('昵称上限 24'));
  const long = 'a'.repeat(60);
  assert.equal(Logic.normalizeNickname(long).length, 24, check('超长昵称截断到 24'));
  const emoji = cp(0x1f600).repeat(30);
  const truncated = Logic.normalizeNickname(emoji);
  assert.equal(Array.from(truncated).length, 24, check('emoji 昵称按码点截断到 24 个'));
  assert.equal(truncated.length, 48, check('截断后每个 emoji 仍是完整代理对'));
  assert.ok(!/[\uD800-\uDBFF]$/.test(truncated.slice(0, -1)) || truncated.endsWith(cp(0x1f600)), check('末尾不是孤立的高位代理'));

  /* §2.4：不读取系统用户名、GitHub 用户名或浏览器账号信息 */
  const source = fs.readFileSync(path.join(root, 'progress.js'), 'utf8');
  for (const banned of ['navigator.userAgent', 'os.userInfo', 'process.env', 'USERNAME', 'document.cookie']) {
    assert.ok(!source.includes(banned), check(`progress.js 不读取 ${banned}`));
  }
}

/* ===================== 3. 头像 id 校验（§13） ===================== */
{
  /* v4.9 改写：「合法头像 id 原样保留」的样例从 'terminal' 换成 'code'——'terminal'
   * 是 v4.8 之前的产品默认头像，已进退役名单（声明处 companion-registry.js 的
   * retiredAvatarIds），命中即归一化为 DEFAULT_AVATAR_ID，不再「原样保留」。
   * 本文件只加载 Logic 纯逻辑层、**不加载登记表**，退役名单在此退化为空数组，
   * 因此无法在本文件断言退役行为；那条断言搬到 tests/companion-brand.test.cjs
   * 与新增的 tests/legacy-identity.test.cjs（两处都有完整登记表）。
   * 原来那条断言钉的是「格式合法就保留」这条规则，现由下面 'code' 继续钉住，
   * 强度不降；本文件另加一条登记表缺失时的降级断言，覆盖面只增不减。 */
  assert.equal(Logic.normalizeAvatarId('code'), 'code', check('合法头像 id 原样保留'));
  assert.equal(Logic.normalizeAvatarId('terminal'), 'terminal',
    check('登记表缺失时退役名单为空，normalizeAvatarId 不误伤（降级路径仍按格式校验）'));
  const badIds = [undefined, null, 123, {}, [], '', 'Terminal', '9lives', '-lead', 'my avatar',
    'a/b', '../x', '<img>', '"quote"', 'a'.repeat(33), 'id' + cp(0x00), 'id' + cp(0x200b), 'terminal\n'];
  for (const bad of badIds) {
    assert.equal(Logic.normalizeAvatarId(bad), Logic.DEFAULT_AVATAR_ID,
      check(`非法头像 id 回落默认：${typeof bad === 'string' ? JSON.stringify(bad).slice(0, 24) : String(bad)}`));
  }
  /* 格式合法但清单里不存在的 id：normalize 只做格式校验，因此会原样保留，
   * 由 UI 在渲染时回落到默认头像。这是有意的分工——避免两个文件各存一份 id 清单。 */
  assert.equal(Logic.normalizeAvatarId('not-in-list'), 'not-in-list', check('格式合法但未知的 id 由 UI 负责回落'));
  const unknownState = fresh();
  unknownState.profile.avatarId = 'not-in-list';
  assert.equal(Logic.profileOf(unknownState).avatarId, 'not-in-list', check('未知头像 id 不会让 profileOf 崩溃'));
  assert.doesNotThrow(() => Logic.summary(unknownState, lessons, DAY), check('未知头像 id 不会让 summary 崩溃'));
}

/* ===================== 4. 头像数据白名单（§2.3、§11、§13） ===================== */
{
  const goodWebp = 'data:image/webp;base64,UklGRiQAAABXRUJQ';
  const goodPng = 'data:image/png;base64,iVBORw0KGgo=';
  assert.equal(Logic.normalizeAvatarData(goodWebp), goodWebp, check('接受本站生成的 WebP data URL'));
  assert.equal(Logic.normalizeAvatarData(goodPng), goodPng, check('接受本站生成的 PNG data URL'));

  const badData = [
    undefined, null, 123, {}, '', 'not a data url',
    /* SVG 可携带脚本，一律拒绝 */
    'data:image/svg+xml;base64,PHN2Zz48c2NyaXB0PmFsZXJ0KDEpPC9zY3JpcHQ+PC9zdmc+',
    'data:image/svg+xml;utf8,<svg></svg>',
    /* 其它 MIME 一律拒绝 */
    'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
    'data:application/javascript;base64,YWxlcnQoMSk=',
    'data:image/gif;base64,R0lGOD',
    /* 远程地址与伪协议一律拒绝：头像必须是本机生成的 data URL */
    'https://evil.example.com/avatar.png',
    'http://evil.example.com/avatar.png',
    '//evil.example.com/avatar.png',
    'javascript:alert(1)',
    /* base64 主体里夹带标记 */
    'data:image/png;base64,AAAA<script>alert(1)</script>',
    'data:image/png;base64,',
    'data:image/png;base64,AAAA BBBB',
    'data:image/jpeg;base64,/9j/4AAQ'
  ];
  for (const bad of badData) {
    assert.equal(Logic.normalizeAvatarData(bad), null,
      check(`非法头像数据被拒：${typeof bad === 'string' ? bad.slice(0, 40) : String(bad)}`));
  }

  /* 大小上限：约 200 KB */
  assert.ok(Logic.AVATAR_DATA_MAX_LENGTH >= 200 * 1024 && Logic.AVATAR_DATA_MAX_LENGTH <= 300 * 1024,
    check('头像数据上限约 200 KB'));
  const prefix = 'data:image/png;base64,';
  const atLimit = prefix + 'A'.repeat(Logic.AVATAR_DATA_MAX_LENGTH - prefix.length);
  assert.equal(atLimit.length, Logic.AVATAR_DATA_MAX_LENGTH);
  assert.equal(Logic.normalizeAvatarData(atLimit), atLimit, check('恰好在上限内接受'));
  assert.equal(Logic.normalizeAvatarData(atLimit + 'A'), null, check('超过上限拒绝'));

  /* 敌意档案不得污染状态：超大数据、SVG、远程地址都必须在重建时被丢掉 */
  for (const payload of [
    'data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+',
    'https://evil.example.com/a.png',
    prefix + 'A'.repeat(Logic.AVATAR_DATA_MAX_LENGTH + 10)
  ]) {
    const hostile = JSON.parse(Logic.exportJson(fresh(), AT));
    hostile.profile.avatarData = payload;
    const result = Logic.parseImport(JSON.stringify(hostile), lessonIds);
    assert.equal(result.ok, true, check('含非法头像数据的档案仍可导入（其余字段有效）'));
    assert.equal(result.state.profile.avatarData, null, check('非法头像数据被丢弃而不是入库'));
    assert.ok(!JSON.stringify(result.state).includes('evil.example.com'), check('重建后不含远程头像地址'));
    assert.ok(!JSON.stringify(result.state).includes('onload'), check('重建后不含 SVG 事件属性'));
  }

  /* profile 整体格式非法时明确拒绝，而不是静默吞掉 */
  const badProfile = JSON.parse(Logic.exportJson(fresh(), AT));
  badProfile.profile = [];
  assert.equal(Logic.parseImport(JSON.stringify(badProfile), lessonIds).ok, false, check('profile 为数组时拒绝导入'));
  badProfile.profile = 'oops';
  assert.equal(Logic.parseImport(JSON.stringify(badProfile), lessonIds).ok, false, check('profile 为字符串时拒绝导入'));
  /* profile 缺失（v1 档案）时补默认值，不报错 */
  const noProfile = JSON.parse(Logic.exportJson(fresh(), AT));
  delete noProfile.profile;
  noProfile.schemaVersion = 1;
  const filled = Logic.parseImport(JSON.stringify(noProfile), lessonIds);
  assert.equal(filled.ok, true, check('缺少 profile 的档案可以导入'));
  assert.deepEqual({ ...filled.state.profile }, { ...Logic.emptyProfile() }, check('缺少 profile 时补全默认值'));
}

/* ===================== 5. 上传入口的前置校验（§2.3、§13） ===================== */
{
  assert.equal(Logic.checkAvatarFile(null).ok, false, check('null 文件被拒'));
  assert.equal(Logic.checkAvatarFile(undefined).ok, false, check('undefined 文件被拒'));
  assert.equal(Logic.checkAvatarFile('path.png').ok, false, check('字符串不是文件'));

  const svg = Logic.checkAvatarFile({ type: 'image/svg+xml', size: 1024, name: 'a.svg' });
  assert.equal(svg.ok, false, check('SVG 上传被拒'));
  assert.ok(svg.error.includes('SVG'), check('SVG 拒绝原因点名 SVG'));
  assert.ok(svg.error.includes('脚本'), check('SVG 拒绝原因说明是出于脚本安全考虑'));

  const text = Logic.checkAvatarFile({ type: 'text/plain', size: 1024 });
  assert.equal(text.ok, false, check('非图片类型被拒'));
  assert.ok(text.error.includes('text/plain'), check('拒绝原因带上实际类型，便于用户自查'));

  assert.equal(Logic.checkAvatarFile({ type: 'image/png', size: 0 }).ok, false, check('空文件被拒'));
  assert.equal(Logic.checkAvatarFile({ type: 'image/png', size: -5 }).ok, false, check('负数大小被拒'));
  const huge = Logic.checkAvatarFile({ type: 'image/png', size: Logic.AVATAR_INPUT_MAX_BYTES + 1 });
  assert.equal(huge.ok, false, check('超过输入上限被拒'));
  assert.ok(huge.error.includes('12 MB'), check('过大拒绝原因给出具体上限'));

  for (const type of Logic.AVATAR_INPUT_TYPES) {
    const result = Logic.checkAvatarFile({ type, size: 200 * 1024 });
    assert.equal(result.ok, true, check(`接受类型 ${type}`));
  }
  assert.ok(!Logic.AVATAR_INPUT_TYPES.includes('image/svg+xml'), check('可接受类型清单里没有 SVG'));

  /* 所有拒绝都必须给出中文原因，且不含英文异常栈 */
  const rejects = [Logic.checkAvatarFile(null), Logic.checkAvatarFile({ type: 'x/y', size: 1 }),
    Logic.checkAvatarFile({ type: 'image/png', size: 0 }),
    Logic.checkAvatarFile({ type: 'image/png', size: Logic.AVATAR_INPUT_MAX_BYTES + 1 })];
  for (const item of rejects) {
    assert.ok(typeof item.error === 'string' && item.error.trim().length > 3, check('拒绝时给出非空中文原因'));
    assert.ok(/[一-鿿]/.test(item.error), check('拒绝原因是中文'));
    assert.ok(!/Traceback|at Object|undefined is not/.test(item.error), check('拒绝原因不含异常栈'));
  }
  assert.equal(Logic.AVATAR_MAX_EDGE, 256, check('头像缩放目标边长为 256'));
}

/* ===================== 6. profile 字段导出导入（§2.3、§13） ===================== */
{
  const state = fresh();
  Logic.setProfileField(state, 'nickname', '小明');
  Logic.setProfileField(state, 'avatarId', 'owl');
  Logic.setProfileField(state, 'avatarData', 'data:image/webp;base64,UklGRiQAAABXRUJQ');
  state.xp = 900;                                  /* Lv.10，金色框已解锁 */
  state.profile.equippedFrameId = Logic.normalizeFrameId('frame-gold', state);
  assert.equal(state.profile.equippedFrameId, 'frame-gold', check('已解锁的框可以装备'));

  const exported = Logic.exportJson(state, AT);
  const parsed = JSON.parse(exported);
  assert.ok(parsed.profile, check('导出档案含 profile'));
  assert.equal(parsed.profile.nickname, '小明', check('导出含昵称'));
  assert.equal(parsed.profile.avatarId, 'owl', check('导出含头像 id'));
  assert.equal(parsed.profile.avatarData, state.profile.avatarData, check('导出含上传头像数据'));
  assert.equal(parsed.profile.equippedFrameId, 'frame-gold', check('导出含装备的头像框'));

  const roundTrip = Logic.parseImport(exported, lessonIds);
  assert.equal(roundTrip.ok, true, check('profile 档案可往返导入'));
  assert.equal(roundTrip.state.profile.nickname, '小明', check('往返后昵称一致'));
  assert.equal(roundTrip.state.profile.avatarId, 'owl', check('往返后头像 id 一致'));
  assert.equal(roundTrip.state.profile.avatarData, state.profile.avatarData, check('往返后头像数据一致（Windows→Mac 手工迁移仍保留）'));
  assert.equal(roundTrip.state.profile.equippedFrameId, 'frame-gold', check('往返后装备框一致'));
  assert.equal(roundTrip.state.xp, 900, check('往返后 XP 未被 profile 改动影响'));

  /* 未上传头像时只保存默认头像 id，不存 SVG 内容副本（§2.3） */
  const defaultState = fresh();
  const defaultExport = JSON.parse(Logic.exportJson(defaultState, AT));
  assert.equal(defaultExport.profile.avatarData, null, check('未上传头像时 avatarData 为 null'));
  assert.equal(defaultExport.profile.avatarId, Logic.DEFAULT_AVATAR_ID, check('未上传头像时只保存默认头像 id'));
  assert.ok(!Logic.exportJson(defaultState, AT).includes('<svg'), check('导出档案里不含任何 SVG 内容副本'));

  /* 导入的装备框若未解锁或未知，一律回落默认框（§5：未解锁不能装备） */
  const poorState = fresh();
  const poorArchive = JSON.parse(Logic.exportJson(poorState, AT));
  poorArchive.profile.equippedFrameId = 'frame-gold';
  const poorResult = Logic.parseImport(JSON.stringify(poorArchive), lessonIds);
  assert.equal(poorResult.ok, true, check('带未解锁框的档案仍可导入'));
  assert.equal(poorResult.state.profile.equippedFrameId, Logic.DEFAULT_FRAME_ID, check('未解锁的框导入后回落默认框'));

  poorArchive.profile.equippedFrameId = 'frame-does-not-exist';
  assert.equal(Logic.parseImport(JSON.stringify(poorArchive), lessonIds).state.profile.equippedFrameId,
    Logic.DEFAULT_FRAME_ID, check('未知框导入后回落默认框'));
  poorArchive.profile.equippedFrameId = 123;
  assert.equal(Logic.parseImport(JSON.stringify(poorArchive), lessonIds).state.profile.equippedFrameId,
    Logic.DEFAULT_FRAME_ID, check('非字符串框 id 导入后回落默认框'));

  /* 导入的昵称与头像 id 也要过同一套清洗 */
  const dirtyArchive = JSON.parse(Logic.exportJson(fresh(), AT));
  dirtyArchive.profile.nickname = '  ' + 'x'.repeat(80) + '  ';
  dirtyArchive.profile.avatarId = 'BAD ID';
  const dirtyResult = Logic.parseImport(JSON.stringify(dirtyArchive), lessonIds);
  assert.equal(dirtyResult.state.profile.nickname.length, 24, check('导入的超长昵称被截断'));
  assert.equal(dirtyResult.state.profile.avatarId, Logic.DEFAULT_AVATAR_ID, check('导入的非法头像 id 回落默认'));

  /* setProfileField 只接受已知字段 */
  const probe = fresh();
  assert.equal(Logic.setProfileField(probe, 'nickname', '阿明'), true, check('setProfileField 接受 nickname'));
  assert.equal(Logic.setProfileField(probe, 'avatarId', 'fox'), true, check('setProfileField 接受 avatarId'));
  assert.equal(Logic.setProfileField(probe, 'avatarData', null), true, check('setProfileField 接受清空头像'));
  assert.equal(Logic.setProfileField(probe, 'xp', 99999), false, check('setProfileField 拒绝未知字段'));
  assert.equal(probe.xp, 0, check('未知字段不会绕过校验直接改状态'));
  assert.ok(!('xp2' in probe), check('未知字段不会被写进状态'));
}

/* ===================== 7. 成就配置（§4、§13） ===================== */
{
  const list = Logic.ACHIEVEMENTS;
  /* v4.2（交接 §7）：53 + 3 个每日目标连续成就；v4.3（交接 C1）+ first-steps = 57 */
  assert.ok(list.length >= 55 && list.length <= 65, check(`成就总数落在 §7 要求的 55–65 个之间（实际 ${list.length}）`));
  assert.equal(list.length, 63, check('成就总数为 63（v4.3 的 61 + v4.11.3 的 heavy-first / heavy-all）'));

  const ids = list.map(a => a.id);
  assert.equal(new Set(ids).size, ids.length, check('成就 id 不重复'));

  /* v3 已有的 12 个 id 必须全部保留，否则用户现有档案的解锁记录会失效 */
  const V3_IDS = ['first-start', 'first-lesson', 'active-30m', 'active-2h', 'active-10h',
    'streak-3', 'streak-7', 'unit-0', 'unit-1', 'unit-2', 'unit-3', 'all-lessons'];
  for (const id of V3_IDS) assert.ok(ids.includes(id), check(`v3 已有成就 id 保留：${id}`));

  /* 结构完整性：每条都有名称、描述、类别与声明式条件 */
  const KNOWN_KINDS = ['seconds', 'streak', 'completed', 'completedAll', 'official', 'officialAll',
    'quiz', 'quizAll', 'unit', 'firstLesson', 'started', 'startedCount', 'reviewEver', 'reviewCleared',
    'daySeconds', 'level', 'purchases', 'dailyGoalDays', 'firstLessonVisit', 'bossPass', 'bossPrecheckHigh',
    'precheckUnits', 'masteredCount', 'completedHeavy'];
  const categoryIds = Logic.ACHIEVEMENT_CATEGORIES.map(c => c.id);
  for (const item of list) {
    assert.ok(typeof item.id === 'string' && item.id.trim(), check(`${item.id}: id 非空`));
    assert.ok(typeof item.zh === 'string' && item.zh.trim(), check(`${item.id}: 有中文名`));
    assert.ok(typeof item.desc === 'string' && item.desc.trim().length > 4, check(`${item.id}: 有解锁条件说明`));
    assert.ok(categoryIds.includes(item.category), check(`${item.id}: 类别合法（${item.category}）`));
    assert.ok(item.goal && KNOWN_KINDS.includes(item.goal.kind), check(`${item.id}: goal.kind 合法`));
    if (item.goal.value !== undefined) {
      /* unit 的 value 是 lessons.js 的 group **下标**，0 是合法值；
       * 其余类型的 value 是门槛量（秒数 / 天数 / 课数），必须为正。 */
      assert.ok(Number.isFinite(item.goal.value), check(`${item.id}: goal.value 为有限数`));
      if (item.goal.kind === 'unit') {
        assert.ok(Number.isInteger(item.goal.value) && item.goal.value >= 0, check(`${item.id}: 单元下标为非负整数`));
        assert.ok(lessons.some(l => l.group === item.goal.value), check(`${item.id}: 单元下标 ${item.goal.value} 在课程数据中真实存在`));
      } else {
        assert.ok(item.goal.value > 0, check(`${item.id}: 门槛量为正数`));
      }
    }
    /* §5 / §4：成就本身不带 XP，避免与头像框形成递归奖励体系 */
    assert.ok(!('xp' in item), check(`${item.id}: 成就不携带 XP 字段`));
  }

  /* §4.1 要求的七个类别都要覆盖到 */
  const usedCategories = new Set(list.map(a => a.category));
  for (const category of categoryIds) assert.ok(usedCategories.has(category), check(`类别已覆盖：${category}`));
  assert.equal(categoryIds.length, 12, check('类别共 12 个（v4 的 7 个 + 单日 / 等级 / 收藏 / 广度 + v4.3 章节挑战）'));

  /* §7：隐藏成就控制在少量；v4.3 Batch 10（Stretch N5）扩充 2 个后为 5–8 个 */
  const hidden = list.filter(a => a.hidden);
  assert.ok(hidden.length >= 5 && hidden.length <= 8, check(`隐藏成就数量在 5–8 个（实际 ${hidden.length}）`));
  assert.deepEqual(local(hidden.map(a => a.id)).sort(), ['active-100h', 'active-50h', 'day-2h', 'mastered-3', 'precheck-master', 'review-cleared', 'streak-100'], check('隐藏成就为长期时长 / 百日 / 单日沉浸 / 复习清零 / Batch 10 的预检达人与精通'));

  /* §7.1：重要里程碑标记了独立图标，且 icons.js 确实提供了它们 */
  const milestones = list.filter(a => a.milestone).map(a => a.id);
  assert.equal(milestones.length, 5, check('5 个里程碑成就（active-100h / streak-60 / all-lessons / official-all / day-1h）'));
  for (const id of milestones) assert.ok(ICONS.achievementMilestones[id], check(`里程碑 ${id} 在 icons.js 有独立 SVG`));
  /* 图标族：每个类别都有图标，且 11 个类别的 SVG 互不相同 */
  for (const category of categoryIds) assert.ok(ICONS.achievementCategories[category], check(`类别 ${category} 有专属图标`));
  const categorySvgs = Object.values(ICONS.achievementCategories);
  assert.equal(new Set(categorySvgs).size, categorySvgs.length, check('12 个类别图标互不相同（§7.1 差异化）'));

  /* 头像框不得构成成就，否则会出现“为拿框而刷成就、成就又给框”的递归 */
  const frameIds = Logic.FRAMES.map(f => f.id);
  for (const id of frameIds) assert.ok(!ids.includes(id), check(`头像框 ${id} 没有被当成成就`));

  /* §4.1 F：unit-3 的文案必须准确，不能声称完成了完整的 HTML Foundations 单元 */
  const unit3 = list.find(a => a.id === 'unit-3');
  assert.ok(unit3.desc.includes('已开放'), check('unit-3 说明写明是“已开放课程”'));
  assert.ok(unit3.desc.includes('Recipes'), check('unit-3 说明点明不含 Project: Recipes'));
  assert.ok(!/完成 HTML Foundations 单元全部课程/.test(unit3.desc), check('unit-3 不再声称完成整个 HTML Foundations 单元'));
  const group3 = lessons.filter(l => l.group === 3);
  assert.equal(group3.length, 7, check('本站开放的 HTML Foundations 为 7 课（官方该单元共 8 课，缺 Recipes）'));
  /* 其余三个单元在本站是完整覆盖的，文案可以照旧 */
  for (const [group, count] of [[0, 5], [1, 5], [2, 2]]) {
    assert.equal(lessons.filter(l => l.group === group).length, count, check(`unit-${group} 覆盖 ${count} 课，与官方一致`));
  }
}

/* ===================== 8. 成就门槛边界（§13） ===================== */
{
  const completeFirst = (state, n, field) => {
    for (let i = 0; i < n; i += 1) Logic.lessonEntry(state, lessonIds[i])[field || 'completed'] = true;
  };

  /* A. 学习时长：八档，每档都测“恰好达标解锁”与“差 1 秒不解锁” */
  const TIME_TIERS = [['active-15m', 900], ['active-30m', 1800], ['active-1h', 3600], ['active-2h', 7200],
    ['active-5h', 18000], ['active-10h', 36000], ['active-20h', 72000], ['active-30h', 108000],
    ['active-50h', 180000], ['active-100h', 360000]];
  for (const [id, seconds] of TIME_TIERS) {
    assert.ok(unlocksWith(s => { s.totalActiveSeconds = seconds; }).has(id), check(`${id} 恰好达标即解锁`));
    assert.ok(!unlocksWith(s => { s.totalActiveSeconds = seconds - 1; }).has(id), check(`${id} 差 1 秒不解锁`));
  }

  /* B. 连续学习：六档，同样测边界 */
  const STREAK_TIERS = [['streak-2', 2], ['streak-3', 3], ['streak-5', 5], ['streak-7', 7], ['streak-14', 14], ['streak-21', 21], ['streak-30', 30], ['streak-60', 60], ['streak-100', 100]];
  for (const [id, days] of STREAK_TIERS) {
    assert.ok(unlocksWith(s => { s.daily = dailyFor(days); }).has(id), check(`${id} 恰好达标即解锁`));
    assert.ok(!unlocksWith(s => { s.daily = dailyFor(days - 1); }).has(id), check(`${id} 少一天不解锁`));
  }
  /* 599 秒不算达标（与 v3 口径一致） */
  assert.ok(!unlocksWith(s => { s.daily = { [DAY]: Logic.STREAK_MIN_DAY_SECONDS - 1 }; }).has('streak-2'),
    check('当日差 1 秒不满 10 分钟，不计入连续天数'));

  /* C. 课程完成数 */
  const LESSON_TIERS = [['lessons-3', 3], ['lessons-5', 5], ['lessons-10', 10], ['lessons-15', 15], ['all-lessons', 19]];
  for (const [id, n] of LESSON_TIERS) {
    assert.ok(unlocksWith(s => completeFirst(s, n)).has(id), check(`${id} 完成 ${n} 课即解锁`));
    assert.ok(!unlocksWith(s => completeFirst(s, n - 1)).has(id), check(`${id} 完成 ${n - 1} 课不解锁`));
  }
  assert.ok(unlocksWith(s => completeFirst(s, 1)).has('first-lesson'), check('完成第一课解锁 first-lesson'));
  assert.ok(!unlocksWith(s => { Logic.lessonEntry(s, lessonIds[1]).completed = true; }).has('first-lesson'),
    check('只完成第二课不解锁 first-lesson'));

  /* D. 官方任务 */
  const OFFICIAL_TIERS = [['official-first', 1], ['official-3', 3], ['official-5', 5], ['official-10', 10], ['official-all', 19]];
  for (const [id, n] of OFFICIAL_TIERS) {
    assert.ok(unlocksWith(s => completeFirst(s, n, 'officialCompleted')).has(id), check(`${id} 标记 ${n} 课即解锁`));
    assert.ok(!unlocksWith(s => completeFirst(s, n - 1, 'officialCompleted')).has(id), check(`${id} 标记 ${n - 1} 课不解锁`));
  }

  /* E. 本站自测 */
  /* v4.2 新增四类 goal 的门槛边界 */
  const DAY_TIERS = [['day-30m', 1800], ['day-1h', 3600], ['day-2h', 7200]];
  for (const [id, seconds] of DAY_TIERS) {
    assert.ok(unlocksWith(s => { s.daily = { [DAY]: seconds }; }).has(id), check(`${id} 单日恰好达标即解锁`));
    assert.ok(!unlocksWith(s => { s.daily = { [DAY]: seconds - 1 }; }).has(id), check(`${id} 单日差 1 秒不解锁`));
  }
  /* v4.5（交接 Core E1）：非线性曲线下 Lv.5 门槛 = 280 XP（原线性 400）；
   * Lv.20 在线性延续区，门槛仍是 1900 XP。 */
  assert.ok(unlocksWith(s => { s.xp = 280; }).has('level-5'), check('level-5 恰好 280 XP（Lv.5）解锁'));
  assert.ok(!unlocksWith(s => { s.xp = 279; }).has('level-5'), check('level-5 差 1 XP 不解锁'));
  assert.ok(unlocksWith(s => { s.xp = 1900; }).has('level-20'), check('level-20 恰好 1900 XP（Lv.20）解锁'));
  assert.ok(!unlocksWith(s => { s.xp = 1899; }).has('level-20'), check('level-20 差 1 XP 不解锁'));
  for (const [id, n] of [['purchase-first', 1], ['purchase-5', 5], ['purchase-10', 10]]) {
    assert.ok(unlocksWith(s => { for (let i = 0; i < n; i += 1) s.cosmetics.purchases[`avatar:p${i}`] = true; }).has(id), check(`${id} 兑换 ${n} 件即解锁`));
    assert.ok(!unlocksWith(s => { for (let i = 0; i < n - 1; i += 1) s.cosmetics.purchases[`avatar:p${i}`] = true; }).has(id), check(`${id} 少一件不解锁`));
  }
  assert.ok(unlocksWith(s => { lessons.forEach(l => Logic.markVisited(s, l.id, AT, DAY)); }).has('started-all'), check('started-all 打开全部 19 课解锁'));
  assert.ok(!unlocksWith(s => { for (let i = 0; i < 9; i += 1) Logic.markVisited(s, lessonIds[i], AT, DAY); }).has('started-10'), check('started-10 只开 9 课不解锁'));

  const QUIZ_TIERS = [['quiz-first', 1], ['quiz-3', 3], ['quiz-5', 5], ['quiz-10', 10], ['quiz-all', 19]];
  for (const [id, n] of QUIZ_TIERS) {
    assert.ok(unlocksWith(s => completeFirst(s, n, 'quizCompleted')).has(id), check(`${id} 标记 ${n} 课即解锁`));
    assert.ok(!unlocksWith(s => completeFirst(s, n - 1, 'quizCompleted')).has(id), check(`${id} 标记 ${n - 1} 课不解锁`));
  }

  /* 三类计数互不串台：只标记官方任务不应解锁自测或完成类成就 */
  const officialOnly = unlocksWith(s => completeFirst(s, 19, 'officialCompleted'));
  assert.ok(officialOnly.has('official-all'), check('19 课官方任务全标记解锁 official-all'));
  assert.ok(!officialOnly.has('quiz-all'), check('官方任务不会顶替自测成就'));
  assert.ok(!officialOnly.has('all-lessons'), check('官方任务不会顶替课程完成成就'));
  assert.ok(!officialOnly.has('unit-0'), check('官方任务不会顶替单元成就'));

  /* F. 单元：unit-3 只需本站开放的 7 课，不含 Recipes */
  const groupIds = group => lessons.filter(l => l.group === group).map(l => l.id);
  for (const group of [0, 1, 2, 3]) {
    const ids = groupIds(group);
    assert.ok(unlocksWith(s => { ids.forEach(id => { Logic.lessonEntry(s, id).completed = true; }); }).has(`unit-${group}`),
      check(`unit-${group} 完成本单元全部开放课程即解锁`));
    assert.ok(!unlocksWith(s => { ids.slice(0, -1).forEach(id => { Logic.lessonEntry(s, id).completed = true; }); }).has(`unit-${group}`),
      check(`unit-${group} 少完成一课不解锁`));
  }
  assert.equal(groupIds(3).length, 7, check('HTML Foundations 在本站开放 7 课'));

  /* G. 复习与使用 */
  assert.ok(unlocksWith(s => Logic.markVisited(s, lessonIds[0], AT, DAY)).has('first-start'), check('打开任意一课解锁 first-start'));
  assert.ok(!unlocksWith(s => {}).has('first-start'), check('什么都没做不解锁 first-start'));
  assert.ok(unlocksWith(s => { Logic.setLessonFlag(s, lessonIds[2], 'needsReview', true, AT, 0); }).has('review-first'),
    check('第一次标记需要复习解锁 review-first'));

  /* review-cleared 的关键区分：复习项为 0 有两种原因，只有“标记过又清空”才算 */
  assert.ok(!unlocksWith(s => {}).has('review-cleared'), check('从来没标记过复习时，复习项为 0 也不解锁 review-cleared'));
  {
    const state = fresh();
    assert.deepEqual(local(Logic.evaluateAchievements(state, lessons, AT, DAY)), [], check('空状态不解锁任何成就'));
    Logic.setLessonFlag(state, lessonIds[0], 'needsReview', true, AT, 0);
    const afterMark = Logic.evaluateAchievements(state, lessons, AT, DAY);
    assert.ok(local(afterMark).includes('review-first'), check('标记复习后解锁 review-first'));
    assert.ok(!local(afterMark).includes('review-cleared'), check('仍有复习项时不解锁 review-cleared'));
    assert.equal(state.reviewEverMarked, true, check('复习闩锁已置位'));

    Logic.setLessonFlag(state, lessonIds[0], 'needsReview', false, AT, 0);
    const afterClear = Logic.evaluateAchievements(state, lessons, AT, DAY);
    assert.ok(local(afterClear).includes('review-cleared'), check('清空全部复习项后解锁 review-cleared'));
    assert.equal(state.reviewEverMarked, true, check('清空复习项不会复位闩锁'));

    Logic.setLessonFlag(state, lessonIds[0], 'needsReview', true, AT, 0);
    const afterRemark = Logic.evaluateAchievements(state, lessons, AT, DAY);
    assert.ok(!local(afterRemark).includes('review-cleared'), check('已解锁的成就不会重复出现在新解锁列表'));
    assert.ok(state.achievements['review-cleared'], check('再次标记复习不会撤销已解锁的成就'));
  }

  /* 成就不重复解锁 */
  {
    const state = fresh();
    Logic.markVisited(state, lessonIds[0], AT, DAY);
    assert.ok(local(Logic.evaluateAchievements(state, lessons, AT, DAY)).includes('first-start'), check('首次求值解锁'));
    for (let round = 0; round < 5; round += 1) {
      assert.equal(Logic.evaluateAchievements(state, lessons, AT, DAY).length, 0, check(`第 ${round + 1} 次重复求值不再解锁`));
    }
    assert.equal(Object.keys(state.achievements).length, 2, check('成就记录恰有两条（迈出第一步 + 推开学习之门，v4.3 C1）'));
  }

  /* 成就与头像框都不发 XP（§5：避免递归奖励体系）。
   * 这里先把状态推到“全解锁”，再断言 XP 与分钟结算位点都没被动过。
   * 注意 first-start 依赖 started、review-* 依赖复习闩锁，所以必须走真实入口
   * （markVisited / setLessonFlag）构造，直接改 entry 字段是解锁不出来的——
   * 这一点本身就是被测行为：完成状态不能凭空推导出“打开过这一课”。 */
  {
    const state = fresh();
    state.xp = 2500;                                 /* Lv.25：3 档等级成就 + 全部等级框 */
    const xpBefore = state.xp;
    Logic.markVisited(state, lessonIds[0], AT, DAY);
    state.totalActiveSeconds = 400000;               /* 111 小时，10 档时长全解锁（含 100h） */
    state.daily = dailyFor(100);                     /* 连续 100 天，9 档 streak 全解锁 */
    /* 每日目标连续成就：把 100 天每天提到 20 分钟以上（目标默认 20 分钟） */
    Object.keys(state.daily).forEach(key => { state.daily[key] = 1300; });
    state.daily[DAY] = 8000;                         /* 单日 2 小时+，3 档单日全解锁 */
    lessons.forEach(lesson => Logic.markVisited(state, lesson.id, AT, DAY));  /* 19 课全看过 */
    for (let i = 0; i < 10; i += 1) state.cosmetics.purchases[`avatar:fixture-${i}`] = true;  /* 10 件兑换 */
    /* v4.3：Boss 成就（boss-first / 未战先知）需要真实的 Boss 纪录；
     * Batch 10（Stretch N5）：隐藏成就「未战先达」需要 2 个单元预检 ≥70% */
    state.bosses = {
      introduction: { attempts: 1, passCount: 1, highCount: 1, lastPassDay: DAY, lastHighDay: DAY, bestPct: 100, firstPct: 100, lastPct: 100, firstWasPrecheck: true, precheckBestPct: 100 },
      prerequisites: { attempts: 1, passCount: 1, highCount: 1, lastPassDay: DAY, lastHighDay: DAY, bestPct: 90, firstPct: 90, lastPct: 90, firstWasPrecheck: true, precheckBestPct: 85 }
    };
    completeFirst(state, 19);
    completeFirst(state, 19, 'officialCompleted');
    completeFirst(state, 19, 'quizCompleted');
    /* Batch 10（Stretch N5）：隐藏成就「精通的滋味」需要 3 课走过
     * “标记过又清空”的复习周期（mastered = 三项齐全 + everMarked + 无待复习） */
    [5, 6, 7].forEach(index => {
      Logic.setLessonFlag(state, lessonIds[index], 'needsReview', true, AT, 0);
      Logic.setLessonFlag(state, lessonIds[index], 'needsReview', false, AT, 0);
    });
    Logic.evaluateAchievements(state, lessons, AT, DAY);
    assert.equal(Object.keys(state.achievements).length, Logic.ACHIEVEMENTS.length, check('该状态解锁全部 63 个成就（含 2 个 Batch 10 隐藏成就 + v4.11.3 两个大课成就）'));
    assert.equal(Logic.unlockedFrames(state).length, Logic.FRAMES.length - 8, check('该状态解锁全部非叶片头像框（8 个叶片框未解锁，刻意不算已解锁）'));
    assert.equal(state.xp, xpBefore, check('解锁全部成就与非兑换头像框都不发放任何 XP'));
    assert.equal(state.minuteXpAwarded, 0, check('直接改 totalActiveSeconds 不会绕过分钟 XP 结算位点'));
  }
  /* 反向确认：只改完成状态、不走 markVisited 时，first-start 不应被解锁 */
  {
    const state = fresh();
    completeFirst(state, 19);
    Logic.evaluateAchievements(state, lessons, AT, DAY);
    assert.ok(!state.achievements['first-start'], check('没有 started 记录时不解锁 first-start'));
    assert.ok(!state.achievements['review-first'], check('没有复习闩锁时不解锁 review-first'));
    assert.ok(!state.achievements['review-cleared'], check('没有复习闩锁时不解锁 review-cleared'));
  }

  /* goalProgress 与 isGoalDone 必须自洽，UI 与助手都依赖它 */
  for (const item of Logic.ACHIEVEMENTS) {
    const state = fresh();
    const p = Logic.goalProgress(state, item.goal, lessons, DAY);
    assert.ok(Number.isFinite(p.current) && Number.isFinite(p.target), check(`${item.id}: goalProgress 返回有限数`));
    assert.ok(p.current >= 0 && p.target >= 0, check(`${item.id}: goalProgress 非负`));
    assert.equal(Logic.isGoalDone(state, item.goal, lessons, DAY), p.target > 0 && p.current >= p.target,
      check(`${item.id}: isGoalDone 与 goalProgress 一致`));
    assert.ok(['seconds', 'days', 'lessons', 'steps', 'levels', 'items', 'times', 'percent'].includes(p.unit), check(`${item.id}: 单位可显示（${p.unit}）`));
  }
}

/* ===================== 9. 头像框（§5、§13） ===================== */
{
  const frames = Logic.FRAMES;
  assert.ok(frames.length >= 24 && frames.length <= 30, check(`头像框数量在 v4.3 交接 H 建议的 24–30 个之间（实际 ${frames.length}）`));
  assert.equal(frames.length, 28, check('v4.5 Core E2 提供 28 个头像框（4 默认 + 7 等级 + 9 成就 + 8 叶片解锁，仍在交接 H 建议 24–30 区间）'));
  const frameIds = frames.map(f => f.id);
  assert.equal(new Set(frameIds).size, frameIds.length, check('头像框 id 不重复'));
  assert.equal(new Set(frames.map(f => f.css)).size, frames.length, check('头像框 CSS 类名不重复'));
  assert.equal(new Set(frames.map(f => f.zh)).size, frames.length, check('头像框中文名不重复（视觉上也要能区分）'));

  for (const frame of frames) {
    assert.ok(typeof frame.zh === 'string' && frame.zh.trim(), check(`${frame.id}: 有中文名`));
    assert.ok(typeof frame.desc === 'string' && frame.desc.trim().length > 4, check(`${frame.id}: 有解锁条件说明`));
    assert.ok(['level', 'achievement', 'coins'].includes(frame.unlock.kind), check(`${frame.id}: 解锁方式合法`));
    assert.ok(!('xp' in frame), check(`${frame.id}: 头像框不提供 XP`));
    if (frame.unlock.kind === 'achievement') {
      assert.ok(Logic.ACHIEVEMENTS.some(a => a.id === frame.unlock.value), check(`${frame.id}: 绑定的成就存在`));
    } else {
      assert.ok(Number.isInteger(frame.unlock.value) && frame.unlock.value >= 1, check(`${frame.id}: 解锁等级为正整数`));
    }
  }
  assert.equal(frames.filter(f => f.unlock.kind === 'level').length, 11, check('11 个等级解锁框（4 个 Lv.1 默认框 + v4.5 Core E2 新芽框 Lv.2/陶土框 Lv.4 + 蓝环 Lv.3/叶脉 Lv.5/波纹 Lv.8/金色 Lv.10/晨光 Lv.15）'));
  assert.equal(frames.filter(f => f.unlock.kind === 'achievement').length, 9, check('9 个成就解锁框（含 v4.3 启程框与破甲框）'));
  assert.equal(frames.filter(f => f.unlock.kind === 'coins').length, 8, check('8 个叶片解锁框（v4.2 的 6 个 + v4.3 低档位藤蔓框与可可框）'));
  for (const frame of frames.filter(f => f.unlock.kind === 'coins')) {
    assert.ok(Number.isInteger(frame.unlock.value) && frame.unlock.value > 0, check(`${frame.id}: 兑换价格为正整数`));
  }

  /* 默认框始终可用 */
  const blank = fresh();
  assert.equal(blank.xp, 0, check('新状态 0 XP'));
  assert.equal(Logic.levelOf(0), 1, check('0 XP 为 Lv.1'));
  const basic = frames.find(f => f.id === Logic.DEFAULT_FRAME_ID);
  assert.ok(basic, check('默认框存在于清单中'));
  assert.equal(basic.unlock.value, 1, check('默认框的解锁等级是 Lv.1，因此永远可用'));
  assert.ok(Logic.isFrameUnlocked(blank, basic), check('新状态下默认框已解锁'));
  assert.equal(Logic.normalizeFrameId(Logic.DEFAULT_FRAME_ID, blank), Logic.DEFAULT_FRAME_ID, check('新状态可装备默认框'));
  assert.equal(Logic.unlockedFrames(blank).length, 4, check('新状态解锁全部 4 个默认框（交接 B2：默认框至少 4 个）'));

  /* 等级框边界：差 1 XP 不可装备，到位即可装备。
   * v4.5（交接 Core E1）：非线性曲线下门槛必须从 xpForLevel 取，
   * 不能再按 (level−1)×100 手算；新增 Lv.2 新芽框与 Lv.4 陶土框进边界清单。 */
  for (const [id, level] of [['frame-sprout', 2], ['frame-ring', 3], ['frame-terra', 4], ['frame-leaf', 5], ['frame-wave', 8], ['frame-gold', 10]]) {
    const frame = frames.find(f => f.id === id);
    const below = fresh();
    below.xp = Logic.xpForLevel(level) - 1;
    const at = fresh();
    at.xp = Logic.xpForLevel(level);
    assert.equal(Logic.levelOf(at.xp), level, check(`${id}: ${at.xp} XP 恰为 Lv.${level}`));
    assert.equal(Logic.levelOf(below.xp), level - 1, check(`${id}: 差 1 XP 仍是 Lv.${level - 1}`));
    assert.ok(!Logic.isFrameUnlocked(below, frame), check(`${id} 未达等级不解锁`));
    assert.ok(Logic.isFrameUnlocked(at, frame), check(`${id} 达到 Lv.${level} 解锁`));
    assert.equal(Logic.normalizeFrameId(id, below), Logic.DEFAULT_FRAME_ID, check(`${id} 未解锁不能装备`));
    assert.equal(Logic.normalizeFrameId(id, at), id, check(`${id} 解锁后可以装备`));
  }

  /* 成就框：成就未解锁不能装备，解锁后可以 */
  const ACH_FRAMES = [['frame-start', 'unit-0'], ['frame-git', 'unit-2'], ['frame-streak', 'streak-7'],
    ['frame-time', 'active-10h'], ['frame-quiz', 'quiz-all'], ['frame-task', 'official-all'],
    ['frame-graduate', 'all-lessons']];
  for (const [frameId, achievementId] of ACH_FRAMES) {
    const frame = frames.find(f => f.id === frameId);
    const state = fresh();
    assert.ok(!Logic.isFrameUnlocked(state, frame), check(`${frameId} 成就未解锁时不可用`));
    assert.equal(Logic.normalizeFrameId(frameId, state), Logic.DEFAULT_FRAME_ID, check(`${frameId} 成就未解锁时不能装备`));
    state.achievements[achievementId] = AT;
    assert.ok(Logic.isFrameUnlocked(state, frame), check(`${frameId} 在 ${achievementId} 解锁后可用`));
    assert.equal(Logic.normalizeFrameId(frameId, state), frameId, check(`${frameId} 解锁后可以装备`));
  }

  /* 非法输入 */
  assert.equal(Logic.isFrameUnlocked(fresh(), null), false, check('null 框视为未解锁'));
  assert.equal(Logic.isFrameUnlocked(fresh(), { id: 'x', unlock: { kind: 'mystery', value: 1 } }), false, check('未知解锁方式视为未解锁'));
  assert.equal(Logic.isFrameUnlocked(fresh(), { id: 'x' }), false, check('缺少 unlock 视为未解锁'));
  assert.equal(Logic.normalizeFrameId(undefined, fresh()), Logic.DEFAULT_FRAME_ID, check('未提供框 id 回落默认'));
  assert.equal(Logic.normalizeFrameId('frame-nonexistent', fresh()), Logic.DEFAULT_FRAME_ID, check('不存在的框回落默认'));

  /* 装备框不改变 XP；框解锁数量随等级单调增加 */
  const rich = fresh();
  rich.xp = 900;
  const before = rich.xp;
  Logic.normalizeFrameId('frame-gold', rich);
  assert.equal(rich.xp, before, check('装备头像框不产生 XP'));
  assert.equal(Logic.unlockedFrames(rich).length, 10, check('Lv.10 解锁全部 10 个等级框（4 默认 + 新芽/蓝环/陶土/叶脉/波纹/金色）'));
  const mid = fresh();
  mid.xp = 400;
  assert.equal(Logic.unlockedFrames(mid).length, 8, check('Lv.6（400 XP）解锁 8 个等级框（4 默认 + 新芽 Lv.2 + ring Lv.3 + 陶土 Lv.4 + leaf Lv.5）'));
}

/* ===================== 10. 目标提示（§10 学习助手的数据来源） ===================== */
{
  const blank = fresh();
  const goals = Logic.nextVisibleGoals(blank, lessons, DAY, 3);
  assert.equal(goals.length, 3, check('nextVisibleGoals 尊重 limit'));
  assert.ok(goals.every(g => !Logic.ACHIEVEMENTS.find(a => a.id === g.id).hidden), check('提示里不含隐藏成就'));
  assert.ok(goals.every(g => g.zh && g.desc), check('提示带名称与条件说明'));
  assert.ok(goals.every(g => g.target > 0 && g.remaining >= 0 && g.current >= 0), check('提示的数值合理'));
  for (let i = 1; i < goals.length; i += 1) {
    assert.ok(goals[i - 1].remaining <= goals[i].remaining, check('提示按“还差多少”升序'));
  }
  assert.equal(Logic.nextVisibleGoals(blank, lessons, DAY).length, 3, check('limit 缺省为 3'));
  assert.equal(Logic.nextVisibleGoals(blank, lessons, DAY, 0).length, 3, check('limit 为 0 时回落默认'));
  assert.ok(Logic.nextVisibleGoals(blank, lessons, DAY, 99).length <= Logic.ACHIEVEMENTS.length, check('limit 超过总数时不越界'));

  /* 已解锁的不再出现在提示里 */
  Logic.markVisited(blank, lessonIds[0], AT, DAY);
  Logic.evaluateAchievements(blank, lessons, AT, DAY);
  const after = Logic.nextVisibleGoals(blank, lessons, DAY, 40);
  assert.ok(!after.some(g => g.id === 'first-start'), check('已解锁的成就不再提示'));
  assert.ok(!after.some(g => g.hidden), check('任何情况下都不提示隐藏成就'));

  const frameHints = Logic.nextFrames(blank, lessons, DAY, 2);
  assert.equal(frameHints.length, 2, check('nextFrames 尊重 limit'));
  assert.ok(frameHints.every(f => f.zh && f.desc), check('头像框提示带名称与条件'));
  assert.ok(frameHints.every(f => !Logic.isFrameUnlocked(blank, Logic.FRAMES.find(x => x.id === f.id))), check('只提示未解锁的头像框'));
  for (let i = 1; i < frameHints.length; i += 1) {
    assert.ok(frameHints[i - 1].remaining <= frameHints[i].remaining, check('头像框提示按“还差多少”升序'));
  }

  /* 全部解锁后不再提示，避免助手说“再努力一点”却无事可做 */
  const done = fresh();
  done.xp = 1400;   /* Lv.15：v4.3 Batch 6 的晨光框也解锁，只剩叶片框 */
  Logic.ACHIEVEMENTS.forEach(a => { done.achievements[a.id] = AT; });
  assert.equal(Logic.unlockedFrames(done).length, Logic.FRAMES.length - 8, check('满成就 + Lv.15 时非叶片框全解锁（叶片框仍需解锁）'));
  const coinHints = local(Logic.nextFrames(done, lessons, DAY, 10));
  assert.equal(coinHints.length, 8, check('满成就后下一个头像框只剩 8 个叶片解锁框（含低档位藤蔓框与可可框）'));
  assert.ok(coinHints.every(f => f.unit === 'coins'), check('叶片框按「还差多少叶片」提示'));
  assert.deepEqual(local(Logic.nextVisibleGoals(done, lessons, DAY, 5)), [], check('全部解锁后不再提示下一个成就'));
}

/* ===================== 11. summary 的 v4 新字段 ===================== */
{
  const state = fresh();
  Logic.setProfileField(state, 'nickname', '阿明');
  Logic.setProfileField(state, 'avatarId', 'fox');
  Logic.lessonEntry(state, lessonIds[0]).completed = true;
  Logic.lessonEntry(state, lessonIds[1]).officialCompleted = true;
  Logic.lessonEntry(state, lessonIds[2]).quizCompleted = true;
  Logic.lessonEntry(state, lessonIds[3]).needsReview = true;
  Logic.lessonEntry(state, lessonIds[4]).started = true;
  state.xp = 250;

  const s = Logic.summary(state, lessons, DAY);
  assert.equal(s.nickname, '阿明', check('summary 带昵称'));
  assert.equal(s.avatarId, 'fox', check('summary 带头像 id'));
  assert.equal(s.avatarData, null, check('summary 带上传头像数据'));
  assert.equal(s.equippedFrameId, Logic.DEFAULT_FRAME_ID, check('summary 带装备的头像框'));
  assert.equal(s.equippedFrame.id, Logic.DEFAULT_FRAME_ID, check('summary 带装备框的完整定义'));
  assert.equal(s.unlockedFrameCount, 7, check('v4.5 曲线：250 XP = Lv.4，解锁 7 个等级框（4 默认 + 新芽 Lv.2 + 蓝色双环 Lv.3 + 陶土 Lv.4）'));
  assert.equal(s.frameTotal, Logic.FRAMES.length, check('summary 带头像框总数'));
  assert.equal(s.completedCount, 1, check('summary 完成课程数只算 completed'));
  assert.equal(s.officialCompletedCount, 1, check('summary 官方任务完成数'));
  assert.equal(s.quizCompletedCount, 1, check('summary 自测完成数'));
  assert.equal(s.startedCount, 1, check('summary 已开始课程数'));
  assert.equal(s.needsReviewCount, 1, check('summary 需复习课程数'));
  assert.equal(s.reviewEverMarked, false, check('summary 暴露复习闩锁（直接改 entry 不算标记过）'));
  assert.equal(s.totalLessons, 19, check('summary 课程总数仍为当前开放的 19'));
  assert.equal(s.level, 4, check('summary 等级（v4.5 曲线：250 XP = Lv.4）'));
  assert.equal(s.achievementTotal, 63, check('summary 成就总数为 63（v4.11.3 起含两个大课成就）'));

  /* 走正常入口标记复习时，闩锁必须置位 */
  const viaApi = fresh();
  Logic.setLessonFlag(viaApi, lessonIds[0], 'needsReview', true, AT, 0);
  assert.equal(viaApi.reviewEverMarked, true, check('经 setLessonFlag 标记复习会置位闩锁'));
  assert.equal(Logic.summary(viaApi, lessons, DAY).reviewEverMarked, true, check('summary 反映闩锁'));
  Logic.setLessonFlag(viaApi, lessonIds[0], 'needsReview', false, AT, 0);
  assert.equal(viaApi.reviewEverMarked, true, check('取消复习不会复位闩锁'));
}

console.log(`通过：个人资料模块 ${checks} 项断言（默认头像与 SVG 安全、昵称清洗与截断、头像 id 与数据白名单、上传类型与大小校验、profile 导出导入与未解锁框回落、63 个成就的配置与十二类门槛边界、复习清零的闩锁语义、成就与头像框均不发 XP、28 个头像框（4 默认）的等级/成就/叶片解锁边界、目标提示排序与隐藏成就排除、summary 新字段）。`);
