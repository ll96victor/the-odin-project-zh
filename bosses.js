/* 章节 Boss 挑战（v4.3 交接 E3）。
 *
 * Boss 的本质是**单元综合自测 / 预检**，不是小游戏：题目全部改写自本站
 * 25 课已讲解并考核过的知识点（交接 E3“可从现有自测题抽取/组合，优先复用，
 * 不要凭空造大量低质量题”），每题标注来源课程，
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

  /* 六个已开放单元的 Boss 题库。每题都改写自该课已讲解并考核过的知识点
   * （自测题与正文），标注来源课程；干扰项按常见误解设计，
   * 不编造课程没讲过的知识点。Boss 只覆盖有足量知识点的单元（Foundations 七个知识单元各有 Boss；结语单元只有 1 课、知识点不足以出综合预检题，不配 Boss（题目必须来自
   * 当前站内已讲知识和 TOP 当前开放范围）。
   *
   * 粒度（2026-09-26 World 2 第三批定稿）：**Boss 一律对应「官方章节」**——
   * Foundations 侧的 unitId 就是 catalog.js 的 group id（等于官方 section 名，如 flexbox），
   * **原样保留不改**（已写进用户真实档案，改 id 会让已解锁记录失联）。
   * 路径课侧的 unitId 自 2026-09-26 批次 4 起为 **`<courseId>/<sectionId>`**
   * （如 intermediate-html-and-css/grid；经下方 pathBossUnitId 构造）——
   * **命名约定变更**，取代旧的「直接复用 curriculum.js section 既有 id」约定。
   * 变更理由：裸 section id 跨命名空间撞名已实测存在（World 3 javascript 的
   * `introduction` 与 Foundations 分组 id 同名、又与 World 5 react 的 section id
   * 同名），而 state.bosses 以 unitId 单键存纪录——撞名会让两个单元的挑战记录
   * （分数/评级/passCount/历史）合并写进同一条（档案串档）。前缀把命名空间隔开，
   * 存量 4 个 World 2 键在读档时由 progress.js 的 LEGACY_PATH_BOSS_UNIT_IDS
   * 一次性重映射；tests/map-boss.test.cjs 以「全局唯一 + 前缀必须是真实 course id」
   * 两条硬断言兜底。**全组开放才配**：章节只开了一部分课时不配（例如「中级 CSS
   * 概念」开前 5 课时不配，开满 10 课的批次才配）。
   * Boss 引擎（scoreBoss / recordAttempt / bossBrief / submitBoss / openBossDialog）对 unitId
   * 是完全泛化的，只有入口曾绑死在 map.js 的 catalog 组上——路径课章节的入口在
   * app.js `worldDetailChildren()` 的章节块头部，同样按数据现算「本章是否全开放」。
   * 路径课章节**不新增成就**：unit-0..unit-7 是显式枚举且语义绑定 lessons.js 的分组下标，
   * 要不要给路径课章节发成就（及头像框 unlock 链）是独立的产品决定。 */
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
    },
    {
      unitId: 'css-foundations',
      zh: '层叠高塔',
      desc: 'CSS Foundations 单元综合预检（本站已开放 5 课）：选择器、层叠、DevTools 检查、盒模型、块级与行内。',
      questions: [
        {
          q: '三种把 CSS 加进 HTML 的方式里，官方说最常用、也最好维护的是哪一种？',
          options: ['内联 CSS（写在 style 属性上）', '内部 CSS（写在 style 标签里）', '外部 CSS（单独的 .css 文件用 link 链入）', '三种完全等价，没有区别'],
          answer: 2,
          explain: '外部 CSS 把规则放在单独文件里，HTML 更干净、多页共用一套样式时改一处全站生效；内联方式优先级最高且难复用，官方不推荐常用。',
          lessonId: 'intro-to-css'
        },
        {
          q: '.subsection.header 与 .subsection .header 这两个选择器只差一个空格，含义分别是？',
          options: ['完全相同，空格可有可无', '前者要求同一元素同时带两个类，后者要求 header 在某个 subsection 内部', '前者是后代关系，后者是同时满足', '前者选中 subsection，后者选中 header'],
          answer: 1,
          explain: '紧挨着写是链式选择器（同时满足）；中间有空格是后代组合器（在里面）。这是 intro-to-css 里最强调的外观相近、含义不同的写法。',
          lessonId: 'intro-to-css'
        },
        {
          q: '两条规则同时命中同一个元素且属性冲突时，层叠判定最先比较什么？',
          options: ['选择器里类名的数量', '规则写在样式表的哪个位置', '规则是直接命中该元素还是从祖先继承来的', '属性名的字母顺序'],
          answer: 2,
          explain: '层叠的判定顺序：先看直接命中还是继承（直接命中永远赢过继承），再比选择器类型（ID 类 类型）、同类数量，最后才比规则顺序。',
          lessonId: 'the-cascade'
        },
        {
          q: '在 DevTools 的 Styles 面板里看到某条声明被划掉了，这说明什么？',
          options: ['那条声明有语法错误', '那条声明存在但被更高优先级的规则覆盖了，没有生效', '浏览器不支持那个属性', '那条声明来自浏览器默认样式'],
          answer: 1,
          explain: '被划掉的样式是「被覆盖的样式」：规则存在、也命中了这个元素，只是输给了更高优先级的规则。这是检查 CSS 为什么不生效时最重要的线索。',
          lessonId: 'inspecting-html-and-css'
        },
        {
          q: '盒模型四层由内到外的顺序是？',
          options: ['margin → border → padding → content', 'content → padding → border → margin', 'content → margin → padding → border', 'padding → content → border → margin'],
          answer: 1,
          explain: '内容在最里层，往外依次是内边距、边框、外边距。padding 在边框与内容之间，border 在 margin 与 padding 之间，margin 在盒子的边框与相邻盒子的边框之间。',
          lessonId: 'the-box-model'
        },
        {
          q: 'box-sizing: border-box 下给元素写 width: 300px、padding: 20px、border: 5px，元素到边框外缘的总宽是？',
          options: ['350px', '370px', '300px', '255px'],
          answer: 2,
          explain: 'border-box 把 width 定义为「内容 + padding + border」的总宽，所以总宽就是 300px（内容被自动压到 250px）。这正是它比默认 content-box 好算的地方。',
          lessonId: 'the-box-model'
        },
        {
          q: '想给一行文字里的某几个字单独上样式，应该包一层什么元素？',
          options: ['div', 'span', 'p', 'section'],
          answer: 1,
          explain: 'span 是通用的行内容器，坐在文字流里不换行，用来给一小截内容挂 class 或 id；div 是块级容器，用来分组大块内容，会另起一行。',
          lessonId: 'block-and-inline'
        }
      ]
    },
    {
      unitId: 'flexbox',
      zh: '弹性矩阵',
      desc: 'Flexbox 单元综合预检（本站已开放 5 课）：容器与项目、flex 简写三分量、主轴与交叉轴、对齐与间距。',
      questions: [
        {
          q: 'flex 容器与 flex 项目分别怎么认定？',
          options: ['带 display: flex 的元素是项目，它的子元素是容器', '带 display: flex 的元素是容器，直接住在里面的子元素是项目', '容器和项目由 class 名决定', '任何一个元素既是容器又是项目'],
          answer: 1,
          explain: '带 display: flex 的元素就是容器；直接住在容器里的子元素是项目。flexbox 的属性分两组——一组写给容器、一组写给项目，写错对象不生效。',
          lessonId: 'introduction-to-flexbox'
        },
        {
          q: 'flex: 1 展开是哪三个值？等分空间的关键是哪一个？',
          options: ['1 1 auto，关键是 grow', '1 1 0，关键是 basis 为 0', '1 0 auto，关键是 shrink', '0 1 0，关键是 grow 为 0'],
          answer: 1,
          explain: 'flex: 1 = flex-grow: 1 / flex-shrink: 1 / flex-basis: 0。等分的真正原因是 basis 为 0——大家从零开始、只按增长因子分空间。',
          lessonId: 'growing-and-shrinking'
        },
        {
          q: '想让某个项目在容器变窄时绝不缩小，应该写什么？',
          options: ['flex: 1', 'flex-shrink: 0', 'width: 100%', 'flex-basis: auto'],
          answer: 1,
          explain: 'flex-shrink 默认是 1（均匀收缩），设成 0 就退出收缩，缩小的压力由其余项目承担。定宽侧栏 + 弹性主区是最常见的搭配。',
          lessonId: 'growing-and-shrinking'
        },
        {
          q: 'flex-direction: column 之后，主轴与 justify-content 分别变成什么方向？',
          options: ['主轴水平不变，justify 仍管水平', '主轴垂直、从上到下，justify 变成管垂直分布', '主轴消失，justify 不再起作用', '主轴垂直但方向随机，要看浏览器'],
          answer: 1,
          explain: 'column 把主轴转成垂直（上到下），交叉轴转成水平。justify-content 永远沿主轴工作，于是从管水平分布变成管垂直分布——这是新手最大的卡点。',
          lessonId: 'axes'
        },
        {
          q: 'column 方向下写 flex: 1，带 height 的空 div 塌掉了，最直接的原因是？',
          options: ['height 在 column 下不生效', 'flex: 1 的 basis 是 0，而空 div 默认高度也是零', '必须同时写 width', '浏览器 bug'],
          answer: 1,
          explain: 'flex: 1 展开的 basis 是 0，所有伸缩从零开始计算；空 div 高度本来就是零，height 被无视。修法任选：flex: 1 1 auto / 给容器定高 / 直接写 flex-grow: 1。',
          lessonId: 'axes'
        },
        {
          q: '想保持项目自身宽度、让它们首尾贴边中间均分空隙，容器上写什么？',
          options: ['给每个项目加 flex: 1', 'justify-content: space-between', 'align-items: center', 'gap: 0'],
          answer: 1,
          explain: 'flex: 1 让项目自己长大填满空间；space-between 保持项目尺寸、把空隙分配到它们之间。两个思路互斥，不要混用。',
          lessonId: 'alignment'
        },
        {
          q: '官方建议的区块开发节奏是哪种？',
          options: ['先全部写完 CSS 再写 HTML', '一次只做一个区块，先 HTML 后 CSS', 'HTML 与 CSS 同时逐行推进', '从页脚开始倒着做'],
          answer: 1,
          explain: '先把一个区块的内容全部放上页面（HTML），再给它写样式（CSS）；两头来回跳更慢也更容易烦。这是官方在项目课里给的真实开发节奏建议。',
          lessonId: 'landing-page'
        }
      ]
    },
    {
      unitId: 'javascript-basics',
      zh: '全栈试炼',
      desc: 'JavaScript Basics 单元综合预检（本站已开放 15 课）：变量与比较、函数与报错、循环与数组、DOM 与事件、对象与引用。',
      questions: [
        {
          q: '一个先用后改的计数器变量，声明该用 let 还是 const？为什么？',
          options: ['const，因为它是数字类型', 'let——const 声明的绑定不允许重新赋值，改值会直接报错', '都行，效果一样', 'var，老写法更保险'],
          answer: 1,
          explain: 'const 的绑定不可重新赋值，i = i + 1 这种改值会抛 TypeError。经验法则：默认 const，确实要改值才换 let——变量行为越可预测，代码越好读。',
          lessonId: 'variables-and-operators'
        },
        {
          q: '== 与 === 的区别是什么？官方建议用哪个？',
          options: ['=== 会报错，== 不会', '== 会先做类型转换再比较（"5" == 5 为真），=== 类型不同直接 false；建议一律用 ===', '两者完全等价', '== 更严格，建议用它'],
          answer: 1,
          explain: '== 的隐式类型转换会制造 "5" == 5 这种真假难辨的结果；=== 不转换类型，行为可预测。官方立场：养成用 === 的习惯，忽略 == 的存在。',
          lessonId: 'data-types-and-conditionals'
        },
        {
          q: '函数没有写 return 语句时调用它，返回什么？',
          options: ['null', 'undefined', '0', '会报错'],
          answer: 1,
          explain: '没有 return（或只写 return;）的函数返回 undefined。这是排查「函数结果怎么是 undefined」的第一站——忘了 return，而不是函数没执行。',
          lessonId: 'function-basics'
        },
        {
          q: '报错信息 "Uncaught TypeError: x is not a function" 首先该查什么？',
          options: ['浏览器坏了', 'x 是什么类型的值、它上面到底有没有这个方法——从报错信息倒着读是定位起点', '把代码全部重写', '网络连接'],
          answer: 1,
          explain: '读报错的顺序：错误类型（TypeError）→ 出错的值（x）→ 原因（它不是函数）。九成是拼写错方法名、或 x 的类型和自己以为的不一样。报错信息是线索不是噪音。',
          lessonId: 'understanding-errors'
        },
        {
          q: '对数组做「筛选出偶数」，哪条路最直接？',
          options: ['forEach + return', 'filter(num => num % 2 === 0)', 'map + if', 'push 到新数组只能在 for 循环里做'],
          answer: 1,
          explain: 'filter 天生干这件事：回调返回真值的元素留下，返回新数组不改动原数组。forEach 的 return 只是跳过当轮（相当于 continue），拦不住任何元素。',
          lessonId: 'loops-and-arrays'
        },
        {
          q: '想让按钮被点击时执行一段代码，起点是哪两步？',
          options: ['直接在 HTML 里写 onclick 就够了', 'querySelector 选中按钮，再 addEventListener("click", 回调) 挂上监听', '给每个可能的父元素都挂监听', '把代码写在按钮标签内部'],
          answer: 1,
          explain: '选元素（querySelector）+ 挂监听（addEventListener("click", ...)）是 DOM 交互的标准起点。回调里用 e.target 拿到真正被点的元素；一百个同类子元素不必挂一百次监听，挂父容器一次即可。',
          lessonId: 'dom-manipulation-and-events'
        },
        {
          q: '把一个数组变量赋给另一个变量后再 push 新元素，两个变量都会变长——为什么？',
          options: ['数组赋值时会自动同步', '赋值拷贝的是引用：两个变量指向同一个数组，改的就是同一份', 'JavaScript 的 bug', '因为没用 const'],
          answer: 1,
          explain: '对象（含数组）赋值拷贝的是引用不是内容——这在第 41 课（DOM 引用）和第 44 课（对象基础）各讲过一次。想要互不影响，得显式拷贝内容（如展开运算符）。',
          lessonId: 'object-basics'
        }
      ]
    },
    /* World 2 第三批（2026-09-26）：路径课的第一个章节 Boss。
     * unitId 初版取 curriculum.js 里该 section 的既有 id（intermediate-css-concepts），
     * 批次 4（2026-09-26）起按新命名约定加 course 前缀（见文件头粒度注释）；
     * 与 Foundations 侧「unitId = 官方章节」同一粒度，「中级 CSS 概念」10/10 全开后才配。
     * 7 题来源分散在本章 10 课中的 7 课（default-styles / css-units / more-text-styles /
     * advanced-selectors / positioning / custom-properties / frameworks-and-preprocessors），
     * 全部改写自本站已讲解并已出过自测题的知识点，不给成品答案、不引入重 RPG 数值。 */
    {
      unitId: 'intermediate-html-and-css/intermediate-css-concepts',
      zh: '精修工坊',
      desc: '「中级 CSS 概念」章节综合预检（本站已开放 10 课）：默认样式与 reset、单位与字体栈、选择器精度、定位参照物、变量作用域与主题、框架与预处理器的取舍。',
      questions: [
        {
          q: '网页在完全没有自定义 CSS 时，h1 仍然更大更粗、链接仍然蓝色带下划线——这些样式从哪来？想改掉有哪两条路？',
          options: ['来自浏览器的缓存，清缓存就没了', '来自浏览器自带的 user-agent 样式表；可以写自己的规则覆盖（优先级更高），也可以用 CSS reset 统一抹平', '来自 HTML 标准的强制规定，无法更改', '来自操作系统主题，只能换系统主题'],
          answer: 1,
          explain: '这些是浏览器自带的 user-agent 样式表在起作用，而且每个浏览器的默认样式表内容略有差异（这正是 reset 存在的动因之一）。两条路：① 直接写自己的规则——你的样式表优先级高于 user-agent 的；② 用 CSS reset 一次性抹平默认、拿到统一干净的起点。注意 reset 天然是「有观点的」，不是必需品。',
          lessonId: 'node-path-intermediate-html-and-css-default-styles'
        },
        {
          q: '一个元素的 font-size 是 16px，把它的 width 设为 4em 等于多少像素？em 与 rem 的关键差别是什么？',
          options: ['4px；em 是绝对单位、rem 是相对单位', '64px；em 挂在（当前/父）元素的字号上，rem 挂在根元素的字号上', '16px；两者完全等价，只是写法不同', '64px；em 只能用于字号，rem 可以用于任何属性'],
          answer: 1,
          explain: '4 × 16px = 64px。关键差别在参照物：em 相对当前元素（继承场景下是父元素）的字号，所以会随嵌套层层相乘；rem 相对根元素（html）的字号，参照物固定、不叠加。两者都是相对单位，也都能用于任何长度属性。',
          lessonId: 'node-path-intermediate-html-and-css-css-units'
        },
        {
          q: '项目里的 font-family 为什么常常写成一长串字体名？',
          options: ['为了让文字同时显示多种字体的混合效果', '那是字体栈：按顺序逐个尝试，前面的字体不可用时回退到后面的，最后通常兜到通用族（sans-serif 等）', '写多了浏览器会挑最好看的那个', '是历史遗留写法，现在只应写一个字体名'],
          answer: 1,
          explain: '这是**字体栈（font stack）**：浏览器按书写顺序逐个找可用字体，找不到就回退到下一个，末尾的通用族（如 sans-serif）保证任何环境都有兜底。打头写 system-ui 的思路是优先用操作系统自带字体——不用下载、渲染快、观感与平台一致。引入 Web 字体时同理：Web 字体在前、本地字体与通用族在后做 fallback。',
          lessonId: 'node-path-intermediate-html-and-css-more-text-styles'
        },
        {
          q: '伪类与伪元素在写法和含义上怎么区分？两者的特异性各是什么量级？',
          options: ['伪类双冒号、伪元素单冒号；特异性相同', '伪类单冒号（选已存在元素的状态或结构位置），伪元素双冒号（标记里不存在的部分）；特异性上伪类同一个类 (0,0,1,0)、伪元素同一个元素 (0,0,0,1)', '两者都可用单冒号，没有区别', '伪类只能用于链接，伪元素只能用于 ::before / ::after'],
          answer: 1,
          explain: '现行标准是：伪类**单冒号**，选的是 HTML 里已存在的元素的另一种状态或结构位置（:hover、:focus、:nth-child() 等），特异性等同于一个类 (0,0,1,0)；伪元素**双冒号**，选的是标记里并不存在的部分（::before、::after、::first-line 等），特异性等同于一个元素 (0,0,0,1)。旧文章常用单冒号写伪元素，官方 Assignment 专门提醒过要用双冒号。',
          lessonId: 'node-path-intermediate-html-and-css-advanced-selectors'
        },
        {
          q: '一个 position: absolute 的元素跑到了意料之外的位置，最常见的原因是什么？另外 fixed 与 sticky 的分界线在哪？',
          options: ['绝对定位有 bug；fixed 与 sticky 完全等价', '没有任何祖先被设为已定位，于是一路往外找、最终相对整个页面定位——给参照容器加 position: relative 即可；fixed 从一开始就脱流并相对视口钉住，sticky 不脱流、滚过它之后才表现得像 fixed', '因为忘了写 top 和 left；sticky 会脱离文档流而 fixed 不会', '绝对定位必须配 flexbox 才生效；两者都不脱离文档流'],
          answer: 1,
          explain: '绝对定位是相对**最近的已定位祖先**定位的；如果没有任何祖先设过 position，它会一路往外找、最终相对整个页面，看起来就像飞出去了——常见修法就是给想要的那个参照容器加 position: relative（它本身不偏移，只当锚点）。fixed 与 sticky 的分界在于：fixed 一开始就脱离文档流、相对视口钉住不动；sticky **不脱离文档流**，滚动到它之前是普通元素、滚过之后才吸住（且必须给至少一个方向的阈值，否则不生效）。',
          lessonId: 'node-path-intermediate-html-and-css-positioning'
        },
        {
          q: '自定义属性（CSS 变量）的作用域由什么决定？为什么想全文件可用就声明在 :root 上？做主题又是靠什么？',
          options: ['由文件名决定；:root 只是写法习惯；主题靠改 HTML', '作用域由声明它的那个选择器决定，范围包含该选择器自身与它的所有后代；其他选择器都是 :root 的后代，所以声明在 :root 上就全文件可用；主题是在不同上下文（如根元素的 class 或 data-theme）里给同一批变量名重新赋一套值', '作用域是全局的，任何地方声明都一样；主题必须用 JavaScript 改样式', '作用域由 media query 决定；:root 优先级低于 html，所以要用 html'],
          answer: 1,
          explain: '作用域**由选择器决定**，包含声明它的那个选择器及其后代（与 JavaScript 的作用域直觉相似）——所以 .cool-div 上声明的变量，它外面的 .boring-paragraph 取不到。声明在 :root 上则全文件可用，因为其他选择器都算 :root 的后代（:root 基本等同 html，只是优先级更高）。主题的本质就是「在不同上下文里重定义同名变量」：给根元素切 class / data-theme，或配合 prefers-color-scheme 媒体查询（注意后者只有 dark 与 light 两个合法值，且不允许用户自己切换）。',
          lessonId: 'node-path-intermediate-html-and-css-custom-properties'
        },
        {
          q: '关于 CSS 框架与预处理器，官方在你当前学习阶段给的明确建议是什么？预处理器最终产出的是什么？',
          options: ['尽快选一个框架上手，边做边学；预处理器直接产出浏览器能读的 CSS', '建议继续在项目里使用原生 CSS——框架与预处理器都围绕 CSS 建立，基本功扎实后学与切换都显著更容易；预处理器是原生 CSS 的扩展语言，运行后把你的代码变成原生 CSS 再导入项目', '两者都不该了解，等入职后再说；预处理器的产物需要浏览器插件才能解析', '建议现在就学 Tailwind，因为它最简单；预处理器的产物仍是预处理器代码'],
          answer: 1,
          explain: '官方明确建议：**在你学习的这个时点，继续在项目里使用原生 CSS**——所有框架与预处理器都是围绕 CSS 建立的，基本功扎实会让你日后学习并在任意框架/预处理器之间切换显著更容易；课程期间去学一个，长期看不如把原生 CSS 练好划算（但要「知道它们是什么、需要时去哪儿找」，因为职场很常见）。预处理器本质上是**对原生 CSS 的扩展**：运行时接收你的代码、把它变成原生 CSS，你再导入项目。官方还点出它最吸引人的变量与嵌套已进入原生 CSS，所以除非确实需要，可能不值得那份成本。',
          lessonId: 'node-path-intermediate-html-and-css-frameworks-and-preprocessors'
        }
      ]
    },
    /* World 2 第五批（2026-09-26，v4.11.22，通宵轮批次 3）：三个路径课章节 Boss 一次配齐，
     * unitId 初版取 curriculum.js 里 section 的既有 id，批次 4（2026-09-26）起按新命名
     * 约定统一加 `intermediate-html-and-css/` 前缀（粒度与前缀决策见文件头注释）。
     * ① grid——「Grid 布局」章节本批 6/6 全开即配（7 题，来源分散在
     * introduction-to-grid / creating-a-grid ×2 / positioning-grid-elements ×2 /
     * advanced-grid-properties / using-flexbox-and-grid 六门已开放课）。
     * ② intermediate-html-concepts 与 ③ forms——**补配**：两个章节早在前几批就已全开，
     * 但按当时「反向命题（已全开必须配）需用户拍板」的口径缓配并留档；本轮用户已拍板
     * 补齐（交接明文），World 2 四个已开放章节就此口径一致、各有一个章节 Boss。
     * 补配的两单元题源限各自章节已开放课（第 1 章节 5 题：导读 1 + SVG 2 + 表格 2；
     * 表单 5 题：form-basics 2 + form-validation 2 + sign-up-form 1），全部改写自本站
     * 已讲解并已出过自测题的知识点；sign-up-form 一题只考官方提示块里的实现要求
     * （半透明底的用途），不涉及成品代码。不新增成就、不引入重 RPG 数值。 */
    {
      unitId: 'intermediate-html-and-css/intermediate-html-concepts',
      zh: '标记秘境',
      desc: '「中级 HTML 概念」章节综合预检（本站已开放 3 课）：课程定位与学习策略、矢量与位图的本质、SVG 两种嵌入方式的取舍、表格的正确用途与起步结构。',
      questions: [
        {
          q: 'Foundations 课程与「中级 HTML 与 CSS」这门课的定位差别是什么？',
          options: ['Foundations 覆盖前端全部深度，中级课负责复习巩固', 'Foundations 刻意只教上手所需的最必要内容、让你尽快有产出；中级课放慢节奏往深挖，补齐表单、表格等重要元素与 CSS 深水区', '两者完全等价，只是内容太多拆成两门', 'Foundations 只教 HTML，中级课只教 CSS'],
          answer: 1,
          explain: '官方定位：Foundations 的目标是「尽快让你上手并能有产出」，刻意只覆盖表层；中级课程的目标相反——放慢脚步、往深挖，把重要元素（表单 / 表格）与 CSS 深水区（变量 / 函数 / 阴影 / Grid）补齐，学完能复刻互联网上几乎任何网页设计。',
          lessonId: 'node-path-intermediate-html-and-css-introduction'
        },
        {
          q: 'SVG 放大到任何尺寸都不模糊、文件也不变大，JPEG 却会——本质原因是什么？',
          options: ['SVG 的分辨率天生更高', 'SVG 用数学公式定义形状与线条、没有像素网格；JPEG 用像素网格定义图像，放大必须决定新像素长什么样、网格越大文件越大', 'JPEG 有压缩而 SVG 没有压缩', '浏览器对 SVG 做了特殊的锐化处理'],
          answer: 1,
          explain: '矢量与位图的本质差异：矢量图像由公式定义，缩放不影响质量与体积（这正是 scalable 的含义）；位图受限于像素网格。代价是另一面的：照片级、细腻纹理的图像要写成海量 XML，SVG 极其不擅长——那种场景该用位图。',
          lessonId: 'node-path-intermediate-html-and-css-svg'
        },
        {
          q: '链接方式（img / background-image）与内联方式嵌入 SVG 各有什么取舍？官方建议默认选哪种？',
          options: ['链接更强大，内联只是老写法', '链接干净简单、但 SVG 内容对页面代码不可见，不能动态改；内联让 SVG 成为 DOM 元素、可用 CSS 与脚本操作，代价是可读性变差、缓存变差、大 SVG 可能阻塞加载——默认链接，确需随页面调 SVG 代码才内联', '两者完全等价，随便选', '内联永远更好，链接方式已被淘汰'],
          answer: 1,
          explain: '两种嵌入方式的分界在「SVG 是不是页面 DOM 的一部分」：内联解锁全部动态能力（属性对 CSS/JS 可见），但代码更难读、页面缓存性变差；官方建议默认用链接，除非需要随 HTML 一起调 SVG 代码。',
          lessonId: 'node-path-intermediate-html-and-css-svg'
        },
        {
          q: '下面哪个场景应该用 <table> 表格？',
          options: ['整页布局：侧栏、主区、页头全用表格摆', '一排导航按钮', '行星的轨道参数、财务数据这类真正的两维行列数据', '图片卡片画廊'],
          answer: 2,
          explain: '表格的本质是**两维数据**的展示——行与列交叉的数据它是完美工具；拿表格做页面布局则早已被否定（布局交给 Flexbox / Grid）。导航、卡片画廊等排布需求各有更合适的语义元素。',
          lessonId: 'node-path-intermediate-html-and-css-tables'
        },
        {
          q: '表格的「起步四标签」是哪四个？各自的角色是什么？',
          options: ['table / tr / th / td：table 包住整张表，tr 是一行，th 是表头单元格（语义上是行 / 列的标签），td 是数据单元格', 'table / thead / tbody / td：先分区、再填格', 'tr / th / td / caption：caption 是每张表必须写的', 'div / table / row / cell：先包一层 div 再建表'],
          answer: 0,
          explain: '起步四标签：<table> 是一切表格结构的根，<tr> 一行，<th> 表头单元格（默认加粗居中、语义上是「这一列 / 行的标签」），<td> 数据单元格。更高级的跨行跨列（rowspan / colspan）、语义分区（thead / tbody / tfoot）与 caption 在官方 Assignment 要求跟做的 MDN 进阶教程里展开。',
          lessonId: 'node-path-intermediate-html-and-css-tables'
        }
      ]
    },
    {
      unitId: 'intermediate-html-and-css/forms',
      zh: '表单关卡',
      desc: '「表单」章节综合预检（本站已开放 3 课）：控件的提交语义、按钮的 type 陷阱、校验属性的反直觉行为、:user-invalid 的交互时机、项目课的实现要求。',
      questions: [
        {
          q: '一个 input 的 label 配对正确、也写了 placeholder，但提交后后端就是收不到这个字段的值。最可能漏了什么？',
          options: ['漏写 type 属性', '漏写 name——后端按 name 识别字段，没有 name 的控件根本不参与提交', 'placeholder 应该换成 value', '漏写 form 的 action'],
          answer: 1,
          explain: 'name 是控件参与表单提交的「身份证」：提交数据按 name 组织，没写 name 的控件值不会出现在数据里——页面外观完全正常，只有真提交一次才会暴露。label 与 placeholder 都是给用户看的，与提交无关。',
          lessonId: 'node-path-intermediate-html-and-css-form-basics'
        },
        {
          q: '表单里放了一个「点击切换主题」的按钮，结果一点它整个表单就提交了。为什么？怎么修？',
          options: ['button 默认 type 是 reset，改成 type="text" 即可', '<button> 在表单里不写 type 时默认就是 submit——不用于提交的按钮要显式写 type="button"', '切换主题的脚本写错了', '浏览器缓存问题，清缓存即可'],
          answer: 1,
          explain: '表单里的 <button> 不写 type 默认是 submit——这是表单部件里最反直觉的默认值。修法是给每个按钮显式声明角色：提交按钮 type="submit"，普通操作按钮 type="button"，重置才用 type="reset"。',
          lessonId: 'node-path-intermediate-html-and-css-form-basics'
        },
        {
          q: '给 textarea 写了 minlength="3"，用户什么都没填就点提交，结果提交成功了。这是 bug 吗？',
          options: ['是 bug，minlength 理应拦住空值', '不是：约束校验只在用户改动过值时才应用，minlength 不隐含 required——要「必须填且至少 3 字」得 required 与 minlength 都写', '是 bug，应该改用 maxlength', '不是 bug，但说明浏览器不支持 minlength'],
          answer: 1,
          explain: 'MDN 的依据：constraint validation is only applied when the value is changed by the user——空值不触发 minlength，这是规范行为不是 bug。minlength 与 required 管的是两件事，双重要求就两个都写。',
          lessonId: 'node-path-intermediate-html-and-css-form-validation'
        },
        {
          q: ':user-invalid 与 :invalid 的关键差别在哪？为什么校验红框样式官方选前者？',
          options: ['两者完全等价，只是名字不同', ':invalid 页面一加载就判定，空的必填框立刻命中，用户还没开始填就满屏红框；:user-invalid 只在用户完成一次完整交互之后才命中——反馈出现在用户有机会填写之后', ':user-invalid 只对 textarea 生效', ':invalid 是已废弃的旧伪类'],
          answer: 1,
          explain: '差别在「是否等用户交互过」：:invalid 不管交互状态，加载瞬间空的必填框就是非法；:user-invalid 要等一次完整交互（比如填入内容后离开该框）才命中。把校验反馈的时机放在交互之后，正是校验体验（validation UX）的核心。',
          lessonId: 'node-path-intermediate-html-and-css-form-validation'
        },
        {
          q: '注册表单项目里，官方要求「ODIN」logo 背后那块区域怎么实现？目的是什么？',
          options: ['垫一层不透明的白色底，保证文字清晰', '一个 div，带深色但半透明的背景色——半透明层透出背景图、同时压暗它，提升文字在繁忙背景图上的可读性', '给文字加 text-shadow 就够了', '把背景图在 logo 区域裁剪成空白'],
          answer: 1,
          explain: '官方提示块原话的要点：那块是一个带深色**半透明**背景色的 div，作用是提升文字在繁忙背景图上的可读性。注意是半透明而不是不透明——要透出背景图，只是压暗，这不是装饰而是可读性手段。',
          lessonId: 'node-path-intermediate-html-and-css-sign-up-form'
        }
      ]
    },
    {
      unitId: 'intermediate-html-and-css/grid',
      zh: '网格圣所',
      desc: '「Grid 布局」章节综合预检（本站已开放 6 课）：Grid 的定位与 Flex 的关系、轨道定义与简写顺序、显式与隐式网格、线号坐标系、动态轨道三件套、auto-fit 的计算与嵌套搭配。',
      questions: [
        {
          q: 'Flexbox 与 Grid 各自主场是什么？「Grid 取代 Flexbox」的说法对吗？',
          options: ['Flexbox 管宽度、Grid 管高度；取代说法正确', 'Flexbox 是一维布局工具（一次管一行或一列），Grid 是两维布局工具（行列轨道一次定义）——一维内容流默认 Flex 更直觉，两维版面结构 Grid 主场；「取代」是伪命题，两者互补、还可嵌套搭配', '两者完全等价，任选其一即可', 'Grid 只能做静态布局，动态布局必须 Flexbox'],
          answer: 1,
          explain: '章节导读与收官课的同一条主线：Flexbox 控制一行（列）里项目的行为，Grid 先定两维格局再放内容。官方立场明确——两者是互补工具（complementary tools），各有位置；判断口径是「内容优先选 Flex、布局优先选 Grid」，定不下来就外 Grid 内 Flex 嵌套。',
          lessonId: 'node-path-intermediate-html-and-css-introduction-to-grid'
        },
        {
          q: 'grid-template: 50px 50px / 50px 50px 50px 定义了一个什么样的网格？',
          options: ['三行两列', '两行三列——简写里斜杠前是行、斜杠后是列', '五行五列', '一行一列，多余的值被忽略'],
          answer: 1,
          explain: 'grid-template 简写的固定顺序：rows before the slash, columns after——这里是两行（各 50px）三列（各 50px）。把顺序记反不会报错，只会得到一个行列转置的网格，是这一课最高频的翻车点。',
          lessonId: 'node-path-intermediate-html-and-css-creating-a-grid'
        },
        {
          q: '2×2 网格（行列都定义了 50px 轨道）里放进第五个项目，会发生什么？新行的高度由谁决定？',
          options: ['第五个项目溢出容器或被丢弃', '第五个项目被放进自动创建的第三行（隐式网格）；隐式行不继承显式的 50px，默认由内容撑开——可用 grid-auto-rows: 50px 统一尺寸', '前四个项目被自动压缩腾位置', '直接报错，必须先改 grid-template'],
          answer: 1,
          explain: '隐式网格机制：项目需要的轨道超出显式定义时，Grid 自动创建新轨道接住它们（默认向下补行，grid-auto-flow: column 可改横向）。关键细节：显式轨道的尺寸不会带进隐式轨道——「多出来的那一行为什么高度不一样」十有八九是这个原因。',
          lessonId: 'node-path-intermediate-html-and-css-creating-a-grid'
        },
        {
          q: '想让一个项目横跨整个 3 列宽的网格，grid-column 该怎么写？',
          options: ['grid-column: 1 / 3', 'grid-column: 1 / 4——n 条轨道对应 n+1 条线，横跨 3 列要到第 4 条线', 'grid-column: 0 / 3', 'grid-column: 1 / span 1'],
          answer: 1,
          explain: '线号比轨道数多一：3 列网格的列线是 1 到 4，1 / 3 只跨了两条轨道。不想数线号有两个偷懒写法：负数线（grid-column: 1 / -1，从第一条线到最后的线）或 span（grid-column: span 3，跨三条轨道）。',
          lessonId: 'node-path-intermediate-html-and-css-positioning-grid-elements'
        },
        {
          q: 'grid-area: 1 / 1 / 3 / 6 的四个值按什么顺序解释？',
          options: ['上 / 右 / 下 / 左（与 margin 四值相同）', '行起 / 列起 / 行止 / 列止——从行线 1 到行线 3，从列线 1 到列线 6', '列起 / 列止 / 行起 / 行止', '左上角坐标 / 右下角坐标'],
          answer: 1,
          explain: 'grid-area 四值的顺序是行起 / 列起 / 行止 / 列止——与 margin 的「上右下左」毫无关系，每对里 start 在前 end 在后。写反不报错，项目会安静地摆到错误位置；不确定时先拆成四条 start / end 属性写明白。',
          lessonId: 'node-path-intermediate-html-and-css-positioning-grid-elements'
        },
        {
          q: '内容盒宽 500px 时，repeat(auto-fit, minmax(150px, 1fr)) 渲染几列？每列多宽？浏览器怎么算的？',
          options: ['固定 5 列，每列 100px', '3 列，每列约 166.7px——先用最小值 150px 算最多塞得下几列（500÷150 取最大可能正整数 = 3），再把每列从最小值拉伸到最大值 1fr 平分空间', '3 列，每列固定 150px，右侧留 50px 空白', '4 列，最后一列只有 50px'],
          answer: 1,
          explain: '官方拆解的三步：① 取内容盒宽度（不含 margin / border / padding）；② 用 minmax 的最小值算列数——最小值出的列数最多，第 4 列需要 600px 会溢出，所以 3 列；③ 把每列拉伸到最大值，max 是 1fr 就平分全部空间。窗口每变一次实时重算——这就是「列数自适应 + 列宽自伸缩」魔法行的原理。',
          lessonId: 'node-path-intermediate-html-and-css-advanced-grid-properties'
        },
        {
          q: '官方「Combining flexbox and grid」示例里，Grid 与 Flexbox 两层怎么分工？',
          options: ['Grid 摆外层版面（两维精确放置区块），网格项目自己再当 flex 容器、由 Flex 管区块内部内容的自由排布', 'Flex 摆外层、Grid 管内部，与 A 相反', '同一页面只能二选一，混用是反模式', '一个元素不能既是网格项目又是 flex 容器'],
          answer: 0,
          explain: '官方组合技：外层 Grid 负责两维格局（侧栏 / 顶栏 / 主区各占各的格子），每个网格项目内部再 display: flex 排自己的内容（图标一行、文字一列）。一个元素完全可以同时是网格项目（对外层）与 flex 容器（对内部）——两层各管各的，互不打架。',
          lessonId: 'node-path-intermediate-html-and-css-using-flexbox-and-grid'
        }
      ]
    },
    /* World 3 批次 4 阶段 1（2026-09-26，v4.11.23，通宵轮批次 4）：javascript 课程的第一个
     * 章节 Boss。unitId 按批次 4 起的新命名约定 `<courseId>/<sectionId>` 直书
     * （javascript/organizing-your-javascript-code，与 pathBossUnitId 构造结果一致）；
     * 「组织 JavaScript 代码」章节本批 14/14 全开即配（引言章节单课不配，与既有
     * 「单课章节不配 Boss」口径一致）。8 题来源分散在本章 14 课中的 8 课
     * （object-constructors / factory-functions / classes / es6-modules / npm / webpack /
     * json / oop-principles），4 门 Project 课不出题（任务型课不考实现，与 admin-dashboard
     * 口径一致）；organizing-code-with-objects 与 tic-tac-toe 等其余课不重复出题。
     * 全部改写自本站已讲解并已出过自测题的知识点，不给成品答案、不引入重 RPG 数值。 */
    {
      unitId: 'javascript/organizing-your-javascript-code',
      zh: '对象熔炉',
      desc: '「组织 JavaScript 代码」章节综合预检（本站已开放 14 课）：原型链与属性查找、闭包私有变量、class 的糖衣本质、模块入口与依赖图、依赖两类之分、打包器三件事、JSON 往返与函数丢失、单一职责与松耦合。',
      questions: [
        {
          q: '构造器函数造一批对象时，公共方法为什么建议定义在 Constructor.prototype 上而不是构造器函数体内？player1 调用一个自己没定义的方法时，JavaScript 是怎么找到它的？',
          options: ['构造器内的方法会被后造的实例覆盖；方法查找按属性名字母序', '构造器体内定义的方法每个实例都复制一份（N 个实例 N 份、浪费内存），原型上只存一份全体共享；查找沿 [[Prototype]] 链逐级向上——先问实例自己，没有再逐级问原型，直到 Object.prototype，链尾 null 还没有就返回 undefined', '原型上的方法执行速度更快；找到第一个同名属性就停、永远不会返回 undefined', '两种写法完全等价，纯属风格问题；查找是从全局对象向下逐级问'],
          answer: 1,
          explain: '官方给的两个理由：① 省内存——公共属性与函数定义在集中、共享的对象上，不必每个实例复制一份；② 共享行为——多个对象经原型继承复用同一套方法。查找规则：沿链逐级向上（player1 → Player.prototype → Object.prototype → null），一个对象只有一个 [[Prototype]]（没有多继承），查到终点还没有才返回 undefined。',
          lessonId: 'node-path-javascript-object-constructors'
        },
        {
          q: '工厂函数 createUser 内部声明了 let reputation = 0，返回对象里只放 getReputation 与 giveReputation 两个函数。const josh = createUser("josh") 之后，josh.reputation 是什么？为什么那两个函数仍然能读写 reputation？',
          options: ['0——返回对象会自动带上函数体里的全部变量', 'undefined——变量本体不在返回对象里，外界摸不到；两个函数是闭包，出生时的作用域随函数一起活着，这是访问私有变量的唯一途径', '直接报错——没返回的变量在对象上一律不可访问', 'undefined——reputation 在返回时被销毁了，所以那两个函数其实也读不到真值'],
          answer: 1,
          explain: '这就是「私有」变量：返回对象里既没有它、也没有它的任何副本，访问途径只有闭包。高频误区：return { reputation } 这种对象简写只是新建属性、复制当时的值——跟 let b = a 之后 a 再变 b 不变是同一件事，新属性不「追踪」原变量。',
          lessonId: 'node-path-javascript-factory-functions-and-the-module-pattern'
        },
        {
          q: '官方怎么定性 ES6 的 class？类体里直接写的方法住在哪？class 漏写 new 与函数构造器漏写 new 各是什么下场？',
          options: ['class 是全新的继承机制，与原型彻底无关', 'class 基本上近似对象构造器与原型的一套新语法——底层机制没有变、没有经典继承在发生；类体里的方法自动住在 prototype 上、全体实例共享，等价于手写 prototype 赋值；class 漏写 new 直接抛 TypeError，函数构造器漏写 new 是静默错误行为（要自己加 new.target 防护）', '类体方法住在每个实例自己身上；两种漏写 new 都会返回 undefined', 'class 只是 function 的别名，两种写法行为处处完全一致'],
          answer: 1,
          explain: '官方原话 mostly resembles：每见一个 class 特性就翻译回构造器/原型/闭包的既有知识。「独特属性」三条顺带记：类体自动严格模式、类方法默认不可枚举、漏写 new 抛 TypeError——上一课手动加的防护，class 是内置的。',
          lessonId: 'node-path-javascript-classes'
        },
        {
          q: 'two.js import 了 one.js 的变量，one.js 不 import 任何文件。HTML 只挂一个 script type="module"——src 该指哪个文件？指错了会怎样？为什么不用再写 defer？',
          options: ['指 one.js——它更基础；指 two.js 会把 one.js 加载两遍', '指 two.js——入口永远是依赖链最上游的消费者，浏览器加载它时看到依赖、把 one.js 的代码也加载进来；错指 one.js 则它不依赖任何文件，two.js 的代码根本不会被用到、什么都不会打印；type="module" 自动延迟脚本执行，defer 不必写', '都可以——浏览器会自动扫描并加载项目里所有 js 文件', '必须挂两个 script 标签、每个文件一个，defer 一个都不能少'],
          answer: 1,
          explain: '官方依赖图：importer 依赖 exporter，图可以一直长（直接依赖与间接依赖都行），入口只有一个。另一条硬限制：浏览器安全原因，ES 模块不能在 file:// 直开的页面里加载——用本地服务器（官方推荐 VS Code 的 Live Preview 扩展）。',
          lessonId: 'javascript-es6-modules'
        },
        {
          q: 'npm 装包时怎么决定进 dependencies 还是 devDependencies？npm install 这一步到底读什么、代码去了哪？',
          options: ['按包名字母序自动分配；install 读 node_modules 目录反推清单', '用户浏览器/产品运行时真要跑的代码进 dependencies；只在开发与构建期用的工具（webpack、测试框架等）进 devDependencies（--save-dev 或 -D）；npm install 读 package.json 清单，从 npm 仓库把包下载到本地 node_modules/', '两者完全等价，只是历史命名不同；install 读完 package-lock.json 就把它删掉', 'dependencies 是开发时装的，devDependencies 才会随产品部署给用户'],
          answer: 1,
          explain: '判断句：「用户浏览器里要跑它吗？」要 → dependencies，不要 → devDependencies。分界的实际意义：生产部署只装 dependencies，构建工具不上线。仓库本身不包含依赖代码——谁 clone 谁跑 install，npm 替你抓来；装包/卸载时 npm 自动更新 package.json。',
          lessonId: 'node-path-javascript-npm'
        },
        {
          q: 'webpack 这类打包器做的三件核心事是什么？CSS 为什么要经过 css-loader 与 style-loader 才能进打包流程？',
          options: ['从入口文件构建依赖图、把所有相关文件合并输出成单一文件、顺带可做压缩与摇树等优化；webpack 只懂 JS，其他资源要靠 loader 翻译成它能理解的模块——css-loader 解析 import 的 CSS、style-loader 把它注入页面，顺序不能反', '只负责压缩代码；CSS 本来就能直接进包，loader 只是历史包袱', '把每个文件各打一个包、按需加载；CSS 交给浏览器自动处理、不需要 loader', '只做文件合并；摇树是 dev server 的功能，与打包器无关'],
          answer: 0,
          explain: '入口 + 依赖图 + 单文件输出三件套正是 ESM 课概念在打包语境的原样复用；loader 是 webpack 五大核心概念之一（非 JS 资源的翻译官）。摇树（tree shaking）= 把「导出了但没人 import」的死代码摇出产物，依赖 ES 模块的静态结构；与压缩互补——一个砍整段无用代码，一个给留下的瘦身。',
          lessonId: 'javascript-webpack'
        },
        {
          q: '把带方法的 todo 对象 stringify 存进 localStorage，刷新页面再 parse 取回——少了什么？stringify 与 parse 各自的方向是？',
          options: ['什么都不会少——JSON 完整保留对象的一切', '所有方法都没了——JSON 里不能存函数，stringify 时函数直接被丢弃；parse 取回的是纯数据，要把数据喂回工厂函数/类重建行为。stringify 是对象 → JSON 文本（存/传之前），parse 是 JSON 文本 → 对象（收到/读出之后）', '属性全没了、只剩方法名；两个方法谁先谁后无所谓', '日期会丢——JSON 只能存字符串和数字，其余类型一律变 null'],
          answer: 1,
          explain: '官方 Todo List 项目明文：you cannot store functions in JSON——从存储取回后怎么把方法装回对象，是留给你的思考题（工厂函数/类正好是装回工具）。日期不丢但会变形：Date 自动转 ISO 字符串，取出来要自己复活（reviver 或手动 new Date）。',
          lessonId: 'node-path-javascript-json'
        },
        {
          q: '单一职责原则用一句话说是什么？「紧耦合」的代价是什么，松耦合靠什么做到？',
          options: ['每个类只许有一个方法；对象之间引用越多性能越好', '一个类/对象只该有一个变更的理由——改需求时只动一处；紧耦合是对象之间知道彼此太多细节，局部修改引发全局连锁；松耦合靠参数/接口交互，而不是直接摸另一个对象的内部数据与方法', '类越少越好，最好全写在一个文件里；不引用别的对象就算松耦合', '单一职责指每个文件只负责一个页面；松耦合就是让对象之间完全不通信'],
          answer: 1,
          explain: 'SOLID 的 S（single responsibility）：职责越多，变更理由越多，改一处崩一片的风险越大。耦合与组合是一体两面——「组合优于继承」视频给的设计转向：新对象的第一反应从「它继承谁」变成「它需要哪些行为」，行为做成独立小函数按需装配。',
          lessonId: 'node-path-javascript-oop-principles'
        }
      ]
    },
    /* World 3 批次 4 阶段 2（2026-09-27，v4.11.24，通宵轮批次 4）：javascript 课程第三、四章
     * 各配一个章节 Boss（用户指令：阶段 2 两章全开各配）。unitId 按批次 4 新约定
     * `<courseId>/<sectionId>` 直书。「真实世界的 JavaScript」章节 3/3 全开即配（本章无
     * Project 课，3 门知识课全可出题，取 5 题：linting 2 + form-validation 2 + ecmascript 1）；
     * 「异步 JavaScript 与 API」章节 4/4 全开即配（7 题：asynchronous-code 2 +
     * working-with-apis 3 + async-and-await 2；Project 课 weather-app 不出题——任务型课
     * 不考实现，与 admin-dashboard / 对象熔炉口径一致）。全部改写自本站已讲解并已出过
     * 自测题的知识点，不给成品答案、不引入重 RPG 数值。 */
    {
      unitId: 'javascript/javascript-in-the-real-world',
      zh: '真实世界回廊',
      desc: '「真实世界的 JavaScript」章节综合预检（本站已开放 3 课）：linter 与 formatter 的分工、IDE 扩展与事实源、两层表单校验的能力边界、novalidate 的真实语义、ECMAScript 命名改制与 Babel 的定位。',
      questions: [
        {
          q: 'Linter（ESLint）与 Formatter（Prettier）的分工是什么？什么情况下你不需要配置 eslint-config-prettier？',
          options: ['两者是同类工具的新旧两代，装了 Prettier 就该卸载 ESLint', 'Linter 按风格规则扫描代码、报告（有时自动修复）违规写法——管「对不对」；Formatter 不找错误、专管排版（空格/缩进/换行）——管「齐不齐」。用 ESLint 默认推荐规则集时两者无冲突，直接装 Prettier 即可、无需 eslint-config-prettier（官方明文）', 'Linter 只管缩进，Formatter 负责找 bug；任何时候都必须配 eslint-config-prettier 否则两者打架', '两者都装成 dependencies（生产依赖）；只有自定义了排版规则才需要 eslint-config-prettier'],
          answer: 1,
          explain: '职能对照：ESLint 找「违反规则的写法」（可报告可自动修复），Prettier 对空格、缩进层级、换行做智能决定——高度有观点、几乎不可配置。两者都是 devDependency（开发期工具，不进生产依赖）。冲突豁免的条件官方写得很具体：默认推荐规则集——自定义了排版相关 lint 规则时才需要那个熄火配置包。',
          lessonId: 'node-path-javascript-linting'
        },
        {
          q: '已经装了 VSCode 的 ESLint / Prettier 扩展，为什么官方仍强调项目里要装依赖包、放配置文件？',
          options: ['扩展只是图形界面，真正干活的二进制在包里——不装包扩展就是摆设', '扩展是便利层：检测到项目里有对应的包和配置文件时，就用项目的规则与包版本——项目永远是事实源；这样多人协作、换机器、接别人的项目时规则不漂移，你的本地设置也不会把不想要的风格改动带进别的项目', 'VSCode 规定：任何扩展都必须有同项目的配置文件才能启动', '为了 CI：流水线上没有 VSCode，扩展配置无法复用，必须重装一遍'],
          answer: 1,
          explain: '官方总结句：扩展是很好用的便利工具，但不应被当作项目 lint/格式设置的事实源。扩展可以有兜底规则，但项目内的包与配置一旦存在就以它们为准——「规则跟着仓库走」是团队协作的底线（顺带：把这套设置放进模板仓库，新项目开局即带）。',
          lessonId: 'node-path-javascript-linting'
        },
        {
          q: 'HTML 内置校验（required / pattern 等）已经能拦不合规输入——JS 校验补的是哪两块能力？Constraint Validation API 里「不合规的具体原因」从哪读？',
          options: ['JS 校验比 HTML 校验更快；原因从 response.status 读', '跨字段逻辑（两次密码一致、日期先后）与文案/呈现定制（自己的错误消息、边输入边标红引导）——内置校验是单字段规矩、气泡文案样式不可控。具体原因读控件的 validity 属性（ValidityState 对象：valueMissing / typeMismatch / tooShort / patternMismatch 等一组布尔）', '内置校验只是视觉提示、根本不拦截；原因要用 try...catch 捕获', 'JS 校验用于服务端复核；原因从 checkValidity() 的返回值字符串里解析'],
          answer: 1,
          explain: '两层分工：HTML 属性设置标准约束（浏览器自动拦截 + 内置气泡），JS 层接管逻辑与文案。checkValidity() 只给布尔（合规吗），「为什么」在 validity 对象里——每个原因都有名字，写错误分支时按名取用；自定义文案走 setCustomValidity()（非空即不合规、空串恢复）。',
          lessonId: 'node-path-javascript-form-validation-with-javascript'
        },
        {
          q: "form 加了 novalidate 之后，required 属性还起作用吗？setCustomValidity('两次密码不一致') 执行后、用户改对了密码，接下来必须做什么才能让表单重新可提交？",
          options: ["novalidate 让 required 彻底失效；改对密码后浏览器自动清除自定义消息", "required 设置的标准约束仍在——validity.valueMissing 等状态照常可查，novalidate 关掉的只是浏览器的自动拦截与气泡 UI；必须在校验通过时调 setCustomValidity('')（传空串）——自定义消息一旦设置控件就一直不合规，不清就永远提交不了", 'novalidate 只影响样式；空串会把控件从表单里移除', 'required 仍起作用；需要重新渲染整个表单来清除自定义消息'],
          answer: 1,
          explain: '两条都是高频坑：① novalidate 的语义是「校验改由你的 JS 全权负责」，不是「取消校验」——约束状态照常可查，你的代码要靠它们做判断；② setCustomValidity 是双向开关：非空串 = 不合规 + 该消息成为 validationMessage，空串 = 恢复合规——每次重新校验都必须走「通过则清空」分支，否则表单永远卡死。',
          lessonId: 'node-path-javascript-form-validation-with-javascript'
        },
        {
          q: 'ES6、ES2015、ES7 这些名字是什么关系？官方为什么又说课程项目不需要为 Babel 操心？',
          options: ['三个互不兼容的语言方言；课程项目用的浏览器都内置了 Babel', '同一条时间线的两套叫法：ES6 发布后 TC39 委员会把命名从版本号改成年份——ES6 又名 ES2015、有人叫 ES7 的就是 ES2016，且发布节奏从「攒大招」改成每年一版、每版少量新增。课程项目的目的是实操练习、不是给客户交付生产级产品，所以不必每项目都架转译流水线——但真实产品控制不了用户浏览器，新特性到 widely available 常滞后几年，届时靠 Babel 按 targets 转译', 'ES 数字是草案版、年份是正式版；Babel 会把代码翻译成其他编程语言', 'ES6 是 JavaScript、ES2015 是 TypeScript 的别名；课程项目不需要 Babel 因为官方禁用了新特性'],
          answer: 1,
          explain: 'JavaScript 是符合 ECMAScript 标准的语言，ES6（2015 年夏发布）就是本课程一直在教的那些特性的来源——官方原话「ES6 就是 JavaScript」。Babel 的边界官方说得很诚实：知道这套机制存在、认识 targets 与转译这两个名词，真实项目需要时再学配置。',
          lessonId: 'node-path-javascript-ecmascript'
        }
      ]
    },
    {
      unitId: 'javascript/asynchronous-javascript-and-apis',
      zh: '异步钟楼',
      desc: '「异步 JavaScript 与 API」章节综合预检（本站已开放 4 课）：回调与 Promise 的模型、undefined 现场的成因、fetch 的两层 Promise、404 不进 catch 的真相、API key 的安全边界、async/await 的糖衣本质与顶层限制。',
      questions: [
        {
          q: "官方 getData() 例子里，const myData = getData(); myData['whatever'] 为什么拿到 undefined？Promise 用什么方式解决？",
          options: ['getData() 写错了——异步函数必须用 await 调用才有返回值', '取数据要花时间，但代码假设函数里的一切瞬间完成——取值那一刻 getData() 还在路上，myData 不是预期数据。Promise 的解法：函数立刻返回一个「未来某个时刻可能产出值」的占位对象，用 .then(fn) 把后续逻辑挂到 resolved（值产出）之后执行', 'undefined 是服务器的默认响应；再请求一次就有了', '因为 myData 是 const 声明的——改成 let 就能等到数据'],
          answer: 1,
          explain: '这是「同步思维套异步操作」的破产现场。Promise 的本质定义官方只给了一句：可能在未来某个时刻产出一个值的对象——值没到它先占位；.then() 的语义是「等 resolved 再跑里面的函数」（官方注释原话 and THEN run the function inside）。',
          lessonId: 'node-path-javascript-asynchronous-code'
        },
        {
          q: '回调本身不是坏东西（addEventListener 天天用）——「回调地狱」的成因是什么？Promise 链靠什么结构性优势拉平它？',
          options: ['回调执行太慢拖累性能；Promise 用多线程并行执行所以快', '需要把好几个回调按特定顺序串联时，每步嵌进上一步的回调体——缩进长成金字塔、逻辑分散、错误处理各自为政；Promise 链把嵌套改成 .then() 一环接一环的平铺：值沿链流动（return 即传给下一环），.catch() 在链尾统一接错', '回调只能用在 DOM 事件里；Promise 只能用在网络请求里', '回调地狱指回调函数太长；拆成小函数就能解决，与 Promise 无关'],
          answer: 1,
          explain: '官方原文的边界很清楚：回调在 addEventListener 这类场合很好用，失控发生在「按特定顺序串联好几个」的时候。Promise 的优势不是速度而是形状——嵌套变平铺、错误出口从「每层各管各」变「链尾一个 catch」。',
          lessonId: 'node-path-javascript-asynchronous-code'
        },
        {
          q: 'API、endpoint、API key 三者是什么关系？服务发 key、分免费/付费层级的两个目的是什么？',
          options: ['三者是同一概念的三种叫法；目的是让文档显得专业', 'API 是服务器对外提供功能与数据的整套接口（大多经 URL 访问）；endpoint 是 API 里干某件具体事的专用 URL；key 是随每个请求携带的身份凭证——服务借它关联你的请求量与频率。两个目的：追踪系统与数据的滥用 + 缓解与回收运营成本（跑服务器要钱）', 'key 用来加密传输内容；免费层级是为了测试、付费层级才允许生产使用', 'endpoint 是服务器硬件接口；API key 就是账号密码，登录后才能打开网页'],
          answer: 1,
          explain: '官方用 Visual Crossing 把三个概念串了一遍：timeline endpoint 收城市名、key 走 query string 参数（?key=…）、免费档 1000 次/天 vs 企业档 150 美元/月——单次请求只值几分之一美分，但热门应用每分钟几千次请求会让成本迅速膨胀，分层定价由此而来。',
          lessonId: 'node-path-javascript-working-with-apis'
        },
        {
          q: 'fetch 请求一个不存在的资源、服务器回了 404——.catch() 会执行吗？正确的处理方式是什么？fetch 的 promise 什么时候才 reject？',
          options: ['会——404 是 HTTP 错误，fetch 自动抛进 .catch()', '不会。官方 Assignment 明文：只要 API 有响应——哪怕 404 或其他非 2XX——对 fetch 都是有效响应，promise 正常 resolve；要条件化处理就在 .then() 里查 Response 对象的 ok（是否 2XX）与 status（状态码）手动分支。fetch 只在网络层失败（断网、域名解析不了）时 reject；后续 JS 代码抛错（如访问 undefined 的属性）或手动 throw 才会进 .catch()', '会——但只在开发模式；生产构建里 404 静默忽略', '不会——404 时 fetch 返回 null，要用 if (data === null) 判断'],
          answer: 1,
          explain: "根子在 Promise 语义：fetch 的 resolve 表示「HTTP 层完成了一次往返」，不表示「业务上成功」——两层含义分开、各查各的。惯用形态：.then(response => { if (!response.ok) throw new Error('HTTP ' + response.status); return response.json(); })——手动 throw 之后 .catch() 才接得住。",
          lessonId: 'node-path-javascript-working-with-apis'
        },
        {
          q: '为什么「推到前端的 API key 是公开知识」？课程项目（Giphy / 天气应用）为什么又允许把 key 放进前端代码？',
          options: ['前端代码会被浏览器自动上传到 API 服务商；课程项目用的是假 key', '前端代码与请求 URL 用户全看得到，还有机器人专扫 GitHub 上硬编码的 key、嗅探器能从流量里捡——所以客户端的 key 等于公开。课程阶段可接受是官方明文划的边界：用的是免费 API（key 公开可得）、应用只有自己和作品集观众在用，暴露没有实际后果；GitHub 可能弹泄露警告，天气应用课官方明说收到也没关系——但付费/敏感 key 绝不能这么放，真正的保护要服务端处理（环境变量、后端代理）', 'https 会加密 key 所以前端安全；课程项目必须用付费 key 练习', 'key 放前端会被浏览器缓存泄露；课程项目允许是因为学生账号不限流量'],
          answer: 1,
          explain: '官方引用过 2375 美元的亚马逊 EC2 事故（key 进公开仓库被机器人扫到、盗用计费资源）作为反面教材。「Never trust the client」的双向含义：别信客户端发来的数据，也别指望发往客户端的东西能保密——环境变量 + 服务端代理才是正解，后端课程会接完这个话题。',
          lessonId: 'node-path-javascript-working-with-apis'
        },
        {
          q: 'async 函数里 return 一个值、throw 一个错误，各等价于 Promise 的什么操作？「async 函数只是 promises 的语法糖」——这句话官方让你记住什么？',
          options: ['return 等价于 reject、throw 等价于 resolve；语法糖指 async 函数执行更快', 'return = resolve 那个值、throw = reject 这个 promise——async 函数自动返回 promise，问「它返回什么」答案永远是 promise。语法糖定性意味着：机制没变、只换了写法——Promise 的全部知识原样适用（包括「404 不进 catch」「json() 返回 promise」），await 只是顶替 .then() 的取值姿势', 'return 直接返回值本身（不是 promise）；语法糖指可以少写括号', 'return 与 throw 在 async 函数里都被忽略；语法糖是即将废弃的过渡特性'],
          answer: 1,
          explain: '官方 The async keyword 节的三条语义：async 声明异步函数（函数内用 await 的前提）、自动返回 promise、return/throw 分别等于 resolve/reject。「语法糖」是官方原话 syntactical sugar——不是贬义，是强调等价性：Giphy 重构版与 Promise 版「行为完全一致，只是样子不同」。',
          lessonId: 'node-path-javascript-async-and-await'
        },
        {
          q: '官方 Practice 里，为什么不能直接在普通 script 标签（非 module）的顶层写 await 去等 fetch？async 函数的错误处理有哪两条路、怎么选？',
          options: ['顶层 await 会阻塞页面渲染，浏览器禁用它；错误只能在函数外处理', 'await 不能用在非模块 script 的顶层（官方明文）——解法是包一层 async 函数再调用（getCats() 模式），或把 script 改成 type="module"。错误处理两条路：调用处链 .catch(err => ...)（async 函数返回的就是 promise），或函数体内 try { await … } catch (error) { … } 就地接错——怎么选看代码怎么写的，官方说时间久了自然有手感', '顶层 await 只在 Node 里合法；两条路必须先 throw 才能用', 'await 在顶层会把 promise 变成同步值导致数据损坏；try...catch 是唯一合法方式'],
          answer: 1,
          explain: '顶层 await（top-level await）是模块才有的待遇——普通 script 里写 await 直接 SyntaxError（同理：await 只能住在 async 函数体内）。try...catch 官方评价「可能显得乱，但不用在每次调用后链 .catch()」——两条路都合法，try 块抛错就跑 catch 块，同步代码同样适用这套语句。',
          lessonId: 'node-path-javascript-async-and-await'
        }
      ]
    },
    /* World 3 批次 4 阶段 3（2026-09-27，v4.11.25，通宵轮批次 4）：javascript 课程第五、六章
     * 各配一个章节 Boss（用户指令口径：全开即配）。unitId 按批次 4 约定
     * `<courseId>/<sectionId>` 直书。「测试 JavaScript」章节 3/3 全开即配（5 题：
     * testing-basics 2 + more-testing 3；Project 课 testing-practice 不出题——任务型课
     * 不考实现，与 weather-app / admin-dashboard 口径一致）；「一点计算机科学」章节
     * 11/11 全开即配（8 题：intro-to-cs 1 + recursive-methods 1 + time-complexity 2 +
     * space-complexity 1 + common-data-structures 1 + hashmap-data-structure 2；
     * 5 门 Project 课 recursion / linked-lists / hashmap / binary-search-trees /
     * knights-travails 不出题）。全部改写自本站已讲解并已出过自测题的知识点，
     * 不给成品答案、不引入重 RPG 数值。 */
    {
      unitId: 'javascript/testing-javascript',
      zh: '试炼考馆',
      desc: '「测试 JavaScript」章节综合预检（本站已开放 3 课）：TDD 测试先行的核心思想与 why/what 定盘星、Jest 的 ESM/Babel 桥、隔离与紧耦合代码的拆解、纯函数重构的两个好处、mocking 的定位与官方例子。',
      questions: [
        {
          q: 'TDD 的核心思想是什么？官方认为写测试最重要的问题是哪些？',
          options: ['先写被测代码，再补自动化测试来验证它；最重要的是掌握测试框架的断言语法', '先写自动化测试，再写被测代码（官方原话：在被测代码写出来之前就开始写测试）；官方定盘星——写测试与其说关乎语法，不如说关乎 TDD 哲学：最重要的问题是知道为什么（why）写测试、测什么（what），而不是怎么测（how）', '测试与实现同时写、没有先后；最重要的是选对测试库——官方已指定必须用 Mocha', '只给关键函数写测试；最重要的是控制测试数量、减少维护成本'],
          answer: 1,
          explain: '库的问题官方也回答了：Mocha/Jasmine/Tape/Jest 各有绝活但基本语法几乎相同，用哪个都不要紧——课程选 Jest 只因它讲解资源与文档最好。why/what 重于 how 这句定盘星在下一课项目立刻兑现：caesarCipher 的四条边界子要求（回绕/大小写/标点/只测公开函数）就是「测什么」的具体化。',
          lessonId: 'node-path-javascript-testing-basics'
        },
        {
          q: 'Jest 默认不识别 ESM——官方的两步解决方案是什么？Babel 在幕后做了什么、会不会改写你的源文件？',
          options: ['把 Jest 升级到最新版就自动支持 ESM 了，不需要任何配置', '把所有测试文件改成 .cjs 扩展名并改用 require 写法——这与 Babel 无关', '安装 @babel/preset-env@^7（官方注明截至撰写时 Jest 要求 Babel v7、尚不兼容最新 v8），并在项目根目录创建 babel.config.js（presets 配 preset-env、targets 设 node current）——之后照常写 import/export、教程其余不用改、Jest 照常运行；幕后 Babel 在运行 Jest 前把 ESM 转成 CJS，全在内存里发生，不会覆写你的实际文件', '在 Jest 配置里关掉 ESM 支持；Babel 会把源文件改写为 CJS 语法并落盘保存'],
          answer: 2,
          explain: '这是官方 Tip 的全部内容，下一课 Project: Testing Practice 的 Assignment 第一句就回指它。ESLint 用户另有一条官方指令：test、expect 这些 Jest 全局变量要在测试文件里显式 import，防止 linting 按 no-undef 报错（Getting Started 教程的 Using ESLint 节）。',
          lessonId: 'node-path-javascript-testing-basics'
        },
        {
          q: '官方 guessingGame 反例里，哪些部分被明说不需要测？重构成 evaluateGuess 纯函数后带来哪两个好处？',
          options: ['prompt 和 alert 不需要测——它们是浏览器内建、外在于你的程序，写它们的人已经测过了；要测的是数字逻辑。好处：evaluateGuess 清晰的输入输出、不调用任何外部函数，好测；guessingGame 退化成薄交互层，好扩展——换 DOM 操纵、加多轮猜测都不用动逻辑', '所有部分都要测，包括 prompt 和 alert 的弹窗行为；重构后唯一好处是代码行数变少', '只有 alert 需要测；evaluateGuess 不需要测——因为它没有副作用所以不会被用到', 'magicNumber 需要测（验证它确实等于 22）；重构的好处是程序运行速度更快'],
          answer: 0,
          explain: '官方结论值得整句记住：如果一开始就用 TDD 写这个程序，它很可能天生就更像第二个例子——TDD 鼓励更好的程序架构，因为它鼓励你写纯函数。测试不只是验收工具，它在倒逼设计。',
          lessonId: 'node-path-javascript-more-testing'
        },
        {
          q: '紧耦合代码的两个解法是什么（注意官方给的排序）？官方的 mocking 例子解决什么麻烦？',
          options: ['第一是 mocking 一切依赖，第二是重写整个模块；例子演示怎么 mock 网络请求', '第一且最好——把依赖从代码里移除（重构成纯函数）；并不总是可行时第二——mocking：写一个「假」版本的函数，行为永远完全按你想要的来。官方例子：测一个从 DOM input 取信息的函数，不必真去搭网页、往 input 里动态插内容——造一个总返回特定值的假「取输入」函数，把它用进测试', '第一是跳过难测的部分，第二是只在真实浏览器里测；例子说明 DOM 完全无法测试', '第一是把测试与代码分文件存放，第二是集成测试；例子演示数据库的 mock'],
          answer: 1,
          explain: '官方把优先级排得很清楚：mocking 是第二选择，不是首选——能用设计解决的（拆纯函数）别用替身；mock 多了，测试测的是你的剧本而不是真实行为。Jest 的 Mock Functions 文档（Assignment 第 4 条，官方评价 really handy）就是第二解法的工具箱。',
          lessonId: 'node-path-javascript-more-testing'
        },
        {
          q: 'more-testing 开篇的基本概念「隔离（isolation）」说了什么？官方为什么紧接着承认它「并非总是可能或实际」？',
          options: ['一次只测一个方法；一个函数的测试理想上不依赖外部函数的正确行为（尤其当那函数在别处也被测着）。原因：测试失败时要尽快缩小失败原因——依赖链越长越难定位。官方承认不总是可能，因为真实代码里模块总要协作、依赖无法完全消除——隔离是方向不是教条：能拆的拆纯函数，拆不掉的用 mocking，剩下的接受', '一次可以测多个方法以提高效率；只有测试失败时才需要回头做隔离', '隔离指每个测试文件只能放一个测试用例；官方承认这不实际，所以放弃了这条要求', '隔离指测试不允许调用被测函数以外的任何函数；做不到的测试就不要写'],
          answer: 0,
          explain: '隔离与「只测公开的函数」（testing-practice 的官方哲学）是测试策略的一体两面：前者管单个测试的依赖纯度，后者管测试的覆盖面取舍。Setup and Teardown（Assignment 第 3 条）是它的配套工具：每条测试前重置现场，测试之间互不污染。',
          lessonId: 'node-path-javascript-more-testing'
        }
      ]
    },
    {
      unitId: 'javascript/a-bit-of-computer-science',
      zh: '算法之塔',
      desc: '「一点计算机科学」章节综合预检（本站已开放 11 课）：学算法的三条理由、递归的定义与 while 循环自检信号、步数模型与 Big O 的度量对象、Omega 为什么不被认为有用、辅助空间分析的两种口径、数据结构的权衡三问、队列与栈对 BFS/DFS 的配对、hash map 从键到桶的链路与冲突机制。',
      questions: [
        {
          q: '官方引言课的「纽约时报」类比想说明什么？它给出「为什么前端开发者要学 CS 概念」的哪三条理由？',
          options: ['说明 web 开发就是编辑报纸——排版比逻辑重要；理由只有面试一条', '能写小学水平的英语不代表能编辑纽约时报——「能跑通的代码」与「解得漂亮的代码」之间隔着系统训练。三条理由：有些问题需要数组和迭代器之外的工具（别人已想出好方法，别重新发明轮子）；当网站非常成功、开始处理大数据集时解法质量尤其重要；求职面试会被直接问到这些。官方同时放平预期：贴实用面走、不深陷理论', '说明学 CS 必须读完计算机科学学位；理由是课程会考数学证明', '说明蛮力解法都是错的；理由是所有公司都要求手写算法'],
          answer: 1,
          explain: '这一课的定位是「动机 + 词条」：lesson overview 只有两条（了解算法、弄清什么是伪代码），全部由 Assignment 的五份资料承担（四支视频 + 一条 Quora 回答）。官方对「蛮力 vs WELL」的分界是：能跑通不等于解得好——本章之后的每个项目都在练「WELL」。',
          lessonId: 'javascript-a-very-brief-intro-to-cs'
        },
        {
          q: '官方给递归下的一句话定义是什么？「为什么我刚才不就用个 while 循环」这句自检信号是什么意思？官方还有什么内存警告？',
          options: ['递归是必须掌握的日常工具，所有问题都应优先用递归；while 循环是过时的写法', '官方定义一句话：递归就是函数调用自己的想法——仅此而已。自检信号（官方原话）：如果你发现自己在说「为什么我刚才不就用个 while 循环？」——那你大概真该用循环；任何能用递归解决的问题也能用迭代器解决。预期校准：你不会经常以递归方案收尾，但要培养出「什么时候递归可能是好主意」的手感。内存警告：有些问题会拆出太多太多的块、彻底压垮计算机内存——要有平衡', '递归只能用于数学计算；while 循环能解决一切问题所以递归没有存在价值', '官方定义：递归就是循环的别名；自检信号是提醒你循环写多了要休息'],
          answer: 1,
          explain: '「用对的和用错的方式」是官方给这一课定的调子。overview 里的递归深度与 stack overflow（概念，不是那个网站）由 Assignment 第 1 条 javascript.info 的递归文展开——每层调用占一帧栈，深度失控的终点就是栈溢出；官方 Tip 还叮嘱：逐层追踪递归别用肉眼，用调试器的调用栈面板。',
          lessonId: 'javascript-recursive-methods'
        },
        {
          q: '为什么官方说永远不能用「执行花了多久」度量算法效率？oddNumbersLessThanTen 数出的 34 步为什么「对比较算法没实际帮助」？Big O 真正度量的是什么？',
          options: ['因为计时需要专业工具；34 步数错了应该是 30 步；Big O 度量代码行数', '时长不稳定：同一程序重跑可能更快或更慢（取决于电脑当时在忙什么）、换台机器又不同——混入太多与算法无关的因素。官方替代方案是数「步」（赋值、比较、输出各算一步）。34 步没用是因为：把硬编码的 10 换成参数 maxNumber 后，步数随外部输入变化——不存在能拿来比较的具体数字。Big O 度量的是：数据规模变化时步数如何变化（代码能不能 scale）', '时长其实可以用，只要多跑几次取平均；34 步对比较很有帮助；Big O 度量内存占用', '效率不需要度量；34 步只是官方的随堂练习；Big O 度量代码的执行速度上限'],
          answer: 1,
          explain: '步数模型是这一课的方法论地基：5 步的算法在同一台电脑上总是快过 20 步的——但精确数字会随输入漂移，所以要把问题升级为「步数怎么随数据长」，这正是渐近记号（Big O 上界/最坏、Omega 下界/最好、Theta 平均）登场的理由。',
          lessonId: 'javascript-time-complexity'
        },
        {
          q: 'O(log N) 的增长画面是什么？Omega 记号为什么「不被认为那么有用」？本站为什么主要用 Big O（最坏情形）？',
          options: ['O(log N) 是每步加一；Omega 无用是因为数学太难；Big O 只是习惯叫法没有实质理由', 'O(log N)：数据翻倍、步数只 +1（官方表：Size 从 16 到 32 步数只从 5 到 6）——二分查找每步用中位公式砍掉一半数组，就是这个机制。Omega（最好情形）不被认为有用：官方 findValue 例子里最好情形是目标恰为数组第一个（一步 O(1)）——但目标很少恰好排在第一位，它给不出「算法会怎么 scale」的任何信息。选 Big O 的理由：用最坏情形能确保算法在所有结果下可扩展——输入突然从 10 个变一百万个时，代码不能锁死、不让用户抓狂', 'O(log N) 比 O(1) 还快；Omega 无用是因为最好情形不存在；Big O 悲观所以安全', 'O(log N) 是对数级但只适用于链表；Omega 无用是因为它等于 Big O；最坏情形只是面试官的偏好'],
          answer: 1,
          explain: '二分查找的前提别忘了（官方明文）：只对已排序数组有效——无序数组砍掉的一半里可能正藏着目标。八个记号的快慢序：O(1)、O(log N)、O(N)、O(N log N)、O(n²)、O(n³)、O(2ⁿ)、O(N!)——merge sort 正是 O(N log N)（对半拆 + 每半线性合并）。',
          lessonId: 'javascript-time-complexity'
        },
        {
          q: '什么是辅助空间分析？官方 squareNumsInPlace 与 squareNumsNewArr 的对照说明它解决什么问题？官方收尾的「平衡术」建议什么？',
          options: ['辅助空间分析把输入与额外空间都算进去；两个函数一个 O(1) 一个 O(N)；收尾建议性能永远优先于可读性', '辅助空间分析 = 只算算法额外（extra）占用的空间、输入不计入（输入数组的创建属于调用前分配它的外部例程）。对照说明的问题：两个函数传统空间分析都是 O(N)——说不清「原地改输入数组」与「map 建新数组」之间非常明显的内存用法差别；辅助口径一眼分明：InPlace 版 O(1) 额外、NewArr 版 O(N) 额外。收尾平衡术（官方建议）：可读性优先——性能有明确影响时，再为更好的效率重构（memoization 这类空间换时间的交易要想清楚值不值）', '辅助空间分析只算输入不算临时变量；两个函数都是 O(1)；收尾建议全部用 memoization', '辅助空间就是磁盘占用；对照说明递归比循环省内存；收尾建议先优化再考虑可读性'],
          answer: 1,
          explain: '空间复杂度的构成 = 算法输入占的空间 + 辅助空间（执行期间的临时变量等）。度量方法与时间完全相同：算所有步骤（含常数）再丢常数——线性内存 + 3 个临时变量 = O(N) + 3 → O(N)。多数数据结构共享 O(N) 空间；回看 Big-O cheat sheet 的数据结构与排序区，空间列一目了然。',
          lessonId: 'javascript-space-complexity'
        },
        {
          q: '官方说数据结构之间的差别「通常在于权衡」——权衡的是哪三件事？队列与栈分别与哪种搜索算法配对、为什么？',
          options: ['权衡的是代码行数、变量命名与注释密度；队列配 DFS、栈配 BFS——随机分配没有道理', '权衡三问（官方原话）：最初填充结构要多久、添加或查找元素要多久、结构在内存里占多大。配对（官方在 Assignment 点名）：队列与栈的原理分别是广度优先搜索与深度优先搜索使用的概念——队列先进先出：先发现的先处理，天然长成「一层扫完再下一层」的 BFS；栈后进先出：最后发现的先处理，长成「一条路走到底再回头」的 DFS', '权衡的是流行度、社区规模与学习曲线；两者都配 BFS——栈只是队列的别名', '权衡三问指时间复杂度的三个等级；队列配排序、栈配搜索'],
          answer: 1,
          explain: '这个配对在后面两个项目里具象化：二叉搜索树项目的 levelOrderForEach 官方提示用数组充当队列；骑士之旅官方说 DFS 与 BFS 都可行——但其中一个要你处理「陷入无尽循环」的可能性（马步图有环：不记录已访问顶点就会在两格间无限往返）。',
          lessonId: 'javascript-common-data-structures-and-algorithms'
        },
        {
          q: 'hash map 存值与取值各走哪几步？取值时已经用散列码定位到了桶，为什么官方还要求「比较节点的键」？',
          options: ['存值只需一步：把键值对扔进数组末尾；取值遍历整个数组找键——不需要散列', '存值三步（官方 Fred/Smith 示范）：把键传进散列函数得散列码（385）→ 找到索引 385 的桶 → 存入键值对；取值四步：散列键算索引 → 桶不空则进入 → 比较节点的键与查询键 → 相同返回值否则 null。还要比键的原因（官方自问自答）：散列码只是位置——不同的键可能生成相同的散列码（冲突）；桶里的链表住多个节点时，键才是唯一身份证明', '散列码就是键的另一种写法，定位到桶即找到值；比键是历史遗留的多余步骤', '存值先排序再二分；比键是为了验证散列函数有没有 bug'],
          answer: 1,
          explain: '官方在这一点上还顺手解释了 Set：桶里已有同键 Fred 就比键确认、覆盖旧值——「这就是 Set 里只能有唯一值的原理」；Set 与 hash map 的关键差别是节点只有键、没有值。取值失败返回 null、散列函数必须是纯函数（同输入永远同输出、无随机成分）也都是官方明文。',
          lessonId: 'javascript-hashmap-data-structure'
        },
        {
          q: '冲突为什么无法完全消除？官方的处理与增长机制是什么？hash map 的平均 O(1) 与最坏 O(n) 各发生在什么条件下？',
          options: ['冲突能完全消除——只要散列函数写得够好；不需要增长机制；平均与最坏都是 O(1)', '无法消除：桶的数量有限而键的空间无限——节点数超过桶数时必然有桶住多个节点（鸽笼原理，官方 Additional Resources 给的数学根据）。处理：每个桶是一条链表——空桶插头节点、已有头则顺链表加到末尾；最小化靠好散列函数（质数 31 乘加：降低散列码被桶长度整除的可能）。增长：跟踪 capacity（起步 16，2 的幂利于位操作）与 load factor（各语言实现取 0.75–1）——乘积是阈值（16×0.8=12.8，第 13 条触发），超过就建双倍大小新数组、把所有节点重新散列迁入（增长恒为 O(n)）。复杂度：平均 O(1)（散列分布均匀，数组索引直达）；最坏 O(n)（所有数据散列到完全相同的桶——操作退化成遍历该桶的链表）', '冲突靠重启程序消除；增长就是删掉一半旧数据；最坏 O(n) 发生在键太长时', '鸽笼原理说明冲突永远只有一个；load factor 越低越好所以应设为 0.01；最坏情形不存在'],
          answer: 1,
          explain: 'load factor 的两头代价官方都点了：设太低——空桶太多耗内存、O(n) 的扩容太频繁；设太高——重定尺寸前冲突大量堆积、操作向最坏 O(n) 退化。这两句正是下一课 Project: HashMap 测试流程（12 组填满恰好 0.75 → 第 13 条触发翻倍 → 负载回落、条目均匀散布）的理论依据。',
          lessonId: 'javascript-hashmap-data-structure'
        }
      ]
    },
    /* ---------- World 3 批次 4 阶段 4（2026-09-27，v4.11.26，通宵轮）：「Git 进阶」章节
     * 3/3 全开即配（用户指令口径）——「时间线回廊」6 题（deeper-look 2 + remotes 2 +
     * real-world 2）。「JavaScript 收尾」章节不配 Boss：本章 2 课中 battleship 为
     * Project 课不出题、conclusion 为约 1.2KB 的结语祝贺信（官方无 Assignment 节、
     * 无知识点可考）——按「单课章节不配」与知识点判断口径，收组批无新增可出题课。
     * World 3 全 41 课就此收组。 ---------- */
    {
      unitId: 'javascript/intermediate-git',
      zh: '时间线回廊',
      desc: '「Git 进阶」章节综合预检（本站已开放 3 课）：分支与提交的指针模型、reset 三档各自动了哪几层、amend 与 rebase 的协作军规、force push 的危险与合法场景、revert 与 reset 的分界、开源工作流的三角关系与脏分支哲学、没有 issue 不开 PR 的官方红线。',
      questions: [
        {
          q: '官方课程里，「分支」到底是什么？一条历史链是怎么串起来的？',
          options: ['一组提交的集合——分支就是保存这条线上所有提交的容器', '指向单个提交的指针——每个提交同时指向它前面的提交，历史链靠提交逐个回指串起来；HEAD 是跟踪「你当前在哪个分支」的特殊指针，指向当前分支最近的提交', '一份独立的工作目录副本——建分支就是把整套文件复制一份', '一个快照日志文件——分支记录每次改动的差异清单'],
          answer: 1,
          explain: '官方在指针一节专门纠偏「分支是一组提交」的直觉：分支其实只是指向单个提交的指针，就像手指指着链条上的某一环；提交是快照、也是指向前一个提交的指针。git rebase -i HEAD~2 能工作正是靠这个模型——从 HEAD 出发沿指针链走两步。',
          lessonId: 'javascript-a-deeper-look-at-git'
        },
        {
          q: 'git reset 的三档（--soft / 默认 / --hard）分别动了哪几层？官方给 --soft 的类比是什么？',
          options: ['--soft 只移 HEAD、暂存区和工作目录都不动——官方类比「更强大的 amend」（回退多个提交、把改动合成一个新提交）；默认档移 HEAD 并用新指向更新暂存区（改动退回未暂存、文件内容还在）——拆分提交的原理；--hard 三层全动、连工作目录一起覆盖——破坏性命令，可能毁数据', '三档都只动 HEAD，区别只是要不要保留备份文件', '--soft 是最危险的一档——它会直接删除提交记录；--hard 反而最安全因为它会先询问', '默认档只动工作目录、不碰暂存区；--hard 只动暂存区、不碰工作目录'],
          answer: 0,
          explain: 'reset 是同一条三步流水线：移 HEAD → 更新暂存区 → 覆盖工作目录，标志位决定做到第几步停。官方对 --hard 的纪律：必须确切知道为什么用它，团队共享仓库里还要让同事知情。',
          lessonId: 'javascript-a-deeper-look-at-git'
        },
        {
          q: 'git push --force 为什么在协作中危险？官方给出的合法场景与更安全的替代是什么？',
          options: ['它会让远端服务器变慢，任何场景都应避免', '它会加密远端历史，需要管理员解密', '它用你的本地历史覆写远程仓库——协作者已推送的提交可能直接消失（官方实验里第四个文件本地远端双双蒸发）。合法场景：更新 pull request（最常见）、清除误传的敏感信息；替代：优先 --force-with-lease——目标分支被别人更新过就报错拒绝', '它会把本地所有分支全部上传造成仓库膨胀，合法场景是多分支同步'],
          answer: 2,
          explain: '官方的定性是「非常危险的命令，与他人协作时必须谨慎使用」。--force-with-lease 是 fail-safe（有些公司设为默认）：检查目标分支是否被更新过，更新过就拒绝——给你先 fetch 的机会。最佳实践第 3 条：用 -f 应该让你害怕，必须有非常好的理由。',
          lessonId: 'javascript-working-with-remotes'
        },
        {
          q: '已推送的提交写错了想撤销，官方指定的安全做法是什么？为什么？',
          options: ['git reset --hard 后强推——直接抹掉最干净', 'git revert——生成一个反转原提交改动的新提交：历史只增不改、正常 push 即可、对协作者零风险；军规原文：reset 绝不用于已推送的提交', 'git commit --amend 改一下信息——改信息就等于撤销', '删掉分支重建——重开一条最省事'],
          answer: 1,
          explain: 'revert 与 reset 的分界线只有一条：历史发布了吗？发布了就用 revert（只增不改），没发布才轮到 reset。官方还配了「Git Revert vs Git Reset」视频演示两种命令的历史形态差异。',
          lessonId: 'javascript-working-with-remotes'
        },
        {
          q: '官方开源工作流里，「把本地 main 合进你的功能分支」这一步（看似方向反了）的目的是什么？',
          options: ['把功能代码同步进 main，为正式发布做准备', '功能分支提交太少，借 main 的提交凑数', '你的功能分支是「脏的」——不知道有没有潜伏冲突；先让 main 合进脏分支、把冲突在自己这边消化掉，之后 PR 把功能合入 main 时才是干净无冲突的合并', '测试 merge 命令是否正常工作，没有实际意义'],
          answer: 2,
          explain: '官方原话：你确实最终要把功能分支合进 main，但还不是现在——任何时候要把「资历更深」的分支合进来，都希望是干净、无冲突的合并。这也是维护者体验的关键：冲突在贡献者这边解决，PR 才能一键合并。',
          lessonId: 'javascript-using-git-in-the-real-world'
        },
        {
          q: '官方对「没有被指派 issue 的人」划了什么 critical 级红线？',
          options: ['可以开 PR，但必须标注「练习」字样', '停在 push 那一步——不要开测试/练习 PR：此类 PR 会被视为 spam、由维护者不经评审直接关闭；想真贡献先去 issue 列表认领被指派的 issue', '可以直接给维护者发邮件提交补丁', '只能改文档不能改代码——改代码需要 issue'],
          answer: 1,
          explain: '官方在 Sending your pull request 一节的 critical 警告块原话：如果你没有被指派要做的 issue，停在这里。这条纪律保护的是维护者最稀缺的评审带宽——PR 必须对应被认领的 issue，改动才是「合法的」。',
          lessonId: 'javascript-using-git-in-the-real-world'
        }
      ]
    },
    /* ---------- World 4 批次 5 阶段 1（2026-09-27，v4.11.27，通宵轮）：「动画」章节
     * 3/3 全开即配（批次指令口径）——「幻化剧场」7 题（transforms 3 + transitions 2 +
     * keyframes 2）。unitId 经 pathBossUnitId('advanced-html-and-css', 'animation')
     * 构造，与阶段 0 前缀约定一致（World 4 首个 Boss 单元）。题源限本章 3 门已开放课，
     * 不给成品答案。 ---------- */
    {
      unitId: 'advanced-html-and-css/animation',
      zh: '幻化剧场',
      desc: '「动画」章节综合预检（本站已开放 3 课）：链式变换的坐标系语义与 perspective 例外、transform 的适用例外与合成阶段性能优势、transition 简写四子属性与两个时间值的顺序、层叠上下文的 repaint 连坐、@keyframes 百分比时间轴与「一次 iteration = 单向周期」、动画与过渡的三大区别与选型边界。',
      questions: [
        {
          q: '官方对照实验：红盒写 rotate(45deg) translate(200%)、蓝盒写 translate(200%) rotate(45deg)，两盒起点相同。结果与原因，哪个说法对？',
          options: ['两盒终点相同——函数组合一样，顺序不影响结果', '蓝盒先沿原始 X 轴平移到正右方、再原地旋转 45 度；红盒先转 45 度把自己的 X 轴转斜了、再沿斜轴平移落到右下方——链式变换从左到右依次生效，后一个函数作用在「前一个变换之后」的坐标系上', '红盒停在正右方、蓝盒落到右下方——旋转永远先于平移执行', '两盒都落到右下方，只是角度不同——平移顺序只影响最终旋转的角度'],
          answer: 1,
          explain: '链式变换不满足交换律：顺序即语义，每个函数接手的是前一个已经改过的坐标系。想「先挪再转」就把 translate 写前面。顺序的唯一例外是 perspective——与多个函数同写时必须放最前（最左）。',
          lessonId: 'node-path-advanced-html-and-css-transforms'
        },
        {
          q: '给一个元素写 transform 毫无反应，官方课里点名的「例外」是哪种情况？',
          options: ['设置了 position: static 的元素不能变换', '设置了宽高的元素不能变换', '非替换行内元素（span、b、em 这类内容就在文档里的元素）不支持 transform，<col> 与 <colgroup> 同理——把 display 改成 inline-block 或 block 就能变换', '只有 img、video 这类替换元素支持 transform，其余都无效'],
          answer: 2,
          explain: '官方口径：几乎所有元素都能应用 transform，例外只有 col、colgroup 与非替换行内元素。「非替换」指内容包含在 HTML 文档里（span/b/em）；替换元素（video/iframe/img）的内容在文档之外、恰恰是支持变换的。不必背清单，transform 不生效时先查这一条。',
          lessonId: 'node-path-advanced-html-and-css-transforms'
        },
        {
          q: '为什么性能敏感的动画，官方建议只动 opacity 与 transform？',
          options: ['transform 在像素管线的合成（composite）阶段生效——不触发布局也不触发绘制，还能经 GPU 硬件加速；而 background-color 这类属性要重绘像素，本身就昂贵', '因为 transform 是唯一可以动画的属性，其他属性都无法插值', '因为 opacity 与 transform 的 CSS 写法字节数最少，解析更快', '因为其他属性都会触发整页回流，而 transform 在任何情况下都不触发重绘'],
          answer: 0,
          explain: '管线分工决定代价：改几何触发 layout、改颜色触发 paint、transform 与 opacity 只走 composite。官方连本课第一个 background-color 过渡例子都自我指认「那本身已经是昂贵的操作」；CSS Triggers 对照表逐属性列了各自触发哪些阶段，是这条建议的账本。',
          lessonId: 'node-path-advanced-html-and-css-transforms'
        },
        {
          q: 'transition: background-color 0.25s ease-out 1s 悬停后的实际行为是？',
          options: ['延迟 0.25 秒后开始、过渡 1 秒——写在后面的时间值是时长', '过渡时长 0.25 秒、延迟 1 秒——简写里两个时间值第一个是 duration、第二个是 delay，手感是「等 1 秒，然后用四分之一秒完成变色」', '两个时间值取平均，过渡 0.625 秒', '语法错误——transition 简写只允许一个时间值'],
          answer: 1,
          explain: 'duration 永远在 delay 之前，这是简写的固定约定。写反不报错、但动画时长与等待时间整个互换——手感完全不对还很难看出原因，是过渡最经典的坑之一。',
          lessonId: 'node-path-advanced-html-and-css-transitions'
        },
        {
          q: '官方性能小节说过渡 transform 要留意「层叠上下文」。下面哪个说法与课的内容一致？',
          options: ['层叠上下文由 z-index 创建，只有设了 z-index 的元素才参与层叠', '层叠上下文越多，浏览器合成越快——上下文是加速机制', 'transform、opacity、filter 等属性都会触发新层叠上下文的创建；上下文堆多了，渲染一个变换时不只 repaint 目标元素，还要 repaint 同一上下文里叠在它上面的每个元素——放任不管，丝滑的过渡会变慢变粗糙', '层叠上下文是过渡系统的缓存机制，与 z-index、repaint 无关'],
          answer: 2,
          explain: '元素的层叠位置只相对同一上下文内的其他元素比较；z-index 控制重叠时的前后，但创建上下文的不止 z-index。深入阅读是 Assignment 指定的 Josh Comeau 专文（What The Heck, z-index??），还可以用 CSS Stacking Context inspector 扩展把页面上看不见的分层画出来。',
          lessonId: 'node-path-advanced-html-and-css-transitions'
        },
        {
          q: '@keyframes 红→绿的动画设 animation-iteration-count: 2、animation-direction: alternate，元素实际怎么动？',
          options: ['红→绿→红算一次 iteration，两次 iteration 共播放四遍单向', '红→绿（第一周期），再绿→红（第二周期反向播放），然后停——一次 iteration 是「从头到尾的单向周期」，不是一个来回', '红→绿后跳回红色再播一遍，最后停在绿色', '红→绿播放两遍，最后停在绿色'],
          answer: 1,
          explain: '官方专门设防的误区：别把一次 iteration 想成「一个完整循环（来回）」——它是从头到尾的单个周期，count 数的就是单向周期数。alternate 让周期结束平滑折返（绿→红），normal 则跳回起点重播。这个区分数错，多动画对齐节奏时就会差半拍。',
          lessonId: 'node-path-advanced-html-and-css-keyframes'
        },
        {
          q: '关于「动画 vs 过渡」，哪个说法符合官方课？',
          options: ['过渡需要触发器（伪类或 JS 增删类），动画不需要——定义好就按指示自己跑；且动画是显式为循环设计的，过渡能循环但不是为此设计的', '动画也必须由 :hover 触发，否则不会播放', '过渡能实现动画的一切效果，动画只是语法糖', '动画更强大，所以一切过渡都应一律改用动画实现'],
          answer: 0,
          explain: '三大区别：循环（动画为此而生）、触发（动画不需要触发器）、灵活性（过渡是 A 到 B 的直线，timing-function 只调节奏；动画用关键帧控制整段旅程）。选型上官方很务实：active 时改个透明度，上动画是杀鸡用牛刀——两态切换用过渡，复杂编排才用动画。',
          lessonId: 'node-path-advanced-html-and-css-keyframes'
        }
      ]
    },
    /* ---------- World 4 批次 5 阶段 2（2026-09-27，v4.11.28）：accessibility「无障碍」章节
     * 8/8 全开即配（批次指令口径）——「回音廊道」7 题（introduction / wcag /
     * semantic-html / accessible-colors / keyboard-navigation / meaningful-text /
     * wai-aria 各 1；auditing 为工具操作课、知识点已被前七题的「验证视角」覆盖不单独
     * 出题）。unitId 经 pathBossUnitId('advanced-html-and-css', 'accessibility')
     * 构造，前缀约定沿用。题源限本章 8 课（全开）、不给成品答案。 ---------- */
    {
      unitId: 'advanced-html-and-css/accessibility',
      zh: '回音廊道',
      desc: '「无障碍」章节综合预检（本站已开放 8 课）：残障与情境限制的分类、POUR 四原则、七个地标、对比度阈值、隐藏内容的正解、装饰图的 alt、ARIA 优先级——全部改写自本站已讲解并考核过的知识点，不给成品答案。',
      questions: [
        {
          q: '一位手臂骨折的用户暂时无法使用鼠标，只能用键盘操作网页。按官方课的分类，这属于哪种情况？',
          options: ['永久残障（physical/motor disability）', '临时残障（temporary disability）', '情境限制（situational limitation）', '老年能力变化（changing abilities）'],
          answer: 1,
          explain: '骨折会痊愈，所以是临时残障。官方分类：残障可以是永久的（全盲、全聋）或临时的（骨折的手臂）；情境限制则是特定场景才出现的障碍（强光下看手机、单手操作、慢网络）。三者对网站提出的要求高度重叠——为残障做的设计同时服务另外两类人。',
          lessonId: 'node-path-advanced-html-and-css-introduction-to-web-accessibility'
        },
        {
          q: '一个下拉菜单只在鼠标悬停时展开、键盘焦点移到菜单项上时不展开。按 WCAG 四大原则（POUR），它主要违反哪一条？',
          options: ['可操作（Operable）——界面不得要求用户做不到的交互', '可感知（Perceivable）——用户无法感知菜单的存在', '可理解（Understandable）——菜单的用法难以理解', '健壮（Robust）——菜单不兼容辅助技术'],
          answer: 0,
          explain: '这正是官方给「可操作」原则举的反例：用户必须能够操作界面与导航，且界面不得要求用户无法完成的交互（这里键盘用户无法触发悬停）。可感知的官方反例是浅底浅字；可理解的反例是「Error 113: Bad data」式报错。',
          lessonId: 'node-path-advanced-html-and-css-the-web-content-accessibility-guidelines-wcag'
        },
        {
          q: '官方课列出了定义页面地标（landmark）区域的七个原生 HTML 元素。下面哪个不在其中？',
          options: ['aside', 'div', 'main', 'form'],
          answer: 1,
          explain: '七个地标元素：aside、footer、form、header、main、nav、section。div 语义中性——自身无含义、不向辅助技术提供上下文，这正是「全 div 页面无法按地标跳读」的原因；它的正当用途是通用容器（布局、通用文本）。',
          lessonId: 'node-path-advanced-html-and-css-semantic-html'
        },
        {
          q: '按 WCAG AA 级，正常文本与大号文本的对比度最低要求分别是多少？',
          options: ['3:1 与 2:1', '7:1 与 4.5:1', '4.5:1 与 3:1', '4.5:1 与 7:1'],
          answer: 2,
          explain: 'AA 级（行业默认目标）：正常文本至少 4.5:1、大号文本至少 3:1；7:1 与 4.5:1 那组是 AAA 级（增强档，不建议全站追求）。大号文本的界线：字号至少 18pt/24px，粗体至少 14pt/18.66px。数字不用背——WebAIM Contrast Checker 替你算。',
          lessonId: 'node-path-advanced-html-and-css-accessible-colors'
        },
        {
          q: '一个未展开的下拉菜单需要隐藏。官方课推荐的「正解」是哪种做法？',
          options: ['给菜单里每个子项加 tabindex="-1"', '给菜单容器加 display: none 或 visibility: hidden', '把菜单移到屏幕外（position 绝对定位到 -9999px）', '把菜单 opacity 降到 0'],
          answer: 1,
          explain: '容器级 display:none / visibility:hidden 一次解决两个世界：既移出 Tab 顺序（键盘焦点进不去）、也不被辅助技术播报。tabindex=-1 只挡住键盘、其他辅助技术仍能读到（部分修复）；移出屏幕与 opacity:0 则键盘照样 Tab 得进去——焦点「消失」在看不见的元素里。',
          lessonId: 'node-path-advanced-html-and-css-keyboard-navigation'
        },
        {
          q: '页面里有一张纯装饰性的背景插图（用户不需要知道它的存在）。它的 alt 属性应该怎么处理？',
          options: ['省略 alt 属性不写', '写 alt="装饰图片" 说明用途', '写空字符串 alt=""', '写图片文件名当 alt'],
          answer: 2,
          explain: '装饰图永远用空字符串 alt=""（官方称 null 值）：明确告诉辅助技术「跳过我」。省略 alt 反而更糟——图片的存在仍可能被播报（文件名是随机字符串时尤其莫名其妙）；写「装饰图片」等于把多余的播报强加给用户。内容图才写描述（播报为「Odin，图形」）。',
          lessonId: 'node-path-advanced-html-and-css-meaningful-text'
        },
        {
          q: '一个元素同时写了 aria-label="关闭" 与 aria-labelledby="title-id"，屏幕阅读器最终播报的无障碍名称由谁决定？',
          options: ['aria-label——字符串值最直接', 'aria-labelledby——它的覆盖优先级更高', '两者拼接：先 label 后 labelledby', '取决于谁写在 HTML 后面'],
          answer: 1,
          explain: '覆盖链：aria-labelledby > aria-label > 原生标签。labelledby 拼接被引用 id 元素的文本（可多引用、可自引用，引用目标可视觉隐藏）；aria-label 直接用字符串覆盖原生标签。另外记住 aria-label 对 div/span 这类无角色元素无效——先有角色，名称才有处安放。',
          lessonId: 'node-path-advanced-html-and-css-wai-aria'
        }
      ]
    },
    /* ---------- World 4 批次 5 阶段 3（2026-09-27，v4.11.29，World 4 收组）：
     * responsive-design「响应式设计」章节 5/5 全开即配（批次指令口径）——
     * 「千形台」7 题（introduction 1 / natural-responsiveness 2 /
     * responsive-images 2 / media-queries 2；homepage 为 Project 课不出题——
     * 全站 Project 课不出 Boss 题纪律，且其知识点已由前四课覆盖）。unitId 经
     * pathBossUnitId('advanced-html-and-css', 'responsive-design') 构造，前缀
     * 约定沿用。题源限本章 5 课（全开）、全部改写自本站已讲解并考核过的
     * 知识点，不给成品答案。**World 4 全 16 课就此收组，全站 20 个 Boss 单元**。 ---------- */
    {
      unitId: 'advanced-html-and-css/responsive-design',
      zh: '千形台',
      desc: '「响应式设计」章节综合预检（本站已开放 5 课）：320px 下限、viewport meta 的两个值、固定宽高的替代、两族图片适配工具的分工、max-width 查询的方向、断点的官方口径——全部改写自本站已讲解并考核过的知识点，不给成品答案。',
      questions: [
        {
          q: '官方课说响应式布局的可靠宽度下限取 320px。这个数的依据是什么？',
          options: ['iPhone 首代机型的屏幕宽度', '常见流通中最小的手机很少窄过这个宽度', 'W3C 规范规定的最小视口', '主流 CSS 框架的默认断点'],
          answer: 1,
          explain: '官方口径：常见流通中最小的手机很少窄过 320px，所以它是可靠的下限目标——网站在 320px 宽能用，就应该能在任何小设备上用。它不是规范值也不是某代机型的精确宽度，而是工程上的保守下界；上限则用「内容 max-width + 居中」兜底。',
          lessonId: 'node-path-advanced-html-and-css-introduction-to-responsive-design'
        },
        {
          q: 'viewport meta 标签 content="width=device-width, initial-scale=1" 的两个值分别在做什么？',
          options: ['前者把布局视口设为设备宽度，后者设初始缩放 100%', '前者设初始缩放，后者设视口宽度', '两者都在禁止用户缩放页面', '前者针对横屏，后者针对竖屏'],
          answer: 0,
          explain: 'width=device-width 把页面初始宽度设为实际设备宽度——不再让手机浏览器模拟一块大屏再整体缩小（早期手机浏览器因多数网站没优化小屏而采用的历史行为）；initial-scale=1 声明初始缩放 100%。这行标签几乎每个项目都要放进 head。',
          lessonId: 'node-path-advanced-html-and-css-natural-responsiveness'
        },
        {
          q: '按官方课，下面哪种场景用固定宽度是合适的？',
          options: ['文章正文的主容器', '页面顶部的英雄区大图', '一个 32px 的导航图标', '响应式卡片网格的每张卡片'],
          answer: 2,
          explain: '官方的经验法则：宽度越小，写死越可接受——32px 图标用 max-width 没有意义，因为你本来就不想让它缩；250px 侧边栏也多半需要永远是 250px。大尺寸容器（正文、英雄区、卡片）则应该用 max-width / 百分比 / 弹性轨道保持可收缩。',
          lessonId: 'node-path-advanced-html-and-css-natural-responsiveness'
        },
        {
          q: '一张 img 设了 width: 200px; height: 200px 后显示变形（被拉宽压扁）。最可能的原因与修法？',
          options: ['没写 max-width——补上即可', 'height 必须写成 auto 才不变形——改 auto', '图片文件本身损坏——换文件', 'object-fit 缺省为 fill，把图拉伸填满指定尺寸——显式声明 cover 或 contain'],
          answer: 3,
          explain: 'object-fit 的默认值是 fill：把图拉伸到填满给定的宽高——比例失真。给了固定宽高就要显式声明 object-fit: cover（填满裁边）或 contain（完整留边）。height: auto 是「不同时钉宽高」的底线写法，但本题已经明确要 200×200 的固定框，正解是补 object-fit。',
          lessonId: 'node-path-advanced-html-and-css-responsive-images'
        },
        {
          q: 'background-size: cover 写在一个 <img> 标签上没有任何效果。为什么？',
          options: ['background-size 只作用于元素的 CSS 背景图，对 img 标签无效——img 要用 object-fit', 'cover 只能配 background-position 使用', 'img 标签必须先设 display: block', 'cover 是无效值，应为 contain'],
          answer: 0,
          explain: '两族工具作用对象不同：background-size / background-position 只认「容器 + background-image」的组合，对 <img> 无效；img 一族用 object-fit / object-position。两族共享 cover / contain 语义，选择依据只有一个——图是 background-image 放进来的还是 <img> 标签放进来的。',
          lessonId: 'node-path-advanced-html-and-css-responsive-images'
        },
        {
          q: '样式表里写着 @media (max-width: 600px) { … }。这组规则什么时候生效？',
          options: ['只在恰好 600px 宽的屏幕上', '在小于等于 600px 的视口上', '在大于等于 600px 的视口上', '只在打印预览里'],
          answer: 1,
          explain: 'max-width 查询在「小于等于」指定值的一切屏幕上生效——600px 以下用查询里的样式、以上用查询外的默认样式；方向相反的是 min-width（大于等于时生效）。另注意：浏览器缩放会改变有效分辨率——放大后的 1000px 窗口可能命中这个查询。',
          lessonId: 'node-path-advanced-html-and-css-media-queries'
        },
        {
          q: '关于断点该设在哪，官方课的口径是什么？',
          options: ['按 500 / 1000 / 2000px 三档各设一个，覆盖全部设备', '开局就为手机、平板、桌面各写一个媒体查询', '只设项目需要的断点——许多基础布局一个 500–600px 的移动断点就够', '断点必须取自设备市场份额统计'],
          answer: 2,
          explain: '官方明说：断点取值意见纷纭，参考区间（手机 500 以下、平板 500–1000、桌面以上、超宽 2000+）不意味着开局就按设备铺查询——每个项目需求不同，断点只设你需要的，真正的要点是「具体位置不重要，对你的项目合理就行」；同时要尽量少用媒体查询、更多依靠布局的天然弹性。',
          lessonId: 'node-path-advanced-html-and-css-media-queries'
        }
      ]
    },
    /* ---------- World 5 批次 6 阶段 1（2026-09-27，v4.11.30，World 5 开篇）：
     * react 课程「引言」章节 3/3 全开即配——「启航栈桥」6 题（how-this-course-
     * will-work 2 / introduction-to-react 2 / setting-up-a-react-environment 2）。
     * unitId 经 pathBossUnitId('react', 'introduction') 构造——与
     * javascript/introduction 及 Foundations 分组 id introduction 的三方撞名由
     * 前缀方案隔离（map-boss 精确清单断言在案）。
     * 「React 入门」章节 5/5 全开即配——「组件工坊」7 题（react-components 2 /
     * what-is-jsx 2 / passing-data 1 / rendering-techniques 1 / keys-in-react 1）。
     * 题源限两章 8 课（全开）、全部改写自本站已讲解并考核过的知识点，不给成品
     * 答案；answer 分布自查打散（6 题：2,0,1,3,2,0；7 题：2,0,2,3,1,0,3——
     * 千形台轮沉淀的收尾自查工序）。**全站 22 个 Boss 单元 140 题**。 ---------- */
    {
      unitId: 'react/introduction',
      zh: '启航栈桥',
      desc: '「引言」章节综合预检（本站已开放 3 课）：JavaScript 课程前置、库与框架的判据与 React 官方定位、学 React 的四条理由、Vite 脚手架命令与 CRA 弃用、main.jsx 的 createRoot 与 render 接线——全部改写自本站已讲解并考核过的知识点，不给成品答案。',
      questions: [
        {
          q: '官方在 React 课程开篇用「怎么强调都不为过」的措辞提出的硬性前置是什么？',
          options: ['至少熟练掌握一种 CSS 框架', '先学完 Node.js 后端开发', '完成 JavaScript 课程——因为 React 说到底就是原味 JavaScript', '先掌握 TypeScript 类型系统'],
          answer: 2,
          explain: '官方原话：在潜入 React 之前对 JavaScript 有扎实的理解，怎么强调都不为过——React 是库不是新语言，组件、props、状态拆开全是 JS 的函数、对象与闭包。JS 地基不牢，遇到问题会把「不会 JS」误诊成「不会 React」。',
          lessonId: 'node-path-react-new-how-this-course-will-work'
        },
        {
          q: '学到中途冒出「这用原味 JS 也能做，为什么还要学 React」的念头，官方的态度是什么？',
          options: ['很正常（官方原话 that\'s fine）——React 的收益在规模化后显现，官方举 Todo List 项目用 React 做核心功能通常更快的例子', '说明你不适合 React，应该回去重学 JS', '原味 JS 已被官方淘汰，不必纠结', '应该立即换学其他框架'],
          answer: 0,
          explain: '官方明确预告了这种怀疑并说这没问题（原话 that\'s fine）：小例子层面原味 JS 当然都能做，React 的价值要在组件规模化复用之后才显现——官方特意拿 JavaScript 课程里让人头疼的 Todo List 项目作对比：用 React 做核心功能通常花的时间更少。',
          lessonId: 'node-path-react-new-how-this-course-will-work'
        },
        {
          q: '区分「库」与「框架」的核心判据是什么？React 的官方定位是哪个？',
          options: ['看代码量大小；React 是框架', '谁调用谁：库被你的代码调用，框架调用你的代码（控制反转）；React 官方定位是库', '看是否免费开源；React 是框架', '看能否开发移动应用；React 是库'],
          answer: 1,
          explain: '判据是控制方向：库（React、lodash）由你的代码按需调用；框架（如 Angular）提供应用骨架、在需要处回调你的代码——控制反转。React 官方定义「用于 Web 与原生界面的库」：只管 UI 层，路由/状态管理/构建选型都留给生态，这也是它「不 opinionated」的含义。',
          lessonId: 'node-path-react-new-introduction-to-react'
        },
        {
          q: '官方给出的学 React 四条理由里，**不包括**下列哪条？',
          options: ['组件可复用', '流行度高、社区庞大，支持好', '不 opinionated——不强制特定设计模式、项目组织结构或逻辑', '自带路由与状态管理的完整解决方案'],
          answer: 3,
          explain: '官方四条理由：组件可复用、支持好（流行度 + 大社区）、不 opinionated、学习曲线较小（尤其有 JS/HTML/CSS 基础）。「自带路由与状态管理」恰恰是 React 没有的——它是库不是全家桶框架，那些缺口正是「React 生态」章节要做的第三方选型。',
          lessonId: 'node-path-react-new-introduction-to-react'
        },
        {
          q: '用 Vite 模板新建 React 项目，官方命令与前提是什么？',
          options: ['npx create-react-app my-app，前提是任意 Node 版本', 'vite create react my-first-react-app，前提是先全局安装 Webpack', 'npm create vite@latest my-first-react-app -- --template react，前提是使用最新 LTS 版 Node', 'npm install react my-first-react-app，前提是先安装 Yarn'],
          answer: 2,
          explain: '官方命令：npm create vite@latest <项目名> -- --template react；前提官方点名——用最新 LTS 版 Node，否则可能报错。选项一是 CRA：2016 年起的官方脚手架、2023 年初已弃用，老教程遍地但新项目不要用；已有克隆仓库的变体是用 . 作项目名就地初始化。',
          lessonId: 'node-path-react-new-setting-up-a-react-environment'
        },
        {
          q: 'main.jsx 里 createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>) 在做什么？',
          options: ['用 index.html 的 root 元素创建 React 根、把 App 组件树渲染进去——这是 React 应用与真实 DOM 的接线点', '创建并挂载一个 id 为 root 的新 DOM 节点', '把 JSX 编译成 HTML 字符串写入磁盘文件', '启动开发服务器并监听 5173 端口'],
          answer: 0,
          explain: 'createRoot(容器元素) 创建 React 应用的根（接线点），root.render() 把组件树（包在 StrictMode 开发期检查组件里的 App）渲染进去。编译是 Vite 构建层的事、开发服务器是 npm run dev 的事——main.jsx 只负责把 React 世界接到真实 DOM 上。',
          lessonId: 'node-path-react-new-setting-up-a-react-environment'
        }
      ]
    },
    {
      unitId: 'react/getting-started-with-react',
      zh: '组件工坊',
      desc: '「React 入门」章节综合预检（本站已开放 5 课）：组件大写命名的解析原理、导出后的接线链路、JSX 的语法糖本质、HTML 转 JSX 的规则改法、函数 props 传引用不带括号、逻辑与运算符左侧数字坑、渲染时现场生成 key 的反模式——全部改写自本站已讲解并考核过的知识点，不给成品答案。',
      questions: [
        {
          q: '为什么 React 组件必须大写命名（Greeting 而不是 greeting）？',
          options: ['团队代码风格约定，方便 lint 检查', '只有大写的组件才能接收 props', 'JSX 解析时 React 用首字母大小写区分 HTML 标签与组件实例——小写的 <greeting /> 会被当成没有特殊含义的普通 HTML 元素', '编译器的硬性要求：小写函数名不会被编译'],
          answer: 2,
          explain: '这是 React 的解析规则不是风格偏好：JSX 里小写开头被解释成 HTML 标签（greeting 不是合法标签就什么都不渲染、也不报错），大写开头才会去找对应的组件函数。官方特意让你做小写实验亲眼验证这一点。',
          lessonId: 'node-path-react-new-react-components'
        },
        {
          q: '新建的 Greeting.jsx 已经 export default 导出，页面上却什么都看不到——最可能缺了哪一步？',
          options: ['使用方（main.jsx）还要 import 它并在 render 的 JSX 里使用——export 只是「允许被用」', '需要重启开发服务器才能识别新文件', '组件文件必须放进 public 目录才会被加载', '需要先在 React Developer Tools 里注册组件'],
          answer: 0,
          explain: '组件住在专属文件里保持独立，用它的完整链路三步：文件里 export default → 使用方 import → JSX 里使用（官方演示是把 render 里的 <App /> 换成 <Greeting />）。少任何一环都看不到；Vite 的开发服务器对新文件是即时感知的，不需要重启。',
          lessonId: 'node-path-react-new-react-components'
        },
        {
          q: '「JSX 是 createElement 的语法糖」——编译之后 JSX 变成了什么？',
          options: ['HTML 字符串模板，由浏览器直接解析', '运行时才能解析的独立模板语言字节码', '描述 UI 的普通 JavaScript 对象——<h1>hi</h1> 底层是 createElement("h1", null, "hi") 的调用产物', 'CSS-in-JS 的样式对象'],
          answer: 2,
          explain: 'createElement 返回的 React 元素就是一个普通对象（plain object），JSX 编译到底就是普通 JS 对象——官方课文特意让你看了 console.log 一个 JSX 元素的打印结果。「React 就是 JS」在语法层的落地就是这句话。',
          lessonId: 'node-path-react-new-what-is-jsx'
        },
        {
          q: '把一段合法 HTML 改进 JSX，下列哪种改法是**错误**的？',
          options: ['多个并列元素用 <>...</>（Fragment）包成单根', 'class 属性改写成 className', '未闭合的 <input> 改成 <input />', 'stroke-width 改写成 stroke-Width（大写 W）'],
          answer: 3,
          explain: '驼峰是「首字母小写、后续单词首字母大写」：正确写法是 strokeWidth。前三项都是 JSX 三条规则的正解：单根（Fragment 不产生多余 DOM 节点）、class 是 JS 保留字改 className、所有标签显式闭合。',
          lessonId: 'node-path-react-new-what-is-jsx'
        },
        {
          q: 'handleClick={handleButtonClick} 与 handleClick={handleButtonClick()} 的区别是什么？',
          options: ['完全等价，写法偏好而已', '带括号的版本在按钮渲染期间就立刻执行了函数，把执行结果当 prop 传过去；不带括号传的才是函数引用、事件发生才调用', '不带括号的版本会在渲染时执行，带括号的传引用', '函数不能通过 props 传递，两种都错'],
          answer: 1,
          explain: 'JSX 大括号里是表达式：带括号 = 立刻执行（官方例子的表现是页面还没点就跳转了）；传引用才能在事件发生时调用。要带参数时包一层匿名函数：handleClick={() => handleButtonClick(url)}——交出去的仍是引用。这与 addEventListener 的同款陷阱一脉相承。',
          lessonId: 'node-path-react-new-passing-data-between-components'
        },
        {
          q: '{animals.length && <List animals={animals} />}——数组为空时页面会渲染出什么？',
          options: ['数字 0——逻辑与返回第一个假值，而 JSX 会渲染数字（false/null 才渲染为空）', '什么都不渲染', '渲染出 false 字样', '直接报错白屏'],
          answer: 0,
          explain: '这正是官方专门设警告块的坑（React 文档条件渲染页的 Pitfall 框）：length 为 0 时表达式返回 0，JSX 对 false/null 渲染为空、但数字 0 会照常渲染——页面上多出一个光秃秃的「0」。修法：animals.length > 0 && ... 把数字变成布尔，或改用三元。',
          lessonId: 'node-path-react-new-rendering-techniques'
        },
        {
          q: 'todos.map((todo) => <li key={crypto.randomUUID()}>{todo.task}</li>) 这段代码的问题在哪？',
          options: ['没有问题——randomUUID 保证全局唯一，是最佳 key 来源', 'key 必须是数字，应该改用数组 index', 'crypto 对象不能在 JSX 里使用，会抛异常', 'key 在渲染时现场生成——每次渲染每项都拿到新 key，所有项每次都被当成全新实例重建，跨渲染配对彻底失效；key 应从数据本身推出（构造数据时发好的 id）'],
          answer: 3,
          explain: '官方点名的反模式（Math.random() 同理）：key 的意义是跨渲染「认人」，现场生成等于每次渲染全员换脸——diff 退化成整列表重建、组件状态全部丢失。randomUUID 的正确位置在构造 todos 数组时（官方示例正是这么做的），渲染时引用 key={todo.id}。index 只在列表终生不变时才勉强可用。',
          lessonId: 'node-path-react-new-keys-in-react'
        }
      ]
    },
    /* ---------- World 5 批次 6 阶段 2（2026-09-28，v4.11.31）：
     * react 课程「状态与副作用」章节 5/5 全开即配——「潮汐观测所」7 题
     * （introduction-to-state 2 / more-on-state 3 / how-to-deal-with-side-effects 2；
     * **cv-application 与 memory-card 两门 Project 课不出题**——全站 Project 课
     * 不出 Boss 题纪律，题源限三门知识课）。unitId 经 pathBossUnitId('react',
     * 'states-and-effects') 构造（map-boss 负例名单本批已配后迁出）。
     * 「类组件」章节 2/2 全开——「齿轮档案厅」5 题（class-based-components 3 /
     * component-lifecycle-methods 2）。**该章配 Boss 的判据结论（用户指令：按知识点
     * 是否足够判断）**：两课均为知识课且知识点实打实可考（类组件语法四步 / this
     * 绑定两方案 / 生命周期四方法分工 / useEffect 四行对照），可支撑 5 题下限——
     * 与 finishing-up-with-javascript 不配的先例（2 课中 1 门 Project 不出题 + 1 门
     * 结语信无知识点，实际 0 课可出题）本质不同：那是「无可出题课」，这是「课少但
     * 知识点密度足」。answer 分布自查打散（7 题：2,0,3,1,2,0,3；5 题：1,3,0,2,1
     * ——千形台轮沉淀的收尾自查工序）。**全站 24 个 Boss 单元 152 题**。 ---------- */
    {
      unitId: 'react/states-and-effects',
      zh: '潮汐观测所',
      desc: '「状态与副作用」章节综合预检（本站已开放 5 课）：useState 的记忆模型与初始值生效时机、rerender 到调和到提交的链条、不可变更新的 Object.is 判定、状态快照与更新函数与批处理、StrictMode 双挂载与 cleanup、effect 的外部系统同步判据——全部改写自本站已讲解并考核过的知识点，不给成品答案；本章两门 Project 课（CV 简历应用 / 记忆卡片）不出题，题源限三门知识课。',
      questions: [
        {
          q: 'const [count, setCount] = useState(0) 里的初始值 0，在什么时候生效？',
          options: ['每次渲染都生效——组件函数重跑就会重新初始化', '只在组件被卸载后重新挂载时生效', '只在组件的第一次渲染时使用，之后的渲染直接忽略——最新状态由 React 负责追踪保管', '只在第一次调用 setCount 时生效'],
          answer: 2,
          explain: '初始值只管首渲染。之后每次重渲染组件函数虽然从头执行，但 useState 返回的是 React 保管的最新值——状态不住在函数作用域里，住在 React 那边。想「重置」是另一套动作：换 key 强制重建实例，或显式 set 回初始值。',
          lessonId: 'node-path-react-new-introduction-to-state'
        },
        {
          q: '调用 setCount(count + 1) 之后，React 内部按什么顺序做事？',
          options: ['重新执行整个组件函数（rerender）→ useState 返回最新值 → 生成新虚拟树并调和出最小变更集 → 提交到真实 DOM', '直接修改 count 变量，再局部更新显示它的那个 DOM 节点', '先把变更提交到 DOM，再重新执行组件函数核对一遍', '重建整个页面的所有组件，把 DOM 全量替换一遍'],
          answer: 0,
          explain: '这是「状态简介」课的机制主线：更新触发的是整个组件函数的重跑，界面 = f(最新状态)；调和（reconciliation）比对新旧虚拟树只把最小变更集写进真实 DOM——既不是就地改变量，也不是全量替换。',
          lessonId: 'node-path-react-new-introduction-to-state'
        },
        {
          q: 'handleIncreaseAge 里写 person.age = person.age + 1; setPerson(person)——为什么界面不更新？',
          options: ['语法错误，必须写 setPerson({ age: person.age + 1 })', '对象属性在任何情况下都不允许修改', '事件处理器里不允许读 person 的当前值', '原地变异后传回的是同一个对象引用——setState 用 Object.is() 比对新旧状态，引用相同被判「没变」，不保证触发重渲染'],
          answer: 3,
          explain: '不可变纪律的底层原因：setState 靠 Object.is() 判断新旧是否相同，引用类型比的是引用本身。正解是展开复制出新对象再改：setPerson({ ...person, age: person.age + 1 })——官方口径：永远把 state 当 immutable 对待。',
          lessonId: 'node-path-react-new-more-on-state'
        },
        {
          q: '点击处理器里 setPerson 调用前后各 console.log 一次 person——两行分别打印什么？',
          options: ['前一行旧值、后一行新值——set 立刻改变量', '两行都是同一个旧值——状态是本轮渲染的快照，新值要到下一次重渲染才出现', '两行都是新值——set 之前 React 已预更新', '后一行打印 undefined——set 会先清空状态'],
          answer: 1,
          explain: '「状态即快照」：每轮渲染的状态值全程定格，setState 安排的是「下一轮渲染用新值」，不是就地改变量。配套金句：状态变量不是响应式的，组件才是——重渲染的是整个组件。',
          lessonId: 'node-path-react-new-more-on-state'
        },
        {
          q: '连续调用两次 setPerson({ ...person, age: person.age + 1 })：age 实际加几？组件重渲染几次？',
          options: ['加 2 岁，渲染 2 次', '加 2 岁，渲染 1 次', '加 1 岁，渲染 1 次——两次调用都基于同一张旧快照做「替换」，第二次覆盖第一次；React 又尽可能批处理更新', '加 1 岁，渲染 2 次'],
          answer: 2,
          explain: '传值语义是替换：两句话都在说「把本轮快照的 person 替换成 age+1 的对象」，结果相同。要真的累加就传更新函数 setPerson(prev => ({ ...prev, age: prev.age + 1 }))——回调保证拿到最新状态。批处理让一轮事件里的多次 set 只渲染一次。',
          lessonId: 'node-path-react-new-more-on-state'
        },
        {
          q: 'Clock 的 setInterval 已包进 useEffect 且依赖数组为 []，StrictMode 开发环境下计数为什么每秒跳 2？',
          options: ['StrictMode 会把组件挂载 → 卸载 → 再挂载：第一次挂载创建的 interval 没被停掉，与第二次的并存——缺 cleanup 函数', '空依赖数组在 StrictMode 下失效，effect 每次渲染都重跑', 'setInterval 在 StrictMode 里精度翻倍', 'React 故意把计时器调快一倍做压力测试'],
          answer: 0,
          explain: 'StrictMode 的双挂载是开发期免费体检：它暴露的正是「建了资源没给退场通道」的真 bug。修法：effect 回调返回 cleanup 函数，里面 clearInterval——React 会在 effect 重跑前与组件卸载时执行它。生产构建没有双挂载，但泄漏的 interval 照样是泄漏。',
          lessonId: 'node-path-react-new-how-to-deal-with-side-effects'
        },
        {
          q: '下列哪一项是 useEffect 的正当使用场景？',
          options: ['把两个 state 求和后显示出来', '输入框每次击键时读取值并更新 state', '特定条件下把某个子组件重置回初始状态', '组件挂载时订阅浏览器 online 事件同步到 state，卸载时经 cleanup 退订'],
          answer: 3,
          explain: '判据只有一条：除了 props/state，有没有需要同步的外部系统（服务器、API、浏览器 DOM）。「你可能不需要 Effect」四连：派生值渲染期直接算（A）；事件逻辑进事件处理器（B）；重置用 key（C）；跨组件改状态用状态提升。不必要的 effect 是代码坏味道：易错 + 无谓性能开销。',
          lessonId: 'node-path-react-new-how-to-deal-with-side-effects'
        }
      ]
    },
    {
      unitId: 'react/class-components',
      zh: '齿轮档案厅',
      desc: '「类组件」章节综合预检（本站已开放 2 课）：extends Component 的组件资格、constructor/super/this.props 通道、this 绑定两方案、this.state 与 setState 的不可变纪律、didMount 取数与 didUpdate 防无限循环、useEffect 与生命周期方法的四行对照——全部改写自本站已讲解并考核过的知识点，不给成品答案。本章配 Boss 的判据：两课均为知识课且知识点密度足（与 finishing-up「实际 0 课可出题」不配的先例本质不同）。',
      questions: [
        {
          q: '一个类要「够格」当 React 组件必须做什么？props 从哪进来、怎么访问？',
          options: ['实现 render 方法即可；props 从函数参数直接拿', '继承 React 的 Component 基类（class X extends Component）；props 传给 constructor，配合 super(props) 后用 this.props 访问', '调用 React.registerComponent 注册；props 从全局配置读', '继承 HTMLElement 基类；props 经 HTML attributes 传递'],
          answer: 1,
          explain: 'React 把「够格当组件」的全部属性放在 Component 基类上——继承它就获得组件资格。props 通道：constructor(props) + super(props) 之后 this.props 可用；没有 props 时空参也合法。render 是类里唯一必需的方法，但光有 render 不继承 Component 不构成组件。',
          lessonId: 'node-path-react-new-class-based-components'
        },
        {
          q: 'onChange={this.handleInputChange} 直接传方法、又没做任何 this 绑定，会出什么事？两个正解是什么？',
          options: ['没问题——类方法的 this 永远指向组件实例', '编译期直接报错，无法运行', 'this 变成 window——在 render 里重新 bind 即可', '方法被调用时 this 是 undefined，this.setState 抛 TypeError——正解一：constructor 里逐个 bind(this)；正解二：用箭头函数类属性定义方法，this 自动绑定'],
          answer: 3,
          explain: '类方法默认不绑 this——传出去的是裸函数引用，被当事件回调调用时没有调用者语境。bind 惯例在 constructor 做而不是 render 里做：render 每次执行都 bind 会每次产生新函数引用，白白破坏子组件的浅比较优化。',
          lessonId: 'node-path-react-new-class-based-components'
        },
        {
          q: '类组件的状态在哪初始化、用什么更新？和函数组件共享哪条纪律？',
          options: ['constructor 里 this.state = {...} 初始化、预定义的 this.setState 更新——同样不可变异每次给新状态，setState 同样支持更新函数形态', 'useState 初始化、forceUpdate 强制刷新——不可变纪律仅适用于函数组件', '状态定义为类外全局变量、window.setState 更新', 'constructor 初始化后可在任意方法里直接改 this.state 的属性'],
          answer: 0,
          explain: 'this.state/this.setState 与 useState 一一对应：状态住在实例上、更新走 setState、直接改 this.state 不触发渲染。不可变纪律两套写法通用——setState 里照样要 concat/filter/展开造新值；传函数拿最新状态的更新函数形态也照样存在。',
          lessonId: 'node-path-react-new-class-based-components'
        },
        {
          q: '取数据应该住哪个生命周期方法？componentDidUpdate 里为什么不能无差别 setState？',
          options: ['constructor——最早最保险；didUpdate 一个组件一生只跑一次，随便 set', 'render——数据要边渲染边取；didUpdate 不触发重渲染所以安全', 'componentDidMount——组件挂载进 DOM 树之后跑；didUpdate 在每次重渲染后跑，无差别 setState 会引发重渲染再触发 didUpdate，无限循环——要对 prevProps 做条件判断', 'componentWillUnmount——卸载前取数正好收尾；didUpdate 里 setState 要包 try-catch'],
          answer: 2,
          explain: 'didMount 是取数据的家（组件已在 DOM 里，依赖 DOM 的操作也住这）；render 必须纯、constructor 时 DOM 还没挂载。didUpdate 防循环的正解是条件更新：对比 prevProps/prevState 与当前值，真的变了才 setState——函数组件的同型错误是 effect 里 set 了自己依赖数组里的状态。',
          lessonId: 'node-path-react-new-component-lifecycle-methods'
        },
        {
          q: 'useEffect(() => { fetchData(); return () => cancel(); }, []) 对应类组件的哪些生命周期方法？',
          options: ['只对应 componentDidUpdate', '执行体对应 componentDidMount、返回的清理函数对应 componentWillUnmount——空依赖数组使它没有 didUpdate 成分', '同时对应 didMount、didUpdate、willUnmount 三个', '对应 constructor 与 render'],
          answer: 1,
          explain: '官方对照表：空数组 = didMount（只挂载时跑）；返回函数 = willUnmount（卸载时清理）；带依赖 [a,b] = didMount + 依赖变化时的 didUpdate；无数组 = didMount + didUpdate 合体。useEffect 本质就是三个方法的组合——这张词典是「读旧代码写新代码」的翻译层。',
          lessonId: 'node-path-react-new-component-lifecycle-methods'
        }
      ]
    },
    /* ---------- World 5 批次 6 阶段 3（2026-09-28，v4.11.32，World 5 收组）：
     * react 课程「React 测试」章节 2/2 全开——「试镜堂」6 题（intro-to-react-testing 3 /
     * mocking 3）。**该章配 Boss 判据（沿用阶段 2 class-components 判据口径）**：两课
     * 均为知识课且知识点实打实可考（UI 测试盲区 / 查询三家族 / 快照两类失真 / vi.fn
     * 回调间谍 / vi.mock 迁移 / AAA 三段），可支撑 5 题下限。
     * 「React 生态」章节 4/4 全开——「百工市集」7 题（react-router 3 / fetching-data 2 /
     * styling 2；**shopping-cart 为 Project 课不出题**——全站纪律，题源限三门知识课）。
     * 「更多 React 概念」章节 3/3 全开——「隐枢阁」7 题（context-api 3 / reducing-state 2 /
     * refs-and-memoization 2）。
     * **「结语」章节 1/1 全开但不配 Boss**——react 版 conclusion 为祝贺信 + 下一步指引
     * （What's next / Using a backend / Contribute 三节），无实打实可考知识点，与
     * finishing-up-with-javascript 不配先例同型（「实际 0 课可出题」）：该章唯一一课
     * 即结语信本身。理由同步写进 map-boss 负例名单断言与 NEXT-PHASE 统计节。
     * desc 的章节级计数复用既有 stale-claims 豁免键（三个单元对应的 2 课 / 4 课 /
     * 3 课章节级豁免键全部在册，零新增）。
     * answer 分布自查打散（6 题：2,1,3,0,2,1；7 题：3,0,2,1,3,2,0；7 题：1,3,2,0,1,3,2
     * ——千形台轮沉淀的收尾自查工序）。**全站 27 个 Boss 单元 172 题**。 ---------- */
    {
      unitId: 'react/react-testing',
      zh: '试镜堂',
      desc: '「React 测试」章节综合预检（本站已开放 2 课）：UI 测试对逻辑测试盲区的补位、jsdom 内存 DOM 与 render 的真相、getBy/queryBy/findBy 三家族分工与 ByRole 优先级、快照测试的假阳性与假阴性、vi.fn() 回调间谍三条测试、jest.mock→vi.mock 与 data-test-id→data-testid 迁移、Arrange-Act-Assert 三段式——全部改写自本站已讲解并考核过的知识点，不给成品答案。',
      questions: [
        {
          q: 'Battleship 底层游戏的纯逻辑测试全绿——为什么 UI 还是可能有 bug？',
          options: ['逻辑测试框架有缺陷，换 Vitest 就没 bug 了', 'UI 的 bug 靠每次改代码后手动复查就够了', '逻辑测试不碰 DOM：state 结构改了列表不再渲染预期文本、加个条件后拖放目标悄悄失效——这类问题只有把 UI 拉进测试才看得见，而且每次改动不可能手动复查所有相关 UI', 'UI bug 不影响功能，可以不管'],
          answer: 2,
          explain: 'UI 测试补的正是逻辑测试的盲区：网站「包含预期内容、按预期行为」这两件事住在 DOM 里。官方两个事故例（列表文本丢失、拖放目标失效）都是逻辑全绿 UI 已坏——而且人不可能记得每次改动后复查每个相关 UI。',
          lessonId: 'node-path-react-new-introduction-to-react-testing'
        },
        {
          q: '要断言「某元素不在页面上」，必须用哪个查询家族？为什么？',
          options: ['getBy——找不到会抛错，抛错正好当作断言结果', 'queryBy——找不到返回 null 不抛错，断言才轮得上执行；getBy 找不到会先抛错、你的断言根本跑不到', 'findBy——异步等待元素消失后 resolve', '三个家族随便哪个都行，行为一样'],
          answer: 1,
          explain: '三家族按「找不到时的行为」分工：getBy 抛错（找「应该在」的）、queryBy 返回 null（断言「不该在」的只能用它）、findBy 返回 Promise 异步等待（等延迟渲染的内容，要 await）。用 getBy 断言不存在，测试会以「抛错」而非「断言失败」的方式结束——语义全错。',
          lessonId: 'node-path-react-new-introduction-to-react-testing'
        },
        {
          q: '「快照测试通过」到底证明了什么？两类失真各是什么？',
          options: ['证明组件行为正确——快照就是正确性的照片', '证明渲染性能达标；两类失真是渲染快与慢', '什么都不证明——快照测试应该从测试套件里整个删掉', '只证明「与上次存下的快照一致」——不证明正确（假阳性：bug 若已进快照就永远通过，过度依赖致过度自信）；且最微不足道的改动（改标点、换语义化标签）也让它挂（假阴性：频繁误报磨掉对套件的信心）'],
          answer: 3,
          explain: '快照是「变更探测器」不是「正确性证明」。它快而省（一条断言顶多条）、能挡意外变更——所以不该删；但两类失真决定了行为断言（getByRole + toHaveTextContent）才是主力，快照留给「结构大变动需要人看一眼」的场合。',
          lessonId: 'node-path-react-new-introduction-to-react-testing'
        },
        {
          q: 'CustomButton 只接一个 onClick prop——你完全不知道这个函数做什么。怎么测？',
          options: ['用 vi.fn() 造 mock 传入，userEvent 点击后断言 toHaveBeenCalled——不需要知道函数做什么，只需验证「点击时它被调用」；再配一条不点击时 not.toHaveBeenCalled 的反面对照', '先读懂父组件源码、搞清 onClick 的真实行为再写断言', '没法测——未知实现的回调不可测，跳过', '直接断言 onClick 执行后的应用副作用（如状态变化）'],
          answer: 0,
          explain: 'mock 的用武之地正是「不知道也不需要知道实现」：vi.fn() 造出的间谍函数自带调用记录，被测边界收在「按钮把点击传导给回调」这一件事上。官方三条测试收工：渲染出按钮 / 点击后被调用 / 不点不被调用——正反都测才叫收工。',
          lessonId: 'node-path-react-new-mocking-callbacks-and-components'
        },
        {
          q: '把 TOP 官网真实案例（jest.mock + data-test-id）搬到本课的 Vitest + RTL 环境，要改哪两处？',
          options: ['jest.mock 改 vi.spyOn；data-test-id 保留不动', '不用改——Jest 与 Vitest、案例与 RTL 完全兼容', 'jest.mock 改 vi.mock（Vitest 等价 API）；data-test-id 是案例项目自定义属性——RTL 默认认的是 data-testid，一字之差会让 getByTestId 全部落空', 'jest.mock 改 mock.module；data-test-id 改 test-id'],
          answer: 2,
          explain: '两处迁移点：mock API 前缀（jest.* → vi.*）与 test id 属性名（案例自定义 data-test-id vs RTL 默认 data-testid）。照抄案例代码不改这两处，测试会安静地全挂——这正是官方专门放两个 lesson-note 的原因。',
          lessonId: 'node-path-react-new-mocking-callbacks-and-components'
        },
        {
          q: '「点击后 onClick 被调用」这条测试的 Arrange-Act-Assert 三段分别是什么？',
          options: ['Arrange：点击按钮；Act：render 组件；Assert：造 vi.fn()', 'Arrange：vi.fn() 造 mock、userEvent.setup()、render 组件、getByRole 拿按钮；Act：await user.click(button)；Assert：expect(onClick).toHaveBeenCalled()', 'Arrange：写 describe 块；Act：写 it 块；Assert：跑 npm test', '三段顺序无所谓，随便排'],
          answer: 1,
          explain: 'AAA 是几乎所有测试的通用形状：准备（造数据渲染组件拿元素）→ 执行（触发交互）→ 断言（验证结果）。官方建议早晚采纳——三段分明的测试更可读、更好维护；本课每条示例都能切进这三段。',
          lessonId: 'node-path-react-new-mocking-callbacks-and-components'
        }
      ]
    },
    {
      unitId: 'react/the-react-ecosystem',
      zh: '百工市集',
      desc: '「React 生态」章节综合预检（本站已开放 4 课）：客户端路由与 MPA 的本质区别及辅助技术代价、Outlet 与 index 与动态段的嵌套路由三件套、路由组件测试的两档方案、fetch 对 4xx/5xx 不 reject 的 status 检查、请求瀑布成因与请求提升、样式四族方案与官方课程立场、CSS-in-JS 与 CSS Modules 的能力差——全部改写自本站已讲解并考核过的知识点，不给成品答案；本章 Project 课（购物车）不出题，题源限三门知识课。',
      questions: [
        {
          q: '客户端路由与多页应用（MPA）导航的本质区别是什么？代价是什么？',
          options: ['没有本质区别——只是路由代码写在不同地方', '客户端路由每次导航仍整页重载，只是重载得更快', '客户端路由的代价是浏览器历史彻底不可用', 'JS 拦截链接请求——URL 与视图在客户端变化而不整页刷新（MPA 每次点链接浏览器重载，官方比喻「起身去烤箱」vs「微波炉搬到桌上」）；代价：浏览器重载会通知屏幕阅读器新内容，客户端路由要手动通知辅助技术'],
          answer: 3,
          explain: '「永不离开当前页」是 SPA 路由的本体：链接请求被你写的 JS 拦截而非发给服务器。可访问性代价官方专门点名——成熟库（React Router）帮你兜底，但要知道这层债的存在。',
          lessonId: 'node-path-react-new-react-router'
        },
        {
          q: '嵌套路由里 Outlet 是什么？{ index: true } 子路由管什么？',
          options: ['Outlet 是父组件模板里的「渲染口」——子路径命中时被替换成对应子组件；index 子路由是父路径不带子段时渲染的默认内容', 'Outlet 是数据出口；index 路由给子路由排序', 'Outlet 是错误页出口；index 路由指向应用首页', 'Outlet 是路由配置数组本身；index 是数组下标'],
          answer: 0,
          explain: '嵌套路由 = 父模板 + Outlet 洞 + children 填充物：访问 /profile/popeye 时 Profile 渲染骨架、Outlet 位置换成 Popeye；/profile 不带子段时 index 路由的 DefaultProfile 顶上。动态段 :name 则把「匹配」变「取值」——useParams() 读出。',
          lessonId: 'node-path-react-new-react-router'
        },
        {
          q: '测试一个用了 useParams 的组件，直接 render(<Component />) 抛错——两档正确做法？',
          options: ['把 useParams mock 掉返回假参数', '关掉 StrictMode 再测', '应用从不直接渲染这些组件——都是经 router 渲染的；组件只是恰好含 Link、不测导航 → MemoryRouter 轻量包裹；依赖真路由行为（参数匹配、outlet context、错误元素、重定向）→ createMemoryRouter 吃 routes.jsx 同款配置、经 RouterProvider 渲染', '放弃测试路由组件——外部库行为不可测'],
          answer: 2,
          explain: '脱离路由上下文时 useParams/useNavigate/Link 无法工作——这是「应用经 router 渲染组件」的镜像事实。两档按依赖深度选：轻量 MemoryRouter（URL 不真变）或完整 createMemoryRouter；routes.jsx 抽独立文件的红利正在这里兑现——测试与生产共享配置。',
          lessonId: 'node-path-react-new-react-router'
        },
        {
          q: 'fetch 一个返回 HTTP 404 的地址——catch 会执行吗？正确处理是什么？',
          options: ['会——fetch 对所有 4xx/5xx 自动 reject，catch 天然接住', '不会——fetch 的 Promise 只在网络故障时 reject，HTTP 4xx/5xx 会正常 resolve（「请求送达并拿到响应」）；必须在 then 里检查 response.status >= 400 主动 throw new Error 让它流进 catch，再 setError 进状态、渲染错误提示', '会——RTL 帮 fetch 补了错误处理', '404 不算错误——浏览器会自动重试'],
          answer: 1,
          explain: 'fetch 与直觉最不同的一点：「成功拿到一个失败响应」是 resolve。不查 status 主动 throw，错误就静默溜进成功分支——用户看到坏数据或白屏。官方实验：URL 改乱后页面白屏零提示，就是缺这道防线。',
          lessonId: 'node-path-react-new-fetching-data-in-react'
        },
        {
          q: '两个各 1000ms 的请求为什么串成 2000ms+（请求瀑布）？不牺牲 loading 界面的解法？',
          options: ['网络带宽不足——换更快的 API 服务商', '子组件代码太长拖慢渲染——优化打包体积', '条件渲染语法写错了——换一种 JSX 写法', '组件在被真正渲染前不执行：imageURL && <Bio /> 短路——Bio 要等 Profile 的请求 resolve、条件变 true 才开始渲染，它的 fetch 那时才发出；解法是把请求提升到组件树上层并行发出、结果经 props 下发——loading 界面与性能兼得'],
          answer: 3,
          explain: '瀑布的根因是「渲染顺序决定请求顺序」：false 分支不渲染、其中的 fetch 就不发出。删掉短路条件能让 Bio 立即发请求但 loading 没了——官方不拿设计换性能，正解是请求提升（与「状态提升」同构的工程动作）。',
          lessonId: 'node-path-react-new-fetching-data-in-react'
        },
        {
          q: '样式四族方案各自解决什么？官方对本课程的立场是什么？',
          options: ['四族都只为性能——选最快的用', '官方推荐直接上组件库省时间', '核心痛点是普通 CSS 全局作用域（应用越大类名冲突与管理越难）：CSS Modules 给局部作用域、CSS-in-JS 用 JS 掌控样式可按状态施加、工具类框架预定义类直接进 JSX、组件库样式行为可访问性全包；官方立场——课程期间强烈建议避开 CSS 框架与组件库（图标组件库例外可用），用 CSS Modules 从零写', '四族互斥只能单选——选定离手'],
          answer: 2,
          explain: '四族是围绕同一痛点的四种取舍；官方立场是教学立场不是技术否定：先学会走再借轮椅——Shopping Cart 项目就按 CSS Modules 从零写。真实项目常混用（Modules 打底 + 图标库 + 个别复杂交互引 Radix）。',
          lessonId: 'node-path-react-new-styling-react-applications'
        },
        {
          q: 'CSS-in-JS 相比 CSS Modules 多出的能力是什么？React 生态代表方案是？',
          options: ['用 JavaScript 全权掌控 CSS——能按逻辑（比如组件状态）施加样式、扩展各种特性，模块化能力两者相当；React 生态最流行的代表是 styled-components', 'CSS-in-JS 运行时性能全面更好', 'CSS Modules 做不到局部作用域、CSS-in-JS 可以', 'CSS-in-JS 不需要任何构建步骤'],
          answer: 0,
          explain: '官方定义：CSS-in-JS 让你用 JS 完全掌控 CSS 并扩展特性、按状态施加样式、支持与 Modules 同样的模块化。局部作用域两者都有（Modules 的本体就是它）；性能反而要分运行时/零运行时两派细看（CSS-Tricks 深度分析的课题）。',
          lessonId: 'node-path-react-new-styling-react-applications'
        }
      ]
    },
    {
      unitId: 'react/more-react-concepts',
      zh: '隐枢阁',
      desc: '「更多 React 概念」章节综合预检（本站已开放 3 课）：prop drilling 的识别与官方例子链路、Context API 三要素与 React 19 前后 Provider 写法差异、context 两条代价与小 context 分片缓解、reducer 使用判据与三红利、useReducer 返回值形状与快照语义与 Object.is 判定、useRef 的挂载时序与 state 分界、引用相等失败让 memo 白包与缓存四件套分工——全部改写自本站已讲解并考核过的知识点，不给成品答案。',
      questions: [
        {
          q: '什么是 prop drilling？官方 Shopping Cart 例子里它发生在哪条链路？',
          options: ['props 层级越深性能越好的一种设计模式', 'props 经过并不消费它的中间层组件一路下传——cartItemsCount 从 App → Header → Links，Header 自己不显示件数、只是转手；应用越大这种转手链路越泛滥', '把 props 钻进对象深层属性的解构过程', 'props 的 TypeScript 类型钻取'],
          answer: 1,
          explain: 'prop drilling 的识别特征：中间层只转手不消费。Context API 的价值正在删掉转手——Links 直接 useContext 取数，Header 的 props 整个消失。但官方与 Kent C. Dodds 都提醒：浅层传递其实更明确，drilling 不总是坏——组合能解决的别急着上 context。',
          lessonId: 'node-path-react-new-managing-state-with-the-context-api'
        },
        {
          q: 'Context API 三要素各做什么？React 19 前后写法差在哪？',
          options: ['createContext / useReducer / Provider 三件套；19 前后无差异', 'useContext / memo / value；19 移除了 memo', 'Provider / Consumer / Dispatcher；19 移除了 Consumer', 'createContext(默认值) 创建 context 对象；ContextObject 直接当组件用、value prop 塞共享数据包住消费者；被包组件 useContext(ContextObject) 取数（参数是 context 对象本身）——React 19 之前提供端写 ContextObject.Provider，官方明说看到 Provider 就是指 ContextObject'],
          answer: 3,
          explain: '三要素一个都不玄：造对象、提供、消费。React 19 的变化只是提供端少写一层 .Provider。默认值非必须（null 也行）——给对象的三个理由：Provider 外消费不崩、测试免包 Provider、IDE 自动补全；反正 value 会覆盖它。',
          lessonId: 'node-path-react-new-managing-state-with-the-context-api'
        },
        {
          q: 'Context API 的两条代价是什么？官方第一缓解方案是？',
          options: ['语法太糖——要先学 TypeScript 才能驾驭', '性能太差——必须立刻换 Redux', '代价①性能：context 值一更新，所有消费该 context 的组件全部重渲染——哪怕它用的那部分状态没变；代价②可读性：任何组件都能轻松拿到状态，消费者一多数据流向难追踪；第一缓解：按相关状态拆多个小 context 替代单个大 context', '没有代价——context 应该无脑全用'],
          answer: 2,
          explain: '两条代价官方明说、不是猜测。缓解三方案按序：小 context 分片（减少每次更新的波及面）→ 组件组合（有些场景根本不需要 context）→ 外部状态库 Zustand/Redux（功能多有优化但有学习曲线）。课程内官方路线：继续 Context API。',
          lessonId: 'node-path-react-new-managing-state-with-the-context-api'
        },
        {
          q: '官方给的「什么时候用 reducer」判据是什么？红利有哪三个？',
          options: ['反面：状态更新只有几种简单方式——不必用（useState 足够）；正面：组件因状态逻辑变得太大、难读、难调试——正是主场。红利：①状态逻辑分离（可住独立文件、组件瘦身）②状态 bug 可顺着追溯回 dispatch 的 action ③reducer 是纯函数、可独立测试', '所有组件一律用 reducer 替代 useState', '只在性能不达标时才用', '只有类组件才需要 reducer'],
          answer: 0,
          explain: '判据是「状态逻辑的复杂度」不是性能也不是风格。官方收尾也给了自由度：useState 与 useReducer 等价、可同组件混用——用哪个由你。default 分支对未知 action.type 抛错是官方示例的细节纪律：拼错 type 立即暴露。',
          lessonId: 'node-path-react-new-reducing-state'
        },
        {
          q: 'useReducer(reducer, { count: 0 }) 返回什么？dispatch 后状态何时更新？按什么机制判定要不要重渲染？',
          options: ['返回 [dispatch, state]；dispatch 后立即同步更新；用 === 比较', '返回 [当前状态, dispatch 函数]；dispatch(action) 把 action 交给 reducer、返回值用于更新状态——且只在下一轮渲染生效（快照语义与 useState 一致）；React 用 Object.is() 判断状态是否变化，没变就不重渲染', '返回 state 对象本身；dispatch 直接改属性', '返回 Promise；await 之后状态才更新'],
          answer: 1,
          explain: '返回形状与 useState 同款（[值, 更新函数]），语义也同款：下一轮渲染才生效 + Object.is() 判定——「再谈状态」课的快照世界观原样适用。action 必带 type、可携带额外属性（set_count 的 value），reducer 纯函数不变异。',
          lessonId: 'node-path-react-new-reducing-state'
        },
        {
          q: 'buttonRef 初值是 null，为什么 useEffect 里 buttonRef.current.focus() 不报错？useRef 与 useState 的分界？',
          options: ['React 会自动给 null 补 focus 方法', 'null 本身就有 focus——JS 的宽容性', 'useEffect 在渲染之前执行，那时 current 已被填好', '渲染与屏幕绘制先于 React 执行 useEffect——effect 跑起来时 ref 属性已把 buttonRef 与真实 DOM 按钮连接好；分界：ref 是可变引用、更新 current 不触发重渲染（存「渲染不需要」的值），state 不可变（纪律上）、更新触发重渲染（存界面依赖的数据）'],
          answer: 3,
          explain: '挂载时序 render → commit（ref 连接建立）→ effect 是「初值 null 却能 focus」的全部答案。想让组件记住点什么但不想因此重渲染——useRef；界面依赖的数据——useState。官方还给了边界：别让 ref 做破坏性 DOM 操作（改 textContent 的反例只是演示机制），能让 React commit 的别自己动手。',
          lessonId: 'node-path-react-new-refs-and-memoization'
        },
        {
          q: '子组件包了 memo() 为什么有时还是重渲染？缓存四件套怎么分工？',
          options: ['memo 有已知 bug——官方建议别用', '父组件没配 StrictMode——包上就好', '传下去的函数 prop 每次渲染都是新建的（新引用）——memo 的判据是 props 逐项引用相等，检查失败就白包；分工：useMemo 缓存任何值、useCallback 只缓存函数（≡ useMemo(() => fn, deps)）、memo 让子组件 props 未变时跳过重渲染、React Compiler 构建期自动做这些——一切之前先 Profiler 测量，过早优化是万恶之源', '子组件体积太大——memo 只对小组件生效'],
          answer: 2,
          explain: '官方对照实验：裸 handleClick + memo → 仍重渲染（引用相等失败）；memoizedHandleClick + memo → 不重渲染。memo 与缓存 hook 是两件套、缺一白搭。面试题官方点名：useMemo 与 useCallback 的区别 = 缓存值的类型。',
          lessonId: 'node-path-react-new-refs-and-memoization'
        }
      ]
    },
    /* ---------- World 6 数据库（超长轮批次 7 阶段 1，2026-09-28，v4.11.33，World 6 收组）
     * 「万卷地宫」6 题（databases/databases——导论 2 / 数据库与 SQL 4；sql-zoo 为
     * Project 课不出题，全站 Project 课不出 Boss 题纪律）。unitId 经
     * pathBossUnitId('databases', 'databases') 构造，前缀约定沿用。题源限本章 3 课
     * （全开）中的 2 门知识课、全部改写自本站已讲解并考核过的知识点，不给成品答案。
     * desc 的章节级计数复用既有豁免键（3 课键，启航栈桥同值域在册）。
     * **World 6 全 3 课就此收组，全站 28 个 Boss 单元、178 题**。 ---------- */
    {
      unitId: 'databases/databases',
      zh: '万卷地宫',
      desc: '「数据库」章节综合预检（本站已开放 3 课）：数据库在 Web 应用里的角色、SQL 的真正难点、关系型与 NoSQL 的取舍、主键与外键的分工、DELETE 不带 WHERE 的经典事故、四种 JOIN 各保留哪些行、聚合后为什么用 HAVING 而非 WHERE——全部改写自本站已讲解并考核过的知识点，不给成品答案。',
      questions: [
        {
          q: '按官方开篇，Web 应用里「记住所有用户数据」的是哪一层？官方说 SQL 真正难在哪里？',
          options: ['最底层的数据库；SQL 难在语法动词太多、要背的关键词上百个', '最底层的数据库——它替你完成全部「记住」的工作；SQL 语法其实很短（只有一小把动词），真正难的是你需要能在脑海里可视化查询将做什么', '前端的 localStorage；SQL 难在没有图形界面', '中间件层；SQL 难在必须连网才能用'],
          answer: 1,
          explain: '官方定调：数据库是 Web 应用最底层、负责全部「记住」的工作（缓存是后话），形态可从 Excel 表格那样简单到 Facebook 分片那样复杂。SQL 的难点官方说得很明确——不是语法量（动词屈指可数），而是「在脑海里可视化它将要做什么」：哪些行被选中、两表怎么拼、分组后每组算出什么。',
          lessonId: 'node-path-databases'
        },
        {
          q: '关于关系型数据库与 NoSQL，官方在本课给的定位是什么？',
          options: ['NoSQL 已经淘汰了关系型数据库，本路线只是来不及更新', '两者是同一个东西的不同叫法', '本路线用 SQL（关系型），但非关系型（NoSQL）数据库近几十年已兴起为另一条路线——读对比文知道世界不只有 SQL，按数据形态与扩展需求选型', '关系型数据库只能存表格、NoSQL 只能存文档，两者数据形态完全不重叠'],
          answer: 2,
          explain: '官方 Assignment 第 4 条专门安排了一篇 SQL vs NoSQL 对比文，用意正是防止把入门路线当成全部地图：关系型（表与关系、固定模式、强一致）与 NoSQL（文档/键值/图等灵活模式、横向扩展）各有适用场景，不是谁取代谁。本路线选 SQL 是因为它是理解数据建模与 ORM 的最好起点。',
          lessonId: 'node-path-databases'
        },
        {
          q: 'posts 表里有一列 user_id 存着作者的 users.id。这一列叫什么？作用是什么？',
          options: ['外键——本表中指向另一张表 ID 的列，把 posts 与 users 两张表链接起来', '主键——唯一标识 posts 表的每一行', '索引——加速搜索的提前排序结构', 'Schema——记录数据库表结构的文件'],
          answer: 0,
          explain: '外键 = 本表中存着另一张表 ID 的列（posts.user_id 指向 users.id），表靠它链接成「关系型」数据库。主键是表里唯一的行号列（所有表都有的 ID）；索引是 CREATE INDEX 给列建的提前排序结构；Schema 是记录数据库结构设置的文件——四个概念各司其职。',
          lessonId: 'node-path-databases-databases-and-sql'
        },
        {
          q: '官方点名的 DELETE「经典事故」是什么？每条 CRUD 命令由哪几部分组成？',
          options: ['删了索引导致变慢；命令 = 动作 + 表', '用了双引号；命令 = 表 + 值', '忘记分号；命令 = 动作 + 条件', 'DELETE FROM users 没带 WHERE 子句——整张表的用户全被删掉；每条命令含三部分：动作（语句）+ 运行的表 + 条件（子句），不给条件就作用于全表'],
          answer: 3,
          explain: '经典事故就是 DELETE 不带 WHERE 清空全表（UPDATE 同理——WHERE 命中几行就改几行）。每条 CRUD 命令 = 语句（动作）+ 表 + 子句（条件）；可用比较运算符圈行、逻辑运算符（AND/OR/NOT）串联多个子句。写删改的肌肉记忆：先写 WHERE 再补动作、尽量按唯一的 ID 圈定。',
          lessonId: 'node-path-databases-databases-and-sql'
        },
        {
          q: '要返回「所有用户（无论有没有发过帖）」，有帖子的列出帖子、没帖子的 posts 列显示 NULL——该用哪种 JOIN（users 在 FROM 里）？',
          options: ['INNER JOIN', 'LEFT OUTER JOIN——users 是左表', 'RIGHT OUTER JOIN', 'FULL OUTER JOIN'],
          answer: 1,
          explain: 'LEFT OUTER JOIN 保留左表（FROM 里那张，这里是 users）全部行，右表匹配的加进来、没对上的格子填 NULL——正好是「所有用户都要、没帖子的补 NULL」。INNER 只留两边都匹配的（没发帖的用户会被丢掉）；RIGHT 保右表；FULL 两表全保。选 JOIN 的本质是问「要不要保留没匹配上的行」。',
          lessonId: 'node-path-databases-databases-and-sql'
        },
        {
          q: '想列出「发帖数 ≥ 10 的用户」，已经 JOIN + GROUP BY + COUNT 了，筛选条件该写在哪？为什么不能用 WHERE？',
          options: ['写在 WHERE 里——WHERE 能筛聚合结果', '写在 ON 里', '写在 HAVING 里——WHERE 在聚合发生前筛行、筛不了聚合结果，HAVING 是聚合版的 WHERE，专门按聚合值做条件', '写在 GROUP BY 里'],
          answer: 2,
          explain: 'WHERE 在聚合前筛「行」，HAVING 在聚合后筛「组」——要按 COUNT/SUM 等聚合值做条件必须用 HAVING。官方示例：GROUP BY users.id, users.name 之后加 HAVING COUNT(posts.id) 大于等于 10。记法：筛行用 WHERE、筛组用 HAVING，两者可同时出现各管一层。另：选中的非聚合列要全部写进 GROUP BY（最佳实践）。',
          lessonId: 'node-path-databases-databases-and-sql'
        }
      ]
    },
    /* ---------- 超长轮批次 7 阶段 2（2026-09-28，v4.11.34，NodeJS 入门 6 课 + Express 11 课开放） ----------
     * 「机枢洞府」6 题（nodejs/introduction-to-nodejs——后端入门 1 / 什么是 NodeJS 2 /
     * Node 入门 1 / 调试 1 / 环境变量 1；basic-info-site 为 Project 课不出题，全站
     * Project 课不出 Boss 题纪律）。unitId 经 pathBossUnitId('nodejs',
     * 'introduction-to-nodejs') 构造——批次 7 阶段 1 负例名单里的「World 7 未开放
     * 章节真实前缀形态」占位就此转正（map-boss 负例名单换入 nodejs/authentication）。
     * 题源限本章 6 课（全开）中的 5 门知识课、全部改写自本站已讲解并考核过的知识点。
     * 「飞马驿城」7 题（nodejs/express——框架简介 1 / Express 入门 1 / 路由 1 /
     * 控制器 1 / 视图 1 / 部署 1 / 使用 PostgreSQL 1；mini-message-board 与
     * inventory-application 两门 Project 课不出题；installing-postgresql 的安装操作
     * 为一次性动作无综合考点、psql 与 SQL 基础已由万卷地宫覆盖不重复出题——判据③同站
     * 不重复口径）。Express 章 11 课全开即配、9 门知识课知识点密度足支撑 7 题。
     * **全站 30 个 Boss 单元、191 题**。 ---------- */
    {
      unitId: 'nodejs/introduction-to-nodejs',
      zh: '机枢洞府',
      desc: '「NodeJS 入门」章节综合预检（本站已开放 6 课）：后端语言的「准入线」为什么这么低、Node 官方定义里的运行时与事件驱动、EventEmitter 在五站巡礼里的角色、服务端调试为什么换工具、环境变量的类型陷阱与 .env 红色警戒——全部改写自本站已讲解并考核过的知识点，不给成品答案。',
      questions: [
        {
          q: '为什么服务器端「几乎想用什么语言就用什么语言」，而前端只有三门标准语言？',
          options: ['因为 W3C 把所有后端语言都标准化了', '因为服务器的操作系统原生支持一切编程语言', '因为浏览器唯一关心的是发回来的 HTML/CSS/JS 格式是否正确——只要语言能接住 HTTP 请求、吐出这三门文件就能上服务器', '因为前端语言运行太慢，被禁止在服务器上使用'],
          answer: 2,
          explain: '官方定调：浏览器不关心你用什么语言写的，只关心你发回的是不是格式正确的 HTML、CSS、JavaScript。这就是后端语言的「准入线」——PHP、C#、Ruby、Python、Java（官方特别提醒别和 JavaScript 混淆）都是热门选择，能做的事几乎完全相同、只是语法不同（像用不同语言问「最近的酒馆怎么走」）。现实约束有两条：自己运维服务器最自由，云平台则可能只允许平台已装好的语言。',
          lessonId: 'nodejs-introduction-to-the-back-end'
        },
        {
          q: 'Node 官方定义说它是「JavaScript 运行时」——运行时意味着什么？它比浏览器里的 JS 多了什么？',
          options: ['运行时是让 JS 跑得更快性能的框架——只提速、不加新能力', '运行时是把 JS 带出浏览器的执行环境（构建在 Chrome V8 引擎上）——补上了读写文件、控制网络服务等浏览器里没有的能力', '运行时是浏览器内置的数据库——JS 靠它存数据', '运行时是把 JS 编译成机器码后就不再需要源码的编译器'],
          answer: 1,
          explain: '官方定义的拼图：JavaScript 运行时（带 JS 出浏览器、构建在 V8 上）+ 异步事件驱动 + 服务器端能力。运行时的意义不是「更快」而是「浏览器外也能跑、能拿到浏览器拿不到的能力」——官方列举的正是文件读写与网络服务控制这两类，本章的 basic-info-site 项目用的就是后者。',
          lessonId: 'nodejs-introduction-what-is-nodejs'
        },
        {
          q: '官方说 Node 的事件驱动「几乎就是你已经用过的某个前端模式」——是哪个？差别在哪？',
          options: ['Promise 链模式；差别是 Node 不需要 catch', 'DOM 事件监听模式（click 等事件发生就调函数）；差别在监听的对象——服务端是网络请求、文件读写完成这类事件', '页面 onload 模式；完全没有差别', 'React useEffect 模式；差别是 Node 没有依赖数组'],
          answer: 1,
          explain: '事件驱动与浏览器 addEventListener 本质同构：不预测什么时候完成，只登记「事件发生时调用这个函数」。差别在事件源——前端监听 DOM/浏览器事件，Node 监听服务器侧事件（请求到达、文件读完）。异步模型与同步模型的差别也在这：同步按写好的顺序死等每一步，异步登记回调后继续往下走、事件到了再回来。这就是「回调对 Node 极其重要」的原因。',
          lessonId: 'nodejs-introduction-what-is-nodejs'
        },
        {
          q: '官方五站式模块巡礼里，哪一站让你能「创建、触发并监听自己的事件」？',
          options: ['fs 文件系统模块', 'http 模块', 'URL 类', 'events 模块（EventEmitter）'],
          answer: 3,
          explain: 'events 模块的 EventEmitter 一个类干两件事：emit 创建/触发事件、on 监听事件。其余各站分工：命令行站学从终端跑脚本，http 站学发请求（fetch）与建服务器（http.createServer——创建接受处理器的 HTTP 服务器），fs 站学读写文件，URL 站学 WHATWG URL 类解析地址。',
          lessonId: 'nodejs-getting-started'
        },
        {
          q: '调试服务端代码时官方推荐什么工具？文档里被点名「特别留意」的功能是什么？',
          options: ['Chrome DevTools 的 Network 面板——服务端代码也跑在浏览器里', 'VS Code 调试器；JavaScript Debug Terminal——让调试器直接跑在终端会话里，是让调试器启动的最简单方式', 'console.log 打印大法——打印比断点快', '浏览器的 Sources 面板断点功能'],
          answer: 1,
          explain: '服务端代码不在浏览器里跑，DevTools 够不着——VS Code 调试器补上的正是这个缺口。JavaScript Debug Terminal 被官方点名：普通终端里 node 起的进程自动带调试器，断点即设即生效。官方把调试定位成学习与职业生涯的「关键工具」——浏览器 DevTools 的经验（断点、单步、监视）在编辑器调试器里全部复用。',
          lessonId: 'nodejs-debugging-node'
        },
        {
          q: '环境变量有两个官方特别提醒的坑，分别是什么？',
          options: ['环境变量只能存数字；.env 文件必须提交进 git 才生效', 'process.env 读出的值永远是字符串（算术/比较要先 Number() 等转换）；.env 绝不能提交进版本控制——机密会泄露，且建议给协作者提供占位值示例文件', '环境变量会自动加密，所以可以放心提交 git', '.env 只在生产环境生效，本地开发必须用 export'],
          answer: 1,
          explain: '坑一是类型：process.env.PORT 读出的是字符串 "3000"，直接当数字比较会出隐蔽 bug——先转换再用。坑二是安全：.env 住着 API 密钥、数据库密码等机密，提交进 git 等于公开密钥——官方红色警戒（critical note）绝不提交，并建议提供 .env.example（只含占位值）给协作者。环境变量的两大用途——按环境分叉（开发/生产）与存机密——正是必须懂这两个坑的原因；Node v20.6+ 已内置 .env 支持（--env-file 或 process.loadEnvFile），dotenv 是历史方案。',
          lessonId: 'nodejs-environment-variables'
        }
      ]
    },
    {
      unitId: 'nodejs/express',
      zh: '飞马驿城',
      desc: '「Express」章节综合预检（本站已开放 11 课）：框架的诞生逻辑、Express「不持立场」的性格、路由顺序为什么重要、错误中间件的识别标志、EJS 两种输出标签的安全边界、静态与动态托管的分界、Pool 与 Client 的分工——全部改写自本站已讲解并考核过的知识点，不给成品答案。',
      questions: [
        {
          q: '按官方叙述，Web 框架是怎么诞生的？「用任何框架开新应用」你会得到什么？',
          options: ['框架由浏览器厂商发明来统一前端语法；开新应用得到免费的数据库', '框架是「懒」驱动的——把每个项目都重复写的代码打包回收成可复用结构；开新应用得到几十个已组织好的文件夹（最佳实践骨架）', '框架是语言标准委员会的官方库；开新应用得到自动部署的服务器', '框架只是代码片段合集；开新应用得到完整的项目成品代码'],
          answer: 1,
          explain: '框架解决的核心痛点是重复：路由、请求解析、模板渲染每个项目都要写——有人把它们打包一次、所有人回收使用，这就是「懒」驱动的诞生故事。开新应用得到的几十个文件夹不是仪式感，是最佳实践结构（路由/控制器/视图分家）——接下来的 Express 章就在这个骨架上生长。官方举 Ruby 生态说明「一门语言多个框架」：框架是社区选择、不是语言标准的一部分。',
          lessonId: 'nodejs-introduction-to-frameworks'
        },
        {
          q: '官方怎么描述 Express 的性格？这个性格的利与弊各是什么？',
          options: ['「持立场」——规定了数据库与目录结构；利在不用做决定，弊在不灵活', '「不持立场」——不强迫你做任何决定；利在自由度高、想怎么搭就怎么搭，弊在每个部件都要自己挑选决定', '「全栈」——前后端一体；利在快，弊在只能用 EJS', '「零配置」——什么都不用配；利在省事，弊在无法扩展'],
          answer: 1,
          explain: 'Express 的自我定位是 unopinionated（不持立场）框架：只管路由与中间件这些核心，数据库、模板引擎、目录结构都不规定。自由是利——对新手的弊则是「每个决定都要自己做」，这也是本课程带你逐步搭 MVC 结构的原因。对照：纯 Node 的 http 服务器写路径分发要手写一堆 if——啰嗦；Express 的 app.get 把这份重复打包掉了。',
          lessonId: 'node-path-nodejs-introduction-to-express'
        },
        {
          q: '把兜底路由 app.get("/{*splat}", …) 写在 GET /messages 前面，会发生什么？为什么？',
          options: ['没有影响——Express 会自动把更具体的路由排前面', '/messages 请求会 404——splat 匹配不到有内容的路径', '所有 GET 请求（包括 /messages）都被 splat 路由接住——Express 按定义顺序取第一个「动词 + 路径」都匹配的路由', '语法报错——兜底路由必须放最后'],
          answer: 2,
          explain: '路由匹配两维度是动词 + 路径，冲突规则是「先定义先赢」——Express 没有按具体程度排序的智能，官方因此专门警告顺序很重要：兜底 splat 写前面会吃掉之后所有 GET 请求。另一条硬规矩：Express 5 的 splat 必须带名字（/{*splat}），裸 * 是语法错误；GET /messages 也匹配不了 app.post("/messages")——动词不对同样不接。',
          lessonId: 'nodejs-routes'
        },
        {
          q: '错误处理中间件的识别标志是什么？少写一个参数会怎样？',
          options: ['标志是函数名以 error 开头；少写参数名字对不上', '标志是函数签名有四个参数（err, req, res, next）——少写任何一个，Express 就不把它当错误处理中间件', '标志是用 app.error() 注册；少写参数注册时报错', '标志是 return next() 返回 true；参数与识别无关'],
          answer: 1,
          explain: 'Express 靠参数个数识别错误中间件——四个参数（err, req, res, next）少一个就被注册成普通中间件，错误发生时被直接跳过（最阴的坑：不报错、只是失灵）。错误中间件还要放在中间件链最后：它接的是前面环节 next(err) 传递或 throw 出来的错误——控制器里 throw new CustomNotFoundError("Author not found") 之后，把 404 响应发出去的正是它。',
          lessonId: 'nodejs-controllers'
        },
        {
          q: 'EJS 的 <%= %> 与 <%- %> 差别是什么？为什么 include 局部模板必须配后者？',
          options: ['没有差别，都能输出任何内容', '<%= 输出转义后的内容（HTML 特殊字符变实体、防 XSS），<%- %> 输出原始内容；include 产出的是 HTML 片段，用 <%= 会被转义成可见文本、必须用 <%- %> 原样放行', '<%= 只能输出数字，<%- 只能输出字符串；include 输出的是对象', '<%- 比 <%= 渲染快；include 用 <%- 是为了性能'],
          answer: 1,
          explain: '一字之差是安全边界：<%= 先做 HTML 转义再输出（用户输入里的 script 标签会被转成可见文本——XSS 的默认防线），<%- %> 原样输出。所以用户数据一律走 <%=，而 include("partial") 产出的 HTML 片段必须走 <%- %>——否则页面显示的是一坨转义后的标签文字。「在输出处转义、按上下文选标签」正是表单课安全一节的全部要义（官方不建议收到数据时就 .escape()——危险字符只在使用的上下文里才危险）。',
          lessonId: 'nodejs-views'
        },
        {
          q: '为什么 GitHub Pages / Netlify / Vercel 都不能托管本课的 Node 应用？',
          options: ['因为它们收费，而课程只推荐免费服务', '因为它们不支持上传 Node 代码文件', '因为它们只会「发文件」（静态托管），不会「跑程序」——跑不了 Node 服务器、没有数据库服务', '因为它们的 CDN 节点太少，动态应用太慢'],
          answer: 2,
          explain: '分界在静态 vs 动态：静态站是预先写好的文件、每个访问者看到相同内容，发文件的 CDN 托管就够；动态站内容随用户变化，需要常驻进程跑 Node + 数据库供数据。Pages/Netlify/Vercel（React 课的部署经验）正是前一类——官方原话「它们不是我们后端的正确工具」。PaaS（Railway / Render）给 Node 应用的三样关键资源：计算实例（跑程序）、数据库、域名。',
          lessonId: 'node-path-nodejs-deployment'
        },
        {
          q: 'pg 的 Pool 与 Client 各是什么？为什么 Web 服务器用 Pool、一次性种子脚本用 Client？',
          options: ['Pool 和 Client 是同一个东西的两种叫法，随便用', 'Pool 是连接池——管理一批可复用连接、并发请求各借一条用完归还，适合常驻 Web 服务器；Client 是单条连接——populatedb.js 这类跑完即退的脚本一条就够', 'Pool 只能连本地库，Client 只能连生产库', 'Client 性能比 Pool 高，Web 服务器也应该用 Client'],
          answer: 1,
          explain: 'Web 服务器并发处理请求：每次查询新建连接代价太大、单条连接会排队成瓶颈——Pool 管一批连接借出归还。种子脚本顺序执行、跑完即退：官方明说 populatedb.js「设计为只跑一次」，一条 Client 连接就够。防注入机制与两者无关：pool.query("INSERT ... VALUES ($1)", [username]) 的参数化写法把 SQL 结构先定死、用户输入永远只是数据——拼接写法遇上 sike\'); DROP TABLE usernames; -- 就会删表。',
          lessonId: 'nodejs-using-postgresql'
        }
      ]
    },
    /* ---------- 超长续轮批次 7 阶段 3（2026-09-29，v4.11.35，World 7 后六章 13 课收组） ----------
     * 判据（配与不配理由，LESSON-PAGE-GUIDE + 用户任务书口径）：
     * 配 4 章（每章至少 1 门知识点密度足的知识课）：
     * - 「符印秘阁」6 题（nodejs/authentication）：members-only 为 Project 不出题，题源
     *   限 authentication-basics 一门知识课——但该课 20KB、知识点密度极高（Passport 三
     *   函数/会话序列化/bcrypt 加盐/中间件顺序/authenticate 幕后），单课足支撑 6 题
     *   （databases-and-sql 单知识课配 Boss 先例同型）。
     * - 「铸模工坊」5 题（nodejs/orms）：file-uploader 为 Project 不出题，题源限
     *   prisma-orm 一门知识课——三大痛点+三件套+Identity 局限+Quickstart JS 改造，密度足。
     * - 「传信云驿」6 题（nodejs/apis）：blog-api 为 Project 不出题，题源限 api-basics 与
     *   api-security 两门知识课——分离架构/REST/CORS + 会话 vs 令牌/JWT，6 题两课分摊。
     * - 「验路校场」6 题（nodejs/testing-express）：两门皆知识课——supertest 链/done/
     *   生产库红线 + 单元测试判断/NODE_ENV 切库/beforeEach+runInBand，密度中高，6 题。
     * 不配 2 章（理由写进下方断言与文档）：
     * - full-stack-projects（wheres-waldo + messaging-app）：两门皆 Project 课——官方
     *   NodeJS Project 课不出 Boss 题纪律，全 Project 章节无可出题知识课（判据：题源为空）。
     * - final-project（odin-book + conclusion）：odin-book 为 Project 课不出题、conclusion
     *   为结语祝贺信无可考知识点——finishing-up / react-conclusion「已开放但不配」先例同型
     *   （全站第三个「已开放章节不配 Boss」的真实负例，前两个为 finishing-up 与 react/conclusion）。
     * **全站 34 个 Boss 单元、214 题**。 ---------- */
    {
      "unitId": "nodejs/authentication",
      "zh": "符印秘阁",
      "desc": "「身份认证」章节综合预检（本站已开放 2 课）：Passport 三个必定义函数的分工、登录态如何靠 connect.sid cookie 跨请求保持、bcrypt 加盐哈希为什么不用单独存盐、三件中间件的顺序因果、passport.authenticate 一行背后干的事——全部改写自本站已讲解并考核过的知识点，不给成品答案。（members-only 为 Project 课不出题，题源限 authentication-basics 一门知识课。）",
      "questions": [
        {
          "q": "Passport 认证要定义的三个函数分别管什么？为什么说它们「只定义、不手动调用」？",
          "options": [
            "三个函数都要在每条路由里手动调用一次",
            "LocalStrategy 查库比对密码、serializeUser 决定往会话存什么、deserializeUser 按 id 查库还原用户挂 req.user——三者都由 passport 在幕后自动调用，done 也由它提供",
            "三个函数都是中间件，要 app.use 注册",
            "serializeUser 存整个用户对象、deserializeUser 直接读 cookie 里的密码"
          ],
          "answer": 1,
          "explain": "LocalStrategy 在 passport.authenticate() 执行时跑（拿 username/password 查库、用 bcrypt.compare 比对、done 三态报告）；serializeUser 在会话创建时决定存什么（惯例 done(null, user.id) 只存 id）；deserializeUser 在后续请求发现匹配会话时按 id 查库还原用户、done(null, user) 挂到 req.user。三个函数的执行时机与 done 参数都由 passport 掌握，所以我们「定义好放那儿」即可，自己调用反而打乱链路。",
          "lessonId": "node-path-nodejs-authentication-basics"
        },
        {
          "q": "用户登录后关掉浏览器再回来仍是登录状态——这条链路靠什么串起来？",
          "options": [
            "靠浏览器 localStorage 里存的密码每次重新登录",
            "靠服务器记住 IP 地址",
            "登录时 passport 经 express-session 创建 connect.sid cookie（关联存下的 user.id）；再次访问请求带上 cookie，passport 调 deserializeUser 按 id 查库还原用户挂 req.user",
            "靠 URL 里的查询参数带用户 id"
          ],
          "answer": 2,
          "explain": "「保持登录」的物理载体是 connect.sid cookie：登录成功时 serializeUser 把 user.id 存进会话数据、express-session 下发 cookie；之后每个请求自动带 cookie 回来，passport 发现匹配会话就用 deserializeUser 按 id 查库还原完整用户对象挂到 req.user。所以服务器不存密码、浏览器不存明文——只靠一个会话 cookie 与库里的 id 对应。",
          "lessonId": "node-path-nodejs-authentication-basics"
        },
        {
          "q": "bcrypt.hash(password, 10) 的第二参数是什么？为什么用了 bcryptjs 就不必在数据库单独存盐？",
          "options": [
            "第二参数是密码最大长度；盐要单独存进 salt 列",
            "第二参数是盐（salt）的长度/轮数——盐是拼进密码的随机字符，让相同密码得到不同哈希、防彩虹表与字典攻击；bcryptjs 的哈希算法自动把盐嵌进哈希串本身，比对时能从中取盐重算，故无需单独存盐列",
            "第二参数是加密算法编号；盐存在 cookie 里",
            "第二参数无关紧要；bcrypt 不需要盐"
          ],
          "answer": 1,
          "explain": "加盐=给密码拼接额外随机字符再哈希，使相同密码的用户哈希结果不同，挫败预计算的彩虹表与批量字典攻击。通常盐需与哈希一起存库，但 bcryptjs 把盐直接编码进返回的哈希字符串——bcrypt.compare(明文, 哈希) 能从哈希里取出盐重算比对，所以不需要单独的盐列。第二参数（如 10）控制盐轮数/成本。",
          "lessonId": "node-path-nodejs-authentication-basics"
        },
        {
          "q": "本课应用里 session → passport.session() → express.urlencoded 三件中间件的顺序为什么不能乱？",
          "options": [
            "顺序无所谓，Express 会自动排序",
            "passport.session() 依赖 session 建好的会话基础设施、authenticate 依赖 urlencoded 解析出的 req.body.username/password——顺序错了不报错、只是认证静默失灵",
            "urlencoded 必须最先，否则 session 建不起来",
            "passport.session() 必须在 session 之前，否则读不到 cookie"
          ],
          "answer": 1,
          "explain": "顺序有因果：session 先建立会话基础设施，passport.session() 才能在其上读写会话（还原 req.user）；urlencoded 负责把登录/注册表单的请求体解析成 req.body，authenticate 才能取到 username/password。顺序颠倒不会抛错，只会让认证悄悄失效——这类「静默失败」最难排查，所以官方骨架把顺序写死。",
          "lessonId": "node-path-nodejs-authentication-basics"
        },
        {
          "q": "app.post(\"/log-in\", passport.authenticate(\"local\", { successRedirect:\"/\", failureRedirect:\"/\", failureMessage:true })) 这一行，authenticate 幕后做了哪些事？failureMessage 有什么用？",
          "options": [
            "只校验密码是否正确，其余要自己写",
            "从请求体取 username/password → 跑 LocalStrategy 查库比对 → 认证通过则创建会话 cookie → 按成败重定向；failureMessage:true 让 LocalStrategy 里 done(null,false,{message}) 的错误消息进入 req.session.messages 供后续读取",
            "只负责重定向，认证要另写中间件",
            "把密码明文写进 cookie，failureMessage 控制是否加密"
          ],
          "answer": 1,
          "explain": "authenticate 是个「一行顶多步」的中间件：取请求体的 username/password、执行我们定义的 LocalStrategy（查库+bcrypt.compare）、通过则建会话 cookie（供之后请求判断登录态）、再按 successRedirect/failureRedirect 重定向。failureMessage:true 把失败时 done 第三参的 message（如 \"Incorrect password\"）收进 req.session.messages 数组，视图能读出来提示用户。",
          "lessonId": "node-path-nodejs-authentication-basics"
        },
        {
          "q": "官方 tip 用 res.locals.currentUser 自定义中间件解决什么问题？该插在什么位置？",
          "options": [
            "解决密码加密问题，插在 bcrypt 之前",
            "解决「每个需要当前用户的视图/控制器都要手动传 user」的重复劳动——插在 passport 中间件实例化之后、渲染视图之前，此后所有模板直接用 currentUser",
            "解决跨域问题，插在 cors 之后",
            "解决会话过期问题，插在 session 之前"
          ],
          "answer": 1,
          "explain": "Express 的 res.locals 在整个应用（含视图）可访问。写 app.use((req,res,next)=>{ res.locals.currentUser = req.user; next(); }) 并插在 passport 中间件之后、渲染视图之前，所有模板就能直接读 currentUser 判断登录态与显示用户名，不必在每个控制器里手动 res.render(..., {user})。这是把「取当前用户」这件重复事集中到一处。",
          "lessonId": "node-path-nodejs-authentication-basics"
        }
      ]
    },
    {
      "unitId": "nodejs/orms",
      "zh": "铸模工坊",
      "desc": "「ORM」章节综合预检（本站已开放 2 课）：raw SQL 的三大痛点与 Prisma 三件套的一一对应、Prisma Client 为什么是「按 schema 定制生成」、Identity 列与 Serial 类型的取舍、Prisma v7 只支持 TypeScript 时 Quickstart 的 JS 改造要点——全部改写自本站已讲解并考核过的知识点，不给成品答案。（file-uploader 为 Project 课不出题，题源限 prisma-orm 一门知识课。）",
      "questions": [
        {
          "q": "raw SQL 写法的三大痛点是什么？Prisma 的哪三件东西分别对应解决？",
          "options": [
            "痛点是语法难、速度慢、不支持事务；Prisma 用自动补全、缓存、事务管理器解决",
            "痛点是代码重复（每实体每项目重写查询层）、代码库看不懂表结构（要登库才懂）、手写迁移易错；Prisma Client 按 schema 生成标准 API、Prisma Schema 把定义带进代码库被版本控制、Prisma Migrate 用 migrations 文件夹与变更日志标准化迁移",
            "痛点是不会写 SQL；Prisma 让你完全不碰数据库",
            "痛点是只能连 PostgreSQL；Prisma 支持所有数据库"
          ],
          "answer": 1,
          "explain": "官方三痛点：①「代码太多」——每张表每种操作手写查询、抽工具函数又要不断改造，每实体每项目重复；②「代码库导航」——全 raw SQL 时代码库里没有一处能看懂表、关系、列类型，得登库才懂；③「修改生产数据」——手写迁移易错繁琐。三件套对应：Client 生成式 API 治重复、Schema 进代码库治导航、Migrate 治迁移。",
          "lessonId": "nodejs-prisma-orm"
        },
        {
          "q": "Prisma Client 怎么知道代码里有个 prisma.message 模型？改了 schema 之后必须做什么？",
          "options": [
            "Client 会自动扫描数据库里的表，无需任何命令",
            "Prisma Client 按 schema 定制生成——改完 schema 要在 CLI 跑 npx prisma generate，Prisma 据模型定义生成客户端，才有 prisma.message 这样与模型对应的 API",
            "要重启数据库服务",
            "要手动写一个 message 类"
          ],
          "answer": 1,
          "explain": "Prisma Client 不是通用的——它是按你的 schema 定制的。新建或修改 schema 文件后跑 npx prisma generate，Prisma 读取 models 定义生成对应的客户端对象（prisma.message.create/findMany 等），能处理 joins、过滤、排序、分页。所以「改了 schema 忘记 generate」是新手常见坑：新模型在代码里会是 undefined。",
          "lessonId": "nodejs-prisma-orm"
        },
        {
          "q": "官方警告框说 Prisma 有一个与自增主键相关的局限，是什么？为什么「多半不影响项目」？",
          "options": [
            "Prisma 不支持自增主键，必须手动发号——影响很大",
            "PostgreSQL 推荐用符合 SQL 标准的 Identity 列，但 Prisma 不支持 Identity、会改建 PostgreSQL 特有的 Serial Types；两者都能自增发号，功能等价，所以通常不影响项目，但要知道差异存在",
            "Prisma 只支持 MySQL 的自增语法",
            "Prisma 的自增列会跳号，不能用于主键"
          ],
          "answer": 1,
          "explain": "Using PostgreSQL 课学过 Identity 列（GENERATED ALWAYS AS IDENTITY，符合 SQL 标准、官方推荐）。Prisma 的局限是不支持 Identity 列，建自增主键时改用 PostgreSQL 特有的 Serial 类型。Serial 与 Identity 都能自动发号、对课程项目功能等价，所以「多半不影响」——但知道差异能在读迁移文件或对比手写 SQL 时不困惑。",
          "lessonId": "nodejs-prisma-orm"
        },
        {
          "q": "跟着官方 Quickstart 用 JavaScript（而非 TypeScript）走 Prisma v7 时，init 命令要加哪两个参数？为什么？",
          "options": [
            "加 --typescript 和 --strict，因为 Prisma 只认 TS",
            "加 --generator-provider prisma-client-js（用 JS 生成器替代默认的 TS 面向生成器）与 --no-skills（不默认安装 Prisma Skills 目录的 AI 特性）；因为 Prisma v7 已决定只继续支持 TypeScript，Quickstart 默认面向 TS",
            "加 --javascript 和 --no-ai",
            "不用加参数，Prisma 会自动检测 JS"
          ],
          "answer": 1,
          "explain": "Prisma 近期决定只继续支持 TypeScript，v7 Quickstart 默认面向 TS。用 JS 要按官方九步改造表：init 加 --generator-provider prisma-client-js 换生成器、加 --no-skills 退出 AI 特性默认安装；还要把 prisma7.config.ts 改名 .js、两处 import 带 .js 扩展名、跳过 tsc 相关步骤、用 node script.js 运行。网上大量旧 Prisma 教程对不上 v7，以官方文档+课内改造表为准。",
          "lessonId": "nodejs-prisma-orm"
        },
        {
          "q": "为什么说「schema 文件住进代码库、被版本控制追踪」是 ORM 解决「代码库导航」痛点的关键？",
          "options": [
            "因为 schema 文件很小，省空间",
            "因为数据结构（表、列、关系）从此在代码里可见、可 diff、可评审——不登数据库也能看懂项目结构，团队协作时 schema 变更像代码一样有历史",
            "因为版本控制会自动备份数据库数据",
            "因为 schema 文件能替代数据库"
          ],
          "answer": 1,
          "explain": "raw SQL 时代表结构与关系只存在于数据库里，代码库无处可看——理解项目要同时读代码和登库。Prisma Schema 把 models、字段、@relation 关系写进代码库的文件，被 git 追踪：数据结构变得可见、可 diff、可 code review，schema 演进像代码一样有提交历史。这正是「把数据库定义带进代码库」对导航痛点的解法。",
          "lessonId": "nodejs-prisma-orm"
        }
      ]
    },
    {
      "unitId": "nodejs/apis",
      "zh": "传信云驿",
      "desc": "「API」章节综合预检（本站已开放 3 课）：前后端分离（Jamstack）的形态与取舍、res.json 与 res.render 的分野、REST 资源导向 URI 与 HTTP 动词表、同源策略为什么逼出 CORS、会话认证与令牌认证的载体差异、JWT 放 Authorization Bearer 头的流程——全部改写自本站已讲解并考核过的知识点，不给成品答案。（blog-api 为 Project 课不出题，题源限 api-basics 与 api-security 两门知识课。）",
      "questions": [
        {
          "q": "前后端分离模式（Jamstack）相比「一个应用同时托管数据库与视图模板」有什么好处？",
          "options": [
            "好处只有部署更便宜",
            "更模块化（业务逻辑不与视图逻辑混在一起）、一个后端源可服务多个前端（网站/桌面/移动）、前端可自由用 React/Vue 做纯前端单页应用",
            "好处是再也不用数据库",
            "好处是不用写后端代码"
          ],
          "answer": 1,
          "explain": "官方给了三条：①模块化——业务逻辑与视图逻辑分家；②一后端多前端——同一套 API 服务网站、桌面、移动应用；③前端自由——可用 React/Vue 做单页应用。部署形态：后端+数据库上服务器（Heroku/DigitalOcean），前端上静态托管（GitHub Pages/Netlify）。代价是跨域（CORS）与两次部署要各自照看。",
          "lessonId": "nodejs-api-basics"
        },
        {
          "q": "「让 Express 说 JSON 而不是 HTML」技术上要做什么？REST 的其他要素（无状态、可缓存）需要专门实现吗？",
          "options": [
            "要装一个 JSON 框架并重写全部路由",
            "本质上只需把信息传给 res.json() 而不是 res.send() 或 res.render()；REST 的无状态、可缓存等要素用 Express 输出 JSON 时就默认覆盖了，不必专门实现",
            "要把数据库换成 JSON 数据库",
            "要用 WebSocket 替代 HTTP"
          ],
          "answer": 1,
          "explain": "官方原话「就这么简单」：res.json() 替代 res.render()/res.send() 即可让 Express 输出 JSON。REST 实际技术定义里的其他要素（statelessness 无状态、cacheability 可缓存性等）用 Express 出 JSON 时默认覆盖——真正要花心思的是「如何组织端点 URI」（资源导向 + HTTP 动词），不是重新实现 REST 理论。",
          "lessonId": "nodejs-api-basics"
        },
        {
          "q": "把 /api/getAllPostComments/:postid 改写成 REST 惯例形态，并说明依据。",
          "options": [
            "/api/getComments?post=:postid——用查询参数更 REST",
            "/posts/:postid/comments——REST 资源导向：URI 直接指资源（名词 posts/comments），不用 getAll 这类动词名，动作交给 HTTP 动词（GET=读）；每资源两个 URI（集合与单个）且可嵌套",
            "/api/comments/getAll/:postid——保留 getAll 更符合语义",
            "GET /getAllPostComments——动词放最前面"
          ],
          "answer": 1,
          "explain": "REST 资源导向命名：URI 只指资源（posts、comments 这些名词），不用 getAllPostComments/savePostInDatabase 这类动词名——动作由 HTTP 动词表达（POST 建/GET 读/PUT 改/DELETE 删）。每资源两个 URI（集合 /posts 与单个 /posts/:postid），可嵌套：/posts/:postid/comments 是该文章的评论集合，再嵌 /:commentid 定位单条。动词进 URI 会让端点爆炸、也无法凭惯例猜端点。",
          "lessonId": "nodejs-api-basics"
        },
        {
          "q": "为什么下一个项目（API 与前端分开部署）必须在服务器上启用 CORS？开发期与生产期的配置口径有何不同？",
          "options": [
            "CORS 是为了加密数据；开发生产都要全开",
            "前后端不同域名→浏览器同源策略拦跨源请求→服务器要启用 CORS 放行前端；开发期允许任何源（让迭代快），生产期要专门屏蔽除自己前端之外的一切源",
            "CORS 是为了压缩响应；只需生产开",
            "同源策略只在生产环境生效，开发期不用管"
          ],
          "answer": 1,
          "explain": "同源策略限制网页向「提供该页面的源」之外的源发请求；API 与前端分域名部署后，前端调 API 属跨源、会被浏览器拦，服务器要用 CORS（Express 官方 cors 中间件）放行。官方口径：开发期允许任何源可以接受（让开发容易）；生产环境多半要专门屏蔽除自己前端网站外任何源——全放开的生产 CORS 等于允许任何站点带用户凭据调你的接口。",
          "lessonId": "nodejs-api-basics"
        },
        {
          "q": "前后端分离后，为什么令牌（token）认证常比会话 cookie 更顺手？官方给的令牌策略两个安全收益是什么？",
          "options": [
            "令牌更快因为不查数据库；收益是速度和体积",
            "会话 cookie 在跨域分离部署时有一堆额外细节（跨站 cookie 可能是真正的头疼事）；令牌改为登录签发、放请求头传递，不依赖 cookie 自动机制。两个收益：用户名密码不再随每请求反复暴露（不被泄露）、令牌可过期以增强安全",
            "令牌不需要服务器验证；收益是完全无状态",
            "cookie 不能用于 HTTPS；令牌可以"
          ],
          "answer": 1,
          "explain": "会话模式靠浏览器自动带 connect.sid cookie，前后端分到不同域名后跨站 cookie 有很多细节（官方在 blog-api 明说可能是 real headache）。令牌模式：登录时服务器签发一个安全令牌，前端放进之后每个请求的 header——不依赖 cookie 自动机制，跨域干净。两收益官方明说：①凭据不反复传输（不被 compromised）；②可让令牌过期（expire）增强安全。Passport 流程相似，只是检查的载体从 cookie 换成令牌。",
          "lessonId": "nodejs-api-security"
        },
        {
          "q": "JWT 在请求里怎么携带？官方为什么在选读区放一个「反对 JWT」的视频？",
          "options": [
            "拼进 URL 查询串；反对视频是说 JWT 太慢",
            "放进 Authorization 头、用 Bearer schema（Authorization: Bearer <token>）；官方放反方视频因为「不是所有人都同意 JWT 是存储认证数据的最佳方式」——培养选型判断、别把 JWT 当银弹",
            "存进 localStorage 的密码字段；反对视频是说 localStorage 不安全",
            "放在请求体里；反对视频是营销"
          ],
          "answer": 1,
          "explain": "blog-api 官方指定：JWT 用带 Bearer schema 的 Authorization 头发送、客户端存 localStorage（保持简单；cookie/access-refresh 等替代方案将来再探索）。把令牌拼进 URL 会进日志与浏览器历史，是反例。Additional resources 特意放反方视频：JWT 不是无可争议的最佳方案，知道争论与坑存在，将来做认证选型才有超出教程的判断力。",
          "lessonId": "nodejs-api-security"
        }
      ]
    },
    {
      "unitId": "nodejs/testing-express",
      "zh": "验路校场",
      "desc": "「测试 Express」章节综合预检（本站已开放 2 课）：可测性前提「导出模块」、supertest 的 expect 链与 done 参数、POST 用 .then 串 GET 验副作用、「绝不对生产库跑测试」、单元测试必要性判断（流行库已自测）、NODE_ENV 切库与 Jest 的 --env-file 特殊性、beforeEach 事务重置 + --runInBand 串行——全部改写自本站已讲解并考核过的知识点，不给成品答案。（题源限 testing-routes-and-controllers 与 testing-database-operations 两门知识课。）",
      "questions": [
        {
          "q": "测 Express 路由的第一前提是什么？为什么测试文件里要新建一个 app 而不直接 require 项目的 app.js？",
          "options": [
            "前提是先启动服务器；直接 require app.js 才能测真实环境",
            "前提是被测代码必须在导出的模块里；app.js 只含启动逻辑（有 app.listen）不测，index.js 导出 router 才测——测试里新建一个不 listen 的迷你 app 挂上 router，避免启动真服务器、还能跳过无关配置",
            "前提是要用真实数据库；require app.js 是为了连库",
            "前提是装 supertest；直接测 app.js 更简单"
          ],
          "answer": 1,
          "explain": "可测性第一前提：被测代码在导出模块里。app.js 只管 app.listen 启动、不含业务逻辑，测它会把真服务器拉起来（端口占用、进程退不出）；index.js 用 Express.Router 导出路由、含要测的逻辑。测试文件里新建 express app、挂 urlencoded 与被测 router（不 listen），supertest 的 request(app) 直接对它发请求——隔离、快、跳过无关配置。",
          "lessonId": "nodejs-testing-routes-and-controllers"
        },
        {
          "q": "解读 request(app).get(\"/\").expect(\"Content-Type\", /json/).expect({name:\"frodo\"}).expect(200, done) 的三段 expect 与 done。",
          "options": [
            "三段 expect 分别测三个不同路由；done 是路由处理函数",
            "三段 expect 依次断言响应头（Content-Type 匹配 /json/ 正则）、响应体（与 {name:\"frodo\"} 深比对）、状态码（200）；done 传进最后一个 expect，由 SuperTest 在断言完成后替我们调用以标记异步测试结束",
            "expect 只能测状态码；done 是可选的装饰",
            "done 必须传进第一个 expect"
          ],
          "answer": 1,
          "explain": ".expect 可链式断言多个维度：响应头（正则匹配 Content-Type）、响应体（对象深比对）、状态码。done 是多数测试库标记异步测试完成的信号——SuperTest 让你把它传进最后一个 .expect、由它替我们调用（官方原话 Thanks, SuperTest!）。漏传 done 或传错位置，异步断言没跑完测试就被判结束，会超时挂起或假绿。",
          "lessonId": "nodejs-testing-routes-and-controllers"
        },
        {
          "q": "第二个测试为什么用 .then() 把 GET 包在 POST 之后？官方对「用真实数据库跑这些测试」的口径是什么？",
          "options": [
            ".then 是为了好看；可以直接对生产库跑测试只要小心",
            "POST 把 item push 进数组、GET 返回数组——要验证「POST 真写进去了」，必须等 POST 的 promise resolve 后再 GET 检查（先操作后验证）；官方红线：绝不对生产数据库跑测试代码，真实库场景要用测试库或 mock 库",
            ".then 会跳过 POST；生产库跑测试更快",
            "GET 必须在 POST 之前；数据库随便用"
          ],
          "answer": 1,
          "explain": ".type(\"form\").send({item:\"hey\"}) 发 POST，.then 等 promise resolve 后发 GET 检查 array 是否含 \"hey\"——这是「先操作后验证」的集成测试形态，用第二个请求验证第一个的副作用。数据库口径斩钉截铁：you do not want to run test code on your production database（有损坏用户数据的风险）；本课用内存数组绕开，真实库要配 test_ 独立库与隔离（下一课内容）。",
          "lessonId": "nodejs-testing-routes-and-controllers"
        },
        {
          "q": "官方「单元测试——你到底需不需要？」的判断标准是什么？哪些该测、哪些不必？",
          "options": [
            "所有碰数据库的代码都必须测",
            "不必测：用 pg 等流行库直接读写（pg 对自身动作已有大量测试）、只是调别的模块函数提供 JSON API；该测：复杂查询（确保用对了）、自己的过滤/排序/加工逻辑——且自己的代码最好抽成独立模块、与数据库操作分离，不碰库就能测",
            "只测 pg 库本身",
            "数据库代码一律不测"
          ],
          "answer": 1,
          "explain": "官方教你怀疑：pg（想必所有流行 db 模块）对自身全部动作已有大量测试——只是调它读写、只是提供 JSON API 调别的模块函数，那些已被覆盖，重复测是负资产。该测的是复杂查询的正确性、以及你自己写的过滤/排序/数据加工逻辑；后者最好抽成独立模块与数据库操作分离，不碰库就能测。Assignment 让你亲眼看 pg 的 tests 目录，就是体会「流行库已自测」。",
          "lessonId": "node-path-nodejs-testing-database-operations"
        },
        {
          "q": "为什么 Jest 用不了 --env-file 加载环境变量？官方替代方案是什么？NODE_ENV 上有什么「无需花哨」的巧合？",
          "options": [
            "Jest 不支持环境变量；要硬编码连接串",
            "--env-file 是 node CLI 的旗标，跑测试时不直接调用 node 所以用不了——替代用 process.loadEnvFile() 放进 Jest global setup file；且 Jest 默认把 NODE_ENV 设为 test，会覆盖 .env 的 development，正好被切库三元式用来自动选中测试库",
            "Jest 会自动加载 .env；不用做任何事",
            "--env-file 在 Jest 里改名叫 --env"
          ],
          "answer": 1,
          "explain": "--env-file/--env-file-if-exists 是 node 命令行旗标，Jest 有自己的启动方式、不直接调 node，所以加了不生效（process.env 全 undefined）。替代：process.loadEnvFile() 编程式加载，可放进 Jest global setup file。巧合：Jest 默认 NODE_ENV='test' 覆盖 .env 里的 development——connectionString 三元式（NODE_ENV==='test' ? TEST_DATABASE_URL : DATABASE_URL）据此在测试里自动切到测试库，「无需做花哨的事」。",
          "lessonId": "node-path-nodejs-testing-database-operations"
        },
        {
          "q": "beforeEach 里用 prisma.$transaction([deleteMany...]) 重置表、以及给 test 脚本加 --runInBand，各解决什么问题？",
          "options": [
            "$transaction 是为了加速；--runInBand 让测试并行更快",
            "$transaction 把多个 deleteMany 包成一个事务（全成功或全失败，不留半重置状态）实现测试间隔离——每个测试前把库重置回初始态、任何测试不依赖其他测试；--runInBand 强制多文件串行跑，因为 Jest 默认并行会让不同文件同时操作测试库互相搅混",
            "$transaction 会删库；--runInBand 是可选的性能优化",
            "beforeEach 重置没必要；--runInBand 会关掉数据库"
          ],
          "answer": 1,
          "explain": "测试隔离原则：任何测试不依赖其他测试（不希望一个测试因「另一个没加/没删某行」而失败）。beforeEach 用 $transaction 一次事务清空相关表——事务保证多个 deleteMany 全成功或全失败，不会「users 清了 projects 没清」留半重置态。多文件时 Jest 默认并行执行，A 文件的 beforeEach 清表可能删掉 B 文件正断言的数据——加 --runInBand 串行跑，配合 beforeEach 重置才隔离干净。",
          "lessonId": "node-path-nodejs-testing-database-operations"
        }
      ]
    },
    /* ---------- World 8 求职之路（超长续轮批次 7 阶段 4，2026-09-29，v4.11.36，World 8 收组、全站 197 课收官）
     * 「秣马营」6 题（getting-hired/preparing-for-your-job-search——networking 2 / strategy 1 /
     * starts-with-you 1 / companies-want 1 / prepare 1；htcww 导论与 portfolio Project 不出题）+
     * 「折桂台」7 题（getting-hired/applying-to-and-interviewing-for-jobs——collect 1 / qualify 1 /
     * applying 1 / interview 2 / handling 2；resume Project 与 conclusion 结语信不出题，finishing-up
     * 先例）。unitId 经 pathBossUnitId('getting-hired', …) 构造。**负例名单迁移**：
     * getting-hired/preparing-for-your-job-search 从 map-boss「已开放但不配」负例名单移出转正
     * （本章开放即配）；applying-to-and-interviewing-for-jobs 同轮直接转正入列。**World 8 全 14 课
     * 就此收组，全站 36 个 Boss 单元、227 题——197 课全部开放，Boss 覆盖全部 8 个 World**。 ---------- */
    {
      "unitId": "getting-hired/preparing-for-your-job-search",
      "zh": "秣马营",
      "desc": "「准备求职」章节综合预检（本站已开放 7 课）：隐藏就业市场与人脉纪律、九步路径、饥渴与绝望的区分、招聘三要素、GitHub 权威仓库。题源限本章知识课 6 门（how-this-course-will-work 为课程使用说明导论不配综合考点、building-your-personal-website 为 Project 课不出题——全站纪律），全部改写自本站已讲解的知识点。",
      "questions": [
        {
          "q": "按「职业人脉」课官方引用的数据，高达多少比例的工作根本不发布在网上？进入那个市场的入场券是什么？",
          "options": [
            "约 20% 不公开；入场券是招聘板海投——投得越广，进隐藏市场的概率越大",
            "高达 80% 不公开；入场券是职业人脉——让网络把你视作「拥有特定技能集的可靠个人」，机会出现时他们想到你、给你风声、甚至直接推荐你",
            "约 50% 不公开；入场券是精致的简历——简历写得越好越容易被隐藏职位发现",
            "高达 80% 不公开；入场券是招聘官中介——他们手里握有隐藏市场的内部渠道"
          ],
          "answer": 1,
          "explain": "官方数据（Forbes 出处）：高达 80% 的工作不发布在网上，刷招聘板只能看到约 20% 的公开市场。进入隐藏市场靠人脉：网络把你视作可靠的人，机会出现时想到你；许多公司给成功内推的员工发奖金，激励双向。招聘板海投恰是「在羊群里竞争」；招聘官对初级开发者反而乏力——其激励是薪资百分比抽成，初级薪资低你不会是优先客户。",
          "lessonId": "node-path-getting-hired-professional-networking"
        },
        {
          "q": "「职业人脉」课里官方说的「不要冷启动（approach people cold）」指什么？正确做法是什么？",
          "options": [
            "不要主动联系陌生人——只接受熟人转介绍",
            "不要在公开评论区提问——所有请求都走私聊",
            "不要突兀地请人连接或求人办事（「帮我进你们公司」「请当我的导师」）——以对人的真实兴趣开启对话、让对话关于他们而不是你，初次聊得好再跟进请求连接",
            "不要暴露自己在找工作——把求职意图藏到对方先提起为止"
          ],
          "answer": 2,
          "explain": "人脉经济奖励真实性与相互尊重：人们很忙，把有限时间留给认识与尊重的人，突兀索取可能被视为不尊重。正确做法像约会——不会第一次谈话就请人做恋人：找共同点、主动倾听、追问、力所能及提供帮助，初次聊得好再跟进请求连接。不是「不联系陌生人」（可以从共同兴趣开启对话），也不是「藏起求职意图」（真实性恰是要求）。",
          "lessonId": "node-path-getting-hired-professional-networking"
        },
        {
          "q": "「策略」课官方九步路径的前三步是什么？没有计划的两种典型失败形态是什么？",
          "options": [
            "打磨简历 → 建作品集 → 海投申请；失败形态是简历太长与作品集太少",
            "弄清你的需求与技能 → 弄清公司需要什么、提供什么 → 提前铺垫提高胜率；失败形态是往每个招聘板狂发简历纳闷为什么没成果，或走完漫长痛苦流程才发现根本不想要那份工作",
            "收集线索 → 筛选线索 → 申请；失败形态是线索收集太少与筛选不严",
            "建人脉 → 面试 → 谈薪；失败形态是人脉不广与谈判不狠"
          ],
          "answer": 1,
          "explain": "九步路径前三步（弄清需求与技能 / 弄清公司需要什么提供什么 / 提前铺垫提高胜率）正是「准备求职」章的主线；第 4–8 步（收集 / 筛选 / 接触并申请 / 面试 / 处理 offer）是「投递与面试」章；第 9 步 Profit?? 是官方的程序员玩笑（原文自带双问号）。无计划的两种死法官方原文点名：spamming 简历纳闷没成果；或流程走完才发现不想要——彻底浪费时间。",
          "lessonId": "node-path-getting-hired-strategy"
        },
        {
          "q": "「一切从你开始」课里官方的 hunger（饥渴）与 desperation（绝望）之分是什么？给出的指令是什么？",
          "options": [
            "饥渴是好状态、绝望是坏状态——两者天生对立，绝望的人不可能饥渴",
            "饥渴关乎追求奖励（处境舒适、优化机会时也能饥渴），绝望关乎逃避失败（「绝对必须」拿到那份工作时出现）——指令：想尽一切办法别让自己听起来绝望，哪怕你真的绝望",
            "两者都是积极信号，雇主同样喜欢——展示出来即可",
            "绝望是初学者的必经阶段——先绝望后才有资格谈饥渴"
          ],
          "answer": 1,
          "explain": "官方注脚的精确区分：hunger 关乎追求奖励——处境舒适时也能饥渴；desperation 关乎逃避失败——绝对必须拿到那份工作时出现。指令只有一句：想尽一切办法别让自己听起来绝望，哪怕你真的绝望。原因在「投递」课展开：没人想雇绝望的人，它违反招聘方依赖的社会证明。两者不是天生对立（绝望的人也能把表达管理成饥渴形态），更不会被同样喜欢。",
          "lessonId": "node-path-getting-hired-it-starts-with-you"
        },
        {
          "q": "「公司想要什么」课总结的招聘经理找的三样东西是什么？哪一样常决定成败？",
          "options": [
            "学历、经验年限、技术栈——经验年限决定成败",
            "能力（Capability）、动机（Motivation）、契合（Fit）——能力与动机是「被考虑」的最低门槛，契合常是决定性一票：几乎所有招聘流程让全团队评估后期候选人，任何一人反对就不雇",
            "简历、作品集、面试表现——作品集决定成败",
            "能力、动机、契合——三者权重完全相等，缺一不可"
          ],
          "answer": 1,
          "explain": "官方三要素：能力（尽快创造价值——相关经验+技术门槛）、动机（成长曲线而非静态直线）、契合（团队能否愉快共事）。前两者是被考虑的最低门槛；成败往往在契合——几乎所有流程让全团队评估后期候选人，「团队成员想不想整天与你共事」常有否决权。不是等权重（契合有否决性）；A/C 是证据载体清单，不是官方三要素框架。",
          "lessonId": "node-path-getting-hired-what-companies-want"
        },
        {
          "q": "「你可以做的准备」课里官方关于 GitHub 与个人网站关系的加粗论断是什么？",
          "options": [
            "个人网站就是开发者的作品集——GitHub 只是备份",
            "GitHub 与个人网站同等重要，必须成对建设",
            "开发者身份的作品集就是 GitHub——你可能有个人网站，但 GitHub 仍是技术能力的权威仓库；忽视它，后果自负",
            "两者都不重要——雇主只看简历与面试表现"
          ],
          "answer": 2,
          "explain": "官方加粗原话：Your portfolio as a developer is GitHub。个人网站（本章 Project 课）是「直达管道」与叙事载体，与 GitHub 互补——但技术能力的权威仓库（authoritative repository）是 GitHub，官方原话「Ignore it at your peril」。档案修整标准课里也给了：项目组织好、README 有描述与线上链接，让看项目的人立刻看到你的才华。",
          "lessonId": "node-path-getting-hired-what-you-can-do-to-prepare"
        }
      ]
    },
    {
      "unitId": "getting-hired/applying-to-and-interviewing-for-jobs",
      "zh": "折桂台",
      "desc": "「投递与面试」章节综合预检（本站已开放 7 课）：四级来源优先级、期望值筛选、迭代式申请纪律、技术面试的极限反应、刷题方法论、offer 处理两大纪律。题源限本章知识课 5 门（building-your-resume 为 Project 课不出题、conclusion 为结语祝贺信不出题——finishing-up 先例），全部改写自本站已讲解的知识点。",
      "questions": [
        {
          "q": "「收集工作线索」课的四级来源优先级里，第 2 级是什么？官方为什么把招聘板评为「pretty much awful」垫底？",
          "options": [
            "第 2 级是公司官网招聘页；招聘板垫底因为上面的职位信息大多过时",
            "第 2 级是直达真人的直接发布（如开发者把本公司空缺发到本地邮件列表）——邮件另一端是另一个真人；招聘板垫底因为在上面你进入了「羊群」：与海量申请者同质竞争、到达真人的概率最低",
            "第 2 级是招聘官渠道；招聘板垫底因为要付费才能使用",
            "第 2 级是社交媒体求职小组；招聘板垫底因为职位太多选不过来"
          ],
          "answer": 1,
          "explain": "官方四级排序（最高概率/最高质量优先）：①你的人脉（含社区认识的人）②直达真人的直接发布——灵魂是「邮件另一端是另一个真人」（开发者而非招聘官发本公司空缺）③直接发布（公司官网招聘页，通常也到达具体的人）④招聘板——官方原话 pretty much awful, you're in the herd now。公司官网是第 3 级不是第 2 级；招聘官在「On recruiters」节被单独分析（初级阶段价值有限），不在四级来源里。",
          "lessonId": "node-path-getting-hired-collecting-job-leads"
        },
        {
          "q": "「筛选工作线索」课的「期望值」公式是什么？它主要防的是什么事故？",
          "options": [
            "期望值 = 薪资 × 公司规模；防的是进小公司",
            "期望值 = 以合理努力拿到工作的概率百分比 × 工作的价值；按它排序知道哪些工作最值得花时间——防「被卷进流程」：在根本不会接受的工作上申请、面试越推越深、浪费大量时间，这种事出人意料地容易发生",
            "期望值 = 申请数 × 回复率；防的是申请量不足",
            "期望值 = 「最好有」得分总和；防的是错过好公司"
          ],
          "answer": 1,
          "explain": "官方方法：加一列「以合理努力拿到这份工作的概率百分比」，乘以上一步按必须有/最好有算出的「工作价值」，按期望值排序——直接得到「哪些工作最值得你花时间」。深层目的是防 sucked into a process：投了不会接受的工作，流程一轮轮推进、沉没成本绑架决策——官方说这种事故 surprisingly easy。「练习性申请」仍合法，筛选让你知道哪些公司值得拿来练（清单底部的公司）。",
          "lessonId": "node-path-getting-hired-qualifying-job-leads"
        },
        {
          "q": "「申请」课官方第一条纪律为什么是「别把申请一次性全发出去」？进攻顺序是什么？",
          "options": [
            "因为一次全发会被招聘板判定为垃圾投递；顺序是先投梦厂——趁岗位还开着",
            "因为回音与后续任务会同时涌来、你会彻底招架不住（面试撞车、定制材料来不及、跟进漏发）；当作迭代过程：定每日申请数目标（3/5/10），从清单底部「勉强才会去」的公司练手，手感稳了再攻顶部真正想去的",
            "因为申请记录会混乱；顺序是随机投，反正都一样",
            "因为要等一份完美简历做好再开始投；顺序是按薪资从高到低"
          ],
          "answer": 1,
          "explain": "官方理由：一次性全发，回音与任务同时涌来会 totally overwhelmed。正确节奏是迭代式：每天有明确的申请数目标（3 份？5 份？10 份？），从反馈识别错误、次日改进——官方特意注明这不是拖延或一天一份的借口。顺序从底部开始：先投「勉强才会去」的公司练手，申请与面试手感稳了再攻清单顶部——梦厂面对的是你的 v3 简历与 v3 面试状态。",
          "lessonId": "node-path-getting-hired-applying-for-web-development-jobs"
        },
        {
          "q": "「面试」课的技术面试里，被推到「不会」的极限时官方给的正确反应是什么？什么解法被明确说完全 OK？",
          "options": [
            "沉默思考直到想出答案——开口求助等于承认不行；暴力解法丢人",
            "不知道就说不知道、与面试官一起弄明白；把思路与卡点讲出来、「真实世界我会 Google 这个函数」就说出来；暴力（低效）解法完全 OK——常是最好的起点，之后通常被问怎么改进",
            "立刻放弃该题请求换题；白板上只写优雅解",
            "背出提前 memorize 的题解；暴力解法可以但不出声思考"
          ],
          "answer": 1,
          "explain": "官方要领：最大的资产是诚实与求知欲；推到极限本身常是考点（看你面对「不会」的反应）。正确动作：出声思考（每步说为什么）、把卡点讲出来、给真实世界的找解法方式（Google 特定函数——Say so!）。暴力解法完全 OK：先做对确认对问题的感觉、再被问如何改进——远好于追求惊艳解法而时间耗尽、无物可示。面试官希望你成功：对他们最难熬的是看人默默崩溃、越来越沮丧、却不求助也不暴露思路。",
          "lessonId": "node-path-getting-hired-preparing-to-interview-and-interviewing"
        },
        {
          "q": "官方 lesson-note 对「just go grind Leetcode」的流行建议给了什么纠偏？两个类比是什么？",
          "options": [
            "刷题是唯一正道——题海战术见效最快；类比是「熟能生巧」与「读书百遍」",
            "与不会的算法搏斗几小时/几天价值很小——常见算法有固有「戏法」；更有产出的是先搜算法/伪代码、再练需要该算法的题。类比一：不知勾股定理求斜边感觉不可能、知道戏法后轻而易举；类比二：题目需要树的 DFS 而你零认知——坐几天收益极小，先搜常见树算法再回来",
            "别刷题、直接读题解背答案即可；类比是「站在巨人肩上」",
            "只刷新题不复习旧题；类比是「流水不腐」"
          ],
          "answer": 1,
          "explain": "官方 lesson-note（A note on problem solving sites）：这些网站的真实价值来自有产出地使用。常见算法通常有一个「戏法」（trick）或特定步骤集——备面试时与一道不会的题搏斗几小时/天的价值很小；更有产出：先搜索算法/伪代码，再练需要该算法意识的题。两个类比是官方原文：勾股定理与树的 DFS。不是「不刷题」（学会戏法后仍要练），也不是「只背题解」（练习不可省）。",
          "lessonId": "node-path-getting-hired-preparing-to-interview-and-interviewing"
        },
        {
          "q": "「处理工作 offer」课官方为什么全大写写「DO NOT ACCEPT RIGHT AWAY」？口头 offer 的正确动作是什么？",
          "options": [
            "因为当场接受显得不专业；口头 offer 应婉拒后等书面版",
            "因为此前全程由对方掌控、他们能拖就拖，现在轮到你了——他们已投入大量精力，任何讲理的公司不会因你多要几天或几千美元放你走，应给你至少一周做决定；口头 offer 让他们把细节邮件给你——不是所有 offer（尤其口头的）都是真的，公司会撤回，文件签了之前别买房子",
            "因为需要时间对比其他公司薪资；口头 offer 自己记进表格即可",
            "因为当场接受就失去谈判资格；口头 offer 与书面等效可直接履约"
          ],
          "answer": 1,
          "explain": "底气来自力量对比反转：投递季他们掌控、能拖就拖（也许在等更好的开发者）；offer 发出后他们已投入大量精力，讲理的公司不会因几天或几千美元放你走——官方基准是至少一周决策期。口头 offer 两条纪律：让细节落邮件；别当 done deal——官方见过公司因内部或外部原因撤回 offer，「文件签了之前别去买房子」。",
          "lessonId": "node-path-getting-hired-handling-a-job-offer"
        },
        {
          "q": "官方说拿到 offer 后「你能做的最好的事」是什么？对那些一直拖延的公司该怎么用这个筹码？",
          "options": [
            "立即接受锁定结果；对拖延的公司不再跟进",
            "GET ANOTHER OFFER——谈判时没有什么比另一家公司的 offer 更好用，它给你走开的能力（分寸：目标不是得罪每个给你 offer 的人，但要利用）；同时给每一家你有兴趣的拖延公司发邮件「我已有 offer、需相对尽快做决定」——手里有 offer 等于突然拥有此前从未有过的全部社会证明，用它",
            "把 offer 发到社交媒体施压；拉黑拖延的公司",
            "停止一切求职流程专心等入职；offer 在手不必再催任何公司"
          ],
          "answer": 1,
          "explain": "官方原话：What's the best thing you can do? GET ANOTHER OFFER!——另一家公司的 offer 给你走开的能力（the ability to walk away），是最强谈判筹码。分寸：不该无耻冷酷地资本家式操作（目标不是得罪所有人），但要利用。配套动作：给每家现实中感兴趣的拖延公司发邮件说明「已有 offer、需相对尽快决定」——机制是社会证明：还没在任何地方工作过的你，拿到 offer 那一刻突然拥有了全部社会证明。",
          "lessonId": "node-path-getting-hired-handling-a-job-offer"
        }
      ]
    }
  ];

  function bossForUnit(unitId) {
    return BOSSES.find(boss => boss.unitId === unitId) || null;
  }

  /* 路径课 Boss unitId 命名约定的唯一构造入口（2026-09-26 批次 4 起）：
   * `<courseId>/<sectionId>`。app.js 地图侧入口与测试取 id 一律经它，
   * 不在别处手拼字符串——约定若再变，只改这一处。 */
  function pathBossUnitId(courseId, sectionId) {
    return `${courseId}/${sectionId}`;
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
    bossForUnit, pathBossUnitId, ratingOf, scoreBoss, emptyBossRecord, recordAttempt, bossBrief
  };
})();
