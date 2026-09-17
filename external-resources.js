/* 本课外部资料清单（v3）。
 * 数据来源：重新拉取 19 课官方 curriculum Markdown（指纹与 sources.json 全部一致），
 * 程序化提取正文与 Assignment 中明确要求学习的外部资源，再逐条联网核验。
 * 分类依据 v3 交接 §3.2：
 *   A 类 = 有已核验的官方中文版本，同时给出中文版与英文原文入口；
 *   C 类 = 没有可靠中文版，只提供本站原创中文导读要点 + 英文原文链接，不翻译、不复制原文。
 * 所有条目 handling 一律为 link-only：本站不搬运、不整篇翻译第三方内容。
 * zhGuide 内容只依据官方 Markdown 对该资源的说明与本站已核验事实编写，不臆测第三方页面的具体论点。 */
window.ODIN_RESOURCES = {
  verifiedAt: '2026-09-10',
  method: '重新拉取官方 curriculum raw Markdown 并按 SHA-256 比对指纹（19 课全部未变）→ 程序化提取正文 / Assignment / Knowledge Check 中的外部链接 → 按重定向后的规范化地址去重 → 逐条 curl 核验状态码与重定向目标 → 对中文候选做内容级语言核验（统计正文汉字数，不只看 HTTP 200）→ 视频另用 YouTube oEmbed 公开接口核验可用性与真实标题。',
  policy: {
    handling: 'link-only',
    noTranslation: '本站不整篇翻译或复制任何第三方文章、视频与文档；C 类资源只提供本站原创的中文导读要点与英文原文链接。',
    noProxy: '不使用 iframe、不做代理网页、不注入第三方页面、不编写改动第三方站点的用户脚本。',
    subtitleClaim: '没有可靠证据证明存在中文字幕的视频，一律不声称有中文字幕。',
    fallback: '无法确认版权许可时，默认只做中文摘要 / 导读加原始链接。'
  },
  stats: { total: 84, withZh: 24, guideOnly: 60, verifyLimited: 5 },
  audit: {
    perLesson: {
      'how-this-course-will-work': 2, 'introduction-to-web-development': 5, 'motivation-and-mindset': 6,
      'asking-for-help': 3, 'join-the-odin-community': 7, 'how-does-the-web-work': 9, installations: 6,
      'text-editors': 2, 'command-line-basics': 8, 'setting-up-git': 6, 'introduction-to-git': 5,
      'git-basics': 3, 'introduction-to-html-and-css': 2, 'elements-and-tags': 2, 'html-boilerplate': 2,
      'working-with-text': 3, lists: 2, 'links-and-images': 9, 'commit-messages': 2
    },
    /* 完整性复查记录：初次程序化提取共得到 118 条链接。第一阶段剔除 20 条非第三方学习资料
     * （5 条 TOP 自有课程页、13 条 TOP 官方安装指引、2 条课程演示素材，即 CodePen 演示笔与
     * statically CDN 上的课程配图），得到 98 条第三方候选。第二阶段剔除 8 条噪声
     * （4 条裸站点首页、2 条社交账号、2 条占位符与虚构示例域名 USER-NAME 与 town.com），
     * 并修正 2 条提取时 URL 尾部粘连反引号的瑕疵（shell-lesson-data.zip 与 theodinproject.com/about），
     * 得到 90 条。再按重定向后的规范化地址去重（含跨课合并、YouTube 短链与带参形式归并），
     * 得到 82 条。随后对 19 份官方 Markdown 做了一次全量链接重扫比对，发现课 12 的
     * Vim 维基百科条目因官方使用 Markdown 尖括号自动链接写法且地址含括号而被提取规则截断漏收，
     * 已补入并完成同样的核验，成为 83 条。课 09 的 The Unix Shell 课程主页与其 Download files
     * 小节在规范化去重后本会合并为一条，但官方 Assignment 把 Download files 列为独立一项并给了
     * 独立指示（只需照该节说明做、不必安装软件），因此按官方任务结构保留为两条。合计 84 条。 */
    completenessRecheck: '已对 19 份官方 Markdown 全量重扫链接并与本清单逐条比对；除 Vim 条目（已补入）外无其他遗漏。',
    deliberateSplit: ['command-line-basics: The Unix Shell 主页与 Download files 小节按官方 Assignment 的分项结构保留为两条'],
    verifyLimitedUrls: [
      'https://github.com/join（403，GitHub 反爬拦截，重定向到 github.com/signup）',
      'https://codepen.io（403，站点反爬拦截）',
      'https://validator.w3.org/#validate_by_input（403，W3C 校验服务拦截非浏览器请求）',
      'https://support.freepik.com/s/article/Attribution-How-when-and-where?language=en_US（403，且跨域重定向到 magnific.com，主题已不完全对应）',
      'https://web.archive.org/web/20250918082145/https://old.codinginflow.com/google-programming-questions（自动核验未取得响应）'
    ],
    verifyLimitedNote: '以上 5 条无法用命令行自动确认可达性，均已在对应条目的 note 字段中如实记录，未声称为“已验证可访问”。它们的地址都直接取自官方 Markdown 原文，本站未做替换。'
  },
  resources: [
  /* ===== 01 How This Course Will Work ===== */
  {
    lessonId: 'how-this-course-will-work',
    title: 'About The Odin Project',
    titleZh: 'TOP 的 About 页面',
    type: '官方页面',
    requirement: 'required',
    zone: 'Assignment 第 1 条',
    originalUrl: 'https://www.theodinproject.com/about',
    sourceDomain: 'theodinproject.com',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第一条就是读 About 页面，用来了解这门课是谁做的、为什么免费、按什么理念编排。',
      points: [
        '本页第 1 课官方正文已给出核心定位：TOP 是一个开源社区，目标是聚合互联网上最好的信息源，把学习者从零带到全栈开发者。',
        'About 页面会展开这个定位的来历与维护方式，属于“了解你正在用的东西”的背景阅读，不含技术操作。'
      ],
      terms: ['open source（开源）', 'curriculum（课程体系）', 'full-stack（全栈）'],
      focus: '看它怎样描述课程理念与维护方式，不必逐字精读。',
      takeaway: '能说出 TOP 是什么、为什么免费、由谁维护。'
    },
    license: 'TOP 站点内容采用 CC BY-NC-SA 4.0（与本站同源许可）。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'how-this-course-will-work',
    title: 'Frequently Asked Questions',
    titleZh: 'TOP 常见问题（FAQ）',
    type: '官方页面',
    requirement: 'required',
    zone: 'Assignment 第 2 条',
    originalUrl: 'https://www.theodinproject.com/faq',
    sourceDomain: 'theodinproject.com',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第二条要求浏览 FAQ，它集中回答了初学者最常问的课程使用问题。',
      points: [
        '本页第 1 课已讲清课程的硬性规则：不要跳过任何内容，只有 Additional Resources 和明确标注 Optional 的部分可选。',
        'FAQ 通常覆盖进度、时间投入、是否要买设备、能否跳课等常见疑问，遇到同类问题可以先来这里查。'
      ],
      terms: ['FAQ（frequently asked questions，常见问题）'],
      focus: '扫一遍标题，把你当下关心的那几条读完即可，其余以后遇到再回来查。',
      takeaway: '知道遇到问题时除了 Discord，还有一个官方 FAQ 可以先查。'
    },
    license: 'TOP 站点内容采用 CC BY-NC-SA 4.0。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  /* ===== 02 Introduction to Web Development ===== */
  {
    lessonId: 'introduction-to-web-development',
    title: 'Why Learning to Code is So Damn Hard',
    titleZh: '为什么学编程这么难',
    type: '文章',
    requirement: 'required',
    zone: 'Assignment 第 1 条',
    originalUrl: 'https://dev.to/theodinproject/why-learning-to-code-is-so-damn-hard-11nn',
    sourceDomain: 'dev.to',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方说这篇由 TOP 创始人写的文章给出了对前方这段旅程的现实看法，是Assignment 的第一项必读。',
      points: [
        '作者是 The Odin Project 的创始人，官方明确要求读它来建立现实预期。',
        '它与第 3 课 Motivation and Mindset 的主题直接相关：学编程困难且令人沮丧是正常的，关键在于心态与方法。',
        '本站未复制原文内容，具体论点请打开英文原文阅读。'
      ],
      terms: ['learning to code（学编程）', 'mindset（心态）'],
      focus: '读它对你“会遇到什么困难”的描述，对照自己的预期是否现实。',
      takeaway: '对学习曲线的难度有现实预期，不把“难”误解成“我不适合”。'
    },
    license: 'dev.to 上的作者原创文章，许可未在该页明确标注；本站只做链接与原创导读，不翻译、不复制。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'introduction-to-web-development',
    title: 'Command Line Interface (CLI)',
    titleZh: '命令行界面（维基百科）',
    type: '百科条目',
    requirement: 'reference',
    zone: '正文 Tools of the trade 清单',
    originalUrl: 'https://en.wikipedia.org/wiki/Command-line_interface',
    sourceDomain: 'en.wikipedia.org',
    originalUrlStatus: '200',
    zhUrl: 'https://zh.wikipedia.org/zh-cn/%E5%91%BD%E4%BB%A4%E8%A1%8C%E7%95%8C%E9%9D%A2',
    zhType: '原网站官方中文版（同一维基媒体项目，已用 zh-cn variant 强制简体并核验标题为“命令行界面”）',
    zhGuide: {
      why: '官方在“行业工具”清单里链接了它，让你先认识 CLI 是什么；第 9 课会正式动手。',
      points: [
        'CLI 是通过输入文字命令来操作电脑的方式，与图形界面（点鼠标）相对。',
        '中文维基条目“命令行界面”已核验存在且为简体中文，可直接读中文版。'
      ],
      terms: ['Command Line Interface / CLI（命令行界面）', 'terminal（终端）'],
      focus: '只需读开头定义部分，知道它是什么、和图形界面有何不同。',
      takeaway: '认识 CLI 这个术语，为第 9 课做准备。'
    },
    license: '维基百科内容采用 CC BY-SA 4.0；本站只链接，不复制条目内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'introduction-to-web-development',
    title: 'Text Editor',
    titleZh: '文本编辑器（维基百科）',
    type: '百科条目',
    requirement: 'reference',
    zone: '正文 Tools of the trade 清单',
    originalUrl: 'https://en.wikipedia.org/wiki/Text_editor',
    sourceDomain: 'en.wikipedia.org',
    originalUrlStatus: '200',
    zhUrl: 'https://zh.wikipedia.org/zh-cn/Text_editor',
    zhType: '原网站官方中文版（已核验标题为“文本编辑器”，简体中文）',
    zhGuide: {
      why: '官方在工具清单里链接了它；第 8 课会详细讲为什么必须用纯文本编辑器写代码。',
      points: [
        '文本编辑器是编辑纯文本文件的程序，与 Word 这类富文本编辑器不同。',
        '第 8 课官方正文解释了关键差别：纯文本编辑器不保存额外的排版与图形信息，所以其他程序能把文件当代码读取执行。'
      ],
      terms: ['text editor（文本编辑器）', 'plain text（纯文本）'],
      focus: '读定义部分即可，细节留给第 8 课。',
      takeaway: '知道“文本编辑器”指什么，不与办公软件混淆。'
    },
    license: '维基百科内容采用 CC BY-SA 4.0；本站只链接。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'introduction-to-web-development',
    title: 'Contributing to The Odin Project',
    titleZh: '给 TOP 做贡献',
    type: '官方页面',
    requirement: 'reference',
    zone: '正文 Why Odin? 小节',
    originalUrl: 'https://www.theodinproject.com/contributing',
    sourceDomain: 'theodinproject.com',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方建议等你用工具用得顺手之后，开始给开源项目做贡献，并把给 TOP 本身贡献作为例子。',
      points: [
        '官方原话：你贡献得越多，就越清楚自己能做什么，也越接近可被雇佣的状态。',
        '这是课程后期才需要做的事，现在只需知道有这个入口，不必立刻参与。'
      ],
      terms: ['contributing（贡献）', 'open source（开源）'],
      focus: '现阶段只是认识这个入口，不必深入。',
      takeaway: '知道学有余力时可以回馈课程本身。'
    },
    license: 'TOP 站点内容采用 CC BY-NC-SA 4.0。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'introduction-to-web-development',
    title: 'Front-End vs Back-End vs Full Stack Web Developers',
    titleZh: '前端、后端与全栈开发者的区别（Udacity 博客）',
    type: '文章',
    requirement: 'required',
    zone: 'Assignment 第 2 条',
    originalUrl: 'https://www.udacity.com/blog/2020/12/front-end-vs-back-end-vs-full-stack-web-developers.html',
    sourceDomain: 'udacity.com',
    originalUrlStatus: '200（重定向到 Udacity 博客的现役地址）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第二条要求读这篇对比文章，用来巩固前端 / 后端 / 全栈的分工。',
      points: [
        '本课官方正文已给出核心区分：前端是你在浏览器里看到的内容与界面元素，用 HTML、CSS、JavaScript；后端是住在服务器上的“内脏”，负责存储和提供数据，用 Java、Python、Ruby、JavaScript 等；全栈两边都能上手。',
        '官方明确 TOP 教的是全栈开发。',
        '这篇文章是同一主题的第三方补充说明，本站未复制其内容。'
      ],
      terms: ['front end（前端）', 'back end（后端）', 'full stack（全栈）'],
      focus: '对照本课中文讲解的三分法读，看它举的例子是否让你更容易记住。',
      takeaway: '能用自己的话说清三种开发者各自负责什么，并知道 TOP 培养的是全栈。'
    },
    license: 'Udacity 官方博客文章，许可未明确标注；本站只做链接与原创导读。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '原链接重定向到 Udacity 博客的现役路径，内容仍为同一篇对比文章。'
  },
  /* ===== 03 Motivation and Mindset ===== */
  {
    lessonId: 'motivation-and-mindset',
    title: 'CheatGPT: ChatGPT and its potentially negative impacts on core learning',
    titleZh: 'ChatGPT 对核心学习的潜在负面影响（David Humphrey 博客）',
    type: '文章',
    requirement: 'reference',
    zone: '正文 A note on AI code generation 小节',
    originalUrl: 'https://blog.humphd.org/cheatgpt/',
    sourceDomain: 'blog.humphd.org',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方在讲 AI 代码生成时引用了它：作者 David Humphrey 是计算机科学教授，官方说这是一篇关于在教育场景中使用生成式 AI 的陷阱的好文章。',
      points: [
        '官方已在正文列出七条具体风险，包括错过亲手发现原理的机会、延迟“问好问题”这项技能的发展、难以审视 AI 输出、面试可能不允许用 AI 等。',
        '官方这一节的结论只有一句：不推荐把 AI 工具用于你的学习。',
        '这篇文章是官方引用的延伸读物，本站未复制其内容。'
      ],
      terms: ['LLM（大语言模型）', 'generative AI（生成式 AI）', 'core competency（核心能力）'],
      focus: '如果你想理解官方为什么态度这么明确，读它；不读也不影响完成本课任务。',
      takeaway: '理解官方“学习阶段不用 AI”的理由，而不只是记住结论。'
    },
    license: '个人博客文章，许可未明确标注；本站只做链接与原创导读。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'motivation-and-mindset',
    title: 'Becoming a TOP Success Story Mindset',
    titleZh: '怎样成为 TOP 成功案例',
    type: '文章',
    requirement: 'required',
    zone: 'Assignment 第 1 条',
    originalUrl: 'https://dev.to/theodinproject/becoming-a-top-success-story-mindset-3dp2',
    sourceDomain: 'dev.to',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第一条就是看看怎样成为 TOP Success Story，用来在课程开始前调整心态。',
      points: [
        '它与本课主题一致：官方反复强调动机、一致性与避开拖延等八个坑，是能不能走完的关键。',
        '本站未复制原文内容，具体建议请打开英文原文阅读。'
      ],
      terms: ['success story（成功案例）', 'mindset（心态）'],
      focus: '读它对“怎样安排学习”的具体建议，挑一条你现在就能用的。',
      takeaway: '带着一个可执行的心态调整继续往下学。'
    },
    license: 'dev.to 上的 TOP 官方账号文章，许可未明确标注；本站只做链接与原创导读。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'motivation-and-mindset',
    title: 'TOP Discord Success Stories forum',
    titleZh: 'TOP Discord 的成功案例论坛',
    type: '社区板块',
    requirement: 'required',
    zone: 'Assignment 第 2 条（官方写明“加入 Discord 之后”）',
    originalUrl: 'https://discord.com/channels/505093832157691914/1089990025162260570',
    sourceDomain: 'discord.com',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第二条：加入 TOP Discord 之后，去 Success Stories 论坛读读别人的成功经历，给自己的动力加点油。',
      points: [
        '官方写的是“一旦你加入 Discord 之后”，所以这一项是有条件的：还没加入可以等第 5 课带你加入后回来补做。',
        '需要 Discord 账号与登录才能查看，属于需要联网和账号的操作。'
      ],
      terms: ['Discord（社区聊天平台）', 'Success Stories（成功案例）'],
      focus: '读几篇真实经历，重点看他们怎样安排节奏、卡住时怎么办。',
      takeaway: '看到普通人也能走完这条路，给自己一个可参照的预期。'
    },
    license: 'Discord 社区内容，各帖版权归原作者；本站只链接板块入口，不复制帖子内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '需要登录 Discord 才能查看，本站不代为登录。'
  },
  {
    lessonId: 'motivation-and-mindset',
    title: 'Pomodoro Technique',
    titleZh: '番茄工作法（维基百科）',
    type: '百科条目',
    requirement: 'reference',
    zone: '正文 Pitfalls to avoid / Procrastination 小节',
    originalUrl: 'https://en.wikipedia.org/wiki/Pomodoro_Technique',
    sourceDomain: 'en.wikipedia.org',
    originalUrlStatus: '200',
    zhUrl: 'https://zh.wikipedia.org/zh-cn/Pomodoro_Technique',
    zhType: '原网站官方中文版（已核验标题为“番茄工作法”，简体中文）',
    zhGuide: {
      why: '官方把番茄工作法作为对付拖延的首要对策，并给了完整的操作方式。',
      points: [
        '官方正文已写清做法：定 25 分钟计时器专注做一件事，中途分心就重新开始这 25 分钟；成功后休息 5 分钟；完成四个 25 分钟的工作块后休息 15–30 分钟。',
        '中文维基条目“番茄工作法”已核验存在且为简体中文，可对照阅读。'
      ],
      terms: ['Pomodoro Technique（番茄工作法）', 'procrastination（拖延）'],
      focus: '读它的起源与常见变体，看是否需要按自己的情况调整时长。',
      takeaway: '能立刻开始用一个可执行的专注-休息循环。'
    },
    license: '维基百科内容采用 CC BY-SA 4.0；本站只链接。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'motivation-and-mindset',
    title: 'Pomofocus',
    titleZh: 'Pomofocus 在线番茄钟',
    type: '工具',
    requirement: 'optional',
    zone: '正文 Procrastination 小节（官方用语是“如果你想试试”）',
    originalUrl: 'https://pomofocus.io/',
    sourceDomain: 'pomofocus.io',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方说如果你想试番茄工作法，Pomofocus 是一个可定制的番茄钟，桌面和手机浏览器都能用。',
      points: [
        '官方用的是“如果你想试试”，所以它是可选工具，不是必做项。',
        '任何计时工具都可以替代，包括手机自带的计时器。'
      ],
      terms: ['pomodoro timer（番茄钟）'],
      focus: '试用一次 25 分钟专注 + 5 分钟休息，看是否适合自己。',
      takeaway: '有一个真正能用的计时工具，而不只是知道方法。'
    },
    license: '第三方在线工具，与本站无关联；本站只链接，不代为收集任何数据。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'motivation-and-mindset',
    title: 'Taking Breaks Will Boost Productivity',
    titleZh: '休息会提升生产力',
    type: '文章',
    requirement: 'reference',
    zone: '正文 Not taking breaks 小节末尾',
    originalUrl: 'https://simpleprogrammer.com/taking-breaks-will-boost-productivity/',
    sourceDomain: 'simpleprogrammer.com',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方在讲“不休息”这个坑时给了这篇文章作为延伸阅读。',
      points: [
        '官方正文已经给出核心依据：研究显示各种时长的休息之后表现都会提升，从长假到 30 秒的微休息都算；多伦多大学管理学副教授 John Trougakos 说专注力像肌肉，持续使用后会疲劳，需要休息恢复。',
        '官方还列了休息时可以做的事：听音乐、写日记、涂鸦、冥想、玩个小游戏、出门走一小圈。'
      ],
      terms: ['burnout（倦怠）', 'microbreak（微休息）', 'productivity（生产力）'],
      focus: '想进一步了解休息与产出关系时再读；本课要点已在中文讲解里。',
      takeaway: '接受“定期休息是提效手段”而不是偷懒。'
    },
    license: 'Simple Programmer 博客文章，许可未明确标注；本站只做链接与原创导读。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  /* ===== 04 Asking For Help ===== */
  {
    lessonId: 'asking-for-help',
    title: "Don't ask to ask, just ask",
    titleZh: '别问能不能问，直接问',
    type: '文章',
    requirement: 'required',
    zone: 'Assignment 第 1 条',
    originalUrl: 'https://dontasktoask.com/',
    sourceDomain: 'dontasktoask.com',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第一条：它说明了“直接问出你的问题，而不要先问‘我可以问个问题吗’”的重要性。',
      points: [
        '第 5 课官方正文再次强调这条原则，说它虽然简单，却能让你更快得到答案，也让别人更自在地愿意帮你。',
        '核心道理：先问“能不能问”会多一轮无信息的来回，而且没人能在看到你真正的问题之前判断能不能帮。',
        '本站核验过该站点的 index.zh-cn 路径：返回内容与英文首页完全相同（正文汉字数为 0），因此不作为中文版提供。'
      ],
      terms: ['ask to ask（问能不能问）', 'context（上下文）'],
      focus: '文章很短，读完记住一条：把问题连同上下文一次性发出来。',
      takeaway: '提问时不再多一轮“在吗 / 可以问个问题吗”。'
    },
    license: '站点内容许可未明确标注；本站只做链接与原创导读，不翻译全文。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '已核验 dontasktoask.com/index.zh-cn 与 zh.dontasktoask.com：前者返回与英文首页相同的 8242 字节内容、汉字数 0，后者返回空响应，故判定无可用官方中文版。'
  },
  {
    lessonId: 'asking-for-help',
    title: 'How to Ask Technical Questions',
    titleZh: '怎样提技术问题（TOP 官方社区指南）',
    type: '官方指南',
    requirement: 'required',
    zone: 'Assignment 第 3 条',
    originalUrl: 'https://www.theodinproject.com/guides/community/how_to_ask',
    sourceDomain: 'theodinproject.com',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第三条要求阅读并收藏这份社区指南，说它是你需要求助时随时可查的好参考。',
      points: [
        '官方说在思考文中列出的那些要点时，你可能会自己就把问题解决了。',
        '本课官方 Knowledge Check 的第二题“你的提问应该包含哪 5 样东西”直接指向这份指南，答案以指南列出的内容为准。',
        '第 5 课官方正文列出的提问五项上下文可作对照：你认为问题是什么、你究竟希望发生什么、实际发生的是什么、你是怎么走到这一步的、到目前为止你试过什么。'
      ],
      terms: ['technical question（技术问题）', 'context（上下文）', 'reproduce（重现）'],
      focus: '重点读它列出的提问要素清单，收藏起来以后每次提问前对照。',
      takeaway: '有一份自己的提问检查清单，能答出官方 KC 的“5 样东西”。'
    },
    license: 'TOP 官方指南，采用 CC BY-NC-SA 4.0；本站只做链接与原创要点提示，不复制指南全文。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'asking-for-help',
    title: 'The XY Problem',
    titleZh: 'XY 问题',
    type: '文章',
    requirement: 'required',
    zone: 'Assignment 第 2 条',
    originalUrl: 'https://xyproblem.info/',
    sourceDomain: 'xyproblem.info',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第二条要求读它，说这是新手和有经验的程序员在提问时都会掉进去的常见陷阱。',
      points: [
        '本课官方 Knowledge Check 第一题就是“什么是 XY Problem”，并直接指向这个站点，权威说明以该页为准。',
        '它对应的现实情形是：你真正要解决的是 X，却把自己猜的解决路径 Y 当成问题去问，于是别人在帮你处理 Y，而 X 从没被说清楚。',
        '这也解释了本课“问手头的问题，不要问解法本身”那条建议背后的道理。'
      ],
      terms: ['XY Problem（XY 问题）', 'root problem（根本问题）'],
      focus: '页面很短，读完能识别自己是不是在问 Y。',
      takeaway: '提问时先说出真正想达成的目标 X，再讲你试过的路径 Y。'
    },
    license: '站点内容许可未明确标注；本站只做链接与原创导读，不翻译全文。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  /* ===== 05 Join the Odin Community ===== */
  {
    lessonId: 'join-the-odin-community',
    title: 'CodePen',
    titleZh: 'CodePen（在线代码演练场）',
    type: '工具',
    requirement: 'reference',
    zone: '正文 Asking for help 小节',
    originalUrl: 'https://codepen.io',
    sourceDomain: 'codepen.io',
    originalUrlStatus: '403（自动化请求被站点拒绝）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方建议在提问时，把项目推到 GitHub 或用合适的在线 REPL（例如 CodePen）分享对应代码，让别人能翻查和调试。',
      points: [
        '官方反复强调：截图只适合展示命令输出、错误消息和页面外观，必须同时提供包含错误的代码文件。',
        '第 5 课的助人准则第 7 条也要求：如果问题需要活代码才能理解或调试，请对方用合适的在线 REPL 提供；问题难以隔离时，应当用隔离的代码重现问题。',
        'CodePen 需要联网使用，部分功能需要注册账号。'
      ],
      terms: ['REPL（read-eval-print loop，在线即时运行环境）', 'snippet（代码片段）'],
      focus: '知道它是“把一小段前端代码分享出去让别人能跑”的工具即可，本课不需要真的用它。',
      takeaway: '提问时除了截图，还能给出可运行的代码链接。'
    },
    license: '第三方在线服务，与本站无关联；本站只链接首页。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '自动化核验返回 HTTP 403（站点反爬机制拒绝非浏览器请求），不等于链接失效；该地址为官方原文所列，请在浏览器中打开确认。'
  },
  {
    lessonId: 'join-the-odin-community',
    title: 'TOP Discord server invite',
    titleZh: 'TOP Discord 服务器邀请链接',
    type: '操作入口',
    requirement: 'required',
    zone: 'Assignment 第 2 条',
    originalUrl: 'https://discord.gg/fbFCkYabZB',
    sourceDomain: 'discord.gg',
    originalUrlStatus: '200（重定向到 discord.com/invite/...）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第二条要求登录 TOP 的 Discord 服务器，进去打个招呼并开始探索。',
      points: [
        '官方说他们建了一个 introductions 自我介绍聊天室，是介绍自己的好地方；课程覆盖的每个开发主题都有对应聊天室。',
        '参与前官方要求先在左侧边栏 TOP META 下读 rules 和 faq。',
        '本课官方 Knowledge Check 第一题就是“怎样加入 TOP 的 Discord 服务器”。'
      ],
      terms: ['Discord server（Discord 服务器）', 'introductions（自我介绍频道）', 'rules / faq（规则与常见问题）'],
      focus: '按官方顺序做：加入 → 打招呼 → 读 rules 与 faq → 先观察再参与。',
      takeaway: '成为社区成员，卡住时有一个可以求助的地方。'
    },
    license: 'Discord 邀请链接由 TOP 官方提供；本站不代为注册或登录。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '需要 Discord 账号与登录后才能进入。'
  },
  {
    lessonId: 'join-the-odin-community',
    title: 'Rubber duck debugging',
    titleZh: '橡皮鸭调试法（维基百科）',
    type: '百科条目',
    requirement: 'reference',
    zone: '正文 Before asking for help 小节',
    originalUrl: 'https://en.wikipedia.org/wiki/Rubber_duck_debugging',
    sourceDomain: 'en.wikipedia.org',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方建议觉得卡住时先停下来喘口气，把问题拆成小块并判断到底是什么在阻碍你，并把这个技巧称为 rubber duck debugging。',
      points: [
        '方法本身很朴素：把你要做的事一行一行讲出来（对着一只橡皮鸭也可以），讲述过程常常自己就暴露了问题所在。',
        '本站核验过中文维基百科：不存在“橡皮鸭调试法”条目（返回 404），因此不提供中文链接，避免给出错误地址。',
        '本课中文讲解已说明它在求助流程中的位置：先拆解、再搜索、再回看旧课，都无解才去社区提问。'
      ],
      terms: ['rubber duck debugging（橡皮鸭调试法）'],
      focus: '知道这个技巧的名字与做法即可，条目细节可选读。',
      takeaway: '卡住时先自己把问题讲一遍，而不是立刻提问或立刻放弃。'
    },
    license: '维基百科内容采用 CC BY-SA 4.0；本站只链接。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '已核验 zh.wikipedia.org/wiki/橡皮鸭调试法 返回 404，中文维基无对应条目，故 zhUrl 为空。'
  },
  {
    lessonId: 'join-the-odin-community',
    title: 'Create a free GitHub account',
    titleZh: '创建免费 GitHub 账号',
    type: '操作入口',
    requirement: 'required',
    zone: 'Assignment 第 1 条',
    originalUrl: 'https://github.com/join',
    sourceDomain: 'github.com',
    originalUrlStatus: '403（自动化请求被站点拒绝）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第一条就是创建免费的 GitHub 账号，并说你会发现 GitHub 是开发工作流中不可或缺的一部分。',
      points: [
        'GitHub 是一个让你用 Git 上传、托管和管理代码的服务，并提供网页界面；它与 Git 不是同一个东西，也不是同一家公司创建的。',
        '第 10 课会用到这个账号：配置邮箱隐私、添加 SSH 公钥；第 12 课会在上面创建练习仓库 git_test。',
        '注册需要邮箱；第 10 课官方建议在意隐私时勾选 Email Settings 里的两个复选框，并记下 GitHub 私有邮箱地址。'
      ],
      terms: ['GitHub（代码托管平台）', 'account（账号）', 'repository（仓库）'],
      focus: '按页面步骤注册即可，不要在此课急着配置 Git，那是第 10 课的事。',
      takeaway: '拥有一个可用的 GitHub 账号，为后续 Git 课程做好准备。'
    },
    license: 'GitHub 注册页面；本站不代为注册，不收集任何账号信息。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '自动化核验返回 HTTP 403（GitHub 对非浏览器请求的反爬拦截），重定向目标为 github.com/signup；链接本身有效，请在浏览器中打开。'
  },
  {
    lessonId: 'join-the-odin-community',
    title: 'How to be great at asking coding questions',
    titleZh: '怎样提出好的编程问题（Gordon Zhu）',
    type: '文章',
    requirement: 'reference',
    zone: '正文助人准则第 6 条（机器人命令 /question 指向它）',
    originalUrl: 'https://medium.com/@gordon_zhu/how-to-be-great-at-asking-questions-e37be04d0603',
    sourceDomain: 'medium.com',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方在助人准则第 6 条里把它作为标准参考：如果问题看起来混乱或含糊，帮助者会礼貌地把提问者指向机器人命令 /question，而它链接的就是这篇文章。',
      points: [
        '它与第 4 课的三条提问原则同源：给足上下文、问手头的问题而不是索要解法、别把索要上下文当成刁难。',
        'Medium 可能需要登录或有阅读次数限制，属于第三方平台的访问条件，与本站无关。'
      ],
      terms: ['question（提问）', 'context（上下文）'],
      focus: '想把提问能力系统化时再读；本课与第 4 课的中文讲解已覆盖核心做法。',
      takeaway: '理解社区为什么反复强调提问格式。'
    },
    license: 'Medium 上的作者原创文章，版权归原作者；本站只做链接与原创导读。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'join-the-odin-community',
    title: 'Using Search on Discord',
    titleZh: 'Discord 搜索功能使用说明',
    type: '文档',
    requirement: 'reference',
    zone: '正文 Asking for help 小节',
    originalUrl: 'https://support.discordapp.com/hc/en-us/articles/115000468588-Using-Search',
    sourceDomain: 'support.discordapp.com',
    originalUrlStatus: '200（重定向到 support.discord.com 的现役地址）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方说有时候可能没有人能帮你处理问题，那正是熟悉 Discord 搜索功能的理想时机。',
      points: [
        '官方给的做法：搜索具体的关键词或错误消息，看看之前有没有人遇到过类似问题，以及他们是怎么解决的。',
        '本站核验过 Discord 帮助中心的 zh-cn 路径：会重定向回 en-us 英文版，因此不提供中文链接。'
      ],
      terms: ['search（搜索）', 'error message（错误消息）', 'keyword（关键词）'],
      focus: '学会用错误消息原文当关键词搜索，这是命中率最高的方式。',
      takeaway: '社区没人回应时，还有一条自助路径可走。'
    },
    license: 'Discord 官方帮助中心文档；本站只做链接与原创导读。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '已核验 zh-cn 候选地址：HTTP 200 但重定向回 support.discord.com/hc/en-us/…，即无官方中文版，故 zhUrl 为空。'
  },
  {
    lessonId: 'join-the-odin-community',
    title: 'How to use a search engine to solve your programming questions',
    titleZh: '怎样用搜索引擎解决编程问题（Internet Archive 存档）',
    type: '文章（存档）',
    requirement: 'reference',
    zone: '正文 Before asking for help 小节',
    originalUrl: 'https://web.archive.org/web/20250918082145/https://old.codinginflow.com/google-programming-questions',
    sourceDomain: 'web.archive.org',
    originalUrlStatus: '自动化核验未取得响应',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方在“求助之前先做三件事”里推荐它：用搜索引擎找和你问题相关的信息。',
      points: [
        '这是官方给出的 Internet Archive 存档地址，原文来自 codinginflow 的旧站点。',
        '它与本课的搜索建议一致：先搜索、再拆解问题、再回看旧课，都无解才去社区提问。',
        '本站核验要点是搜索方法本身：用错误消息原文当关键词通常比用自然语言描述更容易命中。'
      ],
      terms: ['search engine（搜索引擎）', 'error message（错误消息）', 'archive（存档）'],
      focus: '学习“怎样把问题转成有效的搜索词”；如果存档打不开，本课中文讲解已覆盖这一原则。',
      takeaway: '遇到报错先自己搜一轮，并把搜过的关键词记下来，方便提问时说明自己试过什么。'
    },
    license: 'Internet Archive 存档的第三方文章，版权归原作者；本站只做链接与原创导读。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '自动核验未取得响应（curl 在 35 秒内未返回，web.archive.org 对自动化请求响应较慢或被限流）。该地址为官方原文所列的存档链接，需在浏览器中人工确认可达性；本站未因此改动官方引用。'
  },
  /* ===== 06 How Does the Web Work? ===== */
  {
    lessonId: 'how-does-the-web-work',
    title: 'How does the Internet work?',
    titleZh: '互联网是如何工作的？',
    type: '文档',
    requirement: 'required',
    zone: 'Assignment 第 2 条（Knowledge Check 亦指向）',
    originalUrl: 'https://developer.mozilla.org/en-US/Learn/Common_questions/How_does_the_Internet_work',
    originalUrlEffective: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work',
    sourceDomain: 'developer.mozilla.org',
    originalUrlStatus: '200（MDN 学习区路径重组，站内重定向到现役地址）',
    zhUrl: 'https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work',
    zhType: 'MDN 官方简体中文版（同一篇文章的 zh-CN 语言版本）',
    zhGuide: {
      why: '官方 Assignment 第二条要求读这篇 Mozilla 文章，它是本课“互联网怎样运作”的权威说明。',
      points: [
        '官方 Knowledge Check 的“什么是互联网”“客户端与服务器是什么”两题都直接指向这篇及其姊妹篇。',
        '中文版已内容级核验：正文汉字 9931 个，标题为“互联网是如何工作的？”，与英文版同一篇文章。',
        'MDN 页面右上角有语言切换，中英文可随时对照。'
      ],
      terms: ['internet（互联网）', 'client（客户端）', 'server（服务器）'],
      focus: '读中文版即可；遇到不确定的术语再切回英文版核对。',
      takeaway: '能说出数据从你的浏览器到服务器再回来大致经过哪些环节。'
    },
    license: 'MDN 内容采用 CC-BY-SA 2.5；本站只链接官方中文版，不复制文章内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'how-does-the-web-work',
    title: 'Pages, sites, servers and search engines',
    titleZh: '网页、网站、服务器与搜索引擎（MDN，现役标题为“浏览互联网”）',
    type: '文档',
    requirement: 'required',
    zone: 'Assignment 第 4 条（Knowledge Check 亦指向）',
    originalUrl: 'https://developer.mozilla.org/en-US/Learn/Common_questions/Pages_sites_servers_and_search_engines',
    originalUrlEffective: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Browsing_the_web',
    sourceDomain: 'developer.mozilla.org',
    originalUrlStatus: '200（重定向到 MDN 现役页面 Browsing_the_web）',
    zhUrl: 'https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Getting_started/Environment_setup/Browsing_the_web',
    zhType: 'MDN 官方简体中文版（已核验正文汉字 21206 个，标题“浏览互联网”）',
    zhGuide: {
      why: '官方 Assignment 第四条要求弄清网页、网站（web site）与搜索引擎的区别。',
      points: [
        '官方 Knowledge Check 有一题就是“网页、网站与搜索引擎的区别是什么”，答案在这一篇。',
        '本课正文已给出关键区分：网页是单个文档；网站是许多网页的集合；搜索引擎帮你找到网页；浏览器负责显示网页。',
        '中文页在 MDN 重组后标题为“浏览互联网”，内容覆盖了同一组概念，可放心阅读。'
      ],
      terms: ['web page（网页）', 'website / web site（网站）', 'search engine（搜索引擎）', 'browser（浏览器）'],
      focus: '重点读四者的区别部分，其余可略。',
      takeaway: '不再把“网页”“网站”“浏览器”“搜索引擎”混为一谈。'
    },
    license: 'MDN 内容采用 CC-BY-SA 2.5；本站只链接官方中文版。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '中文页与英文页都因 MDN 学习区重组而换了路径，本站两个地址均按重定向后的现役路径给出。'
  },
  {
    lessonId: 'how-does-the-web-work',
    title: 'How the web works (clients and servers / packets)',
    titleZh: '万维网是如何工作的（客户端与服务器、数据包）',
    type: '文档',
    requirement: 'required',
    zone: 'Assignment 第 6 条前半（Knowledge Check 亦指向）',
    originalUrl: 'https://developer.mozilla.org/en-US/Learn/Getting_started_with_the_web/How_the_Web_works#clients_and_servers',
    originalUrlEffective: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works',
    sourceDomain: 'developer.mozilla.org',
    originalUrlStatus: '200（重定向到 MDN 现役路径）',
    zhUrl: 'https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works',
    zhType: 'MDN 官方简体中文版（已核验正文汉字 12335 个，标题“万维网是如何工作的”）',
    zhGuide: {
      why: '官方 Assignment 第六条要求读“网络各部分怎样互相配合”，Knowledge Check 另外指向其中的数据包小节。',
      points: [
        '官方给了两个锚点：clients and servers（客户端与服务器）与 packets explained（数据包解释），说明这两段是本课要掌握的核心。',
        '本课正文已说明：客户端发起请求，服务器返回响应；数据被切成数据包在网络上传输。',
        '中文版与英文版是同一篇 MDN 文章的不同语言版本，锚点位置一致。'
      ],
      terms: ['client（客户端）', 'server（服务器）', 'packet（数据包）', 'request / response（请求 / 响应）'],
      focus: '读“客户端与服务器”和“数据包”两节，其余章节属于后续课程范围。',
      takeaway: '能画出“请求—传输—响应”的简单流程，并解释数据包的作用。'
    },
    license: 'MDN 内容采用 CC-BY-SA 2.5；本站只链接官方中文版。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '官方两个锚点在重定向后的现役页面中仍然存在，本站未替换锚点。'
  },
  {
    lessonId: 'how-does-the-web-work',
    title: 'What is a domain name? (how does a DNS request work)',
    titleZh: '什么是域名？（DNS 请求是怎样工作的）',
    type: '文档',
    requirement: 'required',
    zone: 'Assignment 第 6 条后半',
    originalUrl: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_domain_name#how_does_a_dns_request_work',
    originalUrlEffective: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_domain_name',
    sourceDomain: 'developer.mozilla.org',
    originalUrlStatus: '200（重定向到 MDN 现役路径）',
    zhUrl: 'https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_domain_name',
    zhType: 'MDN 官方简体中文版（已核验正文汉字 8825 个，标题“什么是域名？”）',
    zhGuide: {
      why: '官方 Assignment 第六条要求读这篇讲 DNS 请求怎样工作的 MDN 文章；官方同时提供了一个视频作为替代选项。',
      points: [
        '本课正文已给出 DNS 的定义：域名系统把人类可读的域名翻译成机器使用的 IP 地址，好比电话簿。',
        '官方 Knowledge Check 有一题是“DNS 服务器做什么”，答案在这一篇。',
        '中文版与英文版同源，锚点小节在中文页对应“DNS 请求是怎样工作的”。'
      ],
      terms: ['domain name（域名）', 'DNS（Domain Name System，域名系统）', 'IP address（IP 地址）'],
      focus: '只读 DNS 请求那一节，页面其余部分讲的是域名的注册与结构。',
      takeaway: '能解释在浏览器输入域名之后，系统怎样找到对应的服务器。'
    },
    license: 'MDN 内容采用 CC-BY-SA 2.5；本站只链接官方中文版。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'how-does-the-web-work',
    title: 'DNS Explained',
    titleZh: 'DNS 讲解（DNS Made Easy Videos）',
    type: '视频',
    requirement: 'optional',
    zone: 'Assignment 第 6 条（官方原文为 “Alternatively, here is a video…”）',
    originalUrl: 'https://www.youtube.com/watch?v=72snZctFFtA',
    sourceDomain: 'youtube.com',
    originalUrlStatus: '200（oEmbed 核验：真实标题 DNS Explained，作者 DNS Made Easy Videos）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方把它作为上一篇 MDN DNS 文章的替代选项：不想读文章可以看这个视频。',
      points: [
        '官方用词是 Alternatively，所以它是二选一的可选项，不是必须完成的项目。',
        '需要 YouTube 访问权限才能观看；本站没有可靠证据证明该视频提供中文字幕，因此不声称有中文字幕。',
        '看之前建议先读本课中文讲解里的 DNS 定义，这样视频里的术语不至于陌生。'
      ],
      terms: ['DNS（域名系统）', 'resolver（解析器）', 'IP address（IP 地址）'],
      focus: '注意它怎样把“输入域名 → 找到服务器”的过程画出来。',
      takeaway: '用动画方式再确认一遍 DNS 的工作流程。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频、不声称有中文字幕。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '官方链接带有 t=45s 起播参数，本站按同一视频归并，未改动播放位置。'
  },
  {
    lessonId: 'how-does-the-web-work',
    title: 'How Does The Internet Work? - BBC Click',
    titleZh: '互联网是怎样工作的？（BBC Click 短片）',
    type: '视频',
    requirement: 'required',
    zone: 'Assignment 第 1 条',
    originalUrl: 'https://www.youtube.com/watch?v=eHp1l73ztB8',
    sourceDomain: 'youtube.com',
    originalUrlStatus: '200（oEmbed 核验：真实标题 How Does The Internet Work? - BBC Click，作者 BBC Click）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第一条就是看这个 BBC 短片，作为整课的总览。',
      points: [
        '官方称它为 a BBC short for an overview of how the internet works，定位是概览而非深入讲解。',
        '需要 YouTube 访问权限；本站没有可靠证据证明该视频提供中文字幕，因此不声称有中文字幕。',
        'BBC Click 是 BBC 的科技节目，内容为英语讲述。'
      ],
      terms: ['internet（互联网）', 'network（网络）'],
      focus: '当作整课的热身看，抓住“互联网是很多网络互相连接”这个印象即可。',
      takeaway: '对互联网的规模与结构有一个直观印象，再进入后面的技术细节。'
    },
    license: 'BBC Click 官方频道视频，版权归原作者；本站只做链接与原创导读，不搬运视频。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'how-does-the-web-work',
    title: 'How the Internet Works in 5 Minutes',
    titleZh: '5 分钟讲清互联网怎样运作',
    type: '视频',
    requirement: 'required',
    zone: 'Assignment 第 3 条（Knowledge Check 亦指向）',
    originalUrl: 'https://www.youtube.com/watch?v=7_LPdttKXPc',
    sourceDomain: 'youtube.com',
    originalUrlStatus: '200（oEmbed 核验：真实标题 How the Internet Works in 5 Minutes，作者 Aaron）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第三条要求看这个 5 分钟视频，官方 Knowledge Check 也把“解释互联网怎样工作”指向它。',
      points: [
        '这是本课被引用两次的资源：既在 Assignment，也在 Knowledge Check，属于必看的总览材料。',
        '需要 YouTube 访问权限；本站没有可靠证据证明该视频提供中文字幕，因此不声称有中文字幕。',
        '官方链接以 youtu.be 短链并带 t=46s 起播参数给出，与本站的 watch 链接指向同一视频。'
      ],
      terms: ['internet（互联网）', 'IP address（IP 地址）', 'protocol（协议）'],
      focus: '注意它对“数据怎样在机器之间找到彼此”的解释，这与官方 KC 的问题直接对应。',
      takeaway: '能用五句话向别人解释互联网怎样工作。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'how-does-the-web-work',
    title: 'What is a browser?',
    titleZh: '什么是浏览器？（Google 短片）',
    type: '视频',
    requirement: 'required',
    zone: 'Assignment 第 5 条前半（Knowledge Check 亦指向）',
    originalUrl: 'https://www.youtube.com/watch?v=BrXPcaRlBqo',
    sourceDomain: 'youtube.com',
    originalUrlStatus: '200（oEmbed 核验：真实标题 What is a browser?，作者 Google）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第五条：先看这个 Google 短片了解浏览器是什么，然后去 whatsmybrowser.org 查出自己当前的浏览器与版本。',
      points: [
        '官方 Knowledge Check 有一题是“网页浏览器是什么”，指向这个视频。',
        '本课正文已给出定义：网页浏览器是让你访问并显示网页的软件，例如 Chrome、Firefox、Safari、Edge。',
        '需要 YouTube 访问权限；本站没有可靠证据证明该视频提供中文字幕，因此不声称有中文字幕。'
      ],
      terms: ['web browser（网页浏览器）', 'render（渲染）'],
      focus: '看完立刻做官方的第二步：查出自己的浏览器与版本号，这是第 7 课安装 Chrome 的前提。',
      takeaway: '知道自己现在用的是什么浏览器、什么版本。'
    },
    license: 'Google 官方频道视频，版权归原作者；本站只做链接与原创导读，不搬运视频。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'how-does-the-web-work',
    title: "What's My Browser?",
    titleZh: 'What’s My Browser?（查询当前浏览器与版本）',
    type: '工具',
    requirement: 'required',
    zone: 'Assignment 第 5 条后半',
    originalUrl: 'https://www.whatsmybrowser.org/',
    sourceDomain: 'whatsmybrowser.org',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第五条的后半句：看完视频后用这个网站查出你当前的浏览器和版本。',
      points: [
        '它会读取浏览器自己上报的信息并显示出来，属于一次性的查询，不需要注册账号。',
        '查到的版本号在第 7 课有用：官方只支持 Google Chrome，你需要确认自己装的是哪个浏览器。',
        '这是第三方网站，与本站无关联；它读取的是浏览器公开信息，本站不代为收集任何数据。'
      ],
      terms: ['browser version（浏览器版本）', 'user agent（用户代理字符串）'],
      focus: '记下浏览器名称与版本号，不用深究页面上其他技术细节。',
      takeaway: '知道自己当前的浏览器环境，为第 7 课做准备。'
    },
    license: '第三方在线工具；本站只链接首页，不嵌入、不代理其页面。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  /* ===== 07 Computer Basics & Installations ===== */
  {
    lessonId: 'installations',
    title: 'Linux',
    titleZh: 'Linux（维基百科）',
    type: '百科条目',
    requirement: 'reference',
    zone: '正文 Operating System 小节',
    originalUrl: 'https://en.wikipedia.org/wiki/Linux',
    sourceDomain: 'en.wikipedia.org',
    originalUrlStatus: '200',
    zhUrl: 'https://zh.wikipedia.org/zh-cn/Linux',
    zhType: '中文维基百科简体中文版（用 zh-cn variant 强制简体，已核验正文汉字 60955 个）',
    zhGuide: {
      why: '官方在介绍操作系统时链接了 Linux 条目，让你了解这个课程推荐的系统本身。',
      points: [
        '官方正文的原话是：Linux 是免费开源的操作系统，与所有编程语言配合良好，多数开发工具都是为在 Linux 上原生运行而写的；在 Linux 上你的工具会更常更新、排错资料更多、运行也更顺畅。',
        '条目很长，本课只需要读开头的定义与“为什么开发者常用它”的部分。'
      ],
      terms: ['Linux', 'open-source（开源）', 'operating system（操作系统）', 'distribution / distro（发行版）'],
      focus: '读定义与历史概览即可，内核技术细节不属于本课范围。',
      takeaway: '理解官方为什么推荐 Linux 而不是 Windows。'
    },
    license: '维基百科内容采用 CC BY-SA 4.0；本站只链接，不复制条目内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '已核验：直接访问 zh.wikipedia.org/wiki/Linux 会按浏览器语言偏好可能返回繁体，本站统一使用 zh-cn variant 强制简体。'
  },
  {
    lessonId: 'installations',
    title: 'Why We Do Not Support Windows',
    titleZh: 'TOP 为什么不支持 Windows（官方博客 wiki）',
    type: '官方说明',
    requirement: 'reference',
    zone: '正文 Windows 小节',
    originalUrl: 'https://github.com/TheOdinProject/blog/wiki/Why-We-Do-Not-Support-Windows',
    sourceDomain: 'github.com',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方在说明不支持原生 Windows 时，给了这份理由清单作为更多信息。',
      points: [
        '官方正文的态度很明确：只能支持课程范围内提供的内容，不支持原生 Windows 作为开发环境；不要要求支持 Windows，也不要在 Discord 里提这个话题。',
        '官方说 Windows 已被讨论过很多次，目前不可行，并且 Windows 没有被证明是一条阻力较小的路径。',
        '对 Windows 用户，本课官方给的路径是 WSL2 或虚拟机，第 9 课也针对 WSL2 单独给了说明。'
      ],
      terms: ['WSL2（Windows Subsystem for Linux 2）', 'virtual machine（虚拟机）', 'supported OS（受支持的操作系统）'],
      focus: '如果你是 Windows 用户，读它能理解官方为什么这样规定；不是 Windows 用户可以跳过。',
      takeaway: '接受官方环境要求，并把精力放在 WSL2 或虚拟机这条实际可行的路上。'
    },
    license: 'TOP 官方博客仓库 wiki，采用 CC BY-NC-SA 4.0；本站只做链接与原创要点提示，不复制全文。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'installations',
    title: 'What is a Virtual Machine (VM)? In 3 minutes',
    titleZh: '什么是虚拟机（3 分钟，Virtual Machine Tutorial for Beginners）',
    type: '视频',
    requirement: 'reference',
    zone: '正文 Virtual Machine 小节（链接文字即“virtual machine”）',
    originalUrl: 'https://youtu.be/yIVXjl4SwVo',
    originalUrlEffective: 'https://www.youtube.com/watch?v=yIVXjl4SwVo',
    sourceDomain: 'youtube.com',
    originalUrlStatus: '200（oEmbed 核验：真实标题 What is a Virtual Machine (VM)? In 3 minutes - Virtual Machine Tutorial for Beginners，作者 Victor Dozal）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方在正文用这个视频解释虚拟机是什么，作为 Windows 用户可选的两条路径之一。',
      points: [
        '官方正文已给出定义：虚拟机是在你现有操作系统内运行的计算机仿真，让你在一个程序里使用另一个操作系统（例如在 Windows 里跑 Linux）；安装和普通软件一样简单，且没有风险，不喜欢 Linux 可以直接删掉虚拟机。',
        '官方评价虚拟机是新手快速上手的好方式。',
        '需要 YouTube 访问权限；本站没有可靠证据证明该视频提供中文字幕，因此不声称有中文字幕。'
      ],
      terms: ['virtual machine / VM（虚拟机）', 'emulation（仿真）', 'host OS（宿主系统）'],
      focus: '看完后决定自己走 WSL2 还是虚拟机；本课正文的 Windows 小节会给出官方建议。',
      takeaway: '理解虚拟机的原理与风险边界，能做出环境选择。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'installations',
    title: 'Ubuntu flavours',
    titleZh: 'Ubuntu 官方风味版（flavors）',
    type: '官方页面',
    requirement: 'reference',
    zone: '正文开头与 Assignment 各出现一次',
    originalUrl: 'https://ubuntu.com/desktop/flavours',
    originalUrlEffective: 'https://ubuntu.com/desktop/flavors',
    sourceDomain: 'ubuntu.com',
    originalUrlStatus: '200（站内重定向到美式拼写 flavors）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方在两处提到它：如果你已经在用 macOS、Ubuntu 或 Ubuntu 的官方风味版，并且装了 Google Chrome，就可以跳过整课。',
      points: [
        'flavor（风味版）指由 Ubuntu 官方认可的衍生版本，桌面环境不同但同属 Ubuntu 家族，因此官方把它们与 Ubuntu 一并视为受支持环境。',
        '这条信息的实际用途是判断你能不能跳过本课，而不是要求你去安装风味版。',
        '官方页面为英文，Ubuntu 中文社区另有资料，但不是 Canonical 官方中文页面，故本站不作为中文版提供。'
      ],
      terms: ['Ubuntu flavor（Ubuntu 风味版）', 'desktop environment（桌面环境）'],
      focus: '只需确认自己的系统是否属于官方支持的范围。',
      takeaway: '知道自己能不能跳过第 7 课。'
    },
    license: 'Canonical / Ubuntu 官方页面；本站只做链接与原创导读。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '原地址为英式拼写 flavours，站内 301 到 flavors，内容相同。'
  },
  {
    lessonId: 'installations',
    title: 'Usage share of web browsers',
    titleZh: '网页浏览器的使用分布（维基百科）',
    type: '百科条目',
    requirement: 'reference',
    zone: '正文与 Assignment 各出现一次',
    originalUrl: 'https://en.wikipedia.org/wiki/Usage_share_of_web_browsers#Summary_tables',
    sourceDomain: 'en.wikipedia.org',
    originalUrlStatus: '200',
    zhUrl: 'https://zh.wikipedia.org/zh-cn/Usage_share_of_web_browsers',
    zhType: '中文维基百科简体中文版（已核验标题为“网页浏览器的使用分布”，正文汉字 36988 个）',
    zhGuide: {
      why: '官方两次给出这个条目：因为课程只用 Google Chrome，让你看看其他开发者与用户实际在用什么。',
      points: [
        '官方原话：我们只支持 Google Chrome；我们的课程使用 Google Chrome，它在开发者与消费者中都被广泛使用，我们的推荐是非常有意的。',
        '官方指定的锚点是 Summary tables（汇总表），也就是直接看份额数据，不必读方法论部分。',
        '中文条目已核验为简体版本，标题“网页浏览器的使用分布”。'
      ],
      terms: ['usage share（使用份额）', 'browser market share（浏览器市场份额）'],
      focus: '直接看汇总表里 Chrome 的占比，理解官方“只用 Chrome”的依据。',
      takeaway: '知道官方的浏览器要求不是随意规定，而是有使用数据支撑。'
    },
    license: '维基百科内容采用 CC BY-SA 4.0；本站只链接。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '已核验：不使用 zh-cn variant 时中文维基会按浏览器语言返回繁体标题，故本站固定使用 zh-cn 路径。'
  },
  {
    lessonId: 'installations',
    title: 'Chrome keyboard and mouse shortcuts',
    titleZh: 'Chrome 键盘与鼠标快捷键',
    type: '文档',
    requirement: 'required',
    zone: 'Assignment（Chrome 小节）',
    originalUrl: 'https://support.google.com/chrome/answer/157179?hl=en&co=GENIE.Platform%3DDesktop#zippy=%2Ctab-window-shortcuts',
    sourceDomain: 'support.google.com',
    originalUrlStatus: '200',
    zhUrl: 'https://support.google.com/chrome/answer/157179?hl=zh-CN&co=GENIE.Platform%3DDesktop#zippy=%2Ctab-window-shortcuts',
    zhType: 'Google 官方帮助中心简体中文版（同一篇文档，用 hl=zh-CN 参数切换语言，已核验标题含汉字）',
    zhGuide: {
      why: '官方说 Chrome 是你在整个课程中最重要的工具之一，这份参考里有很多用 Chrome 时可能觉得有用的常用快捷键。',
      points: [
        '官方指定的锚点是 tab-window shortcuts（标签页与窗口快捷键），也就是新标签页、切换标签页、关闭窗口这一类。',
        'Google 帮助中心通过 hl 参数切换界面与内容语言，中文版与英文版是同一篇文档。',
        '快捷键因操作系统而异，页面上有 Windows/macOS/Linux 的分栏，需按自己的系统查看。'
      ],
      terms: ['keyboard shortcut（键盘快捷键）', 'tab（标签页）'],
      focus: '先看自己操作系统那一栏的标签页与窗口快捷键，挑三五个常用的记住。',
      takeaway: '日常浏览与调试时少用鼠标，提高效率。'
    },
    license: 'Google 官方帮助文档；本站只链接官方中文版，不复制文档内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  /* ===== 08 Text Editors ===== */
  {
    lessonId: 'text-editors',
    title: 'Visual Studio Code Documentation',
    titleZh: 'VS Code 官方文档',
    type: '文档',
    requirement: 'required',
    zone: 'Assignment 第 1 条',
    originalUrl: 'https://code.visualstudio.com/docs',
    sourceDomain: 'code.visualstudio.com',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 说：以后如果在 VSCode 上遇到问题，或想了解更多功能，就查 VSCode 文档；VSCode 里还有很多键盘快捷键，其中一些与你的操作系统有关，需要时可以查。',
      points: [
        '本课正文已解释为什么必须用纯文本编辑器：它不保存额外的排版与图形信息，所以其他程序能把文件当代码读取并执行；Word 这类富文本编辑器会插入额外信息，导致代码无法运行。',
        '官方文档站没有中文版本，界面与内容均为英文，因此本站不提供中文链接。',
        '这是长期查阅的参考站，不必本课读完。'
      ],
      terms: ['text editor（文本编辑器）', 'plain text（纯文本）', 'extension（扩展）', 'keyboard shortcut（快捷键）'],
      focus: '本课只需要知道文档站的位置；具体功能遇到时再查对应章节。',
      takeaway: '遇到编辑器问题时知道去哪里查权威答案。'
    },
    license: 'VS Code 官方文档，版权归 Microsoft；本站只做链接与原创导读。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '已核验 code.visualstudio.com 无官方中文版路径，故 zhUrl 为空，不猜测语言参数。'
  },
  {
    lessonId: 'text-editors',
    title: 'VSCode Tutorial For Beginners - Getting Started With VSCode',
    titleZh: 'VS Code 新手教程（Tech With Tim）',
    type: '视频',
    requirement: 'required',
    zone: 'Assignment 第 2 条',
    originalUrl: 'https://youtu.be/ORrELERGIHs',
    originalUrlEffective: 'https://www.youtube.com/watch?v=ORrELERGIHs',
    sourceDomain: 'youtube.com',
    originalUrlStatus: '200（oEmbed 核验：真实标题 VSCode Tutorial For Beginners - Getting Started With VSCode，作者 Tech With Tim）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第二条：熟悉 VSCode 能帮你节省时间、提高效率；看这个视频可以了解 VSCode 提供的全部功能。',
      points: [
        '官方特别交代了看法：不用真的跟着敲代码，只要看视频里 VSCode 是怎样被使用的。',
        '需要 YouTube 访问权限；本站没有可靠证据证明该视频提供中文字幕，因此不声称有中文字幕。',
        '官方链接带 t=103 起播参数，本站按同一视频归并。'
      ],
      terms: ['VS Code（Visual Studio Code）', 'terminal（内置终端）', 'extension（扩展）', 'IntelliSense（智能提示）'],
      focus: '按官方说法“只看用法”，注意它怎样打开文件、怎样用内置终端、怎样装扩展。',
      takeaway: '对编辑器界面与常用操作有整体印象，后续课程上手更快。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  /* ===== 09 Command Line Basics ===== */
  {
    lessonId: 'command-line-basics',
    title: 'Command-line completion (tab completion)',
    titleZh: '自动完成（命令行补全，维基百科）',
    type: '百科条目',
    requirement: 'reference',
    zone: '正文 Efficiency 小节（链接文字为 tab completion）',
    originalUrl: 'https://en.wikipedia.org/wiki/Command-line_completion',
    sourceDomain: 'en.wikipedia.org',
    originalUrlStatus: '200',
    zhUrl: 'https://zh.wikipedia.org/zh-cn/%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8',
    zhType: '中文维基百科简体中文版（已核验标题为“自动完成”，正文汉字 9067 个）',
    zhGuide: {
      why: '官方用相当强调的语气推荐这个技巧：你需要了解 tab completion；说真的，这个技巧会帮你省下大量时间和挫败感。',
      points: [
        '官方给了具体场景：要进入像 ~/Documents/Odin-Project/foundations/javascript/calculator/ 这样很深的目录，全部手打既长又必须完全正确才行。',
        '官方的做法说明：按 Tab 键，命令行会在只剩一个匹配项时自动补全你已经开始输入的命令；如果输入 cd D 再按 Tab，命令行会列出 Documents 和 Downloads 等所有匹配项让你选择。',
        '中文条目“自动完成”已核验为简体，内容与英文条目对应。'
      ],
      terms: ['tab completion（Tab 补全）', 'command-line completion（命令行补全）', 'path（路径）'],
      focus: '读定义与工作方式即可；实际手感要自己在终端里练。',
      takeaway: '把 Tab 补全变成肌肉记忆，不再手打长路径。'
    },
    license: '维基百科内容采用 CC BY-SA 4.0；本站只链接。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'command-line-basics',
    title: 'The Unix Shell (Software Carpentry)',
    titleZh: 'The Unix Shell 课程主页（Software Carpentry 基金会）',
    type: '课程',
    requirement: 'required',
    zone: 'Assignment 第 1 条（课程总入口）',
    originalUrl: 'https://swcarpentry.github.io/shell-novice/',
    sourceDomain: 'swcarpentry.github.io',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第一条：访问 Software Carpentry 基金会设计的 The Unix Shell 课程；那里有一整套 CLI 课程，但现在只需要完成官方点名的几节。',
      points: [
        '官方明确限定了范围：整站课程很多，本课只做 Download files、Introducing the Shell、Navigating Files and Directories、Working With Files and Directories 这几节。',
        '官方还提醒：整门课程里你的终端输出可能与课程展示的略有不同，这是正常的。',
        'Software Carpentry 是面向科研人员的计算技能教学项目，课程以英文授课。'
      ],
      terms: ['shell（外壳程序）', 'CLI（命令行界面）', 'terminal（终端）'],
      focus: '从主页找到官方点名的那几节，不要顺着整站往下学，超出本课范围。',
      takeaway: '知道这是官方指定的 CLI 练习课程，且范围有限定。'
    },
    license: 'Software Carpentry 课程材料采用 CC BY 4.0；本站只做链接与原创导读，不复制课程内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'command-line-basics',
    title: 'The Unix Shell — Download files',
    titleZh: 'The Unix Shell：下载练习文件（只做这一节的说明）',
    type: '课程章节',
    requirement: 'required',
    zone: 'Assignment 第 1 条列表第 1 项',
    originalUrl: 'https://swcarpentry.github.io/shell-novice/#download-files',
    sourceDomain: 'swcarpentry.github.io',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方点名要做的第一节，并特别说明：只需要照着这一节里的说明做，不需要安装任何软件，做完就可以进入下一项。',
      points: [
        '这一节的作用是拿到后面几节要用的练习数据文件。',
        '官方对 WSL2 用户单独给了做法：用 wget 命令配合 Download files 小节给出的链接把 zip 文件取到 WSL2 安装里（wget https://swcarpentry.github.io/shell-novice/data/shell-lesson-data.zip），再用 sudo apt install unzip 安装解压工具，然后 unzip shell-lesson-data.zip 解压。',
        '官方再次提醒：课程让去 Desktop 时，WSL2 用户应改为去 home 目录，用 cd ~ 即可。'
      ],
      terms: ['download（下载）', 'unzip（解压）', 'wget（下载命令）', 'home directory（家目录）'],
      focus: '按官方限定只做下载说明部分，不要顺手安装课程推荐的其他软件。',
      takeaway: '拿到练习数据文件，为后续三节做好准备。'
    },
    license: 'Software Carpentry 课程材料采用 CC BY 4.0；本站只做链接与原创导读。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '官方以同一页面锚点给出，与课程主页为同一 URL 的不同片段；本站按官方列出的条目分别保留，便于逐条对照完成任务。'
  },
  {
    lessonId: 'command-line-basics',
    title: 'The Unix Shell — Introducing the Shell',
    titleZh: 'The Unix Shell：认识 Shell',
    type: '课程章节',
    requirement: 'required',
    zone: 'Assignment 第 1 条列表第 2 项',
    originalUrl: 'https://swcarpentry.github.io/shell-novice/01-intro.html',
    sourceDomain: 'swcarpentry.github.io',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方点名要完成的第二节，是整套 CLI 练习的入门部分。',
      points: [
        '本课正文已给出 shell 的定义：shell 是一个让你用文字命令与计算机对话的程序，你在终端里输入的命令由它解释执行。',
        '官方提醒你的终端输出可能与课程展示的略有不同，不必因为提示符长得不一样就认为做错了。',
        'WSL2 用户注意官方的对应说明：课程里的 Desktop 在你这里应换成 home 目录（cd ~）。'
      ],
      terms: ['shell（外壳程序）', 'prompt（提示符）', 'command（命令）'],
      focus: '跟着做命令输入练习，注意命令写错时的报错形式。',
      takeaway: '理解 shell 与终端的关系，能执行第一条命令。'
    },
    license: 'Software Carpentry 课程材料采用 CC BY 4.0；本站只做链接与原创导读。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'command-line-basics',
    title: 'The Unix Shell — Navigating Files and Directories',
    titleZh: 'The Unix Shell：在文件与目录之间移动',
    type: '课程章节',
    requirement: 'required',
    zone: 'Assignment 第 1 条列表第 3 项',
    originalUrl: 'https://swcarpentry.github.io/shell-novice/02-filedir.html',
    sourceDomain: 'swcarpentry.github.io',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方点名要完成的第三节，对应本课最核心的一组导航命令。',
      points: [
        '本课官方 Knowledge Check 有五题直接指向这一组命令：怎样进入指定目录、单独输入 cd 会去哪、cd .. 会去哪、怎样显示当前所在目录名、怎样列出目录内容。',
        '涉及的命令是 pwd（显示当前位置）、ls（列出内容）、cd（切换目录），这也是本课正文重点讲的部分。',
        '官方提醒输出可能与课程展示略有不同，属正常现象。'
      ],
      terms: ['pwd（print working directory）', 'ls（list）', 'cd（change directory）', 'absolute / relative path（绝对 / 相对路径）'],
      focus: '这一节要动手练，不是只读；练完能回答官方 KC 的五道题。',
      takeaway: '不看笔记也能在目录之间自由移动，并随时知道自己在哪。'
    },
    license: 'Software Carpentry 课程材料采用 CC BY 4.0；本站只做链接与原创导读。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'command-line-basics',
    title: 'The Unix Shell — Working With Files and Directories',
    titleZh: 'The Unix Shell：操作文件与目录',
    type: '课程章节',
    requirement: 'required',
    zone: 'Assignment 第 1 条列表第 4 项',
    originalUrl: 'https://swcarpentry.github.io/shell-novice/03-create.html',
    sourceDomain: 'swcarpentry.github.io',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方点名要完成的第四节，把导航延伸到真正的增删改操作。',
      points: [
        '本课正文与 KC 涉及的命令包括 mkdir（建目录）、touch（建文件）、cp（复制）、mv（移动或重命名）、rm（删除）。',
        '删除类命令没有回收站兜底，属于不可逆操作；执行前应先用 ls 或 pwd 确认自己在正确的位置。',
        '官方提醒输出可能与课程展示略有不同，属正常现象。'
      ],
      terms: ['mkdir（make directory）', 'touch', 'cp（copy）', 'mv（move）', 'rm（remove）'],
      focus: '重点练创建、复制、移动；删除操作先在练习目录里试，确认理解后果再在其他地方用。',
      takeaway: '能用命令完成文件的日常增删改，并对不可逆操作保持谨慎。'
    },
    license: 'Software Carpentry 课程材料采用 CC BY 4.0；本站只做链接与原创导读。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'command-line-basics',
    title: 'shell-lesson-data.zip',
    titleZh: 'The Unix Shell 练习数据压缩包',
    type: '数据文件',
    requirement: 'required',
    zone: 'Assignment（WSL2 说明中给出下载命令）',
    originalUrl: 'https://swcarpentry.github.io/shell-novice/data/shell-lesson-data.zip',
    sourceDomain: 'swcarpentry.github.io',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '这是官方在 WSL2 说明里直接给出下载命令的练习数据文件，后面三节课程都要用它。',
      points: [
        '官方给 WSL2 用户的完整做法是三条命令：wget 下载这个 zip、sudo apt install unzip 安装解压工具、unzip shell-lesson-data.zip 解压。',
        '非 WSL2 用户按课程 Download files 小节的说明获取同一份数据即可。',
        '它是压缩数据文件而不是网页，浏览器直接打开会触发下载而不是显示内容。'
      ],
      terms: ['wget（下载命令）', 'unzip（解压）', 'zip archive（压缩包）'],
      focus: '下载到练习目录后解压，确认里面出现课程要用的子目录。',
      takeaway: '练习环境齐备，可以真正动手做命令练习。'
    },
    license: 'Software Carpentry 课程数据，采用 CC BY 4.0；本站只链接官方下载地址，不镜像、不转存该文件。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '官方原文中该链接没有可读的链接文字，标题由本站按文件名与用途补写。'
  },
  {
    lessonId: 'command-line-basics',
    title: 'Unix Commands — Basics (cd, pwd, ls)',
    titleZh: 'Unix 命令基础（cd / pwd / ls）',
    type: '参考书章节',
    requirement: 'reference',
    zone: 'Knowledge Check 五题全部指向本书不同小节',
    originalUrl: 'https://www.softcover.io/read/fc6c09de/unix_commands/basics',
    sourceDomain: 'softcover.io',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Knowledge Check 的五道题全部指向这本书的 basics 章节，是回答这些问题的权威出处。',
      points: [
        '五道题分别是：怎样进入某个指定目录、单独输入 cd 会到哪、cd .. 会到哪、怎样显示当前所在目录的名字、怎样显示当前目录的内容。',
        '官方在五个问题后各给了不同的锚点（sec-basics-cd、uid31、uid30、sec-basics-pwd、sec-basics-ls），指向同一章节内的小节。',
        'Softcover 是在线出版平台，本书为英文；本站核验的是可达性，未复制书内内容。'
      ],
      terms: ['cd（change directory）', 'pwd（print working directory）', 'ls（list）'],
      focus: '做 KC 时按题目跳到对应小节；这一章也可当作命令速查表收藏。',
      takeaway: '能准确回答官方 KC 的五道导航题，并有一处可长期查阅的命令参考。'
    },
    license: 'Softcover 在线书籍，版权归原作者所有；本站只做链接与原创导读，不复制书内内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '官方五处链接指向同一章节的不同锚点，本站按规范化地址合并为一条，锚点信息保留在要点中。'
  },
  /* ===== 10 Setting Up Git ===== */
  {
    lessonId: 'setting-up-git',
    title: 'cat command reference (LINFO)',
    titleZh: 'cat 命令说明（LINFO）',
    type: '参考文档',
    requirement: 'required',
    zone: 'Assignment（配置 SSH 步骤中）',
    originalUrl: 'http://www.linfo.org/cat.html',
    originalUrlEffective: 'https://www.linfo.org/cat.html',
    sourceDomain: 'linfo.org',
    originalUrlStatus: '200（http 自动升级为 https）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方在这一步说明：现在你需要复制你的公开 SSH 密钥，为此我们要用一个叫 cat 的命令把文件内容读到控制台。',
      points: [
        '官方特别提示：这种情况下 .pub 文件扩展名很重要，也就是要 cat 的是公开密钥文件而不是私有密钥文件。',
        'cat 的用途是把文件内容原样输出到终端，这样你才能选中并复制密钥文本。',
        '本课涉及密钥操作，务必区分公开密钥（可以复制粘贴给别人）与私有密钥（绝不外泄、绝不复制给任何人）。'
      ],
      terms: ['cat（concatenate，输出文件内容）', 'SSH key（SSH 密钥）', 'public key（公开密钥）', 'private key（私有密钥）'],
      focus: '理解 cat 在这里只是“把文件打印出来”的工具，重点在别复制错文件。',
      takeaway: '能安全地取出公开密钥内容，并清楚哪些内容绝不能外泄。'
    },
    license: 'LINFO（The Linux Information Project）参考文档；本站只做链接与原创导读，不复制文档内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '官方原文使用 http 协议，站点现已强制 https；本站保留官方原始写法并记录重定向结果。'
  },
  {
    lessonId: 'setting-up-git',
    title: 'Testing your SSH connection',
    titleZh: '测试你的 SSH 连接（GitHub 官方文档）',
    type: '文档',
    requirement: 'required',
    zone: 'Assignment（SSH 配置最后一步）',
    originalUrl: 'https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection?platform=linux',
    sourceDomain: 'docs.github.com',
    originalUrlStatus: '200',
    zhUrl: 'https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection?platform=linux',
    zhType: 'GitHub 官方文档简体中文版（同一路径的语言版本，已核验标题“测试 SSH 连接”）',
    zhGuide: {
      why: '官方 Assignment 的收尾步骤：按照 GitHub 的说明测试你的 SSH 连接。',
      points: [
        '官方同时要求：确认终端输出的指纹与 GitHub 公布的四个公开指纹之一相匹配。',
        'GitHub 文档提供 platform 参数，官方给的是 platform=linux，对应 Linux / WSL2 环境的说明；macOS 用户可按页面提示切换。',
        '中文版由 GitHub 官方维护，与英文版同一篇文档。'
      ],
      terms: ['SSH connection（SSH 连接）', 'fingerprint（指纹）', 'known_hosts（已知主机文件）'],
      focus: '按步骤执行测试命令，并逐字比对指纹，不要看到提示就直接输入 yes。',
      takeaway: '确认本机能通过 SSH 与 GitHub 通信，且对方身份可信。'
    },
    license: 'GitHub 官方文档；本站只链接官方中文版，不复制文档内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'setting-up-git',
    title: "GitHub's SSH key fingerprints",
    titleZh: 'GitHub 的 SSH 密钥指纹（GitHub 官方文档）',
    type: '文档',
    requirement: 'required',
    zone: 'Assignment（SSH 测试步骤中）',
    originalUrl: 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints',
    sourceDomain: 'docs.github.com',
    originalUrlStatus: '200',
    zhUrl: 'https://docs.github.com/zh/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints',
    zhType: 'GitHub 官方文档简体中文版（已核验页面标题含中文）',
    zhGuide: {
      why: '官方要求把终端里显示的指纹与 GitHub 公布的四个公开指纹之一做比对，这是确认对方真的是 GitHub 的关键一步。',
      points: [
        '指纹是一串哈希值，用来标识一个密钥；比对指纹的目的是防止连到假冒服务器。',
        '官方明确说有四个公开指纹，页面上会列出全部；只要匹配其中之一即可。',
        '这一步是安全检查，跳过它就等于放弃了验证对方身份的机会。'
      ],
      terms: ['SSH key fingerprint（SSH 密钥指纹）', 'hash（哈希值）', 'man-in-the-middle（中间人攻击）'],
      focus: '打开页面找到指纹列表，与终端输出逐字符比对，尤其是开头和结尾。',
      takeaway: '建立“看到主机密钥提示就先核对指纹”的习惯。'
    },
    license: 'GitHub 官方文档；本站只链接官方中文版，不复制指纹以外的文档内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'setting-up-git',
    title: 'Configuring two-factor authentication',
    titleZh: '配置双因素认证（GitHub 官方文档）',
    type: '文档',
    requirement: 'required',
    zone: 'Assignment（账号安全步骤）',
    originalUrl: 'https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication#configuring-two-factor-authentication-using-a-totp-app',
    sourceDomain: 'docs.github.com',
    originalUrlStatus: '200',
    zhUrl: 'https://docs.github.com/zh/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication#configuring-two-factor-authentication-using-a-totp-app',
    zhType: 'GitHub 官方文档简体中文版（同一路径的语言版本，已核验标题含中文）',
    zhGuide: {
      why: '官方 Assignment 要求打开 GitHub 2FA 文档并按配置说明操作，用来给账号加上第二道验证。',
      points: [
        '官方给了具体建议：第 1 步推荐使用 Google Authenticator，它是一个基于时间的一次性密码（TOTP）应用。',
        '官方指定的锚点就是“使用 TOTP 应用配置双因素认证”这一节，不必读其他认证方式。',
        '配置过程中应用会给出恢复码，应当妥善保存在本机之外可访问的地方；恢复码属于账号敏感信息，不要贴到聊天、代码或截图里。'
      ],
      terms: ['two-factor authentication / 2FA（双因素认证）', 'TOTP（time-based one-time password，基于时间的一次性密码）', 'recovery code（恢复码）'],
      focus: '只读 TOTP 应用那一节，按步骤绑定认证器应用并保存恢复码。',
      takeaway: '账号具备双因素认证，且恢复码已安全保存。'
    },
    license: 'GitHub 官方文档；本站只链接官方中文版，不复制文档内容，不记录任何认证信息。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '按 v3 交接 §2.2 与本站安全约定：本站不存储、不显示任何 token、密钥、恢复码或账号凭据。'
  },
  {
    lessonId: 'setting-up-git',
    title: 'GitHub Email Settings',
    titleZh: 'GitHub 邮箱设置页（需要登录）',
    type: '操作入口',
    requirement: 'required',
    zone: 'Assignment 第 1 条（创建账号时的隐私设置）',
    originalUrl: 'https://github.com/settings/emails',
    sourceDomain: 'github.com',
    originalUrlStatus: '200（未登录时重定向到 GitHub 登录页）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方要求：注册账号时会填写邮箱，这个邮箱默认用于标识你的贡献；如果你在意隐私，或只是不想让邮箱公开，登录后要在 Email Settings 页面勾选两个复选框。',
      points: [
        '官方说明这是登录之后才能访问的设置页，未登录访问会被重定向到登录页，这不是链接失效。',
        '官方在第 10 课还要求记下 GitHub 提供的私有邮箱地址，后续 Git 配置会用到它。',
        '邮箱地址属于个人信息；本站不收集、不存储任何账号或邮箱数据。'
      ],
      terms: ['email settings（邮箱设置）', 'private email（私有邮箱）', 'contribution（贡献记录）'],
      focus: '登录后勾选官方指明的两个复选框，并记下 GitHub 提供的私有邮箱地址。',
      takeaway: '既能公开参与贡献，又不暴露真实邮箱。'
    },
    license: 'GitHub 账号设置页面；本站不代为登录，不收集任何账号信息。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '重定向目标为 github.com/login?return_to=…，属预期的登录跳转；需在浏览器中登录后访问。'
  },
  {
    lessonId: 'setting-up-git',
    title: 'Google Account Help — Google Authenticator',
    titleZh: 'Google 账号帮助：使用 Google Authenticator',
    type: '文档',
    requirement: 'required',
    zone: 'Assignment（2FA 步骤中）',
    originalUrl: 'https://support.google.com/accounts/answer/1066447',
    sourceDomain: 'support.google.com',
    originalUrlStatus: '200',
    zhUrl: 'https://support.google.com/accounts/answer/1066447?hl=zh-CN',
    zhType: 'Google 官方帮助中心简体中文版（同一篇文档，用 hl=zh-CN 切换语言，已核验标题含汉字）',
    zhGuide: {
      why: '官方在推荐 Google Authenticator 之后紧接着给出操作步骤：打开 Google Account Help，点 Android 或 iPhone & iPad，然后按下载与设置说明操作。',
      points: [
        '官方把入口分成了两个平台按钮，你需要按自己的手机系统选择，不要照着另一平台的截图操作。',
        'Google Authenticator 是官方推荐的 TOTP 应用，用于 GitHub 的双因素认证。',
        '中文版由 Google 官方维护，与英文版是同一篇帮助文档。'
      ],
      terms: ['Google Authenticator（谷歌身份验证器）', 'TOTP（基于时间的一次性密码）', 'Android / iPhone & iPad（平台选择）'],
      focus: '选对自己手机平台的分支，按步骤完成安装与账号添加。',
      takeaway: '手机上装好认证器应用，可以生成 2FA 验证码。'
    },
    license: 'Google 官方帮助文档；本站只链接官方中文版，不复制文档内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  /* ===== 11 Introduction to Git ===== */
  {
    lessonId: 'introduction-to-git',
    title: 'About GitHub and Git',
    titleZh: '关于 GitHub 与 Git（GitHub 官方文档，现役标题为 What is GitHub）',
    type: '文档',
    requirement: 'required',
    zone: 'Assignment 第 3 条（Knowledge Check 亦指向）',
    originalUrl: 'https://docs.github.com/en/get-started/start-your-journey/about-github-and-git',
    originalUrlEffective: 'https://docs.github.com/en/get-started/start-your-journey/what-is-github',
    sourceDomain: 'docs.github.com',
    originalUrlStatus: '200（GitHub 文档改版，站内重定向到 what-is-github）',
    zhUrl: 'https://docs.github.com/zh/get-started/start-your-journey/about-github-and-git',
    zhType: 'GitHub 官方文档简体中文版（已核验页面标题含中文，与英文版同一篇文档）',
    zhGuide: {
      why: '官方 Assignment 第三条：读 About GitHub and Git，简要了解 GitHub 是什么，以及 Git 与 GitHub 怎样协同工作。',
      points: [
        '官方给了明确的范围限定：末尾的 Where do I start? 一节可以跳过。',
        '官方 Knowledge Check 有一题是“为什么 Git 和 GitHub 对开发团队有用”，直接指向这一篇。',
        '本课正文已给出关键区分：Git 是版本控制系统软件，GitHub 是基于 Git 的托管服务，两者不是同一个东西，也不是同一家公司创建的。'
      ],
      terms: ['Git（版本控制系统）', 'GitHub（代码托管平台）', 'version control（版本控制）', 'repository（仓库）'],
      focus: '读 GitHub 是什么、以及它与 Git 的分工；按官方说明跳过 Where do I start?。',
      takeaway: '能清楚说出 Git 与 GitHub 的区别与配合关系。'
    },
    license: 'GitHub 官方文档；本站只链接官方中文版，不复制文档内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '英文页因 GitHub 文档改版重定向到 what-is-github；中文路径仍可直接访问同一内容，本站两个地址均已核验。'
  },
  {
    lessonId: 'introduction-to-git',
    title: 'Pro Git — Getting Started (chapters 1.1–1.4)',
    titleZh: 'Pro Git 中文版：起步（1.1–1.4 章）',
    type: '书籍章节',
    requirement: 'required',
    zone: 'Assignment 第 1 条',
    originalUrl: 'https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control',
    sourceDomain: 'git-scm.com',
    originalUrlStatus: '200',
    zhUrl: 'https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%85%B3%E4%BA%8E%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6',
    zhType: 'Pro Git 官方中文版（git-scm.com 的 zh 语言版本，章节 slug 本身为中文“起步-关于版本控制”，已核验正文汉字 6092 个）',
    zhGuide: {
      why: '官方 Assignment 第一条：读 Pro Git 的 Getting Started 部分第 1.1 到 1.4 章，用来了解本地、集中式与分布式版本控制系统之间的区别。',
      points: [
        '官方限定了章节范围是 1.1–1.4，不需要读完整本书。',
        '这四章对应中文版“起步”一节下的：关于版本控制、Git 简史、Git 是什么、命令行、Git 安装配置。',
        'Pro Git 是 Git 官方推荐的书籍，中文版由官方站点提供，与英文版章节结构一致。'
      ],
      terms: ['version control system（版本控制系统）', 'local VCS（本地版本控制）', 'centralized VCS（集中式版本控制）', 'distributed VCS（分布式版本控制）'],
      focus: '重点在三种版本控制系统的区别，这也是官方点名要学的内容。',
      takeaway: '能说出 Git 属于分布式版本控制，以及它与集中式系统的差别。'
    },
    license: 'Pro Git 采用 CC BY-NC-SA 3.0；本站只链接官方中文版与英文原文，不复制书籍内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '中文版章节 slug 为中文而非英文，直接套用英文 slug 会返回 404；本站地址取自 git-scm.com/book/zh/v2 的官方目录。'
  },
  {
    lessonId: 'introduction-to-git',
    title: 'What is Git? Explained in 2 Minutes!',
    titleZh: '2 分钟讲清什么是 Git（Programming with Mosh）',
    type: '视频',
    requirement: 'required',
    zone: 'Assignment 第 2 条（Knowledge Check 亦指向）',
    originalUrl: 'https://www.youtube.com/watch?v=2ReR1YJrNOM',
    sourceDomain: 'youtube.com',
    originalUrlStatus: '200（oEmbed 核验：真实标题 What is Git? Explained in 2 Minutes!，作者 Programming with Mosh）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第二条：看这个“2 分钟讲清什么是 Git”的视频，它讲的是 Git 是什么，以及它怎样改善个人与团队开发者的工作流。',
      points: [
        '官方 Knowledge Check 有一题是“为什么 Git 对开发者有用”，同样指向这个视频。',
        '需要 YouTube 访问权限；本站没有可靠证据证明该视频提供中文字幕，因此不声称有中文字幕。',
        '官方描述强调两个层面：个人工作流与团队协作，看的时候可以分别对照。'
      ],
      terms: ['Git', 'version control（版本控制）', 'workflow（工作流）'],
      focus: '两分钟很短，重点听它怎样解释“保存历史版本”这件事的价值。',
      takeaway: '能用一两句话说清 Git 解决了什么问题。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'introduction-to-git',
    title: "The Odin Project's curriculum repository",
    titleZh: 'TOP 课程仓库（TheOdinProject/curriculum）',
    type: '代码仓库',
    requirement: 'required',
    zone: 'Assignment 第 4 条前半',
    originalUrl: 'https://github.com/TheOdinProject/curriculum',
    sourceDomain: 'github.com',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第四条：看看 TOP 的 GitHub 仓库，所有课程都存在这里。',
      points: [
        '这正是本站中文导读所依据的官方源文件所在位置；本站每课的 sources.json 指纹就来自这个仓库的 Markdown 文件。',
        '官方的用意不只是让你看代码，而是让你直观感受一个真实项目是怎样用 Git 组织的：目录结构、提交历史、分支与改动记录。',
        '仓库界面为英文，GitHub 没有为仓库内容提供机器翻译版本，故本站不提供中文链接。'
      ],
      terms: ['repository / repo（仓库）', 'commit history（提交历史）', 'branch（分支）'],
      focus: '看它的目录结构和最近的提交记录，感受真实项目怎样演进。',
      takeaway: '知道课程内容的源头在哪，并第一次直观看到 Git 记录协作的样子。'
    },
    license: 'TOP 课程仓库采用 CC BY-NC-SA 4.0；本站只链接仓库地址，不复制课程内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'introduction-to-git',
    title: 'Curriculum repository contributors graph',
    titleZh: '课程仓库的贡献者图表',
    type: '代码仓库视图',
    requirement: 'required',
    zone: 'Assignment 第 4 条后半',
    originalUrl: 'https://github.com/TheOdinProject/curriculum/graphs/contributors',
    sourceDomain: 'github.com',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第四条的后半句：在那里看看我们所有的贡献者，体会 Git 怎样记录全部协作努力，以及 GitHub 怎样把这些协作可视化。',
      points: [
        '这一条的重点是“可视化”：贡献者图表把大量提交记录汇总成可读的图形，让你看到谁在什么时间贡献了多少。',
        '它同时也是第 2 课官方正文提到的开源协作的具体例证：课程由众多志愿者共同维护。',
        'GitHub 首次打开该图表时可能需要几秒钟计算，属于正常现象。'
      ],
      terms: ['contributors（贡献者）', 'commit（提交）', 'graph（图表）'],
      focus: '看贡献者数量与提交分布，理解开源项目不是一个人写的。',
      takeaway: '直观理解 Git 记录协作、GitHub 呈现协作这一分工。'
    },
    license: 'GitHub 平台生成的仓库统计视图；本站只链接，不复制仓库内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  /* ===== 12 Git Basics ===== */
  {
    lessonId: 'git-basics',
    title: 'Managing remote repositories — switching remote URLs from HTTPS to SSH',
    titleZh: '管理远程仓库：把远程地址从 HTTPS 切换为 SSH',
    type: '文档',
    requirement: 'required',
    zone: 'Assignment（git push 步骤的排错说明中）',
    originalUrl: 'https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories?platform=linux#switching-remote-urls-from-https-to-ssh',
    originalUrlEffective: 'https://docs.github.com/en/get-started/git-basics/managing-remote-repositories?platform=linux',
    sourceDomain: 'docs.github.com',
    originalUrlStatus: '200（GitHub 文档目录调整，重定向到 get-started/git-basics/ 下的现役路径）',
    zhUrl: 'https://docs.github.com/zh/get-started/git-basics/managing-remote-repositories?platform=linux#switching-remote-urls-from-https-to-ssh',
    zhType: 'GitHub 官方文档简体中文版（已核验标题“管理远程仓库”，正文汉字 18956 个）',
    zhGuide: {
      why: '官方在 git push 步骤里给了一条明确的排错指引：如果此时收到 “Support for password authentication was removed on August 13, 2021. Please use a personal access token instead.” 这条消息，说明你前面的步骤做错了，是用 HTTPS 而不是 SSH 克隆的；请按切换远程地址的说明改成 SSH，然后再推送。',
      points: [
        '本课正文已给出识别方法：完整命令应类似 git clone git@github.com:USER-NAME/REPOSITORY-NAME.git；如果你的地址形如 https://github.com/USER-NAME/REPOSITORY-NAME.git，说明你选的是 HTTPS 选项，而不是课程要求的 SSH 选项。',
        '官方要求 platform=linux，对应 Linux / WSL2 的说明；其他系统可按页面提示切换。',
        '这是排错用文档，没遇到那条报错信息时可以先跳过，遇到时再回来照做。'
      ],
      terms: ['remote（远程仓库）', 'HTTPS / SSH（两种远程地址协议）', 'personal access token（个人访问令牌）'],
      focus: '只在出现密码认证被移除的报错时使用；重点是改远程地址，而不是去申请令牌绕过 SSH 配置。',
      takeaway: '能把误用 HTTPS 的仓库改成 SSH，并成功推送。'
    },
    license: 'GitHub 官方文档；本站只链接官方中文版，不复制文档内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '官方链接的锚点在重定向后的现役页面中仍然存在；本站按重定向后的路径给出中文地址，避免沿用已调整的旧目录。'
  },
  {
    lessonId: 'git-basics',
    title: "GitHub's Renaming Repository",
    titleZh: 'GitHub 的仓库改名（默认分支 master → main）',
    type: '说明仓库',
    requirement: 'reference',
    zone: '正文 Git 术语小节',
    originalUrl: 'https://github.com/github/renaming',
    sourceDomain: 'github.com',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方在讲默认分支时给了这个仓库作为更多信息：关于从 master 改名为 main 的变更说明。',
      points: [
        '本课正文已说明现状：GitHub 已把默认分支名从 master 改为 main，因此你新建仓库时默认分支会叫 main。',
        '这个仓库是 GitHub 官方为说明该变更而建的，README 里给出了改名理由与迁移指引。',
        '实际影响是命令里的分支名：官方在本课统一使用 git push origin main 这样的写法。'
      ],
      terms: ['default branch（默认分支）', 'master / main（分支名）', 'renaming（改名）'],
      focus: '只需理解“为什么你的分支叫 main 而旧教程写 master”，不必读完整迁移方案。',
      takeaway: '看到旧资料里的 master 不会困惑，知道它与 main 指同一角色。'
    },
    license: 'GitHub 官方说明仓库；本站只做链接与原创导读，不复制仓库内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'git-basics',
    title: 'Vim (text editor)',
    titleZh: 'Vim 文本编辑器（维基百科）',
    type: '百科条目',
    requirement: 'reference',
    zone: '正文 Changing the Git commit message editor 小节',
    originalUrl: 'https://en.wikipedia.org/wiki/Vim_(text_editor)',
    sourceDomain: 'en.wikipedia.org',
    originalUrlStatus: '200',
    zhUrl: 'https://zh.wikipedia.org/zh-cn/Vim',
    zhType: '中文维基百科简体中文版（已核验正文汉字 29931 个）',
    zhGuide: {
      why: '官方在讲“修改 Git 提交信息编辑器”时链接了 Vim 条目：如果你用 VS Code（按本课程你就应该用它），有办法确保在 git commit 不带 -m 参数时，不会卡在 Vim 里写提交信息。',
      points: [
        '官方说明了为什么建议改：万一你不小心漏掉 -m 参数，改掉默认编辑器是个好主意，除非你本来就喜欢用 Vim；改了没有坏处，因为你既可以在终端里写提交信息，也可以在 VS Code 里舒服地写。',
        '官方给出的配置命令是 git config --global core.editor "code --wait"。',
        'Vim 是一款历史悠久的终端文本编辑器，操作方式与常见图形编辑器差别很大，这正是新手容易“卡在里面出不来”的原因。'
      ],
      terms: ['Vim（终端文本编辑器）', 'core.editor（Git 的编辑器配置项）', 'commit message（提交信息）'],
      focus: '读条目开头了解 Vim 是什么即可；重点是执行官方那条配置命令，避免自己陷入 Vim。',
      takeaway: '理解为什么要把 Git 默认编辑器设成 VS Code，并知道万一进了 Vim 是发生了什么。'
    },
    license: '维基百科内容采用 CC BY-SA 4.0；本站只链接。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '官方原文使用 Markdown 尖括号自动链接写法 <https://…>，且地址含括号；本条目在初次程序化提取时被括号截断而漏收，已于完整性复查中补入并核验。'
  },
  /* ===== 13 Introduction to HTML and CSS ===== */
  {
    lessonId: 'introduction-to-html-and-css',
    title: 'HTML, CSS, JavaScript — What’s the Difference?',
    titleZh: 'HTML、CSS、JavaScript 有什么区别（Bryt Designs）',
    type: '文章',
    requirement: 'reference',
    zone: 'Knowledge Check 两题指向本文（含 #What_is_HTML 锚点）',
    originalUrl: 'https://brytdesigns.com/html-css-javascript-whats-the-difference/',
    originalUrlEffective: 'https://www.brytdesigns.com/html-css-javascript-whats-the-difference',
    sourceDomain: 'brytdesigns.com',
    originalUrlStatus: '200（重定向到带 www 的现役地址）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Knowledge Check 的两道题都指向这篇文章：“HTML 和 CSS 分别是什么的缩写”指向其 What is HTML 小节，“HTML、CSS 与 JavaScript 的区别是什么”指向全文。',
      points: [
        '本课正文已给出核心区分：HTML 负责网页的结构与内容，CSS 负责外观与样式，两者分工明确；JavaScript 属于后续课程范围。',
        '官方正文用了同一个类比：把网页想成人的话，HTML 是骨骼，CSS 是皮肤和衣服。',
        '这是一篇第三方设计工作室的博客文章，本站未复制其内容。'
      ],
      terms: ['HTML（HyperText Markup Language，超文本标记语言）', 'CSS（Cascading Style Sheets，层叠样式表）', 'JavaScript'],
      focus: '直接读 What is HTML 与讲区别的部分，用来回答官方 KC 的两道题。',
      takeaway: '能准确写出 HTML 与 CSS 的全称，并说清各自负责什么。'
    },
    license: 'Bryt Designs 博客文章，许可未明确标注；本站只做链接与原创导读，不翻译、不复制。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'introduction-to-html-and-css',
    title: 'HTML, CSS, JavaScript Explained [in 4 minutes for beginners]',
    titleZh: '4 分钟讲清 HTML、CSS、JavaScript（Danielle Thé）',
    type: '视频',
    requirement: 'required',
    zone: 'Assignment 第 1 条',
    originalUrl: 'https://www.youtube.com/watch?v=gT0Lh1eYk78',
    sourceDomain: 'youtube.com',
    originalUrlStatus: '200（oEmbed 核验：真实标题 HTML, CSS, JavaScript Explained [in 4 minutes for beginners]，作者 Danielle Thé）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第一条：看这个视频，在你深入每一项技术之前，它会快速概述这三种技术怎样协同工作。',
      points: [
        '官方定位它是“深入之前的快速总览”，所以不必指望它讲细节。',
        '需要 YouTube 访问权限；本站没有可靠证据证明该视频提供中文字幕，因此不声称有中文字幕。',
        '本课是 HTML 与 CSS 单元的入口课，官方要求先看总览再进入后面的具体课程。'
      ],
      terms: ['HTML', 'CSS', 'JavaScript', 'front end（前端）'],
      focus: '注意它怎样说明三者的分工与配合顺序。',
      takeaway: '对整个前端技术栈有一个整体框架，再开始逐课深入。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  /* ===== 14 HTML Elements and Tags ===== */
  {
    lessonId: 'elements-and-tags',
    title: 'HTML elements reference',
    titleZh: 'HTML 元素参考（MDN）',
    type: '文档',
    requirement: 'reference',
    zone: '正文（链接文字为 a vast list of predefined tags）',
    originalUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element',
    originalUrlEffective: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements',
    sourceDomain: 'developer.mozilla.org',
    originalUrlStatus: '200（MDN 参考区路径调整，重定向到 Reference/Elements）',
    zhUrl: 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements',
    zhType: 'MDN 官方简体中文版（已核验标题“HTML 元素参考”，正文汉字 25789 个）',
    zhGuide: {
      why: '官方在正文说明：HTML 有一份庞大的预定义标签清单，你可以用它们创建各种不同的元素；为内容使用正确的标签很重要。',
      points: [
        '官方解释了为什么重要，涉及两个方面：网站在搜索引擎中的排名，以及对依赖辅助技术（例如屏幕阅读器）上网的用户而言的可访问性。',
        '本页是查阅用的参考清单，不是需要通读的文章；用到某个标签时再来查它的含义与属性。',
        '中文版由 MDN 官方维护，每个元素都有对应的中文页面。'
      ],
      terms: ['HTML element（HTML 元素）', 'tag（标签）', 'semantic HTML（语义化 HTML）', 'accessibility（可访问性）', 'screen reader（屏幕阅读器）'],
      focus: '把它当字典用：需要时查标签含义，不要试图一次读完。',
      takeaway: '知道权威标签清单在哪，并理解选对标签会影响搜索排名与可访问性。'
    },
    license: 'MDN 内容采用 CC-BY-SA 2.5；本站只链接官方中文版，不复制文档内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'elements-and-tags',
    title: 'HTML & CSS for Absolute Beginners: What is HTML?',
    titleZh: 'HTML 与 CSS 零基础入门：什么是 HTML（Kevin Powell）',
    type: '视频',
    requirement: 'required',
    zone: 'Assignment 第 1 条',
    originalUrl: 'https://www.youtube.com/watch?v=X4sClFRMJ00',
    sourceDomain: 'youtube.com',
    originalUrlStatus: '200（oEmbed 核验：真实标题 HTML & CSS for Absolute Beginners: What is HTML?，作者 Kevin Powell）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第一条就是看 Kevin Powell 的这个视频，它是 HTML 单元的第一份视频材料。',
      points: [
        '本课正文已给出 HTML 的定义要点：HTML 由元素组成，元素通过标签告诉浏览器怎样显示内容；标签通常成对出现，有开始标签和结束标签。',
        'Kevin Powell 是官方在 HTML 与 CSS 单元多次引用的作者，后续第 15、16、18 课都有他的视频。',
        '需要 YouTube 访问权限；本站没有可靠证据证明该视频提供中文字幕，因此不声称有中文字幕。'
      ],
      terms: ['HTML element（元素）', 'tag（标签）', 'opening tag / closing tag（开始 / 结束标签）', 'attribute（属性）'],
      focus: '对照本课中文讲解的元素与标签结构看，注意他怎样解释成对标签。',
      takeaway: '能自己写出一个带开始标签、内容与结束标签的完整元素。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  /* ===== 15 HTML Boilerplate ===== */
  {
    lessonId: 'html-boilerplate',
    title: 'W3C Markup Validation Service',
    titleZh: 'W3C 标记校验服务（HTML validator）',
    type: '工具',
    requirement: 'required',
    zone: 'Assignment 第 2 条',
    originalUrl: 'https://validator.w3.org/#validate_by_input',
    sourceDomain: 'validator.w3.org',
    originalUrlStatus: '403（自动化请求被站点拒绝）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第二条：把你的 boilerplate 拿去 W3 的 HTML validator 校验。',
      points: [
        '官方解释了它的价值：校验器能确保你的标记是正确的，而且是极好的学习工具，因为它会反馈你可能经常犯却没意识到的语法错误，例如漏掉的结束标签、HTML 里多余的空格。',
        '官方指定的入口是 validate by input（粘贴代码校验）这个标签页；同一站点也支持按地址或直接上传文件校验。',
        '这是 W3C 提供的公共服务，与本站无关联；粘贴代码即等于把该段代码发送给第三方服务，请勿粘贴包含个人信息的文件。'
      ],
      terms: ['validator（校验器）', 'markup（标记）', 'syntax error（语法错误）', 'closing tag（结束标签）'],
      focus: '用 validate by input 粘贴你的 boilerplate，逐条看它报的问题并改正。',
      takeaway: '建立一个可长期使用的 HTML 自检手段，而不是靠肉眼找错误。'
    },
    license: 'W3C 公共服务；本站只链接，不代理其页面，不代为提交任何代码。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '自动化核验返回 HTTP 403（W3C 校验服务对非浏览器请求的拦截），不等于服务失效；该地址为官方原文所列，需在浏览器中打开确认。'
  },
  {
    lessonId: 'html-boilerplate',
    title: 'HTML and CSS for Beginners Part 2: Building your first web page!',
    titleZh: 'HTML 与 CSS 新手系列 第 2 集：搭建你的第一个网页（Kevin Powell）',
    type: '视频',
    requirement: 'required',
    zone: 'Assignment 第 1 条',
    originalUrl: 'https://www.youtube.com/watch?v=V8UAEoOvqFg',
    sourceDomain: 'youtube.com',
    originalUrlStatus: '200（oEmbed 核验：真实标题 HTML and CSS for Beginners Part 2: Building your first web page!，作者 Kevin Powell）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第一条：看并跟着做 Kevin Powell 这个精彩的“搭建你的第一个网页”视频。',
      points: [
        '官方用的是 Watch and follow along（看并跟着做），所以这一项要求动手，不只是观看。',
        '本课正文已列出 boilerplate 的固定组成：DOCTYPE 声明、html 元素及其 lang 属性、head 与 body、meta charset、title。',
        '需要 YouTube 访问权限；本站没有可靠证据证明该视频提供中文字幕，因此不声称有中文字幕。'
      ],
      terms: ['boilerplate（样板代码）', 'DOCTYPE（文档类型声明）', 'head / body（头部 / 主体）', 'meta charset（字符编码声明）'],
      focus: '跟着敲一遍完整的 boilerplate，重点理解每一行为什么必须存在。',
      takeaway: '不看参考也能写出一个合法的 HTML boilerplate。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '官方链接带 t=93s 起播参数，本站按同一视频归并。'
  },
  /* ===== 16 Working with Text ===== */
  {
    lessonId: 'working-with-text',
    title: 'Lorem ipsum',
    titleZh: 'Lorem ipsum（乱数假文，维基百科）',
    type: '百科条目',
    requirement: 'reference',
    zone: 'Assignment 第 3 条（练习任务中）',
    originalUrl: 'https://en.wikipedia.org/wiki/Lorem_ipsum',
    sourceDomain: 'en.wikipedia.org',
    originalUrlStatus: '200',
    zhUrl: 'https://zh.wikipedia.org/zh-cn/Lorem_ipsum',
    zhType: '中文维基百科简体中文版（用 zh-cn variant 强制简体，已核验正文汉字 18391 个）',
    zhGuide: {
      why: '官方 Assignment 第三条要求做一个纯博客文章页面练手，并说你可以用 Lorem Ipsum 生成占位假文，在建站过程中代替真实文字。',
      points: [
        '官方还给了更方便的做法：VS Code 内置了生成 lorem ipsum 的快捷方式，在想要假文的那一行输入 lorem 再按 Enter 键，就能直接生成占位文本。',
        'Lorem ipsum 是一段没有实际含义的拉丁文变体文本，用途是让排版效果可见，同时不让读者被内容分心。',
        '中文条目已核验为简体版本，可对照阅读其来历。'
      ],
      terms: ['lorem ipsum（乱数假文 / 占位文本）', 'dummy text（假文）', 'placeholder（占位内容）'],
      focus: '知道它的用途是占位即可；实际练习时直接用 VS Code 的 lorem 快捷方式更快。',
      takeaway: '做排版练习时不再因为“没内容可写”而卡住。'
    },
    license: '维基百科内容采用 CC BY-SA 4.0；本站只链接。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'working-with-text',
    title: 'HTML & CSS for Beginners Part 3: Paragraphs and Headings',
    titleZh: 'HTML 与 CSS 新手系列 第 3 集：段落与标题（Kevin Powell）',
    type: '视频',
    requirement: 'required',
    zone: 'Assignment 第 1 条',
    originalUrl: 'https://www.youtube.com/watch?v=yqcd-XkxZNM',
    sourceDomain: 'youtube.com',
    originalUrlStatus: '200（oEmbed 核验：真实标题 HTML & CSS for Beginners Part 3: Paragraphs and Headings，作者 Kevin Powell）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第一条要求看 Kevin Powell 的段落与标题视频，对应本课最核心的两组元素。',
      points: [
        '本课正文已给出要点：段落用 p 元素；标题用 h1 到 h6 六个层级，h1 最重要、通常每页只用一次，h6 最次要。',
        '官方在本课还特别提醒不要靠加粗或放大字号来伪装标题，而要用真正的标题元素，这与可访问性和搜索排名有关。',
        '需要 YouTube 访问权限；本站没有可靠证据证明该视频提供中文字幕，因此不声称有中文字幕。'
      ],
      terms: ['paragraph（段落，p 元素）', 'heading（标题，h1–h6）', 'heading hierarchy（标题层级）'],
      focus: '注意他怎样选择合适的标题层级，以及为什么不能跳级使用。',
      takeaway: '能用正确的 p 与 h1–h6 组织一篇文章的结构。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '官方链接带 t=35s 起播参数，本站按同一视频归并。'
  },
  {
    lessonId: 'working-with-text',
    title: 'HTML & CSS for Beginners Part 4: Bold and Italic text and HTML comments',
    titleZh: 'HTML 与 CSS 新手系列 第 4 集：粗体、斜体与 HTML 注释（Kevin Powell）',
    type: '视频',
    requirement: 'required',
    zone: 'Assignment 第 2 条',
    originalUrl: 'https://www.youtube.com/watch?v=gW6cBZLUk6M',
    sourceDomain: 'youtube.com',
    originalUrlStatus: '200（oEmbed 核验：真实标题 HTML & CSS for Beginners Part 4: Bold and Italic text and HTML comments，作者 Kevin Powell）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 第二条要求看这个视频，它覆盖粗体、斜体文本与 HTML 注释。',
      points: [
        '本课正文已区分了两组元素：b 与 strong 都显示为粗体，i 与 em 都显示为斜体，但 strong 与 em 带有语义含义，浏览器与辅助技术会区别对待。',
        '官方 Assignment 第 3 条的练习任务明确要求段落中要有加粗和斜体的文字，所以这一集与练习直接对应。',
        '需要 YouTube 访问权限；本站没有可靠证据证明该视频提供中文字幕，因此不声称有中文字幕。'
      ],
      terms: ['strong / b（强调 / 粗体）', 'em / i（着重 / 斜体）', 'HTML comment（HTML 注释）'],
      focus: '重点听语义元素与非语义元素的差别，这是本课 KC 常考的点。',
      takeaway: '知道什么时候该用 strong/em 而不是 b/i，并会写 HTML 注释。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '官方链接带 t=5s 起播参数，本站按同一视频归并。'
  },
  /* ===== 17 HTML Lists ===== */
  {
    lessonId: 'lists',
    title: 'The <ul> element',
    titleZh: 'MDN：<ul> 无序列表元素',
    type: '文档',
    requirement: 'reference',
    zone: '正文 Unordered lists 小节（链接文字为 the `<ul>` element）',
    originalUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ul',
    sourceDomain: 'developer.mozilla.org',
    originalUrlStatus: '200',
    zhUrl: 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/ul',
    zhType: 'MDN 官方简体中文版（已核验标题“<ul>：无序列表元素”，正文汉字 8379 个）',
    zhGuide: {
      why: '官方在讲无序列表时直接链接了 MDN 的 ul 元素页面，作为该元素的权威参考。',
      points: [
        '本课正文已给出用法：无序列表用 ul 元素创建，列表中的每一项用列表项元素 li 创建；无序列表的每一项前面会显示项目符号。',
        'MDN 元素页会列出该元素的全部属性、可嵌套的内容与可访问性说明，比课程正文更完整。',
        '中文版与英文版是同一篇 MDN 文档，属性表格结构一致。'
      ],
      terms: ['ul（unordered list，无序列表）', 'li（list item，列表项）', 'bullet（项目符号）'],
      focus: '读属性与可访问性两节；示例部分本课正文已经覆盖。',
      takeaway: '需要查 ul 的细节时知道去 MDN 中文页，而不是靠记忆。'
    },
    license: 'MDN 内容采用 CC-BY-SA 2.5；本站只链接官方中文版，不复制文档内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '官方链接文字为 the `<ul>` element，初次提取时被 HTML 标签剥离规则误处理成空标签名；本条标题已按官方原文修正。'
  },
  {
    lessonId: 'lists',
    title: 'The <ol> element',
    titleZh: 'MDN：<ol> 有序列表元素',
    type: '文档',
    requirement: 'reference',
    zone: '正文 Ordered lists 小节（链接文字为 the `<ol>` element）',
    originalUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ol',
    sourceDomain: 'developer.mozilla.org',
    originalUrlStatus: '200',
    zhUrl: 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/ol',
    zhType: 'MDN 官方简体中文版（已核验页面为简体中文，正文汉字 7910 个）',
    zhGuide: {
      why: '官方在讲有序列表时直接链接了 MDN 的 ol 元素页面，作为该元素的权威参考。',
      points: [
        '本课正文已给出用法：有序列表用 ol 元素创建，其中每一项同样用 li 创建，区别是有序列表的每一项以数字开头而不是项目符号。',
        '选择 ul 还是 ol 取决于内容本身是否有顺序：步骤、排名用 ol，并列项用 ul。',
        '中文版与英文版是同一篇 MDN 文档。'
      ],
      terms: ['ol（ordered list，有序列表）', 'li（list item，列表项）', 'numbering（编号）'],
      focus: '读属性一节，了解 start、reversed、type 等控制编号的属性。',
      takeaway: '能按内容语义正确选择 ul 或 ol，并知道编号可以控制。'
    },
    license: 'MDN 内容采用 CC-BY-SA 2.5；本站只链接官方中文版，不复制文档内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '官方链接文字为 the `<ol>` element，初次提取时被 HTML 标签剥离规则误处理成空标签名；本条标题已按官方原文修正。'
  },
  /* ===== 18 HTML Links and Images ===== */
  {
    lessonId: 'links-and-images',
    title: 'What is a URL? (basics: anatomy of a URL)',
    titleZh: '什么是 URL？（基础：URL 的组成）',
    type: '文档',
    requirement: 'reference',
    zone: '正文 Absolute and relative links 小节（链接文字为 scheme and domain）',
    originalUrl: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL#basics_anatomy_of_a_url',
    originalUrlEffective: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL',
    sourceDomain: 'developer.mozilla.org',
    originalUrlStatus: '200（MDN 学习区路径重组，重定向到现役地址）',
    zhUrl: 'https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL#basics_anatomy_of_a_url',
    zhType: 'MDN 官方简体中文版（已核验标题“什么是 URL？”，正文汉字 10521 个）',
    zhGuide: {
      why: '官方在讲绝对链接时链接了它：指向互联网上其他网站页面的链接叫绝对链接，典型的绝对链接由 scheme://domain/path 三部分组成，并且总会包含目标的 scheme 与 domain。',
      points: [
        '本课正文已区分两种链接：绝对链接包含完整的 scheme 与 domain；相对链接只写出与本站目标页面的位置关系。',
        '官方指定的锚点是 URL 的组成（anatomy of a URL）这一节，正好对应 scheme、domain、path 的拆解。',
        '中文版与英文版是同一篇 MDN 文档，锚点在中文页同样存在。'
      ],
      terms: ['URL（Uniform Resource Locator，统一资源定位符）', 'scheme（协议）', 'domain（域名）', 'path（路径）', 'absolute / relative link（绝对 / 相对链接）'],
      focus: '读 URL 组成那一节，把 scheme://domain/path 三段的含义弄清楚。',
      takeaway: '看到一个链接能立刻分辨它是绝对链接还是相对链接，并说出各部分作用。'
    },
    license: 'MDN 内容采用 CC-BY-SA 2.5；本站只链接官方中文版，不复制文档内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'links-and-images',
    title: 'Referer header: privacy and security concerns',
    titleZh: 'Referer 请求头：隐私与安全问题（MDN）',
    type: '文档',
    requirement: 'reference',
    zone: '正文 noreferrer 属性说明处',
    originalUrl: 'https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Referer_header:_privacy_and_security_concerns#the_referrer_problem',
    sourceDomain: 'developer.mozilla.org',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方在解释 noreferrer 属性时链接了它：noreferrer 与 noopener 作用相同，但还会阻止原页面的某些细节被传给新页面，因为 referrer 信息并不总是适合分享。',
      points: [
        '本课正文已给出 noopener 的作用：阻止新标签页访问原页面，否则会带来像 tabnabbing 这类钓鱼攻击的可能；现代浏览器对任何带 target="_blank" 的链接都会自动设置 noopener，但为了兼容历史浏览器，你仍常见到手动写上它。',
        'referrer 信息指的是“访客从哪个页面来”，把它传给外部站点在某些场景下会造成隐私泄露。',
        '本站核验过该页的 zh-CN 语言版本：返回 404，MDN 未提供这一篇的中文翻译，因此不提供中文链接。'
      ],
      terms: ['noopener', 'noreferrer', 'referrer / referer（来源页信息）', 'target="_blank"（新标签页打开）'],
      focus: '理解为什么外链要加这两个属性；具体隐私机制可略读。',
      takeaway: '写外链时知道 noopener 与 noreferrer 各自防的是什么。'
    },
    license: 'MDN 内容采用 CC-BY-SA 2.5；本站只做链接与原创导读，不复制文档内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '已核验 developer.mozilla.org/zh-CN/docs/Web/Privacy/Guides/Referer_header:_privacy_and_security_concerns 返回 404，该篇无官方中文版，故 zhUrl 为空，不提供机器翻译镜像。'
  },
  {
    lessonId: 'links-and-images',
    title: 'Interting is Hard — Links and Images',
    titleZh: 'Interting is Hard：链接与图片',
    type: '教程文章',
    requirement: 'required',
    zone: 'Assignment（并有一题 Knowledge Check 指向其 #image-formats 小节）',
    originalUrl: 'https://internetingishard.netlify.app/html-and-css/links-and-images',
    sourceDomain: 'internetingishard.netlify.app',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 要求阅读并跟着敲代码：Read and code along with Interneting is Hard’s article on Links and Images，并特别注意讲四种主要图片格式的那一节。',
      points: [
        '官方 Knowledge Check 有一题是“网页上可用的四种主要图片格式是什么”，指向该文的 image formats 小节，答案以该文为准。',
        '官方明确指出了与该文的一处不同意见：这篇文章建议用 CSS 设置图片尺寸，而本课程仍然建议像本课前面讲的那样，在所有图片上设置 width 与 height 属性。遇到冲突时以 TOP 课程要求为准。',
        '这是一本免费在线教程，与本站无关联；本站未复制或翻译其内容。'
      ],
      terms: ['image format（图片格式）', 'JPEG / PNG / GIF / SVG', 'width and height attributes（宽高属性）', 'alt text（替代文本）'],
      focus: '按官方要求重点读图片格式那一节；设置尺寸的做法以本课正文为准，不采纳该文的 CSS 方案。',
      takeaway: '能说清四种主要图片格式各自的适用场景，并按 TOP 要求给图片加上 width、height 与 alt。'
    },
    license: 'Interting is Hard 为第三方免费在线教程，版权归原作者所有；本站只做链接与原创导读，不翻译、不复制。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '官方两处链接（正文条目与 KC 锚点）指向同一页面，本站按规范化地址合并为一条。标题拼写按该站自有的 “Interting is Hard” 原样保留。'
  },
  {
    lessonId: 'links-and-images',
    title: 'Reverse Tabnabbing (OWASP)',
    titleZh: '反向 Tabnabbing 攻击（OWASP）',
    type: '安全说明',
    requirement: 'reference',
    zone: '正文 noopener 属性说明处',
    originalUrl: 'https://owasp.org/www-community/attacks/Reverse_Tabnabbing',
    sourceDomain: 'owasp.org',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方在解释 noopener 时链接了它，用来说明不加这个属性可能带来哪一类钓鱼攻击。',
      points: [
        '官方正文的说法是：noopener 阻止新标签页访问原页面，否则会带来像 tabnabbing 这类钓鱼攻击的可能；现代浏览器对所有带 target="_blank" 的链接都会自动设置它，但为了兼容历史浏览器，你仍会经常看到手动写上 noopener。',
        '攻击的大致形式是：新打开的页面通过 window.opener 反向控制原来那个标签页，把它替换成一个仿冒登录页，用户切回去时就被骗了。',
        'OWASP 是国际性的开放 Web 安全社区，页面为英文；本站未复制或翻译其内容。'
      ],
      terms: ['tabnabbing（标签页劫持）', 'noopener', 'window.opener', 'phishing（钓鱼）'],
      focus: '理解 noopener 防的是哪一种具体风险，不必深入攻击实现细节。',
      takeaway: '知道为什么外链要写 rel="noopener noreferrer"，而不是当成可省的样板。'
    },
    license: 'OWASP 社区页面，采用 CC BY-SA 3.0；本站只做链接与原创导读，不复制页面内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'links-and-images',
    title: 'Attribution — How, when and where',
    titleZh: '图片署名：怎样、何时、在哪里署名',
    type: '文档',
    requirement: 'reference',
    zone: '正文 Image licensing and attribution 小节（链接文字为 attribution）',
    originalUrl: 'https://support.freepik.com/s/article/Attribution-How-when-and-where?language=en_US',
    sourceDomain: 'support.freepik.com',
    originalUrlStatus: '403（自动化请求被拒绝，且重定向到另一域名）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方在讲图片许可与署名时链接了它：一种简单的署名方式是在仓库的 README 文件里写上创作者姓名与联系方式，或者按该页说明进行署名。',
      points: [
        '本课正文已给出署名要求的核心：使用他人图片时要遵守其许可条款，并按要求注明作者与来源。',
        '官方这一节还提醒：即使图片标注为免费，也可能有署名要求；不确定许可时应当保守处理。',
        '本站核验发现该地址已重定向到另一域名 magnific.com 的文档页，内容主题与原先的 freepik 署名说明不完全一致，因此只保留官方原始链接供你自行判断，不把它当作可靠中文或英文替代来源。'
      ],
      terms: ['attribution（署名）', 'license（许可）', 'stock image（图库图片）', 'README（仓库说明文件）'],
      focus: '掌握“用别人的图就要按要求署名”这个原则；具体署名格式以你所用图库当时的条款为准。',
      takeaway: '在自己的项目里为使用的图片留下正确的署名信息。'
    },
    license: '第三方图库帮助文档，版权归原作者；本站只做链接与原创导读，不复制文档内容。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '自动核验返回 HTTP 403，且重定向目标跨域到 https://www.magnific.com/ai/docs/licenses-attribution，与该链接文字所指的署名说明主题已不完全对应。本站保留官方原文所列地址不改动，同时明确告知这一情况，未声称该链接已核验为内容相符。'
  },
  {
    lessonId: 'links-and-images',
    title: 'Unsplash practice image (dog photo)',
    titleZh: 'Unsplash 练习图片（狗的照片）',
    type: '图片素材',
    requirement: 'required',
    zone: 'Assignment 两处（下载练习图片 / 下载这只狗的图库图片）',
    originalUrl: 'https://unsplash.com/photos/Mv9hjnEUHR4/download?force=true&w=640',
    originalUrlEffective: 'https://images.unsplash.com/photo-1517849845537-4d257902454a',
    sourceDomain: 'unsplash.com',
    originalUrlStatus: '200（直接返回图片文件，重定向到 Unsplash 图片 CDN）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 两次要求下载这张练习图片：一次是下载我们的练习图片并移进刚创建的 images 目录，另一次是下载这只狗的图库图片。',
      points: [
        '它是官方指定的练习素材，后续步骤要用它练习 img 元素的 src、alt、width 与 height。',
        '官方链接带 force=true 与 w=640 参数，作用是直接触发下载并指定宽度为 640 像素。',
        '本课正文同时讲了许可与署名：使用 Unsplash 等图库的图片时仍需遵守其许可条款，必要时署名。'
      ],
      terms: ['src（图片来源路径）', 'alt（替代文本）', 'images directory（图片目录）', 'license（许可）'],
      focus: '下载后放进项目自己的 images 目录，用相对路径引用它。',
      takeaway: '有一个真实的本地图片文件，可以完整练习图片元素的各个属性。'
    },
    license: 'Unsplash 图片按 Unsplash License 提供；本站只链接官方指定的下载地址，不镜像、不转存该图片文件。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '官方 Assignment 在两处给出同一地址，本站合并为一条。'
  },
  {
    lessonId: 'links-and-images',
    title: 'HTML & CSS for Beginners Part 5: Links',
    titleZh: 'HTML 与 CSS 新手系列 第 5 集：链接（Kevin Powell）',
    type: '视频',
    requirement: 'required',
    zone: 'Assignment（视频列表第 1 项）',
    originalUrl: 'https://www.youtube.com/watch?v=tsEQgGjSmkM',
    sourceDomain: 'youtube.com',
    originalUrlStatus: '200（oEmbed 核验：真实标题 HTML & CSS for Beginners Part 5: Links，作者 Kevin Powell）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 的视频列表第 1 项，对应本课的链接部分。',
      points: [
        '本课正文已给出链接要点：a 元素配合 href 属性创建链接；链接目标可以是绝对链接或相对链接；target="_blank" 让链接在新标签页打开。',
        '正文还讲了 rel 属性的 noopener 与 noreferrer 两个取值及其安全与隐私作用。',
        '需要 YouTube 访问权限；本站没有可靠证据证明该视频提供中文字幕，因此不声称有中文字幕。'
      ],
      terms: ['anchor / a element（锚元素）', 'href（超链接引用）', 'target（打开方式）', 'rel（关系属性）'],
      focus: '对照本课正文的绝对链接与相对链接区别看，注意他怎么写 href。',
      takeaway: '能正确写出站内相对链接与站外绝对链接，并按需加上 rel 属性。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'links-and-images',
    title: 'HTML & CSS for Beginners Part 6: Images',
    titleZh: 'HTML 与 CSS 新手系列 第 6 集：图片（Kevin Powell）',
    type: '视频',
    requirement: 'required',
    zone: 'Assignment（视频列表第 2 项）',
    originalUrl: 'https://www.youtube.com/watch?v=0xoztJCHpbQ',
    sourceDomain: 'youtube.com',
    originalUrlStatus: '200（oEmbed 核验：真实标题 HTML & CSS for Beginners Part 6: Images，作者 Kevin Powell）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 的视频列表第 2 项，对应本课的图片部分。',
      points: [
        '本课正文已给出图片要点：img 元素是自闭合元素，用 src 指定图片位置，用 alt 提供替代文本。',
        '官方特别强调应当给所有图片设置 width 与 height 属性，这一点与它推荐的 Interneting is Hard 文章的建议不同，以 TOP 课程要求为准。',
        '需要 YouTube 访问权限；本站没有可靠证据证明该视频提供中文字幕，因此不声称有中文字幕。'
      ],
      terms: ['img element（图片元素）', 'src（来源）', 'alt（替代文本）', 'self-closing tag（自闭合标签）'],
      focus: '注意 alt 文本怎么写才有意义，以及宽高属性的作用。',
      takeaway: '能写出带 src、alt、width、height 的完整图片元素。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  {
    lessonId: 'links-and-images',
    title: 'HTML & CSS for Beginners Part 7: File Structure',
    titleZh: 'HTML 与 CSS 新手系列 第 7 集：文件结构（Kevin Powell）',
    type: '视频',
    requirement: 'required',
    zone: 'Assignment（视频列表第 3 项）',
    originalUrl: 'https://www.youtube.com/watch?v=ta3Oxx7Yqbo',
    sourceDomain: 'youtube.com',
    originalUrlStatus: '200（oEmbed 核验：真实标题 HTML & CSS for Beginners Part 7: File Structure，作者 Kevin Powell）',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 的视频列表第 3 项，讲的是项目文件怎样组织，直接决定相对路径怎么写。',
      points: [
        '本课正文已给出做法：Assignment 要求把下载的练习图片移进项目里刚创建的 images 目录，也就是把素材集中放在专门目录下。',
        '文件结构清晰之后，相对路径才稳定：从 HTML 文件指向 images 目录下的图片，写法形如 images/文件名。',
        '需要 YouTube 访问权限；本站没有可靠证据证明该视频提供中文字幕，因此不声称有中文字幕。'
      ],
      terms: ['file structure（文件结构）', 'directory / folder（目录）', 'relative path（相对路径）'],
      focus: '注意他怎样安排 HTML 文件与图片目录的相对位置。',
      takeaway: '能规划一个清晰的项目目录，并据此写出正确的相对路径。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  /* ===== 19 Commit Messages ===== */
  {
    lessonId: 'commit-messages',
    title: 'How to Write a Git Commit Message',
    titleZh: '怎样写 Git 提交信息（Chris Beams）',
    type: '文章',
    requirement: 'required',
    zone: 'Assignment（Knowledge Check 两题分别指向 #intro 与 #limit-50）',
    originalUrl: 'https://cbea.ms/git-commit',
    sourceDomain: 'cbea.ms',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方 Assignment 说：这篇文章涵盖了怎样写好提交信息的所有主要方面；整篇文章都很好、很有信息量，但文章的核心是“优秀提交信息的七条规则”。',
      points: [
        '官方 Knowledge Check 有两题指向它：“写好提交信息与良好提交历史有哪两个好处”指向 intro 小节，“提交信息的主题行应该是多少字符”指向 limit-50 小节。',
        '官方明确圈定了重点：七条规则那一节是文章的核心，时间有限时优先读它。',
        '本课正文已给出七条规则中的关键几条：主题行与正文之间空一行、主题行不超过 50 个字符、正文每行不超过 72 个字符、用祈使语气写。',
        '这是一篇第三方技术文章，本站未翻译或复制其内容。'
      ],
      terms: ['commit message（提交信息）', 'subject line（主题行）', 'body（正文）', 'imperative mood（祈使语气）'],
      focus: '直接读七条规则那一节，再回头读 intro 回答官方 KC 的第一题。',
      takeaway: '能按七条规则写出规范的提交信息，并说清良好提交历史的两个好处。'
    },
    license: 'Chris Beams 的原创文章，版权归作者所有；本站只做链接与原创导读，不翻译、不复制。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: '官方三处链接（Assignment 全文、KC 的 #intro、KC 的 #limit-50）指向同一篇文章的不同锚点，本站按规范化地址合并为一条，锚点信息保留在要点中。'
  },
  {
    lessonId: 'commit-messages',
    title: 'Code Spell Checker (VS Code extension)',
    titleZh: 'Code Spell Checker（VS Code 拼写检查扩展）',
    type: '工具扩展',
    requirement: 'optional',
    zone: 'Assignment 补充说明（Additional Resources 语境）',
    originalUrl: 'https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker',
    sourceDomain: 'marketplace.visualstudio.com',
    originalUrlStatus: '200',
    zhUrl: null,
    zhType: null,
    zhGuide: {
      why: '官方在 Assignment 的补充说明里提到：用 VS Code 作为文本编辑器（按 Git Basics 那一节的设置你就应该已经配好了）能让你方便地写多行提交信息、方便地看到每行的字符长度，还能用 VS Code 拼写检查扩展确认拼写正确。',
      points: [
        '官方把它作为“能让你确认拼写正确”的工具提出，属于提升效率的可选项，不是必须安装的组件。',
        'VS Code 扩展市场有同类拼写检查扩展，官方点名的是 streetsidesoftware.code-spell-checker 这一个。',
        '安装扩展需要联网，并从第三方市场获取代码；安装前可以自己查看扩展的发布者与评价。'
      ],
      terms: ['extension（扩展）', 'spell check（拼写检查）', 'marketplace（扩展市场）'],
      focus: '如果提交信息里常出现英文拼写错误，装它有价值；否则可以先跳过。',
      takeaway: '知道有一个能减少提交信息拼写错误的工具可选。'
    },
    license: '第三方 VS Code 扩展，版权归其发布者；本站只链接扩展市场页面，不代为安装、不分发扩展。',
    handling: 'link-only',
    verifiedAt: '2026-09-10',
    note: ''
  },
  /* === END === */
  ]
};
