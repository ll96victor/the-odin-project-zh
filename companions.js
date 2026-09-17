/* 小奥 Companion 形象清单（v4.2，交接 §6.2、§6.3；v4.4 扩充角色形态，交接 D1）。
 *
 * 全部为本站原创的几何小生物 / 小物件 / Q 版角色，不复制任何商业角色、Codex 宠物或
 * 王者荣耀角色。不同形象只改变外观、名称与一句固定风格文案（voice），
 * 不改变学习建议算法——小奥的每一条信息仍然由 progress.js 的确定性规则
 * 算出（§6.4：继续保持非 AI）。
 *
 * 字段：
 *   id      与 progress.js 的 DEFAULT_COMPANION_ID 对应（tests 断言一致）
 *   zh      名称（会显示在助手面板标题）
 *   desc    一句话介绍
 *   voice   固定风格文案，显示在助手面板里；只是语气，不改变任何数值
 *   unlock  解锁方式，由 collections.js 统一判定（default / level / achievement / coins）
 *   svg     角色形象（data URL 方式放进 <img>，惰性且安全，与 avatars.js 同一渲染路径）
 *   bust    v4.4（交接 D1）：角色形态标记（'boy' / 'girl'）——带 bust 的形象
 *           支持五种表情状态，UI 用 ODIN_COMPANION_BUST.build(bust, mood) 按需
 *           生成半身大图；普通几何形象仍是单张 svg。
 */

/* ---------- v4.4（交接 D1）：小奥角色形态 bust 生成器 ----------
 * 两个原创 Q 版角色（小奥·少年 / 小奥·少女）× 五种表情（普通 / 开心 / 鼓励 /
 * 提醒 / 庆祝）的参数化 SVG。同一骨架（发型 / 脸 / 卫衣 / 小芽徽章）+ 表情件
 * （眼 / 嘴 / 附加装饰）拼装，字符串级生成、无运行时图形库、无动画大包；
 * 单张约 1KB，按需生成不预存。表情由 app.js 按**确定性规则**从学习数据映射
 * （今日目标达成 → 庆祝、有到期复习 → 提醒、差一点计入连续 → 鼓励……），
 * 不联网、不随机，与 v4 以来「小奥非 AI」的边界一致。 */
window.ODIN_COMPANION_BUST = (() => {
  'use strict';

  const MOODS = ['normal', 'happy', 'encourage', 'remind', 'celebrate'];

  const PALETTES = {
    boy: {
      skin: '#f3d9bf', skinShade: '#e5c0a0', hair: '#3f356e', hairLight: '#6253a0',
      cloth: '#6655a6', clothDark: '#51408f', eye: '#29243a', blush: null
    },
    girl: {
      skin: '#f7ddc6', skinShade: '#eac2a2', hair: '#7c4a2e', hairLight: '#93593a',
      cloth: '#7665b2', clothDark: '#5a4a93', eye: '#3a281e', blush: '#f0a898'
    }
  };

  function eyesFor(mood, p) {
    const round = `<circle cx="52" cy="52" r="4.6" fill="${p.eye}"/><circle cx="53.6" cy="50.3" r="1.6" fill="#fff"/><circle cx="76" cy="52" r="4.6" fill="${p.eye}"/><circle cx="77.6" cy="50.3" r="1.6" fill="#fff"/>`;
    if (mood === 'happy') return `<path d="M46 54q6-7 12 0M70 54q6-7 12 0" stroke="${p.eye}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    if (mood === 'celebrate') return `<path d="M45 55q7-9 14 0M69 55q7-9 14 0" stroke="${p.eye}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
    if (mood === 'remind') return `${round}<path d="M45 42q6-3 12-1" stroke="${p.hair}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M70 40q6-3 11 1" stroke="${p.hair}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    return round;
  }

  function mouthFor(mood, p) {
    if (mood === 'happy') return `<path d="M57 65q7 9 14 0z" fill="${p.eye}"/>`;
    if (mood === 'celebrate') return `<path d="M54 64q10 16 20 0z" fill="${p.eye}"/><path d="M59.5 70.5q4.5 3.5 9 0" fill="#e88a7a"/>`;
    if (mood === 'remind') return `<path d="M59 67h10" stroke="${p.eye}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    if (mood === 'encourage') return `<ellipse cx="64" cy="67" rx="4.2" ry="5" fill="${p.eye}"/>`;
    return `<path d="M58 66q6 5 12 0" stroke="${p.eye}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  }

  function extraFor(mood) {
    if (mood === 'remind') {
      return '<circle cx="105" cy="25" r="10" fill="#fdf8ee" stroke="#56625c" stroke-width="2"/><rect x="103.7" y="19" width="2.6" height="8" rx="1.3" fill="#56625c"/><circle cx="105" cy="30.5" r="1.6" fill="#56625c"/>';
    }
    if (mood === 'celebrate') {
      return '<circle cx="23" cy="26" r="2.6" fill="#e8a0b0"/><circle cx="105" cy="48" r="2.4" fill="#f2d98b"/><circle cx="17" cy="47" r="2.2" fill="#7f96e8"/><path d="M99 13l2 4.6 4.6 2-4.6 2-2 4.6-2-4.6-4.6-2 4.6-2z" fill="#6fc2a8"/>';
    }
    if (mood === 'encourage') {
      return '<path d="M25 33l1.8 4.2 4.2 1.8-4.2 1.8-1.8 4.2-1.8-4.2-4.2-1.8 4.2-1.8z" fill="#f2d98b"/><path d="M102 40l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" fill="#f2d98b"/>';
    }
    return '';
  }

  function hairFor(who, p) {
    if (who === 'boy') {
      /* 蓬乱短发：环形刘海 + 两撮呆毛 */
      return `<path d="M30 56C28 30 42 14 64 14s36 16 34 42l-7-4c1-14-8-24-27-24S39 38 40 52z" fill="${p.hair}"/>`
        + `<path d="M52 17l3-9 5 8M68 15l4-9 4 9" fill="${p.hairLight}"/>`
        + `<path d="M40 46q10-10 24-9 12 1 20 9-8-4-20-4-14 0-24 4z" fill="${p.hairLight}"/>`;
    }
    /* 少女：齐肩内扣短发 + 斜刘海 + 左侧小叶发卡（呼应园地小芽） */
    return `<path d="M27 84C22 46 36 13 64 13s42 33 37 71l-12 3c5-30-3-52-25-52S38 57 43 87z" fill="${p.hair}"/>`
      + `<path d="M35 47C37 27 48 18 64 18s27 9 29 29c-9-9-17-12-29-12-8 0-14 3-20 7-4 2-7 3-9 5z" fill="${p.hairLight}"/>`
      + `<path d="M37 34c-5-2-7-7-6-12 5 1 8 5 8 10z" fill="#4a7c59"/><path d="M38 33l-3-7" stroke="#276148" stroke-width="1.8" stroke-linecap="round"/>`;
  }

  function bodyFor(who, p) {
    const strings = who === 'boy'
      ? `<path d="M57 96v9M71 96v9" stroke="${p.clothDark}" stroke-width="2.6" stroke-linecap="round"/>`
      : '';
    /* 卫衣 + 领口弧 + 胸前小芽徽章（与 sprout 原型同一株芽——「小奥长大了」） */
    return `<path d="M33 128v-16c0-13 9-22 21-25l4 5c1 2 3 3 6 3s5-1 6-3l4-5c12 3 21 12 21 25v16z" fill="${p.cloth}"/>`
      + `<path d="M47 92q17 11 34 0" stroke="${p.clothDark}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
      + strings
      + `<path d="M64 118v-7" stroke="#276148" stroke-width="2" stroke-linecap="round"/>`
      + `<path d="M64 113c-4 0-6.4-2.8-6.4-6 4.2 0 6.4 2.8 6.4 6z" fill="#6f9c85"/>`
      + `<path d="M64 112c4 0 6.4-2.8 6.4-6-4.2 0-6.4 2.8-6.4 6z" fill="#276148"/>`;
  }

  function build(characterId, mood) {
    const who = PALETTES[characterId] ? characterId : 'boy';
    const m = MOODS.includes(mood) ? mood : 'normal';
    const p = PALETTES[who];
    const blush = p.blush
      ? `<ellipse cx="42" cy="61" rx="4.8" ry="2.8" fill="${p.blush}" opacity=".5"/><ellipse cx="86" cy="61" rx="4.8" ry="2.8" fill="${p.blush}" opacity=".5"/>`
      : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">'
      + bodyFor(who, p)
      + `<rect x="57" y="76" width="14" height="14" rx="4" fill="${p.skinShade}"/>`
      + `<circle cx="64" cy="50" r="33" fill="${p.skin}"/>`
      + `<ellipse cx="64" cy="80" rx="7" ry="3" fill="${p.skinShade}" opacity=".5"/>`
      + hairFor(who, p)
      + blush
      + eyesFor(m, p)
      + mouthFor(m, p)
      + extraFor(m)
      + '</svg>';
  }

  /* 64px 小图标：同一张脸的头部裁切（viewBox 裁剪，不另画一套） */
  function icon(characterId) {
    const who = PALETTES[characterId] ? characterId : 'boy';
    const full = build(who, 'normal');
    return full.replace('width="128" height="128" viewBox="0 0 128 128"', 'width="64" height="64" viewBox="24 6 80 80"');
  }

  return { version: 1, MOODS, characters: Object.keys(PALETTES), build, icon };
})();

window.ODIN_COMPANIONS = {
  /* v4.5（交接 C1）品牌模型说明（去 Odin 化）：
   *   - 系统称谓 = 「学习伙伴」（UI 文案，见 app.js）；
   *   - 默认伙伴名 = 「小诺」（v4.8 起默认角色为登记表的 nono；本文件的
   *     sprout 已退役——数据保留可回滚，UI 由 companion-view 统一回落），
   *     可由用户自定义（progress.settings().companionName）；
   *   - 下面每个 companion 的 zh 是**形象名**（幼芽 / 少年 / 少女 / 小石 …），
   *     不再带「小奥 · 」品牌前缀；id（sprout / odin-boy / …）是内部标识，
   *     存进用户档案，本轮刻意不改名（交接 C1：避免无价值大迁移、不破坏旧数据）。
   *   - 昵称与形象是两个独立维度：换形象不改名字，改名字不换形象。 */
  version: 1,
  defaultCompanionId: 'sprout',
  dataUrlPrefix: 'data:image/svg+xml;charset=utf-8,',
  license: '本站原创几何形象，随本项目内容采用 CC BY-NC-SA 4.0；未使用任何第三方角色或受版权保护的形象。',
  companions: [
    {
      id: 'sprout',
      zh: '幼芽',
      desc: '与你一起慢慢长出根基的园中新芽。',
      voice: '每天学一点，根基就深一点。',
      unlock: { kind: 'default' },
      /* v4.5.2 Final Concept Match：首页 Hero 需要大尺寸展示学习伙伴，真实放大检查后
       * 做轻量提质——接地影 / 叶脉 / 身体明暗与高光 / 眼睛高光 / 珊瑚橙腮红。
       * viewBox、角色比例、整体轮廓与 id 全部不变，36px 触发按钮尺寸仍清晰。 */
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><ellipse cx="32" cy="58.6" rx="15.5" ry="2.6" fill="#276148" opacity=".13"/><path d="M32 22V12" stroke="#276148" stroke-width="2.6" stroke-linecap="round" fill="none"/><path d="M32 15c-6 0-9.5-4-9.5-8.5C28.5 6.5 32 10.5 32 15z" fill="#6f9c85"/><path d="M30.8 13.8q-3.6-1.6-5.8-4.8" stroke="#276148" stroke-width="1" opacity=".38" fill="none" stroke-linecap="round"/><path d="M32 13c6 0 9.5-4 9.5-8.5C35.5 4.5 32 8.5 32 13z" fill="#276148"/><path d="M33.2 11.9q3.5-1.5 5.6-4.4" stroke="#edf3ee" stroke-width="1" opacity=".42" fill="none" stroke-linecap="round"/><rect x="14" y="22" width="36" height="34" rx="9" fill="#edf3ee" stroke="#276148" stroke-width="2.4"/><path d="M43.5 23.6A9 9 0 0 1 48 31v16a9 9 0 0 1-6.5 8.6c3.4-3.6 4.6-8 4.6-13.4V30.6c0-3.1-.9-5.4-2.6-7z" fill="#276148" opacity=".08"/><path d="M19.5 27.5q-1.6 1.8-1.8 4.2" stroke="#ffffff" stroke-width="2" opacity=".75" stroke-linecap="round" fill="none"/><ellipse cx="20.2" cy="42.4" rx="2.5" ry="1.5" fill="#e8a18d" opacity=".5"/><ellipse cx="43.8" cy="42.4" rx="2.5" ry="1.5" fill="#e8a18d" opacity=".5"/><circle cx="25" cy="37" r="2.7" fill="#22302a"/><circle cx="25.9" cy="36.1" r=".95" fill="#ffffff"/><circle cx="39" cy="37" r="2.7" fill="#22302a"/><circle cx="39.9" cy="36.1" r=".95" fill="#ffffff"/><path d="M26 45q6 5 12 0" stroke="#22302a" stroke-width="2.4" stroke-linecap="round" fill="none"/></svg>'
    },
    /* ---------- v4.4（交接 D1）：小奥的两个「角色形态」 ----------
     * 幼芽长大后变成了少年与少女——同一株园中小芽的拟人化（胸前的徽章
     * 就是 sprout 那株芽）。原创 Q 版方向，不模仿任何具体商业角色；
     * 默认解锁（交接 D1：作为默认或易解锁内容），支持五种表情状态
     * （bust 字段标记，UI 按确定性规则切换，见 app.js companionMood）。 */
    {
      id: 'odin-boy',
      zh: '少年',
      desc: '幼芽长成的绿卫衣少年，胸前的徽章还是那株芽。',
      voice: '今天也一起加油，我一直在。',
      unlock: { kind: 'default' },
      bust: 'boy',
      svg: window.ODIN_COMPANION_BUST.icon('boy')
    },
    {
      id: 'odin-girl',
      zh: '少女',
      desc: '幼芽长成的短发少女，发间别着一片小叶。',
      voice: '慢慢来，比较快。',
      unlock: { kind: 'default' },
      bust: 'girl',
      svg: window.ODIN_COMPANION_BUST.icon('girl')
    },
    /* ---------- v4.3 扩充（交接 B2：默认小奥至少 4 个；I：更多形象） ----------
     * 新增 3 个零门槛默认形象。既有等级 / 成就 / 叶片解锁形象保留原解锁方式，
     * 不做任何“原本可得 → 叶片解锁”的倒退。 */
    {
      id: 'pebble',
      zh: '小石',
      desc: '路边捡到的圆石头，被你焐热之后一直跟着你。',
      voice: '慢慢来，我一直在这儿。',
      unlock: { kind: 'default' },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path d="M12 44c0-13 9-22 20-22s20 9 20 22c0 4-2 7-5 7H17c-3 0-5-3-5-7z" fill="#9aa5a0" stroke="#56625c" stroke-width="2.4"/><path d="M20 28q6-4 12-3" stroke="#c8d3cb" stroke-width="2.4" stroke-linecap="round" fill="none"/><circle cx="25" cy="38" r="2.6" fill="#22302a"/><circle cx="39" cy="38" r="2.6" fill="#22302a"/><path d="M27 46q5 4 10 0" stroke="#22302a" stroke-width="2.3" stroke-linecap="round" fill="none"/></svg>'
    },
    {
      id: 'firefly',
      zh: '萤萤',
      desc: '尾巴提着一盏小灯的萤火虫，专挑夜读的晚上出现。',
      voice: '夜里的一点光，陪你读书。',
      unlock: { kind: 'default' },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><ellipse cx="24" cy="26" rx="10" ry="7" fill="#d6dcf0" opacity=".55" transform="rotate(-24 24 26)"/><ellipse cx="40" cy="26" rx="10" ry="7" fill="#d6dcf0" opacity=".55" transform="rotate(24 40 26)"/><ellipse cx="32" cy="34" rx="9" ry="12" fill="#3c4670"/><circle cx="32" cy="24" r="6" fill="#22302a"/><circle cx="29.5" cy="23" r="1.6" fill="#f2d98b"/><circle cx="34.5" cy="23" r="1.6" fill="#f2d98b"/><circle cx="32" cy="44" r="6" fill="#f2d98b"/><circle cx="32" cy="44" r="9" fill="#f2d98b" opacity=".25"/><path d="M29 16l-2-4M35 16l2-4" stroke="#22302a" stroke-width="1.8" stroke-linecap="round"/></svg>'
    },
    {
      id: 'leafboat',
      zh: '叶舟',
      desc: '一片会漂的小叶子，船舱里坐着一个打盹的芽。',
      voice: '划呀划，划到下一课。',
      unlock: { kind: 'default' },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path d="M8 38q24 16 48 0-8 16-24 16T8 38z" fill="#6f9c85" stroke="#276148" stroke-width="2.2"/><path d="M32 38v14" stroke="#276148" stroke-width="2" stroke-linecap="round"/><path d="M32 30v-8" stroke="#276148" stroke-width="2.4" stroke-linecap="round"/><path d="M32 24c-5 0-8-3-8-7 5 0 8 3 8 7z" fill="#276148"/><circle cx="32" cy="33" r="5.5" fill="#edf3ee" stroke="#276148" stroke-width="2"/><circle cx="30" cy="32.5" r="1.2" fill="#22302a"/><circle cx="34" cy="32.5" r="1.2" fill="#22302a"/><path d="M14 58q6-3 12 0t12 0 12 0" stroke="#7f96e8" stroke-width="2.2" stroke-linecap="round" fill="none" opacity=".6"/></svg>'
    },
    {
      id: 'cat',
      zh: '代码猫',
      desc: '趴在键盘边打盹的橘猫，偶尔替你踩两行代码。',
      voice: '喵——这段我看过了，继续吧。',
      unlock: { kind: 'coins', value: 80 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path d="M16 24l-2-10 9 6zM48 24l2-10-9 6z" fill="#c9714f"/><ellipse cx="32" cy="38" rx="18" ry="16" fill="#e8b48c"/><circle cx="25" cy="34" r="2.8" fill="#3a2a1c"/><circle cx="39" cy="34" r="2.8" fill="#3a2a1c"/><path d="M32 40l-3 3h6z" fill="#a4553f"/><path d="M32 43q-4 4-8 1M32 43q4 4 8 1" stroke="#3a2a1c" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M14 38h-6M14 42h-6M50 38h6M50 42h6" stroke="#3a2a1c" stroke-width="1.6" stroke-linecap="round"/></svg>'
    },
    /* v4.3（交接 C1/J）：低档位形象（20–40 叶片），前期奖励闭环的“选择感”货源 */
    {
      id: 'dumpling',
      zh: '团团',
      desc: '一颗软乎乎的糯米团子，滚到哪儿学到哪儿。',
      voice: '学完这一段，我们就去滚下一段。',
      unlock: { kind: 'coins', value: 35 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><ellipse cx="32" cy="46" rx="20" ry="4" fill="#c8d3cb" opacity=".5"/><path d="M12 40c0-12 9-20 20-20s20 8 20 20c0 3-2 5-5 5H17c-3 0-5-2-5-5z" fill="#f7f3ea" stroke="#b9ae98" stroke-width="2.2"/><path d="M24 22q2-4 6-3" stroke="#b9ae98" stroke-width="2" stroke-linecap="round" fill="none"/><circle cx="25" cy="36" r="2.4" fill="#3a2a1c"/><circle cx="39" cy="36" r="2.4" fill="#3a2a1c"/><path d="M28 42q4 3.5 8 0" stroke="#3a2a1c" stroke-width="2.2" stroke-linecap="round" fill="none"/><circle cx="20" cy="40" r="2.6" fill="#e8b4a0" opacity=".7"/><circle cx="44" cy="40" r="2.6" fill="#e8b4a0" opacity=".7"/></svg>'
    },
    {
      id: 'fox',
      zh: '终端狐',
      desc: '住在命令行提示符里的狐狸，尾巴一扫就是一行命令。',
      voice: 'cd 学习 && ls 今天该学的课。',
      unlock: { kind: 'level', value: 5 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#22302a"/><path d="M14 14l14 7-2.5 10zM50 14l-14 7 2.5 10z" fill="#c9714f"/><ellipse cx="32" cy="36" rx="15" ry="14" fill="#d98b5f"/><circle cx="26" cy="33" r="2.6" fill="#edf3ee"/><circle cx="38" cy="33" r="2.6" fill="#edf3ee"/><path d="M32 39l-3.5 4.5h7z" fill="#22302a"/><path d="M18 16l7 3.5M46 16l-7 3.5" stroke="#a4553f" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    {
      id: 'owl',
      zh: '夜读鸮',
      desc: '深夜也醒着的猫头鹰，陪你把难啃的一课啃完。',
      voice: '夜深了，这课啃完就休息。',
      unlock: { kind: 'achievement', value: 'active-10h' },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path d="M15 22l7-10 3 10zM49 22l-7-10-3 10z" fill="#6f9c85"/><circle cx="32" cy="36" r="19" fill="#3c5248"/><circle cx="25" cy="32" r="6.5" fill="#fafbf9" stroke="#22302a" stroke-width="2.5"/><circle cx="39" cy="32" r="6.5" fill="#fafbf9" stroke="#22302a" stroke-width="2.5"/><circle cx="25" cy="32" r="2.5" fill="#22302a"/><circle cx="39" cy="32" r="2.5" fill="#22302a"/><path d="M32 39l-4 6h8z" fill="#a4553f"/></svg>'
    },
    {
      id: 'bot',
      zh: '机械仔',
      desc: '半机械的小助手，散热风扇转得比你想学的念头还快。',
      voice: '系统正常，随时可以开工。',
      unlock: { kind: 'coins', value: 150 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path d="M32 8v8" stroke="#56625c" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="7" r="3" fill="#a4553f"/><rect x="13" y="16" width="38" height="36" rx="9" fill="#c8d3cb" stroke="#25312c" stroke-width="2.4"/><rect x="21" y="26" width="10" height="10" rx="2" fill="#22302a"/><rect x="33" y="26" width="10" height="10" rx="2" fill="#22302a"/><circle cx="26" cy="31" r="2" fill="#7fd3a5"/><circle cx="38" cy="31" r="2" fill="#7fd3a5"/><path d="M23 42h18" stroke="#25312c" stroke-width="2.6" stroke-linecap="round"/><path d="M8 26v14M56 26v14" stroke="#56625c" stroke-width="3" stroke-linecap="round"/></svg>'
    },
    {
      id: 'gitfairy',
      zh: 'Git 精灵',
      desc: '在分支之间跳跃的小精灵，commit message 写得比谁都工整。',
      voice: '先提交，再学新的一课。',
      unlock: { kind: 'achievement', value: 'unit-2' },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="14" r="6" fill="#edf3ee" stroke="#276148" stroke-width="2.5"/><circle cx="20" cy="48" r="6" fill="#edf3ee" stroke="#276148" stroke-width="2.5"/><circle cx="44" cy="48" r="6" fill="#edf3ee" stroke="#276148" stroke-width="2.5"/><path d="M32 20v8c0 8-12 6-12 14M32 28c0 8 12 6 12 14" stroke="#276148" stroke-width="2.5" fill="none"/><circle cx="32" cy="26" r="3" fill="#a4553f"/><path d="M14 12l4 3M50 12l-4 3" stroke="#a4553f" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    /* ---------- v4.3 Batch 6（交接 H/I）：中档位叶片形象与连续成就形象 ---------- */
    {
      id: 'bee',
      zh: '小蜜蜂',
      desc: '采一朵学一朵的小蜜蜂，嗡嗡声里全是干劲。',
      voice: '今天的进度，也采进罐子里啦。',
      unlock: { kind: 'coins', value: 60 },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><ellipse cx="20" cy="22" rx="9" ry="6" fill="#d6dcf0" opacity=".6" transform="rotate(-20 20 22)"/><ellipse cx="44" cy="22" rx="9" ry="6" fill="#d6dcf0" opacity=".6" transform="rotate(20 44 22)"/><ellipse cx="32" cy="40" rx="14" ry="15" fill="#e8b45f"/><path d="M20 34q12 5 24 0M19 42q13 5 26 0M23 49q9 4 18 0" stroke="#3a2a1c" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="32" cy="22" r="8" fill="#3a2a1c"/><circle cx="29" cy="21" r="1.8" fill="#fafbf9"/><circle cx="35" cy="21" r="1.8" fill="#fafbf9"/><path d="M28 14l-3-4M36 14l3-4" stroke="#3a2a1c" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    {
      id: 'turtle',
      zh: '缓步龟',
      desc: '背着小房子走远路的龟，相信慢慢来比较快。',
      voice: '不急，一步一步都算数。',
      unlock: { kind: 'achievement', value: 'streak-14' },
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path d="M10 42a22 16 0 0 1 44 0z" fill="#4a6b2f" stroke="#276148" stroke-width="2.4"/><path d="M24 31l8 6 8-6M20 40l8-6M44 40l-8-6M32 37v7" stroke="#c9d4b4" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="55" cy="40" r="6" fill="#6f9c85" stroke="#276148" stroke-width="2"/><circle cx="57" cy="38.5" r="1.4" fill="#22302a"/><path d="M14 42v6M26 44v5M38 44v5M50 42v6" stroke="#276148" stroke-width="3" stroke-linecap="round"/><path d="M8 54h50" stroke="#8a6a4f" stroke-width="2.6" stroke-linecap="round"/></svg>'
    }
  ],

  /* ---------- v4.3 Batch 6（交接 I）：小奥成长阶段 ----------
   * 「成长阶段」与「外观皮肤」是两个独立维度：皮肤是 companions 清单里的
   * id（用户装备什么形象），成长阶段由 Level / 累计有效时长 / 完成单元数
   * **纯函数推导**，不新增任何存储字段、不可装备、不可回退。
   * 设计承诺（Finch 式无惩罚陪伴）：不死亡、不枯萎、不掉阶段——三个输入
   * 都只增不减，阶段自然单调；阶梯语义：必须先满足上一阶的条件才看下一阶，
   * 不会出现“跳过小树直接开花”。
   * ornament 是挂在 companion 按钮角上的小徽章（stage 0 不挂，保持干净）。 */
  growthStages: [
    {
      id: 'sprout-stage', zh: '幼芽', ornament: null,
      desc: '刚醒过来的小芽，对一切都好奇。',
      reach: null
    },
    {
      id: 'seedling', zh: '幼苗',
      desc: '根扎稳了，叶子多了一片。',
      reach: '等级达到 Lv.3，或累计有效学习 2 小时',
      ornament: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.2" fill="#edf3ee" stroke="#276148" stroke-width="1.6"/><path d="M12 18.5v-6.5" stroke="#276148" stroke-width="1.8" stroke-linecap="round"/><path d="M12 12.5c-3.2 0-4.8-1.9-4.8-4.3 3 0 4.8 1.7 4.8 4.3z" fill="#6f9c85"/><path d="M12 11.5c3.2 0 4.8-1.9 4.8-4.3-3 0-4.8 1.7-4.8 4.3z" fill="#276148"/></svg>'
    },
    {
      id: 'sapling', zh: '小树',
      desc: '亭亭如盖的小树，能替你挡一阵风了。',
      reach: '等级达到 Lv.6，或累计有效学习 10 小时',
      ornament: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.2" fill="#edf3ee" stroke="#276148" stroke-width="1.6"/><path d="M12 19v-5" stroke="#8a6a4f" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="10" r="5" fill="#4a6b2f"/><circle cx="8.5" cy="12.5" r="3" fill="#6f9c85"/><circle cx="15.5" cy="12.5" r="3" fill="#6f9c85"/></svg>'
    },
    {
      id: 'bloom', zh: '开花',
      desc: '枝头开出了小花，路过的风都慢了下来。',
      reach: '等级达到 Lv.10、完成 2 个单元，或累计有效学习 30 小时',
      ornament: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.2" fill="#fdf6f3" stroke="#9c4736" stroke-width="1.6"/><circle cx="12" cy="8.2" r="2.6" fill="#d98b9c"/><circle cx="8.4" cy="10.8" r="2.6" fill="#e8b4a0"/><circle cx="15.6" cy="10.8" r="2.6" fill="#e8b4a0"/><circle cx="9.8" cy="14.8" r="2.6" fill="#d98b9c"/><circle cx="14.2" cy="14.8" r="2.6" fill="#d98b9c"/><circle cx="12" cy="11.8" r="2.2" fill="#a8791c"/></svg>'
    },
    {
      id: 'fruit', zh: '结果',
      desc: '结出了小小的果子——每一个都是一段学完的知识。',
      reach: '等级达到 Lv.15、完成 4 个单元，或累计有效学习 60 小时',
      ornament: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.2" fill="#edf3ee" stroke="#276148" stroke-width="1.6"/><circle cx="9.8" cy="14" r="3.4" fill="#a4553f"/><circle cx="15" cy="12.4" r="2.8" fill="#c9714f"/><path d="M9.8 10.6V8M15 9.6V7.6" stroke="#276148" stroke-width="1.6" stroke-linecap="round"/><path d="M9.8 8c1.8 0 2.8-1 3-2.4-1.9 0-3 1-3 2.4z" fill="#6f9c85"/></svg>'
    }
  ],

  /* 阶梯阈值：每阶“满足任意一条”即可（level / seconds / units 三个维度
   * 任取其一），但必须按顺序逐阶满足。thresholds[i] 是进入第 i 阶的条件。 */
  growthThresholds: [
    null,
    { level: 3, seconds: 2 * 60 * 60 },
    { level: 6, seconds: 10 * 60 * 60 },
    { level: 10, units: 2, seconds: 30 * 60 * 60 },
    { level: 15, units: 4, seconds: 60 * 60 * 60 }
  ],

  /* 纯函数：metrics = { level, totalSeconds, completedUnits }，全部来自既有
   * state（xp → level、totalActiveSeconds、unit-* 成就计数），调用方负责组装。
   * 返回 0–4 的阶段下标。无随机、无时间依赖、同输入必同输出。 */
  growthStageOf(metrics) {
    const m = metrics || {};
    const level = Math.floor(Number(m.level) || 0);
    const seconds = Math.floor(Number(m.totalSeconds) || 0);
    const units = Math.floor(Number(m.completedUnits) || 0);
    let stage = 0;
    for (let i = 1; i < window.ODIN_COMPANIONS.growthThresholds.length; i += 1) {
      const t = window.ODIN_COMPANIONS.growthThresholds[i];
      const reached = (t.level && level >= t.level)
        || (t.seconds && seconds >= t.seconds)
        || (t.units && units >= t.units);
      if (!reached) break;
      stage = i;
    }
    return stage;
  },

  /* UI 用的成长简报：当前阶段 + 下一阶段的达成条件（最高阶时 next 为 null）。
   * 不读皮肤 id——两个维度刻意不混（交接 I）。 */
  growthBrief(metrics) {
    const stages = window.ODIN_COMPANIONS.growthStages;
    const stage = window.ODIN_COMPANIONS.growthStageOf(metrics);
    const current = stages[stage];
    const next = stage < stages.length - 1 ? stages[stage + 1] : null;
    return {
      stage,
      id: current.id,
      zh: current.zh,
      desc: current.desc,
      ornament: current.ornament,
      maxed: next === null,
      next: next ? { zh: next.zh, reach: next.reach } : null
    };
  }
};
