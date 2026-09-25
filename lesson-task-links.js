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
 * 覆盖率（v4.11.20 第九批复核，46 课全开）：Assignment 159 条中 76 条接链（共 117 个链接）；
 * 其余为本地动作 / 纯练习 / 正文区资源。
 * lists 与 recipes 两课为 0：lists 的两条资源都是正文小节（MDN ul/ol），任务本身是
 * 动手建列表；recipes 是 Project 课，任务全部是本地动手操作。
 * v4.11.17 新开放的第 21–23 课、v4.11.18 新开放的第 24–25 课各条目全部接链
 * （任务本身就是「读某页 / 做某组练习」）。 */
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
    }
  }
};
