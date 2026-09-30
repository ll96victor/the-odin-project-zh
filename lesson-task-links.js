/* lesson-task-links.js — 课页任务条目 → 外部资料的内联链接映射（纯数据文件，零依赖）。
 *
 * 为什么单独一个文件：任务条目文本在 lessons.js（红线数据文件，不得改动），
 * 外部资料清单在 external-resources.js；「哪条任务对应哪份资料」是第三份信息，
 * 沿用 diagrams.js 的做法单独存放，app.js 只读取并渲染。
 *
 * 映射依据（v4.11.2 C 项，2026-09-18；v4.11.17 复核）：
 *   1. external-resources.js 每条资源的 zone 字段（官方原文中的出现位置）；
 *   2. 官方 curriculum raw Markdown 原文逐条对照——所用课目的原文 sha256 与
 *      sources.json 记录全部一致（官方内容与本站数据同源，映射有事实依据）。
 *   3. zone 的「Assignment 第 N 条」是**官方编号**，与本站中文化重述的条目号
 *      不一定相同（如 text-editors 官方第 1 条同时含安装指南与 VSCode 文档，
 *      本站拆成 A1/A2）。因此所有映射都按条目语义逐条人工核对，不按编号硬套。
 *
 * 结构：links[lessonId].a = Assignment 映射；键为 1-based 条目号
 * （与 lessons.js 的 official.assignment 渲染顺序一致），值为最终 href 数组。
 * v4.11.17 起不再有自查题映射：官方于 2026-09-23 移除课末的自查题节，
 * 本站同步下线（原 31 条映射随之下线，见 MAINTENANCE.md 与 answers/ 实施记录）。
 *
 * href 取值规则：
 *   · 资源有已核验官方中文版（zhUrl）→ 用中文版地址（与本站「中文自足」口径一致）；
 *   · 否则用资源清单里的 originalUrl；
 *   · 少数长页面沿用官方原文的锚点（cbea.ms 的 #intro / #limit-50、
 *     internetingishard 的 #image-formats、SWC 03-create 的 #create-a-text-file），
 *     方便直达对应小节。
 *   · 所有地址都取自本站 external-resources.js（originalUrl / zhUrl），
 *     不出现清单之外的第三方地址（测试按「去锚点后属于本课资源」钉住）。
 *
 * 纪律：宁可少接，不可接错。以下情形一律不接、保持纯文本：
 *   · 本地动作条目（终端命令、GitHub 界面操作、动手练习）——本就无外链；
 *   · zone 为「正文 XX 小节」的资源——属于正文语境，不是任务要求；
 *   · 无法从官方原文确认条目号对应关系的条目。
 *
 * 覆盖率（v4.11.20 第九批复核，Foundations 46 课全开）：Assignment 159 条中 76 条接链
 * （共 117 个链接）；其余为本地动作 / 纯练习 / 正文区资源。
 * 路径课试点批次 3（2026-09-25）：World 2 第 1 章节 3 课 Assignment 5 条全部接链
 * （7 个链接）——浏览 / 阅读型任务（介绍课 2 条、Josh 指南、MDN 教程 + 行星评估）。
 * lists 与 recipes 两课为 0：lists 的两条资源都是正文小节（MDN ul/ol），任务本身是
 * 动手建列表；recipes 是 Project 课，任务全部是本地动手操作。
 * v4.11.17 新开放的第 21–23 课、v4.11.18 新开放的第 24–25 课各条目全部接链
 * （任务本身就是「读某页 / 做某组练习」）。
 * World 3 批次 4 阶段 1（2026-09-26，v4.11.23）：javascript 课程 15 课 Assignment
 * 52 条实体条目中 28 条接链（共 40 个链接）；how-this-course-will-work（官方无
 * Assignment 节）与 organizing-code-with-objects（官方无作业声明）为显式空映射；
 * 其余未接条目为本地动手操作 / 项目设计步骤 / 部署操作。详见文内批次注释。
 * World 3 批次 4 阶段 2（2026-09-27，v4.11.24）：javascript 课程第三、四章 7 课
 * Assignment 29 条实体条目中 20 条接链（共 22 个链接）；未接条目为本地动手操作 /
 * 项目扩展步骤（apis 第 2 条按钮扩展、weather 第 1–4/6–8 条搭建步骤等）。form-
 * validation 练习条目内联的 novalidate 锚点链接按条目接；art-of-node / axios /
 * superagent 按 301 后的现役仓库地址接。详见文内批次注释。
 * World 3 批次 4 阶段 3（2026-09-27，v4.11.25）：javascript 课程第五、六章 14 课
 * Assignment 77 条实体条目中 37 条接链（共 39 个链接）；recursion / linked-lists /
 * knights-travails 三课显式空映射（官方 Assignment 面板内无第三方外链——资料全部
 * 住在正文区，按「zone 正文区资源不接」纪律）；bst 第 7/8 步 Tip 的 mycodeschool
 * 两支视频跨课合并登记在 common-ds 课名下，防悬空断言限本课清单，该两条不接。
 * A 类资源接链一律用 zhUrl（javascript.info 递归 / 维基分治法与数据结构 / MDN
 * throw 与 MAX_SAFE_INTEGER）；qr.ae 短链按规则接 originalUrl（跳转后地址登记在
 * 资源条目 originalUrlEffective）。
 * World 3 批次 4 阶段 4（2026-09-27，v4.11.26）：「Git 进阶」3 课 +「JavaScript
 * 收尾」2 课——World 3 全 41 课就此收组。Assignment 实体中 5 课条接链（共 5 个
 * 链接）：deeper-look 3 条全接（Pro Git 三章一律接官方中文版 zhUrl）、remotes
 * 2 条全接（GitHub 合并冲突文档接重定向后现役中文路径、Think Like a Git 英文站
 * 接 originalUrl）；real-world / battleship / conclusion 三课显式空映射——
 * real-world 的 Assignment 操作目标全部是 TOP curriculum 仓库本体（fork /
 * clone / CONTRIBUTING / issues / PR，按口径不收资源卡）、battleship 全部本地
 * 动手（规则维基与在线版住正文引言节）、conclusion 官方无 Assignment 节。
 * World 4 批次 5 阶段 1（2026-09-27，v4.11.27）：「动画」章节 3 课（该章节
 * 3/3 全开）。Assignment 实体 14 条中 13 条接链（共 14 个链接）：transforms
 * 4 条全接（第 1 条官方含双地址——MDN rotate3d 接 zhUrl 现役地址 + QHMIT 接
 * 官方原地址，迁移事实住资源条目 effective）、transitions 6 条中 5 条接（第 4
 * 条 CSS Triggers 为跨课合并条目、登记在 transforms 首现课名下，按「资源归属
 * 课」纪律不接——bst 的 mycodeschool 先例）、keyframes 4 条全接（含练习目录
 * 条目，css-exercises 子目录按课 21/29 先例收录并接链）。全站映射由 213 条
 * 276 链接增至 226 条 290 链接。
 * 详见文内批次注释。
 * World 4 批次 5 阶段 2（2026-09-27，v4.11.28）：「无障碍」章节 8 课（该章节
 * 8/8 全开）。Assignment 18 条接链（共 22 个链接）：introduction
 * 2 条全接、wcag 2 条全接、semantic-html 4 条全接（第 1 条官方一条含四平台
 * 屏幕阅读器入口四链全接——VoiceOver 与 ChromeVox 接官方中文版 zhUrl）、
 * keyboard-navigation 2 条全接（第 1 条含两支 A11ycasts 视频双链）、
 * meaningful-text 2 条全接、wai-aria 2 条全接（MDN Live Regions 接 zhUrl
 * 现役地址）、accessibility-auditing 4 条全接（Chrome 开发者文档三条接
 * ?hl=zh-cn 官方中文版）；accessible-colors 官方无 Assignment 节——显式
 * 空映射（全站第四门，conclusion 先例）。全站映射由 226 条 290 链接增至
 * 244 条 312 链接。
 * World 4 批次 5 阶段 3（2026-09-27，v4.11.29，World 4 收组）：「响应式设计」
 * 章节 5 课（该章节 5/5 全开、World 4 全 16 课收组）。Assignment 7 条接链
 * （共 9 个链接）：introduction-to-responsive-design 1 条接 Chrome device-mode
 * ?hl=zh-cn 官方中文版、natural-responsiveness 2 条全接（MDN viewport 属性参考
 * 接 zh-CN 现役路径 + percentages 官方自给存档接原地址）、responsive-images
 * 3 条全接 5 链（第 1 条官方一条含 MDN 三属性文档链接、三链全接 zh-CN 现役
 * Reference/Properties 路径——semantic-html 四链先例同型）、media-queries 1 条
 * 接 zh-CN 现役 Guides 路径；homepage 为 Project 课**显式空映射**——Step 2 的
 * pexels（跨课合并归属 landing-page 首现课）与 materialdesignicons（301 后与
 * admin-dashboard 既有 pictogrammers 条目同址、跨课合并）不重复登记不接，
 * devicon 为 reference 素材来源按 landing-page/admin-dashboard 先例不接
 * （接进任务条目会把参考资料抬成任务入口），Step 1 设计稿为 statically 配图
 * 剔除口径、Step 4 为行政表单先例。全站映射由 244 条 312 链接增至
 * 251 条 321 链接。
 * World 5 批次 6 阶段 1（2026-09-27，v4.11.30）：react 课程「引言」+「React 入门」
 * 两章 8 课（World 5 开篇）。Assignment 11 条接链（共 11 个链接）：
 * introduction-to-react 4 条中 3 条接链（第 1 条 react.dev 官网为跨课合并条目
 * 归属 javascript 结语课、按「资源归属课」纪律不接；第 2/3/4 条接 risingstack /
 * freecodecamp / geeksforgeeks 原地址）、setting-up 3 条中 2 条接链（Vite 指南接
 * 官方中文站 cn.vite.dev/guide/ + DebugBear 接原地址；第 3 条本地动手不建条目）、
 * what-is-jsx 2 条全接（zh-hans.react.dev 两页）、passing-data 1 条接
 * （zh-hans passing-props）、rendering-techniques 2 条全接（zh-hans
 * conditional-rendering 与 rendering-lists）、keys-in-react 2 条中 1 条接
 * （第 1 条为 rendering-lists 同页 keys 锚点、跨课合并归属 rendering-techniques
 * 课不接；第 2 条接 Codevolution 视频原地址）。显式空映射 2 门：
 * how-this-course-will-work（官方无 Assignment 节——hasAssignment:false 全站
 * 第五门）与 react-components（全站首个「跨课合并后零条目」课——唯一外链
 * MDN export 归属 javascript es6-modules 课）。全站映射由 251 条 321 链接增至
 * 262 条 332 链接。
 * World 5 批次 6 阶段 2（2026-09-28，v4.11.31）：react 课程「状态与副作用」5 课 +
 * 「类组件」2 课。Assignment 10 条接链（共 16 个链接）：
 * introduction-to-state 3 条中 2 条接（第 1 条双子项接 zh-hans 两页、第 2 条接 GFG
 * 原地址；第 3 条本地动手不建条目）、more-on-state 2 条中 1 条接（第 1 条三子项接
 * zh-hans 三页；第 2 条本地动手）、cv-application 6 条中 1 条接（第 6 步部署接 4 链：
 * Vite 部署文档中文版 + Netlify/Vercel/Cloudflare 三平台导入入口；第 1–5 步本地动手）、
 * how-to-deal-with-side-effects 3 条全接（zh-hans 两页 + dmitripavlutin）、
 * memory-card 6 条中 1 条接（第 3 条数据源接 PokéAPI——同条 Giphy 为跨课合并条目
 * 归属 javascript 异步 API 课，按防悬空纪律宁少接不错接；其余本地动手/部署）、
 * component-lifecycle-methods 2 条全接（wojtekmaj 交互图 + zh-hans Component 参考页）。
 * 显式空映射 1 门：class-based-components（Assignment 三条全部本地动手——给 ClassInput
 * 加删除/计数/编辑功能，finishing-up-with-javascript 先例同型）。
 * 全站映射由 262 条 332 链接增至 272 条 348 链接。
 * 详见文内批次注释。 */
window.ODIN_TASK_LINKS = {
  version: 1,
  links: {
    'how-this-course-will-work': {
      a: {
        1: ['https://www.theodinproject.com/about'], /* zone 第1条；A1「阅读 About 页面」，卡内有本站精译 */
        2: ['https://www.theodinproject.com/faq']    /* zone 第2条；A2「浏览 FAQ」，卡内有本站精译 */
      }
    },
    'introduction-to-web-development': {
      a: {
        1: ['https://dev.to/theodinproject/why-learning-to-code-is-so-damn-hard-11nn'], /* zone 第1条；A1 */
        2: ['https://www.udacity.com/blog/2020/12/front-end-vs-back-end-vs-full-stack-web-developers.html'] /* zone 第2条；A2 */
      }
    },
    'motivation-and-mindset': {
      a: {
        1: ['https://dev.to/theodinproject/becoming-a-top-success-story-mindset-3dp2'], /* zone 第1条；A1 */
        2: ['https://discord.com/channels/505093832157691914/1089990025162260570'] /* zone 第2条（官方写明加入 Discord 之后）；A2 */
      }
    },
    'asking-for-help': {
      a: {
        1: ['https://dontasktoask.com/'], /* zone 第1条；A1 */
        2: ['https://xyproblem.info/'],   /* zone 第2条；A2 */
        3: ['https://www.theodinproject.com/guides/community/how_to_ask'] /* zone 第3条；A3，卡内有本站精译 */
      }
    },
    'join-the-odin-community': {
      a: {
        1: ['https://github.com/join'],  /* zone 第1条；A1「创建 GitHub 账号」（官方给注册入口） */
        2: ['https://discord.gg/fbFCkYabZB'] /* zone 第2条；A2「登录 Discord」邀请链接 */
      }
    },
    'how-does-the-web-work': {
      a: {
        1: ['https://www.youtube.com/watch?v=eHp1l73ztB8'], /* zone 第1条；A1 BBC 短片 */
        2: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work'], /* zone 第2条；A2 MDN 文章（已核验中文版） */
        3: ['https://www.youtube.com/watch?v=7_LPdttKXPc'], /* zone 第3条；A3 五分钟视频 */
        4: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Getting_started/Environment_setup/Browsing_the_web'], /* zone 第4条；A4（中文版） */
        5: ['https://www.youtube.com/watch?v=BrXPcaRlBqo', 'https://www.whatsmybrowser.org/'], /* zone 第5条前半/后半；A5 */
        6: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works', 'https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_domain_name', 'https://www.youtube.com/watch?v=72snZctFFtA'] /* zone 第6条前半/后半/替代视频；A6（前两篇用中文版） */
      }
    },
    installations: {
      a: {
        2: ['https://ubuntu.com/desktop/flavours'], /* zone「正文开头与 Assignment 各出现一次」；官方 Assignment 第1条警告框内，本站 A2 重述该警告 */
        4: ['https://zh.wikipedia.org/zh-cn/Usage_share_of_web_browsers'], /* zone「正文与 Assignment 各出现一次」；官方第2条 usage share，本站 A4（中文版） */
        5: ['https://support.google.com/chrome/answer/157179?hl=zh-CN&co=GENIE.Platform%3DDesktop#zippy=%2Ctab-window-shortcuts'] /* zone「Assignment（Chrome 小节）」官方 tip 框；本站 A5（中文版） */
      }
      /* A1/A3 的四份安装指南与 Chrome 安装分支是 TOP 自有页面，不在资源清单，不接 */
    },
    'text-editors': {
      a: {
        /* 官方第 1 条同时含安装指南（TOP 自有）与 VSCode 文档，本站拆成 A1/A2；
           官方第 2 条是教学视频 = 本站 A3。zone 的编号因此与本站条目号错位，按语义映射。 */
        2: ['https://code.visualstudio.com/docs'], /* A2「查 VSCode 官方文档」 */
        3: ['https://youtu.be/ORrELERGIHs']        /* A3「VSCode Tutorial for Beginners 视频」 */
      }
    },
    'command-line-basics': {
      a: {
        /* 官方第 1 条 = 本站 A3（前面两条警告在本站是 A1/A2），编号错位按语义映射 */
        3: ['https://swcarpentry.github.io/shell-novice/'], /* A3 SWC 课程总入口；四节子链接在下方资源卡（均带本站精译），不在条目里堆五个链接 */
        4: ['https://swcarpentry.github.io/shell-novice/data/shell-lesson-data.zip'] /* zone「Assignment（WSL2 说明中给出下载命令）」；A4 正是该说明 */
      }
    },
    'setting-up-git': {
      a: {
        /* 官方 Configure Git and GitHub 各步与本站 A2–A16 的重述粒度不同，按语义映射 */
        3: ['https://github.com/settings/emails'], /* zone 第1条（创建账号时的隐私设置）；A3「Email Settings 页面勾选两个复选框」 */
        5: ['https://docs.github.com/zh/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication#configuring-two-factor-authentication-using-a-totp-app', 'https://support.google.com/accounts/answer/1066447?hl=zh-CN'], /* zone（账号安全步骤）（2FA 步骤中）；A5 启用 2FA + Google Authenticator（中文版） */
        14: ['http://www.linfo.org/cat.html'], /* zone（配置 SSH 步骤中）；A14「用 cat 读取公钥」 */
        15: ['https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection?platform=linux', 'https://docs.github.com/zh/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints'] /* zone（SSH 配置最后一步）（SSH 测试步骤中）；A15 测试连接 + 指纹比对（中文版） */
      }
    },
    'introduction-to-git': {
      a: {
        1: ['https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%85%B3%E4%BA%8E%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6'], /* zone 第1条；A1 Pro Git 1.1–1.4（已核验中文版） */
        2: ['https://www.youtube.com/watch?v=2ReR1YJrNOM'], /* zone 第2条；A2 What is Git 视频 */
        3: ['https://docs.github.com/zh/get-started/start-your-journey/about-github-and-git'], /* zone 第3条；A3 About GitHub and Git（中文版） */
        5: ['https://github.com/TheOdinProject/curriculum', 'https://github.com/TheOdinProject/curriculum/graphs/contributors'] /* zone 记作第4条前半/后半，官方原文实为第 5 条；A5「看课程仓库与 contributors」。A4 是站内课程跳转，非外部资源，不接 */
      }
    },
    'git-basics': {
      a: {
        1: ['https://github.com/github/renaming'], /* 官方 Assignment「Before you start」列项原文含此链接；本站 A1 重述了该列项（zone 记为正文 Git 术语小节，官方 Assignment 亦出现） */
        17: ['https://docs.github.com/zh/get-started/git-basics/managing-remote-repositories?platform=linux#switching-remote-urls-from-https-to-ssh'] /* zone（git push 步骤的排错说明中）；A17 的 NOTE 正是切换 HTTPS→SSH（中文版） */
      }
    },
    'introduction-to-html-and-css': {
      a: {
        1: ['https://www.youtube.com/watch?v=gT0Lh1eYk78'] /* zone 第1条；A1 */
      }
    },
    'elements-and-tags': {
      a: {
        1: ['https://www.youtube.com/watch?v=X4sClFRMJ00'] /* zone 第1条；A1（本课唯一 Assignment） */
      }
    },
    'html-boilerplate': {
      a: {
        1: ['https://www.youtube.com/watch?v=V8UAEoOvqFg'], /* zone 第1条；A1 跟做视频 */
        2: ['https://validator.w3.org/#validate_by_input']  /* zone 第2条；A2 W3C 校验器 */
      }
    },
    'working-with-text': {
      a: {
        1: ['https://www.youtube.com/watch?v=yqcd-XkxZNM'], /* zone 第1条；A1 */
        2: ['https://www.youtube.com/watch?v=gW6cBZLUk6M'], /* zone 第2条；A2 */
        4: ['https://zh.wikipedia.org/zh-cn/Lorem_ipsum'] /* zone 第3条（练习任务中）：官方第 3 条同时含建页任务与 Lorem 办法，本站拆为 A3/A4，Lorem 链接按语义归 A4（中文版）；A3 纯动手不接 */
      }
    },
    lists: {
      a: {}, /* 两条资源都是正文小节（MDN ul/ol），三条任务全部是动手建列表，无外链可接 */
    },
    'links-and-images': {
      a: {
        1: ['https://www.youtube.com/watch?v=tsEQgGjSmkM', 'https://www.youtube.com/watch?v=0xoztJCHpbQ', 'https://www.youtube.com/watch?v=ta3Oxx7Yqbo'], /* zone（视频列表第 1/2/3 项）；A1「观看三个视频」 */
        2: ['https://internetingishard.netlify.app/html-and-css/links-and-images'], /* zone（并有一题 KC 指向其 #image-formats）；A2「阅读并跟做」 */
        3: ['https://unsplash.com/photos/Mv9hjnEUHR4/download?force=true&w=640'] /* zone「Assignment 两处（下载练习图片/下载这只狗的图库图片）」：官方在正文演练的分步编号列表里给出下载链接，本站 A3 重述了这些动手步骤（含把 dog.jpg 放进 images 目录），按语义归 A3 */
      }
    },
    'commit-messages': {
      a: {
        1: ['https://cbea.ms/git-commit'], /* zone（KC 两题分别指向 #intro 与 #limit-50）；A1 */
        2: ['https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker'] /* zone 补充说明（官方 Tips 小节）；A2「拼写检查扩展」 */
      }
    },
    /* v4.11.17（第 21–23 课，CSS Foundations 起步三课）：按官方 Assignment 的条目结构
     * 逐条语义映射。三课的任务都是「读 + 动手」，除课 23 是操作课以外都直接指向外部页面。 */
    'intro-to-css': {
      a: {
        1: ['https://github.com/TheOdinProject/css-exercises'], /* zone 第1条；A1「读练习仓库 README」 */
        2: ['https://github.com/TheOdinProject/css-exercises/tree/main/foundations/intro-to-css'] /* zone 第2条；A2「进本课练习目录」 */
      }
    },
    'the-cascade': {
      a: {
        1: ['https://2019.wattenberger.com/blog/css-cascade'], /* zone 第1条；A1 交互式层叠讲解 */
        2: ['https://github.com/TheOdinProject/css-exercises/tree/main/foundations/cascade'] /* zone 第2条；A2 本课练习目录 */
      }
    },
    'inspecting-html-and-css': {
      a: {
        /* 官方第 1 条把「官方 Chrome DevTools 文档」作为总入口给出，下面列四节；
           本站按资源清单登记的总入口 + 四节共 5 个地址，一次接全，读者按官方顺序读。 */
        1: ['https://developer.chrome.com/docs/devtools/',
            'https://developer.chrome.com/docs/devtools/overview/',
            'https://developer.chrome.com/docs/devtools/open/',
            'https://developer.chrome.com/docs/devtools/dom/',
            'https://developer.chrome.com/docs/devtools/css']
      }
    },
    recipes: {
      /* v4.11.16（第 20 课 Project: Recipes）：显式空映射，不是遗漏。
       * 本课 8 条任务全部是本地动手操作（建仓 / 建目录 / 写页面 / 提交），按头注释
       * 纪律「本地动作条目不接」；唯一出现在 Assignment 语境里的外部地址 Allrecipes
       * 是「需要灵感时」的可选备选项（requirement=optional），接进任务条目会把可选
       * 资料抬成必做入口，且会触发 taskResourceNote 的 Assignment 模板——该模板
       * 「其中 X 条需要外部文章」的措辞对可选灵感站不准确。资源卡里已有直达入口。
       * v4.11.16 起本课任务条数为 8；v4.11.17 起全部课程都不再有自查题映射。 */
      a: {}
    },
    /* v4.11.18（第 24–25 课，css-foundations 收组）：两课 Assignment 与官方条目一一对应，
     * 全部条目按语义接链。课 24 四条全为「读 / 看」；课 25 前四条同，第 5 条是给 Recipes
     * 页加样式的本地动手任务，但官方在该条里嵌了两个 W3Schools 字体参考链接，按
     * working-with-text 课「Lorem 链接按语义归 A4」的既有先例接进第 5 条。 */
    'the-box-model': {
      a: {
        1: ['https://www.youtube.com/watch?v=rIO5326FgPE'], /* zone 第1条；A1 八分钟盒模型视频 */
        2: ['https://www.youtube.com/watch?v=HdZHcFWcAd8'], /* zone 第2条；A2 box-sizing 视频 */
        3: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/Styling_basics/Box_model'], /* zone 第3条；A3 MDN 盒模型（已核验中文版） */
        4: ['https://css-tricks.com/almanac/properties/m/margin/'] /* zone 第4条；A4 CSS-Tricks margin 页 */
      }
    },
    'block-and-inline': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/CSS_layout/Introduction'], /* zone 第1条；A1 MDN Normal Flow（已核验中文版） */
        2: ['https://www.w3schools.com/html/html_blocks.asp'], /* zone 第2条；A2 块级/行内元素清单 */
        3: ['https://www.digitalocean.com/community/tutorials/css-display-inline-vs-inline-block'], /* zone 第3条；A3 inline vs inline-block 教程 */
        4: ['https://github.com/TheOdinProject/css-exercises/tree/main/foundations/block-and-inline'], /* zone 第4条；A4 本课练习目录 */
        5: ['https://www.w3schools.com/Css/css_font.asp', 'https://www.w3schools.com/cssref/css_websafe_fonts.asp'] /* zone 第5条（加样式任务中的两个字体参考）；A5 的字体清单按语义归本条 */
      }
    },
    /* v4.11.19（第 26–27 课，Flexbox 组起步）：课 26 显式空映射，不是遗漏——
     * 官方 Assignment 仅一句「这一课没有作业」的声明（本站忠实翻译为一条说明
     * 条目），无任何可接的外部地址；官方正文外链全为课程配图，也无可接条目。
     * 课 27 两条 Assignment 全部是「读」类任务，逐条语义接链。 */
    'introduction-to-flexbox': {
      /* 官方 Assignment 只有一句无作业声明；正文外链全为 statically CDN 配图
       * 与 CodePen 课内演示（TOP 自有素材，按盘点范围不登记为外部资料）。
       * 读者动手内容在本页中文讲解与官方 CodePen 入口（页顶官方按钮）里。 */
      a: {}
    },
    'growing-and-shrinking': {
      a: {
        1: ['https://www.w3.org/TR/css-flexbox-1/#flex-common'], /* zone 第1条；A1 W3C 规范 7.1.1 基本取值 */
        2: ['https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex'] /* zone 第2条；A2 MDN flex 参考（已核验中文版） */
      }
    },
    /* v4.11.19 第二批（第 28–29 课）：课 28 单条 Assignment 直接接 MDN flex-direction
     * 中文版；课 29 四条全部是「读 / 玩 / 做」类任务，逐条语义接链。 */
    axes: {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/flex-direction'] /* zone 第1条；A1 MDN flex-direction（已核验中文版新路径） */
      }
    },
    alignment: {
      a: {
        1: ['https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/'], /* zone 第1条；A1 交互式指南 */
        2: ['https://css-tricks.com/snippets/css/a-guide-to-flexbox/'], /* zone 第2条；A2 CSS-Tricks 完全指南 */
        3: ['https://flexboxfroggy.com/'], /* zone 第3条；A3 Froggy 游戏 */
        4: ['https://github.com/TheOdinProject/css-exercises/tree/main/foundations/flex'] /* zone 第4条；A4 本组练习目录 */
      }
    },
    /* v4.11.19 第三批（第 30 课 Project: Landing Page）：显式空映射，不是遗漏。
     * 全部 Assignment 条目是本地动手操作（下载设计图 / 建仓库 / 写页面 / 提交 / 部署），
     * 按头注释纪律「本地动作条目不接」；正文推荐的 3 个图片素材站是 reference 类
     * 资料（requirement=reference），接进任务条目会把参考资料抬成任务入口。
     * 资源卡里已有直达入口。 */
    'landing-page': {
      a: {}
    },
    /* v4.11.20 第一批（第 31–33 课，JavaScript Basics 起步）：
     * 课 31：A1 六组算术与变量练习是本地动作（不接）；A2 是四篇官方指定阅读
     *   （zone「Assignment 阅读第 1–4 条」，官方原文就在 Assignment 面板里），
     *   四个链接全接在 A2 上，中文版地址优先（MDN 两篇 / JavaScript.info 两篇）。
     * 课 32：显式空映射，不是遗漏——四条 Assignment 全是本地动手操作（装 nvm、
     *   装 Node、配 npm 设置、进 REPL），按纪律不接；官方安装指南是 TOP
     *   curriculum 仓库自有页，未收入资源清单。
     * 课 33：显式空映射，不是遗漏——A2 的 javascript-exercises 是练习操作目标
     *   （按 odin-recipes 先例不收资源卡）；九篇阅读的 zone 均为官方正文区
     *   （Introduction / Strings / Conditionals 各小节），按纪律「正文区资源不接」，
     *   资源卡里已有直达入口。 */
    'variables-and-operators': {
      a: {
        2: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/Scripting/What_is_JavaScript',
            'https://zh.javascript.info/variables',
            'https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/Scripting/Math',
            'https://zh.javascript.info/operators'] /* zone 阅读第 1–4 条；A2 四篇官方指定阅读 */
      }
    },
    'installing-node-js': {
      a: {}
    },
    'data-types-and-conditionals': {
      a: {}
    },
    /* v4.11.20 第二批（第 34–37 课，JavaScript Basics 4/15–7/15）：
     * 课 34：A1 合并了官方三大项（调试教程 + DevTools 文档导览 + console 概览），
     *   七条链接全接 A1（含 6 条 developer.chrome.com 文档与 1 条 JavaScript.info
     *   中文版教程）。
     * 课 35：A1 为官方五篇阅读（zone「Assignment 第 1–5 条」，官方原文在 Assignment
     *   面板），五个链接全接 A1（JavaScript.info×3 中文版 + MDN×2 中文版）；A2 四道
     *   函数练习是本地动手操作，不接。
     * 课 36：A1 为三篇阅读（官方 Assignment 第 1–3 条），三条链接全接 A1；A2 是正文
     *   资源指引说明（wikipedia Fizz Buzz 与 MDN for 的 zone 均为正文区），按纪律
     *   「正文区资源不接」，资源卡里已有直达入口。
     * 课 37：A1 为 MDN 三篇错误对象文档（官方 Assignment 第 1 条的三个小项）接 3 链，
     *   A2 为排错实操教程（官方第 2 条）接 1 链，全部 MDN 中文版地址。 */
    'javascript-developer-tools': {
      a: {
        1: ['https://zh.javascript.info/debugging-chrome',
            'https://developer.chrome.com/docs/devtools/',
            'https://developer.chrome.com/docs/devtools/css/',
            'https://developer.chrome.com/docs/devtools/css/reference/',
            'https://developer.chrome.com/docs/devtools/dom/',
            'https://developer.chrome.com/docs/devtools/javascript/breakpoints/',
            'https://developer.chrome.com/docs/devtools/console/'] /* zone 第 1–3 条；A1 官方三大项 */
      }
    },
    'function-basics': {
      a: {
        1: ['https://zh.javascript.info/function-basics',
            'https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Building_blocks/Functions',
            'https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Building_blocks/Return_values',
            'https://zh.javascript.info/function-expressions',
            'https://zh.javascript.info/arrow-functions-basics'] /* zone 第 1–5 条；A1 五篇阅读 */
      }
    },
    'problem-solving': {
      a: {
        1: ['https://www.freecodecamp.org/news/how-to-think-like-a-programmer-lessons-in-problem-solving-d1d8bf1de7d2/',
            'https://www.youtube.com/watch?v=azcrPFhaY9k',
            'https://www.builtin.com/data-science/pseudocode'] /* zone 第 1–3 条；A1 三篇阅读 */
      }
    },
    'understanding-errors': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError',
            'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError',
            'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError',
            'https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/Scripting/What_went_wrong'] /* zone 第 1–2 条；A1 官方两项（三篇文档 + 排错教程）合并为一条 */
      }
    },
    /* v4.11.20 第三批（第 38 课 Project: Rock Paper Scissors）：显式空映射，不是遗漏。
     * 三条 Assignment 全是项目六步的本地动手操作（建仓库 / 写函数 / 测试 / commit），
     * 按头注释纪律「本地动作条目不接」；Step 2 / 3 的两条 MDN Hint（Math.random /
     * prompt）是正文提示语境的查询型资料（requirement 分属 required / reference），
     * 资源卡里已有直达入口。 */
    'rock-paper-scissors': {
      a: {}
    },
    /* v4.11.20 第四批（第 39 课 整洁代码）：A1 是纯阅读条目（官方两条 Assignment
     * 合并重述为一条：一篇原则清单 + codinghorror 两篇注释文章），全部为 required
     * 阅读资源，按 zone 对应接链；reddit 缩进玩笑帖是正文语境的 reference 资料，
     * 资源卡里已有入口，不接。onextrapixel 命令行两次无响应（受限如实登记），
     * 地址本身取自官方原文，照接。 */
    'clean-code': {
      a: {
        1: ['https://onextrapixel.com/10-principles-for-keeping-your-programming-code-clean/',
            'https://blog.codinghorror.com/code-tells-you-how-comments-tell-you-why/',
            'https://blog.codinghorror.com/coding-without-comments/'] /* zone 第 1–2 条；A1 官方两条阅读任务合并为一条 */
      }
    },
    /* v4.11.20 第四批（第 40 课 循环与数组）：显式空映射，不是遗漏。
     * Assignment 唯一一条是「到 array-methods 页尾练习区做指定七题 + 到
     * javascript-exercises 仓库做六题」的动手练习——javascript-exercises 是操作
     * 目标（按课 20 先例不收资料卡、不接链），array-methods#tasks 与正文资源同页
     * 合并（资源卡里已有直达入口）；正文阅读材料（MDN 循环教程 / JavaScript.info
     * 三篇 / YouTube 视频 / MDN Array）zone 均为「正文 XX 小节」，按头注释纪律
     * 「正文区资源不接」。 */
    'loops-and-arrays': {
      a: {}
    },
    /* v4.11.20 第五批（第 41 课 操作 DOM 与处理事件）：A1（JavaScript Tutorial 六篇
     * 事件阅读，官方明说建意识不求深解）接 6 链；A2（dev.to 回调文章）接 1 链；
     * A3（MDN DOM scripting 两节练习，官方两个锚点同页合并为一条资源）接 1 链
     * （zhUrl 中文版）。正文区 6 条资料（MDN 展开语法 / HTML 属性 / 事件介绍、
     * js.info defer、XSS 视频、W3Schools 事件参考）zone 均为「正文 XX 小节」，
     * 按头注释纪律「正文区资源不接」，资源卡里已有直达入口。 */
    'dom-manipulation-and-events': {
      a: {
        1: ['https://www.javascripttutorial.net/javascript-dom/javascript-events/',
            'https://www.javascripttutorial.net/javascript-dom/javascript-mouse-events/',
            'https://www.javascripttutorial.net/javascript-dom/javascript-keyboard-events/',
            'https://www.javascripttutorial.net/javascript-dom/javascript-event-delegation/',
            'https://www.javascripttutorial.net/javascript-dom/javascript-dispatchevent/',
            'https://www.javascripttutorial.net/javascript-dom/javascript-custom-events/',
            'https://dev.to/i3uckwheat/understanding-callbacks-2o9e',
            'https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/Scripting/DOM_scripting'] /* zone 第 1–3 条；A1 官方三条任务（六篇阅读 + 回调文章 + 两节练习）合并为一条 */
      }
    },
    /* v4.11.20 第五批（第 42 课 重做石头剪刀布）：A1 为 Warm up 的 learngitbranching
     * 前 3 关——独立站点的官方指定练习（该站自带中文界面，接 zhUrl 中文版入口）；
     * A2 起的六条全是本地 git / GitHub 操作（建分支 / 推分支 / 改代码 / 合并 / 删分支 /
     * 发布 Pages），按头注释纪律「本地动作条目不接」。 */
    'revisiting-rock-paper-scissors': {
      a: {
        1: ['https://learngitbranching.js.org/?locale=zh_CN'] /* zone Warm up 第 1 条；A1 热身练习（中文界面入口） */
      }
    },
    /* v4.11.20 第六批（第 43 课 Project: Etch-A-Sketch）：显式空映射，不是遗漏。
     * Assignment 五条全是本地动手操作（建仓 / JS 造格 / 悬停监听 / 重设按钮 / 推送），
     * 按头注释纪律「本地动作条目不接」；Extra credit 的 MDN opacity 是 optional 的
     * Hint 语境资料，资源卡里已有直达入口。 */
    'etch-a-sketch': {
      a: {}
    },
    /* v4.11.20 第七批（第 44 课 对象基础）：A1 是课 40 数组方法页的补做题（与课 40
     * 同页合并、资源在课 40，不属本课资源清单，不接）；A2 为 JavaScript30 跟练——
     * Fork/clone 是本地动作不接，两个 Array Cardio 视频是观看型必做资料接 2 链；
     * A3 javascript-exercises 为操作目标不接。 */
    'object-basics': {
      a: {
        1: ['https://www.youtube.com/watch?v=HB1ZC7czKRs',
            'https://www.youtube.com/watch?v=QNmRfyNg1lw'] /* zone 第 2 条；A1 官方三条任务合并为一条，接两个跟练视频 */
      }
    },
    /* v4.11.20 第八批（第 45 课 Project: Calculator）：显式空映射，不是遗漏。
     * Assignment 的 use cases 全是本地动手操作（运算函数 / operate / HTML 骨架 /
     * 按钮更新显示屏 / Gotchas 修 bug），按头注释纪律「本地动作条目不接」；
     * CalculatorSoup 在线计算器是 Gotcha 的参考演示（官方「feel free」），资源卡里
     * 已有直达入口；MDN eval 与 StackOverflow 讨论属正文开工警告语境，同样不接。 */
    'calculator': {
      a: {}
    },
    /* v4.11.20 第九批（第 46 课 Choose Your Path Forward）：显式空映射——该课官方无
     * Assignment（官方文件顶部声明结构豁免），本站 tasks 为回顾与选路径的自拟清单，
     * 全是本地思考动作；Medium 文章是正文结论语境的推荐阅读，资源卡里有直达入口。 */
    'choose-your-path-forward': {
      a: {}
    },
    /* 路径课试点批次 3（World 2 · 中级 HTML 概念 3 课）：三课 Assignment 全部是
     * 「读某页」型任务，逐条接链；正文区资源（Material / Feather 图标库、MDN use、
     * SVG 元素列表、css-tricks）zone 均为「正文 Anatomy of an SVG」，按头注释纪律
     * 「正文区资源不接」，资源卡里已有直达入口。 */
    'node-path-intermediate-html-and-css-introduction': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements'], /* zone Assignment 第 1 条；A1 通读元素参考（浏览型，接中文版） */
        2: ['https://htmlcheatsheet.com/css/'] /* zone Assignment 第 2 条；A2 瞄一眼 CSS 速查表（浏览型） */
      }
    },
    'node-path-intermediate-html-and-css-svg': {
      a: {
        1: ['https://www.joshwcomeau.com/svg/friendly-introduction-to-svg/'] /* zone Assignment 第 1 条；A1 Josh Comeau SVG 指南（读到动画一节停） */
      }
    },
    'node-path-intermediate-html-and-css-tables': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/Structuring_content/HTML_table_basics',
            'https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/Structuring_content/Table_accessibility'], /* zone Assignment 第 1 条；A1 官方一条含两篇教程，各接中文版 */
        2: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/Structuring_content/Planet_data_table'] /* zone Assignment 第 2 条；A2 行星数据评估 */
      }
    },
    /* World 2 第二批（中级 CSS 概念前 5 课，v4.11.21，2026-09-25）：五课 Assignment 全是
     * 「读某页 / 通关 / 做评估」型任务，逐条接链（MDN 一律接已核验的官方中文版；
     * web.dev 无中文版（zh 路径 404 实测）接英文原文；codyloyd 一文接官方给出的
     * web.archive.org 存档地址——官方原文即此地址，本站未做替换）。正文区资源
     * （almanac 16 条、MDN 参考页、字体库、StackOverflow 讨论等）按头注释纪律
     * 「正文区资源不接」，资源卡里已有直达入口。 */
    'node-path-intermediate-html-and-css-default-styles': {
      a: {
        1: ['https://css-tricks.com/reboot-resets-reasoning/'], /* zone Assignment 第 1 条；A1 reset 历史与「有观点」 */
        2: ['https://mattbrictson.com/blog/css-normalize-and-reset'], /* zone Assignment 第 2 条；A2 2023 normalize/reset 对比 */
        3: ['https://www.joshwcomeau.com/css/custom-css-reset/'] /* zone Assignment 第 3 条；A3 Josh Comeau 定制 reset 逐条解释 */
      }
    },
    'node-path-intermediate-html-and-css-css-units': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/Styling_basics/Values_and_units'], /* zone Assignment 第 1 条；A1 单位总览（中文版） */
        2: ['https://web.archive.org/web/20251130034321/https://codyloyd.com/2021/css-units/'], /* zone Assignment 第 2 条；A2 em/rem/px 深入（官方给的存档地址） */
        3: ['https://css-tricks.com/fun-viewport-units/'] /* zone Assignment 第 3 条；A3 视口单位玩法 */
      }
    },
    'node-path-intermediate-html-and-css-more-text-styles': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/Text_styling/Web_fonts'], /* zone Assignment 第 1 条；A1 Web 字体（中文版，含练习） */
        2: ['https://web.dev/articles/font-best-practices'], /* zone Assignment 第 2 条；A2 字体性能最佳实践（无中文版） */
        3: ['https://web.dev/learn/design/typography'] /* zone Assignment 第 3 条；A3 排版考量（无中文版） */
      }
    },
    'node-path-intermediate-html-and-css-more-css-properties': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/background',
            'https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/border',
            'https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/border-radius',
            'https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/box-shadow',
            'https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/overflow',
            'https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/opacity'] /* zone Assignment 第 1 条；A1 官方一条含 6 个属性文档，逐个接中文版 */
      }
    },
    'node-path-intermediate-html-and-css-advanced-selectors': {
      a: {
        1: ['https://flukeout.github.io/'], /* zone Assignment 第 1 条；A1 CSS Diner 通关 */
        2: ['https://learn.shayhowe.com/advanced-html-css/complex-selectors/'], /* zone Assignment 第 2 条；A2 复杂选择器详解 */
        3: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/Styling_basics/Test_your_skills/Selectors'] /* zone Assignment 第 3 条；A3 选择器评估（中文版） */
      }
    },
    /* World 2 第三批（2026-09-26）：「中级 CSS 概念」章节后 5 课接链（+14 条 +14 链接）。
     * MDN 一律接 zh-CN 现役生效地址（与 external-resources.js 的 zhUrl 同源）；其余接清单 originalUrl。
     * custom-properties 的 a.4「打开本页检查器看 Odin 怎么用自定义属性」是对官方页面本身的操作、
     * 无第三方地址，按既有稀疏键先例（installations / setting-up-git 等 8 课）不建条目。 */
    'node-path-intermediate-html-and-css-positioning': {
      a: {
        1: ['https://www.youtube.com/watch?v=jx5jmI0UlXU'], /* zone Assignment 第 1 条；A1 定位九分钟视频（oEmbed 核验） */
        2: ['https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/position'], /* zone Assignment 第 2 条；A2 position 参考（中文版） */
        3: ['https://css-tricks.com/absolute-relative-fixed-positioining-how-do-they-differ/'], /* zone Assignment 第 3 条；A3 三种定位对比（官方给的地址即含 positioining 拼写） */
        4: ['https://www.kevinpowell.co/article/positition-fixed-vs-sticky/'] /* zone Assignment 第 4 条；A4 fixed vs sticky（官方给的地址即含 positition 拼写） */
      }
    },
    'node-path-intermediate-html-and-css-css-functions': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Values/Functions'], /* zone Assignment 第 1 条；A1 CSS 值函数完整清单（中文版） */
        2: ['https://web.dev/min-max-clamp/'] /* zone Assignment 第 2 条；A2 min/max/clamp 实战（站内重组 301 到 /articles/） */
      }
    },
    'node-path-intermediate-html-and-css-custom-properties': {
      a: {
        1: ['https://www.youtube.com/watch?v=PHO6TBq_auI'], /* zone Assignment 第 1 条；A1 自定义属性入门视频（oEmbed 核验） */
        2: ['https://developer.mozilla.org/zh-CN/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties'], /* zone Assignment 第 2 条；A2 使用自定义属性（中文版，官方指定从「继承」一节读起） */
        3: ['https://www.youtube.com/watch?v=_2LwjfYc1x8'] /* zone Assignment 第 3 条；A3 Kevin Powell 巧妙用法视频（oEmbed 核验） */
      }
    },
    'node-path-intermediate-html-and-css-browser-compatibility': {
      a: {
        1: ['https://caniuse.com/'], /* zone Assignment 第 1 条；A1 Can I Use 支持表 */
        2: ['https://adactio.com/journal/17428'] /* zone Assignment 第 2 条；A2 iOS 上的浏览器一文 */
      }
    },
    'node-path-intermediate-html-and-css-frameworks-and-preprocessors': {
      a: {
        1: ['https://medium.com/html-all-the-things/what-is-a-css-framework-f758ef0b1a11'], /* zone Assignment 第 1 条；A1 CSS 框架简介（403 受限、真实浏览器核验可达） */
        2: ['https://www.lambdatest.com/blog/css-preprocessors-sass-vs-less-vs-stylus-with-examples/'], /* zone Assignment 第 2 条；A2 三预处理器对比（跨域重定向到 testmuai.com，同主题） */
        3: ['https://adamsilver.io/blog/the-disadvantages-of-css-preprocessors/'] /* zone Assignment 第 3 条；A3 预处理器的缺点 */
      }
    },
    /* World 2 第四批（表单 3 课）：form-basics 四条 Assignment 全接（MDN 表单学习区同一页的
     * 三个小节按官方分项分别接链，中文地址优先——中文版标题锚点是中文，英文锚点在中文版页面上
     * 不存在，实测后改用中文锚点）；form-validation 三条全接（MDN 中文版优先，SitePoint 与
     * threadreaderapp 无中文版，后者两条通路都连不通、按官方原地址照接并在资源卡如实标注受限）；
     * sign-up-form 显式空映射——全部 Assignment 是本地动手操作（建仓 / 建文件 / 下载设计图 /
     * 找素材 / 写页面），按头注释纪律「本地动作条目不接」，且两条素材是 reference 类资料
     * （接进任务条目会把参考资料抬成任务入口），资源卡里已有直达入口（与第 30 课 Landing Page 同一处置）。 */
    'node-path-intermediate-html-and-css-form-basics': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Extensions/Forms#入门指南'], /* zone Assignment 第 1 条；A1 MDN 表单入门教程组（中文版锚点实测存在） */
        2: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Extensions/Forms#不同的表单控件'], /* zone Assignment 第 2 条；A2 同页「不同的表单控件」小节 */
        3: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Extensions/Forms#表单样式指南'], /* zone Assignment 第 3 条；A3 同页「表单样式指南」小节（官方注明其中两篇可跳过） */
        4: ['https://internetingishard.netlify.app/html-and-css/forms/index.html'] /* zone Assignment 第 4 条；A4 HTML & CSS Is Hard 表单教程 */
      }
    },
    'node-path-intermediate-html-and-css-form-validation': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Extensions/Forms/Form_validation'], /* zone Assignment 第 1 条；A1 MDN 客户端表单校验（官方注明 JS 那一节可跳过） */
        2: ['https://www.sitepoint.com/html-forms-constraint-validation-complete-guide/'], /* zone Assignment 第 2 条；A2 SitePoint 完全指南（官方注明两节可跳过） */
        3: ['https://threadreaderapp.com/thread/1400388896136040454.html'] /* zone Assignment 第 3 条；A3 校验 UX 该做与不该做（自动核验与真实浏览器均连不通，受限如实登记） */
      }
    },
    'node-path-intermediate-html-and-css-sign-up-form': {
      a: {}
    },
    /* World 2 第五批（2026-09-26，v4.11.22，「Grid 布局」章节 6 课，+8 条 +8 链接）：
     * introduction-to-grid **显式空映射**——官方 Assignment 是「Surprise! No assignment!」
     * 无作业声明（本站第三个零外部资料课），无资源可接（与课 26 introduction-to-flexbox
     * 同一处置）。
     * creating-a-grid 三条全接：CSS-Tricks Grid 指南（官方给的旧地址 css-grid-layout-guide/，
     * 已 301 更名到 complete-guide-css-grid-layout/，按清单 originalUrl 原样接）、Wes Bos
     * 短视频（含官方给的 ab_channel 参数，与清单 originalUrl 逐字一致）、Chrome DevTools
     * Grid 检查文档。
     * positioning-grid-elements 前两条接（MDN 基于线的定位——zhUrl 优先接中文版现役路径；
     * Grid Garden 1–17 关）；第 3 条 css-exercises 仓库练习是操作目标、不在资源清单，
     * 按稀疏键先例不建条目。
     * advanced-grid-properties **显式空映射**——三条 Assignment 的资源归属都不在本课：
     * 第 1 条 CSS-Tricks 指南的三个小节与 creating-a-grid 首现条目同页（跨课合并），
     * 第 2 条 Grid Garden 18–28 关与 positioning-grid-elements 首现条目同址（跨课合并），
     * 第 3 条 css-exercises 仓库练习是操作目标；按「映射地址必须属于本课资源清单」的
     * 测试纪律与「资源归属课」先例（javascript.info 箭头函数并入课 35 后，课 41 不另建
     * 映射），本课不建条目——资源卡在两门首现课页可达，官方任务文字里也写明了范围。
     * using-flexbox-and-grid 三条全接（CSS-Tricks 取代论一文 / Kevin Powell 视频 /
     * Tuts+ 对比长文）。
     * admin-dashboard **显式空映射**——六步全部是本地动手操作（建仓 / 建文件 / 下载设计图 /
     * 摆布局 / 嵌套细化 / 收集素材），唯一可接的 Material Design Icons 是 reference 类
     * 素材（接进任务条目会把参考资料抬成任务入口，与 sign-up-form 的 Norse 字体、
     * Unsplash 背景图同一处置）；设计图（statically CDN）与课程反馈表（Google 表单）
     * 均不在资源清单。 */
    'node-path-intermediate-html-and-css-introduction-to-grid': {
      a: {}
    },
    'node-path-intermediate-html-and-css-creating-a-grid': {
      a: {
        1: ['https://css-tricks.com/css-grid-layout-guide/'], /* zone Assignment 第 1 条；A1 Grid 完全指南（Introduction 与 Key Terms 两节） */
        2: ['https://www.youtube.com/watch?v=8_153Zz4YI8&ab_channel=WesBos'], /* zone Assignment 第 2 条；A2 隐式 vs 显式轨道短视频（oEmbed 核验） */
        3: ['https://developer.chrome.com/docs/devtools/css/grid/'] /* zone Assignment 第 3 条；A3 Chrome DevTools 检查 Grid 文档 */
      }
    },
    'node-path-intermediate-html-and-css-positioning-grid-elements': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Web/CSS/Guides/Grid_layout/Line-based_placement'], /* zone Assignment 第 1 条；A1 MDN 基于线的定位（中文版现役路径） */
        2: ['https://cssgridgarden.com/'] /* zone Assignment 第 2 条；A2 Grid Garden 第 1–17 关 */
      }
    },
    'node-path-intermediate-html-and-css-advanced-grid-properties': {
      a: {}
    },
    'node-path-intermediate-html-and-css-using-flexbox-and-grid': {
      a: {
        1: ['https://css-tricks.com/css-grid-replace-flexbox/'], /* zone Assignment 第 1 条；A1 Grid 取代 Flexbox 吗 */
        2: ['https://www.youtube.com/watch?v=3elGSZSWTbM'], /* zone Assignment 第 2 条；A2 Kevin Powell 真实用例视频（oEmbed 核验） */
        3: ['https://webdesign.tutsplus.com/flexbox-vs-css-grid-which-should-you-use--cms-30184a'] /* zone Assignment 第 3 条；A3 何时用哪个（Tuts+） */
      }
    },
    'node-path-intermediate-html-and-css-admin-dashboard': {
      a: {}
    },
    /* World 3 批次 4 阶段 1（2026-09-26，v4.11.23，javascript 课程「引言」+「组织
     * JavaScript 代码」15 课，28 条任务接链 / 40 个链接）：
     * how-this-course-will-work **显式空映射**——本课 official.assignment 为空数组
     * （官方无 Assignment 节，dev.to 记忆文章属正文区资源，按头注释纪律正文区资源不接）。
     * organizing-code-with-objects **显式空映射**——官方 Assignment 明文「No assignment
     * for this particular lesson!」无作业声明，且为本站第四个零外部资料课（与
     * introduction-to-grid 同一处置）。
     * object-constructors 三条全接（DigitalOcean 复习 / JavaScript.info 原型继承精读——
     * zhUrl 优先接官方中文版 / JavaScript Tutorial this 专文）。
     * library 第 4、5 条接（第 4 条含 dialog 与 preventDefault 两个官方文档，均接中文版；
     * 第 5 条 data attributes 接中文版现役路径）；其余条目为本地动手操作，不接。
     * factory-functions 三条全接（Wes Bos Scope / Closures / MDN 闭包指南中文版）。
     * tic-tac-toe 仅第 2 条子弹块接（ayweb「从内而外盖房子」——官方原文「If you're
     * having trouble... is a great article」点名的思维模型文章；reference 类接链有既有
     * 先例：fonts.google / Ubuntu flavours 等 4 条）；其余五条为本地动手操作。
     * classes 第 1、2 条接 JavaScript.info 官方中文版；第 3 条含 MDN Classes 主文档 +
     * 官方点名的 extends / static / Private elements 三个特性页（均接中文版，private 按
     * 重定向后的现役路径）；第 4 条为本地重构操作（Revisiting RPS 是 TOP 自有课页，
     * 不在资源清单），不接。
     * es6-modules 第 1 条接 export + import 两个 MDN 中文文档（import 条目含 webpack 课
     * 副作用导入锚点的跨课合并，映射按资源归属课登记在本课）。
     * npm 第 1 条含三个子弹块（npm 官方文档两篇 + dev.to devDependencies 文），第 2 条接
     * Modern JavaScript Explained For Dinosaurs；正文区的 npmjs.com 包页（验证受限）不接。
     * webpack 两条全接（concepts / Asset Management）。
     * restaurant-page 仅第 7 条接（Beary's Breakfast Bar 存档——官方点名「look at ...
     * for visual inspiration」）；其余七条为本地操作与部署步骤。
     * revisiting-webpack 第 1 条接 Production 指南。
     * json 三条全接（MDN JSON 教程中文版 / W3Schools parse+stringify 两页 / JSON
     * formatter 工具——官方原文「This JSON formatter website lets you paste...」点名）。
     * oop-principles 三条全接（第 1 条含 Medium 单责文——验证受限但官方点名，按清单
     * originalUrl 原样接 + WDS SOLID 播放列表；第 2 条耦合文存档地址；第 3 条 mpj
     * 组合优于继承视频）。
     * todo-list 第 6 条接三个灵感应用（Todoist 按 href 规则接官方中文站直连地址、
     * Things、any.do）；第 7 条接 date-fns 仓库；第 8 条接 Web Storage API 中文版 +
     * 小贴士③的 MDN JSON 参考页中文版；第 1–5 条为本地设计操作，不接。 */
    'node-path-javascript-how-this-course-will-work': {
      a: {}
    },
    'node-path-javascript-organizing-code-with-objects': {
      a: {}
    },
    'node-path-javascript-object-constructors': {
      a: {
        1: ['https://www.digitalocean.com/community/tutorials/understanding-prototypes-and-inheritance-in-javascript'], /* zone Assignment 第 1.1 条；A1 DigitalOcean 原型与继承复习 */
        2: ['https://zh.javascript.info/prototype-inheritance'], /* zone Assignment 第 1.2 条；A2 JavaScript.info 原型继承（官方中文版） */
        3: ['https://www.javascripttutorial.net/javascript-this/'] /* zone Assignment 第 2 条；A3 this 关键字专文 */
      }
    },
    'node-path-javascript-library': {
      a: {
        4: ['https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/dialog', 'https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault'], /* zone Assignment 第 4 条；A4 dialog 文档（中文版现役路径）+ preventDefault（中文版） */
        5: ['https://developer.mozilla.org/zh-CN/docs/Web/HTML/How_to/Use_data_attributes'] /* zone Assignment 第 5 条；A5 data attributes（中文版现役路径） */
      }
    },
    'node-path-javascript-factory-functions-and-the-module-pattern': {
      a: {
        1: ['https://wesbos.com/javascript/03-the-tricky-bits/scope'], /* zone Assignment 第 1 条；A1 Wes Bos Scope */
        2: ['https://wesbos.com/javascript/03-the-tricky-bits/closures'], /* zone Assignment 第 2 条；A2 Wes Bos Closures */
        3: ['https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Closures'] /* zone Assignment 第 3 条；A3 MDN 闭包指南（中文版） */
      }
    },
    'node-path-javascript-tic-tac-toe': {
      a: {
        2: ['https://www.ayweb.dev/blog/building-a-house-from-the-inside-out'] /* zone Assignment 第 2 条子弹块；A2「从内而外盖房子」思维模型文章 */
      }
    },
    'node-path-javascript-classes': {
      a: {
        1: ['https://zh.javascript.info/property-accessors'], /* zone Assignment 第 1 条；A1 getter/setter（官方中文版） */
        2: ['https://zh.javascript.info/class'], /* zone Assignment 第 2 条；A2 Class 基本语法（官方中文版） */
        3: ['https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes', 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/extends', 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/static', 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/Private_elements'] /* zone Assignment 第 3 条；A3 MDN Classes 主文档 + 官方点名的 extends / static / 私有元素三特性页（均中文版；private 按重定向后现役路径） */
      }
    },
    'javascript-es6-modules': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export', 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import'] /* zone Assignment 第 1.1/1.2 条；A1 export + import（均中文版） */
      }
    },
    'node-path-javascript-npm': {
      a: {
        1: ['https://docs.npmjs.com/downloading-and-installing-packages-locally', 'https://docs.npmjs.com/creating-a-package-json-file', 'https://dev.to/mshertzberg/demystifying-devdependencies-and-dependencies-5ege'], /* zone Assignment 第 1.1/1.2/1.3 条；A1 三个子弹块：本地安装 / package.json / devDependencies 分界 */
        2: ['https://peterxjang.com/blog/modern-javascript-explained-for-dinosaurs.html'] /* zone Assignment 第 2 条；A2 给恐龙看的现代 JS 工具链 */
      }
    },
    'javascript-webpack': {
      a: {
        1: ['https://webpack.js.org/concepts/'], /* zone Assignment 第 1 条；A1 webpack 核心概念 */
        2: ['https://webpack.js.org/guides/asset-management/'] /* zone Assignment 第 2 条；A2 资源管理指南 */
      }
    },
    'node-path-javascript-restaurant-page': {
      a: {
        7: ['https://web.archive.org/web/20221024060550/https://eckben.github.io/bearysBreakfastBar/'] /* zone Assignment 第 7 条；A7 Beary's Breakfast Bar 存档（页签交互视觉参考） */
      }
    },
    'node-path-javascript-revisiting-webpack': {
      a: {
        1: ['https://webpack.js.org/guides/production/'] /* zone Assignment 第 1 条；A1 生产环境构建指南 */
      }
    },
    'node-path-javascript-json': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/Scripting/JSON'], /* zone Assignment 第 1 条；A1 MDN JSON 教程（中文版现役路径） */
        2: ['https://www.w3schools.com/js/js_json_parse.asp', 'https://www.w3schools.com/js/js_json_stringify.asp'], /* zone Assignment 第 2 条；A2 W3Schools parse + stringify 两页 */
        3: ['https://jsonformatter.curiousconcept.com/'] /* zone Assignment 第 3 条；A3 JSON formatter 工具 */
      }
    },
    'node-path-javascript-oop-principles': {
      a: {
        1: ['https://duncan-mcardle.medium.com/solid-principle-1-single-responsibility-javascript-5d9ce2c6f4a5', 'https://www.youtube.com/playlist?list=PLZlA0Gpn_vH9kocFX7R7BAe_CvvOCO_p9'], /* zone Assignment 第 1.1/1.2 条；A1 Medium 单责文（验证受限，按清单 originalUrl 原样接）+ WDS SOLID 播放列表 */
        2: ['https://web.archive.org/web/20170215102316/http://www.innoarchitech.com:80/scalable-maintainable-javascript-coupling'], /* zone Assignment 第 2 条；A2 耦合专文（存档地址） */
        3: ['https://www.youtube.com/watch?v=wfMtDGfHWpA'] /* zone Assignment 第 3 条；A3 组合优于继承（Fun Fun Function） */
      }
    },
    'node-path-javascript-todo-list': {
      a: {
        6: ['https://www.todoist.com/zh-CN', 'https://culturedcode.com/things/', 'https://www.any.do/'], /* zone Assignment 第 6.1/6.2/6.3 条；A6 三个灵感应用（Todoist 按 href 规则接官方中文站直连地址） */
        7: ['https://github.com/date-fns/date-fns'], /* zone Assignment 第 7 条；A7 date-fns 日期库 */
        8: ['https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API', 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON'] /* zone Assignment 第 8 条正文与小贴士③；A8 Web Storage API + MDN JSON 参考页（均中文版） */
      }
    },
    /* ===== World 3 批次 4 阶段 2（2026-09-27，v4.11.24）：真实世界 JS 3 课 + 异步与 API
     * 4 课，20 条 / 22 链接。href 规则沿用：有 zhUrl 用 zhUrl（F1 用实测存在的 zh-CN
     * 本地化锚点；art-of-node 按 301 后的现役仓库 max-mapper 接并保留官方 #callbacks
     * 锚点）；正文区资源不接（linting 的三套风格指南与 ESLint/Prettier 文档均为正文
     * zone，按纪律不接——Assignment 只点了 codacy 文、Prettier 视频与 playground）。 */
    'node-path-javascript-linting': {
      a: {
        1: ['https://blog.codacy.com/what-is-a-linter'], /* zone Assignment 第 1 条；A1 Codacy 的 linter 价值文 */
        2: ['https://www.youtube.com/watch?v=hkfBvpEfWdA'], /* zone Assignment 第 2 条；A2 Prettier 作者 James Long 的 React Conf 2017 演讲（oEmbed 核验真实标题） */
        3: ['https://prettier.io/playground'] /* zone Assignment 第 3 条；A3 Prettier 在线 playground */
      }
    },
    'node-path-javascript-form-validation-with-javascript': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Extensions/Forms/Form_validation#使用_javascript_校验表单'], /* zone Assignment 第 1 条；A1 MDN 表单校验教程中文版——zh-CN 页章节 id 已本地化，挂实测存在的本地化锚点（en 页锚点 #validating_forms_using_javascript 在中文页不存在） */
        2: ['https://developer.mozilla.org/zh-CN/docs/Web/HTML/Guides/Constraint_validation'], /* zone Assignment 第 2 条；A2 MDN 约束验证文档中文版（现役 Guides 路径） */
        3: ['https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/form#novalidate'] /* zone Assignment 第 3 条（大练习）内联 novalidate 链接；A3 MDN form 元素文档中文版（#novalidate 锚点实测存在）。第 4 条 Library 改造无第三方外链（回链均为 TOP 自有课页，剔除口径），不建键 */
      }
    },
    'node-path-javascript-ecmascript': {
      a: {
        1: ['https://github.com/lukehoban/es6features'], /* zone Assignment 第 1 条；A1 ES6 特性总览仓库 */
        2: ['https://zh.wikipedia.org/wiki/ECMAScript'] /* zone Assignment 第 2 条；A2 维基百科版本时间线——英文版为 version_history 分叉条目、中文版对应内容在主条目「历史/版本」章节（形态差异如实登记），按 href 规则接中文版 */
      }
    },
    'node-path-javascript-asynchronous-code': {
      a: {
        1: ['https://github.com/maxogden/art-of-node#callbacks'], /* zone Assignment 第 1 条；A1 art-of-node callbacks 节（按官方原链接接——maxogden 仓库 301 到现役 max-mapper，迁移事实登记在资源条目 originalUrlEffective；映射保持与资源清单 originalUrl 一致以防悬空引用） */
        2: ['https://davidwalsh.name/promises'], /* zone Assignment 第 2 条；A2 David Walsh 的 Promises 短文 */
        3: ['https://youtu.be/DHvZLI7Db8E'], /* zone Assignment 第 3 条；A3 Web Dev Simplified 的 Promises 十分钟（官方给 youtu.be 短链形态，原样接） */
        4: ['https://www.youtube.com/watch?v=8aGhZQkoFbQ'], /* zone Assignment 第 4 条；A4 Philip Roberts 事件循环经典演讲（JSConf EU） */
        5: ['https://www.youtube.com/watch?v=eiC58R16hb8'], /* zone Assignment 第 5 条；A5 Lydia Hallie 事件循环可视化 */
        6: ['https://www.youtube.com/watch?v=Xs1EMmBLpn4'], /* zone Assignment 第 6 条；A6 Lydia Hallie Promise 执行可视化 */
        7: ['https://zh.javascript.info/promise-basics'] /* zone Assignment 第 7 条；A7 javascript.info promise basics（官方中文版） */
      }
    },
    'node-path-javascript-working-with-apis': {
      a: {
        1: ['https://github.com/n0shake/Public-APIs'], /* zone Assignment 第 1 条；A1 公共 API 大全清单。第 2 条（加按钮扩展）为本地动手操作，无外链，不建键 */
        3: ['https://developer.mozilla.org/zh-CN/docs/Web/API/Response'] /* zone Assignment 第 3 条（搜索框 + 错误处理）内联 MDN Response 文档链接；A3 Response 对象文档中文版 */
      }
    },
    'node-path-javascript-async-and-await': {
      a: {
        1: ['https://zh.javascript.info/async-await', 'https://codeburst.io/javascript-es-2017-learn-async-await-by-example-48acc58bad65'], /* zone Assignment 第 1 条；A1 javascript.info async/await 教程（官方中文版）+ codeburst 示例文（命令行 403、真实浏览器核验可达，不入受限） */
        2: ['https://www.youtube.com/watch?v=9YkUCxvaLEk'] /* zone Assignment 第 2 条；A2 Wes Bos 的 dotJS 2017 Async + Await 演讲（oEmbed 核验真实标题） */
      }
    },
    'node-path-javascript-weather-app': {
      a: {
        5: ['https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/import', 'https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import'] /* zone Assignment 第 5 步子项（天气图标 dynamic imports）；A5 MDN import() 运算符中文版 + webpack Module Methods 文档（无官方中文版，C 类）。第 1–4/6–8 条为本地搭建与样式步骤（第 8 条 push GitHub 亦本地操作），无外链，不建键 */
      }
    },
    /* ===== World 3 批次 4 阶段 3（2026-09-27，v4.11.25，通宵轮）：javascript 课程
     * 「测试 JavaScript」3 课 + 「一点计算机科学」11 课。接链 37 条（39 链接）；
     * recursion / linked-lists / knights-travails 三课显式空映射——官方 Assignment
     * 面板内无第三方外链（资料全在正文区，按「zone 正文区资源不接」纪律）；
     * bst 第 7/8 步的 mycodeschool 两支视频跨课合并登记在 common-ds 课名下，
     * 防悬空断言限本课清单，故 bst 该两条不接（宁少接不错接）。 ===== */
    'node-path-javascript-testing-basics': {
      a: {
        1: ['https://web.archive.org/web/20211123190134/http://godswillokwara.com/index.php/2016/09/09/the-importance-of-test-driven-development/'], /* zone Assignment 第 1 条；TDD 过程与收益存档文（官方给的就是 web.archive.org 地址） */
        2: ['https://www.youtube.com/playlist?list=PL0zVEGEvSaeF_zoW9o66wa_UCNE3a7BEr'], /* zone Assignment 第 2 条；Unit testing in Javascript 播放列表（Fun Fun Function，oEmbed 核验） */
        3: ['https://jestjs.io/docs/getting-started'], /* zone Assignment 第 3 条；Jest Getting Started（zh-Hans 界面中文、正文英文，C 类用 originalUrl） */
        4: ['https://jestjs.io/docs/using-matchers'], /* zone Assignment 第 4 条；Using Matchers 文档 */
        5: ['https://web.archive.org/web/20260824053151/https://jrsinclair.com/articles/2016/one-weird-trick-that-will-change-the-way-you-code-forever-javascript-tdd/'] /* zone Assignment 第 5 条；jrsinclair TDD 文（官方给的就是存档地址） */
      }
    },
    'node-path-javascript-testing-practice': {
      a: {
        5: ['https://crypto.interactive-maths.com/caesar-shift-cipher.html'] /* zone Assignment 第 5 条（caesarCipher 官方编号第 4 题——本站条目含前置提醒故序号 +1）；凯撒密码原理参考。第 1 条前置提醒回指 testing-basics 站内锚点、第 2–4/6 条为本地练习，不建键 */
      }
    },
    'node-path-javascript-more-testing': {
      a: {
        1: ['https://medium.com/@jamesjefferyuk/javascript-what-are-pure-functions-4d4d5392d49c'], /* zone Assignment 第 1 条；纯函数价值文（Medium 命令行 403、真实浏览器核验可达） */
        2: ['https://www.youtube.com/watch?v=ajiAl5UNzBU&t=3024s'], /* zone Assignment 第 2 条；mocks 视频（oEmbed 真实标题 Jest Crash Course，官方 t 起播参数原样保留） */
        3: ['https://jestjs.io/docs/setup-teardown'], /* zone Assignment 第 3 条；Setup and Teardown 文档 */
        4: ['https://jestjs.io/docs/mock-functions'], /* zone Assignment 第 4 条；Mock Functions 文档 */
        5: ['https://www.youtube.com/watch?v=URSWYvyc42M'] /* zone Assignment 第 5 条；Sandi Metz 测试演讲（oEmbed 核验，Confreaks） */
      }
    },
    'javascript-a-very-brief-intro-to-cs': {
      a: {
        1: ['https://www.youtube.com/watch?v=6hfOvs8pY1k'], /* zone Assignment 第 1 条；TED-Ed What's an algorithm?（oEmbed 真实标题与官方 label 不同形，按资源清单登记） */
        2: ['https://youtu.be/e_WfC8HwVB8'], /* zone Assignment 第 2 条；What is an Algorithm?（youtu.be 短链按官方原文） */
        3: ['https://qr.ae/py3NAc'], /* zone Assignment 第 3 条；Quora 回答短链（浏览器实测跳转 John Kurlak 回答页；href 按规则取 originalUrl，effective 登记在资源条目） */
        4: ['https://www.youtube.com/watch?v=Rg-fO7rDsds'], /* zone Assignment 第 4 条；What Is Pseudocode? */
        5: ['https://youtu.be/iZmDcfTtcNg?si=7t1q8GxYJjkYH9d4'] /* zone Assignment 第 5 条；Telusko DSA 概览（短链带 si 参数按官方原文） */
      }
    },
    'javascript-recursive-methods': {
      a: {
        1: ['https://zh.javascript.info/recursion'], /* zone Assignment 第 1 条；javascript.info 递归入门——有官方中文版，href 按规则用 zhUrl（「递归和堆栈」实测在位） */
        2: ['https://www.youtube.com/watch?v=6oDQaB2one8'], /* zone Assignment 第 2 条；Web Dev Simplified 递归讲解 */
        3: ['https://www.youtube.com/watch?v=ngCos392W4w'], /* zone Assignment 第 3 条；Reducible 五步法 */
        4: ['https://www.youtube.com/watch?v=mz6tAJMVmfM'], /* zone Assignment 第 4 条；CS50 Shorts 递归 */
        5: ['https://zh.wikipedia.org/zh-cn/%E5%88%86%E6%B2%BB%E6%B3%95'] /* zone Assignment 第 5 条；维基 D&C 的 Implementation Issues 节——条目有官方中文版，href 用 zhUrl（中文「实现」章节，锚点形态见资源 zhType；合并条目含正文引文出处）。第 6 条为官方练习仓库操作目标，按 odin-recipes 先例不收不接 */
      }
    },
    'javascript-recursion': {
      a: {} /* 显式空映射：官方 Assignment 面板内无第三方外链——Fibonacci/merge sort 背景资料（Khan/CS50/Abdul Bari/hackerearth/维基）全部住在正文资料区，按「zone 正文区资源不接」纪律不建键；Test it out 与环境 Tip 为本地操作 */
    },
    'javascript-time-complexity': {
      a: {
        1: ['https://www.doabledanny.com/big-o-notation-in-javascript'], /* zone Assignment 第 1 条；Doable Danny 图解文 */
        2: ['https://www.bigocheatsheet.com/'], /* zone Assignment 第 2 条；Big-O cheat sheet（跨课同址合并登记在本课——space-complexity 与 bst 的回看引用见资源 note） */
        3: ['https://www.sahinarslan.tech/posts/step-by-step-big-o-complexity-analysis-guide-using-javascript'] /* zone Assignment 第 3 条；分步分析指南。正文 Cartesian tree 链接为正文区资料，不接 */
      }
    },
    'javascript-space-complexity': {
      a: {
        1: ['https://cs.stackexchange.com/questions/127933/analyzing-space-complexity-of-passing-data-to-function-by-reference'], /* zone Assignment 第 1 条；空间复杂度分析问答（命令行 403、浏览器核验可达） */
        2: ['https://dev.to/elmarshall/recursion-and-space-complexity-13gc'] /* zone Assignment 第 2 条；递归与空间复杂度文。正文的主存文章/memoization 词条/cheat sheet 回看均为正文区，不接 */
      }
    },
    'javascript-common-data-structures-and-algorithms': {
      a: {
        1: ['https://zh.wikipedia.org/zh-cn/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84'], /* zone Assignment 第 1 条；维基数据结构条目——有官方中文版，href 用 zhUrl（zh-cn 变体实测「数据结构」在位） */
        2: ['https://www.youtube.com/watch?v=u2TwK3fED8A'], /* zone Assignment 第 2 条；Why Study Algorithms（oEmbed 真实标题为 coursera DAA 录像段，前 10 分钟口径见资源条目） */
        3: ['https://www.youtube.com/watch?v=DSffdCT5Cx4'], /* zone Assignment 第 3 条；CS50 二分查找（整讲录像中的查找段） */
        4: ['https://www.youtube.com/watch?v=FvdPo8PBQtc'], /* zone Assignment 第 4 条；无序数组建 BST */
        5: ['https://www.youtube.com/watch?v=6QS_Cup1YoI'], /* zone Assignment 第 5 条；栈与队列原理 */
        6: ['https://www.youtube.com/watch?v=9RHO6jU--GU', 'https://www.youtube.com/watch?v=86g8jAQug04', 'https://www.youtube.com/watch?v=gm8DUJJhmY4'] /* zone Assignment 第 6 条三部曲；后两支为跨课合并条目（bst 项目第 7/8 步回看引用，见资源 note） */
      }
    },
    'javascript-linked-lists': {
      a: {} /* 显式空映射：官方 Assignment 面板内无第三方外链——四份结构资料（Plain English 视频 / dev.to 两文 / CMU 存档讲义）全部住在正文 Structure of a linked list 节，按纪律不接；环境 Tip 回指站内 installing-node-js 课；十个方法与 Test it out 为本地实现操作 */
    },
    'javascript-hashmap-data-structure': {
      a: {
        1: ['https://www.youtube.com/watch?v=btT4bCOvqjs'] /* zone Assignment 唯一一条；CS50 Hash Table 讲座（oEmbed 真实标题）。正文 MDN Set/Map 与 Additional resources 三条（stackoverflow/鸽巢/samwho）均为正文区资料，不接 */
      }
    },
    'javascript-hashmap': {
      a: {
        3: ['https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER'] /* zone Assignment hash(key) 条目（本站第 3 条）；MDN 最大安全整数——有官方中文版，href 用 zhUrl。第 4 条 set 的 collisions 回看为站内链接；其余条目为本地实现与官方测试流程，不建键 */
      }
    },
    'javascript-binary-search-trees': {
      a: {
        5: ['https://www.geeksforgeeks.org/insertion-in-binary-search-tree/?ref=lbp'], /* zone Assignment insert(value) 步骤（本站第 5 条）；gfg 插入文章。同步骤 Note 的 Big-O Cheatsheet 为跨课合并条目（登记在 time-complexity），不在本课清单，不接 */
        6: ['https://www.geeksforgeeks.org/binary-search-tree-set-2-delete/?ref=lbp'], /* zone Assignment deleteItem(value) 步骤（本站第 6 条）；gfg 删除文章 */
        7: ['https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/throw'] /* zone Assignment levelOrderForEach 步骤（本站第 7 条）；MDN throw——有官方中文版，href 用 zhUrl。第 7/8 步 Tip 的 mycodeschool 两支视频跨课合并登记在 common-ds，不在本课清单，不接（宁少接不错接）；引言的维基 BST/gfg 文章/IDeserve 视频为正文区，不接 */
      }
    },
    'javascript-knights-travails': {
      a: {} /* 显式空映射：官方 Assignment 面板内无第三方外链——Khan Academy 两份图资料住在正文引言，按纪律不接；四条官方提示与输出规格为本地设计实现 */
    },
    /* ===== World 3 批次 4 阶段 4（2026-09-27，v4.11.26，通宵轮）：「Git 进阶」3 课
     * +「JavaScript 收尾」2 课——World 3 全 41 课收组。接链 5 条（5 链接）；
     * real-world / battleship / conclusion 三课显式空映射（理由逐课见条目注释）。 ===== */
    'javascript-a-deeper-look-at-git': {
      a: {
        1: ['https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%88%86%E6%94%AF%E7%9A%84%E6%96%B0%E5%BB%BA%E4%B8%8E%E5%90%88%E5%B9%B6'], /* zone Assignment 第 1 条；Pro Git「分支的新建与合并」官方中文版（A 类 href 用 zhUrl） */
        2: ['https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%8F%98%E5%9F%BA'], /* zone Assignment 第 2 条；Pro Git「变基」章官方中文版 */
        3: ['https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E9%87%8D%E7%BD%AE%E6%8F%AD%E5%AF%86'] /* zone Assignment 第 3 条；Pro Git「重置揭密」官方中文版（官方中译本用「揭密」用字） */
      }
    },
    'javascript-working-with-remotes': {
      a: {
        1: ['https://docs.github.com/zh/pull-requests/reference/merge-conflicts'], /* zone Assignment 第 1 条；GitHub 合并冲突文档中文版（官方 en 地址 301 到现行 reference 路径，zhUrl 按重定向后现役路径登记） */
        2: ['https://think-like-a-git.net/sections/about-this-site.html'] /* zone Assignment 第 2 条；Think Like (a) Git 全站通读入口（英文站无官方中文版，C 类接 originalUrl） */
      }
    },
    'javascript-using-git-in-the-real-world': {
      a: {} /* 显式空映射：Assignment 三段（初始设置 / 日常工作流 / 发 PR）的操作目标全部是 TOP curriculum 仓库本体（fork / clone / CONTRIBUTING / issues / PR——仓库自有页面按口径不收资源卡）；Conventional Commits 住正文「协作用的提交信息」节，按「zone 正文区资源不接」纪律不接 */
    },
    'node-path-javascript-battleship': {
      a: {} /* 显式空映射：Assignment 全部为本地动手步骤（五大步 + Extra credit）；规则维基与在线版游戏住正文引言节（reference 类），按纪律不接 */
    },
    'node-path-javascript-conclusion': {
      a: {} /* 显式空映射：官方无 Assignment 节（sources.json 登记 hasAssignment: false——与 choose-your-path-forward、how-this-course-will-work 同口径）；正文反馈表为课程行政入口（Admin Dashboard 先例） */
    },
    /* ===== World 4 批次 5 阶段 1（2026-09-27，v4.11.27，通宵轮）：「动画」章节 3 课。
     * 接链 13 条（14 链接）：transforms 4 条 5 链接（第 1 条双链——官方该条含 MDN
     * rotate3d 演示与 QHMIT 文章两个地址）、transitions 5 条 5 链接（第 4 条不接——
     * CSS Triggers 存档表为跨课合并条目、登记在 transforms 首现课名下，防悬空断言
     * 限本课清单，按「宁少接不错接」纪律不建映射）、keyframes 4 条 4 链接（含练习
     * 目录条目——按 Foundations 各课 css-exercises 目录接链先例）。A 类资源接链
     * 一律 zhUrl；MDN 过渡教程的中文链接按整篇教程挂 zhUrl 主地址（官方条目内的
     * Defining transitions 小节锚点已在资源条目 zhType/note 登记本地化锚点事实，
     * 同页合并不再重复接链）。 ===== */
    'node-path-advanced-html-and-css-transforms': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Values/transform-function/rotate3d', 'https://www.qhmit.com/css/functions/css_rotate3d_function.cfm'], /* zone Assignment 第 1 条双链：MDN rotate3d（A 类 zhUrl——官方原链接 301 到现役路径，href 用 zhUrl 现役地址）+ QHMIT 文章（C 类 href 按官方原地址——www 形式 301 到 web.qhmit.com 子域，迁移事实登记在资源条目 originalUrlEffective；防悬空集合 = originalUrl + zhUrl 不含 effective，art-of-node 先例） */
        2: ['https://3dtransforms.desandro.com/perspective'], /* zone Assignment 第 2 条；desandro perspective 一章（C 类 originalUrl） */
        3: ['https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Values/transform-function/translate3d'], /* zone Assignment 第 3 条；MDN translate3d 演示（A 类 zhUrl 现役地址） */
        4: ['https://www.joshwcomeau.com/css/transforms/'] /* zone Assignment 第 4 条；Josh Comeau 变换全景长文（C 类 originalUrl） */
      }
    },
    'node-path-advanced-html-and-css-transitions': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Web/CSS/Guides/Transitions/Using'], /* zone Assignment 第 1 条；MDN 过渡教程整篇（A 类 zhUrl；条目内 Defining transitions 小节链接同页合并——中文页该节实测锚点为本地化形态，事实登记在资源条目） */
        2: ['https://www.joshwcomeau.com/css/stacking-contexts/'], /* zone Assignment 第 2 条；层叠上下文专文（C 类） */
        3: ['https://chromewebstore.google.com/detail/apjeljpachdcjkgnamgppgfkmddadcki?utm_source=item-share-cb'], /* zone Assignment 第 3 条；Chrome 商店扩展页（C 类 originalUrl 官方原地址——短形式 301 到含名称 slug 的完整地址，effective 不进防悬空集合） */
        5: ['https://www.joshwcomeau.com/animation/css-transitions/'], /* zone Assignment 第 5 条；过渡交互指南（C 类）。第 4 条 CSS Triggers 不接——跨课合并条目登记在 transforms 首现课名下，不在本课资源清单，防悬空断言会红（资源归属课纪律，bst 的 mycodeschool 先例） */
        6: ['https://dzhavat.github.io/2021/02/18/debugging-layout-repaint-issues-triggered-by-css-transition.html'] /* zone Assignment 第 6 条；repaint 调试实录（C 类） */
      }
    },
    'node-path-advanced-html-and-css-keyframes': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Web/CSS/Guides/Animations/Using'], /* zone Assignment 第 1 条；MDN 动画教程（A 类 zhUrl 现役地址） */
        2: ['https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/At-rules/@keyframes'], /* zone Assignment 第 2 条；MDN @keyframes 参考（A 类 zhUrl 现役地址） */
        3: ['https://www.joshwcomeau.com/animation/keyframe-animations/'], /* zone Assignment 第 3 条；关键帧交互指南（C 类） */
        4: ['https://github.com/TheOdinProject/css-exercises/tree/main/advanced-html-css/animation'] /* zone Assignment 第 4 条；本章练习目录（C 类——css-exercises 子目录为官方 Assignment 点名的练习入口，按课 21/29 的 css-exercises 目录接链先例建映射；与「javascript-exercises 练习操作目标不收录」的区别：css-exercises 各目录在 Foundations 批次一贯收录为资源并接链） */
      }
    },
    /* ===== World 4 批次 5 阶段 2（2026-09-27，v4.11.28，通宵轮）：「无障碍」章节 8 课。
     * 接链 18 条（22 链接）：introduction 2 条 2 链、wcag 2 条 2 链、semantic-html
     * 4 条 7 链（第 1 条官方一条含四个平台的屏幕阅读器入口，四链全接——NVDA 接
     * originalUrl、VoiceOver 与 ChromeVox 接官方中文版 zhUrl、Orca 接 originalUrl）、
     * keyboard-navigation 2 条 3 链（第 1 条含两支 A11ycasts 视频双链）、
     * meaningful-text 2 条 2 链、wai-aria 2 条 2 链（MDN Live Regions 接 zhUrl
     * 现役地址）、accessibility-auditing 4 条 4 链（Chrome 开发者文档三条接
     * ?hl=zh-cn 官方中文版、Firefox 源文档接 originalUrl）。A 类资源接链一律
     * zhUrl。accessible-colors 官方无 Assignment 节——显式空映射（全站第四门，
     * conclusion 先例）。 ===== */
    'node-path-advanced-html-and-css-introduction-to-web-accessibility': {
      a: {
        1: ['https://www.w3.org/WAI/people-use-web/abilities-barriers/'], /* zone Assignment 第 1 条；W3C 多样能力与障碍（C 类——W3C 无官方中文版） */
        2: ['https://www.w3.org/WAI/perspective-videos/'] /* zone Assignment 第 2 条；W3C 无障碍视角视频合集页（C 类视频合集，不声称有中文字幕） */
      }
    },
    'node-path-advanced-html-and-css-the-web-content-accessibility-guidelines-wcag': {
      a: {
        1: ['https://www.w3.org/WAI/standards-guidelines/wcag/'], /* zone Assignment 第 1 条；WCAG Overview（C 类——/zh-hans/ 与 /zh/ 路径形态均实测 404，无官方中文版） */
        2: ['https://webaim.org/standards/wcag/checklist'] /* zone Assignment 第 2 条；WebAIM WCAG 2 检查清单（C 类速查表） */
      }
    },
    'node-path-advanced-html-and-css-semantic-html': {
      a: {
        1: ['https://www.nvaccess.org/download/', 'https://support.apple.com/zh-cn/guide/voiceover/welcome/mac', 'https://gnome.pages.gitlab.gnome.org/orca/help/', 'https://support.google.com/chromebook/answer/7031755?hl=zh-Hans'], /* zone Assignment 第 1 条；官方一条含四平台屏幕阅读器入口——四链全接：NVDA（C 类）/ VoiceOver 旁白官方中文手册（A 类 zhUrl）/ Orca（C 类）/ ChromeVox 官方中文帮助（A 类 zhUrl hl=zh-Hans） */
        2: ['https://tink.uk/how-screen-readers-navigate-data-tables/'], /* zone Assignment 第 2 条；tink.uk 表格导航实测文（C 类） */
        3: ['https://youtu.be/ACmYzyN0b3U?si=o5PptrjVGJGj2OT7&t=83'], /* zone Assignment 第 3 条；无障碍表格演示视频（C 类 oEmbed 核验，官方原文即短链带参形态原样接） */
        4: ['https://www.youtube.com/watch?v=vAAzdi1xuUY&list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g&index=19'] /* zone Assignment 第 4 条；A11ycasts #18 标题与地标视频（C 类 oEmbed 核验，watch 带列表参数原样接） */
      }
    },
    'node-path-advanced-html-and-css-accessible-colors': {
      a: {} /* 显式空映射：官方无 Assignment 节（sources.json 登记 hasAssignment: false——全站第四门，与 choose-your-path-forward、how-this-course-will-work、conclusion 同口径）；正文点名的 WebAIM Contrast Checker 为 reference 类资料住资源区，不建任务映射 */
    },
    'node-path-advanced-html-and-css-keyboard-navigation': {
      a: {
        1: ['https://www.youtube.com/watch?v=EFv9ubbZLKw&list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g&index=3', 'https://www.youtube.com/watch?v=Pe0Ce1WtnUM&list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g&index=4'], /* zone Assignment 第 1 条；官方一条含两支 A11ycasts 视频（#03 What is Focus / #04 tabindex）——双链全接（C 类 oEmbed 核验） */
        2: ['https://webaim.org/techniques/skipnav/'] /* zone Assignment 第 2 条；WebAIM Skip Links 教程（C 类） */
      }
    },
    'node-path-advanced-html-and-css-meaningful-text': {
      a: {
        1: ['https://webaim.org/techniques/alttext'], /* zone Assignment 第 1 条；WebAIM 替代文本方法论（C 类） */
        2: ['https://webaim.org/techniques/formvalidation/'] /* zone Assignment 第 2 条；WebAIM 表单校验与错误恢复（C 类） */
      }
    },
    'node-path-advanced-html-and-css-wai-aria': {
      a: {
        1: ['https://www.w3.org/TR/html-aria/'], /* zone Assignment 第 1 条；W3C ARIA in HTML 规范（C 类规范——无官方中文版） */
        2: ['https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA/Guides/Live_regions'] /* zone Assignment 第 2 条；MDN ARIA 实时区域（A 类 zhUrl 现役地址——en 旧路径 301 事实住资源条目） */
      }
    },
    'node-path-advanced-html-and-css-accessibility-auditing': {
      a: {
        1: ['https://developer.chrome.com/docs/devtools/accessibility/reference/?hl=zh-cn'], /* zone Assignment 第 1 条；Chrome 无障碍功能参考（A 类 zhUrl——hl 参数形态，/zh/ 路径实测回英文页） */
        2: ['https://developer.chrome.com/blog/new-in-devtools-83/?hl=zh-cn'], /* zone Assignment 第 2 条；Chrome 83 更新博客（A 类 zhUrl——官方只要求读模拟视觉缺陷一节） */
        3: ['https://developer.chrome.com/docs/devtools/issues/?hl=zh-cn'], /* zone Assignment 第 3 条；Issues 面板文档（A 类 zhUrl——官方口径只要求学会打开面板） */
        4: ['https://firefox-source-docs.mozilla.org/devtools-user/accessibility_inspector/index.html#features-of-the-accessibility-panel'] /* zone Assignment 第 4 条；Firefox 无障碍检查器文档（C 类——锚点实测存在） */
      }
    },
    /* ===== World 4 批次 5 阶段 3（2026-09-27，v4.11.29，通宵轮，World 4 收组）：
     * 「响应式设计」章节 5 课。接链 7 条（9 链接）：introduction 1 条 1 链、
     * natural-responsiveness 2 条 2 链、responsive-images 3 条 5 链（第 1 条官方
     * 一条含 MDN 三属性文档链接、三链全接——一条任务多链接形态，semantic-html
     * 四链先例同型）、media-queries 1 条 1 链；A 类资源接链一律 zhUrl（MDN 六条
     * 全部按重定向后现役路径：Reference/Elements、Reference/Properties、Guides）。
     * homepage 为 Project 课显式空映射：Step 2 素材来源三条中 pexels 跨课合并
     * 归属 landing-page、materialdesignicons 301 后与 admin-dashboard 既有
     * pictogrammers 条目同址跨课合并、devicon 为 reference 素材按先例不接；
     * Step 1 statically 设计稿配图剔除口径、Step 4 行政表单先例。 ===== */
    'node-path-advanced-html-and-css-introduction-to-responsive-design': {
      a: {
        1: ['https://developer.chrome.com/docs/devtools/device-mode/?hl=zh-cn'] /* zone Assignment 第 1 条；Chrome device-mode 指南（A 类 zhUrl——?hl=zh-cn 参数形态，阶段 2 确立口径第二批） */
      }
    },
    'node-path-advanced-html-and-css-natural-responsiveness': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/meta/name/viewport'], /* zone Assignment 第 1 条；MDN viewport meta 属性参考（A 类 zhUrl——官方 en 旧教程路径 301 至 Reference/Elements 现役路径，中文接现役） */
        2: ['https://web.archive.org/web/20251116005914/https://codyloyd.com/2021/percentages/'] /* zone Assignment 第 2 条；Using Percentages in CSS（C 类——官方给的即 web.archive.org 存档地址，原样接） */
      }
    },
    'node-path-advanced-html-and-css-responsive-images': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/background-size', 'https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/background-position', 'https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/object-fit'], /* zone Assignment 第 1 条；官方一条含三个 MDN 属性文档链接——三链全接 zh-CN 现役 Reference/Properties 路径（A 类；en 旧路径 301 事实住资源条目） */
        2: ['https://developer.mozilla.org/zh-CN/docs/Web/HTML/Guides/Responsive_images'], /* zone Assignment 第 2 条；MDN 响应式图片教程（A 类 zhUrl——Learn 旧路径 301 至 Guides 现役路径） */
        3: ['https://css-tricks.com/a-guide-to-the-responsive-images-syntax-in-html/'] /* zone Assignment 第 3 条；CSS-Tricks 响应式图片语法指南（C 类——无官方中文版） */
      }
    },
    'node-path-advanced-html-and-css-media-queries': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Web/CSS/Guides/Media_queries/Using'] /* zone Assignment 第 1 条；MDN 使用媒体查询（A 类 zhUrl——en 旧路径 301 至 Guides/Media_queries/Using 现役路径） */
      }
    },
    'node-path-advanced-html-and-css-homepage': {
      a: {} /* Project 课显式空映射：Step 2 的 pexels 跨课合并归属 landing-page 首现课（受限清单在案、本轮浏览器复核发现 /zh-cn/ 官方中文版的事实已追加该条目 note）、materialdesignicons 实测 301 至 pictogrammers.com/library/mdi/ 与 admin-dashboard Step 4 既有条目同址跨课合并——两条按「资源归属课」纪律不接（防悬空断言限本课清单）；devicon 为本课登记的 reference 素材来源，按 landing-page/admin-dashboard 先例不接（接进任务条目会把参考资料抬成任务入口）；Step 1 三张 statically 设计稿按配图剔除口径、Step 4 Google 反馈表按行政表单先例 */
    },
    /* ===== World 5 批次 6 阶段 1（2026-09-27，v4.11.30）：react 课程「引言」+「React 入门」
     * 两章 8 课 +11 条 11 链接（A 类资源接链一律 zhUrl）。 ===== */
    'node-path-react-new-how-this-course-will-work': {
      a: {} /* 显式空映射：官方无 Assignment 节（sources.json 登记 hasAssignment: false——全站第五门，与 choose-your-path-forward、javascript 引言课与结语课、accessible-colors 同口径）；正文两处链接均为 TOP 自有课页（JavaScript 课程页与 Todo List 课页），按既有口径剔除、无第三方可接 */
    },
    'node-path-react-new-introduction-to-react': {
      a: {
        /* 第 1 条（浏览 react.dev 官网）不接：react.dev 为跨课合并条目、归属 javascript
         * 结语课首现登记（全站首例 zh-hans.react.dev 条目），按「资源归属课」纪律不接
         * （防悬空断言限本课清单——bst 的 mycodeschool 先例）。 */
        2: ['https://blog.risingstack.com/the-history-of-react-js-on-a-timeline/'], /* zone Assignment 第 2 条；RisingStack React 历史时间线（C 类接原地址） */
        3: ['https://www.freecodecamp.org/news/the-difference-between-a-framework-and-a-library-bd133054023f/'], /* zone Assignment 第 3 条；freeCodeCamp 库与框架辨析（C 类——官方中文站无本文译本） */
        4: ['https://www.geeksforgeeks.org/reactjs/what-are-the-advantages-of-react-js/'] /* zone Assignment 第 4 条；GeeksforGeeks React 优势（C 类） */
      }
    },
    'node-path-react-new-setting-up-a-react-environment': {
      a: {
        1: ['https://cn.vite.dev/guide/'], /* zone Assignment 第 1 条；Vite Getting Started（A 类 zhUrl——cn.vite.dev 官网语言切换器指向的现役中文域） */
        2: ['https://www.debugbear.com/blog/react-devtools'] /* zone Assignment 第 2 条；DebugBear React DevTools 指南（C 类接原地址）；第 3 条为本地动手清理项目、无外链不建条目 */
      }
    },
    'node-path-react-new-react-components': {
      a: {} /* 显式空映射（全站首个「跨课合并后零条目」课）：官方 Assignment 唯一外链为 MDN export 语句文档 #description 锚点——与 javascript es6-modules 课既有条目同页（同页合并 + 跨课合并归属首现课），按「资源归属课」纪律不接；正文组件拆解示例图为 statically 配图剔除口径 */
    },
    'node-path-react-new-what-is-jsx': {
      a: {
        1: ['https://zh-hans.react.dev/learn/writing-markup-with-jsx'], /* zone Assignment 第 1 条；React 文档「使用 JSX 书写标签语言」（A 类 zhUrl） */
        2: ['https://zh-hans.react.dev/learn/javascript-in-jsx-with-curly-braces'] /* zone Assignment 第 2 条；React 文档「在 JSX 中通过大括号使用 JavaScript」（A 类 zhUrl） */
      }
    },
    'node-path-react-new-passing-data-between-components': {
      a: {
        1: ['https://zh-hans.react.dev/learn/passing-props-to-a-component'] /* zone Assignment 第 1 条；React 文档「将 Props 传递给组件」（A 类 zhUrl） */
      }
    },
    'node-path-react-new-rendering-techniques': {
      a: {
        1: ['https://zh-hans.react.dev/learn/conditional-rendering'], /* zone Assignment 第 1 条；React 文档「条件渲染」（A 类 zhUrl——正文警告块的 #logical-and-operator- 锚点同页合并入本条目） */
        2: ['https://zh-hans.react.dev/learn/rendering-lists'] /* zone Assignment 第 2 条；React 文档「渲染列表」（A 类 zhUrl——官方明示 keys 部分下一课再学；下一课第 1 条引用同页锚点、归属本课） */
      }
    },
    'node-path-react-new-keys-in-react': {
      a: {
        /* 第 1 条（读 rendering-lists 的 keys 小节）不接：该文档为同页跨课引用、条目
         * 归属 rendering-techniques 课首现登记，按「资源归属课」纪律不接。 */
        2: ['https://youtu.be/xlPxnc5uUPQ'] /* zone Assignment 第 2 条；Codevolution index-as-key 反模式视频（C 类接原地址，oEmbed 核验） */
      }
    },
    /* ===== World 5 批次 6 阶段 2（2026-09-28，v4.11.31）：react 课程「状态与副作用」
     * 5 课 +「类组件」2 课。10 条接链 16 链接；class-based-components 显式空映射
     * （三条全部本地动手）；跨课合并/同页合并条目一律不接（react-examples 仓库根归属
     * introduction-to-state、Giphy 归属 javascript 异步 API 课、StrictMode 参考页归属
     * cv-application——side-effects 课正文锚点为同页引用无独立 Assignment 条目）。
     * 全站 272 条 348 链接。 ===== */
    'node-path-react-new-introduction-to-state': {
      a: {
        1: ['https://zh-hans.react.dev/learn/state-a-components-memory', 'https://zh-hans.react.dev/learn/render-and-commit'], /* zone Assignment 第 1 条双子项；React 文档「State：组件的记忆」+「渲染和提交」（A 类 zhUrl，es6-modules 单条双链先例同型） */
        2: ['https://www.geeksforgeeks.org/reactjs-reconciliation/'] /* zone Assignment 第 2 条；GFG 调和算法文（C 类接原地址——301 后现役路径） */
      }
    },
    'node-path-react-new-more-on-state': {
      a: {
        1: ['https://zh-hans.react.dev/learn/state-as-a-snapshot', 'https://zh-hans.react.dev/learn/choosing-the-state-structure', 'https://zh-hans.react.dev/learn/sharing-state-between-components'] /* zone Assignment 第 1 条三子项；React 文档三篇（A 类 zhUrl，responsive-images 一条多链先例同型）；第 2 条本地动手不建条目 */
      }
    },
    'node-path-react-new-cv-application': {
      a: {
        6: ['https://cn.vite.dev/guide/static-deploy.html', 'https://app.netlify.com/start', 'https://vercel.com/new', 'https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/'] /* zone Assignment 第 6 步「用下文任一选项部署」；Vite 部署文档中文版（A 类 zhUrl）+ 三平台导入入口/指南（操作入口与教程按 todo-list 灵感应用多链先例全接）；第 1–5 步本地动手不建条目 */
      }
    },
    'node-path-react-new-how-to-deal-with-side-effects': {
      a: {
        1: ['https://zh-hans.react.dev/learn/lifecycle-of-reactive-effects'], /* zone Assignment 第 1 条；React 文档「响应式 Effect 的生命周期」（A 类 zhUrl） */
        2: ['https://zh-hans.react.dev/learn/you-might-not-need-an-effect'], /* zone Assignment 第 2 条；React 文档「你可能不需要 Effect」（A 类 zhUrl） */
        3: ['https://dmitripavlutin.com/react-useeffect-infinite-loop/'] /* zone Assignment 第 3 条；useEffect 无限循环专文（C 类接原地址） */
      }
    },
    'node-path-react-new-memory-card': {
      a: {
        /* 第 3 条数据源双子项只接 PokéAPI：Giphy 为跨课合并条目（归属 javascript
         * 「异步 JavaScript 与 API」课首现登记），防悬空断言限本课清单，按 bst 课
         * mycodeschool 先例宁少接不错接。第 1/2/4/5/6 条本地动手与部署不建条目
         * （部署复用 cv-application 课正文指引，官方未重复给链接）。 */
        3: ['https://pokeapi.co/'] /* zone Assignment 第 3 条；PokéAPI（C 类接原地址） */
      }
    },
    'node-path-react-new-class-based-components': {
      a: {} /* 显式空映射：官方 Assignment 三条全部本地动手（给 ClassInput 加删除按钮 / Count 类组件 / 编辑按钮，练习素材为 react-examples 仓库 class-components/ 目录——仓库根条目跨课合并归属 introduction-to-state 首现课），无第三方外链可接；正文 super 的 MDN Hint 为 optional 参考不在 Assignment 条目内（finishing-up-with-javascript 先例同型） */
    },
    'node-path-react-new-component-lifecycle-methods': {
      a: {
        1: ['https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/'], /* zone Assignment 第 1 条；wojtekmaj 生命周期交互图（C 类接原地址） */
        2: ['https://zh-hans.react.dev/reference/react/Component'] /* zone Assignment 第 2 条；React 文档 Component 参考页（A 类 zhUrl——官方指定阅读范围 constructor 到 willUnmount，转达进任务文案） */
      }
    },
    /* ---------- World 5 批次 6 阶段 3（2026-09-28，v4.11.32，World 5 收组）：
     * 「React 测试」2 课 +「React 生态」4 课 +「更多 React 概念」3 课 +「结语」1 课，
     * 9 课接链 24 条 30 链接 + conclusion 显式空映射（全站 296 条 378 链接）。
     * A 类资源接链一律 zhUrl；C 类接 originalUrl（301 迁移事实住 ER 条目）。 ---------- */
    'node-path-react-new-introduction-to-react-testing': {
      a: {
        1: ['https://kentcdodds.com/blog/testing-implementation-details'], /* zone Assignment 第 1 条；Testing Implementation Details（C 类接原地址） */
        2: ['https://testing-library.com/docs/dom-testing-library/cheatsheet/', 'https://testing-library.com/docs/queries/bytestid/'], /* zone Assignment 第 2 条双子项；cheatsheet + bytestid 两页全接 */
        3: ['https://testing-library.com/docs/user-event/intro/'], /* zone Assignment 第 3 条；userEvent intro（mocking 课正文 #writing-tests 锚点同页合并归此条目） */
        4: ['https://tsh.io/blog/pros-and-cons-of-jest-snapshot-tests/', 'https://www.sitepen.com/blog/snapshot-testing-benefits-and-drawbacks'] /* zone Assignment 第 4 条两篇快照文全接 */
      }
    },
    'node-path-react-new-mocking-callbacks-and-components': {
      a: {
        1: ['https://medium.com/@taylormclean15/jest-testing-mocking-child-components-to-make-your-unit-tests-more-concise-18691ef6a0c2'], /* zone Assignment 第 1 条；Medium mock 子组件文（受限双通路条目照接原地址） */
        2: ['https://academind.com/tutorials/testing-react-apps'] /* zone Assignment 第 2 条；Academind 教程（接官方原地址——301 到 /articles/ 现役路径事实住 ER 条目） */
      }
    },
    'node-path-react-new-react-router': {
      a: {
        1: ['https://bholmes.dev/blog/spas-clientside-routing/'], /* zone Assignment 第 1 条；Ben Holmes SPA 与客户端路由文 */
        3: ['https://reactrouter.com/home'] /* zone Assignment 第 3 条；React Router 文档首页；第 2 条本地动手（加路由/重写应用）不建条目 */
      }
    },
    'node-path-react-new-fetching-data-in-react': {
      a: {
        1: ['https://blog.logrocket.com/modern-api-data-fetching-methods-react/'], /* zone Assignment 第 1 条；LogRocket 现代取数方法（官方划阅读范围到 Axios 节） */
        2: ['https://www.developerway.com/posts/how-to-fetch-data-in-react'] /* zone Assignment 第 2 条；developerway 性能视角取数文 */
      }
    },
    'node-path-react-new-styling-react-applications': {
      a: {
        1: ['https://github.com/css-modules/css-modules', 'https://www.makeuseof.com/react-components-css-modules-style/'], /* zone Assignment 第 1 条双子项全接 */
        2: ['https://blog.logrocket.com/css-vs-css-in-js/', 'https://css-tricks.com/a-thorough-analysis-of-css-in-js/'], /* zone Assignment 第 2 条两篇对比文全接 */
        3: ['https://styled-components.com/'] /* zone Assignment 第 3 条；styled-components 文档（略读） */
      }
    },
    'node-path-react-new-shopping-cart': {
      a: {
        8: ['https://fakestoreapi.com'], /* zone Assignment 第 8 条；FakeStore API 数据源 */
        11: ['https://docs.netlify.com/routing/redirects/', 'https://vercel.com/docs/frameworks/vite', 'https://developers.cloudflare.com/pages/platform/serving-pages/'] /* zone Assignment 第 11 条部署三平台文档全接（301 迁移事实住 ER 条目）；第 1–7/9/10 条本地动手与测试不建条目 */
      }
    },
    'node-path-react-new-managing-state-with-the-context-api': {
      a: {
        1: ['https://zh-hans.react.dev/learn/passing-data-deeply-with-context'], /* zone Assignment 第 1 条；React 文档 Context 深层传参（A 类 zhUrl） */
        2: ['https://kentcdodds.com/blog/prop-drilling'] /* zone Assignment 第 2 条；Prop Drilling 短文 */
      }
    },
    'node-path-react-new-reducing-state': {
      a: {
        1: ['https://zh-hans.react.dev/learn/extracting-state-logic-into-a-reducer'], /* zone Assignment 第 1 条；React 文档迁移状态逻辑至 Reducer（A 类 zhUrl——文末挑战题要求已转达任务文案） */
        2: ['https://zh-hans.react.dev/reference/react/useReducer'] /* zone Assignment 第 2 条；useReducer 参考页（A 类 zhUrl——troubleshooting 精读要求已转达） */
      }
    },
    'node-path-react-new-refs-and-memoization': {
      a: {
        1: ['https://kentcdodds.com/blog/usememo-and-usecallback'], /* zone Assignment 第 1 条；When to useMemo and useCallback */
        2: ['https://zh-hans.react.dev/reference/react/useRef'], /* zone Assignment 第 2 条；useRef 参考页（A 类 zhUrl） */
        3: ['https://zh-hans.react.dev/learn/manipulating-the-dom-with-refs'], /* zone Assignment 第 3 条；使用 ref 操作 DOM（A 类 zhUrl） */
        4: ['https://overreacted.io/making-setinterval-declarative-with-react-hooks/'], /* zone Assignment 第 4 条；Dan Abramov setInterval 名文 */
        5: ['https://zh-hans.react.dev/learn/react-compiler'] /* zone Assignment 第 5 条；React Compiler 文档（A 类 zhUrl） */
      }
    },
    'node-path-react-conclusion': {
      a: {} /* 显式空映射：官方有 Assignment 节但唯一条目为 React 课程反馈 Google 表单——按行政表单口径剔除（sign-up-form 反馈表先例），无第三方学习资料可接；正文四个外链（RFC 仓库 / react.dev 博客 / patterns.dev / smashing 存档文）均登记资料区但不在 Assignment 条目内。「有 Assignment 节但条目全部剔除」的新形态——与 accessible-colors「官方无 Assignment 节」（hasAssignment:false）不同型，本课 hasAssignment 仍为 true */
    },
    /* 超长轮批次 7 阶段 1（2026-09-28，v4.11.33，World 6 收组）：databases 课程 3 课 +7 条 +7 链接
     * （地址逐字符取自 external-resources.js 的 originalUrl，本批全 C 类无 zhUrl） */
    'node-path-databases': {
      a: {
        1: ['https://launchschool.com/books/sql/read/introduction'], /* zone Assignment 第 1 条；LaunchSchool SQL 书引言（官方限读引言第一页） */
        2: ['http://www.youtube.com/watch?v=z2kbsG8zsLM'], /* zone Assignment 第 2 条；关系型数据库简介视频（oEmbed 核验，英文视频） */
        3: ['https://www.khanacademy.org/computing/hour-of-code/hour-of-sql/v/welcome-to-sql'], /* zone Assignment 第 3 条；可汗学院 SQL 教程（命令行受限、真实浏览器可达；中文站该页未翻译） */
        4: ['https://circleci.com/blog/SQL-vs-NoSQL-databases/'] /* zone Assignment 第 4 条；SQL vs NoSQL 对比文 */
      }
    },
    'node-path-databases-databases-and-sql': {
      a: {
        1: ['https://www.sqlteaching.com/'], /* zone Assignment 第 1 条；SQL Teaching 交互教程 */
        2: ['http://sqlbolt.com/'] /* zone Assignment 第 2 条；SQLBolt 交互教程。正文 codinghorror 图解 / W3Schools join / W3Schools trysql 三条为 reference 资料住资源区、不在 Assignment 条目内，按既有口径不接 */
      }
    },
    'node-path-databases-sql-zoo': {
      a: {
        1: ['https://sqlzoo.net/wiki/SQL_Tutorial'] /* zone Assignment 第 1 条；SQL Zoo 练习站（Project 课核心任务入口、学习型链接照接）；第 2 条课程反馈表按行政表单口径剔除不接 */
      }
    },
    /* 超长轮批次 7 阶段 2（2026-09-28，v4.11.34，NodeJS 入门 6 课 + Express 11 课开放）：nodejs 课程 17 课 +25 条 +32 链接
     * （地址逐字符取自 external-resources.js 的 originalUrl / zhUrl；A 类一律接 zhUrl——MDN
     * First_steps 与 Web_frameworks、Express routing 与 using-template-engines 四条。
     * 不接的纪律记录：getting-started Assignment 面板首句的 NodeJS.org docs 总述链接不在编号
     * 条目内、不接；forms 官方 Further Reading 小节（express-validator 三页 + presidentbeef）
     * 在 Assignment 面板内但本站无编号条目承接、不建映射——四条资源照实登记在资料区；
     * routes 正文引用的 MDN HTTP Methods 为跨课合并条目（归属 form-basics 首现课）、防悬空
     * 断言限本课清单故无从接、亦不在 Assignment 条目内。四课显式空映射：basic-info-site /
     * mini-message-board / inventory-application 三门 Project 课条目全部本地动手（shopping-cart
     * 先例同型），forms 五条全部本地编码（class-based-components「条目全部本地动手」同型）。
     * deployment 第 2 条「用你所选 PaaS 的部署指南」接三份专用指南（Render / Neon / Aiven 各一
     * ——Railway 未登记专用 Node 指南、其 docs 总入口为正文推荐名单 reference 不接）；第 1 条
     * 供应商主页与文档为正文推荐名单区不接、第 3 条排障指向本课内部小节无外链。 */
    'nodejs-introduction-to-the-back-end': {
      a: {
        1: ['http://blog.teamtreehouse.com/i-dont-speak-your-language-frontend-vs-backend'], /* zone Assignment 第 1 条；Team Treehouse 前端 vs 后端 */
        2: ['https://techterms.com/definition/backend'], /* zone Assignment 第 2 条；TechTerms 后端定义 */
        3: ['https://www.codecademy.com/articles/back-end-architecture'] /* zone Assignment 第 3 条；Codecademy 后端架构拆解（articles→article 路径迁移事实住 ER 条目） */
      }
    },
    'nodejs-introduction-what-is-nodejs': {
      a: {
        1: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Extensions/Server-side/First_steps'], /* zone Assignment 第 1 条；MDN 服务端第一步骤（A 类 zhUrl——官方限读 Tutorials 下前两篇，子页亦有中文版） */
        2: ['https://medium.freecodecamp.org/what-exactly-is-node-js-ae36e97449f5'], /* zone Assignment 第 2 条；freeCodeCamp NodeJS 拆解文（域名迁移事实住 ER 条目） */
        3: ['https://www.youtube.com/watch?v=uVwtVBpw7RQ'] /* zone Assignment 第 3 条；NodeJS 入门短视频（oEmbed 核验） */
      }
    },
    'nodejs-getting-started': {
      a: {
        1: ['https://nodejs.org/en/learn/command-line/run-nodejs-scripts-from-the-command-line'], /* zone Assignment 第 1 站；从终端运行 Node 脚本 */
        2: ['https://nodejs.org/learn/getting-started/fetch', 'https://nodejs.org/api/http.html'], /* zone Assignment 第 2 站双子项；fetch 一课 + http 模块 API（长页沿用官方锚点习惯、此两条官方未带锚点） */
        3: ['https://github.com/nodejs/nodejs.dev/blob/aa4239e87a5adc992fdb709c20aebb5f6da77f86/content/learn/node-js-modules/node-module-fs.en.md', 'https://nodejs.org/en/learn/manipulating-files/writing-files-with-nodejs', 'https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs'], /* zone Assignment 第 3 站三子项；fs 模块（NodeJS.dev GitHub 钉住 markdown）+ 写文件 + 读文件 */
        4: ['https://nodejs.org/api/url.html#url_the_whatwg_url_api'], /* zone Assignment 第 4 站；WHATWG URL API 文档（长页面沿用官方原文锚点） */
        5: ['https://nodejs.org/en/learn/asynchronous-work/the-nodejs-event-emitter', 'https://github.com/nodejs/nodejs.dev/blob/aa4239e87a5adc992fdb709c20aebb5f6da77f86/content/learn/node-js-modules/node-module-events.en.md'] /* zone Assignment 第 5 站双子项；Event Emitter 一节 + events 模块（GitHub 钉住 markdown） */
      }
    },
    'nodejs-debugging-node': {
      a: {
        1: ['https://www.youtube.com/watch?v=2oFKNL7vYV8&ab_channel=VisualStudioCode'], /* zone Assignment 第 1 条；VS Code 官方频道 Node 调试视频（oEmbed 核验） */
        2: ['https://code.visualstudio.com/docs/nodejs/nodejs-debugging'] /* zone Assignment 第 2 条；VS Code Node 调试器官方文档 */
      }
    },
    'nodejs-basic-informational-site': {
      a: {} /* 显式空映射：Project 课，官方 Assignment 2 条全部本地动手（建目录文件 / 写服务器代码），官方外链为零、零资料课（NO_RESOURCE_LESSONS 在案）——shopping-cart 先例同型 */
    },
    'nodejs-environment-variables': {
      a: {
        1: ['https://nodejs.org/docs/latest-v24.x/api/environment_variables.html'] /* zone Assignment 第 1 条；Node 官方环境变量文档（官方原文钉 latest-v24.x 版本路径） */
      }
    },
    'nodejs-introduction-to-frameworks': {
      a: {
        1: ['https://dev.to/aspittel/what-is-a-web-framework-and-why-should-i-use-one-38c0'], /* zone Assignment 第 1 条；Dev.to 框架简介 */
        2: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Extensions/Server-side/First_steps/Web_frameworks'] /* zone Assignment 第 2 条；MDN 后端框架概览（A 类 zhUrl） */
      }
    },
    'node-path-nodejs-introduction-to-express': {
      a: {
        1: ['https://expressjs.com/en/api.html'] /* zone Assignment 第 1 条；探索 Express 文档（API 总入口；api 区正文未翻译维持 C 类——jestjs.io 先例）；第 2 条回 Basic Informational Site 项目用 Express 重写为本地动手不接 */
      }
    },
    'nodejs-routes': {
      a: {
        1: ['https://expressjs.com/zh-cn/guide/routing/'] /* zone Assignment 第 1 条；Express 官方 Routing 入门指南（A 类 zhUrl——zh-cn guide 区部分翻译中英混排，判定待用户拍板；en/guide/routing.html 与 5x 版本路径同文合并住 ER 条目） */
      }
    },
    'nodejs-controllers': {
      a: {
        1: ['https://medium.com/@viral_shah/express-middlewares-demystified-f0c2c37ea6a1'], /* zone Assignment 第 1 条；Viral Shah 中间件揭秘文（命令行 403 受限在案、真实浏览器收尾轮复核） */
        2: ['https://www.youtube.com/watch?v=Cgvopu9zg8Y'] /* zone Assignment 第 2 条；PedroTech MVC 模式视频（oEmbed 核验） */
      }
    },
    'nodejs-views': {
      a: {
        1: ['https://ejs.co/'], /* zone 正文引用 + Assignment 第 1 条；EJS 官网（#docs 文档区同页合并住 ER 条目） */
        2: ['https://expressjs.com/zh-cn/guide/using-template-engines/'] /* zone Assignment 第 2 条；Express 模板引擎指南（A 类 zhUrl——示例为 Pug 官方提醒住 ER 条目）；第 3/4 条 about 页与 footer 模板为本地动手不接 */
      }
    },
    'node-path-nodejs-mini-message-board': {
      a: {} /* 显式空映射：Project 课，官方 Assignment 13 条全部本地动手（搭应用 / 两条路由 / 表单 / POST / redirect / 详情页 / push GitHub），官方外链为零、零资料课——shopping-cart 先例同型 */
    },
    'node-path-nodejs-deployment': {
      a: {
        2: ['https://render.com/docs/deploy-node-express-app', 'https://neon.tech/docs/guides/node', 'https://aiven.io/docs/products/postgresql/howto/connect-node'] /* zone Assignment 部署指南之一；「用你所选 PaaS 的部署指南」按官方推荐名单接三份 Node/Express 或 Node 连接专用指南（Render / Neon / Aiven；Railway 无专用指南登记不接）——neon.tech 域名迁移事实住 ER 条目；第 1 条部署本身与供应商主页为本地动手 + 正文推荐名单区不接、第 3 条排障为本课内部小节 */
      }
    },
    'nodejs-forms-and-data-handling': {
      a: {} /* 显式空映射：官方 Assignment 5 条全部本地编码（扩展 User 模型三字段校验 / GET 搜索表单四步），Further Reading 小节四条资源（express-validator 三页 + presidentbeef）在面板内但无编号条目承接、登记资料区不建映射——class-based-components「条目全部本地动手」先例同型 */
    },
    'nodejs-installing-postgresql': {
      a: {
        1: ['https://github.com/TheOdinProject/curriculum/tree/main/nodeJS/express/installation_guides/postgresql/linux.md', 'https://github.com/TheOdinProject/curriculum/tree/main/nodeJS/express/installation_guides/postgresql/macos.md'] /* zone Assignment 第 1 条；官方 curriculum 仓安装指南按操作系统二选一、两份全接（官方指定教材口径登记；tree→blob 收敛事实住 ER 条目） */
      }
    },
    'nodejs-using-postgresql': {
      a: {
        1: ['https://node-postgres.com/'] /* zone Assignment 第 1 条；pg 文档总入口略读（第 2/3 条项目升级为本地动手不接——环境变量 / SQL 搜索 / 留言板持久化的正文引用资料均住资源区） */
      }
    },
    'node-path-nodejs-inventory-application': {
      a: {} /* 显式空映射：Project 课，官方 Assignment 8 条全部本地动手（设计表结构 / 路由控制器 / CRUD 视图 / 表单 / 删除策略 / 灌数据 / 部署），官方外链为零、零资料课——shopping-cart 先例同型 */
    },
    'node-path-nodejs-authentication-basics': {
      a: {
        1: ["https://www.youtube.com/playlist?list=PLYQSCk-qyTW2ewJ05f_GKHtTIzjynDgjK", "https://youtu.be/J1qXK66k1y4?list=PLYQSCk-qyTW2ewJ05f_GKHtTIzjynDgjK", "https://youtu.be/xMEOT9J0IvI?list=PLYQSCk-qyTW2ewJ05f_GKHtTIzjynDgjK", "https://www.npmjs.com/package/connect-pg-simple"],
        2: ["https://github.com/jwalton/passport-api-docs"]
      }
    },
    'node-path-nodejs-members-only': {
      a: {} /* 显式空映射：Project 课，官方 Assignment 10 条全部本地动手（数据模型 / 建库骨架 / 注册校验+bcrypt / 口令入会 / passport 登录 / 权限显示 / Admin 删除 / 验收 / 部署）；第 3 条 custom validator 与第 10 条部署课页分别为跨课合并归 forms 首现、TOP 自有课页——本课合并后零条目，react-components「跨课合并后零条目」先例同型（全站第 2 门） */
    },
    'nodejs-prisma-orm': {
      a: {
        1: ["https://www.prisma.io/docs/v7/prisma-orm/quickstart/postgresql"],
        2: ["https://www.prisma.io/docs/orm/v7", "https://www.prisma.io/docs/orm/v7/prisma-schema/overview", "https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/models", "https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/relations", "https://www.prisma.io/docs/orm/v7/prisma-client/queries/crud", "https://www.prisma.io/docs/orm/v7/prisma-client/using-raw-sql", "https://www.prisma.io/docs/orm/v7/prisma-migrate/getting-started", "https://www.prisma.io/docs/orm/v7/prisma-migrate/understanding-prisma-migrate/mental-model", "https://www.prisma.io/docs/guides/v7/database/data-migration"]
      }
    },
    'nodejs-file-uploader': {
      a: {
        2: ["https://github.com/kleydon/prisma-session-store#readme"],
        3: ["https://github.com/expressjs/multer"],
        6: ["https://cloudinary.com/", "https://supabase.com/docs/guides/storage"]
      }
    },
    'nodejs-api-basics': {
      a: {
        1: ["https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design"],
        2: ["https://www.robinwieruch.de/node-express-server-rest-api/"]
      }
    },
    'nodejs-api-security': {
      a: {
        1: ["https://www.youtube.com/watch?v=7nafaH9SddU"],
        2: ["https://www.youtube.com/watch?v=7Q17ubqLfaM"]
      }
    },
    'node-path-nodejs-blog-api': {
      a: {
        5: ["https://github.com/auth0/node-jsonwebtoken", "https://github.com/mikenicholson/passport-jwt"],
        7: ["https://www.tiny.cloud/docs/tinymce/6/cloud-quick-start/"]
      }
    },
    'nodejs-testing-routes-and-controllers': {
      a: {
        1: ["https://github.com/forwardemail/supertest"],
        2: ["https://forwardemail.github.io/superagent/"]
      }
    },
    'node-path-nodejs-testing-database-operations': {
      a: {
        1: ["https://github.com/brianc/node-postgres/tree/master/packages/pg/test"]
      }
    },
    'nodejs-where-s-waldo-a-photo-tagging-app': {
      a: {} /* 显式空映射：Project 课，官方 Assignment 7 条全部本地动手（白板规划 / 前端瞄准框 / 后端验证+坐标归一化 / 整合标记 / 计时高分榜 / 玩它 / 部署提交）；Where's Wally 维基条目在正文引言区（reference），非 Assignment 条目承接——不建映射 */
    },
    'nodejs-messaging-app': {
      a: {} /* 显式空映射：Project 课，官方 Assignment 4 条全部本地动手（核心功能 / 规划 / 前后端实现+REST 无实时边界 / 部署）；第 4 条「on our Discord」官方原文无 URL（纯文字，非链接），本课零外部资料——无映射可建 */
    },
    'node-path-nodejs-odin-book': {
      a: {
        4: ["https://github.com/faker-js/faker"],
        5: ["https://www.gravatar.com/"],
        6: ["https://cloudinary.com/documentation/node_integration"]
      }
    },
    'nodejs-conclusion': {
      a: {
        1: ["https://expressjs.com/zh-cn/advanced/best-practice-performance.html#cache-request-results"],
        2: ["https://discordapp.com/channels/505093832157691914/505093832157691916"]
      }
    },
    /* ---------- 超长续轮批次 7 阶段 4（2026-09-29，v4.11.36，World 8 求职 14 课、全站 197 课收官）：
     * getting-hired 14 课中 9 课有 Assignment，16 条接链（37 链接）；5 课显式空映射——
     * how-this-course-will-work / it-starts-with-you / conclusion 官方无 Assignment 节
     * （accessible-colors 先例）；building-your-resume 的 4 个工具链接住正文 Introduction、
     * preparing-to-interview-and-interviewing 的 30 个链接分布正文七小节——均无 Assignment
     * 条目可承接（全站第八、九门）。networking 第 1、2 条的 LinkedIn 同页两项按实际引用
     * 均接链（映射按条目走；ER 侧同页合并不影响）。qualify 的 hire-beware 为 TOP 官方
     * 指定阅读材料予以接链（区别于操作目标剔除口径）。全站映射由 349 条 451 链接增至
     * 365 条 488 链接。 ---------- */
    'node-path-getting-hired-how-this-course-will-work': {
      a: {} /* 显式空映射：官方无 Assignment 节（导论课，全文无外链） */
    },
    'node-path-getting-hired-professional-networking': {
      a: {
        1: ["https://www.meetup.com/", "https://www.linkedin.com/"] /* zone Assignment 第 1 条（线下机会子弹：Meetup 与 LinkedIn 两个查本地社区入口；Google 非链接不接） */,
        2: ["https://www.linkedin.com/", "https://www.samanthaming.com/blog/tips-to-optimize-your-linkedin-profile-for-developers/", "https://discord.com/"] /* zone Assignment 第 2 条（虚拟平台子弹：join-the-odin-community 为 TOP 课页回链按口径不接；LinkedIn 优化档案文 + Discord 平台首页；开源子弹无链接） */
      }
    },
    'node-path-getting-hired-strategy': {
      a: {
        1: ["https://web.archive.org/web/20160925155912/http://www.happybearsoftware.com/how-to-get-a-programmer-job.html"] /* zone Assignment 第 1 条；Happy Bear 存档（跨课合并首现课——interview 正文引用不重建） */
      }
    },
    'node-path-getting-hired-it-starts-with-you': {
      a: {} /* 显式空映射：官方无 Assignment 节（自评课，全文无外链；实质任务为完成自评清单，本地动作） */
    },
    'node-path-getting-hired-what-companies-want': {
      a: {
        1: ["http://insights.dice.com/2013-05-31/hiring-software-developers/", "http://lifeofaprogrammanager.blogspot.com/2006/06/how-to-hire-talent.html", "http://www.joelonsoftware.com/articles/FindingGreatDevelopers.html", "http://www.joelonsoftware.com/articles/GuerrillaInterviewing3.html", "http://blog.udacity.com/2013/09/beyond-resume-what-tech-recruiters-want.html"] /* zone Assignment 第 1 条；招聘方视角五篇全接 */,
        2: ["http://ask.metafilter.com/226621/How-do-I-get-a-software-internship", "https://www.wayup.com/s/internships/it/"] /* zone Assignment 第 2 条；实习两条全接 */
      }
    },
    'node-path-getting-hired-what-you-can-do-to-prepare': {
      a: {
        1: ["https://web.archive.org/web/20190822194330/https://hbr.org/2013/04/how-to-explain-your-career-tra"] /* zone Assignment 第 1 条；Dorie Clark 转型文（存档） */,
        2: ["https://blog.codinghorror.com/a-programmers-portfolio/", "http://grokcode.com/58/the-power-of-a-programming-portfolio/", "http://www.forbes.com/sites/anthonykosner/2012-10-20/software-engineers-are-in-demand-and-github-is-how-you-find-them/"] /* zone Assignment 第 2 条；GitHub 重要性三篇全接 */,
        3: ["http://brandyourself.com", "https://web.archive.org/web/20201123201302/https://www.monster.com/career-advice/article/control-your-online-reputation", "http://programmers.stackexchange.com/questions/143673/how-important-is-it-for-a-programmer-to-have-an-online-presence", "https://medium.com/pramp/how-to-build-your-digital-presence-as-a-software-developer-cb61c4c1aab"] /* zone Assignment 第 3 条；个人品牌四篇全接 */,
        4: ["https://fs.blog/how-to-win-friends-and-influence-people/"] /* zone Assignment 第 4 条；《人性的弱点》书籍摘要 */
      }
    },
    'node-path-getting-hired-building-your-personal-website': {
      a: {
        1: ["http://www.forbes.com/sites/jacquelynsmith/2013-04-26/why-every-job-seeker-should-have-a-personal-website-and-what-it-should-include/"] /* zone Assignment 第 1 条；Forbes 个人网站文 */,
        2: ["http://www.writethedocs.org/guide/writing/beginners-guide-to-docs/"] /* zone Assignment 第 2 条；Write the Docs 文档指南（Show designs 17 站住正文，reference 不接映射） */
      }
    },
    'node-path-getting-hired-collecting-job-leads': {
      a: {
        1: ["http://www.authenticjobs.com", "http://cwjobs.co.uk", "http://www.whitetruffle.com", "http://www.dice.com", "http://coderwall.com", "https://underdog.io/", "https://www.workatastartup.com/", "https://talent.hubstaff.com/", "https://wellfound.com/jobs"] /* zone Assignment 第 1 条；九个招聘板全接 */
      }
    },
    'node-path-getting-hired-qualifying-job-leads': {
      a: {
        1: ["https://github.com/TheOdinProject/blog/blob/main/hire-beware.md"] /* zone Assignment 第 1 条；TOP 官方博客《Hire Beware》——官方指定阅读材料（非操作目标），予以接链 */
      }
    },
    'node-path-getting-hired-building-your-resume': {
      a: {} /* 显式空映射：官方无 Assignment 节——4 个简历工具链接住正文 Introduction、Optional reading 的 Joel 1 链接，均按正文链接口径登记资料、无 Assignment 条目可承接（全站第八门） */
    },
    'node-path-getting-hired-applying-for-web-development-jobs': {
      a: {
        1: ["https://www.themuse.com/advice/want-to-work-for-a-startup-heres-how-to-get-noticed"] /* zone Assignment 第 1 条；The Muse 创业公司侧门文 */
      }
    },
    'node-path-getting-hired-preparing-to-interview-and-interviewing': {
      a: {} /* 显式空映射：官方无 Assignment 节——30 个链接分布正文七小节（phone screen / Links / Coding test questions / Algorithms training / Architecture / compensation），全部按正文链接口径登记资料、无 Assignment 条目可承接（全站第九门） */
    },
    'node-path-getting-hired-handling-a-job-offer': {
      a: {
        1: ["https://haseebq.com/my-ten-rules-for-negotiating-a-job-offer/"] /* zone Assignment 第 1 条；谈判十规则 */,
        2: ["https://web.archive.org/web/20180626035838/http://rob.by/2013/negotiating-your-startup-job-offer/"] /* zone Assignment 第 2 条；Rob.by 股权谈判（存档） */
      }
    },
    'node-path-getting-hired-conclusion': {
      a: {} /* 显式空映射：官方无 Assignment 节（结语祝贺信）——正文仅 Discord 邀请与课程反馈表两链接，均按既有口径剔除；全站第十二门零资料课（第十门 hasAssignment:false） */
    }
  }
};
