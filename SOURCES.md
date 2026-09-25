# 来源与任务核对

核对日期：第 01–19 课为 2026-09-09；第 20 课（Project: Recipes）为 2026-09-23；第 21–30 课为 2026-09-24。事实优先级：当前官方线上课程目录及 lesson 正文。再读取 lesson 的 Edit on GitHub 所指向的官方 Markdown 交叉核对；没有采用非官方中文教程替换课程。

- [Foundations 官方目录](https://www.theodinproject.com/paths/foundations/courses/foundations)
- [官方课程源仓库](https://github.com/TheOdinProject/curriculum)
- v4.11.20 第九批起 Foundations **46 课全部收录**，`excludedBoundary` 置空——不再有排除边界（此前边界随开放逐课推进，最后一个是 Choose Your Path Forward）。第 20 课 [Project: Recipes](https://www.theodinproject.com/lessons/foundations-recipes) 已于 2026-09-23 收录（v4.11.16）、第 21–23 课（[Intro to CSS](https://www.theodinproject.com/lessons/foundations-intro-to-css) / [The Cascade](https://www.theodinproject.com/lessons/foundations-the-cascade) / [Inspecting HTML and CSS](https://www.theodinproject.com/lessons/foundations-inspecting-html-and-css)）与第 24–25 课（[The Box Model](https://www.theodinproject.com/lessons/foundations-the-box-model) / [Block and Inline](https://www.theodinproject.com/lessons/foundations-block-and-inline)）已于 2026-09-24 按「逐课开放」规则收录（v4.11.17 / v4.11.18）——CSS Foundations 单元官方 5 课本站已全部开放；第 26–30 课（[Introduction to Flexbox](https://www.theodinproject.com/lessons/foundations-introduction-to-flexbox) / [Growing and Shrinking](https://www.theodinproject.com/lessons/foundations-growing-and-shrinking) / [Axes](https://www.theodinproject.com/lessons/foundations-axes) / [Alignment](https://www.theodinproject.com/lessons/foundations-alignment) / [Project: Landing Page](https://www.theodinproject.com/lessons/foundations-landing-page)）已于同日按同一规则收录（v4.11.19 三批，Flexbox 组 5/5 全组收口）；第 31–33 课（[Variables and Operators](https://www.theodinproject.com/lessons/foundations-variables-and-operators) / [Installing Node.js](https://www.theodinproject.com/lessons/foundations-installing-node-js) / [Data Types and Conditionals](https://www.theodinproject.com/lessons/foundations-data-types-and-conditionals)）已于 2026-09-25 收录（v4.11.20，JavaScript Basics 起步 3/15）；第 34–37 课（[JavaScript Developer Tools](https://www.theodinproject.com/lessons/foundations-javascript-developer-tools) / [Function Basics](https://www.theodinproject.com/lessons/foundations-function-basics) / [Problem Solving](https://www.theodinproject.com/lessons/foundations-problem-solving) / [Understanding Errors](https://www.theodinproject.com/lessons/foundations-understanding-errors)）已于同日第二批收录（JavaScript Basics 7/15）；第 38 课 [Project: Rock Paper Scissors](https://www.theodinproject.com/lessons/foundations-rock-paper-scissors) 已于同日第三批收录（v4.11.20，JavaScript Basics 8/15，Project 红线课）；第 39–40 课（[Clean Code](https://www.theodinproject.com/lessons/foundations-clean-code) / [Loops and Arrays](https://www.theodinproject.com/lessons/foundations-loops-and-arrays)）已于同日第四批收录（v4.11.20，JavaScript Basics 10/15）；第 41–42 课（[DOM Manipulation and Events](https://www.theodinproject.com/lessons/foundations-dom-manipulation-and-events)（注意官方文件名是大写 DOM） / [Revisiting Rock Paper Scissors](https://www.theodinproject.com/lessons/foundations-revisiting-rock-paper-scissors)）已于同日第五批收录（v4.11.20，JavaScript Basics 12/15）；第 43 课 [Project: Etch-a-Sketch](https://www.theodinproject.com/lessons/foundations-etch-a-sketch)（官方文件为 project_etch_a_sketch.md，注意 project_ 前缀）已于同日第六批收录（v4.11.20，JavaScript Basics 13/15，Project 红线课）；第 44 课 [Object Basics](https://www.theodinproject.com/lessons/foundations-object-basics) 已于同日第七批收录（v4.11.20，JavaScript Basics 14/15）；第 45 课 [Project: Calculator](https://www.theodinproject.com/lessons/foundations-calculator)（官方文件为 project_calculator.md，注意 project_ 前缀）已于同日第八批收录（v4.11.20，JavaScript Basics 15/15 全组开放，Project 红线课）。
- 每课原文 URL、英文标题、官方 Markdown URL 和此次读取的 SHA-256 记录在 `sources.json`。

## 逐课覆盖

下表记录复核重点，不替代每课完整 Assignment。46 课中 45 课有 Assignment（课 26 的 Assignment 仅一句无作业声明），均提供直达入口；第 46 课 Choose Your Path Forward 是官方唯一的无 Assignment 课（结语课，官方文件顶部声明结构豁免）。
官方于 2026-09-23 把全部课程的课末自查题一节整体移除（PR #31412，只删不补），
**本站同步下线**：已开放课程一律不再收录官方自查题，`sources.json` 的 `hasKnowledgeCheck` 全为 false，
课页不再渲染自查题区块（详见 [MAINTENANCE.md](MAINTENANCE.md) 的 v4.11.17 条目与 `answers/` 实施记录）。

| 顺序 | 官方课名与链接 | 导读保留的任务及关键边界 |
| --- | --- | --- |
| 01 | [How This Course Will Work](https://www.theodinproject.com/lessons/foundations-how-this-course-will-work) | About、FAQ；不跳课；指定外链是正课；补充资料才可选 |
| 02 | [Introduction to Web Development](https://www.theodinproject.com/lessons/foundations-introduction-to-web-development) | 创始人的学习难度文章；Udacity 的前端/后端/全栈文章 |
| 03 | [Motivation and Mindset](https://www.theodinproject.com/lessons/foundations-motivation-and-mindset) | TOP Success Story 文章；加入 Discord 后读 Success Stories；保留 AI 学习限制和自主节奏 |
| 04 | [Asking For Help](https://www.theodinproject.com/lessons/foundations-asking-for-help) | Don’t ask to ask、XY Problem、阅读并收藏技术提问指南 |
| 05 | [Join the Odin Community](https://www.theodinproject.com/lessons/foundations-join-the-odin-community) | 创建 GitHub、加入 Discord、打招呼、规则与 FAQ；GitHub 关联资料可选 |
| 06 | [How Does the Web Work?](https://www.theodinproject.com/lessons/foundations-how-does-the-web-work) | 六组官方 Assignment 全覆盖，含查看当前浏览器和版本；DNS 视频可替代指定 DNS 阅读 |
| 07 | [Installations](https://www.theodinproject.com/lessons/foundations-installations) | 受支持系统/设备、单选安装分支、Chrome；macOS 或受支持 Ubuntu + Chrome 就绪时可跳过 |
| 08 | [Text Editors](https://www.theodinproject.com/lessons/foundations-text-editors) | 按系统安装 VS Code、观察视频而非强制跟写、Disable AI Features |
| 09 | [Command Line Basics](https://www.theodinproject.com/lessons/foundations-command-line-basics) | 正文终端试用、Mac code 配置、Download files + 三个 Shell 课、两组文件练习、WSL2 例外 |
| 10 | [Setting up Git](https://www.theodinproject.com/lessons/foundations-setting-up-git) | 安装、邮箱隐私、身份/main、Mac .DS_Store、先查密钥、上传公钥、核指纹和 SSH 测试；2FA 可选 |
| 11 | [Introduction to Git](https://www.theodinproject.com/lessons/foundations-introduction-to-git) | Pro Git 1.1–1.4、视频、GitHub/Git 介绍、TOP 仓库及贡献者；可跳过文章末尾指定小节 |
| 12 | [Git Basics](https://www.theodinproject.com/lessons/foundations-git-basics) | 检查版本、git_test + README、SSH 克隆、两轮修改提交、push、网页核对、最佳实践、配置提交编辑器 |
| 13 | [Introduction to HTML and CSS](https://www.theodinproject.com/lessons/foundations-introduction-to-html-and-css) | 原有四分钟概览视频；只介绍分工，不扩展后续内容 |
| 14 | [Elements and Tags](https://www.theodinproject.com/lessons/foundations-elements-and-tags) | 标签、元素、空元素；Kevin Powell 指定视频 |
| 15 | [HTML Boilerplate](https://www.theodinproject.com/lessons/foundations-html-boilerplate) | 跟做正文、打开并刷新文件、! 快捷方式、跟做视频、W3 validator |
| 16 | [Working with Text](https://www.theodinproject.com/lessons/foundations-working-with-text) | 两个指定视频、自写简单博客文章，使用标题/段落/粗斜体；不提供成品 |
| 17 | [Lists](https://www.theodinproject.com/lessons/foundations-lists) | 四份指定列表：食物、今日待办、想去的地方、五个最喜欢的游戏或电影 |
| 18 | [Links and Images](https://www.theodinproject.com/lessons/foundations-links-and-images) | 正文准备及路径练习、dog.jpg、alt/width/height、三个视频、跟做外部文章和四种格式 |
| 19 | [Commit Messages](https://www.theodinproject.com/lessons/foundations-commit-messages) | 指定文章七条规则；正文的多行说明与提交时机；不增设作业或 Recipes 答案 |
| 20 | [Project: Recipes](https://www.theodinproject.com/lessons/foundations-recipes) | 仓库准备四步与两个官方警告；四轮迭代要求完整中文化；提交节奏；GitHub Pages 发布按官方列为可选；社区提交三提醒与 Learning Code 文章；**不提供成品代码**（examples 为空数组，课页不渲染「代码示例」节） |
| 21 | [Intro to CSS](https://www.theodinproject.com/lessons/foundations-intro-to-css) | 三种加 CSS 方式、规则语法、七类选择器、起步属性；CSS exercises 仓库 01–05 练习 |
| 22 | [The Cascade](https://www.theodinproject.com/lessons/foundations-the-cascade) | 层叠判定顺序与特异性；交互式层叠讲解与本课练习 |
| 23 | [Inspecting HTML and CSS](https://www.theodinproject.com/lessons/foundations-inspecting-html-and-css) | DevTools 四节指定阅读（overview / open / DOM / CSS）；Elements 与 Styles 两面板动手 |
| 24 | [The Box Model](https://www.theodinproject.com/lessons/foundations-the-box-model) | 一切皆矩形盒、四层结构、占位计算与 border-box、margin auto 与坍缩；两个视频 + MDN + CSS-Tricks |
| 25 | [Block and Inline](https://www.theodinproject.com/lessons/foundations-block-and-inline) | Normal flow、block / inline / inline-block、div 与 span；block-and-inline 两练习 + 给 Recipes 页加 CSS |

同时读取并核对了用户适用的 macOS 分支：[Chrome 安装](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/chrome/macos.md)、[VS Code 安装](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/text_editors/macos.md)、[Git / Homebrew 设置](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/git/macos.md)。具体安装步骤仍回原指南执行。

## 可选项与编辑处理

1. 本次 30 课的线上正文与 Markdown 都未单列 Additional Resources。首页及每课说明它是补充栏目，不凭空增加补充阅读。
2. 明确保留 Optional：Discord 资料关联 GitHub、GitHub 2FA。DNS 视频属于替代阅读，不是额外必做。Introduction to Git 允许跳过指定文章的 Where do I start?。
3. 第 3 课的 Discord 阅读遵照原文“加入后”条件执行，在第 5 课提示回补；课程顺序没有重排。
4. 安装与 Git 命令放在官方原课，不复制一套可能过期或覆盖用户现有设置的安装脚本；中文列出全部重要步骤、系统分支与注意事项。
5. [Commit Messages 正文](https://www.theodinproject.com/lessons/foundations-commit-messages)建议标题不超过 72 字符；[指定文章](https://cbea.ms/git-commit)建议约 50 字符。导读保留两种口径，不把建议描述成 Git 命令自身的硬限制。
6. [Links and Images 指定文章](https://internetingishard.netlify.app/html-and-css/links-and-images/)的尺寸建议与 TOP 不同；导读明确遵循 TOP 添加 width / height 属性的要求。
7. 自测是本站新编中文理解题，答案不包含完整课程练习或项目实现。自测不是官方试题，也不替代官方课程要求。
8. 术语保留英文，安装、删除与密钥操作提示保留数据保护边界。编写过程没有替学习者执行课程的安装、注册、发言或练习。

## 复核方式与限制

`tests/check_links.py` 实际读取官方目录和全部 30 课，检查顺序、标题、成功响应、锚点（每课必有 Assignment 锚点；`knowledge-check` 锚点已于 2026-09-23 被官方移除，脚本把它改成**反向断言**——官方页若重新出现该锚点即先红，逼人复核是否跟随恢复）以及是否新增补充栏目。`tests/content.test.cjs` 保护课序、来源、每课结构及容易遗漏的指定实践。逐项对照上述原文检查每条任务的含义。

测试不保证官方未来不变，也没有逐一验证第三方视频播放、Discord 加入、账户登录或学习者电脑的安装结果。页面中的“核对日期”是明确的内容快照日期，不能理解为自动实时更新。

## 自研内容与逐课核验记录（2026-09-09；第 20 课 2026-09-23；第 21–30 课 2026-09-24）

前 19 课（Recipes 之前）、第 20 课 Project: Recipes、第 21–25 课（CSS Foundations 五课）、第 26–30 课（Flexbox 五课，含 Project: Landing Page）与第 31–45 课（JavaScript Basics 十五课，含三门 Project）、第 46 课（Conclusion 结语课 Choose Your Path Forward，官方无 Assignment）的中文讲解，均由本站对照 TOP 官方课程 Markdown 从零编写简体中文（路线 A：纯自研），未借用、未改编、未翻译 odin-notes-tw 或任何其他第三方中文课程内容。当前版本已无第一版薄导读课。

核验方法：拉取官方 raw Markdown → 重算 SHA-256 与 `sources.json` 记录指纹比对 → 逐段对照官方原文核对技术表述、代码/命令示例，以及 Assignment / Exercise / Optional 条目。

2026-09-24 全量复核：官方于 2026-09-23 移除全部课末自查题一节。复核用的是
「取该变更前的 commit `7a32f72e`，剥掉该节段落与随之失效的 `<span id>` 锚点壳，
与当前 `main` 逐行比对」——20 课全部零剩余差异，证明官方除该节（及其锚点壳）外
**未改动本站所依据的任何正文**；第 19 课另有一次 2026-09-19 的官方节序调整
（PR #31389，纯位置移动、文字未变）一并复核。20 课指纹已按当前 `main` 刷新。

| 课 | 官方 Markdown（curriculum 仓库路径） | sha256 比对结果 | 逐课核验日期 |
| --- | --- | --- | --- |
| 01 | `foundations/introduction/how_this_course_will_work.md` | 指纹未变（67d649b1…1ec73e） | 2026-09-09 |
| 02 | `foundations/introduction/introduction_to_web_development.md` | 指纹未变（15516fb4…c030e5） | 2026-09-09 |
| 03 | `foundations/introduction/motivation_and_mindset.md` | 指纹未变（b823d2d5…d137b8） | 2026-09-09 |
| 04 | `foundations/introduction/asking_for_help.md` | 指纹未变（b9363e0d…ca7b95） | 2026-09-09 |
| 05 | `foundations/introduction/join_the_odin_community.md` | 指纹未变（21ec5016…2f3170） | 2026-09-09 |
| 06 | `foundations/installations/how_does_the_web_work.md` | 指纹未变（a2b61415…a36e6d） | 2026-09-09 |
| 07 | `foundations/installations/installations.md` | 指纹未变（498a87c8…e7355e） | 2026-09-09 |
| 08 | `foundations/installations/text_editors.md` | 指纹未变（f310ff09…b18fd0） | 2026-09-09 |
| 09 | `foundations/installations/command_line_basics.md` | 指纹未变（b55c2407…14431a） | 2026-09-09 |
| 10 | `foundations/installations/setting_up_git.md` | 指纹未变（d58a50f5…64cb56） | 2026-09-09 |
| 11 | `git/foundations_git/introduction_to_git.md` | 指纹未变（c8294bd3…6fc847） | 2026-09-09 |
| 12 | `git/foundations_git/git_basics.md` | 指纹未变（f0799bae…af8712） | 2026-09-09 |
| 13 | `foundations/html_css/html_foundations/intro_to_html_css.md` | 指纹未变（5b4fed2b…91a0be） | 2026-09-09 |
| 14 | `foundations/html_css/html_foundations/elements_and_tags.md` | 指纹未变（043a63a0…762190） | 2026-09-09 |
| 15 | `foundations/html_css/html_foundations/html_boilerplate.md` | 指纹未变（aca920f0…01dd23） | 2026-09-09 |
| 16 | `foundations/html_css/html_foundations/working_with_text.md` | 指纹未变（0fc721ea…0440ae） | 2026-09-09 |
| 17 | `foundations/html_css/html_foundations/lists.md` | 指纹未变（46b6fddd…0fcaec） | 2026-09-09 |
| 18 | `foundations/html_css/html_foundations/links_and_images.md` | 指纹未变（1d439ea2…27b012） | 2026-09-09 |
| 19 | `git/foundations_git/commit_messages.md` | 指纹未变（0df78378…637d1a） | 2026-09-09 |
| 20 | `foundations/html_css/html_foundations/project_recipes.md` | 新登记（3df1c88a…947840，11529 字节） | 2026-09-23 |
| 21 | `foundations/html_css/css_foundations/intro_to_css.md` | 新登记（33ec47f1…c6020） | 2026-09-24 |
| 22 | `foundations/html_css/css_foundations/the_cascade.md` | 新登记（8f5e2076…d333a） | 2026-09-24 |
| 23 | `foundations/html_css/css_foundations/inspecting_html_and_css.md` | 新登记（3d18c318…1ab9a5） | 2026-09-24 |
| 24 | `foundations/html_css/css_foundations/the_box_model.md` | 新登记（51f77e5a…ec6a2，4602 字节） | 2026-09-24 |
| 25 | `foundations/html_css/css_foundations/block_and_inline.md` | 新登记（fd601f86…b1b81，7251 字节） | 2026-09-24 |

### 本轮核验结论

- 19 课官方指纹全部与 `sources.json` 一致（变化数 = 0），因此 `sources.json` 无需更新指纹；全局 `verifiedAt`（2026-09-09）在 `sources.json` 与 `lessons.js` 中保持相等。
- **第 20 课（Project: Recipes，2026-09-23 核验，v4.11.16）**：官方文件为 `foundations/html_css/html_foundations/project_recipes.md`——注意文件名不是 `recipes.md`（以官方课页 Edit on GitHub 链接实查确认）；SHA-256 = `3df1c88a…947840`。有 Assignment（四轮迭代）、**无 Knowledge Check**、无 Additional Resources、无独立 Exercise 节（`tests/content.test.cjs` 与 `tests/check_links.py` 已按课型分支）。课页 URL `https://www.theodinproject.com/lessons/foundations-recipes` 实测 HTTP 200、零重定向、首个 h1 为 “Project: Recipes”。中文正文只提供要求中文化、拆解与验收清单，**不提供成品代码**：`examples` 为空数组，课页走无「代码示例」节的 h2 序列（V2_H2_NO_CODE）。全局 `verifiedAt` 仍为 2026-09-09（前 19 课指纹本轮未重新全量复核，只复核了课 01 用于验证指纹方法学），第 20 课的逐课日期记录在 `lessons.js` 该课 `sources.verifiedAt`。
- **第 24–25 课（2026-09-24 核验，v4.11.18，css-foundations 收组）**：官方文件为 `foundations/html_css/css_foundations/the_box_model.md`（SHA-256 `51f77e5a…ec6a2`，4602 字节）与 `block_and_inline.md`（SHA-256 `fd601f86…b1b81`，7251 字节）。两课均**无 Knowledge Check、无 Additional Resources、无独立 Exercise 节**，与 2026-09-23 上游移除后的口径一致；课页 URL 均实测 HTTP 200、零重定向。规划轮记录的 24 课字节数 4 600 为近似值，以本轮实测 4602 为准。第 25 课官方正文中的 Rickroll 彩蛋链接（`youtube.com/watch?v=dQw4w9WgXcQ`，官方刻意安排、演示「内联链接嵌在段落里」）按用户拍板：正文忠实保留其语境，**不登记为外部资料**。CSS Foundations 单元至此官方 5 课全部开放。
- **第 26–27 课（2026-09-24 核验，v4.11.19，Flexbox 组起步）**：官方文件为 `foundations/html_css/flexbox/flexbox_intro.md`（SHA-256 `e3fef3a0…3f1698b8`，6242 字节）与 `flexbox_growing_and_shrinking.md`（SHA-256 `71ca0a77…8584d39c`，7277 字节）——官方文件名带 `flexbox_` 前缀，不是 slug 直译。两课均**无 Knowledge Check、无 Additional Resources**（与上游移除后的口径一致），课页 URL 均实测 HTTP 200、零重定向。课 26 的 Assignment 仅一句「Surprise! No assignment!」无作业声明（本站忠实翻译为一条说明条目），且**零外部学习资料**（3 条外链全是 statically CDN 课程配图，不登记）；课 27 的 Assignment 为两条阅读任务（W3C 规范 7.1.1 + MDN flex，均已核验登记）。
- **第 28–29 课（2026-09-24 核验，v4.11.19 第二批，Flexbox 组第 3–4 课）**：官方文件为 `foundations/html_css/flexbox/flexbox_axes.md`（SHA-256 `8572579e…7ec64f93`，4328 字节）与 `flexbox_alignment.md`（SHA-256 `de53d45f…829649bc`，6477 字节）。两课均**无 Knowledge Check、无 Additional Resources**，课页 URL 均实测 HTTP 200、零重定向。课 28 的 Assignment 为 1 条（MDN flex-direction，核验出官方中文版按 A 类登记新路径）；课 29 的 Assignment 为 4 条（joshwcomeau 交互指南 / CSS-Tricks 指南 / Flexbox Froggy / foundations/flex 练习目录，全部 C 类）。Flexbox 组至此开放 4/5，仅剩第 30 课 Project: Landing Page。
- **第 30 课（2026-09-24 核验，v4.11.19 第三批，Flexbox 组收组 5/5）**：官方文件为 `foundations/html_css/flexbox/project_landing_page.md`（SHA-256 `39b954c5…d09e968d`，5626 字节）——注意该文件前缀是 `project_` 不是 `flexbox_`。**无 Knowledge Check、无 Additional Resources**，课页 URL 实测 HTTP 200、零重定向。Assignment 为项目任务与规格清单（设计图下载、字体颜色规格、开发节奏建议、部署指引）；官方正文推荐的 3 个免费图片素材站（Pexels / Pixabay / Unsplash）已核验登记（前两条 403 反爬受限如实记录），4 条 TOP 自有页面链接按既有口径剔除。**本站红线**：Project 课 `examples` 为空数组，正文只提供要求中文化 + 区块拆解 + 验收清单，不提供成品代码。
- 每课课内 `sources` 字段记录 `basedOn`（含“未改编自任何第三方中文课程”声明）、`sha256` 与逐课核验日期，且 `sha256` 由测试断言与 `sources.json` 逐课一致。
- Knowledge Check 逐课计数与官方 Markdown 完全一致（19 课共 96 道官方 KC）：01=2、02=3、03=3、04=2、05=3、06=15、07=2、08=2、09=11、10=3、11=6、12=11、13=4、14=3、15=4、16=8、17=3、18=9、19=2。
- 19 课官方正文均无独立 Exercise 节，本站 `official.exercise` 全为空数组，与官方一致；`hasAdditionalResources` 全为 false，与本站说明一致。
- 官方明确标为 Optional 的内容仍按可选处理，未混入必做：05 课 Discord 关联 GitHub、07 课已满足条件时跳过、10 课 GitHub 2FA、11 课 About GitHub and Git 的 Where do I start?、06 课 DNS 视频作为替代阅读。
- 代码与命令示例与官方一致：git 命令序列按官方原文保留、不额外发挥；HTML 示例取自官方正文；命令行示例取自官方练习步骤。
- 红线处理：09 课练习第三组第六步“删除 test 目录”的具体命令，官方正文未给出（由官方指定的 SWC 与 unix_commands 外部资料提供），本站不复制可直接执行的删除命令，改为指明权威出处并强调不可撤销、只删本次练习自建目录。全站未出现 `rm -rf`、`reset --hard`、`push --force`、`git clean` 等危险命令。
- 第三方内容边界：18 课官方 KC 中“四种主要图片格式”一题指向 Interneting is Hard 文章，本站不复制该第三方文章内容，如实标注以官方链接为准；04 课“提问应包含哪 5 样东西”指向官方社区指南，同样不复制全文。
- 路线 A 不引入任何第三方中文课程署名；本站署名与授权维持下方小节不变。

## v3 轮次来源核对（2026-09-10）

本轮新增本地学习进度系统与外部资料中文辅助入口，**未改动任何课程内容数据**。来源核对结论如下。

### 官方原文指纹复核

重新拉取 19 课官方 curriculum Markdown，逐课计算 SHA-256 并与 `sources.json` 中记录的指纹比对：

- **指纹变化 = 0，未拉取 = 0**，19 课全部一致。
- 因此 `sources.json` 无需更新，本轮没有写入任何新的或推测的哈希值；各课 `sources.sha256` 与 `sources.verifiedAt` 保持上一轮的实际核对结果。
- 课程内容（`lessons.js` 的 why / sections / examples / pitfalls / official / quiz 等）本轮**一字未改**，`tests/content.test.cjs` 中 19 课 v2 字段、sha256 与 `sources.json` 相等、繁体字保险等原有断言全部照旧通过。

### 外部资料的来源与核验

本轮盘点了官方 19 课在正文、Assignment 与 Knowledge Check 中明确要求学习的第三方资料，共 84 条。这批资料的**地址全部直接取自官方 Markdown 原文**，本站没有替换、没有推测、没有补写官方未给出的链接。

核验记录、分类依据、被排除的假中文版、5 条自动核验受限地址的实际情况，以及逐条许可状态，记录在 `external-resources.js` 每条资料的 `license` / `note` / `audit` 字段中（随代码公开，机械断言保护）。

与上一轮“第三方内容边界”约定的延续与强化：

- 上一轮已确立“不复制第三方文章内容，如实标注以官方链接为准”（18 课的 Interneting is Hard、04 课的官方社区指南）。本轮把这一约定扩展到全部 84 条资料，并落成机械断言：所有条目 `handling` 必须为 `link-only`，源码不得含 `fetch(` / `XMLHttpRequest` / `innerHTML` / `<iframe`。
- C 类 60 条只提供本站原创的中文导读要点，**不整篇翻译、不复制原文**。导读要点只依据官方 Markdown 对该资源的说明与本站已核验事实编写；对没有读过的第三方文章，明确写出“本站未复制原文内容，具体论点请打开英文原文阅读”，不臆造其内部论点。
- 15 个视频全部归为 C 类：只用 YouTube oEmbed 公开接口核验了可用性与真实标题，**没有可靠证据证明它们提供中文字幕，因此一律不声称有中文字幕**，也不给中文版入口。此约定有机械断言保护。
- 24 条 A 类的中文版全部是**原站官方维护的语言版本**（MDN `/zh-CN/`、GitHub 文档 `/zh/`、Pro Git `/book/zh/v2/`、中文维基 `/zh-cn/`、Google 帮助中心 `?hl=zh-CN`），不接受机器翻译镜像；测试对 `translate.google` / `--zh.` / `.translate.goog` / `fanyi.` 等形态做了排除断言。
- 第三方图片与练习数据文件（18 课 Unsplash 练习图、09 课 shell-lesson-data.zip）只链接官方给出的下载地址，本站不镜像、不转存。
- 涉及账号与凭据的资料（GitHub 注册页、邮箱设置页、2FA 配置、SSH 密钥指纹）在条目中明确注明：本站不代为注册或登录，不收集、不存储、不显示任何 token、密钥、恢复码或账号信息。

### 学习进度数据的来源属性

学习进度（完成状态、有效学习时长、XP、等级、成就、连续天数）全部是**使用者本人产生的本地数据**，不来自官方课程，也不上传到任何位置，因此没有外部来源需要记录。字段定义与口径以 `progress.js` 的 schema 注释为准（随代码维护）。

其中“完成课程数 / 19”“完成当前全部课程”成就等统计的分母，取自本站当前收录的课程数（19），与官方 Foundations 全 46 课无关；页面上不会把本站进度表述为官方课程进度或官方证书。

## 视觉资产来源（头像 / 图标 / 概念图 / 学习伙伴角色）

发布准备轮（2026-09-14）按公开要求逐项登记制作方式与授权边界：

### 手工原创 SVG（随内容许可 CC BY-NC-SA 4.0）

- 37 个本站原创头像（`avatars.js`）、图标集（`icons.js`，含 17 个成就独立图标）；
- 芽芽等 12 个生物形态学习伙伴、少年 / 少女人形装扮部件（发型 / 服装 / 配饰 / 色板，运行时参数化拼装，零图片文件）；
- 8 张概念图（`assets/diagrams/*.svg`）。

以上全部为手工编写的原创几何 SVG，未引入第三方图标库或商业角色资产。

### 学习伙伴 fixed-art 角色立绘（AI 生成，保守授权声明）

`assets/companions/` 下 14 个角色的立绘位图（表情立绘 normal / happy / celebrate、icon 头像，人形角色另含学习装预制皮肤变体；共 72 个 WebP 文件）为 **AI 图像生成资产**：

- 制作方式：使用本地开发环境的 AI 图像生成工具逐张生成 PNG（基于项目内已确认的角色设计板身份与画风，不重新设计），随后在本地完成前景分离（抠图）与 WebP 优化；生成源文件与抠图模型不进入仓库。
- 授权边界（保守声明）：这些图片为本项目委托生成并确认用于本项目；AI 生成内容的版权地位因司法辖区而异，本项目**不对其做独立的再许可声明**，也不将其纳入代码的 MIT 许可范围。默认使用范围：随本仓库分发、在与本站相关的展示材料（README、发布说明、介绍帖）中使用。第三方如需复用，请自行评估所在辖区对 AI 生成内容的规定。
- 仓库只保留运行时 WebP，不收录原始 PNG、设计板、参考图或任何中间产物。

对 Humation / DiceBear 等成熟方案做过既有复用审计，结论均为「只参考设计思想，不 vendoring、不引依赖」：两者与本站「零 npm / 零构建 / 原生 JS」红线冲突（Humation 是 TS + Bun 构建产物，DiceBear 是 npm 包），运行时资产全部自研（审计详情属内部记录，不在公开仓）。

## 署名、改动与授权

原作者：[Erik Trautman](https://github.com/eriktrautman) 与 [The Odin Project 贡献者](https://github.com/TheOdinProject/curriculum/graphs/contributors)。

依据[官方课程许可证](https://github.com/TheOdinProject/curriculum/blob/main/license.md)，课程采用 [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-nc-sa/4.0/)（署名、非商业性使用、相同方式共享）。本项目对照官方原文自行编写了简体中文讲解、术语解释与官方任务重述，并新增本站自测；这些内容沿用同一许可。没有搬运官方练习代码或项目成品，也没有复制第三方视频、图片或第三方中文课程内容。第三方资料仍以各自授权为准。

本页是个人学习辅助，与 TOP 官方无隶属或背书关系。
