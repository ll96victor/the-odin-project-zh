/* lesson-task-links.js — 课页任务条目 → 外部资料的内联链接映射（纯数据文件，零依赖）。
 *
 * 为什么单独一个文件：任务条目文本在 lessons.js（红线数据文件，不得改动），
 * 外部资料清单在 external-resources.js；「哪条任务对应哪份资料」是第三份信息，
 * 沿用 diagrams.js 的做法单独存放，app.js 只读取并渲染。
 *
 * 映射依据（v4.11.2 C 项，2026-09-18）：
 *   1. external-resources.js 每条资源的 zone 字段（官方原文中的出现位置）；
 *   2. 官方 curriculum raw Markdown 原文逐条对照——所用 11 课原文的 sha256 与
 *      sources.json 记录全部一致（官方内容与本站数据同源，映射有事实依据）。
 *   3. zone 的「Assignment 第 N 条」是**官方编号**，与本站中文化重述的条目号
 *      不一定相同（如 text-editors 官方第 1 条同时含安装指南与 VSCode 文档，
 *      本站拆成 A1/A2）。因此所有映射都按条目语义逐条人工核对，不按编号硬套。
 *
 * 结构：links[lessonId].a = Assignment 映射，.k = Knowledge Check 映射；
 * 键为 1-based 条目号 / 题号（与 lessons.js 的 official.assignment /
 * official.knowledgeCheck 渲染顺序一致），值为最终 href 数组。
 *
 * href 取值规则：
 *   · 资源有已核验官方中文版（zhUrl）→ 用中文版地址（与本站「中文自足」口径一致）；
 *   · 否则用资源清单里的 originalUrl；
 *   · 少数长页面沿用官方 KC 的原锚点（softcover 各命令小节、cbea.ms 的
 *     #intro / #limit-50、internetingishard 的 #image-formats、brytdesigns 的
 *     #What_is_HTML、SWC 03-create 的 #create-a-text-file），方便直达对应小节。
 *   · 所有地址都取自本站 external-resources.js（originalUrl / zhUrl），
 *     不出现清单之外的第三方地址（测试按「去锚点后属于本课资源」钉住）。
 *
 * 纪律：宁可少接，不可接错。以下情形一律不接、保持纯文本：
 *   · 本地动作条目（终端命令、GitHub 界面操作、动手练习）——本就无外链；
 *   · zone 为「正文 XX 小节」的资源——属于正文语境，不是任务要求；
 *   · 官方 KC 的页内锚点题（指向原课自身章节，不是外部资源）；
 *   · 无法从官方原文确认题号对应关系的 KC。
 *
 * 覆盖率（本轮核对结论）：Assignment 108 条中 46 条接链（共 55 个链接）；
 * Knowledge Check 96 题中 31 题接链；其余为本地动作 / 纯练习 / 正文区资源。
 * lists 一课为 0：两条资源都是正文小节（MDN ul/ol），任务本身是动手建列表。 */
window.ODIN_TASK_LINKS = {
  version: 1,
  links: {
    'how-this-course-will-work': {
      a: {
        1: ['https://www.theodinproject.com/about'], /* zone 第1条；A1「阅读 About 页面」，卡内有本站精译 */
        2: ['https://www.theodinproject.com/faq']    /* zone 第2条；A2「浏览 FAQ」，卡内有本站精译 */
      },
      k: {} /* 官方 KC 两题无外部链接 */
    },
    'introduction-to-web-development': {
      a: {
        1: ['https://dev.to/theodinproject/why-learning-to-code-is-so-damn-hard-11nn'], /* zone 第1条；A1 */
        2: ['https://www.udacity.com/blog/2020/12/front-end-vs-back-end-vs-full-stack-web-developers.html'] /* zone 第2条；A2 */
      },
      k: {}
    },
    'motivation-and-mindset': {
      a: {
        1: ['https://dev.to/theodinproject/becoming-a-top-success-story-mindset-3dp2'], /* zone 第1条；A1 */
        2: ['https://discord.com/channels/505093832157691914/1089990025162260570'] /* zone 第2条（官方写明加入 Discord 之后）；A2 */
      },
      k: {}
    },
    'asking-for-help': {
      a: {
        1: ['https://dontasktoask.com/'], /* zone 第1条；A1 */
        2: ['https://xyproblem.info/'],   /* zone 第2条；A2 */
        3: ['https://www.theodinproject.com/guides/community/how_to_ask'] /* zone 第3条；A3，卡内有本站精译 */
      },
      k: {}
    },
    'join-the-odin-community': {
      a: {
        1: ['https://github.com/join'],  /* zone 第1条；A1「创建 GitHub 账号」（官方给注册入口） */
        2: ['https://discord.gg/fbFCkYabZB'] /* zone 第2条；A2「登录 Discord」邀请链接 */
      },
      k: {} /* A4 的 rules/faq 是 TOP 自有页面，不在资源清单 */
    },
    'how-does-the-web-work': {
      a: {
        1: ['https://www.youtube.com/watch?v=eHp1l73ztB8'], /* zone 第1条；A1 BBC 短片 */
        2: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work'], /* zone 第2条；A2 MDN 文章（已核验中文版） */
        3: ['https://www.youtube.com/watch?v=7_LPdttKXPc'], /* zone 第3条；A3 五分钟视频 */
        4: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Getting_started/Environment_setup/Browsing_the_web'], /* zone 第4条；A4（中文版） */
        5: ['https://www.youtube.com/watch?v=BrXPcaRlBqo', 'https://www.whatsmybrowser.org/'], /* zone 第5条前半/后半；A5 */
        6: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works', 'https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_domain_name', 'https://www.youtube.com/watch?v=72snZctFFtA'] /* zone 第6条前半/后半/替代视频；A6（前两篇用中文版） */
      },
      k: {
        /* 官方 KC 15 题全部是「题目即链接」形式，逐题从官方原文抄录对应资源
         * （原文 URL 是重定向变体 / 带参形式，这里统一映射到本站资源清单地址）。 */
        1: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Getting_started/Environment_setup/Browsing_the_web'],
        2: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work'],
        3: ['https://www.youtube.com/watch?v=7_LPdttKXPc'],
        4: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work'],
        5: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work'],
        6: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work'],
        7: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works'],
        8: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works'],
        9: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works'],
        10: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Getting_started/Environment_setup/Browsing_the_web'],
        11: ['https://www.youtube.com/watch?v=BrXPcaRlBqo'],
        12: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Getting_started/Environment_setup/Browsing_the_web'],
        13: ['https://www.youtube.com/watch?v=72snZctFFtA'],
        14: ['https://www.whatsmybrowser.org/'],
        15: ['https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Getting_started/Environment_setup/Browsing_the_web']
      }
    },
    installations: {
      a: {
        2: ['https://ubuntu.com/desktop/flavours'], /* zone「正文开头与 Assignment 各出现一次」；官方 Assignment 第1条警告框内，本站 A2 重述该警告 */
        4: ['https://zh.wikipedia.org/zh-cn/Usage_share_of_web_browsers'], /* zone「正文与 Assignment 各出现一次」；官方第2条 usage share，本站 A4（中文版） */
        5: ['https://support.google.com/chrome/answer/157179?hl=zh-CN&co=GENIE.Platform%3DDesktop#zippy=%2Ctab-window-shortcuts'] /* zone「Assignment（Chrome 小节）」官方 tip 框；本站 A5（中文版） */
      },
      k: {}
      /* A1/A3 的四份安装指南与 Chrome 安装分支是 TOP 自有页面，不在资源清单，不接 */
    },
    'text-editors': {
      a: {
        /* 官方第 1 条同时含安装指南（TOP 自有）与 VSCode 文档，本站拆成 A1/A2；
           官方第 2 条是教学视频 = 本站 A3。zone 的编号因此与本站条目号错位，按语义映射。 */
        2: ['https://code.visualstudio.com/docs'], /* A2「查 VSCode 官方文档」 */
        3: ['https://youtu.be/ORrELERGIHs']        /* A3「VSCode Tutorial for Beginners 视频」 */
      },
      k: {} /* A4 关 Copilot、A5 回看第3课均无外部资源 */
    },
    'command-line-basics': {
      a: {
        /* 官方第 1 条 = 本站 A3（前面两条警告在本站是 A1/A2），编号错位按语义映射 */
        3: ['https://swcarpentry.github.io/shell-novice/'], /* A3 SWC 课程总入口；四节子链接在下方资源卡（均带本站精译），不在条目里堆五个链接 */
        4: ['https://swcarpentry.github.io/shell-novice/data/shell-lesson-data.zip'] /* zone「Assignment（WSL2 说明中给出下载命令）」；A4 正是该说明 */
      },
      k: {
        /* 官方 KC 逐题带链接（原文抄录）：K1/K2 是页内锚点不接；
           K3–K8、K10、K11 → softcover《Unix 命令基础》各小节（保留官方锚点）；
           K9 → SWC 03-create 的 create-a-text-file 小节。 */
        3: ['https://www.softcover.io/read/fc6c09de/unix_commands/basics#sec-basics-cd'],
        4: ['https://www.softcover.io/read/fc6c09de/unix_commands/basics#uid31'],
        5: ['https://www.softcover.io/read/fc6c09de/unix_commands/basics#uid30'],
        6: ['https://www.softcover.io/read/fc6c09de/unix_commands/basics#sec-basics-pwd'],
        7: ['https://www.softcover.io/read/fc6c09de/unix_commands/basics#sec-basics-ls'],
        8: ['https://www.softcover.io/read/fc6c09de/unix_commands/basics#cid7'],
        9: ['https://swcarpentry.github.io/shell-novice/03-create.html#create-a-text-file'],
        10: ['https://www.softcover.io/read/fc6c09de/unix_commands/basics#cid9'],
        11: ['https://www.softcover.io/read/fc6c09de/unix_commands/basics#cid10']
      }
    },
    'setting-up-git': {
      a: {
        /* 官方 Configure Git and GitHub 各步与本站 A2–A16 的重述粒度不同，按语义映射 */
        3: ['https://github.com/settings/emails'], /* zone 第1条（创建账号时的隐私设置）；A3「Email Settings 页面勾选两个复选框」 */
        5: ['https://docs.github.com/zh/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication#configuring-two-factor-authentication-using-a-totp-app', 'https://support.google.com/accounts/answer/1066447?hl=zh-CN'], /* zone（账号安全步骤）（2FA 步骤中）；A5 启用 2FA + Google Authenticator（中文版） */
        14: ['http://www.linfo.org/cat.html'], /* zone（配置 SSH 步骤中）；A14「用 cat 读取公钥」 */
        15: ['https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection?platform=linux', 'https://docs.github.com/zh/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints'] /* zone（SSH 配置最后一步）（SSH 测试步骤中）；A15 测试连接 + 指纹比对（中文版） */
      },
      k: {} /* 其余条目全部是本地 git config / ssh-keygen 等动手操作，无外链 */
    },
    'introduction-to-git': {
      a: {
        1: ['https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%85%B3%E4%BA%8E%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6'], /* zone 第1条；A1 Pro Git 1.1–1.4（已核验中文版） */
        2: ['https://www.youtube.com/watch?v=2ReR1YJrNOM'], /* zone 第2条；A2 What is Git 视频 */
        3: ['https://docs.github.com/zh/get-started/start-your-journey/about-github-and-git'], /* zone 第3条；A3 About GitHub and Git（中文版） */
        5: ['https://github.com/TheOdinProject/curriculum', 'https://github.com/TheOdinProject/curriculum/graphs/contributors'] /* zone 记作第4条前半/后半，官方原文实为第 5 条；A5「看课程仓库与 contributors」。A4 是站内课程跳转，非外部资源，不接 */
      },
      k: {
        /* 官方 KC：K1–K4 是页内锚点不接；K5 → 视频，K6 → About GitHub and Git（原文抄录） */
        5: ['https://www.youtube.com/watch?v=2ReR1YJrNOM'],
        6: ['https://docs.github.com/zh/get-started/start-your-journey/about-github-and-git']
      }
    },
    'git-basics': {
      a: {
        1: ['https://github.com/github/renaming'], /* 官方 Assignment「Before you start」列项原文含此链接；本站 A1 重述了该列项（zone 记为正文 Git 术语小节，官方 Assignment 亦出现） */
        17: ['https://docs.github.com/zh/get-started/git-basics/managing-remote-repositories?platform=linux#switching-remote-urls-from-https-to-ssh'] /* zone（git push 步骤的排错说明中）；A17 的 NOTE 正是切换 HTTPS→SSH（中文版） */
      },
      k: {} /* 22 条中其余全部是终端命令与 GitHub 界面操作；A19/A20 的 Cheatsheet 与 best practices 是 TOP 自有页面，不在资源清单 */
    },
    'introduction-to-html-and-css': {
      a: {
        1: ['https://www.youtube.com/watch?v=gT0Lh1eYk78'] /* zone 第1条；A1 */
      },
      k: {
        /* 官方 KC 四题中两题链接到 Bryt Designs 文章（K1 带 #What_is_HTML 锚点，原文抄录）；K2/K3 是页内锚点不接 */
        1: ['https://brytdesigns.com/html-css-javascript-whats-the-difference/#What_is_HTML'],
        4: ['https://brytdesigns.com/html-css-javascript-whats-the-difference/']
      }
    },
    'elements-and-tags': {
      a: {
        1: ['https://www.youtube.com/watch?v=X4sClFRMJ00'] /* zone 第1条；A1（本课唯一 Assignment） */
      },
      k: {}
    },
    'html-boilerplate': {
      a: {
        1: ['https://www.youtube.com/watch?v=V8UAEoOvqFg'], /* zone 第1条；A1 跟做视频 */
        2: ['https://validator.w3.org/#validate_by_input']  /* zone 第2条；A2 W3C 校验器 */
      },
      k: {}
    },
    'working-with-text': {
      a: {
        1: ['https://www.youtube.com/watch?v=yqcd-XkxZNM'], /* zone 第1条；A1 */
        2: ['https://www.youtube.com/watch?v=gW6cBZLUk6M'], /* zone 第2条；A2 */
        4: ['https://zh.wikipedia.org/zh-cn/Lorem_ipsum'] /* zone 第3条（练习任务中）：官方第 3 条同时含建页任务与 Lorem 办法，本站拆为 A3/A4，Lorem 链接按语义归 A4（中文版）；A3 纯动手不接 */
      },
      k: {}
    },
    lists: {
      a: {}, /* 两条资源都是正文小节（MDN ul/ol），三条任务全部是动手建列表，无外链可接 */
      k: {}
    },
    'links-and-images': {
      a: {
        1: ['https://www.youtube.com/watch?v=tsEQgGjSmkM', 'https://www.youtube.com/watch?v=0xoztJCHpbQ', 'https://www.youtube.com/watch?v=ta3Oxx7Yqbo'], /* zone（视频列表第 1/2/3 项）；A1「观看三个视频」 */
        2: ['https://internetingishard.netlify.app/html-and-css/links-and-images'], /* zone（并有一题 KC 指向其 #image-formats）；A2「阅读并跟做」 */
        3: ['https://unsplash.com/photos/Mv9hjnEUHR4/download?force=true&w=640'] /* zone「Assignment 两处（下载练习图片/下载这只狗的图库图片）」：官方在正文演练的分步编号列表里给出下载链接，本站 A3 重述了这些动手步骤（含把 dog.jpg 放进 images 目录），按语义归 A3 */
      },
      k: {
        9: ['https://internetingishard.netlify.app/html-and-css/links-and-images/#image-formats'] /* 官方 KC 仅此一题带外链（原文抄录，含锚点）；其余八题是页内锚点不接 */
      }
    },
    'commit-messages': {
      a: {
        1: ['https://cbea.ms/git-commit'], /* zone（KC 两题分别指向 #intro 与 #limit-50）；A1 */
        2: ['https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker'] /* zone 补充说明（官方 Tips 小节）；A2「拼写检查扩展」 */
      },
      k: {
        1: ['https://cbea.ms/git-commit/#intro'],    /* 官方 KC 原文锚点 */
        2: ['https://cbea.ms/git-commit/#limit-50']  /* 官方 KC 原文锚点 */
      }
    }
  }
};
