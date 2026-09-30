/* courses/nodejs.js — World 7「NodeJS」已开放课程正文（v2 自足格式）。
 *
 * 沿用 courses/ 按 World 分文件的架构（2026-09-25 路径课试点批次 1 首建，
 * 复用事实见 REUSE-NOTES.md「路径课试点轮复用事实」节）：lessons.js 继续作为
 * Foundations 的唯一事实源不动（46 课已发布上线，是稳定资产）；本文件只放
 * World 7 已开放的课程，未开放的章节与课程不得夹带正文（红线）。
 *
 * 数据约定（与 intermediate-html-and-css.js / javascript.js /
 * advanced-html-and-css.js / react.js / databases.js 同一套）：
 *   - 每课的 id 就是 curriculum.js 里的原始 slug，原样沿用、不得改写；
 *     **World 7 slug 前缀混杂**（官方 URL 事实）：多数课是 nodejs- 前缀，
 *     少数是 node-path-nodejs- 前缀（本批 4 门：introduction-to-express /
 *     mini-message-board / deployment / inventory-application），不得统一改写；
 *   - group 字段是本文件 groups 数组的数字下标（从 0 起且在本文件内连续）；
 *     World 7 共 8 个章节，groups 全 8 项建文件时写全（含未开放六章占位）；
 *     汇总层偏移 32 = Foundations 8 + World 2 4 + World 3 8 + World 4 3 +
 *     World 5 8 + World 6 1（批次 7 阶段 4 订正：原注释误写「偏移 34 /
 *     World 6 3」——databases.js 实际只有 1 个 group，运行时以 lesson-sources
 *     合并序现算 base.groups.length 为准，课渲染从未受此笔误影响）；
 *   - 课的字段结构与 lessons.js 完全同构（19 字段 v2 自足格式）；
 *   - 中文课名按 catalog.js 惯例自拟，登记在本文件头注释与 SOURCES.md：
 *     超长续轮批次 7 阶段 1（2026-09-28，v4.11.34）「NodeJS 入门」6 课：
 *     Introduction to the Back End → 后端入门；
 *     Introduction: What is NodeJS? → 引言：什么是 NodeJS？；
 *     Getting Started → 起步；
 *     Debugging Node → 调试 Node；
 *     Project: Basic Informational Site → 项目：基本信息站点（project_ 前缀
 *       去前缀直译第 21 例）；
 *     Environment Variables → 环境变量。
 *     「Express」11 课：
 *     Introduction to Frameworks → 框架简介；
 *     Introduction to Express → Express 简介；
 *     Routes → 路由；
 *     Controllers → 控制器；
 *     Views → 视图；
 *     Project: Mini Message Board → 项目：迷你留言板（直译第 22 例）；
 *     Deployment → 部署；
 *     Forms and Data Handling → 表单与数据处理；
 *     Installing PostgreSQL → 安装 PostgreSQL；
 *     Using PostgreSQL → 使用 PostgreSQL；
 *     Project: Inventory Application → 项目：库存管理应用（直译第 23 例）。
 *   - **官方 Markdown 路径三处特殊事实（GitHub API 实列 + 17/17 课页 edit
 *     链接逐条实证）**：
 *     ① NodeJS 课程目录是 nodeJS/（驼峰 JS 大写），入门子目录
 *        introduction_to_nodeJS 也是驼峰；
 *     ② 两门共有课住 shared/the_back_end/（NodeJS 与 Ruby 路径共用）：
 *        introduction_to_the_backend_lesson.md（入门章第 1 课）与
 *        introduction_to_frameworks.md（Express 章第 1 课）；
 *     ③ **routing.md 对 slug nodejs-routes 为文件名与 slug 不同形新例**
 *        （文件名 routing、slug routes——线上课页 edit 链接实证）。
 *     express/ 下另有 installation_guides/postgresql/（linux.md 与 macos.md）
 *     ——官方 installing-postgresql 课 Assignment 直接指向这两个仓内文件，
 *     按「官方指定教材」口径登记（theodinproject 主仓 submissions 先例同源，
 *     与「课程本体剔除」口径相区分）；Express 章其余文件名与 slug 去前缀后
 *     同形（3 门 project_ 前缀直译例外见上）。
 *   - **7 课官方有 Additional resources 节**（what-is-nodejs / getting-started /
 *     routes / controllers / views / deployment / forms-and-data-handling）——
 *     hasAdditionalResources 豁免名单由 1 课扩为 8 课（content.test 迁移为
 *     Set 表驱动，断言不放宽）；其余 10 课无该节。
 *   - **10 课官方 Assignment 条目数 < 3**（NodeJS 课程官方 Assignment 少而精的
 *     形态特征）：back-end 3 / what-is-nodejs 3 / getting-started 5 大项达标；
 *     debugging-node 2、basic-informational-site 2、environment-variables 1、
 *     frameworks 2、introduction-to-express 2、routes 1、controllers 2、
 *     deployment 1 大项（含 2 官方子项）、installing-postgresql 1（内含 Linux
 *     与 macOS 双指南链接）、forms 2 大任务、using-postgresql 3 达标；
 *     tasks 忠实翻译官方条目不凑数，content.test 按课豁免钉准确条数
 *     （World 2 导读课「不凑数」先例同型，迁移为表驱动）。
 *   - 3 门 Project 红线课（basic-informational-site / mini-message-board /
 *     inventory-application——全站第 25、26、27 门 Project）：examples 空数组、
 *     正文不提供任何成品代码，官方 Assignment 里自带的脚手架片段一律转述为
 *     文字要求（calculator「片段表」先例）；三门课官方 Assignment 均无第三方
 *     外链，为零资料课候选（NO_RESOURCE_LESSONS 登记）。
 *   - 正文技术事实以 2026-09-28 实抓官方原文为准：**Express 5 现役**（文档
 *     链接为 /en/5x/，路由通配符 {*splat} 必须带名、{} 可选段语法）、
 *     **Node v24.10 起内置稳定 .env 支持**（--env-file 与 process.loadEnvFile，
 *     dotenv 库成为历史方案）——官方原文即如此陈述，如实转达。
 *   - sources.sha256 与 sources.json 逐字符一致（双通道实抓：raw + GitHub API，
 *     整条 64 位）；verifiedAt 为本轮实抓日期。 */
window.ODIN_COURSE_NODEJS = {
  version: 1,
  course: {
    id: 'nodejs',
    en: 'NodeJS',
    zh: 'NodeJS',
    url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs'
  },
  groups: [
    { en: 'Introduction to NodeJS', zh: 'NodeJS 入门' },
    { en: 'Express', zh: 'Express' },
    { en: 'Authentication', zh: '身份认证' },
    { en: 'ORMs', zh: 'ORM' },
    { en: 'APIs', zh: 'API' },
    { en: 'Testing Express', zh: '测试 Express' },
    { en: 'Full Stack Projects', zh: '全栈项目' },
    { en: 'FINAL PROJECT', zh: '最终项目' }
  ],
  lessons: [
    {
      "id": "nodejs-introduction-to-the-back-end",
      "title": "Introduction to the Back End",
      "zh": "后端入门",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/nodejs-introduction-to-the-back-end",
      "summary": "World 7 开篇导论（短课，NodeJS 与 Ruby 两条路径共用的官方课文）。「前端」是用户看得到、听得见的界面，三门语言高度标准化：HTML 管结构、CSS 管呈现、JavaScript 管脚本。「后端」则是 Web 服务器上「幕后」发生的一切——正因为浏览器只关心你发回的是不是格式正确的 HTML/CSS/JS，服务器端几乎想用什么语言就用什么语言，只要它能接住 HTTP 请求、吐出 HTML。这造就了后端语言百花齐放：PHP、C#、Ruby、Python、Java（别和 JavaScript 混淆）都是热门选择，它们能做的事几乎完全相同，只是语法不同——就像用瑞典语、法语、意大利语问「最近的酒馆怎么走」。不过现实里有约束：自己运维服务器灵活但头疼事多；用云平台则可能只被允许用平台已装好的语言。",
      "guide": "以下是官方原课的中文化梳理。先分清两个词：**前端（front end）**指网页用户与之交互的界面——上网时看到（和听到）的一切；它的三门语言相当标准化：**HTML 负责标记结构、CSS 负责呈现样式、JavaScript 负责脚本行为**。**后端（back end）**指 Web 服务器「幕后」为支撑用户体验而发生的一切。与前端开发不同，服务器上你几乎可以运行任何想用的语言——因为它不依赖用户的浏览器来理解你在干什么；**浏览器唯一关心的是你有没有发回格式正确的 HTML、CSS、JavaScript 文件**（以及图片等其他资产）。这就导致后端语言的选择五花八门：只要一门语言能**接住一个 HTTP 请求、吐出一些 HTML**，它大概就能被搬上服务器。话虽如此，有些语言更流行、更实用：最热门的服务器端语言有 **PHP、C#、Ruby、Python 和 Java**（官方特别括注：**别和 JavaScript 混淆**）。官方打了个比方：就像「最近的酒馆怎么走？」可以用瑞典语、法语、意大利语、英语和蹩脚英语来问，这些语言也都能完成几乎完全相同的功能，只是语法不同。现实的约束有两条：**自己运行服务器**灵活性拉满、但头疼事也一大堆；**用云平台**（本课程后面就会用）则可能被限制在云服务商已在平台上装好的那些语言里——你「借」来的服务器看不懂你的代码，再多灵活也是白搭。**Assignment 三条**：① 读 Team Treehouse 关于「后端 vs 前端编程」的博客文章，快速重温两者的差别；② 读 TechTerms 的后端定义短文——简短但好的后端概览；③ 读 Codecademy 的分步拆解文章，弄清浏览器向服务器发起请求时，后端到底发生了什么。",
      "understand": [
        "**前端 = 用户交互的界面**，三门语言标准化：HTML 标记 / CSS 呈现 / JavaScript 脚本",
        "**后端 = 服务器幕后的一切**——浏览器不关心服务器用什么语言，只关心发回的 HTML/CSS/JS 格式是否正确",
        "后端语言的准入线极低：**能接住 HTTP 请求、吐出 HTML** 就能上服务器——所以选择百花齐放",
        "热门服务器端语言：**PHP、C#、Ruby、Python、Java**——功能几乎相同、语法各异；**Java ≠ JavaScript**（官方特别点名）",
        "现实约束：自运维服务器灵活但头疼多；**云平台只跑它装好的语言**——「借」的服务器看不懂你的代码就没用"
      ],
      "terms": [
        {
          "en": "Front end",
          "zh": "前端：网页用户直接交互的界面层——看到与听到的一切；三门标准化语言 HTML / CSS / JavaScript"
        },
        {
          "en": "Back end",
          "zh": "后端：Web 服务器上「幕后」发生的一切，为前端体验提供支撑；语言选择几乎不受浏览器限制"
        },
        {
          "en": "Server-side language",
          "zh": "服务器端语言：运行在服务器上的编程语言，如 PHP、C#、Ruby、Python、Java；准入线是「接住 HTTP 请求、返回 HTML」"
        },
        {
          "en": "HTTP request",
          "zh": "HTTP 请求：浏览器与服务器之间的标准通信单位——后端工作的起点"
        },
        {
          "en": "Cloud provider",
          "zh": "云服务商：出租服务器能力的平台；用它可以不自运维，但语言选择受限于平台已装好的环境"
        }
      ],
      "tasks": [
        "读 Team Treehouse 的博客文章《我不懂你的语言：前端 vs 后端》，快速重温前端与后端的差别（链接在资料区）",
        "读 TechTerms 的后端（backend）定义条目——一篇简短而到位的后端概览（链接在资料区）",
        "读 Codecademy 的分步拆解文章：浏览器向服务器发起请求时，后端一步步发生了什么（链接在资料区）"
      ],
      "quiz": [
        {
          "question": "按官方定义，前端与后端各指什么？前端的三门语言分别负责什么？",
          "answer": "前端是网页用户交互的界面——看到（和听到）的一切；后端是 Web 服务器上「幕后」发生的一切。前端三门语言高度标准化：HTML 负责标记结构、CSS 负责呈现、JavaScript 负责脚本。"
        },
        {
          "question": "为什么服务器端几乎可以用任何语言，而前端不行？后端语言的「准入线」是什么？",
          "answer": "因为服务器端代码不依赖用户浏览器来理解它——浏览器只关心发回的是不是格式正确的 HTML/CSS/JS 文件。准入线：只要一门语言能接住 HTTP 请求并吐出 HTML，它就能被搬上服务器。"
        },
        {
          "question": "官方列举了哪些热门服务器端语言？它特别提醒不要把哪一个和 JavaScript 混淆？",
          "answer": "PHP、C#、Ruby、Python 和 Java。官方特别括注：Java 不要和 JavaScript 混淆——它们是两门不同的语言。"
        }
      ],
      "optional": [],
      "note": "本课是 NodeJS 与 Ruby 两条学习路径共用的官方课文（住在 curriculum 仓 shared/the_back_end/ 目录），全站第一门「跨路径共有课」。它是纯概念导论，没有任何代码；World 7 的真正动手从下一课「引言：什么是 NodeJS？」开始。",
      "why": "走到这里你已经拥有了前端（World 1–5）与数据库（World 6）两块拼图，但把它们连起来的「幕后层」还是一团雾。这一课把雾吹散：后端不是什么神秘黑盒，它就是「接住请求、吐出 HTML」的那段程序——而且因为你已经会 JavaScript，这门语言马上就能被你带上服务器。World 7 整条 NodeJS 课程都建立在这个认知上：先明白后端「是什么、能用什么写」，再问「Node 为什么是好选择」。",
      "sections": [
        {
          "h": "前端：三门标准语言的世界",
          "p": [
            "「前端」（front end）指网页用户与之交互的界面——他们上网时**看到（和听到）**的一切。前端的三门语言相当标准化：**HTML 负责标记、CSS 负责呈现、JavaScript 负责脚本**。",
            "这正是你过去六个 World 一直在打磨的领地：结构、样式、行为，三件事三样工具，全世界的前端都讲同一套语言。"
          ]
        },
        {
          "h": "后端：语言自由的幕后世界",
          "p": [
            "「后端」（back end）指 Web 服务器上**「幕后」**发生的一切——正是它们让用户体验成为可能。",
            "与前端开发相反，服务器上你**几乎可以运行任何想用的语言**，因为它不依赖用户的浏览器理解你在干什么。**浏览器唯一关心的是：你有没有发回格式正确的 HTML、CSS 和 JavaScript 文件**（以及图片之类的其他资产）。",
            "这造就了后端语言的花样繁多。底线只有一条：**只要它能接住一个 HTTP 请求、吐出一些 HTML，它大概就能被搬上服务器**。"
          ]
        },
        {
          "h": "热门选择与现实约束",
          "p": [
            "话虽如此，有些语言更流行也更实用。最热门的服务器端语言是 **PHP、C#、Ruby、Python 和 Java**（官方特别括注：**别和 JavaScript 混淆**）。",
            "官方打了个比方：就像「最近的酒馆怎么走？」可以用瑞典语、法语、意大利语、英语和蹩脚英语来问——这些语言都能完成**几乎完全相同的功能**，只是语法不同。",
            "现实约束有两条：**自己运行服务器**，灵活性拉满、但头疼事也一大堆；**用云平台**（本课程后面就会用到），你可能被限制在云服务商已经装好的语言里——你「借」来的服务器看不懂你的代码，一切白搭。"
          ]
        },
        {
          "h": "Assignment：三份热身阅读",
          "p": [
            "① 读 Team Treehouse 关于**「后端 vs 前端编程」**的博客文章，快速重温两者的差别（资料区有链接）。",
            "② 读 TechTerms 的**后端定义**条目——一篇简短而好的后端概览（资料区有链接）。",
            "③ 读 Codecademy 的分步拆解：**浏览器向服务器发起请求时，后端发生了什么**（资料区有链接）。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "把 Java 当成 JavaScript",
          "text": "官方在列举热门服务器端语言时特意括注「not to be confused with JavaScript」。Java 和 JavaScript 是两门完全不同的语言——名字相似纯属上世纪的市场营销遗产。本路线选择的服务器端语言是 JavaScript（经由 Node 运行时），不是 Java。"
        },
        {
          "title": "以为「后端语言随便选」等于「云平台随便跑」",
          "text": "语言自由的前提是你自己掌控服务器。一旦用云平台（本课明言课程后面就会用），可选项就收窄到平台已装好的语言与运行时——选技术栈之前先看部署目标支持什么，是后端工程的第一个现实检查。"
        }
      ],
      "official": {
        "assignment": [
          "读 Team Treehouse 的博客文章「back-end vs front-end programming」，快速重温前端与后端的差别",
          "读 TechTerms 的后端定义条目——简短而好的后端概览",
          "读 Codecademy 的分步拆解：浏览器向服务器发起请求时，后端发生了什么"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 shared/the_back_end/introduction_to_the_backend_lesson.md（NodeJS 与 Ruby 路径共有课；本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "d47409d3b958a4372daa73517554a450ab581a67dc3f7a3c34aa54a3911f5a28",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "nodejs-introduction-what-is-nodejs",
      "title": "Introduction: What is NodeJS?",
      "zh": "引言：什么是 NodeJS？",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/nodejs-introduction-what-is-nodejs",
      "summary": "Node 自 2009 年诞生以来热度稳步上升：网上课程与文章铺天盖地，几乎所有后端开发工作都要求先装它，需要它的岗位也越来越多。官网的定义是「作为一个异步事件驱动的 JavaScript 运行时，Node 旨在构建可扩展的网络应用」——这句话需要拆开：**JavaScript 运行时**意味着 JS 被带出了浏览器，能像 Ruby、PHP、C#、Python 一样在服务器上干活，还多了读写本地文件、创建 HTTP 连接、监听网络请求的本领；**异步事件驱动**意味着你不预测每一行代码的执行顺序，而是把代码写成一小群函数、等着被事件（网络请求、数据库查询完成）唤起——和你已经熟悉的 addEventListener 几乎一模一样，回调因此是 Node 的命脉。正文用「读文件并打印 + 查库并过滤」的双链并行例子演示了异步为什么快，最后给出一个 8 行的 HTTP 服务器真实示例。另有官方提醒：本课程先专注服务端概念，React 留到后面组合复杂前后端时再说。",
      "guide": "以下是官方原课的中文化梳理。**NodeJS（或简称 Node）自 2009 年创建以来稳步走红**：互联网上关于它的课程与文章汗牛充栋，安装它几乎是任何后端开发工作的前置条件，要求掌握它的岗位数量也在上升。**官网定义**：「作为一个**异步事件驱动的 JavaScript 运行时**，Node 旨在构建**可扩展的网络应用**」——这个定义需要一点拆解。**第一块拼图：JavaScript 运行时**。JavaScript 诞生时被设计为**在浏览器里**运行——那时你没法用 JS 写任何不是网站的东西。Node 把 JavaScript **带出了浏览器领地**，让开发者能用 JS 完成 Ruby、PHP、C#、Python 等主流服务器端语言几乎能做的一切。最基本的层面：Node 让你在本地电脑或服务器上直接运行 JavaScript，不必经过浏览器。为此 Node 增加了浏览器 JS 没有的能力：**读写本地文件、创建 HTTP 连接、监听网络请求**。**第二块拼图：异步 + 事件驱动**。**异步**指写代码时你不去预测每一行的确切执行顺序，而是把代码写成**一小群函数**，等特定事件（比如一次网络请求）发生时被调用——这就是**事件驱动**。官方例子：程序要「读文件→打印内容」加「查数据库→按年龄过滤用户」。与其四步严格串行，不如拆成两条「A 然后 B」的链：Node 开始读文件，因为读文件要花时间，它**立刻**开始跑第二步（查数据库）；两个过程都在跑时，Node 坐下来**等事件**——谁先完成，谁先触发自己那条链的下一个函数。作为程序员，你不知道也不关心两个过程谁先完成；如果这一切是同步的，每一步都得干等前一步，文件很长时数据库查询可能要多等好几秒。这几乎就是你在前端用 **addEventListener** 等鼠标点击的模式，只不过事件换成了网络请求与数据库查询——这一切靠**回调**实现，回调对 Node 极其重要（Assignment 有一篇专门文章）。**真实小例**：8 行的 http.createServer 代码——创建一个服务器并声明「任何时候收到网络请求，就运行这个回调」，回调返回文本 Hello World!；浏览器访问正确地址与端口就能看到。**官方课程提醒（lesson-note）**：本课程先聚焦**服务端概念**，React 这类客户端内容留到你开始组合更复杂的前后端时再说；**请按课程原样推进**——自行偏离会让学习比必要的更难。**Assignment 三条**：① MDN「服务器端」短模块的前两篇文章（服务器端导论 + 客户端-服务器概览）；② 读 Medium 上关于 NodeJS 的文章、把官网定义剩下的部分拆完，文末那个**很棒的事件循环视频务必重看**（你可能在课程早期见过）；③ 一支关于 NodeJS 的短视频也是很好的入门。",
      "understand": [
        "**Node = JavaScript 运行时**：把 JS 带出浏览器，让它能在本地机器或服务器上直接运行，干主流服务器端语言能干的活",
        "Node 比浏览器 JS 多出的本领：**读写本地文件、创建 HTTP 连接、监听网络请求**",
        "**异步**：不预测每行代码的执行顺序；**事件驱动**：代码是一小群等着被事件唤起的函数",
        "双链并行的本质：读文件与查数据库**同时开跑**，谁先完成谁先触发下一环——程序员不知道也不关心完成顺序",
        "这与前端 **addEventListener** 几乎同构，只是事件换成网络请求 / 数据库查询；**回调**是 Node 的命脉",
        "官方纪律：本课程先学服务端概念，**React 留到后面**——按课程原样推进，不要自行抢跑"
      ],
      "terms": [
        {
          "en": "JavaScript runtime",
          "zh": "JavaScript 运行时：让 JS 脱离浏览器运行的环境——Node 的本体身份；能读写文件、建 HTTP 连接、监听网络请求"
        },
        {
          "en": "Asynchronous",
          "zh": "异步：不预测每行代码的确切执行顺序，把代码拆成等事件唤起的小函数——与「每步干等前一步」的同步相对"
        },
        {
          "en": "Event driven",
          "zh": "事件驱动：程序流程由事件（网络请求完成、文件读完、数据库返回）触发，而非从头到尾一条线"
        },
        {
          "en": "Callback",
          "zh": "回调：事件发生时被调用的函数——Node 异步机制的实现基石"
        },
        {
          "en": "Event loop",
          "zh": "事件循环：Node 调度「等待事件→触发回调」的底层机制——Assignment 要求重看的那个视频讲的就是它"
        },
        {
          "en": "Scalable network applications",
          "zh": "可扩展的网络应用：Node 官网定义里的目标产物——异步模型让单进程也能同时伺候大量网络请求"
        }
      ],
      "tasks": [
        "读 MDN「服务器端（The Server Side）」短模块 Tutorials 下的前两篇文章：《服务器端导论》与《客户端-服务器概览》——这是你需要的背景知识的极佳来源（链接在资料区）",
        "读 Medium（freeCodeCamp）关于 NodeJS 的文章，把官网定义剩下的部分拆完；文末那个关于事件循环的视频非常好，务必重看——你可能在课程早期就见过它（链接在资料区）",
        "看这支关于 NodeJS 的短视频，它同样是很好的入门材料（链接在资料区；为英文视频）"
      ],
      "quiz": [
        {
          "question": "Node 官网怎么定义自己？定义里的「JavaScript 运行时」意味着什么？",
          "answer": "「作为一个异步事件驱动的 JavaScript 运行时，Node 旨在构建可扩展的网络应用」。「运行时」意味着 JS 被带出了浏览器：不必经过网页，就能在本地机器或服务器上直接运行 JavaScript，做到 Ruby、PHP、C#、Python 等服务器端语言几乎能做的一切。"
        },
        {
          "question": "按官方的双任务例子，异步模型和同步模型的差别是什么？",
          "answer": "同步模型四步严格串行：读文件→打印→查库→过滤，每步干等前一步（文件很长时数据库查询要多等几秒）。异步模型拆成两条「A 然后 B」的链同时开跑：Node 开始读文件后立刻去查数据库，然后坐等事件——谁先完成谁先触发下一环，程序员不知道也不关心完成顺序。"
        },
        {
          "question": "官方说 Node 的事件驱动「几乎就是你已经用过的某个前端模式」——指什么？两者的差别在哪？",
          "answer": "指 addEventListener 等用户动作（鼠标点击、键盘敲击）的模式。差别只在事件的种类：Node 里的事件是网络请求、数据库查询这类服务端动作，靠回调函数实现。"
        },
        {
          "question": "Node 比浏览器里的 JavaScript 多了哪些能力（官方列举）？",
          "answer": "读写本地文件、创建 HTTP 连接、监听网络请求——这些浏览器 JS 没有的功能正是它能当服务器端语言的原因。"
        },
        {
          "question": "学过 React 的人常想立刻在 Node 课程里用上它——官方对此的纪律是什么？",
          "answer": "课程先聚焦服务端概念，React 等客户端内容留到后面组合更复杂前后端时再说；要按课程原样推进，自行偏离方向会让学习比必要的更难。"
        }
      ],
      "optional": [],
      "note": "官网定义那句「asynchronous event driven JavaScript runtime」是全课的解释轴心——Assignment 第 2 条的文章就是专门拆这句话的。事件循环视频你大概率在 JavaScript 课程见过，这次带着「服务器为什么靠它扛并发」的视角重看，收获会完全不同。本课示例代码用 CommonJS（require 风格），与 World 3 里 ES6 模块并存是 Node 生态现状。",
      "why": "World 3 你在浏览器里把 JavaScript 练到了能建单页应用，World 6 你认识了数据库——但「JS 怎么站上服务器」还缺一个答案。这一课就是答案本身：Node 不是新语言、不是框架，而是把你已经会的那门语言带出浏览器的运行时。理解「异步事件驱动」尤其关键，因为整个 Express 章（路由、中间件、控制器）都跑在这个模型上——现在想通事件与回调，后面每一课都在复用这块地基。",
      "sections": [
        {
          "h": "Node 的官方定义：一句话三块拼图",
          "p": [
            "NodeJS（或简称「Node」）**自 2009 年创建以来热度稳步上升**：互联网上关于它的课程与文章铺天盖地，安装它几乎是任何后端开发工作的前置条件，需要它的岗位也在增多。",
            "Node 官网宣告：**「作为一个异步事件驱动的 JavaScript 运行时，Node 旨在构建可扩展的网络应用。」**官方原话：这个定义需要一点拆解——本课就是拆它的过程。"
          ]
        },
        {
          "h": "JavaScript 运行时：把 JS 带出浏览器",
          "p": [
            "最该先懂的一块：Node 是一个 **「JavaScript 运行时」**。JavaScript 最初被设计为**在浏览器里**运行——这意味着那时你根本没法用 JS 写任何不是网站的东西。",
            "**Node 把 JavaScript 带出了浏览器领地。**它让开发者能用 JavaScript 完成 Ruby、PHP、C# 与 Python 等主流服务器端语言几乎能做的一切。最基本的层面：Node 让你**在本地电脑或服务器上直接运行 JavaScript 代码**，不必经过 Web 浏览器。",
            "为了做到这一点，Node 增加了浏览器 JS 里没有的功能：**读写本地文件、创建 HTTP 连接、监听网络请求**。"
          ]
        },
        {
          "h": "异步与事件驱动：不预测顺序，只等事件",
          "p": [
            "回到定义：Node 是**异步事件驱动**的运行时。**异步**指写代码时你**不去预测每一行执行的确切顺序**；相反，你把代码写成**一小群函数**，等特定事件（比如一次网络请求）发生时被调用——这就是**事件驱动**。",
            "官方例子：程序要「从文件读文本→打印到控制台」再「查数据库取用户列表→按年龄过滤」。不必四步严格串行（读文件→打印→查库→过滤），而是拆成两条链：**「读文件 然后 打印内容」+「查数据库 然后 过滤结果」**。",
            "运行时：Node 从头开始读文件；因为读文件要花时间，它**立刻开始跑第二条链**（查数据库）。两个过程都在跑时，Node 坐下来**等一个事件**——两个过程任一个完成，Node 就发出事件、运行我们定义的下一个函数。读文件先完成就先打印；查库先完成就先过滤。**作为程序员，我们不知道、也不关心两个过程的完成顺序。**",
            "如果代码是同步处理的，每一步都得干等：文件很长时，数据库查询可能要多等好几秒。这个模式几乎就是你在前端用 **addEventListener** 等鼠标点击、键盘敲击的方式——差别只在事件变成了网络请求与数据库查询。这一切靠**回调（callback）**实现；回调对 Node 极其重要，Assignment 里有一篇专门文章帮你跟上。"
          ]
        },
        {
          "h": "一个真实小例：8 行的 HTTP 服务器",
          "p": [
            "官方给出的第一个真实示例只有几行：创建一个 HTTP 服务器并声明「**任何时候收到网络请求，就运行这个回调函数**」——回调恰好返回文本「Hello World!」。",
            "在浏览器里导航到正确的地址与端口，你就能在屏幕上看到这段文字。这个片段来自你很快就会跟着做的第一个教程课（示例代码在本页「代码示例」区）。"
          ]
        },
        {
          "h": "课程纪律：先服务端，React 靠后",
          "p": [
            "官方专门放了一条课程提醒：**「在 NodeJS 课程中使用 React」**——课程会先聚焦**服务端概念**，React 这类客户端内容留到后面，等你开始把更复杂的前端与后端组合到一起时再说。",
            "官方原话的立场很明确：**请按课程原样推进**；自行偏离指引会让事情比必要的更难。（React Server Components 之类为什么不在这里教，Views 一课的官方注记还会再解释一次。）"
          ]
        },
        {
          "h": "Assignment：三份热身材料",
          "p": [
            "① MDN 的**「服务器端」短模块**是你需要的背景知识的极佳来源——读 Tutorials 下的前两篇：**《服务器端导论》**与**《客户端-服务器概览》**（资料区有链接）。",
            "② 读这篇关于 **NodeJS 的文章**，对 Node 的本质多一点洞察、把上面定义的剩余部分拆完；**文末那个关于事件循环的视频真的很好，务必重看**——你可能记得它来自课程早前的部分（资料区有链接）。",
            "③ 这支**关于 NodeJS 的短视频**同样是很棒的入门（资料区有链接；为英文视频）。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "http.createServer(function (req, res) {\n  res.writeHead(200, {'Content-Type': 'text/html'});\n  res.end('Hello World!');\n}).listen(8080);",
          "note": "官方第一课示例：创建服务器并声明「收到任何网络请求就运行这个回调」。回调写回 200 状态与 Content-Type 头，再发送文本 Hello World!。浏览器访问正确地址与端口（8080）即可看到这段文字。"
        }
      ],
      "pitfalls": [
        {
          "title": "把 Node 当成一门新语言或一个框架",
          "text": "Node 是 JavaScript 的运行时——语言还是你已经会的那门 JS，Node 只是把它带出浏览器并补上文件、HTTP、网络监听的能力。把它误当框架，会让你在 Express 章里分不清「哪些是 JS、哪些是 Node、哪些是 Express」三层各管什么。"
        },
        {
          "title": "用同步思维读异步代码",
          "text": "「从上到下每行依次执行」的直觉在 Node 里会持续误导你：两条链同时开跑、完成顺序不可知也不重要。官方特意让你重看事件循环视频就是为了掰正这个直觉——谁先完成谁先触发下一环，代码的顺序不等于执行的顺序。"
        },
        {
          "title": "急着把 React 搬进 Node 课程",
          "text": "官方专门放了一条 lesson-note：课程先聚焦服务端概念，客户端的 React 留到组合复杂前后端时再说；自行偏离课程顺序会让学习比必要的更难。World 5 的 React 功力不会浪费，但现在是打后端地基的时间。"
        }
      ],
      "official": {
        "assignment": [
          "读 MDN「The Server Side」短模块 Tutorials 下的前两篇文章：Introduction to the server-side 与 Client-Server overview——背景知识的极佳来源",
          "读 freeCodeCamp（Medium）关于 NodeJS 的文章，拆解官网定义的剩余部分；文末的事件循环视频务必重看",
          "看这支关于 NodeJS 的 YouTube 短视频——同样是很好的入门"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "Team Treehouse《用 Node.js 能建的 7 件棒东西》——开眼界用"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/introduction_to_nodeJS/introduction_what_is_nodeJS.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "fc98d16532767be06a46074566d629889b59b85303d7b68f4c22443388ee16d4",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "nodejs-getting-started",
      "title": "Getting Started",
      "zh": "起步",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/nodejs-getting-started",
      "summary": "本章的动手导览课：Node.js 其实就是 JavaScript，所以理解 Node 的前提是扎实的 JS 基础（官方强烈建议先完成本路线的 JavaScript 课程）。本课带你过一遍「让 Node 跑起来」所需的基础模块与函数，为章末项目（用 Node 建一个含 Index、About、Contact Me 页面的基础网站）做准备——边学边留意哪些东西能用在项目里。Assignment 是一次五站式模块巡礼：① 如何在终端里运行 Node 脚本；② HTTP 模块（用 fetch 发请求 + http 模块 API 文档，重点看 http.createServer——它创建的服务器在每次收到请求时执行你给的处理器）；③ 文件系统（fs 模块 + 写文件 + 读文件）；④ URL 类（WHATWG URL API 文档，动手玩代码样例）；⑤ 事件（Event Emitter 一节 + events 模块）。另有一条重要通知：NodeJS.dev 团队近期删除了网站上的大量内容，课内若干链接因此直指其 GitHub 仓库里钉住提交的 markdown 文件——排版看起来可能有点怪，但内容一样好。",
      "guide": "以下是官方原课的中文化梳理。**先修关系**：像引言课说的那样，Node.js 其实就是 JavaScript——所以理解 Node 必须有基本的 JavaScript 功底。官方**强烈建议先完成本路线的 JavaScript 课程**再继续本课。本课的定位：带你过一遍一份教程，教会你**让 Node.js 跑起来所需的基础模块与函数**。**本章末尾的项目**会要求你用 Node 创建一个基础网站，包含 **Index、About 和 Contact Me** 页面——所以学习本课主题时，**留意哪些东西能帮你完成那个项目**。**重要通知（官方 lesson-note）**：NodeJS.dev 团队最近从他们网站上删除了大量内容，本课链接到的若干页面就在其中。在找到替代内容之前，官方会**直接链接到 NodeJS.dev GitHub 仓库里的 markdown 文件**（钉住某个提交）——排版看起来可能有点怪，但内容应该一样好。**Assignment 五站式巡礼**（官方原话：跳进 Node 服务端代码，在 NodeJS.org 文档的各课之间跳转，跟着做）：**① 命令行**——学习如何从终端运行 Node.js 脚本。**② HTTP 模块**——学习如何用 Node 发 HTTP 请求（fetch）；再看 Node http 模块的 API 文档，**特别是 http.createServer**：文档展示了它可接受的可选参数（用不用随你），现在你只需要知道 createServer 方法**创建一个 HTTP 服务器，接受一个处理器（handler），每次收到请求都会执行它**。**③ 文件系统**——先看 fs 模块（Node 里大量用于文件操作）；然后学用 Node **写文件**；最后学**读文件**。**④ URL 类**——看 WHATWG URL API 文档，**动手玩代码样例**看它怎么工作。**⑤ 事件**——跟着 Event Emitter 一节做；再看 Node events 模块。补充资料里官方推荐 Net Ninja 的 Node 速成播放列表（12 集），可以全看。",
      "understand": [
        "**Node.js 就是 JavaScript**——先修是本路线的 JavaScript 课程；本课教的模块全部用你已经会的语言调用",
        "本课是**为章末项目服务的导览**：建 Index / About / Contact Me 基础网站时，这五个模块就是全部原料",
        "**http.createServer**：创建一个 HTTP 服务器、接受处理器函数，**每次收到请求就执行它**——后端的最小骨架",
        "**fs 模块**管文件读写——服务器能「记住」页面文件并发送它们，靠的就是它",
        "**URL 类（WHATWG API）**把地址拆成可读部件——判断用户请求的是 /about 还是 /contact-me 靠它",
        "**Event Emitter / events 模块**让你创建、触发、监听自己的事件——事件驱动模型的应用层接口",
        "NodeJS.dev 删内容的通知：课内部分链接**直指 GitHub 仓库钉住提交的 markdown**——排版怪不是错误，内容一样好"
      ],
      "terms": [
        {
          "en": "Node.js module",
          "zh": "Node.js 模块：Node 自带的功能单元（http / fs / events / url 等）——用 require 或 import 引入后即可调用"
        },
        {
          "en": "http.createServer",
          "zh": "Node http 模块的核心方法：创建 HTTP 服务器并接受处理器函数，每次收到请求都执行该处理器"
        },
        {
          "en": "fs module",
          "zh": "文件系统模块：Node 读写本地文件的内置工具——服务器发送 HTML 文件、保存数据都靠它"
        },
        {
          "en": "WHATWG URL API",
          "zh": "标准化的 URL 解析接口：把地址拆成协议、主机、路径等可读部件——Node 的 URL 类实现了它"
        },
        {
          "en": "Event Emitter",
          "zh": "事件发射器：Node events 模块的核心类——创建、触发（fire）与监听自己的事件的接口"
        }
      ],
      "tasks": [
        "命令行站：学习如何从终端运行 Node.js 脚本（nodejs.org 文档；链接在资料区）",
        "HTTP 站：学习如何用 Node 发 HTTP 请求（fetch 一课），再看 http 模块 API 文档——重点看 http.createServer：它创建接受处理器的 HTTP 服务器，每次收到请求都执行处理器（两个链接在资料区）",
        "文件系统站：先看 fs 模块总览，再依次学「用 Node 写文件」与「用 Node 读文件」（三个链接在资料区）",
        "URL 站：读 WHATWG URL API 文档，动手运行代码样例，看 URL 如何被拆成可读部件（链接在资料区）",
        "事件站：跟着 Event Emitter 一节做一遍，再看 Node events 模块的说明（两个链接在资料区）"
      ],
      "quiz": [
        {
          "question": "官方对本课的先修要求是什么？本课与章末项目是什么关系？",
          "answer": "先修是本路线的 JavaScript 课程（Node.js 其实就是 JavaScript，必须有 JS 基础才能理解）。本课教的基础模块与函数正是章末项目——用 Node 建含 Index、About、Contact Me 页面的基础网站——所需的全部原料，官方要求边学边留意哪些能用在项目里。"
        },
        {
          "question": "http.createServer 的一句话职责是什么（官方原话的转述）？",
          "answer": "创建一个 HTTP 服务器，接受一个处理器（handler）函数，每次服务器收到请求时就执行这个处理器。文档里的可选参数现在不必深究。"
        },
        {
          "question": "为什么本课的部分链接指向 GitHub 上的 markdown 文件而不是正常网页？",
          "answer": "NodeJS.dev 团队删除了网站上的大量内容，本课链接的若干页面在其中；官方在找到替代内容前直接链接其 GitHub 仓库里钉住提交的 markdown 文件——排版可能看起来怪，但内容一样好。这是官方 lesson-note 里的重要通知，不是链接错误。"
        },
        {
          "question": "五个模块站里，哪一个让你能「创建、触发并监听自己的事件」？",
          "answer": "事件站：Event Emitter 一节与 Node events 模块——它是 Node 事件驱动模型在应用层的接口，让你自己的代码也能发布/订阅事件。"
        }
      ],
      "optional": [],
      "note": "这是一课「跟着链接动手」的导览课：官方正文本身没有代码，全部知识点住在 Assignment 的九个链接里（nodejs.org 文档 + 两个钉住提交的 NodeJS.dev GitHub markdown）。资料区按五站式分组登记了全部链接。Net Ninja 的 12 集速成播放列表是官方补充资料（optional），为英文视频。",
      "why": "引言课回答了「Node 是什么」，本课回答「Node 怎么用」。五个模块站不是随意挑的：http 让服务器收请求、fs 让服务器读文件、url 让服务器分辨路径、events 让异步有接口、命令行让你把这一切跑起来——章末的 Basic Informational Site 项目恰好就是这五样东西的最小组合。现在把每站都亲手敲一遍，项目课才不会卡壳。",
      "sections": [
        {
          "h": "先修与定位：为章末项目备料",
          "p": [
            "像引言课学到的：**Node.js 其实就是 JavaScript**——理解 Node 必须有基本的 JavaScript 功底。官方**强烈建议先完成本路线的 JavaScript 课程**再继续。",
            "本课带你过一遍教程，教会你**让 Node.js 跑起来所需的基础模块与函数**。**本章末尾的项目**会要求你用 Node 创建一个基础网站，包含 **Index、About 和 Contact Me** 页面——所以学习时**留意哪些东西能帮你完成项目**。"
          ]
        },
        {
          "h": "重要通知：NodeJS.dev 的内容删除",
          "p": [
            "官方 lesson-note 原文要点：**NodeJS.dev 团队最近从网站上删除了大量内容**，本课链接到的若干页面就在其中。",
            "在找到替代内容之前，官方**直接链接到 NodeJS.dev GitHub 仓库里的 markdown 文件**（钉住特定提交）。排版看起来可能有点怪，**但内容应该一样好**——看到 GitHub 文件页不要以为链接坏了。"
          ]
        },
        {
          "h": "Assignment：五站式模块巡礼",
          "p": [
            "官方开场：跳进去，开始看 Node 服务端代码——在 **NodeJS.org 文档**的各课之间跳转，跟着做。",
            "**① 命令行**：学习**如何从终端运行 Node.js 脚本**。",
            "**② HTTP 模块**：学习**如何用 Node 发 HTTP 请求**（fetch 一课）；再看 **http 模块 API 文档**，特别是 **http.createServer**——文档展示了可选参数（用不用随你），现在只需知道：createServer 方法**创建一个 HTTP 服务器，接受处理器，每次收到请求都会执行它**。",
            "**③ 文件系统**：先看 **fs 模块**（Node 里大量用于文件操作）；然后学**用 Node 写文件**；最后学**用 Node 读文件**。",
            "**④ URL 类**：看 **WHATWG URL API 文档**，**动手玩代码样例**看它怎么工作。",
            "**⑤ 事件**：跟着 **Event Emitter** 一节做；再看 **Node events 模块**。"
          ]
        },
        {
          "h": "补充资料：Net Ninja 速成播放列表",
          "p": [
            "官方 Additional resources 推荐：Net Ninja 的 **Node 速成课程播放列表（12 集）**是学习 Node.js 的很棒资源——官方原话「一共 12 支视频，你可以把它们全看了」（资料区有链接；为英文视频）。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "跳过 JavaScript 课程直接学 Node",
          "text": "官方把「先完成 JavaScript 课程」写成强烈建议而非客套：Node.js 就是 JavaScript，模块 API 学得再熟，语言层（异步、回调、解构、模块语法）不扎实，后面 Express 章的每一课都会加倍吃力。"
        },
        {
          "title": "把 GitHub markdown 直链当成坏链接",
          "text": "fs 与 events 两站的链接指向 NodeJS.dev 仓库钉住提交的 markdown 文件页——这是官方在内容被删除后的刻意安排（lesson-note 有通知），排版怪但内容完好；不要因此跳过这两站。"
        },
        {
          "title": "只读不敲",
          "text": "本课官方正文没有一行代码，全部干货在九个链接的动手教程里；URL 站官方明说「玩代码样例」、Event Emitter 站明说「跟着做」。只扫一眼文档不动手，章末项目就会变成第一次实战——那时卡壳的成本高得多。"
        }
      ],
      "official": {
        "assignment": [
          "学习如何从终端运行 Node.js 脚本（nodejs.org 命令行一课）",
          "HTTP 模块：学习如何用 Node 发 HTTP 请求（fetch 一课）；再看 http 模块 API 文档，特别是 http.createServer——它创建接受处理器的 HTTP 服务器，每次收到请求都会执行处理器",
          "文件系统：先看 fs 模块（NodeJS.dev GitHub 钉住 markdown），再学「用 Node 写文件」与「用 Node 读文件」（nodejs.org 两课）",
          "URL 类：读 WHATWG URL API 文档并动手玩代码样例",
          "事件：跟着 Event Emitter 一节做（nodejs.org），再看 Node events 模块（NodeJS.dev GitHub 钉住 markdown）"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "Net Ninja 的 Node 速成课程播放列表（12 集）——官方推荐可以全看"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/introduction_to_nodeJS/getting_started.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "63809f68eabfb43ab0de7b7dfc33232d1ac560b831981a29f70b93e36f011451",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "nodejs-debugging-node",
      "title": "Debugging Node",
      "zh": "调试 Node",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/nodejs-debugging-node",
      "summary": "全站最短的课之一（官方原文约 1.2KB），但工具分量不轻：到目前为止你可能只靠浏览器 DevTools 调试代码，而调试 Node 与服务端代码时，VS Code 有一个顺手的内置调试器，让你直接在编辑器里调试。官方定位：这是你学习到这个阶段的关键工具（critical tool），而且很可能成为你职业生涯里每天要用的主力工具。Assignment 两条：① 看 VS Code 官方频道的视频教程，亲眼看一遍 Node.js 调试的完整流程；② 读 VS Code Node 调试器官方文档——特别留意 JavaScript Debug Terminal，那是把调试器跑起来的最省事入口。",
      "guide": "以下是官方原课的中文化梳理。**背景**：到目前为止，你可能一直只靠**浏览器的 DevTools** 调试代码。轮到调试 **Node 和服务端代码**时，**VS Code 有一个顺手的内置调试器**——你可以直接在编辑器里调试。**你大概在课程早前的一些环节已经用过它**；但归根结底，本课要让你熟悉 **VS Code Node 调试器**。官方给它的定位很重：**这是你学习到此阶段的关键工具（critical tool），并且很可能成为你职业生涯中每天都要用的主力工具**。**Assignment 两条**：① 看这支关于 **VS Code 里 Node.js 调试**的视频教程（VS Code 官方频道），亲眼看流程跑一遍；② 读 **VS Code Node 调试器官方文档**——**特别留意 JavaScript Debug Terminal**，这是把调试器跑起来的一种简单入口。",
      "understand": [
        "浏览器 DevTools 只管前端；**Node 与服务端代码的调试主战场在编辑器里**——VS Code 内置调试器",
        "官方对它的定位是**「关键工具」**：学习阶段的刚需，也很可能是职业生涯的每日主力",
        "**JavaScript Debug Terminal** 是把调试器跑起来的最省事入口——文档里官方点名让你留意它",
        "本课是「看视频 + 读文档」的操作课：知识点住在 VS Code 官方文档里，本课负责把你领到门口"
      ],
      "terms": [
        {
          "en": "VS Code Node debugger",
          "zh": "VS Code Node 调试器：编辑器内置的服务端调试工具——断点、单步、变量查看都不离开编辑器"
        },
        {
          "en": "JavaScript Debug Terminal",
          "zh": "JavaScript 调试终端：VS Code 提供的特殊终端——在其中启动的 Node 进程自动挂上调试器，官方点名的最省事入口"
        },
        {
          "en": "DevTools",
          "zh": "开发者工具：浏览器内置的调试面板——前端的调试主场；服务端代码它管不到，这正是本课工具补位的缺口"
        }
      ],
      "tasks": [
        "看 VS Code 官方频道的视频教程「Node.js debugging in VS Code」，亲眼看一遍调试流程怎么跑（链接在资料区；为英文视频）",
        "读 VS Code Node 调试器官方文档——特别留意 JavaScript Debug Terminal，这是把调试器跑起来的简单入口（链接在资料区）"
      ],
      "quiz": [
        {
          "question": "调试 Node 与服务端代码时，官方推荐的工具是什么？它补上了浏览器 DevTools 的什么缺口？",
          "answer": "VS Code 的内置 Node 调试器。浏览器 DevTools 只覆盖前端运行时，服务端代码它管不到——VS Code 调试器让你直接在编辑器里对 Node 进程断点、单步、查变量。"
        },
        {
          "question": "官方文档里被点名「特别留意」的功能是什么？为什么？",
          "answer": "JavaScript Debug Terminal——它是把调试器跑起来的一种简单入口：在这种终端里启动的 Node 进程自动带上调试能力，省去配置 launch 文件的步骤。"
        },
        {
          "question": "官方怎么定位这个工具在你学习与职业生涯中的分量？",
          "answer": "「学习到此阶段的关键工具（critical tool），并且很可能成为你职业生涯中每天使用的主力工具」——这也是为什么值得专门开一课把它领进门。"
        }
      ],
      "optional": [],
      "note": "本课官方正文极短（全站最短课之一），本体是两条 Assignment 资料：视频教程看流程、官方文档查细节。学完别把调试器收起来——下一章 Express 起，每个项目都用得上断点。",
      "why": "从 World 7 开始，你的代码离开浏览器、住进服务器进程——console.log 当然还能用，但服务端逻辑一多（路由、中间件、数据库查询层层嵌套），靠打印日志排查会迅速失控。这一课很短，但它递给你的工具会陪你走完整个后端课程：先在编辑器里把断点调试练熟，后面 Express 章的每一课都有顺手兵器。",
      "sections": [
        {
          "h": "从浏览器 DevTools 到编辑器调试器",
          "p": [
            "到目前为止，你可能只依赖过**浏览器的 DevTools** 来调试代码。轮到 **Node 和服务端代码**时，**VS Code 有一个顺手的内置调试器**——你可以直接在编辑器里完成调试。",
            "官方估计你**在课程早前的某些环节已经用过它**；而本课的任务是让你正式熟悉 **VS Code Node 调试器**。"
          ]
        },
        {
          "h": "为什么官方称它「关键工具」",
          "p": [
            "官方原话的定位：**这是你学习到这个阶段的关键工具（a critical tool at this point in your learning）**，并且**很可能成为你职业生涯中每天使用的主力工具**。",
            "换句话说：这不是一个「知道就好」的可选技能，而是后端工程师的日常装备——值得现在花一小时练熟。"
          ]
        },
        {
          "h": "Assignment：一视频一文档",
          "p": [
            "① 看这支**关于 VS Code 里 Node.js 调试的视频教程**（VS Code 官方频道），亲眼看流程跑一遍（资料区有链接；为英文视频）。",
            "② 读 **VS Code Node 调试器官方文档**——**特别留意 JavaScript Debug Terminal**：这是把调试器跑起来的一种简单方式（资料区有链接）。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "用 console.log 海战术代替断点调试",
          "text": "打印日志当然能用，但服务端调用链一深（路由→控制器→数据库），靠猜测式插桩排查既慢又容易改漏。官方把 VS Code 调试器定位成「关键工具」正是这个原因：断点停住现场、直接查看每一层变量，比反复改代码加打印高效得多。"
        },
        {
          "title": "错过 JavaScript Debug Terminal 这个入口",
          "text": "很多人以为 VS Code 调试必须写 launch.json 配置——官方文档点名的 JavaScript Debug Terminal 是更简单的路：在这种终端里 node 启动的进程自动挂调试器。不知道它，入门成本被凭空抬高。"
        }
      ],
      "official": {
        "assignment": [
          "看这支关于 VS Code 里 Node.js 调试的视频教程（VS Code 官方频道），看流程实际跑一遍",
          "读 VS Code Node 调试器官方文档——特别留意 JavaScript Debug Terminal，这是让调试器跑起来的简单方式"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/introduction_to_nodeJS/debugging_node.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "4f4f441d87f165b5c8b2afa5b509045c6083d8bf4a06433f5b69b154bb9dec90",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "nodejs-basic-informational-site",
      "title": "Project: Basic Informational Site",
      "zh": "项目：基本信息站点",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/nodejs-basic-informational-site",
      "summary": "「NodeJS 入门」章的收官项目（全站第 25 门 Project）：官方说你现在「知道得足够多、可以危险了」（know enough to be dangerous）——Node 要学的当然还有很多，但你已经真的能用它做出东西了。任务：创建一个非常基础的信息站点，包含 4 个页面——index、about、contact-me 和 404。官方明确：页面**内容**根本不重要，不必花时间填充或美化。两步走：① 建项目目录，在里面创建 index.html、about.html、contact-me.html、404.html 四个文件；② 创建 Node 服务器文件 index.js，按 URL 服务正确的页面——localhost:8080 给 index.html、/about 给 about.html、/contact-me 给 contact-me.html，其余任何路径显示 404.html。卡住了随时回「起步」课复习。",
      "guide": "以下是官方项目要求的中文化与拆解。**官方开场**：到现在你应该「知道得足够多、可以危险了」——要学的当然**还有更多**，但关于 Node 你已经知道得足够多、**能真的做出东西**了。那就做吧！你要创建一个**非常基础的信息站点**，包含 **4 个页面：index、about、contact-me 和 404**。官方提醒：**这些页面的内容其实并不重要**——没必要花很多时间填充它们或把它们弄漂亮。**第 1 步：建目录与四个页面文件**。创建一个项目目录，在其中创建四个文件：**index.html、about.html、contact-me.html、404.html**（内容随意，能区分开就行）。**第 2 步：写服务器、按 URL 分发页面**。创建 Node.js 服务器文件 **index.js**，加入按 URL 服务正确页面所需的代码：**localhost:8080**（根路径）→ 用户看到 **index.html**；**localhost:8080/about** → **about.html**；**localhost:8080/contact-me** → **contact-me.html**；用户访问**上面没列出的任何页面**时 → 显示 **404.html**。**技术路线提示（基于「起步」课学过、官方未展开的部分）**：用 http 模块的 createServer 建服务器并监听 8080 端口；在处理器里用 URL 解析拿到请求路径；用 fs 模块读取对应的 html 文件并写回响应——404 是所有已列路径之外的兜底分支，记得配上 404 状态码。**卡住了怎么办**：官方原话——随时回**「起步」课**（Getting Started）复习。**本站验收清单（非官方，供自查）**：① node index.js 启动无报错；② 浏览器访问根路径、/about、/contact-me 分别显示三个不同页面；③ 访问任意乱写路径（如 /xyz）显示 404 页面；④ 用开发者工具 Network 面板确认 404 响应的状态码是 404 而非 200；⑤ 服务器进程保持运行、连续多次请求都正常。",
      "understand": [
        "这是「起步」课五个模块的**最小组合实战**：http 收请求 + url 解析路径 + fs 读文件回写响应",
        "4 个页面 = 3 个具名路由 + **1 个兜底**：没列出的任何路径都必须落到 404.html",
        "官方定调：**页面内容不重要**——练的是服务器分发逻辑，不是前端手艺",
        "「知道得足够多、可以危险了」：官方对此时你能力的评价——还远未学完，但已经能做出真东西"
      ],
      "terms": [
        {
          "en": "Informational site",
          "zh": "信息站点：多个静态页面按路径分发的网站——服务端渲染时代最基础的网站形态"
        },
        {
          "en": "404 page",
          "zh": "404 页面：请求的路径不存在时返回的兜底页——配套的状态码 404 表示「未找到」"
        },
        {
          "en": "Request handler",
          "zh": "请求处理器：createServer 接受的函数——每次请求到达时执行，本项目里负责「解析路径→选文件→回写」"
        }
      ],
      "tasks": [
        "创建项目目录，并在其中创建四个页面文件：index.html、about.html、contact-me.html、404.html（内容随意，官方明说不必花时间填充或美化）",
        "创建 Node.js 服务器文件 index.js，按 URL 服务正确的页面：根路径（localhost:8080）给 index.html；/about 给 about.html；/contact-me 给 contact-me.html；用户访问没列出的任何路径时显示 404.html",
        "卡住时回「起步」课（Getting Started）复习对应模块——官方指定的求助路径"
      ],
      "quiz": [
        {
          "question": "本项目要建哪 4 个页面？它们与 URL 路径的对应关系是什么？",
          "answer": "index.html、about.html、contact-me.html、404.html。对应关系：根路径 localhost:8080 → index.html；/about → about.html；/contact-me → contact-me.html；其余任何未列出的路径 → 404.html（兜底）。"
        },
        {
          "question": "官方对页面内容的要求是什么？这个项目的真正练习点在哪里？",
          "answer": "页面内容「其实并不重要」，不必花时间填充或美化。真正的练习点是服务器端的分发逻辑：接收请求、解析 URL 路径、用 fs 读取对应文件、写回响应——即「起步」课 http / url / fs 模块的最小组合。"
        },
        {
          "question": "用户访问 /xyz（一个不存在的路径）时应该发生什么？只返回 404.html 内容够不够？",
          "answer": "应该显示 404.html。只返回文件内容还不够严谨——响应状态码也应该是 404 而不是默认的 200，否则浏览器和爬虫都会把这个页面当成正常内容（本站验收清单第 ④ 条专门用 Network 面板核对这一点）。"
        }
      ],
      "optional": [],
      "note": "Project 红线课：本站不提供成品代码，examples 为空数组——官方要求全部转述为文字，实现路径自己搭（这正是练习本体）。这是全站第 25 门 Project 课、World 7 的第一门。做完别删：Express 章第 2 课「Express 简介」的 Assignment 会要求你回到这个项目、装上 Express 并用几个 app.get() 重写它——同一个站点会经历「纯 Node 版」到「Express 版」的进化，亲手对比两版的代码量，你就懂了框架存在的意义。",
      "why": "五个模块各学各的，永远不知道学会了没有——这个项目就是那把尺子：一个 4 页小站，逼你把 http、url、fs 三样东西在一个真实的请求-响应循环里串起来。它也是整条 NodeJS 课程的「原点项目」：下一章你会用 Express 重写它，再下一章你的留言板、库存应用都从这里长大。写得糙没关系，官方明说内容不重要——重要的是这是你第一个真正跑在服务器上的作品。",
      "sections": [
        {
          "h": "这是个什么项目",
          "p": [
            "官方开场：到现在你应该**「知道得足够多、可以危险了」**（know enough to be dangerous）。要学的当然还有很多，但关于 Node 你已经知道得**足够多、能真的做出东西**了。那就做吧！",
            "你要创建一个**非常基础的信息站点**，包含 **4 个页面：index、about、contact-me 和 404**。",
            "官方提醒（重要）：**这些页面的内容其实并不重要**——没必要花很多时间填充它们、或试图把它们弄漂亮。练习点在服务器，不在页面。"
          ]
        },
        {
          "h": "第 1 步：目录与四个页面文件",
          "p": [
            "创建一个**项目目录**，并在目录里创建以下四个文件：**index.html、about.html、contact-me.html、404.html**。",
            "内容随意——每个文件写个能认出来的标题即可（比如「关于」「联系我」「走丢了」），你要练的不是 HTML。"
          ]
        },
        {
          "h": "第 2 步：服务器按 URL 分发页面",
          "p": [
            "创建你的 Node.js 服务器文件 **index.js**，并加入**按 URL 服务正确页面**所需的代码。官方的路由表：",
            "**localhost:8080**（根路径）→ 把用户带到 **index.html**；**localhost:8080/about** → **about.html**；**localhost:8080/contact-me** → **contact-me.html**；用户试图访问**上面没列出的任何页面**时 → 显示 **404.html**。",
            "结合「起步」课学过的模块，实现思路是：用 **http.createServer** 建服务器并监听 8080 端口；在请求处理器里**解析 URL 得到路径**；按路径用 **fs 读取对应文件**写回响应；所有未命中路径走 404 分支（响应状态码也应是 404）。"
          ]
        },
        {
          "h": "卡住了怎么办 + 本站验收清单",
          "p": [
            "官方原话：如果任何时候卡住了，**随时回「起步」课**（Getting Started）复习。",
            "**本站自拟验收清单（非官方要求，供自查）**：① node index.js 启动无报错；② 根路径、/about、/contact-me 三个地址分别显示三个不同页面；③ 任意乱写路径（如 /xyz）显示 404 页面；④ 开发者工具 Network 面板里，404 响应的**状态码是 404** 而非 200；⑤ 连续多次请求服务器都正常响应、进程不崩。",
            "完成后把项目留着：下一章「Express 简介」的 Assignment 会要求你**用 Express 重写这个项目**——两版对照，框架的价值一目了然。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "404 兜底漏掉状态码",
          "text": "只把 404.html 的内容发回去、状态码却还是默认 200，是这个项目最常见的半对答案——浏览器看着正常，但爬虫与监控都会把死页面当活页面。writeHead 时显式给 404，Network 面板里核对一遍。"
        },
        {
          "title": "在页面美化上花时间",
          "text": "官方明说页面内容不重要、不必弄漂亮——这个项目的全部价值在 index.js 的分发逻辑里。花一小时调 CSS 等于练错了科目；页面能区分开就够，把时间留给路径解析和 404 分支。"
        },
        {
          "title": "路径比较写成包含匹配",
          "text": "用「路径里含有 about」这类包含判断代替精确比较，会让 /about-me 也命中 about.html、让兜底分支永远轮不到。按官方路由表逐条精确匹配，未命中才落 404——这个习惯到 Express 章的路由匹配还会继续用。"
        }
      ],
      "official": {
        "assignment": [
          "创建一个项目目录，并在其中创建以下文件：index.html、about.html、contact-me.html、404.html",
          "创建你的 Node.js 服务器文件 index.js，并加入按 URL 服务正确页面所需的代码：localhost:8080 带用户到 index.html；localhost:8080/about 到 about.html；localhost:8080/contact-me 到 contact-me.html；用户试图访问上面没列出的页面时显示 404.html"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/introduction_to_nodeJS/project_basic_informational_site.md（本站自行编写简体讲解与任务拆解，未改编自任何第三方中文课程；Project 红线：不提供成品答案）",
        "sha256": "f8a3bc121d31b5e4716a8d6bde23d3fe2922a7c3576071c2575e8dd94c71c30d",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "nodejs-environment-variables",
      "title": "Environment Variables",
      "zh": "环境变量",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/nodejs-environment-variables",
      "summary": "「NodeJS 入门」章的收官知识课：代码总是运行在某个环境里——换台机器、换个托管商，就是换了环境；而应用可以像函数收参数一样收「环境变量」。两大用途：① 给不同环境（开发 vs 生产）传不同值而不改源码——按惯例这个变量叫 NODE_ENV；② 存机密（数据库 URL 与凭证、API key），配合 .gitignore 防泄漏。加载方式四种演进：命令行内联（NODE_ENV=prod node index.js， cumbersome）→ shell 的 export（存进当前会话，新 shell 就没了，printenv 可查）→ Node v24.10 起内置稳定支持的 .env 文件（--env-file CLI 选项或 process.loadEnvFile()，文件缺失会抛错；必须进 .gitignore）→ 历史方案 dotenv 库（原理相同，TOP 课程用不上）。访问统一走 process.env——环境变量永远是字符串，要数字或布尔得自己转。两条官方贴士：部署时仓库里没有 .env，生产环境要换加载方式（--env-file-if-exists 等）；把所需环境变量写进 README（可附 .env.sample 假例）。红色警戒：.env 加进 .gitignore，绝不发布。",
      "guide": "以下是官方原课的中文化梳理。**环境是什么**：你运行代码时，代码跑在一个特定**环境**里。换台机器跑？不同环境。把网站托管到 Netlify 或 Vercel？和你机器不同的环境。**每个环境是一套独有的工具与配置**。**函数参数类比**：你肯定写过被不同实参多次调用的函数——函数会因实参不同而行为不同或返回不同值。应用本身也一样：可以用**环境变量（environment variables）**。运行代码时把值传进这些变量，不同环境给不同的值。**两大用途**：① **给不同环境不同的值**——比如开发时的你的机器 vs 部署后的网站宿主——**而不必修改源码**；② **存机密**：数据库 URL 与凭证、API key 等。例一：生产环境可能想要比开发环境更多的日志与分析——源码里放一个「跑在 dev 还是 prod」的环境变量、按值分支即可；这非常常见，**按惯例这个变量叫 NODE_ENV**（虽然叫别的名字也一样能跑）。例二：应用连着数据库，但开发时想用**单独的测试库**而不是生产库——本地开发把测试库的 URL 与凭证传进应用，部署环境则配生产库的值；再把环境变量存进一个**加进 .gitignore 的文件**，推送时就永远不会暴露内容。**加载方式一：命令行内联**——直接在运行命令里定义：NODE_ENV=prod VIDEO_URL=\"...\" node index.js（值不含空格或 = 等特殊字符时引号可选）。命名惯例是 **UPPER_SNAKE_CASE**（昵称 SCREAMING_SNAKE_CASE / SHOUTY_CASE）。变量一多就很繁琐；敏感数据更糟——你绝不会想把写着数据库凭证的 package.json npm script 推上去。**加载方式二：export**——shell 命令 export NODE_ENV=prod VIDEO_URL=\"...\" 把变量存进**当前 shell 会话**：第一个 shell 里跑 node index.js 能读到 prod；新开 shell 读到 undefined（新环境没设过）。覆盖就重新 export；**printenv** 可查当前 shell 全部环境变量（会发现一大堆你没设过的——shell 自己加载时就带了很多）。缺点：shell 一关全丢，变量多了记不住。**加载方式三：.env 文件（Node 内置，现役推荐）**——**Node 自 v24.10 起对环境变量文件有内置的稳定支持**。按惯例在项目根建 **.env** 文件，内容格式 NAME=VALUE（可写 # 注释）。**这个文件必须加进 .gitignore**，防止机密被发布！加载方式两种：**--env-file CLI 选项**（node --env-file=.env index.js）或 JS 里直接调 **process.loadEnvFile()**——两者在 .env 文件缺失时都会**抛错**。**部署贴士（官方 tip）**：部署用了环境变量的应用时，**仓库里不会有 .env 文件**——要研究你选的部署服务怎么设环境变量（通常网页界面就有入口，否则查它文档）。因此**生产环境不能像开发环境那样加载**（找不到 .env 会抛错）——办法很多：生产 npm script 不带 --env-file、用 **--env-file-if-exists** 选项、或给 process.loadEnvFile() 加错误处理。**历史方案：dotenv**——Node 并非一直内置支持环境变量文件，野外你会大量见到 **dotenv** 之类的库。原理与内置功能相同，只是要按库自己的说明接入；这类库也可能提供 Node 没有内置的更复杂功能（对复杂项目的团队有益），**但就 TOP 课程而言用不上**。**访问：process.env**——环境变量经 Node 内置 **process 对象的 env 属性**访问：Node 把每个环境变量按名字装载成 process.env 的属性，像普通对象属性一样读。改值就改 .env 再重跑程序。**注意：环境变量的值永远是字符串**——想当数字或布尔用必须自己转换。**文档化贴士（官方 tip）**：项目用了环境变量时，帮你要把**跑起来需要哪些环境变量**写进 **README.md**（哪些必需、该填什么）；还可以附一个假例 **.env.sample** 供他人复制改名填值。**红色警戒（官方 critical note）**：环境变量不只用于敏感数据，但你常常正需要它干这个——项目里**务必把 .env 加进 .gitignore，绝不要发布它**。**Assignment 一条**：读 Node 官方环境变量文档，了解更多文件语法与 CLI 用法（资料区有链接）。",
      "understand": [
        "**环境变量 = 应用层的函数参数**：运行时代码从环境收值，不同环境给不同值，源码零修改",
        "两大用途：**按环境分叉**（NODE_ENV 惯例：dev / prod 行为不同）与**存机密**（数据库凭证、API key）",
        "加载方式演进：命令行内联（繁琐）→ **export**（只在当前 shell 会话，关掉就丢）→ **.env 文件**（Node v24.10 起内置稳定支持，现役推荐）→ dotenv 库（历史方案，TOP 用不上）",
        ".env 两种加载法：**--env-file CLI 选项** 或 **process.loadEnvFile()**——文件缺失都**抛错**；生产环境要换姿势（--env-file-if-exists / 错误处理 / 平台注入）",
        "访问统一走 **process.env**；**值永远是字符串**，数字布尔自己转",
        "命名惯例 **UPPER_SNAKE_CASE**；机密纪律：**.env 必须进 .gitignore**、所需变量写进 README（可附 .env.sample）"
      ],
      "terms": [
        {
          "en": "Environment variable",
          "zh": "环境变量：值由运行环境提供的变量——像函数参数一样传入应用，不同环境不同值，源码零修改"
        },
        {
          "en": "NODE_ENV",
          "zh": "按惯例标记「跑在 dev 还是 prod」的环境变量名——非常常见的约定，但用别的名字也一样能跑"
        },
        {
          "en": ".env file",
          "zh": "项目根目录存放环境变量的约定文件（NAME=VALUE 格式）——必须加进 .gitignore；Node v24.10 起内置稳定支持"
        },
        {
          "en": "process.env",
          "zh": "Node 内置 process 对象的 env 属性：全部环境变量的入口，按名字当普通对象属性读；值永远是字符串"
        },
        {
          "en": "export",
          "zh": "shell 命令：把环境变量存进当前 shell 会话——新开的 shell 读不到，会话关闭即丢；printenv 可查"
        },
        {
          "en": "dotenv",
          "zh": "加载 .env 文件的第三方库——Node 内置支持出现之前的野外主流方案，原理相同；TOP 课程不需要"
        },
        {
          "en": "UPPER_SNAKE_CASE",
          "zh": "环境变量命名惯例：全大写下划线分隔（昵称 SCREAMING_SNAKE_CASE / SHOUTY_CASE）"
        }
      ],
      "tasks": [
        "读 Node 官方文档的环境变量（Environment variables）一章，了解更多 .env 文件语法与 CLI 用法（链接在资料区）"
      ],
      "quiz": [
        {
          "question": "环境变量的两大用途是什么？各举一个官方例子。",
          "answer": "① 给不同环境不同的值而不改源码——例：生产环境要更多日志与分析，源码按 NODE_ENV 的值分支（惯例名，非强制）；② 存机密——例：开发时传测试库的 URL 与凭证、部署环境配生产库的值，机密文件加进 .gitignore 防推送泄漏。"
        },
        {
          "question": "export 方式设置的环境变量，新开一个 shell 再跑 node index.js 会读到什么？为什么？",
          "answer": "读到 undefined。export 只把变量存进当前 shell 会话——新 shell 是新环境，什么都没设过。这也是 .env 文件方案要解决的痛点之一：会话一关全丢、变量多了记不住。"
        },
        {
          "question": "Node 从哪个版本起内置稳定支持 .env 文件？两种加载方法是什么？文件缺失时会怎样？",
          "answer": "v24.10 起。两种方法：--env-file CLI 选项（如 node --env-file=.env index.js）或在 JS 里调 process.loadEnvFile()。两者在 .env 文件缺失时都会抛错——这正是部署贴士的由来：生产环境仓库里没有 .env，要改用 --env-file-if-exists、不带该选项的 npm script 或错误处理。"
        },
        {
          "question": "process.env.PORT 读出来的值是字符串 \"3000\"。直接拿它做算术比较会怎样？正确做法是什么？",
          "answer": "环境变量的值永远是字符串——\"3000\" 参与算术或严格比较会出隐蔽 bug（比如 === 3000 恒为 false）。正确做法：用之前显式转换，如 Number(process.env.PORT)。"
        },
        {
          "question": "官方对 .env 文件的红色警戒（critical note）是什么？还建议为协作者做哪两件事？",
          "answer": "务必把 .env 加进 .gitignore，绝不发布它——机密一旦推上远端就等于公开。为协作者：① 把跑项目所需的环境变量（哪些必需、该填什么）写进 README.md；② 附一个假例 .env.sample，供他人复制改名后填自己的值。"
        }
      ],
      "optional": [],
      "note": "时效性事实照录官方原文：Node 自 v24.10 起内置稳定的 .env 支持，dotenv 库自此成为「野外仍常见但课程不需要」的历史方案——你以后翻到的旧教程大概率还在教 dotenv，原理完全相同。Express 章「部署」一课的官方贴士会回指本课（数据库凭证不要硬编码）；「使用 PostgreSQL」一课的 Assignment 会要求你把连接信息改成环境变量——本课就是为那一步准备的。",
      "why": "这是「NodeJS 入门」章的收官课，也是整条后端课程的安全底座：从 Express 章开始，你的应用会连数据库、会上线部署——连接串、密码、API key 这些东西写死在源码里的代价，是一次 git push 就永久泄漏。环境变量给的解法极简：值住在环境里、代码只读名字。官方把这门课放在第一个项目之后、Express 之前，正是这个用意——先学会带锁干活，再进工地。",
      "sections": [
        {
          "h": "环境与「应用层的函数参数」",
          "p": [
            "你运行代码时，代码跑在一个**特定环境**里。换台机器跑？**不同环境**。把网站托管到 Netlify 或 Vercel 那样的地方？**和你机器不同的环境**。**每个环境是一套独有的工具与配置。**",
            "你肯定写过被不同实参多次调用的函数——函数可能因实参不同而行为不同、返回不同的值。就像函数参数一样，**应用本身也可以使用环境变量**：运行代码时把值传进去，不同环境给不同的值。"
          ]
        },
        {
          "h": "两大用途：按环境分叉与存机密",
          "p": [
            "环境变量就是**值随环境而变**的变量。因为「特定于环境」，我们可以用它们：**给不同环境提供不同的值**（比如开发时你的机器 vs 部署后的网站宿主），**而不必修改源码**；以及**存储机密**——数据库 URL 与凭证、API key 之类。",
            "例一：生产环境可能想要比开发环境**更多的日志与分析**。源码里放一个「跑在 dev 还是 prod 模式」的环境变量、按它分支做事即可。这非常常见，**按惯例这个变量叫 NODE_ENV**——虽然叫任何别的名字也一样能跑。",
            "例二：你在建一个连数据库的 API，但开发时想用**单独的测试库**而不是生产库。本地开发时把测试库的 URL 与凭证传进应用；部署环境则持有生产库的值。更进一步：把环境变量的值存进一个**加进 .gitignore 的文件**——推送变更时，文件内容永远不会暴露。"
          ]
        },
        {
          "h": "加载方式一二：命令行内联与 export",
          "p": [
            "加载环境变量的方式有好几种，有的更繁琐、有的在很多 Node 版本里支持还不稳定。**方式一：直接写在运行命令里**——不用光秃秃的 node index.js，而是（值不含空格或 = 等特殊字符时引号可选）：在命令前段定义 NODE_ENV 与 VIDEO_URL 再启动应用。代码里所有用到这些变量的地方就都有值了，**就像函数参数**。命名惯例是 **UPPER_SNAKE_CASE**（有时被戏称为 SCREAMING_SNAKE_CASE 或 SHOUTY_CASE）。但你很快会发现这**相当繁琐**——变量一多更是如此；有敏感数据时更糟：你绝不会想把含数据库凭证的 npm script 连 package.json 一起推上去。",
            "**方式二：shell 的 export 命令**——把环境变量及其值**存进当前 shell 会话**。此后在**这个** shell 里跑 node index.js，用到 NODE_ENV 的地方读到 prod；**新开一个 shell** 再跑，读到的是 undefined——新环境里什么都没设。要覆盖某个变量，重新 export 新值即可。",
            "这比方式一舒服得多、也真能把敏感数据藏住。但用 **printenv** 查看当前 shell 的全部环境变量时你会发现：一大堆你从没设过的东西——**shell 自己加载时就带了很多环境变量**。有点烦：我们只想管自己应用的那几个！而且 **shell 一终止，我们的环境变量就全丢了**——变量一多，挨个记住再在新 shell 里重新 export 简直是噩梦。于是……"
          ]
        },
        {
          "h": "加载方式三：.env 文件（Node 内置，现役推荐）",
          "p": [
            "**Node（自 v24.10 起）对存放环境变量的文件有内置的稳定支持。**按惯例在项目根目录创建一个叫 **.env** 的文件，里面按 **NAME=VALUE** 格式写上全部环境变量（# 开头是注释）。",
            "**这个文件必须加进你的 .gitignore**，防止机密被发布出去！",
            "Node 提供几种加载它的办法：**--env-file CLI 选项**（例如 node --env-file=.env index.js），或在 JavaScript 里直接调 **process.loadEnvFile()** 方法。**两者在 .env 文件缺失时都会抛错。**"
          ]
        },
        {
          "h": "部署时的环境变量 + 历史方案 dotenv",
          "p": [
            "**官方贴士：环境变量与部署**——部署一个用了环境变量的应用时，**你的仓库里不会有 .env 文件**，所以得研究你选的部署服务如何处理环境变量的设置：通常它们的网页界面就有入口，否则永远查它们的文档！正因为如此，**生产环境不该像开发环境那样加载变量**（找不到 .env 大概率直接抛错）。防法很多：给生产加一条不带 --env-file 的 npm script、用 **--env-file-if-exists** CLI 选项、或给 process.loadEnvFile() 实现错误处理。",
            "**dotenv：历史方案**——Node 并非一直内置支持环境变量文件，野外你大概率见过 **dotenv** 这类库。原理与内置功能相同，只是要按库自己的说明接入。这类库也可能提供 Node 没有内置的更复杂功能（对做更复杂项目的团队有益），**但就 TOP 课程而言，它们不是必需的**。"
          ]
        },
        {
          "h": "访问：process.env 与「永远是字符串」",
          "p": [
            "环境变量的访问经由 Node 内置的 **process 对象**——更具体说是它的 **env 属性**。Node 会把每个环境变量**以名字为属性**装载到 process.env 上，之后像读普通对象属性一样读它。",
            "源码里**不硬编码这些值**！想改某个环境变量的值，改 .env 文件再重跑程序即可。**还要注意：环境变量的值永远是字符串**——想当数字或布尔用，必须自己转换。",
            "**官方贴士：给环境变量写文档**——项目用到环境变量时，帮你要跑起来的人需要知道**要哪些变量**。强烈建议把它们写进 **README.md**：哪些是必需的、该填什么内容。也可以附一个假例 .env 文件（比如 **.env.sample**），别人复制改名、填上自己的值就能用。"
          ]
        },
        {
          "h": "红色警戒与 Assignment",
          "p": [
            "**官方 critical note 原文要点：保管好你的机密！**环境变量不只用于敏感数据，但你**经常**正需要它们干这个。项目里务必把 **.env 加进 .gitignore**，这样你**就不会发布它**。",
            "**Assignment 一条**：读 **Node 官方文档的环境变量一章**，了解更多文件语法与 CLI 用法（资料区有链接）。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "bash",
          "code": "NODE_ENV=prod VIDEO_URL=\"https://www.youtube.com/watch?v=X2CYWg9-2N0\" node index.js",
          "note": "加载方式一：命令行内联——在运行命令前段定义变量。值不含空格或 = 等特殊字符时引号可选。变量一多就繁琐，敏感数据放 npm script 里更是禁忌。"
        },
        {
          "lang": "bash",
          "code": "export NODE_ENV=prod VIDEO_URL=\"https://www.youtube.com/watch?v=X2CYWg9-2N0\"",
          "note": "加载方式二：export——变量存进当前 shell 会话。只在这个 shell 里有效：新开 shell 读到 undefined；会话终止全丢。覆盖 = 重新 export；printenv 查看当前 shell 全部变量。"
        },
        {
          "lang": "properties",
          "code": "# .env\n\nNODE_ENV=prod\nVIDEO_URL=\"https://www.youtube.com/watch?v=X2CYWg9-2N0\"",
          "note": "加载方式三：项目根的 .env 文件（NAME=VALUE 格式，# 注释）。Node v24.10 起内置稳定支持；必须加进 .gitignore。加载：node --env-file=.env index.js 或 process.loadEnvFile()——文件缺失两者都抛错。"
        },
        {
          "lang": "javascript",
          "code": "if (process.env.NODE_ENV === \"prod\") {\n    // do production-specific stuff\n}\n\n// don't want to ruin the surprise by hardcoding the URL!\n// it might even change every few days!\nredirectUserToSuperSecretVideo(process.env.VIDEO_URL);",
          "note": "访问统一走 process.env：按变量名当对象属性读，源码零硬编码。注释是官方原文的幽默：别把 URL 写死剧透，它甚至可能几天一变。记住值永远是字符串。"
        }
      ],
      "pitfalls": [
        {
          "title": ".env 被 commit 进 git",
          "text": "官方用 critical note 强调的正是这个：机密文件一旦推上远端就等于永久公开（历史记录里删不干净）。动手建 .env 的同一分钟就把它写进 .gitignore——顺序反过来一次就可能出事。"
        },
        {
          "title": "生产环境照搬开发环境的加载方式",
          "text": "部署时仓库里不会有 .env（它被 gitignore 了）——--env-file 或 loadEnvFile 找不到文件直接抛错、应用起不来。官方给了三条路：生产 npm script 不带 --env-file、用 --env-file-if-exists、或给 loadEnvFile 加错误处理；变量值改由部署平台的界面注入。"
        },
        {
          "title": "把环境变量的值当数字或布尔用",
          "text": "process.env 里的一切都是字符串：PORT === 3000 恒为 false、if (process.env.DEBUG) 对字符串 \"false\" 也判真。用之前显式转换（Number(...)、=== \"true\"），这类 bug 在本地好好的、上线就炸。"
        }
      ],
      "official": {
        "assignment": [
          "读 Node 官方文档的环境变量（Environment variables）一章，了解更多文件语法与 CLI 用法"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/introduction_to_nodeJS/environment_variables.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "77d8838ed92741cc142dabd4b5366970bb1601ba302e965fb7f5a06b2f48c624",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "nodejs-introduction-to-frameworks",
      "title": "Introduction to Frameworks",
      "zh": "框架简介",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/nodejs-introduction-to-frameworks",
      "summary": "Express 章的开篇导论（短课，与「后端入门」同住 shared/the_back_end/、NodeJS 与 Ruby 路径共用）。框架的起源很有喜感：程序员——其中最优秀的那批相当「懒」（好的意义上）——厌倦了为应用的基础任务一遍又一遍写同样的代码，于是把这些回收代码打包起来，称之为框架。除了防止重复，框架还提供出色的组织性：它们倾向于强迫你按高度模块化、真正干净的方式组织文件与代码——用任何框架开新应用，你会直接得到几十个已按合理层级组织好的文件夹，遵循 MVC（模型-视图-控制器）分离这类良好实践。官方类比：这不太像给代码「按数字涂色」，但确实能让一切井井有条。一门语言往往有多个流行框架，名字一个比一个响亮：Ember、Meteor、Django、Rails……光 Ruby 一门，Rails 之外还有 Sinatra 与 Padrino；Wikipedia 有一份框架大全对比表，足以让你体会数量之多。",
      "guide": "以下是官方原课的中文化梳理。**框架从哪来**：程序员——其中最优秀的那批是**相当「懒」的人（好的意义上）**——厌倦了仅仅为了覆盖应用想执行的**基础任务**，就得一遍又一遍地写同样的代码。于是他们把这些**回收代码打包在一起，称之为框架（framework）**。**框架给什么**：除了**防止重复**，框架提供**出色的组织性**。它们倾向于**强迫你**以保持高度模块化、真正干净的方式组织文件与代码。用任何框架开一个新应用，你会直接得到**几十个已按合理层级组织好的文件夹**，遵循诸如 **MVC（Model-View-Controller，模型-视图-控制器）分离原则**这样的良好实践。官方类比：这不太算给代码「按数字涂色」（color-by-numbers），但它确实能让一切**井井有条**。**框架的生态**：一门给定的语言往往有**好几个不同的流行框架**，名字可以很激动人心：**Ember、Meteor、Django、Rails** 等等。**Wikipedia 有一份框架的全面对比表**，应该能让你体会到它们的数量之多。光说 Ruby：虽然 **Rails** 最流行，此外还有 **Sinatra** 和 **Padrino**，以及更多。**Assignment 两条**：① 读 Dev.to 这篇简短的「框架是什么、为什么该用一个」；② 浏览 MDN 的后端框架概览，理解挑选框架时的部分思考过程。",
      "understand": [
        "框架的起源：**把重复的基础任务代码打包回收**——「最优秀的程序员相当懒（好的意义上）」",
        "框架的两大馈赠：**防重复** + **强组织**——几十个按合理层级预组织的文件夹，遵循 MVC 分离等良好实践",
        "框架「倾向于强迫你」保持模块化与干净——约束即秩序，但还不到「按数字涂色」的程度",
        "一门语言通常有**多个**流行框架（Ruby 有 Rails / Sinatra / Padrino）；选哪个是有思考过程的决策（MDN 概览讲的就是这个）",
        "MVC = Model-View-Controller：**模型-视图-控制器**分离——马上要学的 Express 章正是按这三样东西分课的（Controllers / Views 各一课）"
      ],
      "terms": [
        {
          "en": "Framework",
          "zh": "框架：把应用基础任务的回收代码打包成的地基——防重复 + 强组织，并预置合理的文件层级"
        },
        {
          "en": "MVC (Model-View-Controller)",
          "zh": "模型-视图-控制器：把应用按职责三分的分离原则——数据（模型）、界面（视图）、调度（控制器）；框架预组织文件夹遵循的典型实践"
        },
        {
          "en": "Modular",
          "zh": "模块化：代码按职责拆成独立单元的组织方式——框架「强迫」你保持的两大品质之一（另一个是干净）"
        },
        {
          "en": "Rails / Sinatra / Django / Ember / Meteor",
          "zh": "各语言的流行框架名（Ruby 的 Rails 与 Sinatra、Python 的 Django、JavaScript 的 Ember 与 Meteor 等）——框架生态「一门语言多个选择」的例证"
        }
      ],
      "tasks": [
        "读 Dev.to 的短文《什么是 Web 框架、为什么我该用一个》（链接在资料区）",
        "浏览 MDN 的后端框架概览（Web frameworks），理解挑选框架时会经历的一些思考过程（链接在资料区）"
      ],
      "quiz": [
        {
          "question": "按官方叙述，框架是怎么诞生的？它解决的核心痛点是什么？",
          "answer": "程序员（最优秀的那批相当「懒」，好的意义上）厌倦了为应用的基础任务一遍遍写同样的代码，于是把回收代码打包成框架。核心痛点是重复——框架顺带还给了组织性：强迫你按模块化、干净的方式组织文件。"
        },
        {
          "question": "「用任何框架开新应用，你会得到几十个已组织好的文件夹」——官方说这遵循了什么实践？它对即将开始的 Express 章意味着什么？",
          "answer": "遵循 MVC（模型-视图-控制器）分离这类良好实践。Express 章正是按这个三分法推进的：Routes/Controllers 管调度、Views 管界面、数据层随后由 PostgreSQL 与 ORM 接管——框架预置的结构和课程的章节结构是同一张地图。"
        },
        {
          "question": "官方举 Ruby 为例说明框架生态的什么特点？",
          "answer": "一门语言往往有多个流行框架：Ruby 里虽然 Rails 最流行，但还有 Sinatra、Padrino 等等；Wikipedia 的对比表足以让人体会框架数量之多。所以「选框架」是一个真实存在的决策（MDN 概览讲的就是这个思考过程），不是语言附赠的唯一答案。"
        }
      ],
      "optional": [],
      "note": "本课与 World 7 开篇的「后端入门」是姊妹篇——两门课同住官方 curriculum 仓的 shared/the_back_end/ 目录，是 NodeJS 与 Ruby 两条学习路径共用的课文。它是纯概念导论、没有代码；下一课「Express 简介」开始，MVC 的三个字母会一个接一个变成你亲手写的文件。",
      "why": "你刚用纯 Node 写完了 4 页小站——http、url、fs 三个模块手工串联，路由靠 if 分支，404 靠兜底判断。能跑，但你大概已经嗅到一丝不妙：页面再多十倍呢？表单、数据库、模板呢？这一课告诉你那份不妙叫什么：重复的基础任务代码。框架就是前人对此的答案，而 Express 章将把「防重复 + 强组织」这两个词变成 routes/、controllers/、views/ 三个真实文件夹。带着「MVC 三分」这张地图进入下一章，每一课你都知道自己在地图的哪个位置。",
      "sections": [
        {
          "h": "框架从哪来：「懒」驱动的打包回收",
          "p": [
            "程序员——**其中最优秀的那批是相当「懒」的人（好的意义上）**——厌倦了仅仅为了覆盖应用想执行的基础任务，就得**一遍又一遍写同样的代码**。",
            "于是他们把这些**回收代码打包在一起，称之为框架（framework）**。这就是框架的出生证明：它不是理论发明，而是对重复劳动的集体反抗。"
          ]
        },
        {
          "h": "框架给什么：防重复 + 强组织",
          "p": [
            "除了**防止重复**，框架提供**出色的组织性**。它们**倾向于强迫你**以保持高度模块化、真正干净的方式组织文件与代码。",
            "用任何框架开一个新应用，你会直接得到**几十个已经按合理层级组织好的文件夹**——遵循诸如 **MVC（Model-View-Controller）分离原则**这样的良好实践。",
            "官方的分寸感：这不太算给代码「按数字涂色」，但它**确实能让一切井井有条**。"
          ]
        },
        {
          "h": "框架生态：一门语言，多个选择",
          "p": [
            "一门给定的语言往往有**好几个不同的流行框架**，名字一个比一个响亮：**Ember、Meteor、Django、Rails**……",
            "**Wikipedia 有一份 Web 应用框架的全面对比表**，足以让你体会它们的数量之多。光说 Ruby：虽然 **Rails** 最流行，此外还有 **Sinatra** 与 **Padrino**，以及更多。",
            "**Assignment 两条**：① 读 Dev.to 的短文**「什么是 Web 框架、为什么我该用一个」**；② 浏览 **MDN 的后端框架概览**，理解挑选框架时的部分思考过程（两个链接都在资料区）。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "把框架和语言混为一谈",
          "text": "Rails 不是语言、Ruby 才是；Express 不是语言、JavaScript（跑在 Node 上）才是。框架是语言之上的打包地基——MDN 概览讲的「挑框架的思考过程」正是建立在这个区分上：先定语言，再在它的多个框架里做选择。"
        },
        {
          "title": "跳过这一课直接学 Express API",
          "text": "Express 章后面的课会大量使用 routes/controllers/views 的三分词汇——那就是本课 MVC 的落地。不理解「框架强迫你组织」这层意图，后面看到的文件夹结构就只是一堆规矩，而不是一张职责地图。"
        }
      ],
      "official": {
        "assignment": [
          "读 Dev.to 这篇简短的框架介绍（What is a web framework and why should I use one）",
          "浏览 MDN 的后端框架概览（Web frameworks），理解挑选框架时的部分思考过程"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 shared/the_back_end/introduction_to_frameworks.md（NodeJS 与 Ruby 路径共有课；本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "7ce362e9a8137880d725db9899db405b8976ede7a5a3a111d57de7bc40ab5b73",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "node-path-nodejs-introduction-to-express",
      "title": "Introduction to Express",
      "zh": "Express 简介",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-nodejs-introduction-to-express",
      "summary": "Express 章的正式开篇：上一节你用纯 Node 读写了服务器文件、服务了一个多页网站——你可能已经发现这个过程相当啰嗦繁琐，甚至 wondering 更复杂的场景要怎么管。答案是本课程使用的后端框架 Express：它替我们处理大量实现细节。Express 的定位很特别——刻意精简（barebones）、不持立场（unopinionated）：它允许我们按自己想要的方式做很多事、只装需要的功能扩展。灵活性拉满的代价是：在多个可行选项之间做决定有时会有点棘手。课程接下来会深入 Express 的各种用法：用 MVC 模式建全栈应用，以及建 REST API（就像你在天气应用与 React 购物车项目里用过的那些）。本课正文四件事：① 搭一个最小 Express 应用（npm init -y → npm install express → app.js：一个 app.get 路由 + app.listen，回调里的 error 判断很重要——没有它启动错误会静默失败）；② 官方提示端口应来自环境变量带兜底值（process.env.PORT || 3000）；③ 一个请求的旅程：浏览器导航 = 发 GET 请求并展示响应；Express 把请求存进 request 对象、让它穿过一条叫「中间件函数」的链，直到某个中间件让 Express 响应；多路由时第一个匹配 HTTP 动词与路径的路由接住请求——路由顺序很重要；④ 文件改动自动重启：Node 内置 --watch 模式（官方推荐），野外也常见 Nodemon。",
      "guide": "以下是官方原课的中文化梳理。**为什么需要 Express**：上一节你让 Node 跑了起来，学会了读写服务器上的文件、服务一个多页网站。**你可能已经发现这个过程有点啰嗦和繁琐**，甚至 wondered 更复杂的用例到底要怎么管。本课程将使用一个名叫 **Express** 的后端框架，它会**替我们处理许多实现细节**。**Express 的性格**：它本身是一个**刻意精简（barebones）、不持立场（unopinionated）**的框架——允许我们**按自己想要的方式**做很多事、**只用我们需要的功能**去扩展它。这给了极大的灵活性，但**在多个可行选项之间做决定有时会有点棘手**。**课程路线预告**：接下来会深入 Express 的各种用法——用 **MVC 模式**创建全栈应用，以及创建 **REST API**（就像你在天气应用、React 购物车项目里用过的那些）。要吸收的东西很多，**慢慢来**，别怕去 TOP Discord 服务器求助。**① 搭建 Express**：新目录里先 npm init -y 创建 package.json，然后 npm install express 安装依赖。创建 **app.js** 作为服务器起点（叫什么都行——index.js、main.js——但课程沿用 Express 文档的同名）。代码骨架：引入 express 并调用它初始化 **app** 变量（这就是我们的服务器）；一行 **app.get(\"/\", ...)** 是一个**路由（route）**（马上回来细说）；最后 **app.listen(PORT, callback)** 让服务器在指定端口监听进来的请求——经由 **localhost**（基本就是你计算机的本地连接）。端口 3000 是默认选择，任何未占用端口都行（对比：Vite 开发服务器默认 5173）。终端跑 node app.js，一切正常会打印「My first Express app - listening on port 3000!」；出问题（比如端口被占）会抛错。**listen 回调里的 error 判断很重要**——官方注释原话：没有它，任何启动错误都会**静默失败**，而不是给你一条有用的报错。**② 官方 note：端口变量**——上面为演示硬编码了端口。通常端口应来自**环境变量**、带一个兜底值以防变量不存在：const PORT = process.env.PORT || 3000;（上一课学的正是这个）。好处：端口被占时改环境变量即可、不必改源码；有些托管服务会配置自己的端口、和硬编码值不同。**③ 一个请求的旅程**：服务器跑在 3000 端口后，浏览器导航到 http://localhost:3000/（末尾斜杠忘了写浏览器会悄悄补上）——这个动作等于告诉浏览器：向 localhost 3000 端口上监听的服务器（我们的 Express！）的 **/ 路径发一个 GET 请求**，并把收到的响应展示在窗口里。**你平时导航到任何网址本质上都是在做这件事**：地址栏输入 theodinproject.com/paths，就是让浏览器向该站的 /paths 发 GET 请求再展示响应。回到例子：你会看到「Hello, world!」。魔法吗？来看机制：服务器收到 GET 请求时，**Express 把请求存进一个 request 对象**；这个请求被**穿过一条我们称为「中间件函数」（middleware functions）的链**，直到某个中间件函数告诉 Express 对请求做出响应。例子里的请求匹配了我们 app.js 里的路由：app.get(\"/\", ...) 的意思是「**如果有一个 GET 请求来到 / 路径，把它交给下面这条中间件函数链**」——这里链上只有一个函数。如果定义了多个路由，Express 会把请求交给**第一个匹配请求的 HTTP 动词（如 GET）与路径（如 /）的路由**。**路由的顺序很重要！**Express 把请求对象传进回调第一个参数（惯例名 **req**）、response 对象传进第二个参数（**res**）；我们的回调让 response 对象用 **res.send** 发送字符串「Hello, world!」完成响应。函数返回、没有更多代码可跑；由于已被告知响应，Express **结束请求-响应循环**。浏览器收到响应、显示在屏幕上。响应里几乎什么都能发——甚至可以让 Express **发送一个文件**（res.sendFile）。**④ 文件改动自动重启**：node app.js 跑着时，改任何 JS/JSON 文件都**不会自动生效**——得手动中断重跑。免掉这层手工：**Node 的 watch 模式**加 **--watch** 旗标（node --watch app.js）——Node 会监视 app.js **及它最终依赖的所有文件**，检测到变化就自动重启服务器，就像 Webpack 与 Vite 的开发服务器。野外也常见 **Nodemon**（高度可配置的同类包）——Node 并非一直有稳定的内置 watch 模式，所以 Nodemon 到处都能见到。**官方推荐：就用 Node 内置的 --watch**，这是最简单的方法。**Assignment 两条**：① 花几分钟探索 **Express 文档**找感觉——后面很多课会大量引用它；② 回到你的 **Basic Informational Site 项目**，装上 Express、**用它重写整个项目**——几个 app.get() 应该就能搞定大部分。",
      "understand": [
        "Express 是**后端框架**：替我们处理纯 Node 写服务器的啰嗦细节——上一课项目的痛点正是它的卖点",
        "性格设定：**刻意精简、不持立场（barebones & unopinionated）**——灵活但要求你自己做选择；课程路线：MVC 全栈应用 + REST API",
        "最小骨架三件套：**npm init -y → npm install express → app.js**（require express 并调用得到 app；app.get 定义路由；app.listen 监听端口）",
        "**listen 回调里必须判断 error**——否则启动错误静默失败（官方注释原话：This is important!）",
        "端口惯例：**process.env.PORT || 3000**——环境变量优先、硬编码兜底（上一课的直接应用；托管服务常自带端口）",
        "请求的旅程：浏览器导航 = 发 GET 请求 + 展示响应；Express 把请求存进 **req 对象**、穿过**中间件函数链**、直到某个中间件用 **res** 响应并结束循环",
        "多路由时**第一个匹配动词与路径的路由**接住请求——**路由顺序很重要**",
        "自动重启用 **node --watch**（官方推荐，内置）；Nodemon 是历史悠久的同类包，野外常见"
      ],
      "terms": [
        {
          "en": "Express",
          "zh": "本课程使用的 Node 后端框架——刻意精简、不持立场；处理路由、请求、响应的实现细节，可按需扩展"
        },
        {
          "en": "Unopinionated",
          "zh": "不持立场：框架不强加「唯一正确做法」——灵活性大，代价是在多个可行选项间做决定有时棘手"
        },
        {
          "en": "app / route",
          "zh": "app 是调用 express() 得到的服务器实例；route（路由）是「动词 + 路径 → 中间件链」的匹配规则，如 app.get(\"/\", handler)"
        },
        {
          "en": "Request object (req)",
          "zh": "请求对象：Express 把进来的 HTTP 请求装进的对象——回调第一个参数，惯例名 req"
        },
        {
          "en": "Response object (res)",
          "zh": "响应对象：用来构造并发回响应的对象——回调第二个参数；res.send 发内容、res.sendFile 发文件"
        },
        {
          "en": "Middleware function",
          "zh": "中间件函数：请求到达最终处理器之前穿过的链条成员——下一课 Controllers 的主角，本课先见其形"
        },
        {
          "en": "localhost",
          "zh": "本地主机：基本就是计算机自己的本地连接——开发时浏览器与服务器同机对话的地址"
        },
        {
          "en": "watch mode (--watch)",
          "zh": "Node 内置的监视模式：监视入口文件及其依赖，改动即自动重启——官方推荐的开发姿势；Nodemon 是同类第三方包"
        }
      ],
      "tasks": [
        "花几分钟探索 Express 官方文档（API 页）找感觉——课程后面会大量引用它（链接在资料区）",
        "回到你在「NodeJS 入门」章做的 Basic Informational Site 项目：安装 Express 并用它重写整个项目——大部分工作应该只用几个 app.get() 就能完成（回指本课项目）"
      ],
      "quiz": [
        {
          "question": "官方怎么描述 Express 的性格？这个性格的利与弊各是什么？",
          "answer": "刻意精简（barebones）、不持立场（unopinionated）。利：允许按自己想要的方式做事、只装需要的功能，灵活性极大；弊：面对多个可行选项时，做决定有时会有点棘手——没有框架替你拍板。"
        },
        {
          "question": "app.listen(PORT, callback) 的回调里为什么要判断 error？不判断会怎样？",
          "answer": "官方注释原话：This is important!——没有这个判断，任何启动错误（比如端口被占用）都会静默失败，而不是给你一条有用的报错信息。你会以为服务器起来了，其实什么都没发生。"
        },
        {
          "question": "描述一个 GET / 请求在 Express 应用里的完整旅程（从浏览器导航到屏幕显示）。",
          "answer": "浏览器导航 = 向监听端口的服务器的 / 路径发 GET 请求并准备展示响应。服务器收到后：Express 把请求存进 request 对象；请求穿过中间件函数链；链上的路由匹配（动词 GET + 路径 /）后进入回调，req/res 分别作为第一、二参数传入；回调用 res.send 发送内容；Express 结束请求-响应循环；浏览器收到响应并显示。"
        },
        {
          "question": "应用定义了多个路由时，Express 按什么规则决定谁接住请求？这带来什么纪律？",
          "answer": "第一个匹配请求的 HTTP 动词与路径的路由接住请求。纪律：路由顺序很重要——宽泛的匹配写在前面会吃掉本该属于后面精确路由的请求（Routes 一课的 order matters 警告会专门演示这一点）。"
        },
        {
          "question": "文件改动后自动重启服务器，官方推荐什么方案？Nodemon 又是什么地位？",
          "answer": "官方推荐 Node 内置的 watch 模式：node --watch app.js——监视入口文件及其最终依赖，改动即自动重启。Nodemon 是高度可配置的第三方同类包；因为 Node 并非一直有稳定内置 watch 模式，野外仍常见 Nodemon，但本课程用内置的就够了（最简单）。"
        }
      ],
      "optional": [],
      "note": "本课代码骨架里的端口硬编码是演示写法——官方 note 立刻给出了生产惯例 process.env.PORT || 3000，正是上一课环境变量的直接应用，两课要连着理解。文档链接指向 Express 5.x API（/en/5x/）：Express 5 已是现役版本，Routes 一课的通配符语法等处会再次体现版本事实。Assignment 第 2 条重写 Basic Informational Site 是全章的「对照实验」：保留纯 Node 版再写 Express 版，代码量的落差就是框架价值的直接证据。",
      "why": "上一章末尾你手写了路由分发与 404 兜底——能跑，但每条路径都是 if 分支、每个响应都是手工 writeHead。这一课官方替你说了实话：这个过程「相当啰嗦繁琐」。Express 接手的就是这层体力活：一行 app.get 顶一段分支判断，req/res 对象顶手工解析与拼装。更重要的是本课埋下的两个词——「中间件函数链」与「路由顺序」——它们是整章的骨架：Routes 一课展开路由，Controllers 一课展开中间件，之后每一课都在这张骨架上挂肉。",
      "sections": [
        {
          "h": "为什么需要 Express：啰嗦的纯 Node 与「不持立场」的框架",
          "p": [
            "上一节你让 Node 跑了起来：读写服务器上的文件、服务一个多页网站。**你可能已经发现这个过程有点啰嗦和繁琐**，甚至 wondered 更复杂的用例到底要怎么管。",
            "本课程将使用一个名叫 **Express** 的后端框架，它**替我们处理许多实现细节**。",
            "Express 的性格：**刻意精简（barebones）、不持立场（unopinionated）**——允许我们按自己想要的方式做很多事、只用需要的功能扩展它。灵活性极大，代价是**在多个可行选项之间做决定有时会有点棘手**。",
            "课程路线预告：深入 Express 的各种用法——用 **MVC 模式**建全栈应用，以及建 **REST API**（就像你在天气应用、React 购物车里用过的那些）。要吸收的很多，**慢慢来**，别怕去 TOP Discord 求助。"
          ]
        },
        {
          "h": "搭建一个最小 Express 应用",
          "p": [
            "新目录里先 **npm init -y** 创建 package.json，再 **npm install express** 安装依赖。",
            "创建 **app.js** 作为服务器起点（叫 index.js、main.js 都行，课程沿用 Express 文档的同名）。骨架三步：**引入 express 并调用它**初始化 app 变量——这就是我们的服务器；一行 **app.get(\"/\", (req, res) => res.send(\"Hello, world!\"))** 是一个**路由**（下节细说）；**app.listen(PORT, callback)** 让服务器在指定端口监听进来的请求——经由 **localhost**（基本就是计算机的本地连接）。",
            "端口 3000 是默认选择，**任何未占用的端口都行**（对比：Vite 开发服务器默认用 5173）。终端跑 **node app.js**：一切正常会打印「My first Express app - listening on port 3000!」；出了问题（比如端口已被占用）会抛错。",
            "**listen 回调里的 error 判断很重要**——官方注释原话：没有它，任何启动错误都会**静默失败**，而不是给你一条有用的报错信息（示例代码见本页「代码示例」区）。"
          ]
        },
        {
          "h": "官方 note：端口应该来自环境变量",
          "p": [
            "上面为演示**硬编码**了端口。通常端口号应来自**环境变量**、带一个兜底值以防变量不存在：**const PORT = process.env.PORT || 3000;**",
            "两个理由：指定端口被占用时，**改环境变量的值即可**、不必动源码；有些**托管服务会配置自己的端口**，可能和你硬编码的值不同——上一课的环境变量在这里立刻上岗。"
          ]
        },
        {
          "h": "一个请求的旅程：req、中间件链、res",
          "p": [
            "浏览器导航到 **http://localhost:3000/**（末尾斜杠忘了写，浏览器会悄悄补上）——这个动作告诉浏览器：向 localhost 3000 端口上监听的服务器（我们的 Express！）的 **/ 路径发一个 GET 请求**，并把收到的响应展示在窗口里。**你平时导航到任何网址本质上都是在做这件事**——地址栏输入 theodinproject.com/paths，就是让浏览器向该站 /paths 路径发 GET 请求、再展示收到的东西。",
            "机制拆解：服务器收到 GET 请求时，**Express 把请求存进一个 request 对象**；请求被**穿过一条我们称为「中间件函数」的链**，直到某个中间件函数告诉 Express 对请求做出响应。",
            "我们的路由 **app.get(\"/\", ...)** 的含义：「如果有一个 **GET** 请求来到 **/** 路径，把它交给下面这条中间件函数链」——这里链上只有一个函数。**如果定义了多个路由，Express 把请求交给第一个匹配请求的 HTTP 动词（如 GET）与路径（如 /）的路由。路由的顺序很重要！**",
            "Express 把请求对象传进回调**第一个参数**（惯例名 **req**）、**response 对象**传进**第二个参数**（**res**）。我们的回调让 response 对象通过 **res.send** 发送字符串完成响应；函数返回、没有更多代码；由于 Express 已被告知响应请求，它**结束请求-响应循环**；浏览器收到响应、显示在屏幕上。",
            "响应里几乎什么都能发——甚至可以让 Express **发送一个文件**（res.sendFile，文档有专页）。"
          ]
        },
        {
          "h": "文件改动自动重启：--watch 与 Nodemon",
          "p": [
            "用 node app.js 跑服务器时，项目里任何 JavaScript 与 JSON 文件的改动都**不会自动生效**——除非手动中断再重跑。",
            "免掉手工：**Node 的 watch 模式**——加 **--watch** 旗标（node --watch app.js）。Node 会监视 app.js **以及它最终依赖的所有文件**，检测到变化就自动重启服务器，就像 Webpack 和 Vite 的开发服务器。",
            "你可能还会遇到 **Nodemon**：一个高度可配置的同类包。Node 并非一直有稳定的内置 watch 模式，所以 Nodemon 在野外到处可见。**官方推荐：就用 Node 内置的 --watch**——这是目前最简单的方法。"
          ]
        },
        {
          "h": "Assignment：摸文档 + 重写旧项目",
          "p": [
            "① 花几分钟**探索 Express 文档**找感觉——接下来的课会大量引用文档内容（资料区有链接）。",
            "② 回到你的 **Basic Informational Site 项目**：安装 Express，**用它重写这个项目**！大部分工作应该只用几个 **app.get()** 就能完成（回指上一课的项目）。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "const express = require(\"express\");\nconst app = express();\n\napp.get(\"/\", (req, res) => res.send(\"Hello, world!\"));\n\nconst PORT = 3000;\napp.listen(PORT, (error) => {\n  // This is important!\n  // Without this, any startup errors will silently fail\n  // instead of giving you a helpful error message.\n  if (error) {\n    throw error;\n  }\n  console.log(`My first Express app - listening on port ${PORT}!`);\n});",
          "note": "官方最小 Express 应用：require 后调用 express() 得到 app（服务器本体）；app.get 定义「GET / → 发送 Hello, world!」的路由；app.listen 监听端口。回调里的 error 判断是官方点名的重要细节——没有它启动错误会静默失败。"
        },
        {
          "lang": "javascript",
          "code": "const PORT = process.env.PORT || 3000;",
          "note": "官方 note 的生产惯例：端口来自环境变量、3000 兜底——环境变量不存在（未设置）时用兜底值。端口被占改环境变量即可，托管服务自带端口也不怕。这正是上一课「环境变量」的直接应用。"
        }
      ],
      "pitfalls": [
        {
          "title": "listen 回调不判断 error，启动失败无声无息",
          "text": "官方在示例代码里专门放了三行注释强调 This is important!——没有 error 判断，端口被占这类启动错误会静默失败：终端不报错、浏览器连不上，你会对着一个根本没起来的服务器排查半天。把 if (error) throw error 当成 listen 回调的固定姿势。"
        },
        {
          "title": "以为改了代码服务器会自动生效",
          "text": "node app.js 跑的服务器不会热更新——任何 JS/JSON 改动都要重启才生效。忘了这一点就会盯着旧行为 debug 新代码。开发时固定用 node --watch app.js（官方推荐的内置方案），Nodemon 是野外的同类替代。"
        },
        {
          "title": "把 res.send 之后的代码当成「不会执行」",
          "text": "响应方法结束的是请求-响应循环，不是函数执行——send 后面的语句照样跑（再 send 一次还会报错）。这个坑 Controllers 一课会正式展开，先在这里立个牌子：发了响应就 return。"
        }
      ],
      "official": {
        "assignment": [
          "花几分钟探索 Express 文档，找一找感觉——接下来的课会大量引用文档内容",
          "回到你的 Basic Informational Site 项目：安装 Express 并用它重写这个项目！大部分应该只用几个 app.get() 就能完成"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/express/introduction_to_express.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "2c228cbd7cb6c798720c90501f768f33126f0c7565730e348b8d54c50f3cee10",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "nodejs-routes",
      "title": "Routes",
      "zh": "路由",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/nodejs-routes",
      "summary": "真实应用要处理很多种请求——路由（routes）干的就是匹配这件事：把一个请求的 HTTP 动词（GET/POST…）与 URL 路径，对上该处理它的那组中间件函数（控制器）。本课四块：① 路由解剖——app.get(\"/\"…) 匹配「经过 app 路由器、去 / 路径的 GET 请求」；每个动词有自己的路由方法，app.all() 匹配全部动词；现阶段主力是 GET（取数据）与 POST（送数据），REST API 时再遇 PUT/DELETE。② 路径——字符串或正则；精确匹配之外，Express 5 的字符串路径支持 {} 可选段（\"/message{s}\" 同时匹配 /message 与 /messages）与通配符 splat：{*splat} 匹配任意数量任意字符（必须带名字），常见用途是自定义 404 的全兜底；官方红色警告：顺序很重要——兜底路由写在前面，后面的精确路由永远轮不到。③ 路由参数与查询参数——路径段以 : 开头即路由参数（:username），Express 自动把值装进 req.params；URL 问号后的 key=value 对是查询参数（不算路径的一部分，更像传给路径的实参），自动装进 req.query，同名键重复时值为数组（YouTube 的 ?v=…&t=… 就是查询参数）。④ Routers——真实应用的路由该按组拆文件：Router() 创建子路由器，app.use(\"/authors\", authorRouter) 挂载后，子路由的路径是父路径的延伸（/authors/:authorId），组内可写只影响本组的中间件；测试路由用 Postman（浏览器地址栏发不了 POST）。",
      "guide": "以下是官方原课的中文化梳理。**路由是什么**：上一课拆解了基本 Express 应用与一个请求的旅程；真实应用要处理**很多不同类型的请求**。路由本质上就是**把请求的 HTTP 动词（如 GET 或 POST）与 URL 路径，匹配到恰当的那组中间件函数——控制器**（controllers 与 middleware 下一课细讲）。**① 路由的解剖**：app.get(\"/\", ...) 告诉我们：这条路由匹配**任何经过 app 路由器（就是我们的整个服务器！）、去往 / 路径的 GET 请求**。换成 app.post(\"/messages\", ...)，则匹配去 /messages 路径的 **POST** 请求——你发 GET 到 /messages 是匹配不上它的。**每个 HTTP 动词有自己的 Express 路由方法**；也可以用 **app.all()** 让一条路由匹配全部动词。官方 note：HTTP 动词有很多，现阶段主要用 **GET**（只从服务器取数据）与 **POST**（向服务器送数据，如表单）；后面讲 REST API 还会常见 **PUT 与 DELETE**。**② 路径**：路由第一个参数是要匹配的路径，**可以是字符串或正则表达式**。/messages 精确匹配；/messages/all 只在路径恰好是它时匹配（/messages 与 /messages/new 都不行）。**字符串路径可以用 {} 让字符可选**：\"/message{s}\" 同时匹配 /message 与 /messages；\"/{messages}\" 同时匹配 / 与 /messages；\"/foo{/bar}/baz\" 同时匹配 /foo/baz 与 /foo/bar/baz。**通配符 \\*（splat）匹配任意数量的任意字符**——Express 5 纪律：**路径里的 splat 必须跟一个名字**。splat 的常见用途：**全兜底**——匹配所有否则匹配不上的路径，比如自定义 404 错误处理：\"/{*splat}\" 能匹配 /、/odin 也能匹配 /sdds8fjsdifhj98sdfh。**官方警告（warning note）：顺序很重要！**路由按**定义顺序**设置。把 /{*splat} 兜底写在前面，它会先匹配一切——后面的 GET /messages 路由永远不可达；要让 /messages 先被匹配，就得把定义顺序反过来。**③ 路由参数**：想给任何用户名做路由（/odin/messages、/thor/messages、/theodinproject79687378/messages）？就像 React Router 一样用**路由参数**：路径段以 **冒号 :** 开头、后跟参数名（只能由大小写敏感的字母数字或下划线组成），一条路径可以带任意多个参数。**Express 自动把路径传进参数的值装进 req.params 对象**（键 = 参数名）：GET /odin/messages 时 req.params 是 { username: \"odin\" }；/:username/messages/:messageId 可以带两个参数。**④ 查询参数**：URL 末尾 **?** 之后的部分是**查询参数**——每个都是 key=value 对、用 & 分隔。特别之处：**它们不算路径本身的一部分**，更像**传给给定路径的实参**。/odin/messages?sort=date&direction=ascending 依然匹配 /:username/messages 路由，但中间件链里能拿到 sort=date 与 direction=ascending。**Express 自动解析查询参数装进 req.query**；**同名键重复出现时，Express 把该键的全部值放进一个数组**（?sort=date&sort=likes → sort: [\"date\", \"likes\"]）。你早就见过它：YouTube 每支视频有个代码，观看就是去 /watch 路径、用 **v** 键把代码作为查询参数传入；还能用 **t** 键指定起始秒数——?v=xm3YgoEiEDc&t=424s 就是「从 424 秒开始看这支视频」。**⑤ Routers（路由器分组）**：目前所有路由都挂在 app（服务器本身）上；真实应用路由很多，我们会想**把路由分成组、每组抽到自己的文件里**——还能更容易写「只影响这个文件里的路由」的东西。官方例子：一个图书馆应用要处理书籍页面与作者页面，外加首页与 about/contact 等杂项——GET / 与 /about 与 /contact（含 POST）、GET /books 与 /books/:bookId 与 /books/:bookId/reserve（含 POST）、GET /authors 与 /authors/:authorId。做法：新建 routes 文件夹，每个组一个路由器文件。**routes/authorRouter.js**：从 express 解构出 **Router** 函数，const authorRouter = Router()；在路由器上用同样的 .get/.post 方法写路由——**这些路由与中间件的作用域只限本路由器**。因为挂载后它只服务以 /authors 开头的路径，**文件里的路径不需要再带 /authors 前缀**——它们是**父路径的延伸**（否则会变成 /authors/authors/:authorId）。照做 bookRouter 与 indexRouter（中间件不必做多少事，各路由发点独特的东西、知道谁被匹配即可）。**app.js 里挂载**：app.use(\"/authors\", authorRouter); app.use(\"/books\", bookRouter); app.use(\"/\", indexRouter);——以 /authors 开头的请求进 authorRouter 匹配；/books 开头的跳过作者路由、进 bookRouter；两者都不匹配的走 indexRouter。**测试**：用 **Postman** 发 GET 与 POST 请求——浏览器地址栏发不了 POST。**Assignment 一条**：通读 Express 官方的 **Routing 入门指南**复习本课主题；具体方法的细节记得查 **Express 文档**。补充资料：一支全面讲解 Express 路由的视频。",
      "understand": [
        "路由 = **动词 + 路径 → 中间件链**的匹配规则；每个动词有自己的方法，app.all() 匹配全部动词",
        "现阶段动词分工：**GET 取数据 / POST 送数据**（表单）；REST API 章再遇 PUT 与 DELETE",
        "字符串路径精确匹配之外：**{} 可选段**（\"/message{s}\"）与 **splat 通配 {*名字}**（Express 5：必须带名）——splat 的经典用途是自定义 404 全兜底",
        "**顺序很重要**：路由按定义顺序匹配——兜底写在前面，精确路由永远不可达",
        "**路由参数** :name → **req.params**（路径的一部分，可多个）；**查询参数** ?k=v&k2=v2 → **req.query**（不算路径、像实参；同名键重复值为数组）",
        "**Router() 分组**：路由按业务拆文件；app.use(\"/authors\", authorRouter) 挂载后子路由路径是**父路径的延伸**；Postman 用来发浏览器发不了的 POST"
      ],
      "terms": [
        {
          "en": "Route",
          "zh": "路由：把请求的 HTTP 动词与 URL 路径匹配到处理它的中间件函数组（控制器）的规则"
        },
        {
          "en": "HTTP verb",
          "zh": "HTTP 动词：请求的动作类型——现阶段主力 GET（取数据）与 POST（送数据），REST API 再遇 PUT / DELETE；app.all() 匹配全部"
        },
        {
          "en": "Splat / wildcard",
          "zh": "通配符：匹配任意数量任意字符的路径段——Express 5 里必须带名字（{*splat}）；经典用途是自定义 404 的全兜底"
        },
        {
          "en": "Route parameter",
          "zh": "路由参数：路径段以 : 开头的占位符（/:username/messages）——值由 Express 自动装进 req.params，键为参数名"
        },
        {
          "en": "Query parameter",
          "zh": "查询参数：URL 问号后的 key=value 对（& 分隔）——不属于路径本身、像传给路径的实参；自动装进 req.query，同名键重复时值为数组"
        },
        {
          "en": "Router",
          "zh": "路由器：express.Router() 创建的子路由容器——路由按组拆文件的工具；挂载后其路径是父路径的延伸，中间件作用域限于组内"
        },
        {
          "en": "Postman",
          "zh": "API 测试工具：让你不经浏览器发送 GET/POST 等请求——浏览器地址栏只能发 GET，测试 POST 路由必备"
        }
      ],
      "tasks": [
        "通读 Express 官方的 Routing 入门指南，复习本课全部主题；具体方法的细节记得随时查 Express API 文档（链接在资料区）"
      ],
      "quiz": [
        {
          "question": "一条路由匹配请求的两个维度是什么？GET /messages 能匹配 app.post(\"/messages\", …) 吗？",
          "answer": "HTTP 动词 + URL 路径，两者都匹配才算命中。不能——app.post(\"/messages\") 只匹配去 /messages 的 POST 请求；GET 请求动词不符，直接落空（每个动词有自己的路由方法；想全收要 app.all()）。"
        },
        {
          "question": "\"/message{s}\"、\"/{*splat}\" 各匹配什么？Express 5 对 splat 的硬性规定是什么？",
          "answer": "\"/message{s}\" 用花括号让字符可选：同时匹配 /message 与 /messages。\"/{*splat}\" 是通配符：匹配任意数量任意字符（/、/odin、/sdds8fjsdifhj98sdfh 全中），经典用途是自定义 404 全兜底。硬性规定：Express 路径里的 splat 必须跟一个名字。"
        },
        {
          "question": "为什么「顺序很重要」？把兜底路由 /{*splat} 写在 GET /messages 前面会发生什么？",
          "answer": "路由按定义顺序设置与匹配，第一个命中的接住请求。兜底写在前面会先匹配一切——GET /messages 路由永远不可达（官方 warning note 的原话：这条路由不会被到达，因为前一条路径先匹配了）。修法：把精确路由定义在兜底之前。"
        },
        {
          "question": "req.params 与 req.query 各装什么？GET /odin/messages?sort=date&sort=likes 时两者的值是什么？",
          "answer": "req.params 装路由参数（路径的一部分）：{ username: \"odin\" }。req.query 装查询参数（? 后的 key=value，不算路径）：sort 键重复出现，Express 把全部值放进数组——{ sort: [\"date\", \"likes\"] }。"
        },
        {
          "question": "Router 分组后，authorRouter.js 里的路由为什么写 \"/:authorId\" 而不是 \"/authors/:authorId\"？",
          "answer": "因为挂载语句 app.use(\"/authors\", authorRouter) 已经把 /authors 前缀交给了父级：路由器内的路径是父路径的延伸。若再写全路径，实际匹配会变成 /authors/authors/:authorId——官方专门点名这个双重前缀陷阱。"
        }
      ],
      "optional": [],
      "note": "本课语法以 Express 5 为准（官方文档链接即 /en/5x/）：splat 必须带名字（{*splat}）、{} 可选段，都是 Express 5 时代的路径语法——你在旧教程里看到的无名通配 * 或正则式写法可能已不适用。「路由参数像 React Router」是官方的类比：World 5 学过的 :id 占位与本课 req.params 是同一个思想在前后端的两次落地。",
      "why": "上一课你已经见过一条路由（app.get(\"/\", …)），本课把「一条」变成「一套体系」：动词与路径怎么匹配、动态段怎么取值、几十条路由怎么按业务分文件。这是 Express 章的地基课——Controllers 一课的中间件链就挂在这些路由上，之后留言板、库存应用的每个功能都是一条条路由长出来的。查询参数与路由参数的区分尤其值得现在记牢：搜索、分页、筛选，后面全靠在 req.query 与 req.params 之间选对工具。",
      "sections": [
        {
          "h": "路由是什么：动词 + 路径的匹配游戏",
          "p": [
            "上一课我们拆解了一个基本 Express 应用与一个请求穿过它的旅程。但真实应用里，我们要处理**很多不同类型、为了不同事情的请求**。",
            "路由本质上就是**把请求的 HTTP 动词（如 GET 或 POST）与 URL 路径，匹配到恰当的那组中间件函数——控制器**。controllers 与 middleware 下一课细讲；本课先 dive 进路由的用法。"
          ]
        },
        {
          "h": "路由的解剖：每个动词一个方法",
          "p": [
            "回到上一课唯一的路由：**app.get(\"/\", ...)** 告诉我们：这条路由匹配**任何经过 app 路由器（就是我们的整个服务器！）、去往 / 路径的 GET 请求**。",
            "换成 **app.post(\"/messages\", ...)**：匹配去 app 的 /messages 路径的任何 **POST** 请求——发 GET 到 /messages **不会**匹配这条路由。",
            "**每个 HTTP 动词有自己的 Express 路由方法**；也可以用 **app.all()** 让路由匹配所有动词。",
            "官方 note（HTTP 动词）：动词有很多种，现阶段我们主要用 **GET**（只用于从服务器取回数据）与 **POST**（向服务器送数据，比如表单）；后面覆盖 REST API 时，还常会遇到 **PUT 与 DELETE**。"
          ]
        },
        {
          "h": "路径：精确、可选段与 splat 兜底",
          "p": [
            "路由的第一个参数是要匹配的路径——**字符串或正则表达式**都行。/messages 精确匹配它自己；/messages/all 只在路径恰好是 /messages/all 时匹配（/messages 与 /messages/new 都不行）。",
            "字符串路径可以用 **{} 让字符可选**：**\"/message{s}\"** 同时匹配 /message 与 /messages；**\"/{messages}\"** 同时匹配 / 与 /messages；**\"/foo{/bar}/baz\"** 同时匹配 /foo/baz 与 /foo/bar/baz。",
            "**\\*（「splat」或通配符）匹配任意数量的任意字符**——Express 5 纪律：**路径里的 splat 必须总是跟一个名字**。splat 的常见用途：**全兜底**——接住所有否则匹配不上的路径，例如自定义 404 错误处理：**\"/{*splat}\"** 匹配 / 与 /odin，也匹配 /sdds8fjsdifhj98sdfh。"
          ]
        },
        {
          "h": "官方警告：顺序很重要！",
          "p": [
            "你的路由**按定义顺序**设置在服务器里。",
            "反例（官方 warning note 原样场景）：把 **/{*splat}** 兜底路由定义在前、GET /messages 定义在后——/messages 的处理函数里官方直接写了结论：**「这条路由不会被到达，因为前一条路由的路径先匹配」**。",
            "要让 GET /messages 命中自己的路由，就得**把定义顺序反过来**：精确路由在前，兜底在后——请求会先匹配 /messages，轮不到 splat。"
          ]
        },
        {
          "h": "路由参数：路径里的动态段",
          "p": [
            "想给**任何用户名**做一条消息路由——/odin/messages、/thor/messages、甚至 /theodinproject79687378/messages？**就像 React Router 一样，用路由参数**；一条路径想带几个参数就带几个。",
            "写法：**路径段以冒号 : 开头**、后跟参数名（参数名只能由**大小写敏感的字母数字或下划线**组成）。不管参数叫什么，**Express 会自动把路径传进该参数的值装进 req.params 对象**（键就是参数名），后面的中间件函数都能用。",
            "例：app.get(\"/:username/messages\", ...) 收到 GET /odin/messages 时 req.params 是 **{ username: \"odin\" }**；收到 /theodinproject79687378/messages 时是 { username: \"theodinproject79687378\" }。两段参数也行：/:username/messages/:messageId 收到 /odin/messages/79687378 时得到 **{ username: \"odin\", messageId: \"79687378\" }**。这样就能轻松从请求路径里提取值、供中间件链使用。"
          ]
        },
        {
          "h": "查询参数：URL 问号后的「实参」",
          "p": [
            "**查询参数**是 URL 末尾**独特而可选**的部分：**?** 标记开始，每个查询是 **key=value** 对、用 **&** 分隔。它们的特别之处：**不算路径本身的一部分**——本质上更像**传给给定路径的实参**。",
            "例：**/odin/messages?sort=date&direction=ascending** 依然匹配 /:username/messages 路由，但中间件链里能访问 sort=date 与 direction=ascending 两对值。",
            "**Express 自动解析查询参数、装进 req.query 对象**；**同名键重复时，Express 把该键的全部值放进一个数组**：?sort=date&sort=likes&direction=ascending 得到 Query: **{ sort: [\"date\", \"likes\"], direction: \"ascending\" }**。",
            "你早就见过查询参数：YouTube 每支视频有一个代码，观看它就是在导航到 /watch 时**用 v 键把视频代码作为查询参数传入**；还可以用 **t** 键指定从第几秒开始——?v=xm3YgoEiEDc&t=424s 就是「从 424 秒开始播放这支视频」。"
          ]
        },
        {
          "h": "Routers：路由按组拆文件",
          "p": [
            "目前路由不多、而且全挂在 **app**（服务器本身）上。真实应用路由成堆，我们会想**把路由分组、每组抽到自己的文件**——顺带还能更容易写「只影响这个文件里的路由、不影响其他」的逻辑。",
            "官方场景：一个图书馆应用——书籍页面 + 作者页面 + 首页与 about/contact 等杂项。要服务的路由清单：GET / 、GET/POST /contact、GET /about；GET /books、/books/:bookId、/books/:bookId/reserve（含 POST）；GET /authors、/authors/:authorId。",
            "做法：新建 **routes 文件夹**，每组一个文件。**routes/authorRouter.js**：从 express **解构出 Router 函数**，const authorRouter = Router()；在这个路由器上用同样的 **.get / .post** 写路由——意味着可以写**作用域限于本路由器**的路由与中间件（下一课深入）。因为我们将让这个路由器**只服务以 /authors 开头的路径**，文件里的路径**不必再包含前缀**——它们是**父路径的延伸**（我们可不想让路由匹配到 /authors/authors/:authorId）。",
            "照做另外两个路由器（bookRouter、indexRouter）——中间件不必做多少事，各路由发点独特的内容、让你知道谁被匹配就行。**app.js 挂载**：app.use(\"/authors\", authorRouter); app.use(\"/books\", bookRouter); app.use(\"/\", indexRouter);——路径以 /authors 开头的请求进 authorRouter 做路由匹配；以 /books 开头的跳过作者路由、改查 bookRouter；两者都不沾的走 indexRouter。",
            "**测试路由用 Postman**：它让你不经浏览器发送 GET 与 POST 请求——**浏览器地址栏发不了 POST**。"
          ]
        },
        {
          "h": "Assignment 与补充资料",
          "p": [
            "**Assignment 一条**：通读 Express 官方的 **Routing 入门指南**（primer on Routing），总览本课主题；具体方法的更多信息记得查 **Express 文档**（链接在资料区）。",
            "官方补充资料（Additional resources）：一支**全面讲解 Express 路由的视频**（链接在资料区；为英文视频）。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "app.get(\"/\", (req, res) => res.send(\"Hello, world!\"));\n\napp.post(\"/messages\", (req, res) => res.send(\"This is where you can see any messages.\"));",
          "note": "路由解剖：第一条匹配「经过 app、去 / 的 GET」；第二条只匹配去 /messages 的 POST——发 GET 到 /messages 不会命中它。每个动词一个方法；app.all() 可匹配全部动词。"
        },
        {
          "lang": "javascript",
          "code": "// Matches both /message and /messages\n\"/message{s}\"\n\n// Matches both / and /messages\n\"/{messages}\"\n\n// Matches both /foo/baz and /foo/bar/baz\n\"/foo{/bar}/baz\"\n\n// Matches / and /odin as well as /sdds8fjsdifhj98sdfh\n\"/{*splat}\"",
          "note": "字符串路径的两种扩展：{} 让段内字符可选；{*名字} 是通配（splat）——匹配任意数量任意字符，Express 5 要求必须带名字。splat 的经典用途：自定义 404 的全兜底（记得放在所有路由之后——顺序很重要）。"
        },
        {
          "lang": "javascript",
          "code": "/**\n * GET /odin/messages will have this log\n * { username: \"odin\" }\n *\n * GET /theodinproject79687378/messages would instead log\n * { username: \"theodinproject79687378\" }\n */\napp.get(\"/:username/messages\", (req, res) => {\n  console.log(req.params);\n  res.end();\n});\n\n/**\n * GET /odin/messages/79687378 will have this log\n * { username: \"odin\", messageId: \"79687378\" }\n */\napp.get(\"/:username/messages/:messageId\", (req, res) => {\n  console.log(req.params);\n  res.end();\n});",
          "note": "路由参数：路径段以 : 开头，Express 自动把实际值装进 req.params（键 = 参数名）。一条路径可以带多个参数——/:username/messages/:messageId 一次拿到两个。"
        },
        {
          "lang": "javascript",
          "code": "/**\n * GET /odin/messages?sort=date&direction=ascending will log\n * Params: { username: \"odin\" }\n * Query: { sort: \"date\", direction: \"ascending\" }\n *\n * GET /odin/messages?sort=date&sort=likes&direction=ascending will log\n * Params: { username: \"odin\" }\n * Query: { sort: [\"date\", \"likes\"], direction: \"ascending\" }\n */\napp.get(\"/:username/messages\", (req, res) => {\n  console.log(\"Params:\", req.params);\n  console.log(\"Query:\", req.query);\n  res.end();\n});",
          "note": "查询参数与路由参数同框对比：?sort=date&direction=ascending 装进 req.query；同名键重复（sort 出现两次）时值为数组。两个对象互不干扰——params 是路径的一部分，query 是路径外的「实参」。"
        },
        {
          "lang": "javascript",
          "code": "// routes/authorRouter.js\nconst { Router } = require(\"express\");\n\nconst authorRouter = Router();\n\nauthorRouter.get(\"/\", (req, res) => res.send(\"All authors\"));\nauthorRouter.get(\"/:authorId\", (req, res) => {\n  const { authorId } = req.params;\n  res.send(`Author ID: ${authorId}`);\n});\n\nmodule.exports = authorRouter;",
          "note": "子路由器：Router() 创建容器，路由与中间件作用域限于组内。路径不带 /authors 前缀——挂载时 app.use(\"/authors\", authorRouter) 会让它们成为父路径的延伸（写全前缀会变成 /authors/authors/:authorId）。"
        }
      ],
      "pitfalls": [
        {
          "title": "兜底路由写在精确路由前面",
          "text": "官方 warning note 专门演示的事故：/{*splat} 定义在前会先匹配一切，后面的 GET /messages 永远不可达。路由按定义顺序匹配——精确在前、兜底在后，是每条路由文件都要遵守的排序纪律。"
        },
        {
          "title": "子路由器里重复写挂载前缀",
          "text": "app.use(\"/authors\", authorRouter) 之后，authorRouter 里的 \"/\" 就是 /authors、\"/:authorId\" 就是 /authors/:authorId。在子路由器里再写 \"/authors/:authorId\"，实际路径会变成 /authors/authors/:authorId——官方点名「我们可不想这样」。"
        },
        {
          "title": "分不清 params 与 query，拿错对象",
          "text": "/odin/messages?sort=date 里，odin 在 req.params（路径段），sort 在 req.query（问号后）——查询参数不算路径的一部分。在 req.params 里找 sort 只会拿到 undefined；搜索、分页、排序类输入全走 query，资源定位类输入走 params。"
        },
        {
          "title": "在浏览器地址栏里测 POST 路由",
          "text": "地址栏导航只会发 GET——POST 路由永远测不到，看起来就像「路由没生效」。官方指定用 Postman 这类工具发 POST 请求；下一课的表单也会用真正的 <form method=\"POST\"> 触发。"
        }
      ],
      "official": {
        "assignment": [
          "通读 Express 官方的 Routing 入门指南（primer on Routing），总览本课主题；具体方法的细节记得查 Express 文档"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "这支关于 Express Routes 的视频对 Express 路由做了全面讲解"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/express/routing.md（文件名 routing 对 slug nodejs-routes 不同形，经线上课页 edit 链接实证；本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "00c1b484f7a477dd2ace350907a604e30b2adc5e356c31aa7cead850bdd989fd",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "nodejs-controllers",
      "title": "Controllers",
      "zh": "控制器",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/nodejs-controllers",
      "summary": "Express 章知识密度最高的一课（官方原文约 23.5KB）。控制器是「终极中间人」：它知道该问模型什么问题，但让模型去干重活；知道该渲染哪个视图，但让视图自己拼 HTML——它是 MVC 里「聪明地知道该做什么、然后把所有难活派出去」的大脑，本质上就是一个职责明确的函数。四块主干：① 响应方法——res.send（通用，按数据自动设 Content-Type）、res.json（显式 JSON）、res.redirect、res.render（渲染模板，Views 课展开）、res.status（设状态码但不结束循环，可链式）；注意：响应方法只结束请求-响应循环、不结束函数执行——send 之后再 send 会报错。② 中间件—— Express 的核心概念，工作在「进来的请求」与「最终路由处理器」之间；标准三参数 req/res/next（错误处理型是四参数）；能干四件事：改请求或响应对象、执行额外代码（校验、认证）、调用链上下一个中间件、结束请求-响应循环；分应用级（app.use/app.METHOD，匹配每个请求，内置 body parser 与 static）与路由器级（router.use/router.METHOD）；执行顺序 = 定义顺序。③ 控制器与中间件的关系——控制器在 Express 世界里也算中间件（被路由处理器使用），但两者是不同层面的概念：控制器是 MVC 模式的组件，中间件是 Express 的特性；命名惯例 GET→getSomething、POST→createSomething；实战用 mock 数据库 db.js + authorController 走通「取参数→查库→404 分支→成功响应」四步。④ 错误处理——try/catch 手工兜底；Express（v5）自动捕获 async 处理器抛出的错误并调 next(error)；错误处理中间件必须四参数（err, req, res, next，一个都不能少，否则不被识别为错误中间件）且放在所有中间件最后；自定义错误类（扩展 Error、带 statusCode）让错误中间件能回 404 而不是只会 500；next 的四种传参：无参（下一个中间件）、Error（直达错误中间件）、'route'（同路径下一个路由处理器）、'router'（跳出整个路由器）。",
      "guide": "以下是官方原课的中文化梳理。**控制器的角色**：控制器的工作是充当**终极中间人（ultimate middleman）**。它知道想问**模型（model）**哪些问题，但让模型去做解决问题的全部重活；它知道想渲染哪个**视图（view）**发回浏览器，但让视图自己去拼全部 HTML。这就是它叫「控制器」的原因——**聪明到知道该做什么，然后把所有难活委派出去**。归根结底，控制器是整场运作的**大脑**，确保每个组件各尽其职、交付最终结果——它真的只是 **MVC 模式里一个职责明确的函数**。**① 处理响应**：从控制器发响应有好几个方法可用。**res.send**——通用方法，对能发的数据很灵活：它会**按你传的数据自动设置 Content-Type 头**（传对象就 string 化成 JSON 并设 application/json）。**res.json**——更显式的 JSON 响应：总是设 Content-Type 为 application/json 并以 JSON 发送。**res.redirect**——把客户端重定向到另一个 URL。**res.render**——渲染视图模板、把生成的 HTML 作为响应发回（后面的课细讲）。还有手动设状态码的 **res.status**——它设置响应状态码**但自己不结束请求-响应循环**，可以链式接其他方法（res.status(404).send(...) 可以；反过来 res.send(...).status(404) 不行）；想用默认 200 就可以省略。官方 note（res.send 与 res.json 的取舍）：既然 send 会自动设 Content-Type，为什么还要 json？——**res.json 强制 JSON 并自动把非对象值转成 JSON，res.send 不会**；json 内部其实就是调用 send 的便捷方法；send 只把布尔值和对象（含数组）当 JSON 处理。所以发 JSON 时**用名字就叫 json 的方法更合适**——天作之合。**还要当心**：这些响应方法**只结束请求-响应循环、不结束函数执行**——send(\"Hello\") 后面的 console.log 照样跑，再 send(\"Bye\") 则**抛错**（已经发过响应不能再发）。**② 中间件**：中间件函数是 **Express 的核心概念**，在处理请求与响应中扮演关键角色——它们**工作在进来的请求与最终的目标路由处理器之间**。典型中间件函数取**三个参数**（有一个特殊的取四个，后面讲）：**req**（请求对象，代表进来的 HTTP 请求）、**res**（响应对象，代表将发回客户端的 HTTP 响应）、**next**（把控制权传给链中下一个中间件的函数，可选）。官方 note：名字只是惯例，叫 request/response 都行。中间件能干的活：**修改请求或响应对象**（有些包会往 req 上加属性，或设置 res.locals 供 res.render 的模板用）；**执行额外代码**（进主逻辑前的校验中间件、认证中间件等）；**调用链中的下一个中间件**；**结束请求-响应循环**（后面的中间件不再被调用，哪怕链上还有）。Express 生态丰富——认证、CORS、限流、会话、日志、校验等都有现成中间件包。**应用级中间件**：用 **app.use 或 app.METHOD**（app.get、app.post）绑定到 **Express 实例**；匹配指定路径的每个请求都会执行它们；不指定路径时默认为 /（匹配每个请求）；与所有中间件一样，请求-响应循环在到达它之前结束它就不会跑；**通常放在应用代码最顶端**确保总是先跑。Express 自带的常用内置中间件：**body 解析器**（express.json、express.urlencoded——正确解析请求体、装进 req.body）与**静态文件服务**（app.use(express.static('public'))——服务 HTML/CSS/JS/图片，参数指定目录）。**路由器级中间件**：与应用级同理，但用 **router.use 或 router.METHOD** 绑定到 **Express 路由器实例**——只有请求匹配并进入该路由器时才执行。示例中间件：打日志、往 req 加 customProperty、调 next()——注册后，链上排在它后面的中间件都能读到 req.customProperty。**执行顺序纪律**：Express **按定义/注册顺序**执行中间件——顺序决定调用顺序；有些包会改 Request 对象，这类中间件必须放在**应用最顶端**，下面的中间件才能看到它们的修改。**③ 控制器（与中间件的关系）**：如前所说，控制器就是函数；在 Express 世界里它们**也算中间件**（被路由处理器使用）。但两者是**不同层面的概念**：控制器是 **MVC 模式**（一种组织软件的设计思路）的关键组件；中间件是 **Express 的核心特性**（在请求-响应循环的特定节点跑代码、改请求或结束循环）。所以准确说法是：**我们在 Express 里用中间件来实现 MVC 的「Controller」部分**。**控制器何时上场**：请求打到服务器、某条路由匹配了动词与路径；路由按中间件链决定**哪个控制器处理请求**；控制器接管后执行必要动作——从模型取数据、处理数据、按业务逻辑做决定、或用新数据更新模型。完成后把处理好的数据**交给视图**；视图渲染成适合发回客户端的格式（通常是 HTML；讲 API 时也可以是 JSON，像你以前用过的 Giphy API）。**命名惯例**：按挂载的路由来——GET 路由 → getSomething、POST 路由 → createSomething、DELETE 路由 → deleteSomething 等；**没有硬性规则**（Express 不持立场），取决于你或团队的惯例与函数职责。**实战**：接着上一课的应用，给 /authors/:authorId 定义控制器并接上样例数据。先在项目根建 **db.js**（mock「数据库」+ 按 ID 查作者的查询函数——文件名、内容、位置都不重要，能调就行）；再建 **controllers/authorController.js**：从 req.params 取 authorId → await 查库 → 查不到就 res.status(404).send(\"Author not found\") 并 **return**（发响应不会自动停止函数执行，return 防止继续跑其他逻辑）→ 查到就 res.send 作者名。路由文件里引入并挂上：authorRouter.get(\"/:authorId\", getAuthorById)。**④ 处理错误**：健壮的应用必须**优雅地处理错误**——给客户端有意义的错误响应、防止应用意外崩溃；而错误可能发生在 **async 操作**中，前面的代码没处理这种情况。**方案一 try/catch**：把控制器逻辑包进 try/catch，catch 里 console.error + res.status(500).send(\"Internal Server Error\")（或改调 next(error)——但那只会用 Express 默认视图渲染错误页，想要不同的响应就得写特殊的中间件……下面就是）。**方案二 错误处理中间件**：与其每个中间件里都 try/catch，**Express（v5）会自动捕获抛出的错误并调用 next(error)**，把控制权交给一个特殊的「错误中间件函数」。写法：**app.use((err, req, res, next) => {...})** 放在**应用全部代码的最末尾**——确保它是最后执行的中间件、只处理从前面中间件冒泡下来的错误。**关键纪律：这个中间件必须提供四个参数**（哪怕用不到）——**少任何一个，它就不会被识别为错误处理中间件**（可以自己试试😉）；err 必须是第一个参数。**少于四参数**的函数永远被当作请求中间件，哪怕放在最后。**自定义错误**：上面的错误中间件不管什么错都只能回 500——想发 404 怎么办？常见做法是**扩展 Error 建自己的错误类**：errors/CustomNotFoundError.js——class CustomNotFoundError extends Error，构造器里 super(message)、**this.statusCode = 404**、this.name = \"NotFoundError\"（stringify 时更整洁）。控制器里直接 **throw new CustomNotFoundError(\"Author not found\")**——Express 自动捕获 async 处理器抛出的错误并调 next(err)，控制器里不用再手写错误响应。错误中间件相应升级：**res.status(err.statusCode || 500).send(err.message)**——有 statusCode 用它的、没有的大概就是内部错误。这个模式可以按用例继续建更多自定义错误类。**⑤ next 函数到底是什么**：简单说，它**把控制权传给应用请求-响应循环里的下一个中间件函数**。示例：middleware1 调 next() → 控制权到 middleware2 → middleware2 发响应结束循环 → middleware3 **不会跑**。如果 middleware1 不调 next 会怎样？（官方留了个悬念让你去 Discord 讨论——答案：请求会一直挂着）。**next 的四种传参**：① 无参 next()——传给下一个中间件，简单直接；② 带错误 next(new Error(...))——**直达错误中间件函数**；③ 字符串 next('route')——传给**同匹配路径的下一个路由处理器**（如果有）；只对 app.METHOD / router.METHOD 有效，效果也可能等同无参 next；④ 字符串 next('router')——**跳过挂在这个路由器实例上的所有剩余中间件**、把控制权送出路由器（回到父路由器，比如 app——是的，Express 应用底层也就是个路由器）。四个里**大概率只用前两个**，除非有很特定的需求。**收尾**：跟着做下来的文件夹结构——errors/CustomNotFoundError.js、controllers/authorController.js、routes/authorRouter.js（及其他路由器）、app.js、db.js。官方练习：往 db.js 加更多样例数据、给之前建的其他路由也写上控制器。**Assignment 两条**：① 读 Viral Shah 的《Express Middlewares, Demystified》加深对中间件的理解（文章还鼓励你读 Express 源码——你现在大概读得懂了）；**官方 note 提醒**：文中「Express 不是为 await 处理器或返回的 promise 而构建、async 处理器抛错只能靠 next(err) 传递」的段落**已过时**——**当前版本的 Express（v5）原生支持 async 路由处理器**；② 看 10 分钟的 **MVC 模式**短视频教程——内容不多，主要是巩固你已知的东西。",
      "understand": [
        "控制器 = **终极中间人**：知道该问模型什么、该渲染哪个视图，但把重活委派出去——MVC 里职责明确的函数、整场运作的大脑",
        "响应方法：**res.send**（通用，自动设 Content-Type）/ **res.json**（强制 JSON、非对象也转）/ **res.redirect** / **res.render**；**res.status 设码但不结束循环**、可链式（status(404).send 可以，反过来不行）",
        "**响应方法只结束请求-响应循环、不结束函数执行**——send 后的代码照样跑，二次 send 抛错；所以 404 分支后要 return",
        "中间件 = 工作在「请求进来」与「最终处理器」之间的函数：三参数 **req / res / next**；四种能力（改对象 / 执行代码 / 调 next / 结束循环）；**按定义顺序执行**；分**应用级**（app.use，内置 body parser 与 static）与**路由器级**（router.use）",
        "控制器在 Express 里**也是中间件**，但概念不同层：控制器属 MVC 模式、中间件属 Express 特性——「用 Express 中间件实现 MVC 的 C」",
        "**错误处理中间件必须四参数 (err, req, res, next)**、一个都不能少（否则不被识别）、放在**所有代码最末尾**；Express v5 **自动捕获 async 处理器抛错**并调 next(err)",
        "**自定义错误类**（extends Error + statusCode）让错误中间件能按错误类型回 404/500，而不是只会 500",
        "**next 四种传参**：无参（下一个中间件）/ Error（直达错误中间件）/ 'route'（同路径下一个路由处理器）/ 'router'（跳出本路由器）——日常只用前两个"
      ],
      "terms": [
        {
          "en": "Controller",
          "zh": "控制器：MVC 的调度层——接收路由匹配的请求，问模型要数据、决定渲染哪个视图；本体是职责明确的函数"
        },
        {
          "en": "Middleware",
          "zh": "中间件：Express 核心特性——工作在请求与最终处理器之间的函数（req/res/next 三参数），可改对象、执行代码、传控制权或结束循环"
        },
        {
          "en": "res.send / res.json",
          "zh": "响应方法：send 通用（按数据类型自动设 Content-Type，只把布尔与对象/数组当 JSON）；json 强制 JSON（非对象值也自动转换，内部调用 send）"
        },
        {
          "en": "res.status",
          "zh": "设置响应状态码但不结束请求-响应循环——必须链式接发送方法；顺序不可反（status(404).send(...) 对，send(...).status(404) 错）"
        },
        {
          "en": "next",
          "zh": "把控制权传给链中下一个中间件的函数；四种传参：无参 / Error（直达错误中间件）/ 'route' / 'router'——日常用前两种"
        },
        {
          "en": "Error handler middleware",
          "zh": "错误处理中间件：四参数 (err, req, res, next) 是识别标志、必须放在应用最末尾——接收前面中间件抛出或 next(err) 传来的错误"
        },
        {
          "en": "Custom error class",
          "zh": "自定义错误类：扩展 Error、附 statusCode 与专属 name——让统一的错误中间件能按类型回不同状态码（如 404 而非一律 500）"
        },
        {
          "en": "Application-level / Router-level middleware",
          "zh": "应用级（app.use / app.METHOD 绑定 Express 实例，匹配每个请求）与路由器级（router.use / router.METHOD 绑定路由器实例，只在该路由器被进入时执行）"
        },
        {
          "en": "Body parser",
          "zh": "请求体解析器：express.json / express.urlencoded 等内置中间件——把请求体解析进 req.body，表单与 JSON 数据的入口"
        }
      ],
      "tasks": [
        "读 Viral Shah 的文章《Express Middlewares, Demystified》，更深入地理解中间件如何工作——文章还鼓励你读 Express 源码；注意官方提醒：文中「async 处理器只能靠 next(err) 传错」的段落已过时，Express v5 已原生支持 async 路由处理器（链接在资料区）",
        "看这支 10 分钟的 MVC 模式短视频教程——内容不多，主要是巩固你已经知道的东西（链接在资料区；为英文视频）"
      ],
      "quiz": [
        {
          "question": "「控制器是终极中间人」——官方用哪两组委派关系解释这句话？",
          "answer": "它知道想问模型哪些问题，但让模型做全部重活；它知道想渲染哪个视图发回浏览器，但让视图自己拼 HTML。控制器聪明在「知道该做什么」，然后把所有难活委派出去——它是 MVC 运作的大脑，本体只是一个职责明确的函数。"
        },
        {
          "question": "res.send 与 res.json 都能发 JSON，官方建议发 JSON 时用哪个？两者的关键差别是什么？",
          "answer": "用 res.json。差别：json 强制 JSON 并自动把非对象值转换成 JSON；send 只把布尔值和对象（含数组）当 JSON 处理、其他类型不转。json 内部其实调用 send，是语义更明确的便捷方法——发 JSON 就用名字带 json 的方法。"
        },
        {
          "question": "为什么说「响应方法不结束函数执行」？官方示例里 res.send(\"Hello\") 之后再 res.send(\"Bye\") 会怎样？正确姿势是什么？",
          "answer": "响应方法只结束请求-响应循环，函数体剩下的代码照样执行：console.log 会跑，第二次 send 会抛错（已经向客户端发过响应、不能再发）。正确姿势：发送响应后立即 return——authorController 的 404 分支就是这么写的，防止继续执行成功分支的逻辑。"
        },
        {
          "question": "错误处理中间件的识别标志是什么？少写一个参数会怎样？它应该放在哪里？",
          "answer": "四参数签名 (err, req, res, next)——一个都不能少，err 必须在第一位；少任何一个参数，Express 就把它当普通请求中间件（哪怕放在最后）。位置：应用全部代码的最末尾，确保它是最后执行的中间件、只接从前面冒泡下来的错误。"
        },
        {
          "question": "控制器里 throw new CustomNotFoundError(\"Author not found\") 之后，404 响应是谁、怎么发出来的？",
          "answer": "错误中间件发的。链条：Express v5 自动捕获 async 处理器抛出的错误并调 next(err) → 控制权直达末尾的错误中间件 → 它读 err.statusCode（自定义错误类构造器里设的 404）→ res.status(err.statusCode || 500).send(err.message)。控制器本身不写任何错误响应代码。"
        }
      ],
      "optional": [],
      "note": "Assignment 第 1 条的 Medium 文章有一处官方专门立牌纠正的过时内容：「Express 不能 await 处理器、async 抛错只能 next(err)」——Express v5 起原生支持 async 路由处理器（自动捕获抛错），读旧文时以官方 note 为准。res.render 与视图模板的完整故事在下一课 Views；本课的 db.js 是 mock 数据库，真实数据库（PostgreSQL + pg）在章末两课登场——届时 controllers 里的查询函数会换成真的。",
      "why": "这一课是 Express 章的枢纽：路由（上一课）决定「谁来处理」，控制器决定「怎么处理」，视图（下一课）决定「怎么呈现」——MVC 的 C 在这里立起来，V 在下一课，M 在 PostgreSQL 两课。中间件更是贯穿整条后端课程的底层概念：表单校验（express-validator）、认证（Passport）、会话、日志……后面每一个「装个包就有的能力」本质都是一段中间件。现在把三参数/四参数、next 的语义、执行顺序这三件事吃透，后面所有课都是在复用这套心智模型。",
      "sections": [
        {
          "h": "控制器的角色：终极中间人",
          "p": [
            "控制器的工作是充当**终极中间人（ultimate middleman）**：它知道想问**模型**哪些问题，但让模型去做解决问题的全部重活；它知道想渲染哪个**视图**发回浏览器，但让视图自己去拼全部 HTML。",
            "这就是它叫「控制器」的原因——**聪明到知道该做什么，然后把所有难活委派出去**。归根结底，控制器是整场运作的**大脑**，确保每个组件各尽其职、交付最终结果——它真的只是 **MVC 模式里一个职责明确的函数**。"
          ]
        },
        {
          "h": "处理响应：send / json / redirect / render / status",
          "p": [
            "**res.send**——通用响应方法，对数据类型很灵活：**按你传的数据自动设置 Content-Type 头**（传对象就 string 化成 JSON 并设 application/json）。",
            "**res.json**——更显式的 JSON 响应：**总是**设 Content-Type 为 application/json 并以 JSON 发送数据。**res.redirect**——把客户端重定向到另一个 URL。**res.render**——渲染视图模板、把生成的 HTML 作为响应发回（后面的课细讲）。",
            "**res.status**——手动设置响应状态码，**但它自己不结束请求-响应循环**；可以链式接其他方法：**res.status(404).send(...)** 可以，**res.send(...).status(404) 不行**。想用默认 200 就省略它。",
            "官方 note（send vs json）：json **强制 JSON 并自动把非对象值转成 JSON**，send 不会（只把布尔值与对象/数组当 JSON）；json 内部就是调 send 的便捷方法——**发 JSON 就用 json**，名字即语义，天作之合。",
            "**当心**：这些响应方法**只结束请求-响应循环、不结束函数执行**——send 后的 console.log 照样跑；**再 send 一次会抛错**（不能向客户端发送两次）。"
          ]
        },
        {
          "h": "中间件：Express 的核心概念",
          "p": [
            "中间件函数**工作在进来的请求与最终的目标路由处理器之间**。典型中间件取**三个参数**（有一种特殊的取四个，稍后讲）：**req**（请求对象）、**res**（响应对象）、**next**（把控制权传给链中下一个中间件的函数；可选）。官方 note：参数名只是惯例，叫 request/response 也随便你。",
            "中间件能干的活：**修改请求或响应对象**（有的包往 req 加属性，或设置模板用的 res.locals）；**执行额外代码**（校验、认证中间件等）；**调用链中的下一个中间件**；**结束请求-响应循环**（链上还有也不再跑）。",
            "Express 生态丰富：认证、CORS、限流、会话、日志、校验……大概率都有现成的中间件包。课程会陆续引入建项目需要的中间件，也欢迎你自行探索。"
          ]
        },
        {
          "h": "应用级与路由器级中间件、执行顺序",
          "p": [
            "**应用级中间件**：用 **app.use 或 app.METHOD**（app.get、app.post）绑定到 **Express 实例**。匹配指定路径的每个请求都会执行；不指定路径默认为 /（匹配每个请求）；循环在到达前结束它就不跑；**通常放在应用代码最顶端**确保总是先执行。",
            "Express 的常用**内置中间件**：**body 解析器**（express.json、express.urlencoded——正确解析请求体、让你能用 req.body）；**静态文件服务**（app.use(express.static('public'))——服务 HTML、CSS、JavaScript 与图片，参数指定静态文件目录）。",
            "**路由器级中间件**：同理，但用 **router.use 或 router.METHOD** 绑定到**路由器实例**——只有请求匹配并进入该路由器时才执行。",
            "示例中间件（见代码示例区）：打日志、往 req 加 customProperty、调 next()——它之后的中间件都能读到 req.customProperty。",
            "**顺序纪律**：Express **按定义/注册顺序**执行中间件——定义顺序决定调用顺序；会修改 Request 对象的包（如 body 解析器）必须放在**应用最顶端**，下面的中间件才能看到修改结果。"
          ]
        },
        {
          "h": "控制器与中间件：同体不同层",
          "p": [
            "控制器就是函数；在 Express 世界里它们**也算中间件**（被路由处理器使用）。但两者是**不同的概念**：控制器是 **MVC（模型-视图-控制器）模式**——一种组织软件的设计思路——的关键组件；中间件是 **Express 的核心特性**：在请求-响应循环的特定节点跑代码、改请求或结束循环。所以准确的说法是：**我们用 Express 的中间件来实现 MVC 模式里的「Controller」部分**。",
            "**控制器何时上场**：请求打到服务器、路由匹配了动词与路径；路由按定义的中间件链决定**哪个控制器处理请求**；控制器接管后执行必要动作——**从模型取数据、处理数据、按业务逻辑做决定、或用新数据更新模型**。",
            "完成后控制器把处理好的数据**交给视图**；视图渲染成适合发回客户端的格式——通常是 HTML；后面讲 API 时也可以是 JSON（像你以前用过的 Giphy API 那样）。",
            "**命名惯例**：按挂载的路由起名——**GET → getSomething、POST → createSomething、DELETE → deleteSomething**；没有固定规则（Express 不持立场），取决于你或别人的惯例与函数需求。"
          ]
        },
        {
          "h": "实战：mock 数据库 + authorController 四步走",
          "p": [
            "接着上一课的应用：之前定义了 /authors/:authorId 路由，这次给它写控制器并接上样例数据。先在项目根建 **db.js**——一个 authors 数组加一个按 ID 查作者的 async 函数（官方原话：文件名、内容、位置都不重要，这只是个能调用的 mock「数据库」）。",
            "再建 **controllers/authorController.js**，控制器四步（对照代码示例区）：**① 从 req.params 取 authorId**（路由参数）；**② await 调 db.getAuthorById 查作者**；**③ 查不到**——res.status(404).send(\"Author not found\") 然后 **return**：发响应不会自动停止函数执行，return 避免继续跑其他逻辑；**④ 查到**——res.send 带作者名的文本（默认 200）。",
            "路由文件里引入控制器并挂上路由：authorRouter.get(\"/:authorId\", getAuthorById)。很简单，对吧？"
          ]
        },
        {
          "h": "错误处理（上）：try/catch 与错误中间件",
          "p": [
            "健壮的应用必须**优雅地处理错误**：给客户端有意义的错误响应、防止应用意外崩溃。错误可能发生在 **async 操作**里——前面的代码片段没处理这种情况。",
            "**方案一：try/catch**——把控制器逻辑包进 try/catch；catch 里 console.error 记录、res.status(500).send(\"Internal Server Error\")。也可以改调 next(error)——但那只会用 Express 默认视图渲染错误页、把整页 HTML 发给客户端；想要别的响应就得写一种特殊的中间件……",
            "**方案二：错误处理中间件**——如果很多 async 中间件的错误响应大同小异（只是状态码与消息不同），与其每个都 try/catch：**Express 会自动捕获抛出的错误并调用 next(error)**，把控制权交给一个特殊的「错误中间件函数」。写法：app.use((err, req, res, next) => { console.error(err); res.status(500).send(err); })——放在**应用全部中间件的最末尾**，确保它最后执行、只处理从前面冒泡下来的错误。",
            "**识别纪律**：这是**必须提供四个参数**的中间件（哪怕用不到）——**少任何一个参数它就不会被识别为错误中间件**（可以自己试试😉）；**err 必须是回调的第一个参数**。**少于四参数**的函数永远被当作请求中间件——哪怕你把它放在最后。"
          ]
        },
        {
          "h": "错误处理（下）：自定义错误类",
          "p": [
            "上面的错误中间件不管什么错都只能回 **500**——想发 **404** 怎么办？常见做法：**扩展 Error 对象建自定义错误类**。",
            "**errors/CustomNotFoundError.js**：class CustomNotFoundError extends Error——构造器里 super(message)、**this.statusCode = 404**、**this.name = \"NotFoundError\"**（让 stringify 后的错误更整洁：NotFoundError: message 而不是 Error: message）。",
            "控制器里重构：查不到作者时不再手写 404 响应，而是**直接 throw new CustomNotFoundError(\"Author not found\")**——因为 **Express 会自动捕获 async 中间件函数里抛出的错误**并调 next()（把捕获的错误作为参数传入），控制权自动交到错误中间件。",
            "错误中间件相应升级：**res.status(err.statusCode || 500).send(err.message)**——自定义错误带 statusCode 就用它的；没有的大概率就是内部服务器错误。这个模式很有用，可以按用例继续建更多自定义错误类。"
          ]
        },
        {
          "h": "next 函数到底是什么：四种传参",
          "p": [
            "简单说：next **把控制权传给应用请求-响应循环里的下一个中间件函数**。示例（见代码示例区）：middleware1 调 next() → 控制权到 middleware2 → middleware2 发响应**结束循环** → middleware3 **不会跑**。如果 middleware1 不调 next 呢？（官方留了悬念让你去 TOP Discord 说你的想法——答案：请求会一直挂着不响应。）",
            "**next 的四种传参**：**① 无参 next()**——传给下一个中间件，简单直接；**② 带错误 next(new Error(...))**——**直接传给错误中间件函数**；**③ 字符串 next('route')**——传给**同匹配路径的下一个路由处理器**（如果有）；只对 app.METHOD 或 router.METHOD 有效，也可能效果等同无参 next；**④ 字符串 next('router')**——**跳过挂在该路由器实例上的全部剩余中间件**、把控制权送出路由器、回到父路由器（比如 app——是的，**Express 应用底层也就是个路由器**）。",
            "四个里**大概率只用前两个**，除非有很特定的需求用到后两个。"
          ]
        },
        {
          "h": "文件夹结构 + Assignment",
          "p": [
            "跟着做下来你的项目应该长这样（官方结构图）：**errors/**CustomNotFoundError.js、**controllers/**authorController.js、**routes/**authorRouter.js（及其他路由器）、**app.js**、**db.js**。",
            "官方练习（选做性质）：往 db.js 里加更多样例数据、给之前建过的其他路由也写控制器。",
            "**Assignment 两条**：① 读 Viral Shah 的**《Express Middlewares, Demystified》**——更深地理解中间件如何工作；文章还鼓励你**读 Express 源码**（你现在大概读得懂了）。**官方 note 提醒**：文中「Express 不是为 await 处理器构建、async 函数抛错只能靠 next(err) 传递」的段落**已过时**——**当前版本的 Express（v5）原生支持 async 路由处理器**；② 看 10 分钟的 **MVC 模式**视频小教程——没多少新东西，主要是巩固你已知的（链接都在资料区）。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "app.use((req, res) => {\n  // This works and this ends the request-response cycle\n  res.send(\"Hello\");\n\n  // However, it does not exit the function so this will still run\n  console.log('will still run!!');\n\n  // This will then throw an error that we cannot send again after sending to the client already\n  res.send(\"Bye\");\n});",
          "note": "官方警示例：响应方法只结束请求-响应循环、不结束函数执行——send 后的代码照跑，二次 send 抛错。这就是控制器 404 分支发完响应必须 return 的原因。"
        },
        {
          "lang": "javascript",
          "code": "function myMiddleware(req, res, next) {\n  // Perform some operations\n  console.log(\"Middleware function called\");\n\n  // Modify the request object\n  req.customProperty = \"Hello from myMiddleware\";\n\n  // Call the next middleware/route handler\n  next();\n}\n\napp.use(myMiddleware);",
          "note": "基本中间件三件套：干活（打日志）、改请求对象（加 customProperty）、调 next() 传控制权。经 app.use 注册为应用级中间件——链上排在它后面的中间件都能读到 req.customProperty。"
        },
        {
          "lang": "javascript",
          "code": "// db.js\n\nconst authors = [\n  { id: 1, name: \"Bryan\" },\n  { id: 2, name: \"Christian\" },\n  { id: 3, name: \"Jason\" },\n];\n\nasync function getAuthorById(authorId) {\n  return authors.find(author => author.id === authorId);\n};\n\nmodule.exports = { getAuthorById };",
          "note": "官方 mock「数据库」：一个数组 + 一个 async 查询函数。文件名、内容、位置都不重要——存在的意义是让控制器有一个可以 await 的数据层，等真数据库（PostgreSQL）登场后原样替换。"
        },
        {
          "lang": "javascript",
          "code": "// controllers/authorController.js\n\nconst db = require(\"../db\");\n\nasync function getAuthorById(req, res) {\n  const { authorId } = req.params;\n\n  const author = await db.getAuthorById(Number(authorId));\n\n  if (!author) {\n    res.status(404).send(\"Author not found\");\n    return;\n  }\n\n  res.send(`Author Name: ${author.name}`);\n};\n\nmodule.exports = { getAuthorById };",
          "note": "控制器四步：取路由参数 → await 查库 → 查不到回 404 并 return（发响应不自动停函数）→ 查到回 200 与作者名。路由侧一行挂载：authorRouter.get(\"/:authorId\", getAuthorById)。"
        },
        {
          "lang": "javascript",
          "code": "app.use((req, res, next) => {\n  throw new Error(\"OH NO!\");\n  // or next(new Error(\"OH NO!\"));\n});\n\napp.use((err, req, res, next) => {\n  console.error(err);\n  // You will see an OH NO! in the page, with a status code of 500 that can be seen in the network tab of the dev tools\n  res.status(500).send(err.message);\n});",
          "note": "错误处理中间件：四参数 (err, req, res, next) 是识别标志、少一个就退化成普通中间件；必须放在最末尾。前一个中间件 throw（Express v5 自动捕获）或手动 next(err)，都会直达这里——页面上看到 OH NO!、Network 面板里状态码 500。"
        },
        {
          "lang": "javascript",
          "code": "// errors/CustomNotFoundError.js\n\nclass CustomNotFoundError extends Error {\n  constructor(message) {\n    super(message);\n    this.statusCode = 404;\n    // So the error is neat when stringified. NotFoundError: message instead of Error: message\n    this.name = \"NotFoundError\";\n  }\n}\n\nmodule.exports = CustomNotFoundError;\n\n// 控制器里：\n// if (!author) throw new CustomNotFoundError(\"Author not found\");\n// 错误中间件里：\n// res.status(err.statusCode || 500).send(err.message);",
          "note": "自定义错误类模式：扩展 Error、构造器里带 statusCode 与专属 name。控制器只管 throw，Express 自动捕获转 next(err)；统一的错误中间件按 err.statusCode 分发状态码——404 与 500 各得其所，控制器里零错误响应代码。"
        }
      ],
      "pitfalls": [
        {
          "title": "发完响应不 return，函数继续跑",
          "text": "res.send/res.status(404).send 只结束请求-响应循环、不结束函数执行——不 return 就会掉进成功分支再 send 一次，直接抛「不能发送两次」错误。authorController 的 404 分支那个 return 不是风格问题，是功能必需。"
        },
        {
          "title": "错误中间件少写参数或放错位置",
          "text": "四参数 (err, req, res, next) 一个都不能少——少任何一个，Express 就当它是普通请求中间件（哪怕放在最后）；位置也必须在全部代码最末尾，否则接不到后面中间件冒泡的错误。官方原话：可以自己试试——这是本课最值得亲手踩一次的坑。"
        },
        {
          "title": "改 Request 对象的中间件没放最顶端",
          "text": "body 解析器这类会修改 req 的中间件必须放在应用最顶端——排在它后面的中间件才能看到 req.body 等修改结果。中间件按定义顺序执行，顺序错了不是「慢一点」而是「拿不到数据」。"
        },
        {
          "title": "拿旧文章的结论套 Express 5",
          "text": "「Express 不能 await 处理器、async 抛错必须手动 next(err)」是 v5 之前的旧事实——官方 note 专门立牌：当前版本（v5）原生支持 async 路由处理器，抛出的错误会被自动捕获。读第三方旧文（包括 Assignment 那篇的该段落）时以官方 note 为准。"
        }
      ],
      "official": {
        "assignment": [
          "读 Viral Shah 的文章「Express Middlewares, Demystified」，更深地理解中间件如何工作；文章还鼓励你读 Express 源码。注意官方 note：文中关于 async 处理器只能靠 next(err) 传错的段落已过时——Express v5 原生支持 async 路由处理器",
          "看这支 10 分钟的 MVC 模式视频小教程——内容不多，主要是巩固你已知的东西"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "Express 官方文档「Using Express Middleware」——信息相同但例子更多、可以跟着跑"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/express/controllers.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "c242abac9b682f39addee970804b7cab936d0c600e6a26f783f119be38bce3e6",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "nodejs-views",
      "title": "Views",
      "zh": "视图",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/nodejs-views",
      "summary": "MVC 的 V 登场：此前你做的很多项目是 SPA——发过去的 HTML 基本是空壳、靠客户端 JS 渲染页面；现在重心转到服务器端渲染：由服务器生成真正含内容的 HTML 文件。视图就是应用面向用户的部分（HTML 文件）；早期项目里服务器发的 HTML 是静态的，而多数用例需要视图随数据动态变化——于是用模板引擎：代码库里写模板文件，响应请求时被转换成 HTML，模板里的变量替换成真实数据，还能写条件与循环逻辑（比如登录后才渲染用户名）——纯 HTML 做不到这些。客户端 JS 仍可经 script 标签添加（暂时不玩花的）。本课程选 EJS：语法与 HTML 非常接近，学习曲线比其他模板引擎平缓。正文五块：① 设置——npm install ejs、建 views 子目录、app.set(\"views\", …) 与 app.set(\"view engine\", \"ejs\")（另有官方 note 解释为什么不用 React：没教过 React Server Components，它与已学的 React 很不同、独立搭建不轻松，而高度抽象的全栈框架会模糊前后端边界、不利于专注后端基本功）；② EJS 语法——<% %> 里写 JavaScript（条件、循环、变量），<%= %> 把变量输出为值；③ 配合 Express——res.render(\"index\", { message: \"EJS rocks!\" })：第一参数找模板、第二参数是给模板的变量对象；检查 dev tools 可见 HTML 结构与模板一致、变量已替换；④ locals——EJS 能拿到 res.render 传入对象与 res.locals 的全部属性，存进叫 locals 的对象（类似浏览器的 window）：locals.message 或直接 message 都行；tip：访问未定义变量时 locals.foo 得 undefined、裸 foo 抛引用错误；⑤ 可复用模板——include 命令插入共享组件（navbar/user 列表项），<%- 原始输出避免二次转义；views 里可以建嵌套子目录（users/user）；⑥ 静态资产——express.static 中间件 + public 目录，模板 head 里正常 link。Assignment 四条：再读 EJS 文档、读 Express 模板引擎资源（示例用 Pug、语法不同但信息互补）、给应用加 /about 视图、做一个可复用 footer 渲染进所有路由。",
      "guide": "以下是官方原课的中文化梳理。**从 SPA 到服务器端渲染**：此前你做的很多项目都是 **SPA（单页应用）**：发过去的 HTML 文件基本是空的、带一个 script 标签，由**客户端**用 JavaScript 渲染页面。现在我们把重心转到**在服务器上渲染 HTML**——用服务器创建**真正含有页面内容**的 HTML 文件。**视图（Views）就是应用面向用户的部分**——这里就是 HTML 文件。更早的项目里服务器也发过 HTML，但那些文件是**静态的**；而我们的多数用例需要视图**随数据动态变化**。于是用**模板引擎（template engines）**：顾名思义，我们在代码库里写**模板文件**，响应服务器请求时它们被**转换成 HTML**；模板里定义的变量被**替换成真实数据**；还可以插入**条件与/或循环逻辑**——比如用户登录后渲染其用户名。**纯 HTML 做不到这些**。客户端 JavaScript 仍然可以经 script 标签添加（虽然现在不打算在客户端玩太花的）。本课程用 **EJS**：语法与 HTML 非常相似，学习曲线相对其他模板引擎**平缓**。**① 设置 EJS**：官方 note（为什么不用 React？）：**我们没教过 React Server Components**——它们与你目前认识的 React 相当不同；不像 EJS 这样的模板引擎，**独立搭建 RSC 并不轻松**；而用预配置但高度抽象的全栈框架（为了更流畅的开发模糊前后端边界）会让人**难以专注学习后端基本功**。步骤：终端 **npm install ejs**；项目根建 **views** 子文件夹；app.js 里设两个应用属性：**app.set(\"views\", path.join(__dirname, \"views\"))** 与 **app.set(\"view engine\", \"ejs\")**；文件顶部引入 Path 模块：**const path = require(\"node:path\")**。这就启用了 EJS 作为视图引擎、并告诉应用去 **/views 子目录**找模板文件。**② EJS 语法**：**<% 与 %>** 标签里可以使用 JavaScript——条件语句、for 循环、用变量都行。**要把变量输出为值，用 <%= 标签**。官方示例：定义 animals 数组，<ul> 里 map 每个 animal 输出「<%= animal %>s are cute」列表项（见代码示例区）。**③ 在 Express 里用 EJS**：views 子目录里建模板 **index.ejs**（html/body 里一行 <%= message %>）；app.js 的路由里渲染它：**app.get(\"/\", (req, res) => { res.render(\"index\", { message: \"EJS rocks!\" }); })**（理想情况路由该定义在单独的路由器文件里，本课为聚焦主题先写在 app.js）。启动服务器、浏览器访问 / 路由：看到 **EJS rocks!**。在 dev tools 里检查 HTML：结构与 EJS 模板的写法完全一致、**message 变量已被替换成它的值**。机制：命中 / 路由时，res.render(\"index\", { message: ... }) 这行发回响应——因为已经定义了 views 与 view engine 两个应用属性，**第一参数**被设定为「去指定文件夹找叫 index 的模板」，**第二参数**是一个变量对象、里面的变量提供给这个特定模板。**④ EJS 里的 locals 变量**：模板文件是怎么知道 message 变量的？渲染视图时，EJS 能访问 **res.render 传入对象**的全部属性，以及 **Express 的 res.locals 对象**的全部属性（res.locals 的用途：需要在某个中间件函数里给视图传值、但直到中间件链后面才调 res.render）。EJS 把这些属性存进一个叫 **locals** 的对象——**类似浏览器里的全局 window 对象**：视图里用 **locals.message** 或干脆 **message** 都能访问。官方 tip（locals 里的未定义变量）：访问既不在 res.render 的 locals 参数、也不在 res.locals 里的变量会**引发引用错误**——**locals.foo 返回 undefined，裸 foo 直接抛引用错误**。可以在 index.ejs 里输出 locals.foo 验证、再换成 foo 对比。**⑤ 可复用模板**：侧边栏、页头这类**跨页面共享的组件**用 **include 命令**插入：需要被插入文件的文件名 + 可选的数据对象。官方示例一：navbar.ejs（nav > ul 里 for 循环渲染 links 数组的每一项 a 标签）——navbar 期待一个 **links 变量**；app.js 里定义 links 数组（Home 与 About 两项）并在 res.render 时传入；index.ejs 里 **<%- include('navbar', {links: links}) %>**。注意 **<%- 原始输出标签**与 include 的搭配——**避免对 HTML 输出二次转义**。官方示例二：users 数组（Rose、Cake、Biff）传给 index.ejs；新建 **user.ejs**（一行 <li><%= user %></li>）；index.ejs 里 users.forEach 循环、每项 **<%- include('user', {user: user}); %>**——成功的话渲染出三个名字。官方 tip（views 里的嵌套目录）：把 user.ejs 挪进 **users/** 子目录、include 路径改成 **'users/user'** 即可——模板文件可以按目录组织。**⑥ 服务静态资产**：与直接写 HTML 时类似，用 **link 标签**把外部文件加进模板 head；关键是应用得知道**去哪里服务资产**。app.js：**const assetsPath = path.join(__dirname, \"public\"); app.use(express.static(assetsPath));**——express.static() 是个中间件函数、启用静态资产服务，我们告诉它以 **public 目录**为根。public 根下建 **styles.css**（body { color: red; }）；index.ejs 的 head 里 **<link rel=\"stylesheet\" href=\"/styles.css\">**——页面文字变红即成功。**Assignment 四条**：① 再通读一遍 **EJS 文档**；② 读 **Express 的模板引擎资源**——它用 **Pug** 做示例（语法不同），但信息对本课仍是有用的补充；③ 给一直在开发的应用**加一个 about 页面视图**，在 /about 路由渲染；④ **创建一个可复用的 footer 模板**，渲染进应用的**所有路由**。",
      "understand": [
        "**范式切换**：SPA 是「空壳 HTML + 客户端 JS 渲染」；服务器端渲染是「服务器生成真正含内容的 HTML」——视图 = 应用面向用户的部分",
        "**模板引擎**：模板文件在响应时被转换成 HTML——变量替换成真实数据，还能写条件与循环（纯 HTML 做不到）；本课用 **EJS**（语法近 HTML、曲线平缓）",
        "设置三件套：**npm install ejs** + views 目录 + **app.set(\"views\", …) / app.set(\"view engine\", \"ejs\")**；渲染用 **res.render(模板名, 变量对象)**",
        "**EJS 三对标签**：<% %> 写 JS 逻辑（循环/条件）；**<%= %> 输出转义后的值**；**<%- %> 输出原始 HTML**（include 必配它，避免二次转义）",
        "**locals**：res.render 传入对象 + res.locals 的属性都存进 locals——模板里 locals.message 与裸 message 都行；但未定义变量 locals.foo 是 undefined、裸 foo **抛引用错误**",
        "**include 复用组件**：navbar/footer/列表项拆成独立模板、跨页面共享；模板可住 views 的嵌套子目录（'users/user'）",
        "**静态资产**：express.static('public') 中间件 + 模板 head 里正常 link——和纯 HTML 时代的直觉一致",
        "官方 note 为什么不用 React：RSC 没教过且独立搭建不轻松；高度抽象的全栈框架会模糊前后端边界、妨碍专注后端基本功"
      ],
      "terms": [
        {
          "en": "View",
          "zh": "视图：应用面向用户的部分——本课程语境下就是服务器生成的 HTML 文件；MVC 的 V"
        },
        {
          "en": "Template engine",
          "zh": "模板引擎：把代码库里的模板文件在响应时转换成 HTML 的工具——变量替换为真实数据，支持条件与循环逻辑"
        },
        {
          "en": "EJS",
          "zh": "本课程选用的模板引擎：Embedded JavaScript——语法与 HTML 非常相似，学习曲线相对平缓"
        },
        {
          "en": "res.render",
          "zh": "渲染视图模板并发回 HTML 的响应方法：第一参数是模板名（去 views 目录找），第二参数是提供给模板的变量对象"
        },
        {
          "en": "locals",
          "zh": "EJS 存放模板可用变量的对象（类似浏览器的 window）：res.render 第二参数与 res.locals 的属性都在其中；locals.x 安全（undefined）、裸 x 未定义会抛引用错误"
        },
        {
          "en": "res.locals",
          "zh": "Express 响应对象上的属性袋：在中间件链前段给视图传值、后段才 res.render 时的桥梁"
        },
        {
          "en": "include",
          "zh": "EJS 的模板复用命令：把共享组件（navbar/footer/列表项）插入页面——配 <%- 原始输出避免二次转义"
        },
        {
          "en": "express.static",
          "zh": "服务静态资产的内置中间件：指定目录（惯例 public）为根，HTML/CSS/JS/图片即可经 URL 直接访问"
        },
        {
          "en": "Pug",
          "zh": "另一种模板引擎——Express 官方模板引擎文档用它做示例；语法与 EJS 不同，但概念互通"
        }
      ],
      "tasks": [
        "再通读一遍 EJS 官方文档（链接在资料区）",
        "读 Express 官方的模板引擎（using template engines）资源——示例用的是 Pug（语法不同），但信息对本课仍是有用的补充（链接在资料区）",
        "给本课一直在开发的应用加一个 about 页面视图，在 /about 路由渲染",
        "创建一个可复用的 footer 模板，并把它渲染进应用的所有路由"
      ],
      "quiz": [
        {
          "question": "SPA 与服务器端渲染的根本差别是什么？为什么静态 HTML 文件满足不了「多数用例」？",
          "answer": "SPA 发过去的 HTML 基本是空壳、由客户端 JS 渲染内容；服务器端渲染由服务器生成真正含有页面内容的 HTML 再发回。静态文件对所有人千篇一律——而多数用例需要视图随数据动态变化（比如登录后渲染用户名），这需要模板引擎在响应时把变量替换成真实数据、执行条件与循环逻辑。"
        },
        {
          "question": "res.render(\"index\", { message: \"EJS rocks!\" }) 两个参数各是什么？模板里的 message 从哪来？",
          "answer": "第一参数是模板名——因为设置过 views 与 view engine 属性，它被解析为「去指定文件夹找叫 index 的模板」；第二参数是变量对象。EJS 把该对象（以及 res.locals）的属性存进 locals 对象——模板里写 locals.message 或直接 message 都能拿到值。"
        },
        {
          "question": "<%= %> 与 <%- %> 的差别是什么？为什么 include 必须配后者？",
          "answer": "<%= 输出转义后的值（特殊字符变 HTML 实体），<%- 输出原始内容不转义。include 插入的是另一个模板渲染好的 HTML——若用 <%= 会把整段 HTML 标签转义成文本显示出来（二次转义），所以官方示例统一写 <%- include(...) %>。"
        },
        {
          "question": "模板里访问一个没传进来的变量 foo：locals.foo 与裸 foo 的行为各是什么？官方为什么专门立了这个 tip？",
          "answer": "locals.foo 安全地返回 undefined；裸 foo 直接抛引用错误（页面 500）。因为 EJS 模板里两种写法都常见、而报错信息对新手不友好——官方让你亲手在 index.ejs 里先输出 locals.foo 再换成 foo 验证差异，把「未定义变量」的两种下场记牢。"
        },
        {
          "question": "官方 note 给出不用 React 做服务器渲染的理由是什么（两条）？",
          "answer": "① 课程没教过 React Server Components——它与已学的 React 相当不同，且不像 EJS 那样轻松独立搭建；② 预配置但高度抽象的全栈框架会为了流畅开发模糊前后端边界，让人难以专注学习后端基本功。所以本课程选语法近 HTML 的 EJS。"
        }
      ],
      "optional": [],
      "note": "res.locals 在本课只露了一面（中间件链里提前给视图传值的桥梁）——它的正式戏份在「身份认证」章（把当前登录用户传给所有模板）。express.static 与 public 目录是上一章纯 Node 静态文件服务的中间件化版本；EJS 的 <%- 原始输出与 XSS 的风险权衡在「表单与数据处理」一课有完整展开（转义时机哲学），两课对照读。",
      "why": "MVC 三课到此集齐：Routes 决定谁来处理、Controllers 决定怎么处理、Views 决定怎么呈现。这一课也是你写后端的「输出端」正式成型的时刻——从 res.send 拼字符串，升级到 res.render 渲染带数据的模板。留言板项目（下下一课）的页面全部从这里长出来；再往后的认证状态展示、库存列表渲染，用的都是本课的 locals 与 include。官方把「为什么不用 React」写成 note 也是良苦用心：前端功力此时是干扰项，先把服务器端渲染这块地基打牢。",
      "sections": [
        {
          "h": "从 SPA 到服务器端渲染：视图是什么",
          "p": [
            "此前你做的很多项目都是 **SPA**：服务过去的 HTML 文件基本是空的、带一个 script 标签，让**客户端**用 JavaScript 渲染页面。现在我们把重心放到**在服务器上渲染 HTML**——用服务器创建**真正含有页面内容**的 HTML 文件。",
            "**视图是应用面向用户的部分**——本课程语境下就是 HTML 文件。我们在更早的项目里处理过视图（服务器把 HTML 文件发给用户），但那些文件是**静态的**；而我们的很多用例需要视图**对数据是动态的**。",
            "于是用**模板引擎**：顾名思义，我们在代码库里写**模板文件**，响应服务器请求时它们被**转换成 HTML**；模板里定义的变量被替换成真实数据；还可以插入**条件与/或循环逻辑**——例如用户登录后渲染其用户名。**纯 HTML 做不到这些**。客户端 JavaScript 仍可经 script 标签添加（虽然暂时不在客户端玩花的）。",
            "本课程用 **EJS**：语法与 HTML 非常相似——学习曲线相对其他模板引擎比较平缓。"
          ]
        },
        {
          "h": "设置 EJS（以及为什么不用 React）",
          "p": [
            "官方 note（**为什么不用 React？**）：我们**没有教过 React Server Components**——它们与你迄今认识的 React 相当不同；与 EJS 这类模板引擎不同，**独立搭建它们并不轻松**；而使用预配置但高度抽象的全栈框架（为更流畅的开发模糊前后端边界），会让你**难以专注于学习后端基本功**。",
            "设置三步：终端 **npm install ejs**；项目根创建 **views** 子文件夹；app.js 里设置两个应用属性——**app.set(\"views\", path.join(__dirname, \"views\"))** 与 **app.set(\"view engine\", \"ejs\")**（文件顶部引入 const path = require(\"node:path\")）。",
            "这就把 EJS 启用为视图引擎、并让应用去 **/views 子目录**找模板文件。"
          ]
        },
        {
          "h": "EJS 语法：三对标签",
          "p": [
            "**<% 与 %>** 标签允许我们使用 JavaScript——条件语句、for 循环、用变量都可以。**要把变量输出为值，用 <%= 标签**。",
            "官方快例（数组 + 循环逻辑）：模板里先定义 animals 数组（Cat、Dog、Lemur、Hawk），<ul> 里对数组 map，每一项输出 **<li><%= animal %>s are cute</li>**——四个列表项就这么长出来（见代码示例区）。"
          ]
        },
        {
          "h": "res.render：模板 + 变量对象",
          "p": [
            "views 子目录里建模板 **index.ejs**：html > body 里一行 **<%= message %>**。app.js 的路由里渲染它：**res.render(\"index\", { message: \"EJS rocks!\" })**（理想情况路由定义在单独的路由器文件里；本课为聚焦先写在 app.js）。",
            "启动服务器、浏览器访问 **/**：看到 **EJS rocks!**。在 dev tools 里检查 HTML：**结构与 EJS 模板的写法完全一致，message 变量已被替换成它的值**。",
            "机制：命中 / 路由时这行代码发回响应——因为 views 与 view engine 两个应用属性已定义，**res.render 第一参数**被设定为「去指定文件夹找叫 index 的模板」，**第二参数**是一个变量对象、其属性提供给这个特定模板。"
          ]
        },
        {
          "h": "locals：模板变量的住处",
          "p": [
            "模板文件怎么知道 message 变量的？渲染视图时，EJS 能访问 **res.render 传入对象**的任何属性，以及 **Express 的 res.locals 对象**的任何属性（res.locals 的用途：想在某个中间件函数里给视图传值、但直到中间件链后面才调 res.render）。",
            "EJS 把这些属性存进一个叫 **locals** 的对象——**类似浏览器里的全局 window 对象**：视图里用 **locals.message**、或干脆 **message**，都能访问。",
            "官方 tip（**未定义变量**）：访问既不在 res.render 的 locals 参数、也不在 res.locals 里的变量，会**引发引用错误**——**locals.foo 返回 undefined，而裸 foo 直接引用错误**。官方让你亲手验证：在 index.ejs 输出 locals.foo，再把它换成 foo 对比。"
          ]
        },
        {
          "h": "可复用模板：include 与嵌套目录",
          "p": [
            "侧边栏、页头这类**跨页面共享**的组件用 **include 命令**插入：需要被插入文件的文件名，外加可选的数据对象。",
            "示例一（navbar）：**navbar.ejs** 里 nav > ul、for 循环渲染 **links** 数组的每一项（a 标签带 href 与 text）。app.js 定义 links（Home 与 About）并在 res.render 时传入；index.ejs 里写 **<%- include('navbar', {links: links}) %>**。",
            "注意 **<%- 原始输出标签**与 include 的搭配——**避免对 HTML 输出二次转义**（用 <%= 会把整段 HTML 转义成文本）。",
            "示例二（列表项）：users 数组（Rose、Cake、Biff）传给 index.ejs；新建 **user.ejs**（一行 <li><%= user %></li>）；index.ejs 里 **users.forEach**、每项 **<%- include('user', {user: user}); %>**——成功的话三个名字都渲染出来。",
            "官方 tip（**views 里的嵌套目录**）：把 user.ejs 挪到 **users/user.ejs**、include 路径改成 **'users/user'**——模板可以按目录组织。"
          ]
        },
        {
          "h": "静态资产：express.static + public",
          "p": [
            "EJS 下服务静态资产与直接写 HTML 时类似：用 **link 标签**把外部文件加进模板 head。关键是应用要知道**从哪里服务资产**。",
            "app.js 两行：**const assetsPath = path.join(__dirname, \"public\"); app.use(express.static(assetsPath));**——express.static() 是启用静态资产的中间件函数，我们告诉它以 **public 目录**为根。",
            "public 根下建 **styles.css**（body { color: red; }）；index.ejs 的 head 里 **<link rel=\"stylesheet\" href=\"/styles.css\">**——你的页面现在应该显示红色文字！"
          ]
        },
        {
          "h": "Assignment：四条动手",
          "p": [
            "① 再通读一遍 **EJS 文档**；② 读 **Express 的模板引擎资源**——示例用 **Pug**（语法不同），但信息对本课是有用的补充；③ 给一直开发的应用**加一个 about 页面视图**，在 **/about** 路由渲染；④ **创建一个可复用的 footer 模板**，渲染进应用的**所有路由**（资料区有链接）。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "// app.js\napp.set(\"views\", path.join(__dirname, \"views\"));\napp.set(\"view engine\", \"ejs\");\n\n// 顶部还需要：\nconst path = require(\"node:path\");",
          "note": "设置 EJS 的两个应用属性：views 告诉应用去哪个目录找模板（惯例 views/），view engine 指定用哪个模板引擎。加上 npm install ejs，设置完毕。"
        },
        {
          "lang": "html",
          "code": "<% const animals = [\"Cat\", \"Dog\", \"Lemur\", \"Hawk\"] %>\n\n<ul>\n  <% animals.map((animal) => { %>\n    <li><%= animal %>s are cute</li>\n  <% }) %>\n</ul>",
          "note": "EJS 语法速览：<% %> 里写 JavaScript（定义数组、map 循环），<%= %> 把变量输出为值——四个「Xs are cute」列表项由循环生成。模板文件里 HTML 与 JS 混排正是 EJS 的常态。"
        },
        {
          "lang": "javascript",
          "code": "// app.js\napp.get(\"/\", (req, res) => {\n  res.render(\"index\", { message: \"EJS rocks!\" });\n});",
          "note": "渲染模板：第一参数是模板名（去 views 目录找 index.ejs），第二参数的对象属性成为模板可用的变量——index.ejs 里的 <%= message %> 被替换为 EJS rocks!。"
        },
        {
          "lang": "html",
          "code": "<!-- navbar.ejs -->\n<nav>\n  <ul>\n    <% for (let i = 0; i < links.length; i++) { %>\n      <li>\n        <a href=\"<%= links[i].href %>\">\n          <span> <%= links[i].text %> </span>\n        </a>\n      </li>\n    <% } %>\n  </ul>\n</nav>\n\n<!-- index.ejs 里插入它 -->\n<%- include('navbar', {links: links}) %>",
          "note": "可复用模板：navbar.ejs 期待 links 变量（app.js 里 res.render 时传入）；index.ejs 用 include 插入——注意 <%- 原始输出标签，避免对渲染好的 HTML 二次转义。页头页脚都能这样共享。"
        },
        {
          "lang": "javascript",
          "code": "// app.js\nconst assetsPath = path.join(__dirname, \"public\");\napp.use(express.static(assetsPath));",
          "note": "静态资产两行：express.static 中间件 + public 目录为根。此后模板 head 里正常写 <link rel=\"stylesheet\" href=\"/styles.css\"> 即可——与纯 HTML 时代的直觉一致。"
        }
      ],
      "pitfalls": [
        {
          "title": "include 用了 <%= 导致 HTML 被转义成文本",
          "text": "<%= 输出转义后的值——用它 include 另一个模板，渲染好的 HTML 标签会全部变成 &lt;div&gt; 这样的可见文本。官方示例里 include 一律配 <%-（原始输出）：include 的内容本来就是自己模板渲染的 HTML，不存在「用户输入」，二次转义纯属事故。"
        },
        {
          "title": "模板里裸写未定义变量，页面直接 500",
          "text": "locals.foo 对未定义的 foo 温和地返回 undefined；裸 foo 抛引用错误、整页渲染失败。条件渲染没传值的变量时，用 locals.users 这类前缀写法判断存在性（官方 Putting it together 示例的 if (locals.users) 就是这个用法）。"
        },
        {
          "title": "忘了 app.set 就去 res.render",
          "text": "res.render 依赖 views（去哪找模板）与 view engine（用什么引擎解析）两个应用属性——少设任何一个，渲染就报「找不到模板」或引擎相关错误。设置属于脚手架：建项目时一次写好，之后每个模板都靠它。"
        },
        {
          "title": "静态资产 404：忘了 express.static 或路径写错",
          "text": "模板里 link 了 /styles.css 却不生效，多半是 express.static('public') 中间件没挂、或文件不在 public 目录下。中间件要以 public 为根、URL 路径是相对该根的（href=\"/styles.css\" 对应 public/styles.css）。"
        }
      ],
      "official": {
        "assignment": [
          "再通读一遍 EJS 文档",
          "读 Express 的模板引擎资源——示例用 Pug（语法不同），但信息对本课是有用的补充",
          "给一直开发的应用加一个 about 页面视图，在 /about 路由渲染",
          "创建一个可复用的 footer 模板，渲染进应用的所有路由"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "LogRocket《How to Use EJS to Template Your Node.js Application》"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/express/views.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "1f103cfd4f29ac336c34c89293211fc1e5fd19719917cd29661ce2dfb4891f05",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "node-path-nodejs-mini-message-board",
      "title": "Project: Mini Message Board",
      "zh": "项目：迷你留言板",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-nodejs-mini-message-board",
      "summary": "Express 前半程的收官项目（全站第 26 门 Project）：官方说你现在应该已经能用 Express 做出一些有趣的交互式 Web 应用了——那就做一个留言板。两条路由：首页 /（列出全部留言）与「写新留言」表单页 /new；留言存在 index 路由器顶部的一个数组里（每条含文本、用户名、添加时间三个字段），服务器一重启就清空——官方明说这是临时的，下一课学部署、章末学数据库后它会获得持久化。13 步官方路线把 Express 前半程的每个知识点都点了一遍卯：搭 Express + EJS 骨架 → 两条路由 → 样例数据数组 → index 模板循环渲染（locals 传数据）→ form 模板（method POST + action /new）→ router.post → express.urlencoded 解析表单进 req.body → push 进数组 → res.redirect 回首页 → 验证全流程 → 给每条留言加「查看」入口跳详情页 → push 上 GitHub → 下一课部署后回来提交。",
      "guide": "以下是官方项目要求的中文化与拆解。**官方开场**：到这里，你应该已经懂得足够多、能用 Express 做出一些**有趣的交互式 Web 应用**了！我们要创建一个**留言板（message board）**。**第 1 步：搭骨架**——安装 Express 与 EJS，搭建一个基本的 index 路由并跑起服务器；按前面几课讲过的结构创建所需的文件夹与文件（routes/、views/、controllers/ 等）。**第 2 步：两条路由**——应用共两条路由：**首页 \"/\"** 与**「写新留言」表单页 \"/new\"**。**第 3 步：样例数据**——在 **index 路由器的顶部**创建一个叫 **messages** 的数组，放几条样例留言进去；每条留言是一个对象，含三个字段：**text（文本）、user（用户名）、added（添加时间，new Date()）**——官方给了两条样例（\"Hi there!\" / Amando 与 \"Hello World!\" / Charles）。**第 4 步：index 模板循环渲染**——在 views 里的 index 模板中**遍历 messages 数组**，每条显示**用户名、文本和添加日期**；别忘了把 messages 放进 res.render 的 **locals 对象**让模板能拿到（官方示例形态：res.render(\"index\", { title: \"Mini Messageboard\", messages: messages })）。**第 5 步：表单页**——路由器里给 **\"/new\"** 加一个 **router.get()**、指向名叫 **\"form\"** 的模板；views 目录里创建 form 模板：一个标题、**2 个输入框**（作者名 + 留言文本）、一个提交按钮。要让表单发起网络请求，必须给它定义 **method 与 action** 两个属性：**method=\"POST\"、action=\"/new\"**（表单处理的原理后面「表单与数据处理」一课才细讲，现在照做即可）。**第 6 步：POST 路由**——表单这样设置后，点提交按钮会向 action 指定的 URL 发 **POST** 请求——回到 index 路由器，给 **\"/new\"** 加一个 **router.post()**。**第 7 步：解析表单数据**——要在 router.post() 里取用表单内容，需要访问一个叫 **req.body** 的对象：body 里的字段名来自**输入框的 name 属性**（<input name=\"messageText\"> 的值会出现在 req.body.messageText）。要让这套机制工作，需要一个应用级 Express 中间件 **express.urlencoded()** 把表单数据解析进 req.body——在应用设置里加一行（官方给了这行代码的形态：app.use 调 express.urlencoded 并传 { extended: true }）。**第 8 步：存数据**——在 router.post() 里把表单提交的内容 **push 进 messages 数组**，新对象与第 3 步的样例同构（text、user、added: new Date()）。**第 9 步：重定向**——router.post() 的末尾用 **res.redirect(\"/\")** 把用户送回首页。**第 10 步：验证全流程**——此时访问 /new（在首页加个通往它的链接是个好主意）、填表、提交，然后应该能在首页看到新留言！**第 11 步：详情页**——给每条留言旁边加一个「打开（open）」按钮或链接，点开进入显示该条留言详情的新页面。**第 12 步：push 上 GitHub**。**第 13 步：部署预告**——下一课学怎么把应用部署上线；别忘了完成后回来把它提交到本页下方的 submissions。**数据是临时的**：messages 数组活在内存里，服务器一重启就回到样例状态——这正是章末「使用 PostgreSQL」一课 Assignment 第 3 条要回来解决的（官方在那里明说：给留言板加上真正的持久化）。**本站验收清单（非官方，供自查）**：① 首页列出全部留言（含样例与你新发的），每条显示用户名、文本、日期；② /new 表单填两项、提交后回到首页且新留言出现在列表里；③ 连续发多条都正常；④ 每条留言的「打开」入口能进详情页、内容正确；⑤ 刷新首页留言还在（进程未重启期间）；⑥ 重启服务器后回到样例数据（预期行为，不是 bug）；⑦ 项目已 push 到 GitHub。",
      "understand": [
        "这是 Express 前半程的**总装演练**：路由（GET+POST）、模板渲染（locals）、表单（method/action）、body 解析中间件（urlencoded）、重定向（PRG 的雏形）一课一个知识点、全部上场",
        "**两条路由**：GET / 列出留言、GET /new 出表单、POST /new 收表单——同一对路径两个动词干两件事，是路由课「动词 + 路径」的直接应用",
        "**req.body 的字段名 = 输入框的 name 属性**；没有 express.urlencoded 中间件，req.body 就是空的",
        "数据存在**内存数组**里——服务器重启即清空；「临时」是官方设计好的教学台阶，章末用 PostgreSQL 回来补持久化",
        "**res.redirect(\"/\")** 收尾：提交后回首页看结果——这就是「表单与数据处理」一课要正式讲的 PRG 模式的手工版"
      ],
      "terms": [
        {
          "en": "Message board",
          "zh": "留言板：用户提交短消息、所有人可见的应用形态——本项目与章末持久化改造的共同载体"
        },
        {
          "en": "req.body",
          "zh": "请求体对象：POST 表单数据的入口——字段名来自输入框的 name 属性；须先挂 express.urlencoded 中间件才有内容"
        },
        {
          "en": "express.urlencoded",
          "zh": "解析表单数据的内置中间件：把 x-www-form-urlencoded 的请求体解析进 req.body——官方指定传 { extended: true }"
        },
        {
          "en": "res.redirect",
          "zh": "重定向响应方法：提交完成后把用户送回指定路径（本项目回首页）——避免刷新重复提交的 PRG 模式雏形"
        },
        {
          "en": "Ephemeral data",
          "zh": "临时数据：活在内存里、进程重启即失的数据——本项目 messages 数组的现状，也是数据库课要解决的问题"
        }
      ],
      "tasks": [
        "搭建基本 Express 应用：安装 Express 与 EJS，设置基本的 index 路由并跑起服务器；按前面课程讨论过的结构创建所需文件夹与文件",
        "规划两条路由：首页 \"/\" 与「写新留言」表单页 \"/new\"",
        "在 index 路由器顶部创建 messages 数组，放几条样例留言——每条是含 text（文本）、user（用户名）、added（new Date()）三个字段的对象",
        "在 views 的 index 模板里遍历 messages 数组，每条显示用户名、文本与添加日期；把 messages 放进 res.render 的 locals 对象（例如连同 title 一起传）",
        "给 \"/new\" 加 router.get() 指向 form 模板；创建该模板：标题 + 2 个输入框（作者名、留言文本）+ 提交按钮；表单要定义 method 与 action 两属性（POST 到 /new）才会发网络请求",
        "点提交会向 action 的 URL 发 POST 请求——回 index 路由器给 \"/new\" 加 router.post()",
        "用 req.body 取表单数据（字段名 = 输入框的 name 属性）；并在应用设置里加 express.urlencoded 中间件（传 { extended: true }）把表单解析进 req.body",
        "在 router.post() 里把提交内容 push 进 messages 数组（与样例对象同构：text、user、added）",
        "router.post() 末尾用 res.redirect(\"/\") 把用户送回首页",
        "验证全流程：访问 /new（首页加个链接是好主意）、填表、提交，回首页应看到新留言",
        "给每条留言加一个「打开」按钮或链接，进入显示该留言详情的新页面",
        "把项目 push 到 GitHub",
        "下一课学部署——完成后别忘了回来把作品提交到官方课页的 submissions"
      ],
      "quiz": [
        {
          "question": "表单要怎么定义才会在提交时向服务器发网络请求？提交的 POST 会去哪里？",
          "answer": "form 元素必须同时定义 method 与 action 两个属性：method=\"POST\" 指定动词，action=\"/new\" 指定目标 URL。点提交按钮后，浏览器向 action 指定的路径发 POST 请求——所以路由器里要有配对的 router.post(\"/new\")。"
        },
        {
          "question": "req.body.messageText 这个字段名是从哪来的？req.body 是空对象时最可能漏了什么？",
          "answer": "字段名来自对应输入框的 name 属性（<input name=\"messageText\"> → req.body.messageText）。req.body 为空最可能是没挂 express.urlencoded({ extended: true }) 中间件——Express 原生不解析表单数据，没有它 req.body 里什么都没有。"
        },
        {
          "question": "为什么提交成功后要 res.redirect(\"/\")，而不是直接在 POST 处理器里 res.render 首页？服务器重启后留言去哪了？",
          "answer": "重定向让用户回到干净的 GET 首页（刷新也不会重复提交表单——这正是后面 PRG 模式要正式讲的思想）；直接 render 会让页面停留在 POST 响应上。留言消失是预期行为：messages 是内存数组（临时数据），进程重启即清空——章末用 PostgreSQL 回来补持久化。"
        }
      ],
      "optional": [],
      "note": "Project 红线课：本站不提供成品代码，examples 为空数组——官方步骤里自带的脚手架（样例数组的字段结构、表单属性、urlencoded 中间件行、push 语句形态）已全部转述为文字要求，照着描述自己写正是练习本体。这是全站第 26 门 Project 课。留言板的下半场在章末：「部署」一课的 Assignment 就是把它部署上线；「使用 PostgreSQL」一课的 Assignment 第 3 条会把 messages 数组换成真数据库（官方原话：我们要的是数据持久化）。",
      "why": "MVC 三课（路由/控制器/视图）学完，你需要一个把它们焊在一起的项目——留言板就是那块焊点：GET 与 POST 一对路由、两个模板、一个内存数组，五脏俱全但体量克制。它还是整章的「贯穿载体」：下一课部署的就是它，章末给它接数据库的还是它——同一个应用一路进化，你能亲眼看到每一课给项目添了什么。表单处理此时只教了「怎么用」，「为什么这样用」（urlencoded、PRG、校验）在 forms 一课补全——先动手后理论，是官方的刻意安排。",
      "sections": [
        {
          "h": "这是个什么项目",
          "p": [
            "官方开场：到这里你应该已经懂得足够多、**能用 Express 做出一些有趣的交互式 Web 应用**了！我们要创建一个**留言板**。",
            "应用形态：首页列出全部留言（用户名、文本、日期）；一个「写新留言」的表单页；提交后回首页、新留言出现在列表里；每条留言还有详情页。数据暂存内存数组——**服务器一重启就清空**，这是官方设计的教学台阶（章末接上 PostgreSQL 补持久化）。"
          ]
        },
        {
          "h": "第 1–2 步：骨架与两条路由",
          "p": [
            "**搭骨架**：安装 **Express 与 EJS**，设置一个基本的 index 路由、跑起服务器；按前面几课讨论过的结构创建所需**文件夹与文件**。",
            "**两条路由**：首页 **\"/\"** 与「写新留言」表单页 **\"/new\"**——整个应用的骨架就这两条路径（各配 GET，/new 再配一条 POST）。"
          ]
        },
        {
          "h": "第 3–4 步：样例数据与首页渲染",
          "p": [
            "在 **index 路由器顶部**创建 **messages** 数组，放几条样例留言。每条留言是一个对象、含三个字段：**text**（文本）、**user**（用户名）、**added**（添加时间，用 new Date()）——官方给了两条样例（Amando 的 \"Hi there!\" 与 Charles 的 \"Hello World!\"）。",
            "在 **index 模板**（views 文件夹里）**遍历 messages 数组**：每条显示**用户名、文本和添加日期**。别忘了通过 res.render 的 **locals 对象**把 messages 交给模板——官方示例形态：连同 title: \"Mini Messageboard\" 一起传入。"
          ]
        },
        {
          "h": "第 5–6 步：表单页与 POST 路由",
          "p": [
            "路由器里给 **\"/new\"** 加一个 **router.get()**、指向名叫 **\"form\"** 的模板；views 目录里创建 form 模板：一个**标题**、**2 个输入框**（一个作者名、一个留言文本）、一个**提交按钮**。",
            "要让表单发起网络请求，必须同时定义 **method 与 action**：method 用 **POST**、action 指向 **/new**（表单处理的原理「表单与数据处理」一课细讲，现在照做即可）。",
            "表单这样设置后，点提交按钮就会向 action 指定的 URL 发 **POST 请求**——所以回到 index 路由器，给 **\"/new\"** 加一个 **router.post()**。"
          ]
        },
        {
          "h": "第 7–9 步：req.body、存数据、重定向",
          "p": [
            "**取表单数据**：在 router.post() 里通过一个叫 **req.body** 的对象访问表单内容；body 里的字段名**来自输入框的 name 属性**（name=\"messageText\" 的输入框 → req.body.messageText）。要让这套机制工作，需要挂一个应用级中间件 **express.urlencoded()** 把表单数据解析进 req.body——在应用设置里加一行（官方给了代码形态：app.use 调它并传 { extended: true }）。",
            "**存数据**：把表单提交的内容 **push 进 messages 数组**——新对象与样例同构（text、user、added: new Date()）。",
            "**收尾**：router.post() 末尾用 **res.redirect(\"/\")** 把用户送回首页。"
          ]
        },
        {
          "h": "第 10–13 步：验证、详情页、上线预告",
          "p": [
            "**验证**：访问 /new（在首页加个通往它的链接是个好主意）、填表、提交——然后应该能在首页看到它！",
            "**详情页**：给每条留言旁边加一个**「打开（open）」按钮或链接**，点开进入显示该条留言详情的新页面。",
            "**push 到 GitHub**；**下一课学部署**——官方原话：别忘了完成后回来把作品提交到本页下方的 submissions。",
            "**本站自拟验收清单（非官方要求，供自查）**：① 首页列出全部留言、每条含用户名/文本/日期；② /new 提交后回首页且新留言在列；③ 连续多条正常；④ 详情页可达且内容正确；⑤ 进程不重启期间刷新留言仍在；⑥ 重启后回到样例数据（预期行为）；⑦ 已 push GitHub。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "表单忘了 method 或 action",
          "text": "两个属性缺一个，表单就不会按预期发 POST：没有 action 提交回当前 URL、没有 method 默认走 GET——你的 router.post(\"/new\") 永远收不到请求。官方把「定义 method 与 action」单独写成一步，就是因为它是最常见的卡点。"
        },
        {
          "title": "没挂 express.urlencoded 就去读 req.body",
          "text": "Express 原生不解析表单数据——没有 app.use(express.urlencoded({ extended: true })) 这行，req.body 是空对象，push 进数组的全是 undefined。字段名对不上也是同族问题：req.body 的键严格等于输入框的 name 属性。"
        },
        {
          "title": "模板里忘了传 messages",
          "text": "index 模板遍历的 messages 来自 res.render 第二参数的 locals 对象——只改模板不改 render 调用，循环拿到的是未定义变量（裸写还会直接引用错误，Views 课的 tip 应验）。数据和模板要一起改。"
        },
        {
          "title": "把「重启后留言消失」当 bug 修",
          "text": "messages 数组活在内存里、进程重启即清空——这是官方设计好的现状（下一站就是数据库课）。此时自己发明文件存储之类的方案属于超纲绕路；章末「使用 PostgreSQL」的 Assignment 会正式带你把它改成持久化。"
        }
      ],
      "official": {
        "assignment": [
          "搭建基本 Express 应用：安装 Express 与 EJS，设置基本 index 路由并跑起服务器，创建所需文件夹与文件",
          "应用共两条路由：首页 \"/\" 与「写新留言」表单页 \"/new\"",
          "在 index 路由器顶部创建 messages 数组并放入样例留言（text / user / added 三字段对象）",
          "index 模板遍历 messages、每条显示用户名/文本/日期；messages 经 res.render 的 locals 对象传入",
          "给 \"/new\" 加 router.get() 指向 form 模板；模板含标题、2 个输入框（作者名与留言文本）、提交按钮；表单定义 method 与 action（POST 到 /new）",
          "给 \"/new\" 加 router.post() 接住表单提交",
          "用 req.body 取表单数据（字段名来自输入框 name 属性）；应用设置里加 express.urlencoded({ extended: true }) 中间件",
          "router.post() 里把提交内容 push 进 messages 数组",
          "router.post() 末尾 res.redirect(\"/\") 送用户回首页",
          "验证：访问 /new、填表、提交，首页出现新留言（首页加 /new 链接是好主意）",
          "每条留言加「打开」按钮或链接，进入留言详情页",
          "把项目 push 到 GitHub",
          "下一课学部署——完成后回来把作品提交到 submissions"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/express/project_mini_message_board.md（本站自行编写简体讲解与任务拆解，未改编自任何第三方中文课程；Project 红线：不提供成品答案）",
        "sha256": "c1166c57a18dfa4ea1054f4cbc2767d1a6c1d3e741206b0033ce79802ac942f1",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "node-path-nodejs-deployment",
      "title": "Deployment",
      "zh": "部署",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-nodejs-deployment",
      "summary": "把作品展示给世界的一课：无论为分享朋友、给未来雇主建作品集还是上线一门生意，应用都得托管在公网上可访问的地方——部署（deployment）就是让应用跑在云端 hosting provider 那里。四块主干：① 托管商是「服务器房东」——你已用过 GitHub Pages（免费托管静态页），但它跑不了动态 Node 应用；Netlify 与 Vercel（React 课用过）同样不具备运行 Node 服务器与数据库的能力——它们不是后端的正确工具。② 静态 vs 动态网站：静态 = 预写好的 HTML、人人看到相同内容（HTML/CSS/JS 三件套足够）；动态 = 内容随访问者变化（X/Twitter 的时间线按关注对象不同而不同），需要服务端应用 + 数据库。③ PaaS（平台即服务）：对新手更友好的托管商类型——替你管掉底层服务器的琐碎细节（房东包了水电、楼体维护与安保，你只管装修入住）；PaaS 给你三样 Node 应用离不开的资源：instances（虚拟「计算机」，一个实例 = 应用同时运行的一份拷贝，多实例扛更多流量；多数应用单实例足够）、databases（替你建库配置、自动备份、打安全补丁——「凌晨 4 点被报警吵醒、库挂了还没备份」的噩梦由此避免）、domain names（首次部署送随机域名，如 Heroku 风格的 afternoon-falls-4209；域名在应用在平台一天就归你；想要自定义域名去 Porkbun/NameSilo 这类注册商买、用 Domainr 找，再按平台文档指过去——课程作品集项目用随机域名完全够）。④ 官方推荐名单（免费层都很有限，故推荐一组而非一家）：Railway（服务器+数据库，按用量付费，$5/月约可托管 4 个应用；免费试用一次性 $5 额度、不休眠）、Render（服务器+数据库，每月 750 免费小时、15 分钟不活跃自动休眠；数据库单算、最低配 $7/个）、Neon（仅数据库，主库 24/7、10 项目各 0.5GiB、免信用卡）、Aiven（仅数据库，5GiB 存储、全服务 24/7、免信用卡）——Heroku 的免费层已于 2022 年停止。⑤ 排障：部署中与部署后是两个高发时段——Node 版本兼容性（用 package.json 的 engines 声明）、部署时看 build logs 找错、部署后 500 页看应用日志（生产错误页故意含糊：不吓用户也不给攻击者送情报）、应用长大后用 Sentry 这类错误跟踪服务、最新部署坏了就回溯到上一个能跑的版本再逐步重放改动（git log 与 git checkout 的本事在这里开始回本）。Assignment：把 Mini Message Board 部署到任一推荐托管商（免费选项都满足课程需要——重点是获得部署经验，不必看懂每一步）。",
      "guide": "以下是官方原课的中文化梳理。**为什么要部署**：继续 Web 开发之旅前，必须解决一件大事——**把辛苦做出来的东西展示给世界**。无论是与朋友分享创作、给未来雇主建作品集，还是启动一门线上生意，我们都需要把应用**托管在公网上任何人都能访问的地方**。本课学习把应用部署到 **hosting provider（托管服务商）**——让我们在云端运行、构建与运营 Web 应用。**① 什么是托管商**：托管商就像**服务器房东（server landlords）**：他们拥有服务器、把空间租给客户，客户用这些空间存放网站、让全网可访问。你其实已经用过托管商——课程早先往 **GitHub Pages** 部署过项目。GitHub Pages 免费托管**静态**网页很棒，但**没法用来托管我们的动态 Node 应用**——需要更强大的东西。**② 静态 vs 动态网站**：**静态网站**由**预先写好的 HTML 页面**组成——「静态」是因为**每个访问者看到的内容都一样**；建静态站只需要 HTML、CSS 和 JavaScript。**动态网站**的内容**能随访问的用户变化**——X（前 Twitter）是好例子：每个人的首页时间线都随关注对象不同而不同。建动态站同样需要 HTML/CSS/JS，但**额外需要服务端应用与数据库**。正是这些额外技术让我们**没法用 GitHub Pages 托管 Node 应用**：它跑不了 Node.js 应用、也没有数据库服务。同理，**Netlify 与 Vercel**（React 课你可能用过）也**不具备运行我们 Node 服务器与数据库的能力**——它们不是后端的正确工具。好在很多托管商提供我们需要的全部：从大而复杂的云厂商（**AWS、Google Cloud、Microsoft Azure**）到对新手更友好的 **PaaS（platform as a service，平台即服务）**供应商（**Railway 与 Render**）——本课聚焦后者。**③ 什么是 PaaS**：PaaS 是一种特定类型的托管商。最重要的认知：**它们对其他类型托管商而言易用得多、对新手友好得多**——它们**替你管理底层服务器基础设施的大量低级琐碎细节**，让开发者把时间花在构建应用上、而不是配置管理服务器上。延续房东比喻：**PaaS 像一个包办水电、楼体维护与安保的房东**；你（开发者）只管装修、布置与入住。这个模式极其强大、正适合现阶段：用 PaaS 部署，我们能**专注学习与精通 Node**，不必大幅绕道去学自己管理维护服务器的专业知识。**④ PaaS 怎么工作**：PaaS 给你三样任何 Node 应用在 Web 上都离不开的资源。**Instances（实例）**：运行你应用的虚拟「计算机」——**一个实例 = 你的应用同时运行的一份拷贝**，就像 Localhost 上用一台计算机跑应用；**多实例 = 同时跑多份拷贝、扛更多流量**。对你的大多数应用，**一个实例绰绰有余**——单实例就能支撑很大流量；后面推荐的很多 PaaS 第一个实例免费。官方 note：服务器实例与数据库实例可以放同一家 PaaS、也可以分开用两家——用付费套餐时分开甚至可能更省钱。**Databases（数据库）**：PaaS 让你**轻松为每个应用旋起一个新数据库**——全部设置与配置替你办好。很多供应商还**替你管理数据库**：自动备份、保证打上最新的关键安全补丁、持续维护让库平稳运行。这份安心怎么强调都不过分——你绝不想落到「凌晨 4 点被连环报警吵醒：数据库因为某个忘打的安全补丁出了故障、而且没有备份可回退」的境地。很多 PaaS 服务自带 SQL 数据库。官方 encouragement：现在就可以试着**只用本课所学把 mini-message-board 项目部署出去**。**Domain names（域名）**：首次部署时 PaaS 会给你一个**随机域名**——Heroku 的风格是「afternoon-falls-4209」这种禅意名字，访问 http://afternoon-falls-4209.herokuapp.com 就能看到应用活在网上。随机域名**只要应用还活在该平台上就一直是你的**（每个应用一个唯一域名）。现实中你会想绑定自己的自定义域名（如 mycooldomain.com）；不过官方明说：**课程里的作品集项目不需要自定义域名**——PaaS 给的随机域名完全够用。真想折腾：先去注册商（**Porkbun 或 NameSilo**）买域名，找新域名可以试 **Domainr**；买到后把它指向你的项目——各平台都有关于自定义域名的详尽文档。**⑤ 官方推荐的 PaaS 服务**：选 PaaS 曾经是个简单决定——**Heroku 有免费层**、想托管多少小应用都行，可惜 **2022 年他们停掉了免费层**。好在还有大量好选择；缺点是**免费层都很有限**。因此官方**推荐一组选项而非一家**：用不同供应商的组合，多数项目可以免费托管——代价是要多跑点腿（注册并熟悉几家）；如果预算允许，事情更简单：选一家深学、所有应用集中管理。**Railway.app**（可部署服务器与数据库）：部署流程方便——关联项目的 GitHub 仓库即可；**按用量付费**模式；**每月 $5 大约够托管 4 个应用**。免费计划：**一次性 $5 试用额度**、期间应用不活跃也**永不休眠**；30 天到期或 $5 用完后回落到受限试用（只能部署数据库）。**Render**（可部署服务器与数据库）：用 **Blueprints** 关联 GitHub 仓库部署；**每月 750 免费小时**足够不花钱托管几个应用；但**数据库单算**、最低配每个 **$7**——**每月 $21 够托管 3 个应用**（每个应用的库 $7）。免费计划：每月 750 小时；**15 分钟不活跃自动休眠**（所以 750 小时够整月托管几个应用）；同时只能有一个活跃的免费数据库、创建后 30 天过期；有官方 Node/Express 入门指南。**Neon**（仅数据库）：主库 **24/7**；额外 20 小时数据库分支；时间点恢复（24 小时）；**免信用卡**。免费计划：10 个项目、每项目 0.5GiB 存储、主计算 24/7；有官方 Node 连接指南。**Aiven**（仅数据库）：全部数据库服务 **24/7**；高可用与自动备份；时间点恢复（按服务而异）；**免信用卡**。免费计划：5GiB 存储、PostgreSQL/MySQL/Redis 各一个免费库；有官方 Node 连接指南。官方 tip（保管好机密！）：指南里的数据库连接配置只是样例——**不要把凭证直接存在代码里**；最佳实践回看「环境变量」一课。**⑥ 调试与排障部署**：错误是软件开发不可避免的一部分，**部署到托管商这种新环境时尤其爱冒头**。关键是**别慌，按冷静的分步流程排查**：多数情况你遇到的错误**成千上万的开发者早就遇到过**——文档充分，Google-fu 一下多半有解。部署流程有两个最容易出问题的阶段：**部署进行时**与**部署刚完成时**。**Node 版本兼容性**：不同托管商支持与默认选择的 Node 版本可能不同——查供应商文档；按代码用到的特性，可能需要在 **package.json 里用 engines 字段声明兼容的 Node 版本**。**部署时**：遇到错误先看 **build logs（构建日志）**——启动部署后看到的那串输出就是。滚动找到出错点：它在输出里通常很扎眼、长得就像你见过的 JS/Node 堆栈跟踪——错误输出会告诉你到底哪错了。看不懂就把错误**复制粘贴进搜索引擎**——大概率找到带解法的 Stack Overflow 帖子；搜不出结果可以去 Discord 求助。这个阶段的大多数错误与**「按托管商要求正确设置应用」**有关——**重读该托管商的部署指南**永远是好起点：漏一步或打错字太容易了。**部署后**：部署成功了、一切顺风顺水……然后你访问应用，迎面撞上可怕的 **500 页面**。没什么比 500 页更让开发者血压上升——它几乎可能意味着任何事。**生产环境的错误页是故意含糊的**：一来让用户知道出错了、又不被技术术语淹没；二来**防止攻击者利用系统错误信息做文章**。诊断工具：**application logs（应用日志）**——应用运行时的输出，实时记录所有进来的请求与数据库查询。遇到 500 就打开日志、盯紧它、同时在浏览器刷新页面复现错误——日志要么直接告诉你问题、要么给出深挖的线索。**更进阶**：应用长大后可以用 **Sentry** 这类错误跟踪服务——漂亮的界面、错误发生即通知、附带引发错误的请求详情，省大量时间；但配置使用超出本课范围——**头几个应用靠日志完全够**。**最后一招**：如果最新的部署坏了、而之前的部署是好的——**回溯到上一个能跑的版本**，弄清你改了什么，需要时再慢慢把改动逐个放回。这正是 Git 功夫开始回本的地方：**git log** 看最近改动历史、**git checkout** 快速回到之前的可跑版本。**Assignment 一条（含两个官方子项）**：把你的 **Mini Message Board 项目**部署到课上提到的任一托管商——**任何免费选项都满足课程需要**，选哪家无所谓；第一次部署的重要收获是**获得部署经验**——不必弄懂发生的每件事，理解会随时间到来。子项：**用你选的 PaaS 的部署指南链接**帮你走完流程；部署不顺就回看本课 **Debugging and Troubleshooting Deployments** 一节找提示。**补充资料**：free-for.dev——SaaS/PaaS/IaaS 等免费开发者层服务的巨大名录。",
      "understand": [
        "**部署 = 把应用托管到公网可访问的地方**；托管商是「服务器房东」——租空间给你放网站",
        "**静态站**（预写 HTML、人人同内容，GitHub Pages 够用）vs **动态站**（内容随访问者变化，需要服务端应用 + 数据库）——**GitHub Pages / Netlify / Vercel 都跑不了 Node 后端**",
        "**PaaS = 包办底层琐事的托管商**（房东管水电安保、你管装修入住）——给你三样资源：**instances**（虚拟计算机，单实例对多数应用足够）、**databases**（自动备份 + 安全补丁 + 维护）、**domain names**（随机域名够用，自定义域名去注册商买再指向）",
        "官方推荐名单（Heroku 免费层 2022 年已停）：**Railway**（服务器+库，$5/月约 4 应用，一次性 $5 试用）/ **Render**（750h/月，15 分钟休眠，库 $7/个）/ **Neon** 与 **Aiven**（仅数据库，免信用卡）——免费层都有限，组合使用可零成本托管多数项目",
        "排障两个高发时段：**部署时看 build logs**（错误像堆栈跟踪、搜索引擎多半有解、重读部署指南）；**部署后 500 看 application logs**（生产错误页故意含糊：不吓用户、不给攻击者送情报）",
        "**Node 版本兼容性**：各平台支持版本不同，用 package.json 的 **engines** 声明；最新部署坏了就 **git 回溯**到上一个可跑版本再逐步重放改动"
      ],
      "terms": [
        {
          "en": "Hosting provider",
          "zh": "托管服务商：拥有服务器并出租空间的「服务器房东」——把网站放上去即可全网访问"
        },
        {
          "en": "PaaS (Platform as a Service)",
          "zh": "平台即服务：替你管理底层服务器基础设施的托管商类型——对新手友好；代表：Railway、Render（曾代表 Heroku，免费层 2022 年停）"
        },
        {
          "en": "Instance",
          "zh": "实例：运行应用的虚拟「计算机」——一个实例是应用同时运行的一份拷贝；多实例扛更多流量，多数应用单实例足够"
        },
        {
          "en": "Static / Dynamic site",
          "zh": "静态站（预写 HTML、人人同内容）与动态站（内容随访问者变化、需服务端应用与数据库）——部署工具选型的分水岭"
        },
        {
          "en": "Build logs / Application logs",
          "zh": "构建日志（部署时输出的错误线索）与应用日志（运行时实时记录请求与查询——部署后 500 的第一诊断工具）"
        },
        {
          "en": "engines (package.json)",
          "zh": "package.json 字段：声明项目兼容的 Node 版本——各托管商默认版本不同，特性依赖新版本时必须声明"
        },
        {
          "en": "Sentry",
          "zh": "错误跟踪服务：界面化追踪与通知应用错误、附请求详情——应用长大后的进阶工具，头几个应用靠日志即可"
        }
      ],
      "tasks": [
        "把你的 Mini Message Board 项目部署到本课提到的任一托管商——任何免费选项都满足课程需要，选哪家无所谓；第一次部署的重要收获是获得部署经验，不必弄懂发生的每件事（理解会随时间到来）",
        "用你选的 PaaS 供应商的部署指南（课内给了各家链接）帮你走完整个流程",
        "部署不顺时，回看本课「Debugging and Troubleshooting Deployments」一节找提示"
      ],
      "quiz": [
        {
          "question": "为什么 GitHub Pages、Netlify、Vercel 都不能托管本课的 Node 应用？静态与动态网站的分界在哪？",
          "answer": "静态站是预写好的 HTML、人人看到相同内容（HTML/CSS/JS 三件套足够），GitHub Pages 只干这个；动态站的内容随访问者变化，需要服务端应用与数据库——GitHub Pages 跑不了 Node.js 应用也没有数据库服务，Netlify 与 Vercel 同样不具备运行 Node 服务器与数据库的能力。官方原话：它们不是后端的正确工具。"
        },
        {
          "question": "用房东比喻说明 PaaS 与普通托管的分工。PaaS 给 Node 应用的三样关键资源是什么？",
          "answer": "PaaS 像包办水电、楼体维护与安保的房东，你（开发者）只管装修、布置与入住——底层服务器的低级琐碎细节它替你管。三样资源：instances（运行应用的虚拟计算机）、databases（替你建库配置、自动备份、打安全补丁）、domain names（首次部署送的随机域名；应用活着一天域名归你一天）。"
        },
        {
          "question": "部署后访问应用撞见 500 页面——为什么生产环境的错误页故意做得含糊？你的第一诊断工具是什么？",
          "answer": "两个原因：让用户知道出错了而不被技术术语淹没；防止攻击者利用系统错误信息做文章。第一诊断工具是 application logs（应用日志）：它实时记录所有进来的请求与数据库查询——打开日志、盯紧它、同时刷新页面复现错误，日志会直接给出问题或深挖线索。"
        },
        {
          "question": "「最新一次部署坏了、之前的部署是好的」——官方给的标准动作是什么？哪些既有技能在这里回本？",
          "answer": "回溯到上一个能跑的版本，弄清改了什么，需要时再把改动慢慢逐个重放回去。Git 功夫在此回本：git log 看最近改动历史、git checkout 快速回到可跑版本——官方原话：这会为你省下巨量时间。"
        },
        {
          "question": "课程作品集项目需要买自定义域名吗？官方推荐一家 PaaS 还是推荐一组？为什么？",
          "answer": "不需要——官方明说 PaaS 送的随机域名对课程作品集项目完全够用。推荐一组（Railway/Render/Neon/Aiven）而非一家：Heroku 免费层 2022 年停掉后，剩下的免费层都很有限——组合使用不同供应商能免费托管多数项目，代价是要注册熟悉几家；预算允许则可选一深学、集中管理。"
        }
      ],
      "optional": [],
      "note": "本课价格与免费层细节（Railway 一次性 $5、Render 750 小时与 $7 数据库、Neon 0.5GiB、Aiven 5GiB 等）均为官方原文照录——PaaS 定价随时间变化是常态，动手部署前以各家官网现价为准；官方也明说「它们都随时可能变」。数据库连接凭证不要硬编码进代码——官方 tip 回指「环境变量」一课，那里学的 .env 与 process.env 正是为这一刻准备的。",
      "why": "从 World 2 的 GitHub Pages 到现在，你的作品第一次真正「上线」——有公网 URL、能发给任何人看。这一课也是作品集从「本地跑给你自己看」到「雇主点开就能玩」的转折点：求职章（World 8）会告诉你部署过的项目在简历上值多少分。排障部分尤其值得细读：build logs 与 application logs 的分工、500 页的含糊哲学、git 回溯法——这些不是部署专属技能，而是整个后端职业生涯的日常。",
      "sections": [
        {
          "h": "为什么要部署：托管商是服务器房东",
          "p": [
            "继续 Web 开发之旅前，必须解决一件大事——**把我们的辛苦成果展示给世界**。无论为与朋友分享创作、给未来雇主建作品集，还是启动线上生意，我们都需要把应用**托管在公网上他人可以访问的地方**。",
            "本课学习把应用部署到 **hosting provider**——在云端运行、构建与运营 Web 应用。托管商就像**服务器房东**：他们拥有服务器、把空间租给客户存放网站、让全网可访问。",
            "你已经有过使用托管商的经验——课程早先往 **GitHub Pages** 部署过项目。它免费托管**静态**网页很棒，但**托管不了我们的动态 Node 应用**——需要更强大的东西。"
          ]
        },
        {
          "h": "静态 vs 动态：为什么 Pages/Netlify/Vercel 不行",
          "p": [
            "**静态网站**由**预先写好的 HTML 页面**组成——「静态」因为**每个访问者看到相同内容**；只需要 HTML、CSS 和 JavaScript。",
            "**动态网站**的内容**能随访问用户变化**——X（前 Twitter）是好例子：每人的首页时间线随关注对象而不同。建动态站仍需要 HTML/CSS/JS，但**额外需要服务端应用与数据库**。",
            "正是这些额外技术让我们**没法用 GitHub Pages 托管 Node 应用**：它跑不了 Node.js、没有数据库服务。同理，**Netlify 与 Vercel**（React 课你可能用过）**不具备运行我们 Node 服务器与数据库的能力**——官方原话：它们不是我们后端的正确工具。",
            "好在很多托管商提供全部所需：从大而复杂的云厂商（**AWS、Google Cloud、Microsoft Azure**）到对新手更友好的 **PaaS（平台即服务）**供应商（如 **Railway 与 Render**）——本课聚焦后者。"
          ]
        },
        {
          "h": "PaaS：包办底层琐事的房东",
          "p": [
            "PaaS 是特定类型的托管商。最要紧的认知：**它们比其他托管商易用得多、对新手友好得多**——替你管理底层服务器基础设施的**大量低级琐碎细节**，让你把时间花在构建应用上、而不是配置管理服务器。",
            "延续房东比喻：**PaaS 像包办全部水电、楼体维护与安保的房东**；你（开发者）专注**装修、布置与入住**。",
            "官方定调：这个模式极其强大、正适合现阶段——用 PaaS 部署，能**专注学习与精通 Node**，不必大幅绕道去学自己管理维护服务器的专业知识。"
          ]
        },
        {
          "h": "PaaS 的三样资源：实例、数据库、域名",
          "p": [
            "**Instances（实例）**：运行应用的虚拟「计算机」。**一个实例 = 应用同时运行的一份拷贝**（像 Localhost 上单机跑应用）；**多实例 = 同时多份拷贝、扛更多流量**。对多数应用**一个实例绰绰有余**——单实例就能支撑很大流量；推荐的很多 PaaS 第一个实例免费。官方 note：服务器实例与数据库实例可在同一家 PaaS、也可分开两家——付费套餐时分开甚至可能更省。",
            "**Databases（数据库）**：PaaS **替你完成全部设置与配置**、轻松为每个应用旋起新库；很多供应商还**替你管库**：自动备份、持续打关键安全补丁、维护平稳运行。官方的安心论：这份安心怎么强调都不过分——你绝不想「凌晨 4 点被连环报警吵醒：数据库因忘打的安全补丁出故障、且无备份可回退」。很多 PaaS 自带 SQL 数据库。官方 encouragement：现在就可以试着只用本课所学**把 mini-message-board 部署出去**。",
            "**Domain names（域名）**：首次部署 PaaS 给**随机域名**——Heroku 风格是 afternoon-falls-4209 这种禅意名字；访问该域名就能看到应用活在网上。域名**在应用活着一天就归你一天**。现实中会想绑自定义域名（mycooldomain.com）；官方明说：**课程作品集项目不需要**——随机域名够用。真想折腾：去注册商（**Porkbun / NameSilo**）买域名、用 **Domainr** 找新域名，再按平台详尽文档把它指向项目。"
          ]
        },
        {
          "h": "官方推荐名单：四家 PaaS 与免费层现实",
          "p": [
            "背景：选 PaaS 曾是简单决定——**Heroku 免费层**想托管多少小应用都行，可惜 **2022 年停掉了**。好在选择仍多；缺点是**免费层都很有限**。所以官方**推荐一组而非一家**：组合使用可零成本托管多数项目（代价：注册并熟悉几家）；预算允许则选一深学、集中管理。",
            "**Railway.app**（服务器+数据库）：关联 GitHub 仓库即部署；**按用量付费**；**$5/月约托管 4 个应用**。免费计划：**一次性 $5 试用额度**、期间不休眠；30 天或额度用尽后回落受限试用（仅数据库）。",
            "**Render**（服务器+数据库）：**Blueprints** 关联 GitHub 仓库；**每月 750 免费小时**；数据库单算、最低配 **$7/个**——**$21/月约托管 3 个应用**。免费计划：750h/月；**15 分钟不活跃自动休眠**；同时仅一个活跃免费库、30 天过期；有官方 Node/Express 入门指南。",
            "**Neon**（仅数据库）：主库 **24/7**；20 小时数据库分支；时间点恢复（24h）；**免信用卡**。免费计划：10 项目、每项目 **0.5GiB**、主计算 24/7；有官方 Node 连接指南。",
            "**Aiven**（仅数据库）：全服务 **24/7**；高可用与自动备份；时间点恢复（按服务而异）；**免信用卡**。免费计划：**5GiB** 存储、PostgreSQL/MySQL/Redis 各一免费库；有官方 Node 连接指南。",
            "官方 tip（**保管好机密！**）：指南里的数据库连接配置只是样例——**不要把凭证直接存进代码**；最佳实践回看**「环境变量」**一课。"
          ]
        },
        {
          "h": "排障（上）：版本兼容与部署时错误",
          "p": [
            "错误是软件开发不可避免的一部分，**部署到托管商这种新环境时尤其爱冒头**。关键：**别慌，按冷静的分步流程来**——你遇到的错误多半**成千上万的开发者早就遇到过**、文档充分，Google-fu 一下常有解。部署流程有两个高发时段：**部署进行时**与**部署刚完成后**。",
            "**Node 版本兼容性**：各托管商支持与默认选择的 Node 版本可能不同——查供应商文档；按代码用到的特性，可能需要**在 package.json 里用 engines 字段声明项目兼容的 Node 版本**。",
            "**部署时**：先看 **build logs（构建日志）**——启动部署后看到的那串输出。滚动找到出错点：它通常很扎眼、长得像你见过的 JS/Node 堆栈跟踪——**错误输出会直接告诉你哪错了**。不认识就把错误**贴进搜索引擎**——大概率命中带解法的 Stack Overflow 帖；搜不出再去 Discord。此阶段多数错误与**按托管商要求正确设置应用**有关——**重读该托管商的部署指南**永远是好起点：漏步骤、打错字太容易了。"
          ]
        },
        {
          "h": "排障（下）：部署后的 500、Sentry 与 git 回溯",
          "p": [
            "**部署后**：部署成功、一切顺利……然后访问应用迎面撞上可怕的 **500 页面**。没什么比它更让开发者血压上升——它几乎可能意味着任何事。**生产环境的错误页是故意含糊的**：一来让用户知道出错了、不被技术术语淹没；二来**防止攻击者利用系统错误做文章**。",
            "第一诊断工具：**application logs（应用日志）**——应用运行时的输出，**实时记录所有进来的请求与数据库查询**。遇 500：打开日志盯紧、同时在浏览器刷新复现错误——日志要么直接说出问题、要么给出深挖线索。",
            "**进阶工具**：应用长大后用 **Sentry** 这类错误跟踪服务——界面漂亮、错误即通知、附引发错误的请求详情、省大量时间；但配置使用**超出本课范围**——**头几个应用靠日志完全够**。",
            "**最后一招**：最新部署坏了、而过去部署是好的——**回溯到上一个能跑的版本**、弄清改了什么、需要时把改动慢慢逐个放回。**Git 功夫从这里开始回本**：git log 看最近改动、git checkout 快速回到可跑版本——官方原话：这能省下巨量时间。"
          ]
        },
        {
          "h": "Assignment 与补充资料",
          "p": [
            "**Assignment 一条（官方含两个子项）**：把你的 **Mini Message Board 项目**部署到本课提到的任一托管商。**任何免费选项都满足课程需要**——选哪家无所谓；第一次部署的重要收获是**获得部署经验**，不必弄懂每件事（理解随时间到来）。子项：用你所选 PaaS 的**部署指南**走完流程；不顺时回看本课 **Debugging and Troubleshooting Deployments** 一节。",
            "官方补充资料：**free-for.dev**——SaaS、PaaS、IaaS 等带免费开发者层的软件服务的巨大名录（链接在资料区）。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "拿静态托管工具部署动态应用",
          "text": "GitHub Pages、Netlify、Vercel 在 React 时代是好伙伴，但它们跑不了 Node 服务器、没有数据库服务——官方点名「不是后端的正确工具」。部署 Node 应用认准能跑服务器实例的 PaaS（Railway/Render 等），选型第一步先看「静态还是动态」。"
        },
        {
          "title": "把凭证硬编码进代码再部署",
          "text": "官方 tip 用 critical 语气强调：指南里的数据库连接配置只是样例，不要把凭证直接存进代码——部署意味着代码进仓库、进平台构建流水线，硬编码的密码等于公开。连接信息走环境变量（.env + process.env），这是「环境变量」一课学的直接应用。"
        },
        {
          "title": "遇 500 只看页面不翻应用日志",
          "text": "生产错误页故意含糊（不吓用户、不给攻击者送情报）——盯着 500 页面本身永远得不到线索。正确动作：打开 application logs、盯紧它、同时刷新页面复现——日志实时记录请求与查询，要么直接给出问题、要么给出深挖方向。"
        },
        {
          "title": "忽略 Node 版本差异",
          "text": "本地新版 Node 跑得好好的、平台上老版本直接语法报错——各托管商默认 Node 版本不同。查平台文档、必要时在 package.json 用 engines 字段声明兼容版本，把「在我机器上能跑」变成「在任何机器上都能跑」。"
        }
      ],
      "official": {
        "assignment": [
          "把你的 Mini Message Board 项目部署到本课提到的任一托管商——任何免费选项都满足课程需要；第一次部署的重要收获是获得部署经验，不必弄懂每件事",
          "（官方子项）用你所选 PaaS 供应商的部署指南链接帮你走完流程",
          "（官方子项）部署遇到麻烦时，查看本课 Debugging and Troubleshooting Deployments 一节找提示"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "free-for.dev——SaaS/PaaS/IaaS 等带免费开发者层的服务大名录"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/express/deployment.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "fd761ba72eefb4981eb3017c06517b47ef2d4b8ef600c3d0646698a7c057bfc1",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "nodejs-forms-and-data-handling",
      "title": "Forms and Data Handling",
      "zh": "表单与数据处理",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/nodejs-forms-and-data-handling",
      "summary": "Express 章第二大的课（官方原文约 22KB）：表单怎么进服务器、数据怎么洗干净。前半理论四块：① HTML 表单复习——form 的 action（提交去哪个资源；不设或空串则提交回当前页 URL）与 method（POST 或 GET）；input 的 name 属性决定它在表单数据里的键名；POST 把敏感信息留在 URL 外（不进服务器日志）、是创建/更新数据的标准选择；GET 用于不改数据的表单（搜索类）或希望结果可收藏、可经 URL 分享的场景——数据以查询字符串随请求 URL 发送。② 表单处理流程与 PRG 模式——action 指向服务器端点→控制器处理→与数据库沟通→生成新视图并重定向客户端：Post/Redirect/Get 模式防重复 POST。③ 校验与净化——validation 确保输入符合标准（必填、格式），sanitization 清洗输入防恶意数据（移除或编码潜在恶意字符）；净化不一定在收到时做——有时用之前才做更合理；官方 note 交代 sanitization 一词的严格义（仅移除）与宽松义（移除+编码，本课采用）。④ 转义与 XSS——「About Me」里注入 <script>alert(\"Hacked!\")</script> 的未转义渲染就是跨站脚本攻击；转义（也叫编码）把 < 换成 &lt; 等 HTML 实体——EJS 里 <%= %> 就是转义输出；为什么不收到时就 .escape()？「危险字符」只在使用的地方、特定上下文里才危险：对 HTML 危险的对 SQL 未必危险——而且提前转义过的数据再经 <%= 输出会把 &lt; 原样显示成文本。express-validator 实战：body() 指定字段的校验与净化规则（.optional({ values: \"falsy\" }) 可选但仍校验格式）、链式校验（.trim().notEmpty().withMessage(...).isAlpha().withMessage(...)）、validationResult(req) 收集错误（非空则 400 + 把 errors.array() 渲染回模板）、matchedData(req) 取净化后的数据；路由对：GET /:id/update 出表单、POST /:id/update 收表单。后半 Putting it together 是一个完整的用户 CRUD 演练：express.urlencoded({ extended: true }) 解析表单（Content-Type 不匹配时 req.body 是空对象 {}）、routes/views/controllers/storages 四文件夹、usersStorage 单例类（导出实例而非类——保证全局唯一）、validateUser 校验数组直接放进路由处理器数组、错误渲染 partial（partials/errors.ejs 配 <%- include）、更新与删除（删除走 POST 表单 + confirm 弹窗，不需要 GET 路由）。官方配图：MDN 的表单-服务器 GET/POST 交互流程图。Assignment 两大任务：给用户模型加 Email（必填、格式正确）/Age（可选、18–120 的数字）/Bio（可选、≤200 字符）三字段并更新视图；实现搜索——GET 方法表单、/search 路由、控制器搜索逻辑（GET 表单数据在 req.query 不在 req.body）、search.ejs 展示结果。",
      "guide": "以下是官方原课的中文化梳理。本课深入**表单**以及**用 Express 管理表单**；并探索用 **express-validator** 做**校验（validation）与净化（sanitization）**来保护 Node.js / Express 应用的安全。官方定调：**正确理解表单处理对维护数据完整性、保护 Web 应用免受安全风险至关重要**。**① HTML 表单复习**：先来一个简单的 HTML 表单——收集全名的单个文本框加配套 label（结构见代码示例区）。form 元素本身带 **action**（指向服务器上的某个资源）与 **method**——注意 method 对应 HTTP 动词、通常是 **GET 或 POST**。表单里有带 label 的文本输入与提交按钮；**input 的 name 属性起关键作用**：它定义这个输入在发往服务器的表单数据里**如何被标识**——后端处理表单提交时尤其重要；**type=\"submit\" 按钮**让用户把输入的数据上传到服务器。**form 两属性的语义**：**action**——表单提交时数据被送去处理的资源/URL；**不设置或为空串时，表单提交回当前页面 URL**。**method**——用哪个 HTTP 方法（POST 或 GET）。**POST 通常更安全**：敏感信息不进 URL——不会出现在服务器日志里；它是**创建或更新服务器端数据的标准选择**。**GET** 用于**不修改数据**的表单（如搜索表单），或你希望**提交结果可收藏、可经 URL 分享**时——表单数据作为**查询字符串**随请求 URL 发送。**② 表单处理流程（PRG）**：表单的 action 指向服务器的某个**端点（endpoint）**→**控制器**接手处理请求→控制器**与数据库沟通**处理数据→用控制器响应**生成新的或更新过的视图**并**重定向客户端**。这就是 **Post/Redirect/Get（PRG）设计模式**——它帮助**防止重复的 POST 请求**（Wikipedia 有专页）。**③ 校验与净化**：表单数据发往服务器**之前**该考虑两件重要的事：**Validation（校验）**确保用户输入**符合指定标准**（如必填字段、正确格式）；**Sanitization（净化）**通过**移除或编码潜在恶意字符**来清洗用户输入、防止恶意数据被处理。官方补充：**不一定非要在收到数据时就净化——有时在即将使用它之前净化才更合理**。我们用 **express-validator** 库同时搞定这两件事；它让流程简单得多，但**理解这两个操作的底层概念仍然重要**。官方 note（净化的定义）：你有时会见到「sanitization」在**更严格**的意义上使用——只指从输入数据中**移除**字符，与「encoding（编码）= 替换某些字符」相区分；也有**更宽松**的用法——泛指以某种方式改变输入数据的整个过程（移除与编码都算）。**本课内容采用宽松义**。**④ 安装与 body()**：老规矩，在项目**根**文件夹装包：npm install express-validator；引入：const { body, validationResult } = require(\"express-validator\")。这个包几乎为每种表单操作提供了函数——本课只用 **body()** 与 **validationResult()**。**body() 函数**让你指定请求体里**哪些字段**要被校验与净化、以及**怎么处理**。官方示例：birthdate 字段——\"Must be a valid date.\" 是错误消息，**.optional({ values: \"falsy\" })** 标记为可选、**.isISO8601()** 强制 YYYY-MM-DD 格式。{ values: \"falsy\" } 的含义：**不是 undefined、null、false、0 或空串的值仍然会被校验**。**⑤ 链式校验**：多个校验方法可以**链式**组合、每个检查配**独立错误消息**：body(\"name\").trim().notEmpty().withMessage(\"Name can not be empty.\").isAlpha().withMessage(\"Name must only contain alphabet letters.\")——确保 name 不仅存在且已修剪、还只含字母。**⑥ 转义用户输入**：名字、年龄这类输出不含特殊字符时上面的做法够用；但**允许特殊字符的场合**呢——比如用户写「About Me」时决定注入 JavaScript 代码？官方演示：模板里 <%- description %> 未转义输出，用户输入 <script>alert(\"Hacked!\")</script> 就会被渲染进 HTML 执行——这就是**跨站脚本（XSS）攻击**。防法：**转义（escape，也叫 encoding）输出**——转义后的 HTML 把特殊字符替换成对应 HTML 实体（< 变 &lt;）。**EJS 里用 <%= %> 就是转义输出**：同样的注入被渲染成无害的文本 &lt;script&gt;alert(&quot;Hacked!&quot;);&lt;/script&gt;。**那为什么不在收到数据时就 .escape()**（在 body() 校验链末尾加）？两个理由：**「危险字符」只在使用的时点、且只在特定上下文里才危险**——对 HTML「危险」的对 SQL 未必危险、反之亦然；在用进那些上下文之前它们不构成风险。而且**提前转义的数据再过 <%= 输出会二次转义**：&lt; 不会变回 < 而是原样显示成文本「&lt;」——要么先反转义再转义、要么改用未转义输出 <%- %>（像 .innerHTML 一样不可取，如上所示）。**⑦ 校验结果**：校验规则应用后用 **validationResult** 处理校验错误：const errors = validationResult(req)；**errors 数组非空**（有校验失败）→ 返回 **400 状态码**并把 errors.array() 渲染回 index 视图；否则 res.redirect(\"/success\")。**⑧ 表单与 Express 路由**：表单得有个送数据的地方。控制器导出成对的函数：**exports.userUpdateGet**（出表单）与 **exports.userUpdatePost**（收表单）；路由器里挂成对的路由：**usersRouter.get(\"/:id/update\", ...)** 与 **usersRouter.post(\"/:id/update\", ...)**；表单 action 形如 /users/<%= user.userId %>/update、method POST。**/users/:id/update 就是我们在 Express 服务器上创建的端点（endpoint）**。**⑨ Putting it together（完整 CRUD 演练）**：新建 Express + EJS 应用：npm init -y；npm install express ejs express-validator；建 routes、views、controllers、storages 四个文件夹与 app.js。**app.js 要点**（见代码示例区）：设置 views/view engine；**app.use(express.urlencoded({ extended: true }))**；挂 usersRouter；PORT 走环境变量兜底 3000。**官方关键讲解——urlencoded**：多数简单表单发数据时用 **Content-Type: application/x-www-form-urlencoded** 头；**Express 原生解析不了**这种数据——express.urlencoded() 中间件替我们处理、自动把表单数据装进 **req.body**；**extended 为 false 时只接受字符串或数组**，设 true 换取更多灵活性；**Content-Type 不匹配 application/x-www-form-urlencoded 时，服务器看到的 req.body 是空对象 {}**。**usersRouter.js**：三条路由——GET /（列表）、GET /create（出表单）、POST /create（收表单）。**两个视图**：index.ejs 列出全部已建用户（**if (locals.users)** 守卫 + forEach 渲染 ID 与姓名 + 「Create a user」链接）；createUser.ejs 显示建用户表单（firstName/lastName 两输入均 required，action=\"/create\" method=\"POST\"）。**usersController.js**：usersListGet 渲染 index（title + usersStorage.getUsers()）；usersCreateGet 渲染 createUser；usersCreatePost 从 req.body 解构 firstName/lastName、usersStorage.addUser、**res.redirect(\"/\")**——PRG 落地。**usersStorage.js（storages 文件夹）**：UsersStorage 类模拟数据库交互——constructor 里 storage 对象与 id 计数；addUser / getUsers / getUser / updateUser / deleteUser 五方法。**导出的是类的实例而非类**（module.exports = new UsersStorage()）——**确保这个类全局只存在一个实例，即「单例（singleton）模式」**。官方明说：真实场景几乎必然用数据库（接下来的课就探索），这个类只是到达那一站前的演示。**跑起来**：node --watch app.js；http://localhost:3000/create 加用户、/ 列用户。**⑩ 加校验与净化**：usersController.js 引入 body、validationResult、**matchedData**；定义错误消息常量（alphaErr/lengthErr）；**validateUser 校验数组**：body(\"firstName\").trim().isAlpha().withMessage(...).isLength({ min: 1, max: 10 }).withMessage(...)，lastName 同构。**路由处理器可以是数组**：exports.usersCreatePost = [validateUser, (req, res) => {...}]——整个校验中间件数组直接传给控制器位。处理器内：validationResult 查错、非空则 400 渲染回 createUser（带 title 与 errors.array()）；成功则 **const { firstName, lastName } = matchedData(req)**——**matchedData() 取回全部通过校验的数据、保证含全部净化结果（如 trim 过的值）**——addUser、redirect。**错误渲染 partial**：views 里建 **partials/** 子目录、写 **errors.ejs**（if (locals.errors) 守卫 + forEach 输出 error.msg 列表）；createUser.ejs 表单上方 **<%- include(\"partials/errors.ejs\") %>**——填错表单就能看到全部错误。**⑪ 更新用户**：新视图 **updateUser.ejs**（含 errors partial；form action=\"/<%= user.id %>/update\" method POST；两输入带 value 回填）；index.ejs 每个用户旁加 **Update 链接**（/<%= user.id %>/update 的 GET）；路由器加 **GET 与 POST 的 /:id/update** 一对；控制器加 usersUpdateGet（getUser 后渲染 updateUser）与 usersUpdatePost（validateUser 数组 + 校验失败带 user 与 errors 渲染回 / 成功 matchedData 后 updateUser、redirect）——**与创建用户的形态非常相似**。**⑫ 删除用户**：index.ejs 里每个用户加一个**小表单**——action=\"/<%= user.id %>/delete\" method POST、display:inline、按钮 onclick 里 **return confirm('Are you sure you want to delete this user?')** 弹确认（官方注释：这次发的是 POST 请求、所以需要表单而不是链接）；控制器加 usersDeletePost（deleteUser + redirect）；路由器加 **POST /:id/delete**。官方点破：**这里不需要 GET 路由**——删除后反正重定向回 /。官方收尾：表单安全可以做深得多、到此为止；你已经能看到 **express-validator 有多 helpful**、req.body 对象几乎想怎么用就怎么用。视觉总览：官方给了 **MDN 的表单-服务器 GET/POST 交互流程图**（配图，资料区登记原图地址）。**Assignment 两大任务**：**任务一「Add user details」**——扩展我们创建的 User 模型、实现以下字段与校验：**Email**（必填、格式必须正确）、**Age**（可选、必须是 18 到 120 之间的数字）、**Bio**（可选、最多 200 字符）；**别忘了更新视图显示这些新字段**！**任务二「Implement searching」**——几千用户里找特定用户怎么办？需要新路由与新视图让用户搜索：**1.** 加一个 **GET 方法**的表单（放 createUser.ejs 或别的视图）、接受 **name 或 email**（或都要！）；**2.** 新建 **/search** 路由、接受 **GET** 请求；**3.** 控制器里加搜索逻辑、在列表里找匹配用户——**GET 请求发送的表单数据不在 req.body、要用 req.query**；GET 请求要处理搜索并渲染搜索结果；**4.** 在新视图 **search.ejs** 里显示搜索结果。**Further Reading（官方 Assignment 内的进一步阅读）**：① presidentbeef 博客《Injection Prevention: Sanitizing vs. Escaping》——展开讲净化与转义的含义、如何进一步保护 Web 应用；② express-validator 完整文档，重点两节：Getting Started 与 Validation Chains。**补充资料（AR）**：Web Dev Simplified 的 Express 表单提交与解析教程（想复习的话）；express-validator 文档的「实现自定义校验器」好文。",
      "understand": [
        "form 两属性定乾坤：**action**（提交去哪个端点；空则回当前 URL）+ **method**（POST 创建/更新、敏感信息不进 URL 与日志；GET 用于搜索类不改数据的表单——数据成查询字符串、可收藏可分享）；**input 的 name = 表单数据的键名**",
        "**PRG 模式**（Post/Redirect/Get）：POST 处理完重定向到 GET——防重复 POST；控制器与数据库沟通、生成新视图再重定向客户端",
        "**校验（validation）= 输入符合标准；净化（sanitization）= 移除或编码恶意字符**（本课采宽松义）；净化时机灵活——有时用之前才做更合理",
        "**转义在输出处做**：危险字符只在使用的上下文里才危险（对 HTML 危险的对 SQL 未必）；EJS 的 <%= 就是转义输出；提前 .escape() 会二次转义（&lt; 显示成文本）",
        "**express-validator 工作流**：body(\"字段\") 链式规则（trim/notEmpty/isAlpha/isLength + withMessage；optional({values:\"falsy\"})）→ validationResult(req) 收错（非空回 400 + errors.array() 渲染回模板）→ **matchedData(req) 取净化后的数据**",
        "**路由处理器可以是数组**：[validateUser, handler] 把校验中间件与处理器并排挂上同一路由",
        "**express.urlencoded({ extended: true })**：解析 x-www-form-urlencoded 表单进 req.body——Content-Type 不匹配时 req.body 是空对象 {}",
        "**单例模式**：usersStorage 导出实例而非类——全局唯一状态；真实应用用数据库（下两课），这里是过渡演示",
        "删除走 **POST 表单 + confirm**、不需要 GET 路由；更新是 **GET 出表单 + POST 收表单**的一对路由"
      ],
      "terms": [
        {
          "en": "Validation",
          "zh": "校验：确保用户输入符合指定标准（必填、格式、范围）——express-validator 的 body() 链式规则负责"
        },
        {
          "en": "Sanitization",
          "zh": "净化：移除或编码潜在恶意字符、防止恶意数据被处理——本课采用宽松义（移除与编码都算）；时机可以推迟到使用前"
        },
        {
          "en": "Escaping / Encoding",
          "zh": "转义（编码）：把特殊字符替换成 HTML 实体（< 变 &lt;）——XSS 的防线；在输出处做（EJS 的 <%=），不在接收时做"
        },
        {
          "en": "XSS (Cross-site scripting)",
          "zh": "跨站脚本攻击：用户输入里的 <script> 被未转义渲染执行——「About Me 注入 alert('Hacked!')」是官方演示的经典形态"
        },
        {
          "en": "PRG (Post/Redirect/Get)",
          "zh": "POST 处理完重定向、客户端再发 GET 的设计模式——防止重复 POST（刷新不会二次提交）"
        },
        {
          "en": "express-validator",
          "zh": "校验与净化的主力库：body() 定规则、validationResult() 收错误、matchedData() 取净化后的数据"
        },
        {
          "en": "express.urlencoded",
          "zh": "解析表单数据的内置中间件（传 { extended: true }）——把 x-www-form-urlencoded 请求体装进 req.body；Express 原生不解析"
        },
        {
          "en": "Singleton pattern",
          "zh": "单例模式：导出类的实例而非类本身——保证全局只有一个共享状态的实例（usersStorage 的写法）"
        },
        {
          "en": "Endpoint",
          "zh": "端点：服务器上为特定操作创建的 URL 路径（如 /users/:id/update）——表单 action 指向它"
        }
      ],
      "tasks": [
        "任务一「Add user details」：扩展本课创建的 User 模型——实现三个新字段与校验：Email（必填、格式必须正确）、Age（可选、必须是 18 到 120 之间的数字）、Bio（可选、最多 200 字符）；别忘了更新视图显示这些新字段",
        "任务二「Implement searching」第 1 步：加一个 GET 方法的表单（放 createUser.ejs 或另一个视图），接受 name 或 email（或两者都接受）",
        "第 2 步：创建接受 GET 请求的新路由 /search",
        "第 3 步：控制器里加搜索逻辑、在用户列表里找匹配项——注意：GET 请求发送的表单数据不在 req.body、要用 req.query；GET 请求应处理搜索并渲染搜索结果",
        "第 4 步：在新视图 search.ejs 里显示搜索结果"
      ],
      "quiz": [
        {
          "question": "POST 与 GET 表单各适合什么场景？官方说 POST「通常更安全」的理由是什么？",
          "answer": "POST 是创建或更新服务器端数据的标准选择；GET 用于不修改数据的表单（搜索类）或希望结果可收藏、可经 URL 分享的场景。POST 更安全：敏感信息不进 URL——不会出现在服务器日志里；GET 的数据以查询字符串随 URL 发送，会被日志、浏览器历史、分享链接原样记录。"
        },
        {
          "question": "PRG 模式三步是什么？它防的是什么问题？",
          "answer": "Post（表单提交到端点、控制器处理并与数据库沟通）→ Redirect（生成响应后重定向客户端）→ Get（客户端对新 URL 发 GET、看到更新后的视图）。防的是重复 POST：如果 POST 直接 render 页面，用户刷新就会再提交一次；重定向后刷新只是重发无害的 GET。"
        },
        {
          "question": "为什么官方建议「在使用时转义」而不是「收到数据时就 .escape()」？EJS 里两种输出标签怎么选？",
          "answer": "两个理由：① 危险字符只在使用的上下文里才危险——对 HTML 危险的对 SQL 未必危险，提前转义是错位防御；② 提前转义的数据再经 <%= 输出会二次转义——&lt; 原样显示成文本。选法：<%= 转义输出用户数据（默认选它）；<%- 原始输出只用于自己模板渲染的 HTML（如 include partial）——像 .innerHTML 一样对不可信内容不可取。"
        },
        {
          "question": "validationResult 与 matchedData 在校验流程里各干什么？校验失败时官方示例回什么状态码？",
          "answer": "validationResult(req) 收集校验错误：errors.isEmpty() 为 false 时走失败分支——res.status(400) 把 errors.array() 渲染回表单模板。校验通过后用 matchedData(req) 取回全部通过校验的数据——它保证包含净化结果（如 trim 过的值），比直接读 req.body 更可靠。"
        },
        {
          "question": "usersStorage.js 为什么导出 new UsersStorage() 而不是类本身？这个模式的正式名字是什么？",
          "answer": "导出实例保证全应用共享同一个存储状态——如果导出类，每个 require 后各自 new 一个实例，数据就分家了。官方点名这是「单例（singleton）模式」：确保一个类只存在一个实例。它是真数据库（下两课）到来前的过渡演示。"
        }
      ],
      "optional": [],
      "note": "本课代码用 CommonJS（require/exports）与 EJS——与「Express 简介」起的课程惯例一致。urlencoded 的 extended: true 在官方正文只解释到「false 只接受字符串或数组、true 更灵活」的深度， deeper 的差异（querystring vs qs 解析器）官方未展开、本站不替官方补写。Assignment 的 Further Reading 两条与 AR 两条都登记在资料区；官方配图（MDN 表单-服务器交互流程图）登记原图地址。",
      "why": "留言板项目里你已经「照做」过 form 与 urlencoded——这一课把每个选择背后的为什么补齐：POST 还是 GET、什么时候转义、校验为什么用数组挂进路由、删除为什么走 POST。更重要的是安全视角的升级：XSS 与（下下课的）SQL 注入是 Web 应用最经典的两类注入攻击，官方的「危险字符只在使用的上下文里才危险」是贯穿两者的总纲——表单层用转义防 XSS、数据库层用参数化查询防注入，两道防线你都亲手搭过之后，「输入永远不可信」才算从口号变成肌肉记忆。",
      "sections": [
        {
          "h": "HTML 表单复习：action、method 与 name",
          "p": [
            "先简短复习 HTML 本身。一个简单的表单：收集全名的**单个文本输入框**加配套 **label**（结构见代码示例区）。",
            "**form 元素本身**带 **action**（指向服务器上的某个资源）与已定义的 **method**——注意 method 对应一个 HTTP 动词、通常是 **GET 或 POST**。",
            "**input 的 name 属性起关键作用**：它定义这个输入在发往服务器的表单数据里**如何被标识**——后端处理表单提交时尤其重要。**type=\"submit\" 按钮**让用户把输入的数据上传到服务器。",
            "**form 两属性的语义**：**action**——提交时数据被送去处理的资源/URL；**不设置或为空串时，表单提交回当前页面 URL**。**method**——用哪个 HTTP 方法（POST 或 GET）。",
            "**POST 通常更安全**：敏感信息留在 URL 外——不会出现在服务器日志里；是**创建或更新服务器端数据的标准选择**。**GET** 用于**不修改数据**的表单（如搜索表单）、或希望提交结果**可收藏、可经 URL 分享**时——数据作为**查询字符串**随请求 URL 发送。"
          ]
        },
        {
          "h": "表单处理流程与 PRG 模式",
          "p": [
            "表单的 **action** 指向我们服务器上的某个**端点**——让**控制器**接手处理请求；控制器**与数据库沟通**处理数据。",
            "然后我们用控制器的响应**生成新的或更新过的视图**，并**重定向客户端**。",
            "这就是 **Post/Redirect/Get（PRG）设计模式**——它帮助**防止重复的 POST 请求**（Wikipedia 有专页，资料区登记）。"
          ]
        },
        {
          "h": "校验与净化：两个概念一个库",
          "p": [
            "表单数据发往服务器前，两个重要步骤：**Validation（校验）**确保用户输入**符合指定标准**（必填字段、正确格式等）；**Sanitization（净化）**通过**移除或编码潜在恶意字符**清洗用户输入、防止恶意数据被处理。",
            "官方补充：**不总是非得在收到数据时就净化——有时在即将使用前净化才更合理**。",
            "我们用 **express-validator** 库同时搞定两件事。它让流程简单得多，但**理解两个操作的底层概念仍然重要**。",
            "官方 note（净化的定义）：严格义上 sanitization 只指**移除**字符（与「encoding = 替换字符」区分）；宽松义泛指**改变输入数据的整个过程**（移除与编码都算）——**本课采用宽松义**。"
          ]
        },
        {
          "h": "express-validator：body() 与链式校验",
          "p": [
            "老规矩：项目**根**目录 npm install express-validator；引入 const { body, validationResult } = require(\"express-validator\")。包里有几乎覆盖每种表单操作的函数——本课只用 **body()** 与 **validationResult()**。",
            "**body()** 指定请求体里**哪些字段**被校验与净化、以及怎么处理。官方示例：birthdate 字段——错误消息 \"Must be a valid date.\"，**.optional({ values: \"falsy\" })** 标记可选、**.isISO8601()** 强制 YYYY-MM-DD 格式；{ values: \"falsy\" } 意思是：**不是 undefined、null、false、0 或空串的值仍会被校验**。",
            "**链式校验**：多个校验方法链式组合、每个检查配独立错误消息——.trim().notEmpty().withMessage(...).isAlpha().withMessage(...)：确保 name 存在、已修剪、只含字母（见代码示例区）。"
          ]
        },
        {
          "h": "转义与 XSS：在输出处防御",
          "p": [
            "名字、年龄这类输出不含特殊字符时上面够用；但**允许特殊字符的输入**呢——用户写「About Me」时注入 JavaScript 代码会怎样？",
            "官方演示：模板用 **<%- description %> 未转义输出**，用户输入 <script>alert(\"Hacked!\")</script>——它会被原样渲染进 HTML 执行。这就是**跨站脚本（XSS）攻击**。",
            "防法：**转义（escape/encoding）输出**——把特殊字符替换成 HTML 实体（< 变 &lt;）。**EJS 里 <%= %> 就是转义输出**：同样的注入变成无害文本 &lt;script&gt;alert(&quot;Hacked!&quot;);&lt;/script&gt;（对比见代码示例区）。",
            "**为什么不在收到数据时就 .escape()**？① **「危险字符」只在使用的时点、特定上下文里才危险**——对 HTML 危险的对 SQL 未必危险、反之亦然；用进那些上下文之前不构成风险。② **二次转义问题**：提前转义的数据再过 <%= 输出，&lt; 不会变回 < 而是**原样显示成文本**——要么反转义再转义、要么用 <%- %>（像 .innerHTML 一样不可取）。"
          ]
        },
        {
          "h": "validationResult 与成对路由",
          "p": [
            "校验规则应用后，用 **validationResult** 处理校验错误（见代码示例区）：errors 数组**非空**（有失败）→ 返回 **400 状态码**并把 **errors.array()** 渲染回 index 视图；否则 **res.redirect(\"/success\")**。",
            "表单得有个送数据的地方。控制器导出**成对函数**：exports.userUpdateGet（出表单）与 exports.userUpdatePost（收表单）；路由器里挂**成对路由**：GET 与 POST 的 **/:id/update**；表单 action 形如 /users/<%= user.userId %>/update、method POST——**/users/:id/update 就是我们在 Express 服务器上创建的端点**。"
          ]
        },
        {
          "h": "Putting it together（上）：四文件夹的 CRUD 骨架",
          "p": [
            "完整演练：建 Express + EJS 应用（npm init -y；npm install express ejs express-validator），创建 **routes、views、controllers、storages** 四文件夹与 app.js。",
            "**app.js**（见代码示例区）：设置 views 与 view engine；**app.use(express.urlencoded({ extended: true }))**；挂 usersRouter；PORT 走环境变量兜底。",
            "**官方关键讲解——urlencoded**：多数简单表单发数据用 **Content-Type: application/x-www-form-urlencoded** 头；**Express 原生解析不了**——express.urlencoded() 中间件替我们处理、自动把表单数据装进 **req.body**；**extended 为 false 时只接受字符串或数组**、设 true 更灵活；**Content-Type 不匹配时服务器看到的 req.body 是空对象 {}**。",
            "**usersRouter.js** 三条路由：GET /（列表）、GET /create（出表单）、POST /create（收表单）。**两个视图**：index.ejs 列全部用户（**if (locals.users)** 守卫 + forEach + 「Create a user」链接）；createUser.ejs 建用户表单（firstName/lastName 均 required、action=\"/create\" method=\"POST\"）。",
            "**usersController.js**：usersListGet 渲染列表；usersCreateGet 渲染表单；usersCreatePost 从 req.body 解构、addUser、**res.redirect(\"/\")**——PRG 落地。",
            "**usersStorage.js**：UsersStorage 类模拟数据库——storage 对象 + id 计数 + addUser/getUsers/getUser/updateUser/deleteUser 五方法。**导出实例而非类**（module.exports = new UsersStorage()）——**确保只存在一个实例，即「单例（singleton）模式」**。官方明说：真实场景几乎必然用数据库（接下来的课探索），这只是过渡演示。跑：node --watch app.js——/create 加用户、/ 列用户。"
          ]
        },
        {
          "h": "Putting it together（中）：校验数组与错误 partial",
          "p": [
            "给控制器加校验与净化：引入 body、validationResult、**matchedData**；定义错误消息常量；**validateUser 校验数组**——firstName 与 lastName 各自 .trim().isAlpha().withMessage(...).isLength({ min: 1, max: 10 }).withMessage(...)。",
            "**路由处理器可以是数组**：exports.usersCreatePost = **[validateUser, (req, res) => {...}]**——整个校验中间件数组直接放到控制器位上。",
            "处理器内：validationResult 查错——非空则 **400** 渲染回 createUser（带 title 与 errors.array()）；成功则 **const { firstName, lastName } = matchedData(req)**——官方点明：**matchedData() 取回全部通过校验的数据、保证包含净化结果（如 trim 过的值）**——然后 addUser、redirect。",
            "**错误渲染 partial**：views 里建 **partials/** 子目录写 **errors.ejs**（if (locals.errors) 守卫 + forEach 输出 error.msg）；createUser.ejs 表单上方 **<%- include(\"partials/errors.ejs\") %>**——填错表单即可看到全部错误。"
          ]
        },
        {
          "h": "Putting it together（下）：更新与删除",
          "p": [
            "**更新**：新视图 **updateUser.ejs**（含 errors partial；form action=\"/<%= user.id %>/update\" method POST；输入框带 value 回填当前值）；index.ejs 每用户旁加 **Update 链接**；路由器加 **GET 与 POST 的 /:id/update 一对**；控制器加 usersUpdateGet（getUser 后渲染）与 usersUpdatePost（validateUser + 失败带 user 与 errors 渲染回 / 成功 matchedData 后 updateUser、redirect）——官方评注：**与创建用户的形态非常相似**。",
            "**删除**：index.ejs 里每用户加一个**小表单**——action=\"/<%= user.id %>/delete\"、method **POST**、style display:inline、按钮 onclick **return confirm('Are you sure...')**（官方注释：这次发 POST、所以需要表单而不是链接）；控制器加 usersDeletePost（deleteUser + redirect）；路由器加 **POST /:id/delete**。",
            "官方点破：**这里不需要 GET 路由**——反正删除后重定向回 /。收尾评注：表单安全可以做深得多、到此为止——你已看到 express-validator 多有用、req.body 几乎想怎么用就怎么用。视觉总览：官方引用 **MDN 的表单-服务器 GET/POST 交互流程图**（配图地址在资料区）。"
          ]
        },
        {
          "h": "Assignment：两大任务 + 进一步阅读",
          "p": [
            "**任务一「Add user details」**：扩展 User 模型——**Email**（必填、格式正确）、**Age**（可选、18–120 的数字）、**Bio**（可选、≤200 字符）三字段与校验；**别忘了更新视图显示新字段**！",
            "**任务二「Implement searching」**：几千用户里找特定用户——**1.** 加 **GET 方法**表单（接受 name 或 email 或都要）；**2.** 新建 **/search** 路由（接受 GET）；**3.** 控制器加搜索逻辑——**GET 表单数据不在 req.body、要用 req.query**——处理搜索并渲染结果；**4.** 新视图 **search.ejs** 显示搜索结果。",
            "**Further Reading（官方进一步阅读）**：① 《Injection Prevention: Sanitizing vs. Escaping》——净化与转义的含义与安保价值；② **express-validator 完整文档**（重点 Getting Started 与 Validation Chains 两节）（链接在资料区）。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "html",
          "code": "<form action=\"/create\" method=\"POST\">\n  <label for=\"fullName\">Full Name:</label>\n  <input placeholder=\"John Doe\" type=\"text\" name=\"fullName\" id=\"fullName\">\n  <button type=\"submit\">Submit</button>\n</form>",
          "note": "最简表单结构：action 指向处理提交的服务器端点、method 对应 HTTP 动词；input 的 name 属性决定它在表单数据里的键名（后端从 req.body.fullName 取值）；type=\"submit\" 按钮触发上传。"
        },
        {
          "lang": "javascript",
          "code": "[\n  body(\"birthdate\", \"Must be a valid date.\")\n    .optional({ values: \"falsy\" })\n    .isISO8601() // Enforce a YYYY-MM-DD format.\n];\n\n[\n  body(\"name\")\n    .trim()\n    .notEmpty()\n    .withMessage(\"Name can not be empty.\")\n    .isAlpha()\n    .withMessage(\"Name must only contain alphabet letters.\"),  \n];",
          "note": "body() 两例：上例 birthdate 可选（{ values: \"falsy\" }——非 undefined/null/false/0/空串的值仍被校验）但填了就必须是 ISO8601 日期；下例链式校验——trim 后非空且只含字母，每个检查配独立错误消息。"
        },
        {
          "lang": "html",
          "code": "<div>\n  About Me: <%- description %>!\n</div>\n\n// The client then inputs the following as their page's About Me:\n<script>alert(\"Hacked!\");</script>\n\n<!-- 未转义时渲染成： -->\n<div>\n  About Me: <script>alert(\"Hacked!\");</script>!\n</div>\n\n<!-- 改用 <%= 转义输出后，攻击被渲染成无害文本： -->\n<!-- About Me: &lt;script&gt;alert(&quot;Hacked!&quot;);&lt;/script&gt;! -->",
          "note": "官方 XSS 演示：<%- 未转义输出让用户注入的 <script> 直接执行；<%= 转义输出把特殊字符换成 HTML 实体、攻击变无害文本。这就是「转义在输出处做」的直观理由。"
        },
        {
          "lang": "javascript",
          "code": "const controller = (req, res, next) => {\n  const errors = validationResult(req);\n  if (!errors.isEmpty()) {\n    return res.status(400).render(\"index\", {\n      errors: errors.array(),\n    });\n  }\n\n  // do stuff if successful\n  res.redirect(\"/success\");\n};",
          "note": "validationResult 标准形态：错误数组非空 → 400 + 把 errors.array() 渲染回模板（配 partials/errors.ejs 显示）；通过 → redirect。注意失败分支的 return——Controllers 课「发响应后必须 return」纪律的延续。"
        },
        {
          "lang": "javascript",
          "code": "// app.js（骨架节选）\napp.use(express.urlencoded({ extended: true }));\n\n// storages/usersStorage.js（尾部）\n// Rather than exporting the class, we can export an instance of the class by instantiating it.\n// This ensures only one instance of this class can exist, also known as the \"singleton\" pattern.\nmodule.exports = new UsersStorage();\n\n// controllers/usersController.js（校验数组 + 处理器数组）\nconst validateUser = [\n  body(\"firstName\").trim()\n    .isAlpha().withMessage(`First name ${alphaErr}`)\n    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),\n  body(\"lastName\").trim()\n    .isAlpha().withMessage(`Last name ${alphaErr}`)\n    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),\n];\n\nexports.usersCreatePost = [\n  validateUser,\n  (req, res) => {\n    const errors = validationResult(req);\n    if (!errors.isEmpty()) {\n      return res.status(400).render(\"createUser\", {\n        title: \"Create user\",\n        errors: errors.array(),\n      });\n    }\n    const { firstName, lastName } = matchedData(req);\n    usersStorage.addUser({ firstName, lastName });\n    res.redirect(\"/\");\n  }\n];",
          "note": "完整演练三个关键点：urlencoded 中间件把表单装进 req.body（Content-Type 不匹配时是空对象）；usersStorage 导出实例 = 单例模式；路由处理器是数组——validateUser 校验链先跑、matchedData(req) 取净化后的数据再入库。"
        },
        {
          "lang": "html",
          "code": "<!-- In views/index.ejs -->\n<li>\n  ID: <%= user.id %>, Name: <%= user.firstName %> <%= user.lastName %>\n  <a href=\"/<%= user.id %>/update\">Update</a>\n  <!-- This time we're sending a POST request to our route, so we need a form. -->\n  <form action=\"/<%= user.id %>/delete\" method=\"POST\" style=\"display:inline;\">\n    <button type=\"submit\" onclick=\"return confirm('Are you sure you want to delete this user?');\">Delete</button>\n  </form>\n</li>",
          "note": "更新用链接（GET 出表单）、删除用小表单（POST + confirm 确认弹窗，display:inline 让按钮与链接同排）。官方点破：删除不需要 GET 路由——POST 处理完直接重定向回首页。"
        }
      ],
      "pitfalls": [
        {
          "title": "req.body 是空对象：Content-Type 或中间件缺一",
          "text": "两个常见成因：表单没写 method=\"POST\"（GET 表单数据在 req.query 不在 body——Assignment 搜索任务专门考这个）；或忘了挂 express.urlencoded({ extended: true })——Express 原生不解析 x-www-form-urlencoded，Content-Type 不匹配时服务器看到的就是 {}。"
        },
        {
          "title": "收到数据就 .escape()，输出时二次转义",
          "text": "提前转义的数据再经 <%= 输出，&lt; 会原样显示成文本而不是还原成 <——用户看到的是一堆实体码。官方的原则：转义在输出处做（EJS 的 <%= 天然完成），危险字符只在使用的上下文里才危险；接收时做 trim 等无害净化即可。"
        },
        {
          "title": "校验通过却直接读 req.body 入库",
          "text": "req.body 是原始输入——trim 等净化结果不在里面。官方示例用 matchedData(req) 取回「全部通过校验且已净化」的数据再入库；直接读 body 会让「校验链跑了但数据没洗」的漏洞悄悄存在。"
        },
        {
          "title": "删除操作用 GET 链接",
          "text": "GET 应该只读取不修改——删除走 GET 链接会被预加载、爬虫、刷新意外触发。官方示例的删除特意用 POST 表单加 confirm 确认；「GET 出表单、POST 改数据」的动词纪律从这里开始养成，API 章还会再强化。"
        }
      ],
      "official": {
        "assignment": [
          "任务一 Add user details：扩展 User 模型——Email（必填、格式正确）、Age（可选、18–120 的数字）、Bio（可选、最多 200 字符）；更新视图显示新字段",
          "任务二 Implement searching 第 1 步：加一个 GET 方法的表单（接受 name 或 email 或两者）",
          "第 2 步：创建接受 GET 请求的新路由 /search",
          "第 3 步：控制器加搜索逻辑——GET 表单数据不在 req.body、要用 req.query；处理搜索并渲染结果",
          "第 4 步：在新视图 search.ejs 显示搜索结果"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "Further Reading：Injection Prevention: Sanitizing vs. Escaping（presidentbeef 博客）——净化与转义的含义与安保价值",
          "Further Reading：express-validator 完整文档（重点 Getting Started 与 Validation Chains 两节）",
          "Web Dev Simplified 的 Express 表单提交与解析教程（复习用）",
          "express-validator 文档「实现自定义校验器」一文"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/express/forms_and_data_handling.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "e6be5a44c0f62d2c26303509731fb782e981a69def167af90478b3d257378db1",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "nodejs-installing-postgresql",
      "title": "Installing PostgreSQL",
      "zh": "安装 PostgreSQL",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/nodejs-installing-postgresql",
      "summary": "数据库持久化两课的第一课（安装）：数据持久化是绝大多数 Web 应用的核心——而持久化靠数据库实现；能理解如何构建、组织并查询自己的数据库，是任何全栈开发者的重要技能。官方拿 TOP 自己举例：你的用户名存在哪？项目提交存在哪？你正在读的本课内容存在哪？——是的，数据库！课程选定 PostgreSQL 作为数据库：你在 World 6（SQL 课程）学的全部 SQL 知识都可以迁移过来，此外还会学 PostgreSQL 特有的新东西；官方推荐先看 Fireship 的 PostgreSQL 趣味短视频入门。本课正文讲 PostgreSQL shell（psql）：它是基于终端的 PostgreSQL 前端，让用户交互式执行 SQL 查询、管理数据库——通常随 PostgreSQL 安装附带、经命令行访问；能力范围包括跑查询、创建与修改数据库结构、在命令行环境里与数据库交互；psql 还提供大量元命令（meta-commands）与类 shell 特性，方便写脚本、自动化各种任务。数据库文件就住在文件系统里（PostgreSQL 把数据库存成文件系统内的普通文件），数据目录的默认位置因操作系统而异。红色前置警告：本课及之后所有课都假设你已理解 SQL 语法与概念——务必先完成 SQL 课程（World 6）。Assignment 一条：按你的操作系统跟随对应的 PostgreSQL 安装指南（官方提供 Linux 与 macOS 两份）。",
      "guide": "以下是官方原课的中文化梳理。**为什么要数据库**：**数据持久化（data persistence）对绝大多数 Web 应用都是核心**。持久化经由**数据库**实现——**能理解如何构建（structure）、建造（build）与查询（query）自己的数据库，是任何全栈开发者的重要技能**。官方举身边的例子：想想 The Odin Project——**你的用户名存在哪里？项目提交存在哪里？你现在正在读的本课内容存在哪里？是的，数据库！****选型**：课程选定 **PostgreSQL**。你在**早先课程（World 6 的 SQL 课程）学的所有 SQL 知识都可以迁移到 PostgreSQL**；我们还会学 **PostgreSQL 特有的新东西**。官方推荐：看 Fireship 的 **PostgreSQL 趣味短视频入门**（资料区有链接；为英文视频）。**本课与下一课的分工**：本课**安装** PostgreSQL；下一课学**在 Express 应用里使用它**。**PostgreSQL shell（psql）**：**红色警告（官方 critical note）：先完成 SQL 课程！**——本课及其后所有课都**假设你已理解 SQL 语法与概念**（链接指回 World 6 databases 课程）。**psql 是什么**：PostgreSQL shell（又名 **psql**）是**基于终端的 PostgreSQL 前端**，让用户**交互式执行 SQL 查询、管理数据库**。它通常**随 PostgreSQL 安装附带**、经命令行访问。**能力范围**：跑查询、创建与修改数据库结构、在命令行环境里与数据库交互；psql 还提供**大量元命令（meta-commands）与各种类 shell 特性**，方便**写脚本、自动化各种任务**。**数据住在哪**：用 psql 终端操作的数据库**位于文件系统或本机内部**——**PostgreSQL 把数据库存成文件系统里的普通文件**；**数据目录的默认位置因操作系统而异**。**Assignment 一条**：按你运行的操作系统，跟随对应的 PostgreSQL 安装指南——官方提供 **Linux** 与 **macOS** 两份（两个链接都在资料区；住在官方 curriculum 仓的 installation_guides/postgresql/ 目录）。",
      "understand": [
        "**数据持久化 = Web 应用的核心需求**，由数据库实现；构建、组织与查询自己的数据库是全栈开发者的重要技能",
        "TOP 自己就是例子：用户名、项目提交、你正在读的课程内容——**全都存在数据库里**",
        "**选型 PostgreSQL**：World 6 学的 SQL 知识**全部可迁移**，另有 PostgreSQL 特有内容要学",
        "**psql = 基于终端的 PostgreSQL 前端**：交互式执行 SQL、管理数据库；随安装附带；提供**元命令**（\\l、\\c 这类反斜杠命令）与类 shell 特性",
        "PostgreSQL **把数据库存成文件系统里的普通文件**；数据目录默认位置**因操作系统而异**",
        "**红色前置**：本课起默认你已掌握 SQL 语法与概念——没完成 World 6 的 SQL 课程先回去补"
      ],
      "terms": [
        {
          "en": "Data persistence",
          "zh": "数据持久化：让数据在进程结束、机器重启后依然存在——绝大多数 Web 应用的核心需求，由数据库实现"
        },
        {
          "en": "PostgreSQL",
          "zh": "课程选定的开源关系型数据库——SQL 知识从 World 6 全部可迁移，另有特有功能（下一课的 identity 列即其一）"
        },
        {
          "en": "psql (PostgreSQL shell)",
          "zh": "基于终端的 PostgreSQL 前端：交互式执行 SQL 查询、管理数据库；随安装附带，提供元命令与类 shell 特性"
        },
        {
          "en": "Meta-command",
          "zh": "psql 的元命令：反斜杠开头的管理指令（如 \\l 列库、\\c 连库、\\d 看表）——不是 SQL，是 psql 自己的命令"
        },
        {
          "en": "Data directory",
          "zh": "数据目录：PostgreSQL 存放数据库文件的位置——数据库就是文件系统里的普通文件；默认位置因操作系统而异"
        }
      ],
      "tasks": [
        "按你运行的操作系统，跟随对应的官方 PostgreSQL 安装指南完成安装：Linux 或 macOS（两个链接都在资料区，住官方 curriculum 仓）"
      ],
      "quiz": [
        {
          "question": "官方用什么三连问说明「数据库无处不在」？数据持久化为什么是 Web 应用的核心？",
          "answer": "想想 The Odin Project：你的用户名存在哪？项目提交存在哪？你正在读的本课内容存在哪？——是的，数据库！持久化是核心因为绝大多数应用都需要数据在请求之间、重启之后依然存在——没有它，每次刷新一切归零（留言板项目的内存数组就是反面教材）。"
        },
        {
          "question": "psql 是什么？它和 SQL 是什么关系？",
          "answer": "psql（PostgreSQL shell）是基于终端的 PostgreSQL 前端——一个交互环境，通常随 PostgreSQL 安装附带。关系：你在 psql 里执行 SQL 查询、管理数据库；psql 额外提供元命令（反斜杠指令）与类 shell 特性，方便写脚本与自动化——这些是 psql 自己的能力，不属于 SQL。"
        },
        {
          "question": "本课的红色前置要求是什么？为什么官方用 critical 级别强调？",
          "answer": "先完成 SQL 课程（World 6 databases）——本课及其后所有课都假设你已理解 SQL 语法与概念。critical 级别因为这不是建议而是硬依赖：下一课直接写 CREATE TABLE、INSERT、SELECT 与参数化查询，SQL 不熟会从第一行代码开始卡住。"
        }
      ],
      "optional": [],
      "note": "官方安装指南只有 Linux 与 macOS 两份，没有 Windows 指南（与本站 Foundations 的 installing-node-js 课同型缺口）。Windows 用户可按本站补充口径处理：优先方案是 WSL2（Windows Subsystem for Linux）里按 Linux 指南安装——World 1 的前置课已带你装过 WSL2 与 Ubuntu；也可用 PostgreSQL 官网的 Windows 安装包（EDB installer）直接装进 Windows。此为本站补充、非官方内容。安装完成的自查：终端敲 psql --version 有版本号输出。",
      "why": "留言板项目的痛点你已经亲身体会：内存数组一重启就清零。这一课把「真正的记忆」装进你的机器——PostgreSQL 正是 World 6 里 SQL Zoo 练的那些查询背后的真实引擎。官方选它的理由也值得记住：SQL 是通用语言，World 6 的投资在这里全额兑现；而 psql 这个终端前端，会从下一课建库建表开始、一直陪你到最终项目。",
      "sections": [
        {
          "h": "为什么是数据库：持久化与 TOP 自己",
          "p": [
            "**数据持久化对绝大多数 Web 应用都是核心（integral）。持久化经由数据库实现。**能理解如何**构建、建造与查询**自己的数据库，是任何全栈开发者的重要技能。",
            "官方举例：想想 The Odin Project——**你的用户名存在哪里？项目提交存在哪里？你现在正在读的本课内容存在哪里？是的，数据库！**",
            "**选型**：课程选定 **PostgreSQL**。你在早先课程（World 6）学的**所有 SQL 知识都可迁移**过来；我们还会学 PostgreSQL **特有的新东西**。官方推荐先看 **Fireship 的 PostgreSQL 趣味短视频**入门（资料区有链接；为英文视频）。",
            "分工：**本课安装** PostgreSQL；**下一课**学在 Express 应用里**使用**它。"
          ]
        },
        {
          "h": "PostgreSQL shell（psql）",
          "p": [
            "**红色警告（官方 critical note）：先完成 SQL 课程！**——本课及其后所有课都**假设你理解 SQL 语法与概念**（官方链接指回 World 6 databases 课程）。",
            "**psql 是什么**：PostgreSQL shell（又名 psql）是**基于终端的 PostgreSQL 前端**，让用户**交互式执行 SQL 查询、管理数据库**。它通常**随 PostgreSQL 安装附带**、经命令行访问。",
            "**能力范围**：跑查询、创建与修改数据库结构、在命令行环境里与数据库交互；psql 还提供**大量元命令与各种类 shell 特性**——方便**写脚本、自动化各种任务**。",
            "**数据住在哪**：用 psql 操作的数据库**位于文件系统或本机内部**——**PostgreSQL 把数据库存成文件系统里的普通文件**；**数据目录的默认位置因操作系统而异**。"
          ]
        },
        {
          "h": "Assignment：按系统选安装指南",
          "p": [
            "按你运行的操作系统，跟随对应的官方 PostgreSQL 安装指南：**Linux** 或 **macOS**（两个链接都在资料区——它们住在官方 curriculum 仓的 installation_guides/postgresql/ 目录，是官方指定的安装教材）。",
            "官方没有 Windows 指南——Windows 用户的处置方案见本课「注意」栏（本站补充口径：WSL2 内按 Linux 指南安装，或用官网 Windows 安装包）。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "SQL 没学完就硬闯本课",
          "text": "官方用 critical note 强调前置：本课起所有课都假设你理解 SQL 语法与概念——下一课上来就是 CREATE TABLE 与参数化查询。World 6 的 SQL Zoo 没做完就先回去补，否则从第一行开始卡住，还容易把「不熟 SQL」误诊成「装不上 PostgreSQL」。"
        },
        {
          "title": "装完不验证就往下走",
          "text": "安装指南跑完不等于装好：终端敲 psql --version 应输出版本号、敲 psql 应能进入交互提示符（下一课建库全靠它）。装完立刻验证一次，问题暴露在最小范围内——这也是「起步」课以来 Node 生态安装的通用纪律。"
        }
      ],
      "official": {
        "assignment": [
          "按你运行的操作系统，跟随对应的 PostgreSQL 安装指南：Linux 或 macOS（官方 curriculum 仓 installation_guides/postgresql/ 目录内的两份指南）"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/express/installing_postgresql.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "81fdf7640e66896c19aea4b52a45adc007afa492669517fc8d0243943083f148",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "nodejs-using-postgresql",
      "title": "Using PostgreSQL",
      "zh": "使用 PostgreSQL",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/nodejs-using-postgresql",
      "summary": "把 PostgreSQL 接进 Express 应用的实战课（官方原文约 12KB）。主线项目极小：一个只会「把用户提交的用户名存进数据库」的应用，三条路由——GET / 把库里全部用户名打到终端、GET /new 出一个单输入框表单、POST /new 把提交的用户名存进库。五块主干：① psql 建库建表——\\l 列库、CREATE DATABASE top_users、\\c 连接（提示符变 top_users=#）、CREATE TABLE usernames（id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY + username VARCHAR(255)）、\\d 验证会看到两张东西：usernames 表与 usernames_id_seq 序列——官方 note 解释 identity 列：GENERATED ALWAYS AS IDENTITY 让 PostgreSQL 自动生成 id 值（默认从 1 起、每行 +1），并隐式创建一个记录下一个可用值的序列对象；INSERT 三行样例、SELECT 验证。② node-postgres（pg）——npm install pg；db/pool.js 里 new Pool({host, user, database, password, port: 5432})（官方注释：这些属性都应从环境变量读、硬编码只为演示简洁——上一课的环境变量纪律）；替代写法是 Connection URI（postgresql://role:pass@localhost:5432/top_users）——连托管数据库服务时基本都走 URI。③ Client vs Pool——client 是单个手动管理的连接（开、查、关），一次性查询可以、大量查询开销大；pool 是客户端池、替你持有连接、查询时自动复用或新开——Web 服务器的完美选择。④ db/queries.js 参数化查询——getAllUsernames（SELECT * FROM usernames）与 insertUsername（INSERT ... VALUES ($1) 配数组传参）；官方 note 重点讲 $1：直接拼接用户输入（\"...VALUES ('\" + username + \"')\"）会被 sike'); DROP TABLE usernames; -- 这类输入炸库——这叫 SQL 注入；pg 的查询参数化（第二参数传数组）替你防住。⑤ 控制器调用与种子脚本——控制器 await db.getAllUsernames()/insertUsername；db/populatedb.js 用 Client 一次跑「CREATE TABLE IF NOT EXISTS + INSERT」的 SQL 模板串（脚本设计为只跑一次；先 DROP TABLE 再跑）；可加进 package.json scripts。⑥ 本地库 vs 生产库——本地库适合开发（快、易改、不用联网）；上线要换托管在外部服务器的生产库（全球可达、可扩展、更 robust 的安全）；部署课介绍的托管商多数也提供数据库服务。给生产库灌数据的正确姿势：不靠环境变量（那样只能上生产服务器跑脚本、或临时改本地 env 指向生产库再改回来——都麻烦），而是把连接串作为命令行参数传给脚本（process.argv）：node db/populatedb.js <db-url>——本地与生产都用同一脚本、在自己机器上跑。Assignment 三条：略读 pg 文档（库轻量文档也轻、当参考用）；升级本课项目——连接信息改环境变量、首页加 query 参数搜索（GET /?search=sup 返回所有含 sup 的用户名——官方明令：不要在 JavaScript 里过滤、搜索要在 SQL 里做）、加 GET /delete 路由清空全部用户名；回到 Mini Message Board——把内存数组换成 PostgreSQL + pg 实现真持久化（部署一个新库拿连接信息、messages 表用脚本灌数据、加环境变量与 pool、顺手加上服务端输入校验）。",
      "guide": "以下是官方原课的中文化梳理。**开场**：PostgreSQL 已经装好跑起来了——现在是**用它干活**的时候。（官方口径：为简洁起见，以下把 database 简称为 **db**。）**红色前置（critical note）**：先完成 SQL 课程（World 6）——本课及其后所有课假设你理解 SQL 语法与概念。**① 先搭 Express 应用骨架**：应用只有一个功能——**把用户提交的用户名加进 db**。三条路由与职责：**GET /**——把 db 里现有的用户名**打到终端**（起步阶段可以先放一句 console.log(\"usernames will be logged here - wip\") 占位）；**GET /new**——给用户显示一个 HTML 表单、**一个 username 文本输入框**、提交到下一条路由；**POST /new**——把收到的 username 数据**存进 db**（起步可先 console.log(\"username to be saved: \", req.body.username) 占位）。上面的功能跑通后再进入下一节；**相关代码放 routes 与 controllers 文件夹**；只有一个视图（GET /new）要照顾——用 ejs 还是纯 HTML 随你。**② psql 建库建表**：终端跑 **psql** 进入 PostgreSQL shell。**\\l** 查看现有全部 db；建库：**CREATE DATABASE top_users;**；再 \\l 确认；连库：**\\c top_users**——提示符应变成 **top_users=#**。建表存 username 数据：**CREATE TABLE usernames (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, username VARCHAR(255));**；**\\d** 验证——输出里应有**两样东西**：**usernames（table）**与 **usernames_id_seq（sequence）**。**官方 note（identity 列）**：usernames_id_seq 是什么来头？——**GENERATED ALWAYS AS IDENTITY 子句**是「元凶」：它把 id 列定义为 **identity 列（标识列）**，PostgreSQL 从此**自动为该列生成值**——默认从 1 开始、每个新行 +1；同时 PostgreSQL **隐式创建 usernames_id_seq 这个序列（sequence）对象**、负责记录下一个可用值。官方自嘲：好了，我们有库有表了……一张孤零零的表。不会孤多久——插三行样例：**INSERT INTO usernames (username) VALUES ('Mao'), ('nevz'), ('Lofty');**；验证：**SELECT * FROM usernames;**。**③ 在 Express 里用 node-postgres**：经由 **node-postgres**（简称 **pg**）库在 Express 应用里操作 PostgreSQL——它是我们与 PostgreSQL db 打交道的接口。安装：**npm install pg**。初始化：建 **db 文件夹**、写 **db/pool.js**——new Pool 传连接信息：**host**（localhost 或库所在处）、**user**（<role_name>）、**database**（top_users）、**password**（<role_password>）、**port**（5432 默认端口）。**官方注释强调：所有这些属性都应从环境变量读**——硬编码只为演示简洁（<role_name> 与 <role_password> 换成你上一课安装时设置的值）。**替代写法 Connection URI**：一个 connectionString 字符串——**postgresql://<role_name>:<role_password>@localhost:5432/top_users**；**连接托管数据库服务时你基本都会用 URI 形态**。**④ 官方 note（pg 的两种连接方式：client 与 pool）**：**client** 是**单个连接、手动管理**——打开连接、查询、关闭；一次性查询没问题，**大量查询开销就大了**。「要是能把 client 留住不就好了？」——**pool（池）**正是答案：顾名思义是 **client 的池子**，**替你持有连接**；查询时它程序化地复用空闲连接、没有空闲才新开——**Web 服务器的完美选择**。**⑤ db/queries.js 参数化查询**：有了 Pool 就能用 **query 方法**。按项目需求要两个 db 交互：**取全部用户名**与**插入新用户名**——**getAllUsernames()**：const { rows } = await pool.query(\"SELECT * FROM usernames\")、返回 rows；**insertUsername(username)**：await pool.query(\"INSERT INTO usernames (username) VALUES ($1)\", [username])。**官方 note（Parameterization，$1 是什么）**：另一种写法是字符串拼接——\"INSERT INTO usernames (username) VALUES ('\" + username + \"')\"，把**用户输入直接拼进查询**。心术不正的用户输入 **sike'); DROP TABLE usernames; --** 就能**炸掉你的表**——吓人的东西。这叫 **SQL 注入（SQL injection）**。**pg 提供查询参数化防住它**：不直接传用户输入，而是**把它放进数组、作为第二个参数**——剩下的 pg 处理。**⑥ 控制器调用**：在对应控制器里调用上面两个函数（你的函数名可以不同，重要的是理解 db 函数如何被调用）：**getUsernames**——await db.getAllUsernames() 后 console.log 并把名字 join 进 res.send；**createUsernameGet**——渲染表单；**createUsernamePost**——从 req.body 解构 username、await db.insertUsername(username)、res.redirect(\"/\")。跑一圈应用，希望一切如预期。**⑦ 用脚本灌库（populatedb.js）**：你可能已经注意到**建表灌数据有多繁琐**——好在有代码之力，用脚本自动化。建 **db/populatedb.js**：文件首行 **#! /usr/bin/env node**；引入 **Client**（注意不是 Pool）；**SQL 模板字符串**里放「**CREATE TABLE IF NOT EXISTS usernames (...)** + **INSERT INTO usernames (username) VALUES ('Bryan'), ('Odin'), ('Damon');**」；main() 里：console.log(\"seeding...\") → new Client({ connectionString }) → await client.connect() → await client.query(SQL) → await client.end() → console.log(\"done\")。使用：先登录 psql、连 top_users、**DROP TABLE usernames;**——然后 **node db/populatedb.js** 跑脚本，或把它**加进 package.json 的 scripts**。**注意：脚本设计为只跑一次。****⑧ 本地库 vs 生产库**：**本地数据库适合开发**：交互更快、修改更容易、不需要联网——原型与测试新功能时尤其有用。项目要公开时，就得切换到**托管在外部服务器**（独立于你本机）的**生产数据库**：全球可达、可扩展、更 robust 的安全。**部署课介绍的托管商多数也提供数据库服务**。**⑨ 给生产库灌数据**：脚本里硬编码的是本地连接信息——只能灌本地库。用**环境变量**？会带来不必要的麻烦：脚本只能在**生产服务器上**灌生产库（要上生产环境的 cli 跑脚本）；或者「偷偷」把本地环境文件改成指向生产库、跑完再改回来——都别扭。**原则：让脚本尽量独立于代码库**。更无痛的做法：**把连接信息作为参数传给脚本**——本地与生产都能**在自己机器上**跑同一个脚本。参数经 **process.argv** 访问：node db/populatedb.js <local-db-url>（灌本地）；node db/populatedb.js <production-db-url>（应用与库部署好之后，在自己机器上跑一次灌生产）。**Assignment 三条**：① **略读 pg 文档**——库本身轻量、文档也轻；不必全读，主要当参考用；② **升级本课项目**：**a.** db 连接信息改用**环境变量**；**b.** 首页路由加**查询参数搜索**——GET /?search=sup 应返回所有**包含 sup** 的用户名——**官方明令：不要在 JavaScript 里实现、搜索要在 SQL 里做**；**c.** 加新路由 **GET /delete**——删除 db 里全部用户名；③ **回到 Mini Message Board 项目**：之前用数组实现的留言是**临时的**（服务器重启即清空）——**我们要数据持久化**：回去用 PostgreSQL db 与 pg 重新实现：**在选定的托管服务上部署一个新 db** 并拿到连接信息；**创建 messages 表**、愿意的话用脚本灌数据（**应经由脚本完成**）；**加必要的环境变量、创建 pool、实现所需的 db 函数**；顺手**给用户输入加上合适的服务端校验**。",
      "understand": [
        "主线项目三条路由：**GET / 列名到终端、GET /new 出表单、POST /new 存库**——最小闭环先把管道打通",
        "**psql 建库建表流程**：\\l 列库 → CREATE DATABASE → \\c 连接（提示符变 top_users=#）→ CREATE TABLE → \\d 验证 → INSERT / SELECT",
        "**GENERATED ALWAYS AS IDENTITY**：id 列自动生成（从 1 起每行 +1），PostgreSQL 隐式建一个 **sequence 对象**记录下一个值——\\d 里那个 usernames_id_seq 就是它",
        "**pg 两种连接方式**：client 单连接手动管理（一次性查询可以、量大开销大）；**pool 是 client 池**、自动复用连接——Web 服务器的完美选择",
        "连接信息两种写法：属性对象（host/user/database/password/port）或 **Connection URI**（连托管服务时基本都用 URI）；**都该从环境变量读**（硬编码只是演示）",
        "**参数化查询防 SQL 注入**：\"VALUES ($1)\" + 数组传参——绝不把用户输入直接拼进 SQL（sike'); DROP TABLE usernames; -- 的教训）",
        "**种子脚本 populatedb.js**：用 Client（非 Pool）一次跑 CREATE IF NOT EXISTS + INSERT；**设计为只跑一次**；连接串走 **process.argv 命令行参数**——同一脚本灌本地与生产",
        "**本地库 vs 生产库**：本地快、易改、免联网（开发用）；生产托管在外部服务器（全球可达、可扩展、更安全）——部署课的托管商多也提供数据库服务"
      ],
      "terms": [
        {
          "en": "node-postgres (pg)",
          "zh": "Node 与 PostgreSQL 之间的接口库——Pool/Client 连接管理与 query 方法都来自它；文档轻量、当参考用"
        },
        {
          "en": "Pool vs Client",
          "zh": "pg 的两种连接方式：Client 单连接手动开关（一次性查询）；Pool 连接池自动复用（Web 服务器标准选择）"
        },
        {
          "en": "Connection URI",
          "zh": "连接字符串形态：postgresql://user:password@host:port/database——连接托管数据库服务时的通用格式"
        },
        {
          "en": "Identity column",
          "zh": "标识列：GENERATED ALWAYS AS IDENTITY 让 PostgreSQL 自动生成列值（默认 1 起步、每行 +1），并隐式创建记录下一个值的 sequence 对象"
        },
        {
          "en": "Query parameterization",
          "zh": "查询参数化：SQL 里用 $1 占位、用户输入经数组作第二参数传入——pg 替你防 SQL 注入的标准姿势"
        },
        {
          "en": "SQL injection",
          "zh": "SQL 注入：用户输入直接拼进 SQL 时被恶意构造（如 sike'); DROP TABLE usernames; --）改变语句语义的攻击"
        },
        {
          "en": "Seed script (populatedb.js)",
          "zh": "种子脚本：用代码一次性建表灌数据——设计为只跑一次；连接串经 process.argv 传入，本地与生产通用"
        },
        {
          "en": "process.argv",
          "zh": "Node 的命令行参数数组——node db/populatedb.js <db-url> 里的连接串就从这里读"
        }
      ],
      "tasks": [
        "略读 pg（node-postgres）的文档——库轻量、文档也轻，不必全读，主要当参考用（链接在资料区）",
        "升级本课项目三连：a) db 连接信息改用环境变量实现；b) 首页路由加查询参数搜索——GET /?search=sup 返回所有包含 sup 的用户名（官方明令：不要在 JavaScript 里过滤，搜索要在 SQL 里做）；c) 加新路由 GET /delete 删除 db 里全部用户名",
        "回到 Mini Message Board 项目实现真持久化：在选定的托管服务上部署一个新 db 并拿到连接信息；创建 messages 表（灌数据应经由脚本）；加必要的环境变量、创建 pool、实现所需 db 函数；顺手给用户输入加上合适的服务端校验"
      ],
      "quiz": [
        {
          "question": "psql 里建库、连库、验证表各用什么命令？CREATE TABLE 后 \\d 为什么会多出一个 usernames_id_seq？",
          "answer": "CREATE DATABASE top_users; 建库、\\c top_users 连库（提示符变 top_users=#）、\\d 查看表。多出的 usernames_id_seq 是序列对象：id 列的 GENERATED ALWAYS AS IDENTITY 让 PostgreSQL 自动生成 id 值（从 1 起每行 +1），并隐式创建这个 sequence 记录下一个可用值。"
        },
        {
          "question": "pg 的 Client 与 Pool 各是什么？Web 服务器该用哪个、为什么？",
          "answer": "Client 是单个手动管理的连接——打开、查询、关闭；一次性查询没问题，大量查询开销大。Pool 是 client 的池子：替你持有连接，查询时复用空闲连接、没有才新开。Web 服务器用 Pool——请求密集，池化连接避免了反复开关的开销（官方原话：完美选择）。"
        },
        {
          "question": "INSERT ... VALUES ($1) 里的 $1 是什么机制？官方演示的注入攻击长什么样？",
          "answer": "查询参数化：$1 是占位符，用户输入放进数组作为 pool.query 的第二参数传入，由 pg 安全地代入。反面教材是字符串拼接——用户输入 sike'); DROP TABLE usernames; -- 时会提前闭合引号与括号、把删表语句拼进查询，整张表就没了。这就是 SQL 注入。"
        },
        {
          "question": "populatedb.js 为什么用 Client 而不是 Pool？为什么官方说「脚本设计为只跑一次」？",
          "answer": "种子脚本是一次性任务：连接→执行 SQL 模板串（CREATE IF NOT EXISTS + INSERT）→关闭，用完即走，不需要池的复用能力。只跑一次因为重复执行会把 INSERT 的样例数据再插一遍（表里出现重复行）——官方流程也是先 DROP TABLE 再跑脚本，把库重置到干净状态。"
        },
        {
          "question": "给生产库灌数据，官方为什么不推荐环境变量方案、推荐什么方案？",
          "answer": "环境变量方案的麻烦：脚本只能在生产服务器上跑（要访问生产 cli），或临时改本地 env 指向生产库再改回来——都别扭且易错。官方推荐：连接信息作为命令行参数传给脚本（process.argv 读取）——node db/populatedb.js <production-db-url>，本地与生产共用同一脚本、都在自己机器上跑，脚本尽量独立于代码库。"
        }
      ],
      "optional": [],
      "note": "pool.js 示例里的硬编码连接信息是官方刻意的演示简化——注释原话「所有这些属性都应从环境变量读」，Assignment 第 2 条 a 项就是把它改造成环境变量版（上一课学的 --env-file / process.env 直接上岗）。GET /delete 是教学用的危险路由（无确认清空全表）——真实应用的删除要有确认与权限，官方在库存项目的 Extra credit 里也埋了同一个思考题。",
      "why": "这一课把两条线拧成一股：World 6 学的 SQL（建表、INSERT、SELECT）和 Express 章学的路由、控制器、表单，在 pg 这个接口库里会师。从此你的应用有了真正的记忆——留言板重启不再清零，库存项目的数据设计也有了落地的地方。参数化查询是本课最重要的安全习惯：SQL 注入与上一课的 XSS 是 Web 应用两大经典注入攻击，「数据与指令分离」的思想（$1 占位、数组传参）从这行代码开始长进肌肉里。Assignment 第 3 条把留言板接上数据库，是整章知识的第一次全量合龙。",
      "sections": [
        {
          "h": "先搭应用骨架：三条路由的最小闭环",
          "p": [
            "PostgreSQL 已经装好跑起来——现在是**用它干活**的时候。（官方口径：为简洁起见，以下把 database 简称 **db**。）**红色前置（critical note）**：先完成 SQL 课程——本课及其后所有课假设你理解 SQL 语法与概念。",
            "先创建一个 Express 应用。它只有一个功能——**把用户提供的用户名加进 db**。路由规划：**GET /**——把 db 里可用的用户名**打到终端**（现在可以先放一句 console.log 占位：\"usernames will be logged here - wip\"）；**GET /new**——显示一个 HTML 表单、**一个 username 文本输入框**、提交到下一条路由；**POST /new**——把收到的 username 数据**存进 db**（现在可以先 console.log(\"username to be saved: \", req.body.username) 占位）。",
            "上面的功能跑通后再进下一节；**相关代码归置到 routes 与 controllers 文件夹**；只有一个视图（GET /new）——用 **ejs** 还是纯 HTML 随你。"
          ]
        },
        {
          "h": "psql 建库建表：identity 列与它的序列",
          "p": [
            "终端跑 **psql** 进入 PostgreSQL shell。**\\l** 查看当前全部 db。建新库：**CREATE DATABASE top_users;**——再 \\l 确认。连库：**\\c top_users**——验证提示符应变成 **top_users=#**。",
            "建表存 username 数据：**CREATE TABLE usernames (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, username VARCHAR(255));**——**\\d** 验证：输出里应有**两样**（官方省略了部分输出细节）：**usernames | table** 与 **usernames_id_seq | sequence**。",
            "**官方 note（identity 列）**：usernames_id_seq 是什么？**GENERATED ALWAYS AS IDENTITY 子句**是「元凶」——它把 id 定义为 **identity 列**：PostgreSQL **自动为该列生成值**（默认从 1 开始、每个新行 +1）；同时**隐式创建 usernames_id_seq 序列对象**、记录下一个可用值。",
            "官方自嘲：好了，有库有表了……一张**孤零零的表**。不会孤多久——**INSERT INTO usernames (username) VALUES ('Mao'), ('nevz'), ('Lofty');**——验证：**SELECT * FROM usernames;**。"
          ]
        },
        {
          "h": "node-postgres：pool.js 与两种连接写法",
          "p": [
            "在 Express 应用里操作 PostgreSQL 经由 **node-postgres**（简称 **pg**）——我们与 db 打交道的接口库。安装：**npm install pg**。",
            "初始化：建 **db 文件夹**、写 **db/pool.js**——new Pool 传连接信息：**host**（\"localhost\" 或库所在处）、**user**（<role_name>）、**database**（\"top_users\"）、**password**（<role_password>）、**port**（5432 默认端口）。",
            "**官方注释强调：以上属性都应从环境变量读**——硬编码只为演示简洁（role 名与密码换成你上一课安装时设好的）。",
            "**替代写法 Connection URI**：connectionString 一行——**postgresql://<role_name>:<role_password>@localhost:5432/top_users**；**连接托管数据库服务时你基本都会用 URI**。两种任选、继续往下。"
          ]
        },
        {
          "h": "官方 note：Client 与 Pool 的分工",
          "p": [
            "**pg 有两种连接 db 的方式：client 与 pool。**",
            "**client 是单个连接、手动管理**：打开连接、做查询、关闭它。一次性查询没问题——但**查询一多开销就大**。「要是能 somehow 把 client 留住不就好了？」——是的！**Pool 登场**：顾名思义是 **client 的池子**——**替你持有连接**；查询时它**程序化地新开连接、除非已有空闲的**。官方结论：**Web 服务器的完美选择。**"
          ]
        },
        {
          "h": "queries.js：参数化查询防 SQL 注入",
          "p": [
            "有了初始化的 Pool 就能用 **query 方法**。建 **db/queries.js**——按项目需求（修订后）要两个 db 交互：**取全部用户名**与**插入新用户名**：**getAllUsernames()**——const { rows } = await pool.query(\"SELECT * FROM usernames\")、return rows；**insertUsername(username)**——await pool.query(\"INSERT INTO usernames (username) VALUES ($1)\", [username])。",
            "**官方 note（Parameterization）**：INSERT 里的 **$1** 是什么来头？另一种写法是拼接：**\"INSERT INTO usernames (username) VALUES ('\" + username + \"')\"**——把**用户输入直接放进查询**。心术不正的用户输入 **sike'); DROP TABLE usernames; --** 就能**大肆破坏**——吓人的东西。**这叫 SQL 注入。**",
            "**pg 提供查询参数化来防止它**：不直接传用户输入，而是**放进数组作为第二个参数**——剩下的 pg 处理。"
          ]
        },
        {
          "h": "控制器调用与种子脚本 populatedb.js",
          "p": [
            "在特定控制器里调用上面两个函数（函数名可以不同，重要的是理解 db 函数如何被调用）：**getUsernames**——await db.getAllUsernames()、console.log 后把名字 join 进 res.send；**createUsernameGet**——渲染表单；**createUsernamePost**——req.body 解构 username、await db.insertUsername(username)、res.redirect(\"/\")。**跑一圈应用**——希望一切如预期。",
            "**用脚本灌库**：你可能注意到建表灌数据有多繁琐——好在有代码之力。建 **db/populatedb.js**：首行 **#! /usr/bin/env node**；引入 **Client**；SQL 模板字符串里放 **CREATE TABLE IF NOT EXISTS usernames (...)** + **INSERT INTO usernames (username) VALUES ('Bryan'), ('Odin'), ('Damon');**；main() 里 seeding... → new Client({ connectionString }) → connect → query(SQL) → end → done（完整形态见代码示例区）。",
            "使用：登录 psql、连 top_users、**DROP TABLE usernames;**——然后 **node db/populatedb.js**，或把它**加进 package.json 的 scripts**。**注意：脚本设计为只跑一次。**"
          ]
        },
        {
          "h": "本地库 vs 生产库：process.argv 灌生产数据",
          "p": [
            "**本地数据库适合开发**：交互更快、修改更容易、不需要联网——原型与测试新功能时尤其有用。项目要公开时，切换到**托管在外部服务器**（独立于本机）的**生产数据库**：**全球可达、可扩展、更 robust 的安全**。**部署课介绍的托管商多数也提供数据库服务。**",
            "**给生产库灌数据**：脚本里硬编码的是本地连接信息——只能灌本地。用环境变量？麻烦：脚本只能在**生产服务器**上灌生产库（得访问生产 cli）；或偷偷改本地环境文件指向生产库、跑完再改回来。",
            "**原则：让脚本尽量独立于代码库。**更无痛的做法：**连接信息作为参数传给脚本**——本地与生产都**在自己机器上**跑同一脚本。参数经 **process.argv** 访问：node db/populatedb.js <local-db-url>（灌本地）；node db/populatedb.js <production-db-url>（应用与 db 部署后，在自己机器上跑一次灌生产）。"
          ]
        },
        {
          "h": "Assignment：三条升级路线",
          "p": [
            "① **略读 pg 文档**——库轻量、文档也轻；不必全读，**主要当参考用**（资料区有链接）。",
            "② **升级本课项目**：**a.** db 连接信息改用**环境变量**；**b.** 首页路由加**查询参数搜索**——GET /?search=sup 应返回所有**包含 sup** 的用户名——**官方明令：不要在 JavaScript 里实现，搜索要在 SQL 里做**；**c.** 加新路由 **GET /delete**——删除 db 里全部用户名。",
            "③ **回到 Mini Message Board**：之前的留言是数组实现的**临时数据**（重启即清空）——**我们要数据持久化**。回去用 PostgreSQL db 与 pg 重新实现：在选定的托管服务上**部署一个新 db** 并拿到连接信息；**创建 messages 表**（愿意的话灌数据——**应经由脚本完成**）；**加必要的环境变量、创建 pool、实现所需 db 函数**；顺手**给用户输入加上合适的服务端校验**。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "sql",
          "code": "CREATE DATABASE top_users;\n\n\\c top_users\n\nCREATE TABLE usernames (\n   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n   username VARCHAR ( 255 ) \n);\n\nINSERT INTO usernames (username)\nVALUES ('Mao'), ('nevz'), ('Lofty');\n\nSELECT * FROM usernames;",
          "note": "psql 建库建表全流程：\\c 连库后提示符变 top_users=#；id 列的 GENERATED ALWAYS AS IDENTITY 让 PostgreSQL 自动生成值并隐式创建 usernames_id_seq 序列（\\d 可见）；\\l 列库、\\d 看表是两个高频元命令。"
        },
        {
          "lang": "javascript",
          "code": "const { Pool } = require(\"pg\");\n\n// All of the following properties should be read from environment variables\n// We're hardcoding them here for simplicity\nmodule.exports = new Pool({\n  host: \"localhost\", // or wherever the db is hosted\n  user: \"<role_name>\",\n  database: \"top_users\",\n  password: \"<role_password>\",\n  port: 5432 // The default port\n});",
          "note": "db/pool.js 属性对象写法：五项连接信息 + 导出 Pool 实例。官方注释即纪律：所有属性都应从环境变量读——硬编码只为演示（Assignment 第 2 条就让你改造它）。"
        },
        {
          "lang": "javascript",
          "code": "const { Pool } = require(\"pg\");\n\n// Again, this should be read from an environment variable\nmodule.exports = new Pool({\n  connectionString: \"postgresql://<role_name>:<role_password>@localhost:5432/top_users\"\n});",
          "note": "Connection URI 写法：一个字符串带全部连接信息——连托管数据库服务（Railway/Render/Neon/Aiven）时基本都拿到这种形态的 URI，直接进 connectionString（当然，从环境变量读）。"
        },
        {
          "lang": "javascript",
          "code": "const pool = require(\"./pool\");\n\nasync function getAllUsernames() {\n  const { rows } = await pool.query(\"SELECT * FROM usernames\");\n  return rows;\n}\n\nasync function insertUsername(username) {\n  await pool.query(\"INSERT INTO usernames (username) VALUES ($1)\", [username]);\n}\n\nmodule.exports = {\n  getAllUsernames,\n  insertUsername\n};",
          "note": "db/queries.js：db 交互集中在一个文件、控制器只调函数。关键在 insertUsername——$1 占位 + 数组传参 = 查询参数化：用户输入永远不直接拼进 SQL，pg 替你防住 SQL 注入。"
        },
        {
          "lang": "javascript",
          "code": "#! /usr/bin/env node\n\nconst { Client } = require(\"pg\");\n\nconst SQL = `\nCREATE TABLE IF NOT EXISTS usernames (\n  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n  username VARCHAR ( 255 )\n);\n\nINSERT INTO usernames (username) \nVALUES\n  ('Bryan'),\n  ('Odin'),\n  ('Damon');\n`;\n\nasync function main() {\n  console.log(\"seeding...\");\n  const client = new Client({\n    connectionString: \"postgresql://<role_name>:<role_password>@localhost:5432/top_users\",\n  });\n  await client.connect();\n  await client.query(SQL);\n  await client.end();\n  console.log(\"done\");\n}\n\nmain();",
          "note": "种子脚本 populatedb.js：一次性任务用 Client（开→查→关）不用 Pool；SQL 模板串一次带建表与灌数据。官方流程：先 psql 里 DROP TABLE usernames 再跑 node db/populatedb.js——脚本设计为只跑一次（重复跑会重复 INSERT）。"
        },
        {
          "lang": "bash",
          "code": "# populating local db \nnode db/populatedb.js <local-db-url>\n\n# populating production db\n# run it from your machine once after deployment of your app & db\nnode db/populatedb.js <production-db-url>",
          "note": "连接串走命令行参数（脚本里经 process.argv 读）：同一个脚本灌本地与生产，都在自己机器上跑——官方原则「让脚本尽量独立于代码库」，比环境变量方案（只能上生产服务器跑、或临时改 env）无痛得多。"
        }
      ],
      "pitfalls": [
        {
          "title": "把用户输入拼进 SQL 字符串",
          "text": "官方演示的经典事故：拼接写法遇到 sike'); DROP TABLE usernames; -- 这类输入，引号与括号被提前闭合、删表语句成为查询的一部分——表就没了。纪律只有一条：永远 $1 占位 + 数组传参（参数化），任何用户输入都不直接进 SQL 文本。"
        },
        {
          "title": "连接信息硬编码进代码",
          "text": "官方示例的硬编码是刻意的演示简化、注释里明说该从环境变量读——照抄进真实项目就是把数据库密码写进了 git 历史。pool.js 的连接信息与 populatedb 的连接串都走环境变量或命令行参数（Assignment 第 2 条 a 项就是这个改造）。"
        },
        {
          "title": "种子脚本反复跑",
          "text": "populatedb.js 的 INSERT 没有去重逻辑——跑两遍样例数据就双份。官方明说「脚本设计为只跑一次」；要重置就按官方流程先 DROP TABLE 再跑（CREATE TABLE IF NOT EXISTS 保证建表幂等，INSERT 不幂等）。"
        },
        {
          "title": "在 JavaScript 里过滤搜索结果",
          "text": "Assignment 第 2 条 b 项官方明令：不要在 JavaScript 里实现搜索、要在 SQL 里做。把全表拉进内存再 filter 在数据量大时是性能陷阱，也浪费了 SQL 课程学的 LIKE/ILIKE 与查询参数——数据层的事交给数据层。"
        }
      ],
      "official": {
        "assignment": [
          "略读 pg 的文档——库轻量、文档也轻；不必全读，主要当参考用",
          "升级本课项目：a) db 连接信息实现环境变量；b) 首页路由加查询参数搜索（GET /?search=sup 返回所有含 sup 的用户名；不要在 JavaScript 里实现、搜索要在 SQL 里做）；c) 加新路由 GET /delete 删除全部用户名",
          "回到 Mini Message Board 项目实现数据持久化：在托管服务部署新 db 并取连接信息；创建 messages 表（灌数据经由脚本）；加环境变量、创建 pool、实现 db 函数；顺手加服务端输入校验"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/express/using_postgresql.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "3bebf6535ce4f069ff48466c515531955df94fae15a07e9ea25747bde5cb6534",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "node-path-nodejs-inventory-application",
      "title": "Project: Inventory Application",
      "zh": "项目：库存管理应用",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-nodejs-inventory-application",
      "summary": "Express 章的收官项目（全站第 27 门 Project）：官方说这一章体量巨大、你学了非常多的东西——让知识定型的唯一方法就是练习。任务：为一家想象中的商店创建库存管理应用（Inventory app）——什么生意由你定：杂货、汽车配件、婴儿玩具、乐器、小马……什么都行。应用要有 categories（品类）与 items（商品）：用户到首页选一个品类查看、然后看到该品类下每件商品的列表；items 与 categories 都要有完整的 CRUD 方法——任何访问者都能创建、读取、更新、删除任何商品或品类。8 步官方路线：搭 Express 项目与新 PostgreSQL 数据库 → 动手前先写下需要的全部数据库表、字段与关系（官方给了两个设计示例：游戏管理应用的 game/genre/developer 多对多、宝可梦管理应用的 pokemon/trainer/type 归属关系——任何够格的库存应用都有实体间的关系与约束，想清楚你的）→ 搭所需路由与控制器 → 先做全部 READ 视图（看品类、看商品）→ 做全部表单与 create/update 控制器 → 设计删除行为（删一个还有商品的品类会发生什么？连商品一起删？只解除关联？还是别的？——取决于你的应用需求）→ 有信心后用脚本往本地库灌假数据、部署后再灌一次 → 部署上线展示成果。Extra credit 两条：把它变好看；给破坏性操作（删除与更新）加一道秘密 admin 密码确认——官方预告「后面课程会学安全密码的用户体系」，现在先自己想办法。",
      "guide": "以下是官方项目要求的中文化与拆解。**官方开场**：好！让我们稍微活动一下筋骨！**这一章体量巨大（humongous）、你学了非常多的东西**——让知识**定型（stick）的唯一方法就是练习**！**项目定义**：为一家**想象中的商店**创建一个**库存管理应用（Inventory app）**。**什么生意由你定**——杂货、汽车配件、婴儿玩具、乐器、小马（ponies），或任何东西！**核心需求**：应用要有 **categories（品类）与 items（商品）**：用户到**首页**可以**选择一个品类查看**、然后得到**该品类下每件商品的列表**；**items 与 categories 都要包含全部 CRUD 方法**——任何访问站点的人都能对任何商品或品类做 **Create（创建）、Read（读取）、Update（更新）、Delete（删除）**。**第 1 步**：搭一个 **Express 项目**与一个**新的 PostgreSQL 数据库**。**第 2 步（官方强调：动手之前）**：花点时间**写下你需要的全部数据库表与字段、以及它们之间的关系**。官方给了两个设计示例：**a.** 游戏管理应用——可以有 **game、genre、developer** 三种实体：一个游戏可以有**一个或多个**开发者与类型；同样一个开发者可以开发**多个游戏**（多对多）。**b.** 宝可梦管理应用——可以有 **pokemon、trainer、type** 三种实体：每只宝可梦**必须归属于一个类型**；一个训练师**可以有多只**宝可梦（归属 + 一对多）。官方结论：**任何够格（sufficient）的库存应用，其实体之间都会有关系（relations）与约束（constraints）——为你的库存应用想清楚这些数据库细节**。**第 3 步**：搭好你需要的**路由与控制器**。**第 4 步**：创建全部 **READ 视图**（即：查看品类、查看商品）。**第 5 步**：创建**全部表单**、构建 **create 与 update** 动作所需的控制器。**第 6 步**：想清楚**删除功能**。官方三连问：**删一个还装着商品的品类会发生什么？应该把商品也一起删掉？还是只把品类从商品上解除关联？或者别的什么？**——这个具体行为**取决于你的应用需求**（没有唯一正确答案，但必须是有意识的设计决定）。**第 7 步**：对项目有信心后，**经由脚本往本地数据库灌假数据（dummy data）**；**部署之后再灌一次**（生产库是空的——「使用 PostgreSQL」一课的 populatedb.js 与 process.argv 方案直接复用）。**第 8 步**：**部署它，展示你的成果！****Extra credit（选做）两条**：① **把它变好看（Make it pretty!）**；② 官方预告：后面的课会学**用安全密码创建用户**——但现在我们不想让**随便什么人**都能删除编辑库存！**自己想办法保护破坏性动作**（删除与更新）：让用户**输入秘密 admin 密码**来确认操作。**本站验收清单（非官方，供自查）**：① 首页列出全部品类、点品类进商品列表；② 品类与商品都能创建（表单 + 校验）、查看、更新（表单回填）、删除；③ 删除含商品的品类时行为与你第 6 步的设计一致（且数据库层面无孤儿行或按设计处理）；④ 数据经种子脚本灌入、重启不丢；⑤ 应用已部署、公网 URL 可访问、生产库数据独立灌入；⑥ （选做）破坏性操作有 admin 密码门槛。",
      "understand": [
        "这是 Express 章的**毕业答辩**：MVC 全套（路由/控制器/视图）+ 表单校验 + PostgreSQL + 种子脚本 + 部署，一章所学在一个项目里全部上场",
        "**先设计后动手**：官方把「写下全部表、字段与关系」放在写代码之前（第 2 步）——两个示例（游戏/宝可梦）演示的都是**实体关系与约束**的识别方法",
        "**CRUD 全覆盖且无权限门槛**（现状）：任何访问者都能增删改查任何品类与商品——这正是 Extra credit 2 要补的洞（admin 密码保护破坏性操作）",
        "**删除行为是设计决定不是技术细节**：删品类时商品的三种去向（级联删 / 解除关联 / 其他）取决于应用需求——官方三连问要求你有意识地选",
        "**两次灌数据**：本地库一次、部署后生产库一次——populatedb.js 的 process.argv 方案在这里直接复用"
      ],
      "terms": [
        {
          "en": "Inventory application",
          "zh": "库存管理应用：按品类组织商品、支持全套 CRUD 的管理站——本项目的载体，商店类型自定"
        },
        {
          "en": "CRUD",
          "zh": "Create / Read / Update / Delete 四种基本数据操作——官方要求品类与商品都完整覆盖"
        },
        {
          "en": "Relations & constraints",
          "zh": "关系与约束：实体之间的关联规则（一对多、多对多、必须归属）——官方两个示例（游戏/宝可梦）演示的设计核心"
        },
        {
          "en": "Dummy data",
          "zh": "假数据：经脚本灌入的演示数据——本地与生产库各灌一次（种子脚本复用）"
        },
        {
          "en": "Destructive actions",
          "zh": "破坏性操作：删除与更新这类不可逆或高影响的动作——Extra credit 要求加 admin 密码门槛保护"
        }
      ],
      "tasks": [
        "搭一个 Express 项目与一个新的 PostgreSQL 数据库",
        "动手前先写下你需要的全部数据库表、字段与它们之间的关系（官方示例：游戏管理应用的 game/genre/developer 多对多；宝可梦管理应用的 pokemon/trainer/type 归属与一对多）——任何够格的库存应用都有实体关系与约束，想清楚你的",
        "搭好你需要的路由与控制器",
        "创建全部 READ 视图（查看品类、查看商品）",
        "创建全部表单，构建 create 与 update 动作所需的控制器",
        "想清楚删除功能：删一个还有商品的品类会发生什么？连商品一起删？只把品类从商品上解除关联？还是别的？——具体行为取决于你的应用需求",
        "对项目有信心后，经由脚本往本地数据库灌假数据；部署之后再做一次",
        "部署它，展示你的成果！"
      ],
      "quiz": [
        {
          "question": "官方为什么把「写下全部表、字段与关系」放在写任何代码之前？两个设计示例各演示了什么关系形态？",
          "answer": "因为任何够格的库存应用都有实体间的关系与约束——它们是数据库设计的地基，代码只是它的投影；先想清楚能避免建表后反复迁移。示例 a（游戏管理）：game 与 developer/genre 是多对多（一个游戏多个开发者，一个开发者多个游戏）；示例 b（宝可梦管理）：pokemon 必须归属一个 type（约束），trainer 可以有多只 pokemon（一对多）。"
        },
        {
          "question": "「删一个还有商品的品类会发生什么」——官方给了哪几种候选行为？为什么说这是设计决定？",
          "answer": "官方三连问给出候选：把商品也一起删掉（级联删除）、只把品类从商品上解除关联（置空/保留商品）、或其他方案。没有唯一正确答案——具体行为取决于你的应用需求：商品离开品类还有没有意义、误删品类的代价有多大，都是业务判断。数据库的外键约束（ON DELETE CASCADE 等）是实现层，决定权在设计层。"
        },
        {
          "question": "为什么假数据要灌两次（本地一次、部署后一次）？Extra credit 2 保护破坏性操作时官方预告了什么？",
          "answer": "本地库与生产库是两个独立的数据库——部署不会把本地数据带过去，生产库是空的，所以 populatedb 脚本（连接串走 process.argv）要对生产库再跑一次。Extra credit 2：官方预告后面的课（身份认证章）会学用安全密码创建用户，但现在要先自己想办法——给删除与更新加一道秘密 admin 密码确认，不让随便什么人都能改库存。"
        }
      ],
      "optional": [],
      "note": "Project 红线课：本站不提供成品代码，examples 为空数组——数据库表结构、路由清单、控制器与视图全部自己设计（官方第 2 步的「先写下关系」正是设计本体）。这是全站第 27 门 Project 课、Express 章三门项目（留言板→部署→库存）的收官。Extra credit 2 的 admin 密码是「身份认证」章（World 7 下一阶段）的预告：那时你会学到密码哈希与会话的正规做法，现在的手动方案届时值得回头重构。",
      "why": "留言板是官方牵着走的单车道，库存项目是自己选路线的越野赛：商店类型你定、表与关系你设计、删除行为你拍板——第一次完整经历「需求→数据设计→实现→部署」的全流程。它也是 World 7 前半场（Express + PostgreSQL）的总验收：MVC、表单校验、参数化查询、种子脚本、PaaS 部署，缺一块这里都会露馅。做完部署上线，你就拥有了第一个全栈动态应用——World 8 求职章会告诉你，这样的项目正是简历上「能独立交付」的证据。",
      "sections": [
        {
          "h": "这是个什么项目",
          "p": [
            "官方开场：好！让我们稍微活动一下筋骨！**这一章体量巨大、你学了非常多的东西**——让知识定型的**唯一方法就是练习**！",
            "为一家**想象中的商店**创建**库存管理应用**。**什么生意由你定**——杂货、汽车配件、婴儿玩具、乐器、小马……或任何东西！",
            "**核心需求**：应用有 **categories（品类）与 items（商品）**——用户到首页**选一个品类查看**、得到**该品类下每件商品的列表**；**items 与 categories 都要有全部 CRUD 方法**：任何访问者都能 **Create、Read、Update、Delete** 任何商品或品类。"
          ]
        },
        {
          "h": "第 1–2 步：搭项目 + 先设计数据库",
          "p": [
            "**第 1 步**：搭一个 **Express 项目**与一个**新的 PostgreSQL 数据库**。",
            "**第 2 步（官方强调：动手之前）**：花点时间**写下你需要的全部数据库表与字段、以及它们之间的关系**。官方两个设计示例：",
            "**a. 游戏管理应用**：game、genre、developer 三种实体——一个游戏可以有**一个或多个**开发者与类型；一个开发者可以开发**多个游戏**。",
            "**b. 宝可梦管理应用**：pokemon、trainer、type 三种实体——每只宝可梦**必须归属于一个类型**；一个训练师**可以有多只**宝可梦。",
            "官方结论：**任何够格的库存应用，实体间都有关系与约束**——为你的库存应用**想清楚这些数据库细节**。"
          ]
        },
        {
          "h": "第 3–5 步：路由控制器、READ 视图、表单",
          "p": [
            "**第 3 步**：搭好你需要的**路由与控制器**。",
            "**第 4 步**：创建全部 **READ 视图**——查看品类、查看商品（官方建议先做读的一侧，骨架立起来再长写的一侧）。",
            "**第 5 步**：创建**全部表单**、构建 **create 与 update** 动作所需的控制器——「表单与数据处理」一课的成对路由（GET 出表单 / POST 收数据）与校验链在这里全量复用。"
          ]
        },
        {
          "h": "第 6 步：删除行为是设计决定",
          "p": [
            "官方三连问：**删一个还装着商品的品类会发生什么？应该把商品也一起删掉吗？应该只把品类从商品上解除关联吗？或者别的什么？**",
            "**这个具体行为取决于你的应用需求**——没有唯一正确答案，但必须是有意识的设计决定（想清楚商品离开品类还有没有意义、误删的代价有多大），再落到数据库约束与控制器逻辑上。"
          ]
        },
        {
          "h": "第 7–8 步：种子数据与部署",
          "p": [
            "**第 7 步**：对项目有信心后，**经由脚本往本地数据库灌假数据（dummy data）**；**部署之后再做一次**——生产库是空的，「使用 PostgreSQL」的 populatedb.js（连接串走 process.argv）直接复用。",
            "**第 8 步**：**部署它，展示你的成果！**——「部署」一课的 PaaS 流程（Railway/Render + Neon/Aiven 数据库）在这里全量实战。"
          ]
        },
        {
          "h": "Extra credit（选做）+ 本站验收清单",
          "p": [
            "**选做 1**：**把它变好看（Make it pretty!）**。",
            "**选做 2**：官方预告——后面的课会学**用安全密码创建用户**；但现在不想让**随便什么人**都能删改库存：**自己想办法保护破坏性动作**（删除与更新）——让用户**输入秘密 admin 密码**确认操作。",
            "**本站自拟验收清单（非官方要求，供自查）**：① 首页列品类、点入看商品列表；② 品类与商品四操作（CRUD）全部可用；③ 删除含商品的品类行为与你的第 6 步设计一致；④ 数据经脚本灌入、重启不丢；⑤ 已部署、公网可访问、生产库独立灌数；⑥（选做）破坏性操作有 admin 密码门槛。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "跳过第 2 步直接写代码",
          "text": "官方把「写下全部表、字段与关系」放在一切实现之前，不是仪式：关系想错（该多对多建成一对多、缺约束），后面就是反复改表迁移数据。先纸上设计、拿官方两个示例对照自己的商店，再动手建表。"
        },
        {
          "title": "删除行为没想清楚就上线",
          "text": "删品类时商品级联消失还是变成孤儿行，是业务决定不是默认行为——官方三连问就是逼你显式选择。没想清楚的结果：演示时删个品类、商品数据静默丢失（或留下永远查不到的孤儿行），两种都是事故。"
        },
        {
          "title": "只灌本地库、忘了生产库",
          "text": "部署成功但线上应用空空如也——生产库是独立的空库。官方第 7 步明说「部署之后再做一次」：用同一个种子脚本、把生产库连接串经 process.argv 传进去跑一次，线上才有数据可看。"
        }
      ],
      "official": {
        "assignment": [
          "搭一个 Express 项目与一个新的 PostgreSQL 数据库",
          "动手前写下你需要的全部数据库表、字段与它们之间的关系（官方示例：游戏管理应用的 game/genre/developer 多对多；宝可梦管理应用的 pokemon/trainer/type 归属与一对多）——任何够格的库存应用都有关系与约束",
          "搭好你需要的路由与控制器",
          "创建全部 READ 视图（查看品类、查看商品）",
          "创建全部表单，构建 create 与 update 动作所需的控制器",
          "想清楚删除功能：删还有商品的品类会发生什么？级联删、解除关联还是别的？——取决于你的应用需求",
          "对项目有信心后经由脚本往本地库灌假数据；部署后再做一次",
          "部署它，展示你的成果！"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "Extra credit：把它变好看（Make it pretty!）",
          "Extra credit：保护破坏性动作（删除与更新）——让用户输入秘密 admin 密码确认操作；官方预告后面课程会学安全密码的用户体系"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/express/project_inventory_application.md（本站自行编写简体讲解与任务拆解，未改编自任何第三方中文课程；Project 红线：不提供成品答案）",
        "sha256": "c0da58d916ac9c01f974f81adbe9d3d64e81db052c9289659bfb9e489e7d0b90",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "node-path-nodejs-authentication-basics",
      "title": "Authentication Basics",
      "zh": "身份认证基础",
      "group": 2,
      "url": "https://www.theodinproject.com/lessons/node-path-nodejs-authentication-basics",
      "summary": "World 7「身份认证」章的开篇大课（官方原文约 20KB，是本章唯一知识课），教你给 Express 应用加上「注册—登录—登出」全套用户体系，主角是认证中间件 passport.js。主线是一个极简应用：为了演示方便，官方刻意把除视图外的一切写进单个 app.js（并明说真实项目应当拆分模块——最佳实践警示在开头就给出）。八块主干：① Set up——psql 建新库、建 users 表（id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY + username VARCHAR(255) + password VARCHAR(255)——上一课 identity 列知识直接复用）；npm install express express-session pg passport passport-local ejs 一次装齐；app.js 骨架里三个新中间件的**使用顺序**是硬要求：app.use(session({secret, resave: false, saveUninitialized: false})) → app.use(passport.session()) → app.use(express.urlencoded({extended: false}))；官方警告框（lesson-note--warning）：此刻密码还是明文入库，这在任何真实项目里都是**非常糟糕**的做法，课末必须回头补 bcrypt，不许跳过；express-session 我们并不直接使用，它是 passport 在幕后调用的依赖。② Creating users——sign-up-form 模板 + GET /sign-up 渲染 + POST /sign-up 用参数化查询 INSERT INTO users（$1/$2 传 username 与 password——SQL 注入防线延续）；官方明说为节省篇幅此课不做净化与校验，但「到了该做的时候别忘了」，后面项目会补。③ Authentication 与 Strategies——passport 用「Strategies（策略）」认证用户，官方有 500+ 种策略，本课只用最基本也最常见的用户名+密码策略 LocalStrategy；passport.use(new LocalStrategy(async (username, password, done) => {...}))：按 username 查库、查无此人 done(null, false, {message: \"Incorrect username\"})、密码不符 done(null, false, {message: \"Incorrect password\"})、全对 done(null, user)、异常 done(err)——这个函数我们从不直接调用，它像中间件一样在 passport.authenticate() 时被自动执行，done 也由 passport 提供。④ 会话与序列化（Functions two and three）——为了让用户登录后**保持**登录，passport 内部调用 express-session 创建一个名为 connect.sid 的 cookie 存进浏览器；passport.serializeUser((user, done) => done(null, user.id)) 定义「往会话里存什么」（只存 user.id）；passport.deserializeUser(async (id, done) => {...}) 定义「从会话取回 id 后怎么办」（按 id 查库、done(null, user) 把用户对象挂到 req.user）；两个函数同样只定义不调用，passport 幕后使用；官方解释要求我们定义它们的原因：确保会话里要找的数据在数据库中真实存在。⑤ Log-in form 与魔法一行——登录表单与注册表单同形，只是 action 改 POST 到 /log-in；路由处理只有一句：app.post(\"/log-in\", passport.authenticate(\"local\", { successRedirect: \"/\", failureRedirect: \"/\", failureMessage: true }))；authenticate 中间件幕后干了一堆事：从请求体取 username/password、跑 LocalStrategy 查库比对、创建会话 cookie、按成败重定向；failureMessage: true 让错误消息进入 req.session.messages 数组供后续中间件读取；因为登录表单就放在首页，成败都回 \"/\"。⑥ 条件渲染与登出——passport 中间件检查随 req 进来的 cookie，有登录用户就挂 req.user；app.get(\"/\") 把 user: req.user 传给视图，index.ejs 用 <% if (locals.user) { %> 分支：已登录显示 WELCOME BACK 与 LOG OUT 链接，未登录显示表单；登出路由用 passport 自动挂上的 req.logout((err) => {...})，成功后重定向 \"/\"。⑦ 官方 tip——res.locals 全应用可见（含视图）：在 passport 中间件实例化之后、渲染视图之前插一段 app.use((req, res, next) => { res.locals.currentUser = req.user; next(); })，所有视图都能直接用 currentUser，不必逐个控制器手动传。⑧ Securing passwords with bcrypt——npm install bcryptjs（另有 C++ 写的 bcrypt 模块，技术上更快但安装常出麻烦，两者用法相同，现阶段用 bcryptjs 即可）；密码哈希=把密码过一遍单向哈希函数（变长输入映射为定长伪随机输出）；注册处改 const hashedPassword = await bcrypt.hash(req.body.password, 10)——第二参数是 salt（盐）长度：盐=额外随机字符拼进密码再哈希，让相同密码的用户得到不同哈希、防彩虹表（rainbow table）与字典攻击（dictionary attack）；通常盐要单独存库，但 bcryptjs 的哈希算法自动把盐嵌进哈希本身，无需单存；哈希函数偏慢，所以入库操作要放进回调/await 之后；LocalStrategy 里把 user.password !== password 换成 const match = await bcrypt.compare(password, user.password)，不匹配才 done(null, false, ...)；官方提醒：加了 bcrypt 之前注册的旧用户将无法登录——安全的小代价，也是下个项目从一开始就上 bcrypt 的好理由。Assignment 两条：①看 YouTube 播放列表（PLYQSCk-qyTW2ewJ05f_GKHtTIzjynDgjK）第 1、2、3、5、6 集（Express 会话与 Passport 本地策略），带四条官方批注：视频中 app.use(passport.initialize()) 在当前版本 Passport 已不需要写；视频用 MongoDB，全部可替换为 PostgreSQL；视频 3（express-session 完全指南 J1qXK66k1y4）与视频 5（Passport Local 配置 xMEOT9J0IvI）演示用 connect-mongo 把会话存进 MongoDB 连接，我们用 PostgreSQL 要换成 connect-pg-simple（实现看其 npm 页）；会话存储所需的表默认不会自动创建，务必查 npm 页的可用选项。②读 Passport: The Hidden Manual（github jwalton/passport-api-docs），对 Passport 主要函数有更全面的解释。Additional resources 两条（选读）：密码存储的不同方法与风险概览视频（8ZtInClXe1Q）、加密哈希函数原理的 Wikipedia 深潜文。",
      "guide": "以下是官方原课的中文化梳理。**开场**：让用户能注册、登录、登出，是 Web 应用的关键功能——准备工作不少，但没有一步特别难。本课用 **passport.js**（优秀的认证与会话中间件）搭一个极简 Express 应用。**官方开场声明**：为演示方便，除视图外全部代码放进一个文件；真实项目的最佳实践是**把关注点与功能拆进独立模块**。**① Set up**：先在 psql 里建新库，建 **users 表**（不是上上课的 usernames）：CREATE TABLE users (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, username VARCHAR(255), password VARCHAR(255));——identity 列自动发号（上一课知识）。新目录 npm init，然后一次装齐依赖：**npm install express express-session pg passport passport-local ejs**。app.js 骨架：require 六个模块（path / Pool / express / session / passport / LocalStrategy——注意 LocalStrategy 的取法是 require(\"passport-local\").Strategy）；视图引擎 ejs；**中间件顺序**（本课最重要的隐形知识点）：**app.use(session({ secret: \"cats\", resave: false, saveUninitialized: false }))** → **app.use(passport.session())** → **app.use(express.urlencoded({ extended: false }))**——session 必须在 passport.session() 之前，urlEncoded 负责解析表单请求体。views/index.ejs 先放个 hello world。**官方警告框**：此刻用户密码是**明文入库**——真实项目里这是非常糟糕的主意；课末会用 bcrypt 正确加密，**别跳过那部分**。**express-session 的角色**：我们并不直接用它，它是 passport.js 在幕后使用的依赖（它做什么可看 Express 官方 GitHub 的 session 包）。**② Creating users**：先有注册表单才有用户可认证。sign-up-form 模板：username 文本框 + password 密码框，表单 action=\"/sign-up\" method=\"POST\"；路由 app.get(\"/sign-up\", (req, res) => res.render(\"sign-up-form\"))；处理提交：**app.post(\"/sign-up\", async (req, res, next) => { try { await pool.query(\"INSERT INTO users (username, password) VALUES ($1, $2)\", [req.body.username, req.body.password]); res.redirect(\"/\"); } catch(err) { return next(err); } })**——参数化查询防注入（数据库课纪律延续）；**官方明说**：为简洁此课不做净化与校验，但到你做项目时**别忘了**（后面有机会应用）。跑通后访问 /sign-up 提交表单，重定向回首页，psql 里能看到第一个用户。**③ Authentication——Strategies 与 LocalStrategy**：先花一分钟浏览 passport.js 官网——文档里几乎有配置所需的一切，做项目时要常回来查。Passport 用**Strategies（策略）**认证用户，**超过 500 种**，本课聚焦最基本也最常见的用户名+密码策略——官方叫 **LocalStrategy**（文档在 passportjs.org/docs/username-password/）。要往 app.js 加**三个函数** + 一个 /log-in 的 app.post。**函数一：设置 LocalStrategy**：passport.use(new LocalStrategy(async (username, password, done) => { try { const { rows } = await pool.query(\"SELECT * FROM users WHERE username = $1\", [username]); const user = rows[0]; if (!user) { return done(null, false, { message: \"Incorrect username\" }); } if (user.password !== password) { return done(null, false, { message: \"Incorrect password\" }); } return done(null, user); } catch(err) { return done(err); } }))。它将在后面调用 passport.authenticate() 时被执行：拿 username 和 password 去库里找人、比对密码；都对（库里有此人且密码匹配）就认证通过放行。**我们不会直接调用这个函数**，所以不必自己提供 done——它有点像中间件，passport 认证时替我们调。**④ 函数二与函数三：会话与序列化**：要让用户登录后**保持**登录状态（在应用里走动不掉线），passport 内部调用 express-session 的函数，用一些数据创建名为 **connect.sid** 的 cookie 存进用户浏览器。接下来两个函数定义 passport 创建与解码 cookie 时**找哪一点信息**；要求我们定义它们，是为了确保它要找的数据在数据库里**真实存在**。**passport.serializeUser** 接一个回调，内含我们想存进会话数据的信息：passport.serializeUser((user, done) => { done(null, user.id); })——登录成功拿到 user 对象后，把 **id 属性**存进会话数据。**passport.deserializeUser** 在取回会话时被调用，抽出我们「序列化」进去的数据，最终把东西挂到请求对象的 **.user 属性（req.user）**供本次请求余下部分使用：passport.deserializeUser(async (id, done) => { try { const { rows } = await pool.query(\"SELECT * FROM users WHERE id = $1\", [id]); const user = rows[0]; done(null, user); } catch(err) { done(err); } })——用会话里的 id 查库拿回完整用户对象。这两个函数同样**只定义、不手动调用**，passport 幕后使用。**⑤ Log-in form 与「魔法一行」**：把登录表单直接加进 index 模板——与注册表单长得一样，只是 action 改为 POST 到 **/log-in**。然后是魔法部分：**app.post(\"/log-in\", passport.authenticate(\"local\", { successRedirect: \"/\", failureRedirect: \"/\", failureMessage: true }))**。只需调用 passport.authenticate()，这个中间件幕后做了大量工作：在请求体里找名为 **username** 和 **password** 的参数 → 跑我们定义的 LocalStrategy 查库比对 → 创建会话 cookie 存进浏览器（供之后所有请求判断是否登录）→ 按登录成败重定向到不同路由。**failureMessage** 传布尔值后，之前定义的错误消息可在后续中间件里通过 **req.session.messages 数组**访问。若有独立登录页，失败可回登录页、成功可去用户仪表盘；本课一切都在首页，所以成败都回 \"/\"。**⑥ 看见登录状态：条件渲染**：此刻提交表单一切技术上已工作，但页面上**看不出来**——修掉它。passport 中间件检查随 req 对象进来的 cookie，若有登录用户就把它加到请求对象上；我们只需检查 **req.user** 来切换视图。改 app.get(\"/\")：**res.render(\"index\", { user: req.user })**；index.ejs 里：**<% if (locals.user) { %>** 显示 WELCOME BACK <%= user.username %> 与 LOG OUT 链接，**<% } else { %>** 显示登录表单——已登录欢迎、未登录给表单。**⑦ 登出**：LOG OUT 链接指向 /log-out，加路由：**app.get(\"/log-out\", (req, res, next) => { req.logout((err) => { if (err) { return next(err); } res.redirect(\"/\"); }); })**——passport 中间件 conveniently 给 req 对象加了 **logout 函数**，登出就这么简单。至此全流程跑通：/sign-up 建用户 → 用其用户名密码登录 → 点登出。**⑧ 官方 tip（locals 自定义中间件）**：Express 里可以用 **locals 对象**在整个应用（包括视图）设置与访问各种局部变量。据此写一个自定义中间件简化「在视图里访问当前用户」：**app.use((req, res, next) => { res.locals.currentUser = req.user; next(); })**——插在 **passport 中间件实例化之后、渲染视图之前**的任意位置，所有视图都能访问 **currentUser** 变量，不必在每个需要的控制器里手动传。（中间件函数=拿 req 和 res、加工、传给应用余下部分的函数。）**⑨ Securing passwords with bcrypt**：回头把密码存安全——万一出事或有人拿到数据库，用户密码也要安全；这对最基本的应用也**极其重要**。先 **npm install bcryptjs**；另有一个同名功能的 **bcrypt** 模块用 C++ 写、技术上更快，但安装有时很痛苦——两个模块用法相同，现阶段用 bcryptjs 就好（将来可以试试跑通 C++ 版）。装好后在 app.js 顶部 require，用在**两处**：保存密码入库处 + LocalStrategy 里比对处。**存储哈希密码**：密码哈希=把用户密码过一遍**单向哈希函数**（把变长输入映射为定长伪随机输出）。改 app.post(\"/sign-up\")：**const bcrypt = require(\"bcryptjs\"); …… const hashedPassword = await bcrypt.hash(req.body.password, 10); await pool.query(\"INSERT INTO users (username, password) VALUES ($1, $2)\", [req.body.username, hashedPassword]);**。**第二参数是 salt（盐）长度**：加盐=给密码拼接额外随机字符再喂给哈希函数；盐让**相同密码的用户得到不同的哈希输出**，并防御**彩虹表（rainbow tables）**与**字典攻击（dictionary attacks）**。通常盐要与哈希值一起存库，但我们的场景**无需单独存盐**——bcryptjs 的哈希算法**自动把盐嵌进哈希本身**。哈希函数偏慢，所以所有 DB 存储操作要放进回调里（await 之后）。验证方式：注册个带密码的新用户，去库里看——密码应已变成一长串随机字符串。**官方边界声明**：哈希**如何**工作（尤其密码语境）超出本课范围。**比对哈希密码**：用 **bcrypt.compare()** 验证输入的密码——它比对请求对象里的**明文密码**与库里的**哈希密码**。LocalStrategy 里把 user.password !== password 表达式替换为：**const match = await bcrypt.compare(password, user.password); if (!match) { return done(null, false, { message: \"Incorrect password\" }); }**。此后新用户（哈希密码）可以登录；**加 bcrypt 之前**存的旧用户将无法再登录——安全的小代价（也是下个项目**从一开始就上 bcrypt** 的好理由）。**Assignment（两条）**：**①** 看这个 YouTube 播放列表的**第 1、2、3、5、6 集**（Express 会话与 Passport.js 本地策略认证），并带着四条官方批注看：视频里某些地方出现的 **app.use(passport.initialize())** 在当前版本 Passport 中**已不需要**；视频用的是 **MongoDB**，任何出现处都可替换为 **PostgreSQL**；**视频 3**（express-session 库完全指南）与**视频 5**（Passport Local 配置）演示用 **connect-mongo** 库把会话存进 MongoDB 连接（而非内存），我们用 PostgreSQL，须换成 **connect-pg-simple**（实现方法看它的 npm 页）；注意**会话存储所需的表默认不会自动创建**，务必查看其 npm 页的可用选项。**②** 读 **Passport: The Hidden Manual**（jwalton/passport-api-docs 仓库）——对 Passport 主要函数的更全面解释，深入理解每个函数完成了什么。**Additional resources（选读，非必需）**：一段视频概览**数据库存密码的不同方法与可能风险**；想深潜密码哈希可读 Wikipedia 的**加密哈希函数**条目。",
      "understand": [
        "能说出 passport.js 认证的**三个必定义函数**各管什么：LocalStrategy（拿用户名密码查库比对，done 回调报告成败）/ serializeUser（决定往会话存什么——只存 user.id）/ deserializeUser（拿会话里的 id 查库还原用户，挂上 req.user）——三个都**只定义不手动调用**，由 passport 幕后执行",
        "能解释**登录状态如何跨请求保持**：passport 内部经 express-session 创建 connect.sid cookie 存进浏览器；之后每个请求带 cookie 进来，passport 反序列化出用户挂到 req.user——视图与控制器据此判断「谁在访问」",
        "能背出本课应用**中间件顺序**及其理由：session → passport.session() → urlencoded——会话基础设施先行，表单解析在后；顺序错了认证链路直接失灵",
        "能说清 **bcrypt 加盐哈希的完整闭环**：注册时 bcrypt.hash(密码, 10) 生成嵌入盐的哈希入库（无需单独存盐）；登录时 bcrypt.compare(明文, 哈希) 比对——库里永远不出现明文密码，防的是拖库后的彩虹表与字典攻击",
        "能复述 passport.authenticate(\"local\", {...}) 一行背后干的事：取请求体 username/password → 跑 LocalStrategy → 建会话 cookie → 按 successRedirect / failureRedirect 重定向；failureMessage: true 让错误消息进 req.session.messages"
      ],
      "terms": [
        {
          "en": "Passport.js",
          "zh": "Express 生态最流行的认证中间件：用「策略」插件体系处理登录与会话，本体不绑定任何具体认证方式"
        },
        {
          "en": "Strategy（策略）",
          "zh": "Passport 的认证方式插件——官方有 500+ 种（本地密码、GitHub、Google……）；本课用最基本最常见的 LocalStrategy（用户名+密码）"
        },
        {
          "en": "LocalStrategy",
          "zh": "用户名+密码策略：查库找人、比对密码，用 done(err, user, {message}) 三态回调报告结果"
        },
        {
          "en": "serializeUser / deserializeUser",
          "zh": "会话序列化的两个钩子：前者决定往 session 存什么（惯例只存 user.id），后者按 id 查库还原用户对象挂到 req.user"
        },
        {
          "en": "connect.sid",
          "zh": "express-session 创建、存进用户浏览器的会话 cookie 名——「保持登录」的物理载体"
        },
        {
          "en": "bcrypt / bcryptjs",
          "zh": "密码哈希库：hash(密码, 盐轮数) 生成嵌盐哈希、compare(明文, 哈希) 比对；bcryptjs 是纯 JS 实现（好装），bcrypt 是 C++ 实现（更快但安装常出麻烦）"
        },
        {
          "en": "salt（盐）",
          "zh": "哈希前拼进密码的随机字符——让相同密码哈希结果不同，防彩虹表与字典攻击；bcryptjs 自动把盐嵌进哈希，无需单独存"
        },
        {
          "en": "rainbow table（彩虹表）/ dictionary attack（字典攻击）",
          "zh": "两种破解存储密码的手段：预计算哈希对照表 / 拿常见密码列表逐个试——加盐哈希正是为防御它们"
        }
      ],
      "tasks": [
        "看这个 YouTube 播放列表的第 1、2、3、5、6 集（Express 会话与 Passport.js 本地策略认证），并带着官方四条批注看：视频中出现的 app.use(passport.initialize()) 在当前版本 Passport 已不需要写；视频用 MongoDB，任何出现处都替换为 PostgreSQL；视频 3（express-session 完全指南）与视频 5（Passport Local 配置）演示的 connect-mongo 会话存储，在 PostgreSQL 下要换成 connect-pg-simple（实现看其 npm 页）；会话存储所需的表默认不会自动创建，务必查看 npm 页的可用选项",
        "阅读 Passport: The Hidden Manual（jwalton/passport-api-docs）——对 Passport 主要函数的更全面解释，深入理解每个函数各自完成了什么"
      ],
      "quiz": [
        {
          "question": "passport 认证要定义的三个函数分别是什么？为什么说「只定义、不调用」？",
          "answer": "① LocalStrategy：接收 username/password，查库比对，用 done(null, user)（成功）/ done(null, false, {message})（失败）/ done(err)（异常）三态报告；② serializeUser：登录成功后决定往会话数据里存什么——惯例 done(null, user.id) 只存 id；③ deserializeUser：后续请求发现匹配会话时，拿存下的 id 查库还原完整用户对象，done(null, user) 把它挂到 req.user。三个函数都由 passport 在幕后自动调用：LocalStrategy 在 passport.authenticate() 执行时跑，序列化对在会话创建/读取时跑——done 也是 passport 提供的，所以我们「定义好放那儿」即可。"
        },
        {
          "question": "用户登录后关掉浏览器再回来，为什么还是登录状态？把整条链路说清楚。",
          "answer": "登录成功时 passport 内部调用 express-session 的函数，用序列化数据（user.id）创建名为 connect.sid 的 cookie 存进浏览器。再次访问时请求自动带上这个 cookie，passport 发现匹配会话，调用 deserializeUser 按 id 查库拿回用户对象挂到 req.user——应用其余部分照常从 req.user 读当前用户。所以「保持登录」的本质是：浏览器存会话 cookie，服务器按 cookie 里的 id 每次还原用户。"
        },
        {
          "question": "bcrypt.hash(password, 10) 的第二参数是什么？为什么用了 bcryptjs 就不需要在数据库里单独存盐？",
          "answer": "第二参数是 salt（盐）的长度/轮数——盐是拼进密码的额外随机字符，加盐让相同密码的用户得到不同的哈希输出，并防御彩虹表与字典攻击。通常盐需要与哈希一起存库，但 bcryptjs 的哈希算法自动把盐嵌进哈希字符串本身，比对时 compare 能从哈希里取出盐重算——所以无需单独存盐列。"
        },
        {
          "question": "app.post(\"/log-in\", passport.authenticate(\"local\", { successRedirect: \"/\", failureRedirect: \"/\", failureMessage: true })) 这一行里，authenticate 中间件幕后做了哪几件事？failureMessage 有什么用？",
          "answer": "幕后流程：从请求体找 username 和 password 参数 → 执行我们定义的 LocalStrategy（查库、比对）→ 认证通过则创建会话 cookie 存进浏览器（供之后所有请求判断登录态）→ 按结果重定向：成功去 successRedirect、失败去 failureRedirect。failureMessage: true 让 LocalStrategy 里 done(null, false, {message}) 携带的错误消息（如 \"Incorrect password\"）存入 req.session.messages 数组，后续中间件与视图可以读出来显示给用户。"
        },
        {
          "question": "官方 tip 里的 res.locals.currentUser 中间件解决什么问题？插在什么位置？",
          "answer": "解决「每个需要当前用户的视图/控制器都要手动传 user」的重复劳动。Express 的 locals 对象在整个应用（包括视图）可访问，所以写 app.use((req, res, next) => { res.locals.currentUser = req.user; next(); })，插在 passport 中间件实例化之后、渲染视图之前——此后所有模板直接用 currentUser 变量判断登录态与显示用户名，不必逐个控制器传参。"
        }
      ],
      "optional": [],
      "note": "本课是全站身份认证主题的主干课：Members Only 项目、库存项目 Extra credit 的 admin 密码、后面 API 章的 JWT 全部踩在这课的地基上。官方刻意把演示代码集中在单文件并明文警示「真实项目要拆模块」——做项目时按 MVC 结构把 passport 配置拆出去。另注意官方视频的三处时代差：passport.initialize() 已不需要、MongoDB→PostgreSQL、connect-mongo→connect-pg-simple。",
      "why": "「谁在访问」是几乎所有真实应用的第一个问题：留言板要认作者、库存要认管理员、博客 API 要认发文人。这课把答案的完整机制拆给你看——会话 cookie 负责「记住」、序列化对负责「存取」、策略负责「验证」、bcrypt 负责「就算拖库也不泄露密码」。学完它，你写过的每个玩具项目都升级成有用户体系的真应用；World 7 后半程的每个项目（会员俱乐部、文件上传站、博客 API、Odin-Book）都以它为前置。",
      "sections": [
        {
          "h": "Set up：users 表、依赖清单与中间件顺序",
          "p": [
            "先在 psql 里创建一个新数据库，建 users 表：id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY + username VARCHAR(255) + password VARCHAR(255)——identity 列自动发号是上一课的知识直接复用。",
            "新目录 npm init 后一次装齐依赖：npm install express express-session pg passport passport-local ejs。",
            "app.js 骨架里三个中间件的顺序是本课最重要的隐形知识点：session({secret, resave: false, saveUninitialized: false}) → passport.session() → express.urlencoded({extended: false})。express-session 我们并不直接使用——它是 passport 在幕后调用的依赖。",
            "官方警告框：此刻密码是明文入库——任何真实项目里这都是非常糟糕的做法；课末必须回头用 bcrypt 补上，不许跳过。官方同时声明：为演示方便除视图外全放一个文件，真实项目最佳实践是拆分模块。"
          ],
          "list": [
            "users 表三列：id（identity 自动发号）/ username / password（VARCHAR(255)——装的是哈希串）",
            "中间件顺序：session → passport.session() → urlencoded",
            "express-session 是 passport 的幕后依赖，不直接使用"
          ]
        },
        {
          "h": "Creating users：注册表单与参数化 INSERT",
          "p": [
            "sign-up-form 模板：username 文本框 + password 密码框，表单 POST 到 /sign-up；GET /sign-up 渲染它。",
            "POST /sign-up 处理：await pool.query(\"INSERT INTO users (username, password) VALUES ($1, $2)\", [req.body.username, req.body.password])，成功重定向 \"/\"，异常 return next(err)——参数化查询防 SQL 注入的纪律延续。",
            "官方明说：为节省篇幅此课不做净化与校验，但「到你做项目时别忘了」——Members Only 项目里会正式补上（confirmPassword 自定义校验器）。",
            "跑通后访问 /sign-up 提交，psql 里能看到第一个用户——明文密码就躺在库里，正等着第 ⑧ 节来救。"
          ]
        },
        {
          "h": "Strategies 与 LocalStrategy：认证的第一函数",
          "p": [
            "Passport 用「Strategies（策略）」认证用户——官方有 500+ 种策略，本课只用最基本也最常见的用户名+密码策略 LocalStrategy。官方建议先花一分钟浏览 passport.js 官网：文档里几乎有配置所需的一切，做项目时要常回来查。",
            "passport.use(new LocalStrategy(async (username, password, done) => {...}))：按 username 查库；查无此人 return done(null, false, {message: \"Incorrect username\"})；密码不符 return done(null, false, {message: \"Incorrect password\"})；全对 return done(null, user)；catch 里 return done(err)。",
            "关键认知：这个函数我们从不直接调用——它像中间件一样，在后面调用 passport.authenticate() 时被 passport 自动执行，done 也由 passport 提供。"
          ]
        },
        {
          "h": "会话与序列化：connect.sid、serializeUser、deserializeUser",
          "p": [
            "要让用户登录后保持登录（在应用里走动不掉线），passport 内部调用 express-session 的函数，用一些数据创建名为 connect.sid 的 cookie 存进用户浏览器。",
            "接下来两个函数定义 passport 创建与解码 cookie 时找哪一点信息。官方解释为什么要我们定义它们：确保会话要找的数据在数据库里真实存在。",
            "passport.serializeUser((user, done) => done(null, user.id))：会话创建时接收登录成功查到的 user 对象，把 id 属性存进会话数据——只存 id，不存整个对象。",
            "passport.deserializeUser(async (id, done) => {...})：后续请求发现匹配会话时，取出存的 id 查库还原用户，done(null, user) 把用户对象挂到 req.user——本次请求余下部分都能用。两个函数同样只定义、不手动调用。"
          ]
        },
        {
          "h": "登录表单与「魔法一行」：passport.authenticate",
          "p": [
            "登录表单与注册表单同形，只是 action 改为 POST 到 /log-in，直接放进 index 模板。",
            "魔法一行：app.post(\"/log-in\", passport.authenticate(\"local\", { successRedirect: \"/\", failureRedirect: \"/\", failureMessage: true }))。",
            "authenticate 幕后做的事：从请求体找 username/password 参数 → 跑 LocalStrategy 查库比对 → 创建会话 cookie 存进浏览器（供之后所有请求判断登录态）→ 按成败重定向。failureMessage: true 让错误消息进入 req.session.messages 数组，后续中间件可读取。",
            "若有独立登录页：失败可回登录页、成功可去用户仪表盘；本课一切都在首页，所以成败都回 \"/\"。"
          ]
        },
        {
          "h": "看见登录状态：条件渲染、登出与 locals tip",
          "p": [
            "此刻提交表单技术上已工作，但页面看不出来。passport 中间件检查随 req 进来的 cookie，有登录用户就挂 req.user——视图只需检查它。",
            "app.get(\"/\") 改为 res.render(\"index\", { user: req.user })；index.ejs 用 <% if (locals.user) { %> 分支：已登录显示 WELCOME BACK <%= user.username %> 与 LOG OUT 链接，未登录显示登录表单。",
            "登出：passport 给 req 对象自动加了 logout 函数——app.get(\"/log-out\", (req, res, next) => { req.logout((err) => { if (err) return next(err); res.redirect(\"/\"); }); })。至此注册→登录→登出全流程跑通。",
            "官方 tip：res.locals 全应用（含视图）可见。在 passport 中间件实例化之后、渲染视图之前插 app.use((req, res, next) => { res.locals.currentUser = req.user; next(); })——所有视图直接用 currentUser，不必逐个控制器手动传。"
          ]
        },
        {
          "h": "bcrypt：哈希存储与比对",
          "p": [
            "npm install bcryptjs。另有 C++ 写的 bcrypt 模块功能相同、技术上更快，但安装常出麻烦——两模块用法相同，现阶段用 bcryptjs 即可。用它在两处：保存密码入库处 + LocalStrategy 比对处。",
            "密码哈希 = 把密码过一遍单向哈希函数（变长输入 → 定长伪随机输出）。注册处改：const hashedPassword = await bcrypt.hash(req.body.password, 10); 然后 INSERT 哈希值。",
            "第二参数是 salt（盐）长度：盐 = 拼进密码的额外随机字符，让相同密码的用户得到不同哈希，防彩虹表与字典攻击。通常盐要单独存库，但 bcryptjs 自动把盐嵌进哈希本身——无需单存。哈希函数偏慢，DB 存储操作要放在 await 之后。",
            "验证：注册新用户后去库里看——密码应已变成长随机串。官方边界声明：哈希如何工作（尤其密码语境）超出本课范围。"
          ]
        },
        {
          "h": "比对哈希与旧用户的代价",
          "p": [
            "LocalStrategy 里把 user.password !== password 换成：const match = await bcrypt.compare(password, user.password); if (!match) { return done(null, false, { message: \"Incorrect password\" }); }——compare 拿明文密码与库里哈希比对，从哈希里自动取盐重算。",
            "此后新注册（哈希密码）的用户可以登录；加 bcrypt 之前存的旧用户将无法再登录——官方口径：安全的小代价，也是下个项目从一开始就上 bcrypt 的好理由。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "sql",
          "code": "CREATE TABLE users (\n   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n   username VARCHAR ( 255 ),\n   password VARCHAR ( 255 )\n);",
          "note": "官方 Set up 节的 users 表：与上一课 usernames 表同构（identity 列自动发号），password 列装的是 bcrypt 哈希串（约 60 字符，255 足够）。"
        },
        {
          "lang": "javascript",
          "code": "const session = require(\"express-session\");\nconst passport = require(\"passport\");\nconst LocalStrategy = require('passport-local').Strategy;\n\napp.use(session({ secret: \"cats\", resave: false, saveUninitialized: false }));\napp.use(passport.session());\napp.use(express.urlencoded({ extended: false }));",
          "note": "官方 app.js 骨架的中间件段：顺序是硬要求——session 先建会话基础设施，passport.session() 才能读写它，urlencoded 负责解析登录/注册表单的请求体。LocalStrategy 的取法是 require(\"passport-local\").Strategy。"
        },
        {
          "lang": "javascript",
          "code": "passport.use(\n  new LocalStrategy(async (username, password, done) => {\n    try {\n      const { rows } = await pool.query(\"SELECT * FROM users WHERE username = $1\", [username]);\n      const user = rows[0];\n\n      if (!user) {\n        return done(null, false, { message: \"Incorrect username\" });\n      }\n      if (user.password !== password) {\n        return done(null, false, { message: \"Incorrect password\" });\n      }\n      return done(null, user);\n    } catch(err) {\n      return done(err);\n    }\n  })\n);",
          "note": "官方 LocalStrategy 初版（明文比对）：done 三态——(null, false, {message}) 认证失败带消息、(null, user) 成功、(err) 异常。学完 bcrypt 后，中间那个 !== 比对要换成 bcrypt.compare（见下一例）。"
        },
        {
          "lang": "javascript",
          "code": "passport.serializeUser((user, done) => {\n  done(null, user.id);\n});\n\npassport.deserializeUser(async (id, done) => {\n  try {\n    const { rows } = await pool.query(\"SELECT * FROM users WHERE id = $1\", [id]);\n    const user = rows[0];\n\n    done(null, user);\n  } catch(err) {\n    done(err);\n  }\n});",
          "note": "官方会话序列化对：serializeUser 只把 user.id 存进会话（connect.sid cookie 关联的服务器端数据）；deserializeUser 在后续请求按 id 查库还原用户挂上 req.user。官方口径：passport 文档里列的这两个函数对我们的场景刚刚好。"
        },
        {
          "lang": "javascript",
          "code": "app.post(\n  \"/log-in\",\n  passport.authenticate(\"local\", {\n    successRedirect: \"/\",\n    failureRedirect: \"/\",\n    failureMessage: true,\n  })\n);",
          "note": "官方「魔法一行」：登录路由的全部处理就是 authenticate 中间件——取请求体 username/password、跑 LocalStrategy、建会话 cookie、按成败重定向；failureMessage: true 让错误消息进 req.session.messages。"
        },
        {
          "lang": "javascript",
          "code": "const bcrypt = require(\"bcryptjs\");\n\n// 注册：哈希后入库\nconst hashedPassword = await bcrypt.hash(req.body.password, 10);\nawait pool.query(\"INSERT INTO users (username, password) VALUES ($1, $2)\",\n  [req.body.username, hashedPassword]);\n\n// LocalStrategy 内：明文与哈希比对\nconst match = await bcrypt.compare(password, user.password);\nif (!match) {\n  return done(null, false, { message: \"Incorrect password\" });\n}",
          "note": "官方 bcrypt 两处改造：hash 第二参数是盐长度（bcryptjs 自动把盐嵌进哈希，无需单独存盐列）；compare(明文, 哈希) 替换掉 !== 直比——库里从此没有明文密码。"
        }
      ],
      "pitfalls": [
        {
          "title": "把明文密码版直接带进项目",
          "text": "官方警告框原话：明文存密码对任何真实项目都是非常糟糕的主意——课末的 bcrypt 节不是可选项。做 Members Only 时注册流程从第一行起就走 bcrypt.hash，否则中途换哈希会让已注册用户全部无法登录（官方明说这是「安全的小代价」，但项目里没必要付）。"
        },
        {
          "title": "打乱中间件顺序",
          "text": "session → passport.session() → urlencoded 的顺序有因果：passport.session() 依赖 session 建好的会话基础设施，authenticate 依赖 urlencoded 解析出的 req.body.username/password。顺序错了不报错、只是认证悄悄失灵——这类「静默失败」最难查。"
        },
        {
          "title": "试图手动调用三个函数",
          "text": "LocalStrategy、serializeUser、deserializeUser 都是「只定义、不调用」——done 由 passport 提供，执行时机由 passport 掌握。自己调 LocalStrategy 或给 done 传参，是把框架的钩子当成了自己的工具函数，链路立刻乱套。"
        },
        {
          "title": "照抄视频里的过时写法",
          "text": "官方对 Assignment 视频给了四条批注：app.use(passport.initialize()) 在当前版本已不需要；视频用 MongoDB 要全换 PostgreSQL；connect-mongo 会话存储要换 connect-pg-simple；会话表默认不自动创建、要查 npm 页选项。看视频前先读批注，不然抄进去的全是坑。"
        }
      ],
      "official": {
        "assignment": [
          "看 YouTube 播放列表（Express 会话与 Passport.js 本地策略认证）的第 1、2、3、5、6 集；官方四条批注：passport.initialize() 当前版本已不需要；MongoDB 全部替换为 PostgreSQL；视频 3 与视频 5 的 connect-mongo 换成 connect-pg-simple（实现看其 npm 页）；会话存储的表默认不自动创建，查 npm 页可用选项",
          "阅读 Passport: The Hidden Manual（jwalton/passport-api-docs）——对 Passport 主要函数的更全面解释"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "视频：数据库存储密码的不同方法与可能风险概览",
          "Wikipedia《Cryptographic hash function》：加密哈希函数原理深潜"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/authentication/authentication_basics.md（本站自行编写简体讲解与任务拆解，未改编自任何第三方中文课程）",
        "sha256": "1c465846d859a6ccb595fb8ff67a9f965d487de23ef92add48fd82dcfc646f43",
        "verifiedAt": "2026-09-29"
      }
    },
    {
      "id": "node-path-nodejs-members-only",
      "title": "Project: Members Only",
      "zh": "项目：会员专属俱乐部",
      "group": 2,
      "url": "https://www.theodinproject.com/lessons/node-path-nodejs-members-only",
      "summary": "「身份认证」章的实战项目（全站第 28 门 Project 课）：建一个会员专属俱乐部（exclusive clubhouse），会员可以发匿名帖——俱乐部内部（登录且入会的会员）能看到每条帖子的作者是谁，俱乐部外部（未登录的路人）只能看到帖子内容、猜不出作者。官方定位：上一课认证技能的直接运用场 + 数据库技能的再练习（buckle up!）。Assignment 十条：① 先想清楚需要哪些数据库模型：users 要有全名（first + last）、用户名（可以用 email 充当）、密码、会员状态（membership-status）四要素；用户能创建带标题、时间戳、正文的消息；数据库要追踪每条消息由谁创建。② 在 PostgreSQL 上建库，生成或创建项目骨架（含上一步设计的模型）。③ 从注册表单开始把用户弄进库：别忘了净化与校验表单字段、用 bcrypt 保护密码；注册表单要加 confirmPassword 字段，并用自定义校验器（custom validator，官方链接 express-validator 文档 customizing 指南）校验两次输入一致。④ 用户注册时**不自动获得会员身份**——「任何人都能进的私人俱乐部有什么意思？」；加一个页面让会员输入秘密口令（secret passcode）「join the club」，输对才更新会员状态。⑤ 用 passport.js 建登录表单——照上一课 Assignment 的做法。⑥ 用户登录后给一个「Create a new message」链接（只在登录时显示！），并创建新消息表单。⑦ 首页显示全部会员消息，但**只有其他俱乐部会员**才能看到消息的作者与日期。⑧ 给用户模型加可选的 Admin 字段，然后加删除消息的能力——但只允许 admin == true 的用户看到删除按钮并执行删除；你需要一个真正把用户标记为 admin 的途径：要么再加一个秘密口令页，要么就在注册表单上放一个 \"is admin\" 复选框。⑨ 官方验收口径复述：此时任何来站点的人都应能看到全部消息列表（作者名隐藏）；用户能注册并发消息；但**只有会员**能看到每条消息的作者与日期；最后还应有一个 Admin 用户能看到一切、并能删除消息。「显然这是个傻乎乎的小应用，但你练的东西（创建与认证用户、给用户不同的能力与权限）将来非常有用！」⑩ 满意后部署到你选择的 PaaS（官方链接部署课的 PaaS 提供商清单）并在课页下方分享。本课官方无 Extra credit、无 Additional resources。",
      "guide": "以下是官方项目要求的中文化梳理。**红线**：本站不提供成品代码——数据库模型、路由、控制器、视图全部自己设计。**项目一句话**：会员专属俱乐部——会员发「匿名」帖：**俱乐部内**（登录的会员）看得到作者，**俱乐部外**（路人）只看得到内容、猜作者。**官方定位**：上一课（身份认证基础）技能的运用场 + 数据库技能再练习。**第 1 步：设计数据模型**（先想后建）：**users** 需要——全名（first 与 last）、用户名（可用 email 充当）、密码、**membership-status（会员状态）**；用户能创建**消息**——标题、时间戳、正文；数据库要**追踪每条消息由谁创建**（作者关联——外键/关系，Prisma 章之前的最后一段纯 SQL 时光）。**第 2 步：建库与骨架**：在 PostgreSQL 上建库，生成或创建项目骨架，**包含上一步设计的模型**。**第 3 步：注册表单**：把用户弄进库；**别忘了净化与校验**表单字段（上一课官方说「到项目里别忘了」——就是现在）、**用 bcrypt 保护密码**；注册表单加 **confirmPassword** 字段，用**自定义校验器**（custom validator）校验——express-validator 文档的 customizing 指南（表单课的校验器知识 + 本课新学的自定义扩展）。**第 4 步：秘密口令入会**：用户注册时**不自动给会员身份**——官方原话：「任何人都能进的私人俱乐部有什么意思？」加一个页面让会员输入**秘密口令（secret passcode）**「join the club」；输对口令才**更新其会员状态**。**第 5 步：登录表单**：用 passport.js——照上一课 Assignment 的做法（LocalStrategy + 会话序列化 + authenticate）。**第 6 步：发消息入口**：用户**登录后**给一个「Create a new message」链接——**只在登录时显示**！并创建新消息表单。**第 7 步：分层可见性（本项目灵魂）**：首页显示**全部**会员消息，但**只有其他俱乐部会员**才能看到消息的**作者与日期**——路人只见内容。实现思路自己定：视图层按 locals.currentUser 的会员状态分支渲染（认证课 tip 的 currentUser 中间件在这里直接派上用场）。**第 8 步：Admin 与删除**：用户模型加**可选字段 Admin**；加**删除消息**能力——但**只允许 admin == true** 的用户看到删除按钮、执行删除；你还需要一个**真正把用户标记为 admin** 的途径：要么再加一个秘密口令页，要么就在注册表单上放一个 \"is admin\" 复选框（官方给了两个选项，选哪个自己定）。**第 9 步：官方验收口径**（做完对照）：任何来访者能看到全部消息列表（作者名隐藏）；用户能注册、能发消息；**只有会员**能看到每条消息的作者与日期；有一个 **Admin** 用户能看到一切、并能删除消息。官方原话：「显然这是个傻乎乎的小应用，但你练的东西——创建与认证用户、给用户不同的能力与权限——将来**非常**有用！」**第 10 步：部署与分享**：满意后部署到你选择的 **PaaS**（部署课的提供商清单）并在课页下方提交分享。**官方无 Extra credit、无 Additional resources。**",
      "understand": [
        "能画出本项目的**三层可见性矩阵**：路人（看内容、不见作者）→ 会员（看内容+作者+日期、能发帖）→ Admin（看一切+能删帖）——视图分支与路由保护都围绕这张矩阵设计",
        "能说明**会员身份的两道门**：注册只建账号（不自动入会），入会要走秘密口令页输对 passcode 才更新 membership-status——「任何人都能进的私人俱乐部有什么意思」正是产品逻辑决定数据逻辑的例子",
        "能把上一课的认证套件完整落到项目里：bcrypt.hash 注册即哈希、LocalStrategy+bcrypt.compare 登录比对、serializeUser/deserializeUser 会话、locals.currentUser 中间件供视图判断身份",
        "能解释 **Admin 权限的实现要点**：模型加可选 Admin 字段 + 一个标记 admin 的途径（口令页或注册复选框二选一）+ 删除按钮与删除路由都要校验 admin == true（前端藏按钮不等于安全，后端路由同样要拦）"
      ],
      "terms": [
        {
          "en": "membership-status（会员状态）",
          "zh": "users 模型的核心字段——注册≠入会，输对秘密口令才升级为会员；决定「能否看到作者与日期」"
        },
        {
          "en": "secret passcode（秘密口令）",
          "zh": "入会暗号：官方指定的入会方式——一个页面、一个输入框、输对才更新会员状态"
        },
        {
          "en": "confirmPassword + custom validator",
          "zh": "注册表单的「确认密码」字段与 express-validator 自定义校验器——上一课「项目里别忘了校验」的还债处"
        },
        {
          "en": "admin",
          "zh": "用户模型的可选字段：admin == true 才见删除按钮、才能删消息；标记途径官方给了两个选项（口令页 / 注册复选框）"
        }
      ],
      "tasks": [
        "先想清楚需要哪些数据库模型：users 要有全名（first 与 last）、用户名（可用 email 充当）、密码与会员状态（membership-status）；用户能创建带标题、时间戳与正文的消息；数据库要追踪每条消息由谁创建",
        "在 PostgreSQL 上建立数据库，生成或以其他方式创建项目骨架——包含上一步设计的模型",
        "从注册表单开始把用户弄进库：别忘了净化与校验表单字段、用 bcrypt 保护密码；给注册表单加 confirmPassword 字段，并用自定义校验器（custom validator）校验它",
        "用户注册时不自动获得会员身份——加一个页面让会员输入秘密口令（secret passcode）「join the club」；输对口令就更新其会员状态",
        "用 passport.js 创建登录表单——照上一课 Assignment 的做法",
        "用户登录后给一个「Create a new message」链接（只在登录时显示！），并创建新消息表单",
        "首页显示全部会员消息，但只对其他俱乐部会员显示消息的作者与日期",
        "给用户模型加可选字段 Admin，再加删除消息的能力——只允许 admin == true 的用户看到删除按钮并删除消息；同时要有真正把用户标记为 admin 的途径：再加一个秘密口令页，或在注册表单放一个 \"is admin\" 复选框",
        "对照官方验收口径：任何来访者能看到全部消息列表（作者名隐藏）；用户能注册并发消息；只有会员能看到每条消息的作者与日期；有一个 Admin 用户能看到一切并能删除消息——「显然这是个傻乎乎的小应用，但你练的创建与认证用户、给用户不同能力与权限，将来非常有用」",
        "满意后把项目部署到你选择的 PaaS（部署课的 PaaS 提供商清单），并在课页下方分享"
      ],
      "quiz": [
        {
          "question": "这个项目里「匿名」的确切含义是什么？路人和会员看到的首页有什么区别？",
          "answer": "匿名是分层的：帖子对路人匿名、对会员不匿名。路人（未登录或非会员）在首页能看到全部消息的内容，但看不到作者与日期；俱乐部会员能看到同样的消息列表，外加每条的作者与日期。所以数据是同一份，可见字段按访问者身份分层——视图层按 currentUser 的会员状态分支渲染即可。"
        },
        {
          "question": "为什么注册时不自动给会员身份？入会的官方指定流程是什么？",
          "answer": "官方原话：「任何人都能进的私人俱乐部有什么意思？」——会员身份要有门槛才有意义，这也是练「用户权限分级」的产品载体。流程：注册只建账号；另有一个「join the club」页面，用户输入秘密口令（secret passcode），输对才把 membership-status 更新为会员。"
        },
        {
          "question": "Admin 删除功能有哪几个组成部分？只在前端藏起删除按钮够不够？",
          "answer": "三部分：① users 模型加可选的 Admin 字段；② 一个把用户标记为 admin 的途径——官方给两个选项：再加一个秘密口令页，或注册表单上放 \"is admin\" 复选框；③ 删除能力——只有 admin == true 的用户看到删除按钮并能删消息。只藏按钮不够：按钮只是入口，删除路由本身也必须校验 admin 身份，否则非管理员直接请求删除路由就能绕过——前端隐藏是体验，后端校验才是安全。"
        }
      ],
      "optional": [],
      "note": "Project 红线课：本站不提供成品代码，examples 为空数组——数据模型、口令页、权限分支全部自己设计。这是全站第 28 门 Project 课、World 7 第 4 门。它是上一课认证套件的第一次完整落地：bcrypt、LocalStrategy、会话、locals.currentUser、express-validator 自定义校验器在一个项目里全员上场；第 8 步的 Admin 权限正是库存项目 Extra credit 2 预告的「安全密码用户体系」的正式答案。",
      "why": "库存项目 Extra credit 里那个「输入 admin 密码才能删除」的临时方案，暴露了没有用户体系时权限管理的窘境——这个项目就是正式答案：账号、会员、管理员三层身份，注册、入会、登录、发帖、删除五个动作各归其位。做完它，「谁能看什么、谁能做什么」这套 RBAC 思维就成了肌肉记忆——后面博客 API 的路由保护、Odin-Book 的登录墙全是同一套逻辑的变体。",
      "sections": [
        {
          "h": "项目一句话：分层匿名的俱乐部",
          "p": [
            "建一个会员专属俱乐部：会员可以发匿名帖——俱乐部内部，会员能看到每条帖子的作者是谁；俱乐部外部，路人只能看到内容、猜作者。",
            "官方定位：上一课认证技能的运用场 + 数据库技能的再练习。数据是同一份，可见字段按访问者身份分层——这是本项目的灵魂设计。"
          ]
        },
        {
          "h": "数据模型设计（第 1-2 步）",
          "p": [
            "users 四要素：全名（first 与 last）、用户名（可用 email 充当）、密码（bcrypt 哈希）、membership-status（会员状态）。",
            "消息三要素：标题、时间戳、正文；数据库要追踪每条消息由谁创建——作者关联用你在 PostgreSQL 课学的外键/关系表达。",
            "然后在 PostgreSQL 上建库、生成或创建项目骨架（含设计好的模型）。"
          ]
        },
        {
          "h": "注册与入会（第 3-4 步）",
          "p": [
            "注册表单：净化与校验字段（上一课「项目里别忘了」的还债处）、bcrypt 保护密码；加 confirmPassword 字段并用 express-validator 自定义校验器校验两次输入一致。",
            "注册不自动入会——「任何人都能进的私人俱乐部有什么意思？」：另建一个「join the club」页面，输入秘密口令（secret passcode），输对才更新会员状态。"
          ]
        },
        {
          "h": "登录、发帖与分层可见（第 5-7 步）",
          "p": [
            "passport.js 登录表单照上一课 Assignment 的做法：LocalStrategy + 会话序列化 + authenticate 一行路由。",
            "登录后才显示「Create a new message」链接，配新消息表单。",
            "首页显示全部会员消息，但作者与日期只对其他俱乐部会员可见——视图按 locals.currentUser 的会员状态分支渲染（认证课 tip 的 currentUser 中间件直接派上用场）。"
          ]
        },
        {
          "h": "Admin 权限与删除（第 8 步）",
          "p": [
            "用户模型加可选字段 Admin；加删除消息能力——只允许 admin == true 的用户看到删除按钮并执行删除。",
            "还要有真正把用户标记为 admin 的途径，官方给两个选项：再加一个秘密口令页，或在注册表单上放一个 \"is admin\" 复选框。",
            "记住：藏按钮只是体验，删除路由本身同样要校验 admin 身份——后端拦截才是安全。"
          ]
        },
        {
          "h": "验收口径与部署（第 9-10 步）",
          "p": [
            "官方验收复述：任何来访者能看到全部消息列表（作者名隐藏）；用户能注册并发消息；只有会员能看到作者与日期；Admin 用户能看到一切、能删消息。",
            "官方原话：「显然这是个傻乎乎的小应用，但你练的东西——创建与认证用户、给用户不同的能力与权限——将来非常有用！」",
            "满意后部署到你选择的 PaaS（部署课的提供商清单），在课页下方提交分享。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "注册即会员，口令页失踪",
          "text": "官方把「注册不自动给会员身份」写成独立一步：没有门槛的俱乐部失去存在意义，更重要的是你会漏掉「用户状态字段的更新流程」这一练习点——口令页正是第一次练「按输入更新用户权限状态」。"
        },
        {
          "title": "只在前端藏按钮",
          "text": "「只在登录时显示链接」「只有 admin 看到删除按钮」都是视图层动作，但对应的 POST/删除路由必须在后端再校验一次身份——路人可以直接构造请求打到路由上。前端隐藏是体验，后端校验才是安全。"
        },
        {
          "title": "密码明文入库再回头改",
          "text": "上一课官方警告的还债处就在本项目第 3 步：注册流程从第一行起就走 bcrypt.hash + confirmPassword 校验；如果先明文跑通再回头改哈希，已注册的用户会全部无法登录（compare 拿明文比哈希永远失败），只能清库重来。"
        },
        {
          "title": "把消息作者存成用户名字符串",
          "text": "「数据库要追踪每条消息由谁创建」指的是关系（外键指向 users.id），不是把用户名抄进消息表——用户名一旦允许修改，抄写的字符串就成了脏数据；关联 id 才能随用户表联动。"
        }
      ],
      "official": {
        "assignment": [
          "设计数据库模型：users 含全名（first 与 last）、用户名（可用 email）、密码与 membership-status；用户能创建带标题、时间戳与正文的消息；数据库追踪每条消息的创建者",
          "在 PostgreSQL 上建库，生成或创建项目骨架（含设计的模型）",
          "从注册表单开始：净化与校验表单字段、bcrypt 保护密码；加 confirmPassword 字段并用自定义校验器（custom validator）校验",
          "注册不自动给会员身份：加一个页面让会员输入秘密口令（secret passcode）「join the club」，输对则更新会员状态",
          "用 passport.js 创建登录表单（照上一课 Assignment 的做法）",
          "用户登录后给「Create a new message」链接（只在登录时显示），并创建新消息表单",
          "首页显示全部会员消息，但只对其他俱乐部会员显示作者与日期",
          "用户模型加可选字段 Admin 并加删除消息能力——只允许 admin == true 的用户看到删除按钮并删除；要有标记 admin 的途径（秘密口令页或注册表单 \"is admin\" 复选框）",
          "对照验收：来访者见全部消息（作者隐藏）、用户能注册发帖、只有会员见作者与日期、Admin 见一切并能删除",
          "满意后部署到你选择的 PaaS（部署课的 PaaS 提供商清单）并在下方分享"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/authentication/project_members_only.md（本站自行编写简体讲解与任务拆解，未改编自任何第三方中文课程；Project 红线：不提供成品答案）",
        "sha256": "90880399f13df59be940416125a3ff459797f965a5b2de4442163a2b748f84df",
        "verifiedAt": "2026-09-29"
      }
    },
    {
      "id": "nodejs-prisma-orm",
      "title": "Prisma ORM",
      "zh": "Prisma ORM",
      "group": 3,
      "url": "https://www.theodinproject.com/lessons/nodejs-prisma-orm",
      "summary": "「ORM」章的知识课（官方原文约 11.7KB）：受够了在项目里手写 raw SQL？本课讲对象关系映射器（Object Relational Mappers，简称 ORM）——让你操作数据库数据的工具，软件业广泛使用；然后深入 Node.js 生态里流行的一款：Prisma ORM。四大块：① raw SQL 的三大痛点（Challenges with raw SQLin'）——(a) 代码太多（So much more code）：要 SELECT 就写一条查询、换张表再写一条；想抽工具函数？又要改函数支持指定列、过滤、排序……INSERT 及其全部变体同理重复；也可以按实体建模块（官方给了 Book 类示例：getBooks(filters)/getBookById(id)/createBook(data)/updateBook(id,data)/deleteBook(id)/getBookAuthors(id)/getBookGenres(id)……），或 Database 基类继承、或组合、或纯函数——但每个实体、每个项目都要重来一遍。官方口径：多写代码不一定坏（学习与练习，个人项目够用，甚至建议你去探索上述思路），但团队协作与大规模软件中，**必须有与数据库交互的标准方式**（外部库或自研方案）——那时你会真正体会 ORM 帮你聚焦业务关键代码的价值；官方 tip：如果之前的项目没用过这些范式，强烈建议回头重构——你可能会做出一个非常基础的迷你 ORM，这会让你更体会到正经 ORM 有多省心。(b) 代码库导航（Navigating the codebase）：全部数据库交互都是 raw SQL 时，代码库里没有任何地方能看懂数据库表、表间关系与列类型——你可能得登录数据库才能理解代码库在干什么；要获得项目的技术理解，你得同时依赖代码库与数据库访问权限。多数 ORM 的解法：把数据库定义带进代码库——这叫 **schema（模式）**，让你扫一眼就明白表有哪些列、什么关系。(c) 修改生产数据（Altering production data）：需求演进时数据库不可避免地要变——加列、给新表灌既有数据，术语叫**迁移（migration）**；没有 ORM 或类似库就得手写迁移，易错又繁琐；ORM 用变更日志（changelogs）标准化迁移并有处理冲突的流程。官方补充：课程项目里你跑不了几次迁移，但职业工作里可能隔天就要跑一次。② 引入 Prisma ORM（Introducing Prisma ORM）——ORM 几乎解决上述全部痛点，但**并非全是阳光与玫瑰**：完整理解一个 ORM 有学习曲线，有些 ORM 甚至不完全支持所有 SQL 特性；即便有这些短板，用 ORM 仍然极值得。Node.js 生态有**大量** ORM 可选，社区还没定出唯一首选；课程选 Prisma 是因为它的**流行度与社区支持**。Prisma ORM 具备完成本课程所需的全部特性还绰绰有余；它由**多个库**组成，可以按应用需要用 npm 装其中任何一个或多个。③ 三件套——**Prisma Schema**：定义模型（models）的文件，用 Prisma Schema Language（PSL）书写；官方示例是聊天应用的 Message 模型：id Int @id @default(autoincrement()) / content String @db.VarChar(255) / createdAt DateTime @default(now()) / author User @relation(fields: [authorId], references: [id]) / authorId Int——不仅有列定义，还有**定义在模型内部的表间关系**（细节在 Assignment 阅读里学）；schema 文件住在代码库里、被版本控制追踪——它的用处你可以想见。**Prisma Client**：与数据库交互的独立库；特别之处是它**按你的 schema 定制**——创建或更新 schema 文件后跑 npx prisma generate，Prisma 就替你生成客户端；然后 await prisma.message.create({data: {content, authorId}}) 建消息、const messages = await prisma.message.findMany() 取全部——prisma.message 对象正是从 schema 生成的；客户端能处理各种查询：joins、过滤、排序、分页等等；复杂查询搞不定时或你更习惯手写时，Prisma Client 也支持 **raw 查询**。**Prisma Migrate**：执行数据库迁移的工具——课程里用得不多但要知道它存在；任何时候决定改 schema，就跑一次 Prisma 迁移把变更应用到数据库；变更记录在代码库的 **migrations 文件夹**里追踪。④ 两个官方注记框——警告框（Prisma ORM limitations）：Using PostgreSQL 课学过 Identity 列，PostgreSQL 推荐用 Identity 列（符合 SQL 标准），但 **Prisma ORM 不支持它们**，会改建 PostgreSQL 特有的 **Serial Types**；这多半不影响你的项目，但值得记住（Serial 与 Identity 的差异见官方给的 Stack Overflow 答案 55300741）。tip 框：用 VS Code 可装**官方 Prisma 扩展**——语法高亮、IntelliSense/自动补全、schema linting、模型间便捷导航，让 Prisma schema 文件的工作愉快得多。Assignment 两条：① 过一遍 Quickstart with Prisma v7 ORM and PostgreSQL（覆盖迁移、schema 与 Prisma 客户端）——官方带一整块 note「Getting Prisma to work with JavaScript」：**Prisma 近期决定只继续支持 TypeScript**，所以要按官方给的逐步修改把 Quickstart 改造成 JS 版：Step 1 跳过 npm init / npm install typescript tsx @types/node --save-dev / npx tsc --init 三条命令；Step 2 不需要装 @types/pg，若出现 \"install scripts not yet covered by allowScripts\" 警告可安全忽略（Prisma 后续步骤会执行必要动作）；Step 3 整步跳过（不用 TypeScript）；Step 4 要用 prisma-client-js 生成器替代默认——init 命令加 --generator-provider prisma-client-js，且不想默认装 Prisma Skills 目录的 AI 特性再加 --no-skills：npx prisma init --datasource-provider postgresql --output ../generated/prisma --generator-provider prisma-client-js --no-skills；并把 prisma7.config.ts 重命名为 prisma7.config.js；Steps 5-6 无需改动；Step 7 建 lib/prisma.js（而非 .ts），import PrismaClient 时必须带 .js 扩展名：import { PrismaClient } from '../generated/prisma/client.js';；Step 8 文件命名 script.js，import prisma 时同样加 .js 扩展：import { prisma } from './lib/prisma.js';，运行用 node script.js；Step 9 无需改动。② 读 Prisma 文档的 9 篇文章并尽量跟着敲代码（「记不住没关系，后面的项目会大量练习 Prisma」）：What is Prisma ORM? / Prisma schema overview / Data models / Relations / Prisma client CRUD / Raw SQL / Prisma migrate getting started / Prisma migrate mental model / Data migrations。Additional resources 一条（选读）：Traversy Media 的 Prisma Crash Course 视频。",
      "guide": "以下是官方原课的中文化梳理。**开场**：受够了在项目里手写 raw SQL 查询？本课讲 **ORM（Object Relational Mappers，对象关系映射器）**——让你操作数据库中数据的工具，软件业广泛使用；然后深入 Node.js 生态里流行的一款：**Prisma ORM**。**课程概览**：ORM 是什么、为什么用；引入 Prisma ORM；描述 Prisma ORM 的特性。**① raw SQL 的痛点之一：代码太多（So much more code）**：需要一条 SELECT？写个查询。换张表的 SELECT？再写一条。程序员直觉发痒的话可以抽个 SELECT 工具函数——但要查指定列呢？改函数。要过滤和排序呢？你懂了吧。INSERT 及其全部变体同理复制一遍。或者换个方向：**按实体建模块**——比如 books 模块（官方示例 Book 类）：getBooks(filters) / getBookById(id) / createBook(data) / updateBook(id, data) / deleteBook(id) / getBookAuthors(id) / getBookGenres(id)……等等。也可以混合两种思路：建 Database 基类让实体类继承；或者你喜欢组合，就只跟纯函数打交道。**然后为每个实体、跨多个项目反复来一遍**——你懂的。官方辩证口径：**多写代码不一定坏**——你在学习与练习，个人项目足够用，我们甚至建议你去探索上述思路；但在**团队协作与大规模软件**中，与数据库交互**必须有标准方式**（外部库或自研方案）——那时你会真正意识到 ORM 多么帮你**聚焦业务关键（business critical）代码**。**官方 tip：重构你的旧项目**——如果之前的项目没用过上述任何范式，强烈建议回头重构；你可能最终做出一个非常基础的**迷你 ORM**——这会帮你更体会正经 ORM 如何让你的生活更轻松。**② 痛点之二：代码库导航（Navigating the codebase）**：当所有数据库交互都是 raw SQL，**代码库里没有任何地方**能让你看懂数据库表、它们的关系与列的数据类型——你可能得**登录数据库**才能理解代码库在干什么；要获得项目的技术理解，你现在依赖的是**代码库 + 数据库访问权**两样东西。多数 ORM 的解法：**把数据库定义带进代码库**——这叫 **schema（模式）**；让你能快速扫一眼表的 schema、明白它有哪些列等等。**③ 痛点之三：修改生产数据（Altering production data）**：随着项目需求演进，数据库**不可避免**要变——可能要加新列、或给新表灌入既有数据；术语叫**迁移（migration）**。没有 ORM 或类似库，你就得**手写这些迁移**——易错又繁琐。ORM 通过**变更日志（changelogs）标准化迁移**，并有处理冲突的流程。老实说课程项目里你跑不了几次迁移，但**职业工作里你可能隔天就要跑一次**。**④ 引入 Prisma ORM**：ORM 几乎解决上述全部痛点，但**并非全是阳光与玫瑰（not all sunshine and roses）**：完整理解一个 ORM 的里里外外有**学习曲线**，有些 ORM 甚至**不完全支持所有 SQL 特性**——即便有这些短板，用 ORM 仍然**极值得**。Node.js 生态有**大量** ORM 可选，社区还没落定唯一首选（hasn't landed on a go-to yet）；课程选 **Prisma ORM** 是因为它的**流行度与社区支持**。Prisma ORM 具备完成本课程所需的**全部特性还绰绰有余**（and then some）；它由**多个库**组成——可以按应用需要用 npm 安装其中任何一个或多个。先讨论它的几个特性，然后官方给出 Prisma 官方指南链接帮你上手。**⑤ Prisma Schema**：定义**模型（models）**的文件。官方示例——聊天应用的 message 表：model Message { id Int @id @default(autoincrement()) / content String @db.VarChar(255) / createdAt DateTime @default(now()) / author User @relation(fields: [authorId], references: [id]) / authorId Int }，配 model User { // user's fields }。这里有一堆新东西：Prisma schema 文件用 **Prisma Schema Language（PSL）**书写；你能看到不仅有表的**列定义**，还有**定义在 Message 模型内部的、指向另一张表的关系**（@relation）——这些在 Assignment 阅读里深入学。**这个 schema 文件住在你的代码库里、被版本控制追踪**——它的用处你现在应该能猜到了（痛点之二的答案）。**⑥ Prisma Client**：用来与数据库交互的**独立库**。Prisma client 有点特别：它是**按你的 schema 定制**的。什么意思？——官方示例：import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); 建消息：await prisma.message.create({ data: { content: 'Hello, world!', authorId: 1 } })；取全部消息：const messages = await prisma.message.findMany();。注意到 **prisma.message** 对象了吗？Prisma Client 怎么知道有个 message 模型？——创建或更新 schema 文件后，只需在 CLI 跑 **npx prisma generate**，Prisma ORM 就替你生成客户端。客户端能处理**各种查询：joins、过滤、排序、分页等等**；如果你有搞不定的复杂查询、或就是更习惯手写——**Prisma Client 也支持 raw 查询**（SQL 功底不作废）。**⑦ Prisma Migrate**：帮你执行数据库迁移的工具。课程里用不了太多，但知道它存在是好的：**任何时候你决定以任何方式改 schema，就跑一次 Prisma 迁移**把 schema 变更应用到数据库；这些变更在代码库的 **migrations 文件夹**里被追踪（痛点之三的答案）。**⑧ 官方警告框：Prisma ORM 的局限**——Using PostgreSQL 课学过 **Identity 列**：PostgreSQL 推荐使用 Identity 列（符合 SQL 标准）；但 **Prisma ORM 不支持这些列**，会改建 PostgreSQL 特有的 **Serial Types**。这**多半不影响你的项目**，但值得记住；Serial 与 Identity 的差异简述见官方给的 Stack Overflow 答案。**⑨ 官方 tip 框：VS Code 官方 Prisma 扩展**——用 VS Code 的话可以装官方扩展：**语法高亮、IntelliSense/自动补全、schema linting、模型间更易导航**——让 Prisma schema 文件的工作愉快得多。**Assignment（两条）**：**①** 过一遍 **Quickstart with Prisma v7 ORM and PostgreSQL**（覆盖迁移、schema 与 Prisma client）。**官方 note：让 Prisma 在 JavaScript 下工作**——Prisma 近期决定**只继续支持 TypeScript**，所以要按下列修改把 Quickstart 改造成 JS 版：**Step 1** 跳过这三条命令（npm init / npm install typescript tsx @types/node --save-dev / npx tsc --init）；**Step 2** 不需要装 @types/pg；若见 \"install scripts not yet covered by allowScripts\" 警告可**安全忽略**（Prisma 后续步骤自会执行必要动作）；**Step 3** 整步跳过（我们不用 TypeScript）；**Step 4** 要用 **prisma-client-js 生成器**替代默认——init 命令加 **--generator-provider prisma-client-js**；也不想默认安装 Prisma Skills 目录的任何 AI 特性——加 **--no-skills** 退出：npx prisma init --datasource-provider postgresql --output ../generated/prisma --generator-provider prisma-client-js --no-skills；并把 **prisma7.config.ts 重命名为 prisma7.config.js**；**Steps 5 与 6** 无需改动；**Step 7** 不建 lib/prisma.ts 而建 **lib/prisma.js**，且该文件 import PrismaClient 时**必须加 .js 扩展名**：import { PrismaClient } from '../generated/prisma/client.js';；**Step 8** 文件应命名 **script.js**，import prisma 时同样加 .js 扩展名，首行：import { prisma } from './lib/prisma.js';——运行脚本用 **node script.js**；**Step 9** 无需改动。**②** 读 Prisma 文档的下列文章，**尽量跟着示例敲代码**；「还记不住也没关系——后面的项目里我们会**大量**练习 Prisma」：What is Prisma ORM? / Prisma schema overview / Data models / Relations / Prisma client CRUD / Raw SQL / Prisma migrate getting started / Prisma migrate mental model / Data migrations（九篇，均 v7 文档）。**Additional resources（选读，非必需）**：Traversy Media 的 **Prisma Crash Course** 视频。",
      "understand": [
        "能复述 raw SQL 的三大痛点及 ORM 的对应解法：代码重复（每个实体每个项目重写查询层）→ 客户端按 schema 生成标准 API；代码库看不懂表结构（要登库才懂）→ schema 文件进代码库、被版本控制追踪；手写迁移易错繁琐 → migrations 文件夹 + 变更日志标准化",
        "能解释 Prisma Client「按 schema 定制」的含义：改完 schema 跑 npx prisma generate，客户端就有 prisma.message.create/findMany 这类与模型一一对应的 API——joins、过滤、排序、分页都能处理，且保留 raw SQL 出口",
        "能说出课程选 Prisma 的理由与 ORM 的代价：Node.js 生态 ORM 众多、社区无唯一首选，TOP 因流行度与社区支持选 Prisma；代价是学习曲线 + 部分 ORM 不完全支持所有 SQL 特性",
        "能完整执行官方 Quickstart 的 JS 改造要点：跳过 TS 安装与 tsc 步骤、init 加 --generator-provider prisma-client-js 与 --no-skills、prisma7.config.ts 改 .js、两处 import 加 .js 扩展名、node script.js 运行——因为 Prisma v7 只继续支持 TypeScript",
        "能说明 Prisma 的 Identity 列局限：PostgreSQL 推荐 Identity 列（SQL 标准），Prisma 不支持、会建 PostgreSQL 特有的 Serial Types——多半不影响课程项目，但要知道差异存在"
      ],
      "terms": [
        {
          "en": "ORM (Object Relational Mapper)",
          "zh": "对象关系映射器：让你用代码（而非手写 SQL）操作数据库数据的工具——把表映射为模型、把查询映射为方法调用；软件业广泛使用"
        },
        {
          "en": "Prisma Schema / PSL",
          "zh": "Prisma 的模型定义文件，用 Prisma Schema Language 书写——列定义 + 表间关系（@relation）都在里面；住进代码库、被版本控制追踪"
        },
        {
          "en": "Prisma Client",
          "zh": "按你的 schema 定制生成的数据库交互库（npx prisma generate）——prisma.message.create/findMany 式的类型化 API，支持 joins/过滤/排序/分页，也支持 raw SQL"
        },
        {
          "en": "Prisma Migrate / migration（迁移）",
          "zh": "把 schema 变更应用到数据库的工具与过程；变更记录在代码库 migrations 文件夹里追踪，用变更日志标准化、有冲突处理流程"
        },
        {
          "en": "Serial Types vs Identity 列",
          "zh": "Prisma 的局限：不支持 PostgreSQL 推荐的 Identity 列（SQL 标准），改建 PostgreSQL 特有的 Serial 类型——自增主键的两种实现"
        },
        {
          "en": "changelogs（变更日志）",
          "zh": "ORM 标准化迁移的载体——数据库结构随需求演进的每一步都留痕，职业工作里可能隔天就要跑一次迁移"
        }
      ],
      "tasks": [
        "过一遍 Quickstart with Prisma v7 ORM and PostgreSQL（覆盖迁移、schema 与 Prisma client）——注意官方 note「让 Prisma 在 JavaScript 下工作」：Prisma 已决定只继续支持 TypeScript，须按官方九步修改表把 Quickstart 改造成 JS 版（Step 1 跳过 TS 安装三命令；Step 2 不装 @types/pg、allowScripts 警告可忽略；Step 3 整步跳过；Step 4 init 命令加 --generator-provider prisma-client-js 与 --no-skills、prisma7.config.ts 重命名为 .js；Steps 5-6 不变；Step 7 建 lib/prisma.js 且 import 加 .js 扩展名；Step 8 建 script.js、import 加 .js 扩展名、node script.js 运行；Step 9 不变）",
        "阅读 Prisma 文档的九篇文章并尽量跟着示例敲代码（记不住没关系，后面的项目会大量练习 Prisma）：What is Prisma ORM? / Prisma schema overview / Data models / Relations / Prisma client CRUD / Raw SQL / Prisma migrate getting started / Prisma migrate mental model / Data migrations"
      ],
      "quiz": [
        {
          "question": "raw SQL 写法的三大痛点是什么？Prisma 的哪三件东西分别对应解决？",
          "answer": "① 代码太多：每张表每种操作都要手写查询，抽工具函数又要不断改造支持指定列/过滤/排序，每个实体每个项目重复——Prisma Client 按 schema 生成标准 API（prisma.message.create/findMany），团队有了统一的数据库交互方式；② 代码库导航：全 raw SQL 时代码库里没有任何地方能看懂表结构、关系与列类型，得登库才懂——Prisma Schema 把数据库定义带进代码库、被版本控制追踪；③ 修改生产数据：手写迁移易错繁琐——Prisma Migrate 用 migrations 文件夹与变更日志标准化迁移并处理冲突。"
        },
        {
          "question": "Prisma Client 怎么知道有个 message 模型？改了 schema 之后要做什么？",
          "answer": "Prisma Client 是按你的 schema 定制生成的：创建或更新 schema 文件后，在 CLI 跑 npx prisma generate，Prisma 就根据模型定义生成客户端——于是代码里出现 prisma.message 这样与模型一一对应的对象，能处理 joins、过滤、排序、分页等各类查询。复杂查询搞不定或更习惯手写时，它也支持 raw 查询——SQL 功底不作废。"
        },
        {
          "question": "官方说 ORM「并非全是阳光与玫瑰」——代价是什么？TOP 为什么仍选 Prisma？",
          "answer": "代价有二：完整理解一个 ORM 的里里外外有学习曲线；有些 ORM 甚至不完全支持所有 SQL 特性（Prisma 自己的例子：不支持 PostgreSQL 推荐的 Identity 列，会建 Serial Types 代替）。但即便有这些短板 ORM 仍极值得。Node.js 生态有大量 ORM 可选、社区还没定出唯一首选，TOP 选 Prisma 是因为它的流行度与社区支持，且它具备完成本课程所需的全部特性还绰绰有余。"
        },
        {
          "question": "跟着官方 Quickstart 用 JavaScript（而非 TypeScript）走 Prisma v7 时，init 命令要加哪两个参数？为什么？",
          "answer": "npx prisma init --datasource-provider postgresql --output ../generated/prisma --generator-provider prisma-client-js --no-skills。加 --generator-provider prisma-client-js 是因为要用 prisma-client-js 生成器替代默认（默认面向 TypeScript——Prisma 已决定只继续支持 TS）；加 --no-skills 是因为不想默认安装 Prisma Skills 目录里的任何 AI 特性。另外还要把 prisma7.config.ts 重命名为 prisma7.config.js，两处 import（PrismaClient 与 prisma）都要带 .js 扩展名，运行用 node script.js。"
        },
        {
          "question": "官方 tip 为什么建议回头重构你之前的项目、哪怕做出一个「迷你 ORM」？",
          "answer": "因为亲手为旧项目抽一次查询层（哪怕非常基础），你才会真正体会重复代码的痛与标准化的价值——官方原话：「这会帮你更体会正经 ORM 如何让你的生活更轻松」。官方对多写代码的辩证口径：学习与练习阶段不坏、个人项目够用、甚至鼓励探索；但团队与大规模软件必须有与数据库交互的标准方式，那时 ORM 帮你聚焦业务关键代码。"
        }
      ],
      "optional": [],
      "note": "本课是 World 7 后半程的技术转折点：从「手写 SQL + pg」切换到「schema 驱动的 Prisma」。三大痛点与三件套一一对应是本课的骨架；Quickstart 的九步 JS 改造表是实操时最容易踩偏的地方（Prisma v7 只支持 TS 是新近事实，网上大量旧教程对不上）。Identity 列局限呼应了 Using PostgreSQL 课的 identity 知识。",
      "why": "库存项目里你为每张表手写了 queries.js——那个文件再膨胀三倍、实体再翻两倍，就是官方说的「代码太多」痛点现场。Prisma 把表结构搬进代码库、把查询变成生成式 API、把改表变成可追踪的迁移，这三件事正是团队协作与大规模软件的刚需。后面的 File Uploader、Blog API、Odin-Book 三个项目全部用 Prisma 建模——这课不扎实，后面三个项目全程挣扎。",
      "sections": [
        {
          "h": "raw SQL 的三大痛点",
          "p": [
            "痛点一「代码太多」：SELECT 一条查询、换表再一条；抽工具函数又要改函数支持指定列、过滤、排序；INSERT 及其变体同理。替代路线官方也给了：按实体建模块（Book 类：getBooks/getBookById/createBook/updateBook/deleteBook/getBookAuthors/getBookGenres……）、Database 基类继承、组合、纯函数——但每个实体、每个项目都要重来一遍。",
            "官方辩证口径：多写代码不一定坏——学习与练习，个人项目够用，甚至建议你去探索上述思路；但团队协作与大规模软件中，必须有与数据库交互的标准方式（外部库或自研）——那时你会真正体会 ORM 帮你聚焦业务关键代码的价值。",
            "痛点二「代码库导航」：全 raw SQL 时代码库里没有任何地方能看懂表、关系与列类型——得登录数据库才能理解代码库；技术理解依赖代码库 + 数据库访问权两样。ORM 解法：把数据库定义带进代码库——这叫 schema。",
            "痛点三「修改生产数据」：需求演进时加列、灌新表——术语叫迁移（migration）；手写迁移易错繁琐；ORM 用变更日志标准化迁移、有冲突处理流程。课程项目跑不了几次迁移，职业工作可能隔天一次。"
          ],
          "list": [
            "官方 tip：回头重构旧项目，做出一个迷你 ORM——会更体会正经 ORM 如何省心"
          ]
        },
        {
          "h": "引入 Prisma ORM：选型理由与代价",
          "p": [
            "ORM 几乎解决全部痛点，但并非全是阳光与玫瑰：完整理解有学习曲线，有些 ORM 不完全支持所有 SQL 特性——即便如此仍极值得。",
            "Node.js 生态有大量 ORM 可选、社区还没定出唯一首选；TOP 选 Prisma 因为流行度与社区支持。",
            "Prisma ORM 具备完成本课程所需的全部特性还绰绰有余；它由多个库组成——按应用需要用 npm 装其中任何一个或多个。"
          ]
        },
        {
          "h": "Prisma Schema：住进代码库的数据库定义",
          "p": [
            "schema 是定义模型（models）的文件，用 Prisma Schema Language（PSL）书写。",
            "官方示例：聊天应用的 Message 模型——id Int @id @default(autoincrement())、content String @db.VarChar(255)、createdAt DateTime @default(now())、author User @relation(fields: [authorId], references: [id])、authorId Int；配一个 User 模型。",
            "不仅有列定义，还有定义在模型内部的表间关系（@relation）——细节在 Assignment 阅读里学。",
            "schema 文件住在代码库里、被版本控制追踪——这正是痛点二的答案：不登库也能看懂数据结构。"
          ]
        },
        {
          "h": "Prisma Client：按 schema 定制的查询库",
          "p": [
            "客户端是与数据库交互的独立库，特别之处：按你的 schema 定制。",
            "创建或更新 schema 文件后，CLI 跑 npx prisma generate——Prisma 替你生成客户端；于是有了 prisma.message.create({data: {content, authorId}}) 与 prisma.message.findMany() 这样与模型对应的 API。",
            "客户端能处理各种查询：joins、过滤、排序、分页等等；复杂查询搞不定或更习惯手写时，Prisma Client 也支持 raw 查询——World 6 学的 SQL 不作废。"
          ]
        },
        {
          "h": "Prisma Migrate 与两个官方注记框",
          "p": [
            "Migrate 是执行数据库迁移的工具：任何时候决定改 schema，就跑一次迁移把变更应用到数据库；变更记录在代码库的 migrations 文件夹里追踪。课程里用得不多，但职业工作里可能隔天一次。",
            "警告框（局限）：PostgreSQL 推荐 Identity 列（SQL 标准），Prisma ORM 不支持，会改建 PostgreSQL 特有的 Serial Types——多半不影响你的项目，但值得记住；Serial 与 Identity 差异见官方给的 Stack Overflow 答案。",
            "tip 框：VS Code 可装官方 Prisma 扩展——语法高亮、IntelliSense/自动补全、schema linting、模型间便捷导航。"
          ]
        },
        {
          "h": "Quickstart 的 JS 改造九步（Prisma v7 只支持 TS）",
          "p": [
            "官方 note：Prisma 近期决定只继续支持 TypeScript——跟 Quickstart 时要按官方修改表把步骤改造成 JavaScript 版。",
            "Step 1 跳过 npm init / npm install typescript tsx @types/node --save-dev / npx tsc --init；Step 2 不装 @types/pg（allowScripts 警告可安全忽略）；Step 3 整步跳过。",
            "Step 4：init 命令加 --generator-provider prisma-client-js（用 JS 生成器替代默认）与 --no-skills（不装 Prisma Skills 目录的 AI 特性）；prisma7.config.ts 重命名为 prisma7.config.js。Steps 5-6 不变。",
            "Step 7：建 lib/prisma.js，import PrismaClient 必须带 .js 扩展名（from '../generated/prisma/client.js'）；Step 8：建 script.js，import prisma 同样带 .js（from './lib/prisma.js'），运行 node script.js；Step 9 不变。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "class Book {\n  async getBooks(filters) {}\n  async getBookById(id) {}\n  async createBook(data) {}\n  async updateBook(id, data) {}\n  async deleteBook(id) {}\n  async getBookAuthors(id) {}\n  async getBookGenres(id) {}\n  // and so on\n}",
          "note": "官方「按实体建模块」的 Book 类示例——raw SQL 路线的自救方案之一：每种查询一个方法。官方口径：个人项目够用、值得探索，但每个实体每个项目都要重来一遍，团队与大规模场景必须有标准方式——这正是 ORM 的切入点。"
        },
        {
          "lang": "text",
          "code": "model Message {\n   id        Int      @id @default(autoincrement())\n   content   String   @db.VarChar(255) \n   createdAt DateTime @default(now())\n   author    User     @relation(fields: [authorId], references: [id])\n   authorId  Int     \n}\n\nmodel User {\n   // user's fields\n}",
          "note": "官方 Prisma Schema 示例（PSL 语言）：聊天应用的 Message 模型——@id @default(autoincrement()) 自增主键、@db.VarChar(255) 对应数据库列型、@relation(fields: [authorId], references: [id]) 把作者关系直接定义在模型里。schema 文件住进代码库、被版本控制追踪。"
        },
        {
          "lang": "javascript",
          "code": "// instantiate the client\nimport { PrismaClient } from '@prisma/client';\nconst prisma = new PrismaClient();\n\n// when creating a new message\nawait prisma.message.create({\n   data: {\n      content: 'Hello, world!',\n      authorId: 1\n   }\n})\n\n// when fetching all messages\nconst messages = await prisma.message.findMany();",
          "note": "官方 Prisma Client 示例：prisma.message 从哪来？——schema 更新后跑 npx prisma generate，客户端按模型定制生成。create/findMany 之外还能处理 joins、过滤、排序、分页；搞不定的复杂查询可以走 raw SQL。"
        },
        {
          "lang": "bash",
          "code": "npx prisma init --datasource-provider postgresql --output ../generated/prisma --generator-provider prisma-client-js --no-skills",
          "note": "官方 Quickstart JS 改造的 Step 4 完整命令：--generator-provider prisma-client-js 用 JS 生成器替代默认（Prisma v7 默认面向 TypeScript）；--no-skills 退出 Prisma Skills 目录的 AI 特性默认安装。之后把 prisma7.config.ts 重命名为 prisma7.config.js。"
        }
      ],
      "pitfalls": [
        {
          "title": "跟着 Quickstart 走成 TypeScript",
          "text": "Prisma v7 的 Quickstart 默认面向 TypeScript，而 TOP 课程是 JavaScript——不照官方九步改造表走（跳过 tsc、init 加 --generator-provider prisma-client-js --no-skills、config 改 .js、import 带 .js 扩展名），每一步都会报模块找不到或类型文件错误。网上大量 Prisma 教程基于旧版本，对不上时以官方 v7 文档 + 课内改造表为准。"
        },
        {
          "title": "改了 schema 忘记 generate",
          "text": "Prisma Client 是按 schema 定制生成的——新增或修改模型后不跑 npx prisma generate，代码里的 prisma.newModel 就是 undefined。同理，改 schema 还要跑迁移把变更应用到数据库，否则客户端与真实表结构对不上。"
        },
        {
          "title": "以为 ORM 全知全能",
          "text": "官方明说「并非全是阳光与玫瑰」：有学习曲线，且不完全支持所有 SQL 特性——Prisma 自己的例子就是 Identity 列（会建 Serial Types 代替）。复杂查询搞不定时，Prisma Client 保留了 raw SQL 出口——World 6 的 SQL 功底仍是底牌，不是可以丢掉的旧技能。"
        }
      ],
      "official": {
        "assignment": [
          "过一遍 Quickstart with Prisma v7 ORM and PostgreSQL（覆盖迁移、schema 与 Prisma client）；按官方 note「Getting Prisma to work with JavaScript」的九步修改表把 Quickstart 改造成 JS 版（Prisma 已决定只继续支持 TypeScript）：跳过 TS 安装与 tsc、不装 @types/pg、init 加 --generator-provider prisma-client-js 与 --no-skills、prisma7.config.ts 改 .js、两处 import 加 .js 扩展名、node script.js 运行",
          "阅读 Prisma 文档九篇并尽量跟着敲代码（记不住没关系，后面项目会大量练习）：What is Prisma ORM? / Prisma schema overview / Data models / Relations / Prisma client CRUD / Raw SQL / Prisma migrate getting started / Prisma migrate mental model / Data migrations"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "Traversy Media《Prisma Crash Course》视频"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/orms/prisma_orm.md（本站自行编写简体讲解与任务拆解，未改编自任何第三方中文课程）",
        "sha256": "b6a4404ffd33d9ef5a62535d6cc64568eb0a9581ad3b7a38b2a083ee25e2de0b",
        "verifiedAt": "2026-09-29"
      }
    },
    {
      "id": "nodejs-file-uploader",
      "title": "Project: File Uploader",
      "zh": "项目：文件上传站",
      "group": 3,
      "url": "https://www.theodinproject.com/lessons/nodejs-file-uploader",
      "summary": "「ORM」章的实战项目（全站第 29 门 Project 课）：建一个精简版 Google Drive（或任何其他个人存储服务）。官方定位：第一次把「文件上传」这个真实世界高频需求与刚学的 Prisma + 认证课的组合拳打在一起。Assignment 七条 + Extra credit 一条：① 用 Express 和 Prisma 建一个新项目，装好全部必要依赖（包括 Passport 等）。② 用 Passport.js 建立基于会话（session based）的认证；用 Prisma session store 库（kleydon/prisma-session-store）把会话持久化到数据库。③ 加一个表单让已认证用户上传文件；文件先存在你的文件系统里——需要集成 multer 中间件（expressjs/multer）；官方口径：等其他功能都跑通后再上传这些文件（指转移到云存储）。④ 加文件夹：用户应能对文件夹做 CRUD 并把文件上传进文件夹——为此建立路由与必要的数据库交互。⑤ 加一条路由查看特定文件的详情：名称、大小、上传时间；应有下载按钮允许用户下载该文件。⑥ 最后加上传文件的逻辑（指上云）：可以存进数据库，但官方建议这种场景用云存储服务——可以用 Cloudinary 或 Supabase storage；文件上传后，把文件 URL 存进数据库。⑦ 校验你的文件！怎么做由你定：可以限制可上传的文件类型，和/或限制过大的文件。Extra credit：加分享文件夹功能——用户想分享一个文件夹（及其全部内容）时，应有一个表单指定时长（如 1d、10d）；生成一个可与任何人（含未认证用户）分享的链接，格式例如 https://yourapp.com/share/c758c495-0705-44c6-8bab-6635fd12cf81（UUID 路径）。本课官方无 Additional resources。",
      "guide": "以下是官方项目要求的中文化梳理。**红线**：本站不提供成品代码——数据模型、路由、multer 配置、云存储集成全部自己设计。**项目一句话**：建一个**精简版 Google Drive**（或任何其他个人存储服务）——文件上传是真实世界应用的高频需求，本课把 Prisma（上一章刚学）+ Passport 认证（上上一章刚学）+ 文件处理三样拧在一起。**第 1 步：项目初始化**：用 **Express 和 Prisma** 建新项目；安装所有必要依赖——**包括 Passport 等**（认证不是可选项，是这个应用的地基）。**第 2 步：会话持久化**：用 Passport.js 建立**基于会话的认证**（session based authentication）；用 **Prisma session store 库**（kleydon/prisma-session-store）把**会话持久化进数据库**——默认会话存内存，服务器一重启全员掉线；存进数据库才是生产做法（认证课 Assignment 批注里 connect-pg-simple 的同一思想，这里用 Prisma 生态的实现）。**第 3 步：第一个上传表单**：加一个表单，**已认证用户**可以上传文件；**先把文件存进你的文件系统**（filesystem）——需要集成 **multer 中间件**（Express 官方的 multipart/form-data 处理库）；官方口径：**等其他功能都跑通后**我们再「上传这些文件」（指第 6 步转移到云存储——先本地跑通再上云，降低一次调试的变量数）。**第 4 步：文件夹**：用户应能对文件夹做 **CRUD**（建、读、改、删）并**把文件上传进文件夹**；为此建立路由与必要的数据库交互——Prisma schema 里 File 与 Folder 的关系建模是这一步的本体（一对多？文件必须属于文件夹还是可游离？自己拍板并写进 schema）。**第 5 步：文件详情与下载**：加一条路由查看**特定文件详情**：名称（name）、大小（size）、上传时间（upload time）；页面上应有**下载按钮**允许用户下载该文件。**第 6 步：上云**：最后加**上传文件的逻辑**（转移到云）：可以存进数据库，但官方建议此场景用**云存储服务**——可以用 **Cloudinary** 或 **Supabase storage**；文件上传后，把**文件 URL 存进数据库**（数据库存指针、云存储存本体——大二进制进库会把备份与查询全拖垮）。**第 7 步：文件校验**：**校验你的文件**！怎么做由你定：可以**限制可上传的文件类型**，和/或**限制过大的文件**（restrict files that are too heavy）——multer 自带 limits 与 fileFilter 钩子可承接这两条。**Extra credit：分享文件夹**——用户想分享一个文件夹（**及其全部内容**）时，应有一个表单**指定时长**（即 1d、10d 等）；生成一个**可与任何人分享**的链接——**包括未认证用户**；链接格式示例：https://yourapp.com/share/c758c495-0705-44c6-8bab-6635fd12cf81——路径里是 UUID：不可枚举的随机 token 就是访问凭证（拿到链接=拿到授权），过期时间到了链接失效。**官方无 Additional resources。**",
      "understand": [
        "能说出本项目「先本地文件系统、后云存储」的两段式路线及其理由：multer 先把文件落到文件系统跑通全部功能，最后一步再集成 Cloudinary 或 Supabase storage 上云、数据库改存文件 URL——一次只引入一个变量",
        "能解释会话为什么要持久化进数据库：默认内存会话在服务器重启后全丢（全员掉线），多实例部署时更对不上——Prisma session store 把会话变成库里的数据，与认证课 connect-pg-simple 批注同一思想",
        "能设计 File/Folder/User 三者的 Prisma 关系并说明取舍：文件夹 CRUD、文件进文件夹、详情（名称/大小/上传时间）与下载路由都依赖这套模型——关系基数与「文件可否游离于文件夹」是自己要拍板的设计决定",
        "能列出文件校验的两个官方指定维度（类型限制、大小限制）并说明落在哪一层：multer 的 fileFilter 与 limits 在上传入口拦截，而不是等文件落盘后再补救",
        "能解释 Extra credit 分享链接的安全模型：UUID 路径不可枚举、拿到链接即授权、表单指定的时长（1d/10d）控制过期——对未认证用户开放却不暴露其他任何数据"
      ],
      "terms": [
        {
          "en": "multer",
          "zh": "Express 生态的 multipart/form-data 中间件——处理文件上传的标配；负责把上传文件落到文件系统（或内存），带 limits/fileFilter 校验钩子"
        },
        {
          "en": "Prisma session store",
          "zh": "kleydon/prisma-session-store 库：把 Passport 会话持久化进 Prisma 管理的数据库——替代默认的内存存储，重启不掉线"
        },
        {
          "en": "session based authentication",
          "zh": "基于会话的认证：登录后服务器建会话、浏览器持 connect.sid cookie——认证课的完整套件在本项目直接复用"
        },
        {
          "en": "cloud storage（云存储）",
          "zh": "文件本体的存放处（官方点名 Cloudinary 或 Supabase storage）——数据库只存文件 URL 指针，大二进制不进库"
        },
        {
          "en": "share link（分享链接）",
          "zh": "Extra credit 的产物：/share/<UUID> 形式的不可枚举链接 + 时长（1d/10d）过期——未认证用户凭链接访问文件夹全部内容"
        }
      ],
      "tasks": [
        "用 Express 和 Prisma 建立一个新项目；安装所有必要的依赖——包括 Passport 等",
        "用 Passport.js 建立基于会话的认证；使用 Prisma session store 库（kleydon/prisma-session-store）把会话持久化到数据库",
        "加一个表单让已认证用户上传文件；先把文件保存进你的文件系统——需要集成 multer 中间件；官方口径：等其他功能都跑通后再上传这些文件（转移到云存储）",
        "加文件夹：用户应能对文件夹做 CRUD 并把文件上传进文件夹——为此建立路由与必要的数据库交互",
        "加一条路由查看特定文件的详情：名称、大小与上传时间；应有下载按钮允许用户下载该文件",
        "最后，加上上传文件的逻辑（上云）：可以存进数据库，但建议这种场景用云存储服务——可以用 Cloudinary 或 Supabase storage；文件上传后，把文件 URL 存进数据库",
        "校验你的文件！怎么做由你定：可以限制可上传的文件类型，和/或限制过大的文件"
      ],
      "quiz": [
        {
          "question": "官方为什么让你先把文件存进本地文件系统，最后一步才上云存储？数据库在上云后存什么？",
          "answer": "分两段是控制复杂度：multer 先把文件落到文件系统，把认证、文件夹 CRUD、详情与下载全部跑通，最后才引入 Cloudinary 或 Supabase storage——一次只引入一个变量，出错好定位。上云后数据库不存文件本体，只存文件 URL（指针）：大二进制进库会把备份、迁移与查询全拖垮，云存储天生为分发大文件设计。"
        },
        {
          "question": "为什么会话要用 Prisma session store 持久化进数据库？不做会怎样？",
          "answer": "Passport 默认把会话数据放内存：服务器一重启所有会话丢失、全员掉线；多实例部署时请求落到另一台机器也对不上会话。用 kleydon/prisma-session-store 把会话变成数据库里的 Prisma 模型数据，重启与扩容都不丢登录态——这与认证课 Assignment 批注里「connect-mongo 换 connect-pg-simple」是同一思想：会话要落库。"
        },
        {
          "question": "官方指定的文件校验有哪两个维度？Extra credit 的分享链接如何做到「任何人可访问」又不失控？",
          "answer": "校验两维度（怎么做由你定）：限制可上传的文件类型；限制过大的文件——multer 的 fileFilter 与 limits 钩子在上传入口就能拦。分享链接的安全模型：路径用 UUID（如 /share/c758c495-...）——不可枚举、猜不到，拿到链接即等于拿到授权；表单指定的时长（1d、10d 等）控制过期，到期链接失效；访问范围只限该文件夹及其内容，未认证用户也看不到站点其他任何数据。"
        }
      ],
      "optional": [],
      "note": "Project 红线课：本站不提供成品代码，examples 为空数组——Prisma 模型关系、multer 配置、云存储集成、分享 token 全部自己设计。这是全站第 29 门 Project 课、World 7 第 5 门。它是前四章知识的组合验收：认证（Passport 会话）+ ORM（Prisma 建模与 session store）+ Express 路由/表单/部署全套；「先本地后上云」与「库里只存 URL」两个架构决策是官方明写的工程判断练习。",
      "why": "「用户上传文件」是几乎所有真实产品的标配需求——头像、附件、图片帖，而它恰好是纯 CRUD 项目练不到的领域：multipart 表单、文件系统、二进制大小、云存储、分享凭证一次全遇到。这个项目也是 Odin-Book 的直接前置：那门最终项目的 Extra credit「图片帖」明说回这里取 Cloudinary/Supabase 方案。做完它，你的全栈拼图补上「文件」这一块。",
      "sections": [
        {
          "h": "项目一句话：精简版 Google Drive",
          "p": [
            "建一个精简版 Google Drive（或任何其他个人存储服务）——登录、上传、建文件夹、查详情、下载、分享。",
            "官方定位：Prisma（上一章刚学）+ Passport 认证（上上一章刚学）+ 文件处理三样拧在一起的综合练习；本站红线：不提供成品代码，模型与路由全部自己设计。"
          ]
        },
        {
          "h": "初始化与会话持久化（第 1-2 步）",
          "p": [
            "用 Express 和 Prisma 建新项目，装好全部必要依赖——包括 Passport 等：认证是这个应用的地基，不是可选项。",
            "用 Passport.js 建立基于会话的认证，并用 Prisma session store 库（kleydon/prisma-session-store）把会话持久化进数据库——默认内存会话一重启全丢，落库才是生产做法（认证课 connect-pg-simple 批注的同一思想，Prisma 生态实现）。"
          ]
        },
        {
          "h": "multer 上传与文件夹 CRUD（第 3-4 步）",
          "p": [
            "加一个表单让已认证用户上传文件；文件先存进你的文件系统——集成 multer 中间件处理 multipart/form-data。",
            "官方口径：等其他功能都跑通后再转移上云（第 6 步）——先本地跑通再上云，一次只引入一个变量。",
            "加文件夹：用户能对文件夹做 CRUD 并把文件上传进文件夹；建立路由与必要的数据库交互——File/Folder/User 的 Prisma 关系建模是这一步的本体：文件必须属于文件夹还是可游离？自己拍板写进 schema。"
          ]
        },
        {
          "h": "详情、下载与上云（第 5-6 步）",
          "p": [
            "加一条路由查看特定文件详情：名称、大小、上传时间；配下载按钮。",
            "最后加上云逻辑：可以存数据库，但官方建议此场景用云存储服务——Cloudinary 或 Supabase storage；文件上传后把文件 URL 存进数据库——数据库存指针、云存储存本体，大二进制不进库。"
          ]
        },
        {
          "h": "文件校验（第 7 步）",
          "p": [
            "校验你的文件！怎么做由你定，官方给了两个维度：限制可上传的文件类型；限制过大的文件。",
            "multer 自带 fileFilter 与 limits 钩子，在上传入口拦截——不要等文件落盘后再补救。"
          ]
        },
        {
          "h": "Extra credit：带时效的分享链接",
          "p": [
            "用户想分享一个文件夹（及其全部内容）时，有一个表单指定时长（即 1d、10d 等）。",
            "生成一个可与任何人分享的链接——包括未认证用户；官方示例格式：https://yourapp.com/share/c758c495-0705-44c6-8bab-6635fd12cf81。",
            "安全模型：UUID 路径不可枚举、拿到链接即授权、时长控制过期——对未认证用户开放却不暴露站点其他任何数据。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "把文件二进制存进数据库",
          "text": "官方在第 6 步给了明确倾向：可以存库，但建议用云存储服务、库里只存文件 URL。大二进制进库会拖垮备份、迁移与查询性能；云存储（Cloudinary/Supabase storage）天生为存储与分发大文件设计——「数据库存指针、云存本体」是这个项目的核心架构决策。"
        },
        {
          "title": "会话留在内存里",
          "text": "Passport 默认内存会话：开发时看不出问题，服务器一重启全员掉线、部署多实例时更是各存各的。第 2 步的 Prisma session store 不是装饰——把会话落库是从玩具到可部署应用的分水岭之一。"
        },
        {
          "title": "跳过校验直接收文件",
          "text": "第 7 步官方要求校验文件：类型与大小两个维度。不校验的上传接口就是任意文件写入漏洞——可执行脚本、超大文件塞爆磁盘都在射程内；multer 的 fileFilter 与 limits 在入口就拦，别等落盘后补救。"
        },
        {
          "title": "分享链接用自增 id",
          "text": "Extra credit 的链接格式官方特意给了 UUID：/share/1、/share/2 这种可枚举路径等于把全部分享目录公开——陌生人加一就能遍历。UUID 不可猜，「拿到链接即授权」的模型才成立；再配时长过期，凭证才有生命周期。"
        }
      ],
      "official": {
        "assignment": [
          "用 Express 和 Prisma 建立新项目，安装所有必要依赖（包括 Passport 等）",
          "用 Passport.js 建立基于会话的认证；用 Prisma session store 库（kleydon/prisma-session-store）把会话持久化到数据库",
          "加表单让已认证用户上传文件；先存进你的文件系统——集成 multer 中间件；等其他功能跑通后再上传这些文件（上云）",
          "加文件夹：用户能对文件夹 CRUD 并把文件上传进文件夹——建立路由与必要的数据库交互",
          "加路由查看特定文件详情（名称、大小、上传时间）；配下载按钮",
          "加上传文件的逻辑（上云）：可存数据库但建议用云存储服务（Cloudinary 或 Supabase storage）；上传后把文件 URL 存进数据库",
          "校验你的文件：可限制文件类型，和/或限制过大的文件——做法自定"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "Extra credit：分享文件夹——表单指定时长（1d、10d 等），生成可与任何人（含未认证用户）分享的链接，例如 https://yourapp.com/share/c758c495-0705-44c6-8bab-6635fd12cf81"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/orms/project_file_uploader.md（本站自行编写简体讲解与任务拆解，未改编自任何第三方中文课程；Project 红线：不提供成品答案）",
        "sha256": "47889ffecddaad54951cc5471ed9836e6c2113ee6c4ff42f887f6350fd58afa6",
        "verifiedAt": "2026-09-29"
      }
    },
    {
      "id": "nodejs-api-basics",
      "title": "API Basics",
      "zh": "API 基础",
      "group": 4,
      "url": "https://www.theodinproject.com/lessons/nodejs-api-basics",
      "summary": "「API」章的开篇知识课（官方原文约 7.3KB）：让 Express 应用从「渲染 HTML」切换到「输出 JSON」，并按 REST 惯例组织端点。四大块：① 前后端分离模式——近年来一种新的网站开发模式越来越流行：不再做一个同时托管数据库与视图模板的应用，而是把关注点拆成独立项目——后端与数据库托管在服务器上（Heroku 这类 PaaS 或 DigitalOcean 这类 VPS），前端用 GitHub Pages 或 Netlify 这类服务托管；这种技术有时被称为 Jamstack。这样组织的好处：项目更模块化（业务逻辑不与视图逻辑混在一起）；一个后端源可以服务多个前端应用（网站、桌面应用、移动应用）；还有人喜欢这个模式是因为想用 React/Vue 这类前端框架做纯前端的单页应用。前后端之间通常用 JSON 对话——前端 JavaScript 课程里已经见过 JSON，所以此刻你真正要学的只是「怎么让 Express 说 JSON 而不是 HTML」：本质上只需把信息传给 res.json() 而非 res.send() 或 res.render()（官方给了 Express 5.x API 文档三个方法的锚点链接）。「就这么简单」。官方还回指 Routes 课的路由组织：把相关路由归组、每组抽成独立文件——更容易改特定路由而不影响其他。② REST——API 的结构可以有很多种形态，比如路由可以叫 /api/getAllPostComments/:postid 或 /api/posts/:postid/comments；然而惯例是遵循 REST（Representational State Transfer，表述性状态转移的缩写）——一种流行且常见的 API 组织方法，与 CRUD 动作对应（官方链 codecademy 的 What is CRUD 文）。遵循 REST 这类既定模式让 API 更可维护、让其他开发者更容易集成你的 API——「软件开发常常关乎清晰沟通，遵循预期有助于沟通」。REST 的实际技术定义（官方链 Wikipedia）有点复杂，但对我们而言，大部分要素（无状态 statelessness、可缓存性 cacheability 等）用 Express 输出 JSON 时就默认覆盖了；我们特别要想的是**如何组织端点 URI**（Uniform Resource Identifier，统一资源标识符）。REST API 是资源导向（resource based）的：不用 /getPostComments 或 /savePostInDatabase 这类动词名，而是**直接指向资源**（这里是博客文章），用 GET/POST/PUT/DELETE 这些 HTTP 动词决定动作。典型形态是每资源两个 URI：集合与集合中的单个对象——/posts 取文章列表、/posts/:postid 取特定一篇；集合可以嵌套：/posts/:postid/comments 取某篇文章的评论列表、/posts/:postid/comments/:commentid 取特定一条评论。③ HTTP 动词表（官方表格）：POST=Create（POST /posts 创建新博文）、GET=Read（GET /posts/:postid 取单篇）、PUT=Update（PUT /posts/:postid 更新单篇）、DELETE=Delete（DELETE /posts/:postid 删除单篇）——URI 的每个部分都指定资源：GET /posts 返回整个列表、GET /posts/:postid 指定确切一篇、再嵌套到评论。④ Same Origin Policy 与 CORS——同源策略（官方链 MDN）是浏览器的重要安全措施：限制网页向「提供该页面的源」之外的不同源发请求（什么算同源看链接里的例子）。下一个项目要把 REST API 与前端**分开部署（不同域名）**，意味着需要在服务器上启用跨源资源共享（Cross-Origin Resource Sharing，CORS）来允许独立前端访问其资源；Express 有 CORS 中间件包（官方链 Express 中间件页）帮你配置。官方口径：现阶段允许任何源访问是可以接受的——这让开发容易得多；但对任何真实项目，部署到生产环境后你多半会想**只放行你的前端网站**、屏蔽其他一切源——上面的文档解释了怎么做。Assignment 两条：① 读 RESTful API design 最佳实践（stackoverflow.blog 2020-03-02 文）——官方批注：若想跟着第一篇文敲代码，注意它包含用 body-parser 中间件解析请求体 JSON 的步骤，但自 Express 4.16.0 起该解析功能已直接并入 Express 包本身（express.json()）。② 读并跟敲「在 Express 里搭 REST API」教程（robinwieruch.de/node-express-server-rest-api/）——官方评价：这是我们遇到过的最佳 Express 教程之一，还讲模块化代码组织、编写中间件，文末链了一些很棒的补充信息。Additional resources 一条（选读）：REST 的简单英文版 Wikipedia 条目——基于示例的定义（simple.wikipedia.org）。",
      "guide": "以下是官方原课的中文化梳理。**开场**：近年来一种新的网站开发模式 gaining popularity——不再做一个**同时托管数据库与视图模板**的应用，许多开发者把这些关注点**拆成独立项目**：后端与数据库托管在服务器上（**Heroku** 这类，或 **DigitalOcean** 这类 VPS），前端用 **GitHub Pages** 或 **Netlify** 这类服务托管。这种技术有时被称为 **Jamstack**。**这样组织的好处**：项目**更模块化**——业务逻辑不与视图逻辑混在一起；**一个后端源可以服务多个前端应用**——网站、桌面应用、移动应用；还有开发者喜欢这个模式是因为想用 **React 或 Vue** 这类前端框架做漂亮的**纯前端单页应用**。前后端应用通常用 **JSON** 对话——走过前端 JavaScript 课程的你已经见过它。所以此刻你真正要学的只是：**怎么让 Express 应用说 JSON 而不是 HTML**。课末 Assignment 会带你过一个教程，但本质上你要做的全部就是：把信息传给 **res.json()** 而不是 **res.send()** 或 **res.render()**（官方链 Express 5.x API 文档的三个锚点）。「就这么简单（How easy is that?）」**回指 Routes 课**：还记得路由组织吗——把相关路由归组、每组抽成独立文件；这种方式让你更容易修改特定路由而不影响其他。**① REST**：API 的结构可以有很多形态——比如路由叫 **/api/getAllPostComments/:postid** 或者 **/api/posts/:postid/comments**。***然而***，惯例是遵循 **REST**（**Representational State Transfer** 的缩写）——一种流行且常见的 API 组织方法，与 **CRUD 动作**对应。遵循 REST 这类既定模式让你的 API **更可维护**、让其他开发者**更容易集成**你的 API——「软件开发常常关乎**清晰沟通**，遵循预期有助于沟通」。REST 的**实际技术定义**（Wikipedia）有点复杂，但对我们而言，大部分要素（**无状态 statelessness、可缓存性 cacheability** 等）**用 Express 输出 JSON 时就默认覆盖了**；我们特别要想的是：**如何组织端点 URI**（Uniform Resource Identifier，统一资源标识符）。**REST API 是资源导向（resource based）的**：不用 **/getPostComments** 或 **/savePostInDatabase** 这类名字，而是**直接指向资源**（本例是博客文章），用 **GET、POST、PUT、DELETE** 这些 HTTP 动词决定动作。典型形态：**每个资源两个 URI**——一个给整个集合、一个给集合中的单个对象：从 **/posts** 取博文列表，从 **/posts/:postid** 取特定一篇。**集合可以嵌套**：取某篇文章的评论列表访问 **/posts/:postid/comments**，取单条评论 **/posts/:postid/comments/:commentid**。**② HTTP 动词表**（官方表格原样）：**POST=Create**——POST /posts 创建新博文；**GET=Read**——GET /posts/:postid 取单篇；**PUT=Update**——PUT /posts/:postid 更新单篇；**DELETE=Delete**——DELETE /posts/:postid 删除单篇。**URI 的每个部分都指定资源**：GET /posts 返回整个博文列表，GET /posts/:postid 指定我们想要的确切一篇；可以继续嵌套——GET /posts/:postid/comments 返回该文章的评论列表，甚至 GET /posts/:postid/comments/:commentid 定位非常特定的那条评论。**③ CORS**：**同源策略（Same Origin Policy）**是浏览器的重要安全措施：**限制网页向「提供该页面的源」之外的不同源发请求**（什么算「同源」看 MDN 链接里的几个例子）。下一个项目我们会把 REST API 与前端**分开部署（不同域名）**——意味着需要在服务器上启用**跨源资源共享（Cross-Origin Resource Sharing，CORS）**，允许我们独立的前端访问它的资源。Express 有一个 **CORS 中间件包**（官方链 Express 中间件资源页）帮你把一切配好。**官方口径**：现阶段**允许任何源访问是可以接受的**——这让开发容易得多；但对任何***真实***项目，一旦部署到生产环境，你多半会想**专门屏蔽除你的前端网站之外任何源**的访问——上面的文档解释了怎么做。**Assignment（两条）**：**①** 读 **RESTful API design**（最佳实践，stackoverflow.blog）。官方批注：想跟着第一篇文敲代码的话请注意——它包含 **body-parser** 中间件来解析请求体上的 JSON 数据，但**自 Express 4.16.0 起这个解析功能已直接并入 Express 包本身**（不用再单独装 body-parser）。**②** 读并**跟着敲**这个教程：**在 Express 里搭建 REST API**（robinwieruch.de）。官方评价：「这是我们遇到过的**最佳 Express 教程之一**」——它还讲**模块化代码组织**、**编写中间件**，文末链了一些很棒的补充信息。**Additional resources（选读，非必需）**：REST 的**简单英文版 Wikipedia 条目**——基于示例的定义（simple.wikipedia.org，比正式版好读）。",
      "understand": [
        "能描述前后端分离模式与 Jamstack：后端+数据库上服务器（Heroku/DigitalOcean），前端上静态托管（GitHub Pages/Netlify），两边用 JSON 对话——好处是模块化、一个后端服务多个前端（网站/桌面/移动）、前端可自由用 React/Vue 做单页应用",
        "能说出「让 Express 说 JSON」的全部技术含量：把信息传给 res.json() 而不是 res.send() 或 res.render()——其余（无状态、可缓存等 REST 要素）用 Express 输出 JSON 时默认覆盖",
        "能按 REST 惯例设计端点 URI：资源导向命名（/posts 而非 /getAllPosts）、每资源两个 URI（集合+单个）、可嵌套（/posts/:postid/comments/:commentid）、动作交给 HTTP 动词（POST 建/GET 读/PUT 改/DELETE 删）",
        "能解释同源策略与 CORS 的关系：浏览器限制网页向不同源发请求（安全措施）；前后端分开部署=不同域=被拦，所以服务器要启用 CORS 放行前端；开发期可允所有源，生产环境应只放行自己的前端域名",
        "能说出两条 Assignment 的实操注意点：stackoverflow.blog 文里的 body-parser 自 Express 4.16.0 已内置（express.json()）；robinwieruch 教程是官方评价「最佳之一」，要跟着敲"
      ],
      "terms": [
        {
          "en": "Jamstack",
          "zh": "前后端分离部署的技术模式称谓：后端 API+数据库在服务器，前端静态托管（Pages/Netlify）——模块化、一后端多前端"
        },
        {
          "en": "REST (Representational State Transfer)",
          "zh": "表述性状态转移——流行的 API 组织惯例：资源导向 URI + HTTP 动词表动作；无状态、可缓存等要素用 Express 输出 JSON 时默认覆盖"
        },
        {
          "en": "URI (Uniform Resource Identifier)",
          "zh": "统一资源标识符——REST 组织的对象：每资源两个（集合 /posts 与单个 /posts/:postid），可嵌套到评论级"
        },
        {
          "en": "resource based（资源导向）",
          "zh": "REST 命名铁律：URI 直接指资源（名词），不用 /getPostComments 这类动词名——动作由 GET/POST/PUT/DELETE 表达"
        },
        {
          "en": "Same Origin Policy（同源策略）",
          "zh": "浏览器安全措施：限制网页向「提供该页面的源」之外的不同源发请求——前后端分域名部署时它就是你必须配 CORS 的原因"
        },
        {
          "en": "CORS (Cross-Origin Resource Sharing)",
          "zh": "跨源资源共享：服务器端放行指定源的机制；Express 有官方 CORS 中间件包——开发可允所有源，生产只放行自己的前端"
        }
      ],
      "tasks": [
        "阅读 RESTful API design 最佳实践（stackoverflow.blog）——官方批注：若想跟着第一篇文敲代码，注意它包含用 body-parser 中间件解析请求体 JSON 的步骤，但自 Express 4.16.0 起该解析功能已直接并入 Express 包本身",
        "阅读并跟着敲这个「在 Express 里搭建 REST API」教程（robinwieruch.de/node-express-server-rest-api/）——官方评价：我们遇到过的最佳 Express 教程之一，还讲模块化代码组织与编写中间件，文末有很棒的补充信息链接"
      ],
      "quiz": [
        {
          "question": "前后端分离模式（Jamstack）相比「一个应用同时托管数据库与视图模板」有什么好处？",
          "answer": "官方给了三条：① 更模块化——业务逻辑不再与视图逻辑混在一个项目里；② 一个后端源可以服务多个前端应用——网站、桌面应用、移动应用共用同一套 API；③ 前端自由——可以用 React 或 Vue 这类框架做纯前端的单页应用。部署形态：后端+数据库在服务器（Heroku 或 DigitalOcean 这类 VPS），前端在 GitHub Pages 或 Netlify 这类静态托管。"
        },
        {
          "question": "「让 Express 说 JSON 而不是 HTML」技术上要做什么？REST 的其他要素（无状态、可缓存）需要专门实现吗？",
          "answer": "本质上只需把信息传给 res.json() 而不是 res.send() 或 res.render()——官方原话「就这么简单」。REST 实际技术定义里的其他要素（statelessness 无状态、cacheability 可缓存性等）用 Express 输出 JSON 时就默认覆盖了，不需要专门实现；我们真正要花心思的是如何组织端点 URI。"
        },
        {
          "question": "把 /api/getAllPostComments/:postid 改写成 REST 惯例的形态，并说明依据。",
          "answer": "改成 GET /posts/:postid/comments。依据是 REST 的资源导向命名：URI 直接指资源（posts、comments 这些名词），不用 getAllPostComments 这类动词名——动作由 HTTP 动词表达（GET=读）；每资源两个 URI（集合与单个）且可嵌套：/posts/:postid/comments 是该文章的评论集合，要单条评论再嵌一层 /posts/:postid/comments/:commentid。"
        },
        {
          "question": "为什么下一个项目必须在服务器上启用 CORS？开发期和生产期的配置口径有什么不同？",
          "answer": "因为项目会把 REST API 与前端分开部署在不同域名——浏览器的同源策略限制网页向「提供该页面的源」之外的源发请求，前端调 API 会被拦；服务器启用 CORS（Express 官方中间件包）放行前端即可。官方口径：现阶段（开发）允许任何源访问可以接受——让开发容易得多；但真实项目部署到生产环境后，多半要专门屏蔽除自己前端网站之外任何源的访问。"
        },
        {
          "question": "官方 HTTP 动词表里四个动词分别对应什么动作？各举一个官方例子。",
          "answer": "POST=Create（POST /posts 创建新博文）、GET=Read（GET /posts/:postid 取单篇文章）、PUT=Update（PUT /posts/:postid 更新单篇）、DELETE=Delete（DELETE /posts/:postid 删除单篇）——与 CRUD 一一对应。URI 的每个部分都指定资源：GET /posts 是整个列表，加 :postid 是确切一篇，再嵌 /comments 是它的评论。"
        }
      ],
      "optional": [],
      "note": "本课是 World 7 的架构转折课：从「Express 渲染 EJS 模板」的单体模式转向「后端只出 JSON、前端独立部署」的分离模式。技术上只有一行 res.json() 的分量，但 REST 命名惯例与 CORS 是 Blog API 项目的直接前置——那门项目会把 API 与两个前端分开部署到不同域名。",
      "why": "你写过的前六个项目全是「一个 Express 应用包办一切」——路由渲染模板、模板嵌在同一个仓库。真实行业的现代形态是前后端分离：后端是一套 API，前端可以是网站、桌面应用、手机应用各一套。这课教你 API 一侧的两件事：说 JSON（res.json 一行的事）与说得有条理（REST 命名+动词表+嵌套 URI）；外加浏览器安全模型给你上的一道必修课——CORS。学完它，下一课的安全令牌与 Blog API 项目的「一后端两前端」都有了地基。",
      "sections": [
        {
          "h": "前后端分离与 Jamstack",
          "p": [
            "近年来流行的新模式：不再做一个同时托管数据库与视图模板的应用，而是拆成独立项目——后端与数据库托管在服务器（Heroku 这类 PaaS 或 DigitalOcean 这类 VPS），前端用 GitHub Pages 或 Netlify 这类服务托管；这种技术有时被称为 Jamstack。",
            "好处三条：更模块化（业务逻辑不与视图逻辑混在一起）；一个后端源服务多个前端应用（网站、桌面、移动）；前端可自由用 React/Vue 做纯前端单页应用。",
            "前后端通常用 JSON 对话——前端 JavaScript 课程已经见过；所以此刻要学的只是让 Express 说 JSON 而不是 HTML。"
          ]
        },
        {
          "h": "res.json()：全部技术含量",
          "p": [
            "课末 Assignment 会带你过教程，但本质上你要做的全部：把信息传给 res.json() 而不是 res.send() 或 res.render()——官方原话「就这么简单」。",
            "官方回指 Routes 课的组织法：相关路由归组、每组抽成独立文件——更容易修改特定路由而不影响其他。"
          ]
        },
        {
          "h": "REST：资源导向的端点组织",
          "p": [
            "API 结构可以有很多形态（/api/getAllPostComments/:postid 或 /api/posts/:postid/comments），然而惯例是遵循 REST（Representational State Transfer）——与 CRUD 动作对应的流行组织方法。",
            "遵循既定模式让 API 更可维护、让其他开发者更容易集成——「软件开发常常关乎清晰沟通，遵循预期有助于沟通」。",
            "REST 的实际技术定义有点复杂，但大部分要素（无状态、可缓存性等）用 Express 输出 JSON 时默认覆盖；我们特别要想的是如何组织端点 URI（Uniform Resource Identifier）。",
            "资源导向：不用 /getPostComments 或 /savePostInDatabase 这类动词名，直接指向资源（博客文章），用 HTTP 动词决定动作。典型形态：每资源两个 URI——集合（/posts）与单个对象（/posts/:postid）；集合可嵌套（/posts/:postid/comments、/posts/:postid/comments/:commentid）。"
          ]
        },
        {
          "h": "HTTP 动词表",
          "p": [
            "官方表格：POST=Create（POST /posts 创建新博文）、GET=Read（GET /posts/:postid 取单篇）、PUT=Update（更新单篇）、DELETE=Delete（删除单篇）。",
            "URI 的每个部分都指定资源：GET /posts 返回整个列表；GET /posts/:postid 指定确切一篇；继续嵌套 GET /posts/:postid/comments 返回该文章的评论列表，甚至定位单条评论。"
          ],
          "list": [
            "POST → Create（创建）",
            "GET → Read（读取）",
            "PUT → Update（更新）",
            "DELETE → Delete（删除）"
          ]
        },
        {
          "h": "同源策略与 CORS",
          "p": [
            "Same Origin Policy 是浏览器的重要安全措施：限制网页向「提供该页面的源」之外的不同源发请求（什么算同源看 MDN 链接的例子）。",
            "下一个项目会把 REST API 与前端分开部署（不同域名）——需要在服务器上启用跨源资源共享（CORS）允许独立前端访问其资源；Express 有 CORS 中间件包帮你配置。",
            "官方口径：现阶段允许任何源访问可以接受——让开发容易得多；但真实项目部署到生产环境后，多半要专门屏蔽除你的前端网站之外任何源的访问——文档解释了怎么做。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "URI 里带动词",
          "text": "/getAllPostComments、/savePostInDatabase 是 REST 官方点名的反例：动作已经由 HTTP 动词（GET/POST/PUT/DELETE）表达，URI 只负责指资源。动词进 URI 会让端点数量爆炸（每种动作一个路由），也让集成你 API 的人无法凭惯例猜端点——「遵循预期」正是 REST 的价值本体。"
        },
        {
          "title": "生产环境 CORS 全放开",
          "text": "官方给了明确的分阶段口径：开发期允许任何源（cors() 默认）让迭代快；生产环境要专门屏蔽除自己前端之外的一切源——API 部署在公网后，全放开的 CORS 等于允许任何网站的前端代码带着用户凭据调你的接口。部署前把 origin 白名单配上。"
        },
        {
          "title": "照着旧教程装 body-parser",
          "text": "Assignment 第一条的 stackoverflow.blog 文（2020）里用 body-parser 解析 JSON 请求体——官方特意批注：自 Express 4.16.0 起该功能已直接并入 Express 包本身（express.json() / express.urlencoded()）。跟敲时别再多装一个已过时的依赖。"
        }
      ],
      "official": {
        "assignment": [
          "阅读 RESTful API design 最佳实践（stackoverflow.blog）；官方批注：文中用 body-parser 解析请求体 JSON，但自 Express 4.16.0 起该功能已并入 Express 包本身",
          "阅读并跟敲「在 Express 里搭建 REST API」教程（robinwieruch.de/node-express-server-rest-api/）——官方评价：最佳 Express 教程之一，含模块化代码组织、编写中间件与补充信息链接"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "REST 的简单英文版 Wikipedia 条目——基于示例的定义"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/apis/api_basics.md（本站自行编写简体讲解与任务拆解，未改编自任何第三方中文课程）",
        "sha256": "6e6f6525fe1993378fae19e1126870ceeb46cc60fc43b8ea5c386c43fc0b510b",
        "verifiedAt": "2026-09-29"
      }
    },
    {
      "id": "nodejs-api-security",
      "title": "API Security",
      "zh": "API 安全",
      "group": 4,
      "url": "https://www.theodinproject.com/lessons/nodejs-api-security",
      "summary": "「API」章的第二课（官方原文约 3.2KB，全站较短的知识课之一）：前后端分离之后，认证策略要跟着换——从会话 cookie 转向安全令牌（token），主角是 JSON Web Token（JWT）。三块主干：① 保护 API 是重要一步——用 Express 渲染视图模板时我们用 PassportJS + 用户名密码认证用户，但那不是保护 Express 应用的唯一方式；在 API 语境下用不同策略往往更合理。之前学的用户名+密码会话模式当然仍然可用，只是前后端代码分离让它变得有点复杂化。② 令牌策略——另一种策略是在后端与前端代码之间生成并传递一个安全 token：这样能确保用户的用户名密码不被泄露（compromised），还让我们能让用户的会话过期（expire）以增强安全。基本思路：用户登录（signs in）时创建一个安全令牌，之后所有请求都把该令牌放进请求对象（request object）的**头部（header）**传递。官方安抚：这个过程最终是直截了当的（straightforward），因为你应该已经熟练使用 passport 认证用户了。③ 与会话模式的对照——这个策略对 API 特别有用，但传统视图模板项目也能用；主要区别是：不再设置与检查 cookie，而是在请求头里传一个特殊令牌。之前的认证教程里，Passport 中间件检查发来的 cookie，然后认证或拒绝用户；这里要做的事非常相似——只是不用 cookie，改传令牌。课程概览（官方 Lesson overview 七条）：解释令牌认证与基于会话的认证有何不同；了解 JSON Web Tokens；阅读 authorization header 及其用法；识别并解释用于签名（sign）与验证（verify）令牌的方法；编写自定义中间件在给定路由上验证令牌；熟悉 JWT 的令牌过期（token expiration）；扩展 PassportJS 实现以使用 JSON Web Tokens。Assignment 两条（都是视频）：① 这个视频是极好的资源，讲清关于创建与验证 JSON Web Tokens 你需要知道的一切（YouTube 7nafaH9SddU）。② 这个视频展示 JWT 能派上用场的不同方式（YouTube 7Q17ubqLfaM）。Additional resources 三条（选读）：JWT Authentication Using Node.js and Express 实践指南（laptrinhx 文，官方给的是 web.archive 存档链接——原站已不可达）；在 Express 里用 JWT 的更精炼指南（medium @paul.allies 的 stateless auth with express + passport + jwt 文）；不是所有人都同意 JWT 是存储认证数据的最佳方式——这个视频是反方论证之一，以及你可能遇到的坑（YouTube JdGOb7AxUo0）。",
      "guide": "以下是官方原课的中文化梳理。**开场**：**保护你的 API 是重要一步**。用 Express 渲染视图模板时，我们用 **PassportJS + 用户名和密码**认证用户——但那**不是保护 Express 应用的唯一方式**；在 **API 语境**下，用**不同策略**往往更合理（often makes sense）。之前学的**用户名+密码会话模式**当然**仍然可用**——只是被一个事实搞得**有点复杂化**：我们把前端代码与后端代码**分离**了。**① 令牌策略**：另一种策略是在后端与前端代码之间**生成并传递一个安全 token（令牌）**。这样做能确保用户的**用户名和密码不被泄露**（not compromised），还给我们**让用户会话过期**的能力以增强安全（added security）。**基本思路**：用户**登录（signs in）时创建一个安全令牌**；之后**所有请求**都把该令牌放进**请求对象（request object）的头部（header）**传递。官方安抚：这个过程最终是**直截了当的**（straightforward）——因为你应该已经**熟练使用 passport** 认证用户了。**② 与会话模式的对照**：这个策略**对 API 特别有用**，但**传统视图模板项目也能用**。主要区别：不再**设置与检查 cookie**，而是**在请求头里传一个特殊令牌**。回想之前的认证教程：**Passport 中间件检查发来的 cookie**，然后**认证或拒绝**用户；这里要做的事**非常相似**——只是**不用 cookie，改传令牌**。**③ 课程概览**（官方 Lesson overview 七条，即本课要达成的能力清单）：解释**令牌认证与基于会话的认证有何不同**；了解 **JSON Web Tokens**；阅读 **authorization header** 及其用法；识别并解释用于**签名（sign）与验证（verify）令牌**的方法；编写**自定义中间件**在给定路由上**验证令牌**；熟悉 JWT 的**令牌过期（token expiration）**；**扩展 PassportJS 实现**以使用 JSON Web Tokens。（注：这七条能力的具体实操官方没有写进课文正文，而是交给 Assignment 的两个视频与下一课 Blog API 项目落地。）**Assignment（两条，都是视频）**：**①** 这个视频是**极好的资源**——讲清关于**创建与验证 JSON Web Tokens** 你需要知道的一切。**②** 这个视频展示 **JWT 能派上用场的不同方式**（different ways in which JWTs can be useful）。**Additional resources（选读，非必需）**：一篇 **JWT Authentication Using Node.js and Express 实践指南**（laptrinhx；官方给的是 **web.archive 存档链接**——原站已不在）；一篇**在 Express 里用 JWT 的更精炼（more concise）指南**（Medium，paul.allies 的 stateless auth with express + passport + jwt）；**反方视角**——「不是所有人都同意 JWT 是存储认证数据的最佳方式」：这个视频是**反对使用它们的论证之一**，以及你可能遇到的一些**坑（pitfalls）**。",
      "understand": [
        "能对比会话认证与令牌认证的载体差异：会话模式靠 connect.sid cookie（服务器存会话数据），令牌模式靠请求头里传的 token（前后端分离时 cookie 跨域复杂化）——Passport 检查载体后认证或拒绝的流程两者非常相似",
        "能复述令牌策略的基本思路与两个安全收益：登录时创建安全令牌、之后所有请求放进请求头传递；收益一——用户名密码不再随每个请求暴露（不被泄露），收益二——可以让令牌过期以增强安全",
        "能说出 JWT 的配套概念四件：authorization header（令牌的家）、sign/verify（签名与验证方法）、自定义验证中间件、token expiration——这七条官方能力清单在 Blog API 项目全部落地",
        "能保持技术判断的开放性：官方 Additional resources 特意放了反方视频——「不是所有人都同意 JWT 是存储认证数据的最佳方式」，选型时知道有争论与坑"
      ],
      "terms": [
        {
          "en": "token（令牌）",
          "zh": "登录时生成的安全凭据——之后每个请求把它放进请求头传递；替代 cookie 承担「证明你是谁」的职责，且可过期"
        },
        {
          "en": "JWT (JSON Web Token)",
          "zh": "JSON 网络令牌——本课与 Blog API 项目使用的令牌格式；由签名保证不可篡改，创建与验证是官方 Assignment 视频的主题"
        },
        {
          "en": "authorization header",
          "zh": "请求头里放令牌的字段——Blog API 项目按官方指定用 Bearer schema（Authorization: Bearer <token>）"
        },
        {
          "en": "sign / verify（签名/验证）",
          "zh": "JWT 的两个核心动作：服务器用密钥签名生成令牌；收到请求时验证签名确认令牌未被篡改、确实是自己签发的"
        },
        {
          "en": "token expiration（令牌过期）",
          "zh": "令牌的安全阀：给会话加上寿命，过期即失效——官方点名的令牌策略两大收益之一"
        }
      ],
      "tasks": [
        "看这个视频——官方评价「极好的资源」：讲清关于创建与验证 JSON Web Tokens 你需要知道的一切",
        "看这个视频：展示 JWT 能派上用场的不同方式（different ways in which JWTs can be useful）"
      ],
      "quiz": [
        {
          "question": "前后端分离后，为什么之前的「用户名+密码+会话 cookie」模式变得复杂化？令牌策略怎么解决？",
          "answer": "会话模式依赖 cookie：浏览器自动携带、服务器检查 connect.sid 还原用户。前后端分离部署在不同域名后，跨站 cookie 有一堆额外细节要处理（官方在 Blog API 课明说 cross-site cookies 可能是真正的头疼事）。令牌策略改为：登录时服务器生成一个安全令牌交给前端，前端把它放进之后每个请求的 header 里——不依赖 cookie 的自动机制，跨域场景干净得多；Passport 的工作流程非常相似，只是检查的载体从 cookie 换成了令牌。"
        },
        {
          "question": "官方给的令牌策略两个安全收益是什么？",
          "answer": "① 用户的用户名和密码不会被泄露（compromised）——登录一次换回令牌，之后请求只带令牌，凭据不再反复传输；② 能让用户的会话过期（expire）以增强安全——令牌有寿命，泄露的影响被时间窗限制住。这两点官方在课文开头就点明，是「API 语境下换策略往往更合理」的理由。"
        },
        {
          "question": "本课的七条官方能力清单（Lesson overview）里，除了「了解 JWT」还有哪些？它们在哪落地？",
          "answer": "七条：解释令牌认证与会话认证的不同；了解 JSON Web Tokens；阅读 authorization header 及其用法；识别并解释签名（sign）与验证（verify）令牌的方法；编写自定义中间件在给定路由上验证令牌；熟悉 JWT 的令牌过期；扩展 PassportJS 实现以使用 JWT。课文正文只讲概念对照，具体实操交给 Assignment 的两个视频（创建/验证 JWT + JWT 的各种用途）与下一课 Blog API 项目（官方指定：用 JWT、Bearer header、localStorage 存令牌）。"
        },
        {
          "question": "官方为什么在 Additional resources 里放一个「反对 JWT」的视频？",
          "answer": "官方原话：「不是所有人都同意 JWT 是存储认证数据的最佳方式」——这个视频是反方论证之一，讲你可能遇到的坑。这是 TOP 一贯的选型教育：JWT 是课程与 Blog API 项目的指定方案，但它不是无可争议的唯一正确答案；知道争论存在，将来在真实项目里做认证选型时才不会把它当银弹。"
        }
      ],
      "optional": [],
      "note": "全站较短的知识课之一（官方原文约 3.2KB、无代码块）：正文只建立「会话 cookie → 请求头令牌」的概念对照，七条能力清单的实操全部委托给两个 Assignment 视频与 Blog API 项目。官方给的 laptrinhx 指南链接是 web.archive 存档形态（原站已不可达）——资料区按存档口径登记。",
      "why": "上一课把前后端拆开了，这一课立刻面对拆开后的第一个真问题：cookie 会话在跨域 API 场景变得笨重，行业的主流答案之一是令牌。这课本身很薄（概念对照+两个视频），但它是 Blog API 项目的安全设计说明书——那门项目官方明令用 JWT、Bearer header、localStorage，全部概念在这里建立。看过反方视频再去选型，你就有了超出教程的判断力。",
      "sections": [
        {
          "h": "为什么要换策略：API 语境下的会话模式",
          "p": [
            "保护你的 API 是重要一步。用 Express 渲染视图模板时我们用 PassportJS + 用户名密码认证用户——但那不是保护 Express 应用的唯一方式；在 API 语境下用不同策略往往更合理。",
            "之前的用户名+密码会话模式当然仍然可用——只是被一个事实搞得有点复杂化：我们把前端代码与后端代码分离了（cookie 跨域的细节在 Blog API 课被官方点名为「真正的头疼事」）。"
          ]
        },
        {
          "h": "令牌策略：生成、传递、过期",
          "p": [
            "另一种策略：在后端与前端代码之间生成并传递一个安全 token。两个收益官方明说——确保用户的用户名和密码不被泄露；给会话加上过期能力以增强安全。",
            "基本思路：用户登录时创建一个安全令牌；之后所有请求都把该令牌放进请求对象的头部（header）传递。",
            "官方安抚：这个过程最终是直截了当的——因为你应该已经熟练使用 passport 认证用户了。"
          ]
        },
        {
          "h": "与会话模式的对照：换载体不换流程",
          "p": [
            "这个策略对 API 特别有用，但传统视图模板项目也能用；主要区别：不再设置与检查 cookie，而是在请求头里传一个特殊令牌。",
            "之前的认证教程里，Passport 中间件检查发来的 cookie，然后认证或拒绝用户；这里要做的事非常相似——只是不用 cookie，改传令牌。",
            "官方能力清单七条（Lesson overview）：令牌 vs 会话认证的差异 / 了解 JWT / authorization header 及其用法 / 签名与验证令牌的方法 / 编写自定义验证中间件 / JWT 的令牌过期 / 扩展 PassportJS 使用 JWT——实操交给两个视频与 Blog API 项目。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "把 JWT 当银弹",
          "text": "官方在选读区特意放了反方视频：「不是所有人都同意 JWT 是存储认证数据的最佳方式」。课程与 Blog API 指定用 JWT 是教学选型；真实项目里 cookie 会话、access/refresh 双令牌等方案各有适用场景——知道争论存在，才谈得上选型。"
        },
        {
          "title": "令牌放错地方",
          "text": "官方口径是放进请求对象的头部（header）——Blog API 项目进一步指定 Authorization 头 + Bearer schema。把令牌拼进 URL 查询串会进服务器日志与浏览器历史；官方也提醒 localStorage 等存法各有取舍（部署后 cross-site cookie 是另一堆细节）——按项目课指定做，先跑通再深究。"
        },
        {
          "title": "以为这课看完就会写 JWT",
          "text": "本课正文只有概念对照（约 3.2KB、无代码）：七条能力清单的实操全部在两个 Assignment 视频里（创建/验证 JWT、JWT 的用途）。跳过视频直接做 Blog API，会在「jsonwebtoken 签发、passport-jwt 验证」那一步卡住——视频就是本课的正文延伸。"
        }
      ],
      "official": {
        "assignment": [
          "看视频：创建与验证 JSON Web Tokens——官方评价「极好的资源，讲清你需要知道的一切」",
          "看视频：JWT 能派上用场的不同方式（different ways in which JWTs can be useful）"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "JWT Authentication Using Node.js and Express 实践指南（laptrinhx，web.archive 存档链接）",
          "在 Express 里用 JWT 的更精炼指南（Medium，paul.allies：stateless auth）",
          "反方视频：不是所有人都同意 JWT 是存储认证数据的最佳方式——反对论证与可能的坑"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/apis/api_security.md（本站自行编写简体讲解与任务拆解，未改编自任何第三方中文课程）",
        "sha256": "a65c3b00f296c66ca682eca10fe35e570ae32d696a41fd9a553d6f260f5911f5",
        "verifiedAt": "2026-09-29"
      }
    },
    {
      "id": "node-path-nodejs-blog-api",
      "title": "Project: Blog API",
      "zh": "项目：博客 API",
      "group": 4,
      "url": "https://www.theodinproject.com/lessons/node-path-nodejs-blog-api",
      "summary": "「API」章的实战项目（全站第 30 门 Project 课）：建一个只有 API 的后端 + 两个不同的前端——一个前端给想阅读和评论你文章的人（消费站），另一个只给你自己写、编辑、发布文章（作者站）。官方定位：练习并亲眼看到「API only 后端」的好处；为什么这么搭？「Because we can!」——重要的练习是搭好 API 然后从外部访问它；把博客消费与博客编辑分成独立网站有一些安全好处，但真正原因是演示前后端代码分离的威力与灵活性。Assignment 九条：① 项目结构由你定：有人偏好三个应用各用独立 GitHub 仓库（保持提交历史分离），有人偏好 monorepo（三个应用各占同一仓库里的一个目录）。② 从设计后端模型与 schema 开始，怎么设计由你，但官方给了六个思考点：博客应有 posts 与 comments——想想各自要哪些字段；评论要不要要求用户留用户名或邮箱；posts 与 comments 要不要显示日期或时间戳；posts 大概该有标题，comments 呢？；博客的有用特性：文章可以在数据库里但不对公众发布（published vs unpublished——怎么在 DB 里标记？）；你需要一个 user 模型容纳博客作者与普通用户账号——即使你决定只有一个作者、没有普通用户账号，一个最小 user 模型仍然有用：让基于认证的路由保护更容易。③ 搭 Express 应用、在 Prisma 里定义模型。④ 搭路由与控制器——这个要想想 RESTful 组织；上一课的例子大多围绕 posts 与 comments，所以应该不太难。测试路由随你便：终端 curl 是一种方便的方式，用网页浏览器也同样有效；有些平台可以不搭不填 HTML 表单就发 PUT 和 POST 请求——Postman 大概是最流行的。⑤ 某些路由需要认证保护——「你可不会想让网上随便哪个陌生人编辑你的文章！」如果还实现了普通用户账号，可能还想把一些路由保护在登录之后。官方指定：认证方式很多，但本项目用 JWT；可以用 jsonwebtoken（auth0/node-jsonwebtoken）创建与验证 JWT；可能想用 Passport 的 JWT 策略（mikenicholson/passport-jwt）验证 JWT——特别是已经用 local strategy 处理登录的情况下。成功的登录授予用户一个 JWT；用户可以把 JWT 附到之后任何请求上，API 验证 JWT 以允许或拒绝对受保护路由其余部分的访问；用户登出时，可以让客户端从存储中移除 JWT。发送与存储 JWT 的方式很多：cookie、localStorage、access/refresh 令牌等——有些更复杂（实现得当的话可能更安全），特别是两端都部署之后；例如不了解某些额外细节的话，跨站 cookie 可能是真正的头疼事（real headache）。将来可以探索这些替代方案；现在保持简单：JWT 用带 \"Bearer\" schema 的 \"Authorization\" 头发送，客户端把 JWT 存 localStorage。⑥ API 跑通后聚焦前端代码——怎么做完全由你：熟悉 React 就用 React！更乐意用纯 HTML/CSS/vanilla JS 也完全可以；把 posts 弄进网站要做的全部就是 fetch 正确的 API 端点然后显示结果——前端视角的 fetch 与 API 用法在 Working with APIs 课讲过（TOP 自有课页）。⑦ 为撰写与编辑文章创建第二个网站——怎么搭随你，官方给了可能有用的功能清单：显示全部 posts 的列表（标明已发布与否）；发布未发布文章/取消发布已发布文章的按钮；NEW POST 表单——想讲究可以用 TinyMCE 这类富文本编辑器；管理评论的能力（删除或编辑）。⑧ 前端想投入多少由你——技术上这是后端聚焦的课程，愿意的话尽管聚焦 REST API。⑨ 部署分离的应用没什么花头：API 照之前项目的方式部署到 PaaS（部署课），前端照你之前部署前端的方式部署；用了 React 的话，回忆 CV Application 项目里的几个托管选项（TOP 自有课页）。本课官方无 Extra credit、无 Additional resources。",
      "guide": "以下是官方项目要求的中文化梳理。**红线**：本站不提供成品代码——模型设计、路由组织、JWT 流程、两个前端全部自己做。**项目一句话**：一个**只有 API 的后端** + **两个前端**——**消费站**给想阅读和评论你文章的人，**作者站**只给你自己写、编辑、发布文章。**为什么这么搭？**官方原话：「**Because we can!**」——重要的练习是**搭好 API 然后从外部访问它**；把博客消费与博客编辑分成独立网站有**一些安全好处**，但真正原因是**演示前后端代码分离的威力与灵活性**。**第 1 步：仓库结构自己定**：有人偏好**三个应用各用独立 GitHub 仓库**（保持它们与提交历史分离）；有人偏好 **monorepo**（每个应用占同一仓库里的一个目录）。**第 2 步：设计后端模型与 schema**——怎么设计由你，但官方给了**六个思考点**：博客应有 **posts 与 comments**——想想各自要哪些字段；**评论要不要要求留用户名或邮箱**；posts 与 comments 要不要显示**日期或时间戳**；posts 大概该有**标题**——comments 呢？；博客的有用特性：文章可以**在库里但不对公众发布**——**怎么在 DB 里标记 published vs unpublished**；你需要一个 **user 模型**容纳博客作者与普通用户账号——**即使只有一个作者、没有普通账号，最小 user 模型仍然有用**：让**基于认证的路由保护**更容易。**第 3 步**：搭 Express 应用，**在 Prisma 里定义模型**（上一章刚学的 schema 建模直接上场）。**第 4 步：路由与控制器**——这个要**想想 RESTful 组织**；上一课的例子大多围绕 posts 与 comments，所以应该不太难。**测试路由随你便**：终端 **curl** 是方便的一种，**网页浏览器**也同样有效；有些平台可以**不搭不填 HTML 表单就发 PUT 和 POST 请求**——**Postman** 大概是最流行的。**第 5 步：认证保护（本项目最大难点，官方写得最细）**：某些路由需要认证保护——「**你可不会想让网上随便哪个陌生人编辑你的文章！**」如果还实现了普通用户账号，可能还想把一些路由保护在登录之后。**官方指定**：认证方式很多，**本项目用 JWT**。**工具**：可以用 **jsonwebtoken**（auth0/node-jsonwebtoken）**创建与验证 JWT**；可能想用 **Passport 的 JWT 策略**（mikenicholson/passport-jwt）**验证 JWT**——特别是你已经用 local strategy 处理登录的情况下（两套策略并存：local 管登录、jwt 管受保护路由）。**流程**：成功的登录**授予用户一个 JWT**；用户把 JWT **附到之后任何请求**上；API **验证 JWT** 以**允许或拒绝**对受保护路由其余部分的访问；用户**登出**时，可以让**客户端从存储中移除 JWT**。**存储与发送的取舍**（官方长注）：方式很多——**cookie、localStorage、access/refresh 令牌**等；有些更复杂（实现得当可能更安全），特别是**两端都部署之后**——例如不了解某些额外细节的话，**跨站 cookie 可能是真正的头疼事**（real headache）。将来可以探索这些替代方案；**现在保持简单**：JWT 用带 **\"Bearer\" schema 的 \"Authorization\" 头**发送，客户端把 JWT 存 **localStorage**。**第 6 步：消费站前端**——API 跑通后聚焦前端；**怎么做完全由你**：熟悉 **React** 就用 React；更乐意用**纯 HTML/CSS/vanilla JS** 也完全可以。把 posts 弄进网站要做的全部：**fetch 正确的 API 端点，然后显示结果**——前端视角的 fetch 与 API 用法在 **Working with APIs 课**讲过（TOP 自有课页，World 3）。**第 7 步：作者站前端**——为撰写与编辑文章创建**第二个网站**；怎么搭随你，官方给了可能有用的功能清单：**显示全部 posts 的列表**（标明已发布与否）；**发布/取消发布按钮**；**NEW POST 表单**——想讲究可以用 **TinyMCE** 这类富文本编辑器；**管理评论**的能力（删除或编辑）。**第 8 步：投入程度自己定**——前端想投入多少由你；**技术上这是后端聚焦的课程**，愿意的话尽管聚焦 REST API。**第 9 步：部署**——分离应用的部署**没什么花头**（isn't anything fancy）：**API** 照之前项目的方式部署到 **PaaS**（部署课）；**前端**照你之前部署前端的方式部署；用了 React 的话，回忆 **CV Application 项目**里的几个托管选项（TOP 自有课页，World 5）。**官方无 Extra credit、无 Additional resources。**",
      "understand": [
        "能说出「一后端两前端」架构的官方理由：练习搭好 API 再从外部访问；消费与编辑分站有安全好处；核心是演示前后端分离的威力与灵活性——三端可独立部署、独立演进",
        "能完成官方六问的模型设计：posts/comments 字段取舍、评论者身份、时间戳、评论要不要标题、published 标记的实现、最小 user 模型对路由保护的价值——设计决定全部自己拍板并能说出理由",
        "能画出 JWT 认证全流程：登录（local strategy）成功签发 JWT → 客户端存 localStorage → 之后请求带 Authorization: Bearer <token> 头 → API 用 passport-jwt/jsonwebtoken 验证以放行或拒绝受保护路由 → 登出时客户端移除 JWT",
        "能解释官方「现在保持简单」的边界：cookie/localStorage/access-refresh 各有安全取舍，跨站 cookie 部署后是真正的头疼事——本项目指定 Bearer 头 + localStorage，替代方案留待将来探索",
        "能用任意前端技术栈消费 API：fetch 正确端点、显示结果（消费站）；列表+发布开关+NEW POST 表单+评论管理（作者站）——React 或 vanilla JS 都是官方认可的路线"
      ],
      "terms": [
        {
          "en": "API only backend",
          "zh": "只输出 JSON 的后端——不渲染任何模板；本项目的主角形态，两个前端都从外部访问它"
        },
        {
          "en": "monorepo",
          "zh": "单仓库多应用的结构选项（三端各占一个目录）——与「三个独立仓库」二选一，官方都认可"
        },
        {
          "en": "jsonwebtoken / passport-jwt",
          "zh": "官方指定的 JWT 工具链：auth0/node-jsonwebtoken 创建与验证令牌；mikenicholson/passport-jwt 是 Passport 的 JWT 验证策略——与处理登录的 local strategy 并存"
        },
        {
          "en": "Bearer schema",
          "zh": "Authorization 头的令牌格式：Authorization: Bearer <JWT>——官方指定的发送方式（配 localStorage 存储）"
        },
        {
          "en": "published vs unpublished",
          "zh": "博客的核心状态设计：文章在库里但不对公众发布——怎么在 DB 里标记是官方六问之一"
        },
        {
          "en": "Postman",
          "zh": "不搭不填 HTML 表单就能发 PUT/POST 请求的测试平台——官方点名「大概是最流行的」；curl 与浏览器也是认可的方式"
        }
      ],
      "tasks": [
        "项目结构由你定：有人偏好三个应用各用独立 GitHub 仓库（保持提交历史分离），有人偏好 monorepo（每个应用占同一仓库里的一个目录）",
        "从设计后端模型与 schema 开始——怎么设计由你，但想想官方六问：posts 与 comments 各自要哪些字段；评论要不要要求用户名或邮箱；要不要显示日期或时间戳；posts 该有标题、comments 呢；怎么在 DB 里标记 published vs unpublished；建一个最小 user 模型容纳作者与普通账号（即使只有单作者，它也让基于认证的路由保护更容易）",
        "搭 Express 应用，在 Prisma 里定义模型",
        "搭路由与控制器——想想 RESTful 组织（上一课的例子大多围绕 posts 与 comments，应该不太难）；测试路由随你便：终端 curl、网页浏览器都有效，也可以用 Postman 这类平台不搭表单直接发 PUT/POST",
        "给需要认证的路由加保护（「你可不会想让网上随便哪个陌生人编辑你的文章」）：本项目官方指定用 JWT——jsonwebtoken 创建与验证、可配 passport-jwt 策略；登录成功授予 JWT，客户端附到之后请求上，API 验证以放行或拒绝；登出时客户端移除 JWT；发送与存储保持简单：Authorization 头 + Bearer schema，客户端存 localStorage（cookie/access-refresh 等替代方案将来再探索——跨站 cookie 部署后是真正的头疼事）",
        "API 跑通后聚焦消费站前端——技术栈完全由你（React 或纯 HTML/CSS/vanilla JS 都行）；要做的全部是 fetch 正确的 API 端点然后显示结果（前端视角的 fetch 与 API 在 Working with APIs 课讲过）",
        "为撰写与编辑文章创建第二个网站（作者站）——官方建议功能：全部 posts 列表（标明发布状态）、发布/取消发布按钮、NEW POST 表单（想讲究可用 TinyMCE 富文本编辑器）、管理评论（删除或编辑）",
        "前端投入程度自己定——技术上这是后端聚焦的课程，愿意的话尽管聚焦 REST API",
        "部署分离的应用：API 照之前项目的方式部署到 PaaS（部署课）；前端照你之前部署前端的方式；用了 React 可回忆 CV Application 项目的托管选项"
      ],
      "quiz": [
        {
          "question": "为什么官方博客项目要配两个前端？「Because we can!」背后的正式理由是什么？",
          "answer": "官方给了三层：① 重要的练习是搭好 API 然后从外部访问它——两个前端强制你的 API 真正「对外可用」，而不是模板渲染的变体；② 把博客消费与博客编辑分成独立网站有一些安全好处（编辑站可以整体保护起来）；③ 真正的原因是演示前后端代码分离的威力与灵活性——同一个 API 服务两个完全不同的站点，将来服务移动应用也一样。"
        },
        {
          "question": "官方六问里「published vs unpublished」和「最小 user 模型」分别解决什么问题？",
          "answer": "published 标记解决「文章在库里但不对公众发布」——作者站写完先存着、择机发布，DB 里需要一个状态字段（布尔或枚举）区分，消费站 API 只返回已发布的；最小 user 模型解决认证载体——即使你决定只有一个作者、没有普通用户账号，user 模型仍然必要：登录签发 JWT 要有用户可查，受保护路由的验证要挂在用户体系上，「让基于认证的路由保护更容易」。"
        },
        {
          "question": "把官方指定的 JWT 全流程从头到尾说一遍：从登录到访问受保护路由再到登出。",
          "answer": "① 登录：用已有的 local strategy（用户名+密码）验证，成功登录授予用户一个 JWT（jsonwebtoken 签发）；② 存储：客户端把 JWT 存 localStorage；③ 请求：之后任何请求把它附在 Authorization 头里，用 Bearer schema（Authorization: Bearer <token>）；④ 验证：API 用 passport-jwt 策略（或 jsonwebtoken）验证 JWT，以允许或拒绝对受保护路由其余部分的访问；⑤ 登出：客户端从存储中移除 JWT。官方边界：cookie、access/refresh 等替代方案更复杂（可能更安全），跨站 cookie 部署后是真正的头疼事——本项目保持简单，将来再探索。"
        },
        {
          "question": "测试 API 路由官方给了哪几种方式？为什么需要 Postman 这类工具？",
          "answer": "三种官方认可的方式：终端 curl；网页浏览器（对 GET 有效）；Postman 这类平台——官方点名「大概是最流行的」。需要它的原因：浏览器的地址栏只能发 GET，测 PUT/POST/DELETE 得搭 HTML 表单填数据；Postman 让你不搭不填表单就直接构造任意方法与请求体的请求——REST 四种动词的路由都能顺手测。"
        },
        {
          "question": "第 8 步「前端投入程度自己定」的官方原话依据是什么？这暗示了本项目的评分重心在哪？",
          "answer": "官方原话：「技术上这是后端聚焦的课程，所以如果你愿意，尽管聚焦 REST API。」第 6 步也说前端怎么做完全由你、React 或 vanilla 都行、要做的全部就是 fetch 端点显示结果。重心显然在后端：RESTful 路由组织、Prisma 模型设计、JWT 认证保护、三端分离部署——前端只要功能可用（消费站能读能评、作者站能写能发），美观与复杂度不是要求。"
        }
      ],
      "optional": [],
      "note": "Project 红线课：本站不提供成品代码，examples 为空数组——模型六问、RESTful 路由、JWT 流程、两个前端全部自己设计。这是全站第 30 门 Project 课、World 7 第 6 门，也是全站首个「一后端多前端」三端项目。官方在第 5 步给了全书最细的 JWT 规格（Bearer 头 + localStorage + passport-jwt），在第 2 步给了六个模型设计思考题——这两处是本项目的评分重心；前端官方明说「尽管聚焦 REST API」。",
      "why": "API 章两课（说 JSON + 换令牌）在这里合成一次完整落地：res.json 的输出、REST 的 URI 组织、CORS 的跨域放行、JWT 的认证保护，一个项目全用上——而且是全站第一个「后端与前端彻底分家、分开部署」的三端架构。做完它，你手里有一个真正现代形态的作品：任何前端（网页、桌面、移动）都能接的博客 API。这也是「API only 后端」思维的确立点——之后的 Where's Waldo 与 Messaging App 全按这个形态走。",
      "sections": [
        {
          "h": "项目一句话：一个 API，两个前端",
          "p": [
            "建一个只有 API 的后端 + 两个前端：消费站给想阅读和评论你文章的人；作者站只给你自己写、编辑、发布文章。",
            "官方定位：练习并亲眼看到 API only 后端的好处；为什么这么搭？「Because we can!」——重要的练习是搭好 API 然后从外部访问它；分站有一些安全好处，但真正原因是演示前后端分离的威力与灵活性。",
            "仓库结构自己定：三个独立 GitHub 仓库（提交历史分离）或 monorepo（三应用各占一个目录）——官方都认可。"
          ]
        },
        {
          "h": "模型设计六问（第 2 步）",
          "p": [
            "怎么设计由你，但官方给了六个思考点，全部要在 Prisma schema 里落定：",
            "posts 与 comments 各自要哪些字段；评论要不要要求用户名或邮箱；要不要日期或时间戳；posts 该有标题——comments 呢；怎么在 DB 里标记 published vs unpublished（在库里但不公开发布的文章是博客的有用特性）；最小 user 模型——即使只有单作者、无普通账号，它也让基于认证的路由保护更容易。"
          ],
          "list": [
            "posts/comments 字段取舍",
            "评论者身份（用户名/邮箱要不要）",
            "日期或时间戳",
            "comments 要不要标题",
            "published vs unpublished 的 DB 标记",
            "最小 user 模型与路由保护"
          ]
        },
        {
          "h": "RESTful 路由与测试方式（第 3-4 步）",
          "p": [
            "搭 Express 应用、在 Prisma 里定义模型；路由与控制器按 RESTful 组织思考——上一课的例子大多围绕 posts 与 comments，应该不太难。",
            "测试路由随你便：终端 curl 方便；网页浏览器同样有效（GET）；Postman 这类平台可以不搭不填 HTML 表单就发 PUT 和 POST——官方点名「大概是最流行的」。"
          ]
        },
        {
          "h": "JWT 认证保护（第 5 步：官方写得最细的一步）",
          "p": [
            "某些路由需要认证保护——「你可不会想让网上随便哪个陌生人编辑你的文章！」实现了普通用户账号的话，可能还想把一些路由保护在登录之后。",
            "官方指定：本项目用 JWT。工具：jsonwebtoken（auth0/node-jsonwebtoken）创建与验证；Passport 的 JWT 策略（mikenicholson/passport-jwt）验证——与处理登录的 local strategy 并存。",
            "流程：成功登录授予用户一个 JWT → 用户把它附到之后任何请求 → API 验证 JWT 以允许或拒绝受保护路由 → 登出时客户端从存储中移除 JWT。",
            "存储取舍（官方长注）：cookie、localStorage、access/refresh 令牌等方式很多，有些更复杂（实现得当可能更安全），特别是两端都部署之后——跨站 cookie 不了解额外细节的话可能是真正的头疼事。将来可探索替代方案；现在保持简单：Authorization 头 + Bearer schema 发送，客户端存 localStorage。"
          ]
        },
        {
          "h": "两个前端（第 6-8 步）",
          "p": [
            "消费站：API 跑通后聚焦前端——技术栈完全由你（React 或纯 HTML/CSS/vanilla JS）；要做的全部是 fetch 正确的 API 端点然后显示结果（Working with APIs 课讲过前端视角的用法）。",
            "作者站：为撰写与编辑文章创建第二个网站；官方建议功能——全部 posts 列表（标明发布状态）、发布/取消发布按钮、NEW POST 表单（想讲究可用 TinyMCE 富文本编辑器）、管理评论（删除或编辑）。",
            "投入程度自己定：技术上这是后端聚焦的课程，愿意的话尽管聚焦 REST API。"
          ]
        },
        {
          "h": "部署三端（第 9 步）",
          "p": [
            "官方口径：部署分离的应用没什么花头——API 照之前项目的方式部署到 PaaS（部署课）；前端照你之前部署前端的方式部署。",
            "用了 React 的话，回忆 CV Application 项目里的几个托管选项。三端各自上线后，CORS 的生产配置（只放行两个前端的域名）别忘——API 基础课的口径。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "先写前端后定 API",
          "text": "官方的步骤顺序是刻意的：模型六问 → Prisma schema → RESTful 路由 → JWT 保护 → 然后才是前端。API 的形状没定就做前端，等于给移动靶写代码——端点一改两个前端全返工。先用 curl/Postman 把 API 测稳，再开前端工程。"
        },
        {
          "title": "受保护路由只挡前端入口",
          "text": "作者站的「发布按钮」藏在登录后不等于安全：消费站与作者站是公开部署的网页，任何人都能直接对 API 发请求。编辑/删除/发布路由必须在 API 层验证 JWT（passport-jwt 中间件）——「你可不会想让网上随便哪个陌生人编辑你的文章」说的就是后端这道闸。"
        },
        {
          "title": "在令牌方案上过度设计",
          "text": "官方明确划了线：access/refresh 双令牌、httpOnly cookie 等方案更复杂（可能更安全），跨站 cookie 部署后是真正的头疼事——「现在保持简单」：Bearer 头 + localStorage。先把指定方案跑通拿到完整闭环，替代方案留待将来探索；一上来就上双令牌，多半卡在部署后的 cookie 细节里出不来。"
        },
        {
          "title": "消费站把未发布文章也拉出来",
          "text": "模型六问里的 published 标记不是装饰：消费站的列表与详情端点必须过滤 unpublished 文章，否则「在库里但不对公众发布」的设计形同虚设——草稿从公开 API 泄露。过滤做在 API 层（数据库查询条件），不要只靠前端不显示。"
        }
      ],
      "official": {
        "assignment": [
          "项目结构由你定：三个应用各用独立 GitHub 仓库（提交历史分离），或 monorepo（各占一个目录）",
          "设计后端模型与 schema——想想六问：posts/comments 字段；评论要不要用户名或邮箱；日期或时间戳；comments 要不要标题；DB 里怎么标记 published vs unpublished；最小 user 模型（让基于认证的路由保护更容易）",
          "搭 Express 应用，在 Prisma 里定义模型",
          "搭路由与控制器（RESTful 组织）；测试随你便：curl、浏览器，或 Postman 这类不搭表单发 PUT/POST 的平台（大概是最流行的）",
          "认证保护指定路由：本项目用 JWT——jsonwebtoken 创建与验证、passport-jwt 策略验证（与 local strategy 并存）；登录授予 JWT、请求附带头、API 验证放行或拒绝、登出客户端移除；保持简单：Authorization 头 + Bearer schema，客户端存 localStorage（跨站 cookie 部署后是真正的头疼事，替代方案将来探索）",
          "API 跑通后做消费站前端——技术栈由你（React 或纯 HTML/CSS/vanilla JS）；fetch 正确端点、显示结果",
          "创建作者站（第二个网站）：posts 列表（标明发布状态）、发布/取消发布按钮、NEW POST 表单（可用 TinyMCE 富文本编辑器）、管理评论（删除或编辑）",
          "前端投入程度自己定——技术上这是后端聚焦的课程，尽管聚焦 REST API 也可以",
          "部署：API 上 PaaS（部署课），前端照旧方式部署；用 React 可回忆 CV Application 项目的托管选项"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/apis/project_blog_api.md（本站自行编写简体讲解与任务拆解，未改编自任何第三方中文课程；Project 红线：不提供成品答案）",
        "sha256": "df78fc229c72335b2fee1fba616a4254162a3e70fdb8ecdb06951403290de4ef",
        "verifiedAt": "2026-09-29"
      }
    },
    {
      "id": "nodejs-testing-routes-and-controllers",
      "title": "Testing Routes and Controllers",
      "zh": "测试路由与控制器",
      "group": 5,
      "url": "https://www.theodinproject.com/lessons/nodejs-testing-routes-and-controllers",
      "summary": "「测试 Express」章的第一课（官方原文约 7KB）：把 World 3 学过的单元测试技能搬到 Express 应用上——用 supertest 模块测路由与控制器。官方开场定位：单元测试为什么重要「大概不需要现在展开」；如果你上过基础 JavaScript 课程就已经遇到过单元测试；本课的重点不是教写测试的哲学或机制，而是**测试如何应用到我们的 Express 应用与 API 上**；如果还没完成前端 JavaScript 课程（World 3），先回去看那些课再往下走（红色前置）。四大块：① 前提：被测代码必须在导出模块里——这是测试代码里任何东西的最重要、最基本的要求；自定义中间件与路由/控制器都是如此；所以第一件事是把它们分离进独立模块（如果还没分的话）。路由的话你已经会用 Express.Router 做这件事。官方给了两个文件示例：app.js（require express、建 app、挂 urlencoded、require ./index 路由器挂到 /、app.listen(3000)）与 index.js（express.Router()；GET / 返回 res.json({name: \"frodo\"})；GET /test 返回 {array}；POST /test 把 req.body.item push 进 array 后 res.send(\"success!\")；module.exports = index）。官方判断口径：此刻我们**不需要**测 app.js——它只包含启动与运行 express 应用的代码，没有我们自己的逻辑；index.js 则**确实**包含我们想测的东西。② 测试文件的搭建——用 supertest 库（正文链接 visionmedia/supertest——注意 Assignment 里官方给的是 forwardemail/supertest，仓库已迁移组织）配合 Jest 保证测试语法的熟悉度：npm install jest supertest --save-dev，装的间隙花几分钟看 SuperTest Git 仓库的 README。测试文件开头：require 被测模块（../index）；require supertest（作为函数 request）与 express；**新建一个 express app**、挂 urlencoded、把导入的 index 路由器挂上。官方解释为什么要这样搭：我们没有实际触碰原来的 app.js 文件——主要原因是**避免调用 app.listen 启动服务器**；还有个好处：更大的应用里可以**跳过一些可选的配置步骤**、只包含测试所需的部分；在更大的测试套件里，把这部分抽成独立文件、被每个测试文件导入会很有用。③ 第一个测试与 expect 链——test(\"index route works\", done => { request(app).get(\"/\").expect(\"Content-Type\", /json/).expect({ name: \"frodo\" }).expect(200, done); })：导入的 supertest 作为函数 request 使用——在刚建的 express app 上调用、传入路由，然后用它确保响应与我们期望的类型和内容匹配；expect 可以查响应头（Content-Type 匹配 /json/ 正则）、查响应体（对象深比对）、查状态码（200）。④ done 参数与 POST 链式——注意传进 test 回调的 done 参数：多数测试库用它在**异步操作**的场景标记测试完成；SuperTest 允许我们把它**传进最后一个 .expect**，由它替我们调用（Thanks, SuperTest!）。第二个测试与第一个很相似但测 POST 方法：request(app).post(\"/test\").type(\"form\").send({ item: \"hey\" }).then(() => { request(app).get(\"/test\").expect({ array: [\"hey\"] }, done); })——官方口径：SuperTest readme 上有全部可能的函数，你应该（且值得）去读，所以不逐一展开细节；但最后一部分对我们重要：此刻你的 JS 生涯应该已熟悉 Promise，.then() 语法不陌生——这里我们**等 POST 请求完成**，然后在 promise resolve 时**发 GET 请求检查那个 item 是否被 push 进了数组**。⑤ 数据库警告——如果这里用的是真实数据库，我们会想用测试库或 mock 库做类似的事；那会在另一课讲（下一课 Testing Database Operations）；现在只需说：**你绝不会想对生产数据库跑测试代码！**Assignment 两条：① 确保通读 SuperTest 文档（github forwardemail/supertest）。② SuperTest 实际上取材于另一个相关项目 SuperAgent——SuperAgent 里能调用的任何方法在 SuperTest 里也能调用，所以你还需要过一遍 SuperAgent 文档（forwardemail.github.io/superagent/）。本课官方无 Additional resources。",
      "guide": "以下是官方原课的中文化梳理。**开场**：**单元测试（Unit Testing）**为什么重要，原因多到「大概不需要现在展开」；如果你已经上过我们的基础 JavaScript 课程，你就**已经遇到过单元测试**——本课的重点**不是**教写测试的哲学或机制，而是**它们如何应用到我们的 Express 应用与 API 上**。**红色前置**：如果还没完成**前端 JavaScript 课程**（World 3），**先回去看那些课**再往下走。**课程概览**（官方六条）：用 **supertest** 模块测 Express 路由/控制器；描述 SuperTest 如何处理我们的 express 应用；解释 **superagent** 给 SuperTest 提供的功能；描述 **done 参数**的用途；解释并牢固理解 **.expect() 方法**的功能；熟悉 supertest 的文档与方法。**① 前提：导出模块**——测试代码里任何东西的**最重要、最基本的要求**：它必须在一个**导出的模块**里。自定义中间件与路由/控制器**都是如此**——所以第一件事：把它们**分离进独立模块**（如果还没分的话）。路由的话，你已经知道怎么用 **Express.Router** 做这件事。官方示例两个文件：**app.js**——require express、建 app、app.use(express.urlencoded({ extended: false }))、const indexRouter = require(\"./index\") 挂到 \"/\"、app.listen(3000, ...)（带 error 抛出与 \"running\" 日志）；**index.js**——express.Router()；内存数组 const array = []；index.get(\"/\", (req, res) => res.json({ name: \"frodo\" }))；index.get(\"/test\", (req, res) => res.json({ array }))；index.post(\"/test\", (req, res) => { array.push(req.body.item); res.send('success!'); })；module.exports = index。**官方判断口径**：这两个文件定义了几条路由、然后搭建并启动 express 应用；此刻我们***不需要***测 **app.js**——它**只包含启动与运行 express 应用的代码**，不含我们自己的逻辑，所以不用测；**index.js** 则***确实***包含我们想测的东西。**② 测试文件搭建**——为了真正测这些路由，用 **SuperTest** 库；为了测试语法的熟悉度，本课示例把它与 **Jest** 配着用。**npm install jest supertest --save-dev**，装的间隙花几分钟看 SuperTest Git 仓库的 **README**（正文链接是 visionmedia/supertest；Assignment 里官方给的是 forwardemail/supertest——仓库已迁移到 forwardemail 组织，两处链接都记录在资料区）。测试文件：**const index = require(\"../index\"); const request = require(\"supertest\"); const express = require(\"express\"); const app = express(); app.use(express.urlencoded({ extended: false })); app.use(\"/\", index);**——导入被测模块（上面的 index.js）；引入 supertest（作为函数 **request**）与 express；**新建一个 express app**、挂 urlencoded、挂上导入的路由器。**官方解释为什么这样搭**：我们没有实际触碰原来的 app.js——主要原因是**避免调用 app.listen 命令启动服务器**；也有用之处：**更大的应用里可以跳过一些可选配置步骤、只包含测试所需的部分**；在更大的测试套件里，把这段搭建**抽成独立文件**、被每个测试文件导入会很有用。**③ 第一个测试**——**test(\"index route works\", done => { request(app).get(\"/\").expect(\"Content-Type\", /json/).expect({ name: \"frodo\" }).expect(200, done); })**。官方讲解：多亏 SuperTest 库，测试本身相对直截了当；记住我们把 supertest 导入为函数 **request**——在**刚建的 express app** 上调用它、传入我们的路由，然后用它**确保响应与我们期望的类型和内容匹配**（.expect 链：响应头 Content-Type 匹配 /json/ 正则 → 响应体与 { name: \"frodo\" } 深比对 → 状态码 200）。**④ done 参数**——注意传进 test 回调的参数 **done**：多数测试库用它在**异步操作**的场景**标记测试完成**；这里 SuperTest 允许我们把它**传进最后一个 .expect**、由它替我们调用。「Thanks, SuperTest!」**⑤ 第二个测试：POST 与 .then 链**——与第一个很相似，但测 **post 方法**：官方口径：SuperTest readme 上有**全部可能的函数**，你可以（且应该）去读，所以我们不逐一展开每步细节；**但最后一部分对我们重要**：**test(\"testing route works\", done => { request(app).post(\"/test\").type(\"form\").send({ item: \"hey\" }).then(() => { request(app).get(\"/test\").expect({ array: [\"hey\"] }, done); }); })**。此刻你的 JavaScript 生涯应该已熟悉 **Promise**，所以 .then() 语法不陌生——这里我们**等 POST 请求完成**，然后在那个 promise resolve 时**发 GET 请求**，检查 item 是否被 push 进了数组。（.type(\"form\") 声明请求体类型、.send({...}) 携带数据——POST 表单三连。）**⑥ 数据库警告**——如果这里用的是**真实数据库**，我们会想用**测试库或 mock 库**做类似的事；怎么搭会在**另一课**讲（下一课 Testing Database Operations）；现在只需说：**你绝不会想对生产数据库跑测试代码！（you do not want to run test code on your production database!）**。**Assignment（两条）**：**①** 确保**通读 SuperTest 文档**（forwardemail/supertest 仓库）。**②** SuperTest 实际上**取材于（pulls from）另一个相关项目 SuperAgent**——SuperAgent 里能调用的**任何方法**在 SuperTest 里**也能调用**，所以你还需要过一遍 **SuperAgent 文档**。**官方无 Additional resources。**",
      "understand": [
        "能说出测 Express 路由的第一前提与文件分工：被测代码必须在导出模块里——app.js 只管启动（listen）不含业务逻辑、不测；index.js（Express.Router 模块）含我们想测的路由、被测；测试文件里新建一个 app 挂上路由器——避免 app.listen 启动真服务器、还能跳过无关配置",
        "能解读 supertest 的 expect 链三种断言：响应头（.expect(\"Content-Type\", /json/) 正则匹配）、响应体（.expect({name: \"frodo\"}) 深比对）、状态码（.expect(200, done)）——最后一个 expect 收 done",
        "能解释 done 参数的机制：异步测试的完成信号，多数测试库靠它标记「测完了」；SuperTest 让你把它传进最后一个 .expect、由 SuperTest 替你调用——忘了传 done 测试会挂起或假绿",
        "能写 POST→GET 的链式验证：.post(\"/test\").type(\"form\").send({item: \"hey\"}) 发表单数据，.then() 等 promise resolve 后发 GET 验证 item 确实进了数组——「先操作后验证」的集成测试形态",
        "能背出数据库红线与 SuperTest/SuperAgent 的关系：绝不对生产数据库跑测试代码（测试库/mock 库是下一课内容）；SuperTest 取材于 SuperAgent——SuperAgent 的任何方法在 SuperTest 里也能调用，两份文档都要读"
      ],
      "terms": [
        {
          "en": "supertest",
          "zh": "测 HTTP 的库：request(app) 包住 express 应用（不启动服务器）直接发请求断言响应——.get/.post/.expect/.send/.type 全家族；仓库已从 visionmedia 迁移到 forwardemail 组织"
        },
        {
          "en": "SuperAgent",
          "zh": "SuperTest 的底料（pulls from）：SuperAgent 里能调用的任何方法在 SuperTest 里也能调用——官方要求两份文档都过一遍"
        },
        {
          "en": "done",
          "zh": "异步测试的完成信号参数：传进最后一个 .expect 由 SuperTest 替你调用——标记「这个异步测试到此完成」"
        },
        {
          "en": ".expect()",
          "zh": "SuperTest 的断言方法（可链式）：查响应头（正则）、查响应体（深比对）、查状态码——官方要求「牢固理解」的核心 API"
        },
        {
          "en": "导出模块（exported module）",
          "zh": "可测性的第一前提：被测代码必须 module.exports 出来——路由/控制器/自定义中间件都要拆成独立模块，app.js 只留启动逻辑"
        }
      ],
      "tasks": [
        "确保通读 SuperTest 文档（github forwardemail/supertest——正文的 visionmedia 链接是迁移前旧仓库地址）",
        "SuperTest 实际上取材于另一个相关项目 SuperAgent——SuperAgent 里能调用的任何方法在 SuperTest 里也能调用，所以还需要过一遍 SuperAgent 文档（forwardemail.github.io/superagent/）"
      ],
      "quiz": [
        {
          "question": "为什么测试文件里要新建一个 express app 挂上路由器，而不是直接 require 项目的 app.js？",
          "answer": "官方给了两层理由：① 主要原因是避免调用 app.listen 启动服务器——测试不需要真的监听端口，supertest 的 request(app) 能直接对 app 对象发请求；② 更大的应用里可以跳过一些可选的配置步骤、只包含测试所需的部分——搭建一个最小 app（urlencoded + 被测路由器）让测试隔离、快速。官方还建议：更大的测试套件里把这段搭建抽成独立文件被每个测试文件导入。前提判断口径：app.js 只含启动代码不含业务逻辑、不需要测；index.js 路由器含我们想测的东西。"
        },
        {
          "question": "解读第一个测试的每一段：request(app).get(\"/\").expect(\"Content-Type\", /json/).expect({ name: \"frodo\" }).expect(200, done)",
          "answer": "request(app)：supertest 导入为函数 request，包住新建的 express app；.get(\"/\")：对根路由发 GET 请求；.expect(\"Content-Type\", /json/)：断言响应头 Content-Type 匹配 /json/ 正则（确认是 JSON 响应）；.expect({ name: \"frodo\" })：断言响应体与这个对象深比对相等；.expect(200, done)：断言状态码 200，并把 done 传进最后一个 expect——由 SuperTest 在断言完成后替我们调用，标记异步测试结束。"
        },
        {
          "question": "done 参数是干什么的？如果忘了把它传进最后一个 .expect 会怎样？",
          "answer": "done 是多数测试库在异步操作场景的「测试完成」信号：test 回调收到它，异步流程结束时调用它，Jest 才知道这个测试做完了。SuperTest 的便利是允许把它传进最后一个 .expect、由 SuperTest 替我们调用（官方原话 Thanks, SuperTest!）。忘了传的话，测试的异步断言还没跑完 Jest 就可能判它结束——要么挂起超时，要么断言根本没执行完就「通过」，形成假绿。"
        },
        {
          "question": "第二个测试为什么用 .then() 把 GET 包在 POST 之后？这体现了什么测试形态？",
          "answer": "POST /test 把 item push 进数组、GET /test 返回数组——要验证「POST 真的写进去了」，必须等 POST 的 promise resolve 后再发 GET 检查 array 是否含 \"hey\"（官方：等 POST 请求完成，然后在那个 promise resolve 时发 GET 请求）。这是「先操作后验证」的集成测试形态：不 mock 状态、走真实路由与内存数据，用第二个请求验证第一个请求的副作用。.type(\"form\") 声明表单类型、.send({item}) 携带数据。"
        },
        {
          "question": "官方对「用真实数据库跑这些测试」的口径是什么？SuperTest 与 SuperAgent 是什么关系？",
          "answer": "口径斩钉截铁：你绝不会想对生产数据库跑测试代码（you do not want to run test code on your production database!）——真实数据库场景要用测试库或 mock 库，怎么搭是下一课（Testing Database Operations）的内容；本课示例用内存数组正是为了绕开这个问题。SuperTest 取材于（pulls from）SuperAgent：SuperAgent 里能调用的任何方法在 SuperTest 里也能调用——所以 Assignment 要求两份文档都过一遍。"
        }
      ],
      "optional": [],
      "note": "本课把 World 3 的 Jest 测试技能平移到 Express：新东西只有 supertest 一个库与「导出模块才可测」的结构前提。正文的 supertest 链接是 visionmedia/supertest（迁移前地址），Assignment 给的是 forwardemail/supertest（现仓库）——仓库迁移事实两处都如实记录。最后的数据库警告是下一课的直接引子。",
      "why": "你已经在 World 3 给纯函数写过几十个 Jest 测试，但 Express 应用看起来「测不了」：路由挂在 app 上、app 要 listen、请求要走 HTTP。这课拆掉这层畏惧：路由拆成导出模块、测试文件里搭一个不 listen 的迷你 app、supertest 直接对 app 对象发请求断言响应——HTTP 层变成了普通函数调用。这是后端工程化的第一块基石，也是下一课数据库测试的前提。",
      "sections": [
        {
          "h": "定位与前提：导出模块才可测",
          "p": [
            "官方开场：单元测试为什么重要「大概不需要现在展开」；上过基础 JavaScript 课程（World 3）就已遇到过单元测试——本课不教测试哲学或机制，只教它们如何应用到 Express 应用与 API 上；还没完成前端 JavaScript 课程的先回去看。",
            "测试任何东西的最重要、最基本要求：被测代码必须在导出的模块里——自定义中间件与路由/控制器都是如此；第一件事就是把它们分离进独立模块（如果还没分的话）。",
            "官方示例两文件：app.js（建 app、挂 urlencoded、挂 ./index 路由器、app.listen(3000)）与 index.js（Express.Router：GET / 返回 {name: \"frodo\"}；GET /test 返回内存 array；POST /test 把 req.body.item push 进 array）。",
            "官方判断口径：此刻不需要测 app.js——它只包含启动与运行 express 应用的代码、没有我们自己的逻辑；index.js 确实包含我们想测的东西。"
          ]
        },
        {
          "h": "测试文件搭建：不 listen 的迷你 app",
          "p": [
            "用 SuperTest 库测路由，配 Jest 保证测试语法的熟悉度：npm install jest supertest --save-dev；装的间隙看 SuperTest 仓库 README（正文链 visionmedia/supertest，Assignment 链 forwardemail/supertest——仓库已迁移组织）。",
            "搭建：require 被测模块（../index）；require supertest（作为函数 request）与 express；新建 express app、挂 urlencoded、挂上导入的路由器。",
            "官方解释：没有触碰原来的 app.js——主要为了避免调用 app.listen 启动服务器；更大的应用里还能跳过可选配置步骤、只含测试所需部分；大测试套件里应把这段抽成独立文件被每个测试文件导入。"
          ]
        },
        {
          "h": "第一个测试与 expect 链",
          "p": [
            "test(\"index route works\", done => { request(app).get(\"/\").expect(\"Content-Type\", /json/).expect({ name: \"frodo\" }).expect(200, done); })。",
            "官方讲解：多亏 SuperTest，测试本身相对直截了当——把 supertest 导入为函数 request，在刚建的 app 上调用、传入路由，确保响应与期望的类型和内容匹配。",
            "expect 链三种断言：响应头（Content-Type 匹配 /json/ 正则）、响应体（对象深比对）、状态码（200）。"
          ]
        },
        {
          "h": "done 参数：异步完成信号",
          "p": [
            "注意传进 test 回调的 done：多数测试库用它在异步操作的场景标记测试完成。",
            "SuperTest 允许把它传进最后一个 .expect、由它替我们调用——官方原话「Thanks, SuperTest!」。",
            "忘传 done 的后果：异步断言没跑完测试就被判结束——挂起超时或假绿。"
          ]
        },
        {
          "h": "第二个测试：POST 与 .then 链",
          "p": [
            "与第一个很相似但测 POST 方法：request(app).post(\"/test\").type(\"form\").send({ item: \"hey\" }).then(() => { request(app).get(\"/test\").expect({ array: [\"hey\"] }, done); })。",
            "官方口径：SuperTest readme 有全部可能的函数、应该去读，不逐一展开；但最后一部分重要——你已熟悉 Promise，.then() 不陌生：等 POST 请求完成，在 promise resolve 时发 GET 检查 item 是否被 push 进了数组。",
            "「先操作后验证」：不 mock 状态、走真实路由，用第二个请求验证第一个请求的副作用。"
          ]
        },
        {
          "h": "数据库警告：通往下一课",
          "p": [
            "如果用的是真实数据库，会想用测试库或 mock 库做类似的事——怎么搭在另一课讲（下一课 Testing Database Operations）。",
            "现在只需说官方红线：你绝不会想对生产数据库跑测试代码！本课示例用内存数组正是为了绕开这个问题。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "//// index.js\nconst express = require(\"express\");\nconst index = express.Router();\n\nconst array = [];\n\nindex.get(\"/\", (req, res) => {\n  res.json({ name: \"frodo\" });\n});\n\nindex.get(\"/test\", (req, res) => res.json({ array }));\n\nindex.post(\"/test\", (req, res) => {\n  array.push(req.body.item);\n  res.send('success!');\n});\n\nmodule.exports = index;",
          "note": "官方被测模块示例：路由拆进 Express.Router 并 module.exports——「导出模块才可测」的落地形态。GET / 返回 JSON、GET /test 返回内存数组、POST /test 写入数组；app.js 只负责挂载与 listen，不含业务逻辑、不需要测。"
        },
        {
          "lang": "javascript",
          "code": "const index = require(\"../index\");\n\nconst request = require(\"supertest\");\nconst express = require(\"express\");\nconst app = express();\n\napp.use(express.urlencoded({ extended: false }));\napp.use(\"/\", index);\n\ntest(\"index route works\", done => {\n  request(app)\n    .get(\"/\")\n    .expect(\"Content-Type\", /json/)\n    .expect({ name: \"frodo\" })\n    .expect(200, done);\n});",
          "note": "官方测试文件（前半）：新建一个不 listen 的迷你 app 挂上被测路由器——避免启动服务器、跳过无关配置。expect 链三种断言：响应头正则、响应体深比对、状态码；done 传进最后一个 .expect 由 SuperTest 替我们调用。"
        },
        {
          "lang": "javascript",
          "code": "test(\"testing route works\", done => {\n  request(app)\n    .post(\"/test\")\n    .type(\"form\")\n    .send({ item: \"hey\" })\n    .then(() => {\n      request(app)\n        .get(\"/test\")\n        .expect({ array: [\"hey\"] }, done);\n    });\n});",
          "note": "官方测试文件（后半）：POST 三连（.type(\"form\") 声明表单、.send 携带数据）后用 .then 等 promise resolve，再发 GET 验证 item 确实进了数组——「先操作后验证」的链式集成测试。"
        }
      ],
      "pitfalls": [
        {
          "title": "直接对 app.js 写测试",
          "text": "app.js 里有 app.listen——测试里 require 它会把真服务器拉起来：端口占用、测试挂起、CI 里进程退不出去。官方示范的结构分工就是答案：启动逻辑留 app.js（不测），路由逻辑拆导出模块（被测），测试文件自建不 listen 的迷你 app。"
        },
        {
          "title": "忘传 done 或传错位置",
          "text": "done 必须传进最后一个 .expect 由 SuperTest 调用：漏传则异步断言未完成测试就被判结束——超时挂起或假绿；传进中间的 expect 也不行——链没走完就报完成。POST 链式测试里 done 在 .then 内部的最后一个 expect 上，别放在外层。"
        },
        {
          "title": "照着旧仓库地址找文档",
          "text": "正文的 supertest 链接是 visionmedia/supertest——仓库已迁移到 forwardemail 组织（Assignment 里官方给的才是现地址）。旧地址可能重定向也可能失效； SuperTest 的方法文档还要配 SuperAgent 一起读：SuperAgent 的任何方法在 SuperTest 里都能调。"
        },
        {
          "title": "拿开发库跑测试",
          "text": "官方红线：绝不对生产数据库跑测试代码——其实开发库也不该跑（测试会写入与删除数据）。本课用内存数组绕开问题；真实数据库的测试要配 test_ 前缀的独立库与隔离机制，那是下一课的整课内容，别跳过。"
        }
      ],
      "official": {
        "assignment": [
          "确保通读 SuperTest 文档（github forwardemail/supertest）",
          "SuperTest 取材于相关项目 SuperAgent——SuperAgent 里能调用的任何方法在 SuperTest 里也能调用，需再过一遍 SuperAgent 文档（forwardemail.github.io/superagent/）"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/testing_express/testing_routes_and_controllers.md（本站自行编写简体讲解与任务拆解，未改编自任何第三方中文课程）",
        "sha256": "c002d5f45e94a227174f9f13a4034d7ce68516ee4db8cabe325dff9159bc4e28",
        "verifiedAt": "2026-09-29"
      }
    },
    {
      "id": "node-path-nodejs-testing-database-operations",
      "title": "Testing Database Operations",
      "zh": "测试数据库操作",
      "group": 5,
      "url": "https://www.theodinproject.com/lessons/node-path-nodejs-testing-database-operations",
      "summary": "「测试 Express」章的第二课（官方原文约 5.7KB）：被测代码要碰数据库时，准备工作复杂得多——本课讲单元与集成测试环境里怎么对待数据库。官方开场红线：显然你不想对生产数据库跑测试代码——有损坏用户数据的风险。四大块：① 单元测试——你到底需不需要？（Unit tests - do you even need to?）官方先教你怀疑：如果你只是用 pg（或其他 db 模块）直接读写数据库，那段代码可能真的不需要测——pg（想必所有流行 db 模块都一样）对它的全部动作已经有大量测试；如果你只是在提供 JSON API、所做的只是调用另一个模块的函数，那些操作已经被覆盖了。该测的是：查询复杂时——可以证明加单元测试确保你用对了、你写的代码在做你意图的事；用你自己的代码做过滤、排序或其他数据加工时——这些也要测；官方建议：自己的代码最好抽成独立模块、与数据库操作分离，这样不用碰数据库就能测它们。② 集成测试——有些情况你确实要测碰数据库的东西：比如上一课用 supertest 对服务器做的集成测试。做法：为测试建独立数据库、用 test_ 前缀便于识别；可以换掉测试数据库 URL 跑一次 prisma migrate；然后在测试库上跑种子脚本、或在测试套件的 beforeAll 函数里手动插入数据。③ 环境变量与 Jest 的特殊性——用环境变量让代码库识别该用哪个库：.env 文件加三行（NODE_ENV=development / DATABASE_URL=postgresql://<user>:<password>@localhost:5432/inventory_application / TEST_DATABASE_URL=postgresql://<user>:<password>@localhost:5432/test_inventory_application——官方示例正是库存项目的库名）；package.json 配 npm scripts（\"dev\": \"node app.js\" / \"test\": \"jest\"）。加载环境变量的方法：app.js 可以用你偏好的方式（--env-file 等），但 **Jest 用不了 --env-file 或 --env-file-if-exists——因为你不是直接调用 node**；这时要用 process.loadEnvFile() 这类方法以编程方式把环境变量加载进测试环境——可以放在 Jest global setup file 里做。另一个官方要点：**Jest 默认把 NODE_ENV 设为 \"test\"**——会覆盖你 .env 文件里的 NODE_ENV=development，所以「无需做任何花哨的事」。按 NODE_ENV 切换数据库 URL 的代码：const connectionString = process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL; const adapter = new PrismaPg({ connectionString }); const prisma = new PrismaClient({ adapter });——PrismaPg 适配器写法与 ORM 章的 Quickstart 同源。④ 测试间重置数据库（Resetting the database between tests）——测数据库操作时必须让测试相互隔离：任何测试都不依赖其他任何测试；官方例子：我们不希望一个测试因为「另一个测试里没加或没删某行表数据」而失败——即使被测的主行为其实工作正常。这意味着测试里与数据库交互（读、建、改、删记录）后，理想情况要在下个测试前把数据库重置回初始状态。便利做法是 beforeEach：如果库里有 users 与 projects 两表——beforeEach(async () => { await prisma.$transaction([ prisma.user.deleteMany(), prisma.project.deleteMany() ]); })——确保每个测试跑之前 users 与 projects 表都被重置。另一个官方要点：如果把测试拆进多个文件，要让测试运行器**串行**（一个文件接一个文件）而非并行跑它们——防止不同测试的数据库操作互相搅混；**Jest 默认并行执行文件**，所以给 package.json 的 test 脚本加 **--runInBand 旗标**确保串行。官方收尾：「Voila，搭建完成。现在去吧……去测起来（shoo... go get testin'）。」Assignment 一条：不用深潜，但看一眼 pg 的 GitHub 仓库的 tests 目录（brianc/node-postgres/tree/master/packages/pg/test）——看看多数流行库被测得有多充分。本课官方无 Additional resources。",
      "guide": "以下是官方原课的中文化梳理。**开场**：被测代码要**碰数据库**时，要做的准备工作**复杂得多**（quite a bit more complicated）。显然你**不想对生产数据库跑测试代码**——有**损坏用户数据的风险**。本课触及：在**单元与集成测试环境**里怎么对待数据库。**课程概览**（官方两条）：在 Express 服务器语境下覆盖单元测试与集成测试；创建并使用独立的数据库做集成测试。**① 单元测试——你到底需不需要？**：深入之前，你可能想先考虑：你要测的数据库操作**到底需不需要测**。如果你只是用 **pg**（或其他 db 模块）**直接读写数据库**，那段代码**可能真的不需要测**——**pg（想必所有流行 db 模块）对它的全部动作已经有大量测试**；如果你只是在提供 **JSON API**、所做的只是**调用另一个模块的函数**，那些操作**已经被覆盖了**。**该测的情形**：**查询复杂**时——加单元测试可以确保你**用对了**、你写的代码在做你**意图**的事；用**你自己的代码**做**过滤、排序或其他数据加工**时——也要测。**官方建议**：自己的代码最好**抽成独立模块、与数据库操作分离**——这样**不用碰数据库**就能测它们。**② 集成测试**：有些情况你**确实要测碰数据库的东西**——比如上一课（Testing Routes and Controllers）我们用 supertest 对服务器做的集成测试。**做法**：为测试**建独立数据库**；用 **test_ 前缀**便于识别；可以**换掉测试数据库 URL 跑一次 prisma migrate**；然后在这个库实例上**跑种子脚本**、或在测试套件的 **beforeAll** 函数里**手动插入数据**。**③ 环境变量**：用**环境变量**让代码库识别该用哪个库。**.env 文件**加（官方示例用的正是库存项目的库名）：NODE_ENV=development / DATABASE_URL=postgresql://<user>:<password>@localhost:5432/inventory_application / TEST_DATABASE_URL=postgresql://<user>:<password>@localhost:5432/test_inventory_application。**package.json** 配 scripts：\"dev\": \"node app.js\"、\"test\": \"jest\"。**加载环境变量的 Jest 特殊性（官方重点）**：app.js 可以用你偏好的方式加载，但 **Jest 用不了 --env-file 或 --env-file-if-exists——因为你不是直接调用 node**（you don't directly invoke node）；这时要用 **process.loadEnvFile()** 这类方法**以编程方式**把环境变量加载进测试环境——可以放在 **Jest global setup file** 里做（官方链 Jest 配置文档 globalsetup 锚点）。**另一个官方要点**：**Jest 默认把 NODE_ENV 设为 'test'**——它会**覆盖**你 .env 文件里的 NODE_ENV=development，所以「**无需做任何花哨的事**」（官方链 Jest environment-variables 文档 NODE_ENV 锚点）。**按 NODE_ENV 切换数据库 URL**（官方代码）：**const connectionString = process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL; const adapter = new PrismaPg({ connectionString }); const prisma = new PrismaClient({ adapter });**——PrismaPg 适配器写法与 ORM 章 Quickstart 同源（驱动适配器模式）。**④ 测试间重置数据库**：测数据库操作时，必须**让测试相互隔离**——**任何测试都不依赖其他任何测试**。官方例子：我们不希望一个测试**因为「另一个测试里没加或没删某行表数据」而失败**——即使被测的主行为其实工作正常。这意味着：测试里与数据库交互（**读、建、改、删**记录）后，理想情况要**在下个测试前把数据库重置回初始状态**。便利做法：**beforeEach**——比如库里有 users 与 projects 两表：**beforeEach(async () => { await prisma.$transaction([ prisma.user.deleteMany(), prisma.project.deleteMany() ]); })**——确保**每个测试跑之前** users 与 projects 表都被重置。**⑤ 串行执行**：如果把测试拆进**多个文件**，要让测试运行器**串行**（sequential，一个文件接一个文件）跑而**非并行**——防止**不同测试的数据库操作互相搅混**（getting mixed up）。因为 **Jest 默认并行执行文件**，给 package.json 的 test 脚本加 **--runInBand 旗标**确保串行（官方链 Jest CLI 文档锚点）。**官方收尾**：「**Voila**，搭建完成。现在去吧……**去测起来**（shoo... go get testin'）。」**Assignment（一条）**：**不用深潜**（No need for a deep dive），但看一眼 **pg 的 GitHub 仓库的 tests 目录**——看看**多数流行库被测得有多充分**（how well tested most of the popular libraries are）。**官方无 Additional resources。**",
      "understand": [
        "能应用官方的「单元测试必要性判断」：pg 等流行库对自身动作已有大量测试——直接调用它们的简单读写不必重复测；复杂查询、自己的过滤/排序/加工逻辑要测，且自己的代码最好抽成独立模块与数据库操作分离、不碰库就能测",
        "能搭出集成测试的数据库三件套：test_ 前缀的独立数据库 + 换 URL 跑 prisma migrate + 种子脚本或 beforeAll 灌初始数据——绝不对生产库跑测试（损坏用户数据的风险）",
        "能解释 Jest 加载环境变量的特殊性：Jest 不直接调用 node 所以 --env-file 用不了——改用 process.loadEnvFile() 放在 Jest global setup file 里；且 Jest 默认 NODE_ENV='test' 会覆盖 .env 里的 development，正好被三元式用来切 TEST_DATABASE_URL",
        "能写出按 NODE_ENV 切连接串的 PrismaPg 适配器代码，并说明它与 ORM 章 Quickstart 同源",
        "能解释测试隔离的两层机制：beforeEach 里 prisma.$transaction([deleteMany...]) 把表重置回初始状态（任何测试不依赖其他测试）；多文件测试加 --runInBand 串行跑（Jest 默认并行会让不同文件的数据库操作互相搅混）"
      ],
      "terms": [
        {
          "en": "integration test（集成测试）",
          "zh": "测「碰数据库的东西」的形态——上一课 supertest 对服务器的测试就是；要配 test_ 前缀的独立数据库"
        },
        {
          "en": "test_ 前缀库",
          "zh": "集成测试的独立数据库命名惯例（test_inventory_application）——便于识别，与开发库、生产库物理隔离"
        },
        {
          "en": "process.loadEnvFile()",
          "zh": "Jest 环境加载环境变量的编程式方法——Jest 不直接调用 node，--env-file 用不了；放进 Jest global setup file"
        },
        {
          "en": "NODE_ENV",
          "zh": "环境标识变量：Jest 默认设为 'test'（覆盖 .env 的 development）——connectionString 三元式据此切换 TEST_DATABASE_URL / DATABASE_URL"
        },
        {
          "en": "PrismaPg adapter",
          "zh": "Prisma 的 PostgreSQL 驱动适配器：new PrismaPg({ connectionString }) 传入连接串、new PrismaClient({ adapter }) 组装——与 ORM 章 Quickstart 同源写法"
        },
        {
          "en": "--runInBand",
          "zh": "Jest CLI 旗标：强制测试文件串行执行——Jest 默认并行，多文件同时操作测试库会互相搅混"
        },
        {
          "en": "beforeEach + $transaction",
          "zh": "测试隔离的组合拳：每个测试前用一个事务 deleteMany 全部表——把库重置回初始状态，任何测试不依赖其他测试"
        }
      ],
      "tasks": [
        "不用深潜，但看一眼 pg 的 GitHub 仓库的 tests 目录（brianc/node-postgres 的 packages/pg/test）——看看多数流行库被测得有多充分"
      ],
      "quiz": [
        {
          "question": "官方「单元测试——你到底需不需要？」的判断标准是什么？哪些该测、哪些不必？",
          "answer": "不必测：用 pg 或其他流行 db 模块直接读写数据库的代码——pg（想必所有流行 db 模块）对自身全部动作已有大量测试；只是提供 JSON API、只是调用另一个模块的函数——那些操作已被覆盖。该测：查询复杂时（确保用对了、代码在做你意图的事）；用你自己的代码做过滤、排序或其他数据加工时。官方建议：自己的代码抽成独立模块、与数据库操作分离——不碰数据库就能测。"
        },
        {
          "question": "集成测试的数据库怎么搭？初始数据从哪来？",
          "answer": "为测试建独立数据库，用 test_ 前缀便于识别（如 test_inventory_application）；换掉测试数据库 URL 跑一次 prisma migrate 把结构建好；初始数据两条路：跑种子脚本，或在测试套件的 beforeAll 函数里手动插入。红线：绝不对生产数据库跑测试代码——有损坏用户数据的风险；开发库也不该跑（测试会写入删除数据）。"
        },
        {
          "question": "为什么 Jest 用不了 --env-file？官方的替代方案是什么？NODE_ENV 上有什么「无需花哨」的巧合？",
          "answer": "因为跑测试时你不是直接调用 node——--env-file/--env-file-if-exists 是 node CLI 的旗标，Jest 有自己的启动方式。替代：用 process.loadEnvFile() 以编程方式加载环境变量进测试环境，可以放在 Jest global setup file 里。巧合：Jest 默认把 NODE_ENV 设为 'test'，会覆盖 .env 里的 NODE_ENV=development——正好让 connectionString 三元式（NODE_ENV === 'test' ? TEST_DATABASE_URL : DATABASE_URL）在测试里自动切到测试库，「无需做任何花哨的事」。"
        },
        {
          "question": "beforeEach 里的 prisma.$transaction([prisma.user.deleteMany(), prisma.project.deleteMany()]) 解决什么问题？为什么用 $transaction 包起来？",
          "answer": "解决测试隔离：任何测试都不依赖其他任何测试——官方例子：不希望一个测试因为「另一个测试里没加或没删某行」而失败，即使被测主行为其实正常。所以每个测试跑之前把 users 与 projects 表重置回初始状态。用 $transaction 把多个 deleteMany 包成一个事务：全部成功或全部失败，不会出现「users 清了、projects 没清」的半重置状态；且事务里有外键关系时删除顺序问题也更好处理。"
        },
        {
          "question": "多文件测试为什么要加 --runInBand？Jest 的默认行为是什么？",
          "answer": "Jest 默认并行执行测试文件——多个文件同时对同一个测试库做写入删除，操作会互相搅混（getting mixed up）：A 文件的 beforeEach 清表可能删掉 B 文件正在断言的数据。--runInBand 让测试串行（一个文件接一个文件）跑，配合每文件内的 beforeEach 重置，隔离才完整。官方建议把它加进 package.json 的 test 脚本。"
        }
      ],
      "optional": [],
      "note": "本课是测试章的收束：上一课解决了「HTTP 层怎么测」，这一课解决「碰数据库怎么测」——判断哪些不必测（流行库已自测）、独立测试库三件套、Jest 环境变量的两个特殊性（--env-file 不可用 → process.loadEnvFile()；NODE_ENV 默认 'test'）、beforeEach 事务重置与 --runInBand 串行。官方示例的库名正是库存项目（inventory_application）——学完即可回头给旧项目补测试。",
      "why": "「别对生产库跑测试」谁都懂，但落到实操全是细节：测试库从哪来、环境变量怎么进 Jest、两个测试文件同时清库会发生什么——这一课把每个细节的官方答案都给齐了。更值钱的是第一节的判断力训练：不是所有数据库代码都值得测，流行库已自测的部分是负资产，自己的过滤排序逻辑才是测试的靶心。学完它，Express 应用的测试拼图（HTTP 层 + 数据层）就完整了，之后每个项目都可以带着测试交付。",
      "sections": [
        {
          "h": "开场红线与「到底需不需要测」",
          "p": [
            "被测代码碰数据库时，准备工作复杂得多；官方红线开场：显然你不想对生产数据库跑测试代码——有损坏用户数据的风险。",
            "单元测试必要性判断（官方教你怀疑）：用 pg 或其他流行 db 模块直接读写——可能真的不需要测：pg 对自身全部动作已有大量测试；只提供 JSON API、只调用别的模块的函数——已被覆盖。",
            "该测的：复杂查询（确保用对了、在做你意图的事）；自己的代码做过滤、排序或其他数据加工——官方建议抽成独立模块与数据库操作分离，不碰库就能测。"
          ]
        },
        {
          "h": "集成测试：test_ 前缀独立库三件套",
          "p": [
            "有些情况确实要测碰数据库的东西——比如上一课用 supertest 对服务器做的集成测试。",
            "三件套：建独立数据库（test_ 前缀便于识别）；换测试库 URL 跑一次 prisma migrate 建结构；种子脚本或 beforeAll 函数灌初始数据。"
          ]
        },
        {
          "h": "环境变量与 Jest 的两个特殊性",
          "p": [
            ".env 加三行：NODE_ENV=development、DATABASE_URL、TEST_DATABASE_URL（官方示例正是库存项目的 inventory_application / test_inventory_application）；package.json 配 \"dev\" 与 \"test\" 脚本。",
            "特殊性一：Jest 用不了 --env-file 或 --env-file-if-exists——因为你不是直接调用 node；替代方案：process.loadEnvFile() 以编程方式加载，可放进 Jest global setup file。",
            "特殊性二：Jest 默认把 NODE_ENV 设为 'test'，覆盖 .env 里的 development——「无需做任何花哨的事」，正好被切库三元式利用。"
          ]
        },
        {
          "h": "按 NODE_ENV 切连接串",
          "p": [
            "官方代码：const connectionString = process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;",
            "组装：const adapter = new PrismaPg({ connectionString }); const prisma = new PrismaClient({ adapter });——PrismaPg 驱动适配器写法与 ORM 章 Quickstart 同源。",
            "效果：同一份代码，开发时连开发库、Jest 里自动连测试库——切换零手工。"
          ]
        },
        {
          "h": "测试隔离：beforeEach 重置",
          "p": [
            "原则：任何测试都不依赖其他任何测试——官方例子：不希望一个测试因为「另一个测试里没加或没删某行」而失败，即使被测主行为其实正常。",
            "做法：beforeEach 里把库重置回初始状态——users 与 projects 两表的例子：prisma.$transaction([prisma.user.deleteMany(), prisma.project.deleteMany()])，一个事务保证全清或全不清。"
          ]
        },
        {
          "h": "串行执行：--runInBand",
          "p": [
            "测试拆进多个文件时，要让运行器串行（一个文件接一个文件）而非并行——防止不同测试的数据库操作互相搅混。",
            "Jest 默认并行执行文件：给 package.json 的 test 脚本加 --runInBand 旗标确保串行。",
            "官方收尾：「Voila，搭建完成。现在去吧……去测起来（shoo... go get testin'）。」"
          ]
        }
      ],
      "examples": [
        {
          "lang": "properties",
          "code": "NODE_ENV=development\nDATABASE_URL=postgresql://<user>:<password>@localhost:5432/inventory_application\nTEST_DATABASE_URL=postgresql://<user>:<password>@localhost:5432/test_inventory_application",
          "note": "官方 .env 示例：开发库与测试库两个 URL 并存，测试库用 test_ 前缀（官方例子正是库存项目的库名）。Jest 跑时 NODE_ENV 被默认改成 'test'，触发下面的三元式切到 TEST_DATABASE_URL。"
        },
        {
          "lang": "javascript",
          "code": "const connectionString = process.env.NODE_ENV === 'test'\n  ? process.env.TEST_DATABASE_URL\n  : process.env.DATABASE_URL;\n\nconst adapter = new PrismaPg({ connectionString });\nconst prisma = new PrismaClient({ adapter });",
          "note": "官方切库代码：按 NODE_ENV 三元式选连接串，PrismaPg 适配器 + PrismaClient 组装——与 ORM 章 Quickstart 的驱动适配器写法同源。同一份代码开发连开发库、测试自动连测试库。"
        },
        {
          "lang": "javascript",
          "code": "beforeEach(async () => {\n  await prisma.$transaction([\n    prisma.user.deleteMany(),\n    prisma.project.deleteMany(),\n  ]);\n});",
          "note": "官方测试隔离代码：每个测试前用一个事务清空 users 与 projects 表——把库重置回初始状态，任何测试不依赖其他测试；事务保证多个 deleteMany 全成功或全失败，不会出现半重置。"
        }
      ],
      "pitfalls": [
        {
          "title": "给流行库的调用写重复测试",
          "text": "官方第一节就是「别测不该测的」：pg 对自身全部动作已有大量测试（Assignment 让你亲眼看它的 tests 目录）——为「调用 pg 查询成功」写测试是负资产。靶心是复杂查询的正确性与自己的过滤/排序/加工逻辑，且后者最好抽成独立模块，不碰库就能测。"
        },
        {
          "title": "Jest 里用 --env-file 加载环境变量",
          "text": "--env-file 是 node CLI 的旗标，Jest 不直接调用 node——加了也不生效，process.env 全是 undefined。官方替代：process.loadEnvFile() 放进 Jest global setup file。同理别忘了 Jest 默认 NODE_ENV='test' 会覆盖 .env 里的 development——这是特性不是 bug，切库三元式正靠它工作。"
        },
        {
          "title": "多文件并行跑测试库",
          "text": "Jest 默认并行执行测试文件：A 文件的 beforeEach 清表可能删掉 B 文件正在断言的数据——失败看起来随机、复现靠运气。官方解法：test 脚本加 --runInBand 串行跑；配合 beforeEach 重置，隔离才完整。"
        },
        {
          "title": "beforeEach 清表不用事务",
          "text": "多个 deleteMany 逐个 await：中途一个失败就留下半重置状态（users 清了、projects 没清），下个测试在被污染的数据上跑。官方写法是 prisma.$transaction([...]) 一次事务——全成功或全失败；有外键关系时事务里的删除顺序也更可控。"
        }
      ],
      "official": {
        "assignment": [
          "不用深潜，但看一眼 pg 的 GitHub 仓库的 tests 目录（brianc/node-postgres 的 packages/pg/test）——看看多数流行库被测得有多充分"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/testing_express/testing_database_operations.md（本站自行编写简体讲解与任务拆解，未改编自任何第三方中文课程）",
        "sha256": "61876d375eea4ec12c66bbd492f9cfcb6b83933270fe9266c0442129a8670827",
        "verifiedAt": "2026-09-29"
      }
    },
    {
      "id": "nodejs-where-s-waldo-a-photo-tagging-app",
      "title": "Project: Where's Waldo (A Photo Tagging App)",
      "zh": "项目：沃尔多在哪里（照片标签应用）",
      "group": 6,
      "url": "https://www.theodinproject.com/lessons/nodejs-where-s-waldo-a-photo-tagging-app",
      "summary": "「全栈项目」章第一门（全站第 31 门 Project 课）：建一个照片标签（photo tagging）游戏应用——「沃尔多在哪里」的 Web 版。官方定位：这个项目终于给你机会把目前学过的一切拧在一起；复杂度高，要一步一步来；后端部分相当直截了当，但你要同时兼顾一些前端功能；「这完全属于你在工作上可能被要求构建的那类东西的范畴（虽然不完全一样）」。游戏介绍（官方链 Wikipedia 的 Where's Wally 条目）：你会看到一幅繁忙拥挤的插画，里面有许许多多人物、物体与地点；你的任务是找到藏在插画某处的特定角色沃尔多（Waldo）。你的任务（Your task 节，官方叙事四段）：建一个完成后会非常像照片标签应用的东西——从一张大照片开始，里面有几个用户要找的元素（如 Waldo、The Wizard、Wilma 等——想用自定义图片也可以自己命名角色）；用户为每个角色做选择，系统给出对或错的反馈。流程：先选一张照片、用像素位置确定每个人物的确切位置并存进数据库；用户点击照片时，在点击部位放一个瞄准框（targeting box），框里应含可能角色的列表；用户选择某个角色后，与后端核对该角色是否真的在瞄准框内；给恰当反馈（错了给错误消息）；对了就在照片上该角色位置放一个标记（marker）；无论对错都移除瞄准框、直到用户再次点击。计时与高分：追踪从照片首次加载到用户找齐所有角色的用时；官方建议**在服务器端计时**——否则用户可以黑掉自己的分数（「但这一点你现在应该已经知道了」）；一轮完成后请用户输入名字并记录该时间；「这会有点棘手（tricky），因为你要追踪的是匿名用户！」Assignment 七条 + Extra credit 一条：① 想想让这一切协同工作需要做什么——在纸或白板上把它完全想清楚再动手；几分钟的思考能省下一小时的编码浪费。② 先建前端功能、暂不调用后端：具体是做出「用户点击照片时弹出瞄准框与下拉菜单、点别处时移除」的功能。③ 接上后端验证功能：核对用户从下拉菜单选择的角色，其点击位置是否正确。官方 Note：取决于你怎么获取用户点击的坐标，**不同屏幕尺寸可能产生不同坐标**——可能导致应用在大屏上记录坐标正常、小屏上不正常；知道这点后，你可能需要给点击逻辑实现**跨屏幕尺寸归一化坐标**（normalize coordinates）的方法。④ 把它接进前端：无缝地选择角色、验证、对了就在地图上放相应标记。⑤ 加计时能力：从用户首次加载页面开始计时，成功找齐全部角色时显示他们的「分数」（用时）；创建一个弹窗，请够格的用户输入名字进高分榜（high scores table）。⑥ 玩它！（Play with it!）⑦ 把解法推到 GitHub 并部署到任意托管选项；另外在课页下方提交你的解法——「这是个严肃的项目，恭喜！」Extra credit：把多张图片装进数据库，允许用户在开始游戏前从中选择。",
      "guide": "以下是官方项目要求的中文化梳理。**红线**：本站不提供成品代码——照片坐标存储、瞄准框交互、验证逻辑、计时与高分榜全部自己设计。**项目一句话**：建一个**照片标签游戏**——「沃尔多在哪里（Where's Waldo/Wally）」的 Web 版：一幅拥挤插画里藏着若干角色，用户点照片、框角色、后端验证、放标记、计时上榜。**官方定位**：终于有机会**把目前学过的一切拧在一起**；复杂度**高**，**一步一步来**；后端部分**相当直截了当**，但你要**同时兼顾一些前端功能**；「这完全属于你**在工作上可能被要求构建**的那类东西的范畴（虽然不完全一样）」。**游戏背景**（官方链 Wikipedia 的 Where's Wally 条目）：没玩过也没关系——你会看到一幅**繁忙拥挤的插画**，里面有许许多多人物、物体与地点；任务是**找到藏在插画某处的特定角色**沃尔多。**你的任务（官方叙事四段）**：**形态**：建一个完成后会**非常像照片标签应用**的东西——从一张大照片开始，里面有几个用户要找的元素（如 **Waldo、The Wizard、Wilma** 等——想用自定义图片也可以**自己命名角色**）；用户为每个角色做选择，得到**对或错的反馈**。**准备**：先**选一张照片**、用**像素位置**确定每个人物的确切位置、**存进数据库**。**交互环**：用户**点击照片** → 在点击部位放一个**瞄准框（targeting box）**，框里含**可能角色的列表** → 用户**选择某角色** → **与后端核对**该角色是否真的在瞄准框内 → **给恰当反馈**（错了给错误消息；对了就在照片上该角色位置放一个**标记 marker**）→ **无论对错都移除瞄准框**，直到用户再次点击。**计时与高分**：追踪**从照片首次加载到找齐所有角色**的用时；官方建议**在服务器端计时**——否则用户可以**黑掉自己的分数**（「但这一点你现在应该已经知道了」）；一轮完成后**请用户输入名字**并记录该时间；官方预警：「这会有点**棘手（tricky）**，因为你要追踪的是**匿名用户**！」**Assignment（七条）**：**①** 想想让这一切协同工作需要做什么——**在纸或白板上把它完全想清楚**再动手；官方口径：**几分钟的思考能省下一小时的编码浪费**。**②** **先建前端功能、暂不调用后端**：具体做出「用户点击照片时**弹出瞄准框与下拉菜单**、**点别处时移除**」的功能。**③** **接上后端验证**：核对用户从下拉菜单选择的角色、其点击位置是否正确。**官方 Note（坐标陷阱）**：取决于你怎么获取点击坐标，**不同屏幕尺寸可能产生不同坐标**——可能导致应用在**大屏记录坐标正常、小屏不正常**；你可能需要给点击逻辑实现**跨屏幕尺寸归一化坐标（normalize coordinates）**的方法。**④** **接进前端**：无缝地**选择角色、验证、对了就在地图上放相应标记**。**⑤** **计时与高分榜**：从用户**首次加载页面**开始计时；成功**找齐全部角色**时显示「分数」（用时）；创建**弹窗**请够格的用户**输入名字进高分榜（high scores table）**。**⑥** **玩它！（Play with it!）**——官方把「玩」写进了任务清单。**⑦** 把解法**推到 GitHub** 并**部署**到任意托管选项；在课页下方**提交解法**——官方原话：「**这是个严肃的项目，恭喜！**」**Extra credit**：把**多张图片**装进数据库，允许用户在**开始游戏前从中选择**。",
      "understand": [
        "能画出本项目的完整交互环：点照片 → 瞄准框+角色下拉 → 后端核对坐标 → 反馈（错误消息 / 放标记）→ 移除瞄准框——五步闭环，前后端各管一半",
        "能解释「服务器端计时」的安全理由：客户端计时的分数用户随手可改（黑掉自己的分数），服务器从照片加载事件起计时才可信——「这一点你现在应该已经知道了」正是前面课程反复训练的判断",
        "能说出坐标归一化问题的成因与官方给的解法方向：点击坐标的获取方式不同、屏幕尺寸不同会产生不同坐标——大屏正常小屏错乱；要给点击逻辑实现跨屏幕尺寸的坐标归一化（如统一换算成图片自身像素坐标或百分比）",
        "能规划匿名用户的计时追踪：没有登录体系，从首次加载到找齐角色的计时要绑定「这一轮」的某个标识——官方预警这是 tricky 的部分，纸面设计（第 1 步）时就要想清楚",
        "能复述官方的构建顺序纪律：白板想清楚 → 先纯前端交互（不调后端）→ 接后端验证 → 整合标记 → 计时高分榜 → 部署提交——「几分钟的思考能省下一小时的编码浪费」"
      ],
      "terms": [
        {
          "en": "photo tagging（照片标签）",
          "zh": "本项目的应用形态：在大照片上点选并标记特定人物——「完成后会非常像照片标签应用」"
        },
        {
          "en": "targeting box（瞄准框）",
          "zh": "用户点击照片时弹出的框：含可能角色的下拉列表；无论选对选错都移除，直到再次点击"
        },
        {
          "en": "normalize coordinates（坐标归一化）",
          "zh": "官方 Note 的核心工程点：不同屏幕尺寸产生不同点击坐标——要换算成统一基准，否则大屏正常小屏错乱"
        },
        {
          "en": "high scores table（高分榜）",
          "zh": "计时玩法的收口：找齐全部角色后弹窗输入名字、记录用时——服务器端计时防作弊"
        },
        {
          "en": "anonymous users（匿名用户）",
          "zh": "官方预警的 tricky 点：没有登录体系，计时要追踪的是匿名访客的「这一轮」"
        }
      ],
      "tasks": [
        "想想让这一切协同工作需要做什么——在纸或白板上把它完全想清楚再动手；官方口径：几分钟的思考能省下一小时的编码浪费",
        "先建前端功能、暂不调用后端：做出「用户点击照片时弹出瞄准框（targeting box）与下拉菜单、点别处时移除」的功能",
        "接上后端验证：核对用户从下拉菜单选择的角色、其点击位置是否正确——官方 Note：不同屏幕尺寸可能产生不同坐标（大屏正常小屏错乱），你可能需要给点击逻辑实现跨屏幕尺寸归一化坐标的方法",
        "把它接进前端：无缝地选择角色、验证，选对了就在地图上放相应标记",
        "加计时能力：从用户首次加载页面开始计时，成功找齐全部角色时显示「分数」（用时）；创建弹窗请够格的用户输入名字进高分榜（high scores table）——计时放服务器端，匿名用户追踪是官方预警的 tricky 点",
        "玩它！（Play with it!）",
        "把解法推到 GitHub 并部署到任意托管选项；在课页下方提交你的解法——「这是个严肃的项目，恭喜！」"
      ],
      "quiz": [
        {
          "question": "把官方的交互环完整说一遍：从用户点击照片到标记出现在图上。",
          "answer": "① 用户点击照片——在点击部位放一个瞄准框（targeting box），框里含可能角色的下拉列表；② 用户选择某个角色——与后端核对该角色是否真的在瞄准框内（数据库里存着每个人物的像素位置）；③ 反馈：错了给错误消息；对了在照片上该角色的位置放一个标记（marker）；④ 无论对错都移除瞄准框，直到用户再次点击。前置准备：选照片、用像素位置确定每个人物的确切位置存进数据库。"
        },
        {
          "question": "为什么官方坚持计时要放服务器端？「这一点你现在应该已经知道了」指的是什么训练？",
          "answer": "客户端计时的「分数」完全在用户手里——改一下 JS 变量或拦截请求就能黑掉自己的成绩；服务器端从照片加载事件起计时，成绩才可信。这句话指的是前面课程反复训练的安全判断：库存项目 Extra credit 的破坏性操作保护、表单课的服务端校验、API 章的「你可不会想让陌生人编辑你的文章」——同一个原则：凡是有价值或有风险的状态，验证与记录都必须在服务器端。"
        },
        {
          "question": "官方 Note 里的坐标问题是什么？为什么大屏正常、小屏会错乱？该怎么处理？",
          "answer": "点击坐标的获取方式不同（相对视口、相对容器、相对图片原图），在不同屏幕尺寸下会产生不同的数值：图片被 CSS 缩放显示后，屏幕像素坐标与原图像素坐标不再一一对应——你在大屏上按显示尺寸记录的坐标，换到小屏上就指向别处。官方解法方向：给点击逻辑实现跨屏幕尺寸的坐标归一化（normalize coordinates）——例如把点击位置换算成图片自身坐标系的百分比或原图像素，数据库存的「人物确切位置」也用同一基准。"
        },
        {
          "question": "官方说这个项目「完全属于你在工作上可能被要求构建的那类东西的范畴」——它综合了前面哪些课程的能力？",
          "answer": "几乎是 World 7 全清单：Express 路由与控制器（验证端点、计时端点）、PostgreSQL/Prisma（人物坐标、高分榜的建模）、API 形态的前后端协作（前端点击 → 后端核对 → 返回结果，Blog API 课的模式）、前端交互（瞄准框、下拉、标记渲染——World 3/5 的 DOM 与 React 技能）、部署（第 7 步推 GitHub 上托管）、安全判断（服务器端计时防作弊）。官方定位「复杂度高、一步一步来」正是因为它第一次要求前后端能力同时在线。"
        }
      ],
      "optional": [],
      "note": "Project 红线课：本站不提供成品代码，examples 为空数组——坐标模型、瞄准框交互、归一化算法、计时与高分榜全部自己设计。这是全站第 31 门 Project 课、World 7 第 7 门。官方 Markdown 住在 react/react_and_the_backend/ 目录（课页 edit 链接实证）而非 nodeJS/——「全栈项目」章两门课是 react 课程与 nodejs 课程共用资产的跨路径形态。官方把「Play with it!」写进任务清单第 6 条。",
      "why": "这是 World 7 第一个「前后端同时开工」的项目：Blog API 让你体验了分离架构，这里则要求前端交互（瞄准框、坐标、标记）与后端验证（坐标核对、计时、高分榜）严丝合缝地咬在一起——而坐标归一化这种「屏幕尺寸一变就错乱」的坑，正是真实工作里最常见的跨端问题形态。官方说它「完全属于你在工作上可能被要求构建的那类东西」：需求叙事式给出（不是清单式）、复杂度自己拆解、验收标准是「玩起来对」。做完它，离最终项目 Odin-Book 只差一步。",
      "sections": [
        {
          "h": "项目一句话：照片标签游戏",
          "p": [
            "建一个「沃尔多在哪里」的 Web 版照片标签应用：一幅拥挤插画藏着若干角色（Waldo、The Wizard、Wilma 等——自定义图片也可自己命名），用户点照片、框角色、验证、放标记、计时上榜。",
            "官方定位：把目前学过的一切拧在一起；复杂度高、一步一步来；后端相当直截了当，但要同时兼顾前端功能；「完全属于你在工作上可能被要求构建的那类东西的范畴」。",
            "游戏背景（官方链 Wikipedia 的 Where's Wally 条目）：繁忙拥挤的插画里藏着特定角色，任务是找到它。"
          ]
        },
        {
          "h": "准备与交互环（官方 Your task 叙事）",
          "p": [
            "准备：选一张照片，用像素位置确定每个人物的确切位置，存进数据库。",
            "交互环：用户点击照片 → 点击部位放瞄准框（含可能角色的下拉列表）→ 用户选角色 → 与后端核对是否在框内 → 反馈（错了给错误消息；对了在角色位置放标记）→ 无论对错移除瞄准框，直到再次点击。"
          ]
        },
        {
          "h": "计时与高分榜：服务器端才可信",
          "p": [
            "追踪从照片首次加载到找齐所有角色的用时；官方建议在服务器端计时——否则用户可以黑掉自己的分数（「但这一点你现在应该已经知道了」）。",
            "一轮完成后请用户输入名字并记录该时间；官方预警：这会有点棘手（tricky），因为你要追踪的是匿名用户。"
          ]
        },
        {
          "h": "构建顺序（Assignment 1-5）",
          "p": [
            "第 1 步：纸或白板把它完全想清楚——几分钟的思考能省下一小时的编码浪费。",
            "第 2 步：先建前端功能、暂不调用后端——点击弹瞄准框与下拉菜单、点别处移除。",
            "第 3 步：接上后端验证——核对所选角色的点击位置是否正确。官方 Note：不同屏幕尺寸可能产生不同坐标（大屏正常小屏错乱），可能需要实现跨屏幕尺寸的坐标归一化方法。",
            "第 4 步：接进前端——无缝选择、验证、放标记。第 5 步：计时与高分榜——首次加载开始计时、找齐显示分数、弹窗输名字进 high scores table。"
          ]
        },
        {
          "h": "玩它、部署、提交（Assignment 6-7）",
          "p": [
            "第 6 步：玩它！（Play with it!）——官方把「玩」写进任务清单。",
            "第 7 步：推 GitHub、部署到任意托管选项、课页下方提交解法——官方原话：「这是个严肃的项目，恭喜！」"
          ]
        },
        {
          "h": "Extra credit：多图选择",
          "p": [
            "把多张图片装进数据库，允许用户在开始游戏前从中选择——图片表与人物坐标表的关系建模是这一步的本体。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "坐标不归一化，换屏即错乱",
          "text": "官方 Note 点名的坑：点击坐标的获取方式与屏幕尺寸相关——图片被 CSS 缩放后屏幕坐标与原图像素不再对应，大屏记录的位置到小屏就指错地方。数据库存的人物位置与用户点击位置必须换算到同一基准（原图像素或百分比），这是本项目最容易在部署后才发现的 bug。"
        },
        {
          "title": "客户端计时",
          "text": "官方明说服务器端计时的理由：客户端的分数用户随手可黑（「这一点你现在应该已经知道了」）。计时起点（首次加载）与终点（找齐全部角色）都要由服务器记录；匿名用户的「这一轮」标识是官方预警的 tricky 点——白板设计阶段就要解决，别写完功能再补。"
        },
        {
          "title": "一上来就前后端混写",
          "text": "官方的顺序纪律：第 2 步先做纯前端交互（不调后端）——瞄准框弹出移除的 DOM 逻辑先跑顺；第 3 步才接后端验证。混着写的后果是交互 bug 与接口 bug 互相掩护，定位成本翻倍；「几分钟的思考能省下一小时的编码浪费」不只是口号，是这个项目的施工顺序。"
        },
        {
          "title": "验证放前端",
          "text": "「与后端核对该角色是否真的在瞄准框内」——核对必须在服务器端做：人物坐标存数据库，前端只上报点击位置与所选角色。把判定写在前端 JS 里，等于把答案发给玩家——查看源码就能必胜，与客户端计时是同一类错误。"
        }
      ],
      "official": {
        "assignment": [
          "想想让这一切协同工作需要做什么——在纸或白板上完全想清楚；几分钟的思考能省下一小时的编码浪费",
          "先建前端功能（暂不调用后端）：用户点击照片时弹出瞄准框与下拉菜单、点别处时移除",
          "接上后端验证：核对所选角色的点击位置是否正确；官方 Note：不同屏幕尺寸可能产生不同坐标，可能需要实现跨屏幕尺寸归一化坐标的方法",
          "接进前端：无缝选择角色、验证、选对就在地图上放相应标记",
          "加计时：从首次加载页面计时，找齐全部角色时显示「分数」（用时）；弹窗请够格用户输入名字进高分榜",
          "玩它！（Play with it!）",
          "推 GitHub、部署到任意托管选项、课页下方提交解法——「这是个严肃的项目，恭喜！」"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "Extra credit：多张图片装进数据库，允许用户开始游戏前从中选择"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 react/react_and_the_backend/project_wheres_waldo_a_photo_tagging_app.md（课页 edit 链接实证：本课官方 Markdown 住在 react 课程目录，是 nodejs 课程「全栈项目」章与 react 课程的跨路径共用课；本站自行编写简体讲解与任务拆解，未改编自任何第三方中文课程；Project 红线：不提供成品答案）",
        "sha256": "794f5a672cec875d70a2e52428e47c105d49fbfeecfc3860c11dfdf471572379",
        "verifiedAt": "2026-09-29"
      }
    },
    {
      "id": "nodejs-messaging-app",
      "title": "Project: Messaging App",
      "zh": "项目：聊天应用",
      "group": 6,
      "url": "https://www.theodinproject.com/lessons/nodejs-messaging-app",
      "summary": "「全栈项目」章第二门（全站第 32 门 Project 课）：建一个让用户互发消息的 Web 应用——想想你最喜欢的聊天应用（Discord、Telegram、WhatsApp、Facebook Messenger、AOL Instant Messenger 等），想象如果你能建一个自己的会是什么样；这个项目给你这个机会。官方全文极短（约 2KB），且**正文与 Assignment 没有任何外部链接**——本站零外部资料 Project 课形态（全站第 9 门零外部资料课）。Assignment 四条 + Extra credit 三条：① 记住前面提到的那些应用有整个开发者团队在做——所以你不该觉得需要把功能做过头（go overboard）；但至少（At a minimum）你的应用应包含以下核心功能：授权（Authorization）；给另一个用户发消息；自定义用户资料（Customizing a user profile）。② 花些时间规划你的应用：用户界面长什么样？数据模型长什么样？需要用到哪些库？③ 从在后端与前端实现核心功能开始建应用。官方随条附带一段重要的边界说明：你可能已经意识到 **REST API 后端无法处理实时更新**——它是「请求-响应」模式，服务器只能响应请求；如果一个用户给另一个用户发消息，REST API 无法自动通知接收者，因为接收者没有请求那份数据；**服务器-客户端实时更新的方法（特别是前后端分离场景）课程还没有教，所以不指望你在这个应用里实现任何实时更新**。④ 把应用部署上线，在课页下方的提交区以及官方 Discord 展示——「我们很想看看你建了什么！」Extra credit 三条：允许在聊天中发送图片；加好友列表——用户可以添加其他用户并看到谁在线（官方给了替代方案：「加一个用户列表显示哪些用户当前在线」——同一件事但可能少一两步，因为不需要加好友这个动作）；允许用户创建群聊并在群里发消息。",
      "guide": "以下是官方项目要求的中文化梳理。**红线**：本站不提供成品代码——数据模型、界面、消息流全部自己设计。**项目一句话**：建一个**让用户互发消息的 Web 应用**。官方开场：想想你**最喜欢的聊天应用**——**Discord、Telegram、WhatsApp、Facebook Messenger、AOL Instant Messenger** 等——想象**如果你能建一个自己的**会是什么样；这个项目给你这个机会。**官方全文极短**（约 2KB），正文与 Assignment **没有任何外部链接**——所需的一切都在你已学过的课程里。**Assignment（四条）**：**①** 官方先压预期：记住前面提到的那些应用有**整个开发者团队**在做——所以你**不该觉得需要把功能做过头**（go overboard）；但**至少**（At a minimum），你的应用应包含以下**核心功能**：**授权（Authorization）**；**给另一个用户发消息**；**自定义用户资料（Customizing a user profile）**。**②** **花些时间规划**你的应用——官方三连问：**用户界面长什么样？数据模型长什么样？需要用到哪些库？****③** **从在后端与前端实现核心功能开始**建应用。**官方边界说明（随第 ③ 条附带，本项目最重要的认知）**：你可能已经意识到——**REST API 后端无法处理实时更新（real time updates）**：它是「**请求-响应**」模式，**服务器只能响应请求**；如果一个用户给另一个用户发消息，**REST API 无法自动通知接收者**——因为**接收者没有请求那份数据**；**服务器-客户端实时更新的方法**（特别是处理**前后端分离**场景时）**课程还没有教**，所以**不指望你在这个应用里实现任何实时更新**。（换句话说：收消息靠接收方主动请求——刷新或轮询都是合格答案；WebSocket 这类实时推送不在本课要求内。）**④** 把应用**部署上线**，在课页下方的**提交区**以及**官方 Discord** 展示——官方原话：「**我们很想看看你建了什么！**（We'd love to see what you've built!）」**Extra credit（三条）**：**允许在聊天中发送图片**；**加好友列表**——用户可以添加其他用户并**看到谁在线**（官方给了**替代方案**：「加一个**用户列表**显示哪些用户**当前在线**」——同一件事，但可能**少一两步**，因为不需要「加好友」这个动作）；**允许用户创建群聊并在群里发消息**（group chats）。",
      "understand": [
        "能说出本项目的最小核心功能集（官方 At a minimum）：授权、给另一个用户发消息、自定义用户资料——三件都有现成课程支撑（Passport 认证章 + Blog API 的 JWT/会话 + 表单与数据库建模）",
        "能解释官方边界说明的完整逻辑：REST 是请求-响应模式、服务器只能响应请求 → 发送者发消息后服务器无法自动通知接收者（接收者没有请求那份数据）→ 实时更新方法课程还没教 → 不指望实现；收消息靠接收方主动请求（刷新/轮询即合格）",
        "能完成官方三连问的规划：用户界面长什么样、数据模型长什么样（users/messages 关系、群聊则是多对多）、需要哪些库（Express/Prisma/Passport 等）——规划先行是官方第 ② 条独立任务",
        "能对照 Extra credit 三条说出各自的增量难度：图片消息（File Uploader 课的 multer/云存储直接复用）、在线状态（需要「谁在线」的判定机制）、群聊（消息-用户多对多建模）；官方对好友列表给了少一两步的替代方案（纯用户在线列表）",
        "能保持范围纪律：官方明说那些应用有整个团队在做、不该把功能做过头——最小核心先完整跑通再谈扩展"
      ],
      "terms": [
        {
          "en": "real time updates（实时更新）",
          "zh": "官方明确不在要求内的能力：REST 请求-响应模式下服务器无法主动推送——收消息靠接收方请求；WebSocket 类技术课程还没教"
        },
        {
          "en": "request-response（请求-响应）",
          "zh": "REST API 的工作模式：服务器只能响应请求——本项目边界说明的理论根基"
        },
        {
          "en": "Authorization（授权）",
          "zh": "最小核心功能之一：认证课全套（注册/登录/会话或 JWT）的直接落地"
        },
        {
          "en": "group chats（群聊）",
          "zh": "Extra credit 之三：消息与用户的多对多建模——核心功能跑通后的扩展方向"
        }
      ],
      "tasks": [
        "记住那些聊天应用有整个开发者团队在做——不该觉得需要把功能做过头；但至少（At a minimum）应用应包含核心功能：授权（Authorization）、给另一个用户发消息、自定义用户资料",
        "花些时间规划你的应用：用户界面长什么样？数据模型长什么样？需要用到哪些库？",
        "从在后端与前端实现核心功能开始建应用——官方边界说明：REST API 后端无法处理实时更新（请求-响应模式，服务器只能响应请求；发送者发消息后无法自动通知接收者），实时更新方法课程还没教、不指望实现——收消息靠接收方主动请求（刷新或轮询）",
        "把应用部署上线，在课页下方的提交区以及官方 Discord 展示——「我们很想看看你建了什么！」"
      ],
      "quiz": [
        {
          "question": "官方说 REST API 后端「无法处理实时更新」——把这条边界说明的完整逻辑链讲清楚。",
          "answer": "REST 是请求-响应（request-response）模式：服务器只能响应请求，不能主动推送。一个用户给另一个用户发消息时，接收者的浏览器没有发出任何请求——服务器无法自动通知它。真正的实时更新（服务器主动推给客户端）需要 WebSocket 这类技术，官方明说课程还没教（特别是前后端分离场景），所以不指望在这个应用里实现。合格做法：收消息靠接收方主动请求——刷新页面或定时轮询消息端点。"
        },
        {
          "question": "本项目的最小核心功能集是什么？各自靠哪些已学课程支撑？",
          "answer": "官方 At a minimum 三件：① 授权（Authorization）——身份认证章全套：Passport 注册登录会话，或 Blog API 课的 JWT 方案；② 给另一个用户发消息——消息建模（sender/receiver/content/时间戳，Prisma 关系）+ REST 端点（POST 发、GET 收）；③ 自定义用户资料——users 模型扩展 + 表单课的处理与校验。官方压预期：那些应用有整个团队在做，不该把功能做过头——最小核心完整跑通优先。"
        },
        {
          "question": "Extra credit 的「好友列表」与官方给的替代方案差在哪？",
          "answer": "好友列表版：用户可以添加其他用户为好友，并看到谁在线——需要好友关系的建模（用户-用户多对多）+ 添加动作 + 在线状态判定。替代方案：只加一个用户列表显示哪些用户当前在线——官方原话「同一件事，但可能少一两步，因为不需要加好友这个动作」。共同的新知识点都是「在线状态」的判定机制；替代方案把好友关系建模省掉了。"
        },
        {
          "question": "官方第 ② 条要求规划时回答哪三个问题？这个项目为什么尤其需要先规划？",
          "answer": "三连问：用户界面长什么样？数据模型长什么样？需要用到哪些库？尤其需要先规划的原因：聊天应用的数据模型有多个可选形态——私信是一对一关系，做了群聊 Extra credit 就变成消息-用户多对多；在线状态、已读与否等特性都会改模型。先用纸面把 users/messages（以及可能的 groups/memberships）关系定下来，比写完再迁移库便宜得多——这也是 Where's Waldo 第 1 步「白板想清楚」的同款纪律。"
        }
      ],
      "optional": [],
      "note": "Project 红线课：本站不提供成品代码，examples 为空数组——数据模型、界面、消息流全部自己设计。这是全站第 32 门 Project 课、World 7 第 8 门，也是全站第 9 门零外部资料课（官方全文约 2KB、正文与 Assignment 无任何外部链接——所需能力全部来自已学课程）。官方 Markdown 住在 react/react_and_the_backend/ 目录（与 Where's Waldo 同为跨路径共用课）。本课最重要的认知是官方边界说明：REST 无法实时推送、不要求实现——刷新或轮询即合格。",
      "why": "「做个聊天应用」听起来要有实时技术才够格——官方偏偏用它来上一堂范围管理课：REST 的请求-响应边界说清楚、实时更新明确不要求、最小核心三件圈死，剩下的自由全部留给你。这模拟了真实工作的常见形态：需求简短（全文 2KB）、技术边界明确（不许过度设计）、交付标准是核心功能完整可部署。做完它你会对「哪些功能是当前技术栈的自然产物、哪些要等新技术」有体感——这正是工程师区别于教程跟随者的判断力。",
      "sections": [
        {
          "h": "项目一句话：你自己的聊天应用",
          "p": [
            "建一个让用户互发消息的 Web 应用——想想你最喜欢的聊天应用（Discord、Telegram、WhatsApp、Facebook Messenger、AOL Instant Messenger 等），想象如果你能建一个自己的会是什么样。",
            "官方全文极短（约 2KB），正文与 Assignment 没有任何外部链接——所需的一切都在已学课程里；本站按零外部资料课登记。"
          ]
        },
        {
          "h": "最小核心功能集（官方压预期）",
          "p": [
            "官方先压预期：那些应用有整个开发者团队在做——不该觉得需要把功能做过头（go overboard）。",
            "但至少（At a minimum）应用应包含三件核心功能：授权（Authorization）、给另一个用户发消息、自定义用户资料（Customizing a user profile）。",
            "三件都有现成课程支撑：Passport/JWT 认证、消息的 Prisma 建模与 REST 端点、用户资料表单。"
          ]
        },
        {
          "h": "规划三连问（第 ② 条）",
          "p": [
            "官方第 ② 条是独立的规划任务：用户界面长什么样？数据模型长什么样？需要用到哪些库？",
            "聊天应用的数据模型有多个可选形态：私信是一对一；做群聊 Extra credit 就变成消息-用户多对多；在线状态、已读等特性都会改模型——纸面先定 users/messages（及可能的 groups）关系，比写完再迁移库便宜得多。"
          ]
        },
        {
          "h": "REST 的实时边界（官方最重要的认知说明）",
          "p": [
            "官方随第 ③ 条附带：你可能已意识到 REST API 后端无法处理实时更新——它是请求-响应模式，服务器只能响应请求。",
            "发送者发消息后，REST API 无法自动通知接收者——接收者没有请求那份数据；服务器-客户端实时更新的方法（特别是前后端分离场景）课程还没教，不指望实现。",
            "合格做法：收消息靠接收方主动请求——刷新页面或定时轮询消息端点；WebSocket 类实时推送不在本课要求内。"
          ]
        },
        {
          "h": "部署展示与 Extra credit",
          "p": [
            "第 ④ 条：部署上线，在课页下方提交区以及官方 Discord 展示——「我们很想看看你建了什么！」",
            "Extra credit 三条：聊天发图片（File Uploader 课的 multer/云存储直接复用）；好友列表+在线状态（官方替代方案：纯用户在线列表，少一两步）；群聊（消息-用户多对多建模）。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "为了「像真聊天」硬上 WebSocket",
          "text": "官方边界说明写得明明白白：实时更新方法课程还没教、不指望你实现。硬上没学过的实时技术，调试成本会吞掉整个项目；刷新或轮询收消息是完全合格的答案——先把最小核心三件做完整，有余力再按 Extra credit 的阶梯走。"
        },
        {
          "title": "功能做过头，核心没跑通",
          "text": "官方开场就压预期：那些应用有整个团队在做，不该觉得需要把功能做过头。已读回执、表情回应、消息撤回这类特性都是团队级功能——最小核心（授权/发消息/用户资料）没有完整可部署之前，每加一个特性都在推迟交付。"
        },
        {
          "title": "数据模型不留群聊余地",
          "text": "Extra credit 的群聊要求消息与用户多对多：如果一开始 messages 表把 receiver 写成单列外键，后补群聊就要迁移表结构。规划三连问（第 ② 条）时把「会不会做群聊」想清楚：要么一开始就按 membership 关系建模，要么接受迁移成本——有意识的决定好过事后惊讶。"
        },
        {
          "title": "「谁在线」用客户端心跳糊弄",
          "text": "好友列表 Extra credit 的在线状态需要服务端判定：浏览器定时上报心跳、服务器按最近活跃时间窗判定在线——把「在线」写死或只信客户端声明，列表会全是假状态。官方替代方案（纯用户列表）少一两步正在于省掉好友关系，但在线判定这一步省不掉。"
        }
      ],
      "official": {
        "assignment": [
          "记住那些应用有整个开发者团队在做——不该把功能做过头；但至少包含核心功能：授权（Authorization）、给另一个用户发消息、自定义用户资料",
          "花时间规划：用户界面长什么样？数据模型长什么样？需要哪些库？",
          "从在后端与前端实现核心功能开始建应用；官方边界说明：REST API 无法处理实时更新（请求-响应模式、服务器只能响应请求），实时更新方法课程还没教、不指望实现",
          "部署上线，在提交区与官方 Discord 展示——「我们很想看看你建了什么！」"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "Extra credit：允许在聊天中发送图片",
          "Extra credit：加好友列表（添加用户并看到谁在线）；替代方案：用户列表显示当前在线用户（少一两步，无需加好友动作）",
          "Extra credit：允许用户创建群聊并在群里发消息"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 react/react_and_the_backend/project_messaging_app.md（课页 edit 链接实证：本课官方 Markdown 住在 react 课程目录，是 nodejs 课程「全栈项目」章与 react 课程的跨路径共用课；本站自行编写简体讲解与任务拆解，未改编自任何第三方中文课程；Project 红线：不提供成品答案）",
        "sha256": "7c4f9980e7a652f1fa4fd07a52445e10424ce6cbb63f1e8c40e86837757a173e",
        "verifiedAt": "2026-09-29"
      }
    },
    {
      "id": "node-path-nodejs-odin-book",
      "title": "Project: Odin-Book",
      "zh": "项目：Odin-Book",
      "group": 7,
      "url": "https://www.theodinproject.com/lessons/node-path-nodejs-odin-book",
      "summary": "「最终项目」章第一门（全站第 33 门 Project 课）：World 7 的收官大项目——建一个社交媒体站点克隆（Facebook、X、Myspace 或 Threads 任选）。官方开场：你已经走了很远，恭喜！此刻你应该能自如地新建 Express 应用、用 PostgreSQL 建模与存储数据；这个项目要求你把全部知识拿出来检验——「不会很容易，但应该完全在你的能力范围内，而且它会是一件很棒的作品集（portfolio piece）」。官方范围界定：像之前的课一样，样式与前端想投入多少由你——**重要的是数据与后端**；你要搭出平台的核心特性：用户、个人资料、帖子、关注（following）与「点赞」（liking）。认证官方口径：要实现某种形式的认证——理想情况是用 passport.js 支持**经由你所克隆的社交媒体站点本身认证**，但有些站点（如 Facebook）近来已让这个过程变得不可能；若如此，可以用 passport.js 支持用户名+密码（passport-local）或经由 GitHub（passport-github2）认证。官方明确豁免：可能有些你没接触过的特性——聊天、实时更新、通知；**除非你此刻对自己的技能非常有信心，否则不用负责这些**（官方举例：socket.io 可以用 websockets 做实时通信）。Assignment 结构为「Getting started 四条 + Requirements 十二条 + Extra credit 四条」。Getting started：① 想清楚要做什么——提前把计划写在纸或白板上非常有帮助！此刻几小时的思考能省下几天的编码；试着把**一切**都铺出来；规划的重要部分是 **scope（范围）**：你显然建不出整个网站（那大概花了整个工程团队数年），所以要识别站点的**核心功能**与「**锦上添花**（nice-to-have）」的东西；**确保先完成核心功能再做其余**——试图一次做全部会让你迷失与挫败，「相信我们，一切都比你预期的花更长时间」。② 想清楚让它跑起来所需的**数据架构**：模型很多、它们之间的关系**比你之前做过的任何东西都复杂**—— diving in 之前花时间规划你的路径。③ 沿着下面的清单往下做！每一步都会涉及新挑战，但你有工具。④ 可以用 npm 的 **Faker** 模块（faker-js/faker）灌假数据（用户与帖子等）：新建一个 **seeds.js** 文件，导入你的 Prisma 模型、用 faker 模块生成并保存一大堆新用户。Requirements 十二条（官方口径：这是一份非常全局（global）的功能清单——项目开放性所致，未必条条适用于你选的站点，你的站点也可能有清单没提的核心特性）：1. 用户必须登录才能看到除登录页以外的任何东西（登录墙）；2. 用户应能用你选择的认证方式登录；3. 用户可以向其他用户发送关注请求（follow requests）；4. 用户可以创建帖子（从纯文本开始）；5. 用户可以点赞帖子；6. 用户可以评论帖子；7. 帖子应始终显示内容、作者、评论与点赞；8. 应有一个帖子 index 页，显示当前用户与其关注的人的全部近期帖子（关注流）；9. 用户可以创建带**头像（profile picture）**的个人资料——取决于你怎么做认证（例如经由 passport-github2），也许能直接用其账号已有的头像；不行的话可以用 **Gravatar** 生成；10. 用户的资料页应包含其资料信息、头像与帖子；11. 应有一个用户 index 页，显示全部用户，并对「尚未关注或没有待处理请求」的用户给出发送关注请求的按钮；12. 把应用部署到你选择的托管商！Extra credit 四条：① 让帖子也能带图片（经由 URL 或上传）——官方回指 File Uploader 项目：你可能记得 **Cloudinary** 或 **Supabase storage** 是托管用户上传图片的好选项；它们给你的 **URL 可以存进数据库**，代替原始图片二进制数据；② 允许用户更新头像；③ 创建 **guest sign-in（访客登录）**功能——让访客**不用创建账号或提供凭据**就能绕过登录屏；官方给了强理由：「如果你打算把这个项目放进简历——**多数招聘者、招聘经理等不会花时间创建账号**；这个功能让他们不必经过繁琐的注册过程就能看到你的辛苦成果」；④ 把它变好看！（Make it pretty!）",
      "guide": "以下是官方项目要求的中文化梳理。**红线**：本站不提供成品代码——数据架构、认证方案、全部十二条 Requirements 的实现都自己做。**项目一句话**：建一个**社交媒体站点克隆**——Facebook、X、Myspace 或 Threads 任选；这是 World 7 的**收官大项目**，官方定位「**很棒的作品集（portfolio piece）**」。**官方开场**：你已经走了很远，恭喜！此刻你应该能**自如地新建 Express 应用、用 PostgreSQL 建模与存储数据**；这个项目要求你把**全部知识拿出来检验**——「**不会很容易，但应该完全在你的能力范围内**」。**范围界定（官方明说）**：像之前的课一样，**样式与前端想投入多少由你——重要的是数据与后端**；要搭出平台的**核心特性**：**用户、个人资料、帖子、关注（following）与「点赞」（liking）**。**认证口径**：要实现**某种形式的认证**——**理想情况**是用 passport.js 支持**经由你所克隆的社交媒体站点本身认证**；但有些站点（如 **Facebook**）近来已让这个过程**不可能**；若如此，用 passport.js 支持**用户名+密码（passport-local）**或**经由 GitHub（passport-github2）**。**官方豁免（别给自己加戏）**：可能有些你**没接触过**的特性——**聊天、实时更新、通知**；**除非你此刻对自己的技能非常有信心，否则不用负责这些**——官方举例：**socket.io** 可以用 websockets 做实时通信（仅供知道，不是要求）。**Assignment 官方总纲**：建一个社交媒体站点！你将在此项目里构建所选站点**核心用户功能的大部分**；不必担心花哨的前端（除非你想）——**没有它们也能得到好的用户体验**；这个项目给你机会把一份**相对高层的需求集**变成**能跑的网站**；你需要**自己做一些研究**、**读几个将用模块的文档**。**Getting started（四条）**：**①** 想清楚要做什么——**提前把计划写在纸或白板上**非常有帮助！**此刻几小时的思考能省下几天的编码**；试着把**一切（ALL）**都铺出来。规划的重要部分是 **scope（范围）**：你显然**建不出整个网站**（那大概花了**整个工程团队数年**）——要识别站点的**核心功能**与「**锦上添花**（nice-to-have）」的东西；**确保先完成核心功能再做其余**——试图一次做全部会让你**迷失与挫败**；「**相信我们。一切都比你预期的花更长时间。**」**②** 想清楚让它跑起来所需的**数据架构（data architecture）**：**模型很多、它们之间的关系比你之前做过的任何东西都复杂**——**动手（diving in）之前花时间规划你的路径**。**③** **沿着下面的清单往下做**！每一步都会涉及**新挑战**，但**你有工具**。**④** 用 **Faker** 模块（npm，faker-js/faker）**灌假数据**：用户与帖子都可以——新建一个 **seeds.js** 文件，**导入你的 Prisma 模型**、用 faker **生成并保存一大堆新用户**。**Requirements（十二条）**——官方口径：这是一份**非常全局（global）的功能清单**；项目开放性所致，**未必条条适用**于你选的站点，你的站点也可能有**清单没提的核心特性**：**1.** 用户**必须登录**才能看到**除登录页以外的任何东西**（登录墙）；**2.** 用户应能用**你选择的认证方式**登录；**3.** 用户可以向其他用户**发送关注请求（follow requests）**；**4.** 用户可以**创建帖子**（**从纯文本开始**）；**5.** 用户可以**点赞帖子**；**6.** 用户可以**评论帖子**；**7.** 帖子应**始终显示**：内容、作者、评论与点赞；**8.** 应有一个**帖子 index 页**——显示**当前用户与其关注的人**的全部**近期帖子**（关注流）；**9.** 用户可以创建带**头像（profile picture）的个人资料**——取决于认证方式（例如 passport-github2 也许能直接用其账号已有头像）；不行就用 **Gravatar** 生成；**10.** 用户的**资料页**应包含：资料信息、头像与帖子；**11.** 应有一个**用户 index 页**——显示全部用户，并对「**尚未关注**或**没有待处理请求**」的用户给出**发送关注请求的按钮**；**12.** **部署**到你选择的托管商！**Extra credit（四条）**：**①** 帖子也能**带图片**（经由 URL 或上传）——官方回指 **File Uploader 项目**：你可能记得 **Cloudinary** 或 **Supabase storage** 是托管用户上传图片的好选项；它们给你的 **URL 存进数据库**、代替原始图片二进制数据；**②** 允许用户**更新头像**；**③** 创建 **guest sign-in（访客登录）**——让访客**不用创建账号或提供凭据**就绕过登录屏；官方给了强理由：「如果你打算把这个项目放进**简历**——**多数招聘者、招聘经理等不会花时间创建账号**；这个功能让他们**不必经过繁琐的注册过程**就能看到你的辛苦成果」；**④** **把它变好看！（Make it pretty!）**",
      "understand": [
        "能说出本项目的官方定位与范围纪律：World 7 收官大项目、「很棒的作品集」；样式与前端投入自定、**重要的是数据与后端**；核心特性五件——用户、个人资料、帖子、关注、点赞；聊天/实时更新/通知明确豁免（除非你非常有信心）",
        "能解释 scope 规划的官方方法论：建不出整个网站（整个团队数年的产物）——识别核心功能 vs 锦上添花；先完成核心再做其余；「几小时的思考省下几天的编码」「一切都比你预期的花更长时间」",
        "能设计本项目的数据架构并说明它为什么是全站最复杂：users（资料+头像）、posts（文本，EC 后含图片 URL）、comments、likes（用户-帖子多对多）、follow requests（用户-用户多对多、有待处理/已接受状态）——官方原话「模型很多、关系比你之前做过的任何东西都复杂」",
        "能选择认证方案并说出官方层级：理想是经由所克隆站点本身认证（passport 对应策略）；Facebook 等已不可能时退到 passport-local（用户名+密码）或 passport-github2（GitHub）；登录墙（Requirement 1）是全站第一条硬性要求",
        "能解释 seeds.js + Faker 的作用与 guest sign-in 的求职逻辑：假数据（用户与帖子）让关注流、资料页、用户 index 有东西可显示、可演示；访客登录让招聘者不注册就能看到成果——官方明说这是为「放进简历」准备的关键特性"
      ],
      "terms": [
        {
          "en": "scope（范围）",
          "zh": "官方规划方法论的核心词：识别核心功能 vs 锦上添花（nice-to-have），先完成核心再做其余——「试图一次做全部会让你迷失与挫败」"
        },
        {
          "en": "follow requests（关注请求）",
          "zh": "Requirement 3/11 的主角：用户-用户的关系，有发送、待处理、接受的状态机——数据架构里最复杂的一块"
        },
        {
          "en": "passport-local / passport-github2",
          "zh": "官方认证退路的两个策略：用户名+密码 / 经由 GitHub；理想情况是经由所克隆站点本身认证（Facebook 等已不可能）"
        },
        {
          "en": "Faker / seeds.js",
          "zh": "假数据方案：npm 的 faker-js/faker 模块 + 新建 seeds.js 导入 Prisma 模型生成并保存大量用户与帖子——演示与自测的弹药"
        },
        {
          "en": "Gravatar",
          "zh": "头像生成服务：认证方式拿不到现成头像时的官方建议（按邮箱生成全局头像）"
        },
        {
          "en": "guest sign-in（访客登录）",
          "zh": "Extra credit 3：不注册不提供凭据绕过登录墙——官方理由：招聘者不会花时间注册，简历项目必须让他们一眼看到成果"
        }
      ],
      "tasks": [
        "（Getting started 1）想清楚要做什么：提前把计划写在纸或白板上——此刻几小时的思考能省下几天的编码，试着把一切都铺出来；规划的重要部分是 scope：你建不出整个网站（整个工程团队数年的产物），要识别核心功能与「锦上添花」的东西；确保先完成核心功能再做其余——试图一次做全部会让你迷失与挫败，「相信我们，一切都比你预期的花更长时间」",
        "（Getting started 2）想清楚数据架构：模型很多、它们之间的关系比你之前做过的任何东西都复杂——动手之前花时间规划你的路径",
        "（Getting started 3）沿着 Requirements 清单往下做——每一步都会涉及新挑战，但你有工具",
        "（Getting started 4）用 Faker 模块（faker-js/faker）灌假数据：新建 seeds.js 文件，导入你的 Prisma 模型，用 faker 生成并保存一大堆新用户（帖子同理）",
        "（Requirement 1-2）用户必须登录才能看到除登录页以外的任何东西（登录墙）；用户应能用你选择的认证方式登录（理想：经由所克隆站点本身；不行则 passport-local 或 passport-github2）",
        "（Requirement 3）用户可以向其他用户发送关注请求（follow requests）",
        "（Requirement 4-6）用户可以创建帖子（从纯文本开始）；可以点赞帖子；可以评论帖子",
        "（Requirement 7-8）帖子应始终显示内容、作者、评论与点赞；应有帖子 index 页——显示当前用户与其关注的人的全部近期帖子（关注流）",
        "（Requirement 9-10）用户可以创建带头像的个人资料（认证方式允许就直接用其账号头像，否则用 Gravatar 生成）；资料页应包含资料信息、头像与帖子",
        "（Requirement 11）应有用户 index 页：显示全部用户，并对尚未关注或没有待处理请求的用户给出发送关注请求的按钮",
        "（Requirement 12）把应用部署到你选择的托管商！"
      ],
      "quiz": [
        {
          "question": "官方为什么把「scope 规划」放在 Getting started 第一条，还用了「相信我们」这样的措辞？",
          "answer": "因为社交媒体克隆是全站范围最大的项目：真正的 Facebook 是「整个工程团队数年」的产物，一次想全做必然迷失与挫败——「一切都比你预期的花更长时间」是官方的经验之谈（「相信我们」）。方法论：纸或白板把一切铺出来 → 区分核心功能与锦上添花 → 先完成核心再做其余；「此刻几小时的思考能省下几天的编码」。第二条紧接着数据架构规划也是同一逻辑：模型关系是全站最复杂，动手前必须想清楚。"
        },
        {
          "question": "本项目认证方案的官方层级是什么？登录墙指哪条 Requirement？",
          "answer": "三层：理想情况——用 passport.js 支持经由你所克隆的社交媒体站点本身认证；现实退路——有些站点（如 Facebook）近来已让这个过程不可能，此时用 passport-local（用户名+密码）或 passport-github2（经由 GitHub）；底线要求——Requirement 1 的登录墙：用户必须登录才能看到除登录页以外的任何东西。另注意 Extra credit 3 的 guest sign-in 是给招聘者的受控例外，不是拆掉登录墙。"
        },
        {
          "question": "数据架构里官方点名的复杂点是什么？大致会有哪些模型和关系？",
          "answer": "官方原话：「模型很多，它们之间的关系比你之前做过的任何东西都复杂。」按十二条 Requirements 推导：users（资料信息、头像）、posts（纯文本起步，EC 后含图片 URL）、comments（帖子-用户）、likes（用户-帖子多对多）、follow requests（用户-用户多对多，且有「待处理/已接受」状态——Requirement 11 的按钮要对「尚未关注或没有待处理请求」的用户显示）；关注流（Requirement 8）= 当前用户 + 其关注的人的帖子聚合查询。seeds.js + Faker 给这套模型灌演示数据。"
        },
        {
          "question": "官方为什么强烈建议做 guest sign-in 这个 Extra credit？它和 Requirement 1 的登录墙矛盾吗？",
          "answer": "官方理由写得非常直白：如果你打算把项目放进简历——多数招聘者、招聘经理不会花时间创建账号；guest sign-in 让他们不必经过繁琐注册就能看到你的辛苦成果。这是求职导向的工程决策：作品集项目的「观众」是没时间注册的招聘者。它与登录墙不矛盾：登录墙仍是默认态（Requirement 1），访客登录是一条受控的绕过通道（一键进入只读演示账号之类），实现方式自己设计——但普通用户体系与权限逻辑不变。"
        },
        {
          "question": "官方明确豁免了哪些特性？为什么这个豁免清单对项目成功很重要？",
          "answer": "聊天、实时更新、通知——官方原话：「除非你此刻对自己的技能非常有信心，否则不用负责这些」（并举例 socket.io 可以做实时通信，仅供知道）。豁免清单的重要性正是 scope 纪律的另一面：这三样都需要课程没教的技术（WebSocket/推送），自行加戏会把项目拖进未知领域——而「先完成核心功能再做其余」要求把精力压在十二条 Requirements 上。官方对前端投入也是同一口径：重要的是数据与后端，样式想做多少由你。"
        }
      ],
      "optional": [],
      "note": "Project 红线课：本站不提供成品代码，examples 为空数组——数据架构、认证方案、十二条 Requirements 全部自己实现。这是全站第 33 门 Project 课、World 7 第 9 门，也是 World 7 与整条 NodeJS 路径的收官大项目（官方定位「很棒的作品集」）。官方豁免清单（聊天/实时/通知）与 scope 方法论是本项目最重要的两条纪律；Extra credit 3 的 guest sign-in 带着明确的求职理由——它是 World 8 求职课的直接伏笔。",
      "why": "这是 NodeJS 路径的毕业答辩：认证章（登录墙+passport 策略）、ORM 章（Prisma 建模+seeds.js）、API 章（如果需要）、Express 全套（路由/控制器/视图/表单/部署）在一个真实尺度的项目里全部上场——数据架构的复杂度（多对多关注、点赞、评论、状态机）远超之前任何一课。官方还罕见地给了求职视角：作品集定位 + guest sign-in 让招聘者零门槛看成果。做完它，你就走完了 conclusion 课说的「全栈开发者」的最后一里路。",
      "sections": [
        {
          "h": "项目一句话：社交媒体克隆与作品集定位",
          "p": [
            "建一个社交媒体站点克隆——Facebook、X、Myspace 或 Threads 任选；World 7 收官大项目，官方定位「不会很容易，但应该完全在你的能力范围内，而且它会是一件很棒的作品集（portfolio piece）」。",
            "范围界定（官方明说）：样式与前端想投入多少由你——重要的是数据与后端；核心特性五件：用户、个人资料、帖子、关注（following）与「点赞」（liking）。",
            "官方总纲：这个项目给你机会把一份相对高层的需求集变成能跑的网站；你需要自己做一些研究、读几个将用模块的文档。"
          ]
        },
        {
          "h": "认证方案与官方豁免",
          "p": [
            "认证层级：理想是用 passport.js 支持经由你所克隆的站点本身认证；有些站点（如 Facebook）近来已让这不可能——退到 passport-local（用户名+密码）或 passport-github2（经由 GitHub）。",
            "官方豁免：聊天、实时更新、通知——「除非你此刻对自己的技能非常有信心，否则不用负责这些」（socket.io 可做实时通信，举例仅供知道，不是要求）。"
          ]
        },
        {
          "h": "Getting started：scope 方法论与数据架构",
          "p": [
            "第 1 条是全站最重的规划纪律：纸或白板把一切铺出来——此刻几小时的思考能省下几天的编码；scope=识别核心功能 vs 锦上添花；先完成核心再做其余——「相信我们。一切都比你预期的花更长时间。」",
            "第 2 条：数据架构——官方原话「模型很多，它们之间的关系比你之前做过的任何东西都复杂」，动手前花时间规划路径。",
            "第 3 条：沿 Requirements 清单往下做——每步都有新挑战，但你有工具。第 4 条：Faker（faker-js/faker）+ seeds.js 灌假数据——导入 Prisma 模型，生成并保存一大堆用户与帖子。"
          ]
        },
        {
          "h": "Requirements 十二条：从登录墙到部署",
          "p": [
            "1-2：登录墙（必须登录才能看到除登录页以外的任何东西）+ 用你选择的认证方式登录。3：向其他用户发送关注请求。4-6：创建帖子（纯文本开始）、点赞、评论。",
            "7-8：帖子始终显示内容、作者、评论与点赞；帖子 index 页=当前用户与其关注的人的近期帖子（关注流）。",
            "9-10：带头像的个人资料（认证方式允许就用现成头像，否则 Gravatar 生成）；资料页含资料信息、头像与帖子。",
            "11：用户 index 页——全部用户 + 对「尚未关注或没有待处理请求」的用户给发送关注请求按钮。12：部署到你选择的托管商！",
            "官方口径：这是非常全局的清单——开放性项目所致，未必条条适用于你选的站点，你的站点也可能有清单没提的核心特性。"
          ]
        },
        {
          "h": "Extra credit：图片帖、换头像、访客登录、美化",
          "p": [
            "图片帖：URL 或上传——官方回指 File Uploader 项目：Cloudinary 或 Supabase storage 托管用户上传图片，URL 存进数据库代替原始二进制。",
            "更新头像；把它变好看！（Make it pretty!）",
            "guest sign-in（访客登录）：不用创建账号或提供凭据绕过登录屏——官方强理由：打算放进简历的话，多数招聘者、招聘经理不会花时间创建账号；这个功能让他们不必经过繁琐注册就看到你的辛苦成果。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "一次想做全部功能",
          "text": "官方把 scope 写进第一条并罕见地用了「相信我们」：整个团队数年的产物你建不出来——聊天、实时更新、通知官方明确豁免（除非你非常有信心）。先识别核心功能（五特性+十二条 Requirements）、完成后再碰锦上添花；试图一次做全部的结局官方也写了：迷失与挫败。"
        },
        {
          "title": "跳过数据架构直接开写",
          "text": "官方原话：模型很多、关系比你之前做过的任何东西都复杂——关注请求还有「待处理/已接受」状态机，点赞与关注都是多对多。不在动手前把 ER 图画出来，写到 Requirement 8（关注流聚合查询）和 11（按关注状态过滤按钮）时会被迫大规模迁移表结构。seeds.js + Faker 的假数据也依赖模型先定。"
        },
        {
          "title": "登录墙留缝",
          "text": "Requirement 1 是「必须登录才能看到除登录页以外的任何东西」——帖子 index、资料页、用户 index 全部在墙内。常见漏缝：某条 API/路由忘了挂认证中间件，未登录直接可达；guest sign-in 是 Extra credit 的受控例外，不是把墙拆掉的理由。全站性检查一遍每条路由的保护状态再部署。"
        },
        {
          "title": "图片二进制进数据库",
          "text": "Extra credit 1 官方特意回指 File Uploader 项目的结论：Cloudinary/Supabase storage 托管图片、数据库只存 URL——「代替原始图片二进制数据」。头像更新（EC 2）同理。大二进制进库拖垮备份与查询，这个决策你在文件上传站已经练过一次。"
        }
      ],
      "official": {
        "assignment": [
          "（Getting started 1）纸或白板规划：几小时的思考省下几天的编码；scope=核心功能 vs 锦上添花；先完成核心再做其余——「相信我们，一切都比你预期的花更长时间」",
          "（Getting started 2）想清楚数据架构：模型很多、关系比你之前做过的任何东西都复杂——动手前规划路径",
          "（Getting started 3）沿 Requirements 清单往下做：每步有新挑战，但你有工具",
          "（Getting started 4）Faker（faker-js/faker）灌假数据：新建 seeds.js 导入 Prisma 模型，生成并保存大量新用户与帖子",
          "（Requirements 1-12）登录墙；用所选认证方式登录（理想经由所克隆站点本身，不行则 passport-local / passport-github2）；发送关注请求；创建帖子（纯文本开始）；点赞；评论；帖子显示内容/作者/评论/点赞；帖子 index=本人+关注者的近期帖子；带头像的资料（现成头像或 Gravatar）；资料页含信息/头像/帖子；用户 index 带条件化的关注请求按钮；部署",
          "（Extra credit）帖子带图片（Cloudinary/Supabase storage，URL 存库）；更新头像；guest sign-in（招聘者不注册即可看成果）；Make it pretty!"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "Extra credit：帖子带图片——Cloudinary 或 Supabase storage 托管、URL 存进数据库（File Uploader 项目方案回指）",
          "Extra credit：允许用户更新头像",
          "Extra credit：guest sign-in（访客登录）——不用创建账号或提供凭据绕过登录屏；简历项目的求职导向特性",
          "Extra credit：把它变好看！（Make it pretty!）"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/final_project/project_odin_book.md（本站自行编写简体讲解与任务拆解，未改编自任何第三方中文课程；Project 红线：不提供成品答案）",
        "sha256": "f1d640814791c918dcfae448abeecbb83f679f2d22a7679fe19fccd5f496c68d",
        "verifiedAt": "2026-09-29"
      }
    },
    {
      "id": "nodejs-conclusion",
      "title": "Conclusion",
      "zh": "结语",
      "group": 7,
      "url": "https://www.theodinproject.com/lessons/nodejs-conclusion",
      "summary": "NodeJS 课程的结语课（官方原文约 5.9KB）：一封祝贺信 + 下一步方向指引，不教新材料。官方开场：你已经到达本课程范围的终点，应该为自己的 NodeJS 技能感觉相当不错——这不意味着你已经理解了一切，但你现在能构建**在真实世界里真正有用**的那类功能的 NodeJS 应用了；「毕竟，你刚建了一个社交媒体站点！」这不是课程的最后一门——还剩 Getting Hired（求职）课程；但你现在已处于可以自称为「**全栈（full stack）开发者**」的阶段：你学会了给应用写漂亮直观的前端，又学了后端技术给站点加上很酷的功能；尽管走了这么远，接下来取决于你**继续构建东西、提问、深挖 NodeJS 与软件工程最佳实践**。官方对「头六个月」的判断：此刻你已握有 NodeJS 与 Express 的**积木（building blocks）**；作为全栈 JavaScript 开发者工作的**头六个月**里，你将学到**与你刚学完的一样多**的信息——因为本课程的要点就是把这些积木装进你体内，你已处在**真正能拿到第一份工作**并在所知之上继续建造的位置。**Next steps（官方明说本课不教新材料，只指方向；也可以收藏它、想看看 NodeJS 之路下一步去哪时回来）**：Node 有极庞大的生态与写法灵活性——一百万零一种工具与包可以装进 Express 应用；官方口径：**作为开发者成长、沉浸生态的最好方式是给一家用 NodeJS 的公司工作、拿薪水学习**；如果这不是选项，**自己构建东西 + 业余时间阅读**是很好的替代——博客、Stack Overflow、播客每天都有新信息产生。很好的第一步：**从头到尾通读 NodeJS 文档与 ExpressJS 文档**。三个深挖方向：**Security（安全）**——开始做更多面向公众的应用后安全会越来越重要，ExpressJS 文档有进阶的安全最佳实践（best-practice-security）；**Caching（缓存）**——缓存通过减少数据库调用让应用更快，如果你所在地区的职位招聘或缓存资料里常见 **Redis**，可以认识一下它；**Non-relational data（非关系数据）**——已经接触过关系数据库 PostgreSQL，可以考虑其他类型即非关系数据库；理解两种类型及各自适用场景能让你走得更远——「毕竟，不是每个问题都需要锤子（not every problem requires a hammer）」；**MongoDB** 是非关系数据库的流行选择，**Learn MongoDB 网站**（learn.mongodb.com）提供入门教程与文档。**Other resources（六条，官方定位「更深入软件架构、JavaScript 与 Node」）**：基于 Express 的更多框架（官方链 web.archive 存档页——expressjs.com/en/resources/frameworks.html 已存档）；更多关于 API 如何工作的视频（YouTube oBW_VNg4qD0）；《Design Patterns: Elements of Reusable Object-Oriented Software》——面向对象设计模式的经典书（Amazon 链接）；《Clean Code》——学习编写可读可维护代码的原则（Amazon 链接）；syntax.fm Podcast——覆盖 Web 开发的播客；NodeJS Blog——官方 NodeJS 博客。官方还邀请：如果你觉得有什么该加进这个清单，欢迎去 TOP curriculum GitHub 仓库改进本课。**Contributing（贡献）节**：「你知道的比你以为的多」——还记得我们刚说要继续构建东西吗？这套课程**完全开源**、需要你的帮助来改进；有一群现役与往届学生专门帮忙加功能与校对课程；最棒的是它**完全公开且免费**，你可以按自己舒服的任何程度围观或参与；这也是开始学习**敏捷开发方法论（agile development methodologies）**、在友好支持的环境里开始做**有意义的开发工作**的好途径。**Conclusion 节**：官方再次强调——**学习永远不会真正停止**，但你也已经走了很远；保持好状态，**刷完 Getting Hired 课程**，准备好开始求职！**Assignment 两条**：① 看 Express 文档的缓存节（best-practice-performance#cache-request-results）。② 访问官方 Discord 服务器看看我们在做什么——「我们很希望你参与进来！」",
      "guide": "以下是官方结语课的中文化梳理。**这是一封祝贺信 + 方向指引，不教新材料**（官方明说：这最后一课不是设计来明确教新材料的，只在你继续前行前指个方向；也可以**收藏它**、想看 NodeJS 之路下一步去哪时回来）。**① 祝贺与定位**：你已经到达**本课程范围的终点**，应该为自己的 NodeJS 技能**感觉相当不错**——这不意味着你已理解一切，但你现在能构建**在真实世界里真正有用**的那类功能的 NodeJS 应用了；官方原话：「**毕竟，你刚建了一个社交媒体站点！**」（Odin-Book）。这**不是课程的最后一门**——还剩 **Getting Hired（求职）课程**；但你已处于可以自称为「**全栈（full stack）开发者**」的阶段：学会了写**漂亮直观的前端**，又学了**后端技术**给站点加很酷的功能。尽管走了这么远，接下来**取决于你**：继续构建东西、提问、深挖 NodeJS 与软件工程最佳实践。**② 头六个月的判断**：此刻你已握有 NodeJS 与 Express 的**积木（building blocks）**；作为全栈 JavaScript 开发者工作的**头六个月**，你将学到**与你刚学完的一样多**的信息——因为本课程的要点就是**把这些积木装进你体内**；你已处在**真正能拿到第一份工作**、并在所知之上继续建造的位置。**③ Next steps 总纲**：Node 有**极庞大的生态**与写法灵活性——「**一百万零一种**工具与包」可以装进 Express 应用。官方口径（很实在）：**作为开发者成长、沉浸生态的最好方式，是给一家用 NodeJS 的公司工作、拿薪水学习**；如果这不是选项，**自己构建东西 + 业余时间阅读**是很好的替代——**博客、Stack Overflow 帖子、播客**每天都有新信息产生。**很好的第一步**：**从头到尾通读 NodeJS 文档与 ExpressJS 文档**（front-to-back read）。**④ 三个深挖方向**：**Security（安全）**——开始做更多**面向公众（public-facing）**的应用后，安全会**越来越重要**；ExpressJS 文档包含进阶的**安全最佳实践**（best-practice-security）。**Caching（缓存）**——缓存通过**减少数据库调用**让应用更快；如果你**所在地区的职位招聘**或遇到的缓存资料里常见 **Redis**，可以认识一下它。**Non-relational data（非关系数据）**——已接触过关系数据库 PostgreSQL，可以考虑**其他类型的数据库，即非关系数据库**；理解两种类型与各自适用场景能让你**走得更远**——官方金句：「**毕竟，不是每个问题都需要锤子**（not every problem requires a hammer）」；**MongoDB** 是非关系数据库的**流行选择**；**Learn MongoDB 网站**（learn.mongodb.com）提供入门教程与文档。**⑤ Other resources（六条，官方定位：更深入软件架构、JavaScript 与 Node）**：**基于 Express 的更多框架**（可能更适合构建某些类型的应用；官方链 web.archive 存档页——原 frameworks 页已存档）；**更多关于 API 如何工作**的视频；**《Design Patterns: Elements of Reusable Object-Oriented Software》**——面向对象设计模式的**经典书**；**《Clean Code》**——学习编写**可读可维护代码**的原则；**syntax.fm Podcast**——覆盖 Web 开发的播客；**NodeJS Blog**——官方 NodeJS 博客。官方邀请：觉得有什么该加进清单，欢迎去 **TOP curriculum GitHub 仓库**改进本课。**⑥ Contributing（贡献）**：「**你知道的比你以为的多**（You know more than you think）」——还记得刚说要继续构建东西吗？这套课程**完全开源**、需要你的帮助来改进；有一群**现役与往届学生**专门帮忙**加功能与校对**；最棒的是它**完全公开且免费**——你可以按自己舒服的**任何程度**围观或参与；这也是开始学习**敏捷开发方法论（agile development methodologies）**、在**友好支持的环境**里开始做**有意义的开发工作**的好途径。**⑦ Conclusion 节**：官方再次强调——**学习永远不会真正停止**，但你也**已经走了很远**；保持好状态，**刷完 Getting Hired 课程**，**准备好开始求职**！**Assignment（两条）**：**①** 看 **Express 文档的缓存节**（best-practice-performance 的 cache-request-results 锚点）——三个深挖方向里「缓存」的落地阅读。**②** 访问**官方 Discord 服务器**看看我们在做什么——「**我们很希望你参与进来！**（We'd love to have you get involved!）」",
      "understand": [
        "能复述官方对「课程终点」的定位：不等于理解了一切，而是握有 NodeJS 与 Express 的积木（building blocks）、能构建真实世界有用的应用——且头六个月工作里还会学到与刚学完的一样多，课程的要点正是让你「能拿到第一份工作并继续建造」",
        "能说出官方给的三条深挖方向及各自入口：安全（ExpressJS 文档 best-practice-security）、缓存（Redis——职位招聘常见就学；Assignment 第 1 条的 Express 缓存文档是落地阅读）、非关系数据（MongoDB + Learn MongoDB 网站——「不是每个问题都需要锤子」）",
        "能复述官方对生态沉浸的实在口径：最好的方式是给用 NodeJS 的公司工作拿薪水学习；不行就自己构建 + 业余阅读（博客/Stack Overflow/播客）；很好的第一步是通读 NodeJS 与 ExpressJS 文档",
        "能说出 Contributing 节的邀请逻辑：课程完全开源、公开且免费——参与改进课程是学习敏捷开发方法论、在友好环境做有意义开发工作的途径；「你知道的比你以为的多」",
        "能接住结语课的下一站指引：刷完 Getting Hired 课程、准备开始求职——World 8 就是整条路径的最后一门课"
      ],
      "terms": [
        {
          "en": "full stack developer（全栈开发者）",
          "zh": "官方授予的身份：写过漂亮直观的前端 + 后端技术给站点加酷功能——「你现在已处于可以自称全栈开发者的阶段」"
        },
        {
          "en": "building blocks（积木）",
          "zh": "官方对课程产出的比喻：NodeJS 与 Express 的积木已装进你体内——头六个月工作还会学到一样多，课程要点是让你能拿到第一份工作并继续建造"
        },
        {
          "en": "Redis / caching（缓存）",
          "zh": "三个深挖方向之一：缓存减少数据库调用让应用更快；官方建议按职位招聘出现频率决定要不要学 Redis"
        },
        {
          "en": "non-relational database（非关系数据库）",
          "zh": "三个深挖方向之一：MongoDB 是流行选择（Learn MongoDB 网站入门）——官方金句「不是每个问题都需要锤子」"
        },
        {
          "en": "agile development methodologies（敏捷开发方法论）",
          "zh": "Contributing 节的附带收益：参与开源课程改进是学习敏捷方法、在友好环境做有意义开发工作的途径"
        }
      ],
      "tasks": [
        "看 Express 文档的缓存节（best-practice-performance#cache-request-results）——Next steps 三方向里「缓存」的落地阅读",
        "访问官方 Discord 服务器看看我们在做什么——「我们很希望你参与进来！」"
      ],
      "quiz": [
        {
          "question": "官方说「作为全栈 JavaScript 开发者工作的头六个月，你将学到与你刚学完的一样多」——这句话是在贬低课程吗？它的真实含义是什么？",
          "answer": "不是贬低，是设定预期：课程的要点（官方原话）是把 NodeJS 与 Express 的积木（building blocks）装进你体内，让你「真正能拿到第一份工作并在所知之上继续建造」。头六个月信息量一样大，恰恰说明课程给的是可生长的地基而非终点知识；官方同节还说「学习永远不会真正停止」——结语课祝贺的是「走了很远」，同时把持续学习设定为常态。"
        },
        {
          "question": "Next steps 给的三个深挖方向是什么？各自的入口与判断依据？",
          "answer": "① 安全：做更多面向公众的应用后越来越重要——入口是 ExpressJS 文档的进阶安全最佳实践（best-practice-security）；② 缓存：减少数据库调用让应用更快——入口是 Redis，官方给的判断依据是「你所在地区的职位招聘或遇到的资料里常见它」就学（Assignment 第 1 条的 Express 缓存文档是落地阅读）；③ 非关系数据：已接触 PostgreSQL 关系库，理解两类数据库及适用场景走得更远——入口是 MongoDB 与 Learn MongoDB 网站；官方金句「不是每个问题都需要锤子」。"
        },
        {
          "question": "官方认为「沉浸 Node 生态、作为开发者成长」的最好方式是什么？如果做不到呢？",
          "answer": "官方口径很实在：最好的方式是给一家用 NodeJS 的公司工作、拿薪水学习。如果这不是选项：自己构建东西 + 业余时间阅读是很好的替代——博客、Stack Overflow 帖子、播客每天都有新信息产生；很好的第一步是从头到尾通读 NodeJS 文档与 ExpressJS 文档。这也是 Contributing 节的伏笔：参与开源课程改进同样是有意义的开发工作。"
        }
      ],
      "optional": [],
      "note": "结语课形态（全站第三门 NodeJS 路径结语，同 javascript 课程 conclusion 与 react 课程 conclusion 口径）：祝贺信 + 方向指引，不教新材料、不配 Boss 题。官方 Other resources 六条（Express 框架存档页 / API 视频 / Design Patterns 书 / Clean Code 书 / syntax.fm / NodeJS Blog）在资料区登记；「全栈开发者」身份宣告与「头六个月」判断是本课最常被引用的两段。下一站：World 8 Getting Hired。",
      "why": "这封信回答的是「课程结束之后我是谁」：官方授予「全栈开发者」身份、给出头六个月的学习量预期、指了三条深挖方向（安全/缓存/非关系数据）、还递来一张开源贡献的门票。它也是 World 7 与 World 8 的铰链——「刷完 Getting Hired、准备求职」正是下一门课的全部使命。收藏这课，官方明说它设计成可以随时回来查「下一步去哪」的路标。",
      "sections": [
        {
          "h": "祝贺与身份宣告：全栈开发者",
          "p": [
            "官方开场：你已到达本课程范围的终点，应该为自己的 NodeJS 技能感觉相当不错——这不意味着理解了一切，但你现在能构建在真实世界里真正有用的那类功能的 NodeJS 应用；「毕竟，你刚建了一个社交媒体站点！」",
            "这不是课程的最后一门——还剩 Getting Hired（求职）课程；但你已处于可以自称「全栈（full stack）开发者」的阶段：写过漂亮直观的前端，又学了后端技术给站点加酷功能。",
            "接下来取决于你：继续构建东西、提问、深挖 NodeJS 与软件工程最佳实践。"
          ]
        },
        {
          "h": "头六个月与积木论",
          "p": [
            "此刻你已握有 NodeJS 与 Express 的积木（building blocks）；作为全栈 JavaScript 开发者工作的头六个月，你将学到与刚学完的一样多的信息。",
            "因为课程的要点就是把这些积木装进你体内——你已处在真正能拿到第一份工作、并在所知之上继续建造的位置。"
          ]
        },
        {
          "h": "Next steps：生态沉浸的官方口径",
          "p": [
            "Node 有极庞大的生态与写法灵活性——「一百万零一种」工具与包可以装进 Express 应用。官方明说本课不教新材料、只指方向；也可以收藏它、想看下一步去哪时回来。",
            "官方口径：作为开发者成长、沉浸生态的最好方式是给一家用 NodeJS 的公司工作、拿薪水学习；如果这不是选项，自己构建东西 + 业余时间阅读是很好的替代——博客、Stack Overflow、播客每天都有新信息。",
            "很好的第一步：从头到尾通读 NodeJS 文档与 ExpressJS 文档。"
          ]
        },
        {
          "h": "三个深挖方向：安全、缓存、非关系数据",
          "p": [
            "Security：做更多面向公众的应用后安全越来越重要——ExpressJS 文档的进阶安全最佳实践（best-practice-security）。",
            "Caching：缓存减少数据库调用让应用更快——职位招聘或资料里常见 Redis 就认识一下它；Assignment 第 1 条的 Express 缓存文档是落地阅读。",
            "Non-relational data：已接触关系库 PostgreSQL，理解两类数据库与适用场景走得更远——「不是每个问题都需要锤子」；MongoDB 是流行选择，Learn MongoDB 网站（learn.mongodb.com）入门。"
          ]
        },
        {
          "h": "Other resources、开源贡献与最后一句",
          "p": [
            "Other resources 六条（更深入软件架构、JavaScript 与 Node）：基于 Express 的更多框架（web.archive 存档页）、更多 API 视频、《Design Patterns》经典书、《Clean Code》、syntax.fm 播客、NodeJS Blog；官方邀请去 TOP curriculum GitHub 仓库改进本课清单。",
            "Contributing：「你知道的比你以为的多」——课程完全开源、公开且免费；参与改进是学习敏捷开发方法论、在友好环境做有意义开发工作的途径。",
            "Conclusion 节：学习永远不会真正停止，但你已走了很远——保持好状态，刷完 Getting Hired 课程，准备好开始求职！"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "把「终点」当「学完了」",
          "text": "官方两句话要放在一起读：课程终点=握有积木、能建真实有用的应用；头六个月工作还会学到一样多。把结语当「学完了」的信号，就会停止构建与提问——而官方对接下来日子的全部建议恰恰是「继续构建东西、提问、深挖」。学习永远不会真正停止是这课的最后一句，不是客套话。"
        },
        {
          "title": "收藏了方向清单却不动手",
          "text": "Next steps 给了明确的第一步（通读 NodeJS 与 ExpressJS 文档）、三个深挖方向（安全/缓存/非关系数据）与六条 Other resources——官方明说本课「只指方向」。清单本身不产生能力：挑一个方向（比如招聘里最常见的 Redis 缓存）做出一个能跑的小东西，才算接住了这封信。"
        },
        {
          "title": "跳过 Getting Hired 直接海投",
          "text": "官方收尾的指令很具体：「刷完 Getting Hired 课程，准备好开始求职」——World 8 是整条路径的最后一门课，讲的是简历、作品集与求职流程本身。Odin-Book 的 guest sign-in Extra credit 已经预告了招聘者视角；跳过求职课等于建好了作品却不会展示它。"
        }
      ],
      "official": {
        "assignment": [
          "看 Express 文档的缓存节（best-practice-performance#cache-request-results）",
          "访问官方 Discord 服务器看看我们在做什么——「我们很希望你参与进来！」"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 nodeJS/final_project/conclusion.md（本站自行编写简体讲解与任务拆解，未改编自任何第三方中文课程）",
        "sha256": "d9d430906ffebf3cb2af8b25d546ac42035c3b45822666eebd85e5e371164be8",
        "verifiedAt": "2026-09-29"
      }
    }
  ]
};
