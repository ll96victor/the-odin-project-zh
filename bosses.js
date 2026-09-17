/* 章节 Boss 挑战（v4.3 交接 E3）。
 *
 * Boss 的本质是**单元综合自测 / 预检**，不是小游戏：题目全部从本站 19 课
 * 已有的自测题与官方 Knowledge Check 改写为单选题（交接 E3“可从现有自测题
 * 抽取/组合，优先复用，不要凭空造大量低质量题”），每题标注来源课程，
 * 得分后逐题给解析。不提供 Project 成品答案、不联网、不引 AI。
 *
 * 两种进入方式（同一套题，记录口径不同）：
 *   学习前预检（precheck）——检测已有背景知识；预检高分有专属成就
 *   「未战先知」，但高分只代表“已有相关背景 / 当前题目掌握良好”，
 *   界面固定声明不得解读为“无需学习整章”。
 *   学完复测——单元总结；firstPct 与 lastPct 的差值就是“首战 vs 学后”
 *   的真实进步（Stretch 的对比数据在这里就位）。
 *
 * 评分四档（交接 E3）：尚未破甲 <50 / 已破甲 50–69 / 优势明显 70–84 /
 * 压倒性优势 ≥85。“通过”= 已破甲及以上（≥50）；“高评价”= 优势明显及以上（≥70）。
 *
 * 防刷（交接 D1/O）：passCount / highCount 按“同一单元同一自然日最多 +1”
 * 幂等累计（lastPassDay / lastHighDay 日闩锁），attempts 与 bestPct 如实记录
 * 但不参与循环成就计数；撤销勾选等回退操作不影响 Boss 纪录（只增不改）。
 *
 * 设计：题库是纯数据，评分与记录是纯函数；状态由 progress.js 持久化
 * （state.bosses），UI 在 app.js。加载顺序：先于 progress.js。 */
(() => {
  'use strict';

  /* 评分档位：从高往低找第一个满足的档 */
  const RATING_TIERS = [
    { id: 'dominant', zh: '压倒性优势', min: 85, desc: '这个单元的题目几乎全部拿下' },
    { id: 'advantage', zh: '优势明显', min: 70, desc: '大部分题目掌握良好（高评价）' },
    { id: 'broken', zh: '已破甲', min: 50, desc: '过半题目答对，算通过挑战' },
    { id: 'none', zh: '尚未破甲', min: 0, desc: '过半题目还没掌握，正课学完再来' }
  ];
  const PASS_PCT = 50;    /* 通过 = 已破甲及以上 */
  const HIGH_PCT = 70;    /* 高评价 = 优势明显及以上 */

  /* 四个已开放单元的 Boss 题库。每题都改写自该课已有的自测题（quiz）或
   * 官方 Knowledge Check（kc），标注来源课程；干扰项按常见误解设计，
   * 不编造课程没讲过的知识点。未开放的 20–46 课没有 Boss（题目必须来自
   * 当前站内已讲知识和 TOP 当前开放范围）。 */
  const BOSSES = [
    {
      unitId: 'introduction',
      zh: '出发前试炼',
      desc: 'Introduction 单元综合预检：课程怎么用、学到什么、卡住怎么办、怎样求助。',
      questions: [
        {
          q: '关于 Assignment 指定的外部阅读资料，以下哪种做法符合本课程的要求？',
          options: ['它们是可选项，可以全部跳过', '它们是正课的一部分，不能跳过', '只有视频可以跳过，文章不能', '等到做项目时再补读就行'],
          answer: 1,
          explain: 'Assignment 指定的外部资料也是正课的一部分；只有 Additional Resources 与官方明确标为 Optional 的内容才可按需选读。',
          lessonId: 'how-this-course-will-work'
        },
        {
          q: 'The Odin Project 要把你培养成哪种网页开发者？',
          options: ['只写界面的前端开发者', '只管服务器的后端开发者', '前端和后端都能上手的全栈开发者', '只做部署的运维工程师'],
          answer: 2,
          explain: 'TOP 的培养目标是全栈开发者（full-stack），覆盖网页开发的各个方面。',
          lessonId: 'introduction-to-web-development'
        },
        {
          q: '卡在编程问题上时，课程推荐的三个策略不包括下面哪一项？',
          options: ['去研究：搜索别人是否遇到过同样问题', '休息一下，让发散模式工作', '带着你的研究去 Discord 求助', '通宵硬扛，不解决不睡觉'],
          answer: 3,
          explain: '课程推荐：研究与尝试、休息、带着上下文求助。“硬扛不睡”恰恰是课程反对的做法——突破常发生在发散模式。',
          lessonId: 'motivation-and-mindset'
        },
        {
          q: '按本课的要求，一个容易获得帮助的提问应该包含五类信息。下面哪一项不在这五类里？',
          options: ['你认为问题是什么', '你希望发生什么、实际发生了什么', '你的学习计划与进度表', '你怎么走到这一步、已经尝试过什么'],
          answer: 2,
          explain: '五类信息是：你认为的问题、期望结果、实际结果、如何走到这一步、已经尝试过什么。学习计划不是提问的必要上下文。',
          lessonId: 'asking-for-help'
        },
        {
          q: '在社区里帮别人解决编程问题时，课程推荐的做法是？',
          options: ['直接把写好的成品代码交给对方', '引导对方自己找到答案', '只回一句“自己去搜”', '替对方重写整个项目'],
          answer: 1,
          explain: '帮助别人的准则是引导对方自己找到答案，而不是直接给成品——这样对方才真的学到东西。',
          lessonId: 'join-the-odin-community'
        }
      ]
    },
    {
      unitId: 'prerequisites',
      zh: '环境守卫',
      desc: 'Prerequisites 单元综合预检：网页怎样工作、环境准备、编辑器、命令行与 Git 安装。',
      questions: [
        {
          q: 'DNS 在上网过程中帮忙做什么？',
          options: ['给网页内容加密', '把人容易记住的域名对应到网络地址', '把网页拆成数据包', '在本地缓存整个网站'],
          answer: 1,
          explain: 'DNS 把人容易记住的域名对应到网络地址；拆包传输是数据包的事，加密是 HTTPS 的事。',
          lessonId: 'how-does-the-web-work'
        },
        {
          q: '本套课程官方主要支持哪个浏览器？',
          options: ['Firefox', 'Google Chrome', 'Safari', 'Microsoft Edge'],
          answer: 1,
          explain: '官方安装指南以 Google Chrome 为主要支持的浏览器。',
          lessonId: 'installations'
        },
        {
          q: '为什么不用 Word 这类文字处理软件写 HTML？',
          options: ['Word 运行太慢', 'Word 会保存富文本排版信息，而代码需要纯文本', 'Word 无法保存到本地', 'Word 不支持英文以外的语言'],
          answer: 1,
          explain: '代码需要纯文本；Word 会掺入富文本排版信息，产生浏览器不认识的杂质。',
          lessonId: 'text-editors'
        },
        {
          q: 'pwd 和 ls 两个命令的区别是什么？',
          options: ['pwd 显示所在目录，ls 列出目录里的内容', 'pwd 列出文件，ls 显示所在目录', '两个命令完全等价', 'pwd 只能用在主目录'],
          answer: 0,
          explain: 'pwd 显示当前所在目录的路径，ls 列出目录里的内容。',
          lessonId: 'command-line-basics'
        },
        {
          q: '配置 GitHub 的 SSH 时，应该把哪个密钥的内容粘贴到 GitHub 设置页？',
          options: ['私钥', '公钥', '登录密码', '浏览器 Cookie'],
          answer: 1,
          explain: '只提供公钥；私钥永远留在自己电脑上，不能分享给任何网站。',
          lessonId: 'setting-up-git'
        }
      ]
    },
    {
      unitId: 'git-basics',
      zh: '版本回廊',
      desc: 'Git Basics 单元综合预检：Git 是什么、add / commit / push / status / log 各管什么。',
      questions: [
        {
          q: '编辑器里“保存文件”和 Git 的“提交（commit）”有什么区别？',
          options: ['两者完全一样', '保存只更新当前文件，提交把这一刻的记录写进可回查的版本历史', '提交会删除旧文件', '保存必须先联网'],
          answer: 1,
          explain: '保存更新的是当前文件内容；commit 记录的是一条可回查的版本历史。',
          lessonId: 'introduction-to-git'
        },
        {
          q: '完全没有联网时，Git 还能记录本地版本吗？',
          options: ['不能，Git 必须联网', '能，本地版本记录不依赖 GitHub 在线', '只能记录一次', '只有 push 不需要联网'],
          answer: 1,
          explain: 'Git 的版本记录发生在本地仓库；只有 push / pull 这类与远端同步的动作才需要网络。',
          lessonId: 'introduction-to-git'
        },
        {
          q: '执行 git commit 之后，改动会自动上传到 GitHub 吗？',
          options: ['会，commit 就是上传', '不会，还需要 git push', '会，但要等 24 小时', '只有第一次 commit 会上传'],
          answer: 1,
          explain: 'commit 只写进本地历史；把本地提交送到远端仓库需要 git push。',
          lessonId: 'git-basics'
        },
        {
          q: 'git add 的作用是什么？',
          options: ['把改动上传到 GitHub', '选择改动进入暂存区，准备下一次提交', '新建一个分支', '删除选中的文件'],
          answer: 1,
          explain: 'git add 把选中的改动放进暂存区（staging area），commit 提交的就是暂存区里的内容。',
          lessonId: 'git-basics'
        },
        {
          q: '想查看提交历史和想查看当前工作区状态，分别用哪组命令？',
          options: ['git log 看历史，git status 看状态', 'git status 看历史，git log 看状态', '都用 git add', '都用 git push'],
          answer: 0,
          explain: 'git log 查看提交历史，git status 查看工作区与暂存区的当前状态。',
          lessonId: 'git-basics'
        }
      ]
    },
    {
      unitId: 'html-foundations',
      zh: '结构石阵',
      desc: 'HTML Foundations 单元综合预检（本站已开放 7 课范围）：HTML/CSS 分工、元素与标签、骨架、文字、列表、链接图片、提交说明。',
      questions: [
        {
          q: '往页面里加入一个段落，应该主要用哪种技术？',
          options: ['CSS', 'HTML', 'JavaScript', 'Git'],
          answer: 1,
          explain: '结构与内容（比如段落）由 HTML 负责；CSS 管样式，JavaScript 管行为。',
          lessonId: 'introduction-to-html-and-css'
        },
        {
          q: '关于 <img> 元素，下面哪种说法正确？',
          options: ['必须写 </img> 闭合', '它是空元素，不需要结束标签', '只能放在 head 里', '不需要任何属性'],
          answer: 1,
          explain: '<img> 是空元素（没有中间内容），不需要结束标签；它靠 src 与 alt 等属性工作。',
          lessonId: 'elements-and-tags'
        },
        {
          q: '浏览器标签页上显示的页面名称写在 HTML 骨架的哪里？',
          options: ['body 里的 h1', 'head 里的 title', 'footer 里', '注释里'],
          answer: 1,
          explain: '标签页名称来自 head 内的 <title>；body 里的内容才是页面上给读者看的正文。',
          lessonId: 'html-boilerplate'
        },
        {
          q: '<strong> 元素的作用是什么？',
          options: ['只是把字体加粗，没有别的含义', '表达这段内容很重要，同时默认以粗体呈现', '把文字变成标题', '给文字加链接'],
          answer: 1,
          explain: 'strong 不只是外观：它表达内容的重要性（语义），浏览器默认用粗体呈现。',
          lessonId: 'working-with-text'
        },
        {
          q: '一份没有先后次序的购物清单，应该用哪种列表？',
          options: ['ol 有序列表', 'ul 无序列表', 'dl 描述列表', 'table 表格'],
          answer: 1,
          explain: '没有次序的清单用 ul；有排名或步骤先后才用 ol。两类列表的每一项都是 li。',
          lessonId: 'lists'
        },
        {
          q: '相对路径里的 ../ 表示什么？',
          options: ['进入子目录', '返回当前文件所在目录的上一级', '指向网站根域名', '指向同一目录'],
          answer: 1,
          explain: '../ 返回上一级目录；这也是移动文件后相对链接容易失效的原因——路径要跟着目录结构改。',
          lessonId: 'links-and-images'
        },
        {
          q: '写 Git 提交说明时，标题和正文之间怎样分隔？',
          options: ['用逗号连接', '空一行', '用井号标记', '不需要分隔'],
          answer: 1,
          explain: '提交说明的标题与正文之间空一行；标题要短而具体（TOP 当前建议 72 字符以内），“updated”这类词看不出改了什么。',
          lessonId: 'commit-messages'
        }
      ]
    }
  ];

  function bossForUnit(unitId) {
    return BOSSES.find(boss => boss.unitId === unitId) || null;
  }

  function ratingOf(pct) {
    const value = Math.max(0, Math.min(100, Math.floor(Number(pct) || 0)));
    return RATING_TIERS.find(tier => value >= tier.min) || RATING_TIERS[RATING_TIERS.length - 1];
  }

  /* 评分：answers 是与题目等长的选项下标数组（未答为 null/undefined，按答错计）。
   * 逐题返回判定与解析，UI 直接渲染，不再自己算分。 */
  function scoreBoss(boss, answers) {
    if (!boss || !Array.isArray(boss.questions) || !boss.questions.length) return null;
    const list = Array.isArray(answers) ? answers : [];
    let correct = 0;
    const details = boss.questions.map((question, index) => {
      const given = Number.isInteger(list[index]) ? list[index] : null;
      const isCorrect = given === question.answer;
      if (isCorrect) correct += 1;
      return {
        index,
        lessonId: question.lessonId,
        given,
        answer: question.answer,
        correct: isCorrect
      };
    });
    const total = boss.questions.length;
    const pct = Math.round((correct / total) * 100);
    const rating = ratingOf(pct);
    return {
      correct, total, pct,
      rating: rating.id,
      ratingZh: rating.zh,
      ratingDesc: rating.desc,
      passed: pct >= PASS_PCT,
      high: pct >= HIGH_PCT,
      details
    };
  }

  function emptyBossRecord() {
    return {
      attempts: 0,
      passCount: 0,
      highCount: 0,
      lastPassDay: null,
      lastHighDay: null,
      bestPct: null,
      firstPct: null,
      lastPct: null,
      firstWasPrecheck: false,
      precheckBestPct: null
    };
  }

  /* 记录一次挑战。幂等口径（交接 D1/O）：
   *   attempts / bestPct / lastPct 如实累计（不参与循环成就计数）；
   *   passCount / highCount 同一单元同一自然日最多各 +1（lastPassDay /
   *   lastHighDay 日闩锁）——反复重打同一天刷不出循环成就进度；
   *   firstPct / firstWasPrecheck 只在第一次挑战写入（首战 vs 学后对比的基线）；
   *   precheckBestPct 只跟踪“学习前预检”模式的最好成绩（未战先知成就的推导源）。 */
  function recordAttempt(state, unitId, result, todayKey, isPrecheck) {
    if (!state.bosses || typeof state.bosses !== 'object') state.bosses = {};
    const entry = Object.assign(emptyBossRecord(), state.bosses[unitId] || {});
    entry.attempts += 1;
    if (entry.firstPct === null) {
      entry.firstPct = result.pct;
      entry.firstWasPrecheck = isPrecheck === true;
    }
    entry.lastPct = result.pct;
    if (entry.bestPct === null || result.pct > entry.bestPct) entry.bestPct = result.pct;
    const counts = { passed: false, high: false };
    if (result.passed && entry.lastPassDay !== todayKey) {
      entry.passCount += 1;
      entry.lastPassDay = todayKey;
      counts.passed = true;
    }
    if (result.high && entry.lastHighDay !== todayKey) {
      entry.highCount += 1;
      entry.lastHighDay = todayKey;
      counts.high = true;
    }
    if (isPrecheck === true && (entry.precheckBestPct === null || result.pct > entry.precheckBestPct)) {
      entry.precheckBestPct = result.pct;
    }
    state.bosses[unitId] = entry;
    return { entry, counts };
  }

  /* UI 一次拿全：题库元信息（不含答案泄漏——questions 带 answer 字段，
   * UI 渲染答题视图时不得展示，提交后才用 details 对照）与历史记录。 */
  function bossBrief(state, unitId) {
    const boss = bossForUnit(unitId);
    if (!boss) return null;
    const record = (state.bosses || {})[unitId] || null;
    return {
      unitId,
      zh: boss.zh,
      desc: boss.desc,
      questionCount: boss.questions.length,
      attempted: Boolean(record && record.attempts > 0),
      record: record ? Object.assign({}, record) : null,
      ratingTiers: RATING_TIERS.map(tier => ({ id: tier.id, zh: tier.zh, min: tier.min }))
    };
  }

  window.ODIN_BOSSES = {
    version: 1,
    RATING_TIERS, PASS_PCT, HIGH_PCT, BOSSES,
    bossForUnit, ratingOf, scoreBoss, emptyBossRecord, recordAttempt, bossBrief
  };
})();
