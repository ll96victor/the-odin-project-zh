/* courses/react.js — World 5「React」已开放课程正文（v2 自足格式）。
 *
 * 沿用 courses/ 按 World 分文件的架构（2026-09-25 路径课试点批次 1 首建，
 * 复用事实见 REUSE-NOTES.md「路径课试点轮复用事实」节）：lessons.js 继续作为
 * Foundations 的唯一事实源不动（46 课已发布上线，是稳定资产）；本文件只放
 * World 5 已开放的课程，未开放的章节与课程不得夹带正文（红线）。
 *
 * 数据约定（与 intermediate-html-and-css.js / javascript.js /
 * advanced-html-and-css.js 同一套）：
 *   - 每课的 id 就是 curriculum.js 里的原始 slug，原样沿用、不得改写；
 *     World 5 的 slug 带 **node-path-react-new-** 中缀（不是 node-path-react-），
 *     仅结语课是 node-path-react-conclusion（无 new）——官方 URL 事实，
 *     批次 6 开工前已逐条与官方线上课页核对（25 课全 200）；
 *   - group 字段是本文件 groups 数组的数字下标（从 0 起且在本文件内连续）；
 *     groups 按官方章节顺序一次写全 8 项（含尚未开放章节——分组名是官方结构
 *     事实，不是课程内容，不构成「批量灌入正文」）；
 *   - 课的字段结构与 lessons.js 完全同构（19 字段 v2 自足格式）；
 *   - 中文课名按 catalog.js 惯例自拟，登记在本文件头注释与 SOURCES.md：
 *     批次 6 阶段 1（2026-09-27，v4.11.30）「引言」+「React 入门」8 课：
 *     How This Course Will Work → 这门课程怎么学（与 Foundations 第 1 课、
 *       javascript 课程引言课同题不同课；官方无 Assignment 节，结构豁免
 *       全站第五门）；
 *     Introduction To React → React 简介；
 *     Setting Up A React Environment → 搭建 React 环境；
 *     React Components → React 组件；What Is JSX? → 什么是 JSX；
 *     Passing Data Between Components → 在组件间传递数据；
 *     Rendering Techniques → 渲染技巧；Keys In React → React 中的 key。
 *     批次 6 阶段 2（2026-09-28，v4.11.31）「状态与副作用」5 课 +「类组件」2 课：
 *     Introduction To State → 状态简介；More On State → 再谈状态；
 *     Project: CV Application → 项目：CV 简历应用（project_cv_application.md
 *       对 slug cv-application 为 project_ 前缀去前缀直译第 17 例）；
 *     How To Deal With Side Effects → 如何处理副作用；
 *     Project: Memory Card → 项目：记忆卡片（project_memory_card.md 去前缀
 *       直译第 18 例）；Class Based Components → 基于类的组件；
 *     Component Lifecycle Methods → 组件生命周期方法。
 *     批次 6 阶段 3（2026-09-28，v4.11.32，World 5 收组）「React 测试」2 课 +
 *     「React 生态」4 课 +「更多 React 概念」3 课 +「结语」1 课：
 *     Introduction To React Testing → React 测试简介；
 *     Mocking Callbacks And Components → 模拟回调与组件；
 *     React Router → React Router（库名保留原文）；
 *     Fetching Data In React → 在 React 中获取数据；
 *     Styling React Applications → 为 React 应用添加样式；
 *     Project: Shopping Cart → 项目：购物车（project_shopping_cart.md 对
 *       slug shopping-cart 为 project_ 前缀去前缀直译第 19 例）；
 *     Managing State With The Context API → 用 Context API 管理状态
 *       （**官方文件名 managing_state_with_context_api.md 少一个 the 不同形**——
 *       配图子目录同名；全站文件名不同形又一新例）；
 *     Reducing State → 归约状态；Refs And Memoization → Ref 与记忆化；
 *     Conclusion → 结语（slug **node-path-react-conclusion 无 new 中缀**——
 *       阶段 1 预警兑现；官方文件为 conclusion/ 目录双路径文件之一，
 *       **取用已核对**：线上课页 edit 链接指向 conclusion_full_stack_javascript.md，
 *       conclusion_ruby_on_rails.md 属 Ruby 路径不取用；官方无 KC/AR，
 *       Assignment 仅一条课程反馈表按行政表单口径剔除——正文四个外链照常
 *       登记资料区，任务映射为显式空映射（有 Assignment 节但条目全部剔除
 *       的新形态，与 accessible-colors「官方无 Assignment 节」不同型）。
 *   - 官方 Markdown 住在 curriculum 仓 react/ 根目录（GitHub API 实列确认：
 *     introduction/ 3 个 .md + setting_up_a_react_environment/ 配图子目录、
 *     getting_started_with_react/ 5 个 .md + react_components/ 与 what_is_jsx/
 *     两个配图子目录——配图一律按既有口径剔除）；8 个文件名与 slug 去中缀后
 *     全同形（本批无不同形）；
 *   - **react 版 how_this_course_will_work.md 官方无 Assignment 节**
 *     （sources.json 登记 hasAssignment: false——全站第五门，与
 *     choose-your-path-forward / javascript 引言课 / javascript conclusion /
 *     accessible-colors 同口径）；且正文仅两处 TOP 自有课页链接（JavaScript
 *     课程页与 Todo List 项目课页），按既有口径剔除——本课为**全站第五个
 *     零外部资料课**；
 *   - **react 版 react_components.md 为全站首个「跨课合并后零条目」课**：
 *     官方唯一外链（MDN export 语句文档 #description 锚点）与 javascript 课程
 *     es6-modules 课既有条目同页（锚点级同页合并 + 跨课合并归属首现课），
 *     本课不重复登记、任务映射按「资源归属课」纪律不接；配图剔除后本课
 *     资料条目为 0（NO_RESOURCE_LESSONS 新增子案例：非「官方无外链」而是
 *     「外链全部归属他课」）；
 *   - **官方仓库快照差异事实（2026-09-27 实列，只记录不处置）**：curriculum 仓
 *     react/ 下另有 react_and_the_backend/ 子目录（project_messaging_app.md /
 *     project_wheres_waldo_a_photo_tagging_app.md /
 *     using_ruby_on_rails_for_your_backend.md 共 3 文件），但**官方线上课页
 *     实测只列 25 课**（与 curriculum.js 快照逐课一致，react_and_the_backend
 *     未上线到 Full Stack JavaScript 路径）；conclusion/ 目录下有
 *     conclusion_full_stack_javascript.md 与 conclusion_ruby_on_rails.md 两个
 *     路径专属结语文件（阶段 3 开工时按课页内容核对取用）。curriculum.js 为
 *     官方快照零改动红线，本节事实供后续批次与快照刷新轮参考；
 *   - 官方正文的交互演示走 CodeSandbox（引言课明示「interactive examples via
 *     CodeSandbox」），按既有口径不内嵌、不收录为资料；react.new（官方给的
 *     浏览器快捷 React 环境，实测 301 到 codesandbox.io/p/sandbox/react-new）
 *     为**操作工具入口**而非课内演示笔，按 jsbin 演示 bin 先例登记。 */
window.ODIN_COURSE_REACT = {
  version: 1,
  course: {
    id: 'react',
    en: 'React',
    zh: 'React',
    url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/react'
  },
  groups: [
    { en: 'Introduction', zh: '引言' },
    { en: 'Getting Started With React', zh: 'React 入门' },
    { en: 'States And Effects', zh: '状态与副作用' },
    { en: 'Class Components', zh: '类组件' },
    { en: 'React Testing', zh: 'React 测试' },
    { en: 'The React Ecosystem', zh: 'React 生态' },
    { en: 'More React Concepts', zh: '更多 React 概念' },
    { en: 'Conclusion', zh: '结语' }
  ],
  lessons: [
    {
      "id": "node-path-react-new-how-this-course-will-work",
      "title": "How This Course Will Work",
      "zh": "这门课程怎么学",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-how-this-course-will-work",
      "summary": "React 课程的开篇导语：先从 React 基础学起，再进入更高级的概念，沿途做可以放进作品集的项目。官方把「先完成 JavaScript 课程」放在最显眼的位置——React 说到底*就是*原味 JavaScript，JS 地基不牢，React 项目寸步难行。课程结构与你熟悉的模式一致：课文 + 作业，另配 CodeSandbox 交互示例。官方也提前给你打了预防针：学新技术会有挫败感，甚至会让你怀疑「用原味 JS 也能做，为什么还要学 React」——这很正常，等你走完全程会发现 React 在前端开发里的便利（比如那个让人头疼的 Todo List 项目，用 React 做核心功能通常更快）。",
      "guide": "以下是官方原课的中文化梳理。这是 World 5 的第一课，性质与 Foundations 第 1 课、javascript 课程引言课相同——不教具体技术，先交代这门课学什么、需要什么前置、以什么心态走完。本课只有三个要点：其一，**前置是完整的 JavaScript 课程**，官方用了「怎么强调都不为过」的措辞——React 是库不是新语言，你写的每一行都是 JS，JS 不熟的人学 React 会把「不会 JS」误诊成「不会 React」；其二，课程结构照旧（课文 + 作业），新增 CodeSandbox 交互示例，边读边玩是官方设计好的学习路径；其三，心态预期——「我用原味 JS 也能做」的念头会出现，这不是你不适合 React，而是你还没见到规模化组件复用的好处，官方向你保证学完你会成为 React 行家。正文很短，读完带着正确预期进入第 2 课即可。",
      "understand": [
        "本课是 React 课程的路线图：先基础后进阶，沿途的项目可以放进作品集向招聘方展示 React 技能",
        "**先完成 JavaScript 课程是硬性前置**——官方原话「怎么强调都不为过」：React *就是*原味 JavaScript，能驾驭 JS 是做出成功 React 项目的根本",
        "课程结构与之前的课程一致：课文内容 + 作业（Assignment），另通过 CodeSandbox 提供交互示例演示课内概念",
        "学新技术的挫败感是正常的；「这用原味 JS 也能做，我为什么学 React」的怀疑也会出现——官方明确说这没问题（that's fine）",
        "React 的回报在规模化之后才显现：官方举的例子是 JavaScript 课程里让人头疼的 Todo List 项目——用 React 做核心功能通常花的时间更少",
        "课程终点预期：走完全部课程，你会成为一名 React 行家（官方原话 React Guru）"
      ],
      "terms": [
        {
          "en": "React course",
          "zh": "React 课程：TOP Full Stack JavaScript 路径的第五门课程（World 5），覆盖 React 基础到高级概念，含 CV 应用、记忆卡片、购物车三个项目课"
        },
        {
          "en": "CodeSandbox",
          "zh": "在线代码沙箱：本课起官方课文内嵌的交互示例平台，可以在浏览器里直接改代码看效果——本站不内嵌第三方组件，官方课页可打开把玩"
        },
        {
          "en": "Portfolio",
          "zh": "作品集：课程沿途项目（如 CV 应用、记忆卡片、购物车）做进作品集，用来向招聘方展示 React 技能"
        },
        {
          "en": "Vanilla JavaScript",
          "zh": "原味 JavaScript：不加库与框架、只用语言本身——官方强调 React 底层就是它，JS 地基决定 React 上限"
        }
      ],
      "tasks": [
        "确认你已完成本站 World 3「JavaScript」课程的全部章节——尤其「组织 JavaScript 代码」（组件化思维的地基）与「异步 JavaScript 与 API」（后面 Fetching Data 课直接用到）",
        "通读本站中文讲解与官方原文，建立对课程结构的预期：课文 + 作业 + CodeSandbox 交互示例",
        "回想你做 Todo List 项目时的痛点（状态散落在闭包与 DOM 里、UI 同步靠手工），带着「React 怎么解决这些」的问题进入下一课",
        "本课官方无 Assignment 节，不需要额外操作——直接进入第 2 课「React 简介」"
      ],
      "quiz": [
        {
          "question": "官方为什么把「先完成 JavaScript 课程」说得这么重？",
          "answer": "因为 React *就是*原味 JavaScript——它不是新语言，而是一个 JS 库，你写的组件、props、状态全部是 JS 代码。JS 地基不牢的话，遇到问题的第一反应会误判成「React 太难」，实际上是 JS 没吃透。官方原话是「怎么强调都不为过」（can't emphasize enough）。"
        },
        {
          "question": "学到中途冒出「这用原味 JS 也能做，为什么我要学 React」的念头，官方的态度是什么？",
          "answer": "官方明确说这很正常、没问题（that's fine）。小例子上原味 JS 确实都能做——React 的价值要在规模上来之后才显现：组件复用、状态驱动的 UI 更新、更少的样板代码。官方举 Todo List 项目为例：用 React 做核心功能通常更快。坚持下去，你会在课程里亲眼看到便利之处。"
        },
        {
          "question": "本课与之前的课程相比，课文形态上多了什么？",
          "answer": "多了 CodeSandbox 交互示例——官方在课文里内嵌可以直接改代码、实时看效果的沙箱。整体结构不变：课文内容 + 作业。本站不内嵌第三方组件，想看交互示例打开官方课页即可。"
        }
      ],
      "optional": [],
      "note": "官方原文很短（约 1.7KB 的开课导语），**无 Assignment 节**（sources.json 登记 hasAssignment: false——全站第五门，与 choose-your-path-forward、javascript 课程引言课与结语课、accessible-colors 同口径）；正文仅有的两处链接（JavaScript 课程页与 Todo List 项目课页）都是 TOP 自有课页，按既有口径剔除——本课为**全站第五个零外部资料课**，不凑数。本站正文按原文如实梳理、不扩写官方没讲的内容。CodeSandbox 交互示例按课内演示口径不收录。",
      "why": "这一课的价值是校准预期：React 学习曲线前段平缓（你会觉得「不过如此」）、中段陡增（状态与副作用一上来），知道官方对挫败感的预告，你就不会在中段怀疑自己选错了路。同时它把「JS 地基」这条底线立在你面前——后面每一课你都会验证这句话：所谓 React 技巧，拆开全是 JS 的函数、对象、数组方法与闭包。",
      "sections": [
        {
          "h": "欢迎来到 React 课程",
          "p": [
            "官方开篇欢迎语交代了课程路线：从 React 基础学起，再进入更高级的概念；沿途会做多个项目，可以加进作品集（portfolio），向招聘方展示你的 React 技能。",
            "对本站学习者来说，这条路线对应 World 5 的八个章节：引言与 React 入门打地基，状态与副作用是核心难点，类组件与测试补全工程能力，生态与更多概念走向真实项目，结语收束全课程。"
          ]
        },
        {
          "h": "硬性前置：先完成 JavaScript 课程",
          "p": [
            "官方用了整段话强调：**开始本课之前，确保你已完成 JavaScript 课程**——「我们怎么强调都不为过：在潜入 React 之前对 JavaScript 有扎实的理解多么重要。」",
            "理由很直接：说到底，React *就是*原味 JavaScript（vanilla JavaScript）。能够在 JavaScript 里自如行动，是构建成功 React 项目的根本。",
            "对照本站：World 3「JavaScript」课程全八章 41 课就是这条前置——尤其工厂函数与模块、ES6 模块、数组方法（后面渲染列表全靠 map）与异步（后面 Fetching Data 课直接用）。"
          ]
        },
        {
          "h": "接下来的旅程：结构、心态与终点",
          "p": [
            "课程结构你会很熟悉：每课都是课文内容 + 作业（Assignment）；本课起官方还在课文里加入了 **CodeSandbox 交互示例**，演示课内概念，可以边读边改。",
            "官方提前打了预防针：学新技术可能是一段令人挫败的旅程，但你一定能坚持下来。中途你也许会想「我用原味 JavaScript 也能做这个，为什么还要学 React？」——官方说这没问题（that's fine）。",
            "随着课程推进，你会真切体会到 React 在前端开发里有多方便。官方举了个你亲历过的例子：还记得 JavaScript 课程里那个让人头疼的 **Todo List 项目**吗？用 React 做它的核心功能，通常花的时间更少。",
            "官方的终点承诺：课程走完，你就是一名 React 行家（React Guru）。最后一句是官方双关语口号——**let's start Reactin'!**（开始 React 吧！）"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "跳过 JavaScript 课程直接学 React",
          "text": "最常见的翻车姿势：组件写不出来时以为是 React 的问题，实际是 JS 的函数、解构、数组方法没吃透。官方把前置要求写成整段强调，本站把 World 3 全八章放在 World 5 之前，都是同一个原因——先回 JS 课补地基，比在 React 里硬扛快得多。"
        },
        {
          "title": "把「原味 JS 也能做」当成不学 React 的理由",
          "text": "小 demo 层面原味 JS 当然都能做——Todo List 你也确实用原味 JS 做出来了。React 的收益在规模化之后：组件复用、状态驱动渲染、更少的 DOM 手工同步。官方特意用 Todo List 对比来预告这一点，学到状态章节你会亲身体会。"
        }
      ],
      "official": {
        "assignment": [],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/introduction/how_this_course_will_work.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "02d9f6477acd5d9e91ac06357cf00b79b6467f5a932e8f1e721b57fafbb6d597",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-react-new-introduction-to-react",
      "title": "Introduction To React",
      "zh": "React 简介",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-introduction-to-react",
      "summary": "React 是什么：官方定义是「用于 Web 与原生界面的库」（The library for web and native interfaces）。拆开看——它是预写代码的集合（库），帮你复用复杂任务的实现；它提供强大的原语（primitives）来构建各种复杂度的用户界面。为什么课程选它：组件可复用、社区庞大支持好、不 opinionated（不强迫你遵循特定设计模式或项目结构）、学习曲线相对平缓（尤其你已有 JS/HTML/CSS 基础）。本课同时厘清一个常被混用的概念：库（library）与框架（framework）不是一回事。",
      "guide": "以下是官方原课的中文化梳理。这是 World 5 的第一课知识课，回答两个问题：React 是什么、为什么值得学。第一个问题的答案分三层：官方口号（Web 与原生界面的库）→ 库的通用定义（预写代码的集合，可复用到自己的代码库完成复杂任务）→ React 的具体形态（提供构建 UI 的强大原语）。这里官方埋了一个后续作业的伏笔：**库与框架常被混用但不是一回事**，区别在 Assignment 的 FreeCodeCamp 文章里展开。第二个问题的答案里，官方先安抚了「选错框架」的焦虑——前端框架格局近年变化很大，担心选错可以理解（正文引了一篇讲 JS 框架生命周期的文章）；然后给出学 React 的四条理由：组件可复用、社区大支持好、不 opinionated、学习曲线小。四条里最值得展开的是「不 opinionated」：React 只管视图层，不强制路由、状态管理、项目结构的选型——自由度高，也意味着你要自己做的决定多，这正是后面「React 生态」章节存在的原因。",
      "understand": [
        "React 的官方定义：**用于 Web 与原生界面的库**（The library for web and native interfaces）——注意措辞是 library（库）不是 framework（框架）",
        "库的通用定义：预写代码的集合，设计目的是让开发更容易；可以在自己的代码库里复用/重新实现这些代码来完成复杂任务",
        "库 ≠ 框架，尽管两个词经常被混用——区别要点在 Assignment 的 FreeCodeCamp 文章里（控制反转：框架调用你的代码，库被你的代码调用）",
        "React 提供强大的**原语**（primitives，内置函数/模块），用来构建不同复杂度的用户界面；课程会逐一学到",
        "学 React 的理由一：**组件可复用**——UI 拆成独立可复用的块，写一次到处用",
        "学 React 的理由二：**支持好**——流行度高、社区庞大，遇到问题基本都有人踩过",
        "学 React 的理由三：**不 opinionated**——不强迫你遵循特定设计模式、项目组织结构或逻辑，选型自由都在你手里",
        "学 React 的理由四：**学习曲线较小**——尤其你已经从之前的课程打下了扎实的 JS / HTML / CSS 基础",
        "对「选错框架」的焦虑：前端框架格局近年变化很大，这种担心可以理解；但深入一个框架后你会爱上它——代码可扩展、更易读、（官方谦虚地估计）效率可能高一千倍"
      ],
      "terms": [
        {
          "en": "React",
          "zh": "React：Meta 发起并维护的 JavaScript 库，官方定位「用于 Web 与原生界面的库」；本站课程以 Web 界面为主"
        },
        {
          "en": "Library",
          "zh": "库：预写代码的集合，被你的代码调用完成特定任务（如 React 之于 UI）——与框架的关键区别是控制方向：你调用库"
        },
        {
          "en": "Framework",
          "zh": "框架：提供完整应用骨架、由框架调用你的代码（控制反转）——如 Angular；React 官方自我定位是库，但生态里常被当作框架使用"
        },
        {
          "en": "Primitives",
          "zh": "原语：React 提供的内置函数/模块（如 createElement、useState），是构建各种复杂度 UI 的基本积木"
        },
        {
          "en": "Opinionated",
          "zh": "「有主见的」：指技术栈强制规定你该怎么组织代码、用什么模式——React 刻意不 opinionated，路由/状态管理/构建工具都留给生态选型"
        }
      ],
      "tasks": [
        "浏览 React 官网（react.dev）的首页与介绍部分——官方第 1 条作业要求的深度就是「别钻太深、读介绍即可」；本站资料区该条目为跨课合并（归属 javascript 结语课），从官方课页或资料区跳转均可",
        "完成官方 Assignment 四条：React 官网浏览、React 历史时间线文章、库与框架的区别（FreeCodeCamp）、React 的主要优势（GeeksforGeeks）——本站资料区有逐条中文导读",
        "读 FreeCodeCamp 那篇「库 vs 框架」时，重点抓住**控制反转**这一条判据，回头验证「React 是库」这个官方定位",
        "把「不 opinionated」与你在 World 3 做 Todo List 时的自由选型（模块怎么组织、状态放哪里全靠你）联系起来——React 把同样的自由度带到了 UI 层"
      ],
      "quiz": [
        {
          "question": "React 官方对自己的定义是什么？为什么措辞里用「库」而不是「框架」？",
          "answer": "官方定义：「用于 Web 与原生界面的库」（The library for web and native interfaces）。用「库」是因为 React 只做一件事——构建用户界面，由你的代码调用它的能力；它不提供完整应用骨架（路由、状态管理、构建流程都不管），不「调用你的代码」，所以不满足框架的控制反转特征。当然它的生态庞大到常被当框架用，但官方定位一直是库。"
        },
        {
          "question": "「React 不 opinionated」是什么意思？对学习者和项目分别意味着什么？",
          "answer": "opinionated 指技术栈强制你按它主张的方式来——特定设计模式、特定项目组织结构、特定逻辑写法。React 不 opinionated：它不强迫任何选型，一切由你决定。好处是灵活、适配任何团队习惯；代价是决定多——路由用什么、状态管理用什么、样式方案用什么，都要自己选。这正是本课程后面「React 生态」与「更多 React 概念」两章要带你做选型的原因。"
        },
        {
          "question": "官方给出的学 React 的四条理由是什么？",
          "answer": "① 组件可复用——UI 拆成独立块，写一次到处用；② 支持好——流行度高、社区庞大，文档与答案充足；③ 不 opinionated——不强制设计模式与项目结构；④ 学习曲线较小——尤其你已经有扎实的 JS / HTML / CSS 基础（这正是 TOP 把 React 放在 JavaScript 课程之后的原因）。"
        },
        {
          "question": "「担心选错前端框架」这个焦虑，官方是怎么回应的？",
          "answer": "官方承认前端框架格局近年变化很大，担心选错可以理解（还引了一篇讲 JS 框架生命周期的文章说明这种更替有多快）。但它的回应是：一旦深入一个框架，你会开始爱上它——代码变得可扩展、更易读、效率可能高得多。潜台词是：框架会更替，但「组件化 + 声明式 UI」的思想是通用的，深入学过一个之后迁移成本很低。"
        }
      ],
      "optional": [],
      "note": "Assignment 第 1 条的 React 官网（react.dev）为**跨课合并条目**——本站已在 javascript 课程结语课登记（含官方中文版 zh-hans.react.dev，全站首例），本课不重复登记、资料卡在那一课；官网中文版对全站学习者同样可用。正文引用的「JS 框架生命周期」Medium 文章命令行 403（站点反爬）、真实浏览器实测可达并取得标题与 h1，按既有 Medium 先例双通路如实登记入受限清单。",
      "why": "这一课给你的是「为什么是 React」的答案，而不是「怎么写 React」——但它决定了你后面学习的姿势：把 React 当库（一组可组合的原语），而不是当魔法。当你后面遇到 JSX、props、状态这些概念时，记住它们全是 JS 的函数与对象——官方定义里那个「库」字，就是这一切的锚。",
      "sections": [
        {
          "h": "React 是什么：官方定义与三层拆解",
          "p": [
            "React 官网（react.dev）给的官方定义：**「用于 Web 与原生界面的库」**（The library for web and native interfaces）。官方随即把这句话拆开讲。",
            "第一层，「库」的通用含义：JavaScript 库是**预写代码的集合**，设计目的是让开发更容易；这些代码可以在我们自己的代码库里复用/重新实现，用来完成复杂任务。",
            "第二层，库与框架的辨析：库不应与框架混为一谈，尽管两个词经常被互换使用——它们的具体区别是 Assignment 里 FreeCodeCamp 文章的必读内容（核心判据是控制方向：你的代码调用库，框架调用你的代码）。",
            "第三层，React 的具体形态：React 提供强大的**原语**（primitives，内置的函数/模块），让我们能构建各种复杂度的用户界面。整门课程就是把这些原语逐一学会、用来构建酷炫的应用。"
          ]
        },
        {
          "h": "为什么课程选 React：先安抚焦虑，再给理由",
          "p": [
            "React 是最强大、使用最广泛的 JavaScript 库之一。",
            "官方先回应一个现实焦虑：前端框架的格局最近几年变化很大，担心自己选「错」框架是可以理解的——正文引了一篇讲 JavaScript 框架生命周期的文章（作者 Tapan Patel），直观展示了框架更替的速度。",
            "然后给出定心丸：一旦你开始深入一个框架，你会爱上它——它让代码容易扩展、更易读、并且（按官方谦虚的估计）效率可能高出一千倍。",
            "换句话说：框架会更替，但深入学透一个之后，思想是通用的，迁移成本很低。TOP 选 React，就是让你深入的那个。"
          ]
        },
        {
          "h": "学 React 的四条理由",
          "p": [
            "官方列了四条（本课最值得背下来的清单）：",
            "**① 组件可复用**（Components are reusable）——UI 拆成独立块，写一次、到处用、按需定制；这是 React 全部价值的起点，下一章整章都在讲它。",
            "**② 支持好**（well-supported）——流行度高、社区庞大，文档、教程、问答充足，你踩的坑基本都有人踩过。",
            "**③ 不 opinionated**——React 不强迫你遵循任何特定设计模式、项目组织结构或逻辑，一切选型由你。自由度高，代价是要自己做的决定多（生态章节会帮你做这些决定）。",
            "**④ 学习曲线较小**（smaller learning curve）——尤其当你已经从之前的课程里掌握了扎实的 JavaScript、HTML 与 CSS。这正是 TOP 课程顺序（JS 课程在 React 之前）的设计意图。"
          ]
        },
        {
          "h": "作业导览：四条阅读任务的读法",
          "p": [
            "官方 Assignment 四条全是阅读：① 浏览 React 官网首页/介绍（**别钻太深**、别陷进文档——建立「React 怎么工作」的初印象即可）；② 扫一眼 React 历史时间线文章（RisingStack，知道它从 2013 年发布到 Hooks 时代的演进脉络）；③ 精读 FreeCodeCamp 的库 vs 框架辨析文（**这条是四条里最需要认真读的**——它回答本课埋下的概念伏笔）；④ 略读 GeeksforGeeks 的 React 优势清单（与课文四条理由互为印证）。",
            "四条的中文导读在本站资料区，React 官网条目在 javascript 结语课资料区（跨课合并，含官方中文版入口）。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "把 React 当框架理解",
          "text": "React 官方定位是库：只管 UI 层，不含路由/状态管理/构建工具。把 React 当「全家桶框架」预期，会在选型时不知所措——那些「缺的部分」正是生态章节要学的第三方选型（React Router 等）。判据记住一条：你的代码调用库，框架调用你的代码。"
        },
        {
          "title": "第一条作业就陷进官方文档",
          "text": "官方明确说「Don't go too in-depth or dive into documentation」——第 1 条作业只要求读首页/介绍建立初印象。React 文档非常深，一上来钻进去会消耗大量时间还抓不住主线；按课程节奏走，该读的文档后面每课 Assignment 都会精确指到具体页面。"
        }
      ],
      "official": {
        "assignment": [
          "如果还没有的话，浏览 React 官网（react.dev）——不要钻太深或陷进文档，但请读一下介绍/首页，对 React 的工作方式建立初步印象",
          "扫一眼这篇概述 React 历史的文章（RisingStack：The History of React.js on a Timeline）",
          "读这篇 FreeCodeCamp 文章，弄清 JavaScript 库与框架的区别",
          "最后，略读这篇讲解使用 React 主要优势的文章（GeeksforGeeks）"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/introduction/introduction_to_react.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "2ffd7c20677bacada3fc803ccdd54b1d741de71986bceece31606af19edc1140",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-react-new-setting-up-a-react-environment",
      "title": "Setting Up A React Environment",
      "zh": "搭建 React 环境",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-setting-up-a-react-environment",
      "summary": "本课解决「怎么开始」：用 Vite 一条命令创建 React 项目（npm create vite@latest my-first-react-app -- --template react），在 localhost:5173 看到模板首页，然后逐层认识项目结构——public 放静态资产、src 放应用代码、main.jsx 是入口（createRoot + render 五步逐行讲）。为什么需要工具链：从零搭 React 环境至少要自己配置包管理（NPM/Yarn）、模块打包（Webpack/Parcel）、编译（Babel）与 React 本身——工具链把这一切打包成一条命令。官方还交代了一个历史包袱：Create React App（CRA）曾是官方脚手架，2023 年初已弃用，老教程里见到它别跟着用。最后装上 React Developer Tools 浏览器扩展——官方建议尽早装、尽早熟。",
      "guide": "以下是官方原课的中文化梳理。这是 World 5 第一门动手课，从本课起你有了自己的 React 开发环境。心智主线是「先会用、再懂为什么」：官方先摊开从零搭建的复杂度（四类配置：包管理、打包、编译、React 本体），让你明白工具链不是多余抽象而是替你挡掉了配置地狱；然后一条 Vite 命令出项目；再带你走进项目目录，重点逐行读 main.jsx——这段代码你现在看不懂大半是正常的（官方原话），课程会逐步揭晓，但 createRoot/render 这对组合从第一天就要混个脸熟：它是 React 应用与真实 DOM 的唯一接线点。两个必须带走的实操事实：① CRA 已弃用——老教程用它，你别用；② React Developer Tools 尽早装——它是后面每一课调试的标配。Node 版本用最新 LTS，这是官方点名的报错源头。",
      "understand": [
        "启动 React 项目有多条路：从 CDN 挂 <script> 标签，到高度可配置、可扩展可优化的健壮**工具链**（toolchain）与框架",
        "官方列举的工具链例子：Vite 的 React 配置、Gatsby、NextJS、Create React App（**已弃用**）——本课程用 Vite",
        "为什么需要工具链：自己从零搭「能做但很难」——在写第一行功能代码之前，至少要配置好包管理（NPM / Yarn）、模块打包（Webpack / Parcel）、编译（Babel）与 React 本身，有时还远不止这些",
        "**CRA 的兴废**：2016 年推出后一直是官方脚手架，2023 年初被弃用；因其流行度，大量老教程仍在提它——新项目不要再用",
        "创建项目命令：`npm create vite@latest my-first-react-app -- --template react`（项目名可换）；前提是使用**最新 LTS 版 Node**，否则可能报错",
        "交互问答：询问是否安装 create-vite 包时输 y 回车；实验特性问题一律答 no；「Install with npm and start now?」答 yes——随后终端输出 Local: http://localhost:5173/",
        "开发服务器：Ctrl + C 退出；之后在项目目录里随时 `npm run dev` 重启；浏览器打开 localhost:5173 看到 Vite React 模板首页即成功",
        "已有 GitHub 仓库的变体：克隆空仓库后 `cd` 进去，用 `.` 作项目名跑同一条命令（`npm create vite@latest . -- --template react`）——Vite 就地初始化，目录已是 git 仓库且连好远端",
        "项目结构：`public/` 放应用的静态资产（图片、图标、给浏览器的信息文件）；`src/` 放运行应用的代码；根目录有 package.json / package-lock.json / .gitignore / README.md（README 值得现在略读）",
        "**main.jsx 是应用入口**，五步：① 从 react 包导入 StrictMode、从 react-dom/client 导入 createRoot；② 导入 App.jsx 里的 App 组件以便渲染进 DOM；③ 导入 CSS（Webpack 课见过的语法）；④ 用 index.html 里的元素调用 createRoot 创建 root 对象；⑤ 调用 root 的 render 方法，参数里是那段「看起来很特别」的 JSX 语法",
        "官方明确说：现在看不懂 main.jsx 的大部分内容是正常的（甚至全看不懂也没关系）——课程学完你会精确知道每一行的作用",
        "**React Developer Tools**：Chrome 扩展，用来追踪（并实时修改）应用内部的组件——项目越大越需要它；官方建议尽早安装、尽早用熟，它是高效 React 开发的无价工具"
      ],
      "terms": [
        {
          "en": "Toolchain",
          "zh": "工具链：把包管理、打包、编译、开发服务器等环节串成一条流水线的工具集合——Vite 是本课程的选择；「自建工具链可做但很难」是官方对它的定位"
        },
        {
          "en": "Scaffold",
          "zh": "脚手架（动词/名词）：一条命令生成项目初始骨架（目录结构 + 配置文件 + 示例代码）——Vite 的 react 模板就是脚手架"
        },
        {
          "en": "LTS (Long Term Support)",
          "zh": "长期支持版：Node 的稳定版本线——官方点名「用最新 LTS 版 Node，否则可能报错」"
        },
        {
          "en": "CDN (Content Delivery Network)",
          "zh": "内容分发网络：把资源缓存到全球节点加速访问——「CDN 挂 script 标签」是最原始的 React 接入方式，适合试验不适合工程"
        },
        {
          "en": "createRoot / render",
          "zh": "React 应用与真实 DOM 的接线点：createRoot(容器元素) 创建根，root.render(<App />) 把组件树渲染进去——main.jsx 的灵魂两行"
        },
        {
          "en": "StrictMode",
          "zh": "严格模式：React 的开发期检查组件——不渲染任何可见内容，专门帮你提前暴露潜在问题；只在开发环境生效"
        },
        {
          "en": "React Developer Tools",
          "zh": "React 开发者工具：Chrome 扩展，在 DevTools 里加 React 面板，可查看组件树、props、状态并实时修改——本课起官方建议标配"
        }
      ],
      "tasks": [
        "确认本机 Node 为最新 LTS 版（node -v 核对），然后在你的项目目录跑官方命令创建 my-first-react-app——交互问答按课文口径回答（create-vite 输 y、实验特性答 no、install and start 答 yes）",
        "打开 localhost:5173 确认看到 Vite React 模板首页，然后 Ctrl+C 退出、cd 进项目目录、npm run dev 重启一次——把开发服务器的启停练成肌肉记忆",
        "按官方建议把项目连到 GitHub：新建**空**仓库后按仓库页说明连接；如果你习惯先建仓再克隆，用课文贴士的 `.` 作项目名变体",
        "走进项目目录认结构：public/、src/、package.json、README.md（官方要求略读 README）；打开 src/main.jsx 对照本站讲解把五步逐行认一遍——看不懂的地方标记出来，后面的课会逐一揭晓",
        "安装 React Developer Tools 扩展并打开一个 React 页面看它亮起来——官方建议尽早用熟",
        "完成官方 Assignment 三条：通读 Vite 官方 Getting Started 文档（有官方中文版）、读 DebugBear 的 React DevTools 入门指南（细节看不懂没关系）、把 my-first-react-app 清理成显示「Hello, World!」"
      ],
      "quiz": [
        {
          "question": "为什么官方说「自己从零搭 React 环境能做、但很难」？至少要配置哪四类东西？",
          "answer": "因为在写出第一行有功能的代码之前，你要先把整个开发环境立起来：① 包管理（NPM 或 Yarn）；② 模块打包（Webpack 或 Parcel）；③ 编译（Babel——把 JSX 与新语法编译成浏览器认识的 JS）；④ React 本身。而且经常还远不止这些。工具链（如 Vite）的价值就是把这四类配置连同开发服务器一起打包成一条命令。"
        },
        {
          "question": "Create React App 是什么地位？现在该不该用？",
          "answer": "CRA 从 2016 年推出起曾是 React 官方脚手架，但因为多种原因在 2023 年初被弃用（deprecated）。因为它太流行了，你会在大量老教程和指南里看到它——但官方明确：新项目不再推荐使用。本课程与官方现行推荐一致，用 Vite 的 React 模板。"
        },
        {
          "question": "main.jsx 里 createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>) 这段在做什么？",
          "answer": "五步里的最后两步：先用 index.html 里的 root 元素调用 createRoot 创建根对象——这是 React 应用与真实 DOM 的接线点；再调用它的 render 方法把 App 组件（包在 StrictMode 开发期检查组件里）渲染进去。前面的 import 三行分别引入 StrictMode 与 createRoot（来自 react 和 react-dom/client 包）、App 组件（来自 App.jsx）、全局 CSS。官方说现在看不懂是正常的——但「createRoot + render 是入口接线」这一点从第一天就要记住。"
        },
        {
          "question": "已经先建好 GitHub 仓库并克隆到本地了，怎么在里面初始化 React 项目？",
          "answer": "cd 进克隆好的仓库目录，把项目名换成 `.` 跑同一条命令：npm create vite@latest . -- --template react。`.` 告诉 Vite 就用当前目录做项目、不再新建子目录——而这个目录已经初始化过 git 并连好了远端，一步到位。"
        },
        {
          "question": "React Developer Tools 是什么？官方对它的使用建议是什么？",
          "answer": "一个 Chrome 扩展，给浏览器 DevTools 增加 React 专属面板：项目变大、组件变多之后，用它追踪应用内部的各个活动部件（组件树、props、状态），还能实时改值调试。官方建议：尽早安装、尽早用熟（as early as possible）——它是高效 React 开发的无价工具。本站资料区有扩展商店页与 DebugBear 入门指南（官方 Assignment 第 2 条）。"
        }
      ],
      "optional": [],
      "note": "Vite 官网实测已从 vitejs.dev 迁移到 **vite.dev**（301，两条链接均按现役域名生效登记）；官方中文文档 cn.vitejs.dev 实测在位（标题「Vite | 下一代的前端工具链」）。React Developer Tools 商店页实测 chrome.google.com 301 到 chromewebstore.google.com（整站迁移既有事实第二批）；?hl=zh-cn 时商店界面为中文但**列项描述实测仍为英文**（meta description 英文、无翻译标记），按无可靠中文版登记 C 类——与 ChromeVox 商店页（Google 自家列项官方中文化、A 类）同店不同判、逐列项核验。正文工具链与配置清单里的 8 个信息性示例链接（Gatsby / NextJS / CRA / NPM / Yarn / Webpack / Parcel / Babel 裸首页）非要求研读资料，按「裸站点首页」口径剔除不凑数；CRA 弃用公告的 GitHub PR 引用链接为事实引证、非学习资料，同剔除；Vite 模板首页截图为 statically CDN 课程配图，剔除。",
      "why": "这一课把「React 项目从哪来」这个黑箱打开给你看：一条命令背后是工具链替你完成的四类配置。这个认知在后面反复保值——dev server 挂了你知道去哪查、构建报错你看得懂是编译层还是代码层、看到老教程用 CRA 你知道该换成什么。main.jsx 那五步则是整个课程地图的起点：后面学的每个概念，最终都会回到「组件如何被 render 进 DOM」这条主干上。",
      "sections": [
        {
          "h": "条条大路：接入 React 的多种方式",
          "p": [
            "在项目里用上 React 有多种方式：从最轻的——挂一组从 **CDN**（内容分发网络）提供 React 的 `<script>` 标签，到最重的——高度可配置、可扩展性与优化空间更大的健壮**工具链**（toolchain）与框架。",
            "官方列举的工具链例子：**Vite 的 React 配置**（本课程的选择）、Gatsby、NextJS、以及 Create React App（**已弃用**，见下节）。"
          ]
        },
        {
          "h": "为什么需要工具链：自建的四座大山",
          "p": [
            "官方设问：为什么需要这些工具链？不能想怎么搭就怎么搭吗？答案是：能，但**很难**（it's *hard*）。",
            "React 是一头复杂的巨兽，活动部件很多。在写出任何提供功能的代码之前，你**至少**要配置好：**包管理**（NPM、Yarn）、**模块打包**（Webpack、Parcel）、**编译**（Babel）、以及 **React 本身**。",
            "而这一切——有时还**远不止**这些——只是让一个 React 项目和开发环境跑起来的最低要求。这就是工具链存在的意义：一条命令换掉一整套配置工程。"
          ]
        },
        {
          "h": "一段历史：Create React App 的兴与废",
          "p": [
            "官方专门用提示块交代：**Create React App（CRA）自 2016 年推出起是脚手架新 React 项目的官方方式**；但由于诸多原因，**CRA 于 2023 年初被弃用**（官方链接指向 react.dev 仓库里的弃用讨论）。",
            "因为 CRA 曾经的流行度，你会在很多教程和指南里看到它的身影——但它**不再被推荐用于新项目**。读到用 CRA 的老教程时，知道把脚手架那一步换成 Vite 即可，其余概念不受影响。"
          ]
        },
        {
          "h": "一条命令建项目：Vite 实操",
          "p": [
            "理解了从零搭的复杂度，就可以松口气了：**一条终端命令**即可开始。本课程用 Vite 自家的 React 模板做脚手架——就像我们自己做了个模板仓库来用。Vite 为开发者构建前端工具，底层用最新技术提供极佳开发体验，对 React 生态也有完善支持、几乎零配置、开箱即带实用工具。",
            "前提：**用最新 LTS 版的 Node**，否则可能报错。打开终端与你的项目文件夹，输入：`npm create vite@latest my-first-react-app -- --template react`（项目名随意换）。",
            "交互问答口径：问你要不要安装 `create-vite` 包——输 `y` 回车接受；问实验特性——一律答 no；最后「Install with npm and start now?」——答 yes。",
            "成功后终端输出 `Local: http://localhost:5173/`——浏览器打开它，你会看到 Vite React 模板首页。**恭喜，你的第一个 React 应用建好了。**",
            "开发服务器用 `Ctrl + C` 退出；以后在项目目录里随时 `npm run dev` 重启。要把本地项目连上 GitHub：新建一个**空**仓库，按新仓库页面的说明连接到本地目录。",
            "官方贴士（已有仓库的变体）：如果你已经建好并克隆了 GitHub 仓库，`cd` 进去后用 `.` 作项目名跑命令——`npm create vite@latest . -- --template react`。Vite 会直接用当前目录做项目、不再新建目录，而克隆目录本来就已初始化 git 并连好远端。"
          ]
        },
        {
          "h": "深入项目：目录结构与 main.jsx 五步",
          "p": [
            "走进新项目：若干文件夹，加上 `package.json`、`package-lock.json`、`.gitignore` 与 `README.md`。README 里有有用信息，官方要求你**现在就略读一遍**。",
            "`public/` 文件夹放应用相关的全部**静态资产**：图片、图标、给浏览器的信息文件。`src/` 文件夹里是**运行应用的代码**；其中的 `main.jsx` 是应用程序的**入口**（entry point）。",
            "打开 `main.jsx`：导入 StrictMode（来自 react）与 createRoot（来自 react-dom/client）、导入 App.jsx 的 App 组件、导入 index.css，然后 `createRoot(document.getElementById(\"root\")).render(<StrictMode><App /></StrictMode>)`。",
            "官方逐条解释这五步：① 从 `react` 与 `react-dom` 包分别导入 `StrictMode` 和 `createRoot`；② 从 `App.jsx` 导入 `App` 组件，以便把它放置（渲染）进 DOM；③ 导入一些 CSS 样式（这个语法你在 Webpack 材料里见过）；④ 用 `index.html` 里的一个元素调用 `createRoot`，创建 `root` 对象；⑤ 调用挂在 `root` 上的 `render` 方法，括号里是非常眼熟的「特别语法」（JSX，下一课正式讲）。",
            "官方的定心丸：这一切看起来和你迄今见过的任何东西都不像——**现在不指望你能看懂多少（看懂零个也没关系）**。等课程学完，你会精确知道这一切在做什么，以及更多。"
          ]
        },
        {
          "h": "React Developer Tools：尽早装、尽早熟",
          "p": [
            "随着学习推进，你的项目会越来越大、组件越来越多、功能越来越复杂。这时候，能够**追踪应用内部的活动部件**（甚至实时修改它们）来理解与调试代码，就变得非常有用。",
            "为此官方点名一个 Chrome 扩展：**React Developer Tools**（本站资料区有商店页链接）。官方建议：**尽早安装、尽早用熟**——它是高效 React 开发的无价工具。Assignment 第 2 条配了 DebugBear 的入门指南，细节看不懂没关系，先混个脸熟。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "bash",
          "code": "# 前提：最新 LTS 版 Node（node -v 核对）\n\n# 标准姿势：新建项目目录\nnpm create vite@latest my-first-react-app -- --template react\n# 问答口径：安装 create-vite？输 y 回车 / 实验特性？no / Install with npm and start now? yes\n# 成功输出：\n#   ➜  Local:   http://localhost:5173/\n#   ➜  Network: use --host to expose\n# 浏览器打开 localhost:5173 → Vite React 模板首页\n# Ctrl+C 停服；之后项目目录里随时：\nnpm run dev\n\n# 变体：已克隆好的空 GitHub 仓库里就地初始化（目录已连好远端）\ncd my-cloned-repo\nnpm create vite@latest . -- --template react",
          "note": "官方命令与交互问答口径原样收录；`.` 作项目名的变体来自官方贴士块。"
        },
        {
          "lang": "jsx",
          "code": "// src/main.jsx —— 应用入口，五步逐行认：\nimport { StrictMode } from \"react\";            // ① 从 react 包导入 StrictMode（开发期检查组件）\nimport { createRoot } from \"react-dom/client\"; // ① 从 react-dom/client 导入 createRoot\nimport App from \"./App.jsx\";                   // ② 导入 App 组件，准备渲染进 DOM\nimport \"./index.css\";                          // ③ 导入全局 CSS（Webpack 课见过的语法）\n\nconst root = createRoot(document.getElementById(\"root\")); // ④ 用 index.html 的 root 元素建根\nroot.render(                                   // ⑤ 渲染：React 应用与真实 DOM 的接线点\n  <StrictMode>\n    <App />\n  </StrictMode>,\n);",
          "note": "官方 main.jsx 的等价展开（官方写成链式一行，本站拆成两行并逐步编号，语义完全一致）。「看不懂大半是正常的」——官方原话；但 createRoot + render 这对组合从第一天就要记住。"
        }
      ],
      "pitfalls": [
        {
          "title": "Node 版本不是最新 LTS",
          "text": "官方点名这是报错源头：Vite 与模板依赖较新的 Node 特性。开工前 node -v 核对，版本旧了先用你在 Foundations 学过的 nvm（或官方安装方式）升级，再跑创建命令。"
        },
        {
          "title": "跟着老教程用 Create React App",
          "text": "CRA 2023 年初已弃用，但老教程遍地都是它。识别方法：看到 npx create-react-app 就该警觉——换成 npm create vite@latest <名字> -- --template react，概念不受影响。"
        },
        {
          "title": "在已克隆仓库里又套了一层项目目录",
          "text": "先克隆了 GitHub 仓库、再在仓库里跑标准命令，会得到 仓库/项目名/ 的双层嵌套，git 远端对不上。正确姿势是官方贴士：cd 进仓库后用 `.` 作项目名——npm create vite@latest . -- --template react，就地初始化。"
        },
        {
          "title": "看不懂 main.jsx 就卡住不敢往前走",
          "text": "官方明确说「现在不指望你能看懂多少」。这一课对 main.jsx 的要求只有一条：知道它是入口、createRoot + render 是 React 与 DOM 的接线点。JSX 下一课讲、组件再下一课讲、StrictMode 的深意后面自然揭晓——标记疑问，继续走。"
        }
      ],
      "official": {
        "assignment": [
          "通读 Vite 的 Getting Started 页面来复习这些材料（官方中文文档 cn.vitejs.dev/guide/ 同内容）",
          "看这篇 React Developer Tools 指南（DebugBear），开始学习怎么用它——有些细节现在看不懂也没关系",
          "试着清理你的 my-first-react-app 项目，让它不再显示默认页面——看能不能改成显示一条「Hello, World!」消息"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/introduction/setting_up_a_react_environment.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "4dfa3c0230beb3afa375f9f25c7b640d04ed31be78ea282f5a514b4cf8757ca1",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-react-new-react-components",
      "title": "React Components",
      "zh": "React 组件",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-react-components",
      "summary": "「React 入门」章节的开篇课：组件是 React 把 UI 拆成的独立、可复用的块。官方网站把一个页面拆成 App（主应用、所有组件的父级）、Navbar（导航栏）、MainArticle（主内容）、NewsletterForm（订阅表单）四块给你看。组件本质上就是 JavaScript 函数——接收某种输入、返回一个 React 元素。本课动手创建第一个函数组件 Greeting：单独住在 Greeting.jsx 文件里（独立于代码库其余部分）、必须大写命名（React 靠大小写区分 HTML 标签与组件实例）、用 export default 导出、再在 main.jsx 里导入并替换 App 渲染。官方还交代一个版本事实：React v17.0 起，使用组件的文件不再必须 import React。",
      "guide": "以下是官方原课的中文化梳理。这是「React 入门」章节的第一课，也是你写第一行 React 代码的课。心智主线两条：其一，**组件 = 返回 React 元素的 JavaScript 函数**——没有新魔法，你在 World 3 学的函数就是它的全部底座；其二，**大写命名是硬规则不是风格偏好**——JSX 解析时 React 靠首字母大小写区分「这是个 HTML 标签」还是「这是个组件实例」，小写的 <greeting /> 会被当成普通 HTML 元素忽略掉。实操路径照官方走：在上节课建好的项目里新建 Greeting.jsx、写一个返回 JSX 的函数、export default 导出、回到 main.jsx 导入并把 render 里的 <App /> 换成 <Greeting />——看到自己的组件上屏，这一课就成立了。官方特别提醒：跟着敲、**别复制粘贴**。课文里那句组件台词（「我以此起誓，我会终结你」）是《银河护卫队》的梗，官方幽默原样保留。",
      "understand": [
        "React 之美：允许把 UI（用户界面）拆成**独立、可复用的块**——这些块就叫组件（components）",
        "官方示例拆法：一个网站可以拆成 App（主应用，所有其他组件的父级）、Navbar（导航栏）、MainArticle（渲染主内容）、NewsletterForm（让用户输邮箱订阅周报的表单）",
        "组件的函数视角：把这些可复用的块想成 **JavaScript 函数**——接收某种输入、返回一个 React 元素",
        "函数组件（functional component）就是 JavaScript 函数：`function Greeting() { return <h1>...</h1>; }`——函数返回 JSX",
        "**组件必须大写命名**，否则不会按预期工作——这是 React 的硬规则；官方让你自己试小写会发生什么",
        "「JavaScript 里怎么出现了 HTML？」——那是 JSX，第一眼很突兀，但马上就会领略它的酷；下一课专门讲",
        "组件住在自己专属的文件里（如 Greeting.jsx）——这让它**独立于代码库其余部分**；但独立不等于隔绝：组件要用别处的功能、也要把自己分享出去，靠的是 import 与 export",
        "版本事实：曾经很长一段时间，用到 React 组件的 JS 文件必须 `import React`——**自 React v17.0 起不再需要**",
        "导出组件让父组件能在整个项目里把它当子组件使用：`export default Greeting;`",
        "main.jsx 不会自动知道你新建的组件——要先 import，再把它放进 render（官方演示：替换掉 <App />）",
        "`<Greeting />` 必须大写：JSX 解析时，React 用**首字母大小写**区分 HTML 标签与 React 组件实例——`<greeting />` 会被解释成没有特殊含义的普通 HTML 元素，而不是你崭新的组件"
      ],
      "terms": [
        {
          "en": "Component",
          "zh": "组件：UI 拆分出的独立、可复用的块；函数视角下就是「接收输入、返回 React 元素」的 JavaScript 函数"
        },
        {
          "en": "Functional component",
          "zh": "函数组件：以 JavaScript 函数形式写的组件——返回 JSX；本课程只用函数组件（类组件在 World 5 第四章作为历史与旧代码库知识讲解）"
        },
        {
          "en": "JSX",
          "zh": "JavaScript XML：让 JS 函数能「返回 HTML 样标记」的语法扩展——组件 return 的那段尖括号代码；下一课正式展开"
        },
        {
          "en": "Capitalization rule",
          "zh": "大写命名规则：组件名首字母必须大写——React 解析 JSX 时靠它区分 HTML 标签（小写）与组件实例（大写），小写组件会被当成普通 HTML 元素"
        },
        {
          "en": "export default / named export",
          "zh": "默认导出 / 具名导出：组件通常默认导出（一个文件一个主角）；官方作业让你顺带练具名导出（MDN export 文档在 javascript 课程 ES6 模块课资料区）"
        },
        {
          "en": "Parent / child component",
          "zh": "父组件 / 子组件：渲染别的组件的组件是父组件（如 App），被渲染的是子组件——组件树的基本关系"
        }
      ],
      "tasks": [
        "打开上节课的 my-first-react-app 项目，新建 Greeting.jsx，亲手写一个函数组件——名字随你起、返回的 JSX 随你写（官方要求：**跟着敲，别复制粘贴**）",
        "写完先自查函数名首字母是否大写，再 export default 导出",
        "回到 main.jsx：导入你的组件，把 render 里的 <App /> 换成你的组件——localhost:5173 上看到自己的组件上屏",
        "做官方的小实验：把导入名、函数名、使用处全改成小写，观察发生了什么，再改回大写——亲眼验证「大小写是组件与 HTML 标签的分界」",
        "完成官方 Assignment：在同一项目里再建几个组件（比如展示你最喜欢的食物），并试用**具名导出**（named exports）替代默认导出——不确定怎么写就查 MDN export 文档（本站 javascript 课程 ES6 模块课资料区有中文版入口）"
      ],
      "quiz": [
        {
          "question": "官方把网站示例拆成了哪四个组件？「组件」的本质视角是什么？",
          "answer": "App（主应用，所有其他组件的父级）、Navbar（导航栏）、MainArticle（渲染主内容）、NewsletterForm（邮箱订阅表单）。本质视角：组件是可复用的 UI 块，可以把它想成 JavaScript 函数——接收某种输入、返回一个 React 元素。「输入」就是下一课要学的 props，「返回 React 元素」靠的就是 JSX。"
        },
        {
          "question": "为什么 <greeting /> 小写就不工作，而 <Greeting /> 大写就可以？",
          "answer": "JSX 解析时，React 用首字母大小写来区分 HTML 标签与 React 组件实例：小写被解释成普通 HTML 元素（greeting 不是合法 HTML 标签，就没有任何特殊含义、什么也不渲染），大写才会被当作你定义的组件去找对应函数。所以「组件必须大写命名」不是代码风格偏好，而是 React 的解析规则。"
        },
        {
          "question": "新建的 Greeting.jsx 导出了组件，为什么页面上还是看不到？",
          "answer": "因为 main.jsx 还不知道它的存在——组件住在自己的专属文件里保持独立，要用它必须由使用方显式 import。完整接线三步：Greeting.jsx 里 export default Greeting → main.jsx 里 import Greeting from './Greeting.jsx' → render 里使用 <Greeting />（官方演示是替换掉 <App />）。"
        },
        {
          "question": "「用 React 的文件必须 import React」这个说法现在还成立吗？",
          "answer": "不再成立。曾经很长一段时间这是必须的，但自 React v17.0 起，在用到 React 组件的 JavaScript 文件里不再需要 import React。老教程和旧代码库里还到处能看到这行导入——知道它是历史遗留即可，新代码不需要。"
        }
      ],
      "optional": [],
      "note": "官方正文的组件拆解示例图为 statically CDN 课程配图（react/imgs/00.png），按既有口径剔除、文字转述其内容；Assignment 里的 MDN export 语句文档（#description 锚点）与 javascript 课程 ES6 模块课的既有条目同页——跨课合并归属首现课，本课不重复登记（**全站首个「跨课合并后零条目」课**），任务映射按「资源归属课」纪律不接。示例代码里 Greeting 组件的台词「I swear by my pretty floral bonnet, I will end you.」是《银河护卫队》德拉克斯的台词梗，官方幽默原样保留、不做本地化替换。",
      "why": "组件是 React 一切概念的容器：props 是组件的输入、状态是组件的记忆、JSX 是组件的输出格式——后面每一课都在往这个容器里添东西。这一课动手做的「建文件 → 写函数 → 导出 → 接线进 main.jsx」也是你之后每新增一个组件都会重复的标准动作，第一次就把它走顺。",
      "sections": [
        {
          "h": "什么是组件：独立、可复用的 UI 块",
          "p": [
            "React 之美在于：它允许你把一个 UI（用户界面）拆成**独立、可复用的块**——这些块就叫**组件**（components）。官方配了一张示例图（在官方课页可看）：构建一个非常基础的应用时该怎么拆。",
            "以官方网站自己为例，可以拆成：**App**——主应用，所有其他组件的父级；**Navbar**——导航栏；**MainArticle**——渲染主内容的组件；**NewsletterForm**——让用户输入邮箱、订阅每周简报的表单。",
            "官方给的本质视角：把这些可复用的块想成 **JavaScript 函数**——接收某种输入、返回一个 React 元素。你在 World 3 学的函数功底，从这里开始直接变现。"
          ]
        },
        {
          "h": "创建函数组件：Greeting 实战与大写规则",
          "p": [
            "为了找到用组件干活的手感，官方带你练**函数组件**（functional components）——函数组件是什么？就是 JavaScript 函数：",
            "`function Greeting() { return <h1>\"I swear by my pretty floral bonnet, I will end you.\"</h1>; }`（台词是《银河护卫队》的梗，官方幽默）。",
            "这段代码你看着眼熟——它就是一个返回 JSX 的 JavaScript 函数。打开你在上节课建的项目，新建一个 `Greeting.jsx` 文件，亲手写一个你自己的函数组件：名字随你、返回的 JSX 随你。**跟着敲，别复制粘贴。**",
            "写完了？检查函数名——**首字母大写了没有**？记住这个关键差异：**React 组件必须大写命名**，否则不会按预期工作。这就是官方把 Greeting 的 G 大写的原因，为什么大写在本课最后一节揭晓。"
          ]
        },
        {
          "h": "JavaScript 里怎么出现了 HTML：JSX 预告",
          "p": [
            "你可能想问：函数返回的那段 `<h1>...</h1>` 是什么情况——HTML 怎么跑进 JavaScript 里了？",
            "那是 **JSX**。官方说它第一眼看起来很突兀（jarring），但你很快就会意识到它有多酷。下一课（什么是 JSX）会专门讲它——现在只需要知道：组件函数返回的就是 JSX。"
          ]
        },
        {
          "h": "组件住在哪里：专属文件、import/export 与 main.jsx 接线",
          "p": [
            "组件住在自己专属的文件里（Greeting.jsx）——这让它**独立于代码库其余部分**。但独立不等于隔绝：我们既想让组件用上别处创建的功能，也想把它分享给其他组件。怎么做？**import 与 export**。",
            "官方顺带交代一个版本事实：曾经在很长一段时间里，用到 React 组件的 JavaScript 文件都必须 `import React`——**自 React v17.0 起不再需要了**。",
            "第一步，导出：`export default Greeting;`——让父组件们能在整个项目里把它当子组件用。",
            "第二步，接线：main.jsx 还不知道 Greeting 的存在。看 main.jsx——`render()` 正在渲染 App 组件；把 App 换成我们新建的 Greeting（记得先正确导入）。官方给了接线完成后的 main.jsx 全貌（本站示例区同款）。",
            "第三步，验证大小写规则：`<Greeting />` 必须大写！官方邀请你做实验——把导入、函数名、使用处全改成小写看看会发生什么：**JSX 解析时，React 用大小写区分 HTML 标签与 React 组件实例**。`<greeting />` 会被解释成一个没有特殊含义的普通 HTML 元素，而不是你崭新的 React 组件。",
            "做完实验改回大写——就这样，你成功导入并使用了第一个亲手写的组件。恭喜！"
          ]
        }
      ],
      "examples": [
        {
          "lang": "jsx",
          "code": "// Greeting.jsx —— 第一个函数组件：函数返回 JSX，名字必须大写\nfunction Greeting() {\n  return <h1>\"I swear by my pretty floral bonnet, I will end you.\"</h1>;\n}\n\nexport default Greeting; // 导出，让父组件能在全项目使用它",
          "note": "官方示例原样收录（台词是《银河护卫队》梗）。跟着敲一遍，别复制粘贴——官方要求。"
        },
        {
          "lang": "jsx",
          "code": "// main.jsx —— 把新组件接线进入口：导入 + 替换 render 里的 <App />\nimport { StrictMode } from \"react\";\nimport { createRoot } from \"react-dom/client\";\nimport App from \"./App.jsx\";\nimport Greeting from \"./Greeting.jsx\"; // 先导入，main.jsx 才知道它的存在\nimport \"./index.css\";\n\ncreateRoot(document.getElementById(\"root\")).render(\n  <StrictMode>\n    <Greeting /> {/* 大写！小写的 <greeting /> 会被当成普通 HTML 元素忽略 */}\n  </StrictMode>,\n);",
          "note": "官方接线示例：App 的导入还留着（暂时没用到），render 里换成了 Greeting。v17.0 起无需 import React。"
        }
      ],
      "pitfalls": [
        {
          "title": "组件名小写，页面一片空白",
          "text": "React 靠首字母大小写区分 HTML 标签与组件：<greeting /> 被当成没有特殊含义的普通 HTML 元素，什么都不渲染，也不报错给你看。组件函数名与使用处都要大写开头——这是解析规则，不是风格偏好。"
        },
        {
          "title": "导出了组件却忘了在 main.jsx 导入使用",
          "text": "export default 只是「允许别人用」，main.jsx 不 import 就永远不知道它存在。新组件上屏的完整链路：专属文件写函数 → export default → 使用方 import → JSX 里使用。少一环都看不到。"
        },
        {
          "title": "跟着老教程在每个文件顶部 import React",
          "text": "React v17.0 起不再需要这行导入。老代码库和老教程里遍地都是它——知道是历史遗留即可，新代码不写；写了也不报错，但属于噪音。"
        }
      ],
      "official": {
        "assignment": [
          "是时候创建一些新组件了！还用同一个项目，随意折腾——比如试着展示你最喜欢的食物",
          "（上一条的子项）组件通常用默认导出（export default），试试改用**具名导出**（named exports）——不确定怎么做就请教你最好的朋友：MDN 关于 export 语句的文档（Description 节）"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/getting_started_with_react/react_components.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "e15e7a40ba8bfdb4bff96e6ab83ef0b7075549dd104aa19818b163c624067080",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-react-new-what-is-jsx",
      "title": "What Is JSX?",
      "zh": "什么是 JSX",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-what-is-jsx",
      "summary": "JSX 是 JavaScript 的语法扩展，让你在 JS 文件里写 HTML 样的标记。它不是写 React 组件的必需品，但能让组件更简洁。本质：JSX 是 React createElement 函数的语法糖——创建出来的 React 元素是普通对象，所以 JSX 最终会被编译成普通 JavaScript 对象。为什么用它：渲染逻辑与标记本来就天然耦合，JSX 让 React 把两者放进同一个地方（组件）实现关注点分离，还更直观、报错更有用。三条硬规则：① 返回单个根元素（多元素要包一层父标签，或用 Fragment <>...</>）；② 显式闭合所有标签（<input />、<li></li>）；③ 大多数东西用 camelCase（class 是保留字改 className、stroke-width 改 strokeWidth）。最后官方带做一遍 HTML→JSX 转换实战：三个错误逐个修，每修一个才暴露下一个。",
      "guide": "以下是官方原课的中文化梳理。上一课你写了返回 JSX 的组件，这一课回答「那到底是什么」。三层理解：① 定义层——JSX 是 JS 的语法扩展，允许在 JS 文件里写 HTML 样标记；不是必需，但更简洁。② 本质层——它是 createElement 的语法糖，React 元素是普通对象，JSX 编译后就是普通 JS 对象（这句话是「React 就是 JS」的第一次落地）。③ 规则层——把合法 HTML 直接抄进组件是跑不起来的，JSX 有三条自己的规则：单根元素（Fragment 是不想加多余 div 时的答案）、显式闭合、camelCase 属性名（class→className 是最高频的一个）。规则的背后逻辑统一：JSX 终究要变成 JS 对象与函数调用，所以属性名要能当对象键（不能有连字符、不能撞保留字）、返回要能包进一个调用（所以单根）。转换实战一节值得亲手跟做——官方刻意让你体验「错误逐个暴露」：修好第一个才看见第二个，这不是你改出了新错误，只是 React 还没轮到报它。",
      "understand": [
        "JSX = JavaScript 的**语法扩展**（syntax extension），让你在 JavaScript 文件里书写 HTML 样的标记",
        "写 React 组件**不是必须**用 JSX——但它能让组件写起来更简洁",
        "本质：JSX 是 React **createElement 函数**的**语法糖**；createElement 创建的 React 元素是一个**普通对象**，所以 JSX 最终编译成普通 JavaScript 对象",
        "为什么用 JSX：应用里渲染逻辑与标记**天然耦合**，传统做法却把它们分在不同文件——JSX 让 React 把渲染逻辑与内容放进**同一个地方（组件）**，以此实现关注点分离（separate concerns）",
        "JSX 的另外两个好处：在代码里处理 UI 更**直观、可视化**；让 React 能给出**更有用的错误与警告信息**",
        "把合法 HTML 原样抄进 React 组件**跑不起来**——JSX 有 HTML 没有的规则",
        "规则一：**返回单个根元素**——要返回多个元素就包一层父标签；不想引入多余容器时用 **React Fragment**：`<>Children</>`",
        "规则二：**闭合所有标签**——HTML 里很多标签自闭合/自包裹，JSX 必须显式闭合：`<input>` 写成 `<input />`、`<li>` 写成 `<li></li>`",
        "规则三：**大多数东西 camelCase**——JSX 会变成 JavaScript，元素属性会变成 JS 对象的键，所以不能用连字符或保留字（如 class）：`stroke-width` → `strokeWidth`、`class` → `className`",
        "HTML→JSX 转换实战的三个错误按序修：先包根容器、再闭合 input、最后 camelCase 属性——**错误是逐个暴露的**：修好第一个才看见第二个，不代表你的修改制造了新错误，只是 React 之前还没轮到报它",
        "跟做转换示例时应在本地环境进行；也可以用 **react.new** 在浏览器里秒开一个 React 环境（实测跳转到 CodeSandbox 的官方 React 模板沙箱）",
        "屏幕上的报错修完后，剩下的错误会出现在**控制台**里——看 console 也是 JSX 排错的基本功",
        "官方约定（Assignment 前言）：之后很多课的作业是读 React 文档，文档末尾的小任务官方不再逐次点名——**但都要做**，熟能生巧"
      ],
      "terms": [
        {
          "en": "JSX",
          "zh": "JavaScript XML：JS 的语法扩展，让你在 JS 文件里写 HTML 样标记；createElement 的语法糖，编译后是普通 JS 对象"
        },
        {
          "en": "createElement",
          "zh": "React 创建元素的底层函数：返回一个描述 UI 的普通对象——JSX 就是它的语法糖（官方文档参考页在本站资料区，有中文版）"
        },
        {
          "en": "Syntactic sugar",
          "zh": "语法糖：不新增能力、只让代码更好写好读的语法——JSX 对 createElement 调用的关系就是典型语法糖"
        },
        {
          "en": "React Fragment",
          "zh": "React 片段：<>...</>（或 <Fragment>）——满足「单根元素」规则但不往 DOM 里加多余容器的包装；官方参考页在本站资料区，有中文版"
        },
        {
          "en": "camelCase",
          "zh": "驼峰命名：连字符词写成 smallCamel（strokeWidth）——JSX 属性变成 JS 对象键，连字符不合法、class 是保留字，故属性名普遍驼峰化"
        },
        {
          "en": "className",
          "zh": "JSX 里的 class：因为 class 是 JavaScript 保留字，JSX 用 className 给元素挂 CSS 类——从 HTML 转换时最高频的改动"
        },
        {
          "en": "Separation of concerns",
          "zh": "关注点分离：把不同职责的代码分开管理——JSX 的分法是按组件切（一个组件同时管自己的逻辑与标记），而不是按文件类型切"
        }
      ],
      "tasks": [
        "在本地项目（或 react.new 的浏览器沙箱）亲手跟做官方的 HTML→JSX 转换实战：那段 h1 + svg + form 的 HTML 原样贴进组件，然后按课文顺序修三个错误——单根、闭合 input、strokeWidth",
        "体会「错误逐个暴露」：每修一个错误记录 React 报的下一个是什么——建立「报错只报当前最外层问题」的预期，以后不被连环错吓到",
        "把你上一课写的 Greeting 组件检查一遍：单根？标签全闭合？属性 camelCase？",
        "完成官方 Assignment 两条：精读 React 文档「使用 JSX 书写标签语言」页复习本课、再读「在 JSX 中通过大括号使用 JavaScript」页预习下一课的动态值——两页都有官方中文版（本站资料区直达）；**文档末尾的小任务照官方约定全部做掉**",
        "读文档时顺手体验：官方说 JSX 让报错更有用——故意写错一个标签闭合，看 React 的报错指到第几行"
      ],
      "quiz": [
        {
          "question": "「JSX 是 createElement 的语法糖」这句话是什么意思？编译后 JSX 变成了什么？",
          "answer": "语法糖 = 不新增能力、只让代码更好写。你写的 <h1>hi</h1> 底层其实是 React.createElement('h1', null, 'hi') 这样的函数调用；createElement 返回的 React 元素是一个普通对象（描述「渲染什么」的数据），所以 JSX 最终会被编译成普通 JavaScript 对象。「React 就是 JS」在语法层的体现就是这句话。"
        },
        {
          "question": "组件要返回三个并列元素，又不想往 DOM 里加一层多余的 div，怎么办？",
          "answer": "用 React Fragment：<>...</> 把三个元素包起来——它满足「返回单个根元素」的规则，但自身不会渲染成任何 DOM 节点。规则背景：JSX 编译成函数调用，一次 return 只能有一个根表达式，所以多元素必须有一个包装；Fragment 就是「不产生 DOM 的包装」。"
        },
        {
          "question": "为什么 JSX 里 class 要写成 className、stroke-width 要写成 strokeWidth？",
          "answer": "因为 JSX 会变成 JavaScript，元素的属性会变成 JS 对象的键：class 是 JavaScript 的保留字（用来定义类），不能当键名直接用，所以换成 className；stroke-width 里的连字符在 JS 标识符里不合法，所以驼峰化成 strokeWidth。规律：大多数 HTML 属性在 JSX 里都按 camelCase 写。"
        },
        {
          "question": "转换实战里修好第一个错误后冒出了第二个错误——是你的修改把代码改坏了吗？官方怎么解释？",
          "answer": "不是。官方明确说：这不代表你之前的修改制造了错误，只是 React 还没显示这一个——报错是逐个暴露的，修好当前最外层的问题，下一个才轮到报。跟做时的正确心态：按序修、每次只处理眼前这个错误；屏幕报错清零后再看控制台（有些错误只出现在 console）。"
        },
        {
          "question": "官方在 Assignment 前言里立了什么约定？",
          "answer": "之后的课会大量阅读 React 文档，文档末尾大多带检验理解的小任务——官方不会每次都明确点名，但你都要做（Practice makes perfect）。这也是本站把每课 Assignment 的文档链接都接了中文版入口的原因：读中文版做小任务同样成立，术语对照以官方中文文档为准。"
        }
      ],
      "optional": [],
      "note": "官方正文的「JSX 元素 console.log 值」截图为 statically CDN 课程配图（what_is_jsx/imgs/00.png），按既有口径剔除、文字转述其结论（打印出来是普通对象）。正文两个 React 文档参考页（createElement 与 Fragment）与 Assignment 两页文档均登记本站资料区——**全部有官方中文版**（zh-hans.react.dev，实测锚点与英文版同 slug 不本地化）。react.new 实测跳转到 CodeSandbox 的官方 React 模板沙箱（codesandbox.io/p/sandbox/react-new），按操作工具入口登记。",
      "why": "JSX 是你之后每天要写的东西，这一课把「它是什么」钉死：不是模板语言、不是 HTML——是 JS 的语法糖，编译后是普通对象。这个认知决定了你排错的方向：JSX 报错本质是 JS 报错，三条规则（单根、闭合、驼峰）全部能从「它要变成合法的 JS 函数调用」推出来，不需要死记。",
      "sections": [
        {
          "h": "JSX 是什么：语法扩展与语法糖",
          "p": [
            "定义：**JSX 是 JavaScript 的语法扩展**（syntax extension），让你在 JavaScript 文件里书写 HTML 样的标记。写 React 组件不是必须用 JSX，但它确实能让组件更简洁。",
            "本质：JSX 是 React **createElement 函数**的**语法糖**。createElement 创建一个 React 元素——它是一个**普通对象**（plain object）。所以：JSX 编译到底，就是普通的 JavaScript 对象。",
            "官方配了一张截图（官方课页可看）：一个带文字的 div JSX 元素被 console.log 出来的值——就是一个描述这个元素的普通 JS 对象。"
          ]
        },
        {
          "h": "为什么用 JSX：耦合的逻辑与标记",
          "p": [
            "应用里的**渲染逻辑**与**标记**本来就是天然耦合的（inherently coupled），但传统做法是把逻辑与标记分在不同文件里（JS 一边、HTML 一边）。",
            "JSX 让 React 用另一种方式实现**关注点分离**：把渲染逻辑与内容放进**同一个地方——组件**。分离的单位从「文件类型」变成「组件」。",
            "在此之上还有两个好处：在代码里处理 UI 是更**直观、可视化**的方式；并且让 React 能展示**更有用的错误与警告信息**。"
          ]
        },
        {
          "h": "JSX 三条规则：单根、闭合、camelCase",
          "p": [
            "把一段合法 HTML 原样抄进 React 组件——**跑不起来**。因为 JSX 有 HTML 没有的规则，共三条。",
            "**规则一：返回单个根元素。**想返回多个元素，就包一层父标签——可以是 `<div>`；不想让元素们有个容器，就用 **React Fragment**：`<>Children</>`。官方给了正反示例（本站示例区同款）：两个并列的 h1/h2 直接返回是错的，包进 <> </> 或 <div> 才对。",
            "**规则二：闭合所有标签。**HTML 里很多标签自闭合、自包裹；JSX 必须显式闭合与包裹：`<input>` 要写成 `<input />`，`<li>` 要写成 `<li></li>`。",
            "**规则三：大多数东西 camelCase。**JSX 会变成 JavaScript，元素属性会变成 JS 对象的键——所以不能用连字符、也不能用 `class` 这样的保留字。很多 HTML 属性因此写成驼峰：`stroke-width` → `strokeWidth`，`class` → `className`。官方用一段 div + svg + circle 的正反示例演示（本站示例区同款）。"
          ]
        },
        {
          "h": "转换实战：HTML → JSX 逐个修错",
          "p": [
            "官方给了一段「问题 HTML」：h1 + svg（circle 带 stroke-width）+ form（input 未闭合），直接 return 会报一堆错。跟做要求：在本地环境跟着修；也可以用 **react.new** 在浏览器里秒开一个 React 环境。",
            "**错误一：不是单根**——给整段包一个容器 `<div>`。修完后**冒出新错误**：官方解释——这不代表你的修改制造了错误，只是 React 还没显示这一个（错误逐个暴露）。",
            "**错误二：input 没闭合**——`<input type=\"text\">` 改成 `<input type=\"text\" />`。修完后屏幕上的报错消失，这次的错误出现在**控制台**里。",
            "**错误三：属性没 camelCase**——`stroke-width` 是无效的 DOM 属性写法，改成 `strokeWidth`。",
            "三处修完，这段代码就是可以在 React 组件里无痛使用的、成色十足的 JSX 了。"
          ]
        },
        {
          "h": "作业与文档阅读约定",
          "p": [
            "官方在 Assignment 前言里立了个约定：接下来的课你会花不少时间读 React 文档，大多数文档末尾有检验理解的小任务——官方不会每次明确点名，**但都要做**（熟能生巧）。",
            "本课两条作业都是 React 文档：**「使用 JSX 书写标签语言」**（Writing Markup with JSX，复习本课内容）与**「在 JSX 中通过大括号使用 JavaScript」**（JavaScript in JSX with Curly Braces，预习在标记里写 JS 逻辑、引用动态值——下一课渲染列表与再下一课 props 的地基）。两页都有官方中文版，本站资料区直达。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "jsx",
          "code": "// 规则一：单根元素——正反对照\nfunction AppWrong() {\n  return (\n    <h1>Example h1</h1>\n    <h2>Example h2</h2>   // ✗ 两个并列根，编译报错\n  );\n}\nfunction AppRight() {\n  return (\n    <>\n      <h1>Example h1</h1>\n      <h2>Example h2</h2> {/* ✓ Fragment 包根，不产生多余 DOM 节点 */}\n    </>\n  );\n}",
          "note": "官方正反示例；<>...</> 是 React Fragment 的简写（完整形态 <Fragment>，参考页在资料区）。"
        },
        {
          "lang": "jsx",
          "code": "// 规则二 + 规则三：闭合所有标签、大多数东西 camelCase\n// ✗ HTML 原样抄进来跑不通：\n// <div class=\"container\">\n//   <svg><circle stroke-width=\"2\" /></svg>\n//   <form><input type=\"text\"></form>\n// </div>\n\n// ✓ JSX 形态：\nfunction App() {\n  return (\n    <div className=\"container\">{/* class 是 JS 保留字 → className */}\n      <svg>\n        <circle cx=\"25\" cy=\"75\" r=\"20\" stroke=\"green\" strokeWidth=\"2\" />{/* 连字符 → 驼峰 */}\n      </svg>\n      <form>\n        <input type=\"text\" />{/* 自闭合标签显式闭合 */}\n      </form>\n    </div>\n  );\n}",
          "note": "官方转换实战的终点形态——三个错误（单根、闭合、camelCase）在这一段里全部就位。"
        }
      ],
      "pitfalls": [
        {
          "title": "把合法 HTML 直接抄进组件",
          "text": "HTML 与 JSX 长得像但规则不同：class、stroke-width、未闭合的 input 在 JSX 里全报错。转换口诀三条：包单根（Fragment 免加 div）、闭标签、驼峰属性。按官方实战顺序修，一次只处理当前报的那个错。"
        },
        {
          "title": "修出一个新错误就慌了",
          "text": "错误是逐个暴露的：修好第一个才看见第二个——官方明确说这不是你的修改制造了错误，只是 React 还没轮到报它。按序修下去，屏幕报错清零后再看控制台。"
        },
        {
          "title": "用 Fragment 时手滑写成 <></ > 或漏掉斜杠",
          "text": "Fragment 简写是 <> 与 </>，中间不能有空格或其他字符。JSX 对标闭合非常严格（规则二），少一个斜杠都会编译报错——报错信息会指到行号，回到那一行找没闭合的标签。"
        }
      ],
      "official": {
        "assignment": [
          "通读 React 文档「Writing Markup with JSX（使用 JSX 书写标签语言）」页，复习本课覆盖的内容（官方中文版入口在本站资料区；按官方在作业面板前言立的约定：文档末尾检验理解的小任务不再逐次点名，但都要做）",
          "通读 React 文档「JavaScript in JSX with Curly Braces（在 JSX 中通过大括号使用 JavaScript）」页，开始学习在标记里书写 JavaScript 逻辑、引用动态值（官方中文版入口在本站资料区）"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/getting_started_with_react/what_is_jsx.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "f5bafca750397678aae38a150b6bf7e132892d1df81317ef69045061075e0e3a",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-react-new-passing-data-between-components",
      "title": "Passing Data Between Components",
      "zh": "在组件间传递数据",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-passing-data-between-components",
      "summary": "props（properties 的缩写）是组件间传数据的机制：数据经 props 从父组件**单向**流向子组件——任何改动只影响使用该数据的子组件，不影响父级或兄弟组件，这种受限的数据流给你更显式的控制、让应用更少的出错。本课用一个 Button 组件的演化讲透四步：① 无 props 的可复用按钮遇到「第二个按钮文字不同」就得复制出 Button2——十个变体就是复制灾难；② 加 props 参数（props.text / props.color / props.fontSize），一个组件吃下全部变体，渲染时在组件标签上定义 prop 值；③ 参数解构（{ text, color, fontSize }）让代码更简洁，默认参数给 prop 兜底防 undefined——顺带交代 defaultProps 的历史（类组件时代产物，函数组件已不接受，但旧代码库还会见到）；④ 函数也能当 props 传——传引用不带括号，带参数时用匿名函数包一层，否则函数会在渲染期间被直接调用。",
      "guide": "以下是官方原课的中文化梳理。这一课是 React 数据流的起点，心智主线是「一个组件吃下所有变体」。官方的教学设计非常直白：先让你看见没有 props 的世界有多糟（Button2 复制体），再引入 props 一步步升级——加参数、解构、默认值、传函数。四个升级点里最容易翻车的是**函数 props**：`handleClick={handleButtonClick()}`（带括号）会在渲染时立刻执行函数，正确写法是传引用 `handleClick={handleButtonClick}`；而要给函数带参数，必须包一层匿名函数 `handleClick={() => handleButtonClick(url)}`——两种写法的区别是「把函数本身交出去」还是「把执行结果交出去」，这个区分在 World 3 事件处理课你已经见过（addEventListener 同款陷阱），React 只是把它搬进了 JSX。另一个要带走的认知是**单向数据流**：props 只从父到子，改动不回流——这条限制不是缺陷，是 React 让你「数据在哪变的」永远可查的手段。官方还在课文末尾埋了个 Hint：柯里化函数是实现带参回调的另一种姿势（资料区有 javascript.info 官方中文版，选做）。",
      "understand": [
        "props = properties 的缩写：**组件间传递数据**的机制；本课回答「怎么在组件之间共享信息」「怎么让每次使用的组件可定制」",
        "React 里数据经 props **从父组件流向子组件**，且是**单向的**（unidirectional）——只朝一个方向流",
        "单向的意义：对数据的任何改动只影响**使用该数据的子组件**，不影响父组件或兄弟组件——受限的数据流 = 更显式的控制 = 应用更少的错误",
        "没有 props 的世界：Button 文字要变就得复制一个 Button2——十个按钮十种文字/字体/颜色/尺寸变体，就是**大量代码重复**",
        "props 方案：函数组件接收 `props` 作为函数参数，组件内用 `props.属性名` 引用；渲染时在组件标签上定义 prop 值：`<Button text=\"Click Me!\" color=\"blue\" fontSize={12} />`",
        "字符串 prop 直接写引号、**非字符串（数字等）要包大括号**：fontSize={12}",
        "官方示例还用 props 动态生成内联样式对象（buttonStyle = { color: props.color, fontSize: props.fontSize + 'px' }）挂到 style 属性",
        "**prop 解构**是极常见的模式：`function Button({ text, color, fontSize })`——在参数处直接解包，组件内不再写 props. 前缀，代码更简洁可读（解构语法见 MDN 文档，本站 javascript 课程资料区有中文版条目）",
        "**默认 props**：用函数参数默认值给 prop 兜底——`{ text = \"Click Me!\", color = \"blue\", fontSize = 12 }`：渲染时只给与默认值不同的 prop，其余省略；同时保护应用免受 undefined 值影响",
        "`defaultProps` 的历史地位：传统上用来设默认值、尤其常见于类组件（`Button.defaultProps = {...}`）——**React 已不再接受函数组件用这种方式**，但读旧代码库与类组件时仍要认识它",
        "**函数可以作为 props 传递**：父组件定义 handleButtonClick，把它的**引用**作为 handleClick prop 传给 Button，Button 在 onClick 事件里调用",
        "传引用**不带括号**：`handleClick={handleButtonClick()}` 会让函数在按钮**渲染期间**就被调用（执行结果被当成 prop 传过去）；正确写法 `handleClick={handleButtonClick}` 交出去的是函数本身",
        "要给函数带参数（比如每个按钮跳不同 URL），不能写 `onClick={handleClick('url')}`——必须挂一个**匿名函数引用**，由它在事件发生时再带参调用：`handleClick={() => handleButtonClick('https://www.theodinproject.com')}`",
        "官方 Hint（选做）：这个行为还有别的实现方式——**柯里化函数**（curried functions，javascript.info 有官方中文版）"
      ],
      "terms": [
        {
          "en": "Props (properties)",
          "zh": "属性/传参：父组件在子组件标签上定义的键值对，作为子组件函数的参数传入——React 组件间传数据的唯一正向通道"
        },
        {
          "en": "Unidirectional data flow",
          "zh": "单向数据流：数据只从父流向子；子组件拿到的是只读快照，改动不回流——数据「在哪变的」因此永远可查"
        },
        {
          "en": "Prop destructuring",
          "zh": "props 解构：在函数参数处直接解包 props（{ text, color }）——更简洁可读的常见模式，本质是 World 3 学过的对象解构"
        },
        {
          "en": "Default props",
          "zh": "默认 props：参数默认值语法给 prop 兜底（{ text = 'Click Me!' }）；旧的 Button.defaultProps 写法已不被函数组件接受，类组件与旧代码库仍可见"
        },
        {
          "en": "Function as prop / callback prop",
          "zh": "函数 prop（回调 prop）：把函数引用当 prop 传给子组件，由子组件在事件里调用——传引用不带括号；带参数时用匿名函数包一层"
        },
        {
          "en": "Curried function",
          "zh": "柯里化函数：把多参函数改造成逐个收参的函数链——官方 Hint 给的带参回调另一种实现（javascript.info 官方中文版在资料区，选做）"
        }
      ],
      "tasks": [
        "跟着官方 Button 演化史亲手敲四版：无 props 版 → 复制 Button2 版 → props 版 → 解构 + 默认值版——每一版都跑起来看效果，体会「一个组件吃下所有变体」",
        "做官方的小实验：把 handleClick={handleButtonClick} 改成带括号的 handleClick={handleButtonClick()}，观察按钮还没点页面就跳转了——亲眼看一次「渲染期间被调用」",
        "给三个 Button 传不同的跳转 URL，用匿名函数包装法实现——确认每个按钮各跳各的",
        "完成官方 Assignment：精读 React 文档「将 Props 传递给组件」（官方中文版在资料区），并按官方要求**动手改文档里的代码示例**、试不同的 prop 值",
        "（选做）读官方 Hint 指到的 javascript.info 柯里化一文（官方中文版在资料区），想想 handleButtonClick 的柯里化版本怎么写"
      ],
      "quiz": [
        {
          "question": "「React 的数据流是单向的」具体指什么？这条限制换来了什么？",
          "answer": "指数据经 props 只从父组件流向子组件：父传子，子不能经 props 把改动传回父，兄弟组件之间也不互相影响——对数据的改动只作用于使用该数据的子组件。换来的是显式控制：任何数据都有一个明确的「发放处」（父组件），排查「这个值哪来的」顺着组件树往上找就行，应用因此更少出错。"
        },
        {
          "question": "<Button text=\"Click Me!\" fontSize={12} /> 里，为什么 text 用引号而 fontSize 用大括号？",
          "answer": "引号里是字符串字面量——字符串 prop 可以直接写；大括号里是 JavaScript 表达式——数字、布尔、对象、函数等非字符串值都必须用大括号包起来（fontSize={12} 传的是数字 12，写 fontSize=\"12\" 传的是字符串 \"12\"）。大括号就是「从这里开始是 JS」的开关，下一课文档预习（JavaScript in JSX）会把它讲透。"
        },
        {
          "question": "handleClick={handleButtonClick} 与 handleClick={handleButtonClick()} 的区别是什么？",
          "answer": "不带括号传的是**函数引用**——按钮渲染时只是把函数交出去，事件发生才调用；带括号是**立刻执行**——按钮渲染期间函数就被调用，执行结果（比如 undefined）被当成 prop 传过去，官方例子里的表现是页面还没点就跳转了。带参数需求时用匿名函数包一层：handleClick={() => handleButtonClick(url)}——交出去的仍是引用（一个现场定义的小函数），事件发生时它才带参调用真身。"
        },
        {
          "question": "参数默认值（{ text = \"Click Me!\" }）与旧的 defaultProps 是什么关系？现在该用哪个？",
          "answer": "目的一样——给没传的 prop 兜底默认值、防 undefined。defaultProps（Button.defaultProps = {...}）是传统写法、尤其用于类组件；React 现在已不接受函数组件用 defaultProps，官方示例改用函数参数默认值。新代码一律用参数默认值；读旧代码库见到 defaultProps 认识即可。"
        },
        {
          "question": "官方 Button 演化史里，「十个按钮十种样式」的场景没有 props 会怎么写？有了 props 之后呢？",
          "answer": "没有 props：每种变体复制一个组件（Button2、Button3……十个），文字字体颜色尺寸全部硬编码——大量代码重复，改一处公共行为要改十处。有 props：一个 Button 组件接收 text/color/fontSize，渲染十次、每次在标签上给不同的值——公共行为只有一份。这就是「组件可复用」从口号变成机制的那一步：复用 + 定制靠 props 完成。"
        }
      ],
      "optional": [
        "官方 Hint：用柯里化函数（curried functions）实现带参回调的另一种方式——javascript.info 柯里化一文（官方中文版在资料区）"
      ],
      "note": "正文 prop 解构处官方链了 MDN 解构赋值文档——与本站 javascript 课程「工厂函数与模块模式」课既有条目同页，跨课合并归属首现课、本课不重复登记；正文 Hint 的 javascript.info 柯里化一文登记本课资料区（官方中文版 zh.javascript.info 实测在位，requirement 按官方 Hint 定位登记 optional）。四个 Button 代码块是官方的完整演化史，本站示例区按「演化对照」重组收录，代码语义与官方逐字一致。",
      "why": "props 是 React 组件之间唯一的正向数据通道——后面学的状态提升、Context、状态管理库，本质都是在回答「props 传不动的时候怎么办」。先把这一课的三件事变成肌肉记忆：prop 在标签上定义、在参数里解构、函数 prop 传引用不带括号。尤其第三件：它在事件处理、useEffect 清理、列表回调里反复出现，现在练熟，后面少踩一大类坑。",
      "sections": [
        {
          "h": "单向数据流：React 传数据的总规则",
          "p": [
            "到这里你已经体会到组件与复用有多强，但可能有两个疑问：「怎么在组件之间共享信息？」「每次使用组件时能不能定制它的行为？」——答案都是 **props**（properties 的缩写）。",
            "总规则：React 里，数据经 props **从父组件传向子组件**，且传输是**单向的**（unidirectional）——只朝一个方向流。",
            "对数据的任何改动，只影响**使用该数据的子组件**，不影响父组件或兄弟组件。这种对数据流的限制给了我们对数据**更显式的控制**，结果是应用里**更少的错误**。"
          ]
        },
        {
          "h": "没有 props 的世界：从 Button 到 Button2 的复制灾难",
          "p": [
            "官方的引入示例：一个 `Button` 组件（返回 `<button>Click Me!</button>`），在 `App` 里渲染三次——漂亮的可复用按钮，想用几次用几次。但有个小问题。",
            "如果第二个按钮的文字要是「Don't Click Me!」呢？现在你只能再造一个文字不同的 `Button2` 组件，App 里按顺序渲染 Button、Button2、Button。",
            "现在看起来还好——但如果有 **10 个按钮**呢？每个的文字、字体、颜色、尺寸以及其他你能想到的变体都不同？给每个变体造一个新组件，会**非常快地导致大量代码重复**。",
            "接下来官方演示：怎么用 props 让**单个** Button 组件吃下任意数量的变体。"
          ]
        },
        {
          "h": "props 三步升级：参数、解构、默认值",
          "p": [
            "**第一步，props 作函数参数**：`function Button(props)`，组件内用 `props.text` / `props.color` / `props.fontSize` 引用；官方示例还现场拼了一个内联样式对象（color 直接用、fontSize 拼上 'px'）挂到 `style`。渲染时在标签上定义 prop 值：`<Button text=\"Click Me!\" color=\"blue\" fontSize={12} />`——字符串带引号、数字包大括号。",
            "**第二步，prop 解构**：你会经常见到的模式——`function Button({ text, color, fontSize })`，在参数处直接解包，组件内不再写 `props.` 前缀。官方点名：这是为代码更简洁、更可读（解构语法本身是 World 3 的老朋友，官方链的 MDN 解构文档在本站 javascript 课程资料区有中文版条目）。",
            "**第三步，默认 props**：上面的例子里 App 内定义 prop 时有重复（好几个按钮都是蓝字 12 号）。用**函数参数默认值**停止重复、并保护应用免受 undefined 影响：`function Button({ text = \"Click Me!\", color = \"blue\", fontSize = 12 })`——渲染时只给与默认值不同的 prop（`<Button />` 什么都不传也能工作）。",
            "官方补一段历史：你可能在别的代码库见过 `Button.defaultProps = {...}` 的写法——传统上用它设默认值、尤其在类组件里。**React 已不再接受函数组件用这种方式**，但理解 defaultProps 仍有用：读类组件与旧代码库时会遇到。"
          ]
        },
        {
          "h": "函数作 props：传引用，不带括号",
          "p": [
            "除了传变量，**函数也能作为 props 传给子组件**。官方示例：App 里定义 `handleButtonClick`（跳转到 google.com），把它的引用作为 `handleClick` prop 传给 Button；Button 把它挂到 `<button onClick={handleClick}>`，点击事件发生时调用。",
            "要点一：我们传给 Button 的是 `handleButtonClick` 的**引用**——**不带括号**。如果写成 `handleClick={handleButtonClick()}`，函数会在**按钮渲染时**就被调用（而不是点击时）。",
            "要点二：这个版本里每个调用该函数的 Button 都跳**同一个页面**。想定制（每个按钮跳不同地址），就改造函数让它接收参数（`handleButtonClick(url)`），在 Button 内带参调用。",
            "要点三：带参数时**不能**直接写 `onClick={handleClick('https://www.theodinproject.com')}`——那又是立刻执行。必须挂一个**匿名函数的引用**，由它再去带参调用：`handleClick={() => handleButtonClick('https://www.theodinproject.com')}`。和上一段同理：防止函数在渲染期间被调用。",
            "官方提示块还给了另一种实现思路的 Hint：**柯里化函数**（curried functions）——javascript.info 的柯里化一文有官方中文版（本站资料区，选做）。",
            "官方的收尾：希望这些例子让你理解了 props 对写**可复用、可定制**的 React 组件有多有用——而这还只是 React 能力的冰山一角，下一节（渲染技巧）继续。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "jsx",
          "code": "// props 演化史·第 3 版：一个组件吃下所有变体（参数 + 内联样式）\nfunction Button(props) {\n  const buttonStyle = {\n    color: props.color,\n    fontSize: props.fontSize + 'px'\n  };\n  return (\n    <button style={buttonStyle}>{props.text}</button>\n  );\n}\n\nexport default function App() {\n  return (\n    <div>\n      <Button text=\"Click Me!\" color=\"blue\" fontSize={12} />{/* 字符串引号、数字大括号 */}\n      <Button text=\"Don't Click Me!\" color=\"red\" fontSize={12} />\n      <Button text=\"Click Me!\" color=\"blue\" fontSize={20} />\n    </div>\n  );\n}",
          "note": "官方示例：props 作函数参数、标签上定义 prop 值。对照第 2 版的 Button/Button2 复制体体会差别。"
        },
        {
          "lang": "jsx",
          "code": "// props 演化史·第 4 版：解构 + 默认值——只给与默认不同的 prop\nfunction Button({ text = \"Click Me!\", color = \"blue\", fontSize = 12 }) {\n  const buttonStyle = { color: color, fontSize: fontSize + \"px\" };\n  return <button style={buttonStyle}>{text}</button>;\n}\n\nexport default function App() {\n  return (\n    <div>\n      <Button />{/* 全默认 */}\n      <Button text=\"Don't Click Me!\" color=\"red\" />{/* 只覆盖两项 */}\n      <Button fontSize={20} />{/* 只覆盖字号 */}\n    </div>\n  );\n}",
          "note": "官方示例：参数解构 + 默认值兜底（防 undefined、停止重复）。旧的 Button.defaultProps 写法函数组件已不接受。"
        },
        {
          "lang": "jsx",
          "code": "// 函数作 props：传引用不带括号；带参数用匿名函数包一层\nfunction Button({ text = \"Click Me!\", color = \"blue\", fontSize = 12, handleClick }) {\n  const buttonStyle = { color: color, fontSize: fontSize + \"px\" };\n  return (\n    <button onClick={handleClick} style={buttonStyle}>\n      {text}\n    </button>\n  );\n}\n\nexport default function App() {\n  const handleButtonClick = (url) => {\n    window.location.href = url;\n  };\n\n  return (\n    <div>\n      {/* ✓ 匿名函数包一层，点击时才带参调用 */}\n      <Button handleClick={() => handleButtonClick('https://www.theodinproject.com')} />\n      {/* ✗ handleClick={handleButtonClick('...')} —— 渲染期间就被调用 */}\n      {/* ✗ 不带参版 handleClick={handleButtonClick} 所有按钮跳同一页 */}\n    </div>\n  );\n}",
          "note": "官方示例的合并整理：三种写法（正确包装 / 立刻执行陷阱 / 无参引用）并排对照。事件发生才调用，是函数 props 的全部要义。"
        }
      ],
      "pitfalls": [
        {
          "title": "handleClick={fn()} 带括号——渲染期间就执行",
          "text": "JSX 大括号里是表达式，带括号 = 立刻执行，执行结果被当成 prop 传过去。表现：组件还没交互页面就跳转了/副作用就发生了。修法：传引用不带括号；要带参数就用匿名函数包一层 () => fn(arg)。"
        },
        {
          "title": "数字 prop 写成字符串",
          "text": "fontSize=\"12\" 传的是字符串 \"12\"，fontSize={12} 才是数字 12——官方示例里 fontSize + 'px' 的拼接对两者都碰巧能跑，但比较、运算的场景会出 bug。非字符串一律大括号。"
        },
        {
          "title": "函数组件还在用 defaultProps",
          "text": "Button.defaultProps = {...} 是类组件时代的写法，React 已不接受函数组件使用。新代码用参数默认值 { text = \"Click Me!\" }；旧代码库见到 defaultProps 认识即可、别往新组件里搬。"
        },
        {
          "title": "想让子组件「改」父组件的数据，直接改 props",
          "text": "props 对子组件是只读的，数据流单向——改动不回流是设计不是缺陷。子组件需要影响父级数据时，正确通道是父组件把「修改函数」作为 prop 传下去（就是本课的函数 props），由子组件调用。这个模式在状态课（Introduction To State）会正式展开。"
        }
      ],
      "official": {
        "assignment": [
          "通读 React 文档「Passing Props to a Component（将 Props 传递给组件）」——记得动手改文档里的代码示例、试验不同的 prop 值（官方中文版入口在本站资料区）"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/getting_started_with_react/passing_data_between_components.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "17a306a978695bb3d1b62a4d1689b8493aab3c0503b05df88db5465a2122e461",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-react-new-rendering-techniques",
      "title": "Rendering Techniques",
      "zh": "渲染技巧",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-rendering-techniques",
      "summary": "两件事：渲染列表与条件渲染。列表侧——硬编码四个 <li> 能跑但不可扩展，真实场景面对的是数组：JSX 里用大括号嵌入 animals.map(...) 表达式，React 自动渲染数组；把 <ul> 抽成 List 组件、每一项抽成 ListItem 组件，就是「渲染组件列表」——「列表」泛指一切重复结构（select 里的 option、网格里的 div 都算）。map 里第一次见到 key prop：现在只需把它当组件的 ID，为什么需要它下一课专讲。条件渲染侧——三套工具：三元运算符（条件 ? 元素 : null）、&& 运算符（条件 && 元素，假时 JSX 渲染空）、if 守卫提前返回（数据没到渲染 Loading、列表为空渲染提示语）。官方专门设防一个坑：&& 左边不要放数字（0 会被渲染出来）。",
      "guide": "以下是官方原课的中文化梳理。这一课是「组件 + JSX + props」三块地基之上的第一个组合技：**把数据变成 UI**。两条主线。列表渲染的心智是「UI 是数据的映射」：你不再手写四个 li，而是写一次「一个数据项长什么样」（map 的返回值），有几个渲染几个——ListItem/List 的组件化拆分再把「一项」和「整个列表」各归各位。key 这一课先混脸熟（官方明说不用懂原理），下一课专讲。条件渲染的心智是「渲染也是表达式」：三元、&&、if 守卫三套工具各有适用面——二选一用三元、「满足才渲染」用 &&、多分支和提前退出用 if；官方刻意把「列表不存在 → Loading」「列表为空 → 提示语」的守卫模式放在 API 场景里讲，这是真实项目里每天要写的代码。两个官方设防点必须带走：&& 左边放数字会把 0 渲染到页面上（官方警告块 + React 文档 Pitfall 框）；嵌套三元和多个 && 连用「看着吓人」——能跑，但要动手试出来而不是瞪出来。另有一个 ESLint 小插曲：props 下面的波浪线（missing in props validation）现阶段可以放心忽略，嫌烦可以按官方给的配置关掉。",
      "understand": [
        "硬编码的四个 <li> 完全合法，但真实场景面对的是**数据结构（如数组）**而不是手写每一项——本课把「写 UI」升级成「从数据生成 UI」",
        "JSX 大括号里可以嵌表达式（上一课预习过）：`{animals.map((animal) => <li key={animal}>{animal}</li>)}`——map 返回新数组，**JSX 能自动渲染数组**",
        "先存变量再渲染与直接内嵌 map **完全等价**：`const animalsList = animals.map(...)` 然后 `{animalsList}`",
        "map 出的每一项都要给顶层元素一个 **key** prop——现在可以把它理解为组件的 ID；**本课不要求懂为什么**（官方明说），下一课专讲",
        "渲染**组件列表**：把「一项」抽成 ListItem（接收 props.animal）、把 <ul> 抽成 List（接收 props.animals 数组、map 后把每个 animal 作为 prop 传给 ListItem）——职责各归各位",
        "「列表」是很宽泛的说法：不限于 <li>——<select> 里动态渲染多个 <option>、网格里动态渲染多个 <div> 都是同一套技术",
        "ESLint 插曲：props（如 ListItem 的 animal）下面的波浪线提示 **missing in props validation**——这是 ESLint 关于 prop 类型的默认规则警告，课程后面才会讲；现阶段**放心忽略**，也可以在 eslint.config.js 的 rules 里加 `\"react/prop-types\": \"off\"` 关掉",
        "条件渲染工具一：**三元运算符**——用布尔值决定渲染什么：`animal.startsWith(\"L\") ? <li key={animal}>{animal}</li> : null`；返回 null 表示什么都不渲染（startsWith 是 MDN 文档在册的字符串方法，本站资料区有中文版）",
        "条件渲染工具二：**&& 运算符**——`animal.startsWith(\"L\") && <li key={animal}>{animal}</li>`：条件为 true 返回第二个操作数（元素，渲染它）；为 false 返回 false，JSX 在它的位置**什么都不渲染**",
        "官方警告（专门设防的坑）：用 && 做条件渲染时**左边不要放数字**——React 文档「条件渲染」页的 Pitfall 框有详情（本站资料区有中文版，锚点实测在位）",
        "条件渲染工具三：**if / if-else / switch**——官方演示**守卫式提前返回**：`if (!props.animals) return <div>Loading...</div>;` 与 `if (props.animals.length === 0) return <div>There are no animals in the list!</div>;`，两关都过了才渲染真列表",
        "守卫模式的真实场景：从 API 取数据要花时间——数据没到位先渲染一个指示器（Loading）是**好实践**；官方演示了把 animals 数组清空、以及整个 prop 拿掉时两个守卫分别接住的样子",
        "三元与 && 当然也能实现同样的多分支（官方给了嵌套三元与多段 && 的两个等价版本）——但**嵌套三元和多个 && 看着吓人**（can be intimidating），官方叮嘱：一定要动手试",
        "Assignment 两条都是 React 文档：「条件渲染」精读并**做完全部示例**；「渲染列表」通读——官方明示最后一节 keys 不用操心（下一课专讲）"
      ],
      "terms": [
        {
          "en": "List rendering",
          "zh": "列表渲染：用 map 把数据数组转换成元素/组件数组、交给 JSX 自动渲染——「UI 是数据的映射」的第一次落地"
        },
        {
          "en": "key prop",
          "zh": "key 属性：动态渲染列表时给每项顶层元素的 ID——本课先会用（key={animal}），为什么与怎么选自成一课（下一课）"
        },
        {
          "en": "Conditional rendering",
          "zh": "条件渲染：按条件决定渲染什么——三元（二选一）、&&（满足才渲染）、if 守卫（提前返回）三套工具"
        },
        {
          "en": "Guard clause",
          "zh": "守卫语句：函数开头的 if 提前返回——先接住「数据没到」「列表为空」等边界，主逻辑不用层层嵌套"
        },
        {
          "en": "null in JSX",
          "zh": "JSX 里的 null：渲染 null（或 false）= 该位置什么都不出现——三元「不满足」分支的标准返回值"
        },
        {
          "en": "props validation warning",
          "zh": "「missing in props validation」：ESLint 关于 prop 类型的默认规则警告——课程后面才讲，现阶段可忽略或按官方配置关闭（react/prop-types: off）"
        }
      ],
      "tasks": [
        "把官方的动物列表四步演化亲手敲一遍：硬编码 li → 数组 + 内嵌 map → 先存变量再渲染（确认两种写法效果一致）→ ListItem/List 组件化拆分",
        "做官方要求的条件渲染练习：先用三元实现「只渲染 L 开头的动物」，再改用 && 实现同一效果——对照体会两者返回值的差别（null/false 都渲染为空）",
        "把守卫版 List 跑起来：animals 给满 → 清空数组 → 把 prop 整个拿掉，观察三种渲染结果（列表 / 空提示 / Loading）",
        "（可选但官方推荐）试试嵌套三元与多段 && 的两个等价版本——亲自体会官方说的「看着吓人」，形成自己的选型偏好",
        "如果你的编辑器里 props 有波浪线，按官方给的配置在 eslint.config.js 关掉 react/prop-types 规则（课程后面会正式讲）",
        "完成官方 Assignment 两条：React 文档「条件渲染」精读并把示例全部做掉（中文版在资料区）、「渲染列表」通读（keys 一节跳过——下一课专讲；中文版在资料区）"
      ],
      "quiz": [
        {
          "question": "{animals.map((animal) => <li key={animal}>{animal}</li>)} 这段在做什么？为什么 JSX 能直接渲染它？",
          "answer": "map 遍历 animals 数组，为每一项返回一个带 key 的 <li> 元素——得到的是一个「React 元素数组」。JSX 的大括号里可以嵌任何表达式，而 JSX 有自动渲染数组的能力：数组里每个元素按序渲染。所以「手写四个 li」与「map 生成四个 li」渲染结果一致，但后者随数据伸缩。"
        },
        {
          "question": "ListItem/List 拆分后，数据是怎么流动的？",
          "answer": "App 把整个 animals 数组作为 prop 传给 List（<List animals={animals} />）；List 在 map 里把每一个 animal 单独作为 prop 传给 ListItem（<ListItem key={animal} animal={animal} />）；ListItem 只负责渲染一项（<li>{props.animal}</li>）。整条链全是上一课的 props 单向流——列表渲染没有新数据机制，只是 props 的批量化。"
        },
        {
          "question": "三元版返回 null、&& 版返回 false——为什么页面上都什么都不显示？",
          "answer": "JSX 对 null 与 false 的渲染结果都是「空」：该位置不产生任何 DOM。所以「条件不满足就渲染 nothing」有两种等价写法：condition ? <Element /> : null（三元显式给 null）与 condition && <Element />（条件为假时 && 表达式返回 false）。选择上：二选一场景三元更直白，「满足才渲染」场景 && 更短。"
        },
        {
          "question": "官方警告 && 左边不要放数字——为什么？",
          "answer": "因为 && 返回「第一个假值」或「最后一个真值」：左边是数字 0 时，0 是假值，表达式返回 0——而 JSX 会把数字 0 渲染出来（false/null 不渲染，但 0 会）。于是 {animals.length && <List />} 在空列表时会在页面上留下一个光秃秃的「0」。这正是 React 文档「条件渲染」页 Pitfall 框讲的坑（官方警告块链接到它，本站资料区中文版锚点实测在位）；修法：把数字转成布尔（length > 0 &&）或用三元。"
        },
        {
          "question": "守卫式的 List 组件处理了哪两种边界？为什么说这是 API 场景的好实践？",
          "answer": "两个 if 守卫按序接住两种边界：① props.animals 不存在（undefined/null）→ 渲染「Loading...」；② 数组存在但长度为 0 → 渲染「There are no animals in the list!」。两关都过了才渲染真列表。API 场景下数据要花时间取回——第①关在数据未到位时给用户一个指示器而不是白屏，官方明说这是好实践（good practice）。"
        }
      ],
      "optional": [],
      "note": "官方正文的 ESLint 关闭配置片段（eslint.config.js 的 rules 加 \"react/prop-types\": \"off\"）原样收录在本站示例区。Assignment 第 2 条官方明示「渲染列表」文档最后的 keys 部分不用操心——下一课专讲；该文档条目归属本课资料区，下一课（React 中的 key）Assignment 第 1 条引用同一页面的 keys 小节锚点，属同页跨课引用、按「资源归属课」纪律不重复登记。&& 数字坑的官方警告块链接锚点（#logical-and-operator-）在英文版与中文版页面均实测在位。",
      "why": "这一课的两套技术是你之后写的每一个真实 React 页面都在用的东西：列表渲染决定「数据怎么变成重复的 UI」（商品列表、消息列表、表格行），条件渲染决定「UI 怎么响应状态」（登录/未登录、加载中/空态/有数据）。守卫模式尤其值得内化——Loading 与空态不是锦上添花，是数据驱动应用的必备件。",
      "sections": [
        {
          "h": "渲染元素列表：从硬编码到 map",
          "p": [
            "假设要做一个列出多种动物的组件：硬编码四个 `<li>`（Lion / Cow / Snake / Lizard）——完全合法（perfectly acceptable）。但如果要渲染的不止四个呢？手写会又冗长又乏味。",
            "真实场景里我们打交道的绝大多数时候是**数据结构（比如数组）**而不是硬编码。你前面已经学过：JSX 里可以用大括号嵌入表达式。那就正是这么干：",
            "定义数组 `const animals = [\"Lion\", \"Cow\", \"Snake\", \"Lizard\"]`，JSX 里 `{animals.map((animal) => <li key={animal}>{animal}</li>)}`——map 返回由 li 元素组成的新数组，每项的文字是 animal。渲染结果与手写版**相同**。",
            "原理：**JSX 能自动渲染数组**。先存变量再用的写法完全等价：`const animalsList = animals.map(...)`，JSX 里写 `{animalsList}`。",
            "你可能好奇 `<li>` 上的 **key** prop 是什么：动态渲染组件列表时，必须给顶层组件一个 key——**现在你可以先把它当作组件的 ID**。本课不要求你知道为什么需要它、它怎么工作——下一课专门探索 keys。"
          ]
        },
        {
          "h": "渲染组件列表：ListItem 与 List 的拆分",
          "p": [
            "官方把「一项」升级成组件：`ListItem` 接收 `props.animal`、返回 `<li>{props.animal}</li>`；`List` 组件持有 `<ul>`，接收 `props.animals` 数组、map 之后把每个 animal 作为 prop 传给 `ListItem`（key 挂在 ListItem 上）；`App` 只需 `<List animals={animals} />`。",
            "`<ul>` 搬进了自己的组件 List——它仍然返回 ul，但作为独立组件能做的事多了。整条数据链就是上一课的 props 单向流：数组传给 List、单项传给 ListItem。",
            "官方强调：我们**不限于 `<li>`**——说「列表」时是很宽泛的：你可以在 `<select>` 里动态渲染多个 `<option>`，或者把多个 `<div>` 渲染成网格的一部分。技术完全同一套。",
            "小插曲：你可能注意到 props（比如 ListItem 里的 animal）下面有波浪线，悬停显示 **missing in props validation**。官方说现阶段**放心忽略**——这只是 ESLint 关于 prop 类型的默认规则警告，课程后面会讲。嫌烦的话可以在 `eslint.config.js` 的 rules 里加 `\"react/prop-types\": \"off\"` 关掉（本站示例区有官方配置片段）。"
          ]
        },
        {
          "h": "条件渲染（一）：三元与 &&",
          "p": [
            "让组件做决定：如果只想渲染名字以字母 L 开头的动物呢？——用某种**条件表达式**。官方沿用上面的代码（为省篇幅去掉了 ListItem）。",
            "**三元运算符**：用布尔值决定渲染什么——`animal.startsWith(\"L\") ? <li key={animal}>{animal}</li> : null`。`startsWith` 是字符串方法（官方链了 MDN 文档，本站资料区有中文版），返回 true/false；开头是 L 就返回 li 元素渲染这只动物，否则返回 **null**——表示这个位置什么都不渲染。",
            "**&& 运算符**：另一种快捷方式——`animal.startsWith(\"L\") && <li key={animal}>{animal}</li>`。利用 && 的返回值：startsWith 为 **true** 时返回第二个操作数（li 元素）并渲染它；为 **false** 时返回 false，JSX 会在它的位置**什么都不渲染**。",
            "**官方警告块（本课最重要的坑）**：用 && 做条件渲染时，**不要把数字放在左边**——React 文档「条件渲染」页讲 && 的小节里有个 Pitfall 框详细说明（本站资料区中文版直达该锚点）。原因与修法在本站自测题里展开：数字 0 会被 JSX 渲染出来。"
          ]
        },
        {
          "h": "条件渲染（二）：if 守卫与空态",
          "p": [
            "还可以用 **if、if/else、switch** 做条件渲染。官方这次设两个条件：① 检查 animals 属性有没有被提供；② 检查 animals 长度是否大于 0。",
            "为什么重要：以后会经常和列表打交道，必须考虑**列表为空、甚至根本不存在**时渲染什么——你总不想让用户看到一张白页。",
            "守卫式写法：List 组件开头两个 if **提前返回**——`if (!props.animals)` 返回 `<div>Loading...</div>`；`if (props.animals.length === 0)` 返回 `<div>There are no animals in the list!</div>`；两关都过才渲染真正的 ul 列表。",
            "官方演示两种边界：把 App 里的 animals 清空 → 第二个 if 接住、渲染「列表里没有动物」；把 animals prop 整个拿掉（`<List />`）→ 第一个 if 接住、渲染「Loading...」。",
            "官方点明场景：从 **API 取数据**时经常就是这种情形——取回数据要花些时间，先显示一个指示器是**好实践**。两个守卫都没拦住，说明数据到位，安心渲染列表；自己动手往 animals 里加几项、把 prop 放回去试试。",
            "当然，三元与 && 也能实现同样的逻辑——官方给了**嵌套三元**与**多段 &&** 两个完整等价版本：嵌套三元和多个 && 运算符**看着可能吓人**（intimidating），所以务必动手试出来。"
          ]
        },
        {
          "h": "作业导览：两份 React 文档怎么读",
          "p": [
            "Assignment 两条都是 React 文档（均有官方中文版，本站资料区直达）：**「条件渲染」**（Conditional Rendering）——官方评价「极好的指南」，要求通读并**把全部示例做一遍**；**「渲染列表」**（Rendering Lists）——同一套文档里深入列表能力，官方明示：**最后的 keys 部分不用操心**，下一课专讲。",
            "读「条件渲染」时重点看 && 小节的 Pitfall 框——正是课文警告块链接的位置（中文版锚点实测在位）。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "jsx",
          "code": "// 列表渲染四步演化·终点：组件化拆分（ListItem + List + App）\nfunction ListItem(props) {\n  return <li>{props.animal}</li>;\n}\n\nfunction List(props) {\n  return (\n    <ul>\n      {props.animals.map((animal) => {\n        return <ListItem key={animal} animal={animal} />; // key 挂顶层元素；animal 作 prop 下传\n      })}\n    </ul>\n  );\n}\n\nfunction App() {\n  const animals = [\"Lion\", \"Cow\", \"Snake\", \"Lizard\"];\n  return (\n    <div>\n      <h1>Animals: </h1>\n      <List animals={animals} />\n    </div>\n  );\n}",
          "note": "官方示例：数组 → map → 组件列表。等价的内嵌写法（不拆组件、直接在 ul 里 map 出 li）见课文第一节。"
        },
        {
          "lang": "jsx",
          "code": "// 条件渲染两套快工具：三元 与 &&\nfunction List(props) {\n  return (\n    <ul>\n      {props.animals.map((animal) => {\n        // 三元：满足渲染 li，不满足渲染 null（= 什么都不出现）\n        return animal.startsWith(\"L\") ? <li key={animal}>{animal}</li> : null;\n        // && 等价写法：false 时 JSX 渲染空\n        // return animal.startsWith(\"L\") && <li key={animal}>{animal}</li>;\n      })}\n    </ul>\n  );\n}\n\n// ⚠ 官方设防的坑：&& 左边不要放数字——\n// {animals.length && <List animals={animals} />} 在空数组时会把 0 渲染到页面上！\n// 修法：{animals.length > 0 && <List animals={animals} />}",
          "note": "官方示例 + 警告块的合并整理；0 被渲染的原因与 Pitfall 框详见 React 文档「条件渲染」（资料区中文版）。"
        },
        {
          "lang": "jsx",
          "code": "// 守卫式条件渲染：数据没到 Loading、列表为空给提示、都过了才渲染\nfunction List(props) {\n  if (!props.animals) {\n    return <div>Loading...</div>;            // 守卫一：prop 不存在（API 数据未到位）\n  }\n  if (props.animals.length === 0) {\n    return <div>There are no animals in the list!</div>; // 守卫二：空列表\n  }\n  return (\n    <ul>\n      {props.animals.map((animal) => {\n        return <li key={animal}>{animal}</li>;\n      })}\n    </ul>\n  );\n}\n\nfunction App() {\n  const animals = [];                        // 试试清空 / 或 <List /> 整个不传\n  return (\n    <div>\n      <h1>Animals: </h1>\n      <List animals={animals} />\n    </div>\n  );\n}",
          "note": "官方示例：两个 if 守卫提前返回。把 animals 清空、把 prop 拿掉分别跑一遍——三种渲染结果都要亲眼看到。"
        },
        {
          "lang": "javascript",
          "code": "// eslint.config.js —— 关掉现阶段的 prop 类型警告（官方给的配置）\nexport default [\n  // ...其他配置\n  {\n    rules: {\n      // Your other rules\n      \"react/prop-types\": \"off\"\n    }\n  }\n];",
          "note": "官方贴士：missing in props validation 波浪线来自 ESLint 默认规则，课程后面才正式讲 prop 类型——现阶段可关。"
        }
      ],
      "pitfalls": [
        {
          "title": "&& 左边放数字，页面多出个 0",
          "text": "{list.length && <List />} 在 length 为 0 时渲染出「0」——&& 返回第一个假值，而 JSX 渲染数字、不渲染 false/null。官方专门设警告块 + React 文档 Pitfall 框。修法：length > 0 && 或用三元。"
        },
        {
          "title": "map 忘了 key，或随手拿 index 当 key",
          "text": "本课只需记住：动态列表每项顶层元素必须有 key（先用数据本身的值，如 key={animal}）。index 当 key 是下一课的反模式主题——先别养成习惯。忘 key 会在控制台收到警告，列表更新时还可能出错位渲染。"
        },
        {
          "title": "嵌套三元读到头晕还硬读",
          "text": "官方原话：嵌套三元和多个 &&「看着吓人」，务必动手试。多分支场景（Loading/空态/列表）优先守卫式 if 提前返回——每层一个出口，读起来是平铺的；三元留给真正的二选一。"
        },
        {
          "title": "把 missing in props validation 当成本课没学好的信号",
          "text": "那是 ESLint 关于 prop 类型的默认规则警告，课程后面才讲。官方明确说现阶段放心忽略，或按示例区配置关掉 react/prop-types 规则。"
        }
      ],
      "official": {
        "assignment": [
          "React 文档有一份极好的「条件渲染」（Conditional Rendering）指南——通读它、把全部示例做一遍来巩固理解（官方中文版入口在本站资料区）",
          "同一套文档里，通过「渲染列表」（Rendering Lists）一文深入探索列表还能做什么——最后关于 keys 的部分不用操心，下一课就学（官方中文版入口在本站资料区）"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/getting_started_with_react/rendering_techniques.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "ec578356fe51403ed895aa7d5bc84a9cd6988071ceef79b3c0f0ff3bda0cdfae",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-react-new-keys-in-react",
      "title": "Keys In React",
      "zh": "React 中的 key",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-keys-in-react",
      "summary": "key 是 React 给组件实例发的内部 ID。底层机制：React 用「虚拟 DOM」决定真实 DOM 要更新什么——重渲染时先重建虚拟 DOM、新旧对比（diff），只把真正变了的部分更新到真实 DOM。要对比就必须能区分组件实例：key 没变 = 还是同一个实例（状态保留/更新）；key 变了 = 全新实例（带全新状态重建）。硬编码的列表 React 自动管 key；**map 出来的动态列表必须手动给**——数量与顺序都可能在两次渲染之间变化，React 无法自动可靠配对。key 怎么选：理想是每项唯一的标识符（数据库记录的 id；自定义数据就自己发 id，可用 crypto.randomUUID()）。两个官方设防点：列表会变时**别用数组 index 当 key**（删插重排会出诡异 bug，配视频演示）；**绝不在渲染时现场生成 key**（key={Math.random()} 每次渲染都是新 key，等于每次全部重建——key 应从数据本身推出）。key 还有第二个用途：故意换 key 让组件「带着全新状态重开」（游戏重置的官方示例）。",
      "guide": "以下是官方原课的中文化梳理。这一课回答上一课留下的「key 为什么存在」。理解路径自底向上：先懂重渲染机制（重建虚拟 DOM → diff → 最小化真实 DOM 更新），就懂 React 需要在两次渲染之间**认出**「哪个组件还是原来那个」——key 就是认人用的 ID。认出之后有两个结论：key 不变，实例保留（状态延续）；key 变了，实例重建（状态清零）。动态列表必须手动给 key 的原因也从机制里长出来：map 一次返回值的背后可能是 2 个、3 个甚至 100 个实例，数量和顺序都会变——没有 key，React 无法跨渲染可靠配对，只能整列表重建。选材纪律两条：唯一且稳定（数据自带 id 最好；randomUUID 在**造数据时**发一次、存进数据，不是渲染时发）；index 只在「列表终生不变」时才勉强可用，官方明说不推荐。反模式一条：渲染时现场生成 key（Math.random()/randomUUID() 写进 JSX）——每次渲染全体换新 ID，diff 机制彻底失效。最后一节打开第二用途：**key 变化 = 强制重开实例**——游戏重置示例里换 key 一行顶过手动重置每个状态的十行。官方示例用到了 useState——它在「状态与副作用」章节才正式讲，本课按「一个会变、能触发重渲染的值」理解即可。",
      "understand": [
        "底层机制：React 用**虚拟 DOM**（virtual DOM）决定真实 DOM 更新什么——重渲染发生时，先**重建**虚拟 DOM，再对新旧虚拟 DOM 做 **diff（对比变化）**，然后**只把真正变了的部分**更新到真实 DOM，最小化不必要的动作",
        "要 diff 就得能**区分**每个组件——它们各有各的 props 与状态；所以每个组件在底层都会拿到一个 ID：**key**",
        "key 的实例语义：**key 没变** = 还是同一个组件实例（状态保留/更新，React 避免不必要动作）；**key 变了** = 全新实例（React 用全新状态重建一个）",
        "通常**不需要手动给 key**——React 自动处理；但有两类情形要自己动手（动态列表、故意重置实例）",
        "为什么 map 列表必须手动给 key：列表变化时只有两种可能的处理——① 整列表完全重建；② 揪出真正变化的项、只重建那些。我们要的是 ②（避免无谓工作），所以**每一项都要有 key**",
        "硬编码在 JSX 里的组件不用管：指令是显式且静态的，跨渲染没有歧义，React 自动配 key；**map 数组是动态的**——只写一个返回值，背后可能是 2 个、3 个甚至 100 个实例，**数量与顺序都可能在两次渲染之间变化**，React 无法自动提供可靠的跨渲染配对",
        "配对机制：列表因任何原因更新（服务器数据或用户交互）时，React 把**旧列表各项的 key 与新列表逐项匹配**——有变化的项才更新。只要 key 保持**一致且唯一**，React 就能有效、高效地处理 DOM",
        "语法：key 像普通 prop 一样传给组件或 DOM 元素——`<Component key={keyValue} />`、`<div key={keyValue}></div>`",
        "**key 是私有的**：只供 React 内部使用，**不会**经 props 参数对象传进组件本身（组件里读不到 props.key）",
        "key 选什么：理想是**每项唯一的标识符**——数据库通常给每条记录发唯一 id，直接用；自定义数据就养成给每项发唯一 id 的好习惯（官方示例：`crypto.randomUUID()` 在**构造 todos 数组时**为每项生成 id，渲染时 `key={todo.id}`）",
        "index 当 key：只有确信列表在应用整个生命周期**保持不变**才可以；官方**不推荐**——列表一旦有删除、插入、重排，index 配对会错位，导致**令人困惑的 bug**（Assignment 配了演示视频）",
        "反模式：**绝不现场生成 key**——`key={Math.random()}` 或 `key={crypto.randomUUID()}` 写进渲染代码，等于每次渲染都发新 key，「认人」机制彻底失效（每项每次都被当新实例重建）。key 应当**从数据本身推出**",
        "key 的第二用途——**key 与状态**：故意换 key，让 React 把组件当全新实例重建、状态清零。官方游戏示例：GamePage 用 useState 存一个 key，把 `resetGame={() => setKey(key + 1)}` 传进 Game；点击重置 → key 变 → Game 全新实例、全新状态——比手动逐个重置相关状态简单且不会漏",
        "官方点明的对比：不刷新页面重置游戏（别的组件状态还要保住）时，手写「把每个相关状态设回初始值」的函数容易漏状态、设错值，且以后增删状态还得同步维护——换 key 一行解决",
        "官方示例用到的 useState 在「状态与副作用」章节正式展开——本课按「一个会变、能触发重渲染的值」理解即可"
      ],
      "terms": [
        {
          "en": "Virtual DOM",
          "zh": "虚拟 DOM：真实 DOM 在内存里的轻量表示——重渲染时先重建它、与上一版 diff，只把真正的变化写进真实 DOM，最小化昂贵的 DOM 操作"
        },
        {
          "en": "Diffing",
          "zh": "对比（diff）：新旧虚拟 DOM 的比较过程——key 是列表场景下 diff 能「认出谁是谁」的前提"
        },
        {
          "en": "Re-render",
          "zh": "重渲染：组件函数被再次执行、生成新虚拟 DOM 的过程——状态变化、父组件更新都会触发"
        },
        {
          "en": "key",
          "zh": "组件实例的内部 ID：跨渲染配对用；一致且唯一时 React 只更新真正变化的项。私有属性——不进组件的 props"
        },
        {
          "en": "Component instance",
          "zh": "组件实例：同一组件的多份运行体，各有各的 props 与状态——key 不变则实例延续（状态保留），key 变则实例重建（状态清零）"
        },
        {
          "en": "crypto.randomUUID()",
          "zh": "浏览器内置的唯一 ID 生成函数——官方推荐在**构造数据时**为每项发 id（MDN 文档在本站资料区，有中文版）；写进渲染代码现场生成则是反模式"
        },
        {
          "en": "Index as key anti-pattern",
          "zh": "index 当 key 的反模式：列表有删/插/重排时 index 与数据的对应关系错位，渲染与状态都会串位——官方配视频演示，仅在列表终生不变时才勉强可用"
        }
      ],
      "tasks": [
        "亲手敲官方 todos 示例：构造数组时用 crypto.randomUUID() 给每项发 id，渲染时 key={todo.id}——然后故意在页面加删一项，观察只有变化项更新",
        "复现反模式：把 key={todo.id} 改成 key={crypto.randomUUID()}（渲染时现场生成），在 React Developer Tools 里观察每次渲染全体重建的现象，再改回来",
        "看官方 Assignment 配的 Codevolution 短视频（index as key 反模式演示，约 7 分钟，资料区直达），总结「删一项导致后面全体错位」的过程",
        "敲一遍 GamePage/Game 重置示例（useState 按「一个会变的值」理解即可），点重置按钮观察 Game 状态清零——这是「key 变化 = 实例重建」的直观证明",
        "完成官方 Assignment 两条：读 React 文档「渲染列表」的 keys 小节（上一课跳过的部分，中文版在资料区——归属上一课条目）+ 看完 index-as-key 视频"
      ],
      "quiz": [
        {
          "question": "从虚拟 DOM 的重渲染流程出发，讲清楚 React 为什么需要 key。",
          "answer": "重渲染时 React 先重建虚拟 DOM，再对新旧两版做 diff，只把真正变了的部分更新到真实 DOM。diff 的前提是能「认出」新树里的每个组件对应旧树里的哪一个——组件各有自己的 props 和状态，认错了就会错更新。key 就是认人用的 ID：key 没变，React 知道还是同一个实例，避免不必要动作；key 变了，React 知道这是全新实例，用全新状态重建。"
        },
        {
          "question": "为什么硬编码的列表不用管 key，map 出来的列表必须手动给？",
          "answer": "硬编码在 JSX 里时，指令显式且静态——跨渲染没有歧义，React 自动处理。map 是动态的：你只写一个返回值，运行时背后可能是 2 个、3 个甚至 100 个实例，而且数量与顺序都可能在两次渲染之间变化。没有 key，React 无法可靠地把旧列表项与新列表项配对，也就无法「只重建变化的项」，只能整列表重建。给了 key，React 逐项匹配、精准更新。"
        },
        {
          "question": "key={crypto.randomUUID()} 写在 map 的返回 JSX 里，错在哪？正确做法是什么？",
          "answer": "错在「现场生成」：randomUUID 每次调用都给新值，于是每次渲染每项都拿到新 key——React 把所有项都当成全新实例重建，key 的配对意义完全失效（这正是官方点名的反模式，Math.random() 同理）。正确做法：key 从数据本身推出——构造数据时（如建 todos 数组时）就为每项发好唯一 id（这时用 randomUUID 是对的），渲染时 key={todo.id}。数据库来的数据直接用记录的 id。"
        },
        {
          "question": "什么情况下可以用 index 当 key？为什么官方仍不推荐？",
          "answer": "只有确信列表在应用整个生命周期保持不变（不删、不插、不重排）时才可以。官方不推荐是因为一旦列表变了，index 与数据的对应关系就错位：删掉第 2 项后，原第 3 项顶替 index 1——React 会以为是「那一项的内容变了」而不是「少了一项」，产生令人困惑的渲染与状态串位 bug。Assignment 配了专门的演示视频。"
        },
        {
          "question": "游戏结束后想「不刷新页面、把游戏组件重置到初始状态」，官方给的方案是什么？为什么它比手写重置函数好？",
          "answer": "换 key：GamePage 用 useState 存一个 key 值，<Game key={key} resetGame={() => setKey(key + 1)} />；点击重置 → key +1 → React 把 Game 当全新实例重建 → 全新状态。好处对比官方说得很清楚：手写「把每个相关状态设回初始值」的函数要确保不漏状态、不设错值，以后增删状态还得同步维护；换 key 一行解决，且页面里其他组件的状态不受影响（不像刷新页面）。"
        }
      ],
      "optional": [],
      "note": "Assignment 第 1 条的 React 文档「渲染列表」keys 小节与上一课 Assignment 第 2 条是同一页面（#keeping-list-items-in-order-with-key 锚点，中英文版均实测在位）——条目归属上一课（渲染技巧）资料区，本课任务映射按「资源归属课」纪律不接。官方 GamePage 示例用到 useState——它在 World 5「状态与副作用」章节正式讲解，本课按「一个会变、能触发重渲染的值」理解即可，不影响 key 机制的学习。index-as-key 演示视频（Codevolution）为英文视频，本站一律不声称有中文字幕。",
      "why": "key 是 React 性能与正确性的交集点：配对错了轻则整列表重建（性能），重则状态串位（正确性 bug，而且是那种「偶尔出现、极难排查」的）。这一课的机制理解（实例 ID + diff 配对）会在后面反复回访——列表增删、表单行编辑、组件重置，全是它的直接应用。「从数据推 key、不现场生成、慎 index」三句话，值得现在就背下来。",
      "sections": [
        {
          "h": "为什么 React 需要 key：虚拟 DOM 与 diff",
          "p": [
            "你可能记得：React 底层用**虚拟 DOM**（virtual DOM）决定真实 DOM 里的什么东西要更新，以最小化不必要的动作。重渲染发生时，它先**重建**虚拟 DOM，对新旧虚拟 DOM 做 **diff**（对比变化），然后**只把真正变了的东西**更新进真实 DOM。",
            "React 需要能**区分**这些组件——它们各有各的 props 与状态。因此每个组件在底层都会被发一个 ID：**key**。",
            "实例语义：你更新状态时，key 没变——还是**同一个组件实例**，React 知道这一点，可以避免不必要的动作；key 变了——React 知道这是一个**全新实例**，会用全新的状态重建一个。",
            "通常你**不需要手动给组件 key**，React 自动处理。但有两类情形用得上——本课的两个主题：动态列表，与故意重置实例。"
          ]
        },
        {
          "h": "列表渲染时的 key：配对机制",
          "p": [
            "上一课用 `.map()` 遍历数组渲染组件列表。现在想象：列表里的项变了，React 在幕后怎么知道该更新哪一项？",
            "列表变化时，我们想要的处理只有两种可能：① 整个列表完全重建；② **揪出真正变化的项、只重建那些**。我们要的是 ②（避免无谓工作）——所以列表里**每一项都需要一个 key**。",
            "硬编码在 JSX 里的组件不用你操心：指令显式且静态，跨渲染没有歧义，React 自动配 key。**map 数组则是动态的**：你只写一个返回值，但结果可能是 2 个、3 个甚至 100 个实例，而且**数量与顺序都可能在两次渲染之间变化**——React 没办法自动为它们提供能跨渲染可靠配对的 key。项数变了、顺序变了，它怎么确定哪些组件要带全新状态重建、哪些是保留/更新状态的既有实例？",
            "这就是动态列表必须自己给 key 的原因：列表因任何原因更新（来自服务器或用户交互）时，React 把**旧列表各项的 key 与新列表逐项匹配**——有变化才更新那一项。只要 key **一致且唯一**，React 就能有效、高效地处理 DOM。"
          ]
        },
        {
          "h": "key 的用法与选材：唯一、稳定、从数据推出",
          "p": [
            "语法你已经会了——key 像普通 prop 一样传：`<Component key={keyValue} />`、`<div key={keyValue}></div>`。一个重要差异：**key 是私有的**——只供 React 内部使用，**不会**经 props 参数对象传进组件（组件里读不到它）。",
            "key 用什么值？理想是**每项唯一的标识符**。大多数数据库给每条记录发唯一 id——直接用，不必自己操心；自定义数据则养成好习惯：给每项分配唯一 `id`（官方示例：构造 todos 数组时用 `crypto.randomUUID()` 为每项生成 id，渲染时 `key={todo.id}`）。",
            "**index 当 key**：如果你确信列表在应用整个生命周期保持不变，可以用数组 index——但官方**不推荐**：列表一旦有删除、插入、重排，会产生**令人困惑的 bug**（Assignment 的演示视频专门讲这个）。",
            "**反模式——现场生成 key**：`key={Math.random()}` 或 `key={crypto.randomUUID()}` 写进渲染代码，会在**每次渲染列表时**造出新 key——key 的存在意义被彻底击穿（每项每次都被当成新实例重建）。如上所示：**key 应当从数据本身推出**。"
          ]
        },
        {
          "h": "key 与状态：换 key = 强制重开",
          "p": [
            "动态列表是手动给 key 最常见的情形，但不是唯一情形。既然 key 就是 React 区分组件实例的内部 ID，我们也可以**故意**提供自己的 key，来控制一个组件何时「保持同一实例（状态延续）」、何时「成为全新实例（状态清零）」。",
            "官方场景：一个游戏，结束时你想把它**重置回初始状态**。刷新页面不明智——页面里还有别的组件、它们的状态你想保住。手写一个「把每个相关状态设回初始值」的函数？你得保证不漏掉任何状态、不设错任何值，而且以后每增删一个状态都要同步维护这个函数。",
            "更简单的办法——告诉 React「用全新状态从头渲染这个组件」：**换掉它的 key**。官方示例：`GamePage` 里 `const [key, setKey] = useState(0)`，渲染 `<Game key={key} resetGame={() => setKey(key + 1)} />`。",
            "机制走一遍：Game 有自己的状态、渲染自己的组件；它重渲染时 key 没变——还是同一个实例，状态保留/更新。Game 内部的按钮被点击时调用 `resetGame()` → key 状态 +1 → GamePage 重渲染 → **Game 拿到新 key** → React 视其为全新实例，用全新状态重建一个。（useState 在「状态与副作用」章节正式讲——这里按「一个会变、能触发重渲染的值」理解即可。）"
          ]
        }
      ],
      "examples": [
        {
          "lang": "jsx",
          "code": "// ✓ 正确：构造数据时发 id，key 从数据推出\nconst todos = [\n  { task: \"mow the yard\", id: crypto.randomUUID() },\n  { task: \"Work on Odin Projects\", id: crypto.randomUUID() },\n  { task: \"feed the cat\", id: crypto.randomUUID() },\n];\n\nfunction TodoList() {\n  return (\n    <ul>\n      {todos.map((todo) => (\n        <li key={todo.id}>{todo.task}</li>  // key = 数据自带的唯一 id\n      ))}\n    </ul>\n  );\n}\n\n// ✗ 反模式：渲染时现场生成 key——每次渲染全体换新 ID，配对机制失效\nfunction TodoListWrong() {\n  return (\n    <ul>\n      {todos.map((todo) => (\n        <li key={crypto.randomUUID()}>{todo.task}</li>  // DON'T——Math.random() 同理\n      ))}\n    </ul>\n  );\n}",
          "note": "官方正反示例并排。randomUUID 的正确位置在「构造数据」处，不在「渲染」处——一字之差，机制全变。"
        },
        {
          "lang": "jsx",
          "code": "// key 的第二用途：换 key = 强制重开实例（游戏重置）\nfunction GamePage() {\n  const [key, setKey] = useState(0); // useState 见「状态与副作用」章节；此处按「会变的值」理解\n\n  return <Game key={key} resetGame={() => setKey(key + 1)} />;\n}\n// 机制：点击 Game 内的重置按钮 → resetGame() → key +1 → GamePage 重渲染\n// → Game 拿到新 key → React 视为全新实例 → 全新状态（等效「从头重开」）\n// key 不变时：Game 重渲染仍是同一实例，状态保留/更新",
          "note": "官方示例：比手写「逐个状态设回初始值」的函数简单且不会漏——增删状态也无需维护重置逻辑。"
        }
      ],
      "pitfalls": [
        {
          "title": "渲染时现场生成 key（Math.random / randomUUID 写进 JSX）",
          "text": "每次渲染每项都拿到新 key——React 把所有项都当全新实例重建，状态全部丢失、diff 机制失效。key 必须从数据推出：造数据时发好 id，渲染时引用。这是官方点名的反模式（anti-pattern）。"
        },
        {
          "title": "会变的列表用 index 当 key",
          "text": "删除/插入/重排后 index 与数据错位：React 按 index 配对，会把「少了一项」误判成「某项内容变了」，渲染与组件内部状态都会串位——典型症状是删掉一行后输入框内容错位到别的行。只在列表终生不变时才勉强可用；官方配了演示视频。"
        },
        {
          "title": "在组件里试图读 props.key",
          "text": "读不到——key 是私有 prop，只供 React 内部配对使用，不会经 props 参数对象传入组件。组件需要那份数据的话，把它作为另一个普通 prop 显式传（如 <li key={todo.id} id={todo.id}>）。"
        },
        {
          "title": "想重置组件状态时手写逐个状态复位",
          "text": "容易漏状态、设错值，增删状态还要同步维护重置函数。官方给的更简单方案：换 key——父组件把 key 状态 +1，React 自动用全新状态重建实例（见示例区 GamePage）。"
        }
      ],
      "official": {
        "assignment": [
          "读 React 文档「渲染列表」里讲 keys 的这一节（Keeping list items in order with key——上一课通读该文档时官方让你跳过的部分；中文版入口归属上一课资料区条目）",
          "看这支演示「index 当 key 是反模式」的短视频（Codevolution：ReactJS Tutorial - 19 - Index as Key Anti-pattern）"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/getting_started_with_react/keys_in_react.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "2a2531ae87e18aa447d282148c59290dd03c5a8d5133a9da23fcb33d18a9ca76",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-react-new-introduction-to-state",
      "title": "Introduction To State",
      "zh": "状态简介",
      "group": 2,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-introduction-to-state",
      "summary": "state（状态）是组件的记忆：应用里一切随时间变化的界面——从切换下拉菜单到从 API 拉数据——背后都是组件在「记住」某些值并据此重渲染。本课用官方 react-examples 仓库的背景变色应用讲透 useState：它接收初始值、返回「当前状态值 + 更新函数」的数组对；每次调用更新函数，React 会重新执行整个组件函数（rerender），用最新状态算出新界面再提交到 DOM——初始值只在首次渲染用，之后由 React 负责保管最新状态。顺带立下 Hooks 的两条铁律：只能在函数组件顶层调用、不能在循环或条件里调用。",
      "guide": "以下是官方原课的中文化梳理。这一课正式开启 React 的「会动」时代——前面五课组件都是「给定 props 渲染一次」的静态视角，从这课起组件有了记忆。抓住三条主线：① 定义层——**State is a component's memory**（官方原话加粗），组件需要「记住」自己身上的事才能随交互变化，useState 就是给函数组件装记忆的内建 Hook；② 机制层——调用 setState 后发生的事：React 重新执行组件函数（rerender）→ 用新状态算出界面 → 把最小变更集提交（commit）到真实 DOM，其中「重新生成虚拟 DOM 树并与旧树比对求最小变更」的过程叫 reconciliation（调和）——你在 key 一课已经见过它的配对机制，这里补上全景；③ 纪律层——初始值只在首次渲染生效（后续渲染由 React 保管最新值）、Hooks 只能顶层调用不能进循环或条件。官方特意提醒：React 内部机制是个深坑（deep rabbit hole），本课给的深度足够走完 React 课程——不要陷进去。",
      "understand": [
        "**State is a component's memory**（官方加粗原话）：组件要随用户或程序的交互发生视觉变化，就需要「记住」关于自己的事——状态就是这份记忆",
        "useState 的固定模式：`const [stateValue, setStateValue] = useState(initialValue)`——接收初始值，返回二元数组：当前状态值 + 更新状态的函数，惯例用解构接收",
        "加更多状态 = 加更多 useState 调用，一个组件可以有任意多个独立的状态变量",
        "rerender 机制：状态或 props 变化 → React **从头重新执行整个组件函数** → 算出的变更提交（commit）到 DOM；整个组件在某种意义上被重建，但这次 useState 返回的是最新值",
        "初始值只在**首次渲染**使用，后续渲染直接被忽略——最新状态由 React 负责保管并交还给组件，不需要你操心",
        "reconciliation（调和）算法：rerender 生成新的虚拟 DOM 树（真实 DOM 的轻量表示），React 比对新旧两棵树、算出更新真实 DOM 所需的**最小变更集**——这是 React 高效更新界面的核心",
        "Hooks 是能让你使用 React 特性的函数，全部以 use 前缀命名（useState 就是一个 Hook）；两条规则：**只能在函数组件顶层调用**、**不能在循环或条件语句里调用**",
        "官方提醒：React 内部机制是深坑（deep rabbit hole），本课覆盖的深度已足够走完整个 React 课程"
      ],
      "terms": [
        {
          "en": "State",
          "zh": "状态：组件的记忆——组件需要随交互变化时「记住」的数据；用 useState 定义，变化触发重渲染"
        },
        {
          "en": "useState hook",
          "zh": "useState 钩子：React 内建 Hook，接收初始值、返回 [当前状态值, 更新函数] 二元数组——函数组件定义状态的标准方式"
        },
        {
          "en": "Rerendering",
          "zh": "重渲染：状态或 props 变化时 React 重新执行整个组件函数的过程——组件「被重建」，但 useState 这次返回最新值"
        },
        {
          "en": "Reconciliation",
          "zh": "调和：比对新旧虚拟 DOM 树、计算更新真实 DOM 所需最小变更集的算法——key 的跨渲染配对正是为它服务"
        },
        {
          "en": "Virtual DOM",
          "zh": "虚拟 DOM：真实 DOM 的轻量内存表示，React 用它追踪 UI 当前状态；重渲染先生成新虚拟树再调和"
        },
        {
          "en": "Commit",
          "zh": "提交：调和算出的最小变更集被应用到真实 DOM 的那一步——「渲染和提交」正是 Assignment 里官方文档第二篇的主题"
        }
      ],
      "tasks": [
        "按官方指引 fork + clone react-examples 仓库（地址在本站资料区），cd 进 state/ 目录，npm install 后 npm run dev——先玩一遍背景变色应用再读 src/App.jsx",
        "读 App.jsx 时对照本课模式：找到 useState(COLORS[0]) 的定义处和每个按钮 onClick 里的 setBackgroundColor 调用——确认「定义一次、到处更新」的形状",
        "做官方 Assignment 第 3 条的动手任务：给应用加一个新状态变量，追踪背景色被更换的次数并显示在页面上——体会「加状态 = 加一个 useState 调用」",
        "完成官方 Assignment 前两篇 React 文档阅读：「State：组件的记忆」与「渲染和提交」（官方中文版都在本站资料区）",
        "读 GFG 的 React 调和算法一文（在本站资料区），把「rerender → 新虚拟树 → 比对新旧树 → 最小变更提交」串成一句话讲给自己听",
        "自查：为什么初始值只在首次渲染生效？如果把 useState(COLORS[0]) 的初始值改成 COLORS[1]，已运行中的应用热更新后和刷新后表现有何不同？（提示：热更新不等于重新挂载）"
      ],
      "quiz": [
        {
          "question": "官方给 state 下的一句话定义是什么？为什么组件需要它？",
          "answer": "State is a component's memory——状态是组件的记忆。组件要随用户或程序的交互发生视觉变化（切换菜单、更新计数、展示拉回来的数据），就必须「记住」关于自己的事；没有记忆，每次渲染都是失忆的静态快照，界面无从「随时间变化」。"
        },
        {
          "question": "const [backgroundColor, setBackgroundColor] = useState(COLORS[0]) 这一行里，三个标识符分别是什么？useState 的返回值结构是什么？",
          "answer": "useState 接收初始值（COLORS[0]），返回一个二元数组：[当前状态值, 更新该状态的函数]。解构后 backgroundColor 是当前状态值（渲染时读它），setBackgroundColor 是更新函数（事件里调它），惯例命名是 set + 状态名首字母大写。"
        },
        {
          "question": "调用 setBackgroundColor(新颜色) 之后，React 内部按顺序做了哪几件事？",
          "answer": "① 重新执行整个组件函数（rerender）——组件在某种意义上被重建，函数体里的 JSX、事件处理器全部重新创建；② 这次 useState 返回的是 React 保管的最新状态值；③ 生成新的虚拟 DOM 树，与旧树调和（reconciliation）算出最小变更集；④ 把变更提交（commit）到真实 DOM。"
        },
        {
          "question": "初始值 COLORS[0] 在组件第二次、第三次渲染时还起作用吗？最新状态由谁保管？",
          "answer": "不起作用——初始值只在组件首次渲染时使用，后续渲染直接被忽略。最新状态由 React 负责追踪保管，每次重渲染时从 useState 交还给组件。这也是「组件函数被重新执行、状态却没有丢」的原因：状态不住在函数作用域里，住在 React 那边。"
        },
        {
          "question": "Hooks 的两条使用规则是什么？为什么官方强调「useState 是 Hook、以 use 前缀识别」？",
          "answer": "规则一：只能在函数组件的顶层调用；规则二：不能在循环或条件语句里调用。use 前缀是 Hook 的统一识别标志——之后课程里遇到的 useEffect、useContext 等全部如此；规则的存在与 React 内部按调用顺序配对状态的机制有关，顶层固定顺序调用才能保证每次渲染时状态对得上号。"
        }
      ],
      "optional": [],
      "note": "正文预读材料 Academind「What is State?」一文（教程路径 301 到 articles 现役路径）、react-examples 仓库 state/ 练习目录（TOP 自有练习仓库，按 css-exercises 练习目录先例登记）、GFG 调和算法一文（官方路径 301 到 reactjs/reactjs-reconciliation/ 现役路径）都登记在本站资料区；Assignment 两篇 React 文档均核验出官方中文版（zh-hans.react.dev，锚点不本地化事实沿用阶段 1）。正文一张 statically 配图（rerender 代码图解）按既有口径剔除。官方 react-examples 仓库同时是「基于类的组件」一课的练习仓库（class-components/ 目录），两课各自登记所在目录。",
      "why": "useState 是 React 三大基础原语（JSX、props、state）的最后一块——到这一课，「组件 = 函数、界面 = f(状态)」的完整心智模型正式闭合。后面每一课都建在它上面：下一课讲状态的结构与更新细节，副作用课讲 useEffect 与状态的配合，再往后的 Context、路由、数据获取全都是「状态放哪、怎么更新」的延伸。把「调用 set 函数 → 整个组件函数重跑 → React 保管最新值」这条链刻进肌肉记忆，后面遇到的「怎么改了没反应」「怎么改了两次」类问题都能自己推出来。",
      "sections": [
        {
          "h": "为什么需要状态：组件的记忆",
          "p": [
            "任何令人兴奋的应用都会在用户探索期间不断变化——小到切换一个下拉菜单，大到从 API 拉取数据刷新整个视图。React 提供了操纵应用（更准确说是组件）状态的原语来让界面动起来。",
            "我们写组件——写非常多的组件——而且经常希望它们随用户或程序的交互发生视觉变化。为此组件需要「记住」关于自己的事。**这就是 state 登场的地方：State is a component's memory（状态是组件的记忆）**——官方这句加粗定义是全课的地基。"
          ]
        },
        {
          "h": "useState：给函数组件装记忆",
          "p": [
            "官方带你去 react-examples 仓库的 state/ 目录（fork + clone + npm install + npm run dev，地址与本站资料区）：一个按点击按钮换背景色的应用，代码在 src/App.jsx。",
            "useState 是 React 内建 Hook，让你在函数组件里定义状态。它接收一个初始值作为参数，返回一个二元数组，解构得到两样东西：① 当前状态值；② 更新状态值的函数。定义状态的惯用模式：",
            "`const [stateValue, setStateValue] = useState(initialValue);`——对应到变色应用就是 `const [backgroundColor, setBackgroundColor] = useState(COLORS[0]);`。即使还不懂多少 React，你也能大致读出这行在干什么：定义 backgroundColor 状态；每个按钮挂 click 事件处理器，调用 setBackgroundColor 传入对应颜色；然后新颜色就「魔法般」应用到了背景上。",
            "要加更多状态变量？再加 useState 调用就行——一个组件里可以并存任意多个独立状态。"
          ]
        },
        {
          "h": "状态如何工作：rerender 与 reconciliation",
          "p": [
            "上点理论。React 里，当组件的状态或 props 变化时，React 会**从头重新执行你的组件函数**，根据最新的状态与 props 算出应该显示什么，再把算出的全部变更应用（提交，commit）到 DOM。也就是说整个组件在某种意义上被重建了——只不过这次 useState 会返回最新的状态值。这个过程叫**重渲染（rerendering）**，它是 React 能随底层数据变化高效更新界面的关键特性。",
            "官方注释块展开了 **React 调和（reconciliation）算法**：重渲染会生成一棵新的虚拟 DOM 树——虚拟 DOM 是真实 DOM 的轻量表示，React 用它追踪 UI 的当前状态；接着 React 比较新旧两棵虚拟树，算出更新真实 DOM 所需的**最小变更集**。这就是调和算法。（你在 key 一课见过的「跨渲染配对」正是为这一步服务的。）",
            "用变色应用解释：每次调用 setBackgroundColor，App 组件就重渲染一次——onButtonClick 函数、div 和 button 全部被重建。你可能会问：backgroundColor 状态不该也被重建吗？——React 负责追踪最新状态并交给组件；**初始值只在首次渲染使用，后续渲染直接忽略**。",
            "官方最后提醒：以上只是 React 内部机制一小部分的速览。想深挖可以，但小心这是个深坑（deep rabbit hole）——本课覆盖的深度足够你走完整个 React 课程。"
          ]
        },
        {
          "h": "Hooks 及其两条规则",
          "p": [
            "Hooks 是让你使用 React 特性的函数，全部可以通过 **use 前缀**识别——useState 就是一个 Hook，课程后面还会用更多。",
            "现在只需要记住 Hooks 有规则要遵守：① **只能在函数组件的顶层调用**；② **不能在循环内部或条件语句里调用**。这两条规则保证每次渲染时 Hook 的调用顺序稳定，React 内部才能把状态正确配对。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "jsx",
          "code": "import { useState } from \"react\";\n\nconst COLORS = [\"red\", \"green\", \"blue\"];\n\n// 官方 react-examples state/ 目录应用的骨架\nexport default function App() {\n  const [backgroundColor, setBackgroundColor] = useState(COLORS[0]);\n\n  const onButtonClick = (color) => () => {\n    setBackgroundColor(color);\n  };\n\n  return (\n    <div className=\"App\" style={{ backgroundColor }}>\n      {COLORS.map((color) => (\n        <button key={color} type=\"button\" onClick={onButtonClick(color)}>\n          {color}\n        </button>\n      ))}\n    </div>\n  );\n}",
          "note": "官方示例应用的等价骨架：一个 useState 定义状态；每个按钮的 onClick 调用更新函数；状态一变，整个 App 函数重跑，div 的 style 拿到新颜色。"
        },
        {
          "lang": "jsx",
          "code": "// 加更多状态 = 加更多 useState 调用（官方 Assignment 第 3 条的目标形态）\nexport default function App() {\n  const [backgroundColor, setBackgroundColor] = useState(COLORS[0]);\n  const [changeCount, setChangeCount] = useState(0); // 新增：换色次数\n\n  const onButtonClick = (color) => () => {\n    setBackgroundColor(color);\n    setChangeCount((count) => count + 1);\n  };\n\n  return (\n    <div className=\"App\" style={{ backgroundColor }}>\n      <p>背景色已更换 {changeCount} 次</p>\n      {/* …按钮同前… */}\n    </div>\n  );\n}",
          "note": "两个状态变量各自独立更新；更新函数传回调（count => count + 1）的写法下一课展开讲原因。"
        }
      ],
      "pitfalls": [
        {
          "title": "以为调用 set 函数后状态变量「立刻」变",
          "text": "setBackgroundColor(newColor) 之后马上 console.log(backgroundColor)，打印的还是旧值——更新在**下一次渲染**才生效，本次渲染里状态值是不变的快照。下一课「state 如同一张快照」整课讲这件事，这里先留个印象：别在同一轮事件处理里指望读到新值。"
        },
        {
          "title": "把 useState 写进 if 或循环里",
          "text": "违反 Hooks 规则二。React 按调用顺序配对状态——条件调用会让不同渲染轮次的顺序错位，轻则警告重则状态串位。需要「条件性的状态」时，状态本身照常顶层定义，把条件写进渲染逻辑或更新函数里。"
        },
        {
          "title": "以为初始值每次渲染都生效",
          "text": "useState(COLORS[0]) 的初始值只在首次渲染使用，之后被 React 忽略——把初始值表达式改得再花哨也不会影响已挂载组件的当前状态。想「重置」状态是另一套动作（换 key 强制重建实例，key 一课讲过；或显式 set 回初始值）。"
        }
      ],
      "official": {
        "assignment": [
          "阅读 React 文档两篇：「State：组件的记忆（State: A Component's Memory）」与「渲染和提交（Render and Commit）」（官方中文版入口都在本站资料区）",
          "阅读 GFG 的「React 调和算法（ReactJS Reconciliation）」一文——官方评价其对调和机制的解释很棒（在本站资料区）",
          "回到课文前面的 react-examples 仓库 state/ 示例应用：新增一个状态变量追踪背景色被更换的次数，并把次数显示在页面上"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/states_and_effects/introduction_to_state.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "3b82450abb84b6e847a732ef07ae304e35e9c56755836f04790f16a4a1247470",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-react-new-more-on-state",
      "title": "More On State",
      "zh": "再谈状态",
      "group": 2,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-more-on-state",
      "summary": "状态用法的进阶四件套：① 结构化原则——能用现有 state/props 算出来的值不要放进 state；状态**不可变（immutable）**，引用类型必须复制新对象再 set（setState 用 Object.is() 判断新旧是否相同，传同一个对象引用不保证触发重渲染）；② 更新是异步的——setState 在**下一次渲染**才应用，本次渲染里状态是**一张快照**：state 变量不是响应式的，组件才是；③ 更新函数两形态——传值是「替换」，连调两次只生效最后一次；传回调（updater function）才基于最新状态累加；React 还会尽可能**批处理（batching）**状态更新，两次 set 只重渲染一次；④ 受控组件——input 自带内部状态，用 value + onChange 把它的值接管到自己的 state 里，是实时校验等场景的基础模式。",
      "guide": "以下是官方原课的中文化梳理。上一课你学会了「定义状态、更新状态」，这一课回答四个更深的问题。第一问「什么不该放进 state」：能用现有值算出来的就别存——冗余状态是 bug 之源；接着是最重要的一条纪律：**把状态当不可变的（immutable）**——原始值天然不可变，但数组和对象是引用类型，直接改属性（person.age += 1 再 setPerson(person)）传回的还是同一个引用，setState 内部用 Object.is() 比对新旧值，同一引用可能不触发重渲染；正确姿势是展开复制出新对象再改。第二问「为什么 set 完马上读还是旧值」：状态更新是异步的，在**下一次渲染**才应用——**state as a snapshot（状态即快照）**：person 在本次渲染全程保持不变，官方用三行 console.log 的时间线证明这一点；记住那句话：**状态变量不是响应式的，组件才是**。警告块里是经典事故：在组件函数体里直接调 setCount(count + 1)——渲染触发更新、更新触发渲染，无限循环（React 有时能检测到并抛 too many re-renders）。第三问「连调两次 set 为什么只加了一次」：传值语义是**替换**——两次「把 person 替换成 age+1 的对象」都基于同一张旧快照，第二次覆盖第一次；要基于最新状态累加就传**更新函数** setPerson(prev => ({...prev, age: prev.age + 1}))，回调保证拿到最新值；顺带一个反直觉事实：React 会尽可能**批处理**更新，两次 set 只重渲染一次。第四问「表单输入怎么接管」：**受控组件**——input 元素自带内部状态，你用 value={value} + onChange={e => setValue(e.target.value)} 把值的唯一事实源搬到自己的 state 里，从此每次击键都经过 React——实时校验、联动、格式化都因此可能。",
      "understand": [
        "结构化状态的总原则（rule of thumb）：**能用现有值、现有 state 和/或 props 算出来的值，不要放进 state**——冗余状态是 bug 与头疼之源",
        "**状态不可变纪律**：原始值天然不可变；引用类型（数组/对象）绝不直接改——要改就复制出新对象（展开语法）再 setState；官方口径：把 state 当 immutable 对待",
        "为什么必须给新对象：setState 用 **Object.is()** 判断新旧状态是否相同——传回同一个引用不保证触发重渲染；嵌套对象与数组要连嵌套层一起复制，state 会很快变棘手，慎用",
        "**状态更新是异步的**：调用 setState 后，React 在**下一次**组件渲染才应用更新——不是立刻改变量",
        "**State as a snapshot（状态即快照）**：状态变量在本次渲染全程保持不变——官方三行 console.log 实证：点击处理器里 set 前后打印的是同一个旧值，新值在下一次渲染才出现",
        "金句：**状态变量不是响应式的，组件才是**——调用 setState 重渲染的是整个组件，不是「就地改变量」",
        "经典事故：在组件函数体里直接调 setState → 渲染引发更新、更新引发渲染 → **无限循环**（React 某些情况下能检测到并抛 too many re-renders 错误）",
        "**传值 = 替换**：连续两次 setPerson({...person, age: person.age + 1}) 都基于同一张旧快照，第二次替换第一次——结果只加了 1 岁",
        "**更新函数（updater function）= 基于最新状态**：setPerson(prev => ({...prev, age: prev.age + 1})) 传回调，React 保证把最新状态作为参数传入——连调两次就真的加 2",
        "更新函数不是永远必要：只在「要基于前一个状态改 + 偏好一致性胜过啰嗦」时考虑用它",
        "**React 批处理状态更新（batching）**：一次事件里的多次 setState 尽可能合并——组件只重渲染一次，官方鼓励你用 console.log 亲自验证",
        "**受控组件（controlled components）**：input 等原生元素自带内部状态；用 value 绑定自己的 state + onChange 更新它，值的唯一事实源就搬进了 React——实时校验等「需要拿到最新输入」的场景都靠这个模式"
      ],
      "terms": [
        {
          "en": "Immutable state",
          "zh": "不可变状态：把 state 当只读对待——要改就复制新对象再 set，绝不原地修改引用类型；setState 依赖 Object.is() 的新旧比对"
        },
        {
          "en": "State as a snapshot",
          "zh": "状态即快照：每次渲染拿到的状态值在该轮渲染全程不变——setState 安排的是「下一轮渲染用新值」，不是「就地改变量」"
        },
        {
          "en": "State updater function",
          "zh": "状态更新函数：给 setState 传回调 (prev) => next——React 保证回调拿到最新状态，连续多次更新才能正确累加"
        },
        {
          "en": "Batching",
          "zh": "批处理：React 尽可能把一次事件里的多次状态更新合并成一次重渲染——两连 set 不等于两连渲染"
        },
        {
          "en": "Controlled component",
          "zh": "受控组件：表单元素的值由 React state 接管（value + onChange 双绑）——值的唯一事实源在 state，不在 DOM"
        },
        {
          "en": "Object.is()",
          "zh": "MDN 参考页在资料区：setState 用它判断新旧状态是否「相同」——同一引用 = 相同 = 可能不重渲染，这就是必须给新对象的底层原因"
        }
      ],
      "tasks": [
        "把官方的 BAD/GOOD 两个 handleIncreaseAge 亲手敲一遍：先跑 BAD 版（person.age = person.age + 1 再 setPerson(person)），观察界面不动或行为诡异；再换 GOOD 版（展开复制新对象）看差异——体感一次 Object.is() 判定",
        "复刻官方三行 console.log 实验（处理器内 set 前后 + 渲染期各一行），点击按钮后按官方给出的输出顺序解释每一行——能讲清「快照」才算过",
        "故意写一次无限循环（组件体内直接 setCount(count + 1)），看 React 抛出的错误信息长什么样——认识它，将来秒懂；顺手去官方 Discord 看看别人怎么解释（选做）",
        "做「连调两次」对照实验：传值版 setPerson 两连（结果 +1 岁）与更新函数版两连（结果 +2 岁）各跑一次，并在渲染期 console.log 验证批处理——只渲染一次",
        "写一个受控 CustomInput（value + onChange），再加一个实时校验：输入少于 3 个字符时在下方显示红字提示——体会「每次击键都经过 React」解锁了什么",
        "完成官方 Assignment：精读 React 文档三篇「state 如同一张快照」「选择 State 结构」「在组件间共享状态」（官方中文版都在本站资料区）",
        "完成官方 Assignment 第 2 条动手任务：改造 Person 组件——加姓、名两个独立输入框，任意一个的每次击键都要同步更新 h1 里的全名（想想全名该不该是第三个 state）"
      ],
      "quiz": [
        {
          "question": "为什么 handleIncreaseAge 里写 person.age = person.age + 1; setPerson(person) 不工作？正确写法是什么？底层判断机制是什么？",
          "answer": "因为这是原地变异（mutation）：改完再把**同一个对象引用**传回 setPerson——setState 用 Object.is() 比对新旧状态，同一引用被判为「没变」，不保证触发重渲染，行为不可预测。正确写法是复制出新对象再改：setPerson({ ...person, age: person.age + 1 })——展开语法把旧值拷进新对象、同时给 age 新值。官方口径：永远把 state 当 immutable 对待。"
        },
        {
          "question": "「状态即快照」是什么意思？用官方三行 console.log 实验的输出解释。",
          "answer": "每次渲染拿到的状态值在该轮渲染全程不变——它是那一轮的快照。实验：点击后处理器里 set 之前打印 person 是旧值 {age: 100}，set 之后打印**还是旧值**——因为 setPerson 安排的是下一轮渲染换新值，不是就地改变量；随后组件重渲染，渲染期的 console.log 才打出新值 {age: 101}。配套金句：状态变量不是响应式的，组件才是。"
        },
        {
          "question": "连续调用两次 setPerson({ ...person, age: person.age + 1 }) 结果加几岁？改成更新函数版呢？为什么？",
          "answer": "传值版只加 1 岁：两次调用都基于**同一张旧快照**构造新对象（都是 age: 101），第二次的「替换」覆盖第一次。更新函数版 setPerson(prev => ({...prev, age: prev.age + 1})) 加 2 岁：传回调时 React 保证把最新状态作为参数传入，第二次回调拿到的是第一次的结果。另外无论哪种写法，React 都会尽可能批处理——组件只重渲染一次。"
        },
        {
          "question": "在组件函数体里直接写 setCount(count + 1) 会发生什么？为什么？",
          "answer": "无限循环：渲染 → 函数体执行 → setState → 触发重渲染 → 函数体又执行 → 又 setState……React 在某些情况下能检测到并抛出「too many re-renders」错误警告你。状态更新必须发生在事件处理器或 effect 里（「组件显示时要跑的逻辑」属于 effect——副作用课展开），绝不能裸写在渲染路径上。"
        },
        {
          "question": "什么是受控组件？写出最小代码形态，并说明它解锁了什么场景。",
          "answer": "让 React state 接管表单元素值的组件：<input value={value} onChange={(e) => setValue(e.target.value)} />——value 把 state 灌进输入框，onChange 把每次击键写回 state，值的唯一事实源在 React 而不在 DOM 内部。解锁一切「需要随时拿到最新输入」的场景：实时校验、输入联动、格式化、提交前检查。放任 input 自带状态叫非受控——课程后面才会用到，现在的纪律是：控制你的组件。"
        }
      ],
      "optional": [
        "官方警告块的邀请：想明白「为什么 React 能检测到无限重渲染并抛错」，可以去 TOP Discord（官方社区入口，见本站第 4 课资料）说说你的解释——官方原话是 score a brownie point"
      ],
      "note": "正文 tip 里的 MDN Object.is() 参考页核验出官方中文版（zh-CN 实测 200、汉字 789）登记本站资料区；Assignment 三篇 React 文档（state-as-a-snapshot / choosing-the-state-structure / sharing-state-between-components）全部核验出官方中文版（zh-hans.react.dev）。正文警告块里的 TOP Discord 邀请链接与第 4 课「加入 Odin 社区」既有条目同址，跨课合并归属首现课不重复登记。正文一张 statically 配图（console 输出截图）按既有口径剔除。「选择 State 结构」与「在组件间共享状态」两篇是官方 Assignment 指定的深入阅读——结构化状态与状态提升的完整方法论在那里，本课正文只给了 rule of thumb。",
      "why": "这一课的四件事是 React 日常开发的全部基本功：不可变更新（写错就是「界面不动」类 bug 的头号来源）、快照心智（写错就是「读到旧值」类 bug 的头号来源）、更新函数（连击、队列场景的正确性来源）、受控组件（一切表单的地基）。两个 Project（CV 应用与记忆卡片）马上就要高强度使用全部四件——尤其受控组件：CV 应用的每个输入框都是它。现在把 BAD/GOOD 对照和三行 console.log 亲手跑一遍，比读十遍总结都管用。",
      "sections": [
        {
          "h": "结构化状态：什么不该放进去",
          "p": [
            "有效管理和结构化状态是构建应用最关键的部分之一——做错了它就是 bug 与头疼之源。",
            "总原则（rule of thumb）：**不要把能用现有值、现有 state 和/或 props 算出来的值放进 state**。Assignment 指定的官方文档「选择 State 结构」把这条展开成完整方法论；本课先立原则。"
          ]
        },
        {
          "h": "状态不可变：永远给新对象",
          "p": [
            "变异（mutate）状态是 React 的禁区——会导致不可预测的结果。原始值（数字、字符串等）天然不可变；但引用类型——数组和对象——绝不能直接改。官方口径：**把 state 当 immutable 对待**，要改状态永远走 setState 函数。",
            "官方 BAD/GOOD 对照：BAD 版在 handleIncreaseAge 里直接 person.age = person.age + 1 再 setPerson(person)——原地变异后传回同一引用；GOOD 版用展开语法复制出新对象、同时给 age 新值：const newPerson = { ...person, age: person.age + 1 }; setPerson(newPerson)。",
            "tip 块给出底层原因：不给 setState 新对象就**不保证重渲染**——setState 用 **Object.is()**（MDN 参考页在资料区）判断前后状态是否相同。嵌套对象和数组会更棘手：嵌套层也得复制，用的时候当心。"
          ]
        },
        {
          "h": "更新是异步的：状态即快照",
          "p": [
            "状态更新是异步的：每次调用 setState，React 在**下一次**组件渲染才应用更新。这个概念需要时间消化，多练就有手感。",
            "记住：**状态变量不是响应式的，组件才是**——调用 setState 重渲染的是整个组件，不是就地改变量。",
            "官方实验：handleIncreaseAge 里 set 前后各一行 console.log，加上渲染期一行。输出时间线：① 首次渲染，person 初始化为 {name: 'John', age: 100}，渲染期打印它；② 点击后，**set 前后两行打印的是同一个旧值**；③ 组件重渲染，person 已是 {age: 101}。结论：person 在本轮渲染全程不变——这就是「**状态即快照（state as a snapshot）**」的含义。"
          ]
        },
        {
          "h": "警告：函数体里直接 setState = 无限循环",
          "p": [
            "官方警告块给了段四行代码：组件函数体里直接 setCount(count + 1)——渲染引发更新、更新引发渲染，无限循环。React 在某些情况下能检测到无限重渲染并抛错（too many re-renders）。",
            "官方还留了个思考题邀你去 Discord 解释「为什么 React 能检测到」——想不清楚也没关系，记住纪律：**更新状态的代码住在事件处理器或 effect 里，不住在渲染路径上**。"
          ]
        },
        {
          "h": "更新函数与批处理",
          "p": [
            " trick 题：连续两次 setPerson({ ...person, age: person.age + 1 }) 会加 2 岁吗？不会。这两句话对 React 的意思是：「把本轮渲染的 person **替换**成 age+1 的对象」×2——关键词是替换：传值给 setState，React 就用你传的值替换当前状态；两次替换都基于同一张旧快照，第二次覆盖第一次。",
            "想基于**最新**状态连续更新，用**状态更新函数（updater function）**：setPerson((prevPerson) => ({ ...prevPerson, age: prevPerson.age + 1 }))——给 setState 传回调，React 保证把最新状态作为参数喂给回调。连调两次，真的加 2 岁。",
            "更新函数不是永远必要：想基于前一个状态改、且偏好一致性胜过啰嗦时，考虑用它。",
            "反直觉加一条：上面连调两次 setPerson，组件却**只重渲染一次**——React 会尽可能**批处理（batching）**状态更新。官方鼓励你用 console.log 亲自验证。"
          ]
        },
        {
          "h": "受控组件：接管 input 的值",
          "p": [
            "有些原生 HTML 元素自带内部状态——input 是典型：你每敲一个键它自己更新自己的 value。很多场景你想**控制**这个值——自己说了算。这就是受控组件。",
            "官方最小形态：用 useState 定义 value，input 上 value={value} 绑定状态、onChange={(event) => setValue(event.target.value)} 把每次击键写回状态——input 不再自持状态，值的唯一事实源在你的 state 里。",
            "这个模式在「需要对用户输入有更多控制」的地方极其有用：实时校验，以及任何需要随时拿到最新输入值的场景。反过来，input 也可以放任非受控、用别的方式取值——课程后面会讲，现在的纪律是：**控制你的组件！**"
          ]
        }
      ],
      "examples": [
        {
          "lang": "jsx",
          "code": "function Person() {\n  const [person, setPerson] = useState({ name: \"John\", age: 100 });\n\n  // BAD——原地变异后传回同一引用：Object.is() 判定「没变」，不保证重渲染\n  const handleIncreaseAgeBad = () => {\n    person.age = person.age + 1;\n    setPerson(person);\n  };\n\n  // GOOD——展开复制新对象，同时给 age 新值\n  const handleIncreaseAgeGood = () => {\n    const newPerson = { ...person, age: person.age + 1 };\n    setPerson(newPerson);\n  };\n\n  return (\n    <>\n      <h1>{person.name}</h1>\n      <h2>{person.age}</h2>\n      <button onClick={handleIncreaseAgeGood}>Increase age</button>\n    </>\n  );\n}",
          "note": "官方 BAD/GOOD 对照完整收录。嵌套对象要连嵌套层一起复制——展开只拷一层。"
        },
        {
          "lang": "jsx",
          "code": "// 快照实证：set 前后打印同一个旧值，新值下一轮渲染才出现\nfunction Person() {\n  const [person, setPerson] = useState({ name: \"John\", age: 100 });\n\n  const handleIncreaseAge = () => {\n    console.log(\"before setPerson:\", person); // {age: 100}\n    setPerson({ ...person, age: person.age + 1 });\n    console.log(\"after setPerson:\", person);  // 还是 {age: 100}！\n  };\n\n  console.log(\"during render:\", person); // 重渲染后才是 {age: 101}\n  return <button onClick={handleIncreaseAge}>+1</button>;\n}",
          "note": "官方三行 console.log 实验。忽略渲染期打印出现两次——那是 StrictMode 的双渲染，副作用课讲。"
        },
        {
          "lang": "jsx",
          "code": "// 传值 = 替换（两次只加 1）vs 更新函数 = 基于最新（两次加 2）\nconst twiceWithValue = () => {\n  setPerson({ ...person, age: person.age + 1 });\n  setPerson({ ...person, age: person.age + 1 }); // 覆盖上一次\n};\n\nconst twiceWithUpdater = () => {\n  setPerson((prev) => ({ ...prev, age: prev.age + 1 }));\n  setPerson((prev) => ({ ...prev, age: prev.age + 1 })); // 基于 prev 累加\n};\n// 两种写法 React 都只重渲染一次（批处理）",
          "note": "官方对照。回调参数名习惯用 prev 前缀；返回新对象记得包圆括号（箭头函数直接返回对象字面量）。"
        },
        {
          "lang": "jsx",
          "code": "// 受控组件最小形态：值的唯一事实源在 state\nfunction CustomInput() {\n  const [value, setValue] = useState(\"\");\n\n  return (\n    <input\n      type=\"text\"\n      value={value}\n      onChange={(event) => setValue(event.target.value)}\n    />\n  );\n}",
          "note": "官方示例。value 灌入、onChange 写回——每次击键都经过 React，实时校验等控制因此可能。"
        }
      ],
      "pitfalls": [
        {
          "title": "原地改数组/对象再 set 回去",
          "text": "person.age += 1; setPerson(person) 或 todos.push(t); setTodos(todos)——引用没变，Object.is() 判「相同」，界面不动或行为诡异。数组用 [...todos, t] / todos.filter(...)，对象用 {...obj, key: newVal}——永远造新的。"
        },
        {
          "title": "set 完立刻读，以为拿到新值",
          "text": "快照心智没建立时的头号 bug：setValue('x') 后同一轮里读 value 还是旧的。要基于旧值算新值就传更新函数；要在更新后做事就放进下一轮渲染或 effect（副作用课讲）。"
        },
        {
          "title": "组件函数体里直接 setState",
          "text": "渲染路径上更新状态 = 无限循环，React 抛 too many re-renders。更新只住在事件处理器或 effect 里。派生值直接渲染期算（const sum = a + b），不要 setSum。"
        },
        {
          "title": "受控 input 忘写 onChange",
          "text": "只写 value={value} 不写 onChange——输入框变成只读（React 会警告）。受控的完整形态永远是 value + onChange 一对；暂时不想处理就写 onChange 空函数并明白自己在干什么。"
        }
      ],
      "official": {
        "assignment": [
          "阅读 React 文档三篇：「state 如同一张快照（State as a Snapshot）」「选择 State 结构（Choosing the State Structure）」「在组件间共享状态（Sharing State Between Components）」（官方中文版入口都在本站资料区）",
          "更新课文里一直用的 Person 组件：加姓、名两个独立输入框，任意一个的每次击键都要更新 h1 里的全名——实现方式很多，写的时候想着本课学的东西"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/states_and_effects/more_on_state.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "ba830f3de785488683b8d20ee427a8ffad59030ecedd65d1546a9e9c8fb435e2",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-react-new-cv-application",
      "title": "Project: CV Application",
      "zh": "项目：CV 简历应用",
      "group": 2,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-cv-application",
      "summary": "React 第一个项目：做一个 CV/简历生成器——用户填信息（基本信息 / 教育经历 / 工作经历三个区块）、点提交后把输入值展示成 HTML 元素，点编辑又能把已填信息回填进输入框改了再交。项目刻意不大：正好把到目前为止的基本功（组件拆分、state 与 props 的高强度使用、受控表单）全用上而没有复杂度负担。另有两件事要办：知道 StrictMode 会让部分代码执行两次（开发期故意行为，下一课展开）；以及学会把 React 应用部署上线——官方给了 Netlify / Vercel / Cloudflare Pages 三个 PaaS 选项，都是「导入 GitHub 仓库 + deploy on push」的路子，比 GitHub Pages 部署构建型应用省事得多。",
      "guide": "以下是官方原课的中文化梳理。这是 Project 课——按本站纪律只给要求中文版、拆解与验收清单，不给成品代码。先读官方提示块：做项目时你可能注意到部分代码执行了两次（console.log 成双出现）——那是 React.StrictMode 的**故意行为**（开发期双渲染帮你抓副作用不干净的 bug），下一课展开，现在不用管。任务拆解六步：① 用 Vite 模板新建 React 项目（上一门 setup 课的肌肉记忆）；② 想清楚组件结构——官方点名三个区块：基本信息（姓名/邮箱/电话）、教育经历（学校/专业/就读时间）、工作经历（公司/职位/主要职责/起止时间）；③ 交互核心：每个区块（或整份 CV）要有**编辑**与**提交**两个按钮——提交 = 表单值转成 HTML 展示元素；编辑 = 输入框重新出现且**回填之前展示的信息**、可改可再交——这一步是 state + props 的高强度综合演练（提示：想想「展示态/编辑态」本身是不是一个 state、回填的值从哪来）；④ src 下建 components/ 目录收纳组件；⑤ src 下建 styles/ 目录放 CSS 并在组件文件里 import；⑥ push 到 GitHub 并部署上线。部署一节值得完整读：GitHub Pages 适合静态页，而 React 应用有构建步骤与之后的路由问题——PaaS（Platform as a Service）替你处理这些，还带 deploy on push（推代码即自动部署）。官方三选一：Netlify（app.netlify.com/start 导入仓库、选分支、Deploy site）、Vercel（vercel.com/new，自动识别 Vite）、Cloudflare Pages（注意创建的是 Pages 不是 Worker，设好构建命令与输出目录）。三个平台的主站、文档与导入入口都在本站资料区。验收清单：三个区块齐；每区块「编辑 ↔ 提交」往返无信息丢失；受控输入（value + onChange 一对不缺）；组件与样式目录结构如官方要求；线上可访问。",
      "understand": [
        "项目目标：CV/简历生成器——用户输入信息 + 生成展示；官方选它做 React 第一项目因为「涵盖目前学过的许多基本概念，且没有巨大的复杂度负担」",
        "**Double rendering（双渲染）**：StrictMode 会让部分代码执行两次（console log 成双）——**故意行为**，帮你抓 bug；下一课展开，本项目里见到不必慌",
        "必备三区块：基本信息（姓名、邮箱、电话）/ 教育经历（学校名、专业、就读日期）/ 工作经历（公司名、职位、主要职责、起止日期）",
        "交互核心：每区块（或整份 CV）配**编辑 + 提交**按钮——提交把输入值展示为 HTML 元素；编辑把输入框加回来且**以之前展示的信息为初值**，可再编辑再提交",
        "官方明示：你会**重度使用 state 和 props**——确认自己真懂了这两个概念再动手",
        "结构要求：src/components/ 目录放组件；src/styles/ 目录放 CSS 文件，并在组件文件里 import 使用",
        "部署新事实：GitHub Pages 适合**静态网页**，React 应用交给 PaaS 更省事——deploy on push（推代码自动部署）+ 不用操心后续课程的路由与构建问题",
        "官方三选一：Netlify（导入 GitHub 仓库 → 选分支（默认 main 即可）→ Deploy site）/ Vercel（导入后自动检测 Vite → 起名 → Deploy）/ Cloudflare Pages（创建时选 **Pages 而不是 Worker**，设对构建命令与输出目录）——课程到这个阶段，选哪个平台都行，上线就好"
      ],
      "terms": [
        {
          "en": "PaaS (Platform as a Service)",
          "zh": "平台即服务：替你跑构建、托管产物的平台（Netlify / Vercel / Cloudflare Pages）——导入仓库即部署，多数带 deploy on push"
        },
        {
          "en": "Deploy on push",
          "zh": "推送即部署：平台监听仓库 push，自动执行构建并发布——省掉「每次手动传 dist」的步骤"
        },
        {
          "en": "React.StrictMode",
          "zh": "开发期检查组件：故意双渲染/双挂载帮你抓不干净的副作用——只影响开发环境，参考页在本站资料区"
        },
        {
          "en": "Controlled input（复习）",
          "zh": "受控输入：value + onChange 双绑——CV 表单每个输入框都该是这个形态，编辑回填才可能实现"
        }
      ],
      "tasks": [
        "新建项目：npm create vite@latest cv-application -- --template react（setup 课的命令，最新 LTS Node）",
        "先画组件树再动手：App 之下三个区块组件（GeneralInfo / Education / Experience 各带表单与展示两态）——想清楚每个区块的 state 放哪：区块自己管，还是 App 统一管再 props 下发？两种都能工作，选定一种并说出理由",
        "实现「提交 → 展示」：受控输入收集值，提交后切换为 HTML 展示元素（想想 isEditing 这类布尔 state 控制两态切换）",
        "实现「编辑 → 回填」：点编辑让输入框重新出现，且 value 是之前展示的信息——这一步通了，说明你的状态结构设计是对的",
        "建 src/components/ 与 src/styles/ 目录：组件归 components、CSS 归 styles 并在组件文件里 import",
        "push 到 GitHub，然后三选一部署（Netlify / Vercel / Cloudflare Pages——步骤都在本课正文与资料区）：验证 deploy on push 生效——再推一次 commit 看线上自动更新",
        "对照验收清单自查：三区块齐 / 编辑↔提交往返无信息丢失 / 全部输入受控 / 目录结构合规 / 线上可访问；见到 console.log 成双不要「修」——那是 StrictMode"
      ],
      "quiz": [
        {
          "question": "做这个项目时 console.log 成双出现，代码有问题吗？为什么会这样？",
          "answer": "不是问题——是 React.StrictMode 的故意行为：开发期把组件双渲染（双挂载）来帮你提前暴露不干净的写法。官方明确说下一课（副作用课）会展开，本项目阶段「不要慌、不要去修」即可。生产构建不受影响。"
        },
        {
          "question": "「编辑按钮要把输入框加回来、且以之前展示的信息为初值」——这个需求对你的状态设计提出了什么要求？",
          "answer": "要求表单数据的唯一事实源必须在 state 里且提交后**不丢**：提交只是切换「展示态/编辑态」（如 isEditing 翻转），不能顺手清空数据；编辑回填就是把 state 里的现值再灌回受控输入的 value。如果提交时把 state 清了、或输入是非受控的（DOM 自持值），回填就无从谈起——这正是官方说「重度使用 state 和 props」的原因。"
        },
        {
          "question": "为什么官方说 React 应用部署用 PaaS 比继续用 GitHub Pages 好？deploy on push 是什么？",
          "answer": "GitHub Pages 面向**静态网页**；React 应用有构建步骤（Vite build 产出 dist），硬上 Pages 需要 hack。PaaS（Netlify / Vercel / Cloudflare Pages）替你执行构建、托管产物，还带 deploy on push——平台监听你的仓库，push 即自动构建发布；而且课程后面的路由、构建等问题它们都处理得了。官方口径：这个阶段选哪个平台都行，上线就好。"
        },
        {
          "question": "Cloudflare Pages 部署时官方特别提醒的坑是什么？Netlify 和 Vercel 各自的关键步骤呢？",
          "answer": "Cloudflare：创建应用时要选 **Pages** 而不是创建 Worker，并设对构建命令与输出目录。Netlify：登录后导入 GitHub 仓库、选部署分支（默认 main 就行）、点 Deploy site。Vercel：vercel.com/new 导入，它会自动检测出你用的是 Vite，起个名字点 Deploy。三家的文档与导入入口都在本站资料区。"
        }
      ],
      "optional": [],
      "note": "Project 红线课：本站只给要求中文版、拆解与验收清单，**不提供成品代码**，本课页无代码示例节。资料区登记 11 条：StrictMode 参考页（官方中文版核验在位；下一课正文的 #strictmode 锚点与本条同页合并）、Vite 静态部署文档（vitejs.dev 301 到 vite.dev 现役路径，官方中文站 cn.vite.dev 实测在位）、Netlify 三链（主站 / 文档 / app.netlify.com/start 导入入口）、Vercel 三链（主站 / 文档 / vercel.com/new 导入入口）、Cloudflare Pages 三链（产品页 pages.cloudflare.com 301 到 www.cloudflare.com/products/pages/ 现役路径 / Pages 文档 / deploy-a-vite3-project 导入指南）——Cloudflare 开发者文档 zh-cn 分区实测 404（Pages 子区未翻译），按内容级核验如实 C 类。任务映射：官方第 6 步「用下文任一选项部署」接 4 链（Vite 部署文档中文版 + 三平台导入入口）；第 1–5 步为本地动手不建条目。",
      "why": "这个项目是 state 与 props 的第一次「无提示综合考」：两态切换（编辑/展示）、回填不丢数据、三个区块的组件拆分——每一个都是前面五课知识点的直接应用，官方刻意不给新知识点让你纯练手。部署环节则是把你的作品第一次真正推上互联网：从这一刻起你的项目有了可以给任何人看的 URL——这套「push 即上线」的工作流会贯穿之后所有项目。",
      "sections": [
        {
          "h": "项目说明：你的第一个 React 项目",
          "p": [
            "恭喜来到第一个 React 项目：做一个小应用，用户输入自己的信息、生成一份 CV/简历。官方选它开篇的理由：它涵盖了你目前学过的许多基本概念，又没有巨大的复杂度负担。",
            "**Double rendering 提示（官方 note 块）**：做项目时你可能注意到部分代码执行了两次（比如 console log 成双出现）——这是 React.StrictMode 导致的**故意行为**。下一课会详细讲，现在不用担心。"
          ]
        },
        {
          "h": "需求拆解：三区块 + 编辑/提交往返",
          "p": [
            "官方六步：① 新建 React 项目；② 思考怎么把应用拆成组件——必须包含三个区块：**基本信息**（姓名、邮箱、电话）、**教育经历**（学校名、专业名、就读日期）、**工作经历**（公司名、职位名、工作主要职责、任职起止日期）；③ 每个区块或整份 CV 要有**编辑与提交按钮**——提交按钮提交表单、把输入框的值展示为 HTML 元素；编辑按钮把输入框加回来（重新展示），**且以之前显示的信息作为初值**，输入框里可以修改并重新提交——官方原话：你会重度使用 state 和 props，确保自己理解了这两个概念；④ src 下建 components 目录放组件；⑤ src 下建 styles 目录放 CSS 文件，需要在组件文件里 import 使用；⑥ 推送成果并部署上线——课程到这个阶段选哪个平台无所谓，项目在互联网上活着就行。"
          ]
        },
        {
          "h": "部署 React 应用：从 GitHub Pages 到 PaaS",
          "p": [
            "到目前为止我们一直用 GitHub Pages 部署**静态网页**——硬要接着用它部署 React 应用也有 hack 路子，但让 PaaS（Platform as a Service）来做要容易得多。这类平台不但能省掉「推完代码再手动操作」的步骤（它们有 **deploy on push** 工具），课程再往后的路由、构建步骤等问题也不用你操心。",
            "官方给了三个精选选项（步骤详见资料区链接）：**Netlify**——最方便的方式是直接导入 GitHub 仓库：推代码 → app.netlify.com/start 登录导入选仓库 → 选部署分支（默认从 main 部署就行）→ 点 Deploy site；也可以上传 dist 或用 netlify-cli，文档都在资料区。**Vercel**——同样导入 GitHub 仓库获得 deploy on push：推代码 → vercel.com/new 导入 → Vercel 自动检测出你在用 Vite → 随意起名 → 点 Deploy。**Cloudflare Pages**——流程与收益类似：推代码 → 按导入指南创建应用（**注意创建的是 Pages，不是 Worker**）→ 设对构建命令与输出目录 → Save and Deploy，看着它活过来。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "提交后把表单 state 清空，编辑时回填不出数据",
          "text": "「展示态」的数据源必须还是那份 state——提交动作只是把 isEditing 翻过去，别顺手 reset。想清空是「新建一份 CV」的需求，那要另设入口。"
        },
        {
          "title": "看到 console.log 成双就去「修」StrictMode",
          "text": "双渲染是开发期故意的检查机制，生产构建没有它。把它当免费体检：成双执行都能正常工作的代码才是干净的代码。官方下一课展开原理。"
        },
        {
          "title": "Cloudflare 上创建成了 Worker",
          "text": "官方专门提醒：创建应用时选 Pages 而不是 Worker——两者是不同的产品入口，选错了部署形态完全不对。构建命令与输出目录（Vite 是 dist）也要设对。"
        }
      ],
      "official": {
        "assignment": [
          "创建一个新的 React 项目",
          "思考如何把应用拆分成组件——应用应包含：添加基本信息的区块（姓名、邮箱、电话号码）；添加教育经历的区块（学校名、专业名、就读日期）；添加工作经历的区块（公司名、职位名、工作主要职责、任职起止日期）",
          "确保每个区块或整份 CV 有编辑与提交按钮：提交按钮提交表单并把输入框的值展示为 HTML 元素；编辑按钮把输入框加回来（重新展示）且以之前显示的信息为初值，可修改后重新提交——你会重度使用 state 和 props，确保理解了这两个概念",
          "在 src 目录下创建 components 目录并放入你的组件",
          "在 src 目录下创建 styles 目录存放 CSS 文件，并在组件文件里 import 使用",
          "推送成果并用下文任一选项部署——课程到这个阶段选哪个平台无所谓，项目在互联网上活着就行（Vite 部署文档中文版与 Netlify / Vercel / Cloudflare Pages 三平台导入入口都在本站资料区）"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/states_and_effects/project_cv_application.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "7dffa80337038affcaec266431c89fc9874f3a39b0cbc442f9cfa6b7fd23d600",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-react-new-how-to-deal-with-side-effects",
      "title": "How To Deal With Side Effects",
      "zh": "如何处理副作用",
      "group": 2,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-how-to-deal-with-side-effects",
      "summary": "副作用（side effect）= 组件与外部世界的交互：向服务器要数据、操作 DOM、发数据出去。渲染代码与事件处理器覆盖不了「在渲染时或状态变化时同步外部系统」的需求——这由 useEffect 负责。官方用一个失控的 Clock 组件（setInterval 每秒 +1）分四步演示 useEffect 的完整形态：裸写 setInterval（每次渲染都新建定时器，计数疯涨）→ 包进 useEffect 不带依赖数组（默认每次渲染后都跑，还是疯涨）→ 加空依赖数组 []（只在挂载时跑一次）→ StrictMode 开发期「挂载-卸载-再挂载」暴露出定时器没清理的 bug（每秒跳 2）→ 返回 cleanup 函数 clearInterval（每次 effect 重跑前与组件卸载时执行）。useEffect 三形态一图流：无数组 = 每次渲染后；[] = 仅挂载；[a, b] = 挂载 + a/b 变化时。最后官方泼冷水：你多半不需要 Effect——渲染期能算的派生值、事件该干的事、用 key 重置、状态提升，四种场景都不该用 useEffect；不必要的 useEffect 是代码坏味道，易错还费性能。",
      "guide": "以下是官方原课的中文化梳理。这一课给 React 心智模型补上最后一块：组件除了「算界面」还要「跟外部世界打交道」。抓两条主线。第一条是 useEffect 的解剖学——官方没有直接给结论，而是让一个 Clock 组件连翻四次车，每次翻车暴露一个参数位的意义：① 把 setInterval 裸写在组件函数体里：每次重渲染都新建一个定时器，旧的还活着，计数瞬间失控——渲染路径上不能放副作用；② 包进 useEffect 但不给依赖数组：useEffect 默认**每次渲染后**都执行，setInterval 照样越积越多——还是失控；③ 给空依赖数组 []：effect 只在挂载时跑一次，计数正常了——但每秒跳 2；④ 跳 2 的真相是 StrictMode 开发期故意「挂载 → 卸载 → 再挂载」：第一次挂载的 interval 没被停掉，和第二次挂载的并存——这暴露的正是缺了 **cleanup 函数**：从 effect 回调返回一个函数，React 会在下次 effect 重跑前和组件卸载时执行它，clearInterval 放进去，一切归位。依赖管理别手搓：官方口径是让 linter（eslint-plugin-react-hooks）告诉你缺什么依赖，修它而不是压制它。第二条主线更重要：**「我们真的需要 effect 吗？」**——useEffect 是 React 常规概念之外的机制，专门用来跟外部系统（服务器、API、浏览器 DOM）同步；用之前只问一个问题：除了 props 和 state，还有什么外部系统需要同步？没有就不该用。四种典型误用官方逐个拆：渲染期能算的派生值（sum = number1 + number2 直接算，不要 setSum + useEffect）；事件该干的事（**显示时**要跑的代码进 effect，其余进事件处理器——用 onChange 而不是 effect 里 addEventListener）；按条件重置状态（给组件加 key，key 课学过——换 key = 重建实例 = 天然重置）；想更新父组件或别的组件的状态（**状态提升**——状态搬到共同父级，单向数据流顺势而下，别拿 effect 当逃生舱）。",
      "understand": [
        "**副作用（side effect）**：组件与自身之外的世界交互——向服务器查数据、查找/改变组件在网页上的位置、必要时向服务器发数据；渲染与事件处理器覆盖不了的需求由 effect 承接",
        "effect 的定位：让你在**渲染时或响应式/状态值变化时**（而非某个特定事件发生时）运行代码，按需同步组件与外部系统",
        "Clock 翻车史第 1 车：setInterval 裸写在组件体——**每次渲染都调用**，状态更新触发重渲染、重渲染再建新 interval，螺旋失控",
        "useEffect 接收回调函数，把计算移出渲染过程；但**不带依赖数组时默认每次渲染后都执行**——第 2 车照翻",
        "**依赖数组（dependency array）**：第二个参数——只在数组里的依赖变化时才重跑 effect；空数组 [] = 只在挂载时跑一次",
        "第 3 车「每秒跳 2」的真相：**StrictMode 开发期行为**——组件被挂载 → 卸载 → 再挂载；第一次挂载的 setInterval 没停，与第二次的并存",
        "**cleanup 函数**：从 useEffect 回调返回的函数——每次 effect 重跑前执行一次、组件卸载时最后执行一次；clearInterval 住进去，bug 消失",
        "useEffect 三形态速记（官方注释块）：无数组 = 每次渲染后都跑；[] = 只在挂载时跑；[a, b] = 挂载时 + a 或 b 变化时跑",
        "依赖管理纪律：通常**不需要手动加依赖**——linter 会告诉你它期望哪些依赖；让 linter 报错并修掉，而不是压制它",
        "effect 使用判据（唯一问题）：除了 props/state，**还有没有需要同步的外部系统**（服务器、API、浏览器 DOM）？没有就不该用 effect——不必要的 useEffect 是代码坏味道（code-smell）、易错、造成无谓的性能问题",
        "误用场景 ①渲染期派生：只基于 state 算东西就直接在渲染里算（const sum = number1 + number2），不要 useState + useEffect + setSum 三件套",
        "误用场景 ②事件：**显示时**要跑的代码才进 effect，其余进事件处理器——input 用 onChange，不要在 effect 里 addEventListener",
        "误用场景 ③按条件重置状态：给组件加 **key**（key 课学过的机制）——key 变化 = 实例重建 = 状态天然重置",
        "误用场景 ④跨组件改状态：**状态提升（lifting the state）**——React 状态单向流、一般向下；多个孩子要用同一份状态就把它搬到共同父级，而不是用 effect 这类逃生舱去改别人"
      ],
      "terms": [
        {
          "en": "Side effect",
          "zh": "副作用：组件与外部世界的交互（服务器、DOM、定时器等）——渲染纯计算之外的一切「对外动作」"
        },
        {
          "en": "useEffect hook",
          "zh": "处理副作用的 Hook：接收回调（副作用本体，可返回 cleanup 函数）+ 可选依赖数组——把「对外动作」从渲染计算里隔离出来"
        },
        {
          "en": "Dependency array",
          "zh": "依赖数组：useEffect 第二参数——effect 只在列出的依赖变化时重跑；[] 仅挂载、无数组每次渲染后、[a,b] 挂载加变化"
        },
        {
          "en": "Cleanup function",
          "zh": "清理函数：effect 回调返回的函数——下次 effect 重跑前与组件卸载时执行；定时器、订阅、监听器的退场通道"
        },
        {
          "en": "Lifting the state up",
          "zh": "状态提升：多个组件需要同一份状态时，把它搬到最近的共同父级、经 props 下发——替代「用 effect 改别人状态」的正解"
        }
      ],
      "tasks": [
        "亲手复刻 Clock 四部曲：裸 setInterval 版 → useEffect 无数组版 → 空数组版 → cleanup 版，每一步都跑起来看计数行为，把「每步为什么翻车/为什么好了」说给自己听",
        "在空数组版停在「每秒跳 2」时，先自己解释原因（StrictMode 挂载-卸载-再挂载 + interval 未清理）再加 cleanup 验证——这是全课最值钱的一次顿悟",
        "把官方三形态注释块抄进你的笔记：无数组 / [] / [a,b] 各配一句人话解释；再想想各自适合什么场景（提示：数据订阅、一次性初始化、跟随某值变化）",
        "做「不需要 effect」四连自查：写一个两数求和组件，先用三件套（useState+useEffect+setSum）写一遍再删成直接计算版，对比代码量；写一个 input 实时回显，用 onChange 而不是 effect+addEventListener；给一个卡片组件加 key 演示重置；把两个子组件共享的计数提升到父级",
        "完成官方 Assignment 三篇阅读：「响应式 Effect 的生命周期」「你可能不需要 Effect」（两篇官方中文版都在本站资料区）+ dmitripavlutin「useEffect 无限循环」一文（初学者最常见错误的专文，在本站资料区）",
        "检查你 CV 项目里的每一个 useEffect（如果有）：逐个问「这里有外部系统要同步吗」——派生值改渲染期计算、事件逻辑搬回处理器"
      ],
      "quiz": [
        {
          "question": "什么是副作用？为什么渲染代码和事件处理器不够用？",
          "answer": "副作用是组件与自身之外世界的交互：向服务器查数据、操作网页 DOM、向服务器发数据等。渲染代码必须是纯计算（同样输入同样输出），事件处理器只在特定事件发生时跑——而很多需求是「渲染时或状态变化时就要与外部系统同步」（比如组件一挂载就开始走秒），既不属于纯渲染也不对应某个用户事件，这由 effect 承接。"
        },
        {
          "question": "Clock 组件的 setInterval 裸写在函数体里为什么失控？包进不带依赖数组的 useEffect 为什么还是失控？",
          "answer": "裸写：setInterval 在每次渲染都被调用——状态每秒更新触发重渲染，每次重渲染又新建一个 interval，旧的全部还活着，更新频率螺旋上升。包进 useEffect 但不带依赖数组：useEffect 默认在**每次渲染后**都执行，interval 照样每渲染一次多一个——本质相同。解法是空依赖数组：只在挂载时执行一次。"
        },
        {
          "question": "空依赖数组版 Clock 为什么每秒跳 2？cleanup 函数是什么、何时执行？",
          "answer": "跳 2 是 StrictMode 的开发期行为暴露的真 bug：StrictMode 把组件挂载 → 卸载 → 再挂载，第一次挂载创建的 setInterval 没有被停掉，与第二次挂载的并存，两个定时器各每秒 +1。cleanup 函数是从 useEffect 回调返回的函数——React 在每次 effect 重跑之前执行它一次、组件卸载时最后执行一次；把 clearInterval(key) 放进去，卸载时定时器被正确清掉，恢复每秒跳 1。"
        },
        {
          "question": "useEffect 的三种依赖形态各自什么时候执行？依赖该怎么管理？",
          "answer": "无数组：每次渲染后都执行；空数组 []：只在挂载时执行一次；[a, b]：挂载时 + 此后 a 或 b 任一变化时执行。管理纪律：通常不需要手动维护依赖——linter（eslint-plugin-react-hooks）会指出它期望的依赖清单，正确做法是按提示修代码，而不是压制警告。"
        },
        {
          "question": "官方给的「该不该用 effect」的唯一判据是什么？列出四种不该用 effect 的场景与各自正解。",
          "answer": "判据：除了 props 和 state，是否存在需要同步的**外部系统**（服务器、API、浏览器 DOM）？没有就不该用。四场景：① 渲染期派生计算——直接在渲染里算（sum = a + b）；② 事件响应——写进事件处理器（显示时跑的才进 effect）；③ 按条件重置状态——给组件加 key，变化即重建实例；④ 想改父级或兄弟组件的状态——状态提升到共同父级、props 下发。不必要的 useEffect 是代码坏味道：易错 + 无谓性能开销。"
        }
      ],
      "optional": [],
      "note": "正文 StrictMode 注释链接（#strictmode 锚点）与上一课（CV 应用）资料区的 StrictMode 参考页整页同页——同页合并不重复登记，锚点事实记此。Assignment 三篇：react.dev「响应式 Effect 的生命周期」与「你可能不需要 Effect」两篇均核验出官方中文版（zh-hans.react.dev，汉字 6053 / 7189）；dmitripavlutin「useEffect 无限循环」一文无官方中文版按 C 类登记。官方四段「不需要 effect」示例代码本站示例区收录两段（派生计算与事件对照），其余以文字转述。",
      "why": "useEffect 是 React 与外部世界唯一的官方通道——数据获取、订阅、定时器、DOM 测量全走它；而「你多半不需要 Effect」这半课同样是保命知识：React 社区最大的一类过度设计就是把派生计算和事件逻辑塞进 effect。这一课的 Clock 四部曲值得完整亲手走一遍——「每秒跳 2」那一刻你对 StrictMode、cleanup、挂载语义的理解会一次性对齐。下一门记忆卡片项目的「组件挂载时洗牌」正是空依赖数组 + 外部数据获取的组合拳。",
      "sections": [
        {
          "h": "什么是副作用",
          "p": [
            "React 里某些组件需要与自身之外的事物交互——可以是向服务器查询数据、查找/改变组件在网页上的位置、甚至在必要时向服务器发送数据。这种与**外部世界**的交互就叫副作用（side effect）。",
            "我们已经熟悉渲染代码和添加事件处理器，但它们不能覆盖所有用途——比如你想连接服务器拉取消息展示给用户。Effect 让你运行一些代码，在**渲染时或响应式/状态值变化时**（而不是某个特定事件发生时）按需同步你的组件。与 useState 类似，React 提供了趁手的 **useEffect** Hook 来在组件里使用 effect。"
          ]
        },
        {
          "h": "Clock 四部曲（上）：裸 setInterval 与无数组 useEffect",
          "p": [
            "官方例子：做一个 Clock 组件显示「网页加载以来过了多少秒」——每秒把 counter 状态加一，setInterval 看起来正是干这个的。把它裸写进组件函数体：**计数瞬间疯涨**。原因：setInterval 不是被调用一次，而是**每次渲染都调用**——首次渲染建了第一个 interval；它每秒更新状态触发重渲染；每次重渲染又调用 setInterval 建更多 interval；更新更频繁、interval 更多，螺旋失控。",
            "useEffect 登场救场：把计算包进 useEffect 回调，移到渲染计算之外。**但还是涨得太快**——因为 useEffect 默认**在每次渲染后都执行**：状态一更新就重渲染，一重渲染 effect 就又跑一遍，interval 照样越积越多。"
          ]
        },
        {
          "h": "Clock 四部曲（下）：依赖数组与 cleanup",
          "p": [
            "第二个参数**依赖数组（dependency array）**来了：它让 effect **只在列出的依赖变化时**才重跑。本例传空数组 []——我们不希望 useEffect 在初次挂载之外的任何时机跑。计数正常了……**但每秒跳 2**。",
            "官方注释块先立依赖管理纪律：通常不需要手动加依赖——你的 **linter 会告诉你它期望的依赖**；让 linter 报错然后修掉，通常好过压制它。三形态速记：useEffect 无数组 = 每次渲染后跑；[] = 只在挂载（组件出现）时跑；[a, b] = 挂载时 + a 或 b 相对上次渲染变化时跑。",
            "跳 2 的原因：这是 **React StrictMode 导致的行为**（参考页锚点在上一课资料区）——StrictMode 下 App 组件被挂载、卸载、再挂载（仅开发环境）。每次 effect 执行都新建一个 setInterval；第一次卸载时 interval **没有被停掉**，还在自增。防住这种不必要行为靠 useEffect 的第三部分——**cleanup 函数**：从回调返回一个函数，它会在下次 effect 运行前执行一次、组件卸载时最后执行一次。把 clearInterval(key) 写进去——终于正常了，计数器欢快地每秒 +1。"
          ]
        },
        {
          "h": "但我们真的需要 effect 吗",
          "p": [
            "useEffect 是 React 常规概念**之外**的机制：它让你把组件与各种外部系统（服务器、API、浏览器 DOM）同步。用 effect 之前只问自己一个问题：**除了 props 或 state，还有没有需要与之同步的外部系统？**不必要的 useEffect 是代码坏味道（code-smell）、易错、造成不必要的性能问题。官方拆了四种不该用的场景：",
            "① **渲染期派生计算**：只是基于 state 算点东西？渲染时直接算。props 变化要改组件显示？也是渲染期算——官方给了对照：setSum + useEffect 三件套是多余的，const sum = number1 + number2 一行完事。",
            "② **事件**：组件**显示时**该跑的代码进 effect，**其余的都进事件处理器**。官方对照：不要在 effect 里给 input 挂 addEventListener/removeEventListener——input 用 onChange 受控形态（上一课刚学的），避免不必要的直接 DOM 操纵。",
            "③ **按条件重置状态**：多数时候不需要 effect——你已经学过 key：像给列表项加 key 一样，给需要重置的组件加上一个随重置条件变化的 key，每个条件值都对应组件的一个全新实例。",
            "④ **想改父级或非子组件的状态**：考虑**状态提升（lifting the state）**。React 状态单向流动、一般沿 DOM 向下——父级在把数据传给孩子之前就知道它；多个孩子需要同一份状态时，把状态搬到包含所有相关组件的父级，而不是拿 effect 当逃生舱。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "jsx",
          "code": "// Clock 失控版：setInterval 裸写在组件体——每次渲染都新建定时器\nimport { useState } from \"react\";\n\nexport default function Clock() {\n  const [counter, setCounter] = useState(0);\n\n  setInterval(() => {\n    setCounter(count => count + 1)\n  }, 1000);\n\n  return <p>{counter} seconds have passed.</p>;\n}",
          "note": "官方第 1 车。状态更新 → 重渲染 → 又建 interval → 更新更快……螺旋失控。"
        },
        {
          "lang": "jsx",
          "code": "// 修复完整版：空依赖数组（只挂载时跑）+ cleanup（卸载/重跑前清定时器）\nimport { useEffect, useState } from \"react\";\n\nexport default function Clock() {\n  const [counter, setCounter] = useState(0);\n\n  useEffect(() => {\n    const key = setInterval(() => {\n      setCounter(count => count + 1)\n    }, 1000);\n\n    return () => {\n      clearInterval(key);\n    };\n  }, [])\n\n  return <p>{counter} seconds have passed.</p>;\n}",
          "note": "官方终点形态。没有 cleanup 时 StrictMode 的挂载-卸载-再挂载会让两个 interval 并存（每秒跳 2）——cleanup 是退场通道。"
        },
        {
          "lang": "jsx",
          "code": "// useEffect 三形态速记（官方注释块）\nuseEffect(() => {\n  // 每次渲染后都执行\n});\n\nuseEffect(() => {\n  // 只在挂载时执行（组件出现时）\n}, []);\n\nuseEffect(() => {\n  // 挂载时执行 + 此后 a 或 b 变化时执行\n}, [a, b]);",
          "note": "官方速记块原样收录。依赖通常不用手搓——linter 会报出它期望的清单，修而不是压。"
        },
        {
          "lang": "jsx",
          "code": "// 不需要 effect 场景①：渲染期派生直接算\nimport { useState } from \"react\";\n\nexport default function AdditionDisplay() {\n  const [number1, setNumber1] = useState(0);\n  const [number2, setNumber2] = useState(0);\n\n  // 这一套全是不必要的：\n  // const [sum, setSum] = useState(0);\n  // useEffect(() => { setSum(number1 + number2); }, [number1, number2]);\n\n  const sum = number1 + number2; // 渲染期一行算完\n\n  return <p>{number1} + {number2} = {sum}</p>;\n}",
          "note": "官方对照示例。场景②的 input 对照（onChange vs effect+addEventListener）结构同理——事件的事交给事件处理器。"
        }
      ],
      "pitfalls": [
        {
          "title": "渲染路径上直接跑副作用",
          "text": "setInterval、fetch、DOM 操作裸写在组件函数体——每次渲染都执行一遍，与重渲染互相喂料直接失控。渲染函数必须纯；对外动作一律住进 useEffect 或事件处理器。"
        },
        {
          "title": "effect 建了资源却不清理",
          "text": "interval/订阅/监听器建了不 return cleanup——StrictMode 开发期立刻暴露（双挂载 = 双份资源），生产环境则是慢性泄漏。纪律：effect 里创建的每个东西，cleanup 里都要有对应的退场动作。"
        },
        {
          "title": "拿 useEffect 当「监听 state 再 setState」的万能胶",
          "text": "派生值渲染期直接算；事件逻辑进处理器；重置用 key；跨组件用状态提升。effect 只留给真正的外部系统同步——「先渲染旧值再被 effect 纠正」的闪烁和多余渲染都是滥用税。"
        }
      ],
      "official": {
        "assignment": [
          "阅读 React 文档「响应式 Effect 的生命周期（Lifecycle of Reactive Effects）」——组件生命周期的不同阶段、渲染发生的时机，以及 useEffect 在其中的角色（官方中文版入口在本站资料区）",
          "阅读 React 文档「你可能不需要 Effect（You Might Not Need an Effect）」——更多关于什么时候不该用 effect 的示例（官方中文版入口在本站资料区）",
          "阅读 dmitripavlutin 的「useEffect 无限循环」一文——解释初学者常犯的一个错误（在本站资料区）"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/states_and_effects/how_to_deal_with_side_effects.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "2eb6d291efdb98c120cc13a5889b5ea70042ae1618faac4db4c4b766d38d651e",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-react-new-memory-card",
      "title": "Project: Memory Card",
      "zh": "项目：记忆卡片",
      "group": 2,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-memory-card",
      "summary": "「状态与副作用」章节的收官项目：记忆卡片游戏——用 hooks 管理状态 + 从外部 API 获取并使用数据。玩法（官方给了一位学生的成品供试玩）：一排图片卡片，点中没点过的卡得分、当前分 +1；点中已经点过的卡游戏结束；**每次点击后卡片全部重新洗牌**——所以记忆的是「点过谁」而不是「谁在哪」。功能硬需求：计分板显示当前分与历史最佳分（Best Score）；洗牌函数在**组件挂载时**也要调用一次；卡片的图片与文字从外部 API 获取（官方给了 Giphy 与 PokéAPI 两个方向，用什么都行）。六步 Assignment 里第 2 步「想清楚结构」是整个项目的重头：需要哪些组件、状态放哪、图片怎么从 API 进 state。",
      "guide": "以下是官方原课的中文化梳理。Project 课照例只给要求中文版、拆解与验收清单，不给成品代码。先玩官方给的学生成品（地址在资料区）把规则体感建立起来：卡片点开是随机排列的图片；点没点过的 +1 分并**全体洗牌**；点到重复的立刻 Game Over；Best Score 记住历史最高。拆解建议（不是唯一解，但每个问题都要有自己的答案）：① 状态设计——cards（API 回来的数据数组）、currentScore、bestScore 三份状态放哪一层？洗牌是改 cards 的顺序，属于状态更新，想想「不可变」纪律怎么应用到数组；② 「点过没点过」怎么记——给每张卡加 clicked 标记还是单独维护一个已点集合？两者在洗牌时的行为想清楚；③ 数据获取——API 数据在**组件挂载时**拉一次：useEffect 空依赖数组 + fetch，这正是上一课「挂载时跑 + 有外部系统要同步」的标准用例；洗牌「挂载时调用一次 + 每次点击后调用」也是官方点名要求；④ 组件拆分——官方提示至少：Scoreboard（当前分 + 最佳分）、CardsGrid（卡片网格与点击处理）、Card（单卡展示）；点击处理链是 Card onClick → 判断 clicked → 加分或结束 → 洗牌；⑤ 数据源二选一：Giphy（搜关键词拿动图，javascript 课程异步章节用过它的 API）或 PokéAPI（宝可梦数据，无需 key）——用别的 API 也行，官方原话是 anything from Giphy to a Pokemon API。红线自查：不 mutate 状态数组（洗牌用 slice/shuffle 复制新数组）；fetch 的 effect 记得依赖数组为 []（不然每次渲染都重新拉）；bestScore 更新只在游戏结束时对比一次。验收清单：挂载即洗牌 + 点击即洗牌；点重复卡正确结束并保住 bestScore；刷新页面 bestScore 归零是正常的（本课不要求持久化——想加 localStorage 是自选扩展）；图片文字来自外部 API 而非硬编码。",
      "understand": [
        "项目目标（官方原话）：用 **hooks 管理和使用状态** + **从外部 API 获取并使用数据**——检验目前学过的概念",
        "游戏规则：先玩官方给的学生成品找感觉——点没点过的卡得分；点重复的结束；**每次点击后卡片随机重排**",
        "硬需求 ①：应用包含**计分板**——当前分（current score）+ **Best Score**（历史最高分）",
        "硬需求 ②：一个在**每次用户点击卡片时**随机重排卡片顺序的函数，且**组件挂载时也要调用**它——「挂载时跑一次」正是 useEffect 空依赖数组的用武之地",
        "硬需求 ③：一把展示图片（可能还有信息文字）的卡片，图片与文字**从外部 API 获取**——官方给的方向：Giphy 到 PokéAPI 之间随便选",
        "流程要求：先想清楚（要哪些功能、需要哪些组件、应用怎么组织、图片怎么从 API 拿到）→ 搭文件夹结构建组件 → 样式做得能拿得出手 → push GitHub + 部署",
        "「点过没点过」的记忆是本项目的算法核心：卡片会洗牌，**位置不可靠**——必须按卡的 id 记，而不是按索引"
      ],
      "terms": [
        {
          "en": "Scoreboard",
          "zh": "计分板：显示当前分与 Best Score 的组件——bestScore 只在游戏结束时与当前分对比更新"
        },
        {
          "en": "Shuffle on click / on mount",
          "zh": "点击/挂载时洗牌：官方两条硬需求——每次点击后重排 + 组件挂载时先排一次（useEffect [] 形态）"
        },
        {
          "en": "PokéAPI",
          "zh": "官方建议的数据源之一（pokeapi.co，宝可梦数据 API，无需密钥）；另一个方向是 Giphy（javascript 课程已用过）"
        }
      ],
      "tasks": [
        "先玩官方给的学生成品（资料区）：连输三把，把规则体感建立起来——特别注意每次点击后卡片顺序全变，想赢只能记住「点过哪些图案」",
        "纸上设计再动手：画出组件树（Scoreboard / CardsGrid / Card）+ 标出三份状态（cards、currentScore、bestScore）住在哪 + 写清点击一张卡后的完整判断链（没点过 → 标记 + 加分 + 洗牌；点过 → 结束 + 对比 bestScore）",
        "选定数据源并跑通 fetch：PokéAPI（如取 12 只宝可梦的图与名）或 Giphy（搜一个关键词取 12 张动图）——先在组件外把请求跑通再进 React",
        "实现挂载时取数 + 洗牌：useEffect 空依赖数组里 fetch 并 setCards（洗牌后存入）——这是上一课「外部系统同步 + 挂载时执行」的标准应用",
        "实现点击逻辑：Card onClick 上抛卡片 id → 判断 clicked → 加分洗牌或结束游戏；洗牌遵守不可变纪律（复制新数组再 set）",
        "样式做到「能拿得出手」（官方原话 show it off）；push GitHub 并部署（CV 项目学的三平台任选）",
        "验收自查：挂载即洗牌 / 点击即洗牌 / 点重复正确结束 / bestScore 正确保留 / 数据真来自 API；进阶自选：bestScore 存 localStorage 跨刷新保留"
      ],
      "quiz": [
        {
          "question": "为什么「记住点过哪些卡」必须按卡片 id 而不能按位置索引？",
          "answer": "因为官方硬需求是每次点击后卡片全体重新洗牌——位置每次都变，按索引记的话上一轮「索引 3 点过」这一轮对应的是另一张卡，游戏逻辑直接崩坏。按 id（或图案本身）记录，洗牌只改展示顺序、不影响「谁被点过」的判断——这与 key 一课「按稳定身份跨渲染认人」是同一个思想。"
        },
        {
          "question": "「组件挂载时调用一次洗牌/取数」用什么形态实现？为什么？",
          "answer": "useEffect(() => { ...fetch/洗牌... }, [])——空依赖数组形态：只在挂载时执行一次。不带数组会每次渲染后都重跑（反复 fetch）；这也不是事件（没有用户动作触发），所以不住事件处理器——「挂载时与外部系统同步」正是 effect 的本职（副作用课判据：有外部系统——API 服务器）。"
        },
        {
          "question": "bestScore 应该在什么时机更新？写出判断逻辑。",
          "answer": "游戏结束时（点到重复卡）一次性对比：if (currentScore > bestScore) setBestScore(currentScore)。不该每次加分都更新——那样 currentScore 与 bestScore 永远相同，「历史最佳」失去意义。这也是状态结构化原则的应用：bestScore 是独立状态不是派生值，因为跨局要记住。"
        },
        {
          "question": "洗牌时为什么不能直接对 state 里的 cards 数组 sort/reverse 再 setCards？正确做法？",
          "answer": "原地 sort/reverse 是变异——改完传回同一引用，Object.is() 判「没变」，不保证重渲染（再谈状态一课的核心纪律）。正确做法：先复制新数组再洗（如 setCards(prev => shuffle([...prev])) 或洗牌函数返回新数组），保证每次都是新引用。"
        }
      ],
      "optional": [
        "自选扩展（官方未要求）：bestScore 存 localStorage 跨刷新保留；卡片翻面动画；难度选项（卡片数量）"
      ],
      "note": "正文「How the game works」给的学生成品演示站（heldersrvio.github.io/memory-card-game，实测 200）登记本站资料区。Assignment 第 3 条数据源两个方向：Giphy 与 javascript 课程「异步 JavaScript 与 API」课既有条目同址——跨课合并归属首现课不重复登记（任务映射按防悬空纪律不接）；PokéAPI（pokeapi.co，实测 200）为新条目登记本课资料区。第 1/2/4/5/6 步为本地动手与部署操作不建映射条目；本课部署复用 CV 应用课正文的三平台指引（官方未重复给链接）。",
      "why": "这是「状态与副作用」章节的毕业考：三份状态的协作（cards/currentScore/bestScore）、挂载时同步外部系统（fetch + 洗牌）、每次点击的不可变数组更新、按 id 跨渲染认人——四件事分别对应本章节四课的核心知识点，一个项目全部串起来。做完它，你对「React 应用 = 状态设计 + 副作用管理」的理解就从读得懂变成写得出了。",
      "sections": [
        {
          "h": "项目说明：hooks 与外部 API 的综合应用",
          "p": [
            "又一个新项目！官方目标：确保你理解了目前为止的概念——主目标是**用 hooks 管理和使用状态，同时从外部 API 获取并使用数据**。这是「状态与副作用」章节的收官检验：三份状态协作、挂载时取数、点击时洗牌，全都来自本章节四课。"
          ]
        },
        {
          "h": "玩法：先去玩成品",
          "p": [
            "玩法：去玩官方给的学生成品（地址在资料区）亲自体会记忆卡片怎么玩。那个示例用的是卡通角色，你的游戏想用什么都行。规则归纳：一排图案卡片；点没点过的得分；点重复的结束；每次点击后全体洗牌——所以能依靠的只有「点过谁」的记忆，位置每轮都不可靠。"
          ]
        },
        {
          "h": "需求拆解：六步 Assignment",
          "p": [
            "官方六步：① 新建 React 项目；② 花时间想清楚要哪些功能、需要哪些组件、应用怎么组织、图片怎么从 API 拿到——应用必须包含**计分板**（当前分 + Best Score 历史最高分），必须有一个**在用户每次点击卡片时随机重排卡片**的函数，且**组件挂载时要调用**这个函数；③ 需要一把展示图片（可能还有信息文字）的卡片，图片文字**从外部 API 获取**——从 Giphy 到 PokéAPI 都行（两者入口都在资料区）；④ 想清楚结构后搭文件夹结构、开始建组件；⑤ 样式做到能拿得出手（show it off）；⑥ 照例 push GitHub + 部署。",
            "拆解提示（本站补充，不是官方步骤）：状态三件套 cards / currentScore / bestScore；「点过没点过」按卡片 id 记（洗牌让位置不可靠）；挂载时取数与洗牌是 useEffect [] 的标准用例；点击链 = Card 上抛 id → 判断 → 加分洗牌或结束对比 bestScore。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "按索引记「点过的卡」",
          "text": "每次点击后洗牌，位置全变——按索引记等于每轮都失忆。按 id 记（clicked 标记在卡片对象上，或单独一个已点 id 集合）。"
        },
        {
          "title": "fetch 的 useEffect 不带依赖数组",
          "text": "每次渲染后都重新请求 API——无限请求风暴（渲染 → fetch → setState → 渲染……）。取数只在挂载时跑一次：依赖数组必须是 []。"
        },
        {
          "title": "原地洗牌 state 数组",
          "text": "cards.sort()/reverse() 后 setCards(cards)——同一引用不保证重渲染，界面经常「没洗动」。复制新数组再洗：shuffle([...cards])。"
        }
      ],
      "official": {
        "assignment": [
          "创建一个新的 React 项目",
          "花时间想清楚：要实现哪些功能、需要哪些组件、如何组织应用、怎么从 API 获取图片。应用应包含计分板——统计当前分，以及显示历史最高分的 Best Score；要有一个在用户每次点击卡片时随机重排卡片顺序的函数，且组件挂载时调用它",
          "还需要一把展示图片（可能还有信息文字）的卡片，图片与文字从外部 API 获取——从 Giphy 到 PokéAPI 都可以（Giphy 归属本站 javascript 课程既有条目、PokéAPI 在本站资料区）",
          "想清楚应用结构后，搭好文件夹结构并开始创建组件",
          "给应用做好样式，让它能拿得出手",
          "照例把项目 push 到 GitHub，并且别忘了部署"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/states_and_effects/project_memory_card.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "5ebabae4600af2ae72f5c2c81a85b69f9be4b05d4cfd406244ce0719558916e6",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-react-new-class-based-components",
      "title": "Class Based Components",
      "zh": "基于类的组件",
      "group": 3,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-class-based-components",
      "summary": "到此为止的组件全是函数式——这是当下主流，但你一定会在旧代码库里遇到另一种写法：**基于类的组件（class-based components）**。2019 年 2 月之前函数组件甚至被叫作 state-less（无状态）组件——Hooks 出现后函数组件才有了状态、类组件退居维护场景。本课把函数组件逐段「翻译」成类组件：class ClassInput extends Component（React 的 Component 基类提供组件资格）；props 经 constructor 传入并 super(props) 后就能用 this.props 访问；JSX 从 render() 方法返回（类组件里唯一必需的方法）；状态在 constructor 里以 this.state = {...} 初始化、用预定义的 this.setState 更新（同样不可变异）；最大的坑是 **this 绑定**——类方法默认不绑定 this，要么在 constructor 里逐个 bind，要么用箭头函数类属性让 this 自动绑定。练习仓库还是 react-examples（class-components/ 目录，函数版与类版同一功能并排）。",
      "guide": "以下是官方原课的中文化梳理。这一课的定位要先摆正：**不是让你用类组件写新代码，是让你读得懂旧代码**——官方原话：职业生涯里你大概率要跟遗留代码（legacy code）打交道，总会有对着类组件的日子。历史脉络：React 刚发布时组件就是类写法；2019 年 2 月 Hooks 出现之前，函数组件没法管理状态、被叫作 state-less 组件；Hooks 让函数组件更简洁（less verbose、neater），类组件退居维护场景。正文的主线是一次「逐段翻译」：官方在 react-examples 仓库 class-components/ 目录放了同一功能的两个版本（FunctionalInput.jsx 与 ClassInput.jsx），让你对照着把函数版重建成类版，四步走：① **类的资格**——class ClassInput extends Component：不是随便一个类，React 的 Component 基类提供「够格当组件」的全部属性；② **constructor 与 props**——props 传给构造函数，配合 super 方法之后就能在 this 语境里用（this 指组件实例）；没有 props 时 constructor 与 super 空参也合法；好奇 super 到底干了什么可以查 MDN super 关键字文档（资料区，官方中文版）；③ **render() 返回 JSX**——函数组件「返回 JSX」这件事在类组件里住进 render 方法，props 经 this.props 取用；④ **state 与 this 绑定**——状态在 constructor 里 this.state = {...} 初始化，更新用预定义的 this.setState（不可变异纪律照旧：每次都要给新状态）；方法默认**不绑定 this**，要么 constructor 里 this.handleInputChange = this.handleInputChange.bind(this) 逐个绑，要么用箭头函数语法定义方法让 this 自动绑定实例（可以省掉 constructor 里的 bind）。Assignment 三条全是给 ClassInput 加功能的本地动手：每个任务加删除按钮（从 state 数组里移除该项）、新写一个 Count 类组件显示 todo 数量并渲染进 ClassInput、每个任务加编辑按钮（todo 变输入框、按钮变 Resubmit——官方标注这条较难，做完值得自夸）。",
      "understand": [
        "定位：函数式是当下主流，但**旧代码库里全是类**——职业生涯大概率要维护遗留代码，本课目标是读得懂、改得动，不是拿来写新组件",
        "历史事实：React 初发布时组件就是类写法；**2019 年 2 月之前函数组件叫 state-less（无状态）组件**——Hooks 出现后函数组件能管状态了，类组件退居二线",
        "组件资格：`class ClassInput extends Component`——继承 React 的 Component 基类（import { Component } from 'react'），基类提供「够格当 React 组件」的全部属性",
        "props 通道：props 传给 **constructor**，`super(props)` 之后就能在 **this** 语境里访问（this 指组件实例）；组件没有 props 时 constructor 与 super 空参也合法",
        "JSX 出口：类组件从 **render() 方法**返回 JSX——props 用 this.props.属性名 取（对照函数组件的 props.属性名 或解构）",
        "状态通道：constructor 里 **this.state = { ... }** 初始化；更新用预定义的 **this.setState** 方法——状态不可变异纪律照旧，每次必须给新状态",
        "**this 绑定大坑**：类方法默认不绑定 this——声明的方法必须在 constructor 里 bind（this.handleInputChange = this.handleInputChange.bind(this)），惯例在 constructor 做而不是渲染时做",
        "绑定替代方案：用**箭头函数语法**定义方法，this 自动绑定到类实例——可以跳过 constructor 里的 bind",
        "练习仓库：react-examples 的 class-components/ 目录——FunctionalInput.jsx 与 ClassInput.jsx 同一功能两版并排，官方让你先读函数版（读几遍，喝口水）再对照类版"
      ],
      "terms": [
        {
          "en": "Class-based component",
          "zh": "基于类的组件：extends Component 的类写法——React 早期唯一形态，Hooks 前的函数组件因不能带状态被叫 state-less"
        },
        {
          "en": "constructor / super(props)",
          "zh": "构造函数与 super：props 经 constructor 传入、super(props) 后可在 this 语境访问——MDN super 文档在资料区"
        },
        {
          "en": "render() method",
          "zh": "渲染方法：类组件返回 JSX 的出口，唯一必需的生命周期方法（下一课展开它的双身份）"
        },
        {
          "en": "this.state / this.setState",
          "zh": "类组件的状态通道：constructor 里 this.state 初始化、setState 更新——同样不可变异，更新函数形态同样存在"
        },
        {
          "en": "this binding",
          "zh": "this 绑定：类方法默认不绑 this——constructor 里逐个 bind，或用箭头函数类属性自动绑定"
        }
      ],
      "tasks": [
        "fork + clone react-examples 仓库（与状态简介课同一个），cd 进 class-components/，npm install + npm run dev——两个版本同一功能并排跑起来",
        "按官方节奏读代码：先读 FunctionalInput.jsx（官方原话：好大一块代码，慢慢来，喝口水，读它几遍），再对照 ClassInput.jsx 逐段找对应物——props 在哪进、JSX 从哪出、state 在哪初始化、方法在哪绑",
        "完成官方 Assignment 第 1 条：给每个任务加删除按钮——从 state 数组里移除该项（想想不可变纪律：filter 出新数组再 setState）",
        "完成官方 Assignment 第 2 条：新写一个 Count 类组件显示 todo 数量，渲染进 ClassInput 内部（数量从哪来？props 传入还是状态共享？想清楚再写）",
        "完成官方 Assignment 第 3 条（官方标注较难，做完值得自夸 kudos）：每个任务加编辑按钮——todo 变输入框、按钮变 Resubmit、可保存修改",
        "自查两题：为什么方法要在 constructor 里 bind 而不是 render 里？箭头函数类属性为什么能免 bind？（提示：bind 返回新函数——render 每次都 bind 就每次都产生新引用）"
      ],
      "quiz": [
        {
          "question": "一个类要「够格」当 React 组件，必须做什么？props 是怎么进来、怎么访问的？",
          "answer": "必须继承 React 的 Component 基类：class ClassInput extends Component（import { Component } from 'react'）——基类提供组件资格所需的全部属性。props 传给 constructor(props)，配合 super(props) 之后就能在 this 语境里访问：this.props.name。组件没有 props 时，constructor 与 super 空参也合法。"
        },
        {
          "question": "函数组件「返回 JSX」「用 useState 管状态」这两件事，在类组件里分别对应什么？",
          "answer": "返回 JSX → render() 方法（类组件里 JSX 从 render 返回，它是唯一必需的方法）；useState → constructor 里 this.state = {...} 初始化 + 预定义的 this.setState 更新。不可变异纪律不变：setState 同样要给新状态而不是原地改；setState 同样支持传更新函数拿最新状态。"
        },
        {
          "question": "为什么 handleInputChange 这类方法要在 constructor 里 bind(this)？不绑会怎样？官方给的免绑替代方案是什么？",
          "answer": "类方法默认不绑定 this——不绑的话方法被当回调传出去（如 onChange={this.handleInputChange}）再被调用时，内部 this 是 undefined，this.setState 直接报错。constructor 里 this.handleInputChange = this.handleInputChange.bind(this) 把 this 焊死为组件实例（惯例在 constructor 做、不在 render 里做——render 每次执行都 bind 会每次产生新函数引用）。替代方案：用箭头函数语法定义方法，this 自动绑定类实例，省掉 bind。"
        },
        {
          "question": "「2019 年 2 月之前函数组件叫 state-less 组件」——这句话背后的历史是什么？学类组件现在的意义何在？",
          "answer": "Hooks（2019 年 2 月发布）之前函数组件没法管理状态，只能做纯展示——所以被叫无状态组件，有状态的组件只能写类。Hooks 让函数组件更简洁、更整齐，类组件退居二线。现在的意义是维护：职业生涯大概率要跟遗留代码打交道，旧 React 代码库里全是类——读得懂 constructor/render/setState/bind 这套，才接得住存量项目。"
        }
      ],
      "optional": [
        "官方 Hint：真好奇 super 到底做了什么，查 MDN 的 super 关键字文档（官方中文版在本站资料区）"
      ],
      "note": "正文 react-examples 仓库 class-components/ 练习目录按 css-exercises 练习目录先例登记本站资料区（与状态简介课的 state/ 目录是同仓库不同目录，各自登记）。正文 super 关键字的 MDN 文档核验出官方中文版（zh-CN 实测 200、汉字 2105）登记资料区。Assignment 三条全部为本地动手（给 ClassInput 加删除/计数/编辑功能），无第三方外链——任务映射为显式空映射。ClassInput 四段渐进代码是官方完整演化史（类声明 → constructor+props → render → state+绑定），本站示例区收录终点完整形态与绑定对照两段，代码语义与官方逐字一致。",
      "why": "这一课买的是「遗留代码保险」：市面上跑着的大量 React 项目诞生在 Hooks 之前，面试和维护都躲不开类组件。学习成本其实很低——你已经有函数组件的完整心智模型，类组件只是同一套概念（props/state/渲染）换了个语法外壳：props 走 constructor、state 走 this.state、渲染走 render()、事件处理器多一道 bind。把官方练习仓库的三条 Assignment 做完（尤其第 3 条编辑功能），你对「this 绑定」的理解会顺带超过多数只会箭头函数的人。下一课把类组件最后一块拼图——生命周期方法——补上。",
      "sections": [
        {
          "h": "历史：React 组件的另一副面孔",
          "p": [
            "到此为止你写的组件全是函数式的风格与语法——这在当下很常见，但你也会见到另一种 **class（类）**语法。本课探索类组件怎么写、props 与 state 这些概念在里面怎么用。",
            "React 组件刚诞生时不长现在这样。翻任何旧一点的 React 代码库，你会看到大量类——这就是**基于类的组件（class-based components）**。**2019 年 2 月之前，函数组件也被叫作 state-less（无状态）组件**——因为当时它们没有办法管理状态。Hooks 出现改变了这一点，组件从此更简洁、更整齐（less verbose and 'neater'）。",
            "职业生涯里你大概率要处理遗留代码（legacy code），所以总会有对着类组件干活的日子。来看看它的门道。"
          ]
        },
        {
          "h": "练习环境：同一功能的两副面孔",
          "p": [
            "老规矩：fork + clone react-examples 仓库（没做过的话），cd 进 **class-components/** 目录，npm install 后 npm run dev。你会看到同一功能有两个版本——一个函数组件、一个类组件。",
            "先从 src/components/**FunctionalInput.jsx** 里的函数组件读起。官方原话：这是好大一块代码，慢慢来，喝口水（sip some water），读它几遍。"
          ]
        },
        {
          "h": "第一步与第二步：类的资格、constructor 与 props",
          "p": [
            "src/components/ClassInput.jsx 是完成的类版本。往回退几步，看它怎么从函数版一步步重建。第一件事——鼓点声——是一个**类**！但不能是随便一个类：它需要某些属性才够格当 React 组件。React 把这些属性全放在一个叫 **Component** 的类上，我们继承它来写组件：class ClassInput extends Component { }，再 export default。",
            "类一般少不了 **constructor**：传给组件的 props 会传进类的构造函数；它连同 **super** 方法让你能在 **this**（此处指组件本身）的语境里使用 props。真好奇 super 实际干了什么，去查 MDN 的 super 关键字文档（资料区）。组件没有 props 的话，constructor 和 super 空着参数也完全合法。"
          ]
        },
        {
          "h": "第三步与第四步：render、state 与 this 绑定",
          "p": [
            "props 能在类组件里访问了，下一个问题是 JSX 怎么渲染——答案：从 **render 方法**返回 JSX！constructor 里声明的 props 照样能用。注意 props 现在经 **this** 提供（this.props.name），不像函数组件最初那样直接是参数。",
            "接下来是状态：类组件的 state 作为 **constructor 的一部分初始化**（this.state = { todos: [], inputVal: '' }），更新用预定义的 **setState** 方法。记住：状态不可变异，每次都要设新状态。",
            "最后补全功能时只有一个差别要注意：**每声明一个方法，都必须把方法的 this 绑定到类**才能用——类里的方法默认不绑定 this。惯例在 constructor 里做（而不是运行时/渲染方法里）：this.handleInputChange = this.handleInputChange.bind(this)。替代方案：用**箭头函数语法**定义方法，this 自动绑定到类实例，constructor 里的 bind 就能省了。",
            "官方收尾：就这么简单，一个基于类的组件成功建成。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "jsx",
          "code": "// 官方 ClassInput 终点完整形态（class-components/ 目录）\nimport { Component } from \"react\";\n\nclass ClassInput extends Component {\n  constructor(props) {\n    super(props);\n\n    this.state = {\n      todos: [],\n      inputVal: \"\",\n    };\n\n    this.handleInputChange = this.handleInputChange.bind(this);\n    this.handleSubmit = this.handleSubmit.bind(this);\n  }\n\n  handleInputChange(e) {\n    this.setState((state) => ({\n      ...state,\n      inputVal: e.target.value,\n    }));\n  }\n\n  handleSubmit(e) {\n    e.preventDefault();\n    this.setState((state) => ({\n      todos: state.todos.concat(state.inputVal),\n      inputVal: \"\",\n    }));\n  }\n\n  render() {\n    return (\n      <section>\n        <h3>{this.props.name}</h3>\n        <form onSubmit={this.handleSubmit}>\n          <label htmlFor=\"task-entry\">Enter a task: </label>\n          <input\n            type=\"text\"\n            id=\"task-entry\"\n            name=\"task-entry\"\n            value={this.state.inputVal}\n            onChange={this.handleInputChange}\n          />\n          <button type=\"submit\">Submit</button>\n        </form>\n        <h4>All the tasks!</h4>\n        <ul>\n          {this.state.todos.map((todo) => (\n            <li key={todo}>{todo}</li>\n          ))}\n        </ul>\n      </section>\n    );\n  }\n}\n\nexport default ClassInput;",
          "note": "官方完整演化终点。四要素齐：extends Component / constructor+super(props) / this.state+setState（注意 setState 的更新函数形态）/ constructor 里 bind。render() 里的受控 input 与函数版一模一样。"
        },
        {
          "lang": "jsx",
          "code": "// this 绑定两方案对照\n// 方案一：constructor 里逐个 bind（官方主方案）\nclass Bound extends Component {\n  constructor(props) {\n    super(props);\n    this.handleClick = this.handleClick.bind(this);\n  }\n  handleClick() { /* this 已是实例 */ }\n}\n\n// 方案二：箭头函数类属性——this 自动绑定，免 bind\nclass ArrowBound extends Component {\n  handleClick = () => { /* this 天然是实例 */ };\n}",
          "note": "官方点出的两条路。不绑的普通方法被当回调调用时 this 是 undefined。"
        }
      ],
      "pitfalls": [
        {
          "title": "方法忘了 bind，回调里 this 变 undefined",
          "text": "onChange={this.handleInputChange} 传的是方法引用——类方法默认不带 this，调用时 this 为 undefined，this.setState 直接 TypeError。constructor 里 bind 或改用箭头函数类属性，二选一。"
        },
        {
          "title": "在 render 里 bind",
          "text": "官方点名惯例在 constructor 做：render 每次执行都 bind 一遍，每次都产生新函数引用——子组件的浅比较优化全被打破，还平白多出每渲染一次的开销。"
        },
        {
          "title": "this.state 直接改",
          "text": "this.state.todos.push(t) 然后 setState——和函数组件一样是变异禁区。类组件的 setState 同样要求新状态：concat/filter/展开造新的。setState 也支持传函数拿最新状态，和 useState 的更新函数同理。"
        }
      ],
      "official": {
        "assignment": [
          "既然已有一个完成的类组件，给它加功能：为每个任务实现删除按钮——按钮把对应任务从 state 数组里移除，从而删掉任务本身。样式此刻不是重点，但 button 标签应有默认样式",
          "实现一个新的类组件 Count，随时显示 todo 的数量，把它渲染在 ClassInput 组件内部的某处",
          "为每个任务实现编辑按钮：把 todo 替换成输入框、按钮本身变成 Resubmit，编辑得以保存——这条相对更难，做完值得自夸（kudos）"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/class_components/class_based_components.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "785234e091d270502a2b3164b40aa828ce29da388d6ad8863bc7945dd985fc28",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-react-new-component-lifecycle-methods",
      "title": "Component Lifecycle Methods",
      "zh": "组件生命周期方法",
      "group": 3,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-component-lifecycle-methods",
      "summary": "类组件的最后一块拼图：生命周期方法。组件一生分三个阶段——挂载（mounting）、更新（updating）、卸载（unmounting），类组件给每个阶段配了专属方法：render()（唯一必需，挂载与更新都跑，必须纯：不改状态、同输入同输出、不直接碰浏览器）；componentDidMount()（挂载进 DOM 树之后跑——取数据、依赖 DOM 的操作住这里）；componentDidUpdate()（每次重渲染后跑——里面更新状态必须加 prevProps 条件判断，否则无差别 setState 就是无限循环；响应 DOM 变化或用户变化重新取数住这里）；componentWillUnmount()（卸载销毁前跑——取消网络请求、清定时器等清理动作住这里）。收官对照：函数组件的 useEffect 本质就是这三个方法的组合——依赖数组的形态决定它对应谁：[] = componentDidMount；[a,b] = didMount + didUpdate（仅依赖变化时）；无数组 = didMount + didUpdate 合体；回调返回的函数 = componentWillUnmount。",
      "guide": "以下是官方原课的中文化梳理。上一课说 useEffect 之前你已在函数组件里用「生命周期」思维看过组件（副作用课官方文档「响应式 Effect 的生命周期」），这一课把类组件版的生命周期方法逐个点名，最后做一件对整个 World 5 前半程都很重要的事：**把 useEffect 与生命周期方法对上号**。三阶段先立骨架：mounting（挂进 DOM）、updating（重渲染）、unmounting（拆除销毁）——每个阶段在类组件里都有指定方法。四个方法逐个过：① **render()**——用得最多的生命周期方法、也是**唯一必需**的；挂载与更新时都跑；纪律是**纯**：不修改组件状态、同样输入返回同样东西、不直接与浏览器交互；② **componentDidMount()**——组件挂载（插入 DOM 树）**之后**跑；组件需要的数据获取应该放这里，一切「依赖组件已在 DOM 里」的操作也住这里；③ **componentDidUpdate()**——组件**重渲染之后**跑；正因如此要小心在里面更新什么：无差别 setState 会引发重渲染、重渲染又触发 didUpdate——**无限循环**；避免之道是更新状态前对**前后 props 是否相等**做条件判断；这里该住的是「响应 DOM 变化或状态变化要做的更新」，官方例子：用户变了就重新拉该用户的数据；④ **componentWillUnmount()**——组件卸载并销毁**之前**的最后一次调用；清理动作之家：取消网络请求、清除定时器等等。最后的对照表是全课最值钱的部分——**useEffect 本质上是 componentDidMount + componentDidUpdate + componentWillUnmount 的组合**，对应关系由依赖数组与返回值决定：**空依赖数组 = componentDidMount**（只挂载时跑）；**[值] = didMount + didUpdate 的组合**（挂载时 + 依赖变化时）；**无依赖数组 = didMount + didUpdate 合体**（挂载 + 每次更新）；**回调里返回的函数 = componentWillUnmount**（卸载时清理）。官方配了段小代码：useEffect(() => { placeholderFunction(); return () => cleanupFunction(); }, [])——含 didMount（执行体）与 willUnmount（返回函数）的功能，因为空数组而没有 didUpdate。Assignment 两条：① wojtekmaj 的组件生命周期图（交互式全景图，资料区）；② React 文档 Component 参考页——从 constructor(props) 读到 componentWillUnmount()，**留心已弃用（deprecated）的 API**，其余 API 当补充信息（官方中文版在资料区，8902 汉字全站目前最厚的 react.dev 参考页）。",
      "understand": [
        "组件一生三阶段：**mounting（挂载）/ updating（更新）/ unmounting（卸载）**——类组件给每个阶段配了专属方法",
        "**render()**：最常用的生命周期方法、类组件**唯一必需**的方法；挂载与更新时都跑；必须**纯**——不修改组件状态、同输入同输出、不直接与浏览器交互",
        "**componentDidMount()**：挂载（插入 DOM 树）后执行——**取数据住这里**；依赖「组件已在 DOM 里」的操作也住这里",
        "**componentDidUpdate()**：每次重渲染后执行——里面更新状态**必须加条件**（对前后 props 做相等判断），无差别 setState = 重渲染 = 又触发 didUpdate = **无限循环**",
        "didUpdate 的正当住户：响应 DOM 变化或状态变化需要做的更新——官方例子：用户变化时重新获取该用户的数据",
        "**componentWillUnmount()**：卸载销毁前最后一次调用——**清理动作之家**：取消网络请求、清除定时器等",
        "收官对照：**useEffect 本质是 didMount + didUpdate + willUnmount 三者的组合**——具体对应谁由依赖数组与返回值决定",
        "对照明细：**[] = componentDidMount**；**[a, b] = didMount + didUpdate（仅依赖变化时更新）**；**无数组 = didMount + didUpdate 合体**；**回调返回的函数 = componentWillUnmount**",
        "官方示例解读：useEffect(() => { fn(); return () => cleanup(); }, []) 含 didMount（执行体）与 willUnmount（返回函数）功能，**没有** didUpdate（空数组）",
        "Assignment 阅读纪律：Component 参考页只精读 constructor(props) 到 componentWillUnmount()，**留心 deprecated API**（弃用的别学），其余当补充信息"
      ],
      "terms": [
        {
          "en": "Lifecycle methods",
          "zh": "生命周期方法：类组件在挂载/更新/卸载各阶段的专属钩子——render、componentDidMount、componentDidUpdate、componentWillUnmount"
        },
        {
          "en": "Mounting / Updating / Unmounting",
          "zh": "挂载/更新/卸载：组件一生三阶段——插入 DOM 树 / 重渲染 / 拆除销毁"
        },
        {
          "en": "componentDidMount()",
          "zh": "挂载后钩子：取数据与依赖 DOM 的操作之家——对应 useEffect 的空依赖数组形态"
        },
        {
          "en": "componentDidUpdate()",
          "zh": "更新后钩子：响应 props/状态变化的再动作——内部 setState 必须加 prevProps 条件防无限循环"
        },
        {
          "en": "componentWillUnmount()",
          "zh": "卸载前钩子：清理动作之家（取消请求/清定时器）——对应 useEffect 回调返回的 cleanup 函数"
        },
        {
          "en": "Deprecated API",
          "zh": "已弃用 API：Component 参考页里标注弃用的旧方法——官方明说阅读时留心，别学进去"
        }
      ],
      "tasks": [
        "先搭骨架再填肉：默写三阶段四方法的对应表（mounting→render+didMount；updating→render+didUpdate；unmounting→willUnmount），再逐方法写一句「什么代码住这里」",
        "玩官方 Assignment 第 1 条的 wojtekmaj 生命周期图（资料区）：交互式的，点每个方法看它在时间线上的位置与官方注释——把 didMount/didUpdate/willUnmount 三个点截图进笔记",
        "把 useEffect 对照表做成自己的速查卡：[] / [a,b] / 无数组 / 返回函数 四行，每行写出等价的类方法组合——这张卡是函数组件与类组件之间的翻译词典",
        "官方示例自测：useEffect(() => { fn(); return () => cleanup(); }, [userId]) 对应哪些生命周期方法？（答案：didMount + 仅 userId 变化时的 didUpdate + willUnmount——没有「每次更新都跑」）",
        "完成官方 Assignment 第 2 条：React 文档 Component 参考页从 constructor(props) 读到 componentWillUnmount()（官方中文版在资料区）——按官方纪律留心 deprecated API，其余当补充信息",
        "回看 Clock 四部曲（副作用课）：用本课词汇重讲一遍——interval 建在 didMount 时机、clearInterval 住在 willUnmount 时机、StrictMode 的双挂载 = 挂载→卸载→再挂载"
      ],
      "quiz": [
        {
          "question": "组件生命周期的三个阶段是什么？类组件各自有哪些方法在场？",
          "answer": "挂载（mounting，插入 DOM 树）、更新（updating，重渲染）、卸载（unmounting，拆除销毁）。在场方法：render() 挂载与更新都跑（唯一必需）；componentDidMount() 挂载后；componentDidUpdate() 每次更新后；componentWillUnmount() 卸载前。"
        },
        {
          "question": "render() 的「纯」纪律具体指三条什么？",
          "answer": "① 不修改组件状态（渲染路径上不 setState）；② 同样的输入返回同样的东西（无副作用、无随机性）；③ 不直接与浏览器交互（DOM 操作、请求都不属于 render）。要「不纯」的动作，住进 didMount/didUpdate/willUnmount。"
        },
        {
          "question": "componentDidUpdate 里为什么不能无差别 setState？官方的防循环手段是什么？这里正当的住户是谁？",
          "answer": "因为 didUpdate 在每次重渲染后跑——里面 setState 引发重渲染、又触发 didUpdate，无限循环。防法：更新状态前对**前后 props（prevProps）是否相等**做条件判断，只在真正变化时更新。正当住户：响应 DOM 变化或状态变化的再动作——官方例子：用户变了就重新获取该用户的数据。"
        },
        {
          "question": "把 useEffect 四种形态逐一翻译成类生命周期方法组合。",
          "answer": "空依赖数组 [] = componentDidMount（只挂载时跑）；[a, b] = componentDidMount + componentDidUpdate（且仅当 a/b 变化时）；无依赖数组 = componentDidMount + componentDidUpdate 合体（挂载 + 每次更新后都跑）；回调返回的函数 = componentWillUnmount（卸载时清理）。官方示例 useEffect(fn+cleanup, []) 含 didMount 与 willUnmount、不含 didUpdate。"
        },
        {
          "question": "读 Component 参考页时官方给了哪两条阅读纪律？为什么？",
          "answer": "① 范围：从 constructor(props) 读到 componentWillUnmount()，其余 API 当补充信息——参考页很长，主线的四个方法才是本课要求的深度；② 留心 deprecated（已弃用）API——React 淘汰过一批旧生命周期方法（如 componentWillMount 系），文档里还在但别学进新代码，认得「弃用」标记才能安全地读旧代码库。"
        }
      ],
      "optional": [],
      "note": "Assignment 两条都登记本站资料区：wojtekmaj「React 生命周期方法图」交互工具（projects.wojtekmaj.pl，实测 200，无中文版按 C 类）；React 文档 Component 参考页核验出官方中文版（zh-hans.react.dev，汉字 8902——目前全站最厚的 react.dev 中文参考页）。官方阅读范围纪律（constructor 到 willUnmount、留心 deprecated API）已转达进任务文案。本课无正文外链、无配图。",
      "why": "这一课是类组件章节的收束，也是两套世界观的翻译层：以后你在旧代码库里看到 componentDidMount 里 fetch、willUnmount 里 clearInterval，脑中能立刻翻译成「哦，这是 useEffect(fn, []) + cleanup」——反之亦然。这张翻译词典的价值在维护遗留项目时最直接：需求来了要在类组件里加数据获取，你知道住 didMount；要防 didUpdate 死循环，你知道加 prevProps 条件。World 5 之后的课程全部用函数组件 + Hooks——类组件这两课是你「读旧写新」的完整装备。",
      "sections": [
        {
          "h": "三阶段：组件的一生",
          "p": [
            "上一节你学了组件的生命周期——函数组件里我们主要用 useEffect 在生命周期各阶段干活；类组件则要用**专门的生命周期方法**。",
            "先简短复习：组件的一生有**三个阶段——挂载（mounting）、更新（updating）、卸载（unmounting）**。每个阶段在类组件里都有指派的方法，这就是本课内容。"
          ]
        },
        {
          "h": "render() 与 componentDidMount()",
          "p": [
            "**render()**：用得最多的生命周期方法，上一课你已经见过。它是类组件**唯一必需**的生命周期方法，在组件挂载与更新时运行。render 应该是**纯的**：不修改组件状态、每次调用（同样输入下）返回同样的东西、不直接与浏览器交互。",
            "**componentDidMount()**：组件**挂载后**（插入 DOM 树后）运行。组件需要的**数据获取调用应该放这里**；任何依赖「组件已挂载在 DOM 里」的操作也适合在这里做。"
          ]
        },
        {
          "h": "componentDidUpdate() 与 componentWillUnmount()",
          "p": [
            "**componentDidUpdate()**：组件**重渲染后**运行。正因如此，必须小心你在里面更新什么——**无差别更新状态就会引发重渲染，你会掉进无限循环**。避免之道：更新状态时对**前后 props 是否相等**做条件判断。这个方法里该做的是「响应 DOM 变化、或响应你想在变化时行动的状态」的更新——例如：**用户变了就重新获取用户数据**。",
            "**componentWillUnmount()**：最后一个生命周期方法，在组件**卸载并销毁之前**调用。这里该做**清理动作**：取消网络请求、清除定时器等等。"
          ]
        },
        {
          "h": "useEffect 如何合体三个方法",
          "p": [
            "学完类生命周期方法，有用的认知来了：函数组件的 **useEffect 本质上就是 componentDidMount、componentDidUpdate 与 componentWillUnmount 的组合**——它具体对应哪个/哪些方法，由**依赖数组**与**是否有返回**决定：",
            "**空依赖数组** ≙ componentDidMount；**数组里有值** ≙ componentDidMount + componentDidUpdate 的组合（仅依赖变化时更新）；**无依赖数组** ≙ componentDidMount + componentDidUpdate 合体；**useEffect 回调里返回的函数** ≙ componentWillUnmount。",
            "官方示例：useEffect(() => { placeholderFunction(); return () => cleanupFunction(); }, [])——这个 effect 含 componentDidMount 的功能（执行体）与 componentWillUnmount 的功能（返回函数）；因为依赖数组为空，它**没有** componentDidUpdate 的功能。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "jsx",
          "code": "// 官方对照示例：这一段的 useEffect 含 didMount + willUnmount，不含 didUpdate\nuseEffect(() => {\n  placeholderFunction();          // ≙ componentDidMount 时机\n  return () => cleanupFunction(); // ≙ componentWillUnmount 时机\n}, [])                            // 空数组 ⇒ 没有 didUpdate 成分\n\n// 类组件等价物（示意）：\n// componentDidMount()    { placeholderFunction(); }\n// componentWillUnmount() { cleanupFunction(); }",
          "note": "官方压轴对照。把四形态速查卡（[] / [a,b] / 无数组 / 返回函数）抄进笔记——这是函数组件与类组件之间的翻译词典。"
        }
      ],
      "pitfalls": [
        {
          "title": "didUpdate 里无条件 setState",
          "text": "重渲染 → didUpdate → setState → 重渲染……无限循环。要在这里更新状态，先判 prevProps/prevState 与当前值是否真的变了——相等就跳过。函数组件同型错误：effect 里 set 了依赖数组里的状态。"
        },
        {
          "title": "把取数据/定时器放错阶段",
          "text": "数据获取住 didMount（不是 render——render 必须纯；也不是 constructor——DOM 还没挂载）；清理住 willUnmount（漏了就是 Clock 课的「每秒跳 2」类泄漏）。对照函数组件：[] effect + cleanup。"
        },
        {
          "title": "把 deprecated 生命周期学进新代码",
          "text": "官方阅读纪律：留心 deprecated API。componentWillMount / componentWillReceiveProps 一类旧方法文档里还在但已弃用——旧代码里认得它们即可，新代码永远不写。"
        }
      ],
      "official": {
        "assignment": [
          "看看这张组件生命周期图（wojtekmaj 的交互式设计，在本站资料区）——生命周期方法的高质量可视化呈现",
          "通读 React 文档 Component 参考页（官方中文版在本站资料区）：从 Reference 区的 constructor(props) 读到 componentWillUnmount()，**留心已弃用的 API**；其他 API 当作补充信息"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/class_components/component_lifecycle_methods.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "9ba30fd3010bb58dd12f0e783989f602159c286eede47cc2317b59a1239da976",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-react-new-introduction-to-react-testing",
      "title": "Introduction To React Testing",
      "zh": "React 测试简介",
      "group": 4,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-introduction-to-react-testing",
      "summary": "React 应用的 UI 测试入门。World 3 学过用 Jest 测纯逻辑（Battleship 只测底层游戏不碰 DOM），但逻辑全绿不等于 UI 正确——列表渲染错了、拖放目标失效了，逻辑测试看不见。本课换装：因为项目用 Vite，测试运行器从 Jest 换成与 Vite 原生集成的 Vitest；查询与交互用 React Testing Library（RTL）的 render / screen / getByRole 与 userEvent。三个包各司其职：@testing-library/react 给 render、@testing-library/jest-dom 给 toBeInTheDocument 等自定义断言、@testing-library/user-event 模拟用户交互。查询三家族 getBy / queryBy / findBy，官方优先级首推 ByRole（顺带保证可访问性）。快照测试 toMatchSnapshot 一条断言顶多条，但有两类失真：假阳性（快照过了不代表组件正确）与假阴性（改个标点快照就挂）——懂得什么时候用、什么时候不用才是本课的落点。",
      "guide": "以下是官方原课的中文化梳理。开场先立动机：你在 Battleship 项目里写过不碰 DOM 的纯逻辑测试——改坏了逻辑测试会红，这很好；但 **UI 的 bug 逻辑测试看不见**：把 state 从对象改成数组后列表不再渲染预期文本、给组件加个条件后拖放目标悄悄失效……而且说句实话，每次改代码你不可能记得手动复查每个相关 UI。所以 UI 测试的价值与逻辑测试同源：**给你信心**——网站包含预期内容、按预期行为，不满足时立刻报警。环境搭建是重头戏：因为课程用 Vite，测试运行器从 Jest 换成 **Vitest**（与 Vite 集成顺滑），跟着 Robin Wieruch 的 Vitest + RTL 搭建指南走一遍（资料区），装完再补一个小包 @testing-library/user-event。官方贴士（lesson-note）：即使按教程在 vite.config.js 设了 globals: true，ESLint 仍会因不认识这些全局变量报错——最直接的解法是**显式 import 需要的全局函数**（describe/it/expect），此时可以省掉 globals: true。然后认清三个包的分工：@testing-library/react 提供 render 等核心函数；@testing-library/jest-dom 提供 toBeInTheDocument 一类自定义匹配器（非必装，Jest/Vitest 自带匹配器已很多）；@testing-library/user-event 提供 userEvent 模拟用户交互。第一个测试：render(<App />) 里的「render」不会真的出现屏幕——**jsdom 在内存里模拟 DOM（含事件）而不做视觉排版**，测试解析的是这份内存 DOM（真跑浏览器的端到端测试是另一族工具，超出本课范围）。查询用 screen.getByRole('heading') 一类方法；查询分三家族 **getBy / queryBy / findBy**，官方文档的「Types of Queries」与「Priority」两节要细读（资料区）；**ByRole 是首选**——配 name 选项精确化（getByRole('heading', { name: 'Our First Test' })），且 ByRole 查询天然保证 UI 对鼠标用户和辅助技术用户都可访问。模拟交互：userEvent.setup() 拿 user 对象，await user.click(button) 点击后断言标题变化——注意测试回调要 async/await。两个纪律：每个测试都单独 render（**RTL 在每次测试后自动卸载组件**）；重复代码多时抽自定义 setup 函数而不是把 render 挪进 beforeEach。快照测试：expect(container).toMatchSnapshot() 自动生成快照文件（组件的 HTML 表示），此后每次比对，**组件稍有变化测试就挂**。优点：快、省代码（一条断言免写按钮与标题的存在性检查）、挡住意外变更。但两类失真要想清楚：**假阳性**——快照通过不能证明组件正确，bug 可能溜过去，过度依赖快照会让开发者对代码过度自信；**假阴性**——最无关紧要的改动（改标点、换更语义化的标签）也让快照挂掉，频繁误报会让你对整个测试套件失去信心。快照不是坏东西，但要懂什么时候快照、什么时候不快照。Assignment 四条：① Kent C. Dodds 的 Testing Implementation Details——避免测实现细节以减少假结果与脆测试；② 浏览 RTL cheatsheet 全部查询方法 + test id 文档（查询方法都不够用时才用 test id）；③ userEvent API 文档；④ 两篇快照测试优缺点文章（tsh.io 深入利弊、SitePen 讲快照测试对编程的意义）。官方提示：部分文章用 Jest 与 Enzyme 写，概念可迁移。",
      "understand": [
        "UI 测试补的是逻辑测试的盲区：逻辑全绿 ≠ UI 正确——列表文本、拖放目标这类问题只有把 DOM 拉进测试才看得见",
        "课程技术栈切换：项目用 Vite → 测试运行器用 **Vitest**（与 Vite 原生集成），查询与交互用 **React Testing Library（RTL）**",
        "三个包分工：@testing-library/react 给 render 等核心函数；@testing-library/jest-dom 给 toBeInTheDocument 等自定义匹配器（非必装）；@testing-library/user-event 给 userEvent 模拟交互",
        "render 不产生可见屏幕：**jsdom 在内存里模拟 DOM 与事件**、不做视觉排版——真跑浏览器的 E2E 测试是另一族工具",
        "查询三家族 **getBy / queryBy / findBy**；官方优先级首推 **ByRole**（配 name 选项精确化）——ByRole 查询顺带保证可访问性",
        "userEvent 用法：userEvent.setup() 拿 user，**await** user.click(button)——测试回调要 async",
        "每个测试单独 render：RTL 在每次测试后自动卸载已渲染组件；重复代码抽 setup 函数，别把 render/userEvent 挪进 beforeEach",
        "快照测试 = 渲染结果与快照文件比对：组件稍变即挂；优点是快、一条断言顶多条、挡意外变更",
        "快照两类失真：**假阳性**（通过≠正确，过度依赖致过度自信）与**假阴性**（改标点也挂，误报磨掉对套件的信心）——懂何时用何时不用",
        "ESLint 与 Vitest globals：与其开 globals: true 再配 ESLint，不如显式 import describe/it/expect"
      ],
      "terms": [
        {
          "en": "Vitest",
          "zh": "Vite 原生测试运行器：本站 React 课程从 Jest 切换而来——API 与 Jest 高度兼容（vi.fn() 对应 jest.fn()）"
        },
        {
          "en": "React Testing Library (RTL)",
          "zh": "React 测试库：以「用户视角」查询与交互组件的测试工具集——render、screen、getByRole、userEvent"
        },
        {
          "en": "jsdom",
          "zh": "内存 DOM 模拟器：不做视觉排版，让测试能在 Node 环境解析与操作 DOM（含事件）"
        },
        {
          "en": "getBy / queryBy / findBy",
          "zh": "查询三家族：getBy 找不到即抛错 / queryBy 找不到返回 null（断言不存在用它）/ findBy 异步等待出现"
        },
        {
          "en": "ByRole query",
          "zh": "按 ARIA 角色查询：官方首选查询方式——配 name 选项精确化，且天然校验可访问性"
        },
        {
          "en": "userEvent",
          "zh": "用户交互模拟 API：userEvent.setup() 后经 user.click() 等以 async/await 触发贴近真实的交互"
        },
        {
          "en": "Snapshot testing",
          "zh": "快照测试：toMatchSnapshot() 把渲染结果存成快照文件、此后逐次比对——快而省，但有假阳性与假阴性两类失真"
        }
      ],
      "tasks": [
        "跟 Robin Wieruch 的 Vitest + RTL 搭建指南（资料区）在本地搭好测试环境，再补装 @testing-library/user-event——官方明说「搭完回来集合」",
        "写官方第一个测试：App 渲染 <h1>Our First Test</h1>，用 screen.getByRole('heading') + toMatch(/our first test/i) 断言；再升级为 getByRole('heading', { name: 'Our First Test' }) 体会 name 选项的精确化",
        "写官方点击测试：Magnificent Monkeys 按钮点击后变 Radical Rhinos——先 toMatchSnapshot 存快照，再用 userEvent.setup() + await user.click() 断言标题；跑完打开生成的快照文件看它的 HTML 表示",
        "通读 RTL queries 文档的「Types of Queries」与「Priority」两节（资料区）：把 getBy/queryBy/findBy 三家族与 ByRole 优先级写成一页速查",
        "完成官方 Assignment 四条：Testing Implementation Details 一文（减少假结果与脆测试）、RTL cheatsheet 浏览全部查询方法 + test id 文档、userEvent API 文档、两篇快照优缺点文章——部分文章用 Jest/Enzyme 写，概念可迁移",
        "自测快照的两类失真各举一个本课例子：假阳性——快照里按钮文字本来就是错的也会「通过」；假阴性——把 <div> 换成语义化 <section> 快照就挂"
      ],
      "quiz": [
        {
          "question": "已经写过纯逻辑测试（如 Battleship 底层游戏），为什么还需要 UI 测试？",
          "answer": "逻辑测试不碰 DOM，看不见 UI 层的 bug：state 结构改了列表不再渲染预期文本、加了条件后部分拖放目标失效——逻辑全绿 UI 照样坏。而且每次改动不可能手动复查所有相关 UI，UI 测试把「网站包含预期内容、按预期行为」变成自动报警。"
        },
        {
          "question": "render(<App />) 之后屏幕上什么都看不到——测试到底在解析什么？",
          "answer": "jsdom 在内存里模拟的 DOM（含事件），不做任何视觉排版。screen.getByRole 等查询解析的是这份内存 DOM。真跑浏览器环境的端到端测试是另一族工具，超出本课范围。"
        },
        {
          "question": "getBy / queryBy / findBy 三家族的分工是什么？官方为什么首推 ByRole？",
          "answer": "getBy 找不到即抛错（找「应该在」的元素）；queryBy 找不到返回 null（断言「不该在」的元素只能用它）；findBy 返回 Promise 异步等待元素出现。ByRole 首选有两个理由：配 name 选项查询最精确贴近用户视角；按 ARIA 角色查询天然保证 UI 对鼠标与辅助技术用户都可访问。"
        },
        {
          "question": "为什么每个测试都要单独 render，而不是在 beforeEach 里 render 一次？",
          "answer": "React Testing Library 在每次测试后自动卸载已渲染的组件——上一个测试的 DOM 不会留到下一个。官方也不建议把 render 与 userEvent 调用放进 beforeEach：重复代码应抽成自定义 setup 函数，保持每个测试块自包含、可读、不漏状态。"
        },
        {
          "question": "快照测试的两类失真各是什么？为什么说「快照通过」不等于「组件正确」？",
          "answer": "假阳性：快照只比对「与上次一致」，无法证明组件行为正确——bug 若已进快照就永远「通过」，过度依赖会让开发者过度自信。假阴性：最无关紧要的改动（改标点、换语义化标签）也让快照挂，频繁误报磨掉对整个套件的信心。快照快而省、能挡意外变更，但要懂什么时候用什么时候不用。"
        }
      ],
      "optional": [],
      "note": "官方正文外链较多，全部登记本站资料区：Vitest 官网与快照文档、RTL intro / render API / queries / cheatsheet / bytestid / userEvent 五页文档、Robin Wieruch 搭建指南（官方指定跟做）、jest-dom GitHub、Kent C. Dodds 实现细节一文、tsh.io 与 SitePen 两篇快照利弊文。正文的 Jest 官网裸首页与 Vite 官网裸首页为跨课合并条目（归属 javascript 测试课与「搭建 React 环境」课）不重复登记。Assignment 官方提示已转达进任务文案：部分文章用 Jest 与 Enzyme，概念可迁移。",
      "why": "这一课把 World 3 学过的测试思维搬进 React 世界：TDD 的判断力、mock 的手法、断言的纪律全部复用，换的只是工具层（Jest→Vitest、手动 DOM→RTL 查询）。真正的新知识是「用户视角」哲学：ByRole 优先、别测实现细节、快照慎用——这三条决定了你写的测试是资产还是负债。下一课深入 mocking，之后 Shopping Cart 项目会要求你用 RTL 完整测试一个带路由的应用——本课就是那一步的地基。",
      "sections": [
        {
          "h": "为什么 UI 也要测",
          "p": [
            "你在 Battleship 项目里写过只测底层游戏、完全不碰 DOM 的测试——非 UI 改动弄坏了逻辑，测试会红，你去修好，这套循环你已经熟了。",
            "但 UI 的 bug 逻辑测试看不见：游戏逻辑全对，不代表 UI 真显示了你想显示的东西、真让用户按你想的方式交互。而且说实话——每次改代码（不管是否与 UI 相关），你不可能记得手动复查每个相关 UI 细节。",
            "官方举的两类真实事故：把 state 从普通对象改成数组后，列表不再包含预期文本；给组件加了个条件后，拖放卡片的最后三个放置目标悄悄失效。网站越复杂，好的测试（UI 与非 UI）价值越高——**UI 测试给我们信心：网站包含预期内容、按预期行为，一旦不再满足要求就通知我们**。"
          ]
        },
        {
          "h": "搭建 React 测试环境",
          "p": [
            "此前课程用 Jest 做测试运行器；因为 React 项目用 Vite，本课切换到与 Vite 集成顺滑的 **Vitest**，再用 **React Testing Library（RTL）**补上组件查询与交互能力。跟着 Robin Wieruch 的 Vitest + RTL 搭建指南走一遍（资料区），装完再补一个小包：npm install @testing-library/user-event --save-dev。",
            "官方贴士：即使按教程在 vite.config.js 设了 globals: true，ESLint 仍会因不认识这些全局变量而报错——最直接的解法是**显式 import 用到的全局函数**（describe / it / expect），此时可以省掉 globals: true。",
            "三个 @testing-library 包的分工：**react** 提供 render 等核心函数；**jest-dom** 提供 toBeInTheDocument 等自定义匹配器（完整清单在其 GitHub——Jest/Vitest 自带匹配器已很多，此包非必装）；**user-event** 提供 userEvent API 模拟用户与网页的交互。"
          ]
        },
        {
          "h": "第一个查询：render、screen 与 getByRole",
          "p": [
            "render(<App />) 的「render」不会让你看到任何屏幕：搭建时装的 **jsdom 在内存里模拟 DOM（含事件）**、不做视觉排版，测试解析的就是这份内存 DOM。真跑浏览器环境的端到端测试是另一族更复杂的工具，超出本课范围。",
            "官方第一个测试：App 渲染 <h1>Our First Test</h1>，测试里 render(<App />) 后 expect(screen.getByRole('heading').textContent).toMatch(/our first test/i)——正则带 i 标志做大小写不敏感比较。npm test App.test.jsx 跑通。",
            "getByRole 只是十来个查询方法之一。查询分三家族：**getBy / queryBy / findBy**——官方 queries 文档的「Types of Queries」与「Priority」两节要细读（资料区）。**ByRole 是官方首选**，配 name 选项更精确：getByRole('heading', { name: 'Our First Test' })。ByRole 查询还有一层红利：它保证 UI 无论用户用鼠标还是辅助技术导航都人人可访问。"
          ]
        },
        {
          "h": "模拟用户事件",
          "p": [
            "官方示例：一个按钮把标题从 Magnificent Monkeys 改成 Radical Rhinos（useState + clickHandler）。测试分两条：第一条 render 后 expect(container).toMatchSnapshot() 存初始快照（screen 没有 container 属性，所以从 render 解构 container）；第二条 const user = userEvent.setup()，render 后 screen.getByRole('button', { name: 'Click Me' }) 拿到按钮，**await user.click(button)**，断言标题变成 radical rhinos——回调函数是 async 的，因为要 await。",
            "两个纪律：**每次测试后 RTL 自动卸载已渲染组件**，所以每个测试都要重新 render；组件测试很多时，与其把 render 挪进 beforeEach，不如抽一个自定义 setup 函数——官方与 RTL 文档都建议 setup（含 userEvent.setup()）待在测试块内部，重复代码用 setup 函数收敛，可读性更好、状态泄漏风险更小。"
          ]
        },
        {
          "h": "快照测试：是什么、两类失真",
          "p": [
            "快照测试 = 把渲染结果与快照文件比对。跑完「renders magnificent monkeys」后自动生成的快照文件就是 App 组件的 HTML 表示（button + h1 的完整结构），此后每次快照断言都拿新的渲染结果与它比——**App 稍有变化，测试就挂**。",
            "优点：快、好写——一条 toMatchSnapshot 省掉按钮存在性、标题存在性等多行断言；还能挡住意外变更悄悄爬进代码。",
            "但要想清楚*到底测了什么*：**假阳性**——快照通过无法证明组件正确，bug 可能不被察觉，过度依赖快照会让开发者对代码过度自信；**假阴性**——最微不足道的改动也让测试挂：改个标点，挂；把标签换成语义化更好的，也挂——频繁误报可能让你对整个测试套件失去信心。快照不是天生坏东西，它确有其用；**懂得什么时候快照、什么时候不快照才是收益所在**。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "jsx",
          "code": "// App.test.jsx —— 官方第一个测试\nimport { describe, it, expect } from \"vitest\";\nimport { render, screen } from \"@testing-library/react\";\nimport App from \"./App\";\n\ndescribe(\"App component\", () => {\n  it(\"renders correct heading\", () => {\n    render(<App />);\n    // 正则 i 标志做大小写不敏感比较\n    expect(screen.getByRole(\"heading\").textContent).toMatch(/our first test/i);\n  });\n});",
          "note": "显式 import describe/it/expect（不开 globals: true 的 ESLint 友好写法）。getByRole 可升级配 name 选项：getByRole('heading', { name: 'Our First Test' })。"
        },
        {
          "lang": "jsx",
          "code": "// 模拟点击：快照 + userEvent 两条测试\ndescribe(\"App component\", () => {\n  it(\"renders magnificent monkeys\", () => {\n    // screen 没有 container 属性——从 render 解构\n    const { container } = render(<App />);\n    expect(container).toMatchSnapshot();\n  });\n\n  it(\"renders radical rhinos after button click\", async () => {\n    const user = userEvent.setup();\n    render(<App />);\n    const button = screen.getByRole(\"button\", { name: \"Click Me\" });\n    await user.click(button);\n    expect(screen.getByRole(\"heading\").textContent).toMatch(/radical rhinos/i);\n  });\n});",
          "note": "第二条回调是 async——await user.click() 必需。每条测试单独 render：RTL 每条测试后自动卸载组件。"
        }
      ],
      "pitfalls": [
        {
          "title": "开了 globals: true 还被 ESLint 骂",
          "text": "vite.config.js 的 globals: true 只喂给 Vitest，ESLint 不认识这些全局变量仍会报错。官方给的最直接解法：测试文件里显式 import { describe, it, expect } from 'vitest'，然后 globals: true 可以不要。"
        },
        {
          "title": "忘写 await user.click()",
          "text": "userEvent 的事件是异步的：不 await，断言可能在交互完成前就跑了，测试变成碰运气。测试回调也要相应改成 async () => {...}。"
        },
        {
          "title": "过度依赖快照",
          "text": "快照通过≠组件正确（假阳性），改标点就挂（假阴性）。行为断言（getByRole + toHaveTextContent）才是主力；快照留给「结构大变动需要人看一眼」的场合。"
        }
      ],
      "official": {
        "assignment": [
          "读 Kent C. Dodds 的 Testing Implementation Details（资料区）——学会避开「测试实现细节」，减少假测试结果与不灵活的测试",
          "浏览 React Testing Library cheatsheet（资料区）上的全部查询方法——不必全用，但特定查询用特定方法最优；查询方法都不够用时还有 test id 选项，见 RTL 的 bytestid 文档（资料区）",
          "读 userEvent API 文档（资料区），体会用户模拟怎么做",
          "读两篇快照测试文章（资料区）：tsh.io 的 Pros and Cons of Snapshot Tests 深入利弊；SitePen 的 Snapshot Testing: Benefits and Drawbacks 讲清快照测试对编程的意义"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/react_testing/introduction_to_react_testing.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "bdd613687afe764a634673a6cfad3a5443d487ee061d32c716e3d94514234306",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "node-path-react-new-mocking-callbacks-and-components",
      "title": "Mocking Callbacks And Components",
      "zh": "模拟回调与组件",
      "group": 4,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-mocking-callbacks-and-components",
      "summary": "React 测试的 mocking 深入课。回调测试：CustomButton 的 onClick prop——我们不知道也不需要知道这个函数做什么，只需断言「点了按钮它被调用」：vi.fn() 造 mock，配合 userEvent 点击，三条测试收工（渲染出按钮 / 点击后 toHaveBeenCalled / 不点则 not.toHaveBeenCalled）。官方建议 mock 的 setup 待在测试块内部而非 beforeEach——可读性与状态隔离优先。子组件 mock：组件树大了以后高层组件的测试会被子组件拖浑，用 jest.mock（Vitest 里是 vi.mock）把子组件替换成最小骨架，只渲染验证被测组件所需的最少内容。真实世界案例：通读 TOP 官网自己的 submissions-list.jsx 组件与测试文件（React + RTL 写的生产代码），看 mock 子组件、fake props、describe 分组与 Arrange-Act-Assert 模式在真实代码里的样子。",
      "guide": "以下是官方原课的中文化梳理。本课两条主线：mocking 的手法，与真实世界 React 测试长什么样。**什么是 mocking**：World 3 的测试课已引入过 mock 概念（Battleship 项目可能已经用过），本课放进 React 组件语境。**测试回调处理器**：回调无处不在——每条用户交互路径都有回调，常作为 props 传入去改父组件状态。官方示例 CustomButton 只接一个 onClick prop：我们完全不知道这个函数做什么、会怎么影响应用，**只知道用户点击按钮时它必须被调用**——这正好是 mock 的用武之地。三条测试：① 渲染出文字为 Click me 的按钮（getByRole('button', { name: 'Click me' }) + toBeInTheDocument）；② const onClick = vi.fn() 造 mock 传入，userEvent 点击后 expect(onClick).toHaveBeenCalled()；③ 不点击时 expect(onClick).not.toHaveBeenCalled()。官方两个工程建议：**mock 的 setup 优先待在测试块内部**而不是 beforeEach——每个测试自包含、不用全文件找上下文、review 未来改动更容易、状态泄漏风险更小（除非测试文件特别长、准备代码几十行才考虑 beforeEach）；**userEvent.setup() 在 render 之前调用**，render 与 userEvent 函数不要放在测试外（重复代码用官方文档的自定义 setup 函数收敛）。**mock 子组件**：组件树大了以后测试会变得盘根错节，尤其是树上层的组件——这时 mock 子组件：把子组件替换成只渲染「验证被测组件所需最小内容」的骨架。这不是天天用的手法，但值得知道概念。**真实世界的 React 测试**：TOP 官网（theodinproject.com）项目提交列表组件就是 React 写的、用 RTL 测的——官方带你读两个真实文件：submissions-list.jsx（组件本体：看 props 里的事件处理器函数；渲染逻辑三分支——有 userSubmission 渲染 Submission 组件、hasSubmissions 为真排序后逐个渲染否则渲染「No Submissions yet」标题、allSubmissionsPath 为真渲染一个 p 标签）与 submissions-list.test.jsx（测试文件：两个子组件之一是外部包 react-flip-move——外部代码，mock 掉；Submission 组件用 jest.mock 替换成带 data-test-id 的最小骨架；props 用假数据与 mock 函数；ProjectSubmissionContext.Provider 在这个测试语境里的作用是传递 allSubmissionsPath prop 的通道；三个关注点用 describe 分成三个测试套件保可读性）。官方两个注记：那套测试用 data-test-id 标识 mock 的子组件，但 **RTL 默认用的是 data-testid**（一字之差）；测试里用的是 jest.mock()，你按本课用 Vitest 搭的环境就换 **vi.mock()**（API 文档在资料区）。官方还鼓励随意翻该目录其他组件与测试：会见到 mock 函数、act、自定义 render 函数——不求全懂，混个脸熟。**Arrange-Act-Assert 模式**：几乎所有测试都遵循同一形状——准备（arrange：造数据渲染组件）、执行（act：触发交互）、断言（assert：验证结果），早晚采纳这个模式让测试更可读更好。Assignment 两条：① Medium 的 mocking child components 一文（深入「怎么做」，可能需要注册登录）；② Academind 的 Testing React Apps 教程（本课所学的总览复习——注意该教程的 userEvent API 是同步的旧版，与本站当前异步版不同，用已有知识跟着走即可，工具链照旧 Vite + Vitest）。",
      "understand": [
        "回调测试的思维：不知道也不关心 onClick 做什么——**只断言「点击时它被调用」**，用 vi.fn() 造 mock 函数",
        "三条测试收工一个按钮组件：渲染出按钮 / 点击后 toHaveBeenCalled / 不点则 not.toHaveBeenCalled",
        "mock setup 的工程建议：优先待在**测试块内部**而非 beforeEach——自包含、可读、状态不泄漏；文件特别长准备代码几十行才考虑 beforeEach",
        "userEvent.setup() 在 render 之前调用；render 与 userEvent 函数不放测试外——重复代码用自定义 setup 函数收敛",
        "mock 子组件的动机：组件树大了，高层组件的测试被子组件拖浑——把子组件替换成**只渲染验证所需最小内容**的骨架",
        "真实案例三分支读法：userSubmission 有无 / hasSubmissions 真假 / allSubmissionsPath 真假——读组件渲染逻辑就能列出该测什么",
        "jest.mock → **vi.mock**：Vitest 环境的等价物；RTL 默认 test id 属性是 **data-testid**（案例里用的 data-test-id 是项目自定义）",
        "ProjectSubmissionContext.Provider 在该测试里的角色：传递 allSubmissionsPath prop 的通道",
        "**Arrange-Act-Assert** 模式：准备→执行→断言三段式，几乎所有测试的通用形状",
        "读生产测试的目标是混脸熟：mock 函数、act、自定义 render 会见到的——不求全懂"
      ],
      "terms": [
        {
          "en": "Mocking",
          "zh": "模拟：用受控的假实现替换真实依赖（回调函数、子组件、模块），让测试只聚焦被测对象"
        },
        {
          "en": "vi.fn()",
          "zh": "Vitest 的 mock 函数工厂（对应 Jest 的 jest.fn()）：造一个可断言「是否被调用」的间谍函数"
        },
        {
          "en": "vi.mock()",
          "zh": "Vitest 的模块 mock（对应 jest.mock()）：把整个模块/组件替换成测试用的最小实现"
        },
        {
          "en": "toHaveBeenCalled()",
          "zh": "调用断言匹配器：验证 mock 函数被调用过——not.toHaveBeenCalled() 验证没被调用"
        },
        {
          "en": "data-testid",
          "zh": "RTL 默认的测试标识属性（案例项目用的是自定义 data-test-id，一字之差）——查询方法 getByTestId"
        },
        {
          "en": "Arrange-Act-Assert (AAA)",
          "zh": "测试三段式模式：准备数据与组件 → 执行交互 → 断言结果——可读性与一致性的通用形状"
        }
      ],
      "tasks": [
        "手写官方 CustomButton 三条测试（渲染出按钮 / 点击后 onClick 被调用 / 不点不被调用）：先想清楚每条的 arrange-act-assert 三段各是什么",
        "把三条测试的 mock setup 从 beforeEach 版本改写成测试块内部版本，对比两种写法的可读性——体会官方「setup 待在测试块里」建议的理由",
        "通读资料区的 submissions-list.jsx 与 submissions-list.test.jsx 两个真实文件：先看组件列出三个渲染分支，再对照测试文件的三个 describe 套件——官方明说「不求全懂」",
        "找出测试文件里的 jest.mock 调用，改写成 vi.mock 形态；确认 RTL 默认 data-testid 与案例 data-test-id 的差别",
        "完成官方 Assignment 两条：Medium mocking child components 一文（可能需注册）与 Academind Testing React Apps 教程（注意其 userEvent 是同步旧版，概念照搬、工具链仍用 Vite + Vitest）",
        "给自己的 CV 简历应用或记忆卡片项目补一条回调测试：任意子组件的 onClick prop——vi.fn() + userEvent 点击 + toHaveBeenCalled 三步"
      ],
      "quiz": [
        {
          "question": "测 CustomButton 的 onClick prop 时，为什么用 vi.fn() 而不是传一个真函数？",
          "answer": "我们不知道也不需要知道这个回调真实做什么——它是父组件的事。vi.fn() 造出的 mock 函数自带「是否被调用」的记录能力，测试只需断言点击后 toHaveBeenCalled()。被测边界收在「按钮把点击事件传导给回调」这一件事上。"
        },
        {
          "question": "官方为什么建议 mock 的 setup 待在测试块内部，而不是统一放 beforeEach？",
          "answer": "可读性与隔离：每个测试自包含，review 时不用翻遍全文件找上下文；未来改动更容易审查；状态泄漏拖垮整个套件的风险更小。只有测试文件特别长、准备代码长达几十行时才考虑 beforeEach。"
        },
        {
          "question": "什么时候需要 mock 子组件？mock 成什么样？",
          "answer": "组件树变大后，树上层组件的测试会因为真实子组件的渲染与依赖变得盘根错节——此时把子组件替换成骨架。骨架只渲染「验证被测组件所需的最小内容」（如案例里 Submission 被替换成两个带 data-test-id 的 div），props 用假数据与 mock 函数喂。"
        },
        {
          "question": "案例测试文件用 jest.mock 与 data-test-id，你按本课 Vitest + RTL 环境照做时要改哪两处？",
          "answer": "jest.mock() 换成 vi.mock()（Vitest 等价 API）；data-test-id 是案例项目的自定义属性，RTL 默认认的是 data-testid（一字之差）——用默认约定才能配 getByTestId 查询。"
        },
        {
          "question": "Arrange-Act-Assert 三段在「点击后 onClick 被调用」这条测试里分别对应什么？",
          "answer": "Arrange：const onClick = vi.fn()、userEvent.setup()、render(<CustomButton onClick={onClick} />)、getByRole 拿到按钮；Act：await user.click(button)；Assert：expect(onClick).toHaveBeenCalled()。几乎所有测试都是这个形状——三段分明才可读。"
        }
      ],
      "optional": [],
      "note": "正文指定的两个真实文件（TOP 官网仓库的 submissions-list.jsx 与其测试文件）按官方 pinned commit 地址登记资料区（代码仓库视图）；vi.mock API 文档、ArrangeActAssert 词条、userEvent setup 函数写法锚点（与上一课 userEvent intro 同页合并）各自处置见资料区。Assignment 的 Medium 一文带注册墙、按既有 Medium 双通路口径如实登记；Academind 教程地址实测现役路径后登记。正文的 theodinproject.com 首页与 Battleship 课页为 TOP 自有页面按口径剔除。",
      "why": "这一课把测试从「玩具示例」带进「生产代码」：读 TOP 官网自己的组件与测试，你会发现真实世界的测试并不比课上示例高深——同样的 vi.fn、同样的 describe 分组、同样的 AAA 形状，只是文件更长、上下文更多。mock 的判断力（什么该 mock、mock 到什么粒度）是 React 测试里最值钱的手感：回调 mock 收边界、子组件 mock 保聚焦、外部包 mock 隔离依赖。Shopping Cart 项目要求「用 RTL 充分测试你的应用」——这一课就是那一步的直接准备。",
      "sections": [
        {
          "h": "mocking 是什么：从回调测起",
          "p": [
            "mock 概念在 World 3 测试课已引入（Battleship 项目里可能已经用过）。放进 React 语境，第一站是**回调**：每条用户交互路径都有回调，它们常作为 props 传入、去改父组件的状态。",
            "官方示例 CustomButton 只接一个 onClick prop。关键思维：我们**完全不知道这个函数做什么、会怎么影响应用——只知道用户点击按钮时它必须被调用**。不知道实现，照样能测行为——这就是 mock 的用武之地。"
          ]
        },
        {
          "h": "vi.fn() 三条测试收工",
          "p": [
            "三条测试：① 渲染——render(<CustomButton onClick={() => {}} />) 后 getByRole('button', { name: 'Click me' }) + toBeInTheDocument；② 点击被调用——const onClick = **vi.fn()** 传入，userEvent.setup() 后 await user.click(button)，expect(onClick).**toHaveBeenCalled()**；③ 不点不被调用——同样 vi.fn() 传入但不点击，expect(onClick).**not**.toHaveBeenCalled()。",
            "两个工程建议：**setup 优先待在测试块内部**而不是 beforeEach——自包含、不用全文件找上下文、review 容易、状态泄漏风险小（除非文件特别长、准备代码几十行）；**userEvent.setup() 在 render 之前调**，render 与 userEvent 调用不要放在测试外——重复代码用 RTL 文档的自定义 setup 函数收敛。"
          ]
        },
        {
          "h": "mock 子组件：为什么、怎么 mock",
          "p": [
            "组件树变大后，测试会盘根错节——尤其是树上层的组件：渲染一次要拖起整棵子树。**mock 子组件**就是把子组件替换成只渲染「验证被测组件所需最小内容」的骨架。",
            "官方定位很克制：这不是你天天会碰到的手法，但概念值得知道——需要时（子组件依赖外部服务、渲染昂贵、与测试目标无关）你能想起来用它。"
          ]
        },
        {
          "h": "真实世界案例：TOP 官网的 submissions-list",
          "p": [
            "theodinproject.com 项目页下方的提交列表组件就是 React 写的、用 RTL 测的（现已下线但仍是好教材）。读组件：props 里有一批函数（推测是事件处理器）；渲染逻辑三分支——有 userSubmission 渲染 Submission；hasSubmissions 为真则排序后逐个渲染 Submission，否则渲染「No Submissions yet, be the first!」标题；allSubmissionsPath 为真渲染一个 p 标签。**光读渲染逻辑，就能列出该测什么**。",
            "读测试：两个子组件里 react-flip-move 是外部包——外部代码，mock；Submission 用 jest.mock 替换成两个带 data-test-id 的最小 div；props 喂假数据与 mock 函数；ProjectSubmissionContext.Provider 在此语境里是传递 allSubmissionsPath 的通道；三个关注点用 describe 分三个套件保可读性。",
            "两个注记：案例用 data-test-id，**RTL 默认是 data-testid**；案例用 jest.mock()，Vitest 环境用 **vi.mock()**。官方还鼓励翻该目录其他组件与测试——会见 mock 函数、act、自定义 render 函数，不求全懂，混个脸熟。"
          ]
        },
        {
          "h": "Arrange-Act-Assert：测试的通用形状",
          "p": [
            "几乎所有测试都遵循同一模式：**Arrange**（准备：造数据、渲染组件、拿元素）→ **Act**(执行：触发交互) → **Assert**（断言：验证结果）。",
            "官方的建议是早晚采纳这个模式——三段分明的测试更可读、最终也更好维护。回看本课所有示例：每一条都能切成这三段。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "jsx",
          "code": "// CustomButton.test.jsx —— vi.fn() 测回调（官方三条测试的核心两条）\nimport { vi, describe, it, expect } from 'vitest'\nimport { render, screen } from \"@testing-library/react\";\nimport userEvent from \"@testing-library/user-event\";\nimport CustomButton from \"./CustomButton\";\n\nit(\"should call the onClick function when clicked\", async () => {\n  const onClick = vi.fn();\n  const user = userEvent.setup()\n  render(<CustomButton onClick={onClick} />);\n  const button = screen.getByRole(\"button\", { name: \"Click me\" });\n  await user.click(button);\n  expect(onClick).toHaveBeenCalled();\n});\n\nit(\"should not call the onClick function when it isn't clicked\", () => {\n  const onClick = vi.fn();\n  render(<CustomButton onClick={onClick} />);\n  expect(onClick).not.toHaveBeenCalled();\n});",
          "note": "setup 全部待在测试块内部（官方建议）；userEvent.setup() 在 render 之前。第三条「不点不被调用」是第二条的反面对照——正反都测才叫收工。"
        },
        {
          "lang": "jsx",
          "code": "// 真实案例的 jest.mock（Vitest 里换 vi.mock）：子组件替换成最小骨架\njest.mock('../submission', () => ({ submission, isDashboardView }) => (\n  <>\n    <div data-test-id=\"submission\">{submission.id}</div>\n    <div data-test-id=\"dashboard\">{isDashboardView.toString()}</div>\n  </>\n));",
          "note": "骨架只渲染验证被测组件所需的最小内容。注意案例的 data-test-id 是项目自定义——RTL 默认认 data-testid。"
        }
      ],
      "pitfalls": [
        {
          "title": "setup 全塞 beforeEach",
          "text": "测试不自包含：读一条测试要翻遍文件找 mock 与 render 在哪、状态还可能跨测试泄漏。官方口径：setup 待在测试块里，重复代码用自定义 setup 函数收敛；只有准备代码几十行才考虑 beforeEach。"
        },
        {
          "title": "data-test-id 与 data-testid 混用",
          "text": "RTL 默认属性是 data-testid（getByTestId 认它）；案例项目的 data-test-id 是自定义约定。照抄案例代码到 RTL 环境时这一字之差会让查询全部落空。"
        },
        {
          "title": "mock 粒度失控",
          "text": "mock 的目的是隔离与被测对象无关的依赖（外部包、昂贵子组件）。把被测组件自己的逻辑也 mock 掉，测试就变成「验证 mock 被调用」的空转——测行为，别测实现。"
        }
      ],
      "official": {
        "assignment": [
          "读这篇 mocking child components 文章（Medium，资料区——可能需要注册登录）：它把 mock 子组件的「怎么做」讲得很透",
          "Academind 的 Testing React Apps 教程（资料区）是本课所学的总览复习——注意教程里的 userEvent API 是同步旧版与本站异步版不同，用已有知识跟着走即可，工具链照旧 Vite + Vitest"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/react_testing/mocking_callbacks_and_components.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "13d10ac850070f43ad6436f11a85a1b4fd1de1e2d1cfa1b21d483a2d94362c41",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "node-path-react-new-react-router",
      "title": "React Router",
      "zh": "React Router",
      "group": 5,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-react-router",
      "summary": "客户端路由与 React Router 入门。此前课程都在做单页应用；规模一大就要多页面——浏览器允许客户端 JavaScript 接管导航（History API），React Router 就是把这份能力组件化的标准路由库。核心概念链：客户端路由 = JS 拦截链接请求、不整页刷新（MPA 每点一次链接浏览器重载一次，SPA「永不离开当前页」）；createBrowserRouter(路由配置数组) + RouterProvider 挂载；<Link> 替代 <a> 才能走路由不刷新；嵌套路由 children + <Outlet /> 让子路由渲染进父组件的指定位置，index 路由当默认子页；动态段 path: 'profile/:name' 配 useParams() 取 URL 参数；errorElement 兜底坏地址；路由配置抽进 routes.jsx 独立文件（测试时可换 memory router）；Outlet 自带 context prop 配 useOutletContext() 向 Outlet 渲染的任意深度子组件传数据；受保护路由按登录态条件建配置 + useNavigate() 编程式跳转；测试用 MemoryRouter 轻量包裹或 createMemoryRouter 完整复刻路由行为。",
      "guide": "以下是官方原课的中文化梳理。开场给动机：到目前为止我们建的都是单页应用，但任何上规模的应用都要多页面。浏览器允许客户端 JavaScript 管理用户导航方式（**History API**，MDN 文档在资料区），React Router 这样的包把这份能力封装成路由方案。**客户端路由**是什么：JavaScript 接管应用中路由的处理——建 SPA 而用户导航时不刷新页面：点导航栏元素，URL 变了、视图相应变化，全部发生在客户端。官方给了个煮鸡比喻：普通多页应用（MPA）像用烤箱——每次点链接浏览器整页重载（起身去烤箱）；客户端路由像把微波炉搬到餐桌上——**你永不离开当前页**，链接请求被你写的 JavaScript 拦截，而不是直接发给服务器。但官方也提醒代价：浏览器重载会通知屏幕阅读器有新内容，客户端路由则要**手动通知辅助技术路由更新了**——用成熟的库（React Router）能大体解决这些顾虑。**加路由器**：npm install react-router；官方示例用对象式配置——createBrowserRouter 接收路由对象数组（每项两个必填键：path 与要渲染的 element），生成的配置交给 RouterProvider 组件渲染（住 main.jsx）。四步机制：导入 createBrowserRouter 与 RouterProvider；createBrowserRouter 吃路由数组建配置；配置数组每项是 { path, element }；配置传给 RouterProvider 渲染。**Link 元素**：配置好后点导航链接浏览器却在整页重载——因为普通 <a> 标签走浏览器默认导航。React Router 导出定制的 **Link 组件**替代 a 标签（<Link to='profile'>），点击不再重载。**嵌套路由、Outlet 与动态段**：想让页面的一块区域随不同 URL 渲染不同内容——把路由配置成彼此的 children，子路由与父路由并排渲染；父组件里放 **<Outlet />**，子路径命中时 Outlet 位置被替换成对应子组件。想给父路径配默认子内容——children 里加 { index: true, element: <DefaultProfile /> }。想按 URL 动态渲染——**动态段**：path: 'profile/:name'，冒号后的段匹配任意值（叫 URL params），组件里 useParams() 取出（const { name } = useParams()）。**处理坏地址**：/profile 不带参数时应用报错——给路由配置加 **errorElement** 参数：建一个「Not Found」页组件挂上去，访问未定义路径就渲染错误页。**重构路由**：把路由数组抽到独立的 routes.jsx——main.jsx 导入建 router；更大的红利在测试：测试文件也能导入同一份路由配置，换用测试专用 router（后述）。**Outlet 与状态**：父组件有数据（如 state）想传给 Outlet 渲染的组件——Outlet 自带 **context prop**，任意值（含数组/对象）都能塞；Outlet 内渲染的**任意深度**组件（连「孙组件」都行）用 **useOutletContext()** 取回，传的是数组/对象还能解构。后面「Context API」课会讲不依赖 Outlet 的通用 context 方案。**受保护路由与导航**：常见需求是按登录态决定渲染哪些路由（登录显示用户信息、未登录重定向到登录页）——最简单的做法之一是**按条件构造 router 配置**。编程式改路由用 **useNavigate** hook：跳到指定 URL、甚至沿用户历史后退。**React Router 测试**：应用从不直接渲染这些组件——都是经 router（如 RouterProvider）渲染的；所以测试里渲染用了 Router 功能的组件（useNavigate/useParams/Link）必须**包在路由上下文里**，否则 hook 直接抛错。两档方案：组件只是恰好含个 Link、不测导航——轻量的 **MemoryRouter** 包一层就够；组件依赖真正的路由行为（outlet context、参数匹配、错误元素、重定向）——用 **createMemoryRouter** 在测试里建一个与 routes.jsx 同配置的 router（测试不在浏览器里跑，memory 版正是为此设计），再经 RouterProvider 渲染。官方结语：这些基础足够走完 React 课程；想深入可研究 history 与 match 对象。Assignment 三条：① Ben Holmes 的 SPA 与客户端路由一文（资料区，概念讲得紧凑）；② 给课上应用加几条新路由——本课信息密度大，官方建议花时间把玩新工具，甚至删掉完全重写一遍；③ 浏览 React Router 文档（资料区）——不必全读全懂，把本课讲过的概念翻一遍重读，再看看 React Router 的其他特性，这是值得常回来查的资源。",
      "understand": [
        "**客户端路由** = JavaScript 接管路由处理：点链接 URL 变、视图变，但**不整页刷新**——链接请求被 JS 拦截而非发给服务器",
        "MPA 与 SPA 的体感差（官方煮鸡比喻）：MPA 每次导航浏览器重载（起身去烤箱）；客户端路由「永不离开当前页」（微波炉搬到桌上）",
        "代价要心里有数：浏览器重载会通知屏幕阅读器新内容——客户端路由需**手动通知辅助技术**路由更新，成熟库帮你兜底",
        "挂载三件套：**createBrowserRouter(路由数组)** 建配置 → 配置每项 { path, element } 两键必填 → **RouterProvider** 吃配置渲染（住 main.jsx）",
        "**<Link to> 替代 <a href>**：普通 a 标签走浏览器默认导航整页重载，Link 才走客户端路由",
        "**嵌套路由**：路由互为 children，父组件放 **<Outlet />**——子路径命中时 Outlet 位置被替换成子组件；**{ index: true }** 子路由当默认页",
        "**动态段** path: 'profile/:name' 匹配任意值（URL params），组件里 **useParams()** 取出",
        "**errorElement** 兜底：挂一个错误页组件，坏地址/未定义路径渲染它而不是白屏报错",
        "路由配置抽独立 routes.jsx 的红利在测试：测试文件导入同一份配置换 memory router 用",
        "**Outlet 的 context prop + useOutletContext()**：向 Outlet 渲染的任意深度子组件传数据（数组/对象可解构）——Context API 课之前的局部方案",
        "受保护路由：按登录态**条件构造 router 配置**；编程式跳转用 **useNavigate**（跳 URL、沿历史后退）",
        "测试两档：只含 Link 不测导航 → **MemoryRouter** 轻量包裹；依赖真路由行为 → **createMemoryRouter** 复刻配置——否则 useParams/useNavigate/Link 在测试里直接抛错"
      ],
      "terms": [
        {
          "en": "Client-side routing",
          "zh": "客户端路由：JS 接管导航、不整页刷新——SPA 的路由机制"
        },
        {
          "en": "History API",
          "zh": "浏览器历史 API：客户端 JS 管理导航的底层能力，React Router 建于其上"
        },
        {
          "en": "createBrowserRouter / RouterProvider",
          "zh": "路由创建与挂载：前者吃 { path, element } 配置数组生成 router，后者把 router 渲染进应用"
        },
        {
          "en": "Link",
          "zh": "React Router 的链接组件：替代 a 标签走客户端路由不整页重载"
        },
        {
          "en": "Outlet",
          "zh": "父路由组件里的子路由渲染口：子路径命中时被替换成对应子组件"
        },
        {
          "en": "Dynamic segment / URL params",
          "zh": "动态段：path 里冒号开头的段（:name）匹配任意值——useParams() 读取"
        },
        {
          "en": "errorElement",
          "zh": "路由级错误页：坏地址或未定义路径时渲染的兜底组件"
        },
        {
          "en": "useOutletContext()",
          "zh": "读取 Outlet context prop 传入数据的 hook——Outlet 渲染的任意深度组件可用"
        },
        {
          "en": "useNavigate()",
          "zh": "编程式导航 hook：跳转指定 URL 或沿用户历史前进后退"
        },
        {
          "en": "MemoryRouter / createMemoryRouter",
          "zh": "内存路由：测试专用——URL 不真变，前者声明式轻量包裹、后者吃配置数组复刻真实路由行为"
        }
      ],
      "tasks": [
        "跟官方代码从零搭路由应用：Profile + App 两页 → createBrowserRouter 配置 → RouterProvider 挂载 → 跑 npm run dev 访问 / 与 /profile 验证",
        "把导航栏的 <a href='profile'> 换成 <Link to='profile'>，对比点击后浏览器是否重载——亲眼见证客户端路由的差别",
        "实现嵌套路由三件套：profile 的 children（spinach/popeye）+ Profile 里放 <Outlet /> + index 路由挂 DefaultProfile——手动改 URL 逐个访问验证替换行为",
        "改造为动态段：path: 'profile/:name' + useParams() 条件渲染 Popeye/Spinach/DefaultProfile；再给根路由挂 errorElement 错误页，访问 /profile（无参数）与乱写的路径验证兜底",
        "把路由数组抽进 routes.jsx，main.jsx 导入——体会官方说的测试红利（测试文件可导入同一份配置）",
        "完成官方 Assignment：读 Ben Holmes 的 SPA 与客户端路由一文（资料区）；给应用加几条新路由（官方建议甚至删掉重写一遍）；浏览 React Router 文档（资料区）把本课概念重读一遍、看看其他特性"
      ],
      "quiz": [
        {
          "question": "客户端路由与多页应用（MPA）导航的本质区别是什么？官方用什么比喻？",
          "answer": "MPA 每次点链接浏览器整页重载（官方比喻：每次都要起身去烤箱）；客户端路由由 JS 拦截链接请求、URL 与视图在客户端变化而不刷新页面（微波炉搬到餐桌上——永不离座）。代价：浏览器重载会通知屏幕阅读器新内容，客户端路由要手动通知辅助技术。"
        },
        {
          "question": "配好 createBrowserRouter + RouterProvider 后，点 <a href='profile'> 浏览器却整页重载——为什么？怎么修？",
          "answer": "普通 a 标签走浏览器默认导航行为，绕过了路由。换成 React Router 的 Link 组件：<Link to='profile'>——Link 的点击被 JS 拦截、经 router 切换视图，不触发整页重载。"
        },
        {
          "question": "Outlet、index 路由、动态段各解决什么问题？",
          "answer": "Outlet：父组件里的「渲染口」，子路径命中时被替换成对应子组件（嵌套路由的落点）。index 路由：{ index: true, element } 子项——父路径不带子段时渲染的默认内容。动态段：path 里 :name 匹配该位置的任意值，组件用 useParams() 读取——按 URL 参数动态渲染。"
        },
        {
          "question": "父组件的 state 想传给 Outlet 渲染出来的（可能嵌套很深的）子组件，官方给的路径是什么？",
          "answer": "Outlet 自带 context prop：<Outlet context={数据} />（数组/对象都行），Outlet 内渲染的任意深度组件（含「孙组件」）用 useOutletContext() 取回、可解构。这是 Context API 课之前针对 Outlet 场景的局部方案。"
        },
        {
          "question": "测试一个用了 useParams 的组件，直接 render(<Component />) 会怎样？两档正确做法是什么？",
          "answer": "抛错——应用从不直接渲染这些组件，都是经 router 渲染的；脱离路由上下文时 useParams/useNavigate/Link 无法工作。两档：组件只是恰好含 Link、不测导航行为 → MemoryRouter 轻量包裹；依赖真路由行为（参数匹配、outlet context、错误元素、重定向）→ createMemoryRouter 用 routes.jsx 同款配置建内存 router，经 RouterProvider 渲染。"
        }
      ],
      "optional": [],
      "note": "正文的 History API 链接核验出 MDN 官方中文版（zh-CN「使用历史记录 API」，资料区）；reactrouter.com 的 Link / Outlet / useOutletContext / useNavigate / MemoryRouter / createMemoryRouter 六个 API 页与文档首页（Assignment 指定浏览）均登记资料区，该文档站无官方中文版按 C 类。Ben Holmes 的 SPA 一文为 Assignment 第 1 条。正文的 TOP dashboard 页链接为 TOP 自有页面按口径剔除。官方 Assignment 第 2 条为本地动手（加新路由/重写应用），任务映射不接链。",
      "why": "这一课把「单页玩具」升级成「多页应用」：Memory Card 之后的 Shopping Cart 项目明确要求三个页面（首页/商店/购物车）用导航栏切换——没有路由就没有这个项目。更深一层，客户端路由是现代 Web 应用的形态基础：你以后见到的几乎每个 React 应用都跑在某种 router 上，useParams/Outlet/受保护路由这些概念会一直跟着你。测试一节还与上一章 React 测试衔接：memory router 是「把依赖隔离进测试」思想的又一次落地。",
      "sections": [
        {
          "h": "客户端路由：永不离座",
          "p": [
            "此前课程我们建的都是单页应用；任何上规模的应用都要多页面。浏览器允许客户端 JavaScript 管理用户导航（**History API**），React Router 这样的包把这份能力做成路由方案。",
            "**客户端路由**：JavaScript 接管路由处理——用户导航时页面不刷新。点导航栏元素，URL 变化、视图相应更新，全部发生在客户端。",
            "官方煮鸡比喻：MPA 像用烤箱——每次点链接浏览器整页重载，你得「起身去烤箱」；客户端路由像把微波炉搬到餐桌——**你永不离开当前页**，链接请求被你写的 JS 拦截而不是直接发给服务器。",
            "代价：浏览器重载会通知屏幕阅读器有新内容可读；客户端路由下你要**手动通知屏幕阅读器路由更新了**。好在成熟库能大体解决这类顾虑——React Router 就是 React 应用的标准路由库：指定路由对应渲染哪些 React 组件，以及更多。"
          ]
        },
        {
          "h": "挂载路由器：createBrowserRouter 与 RouterProvider",
          "p": [
            "npm install react-router 后，官方示例走**对象式配置**：main.jsx 里 createBrowserRouter 接收路由对象数组——每项两个必填键 **path** 与该路径渲染的 **element**；生成的配置传给 **RouterProvider** 组件渲染。",
            "四步机制：① 从 react-router 导入 createBrowserRouter 与 RouterProvider；② createBrowserRouter 吃路由数组生成 router 配置；③ 配置数组每项是 { path, element }；④ 配置交给 RouterProvider 渲染。npm run dev 后访问 / 与 /profile 两条路由——都能工作。",
            "但点导航链接浏览器在整页重载：普通 <a> 走浏览器默认导航。React Router 导出定制 **Link 组件**替代 a 标签——<Link to='profile'>Profile page</Link>——点击不再重载。"
          ]
        },
        {
          "h": "嵌套路由、Outlet 与动态段",
          "p": [
            "想让页面的一块区域随 URL 渲染不同内容——**嵌套路由**：路由配置成彼此的 children，子路由与父路由并排渲染；父组件（Profile）里放 **<Outlet />**：访问 /profile/popeye 或 /profile/spinach 时，Outlet 位置被替换成对应子组件。",
            "父路径不带子段时想渲染默认内容——children 里加 **index 路由**：{ index: true, element: <DefaultProfile /> }，访问 /profile 时 Outlet 位置渲染默认组件。",
            "按 URL 动态渲染——**动态段**：path: 'profile/:name'，冒号把后面的段变成匹配任意值的「动态段」（也叫 **URL params**）；组件里 **useParams()** 取出：const { name } = useParams()，然后按 name 条件渲染 Popeye / Spinach / DefaultProfile。",
            "动态段带来新问题：/profile（不带参数）不再命中 index 路由、也没有 name 可显示——应用报错。**errorElement** 兜底：建一个「Oh no, this route doesn't exist!」错误页组件挂到路由配置的 errorElement 上，访问 /profile 或任何未定义路径都渲染错误页。"
          ]
        },
        {
          "h": "重构路由文件",
          "p": [
            "把路由数组抽进独立的 **routes.jsx** 并默认导出；main.jsx 导入它调 createBrowserRouter(routes)。",
            "官方点出重构的真红利在**测试**：测试文件也能导入同一份 routes 配置，用测试专用 router（memory router）替代 browser router——后面「React Router 测试」一节的伏笔。"
          ]
        },
        {
          "h": "Outlet 传数据与受保护路由",
          "p": [
            "父组件有数据（比如 state）想传给 Outlet 渲染的组件——用 **context**：**Outlet 自带 context prop**，任何值都能塞（数组、对象也行）；Outlet 内渲染的**任意**组件（连「孙组件」都算）调 **useOutletContext()** 取回传入值，是数组/对象还能解构。后面 Context API 课讲不依赖 Outlet 的通用方案。",
            "**受保护路由**：常见场景是认证——按用户是否登录决定渲染哪些路由（登录显示用户信息页，未登录重定向到登录页）。最简单的做法之一：**按条件构造 router 配置**。",
            "**编程式导航**：需要代码里主动改 URL 时用 **useNavigate** hook——跳到指定 URL，甚至沿用户历史后退。"
          ]
        },
        {
          "h": "React Router 测试",
          "p": [
            "关键认知：应用**从不直接渲染**这些组件——都是经 router（如 RouterProvider）渲染的。所以测试里渲染用了 Router 功能的组件，必须把它们**渲染进路由上下文**——否则 useNavigate、useParams 或 Link 直接抛错。",
            "两档方案：组件只是**恰好含**个 Link（不测导航、不依赖其他路由特性）——轻量的 **MemoryRouter** 包一层可能就够；组件依赖**真路由行为**（outlet context、参数匹配、错误元素、重定向）——用 **createMemoryRouter** 在测试里建 router：吃 routes.jsx 同款配置，因为测试不在浏览器里跑，memory 版正是为此设计，再像应用一样经 RouterProvider 渲染。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "jsx",
          "code": "// main.jsx —— 对象式配置挂载路由\nimport { StrictMode } from \"react\";\nimport { createRoot } from \"react-dom/client\";\nimport { createBrowserRouter, RouterProvider } from \"react-router\";\nimport routes from \"./routes\"; // 重构后：路由数组住独立文件\n\nconst router = createBrowserRouter(routes);\n\ncreateRoot(document.getElementById(\"root\")).render(\n  <StrictMode>\n    <RouterProvider router={router} />\n  </StrictMode>\n);",
          "note": "routes.jsx 里的配置数组每项 { path, element } 两键必填；抽独立文件的红利在测试可复用同一份配置。"
        },
        {
          "lang": "jsx",
          "code": "// 嵌套路由 + index 默认页 + 动态段 + 错误兜底（官方演进路径的终态配置）\nconst routes = [\n  {\n    path: \"/\",\n    element: <App />,\n    errorElement: <ErrorPage />, // 坏地址/未定义路径渲染它\n  },\n  {\n    path: \"profile/:name\", // 动态段：:name 匹配任意值\n    element: <Profile />,\n  },\n];\n\n// Profile 组件里读参数\nimport { useParams } from \"react-router\";\nconst Profile = () => {\n  const { name } = useParams();\n  return <div>{/* 按 name 条件渲染 Popeye / Spinach / DefaultProfile */}</div>;\n};",
          "note": "嵌套形态则是 children: [{ index: true, element: <DefaultProfile /> }, { path: 'spinach', element: <Spinach /> }] + 父组件里放 <Outlet />。"
        }
      ],
      "pitfalls": [
        {
          "title": "用 <a> 标签做站内导航",
          "text": "a 标签走浏览器默认导航——整页重载，路由形同虚设。站内链接一律 <Link to>；a 标签留给真正的外部地址。"
        },
        {
          "title": "测试里裸渲染依赖路由的组件",
          "text": "useParams/useNavigate/Link 脱离路由上下文直接抛错。按依赖深度选 MemoryRouter（轻量包裹）或 createMemoryRouter（复刻 routes.jsx 配置）——别为了省事跳过路由上下文。"
        },
        {
          "title": "动态段与 index 路由混用时忘了无参路径",
          "text": "path: 'profile/:name' 下访问 /profile 没有参数可取——官方示例里应用直接报错。给路由挂 errorElement 兜底，或设计上明确「无参路径也是坏地址」。"
        }
      ],
      "official": {
        "assignment": [
          "读 Ben Holmes 的 SPAs and client-side routing 一文（资料区）——路由概念讲得紧凑",
          "给课上建的应用加几条新路由：本课信息密度大，花时间把玩新工具；官方建议甚至把它完全删掉、用所学重写一遍",
          "浏览 React Router 文档（资料区）：不必全读全懂——把本课讲过的概念翻一遍重读，再看看 React Router 的其他特性；这是值得常回来查的资源"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/the_react_ecosystem/react_router.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "70bcd099fecf4f69c87601deb0c822043373418157a980c78b43ddcc9b35976f",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "node-path-react-new-fetching-data-in-react",
      "title": "Fetching Data In React",
      "zh": "在 React 中获取数据",
      "group": 5,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-fetching-data-in-react",
      "summary": "React 里取数据的完整形态。基础：组件挂载时取数——fetch 包进 useEffect（空依赖数组只跑一次）、结果存 useState。但网络天生不可靠：错误处理要在 then 里查 response.status >= 400 主动 throw（fetch 本身只在网络故障时 reject，HTTP 4xx/5xx 不算失败）、catch 里 setError 进状态；再加 loading 状态配 finally(() => setLoading(false))——渲染前按序检查 loading → error → 数据。三态（data/loading/error）是每个请求的最低配置。进阶：把取数逻辑抽成自定义 hook（useImageURL）——可复用、可测试；hook 命名规则（use 开头）不是风格问题而是 React 的硬约束。多请求的组织：请求瀑布（waterfall）陷阱——子组件的 fetch 要等父组件条件渲染放行才发出，两个各 1000ms 的请求串成 2000ms+；解法是把请求提升到组件树上层、结果经 props 下发，两个请求并行发出。官方立场：数据获取库（Axios、React Query 等）能帮你，但本课程所有项目强烈建议用原生 React 取数——三态管理的功课无可替代。",
      "guide": "以下是官方原课的中文化梳理。开场定位：此前我们用 React 建的都是纯客户端应用；要做功能完整的 Web 应用就得从外部数据源取数据动态显示。你在此前项目里已经取过数（Weather App），本课是系统化整理——复习不亏。**基础 fetch 回顾**：fetch(url).then(r => r.json()).then(数据 => 用).catch(err => console.error(err))——官方示例从 Picsum API 取图片列表、把第一张的 download_url 塞给 img.src。**在组件里用 fetch**：常见场景是组件挂载时取数显示——**fetch 包进 useEffect**（挂载时执行一次的副作用），URL 状态存 useState，空依赖数组 [] 保证只取一次；渲染侧 imageURL && (...) 短路——数据没到不渲染内容。**处理错误**：网络天生不可靠——API 可能宕机、网络可能断、响应可能带错。官方实验：把 fetch URL 改成一个乱写的地址刷新——页面白屏，用户得不到任何「加载完了」或「出错了」的提示。修法三步：① 组件里加 error 状态（useState(null)）；② **在 then 块里检查 response.status >= 400 就主动 throw new Error**——这是关键认知：**fetch 的 Promise 只在网络故障时 reject，HTTP 4xx/5xx 会正常 resolve**，所以状态码错误必须自己在 then 里抛；③ catch 里 setError(error)，渲染前 if (error) return <p>A network error was encountered</p>。**Loading 状态**：与 error 同型——loading 状态初始 true，请求链尾 **finally(() => setLoading(false))**，渲染前 if (loading) return <p>Loading...</p>。检查顺序：loading → error → 数据。**自定义 hook**：取数逻辑可以整体抽出去——useImageURL() 内部管理 imageURL/error/loading 三态与 useEffect，返回 { imageURL, error, loading }；组件只剩渲染逻辑。为什么必须叫 use 开头：「状态简介」课讲过 hook 命名规则——把 useEffect 放进普通函数 getImageURL 里 React 会不高兴（hook 只能在组件或另一个 hook 的顶层调用），按命名规则改成 useImageURL 就是合法的自定义 hook。红利：别的组件要取图，不用重写取数逻辑——调 useImageURL 即可；可复用、可测试。**管理多个 fetch 请求**：官方警告块先说明：本节示例代码里加了 setTimeout 人为延迟帮助理解，学完请把延迟去掉自己把玩。真实应用常发多个请求，新手常见问题叫**请求瀑布（waterfall of requests）**：官方示例（react-examples 仓库 fetching-data/ 目录）里 Profile 组件取 imageURL、其子组件 Bio 取 bioText——两个请求各自在组件内发。表面看是漂亮的关注点分离，实际代价是性能：**组件在被真正调用（渲染）前不会执行**——JSX 有条件逻辑时，false 分支要等条件变 true 才渲染；Bio 必须等 Profile 里的请求 resolve、条件渲染放行之后才开始渲染——它内部的请求那时才发出。两个各 1000ms 的请求串成 2000ms+。若去掉等 imageURL 的短路条件，Bio 能立即发请求——但 loading 界面就没了。不牺牲设计的解法：**把请求提升（lift up）到组件树上层**，Profile 同时发两个请求，bioText 的结果经 props 传给 Bio——两个请求并行发出：imageURL 先 resolve（Bio 容器先渲染），bioText resolve 后状态更新触发 Bio 重渲染补上文本。**数据获取库**：前端取数只是冰山一角——保持前端数据与服务器同步是难题，「异步状态」管理随功能增加越来越复杂。每个请求至少要 **data / loading / error 三个状态**才有好的用户体验。虽然 Axios、React Query 一类的库能帮忙，官方**强烈建议本课程所有项目用原生 React 取数**——这个过程学到的功课价值无可替代。Assignment 两条：① 读 Modern API data fetching methods（LogRocket 博客，资料区）读到 Axios 一节为止——本课内容的简要总览；② 读 How to fetch data in React with performance in mind（developerway，资料区）——学习在 React 组件里高效处理 fetch 请求。",
      "understand": [
        "组件挂载时取数的标准形：**fetch 包进 useEffect（依赖数组 []）**，URL/数据存 useState，渲染侧短路（data && <JSX/>）",
        "关键认知：**fetch 只在网络故障时 reject——HTTP 4xx/5xx 会正常 resolve**；状态码错误必须在 then 里查 response.status >= 400 主动 throw",
        "错误进状态：catch 里 setError；渲染前 if (error) return 错误提示——白屏无提示是最差体验",
        "**loading 状态**：初始 true、请求链尾 finally(() => setLoading(false))；渲染前检查顺序 loading → error → 数据",
        "**三态（data / loading / error）是每个请求的最低配置**——官方明说任何取数库都绕不开这三样",
        "自定义 hook 抽取取数逻辑：useImageURL() 内管三态返回 { imageURL, error, loading }——可复用可测试",
        "use 前缀不是风格是硬约束：hook 只能在组件或另一 hook 顶层调用——普通函数里放 useEffect 不合法，改名 useXxx 成自定义 hook 才合法",
        "**请求瀑布（waterfall）**：组件在被渲染前不执行——子组件的 fetch 要等父组件条件渲染放行才发出，两个 1000ms 请求串成 2000ms+",
        "瀑布解法：**把请求提升到组件树上层**并行发出，结果经 props 下发——不牺牲 loading 界面也不牺牲性能",
        "官方立场：Axios / React Query 等库能帮忙，但**本课程所有项目强烈建议原生 React 取数**——三态管理的功课无可替代"
      ],
      "terms": [
        {
          "en": "Data fetching in useEffect",
          "zh": "effect 内取数：挂载时执行一次的副作用标准形——空依赖数组 + 状态存结果"
        },
        {
          "en": "response.status check",
          "zh": "状态码检查：fetch 对 4xx/5xx 不 reject——then 里查 status >= 400 主动 throw 才能进 catch"
        },
        {
          "en": "loading / error / data states",
          "zh": "取数三态：每个请求的最低状态配置——加载中、出错、成功数据"
        },
        {
          "en": "Custom hook",
          "zh": "自定义 hook：use 开头的函数，内部可用其他 hook——把取数逻辑抽成可复用单元"
        },
        {
          "en": "Waterfall of requests",
          "zh": "请求瀑布：请求被组件渲染顺序串联、后一个等前一个——多请求组织的经典性能陷阱"
        },
        {
          "en": "Lifting requests up",
          "zh": "请求提升：把多个请求移到组件树上层并行发出、结果经 props 下发——瀑布的标准解法"
        }
      ],
      "tasks": [
        "手写官方 Image 组件三步演进：裸 fetch + useEffect → 加 error 状态与 status >= 400 检查 → 加 loading 状态与 finally——每步跑一遍并把 URL 改乱验证错误提示真的出现",
        "把三态检查顺序写成肌肉记忆：if (loading) → if (error) → 数据渲染；自问为什么 loading 要在 error 前面",
        "把取数逻辑抽成 useImageURL 自定义 hook：三态在 hook 内部管理、组件只解构 { imageURL, error, loading }——体会「别的组件要取图直接调 hook」的复用感",
        "克隆 react-examples 仓库进 fetching-data/ 目录跑官方瀑布示例：先观察 Bio 慢一秒的现象，再按官方说明注释/反注释两个版本对比——亲眼看到请求提升前后总耗时的差别（学完记得去掉人为延迟把玩）",
        "用自己的话解释瀑布成因链条：组件在被渲染前不执行 → 条件渲染 false 分支不渲染 → Bio 的请求等 Profile 的数据 → 串联",
        "完成官方 Assignment 两条：LogRocket 的 Modern API data fetching methods 读到 Axios 节为止（资料区）；developerway 的 How to fetch data in React with performance in mind（资料区）"
      ],
      "quiz": [
        {
          "question": "fetch('https://坏地址') 返回 HTTP 404——catch 会执行吗？为什么？正确处理方式是什么？",
          "answer": "不会。fetch 的 Promise 只在网络故障（断网、DNS 失败等）时 reject；HTTP 4xx/5xx 会正常 resolve——「请求成功送达并拿到了响应」。正确方式：在 then 里检查 response.status >= 400 就主动 throw new Error，让它流进 catch，再 setError 进状态、渲染错误提示。"
        },
        {
          "question": "取数组件渲染前的三态检查顺序是什么？各自返回什么？",
          "answer": "if (loading) return 加载提示 → if (error) return 错误提示 → 数据渲染。loading 初始 true、finally 里置 false；error 初始 null、catch 里 setError。官方口径：data/loading/error 三态是每个请求达成良好用户体验的最低配置。"
        },
        {
          "question": "为什么取数逻辑要抽成 use 开头的自定义 hook，而不是普通函数 getImageURL？",
          "answer": "hook（useEffect/useState）只能在组件或另一个 hook 的顶层调用——放进普通函数不合法，React 会报错。按命名规则改成 useImageURL 就是合法的自定义 hook：内部三态自管、返回 { imageURL, error, loading }，任何组件可复用、可独立测试。"
        },
        {
          "question": "请求瀑布是怎么形成的？官方示例里两个各 1000ms 的请求为什么串成 2000ms+？",
          "answer": "组件在被真正调用（渲染）前不执行：Profile 的 JSX 里 imageURL && <Bio /> 短路——Bio 要等 Profile 的请求 resolve、条件变 true 才开始渲染，它内部的 fetch 那时才发出。两个请求被渲染顺序串联。"
        },
        {
          "question": "不牺牲 loading 界面的瀑布解法是什么？为什么不直接删掉短路条件？",
          "answer": "把请求提升到组件树上层：Profile 同时发两个请求，bioText 结果经 props 传给 Bio——并行发出，imageURL 先到先渲染、bioText 到了触发 Bio 重渲染。直接删短路条件确实能让 Bio 立即发请求，但 loading 界面就没了——官方不拿设计换性能。"
        }
      ],
      "optional": [],
      "note": "Assignment 两条文章（LogRocket 与 developerway）均登记资料区，无官方中文版按 C 类。正文示例的 react-examples 仓库链接为跨课合并条目（归属「状态简介」课）不重复登记；Picsum API 只出现在代码块的 fetch URL 字符串里、非正文链接，按口径不登记；「状态简介」课页回链为 TOP 自有课页剔除。官方人为延迟警告（学完去掉 setTimeout 把玩）已转达进任务文案。",
      "why": "这一课把 Weather App 项目里你摸索过的取数经验整理成工程形态：三态是骨架、status 检查是防线、自定义 hook 是复用单元、请求提升是性能功课。Shopping Cart 项目要求从 FakeStore API 取商品数据——三态与瀑布的每一步都会真实发生。更深一层：官方坚持原生取数是有教学立场的——React Query 们替你管的正是这三态，不亲手管过一遍，你不会真正理解那些库在解决什么。",
      "sections": [
        {
          "h": "基础形：useEffect 里 fetch",
          "p": [
            "先复习裸 fetch：fetch(url).then(r => r.json()).then(数据 => 用).catch(err => console.error(err))——官方示例从 Picsum API 取图片列表，把第一张的 download_url 塞给 img.src。",
            "搬进组件：常见场景是**组件挂载时取数显示**——fetch 包进 **useEffect**（挂载时执行一次的副作用），结果存 useState，**空依赖数组 []** 保证只取一次。渲染侧 imageURL && (...) 短路：数据没到不渲染内容。"
          ]
        },
        {
          "h": "错误处理：status 检查与 error 状态",
          "p": [
            "网络天生不可靠：API 可能宕机、网络可能断、响应可能带错。官方实验：把 fetch URL 改成乱写的地址刷新——**页面白屏**，用户得不到任何「加载完成」或「出错了」的提示。",
            "修法三步：① 加 error 状态；② **then 块里查 response.status >= 400 主动 throw new Error('server error')**——关键认知：fetch 的 Promise 只在网络故障时 reject，HTTP 4xx/5xx 会正常 resolve，状态码错误必须自己抛；③ catch 里 setError(error)。",
            "渲染前检查：if (error) return <p>A network error was encountered</p>——坏 URL 或意外响应时页面把情况告诉用户，而不是白屏。"
          ]
        },
        {
          "h": "loading 状态与三态检查序",
          "p": [
            "与 error 同型：loading 状态初始 true，请求链尾挂 **finally(() => setLoading(false))**——无论成败都会执行。",
            "渲染前的检查顺序固定：**if (loading) return 加载提示 → if (error) return 错误提示 → 数据渲染**。data / loading / error 三态自此成为你每个取数组件的标配。"
          ]
        },
        {
          "h": "自定义 hook：useImageURL",
          "p": [
            "取数逻辑可以整体抽出去：**useImageURL()** 内部管理三态与 useEffect，返回 { imageURL, error, loading }；组件只剩渲染逻辑——别的组件要取图，调 hook 即可，可复用、可测试。",
            "为什么必须 use 开头：「状态简介」课讲过 hook 命名规则——把 useEffect 放进普通函数 getImageURL 里 React 不会答应（hook 只能在组件或另一个 hook 顶层调用）；按命名规则改成 useImageURL，它就是合法的自定义 hook。"
          ]
        },
        {
          "h": "请求瀑布与请求提升",
          "p": [
            "官方警告块：本节示例加了 setTimeout 人为延迟帮助理解——学完请去掉延迟自己把玩代码。",
            "**请求瀑布**：真实应用常发多个请求。官方示例（react-examples 仓库 fetching-data/ 目录）：Profile 取 imageURL、子组件 Bio 取 bioText，各自在组件内发请求——表面是漂亮的关注点分离，实际代价是性能：**组件在被真正渲染前不执行**，JSX 条件逻辑的 false 分支要等条件变 true 才渲染——Bio 得等 Profile 的请求 resolve 放行后才开始渲染，它的请求那时才发出。两个各 1000ms 的请求串成 2000ms+。",
            "去掉短路条件能让 Bio 立即发请求——但 loading 界面就没了。不牺牲设计的解法：**把请求提升到组件树上层**：Profile 并行发两个请求，bioText 结果经 props 传给 Bio。imageURL 先 resolve、Bio 容器先渲染；bioText resolve 后状态更新触发 Bio 重渲染补上文本。"
          ]
        },
        {
          "h": "数据获取库与官方立场",
          "p": [
            "前端取数只是冰山一角：保持前端数据与服务器同步是难题，「异步状态」管理随功能增加越来越复杂。每个请求至少 **data / loading / error 三个状态**才有好的用户体验。",
            "官方立场：虽然 Axios、React Query 一类的库能帮忙，**本课程所有项目强烈建议用原生 React 取数**——这个过程学到的功课价值无可替代。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "jsx",
          "code": "// 三态完整形（官方终版 Image 组件）\nconst Image = () => {\n  const [imageURL, setImageURL] = useState(null);\n  const [error, setError] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    fetch(\"https://picsum.photos/v2/list\")\n      .then((response) => {\n        if (response.status >= 400) {\n          throw new Error(\"server error\"); // fetch 对 4xx/5xx 不 reject——自己抛\n        }\n        return response.json();\n      })\n      .then((response) => setImageURL(response[0].download_url))\n      .catch((error) => setError(error))\n      .finally(() => setLoading(false));\n  }, []);\n\n  if (loading) return <p>Loading...</p>;\n  if (error) return <p>A network error was encountered</p>;\n\n  return (\n    <>\n      <h1>An image</h1>\n      <img src={imageURL} alt={\"placeholder text\"} />\n    </>\n  );\n};",
          "note": "三态检查顺序：loading → error → 数据。status 检查住在 then 里——这是 fetch 与直觉最不同的地方。"
        },
        {
          "lang": "jsx",
          "code": "// 自定义 hook 抽取：组件只剩渲染\nconst useImageURL = () => {\n  const [imageURL, setImageURL] = useState(null);\n  const [error, setError] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    fetch(\"https://picsum.photos/v2/list\")\n      .then((response) => {\n        if (response.status >= 400) throw new Error(\"server error\");\n        return response.json();\n      })\n      .then((response) => setImageURL(response[0].download_url))\n      .catch((error) => setError(error))\n      .finally(() => setLoading(false));\n  }, []);\n\n  return { imageURL, error, loading };\n};\n\nconst Image = () => {\n  const { imageURL, error, loading } = useImageURL();\n  if (loading) return <p>Loading...</p>;\n  if (error) return <p>A network error was encountered</p>;\n  return <><h1>An image</h1><img src={imageURL} alt={\"placeholder text\"} /></>;\n};",
          "note": "use 前缀是硬约束不是风格：hook 只能在组件或另一 hook 顶层调用。复用与可测试性是抽 hook 的两大红利。"
        }
      ],
      "pitfalls": [
        {
          "title": "以为 fetch 会对 404/500 reject",
          "text": "fetch 只在网络故障时 reject——HTTP 错误码会正常 resolve。不在 then 里查 response.status >= 400 主动 throw，错误就静默溜进成功分支，用户看到的是坏数据或白屏。"
        },
        {
          "title": "请求瀑布不自知",
          "text": "「每个组件自己取自己的数」听着干净，实际把请求串成了链：子组件等父组件条件渲染放行才发请求。多请求场景先画渲染时序，再决定谁在哪层发请求。"
        },
        {
          "title": "拿 loading 界面换性能",
          "text": "删掉短路条件确实让子组件请求立即发出——但用户失去了加载反馈。正解是请求提升：上层并行发、props 下发结果，两者兼得。"
        }
      ],
      "official": {
        "assignment": [
          "读 Modern API data fetching methods（LogRocket，资料区）读到 Axios 一节为止——本课讨论内容的简要总览",
          "读 How to fetch data in React with performance in mind（developerway，资料区）——学习在 React 组件里高效处理 fetch 请求"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/the_react_ecosystem/fetching_data_in_react.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "51dfe52c2bdcce31ba8e2edd4f9d65b1bf431eb97764c45a64ba0d289fd1ab24",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "node-path-react-new-styling-react-applications",
      "title": "Styling React Applications",
      "zh": "为 React 应用添加样式",
      "group": 5,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-styling-react-applications",
      "summary": "React 应用样式方案全景（短课）。核心问题：普通 CSS 是全局作用域——应用越大类名冲突与样式管理越难。四族方案：① CSS Modules——局部作用域的 CSS 声明，类名不再担心与全局冲突；② CSS-in-JS——用 JavaScript 全权掌控 CSS 并按状态等逻辑施加样式，React 生态最流行的方案之一是 styled-components；③ CSS 工具类框架——预定义类直接进 JSX，Tailwind CSS 是当下最流行的选择；④ 组件库——样式、行为、可访问性全包，Material UI / Radix / Chakra UI 是代表，图标组件库如 lucide react 也属此类。官方警告块立场鲜明：本课程学习期间强烈建议避开 CSS 框架与组件库（图标组件库可以用），用 CSS Modules 从零实现组件样式——先学会走再借轮椅。",
      "guide": "以下是官方原课的中文化梳理。开场定位：前面课程学的 CSS 技能在 React 里全部照常适用——但有两件事要点名。你已经注意到：我们写的样式都共享**全局作用域**，应用一大，CSS 管理越来越难——下面这些工具就是人们为解决这个问题用的。**CSS Modules**：普通 CSS 是最简单的样式方式；CSS Modules 让你写**局部作用域**的样式声明——终于不用再担心类名与全局作用域里的其他类冲突。**CSS in JS**：官方开了个玩笑（「能写在 JavaScript 里为什么还要写 CSS？开玩笑的！」）再正经定义：CSS-in-JS 是前端样式范式——用 JavaScript 完全掌控 CSS 并扩展各种特性；还能按逻辑（比如状态）施加样式、支持与 CSS Modules 同样的模块化。React 生态最流行的方案之一是 **styled-components**。**CSS 工具类框架**：给 React 应用加样式的热门选择——提供一组预定义类直接用在 HTML（或 JSX）里；**Tailwind CSS** 是当下最流行的选择。**组件库**：「要是全都替你做好了呢？」——样式、行为、可访问性全包。组件库提供可直接用于项目的可适配可复用组件：下拉、抽屉、日历、开关、标签页……你能想到的都有。谈组件库绕不开三个名字：**Material UI（MUI）、Radix、Chakra UI**。图标组件库也属此族：**lucide react** 让你以组件形式引入图标。**官方警告块（立场鲜明）**：出于学习目的，本课程全程**强烈建议避开 CSS 框架与组件库**（图标组件库可以用），改用 **CSS Modules 从零实现组件样式**。Assignment 三条：① 读 CSS Modules 文档（GitHub）与 How to style React components using CSS Modules（MakeUseOf）；② 读 CSS vs CSS-in-JS（LogRocket）与 A Thorough Analysis of CSS-in-JS（CSS-Tricks）；③ 略读 styled-components 文档（资料区均有）。",
      "understand": [
        "核心问题：普通 CSS 是**全局作用域**——应用越大，类名冲突与样式管理越难；四族方案都是围绕这个问题",
        "**CSS Modules**：局部作用域的样式声明——类名不再与全局冲突；官方课程内推荐方案",
        "**CSS-in-JS**：用 JavaScript 全权掌控 CSS——可按状态等逻辑施加样式、支持模块化；React 生态代表是 styled-components",
        "**CSS 工具类框架**：预定义类直接进 JSX——Tailwind CSS 是当下最流行",
        "**组件库**：样式、行为、可访问性全包的可复用组件集——代表 MUI / Radix / Chakra UI；图标组件库 lucide react 同族",
        "官方学习立场：**课程期间避开 CSS 框架与组件库**（图标组件库例外可用），用 CSS Modules 从零写样式"
      ],
      "terms": [
        {
          "en": "CSS Modules",
          "zh": "CSS 模块：局部作用域的 CSS 文件——类名编译期加哈希，天然防全局冲突"
        },
        {
          "en": "CSS-in-JS",
          "zh": "JS 内写 CSS 的范式：样式与组件逻辑同文件、可按状态施加——代表 styled-components"
        },
        {
          "en": "Utility framework",
          "zh": "工具类框架：预定义原子类直接组合进标记——代表 Tailwind CSS"
        },
        {
          "en": "Component library",
          "zh": "组件库：样式/行为/可访问性预制的可复用组件集——代表 MUI、Radix、Chakra UI"
        }
      ],
      "tasks": [
        "把四族方案做成一张选型卡：每族一行——解决的问题、代表工具、什么时候选它；再写上官方课程立场（学习期用 CSS Modules）",
        "完成官方 Assignment 第 1 条：读 CSS Modules 的 GitHub 文档与 MakeUseOf 教程（资料区），在自己的 Vite 项目里给一个组件换上 .module.css 体会局部作用域",
        "完成官方 Assignment 第 2 条：读 LogRocket 的 CSS vs CSS-in-JS 与 CSS-Tricks 的 CSS-in-JS 深度分析（资料区）——重点抓两文的取舍论据",
        "完成官方 Assignment 第 3 条：略读 styled-components 文档（资料区）——只要求 skim，认出它的 API 形状即可",
        "给 Shopping Cart 项目定样式方案：按官方立场用 CSS Modules 从零写——把这条决定写进项目笔记"
      ],
      "quiz": [
        {
          "question": "React 应用样式管理难在哪？四族方案分别怎么应对？",
          "answer": "难点：普通 CSS 全局作用域——应用越大类名冲突与样式组织越难。CSS Modules 给样式声明局部作用域；CSS-in-JS 把样式搬进 JS 按逻辑施加；工具类框架用预定义类避开自定义类名；组件库直接用预制好的带样式组件。"
        },
        {
          "question": "官方对本课程学习期间的样式方案立场是什么？唯一的例外是什么？",
          "answer": "强烈建议避开 CSS 框架与组件库、用 CSS Modules 从零实现组件样式——先把基本功练扎实。唯一例外：图标组件库（如 lucide react）可以用。"
        },
        {
          "question": "CSS-in-JS 相比 CSS Modules 多出的能力是什么？React 生态的代表方案是？",
          "answer": "用 JavaScript 全权掌控 CSS：能按逻辑（比如组件状态）施加样式、扩展各种特性——模块化能力两者相当。React 生态最流行的代表是 styled-components。"
        },
        {
          "question": "组件库「替你做好了」的三样东西是什么？三个代表库是？",
          "answer": "样式、行为、可访问性——组件库里都是可直接用于项目的可适配可复用组件（下拉、抽屉、日历、开关、标签页等）。代表：Material UI（MUI）、Radix、Chakra UI；图标组件库 lucide react 同族。"
        }
      ],
      "optional": [],
      "note": "正文与 Assignment 的全部工具与文档链接登记资料区：styled-components（正文与 Assignment 第 3 条双现合并一条）、Tailwind、MUI、Radix、Chakra UI、lucide react（301 到现役 /guide/react 路径）、CSS Modules GitHub 文档、MakeUseOf 教程、LogRocket 与 CSS-Tricks 两篇对比文。lucide 链接实测 301 迁移事实记入条目。无官方中文版全部按 C 类。",
      "why": "这是一课「地图」而非「深潜」：四族方案你以后每个 React 项目都会再遇到，先认识地形能避免选型时抓瞎。官方立场值得体会——不是否定 Tailwind 或 MUI，而是学习期从零写样式才能把 CSS 基本功与 React 组件思维焊在一起；Shopping Cart 项目就按这个立场走 CSS Modules。",
      "sections": [
        {
          "h": "问题：全局作用域的 CSS",
          "p": [
            "前面课程的 CSS 技能在 React 里全部照常适用——但有两件事要点名。你可能已经注意到：我们写的样式都共享**全局作用域**——应用越长越大，CSS 管理越来越难。",
            "下面这些工具就是人们为解决这个问题在用的。"
          ]
        },
        {
          "h": "四族方案",
          "p": [
            "**CSS Modules**：普通 CSS 是最简单的样式方式；CSS Modules 让你写**局部作用域**的样式声明——终于不用再担心类名与全局的其他类潜在冲突。",
            "**CSS in JS**：（官方玩笑：「能写在 JavaScript 里为什么还要写 CSS？开玩笑的！」）CSS-in-JS 是前端样式范式：用 JavaScript 完全掌控 CSS 并扩展特性；还能按逻辑（如状态）施加样式、支持与 CSS Modules 同样的模块化。React 生态最流行方案之一：**styled-components**。",
            "**CSS 工具类框架**：预定义类直接用在 HTML/JSX 里的热门选择——**Tailwind CSS** 是当下最流行的选择。",
            "**组件库**：「要是全都替你做好了呢？」样式、行为、可访问性全包——可直接用于项目的可适配可复用组件：下拉、抽屉、日历、开关、标签页……代表：**Material UI、Radix、Chakra UI**；图标组件库 **lucide react** 让你以组件形式引入图标。"
          ]
        },
        {
          "h": "官方警告块：课程内的推荐方案",
          "p": [
            "官方立场鲜明（lesson-note--warning）：出于学习目的，本课程全程**强烈建议避开 CSS 框架与组件库**（用图标组件库没问题），改用 **CSS Modules 从零实现组件的样式**。",
            "先学会走再借轮椅——Shopping Cart 项目的样式就按这个立场办。"
          ]
        },
        {
          "h": "Assignment 阅读清单",
          "p": [
            "① CSS Modules 文档（GitHub）+ How to style React components using CSS Modules（MakeUseOf）；② CSS vs CSS-in-JS（LogRocket）+ A Thorough Analysis of CSS-in-JS（CSS-Tricks）；③ 略读 styled-components 文档——全部在资料区，逐条可直达。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "css",
          "code": "/* Button.module.css —— CSS Modules 的局部作用域形态（示意） */\n.button {\n  padding: 0.5rem 1rem;\n  border-radius: 0.375rem;\n}\n.primary {\n  background: var(--color-accent);\n}",
          "note": "import styles from './Button.module.css' 后 className={styles.button}——类名编译期局部化，不再与全局冲突。官方课程内推荐方案。"
        }
      ],
      "pitfalls": [
        {
          "title": "学习期就上组件库",
          "text": "MUI/Chakra 帮你把样式、行为、可访问性全包了——也包掉了你练基本功的机会。官方立场：课程期间用 CSS Modules 从零写（图标组件库例外）。"
        },
        {
          "title": "把四族方案当互斥单选题",
          "text": "真实项目常混用：CSS Modules 打底 + 图标组件库补图标 + 个别复杂交互组件引 Radix。选型看场景，不站队。"
        }
      ],
      "official": {
        "assignment": [
          "读 CSS Modules 文档（GitHub）与 How to style React components using CSS Modules（MakeUseOf）（均在资料区）",
          "读 CSS vs CSS-in-JS（LogRocket）与 A Thorough Analysis of CSS-in-JS（CSS-Tricks）（均在资料区）",
          "略读 styled-components 文档（资料区）"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/the_react_ecosystem/styling_react_applications.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "c69f0b5d5bad3e1815180d36b1ed036c24310970dd8380f65480a99b8613c282",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "node-path-react-new-shopping-cart",
      "title": "Project: Shopping Cart",
      "zh": "项目：购物车",
      "group": 5,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-shopping-cart",
      "summary": "React 生态章的动手项目：一个模拟购物车应用，把路由与测试两大新装备真刀真枪用起来。三个页面（首页 / 商店页 / 购物车页）经导航栏切换（导航栏全页显示）；商店页每个商品一张卡片：手动输入数量的输入框 + 增减按钮微调 + 标题 + Add To Cart；购物车有货时导航栏的购物车链接要实时显示件数；购物车页展示商品与数量、可增减可移除（不做结算/支付系统）；商品数据从 FakeStore API（或同类）获取；用 React Testing Library 充分测试——但别测 react-router 本身（外部库自有其作者测试）；样式自由发挥（按官方课程立场推荐 CSS Modules）；最后部署——SPA 路由需要平台侧配置：Netlify 加 public/_redirects（/* /index.html 200）、Vercel 加 vercel.json rewrites、Cloudflare Pages 默认行为即可无需额外步骤。",
      "guide": "以下是官方原课的中文化梳理（项目课：本站提供要求中文版、拆解与验收清单，不提供成品代码）。官方开场：你已经远离 React 婴儿期——路由和测试框架都已在手，但路还长；现在正是把这些概念用起来的绝佳时机，做一个经典项目：**模拟购物车**。**官方要求（Assignment 十一条，逐条中文化）**：① 新建一个 React 项目；② 想清楚组件与文件夹结构——应用怎么搭？需要哪些组件与功能？好主意是把这些记在一个方便随时查看的地方、边做边补；③ 应有**三个页面**：首页（home）、商店页（shop）、购物车页（cart）——让用户经**导航栏**在页面间切换，导航栏在所有页面显示；④ 首页随意发挥：放几张图或一些信息完全够了，不必花哨——它的作用是检验目前所学概念；⑤ 商店页为每个商品建独立**卡片**：卡上有**输入框**让用户手动输入购买数量、旁边配**加/减按钮**微调；再显示商品标题与 **Add To Cart** 按钮；⑥ 购物车里有商品时，导航栏的购物车链接要**显示件数**——用户增删商品时**实时更新**；⑦ 购物车页展示商品与数量、允许**增减数量**（合适时含移除）——**不需要**实现结算/支付系统；⑧ 商品数据从 **FakeStore API**（或同类）获取；⑨ 用 **React Testing Library 充分测试**你的应用——注意**别直接测 react-router**：它是外部库，其作者必然已经测过；⑩ 照常把样式做好、能拿得出手展示——你已经有一堆样式方案可选（官方课程立场：CSS Modules）；⑪ 最后**部署**——按所用托管平台，SPA 的路由可能需要额外配置：**Netlify** 在 public/ 目录加 _redirects 文件、内容 /* /index.html 200（把所有路由重定向到 index 页、剩下交给 react-router；详见 Netlify redirects 文档，资料区）；**Vercel** 在项目根加 vercel.json：{ \"rewrites\": [{ \"source\": \"/(.*)\", \"destination\": \"/index.html\" }] }（同理重定向到 index；详见 Vercel 的 SPA 与 Vite 文档，资料区）；**Cloudflare Pages** 写作时点无需额外步骤——默认行为就能让 react-router 正确处理 SPA 重定向（详见 CF serving pages 文档，资料区）。**本站拆解（不含成品代码）**：结构先行——第②条是官方要求你写在纸上的：三页面 + 导航栏意味着 router 配置至少 4 条路由（/、/shop、/cart，导航栏组件住在布局层）；商品卡片是列表渲染（key 纪律）+ 本地数量状态；「导航栏实时件数」是全项目最有意思的状态设计题：件数必须住在**同时高于**导航栏与商店/购物车页的组件里（App 层），增删事件从卡片与购物车页**提升**上去——这正是「组件间共享状态」与「请求提升」两课的直接应用；也可以试 Context API 提前热身下一章。数据侧：FakeStore API 无 key 直取（fetch https://fakestoreapi.com/products），三态（loading/error/data）骨架照「在 React 中获取数据」课搭。测试侧：官方点名 RTL——商店卡片「Add To Cart 点击后导航栏件数 +1」就是一条完美的 Arrange-Act-Assert；mock 的是 fetch（vi.fn 或 vi.mock）而不是 react-router（官方明令别测外部库）；带路由的组件测试按「React Router」课的两档方案包 memory router。部署侧：SPA 的深链接问题（直接访问 /cart 会 404）就是第⑪条配置存在的原因——三平台配置文件都极短，抄官方给的形状即可。**验收清单**：三页面经导航栏切换、URL 与视图同步不整页刷新；商店页卡片有数量输入框 + 加减按钮 + 标题 + Add To Cart；导航栏购物车件数实时随增删更新；购物车页可增减可移除、无结算；商品来自 FakeStore API（含 loading 与 error 处理更佳）；RTL 测试覆盖核心交互（加购→件数变化、购物车增减）且不测 react-router；样式完整可展示；部署上线且直接访问 /cart 深链接不 404。",
      "understand": [
        "项目定位：把**路由**（三页面导航）与**测试**（RTL 充分测试）两大新装备用进一个经典应用",
        "三页面 + 全页导航栏：首页（随意发挥）/ 商店页（商品卡片）/ 购物车页（增减移除）",
        "商品卡片五要素：数量输入框 + 加/减按钮 + 标题 + Add To Cart 按钮",
        "**导航栏实时件数**是全项目核心状态设计题：件数状态必须住在导航栏与页面内容的共同祖先（App 层）——状态提升的直接应用",
        "数据从 FakeStore API（或同类）取——三态骨架（loading/error/data）照取数课搭",
        "测试纪律：RTL 充分测**自己的**应用；**别直接测 react-router**（外部库其作者已测）；fetch 要 mock",
        "带路由的组件测试包 memory router（MemoryRouter 或 createMemoryRouter 两档方案）",
        "部署的 SPA 配置：Netlify 加 public/_redirects（/* /index.html 200）/ Vercel 加 vercel.json rewrites / Cloudflare Pages 默认即可——都是为了解决深链接直达 404",
        "官方第②条要求把组件与文件夹结构**写在纸上**并边做边补——结构先行是官方工作流",
        "样式按课程立场：CSS Modules 从零写（图标组件库可用）"
      ],
      "terms": [
        {
          "en": "FakeStore API",
          "zh": "免费假商店 API：无 key 直取商品数据——本项目的数据源（或同类 API）"
        },
        {
          "en": "SPA deep linking",
          "zh": "SPA 深链接：直接访问 /cart 一类客户端路由时服务器并不认识该路径——需平台重定向配置兜底"
        },
        {
          "en": "_redirects / vercel.json rewrites",
          "zh": "平台侧重定向配置：把所有路径重写到 index.html、交给 react-router 处理——Netlify 与 Vercel 的 SPA 部署形状"
        }
      ],
      "tasks": [
        "官方第①②条：新建 React 项目；把组件与文件夹结构写在纸上（三页面、导航栏、商品卡片、购物车项、App 层状态）——官方明说记在方便随时查看的地方、边做边补",
        "搭路由骨架：/、/shop、/cart 三条路由 + 导航栏布局（全页显示）——按「React Router」课的对象式配置与 Link 组件",
        "接 FakeStore API：三态骨架取商品列表，商店页渲染商品卡片（key 纪律）：标题 + 数量输入框 + 加减按钮 + Add To Cart",
        "攻克件数状态设计：cartItems 住 App 层，addToCart 从卡片提升、增减移除从购物车页提升——导航栏件数实时渲染（cartItems 总数）",
        "购物车页：展示商品与数量、可增减、可移除——不做结算/支付",
        "写 RTL 测试：核心交互至少两条（点 Add To Cart 后导航栏件数 +1；购物车页增减改数量）——mock fetch、包 memory router、不测 react-router 本身",
        "样式（CSS Modules 从零）+ 部署：按平台加 _redirects / vercel.json（Cloudflare Pages 免配置）——部署后直接访问 /cart 验证深链接不 404",
        "对照本站验收清单逐项打勾后，把项目地址记进学习档案"
      ],
      "quiz": [
        {
          "question": "「导航栏实时显示购物车件数」为什么是全项目的状态设计核心？件数状态该住哪？",
          "answer": "导航栏在所有页面显示、而增删发生在商店页卡片与购物车页——件数的消费者与生产者分散在不同子树。状态必须住在它们的共同祖先（App 层）：cartItems 在顶层，addToCart/增减函数提升上去、经 props（或 Context）下发——「组件间共享状态」课的直接应用。"
        },
        {
          "question": "官方为什么明令「别直接测 react-router」？那路由相关的组件怎么测？",
          "answer": "react-router 是外部库，其作者已经测过——重复测外部库是浪费且脆。要测的是自己的组件在路由上下文里的行为：按两档方案包 MemoryRouter（轻量）或 createMemoryRouter（复刻配置），fetch 用 mock 隔离。"
        },
        {
          "question": "部署后用户直接访问 https://你的站/cart 得到 404——为什么？三平台各怎么解决？",
          "answer": "/cart 是客户端路由，服务器上并不存在该路径——深链接直达时服务器 404。Netlify：public/_redirects 加一行 /* /index.html 200；Vercel：根目录 vercel.json 配 rewrites 把 /(.*) 重写到 /index.html；Cloudflare Pages：默认行为已正确处理、无需配置。都是让一切路径回到 index.html、交给 react-router。"
        },
        {
          "question": "商品卡片上官方要求哪五个元素？数量控制的两种输入方式是什么？",
          "answer": "标题、商品图（数据源自带）、数量输入框（手动键入）、加/减按钮（微调）、Add To Cart 按钮。两种输入：输入框直接键入任意数量；加减按钮逐步微调——官方原文：input field 手动输入 + increment/decrement 按钮 fine-tuning。"
        }
      ],
      "optional": [],
      "note": "Project 红线课：examples 为空数组、本站不提供成品代码——正文只有官方要求中文版、拆解思路与验收清单。Assignment 第 8 条数据源 FakeStore API 与第 11 条三平台部署文档（Netlify redirects / Vercel SPA+Vite / CF serving pages——三链接实测均已 301 到现役路径，登记按现役地址）登记资料区；其余条目为本地动手不接链。官方给的 _redirects 与 vercel.json 配置片段属平台配置说明、已在 guide 转达。",
      "why": "这是 World 5 生态章的收束项目：路由让应用有了「多个页面」，测试让你敢改代码，取数让应用有了真实数据，状态提升让分散的 UI 共享一个真相——四条线在一个项目里拧成一股。做完它你就拥有了一个可部署、可展示、有测试的完整 React 应用——这正是简历上「React 项目」一词的最低成色。下一章 Context API 会把你在这个项目里手写的 props 提升方案再升级一层。",
      "sections": [
        {
          "h": "项目说明",
          "p": [
            "官方开场：你已经远离 React 婴儿期——路由与测试框架都已在手，但路还长。现在正是把这些概念用起来的绝佳时机：做一个经典项目——**模拟购物车**。",
            "本站按 Project 课纪律提供：官方要求逐条中文版（下一节）、拆解思路（不含成品代码）、验收清单（末节）。官方第②条要求你把组件与文件夹结构**写在纸上**、记在方便查看的地方边做边补——结构先行是官方工作流，别跳过。"
          ]
        },
        {
          "h": "官方要求（十一条中文版）",
          "p": [
            "① 新建一个 React 项目。② 想清楚组件与文件夹结构：应用怎么搭、需要哪些组件或功能——记下来随时补。③ 三个页面：**首页、商店页、购物车页**；用户经**导航栏**切换，导航栏在所有页面显示。④ 首页随意：几张图或一些信息完全够——不必花哨，检验所学概念而已。⑤ 商店页每个商品一张**卡片**：**输入框**手动键入购买数量 + **加/减按钮**微调 + 商品标题 + **Add To Cart** 按钮。⑥ 购物车有货时，导航栏的购物车链接**显示件数**、随增删**实时更新**。⑦ 购物车页展示商品与数量、允许**增减**（合适时含移除）；**无需**结算/支付系统。⑧ 商品数据从 **FakeStore API**（或同类）获取。⑨ 用 **React Testing Library 充分测试**——**别直接测 react-router**（外部库，其作者已测过）。⑩ 照常把样式做到能展示——你已有一堆方案可选（课程立场：CSS Modules）。⑪ **部署**：SPA 路由可能需平台配置——**Netlify**：public/ 里加 _redirects 文件、内容 /* /index.html 200；**Vercel**：根目录 vercel.json 配 rewrites 把 /(.*) 重写到 /index.html；**Cloudflare Pages**：默认行为即可、无需额外步骤（三平台文档均在资料区）。"
          ]
        },
        {
          "h": "拆解思路与验收清单",
          "p": [
            "**结构**：三页面 + 全页导航栏 → router 至少 3 条路由（/、/shop、/cart），导航栏住布局层；商品卡片 = 列表渲染（key）+ 本地数量状态。",
            "**状态设计（核心题）**：「导航栏实时件数」要求件数住在导航栏与商店/购物车页的**共同祖先**（App 层）：cartItems 顶层持有，addToCart 从卡片提升、增减移除从购物车页提升，经 props 下发——「组件间共享状态」+「请求提升」的直接应用；想热身下一章也可用 Context API。",
            "**数据**：FakeStore API 无 key 直取（/products），三态骨架（loading/error/data）照取数课搭，status >= 400 检查别忘。",
            "**测试**：RTL 测自己的交互——「点 Add To Cart → 导航栏件数 +1」是标准 AAA 一条；mock 的是 fetch（vi.fn/vi.mock），**不是** react-router；带路由组件包 memory router（两档方案见路由课）。",
            "**部署**：深链接直达 /cart 会 404（服务器不认识客户端路由）——第⑪条的平台配置就是解法；配置抄官方给的形状，部署后直接访问 /cart 验证。",
            "**验收清单**：导航栏三页切换不整页刷新；卡片五要素齐（标题/数量输入框/加减按钮/Add To Cart）；件数实时更新；购物车页增减移除可用、无结算；数据来自 FakeStore API（三态处理在位）；RTL 测试覆盖核心交互且不测 react-router；样式完整；部署后 /cart 深链接不 404。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "件数状态放错层",
          "text": "件数放商店页里，导航栏就拿不到——切到购物车页更是断片。消费者与生产者的共同祖先（App 层）才是它的家；props 逐层下发或用 Context。"
        },
        {
          "title": "去测 react-router 本身",
          "text": "官方明令别测外部库：路由库的行为其作者已经测过。你要测的是「自己的组件在路由上下文里做对了事」——包 memory router、mock fetch，断言自己的 UI。"
        },
        {
          "title": "部署后深链接 404 才发现没配重定向",
          "text": "开发环境 Vite 帮你兜了底，生产服务器不会：直接访问 /cart 就是 404。上线前按平台加 _redirects / vercel.json（CF Pages 免配），部署后亲手访问一次深链接验证。"
        }
      ],
      "official": {
        "assignment": [
          "新建一个 React 项目",
          "想清楚组件与文件夹结构：应用怎么搭？需要哪些组件或功能？把它们记在方便随时查看的地方、边做边补",
          "三个页面：首页、商店页、购物车页——用户经导航栏切换，导航栏在所有页面显示",
          "首页随意发挥：几张图或一些信息完全够，不必花哨——检验目前所学概念",
          "商店页每个商品一张卡片：数量输入框（手动键入）+ 加/减按钮微调 + 商品标题 + Add To Cart 按钮",
          "购物车有货时导航栏的购物车链接显示件数，随增删实时更新",
          "购物车页展示商品与数量、允许增减（合适时含移除）；无需结算/支付系统",
          "商品数据从 FakeStore API（或同类）获取（资料区）",
          "用 React Testing Library 充分测试应用——别直接测 react-router（外部库其作者已测过）",
          "照常把样式做到能展示——你已有一堆方案可选",
          "部署：按平台配置 SPA 路由——Netlify 加 public/_redirects（/* /index.html 200）、Vercel 加 vercel.json rewrites、Cloudflare Pages 默认即可（三平台文档在资料区）"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/the_react_ecosystem/project_shopping_cart.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "f33c803b679959517cb8ef14a5896ee1f6c8186a873fa35c112462400c2c2356",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "node-path-react-new-managing-state-with-the-context-api",
      "title": "Managing State With The Context API",
      "zh": "用 Context API 管理状态",
      "group": 6,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-managing-state-with-the-context-api",
      "summary": "Context API 正篇：不靠 props 逐层传递，让任意深度的组件直接读到共享数据。动机场景回到 Shopping Cart：头部计数器显示购物车件数、商品页按钮加购——件数状态住在 App，却要经 App → Header → Links 一路 props 下传（prop drilling，属性钻取）：组件越多嵌套越深，微管理越繁琐。Context API 三要素：createContext(默认值) 造 context 对象；Context 对象直接当组件用（React 19 前是 ContextObject.Provider），value prop 里塞要共享的数据，包住消费者组件；任意深度的被包组件用 useContext(ContextObject) 直接取数——props 全删。默认值的意义：消费者不在 Provider 内也不崩（测试还免包 Provider）+ IDE 自动补全。代价（官方明说）：① 性能——context 值一更新，所有消费该 context 的组件全部重渲染（哪怕它用的那部分没变）；② 可读性——任何组件都能拿到状态，代码反而难追踪。缓解方案：拆多个小 context 而非一个大 context；有些场景组件组合（composition）比 context 更合适；更大的需求交给外部状态库（Zustand / Redux——功能多有优化但有学习曲线，官方建议本课程其余部分继续用 Context API）。",
      "guide": "以下是官方原课的中文化梳理。开场接上：前面课程学了管理状态、在组件间传数据传 props；但应用一大，这套流程会变得重复、不便、难管理。「React Router」课提过 outlet context（父组件经 <Outlet /> 向子组件传数据）——本课讲**在 outlet 场景之外**用 Context API 做类似的事。**为什么需要 Context API**：Context API 让你管理应用的「全局状态」而不必把数据经多层组件 props 传递——不管组件住在组件树哪里，都能共享数据与功能。官方例子回到你刚做过的 Shopping Cart：商品详情页 + 头部购物车计数器（显示件数）、「Add to Cart」按钮加购。省略路由与无关组件后，状态提升的标准解法是：cartItems 与 addToCart 住在 App（共同祖先），**props 下传**——cartItemsCount 传 Header、Header 再传 Links；addToCart 与 products 传 ProductDetail。官方点出问题：这是非常常见的模式、没什么复杂——但**微管理很多**：要传 props 的组件一大把，而且发生了 **prop drilling（属性钻取）**：cartItemsCount 从 App → Header → Links 一路下传，中间层（Header）根本不消费它、只是转手。应用再长大（加 Cart 组件、ProductListing 组件、更多功能），嵌套更深、props 更多——重复且复杂：功能越多复杂度越高；组件化框架尤其如此——我们更倾向拆独立可复用组件而不是内联元素，这又制造更多嵌套与 props 传递。**实现 Context API**：三要素——① **createContext**：「创建 context」，接收任意值（数字/字符串/对象）作**默认值**，返回 context 对象；② **useContext**：消费 context 数据的 hook——组件里调它取数，参数是 context 对象本身；③ **ContextObject**：context 对象可直接当组件用、接收 **value** prop——value 就是要传给被包组件（无论嵌套多深）的 context 值，即「提供」context 的通道；**React 19 之前用的是 ContextObject.Provider**——官方明说：凡看到 Provider 字样，指的就是 ContextObject 本身。实操：createContext 从 react 导入；官方示例建 ShopContext，默认值给了 { products: [], cartItems: [], addToCart: () => {} } 形状的对象——**默认值不是必须的**（createContext(null) 也完全没问题），给对象的理由是：即使某组件不小心在 Provider 之外用了这个 context，**有默认值应用就不会崩**（测试也受益：不用包 Provider 就能拿到值）；还能吃到 IDE 自动补全的红利。反正 value prop 会覆盖默认值——给对象还是 null 随你。使用：App 里 <ShopContext value={{ cartItems, products, addToCart }}> 包住 Header 与 ProductDetail——**value prop 覆盖默认值**；Header 的 Links 里 const { cartItems } = useContext(ShopContext)（**必须传 ShopContext 对象本身作参数**）；ProductDetail 里 const { products, addToCart } = useContext(ShopContext)。**props 全删**——prop drilling 问题彻底消失：只要组件嵌套在 Provider 里面，多深都能直接拿到数据。收益总结：跨组件传数据更高效干净流畅；createContext + useContext 轻松把状态与函数下传而无需 prop drilling；数据集中一处更**中心化**——这一切让代码更易推理。**代价（官方明说两条）**：① **性能问题**：context 里的状态一更新，**所有消费该 context 的组件都会重渲染**——哪怕它用的那部分状态没变；消费者一多性能问题就来了；② **代码更难追踪**：任何组件都能轻松拿到状态——嵌套消费者一多，代码反而难跟进；要保持代码组织与结构清晰以免混乱。**缓解方案（官方三条）**：① **多个小 context 替代单个大 context**——按相关状态分片，减少每个 context 的消费者数量、最小化无谓重渲染；② 有时 Context API 根本不是最佳解——看看 Robin Wieruch 的 React Component Composition 一文（资料区），组件组合是另一条路；③ 靠外部状态管理系统：**Zustand** 与 **Redux**——内建大量优化、功能丰富，但有学习曲线；**官方建议本课程其余部分继续用 Context API**——对接下来要建的大多数项目它仍然可靠。Assignment 两条：① React 文档「使用 Context 深层传递参数」（官方中文版在资料区）——更多引人入胜的示例与 Context API 的可能优化，**每个示例都要动手试**；② Kent C. Dodds 的短文 Prop Drilling（资料区）——用易消化的例子把 prop drilling 讲透。",
      "understand": [
        "动机：应用一大，props 逐层传递变得重复、不便、难管理——**prop drilling（属性钻取）**：中间层不消费只转手",
        "Context API 三要素：**createContext(默认值)** 造 context 对象 / **ContextObject 当组件用**接 value prop 包住消费者（React 19 前是 ContextObject.Provider）/ **useContext(ContextObject)** 任意深度直接取数",
        "默认值非必须（null 也行），给对象的理由：Provider 之外消费不崩 + 测试免包 Provider + IDE 自动补全；value prop 会覆盖默认值",
        "useContext 的参数是 **context 对象本身**（ShopContext），不是别的",
        "收益：props 全删、数据集中一处（中心化）、嵌套多深都直接可达——代码更易推理",
        "代价①**性能**：context 值一更新，**所有**消费组件全部重渲染——哪怕它用的那部分没变",
        "代价②**可读性**：任何组件都能拿到状态，消费者一多代码反而难追踪",
        "缓解①：**多个小 context 替代单个大 context**——按相关状态分片，减少消费者与无谓重渲染",
        "缓解②：有些场景**组件组合（composition）**比 context 更合适（Robin Wieruch 一文）",
        "缓解③：外部状态库 **Zustand / Redux**——功能多有优化但有学习曲线；**官方建议本课程其余部分继续用 Context API**"
      ],
      "terms": [
        {
          "en": "Context API",
          "zh": "React 的跨层数据共享机制：Provider 提供、useContext 消费——绕开 props 逐层传递"
        },
        {
          "en": "Prop drilling",
          "zh": "属性钻取：props 经不消费它的中间层组件一路下传——Context API 要解决的痛点"
        },
        {
          "en": "createContext()",
          "zh": "创建 context 对象：参数是默认值（可 null）——Provider 之外消费时的兜底"
        },
        {
          "en": "Provider / ContextObject",
          "zh": "context 的提供端：React 19 起 ContextObject 直接当组件用接 value prop；19 之前是 ContextObject.Provider"
        },
        {
          "en": "useContext()",
          "zh": "消费端 hook：传 context 对象本身，返回当前 value——组件嵌套多深都能用"
        },
        {
          "en": "Component composition",
          "zh": "组件组合：把子组件经 children/props 直接塞进消费者——有时比 context 更简单的数据通路"
        }
      ],
      "tasks": [
        "用官方 Shopping Cart 例子走一遍前后对比：先写 props 版（App→Header→Links 钻取 cartItemsCount），再改 Context 版（ShopContext + useContext）——数一数删掉了几个 props",
        "默写三要素的职责卡：createContext 造对象（默认值兜底）/ ContextObject 当组件接 value（提供）/ useContext 传对象本身（消费）——React 19 前后 Provider 写法差异记在旁边",
        "给 createContext 传对象默认值再传 null 各写一版，体会官方给的三个理由：Provider 外不崩、测试免包、IDE 补全",
        "复述两条代价各配一个场景：性能（购物车 context 更新，连只读 products 的组件也重渲染）；可读性（十个组件都在 useContext，数据流向难追踪）",
        "把三条缓解方案写成决策清单：状态相关就分片成小 context / 组合能解决就不用 context / 真的大了再考虑 Zustand 或 Redux（课程内继续 Context API）",
        "完成官方 Assignment 两条：React 文档「使用 Context 深层传递参数」逐个示例动手试（官方中文版在资料区）；Kent C. Dodds 的 Prop Drilling 短文（资料区）"
      ],
      "quiz": [
        {
          "question": "什么是 prop drilling？官方例子里它发生在哪条链路上？",
          "answer": "属性钻取：props 经过并不消费它的中间层组件一路下传。官方例子：cartItemsCount 从 App → Header → Links——Header 自己不显示件数、只是转手给 Links。组件树越深、功能越多，这种转手链路越泛滥。"
        },
        {
          "question": "Context API 三要素各自做什么？React 19 前后写法有什么差异？",
          "answer": "createContext(默认值) 创建 context 对象；ContextObject 直接当组件用、value prop 塞共享数据包住消费者；被包组件用 useContext(ContextObject) 取数（参数是 context 对象本身）。差异：React 19 之前提供端写 ContextObject.Provider——官方明说看到 Provider 就是指 ContextObject。"
        },
        {
          "question": "createContext(null) 也合法——官方为什么示例里给对象默认值？给了哪三个理由？",
          "answer": "① 组件不小心在 Provider 之外消费时，有默认值应用不会崩；② 测试受益：不用包 Provider 就能拿到值；③ 对象默认值让 IDE 能自动补全属性。反正 value prop 会覆盖默认值，给对象还是 null 随你。"
        },
        {
          "question": "官方明说的 Context API 两条代价是什么？",
          "answer": "① 性能：context 值一更新，所有消费该 context 的组件全部重渲染——哪怕它用的那部分状态没变；消费者多时性能问题显著。② 可读性：任何组件都能轻松拿到状态——嵌套消费者一多，代码反而难追踪，需要刻意保持组织与结构。"
        },
        {
          "question": "官方给的三条缓解方案是什么？课程内的推荐路线是？",
          "answer": "① 多个小 context 替代单个大 context（按相关状态分片，减少消费者与无谓重渲染）；② 有些场景组件组合更合适（Robin Wieruch 一文）；③ 外部状态库 Zustand / Redux（功能多有优化但有学习曲线）。课程内推荐：继续用 Context API——对接下来大多数项目它仍然可靠。"
        }
      ],
      "optional": [],
      "note": "Assignment 第 1 条 React 文档「使用 Context 深层传递参数」核验出官方中文版（zh-hans.react.dev，3415 汉字，资料区）；第 2 条 Kent C. Dodds 的 Prop Drilling 无中文版按 C 类。正文的「React Router 课」回链为 TOP 自有课页、react.dev「在组件间共享状态」链接与「再谈状态」课既有条目同址（跨课合并不重复登记）、官方配图为 statically CDN 课程素材——均按口径剔除。正文 Potential solutions 节的 Robin Wieruch 组件组合一文与 Zustand / Redux 链接登记资料区。官方文件名 managing_state_with_context_api.md 对 slug managing-state-with-the-context-api **少一个 the 不同形**（配图子目录名与 .md 同名），SOURCES.md 已登记。React 19 前 Provider 写法差异已如实转达。",
      "why": "这一课解决的是你已经在 Shopping Cart 里真实撞上的问题：件数状态在 App、显示在导航栏、修改在商店页——props 钻取的每一条链路你都手写过了。Context API 把「转手」全部删掉，代价是性能与可读性的新账要算。官方的克制值得学：context 不是越多越好，大 context 拆小、能用组合就不用 context、课程内不上 Redux——这套决策顺序在真实项目里比 API 本身更值钱。下一章的 useReducer 会与 context 搭档出现：一个管数据通路、一个管更新逻辑。",
      "sections": [
        {
          "h": "为什么需要 Context API",
          "p": [
            "前面课程学了管理状态、在组件间传数据传 props——但应用一大，这套流程变得重复、不便、难管理。「React Router」课讲过 outlet context（经 <Outlet /> 传数据）；本课讲 outlet 场景之外的通用方案。",
            "**Context API**：管理应用全局状态而不必把数据经多层组件 props 传递——不管组件住在组件树哪里都能共享数据与功能。",
            "官方例子回到 Shopping Cart：商品详情页 + 头部购物车计数器 + Add to Cart 按钮。标准解法（状态提升）：cartItems 与 addToCart 住 App，props 下传——cartItemsCount 传 Header、Header 再传 Links。这模式很常见、不复杂——**但微管理很多**：要传 props 的组件一大把，而且发生了 **prop drilling**：cartItemsCount 从 App → Header → Links 一路下传，中间层 Header 根本不消费、只是转手。应用再长大（加 Cart、ProductListing、更多功能），嵌套更深、props 更多——功能越多复杂度越高；组件化框架尤其如此：我们更爱拆独立可复用组件而非内联，这制造更多嵌套与传递。"
          ]
        },
        {
          "h": "三要素：createContext、ContextObject 与 useContext",
          "p": [
            "① **createContext**：创建 context——接收任意值作**默认值**（数字/字符串/对象），返回 context 对象；② **useContext**：消费 context 数据的 hook——组件里调它取数，参数是 context 对象；③ **ContextObject**：context 对象直接当组件用、接收 **value** prop——value 就是要传给被包组件（无论多深）的值，即「提供」context 的通道。**React 19 之前写 ContextObject.Provider**——官方明说：看到 Provider 就是指 ContextObject。",
            "官方示例：const ShopContext = createContext({ products: [], cartItems: [], addToCart: () => {} })。**默认值不是必须的**——createContext(null) 也完全没问题。给对象的理由：组件不小心在 Provider 之外消费时**应用不崩**（测试也免包 Provider）+ IDE 自动补全红利。反正 value prop 会覆盖默认值。"
          ]
        },
        {
          "h": "用起来：Provider 包住、useContext 直取",
          "p": [
            "App 里：<ShopContext value={{ cartItems, products, addToCart }}> 包住 Header 与 ProductDetail——value prop 覆盖默认值，props 全部删掉。",
            "Header 的 Links 里：const { cartItems } = useContext(ShopContext)——**必须传 ShopContext 对象本身作参数**；ProductDetail 里：const { products, addToCart } = useContext(ShopContext)。",
            "**prop drilling 问题彻底消失**：只要组件嵌套在 Provider 里面，多深都直接拿到数据。收益：跨组件传数据更高效干净流畅；createContext + useContext 轻松下传状态与函数；数据集中一处更**中心化**——代码更易推理。"
          ]
        },
        {
          "h": "两条代价",
          "p": [
            "① **性能问题**：context 里的状态一更新，**所有消费该 context 的组件都重渲染**——哪怕它用的那部分状态没变。消费者一多，性能问题就来了。",
            "② **代码更难追踪**：任何组件都能轻松拿到状态——嵌套消费者一多，代码反而难跟进。要保持代码组织与结构清晰以免混乱。"
          ]
        },
        {
          "h": "缓解方案与课程路线",
          "p": [
            "① **多个小 context 替代单个大 context**：按相关状态分片——减少每个 context 的消费者数量、最小化无谓重渲染。",
            "② 有时 Context API 根本不是最佳解：看 Robin Wieruch 的 **React Component Composition** 一文（资料区）——组件组合是另一条路。",
            "③ 外部状态管理系统：**Zustand** 与 **Redux**——内建大量优化、功能丰富，但有学习曲线。**官方建议：本课程其余部分继续用 Context API**——对接下来要建的大多数项目它仍然可靠。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "jsx",
          "code": "// 三要素合璧（官方示例骨架）\nimport { useState, createContext, useContext } from \"react\";\n\nexport const ShopContext = createContext({\n  products: [],\n  cartItems: [],\n  addToCart: () => {},\n}); // 对象默认值：Provider 外不崩 + 测试免包 + IDE 补全\n\nexport default function App() {\n  const [cartItems, setCartItems] = useState([]);\n  const products = /* 取数 hook */;\n  const addToCart = (product) => { /* 加购逻辑 */ };\n\n  return (\n    // React 19 写法：ContextObject 直接当组件（19 前是 ShopContext.Provider）\n    <ShopContext value={{ cartItems, products, addToCart }}>\n      <Header />\n      <ProductDetail />\n    </ShopContext>\n  );\n}\n\nfunction Links() {\n  const { cartItems } = useContext(ShopContext); // 传 context 对象本身\n  return <div className=\"cart-icon\">{cartItems.length}</div>;\n}",
          "note": "对比 props 版：Header 与 Links 的 props 全删——数据从「逐层转手」变「任意深度直取」。value 覆盖默认值。"
        }
      ],
      "pitfalls": [
        {
          "title": "一个大 context 装下全部状态",
          "text": "context 值一更新所有消费者全重渲染——大 context 意味着任何状态变化都全员重渲染。按相关状态拆多个小 context 是官方第一缓解方案。"
        },
        {
          "title": "useContext 传错参数",
          "text": "参数必须是 context 对象本身（ShopContext），不是它的 value、也不是字符串名。传错拿到的永远是默认值——还以为 Provider 没生效。"
        },
        {
          "title": "把 context 当万能锤",
          "text": "官方两条代价（性能、可读性）不是装饰：能用组件组合解决的别上 context，真的大了再考虑 Zustand/Redux。课程内官方路线：继续 Context API。"
        }
      ],
      "official": {
        "assignment": [
          "React 文档「使用 Context 深层传递参数」（官方中文版在本站资料区）：更多引人入胜的示例与 Context API 的可能优化——**每个示例都要动手试**",
          "读 Kent C. Dodds 的短文 Prop Drilling（资料区）：用易消化的例子把 prop drilling 讲透"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/more_react_concepts/managing_state_with_context_api.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "5f7ca39c7508129bea791f85fa05db75be4733935424c0f7287b7b6a5c5a3307",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "node-path-react-new-reducing-state",
      "title": "Reducing State",
      "zh": "归约状态",
      "group": 6,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-reducing-state",
      "summary": "useReducer 入门（短课）。reducer 是纯函数：接收「前一状态 + action」返回新状态——action 是带 type 属性的对象（描述用户做了什么），还可携带 reducer 需要的其他属性。官方计数器 reducer：switch (action.type) 分派 incremented_count / decremented_count / set_count 三个 case，default 抛错。何时用：状态更新方式只有几种简单变化时不必用；组件因状态逻辑变得太大、难读、难调试时正合适——reducer 把状态逻辑分离出去（甚至独立文件/目录），组件更小更易读；action 让状态相关 bug 可追溯到具体 dispatch；纯函数可独立测试。useReducer(reducer, 初始状态) 返回 [state, dispatch]——dispatch(action) 把 action 交给 reducer、返回值用于更新状态。与 useState 同款语义：下一轮渲染才生效；用 Object.is() 判断状态是否变化、没变不重渲染。两者等价、可同组件混用——选哪个由你。",
      "guide": "以下是官方原课的中文化梳理。开场：你多半听说过 reducer——本课讲清三件事：reducer **是什么**、**什么时候用**、在 React 里**怎么用**（useReducer hook）。**什么是 reducer**：reducer 是**纯函数**——接收前一状态（previous state）与一个 action，返回新状态。**action 是带 type 属性的对象**：描述用户做了什么；对象里还可以带 reducer 产出新状态所需的其他任何属性。官方计数器示例：function reducer(state, action) 里 switch (action.type) 分派三个 case——incremented_count 返回 { count: state.count + 1 }、decremented_count 返回 { count: state.count - 1 }、set_count 返回 { count: action.value }（action 携带的额外属性在这里用上）；default 分支 throw new Error('unknown action: ' + action.type)。官方提醒：**reducer 是纯函数——不应该变异状态**（「再谈状态」课的不可变纪律原样适用）。**什么时候用**：组件的状态更新只有几种简单方式——**不必用** reducer。反过来：组件因为状态逻辑变得**太大、难读、难调试**时——正是 reducer 的主场。三个红利：① **状态逻辑分离**——甚至存到独立文件或目录，组件更小更易读；② **bug 可追溯**——reducer 用 action，任何状态相关 bug 都能顺着追到那次 dispatch 的 action；③ **可独立测试**——reducer 是纯函数，隔离测试毫无负担。**useReducer hook**：React 让你在组件里用 reducer 的通道。它接收 **reducer 函数与初始状态**两个参数，返回一个两元素数组：**当前状态**与 **dispatch 函数**——形状与 useState 同款。dispatch 接收 **action 对象**作参数：action 被交给 reducer 函数、其返回值用于更新状态。官方示例：const [state, dispatch] = useReducer(reducer, { count: 0 })；点击处理器里 dispatch({ type: 'incremented_count' })。两条与 useState 同款的语义：**dispatch 之后 React 只在下一轮渲染更新状态**（状态即快照的世界观不变）；React 用 **Object.is()** 判断状态是否变化——没变就不重渲染（与 setState 同一判定）。官方收尾：用 useState 还是 useReducer **由你**——两者等价，同一个组件里混用也行。Assignment 两条：① 通读 React 文档「迁移状态逻辑至 Reducer 中」（官方中文版在资料区）——学习怎么在 React 里用 reducer、怎么把 useState 重构成 useReducer，**别忘做文末的挑战题**；② 读 useReducer 参考页（官方中文版在资料区）——**特别留心 troubleshooting 一节**的常见问题。",
      "understand": [
        "**reducer = 纯函数 (前一状态, action) => 新状态**；action 是带 type 属性的对象、可携带额外属性（如 set_count 的 value）",
        "纯函数纪律原样适用：**不变异状态**——每个 case 返回新对象",
        "switch (action.type) 分派 + **default 抛错**（未知 action 是 bug，别静默吞掉）",
        "何时**不**用：状态更新只有几种简单方式——useState 足够",
        "何时用：组件因状态逻辑**太大、难读、难调试**——三个红利：状态逻辑分离（可独立文件）、bug 顺着 action 可追溯、纯函数可独立测试",
        "**useReducer(reducer, 初始状态)** 返回 [state, dispatch]——dispatch(action) 把 action 交给 reducer、返回值更新状态",
        "与 useState 同款语义：**下一轮渲染才生效**（状态即快照）；**Object.is()** 判定变化、没变不重渲染",
        "两者等价、可同组件混用——选哪个由你"
      ],
      "terms": [
        {
          "en": "Reducer",
          "zh": "归约函数：纯函数 (prevState, action) => newState——状态更新逻辑的独立容器"
        },
        {
          "en": "Action",
          "zh": "动作对象：必带 type 属性描述用户做了什么，可携带 reducer 所需的其他属性"
        },
        {
          "en": "dispatch()",
          "zh": "派发动作：useReducer 返回的更新入口——dispatch(action) 触发 reducer 计算新状态"
        },
        {
          "en": "useReducer()",
          "zh": "React 的 reducer hook：吃 reducer 与初始状态、返回 [state, dispatch]——useState 的等价重武器"
        }
      ],
      "tasks": [
        "手写官方计数器 reducer：三个 case（incremented_count / decremented_count / set_count）+ default 抛错——写完自查每个 case 是否返回了新对象（不变异）",
        "用 useReducer(reducer, { count: 0 }) 接上 UI：三个按钮分别 dispatch 三种 action——观察 set_count 的 action.value 怎么携带额外数据",
        "做判断练习：给「再谈状态」课的 person 对象写更新——两种方案（多个 useState vs 一个 reducer）各写一遍，体会官方「更新方式简单就不必用」的分寸",
        "复述三个红利各配一句话：逻辑分离（组件瘦身）/ action 可追溯（bug 顺藤摸瓜）/ 纯函数可独立测试",
        "完成官方 Assignment 两条：React 文档「迁移状态逻辑至 Reducer 中」逐节读 + 文末挑战题动手做（官方中文版在资料区）；useReducer 参考页特别精读 troubleshooting 一节（官方中文版在资料区）"
      ],
      "quiz": [
        {
          "question": "reducer 的函数签名与纪律是什么？action 对象长什么样？",
          "answer": "reducer(state, action) 返回新状态的纯函数——纯意味着不变异 state（每个 case 返回新对象）、同输入同输出。action 是必带 type 属性的对象（描述用户做了什么），还可携带 reducer 需要的其他属性（如 set_count 的 value）。官方示例的 default 分支对未知 type 抛错。"
        },
        {
          "question": "官方给的「什么时候用 reducer」判据是什么？",
          "answer": "反面：组件状态更新只有几种简单方式——不必用。正面：组件因状态逻辑变得太大、难读或难调试——正是主场。红利三个：状态逻辑分离（可住独立文件/目录、组件更小更易读）；状态 bug 可顺着追溯回 dispatch 的 action；reducer 是纯函数、可独立测试。"
        },
        {
          "question": "useReducer 接收什么、返回什么？dispatch 之后状态何时更新？",
          "answer": "接收 reducer 函数与初始状态，返回 [当前状态, dispatch 函数]。dispatch(action) 把 action 交给 reducer、返回值用于更新状态——且只在**下一轮渲染**生效（状态即快照语义与 useState 一致）。"
        },
        {
          "question": "useReducer 与 useState 的等价性体现在哪两条机制上？官方对选型的结论是？",
          "answer": "① 都用 Object.is() 判断新旧状态是否变化——没变就不重渲染；② 都是「下一轮渲染才更新」的快照语义。结论：两者等价、甚至可同组件混用——用哪个由你。"
        }
      ],
      "optional": [],
      "note": "Assignment 两条的 React 文档页均核验出官方中文版（zh-hans.react.dev「迁移状态逻辑至 Reducer 中」3213 汉字与「useReducer」参考页 2847 汉字，资料区）。正文的 MDN Object.is 链接与「再谈状态」课既有条目同址——跨课合并不重复登记、任务映射按防悬空纪律不接。官方文末挑战题要求已转达进任务文案。",
      "why": "这一课给状态管理补上「重武器」：当 Shopping Cart 一类项目的状态逻辑开始缠绕（加购/移除/改数量/清空挤在一个组件里），reducer 把更新逻辑收进一个可独立测试的纯函数、每个更新都有名有姓（action.type）。它也是通向真实 React 生态的桥：Redux 的核心概念（action/reducer/dispatch）与本课一模一样——先在小尺度学会这套词汇，以后见到大 store 就不陌生。官方「等价、混用、由你」的收尾也在教你选型分寸：工具没有高低，只有合不合身。",
      "sections": [
        {
          "h": "reducer 是什么",
          "p": [
            "reducer 是**纯函数**：接收**前一状态**与一个 **action**，返回**新状态**。",
            "**action 是带 type 属性的对象**——描述用户做了什么；对象还可以携带 reducer 产出新状态需要的任何其他属性。",
            "官方计数器示例：switch (action.type) 分派——incremented_count 返回 { count: state.count + 1 }；decremented_count 返回 { count: state.count - 1 }；set_count 返回 { count: action.value }（携带属性的用武之地）；**default 抛错**：throw new Error('unknown action: ' + action.type)。记住：reducer 是纯函数——**不应该变异状态**。"
          ]
        },
        {
          "h": "什么时候用 reducer",
          "p": [
            "组件只需要几种简单方式更新状态——**不必用** reducer。反过来：组件因为状态逻辑变得**太大、难读、难调试**——正是用 reducer 的时候。",
            "三个红利：① **状态逻辑分离**——甚至存到独立文件或目录，组件更小更易读；② reducer 用 **action**——任何状态相关 bug 都能追溯回那次 dispatch 的 action；③ reducer 是**纯函数**——可以隔离测试。"
          ]
        },
        {
          "h": "useReducer hook",
          "p": [
            "React 让你在组件里用 reducer 的通道：**useReducer(reducer函数, 初始状态)**——返回两元素数组：**当前状态**与 **dispatch 函数**（形状与 useState 同款）。",
            "**dispatch 接收 action 对象**：action 交给 reducer、返回值用于更新状态。官方示例：const [state, dispatch] = useReducer(reducer, { count: 0 })；handleClick 里 dispatch({ type: 'incremented_count' })。",
            "两条与 useState 同款的语义：dispatch 之后 **React 只在下一轮渲染更新状态**；React 用 **Object.is()** 判断状态是否变化——没变就不重渲染。",
            "官方收尾：用 useState 还是 useReducer **由你**——两者等价，同一组件混用也行。"
          ]
        },
        {
          "h": "Assignment 与延伸",
          "p": [
            "① React 文档「迁移状态逻辑至 Reducer 中」：怎么在 React 里用 reducer、怎么把 useState 重构成 useReducer——**文末挑战题别忘做**（官方中文版在资料区）。",
            "② useReducer 参考页：**特别留心 troubleshooting 一节**的常见问题（官方中文版在资料区）。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "// 官方计数器 reducer：三 case + default 抛错\nfunction reducer(state, action) {\n  switch (action.type) {\n    case \"incremented_count\": {\n      return { count: state.count + 1 };\n    }\n    case \"decremented_count\": {\n      return { count: state.count - 1 };\n    }\n    case \"set_count\": {\n      return { count: action.value }; // action 携带的额外属性\n    }\n    default: {\n      throw new Error(\"unknown action: \" + action.type);\n    }\n  }\n}\n\n// 组件里接线\nconst [state, dispatch] = useReducer(reducer, { count: 0 });\n\nfunction handleClick() {\n  dispatch({ type: \"incremented_count\" });\n}",
          "note": "每个 case 返回新对象（不变异）；default 抛错让未知 action 立即暴露。dispatch 后下一轮渲染才更新——快照语义与 useState 一致。"
        }
      ],
      "pitfalls": [
        {
          "title": "在 reducer 里变异状态",
          "text": "reducer 是纯函数：state.count++ 或 state.items.push() 都违规——返回新对象（展开/concat/filter）。「再谈状态」课的不可变纪律原样适用。"
        },
        {
          "title": "default 分支静默返回原状态",
          "text": "官方示例对未知 action.type 抛错——拼错 type 立即炸出来。静默返回 state 会把 bug 藏起来：dispatch 了但什么都没发生，查半天。"
        },
        {
          "title": "简单状态也上 reducer",
          "text": "官方判据：更新方式只有几种简单变化就不必用——一个布尔开关配 useReducer 是仪式过重。reducer 的主场是状态逻辑让组件太大太难读的时候。"
        }
      ],
      "official": {
        "assignment": [
          "通读 React 文档「迁移状态逻辑至 Reducer 中」（官方中文版在本站资料区）：学习怎么在 React 里用 reducer、怎么把 useState 重构成 useReducer——**别忘做文末挑战题**",
          "读 useReducer 参考页（官方中文版在本站资料区）：**特别留心 troubleshooting 一节**你可能遇到的常见问题"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/more_react_concepts/reducing_state.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "4fe5dad8016c6416c76855b7f64daf54c7cff1f076491fda2713ecc873769339",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "node-path-react-new-refs-and-memoization",
      "title": "Refs And Memoization",
      "zh": "Ref 与记忆化",
      "group": 6,
      "url": "https://www.theodinproject.com/lessons/node-path-react-new-refs-and-memoization",
      "summary": "React 进阶双主题长课。useRef：管理「渲染不需要」的值——想记住点什么但不想触发重渲染时的 state 替代品；ref 对象带 current 属性、跨重渲染持久不销毁；主战场是 DOM 操作（focus、滚动、量尺寸、触发动画——vanilla JS 能做的基本都能做），useRef(null) 配 ref 属性挂到元素、useEffect 里 .current.focus()（渲染与绘制先于 effect——连接已建立）；改 ref 永不触发重渲染。与 useState 的分界：ref 可变不触发渲染、state 不可变触发渲染；别用 querySelector 绕过 React——DOM 交给 React commit 才不失声明式本意。useMemo：缓存「任何值」——昂贵计算（Cart 总价 reduce 十万件）只在依赖变化时重算，否则返回缓存；但父组件重渲染子组件必跟着重渲染，光缓存值不够——引用相等检查失败时，配 memo() 包裹子组件跳过 props 未变的重渲染；useMemo(() => fn, []) 还能缓存函数引用。useCallback：只缓存函数的专用版——useMemo(() => fn, deps) 的等价简写；选型：任何值用 useMemo、函数用 useCallback。React Compiler：新的构建期工具，自动分析代码并记忆化合适的组件与 hook——多数场景不再需要手动记忆化；但手动知识仍必修：看懂 Compiler 在做什么、老代码库全是手动记忆化、个别场景要更精细的控制。官方警语：过早优化是万恶之源——先用 Profiler 测量再动手。",
      "guide": "以下是官方原课的中文化梳理。开场三问：vanilla JS 里常做的 DOM 操作在 React 的声明式世界里还能做吗？性能优化呢——状态一变 React 就重渲染组件（销毁所有不受 React 控制的局部变量、重新执行），组件就是个函数——那每次重渲染都把昂贵计算重跑一遍，应用不就慢死了？**useRef hook**：管理**渲染不需要**的值——想让组件「记住」某些信息、但**不想触发新渲染**时，它就是 state 的替代品。常见用途：**命令式动作**与**访问 DOM 里渲染出来的特定元素**。ref 还能在组件整个生命周期里**持久（persist）**保存值——每次重渲染不会销毁。想存一个跨生命周期持久、又不想放进 state 的值——正是它。**DOM 操作**：官方示例：页面加载时让按钮获得焦点——const buttonRef = useRef(null)；useEffect(() => { buttonRef.current.focus(); }, [])；按钮上挂 ref={buttonRef}。四步机制：① 导入 useRef 与 useEffect；② useRef(null) 返回带 **current** 属性的对象、初值即传入参数（与 useState 的初始值一样，后续渲染忽略它）；③ useEffect 挂载时执行一次、调 buttonRef.current.focus()；④ ref 属性把 buttonRef 与 DOM 按钮**建立连接**。为什么初值 null 却有 focus 方法：**渲染与屏幕绘制先于 React 执行 useEffect**——effect 跑起来时连接早已建立。useRef 不止 focus：滚动到特定位置、量元素尺寸、触发动画——**vanilla JS 做过的 DOM 操作基本都能做**。官方反例示范（明说**不应该**这么做、只做示例）：effect 里改 buttonRef.current.textContent、setTimeout 两秒后改回——有趣之处：**这一切绝不触发组件重渲染**。为什么不用 querySelector：官方口径——自己动手操作 DOM 违背用 React 的本意，能交给 React 就让它自己 **commit** 到 DOM。与 useState 的分界：useRef 建**可变引用**——更新值不触发重渲染；useState 管**不可变状态**——更新触发重渲染。**useMemo hook**：官方先立测量工具与警语：所有示例建议用 react 模块的 **Profiler 组件**测量；更交互式的替代是 **React Developer Tools 里的 Profiler**；以及——有时根本不用优化，因为本来就够快。软件开发名言：**「过早优化是万恶之源」（Knuth，《计算机程序设计艺术》）**。useMemo 给组件加**记忆化**：缓存函数调用的结果、之后不重算直接用——**只在依赖变化时重算**。参数与 useEffect 同款：calculateValue 回调 + dependencies 数组。**记忆化昂贵计算**：Shopping Cart 的总价场景——Cart 组件里 products.reduce((total, p) => total + p.price * p.quantity, 0) 直接在渲染里算：每次渲染/更新都从头算；用户加了几十万件商品？卡顿。用户频繁开关购物车抽屉？每次开都重算同一个值——即使内容没变。useMemo 版：const totalPrice = useMemo(() => products.reduce(...), [products])——挂载时跑回调；后续重渲染**只在 products 变化时**重跑，否则返回上次缓存值。**引用相等检查**：官方第二个示例（配 Profiler 测量、不用真开项目——react-examples 仓库 memoization/ 目录有交互示例可玩）：ButtonComponent 内含双层一万次循环（模拟昂贵渲染）；Counter 的 handleClick 经 onClick prop 传给它。问题链：组件在 state 或 props 变化时渲染；渲染时不受 React 控制的东西（函数、变量）全部销毁重建——**handleClick 每次都是新函数**、ButtonComponent 的 onClick prop 每次都是新引用。useMemo(() => handleClick, []) 缓存函数引用（或直接 useMemo(() => () => setCount(...), [])——双层箭头：外层是 useMemo 回调、内层是被缓存的函数）。**但光缓存还不够**：父组件 state 一变，子组件照样跟着重渲染（父渲染则子渲染）。解法：React 的 **memo** 包裹函数——const ButtonComponent = memo(({ children, onClick }) => {...})：**props 未变时跳过重渲染**（哪怕父组件重渲染了）。两种场景对照（react-examples 可实测）：传裸 handleClick + memo 按钮——**仍重渲染**（引用相等检查失败：新旧 prop 不相等）；传 memoizedHandleClick + memo 按钮——**不重渲染**（检查通过：引用相等）。这个原理适用于一切作为 props 传递的值；Context API 常见搭档写法：const value = useMemo(() => ({ someState, someFunction }), [someState, someFunction]) 再 <Context value={value}>。**useCallback hook**：另一种记忆化——但**只缓存函数**（useMemo 能缓存任何值）。前述 useMemo(() => handleClick, []) 或双层箭头写法，useCallback 一步到位：const handleClick = useCallback(() => setCount(prev => prev + 1), [])；或缓存既有函数 const memoizedHandleClick = useCallback(handleClick, [])。只有一层箭头、更简读。与 useMemo 的全部区别就是**缓存值的类型**：任何值用 useMemo、函数专用 useCallback——两者做的几乎是同一件事，用哪个看你偏好。**React Compiler**：较新的**构建期工具**——自动优化 React 应用：分析代码、自动记忆化合适的组件与 hook，主攻更新性能（既有组件的重渲染）。多数场景**不再需要手动记忆化**。那还要学 React.memo / useMemo / useCallback 吗？官方答案：要——① 懂手动记忆化才懂 Compiler 在引擎盖下做什么；② 现有代码库里你几乎必然撞见手动记忆化；③ 个别场景需要比 Compiler 自动行为更精细的控制（比如确保某个 useEffect 依赖被记忆化、不无谓变化触发 effect）。官方结语：长课一口气——refs 与记忆化都是难啃的概念，练习之后自会理解；refs 在特定场景极有用；自动记忆化能不写代码就优化应用；手动记忆化在必要时才出手——**只有确实需要时才用它**。这些主题还是绝佳面试题：**useMemo 与 useCallback 的区别务必说得出**。Assignment 五条：① Kent C. Dodds 的 When to useMemo and useCallback（资料区）——更多「该用/不值得用」的例子；② React 文档 useRef 参考页（官方中文版在资料区）——本课只学了基础实现，更多用例与「为什么要谨慎用这个 hook」；③ React 文档「使用 ref 操作 DOM」（官方中文版在资料区）——安全访问与修改 DOM 节点的深入；④ Dan Abramov 的名文 Making setInterval Declarative with React Hooks（overreacted.io，资料区）——useRef 在 DOM 操作之外的用武之地；⑤ React Compiler 文档（官方中文版在资料区）——多了解一点、看看怎么在项目里安装配置。",
      "understand": [
        "**useRef = 渲染不需要的值的容器**：想让组件「记住」但不触发重渲染——state 的替代品；ref.current 跨重渲染持久",
        "DOM 操作四步：useRef(null) → ref={buttonRef} 挂元素 → useEffect 里 buttonRef.current.focus()——**渲染与绘制先于 effect**，连接早已建立",
        "改 ref **绝不触发重渲染**；与 useState 分界：ref 可变不渲染、state 不可变（纪律上）触发渲染",
        "别用 querySelector 绕开 React：能交给 React commit 的就别自己动手——声明式的本意",
        "官方警语：**过早优化是万恶之源**（Knuth）——先用 **Profiler**（react 模块组件或 React Developer Tools 版）测量再优化",
        "**useMemo 缓存任何值**：昂贵计算只在依赖变化时重算、否则返回缓存——参数形状与 useEffect 同款（回调 + 依赖数组）",
        "父渲染则子必渲染——光缓存值不够：**memo() 包裹子组件**，props 未变跳过重渲染；**引用相等检查**是机制核心（裸函数 prop 每次新引用 → 检查失败 → memo 白包）",
        "useMemo(() => fn, deps) 可缓存函数引用；Context 的 value 常见 useMemo 搭档写法防消费者无谓重渲染",
        "**useCallback = 只缓存函数的 useMemo**：useCallback(fn, deps) ≡ useMemo(() => fn, deps)——任何值用 useMemo、函数用 useCallback",
        "**React Compiler**：构建期自动记忆化——多数场景不再手动；但手动知识必修（看懂 Compiler / 老代码库 / 精细控制三理由）",
        "面试必答题：useMemo 与 useCallback 的区别 = 缓存值的类型"
      ],
      "terms": [
        {
          "en": "useRef",
          "zh": "可变引用 hook：{ current: 值 } 容器——渲染不需要的值与 DOM 元素访问通道，更新不触发重渲染"
        },
        {
          "en": "ref (attribute)",
          "zh": "JSX 的 ref 属性：把 useRef 对象与真实 DOM 元素建立连接"
        },
        {
          "en": "Memoization",
          "zh": "记忆化：缓存计算结果、依赖不变直接复用——用空间换时间"
        },
        {
          "en": "useMemo",
          "zh": "值记忆化 hook：useMemo(calculateValue, deps)——任何值可缓存"
        },
        {
          "en": "useCallback",
          "zh": "函数记忆化 hook：useCallback(fn, deps)——useMemo(() => fn, deps) 的专用简写"
        },
        {
          "en": "memo()",
          "zh": "组件包裹函数：props 未变时跳过重渲染（父渲染不连带）——引用相等检查是判据"
        },
        {
          "en": "Referential equality",
          "zh": "引用相等：新旧 prop 是不是同一个对象/函数引用——memo 与依赖数组共同的判定机制"
        },
        {
          "en": "Profiler",
          "zh": "渲染性能测量工具：react 模块的 <Profiler> 组件或 React Developer Tools 的 Profiler 面板——优化前先测量"
        },
        {
          "en": "React Compiler",
          "zh": "构建期自动优化工具：分析代码自动记忆化组件与 hook——主攻更新性能"
        }
      ],
      "tasks": [
        "手写官方 focus 示例四步：useRef(null) → ref 挂按钮 → useEffect 空数组 → current.focus()——再答自问：为什么初值 null 却调得动 focus？（渲染与绘制先于 effect）",
        "克隆 react-examples 进 memoization/ 目录跑官方交互示例：分别传裸 handleClick 与 memoizedHandleClick 给 memo 包裹的 ButtonComponent，用 Profiler 实测两种场景的重渲染差异",
        "写 Cart 总价的 useMemo 版：products.reduce 包进 useMemo([products])——口述「开关抽屉不再重算」的机制",
        "做选型卡：任何值 → useMemo；函数 → useCallback；组件跳过重渲染 → memo；自动 → React Compiler——每格配一个官方例子",
        "把 Context 搭档写法抄进笔记：const value = useMemo(() => ({ someState, someFunction }), [someState, someFunction])——并解释它防的是什么（上一课「所有消费者全重渲染」的代价）",
        "完成官方 Assignment 五条：Kent C. Dodds 的 When to useMemo and useCallback；useRef 参考页（官方中文版）；「使用 ref 操作 DOM」（官方中文版）；Dan Abramov 的 setInterval 名文；React Compiler 文档（官方中文版）——均在资料区"
      ],
      "quiz": [
        {
          "question": "useRef 与 useState 的本质区别是什么？各适合存什么？",
          "answer": "useRef 建可变引用：更新 current 不触发重渲染、值跨渲染持久——存「渲染不需要」的值（定时器 id、输入框元素、上次值）。useState 管不可变状态：更新触发重渲染——存「界面依赖」的数据。想让组件记住点什么但不想因此重渲染——useRef。"
        },
        {
          "question": "buttonRef 初值是 null，为什么 useEffect 里 buttonRef.current.focus() 不报错？",
          "answer": "渲染与屏幕绘制先于 React 执行 useEffect——effect 跑起来时 ref 属性已把 buttonRef 与真实 DOM 按钮连接好，current 已指向元素。挂载时序：render → commit（连接建立）→ effect。"
        },
        {
          "question": "昂贵计算包了 useMemo，为什么 memo 包裹的子组件有时还是重渲染？",
          "answer": "两个机制要同时到位：useMemo 缓存值/函数引用（依赖不变返回同一引用），memo 让子组件在 props 未变时跳过重渲染——判据是引用相等检查。裸函数 prop 每次渲染都是新引用 → 检查失败 → memo 白包。所以官方对照实验：裸 handleClick + memo 仍重渲染；memoizedHandleClick + memo 才不重渲染。"
        },
        {
          "question": "useMemo 与 useCallback 怎么选？两者的关系用一行代码表达。",
          "answer": "任何值用 useMemo、函数用 useCallback——区别只在缓存值的类型。关系：useCallback(fn, deps) 等价于 useMemo(() => fn, deps)。官方口径：两者做的几乎是同一件事，用哪个看偏好；但区别是绝佳面试题、务必说得出。"
        },
        {
          "question": "有了 React Compiler 自动记忆化，为什么官方说手动记忆化知识仍必修？三条理由？",
          "answer": "① 懂手动记忆化才懂 Compiler 在引擎盖下做什么；② 现有代码库里几乎必然撞见手动记忆化（React.memo/useMemo/useCallback）；③ 个别场景需要比自动行为更精细的控制——比如确保某个 useEffect 依赖被记忆化、不无谓变化触发 effect。另有总警语：过早优化是万恶之源——先 Profiler 测量，确实需要才出手。"
        }
      ],
      "optional": [],
      "note": "正文的 Profiler 参考页、React Developer Tools 教程页、memo 参考页均核验出官方中文版（zh-hans.react.dev，资料区）；Assignment 五条中 useRef 参考页、「使用 ref 操作 DOM」、React Compiler 文档三页有官方中文版（资料区），Kent C. Dodds 与 Dan Abramov（overreacted.io）两文无中文版按 C 类。react-examples 仓库链接为跨课合并条目（归属「状态简介」课）不重复登记。React Developer Tools 教程页与阶段 1 登记的 Chrome 商店页是不同资源（react.dev 教程 vs 商店列项）各自登记。官方「不应该改 textContent」反例的告诫已如实转达。",
      "why": "这一课是 World 5 概念层的最后一块硬骨头，也是面试与真实项目双重高频区：useRef 补上「React 里怎么碰 DOM」的答案（表单聚焦、滚动定位、测量、动画——全在工作里等你）；useMemo/useCallback/memo 三件套加上引用相等检查，是读懂任何中大型 React 代码库的通行证——上一课 Context 的性能代价（所有消费者全重渲染）正是靠它们缓解。React Compiler 一节还教你一个工程视角：工具会进化，但机制知识不过时。官方那句「只有确实需要时才用」请抄在优化代码的开头。",
      "sections": [
        {
          "h": "useRef：渲染不需要的值",
          "p": [
            "vanilla JS 里的 DOM 操作在声明式的 React 里还能做吗？**useRef** 就是答案的一半：它管理**渲染不需要**的值——想让组件「记住」某些信息、但**不想触发新渲染**时，它是 state 的替代品。",
            "常见用途：**命令式动作**与**访问 DOM 里渲染出的特定元素**。ref 还在组件整个生命周期里**持久**保存值——重渲染不会销毁它。想存跨生命周期持久、又不进 state 的值——正是它。"
          ]
        },
        {
          "h": "DOM 操作与 useState 分界",
          "p": [
            "官方示例（页面加载即聚焦按钮）四步：useRef(null) 返回带 **current** 属性的对象（初值即参数，后续渲染忽略——与 useState 初始值同款语义）；按钮挂 ref={buttonRef} **建立连接**；useEffect(() => { buttonRef.current.focus(); }, []) 挂载时执行。为什么初值 null 却有 focus：**渲染与屏幕绘制先于 effect 执行**——连接早已建立。",
            "useRef 不止 focus：滚动到位置、量尺寸、触发动画——**vanilla JS 做过的 DOM 操作基本都能做**。官方反例（明说不应该做）：effect 里改 current.textContent 两秒后改回——有趣之处：**绝不触发重渲染**。",
            "为什么不用 querySelector：自己动手操作 DOM 违背用 React 的本意——能交给 React 就让它自己 **commit**。与 useState 分界：**ref 可变引用、更新不触发渲染；state 不可变、更新触发渲染**。"
          ]
        },
        {
          "h": "useMemo：缓存任何值",
          "p": [
            "官方先立规矩：所有示例建议用 **Profiler** 测量（react 模块的 Profiler 组件，或 React Developer Tools 里更交互式的 Profiler）；有时根本不用优化——本来就够快。名言压阵：**「过早优化是万恶之源」——Knuth《计算机程序设计艺术》**。",
            "useMemo 给组件加**记忆化**：缓存函数调用结果、之后不重算直接用——**只在依赖变化时重算**；参数与 useEffect 同款：calculateValue 回调 + dependencies 数组。",
            "昂贵计算场景（Shopping Cart 总价）：products.reduce(...) 直接写在渲染里 → 每次渲染从头算；用户加了几十万件？卡。频繁开关购物车抽屉？每次开都重算同一个值。useMemo 版：const totalPrice = useMemo(() => products.reduce(...), [products])——挂载跑回调，之后**只在 products 变时**重跑，否则返回缓存。"
          ]
        },
        {
          "h": "引用相等与 memo：缓存还不够",
          "p": [
            "官方第二示例（react-examples 仓库 memoization/ 目录有交互版）：ButtonComponent 内含双层一万次循环（模拟昂贵渲染）；Counter 把 handleClick 经 onClick prop 传下去。问题链：组件在 state 或 props 变化时渲染；渲染时不受 React 控制的东西（函数、变量）销毁重建——**handleClick 每次都是新函数**、onClick prop 每次都是新引用。",
            "useMemo(() => handleClick, []) 缓存函数引用（或双层箭头 useMemo(() => () => setCount(...), [])）。**但父组件 state 一变，子组件照样跟着重渲染**（父渲染则子渲染）——解法是 **memo** 包裹函数：const ButtonComponent = memo((...) => {...})——**props 未变时跳过重渲染**（哪怕父组件重渲染）。",
            "两种场景对照（可实测）：裸 handleClick + memo → **仍重渲染**（引用相等检查失败）；memoizedHandleClick + memo → **不重渲染**（检查通过）。原理适用于一切 props 值；Context 常见搭档：const value = useMemo(() => ({ someState, someFunction }), [someState, someFunction])。"
          ]
        },
        {
          "h": "useCallback：函数专用记忆化",
          "p": [
            "useCallback **只缓存函数**（useMemo 能缓存任何值）：const handleClick = useCallback(() => setCount(prev => prev + 1), [])——一步到位，不用 useMemo(() => fn, []) 的套娃写法；缓存既有函数：useCallback(handleClick, [])。",
            "与 useMemo 的全部区别 = **缓存值的类型**：任何值用 useMemo、函数用 useCallback。官方口径：两者几乎同一件事、微小差别——用哪个看偏好。"
          ]
        },
        {
          "h": "React Compiler 与官方结语",
          "p": [
            "**React Compiler**：较新的**构建期工具**——分析代码、自动记忆化合适的组件与 hook，主攻更新性能（既有组件的重渲染）。多数场景**不再需要手动记忆化**。",
            "那还学 React.memo / useMemo / useCallback 吗？官方：要——① 懂手动记忆化才懂 Compiler 引擎盖下做什么；② 现有代码库几乎必然撞见手动记忆化；③ 个别场景要更精细的控制（如确保 useEffect 依赖被记忆化、不无谓触发 effect）。",
            "官方结语：refs 与记忆化难啃、练习自会理解；自动记忆化能不写代码就优化；手动记忆化**只有确实需要时才出手**；这些主题是绝佳面试题——**useMemo 与 useCallback 的区别务必说得出**。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "jsx",
          "code": "// useRef DOM 操作：挂载即聚焦（官方四步）\nimport { useRef, useEffect } from \"react\";\n\nfunction ButtonComponent() {\n  const buttonRef = useRef(null); // { current: null }——初值后续渲染忽略\n\n  useEffect(() => {\n    buttonRef.current.focus(); // 渲染与绘制先于 effect——连接已建立\n  }, []);\n\n  return <button ref={buttonRef}>Click Me!</button>; // ref 属性建立连接\n}",
          "note": "改 ref.current 永不触发重渲染。滚动/测量/动画同理——但官方口径：非破坏性操作为限，能让 React commit 的别自己动手。"
        },
        {
          "lang": "jsx",
          "code": "// useMemo + memo：昂贵计算缓存 + 子组件跳过重渲染\nimport { useState, useMemo, memo } from \"react\";\n\nconst ButtonComponent = memo(({ children, onClick }) => {\n  // 内含昂贵渲染（官方示例：双层一万次循环）\n  return <button type=\"button\" onClick={onClick}>{children}</button>;\n}); // memo：props 未变跳过重渲染（引用相等检查）\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  // 缓存函数引用——裸 handleClick 每次渲染都是新函数、memo 白包\n  const handleClick = useCallback(\n    () => setCount((prevState) => prevState + 1),\n    []\n  ); // ≡ useMemo(() => () => setCount(...), [])\n\n  return (\n    <div>\n      <h1>{count}</h1>\n      <ButtonComponent onClick={handleClick}>Click me!</ButtonComponent>\n    </div>\n  );\n}",
          "note": "官方对照实验：裸函数 + memo 仍重渲染；缓存引用 + memo 才跳过。Cart 总价场景：useMemo(() => products.reduce(...), [products])。"
        }
      ],
      "pitfalls": [
        {
          "title": "不测量就优化",
          "text": "官方警语：过早优化是万恶之源。先用 Profiler（组件或 DevTools 面板）测出真瓶颈——很多时候本来就够快，包一堆 useMemo 只增加复杂度。"
        },
        {
          "title": "只 memo 组件不缓存回调",
          "text": "父组件每次渲染重建函数 prop → 引用相等检查失败 → memo 包裹形同虚设。memo(子组件) 必须配 useCallback/useMemo 缓存传下去的函数与对象——两件套缺一白搭。"
        },
        {
          "title": "用 ref 做破坏性 DOM 操作",
          "text": "官方反例明说「不应该」：改 textContent 一类破坏性操作只是演示 ref 不触发重渲染的机制。正途：非破坏性操作（focus/滚动/测量）；渲染内容永远交给 state 与 JSX。"
        }
      ],
      "official": {
        "assignment": [
          "读 Kent C. Dodds 的 When to useMemo and useCallback（资料区）：更多「什么时候该用、什么时候不值得用」的例子",
          "本课只学了 useRef 的基础实现——读 React 文档 useRef 参考页（官方中文版在资料区）：更多用例、以及为什么要谨慎用这个 hook",
          "深入安全访问与修改 DOM 节点：读 React 文档「使用 ref 操作 DOM」（官方中文版在资料区）",
          "useRef 在 DOM 操作之外的用武之地：读 Dan Abramov 的名文 Making setInterval Declarative with React Hooks（overreacted.io，资料区）",
          "通读 React Compiler 文档（官方中文版在资料区）：多了解它、看看怎么在项目里安装配置"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/more_react_concepts/refs_and_memoization.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "02f9c83b208d1d95d9a69178243384eae77c58d75ad597ceb618f4a365f2d7ae",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "node-path-react-conclusion",
      "title": "Conclusion",
      "zh": "结语",
      "group": 7,
      "url": "https://www.theodinproject.com/lessons/node-path-react-conclusion",
      "summary": "React 课程结语（祝贺信 + 下一步指引）。官方祝贺：React 已被征服——你现在正式是 React 行家；带着 React 进工具箱，复杂项目也有底气。但学习不止于此（成长型思维）：下一步可学 React 元框架（metaframeworks——建在 React 之上、用满 server components 等最新特性、路由与取数一等公民支持），完成 Databases 与 Node.js 课程正是深入的地基；跟进 React 未来可关注 React RFC 仓库（新特性在此提案、讨论、接受或拒绝）与 React 官方博客；到了学设计模式与架构的时候——patterns.dev 是值得收藏的资源。后端一节点明现状：纯客户端应用刷新即忘（Local Storage 只存本机、换设备就丢）——真正的持久化、用户认证都要真后端，下一门 Databases 课程开讲。官方邀请：课程改进想法可去 Discord 或 curriculum 仓库开 issue。Assignment 仅一条：填写 React 课程反馈表（行政表单）。",
      "guide": "以下是官方原课的中文化梳理（结语课：祝贺信 + 下一步指引）。**祝贺**：🎉 React 已被征服——你正式是 React 行家了。花点时间欣赏自己一路学到的东西、给自己鼓掌：带着 React 进工具箱，你有充分装备去自信地对付复杂项目。但官方话锋一转：React 学习（或者说一切学习）不会停在这里——作为成长型思维的拥护者，官方相信还有太多可探索可学。**下一步（What's next）**：完成 The Odin Project 之后，你可能对 **React 元框架（metaframeworks）**感兴趣——它们建在 React 之上，让开发者用满 React 最新特性（如 server components），并对路由、数据获取等提供一等公民支持。完成 **Databases 课程**与 **Node.js 课程**会给你深入这些内容的完美地基。跟进 React 未来的两个官方渠道：**React RFC GitHub 仓库**——新特性与变更在此提案、讨论、最终接受或拒绝；**React 官方博客**——保持对最新特性的跟进。另外，你已到了可以开始学**设计模式与架构**的阶段：**patterns.dev** 是借力强大模式建更好 React 应用的绝佳资源——值得收藏。**用后端（Using a backend）**：你已经能让应用做很多很酷的事——只靠客户端 JavaScript。但拼图还缺重要一块：不用 Local Storage 的话，页面一刷新应用就「忘掉」用户偏好与一切改动。而 Local Storage 虽好却不理想：数据只存在用户当前访问用的那台电脑上——同一用户换设备访问，应用什么都不记得。要「记住」，你需要**真后端**——下一门 **Databases 课程**就讲这个。有了后端，应用能加上用户认证、数据持久化等一大堆酷功能。官方收尾：你已经走了很远，应该为走到这里的自己骄傲。**贡献（Contribute）**：The Odin Project 因贡献者分享宝贵时间与资源而存在——官方乐意听到你改进 React 课程的想法与建议：去 Discord 分享，或更好的方式——在 TOP curriculum 仓库开 issue。祝好运、学习快乐！**Assignment 仅一条**：进入下一章节前填写 React 课程反馈表（很短）——帮助官方改进本章节与整个课程（行政表单，本站按既有口径不登记资料、不接链）。",
      "understand": [
        "课程收官事实：React 课程 25 课全部走完——组件/状态/副作用/路由/测试/Context/reducer/记忆化全装备就位",
        "下一步方向①：**React 元框架**（建在 React 上、server components、路由与取数一等公民）——地基是 Databases 与 Node.js 两门课程",
        "下一步方向②：跟进 React 演进的官方渠道——**React RFC 仓库**（提案/讨论/接受或拒绝）与 **React 官方博客**",
        "下一步方向③：设计模式与架构——**patterns.dev** 值得收藏",
        "后端的必要性：Local Storage 只存本机、刷新即忘、换设备全丢——**用户认证与数据持久化需要真后端**，下一门课是 Databases",
        "官方邀请改进课程：Discord 分享想法或去 curriculum 仓库开 issue",
        "Assignment 仅一条：填写课程反馈表（行政表单）"
      ],
      "terms": [
        {
          "en": "Metaframework",
          "zh": "元框架：建在 React 之上的框架（如 Next.js 一族）——server components、路由与数据获取一等公民支持"
        },
        {
          "en": "RFC (Request for Comments)",
          "zh": "征求意见稿：React 新特性的提案-讨论-决议流程住在 reactjs/rfcs 仓库"
        },
        {
          "en": "Server components",
          "zh": "服务器组件：React 新特性——组件在服务器渲染、客户端零 JS 负担（元框架阶段的主题）"
        }
      ],
      "tasks": [
        "给自己列一张 React 装备清单：组件/JSX/props/state/effect/路由/测试/Context/reducer/ref/记忆化——每项写一句「什么场景用它」，检验课程收官成色",
        "浏览官方给的三个下一步渠道各十分钟：reactjs/rfcs 仓库看一个进行中的提案、react.dev/blog 读最新一篇、patterns.dev 看一个模式条目（均在资料区）",
        "把 Shopping Cart 与 Memory Card 两个项目链接整理进作品集页面——官方说「你已装备好对付复杂项目」，让证据可见",
        "预览下一门课：打开 Databases 课程页看章节结构——知道「真后端」要学什么",
        "官方 Assignment：填写 React 课程反馈表（很短）——你对课程的意见会帮官方改进（反馈表为行政表单，本站资料区不登记）"
      ],
      "quiz": [
        {
          "question": "官方给的「React 之后」三个学习方向是什么？各自解决什么？",
          "answer": "① React 元框架（先修 Databases 与 Node.js 课程打地基）——用满 server components 等最新特性、路由与取数一等公民；② 跟进 React 演进——RFC 仓库看提案流程、官方博客看新特性；③ 设计模式与架构——patterns.dev 建更好的应用。"
        },
        {
          "question": "为什么 Local Storage 不足以让应用「记住」用户？真后端带来哪两类功能？",
          "answer": "Local Storage 只把数据存在用户当前访问的那台电脑上——同一用户换设备访问，应用什么都不记得；且刷新前未写入即丢。真后端带来用户认证与数据持久化（跨设备、跨会话）等一大类功能——下一门 Databases 课程开讲。"
        },
        {
          "question": "想影响 React 本身的未来，官方渠道是什么？想改进 TOP 的 React 课程呢？",
          "answer": "React 本身：reactjs/rfcs 仓库——新特性在此提案、讨论、接受或拒绝；另可订阅 react.dev/blog。TOP 课程：Discord 分享想法，或更好的方式——在 TheOdinProject/curriculum 仓库开 issue。"
        }
      ],
      "optional": [],
      "note": "官方 Assignment 仅一条课程反馈 Google 表单——按行政表单口径剔除不登记（Grid 批次 sign-up-form 反馈表先例），任务映射显式空映射。正文四个可登记外链（React RFC 仓库 / react.dev 博客 / patterns.dev / smashingmagazine Local Storage 老文）登记资料区；TOP 自有课页回链（Databases 与 Node.js 课程页 ×3）按口径剔除。官方文件为 conclusion/ 目录双路径文件之一——**取用已核对**：线上课页 edit 链接指向 conclusion_full_stack_javascript.md（conclusion_ruby_on_rails.md 属 Ruby 路径不取用），SOURCES.md 登记在案。smashingmagazine 老文官方原链接（http coding. 子域 + 连字符日期形态）实测 404、https 形态 301 到 www 子域现役路径——按现役地址登记、迁移事实记入条目。",
      "why": "结语课不给新知识，给的是坐标系：你从哪里来（Foundations 一路到 React 全家桶）、现在站在哪（客户端应用已能独立交付）、往哪里去（元框架与后端）。World 5 就此收组——Full Stack JavaScript 路径的前端半场完整落幕；下一门 Databases 课程开始补后端半场。官方那句「你已走了很远」不是客套：25 课、四门 Project、一套测试与状态管理装备——值得给自己鼓掌，然后继续走。",
      "sections": [
        {
          "h": "祝贺与成长型思维",
          "p": [
            "🎉 **React 已被征服**——你正式是 React 行家。花点时间欣赏自己一路学到的东西、给自己鼓掌：带着 React 进工具箱，你有充分装备去自信地对付复杂项目。",
            "但 React 学习（一切学习）不会停在这里——作为成长型思维的拥护者，官方相信还有太多可探索可学。"
          ]
        },
        {
          "h": "下一步：元框架、RFC 与设计模式",
          "p": [
            "完成 The Odin Project 之后，你可能对 **React 元框架**感兴趣：建在 React 之上、让开发者用满最新特性（如 **server components**）、对路由与数据获取提供一等公民支持。完成 **Databases** 与 **Node.js** 课程是深入这些的完美地基。",
            "跟进 React 未来的两个渠道：**React RFC GitHub 仓库**（新特性与变更在此提案、讨论、接受或拒绝）与 **React 官方博客**（最新特性动态）。",
            "你已到了可以开始学**设计模式与架构**的阶段：**patterns.dev** 是借力强大模式建更好 React 应用的绝佳资源——值得收藏。"
          ]
        },
        {
          "h": "为什么需要真后端",
          "p": [
            "只靠客户端 JavaScript，你的应用已经能做很多酷事——但拼图缺一块：不用 **Local Storage** 的话，页面一刷新，应用就「忘掉」用户偏好与一切改动。",
            "Local Storage 虽好却不理想：数据只存在用户当前访问的那台电脑——同一用户换设备访问，应用什么都不记得。要跨设备「记住」，你需要**真后端**——下一门 **Databases 课程**开讲。有了后端：用户认证、数据持久化等一大堆酷功能都能加上。",
            "官方收尾：你已经走了很远——应该为走到这里的自己骄傲。"
          ]
        },
        {
          "h": "贡献邀请与 Assignment",
          "p": [
            "The Odin Project 因贡献者分享时间与资源而存在：课程改进想法可去 Discord 分享，或更好——在 **TOP curriculum 仓库开 issue**。祝好运、学习快乐！",
            "**Assignment 仅一条**：进入下一章节前填写 React 课程反馈表（很短）——帮助官方改进本章节与整个课程（行政表单，本站按口径不登记不接链）。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "以为 Local Storage 是持久化方案",
          "text": "它只存当前设备当前浏览器——换设备、清缓存即全丢。用户偏好可以放；跨设备的数据与认证必须真后端（Databases 课程的主题）。"
        },
        {
          "title": "以为「学完 React」等于「前端学完了」",
          "text": "官方原话精神：学习不会停在这里。客户端 React 给了你交付完整前端应用的能力，但元框架（server components、文件路由）、真后端（Databases 与 Node.js 课程）、设计模式与架构（patterns.dev）都在后面。把「React 行家」当成终点，会在第一次遇到 SSR、认证、数据库需求时发现自己缺半边地图——官方给的三个下一步渠道各逛十分钟，比原地刷第十遍教程值钱。"
        }
      ],
      "official": {
        "assignment": [
          "进入下一章节前，填写这份很短的 React 课程反馈表——你的输入与体验帮助官方改进本章节与整个课程（行政表单，链接不收录）"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 react/conclusion/conclusion_full_stack_javascript.md（本站自行编写简体讲解，未改编自任何第三方中文课程；conclusion/ 目录双路径文件，取用经线上课页 edit 链接核对）",
        "sha256": "73d3157413aaf677fe1b9631b652f6100e6fd637267d8a27be543c44481cbdd2",
        "verifiedAt": "2026-09-28"
      }
    }
  ]
};
