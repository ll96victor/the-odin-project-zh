/* 本课外部资料清单（v3；v4.11.1 扩展中文内容与 handling 语义）。
 * 数据来源：重新拉取 19 课官方 curriculum Markdown（指纹与 sources.json 全部一致），
 * 程序化提取正文与 Assignment 中明确要求学习的外部资源，再逐条联网核验。
 * 分类依据 v3 交接 §3.2：
 *   A 类 = 有已核验的官方中文版本，同时给出中文版与英文原文入口；
 *   C 类 = 没有可靠中文版，提供本站原创中文导读要点 + 英文原文链接。
 * v4.11.1 起 handling 有两个合法值（tests/content.test.cjs 钉住）：
 *   link-only = 只做链接与本站原创导读——许可未明确标注的条目一律如此，不翻译、不复制；
 *   zh-translation = 许可明确为 CC 系列且无官方中文版的文本条目（14 条），本站提供中文精译，
 *     译文采用与原作相同的 CC 许可并带署名、来源与译者说明。第 15 条 CC 条目
 *     shell-lesson-data.zip 为二进制数据文件，无文本可译，保持 link-only。
 * zhGuide.overview（中文速览，84 条每条一段）与 zhTranslation（精译）为 v4.11.1 增量字段，
 * 既有 why / points / terms / focus / takeaway 全部保留。
 * zhGuide 内容只依据官方 Markdown 对该资源的说明与本站已核验事实编写，不臆测第三方页面的具体论点。
 * 精译全部依据 2026-09-18 真实抓取的原文编写（各条 translatorNote 记录了抓取日期与依据）。 */
window.ODIN_RESOURCES = {
  verifiedAt: '2026-09-10',
  method: '重新拉取官方 curriculum raw Markdown 并按 SHA-256 比对指纹（19 课全部未变）→ 程序化提取正文 / Assignment / Knowledge Check 中的外部链接 → 按重定向后的规范化地址去重 → 逐条 curl 核验状态码与重定向目标 → 对中文候选做内容级语言核验（统计正文汉字数，不只看 HTTP 200）→ 视频另用 YouTube oEmbed 公开接口核验可用性与真实标题。',
  policy: {
    handling: 'link-only 或 zh-translation（v4.11.1 起两个合法值）',
    noTranslation: '许可未明确标注的第三方内容一律不翻译、不复制，只提供链接与本站原创中文导读/速览；许可明确为 CC 系列且无官方中文版的文本来源，本站提供中文精译——译文采用与原作相同的 CC 许可，并带署名、来源标注与译者修改说明。',
    noProxy: '不使用嵌入框架、不做代理网页、不注入第三方页面、不编写改动第三方站点的用户脚本。',
    subtitleClaim: '没有可靠证据证明存在中文字幕的视频，一律不声称有中文字幕。',
    fallback: '无法确认版权许可时，默认只做中文摘要 / 导读加原始链接。'
  },
  stats: { total: 84, withZh: 24, guideOnly: 60, verifyLimited: 5, withTranslation: 14 },
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
      overview: '官方 Assignment 第一条就是读 TOP 的 About 页面，它回答的是「这门课是谁做的、为什么免费、按什么理念编排」这三个背景问题。本站第 1 课官方正文已给出核心定位：TOP 是一个开源社区，目标是聚合互联网上最好的信息源，把学习者从零带到全栈开发者；About 页面会展开这个定位的来历与维护方式。这属于「了解你正在用的东西」的背景阅读，不含技术操作，看它怎样描述课程理念与维护方式即可，不必逐字精读。',
      why: '官方 Assignment 第一条就是读 About 页面，用来了解这门课是谁做的、为什么免费、按什么理念编排。',
      points: [
        '本页第 1 课官方正文已给出核心定位：TOP 是一个开源社区，目标是聚合互联网上最好的信息源，把学习者从零带到全栈开发者。',
        'About 页面会展开这个定位的来历与维护方式，属于“了解你正在用的东西”的背景阅读，不含技术操作。'
      ],
      terms: ['open source（开源）', 'curriculum（课程体系）', 'full-stack（全栈）'],
      focus: '看它怎样描述课程理念与维护方式，不必逐字精读。',
      takeaway: '能说出 TOP 是什么、为什么免费、由谁维护。'
    },
    license: 'TOP 站点内容采用 CC BY-NC-SA 4.0（与本站同源许可）；本站提供中文精译（见卡内译文区块），译文采用与原作相同的许可。',
    zhTranslation: {
      kind: 'full',
      attribution: '原文《About The Odin Project》，来源：The Odin Project 官网（theodinproject.com/about），作者：The Odin Project 社区。',
      licenseNote: '原文采用 CC BY-NC-SA 4.0 许可；本译文采用与原作相同的 CC BY-NC-SA 4.0 许可。',
      translatorNote: '本站精译（AI 辅助翻译、按本站纪律人工核对结构与红线），翻译日期 2026-09-18，依据当日抓取的页面正文。',
      modifications: '全文翻译；省略了全站公共导航、侧边栏、页脚与捐赠入口等非正文内容。概览数字为抓取当日的动态数据，会随时间变化。',
      body: [
        'The Odin Project 是那种让人感叹「我学习的时候要是早有它就好了」的资源。不是每个人都有机会接受计算机科学教育，也不是每个人都付得起强化编程学校的费用，而且这两条路本来也未必适合每个人。这个项目就是为那些想靠自己闯出来、同时又想要高质量教育的人填补这个空缺而设计的。',
        '# 你在 The Odin Project 能得到什么',
        '- 一条成为开发者的完整路线图：我们免费、全面的课程体系会把你装备成一名全栈开发者，无论你现在的经验水平如何。',
        '- 在做中学：最有效的学习发生在构建项目的过程中，所以我们在课程体系中策略性地布置了项目。这些项目会成为你可以在简历上展示的有力作品集。',
        '- 获得他人的支持：课程维护者在无数志愿者的帮助下运营着一个 Discord 社区，课程里的任何问题你都能在那里得到帮助。',
        '- 开源且由社区驱动：你可以参与贡献我们的开源课程、在 Discord 社区里帮助他人，以此加深理解并提升你的 GitHub 技能。',
        '# The Odin Project 概览',
        '页面展示的概览数据：超过 190 万学习者、5000 多位贡献者、创立于 2013 年。',
        '# The Odin Project 的起源',
        'The Odin Project 提供一套可以完全在线学习的免费开源编程课程。自创立以来，它帮助了许多学员受雇成为开发者，也帮助了无数其他人学到足以完成自己个人项目的编程知识。',
        'Erik Trautman 于 2013 年创立了 The Odin Project。目前它由一支志愿者团队维护并持续改进，其中许多人自己就是跟着我们学会编程的。许多人能从这套课程走向成功，是因为它采用动手实践的学习方式并强调构建项目。课程内容经过精心甄选，以确保内容保持最新。',
        '# 开源',
        '这个网站和它托管的课程完全开源。这意味着任何人都可以为网站开发新功能、修复既有 bug。课程本身同样如此：任何人都可以编写新课、添加新资源、改进现有课程。',
        '没有世界各地贡献者的辛勤工作，就不会有 The Odin Project。如果你有兴趣帮助我们把它变得更好，请了解怎样做贡献。',
        '# 想联系我们？',
        '可以在 Discord（一个聊天与社交平台）上与我们友好的社区交流，或者给我们发电子邮件。如果你想回馈社区，可以通过贡献我们的开源项目或提供资金支持来实现。'
      ]
    },
    handling: 'zh-translation',
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
      overview: '官方 Assignment 第二条要求浏览 TOP 的 FAQ 页面，它集中回答了初学者最常问的课程使用问题，例如进度安排、时间投入、是否要买设备、能否跳课。读它之前先记住本站第 1 课已给出的官方硬性规则：不要跳过任何内容，只有 Additional Resources 和明确标注 Optional 的部分可选。FAQ 不必通读，扫一遍标题、把你当下关心的几条读完即可，其余以后遇到同类问题再回来查。',
      why: '官方 Assignment 第二条要求浏览 FAQ，它集中回答了初学者最常问的课程使用问题。',
      points: [
        '本页第 1 课已讲清课程的硬性规则：不要跳过任何内容，只有 Additional Resources 和明确标注 Optional 的部分可选。',
        'FAQ 通常覆盖进度、时间投入、是否要买设备、能否跳课等常见疑问，遇到同类问题可以先来这里查。'
      ],
      terms: ['FAQ（frequently asked questions，常见问题）'],
      focus: '扫一遍标题，把你当下关心的那几条读完即可，其余以后遇到再回来查。',
      takeaway: '知道遇到问题时除了 Discord，还有一个官方 FAQ 可以先查。'
    },
    license: 'TOP 站点内容采用 CC BY-NC-SA 4.0；本站提供中文精译（见卡内译文区块），译文采用与原作相同的许可。',
    zhTranslation: {
      kind: 'full',
      attribution: '原文《Frequently Asked Questions》，来源：The Odin Project 官网（theodinproject.com/faq），作者：The Odin Project 社区。',
      licenseNote: '原文采用 CC BY-NC-SA 4.0 许可；本译文采用与原作相同的 CC BY-NC-SA 4.0 许可。',
      translatorNote: '本站精译（AI 辅助翻译、按本站纪律人工核对结构与红线），翻译日期 2026-09-18，依据当日抓取的页面正文。',
      modifications: '全文翻译，覆盖页面全部 12 个问答；省略全站公共导航、页脚与捐赠呼吁；个别长答案在不删减内容要点的前提下合并了段落。',
      body: [
        '# The Odin Project 适合谁？',
        'TOP 面向 Web 开发领域的纯新手，以及试过其他资源但没有成功的人。实际上，TOP 适合任何想以 Web 开发者为业、想创办初创公司、或只是想给自己拼一个主页的人。你需要的工具都在这里。你应当认为自己使用个人电脑已经比较熟练，并且愿意接受使用非 Windows 的操作系统。',
        '我们构建了一套有深度的课程体系，设计上要百分之百地把你带到成为 Web 开发者的终点。市面上许多其他资源只教编程基础；在 TOP，你会创建自己的网站、游戏和社交网站。',
        '# The Odin Project 的目标是什么？',
        '目标是为学员提供一条完整的路径：从零编程知识出发，一路走到受雇成为 Web 开发者；途中与其他学员协作，并逐步获得足以自学自立的能力。',
        '# 学完 The Odin Project 要多久？',
        '我们不会来「两天学会一切」这套把戏。你不可能从零基础出发在这么短的时间里学会真正的 Web 开发，你自己也清楚。一个周末的工作坊或一个月的业余课程之后就能受雇，几乎是不可能的。',
        '另一方面，你也不一定需要花四年拿一个计算机科学学位。学位课程覆盖的内容里，八成在普通 Web 开发者的职业生涯早期用不上，也不是受雇所必需的。那为什么不先学最要紧的那两成，剩下的等上班拿薪水的时候边干边学呢？',
        '我们本质上已经把「达到可受雇水平最需要学的东西」提炼了出来，但这仍然是相当分量的学习量。没有办法好好估算你要花多久才能到达那个水平，我们也拿不到平均耗时的可靠数据。如果你技术底子好或有技术背景，可能会快一些；如果你完全是新手，就会慢一些。别绝望——仔细想想，这和你人生里学任何值得学的东西要爬的学习曲线几乎一样。',
        '# 能学到哪些技术？',
        '所有学员首先进入 Foundations（基础）课程，它会让你探索成为 Web 开发者路上需要掌握的几种语言和技术。Foundations 介绍 HTML、CSS、JavaScript、Git 等内容，还准备了迷你项目，让你通过构建自己的应用和网站检验新知识。完成 Foundations 后，有两条路径可选：全栈 Ruby on Rails 与全栈 JavaScript。',
        '全栈 Ruby on Rails 路径采用从后端到前端的方式：先打下扎实的 Ruby 基础并理解数据库，然后进入 Ruby on Rails（用 Ruby 构建的框架），再用 HTML 和 CSS 打磨前端技能，最后学习用 JavaScript 让网站流畅、加载迅速、外观出色。',
        '全栈 JavaScript 路径延续 Foundations 的前端势头深入 JavaScript；基础扎实后，用 HTML 和 CSS 更深入地研究前端设计，最后通过 NodeJS 里的 Express 和 PostgreSQL 把你的 JavaScript 技能带到服务器端。',
        '两条路径上你都会学到 Git 与部署，从而能构建自己的作品集、与他人协作、看到自己的作品发布在网上。最后，TOP 还会提供接触遗留代码库和开源项目的机会，并覆盖专门帮助求职的内容。',
        '# TOP 与其他课程有何不同？',
        '第一，TOP 从全网汇集最好的资源并组织成完整的课程体系。许多其他课程的材料完全按自家课程定制，这可以不错，但常常限制学习者探索和发现其他资源（尤其是技术文档）的能力。TOP 避开这个缺陷：把全网的各种免费资源与自研内容结合——不是当作「一些有趣的读物」，而是作为对自研材料的有意补充。这通常意味着大量阅读，但学习者能对实际工作中会用到的资源与技能得到多得多的练习。',
        '第二，TOP 要求你在自己的电脑上安装程序，以此锻炼你的问题解决能力。作为开发者，编程错误经常出现，懂得怎样解读错误信息至关重要——尤其是在贴近真实开发者所用的环境里。其他课程经常忽视这些能力。',
        '最后，TOP 以项目为本。其他课程往往只要求你输入正确答案，但只学最基础的语法很难留住知识。TOP 的课程围绕从零构建项目来设计，注重打牢基础，同时给你真实世界的经验——你可以用它们构建作品集、受雇成为 Web 开发者。',
        '# 「Odin」是谁？',
        'Odin（奥丁）是北欧神话中的人物，众神之父。他的形象强大而反复无常（神常常如此），但也智慧而狡黠。他对知识的追寻是传奇——为换取亘古的智慧他献出了一只眼睛，为获得如尼文字的知识他用自家的长矛刺穿自己、在世界树上悬挂了九天九夜。',
        '学习 Web 开发不是轻松的任务，这里提供的工具只是路径，路要你自己走。如果你拥有像奥丁神话里那样的求知渴望与不屈精神，你会在这段旅程上找到成功。',
        '# 我在哪里注册？',
        '不用注册！直接开始学就行，内容是免费开放的。最好从头开始按顺序学，但每个人的目标不同，所以我们也开放了全部课程，你可以按需挑选课程或项目。',
        '不过，注册账号后你可以勾掉已完成的项目和课程，轻松跟踪进度。我们不收集任何用户数据，电子邮件也发得极少。',
        '# TOP 免费吗？',
        '免费！TOP 是由辛勤的志愿者创建和维护的开源项目。想了解怎样帮助我们，请访问我们的贡献页面。',
        '# 完成课程会有证书吗？',
        '我们不提供课程完成证书。雇主会更看重你出色的个人项目作品集——其中许多项目希望你是受 TOP 启发构建的。',
        '# 你们有行为准则吗？',
        '可以在 GitHub 上阅读我们的行为准则（Code of Conduct）。',
        '# 我可以用这套课程做教学吗？',
        'TOP 分两部分授权：课程与主站网站。主站是完全开源的项目（MIT 许可），代码可以随意使用。课程目前采用知识共享（Creative Commons）许可，限制为未经事先授权不得商用。',
        '这意味着你可以用 TOP 的课程在你的社团、聚会或朋友之间做教学（事实上我们很欢迎，也乐意听你讲讲效果如何！）。但是，不先和我们谈一谈，你不能拿它去开一个商业训练营。有任何问题请发邮件到 contact@theodinproject.com。',
        '# 怎样联系你们？',
        '对 TOP 本身有问题，欢迎联系我们。我们的 Discord 聊天室里也有友好的 Odin 社区。'
      ]
    },
    handling: 'zh-translation',
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
      overview: '官方 Assignment 第一条要求读这篇由 TOP 创始人撰写的文章，官方说它给出了对前方这段旅程的现实看法。它的主题与第 3 课「动机与心态」直接呼应：学编程遇到困难和沮丧是普遍现象，关键在于心态与方法。文章的具体论点请以英文原文为准，本站只做背景介绍与阅读建议——读时重点对照它对「你会遇到什么困难」的描述与自己的预期，别把「难」误解成「我不适合」。',
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
      overview: '官方在正文「Tools of the Trade」清单里链接了这个百科条目，目的是让你在正式动手之前先认识 CLI 是什么——第 9 课会专门动手练它。CLI 指通过输入文字命令来操作电脑的交互方式，与用鼠标点选的图形界面相对。中文维基百科已核验存在对应条目「命令行界面」，可直接读中文版；只需读开头的定义部分，操作细节留给第 9 课。',
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
      overview: '官方在工具清单里链接了这个百科条目，与第 8 课「文本编辑器」直接呼应：文本编辑器是编辑纯文本文件的程序，与 Word 这类富文本编辑器不同。第 8 课官方正文解释了关键差别——纯文本编辑器不保存额外的排版与图形信息，所以其他程序能把文件当代码读取并执行。中文维基百科已核验存在对应条目「文本编辑器」，读定义部分即可，细节留给第 8 课。',
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
      overview: '官方在正文「Why Odin?」小节链接了这个页面：它建议等你把工具用得顺手之后，开始尝试给开源项目做贡献，并以给 TOP 本身做贡献作为例子。官方原话是：你贡献得越多，就越清楚自己能做什么，也越接近可被雇佣的状态。这是课程后期才需要做的事，现阶段只需知道有这个入口；学有余力时可以回来，回馈你正在使用的这门课程。',
      why: '官方建议等你用工具用得顺手之后，开始给开源项目做贡献，并把给 TOP 本身贡献作为例子。',
      points: [
        '官方原话：你贡献得越多，就越清楚自己能做什么，也越接近可被雇佣的状态。',
        '这是课程后期才需要做的事，现在只需知道有这个入口，不必立刻参与。'
      ],
      terms: ['contributing（贡献）', 'open source（开源）'],
      focus: '现阶段只是认识这个入口，不必深入。',
      takeaway: '知道学有余力时可以回馈课程本身。'
    },
    license: 'TOP 站点内容采用 CC BY-NC-SA 4.0；本站提供中文精译（见卡内译文区块），译文采用与原作相同的许可。',
    zhTranslation: {
      kind: 'full',
      attribution: '原文《How to Contribute（Contributing to The Odin Project）》，来源：The Odin Project 官网（theodinproject.com/contributing），作者：The Odin Project 社区。',
      licenseNote: '原文采用 CC BY-NC-SA 4.0 许可；本译文采用与原作相同的 CC BY-NC-SA 4.0 许可。',
      translatorNote: '本站精译（AI 辅助翻译、按本站纪律人工核对结构与红线），翻译日期 2026-09-18，依据当日抓取的页面正文。',
      modifications: '全文翻译；省略全站公共导航、页脚、捐赠按钮与两个 GitHub 链接按钮（链接语义以文字说明保留）。',
      body: [
        '# 怎样做贡献',
        'The Odin Project 是一个开源项目，由志愿者构建和维护——他们投入自己的时间与技能，把 TOP 做成网上最好的免费教育平台之一。我们始终在做改进 Odin 的项目，也始终在寻找愿意加入这支不断壮大的维护者团队的人。',
        '如果你有兴趣在资金上支持我们，可以在我们的支持页面了解。',
        '# 做贡献主要有两种方式：',
        '# 一、课程（Curriculum）',
        '课程由本站上的课程与项目组成。我们不断扩展和更新课程，让它保持时新，确保它满足学员在日新月异的 Web 开发世界里的需求。我们的目标是做出世界上最好的免费 Web 开发课程，欢迎任何人加入我们一起朝这个目标努力。（入口是 GitHub 上的 TheOdinProject/curriculum 仓库。）',
        '# 二、主站（Main Site）',
        '你现在所在的这个网站是一个 Ruby on Rails 应用。我们一直在开发改进平台、帮助学员学习旅程的新功能。和任何开源项目一样，也有一长串待解决的问题和 bug。欢迎任何人从站点 GitHub 仓库里当前挂出的任何 issue 开始着手。',
        '# 你为什么应该参与',
        '- 灵活：你可以按自己的时间干活。这不是朝九晚五，什么时候方便什么时候参与。',
        '- 经验：你将有机会在一个经验丰富的工程师团队里工作，开发新颖有趣的功能，扩展自己的能力。',
        '- 影响：你开发的功能或你编写的课程，会帮助成千上万的学员学到改变人生的技能。'
      ]
    },
    handling: 'zh-translation',
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
      overview: '官方 Assignment 第二条要求读这篇 Udacity 博客的对比文章，用来巩固前端、后端与全栈三种开发者的分工概念。本课官方正文已给出核心区分：前端是你在浏览器里看到的内容与界面元素，用 HTML、CSS、JavaScript；后端是住在服务器上的「内脏」，负责存储和提供数据；全栈两边都能上手，而 TOP 教的正是全栈开发。这篇文章是同一主题的第三方补充说明，具体举例以英文原文为准；读时对照本课中文讲解的三分法，看它是否让你更容易记住。',
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
      overview: '官方在「A note on AI code generation」小节引用了这篇博客：作者 David Humphrey 是计算机科学教授，官方评价它是「一篇关于在教育场景中使用生成式 AI 的陷阱的好文章」。本课官方正文已列出七条具体风险（包括错过亲手发现原理的机会、延迟「问好问题」这项技能的发展、难以审视 AI 输出、面试可能不允许用 AI 等），结论只有一句：不推荐把 AI 工具用于你的学习。这篇是官方引用的延伸读物，想理解官方为什么态度这么明确可以读它；不读也不影响完成本课任务。',
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
      overview: '官方 Assignment 第一条要求读这篇发布在 dev.to 的 TOP 官方账号文章，用来在课程开始前调整心态。它与本课主题一致：官方反复强调动机、一致性与避开拖延等八个坑，是能不能走完这段课程的关键。文章的具体建议以英文原文为准，本站不复制其内容；读的时候可以挑一条你现在就能用的学习安排建议，把它落成行动再往下学。',
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
      overview: '官方 Assignment 第二条：加入 TOP Discord 之后，去 Success Stories 论坛读一读别人的成功经历，给自己的动力加点油。注意官方用语是有条件的——「一旦你加入 Discord 之后」，还没加入可以等第 5 课带你加入后再回来补做；查看需要 Discord 账号与登录。读的时候重点看他们怎样安排学习节奏、卡住时怎么办，看到普通人也能走完这条路，给自己一个可参照的预期。',
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
      overview: '官方把番茄工作法作为对付拖延的首要对策，本课正文已给出完整做法：定 25 分钟计时器专注做一件事，中途分心就重新开始这 25 分钟；每段成功后休息 5 分钟；完成四个工作块后休息 15–30 分钟。中文维基百科已核验存在对应条目「番茄工作法」，可以对照阅读它的起源与常见变体，判断是否需要按自己的情况调整时长，然后立刻开始用一个可执行的专注-休息循环。',
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
      overview: '官方在讲对付拖延时用「如果你想试试」的措辞提到 Pomofocus：它是一个可定制的在线番茄钟，桌面和手机浏览器都能用，属于可选工具而不是必做项。任何计时工具都可以替代它，包括手机自带的计时器。如果你决定试番茄工作法，可以用它完成一次真实的 25 分钟专注加 5 分钟休息，看这种方式是否适合自己。',
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
      overview: '官方在「Not taking breaks」小节末尾把这篇文章作为延伸阅读。本课官方正文已给出核心依据：研究显示各种时长的休息之后表现都会提升，从长假到 30 秒的微休息都算；多伦多大学管理学副教授 John Trougakos 把专注力比作肌肉——持续使用后会疲劳，需要休息恢复。文章的具体论证以英文原文为准；本课要点已在中文讲解里覆盖，想进一步了解休息与产出的关系时再读。',
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
      overview: '官方 Assignment 第一条要求读这篇短文，它说明了为什么要「直接问出你的问题，而不要先问『我可以问个问题吗』」。核心道理本课中文讲解已经概括：先问「能不能问」会多一轮无信息的来回，而且没人能在看到你真正的问题之前判断能不能帮你；第 5 课官方正文还会再次强调这条原则。本站已核验该站点的 zh-cn 路径返回与英文首页完全相同的内容（正文汉字数 0），无官方中文版；文章很短，直接读英文原文，读完记住一条——把问题连同上下文一次性发出来。',
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
      overview: '官方 Assignment 第三条要求阅读并收藏这份 TOP 社区指南，它是你需要求助时随时可查的参考，官方说在思考文中列出的那些要点时，你可能会自己就把问题解决了。本课官方 Knowledge Check 第二题「你的提问应该包含哪 5 样东西」直接指向这份指南；第 5 课官方正文列出的提问五项上下文可作对照：你认为问题是什么、你究竟希望发生什么、实际发生的是什么、你是怎么走到这一步的、到目前为止你试过什么。重点读它列出的提问要素清单，收藏起来以后每次提问前对照。',
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
    license: 'TOP 官方指南，采用 CC BY-NC-SA 4.0；本站提供中文精译（见卡内译文区块），译文采用与原作相同的许可。',
    zhTranslation: {
      kind: 'core',
      attribution: '原文《How to Ask Technical Questions》，来源：The Odin Project 官方社区指南（theodinproject.com/guides/community/how_to_ask），作者：The Odin Project 社区。',
      licenseNote: '原文采用 CC BY-NC-SA 4.0 许可；本译文采用与原作相同的 CC BY-NC-SA 4.0 许可。',
      translatorNote: '本站精译（AI 辅助翻译、按本站纪律人工核对结构与红线），翻译日期 2026-09-18，依据当日抓取的页面正文。',
      modifications: '按核心章节精译，覆盖原文全部章节与要点（提问前准备、五要素、发帖后注意事项、结语）；站内其他指南的链接改为文字提及；个别长句在不丢失要点的前提下压缩。',
      body: [
        '# 怎样提技术问题',
        '「把问题写得简短精炼，免得浪费别人时间」是一个常见的误解。事实上，你的问题背后往往有比你意识到的多得多的内容。技术问题缺少关键细节时，几乎不可能给出准确的回答。因此，我们期望每个人都付出努力，提出包含全部相关信息的详细问题。',
        '我们 Discord 社区里的每个人都是志愿者，所以你要让别人尽可能容易地帮到你。我们期望每个人都学会怎样提详细的问题——这项能力会让你在 Discord、Stack Overflow 和未来的工作场所都能问出更好的问题。',
        '# 提问之前',
        '先自己做研究：用你喜欢的搜索引擎、逛 Stack Overflow 之类的论坛、用 Discord 的站内搜索功能。如果搜索结果没帮助，调整搜索词再找。',
        '先自助：你遇到的许多问题，你自己有能力弄明白怎么解决，你缺的只是「知道该做什么、该去哪里找」的经验。请阅读官方《在求助他人之前怎样自助》的实用建议。随着时间推移，你会把这些技巧融进自己的开发工作流。',
        '选最相关的帮助频道：课程的每个部分都有专门的频道（例如 #git-help、#html-css-0/#html-css-1、#js-help-0/#js-help-1、#ruby-help 等）。拿不准时可以在 #odin-main 问课程相关的问题，但那个频道很繁忙，帖子沉得很快。',
        '# 准备你的问题（五要素）',
        '提出详细的技术问题需要花时间准备所有相关信息。这份时间投入会让别人更容易帮你，也会让你自己把问题理解得更透。',
        '一、提供课程中该课/该项目的链接。这很重要：它提供了问题的周边上下文，也能让对方知道你现在的知识与技能水平。',
        '二、提供代码、伪代码或其他相关信息。提问时必须附上你的代码、错误消息、终端命令、服务器输出等。要分享的内容超过几行时，应使用外部服务：基础 HTML/CSS/JavaScript 用 CodePen，JavaScript/Ruby 用 Replit，Webpack/React 用 CodeSandbox，错误消息或服务器输出用 Pastebin。',
        '如果你还没写任何代码就有问题，应提供伪代码；需要帮助写伪代码时，带着你的具体问题去读官方的 Problem Solving（问题解决）一课。有时候分享 GitHub 仓库链接更合适——务必给出详细信息（文件名、函数/方法名、行号等），让别人尽可能容易地帮你。',
        '需要分享终端窗口或屏幕内容时，用电脑上的截图工具截图；不要用相机拍屏幕——拍出来的照片质量低，别人很难看清。不要分享需要下载的文件：无法判断一个文件是否含恶意软件或其他恶意意图，因此绝不要让别人下载文件并在自己的设备上打开。',
        '三、解释问题。说明你遇到的问题，并包含重现问题所需的步骤。另外要解释你正试图解决项目的哪一部分——这很重要，别人才能判断你现在的方向能不能解决那一部分，还是应该把你引向别的方向。这就是常说的「XY 问题」，是程序员学习提详细问题时常见的陷阱。',
        '四、描述你的预期。尽可能详细地描述你期望发生什么、以及你为什么期望它发生。',
        '五、总结你试过什么。总结你对「正在发生什么」的推测、你排查过什么、尝试各种解法之后的结果。说明调试过程中的任何发现，尤其是当你已经定位到异常行为从哪里开始时。',
        '# 发帖之后',
        '帮助可能和你想象的不一样：多数时候，别人不会直接给你一个答案，而是与你来回对话，引导你得出自己的答案、推荐该复习的课程、给出解释更详细的资源等。如果这种方式与你的预期不同，请阅读官方的《怎样帮助他人解决编程问题》指南。',
        '保持在线、耐心等待：提问之后请留在附近，准备好和试图帮你的人讨论。社区虽然相当活跃，但不是每个问题都会立刻得到回答。等待时确认自己已经给出了详细的问题，并继续排查；建议把你尝试过的结果编辑进帖子。帖子沉了可以重发，或在更活跃的频道里把你的帖子指给大家。',
        '保持耐心、愿意补充细节：如果提问时细节不足，你会被要求补充所有相关信息。偶尔有人被要求提供更多信息时会不悦或不耐烦。请放心，这些追问是流程的一部分，为的是避免「只凭不完整的信息去帮人」的挫败。你的问题对你自己可能很明显，对别人往往并不明显。',
        '避免连环追问：最初的问题得到解答后，克制住立刻追问的冲动，应该把整个流程重新走一遍——先自己做研究。我们知道你是好意，但期望同一个人不等你自己先努力理解就继续帮你，是有些不顾及他人的。这是一种「牵着手走」，社区不鼓励。',
        '不鼓励低努力问题与「牵手式」帮助：我们的课程与 Discord 社区非常看重「帮你自己站起来」而不是牵着你的手走。适应这种方式可能很难，因为它与你多数教育经历不同。如果你养成了问低努力问题的模式，版主会私下和你谈——这类问题会消耗志愿者社区。',
        '# 结语',
        '花时间写出非常详细的问题，最大的好处之一是：你偶尔会自己把问题解决了。这是最好的结果之一！你应该庆祝这个成就，并考虑把问题和解决方案写进你正在做的项目的 README.md。',
        '强烈建议每次提问前都回顾这些建议，至少直到「提供这种程度的细节」成为你的第二天性。想进一步了解「提供周边上下文」，可以读 Stack Overflow 的标准，或我们最喜欢的文章之一——Gordon Zhu 的《怎样提出出色的编程问题》。'
      ]
    },
    handling: 'zh-translation',
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
      overview: '官方 Assignment 第二条要求读这个页面，它指出的是新手和有经验的程序员在提问时都会掉进去的常见陷阱；本课官方 Knowledge Check 第一题「什么是 XY Problem」就以该站点为权威出处。它描述的情形本课中文讲解已概括：你真正要解决的是 X，却把自己猜的解决路径 Y 当成问题去问，于是别人在帮你处理 Y，而 X 从没被说清楚。页面很短，读完能识别自己是不是在问 Y，提问时先说出真正想达成的目标。',
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
      overview: '官方在「Asking for help」小节的助人准则里建议：提问时把项目推到 GitHub，或用合适的在线 REPL（例如 CodePen）分享对应代码，让别人能翻查和调试。官方反复强调截图只适合展示命令输出、错误消息和页面外观，必须同时提供包含错误的代码文件；问题难以隔离时，应当用隔离的代码重现问题。CodePen 就是这类在线代码演练场，本课只需知道它的用途，不必真的用它；它需要联网使用，部分功能需要注册账号。',
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
      overview: '官方 Assignment 第二条要求登录 TOP 的 Discord 服务器，进去打个招呼并开始探索。官方建了一个 introductions 自我介绍频道，课程覆盖的每个开发主题也都有对应频道；参与前官方要求先在左侧边栏 TOP META 下读 rules 和 faq。本课官方 Knowledge Check 第一题就是「怎样加入 TOP 的 Discord 服务器」。按官方顺序做：加入、打招呼、读规则与常见问题、先观察再参与；需要 Discord 账号与登录后才能进入。',
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
      overview: '官方在「Before asking for help」小节建议：觉得卡住时先停下来喘口气，把问题拆成小块并判断到底是什么在阻碍你，并把这个技巧称为 rubber duck debugging（橡皮鸭调试法）。方法本身很朴素：把你要做的事一行一行讲出来（对着一只橡皮鸭也可以），讲述过程常常自己就暴露了问题所在。本站已核验中文维基百科不存在「橡皮鸭调试法」条目（返回 404），因此只提供英文条目链接；知道这个技巧的名字与做法即可，条目细节可选读。',
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
    license: '维基百科内容采用 CC BY-SA 4.0；本站提供中文精译（见卡内译文区块），译文采用与原作相同的许可；中文维基已核验无此条目。',
    zhTranslation: {
      kind: 'full',
      attribution: '原文《Rubber duck debugging》，来源：英文维基百科（en.wikipedia.org/wiki/Rubber_duck_debugging），作者：维基百科各编辑者（贡献历史见条目页面）。',
      licenseNote: '原文采用 CC BY-SA 4.0 许可；本译文采用与原作相同的 CC BY-SA 4.0 许可。',
      translatorNote: '本站精译（AI 辅助翻译、按本站纪律人工核对结构与红线），翻译日期 2026-09-18，依据当日通过维基百科 API 抓取的条目纯文本。',
      modifications: '全文翻译（条目正文不长，含起源、方法、流行文化三节全部译出）；「参见」列表译出条目名、去掉站内链接；「参考文献」与「外部链接」两节为空列表或链接列表，未逐条译出。',
      body: [
        '橡皮鸭调试法（rubber duck debugging，或 rubberducking）是软件工程中的一种调试技巧：程序员用自然语言一步一步地讲解自己的代码——出声讲或写下来——以此暴露错误与误解。',
        '# 起源与定义',
        '这个名字出自 Andy Hunt 与 Dave Thomas 合著的《程序员修炼之道》（The Pragmatic Programmer）里讲的一则轶事。书中把橡皮鸭调试描述为「向一个『一句话也不必说』的对象讲解问题」的方法：「仅仅是把代码本应做什么一步一步讲出来，问题常常就会自己从屏幕上跳出来报上名号。」这个称呼来自一位名叫 Greg Pugh 的研究助理，他随身带着一只橡皮鸭，对着它做这类讲解。这一做法的变体使用其他物件甚至宠物，其中泰迪熊尤其常见。',
        '# 方法',
        '程序员向别人讲解问题时——哪怕对方完全不懂编程——常常会在讲解过程中发现解法。描述代码、再对照它实际的行为，会把不一致之处暴露出来。讲解一个主题还会迫使程序员从新的角度审视它，带来更深的理解。',
        '向无生命物体（比如一只橡皮鸭）讲解你的解法，好处是不需要另一个真人在场，而且效果也比没有听众的自言自语更好。这种方法已经被引入计算机科学和软件工程的课程教学。',
        '# 在流行文化中',
        '2018 年 4 月 1 日，Stack Overflow 上线了一个愚人节玩笑功能 Quack Overflow：屏幕右下角会出现一只橡皮鸭头像，它倾听用户的问题、假装键入解决方案——最后只回一声「quack」（嘎）。它致敬的正是橡皮鸭调试法这种强大的问题解决方法。',
        '# 参见（原条目相关条目列表）',
        '代码审查、结对编程、苏格拉底方法、桌面检查（desk checking）、鸭子测试、鸭子类型、软件走查、尤里卡效应（Aha! effect）、出声思维协议、指差呼唤、罗杰斯方法、担忧娃娃（worry dolls）、借教而学（learning by teaching）、身体伴同（body doubling）。'
      ]
    },
    handling: 'zh-translation',
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
      overview: '官方 Assignment 第一条就是创建免费的 GitHub 账号——官方说你会发现 GitHub 是开发工作流中不可或缺的一部分。GitHub 是一个让你用 Git 上传、托管和管理代码的服务，并提供网页界面；它与 Git 不是同一个东西，也不是同一家公司创建的。这个账号在第 10 课（配置邮箱隐私、添加 SSH 公钥）与第 12 课（创建练习仓库 git_test）都会用到；注册需要邮箱，按页面步骤注册即可，不要在本课急着配置 Git。',
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
      overview: '官方在本课助人准则第 6 条把这篇文章作为标准参考：如果问题看起来混乱或含糊，帮助者会礼貌地把提问者指向机器人命令 /question，而它链接的就是这篇由 Gordon Zhu 撰写的文章。它与第 4 课的三条提问原则同源——给足上下文、问手头的问题而不是索要解法、别把索要上下文当成刁难。具体内容以英文原文为准，核心做法在第 4 课与本课的中文讲解里都已覆盖；另注意 Medium 可能需要登录或有阅读次数限制。',
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
      overview: '官方在「Asking for help」小节说：有时候可能没有人能帮你处理问题，那正是熟悉 Discord 搜索功能的理想时机。官方给的做法是搜索具体的关键词或错误消息，看看之前有没有人遇到过类似问题、他们是怎么解决的——用错误消息原文当搜索关键词通常命中率最高。这是 Discord 官方帮助中心的文档；本站已核验其 zh-cn 路径会重定向回 en-us 英文版，无官方中文版。',
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
      overview: '官方在「求助之前先做三件事」里推荐这篇文章：用搜索引擎找和你问题相关的信息。这是官方给出的 Internet Archive 存档地址，原文来自 codinginflow 的旧站点；本站自动核验未取得响应，需要在浏览器中人工确认能否打开。它的建议与本课的搜索原则一致——先搜索、再拆解问题、再回看旧课，都无解才去社区提问；遇到报错先自己搜一轮，并把搜过的关键词记下来，方便提问时说明自己试过什么。',
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
      overview: '官方 Assignment 第二条要求读这篇 Mozilla 文章，它是本课「互联网怎样运作」的权威说明；官方 Knowledge Check 的「什么是互联网」「客户端与服务器是什么」两题都直接指向这篇及其姊妹篇。MDN 官方简体中文版已做内容级核验（正文汉字 9931 个，与英文版为同一篇文章），直接读中文版即可，遇到不确定的术语再切回英文版核对。读完应能说出数据从你的浏览器到服务器再回来大致经过哪些环节。',
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
      overview: '官方 Assignment 第四条要求弄清网页、网站与搜索引擎的区别，Knowledge Check 有同名的题目，答案就在这一篇。关键区分本课正文已给出：网页是单个文档，网站是许多网页的集合，搜索引擎帮你找到网页，浏览器负责显示网页。MDN 学习区重组后这篇的现役标题为「浏览互联网」，官方简体中文版已核验（正文汉字 21206 个），覆盖了同一组概念，可放心阅读；重点读四者区别的部分。',
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
      overview: '官方 Assignment 第六条要求读这篇讲「网络各部分怎样互相配合」的 MDN 文章；官方给了两个锚点——clients and servers（客户端与服务器）与 packets explained（数据包解释），说明这两段是本课要掌握的核心，Knowledge Check 也另行指向数据包小节。本课正文已说明：客户端发起请求、服务器返回响应，数据被切成数据包在网络上传输。MDN 官方简体中文版「万维网是如何工作的」已核验；只读这两节即可，其余章节属于后续课程范围。',
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
      overview: '官方 Assignment 第六条的后半要求读这篇讲 DNS 请求怎样工作的 MDN 文章；官方同时提供了一个视频作为替代选项。本课正文已给出 DNS 的定义：域名系统把人类可读的域名翻译成机器使用的 IP 地址，好比电话簿；Knowledge Check 的「DNS 服务器做什么」一题答案就在这一篇。MDN 官方简体中文版已核验；重点读「DNS 请求是怎样工作的」那一节，页面其余部分讲的是域名的注册与结构。',
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
      overview: '官方把这个视频作为上一篇 MDN DNS 文章的替代选项——原文用词是 Alternatively，不想读文章可以看它，属于二选一的可选项而不是必做项。本站已用 YouTube oEmbed 接口核验其真实标题「DNS Explained」与作者 DNS Made Easy Videos；观看需要 YouTube 访问权限。看之前建议先读本课中文讲解里的 DNS 定义，这样视频里的术语不至于陌生。',
      why: '官方把它作为上一篇 MDN DNS 文章的替代选项：不想读文章可以看这个视频。',
      points: [
        '官方用词是 Alternatively，所以它是二选一的可选项，不是必须完成的项目。',
        '需要 YouTube 访问权限才能观看。',
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
      overview: '官方 Assignment 第一条就是看这个 BBC 短片，官方称它为「互联网怎样运作的概览」——定位是总览而非深入讲解。本站已用 oEmbed 核验其真实标题与作者 BBC Click（BBC 的科技节目，内容为英语讲述）；观看需要 YouTube 访问权限。把它当作整课的热身来看，抓住「互联网是很多网络互相连接」这个直观印象，再进入后面的技术细节。',
      why: '官方 Assignment 第一条就是看这个 BBC 短片，作为整课的总览。',
      points: [
        '官方称它为 a BBC short for an overview of how the internet works，定位是概览而非深入讲解。',
        '需要 YouTube 访问权限。',
        'BBC Click 是 BBC 的科技节目，内容为英语讲述。'
      ],
      terms: ['internet（互联网）', 'network（网络）'],
      focus: '当作整课的热身看，抓住“互联网是很多网络互相连接”这个印象即可。',
      takeaway: '对互联网的规模与结构有一个直观印象，再进入后面的技术细节。'
    },
    license: 'BBC Click 官方频道视频，版权归原作者；本站只做链接与原创导读，不搬运视频、不声称有中文字幕。',
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
      overview: '这是本课被官方引用两次的资源：Assignment 第三条要求看这个 5 分钟视频，Knowledge Check 的「解释互联网怎样工作」也指向它，属于必看的总览材料。本站已用 oEmbed 核验其真实标题与作者 Aaron；官方链接以 youtu.be 短链并带起播参数给出，与本站链接指向同一视频。观看需要 YouTube 访问权限；看时注意它对「数据怎样在机器之间找到彼此」的解释，这与官方 KC 的问题直接对应。',
      why: '官方 Assignment 第三条要求看这个 5 分钟视频，官方 Knowledge Check 也把“解释互联网怎样工作”指向它。',
      points: [
        '这是本课被引用两次的资源：既在 Assignment，也在 Knowledge Check，属于必看的总览材料。',
        '需要 YouTube 访问权限。',
        '官方链接以 youtu.be 短链并带 t=46s 起播参数给出，与本站的 watch 链接指向同一视频。'
      ],
      terms: ['internet（互联网）', 'IP address（IP 地址）', 'protocol（协议）'],
      focus: '注意它对“数据怎样在机器之间找到彼此”的解释，这与官方 KC 的问题直接对应。',
      takeaway: '能用五句话向别人解释互联网怎样工作。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频、不声称有中文字幕。',
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
      overview: '官方 Assignment 第五条的前半：先看这个 Google 短片了解浏览器是什么，然后去 whatsmybrowser.org 查出自己当前的浏览器与版本。本课正文已给出定义：网页浏览器是让你访问并显示网页的软件，例如 Chrome、Firefox、Safari、Edge；Knowledge Check 的「网页浏览器是什么」一题指向这个视频。本站已用 oEmbed 核验其真实标题与作者 Google；观看需要 YouTube 访问权限。',
      why: '官方 Assignment 第五条：先看这个 Google 短片了解浏览器是什么，然后去 whatsmybrowser.org 查出自己当前的浏览器与版本。',
      points: [
        '官方 Knowledge Check 有一题是“网页浏览器是什么”，指向这个视频。',
        '本课正文已给出定义：网页浏览器是让你访问并显示网页的软件，例如 Chrome、Firefox、Safari、Edge。',
        '需要 YouTube 访问权限。'
      ],
      terms: ['web browser（网页浏览器）', 'render（渲染）'],
      focus: '看完立刻做官方的第二步：查出自己的浏览器与版本号，这是第 7 课安装 Chrome 的前提。',
      takeaway: '知道自己现在用的是什么浏览器、什么版本。'
    },
    license: 'Google 官方频道视频，版权归原作者；本站只做链接与原创导读，不搬运视频、不声称有中文字幕。',
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
      overview: '官方 Assignment 第五条的后半句：看完视频后用这个网站查出你当前的浏览器和版本。它会读取浏览器自己上报的信息并显示出来，属于一次性的查询，不需要注册账号。查到的名称与版本号在第 7 课有用——官方只支持 Google Chrome，你需要确认自己装的是哪个浏览器；记下这两个信息即可，不用深究页面上其他技术细节。这是第三方网站，与本站无关联，本站不代为收集任何数据。',
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
      overview: '官方在介绍操作系统时链接了这个维基百科条目，让你了解课程推荐的这个系统本身。官方正文的原话本课中文讲解已引用：Linux 是免费开源的操作系统，与所有编程语言配合良好，多数开发工具都是为在 Linux 上原生运行而写的；在 Linux 上你的工具会更常更新、排错资料更多、运行也更顺畅。中文维基百科简体版已核验（正文汉字 60955 个）；条目很长，本课只需读开头的定义与「为什么开发者常用它」的部分，内核技术细节不属于本课范围。',
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
      overview: '官方在说明「不支持原生 Windows 作为开发环境」时，给了这份理由清单作为更多信息。官方的态度本课正文已经传达：Windows 已被讨论过很多次、目前不可行，且没有被证明是一条阻力较小的路径；不要要求支持 Windows，也不要在 Discord 里提这个话题。对 Windows 用户，官方给的路径是 WSL2 或虚拟机，第 9 课还针对 WSL2 单独给了说明。Windows 用户可以读这一页理解官方规定背后的理由，其他用户可以跳过。',
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
    license: 'TOP 官方博客仓库 wiki，采用 CC BY-NC-SA 4.0；本站提供中文精译（见卡内译文区块），译文采用与原作相同的许可。',
    zhTranslation: {
      kind: 'full',
      attribution: '原文《Why We Do Not Support Windows》，来源：TOP 官方博客仓库 wiki（github.com/TheOdinProject/blog/wiki/Why-We-Do-Not-Support-Windows），作者：The Odin Project 维护者。',
      licenseNote: '原文采用 CC BY-NC-SA 4.0 许可；本译文采用与原作相同的 CC BY-NC-SA 4.0 许可。',
      translatorNote: '本站精译（AI 辅助翻译、按本站纪律人工核对结构与红线），翻译日期 2026-09-18，依据当日抓取的 wiki Markdown 源文件。',
      modifications: '全文翻译（原文即 19 条编号理由清单，逐条全译，无删减）；原文无标题正文外的其他章节。',
      body: [
        '这是 TOP 官方给出的「为什么不支持原生 Windows」完整理由清单（原文共 19 条，逐条全译）：',
        '- 一、我们在这里做任何支持都没有报酬，这一切都是免费的。',
        '- 二、我们（课程维护者）自己作为开发者不用 Windows。',
        '- 三、这个领域的大多数开发者使用类 Unix 系统。',
        '- 四、几乎所有服务器都基于 Linux。',
        '- 五、大多数教程都要为适配 Windows 重写，而我们又经常链接外部资源（外部资源更不受我们控制）。',
        '- 六、我们试过（支持 Windows），用户遇到的问题比在 Linux 上更多。',
        '- 七、对拥有标准系统的多数人来说，Linux 并没有那么难学。',
        '- 八、Ruby 和 Rails 在 Windows 上有问题；转换路径的人会发现自己掉进深坑。',
        '- 九、git 和其他工具都是先为 Linux 写的，在 Windows 上用它们是次等体验——对还在摸索技术世界的初学者尤其如此。',
        '- 十、我们通过 VBox（VirtualBox 虚拟机）支持 Windows 用户，这是「让人们用上 Windows」的最接近方案，而且多数人用它没有遇到麻烦。',
        '- 十一、把教程适配到 Mac 比适配到 Windows 容易得多，因为 Mac 是基于 Unix 的系统。',
        '- 十二、装好 Linux 远比学会编程容易。让初学者去应付 Windows 环境的种种差异，比教他们一点 Linux 更难。',
        '- 十三、学习 Linux 这类东西能让人在自己的环境里更灵活。工作中你常常用不上 Windows。',
        '- 十四、雇主通常期望一个人熟悉基于 Unix 的环境，所以这也是成为开发者的一部分。',
        '- 十五、要求维护者支持一套他们自己没有选用的教材有点不合情理；当太多人要求支持太多平台时事情会变得难以为继，因此我们不得不做限制。',
        '- 十六、除非有经验，人们很难理解用不同技术时何时该用 Windows 路径、何时该用 Unix 路径。',
        '- 十七、对 Linux 足够熟练的人（而这个「足够熟练」的门槛在此场景下其实很低），以后可以自己选择 Windows，也能理解其他资源所讲的技术。',
        '- 十八、与其把不属于这里的东西硬塞进课程，我们的时间更适合用来写更多内容——尤其当许多外部资源根本没有 Windows 步骤时。',
        '- 十九、有其他课程很乐意让你用 Windows。我们不打算和它们竞争，也不需要。我们的做法是找到网上最好的资源并把它们组织起来——它们恰好都基于 Linux。'
      ]
    },
    handling: 'zh-translation',
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
      overview: '官方在正文用这个视频解释虚拟机是什么——它是 Windows 用户可选的两条路径之一（另一条是 WSL2）。本课正文已给出定义：虚拟机是在你现有操作系统内运行的计算机仿真，让你在一个程序里使用另一个操作系统（例如在 Windows 里跑 Linux）；安装和普通软件一样简单，且没有风险，不喜欢可以直接删掉。本站已用 oEmbed 核验其真实标题与作者 Victor Dozal；官方评价虚拟机是新手快速上手的好方式。观看需要 YouTube 访问权限。',
      why: '官方在正文用这个视频解释虚拟机是什么，作为 Windows 用户可选的两条路径之一。',
      points: [
        '官方正文已给出定义：虚拟机是在你现有操作系统内运行的计算机仿真，让你在一个程序里使用另一个操作系统（例如在 Windows 里跑 Linux）；安装和普通软件一样简单，且没有风险，不喜欢 Linux 可以直接删掉虚拟机。',
        '官方评价虚拟机是新手快速上手的好方式。',
        '需要 YouTube 访问权限。'
      ],
      terms: ['virtual machine / VM（虚拟机）', 'emulation（仿真）', 'host OS（宿主系统）'],
      focus: '看完后决定自己走 WSL2 还是虚拟机；本课正文的 Windows 小节会给出官方建议。',
      takeaway: '理解虚拟机的原理与风险边界，能做出环境选择。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频、不声称有中文字幕。',
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
      overview: '官方在正文开头与 Assignment 两处提到这个页面，目的相同：如果你已经在用 macOS、Ubuntu 或 Ubuntu 的官方风味版，并且装了 Google Chrome，就可以跳过整课。flavor（风味版）指由 Ubuntu 官方认可的衍生版本，桌面环境不同但同属 Ubuntu 家族，因此官方把它们与 Ubuntu 一并视为受支持环境。这条链接的实际用途是判断你能不能跳过第 7 课，而不是要求你去安装风味版；页面为英文，Canonical 未提供官方中文版。',
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
      overview: '官方两次给出这个维基百科条目，都是因为课程只用 Google Chrome，让你看看其他开发者与用户实际在用什么浏览器。官方原话本课中文讲解已引用：我们的课程使用 Google Chrome，它在开发者与消费者中都被广泛使用，我们的推荐是非常有意的；官方指定的锚点是 Summary tables（汇总表），直接看份额数据即可。中文维基百科条目「网页浏览器的使用分布」已核验为简体版本；看汇总表里 Chrome 的占比，就能理解官方的浏览器要求不是随意规定，而是有使用数据支撑。',
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
      overview: '官方说 Chrome 是你在整个课程中最重要的工具之一，这份 Google 官方参考里有很多用 Chrome 时可能觉得有用的常用快捷键。官方指定的锚点是标签页与窗口快捷键——新标签页、切换标签页、关闭窗口这一类。Google 帮助中心通过 hl 参数切换内容语言，官方简体中文版与英文版是同一篇文档，已核验；快捷键因操作系统而异，页面有 Windows/macOS/Linux 分栏。先看自己系统那一栏，挑三五个常用的记住，日常浏览与调试时就能少用鼠标。',
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
      overview: '官方 Assignment 第一条指向 VS Code 官方文档站：以后如果在 VS Code 上遇到问题，或想了解更多功能，就来这里查；VS Code 里还有很多键盘快捷键，其中一些与你的操作系统有关，需要时可以查阅。为什么必须用纯文本编辑器写代码，本课正文已经解释——它不保存额外的排版与图形信息，所以其他程序能把文件当代码读取并执行；Word 这类富文本编辑器会插入额外信息，导致代码无法运行。这个文档站没有中文版本，界面与内容均为英文；它是长期查阅的参考站，不必本课读完，知道位置、遇到具体问题再查对应章节即可。',
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
      overview: '官方 Assignment 第二条：熟悉 VS Code 能帮你节省时间、提高效率，看这个视频可以了解 VS Code 提供的全部功能。官方还特别交代了看法——不用真的跟着敲代码，只要看视频里 VS Code 是怎样被使用的。本站已用 YouTube oEmbed 接口核验其真实标题与作者 Tech With Tim；观看需要 YouTube 访问权限。按官方说法「只看用法」，注意它怎样打开文件、怎样用内置终端、怎样装扩展，对编辑器界面与常用操作建立整体印象。',
      why: '官方 Assignment 第二条：熟悉 VSCode 能帮你节省时间、提高效率；看这个视频可以了解 VSCode 提供的全部功能。',
      points: [
        '官方特别交代了看法：不用真的跟着敲代码，只要看视频里 VSCode 是怎样被使用的。',
        '需要 YouTube 访问权限。',
        '官方链接带 t=103 起播参数，本站按同一视频归并。'
      ],
      terms: ['VS Code（Visual Studio Code）', 'terminal（内置终端）', 'extension（扩展）', 'IntelliSense（智能提示）'],
      focus: '按官方说法“只看用法”，注意它怎样打开文件、怎样用内置终端、怎样装扩展。',
      takeaway: '对编辑器界面与常用操作有整体印象，后续课程上手更快。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频、不声称有中文字幕。',
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
      overview: '官方在 Efficiency 小节用相当强调的语气推荐这个技巧：你需要了解 tab completion；说真的，这个技巧会帮你省下大量时间和挫败感。官方还给了具体场景——要进入像 ~/Documents/Odin-Project/foundations/javascript/calculator/ 这样很深的目录，全部手打既长又必须完全正确才行；而按 Tab 键，命令行会在只剩一个匹配项时自动补全你已经开始输入的命令，有多个匹配时则列出所有候选让你选择。中文维基百科条目「自动完成」已核验为简体版本；读定义与工作方式即可，实际手感要自己在终端里练成肌肉记忆。',
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
      overview: '官方 Assignment 第一条：访问 Software Carpentry 基金会设计的 The Unix Shell 课程。那里有一整套 CLI 课程，但现在只需要完成官方点名的几节——Download files、Introducing the Shell、Navigating Files and Directories、Working With Files and Directories，不要顺着整站往下学，那超出本课范围。官方还提醒：整门课程里你的终端输出可能与课程展示的略有不同，这是正常的。Software Carpentry 是面向科研人员的计算技能教学项目，课程以英文授课；从主页找到官方点名的那几节即可。',
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
    license: 'Software Carpentry 课程材料采用 CC BY 4.0；本站提供中文精译（见卡内译文区块），译文采用与原作相同的许可。',
    zhTranslation: {
      kind: 'full',
      attribution: '原文《The Unix Shell》课程主页，来源：Software Carpentry（swcarpentry.github.io/shell-novice/），作者：Software Carpentry / The Carpentries 社区。',
      licenseNote: '原文采用 CC BY 4.0 许可；本译文采用与原作相同的 CC BY 4.0 许可。',
      translatorNote: '本站精译（AI 辅助翻译、按本站纪律人工核对结构与红线），翻译日期 2026-09-18，依据当日抓取的仓库源文件（index.md）。',
      modifications: '全文翻译（主页正文极短，含先导说明与先修要求两节，全部译出，无删减）。C0 查证：SWC 官方无中文版（官方组织下仅有西班牙语版仓库 shell-novice-es）。',
      body: [
        'Unix shell 存在的时间比它的大多数用户的年龄都长。它能存活至今，是因为它是一个强大的工具：让用户常常只需几次击键或几行代码就能完成复杂而有力的任务。它帮助用户把重复的任务自动化，并轻松地把小任务组合成更大、更强大的工作流。',
        'shell 的使用是范围广泛的高级计算任务（包括高性能计算）的基础。这些课程将带你认识这个强大的工具。',
        '# 先修要求',
        '本课将带你了解文件系统与 shell 的基础知识。只要你曾经在电脑上存过文件，并且认识「文件」以及「目录」或「文件夹」（同一事物的两个常用叫法）这些词，你就已经具备学习本课的条件了。'
      ]
    },
    handling: 'zh-translation',
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
      overview: '官方点名要做的第一节，并给了特别说明：只需要照着这一节里的说明做，不需要安装任何软件，做完就可以进入下一项。这一节的作用是拿到后面三节要用的练习数据文件。官方对 WSL2 用户单独给了做法：用 wget 命令把 zip 文件取到 WSL2 安装里，再用 sudo apt install unzip 安装解压工具，然后 unzip shell-lesson-data.zip 解压；课程让去 Desktop 时，WSL2 用户应改为去 home 目录，用 cd ~ 即可。按官方限定只做下载说明部分，不要顺手安装课程推荐的其他软件。',
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
    license: 'Software Carpentry 课程材料采用 CC BY 4.0；本站提供中文精译（见卡内译文区块），译文采用与原作相同的许可。',
    zhTranslation: {
      kind: 'core',
      attribution: '原文《Setup — Download files》，来源：Software Carpentry The Unix Shell 课程（swcarpentry.github.io/shell-novice/ 的 Download files 小节），作者：Software Carpentry / The Carpentries 社区。',
      licenseNote: '原文采用 CC BY 4.0 许可；本译文采用与原作相同的 CC BY 4.0 许可。',
      translatorNote: '本站精译（AI 辅助翻译、按本站纪律人工核对结构与红线），翻译日期 2026-09-18，依据当日抓取的仓库源文件（learners/setup.md）。',
      modifications: '精译核心内容（Download files、Install software、Open a new shell 三小节）；原文按操作系统分别给出的打开 shell 详细步骤概括为一段；「译注」为本站补充的上下文（TOP 官方 Assignment 对本节的范围限定），非原文内容。',
      body: [
        '# 下载文件',
        '你需要下载一些文件来跟学本课：',
        '- 下载 shell-lesson-data.zip，把文件移到你的桌面（Desktop）。',
        '- 解压该文件。这一步需要帮助就告诉你的讲师。完成后你的桌面上应该会出现一个名为 shell-lesson-data 的新文件夹。',
        '注意（原文提示框）：某些情况下解压出来的文件夹会「套娃」——桌面上的 shell-lesson-data 文件夹里面还有一个同名文件夹。在 Windows 上双击 zip 文件解压就会出现这种情况（系统会用 zip 文件名再建一层文件夹）；右键点击 zip 文件选择「全部解压缩（Extract All…）」可以避免。',
        '# 安装软件',
        '如果你还没有安装 shell 软件，需要先下载并安装它。',
        '译注（本站补充，非原文）：TOP 官方 Assignment 对本节有明确的范围限定——「只需照这一节里的说明做，不需要安装任何软件」。因此 TOP 学习者不需要执行本小节与下一小节的安装/打开步骤，按官方课程指示下载解压练习数据即可。',
        '# 打开一个新的 shell',
        '安装软件之后：打开一个终端（不确定你的系统上怎样打开终端的话，看原文下方的分系统说明）；在终端里输入 cd 并按回车键——这一步确保你以家目录作为工作目录开始。',
        '在课程中你将了解到怎样访问这个文件夹里的数据文件。',
        '原文还按系统给出了打开 shell 的指引：Windows 系统不自动带 Unix Shell 程序，课程建议使用 Git for Windows 附带的模拟器（Git Bash），它能同时提供 Bash shell 命令与 Git；高级用户也可以安装 Windows Subsystem for Linux（WSL，适用于 Windows 10 及以上）。macOS 与 Linux 各有对应的打开方式说明；如果所有选项都不适合你的情况，原文建议在网上搜索「Unix shell + 你的电脑型号 + 你的操作系统」。'
      ]
    },
    handling: 'zh-translation',
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
      overview: '官方点名要完成的第二节，是整套 CLI 练习的入门部分。shell 的定义本课正文已给出：shell 是一个让你用文字命令与计算机对话的程序，你在终端里输入的命令由它解释执行。官方提醒你的终端输出可能与课程展示的略有不同，不必因为提示符长得不一样就认为做错了；WSL2 用户注意官方的对应说明——课程里的 Desktop 在你这里应换成 home 目录（cd ~）。跟着做命令输入练习，注意命令写错时的报错形式。',
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
    license: 'Software Carpentry 课程材料采用 CC BY 4.0；本站提供中文精译（见卡内译文区块），译文采用与原作相同的许可。',
    zhTranslation: {
      kind: 'full',
      attribution: '原文《Introducing the Shell》，来源：Software Carpentry The Unix Shell 课程（swcarpentry.github.io/shell-novice/01-intro.html），作者：Software Carpentry / The Carpentries 社区。',
      licenseNote: '原文采用 CC BY 4.0 许可；本译文采用与原作相同的 CC BY 4.0 许可。',
      translatorNote: '本站精译（AI 辅助翻译、按本站纪律人工核对结构与红线），翻译日期 2026-09-18，依据当日抓取的仓库源文件（episodes/01-intro.md）。',
      modifications: '全节翻译（含问题、学习目标、正文四小节、Nelle 案例与要点总结）；命令行示例的输出文本压缩为文字说明；讲师备注（instructor notes）不属于学习者正文，未译。',
      body: [
        '# 本节回答的问题',
        '- 什么是命令 shell，我为什么要用它？',
        '# 学习目标',
        '- 解释 shell 与键盘、屏幕、操作系统以及用户程序之间的关系。',
        '- 解释什么时候、为什么应该使用命令行界面而不是图形界面。',
        '# 什么是 Shell？',
        '人与计算机的交互方式有很多种，例如键盘鼠标、触摸屏界面或语音识别系统。使用最广泛的个人电脑交互方式叫图形用户界面（GUI）：我们通过点击鼠标和操作菜单来下达指令。',
        'GUI 的视觉提示让它学起来直观，但对某些任务来说，这种交互方式的扩展性很差。',
        '命令行界面（CLI）让用户通过读写文字与计算机交互，它擅长把重复性任务变得自动、快速。',
        'shell 是一种让你键入命令的特定程序。本工作坊使用 Bash——最流行的 Unix shell。在 Unix 以及 Windows 的类 Unix 工具环境里，Bash 常常是默认 shell。',
        '# 为什么用 shell？',
        '想象这样的任务：为了一项文献研究，你要把一千个不同目录里的一千个文本文件各自的第三行复制出来，粘贴进同一个文件。',
        '用 GUI，你不仅要在桌前点好几个小时鼠标，还可能在这个重复过程中出错。',
        '用 CLI，你可以写出一系列命令，稳定而几乎瞬间地完成它。',
        'shell 既能用于简单任务（比如创建一个空文件夹），也能用一条命令启动（哪怕很复杂的）程序。事实上，一些工具和资源（例如云计算系统）通常要求用户熟悉 shell。shell 命令可以组合起来、保存为可复现的脚本，用于自动化重复任务。',
        '学习使用 shell 需要付出一些努力和时间。GUI 会把可选项摆在你面前让你挑，CLI 的选项却不会自动呈现。一开始可能让人发怵，但一旦熟悉了这种不同的交互方式，你就能高效地完成种类极多的任务。',
        '# 开始上手',
        '第一次打开 shell 时，你会看到提示符（prompt），表示 shell 正在等待输入。',
        'shell 通常用「$ 」（美元符号加一个空格）作提示符，但也可能用其他符号，本课示例统一显示为「$ 」。最重要的一点：键入命令时不要把提示符打进去，只输入提示符后面的命令本身。这条规则适用于本课程，也适用于其他来源的课程。另外注意，输入命令后要按回车键（Enter/Return）才会执行。',
        '提示符后面是文本光标——指示你键入的文字将出现在哪个位置的字符。光标通常是闪烁或常亮的方块，也可能是下划线或竖线，你可能在文本编辑器里见过它。',
        '你的提示符可能长得不太一样。特别是，多数流行的 shell 环境默认会在 $ 前显示用户名和主机名，例如「nelle@localhost $」。提示符甚至可能包含更多内容。如果你的提示符不只是简短的「$ 」，不必担心：本课不依赖这些额外信息，它们也不会妨碍你。唯一需要关注的就是「$ 」本身。',
        '来试第一条命令 ls（listing 的缩写），它会列出当前目录的内容。输入「$ ls」后回车，示例输出为：Desktop、Documents、Downloads、Library、Movies、Music、Pictures、Public 等目录名。',
        '提示框「Command not found」：如果 shell 找不到与你键入的命令同名的程序，会打印错误消息——例如输入 ks 会输出「ks: command not found」。这可能是命令打错了，也可能是对应的程序没有安装。',
        '# Nelle 的流水线：一个典型问题',
        '（本课贯穿案例）海洋生物学家 Nelle Nemo 刚结束在北太平洋环流为期六个月的调查归来，她在太平洋大垃圾带采集了胶质海洋生物样本。她有 1520 份样品，已经用一台测定仪器测出了 300 种蛋白质的相对丰度。她需要让这 1520 个文件逐个跑过一个名为 goostats.sh 的（虚构）程序。除了这个庞大任务，她还必须在月底前写完结果，论文才能赶上《Aquatic Goo Letters》的专刊。',
        '如果 Nelle 用 GUI 手动运行 goostats.sh，她要选择和打开文件 1520 次。假设每个文件跑 30 秒，整个过程会占去她 12 个多小时的注意力。改用 shell，Nelle 可以把这项单调的任务交给计算机，自己专心写论文。',
        '接下来几课将探索 Nelle 做到这一点的方法。具体来说，课程会讲解她怎样用命令 shell 运行 goostats.sh 程序、用循环把输入文件名这类重复步骤自动化，让计算机在她写论文的同时干活。还有个额外好处：处理流水线一旦搭好，以后每次收集到新数据都能重复使用。',
        '为完成任务，Nelle 需要知道怎样：',
        '- 导航到某个文件/目录',
        '- 创建文件/目录',
        '- 检查文件的长度',
        '- 把命令链接起来',
        '- 检索一组文件',
        '- 对文件做迭代',
        '- 运行包含她流水线的 shell 脚本',
        '# 要点（官方小结，全译）',
        '- shell 是一种程序，主要用途是读取命令并运行其他程序。',
        '- 本课使用 Bash——许多 Unix 实现中的默认 shell。',
        '- 在 Bash 里，通过在命令行提示符处输入命令来运行程序。',
        '- shell 的主要优势：动作与击键的比率高、支持自动化重复任务、能访问联网的机器。',
        '- 使用 shell 的一大挑战在于：知道需要运行什么命令、以及怎样运行。'
      ]
    },
    handling: 'zh-translation',
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
      overview: '官方点名要完成的第三节，对应本课最核心的一组导航命令：pwd（显示当前位置）、ls（列出内容）、cd（切换目录），这也是本课正文重点讲的部分。本课官方 Knowledge Check 有五题直接指向这一组命令——怎样进入指定目录、单独输入 cd 会去哪、cd .. 会去哪、怎样显示当前所在目录名、怎样列出目录内容。这一节要动手练而不是只读，练完能不看笔记在目录之间自由移动、随时知道自己在哪；官方提醒输出可能与课程展示略有不同，属正常现象。',
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
    license: 'Software Carpentry 课程材料采用 CC BY 4.0；本站提供中文精译（见卡内译文区块），译文采用与原作相同的许可。',
    zhTranslation: {
      kind: 'core',
      attribution: '原文《Navigating Files and Directories》，来源：Software Carpentry The Unix Shell 课程（swcarpentry.github.io/shell-novice/02-filedir.html），作者：Software Carpentry / The Carpentries 社区。',
      licenseNote: '原文采用 CC BY 4.0 许可；本译文采用与原作相同的 CC BY 4.0 许可。',
      translatorNote: '本站精译（AI 辅助翻译、按本站纪律人工核对结构与红线），翻译日期 2026-09-18，依据当日抓取的仓库源文件（episodes/02-filedir.md）。',
      modifications: '按核心章节精译：正文讲解部分（文件系统、pwd、根目录与家目录、ls 与选项、获取帮助、cd、.. 与 .、快捷键、绝对/相对路径、命令通用语法、Nelle 案例与 Tab 补全）全部译出，命令行示例输出压缩为文字；官方 keypoints 全译；4 道练习题及其解答不逐句翻译，概括为题旨清单；讲师备注未译。',
      body: [
        '# 本节回答的问题',
        '- 怎样在计算机里到处移动？',
        '- 怎样看到自己有哪些文件和目录？',
        '- 怎样指定计算机上某个文件或目录的位置？',
        '# 学习目标',
        '- 解释文件与目录的异同。',
        '- 把绝对路径改写成相对路径，反之亦然。',
        '- 构造出指向特定文件与目录的绝对路径和相对路径。',
        '- 使用选项（options）和参数（arguments）改变 shell 命令的行为。',
        '- 演示 Tab 补全的用法并解释它的优势。',
        '# 文件系统与 pwd',
        '操作系统中负责管理文件和目录的部分叫文件系统（file system）。它把数据组织成文件（存放信息）与目录（directory，也叫「文件夹」，存放文件或其他目录）。',
        '先用 pwd 命令（print working directory，打印工作目录）弄清「我现在在哪」。目录好比「地点」——使用 shell 时我们任何时刻都恰好在一个地点，称为当前工作目录。命令大多在当前工作目录（也就是「这里」）读写文件，所以运行命令前知道自己在哪很重要。例如输入 pwd，输出 /Users/nelle——这是用户 Nelle 的家目录（home directory）。',
        '家目录路径因系统而异：Linux 上形如 /home/nelle，Windows 上类似 C:\\Users\\nelle（不同 Windows 版本可能略有差异），课程示例默认用 macOS 输出。课程还假设你的 pwd 返回的就是家目录；如果不是，需要先用 cd 导航过去，否则本课一些命令不会按写出的样子工作。',
        '# 根目录与目录树',
        '整个文件系统看起来像一棵倒置的树。最顶层的目录是根目录（root directory），它容纳其他一切；用单独一个斜杠 / 表示——它就是 /Users/nelle 开头的那个斜杠。',
        '根目录里面有若干目录：bin（存放一些内置程序）、data（各种数据文件）、Users（各用户的个人目录所在地）、tmp（不需要长期保存的临时文件）等等。',
        '当前工作目录 /Users/nelle 存放在 /Users 里面（因为 /Users 是它名字的第一部分）；同样，/Users 存放在根目录 / 里面（因为它的名字以 / 开头）。',
        '注意 / 字符有两个含义：出现在文件或目录名的最前面时指根目录；出现在路径内部时只是分隔符。',
        '/Users 下面每个有账号的用户都有一个目录：Nelle 的文件在 /Users/nelle，同事 imhotep 和 larry 的分别在 /Users/imhotep 和 /Users/larry。通常打开新的命令提示符时，你默认就在自己的家目录里。',
        '# ls 与它的选项',
        '输入 ls 会打印当前目录中文件和目录的名字（结果会因系统与个人设置略有不同）。',
        '加上 -F 选项可以让输出更好懂：ls 会给名字追加分类标记——结尾 / 表示目录，@ 表示链接，* 表示可执行文件；没有分类符号的名字就是文件。视 shell 默认设置，还可能用颜色区分文件与目录。',
        '屏幕太乱时可以用 clear -x 清屏（某些 Bash 配置下单独 clear 会连滚动缓冲一起清掉、无法回滚查看之前的输出，clear -x 可避免；等价快捷键是 Control-L）。之前的命令仍可用上下方向键逐行调出，或滚动终端查看。',
        '# 获取帮助',
        '了解一个命令怎么用、接受哪些选项，有两种常见方式（依环境不同可能只有一种可用）：一是给命令传 --help 选项（Linux 和 Git Bash 可用），如 ls --help；二是用 man 阅读手册（Linux 和 macOS 可用），如 man ls。',
        '注意：有些命令内建于 Bash（不是文件系统里的独立程序），cd 就是一例。如果 man cd 显示「No manual entry for cd」，改用 help cd——help 命令用于查询 Bash 内建命令的用法信息。',
        'man 页面里的导航：上下方向键逐行移动，b 与空格键上下翻页；按 / 再输入要查的字符或单词进行搜索，多个命中时 n 向前、Shift+n 向后移动；按 q 退出 man。第三种获取帮助的方式是用浏览器搜索——搜索词加上「unix man page」有助于命中相关结果；GNU 也提供在线手册（含 core GNU utilities，覆盖本课许多命令）。',
        '选项使用建议（原文提示框）：当选项同时有短、长两种写法时——在 shell 里直接敲命令用短选项，减少击键、更快完成任务；在脚本里用长选项以求清晰，因为脚本只写一次、会被读很多次。',
        '使用不被支持的选项时，ls 等命令通常会打印错误消息，例如 ls -j 输出「ls: invalid option -- j」并提示用 ls --help 获取更多信息。',
        '# 探索其他目录：cd',
        'ls 不仅能列当前工作目录，还能列其他目录的内容：ls -F Desktop——其中 ls 是命令、-F 是选项、Desktop 是参数（argument），参数告诉 ls 要列的不是当前工作目录。如果当前工作目录下没有名为 Desktop 的目录，这条命令会报错；通常家目录里有 Desktop 目录（课程假设你当前的工作目录就是家目录）。',
        '示例输出为 shell-lesson-data/（课程准备时下载的练习数据目录）。层级化组织有助于管理工作：把几百个文件塞进家目录，就像把几百张纸堆在书桌上——远不如组织进命名合理的子目录好找。',
        '改变位置用 cd 命令（change directory）加目录名。cd 的字面意思有点误导：它不是「改变某个目录」，而是改变 shell 的当前工作目录——也就是改变「我们在哪里」的设置，相当于在图形界面里双击一个文件夹进入它。',
        '例如要进入上面看到的 exercise-data 目录，可以依次执行：cd Desktop、cd shell-lesson-data、cd exercise-data。cd 成功时不打印任何内容——这是正常的，许多 shell 命令成功执行时没有屏幕输出；随后运行 pwd 会显示现在位于 /Users/nelle/Desktop/shell-lesson-data/exercise-data，ls -F 列出该目录内容（alkanes/、animal-counts/、creatures/、numbers.txt、writing/）。也可以把路径串起来一步到位：cd Desktop/shell-lesson-data/exercise-data，再用 pwd 和 ls -F 验证。',
        '# 向上走：.. 与 .',
        '已经会沿目录树向下走（进入子目录），怎样向上走（离开当前目录、进入它的父目录）？在 exercise-data 里直接执行 cd shell-lesson-data 会报错「No such file or directory」——因为这样用的 cd 只能看见当前目录里面的子目录。',
        '向上走一层的快捷方式是 cd .. 。.. 是一个特殊目录名，意思是「包含本目录的那个目录」，即当前目录的父目录。执行 cd .. 后再 pwd，确认回到了 /Users/nelle/Desktop/shell-lesson-data。',
        '.. 通常不出现在 ls 的输出里。想显示它就给 ls 加 -a 选项（show all，含隐藏文件）：ls -F -a 输出 ./、../、exercise-data/、north-pacific-gyre/ 等。-a 会强制 ls 显示以 . 开头的文件和目录名。输出里还有另一个特殊目录 .，表示「当前工作目录」——给它起名字看似多余，后面会看到它的用处。',
        '多数命令行工具里，多个选项可以合并在一个 - 后、彼此不留空格：ls -F -a 等价于 ls -Fa。',
        '其他隐藏文件（原文提示框）：除了 .. 和 .，你可能还会看到 .bash_profile 文件，通常存放 shell 配置。以 . 开头的文件和目录一般用于配置计算机上的各种程序；. 前缀的作用是让这些配置文件在标准 ls 命令的输出里不碍眼。',
        '# 三个快捷方式',
        '单独输入 cd 不带目录名，会回到家目录——在文件系统里「迷路」时非常有用（用 pwd 验证）。',
        '路径开头的 ~（波浪号）代表「当前用户的家目录」。例如 Nelle 的家目录是 /Users/nelle 时，~/data 等价于 /Users/nelle/data。注意 ~ 只在路径的第一个字符位置才有效：here/there/~/elsewhere 不会展开。',
        '-（连字符）会让 cd 回到「上一个所在的目录」，在两个目录之间来回移动时效率极高：连续执行两次 cd - 就回到出发的目录。cd .. 与 cd - 的区别：前者向「上」走一层，后者回「来时的」位置。',
        '# 绝对路径与相对路径',
        '像 ls 或 cd 这样的命令使用目录名或路径时，到目前为止我们用的都是相对路径（relative paths）：从「我们现在所在的位置」出发寻找目标，而不是从文件系统根部出发。',
        '绝对路径（absolute path）写出从根目录开始的完整路径，以 / 开头。开头的 / 告诉计算机从文件系统的根开始沿路径走，所以无论运行命令时你在哪里，绝对路径永远指向恰好同一个目录。这让我们能从文件系统的任何位置（包括 exercise-data 里面）直接移动到目标目录：先 pwd 看到当前完整路径，从中取出需要的部分，如 cd /Users/nelle/Desktop/shell-lesson-data，再用 pwd 和 ls -F 确认。',
        '# shell 命令的通用语法',
        '以 ls -F / 为例拆解：ls 是命令（command），-F 是选项（option），/ 是参数（argument）。选项以单个连字符开头（短选项）或两个连字符开头（长选项）；选项改变命令的行为，参数告诉命令操作的对象（如文件与目录）。选项和参数有时统称参数（parameters）。一个命令可以带多个选项和多个参数，也不一定要有选项或参数。选项有时也被称为开关（switches）或标志（flags），尤其是不带参数的选项；本课程统一用「选项」这个词。',
        '各部分之间用空格分隔：省略 ls 与 -F 之间的空格，shell 会去找一个叫 ls-F 的命令——它不存在。大小写也可能要紧：ls -s 在名字旁显示大小，ls -S 按大小排序（-s 显示的大小以「块」为单位，不同操作系统定义不同，数字未必与示例一致）。',
        '# Nelle 的流水线：组织文件（含 Tab 补全）',
        '掌握了这些文件与目录知识，Nelle 可以开始组织蛋白质测定仪器将生成的文件了。她创建一个名为 north-pacific-gyre 的目录（提醒她数据来自哪里），用来放仪器的数据文件和她的数据处理脚本。',
        '每份实物样品都按她实验室的惯例标有唯一的十字符 ID（例如 NENE01729A）。Nelle 在采集日志里用这个 ID 记录样品的位置、时间、深度等特征，所以她决定把它用进数据文件名：仪器输出是纯文本，文件就叫 NENE01729A.txt、NENE01812A.txt 等等，全部 1520 个文件放进同一个目录。',
        '在当前目录 shell-lesson-data 中查看有哪些文件，可以运行 ls north-pacific-gyre/。这条命令很长，但可以让 shell 通过「Tab 补全」代劳大部分输入：键入 ls nor 再按 Tab 键，shell 自动把目录名补全为 ls north-pacific-gyre/。再按一次 Tab 没有反应（因为有多个候选文件）；连按两次 Tab 会列出全部文件。接着键入 G 再按 Tab，shell 会补出 goo（因为所有以 g 开头的文件共享前三个字符 goo）：ls north-pacific-gyre/goo；再连按两次 Tab 就能看到全部匹配文件：goodiff.sh 和 goostats.sh。',
        '# 练习（原文 4 道练习与解答，本译文概括题旨）',
        '- 探索更多 ls 选项：-l 使用长格式（除名字外还显示文件大小、最后修改时间等属性），配合 -h 让大小以人类可读形式显示（如 5.3K 而不是 5369）。',
        '- 按时间倒序列出：ls -t 按最后修改时间排序（替代默认的字母序），-r 反序；组合 -rt 时最近修改的文件排在最后——找自己最近的编辑或确认新输出文件是否已生成时很有用。',
        '- 绝对 vs 相对路径：给定起点 /Users/nelle/data，判断哪些命令能回到家目录 /Users/nelle（cd ~、cd、cd ..、cd ~/data/.. 可以；cd .、cd /、cd /home/nelle、cd ../..、cd home 不行）。',
        '- 另有一道「相对路径解析」与一道「ls 阅读理解」：看目录树图判断 ls -F ../backup 等命令的输出（.. 相对于当前工作目录解析）。',
        '- 具体题面与逐项解释见英文原文。',
        '# 要点（官方小结，全译）',
        '- 文件系统负责管理磁盘上的信息。',
        '- 信息存储在文件中，文件存储在目录（文件夹）中。',
        '- 目录还可以存储其他目录，由此形成目录树。',
        '- pwd 打印用户的当前工作目录。',
        '- ls [路径] 列出特定文件或目录的内容；ls 单独使用列出当前工作目录。',
        '- cd [路径] 改变当前工作目录。',
        '- 多数命令的选项以单个 - 开头。',
        '- 路径中的目录名在 Unix 上用 / 分隔，在 Windows 上用 \\ 分隔。',
        '- 单独的 / 代表整个文件系统的根目录。',
        '- 绝对路径从文件系统根部开始指定位置。',
        '- 相对路径从当前位置开始指定位置。',
        '- 单独的 . 表示「当前目录」；.. 表示「当前目录的上一级目录」。'
      ]
    },
    handling: 'zh-translation',
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
      overview: '官方点名要完成的第四节，把导航延伸到真正的增删改操作，涉及的命令包括 mkdir（建目录）、touch（建文件）、cp（复制）、mv（移动或重命名）、rm（删除）。删除类命令要特别谨慎：没有回收站兜底，属于不可逆操作，执行前应先用 ls 或 pwd 确认自己在正确的位置。练习重点是创建、复制、移动；删除操作先在练习目录里试，确认理解后果再在其他地方用。官方提醒输出可能与课程展示略有不同，属正常现象。',
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
    license: 'Software Carpentry 课程材料采用 CC BY 4.0；本站提供中文精译（见卡内译文区块），译文采用与原作相同的许可。',
    zhTranslation: {
      kind: 'core',
      attribution: '原文《Working With Files and Directories》，来源：Software Carpentry The Unix Shell 课程（swcarpentry.github.io/shell-novice/03-create.html），作者：Software Carpentry / The Carpentries 社区。',
      licenseNote: '原文采用 CC BY 4.0 许可；本译文采用与原作相同的 CC BY 4.0 许可。',
      translatorNote: '本站精译（AI 辅助翻译、按本站纪律人工核对结构与红线），翻译日期 2026-09-18，依据当日抓取的仓库源文件（episodes/03-create.md）。',
      modifications: '按核心章节精译：正文讲解部分（mkdir、命名建议、nano 与编辑器选择、touch、扩展名惯例、mv、cp、rm 与安全删除、多文件操作与通配符）全部译出，命令行示例输出压缩为文字；官方 keypoints 全译；6 道练习题及其解答不逐句翻译，概括为题旨清单；讲师备注未译。',
      body: [
        '# 本节回答的问题',
        '- 怎样创建、复制和删除文件与目录？',
        '- 怎样编辑文件？',
        '# 学习目标',
        '- 删除、复制和移动指定的文件和/或目录。',
        '- 用编辑器、或通过复制与重命名现有文件，在目录层级中创建文件。',
        '- 创建与给定示意图一致的目录层级。',
        '# 创建目录：mkdir',
        '以 exercise-data/writing 目录为例。先确认位置（pwd 应显示在 shell-lesson-data），然后 cd exercise-data/writing/ 并 ls -F，看到 haiku.txt 和 LittleWomen.txt 两个文件。',
        '用 mkdir thesis 创建名为 thesis 的新目录（命令没有输出）。mkdir 意为 make directory（创建目录）。因为 thesis 是相对路径（没有前导斜杠），新目录创建在当前工作目录中；ls -F 显示多了 thesis/，而刚创建的 thesis 目录里还什么都没有（ls -F thesis 无输出）。',
        'mkdir 不限于一次创建一个目录：-p 选项可以一步创建带嵌套子目录的层级，例如 mkdir -p ../project/data ../project/results；随后 ls -F ../project 显示 data/ 和 results/ 两个目录。',
        '「同一件事的两种做法」（原文提示框）：用 shell 创建目录与用文件管理器没有区别——用操作系统的图形文件管理器打开当前目录，thesis 目录同样会出现在那里。shell 和文件管理器是两种不同的交互方式，文件与目录本身是同一套。',
        '# 文件与目录命名建议（原文提示框）',
        '复杂的名字会让命令行工作变得痛苦。课程给出的命名建议：',
        '- 不要用空格。空格能让名字更易读，但命令行用空格分隔参数，所以文件和目录名里最好避开——用 - 或 _ 代替（例如 north-pacific-gyre/ 而不是 north pacific gyre/）。可以试试 mkdir north pacific gyre 再用 ls -F 看看到底创建了什么（会创建出多个目录！）。',
        '- 名字不要以 -（连字符）开头：命令会把以 - 开头的名字当作选项。',
        '- 只用小写字母、数字、.（句点）、-（连字符）和 _（下划线）。许多其他字符在命令行里有特殊含义，有些会让命令不按预期工作，甚至导致数据丢失。',
        '- 如果不得不引用含空格或其他特殊字符的名字，把名字用单引号包起来。',
        '- 名字全用小写字母通常是好实践：Windows 和 macOS 的文件系统一般不区分大小写，同一目录里分不清 thesis 和 Thesis。',
        '# 创建文本文件：nano',
        'cd thesis 进入目录，然后运行文本编辑器 Nano 创建文件 draft.txt：nano draft.txt。',
        '「选哪个编辑器？」（原文提示框）：说「nano 是文本编辑器」时，「文本」是字面意思——它只能处理纯字符数据，不能处理表格、图像或其他对人类友好的媒体。示例用它是因为它是最不复杂的文本编辑器之一；也因为这个特点，工作坊之后的工作它可能不够强大或灵活。Unix 系统（Linux、macOS）上许多程序员用 Emacs 或 Vim（都需要更长的学习时间），或用 Gedit、VS Code 等图形编辑器；Windows 上可以用 Notepad++，Windows 还内置了 notepad，可以像 nano 一样从命令行启动。无论用哪个编辑器，你都需要知道它到哪里找文件、把文件存到哪里：从 shell 启动时，它（大概率）以当前工作目录为默认位置；从开始菜单启动时，可能想存到桌面或文档目录——第一次「另存为」时可以导航到别处修改。',
        '输入几行文字，满意后按 Ctrl+O（按住 Control 再按 O）把数据写入磁盘，按回车接受建议的默认文件名 draft.txt；保存后按 Ctrl+X 退出编辑器、回到 shell。nano 退出后不留任何屏幕输出，但 ls 显示 draft.txt 已经创建。',
        '「Control、Ctrl 或 ^ 键」（原文提示框）：Control 键也叫 Ctrl 键。「按住 Control 再按 X」在各种资料里可能写成 Control-X、Control+X、Ctrl-X、Ctrl+X、^X 或 C-x。nano 屏幕底部显示「^G Get Help ^O WriteOut」，意思是 Control-G 获取帮助、Control-O 保存文件。',
        '# 另一种创建文件的方式：touch',
        'touch my_file.txt 会在当前目录生成名为 my_file.txt 的新文件（图形文件管理器里也能看到）。用 ls -l 检查：文件大小为 0 字节——不含任何数据，用编辑器打开是空白的。什么时候需要这样建文件？有些程序自己不生成输出文件，而是要求空文件已经存在，运行时寻找现有文件写入输出——touch 能快速生成这类空白文本文件。（原文练习建议之后用 rm my_file.txt 删掉它，避免影响后续课程的输出。）',
        '# 名字里有什么？（扩展名惯例，原文提示框）',
        '你可能注意到 Nelle 的文件都叫「某某点某某」，这部分课程里我们一直用扩展名 .txt。这只是惯例——文件也可以叫 mythesis 或几乎任何名字。但多数人多数时候用两段式名字，帮助自己（和自己的程序）分辨不同类型的文件。名字的第二部分叫文件扩展名（filename extension），指示文件存放的数据类型：.txt 表示纯文本文件，.pdf 表示 PDF 文档，.cfg 是装满某个程序参数的配置文件，.png 是 PNG 图像，等等。',
        '这只是惯例，尽管是重要的惯例。文件本身只包含字节；怎样按纯文本、PDF、配置文件、图像等规则解释这些字节，是我们和我们的程序的事。把一张鲸鱼的 PNG 图片命名为 whale.mp3，不会魔法般把它变成鲸歌录音，但可能让操作系统把该文件关联到音乐播放器——这时如果有人在文件管理器里双击 whale.mp3，音乐播放器会自动（且错误地）尝试打开它。',
        '# 移动与重命名：mv',
        '回到 shell-lesson-data/exercise-data/writing 目录（cd ~/Desktop/shell-lesson-data/exercise-data/writing）。thesis 目录里的 draft.txt 名字信息量不大，用 mv（move 的缩写）改名：mv thesis/draft.txt thesis/quotes.txt。第一个参数告诉 mv「移动什么」，第二个参数是「移到哪里」——把文件移到同一目录下的新名字，效果就是重命名。ls thesis 显示目录里现在只有一个文件 quotes.txt。',
        '指定目标文件名时要小心：mv 会静默覆盖同名的现有文件，可能导致数据丢失。默认 mv 覆盖前不询问；加 -i（--interactive）选项后 mv 会请求确认。',
        'mv 同样适用于目录。把 quotes.txt 移到当前工作目录：还是 mv，但这次第二个参数只用一个目录名——告诉 mv 保持文件名、把文件放到新位置（这正是命令叫「移动」的原因）。这里用的目录名是前面提过的特殊目录 . ：mv thesis/quotes.txt . 。',
        '移动后 ls thesis 输出为空（thesis 空了）；显式列 ls thesis/quotes.txt 报错「cannot access: No such file or directory」——ls 带文件名或目录参数时只列指定对象，参数不存在就报错。而 ls quotes.txt 确认文件已在当前目录。',
        '# 复制：cp',
        'cp 的工作方式很像 mv，只是复制而不是移动：cp quotes.txt thesis/quotations.txt。可以用带两个路径参数的 ls 验证——和多数 Unix 命令一样，ls 一次可以接受多个路径：ls quotes.txt thesis/quotations.txt 同时列出两个文件。',
        'cp 的 -r（--recursive，递归）选项让命令不仅作用于指定目录，还作用于它的全部内容。可以用它备份目录：cp -r thesis thesis_backup；ls thesis thesis_backup 显示两个目录里都有 quotations.txt。-r 不可缺少：复制目录时省略它会得到「-r not specified; omitting directory」的报错。',
        '「目标可以是新名字或目录」（原文提示框）：mv 或 cp 用两个参数时，第二个参数可以是「想要的位置加新名字」；如果第二个参数是现有目录的路径，mv/cp 就理解为把文件移动/复制到该目录、名字不变。例如 cp quotes.txt thesis 与 cp quotes.txt thesis/quotes.txt 效果相同。',
        '# 删除：rm（删除是永久的）',
        '回到 writing 目录，用 rm（remove 的缩写）删除 quotes.txt 收拾目录：rm quotes.txt。用 ls quotes.txt 确认，报错「No such file or directory」，文件已不在。',
        '「删除是永久的」（原文提示框）：Unix shell 没有可以恢复已删文件的回收站（多数 Unix 图形界面有）。删除文件时，它们从文件系统解除链接，磁盘空间即可被回收。确实存在查找并恢复已删文件的工具，但无法保证在任何特定情况下有效——计算机可能立刻回收该文件的磁盘空间。',
        '「安全使用 rm」（原文练习要点）：rm -i thesis_backup/quotations.txt 会在删除前提示「rm: remove regular file …?」——输入 y 确认删除、n 保留文件。因为 shell 没有回收站，删掉的文件会永远消失；-i 选项给你一个机会确认删除的只是想删的文件。',
        '用 rm thesis 删除目录会报错「cannot remove: Is a directory」——rm 默认只作用于文件，不作用于目录。加上递归选项 -r，rm 就能删除目录及其全部内容，而且不会有任何确认提示：rm -r thesis。鉴于 shell 删除的文件无法找回，rm -r 应当极其谨慎地使用（可以考虑加上交互选项：rm -r -i）。',
        '# 多文件与目录操作、通配符',
        '经常需要一次复制或移动多个文件：可以逐个列出文件名，也可以用通配符（wildcards）指定命名模式。通配符是在 Unix 文件系统中代表未知字符或字符集合的特殊字符。',
        'cp 接受三个或更多参数时，最后一个参数必须是目录，cp 把前面列出的其他文件复制进该目录；最后一个参数是文件名则报错「target … is not a directory」。例如：mkdir backup 后执行 cp creatures/minotaur.dat creatures/unicorn.dat backup/。',
        '* 是通配符，代表零个或多个任意字符：在 alkanes 目录里，*.pdb 匹配 ethane.pdb、propane.pdb 以及每个以 .pdb 结尾的文件；p*.pdb 只匹配 pentane.pdb 和 propane.pdb（开头的 p 限定文件名以字母 p 开始）。',
        '? 也是通配符，代表恰好一个字符：?ethane.pdb 可匹配 methane.pdb，而 *ethane.pdb 同时匹配 ethane.pdb 和 methane.pdb。通配符可以组合：???ane.pdb 表示三个任意字符后接 ane.pdb，匹配 cubane.pdb、ethane.pdb、octane.pdb。',
        'shell 看到通配符时，会在运行命令之前把通配符展开为匹配的文件名列表。例外：通配符表达式匹配不到任何文件时，Bash 会把表达式原样作为参数传给命令——例如在只有 .pdb 文件的 alkanes 目录里输入 ls *.pdf，会报「没有叫 *.pdf 的文件」的错误。一般来说，wc、ls 这类命令看到的是展开后的文件名列表，而不是通配符本身。展开通配符的是 shell，不是其他程序。',
        '# 练习（原文 6 道练习与解答，本译文概括题旨）',
        '- 重命名文件：把拼错的 statstics.txt 改成 statistics.txt，正确做法是 mv statstics.txt statistics.txt（cp 会留下错误名字的副本；mv/cp 到 . 不提供新名字）。',
        '- 预测 mv 与 cp 混合序列的输出：关键在 .. 相对「当前工作目录」解析，而不是相对被复制文件的位置。',
        '- 多文件名复制：三个以上参数时最后一个必须是目录。',
        '- 列出匹配模式的文件名：用 * 与 ? 的组合精确匹配出 ethane.pdb 与 methane.pdb（答案 ls *t??ne.pdb）。',
        '- 通配符综合练习（备份数据主题）：cp *calibration.txt backup/calibration、cp 2015-11-* …（全部十一月文件）、cp *-23-dataset* …（23 日创建的数据集）。',
        '- 组织目录与文件（mv *.dat analyzed）与复现目录结构（mkdir -p 可一步创建含中间层的目录；不用 -p 时，给不存在目录建子目录会报错；先建顶层再逐级建、或 cd 进去建也对，但最后一组命令会把 raw/processed 建到 data 的同级）。',
        '- 具体题面与逐项解释见英文原文。',
        '# 要点（官方小结，全译）',
        '- cp [旧] [新] 复制一个文件。',
        '- mkdir [路径] 创建一个新目录。',
        '- mv [旧] [新] 移动（重命名）一个文件或目录。',
        '- rm [路径] 移除（删除）一个文件。',
        '- * 匹配文件名中零个或多个字符：*.txt 匹配所有以 .txt 结尾的文件。',
        '- ? 匹配文件名中任意单个字符：?.txt 匹配 a.txt，但不匹配 any.txt。',
        '- Control 键的写法有多种，包括 Ctrl-X、Control-X 和 ^X。',
        '- shell 没有回收站：删掉的东西就真的没了。',
        '- 多数文件名形如「名字.扩展名」。扩展名不是必需的，也不保证任何事情，但通常用于指示文件中数据的类型。',
        '- 视你的工作类型，你可能需要比 Nano 更强大的文本编辑器。'
      ]
    },
    handling: 'zh-translation',
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
      overview: '这是官方在 WSL2 说明里直接给出下载命令的练习数据文件，后面三节课程都要用它。官方给 WSL2 用户的完整做法是三条命令：wget 下载这个 zip、sudo apt install unzip 安装解压工具、unzip shell-lesson-data.zip 解压；非 WSL2 用户按课程 Download files 小节的说明获取同一份数据即可。它是压缩数据文件而不是网页，浏览器直接打开会触发下载而不是显示内容；下载到练习目录后解压，确认里面出现课程要用的子目录，练习环境就齐备了。',
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
      overview: '官方 Knowledge Check 的五道题全部指向这本在线书的 basics 章节，它是回答这些问题的权威出处：怎样进入某个指定目录、单独输入 cd 会到哪、cd .. 会到哪、怎样显示当前所在目录的名字、怎样显示当前目录的内容。官方在五个问题后各给了不同的锚点，都指向同一章节内的小节。Softcover 是在线出版平台，本书为英文；本站核验的是可达性，未复制书内内容。做 KC 时按题目跳到对应小节，这一章也可以当作命令速查表长期收藏。',
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
      overview: '官方 Assignment 在配置 SSH 密钥的步骤里用到这份参考文档：现在你需要复制你的公开 SSH 密钥，为此要用一个叫 cat 的命令把文件内容读到控制台。官方特别提示：这种情况下 .pub 文件扩展名很重要——要 cat 的是公开密钥文件，而不是私有密钥文件。cat 的用途是把文件内容原样输出到终端，这样你才能选中并复制密钥文本。本课涉及密钥操作，务必区分公开密钥（可以复制粘贴给别人）与私有密钥（绝不外泄、绝不复制给任何人）。',
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
      overview: '官方 Assignment 的收尾步骤：按照 GitHub 的说明测试你的 SSH 连接。官方同时要求确认终端输出的指纹与 GitHub 公布的四个公开指纹之一相匹配——这是确认对方真的是 GitHub 的关键一步。GitHub 文档提供 platform 参数，官方给的是 platform=linux，对应 Linux / WSL2 环境的说明，macOS 用户可按页面提示切换。官方简体中文版文档已核验，与英文版同一篇；按步骤执行测试命令，并逐字比对指纹，不要看到提示就直接输入 yes。',
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
      overview: '官方要求把终端里显示的指纹与 GitHub 公布的四个公开指纹之一做比对，这是确认对方真的是 GitHub 的关键一步。指纹是一串哈希值，用来标识一个密钥；比对指纹的目的是防止连到假冒服务器。官方明确说有四个公开指纹，页面上会列出全部，只要匹配其中之一即可。这一步是安全检查，跳过它就等于放弃了验证对方身份的机会；打开页面找到指纹列表，与终端输出逐字符比对，尤其是开头和结尾。官方简体中文版文档已核验。',
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
      overview: '官方 Assignment 要求打开 GitHub 的双因素认证（2FA）文档并按配置说明操作，给账号加上第二道验证。官方给了具体建议：第 1 步推荐使用 Google Authenticator，它是一个基于时间的一次性密码（TOTP）应用；官方指定的锚点就是「使用 TOTP 应用配置双因素认证」这一节，不必读其他认证方式。配置过程中应用会给出恢复码，应当妥善保存在本机之外可访问的地方——恢复码属于账号敏感信息，不要贴到聊天、代码或截图里。官方简体中文版文档已核验；本站不存储、不显示任何认证信息。',
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
      overview: '官方要求：注册账号时会填写邮箱，这个邮箱默认用于标识你的贡献；如果你在意隐私，或只是不想让邮箱公开，登录后要在 Email Settings 页面勾选两个复选框。这是登录之后才能访问的设置页——未登录访问会被重定向到登录页，这不是链接失效。官方在本课还要求记下 GitHub 提供的私有邮箱地址，后续 Git 配置会用到它，这样既能公开参与贡献，又不暴露真实邮箱。本站不代为登录，不收集、不存储任何账号或邮箱数据。',
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
      overview: '官方在推荐 Google Authenticator 之后紧接着给出操作步骤：打开 Google Account Help，点 Android 或 iPhone & iPad，然后按下载与设置说明操作。官方把入口分成了两个平台按钮，你需要按自己的手机系统选择，不要照着另一平台的截图操作。Google Authenticator 是官方推荐的 TOTP 应用，用于 GitHub 的双因素认证；完成后手机上就能生成 2FA 验证码。官方简体中文版帮助文档已核验，与英文版是同一篇。',
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
      overview: '官方 Assignment 第三条：读 About GitHub and Git，简要了解 GitHub 是什么，以及 Git 与 GitHub 怎样协同工作。官方给了明确的范围限定——末尾的 Where do I start? 一节可以跳过；官方 Knowledge Check 有一题「为什么 Git 和 GitHub 对开发团队有用」直接指向这一篇。关键区分本课正文已给出：Git 是版本控制系统软件，GitHub 是基于 Git 的托管服务，两者不是同一个东西，也不是同一家公司创建的。GitHub 文档改版后英文页现役标题为 What is GitHub；官方简体中文版已核验，与英文版同一篇文档。',
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
      overview: '官方 Assignment 第一条：读 Pro Git 的 Getting Started 部分第 1.1 到 1.4 章，用来了解本地、集中式与分布式版本控制系统之间的区别——这也是官方点名要学的重点，不需要读完整本书。Pro Git 是 Git 官方推荐的书籍，中文版由官方站点 git-scm.com 提供（本站已内容级核验，正文汉字 6092 个），与英文版章节结构一致；这四章对应中文版「起步」一节下的关于版本控制、Git 简史、Git 是什么、命令行与安装配置。注意中文版章节地址的 slug 本身是中文，直接套英文 slug 会 404，本站给出的链接取自官方目录。',
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
      overview: '官方 Assignment 第二条：看这个「2 分钟讲清什么是 Git」的视频，它讲的是 Git 是什么，以及它怎样改善个人与团队开发者的工作流；官方 Knowledge Check 的「为什么 Git 对开发者有用」一题同样指向它。本站已用 oEmbed 接口核验其真实标题与作者 Programming with Mosh；观看需要 YouTube 访问权限。两分钟很短，重点听它怎样解释「保存历史版本」这件事的价值，官方描述强调的个人工作流与团队协作两个层面可以分别对照。',
      why: '官方 Assignment 第二条：看这个“2 分钟讲清什么是 Git”的视频，它讲的是 Git 是什么，以及它怎样改善个人与团队开发者的工作流。',
      points: [
        '官方 Knowledge Check 有一题是“为什么 Git 对开发者有用”，同样指向这个视频。',
        '需要 YouTube 访问权限。',
        '官方描述强调两个层面：个人工作流与团队协作，看的时候可以分别对照。'
      ],
      terms: ['Git', 'version control（版本控制）', 'workflow（工作流）'],
      focus: '两分钟很短，重点听它怎样解释“保存历史版本”这件事的价值。',
      takeaway: '能用一两句话说清 Git 解决了什么问题。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频、不声称有中文字幕。',
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
      overview: '官方 Assignment 第四条：看看 TOP 的 GitHub 仓库，所有课程都存在这里。这正是本站中文导读所依据的官方源文件所在位置——本站每课 sources.json 里的指纹就来自这个仓库的 Markdown 文件。官方的用意不只是让你看代码，而是让你直观感受一个真实项目是怎样用 Git 组织的：目录结构、提交历史、分支与改动记录。仓库界面为英文，GitHub 没有为仓库内容提供机器翻译版本；看它的目录结构和最近的提交记录，感受真实项目怎样演进即可。',
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
    license: 'TOP 课程仓库采用 CC BY-NC-SA 4.0；本站对其 README 说明页提供中文精译（见卡内译文区块），译文采用与原作相同的许可；仓库本体不复制。',
    zhTranslation: {
      kind: 'full',
      attribution: '原文《The Odin Project Curriculum（README）》，来源：GitHub 仓库 TheOdinProject/curriculum（github.com/TheOdinProject/curriculum），作者：The Odin Project 社区，创建者 Erik Trautman。',
      licenseNote: '原文采用 CC BY-NC-SA 4.0 许可；本译文采用与原作相同的 CC BY-NC-SA 4.0 许可。',
      translatorNote: '本站精译（AI 辅助翻译、按本站纪律人工核对结构与红线），翻译日期 2026-09-18，依据当日抓取的仓库 README.md 源文件。',
      modifications: '全文翻译（README 不长，全部译出）；原文中的站内链接改为文字表述；仓库本身的课程内容不在本译文范围内——本译文只覆盖 README 说明页。',
      body: [
        '# The Odin Project 课程仓库',
        'The Odin Project（TOP）是一套用于学习全栈 Web 开发的开源课程。我们的课程划分为多个独立的 course，每个 course 深入覆盖一门主题语言。每个 course 包含一系列课程（lessons），其间穿插多个项目。这些项目让学习者有机会练习所学内容，从而强化并巩固课程中学到的理论知识。完成的项目可以收入学习者的作品集。',
        '课程由原创书面内容与精心挑选的全网资源汇编组合而成。这正是可以参与贡献的地方！',
        '这个仓库存放着我们的网站所使用的实际课程文件。至于拉取这些课程内容、包含我们前端与后端代码的 TOP 应用本体，请前往 TOP 主仓库（TheOdinProject/theodinproject）。',
        '我们的社区在 TOP Discord 服务器上。',
        '# 贡献',
        'The Odin Project 依靠开源贡献来改进、成长和繁荣。我们欢迎各种经验水平和背景的贡献者来帮助维护这套出色的课程与社区。如果你想为课程做贡献，请务必先完整阅读我们的贡献指南（仓库内的 CONTRIBUTING.md）。',
        '你可以为课程做的贡献包括：',
        '- 更正拼写错误和其他语法错误。',
        '- 重写现有课程的部分内容，让它们更清晰、更易懂。',
        '- 修复失效链接。',
        '- 添加你认为能让课程更好的新资源链接。',
        '- 在获得批准后着手编写全新的课程。',
        '编程愉快！（Happy Coding!）',
        '使用详情见仓库内的 license.md。本仓库由 Erik Trautman 创建。'
      ]
    },
    handling: 'zh-translation',
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
      overview: '官方 Assignment 第四条的后半句：在课程仓库里看看所有的贡献者，体会 Git 怎样记录全部协作努力，以及 GitHub 怎样把这些协作可视化。这一条的重点是「可视化」——贡献者图表把大量提交记录汇总成可读的图形，让你看到谁在什么时间贡献了多少。它同时也是第 2 课官方正文提到的开源协作的具体例证：这门课程由众多志愿者共同维护，不是一个人写的。GitHub 首次打开该图表时可能需要几秒钟计算，属于正常现象。',
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
      overview: '这是一份排错用文档：官方在 git push 步骤里给了明确的指引——如果此时收到 “Support for password authentication was removed on August 13, 2021.” 这条消息，说明你前面的步骤做错了，是用 HTTPS 而不是 SSH 克隆的；请按切换远程地址的说明改成 SSH，然后再推送。识别方法本课正文已给出：完整命令应类似 git clone git@github.com:USER-NAME/REPOSITORY-NAME.git，如果你的地址是 https:// 开头，说明选的是 HTTPS 选项。没遇到这条报错时可以先跳过，遇到时再回来照做；官方要求 platform=linux，对应 Linux / WSL2 说明。官方简体中文版已核验。',
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
      overview: '官方在正文讲默认分支时给了这个仓库作为更多信息：关于从 master 改名为 main 的变更说明。现状本课正文已说明：GitHub 已把默认分支名从 master 改为 main，因此你新建仓库时默认分支会叫 main；实际影响是命令里的分支名——本课统一使用 git push origin main 这样的写法。这个仓库是 GitHub 官方为说明该变更而建的，README 里给出了改名理由与迁移指引。你只需理解「为什么你的分支叫 main 而旧教程写 master」，知道两者指同一角色，不必读完整迁移方案。',
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
      overview: '官方在讲「修改 Git 提交信息编辑器」时链接了 Vim 条目：如果你用 VS Code（按本课程的要求你就应该用它），有办法确保在 git commit 不带 -m 参数时，不会卡在 Vim 里写提交信息。官方给出的配置命令是 git config --global core.editor "code --wait"；改了没有坏处——你既可以在终端里写提交信息，也可以在 VS Code 里舒服地写，除非你本来就喜欢用 Vim。Vim 是一款历史悠久的终端文本编辑器，操作方式与常见图形编辑器差别很大，这正是新手容易「卡在里面出不来」的原因。中文维基百科简体版已核验；读条目开头了解 Vim 是什么即可，重点是执行那条配置命令。',
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
      overview: '官方 Knowledge Check 的两道题都指向这篇文章：「HTML 和 CSS 分别是什么的缩写」指向其 What is HTML 小节，「HTML、CSS 与 JavaScript 的区别是什么」指向全文。核心区分本课正文已给出：HTML 负责网页的结构与内容，CSS 负责外观与样式，两者分工明确；JavaScript 属于后续课程范围。官方正文还用了同一个类比——把网页想成人的话，HTML 是骨骼，CSS 是皮肤和衣服。这是一篇第三方设计工作室的博客文章，本站未复制其内容；直接读 What is HTML 与讲区别的部分，用来回答官方 KC 的两道题。',
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
      overview: '官方 Assignment 第一条：看这个视频，在你深入每一项技术之前，它会快速概述 HTML、CSS、JavaScript 这三种技术怎样协同工作。官方定位它是「深入之前的快速总览」，所以不必指望它讲细节；本课是 HTML 与 CSS 单元的入口课，官方要求先看总览再进入后面的具体课程。本站已用 oEmbed 接口核验其真实标题与作者 Danielle Thé；观看需要 YouTube 访问权限。看时注意它怎样说明三者的分工与配合顺序。',
      why: '官方 Assignment 第一条：看这个视频，在你深入每一项技术之前，它会快速概述这三种技术怎样协同工作。',
      points: [
        '官方定位它是“深入之前的快速总览”，所以不必指望它讲细节。',
        '需要 YouTube 访问权限。',
        '本课是 HTML 与 CSS 单元的入口课，官方要求先看总览再进入后面的具体课程。'
      ],
      terms: ['HTML', 'CSS', 'JavaScript', 'front end（前端）'],
      focus: '注意它怎样说明三者的分工与配合顺序。',
      takeaway: '对整个前端技术栈有一个整体框架，再开始逐课深入。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频、不声称有中文字幕。',
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
      overview: '官方在正文说明：HTML 有一份庞大的预定义标签清单，你可以用它们创建各种不同的元素；为内容使用正确的标签很重要。官方解释了为什么重要，涉及两个方面——网站在搜索引擎中的排名，以及对依赖辅助技术（例如屏幕阅读器）上网的用户而言的可访问性。这一页是查阅用的参考清单，不是需要通读的文章：用到某个标签时再来查它的含义与属性，把它当字典用。MDN 官方简体中文版「HTML 元素参考」已核验，每个元素都有对应的中文页面。',
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
      overview: '官方 Assignment 第一条就是看 Kevin Powell 的这个视频，它是 HTML 单元的第一份视频材料。HTML 的定义要点本课正文已给出：HTML 由元素组成，元素通过标签告诉浏览器怎样显示内容；标签通常成对出现，有开始标签和结束标签。Kevin Powell 是官方在 HTML 与 CSS 单元多次引用的作者，后续第 15、16、18 课都有他的视频。本站已用 oEmbed 接口核验其真实标题与作者；观看需要 YouTube 访问权限。对照本课中文讲解的元素与标签结构看，注意他怎样解释成对标签。',
      why: '官方 Assignment 第一条就是看 Kevin Powell 的这个视频，它是 HTML 单元的第一份视频材料。',
      points: [
        '本课正文已给出 HTML 的定义要点：HTML 由元素组成，元素通过标签告诉浏览器怎样显示内容；标签通常成对出现，有开始标签和结束标签。',
        'Kevin Powell 是官方在 HTML 与 CSS 单元多次引用的作者，后续第 15、16、18 课都有他的视频。',
        '需要 YouTube 访问权限。'
      ],
      terms: ['HTML element（元素）', 'tag（标签）', 'opening tag / closing tag（开始 / 结束标签）', 'attribute（属性）'],
      focus: '对照本课中文讲解的元素与标签结构看，注意他怎样解释成对标签。',
      takeaway: '能自己写出一个带开始标签、内容与结束标签的完整元素。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频、不声称有中文字幕。',
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
      overview: '官方 Assignment 第二条：把你写好的 HTML boilerplate 拿去 W3C 的 HTML validator 校验。官方解释了它的价值——校验器能确保你的标记是正确的，而且是极好的学习工具，因为它会反馈你可能经常犯却没意识到的语法错误，例如漏掉的结束标签、HTML 里多余的空格。官方指定的入口是 validate by input（粘贴代码校验）这个标签页，同一站点也支持按地址或直接上传文件校验。注意这是 W3C 提供的公共服务：粘贴代码即等于把该段代码发送给第三方服务，请勿粘贴包含个人信息的文件。',
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
      overview: '官方 Assignment 第一条：看并跟着做 Kevin Powell 这个精彩的「搭建你的第一个网页」视频——官方用的是 Watch and follow along（看并跟着做），所以这一项要求动手，不只是观看。boilerplate 的固定组成本课正文已列出：DOCTYPE 声明、html 元素及其 lang 属性、head 与 body、meta charset、title。本站已用 oEmbed 接口核验其真实标题与作者；观看需要 YouTube 访问权限。跟着敲一遍完整的 boilerplate，重点理解每一行为什么必须存在。',
      why: '官方 Assignment 第一条：看并跟着做 Kevin Powell 这个精彩的“搭建你的第一个网页”视频。',
      points: [
        '官方用的是 Watch and follow along（看并跟着做），所以这一项要求动手，不只是观看。',
        '本课正文已列出 boilerplate 的固定组成：DOCTYPE 声明、html 元素及其 lang 属性、head 与 body、meta charset、title。',
        '需要 YouTube 访问权限。'
      ],
      terms: ['boilerplate（样板代码）', 'DOCTYPE（文档类型声明）', 'head / body（头部 / 主体）', 'meta charset（字符编码声明）'],
      focus: '跟着敲一遍完整的 boilerplate，重点理解每一行为什么必须存在。',
      takeaway: '不看参考也能写出一个合法的 HTML boilerplate。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频、不声称有中文字幕。',
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
      overview: '官方 Assignment 第三条要求做一个纯博客文章页面练手，并说你可以用 Lorem Ipsum 生成占位假文，在建站过程中代替真实文字。Lorem ipsum 是一段没有实际含义的拉丁文变体文本，用途是让排版效果可见，同时不让读者被内容分心。官方还给了更方便的做法：VS Code 内置了生成 lorem ipsum 的快捷方式——在想要假文的那一行输入 lorem 再按 Enter 键。中文维基百科条目已核验为简体版本，可对照阅读其来历；实际练习时直接用 VS Code 的快捷方式更快。',
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
      overview: '官方 Assignment 第一条要求看 Kevin Powell 的段落与标题视频，对应本课最核心的两组元素。要点本课正文已给出：段落用 p 元素；标题用 h1 到 h6 六个层级，h1 最重要、通常每页只用一次，h6 最次要。官方在本课还特别提醒不要靠加粗或放大字号来伪装标题，而要用真正的标题元素——这与可访问性和搜索排名有关。本站已用 oEmbed 接口核验其真实标题与作者；观看需要 YouTube 访问权限。看时注意他怎样选择合适的标题层级、为什么不跳级使用。',
      why: '官方 Assignment 第一条要求看 Kevin Powell 的段落与标题视频，对应本课最核心的两组元素。',
      points: [
        '本课正文已给出要点：段落用 p 元素；标题用 h1 到 h6 六个层级，h1 最重要、通常每页只用一次，h6 最次要。',
        '官方在本课还特别提醒不要靠加粗或放大字号来伪装标题，而要用真正的标题元素，这与可访问性和搜索排名有关。',
        '需要 YouTube 访问权限。'
      ],
      terms: ['paragraph（段落，p 元素）', 'heading（标题，h1–h6）', 'heading hierarchy（标题层级）'],
      focus: '注意他怎样选择合适的标题层级，以及为什么不能跳级使用。',
      takeaway: '能用正确的 p 与 h1–h6 组织一篇文章的结构。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频、不声称有中文字幕。',
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
      overview: '官方 Assignment 第二条要求看这个视频，它覆盖粗体、斜体文本与 HTML 注释。本课正文已区分了两组元素：b 与 strong 都显示为粗体，i 与 em 都显示为斜体，但 strong 与 em 带有语义含义，浏览器与辅助技术会区别对待；官方 Assignment 第 3 条的练习任务明确要求段落中要有加粗和斜体的文字，所以这一集与练习直接对应。本站已用 oEmbed 接口核验其真实标题与作者；观看需要 YouTube 访问权限。重点听语义元素与非语义元素的差别，这是本课常考的点。',
      why: '官方 Assignment 第二条要求看这个视频，它覆盖粗体、斜体文本与 HTML 注释。',
      points: [
        '本课正文已区分了两组元素：b 与 strong 都显示为粗体，i 与 em 都显示为斜体，但 strong 与 em 带有语义含义，浏览器与辅助技术会区别对待。',
        '官方 Assignment 第 3 条的练习任务明确要求段落中要有加粗和斜体的文字，所以这一集与练习直接对应。',
        '需要 YouTube 访问权限。'
      ],
      terms: ['strong / b（强调 / 粗体）', 'em / i（着重 / 斜体）', 'HTML comment（HTML 注释）'],
      focus: '重点听语义元素与非语义元素的差别，这是本课 KC 常考的点。',
      takeaway: '知道什么时候该用 strong/em 而不是 b/i，并会写 HTML 注释。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频、不声称有中文字幕。',
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
      overview: '官方在正文讲无序列表时直接链接了 MDN 的 ul 元素页面，作为该元素的权威参考。用法本课正文已给出：无序列表用 ul 元素创建，列表中的每一项用列表项元素 li 创建，无序列表的每一项前面会显示项目符号。MDN 元素页会列出该元素的全部属性、可嵌套的内容与可访问性说明，比课程正文更完整。MDN 官方简体中文版「<ul>：无序列表元素」已核验，与英文版同一篇文档；读属性与可访问性两节即可，示例部分本课正文已经覆盖。',
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
      overview: '官方在正文讲有序列表时直接链接了 MDN 的 ol 元素页面，作为该元素的权威参考。用法本课正文已给出：有序列表用 ol 元素创建，其中每一项同样用 li 创建，区别是有序列表的每一项以数字开头而不是项目符号。选择 ul 还是 ol 取决于内容本身是否有顺序：步骤、排名用 ol，并列项用 ul。MDN 官方简体中文版已核验；读属性一节，了解 start、reversed、type 等控制编号的属性，需要查细节时就知道去 MDN 中文页而不是靠记忆。',
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
      overview: '官方在正文讲绝对链接时链接了这篇 MDN 文章：指向互联网上其他网站页面的链接叫绝对链接，典型的绝对链接由 scheme://domain/path 三部分组成，并且总会包含目标的 scheme 与 domain。本课正文已区分两种链接——绝对链接包含完整的 scheme 与 domain；相对链接只写出与本站目标页面的位置关系。官方指定的锚点是 URL 的组成（anatomy of a URL）这一节，正好对应三段的拆解。MDN 官方简体中文版「什么是 URL？」已核验，锚点在中文页同样存在；读那一节即可。',
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
      overview: '官方在解释 noreferrer 属性时链接了这篇 MDN 隐私指南：noreferrer 与 noopener 作用相同，但还会阻止原页面的某些细节被传给新页面——因为 referrer 信息（访客从哪个页面来）并不总是适合分享，把它传给外部站点在某些场景下会造成隐私泄露。本课正文已给出 noopener 的作用：阻止新标签页访问原页面，否则会带来像 tabnabbing 这类钓鱼攻击的可能；现代浏览器对任何带 target="_blank" 的链接都会自动设置 noopener，但为了兼容历史浏览器，你仍常见到手动写上它。本站已核验该页的 zh-CN 语言版本返回 404，MDN 未提供这一篇的中文翻译，因此只提供英文链接。',
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
    license: 'MDN 内容采用 CC-BY-SA 2.5；本站提供中文精译（见卡内译文区块），译文采用与原作相同的许可；该篇无官方中文版（zh-CN 404 已核验）。',
    zhTranslation: {
      kind: 'full',
      attribution: '原文《Referer header: Privacy and security concerns》，来源：MDN（Mozilla，developer.mozilla.org），作者：MDN 贡献者。',
      licenseNote: '原文采用 CC-BY-SA 2.5 许可；本译文采用与原作相同的 CC-BY-SA 2.5 许可。',
      translatorNote: '本站精译（AI 辅助翻译、按本站纪律人工核对结构与红线），翻译日期 2026-09-18，依据当日抓取的 mdn/content 仓库源文件。本站已核验该篇无 MDN 官方中文版（zh-CN 路径返回 404）。',
      modifications: '全文翻译（含正文四节与缓解手段清单）；原文内嵌链接改为文字表述；代码与标头标识符（Referer、POST、GET、no-referrer、referrerpolicy、noreferrer 等）保留原文；「参见」节仅保留条目名。',
      body: [
        'Referer HTTP 标头带有与之相关的隐私和安全风险。本文描述这些风险，并给出缓解建议。',
        '# referrer 问题',
        'Referer 标头（原文如此拼写，正确英文拼写为 referrer）包含一个请求的来源地址——例如用户从上一个网页点击链接到达当前请求页面时，那个上一页面的地址；或者加载某张图片或其他资源的页面的地址。它有许多相当无害的用途，包括统计分析、日志记录或优化缓存。但也存在更成问题的用途，例如跟踪或窃取信息；甚至只是副作用——比如无意间泄露敏感信息。',
        '举例来说，考虑一个页脚带社交媒体链接的「重置密码」页面。如果用户点击了那个链接，视信息共享方式而定，社交媒体站点可能收到重置密码的 URL，并可能继续使用被共享的信息，从而危及用户安全。',
        '同样的逻辑，你页面里嵌入的来自第三方站点的图片，也可能把敏感信息泄露给第三方。即使安全没有受到威胁，这些信息也可能不是用户愿意分享的。',
        '# 我们怎样修复？',
        '大部分风险可以通过合理的应用设计来缓解。合理的应用会使用一次性的密码重置 URL，或把它与唯一的用户令牌组合，来消除此类风险。用更安全的方式传输敏感数据也能降低风险。',
        '尽可能使用 POST 而不是 GET，避免经由 URL 把敏感数据传递给其他位置。',
        '你的站点应始终使用 HTTPS。这有许多安全优势，包括 HTTPS 站点绝不会向非 HTTPS 站点传送 referrer 信息。如今大部分 Web 已使用 HTTPS，这条建议的相关性有所下降，但仍值得考虑。',
        '此外，应考虑从网站的安全区域（密码重置页、支付表单、登录区等）移除所有第三方内容（例如用 iframe 嵌入的社交网络小部件）。',
        '你还可以用以下手段缓解此类风险：',
        '- 在服务器端使用 Referrer-Policy 标头，控制通过 Referer 标头发送哪些信息。例如 no-referrer 指令会完全省略 Referer 标头。',
        '- 在可能泄露此类信息的 HTML 元素（如 img 和 a）上使用 referrerpolicy 属性，例如设为 no-referrer 以完全停发 Referer 标头。',
        '- 在可能泄露此类信息的 HTML 元素（如 form 和 a）上把 rel 属性设为 noreferrer。',
        '- 使用 name 为 referrer、content 为 no-referrer 的 meta 元素，为整个文档禁用 Referer 标头。',
        '- Exit page（退出页）技术：经由中间页跳转以隐藏 Referer。',
        '注重安全的服务器端框架往往内置了此类问题的缓解措施，例如：Django 的安全机制（尤其是跨站请求伪造 CSRF 保护）；Helmet 的 referrer-policy 中间件——用于在 Node.js/Express 应用中设置 Referrer-Policy（Helmet 还提供其他安全能力）。',
        '# 政策与要求',
        '为你的项目团队编写一套安全与隐私要求是明智的，明确规定怎样使用这些特性来缓解相关风险。你应当请 Web 安全专家协助编写这些要求，并同时考虑用户需求与福祉，以及政策与法规问题——例如欧盟《通用数据保护条例》（GDPR）这类立法施加的要求。',
        '# 参见',
        'Mozilla 安全团队关于 Referrer-Policy 的指南。'
      ]
    },
    handling: 'zh-translation',
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
      overview: '官方 Assignment 要求阅读并跟着敲代码这篇教程，并特别注意讲四种主要图片格式的那一节——官方 Knowledge Check 的「网页上可用的四种主要图片格式是什么」一题就指向该文的 image formats 小节，答案以该文为准。官方还明确指出了与该文的一处不同意见：这篇文章建议用 CSS 设置图片尺寸，而本课程仍然建议像本课前面讲的那样在所有图片上设置 width 与 height 属性，遇到冲突时以 TOP 课程要求为准。这是一本免费在线教程，与本站无关联；本站未复制或翻译其内容。',
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
      overview: '官方在解释 noopener 时链接了这个 OWASP 社区页面，用来说明不加这个属性可能带来哪一类钓鱼攻击。攻击的大致形式本课中文讲解已概括：新打开的页面通过 window.opener 反向控制原来那个标签页，把它替换成一个仿冒登录页，用户切回去时就被骗了。OWASP 是国际性的开放 Web 安全社区，页面为英文；理解 noopener 防的是哪一种具体风险即可，不必深入攻击实现细节——这样你就知道为什么外链要写 rel="noopener noreferrer"，而不是把它当成可省的样板。',
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
    license: 'OWASP 社区页面，采用 CC BY-SA 3.0；本站提供中文精译（见卡内译文区块），译文采用与原作相同的许可。',
    zhTranslation: {
      kind: 'core',
      attribution: '原文《Reverse Tabnabbing》，来源：OWASP 社区（owasp.org/www-community/attacks/Reverse_Tabnabbing），作者：OWASP 社区贡献者。',
      licenseNote: '原文采用 CC BY-SA 3.0 许可；本译文采用与原作相同的 CC BY-SA 3.0 许可。',
      translatorNote: '本站精译（AI 辅助翻译、按本站纪律人工核对结构与红线），翻译日期 2026-09-18，依据当日抓取的 OWASP/www-community 仓库源文件。',
      modifications: '按核心章节精译：2023 更新、描述、示例、可访问属性、预防各节全部译出；两张示意图以文字说明代替；代码示例转述（保留关键标识符）；References 参考资料列表概括不逐条译出。',
      body: [
        '# 2023 年更新：现代常青浏览器已修复此问题',
        '使用 target="_blank" 的链接在现代浏览器中现在隐含带有 rel="noopener"，因此这个漏洞不再像以前那样普遍和严重。这条隐含规则也是 HTML 标准的一部分。根据 Caniuse.com，常青浏览器大约从 2018 年起支持隐含 rel="noopener"，但市面上仍有一些不支持它的浏览器，所以在决定省略 rel="noopener" 时请考虑你的用户群体。',
        '使用 rel="noreferrer" 会隐含 rel="noopener" 的效果，因此如果你已经选择使用 rel="noreferrer"，就不必再使用 rel="noopener"。',
        '# 描述',
        '反向标签页劫持（Reverse tabnabbing）是一种攻击：从目标页面链接打开的页面能够改写那个页面——例如把它替换成一个钓鱼站点。由于用户原本就在正确的页面上，他们不太容易注意到页面已被换成钓鱼站点，尤其当钓鱼站点与目标站点外观一致时。如果用户在这个新页面里进行身份验证，他们的凭据（或其他敏感数据）就会被发送到钓鱼站点而不是合法站点。',
        '除了目标站点能够改写来源页面之外，当用户处于不安全的网络（例如公共 Wi-Fi 热点）时，任何 http 链接都可能被欺骗用于改写来源页面。即使目标站点本身只能通过 https 访问，攻击依然可行——攻击者只需要欺骗被链接到的那个 http 站点。',
        '这种攻击通常在以下条件下可行：源站点在 HTML 链接里使用 target 指令，指定一个「不替换当前位置」的打开目标（从而让当前窗口/标签页保持可用），并且没有采用下文列出的任何预防措施。通过 window.open JavaScript 函数打开的链接同样可能被攻击。',
        '# 概览',
        '原文用两张示意图对比父子页面之间的链接关系：未使用预防属性时，子页面持有指向父页面的 opener 引用、可以改写父页面（with back link）；使用预防属性后，父子页面之间不再存在这个引用（without back link）。',
        '# 示例',
        '存在漏洞的页面（原文代码转述）：页面里有一个 HTML 链接，href 指向 bad.example.com、target 为 _blank；另有一个按钮的 onclick 调用 window.open 打开 https://bad.example.com——两者都没有任何预防属性。',
        '被链接到的恶意站点（原文代码转述）：内嵌脚本检查 window.opener 是否存在，若存在则把 window.opener.location 设置为 https://phish.example.com。',
        '当用户点击「存在漏洞的目标」链接/按钮时，「恶意站点」会（如预期般）在新标签页打开，但原来那个标签页里的目标站点同时被替换成了钓鱼站点。',
        '# 可访问的属性',
        '在跨源（跨域）访问的情形下，恶意站点只能访问 opener JavaScript 对象引用（它实际上是对一个 window 类实例的引用）的下列属性：',
        '- opener.closed：返回布尔值，指示窗口是否已关闭。',
        '- opener.frames：返回当前窗口中的所有 iframe 元素。',
        '- opener.length：返回当前窗口中 iframe 元素的数量。',
        '- opener.opener：返回创建该窗口的窗口的引用。',
        '- opener.parent：返回当前窗口的父窗口。',
        '- opener.self：返回当前窗口。',
        '- opener.top：返回最顶层的浏览器窗口。',
        '如果两个页面域名相同，恶意站点则可以访问 window JavaScript 对象暴露的全部属性。',
        '# 预防',
        '请先看本页第一个标题「2023 年更新」：所有现代常青浏览器现已自动预防此攻击。其余预防信息见 OWASP HTML5 安全备忘单（HTML5 Security Cheat Sheet）中的 Tabnabbing 条目。',
        '# 参考资料',
        '原文列有十余条参考资料，包括：WHATWG HTML 标准议题（经 a target="_blank" 打开的窗口默认不应持有 opener）、Caniuse 的兼容性数据（target="_blank" 时隐含 rel="noopener"）、Chrome Platform Status 与 Chromium/Mozilla/WebKit 三家的对应特性与缺陷记录、《target="_blank" 漏洞示例》演示文章、rel="noopener" 属性值说明、Cure53 浏览器安全白皮书，以及 reverse tabnabbing 与 blackshield 演示等。链接清单见英文原文。'
      ]
    },
    handling: 'zh-translation',
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
      overview: '官方在讲图片许可与署名时链接了这份帮助文档：一种简单的署名方式是在仓库的 README 文件里写上创作者姓名与联系方式，或者按该页说明进行署名。署名要求的核心本课正文已给出：使用他人图片时要遵守其许可条款，并按要求注明作者与来源；即使图片标注为免费，也可能有署名要求，不确定许可时应当保守处理。本站核验发现该地址已重定向到另一域名 magnific.com 的文档页，内容主题与原先的 freepik 署名说明不完全一致——因此只保留官方原始链接供你自行判断，实际署名格式以你所用图库当时的条款为准。',
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
      overview: '官方 Assignment 两次要求下载这张练习图片：一次是下载我们的练习图片并移进刚创建的 images 目录，另一次是下载这只狗的图库图片——两处为同一地址，本站合并为一条。它是官方指定的练习素材，后续步骤要用它练习 img 元素的 src、alt、width 与 height。官方链接带 force=true 与 w=640 参数，作用是直接触发下载并指定宽度为 640 像素。下载后放进项目自己的 images 目录、用相对路径引用它；使用 Unsplash 等图库的图片时仍需遵守其许可条款，必要时署名。',
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
      overview: '官方 Assignment 视频列表第 1 项，对应本课的链接部分。链接要点本课正文已给出：a 元素配合 href 属性创建链接；链接目标可以是绝对链接或相对链接；target="_blank" 让链接在新标签页打开；正文还讲了 rel 属性的 noopener 与 noreferrer 两个取值及其安全与隐私作用。本站已用 oEmbed 接口核验其真实标题与作者 Kevin Powell；观看需要 YouTube 访问权限。对照本课正文的绝对链接与相对链接区别看，注意他怎么写 href。',
      why: '官方 Assignment 的视频列表第 1 项，对应本课的链接部分。',
      points: [
        '本课正文已给出链接要点：a 元素配合 href 属性创建链接；链接目标可以是绝对链接或相对链接；target="_blank" 让链接在新标签页打开。',
        '正文还讲了 rel 属性的 noopener 与 noreferrer 两个取值及其安全与隐私作用。',
        '需要 YouTube 访问权限。'
      ],
      terms: ['anchor / a element（锚元素）', 'href（超链接引用）', 'target（打开方式）', 'rel（关系属性）'],
      focus: '对照本课正文的绝对链接与相对链接区别看，注意他怎么写 href。',
      takeaway: '能正确写出站内相对链接与站外绝对链接，并按需加上 rel 属性。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频、不声称有中文字幕。',
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
      overview: '官方 Assignment 视频列表第 2 项，对应本课的图片部分。图片要点本课正文已给出：img 元素是自闭合元素，用 src 指定图片位置，用 alt 提供替代文本；官方特别强调应当给所有图片设置 width 与 height 属性——这一点与它推荐的 Interneting is Hard 文章的建议不同，以 TOP 课程要求为准。本站已用 oEmbed 接口核验其真实标题与作者 Kevin Powell；观看需要 YouTube 访问权限。注意 alt 文本怎么写才有意义，以及宽高属性的作用。',
      why: '官方 Assignment 的视频列表第 2 项，对应本课的图片部分。',
      points: [
        '本课正文已给出图片要点：img 元素是自闭合元素，用 src 指定图片位置，用 alt 提供替代文本。',
        '官方特别强调应当给所有图片设置 width 与 height 属性，这一点与它推荐的 Interneting is Hard 文章的建议不同，以 TOP 课程要求为准。',
        '需要 YouTube 访问权限。'
      ],
      terms: ['img element（图片元素）', 'src（来源）', 'alt（替代文本）', 'self-closing tag（自闭合标签）'],
      focus: '注意 alt 文本怎么写才有意义，以及宽高属性的作用。',
      takeaway: '能写出带 src、alt、width、height 的完整图片元素。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频、不声称有中文字幕。',
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
      overview: '官方 Assignment 视频列表第 3 项，讲的是项目文件怎样组织，直接决定相对路径怎么写。做法本课正文已给出：Assignment 要求把下载的练习图片移进项目里刚创建的 images 目录，也就是把素材集中放在专门目录下；文件结构清晰之后相对路径才稳定——从 HTML 文件指向 images 目录下的图片，写法形如 images/文件名。本站已用 oEmbed 接口核验其真实标题与作者 Kevin Powell；观看需要 YouTube 访问权限。',
      why: '官方 Assignment 的视频列表第 3 项，讲的是项目文件怎样组织，直接决定相对路径怎么写。',
      points: [
        '本课正文已给出做法：Assignment 要求把下载的练习图片移进项目里刚创建的 images 目录，也就是把素材集中放在专门目录下。',
        '文件结构清晰之后，相对路径才稳定：从 HTML 文件指向 images 目录下的图片，写法形如 images/文件名。',
        '需要 YouTube 访问权限。'
      ],
      terms: ['file structure（文件结构）', 'directory / folder（目录）', 'relative path（相对路径）'],
      focus: '注意他怎样安排 HTML 文件与图片目录的相对位置。',
      takeaway: '能规划一个清晰的项目目录，并据此写出正确的相对路径。'
    },
    license: '第三方 YouTube 视频，版权归原作者；本站只做链接与原创导读，不搬运视频、不声称有中文字幕。',
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
      overview: '官方 Assignment 说这篇文章涵盖了怎样写好提交信息的所有主要方面；整篇文章都很好、很有信息量，但文章的核心是「优秀提交信息的七条规则」。官方 Knowledge Check 有两题指向它：「写好提交信息与良好提交历史有哪两个好处」指向 intro 小节，「提交信息的主题行应该是多少字符」指向 limit-50 小节。七条规则中的关键几条本课正文已给出：主题行与正文之间空一行、主题行不超过 50 个字符、正文每行不超过 72 个字符、用祈使语气写。这是一篇第三方技术文章，本站未翻译或复制其内容；直接读七条规则那一节，再回头读 intro 回答官方 KC 的第一题。',
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
      overview: '官方在 Assignment 的补充说明里提到这个扩展：用 VS Code 作为文本编辑器（按 Git Basics 那一节的设置你就应该已经配好了）能让你方便地写多行提交信息、方便地看到每行的字符长度，还能用 VS Code 拼写检查扩展确认拼写正确。官方把它作为「能让你确认拼写正确」的工具提出，属于提升效率的可选项，不是必须安装的组件；官方点名的是 streetsidesoftware.code-spell-checker 这一个。安装扩展需要联网并从第三方市场获取代码，安装前可以自己查看扩展的发布者与评价。如果提交信息里常出现英文拼写错误，装它有价值；否则可以先跳过。',
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
