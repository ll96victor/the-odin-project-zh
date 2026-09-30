/* courses/databases.js — World 6「Databases（数据库）」已开放课程正文（v2 自足格式）。
 *
 * 沿用 courses/ 按 World 分文件的架构（2026-09-25 路径课试点批次 1 首建，
 * 复用事实见 REUSE-NOTES.md「路径课试点轮复用事实」节）：lessons.js 继续作为
 * Foundations 的唯一事实源不动（46 课已发布上线，是稳定资产）；本文件只放
 * World 6 已开放的课程，未开放的章节与课程不得夹带正文（红线）。
 *
 * 数据约定（与 intermediate-html-and-css.js / javascript.js /
 * advanced-html-and-css.js / react.js 同一套）：
 *   - 每课的 id 就是 curriculum.js 里的原始 slug，原样沿用、不得改写；
 *     World 6 的 3 课 slug 全带 **node-path-databases** 前缀（第 1 课
 *     node-path-databases 即课程同名课；第 2、3 课在其后追加课名段）；
 *   - group 字段是本文件 groups 数组的数字下标（从 0 起且在本文件内连续）；
 *     World 6 只有 1 个章节，groups 共 1 项；
 *   - 课的字段结构与 lessons.js 完全同构（19 字段 v2 自足格式）；
 *   - 中文课名按 catalog.js 惯例自拟，登记在本文件头注释与 SOURCES.md：
 *     超长轮批次 7 阶段 1（2026-09-28，v4.11.33，World 6 收组）「数据库」3 课：
 *     Databases → 数据库；
 *     Databases and SQL → 数据库与 SQL；
 *     Project: SQL Zoo → 项目：SQL Zoo（站点名保留原文；project_sql_zoo.md
 *       对 slug node-path-databases-sql-zoo 为 project_ 前缀去前缀直译第 20 例）。
 *   - 官方 Markdown 住在 curriculum 仓 databases/databases/ 目录（GitHub API
 *     实列确认：3 个 .md、无配图子目录）；文件名与 slug 去 node-path-databases
 *     前缀后同形（sql-zoo 为 project_ 前缀直译例外，见上）。
 *   - sources.sha256 与 sources.json 逐字符一致（双通道实抓：raw + GitHub API，
 *     整条 64 位）；verifiedAt 为本轮实抓日期。 */
window.ODIN_COURSE_DATABASES = {
  version: 1,
  course: {
    id: 'databases',
    en: 'Databases',
    zh: '数据库',
    url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/databases'
  },
  groups: [
    { en: 'Databases', zh: '数据库' }
  ],
  lessons: [
    {
      "id": "node-path-databases",
      "title": "Databases",
      "zh": "数据库",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/node-path-databases",
      "summary": "World 6 开篇导论（短课）。数据库是任何 Web 应用的最底层——它替你「记住」一切：谁记着你登录网站的密码是 CatLover1985？是数据库。它可以简单得像一张 Excel 电子表格，也可以复杂得像 Facebook 那样拆成许多巨大的分片。数据库藏在 Web 应用的后端，人们往往带着几分怀疑与敬畏看待它——官方说：别慌、别被吓到，学到课程末尾你会跟数据库成为好朋友（至少是「亦敌亦友」），并能像行家一样与它打交道。用来查询数据库的语言叫 SQL（结构化查询语言）：与常规编程语言相比它的语法非常短——只有屈指可数的几个动词要学；真正难住人的是你得能在脑子里可视化它正在做什么。SQL 与数据库是如此基础，课程会花相当多时间在这上面；本课只是开胃预告（teaser），让你熟悉里面正在发生什么。",
      "guide": "以下是官方原课的中文化梳理。开场两个问题：你可能想过，网站怎么记住所有用户的数据？谁记得你的登录密码是 CatLover1985、让你能登进网站？答案是——**任何 Web 应用的最底层都是数据库**，它替你完成全部「记住」的工作（缓存是很久以后才谈的话题）。数据库的形态跨度极大：可以相对简单，像一张 Excel 电子表格；也可以极其复杂、拆分成许多巨大的碎片，像 Facebook 的那样。**别被吓到**：数据库藏在 Web 应用的后面，人们接近它时总带着怀疑与敬畏——官方原话是「不要发愁、不要感到被吓住」。随着深入，你和你的数据库会成为很好的朋友（或者至少是「友敌」）；官方保证：到本课程结束时，你会明白数据库里正在发生什么，并能像行家（pro）一样与它交互——大概率比你将来共事的某些人还强。本课就是这段旅程的预告。**关于 SQL**：与你已经学过的常规编程语言相比，SQL（Structured Query Language，结构化查询语言——用来查询数据库的语言）语法非常短，**只有一小把动词要学**。真正绊住人的地方在于：你需要能够在脑海里**可视化它将要做什么**。正因为数据库如此基础，课程会花相当多的时间在 SQL 上；但现在只需要覆盖到让你熟悉「里面在发生什么」的程度。官方还预告了本课概览里的知识点：什么是数据库、什么是关系型数据库、SQL 是什么、用来做什么、怎么取出表里全部记录、怎么插入一条记录。**Assignment 四条**：① 读 LaunchSchool《结构化数据、SQL 与关系型数据库》引言——只需读引言第一页，不必往后；② 看一支关系型数据库简介短视频，感受这些东西为什么有用、多接触一遍后面会用的术语；③ 过一遍可汗学院 SQL 教程，感受真正创建与操纵数据库是什么体验；④ 关系型数据库不是存数据的唯一方式——非关系型（又叫 NoSQL）数据库在近几十年兴起，本课程会用 SQL，但读一篇 SQL 与 NoSQL 差异的文章开开眼。",
      "understand": [
        "**数据库是 Web 应用的最底层**——它负责全部「记住」的工作（用户、密码、内容）；缓存是后话",
        "形态跨度大：简单如一张 **Excel 电子表格**，复杂如 Facebook 拆成许多巨大分片",
        "藏在应用后端不代表神秘——官方定调：别慌，学完课程你能像行家一样与它交互",
        "**SQL = Structured Query Language**，查询数据库的语言——语法非常短、只有**一小把动词**",
        "SQL 真正难的地方不是语法量，而是**在脑海里可视化查询将做什么**",
        "关系型数据库之外还有 **NoSQL**（非关系型）——近几十年兴起；本路线用 SQL，但要知道世界不只有 SQL"
      ],
      "terms": [
        {
          "en": "Database",
          "zh": "数据库：Web 应用最底层的存储系统，负责「记住」全部数据"
        },
        {
          "en": "Relational database",
          "zh": "关系型数据库：用相互关联的表来组织数据的数据库——本路线的主角"
        },
        {
          "en": "SQL (Structured Query Language)",
          "zh": "结构化查询语言：查询关系型数据库的语言，动词屈指可数、重在概念"
        },
        {
          "en": "NoSQL",
          "zh": "非关系型数据库的统称：近几十年兴起的另一条存储路线"
        }
      ],
      "tasks": [
        "读 LaunchSchool《结构化数据、SQL 与关系型数据库》的引言部分——官方明确：只需读引言第一页、不必深入（链接在资料区）",
        "看一遍关系型数据库简介短视频（约几分钟），留意视频里出现的术语——下一课会逐个展开（链接在资料区；为英文视频）",
        "过一遍可汗学院「SQL 一小时」教程的欢迎与起步部分，亲手感受创建与操纵数据库（链接在资料区）",
        "读 CircleCI 的 SQL vs NoSQL 对比文，用自己的话回答：什么样的数据适合关系型、什么样的场景 NoSQL 更有优势（链接在资料区）"
      ],
      "quiz": [
        {
          "question": "按官方开场，Web 应用里「记住所有用户数据」的层是哪一层？它的形态跨度有多大？",
          "answer": "最底层的数据库——它替你完成全部「记住」的工作。跨度极大：可以简单得像一张 Excel 电子表格，也可以复杂得像 Facebook 那样拆成许多巨大的分片。"
        },
        {
          "question": "SQL 全称是什么？官方说它「难」的地方到底在哪？",
          "answer": "Structured Query Language（结构化查询语言），用来查询数据库。官方明确：SQL 语法非常短、只有一小把动词——真正绊住人的是你需要在脑海里可视化查询将要做什么，而不是语法量。"
        },
        {
          "question": "关系型数据库之外还有什么路线？本课程的取舍是什么？",
          "answer": "非关系型数据库（NoSQL），近几十年兴起。本路线（Full Stack JavaScript）会用 SQL/关系型数据库，但官方安排了一篇 SQL vs NoSQL 对比阅读让你知道两条路线的差异。"
        }
      ],
      "optional": [],
      "note": "这是 World 6 的开篇预告课（官方自称 teaser）：正文没有具体语法，重点是把「数据库不神秘」的心态立起来。Assignment 四条的链接全部登记在资料区；其中可汗学院页命令行核验遇反爬挑战页、真实浏览器核验可达（详见资料卡核验说明）。官方 Lesson overview 提到「关系型数据库与 XML 的差异」，但现行官方正文并未展开该内容——如实转达概览清单、不替官方补写。",
      "why": "从 World 5 走出来，你已经能建出像样的前端应用——但刷新页面数据就没了、别人的浏览器看不到你的状态。这一课解释缺的那块拼图：应用需要一层专门的系统来「记住」数据，这层就是数据库。整个 World 6 只有 3 课，却决定了你后面学 NodeJS 课程（World 7）时能不能看懂 ORM 在替你做什么。官方把心态建设放在第一节是有道理的：SQL 的名声比它的实际难度大得多，先卸下「怀疑与敬畏」，后面的表、键、JOIN 才装得进去。",
      "sections": [
        {
          "h": "数据库：替你「记住」一切的最底层",
          "p": [
            "你可能想过：网站是怎么记住所有用户的数据的？谁记得你的登录密码是 CatLover1985、让你能签入网站？——**任何 Web 应用的最底层都是数据库**，它替你完成全部「记住」的工作（缓存要等到很久以后才覆盖）。",
            "数据库的形态跨度可以非常大：相对简单的，像一张 **Excel 电子表格**；极其复杂的，像 Facebook 的数据库那样**拆分成许多巨大的分片**。",
            "它藏在 Web 应用的后面，所以人们接近它时总带着一点**怀疑与敬畏**。"
          ]
        },
        {
          "h": "别被吓到：SQL 其实很短",
          "p": [
            "官方原话：不要发愁、不要感到被吓住。随着你深入这个主题，你和你的数据库会成为**很好的朋友**（或者至少是「亦敌亦友」）。可以放心：到本课程结束时，你会理解数据库里正在发生什么，并能**像行家一样与它交互**——而且大概率比你将来共事的某些人还强。本课就是那段旅程的**预告（teaser）**。",
            "与你已经学过的常规编程语言相比，**SQL**（Structured Query Language，结构化查询语言——用来查询数据库）的语法**非常短**：只有屈指可数的几个动词要学。",
            "真正绊住人的是另一件事：你需要能**在脑海里可视化**它将要做什么。正因为 SQL 与数据库如此基础，课程会花相当多时间在这上面；但现在只需要覆盖到让你**熟悉里面在发生什么**的程度。"
          ]
        },
        {
          "h": "Assignment：四步热身",
          "p": [
            "① 读 LaunchSchool 的引言《结构化数据、SQL 与关系型数据库》——官方明确：**只需读引言第一页**，不必往后深入（资料区有链接）。",
            "② 看一支**关系型数据库简介短视频**，感受这些东西为什么有用，并多接触一遍后面会反复出现的术语（资料区有链接；为英文视频）。",
            "③ 过一遍**可汗学院 SQL 教程**，亲手感受真正创建与操纵数据库（资料区有链接）。",
            "④ 关系型数据库不是存数据的唯一方式——**非关系型（NoSQL）数据库**在近几十年兴起。本课程会用 SQL，但这篇 SQL 与 NoSQL 差异的文章值得读（资料区有链接）。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "被「数据库」的名声吓退",
          "text": "官方特意花一整段做心态建设：数据库藏在后端，人们带着怀疑与敬畏接近它——但 SQL 只有屈指可数的几个动词。把「我没学过数据库」当成高墙的人，往往在第一页 SELECT 语句之后就发现墙是纸糊的。正确姿势是把它当成下一课的词汇预习，而不是另一门要啃的语言。"
        },
        {
          "title": "以为 SQL 的难点在语法量",
          "text": "官方的判断恰恰相反：SQL 语法非常短，真正绊住人的是**在脑海里可视化查询将做什么**——哪些行被选中、两张表怎么拼、分组后每组算出什么。所以学习重心应该放在「画图想象数据流动」上，而不是背动词表；下一课官方甚至建议你在脑子里想象 Excel 表格移动、合并、重排。"
        },
        {
          "title": "以为关系型数据库是唯一选择",
          "text": "Assignment 第 4 条专门纠这个偏：近几十年非关系型（NoSQL）数据库已经兴起，两条路线各有适用场景。本路线选 SQL 是因为关系型数据库是理解数据建模、ORM 与后端 API 的最好起点——但「课程教 SQL」不等于「世界只有 SQL」，读那篇对比文能防止把入门路线当成全部地图。"
        }
      ],
      "official": {
        "assignment": [
          "阅读 LaunchSchool《结构化数据、SQL 与关系型数据库》的引言——了解 SQL 如何用于组织与管理海量数据（只需读引言第一页，不必深入）",
          "观看这支关系型数据库简介短视频——感受这些东西为什么有用，并多接触一些我们后面会用的术语",
          "过一遍这份可汗学院 SQL 教程——感受真正创建与操纵数据库",
          "关系型数据库不是存储数据的唯一方式：非关系型（NoSQL）数据库在近几十年兴起。虽然本课程使用 SQL，仍请阅读这篇文章了解 SQL 与 NoSQL 的差异"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 databases/databases/databases.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "2b6d41bb4d6e7cb56cd7e6ea71349285f1dbc8b119effb47f4e0ad3c181f6834",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "node-path-databases-databases-and-sql",
      "title": "Databases and SQL",
      "zh": "数据库与 SQL",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/node-path-databases-databases-and-sql",
      "summary": "World 6 的主课：一趟「全世界最快的半完整 SQL 讲解」。数据是任何好 Web 应用的核心，SQL 功底让你不仅看懂 ORM（Rails 的 Active Record、Node.js 的 Prisma）在背后做什么，还能自如地向数据提出更复杂的问题——SQL 的本质就是向数据库提问、偶尔增改内容。表是电子表格式的长列表：每行一条记录、每列一个属性，人人都有 ID 列作「主键」；一张表的列指向另一张表的 ID 就是「外键」，表就这样被链接起来。建库建表的设置信息住在叫 Schema 的特殊文件里；对常用搜索列建 CREATE INDEX 能大幅提速。操纵数据走 CRUD：每条命令 = 动作（语句）+ 目标表 + 条件（子句），DELETE 不带 WHERE 会清空全表是经典事故；INSERT INTO 指定列名再给值；UPDATE 用 SET 改数据、WHERE 圈行；SELECT 最常用，* 表示所有列，多表查询列名前必须带表名，SELECT DISTINCT 去重。拼表用 JOIN + ON：INNER（只留匹配上的，95% 场景）、LEFT OUTER（左表全留、缺失补 NULL）、RIGHT OUTER（右表全留）、FULL OUTER（全留）；左表 = FROM 里那张。聚合函数（COUNT/SUM/MIN/MAX）把一堆行算成一个值，AS 起别名；GROUP BY 按组分别聚合（把选中的非聚合列都写进 GROUP BY 是最佳实践）；聚合后的条件筛选用 HAVING——它就是聚合版的 WHERE。官方收尾两件事：SQL 比你的代码快——SELECT DISTINCT 一步完成的事别把全表拉进内存再用 JS 去重，SQL 自带查询优化器；普通 JOIN 与聚合函数是必须吸收的核心知识，真正高级的用法到时候现查就好——但用上 ORM 之后，别忘了老朋友 SQL。",
      "guide": "以下是官方原课的中文化梳理。**开场**：数据是任何好 Web 应用的核心，而扎实的 SQL 功底能带你走很远——它让你不仅理解使用 ORM（对象关系映射器，如 Rails 里的 Active Record、Node.js 里的 Prisma）时幕后发生什么，还能自如地向数据提出更复杂的问题。SQL 的全部意义就是**向数据库提问**，偶尔也往里添加或修改东西。直白的例子：显示所有 12 月用促销码 FREESTUFF 注册的用户；显示当前用户创建的全部评论、按话题与创建日期排序。复杂的例子：按数量与订单总额列出所有发往「用户数超过 1000 的州」的订单；或者为内部分析问一句——哪些推广渠道带来的用户满足「每个工作周阅读五篇文章」的参与度标准。这些例子都涉及你与数据库打交道。幸运的是，我们要专注的这类数据库都说 SQL；幸运的是，SQL 总共几十个词里你**常用只有十几个**——它不是一门大语言，重点在它背后的**概念**。你将从上面那样的问题出发，琢磨怎么向很可能装着一堆表的数据库正确提问。每个人可视化方式不同，但找到一种「看见 SQL 查询在做什么」的方法相当重要——官方作者自己的方式是在脑子里想象 **Excel 表格移动、相互合并、按需重排**。**资源说明**：SQL 是被收在满是灰尘的老技术手册与 90 年代风格网站里的主题，连最好的书也常写给真正需要知道全部细枝末节的数据库工程师、显得莫名复杂；Web 应用兴起后新学习者更想抓**概念**，但学习工具没跟上——官方会尽力用现有工具把概念传给你。**最快的半完整讲解**：SQL 是与许多关系型数据库对话的语言。这些数据库用许多**表**存不同类型的数据（如 users 与 posts）。表是电子表格式的长列表：每**行**是一条不同的记录（或对象，如单个用户），每**列**是该记录的一个属性（name、email 等）。所有表都有的那一列是 **ID 列**——唯一的行号，叫记录的「**主键**」。让一张表的某列指向另一张表的 ID，就能把表**链接**起来：posts 表的一行可以在 user_id 列里存作者 ID——因为存了别的表的 ID，这列叫「**外键**」。**设置**：第一类命令负责建库（CREATE DATABASE）、建表（CREATE TABLE）以及修改/销毁它们的类似命令。数据库的设置信息存在叫「**Schema**」的特殊文件里，结构一变它就更新——可以把 Schema 理解为「这是我们的库，它有几张表；第一张叫 users，有 ID（整数）、name（一串字符）、email（一串字符）……各列」。除建表外，还能要求某列只允许唯一值（如用户名），或用 **CREATE INDEX** 给列建索引供以后更快搜索——索引提前做完了排序的苦力活，给将来要搜索的列（如 username）建索引会让数据库快得多。SQL 喜欢在行尾用**分号**、用**单引号**（不用双引号）。**操纵数据**：建好库、有了空表之后，用 SQL 语句开始填充。主要动作是 **CRUD**——Create（建）、Read（读）、Update（改）、Destroy（删）。大多数命令会落在「Read」类，因为你会花大量时间向数据提问并展示它。每条 CRUD 命令都含几个部分——**动作（statement 语句）+ 运行的表 + 条件（clauses 子句）**；只给动作与表、不给条件，就会作用于**整张表**，你多半会弄坏点什么。「删」的经典事故是打了 DELETE FROM users 而没带 WHERE 子句——全表用户没了。你多半只想删一个用户：用（希望唯一的）属性如 name 或 id 写进条件子句，例如 DELETE FROM users WHERE users.id = 1。常识操作都可以：用比较运算符（>、<、<= 等）圈一批行，用逻辑运算符（AND、OR、NOT 等）把多个子句串起来，例如 DELETE FROM users WHERE id > 12 AND name = 'foo'。「建」用 **INSERT INTO**：指明往哪些列插值，再给值本身——INSERT INTO users (name, email) VALUES ('foobar', 'foo@bar.com');。技术上可以省略列名，但被认为是糟糕实践、普遍不鼓励。INSERT 是少数不必担心「选中了哪些行」的查询，因为它就是往表里加新行。「改」用 **UPDATE**：告诉它 SET 什么数据（key=\"value\" 对）、改哪些行——WHERE 命中多行就全改（比如按常见名搜），标准改邮箱查询长这样（真实世界会按永远唯一的 ID 搜）：UPDATE users SET name='barfoo', email='bar@foo.com' WHERE email='foo@bar.com';。「读」用 **SELECT**，最常见：SELECT * FROM users WHERE created_at < '2013-12-11 15:35:59 -0800'——星号表示「所有列」。指定列时表名列名一起给：单表查询只写列名能混过去，但一涉及多张表 SQL 就会冲你嚷，所以**永远带表名**：SELECT users.id, users.name FROM users。只想要某列不重复的值时用它的近亲 **SELECT DISTINCT**：SELECT DISTINCT users.name FROM users 列出所有不同的用户名。**拼表**：想取某用户创建的全部帖子，就要告诉 SQL 用哪些列把两张表「拉链」到一起——**ON 子句**；执行拼接用 **JOIN**。两张表数据不完全对上（一个用户多篇帖子）时保留哪些行？四种可能（tip：「左」表是原表——FROM 子句里那张，如下例的 users）：① **INNER JOIN**（即 JOIN）——你的好朋友、95% 的使用场景：只保留两表中**匹配上**的行。SELECT * FROM users JOIN posts ON users.id = posts.user_id 只返回真正写过帖子的用户与写明了作者的帖子；一个作者多篇帖子就返回多行（用户数据列重复出现）。② **LEFT OUTER JOIN**——左表全保留，右表匹配上的行加进来，产生的空格子填 **NULL**：返回所有用户（无论有没有帖子），有帖子的列出帖子，没有的 posts 列为 NULL。③ **RIGHT OUTER JOIN**——相反，右表全保留。④ **FULL OUTER JOIN**——所有表所有行全保留，对不上的格子填 NULL。JOIN 自然也能带条件：只要某个用户的帖子——SELECT * FROM users JOIN posts ON users.id = posts.user_id WHERE users.id = 42。官方推荐 Jeff Atwood《SQL Joins 的可视化解释》（正文有图）与 W3Schools 的 Joins 课。**聚合**：普通查询返回一堆行；有时只想要一个聚合值，如某用户写帖的 **COUNT**。用 SQL 的「聚合」函数（SUM、MIN、MAX 等你预期该有的都有），把函数写进 SELECT：SELECT MAX(users.age) FROM users。函数默认作用于单列，除非你指定 *——只有 COUNT 这类函数吃 *（COUNT(*) 数所有行；MAX(*) 无意义——「所有东西的最大值」是什么？）。**别名（AS）**给列或聚合结果改名以便后续称呼：SELECT MAX(users.age) AS highest_age FROM users 返回一列叫 highest_age。好玩的来了：COUNT 这种对整个数据集返回单值的函数不错，但对**特定分块**分别聚合再分组才真正有用——比如显示**每个**用户的发帖数（而不是所有人的总帖数）：SELECT users.id, users.name, COUNT(posts.id) AS posts_written FROM users JOIN posts ON users.id = posts.user_id GROUP BY users.id, users.name;。注意 GROUP BY 里除 users.id 外还写了 users.name——把选中的**非聚合列**都显式写进 GROUP BY 提升清晰度、符合最佳实践，虽然对多数数据库并非严格必需。最后一招：只想显示数据的子集时，常规用 WHERE 缩小范围；但用过 COUNT 等聚合之后 WHERE 就不灵了——**基于聚合结果**做条件筛选要用 **HAVING**，它本质上是聚合版的 WHERE。只显示写过 10 篇以上帖子的用户：在上面查询后加 HAVING COUNT(posts.id) >= 10;。官方邀请你去 W3Schools 的浏览器 SQL 游乐场把 Customers 与 Orders 表 JOIN 起来、GROUP BY 之后加 HAVING COUNT(*) > 10; 试试各国订单数。上面的解释你多半在某处跟丢了，没关系——它覆盖的内容远超任何人 10 分钟能吸收的量；指定阅读会讲得更好，更重要的是项目里有大量机会巩固理解。**SQL 比你的代码快**：聪明地用 SQL 构建查询，比把一大堆数据拉出数据库再用编程语言（Ruby 或 JavaScript）处理**快得多**。想要所有不重复的用户名？你**可以** SELECT users.name FROM users 拉全表再用 JS/Ruby 方法去重——但那要把全部数据搬出数据库、塞进内存、再迭代一遍；改用 SELECT DISTINCT users.name FROM users，SQL 一步到位。SQL 生来就快：它有专门的**查询优化器**，审视你即将运行的整条查询、算出到底要 JOIN 哪些表、怎样执行最快。SELECT 与 SELECT DISTINCT 的差别，与你自己动手的时间成本相比可以忽略。**收尾**：SQL 的概念可能不好绕，尤其是多 JOIN 结果的条件显示与分组。普通 JOIN 与普通聚合函数为止的内容是**核心知识**，务必下功夫吸收；真正高级的概念就算一直没到完全舒适的程度也不要紧——将来的工作里只有一小部分场景用得到，到时候多半还是现查。下一步是在项目里练熟这些，然后应用到后面课程的代码库里。你很快会发现 **ORM 工具让生活美好得多**——只是用上那些更光鲜的东西之后，别忘了老朋友 SQL。",
      "understand": [
        "表 = 电子表格：每**行**一条记录、每**列**一个属性；人人有 **ID 列**作**主键**（唯一行号）",
        "**外键** = 本表中指向另一张表 ID 的列（posts.user_id → users.id）——表靠它链接成关系型数据库",
        "**Schema** 存数据库的结构设置；建库建表用 CREATE DATABASE / CREATE TABLE；给搜索列 **CREATE INDEX** 提前做排序苦力、大幅提速",
        "每条 CRUD 命令 = **语句（动作）+ 表 + 子句（条件）**；不给条件就作用于全表——DELETE 不带 WHERE 是经典事故",
        "INSERT INTO 表 (列…) VALUES (值…)（省列名是糟糕实践）；UPDATE … SET … WHERE …（WHERE 命中几行改几行）；SELECT * / SELECT DISTINCT；**多表查询列名永远带表名**",
        "JOIN 四种：INNER（只留匹配，95% 场景）/ LEFT OUTER（左表全留、缺失补 NULL）/ RIGHT OUTER（右表全留）/ FULL OUTER（全留）；左表 = FROM 里那张；ON 给拉链列",
        "聚合函数（COUNT/SUM/MIN/MAX）把一堆行算成一个值，写进 SELECT、**AS** 起别名；COUNT(*) 数全行、MAX(*) 无意义",
        "**GROUP BY** 按组分块聚合（选中的非聚合列都写进 GROUP BY 是最佳实践）；聚合后的条件筛选用 **HAVING**——聚合版的 WHERE",
        "**SQL 比你的代码快**：DISTINCT/聚合让数据库一步完成的事，别拉全表进内存用 JS 再算——查询优化器专门干这个"
      ],
      "terms": [
        {
          "en": "Primary Key",
          "zh": "主键：表里唯一的行号列（ID），每条记录的身份标识"
        },
        {
          "en": "Foreign Key",
          "zh": "外键：本表中存着另一张表 ID 的列——把两张表链接起来的纽带"
        },
        {
          "en": "Schema",
          "zh": "模式：记录数据库结构设置（有哪些表、各有哪些什么类型的列）的特殊文件"
        },
        {
          "en": "Index",
          "zh": "索引：CREATE INDEX 给列建的「提前排好序」结构，让搜索快得多"
        },
        {
          "en": "CRUD",
          "zh": "增删改查：Create / Read / Update / Destroy——数据操作的四大类"
        },
        {
          "en": "Statement & Clause",
          "zh": "语句与子句：命令的「动作」部分（SELECT/DELETE…）与「条件」部分（WHERE/HAVING…）"
        },
        {
          "en": "JOIN … ON",
          "zh": "连接：按 ON 给的列把两张表拉链拼起来——INNER / LEFT / RIGHT / FULL 四种取舍"
        },
        {
          "en": "Aggregate function",
          "zh": "聚合函数：COUNT/SUM/MIN/MAX 等——把一列的一堆行算成单个值"
        },
        {
          "en": "GROUP BY",
          "zh": "分组：把聚合从「整个数据集一个值」变成「每组各一个值」"
        },
        {
          "en": "HAVING",
          "zh": "聚合条件：对聚合结果做筛选的子句——聚合版的 WHERE"
        }
      ],
      "tasks": [
        "在脑子里（或纸上）画两张表：users(id, name, email) 与 posts(id, user_id, title)——标出谁是主键、谁是外键，再写出一条「取 42 号用户全部帖子」的 JOIN 查询并口头解释结果为什么可能有多行",
        "分别写出四种 JOIN 的骨架并各用一句话说明保留哪些行；再回答：LEFT OUTER JOIN 结果里 posts 列出现 NULL 意味着什么",
        "写一条分组聚合：每个用户的发帖数（JOIN + GROUP BY + COUNT + AS 别名），然后加 HAVING 只留发帖 ≥ 10 的用户——对照官方示例自查 GROUP BY 里是否把选中的非聚合列都写上了",
        "做官方推荐的 W3Schools 游乐场练习：把 Customers 与 Orders 表 JOIN 起来算各国订单数，GROUP BY 后加 HAVING COUNT(*) > 10;（注意删掉上一行多余的分号）",
        "完成官方 Assignment 两条：过一遍 SQL Teaching 的交互式教程，再做更深入的 SQL Bolt 交互式教程（两个链接都在资料区）"
      ],
      "quiz": [
        {
          "question": "主键与外键各是什么？表靠什么被「链接」起来？",
          "answer": "主键是表里唯一的行号列（所有表都有的 ID 列），标识每条记录。外键是本表中存着另一张表 ID 的列——例如 posts 表的 user_id 列存作者的 users.id。让一列指向另一张表的 ID，两张表就链接起来了，这正是「关系型」的含义。"
        },
        {
          "question": "「DELETE 的经典事故」是什么？每条 CRUD 命令由哪几部分组成？",
          "answer": "打了 DELETE FROM users 却不带 WHERE 子句——整张表的用户全被删掉。每条 CRUD 命令含三部分：动作（语句，如 DELETE/INSERT/UPDATE/SELECT）、运行的表、条件（子句，如 WHERE id = 1）。不给条件就作用于全表。可用比较运算符圈行、逻辑运算符（AND/OR/NOT）串联多个子句。"
        },
        {
          "question": "四种 JOIN 各保留哪些行？「左表」指哪张？",
          "answer": "INNER JOIN（即 JOIN）只保留两表匹配上的行——95% 的使用场景；LEFT OUTER JOIN 左表全保留、右表匹配的行加进来、空格子填 NULL；RIGHT OUTER JOIN 相反（右表全留）；FULL OUTER JOIN 所有表所有行全保留、对不上的格子填 NULL。左表 = FROM 子句里的那张原表。"
        },
        {
          "question": "GROUP BY 与 HAVING 各解决什么问题？为什么聚合后 WHERE 不灵了？",
          "answer": "GROUP BY 把聚合从「整个数据集出一个值」变成「每组各出一个值」（如每个用户的发帖数）——最佳实践是把选中的非聚合列全部显式写进 GROUP BY。WHERE 在聚合发生前筛行，筛不了聚合结果；要按聚合值做条件（如发帖 ≥ 10 的用户）就用 HAVING——它本质是聚合版的 WHERE。"
        },
        {
          "question": "官方说「SQL 比你的代码快」，给的例子与底层原因是什么？",
          "answer": "例子：想要不重复的用户名，与其 SELECT 全表拉进内存再用 JS/Ruby 去重，不如 SELECT DISTINCT users.name FROM users 让 SQL 一步完成。原因：SQL 生来就快，内置查询优化器会审视整条查询、算出需要 JOIN 哪些表与最快的执行方式；自己搬运数据的时间成本远大于两种 SELECT 的差别。"
        }
      ],
      "optional": [],
      "note": "本课是 World 6 的知识主体：官方用一节「全世界最快的半完整 SQL 讲解」覆盖建表、CRUD、四种 JOIN、聚合与分组。Assignment 两条交互教程（SQL Teaching 与 SQL Bolt）都登记在资料区；正文引用的 Jeff Atwood 可视化 JOIN 文与 W3Schools 两页（Joins 课与 SQL 游乐场）同样收录，其中 W3Schools 对非浏览器请求返回 403 属站点反爬、带浏览器 UA 复核为 200（详见资料卡核验说明）。官方原文两处引用 W3Schools 游乐场同一地址——同页合并为一条资料。",
      "why": "这一课是整条后端路线的地基：World 7 的 Prisma ORM、身份认证、API 全都在你与数据库之间加了一层「翻译」——不懂 SQL 的人用 ORM 是盲人开车，查询慢了不知道为什么、N+1 问题看不出在哪。官方把「SQL 比你的代码快」单独成节也在预告一个工程判断：数据处理尽量下推给数据库，别把全表搬进 Node 进程内存里算。学完这课再做 SQL Zoo 项目，你会发现那些「head scratcher」查询其实是本课概念的组合拳。",
      "sections": [
        {
          "h": "开场：数据是 Web 应用的核心",
          "p": [
            "数据是任何好 Web 应用的核心，扎实的 SQL 功底能带你走很远：它让你不仅看懂 **ORM**（对象关系映射器——Rails 的 Active Record、Node.js 的 Prisma）在幕后做什么，还能自如地向数据提出更复杂的问题。SQL 的本质就是**向数据库提问**，偶尔也添加或修改内容。",
            "直白场景：显示 12 月用促销码 FREESTUFF 注册的所有用户；显示当前用户的全部评论、按话题与创建日期排序。复杂场景：按数量与总额列出发往「用户数超 1000 的州」的全部订单；或为市场分析问一句——哪些推广渠道产出的用户满足「每工作周读五篇文章」的参与度标准。",
            "这些都要你与数据库打交道。好在我们要专注的数据库都说 SQL；好在 SQL 总共几十个词里**常用的只有十几个**——它不是大语言，重点在背后的**概念**。官方作者的可视化方式：在脑子里想象 **Excel 表格移动、合并、按需重排**——找到你自己的方式很重要。",
            "资源现状说明（官方原话精神）：SQL 被收在灰尘覆盖的老手册与 90 年代风格网站里，连最好的书也写给需要全部细节的数据库工程师、显得莫名复杂；新学习者想抓概念，工具却没跟上——官方会尽力用现有工具把概念教给你。"
          ]
        },
        {
          "h": "表、主键与外键",
          "p": [
            "SQL 是与许多**关系型数据库**对话的语言。这些数据库用许多**表**存不同类型的数据（如 users 表与 posts 表）。",
            "表是电子表格式的长列表：每一**行**是一条不同的记录（或对象，如单个用户），每一**列**是该记录的一个属性（name、email 等）。",
            "所有表都包含的一列是 **ID 列**——唯一的行号，叫这条记录的「**主键**」。",
            "让一张表的某列指向另一张表的 ID，就能把表**链接**起来：posts 表的一行可以在 user_id 列里存作者的 ID——因为存着别的表的 ID，这列叫「**外键**」。"
          ]
        },
        {
          "h": "设置：CREATE、Schema 与索引",
          "p": [
            "第一类命令负责**设置**：建库（CREATE DATABASE）、建表（CREATE TABLE），以及修改或销毁它们的类似命令。",
            "数据库的设置信息存在一个叫「**Schema**」的特殊文件里，数据库结构每次变化它都更新。可以理解为：「这是我们的库，它有几张表；第一张叫 users，有 ID（整数）、name（一串字符）、email（一串字符）……各列。」",
            "除建表外，还能要求某列**只允许唯一值**（如用户名），或用 **CREATE INDEX** 给列建**索引**供以后更快搜索——索引提前替你把排序的苦力活干完，给将来要搜索的列（如 username）建索引会让数据库快得多。",
            "两个书写习惯：SQL 喜欢在行尾用**分号**；用**单引号**（'）而不是双引号（\"）。"
          ]
        },
        {
          "h": "操纵数据：CRUD 与子句",
          "p": [
            "库建好、空表就位后，用 SQL 语句开始填充数据。主要动作是 **CRUD**——Create、Read、Update、Destroy；你跑的大多数命令会落在「Read」，因为你会花大量时间向数据提问并展示它。",
            "每条 CRUD 命令都含几部分——**动作（语句）+ 运行的表 + 条件（子句）**。只给动作与表、不给条件，命令就作用于**整张表**，你多半会弄坏点什么。",
            "「删」的经典事故：DELETE FROM users 没带 WHERE——全表用户没了。你多半只想删一个：按（希望唯一的）属性写条件，如 DELETE FROM users WHERE users.id = 1。比较运算符（>、<、<= 等）圈一批行，逻辑运算符（AND、OR、NOT 等）串联子句：DELETE FROM users WHERE id > 12 AND name = 'foo'。",
            "「建」用 **INSERT INTO**：指明往哪些列插值、再给值本身（省略列名技术上可行，但是糟糕实践、普遍不鼓励）。INSERT 是少数不必担心选中哪些行的查询——它就是往表里加新行。",
            "「改」用 **UPDATE**：SET 什么数据（key=\"value\" 对）+ WHERE 改哪些行。**WHERE 命中多行就全改**（比如按常见名搜出多人）；真实世界按永远唯一的 ID 搜。",
            "「读」用 **SELECT**，最常见：SELECT * FROM users WHERE created_at < '2013-12-11 15:35:59 -0800'——星号 = 「所有列」。指定列时**表名列名一起给**：单表查询只写列名能混过去，一涉及多表 SQL 就会报错，所以永远写全：SELECT users.id, users.name FROM users。只要不重复的值用近亲 **SELECT DISTINCT**：SELECT DISTINCT users.name FROM users。"
          ]
        },
        {
          "h": "拼表：JOIN 的四种取舍",
          "p": [
            "想取某用户创建的全部帖子，就要告诉 SQL 用哪些列把表「拉链」到一起——**ON 子句**；执行拼接用 **JOIN**。",
            "两表数据不完全对上（一个用户多篇帖子）时保留哪些行？官方 tip：「**左**」表是原表——**FROM 子句里那张**（下例的 users）。四种可能：",
            "① **INNER JOIN**（即 JOIN）——你的好朋友、**95% 的使用场景**：只保留两表中匹配上的行。SELECT * FROM users JOIN posts ON users.id = posts.user_id 只返回真正写过帖子的用户、以及写明了作者的帖子；一个作者多篇帖子会返回多行（用户数据列重复出现）。",
            "② **LEFT OUTER JOIN**——左表所有行全保留，右表匹配上的行加进来；产生的空格子填 **NULL**（返回所有用户，有没有帖子都算；没帖子的 posts 列为 NULL）。",
            "③ **RIGHT OUTER JOIN**——相反：右表全保留。④ **FULL OUTER JOIN**——所有表所有行全保留，对不上的格子填 NULL。",
            "JOIN 自然也能带条件——只要 42 号用户的帖子：SELECT * FROM users JOIN posts ON users.id = posts.user_id WHERE users.id = 42。延伸看图：Jeff Atwood《SQL Joins 的可视化解释》与 W3Schools 的 Joins 课（资料区）。"
          ]
        },
        {
          "h": "聚合：函数、GROUP BY 与 HAVING",
          "p": [
            "普通查询返回一堆行；有时只想要**一个聚合值**，如某用户写帖的 **COUNT**。SQL 提供好用的「聚合」函数（SUM、MIN、MAX 等你预期该有的都有），写进 SELECT：SELECT MAX(users.age) FROM users。",
            "函数默认作用于**单列**；指定 * 只对部分函数有意义——COUNT(*) 数所有行，而 MAX(*) 说不通（「所有东西的最大值」是什么？）。**别名（AS）**给列或聚合结果改名以便后续称呼：SELECT MAX(users.age) AS highest_age FROM users。",
            "真正好玩的来了：对整个数据集出一个值不错，但对**特定分块**分别聚合再分组才有用——比如显示**每个**用户的发帖数（而不是所有人的总数）：SELECT users.id, users.name, COUNT(posts.id) AS posts_written FROM users JOIN posts ON users.id = posts.user_id GROUP BY users.id, users.name;。",
            "GROUP BY 里除 id 外还写了 name：把选中的**非聚合列全部显式写进 GROUP BY** 提升清晰度、符合最佳实践——虽然对多数数据库并非严格必需。",
            "最后一招：常规筛子集用 WHERE；但用过 COUNT 等聚合后 WHERE 就不灵了——按**聚合结果**做条件要用 **HAVING**，它本质是聚合版的 WHERE。只显示写过 10 篇以上帖子的用户：在 GROUP BY 后加 HAVING COUNT(posts.id) >= 10;。官方练习：去 W3Schools 游乐场把 Customers 与 Orders 表 JOIN 起来算各国订单数，加 HAVING COUNT(*) > 10;（并删掉上一行多余的分号）。",
            "官方宽心话：上面的讲解你多半在某处跟丢了，没关系——它覆盖的内容远超 10 分钟能吸收的量；指定阅读讲得更好，项目里有大量机会巩固。"
          ]
        },
        {
          "h": "SQL 比你的代码快",
          "p": [
            "学这些特别值，因为**聪明地用 SQL 构建查询，比把一大堆数据拉出数据库再用编程语言（Ruby 或 JavaScript）处理快得多**。",
            "例：想要所有不重复的用户名——你**可以** SELECT users.name FROM users 拉全表、再用 JS/Ruby 方法去重；但那要把全部数据搬出数据库、塞进内存、迭代一遍。改用 SELECT DISTINCT users.name FROM users，SQL 一步完成。",
            "SQL 生来就快：它有专门的**查询优化器**——审视你即将运行的整条查询，算出到底要 JOIN 哪些表、怎样执行最快。SELECT 与 SELECT DISTINCT 的差别，与你自己动手的时间成本相比可忽略。学好 SQL 才能写出「做得更多」的查询，让应用快得多。"
          ]
        },
        {
          "h": "Assignment 与结语",
          "p": [
            "Assignment 两条：① 过一遍 SQL Teaching 的交互式 SQL 教程；② 再做更深入的 SQL Bolt 交互式教程（两个链接在资料区）。",
            "官方结语：SQL 概念可能不好绕——尤其多 JOIN 结果的条件显示与分组。**普通 JOIN 与普通聚合函数为止的内容是核心知识**，务必下功夫吸收；真正高级的概念就算一直没到完全舒适也不碍事——将来只有一小部分场景用得到，到时候多半还是现查。",
            "下一步：在项目里练熟，再应用到后面课程的代码库。你很快会发现 **ORM 工具让生活美好得多、美好得多、美好得多**——只是用上那些更好更亮的东西之后，**别忘了老朋友 SQL**，好吗？"
          ]
        }
      ],
      "examples": [
        {
          "lang": "sql",
          "code": "INSERT INTO users (name, email) VALUES ('foobar', 'foo@bar.com');",
          "note": "「建」：INSERT INTO 指明列名再给值。省略列名技术上可行，但官方明说是糟糕实践。"
        },
        {
          "lang": "sql",
          "code": "UPDATE users\nSET name='barfoo', email='bar@foo.com'\nWHERE email='foo@bar.com';",
          "note": "「改」：SET 给 key=\"value\" 对、WHERE 圈行——WHERE 命中几行就改几行，所以真实世界按唯一的 ID 搜。"
        },
        {
          "lang": "sql",
          "code": "-- 事故版：没有 WHERE，全表清空\nDELETE FROM users;\n-- 正确版：按唯一属性圈定一行\nDELETE FROM users WHERE users.id = 1;",
          "note": "「删」的经典事故对照：CRUD 命令 = 语句 + 表 + 子句，缺了条件子句就作用于整张表。"
        },
        {
          "lang": "sql",
          "code": "-- 只要 42 号用户写过的帖子（INNER JOIN 只留匹配行）\nSELECT * FROM users\nJOIN posts ON users.id = posts.user_id\nWHERE users.id = 42;",
          "note": "拼表：ON 给「拉链列」，JOIN 默认是 INNER——只保留两表匹配上的行，95% 场景用它。"
        },
        {
          "lang": "sql",
          "code": "SELECT users.id, users.name, COUNT(posts.id) AS posts_written\nFROM users\nJOIN posts ON users.id = posts.user_id\nGROUP BY users.id, users.name\nHAVING COUNT(posts.id) >= 10;",
          "note": "分组聚合全家桶：JOIN 拼表 → GROUP BY 每用户一组 → COUNT+AS 起别名 → HAVING 按聚合结果筛「发帖 ≥ 10」的用户。"
        }
      ],
      "pitfalls": [
        {
          "title": "DELETE / UPDATE 不带 WHERE",
          "text": "官方点名的经典事故：DELETE FROM users 少了 WHERE 子句 = 删光全表用户。UPDATE 同理——WHERE 命中多行就全改（按常见名搜出十个人，十个人的邮箱一起被改）。写删改语句的肌肉记忆应该是：先写 WHERE、再回头补动作，且尽量按永远唯一的 ID 圈定。"
        },
        {
          "title": "多表查询不带表名前缀",
          "text": "单表查询只写列名能混过去，但一旦 JOIN 了两张表，同名列（两张表都可能有 name、created_at）会让 SQL 直接报错或悄悄取错表的列。官方纪律：永远写 users.id、posts.title 这样的全名——从单表时代就养成习惯。"
        },
        {
          "title": "聚合之后还想用 WHERE",
          "text": "WHERE 在聚合发生前筛行，所以 HAVING 出现之前的写法「WHERE COUNT(posts.id) >= 10」不成立——条件对象已经是聚合结果，必须用 HAVING（聚合版的 WHERE）。记法：筛「行」用 WHERE，筛「组」用 HAVING，两者可以同时出现在一条查询里、各管一层。"
        },
        {
          "title": "GROUP BY 漏写选中的非聚合列",
          "text": "SELECT users.id, users.name, COUNT(...) 而 GROUP BY 只写 users.id——多数数据库能跑，但官方明确：把选中的非聚合列全部显式写进 GROUP BY 提升清晰度、符合最佳实践（部分严格模式的数据库还会直接报错）。漏写的查询换个环境就可能炸。"
        },
        {
          "title": "把数据拉进代码里再处理",
          "text": "想要不重复用户名就把全表 SELECT 出来、再用 JS 去重——数据搬运 + 内存 + 迭代三重开销，而 SELECT DISTINCT 一步到位。SQL 有查询优化器、生来就快；能在数据库侧完成的筛选、去重、聚合，就别搬进 Node 进程里做。"
        }
      ],
      "official": {
        "assignment": [
          "过一遍这份来自 SQL Teaching 的交互式 SQL 教程",
          "过一遍这份来自 SQL Bolt 的更深入交互式 SQL 教程"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "Jeff Atwood《SQL Joins 的可视化解释》——正文推荐的 JOIN 图解（Coding Horror 博客）",
          "W3Schools 的 SQL Joins 课——正文推荐的更好讲解",
          "W3Schools 浏览器 SQL 游乐场——正文两处推荐的交互演示（GROUP BY 与 HAVING 练习都在这个地址）"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 databases/databases/databases_and_sql.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "5e6267136044a4fe1eaddfe5fe8c1f29685d1c47849a383319c01c4f1def2c9f",
        "verifiedAt": "2026-09-28"
      }
    },
    {
      "id": "node-path-databases-sql-zoo",
      "title": "Project: SQL Zoo",
      "zh": "项目：SQL Zoo",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/node-path-databases-sql-zoo",
      "summary": "World 6 的实战项目（Project 红线课：本站只拆解要求与给验收清单，不提供成品答案）。SQL Zoo 是线上少有的、真正让你在现成的表上构建并运行查询的资源：每个教程先给你看一张表，然后让你对它跑查询、回答特定问题。开头的查询都相当短，越往后越有挑战、到最后会有真正的「挠头题」。任务：进入 SQL Zoo 的 SQL Tutorial 区，把 Tutorial Section 下列出的 Tutorial 0–9 全部做完（包括标着 +/- 的那些），并做完每个教程末尾列出的 quizzes；第一个教程叫「SELECT basics」。两个官方提示：主页右上角的 Engine 下拉框确认选 MySQL（默认值）；结果集很大时会被截断、不会显示所有行列，所以「答案」看起来可能不是 100% 正确——别因此怀疑自己。做完之前官方还想收集你的反馈：填写 SQL 课程反馈表（行政表单，链接不收录）。这个项目正是上一课全部概念的组合练习场：SELECT 与 WHERE、ORDER BY 与 DISTINCT、JOIN、聚合与 GROUP BY、子查询与集合操作——教程序号一路走高，就是在按这个顺序把你从「看得懂」推向「写得出」。",
      "guide": "以下是官方原课的中文化梳理。**项目是什么**：SQL Zoo 是线上少有的资源——它真正让你**在现存的表上构建并运行查询**。每个教程会展示一张表，然后让你对它跑查询、回答特定的问题。有些查询（尤其开头）相当短；到后面**难度肯定会升上来**，会有真正的挠头题（real head scratchers）。**怎么做**：① 进入 SQL Zoo 的 SQL Tutorial 页，做「Tutorial Section」下列出的 **Tutorial 0–9**（**包括标着 +/- 的那些**），并做完每个教程末尾列出的 **quizzes**；第一个教程叫「**SELECT basics**」。② 两个官方注意事项：主页右上角的 **Engine 下拉框**要确认显示 **MySQL**（默认值）；**大结果集会被截断**——不会显示所有行或列，所以「答案」看起来可能不是 100% 正确，这是站点显示限制、不是你写错了。③ 继续前进之前，官方想收集你的反馈——填写 SQL 课程反馈表（行政表单，本站不收录链接）。**本站拆解（非官方）**：Tutorial 0–9 的知识脉络与上一课一一对应——0 SELECT basics（SELECT/WHERE 起步）、1 SELECT from World（条件与比较运算）、2 SELECT from Nobel（字符串匹配与 LIKE）、3 SELECT in SELECT（子查询）、4 SELECT from bbc（聚合 COUNT/SUM/AVG 与 GROUP BY）、5 SUM and COUNT（聚合进阶与 HAVING）、6 JOIN（两表拼接）、7 More JOINs（JOIN 综合、GROUP BY 配合）、8 Using NULL（NULL 语义与 OUTER JOIN 的空格）、9 Self JOIN（同表自连接的头脑体操）。每做完一个 Tutorial 就把对应概念回扣到「数据库与 SQL」课的那一节——查询卡住时先想「我要筛行（WHERE）还是筛组（HAVING）」「我漏了 ON 的拉链列吗」，再回正文找答案。**完成标准**：0–9 全部教程（含 +/- 标记项）跑通、每个教程末尾 quiz 做完；Engine 全程 MySQL；遇到截断结果能认出「这是显示限制」。做完这个项目，World 6 的三课就闭环了——下一站 World 7 用真数据库跑 NodeJS 后端。",
      "understand": [
        "SQL Zoo 的价值在**真实执行**：不是读文章，而是在现成的表上亲手构建并运行查询、回答特定问题",
        "任务范围 = **Tutorial 0–9 全部**（**含标 +/- 的教程**）+ 每个教程末尾的 **quizzes**；第一个教程叫 SELECT basics",
        "**Engine 下拉框选 MySQL**（默认值）——不同 SQL 引擎语法有细微差异，官方指定 MySQL",
        "**大结果集会被截断**（不显示所有行列）——「答案」看起来不是 100% 正确属站点显示限制，不是你的查询错了",
        "难度曲线：开头查询很短，越往后越挑战、最后是真正的挠头题——卡住是正常的，回「数据库与 SQL」课找概念",
        "本站不提供任何查询的成品答案（Project 红线）——拆解与验收清单帮你自查，答案要你自己写出来"
      ],
      "terms": [
        {
          "en": "SQL Zoo",
          "zh": "在线 SQL 练习站：给出真实的表、让你构建并运行查询回答问题——本项目的练习场"
        },
        {
          "en": "SELECT basics",
          "zh": "Tutorial 0 的名字：从最基础的 SELECT 查询起步"
        },
        {
          "en": "Engine (MySQL)",
          "zh": "SQL Zoo 右上角的数据库引擎选项——官方要求确认选 MySQL（默认）"
        }
      ],
      "tasks": [
        "打开 SQL Zoo 的 SQL Tutorial 页，先确认主页右上角 Engine 下拉框为 MySQL，然后从 Tutorial 0「SELECT basics」开始逐个推进",
        "把 Tutorial 0–9 全部做完——包括标着 +/- 的那些；每个教程末尾列出的 quizzes 也全部做完（官方任务第 1 条，链接在资料区）",
        "每完成一个 Tutorial，回「数据库与 SQL」课把对应概念重读一遍（如 6 JOIN → 拼表一节、5 SUM and COUNT → 聚合一节）——把「会做题」升级为「说得清为什么」",
        "遇到结果显示不全时先核对官方提示：大结果集会被截断，「答案」可能看起来不是 100% 正确——判断自己的查询逻辑而不是逐行比对显示结果",
        "全部做完后填写官方的 SQL 课程反馈表（行政表单，链接不收录）——你的反馈帮助官方持续改进课程"
      ],
      "quiz": [
        {
          "question": "这个项目的任务范围是什么？有哪两个容易漏掉的点？",
          "answer": "SQL Zoo 的 Tutorial 0–9 全部 + 每个教程末尾的 quizzes。容易漏：① 标着 +/- 的教程也要做（官方特意括注）；② quizzes 不是可选项，是每个教程的组成部分。第一个教程叫 SELECT basics。"
        },
        {
          "question": "Engine 下拉框要设成什么？为什么这值得官方单独提醒？",
          "answer": "MySQL（默认值）。SQL 有方言差异——同一条查询在不同引擎下行为或语法可能不同，官方教程与答案都以 MySQL 为准；引擎选错会让你对「明明写对了却报错」产生误判。"
        },
        {
          "question": "查询结果与预期「答案」对不上时，官方给的第一个排查方向是什么？",
          "answer": "先想起官方的截断提示：大结果集会被截断、不会显示所有行或列，所以「答案」看起来可能不是 100% 正确——这是站点显示限制。确认截断因素后，再回头检查查询逻辑本身（WHERE 条件、JOIN 的 ON 列、GROUP BY 是否完整）。"
        }
      ],
      "optional": [],
      "note": "Project 红线课：本站不提供任何查询的成品答案——guide 里的 Tutorial 脉络拆解与完成标准为本站自拟（非官方内容），供自查用。官方 Assignment 第 2 条为 SQL 课程反馈表（Google 表单），按行政表单口径剔除、不收录链接。SQL Zoo 站点本身登记在资料区（命令行核验 200）。",
      "why": "读十篇 SQL 文章不如亲手跑十条查询——这个项目的全部意义就是把上一课「最快的半完整讲解」里的每个概念按进真实执行环境里验证一遍。SQL Zoo 的教程序列本身就是一条设计好的难度坡：从 SELECT basics 到 Self JOIN，正好覆盖 World 6 需要「必须吸收」的核心知识圈。官方说最后的题是「真正的挠头题」——那些卡住又突破的瞬间，才是把 SQL 从「看得懂」变成「写得出」的地方；而 World 7 的 Prisma、认证与 API 项目全都要靠这双手感托底。",
      "sections": [
        {
          "h": "项目是什么：在真实的表上跑查询",
          "p": [
            "**SQL Zoo** 是线上少有的资源——它真正让你**对现存的表构建并运行查询**。",
            "每个教程先展示一张表，然后让你对它跑查询、**回答特定的问题**。",
            "难度曲线是官方明说的：有些查询（尤其开头）**相当短**；越往后**肯定越有挑战**，最后会有真正的**挠头题**（head scratchers）——卡住是这个项目设计的一部分。"
          ]
        },
        {
          "h": "官方任务与两个注意事项",
          "p": [
            "任务本体：进入 SQL Zoo 的 **SQL Tutorial** 页，做「Tutorial Section」下列出的 **Tutorial 0–9**（**包括标着 +/- 的那些**），并做完每个教程末尾列出的 **quizzes**；第一个教程叫「**SELECT basics**」。",
            "注意事项一：主页右上角 **Engine 下拉框**确认显示 **MySQL**（默认值）——引擎选错，语法差异会让你误判自己的查询。",
            "注意事项二：**大结果集会被截断**——不会显示所有行或列，所以「答案」看起来可能不是 100% 正确；这是显示限制，先排除它再怀疑查询逻辑。",
            "收尾：官方请在继续前进前填写 **SQL 课程反馈表**（行政表单，链接不收录）——用户反馈帮助官方持续改进课程。"
          ]
        },
        {
          "h": "本站拆解：Tutorial 0–9 与上一课的概念对应（非官方）",
          "p": [
            "教程序列与「数据库与 SQL」课的知识脉络一一对应：**0 SELECT basics**（SELECT/WHERE 起步）→ **1 SELECT from World**（条件与比较运算）→ **2 SELECT from Nobel**（字符串匹配与 LIKE）→ **3 SELECT in SELECT**（子查询）→ **4 SELECT from bbc**（聚合 COUNT/SUM/AVG 与 GROUP BY）→ **5 SUM and COUNT**（聚合进阶与 HAVING）→ **6 JOIN**（两表拼接）→ **7 More JOINs**（JOIN 综合与 GROUP BY 配合）→ **8 Using NULL**（NULL 语义与 OUTER JOIN 的空格）→ **9 Self JOIN**（同表自连接）。"
          ],
          "list": [
            "每做完一个 Tutorial，回上一课重读对应小节——把「会做题」升级成「说得清为什么」",
            "查询卡住的排查顺序：先想筛行（WHERE）还是筛组（HAVING）→ 再查 JOIN 的 ON 拉链列 → 再查 GROUP BY 是否把选中的非聚合列写全",
            "本站不提供成品答案（Project 红线）——上面的拆解与验收口径帮你自查，查询要自己写出来"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "Engine 没选 MySQL 就开始做题",
          "text": "SQL Zoo 支持切换多种数据库引擎，官方特意提醒确认右上角下拉框为 MySQL（默认值）。不同引擎的方言差异会让同一条查询报错或结果不同——你以为自己概念错了，其实只是引擎不对。开局第一件事：核对 Engine。"
        },
        {
          "title": "被截断的结果集带偏",
          "text": "官方明示：大结果集会被截断、不显示所有行列，「答案」看起来可能不是 100% 正确。逐行比对显示结果来验证查询的人会陷入自我怀疑——正确姿势是核对查询逻辑（条件、JOIN、分组）与行数/聚合值这类结构性特征，而不是肉眼比对被截断的明细。"
        },
        {
          "title": "跳过 +/- 标记教程与末尾 quizzes",
          "text": "官方任务写得明确：Tutorial 0–9 **包括标着 +/- 的那些**，且每个教程末尾的 quizzes 也在范围内。+/- 教程与 quiz 恰恰是巩固与变式训练——跳过它们，后面「挠头题」卡住的概率会显著升高，World 7 的数据库实战也会跟着吃力。"
        }
      ],
      "official": {
        "assignment": [
          "进入 SQL Zoo，做「Tutorial Section」下列出的 Tutorial 0–9（包括标着 +/- 的那些）以及每个教程末尾列出的 quizzes；第一个教程叫「SELECT basics」。注意：主页右上角的 Engine 下拉框确认选 MySQL（默认值）；大结果集会被截断、不显示所有行列，「答案」看起来可能不是 100% 正确",
          "继续前进之前，填写官方的 SQL 课程反馈表（行政表单，链接不收录）——用户反馈帮助官方持续改进课程"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 databases/databases/project_sql_zoo.md（本站自行编写简体讲解与任务拆解，未改编自任何第三方中文课程；Project 红线：不提供成品答案）",
        "sha256": "8639aadcec2c68c984ecf07593861d5986b17e71a262616e8065e8bd2c76c562",
        "verifiedAt": "2026-09-28"
      }
    }
  ]
};
