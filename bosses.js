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
