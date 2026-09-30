/* courses/javascript.js — World 3「JavaScript」已开放课程正文（v2 自足格式）。
 *
 * 沿用 courses/ 按 World 分文件的架构（2026-09-25 路径课试点批次 1 首建，
 * 复用事实见 REUSE-NOTES.md「路径课试点轮复用事实」节）：lessons.js 继续作为
 * Foundations 的唯一事实源不动（46 课已发布上线，是稳定资产）；本文件只放
 * World 3 已开放的课程，未开放的章节与课程不得夹带正文（红线）。
 *
 * 数据约定（与 intermediate-html-and-css.js 同一套）：
 *   - 每课的 id 就是 curriculum.js 里的原始 slug，原样沿用、不得改写；
 *   - group 字段是本文件 groups 数组的数字下标（从 0 起且在本文件内连续）；
 *     groups 按官方章节顺序一次写全 8 项（含尚未开放章节——分组名是官方结构
 *     事实，不是课程内容，不构成「批量灌入正文」）；
 *   - 课的字段结构与 lessons.js 完全同构（19 字段 v2 自足格式）；
 *   - 中文课名按 catalog.js 惯例自拟，登记在本文件头注释与 SOURCES.md：
 *     批次 4 阶段 1（2026-09-26，v4.11.23）「引言」+「组织 JavaScript 代码」15 课：
 *     How This Course Will Work → 这门课程怎么学（与 Foundations 第 1 课同题不同课，
 *       官方无 Assignment 节，结构豁免同第 46 课先例）；
 *     Organizing Code with Objects → 用对象组织代码；Object Constructors → 对象构造器；
 *     Project: Library → 项目：图书库（Project 红线课，examples 空数组）；
 *     Factory Functions and the Module Pattern → 工厂函数与模块模式；
 *     Project: Tic Tac Toe → 项目：井字棋（Project 红线课）；Classes → 类；
 *     ES6 Modules → ES6 模块；npm → npm；Webpack → Webpack；
 *     Project: Restaurant Page → 项目：餐厅页面（Project 红线课）；
 *     Revisiting Webpack → 再探 Webpack；JSON → JSON；OOP Principles → OOP 原则；
 *     Project: Todo List → 项目：待办清单（Project 红线课）。
 *   - 官方 Markdown 住在 curriculum 仓 javascript/ 根目录（不在 foundations/ 下）；
 *     两处 slug 与官方文件名不同形：es6_modules.md 对 slug javascript-es6-modules、
 *     webpack.md 对 slug javascript-webpack（这两课 slug 不带 node-path-javascript-
 *     前缀，与同章其余课不同形）；project_*.md 带前缀对 slug 去前缀（library /
 *     tic-tac-toe / restaurant-page / todo-list，同类先例第 4–7 例）。 */
window.ODIN_COURSE_JAVASCRIPT = {
  version: 1,
  course: {
    id: 'javascript',
    en: 'JavaScript',
    zh: 'JavaScript',
    url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript'
  },
  groups: [
    { en: 'Introduction', zh: '引言' },
    { en: 'Organizing Your JavaScript Code', zh: '组织 JavaScript 代码' },
    { en: 'JavaScript in the Real World', zh: '真实世界的 JavaScript' },
    { en: 'Asynchronous JavaScript and APIs', zh: '异步 JavaScript 与 API' },
    { en: 'Testing JavaScript', zh: '测试 JavaScript' },
    { en: 'A Bit of Computer Science', zh: '一点计算机科学' },
    { en: 'Intermediate Git', zh: 'Git 进阶' },
    { en: 'Finishing Up with JavaScript', zh: 'JavaScript 收尾' }
  ],
  lessons: [
    {
      "id": "node-path-javascript-how-this-course-will-work",
      "title": "How This Course Will Work",
      "zh": "这门课程怎么学",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-how-this-course-will-work",
      "summary": "JavaScript 课程的开篇导语：这门课会深入 JavaScript 语言本身，覆盖原型继承、模块化、打包、异步代码与测试等前端主题。官方特意把这些基本功放在 React 之前——框架的很多做法看似魔法，有了扎实的 JS 地基才能看懂底层发生了什么。旅程会很难、会不断遗忘，但这正常：不需要记住学过的每件事。",
      "guide": "以下是官方原课的中文化梳理。这是 World 3 的第一课，性质与 Foundations 第 1 课相同——不教具体技术，先交代这门课学什么、为什么这样安排、以及怎么面对「学了就忘」。官方给了两个关键预期：其一，这门课深入语言本身（原型继承、模块化、打包、异步、测试），并且刻意在 React 之前用「原味」（vanilla）环境练基本功——框架里那些看似魔法的写法，底层全是这门课要讲的东西；其二，遗忘是学习旅程的一部分，不需要背下所有知识，忘了就回来查。正文很短，读完带着正确预期进入第 2 课即可。",
      "understand": [
        "做 Web 就绕不开 JavaScript——无论你爱它还是恨它；这门课会深入语言本身，而不只是停在使用层",
        "课程覆盖的主题：原型继承（prototypal inheritance）、模块化（modularization）、打包（bundling）、异步代码（asynchronous code）、JavaScript 测试",
        "先用原味（vanilla）环境练基本功、再进 React 是刻意安排：框架常有非常具体甚至反直觉的做法，看起来像魔法——带着好的 JS 与前端地基去学，才能理解它们在底层真正做什么",
        "Ruby 路径的学习者注意：看起来一样、甚至同名的东西，在 JavaScript 里不一定按同样的方式工作",
        "你会忘掉之前课程学过的东西，也会边学边忘这门课的内容——这很正常，不需要记住学过的每件事（官方专门链了一篇讲「记忆与学编程」的文章）"
      ],
      "terms": [
        {
          "en": "Prototypal inheritance",
          "zh": "原型继承：JavaScript 对象经由「原型」共享行为的机制，是这门课要深挖的语言核心之一"
        },
        {
          "en": "Modularization",
          "zh": "模块化：把代码拆成职责单一、可复用的小模块来组织——本课章节「组织 JavaScript 代码」的主线"
        },
        {
          "en": "Bundling",
          "zh": "打包：用工具（如 Webpack）把多个模块文件合并成浏览器可高效加载的产物，本章后半会动手搭"
        },
        {
          "en": "Vanilla",
          "zh": "「原味」：不加框架与库、只用语言与浏览器原生能力写代码——官方刻意让你先在这种环境里练基本功"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：建立对这门课范围（原型继承 / 模块化 / 打包 / 异步 / 测试）与节奏的预期",
        "读官方链接的 dev.to 文章 Memorization and Learning to Code：把「不需要记住每件事」从安慰变成方法——忘了就查，查多了自然记住",
        "给自己定一个可持续的学习节奏（官方原话：好好休息、包扎一下、继续前进）——这门课的体量比 World 2 更大"
      ],
      "quiz": [
        {
          "question": "这门 JavaScript 课程覆盖哪些主题？官方为什么把它们放在 React 之前？",
          "answer": "覆盖原型继承、模块化、打包、异步代码与 JavaScript 测试等主题。放在 React 之前是刻意安排：React 这类工具常有非常具体的做法，看似魔法甚至反直觉——先在原味（vanilla）环境里把这些基本功练扎实，之后才能理解框架在底层真正做什么，学习体验会好得多。"
        },
        {
          "question": "官方对「学了就忘」给了什么定心丸？",
          "answer": "遗忘是旅程的一部分：你会忘掉之前课程的内容，也会边学这门课边忘。官方特别提醒「你不需要记住学过的每件事」（并链了 dev.to 上关于记忆与学编程的文章）——忘了回来查就好，学习旅程本身就很难，休息好了继续走。"
        },
        {
          "question": "Ruby 路径过来的学习者被官方特别警告了什么？",
          "answer": "不要因为某个东西看起来与 Ruby 里的相同、甚至同名，就认为它的工作方式完全一样——JavaScript 与 Ruby 是两门语言，同名概念的行为可能差别很大。保持这份警觉就好。"
        }
      ],
      "optional": [],
      "note": "官方原文没有 Assignment 节（全站第二个无作业结构豁免课，先例是第 46 课 Choose Your Path Forward）：本站不添加任何作业，tasks 是按正文内容整理的学习建议。官方也没有 Lesson overview 节。正文唯一外链是 dev.to 的记忆文章，已登记进本课资料。与 Foundations 第 1 课同题（How This Course Will Work）但为两门课各自的开篇：slug 不同（本课带 node-path-javascript- 前缀）、正文内容不同，全站 id 唯一性由汇总层测试钉住。",
      "why": "开篇导语决定你带着什么预期上路：知道这门课要深挖语言本身、知道「先 vanilla 后 React」的用意，你在后面遇到原型链、打包配置这些硬骨头时才不会怀疑「学这些有什么用」；知道遗忘是正常的，你才不会在第三次忘掉 class 语法时判定自己不适合编程。五分钟读完它，换来的是整门课的正确打开方式。",
      "sections": [
        {
          "h": "这门课学什么：深入 JavaScript 语言本身",
          "p": [
            "官方开篇很直接：JavaScript——无论你爱它还是恨它，做 Web 就总要和它打交道。这门课不再停留在「会用」的层面，而是**深入语言本身**。",
            "点名的主题包括：**原型继承**（prototypal inheritance）、**模块化**（modularization）、**打包**（bundling）、**异步代码**（asynchronous code）与 **JavaScript 测试**——它们分别对应本课程后面的几个章节：组织代码、真实世界的 JavaScript、异步与 API、测试，以及「一点计算机科学」。",
            "除了语言本身，课程还会探索 JavaScript 在前端的许多使用方式——你现在做的每一个小项目，都是在为后面的大项目攒手感。"
          ]
        },
        {
          "h": "为什么先练「原味」基本功，再进 React",
          "p": [
            "官方特意强调这个顺序：在跳进 React 这类工具构建更复杂的前端之前，先在**原味（vanilla）环境**里把这些基本功练出实际经验。",
            "原因写得也很坦白：那类工具往往有**非常具体的做事方式**，看起来像魔法、甚至反直觉。但如果你带着扎实的 JavaScript 与前端开发地基去学它们，就能理解它们在底层真正做什么——学习体验会完全不同。",
            "换句话说：这门课里每个「为什么要这样写」的问题都值得较真，因为答案就是将来看懂框架的地基。"
          ]
        },
        {
          "h": "给 Ruby 路径学习者的提醒",
          "p": [
            "官方课程有 JavaScript 与 Ruby 两条路径，这门课在 Ruby 路径里出现得稍晚——那边的学习者对部分概念已有接触。",
            "但官方紧接着警告：**看起来一样、甚至同名，不代表工作方式完全一样**。Ruby 的 class 与 JavaScript 的 class、Ruby 的 module 与 JS 的模块化，底层机制各有不同。带着这份警觉学，就不会把旧语言的直觉错套到新语言上。（本站学习者走 JavaScript 路径，此节作背景了解即可。）"
          ]
        },
        {
          "h": "旅程预期：会忘、会难、继续走",
          "p": [
            "这门课的工作方式与你已经走过的路很像：读原文、查资料、动手做。官方提前打了预防针：**你会忘掉之前课程学过的东西，也会边学这门课边忘**，之后的课程里还会再忘。",
            "解药不是硬背——官方链了一篇 dev.to 文章（Memorization and Learning to Code），核心观点是**你不需要记住学过的每件事**：忘了就查，用得多了自然留在脑子里。",
            "官方原话说得很豪迈：要覆盖的地盘很大，你的大脑可能会 meltdown 几次——但没关系，这只是皮外伤（it's just a flesh wound）。学习旅程本来就难，好好休息、包扎一下、继续前进。**别光说了——开始学吧！**"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "把「先 vanilla 后框架」当成绕远路",
          "text": "急着上 React 跳过这门课，等于把框架的每个写法都当魔法背下来——遇到 bug 只能靠搜。官方刻意把基本功放前面：原型、模块、异步这些正是 React 底层在用的东西，先学它们不是绕路，是唯一能看懂框架的路。"
        },
        {
          "title": "把「忘了」当成「没学会」",
          "text": "这门课信息密度高，忘得快是正常生理现象，不是能力问题。官方给的方法是「不需要记住每件事」：忘了就回来查本站讲解或官方原文，重复接触几次自然记住——用重复代替自责。"
        },
        {
          "title": "Ruby 经验直接平移",
          "text": "如果你学过 Ruby：同名概念（class、module、symbol 等）在 JavaScript 里的行为可能完全不同。别凭「看起来一样」下结论，每个概念都以本课讲解与实测为准。（只学过 JS 的学习者没有这个坑，但同理：也别把 Python/Java 的直觉平移过来。）"
        }
      ],
      "official": {
        "assignment": [],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/introduction/how_this_course_will_work.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "63c178a93574d533685e1e7bbc55bcca54604233b71b65c750b7fbbf0c2c13e0",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-javascript-organizing-code-with-objects",
      "title": "Organizing Code with Objects",
      "zh": "用对象组织代码",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-organizing-code-with-objects",
      "summary": "「组织 JavaScript 代码」章节的起点课：从 Foundations 的对象基础回炉，把对象从「存数据的键值对」升级成「组织代码的核心手段」——用命名空间收纳相关数据、用方法收纳功能逻辑、用 this 让方法操作自己所在对象的数据。官方用井字棋玩家、汽车、石头剪刀布游戏三个例子层层递进：几乎任何东西都能建模成对象，属性是它「有什么」，方法是「怎么和它交互」。",
      "guide": "以下是官方原课的中文化梳理。这一课回答一个问题：为什么整个章节叫「组织 JavaScript 代码」，而第一课讲的是对象？因为对象是 JavaScript 组织代码的第一块基石——后面几课的构造器、工厂函数、类、模块，全是「造对象、管对象」的不同手法。本课先把地基打牢：对象不只是数据容器（把 playerOneName、playerOneMarker 这类散装变量收进 playerOne 对象），还是功能容器（方法 + this 让数据和操作数据的代码住在一起）。官方特意用你做过的井字棋与石头剪刀布当例子——从「熟悉的游戏」抽象出「对象建模」的思维，是本课最重要的收获。本课没有官方作业，读完正文即可进入下一课。",
      "understand": [
        "对象字面量是定义对象最常用的方式；取值有点记法与方括号记法两种——点记法更干净但用不了变量与带空格的键，方括号记法可以",
        "用对象组织**数据**：把相关的键值对收进一个对象（如 playerOne 的 name 与 marker），变量名更短、语境更清晰，还能整个对象传给函数，函数天然拿到全部属性",
        "「命名空间」效应：name 这类通常不能在同一作用域重复用的名字，经由 playerOne.name / playerTwo.name 可以共存",
        "用对象组织**功能**：方法是「属于对象的函数」，this 指向方法被调用的那个对象——数据与操作数据的逻辑住在一起，这是面向对象编程（OOP）的核心思想之一",
        "对象字面量里写方法时不能用箭头函数：箭头函数里的 this 行为与传统函数不同，不会如你预期指向对象本身（后面课程会展开为什么）",
        "几乎任何东西都能建模成对象：问自己「它有哪些属性（物理的或概念的）」与「怎么和它交互」——前者是属性、后者是方法；抽象事物（游戏、库存管理器、事件监听器）同样适用",
        "下划线前缀（_someProperty）是开发者约定的「伪私有」标记：表示该属性只供对象内部使用——对象字面量没有真正的私有属性，真私有的实现方式后面课程才讲"
      ],
      "terms": [
        {
          "en": "Object literal",
          "zh": "对象字面量：用花括号直接写出的对象定义方式，最常用的造对象手法"
        },
        {
          "en": "Dot / bracket notation",
          "zh": "点记法 / 方括号记法：两种取属性方式——点记法干净但不能用变量与含空格的键，方括号记法两者都行"
        },
        {
          "en": "Method",
          "zh": "方法：作为对象属性存放的函数——对象不只能装数据，还能装行为"
        },
        {
          "en": "this",
          "zh": "this 关键字：在方法里指向「方法被调用的那个对象」，用来读写对象自己的属性；箭头函数里的行为不同（本课只需知道别用箭头函数写方法）"
        },
        {
          "en": "Namespace",
          "zh": "命名空间：把同名的属性收纳在不同对象下（playerOne.name / playerTwo.name），避免命名冲突"
        },
        {
          "en": "OOP (Object Oriented Programming)",
          "zh": "面向对象编程：以「对象」为核心的编程范式——对象同时包含数据（属性/字段）与代码（方法），程序被设计成对象之间的交互"
        },
        {
          "en": "Underscore convention (_prop)",
          "zh": "下划线前缀约定：标记「这个属性是内部用的、外面别碰」——纯约定，语言层面并没有真的禁止访问"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：重点吃透「对象组织数据」与「对象组织功能」两个升级",
        "回看 Foundations 第 44 课（对象基础）与本站讲解的点/方括号记法差异——本课的回炉部分如果你已经熟练，快速过即可",
        "亲手把官方的 rps（石头剪刀布）对象敲一遍：playRound / getWinningPlayer / reset 三个方法先在脑子里过一遍各自要做什么，再看官方给的骨架",
        "做一个小练习：挑一个你做过的项目（如图书清单、计算器），口述「它有哪些属性、有哪些方法」——这是下一课构造器与工厂函数的前置思维"
      ],
      "quiz": [
        {
          "question": "点记法与方括号记法各在什么情况下必须用哪个？",
          "answer": "点记法更干净、通常是首选，但两种情况用不了：键名含空格等特殊字符（myObject[\"obnoxious property\"] 只能方括号），以及键名存在变量里（myObject[variable] 取变量的值当键；myObject.variable 找的是名叫 variable 的属性，多半是 undefined）。"
        },
        {
          "question": "把 playerOneName / playerOneMarker 四个散装变量改成 playerOne / playerTwo 两个对象，好处除了名字短还有什么？",
          "answer": "① 命名空间：两个玩家都能有 name 和 marker 属性而不冲突；② 传递方便：函数只需接一个对象参数就能拿到全部属性，将来加新属性不用改函数签名；③ 语境清晰：playerOne.name 一眼看出是谁的名字。数据越多（如购物网站的库存条目），收益越大。"
        },
        {
          "question": "方法里的 this 指向什么？为什么官方警告对象字面量的方法不要用箭头函数写？",
          "answer": "this 指向「方法被调用的那个对象」——car.applyDiscount() 里的 this 就是 car，方法因此能读写对象自己的属性。箭头函数里的 this 行为与传统函数表达式（含简写方法语法）不同，不会如你预期指向对象本身——官方说细节后面的课展开，现在只需记住：对象字面量里写方法用 function 或简写语法，别用箭头函数。"
        },
        {
          "question": "把一个「东西」建模成对象时，官方给的通用提问法是什么？",
          "answer": "问两个问题：「它有哪些属性（物理的或概念的）？」——答案成为对象的属性；「怎么和它交互？」——答案成为对象的方法。实物（汽车的 make/model/year）与抽象物（游戏的分数、playRound/reset）都适用；官方把这类对象比作小机器：属性是仪表盘上的显示，方法是让机器干活的按钮。"
        }
      ],
      "optional": [],
      "note": "官方 Assignment 明文「这一课没有作业」：官方解释 JavaScript 大量概念围绕 OOP，本课只铺垫基本思想，后续课程会通过多种造对象、用对象的技术更实操地展开。本站不另行添加作业。官方正文有两个提示块（箭头函数与 this、下划线伪私有约定），均已并入本站讲解。",
      "why": "这是「组织 JavaScript 代码」整个章节的思维起点：后面每一课——构造器、工厂函数、类、模块——都是在回答「怎么更好地造对象、管对象」。如果这一课「属性 = 它有什么、方法 = 怎么和它交互」的建模直觉没有建立，后面的课就会退化成语法背诵。反过来说，把这个直觉练扎实，你将发现自己看任何代码库都在自动做同一件事：找到对象、看它的属性、看它的方法。",
      "sections": [
        {
          "h": "回炉：对象字面量与两种取值记法",
          "p": [
            "Foundations 第 44 课已经学过对象的基本用法，这里快速回炉。定义对象最常用的方式是**对象字面量**：花括号里写键值对，值可以是任何类型——字符串、数字、函数都行。",
            "取值有两种记法：**点记法**（`myObject.property`）更干净、通常是首选；**方括号记法**（`myObject[\"obnoxious property\"]`）则在两种情况下不可替代：键名含空格等特殊字符，以及**键名存在变量里**。",
            "变量这点最容易踩：`myObject.variable` 找的是名叫 `variable` 的属性（多半返回 undefined）；`myObject[variable]` 才是拿变量的值当键去取。"
          ]
        },
        {
          "h": "对象作为数据结构：从散装变量到命名空间",
          "p": [
            "官方用井字棋举例：不用对象时，你得写 `playerOneName`、`playerTwoName`、`playerOneMarker`、`playerTwoMarker` 四个又长又孤立的变量；用对象后，是两个各自收纳了 name 与 marker 的 `playerOne`、`playerTwo`。",
            "第一层好处是**命名空间**：`name` 和 `marker` 这种通常不能在同一作用域里重复使用的名字，挂在不同对象下就能共存，而且 `playerOne.name` 读起来语境自明。",
            "第二层好处是**传递**：`gameOver(winningPlayer)` 只接一个对象参数，函数体内就能访问它的全部属性——将来给玩家对象加新属性，函数签名一个字都不用改。官方点破：数据一多（想想购物网站的大库存），用对象把每件商品的名称、价格、描述收在一起是唯一可行的路。"
          ]
        },
        {
          "h": "对象作为设计模式：方法与 this",
          "p": [
            "对象的分组能力不止用于数据，还能用于**功能**——这是面向对象编程（OOP）的核心思想之一：对象同时容纳数据（属性/字段）与代码（方法），程序被设计成对象之间的交互。",
            "**方法**就是「作为对象属性的函数」。官方的汽车例子：属性有 make / model / year / color / priceUSD，方法有 `applyDiscount(discountPercentage)`（打折改价）与 `getSummary()`（一句话汇总）——方法里用 **this** 读写对象自己的属性。",
            "this 指向「方法被调用的那个对象」：`car.applyDiscount(10)` 里的 this 就是 car。方法可以像普通函数一样复用，但名字挂在对象上、数据就在手边——比每次手写一遍逻辑体面得多。",
            "**官方警告（原文提示块）**：对象字面量里写方法别用**箭头函数**——箭头函数里的 this 行为与传统函数表达式（含 `getSummary()` 这种简写语法）不同，不会如你预期指向对象本身。为什么不同、this 到底怎么绑定，后面的课会展开；现在记住结论就行。"
          ]
        },
        {
          "h": "抽象事物也是对象：石头剪刀布的例子",
          "p": [
            "物理实体好建模，抽象概念呢？官方拿你在 Foundations 做过的石头剪刀布开刀：一个游戏对象，基本盘是**两个分数属性**（playerScore / computerScore）加**一个玩一轮的方法**（playRound，玩完顺手更新分数、返回谁赢）；锦上添花的还有 `getWinningPlayer()`（当前谁领先）与 `reset()`（清零重开）。",
            "用起来非常顺手：`rps.playRound(\"rock\")` 返回 \"player\"、`rps.playerScore` 变 1；玩够了 `rps.reset()` 全部归零。分数（状态）和改分数的逻辑（行为）住在同一个对象里，谁也不会散落得到处都是。",
            "**官方补充（原文提示块）——下划线伪私有约定**：野外的代码里你会见到 `_someProperty` 这种下划线开头的属性名。那是开发者约定，意思是「这是内部用的（比如辅助方法），对象外面别读别调」。对象字面量**没有真正的私有属性**——下划线只是君子协定，语言层面照样能从外面访问。真私有的实现方式（确实能在语言层面挡住外部访问）涉及更进阶的机制，后面的课会讲。"
          ]
        },
        {
          "h": "对象作为机器：想象力的边界",
          "p": [
            "官方把视野再拉宽：对象几乎能代表你想到的任何东西。举了三个「管理型」例子——管理其他对象的对象（如库存对象：数组装着条目对象，方法负责增删查）；监听事件并做出响应的对象（想想 DOM 元素上的 addEventListener）；统管 DOM 相关一切的对象（挂事件监听调用别的对象的方法、把别的对象的数据显示到页面上）。",
            "一开始想不清这类对象该装什么很正常，经验会补上。官方给了一个好用的心智模型：把对象想成你用代码造的**小机器**——**属性是仪表盘**（显示收集到的物品清单、正在监听事件的函数列表、负责交互与展示的 DOM 元素），**方法是按钮**（从清单移除一件物品、触发所有监听 click 的函数、读取数据并更新某些元素的 textContent）。",
            "记住这句话收尾：对象能代表几乎任何你想到的东西——**限制只有你的想象力**。这正是后面整章要反复练习的事。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "const myObject = {\n  property: \"Value!\",\n  otherProperty: 77,\n  \"obnoxious property\": function () {\n    // do stuff!\n  },\n};\n\n// 点记法（干净，首选）\nconsole.log(myObject.property); // \"Value!\"\n\n// 方括号记法：键含空格时唯一选择\nconsole.log(myObject[\"obnoxious property\"]); // [Function]\n\n// 方括号记法：键在变量里时唯一选择\nconst variable = \"property\";\nconsole.log(myObject.variable);  // undefined——找的是名叫 variable 的属性\nconsole.log(myObject[variable]); // \"Value!\"——等价于 myObject[\"property\"]",
          "note": "官方回炉节原码：两种取值记法与各自的适用场景。变量键那个 undefined 是高频事故现场——写 myObject.variable 之前先问自己：我要的是「名叫 variable 的属性」还是「变量里存的那个键」？"
        },
        {
          "lang": "javascript",
          "code": "const car = {\n  make: \"Volkswagen\",\n  model: \"Golf\",\n  year: 2026,\n  color: \"blue\",\n  priceUSD: 40000,\n\n  // 方法就是赋给属性的函数（传统函数写法）\n  applyDiscount: function (discountPercentage) {\n    const multiplier = 1 - discountPercentage / 100;\n    this.priceUSD *= multiplier;   // this = 被调用的那个对象（car）\n  },\n  // 对象字面量的方法简写语法\n  getSummary() {\n    return `${this.year} ${this.make} ${this.model} in ${this.color}, priced at $${this.priceUSD} (USD).`;\n  },\n};\n\ncar.applyDiscount(10);\nconsole.log(car.getSummary()); // 2026 Volkswagen Golf in blue, priced at $36000 (USD).",
          "note": "官方汽车例子：属性是「它有什么」，方法是「怎么和它交互」。两种方法写法（function 与简写）等价；都别换成箭头函数——箭头函数里的 this 不会指向 car（官方提示块，原因后面课程展开）。"
        },
        {
          "lang": "javascript",
          "code": "// 抽象事物同样能建模：一个石头剪刀布游戏对象\nconst rps = {\n  playerScore: 0,\n  computerScore: 0,\n  playRound(playerChoice) {\n    // 玩一轮：判定胜负、按需更新分数、返回结果\n  },\n  getWinningPlayer() {\n    // 返回当前领先方（\"player\"、\"computer\" 或 \"tie\"）\n  },\n  reset() {\n    // 双方分数清零\n  },\n};\n\nrps.playRound(\"rock\");        // 返回 \"player\"\nconsole.log(rps.playerScore); // 1——赢了，分数已更新\nrps.reset();\nconsole.log(rps.playerScore); // 0——状态与方法同住一个对象，重置就是一句话",
          "note": "官方 rps 例子（方法体是官方原样的占位注释——本课只立骨架，填肉是你后续项目的事）。对照你 Foundations 做过的石头剪刀布：当时分数变量和判定函数是散装的，现在全部收进一个对象——这就是「组织代码」。"
        }
      ],
      "pitfalls": [
        {
          "title": "对象字面量的方法写成箭头函数",
          "text": "箭头函数里的 this 不按「谁调用指向谁」的规则来——写成 `getSummary: () => ...` 后 this.getSummary 里的 this 不再是 car，读属性全是 undefined。官方明文警告过：方法用 function 写法或简写语法。this 的完整规则后面课程展开，先记住这条保命结论。"
        },
        {
          "title": "点记法取变量键",
          "text": "myObject.variable 找的是名叫 variable 的属性，不是变量 variable 的值——键在变量里时必须用 myObject[variable]。排查特征：明明对象里有那个键，取出来却是 undefined，八成是把方括号写成了点。"
        },
        {
          "title": "把 _ 前缀当成真私有",
          "text": "_someProperty 只是「内部使用」的君子约定，语言层面从对象外面照样能读能改。别因为加了下划线就假设外部访问不到它，也别在对象外部的代码里无视约定去动它——真私有的实现方式（如私有字段）后面的课才讲。"
        },
        {
          "title": "只把对象当「带名字的数据袋」",
          "text": "本课的升级点是对象还能装**功能**：方法和数据住在一起，对象才成为「小机器」。如果你的对象只有属性、操作它的函数全散在外面，组织代码的收益就丢了一半——想想 rps 的 playRound：玩一轮和更新分数本来就该是一体的。"
        }
      ],
      "official": {
        "assignment": [
          "官方明文：这一课没有作业。JavaScript 是一门非常灵活的语言，涉及许多不同编程范式的概念，但大量内容围绕「面向对象编程」（OOP）展开。本课已经点到了「为什么一开始就要用对象」的基本思想，接下来几课会通过大量创建与使用对象的技术，更实操地探索这些概念。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/organizing_your_javascript_code/organizing_code_with_objects.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "4eb7327b9e08458524efe6163225837a6a9036dcec2b0da53effc82a0cb8604b",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-javascript-object-constructors",
      "title": "Object Constructors",
      "zh": "对象构造器",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-object-constructors",
      "summary": "同一种对象要造很多个（实例），逐个手写对象字面量不现实——构造器函数 + new 就是批量造对象的机器。这一课同时深挖 JavaScript 最核心的机制之一：原型（[[Prototype]]）与原型继承——每个对象都链着另一个对象，找不到的属性沿链向上查；把公共方法定义在构造器的 .prototype 上，所有实例共享同一份、省内存。官方还给了两条保命警告：别用 Player.prototype = Person.prototype 这种赋值「继承」，以及 .prototype 与 Object.getPrototypeOf() 根本不是一回事。",
      "guide": "以下是官方原课的中文化梳理。上一课你学会了用对象组织数据与功能，这一课解决「同一种对象要造很多个」的问题：构造器函数配合 new 关键字批量生产实例。但本课真正的重头戏是**原型**——JavaScript 与大多数语言不同的继承机制：每个对象都链接着另一个对象（它的 [[Prototype]]），访问不存在的属性时会沿着这条链一路向上找，直到 Object.prototype、直到 null。理解了原型链，你就理解了 JS 对象行为的底层逻辑，后面「类」那一课（class 本质上是原型继承的语法糖）会轻松很多。官方在 Assignment 里安排了 DigitalOcean 的原型复习、JavaScript.info 的原型继承深读（有官方中文版）与 this 关键字专文——这三篇都不是可选项，this 的行为差异尤其是后面所有课程的地基。课中还有一个 Book 构造器练习，它就是下一课 Project: Library 的种子。",
      "understand": [
        "构造器函数本质就是普通函数，用 new 调用时发生四件事：创建一个新对象、让函数内的 this 指向它、让新对象继承函数的 .prototype、返回这个新对象（即使没写 return）",
        "不带 new 误调用构造器不会做这些事，会造成难以追踪的错误——官方建议用 new.target 元属性做防护，漏写 new 直接抛错",
        "每个对象都有 [[Prototype]]，它就是另一个对象：原对象「继承」并可访问 [[Prototype]] 上的全部属性与方法；Object.getPrototypeOf(obj) 用来查看某对象的 [[Prototype]]",
        "构造器的 .prototype 属性决定「用 new 调用时新实例的 [[Prototype]] 被设成什么」——它是函数的属性，不是用来查看对象原型的（那是 Object.getPrototypeOf 的活），两者是高频混淆点",
        "把公共方法定义在 Constructor.prototype 上的两个理由：所有实例共享同一份函数、省内存；多个对象经由原型链共享并复用行为",
        "原型链：对象 → 它的 [[Prototype]] → 再上一级……每一级都找不到就继续向上；Player.prototype 的 [[Prototype]] 是 Object.prototype（valueOf、hasOwnProperty 就住在那里），Object.prototype 的 [[Prototype]] 是 null——链的终点，再找不到就返回 undefined",
        "每个原型对象默认直接或间接继承自 Object.prototype；一个对象只能有一个 [[Prototype]]（不能多继承）",
        "设置继承用 Object.setPrototypeOf(Player.prototype, Person.prototype)（第一个参数继承第二个）——且必须在创建任何实例**之前**设好，事后再改会有性能问题",
        "Player.prototype = Person.prototype 是错误做法：两个 .prototype 变成内存里同一个对象，改 Enemy.prototype 上的方法会连 Player 一起改",
        ".__proto__ 是非标准、已废弃的历史遗留写法，读写原型一律用 Object.getPrototypeOf() / Object.setPrototypeOf()"
      ],
      "terms": [
        {
          "en": "Constructor (function)",
          "zh": "构造器函数：设计成配合 new 使用、用来批量创建同类对象的函数——调用时装配并返回新实例"
        },
        {
          "en": "Instance",
          "zh": "实例：由构造器创建出来的一个个具体对象（player1、player2 都是 Player 的实例）"
        },
        {
          "en": "new",
          "zh": "new 关键字：调用构造器的正确方式——创建新对象、绑定 this、接上 .prototype、返回新对象，四件事一次做完"
        },
        {
          "en": "[[Prototype]]",
          "zh": "对象的内部原型链接：另一个对象，本对象继承它并可访问其全部属性与方法；用 Object.getPrototypeOf() 查看"
        },
        {
          "en": ".prototype",
          "zh": "构造器函数的属性：决定 new 出来的实例的 [[Prototype]] 指向谁——注意它不是「某对象的原型」的读取入口"
        },
        {
          "en": "Prototype chain",
          "zh": "原型链：对象沿 [[Prototype]] 逐级向上的查找链条，终点是 Object.prototype → null；属性查找、valueOf 之类的「凭空出现」的方法都源于它"
        },
        {
          "en": "Prototypal inheritance",
          "zh": "原型继承：基于原型链的继承机制——JavaScript 的继承不是类的复制，而是对象链接到对象"
        },
        {
          "en": "new.target",
          "zh": "元属性：在函数内检测「是否被 new 调用」，用来给构造器做漏写 new 的防护"
        },
        {
          "en": "hasOwnProperty",
          "zh": "判断属性是「自己的」还是「从原型链继承的」——player1.hasOwnProperty('valueOf') 为 false 而 Object.prototype 上为 true"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：重点是 new 的四件事、[[Prototype]] 三句话、原型链查找过程",
        "完成官方课中练习：写一个 Book 构造器（title / author / pages / read 四个属性 + info() 方法报告图书信息）——它就是下一课 Project: Library 的种子，认真写",
        "读 DigitalOcean 的 Understanding Prototypes and Inheritance in JavaScript：原型继承与构造器函数的复习，带例子",
        "精读 JavaScript.info 的 Prototypal Inheritance（有官方中文版）：把链与继承再挖深一层，**文末练习不要跳过**；注意该文大量使用已废弃的 __proto__ 写法——学概念、别学写法，设置原型的推荐方法本课已给（Object.setPrototypeOf）",
        "读 JavaScript Tutorial 的 this 关键字专文：this 在各种情形下怎么变，**每节提到的坑要特别留意**——构造器与原型方法里到处都是 this"
      ],
      "quiz": [
        {
          "question": "用 new 调用构造器函数时，JavaScript 做了哪四件事？",
          "answer": "① 创建一个新对象；② 让函数体内的 this 指向这个新对象；③ 让新对象继承（链接到）构造器函数的 .prototype；④ 返回这个新对象——即使构造器里没写 return。不带 new 直接调用，这四件事一件都不会发生，this 也不是新对象，所以会造成难查的 bug。"
        },
        {
          "question": ".prototype 与 Object.getPrototypeOf() 的区别是什么？",
          "answer": ".prototype 是**函数**的属性，决定「这个函数被 new 调用时，新实例的 [[Prototype]] 设成什么」；Object.getPrototypeOf(obj) 是**读取某个对象**的 [[Prototype]] 的正确方法。混淆点：Object.getPrototypeOf(player1) === Player.prototype 为 true——实例的原型恰好是构造器的 .prototype，但两个名字的用途完全不同。"
        },
        {
          "question": "player1.valueOf() 能调用成功，但你从没定义过 valueOf——它从哪来的？查找过程是怎样的？",
          "answer": "沿原型链逐级查找：① valueOf 是 player1 自己的属性吗？不是（它只有 name / marker / sayName）；② 在 player1 的 [[Prototype]]（即 Player.prototype）上吗？不在（那里只有 sayHello）；③ 在 Player.prototype 的 [[Prototype]]（即 Object.prototype）上吗？在——valueOf 就定义在那里。链的终点是 Object.getPrototypeOf(Object.prototype) === null，到终点还找不到才返回 undefined。"
        },
        {
          "question": "想让 Player 继承 Person，正确写法与错误写法各是什么？错在哪里？",
          "answer": "正确：Object.setPrototypeOf(Player.prototype, Person.prototype)——让 Player.prototype 继承自 Person.prototype，且必须在创建任何实例之前设好（事后改有性能问题）。错误：Player.prototype = Person.prototype——这让两者变成内存里**同一个对象**，之后任何人改「Player.prototype」上的方法都会同时改掉 Person 的（官方例子：给 Enemy.prototype 加个邪恶 sayName，Player 实例也跟着变）。要的是「继承」，不是「变成同一个」。"
        },
        {
          "question": "为什么把公共方法定义在 Constructor.prototype 上，而不是写在构造器函数体内（this.sayName = function…）？",
          "answer": "两个理由：① 省内存——写在构造器体内，每 new 一次就复制一份函数；定义在 prototype 上，所有实例共享同一份；② 行为共享——原型继承机制让多个对象复用同一套方法，改一处全体实例生效。构造器体内只放「每个实例各不相同」的数据（如 this.name = name）。"
        }
      ],
      "optional": [],
      "note": "官方有一个课中 Exercise（Book 构造器），已收进本课任务与 official.exercise；官方提示块三条（new.target 防护、console.log vs return、.__proto__ 已废弃）全部并入本站讲解。Assignment 指定的 JavaScript.info 文章大量使用 __proto__ 旧写法，官方自己提醒「学概念别学写法」，本站照录。官方配图（原型关系示意，statically CDN）按既有口径不收录。",
      "why": "原型是 JavaScript 语言的心脏：class 语法是它的糖、Object.create 是它的直用、连你天天在用的 arr.push 和 obj.hasOwnProperty 都是沿原型链找到的方法。面试问「JS 的继承和 Java 有什么不同」、读任何框架源码遇到 __proto__ 与 prototype 的纠缠、排查「这个方法明明没定义为什么能调用」——答案全在本课。构造器本身日后会被 class 取代大半，但原型机制永远在水面之下运行。",
      "sections": [
        {
          "h": "构造器函数：批量造对象的机器",
          "p": [
            "上一课的对象字面量适合造独一无二的对象；但同一种对象要造很多个（井字棋的玩家、图书库的书）时，逐个手写不现实。**构造器函数**就是为此而生——它真的只是一个普通函数：函数名叫 `Player`，参数是 `name` 与 `marker`，函数体里写 `this.name = name;` 和 `this.marker = marker;`（完整代码见下方示例 1）。",
            "区别全在调用方式：必须配 **new** 关键字——`const player = new Player(\"steve\", \"X\")`。用 new 调用时发生四件事：**创建一个新对象；让函数内的 this 指向这个新对象；让新对象继承函数的 .prototype 属性；返回这个新对象**（即使构造器里没写 return）。",
            "和字面量一样，构造器里也能挂方法：`this.sayName = function() { console.log(this.name); }`——player1.sayName() 打印 \"steve\"，player2.sayName() 打印 \"also steve\"，各调各的 this。"
          ]
        },
        {
          "h": "防护：漏写 new 会静默炸，new.target 来兜底",
          "p": [
            "构造器可能被**忘记写 new** 误调用——那时上面四件事一件都不发生（this 也不是新对象），产生的错误非常难追踪。官方建议给构造器加防护（原文警告提示块）：在函数体开头写 `if (!new.target) { throw Error(\"You must use the 'new' operator to call the constructor\"); }`（完整代码见下方示例 1）。",
            "`new.target` 是元属性：被 new 调用时有值、普通调用时是 undefined——漏写 new 直接抛错，把「静默炸」变成「当场炸」。",
            "顺带一条官方提示（原文 tip 提示块）：教学示例里常见函数直接 console.log，但真实代码里函数**返回值**通常比直接打日志更合理——值可以传到任何地方用，日志只能看。课中练习的 info() 就按这个口径写成 return。"
          ]
        },
        {
          "h": "原型三句话：每个对象都链着另一个对象",
          "p": [
            "JavaScript 里**所有对象都可以链接到另一个对象**，那个对象叫它的**原型**（[[Prototype]]）。对象自己身上找不到的属性或方法，JavaScript 会去 [[Prototype]] 上找。官方拆成三句话：",
            "**① 每个对象都有 [[Prototype]]**——player1、player2 也不例外。**② [[Prototype]] 就是另一个对象**——它和 player1 一样可以有属性有方法。**③ 原对象继承它**——[[Prototype]] 上定义过的属性与方法，原对象都能像自己的一样访问：如果 Player.prototype 上定义了 sayHello，那么 player1.sayHello() 和 player2.sayHello() 都能调。",
            "怎么**看到**一个对象的原型？在浏览器控制台里跑 `Object.getPrototypeOf(player1) === Player.prototype`，返回 true——player1 的 [[Prototype]] 正是 Player 构造器的 .prototype 属性所存的那个对象（存的是引用，所以是引用相等）。",
            "「定义在原型上」长这样：`Player.prototype.sayHello = function() { console.log(\"Hello, I'm a player!\"); };`——定义一次，player1 与 player2 同时可用。想把所有 Player 实例共享的属性或方法挂上去，都走这条路。"
          ]
        },
        {
          "h": ".prototype 不是「对象的原型」：高频混淆点",
          "p": [
            "官方专门用提示块澄清这个常见困惑：**.prototype 是函数的属性**，决定「这个函数被 new 调用时，新实例的 [[Prototype]] 会被设成什么」；它**不是**用来访问某个对象 [[Prototype]] 的——那是 `Object.getPrototypeOf()` 的工作。",
            "另一条历史包袱（原文提示块）：你在旧文档与旧代码里会见到 `.__proto__` 用来读写对象原型——那是**非标准且已废弃**的做法，不要学。读用 Object.getPrototypeOf()，写用 Object.setPrototypeOf()。",
            "顺带一个实用工具：`hasOwnProperty` 判断属性是对象「自己的」还是「原型链上继承的」——`player1.hasOwnProperty(\"valueOf\")` 是 false（valueOf 是继承来的），`Object.prototype.hasOwnProperty(\"valueOf\")` 是 true（它定义在那里）。"
          ]
        },
        {
          "h": "原型链：属性查找一路向上，终点是 null",
          "p": [
            "为什么要在原型上定义东西？官方给了两个理由：**① 省内存**——公共属性与函数定义在一个集中、共享的对象上，不必每个实例复制一份，实例越多省得越多；**② 共享行为**——多个对象经由原型继承机制复用同一套方法（player1 与 player2 共用 Player.prototype 上的 sayHello）。",
            "链是逐级向上的：`Object.getPrototypeOf(Player.prototype) === Object.prototype` 为 true——Player.prototype 自己也继承自 Object.prototype。所以 `player1.valueOf()` 能调用成功：valueOf 没定义在 player1 上、也不在 Player.prototype 上，它在 Object.prototype 上。查找过程就是沿链逐级问：是 player1 自己的吗？不是 → 是 Player.prototype 的吗？不是 → 是 Object.prototype 的吗？是！",
            "链不会无限延伸：`Object.getPrototypeOf(Object.prototype)` 是 **null**——链的终点。查到终点还没有，返回 undefined。两条补充规则：**每个原型对象默认直接或间接继承自 Object.prototype**；**一个对象只能有一个 [[Prototype]]**（JavaScript 没有多继承）。"
          ]
        },
        {
          "h": "设置继承：setPrototypeOf 的正确姿势与赋值陷阱",
          "p": [
            "让 Player 继承 Person（Person 有 name 属性与 sayName 方法，Player 另有 marker 与 getMarker）的推荐做法是 `Object.setPrototypeOf(Player.prototype, Person.prototype);`——第一个参数是继承方、第二个是被继承方。",
            "设好之后 new 出来的 player1 既能调自己原型上的 getMarker，也能沿链调到 Person.prototype 上的 sayName——两个方法明明定义在两个不同的 .prototype 对象上，原型链把它们串了起来（完整代码见下方示例 3）。",
            "**时机警告（官方 Note）**：原型链必须在**创建任何对象之前**用 setPrototypeOf 设好——对象已经创建之后再改，会有性能问题。",
            "**陷阱警告（官方 A warning）**：`Player.prototype = Person.prototype;` 看着像继承，实际是让两者变成内存里**同一个对象**。官方例子演示了后果：Player 和 Enemy 都这样「继承」Person 之后，给 Enemy.prototype 改个 sayName，Player 的实例 carl.sayName() 也跟着输出邪恶笑声——因为它们改的是同一个对象。要的是「Player.prototype **继承自** Person.prototype」，不是「变成同一个」。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "// 构造器 + new：批量造实例\nfunction Player(name, marker) {\n  if (!new.target) {\n    throw Error(\"You must use the 'new' operator to call the constructor\");\n  }\n  this.name = name;      // 每个实例各不相同的数据放构造器里\n  this.marker = marker;\n}\n\nconst player1 = new Player(\"steve\", \"X\");\nconst player2 = new Player(\"also steve\", \"O\");\nconsole.log(player1.name); // \"steve\"\n\n// 公共方法放原型上：一份定义，所有实例共享\nPlayer.prototype.sayHello = function () {\n  console.log(\"Hello, I'm a player!\");\n};\nplayer1.sayHello(); // Hello, I'm a player!\nplayer2.sayHello(); // Hello, I'm a player!",
          "note": "官方主线代码的合并示意：new.target 防护 + 数据在构造器、行为在原型——这个分工就是「省内存 + 共享行为」两个理由的落地。"
        },
        {
          "lang": "javascript",
          "code": "// 看清原型关系（浏览器控制台可直接跑）\nObject.getPrototypeOf(player1) === Player.prototype;          // true——实例的 [[Prototype]] 是构造器的 .prototype\nObject.getPrototypeOf(Player.prototype) === Object.prototype; // true——Player.prototype 自己也继承\nObject.getPrototypeOf(Object.prototype);                      // null——链的终点\n\nplayer1.valueOf();                     // 能用！沿链在 Object.prototype 上找到的\nplayer1.hasOwnProperty(\"valueOf\");     // false——不是自己的，是继承的\nObject.prototype.hasOwnProperty(\"valueOf\"); // true——它住在这里",
          "note": "官方原型链演示原码。三行 getPrototypeOf 把整条链画了出来：player1 → Player.prototype → Object.prototype → null。「凭空出现」的 valueOf / hasOwnProperty 都住在 Object.prototype 上。"
        },
        {
          "lang": "javascript",
          "code": "function Person(name) {\n  this.name = name;\n}\nPerson.prototype.sayName = function () {\n  console.log(`Hello, I'm ${this.name}!`);\n};\n\nfunction Player(name, marker) {\n  this.name = name;\n  this.marker = marker;\n}\nPlayer.prototype.getMarker = function () {\n  console.log(`My marker is \"${this.marker}\"`);\n};\n\n// 正确：让 Player.prototype 继承自 Person.prototype（必须在 new 之前设好）\nObject.setPrototypeOf(Player.prototype, Person.prototype);\n\n// 错误示范（别写）：Player.prototype = Person.prototype;\n// ——两者变成同一个对象，改一边等于改两边\n\nconst player1 = new Player(\"steve\", \"X\");\nplayer1.sayName();   // Hello, I'm steve!   ← 沿链调到 Person.prototype 上的方法\nplayer1.getMarker(); // My marker is \"X\"    ← 自己原型上的方法",
          "note": "官方 Person/Player 继承示例：setPrototypeOf 把两个 .prototype 串成链，实例两边的方法都能调。注释里那行赋值是官方点名的陷阱——「同一个对象」与「继承自」是两回事。"
        }
      ],
      "pitfalls": [
        {
          "title": "漏写 new 调用构造器",
          "text": "不带 new 调用时不会创建新对象、this 也不指向新对象——属性会挂到别处（严格模式下 this 是 undefined 直接报错，非严格模式悄悄挂上全局），错误极难追踪。防护写法：构造器开头 if (!new.target) throw Error(...)，把静默事故变成当场报错。"
        },
        {
          "title": "把 .prototype 当成「对象的原型」来读",
          "text": ".prototype 是函数的属性（决定 new 出来的实例链到谁），读某个对象的原型要用 Object.getPrototypeOf(obj)。记忆锚点：Object.getPrototypeOf(player1) === Player.prototype——等号两边名字长得像，用途完全不同。"
        },
        {
          "title": "用赋值做「继承」：Player.prototype = Person.prototype",
          "text": "这不是继承，是让两个 .prototype 变成同一个对象——之后改 Enemy.prototype 上的方法会连 Player 的实例一起改（官方例子：carl.sayName() 输出邪恶笑声）。正确写法：Object.setPrototypeOf(Player.prototype, Person.prototype)，且在创建实例之前设好。"
        },
        {
          "title": "跟着旧资料写 .__proto__",
          "text": ".__proto__ 是非标准、已废弃的历史遗留（Assignment 里 JavaScript.info 的文章就大量使用它——官方自己提醒学概念别学写法）。读写原型一律用 Object.getPrototypeOf() / Object.setPrototypeOf()。"
        },
        {
          "title": "公共方法写进构造器体内",
          "text": "this.sayName = function… 写在构造器里，每 new 一次就复制一份函数——实例一多内存全浪费在重复函数上。构造器体内只放每个实例不同的数据，共享行为一律上 prototype。"
        }
      ],
      "official": {
        "assignment": [
          "读 DigitalOcean 的 Understanding Prototypes and Inheritance in JavaScript——原型继承与构造器函数的良好复习，带例子。",
          "把链与继承再挖深一层：精读 JavaScript.info 的 Prototypal Inheritance，文末练习照做、不要跳过（官方原话：Don't skip them!）。重要提醒：该文大量使用一般不推荐的 __proto__——当下要学的是概念，设置原型的推荐方法后面还会再学一两招。",
          "你在上面的例子里已经见到 this 出现在构造器与原型方法中。读 JavaScript Tutorial 的 this 关键字专文：this 在各种情形下如何变化，每一节提到的坑要特别留意。"
        ],
        "exercise": [
          "写一个创建 Book 对象的构造器（下一课的 Project 会 revisit 它）：书对象应有 title（书名）、author（作者）、pages（页数）、read（是否读过）四个属性，并在构造器里放一个 info() 函数报告图书信息——官方示例：console.log(theHobbit.info()) 输出 \"The Hobbit by J.R.R. Tolkien, 295 pages, not read yet\"。（官方 tip：让 info() return 字符串比直接 console.log 更合理。）"
        ],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/organizing_your_javascript_code/object_constructors.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "d7ebeec9d5258355dd92c691fd91034b45e86ec4dd02f6464988b6b9abb10187",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-javascript-library",
      "title": "Project: Library",
      "zh": "项目：图书库",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-library",
      "summary": "把上一课练习里的 Book 构造器长成一个真正的图书库应用：书对象存进数组、循环渲染成表格或卡片、表单添加新书、按钮删除书、按钮切换「读过/没读」状态。官方在这个项目里第一次明确点出「数据与显示分离」的开发思想：先把数据管好，再用同一份数据以任意方式重建界面。本站只提供要求中文化、任务拆解与验收清单，不提供成品代码。",
      "guide": "以下是官方项目要求的中文化与拆解。这是「组织 JavaScript 代码」章节的第一个项目，体量不大，但它是整章思想的演练场：上一课的 Book 构造器练习在这里直接复用，你将第一次亲手实践「数组当数据库、DOM 只是显示层」的模式——这个模式会在 Tic Tac Toe、Restaurant Page、Todo List 一路升级，直到 ES6 模块那一课被正式命名。官方给了六步任务，每一步都有对应的知识点回指；两个最常见的卡点（表单提交刷新页面、DOM 元素与数据对象失联）官方都在任务里直接点了名并给了 MDN 文档入口。按本站红线，本页不提供任何成品代码：先自己拆解、动手，卡住了回本站对应课程查概念。",
      "understand": [
        "项目的数据核心是一个数组（myLibrary）加一个 Book 构造器：所有书对象存进数组，构造器来自上一课的课中练习",
        "每本书要有唯一 id（官方指定用 crypto.randomUUID() 生成）——删除或重排书籍时，id 是 DOM 元素与数据对象之间稳定关联的锚点",
        "addBookToLibrary 是构造器**外面**的独立函数：接收参数、创建书对象、存进数组——「造对象」与「管集合」是两个职责",
        "显示层是一个循环渲染函数：遍历数组，把每本书渲染成表格行或卡片——官方建议先手动往数组塞几本书，把显示跑通",
        "数据与显示分离（官方在这个项目里第一次点名）：显示逻辑与数据结构是两个独立实体，同一份数据可以按多种方式重建界面——这是可维护性与可扩展性的来源",
        "「New Book」按钮弹出表单（侧栏或 <dialog> 模态都行）；表单提交默认会把数据发给服务器导致页面刷新，要用 event.preventDefault() 拦住",
        "删除按钮的关键是「DOM 元素怎么知道自己对应哪本书」：官方推荐 data-attribute 存书的唯一 id；切换 read 状态则建议写成 Book 的原型方法"
      ],
      "terms": [
        {
          "en": "crypto.randomUUID()",
          "zh": "浏览器内置的唯一 ID 生成器：每次调用返回一个全局唯一的字符串，官方指定用它给每本书发「身份证」"
        },
        {
          "en": "data-attribute",
          "zh": "HTML 的 data-* 自定义属性：把数据挂在 DOM 元素上（如 data-id），让元素与数据对象建立关联"
        },
        {
          "en": "event.preventDefault()",
          "zh": "阻止事件默认行为：表单 submit 默认要发给服务器刷新页面，这一句把它拦下来，让你的 JS 接管"
        },
        {
          "en": "<dialog>",
          "zh": "HTML 原生对话框元素：做「New Book」弹窗表单的官方推荐选项之一（另一个选择是侧栏）"
        }
      ],
      "tasks": [
        "建仓库打底：为项目建 Git 仓库，搭好 HTML / CSS / JS 骨架文件（官方：此后所有项目都默认你已会这一步）",
        "搭数据层：写 Book 构造器（复用上一课练习：title / author / pages / read），建 myLibrary 数组，再写一个构造器**外面**的 addBookToLibrary 函数——接参数、造书、进数组；每本书用 crypto.randomUUID() 发唯一 id",
        "搭显示层：写一个循环遍历数组、把每本书渲染到页面上的函数（表格或卡片自选）；先手动往数组里塞几本书，确认显示跑得通",
        "做「New Book」入口：按钮弹出表单（侧栏或 <dialog> 模态自选）收 author / title / pages / read；处理表单提交刷新页面的问题——读官方给的 event.preventDefault 文档并用上它",
        "做删除：每本书的显示上加删除按钮；用 data-attribute 把 DOM 元素与对应书对象的唯一 id 关联起来（官方给的 MDN data-attributes 文档就是这个用途）",
        "做「读过」切换：每本书的显示上加一个切换 read 状态的按钮；官方建议把切换逻辑写成 Book 的原型方法（prototype function）",
        "对照下方验收清单逐条自查，然后提交到官方 Discord 或自己的仓库留档"
      ],
      "quiz": [
        {
          "question": "官方为什么要求每本书有一个用 crypto.randomUUID() 生成的唯一 id？",
          "answer": "唯一且稳定的标识符让每本书在删除或重排之后仍能被准确指认——DOM 元素靠 data-attribute 存这个 id 与数据对象关联，删除按钮才知道该从数组里删哪一本。用数组下标当关联会在删除/重排后全部错位。"
        },
        {
          "question": "官方说的「把显示逻辑与数据结构当成两个独立实体」是什么意思？为什么直接操纵页面显示「看起来更简单」却不被推荐？",
          "answer": "数据（书对象数组）是事实源，页面显示只是数据的一种呈现——渲染函数随时可以用同一份数据把界面整个重建出来。直接改 DOM 会让「页面上看到的」与「数组里存的」渐渐脱节（数据漂移），而分离之后同一份数据可以按表格、卡片等任意方式展示，代码也更好维护与扩展。官方明说这个概念后面还会深入。"
        },
        {
          "question": "点表单的提交按钮后页面刷新了、书没加上——发生了什么？官方给的解法是什么？",
          "answer": "submit 输入默认会把表单数据发送给服务器（本页没有服务器，于是表现为页面刷新）——这是表单的默认行为，不是你的代码错了。解法是在提交事件处理里调用 event.preventDefault() 阻止默认行为，然后由你的 JS 读取表单值、调用 addBookToLibrary、重新渲染。"
        },
        {
          "question": "这个项目需要做「刷新页面后数据还在」的持久化存储吗？",
          "answer": "不需要。官方明文（提示块）：不要求添加任何形式的存储来在页面刷新之间保存信息——数据放在内存数组里就够了。想做 localStorage 持久化可以作为个人挑战，但不是官方要求。"
        }
      ],
      "optional": [],
      "note": "Project 红线课：本站不提供成品代码或完整骨架（examples 为空数组），只提供官方要求的中文化、拆解、验收清单与概念回指。官方原文含一段基础骨架示意（myLibrary 数组 + 空 Book 构造器 + 空 addBookToLibrary 函数签名），任务拆解里已转述其结构要求，代码请自己写。官方明文不要求持久化存储。",
      "why": "Library 是「数据驱动界面」的第一次实弹演习：数组是数据库、渲染函数是显示层、唯一 id 是两者的桥。这个三角关系是后面每个项目（井字棋的棋盘状态、餐厅页的菜单数据、待办清单的项目列表）的公共骨架，也是 ES6 模块与 OOP 原则最终要服务的目标。第一次做会觉得「为什么不直接改 DOM」，做完 Todo List 你会庆幸当初老老实实分离了数据与显示。",
      "sections": [
        {
          "h": "项目定位：Book 练习长成 Library 应用",
          "p": [
            "官方开场一句话：把上一课的 Book 例子扩展成一个小型图书库应用。你在对象构造器课中练习里写的 Book 构造器（title / author / pages / read + info() 方法）不是白写的——它就是这个项目的数据核心，官方明说下一课（Project）会 revisit 它。",
            "最终形态：页面上能展示一个书库（表格或卡片），能弹出表单添加新书，每本书能删除、能切换「读过/没读」。功能不大，但麻雀五脏俱全：数据层、显示层、用户输入、DOM 与数据的关联，一个项目全练到。"
          ]
        },
        {
          "h": "第 1 步：仓库与骨架",
          "p": [
            "为项目建一个 Git 仓库，放好 HTML / CSS / JS 骨架文件。官方原话：从这里开始（的所有项目），我们都假设你已经会做这一步——这是 Git Basics 与前面所有项目练出来的肌肉记忆。",
            "建议的起步结构：index.html 挂一个空的容器元素（书的显示区）与一个「New Book」按钮，script.js 里先放数据层。仓库提交节奏自己定，但每完成一步 commit 一次是好习惯。"
          ]
        },
        {
          "h": "第 2 步：数据层——数组 + 构造器 + addBookToLibrary",
          "p": [
            "所有书对象存进**一个数组**（官方示意名 myLibrary），所以你需要 Book 构造器。然后写一个**独立函数**（官方强调：不在构造器里面）addBookToLibrary：接收参数（书名、作者、页数、读没读），用它们创建一本书，把新书对象存进数组。",
            "官方新增要求（本课特有）：**每本书要有唯一 id**，用 `crypto.randomUUID()` 生成——浏览器原生 API，调用一次返回一个全局唯一字符串。官方的理由写得很清楚：唯一且稳定的标识符能避免「删除或重排书籍时」出问题——它是第 5 步 DOM 关联的锚点，先把地基打好。",
            "官方给的骨架只有三行结构示意（空数组、空构造器、空函数签名，见 tasks 转述）——参数、属性、方法体全部自己填。这正是上一课练习的用武之地。"
          ]
        },
        {
          "h": "第 3 步：显示层——循环渲染，数据与显示分离",
          "p": [
            "写一个函数：循环遍历数组，把每本书显示到页面上——表格一行一本、或每本一张卡片，形式自选。官方的调试建议：先手动往数组里塞几本书，让显示先跑起来，再接表单。",
            "这一步藏着官方在这个项目里**第一次点名的大思想**（原文子弹块）：直接操纵页面显示「看起来更容易」，但从现在起要把两个职责分开想——开发应用时，我们要的是**用同一份底层数据以多种方式重建元素**（书库和它的书）的灵活性。因此把「向用户显示书的逻辑」与「装着全部信息的书结构」当成两个独立实体。官方原话：这种分离会提升代码的可维护性与可扩展性，概念后面还会深入（ES6 模块与 OOP 原则那两课就是它的续集）。",
            "落地手法就一条：渲染函数每次从数组**整个重建**显示区（清空容器、循环 append），而不是在某本书的卡片上原地改字。数据改了，重新渲染就是。"
          ]
        },
        {
          "h": "第 4 步：New Book 按钮与表单——preventDefault 的坑",
          "p": [
            "加一个「New Book」按钮，点击弹出表单收新书信息：author、title、pages、是否 read，以及任何你想加的字段。表单怎么出现由你决定：侧栏（sidebar）可以，官方也点名可以探索 **`<dialog>` 标签**做对话框与模态（Assignment 给了 MDN 文档入口）。",
            "官方预警了一个你**一定会撞上**的问题：提交表单时它不会按你预期工作——因为 submit 输入**默认要把数据发送给服务器**（本页没有服务器，表现为页面刷新、输入全丢）。解法官方也直接给了：`event.preventDefault()`，并附 MDN 文档链接。这是 DOM 事件课（Foundations 第 41 课）学过的老朋友，在表单场景的第一次实战。",
            "提交处理里做的事：读表单各字段值 → 调 addBookToLibrary → 重新渲染显示区 → 关表单、清输入。"
          ]
        },
        {
          "h": "第 5、6 步：删除与切换已读——DOM 与数据的关联",
          "p": [
            "每本书的显示上加**删除按钮**。官方点破关键难点：你需要用某种方式把 DOM 元素与真实的书对象**关联**起来。官方推荐的简单解法：给元素挂 **data-attribute**（如 `data-id`），值就是那本书的唯一 id——点删除时读出 id、去数组里找到对应书、删掉、重新渲染（MDN 文档已挂进 Assignment）。第 2 步发的 uuid 在这里兑现价值。",
            "每本书的显示上再加一个**切换 read 状态**的按钮。官方建议：把切换写成 Book 的**原型方法**（prototype function）——上一课「公共方法上 prototype」的纪律在这里落地：`Book.prototype.toggleRead` 一处定义，所有书实例共享。切换后同样重新渲染。"
          ]
        },
        {
          "h": "验收清单与官方边界",
          "p": [
            "对照自查：① Git 仓库 + HTML/CSS/JS 骨架；② 所有书存在一个数组里，Book 构造器 + 构造器外的 addBookToLibrary，每本书有 crypto.randomUUID() 的唯一 id；③ 循环渲染函数把数组显示成表格或卡片；④ New Book 按钮弹表单（侧栏或 dialog），提交不刷新页面（preventDefault），新书进数组并显示；⑤ 每本书可删除（data-attribute 关联）；⑥ 每本书可切换 read 状态（原型方法）；⑦ 数据与显示分离：任何改动都是「改数组 → 重新渲染」，没有绕过数组直接改 DOM 的路径。",
            "官方边界（原文提示块）：**不需要持久化存储**——不要求任何形式地在页面刷新之间保存信息。刷新后书库清空是符合要求的。",
            "做完之后：这个项目没有官方测试对照，最好的检验是把它放几天再回来加一个小功能（比如按读/未读过滤）——如果数据与显示真的分离了，加功能只需要动渲染函数和数组操作。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "表单提交后页面刷新、输入全丢",
          "text": "submit 的默认行为是把数据发给服务器。在表单的 submit 事件处理函数第一行写 event.preventDefault()，再由你的代码接管后续（读值、入库、重渲染）。官方在任务里点名了这个坑并给了 MDN 文档。"
        },
        {
          "title": "绕过数组直接改 DOM（数据与显示漂移）",
          "text": "「删除一本书」如果只把卡片从页面上移除、不从数组里删，下一次重新渲染它又回来了；「切换已读」如果只改卡片文字、不改书对象，数据就永远停在旧状态。纪律：任何变更先改数组里的数据，然后调渲染函数整体重建显示。"
        },
        {
          "title": "用数组下标关联 DOM 元素",
          "text": "data-index=\"2\" 这种关联在删除一本书后全部错位（后面的书下标集体前移）。这正是官方要求 crypto.randomUUID() 唯一 id 的原因：id 跟着书对象走，删除重排都不影响关联。"
        },
        {
          "title": "把 addBookToLibrary 写进构造器里",
          "text": "官方明文要求它是「脚本里的一个独立函数（不在构造器内）」：构造器只管造一本书，入库是集合层的职责。混在一起会让构造器依赖外部数组，测试与复用都变难——这也是下一课「工厂函数与职责分离」要展开的思想。"
        }
      ],
      "official": {
        "assignment": [
          "如果还没做：为项目建 Git 仓库，放好 HTML/CSS/JS 骨架文件。此后官方默认你已完成这一步。",
          "所有书对象存进一个数组，所以你需要书的构造器。再往脚本里加一个独立函数（不在构造器里面）：接收参数、由参数创建一本书、把新书对象存进数组。所有书对象都应有唯一 id，用 crypto.randomUUID() 生成——保证每本书有唯一且稳定的标识符，避免删除或重排时出问题。官方给了基础骨架示意（myLibrary 空数组 + 空 Book 构造器 + 空 addBookToLibrary 函数，均不含参数细节）。",
          "写一个循环遍历数组、把每本书显示到页面上的函数：表格或每本一张卡片都行。先手动往数组加几本书便于观察显示。官方子弹块：直接操纵显示看似更容易，但从此要把职责分开想——开发应用要用同一份底层数据以多种方式重建元素的灵活性，显示逻辑与书结构是两个独立实体，这种分离提升可维护性与可扩展性。",
          "加一个「New Book」按钮，弹出表单让用户输入新书细节并加入书库：author、title、pages、是否读过，以及任何你想加的。表单展示方式自定（侧栏，或探索 <dialog> 标签做对话框/模态——官方挂了 MDN dialog 文档）。官方预警：提交表单多半不会按你预期工作，因为 submit 输入默认把数据发给服务器——event.preventDefault() 在这里派上用场，去读官方挂的 preventDefault 文档找解法。",
          "每本书的显示上加一个把它从书库删除的按钮。官方子弹块：你需要用某种方式把 DOM 元素与真实书对象关联，一个简单解法是给它挂 data-attribute，对应书对象的唯一 id（官方挂了 MDN data-attributes 文档）。",
          "每本书的显示上加一个切换 read 状态的按钮。官方子弹块：为此你要给 Book 建一个原型函数（prototype function），切换书实例的 read 状态。",
          "官方提示块：无需持久化存储——不要求添加任何形式的存储来在页面刷新之间保存信息。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/organizing_your_javascript_code/project_library.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "acb1df27b0dc55fc1f85cd14aa6e98fbfe189acd818763099b27d86e30716ede",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-javascript-factory-functions-and-the-module-pattern",
      "title": "Factory Functions and the Module Pattern",
      "zh": "工厂函数与模块模式",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-factory-functions-and-the-module-pattern",
      "summary": "本章信息量最大的一课：作用域（全局/函数/块级）→ 闭包（函数 + 它出生时的词法环境）→ 构造器的两个历史槽点 → 工厂函数（不用 new、靠闭包吃私有变量）→ 组合优于继承的工厂版 → IIFE 与模块模式（calculator 例子）→ 封装。学完你能看懂野外代码库里大量存在的工厂与模块写法，也理解了「私有」在 JavaScript 里的真实实现机制：闭包。",
      "guide": "以下是官方原课的中文化梳理。这一课是整章的理论枢纽：前面的构造器、后面的类，中间夹着的工厂函数与模块模式是 JavaScript 社区长盛不衰的另一条路线。学习路径官方铺得很细：先补作用域（var 函数作用域 vs let/const 块级作用域），再吃透闭包（工厂函数的发动机），然后才谈构造器的槽点与工厂函数的优势——顺序不能反，闭包不懂则工厂全是魔法。两个必吃透的例子：makeAddingFunction（闭包保存 firstNumber）与 calculator 模块（IIFE + 私有 lastResult）。官方还塞了两个日后天天用的语法糖：对象简写与解构。Assignment 三篇阅读（Wes Bos 的作用域与闭包、MDN 闭包指南）都不是可选项——闭包是后面每一课的底层机制。",
      "understand": [
        "作用域回答「某个变量在哪里可用」：不在任何函数/花括号里 = 全局作用域（到处可用）；var = 函数作用域（只在声明它的函数内可用）；let / const = 块级作用域（只在最近的一对花括号内可用——for、if 等都算块）",
        "闭包 = 函数 + 它被声明时所处的**词法环境**（当时作用域里的局部变量）：makeAddingFunction(5) 执行完后，5 不会被内存清掉，因为返回的函数还要用它",
        "闭包是函数的**关键**行为：它让数据可以与函数关联、并在外层函数之外的任何地方被操纵——工厂函数的私有变量全靠它",
        "构造器的两个历史槽点：① 不 new 调用不报错、静默错误行为（防护要自己加，上一课的 new.target）；② instanceof 并不可靠——它查的是构造器的 prototype 是否出现在对象的**整条原型链**上，不能证明对象真是这个构造器造的（原型还能事后重赋值）",
        "工厂函数 = 返回对象的普通函数：不用 new，调用即装配即返回；不直接用原型，有性能代价，但除非造几千个对象否则不显著",
        "对象简写：属性名与变量名相同时 { name: name } 可写成 { name }；console.log({ name, age }) 比 console.log(name, age) 输出带标签、清晰得多",
        "解构：const { a, b } = obj 把对象属性拆进同名变量；数组版 const [first, second] = array 按位置拆",
        "私有变量：工厂函数里声明、**不放进返回对象**的变量（如 reputation）——外界只能经由你返回的闭包函数（getReputation / giveReputation）访问；返回对象里放 reputation 只是复制了一份值，不是「返回变量本身」",
        "组合（composition）：createPlayer 调用 createUser、解构出需要的函数、拼进自己的返回对象（或用 Object.assign 合并）——比继承更灵活（可以只挑需要的），每个实例的方法是新副本（原型继承是共享一份），量大才有性能顾虑",
        "IIFE = 立即调用函数表达式：把函数表达式包上括号立刻调用 (() => ...)()——不需要名字、不可被再次引用",
        "模块模式 = IIFE + 工厂思想：只需要一个实例时（如 calculator），用 IIFE 包住「私有状态 + 公开方法」，返回唯一对象——lastResult 私有、只能经 getLastResult 读",
        "封装（encapsulation）：把数据与代码打包成单一单元、只选择性地暴露单元内部需要交互的部分——模块模式就是封装的落地；对象字面量的属性全是公开的，这是「为什么不直接写字面量」的答案",
        "ES6 模块（import/export 语法）是 2015 年进语言的新特性，本站后面有专课；IIFE 模块模式是它之前的主流做法，野外代码库仍大量存在"
      ],
      "terms": [
        {
          "en": "Scope (global / function / block)",
          "zh": "作用域：变量的可用范围——全局（哪都能用）、函数（var：只在声明它的函数内）、块级（let/const：只在最近的花括号内）"
        },
        {
          "en": "Closure",
          "zh": "闭包：函数与它声明时词法环境的组合——外层函数返回后，内层函数仍持有当时的局部变量"
        },
        {
          "en": "Lexical environment",
          "zh": "词法环境：闭包「 surrounding state」的学名——函数被声明时作用域里的全部局部变量"
        },
        {
          "en": "Factory function",
          "zh": "工厂函数：返回新对象的普通函数——不用 new，像工厂一样按需生产对象"
        },
        {
          "en": "Private variable",
          "zh": "私有变量：不进返回对象、只能经由闭包函数访问的变量——JavaScript 里「真私有」的闭包实现"
        },
        {
          "en": "Object shorthand",
          "zh": "对象简写：{ name } 等价 { name: name }——属性名与变量名同名时的语法糖（ES2015）"
        },
        {
          "en": "Destructuring",
          "zh": "解构：const { a, b } = obj / const [x, y] = arr——把对象属性或数组元素「拆包」进变量"
        },
        {
          "en": "Composition",
          "zh": "组合：从多个来源各取所需拼出新对象——工厂函数实现「类继承」效果的灵活替代"
        },
        {
          "en": "IIFE",
          "zh": "立即调用函数表达式：(() => {...})()——声明即调用的匿名函数，不留名字、不可复用"
        },
        {
          "en": "Module pattern",
          "zh": "模块模式：IIFE 包住私有状态与公开方法、返回唯一对象——ES6 模块之前的主流封装手法"
        },
        {
          "en": "Encapsulation",
          "zh": "封装：把数据与代码打成单一单元、选择性暴露——「只让别人碰需要碰的」"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：按官方铺的顺序吃——作用域 → 闭包 → 构造器槽点 → 工厂 → 组合 → 模块模式，跳过任何一层后面都是魔法",
        "读 Wes Bos 的 Scope 一文（Assignment 第 1 条）：作用域的系统复习",
        "读 Wes Bos 的 Closures 一文（Assignment 第 2 条）：闭包的第二遍讲解，例子不同、结论一致",
        "读 MDN 的闭包指南（Assignment 第 3 条，有官方中文版）：权威定义 + 更多例子；官方提醒先忽略其中 ES6 modules 部分（后面有专课）",
        "亲手跑官方全部代码块：makeAddingFunction、createUser（含私有 reputation）、createPlayer 两种组合写法、calculator 模块——每个都敲一遍再改参数试",
        "自测：合上资料，白纸写出「一个带私有计数器的工厂函数」和「一个 IIFE 模块」的骨架——写不出就回本站讲解重读对应节"
      ],
      "quiz": [
        {
          "question": "var 与 let/const 的作用域差别是什么？官方例子里哪两行会报错？",
          "answer": "var 是函数作用域：只在声明它的函数内可用；let/const 是块级作用域：只在最近的一对花括号（for、if 等任何块）内可用。官方例子两处报错：if 块内 const 声明的 constAge 在 if 块外 console.log 会报错（块级变量出了块就没了）；函数内 var 声明的 varAge 在函数外 console.log 会报错（函数作用域出了函数就没了）。"
        },
        {
          "question": "什么是闭包？makeAddingFunction(5) 返回后，那个 5 去哪了？",
          "answer": "闭包 = 函数 + 它被声明时的词法环境（当时作用域里的局部变量）的组合。makeAddingFunction(5) 执行完毕后，5 不会被内存清理掉——因为返回的函数仍然需要它：返回的函数持有自己的词法环境（含 firstNumber 参数）。所以 add5(2) 能算出 7，add8(2) 能算出 10——每个返回的函数各自「记住」了自己出生时的那份变量。"
        },
        {
          "question": "为什么返回对象里写 { name, discordName, reputation } 不能把 reputation 变成「活的私有变量」？",
          "answer": "那是对象简写，等价于 reputation: reputation——只是创建了一个新属性、把当时 reputation 变量的**值复制**进去，跟 let b = a 一样：之后 a 变 b 不变。返回的对象属性不会「追踪」原变量。访问私有变量的**唯一**途径是闭包：返回 getReputation / giveReputation 这样的函数，它们内部引用着活的 reputation。"
        },
        {
          "question": "calculator 例子为什么用 IIFE + 工厂而不是直接写对象字面量？IIFE 相比「命名工厂函数再调用一次」多了什么？",
          "answer": "对象字面量的属性全是公开的——calculator.lastResult 谁都能直接改成任何值。IIFE 把 lastResult 关进函数作用域（真私有），只暴露 getLastResult 供读取、四个运算方法供使用——这就是封装：只暴露需要交互的部分。相比命名函数调用一次：IIFE 不需要给函数起名字（不占用作用域里的名字），且结构上不可能被再次调用或引用——「只此一个 calculator」由语法保证。"
        },
        {
          "question": "组合（composition）与原型继承相比，灵活在哪、代价是什么？",
          "answer": "灵活：createPlayer 可以从 createUser 的产物里**只挑需要的**（解构出 getReputation / giveReputation），其余藏为私有，还能用 Object.assign 从多个来源合并——继承是「全盘接受父类」。代价：每个实例都新建一份「继承来的」方法副本（原型继承是全体实例共享内存里的同一份）——官方口径：除非造海量对象，实践中不太可能成为显著问题。"
        }
      ],
      "optional": [],
      "note": "官方 Assignment 三篇阅读（Wes Bos scope / Wes Bos closures / MDN 闭包指南）全部必做；MDN 指南有官方中文版，官方提醒先忽略其中 ES6 modules 部分（本站后面有专课）。官方原文的提示块五处（对象简写、解构、返回变量陷阱警告、构造器与闭包、ES6 modules 预告）全部并入本站讲解。「构造器与闭包」提示块的结论已收进自测题：构造器内定义闭包方法技术上可行，但方法变得不可继承，违背构造器配合原型的初衷。",
      "why": "闭包是 JavaScript 面试与实战的双重核心：防抖节流、事件回调记住状态、React 的 hooks、本站你正在用的每个模块——底层全是闭包。工厂函数与模块模式则是「没有 import/export 的年代」JavaScript 组织代码的标准答案，大量现存代码库仍在用；就算你日后全用 ES6 模块与 class，读得懂 IIFE 模块与闭包私有变量也是读源码的门票。这一课的概念密度全章最高，值得放慢。",
      "sections": [
        {
          "h": "作用域：变量在哪里可用",
          "p": [
            "「作用域」（scoping）问的本质是一句话：**某个变量在哪里对我可用**——它标示变量的当前上下文。不在任何函数里、存在于任何花括号之外的变量在**全局作用域**，到处可用；在函数或花括号里的，是局部作用域。",
            "ES6 之前 JavaScript 只有 `var` 一个声明关键字：可重复定义、可更新，作用域是**函数级**——只在声明它的函数内可用。ES6 引入 `let` 与 `const`：它们声明的变量是**块级作用域**——只在定义它的最近一对花括号内可用（for 循环、if-else、任何块都算）。",
            "官方例子（见示例 1）把三层作用域放进同一段代码：全局的 globalAge、函数内 var 的 varAge、if 块内 const 的 constAge——if 块外访问 constAge 报错，函数外访问 varAge 报错。官方建议：这个例子值得多泡一会儿，概念不炸裂但术语密集，它们是理解下一个巨兽（闭包）的地基。"
          ]
        },
        {
          "h": "闭包不可怕：函数 + 出生时的环境",
          "p": [
            "你已经习惯「函数带参数、按输入算输出」；函数还能干一件事：**用函数创建函数**。官方例子 makeAddingFunction(firstNumber)：函数体内返回另一个函数 returnedFunction(secondNumber)，它算 firstNumber + secondNumber。",
            "用起来：`const add5 = makeAddingFunction(5);` 之后 add5(2) 得 7；`const add8 = makeAddingFunction(8);` 之后 add8(2) 得 10。不必每次写新函数——像 toFormattedDateString(date) 一样，一个函数按需生产函数。",
            "机制：**returnedFunction 围绕 firstNumber 参数形成了闭包**。闭包 = 函数 + 它被声明时的** surrounding state（词法环境）**——声明时作用域里的全部局部变量。makeAddingFunction(5) 执行完后，**5 不会被内存清理**，因为返回的函数还要用它：add5 持有自己的词法环境（里面住着 firstNumber = 5）。",
            "官方定性：这是函数的**关键**（crucial）行为——它让我们把数据与函数关联起来，并在外层函数之外的任何地方操纵这些数据。马上到来的工厂函数就靠它吃饭。"
          ]
        },
        {
          "h": "构造器怎么了：两个历史槽点",
          "p": [
            "官方口径先摆正：构造器不是坏东西、不该回避——它们是语言的基本构件，只是历史上有人对两件事不爽。",
            "**槽点一：没有防误用的自动保险**。构造器语法上就是普通函数，不带 new 调用也「能跑」——不做新对象与 this 绑定那套事，错误难追踪（防护得自己加，上一课的 new.target）。有的场景还故意利用这一点：官方的例子是 Date() 构造器，带不带 new 调用返回不同的东西。但多数时候这不是你想要的。",
            "**槽点二：instanceof 的实际工作方式**。在别的语言里同类关键字是可靠的「出身证明」；在 JavaScript 里，instanceof 检查的是构造器的 prototype 是否出现在对象的**整条原型链**上——这不能确认对象真是那个构造器造的，原型甚至可以在对象创建后被重新赋值。",
            "因此一些人（不是所有人）在一些场合更喜欢另一种模式。虽然如今有 class 语法（后面学）能绕开构造器的大部分缺点，工厂模式在野外依然常见、有自己的优劣——「工厂函数，登场」。"
          ]
        },
        {
          "h": "工厂函数：不用 new 的造对象机器",
          "p": [
            "工厂函数与构造器干的事非常像，关键区别是**它靠闭包**：不用 new，调用函数时装配并**返回**新对象。说到底就是「返回对象的普通函数」——名字唬人，只是因为用法像工厂（按需生产对象）。",
            "官方对比（见示例 2）：构造器版 User(name) 用 this 挂属性；工厂版 createUser(name) 算好 discordName 后 `return { name, discordName };`——普通函数调用，不需要 new。",
            "**性能取舍（官方明说）**：工厂不直接用原型，每个实例带自己的方法副本，确有性能代价——但作为通则，除非你在造**几千个**对象，这个代价不显著。官方给了个反直觉类比帮你校准：想象每个数组都自带一整套数组与对象方法的私有副本有多疯——方法共享（原型）在基础类型上当然重要，但应用层的几十个对象无所谓。",
            "**提示块两个语法糖**（此后每一课都在用）：① **对象简写**——属性名与变量名相同时 `{ name: name, age: age }` 可写成 `{ name, age }`；顺带 console.log({ name, age, color }) 输出带标签的对象，比 log 一串裸值清晰得多。② **解构**——`const { a, b } = obj;` 把对象属性拆进同名变量（等价 const a = obj.a），数组版 `const [zeroth, first] = array;` 按位置拆；官方挂了 MDN 解构文档说例子很好、值得一读。"
          ]
        },
        {
          "h": "私有变量：闭包的第一次实战",
          "p": [
            "把 createUser 扩展一下（见示例 3）：函数体里加 `let reputation = 0;`，再定义两个箭头函数 getReputation（读它）与 giveReputation（加一），**返回对象里只放这两个函数，不放 reputation 本身**。",
            "效果：`const josh = createUser(\"josh\");` 之后 josh.giveReputation() 两次，josh.getReputation() 得 2——但 josh.reputation 是 undefined：**外界摸不到变量本体，只能走你留的两个闭包函数**。这就是「私有」变量：返回对象里既没有它、也没有它的任何副本，访问途径只有闭包。",
            "**官方警告提示块（高频误区）**：`return { name, discordName, reputation };` 不是「返回 reputation 变量」——对象简写展开就是 reputation: reputation，只是新建一个属性、**复制当时的值**。跟 `let b = a; a = 5;` 之后 b 还是 1 一模一样：新变量不「追踪」原变量。访问私有变量的**唯一**方式是闭包。",
            "为什么值得这么绕？官方给了工程理由：私有函数与变量让工厂内部保持整洁——不是每个函数都需要返回、不是每个内部变量都需要暴露；reputation 若直接暴露，就存在被手滑设成 -18000 的「脚枪」，而 getReputation / giveReputation 把能做的事限定在你设计的轨道内。",
            "**提示块（构造器与闭包）**：技术上构造器也能用闭包——把访问「私有属性」的方法定义在构造器体内而不是 prototype 上。但那样方法就**不可继承**了，违背构造器（配合原型共享）的初衷。"
          ]
        },
        {
          "h": "组合：工厂版的「继承」",
          "p": [
            "需求：Player 除了自己的属性，还要用上 User 的部分（或全部）能力。构造器的答案是原型继承；工厂的答案是**组合**（见示例 4）。",
            "写法一（解构挑拣）：createPlayer 内部调用 createUser(name)，**解构出**需要的 getReputation 与 giveReputation，连同自己的 getLevel / increaseLevel 一起返回——User 的其余部分自然藏成私有。写法二（整包合并）：`return Object.assign({}, user, { getLevel, increaseLevel });`——从多个来源取东西时更顺手（MDN 文档已挂原文）。",
            "代价官方如实说：每个 createPlayer 实例都新建一份「继承来的」方法（原型继承是共享内存里的同一份）——但同前文口径，除非海量对象，实践中不构成显著问题。",
            "**组合的定位**：它做的事与继承相似，但更灵活——你不一定想要另一个对象的**全部**（想要全部也可以），而是从多个来源「拼装」新对象。有的问题天然适合继承，有的场景继承很脆（brittle），组合的灵活性正对症。官方补一句：构造器技术上也能组合，但构造器天然偏向继承路线，组合在工厂函数手里明显更自然。"
          ]
        },
        {
          "h": "IIFE 与模块模式：只需要一个的「工厂」",
          "p": [
            "很多时候你不需要工厂生产**多个**对象——你只是想包起一段代码、把不需要外用的变量与函数藏成私有。手法：把函数表达式包上括号**立即调用**——IIFE（Immediately Invoked Function Expression，立即调用函数表达式）。`() => console.log(\"foo\")` 是函数表达式；`(() => console.log(\"foo\"))()` 就是 IIFE。",
            "**警告提示块（ES6 modules 预告）**：2015 年的 ES6 引入了语言级「模块」（文件间 import/export 的语法）。本课讲的是 IIFE 实现的传统模块模式——野外仍大量存在；ES6 模块本站后面有专课。",
            "**模块模式**（见示例 5）：calculator 只需一个实例，但仍用「工厂 + IIFE」——函数体里 `let lastResult;` 私有，add / subtract / multiply / divide 各自更新它，getLastResult 只读暴露，IIFE 返回这五个方法组成的对象。为什么不直接对象字面量？**对象属性不管你想不想都是公开的**：字面量版的 calculator.lastResult 谁都能直接赋值成 111100105110。要真藏住它，唯一的办法是把它放进函数作用域、在同作用域里造对象再返回——一个只调用一次的工厂函数。",
            "这就是**封装**（encapsulation）：把数据、代码打包成单一单元，**选择性地**暴露单元内部——包进模块的代码不向程序全身敞开，只露出交互所需的接口。",
            "**为什么非要 IIFE**（官方自问自答）：不用 IIFE 就得给工厂函数起名字才能调用——名字占用了作用域、还意味着它可以被再次调用，而你**刻意只要一次**。IIFE 达成同样的代码流，但函数没有名字、事后无法被引用——创建 calculator 的代码被打包成一个事实上的模块，暴露给后续代码的只有 calculator 对象。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "// 三层作用域同框（官方原码）\nlet globalAge = 23;            // 全局作用域：到处可用\n\nfunction printAge(age) {\n  var varAge = 34;             // 函数作用域：只在本函数内可用\n\n  if (age > 0) {               // 又一对花括号 = 一个块\n    const constAge = age * 2;  // 块级作用域：只在这个 if 块内可用\n    console.log(constAge);     // OK\n  }\n\n  console.log(constAge);       // 报错！块级变量出了块就不存在\n}\n\nprintAge(globalAge);\nconsole.log(varAge);           // 报错！函数作用域变量出了函数就不存在",
          "note": "官方作用域示例原码：两处 console.log 都故意报错——块级（let/const）出块即无、函数级（var）出函数即无。跑之前先在心里预判哪行炸，再对照答案。"
        },
        {
          "lang": "javascript",
          "code": "// 闭包：函数生产函数（官方原码）\nfunction makeAddingFunction(firstNumber) {\n  // firstNumber 在 makeAddingFunction 全域可用，包括返回的函数里\n  return function returnedFunction(secondNumber) {\n    return firstNumber + secondNumber;\n  };\n}\n\nconst add5 = makeAddingFunction(5);\nconsole.log(add5(2)); // 7——返回的函数「记住」了 5\n\nconst add8 = makeAddingFunction(8);\nconsole.log(add8(2)); // 10——另一个闭包记住的是 8\n\n// 构造器 → 工厂的对照（官方原码）\nfunction User(name) {\n  this.name = name;\n  this.discordName = \"@\" + name;\n}\n\nfunction createUser(name) {\n  const discordName = \"@\" + name;\n  return { name, discordName };   // 对象简写：{ name: name, discordName: discordName }\n}\n// createUser 是普通函数：不需要 new",
          "note": "上半是闭包的最小可跑证明：makeAddingFunction 执行完，5 和 8 各自活在返回函数的词法环境里。下半是构造器与工厂的同功能对照——差别只在 new 与 return。"
        },
        {
          "lang": "javascript",
          "code": "// 私有变量：闭包实战（官方原码）\nfunction createUser(name) {\n  const discordName = \"@\" + name;\n\n  let reputation = 0;                       // 私有：不进返回对象\n  const getReputation = () => reputation;   // 读通道\n  const giveReputation = () => { reputation++; }; // 写通道（只能加一）\n\n  return { name, discordName, getReputation, giveReputation };\n}\n\nconst josh = createUser(\"josh\");\njosh.giveReputation();\njosh.giveReputation();\n\nconsole.log({\n  discordName: josh.discordName,\n  reputation: josh.getReputation()\n}); // { discordName: \"@josh\", reputation: 2 }\n\n// 陷阱对照（官方警告块）：这样写不是「返回变量」，是复制值\n// return { name, discordName, reputation };  ← reputation 属性永远是 0 的快照",
          "note": "reputation 本体外界摸不到（josh.reputation 是 undefined），只能走 getReputation / giveReputation 两条闭包通道——「手滑设成 -18000」这类脚枪被结构性排除。末尾注释是官方警告块的反例。"
        },
        {
          "lang": "javascript",
          "code": "// 组合：工厂版「继承」（官方原码，两种写法）\nfunction createPlayer(name, level) {\n  // 写法一：解构挑拣——只拿需要的，其余藏为私有\n  const { getReputation, giveReputation } = createUser(name);\n\n  const getLevel = () => level;\n  const increaseLevel = () => { level++; };\n  return { name, getReputation, giveReputation, getLevel, increaseLevel };\n}\n\nfunction createPlayer2(name, level) {\n  // 写法二：Object.assign 整包合并——多来源时更顺手\n  const user = createUser(name);\n\n  const getLevel = () => level;\n  const increaseLevel = () => { level++; };\n  return Object.assign({}, user, { getLevel, increaseLevel });\n}",
          "note": "两种写法效果相同：Player 拿到 User 的能力但不经原型链。注意代价：每个 player 实例的方法都是新副本（原型继承是共享一份）——官方口径：除非海量对象，不构成实际问题。"
        },
        {
          "lang": "javascript",
          "code": "// IIFE + 模块模式（官方原码）\nconst calculator = (() => {\n  let lastResult;              // 私有状态：外界摸不到\n\n  const add = (a, b) => { lastResult = a + b; return lastResult; };\n  const subtract = (a, b) => { lastResult = a - b; return lastResult; };\n  const multiply = (a, b) => { lastResult = a * b; return lastResult; };\n  const divide = (a, b) => { lastResult = a / b; return lastResult; };\n  const getLastResult = () => lastResult;   // 只读暴露\n\n  return { add, subtract, multiply, divide, getLastResult };\n})();                          // ← 立即调用：函数没有名字、不可再被引用\n\nconsole.log(calculator.add(3, 5));          // 8\nconsole.log(calculator.subtract(6, 2));     // 4\nconsole.log(calculator.getLastResult());    // 4\n// calculator.lastResult = 999;  ← 想都别想：lastResult 不在对象上，\n//    这句只会给 calculator 挂一个没人读的新属性，真 lastResult 纹丝不动",
          "note": "只需要一个实例时的封装标准件：私有状态 + 选择性暴露。对象字面量做不到这一点——字面量的属性全是公开的，谁都能 calculator.lastResult = 111100105110。这个模式在 ES6 模块普及前的代码库里无处不在，本站自己的每个 .js 文件也是同款结构（IIFE 包住一切、只挂一个 window.ODIN_* 出口）。"
        }
      ],
      "pitfalls": [
        {
          "title": "把「返回对象里放变量」当成返回私有变量",
          "text": "return { reputation } 只是复制当时的值进新属性（等价 reputation: reputation），属性不会追踪变量后续变化——官方用 let b = a 的对照专门警告过。私有变量的唯一访问通道是闭包函数（getter/setter），没有第二种办法。"
        },
        {
          "title": "块级变量出块就用 / 函数变量出函数就用",
          "text": "if、for 的花括号就是边界：块内 const 声明的变量出块即 ReferenceError；var 的函数作用域同理出函数即无。写代码前先问「这个变量住在哪对花括号里」——官方例子的两处报错就是标准事故现场。"
        },
        {
          "title": "拿 instanceof 当出身证明",
          "text": "它只查「构造器的 prototype 在不在对象的整条原型链上」——原型可以事后重排，链上有不等于真是它造的。判断对象能力用鸭子类型（有没有那个方法），别依赖 instanceof 的血统论。"
        },
        {
          "title": "为性能焦虑过早抛弃工厂函数",
          "text": "「每实例一份方法副本」的代价只在造几千上万个对象时才显著——官方两次校准这个量级。应用层的几十个 Player、几百本书，放心用工厂；真到海量对象再考虑原型共享或 class。"
        },
        {
          "title": "把 IIFE 模块模式与 ES6 模块混为一谈",
          "text": "本课的模块模式 = IIFE + 闭包封装（一个文件内包出私有作用域）；ES6 modules = 语言级的文件间 import/export（2015 年进标准，本站后面有专课）。野外老代码库多是前者、新代码多是后者——读得懂前者、写新代码用后者。"
        }
      ],
      "official": {
        "assignment": [
          "读 Wes Bos 的 Scope 一文——作用域的系统复习。",
          "读 Wes Bos 的 Closures 一文——闭包的第二遍讲解。",
          "读 MDN 的闭包指南（Closures）——权威定义与更多例子；官方提醒：先忽略其中的 ES6 modules 部分，后面课程会专门讲。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/organizing_your_javascript_code/factory_functions_and_module_pattern.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "9b7c663d27c5e5534270910c9b0504b0d0d6c2116b6764a5d4b9a47b96dac905",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-javascript-tic-tac-toe",
      "title": "Project: Tic Tac Toe",
      "zh": "项目：井字棋",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe",
      "summary": "在浏览器里做一个能玩的井字棋——但它真正的考题不是游戏逻辑，而是架构：官方要求「全局代码尽可能少」，单实例的东西（棋盘、显示控制器）用 IIFE 模块模式包死，每一块逻辑都要想清楚住在 game、player 还是 gameboard 对象里；先在控制台把游戏跑通（含全部获胜三连与平局判定），再碰 DOM。这是上一课工厂函数与模块模式的第一次全尺寸实战。本站只提供要求中文化、拆解与验收清单，不提供成品代码。",
      "guide": "以下是官方项目要求的中文化与拆解。这个项目是「组织 JavaScript 代码」章节前半程（对象、构造器、工厂函数、闭包、模块模式）的综合验收：游戏本身你在 Foundations 的石头剪刀布里已经见过同类，难点全部集中在**代码住在哪**——官方花了六条任务里的三条讲架构（全局代码最少化、逻辑归属、先控制台后 DOM），只有三条讲功能。推荐节奏：先花时间头脑风暴三个对象各管什么（官方原话：这里花点时间头脑风暴，后面能省大量麻烦），再按「控制台可玩 → 渲染上页 → 点击落子 → 界面收尾」四步推进，每步一个 git commit。卡住了读官方推荐的 ayweb.dev 文章——它用一个盖房子的例子完整演示了这个项目该怎么拆解与组织代码。按本站红线，本页不提供任何成品代码。",
      "understand": [
        "数据核心：棋盘是一个数组，住在一个 Gameboard 对象里；玩家也存成对象；另要一个控制游戏流程的对象——三个对象各司其职",
        "架构总目标（官方原话）：**全局代码尽可能少**——尽量把代码塞进工厂函数里",
        "只需要单个实例的东西（gameboard、displayController 等）：把工厂包进 IIFE（模块模式），让它无法被复用来造第二个实例——上一课 calculator 的手法直接复用",
        "每一块逻辑都要想清楚住哪：每个小功能都应该能装进 game、player 或 gameboard 对象之一，放进「合乎逻辑」的位置——先头脑风暴再动手",
        "推进顺序是硬要求：先在**控制台**做出能玩的游戏（含游戏结束判定：全部获胜三连 + 平局），此时不碰 DOM、不接用户输入——自己调函数传参数「手工对弈」来验证逻辑",
        "控制台版跑通后才建显示/DOM 逻辑对象：写一个把 gameboard 数组内容渲染到网页的函数（可先用 X/O 填满数组看渲染效果）",
        "交互：玩家点击棋盘格子落子；必须有「已占位置不能再下」的逻辑",
        "收尾：玩家名字输入、开始/重开按钮、游戏结束时的结果显示元素"
      ],
      "terms": [
        {
          "en": "Gameboard object",
          "zh": "棋盘对象：内部用数组存九格状态，单实例——官方指定用 IIFE 模块模式包死的对象之一"
        },
        {
          "en": "Display controller",
          "zh": "显示控制器：专职把棋盘数组渲染到 DOM、处理界面更新的对象——与游戏逻辑分离，同样单实例"
        },
        {
          "en": "Game flow controller",
          "zh": "游戏流程控制对象：管轮次切换、胜负判定、重开——官方任务 2 点名的第三个对象"
        },
        {
          "en": "Console-first development",
          "zh": "控制台先行：游戏逻辑全部用控制台验证跑通后才碰 DOM——把「逻辑 bug」与「渲染 bug」两类问题分开排查的开发策略"
        }
      ],
      "tasks": [
        "搭好项目：HTML / CSS / JavaScript 文件与 Git 仓库（官方默认你已熟练）",
        "头脑风暴架构（官方建议先做）：gameboard / player / game flow 三个对象各管什么、每块逻辑住哪；卡住就读官方推荐的 ayweb.dev 文章 Building a house from the inside out——它完整演示了这个项目的拆解与代码组织方式",
        "搭数据与逻辑层：Gameboard 对象（数组存棋盘）、玩家对象（工厂函数造，需要几个造几个）、流程控制对象；**全局代码尽可能少**，单实例对象（gameboard、displayController）用 IIFE 包死",
        "控制台跑通：在控制台里做出完整可玩的游戏——自己调函数传参数对弈，包含**全部获胜三连与平局**的结束判定；这一步不碰 DOM、不接用户输入",
        "接显示层：建一个处理 display/DOM 逻辑的对象，写「把 gameboard 数组渲染到网页」的函数（可先用 X/O 填数组看效果）",
        "接交互：玩家点击棋盘格子在对应位置落子；实现「已占位置不能再下」的拦截逻辑",
        "界面收尾：玩家名字输入、开始/重开按钮、游戏结束显示结果",
        "对照下方验收清单自查；每个大步骤一个 git commit，最后推到远端"
      ],
      "quiz": [
        {
          "question": "官方为什么要求「只需要一个实例的东西」用 IIFE 包住工厂？举出本项目里的两个例子。",
          "answer": "IIFE 让工厂函数没有名字、无法被再次引用——「只此一个实例」由语法结构保证，不会被误用再造出第二个棋盘或第二个显示控制器（全局状态一多，数据漂移的 bug 就来了）。本项目的官方例子：gameboard 与 displayController。这正是上一课 calculator 模块的模式。"
        },
        {
          "question": "「先在控制台做能玩的游戏」这一步，官方明确要求包含什么、明确说不用管什么？",
          "answer": "必须包含：游戏结束判定——检查**所有获胜三连**（横三、竖三、两条对角线）与**平局**。不用管：DOM 与 HTML/CSS（官方原话：在游戏能跑之前尽量别想它们），以及用户输入——你自己调用函数、传参数来「对弈」，验证每一步逻辑都按预期工作。"
        },
        {
          "question": "「每一块逻辑都要想清楚住哪」——按官方的对象划分，「判断当前是否有人获胜」「记录玩家名字」「把棋盘渲染到页面」分别应该住在哪？",
          "answer": "胜负判定属于游戏流程——住 game（流程控制）对象（它消费 gameboard 的数据做判定）；玩家名字是玩家自己的数据——住 player 对象；渲染是显示职责——住 displayController，绝不混进 gameboard（棋盘只管数据，不管自己长什么样）。官方原话：每个小功能都应能装进 game、player 或 gameboard 之一，放进「合乎逻辑」的位置。"
        },
        {
          "question": "玩家在已被占据的格子上点击，正确的处理方式是什么？为什么这个逻辑不能只写在显示层？",
          "answer": "拦截：点击处理先查 gameboard 数组对应位置是否已有标记，有则不落子（可以什么都不发生或给个提示）。逻辑要住在数据层（game/gameboard 一侧）而不只是显示层——因为棋盘数组是事实源：如果只靠界面上「画了 X」来挡，任何绕过点击的调用路径（比如你控制台手工对弈）都能把数据改坏；数据层守住规则，显示层只是数据的镜子。"
        }
      ],
      "optional": [],
      "note": "Project 红线课：本站不提供成品代码或完整骨架（examples 为空数组）。官方原文只有六条任务与架构要求，没有代码骨架——本项目从架构到实现全部自己动手，这正是它的训练价值。官方推荐的 ayweb.dev 文章（Building a house from the inside out）已登记进本课资料并接进任务。",
      "why": "井字棋是「架构思维」的第一个毕业考：功能你早就会写（石头剪刀布的升级版），但官方把评分点全压在「代码住在哪」上——全局最少化、单实例 IIFE、逻辑归属、控制台先行。这套纪律直接决定下一个项目（Restaurant Page 的多页面模块化）和 Todo List（大状态管理）做不做得动。现在花时间把三个对象的边界想清楚，后面每个功能的落位都是显然的；边界不清，代码就会长成一团互相纠缠的全局变量。",
      "sections": [
        {
          "h": "项目定位：考题是架构，不是游戏",
          "p": [
            "官方开场一句话：做一个能在浏览器里玩的井字棋。但读完全部六条任务你会发现：讲功能的是后三条，讲**架构**的是前三条——数据怎么组织、逻辑住在哪、按什么顺序推进。",
            "这是上一课（工厂函数与模块模式）的全尺寸实战：工厂造玩家、IIFE 包单实例、闭包藏私有状态，全部用上。你在 Foundations 写过石头剪刀布，游戏规则不难——难的是把代码组织成官方要的样子。"
          ]
        },
        {
          "h": "架构要求：三个对象 + 全局最少化",
          "p": [
            "官方任务 2 给了数据结构的底：**棋盘是数组，住在一个 Gameboard 对象里**（从这里开始搭）；**玩家也存成对象**；你还多半需要一个**控制游戏流程本身**的对象。",
            "架构总目标（官方原话）：**全局代码尽可能少**——尽量把代码塞进工厂（factories）里。只需要单个实例的东西（官方举例：gameboard、displayController 等），把工厂包进 IIFE（模块模式），让它**无法被复用来造额外实例**——calculator 那一课的手法原样落地。",
            "官方任务 2 的第二条子弹块值得抄在便签上：这个项目里，仔细想**每一块逻辑该住哪**——每个小功能都应该能装进 game、player 或 gameboard 对象之一，把它们放进「合乎逻辑」的位置。**这里花一点时间头脑风暴，后面能省大量麻烦。**",
            "官方还给了救援通道（第三条子弹块）：卡住时读 ayweb.dev 的 Building a house from the inside out——官方评价它是「高度适用」的范例，既演示怎么下手做这个项目，也演示怎么组织与结构化代码（已接进本课资料与任务）。"
          ]
        },
        {
          "h": "推进顺序：控制台先行，DOM 靠后",
          "p": [
            "官方任务 3 是硬性顺序：**先专注在控制台里做出能玩的游戏**。必须包含游戏结束判定——检查**所有获胜的三连**与**平局**。",
            "这一步的纪律（官方原话）：在游戏能跑之前，**尽量别想 DOM 和你的 HTML/CSS**；也**不用担心用户输入**——你自己调用函数、传参数来玩这个游戏，检查一切是否按预期工作。",
            "为什么这个顺序值得服从：逻辑 bug 与渲染 bug 是两类完全不同的问题，混在一起排查会互相掩护。控制台版跑通意味着「规则层」已经铁定正确，之后接 DOM 出的任何问题都能锁定在渲染与交互层。",
            "任务 4：控制台版能玩之后，创建一个处理 **display/DOM 逻辑**的对象，写一个把 gameboard 数组内容**渲染到网页**的函数（官方提示：现阶段可以先把数组填满 X 和 O，看看渲染出来什么样）。Library 项目「数据与显示分离」的思想在这里升级成「三个对象」的版本。"
          ]
        },
        {
          "h": "交互与收尾：点击落子、名字、重开与结果",
          "p": [
            "任务 5：写让玩家**通过与 DOM 元素交互**在指定位置落子的函数（例如点击棋盘格子放下标记）。官方点名别忘：**禁止在已占据的位置落子**的逻辑——这个判定应该查棋盘数组（数据是事实源），而不是看格子上画没画东西。",
            "任务 6 收尾三件套：让玩家**输入名字**的界面；**开始/重开**按钮；游戏结束时**显示结果**的展示元素。",
            "收尾建议：重开按钮是最好的架构检验——如果三个对象的边界划得对，重开就是「棋盘数组清空 + 分数/轮次复位 + 重新渲染」三句话的事；如果状态散落各处，你会发现重开之后总有某个角落还留着上一局的痕迹。"
          ]
        },
        {
          "h": "验收清单",
          "p": [
            "对照自查：① Git 仓库 + HTML/CSS/JS 骨架；② 棋盘 = Gameboard 对象里的数组，玩家 = 对象（工厂造），另有流程控制对象；③ 全局代码最少化：单实例对象（gameboard / displayController）用 IIFE 包死、无法再造第二个；④ 控制台版完整可玩：所有获胜三连 + 平局判定都验证过；⑤ 渲染函数把棋盘数组画到页面，显示逻辑住在专门的对象里；⑥ 点击落子可用，已占位置被拦截；⑦ 玩家名字输入、开始/重开按钮、结束结果显示三件齐；⑧ 每块逻辑都能说出「它为什么住在这个对象里」。",
            "官方没有给测试对照，检验标准就是第 ⑧ 条：随机指任何一段代码问「它为什么不住在别的对象里」，你能答上来，架构就合格了。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "一上手就画棋盘格子",
          "text": "官方明文：游戏逻辑在控制台跑通之前尽量别想 DOM 与 HTML/CSS。先画界面的后果是逻辑与渲染纠缠——出了 bug 分不清是规则错了还是画错了。忍住，先在控制台里用函数调用「手工对弈」。"
        },
        {
          "title": "状态散落全局：棋盘数组、当前玩家、分数全是顶层变量",
          "text": "这正是官方「全局代码尽可能少」要防的：全局状态谁都能改，改坏了没有单一出处可查。棋盘状态进 Gameboard、玩家数据进 player 工厂、轮次与胜负进 game 流程对象——每个变量都有唯一的家。"
        },
        {
          "title": "displayController 用普通工厂而不是 IIFE",
          "text": "普通工厂谁都能再调一次造出第二个显示控制器——两个控制器各自缓存界面状态，渲染就开始打架。官方点名：单实例的东西用 IIFE 包死，让「再造一个」在语法上不可能。"
        },
        {
          "title": "漏判对角线或平局",
          "text": "获胜三连共 8 条：3 横 + 3 竖 + 2 对角线——对角线最容易漏。平局判定也常被忘：棋盘满且无人获胜要能宣告平局，否则游戏永远「进行中」。控制台阶段就把 8 条线与平局各测一遍。"
        },
        {
          "title": "占位拦截只看界面不看数据",
          "text": "「格子画了 X 就不让点」是靠不住的——事实源是棋盘数组：点击处理先查数组对应位置，有值就拦截。数据层守规则，显示层只是镜子（Library 项目纪律的延续）。"
        }
      ],
      "official": {
        "assignment": [
          "用 HTML、CSS、JavaScript 文件搭好项目，Git 仓库建好。",
          "棋盘将作为数组存在一个 Gameboard 对象里——从这里开始。玩家也存成对象，你多半还需要一个控制游戏流程本身的对象。子弹块一：主要目标是全局代码尽可能少——尽量把代码塞进工厂里；只需要单个实例的东西（如 gameboard、displayController），把工厂包进 IIFE（模块模式），使它不能被复用来创建额外实例。子弹块二：仔细思考每一块逻辑该住在哪里——每个小功能都应该能装进 game、player 或 gameboard 对象，把它们放进「合乎逻辑」的位置；在这里花点时间头脑风暴，后面会轻松得多。子弹块三：卡住时读 ayweb.dev 的 Building a house from the inside out——官方评价它给出了高度适用的范例，既演示如何应对这个项目，也演示如何组织与结构化代码。",
          "先专注在控制台里做出能玩的游戏。确保包含游戏结束判定：检查所有获胜的三连与平局。在游戏能跑之前尽量别想 DOM 与 HTML/CSS；也不用担心用户输入——自己调用函数、传参数来玩，检查一切是否按预期工作。",
          "控制台版能玩之后，创建一个处理显示/DOM 逻辑的对象。写一个把 gameboard 数组内容渲染到网页的函数（现阶段可以先把数组填满 X 和 O 看效果）。",
          "写让玩家通过与相应 DOM 元素交互在棋盘特定位置落子的函数（例如点击格子放标记）。别忘了禁止在已占据位置落子的逻辑。",
          "清理界面：让玩家能输入名字、加开始/重开按钮、加一个游戏结束时显示结果的展示元素。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/organizing_your_javascript_code/project_tic_tac_toe.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "5a5d082c5a07bfe6e1f395f789ba7004569ad3a1ac98f30e5847faa538c21b0c",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-javascript-classes",
      "title": "Classes",
      "zh": "类",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-classes",
      "summary": "ES6 的 class 语法：官方定性很直白——JavaScript 并没有 Java/Ruby 那种意义上的类，class 基本上是一套「大体近似（mostly resembles）对象构造器与原型」的新语法（语法糖），底层机制没变（没有经典继承在发生）。本课覆盖官方 lesson overview 的六个点：构造器与类的差别、getter/setter、基本类语法、extends 继承、私有字段（#）、static 静态成员；Practice 要求把 Library 项目重构成 class 版并走 git 分支流程。",
      "guide": "以下是官方原课的中文化梳理。这一课的官方正文很短——重头戏在 Assignment 的三组阅读（javascript.info 的属性访问器与 class 入门、MDN 的 Classes 深入）与 Practice（重构你自己的 Library 项目）。本站正文按官方 lesson overview 的六个考点把 class 语法一次讲清：你会看到 class 的每个特性都能对回前两课学过的机制——方法住在 prototype 上、extends 就是 setPrototypeOf 的语法化、#私有字段就是工厂函数闭包私有的语言级版本、static 就是挂在构造器函数本体上的属性。官方的历史视角值得记住：ES6 发布时 class 语法有争议，正因为它「长得像」Java 的类而底层完全不是——语法不显式，人就容易误会。学完立刻做 Practice：用 git 分支把 Library 重构成 class 版，这是官方明说「你应该习惯这样工作」的分支流程实战。",
      "understand": [
        "官方定性：JavaScript **没有**其他面向对象语言（Java/Ruby）那种意义上的类；ES6 引入的 class 关键字基本上是一套大体近似（mostly resembles）对象构造器与原型的新语法",
        "历史争议：ES6 发布时 class 语法就有争议，正因为它看起来像 Java 那类语言的类；它是语法糖，但也有一些区别于构造器与原型的独特属性；底层机制没有变（没有经典继承在发生）——坑人的地方在于语法对「实际发生了什么」不够显式",
        "现状：class 语法已存在于大量代码库；这里没有多少新机制要学，主要是熟悉概念的新语法",
        "基本语法：class 声明 + constructor 方法（配 new 调用、装实例数据）+ 类体里的方法（自动住在 prototype 上、所有实例共享——等价于手写 ClassName.prototype.method）",
        "与构造器的关键差别：class 必须带 new 调用（漏写直接 TypeError，不像函数构造器静默错行为——上一课的 new.target 防护是内置的）；class 体自动严格模式；类方法不可枚举（构造器 + prototype 手写时默认可枚举）",
        "getter / setter：用 get / set 关键字把「方法」伪装成「属性」访问——obj.prop 读走 getter、obj.prop = v 写走 setter；能在读写口上加校验或计算，外部语法仍是属性访问（javascript.info 阅读篇目，class 里同语法可用、不需要 Object.defineProperty）",
        "继承：class Player extends Person——官方括注点破本质：等于把 Person.prototype 加进原型链（上一课 setPrototypeOf 干的事）；子类 constructor 里必须先调 super(...) 才能用 this",
        "私有字段与方法：# 前缀（#reputation、#increment()）——类外面访问直接报错，是**语言级**的真私有；对标工厂函数的闭包私有变量，但由语法保证而非约定",
        "static 静态属性与方法：static 关键字声明，挂在**类本身**而不是实例上（Player.speciesCount 而非 player.speciesCount）；官方类比：someString.slice(0,5) 调在实例上，String.fromCharCode(79,100,105,110) 调在构造器本体上",
        "Practice 双要求：把 Library 项目重构成 class 版 + 用 Revisiting Rock Paper Scissors 课学过的 git 分支流程开新分支干活——官方原话「你应该习惯这样工作」"
      ],
      "terms": [
        {
          "en": "class",
          "zh": "ES6 的类语法：构造器 + 原型的语法糖包装——底层机制没变，写法更紧凑、更像其他 OOP 语言"
        },
        {
          "en": "Syntactic sugar",
          "zh": "语法糖：不新增能力、只让既有能力写起来更顺的语法——class 之于构造器 + prototype 正是如此（但带少量独特属性）"
        },
        {
          "en": "constructor (method)",
          "zh": "类里的 constructor 方法：new 的时候自动执行，负责装实例数据——对应构造器函数的函数体"
        },
        {
          "en": "getter / setter",
          "zh": "存取器：get / set 关键字定义的方法，外部像属性一样读写（obj.x / obj.x = 1），内部可以是任意逻辑"
        },
        {
          "en": "extends / super",
          "zh": "继承关键字：class A extends B 把 B.prototype 加进原型链；super(...) 在子类 constructor 里调用父类构造器（用 this 之前必须先调）"
        },
        {
          "en": "Private field (#)",
          "zh": "私有字段：# 前缀的属性与方法只能在类内部访问——语言级真私有，对标工厂函数的闭包私有变量"
        },
        {
          "en": "static",
          "zh": "静态成员：挂在类本身（而非实例）上的属性与方法——SomeClass.method() 调用，实例摸不到"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：把 class 的每个特性对回前两课的机制（prototype / setPrototypeOf / 闭包私有）",
        "读 javascript.info 的 Getters and setters（Assignment 第 1 条，有官方中文版）：官方提醒「accessor descriptors」一节没学过、不用担心；文章虽未展示 class，class 用同一套 get/set 语法（不需要 Object.defineProperty）",
        "读 javascript.info 的 Class 入门（Assignment 第 2 条，有官方中文版）：class 语法总览",
        "翻 MDN 的 Classes 文档（Assignment 第 3 条，有官方中文版）：官方口径——不要求现在就记住任何语法细节，随用随查；点名值得看一眼的三个特性页：extends（继承）、static（静态成员）、Private class fields（私有字段），三页均有中文版",
        "做 Practice：回到你的 Library 项目，把 plain 构造器重构成 class；**用 git 分支流程**（Revisiting Rock Paper Scissors 课学的：开新分支做新功能、完成后合并）——官方原话：你应该习惯这样工作",
        "自测：白纸写出「一个带 #私有字段、getter、static 方法与 extends 继承的类」骨架——写不出就回本站讲解重读对应节"
      ],
      "quiz": [
        {
          "question": "官方的「JavaScript does not have classes in the same sense as Java or Ruby」是什么意思？class 语法的底层到底是什么？",
          "answer": "JavaScript 的 class 不是经典 OOP 语言那种「类复制出实例」的机制——底层仍然是构造器函数 + 原型链（没有经典继承在发生）：class 方法住在 prototype 上、extends 是把父类 prototype 加进原型链。ES6 的 class 关键字基本上是一套大体近似构造器与原型的新语法（语法糖），只是语法对实际机制不够显式，容易让人按 Java 的直觉误会。"
        },
        {
          "question": "getter/setter 解决什么问题？和「普通方法 + 普通属性」相比好在哪？",
          "answer": "它让「带逻辑的读写」保持「属性访问」的外部语法：obj.fullName 读起来像属性，实际执行了你写的 get 函数（可以现算、可以校验）；obj.age = -5 这种写入可以走 setter 直接拒绝。相比裸属性：读写口上能设关卡；相比普通方法（getAge()）：调用方语法更自然，且日后从「存值」改成「现算」不破坏调用方代码。"
        },
        {
          "question": "class Player extends Person 按官方括注的本质是什么？子类 constructor 里为什么必须先调 super()？",
          "answer": "官方括注点破：extends 就是「把 Person.prototype 加进原型链」——等价于上一课的 Object.setPrototypeOf(Player.prototype, Person.prototype)，只是语法化了。子类 constructor 里 this 在 super() 调用之前不可用：父类构造逻辑负责初始化继承来的数据，先 super(...) 让父类把它的部分装好，this 才存在——顺序反了直接 ReferenceError。"
        },
        {
          "question": "# 私有字段与工厂函数的闭包私有变量，达成的是同一件事吗？保证强度有什么不同？",
          "answer": "目的相同：把状态藏起来、只留受控通道（官方原文就是拿工厂函数私有变量类比的）。保证强度不同：闭包私有靠「不返回就摸不到」的结构 + 下划线之类的君子约定辅助；# 字段是语言级私有——类外部访问 player.#reputation 直接语法报错，由语言保证而非约定。"
        },
        {
          "question": "static 成员与实例成员怎么区分调用？官方用了什么类比？",
          "answer": "static 声明的属性/方法挂在类本身：Player.someStatic() 这样调用，new 出来的实例上摸不到；实例成员则相反。官方类比字符串：someString.slice(0, 5) 调在字符串实例上，而 String.fromCharCode(79, 100, 105, 110) 调在 String 构造器本体上——同一个「类」，两种挂载位置。"
        }
      ],
      "optional": [],
      "note": "本课官方正文很短（只有 Introduction 三段），知识主体在 lesson overview 六考点与 Assignment 阅读里——本站正文按 overview 逐点展开以保证自足，语法细节事实以 MDN 与 javascript.info（均有官方中文版）为准。Assignment 里两条 TOP 自有课页链接（Library 项目页、Revisiting Rock Paper Scissors 课页）按既有口径不收入资料清单，Practice 要求已在任务里转述。官方 Practice 明文要求走 git 分支流程。",
      "why": "class 是当今 JavaScript 代码库的主流对象写法：React 的老代码、Angular 的全部、任何大型库的源码都绕不开它。更重要的是它的「翻译关系」：class 的每个特性你都能对回前两课的机制——方法上 prototype、extends 是 setPrototypeOf、#私有对标闭包私有、static 挂构造器本体。把 class 学成「构造器 + 原型的紧凑写法」而不是全新魔法，你就同时拥有了读现代代码与看穿底层的双重能力。这也是本章的收束点：构造器（底层机制）→ 工厂（闭包路线）→ class（语法糖集大成），三条路线殊途同归。",
      "sections": [
        {
          "h": "官方定性：不是 Java 那种类，是构造器的新语法",
          "p": [
            "官方第一句就把话说死：JavaScript **没有**其他面向对象语言（如 Java 或 Ruby）那种意义上的类。但 ES6 确实引入了一套用 `class` 关键字创建对象的语法——它基本上是一套**大体近似（原文 mostly resembles）**我们在构造器课学过的对象构造器与原型的新语法。",
            "历史背景（官方第二段）：正因为 class 看起来像 Java 那类语言的类，ES6 发布时这套语法**有过争议**。它是语法糖，但也有一些让自己区别于构造器与原型的**独特属性**；关键是——**底层机制没有变**（没有经典继承在发生），而语法对「对象身上实际在发生什么」不够显式，所以常把人绊倒。",
            "官方的现状判断（第三段）：时间过去很久了，class 语法已存在于大量代码库；这里**没有多少新机制要学**，主要只是给大部分熟悉的概念换一套新语法。这也是本课的正确打开方式：每见一个 class 特性，就把它翻译回构造器/原型/闭包的既有知识。"
          ]
        },
        {
          "h": "基本类语法：constructor 与方法",
          "p": [
            "一个最小的类（见示例 1）：`class Player { constructor(name, marker) { this.name = name; this.marker = marker; } getMarker() { ... } }`——class 声明包住整个蓝图；**constructor 方法**在 new 的时候自动执行，装实例数据（对应构造器函数的函数体）；类体里直接写的方法**自动住在 prototype 上**，所有实例共享——等价于手写 `Player.prototype.getMarker = function() {...}`，只是不再有「忘了上 prototype、把方法写进构造器」的失误空间。",
            "实例化仍是 `new Player(\"steve\", \"X\")`——new 一个都不能少，而且 class 漏写 new 会**直接抛 TypeError**（函数构造器是静默错误行为）：上一课手动加的 new.target 防护，class 是内置的。",
            "另外两个「独特属性」顺带记住：class 体自动运行在**严格模式**；类方法默认**不可枚举**（for...in 遍历实例时不会列出方法；手写 prototype 赋值时默认可枚举）。"
          ]
        },
        {
          "h": "getter 与 setter：像属性一样读写的方法",
          "p": [
            "get / set 关键字把方法伪装成属性（见示例 2）：`get summary() {...}` 让 `player.summary`（不带括号）读取时执行你的函数；`set level(value) {...}` 让 `player.level = 5` 写入时先过你的关卡（校验、拒绝、转换都行）。",
            "官方 Assignment 第 1 条的 javascript.info 文章（有中文版）专讲这个机制，并给了两个适配说明：文章虽还没展示 class，**class 里用同一套 get/set 语法**（不需要 Object.defineProperty）；「accessor descriptors」一节没学过、跳过不慌。",
            "价值一句话：对外保持属性访问的自然语法，对内保留函数的全部控制权——「读取时现算」「写入时校验」都不再需要调用方改写法。"
          ]
        },
        {
          "h": "继承：extends 与 super",
          "p": [
            "`class Player extends Person {...}`——官方在 Assignment 里的括注直接点破本质：**等于把 Person.prototype 加进原型链**，也就是上一课 Object.setPrototypeOf(Player.prototype, Person.prototype) 的语法化。",
            "子类 constructor 里用 this 之前**必须先调 super(...)**：父类构造逻辑负责初始化继承来的数据（比如 Person 的 name），super(name) 就是「先让父类把它那部分装好」——顺序反了直接 ReferenceError。",
            "子类可以加自己的方法与字段，也可以**覆写**父类方法（同名即覆盖；想在覆写版里复用父类逻辑，用 super.methodName(...)）。官方把 MDN 的 extends 页列为值得看一眼的特性页（有中文版）。"
          ]
        },
        {
          "h": "私有字段：# 前缀的语言级真私有",
          "p": [
            "`#reputation = 0;` 写在类体里（见示例 3）——# 前缀的字段与方法**只能在类内部访问**，类外面 `player.#reputation` 直接语法报错。",
            "官方在 Assignment 里的定位很精确：它让你拥有**类外不可访问**的属性或方法，**就像工厂函数里的私有变量一样**——目的一致（藏状态、留受控通道），保证强度升级：工厂的私有靠「不返回就摸不到」的结构，# 字段靠语言本身。",
            "上一课下划线约定（_prop 是君子协定、外面照样能碰）的「真私有」版本到此就位：getReputation() / giveReputation() 那套受控通道思路原样平移，只是私有本体从闭包变量换成了 # 字段。"
          ]
        },
        {
          "h": "static：挂在类本身的成员",
          "p": [
            "static 关键字声明的属性与方法**挂在类本身**、不在实例上：`Player.create(...)` 调在类上，new 出来的 player 摸不到它。",
            "官方的类比值得记住：字符串的一些方法调在**实例**上——`someString.slice(0, 5)`；另一些调在 **String 构造器本体**上——`String.fromCharCode(79, 100, 105, 110)`。static 成员就是「调在构造器本体上」的那一类。",
            "典型用途：工厂类方法（从别的格式造实例）、实例计数、与具体实例无关的常量与工具。MDN 的 static 页在官方点名清单里（有中文版）。"
          ]
        },
        {
          "h": "Practice：重构 Library + git 分支流程",
          "p": [
            "官方 Practice 双要求：**① 回到你的 Library 项目，把 plain 构造器重构成 class**——Book 构造器变成 class Book，info() 变成类方法，toggleRead 原型函数变成类体方法（顺手可以试试 # 私有字段与 get/set）。**② 用 git 分支流程干活**（Revisiting Rock Paper Scissors 课学的：开新分支做这个新功能，完成验证后合并）——官方原话：**你应该习惯这样工作！**",
            "重构的判断标准：外部行为一字不变（表单、渲染、删除、切换已读全部照旧），变的只是对象的出生方式。如果重构后行为变了，说明你对「class 是构造器的语法糖」的翻译关系还有没吃透的地方——回本站讲解对应节。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "// 基本类语法（本站示意，按官方课程结构编写）\nclass Player {\n  constructor(name, marker) {\n    this.name = name;       // 实例数据：constructor 配 new 自动执行\n    this.marker = marker;\n  }\n\n  getMarker() {             // 类体方法：自动住在 Player.prototype 上，实例共享\n    console.log(`My marker is \"${this.marker}\"`);\n  }\n}\n\nconst player1 = new Player(\"steve\", \"X\");   // new 不能少——漏写直接 TypeError\nplayer1.getMarker();                        // My marker is \"X\"\n\n// 对回构造器课：上面等价于\n// function Player(name, marker) { this.name = name; this.marker = marker; }\n// Player.prototype.getMarker = function () { ... };",
          "note": "本站示意代码：class 的每个部件都能翻译回前两课的机制——constructor 对应构造器函数体，类体方法对应 prototype 赋值。差别（也是升级）：漏写 new 不再静默出错而是直接抛 TypeError。"
        },
        {
          "lang": "javascript",
          "code": "// getter / setter（本站示意）\nclass Temperature {\n  constructor(celsius) {\n    this._celsius = celsius;\n  }\n\n  get fahrenheit() {              // 读：像属性一样访问（不带括号）\n    return this._celsius * 1.8 + 32;\n  }\n\n  set celsius(value) {            // 写：赋值先过关卡\n    if (typeof value !== \"number\" || Number.isNaN(value)) {\n      throw Error(\"温度必须是数字\");\n    }\n    this._celsius = value;\n  }\n  get celsius() {\n    return this._celsius;\n  }\n}\n\nconst t = new Temperature(25);\nconsole.log(t.fahrenheit);  // 77——读取时现算，调用方语法仍是属性\nt.celsius = 30;             // 走 setter：校验通过才落值\n// t.celsius = \"hot\";       // 走 setter：直接抛错，脏数据进不来",
          "note": "本站示意代码：get/set 把「带逻辑的读写」藏在「属性访问」的语法后面。javascript.info 的属性访问器一文（Assignment 第 1 条，有中文版）讲的就是这个机制——class 里同一套语法，不需要 Object.defineProperty。"
        },
        {
          "lang": "javascript",
          "code": "// extends + super + #私有 + static（本站示意，四特性同框）\nclass Person {\n  constructor(name) {\n    this.name = name;\n  }\n  sayName() {\n    console.log(`Hello, I'm ${this.name}!`);\n  }\n}\n\nclass Player extends Person {          // = 把 Person.prototype 加进原型链\n  static instanceCount = 0;            // static：挂在类本身，实例摸不到\n\n  #reputation = 0;                     // # 私有字段：类外访问直接语法报错\n\n  constructor(name, marker) {\n    super(name);                       // 用 this 之前必须先调 super\n    this.marker = marker;\n    Player.instanceCount += 1;\n  }\n\n  get reputation() { return this.#reputation; }   // 只读通道（对标工厂的 getReputation）\n  giveReputation() { this.#reputation++; }        // 受控写通道（对标 giveReputation）\n}\n\nconst p1 = new Player(\"steve\", \"X\");\np1.sayName();                 // Hello, I'm steve!  ← 沿原型链调到父类方法\np1.giveReputation();\nconsole.log(p1.reputation);   // 1（getter）\n// p1.#reputation             // SyntaxError：类外摸不到私有字段\n// p1.instanceCount           // undefined：static 成员不在实例上\nconsole.log(Player.instanceCount); // 1——调在类本身",
          "note": "本站示意代码：四个新特性各就各位——extends/super 是 setPrototypeOf 的语法化；#reputation 对标上一课工厂的闭包私有（语言级保证）；static instanceCount 调在类上（官方类比：String.fromCharCode 调在构造器本体）；get reputation 是受控读通道。"
        }
      ],
      "pitfalls": [
        {
          "title": "按 Java 直觉理解 class",
          "text": "官方开篇就是这句警告：JS 没有那种意义上的类——底层仍是构造器 + 原型，没有经典继承在发生。class 实例不是「类的副本」，方法查找仍沿原型链走；用 Java 心智模型推断边界行为（如「私有方法被子类继承后还能不能访问」这类）会翻车，以 MDN 实测为准。"
        },
        {
          "title": "子类 constructor 里先用 this 后调 super",
          "text": "extends 的子类 constructor 中，this 在 super(...) 之前不存在——先碰 this 直接 ReferenceError。固定肌肉记忆：子类 constructor 第一行 super(该传给父类的参数)，然后才是自己的装配。"
        },
        {
          "title": "从实例上找 static 成员",
          "text": "static 挂在类本身：Player.instanceCount 有值、new 出来的 p1.instanceCount 是 undefined。排查特征：「明明类里定义了却读不到」——先看调用位置是类名还是实例名。"
        },
        {
          "title": "把 #私有当成「加下划线的升级版」随意混用",
          "text": "#reputation 与 _reputation 是两种强度：前者语言级私有（类外访问语法报错），后者仍是公开属性 + 君子约定。同一个类里混用两套会让「到底能不能从外面碰」变得不可预测——选定一种口径用到底，新代码推荐 #。"
        },
        {
          "title": "重构 Library 时直接改 main 分支",
          "text": "官方 Practice 明文要求走 git 分支流程：开新分支重构、验证行为不变、再合并。直接在 main 上改，改到一半想回退就得靠 git 考古——这正是 Foundations 重做石头剪刀布那课练过的流程，官方原话「你应该习惯这样工作」。"
        }
      ],
      "official": {
        "assignment": [
          "读 javascript.info 的 Getters and setters（属性访问器）——「accessor descriptors」一节没学过、不用担心；文章虽然还没展示 class，class 可以用同一套语法使用 getter/setter（不需要 Object.defineProperty）。",
          "读 javascript.info 的 Class 入门——class 语法总览。",
          "MDN 的 Classes 文档照例是深入一点的好资源：语法特性很多，可以随时间慢慢探索；照例不要求你现在就从文档里记住任何东西。官方点名值得看一眼的特性页：Extending classes（继承——如 Player extends Person，把 Person.prototype 加进原型链）；Static properties and methods（静态属性与方法——在类本身上访问而非实例上，类似有些字符串方法调在字符串实例上 someString.slice(0,5)、有些调在 String 构造器上 String.fromCharCode(79,100,105,110)）；Private properties（私有属性——类外不可访问的属性或方法，类似工厂函数里的私有变量）。",
          "Practice：回到你的 Library 项目，把它重构成用 class 而不是 plain 构造器。别忘了用 Revisiting Rock Paper Scissors 学过的 git 分支流程来做这个新功能——官方原话：你应该习惯这样工作！"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/organizing_your_javascript_code/classes.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "b2520f8617b80af0430a2c4bc3c33c968c6d1bd0445b5fd091ff4054d062bc91",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "javascript-es6-modules",
      "title": "ES6 Modules",
      "zh": "ES6 模块",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/javascript-es6-modules",
      "summary": "把代码拆进多个文件来组织——这个愿望曾经只能靠 IIFE「模块模式」土法实现（多文件仍共享同一个全局作用域，顶层变量不安全）。ES6（又叫 ES2015）给了语言级的真模块（ESM）：每个文件默认私有作用域，export 决定露出什么、import 决定拿到什么、入口文件带 type=\"module\" 让浏览器沿依赖图自动加载。本课还讲清 default 与 named 两种导出导入的差别，以及 CommonJS（require）是什么、为什么浏览器不认识它。",
      "guide": "以下是官方原课的中文化梳理。这一课是「组织 JavaScript 代码」的架构升级点：前两课的模块模式解决「一个文件内怎么封装」，本课解决「多个文件之间怎么通信」。学习主线是官方铺的三段历史：先亲眼看到全局作用域问题（两个 script 标签共享全局、顶层变量裸奔），再看 IIFE 时代的选择性暴露（return 什么外面才有——这正是它被叫做「模块模式」的原因），最后 ESM 把这套控制变成语言原生：文件级私有作用域 + 显式 export/import + 入口与依赖图。三个必吃透的点：named 与 default 的语法差别与混用、type=\"module\" 自动 defer、以及那个高频误会——import/export 的花括号不是对象字面量也不是解构（官方专门放了警告块）。Assignment 只有 MDN 的 export/import 两篇文档，但官方点名里面有本课没讲的别名与命名空间导入，值得翻。",
      "understand": [
        "ES6（有时称 ES2015）给了 JavaScript 真正的「模块」，常被称为 ES6 modules 或 ESM——此前多文件组织只能靠模块模式（IIFE）",
        "全局作用域问题：HTML 里多个 <script> 按顺序载入**同一个全局作用域**——就像把所有文件内容按序写进一个文件；顶层变量对所有后续脚本可见，「我们的顶层变量不安全」",
        "IIFE 时代的解法：包进立即调用函数让变量住进函数作用域；想暴露给其他文件的东西 **return 出来**赋给全局变量——return 的才可见、没 return 的彻底不可访问。这就是 IIFE 被称为「模块模式」的原因",
        "ESM 的控制粒度：每个文件**默认有自己的私有作用域**；export 选择露出什么，import 选择拿进什么——导出了不等于自动可用，别的文件必须显式 import 才能用（「不 import 就用不了」）",
        "模块作用域不是全局作用域（官方提示块）：模块顶层变量在全局拿不到，文件之间只靠 import/export 通信",
        "named export 两种写法：声明前缀 export，或文件末尾 export { 名字清单 }；可以有任意多个。named import 必须用花括号写名字 + 提供文件路径",
        "路径只能是单引号或双引号字符串，**不能用模板字符串**（官方点名并挂 MDN 锚点）",
        "警告块（高频误会）：named import/export 的花括号是**专用语法**——既不是在导出一个含这些键的对象，也不是在导入时解构对象，与对象字面量/解构无关",
        "default export：一个文件**只能有一个**；导出的东西不带名字，导入方随便起名；inline 写法里 default 关键字**替换**变量声明（export default 表达式）；导入不用花括号",
        "default 与 named 可以同文件混用（import greeting, { farewell } from \"./one.js\"）；何时用哪个**没有普适公认规则**——单导出有人爱 default 有人爱单个 named，自己或团队喜欢哪种用哪种",
        "入口（entry point）：ESM 不再把每个 js 文件按序塞进 HTML，只链一个入口文件并加 type=\"module\"；浏览器看到它 import 谁就沿**依赖图**自动加载谁；type=\"module\" 自动 defer，不用再写 defer 属性",
        "安全限制：ES6 模块**不能**用 file:// 直接双击打开 HTML 加载——要用本地服务器（官方推荐 VS Code 的 Live Preview 扩展）",
        "CommonJS（CJS）：require / module.exports 语法的模块系统，为 Node.js 设计、**浏览器不认识**；Foundations 的 JS 练习里见过的就是它；Node 界 CJS 仍常用但 ESM 在涨；Full Stack JavaScript 路径的 Node.js 课程会细讲"
      ],
      "terms": [
        {
          "en": "ESM (ES6 modules)",
          "zh": "ES6 模块：语言级的模块系统——文件私有作用域 + import/export 显式通信（ES6 与 ES2015 是同一个版本标准的两个叫法）"
        },
        {
          "en": "Global scope problem",
          "zh": "全局作用域问题：多个 <script> 共享同一全局，顶层变量互相可见可覆盖——多文件组织的前 ESM 时代痛点"
        },
        {
          "en": "Named export / import",
          "zh": "具名导出/导入：export const x / export { x }，导入侧 import { x } from \"./file.js\"——名字必须对上，数量不限"
        },
        {
          "en": "Default export / import",
          "zh": "默认导出/导入：export default（每文件至多一个、不挂名字），导入侧不用花括号、名字随便起"
        },
        {
          "en": "Entry point",
          "zh": "入口文件：HTML 里唯一链的那个 module 脚本——浏览器从它出发沿依赖图加载其余文件"
        },
        {
          "en": "Dependency graph",
          "zh": "依赖图：「谁 import 谁」构成的关系图——importer 依赖 exporter；浏览器按图自动加载，无需人工排 script 顺序"
        },
        {
          "en": "type=\"module\"",
          "zh": "script 标签属性：把脚本按 ESM 加载——自动获得私有作用域与 import/export 能力，且自动 defer（延迟执行）"
        },
        {
          "en": "CommonJS (CJS)",
          "zh": "Node.js 的模块系统：require / module.exports 语法，浏览器不认识——与 ESM 是两套并行体系"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：按「全局作用域问题 → IIFE 模块模式 → ESM」的历史线吃，每一段都亲手跑一遍官方例子",
        "动手：把官方开头 one.js / two.js 的例子按三个阶段各跑一遍——裸全局版（能看到 greeting）、IIFE 全包版（报错 greeting is not defined）、IIFE return 版（又能看到）——体感「暴露是选择出来的」",
        "动手：把 IIFE 版改写成 ESM（export / import），HTML 只链入口 two.js 并加 type=\"module\"；用本地服务器打开（Live Preview 或本站 serve.py 思路），file:// 双击是不行的",
        "读 MDN 的 export 文档（Assignment 指定，有官方中文版）：注意本课没讲的别名（as）与重导出",
        "读 MDN 的 import 文档（Assignment 指定，有官方中文版）：注意命名空间导入（import * as）与官方点名的「路径不能用模板字符串」锚点"
      ],
      "quiz": [
        {
          "question": "两个 script 标签先后加载 one.js（定义 const greeting）与 two.js（console.log(greeting)），two.js 没定义 greeting 却能打印——为什么？把 two.js 的标签挪到前面会怎样？",
          "answer": "两个脚本按顺序载入**同一个全局作用域**，效果就像把两个文件的内容按序写进一个文件——two.js 自然看得到 one.js 的顶层变量。把 two.js 挪到前面，console.log 会在 greeting 定义之前执行，报 greeting is not defined。结论：多文件不等于多作用域，顶层变量全在裸奔——这就是 ESM 之前的全局作用域问题。"
        },
        {
          "question": "named export 与 default export 的三条关键差别是什么？",
          "answer": "① 数量：named 一个文件想导多少导多少，default 每文件只能有一个；② 名字：named 导入必须用花括号写**原名**（除非用 as 别名），default 导出不挂名字、导入方随便起名；③ 语法：named 导入带花括号，default 导入不带——import greeting, { farewell } from \"./one.js\" 里前者是 default、后者是 named，可同句混用。何时用哪个没有普适规则，自己/团队选定一种口径即可。"
        },
        {
          "question": "import { greeting } from \"./one.js\" 的花括号是在解构一个对象吗？官方为什么专门放警告块？",
          "answer": "不是。named import/export 的花括号是**专用语法**：导出侧不是在导出「一个含 greeting 键的对象」，导入侧也不是在解构对象——跟对象字面量与解构赋值没有任何关系。官方专门放警告块正因为这三者长得太像，按解构直觉推断（比如「那能不能改名字？」「能不能嵌套？」）全会错。"
        },
        {
          "question": "type=\"module\" 给了 script 标签哪三件事？为什么 ESM 页面只链一个入口文件就够？",
          "answer": "① 按 ES6 模块加载：文件获得私有作用域与 import/export 能力；② 自动 defer：不用再加 defer 属性，执行自动延到文档解析后；③ 触发依赖图加载：浏览器看到入口文件 import 谁就把谁加载进来（递归），所以只链入口一个文件即可，不用把每个 js 按序塞进 HTML。"
        },
        {
          "question": "为什么双击打开 HTML（file://）时 ESM 会加载失败？CommonJS 的 require 为什么在浏览器里不能用？",
          "answer": "浏览器安全限制：ES6 模块不能经 file:// 协议加载（模块要发请求取文件，file:// 的跨源限制会拦），必须走本地服务器（官方推荐 VS Code Live Preview 扩展）。CommonJS 是为 Node.js 设计的另一套模块系统（require / module.exports），浏览器根本不认识这套语法——两套体系别混用；Foundations 练习里见过的 require 就是 CJS，Node.js 课程会细讲。"
        }
      ],
      "optional": [],
      "note": "本课 slug（javascript-es6-modules）不带 node-path-javascript- 前缀，与同章多数课不同形——官方 curriculum 的 URL 事实，本站 id 原样沿用。官方提示块四处全部并入本站讲解：pre-ES6 例子里仍用 let/const 与箭头函数（不改变全局作用域与模块模式的主旨）、模块作用域不是全局作用域、named import/export 不是对象字面量与解构、file:// 加载不了 ESM 要用 Live Preview。官方正文的 one.js/two.js 例子代码全部收进示例区。",
      "why": "ESM 是现代前端工程的文件组织地基：下一课 Webpack 打包的是模块、再下一课 Restaurant Page 项目整个用模块搭、React/Vue 的 import 语法全是 ESM——从这一课起你写的每个项目都是多文件的。同样重要的是历史视角：本站自己的数据文件（lessons.js、bosses.js 这些）用的正是 IIFE 模块模式（window.ODIN_* 单出口）——学完本课你能同时读懂「老代码库的 IIFE」与「新代码库的 import/export」，两代组织方式在野外的占比都不小。",
      "sections": [
        {
          "h": "从「文件太长」的愿望到 ESM",
          "p": [
            "官方从你最近几个项目里可能冒出的念头讲起：「更复杂的项目怎么管？文件会变得太长！要是能把代码拆成多个文件来组织就好了！」——多文件正是为此而生。",
            "模块模式（上一课的 IIFE）曾在这个需求里扮演重要角色；而 ES6（有时称 ES2015）的发布给了 JavaScript **真正的「模块」**——所以它们常被叫做「ES6 modules」或 **ESM**。",
            "官方提示块先打了个预防针：虽然 let/const 与箭头函数是 ES6 才有的，本课的「pre-ES6 例子」里也照用不误——它们不改变全局作用域与模块模式的工作方式，那才是本节的主角。"
          ]
        },
        {
          "h": "ESM 之前：全局作用域问题",
          "p": [
            "官方例子：HTML 里两个 script 标签（defer）先后加载 one.js 与 two.js——one.js 只有一句 `const greeting = \"Hello, Odinite!\";`，two.js 只有一句 `console.log(greeting);`。打开页面，**two.js 从没定义过 greeting，控制台却打印出了 \"Hello, Odinite!\"**。",
            "原因：两个脚本被**一个接一个载入同一个全局作用域**——效果如同把两行按序写进同一个文件。把 two.js 的标签放到前面，就轮到报错 `greeting is not defined`（log 发生在定义之前）。",
            "官方结论一句话扎心：**就算用了多个 JavaScript 文件，它们仍共享同一个全局作用域——我们的顶层变量不安全！**"
          ]
        },
        {
          "h": "IIFE 时代的「模块模式」：return 决定暴露什么",
          "p": [
            "ESM 之前的解法是把代码包进 IIFE：`(() => { const greeting = \"Hello, Odinite!\"; })();`——照样立即运行，但变量住进函数作用域、不再进全局。two.js 再 log greeting 就报 not defined 了。",
            "可要是我们**只想暴露一部分**呢？官方第二步：把要露出的东西从 IIFE **return 出来**赋给全局变量——`const greeting = (() => { const greetingString = \"Hello, Odinite!\"; const farewellString = \"Bye bye, Odinite!\"; return greetingString; })();`。",
            "效果：全局变量 greeting 拿到了 \"Hello, Odinite!\"，two.js 打印成功；而 greetingString 与 farewellString 都是 IIFE 的局部变量——区别在于 greetingString 被**显式 return** 出来赋给了 greeting（因此外面可访问），farewellString 没被 return（因此在 two.js 里彻底不可访问）。",
            "官方点题：就这样，我们能**选择一个文件里的什么东西暴露给后面所有文件**——这正是 IIFE 常被叫做「**模块模式**」的原因：在「真模块」出现之前，它让我们跨多个文件写模块化代码。而现在有了 ESM，这个特定用途不再需要 IIFE 了。"
          ]
        },
        {
          "h": "ESM：文件级私有作用域 + 显式 export/import",
          "p": [
            "ESM 给了更多控制：**每个文件默认有自己的私有作用域**；不但能选择从文件里 **export** 什么，还能选择往别的文件 **import** 什么——导出某样东西**不等于**它在别处自动可用，只有在另一个文件里显式 import 了它才可用。官方原话收尾：**不 import 它？就用不了它。控制力拉满。**",
            "官方提示块补一刀：**模块作用域不是全局作用域**——用 ESM 时每个模块有自己的私有作用域，文件之间用 import/export 通信；模块的顶层变量在全局作用域里访问不到。（对照前两课：本站数据文件挂 window.ODIN_* 出口的做法，就是 IIFE 时代「return 给全局」思路的遗址。）"
          ]
        },
        {
          "h": "named 与 default：两种导出导入的语法与分工",
          "p": [
            "官方开场吐槽很诚实：以 JavaScript 的一贯风格，导入导出**不止一种而是两种**——default 与 named，做的事本质相同、细节略异，还能在同一文件里混搭。（先展示语法，跑起来还差「把脚本按模块链接」一步，后面讲。）",
            "**named export 两种写法**：在每个声明前缀 `export`（`export const greeting = ...; export const farewell = ...;`），或在文件里（通常在末尾）写 `export { greeting, farewell };`——两种都行，named export 想导多少导多少。**named import** 必须在花括号里点名要什么，并给出来源文件路径：`import { greeting, farewell } from \"./one.js\";`——只需要 greeting 就只写 greeting，各文件各取所需。路径有个官方点名的坑（挂了 MDN 锚点）：**不能用模板字符串**，只能单引号或双引号字符串。（第三方库导入时路径位置写库名即可——Webpack 那两课会见到。）",
            "**警告块（高频误会）**：named import/export 的花括号是**专用语法**，与对象字面量、解构赋值**没有任何关系**——`export { greeting, farewell }` 不是在导出一个含这两个键的对象，`import { ... }` 也不是在解构。",
            "**default export**：一个文件**只能默认导出一个**东西；这样导出的东西**不挂名字**，导入方自己决定叫什么——one.js 里叫 greeting，two.js 里 `import helloOdinite from \"./one.js\";` 完全合法。写法同样两种：inline 的 `export default \"Hello, Odinite!\";`（注意 inline 默认导出变量时 **default 关键字替换了变量声明**，导出的是表达式本身），或先声明再 `export default greeting;`（末尾无花括号）。**default import 不用花括号**（花括号是 named 的）。",
            "**混用**：同一文件可以 default 与 named 并存——`export default \"Hello, Odinite!\"; export const farewell = \"Bye bye, Odinite!\";`，导入侧一句话拿下：`import greeting, { farewell } from \"./one.js\";`（逗号前是 default、花括号里是 named）。**何时用哪个没有普适公认的规则**（官方原话），除了「named 可以多个、default 只能一个」这条硬差别：只导一样东西时有人偏好 default、有人偏好单个 named——都行，用你喜欢的，团队项目用团队喜欢的。"
          ]
        },
        {
          "h": "入口与依赖图：一个 script 标签管全部",
          "p": [
            "用 ESM 之后，HTML 不再按顺序挂每个 js 文件，只链**一个入口（entry point）**：`<script src=\"two.js\" type=\"module\"></script>`。",
            "为什么 two.js 是入口？因为例子里 two.js import 了 one.js 的变量——two.js **依赖** one.js，构成**依赖图**（官方画的 text 图：importer 依赖 exporter，two.js ← one.js）。浏览器把 two.js 当模块加载时，看到它依赖 one.js，就**把那个文件的代码也加载进来**。反过来用 one.js 当入口就坏事：它不依赖任何文件，浏览器加载完它就没事做了——two.js 的代码根本不会被用到，什么都不会打印。",
            "图可以再长：three.js 导出东西给 two.js import，入口仍是 two.js（依赖 one.js 与 three.js 两条边）；或者 one.js import three.js，two.js 经 one.js **间接**依赖 three.js——入口永远是「依赖链的最上游消费者」。",
            "官方补两个要点：只需要那**一个** script 标签（浏览器自动处理其余文件依赖）；也**不需要再写 defer**——type=\"module\" 自动延迟脚本执行。",
            "动手建议与安全限制：如果你跟着课首的 IIFE 例子写过代码，试着改写成 import/export 版、只把入口按 module 链上。**浏览器安全原因，ES6 模块不能在 file:// 直接打开的 HTML 里加载**——用本地服务器，官方推荐 VS Code 的 Live Preview 扩展（没用过的话正好装上）。"
          ]
        },
        {
          "h": "CommonJS：另一套你见过的模块系统",
          "p": [
            "路上你可能撞见过 **CommonJS（CJS）**：用 `require` 与 `module.exports` 而不是 import/export——Foundations 课程的 JavaScript 练习里就是它（官方感叹：你已经走了很远！）。",
            "定位说清楚：CJS 是**为 Node.js 设计**的模块系统，工作方式与 ESM 有点不同，**浏览器无法理解它**。Node 代码里 CJS 至今仍大量存在，不过近年 Node 里的 ESM 人气一直在涨。",
            "本课阶段的口径：我们专注写**跑在浏览器里**的代码，所以花时间的是 ESM；走 Full Stack JavaScript 路径的话，Node.js 课程会细讲 CJS。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "// ===== 全局作用域问题（官方原码）=====\n// HTML: <script src=\"one.js\" defer></script>\n//       <script src=\"two.js\" defer></script>\n\n// one.js\nconst greeting = \"Hello, Odinite!\";\n\n// two.js\nconsole.log(greeting); // \"Hello, Odinite!\"——two.js 从没定义过它！\n// 两个脚本载入同一个全局作用域，如同写在一个文件里\n\n// ===== IIFE 全包：变量进函数作用域（官方原码）=====\n// one.js\n(() => {\n  const greeting = \"Hello, Odinite!\";\n})();\n// two.js 的 console.log(greeting) → 报错：greeting is not defined\n\n// ===== IIFE + return：选择性暴露（官方原码）=====\n// one.js\nconst greeting = (() => {\n  const greetingString = \"Hello, Odinite!\";\n  const farewellString = \"Bye bye, Odinite!\";  // 没 return：外界彻底不可访问\n  return greetingString;                        // 显式 return 的才暴露\n})();\n// two.js 的 console.log(greeting) → \"Hello, Odinite!\"",
          "note": "官方三段递进原码：裸全局（顶层变量不安全）→ IIFE 全包（全私有）→ IIFE return（选择暴露）。「return 什么外面才有什么」就是模块模式的本质——ESM 的 export 是它的语言级正规化。"
        },
        {
          "lang": "javascript",
          "code": "// ===== named export/import（官方原码）=====\n// one.js —— 写法一：声明前缀 export\nexport const greeting = \"Hello, Odinite!\";\nexport const farewell = \"Bye bye, Odinite!\";\n\n// one.js —— 写法二（等价）：末尾集中导出\n// const greeting = \"Hello, Odinite!\";\n// const farewell = \"Bye bye, Odinite!\";\n// export { greeting, farewell };\n\n// two.js —— 花括号点名 + 路径（只能单/双引号字符串，不能模板字符串）\nimport { greeting, farewell } from \"./one.js\";\nconsole.log(greeting); // \"Hello, Odinite!\"\nconsole.log(farewell); // \"Bye bye, Odinite!\"\n// 只需要 greeting 的文件就只 import { greeting }——不 import 就用不了",
          "note": "官方 named 导出导入原码。警告块再念一遍：花括号是专用语法——不是导出「含这些键的对象」，也不是导入时解构；与对象字面量、解构赋值无关。"
        },
        {
          "lang": "javascript",
          "code": "// ===== default export/import（官方原码）=====\n// one.js —— inline 写法（default 替换变量声明，直接导出表达式）\nexport default \"Hello, Odinite!\";\n// one.js —— 或先声明再导出（末尾，无花括号）\n// const greeting = \"Hello, Odinite!\";\n// export default greeting;\n\n// two.js —— default import：无花括号、名字随便起\nimport helloOdinite from \"./one.js\";\nconsole.log(helloOdinite); // \"Hello, Odinite!\"\n\n// ===== 混用（官方原码）=====\n// one.js\nexport default \"Hello, Odinite!\";      // 每文件至多一个 default\nexport const farewell = \"Bye bye, Odinite!\";  // named 不限数量\n\n// two.js —— 逗号前 default、花括号里 named，一句拿下\nimport greeting, { farewell } from \"./one.js\";\nconsole.log(greeting); // \"Hello, Odinite!\"\nconsole.log(farewell); // \"Bye bye, Odinite!\"",
          "note": "官方 default 与混用原码。default 导出不挂名字，导入方起名自由（one.js 里的 greeting 在 two.js 里叫 helloOdinite 完全合法）；何时用 default 何时用 named 没有普适规则——自己/团队定口径用到底。"
        },
        {
          "lang": "text",
          "code": "<!-- ===== 入口与依赖图（官方原码）===== -->\n<script src=\"two.js\" type=\"module\"></script>\n<!-- 只链入口这一个文件；type=\"module\" 自动 defer -->\n\n依赖图（importer 依赖 exporter）：\n  two.js <-------------- one.js\n浏览器加载 two.js 时看到它 import one.js，就把 one.js 也加载进来。\n\n再加一个 three.js 给 two.js 供货：\n  two.js <-------------- one.js\n         └------- three.js\n\n或者 one.js 从 three.js 进货（two.js 间接依赖）：\n  two.js <-------------- one.js <-------------- three.js\n\n注意：入口若选 one.js（它不依赖任何文件），two.js 的代码\n永远不会被加载——什么都不会打印。\n安全限制：file:// 直接打开的 HTML 加载不了 ESM，必须本地服务器\n（官方推荐 VS Code Live Preview 扩展）。",
          "note": "官方入口与依赖图原样（text 图照录）。入口 = 依赖链最上游的消费者；script 顺序不再人工维护，浏览器按图加载。本站 index.html 的 defer 脚本清单还是「按序全挂」的老式组织（IIFE 时代产物），对照着看正好理解两代方案的差别。"
        }
      ],
      "pitfalls": [
        {
          "title": "把 import/export 的花括号当对象解构",
          "text": "官方专门放警告块的高频误会：named import/export 的花括号是专用语法，不是在导出对象、也不是在解构——按解构直觉推断行为（改名、嵌套、默认值）全错。改名要用 MDN 文档里的 as 别名语法。"
        },
        {
          "title": "import 路径用模板字符串",
          "text": "import { x } from `./${dir}/one.js` 是语法错误——官方点名并挂了 MDN 锚点：模块路径只能是单引号或双引号的静态字符串（浏览器要在执行前静态分析依赖图，路径必须编译期可确定）。"
        },
        {
          "title": "导出了就以为哪都能用",
          "text": "export 只是「允许被 import」，不是「自动全局可用」——哪个文件要用，哪个文件必须显式 import。排查特征：模块里明明 export 了，另一个文件直接用却 ReferenceError——忘了 import。"
        },
        {
          "title": "file:// 双击打开 ESM 页面",
          "text": "浏览器安全限制：ES6 模块经 file:// 加载直接失败（CORS 拦截），控制台报跨源错误。用本地服务器（Live Preview 扩展、python http.server、本站 serve.py 同理）——这不是你代码的 bug。"
        },
        {
          "title": "一个文件写两个 export default",
          "text": "default 每文件至多一个——第二个直接语法错误（Duplicate declaration）。需要导出多个东西就用 named，或把多个东西包成一个对象再 default（但那样导入侧又要解构，多数团队宁可用 named）。"
        },
        {
          "title": "在浏览器代码里写 require",
          "text": "require / module.exports 是 CommonJS（Node.js 的模块系统），浏览器不认识——Uncaught ReferenceError: require is not defined。浏览器侧一律 ESM；两套体系只在 Node 环境里才需要辨析（Node 课程细讲）。"
        }
      ],
      "official": {
        "assignment": [
          "照例，JavaScript 关键字与概念最权威的资料是 MDN：读 export 文档与 import 文档——里面有本课没讲到的小加餐，比如别名（as）与命名空间导入（import * as）。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/organizing_your_javascript_code/es6_modules.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "c57c988a4c69fbca1c1ee3a2c3c0987594db93577180dc16678f85ec4384d099",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-javascript-npm",
      "title": "npm",
      "zh": "npm",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-npm",
      "summary": "应用越做越大，不可能什么都自己写——第三方代码（从别人写好的辅助函数到整个框架）要靠包管理器来找和装，npm 就是那个包管理器：一个巨型仓库 + 一条命令行工具，包（packages）装到本地后 import 进自己的代码。npm 的世界围绕 package.json 转：项目的名字、依赖与版本号都记在里面，npm install 按清单装齐正确版本，仓库本身不必包含依赖的代码。",
      "guide": "以下是官方原课的中文化梳理。这一课短小但地位关键：它是下一课 Webpack 的直接前置（官方两次点名「下一课见真章」），也是你第一次正式认识 package.json——此后每个项目的根目录都会有它。要点三个：① npm 是什么——包管理器（巨型仓库 + 命令行安装工具），注意官方强调全小写、且它并不是「Node Package Manager」的缩写（官方专门挂了 npm 官网的说明链接）；② 为什么需要它——第三方代码从辅助函数到整个框架，依赖一多（更新、多文件下载负担）手工管理就会失控，这直接引出下一课的打包器；③ package.json——npm 的中心文件，官方拿 TOP 课程仓库自己的 package.json 当例子逐段讲：clone 仓库后 npm install 会读它、装齐 devDependencies 里的 markdownlint-cli2、然后 scripts 里的命令就能跑——仓库里根本不含那个包的代码。Assignment 四篇阅读里注意 peterxjang 那篇「给恐龙讲的现代 JavaScript」只读到 webpack 一节为止（下一课的内容别抢跑）。",
      "understand": [
        "npm 全小写（官方强调 no capitals!）：一个包管理器 = 插件、库与其他工具的巨型仓库 + 一条用来把它们（称为「包」，packages）装进应用的命令行工具；装完后包的代码在本地，可以 import 进自己的文件；你也可以把自己的代码发布到 npm",
        "你在 Foundations 装过 npm（为了装 Jest 测试框架做 JavaScript 练习）；冷知识：npm 并不是「Node Package Manager」的缩写（官方挂了 npm 官网说明），虽然人们常这么叫",
        "Ruby 路径的学习者已经认识 Yarn（另一个 JavaScript 包管理器）；本课程统一用 npm",
        "依赖管理之痛（下一课的引子）：应用越复杂文件越多（自己的 + 装的包的），管理这些依赖很麻烦——尤其包更新时；而且可能要发很多 JS 文件给浏览器下载。打包器（bundler）就是答案：写多文件（对我们友好），打包成更少更小的文件（对浏览器友好）",
        "package.json 是 npm 的中心：一个 JSON 文件，存项目的信息——名字、依赖及其版本号等；npm 读它来装齐正确版本的全部依赖、跑你设置的 npm script（script 后面课程才讲）",
        "TOP 课程仓库的例子：clone 后跑 npm install，npm 读 package.json、发现要装 devDependencies 里的 markdownlint-cli2（^0.12.1）、装完 scripts 里的 lint 与 fix 命令就能跑——仓库本身不含该包的代码，谁 clone 谁自己 install",
        "自己的项目里用 npm 装新包（或卸载）时，package.json 会被自动更新；下一课用 Webpack 做模块打包时就能看到实况",
        "「依赖」（dependencies）与「开发依赖」（development dependencies）的区分：只在开发过程用、用户侧应用不需要其代码的包（如 Jest 测试框架）叫开发依赖——Assignment 有专文"
      ],
      "terms": [
        {
          "en": "npm",
          "zh": "JavaScript 的包管理器：巨型包仓库 + 命令行安装工具；注意全小写，且并非「Node Package Manager」的缩写"
        },
        {
          "en": "Package manager",
          "zh": "包管理器：负责查找、安装、更新第三方代码包的工具生态——npm 是 JavaScript 世界的主流选择（Yarn 是另一个）"
        },
        {
          "en": "Package",
          "zh": "包：发布到仓库里的第三方代码单元——从一个小工具函数库到一整个框架都算"
        },
        {
          "en": "package.json",
          "zh": "项目的清单文件（JSON）：名字、描述、依赖与版本号、npm scripts——npm 围绕它工作"
        },
        {
          "en": "Dependency",
          "zh": "依赖：项目装了的包；只用于开发过程、用户侧不需要的叫 development dependency（开发依赖，如测试框架）"
        },
        {
          "en": "npm install",
          "zh": "按 package.json 清单把全部依赖装齐的命令——clone 别人仓库后的第一个动作"
        },
        {
          "en": "Bundler",
          "zh": "打包器：把多文件代码打包成更少更小文件发给浏览器的工具——下一课 Webpack 的主题（本课只预告）"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：三个要点——npm 是什么、依赖之痛、package.json 怎么运转",
        "读 npm 官方文档 Installing packages with npm（Assignment 第 1.1 条）：本地安装包的实操",
        "读 npm 官方文档 the package.json file（Assignment 第 1.2 条）：这个文件存了应用的哪些信息",
        "读 dev.to 的 Demystifying devDependencies and dependencies（Assignment 第 1.3 条）：依赖与开发依赖的区别（Jest 这类只在开发时用的算后者）",
        "读 peterxjang 的 Modern JavaScript explained for dinosaurs（Assignment 第 2 条）：JavaScript 跨多文件管理包的历史课——**只读到「Using a JavaScript module bundler (webpack)」之前**，打包器与 webpack 是下一课的内容",
        "动手感受：打开 TOP 官方 curriculum 仓库的 package.json 对照官方正文的逐段讲解；如果你本机装过 Node（Foundations 装过），在任意测试目录跑一次 npm init -y + npm install 看看 package.json 被自动更新的样子"
      ],
      "quiz": [
        {
          "question": "npm 到底是什么？「装包」之后包的代码在哪里、怎么用？",
          "answer": "npm 是一个包管理器：既是插件、库与工具的巨型仓库，也是一条把「包」安装进应用的命令行工具。安装后包的代码就在你项目本地（node_modules 目录），可以 import 进自己的文件使用；反过来你也可以把自己的代码发布到 npm。注意官方强调：npm 全小写，且它并不是 Node Package Manager 的缩写。"
        },
        {
          "question": "package.json 里存了什么？npm install 做了什么？",
          "answer": "package.json 是项目的 JSON 清单：名字、描述、依赖及其版本号、npm scripts 等。npm install 读这个文件，把列出的全部依赖按正确版本装齐——所以仓库本身不需要包含依赖的代码（TOP curriculum 仓库就是例子：clone 后 install，npm 按 devDependencies 装好 markdownlint-cli2，scripts 里的 lint/fix 命令随即能跑）。自己项目里装/卸包时 npm 会自动更新 package.json。"
        },
        {
          "question": "dependencies 与 devDependencies 的区别是什么？各举一例。",
          "answer": "装的包统称依赖（dependencies）；其中只在开发过程用、用户侧应用运行不需要其代码的，归为开发依赖（devDependencies）——典型如 Jest 测试框架、TOP 仓库的 markdownlint-cli2（代码风格检查）。用户运行应用真正需要的代码（如下一课的 Webpack 产物所依赖的库）才是普通依赖。"
        },
        {
          "question": "官方说依赖变多会带来两个麻烦，分别是什么？下一个工具是什么？",
          "answer": "① 管理麻烦：文件越来越多（自己的 + 包的），包还会更新——手工追踪版本与关系很痛苦，package.json 就是解药；② 下载负担：可能要把很多 JS 文件发给浏览器下载——解药是下一课的打包器（bundler）：我们照旧写多文件（对开发者友好），打包器把它们捆成更少更小的文件发给浏览器（对网络友好）。"
        }
      ],
      "optional": [],
      "note": "本课官方正文含 TOP curriculum 仓库 package.json 的完整示例（已收进示例区）。Assignment 里的 npm 官网「npm 不是 Node Package Manager 缩写」链接是 npmjs.com 的 npm 包页锚点，已登记进本课资料。Ruby 路径提到的 Yarn 一课带过：本课程统一用 npm。npm scripts 官方明说后面课程才讲，本课不展开。",
      "why": "package.json 是每个现代 JavaScript 项目的身份证：下一课 Webpack 会真实地往里写依赖、Restaurant Page 项目从 npm init 开始搭、Node.js 课程与 React 课程全程用它——从这一课起你的项目根目录永远有这个文件。dependency 与 devDependency 的区分更是工程素养的第一课：装错位置轻则产物臃肿、重则线上缺包。这一课概念不多，但它是「手写单文件」到「工程化多文件」的分水岭。",
      "sections": [
        {
          "h": "为什么需要包管理器",
          "p": [
            "上一课学了 ES6 模块与文件间 import/export。官方接着把问题推进一步：应用越来越大、越来越复杂时，我们未必想**什么都自己写**——可能想引入第三方代码来接管一些事：小至别人写好的辅助函数，大至「在其上构建整个应用」的框架。",
            "要轻松地**找到**并**引入**这些第三方包，就需要包管理器的帮助——npm 正是那个包管理器。"
          ]
        },
        {
          "h": "npm 是什么：仓库 + 命令行工具",
          "p": [
            "官方定义（注意强调**全小写**，no capitals!）：**npm** 是一个包管理器——一个插件、库与其他工具的**巨型仓库**，同时提供一条**命令行工具**，用来把这些工具（我们称之为「**包**」，packages）安装进应用。",
            "装完之后，所有已安装包的代码都在**本地**，可以 import 进我们自己的文件。反过来，我们甚至可以把自己的代码**发布**到 npm。",
            "两条背景：① 你可能记得 Foundations 课程装过 npm——为了装 Jest 测试框架做 JavaScript 练习；② 冷知识（官方挂了 npm 官网链接）：**npm 并不是「Node Package Manager」的缩写**，虽然人们经常这么叫它。另外 Ruby 路径的学习者已经认识 Yarn（另一个 JavaScript 包管理器）——本课程统一用 npm。"
          ]
        },
        {
          "h": "依赖之痛：下一课打包器的引子",
          "p": [
            "官方把痛点摆出来：应用越复杂、需要的文件越多（自己的文件 + 装的包的文件），**管理这么多依赖**会变得相当麻烦——包更新时尤其如此。",
            "还有一层更要命的：我们可能要**发很多 JavaScript 文件给浏览器下载**。下一课的主角打包器（bundlers）就是为此而生：让我们照旧写「对我们友好的多文件」，然后把它们**打包成更少、更小的文件**，最终发给浏览器的是打包产物。本课先把 npm 与 package.json 的地基打好。"
          ]
        },
        {
          "h": "package.json：npm 的中心文件",
          "p": [
            "npm 的一切围绕一个叫 `package.json` 的文件转：一个 JSON 文件，存着项目的信息——名字、依赖及其版本号等。npm 能读这个文件来做事：**按正确版本安装列出的全部依赖**；**运行你设置为 npm script 的命令**（script 官方明说后面课程才讲）。",
            "官方拿 **TOP 课程仓库自己**（就存放着你正在读的这篇课文）的 package.json 当例子（见示例区）：name 是 curriculum、version 1.0.0、description 是 TOP 的自我介绍、scripts 里有 lint 与 fix 两条（都跑 markdownlint-cli2）、license 是 CC BY-NC-SA 4.0、devDependencies 里列着 markdownlint-cli2 ^0.12.1。",
            "官方说这里有很多东西**现在还不需要全懂**，要点是流程：clone 这个仓库、跑 `npm install`——npm 读 package.json，看到要装 markdownlint-cli2；装好后，用到这个包的两条 scripts 就都能跑了。**仓库本身并不包含 markdownlint-cli2 的代码**——谁 clone 谁跑 install，npm 替你把代码抓来。",
            "落到自己的项目：用 npm 装新包（或卸载）时，它会**自动更新 package.json**。官方预告：下一课引入 Webpack 做模块打包时，就能看到这个过程的实况。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "json",
          "code": "{\n  \"name\": \"curriculum\",\n  \"version\": \"1.0.0\",\n  \"description\": \"[The Odin Project](https://www.theodinproject.com/) (TOP) is an open-source curriculum for learning full-stack web development. ...\",\n  \"scripts\": {\n    \"lint\": \"markdownlint-cli2\",\n    \"fix\": \"markdownlint-cli2 --fix\"\n  },\n  \"license\": \"CC BY-NC-SA 4.0\",\n  \"devDependencies\": {\n    \"markdownlint-cli2\": \"^0.12.1\"\n  }\n}",
          "note": "官方正文原样引用的 TOP curriculum 仓库 package.json（description 节选）。逐段对照：name/version 是项目身份；scripts 是 npm 命令（npm run lint 就跑 markdownlint-cli2）；devDependencies 是开发依赖清单（^0.12.1 是版本范围写法）。clone 仓库后 npm install 就是照这份清单抓代码——仓库里并不含 markdownlint-cli2 本体。"
        }
      ],
      "pitfalls": [
        {
          "title": "把包代码提交进仓库 / 或 clone 后忘跑 npm install",
          "text": "官方例子的要点反着用：仓库只带 package.json 清单、不带依赖代码——依赖由每个环境自己 npm install 抓齐。clone 别人项目跑不起来，第一反应就是「install 了没」；反过来把 node_modules 提交进 git 会让仓库爆炸（它的忽略规则也是工程惯例，Git 课讲过的 .gitignore 用在这里）。"
        },
        {
          "title": "把开发工具装成普通依赖",
          "text": "Jest、linter 这类只在开发过程用的包应归 devDependencies（npm install --save-dev 或 -D）——用户侧应用不需要它们的代码。装错位置不会立刻报错，但会让「哪些代码真正上线」的边界变模糊，Assignment 第 1.3 条那篇 dev.to 文章讲的就是这个区分。"
        },
        {
          "title": "把 npm 当成「Node Package Manager」理解",
          "text": "官方专门挂链接辟谣：npm 不是那个缩写（npm 官网的官方说法）。实际影响是心智模型：npm 服务于整个 JavaScript 生态（浏览器代码的构建工具链同样靠它装），不是 Node 专属——本课装的 Webpack 就是给浏览器项目用的。"
        },
        {
          "title": "抢跑读恐龙文的 webpack 章节",
          "text": "官方对 peterxjang 那篇历史课给了明确阅读边界：只读到「Using a JavaScript module bundler (webpack)」之前——打包器与 webpack 是下一课的正课内容，先读会把下一课的铺垫打乱（那篇文章的 bundler 部分与官方课程口径细节不完全一致）。"
        }
      ],
      "official": {
        "assignment": [
          "多了解一点 npm、包与依赖：① 读 npm 官方文档 Installing packages with npm（本地安装包）；② 读 npm 官方文档 the package.json file——存着我们应用大量信息的那个文件；③ 我们装的包叫「依赖」（dependencies），但只在开发过程使用、用户侧应用不需要其代码的包（如 Jest 测试框架）叫「开发依赖」（development dependencies）——读 dev.to 的 Demystifying devDependencies and dependencies。",
          "一篇很好的小历史课：Modern JavaScript explained for dinosaurs（JavaScript 跨多文件管理包的演进）。**只读到「Using a JavaScript module bundler (webpack)」为止**——打包器与 webpack 下一课讲。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/organizing_your_javascript_code/npm.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "e7b2a4daff46ba1537a8c49d23d3c543917cb09413e71d579463cd7e023782ae",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "javascript-webpack",
      "title": "Webpack",
      "zh": "Webpack",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/javascript-webpack",
      "summary": "最流行的 JavaScript 打包器上手课：入口与依赖图的概念从 ESM 直接沿用——给 Webpack 一个入口文件，它建图、合并所有相关文件、输出单个 bundle。本课从零配置四件套：打包 JS（webpack.config.js 的 mode/entry/output）、处理 HTML（HtmlWebpackPlugin 自动注入 script）、加载 CSS（style-loader + css-loader，顺序必须 loader 数组末尾先跑）、加载图片（三种场景三种处置），最后装 webpack-dev-server 告别「每改一次跑一次 npx webpack」——附带 source map 让报错指回源文件。",
      "guide": "以下是官方原课的中文化梳理。这是全章动手密度最高的一课：官方带你在终端里从零搭一个 webpack-practice 项目，每一步都有可验证的产出（dist/main.js 能用 node 跑出 Hello、dist/index.html 打开是紫色背景）。跟做时抓住一条主线就不乱：**Webpack 只天生认识 JavaScript，其他一切文件（HTML/CSS/图片）都要靠 loader 或 plugin 教它认**——HtmlWebpackPlugin 教它产 HTML、css-loader + style-loader 教它吃 CSS、html-loader 与 asset/resource 规则教它处理图片。三个官方警告块都是高频翻车点：模板 HTML 里不要自己写 script 标签（会双重注入）、CSS loader 顺序不能反（数组从末尾开始执行）、改了 webpack 配置必须重启 dev server。Assignment 两篇都是 webpack.js.org 官方文档：concepts 页建立术语地图，Asset Management 指南补全资产处理的完整图景。开始之前确认 Node.js 是最新 LTS 版本（官方点名，必要时用 NVM 按 Foundations 装 Node 那课操作）。",
      "understand": [
        "打包器的动机：ESM 缓解了多文件与依赖管理，但**逐个下载大量模块文件会拖累性能**（第三方文件越多越明显）；打包器把多文件合成少数小文件发给浏览器",
        "官方对打包器的定位：新构建工具已经帮我们处理了大量基础配置，但真实世界不总用得上新工具——理解打包器在做什么，用「全自动工具」时才知道它替你干了什么，遇到需要手动配置的场景才不慌",
        "打包概念与 ESM 一脉相承：给打包器一个**入口**，它从入口建**依赖图**，合并所有相关文件，**输出单个文件**；顺带还能做 minify（压缩）、图片优化、tree shaking——多数超出本课范围，本课专注 JS 打包与 HTML/CSS/图片处理",
        "起步命令：mkdir webpack-practice && cd 进去 && npm init -y --init-type=module（建 package.json 并声明 ESM 类型）；npm install --save-dev webpack webpack-cli（-D 同义：装成开发依赖——Webpack 只在开发期用，它自己的代码不会进浏览器运行的代码）",
        "安装后 npm 自动创建 node_modules（Webpack 实际代码与一堆其他东西住这里）与 package-lock.json（npm 用来追踪更具体的包信息）；npm audit 报的漏洞在课程场景可忽略（官方提示块：极可能是非常具体的边角问题；生产应用才需要逐条审查）",
        "src 与 dist 两个约定目录：src（source）放全部源代码、干活的地方；dist（distribution）放打包产物。口诀（官方原话）：**在 src 里干活，构建进 dist，从那里部署**——fork/clone 项目的人不需要 dist（自己构建即可），部署网站只需要 dist",
        "webpack.config.js 最小四件套：mode: \"development\"（开发模式，生产模式后面课程再讲）；entry: \"./src/index.js\"（入口）；output.filename: \"main.js\"（产物名随意起）；output.path: path.resolve(import.meta.dirname, \"dist\")（Webpack 推荐的输出目录写法，目录不存在会自动建）；output.clean: true（每次打包先清空输出目录，dist 只含最近一次产物）",
        "跑 npx webpack → dist/main.js 生成；里面「一大堆东西」多是开发工具代码；node dist/main.js 能打印 Hello, Odinite! 即验证成功",
        "Webpack 特性（官方提示块）：import 路径的 .js 扩展名可省（Webpack 默认自动补查）——**这是 Webpack 的特性、不是 ESM 的**；本课示例一律带扩展名保持显式",
        "HTML 用 HtmlWebpackPlugin（也是 dev 依赖）：src/template.html 写常规骨架，**不要放 script 标签**——插件自动把产物 bundle 注入成 deferred script，自己再写就双重注入了；配置里 plugins 数组 new HtmlWebpackPlugin({ template: \"./src/template.html\" })；打包后 dist 里有 main.js 与 index.html 两个文件（没法合成一个）",
        "CSS 要装**两个** loader：css-loader 读取 JS 里 import 的 CSS 文件、把结果存成字符串；style-loader 拿字符串生成「把样式应用到页面」的 JS 代码——两个缺一不可；配置住 module.rules（loader 不是 plugin，分区住）：test: /\\.css$/i 匹配 .css 结尾的导入，use: [\"style-loader\", \"css-loader\"]",
        "**loader 顺序警告（官方警告块）**：Webpack 从数组**末尾**开始跑 loader——css-loader 必须放末尾（先读成字符串），style-loader 在前（再注入）；顺序反了不工作",
        "CSS 的引入方式是在 JS 里 import \"./styles.css\"（副作用导入：不需要它导出任何东西，loader 会处理一切）；模板 HTML 里**不再写 link 标签**——真实项目模块多，按模块拆小 CSS 文件、在需要处 import 更好维护（甚至有作用域化到模块的手段）",
        "本地图片三种场景三种处置：① CSS 里 url() 的图——css-loader 已经处理，零配置；② HTML 模板里 <img src> 的图——装 html-loader + rules 加 test: /\\.html$/i 规则（否则 src 只是段文本，构建进 dist 后指向失效）；③ JS 里用的图——rules 加 test: /\\.(png|svg|jpg|jpeg|gif)$/i + type: \"asset/resource\"（无需装包），JS 里 **default import** 图片文件、把导入值赋给 image.src",
        "JS 里图片必须 import 的原因：直接写 image.src = \"./odin.png\" 只是普通字符串——Webpack 不会魔法般识别字符串引用了文件、不会把它打进 bundle；import + asset/resource 规则则让 Webpack 认出导入、把图片文件包含进构建、并保证变量最终是正确路径",
        "dist 里图片文件名变成乱码是**预期行为**：Webpack 默认按内容哈希重命名打包的图片（与浏览器缓存及文件名匹配问题有关）——官方明说不需要懂原理、不需要会改，知道这是正常的就行",
        "官方 tip 块：只配置你需要的——HTML 模板没有本地图就不需要 html-loader，JS 不用本地图就不需要 asset/resource 规则；将来遇到字体、预处理器等需要特殊 loader/plugin 的东西，到时查 Webpack 文档即可",
        "webpack-dev-server（dev 依赖）：受够了每改一次跑一次 npx webpack 就用它——原理是**幕后打包**（如同跑了 npx webpack 但不落盘到 dist），每次保存 bundle 用到的文件就重打；npx webpack serve 启动，默认 http://localhost:8080/",
        "devtool: \"eval-source-map\"（source map）：没有它，报错信息不会对上开发代码的文件与行号，DevTools Sources 面板也找不到原始代码、Chrome 调试器难用——加上两个问题都解决",
        "devServer.watchFiles: [\"./src/template.html\"]：dev server 默认只在**被 import 进 JS bundle 的文件**变化时自动重启——HTML 模板会被忽略，要手动加进 watch 数组",
        "官方提示块：dev server **只在启动时读一次 webpack 配置**——运行中改配置文件不会生效，Ctrl+C 杀掉再 npx webpack serve",
        "官方收束：从「几个裸文件」到「loader、plugin、配置文件」看似变复杂了，但真实应用需要这些工具改善开发体验并优化生产；后面课程会用把底层机制抽象掉的工具——**对其机制有总体理解的人，遇到真要手动配置的局面才不被动**；再后面的课（Revisiting Webpack）会介绍让配置更快更直接的补充手段，现在先手工练"
      ],
      "terms": [
        {
          "en": "Bundler",
          "zh": "打包器：从入口建依赖图、把多文件合并成少数小文件输出的工具——Webpack 是最流行的 JavaScript 打包器（之一，且长期如此）"
        },
        {
          "en": "Minification",
          "zh": "代码压缩：删掉空格/注释/缩短名字让文件更小——打包器顺带能做的优化之一（本课不展开）"
        },
        {
          "en": "Tree shaking",
          "zh": "摇树优化：把代码里没用到的导出「摇掉」不进产物——打包器的高级能力（本课不展开，MDN 术语页已挂）"
        },
        {
          "en": "src / dist",
          "zh": "源目录 / 分发目录：src 放源代码（干活的地方），dist 放打包产物（部署的东西）——名字是约定，技术上可自定"
        },
        {
          "en": "webpack.config.js",
          "zh": "Webpack 配置文件：default export 一个配置对象——mode / entry / output / plugins / module.rules / devtool / devServer 都写在这里"
        },
        {
          "en": "Loader",
          "zh": "加载器：教 Webpack 处理非 JS 文件的转换器（css-loader / style-loader / html-loader）——住 module.rules，按 test 正则匹配、use 数组从末尾开始执行"
        },
        {
          "en": "Plugin",
          "zh": "插件：给打包过程加整个环节的工具（HtmlWebpackPlugin 生成 HTML 并注入 script）——住 plugins 数组，与 loader 是两个分区"
        },
        {
          "en": "asset/resource",
          "zh": "Webpack 内置的资产规则类型：把图片等文件作为独立资源输出并给 JS 提供正确路径——无需装包，rules 里 type 字段声明"
        },
        {
          "en": "Source map (devtool)",
          "zh": "源码映射：把打包产物的报错位置映射回开发源文件与行号的机制——devtool: \"eval-source-map\" 一行开启"
        },
        {
          "en": "webpack-dev-server",
          "zh": "开发服务器：幕后打包不落盘、保存即重打、默认 localhost:8080 提供页面——npx webpack serve 启动"
        },
        {
          "en": "npm init -y --init-type=module",
          "zh": "建 package.json 的一步到位命令：-y 全部默认，--init-type=module 声明项目用 ESM"
        }
      ],
      "tasks": [
        "先决条件：确认 Node.js 是最新 LTS 版本（官方点名；需要时按 Foundations「安装 Node.js」课用 NVM 装）",
        "跟做官方全流程：mkdir webpack-practice → npm init -y --init-type=module → 装 webpack webpack-cli（--save-dev）→ src/index.js + src/greeting.js 两文件 → 写最小 webpack.config.js → npx webpack → node dist/main.js 看到 Hello, Odinite!",
        "接 HTML：装 html-webpack-plugin，src/template.html 写骨架（**不放 script 标签**），配置 plugins，重跑后打开 dist/index.html 看控制台",
        "接 CSS：装 style-loader css-loader，配置 module.rules（css-loader 在数组末尾），src/styles.css 设 rebeccapurple 背景，index.js 副作用导入，重跑后 dist/index.html 应是紫屏",
        "接图片三场景：按需装 html-loader（HTML 模板有本地图才装）、rules 加 asset/resource（JS 用图才加）；JS 里 default import 图片并赋给 image.src 验证",
        "装 webpack-dev-server：配置加 devtool: \"eval-source-map\" 与 devServer.watchFiles: [\"./src/template.html\"]，npx webpack serve 后开 localhost:8080，改代码保存看自动重打；再改一次 webpack.config.js 验证「必须重启 dev server」的提示块",
        "读 Webpack 官方 concepts 页（Assignment 第 1 条）：把 entry / output / loaders / plugins 等主术语对上本课实操",
        "读 Webpack 官方 Asset Management 指南（Assignment 第 2 条）：CSS、图片、字体的更多处理例子——注意它例子里的 npm run build 等价于本课的 npx webpack（npm scripts 后面课程讲）"
      ],
      "quiz": [
        {
          "question": "打包器解决什么问题？「入口」与「依赖图」在打包语境里分别指什么？",
          "answer": "ESM 让多文件管理变好了，但浏览器逐个下载大量模块文件会拖累性能（第三方文件越多越明显）——打包器把多文件合成少数小文件。概念从 ESM 沿用：我们给打包器一个入口文件（entry），它从入口出发构建依赖图（谁 import 谁），把所有相关文件合并，输出包含全部必要代码的单个文件。"
        },
        {
          "question": "src 与 dist 各放什么？为什么 clone 项目的人不需要 dist、部署却只需要 dist？",
          "answer": "src（source）放全部源代码——所有开发工作发生地；dist（distribution）放 Webpack 的打包产物。clone/fork 的人不需要 dist：拿 src 自己跑一次 Webpack 就能构建出自己的 dist（产物是可再生的衍生物）；部署只需要 dist：那是浏览器真正要加载的最终文件。口诀：在 src 干活、构建进 dist、从 dist 部署。"
        },
        {
          "question": "为什么 webpack.config.js 的 CSS 规则里 use 数组是 [\"style-loader\", \"css-loader\"] 而不能反过来？",
          "answer": "Webpack 从数组**末尾**开始跑 loader：css-loader 在末尾先执行——读取 import 的 CSS 文件、把结果存成字符串；然后 style-loader 接手——把字符串变成「将样式应用到页面」的 JS 代码注入。反过来（style-loader 先跑）它拿到的是文件而不是字符串，整条链不工作。官方专门放了警告块：必须这个顺序。"
        },
        {
          "question": "template.html 里为什么不能自己写 script 标签？JS 里用本地图片为什么必须 import 而不能直接写字符串路径？",
          "answer": "HtmlWebpackPlugin 会自动把输出 bundle 注入成 deferred script 标签——模板里自己再写一个就双重加载了。图片同理是「Webpack 只认 import 不认字符串」：image.src = \"./odin.png\" 只是普通字符串，Webpack 不会识别它引用了文件、不会把图片打进 dist；用 import odinImage from \"./odin.png\" 配合 asset/resource 规则，Webpack 才认出导入、包含图片文件、并让变量在打包后含正确路径。"
        },
        {
          "question": "devtool: \"eval-source-map\" 解决什么问题？devServer.watchFiles 为什么必须加 HTML 模板？",
          "answer": "source map 解决「产物与源码对不上」：没有它，报错信息的文件与行号指向打包后的大杂烩而不是你的开发代码，DevTools Sources 面板里也找不到原始源码、Chrome 调试器难用。watchFiles 是因为 webpack-dev-server 默认只监视被 import 进 JS bundle 的文件——template.html 不在 JS 依赖图里，改了它 dev server 不会重打，必须手动加进监视数组。"
        }
      ],
      "optional": [],
      "note": "本课 slug（javascript-webpack）不带 node-path-javascript- 前缀，官方 curriculum 的 URL 事实、id 原样沿用。官方提示块五个（npm audit 漏洞可忽略、import 扩展名可省是 Webpack 特性、只配置你需要的、dev server 改配置要重启、Node LTS 前置）全部并入本站讲解；警告块一个（CSS loader 顺序）单列。MDN 副作用导入链接与上一课 import 文档同页不同锚点，按跨课合并纪律登记在首现课（ES6 模块）；TOP 自有的 Installing Node.js 课页链接按既有口径剔除；localhost:8080 非外部资源。官方正文的全部命令与配置文件已收进示例区。",
      "why": "Webpack 是「工程化前端」的成人礼：下一个项目 Restaurant Page 从 npm init 到部署全程用它，Todo List、Battleship 一路跟到底；更重要的是官方点破的职业现实——新一代工具（Vite 等）把配置抽象掉了，但真实世界的存量代码库大量使用需要手动配置的构建链，「用着全自动工具却完全不知道它干了什么」的人，遇到需要手动介入的那天会格外痛苦。这一课的手工练习就是那天的保险。配置四件套（entry/output/loaders/plugins）的术语地图建好后，任何构建工具的文档你都能快速对号入座。",
      "sections": [
        {
          "h": "为什么需要打包器",
          "p": [
            "上一课学了 ESM 与 npm：ESM 大幅缓解了「管理单个脚本文件与依赖」的问题。但官方随即指出新痛点：**逐个下载大量模块文件会拖累性能**——导入的第三方文件越多越明显。",
            "所幸更新的 Web 技术已大幅改善了这些方面，但**打包器仍然给我们大量处理与优化代码的能力**——代价是需要配置它。官方安抚：眼下我们的需求少而简单，一样一样来。",
            "官方还认真回答了「都 2026 年了为什么还要学 Webpack」：近年确有新构建工具替我们处理了大量基础配置，但真实世界里你不总有机会用上新鲜玩具——**落到需要更多手动配置的代码库上非常合理**；即使用着全自动工具，理解它们实际在替你做什么也很有用。开工前置（官方点名）：确保 Node.js 是**最新 LTS 版本**，需要时用 NVM 按 Foundations 的 Installing Node.js 课安装。"
          ]
        },
        {
          "h": "打包概念：入口、依赖图、单文件输出",
          "p": [
            "ESM 课学过的**入口（entry point）**与**依赖图（dependency graph）**在打包语境原样适用：我们给打包器一个入口文件，它**从该文件构建依赖图**，把所有相关文件合并到一起，**输出一个包含全部必要代码的单一文件**。",
            "顺带它还能做一堆别的事：压缩代码（minifying）、图片优化、甚至「摇树」（tree shaking，把没用到的代码摇出产物）——官方明说这些额外优化大多超出本课程范围；本课专注**基础 JS 打包**与 **HTML、CSS、图片**的处理。"
          ]
        },
        {
          "h": "安装 Webpack：npm init 与开发依赖",
          "p": [
            "Webpack 是最流行的 JavaScript 打包器之一（如果不是最流行的话），而且流行很久了。跟做开始：新建练习目录并初始化 package.json——`mkdir webpack-practice && cd webpack-practice && npm init -y --init-type=module`（-y 全默认；--init-type=module 声明本项目用 ESM，配置文件里才能用 import/export）。",
            "装 Webpack：`npm install --save-dev webpack webpack-cli`。**--save-dev（简写 -D）**把两个包记成**开发依赖**——Webpack 只在开发期用，让 Webpack 跑起来的实际代码不会成为浏览器运行代码的一部分（上一课 devDependencies 概念的实况）。",
            "装完后注意 npm 自动创建的两样东西：**node_modules** 目录（Webpack 实际代码与一大堆其他东西住这里）与 **package-lock.json**（npm 用来追踪更具体包信息的文件）。",
            "**官方提示块（npm audit 漏洞）**：装包后输出可能提到一些 vulnerabilities 与 npm audit fix——技术上算漏洞，但极可能是非常具体的边角问题；就 TOP 课程的场景而言，对你做的任何事几乎不可能有实际危险，**看到可以忽略**。真正需要逐条审查漏洞的场景是高风险的生产应用。"
          ]
        },
        {
          "h": "src 与 dist：干活与部署的两个目录",
          "p": [
            "用 Webpack（以及几乎任何打包器/构建工具）时有两个重要目录：**src**（source 的缩写）与 **dist**（distribution 的缩写）。技术上叫什么都行，但这两个名字是**约定**。",
            "分工：**src 放网站的全部源代码**——基本上所有工作都在这里发生（例外是改项目根目录的配置文件）；跑 Webpack 打包时，产物输出进 **dist**。",
            "官方给的心智模型：fork 或 clone 项目的人**不需要 dist**——他们跑一次 Webpack 就能从 src 构建出自己的 dist；而**部署网站只需要 dist**、别的都不要。官方口诀（原话加粗）：**在 src 里干活，构建进 dist，从那里部署！**"
          ]
        },
        {
          "h": "打包 JavaScript：最小配置文件",
          "p": [
            "**官方提示块（import 扩展名）**：ESM 里 import 路径通常要带扩展名（\"./greeting.js\"）；Webpack 与许多打包器里 .js 等扩展名**可选**（Webpack 默认自动给无扩展名路径补查 .js）——**这是 Webpack 的特性，不是 ESM 的**。本课示例一律带上扩展名保持显式。",
            "建 src 目录与两个文件（`mkdir src && touch src/index.js src/greeting.js`）：index.js 里 `import { greeting } from \"./greeting.js\"; console.log(greeting);`，greeting.js 里 `export const greeting = \"Hello, Odinite!\";`——index.js 依赖 greeting.js 的最小依赖图。",
            "项目根（src 外面）建 **webpack.config.js**（见示例 2），官方逐键讲解：**mode** 先留 development（对我们更有用；production 模式后面课程 revisit）；**entry** 是从配置文件出发到入口文件的路径（./src/index.js）；**output** 是产物信息——filename 产物名随意起、path 输出目录（这里 dist；不存在会自动创建；path.resolve(import.meta.dirname, \"dist\") 这个写法不用深究为什么，是 Webpack 推荐的输出目录写法）、**clean: true** 每次打包先清空输出目录再写入（dist 永远只含最近一次产物）。",
            "跑 `npx webpack`：dist 目录出现，里面有 main.js——内容「一大堆东西」多是后面要用的开发工具代码，不用慌。用 `node dist/main.js` 跑它，终端打印 Hello, Odinite! ——恭喜，第一个 Webpack bundle 出炉。"
          ]
        },
        {
          "h": "处理 HTML：HtmlWebpackPlugin",
          "p": [
            "我们做的是网站，得真有 HTML。HTML 不是 JavaScript，Webpack 没法直接打包它——但有个正合适的工具：**HtmlWebpackPlugin**。装它（同样开发依赖）：`npm install --save-dev html-webpack-plugin`。",
            "src 里建 template.html（文件名随意）填常规 HTML 骨架。**官方加粗警告：这个文件里不需要放 script 标签！**HtmlWebpackPlugin 会自动把输出 bundle 加成 script 标签——自己再写一个就双重注入了。",
            "配置里两步（见示例 3）：顶部 import HtmlWebpackPlugin，然后 plugins 数组里 `new HtmlWebpackPlugin({ template: \"./src/template.html\" })`——构造调用里传选项，现阶段只关心 template。",
            "再跑 `npx webpack`：dist 里现在有 main.js **和** index.html（它俩没法合成一个文件）；打开 index.html 能看到 HtmlWebpackPlugin 自动加的 **deferred script 标签**（官方原话：what a darling!）；浏览器打开、控制台看到 Hello, Odinite!。此后 HTML 有任何改动，重跑 Webpack 生成新 dist 即可。"
          ]
        },
        {
          "h": "加载 CSS：两个 loader 与顺序警告",
          "p": [
            "CSS 不止要一个新包，要**两个**（官方吐槽：真是个贪心的小家伙）：`npm install --save-dev style-loader css-loader`。分工：**css-loader** 读取我们在 JS 里 import 的 CSS 文件、把结果存成字符串；**style-loader** 拿这个字符串、生成「把这些样式应用到页面」的 JavaScript 代码。**两个都需要**。",
            "配置住新分区（loader 不是 plugin）：**module.rules** 数组里加 `{ test: /\\.css$/i, use: [\"style-loader\", \"css-loader\"] }`——告诉 Webpack：遇到以 .css 结尾的导入文件，用列出的 loader 处理。",
            "**官方警告块（loader 顺序）**：css-loader 放在数组**末尾**是必须的，不能反——Webpack **从末尾开始**跑 loader：先 css-loader 把 CSS 读成字符串，再 style-loader 把字符串里的 CSS 注入页面。反过来不工作。",
            "用起来：建 src/styles.css（body 背景 rebeccapurple），在 index.js 顶部 `import \"./styles.css\";`——这是**副作用导入**（side effect import，官方挂了 MDN 锚点）：我们不需要 CSS 文件导出任何东西，两个 loader 会处理一切。重跑 `npx webpack`，打开 dist/index.html——享受漂亮的紫色屏幕。",
            "**为什么不在模板里写 link 标签？**官方专门解释：虽然下一节的某个 loader 能做到，但真实项目部件多、模块多，最终**多个小 CSS 文件、在需要它们的模块里 import** 更好维护——甚至有办法让这些文件**只作用于该模块**而非全局。本课只引入「让 CSS 能 import 进 JS」的最小配置；更多构建工具与更复杂的打包配置会对导入的 CSS 做更多事。"
          ]
        },
        {
          "h": "加载图片：三种场景三种处置",
          "p": [
            "主配置接近尾声。本地图片文件不是 JavaScript，需要一点额外配置——官方按你**在哪里用图**分三种场景：",
            "**① CSS 里 url() 用的图**：走运——**css-loader 已经处理了**，CSS 里的图片路径零额外配置。",
            "**② HTML 模板里引用的图**（如 img 的 src）：装 **html-loader**（`npm install --save-dev html-loader`）并在 module.rules 加 `{ test: /\\.html$/i, use: [\"html-loader\"] }`——它检测模板里的图片路径、替我们加载正确的图片文件。不装的话，src=\"./odin.png\" 只是段文本，构建进 dist 后不再指向正确文件。",
            "**③ JS 里用的图**（操作 DOM 建 img、设 src 的场景）：把图片 **import 进 JS 模块**。图片不是 JS，要告诉 Webpack 这些文件是**资产**：module.rules 加 `{ test: /\\.(png|svg|jpg|jpeg|gif)$/i, type: \"asset/resource\" }`（不用装任何包；正则可增删扩展名——官方这份来自 Webpack Asset Management 指南，覆盖多数常见图片格式）。用的时候 **default import**：`import odinImage from \"./odin.png\";` 然后 `image.src = odinImage;`。",
            "**为什么必须 import**（官方解释得很透）：import 是为了让 odinImage 变量**在打包进 dist 后仍含正确路径**。直接写 `image.src = \"./odin.png\"` 的话那只是普通字符串——Webpack **不会**魔法般识别「这个字符串引用了一个文件」、不会把图片打进 bundle；而 import + asset/resource 规则让 Webpack 认出导入、把图片文件包含进构建、并保证导入的变量最终是正确路径。",
            "两条补充：**dist 里图片文件名变乱码是预期行为**——Webpack 默认按内容**哈希**重命名打包的图片（与防浏览器缓存及文件名匹配问题有关），官方明说不需要知道原理、不需要深挖、不需要会改；**官方 tip 块：只配置你需要的**——HTML 模板没有本地图片就不需要 html-loader，JS 不用本地图片就不需要 asset/resource 规则；将来遇到字体、预处理器等要特殊 loader/plugin 的东西，到时 Google 或查 Webpack 文档即可。"
          ]
        },
        {
          "h": "webpack-dev-server：告别手动重打",
          "p": [
            "这一课跟做下来，是不是已经烦透了「每改一次就要跑一次 npx webpack」？官方给了它认为最有用的方案：**webpack-dev-server**（`npm install --save-dev webpack-dev-server`）。它类似你可能用过的 Live Preview 扩展——保存改动自动刷新页面。",
            "原理：**幕后打包**——如同跑了 npx webpack 但**不把文件存进 dist**；每次你保存 bundle 用到的文件就重打一次。",
            "配置加两个属性（位置随意，见示例 3 完整版）。**其一 devtool: \"eval-source-map\"**——加 source map（官方挂了 devtool 文档）：不加的话，报错信息不一定对得上开发代码的正确文件与行号；DevTools 的 Sources 标签里也找不到原始未打包代码，Chrome 调试器难用——加上两个问题一起解决。**其二 devServer.watchFiles: [\"./src/template.html\"]**——默认 dev server 只在**被 import 进 JS bundle 的文件**变化时自动重启，HTML 模板会被忽略；把它加进监视文件数组即可，就这么简单。",
            "启动：`npx webpack serve`，站点默认开在 **http://localhost:8080/**。",
            "**官方提示块（改配置要重启）**：webpack-dev-server **只在启动时读一次** webpack 配置——运行中改配置文件不会生效。终端 Ctrl+C 杀掉、重跑 npx webpack serve 才能应用新配置。"
          ]
        },
        {
          "h": "收束：看似变复杂，实则值得",
          "p": [
            "官方收束段很坦诚：是的，这一切可能显得很多——你从「几个基础 HTML/CSS/JS 文件、别的都不需要」突然来到「这个 loader、那个 plugin、这个配置文件」。但真实世界里应用越复杂，越需要**既改善开发体验、又优化生产表现**的工具。",
            "虽然现在没用上所有可用特性，**对这类工具在替我们做什么有总体理解是有价值的**：课程后面你会用到把大量底层机制抽象掉的工具——用着它们却完全不知道它们在干什么，等到真遇到需要手动配置的局面就会更难。",
            "官方预告：后面的课（本站下一课 Revisiting Webpack）会介绍让 Webpack 的搭建与使用**更快更直接**的补充手段；现在，先手工练一练。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "bash",
          "code": "# 起步三连（官方原命令）\nmkdir webpack-practice &&\ncd webpack-practice &&\nnpm init -y --init-type=module\n\n# 装 Webpack（开发依赖，-D 是 --save-dev 的简写）\nnpm install --save-dev webpack webpack-cli\n\n# 建源文件\nmkdir src && touch src/index.js src/greeting.js\n\n# 打包与验证\nnpx webpack\nnode dist/main.js   # → Hello, Odinite!\n\n# 后续按需装（都是开发依赖）\nnpm install --save-dev html-webpack-plugin\nnpm install --save-dev style-loader css-loader\nnpm install --save-dev html-loader        # 仅 HTML 模板有本地图才需要\nnpm install --save-dev webpack-dev-server\n\n# 开发服务器（配置改过要先 Ctrl+C 重启）\nnpx webpack serve   # → http://localhost:8080/",
          "note": "官方全流程命令汇总（顺序即跟做顺序）。所有工具都装成开发依赖——它们只在开发期工作，浏览器跑的是打包产物，不含这些工具本身的代码。"
        },
        {
          "lang": "javascript",
          "code": "// src/index.js（官方原码）\nimport \"./styles.css\";                 // 副作用导入：不需要它导出任何东西\nimport { greeting } from \"./greeting.js\";\n\nconsole.log(greeting);\n\n// src/greeting.js（官方原码）\nexport const greeting = \"Hello, Odinite!\";\n\n// src/styles.css（官方原码）\n// body { background-color: rebeccapurple; }\n\n// webpack.config.js —— 最小版（官方原码）\nimport path from \"node:path\";\n\nexport default {\n  mode: \"development\",\n  entry: \"./src/index.js\",\n  output: {\n    filename: \"main.js\",\n    path: path.resolve(import.meta.dirname, \"dist\"),\n    clean: true,   // 每次打包先清空 dist\n  },\n};",
          "note": "官方最小可跑组合：两个源文件 + 一份四键配置。output.path 的 path.resolve(import.meta.dirname, \"dist\") 写法按官方口径「不用深究为什么，是推荐写法」。"
        },
        {
          "lang": "javascript",
          "code": "// webpack.config.js —— 完整最终版（官方原码）\nimport path from \"node:path\";\nimport HtmlWebpackPlugin from \"html-webpack-plugin\";\n\nexport default {\n  mode: \"development\",\n  entry: \"./src/index.js\",\n  output: {\n    filename: \"main.js\",\n    path: path.resolve(import.meta.dirname, \"dist\"),\n    clean: true,\n  },\n  devtool: \"eval-source-map\",        // source map：报错指回源文件与行号\n  devServer: {\n    watchFiles: [\"./src/template.html\"],  // 模板不在 JS 依赖图里，要手动监视\n  },\n  plugins: [\n    new HtmlWebpackPlugin({\n      template: \"./src/template.html\",  // 模板里不要自己写 script 标签！\n    }),\n  ],\n  module: {\n    rules: [\n      {\n        test: /\\.css$/i,\n        use: [\"style-loader\", \"css-loader\"],  // 从末尾跑：css-loader 先读成字符串\n      },\n      {\n        test: /\\.html$/i,\n        use: [\"html-loader\"],\n      },\n      {\n        test: /\\.(png|svg|jpg|jpeg|gif)$/i,\n        type: \"asset/resource\",\n      },\n    ],\n  },\n};",
          "note": "官方完整配置原码（含 html-loader 与 asset/resource 两条——按 tip 块口径：用不到就不必配）。行内注释是本站加的要点回指，配置本体逐字未动。"
        },
        {
          "lang": "javascript",
          "code": "// JS 里用本地图片（官方原码）\n// 前提：module.rules 里已有 asset/resource 图片规则\nimport odinImage from \"./odin.png\";   // default import：变量将含打包后的正确路径\n\nconst image = document.createElement(\"img\");\nimage.src = odinImage;\n\ndocument.body.appendChild(image);\n\n// 反例（官方点名）：image.src = \"./odin.png\";\n// ——只是普通字符串，Webpack 不识别、不打包该图，dist 里路径失效",
          "note": "官方图片导入原码。dist 里的图片会顶着哈希乱码文件名——预期行为（缓存问题），不需要会改。"
        }
      ],
      "pitfalls": [
        {
          "title": "template.html 里自己写了 script 标签",
          "text": "HtmlWebpackPlugin 会自动注入产物 bundle 的 deferred script——模板里再写一个就双重加载（脚本跑两遍，事件挂两遍，状态乱套）。官方加粗强调过：模板里不需要 script 标签。"
        },
        {
          "title": "CSS loader 顺序写反",
          "text": "use: [\"css-loader\", \"style-loader\"] 不工作——Webpack 从数组末尾开始跑，必须 css-loader 在末尾先读文件成字符串、style-loader 在前再注入。官方警告块原话：必须这个顺序，不能反。"
        },
        {
          "title": "改了 webpack.config.js 却发现没生效",
          "text": "dev server 只在启动时读一次配置——运行中改配置不会热应用。Ctrl+C 杀掉、npx webpack serve 重启（官方提示块）。排查特征：配置改对了、行为还是旧的。"
        },
        {
          "title": "改了 template.html 页面没动静",
          "text": "dev server 默认只监视被 import 进 JS bundle 的文件——HTML 模板不在依赖图里。把它加进 devServer.watchFiles 数组（官方正文点名的第二个配置项就是为这个）。"
        },
        {
          "title": "JS 里直接写字符串图片路径",
          "text": "image.src = \"./odin.png\" 在开发时看着没问题（文件真在那），打包进 dist 后路径失效——字符串不是 import，Webpack 不认。本地图片进 JS 一律 default import + asset/resource 规则。"
        },
        {
          "title": "把 dist 提交进仓库或部署整个项目目录",
          "text": "dist 是可再生的衍生物：clone 的人自己构建，部署只发 dist。把 dist 提交进 git 会让每次构建都产生大 diff、还容易与 src 不同步；部署整个项目（含 src 与 node_modules）则把源码与开发依赖全暴露了。口诀：src 干活、dist 部署。"
        }
      ],
      "official": {
        "assignment": [
          "先读 Webpack 官方 concepts 页：对主要术语（entry / output / loaders / plugins 等）建立总体理解。",
          "读 Webpack 官方 Asset Management 指南：处理各类资产（CSS、图片、字体）的例子。你会看到它的例子用 npm run build 打包——在本课语境下等价于 npx webpack；npm scripts 后面课程讲。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/organizing_your_javascript_code/webpack.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "1b1ce82376b849a8064528d505cafe2fbf28bebd9957b8ff67bd5a98d7c81329",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-javascript-restaurant-page",
      "title": "Project: Restaurant Page",
      "zh": "项目：餐厅页面",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-restaurant-page",
      "summary": "用 JavaScript 生成整个网站内容的标签页式餐厅主页：Webpack 搭台（只装你需要的）、template.html 只留 header/nav 按钮与空 div#content、首页内容先硬编码再全部改为 JS 动态创建、Home/Menu/Contact 每个「标签页」一个独立模块、切换逻辑住 index.js——最后走官方六步命令把 dist 部署上 GitHub Pages。官方加粗提示：DOM 元素必须用 JavaScript 创建，样式可以写在独立 CSS 文件里。本站只提供要求中文化、拆解与验收清单，不提供成品代码。",
      "guide": "以下是官方项目要求的中文化与拆解。这是 ESM + Webpack 两课的全尺寸实战，也是「模块分工」思想第一次决定项目成败：官方把任务拆得很细（八条主任务 + 六步部署），推进顺序就是推荐顺序——特别是第 5、6 条的「先硬编码看效果、再清空改 JS 重建」两步走，是官方刻意安排的对照练习，别跳过。三个官方点名的纪律：nav 里用**按钮**不是链接；每个 tab 的内容住**自己的模块**（导出「造 div 填内容」的函数）；切换逻辑（清 #content → 跑对应模块）住 index.js。部署部分是官方明说「不需要懂每条命令的含义、仔细照做就行」的流程题：GitHub Pages 找项目根目录的 index.html，而你的在 dist 里——所以要把 dist 的内容推到独立的 gh-pages 分支。另外别漏了 .gitignore（官方提示块专门讲）：node_modules 与 dist 都不进 git。按本站红线，本页不提供任何成品代码。",
      "understand": [
        "项目总目标（官方开场）：继续练 DOM 操纵——**只用 JavaScript 生成整个网站的内容**；加粗 Note：DOM 元素应该用 JavaScript 创建，样式可以写在独立 CSS 文件里",
        ".gitignore（官方提示块）：npm 装的包不需要用 git 追踪 node_modules 内容、也不推上 GitHub——package.json 已含全部依赖信息，谁 clone 谁 npm install；项目根建 .gitignore 文件写入不想追踪的文件/目录名；惯例加 node_modules（可能非常大）与 dist（跑构建命令即可再生）；GitHub 建新仓库时可指定 .gitignore 模板，JavaScript 项目有现成的 node 模板（就含 node_modules 与 dist）",
        "起步与 Webpack 课同款：建 package.json、配 Webpack——**只装只配项目需要的**（官方例子：HTML 模板不链本地图片就不需要 html-loader）",
        "template.html 骨架：body 里一个 <header>，内含 <nav>，nav 里放各「标签页」的**按钮（不是链接！）**（如 Home / Menu / About）；header 下面只放一个 <div id=\"content\">",
        "第 4 条是验证步：index.js 里写句 console.log 或 alert，跑 npx webpack serve，开 localhost:8080 确认 JS 在跑——先把管线验通再干活",
        "两步走建首页：先在 div#content 里**硬编码**餐厅首页（图片、大标题、夸餐厅的文字，不用太 fancy）看效果；然后**把 #content 里的东西全部从 HTML 删掉**（header 与 nav 保留、#content 留空），改为纯 JavaScript 创建——页面首次加载时把每个新元素 append 进 div#content",
        "模块分工（官方架构要求）：初始页面加载函数写进**它自己的模块**，index.js import 并调用它；每个「标签页」的内容各住一个模块，每个模块**导出一个函数**：创建 div、填入内容与样式、append 进 DOM",
        "切换逻辑住 index.js：header nav 的每个按钮挂事件监听——**清空 div#content 的当前内容，然后运行正确的「tab 模块」**重新填充",
        "部署 GitHub Pages 的症结：Pages 默认找**项目根目录**的 index.html，而你的在 dist 里——解法是把 dist 的**内容**推到 GitHub 上的独立分支（gh-pages），那个分支根部就有 index.html 可供 Pages 服务",
        "部署六步（官方明说不需要懂每条命令、仔细照做即可；首次部署多做第 1 步，其余每次部署/再部署都走）：① git branch gh-pages（仅首次）；② git status 确认全部工作已提交；③ git checkout gh-pages && git merge main --no-edit；④ npx webpack 打包进 dist；⑤ 三条命令按序：git add dist -f && git commit -m \"Deployment commit\"、git subtree push --prefix dist origin gh-pages、git checkout main；⑥ 仓库 Settings 里把 GitHub Pages 的 source 分支改成 gh-pages",
        "官方给了视觉参考：一位学生作品的 live preview（Beary's Breakfast Bar，经 web.archive.org 存档）——看标签页切换的交互形态找灵感"
      ],
      "terms": [
        {
          "en": "Tabbed browsing",
          "zh": "标签页式浏览：nav 按钮切换内容区——整站只有一个 HTML 页面，内容全靠 JS 按 tab 重建"
        },
        {
          "en": "Tab module",
          "zh": "标签页模块：每个 tab 的内容住一个独立 ESM 模块，导出「创建 div、填内容、挂进 DOM」的函数"
        },
        {
          "en": ".gitignore",
          "zh": "git 忽略清单：写明不追踪的文件/目录——本项目必写 node_modules 与 dist（前者可重装、后者可再生）"
        },
        {
          "en": "gh-pages branch",
          "zh": "GitHub Pages 的部署分支：根目录带 index.html 的产物分支——Pages 的 source 指向它"
        },
        {
          "en": "git subtree push --prefix dist",
          "zh": "把仓库里 dist 子目录的内容推成远端分支历史的命令——本项目部署的核心一步（官方：不需要懂原理）"
        }
      ],
      "tasks": [
        "起步：按 Webpack 课同款流程建 package.json 与 Webpack 配置——只装只配你需要的（模板不链本地图就不装 html-loader）",
        "建 .gitignore：项目根目录，node_modules 与 dist 各占一行（官方给了原文）",
        "搭模板骨架：src/template.html 里 <header> 含 <nav>，nav 放各 tab 的**按钮（不是链接）**；header 下方单个 <div id=\"content\">",
        "验证管线：src/index.js 写句 console.log 或 alert，npx webpack serve，浏览器开 localhost:8080 确认 JS 在跑",
        "硬编码首页：在 div#content 里直接写餐厅首页（图片、大标题、介绍文字，不必 fancy），看效果",
        "改纯 JS 重建：把 #content 里的内容全部从 HTML 删掉（保留 header/nav 与空 #content），用 JS 在首次加载时逐个 append 新元素——这段初始加载函数写进它自己的模块，index.js import 并调用",
        "做 tab 切换：Menu 与 Contact 各建一个模块（各导出「造 div 填内容挂 DOM」的函数）；index.js 里给 nav 每个按钮挂监听：清空 #content → 运行对应 tab 模块；对照官方给的学生作品存档找视觉灵感",
        "部署 GitHub Pages：按官方六步走（首次多一步 git branch gh-pages；Settings 里把 Pages source 改成 gh-pages）——命令照抄即可，官方明说不需要懂每条命令",
        "对照下方验收清单自查；建议部署后把仓库链接记进自己的作品集清单"
      ],
      "quiz": [
        {
          "question": "nav 里为什么官方强调用按钮（button）而不是链接（a）？",
          "answer": "标签页切换不发生页面导航——整站只有一个 HTML 页面，点 nav 只是「清空 #content、跑对应模块重填」的 JS 行为。链接（a href）的语义是「去另一个地址」，用在这里要么触发真实跳转刷新页面（tab 状态全丢），要么写 href=\"#\" 之类假地址（语义欺骗、还会在地址栏留 #）。按钮的语义正是「触发一个动作」——这与 Foundations 表单课「按钮要有正确角色」一脉相承。"
        },
        {
          "question": "官方为什么要求每个 tab 的内容住自己的模块、切换逻辑却住 index.js？",
          "answer": "这是单一职责的实地演练（OOP Principles 课会正式讲）：每个 tab 模块只负责「造出我这块内容」，互相不知道对方存在；index.js 是唯一的协调者，只管「谁被点了→清空→叫谁上场」。好处：加一个新 tab 只需新模块 + index.js 加一个监听；改某个 tab 内容不碰任何其他文件——模块边界就是变更的防火墙。"
        },
        {
          "question": "为什么 .gitignore 要写 node_modules 与 dist？两者的理由有什么不同？",
          "answer": "两者都是「可再生的衍生物」，但再生方式不同：node_modules 是 npm install 按 package.json 清单重装出来的——它可能非常大，推上 GitHub 又慢又没意义（官方提示块：clone 的人自己 install 即可）；dist 是跑一次构建命令（npx webpack）就能再生的产物。仓库只带源（src + package.json + 配置），衍生物谁用谁生成——这也是第 6 步部署时 git add dist 需要 -f（强制）的原因：dist 被 .gitignore 忽略了，部署提交要显式强加。"
        },
        {
          "question": "部署为什么需要一个 gh-pages 分支，而不是直接用 main？",
          "answer": "GitHub Pages 到**它服务的分支根目录**找 index.html——main 分支根部没有（你的 index.html 在 dist/ 里，而且 dist 还被 .gitignore 忽略着）。解法：建一个 gh-pages 分支，让它的**根目录**就是 dist 的内容（git subtree push --prefix dist 干的正是这件事），再把仓库 Settings 里 Pages 的 source 分支设为 gh-pages。main 继续做开发主线，两条分支各司其职。"
        }
      ],
      "optional": [],
      "note": "Project 红线课：本站不提供成品代码或完整骨架（examples 为空数组）。官方原文含 .gitignore 的两行内容与部署命令原文（已按事实转写进正文与 official.assignment——命令是操作流程不是项目成品代码，不违红线）。官方给的学生作品参考链接是 web.archive.org 存档页（原 GitHub Pages 站点），已登记进本课资料。TOP 自有的 npm 课页链接按既有口径剔除。",
      "why": "Restaurant Page 是「组织 JavaScript 代码」半程的总验收：ESM 的模块分工、Webpack 的全套配置、DOM 操纵、单一职责的雏形（内容模块 vs 协调者 index.js）在一个项目里会师。它也是你第一次把打包产物真正部署上线——从「localhost 自嗨」到「有一个公网 URL 的作品」，这一步的心理意义不亚于技术意义。下一个项目 Todo List 会在这个架构上加状态管理与持久化，架构不对齐的话到时候会寸步难行。",
      "sections": [
        {
          "h": "项目定位：只用 JS 生成整个网站",
          "p": [
            "官方开场：用学到的东西继续练 DOM 操纵——**动态渲染一个餐厅主页**；做完时，你将**只用 JavaScript 生成网站的全部内容**。",
            "官方加粗 Note 划清边界：**DOM 元素应该用 JavaScript 创建，但样式可以写在独立的 CSS 文件里**——「内容归 JS、样式归 CSS」，不是让你用 JS 拼 style 字符串。",
            "这个项目同时是 Webpack 课的实弹场：从 npm init 到 dev server 到部署，上一课的每份配置都会在这里挣回票价。"
          ]
        },
        {
          "h": "开工前：.gitignore 的讲究（官方提示块）",
          "p": [
            "用 npm 装包的项目，**node_modules 的内容不需要 git 追踪、也不该推上 GitHub**：npm 课学过，package.json 已含全部依赖信息——任何人 clone 你的项目后 npm install 就能在自己机器上装齐。",
            "做法：项目根目录建 **.gitignore** 文件，把不想追踪的文件或目录名写进去。**惯例**：node_modules 要加（它可能变得非常大）；**dist 也常被忽略**——因为谁跑一次打包/构建命令它就能再生。",
            "顺带一个 GitHub 便利：新建仓库时有指定 .gitignore **模板**的选项——按项目类型/语言预置了常见不追踪项；JavaScript 项目有现成的 **node 模板**，就包含 node_modules 与 dist。"
          ]
        },
        {
          "h": "起步与模板骨架：按钮 nav + 空 content",
          "p": [
            "任务 1：按 Webpack 教程项目同款方式起步——建 package.json、配 Webpack。官方提醒（原话）：**只需要安装与配置项目需要的东西**——例如不打算在 HTML 模板里链本地图片文件，就不需要装配 html-loader。",
            "任务 2：项目根建 .gitignore，内容就两行：node_modules 与 dist（各占一行，官方给了原文）。",
            "任务 3：src/template.html 里搭 HTML 骨架——body 里加一个 **header** 元素，内含 **nav**，nav 里放各「标签页」的**按钮（官方括号强调：不是链接！）**，例如 Home、Menu、About；header 下方加**一个** `<div id=\"content\">`——全部内容区就这一个 div。",
            "任务 4（管线验证步，别跳）：src/index.js 里写一句 console.log 或 alert，跑 `npx webpack serve`，浏览器开 http://localhost:8080 ——确认你的 JavaScript 在跑。先验证管线再干重活，出问题时才知道该怀疑哪一层。"
          ]
        },
        {
          "h": "两步走：先硬编码，再清空改纯 JS",
          "p": [
            "任务 5：在 div#content 里给餐厅做个首页——可以放图片、大标题、一段「这家餐厅多棒」的文字；官方宽慰：**不必做得太 fancy**；现在**可以先硬编码进 HTML**，就为了看看它们在页面上的样子。",
            "任务 6（本项目的心跳）：**把 div#content 里的东西全部从 HTML 删掉**——header 与 nav 保留、#content 留空——改为**只用 JavaScript 创建**它们：例如页面首次加载时把每个新元素 append 进 div#content。",
            "官方顺势把架构要求立起来：既然多文件体系已就绪，**这个初始页面加载函数就写进它自己的模块**，然后在 index.js 里 import 并调用它。「先硬编码看效果、再清空重建」的对照是官方刻意安排：你能确切体会到同一份内容「写死在 HTML」与「JS 动态生成」的差别，以及为什么要后者（tab 切换需要内容可被随时重建）。"
          ]
        },
        {
          "h": "标签页架构：每 tab 一模块，切换住 index.js",
          "p": [
            "任务 7：把餐厅站点做成**标签页式浏览**，能访问 Menu 与 Contact 页。官方给了视觉参考：一位学生作品（Beary's Breakfast Bar）的 live preview 存档——看它的 tab 交互形态找灵感（已挂进本课资料）。",
            "架构两条（官方子弹块原文要点）：**① 每个 tab 的内容放进它自己的模块**——每个模块导出一个函数：创建一个 div 元素、给它加上相应的内容与样式、然后 append 进 DOM。**② 切换逻辑写在 index.js 里**——header nav 的每个按钮都挂事件监听：监听器**清空 div#content 的当前内容**，然后**运行正确的「tab 模块」**把新内容填进去。",
            "这个分工值得多看一眼：tab 模块之间互不认识（各自只管造自己的内容），index.js 是唯一的协调者——加新 tab、改旧 tab 都只动一个模块加一行注册。OOP Principles 课的「单一职责」与「松耦合」，你已经提前在用。"
          ]
        },
        {
          "h": "部署：把 dist 推上 gh-pages 分支",
          "p": [
            "官方的 Deployment 节先讲清症结：这次部署比之前的项目**多一点工作**——GitHub Pages 会到**项目的根目录**找 index.html，**而你的在 dist 里**。解法：做几步操作，把 dist 目录的**内容**推到 GitHub 上**它自己的分支**——那个分支的根部就有 index.html 供 Pages 服务了。",
            "官方两句定心丸：**不需要确切知道所有命令在干什么**——仔细照下面的说明做就行；这套步骤既用于首次部署，也用于以后项目改动后的**再部署**。",
            "六步流程（第 1 步仅首次）：**①** `git branch gh-pages` 建部署分支（只需首次做）；**②** 确认所有工作已提交（git status 看有没有待提交的）；**③** `git checkout gh-pages && git merge main --no-edit` 切分支并同步 main 的改动；**④** 用构建命令打包进 dist（现阶段就是 `npx webpack`）；**⑤** 三条命令按序跑：`git add dist -f && git commit -m \"Deployment commit\"`（-f 强制加被 .gitignore 忽略的 dist）、`git subtree push --prefix dist origin gh-pages`（把 dist 的内容推成远端 gh-pages 分支）、`git checkout main`（切回主线）；**⑥** 回忆 GitHub Pages 的 **source 分支**在仓库 Settings 里设置——把它改成 **gh-pages**。到此为止！",
            "为什么 ③ 要先 merge main：gh-pages 分支只是部署载体，但它也需要拿到 main 上的最新源码上下文来构建；为什么 ⑤ 要 -f：dist 在 .gitignore 里，普通 add 会跳过它，部署提交必须强制加入。"
          ]
        },
        {
          "h": "验收清单",
          "p": [
            "对照自查：① Webpack 项目起步（package.json + 配置，只装只配需要的）；② .gitignore 含 node_modules 与 dist 两行；③ template.html：header > nav（**按钮**不是链接）+ 单个空 div#content；④ dev server 验证过 JS 在跑；⑤ 首页内容（图、标题、文字）最终**全部由 JS 生成**——HTML 里的 #content 是空的；⑥ 初始加载函数住自己的模块、index.js import 调用；⑦ Menu 与 Contact 各住一个模块、各导出「造 div 填内容挂 DOM」的函数；⑧ 切换逻辑住 index.js：每个 nav 按钮的监听器清空 #content 再跑对应模块；⑨ 样式在独立 CSS 文件（JS 不拼样式字符串）；⑩ 已部署：gh-pages 分支根部有 index.html，仓库 Settings 的 Pages source 指向 gh-pages，公网 URL 能打开且 tab 可切换。",
            "加分自查（非官方要求）：刷新页面后 tab 会回到初始状态吗？如果想记住用户所在的 tab，想想状态该存在哪个模块里——这是 Todo List 项目要正式面对的问题。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "nav 用 <a href> 做 tab 按钮",
          "text": "链接的语义是导航到另一个地址——tab 切换没有导航发生。用 <a> 要么真跳转（整页刷新、JS 状态全丢），要么 href=\"#\" 假地址污染地址栏。官方括号里专门写了「不是链接！」：用 <button>，语义正确、行为干净。"
        },
        {
          "title": "内容还硬编码在 template.html 里就开始做 tab",
          "text": "任务 5 的硬编码只是「看效果」的中间站，任务 6 要求全部清空改 JS 生成——tab 切换的前提是内容可被程序化重建。跳过任务 6 的话，切 tab 时你会发现「清掉 #content 之后再也造不回首页」。"
        },
        {
          "title": "把 node_modules 或 dist 推进了仓库",
          "text": "先建 .gitignore 再 git add：node_modules 可能巨大且可由 npm install 再生，dist 可由构建再生——推进仓库既臃肿又容易与源不同步。已经误提交的话，git rm -r --cached 把它们从追踪中移除再提交 .gitignore。"
        },
        {
          "title": "部署时忘了 -f 或忘了改 Pages source",
          "text": "两个高频翻车点：git add dist 不带 -f 会因 .gitignore 静默跳过（提交里根本没有产物，部署了个寂寞）；推完 gh-pages 不去 Settings 把 Pages source 改过来，Pages 还在看 main 的根部——那里没有 index.html，404。"
        },
        {
          "title": "tab 模块里互相 import 对方的内容",
          "text": "模块之间一旦互认，边界就碎了（改一个 tab 连累另一个）。官方架构：tab 模块只导出自己的「造内容」函数，互相不认识；一切协调（清空、调用谁）住 index.js。想共享的东西（如工具函数）另立第三个模块。"
        }
      ],
      "official": {
        "assignment": [
          "按 Webpack 教程项目同款方式起步：创建 package.json、配好 Webpack。子弹块：记住只需安装与配置项目需要的东西——例如不打算在 HTML 模板里链本地图片，就不需要安装与配置 html-loader。",
          "项目根目录创建 .gitignore 文件，内容两行：node_modules 与 dist。",
          "在 src/template.html 里搭 HTML 骨架：body 里加一个 <header>，内含带按钮（不是链接！）的 <nav>，按钮对应不同「标签页」（例如 Home、Menu、About）；header 下方加一个 <div id=\"content\">。",
          "src/index.js 里写一句 console.log 或 alert，跑 npx webpack serve，浏览器打开 http://localhost:8080 检查你的 JavaScript 在运行。",
          "在 div#content 里创建餐厅首页：可以包含图片、大标题、一段餐厅多棒的文字；不必做得太 fancy。现阶段把这些硬编码进 HTML 也可以，先看看它们在页面上的样子。",
          "现在把 div#content 里的所有东西从 HTML 里移除（保留 header 与 nav，下面留空的 div#content），改为只用 JavaScript 创建——例如页面首次加载时把每个新元素 append 进 div#content。既然多文件体系已就绪，把这个初始页面加载函数写进它自己的模块，然后在 index.js 里 import 并调用。",
          "接下来把餐厅站点设为标签页式浏览，可访问 Menu 与 Contact 页。看官方给的学生 live preview 站点（Beary's Breakfast Bar 存档）找视觉灵感。子弹块一：每个「tab」的内容放进它自己的模块——每个模块导出一个函数：创建 div 元素、加上相应的内容与样式、append 进 DOM。子弹块二：tab 切换逻辑写在 index.js 里——header nav 的每个按钮都应有事件监听：清空 div#content 的当前内容，然后运行正确的「tab 模块」重新填充。",
          "部署（Deployment 节）：把项目部署到 GitHub Pages。这次比之前的项目多一点工作：GitHub Pages 会找项目根目录的 index.html，而你的在 dist 里——需要几步操作把 dist 目录的内容推到 GitHub 上它自己的分支，让那个分支根部有 index.html 供 Pages 服务。官方明说：不需要确切知道所有命令在干什么，仔细照做即可；这套步骤用于首次部署，也用于日后改动的再部署。六步：① git branch gh-pages（仅首次部署要做）；② 确认所有工作已提交（git status 查看）；③ git checkout gh-pages && git merge main --no-edit（切分支并同步 main）；④ 用构建命令打包进 dist（现阶段是 npx webpack）；⑤ 按序跑三条：git add dist -f && git commit -m \"Deployment commit\"、git subtree push --prefix dist origin gh-pages、git checkout main；⑥ GitHub Pages 的 source 分支在仓库设置里——改成 gh-pages。全部完成！"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/organizing_your_javascript_code/project_restaurant_page.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "4035f3f970968554dd03f2e77514d4783680cccdc00b9eb9533f3ac94fe2aa7b",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-javascript-revisiting-webpack",
      "title": "Revisiting Webpack",
      "zh": "再探 Webpack",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-revisiting-webpack",
      "summary": "做完 Restaurant Page 回头改善开发工作流的三件事：① npm scripts——把长命令（git subtree push --prefix dist origin gh-pages 这种）收进 package.json 的 scripts，npm run build / dev / deploy 一键跑，名字还能标准化；② Webpack 的 development 与 production 两种 mode——生产模式做部署优化，两份配置文件（webpack.dev.js / webpack.prod.js）+ --config 让脚本各用各的，Assignment 的 webpack-merge 再把重复配置合并掉；③ GitHub 模板仓库——把反复复用的项目搭建代码存成 Template repository，新仓库一键从模板复制。",
      "guide": "以下是官方原课的中文化梳理。这一课体量小、定位是「工作流升级」：Restaurant Page 做下来你已经体会过手敲长命令与手改 mode 的烦，官方顺势给三件改善工具。三件事都值得立刻落到你自己的项目里：npm scripts 五分钟就能把 build/dev/deploy 配好（注意官方细节：写进 scripts 时命令前缀的 npx 要去掉）；production mode 官方带你亲手试一次——去 Restaurant Page 把 mode 改成 production 重新构建，看 dist 里的产物变成「更加华丽的一团乱码」，但明确说不需要知道具体优化了什么；模板仓库是「第二次搭同款项目」时的省时器。Assignment 只有一条：Webpack 官方 Production 指南（webpack-merge 与拆分配置文件），官方给了阅读边界——「Specify the Mode」一节可跳过。",
      "understand": [
        "npm scripts：package.json 里加 \"scripts\" 属性（一个「名字: 命令」的对象），终端跑 npm run <名字> 执行——长命令（官方例子：Restaurant Page 部署用的 git subtree push --prefix dist origin gh-pages）不用每次手敲",
        "scripts 示例三件套：\"build\": \"webpack\"（等价 npx webpack）、\"dev\": \"webpack serve\"（等价 npx webpack serve）、\"deploy\": \"git subtree push --prefix dist origin gh-pages\"",
        "命名标准化的好处：npm run build 通常放构建/打包/编译命令、npm run dev 通常启动开发服务器——名字不总是相同，但比裸 npx webpack 更能说明用途",
        "官方细节：写进 scripts 时 webpack 与 webpack serve 命令**前缀的 npx 要去掉**——npx 只是「不经 npm scripts 直接在终端跑」时才需要",
        "Webpack 两种 mode：development（开发时最合适，一直用到现在）与 production（为部署构建时做不同的优化）；官方练习：把 Restaurant Page 的 mode 改成 \"production\" 重新构建，看 dist 里的 JS bundle 变成「更华丽的一团乱码」",
        "官方口径：真的不需要确切知道 production 应用了哪些优化、也不需要知道它的其他细节——知道两种模式存在、各为特定目的设计即可",
        "免去手改配置的方案：两份配置文件（如 webpack.dev.js 与 webpack.prod.js），build 与 dev 脚本各自用 --config 指定（\"build\": \"webpack --config webpack.prod.js\"、\"dev\": \"webpack serve --config webpack.dev.js\"）；不写 --config 时 Webpack 默认找 webpack.config.js",
        "一次配好就忘：每个脚本自动用对配置文件与模式；Assignment 会介绍 webpack-merge 工具——让多配置文件更易管理、重复最小化",
        "模板仓库（template repository）：Webpack 项目搭建涉及多文件多目录与不少配置，每次新项目都要翻旧项目复制粘贴——GitHub 建仓库时 Configuration 区有 Start with a template 选项；任何现有仓库都能在 Settings 里勾成模板（就在改名输入框正下方）；勾选即完成，之后新建仓库时下拉列出你的模板，选中新仓库就是模板的副本而非空仓库",
        "模板的使用哲学（官方）：你可能不确定模板里该放什么——当你发现自己在多个项目间反复复用大量搭建代码时，就把那些搭建代码放进一个新仓库、标成模板、按需更新；建新项目仓库时选它，省时，更快进入项目本身"
      ],
      "terms": [
        {
          "en": "npm script",
          "zh": "package.json 的 scripts 条目：「名字: 命令」映射，npm run <名字> 执行——长命令的收纳与标准化"
        },
        {
          "en": "production mode",
          "zh": "Webpack 的生产模式：为部署构建做优化（对照开发期用的 development 模式）——具体优化内容按官方口径不必深究"
        },
        {
          "en": "--config",
          "zh": "Webpack 的配置文件指定参数：多份配置（dev/prod）时让脚本各用各的；省略时默认找 webpack.config.js"
        },
        {
          "en": "webpack-merge",
          "zh": "合并多份 Webpack 配置的工具：公共部分抽一份、dev/prod 各补差异——Assignment 阅读的主题"
        },
        {
          "en": "Template repository",
          "zh": "GitHub 模板仓库：勾选后新建仓库可从它复制起步——反复复用的项目搭建代码的家"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：三件事——npm scripts、双 mode 双配置、模板仓库",
        "动手（官方点名 Try it!）：去你的 Restaurant Page 项目，把 webpack.config.js 的 mode 改成 \"production\"，重跑构建命令，打开 dist 里的 bundle 看看那团「更华丽的乱码」；看完改回 development",
        "给你的 Restaurant Page 配上 scripts 三件套（build / dev / deploy），把部署那条长命令收进 npm run deploy；注意命令里不带 npx",
        "读 Webpack 官方 Production 指南（Assignment 唯一条目）：webpack-merge 与拆分配置文件的走法——官方提示：指南的例子接续它自己更长的教程，但 webpack-merge 与拆配置的主干部分用新项目也能跟，或者直接把你的 Restaurant Page 改造成这种方式；「Specify the Mode」一节及其例子可跳过",
        "可选：把你的 Webpack 起步配置（package.json scripts + 双配置 + template.html 骨架）整理成一个新仓库，Settings 里勾成 Template repository——下一个项目（Todo List）直接从它起步"
      ],
      "quiz": [
        {
          "question": "npm scripts 解决什么问题？写进 scripts 的命令与直接在终端跑的命令有什么写法差别？",
          "answer": "长命令不用每次手敲（官方例子：部署那条 git subtree push --prefix dist origin gh-pages），且命令有了标准化的名字（build 通常是构建/打包/编译、dev 通常启动开发服务器）——比裸 npx webpack 更能说明用途。写法差别：scripts 里 webpack 与 webpack serve 前面**不带 npx**——npx 只是不经 npm scripts 直接在终端跑时才需要的启动器。"
        },
        {
          "question": "development 与 production 两种 mode 各为什么设计？官方要求你掌握到什么深度？",
          "answer": "development 适合开发期（一直用到现在的模式）；production 在为部署构建时做一些不同的优化——产物变成压缩过的「更华丽的一团乱码」。官方明确口径：真的不需要知道具体优化了什么、也不需要 production 模式的其他细节——知道两种模式存在、各为特定目的设计即可。"
        },
        {
          "question": "两份配置文件方案里，--config 起什么作用？不写它时 Webpack 找哪个文件？",
          "answer": "--config 告诉 Webpack 这次用哪份配置：\"build\": \"webpack --config webpack.prod.js\" 用生产配置、\"dev\": \"webpack serve --config webpack.dev.js\" 用开发配置——各脚本自动用对模式，一次配好就忘。省略 --config 时 Webpack 默认找 webpack.config.js。webpack-merge（Assignment）再把两份文件的公共部分抽出来合并，重复最小化。"
        },
        {
          "question": "模板仓库解决什么痛点？怎么把一个现有仓库变成模板？",
          "answer": "痛点：Webpack 项目搭建涉及多文件、多目录与不少配置——每个新项目都要翻旧项目复制粘贴想复用的配置。做法：任何现有仓库在 Settings 里勾选 Template repository（就在改名输入框正下方）——勾上即完成；之后新建仓库时 Configuration 区的 Start with a template 下拉会列出你的模板，选中后新仓库就是模板的副本而不是空仓库。时机按官方：发现自己在多个项目间反复复用大量搭建代码时，就建一个装满搭建代码的仓库标成模板、按需更新。"
        }
      ],
      "optional": [],
      "note": "官方正文的 scripts 示例与 --config 两行已收进示例区。Assignment 仅一条（Webpack Production 指南），官方给了两条阅读边界：例子接续其更长教程但主干可跟（或直接改造自己的 Restaurant Page）；「Specify the Mode」一节可跳过。npm scripts 在 npm 课已预告「后面课程讲」——本课兑现。",
      "why": "这一课的三件事都是「一次配置、长期回本」的投入：npm scripts 让每个项目的命令入口标准化（此后任何项目 README 里写 npm run dev 就够了）；双配置让「开发体验好」与「部署产物优」不再互相打架；模板仓库把「搭一个新项目」从半小时的复制粘贴变成十秒的下拉选择。它们也都不是 Webpack 专属——scripts 与模板仓库的思路跟到任何工具链（Vite、Node、React 项目）都成立，这正是官方说的「不限于 Webpack、可以带着走的东西」。",
      "sections": [
        {
          "h": "定位：改善搭建体验与开发工作流",
          "p": [
            "官方开场先共情：Restaurant Page 干得漂亮！带着全部 loader 与 plugin 搭建、使用 Webpack 可能显得繁琐——你甚至可能还在怀疑这一切的意义。继续走下去，很多东西会变得自然，希望这些基础概念能帮你应对后面的问题。",
            "本课内容：玩过一阵 Webpack 之后，看几样能**改善搭建体验与开发工作流**的东西。官方点明：其中一些**不只适用于 Webpack**——是你随进度带得走、配别的工具也能用的东西。lesson overview 三件事：npm scripts 怎么写怎么跑；Webpack mode 是什么、怎么按需自动切换；模板仓库怎么建怎么用。"
          ]
        },
        {
          "h": "npm scripts：长命令的收纳与标准化",
          "p": [
            "npx webpack 与 npx webpack serve 敲起来不算长，但你在 Restaurant Page 的部署说明里已经见过 `git subtree push --prefix dist origin gh-pages` 这种——官方吐槽：你肯定不想每次用都手敲一遍。",
            "解法：package.json 里加 **\"scripts\"** 属性（一个装着脚本的对象），形式是 **\"名字\": \"命令\"**，终端跑 **npm run <名字>** 执行。官方示例（见示例 1）三件套：build → webpack、dev → webpack serve、deploy → git subtree push --prefix dist origin gh-pages。",
            "好处两层：**省时间**之外，命令还有了**合理且半标准化的名字**——npm run build 通常装着某工具的构建/打包/编译命令，npm run dev 通常启动开发服务器。官方补充：名字不总是相同，但它们比 npx webpack 更能解释自己的用途。",
            "一个官方点名的细节：把 webpack 与 webpack serve 设成 scripts 时，**开头的 npx 要去掉**——npx 只是为了「不经 npm scripts、直接在终端跑」它们时才需要的。"
          ]
        },
        {
          "h": "两种 mode 与两份配置",
          "p": [
            "到此为止一直用 **development** 模式——开发时它自然最合适。但**为部署构建**时，专门的 **production** 模式会做一些不同的优化。官方布置了一个一分钟实验（Try it!）：去你的 Restaurant Page 项目，把 webpack.config.js 的 mode 改成 \"production\"，重跑构建命令，看看 dist 里的 JavaScript bundle——**更加华丽的一团乱码**！",
            "官方口径（原话加粗 really）：我们**真的不需要**确切知道应用了哪些优化、也不需要知道 production 模式的任何其他细节——**知道两种模式存在、各为特定目的设计**就很好。",
            "免去手改：每次切模式都去编辑配置文件太蠢（打包进 dist 前改一次、回去用 dev server 前又改回来）。方案：**两份配置文件**（例如 webpack.dev.js 与 webpack.prod.js），build 与 dev 两个 npm script 各自用 **--config** 指定用哪份（见示例 2）——省略 --config 时 Webpack 默认找 webpack.config.js。",
            "官方预告 Assignment：会介绍 **webpack-merge** 工具，让多份 Webpack 配置文件更易管理、重复最小化。这种方式的好处：设置一次，然后就可以忘掉它——每个脚本自动用对的配置文件与模式。"
          ]
        },
        {
          "h": "模板仓库：把「搭项目」变成十秒的事",
          "p": [
            "你可能已经注意到：搭建 Webpack 涉及多个文件与目录、还有相当多配置。每个新项目都要搭一遍时，你多半得翻出以前的配置**复制粘贴**想复用的部分。",
            "GitHub 早有入口：新建仓库时 **Configuration** 区有个 **Start with a template** 选项。**模板仓库**由此而来：你的任何现有仓库都能在 **Settings** 里转成模板——就在「改仓库名」输入框正下方，有个「该仓库是否为模板」的勾选框。勾上，恭喜，**这就是全部所需操作**。",
            "之后新建仓库时，Start with a template 下拉会列出你的模板供选择——选中后**新仓库就是所选模板的副本**，而不是空仓库。",
            "官方给的使用哲学很务实：你可能并不确定模板里该放什么——**当发现自己为多个项目反复复用大量搭建代码时**，就建一个装齐那些搭建代码的新仓库、标成模板、按需更新它。建新项目仓库时选中这个模板，省下时间，更快潜入项目本身。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "json",
          "code": "{\n  // ... package.json 的其他内容 ...\n  \"scripts\": {\n    \"build\": \"webpack\",\n    \"dev\": \"webpack serve\",\n    \"deploy\": \"git subtree push --prefix dist origin gh-pages\"\n  }\n  // ... package.json 的其他内容 ...\n}",
          "note": "官方 scripts 示例原样（注释是 JSON 里本不合法的示意，官方原文如此）：npm run build 等价 npx webpack、npm run dev 等价 npx webpack serve、npm run deploy 替你敲那条部署长命令。注意命令里没有 npx 前缀。"
        },
        {
          "lang": "json",
          "code": "\"build\": \"webpack --config webpack.prod.js\",\n\"dev\": \"webpack serve --config webpack.dev.js\"",
          "note": "官方双配置示例原样：build 脚本用生产配置（production 模式的优化），dev 脚本用开发配置（source map、dev server）——一次配好，各跑各的，不再手改 mode。不写 --config 时 Webpack 默认找 webpack.config.js。"
        }
      ],
      "pitfalls": [
        {
          "title": "scripts 里的命令带着 npx",
          "text": "\"build\": \"npx webpack\" 也能跑，但 npx 是「直接在终端找并跑包命令」的启动器——npm run 本身就会把 node_modules/.bin 加进 PATH，scripts 里直接写 webpack 即可（官方点名的细节）。带着 npx 多绕一层，偶尔还会在 npx 的「要不要安装」询问上卡住。"
        },
        {
          "title": "部署前忘了切 production 模式",
          "text": "development 产物没做部署优化（体积大、带开发工具代码）。双配置方案正是防这个：build 脚本焊死 --config webpack.prod.js，部署构建永远走生产配置——比「记得手改 mode」可靠得多。"
        },
        {
          "title": "改了配置文件但 dev server 行为没变",
          "text": "上一课提示块的老规矩仍然成立：webpack-dev-server 只在启动时读一次配置——改了 webpack.dev.js 要 Ctrl+C 重启 npx webpack serve（或 npm run dev）才生效。"
        },
        {
          "title": "模板仓库装进了项目专属内容",
          "text": "模板该装的是「每个项目都一样的搭建代码」：scripts 骨架、双配置、template.html、.gitignore——而不是某个项目的业务代码或 node_modules。模板越干净，副本起步越快；官方口径也是「把需要的搭建代码放进去、按需更新」。"
        }
      ],
      "official": {
        "assignment": [
          "通读 Webpack 官方的 Production 指南：它带你走一遍怎么用 webpack-merge 与拆分配置文件。官方提示：指南用的代码例子接续它自己更长教程的前文，但关于 webpack-merge 与拆分配置文件的主要部分用一个新项目也能跟下来——或者干脆把你的 Restaurant Page 项目改造成这种方式试试。其中「Specify the Mode」一节及其例子可以跳过。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/organizing_your_javascript_code/revisiting_webpack.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "000954bc472c66f4659b61e3cc6cf4816d1454833457723911381b83a045b815",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-javascript-json",
      "title": "JSON",
      "zh": "JSON",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-json",
      "summary": "JSON（JavaScript Object Notation）是结构化的数据标准格式，语法大量借鉴 JavaScript 对象——与外部服务器或 API 打交道时你会不断遇到它，它本质上就是 Web 上传输数据的通用格式。官方明说这一课要学的东西不多（10–15 分钟过完资料即可），单独立课是因为一些格式规则不知道就容易困惑。两个最常用的方法：JSON.parse()（文本 → 对象）与 JSON.stringify()（对象 → 文本）。",
      "guide": "以下是官方原课的中文化梳理。这是一节短课，官方自己定了调子：要学的东西不多，花时间是因为「格式规则会造成困惑」——所以本课的正确打开方式是把 Assignment 三份资料认真过一遍（MDN 的 JSON 教程官方原话「可能就是你需要的全部」、两个最常用方法 JSON.parse 与 JSON.stringify 的文档、一个在线格式检查工具），而不是在本站正文里停留太久。JSON 在本章后面马上有用武之地：下一课 Todo List 项目的 localStorage 持久化就是「对象 ↔ JSON 文本」的来回转换（官方在那一课明说 localStorage 用 JSON 存取、且 JSON 里存不了函数）；再往后的 API 课程里，服务器发来的数据也几乎全是 JSON。格式规则的权威细节以 MDN 教程为准，本站正文只把「它是什么、为什么重要、两个方法怎么用」讲清。",
      "understand": [
        "JSON = JavaScript Object Notation：一种**标准化的数据组织格式**，语法大量基于 JavaScript 对象的写法",
        "使用场景：与外部服务器或 API 打交道时经常遇到 JSON 格式的数据——它本质上是 **Web 上传输数据的通用格式**",
        "官方对学习量的定调：要学的不多——单独立课是因为**一些格式规则不知道就容易困惑**；花 10–15 分钟过完指定资料就够上路",
        "JSON 文本与 JS 对象是两种形态：传输与存储时是**文本**（字符串），使用时是**对象**——两种形态之间靠两个方法转换",
        "JSON.parse()：把 JSON 格式的**文本解析成 JavaScript 对象**（服务器发来的数据、localStorage 读出的数据都要过它）",
        "JSON.stringify()：把 JavaScript 对象**序列化成 JSON 文本**（发给服务器、存进 localStorage 之前都要过它）",
        "格式错误是常见错误源（官方点名）：Mis-formatted JSON 很常见，Assignment 给了在线格式化工具（粘贴 JSON 帮你找格式错误）排查",
        "前瞻（下一课 Todo List 的官方明文）：localStorage 用 JSON 存取数据——**JSON 里不能存函数**，从存储读回对象后方法要靠你自己想办法装回去"
      ],
      "terms": [
        {
          "en": "JSON (JavaScript Object Notation)",
          "zh": "结构化数据的标准格式：语法基于 JS 对象写法，是 Web 数据传输的通用格式——本质是文本"
        },
        {
          "en": "JSON.parse()",
          "zh": "解析：JSON 文本 → JavaScript 对象（收到数据用）"
        },
        {
          "en": "JSON.stringify()",
          "zh": "序列化：JavaScript 对象 → JSON 文本（发送/存储数据用）"
        },
        {
          "en": "Mis-formatted JSON",
          "zh": "格式错误的 JSON：常见错误源——官方给了在线格式检查工具排查（粘贴进去帮你找出格式问题）"
        }
      ],
      "tasks": [
        "读 MDN 的 JSON 教程（Assignment 第 1 条，有官方中文版）：官方原话「可能就是你需要的全部」——格式规则、与 JS 对象语法的异同、常见坑都在里面",
        "读 JSON.parse() 与 JSON.stringify() 两个方法的文档（Assignment 第 2 条，W3Schools）： dealing with JSON 时最常用的就这两个方法",
        "收藏 JSON formatter 在线工具（Assignment 第 3 条）：格式错误的 JSON 是常见错误源——把可疑 JSON 粘进去，它帮你搜出格式问题",
        "一分钟自测：在浏览器控制台跑 JSON.stringify({ name: \"odin\", ready: true }) 看输出文本，再把输出粘进 JSON.parse() 看还原的对象——两个方向的转换亲手各来一次"
      ],
      "quiz": [
        {
          "question": "JSON 是什么？为什么说它是「Web 上传输数据的通用格式」？",
          "answer": "JSON（JavaScript Object Notation）是一种标准化的数据组织格式，语法大量基于 JavaScript 对象。与外部服务器或 API 工作时你会经常遇到 JSON 格式的数据——它不依赖任何具体语言或框架，纯文本、人机都可读，因此成为 Web 数据传输事实上的通用格式（尽管名字里带 JavaScript）。"
        },
        {
          "question": "JSON.parse 与 JSON.stringify 各干什么？各配一个真实场景。",
          "answer": "parse：JSON 文本 → JS 对象——场景：fetch 拿到服务器响应文本后解析出可用的数据对象；或从 localStorage 读出字符串还原成对象。stringify：JS 对象 → JSON 文本——场景：把数据存进 localStorage 之前（它只存字符串）；或把对象序列化成文本发给服务器。记忆锚点：parse 是「拆开读」，stringify 是「打成字符串」。"
        },
        {
          "question": "官方说「JSON 里不能存函数」——这对下一课 Todo List 的 localStorage 持久化意味着什么？",
          "answer": "localStorage 用 JSON 存取数据：存之前 stringify 会把对象里的函数（方法）丢掉，读回来 parse 得到的是「只有数据的纯对象」。所以带方法的 todo 对象持久化时要拆开处理：存纯数据，读回后再想办法把方法装回去（例如用工厂函数/构造器拿数据重新造对象——下一课官方原话「你得自己想明白怎么把方法加回对象属性，祝好运」）。"
        }
      ],
      "optional": [],
      "note": "短课（官方正文只有引言两段 + Lesson overview + Assignment 三条）：官方明文「要学的不多，10–15 分钟过完资料即可」——本站正文按此定位保持轻量，格式规则细节以 Assignment 的 MDN 教程为准，不另行展开。课虽短，JSON 往返模型却是下一课 Todo List 持久化的地基——parse 与 stringify 的方向别记反。",
      "why": "JSON 是前后端与存储的「通用语」：API 课程里服务器发来的天气数据是 JSON、Todo List 的 localStorage 持久化是 JSON 文本、package.json 你从 Webpack 课起就一直在读。这一课便宜（15 分钟）但回报贯穿整个课程后半段——尤其「JSON 里没有函数」这条，是下一课持久化架构的直接约束，现在记住它，到时候就不会对着「读回来的对象方法全没了」发懵。",
      "sections": [
        {
          "h": "JSON 是什么：Web 的通用数据格式",
          "p": [
            "**JSON（JavaScript Object Notation）是一种用于组织数据的标准化格式**，语法大量基于 JavaScript 对象。",
            "使用场景官方一句话讲透：**与外部服务器或 API 打交道时，你会经常遇到 JSON 格式的数据**——它本质上是 **Web 上传输数据的通用格式**。",
            "理解的关键是「两种形态」：传输与存储时 JSON 是**文本**（一段字符串，长得像 JS 对象的写法）；使用时才解析成 JavaScript **对象**。两种形态之间的转换就是下面那两个方法的事。"
          ]
        },
        {
          "h": "官方的学习量定调：10–15 分钟",
          "p": [
            "官方第二段很坦诚：**幸好这里要学的东西不多**。之所以单独立一课，只是因为**一些格式规则如果你不知道，就会造成困惑**。",
            "官方给的路线：花 **10–15 分钟**过一遍下面的资料，你就 ready 了。所以本课的重心在 Assignment：MDN 教程（官方原话「可能就是你需要的全部」）+ 两个方法文档 + 一个格式检查工具——格式规则的权威细节都在 MDN 教程里，本站不重复展开。",
            "官方还点名了一个实务事实：**格式错误的 JSON（mis-formatted JSON）是常见错误源**——所以给了那个在线 formatter：把 JSON 粘进去，它替你搜出格式问题。排「服务器明明返回了数据却 parse 报错」这类问题时，先粘进去验一遍格式是标准动作。"
          ]
        },
        {
          "h": "两个最常用的方法：parse 与 stringify",
          "p": [
            "官方 Assignment 的原话：处理 JSON 时你最常用的两个 JavaScript 方法——**JSON.parse()** 与 **JSON.stringify()**。",
            "方向记清：**stringify 是「对象 → JSON 文本」**（序列化：发给服务器、存进 localStorage 之前）；**parse 是「JSON 文本 → 对象」**（解析：收到服务器响应、从 localStorage 读出之后）。示例 1 是两方向的最小演示。",
            "前瞻下一课（官方在 Todo List 项目里的明文）：localStorage 就是用 JSON 存取数据的——读回来的数据也是 JSON 格式；且 **JSON 里不能存函数**，从存储取回后「怎么把方法装回对象」要你自己想办法。带着这条约束去做 Todo List，持久化的架构就不会走弯路。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "// 对象 → JSON 文本（存储/发送前）\nconst book = { title: \"The Hobbit\", author: \"J.R.R. Tolkien\", pages: 295, read: false };\nconst text = JSON.stringify(book);\nconsole.log(text); // '{\"title\":\"The Hobbit\",\"author\":\"J.R.R. Tolkien\",\"pages\":295,\"read\":false}'\n// ——注意：是字符串（键都带上了双引号），localStorage 与网络传输认的就是它\n\n// JSON 文本 → 对象（收到/读出后）\nconst revived = JSON.parse(text);\nconsole.log(revived.title); // \"The Hobbit\"——又是可用的对象了\n\n// 边界演示（本站补充）：函数进不了 JSON\nconst withFn = { title: \"x\", info() { return this.title; } };\nconsole.log(JSON.stringify(withFn)); // '{\"title\":\"x\"}' ——info 方法被丢掉了\n// 这就是 Todo List 课「读回后要把方法装回去」问题的出处",
          "note": "本站示意代码：两方向转换各一行；最后一段演示官方在下一课点名的约束——JSON.stringify 会把函数属性直接丢掉。MDN 教程（Assignment 第 1 条，有中文版）覆盖格式规则全貌。"
        }
      ],
      "pitfalls": [
        {
          "title": "拿 JS 对象语法的直觉写 JSON",
          "text": "JSON 长得像 JS 对象但不是 JS：官方立课的原因就是「格式规则不知道会困惑」——哪些写法在 JS 合法、放进 JSON 就非法（单引号、尾逗号、注释、函数等），以 MDN 教程的规则清单为准；可疑文本先粘进 Assignment 给的 formatter 验一遍。"
        },
        {
          "title": "parse/stringify 方向记反",
          "text": "对着一段 JSON 文本调 stringify（把字符串又包了一层引号）、或对对象调 parse（直接报错）都是方向反了。锚点：带「string」的那个产出字符串；带「parse」的那个消费字符串。"
        },
        {
          "title": "以为存进 localStorage 的对象读回来还带方法",
          "text": "localStorage 走 JSON：stringify 时函数属性被静默丢掉，parse 回来只剩纯数据。带方法的对象（如 Book 实例、todo 对象）持久化都要「存数据、读回后重建对象」——下一课 Todo List 的官方明文考点。"
        }
      ],
      "official": {
        "assignment": [
          "MDN 的 JSON 教程可能就是你需要的全部……（官方原话如此）。",
          "读处理 JSON 时最常用的两个 JavaScript 方法的资料：JSON.parse() 与 JSON.stringify()（官方给的是 W3Schools 的两页）。",
          "格式错误的 JSON 是常见错误源：JSON formatter 网站让你粘进 JSON 代码、替你搜出格式错误。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/organizing_your_javascript_code/json.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "933aed5db61bce921a04121b28fdd66bc012c897e706601323b500e6c32bb73a",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-javascript-oop-principles",
      "title": "OOP Principles",
      "zh": "OOP 原则",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-oop-principles",
      "summary": "整个「组织 JavaScript 代码」系列都在讲 OOP 范式：造对象与类的语法相对简单，难的是**决策**——什么放进对象、什么时候造新对象、什么时候让一个对象继承另一个。本课给出做决策的两条核心原则：单一职责原则（一个类/对象/模块只应有**一个**职责——它做的一切都属于同一职责；换个说法：只应有**一个变更理由**；SOLID 五原则之首）与松耦合（对象尽量能独立站住——紧耦合对象互相依赖到「改一个就得完全重写另一个」；游戏例子：想彻底改 UI 不该需要重写游戏逻辑）。官方提醒：这些是有帮助的**指导原则，不是规则**——应用设计问题通常没有非常清晰的答案。",
      "guide": "以下是官方原课的中文化梳理。这一课没有新语法——它是整个章节的「收心课」：工厂、类、模块都会写之后，官方把问题升级到「怎么用好它们」。正文两块：单一职责原则（官方用 isGameOver 函数做了两段式修正示范：第一步把 DOM 操纵抽进独立模块，第二步更进一步——isGameOver 只负责**判断**并返回结果，「要不要显示游戏结束画面」的决策交给游戏循环的调用方）与松耦合（还是那个游戏：先用 console.log 把游戏逻辑写完，之后加一堆 DOM 函数而不碰逻辑——UI 与逻辑互为防火墙）。官方反复校准预期：设计问题通常没有清晰答案，原则是 guidelines 不是 rules；读资料时回头对照自己做过的项目会更有收获。Assignment 四份资料里 SRP 是官方点名「五原则里最相关的」，composition over inheritance（概览第 4 条）由 FunFunFunction 那支视频承担——看之前先回想工厂函数课的组合一节，视频会把「为什么组合通常优于继承」讲透。",
      "understand": [
        "官方定位：你已经学过并练过最常见的对象创建与组织模式——但那只是**冰山一角**；比学工厂函数或模块的语法更重要的，是**搞清楚怎么有效地使用它们**",
        "整个系列课都在讲「面向对象编程」（OOP）范式：造对象与类的基础相对直白；**不直白的是决策**——什么放进每个对象、什么时候造新对象、什么时候让一个对象「继承」另一个",
        "预期校准（官方原话）：应用设计问题通常**没有非常清晰的答案**——有些模式与想法明显优于另一些，但「某个函数放哪」常有取舍；**这些原则不是规则（rules），是有帮助的指导原则（guidelines）**",
        "官方给的学习方法：读资料时回头翻自己做过的项目，想想你写的东西与看到的例子相比如何；往后做新项目时也一直带着这些考量",
        "**单一职责原则（SRP）**：一个类（或对象、或模块……你懂这个意思）应当只有**一个**职责——不是说对象只能做一件事，而是它做的**每件事都应属于同一个职责**",
        "SRP 最常见例子（官方原话 really good idea）：把 **DOM 相关的东西与应用逻辑分开**——大多数代码里既有更新/写 DOM 的函数又有应用逻辑，混在一起就是职责混杂",
        "官方 isGameOver 两段式修正：原函数在「判断游戏结束」里直接建 div、加 class、写 textContent、appendChild——问题一，函数（及它所在的模块）不该直接操纵 DOM，应把全部 DOM 操纵抽进自己的模块（改成调 DOMStuff.gameOver(this.winner)）；问题二，抽完还不够——isGameOver 应**只负责检查 gameOver 条件是否满足**，由处理游戏循环的函数**根据其返回值**决定是否调用 DOMStuff.gameOver",
        "SRP 的另一种表述（官方给的思维工具）：一个方法/类/组件应当只有**一个变更理由**——对象背多个职责时，改一个方面可能波及另一个",
        "SRP 是常见的 5 条设计原则集 **SOLID** 的第一条；其余四条 Assignment 文章与视频里读（官方口径：SRP 肯定是五条里最相关的，其余愿意深挖随意）",
        "**松耦合**：所有对象当然要协作构成最终应用，但要让**单个对象尽可能独立站住**；**紧耦合（tightly coupled）**对象 = 互相依赖到「移除或改动一个就意味着必须完全改掉另一个」——官方原话：real bummer",
        "松耦合与 SRP 强相关但角度不同（官方例子）：写游戏时想彻底改变 UI 的工作方式，应该**不需要完全重做游戏逻辑**——应当能先用 console.log 为主把游戏写出来，之后加一堆 DOM 函数而**不碰游戏逻辑**",
        "概览第 4 条「理解为什么组合通常优于继承」由 Assignment 的 FunFunFunction 视频承担——与工厂函数课「组合」一节直接衔接：有的问题适合继承，但继承可能很脆（brittle），组合的灵活性常常更合适"
      ],
      "terms": [
        {
          "en": "Single Responsibility Principle (SRP)",
          "zh": "单一职责原则：一个类/对象/模块只应有一个职责——它做的一切都服务于同一职责；等价表述：只有一个变更理由"
        },
        {
          "en": "SOLID",
          "zh": "五条对象设计原则的首字母集——SRP 是第一条（官方：五条里最相关的一条），其余在 Assignment 资料里展开"
        },
        {
          "en": "Tightly coupled",
          "zh": "紧耦合：对象互相依赖到改一个就得完全重写另一个——要避开的状态"
        },
        {
          "en": "Loosely coupled",
          "zh": "松耦合：对象尽可能独立站住、经由明确接口协作——换掉 UI 不必重写逻辑"
        },
        {
          "en": "Composition over inheritance",
          "zh": "组合优于继承：拼装小对象常比继承树更灵活、更不脆——工厂函数课「组合」一节的原则化表述"
        },
        {
          "en": "Application logic vs DOM stuff",
          "zh": "应用逻辑与 DOM 操作的分离：SRP 在前端最常见的落点——逻辑模块算出结果，DOM 模块负责呈现"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：重点吃透 isGameOver 的两段式修正（第一段抽 DOM、第二段还决策权）",
        "读 Medium 的 SOLID principle #1: Single responsibility (JavaScript) 一文（Assignment 第 1.1 条）：它把下面 SOLID 视频里更详细的内容做了简化——官方口径：SRP 是五条里最相关的，其余四条愿意深挖随意",
        "看 The SOLID Design Principles by WDS 视频播放列表（Assignment 第 1.2 条）：每条原则的代码示例（视频不声称有中文字幕）",
        "读 How to Write Highly Scalable and Maintainable JavaScript: Coupling（Assignment 第 2 条，web.archive.org 存档）：官方评价它把松耦合讲得相当好",
        "看 FunFunFunction 的 Composition over inheritance 视频（Assignment 第 3 条，官方评价 great）：看之前先回想工厂函数课的「组合」一节——「为什么组合通常优于继承」由它讲透（视频不声称有中文字幕）",
        "官方推荐的方法：翻回你做过的 Library / Tic Tac Toe / Restaurant Page，逐个对照 SRP 与松耦合——哪个函数背了两个职责？哪两个模块紧耦合到动一个就得动另一个？想清楚就行，不必回头重构"
      ],
      "quiz": [
        {
          "question": "单一职责原则说「一个对象只应有一个职责」——官方紧接着澄清了什么误解？",
          "answer": "官方原话：这**不意味着对象只能做一件事**——而是它做的**每件事都应属于同一个职责**。一个游戏对象可以有很多方法（落子、判胜负、重置），只要它们都服务于「这局游戏的状态与规则」这一个职责；一旦它还顺手管起了画面渲染，就是两个职责了。等价表述：一个方法/类/组件应当只有一个**变更理由**——职责多了，改 A 可能波及 B。"
        },
        {
          "question": "官方 isGameOver 例子的两段式修正分别修了什么？第二段为什么更进一层？",
          "answer": "第一段：原函数在判断逻辑里直接 createElement/appendChild 操纵 DOM——把全部 DOM 操纵抽进独立模块，函数里只剩 DOMStuff.gameOver(this.winner) 一句调用（逻辑与呈现分家）。第二段更进一层：抽完之后 isGameOver 仍然**决定**了「何时显示结束画面」——它应当**只负责检查条件并返回结果**，由游戏循环的调用方根据返回值决定要不要调 DOMStuff.gameOver。第一刀分开「怎么做」，第二刀分开「做不做」——决策权归还调用方，isGameOver 才真的只剩一个职责（判断）且只剩一个变更理由。"
        },
        {
          "question": "什么是紧耦合对象？官方用什么例子说明松耦合的好处？",
          "answer": "紧耦合 = 对象互相依赖到「移除或改变其中一个，就意味着你必须完全改变另一个」。官方的游戏例子：想彻底改变 UI 的工作方式时，应该不需要完全重做游戏逻辑——具体做法是先用 console.log 为主把游戏逻辑写出来跑通，之后加一堆 DOM 函数呈现界面，全程不碰逻辑代码。（这正是井字棋项目「控制台先行」要求背后的原则。）"
        },
        {
          "question": "官方说这些原则「不是规则」——这个校准对你做设计决策意味着什么？",
          "answer": "意味着别把它们当红绿灯用：应用设计问题通常没有非常清晰的答案，有些模式明显更好，但「某个函数到底放哪」常常存在取舍（trade-off）。原则的作用是**帮你在取舍时知道在权衡什么**（这个对象的变更理由有几个？这两个模块是不是动一个就得动另一个？），而不是给每个问题一个标准答案——官方原话：它们是有帮助的指导原则（helpful guidelines）。"
        },
        {
          "question": "「组合通常优于继承」与工厂函数课的哪一节直接衔接？为什么继承可能「脆」？",
          "answer": "衔接工厂函数课的「组合」一节：createPlayer 从 createUser 的产物里解构出需要的函数、拼装自己的返回对象。「脆」（brittle）指继承树的刚性：子类全盘接受父类，父类一改全体子类跟着变、层级一深就难拆；组合按需拼装——不想要的部分根本不出现在新对象里，来源对象各自独立演化。官方口径：有的问题天然适合继承，但组合的灵活性常常更对症（FunFunFunction 视频是这条概览的指定资料）。"
        }
      ],
      "optional": [],
      "note": "本课官方正文只详展 lesson overview 四条中的前三条；第 4 条「理解为什么组合通常优于继承」由 Assignment 的 FunFunFunction 视频承担，本站在理解点与自测题里回指工厂函数课的组合一节如实转述。isGameOver 两段代码为官方原码（收进示例区）。Assignment 的 Medium 文章按本站对 Medium 的既有核验经验处理（403 反爬则如实登记受限）；Coupling 一文官方给的就是 web.archive.org 存档地址。",
      "why": "这一课是「会语法」到「会设计」的分水岭，也是本章三个项目经验的结晶时刻：Library 的「数据层与显示层分离」、井字棋的「控制台先行」、餐厅页的「tab 模块与 index.js 协调者」——你已经在无意识地实践 SRP 与松耦合，本课给它们正式命名。往后读任何代码库、做任何架构决策，「这个模块有几个变更理由」「这两个对象是不是紧耦合」这两问就是随身的尺子。官方把它放在 Todo List 之前，正是要你带着这把尺子去做那个自由度最大的项目。",
      "sections": [
        {
          "h": "定位：语法是冰山一角，决策才是重点",
          "p": [
            "官方开场盘点：到此你已经学过、也有机会练过 JavaScript 里最常见的对象创建与组织模式（构造器、工厂、类、模块）。**但那只是冰山的一角（tip of the iceberg）**——比学工厂函数或模块的**语法**更重要的，是搞清楚怎么**有效地使用**它们。",
            "这一整个系列课都在讲「面向对象编程」（OOP）范式。官方把难易分界说得很清楚：**创建对象与类的基础相对直白；不直白的是决策**——什么放进每个对象？什么时候造新对象？什么时候让一个对象「继承」另一个？",
            "幸好有一组概念与原则能指导我们把决策做好，本课介绍其中最重要的几个。但官方先把预期校准到位（原话值得整段记住）：你的应用设计问题**通常没有非常清晰的答案**——有些模式与想法明显优于另一些，但决定「某个函数放哪」时**常存在取舍**。换句话说……**这些原则不是规则（rules）——它们是有帮助的指导原则（guidelines）**。",
            "官方还给了一条学习方法：读这些资料时，**回头翻翻你已经做过的项目**，想想你写的东西与看到的例子相比如何；往后做新项目时，也一直把这些放在心里。"
          ]
        },
        {
          "h": "单一职责原则：一个职责、一个变更理由",
          "p": [
            "**单一职责原则（Single Responsibility Principle）**：一个类（或对象、或模块……官方原话 you get the point）应当只有**一个**职责。官方紧接着澄清误解：**这不是说对象只能做一件事**——而是它做的**每件事都应是同一个职责的一部分**。",
            "官方给的「非常常见」例子：我们的代码里，除了应用逻辑，大多还有更新与写入 DOM 的函数——**把 DOM 的东西与应用逻辑分开**是个 really good idea。示范函数 isGameOver：它本该检查游戏结束条件，却在 if 分支里直接 createElement 建 div、classList.add、写 textContent、appendChild 上页面（原码见示例 1）。",
            "官方指出**两个问题**。**问题一**：这个函数（及它所在的模块）**不该是直接操纵 DOM 的那个**——应把全部 DOM 操纵抽进它自己的模块，函数里改成一句 `DOMStuff.gameOver(this.winner);`（修正一，见示例 2）。",
            "**问题二**（抽完还剩的）：isGameOver 应当**只负责检查 gameOver 条件是否满足**——基于它的**返回值**，由**处理游戏循环的那个函数**负责决定要不要调用 DOMStuff.gameOver(this.winner)。判断与决策分家，isGameOver 的职责才真的单一。",
            "官方再给一个思维工具：**单一职责的另一种想法是——一个方法/类/组件应当只有单一的一个变更理由**。反过来：对象背着多个职责时，改一个方面就可能波及另一个。",
            "定位：SRP 是常见的 5 条设计原则集 **SOLID** 的第一条；其余四条在 Assignment 的文章与视频里读（官方口径：SRP 肯定是五条里与我们最相关的，其余愿意深挖随意）。"
          ]
        },
        {
          "h": "松耦合：让对象能独立站住",
          "p": [
            "显然，所有对象最终要协作构成应用。但官方提醒：要小心让**单个对象尽可能独立站住（stand alone）**。**紧耦合（tightly coupled）对象**指的是：互相依赖得太重，以至于**移除或改变一个，就意味着你得完全改变另一个**——官方原话：real bummer（真是够呛）。",
            "官方点明这条与 SRP **强相关但角度不同**：SRP 看「一个对象内部的职责纯度」，耦合看「对象之间的依赖强度」。",
            "例子还是游戏（官方原话）：如果我们在写一个游戏、想**彻底改变 UI 的工作方式**，我们应当能做到这一点而**不用完全重做游戏逻辑**。所以应当能先主要用 console.log 把游戏写出来，**之后**再加进一堆 DOM 函数——**全程不碰游戏逻辑**。",
            "对照回看：井字棋项目的「控制台先行」、餐厅页的「tab 模块互不认识」、Library 的「数据与显示分离」——你已经在按这条原则干活了，现在它有了名字。"
          ]
        },
        {
          "h": "Assignment 导读：SOLID、Coupling 与组合优于继承",
          "p": [
            "四份资料的分工：**① Medium 的 SRP 专文**（SOLID principle #1: Single responsibility (JavaScript)）——官方说它把下面视频里更详细的内容做了简化，适合先读；**② WDS 的 SOLID 视频播放列表**——五条原则逐条代码示例；**③ Coupling 一文**（How to Write Highly Scalable and Maintainable JavaScript: Coupling，web.archive.org 存档）——官方评价「把松耦合对象讲得相当好」；**④ FunFunFunction 的组合优于继承视频**——官方评价 great。",
            "第 ④ 份对应 lesson overview 的第 4 条「理解为什么**组合通常优于继承**」：官方正文没有展开这条（正文只详写了 SRP 与耦合），指定的展开就在这支视频里——它与工厂函数课「组合」一节直接衔接：有的问题天然适合继承，但继承可能很脆，组合的灵活性常常更合适（原话在工厂课，本课概览把它升格为设计原则）。",
            "看资料时执行官方给的方法：翻回你做过的 Library / Tic Tac Toe / Restaurant Page 对照——哪个函数背了两个职责？哪两个模块紧耦合？想清楚即可，不必回头重构。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "// 官方反例原码：一个函数背了两个职责\nfunction isGameOver() {\n\n  // game over logic goes here!\n\n  if (gameOver) {\n    const gameOverDiv = document.createElement('div');\n    gameOverDiv.classList.add('game-over');\n    gameOverDiv.textContent = `${this.winner} won the game!`;\n    document.body.appendChild(gameOverDiv);\n  }\n}",
          "note": "官方 isGameOver 反例原码：判断游戏结束（应用逻辑）与建 div 上页面（DOM 呈现）挤在同一个函数里——两个职责、两个变更理由。官方点名两个问题：函数不该直接操纵 DOM；且「要不要显示」的决策也不该在这里。"
        },
        {
          "lang": "javascript",
          "code": "// 官方修正一原码：DOM 操纵抽进独立模块\nfunction isGameOver() {\n\n  // game over logic goes here!\n\n  if (gameOver){\n    DOMStuff.gameOver(this.winner);   // 呈现的事交给专职模块\n  }\n}\n\n// 官方修正二（文字描述）：isGameOver 只负责检查条件并返回结果——\n// 由处理游戏循环的函数根据其返回值决定是否调用 DOMStuff.gameOver(winner)。\n// 示意（本站按官方描述补全形态）：\n// function isGameOver() { /* 只做判定 */ return gameOver; }\n// if (isGameOver()) DOMStuff.gameOver(winner);   // ← 决策在调用方",
          "note": "修正一是官方原码；修正二官方只有文字描述（本站按其描述补了示意形态并标明）。两段合起来是 SRP 的完整示范：第一刀把「怎么呈现」抽走，第二刀把「要不要呈现」的决策权还给调用方——isGameOver 只剩一个职责、一个变更理由。"
        }
      ],
      "pitfalls": [
        {
          "title": "把 SRP 读成「一个对象只能有一个方法」",
          "text": "官方亲自澄清的误解：SRP 不是「只能做一件事」，而是「做的每件事属于同一个职责」。游戏对象可以有落子、判胜负、重置一堆方法——只要都服务于「这局游戏」；判胜负的函数顺手渲染画面，才叫越界。"
        },
        {
          "title": "逻辑函数里直接操作 DOM",
          "text": "官方点名的「非常常见」职责混杂：判定、计算类函数里出现 createElement/appendChild。修法两段式：先把 DOM 操纵抽进专职模块，再把「要不要触发呈现」的决策交给调用方——只做判定、返回结果。"
        },
        {
          "title": "把原则当规则用，为「纯度」过度拆分",
          "text": "官方校准过：设计问题通常没有清晰答案、常有取舍——原则是 guidelines 不是 rules。为 SRP 把三行逻辑拆成五个文件、为松耦合给一切加抽象层，是用教条换掉判断力；「几个变更理由、动了谁疼」两问够用就好。"
        },
        {
          "title": "UI 与逻辑互相渗透后想换 UI",
          "text": "紧耦合的代价在「大改」时一次性爆发：逻辑里到处是 DOM 调用，想换套 UI 就得完全重写逻辑（官方：real bummer）。预防就是井字棋的控制台先行：逻辑层先脱离 UI 跑通，呈现层后加、可整体替换。"
        }
      ],
      "official": {
        "assignment": [
          "下面的文章与视频在讲单一职责之前会先提到 SOLID 这个首字母缩写。单一职责肯定是五条里最相关的，其余 SOLID 原则愿意深挖随意。① 读这篇 SOLID principle #1: Single responsibility (JavaScript) 文章（Medium）——它把下面 SOLID 视频里更详细的内容做了简化。② 看 The SOLID Design Principles by WDS 播放列表——每条原则的代码示例。",
          "读 How to Write Highly Scalable and Maintainable JavaScript: Coupling（官方给的是 web.archive.org 存档地址）——它把松耦合对象讲得相当好。",
          "FunFunFunction 有一支很棒的视频：favoring composition over inheritance（组合优于继承）。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/organizing_your_javascript_code/oop_principles.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "ef33ff3e68ef401ace263f8372ec62fadb9df0040d7fb9fbd19d1553848e7cc4",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-javascript-todo-list",
      "title": "Project: Todo List",
      "zh": "项目：待办清单",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-todo-list",
      "summary": "「组织 JavaScript 代码」章节的收官项目：一个带项目分组的待办清单应用——todo 是动态创建的对象（工厂或构造器/类自选）、至少含 title/description/dueDate/priority 四个属性、按 projects 分组（打开应用有默认项目）、应用逻辑与 DOM 严格分模块（OOP 原则课的实地考核）、UI 具备看项目/看列表/展开编辑/删除四种能力，最后用 localStorage（Web Storage API）做持久化——官方点名「JSON 里存不了函数，读回后怎么把方法装回对象你自己想」。本站只提供要求中文化、拆解与验收清单，不提供成品代码。",
      "guide": "以下是官方项目要求的中文化与拆解。官方给这个项目的定位是「把这一系列技术拧在一起的收官之作」——工厂/类、模块、npm 库、DOM、OOP 原则、JSON 与 localStorage 全部上场，而且刻意让你先停下来想组织方式再动手（官方原话：动代码之前，花一分钟想想你打算怎么组织项目）。推进建议按官方任务顺序：先定 todo 的数据形状（属性头脑风暴）→ 搭 projects 分组结构 → 分模块写逻辑与 DOM → 做四个 UI 能力 → 加持久化。三个官方重点提示别错过：逻辑与 DOM 分模块是硬性要求（OOP 原则课的直接考核）；三个 todo 应用（Todoist / Things / any.do）是官方指定灵感来源，看截图与介绍视频；localStorage 持久化的三个 tip（数据不在别崩、DevTools Application 面板看存储、JSON 存不了函数）每一个都是前人翻过的车。date-fns 是官方推荐的日期库（「你多半已经在用 webpack，从 npm 加外部库小菜一碟」）。按本站红线，本页不提供任何成品代码。",
      "understand": [
        "项目定位（官方开场）：这一系列给了你大量信息——继续前进前放慢脚步，用一个大项目把各种技术**拧在一起**；你应当有机会展示新学的大部分（如果不是全部）技能",
        "官方对 todo 应用的定调：它是入门 Web 开发教程的**常客**（staple），实现可以很基础——但改进空间巨大、可加的功能很多",
        "官方要求动手前先想：diving into the code 之前，花一分钟想清楚**你打算怎么组织项目**",
        "todo 是动态创建的对象：意味着用**工厂函数或构造器/类**来生成它们（官方给了两条路、不指定）",
        "属性头脑风暴（官方任务 2）：至少 title、description、dueDate、priority 四个；可以再加 notes 甚至 checklist",
        "projects 分组（官方任务 3）：todo list 应当有 projects（或者说分开的 todo 清单）；用户第一次打开应用时应有一个「默认」项目收纳所有 todo；用户能创建新项目、并选择自己的 todo 进哪个项目",
        "架构硬要求（官方任务 4）：**应用逻辑**（创建新 todo、标记完成、改优先级等）与 **DOM 相关的东西**分开——各住不同的模块（OOP 原则课 SRP 与松耦合的直接落地）",
        "UI 四种必备能力（官方任务 5）：查看所有项目；查看每个项目里的所有 todo（大概只显示标题与 dueDate……可以按优先级变色）；展开单个 todo 查看/编辑详情；删除 todo——界面长相由你定",
        "灵感来源（官方任务 6）：Todoist、Things、any.do 三个优秀 todo 应用——看截图、看它们的介绍视频",
        "npm 库（官方任务 7）：你多半已经在用 webpack，从 npm 加外部库小菜一碟（a cinch）——官方推荐考虑 date-fns：一大堆格式化与操纵日期时间的顺手函数",
        "持久化（官方任务 8）：还没学过把数据存到哪里的技术——现在用户一刷新页面所有 todo 就消失！用 **Web Storage API** 给应用加持久化；**localStorage** 能把数据存在用户电脑上，缺点是数据**只在创建它的那台电脑上可访问**——即便如此也相当顺手",
        "持久化的两个函数（官方指定形态）：一个函数在**每次创建新项目（或新 todo）时**把 projects（与 todos）存进 localStorage；另一个函数在**应用首次加载时**去 localStorage 找那份数据",
        "官方三个 tip：① 确保「想取的数据不在 localStorage 里」时应用**不崩**；② 用 DevTools 检查存的数据——Application 标签 → Storage 下 Local Storage，应用里每次增改删都会实时反映在那里；③ localStorage 用 **JSON** 收发与存储数据、取回时也是 JSON 格式——记住 **JSON 里不能存函数**，取回后怎么把方法装回对象属性要你自己想明白（官方原话：Good luck!）"
      ],
      "terms": [
        {
          "en": "Todo item",
          "zh": "待办项：动态创建的对象——至少 title / description / dueDate / priority 四属性，工厂或构造器/类生成"
        },
        {
          "en": "Project（todo 应用语境）",
          "zh": "项目/清单分组：todo 的收纳单位——首次打开有默认项目，用户可新建并选择 todo 归属"
        },
        {
          "en": "Application logic vs DOM modules",
          "zh": "应用逻辑模块与 DOM 模块的分离：官方硬性架构要求——创建/完成/改优先级等逻辑不住在 DOM 代码里"
        },
        {
          "en": "Web Storage API / localStorage",
          "zh": "浏览器本地存储：把数据存在用户电脑上（仅本机可访问）——刷新不丢的持久化方案"
        },
        {
          "en": "date-fns",
          "zh": "官方推荐的 npm 日期库：一大堆格式化与操纵日期时间的函数——dueDate 显示与比较的顺手工具"
        },
        {
          "en": "Persistence",
          "zh": "持久化：数据在页面刷新/重开之后仍然存活——本项目的 localStorage 存取双函数就是它的最小实现"
        }
      ],
      "tasks": [
        "动手前先想（官方原话要求）：项目怎么组织——模块划分、数据形状、谁调用谁；想清楚再写第一行",
        "定 todo 数据层：用工厂函数或构造器/类动态生成 todo 对象；头脑风暴属性——至少 title / description / dueDate / priority，可加 notes 或 checklist",
        "搭 projects 结构：todo 按项目分组；应用首开时有默认项目收纳全部 todo；支持用户新建项目、选择 todo 进哪个项目",
        "分模块落架构：应用逻辑（创建 todo、标记完成、改优先级等）与 DOM 相关的东西**分住不同模块**——这是官方硬性要求",
        "做 UI 四能力：查看所有项目；查看项目内所有 todo（标题 + dueDate 起步，可按优先级变色）；展开单个 todo 查看/编辑详情；删除 todo——界面长相自定",
        "找灵感：看 Todoist / Things / any.do 三个官方指定应用的截图与介绍视频，挑一个交互模式借鉴",
        "可选装 date-fns（npm 安装，Webpack 在位就是小菜一碟）：用它处理 dueDate 的格式化与操纵",
        "加持久化：写「每次创建新项目/todo 时存入 localStorage」与「应用首次加载时读取」两个函数；守住官方三 tip——数据不在时不崩、DevTools Application 面板核对存储、JSON 存不了函数（读回后把方法装回对象自己想明白）",
        "对照下方验收清单自查；建议走上一课学的部署流程把它发上 GitHub Pages，收进作品集"
      ],
      "quiz": [
        {
          "question": "官方为什么要求「应用逻辑与 DOM 相关的东西分住不同模块」？这是哪一课原则的落地？",
          "answer": "这是 OOP 原则课的 SRP 与松耦合在真实项目里的直接考核：逻辑模块（创建 todo、标记完成、改优先级）只管数据与规则，DOM 模块只管呈现——分开之后，改界面不碰逻辑、改逻辑不碰界面，每边只有一个变更理由；官方在原则课的游戏例子（先 console.log 写逻辑、后加 DOM 函数不碰逻辑）说的正是同一个架构。"
        },
        {
          "question": "「JSON 里不能存函数」对这个项目的持久化意味着什么？官方期望你怎么应对？",
          "answer": "localStorage 走 JSON 存取：stringify 时 todo 对象上的方法（如切换完成、改优先级的函数）会被丢掉，parse 读回的是纯数据对象。官方的期望（原话 Good luck!）是你自己想明白「取回后怎么把方法装回对象属性」——自然解法就藏在任务 1 里：用同一个工厂函数/构造器拿存回来的纯数据重新造对象（数据与行为的装配点本来就是工厂/构造器）。"
        },
        {
          "question": "为什么要有「默认项目」？projects 分组解决什么问题？",
          "answer": "官方任务 3 的两层要求：用户第一次打开应用时应有一个「默认」项目收纳所有 todo——保证应用首开就有可用的落点，新 todo 永远有归属，不会出现「无项目可进」的悬空状态；分组本身则让清单可扩展（工作/生活/学习各一个项目），也是 UI 第一能力（查看所有项目）的数据基础。"
        },
        {
          "question": "官方对 todo 数据层的生成方式指定了什么？为什么给两条路？",
          "answer": "官方原话只要求「todo 是动态创建的对象——意味着用工厂或构造器/类生成」，两条路都合法、不指定其一。因为本章教的三种造对象手法（构造器、工厂、类）在这个场景都成立：工厂的组合灵活、类的语法紧凑、构造器是类的底层——选哪条是你自己的设计决策（官方在 OOP 原则课刚说过：设计问题通常没有唯一清晰答案）。评判标准是后面的分层与持久化能否顺畅，不是用了哪种语法。"
        }
      ],
      "optional": [],
      "note": "Project 红线课：本站不提供成品代码或完整骨架（examples 为空数组）。官方正文没有代码块，全部要求以任务与提示文字给出——本站按原文逐条中文化。三个灵感应用（Todoist / Things / any.do）与 date-fns 仓库、MDN 的 Web Storage 与 JSON 两页均登记进本课资料。官方明文：localStorage 数据只在创建它的电脑上可访问（这是它的边界，不是 bug）。",
      "why": "Todo List 是本章的毕业考，也是第一个「像真应用」的项目：状态有层级（项目 → todo）、行为有多种（增删改查 + 展开编辑）、数据要持久化——组织代码的每个决策（模块怎么分、对象怎么造、方法装在哪）都会真实影响开发体验，OOP 原则课的「 guidelines」第一次有了切肤的评判标准。它还是 localStorage + JSON 持久化的首次实战：「存数据、读回重建对象」这个模式你在后面的课程（乃至本站自己的 progress.js 档案设计里）会一再看到同构的身影。",
      "sections": [
        {
          "h": "项目定位：把整章技术拧在一起",
          "p": [
            "官方开场：到这里你已经用各种技术练了不少，但这一系列朝你扔来了**大量**信息——所以在继续前进之前，我们放慢一分钟，做另一个把这些技术**拧在一起**的大项目。官方预期：你应当有机会展示新学的**大部分（如果不是全部）**技能。",
            "官方对题材的定调很诚实：todo 清单是入门 Web 开发教程的**常客**（staple），实现可以很基础——**但**改进空间巨大、可加的功能很多。换句话说：下限低（做得出来），上限高（做得好很难）——正好用来检验组织代码的功力。",
            "官方还有一条前置要求（原话）：**diving into the code 之前，花一分钟想想你打算怎么组织这个项目。**这不是客套：本项目的难度不在任何单项技术，而在模块划分——先画好边界再动手，比写到一半推倒重来便宜得多。"
          ]
        },
        {
          "h": "数据层：todo 对象与属性头脑风暴",
          "p": [
            "官方任务 1：你的 todos 是**要动态创建的对象**——意味着用**工厂或构造器/类**生成它们（本章三条造对象路线都合法，选你自己的）。",
            "官方任务 2：**头脑风暴 todo 项该有什么属性**——最少应有 `title`、`description`、`dueDate` 与 `priority`；你可能还想加 `notes`、甚至一份 `checklist`。",
            "建议在这一步就把「数据形状」写下来（哪些属性、什么类型、谁生成）：它就是后面持久化的存取单位——数据形状定了，localStorage 的 JSON 序列化与「读回重建」才有明确的靶子。"
          ]
        },
        {
          "h": "projects 分组与默认项目",
          "p": [
            "官方任务 3：你的 todo list 应当有 **projects**（或者说分开的 todo 清单）——todo 不是一个大平铺，而是按项目分组。",
            "两条行为要求：**用户第一次打开应用时，应有某种「默认」项目**，所有 todo 都放进去；**用户应当能创建新项目、并选择自己的 todo 进哪个项目**。",
            "数据结构上这意味着「项目里装着 todo」的层级（数组套对象之类由你定）——官方没指定实现，只指定行为。默认项目的存在保证应用首开就有可用落点，新 todo 永远有归属。"
          ]
        },
        {
          "h": "架构硬要求：逻辑与 DOM 分模块",
          "p": [
            "官方任务 4（原文是硬性语气）：你应当把**应用逻辑**（也就是：创建新 todo、把 todo 设为完成、改 todo 优先级等等）**与 DOM 相关的东西分开**——把所有这些东西**放在不同的模块里**。",
            "这是上一课 OOP 原则的直接落地：逻辑模块只管数据与规则（SRP：一个变更理由），DOM 模块只管呈现（松耦合：换界面不重写逻辑）。餐厅页项目的「tab 模块 + index.js 协调者」已经预演过这个形态，本项目把它扩展到「有持久化的多层状态」。",
            "官方任务 5 给了 UI 的**能力清单**（长相由你定）：① 查看所有项目；② 查看每个项目里的所有 todo（大概只显示标题与 dueDate……可以按不同优先级变色）；③ 展开单个 todo 查看/编辑其详情；④ 删除一个 todo。",
            "官方任务 6 给灵感：去看三个优秀的 todo 应用——**Todoist、Things、any.do**（看截图、看它们的介绍视频等）。别抄功能清单，看它们怎么组织「项目—列表—条目—详情」的层级与交互。"
          ]
        },
        {
          "h": "date-fns：官方推荐的日期库",
          "p": [
            "官方任务 7：你多半已经在用 webpack 了——**从 npm 添加外部库简直小菜一碟**（a cinch）！官方建议考虑在代码里用这个顺手的库：**date-fns**——给你一大堆**格式化与操纵日期时间**的 handy 函数。",
            "它对应的痛点正是 todo 的 dueDate：显示成「2026 年 9 月 30 日（周三）」、算「还剩 3 天」、判断「已逾期」——这些用原生 Date 手写又长又容易错，date-fns 一个函数一件事。装法就是 npm 课的流程（这次是普通依赖：它的代码会进 bundle、给用户跑）。"
          ]
        },
        {
          "h": "持久化：localStorage 与三个官方 tip",
          "p": [
            "官方任务 8 先点破现状：我们还没学过任何「把数据存到某个地方」的技术——所以现在**用户一刷新页面，所有 todo 都会消失**！你应当用 **Web Storage API** 给这个 todo 应用加上持久化。",
            "**localStorage** 允许把数据保存在用户的电脑上。官方如实交代缺点：数据**只能在创建它的那台电脑上访问**——即便如此，它还是相当 handy 的。",
            "官方指定的函数形态（两个）：一个函数在**每次创建新项目（或新 todo）时**把 projects（与 todos）存进 localStorage；另一个函数在**应用首次加载时**到 localStorage 里找那份数据。",
            "官方三个 tip（每个都是前人翻过的车）：**① 数据可能不在**——确保你想从 localStorage 取的数据不存在时，应用**不要崩**（首次使用、手动清过存储都会走到这条路）；**② 用 DevTools 看存储**——Application 标签 → Storage 下的 Local Storage 标签；应用里每次增、改、删数据，变化都会反映在那里；**③ JSON 的函数约束**——localStorage 用 **JSON** 收发与存储数据，取回时也是 JSON 格式；记住你**不能在 JSON 里存函数**——所以取回数据后，**怎么把方法装回你的对象属性，得你自己想明白**。官方原话收尾：Good luck!"
          ]
        },
        {
          "h": "验收清单",
          "p": [
            "对照自查：① todo 是工厂或构造器/类动态创建的对象，至少含 title / description / dueDate / priority；② 有 projects 分组，首开有默认项目，能新建项目并选择 todo 归属；③ 应用逻辑与 DOM 分住不同模块（指得出来哪个文件是逻辑、哪个是呈现）；④ UI 四能力齐：看所有项目 / 看项目内 todo（标题 + dueDate，优先级可选变色）/ 展开单个 todo 查看编辑 / 删除；⑤ 刷新页面数据不丢：创建时存入 localStorage、加载时读取还原；⑥ 存储里没有数据时应用正常启动不崩；⑦ 读回的对象方法齐全（JSON 函数约束的应对落实了）；⑧ DevTools Application 面板里能看到存的 JSON 且与界面一致。",
            "选做项自查（做了更好、没做不算未完成）：notes / checklist 属性、date-fns 的日期格式化、优先级颜色、部署上 GitHub Pages。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "刷新后 todo 全消失才想起持久化",
          "text": "官方把这个坑写成了任务 8 的开场白。持久化不是最后撒的糖霜——「存数据、读回重建对象」影响数据层设计（方法怎么装回去）。建议在做 UI 之前就把两个存取函数搭起来，边做边存，而不是做完再补。"
        },
        {
          "title": "读回 JSON 后直接当对象用（方法没了）",
          "text": "JSON 里存不了函数：parse 回来的是纯数据，调 todo.toggleComplete() 会报 not a function。官方留白的解法方向：用同一个工厂/构造器拿纯数据重新装配对象——数据与行为的装配点本来就在工厂/构造器，这正是任务 1 选型的回报。"
        },
        {
          "title": "localStorage 没数据时应用崩溃",
          "text": "官方 tip ①：首次使用、清过缓存、换浏览器——getItem 返回 null 是常态不是异常。读取函数必须把「没有存档」当正常分支处理（回落到默认项目 + 空列表），否则应用对新用户直接白屏。"
        },
        {
          "title": "逻辑函数里长满 DOM 调用",
          "text": "官方任务 4 是硬性要求：addTodo、setComplete、changePriority 这类逻辑函数里出现 appendChild/textContent 就是违规——上一课 isGameOver 的两段式修正在这里整个项目尺度重演。检查法：逻辑模块里不该 import 任何 DOM 模块。"
        },
        {
          "title": "没有默认项目，新 todo 无处可去",
          "text": "官方任务 3 明文：首开应有默认项目收纳所有 todo。漏掉它，「创建 todo 时选择项目」的 UI 与数据路径都要处理「无项目」的悬空态——复杂度凭空翻倍。默认项目就是把「必有一个归属」变成不变量。"
        }
      ],
      "official": {
        "assignment": [
          "你的 todos 是要动态创建的对象——意味着用工厂或构造器/类生成它们。",
          "头脑风暴你的 todo 项会有什么属性：最少应有 title、description、dueDate 与 priority；可能还想加 notes 甚至 checklist。",
          "你的 todo list 应有 projects（或说分开的 todo 清单）。用户第一次打开应用时，应有某种「默认」项目收纳其所有 todo。用户应能创建新项目、并选择他们的 todo 进哪个项目。",
          "你应当把应用逻辑（创建新 todo、把 todo 设为完成、改 todo 优先级等）与 DOM 相关的东西分开——所有这些东西放在独立的模块里。",
          "UI 长相由你定，但它应能做到：查看所有项目；查看每个项目里的所有 todo（大概只显示标题与 duedate……可以按不同优先级变色）；展开单个 todo 查看/编辑其详情；删除一个 todo。",
          "找灵感：看看下面这些优秀的 todo 应用（看截图、看它们的介绍视频等）：Todoist、Things、any.do。",
          "你多半已经在用 webpack——从 npm 加外部库小菜一碟！可以考虑在代码里用这个顺手的库：date-fns——给你一大堆格式化与操纵日期时间的 handy 函数。",
          "我们还没学过把数据真正存到哪里的技术——用户一刷新页面，所有 todo 都会消失！你应当用 Web Storage API 给这个 todo 应用加持久化。localStorage 允许把数据保存在用户电脑上；缺点是数据只能在创建它的那台电脑上访问——即便如此也相当 handy！设置一个函数：每次创建新项目（或新 todo）时把 projects（与 todos）存进 localStorage；再设置一个函数：应用首次加载时去 localStorage 找那份数据。另外几个帮你别被绊倒的快 tip：① 确保你想从 localStorage 取的数据不在时，应用不崩；② 用 DevTools 检查存的数据——Application 标签 → Storage 下点 Local Storage 标签；应用里每次增改删 localStorage 数据，变化都会反映在 DevTools 里；③ localStorage 用 JSON 收发与存储数据，取回时也是 JSON 格式——记住你不能在 JSON 里存函数，所以取回后怎么把方法装回对象属性得你自己想明白。Good luck!"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/organizing_your_javascript_code/project_todo_list.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "e2947de652340fcf7b4e7cf0931d58ba997150e0302cdfc31bd2626b946b4d7e",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-javascript-linting",
      "title": "Linting",
      "zh": "代码检查（Linting）",
      "group": 2,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-linting",
      "summary": "在写更多代码之前，官方安排这一课升级你的编辑器设置与整体生产力。核心是两类工具：Linter（以 ESLint 为代表）按一套风格规则扫描代码、报告甚至自动修复问题；Formatter（以 Prettier 为代表）不管对错、专管排版——空格、缩进、换行由它智能决定。风格指南（Airbnb / Google / Standard）没有对错之分，重点是「强制某种一致性」。官方特别强调：IDE 扩展只是便利工具，项目内的依赖包与配置文件才是规则的事实源。",
      "guide": "以下是官方原课的中文化梳理。这一课没有深奥的语法，讲的是「职业习惯」：为什么要有统一的代码风格、怎么用工具把风格自动化。读的时候抓住两条主线——其一，Linter 与 Formatter 分工不同：前者找「违反规则的写法」（未定义变量、可疑等号误用等），后者只管「代码长什么样」（缩进几格、单引号还是双引号、行在哪里断开）；其二，事实源永远在项目里：ESLint 与 Prettier 都装成 devDependency、配置文件跟着仓库走，IDE 扩展检测到项目里的包和配置就用项目规则——这样换机器、换项目、多人协作时风格才不会漂移。官方还给了一个顺手的省力建议：把这套设置放进你的模板仓库（上一门大课 Revisiting Webpack 讲过模板仓库），以后每个新项目开局就自带 lint 与格式化。一个减负事实：如果你用 ESLint 默认推荐规则集，它与 Prettier 不会冲突，无需再配置 eslint-config-prettier。",
      "understand": [
        "代码风格一致（缩进、引号偏好、结构习惯）让代码**更可维护、更易读**——这是风格指南存在的全部理由",
        "风格指南没有「对」与「错」：Airbnb、Google、Standard 各自强制的规则不同，价值在于强制**某种一致性**，而非某套具体规则",
        "**Linter**：用一套风格规则扫描代码并报告错误的工具，有些还能自动修复——JavaScript 界最常用的是 **ESLint**",
        "ESLint 装成项目 **devDependency**，命令行跑检查；默认规则集已覆盖最常见场景；配置文档可改包含/排除目录文件与具体规则",
        "**Formatter** 与 linter 分工不同：不找风格错误，专管**代码排版**——对空格、缩进层级、换行做智能决定；代表是 **Prettier**",
        "Prettier 高度「有观点」（highly opinionated）：除少数选项外大多数排版决定不可定制——决定替你做好，省下纠结缩进宽度、分号的时间",
        "用 ESLint **默认推荐规则集**时与 Prettier 无冲突，**无需配置 eslint-config-prettier**（官方明文）",
        "IDE 扩展（VSCode 的 ESLint / Prettier 扩展）提供波浪线警告与快捷键格式化，但**项目里的包与配置文件才是事实源**——扩展检测到它们就用项目规则与版本"
      ],
      "terms": [
        {
          "en": "Style guide（风格指南）",
          "zh": "一套成文的代码风格标准（缩进/引号/结构等）——流行的有 Airbnb、Google、JavaScript Standard Style；无对错，重点是一致"
        },
        {
          "en": "Linter",
          "zh": "按风格规则扫描代码、报告（有时自动修复）问题的工具——JS 最常用 ESLint，装成 devDependency 命令行跑"
        },
        {
          "en": "Formatter（格式化工具）",
          "zh": "自动重排代码排版的工具：空格、缩进、换行——不判对错只管长相；代表 Prettier"
        },
        {
          "en": "ESLint",
          "zh": "最主流的 JavaScript linter；官方 Getting Started 页覆盖安装与基本配置，默认规则集覆盖常见场景"
        },
        {
          "en": "Prettier",
          "zh": "高度有观点的格式化工具：多数排版决定不可定制——把「纠结格式」的时间还给真正要紧的问题"
        },
        {
          "en": "eslint-config-prettier",
          "zh": "消除 ESLint 与 Prettier 规则冲突的配置包——用 ESLint 默认推荐规则集时不需要它"
        },
        {
          "en": "Source of truth（事实源）",
          "zh": "lint/格式规则以项目内依赖包 + 配置文件为准；IDE 扩展只是便利层，不是事实源"
        }
      ],
      "tasks": [
        "读 Codacy 博客的 What Are Linters? 一文（Assignment 第 1 条）：更深入理解 linter 的价值与工作原理",
        "看 Prettier 作者 James Long 的短视频（Assignment 第 2 条，React Conf 2017 演讲）：了解 Prettier 的来龙去脉",
        "去 Prettier 在线 playground 试驾（Assignment 第 3 条）：把你以前写的 JavaScript 代码复制粘贴进去，看看它被重排成什么样",
        "动手（本站补充）：在任一小项目里 npm install --save-dev eslint prettier，按官方 Getting Started 跑一次 npx eslint，再装 VSCode 两个扩展体验保存即格式化——注意配置文件要进仓库"
      ],
      "quiz": [
        {
          "question": "风格指南之间经常互相矛盾（Airbnb 与 Standard 对分号的态度就相反）——官方为什么说它们没有对错？",
          "answer": "因为风格指南的价值不在某条具体规则，而在「强制某种一致性」：整个代码库用同一套规则，代码就更可维护、更易读。选哪套都可以，换来换去、或者一个项目里混用多套才是真问题。"
        },
        {
          "question": "Linter 和 Formatter 的分工区别是什么？各举一个代表工具。",
          "answer": "Linter（ESLint）用风格规则扫描代码、找出「写法问题」（可疑代码、违反规则之处），可报告甚至自动修复；Formatter（Prettier）不找错误，专管代码「长相」——空格、缩进层级、换行位置。一个管对不对，一个管齐不齐。"
        },
        {
          "question": "Prettier 被称为 highly opinionated（高度有观点）——这对你意味着什么好处？",
          "answer": "除了少数选项，Prettier 的排版决定大多不可定制：缩进宽度、空格、换行这些决定它替你做了。你不再花时间纠结格式偏好，把时间花在真正要紧的问题上；团队里也不会为格式打口水仗——反正 Prettier 说了算。"
        },
        {
          "question": "已经装了 VSCode 的 ESLint / Prettier 扩展，为什么项目里还要装依赖包、放配置文件？",
          "answer": "扩展只是便利层：检测到项目里有对应的包和配置文件时，它用项目的规则和包版本。项目永远是事实源——这样多人协作、换机器、接别人的项目时规则不漂移，你的本地扩展设置也不会把不想要的风格变化带进别的项目。"
        },
        {
          "question": "什么情况下你不需要配置 eslint-config-prettier？",
          "answer": "使用 ESLint 默认推荐规则集时：官方明文说这时 lint 规则与 Prettier 的格式化规则不会冲突，直接装 Prettier 用即可。只有当你自定义了与排版相关的 lint 规则、可能与 Prettier 打架时才需要它来熄火。"
        }
      ],
      "optional": [],
      "note": "知识课（无 Project 红线）。官方正文四节（Style guides / Linting / Formatters / IDE extensions）加一个模板仓库 tip；本站 example 为安装命令演示（非官方成品代码）。tip 里的「模板仓库」回指本站已开放的 Revisiting Webpack 课——把 ESLint + Prettier 设置放进模板，以后新项目开局即带。Assignment 的三条外部资料均已逐条核验（Prettier 视频的真实标题已确认：React Conf 2017 的 A Prettier Printer 演讲，演讲者即 Prettier 创始人 James Long，与官方「by its creator」表述一致）。",
      "why": "这一课是「职业习惯」课：从现在起你的每个项目（包括接下来的天气应用与后续全部 Project）都该自带 lint 与格式化。短期看它替你省掉调缩进、补分号的机械劳动；长期看，一致的代码风格是多人协作与半年后回读自己代码的救生索。ESLint + Prettier 也是业界事实标配——面试白板之外，真实工程里的代码就是这个流水线出来的。",
      "sections": [
        {
          "h": "风格指南：为什么代码风格重要",
          "p": [
            "官方的开场白把这一课定位成「投资」：在深入更多代码之前，花一点时间改善编辑器设置与整体生产力，往后会轻松得多。",
            "**代码风格很重要**：对缩进、引号偏好、整体代码结构有一致的规则，代码就更可维护、更易读。网上有好几套流行的 JavaScript 风格指南，它们各自强制的东西常常不同——**但没有哪套是「对」或「错」的**，它们的共同价值是强制「某种东西」，让一个代码库内部保持一致。",
            "官方点名三个例子：**Airbnb Style Guide**（最流行之一）、**Google 内部的 JavaScript 风格指南**、**JavaScript Standard Style**。浏览一遍它们的目录，感受一下「风格规则可以细到什么程度」——细到对象字面量换不换行、数组尾逗号加不加。你不需要背，接下来出场的工具会替你执行。"
          ]
        },
        {
          "h": "Linter：替你记住所有规则",
          "p": [
            "风格指南里的建议很有用，但规则**太多了**，很难全部内化。**Linter** 就是解决方案：用一套风格规则扫描你的代码、把发现的问题报告给你，有些情况下还能**自动修复**。JavaScript 的 linter 有很多，但最常用的是 **ESLint**。",
            "用法与你在 npm 课学的一致：ESLint 装成项目的 **devDependency**，然后就能在命令行对任何文件跑检查。官方推荐从 **ESLint 的 Getting Started 页**入手（覆盖安装与基本配置）；**默认规则集**已经用合理的默认设置覆盖了最常见的场景。",
            "想再深入，官方的 **配置文档**列出了可改的选项：包含/排除特定文件夹或文件、调整具体规则等。起步阶段用默认集即可——先有，再调。"
          ]
        },
        {
          "h": "Formatter：排版交给 Prettier",
          "p": [
            "Formatter 与 linter 类似但职能不同：**不找风格错误**，专管代码的**排版**——对空格、缩进层级、换行位置做智能决定。官方原话：Formatter 太棒了（awesome）。",
            "最流行的选择是 **Prettier**，它高度「有观点」：除了少数几个选项，大多数排版决定**不可定制**。这不是缺陷而是卖点——决定已经替你做好，你就不用再花时间纠结缩进几格、空格怎么打，把时间留给真正要紧的问题。",
            "Prettier 同样装成 **devDependency**（官方给了安装指南），平时用默认规则跑，也可以改**配置文件**。一个减负事实（官方明文）：如果你用的是 ESLint **默认推荐规则集**，lint 规则与格式化规则不会打架——**直接装 Prettier 就行，无需配置 eslint-config-prettier**。",
            "用 Prettier 之后写码更快更省心：不用死磕缩进、不用记着每个分号——这些细节它全包了。"
          ]
        },
        {
          "h": "IDE 扩展：便利工具，不是事实源",
          "p": [
            "Linter 和 formatter 通常是装在项目里、命令行使用的包；但主流工具都有 IDE 扩展——ESLint 与 Prettier 都有 **VSCode 扩展**，让本机的检查和格式化更方便。",
            "ESLint 扩展：在打开的文件里直接用彩色波浪线标出警告与错误，还能给出违反的具体规则详情——不用去命令行跑 ESLint。Prettier 扩展：一个 IDE 命令或自定义快捷键就格式化当前文件——同样不用开终端。",
            "但官方强调：**项目里的依赖包与配置文件仍然必须在**。扩展可以有兜底规则，但一旦检测到项目里有对应的包和配置文件，就用**项目的规则和安装的包版本**。这样项目永远是「该用什么 lint/格式规则」的事实源；你去参与别的项目时，也不容易把自己本机的设置带成不受欢迎的风格改动。",
            "一句话总结（官方原话的意思）：扩展是很好用的便利工具，但**不应被当作项目 lint/格式设置的事实源**。",
            "官方还给了一个 tip：还记得**模板仓库**吗（本站 Revisiting Webpack 课讲过）？把 linter 与 formatter 的设置放进你的模板里，以后每次开新项目都更快更省事。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "bash",
          "code": "# 在项目里安装（都是 devDependency，不进生产依赖）\nnpm install --save-dev eslint prettier\n\n# ESLint 官方 Getting Started 的初始化流程（交互式生成配置文件）\nnpx eslint --init\n\n# 命令行对整个项目跑检查\nnpx eslint .\n\n# 用 Prettier 格式化某个文件（装 VSCode 扩展后通常保存即格式化）\nnpx prettier --write src/index.js",
          "note": "本站示意命令：把官方正文的「装成 dev dependency、命令行跑检查、Prettier 安装指南」串成最小操作序列。具体交互选项以 ESLint 官方 Getting Started 页与 Prettier 安装指南为准（本课 Assignment 资料里有入口）。"
        }
      ],
      "pitfalls": [
        {
          "title": "把 IDE 扩展当事实源",
          "text": "只装扩展、项目里没有依赖包和配置文件——你本机看着规矩，队友和 CI 上全是另一套。官方明文：项目里的包与配置才是事实源，扩展检测到它们才用项目规则；配置文件记得进仓库。"
        },
        {
          "title": "以为 ESLint 和 Prettier 必然冲突",
          "text": "看到 eslint-config-prettier 的存在就以为两者天生打架——用 ESLint 默认推荐规则集时并无冲突，直接装 Prettier 即可（官方明文）。只有自定义了排版相关的 lint 规则时才需要处理重叠。"
        },
        {
          "title": "在风格指南之间反复横跳",
          "text": "这套指南的价值是一致性：今天 Airbnb 明天 Standard，代码库会变成风格地质层。选一套（或直接用 ESLint 默认集 + Prettier），坚持下去——一致性本身比选哪套更重要。"
        }
      ],
      "official": {
        "assignment": [
          "读这篇深入讲 linter 价值与工作原理的文章（Codacy 博客 What Are Linters?）。",
          "看 Prettier 作者的短视频介绍（James Long 在 React Conf 2017 的演讲）。",
          "去 Prettier 在线 playground 试驾：把你以前的 JavaScript 代码复制粘贴进编辑器，看看会发生什么。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/javascript_in_the_real_world/linting.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "1cffacfdd9fdc1f7cc210725b21db90ba276bf3f56f47a83e60fa65a361c6add",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-javascript-form-validation-with-javascript",
      "title": "Form Validation with JavaScript",
      "zh": "用 JavaScript 校验表单",
      "group": 2,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-form-validation-with-javascript",
      "summary": "表单几乎无处不在：注册、联系我们、搜索框。World 2 的「表单校验」课已经教过用 HTML 属性（required / minlength / pattern）做内置校验、用 CSS（:user-valid / :user-invalid）画校验状态；这一课把控制权交给 JavaScript——核心是浏览器原生的 Constraint Validation API：checkValidity()、validity 对象、setCustomValidity() 一套接口，让表单控件自己报告「我合规吗、为什么不合规」。官方正文很短，重头戏在 Assignment：MDN 的两份教程加一个大练习（全 JS 校验的注册表单 + 回头改造 Library 项目）。",
      "guide": "以下是官方原课的中文化梳理。先说清这一课的坐标：它是 World 2「表单校验」课的 JavaScript 续集。HTML 内置校验够用的场景就让它干（浏览器白送的），但它有两类硬伤——做不了跨字段逻辑（比如「两次密码一致」），也改不了提示文案（浏览器内置气泡的措辞与样式不由你控制）。Constraint Validation API 就是浏览器给表单控件配的一套「自检接口」：每个控件有 checkValidity()（合规吗）、validity（ValidityState 对象，不合规的具体原因）、validationMessage（浏览器会显示的文案）、setCustomValidity()（塞进你自己的错误消息）；form 元素本身也有这套接口，一次检查整张表单。官方正文只有引言、overview 和 Assignment——知识本体全部委托给 MDN 的两份教程（本站已核验两者都有官方中文版），本站正文负责把 API 的地图和练习的架构思路铺开。练习里有两个官方明文的关键点：给 form 加 novalidate 属性、把浏览器内置校验全部关掉，所有校验逻辑写进 JS；以及 live inline validation——边输入边校验（用户离开一个字段就校验那个字段），而不是只在提交那一刻算总账。",
      "understand": [
        "表单是大多数网站的关键部分（注册/联系/搜索），HTML5 与 JavaScript 有一批顺手的内置方法",
        "这一课的主题是 **Constraint Validation API**：在**前端用 JavaScript 校验表单**的一套浏览器原生接口",
        "与 World 2 表单校验课的分工：HTML 属性管「内置校验」、CSS 伪类管「画状态」，本课 JS 管**逻辑与文案的控制权**",
        "HTML 内置校验的两个硬伤：**跨字段逻辑做不了**（两次密码一致、字段联动）；**错误文案与呈现不可定制**——都要靠 JS",
        "控件级接口：**checkValidity()**（布尔：合规吗）、**validity**（ValidityState 对象：不合规的具体原因，如 valueMissing / typeMismatch / tooShort）、**validationMessage**、**setCustomValidity()**（自定义错误消息——传空串表示恢复合规）",
        "form 元素也有 checkValidity()：一次检查整张表单——提交前拦截的关口",
        "**novalidate 属性**（官方练习明文）：加在 form 上关掉浏览器内置校验 UI，**全部校验由你的 JS 接管**——不同 input type 仍可用，但检查与报告都要 JS 自己做",
        "**live inline validation**（官方练习明文）：边输入边校验、用户**离开一个字段就校验那个字段**——不合规字段标红并显示错误消息引导用户，而不是只在提交时报总账"
      ],
      "terms": [
        {
          "en": "Constraint Validation API",
          "zh": "浏览器原生的表单校验接口族：控件与 form 自带 checkValidity / validity / validationMessage / setCustomValidity"
        },
        {
          "en": "checkValidity()",
          "zh": "返回布尔：该控件（或整张表单）当前是否满足全部校验约束"
        },
        {
          "en": "ValidityState",
          "zh": "validity 属性的对象类型：valueMissing / typeMismatch / tooShort / patternMismatch 等一组布尔，说明「不合规的具体原因」"
        },
        {
          "en": "setCustomValidity(message)",
          "zh": "塞进自定义错误消息（控件随即不合规）；传空串清除、恢复合规——自定义文案的总开关"
        },
        {
          "en": "novalidate",
          "zh": "form 属性：关闭浏览器内置校验 UI——官方练习要求全部校验逻辑写进 JS 时必加"
        },
        {
          "en": "Live inline validation",
          "zh": "边输入边校验的交互模式：离开字段即校验该字段、即时标红与提示——官方练习的核心要求"
        }
      ],
      "tasks": [
        "跟着 MDN 的表单校验教程走一遍（Assignment 第 1 条，有官方中文版）：重点读「用 JavaScript 校验表单」一节（官方链接锚点 #validating_forms_using_javascript），Constraint Validation API 的用法都在里面",
        "再过一遍 MDN 的 Constraint Validation 文档（Assignment 第 2 条，有官方中文版）：把 ValidityState 的每个属性都认识一遍",
        "做大练习（Assignment「再来一点练习」第 1 条）：收集 Email / Country / Postal Code / Password / Password Confirmation 的表单——live inline validation（边输入边校验）；不合规字段标红 + 错误消息引导；form 加 novalidate、全部校验写在 JS 里；带错误或必填未填时提交要给自定义错误消息；全部通过并「提交」就给用户一个 high five。官方步骤：空白 HTML → **先白板**（想清楚需要哪些对象和函数——几分钟思考省一小时写码）→ 写表单元素 → 加「随用户推进逐步校验」的 JS（离开字段即校验该字段）→ 测遍所有情况 → 用 :user-valid / :user-invalid 伪类做校验样式",
        "改造 Library 项目（Assignment 第 2 条）：给图书表单加自定义校验——空字段提交时显示自定义错误消息（如「The author name must be filled!」）；按 Foundations「再探石头剪刀布」学的 git 分支工作流在新分支上做这个新功能"
      ],
      "quiz": [
        {
          "question": "HTML 内置校验（required / pattern 等）已经能拦不合规输入了——为什么还要用 JavaScript 校验？举两个内置校验做不到的事。",
          "answer": "两个典型硬伤：① 跨字段逻辑——「两次密码是否一致」「结束日期必须晚于开始日期」，单字段的 HTML 属性表达不了；② 文案与呈现定制——内置气泡的措辞和样式由浏览器控制，想显示「作者名必须填写！」这类自己的话、想边输入边标红引导，都得 JS 接管。"
        },
        {
          "question": "checkValidity() 返回 false 之后，怎么知道「为什么」不合规？",
          "answer": "读控件的 validity 属性（ValidityState 对象）：valueMissing（必填没填）、typeMismatch（类型不对，如 email 格式错）、tooShort / tooLong（长度越界）、patternMismatch（正则不匹配）等一组布尔告诉你具体原因——据此决定显示哪条错误消息。"
        },
        {
          "question": "setCustomValidity() 传一个非空字符串会发生什么？怎么让控件恢复合规？",
          "answer": "传入非空消息后，该控件被标记为不合规（checkValidity() 变 false），消息成为它的 validationMessage——这是把「两次密码不一致」这类自定义逻辑接进 Constraint Validation API 的官方通道。恢复：校验通过后传空串 setCustomValidity('')，控件回到由标准约束说了算的状态。"
        },
        {
          "question": "官方练习为什么要求给 form 加 novalidate？",
          "answer": "novalidate 关掉浏览器内置的校验 UI 与拦截，让全部校验由你的 JavaScript 接管——练习的目的就是练 JS 校验本身，内置气泡会抢戏。注意加了 novalidate 后 input type、required 等属性仍在（validity 状态照常可查），只是浏览器不再自动弹提示、不再拦提交——检查与报告都要你的代码做。"
        },
        {
          "question": "什么是 live inline validation？官方练习对它的触发时机有什么明确要求？",
          "answer": "边输入边校验、逐字段即时反馈：不合规字段标红并显示错误消息引导用户，而不是提交那一刻才报总账。官方明文的时机是「用户离开一个表单字段时，自动校验那个字段」（配 input/change/blur 事件）——再配 :user-valid / :user-invalid 伪类画状态。"
        }
      ],
      "optional": [],
      "note": "官方这一课正文极短：只有引言、Lesson overview（三条）与 Assignment——知识本体全部委托给 MDN 的两份教程（Form validation 教程的 JS 一节 + Constraint Validation 文档，两份均有官方中文版，已按现役路径核验）。本站正文按官方 overview 的方向铺开 API 地图与练习架构思路，细节以 MDN 为准。examples 为本站示意代码（官方正文无代码）。练习第 2 条回改 Library 项目——该课本站已开放；git 分支工作流回指 Foundations「再探石头剪刀布」课。",
      "why": "校验是表单的守门员，而 JS 校验是你从「能用表单」到「能做好表单」的分水岭：真实产品的注册页、结账页、后台表单全都需要跨字段逻辑与定制文案。这一课还直接反哺你已有的项目——Library 的图书表单马上就能加上「作者名必须填写」级别的体验。Constraint Validation API 是浏览器原生接口，不依赖任何库，学会它等于拿到所有前端框架表单校验的底层地图。",
      "sections": [
        {
          "h": "这一课的坐标：从 HTML 校验到 JS 校验",
          "p": [
            "官方开场：表单是大多数网站的关键部分——几乎每个大站都有注册表单、联系表单、搜索表单。幸运的是 HTML5 和 JavaScript 有一批顺手的内置方法。",
            "你已经在 World 2 的**表单校验**课学过用 HTML 做校验、用 CSS 给校验状态上样式（官方原文明确回指那一课）。那一套的边界也讲过：required / minlength / pattern 是**单字段**的规矩，浏览器内置气泡的文案与样式**不由你控制**。",
            "这一课补上缺口：**Constraint Validation API——在前端用 JavaScript 校验表单**。官方 overview 的三条就是本课地图：HTML 表单校验为什么重要、Constraint Validation API 是什么、纯 JavaScript 校验怎么做。"
          ]
        },
        {
          "h": "Constraint Validation API 地图",
          "p": [
            "浏览器给每个可校验的表单控件（input / select / textarea）都配了一套自检接口，核心四件套：**checkValidity()** 返回布尔——当前值是否满足全部约束；**validity** 是一个 ValidityState 对象——valueMissing、typeMismatch、tooShort、patternMismatch 等一组布尔，说明不合规的**具体原因**；**validationMessage** 是浏览器准备显示的错误文案；**setCustomValidity(message)** 让你塞进自己的消息（传非空即不合规，传空串恢复）。",
            "form 元素也有 checkValidity()——一次检查整张表单，是提交前拦截的关口。",
            "组合拳的典型形态：监听字段事件 → 跑你自己的跨字段逻辑（如两次密码一致）→ 用 setCustomValidity 把结果写回控件 → 用 checkValidity/validity 决定标红还是放行 → 文案显示你自己写。HTML 属性（required、type=email、minlength）仍然参与：它们设置标准约束，validity 里的 valueMissing / typeMismatch 就是它们的影子。具体 API 细节以 Assignment 的 MDN 两份教程为准（均有官方中文版）。"
          ]
        },
        {
          "h": "novalidate 与 live inline validation：官方练习的两条明文",
          "p": [
            "官方练习要求做一个收集 **Email / Country / Postal Code / Password / Password Confirmation** 的表单，两条硬性要求值得单独拎出来。",
            "其一：**form 加 novalidate 属性**——关掉浏览器内置校验，**全部**校验写进你的 JS 文件。不同 input type 仍可以用，但检查和报告合法性都得 JavaScript 自己做。表单不需要真的提交到哪里，但带错误或必填未填时尝试提交，要给自定义错误消息；一切正常并「提交」，就给用户一个 high five。",
            "其二：**live inline validation**——边输入边告知用户字段填得对不对，**不是只在提交时校验**。字段不合规就标红并显示错误消息引导用户。触发时机官方写得很具体：**用户离开一个表单字段时，自动校验那个字段**。",
            "官方给的步骤里最值钱的是第 2 步：**先想再写**——不同的表单元素和配套校验器怎么搭？需要哪些对象和函数？「几分钟的思考能省下一小时的编码」，最好的做法是碰电脑之前先把整个方案白板画出来。最后别忘了用 :user-valid / :user-invalid 伪类给校验状态上样式（World 2 的老朋友）。"
          ]
        },
        {
          "h": "回改 Library 项目",
          "p": [
            "Assignment 第 2 条把新技能直接落到旧项目：回到你的 **Library 项目**，给图书表单加自定义校验——用户提交空字段时显示自定义错误消息（官方示例：「The author name must be filled!」）。",
            "官方同时点名流程要求：用你在 Foundations「再探石头剪刀布」学过的 **git 分支工作流**来做这个新功能——新开分支、做完合并，不直接在 main 上动手。",
            "这条练习的价值在于「改造存量代码」的真实体验：Library 的表单逻辑你已经写过，现在要在不破坏既有功能的前提下接进校验层——这正是职业日常。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "// 本站示意：两次密码一致——HTML 内置校验做不到的跨字段逻辑\nconst form = document.querySelector('form');            // <form novalidate>\nconst pwd = document.querySelector('#password');\nconst confirm = document.querySelector('#confirm');\n\nfunction validateConfirm() {\n  if (confirm.value !== pwd.value) {\n    confirm.setCustomValidity('两次输入的密码不一致');   // 塞入自定义消息 → 不合规\n  } else {\n    confirm.setCustomValidity('');                       // 空串 → 恢复合规\n  }\n  // 用 validity / checkValidity 驱动界面\n  confirm.reportValidity();                              // 也可自行读 confirm.checkValidity() 画红框\n}\n\nconfirm.addEventListener('input', validateConfirm);      // live inline：边输入边校验\nform.addEventListener('submit', (e) => {\n  if (!form.checkValidity()) {                           // 整表关口：不过就拦下\n    e.preventDefault();\n    // 显示自定义错误消息（官方练习要求）\n  }\n});",
          "note": "本站示意代码（官方正文无代码）：演示 setCustomValidity 空串/非空串的双向开关、input 事件驱动的 live inline validation、form.checkValidity() 提交拦截三件套。ValidityState 各属性与 reportValidity 的完整行为以 Assignment 的 MDN 教程为准。"
        }
      ],
      "pitfalls": [
        {
          "title": "setCustomValidity 塞了消息忘了清",
          "text": "自定义消息一旦设置，控件就一直不合规——即使后来输入正确。每次重新校验时必须走「通过则 setCustomValidity('')」的分支，否则表单永远提交不了。"
        },
        {
          "title": "以为 novalidate 让 required 失效了",
          "text": "novalidate 只是关掉浏览器的自动拦截与气泡 UI；required、type、minlength 设置的标准约束仍然在，validity.valueMissing 等状态照常可查——你的 JS 要靠它们做判断，而不是它们不存在了。"
        },
        {
          "title": "只在 submit 时校验",
          "text": "官方练习明文要 live inline validation：用户离开字段就校验、即时标红提示。攒到提交才报错，用户要在一片红海里找自己十步之前填错的那格——体验差一个时代。"
        }
      ],
      "official": {
        "assignment": [
          "跟着这份表单校验教程走一遍（MDN，链接直指「用 JavaScript 校验表单」一节），覆盖如何用 JS 校验表单，包括 Constraint Validation API。",
          "把 Constraint Validation 文档也过一遍（MDN）会很有收益。",
          "再来一点练习（其一）：构建收集 Email / Country / Postal Code / Password / Password Confirmation 的浏览器表单——live inline validation 逐字段即时反馈；不合规标红 + 错误消息；form 加 novalidate、全部校验写进 JS；带错提交给自定义错误消息，全对「提交」给 high five；步骤含先白板再动手、离开字段即校验、测遍所有情况、用 :user-valid / :user-invalid 上样式。",
          "再来一点练习（其二）：回到 Library 项目给表单加自定义校验——空字段提交显示自定义错误消息（如「The author name must be filled!」）；用 git 分支工作流做新功能。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/javascript_in_the_real_world/form_validation_with_javascript.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "d102ce3c74fea2830cf0526addf98c42fa6ab3e31275440f3e4125f49b19299c",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-javascript-ecmascript",
      "title": "ECMAScript",
      "zh": "ECMAScript",
      "group": 2,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-ecmascript",
      "summary": "从第一课起官方就一直在说 ES6，这一课把欠账补上：JavaScript 是符合 ECMAScript 标准（Ecma International 制定）的语言，ES6 是 2015 年夏天正式发布的版本——之后命名从版本号（ES5/ES6/ES7）改成年份（ES2015/ES2016/ES2017），所以 ES6 = ES2015；发布节奏也从「一个大版本塞一堆特性」改成每年一版、每版少量新增（TC39 委员会主导）。现实约束：浏览器实现新特性常要滞后几年，用太新的语法写的代码在不支持的浏览器里不会运行——解药是 Babel：把现代 JavaScript 转译（transpile）成老浏览器看得懂的代码，可按目标浏览器配置。官方坦言：课程项目不必为此操心，但要知道真实世界的这回事。",
      "guide": "以下是官方原课的中文化梳理。这是一节「解惑」短课，回答三个你可能已经嘀咕过的问题。第一，ES6 到底是什么：它不是另一门语言，就是 2015 年发布的 ECMAScript 标准版本——你在本课程学 const/let、箭头函数、模板字符串时其实一直在写 ES6，官方原话「ES6 就是 JavaScript」。第二，为什么文章里 ES6/ES2015/ES7/ES2017 满天飞：ES6 发布后 TC39 委员会把命名从版本号改成年份（ES6 又名 ES2015，有人叫 ES7 的就是 ES2016），并把「攒大招」式发布改成每年一版、每版少量特性——所以「ES 几」和「ES 哪年」是同一套东西的两种叫法，看到时心里换算一下即可。第三，新语法能不能直接用：不能想当然——新特性从定稿到「widely available」（主流浏览器普遍支持）常常要几年，面向真实用户的产品控制不了访客的浏览器，这时用 Babel 把现代语法转译成老浏览器能跑的代码，并按产品的目标受众配置 targets。官方给了诚实的边界：课程项目练的是实操，不需要每项目都架 Babel 流水线（你在 Webpack 课已见过 loader 转译资源的位置，babel-loader 就是干语法转译的），但知道真实世界的这套机制，读招聘要求和支持表时才不会懵。Assignment 两条都是「开眼界」性质：ES6 特性总览仓库与 ECMAScript 版本史时间线——官方明说里面有些东西还没教、也不需要现在去探索。",
      "understand": [
        "**JavaScript 是符合 ECMAScript 标准的编程语言**——标准由 Ecma International 制定；ES6 是 2015 年夏正式发布的版本，带来大量让代码更简洁的新特性",
        "本课程一直在教 ES6 特性——官方原话：**ES6 就是 JavaScript**（just JavaScript），不是另一门方言",
        "命名改制：ES6 发布后 **TC39 委员会**把版本号命名（ES5/ES6/ES7）改成**发布年份**命名——**ES6 = ES2015**，文章里的 ES7 = ES2016，以此类推",
        "发布节奏改制：不再是「一个大版本塞一堆特性」（ES6 及以前），改为**每年一版、每版少量新增**",
        "浏览器支持的现实：新特性从发布到「**widely available**」（绝大多数在用浏览器支持）常要几年——用太新特性写的代码**在不支持的浏览器里不会运行**",
        "个人开发很少撞上这问题（现代浏览器自动更新），但**真实产品控制不了用户用什么浏览器**",
        "**Babel**：把现代 JavaScript **转译（transpile）**成老浏览器能理解的代码；可配置目标（如各浏览器的最低版本），targets 取决于产品用途与目标受众",
        "官方定调：课程项目**不需要**为转译操心（目的是实操练习，不是给客户交付生产级产品）——但要知道真实世界存在这套机制"
      ],
      "terms": [
        {
          "en": "ECMAScript",
          "zh": "JavaScript 所遵循的语言标准，由 Ecma International 制定——JS 是它的一种实现"
        },
        {
          "en": "TC39",
          "zh": "负责 ECMAScript 演进的委员会：把命名从版本号改成年份、把发布改成每年一版的都是它"
        },
        {
          "en": "ES6 / ES2015",
          "zh": "同一个东西的两种叫法：2015 年夏发布的大版本——const/let、箭头函数、类等本课程一直在用的特性都来自它"
        },
        {
          "en": "Transpile（转译）",
          "zh": "把一种语法水平的代码转换成另一种（现代 JS → 老浏览器能懂的 JS）——Babel 干的事"
        },
        {
          "en": "Babel",
          "zh": "最主流的 JS 转译工具：按配置的 targets（目标浏览器版本）把新语法降级成等价老语法"
        },
        {
          "en": "Widely available",
          "zh": "「广泛可用」：新特性被绝大多数在用的现代浏览器支持的状态——从定稿到这个状态常要几年"
        }
      ],
      "tasks": [
        "满足好奇心：浏览 ES6（又名 ES2015）新特性总览仓库 lukehoban/es6features（Assignment 第 1 条）——其中很多你已经在用；有几项课程还没专门讲，官方明说**现在不需要去探索**",
        "快速看一眼 ECMAScript 各版本发布时间线（Assignment 第 2 条，Wikipedia 版本史条目）：ES6 之后每个年度版本都有小摘要——有些你用过，有些你不认识也不需要现在探索",
        "一分钟自测（本站补充）：说出 ES6、ES2015、ES7、ES2016 的对应关系；再说出「转译」与「编译」在 Babel 语境下的差别（转译是同语言不同语法水平的转换）"
      ],
      "quiz": [
        {
          "question": "ECMAScript 和 JavaScript 是什么关系？ES6 又是什么？",
          "answer": "ECMAScript 是由 Ecma International 制定的语言标准，JavaScript 是符合这个标准的编程语言——标准与实现的关系。ES6 是 2015 年夏天正式发布的 ECMAScript 版本，带来大量让 JS 写起来更简洁干净的新特性；本课程教的 const/let、箭头函数、模板字符串、类等全是 ES6 特性——官方原话「ES6 就是 JavaScript」。"
        },
        {
          "question": "为什么网上文章里的 ES6、ES2015、ES7、ES2017 看起来很混乱？",
          "answer": "ES6 发布后，TC39 委员会把命名从版本号改成了发布年份：ES6 又名 ES2015，不少文章说的 ES7 就是 ES2016，以此类推。同时发布节奏从「一个大版本塞一堆特性」改成每年一版、每版少量新增。所以两套名字指的是同一条时间线，看到「ES+数字」心里换算成「ES+年份」即可。"
        },
        {
          "question": "用刚发布的新语法特性写代码，最大的现实风险是什么？",
          "answer": "浏览器实现滞后：新特性从发布到「widely available」（绝大多数在用的浏览器都支持）常要几年——不支持的浏览器里你的代码不会运行。自己开发时感知不到（现代浏览器自动更新），但真实产品控制不了用户用什么浏览器。"
        },
        {
          "question": "Babel 解决什么问题？它的 targets 配置由什么决定？",
          "answer": "Babel 把现代 JavaScript 转译（transpile）成老浏览器能理解的等价代码，让新语法在旧环境里跑。targets（如各浏览器的最低版本）取决于产品用途与目标受众：有的产品只支持较新浏览器就行，有的（面向大众/政企）必须支持很老的版本——转译得越狠，产物越保守。"
        },
        {
          "question": "官方说课程项目不需要为 Babel 操心——为什么还要学这一课？",
          "answer": "官方原话的边界是：课程项目的目的是实操练习，不是给客户交付生产级产品，所以不必每个项目都架转译流水线。但真实世界的工作里「浏览器支持矩阵 + 转译配置」是前端基建的常规部分——知道这套机制存在、术语都认识，读工作招聘、产品需求、支持表时才接得住。"
        }
      ],
      "optional": [],
      "note": "短课（官方正文四节：What is ECMAScript / Release schedule / Browser support / Babel，正文无代码块）。Assignment 两条均为「开眼界」性质且官方明文「有些内容还没教、不需要现在探索」——本站 tasks 如实转达该边界。本站 example 为转译概念示意（官方正文无代码）。与既有课程的衔接事实：Webpack 课的 loader 概念（babel-loader 即语法转译 loader）；zh.wikipedia 有 ECMAScript 条目（实测汉字 7507），Assignment 第 2 条的中文版登记之。",
      "why": "这一课治的是「名词混乱」：以后你在文档、招聘、教程里看到 ES2020、ES.next、ES6+、TC39 stage 3 这些词，都能落到同一条时间线上。它也解释了你已经在过的日子的由来——为什么本课程从第一天就教 const 和箭头函数（因为 ES6 就是现在的 JavaScript），以及为什么有的老项目里全是 var 和 function（那是 ES5 时代的遗产）。Babel 与 targets 则是真实前端基建的入门名词：现在不用会配，但至少要认识。",
      "sections": [
        {
          "h": "ECMAScript 是什么：标准与实现",
          "p": [
            "官方的开场很直白：从最早的课开始我们就一直在甩 **ES6** 这个词，却没花时间正经解释它是什么、对代码意味着什么——现在补上。",
            "**JavaScript 只是一门符合 ECMAScript 标准的编程语言**——标准由 Ecma International 制定。**ES6 是 2015 年夏天正式发布的版本**，包含*大量*新特性，让 JavaScript 写起来更容易、更干净。",
            "本课程你一直在学的就是这些新特性——因为，官方原话：**ES6 就是 JavaScript**。不存在「学完 JS 再学 ES6」的先后关系。"
          ]
        },
        {
          "h": "发布体系：从版本号到年份",
          "p": [
            "你可能也见过谈 ES7、ES8 或 ES2015、ES2017 特性的文章。混乱的根源：**ES6 发布后不久，做决定的委员会（TC39）把命名从版本号（ES5、ES6、ES7…）改成了发布年份**——ES6 又名 ES2015，一些文章说的 ES7 又名 ES2016，以此类推。",
            "节奏也变了：不再是「单个新版本携带一大堆新特性」（ES6 及以前的模式），改为**每年发布一版、每版少量新增**。",
            "实用结论：两套命名指同一条时间线；「每年一版」意味着特性是细水长流进来的——看到某个陌生语法，先查它是哪一年的版本、浏览器支持到什么程度，而不是恐慌「又出了个新 JS」。"
          ]
        },
        {
          "h": "浏览器支持：新特性不等于哪都能跑",
          "p": [
            "JavaScript 不断更新加特性的**问题**在于：浏览器跟上并实现新特性常常需要一段时间。一个新特性变成「**widely available**」（被绝大多数在用的现代浏览器与版本支持）**往往要几年**。这意味着，很不幸，**用全新特性写的代码在不支持它的浏览器里不会运行**。",
            "对大多数人这不是事——你几乎肯定在用会自动更新的现代浏览器。但**真实世界里，你卖产品给客户时控制不了人们用什么浏览器**访问你的站点。",
            "这就是「个人玩具」与「面向公众的产品」在语法选择上的分水岭：前者随便用最新的，后者要查支持矩阵、定最低版本。"
          ]
        },
        {
          "h": "Babel：转译到目标浏览器",
          "p": [
            "幸运的是这个问题**有解**：**Babel** 把你的现代 JavaScript 代码**转译（transpile）**成老浏览器能理解的代码。它可以按任意数量的目标（例如各浏览器的最低版本）配置转译——需要哪些 targets，取决于产品用途、目标受众等因素：有的产品只支持较新浏览器就挺好，有的必须严格得多、确保很老的浏览器也能跑。",
            "官方的诚实话（原话大意）：这**不是**你开每个课程项目都要操心的事——课程项目的目的是动手实操，不是给客户交付生产级产品。但了解这个局面、知道真实世界可能需要什么，是有好处的。",
            "与前面课程的衔接：你在 Webpack 课学过 loader 是「翻译非 JS 资源」的机制——语法转译在这条流水线里同样是 loader 的活（babel-loader 把转译接进打包流程）。本课只需认识 Babel 与 targets 这两个名词，配置实操留给真实项目需要时再学。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "// 本站示意：「转译」在做什么——同一逻辑的两种语法水平\n\n// 现代写法（ES6+，本课程一直在教的）\nconst greet = (name) => `Hello, ${name}!`;\nconst scores = [80, 92, 77];\nconst passed = scores.filter((s) => s >= 80).map((s) => ({ score: s }));\n\n// Babel 按老 targets 转译后的等价形态（示意，非逐字输出）\nvar greet = function (name) { return 'Hello, ' + name + '!'; };\nvar scores = [80, 92, 77];\nvar passed = scores.filter(function (s) { return s >= 80; })\n  .map(function (s) { return { score: s }; });\n// 箭头函数 → function、模板字符串 → 字符串拼接、const → var：\n// 语义不变，语法降级——老浏览器就能跑了",
          "note": "本站示意代码（官方正文无代码块）：演示转译的概念——同语义、低语法水平的等价改写。真实 Babel 输出更啰嗦（含辅助函数），targets 决定降级到哪一档；本课不要求会配置。"
        }
      ],
      "pitfalls": [
        {
          "title": "把 ES6 当成「要额外学的新方言」",
          "text": "官方原话：ES6 就是 JavaScript。你从本课程第一周写的 const、箭头函数、模板字符串就是 ES6——不存在「先学基础 JS 再升级 ES6」的路线，2015 年之后的 JS 教程默认都教它。"
        },
        {
          "title": "看到 ES7/ES2016 以为出了新版本要重学",
          "text": "命名改制后「ES+年份」每年都有一个，且每版只有少量新增——ES7 就是 ES2016，不是「颠覆性的新一代」。遇到陌生特性查一下版本年份与支持状态即可，不必焦虑。"
        },
        {
          "title": "在自己浏览器里能跑就以为哪都能跑",
          "text": "你的浏览器自动更新，永远最新——但产品的用户不是。面向公众的项目用新语法前先查「widely available」状态（MDN 每个特性页都有兼容性表），不满足就靠 Babel 按 targets 转译。"
        }
      ],
      "official": {
        "assignment": [
          "满足好奇心：看看 ES6（又名 ES2015）出现的全部新特性（lukehoban/es6features 仓库）——虽然其中很多你已经用过，但有几项我们还没专门讲（现在不需要去探索它们）。",
          "快速浏览各 ECMAScript 版本的发布时间线（Wikipedia 版本史条目，含 ES6 以来各年度版本的小摘要）——同样，有些你可能用过，有些你不认识、也不需要现在探索。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/javascript_in_the_real_world/ecmascript.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "36f57c8b1690ca55dd44b0f52ce8bd0a63ab25672ffbc12897fa8f13408cae80",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-javascript-asynchronous-code",
      "title": "Asynchronous Code",
      "zh": "异步代码",
      "group": 3,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-asynchronous-code",
      "summary": "JavaScript 是 Web 的语言，而 Web 上有些事必然很慢——比如从服务器取数据。异步函数就是「能在后台进行、同时其余代码继续执行」的函数。这一课讲两代异步方案：回调（callback）——作为参数传进另一个函数、在合适的时机被调用的函数，你从 addEventListener 起就一直在用，但多个回调按顺序串联会失控成「回调地狱」；Promise——「未来某个时刻可能产出一个值的对象」，用 .then() 告诉代码「等它 resolved 再执行里面的函数」。官方用一个 getData() 例子讲透同步思维取异步数据为什么拿到 undefined，以及 Promise 如何解决。Assignment 七份资料把事件循环（Event Loop）与 Promise 执行可视化讲到位。",
      "guide": "以下是官方原课的中文化梳理。这一课是异步三部曲的第一部（后两部：与 API 协作、Async 与 Await），也是整个课程后半段的地基——fetch、Promise、async/await、天气应用项目全部建立在这两个概念上。读正文抓一条故事线：Web 上有些事必然慢（网络请求），而同步思维假设一切都瞬间完成——官方 getData() 例子里 myData['whatever'] 拿到 undefined 就是这个假设破产的现场。第一代解法是回调：把「接下来要做的事」包成函数传进去，让执行方在时机成熟时调用——你其实早就在用（addEventListener 的第二个参数就是回调），但回调按特定顺序连环串联时会失控，这就是「回调地狱」。第二代解法是 Promise：一个「未来某个时刻可能产出一个值的对象」，.then() 挂上「等 resolved 之后要跑的逻辑」——链式结构让多层异步不再层层缩进。正文只负责建立直觉，具体语法官方明说「留给接下来要读的文章」——Assignment 的七份资料是本体：art-of-node 的 callbacks 节、davidwalsh 的 Promises 短文、四个视频（Promise 十分钟速成、Philip Roberts 的事件循环经典演讲、Lydia Hallie 的两支可视化——事件循环与 Promise 执行）、javascript.info 的 promise basics（有官方中文版）。事件循环是理解「异步代码到底怎么在单线程里跑」的钥匙，视频看着轻松，值得认真看两遍。",
      "understand": [
        "为什么需要异步：JS 是 Web 的语言，有些函数**必然要花不少时间**（如从服务器取数据）——异步函数 = **能在后台进行、其余代码照常执行**的函数",
        "**回调（callback）**：作为参数传进另一个函数、在外层函数内部被调用以完成某个例程或动作的函数（MDN 术语表定义）",
        "回调无处不在：addEventListener('click', fn) 就是把 fn 交给浏览器、点击发生时被调用——这个模式在 JS 代码里**一直**出现",
        "回调的失控形态：需要把好几个回调**按特定顺序串联**时容易失控——**回调地狱（callback hell）**；本课后面的模式与函数就是帮你远离它的",
        "**Promise**：本质上是一个**未来某个时刻可能产出一个值的对象**——处理异步的机制之一，在其他库与框架里也常见",
        "同步思维的破产现场（官方例子）：getData() 取数据要花时间，代码却假设它瞬间完成——myData['whatever'] 拿到的不是数据而是 **undefined**",
        "**.then()**：告诉代码**等 promise resolved 再执行里面的函数**——把「接下来要做的事」挂在产出的值到达之后",
        "Promise 的用武之地远不止取数据——现在学会，后面处处用得上（官方原话的意思）"
      ],
      "terms": [
        {
          "en": "Asynchronous（异步）",
          "zh": "函数能在后台进行、不阻塞其余代码执行——Web 上慢操作（网络请求等）的生存之道"
        },
        {
          "en": "Callback（回调函数）",
          "zh": "作为参数传入另一函数、在其内部被调用以完成某例程/动作的函数——addEventListener 的第二个参数就是"
        },
        {
          "en": "Callback hell（回调地狱）",
          "zh": "多个回调按特定顺序层层嵌套串联导致的失控形态——金字塔缩进、难以维护"
        },
        {
          "en": "Promise",
          "zh": "一个未来某个时刻可能产出一个值的对象——异步结果还没到时它先「占位」"
        },
        {
          "en": ".then()",
          "zh": "挂在 Promise 上的方法：等 promise resolved 后执行传入的函数，函数参数就是产出的值"
        },
        {
          "en": "Resolve（决议/兑现）",
          "zh": "Promise 成功产出值的时刻——.then() 里的函数从这一刻才开始跑"
        },
        {
          "en": "Event Loop（事件循环）",
          "zh": "JS 单线程调度异步操作的机制——Assignment 三支视频的主角，理解「异步怎么在单线程里跑」的钥匙"
        }
      ],
      "tasks": [
        "读 art-of-node 文章的 callbacks 一节（Assignment 第 1 条，GitHub 仓库）：理解回调如何处理异步操作",
        "读 David Walsh 的 Promises 文章（Assignment 第 2 条）：官方评价「好的起点，短小切题」",
        "看 Promise 入门视频（Assignment 第 3 条，Web Dev Simplified 的 JavaScript Promises In 10 Minutes）：感受 promise 在实战里的用法",
        "看「What is Event Loop?」视频（Assignment 第 4 条，Philip Roberts 在 JSConf EU 的经典演讲）：理解 JS 异步代码的工作机制",
        "看事件循环可视化视频（Assignment 第 5 条，Lydia Hallie 的 JavaScript Visualized 系列）：进一步理解 Event Loop——Web APIs、(Micro)task Queue 逐个画给你看",
        "看 Promise 执行可视化视频（Assignment 第 6 条，同系列）：理解 Promise 在 JS 里的执行过程",
        "读 javascript.info 的 promise basics 文章（Assignment 第 7 条，有官方中文版）：官方评价「对初学者极好的资源」——Promise 语法本体在这里"
      ],
      "quiz": [
        {
          "question": "什么是回调函数？举一个你从 Foundations 起就一直在用的例子。",
          "answer": "回调是作为参数传进另一个函数、在外层函数内部被调用以完成某个例程或动作的函数。例子：myDiv.addEventListener('click', function(){...})——把「do something」函数交给 addEventListener，myDiv 被点击时它才被调用。这个「把函数交出去、时机到了被叫回来」的模式在 JS 里无处不在。"
        },
        {
          "question": "官方的 getData() 例子里，myData['whatever'] 为什么拿到 undefined？",
          "answer": "因为 getData() 内部在从服务器取数据——这要花时间；但代码假设函数里的一切都瞬间完成，getData() 立刻返回时数据还在路上，myData 不是预期的数据对象而是 undefined。这就是同步思维套在异步操作上的破产现场——需要一种机制告诉代码「等数据取完再继续」。"
        },
        {
          "question": "用一句话概括 Promise 是什么，.then() 又做什么。",
          "answer": "Promise 是一个未来某个时刻可能产出一个值的对象——值还没到时它先占位。.then(fn) 把 fn 挂在 promise 上：等 promise resolved（成功产出值）再执行 fn，fn 的参数就是那个值。官方例子里 myData.then(function(data){ data['whatever'] }) 就是把「取值逻辑」推迟到数据真正到达之后。"
        },
        {
          "question": "什么情况下回调会「失控」？Promise 靠什么缓解它？",
          "answer": "需要把好几个回调按特定顺序串联时：每一步都嵌套在上一步的回调里，层层缩进成「回调地狱」——难读难改难排错。Promise 把它拉平：.then() 可以链式调用（一个 .then 返回下一个 promise），异步步骤排成一条平铺的链而不是越来越深的金字塔。"
        },
        {
          "question": "事件循环（Event Loop）在异步故事里扮演什么角色？（Assignment 视频主线）",
          "answer": "JS 主线程是单线程的：慢操作（网络请求、计时器）交给浏览器的 Web APIs 在后台跑，跑完把回调排进队列；事件循环不断检查「调用栈空了吗」，空了就把队列里的回调送上栈执行——这就是「后台进行、其余代码照常执行」的实现机制。Philip Roberts 的演讲与 Lydia Hallie 的可视化把这个循环逐帧画了出来。"
        }
      ],
      "optional": [],
      "note": "知识课。官方正文两节（Callbacks / Promises）加三段示例代码（addEventListener、getData 同步版、getData promise 版）；官方明说「具体语法留给接下来要读的文章」——本站正文遵循同一分工，只建直觉不展开 API 细节（细节在 Assignment 的 javascript.info promise basics，有官方中文版）。Assignment 七条中视频占四条：两支 Lydia Hallie 可视化 + Philip Roberts 事件循环经典演讲 + Web Dev Simplified Promise 速成——四支视频真实标题均已确认，一律不声称有中文字幕。art-of-node 仓库已迁至 max-mapper/art-of-node（官方链接 301 后实测 200）。",
      "why": "这一课是整个课程后半段的地基：下一课 fetch 返回的就是 Promise、.then() 链就是你取数据的日常；再下一课 async/await 官方明说「只是 Promise 的语法糖」——糖衣之下全是今天这两个概念。往回看，你从 Foundations 起写的每个 addEventListener 都是回调；往前看，天气应用项目就是「回调 → Promise → async/await」三课知识的总装。事件循环视频看着轻松，但它是你以后调试「为什么这行先跑」时的底层地图——值得认真看。",
      "sections": [
        {
          "h": "为什么需要异步：Web 的语言必然有慢操作",
          "p": [
            "官方开场把逻辑摆得很直白：JavaScript 是 Web 的语言，而 Web 上**有些函数必然要花不少时间才能完成**——比如从服务器取数据显示到站点上。",
            "如果所有代码都排队同步执行，一次慢请求就会把页面冻住。因此 **JavaScript 内置了对异步函数的支持**——换个说法：**能在后台进行、同时其余代码继续执行**的函数。",
            "这一课讲两代处理异步的方案：先出场的回调（过去最常见、现在特定场合仍大量使用），再是 Promise（现代代码与各大库框架的主角）。"
          ]
        },
        {
          "h": "回调：老牌主力",
          "p": [
            "定义（官方引 MDN 术语表）：**回调函数是作为参数传进另一个函数、随后在外层函数内部被调用、以完成某种例程或动作的函数**。",
            "官方例子就是你天天在写的代码：myDiv.addEventListener('click', function(){ /* do something! */ })——addEventListener 接收一个回调（那个「do something」函数），myDiv 被点击时调用它。",
            "你多半已经认出：这个模式在 JavaScript 代码里**一直**出现（官方原话 all the time）。回调在上述场合很好用——但**用回调可能失控**，尤其是需要把好几个回调**按特定顺序串联**起来的时候。",
            "这种失控形态有个专名：**回调地狱（callback hell）**——官方在正文里专门给了链接。本课余下部分讨论的模式与函数，就是帮你远离它的。"
          ]
        },
        {
          "h": "Promise：未来某个时刻可能产出一个值的对象",
          "p": [
            "官方先定调：JS 里处理异步代码有多种方式、各有用武之地；**Promise 是其中一种机制**，用别的库或框架时你会经常见到它——知道它是什么、怎么用很有价值。",
            "本质一句话：**promise 是一个可能在未来某个时刻产出一个值的对象**。",
            "官方用 getData() 讲透「为什么需要它」：设 getData() 从服务器取数据、清理后返回可用对象——问题是**取数据要花时间**，而代码不知道这件事，**假设函数里的一切都瞬间发生**。于是 const myData = getData(); const pieceOfData = myData['whatever'] 会出事：取值那一刻 getData() 多半还在取数的路上，myData 不是预期数据，而是 **undefined**。官方在这后面跟了一个字：Sad。",
            "我们需要某种方式告诉代码：**等数据取完再继续**。Promise 解决的就是这个问题。"
          ]
        },
        {
          "h": ".then()：等它 resolved 再跑",
          "p": [
            "官方把具体语法留给 Assignment 的文章，正文只给形态：假设 getData() 重构成**返回一个 Promise**——const myData = getData(); myData.then(function(data){ const pieceOfData = data['whatever'] })。",
            "读法：**myData.then(fn) 告诉代码等 promise resolved（值产出）再执行 fn**，fn 的参数 data 就是产出的值——「and THEN run the function inside」（官方注释原话）。",
            "对照上一个 undefined 现场：同样是「取完再用」，回调要把后续逻辑嵌进取数函数里，Promise 则让取数函数立刻返回一个「将来会有值」的占位对象，后续逻辑用 .then() 平铺挂在它后面——这就是它能缓解回调地狱的结构性原因。",
            "官方收尾提醒：想用 Promise 的场合**远不止取数据**——现在学会这些，往后非常有用。链式 .then()、.catch() 错误处理、Promise.all 等完整语法在 Assignment 的 javascript.info promise basics（有官方中文版）里。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "// 官方正文例子（略整理注释）：同步思维取异步数据 → undefined\nconst getData = function() {\n  // 去某个 API 取数据……\n  // 清理一下，作为对象返回：\n  return data\n}\n\nconst myData = getData()\nconst pieceOfData = myData['whatever']  // 出事：getData() 还在取数，myData 是 undefined\n\n// 官方正文例子：getData 重构成返回 Promise 之后\nconst myData2 = getData()          // 假设它现在返回一个 Promise……\n\nmyData2.then(function(data) {      // .then() 告诉它：等 promise resolved\n  const pieceOfData = data['whatever']  // 然后（THEN）再跑里面的函数\n})\n\n// 你早就在用的回调形态（官方 Callbacks 节例子）\nmyDiv.addEventListener('click', function() {\n  // do something!\n})",
          "note": "官方正文示例代码：三段合排——同步假设的破产现场、Promise + .then() 的解法、回调的日常形态。getData 是官方虚构的取数函数；Promise 的构造与完整 API 见 Assignment 的 javascript.info promise basics（官方中文版）。"
        }
      ],
      "pitfalls": [
        {
          "title": "以为异步函数「调用完值就在」",
          "text": "官方 undefined 现场的根源：慢操作（取数据）还没完成，后续代码已经跑到——值自然不在。解法不是「跑慢点」，而是把后续逻辑挂到完成事件上：Promise 的 .then()（或下下课的 await）。"
        },
        {
          "title": "把回调试微任务：随手嵌套三层以上",
          "text": "单个回调没问题（addEventListener 天天用）；失控发生在「按特定顺序串联好几个回调」——每步嵌进上一步的回调体，缩进成金字塔。发现自己在写第三层嵌套回调时，就是该换 Promise 链的信号。"
        },
        {
          "title": "跳过事件循环视频",
          "text": "「后台进行、其余代码照常执行」不是魔法：慢操作交给浏览器 Web APIs，完成后回调进队列，事件循环在主线程空闲时把它送上调用栈。不懂这个机制，以后遇到「为什么 console.log 的顺序和写的不一样」只能靠猜——Assignment 的三支可视化视频就是治这个的。"
        }
      ],
      "official": {
        "assignment": [
          "读 art-of-node 文章的 callbacks 一节：讲解回调如何处理异步操作。",
          "读这篇 Promises 文章（David Walsh）：好的起点，短小、切题。",
          "看这支关于 promise 的视频：感受实际开发中 promise 的用法。",
          "看标题为「What is Event Loop?」的视频：理解 JavaScript 里异步代码的工作机制。",
          "看这支可视化 Event Loop 的视频：进一步理解事件循环。",
          "看这支可视化 promise 的视频：理解 JavaScript 里的 Promise 执行。",
          "读这篇 promise basics 文章（javascript.info）：对初学者极好的资源。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/asynchronous_javascript_and_apis/asynchronous_code.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "1d202104f3cf44cdb43e1eb1ba0325a967a6898dcd86f2394dffa2a06e6fe006",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-javascript-working-with-apis",
      "title": "Working with APIs",
      "zh": "与 API 协作",
      "group": 3,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-working-with-apis",
      "summary": "Web 开发者最强大的能力之一：从服务器取数据、有创意地展示。API（Application Programming Interface）就是服务器对外提供功能与数据的窗口——大多通过 URL 访问，具体查法因服务而异。这一课用两个真实 API 走完全程：Visual Crossing 天气 API 讲清 endpoint、API key（注册申请、每请求携带、滥用追踪、免费/付费层级、安全边界）与查询构造器；Giphy API 则手把手五步演进——从 XHR 的老式痛苦到原生 fetch 的干净链式，再到 response.json() 的「又一个 Promise」、深层数据钻取（response.data.images.original.url）、img.src 赋值上屏。Assignment 三条把项目扩展成「按钮换图不刷新 + 搜索框 + 错误处理」，并钉死一个关键事实：API 回了 404 也是「有效响应」，fetch 不报错、.catch() 不会跑——非 2XX 要在 .then() 里手动检查。",
      "guide": "以下是官方原课的中文化梳理。这是异步三部曲的实战主场，也是天气应用项目的直接前置——正文很长，跟着官方的两个 API 走就不会迷路。第一条线（Visual Crossing）讲的是「API 世界的规矩」：endpoint 是访问特定功能/数据的专用 URL；多数服务要先注册拿 API key、每个请求都带上（VC 走 query string 参数）；key 让服务能关联你的请求量与频率——用于追踪滥用与回收成本（跑服务器要钱，VC 免费档 1000 次/天、企业档无限次加能源海事数据）；key 安全是职业习惯——有机器人专扫 GitHub 上硬编码的 key，官方连「demo 里 key 就在 URL 里、嗅探者和背后的人都能拿到」都点了名；但课程阶段用免费 key 风险有限，真正的 key 保护要服务端处理（后端课程再学）。第二条线（Giphy）讲的是「怎么把数据取进代码」：老式 XMLHttpRequest 样板代码痛苦到官方吐槽「Ouch」，第三方库（axios / superagent）缓解过一阵，现在浏览器原生 fetch 是主角——它返回 Promise（上一课的知识直接接上），.then() 里 response.json() 返回的又是 Promise，所以要两层 .then()；数据在响应对象里嵌得很深，钻到 response.data.images.original.url 才是图片地址，赋给 img.src 上屏。Assignment 第 3 条藏着本课最值钱的坑点：fetch 只在网络层失败时 reject——服务器回了 404 也是「有效响应」，.catch() 不会跑，非 2XX 状态要在 .then() 里查 Response 对象的属性（如 ok / status）手动处理。一个如实说明：官方 overview 第 4 条承诺讲「请求为什么可能被浏览器拦、怎么修」（即 CORS），但官方正文没有对应小节——本站在正文末补了一节现象级说明（标注本站补充），实操中你在天气应用调试时大概率会撞见它。",
      "understand": [
        "从服务器取数据并展示是 Web 开发者最强大的能力之一；服务器可能是某站专用（博客/用户数据/游戏高分）或开放服务（天气/股价）——**访问与使用方法本质相同**",
        "**API**（Application Programming Interface）：服务器对外提供功能与数据的接口；大多通过 **URL** 访问，查询细节因服务而异、通常写在服务文档里",
        "**endpoint**：访问 API 内特定功能或数据的专用 URL——如 Giphy 的 api.giphy.com/v1/gifs/translate",
        "**API key**：多数服务要先注册账号申请；拿到后**通常每个数据请求都要带上**（Visual Crossing 走 query string 参数）——key 随机且唯一，服务借它关联你的请求量与频率",
        "key 机制的两个目的：**追踪系统与数据的滥用** + **缓解与回收运营成本**（跑服务器要钱；VC 免费档 1000 次/天，企业档最高 150 美元/月、无限调用加能源/海事数据）",
        "**key 安全**：有机器人专扫 GitHub 仓库里硬编码/未保护的 key；客户端的 key 是「公开知识」——URL 里的 key 嗅探者与旁观者都能拿到；真正的保护要服务端处理（环境变量、后端代理——后续课程）",
        "取数工具演进：**XMLHttpRequest**（老式、样板痛苦但全浏览器可用）→ 第三方库 **axios / superagent** → 浏览器原生 **fetch**（本课主角）",
        "fetch 返回 **Promise**；**.then() 里的 response.json() 返回的又是一个 Promise**——所以取 JSON 数据要两层 .then()；数据常嵌得很深，要逐层钻取（response.data.images.original.url）",
        "**错误处理的真相（官方 Assignment 明文）**：API 有响应就算有效——**哪怕 404 或其他非 2XX，fetch 不抛错、.catch() 不会跑**；后续代码抛错（如访问 undefined 的属性）或手动 throw 才会进 .catch()；非 2XX 要在 .then() 里查 Response 对象属性（ok / status 等）手动处理"
      ],
      "terms": [
        {
          "en": "API (Application Programming Interface)",
          "zh": "应用程序编程接口：服务器对外提供功能与数据的窗口——大多经 URL 访问"
        },
        {
          "en": "Endpoint（端点）",
          "zh": "API 内访问特定功能/数据的具体 URL——服务的文档会写明每个 endpoint 的参数与返回"
        },
        {
          "en": "API key",
          "zh": "服务发给你的随机唯一凭证：每个请求携带——服务借它计量、防滥用、分免费/付费层级；客户端代码里的 key 等于公开"
        },
        {
          "en": "Query string parameter",
          "zh": "URL 问号后的键值对（?key=xxx&s=cats）——API 传参最常见形态，Visual Crossing 与 Giphy 都用它"
        },
        {
          "en": "XMLHttpRequest (XHR)",
          "zh": "浏览器取数的老式原生函数：全浏览器可用但样板代码痛苦——被 fetch 取代的上一代"
        },
        {
          "en": "fetch()",
          "zh": "浏览器原生 HTTP 请求函数：fetch(url) 返回 Promise——.then() 接响应、.catch() 接网络层错误"
        },
        {
          "en": "response.json()",
          "zh": "把响应体解析成 JS 对象的方法——返回值又是一个 Promise，需要再一层 .then()（或 await）"
        },
        {
          "en": "Response 对象",
          "zh": "fetch 成功 resolve 的响应封装：ok（是否 2XX）、status（状态码）等属性——非 2XX 手动检查靠它"
        }
      ],
      "tasks": [
        "浏览 Public APIs 清单（Assignment 第 1 条，n0shake/Public-APIs 仓库）：官方原话「让你的想象力野起来」——为天气应用之外的练手项目挑个数据源",
        "扩展 Giphy 小项目（Assignment 第 2 条）：加一个按钮，不刷新页面就取一张新图",
        "加搜索框（Assignment 第 3 条）：让用户搜特定 gif；并研究加 .catch() 管理错误（如无效 URL）——同时记住官方钉死的事实：404 等非 2XX 是「有效响应」，fetch 不抛错、.catch() 不跑；要条件化处理就在 .then() 里查 Response 对象的属性（ok / status 等，见 MDN Response 文档）",
        "动手（本站补充）：按官方正文注册 Visual Crossing 免费账号拿到 API key，在浏览器地址栏里手动拼一次带 key 的天气请求——亲眼看到 JSON 响应再进天气应用项目"
      ],
      "quiz": [
        {
          "question": "用自己的话说清 API、endpoint、API key 三者的关系。",
          "answer": "API 是服务器对外提供功能与数据的整套接口（大多经 URL 访问）；endpoint 是 API 里干某件具体事的那个 URL（如 Giphy 的 /v1/gifs/translate 管搜图翻译）；API key 是你访问这套接口的身份凭证——注册申请、每个请求携带（常走 query string），服务用它计量与防滥用。一句话：拿着 key 去敲指定 endpoint 的门，API 是整栋楼。"
        },
        {
          "question": "为什么 API 服务要发 key、分免费与付费层级？官方举的 Visual Crossing 数字是什么？",
          "answer": "两个目的：追踪滥用（key 唯一，请求量与频率都能关联到人）与回收成本（跑服务器要钱——单次请求只值几分之一美分，但热门应用每分钟几千次请求会让成本迅速膨胀）。VC 的层级：免费档每天 1000 次调用、信息有限（个人项目够用）；企业档最高 150 美元/月、无限调用加能源/海事等数据。应用成功想加功能，多半要付费升级。"
        },
        {
          "question": "fetch 的 .then(response) 里为什么通常要「再来一层 .then()」？",
          "answer": "两层 Promise：fetch resolve 出来的是 Response 对象（响应外壳），要拿到 JS 对象形态的数据得调 response.json()——它解析响应体、返回的又是一个 Promise。所以官方例子里第一层 .then() return response.json()，第二层 .then() 才拿到可钻取的数据对象（response.data.images.original.url）。用 async/await 写就是两个 await，下下课讲。"
        },
        {
          "question": "服务器回了 404，.catch() 会执行吗？正确的处理方式是什么？",
          "answer": "不会。官方 Assignment 明文：只要 API 有响应——哪怕 404 或其他非 2XX——对 fetch 来说都是有效响应，promise 正常 resolve、.catch() 不跑；只有网络层失败、后续 JS 代码抛错（如访问 undefined 的属性）或手动 throw 才进 .catch()。正确处理：在 .then() 里查 Response 对象的属性（response.ok 是否 true、response.status 状态码），按分支处理非 2XX。"
        },
        {
          "question": "为什么「推到前端的 API key 是公开知识」？课程项目为什么又允许这么干？",
          "answer": "前端代码和请求 URL 用户全看得到——key 写在里面等于登报告知；还有机器人专扫 GitHub 上硬编码的 key，嗅探器也能从流量里捡到。课程阶段可接受的原因（官方明文）：我们用的是免费 API，应用只有自己与作品集观众在用——暴露没有实际后果；但敏感/付费 key 绝不能这么放，真正的保护要靠服务端（环境变量、后端代理——后续课程教）。"
        }
      ],
      "optional": [],
      "note": "长课（官方正文四节：APIs / Fetching data / Let's do this / Assignment，约 15.8 KB，含 XHR 与 fetch 五步演进共 8 个代码块）。如实登记两点：① 官方 overview 第 4 条「解释 API 请求为什么可能被浏览器拦、如何修」在官方正文**没有对应小节**——本站末节以「本站补充」名义给出现象级说明（CORS），不冒充官方内容；② 正文 statically CDN 配图 1 张（响应对象钻取截图）按既有口径剔除。核验新事实：官方引用的 devfactor「2375 美元亚马逊事故」存档链接把原路径写错（2014-12-30 实为 2014/12/30），修正后的存档地址实测 200、标题「My $2375 Amazon EC2 Mistake」；jsbin 演示命令行 403（反爬）、真实浏览器实测 bin 在位；axios/superagent 仓库已迁移（mzabriskie→axios、visionmedia→forwardemail，官方链接 301 后 200）。",
      "why": "这一课把「异步」从概念变成生产力：fetch + Promise 链是你从此以后取任何外部数据的标准姿势，而天气应用项目（两课之后）就是它的总装现场。API key 的规矩与坑（层级、限额、前端暴露）是真实接活的日常——作品集项目要接地图、汇率、新闻、天气，全都长这个样子。Assignment 第 3 条的「404 不进 catch」更是面试与排错的高频考点：多少人对着明明报 404 却走进 .then() 的代码怀疑人生——今天先把这句话记住。",
      "sections": [
        {
          "h": "API：服务器的对外窗口",
          "p": [
            "官方开场定位：Web 开发者能做的最强大的事情之一，是**从服务器取数据、有创意地展示在站点上**。服务器有的专为某站存在（博客文章、用户数据、游戏高分——什么都行），有的是**开放服务**、给任何想用的人供数（天气数据、股价）。两种情况下，**访问与使用数据的方法本质相同**。",
            "对外提供功能与数据的服务器通常走 **API**（Application Programming Interface，应用程序编程接口）。请求数据的方式有多种，但**基本都在干同一件事**：API 大多通过 **URL** 访问，怎么查询这些 URL 的细节因具体服务而异——写在服务的文档里。",
            "官方用 **Visual Crossing** 天气 API 演示：取某地当前天气，把城市名放进 URL 路径——weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london。直接把这条 URL 贴进浏览器（官方原话：我们等你），大概率得到错误：「No API key or session found. Please verify that your API key parameter is correct.」——这就引出 API 世界的头号规矩：key。"
          ]
        },
        {
          "h": "API key：身份、计费与安全",
          "p": [
            "多数情况下，取数据之前要**先注册账号、向服务申请 API key**；拿到后 **key 通常要随每个数据请求携带**。Visual Crossing 的方式是 query string 参数：…/timeline/london?key=11111111111111111。",
            "key 是**随机且唯一**的——服务能把你的 key 与你对数据的请求关联起来：请求了多少、多频繁。发 key 让服务能**追踪对系统与数据的滥用**，也是**缓解与回收运营成本**的手段。官方算了笔账：跑服务器要钱——单次请求可能只值几分之一美分，但你要是用 API 做了个全世界都在用的天气应用，每分钟几千人取数，成本会迅速膨胀成可观数目。",
            "所以几乎所有 API 服务都有付费层级：更高频的请求、更低层级拿不到的数据。Visual Crossing 免费档每天 1000 次调用、信息有限（**个人项目足够**）；企业档每月无限调用、加能源数据、海事数据等全套铃铛（定价页官方给了链接）——应用成功了想加功能，多半要付费升级。",
            "**key 安全是重要习惯**（尤其付费档）：有大量机器人专扫 GitHub 仓库里硬编码/未保护的 API key，坏人拿着你的 key 用**你付过钱的**服务与数据——官方在这里引了 2014 年那篇著名的「2375 美元亚马逊 EC2 事故」文（存档）。眼尖的读者可能已经发现上面演示的问题：**key 就在 URL 请求里**——网络嗅探器随手就能捡到，更别提背后看你屏幕的人。",
            "官方给课程阶段定了调：这一点现在**基本是 moot（无实际意义）**——我们用的是免费 API，应用只有自己和看作品集的人用；但要**记下这种 key 用法的严重局限**：保护 key 需要服务端处理，本课只讲前端概念——Full Stack JavaScript 路径的后端部分会教。"
          ]
        },
        {
          "h": "第一次请求：Visual Crossing 实操",
          "p": [
            "官方路线：注册 Visual Crossing 免费账号拿 key（key 在账号 profile 页）——然后带上 key、换个你选的城市再请求一次，这次会得到正经响应：一段 JSON（官方贴了伦敦 2024-07-06 的响应节选：queryCost、经纬度、时区、days 数组里每天的温度/降水/风速/日出日落……）。",
            "官方提醒：这段预览**只是冰山一角**，实际响应长得多——所以后面「处理数据」的功课（天气应用项目第 3 步）才有必要。",
            "正文还有个 note：不知道怎么构造查询？用 **Visual Crossing 的 query builder**——只输入地区它就帮你搭查询；输出默认在 Grid 标签，点 **API 标签**就能看到刚才那个网格背后的查询是怎么构造的（官方原话：Neat, isn't it?）。",
            "官方祝贺你：**第一个 API 请求完成了**。"
          ]
        },
        {
          "h": "取数工具演进：从 XHR 之痛到原生 fetch",
          "p": [
            "数据怎么进代码？几年前主流是 **XMLHttpRequest**：所有浏览器都还能用，但**不好用**——官方贴了它的样板代码（window.XMLHttpRequest 与 IE 的 ActiveXObject 双分支、try/catch 套 try/catch、open 加 send），然后给了两个词的评价：**Ouch. That was painful.**",
            "被这份痛苦折磨的开发者写了第三方库来接管：**axios** 与 **superagent** 是较流行的两个，各有长短。",
            "更近的时代，浏览器实现了原生新函数——本课的主角 **fetch**：fetch('https://url.com/some/url').then(function(response){ /* 成功响应 */ }).catch(function(err){ /* 错误 */ })。官方让你滚回上面再看一眼 XHR 的写法、欣赏一下这段多干净——然后点题：注意到 .then() 和 .catch() 了吗？还记得它们是什么吗？（**PROMISES!**——上一课的知识原样接上。）"
          ]
        },
        {
          "h": "Giphy 实战：把一张随机 gif 弄上页面（五步演进）",
          "p": [
            "官方换 **Giphy API** 做完整演示：网页上显示一张随机 gif。前置：注册 Giphy 拿免费 key（quick-start 文档）；Giphy 有多种搜图方法（文档里都写了），今天用**最简单够用的 translate endpoint**：正确 URL 是 api.giphy.com/v1/gifs/translate，必带两个参数——你的 api_key 和搜索词 s；还有可选参数缩小结果（如 rating 按内容敏感度过滤）。拼起来长这样：'https://api.giphy.com/v1/gifs/translate?api_key=YOUR_KEY_HERE&s=cats&rating=g'（官方注释：当然搜的是猫）。浏览器里试这条 URL，顺利的话得到一长串数据、没有错误。",
            "**第 1 步**：全部写进单个 HTML 文件——body 里一个空 img 标签加一个空 script 标签（官方给了完整骨架）。script 里先选图片元素存变量：const img = document.querySelector('img')——等会儿拿到 URL 就改它。",
            "**第 2 步**：加 fetch，.then() 里 console.log(response.json())。浏览器打开这个 HTML：页面上什么都看不到，但控制台**应该有东西**。官方点出全流程最烧脑的部分：**从服务器响应里 decipher（ deciphering）出你要的数据**——检查控制台会发现返回的是**又一个 Promise**……要拿到数据得再来一个 .then()。",
            "**第 3 步**：第一层 .then() 里 return response.json()，第二层 .then() 里 console.log(response)——现在是 JS 对象了；仔细看，要的图片 URL **嵌得相当深**：钻过层层对象才到 response.data.images.original.url。**第 4 步**：把 console.log 换成钻取路径。**第 5 步**：img.src = response.data.images.original.url——一切顺利的话，**每次刷新页面都是一张新图**。",
            "迷路了就看官方给的 jsbin 演示项目（canofar）——除了「华丽的样式」，你的版本应该长那样。官方最后再敲一次警钟：我们把这个 key 推到了前端——**免费 key 才可以这么干**；客户端的 key 是公开知识，敏感与非免费 key 必须小心，不推前端的 key 处理法后续章节会教。"
          ]
        },
        {
          "h": "错误处理的真相：404 不进 .catch()",
          "p": [
            "Assignment 第 3 条要求给搜索功能配 .catch() 管错误（如无效 URL），但官方立刻钉死一个大多数人想不到的事实：**只要 API 有响应——哪怕是 404 Not Found 或其他非 2XX——那也是有效响应，fetch 不会抛错，.catch() 不会执行**。",
            ".catch() 会跑的情形：网络层失败（域名解析不了、断网）、你**后续的 JS 代码**抛错（比如访问 undefined 的属性——钻取路径写错时天天发生）、或你自己手动 throw。",
            "想条件化处理「API 没给你想要的响应」（如 404），要在 **.then() 里手动查**：官方指向 MDN 的 **Response 对象文档**——ok（是否 2XX 的布尔）、status（状态码）等属性就是检查点。惯用形态：.then(response => { if (!response.ok) throw new Error('HTTP ' + response.status); return response.json(); })——手动 throw 之后 .catch() 才接得住。",
            "这条规则的根子在 Promise 语义：fetch 的 promise resolve 表示「HTTP 层完成了一次往返」，不表示「业务上成功」——两层含义分开，各查各的。"
          ]
        },
        {
          "h": "本站补充：请求被浏览器拦下时（CORS）",
          "p": [
            "如实说明：官方 overview 第 4 条写着「解释你的 API 请求为什么可能被浏览器拦、怎么修」，但官方正文没有对应小节——本节为**本站补充**的现象级说明，帮你在实操中认出它。",
            "现象形态：fetch 一个明明存在的 URL，控制台报跨域错误（典型字样：No 'Access-Control-Allow-Origin' header is present）、请求被浏览器拦截——这不是你的 URL 写错，也不是服务器宕机，而是浏览器的**同源策略**在执行访问控制：页面从 A 源加载、脚本却向 B 源要数据，B 的响应头里没有明确放行 A，浏览器就拒收。",
            "关键认知：**拦人的是浏览器，不是服务器**——同一条 URL 贴进地址栏或 curl 里往往能拿到数据。所以「修」的方向在**服务端**：正规解法是目标 API 在响应头带 Access-Control-Allow-Origin 放行你的源（正规开放 API 对公开调用通常已放行，Giphy、Visual Crossing 都是）；自己项目里的常见正解是走自己的后端代理转发（后端请求不受浏览器同源策略约束）。本课与天气应用项目用到的公开 API 都放行前端直连——撞到 CORS 多半发生在用了不提供浏览器直连的接口时，认出这个错误、知道原因与正解方向即可，绕开它的「前端黑科技」不是本课范围。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "// 官方正文示例的最终形态（Giphy 五步演进合排，Promise 版）\nconst img = document.querySelector('img');\nfetch('https://api.giphy.com/v1/gifs/translate?api_key=YOUR_KEY_HERE&s=cats&rating=g')\n  .then(function(response) {\n    return response.json();          // 注意：json() 返回的又是一个 Promise\n  })\n  .then(function(response) {\n    img.src = response.data.images.original.url;   // 钻取深层数据、赋值上屏\n  });\n\n// 老式 XHR（官方正文吐槽对象，仅供对照「fetch 有多干净」）\nif (window.XMLHttpRequest) {                  // Mozilla, Safari, ...\n  request = new XMLHttpRequest();\n} else if (window.ActiveXObject) {            // IE\n  try { request = new ActiveXObject('Msxml2.XMLHTTP'); }\n  catch (e) {\n    try { request = new ActiveXObject('Microsoft.XMLHTTP'); }\n    catch (e) {}\n  }\n}\nrequest.open('GET', 'https://url.com/some/url', true);\nrequest.send(null);\n// 官方评价：Ouch. That was painful.",
          "note": "官方正文示例代码：fetch 五步演进的终点形态 + XHR 对照。404 等非 2XX 的 response.ok 检查形态在本站补充节正文里（官方 Assignment 第 3 条明文该事实）；async/await 改写版是下下课 Practice 节的原样内容。"
        }
      ],
      "pitfalls": [
        {
          "title": "以为 404 会进 .catch()",
          "text": "官方 Assignment 明文钉死的事实：API 有响应就是有效响应——404、500 都让 fetch 正常 resolve，.catch() 纹丝不动。非 2XX 要在 .then() 里查 response.ok / response.status 手动处理（或手动 throw 让 catch 接住）。"
        },
        {
          "title": "把 response.json() 的返回值当对象用",
          "text": "json() 返回的是又一个 Promise——直接 .data.images 钻取会拿到 undefined 的属性报错。要么第二层 .then()，要么（下下课后）await response.json()。控制台里「怎么打印出来是个 Promise」就是撞上了它。"
        },
        {
          "title": "把付费/敏感 key 硬编码进前端推上 GitHub",
          "text": "客户端的 key 是公开知识：URL 里、代码里、构建产物里都一样——还有机器人专扫 GitHub 捡 key（官方引了 2375 美元亚马逊事故存档）。课程项目的免费 key 无所谓（GitHub 可能弹泄露警告，天气应用课官方明文说没关系）；真实项目的 key 必须待在服务端（环境变量 + 后端代理）。"
        }
      ],
      "official": {
        "assignment": [
          "看看这份 Public APIs 清单（n0shake/Public-APIs），让你的想象力野起来。",
          "扩展我们的小项目：加一个按钮，不刷新页面就取一张新图。",
          "加一个搜索框让用户搜特定 gif；并研究加 .catch() 管理错误（如无效 URL）——注意：API 有响应（哪怕 404 等非 2XX）对 fetch 都是有效响应、不会抛错，.catch() 不会跑；后续 JS 代码抛错（如访问 undefined 的属性）或手动 throw 才可能进 catch。要条件化处理非预期响应（如 404），需在 .then() 里手动检查——Response 对象的有用属性见 MDN 文档。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/asynchronous_javascript_and_apis/working_with_apis.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "efba6ae787028903a7d0d7067e86cdca9c41bf07c740244619780f4ccd170e92",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-javascript-async-and-await",
      "title": "Async and Await",
      "zh": "Async 与 Await",
      "group": 3,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-async-and-await",
      "summary": "异步代码一忙起来就难跟读——async 与 await 两个关键字让它读起来更像同步代码：样子更干净，异步的好处一样不少。核心事实三条：函数声明前加 async，它就自动返回 promise——return 等于 resolve、throw 等于 reject；await 是「暂停直到完成」——把本该 .then() 接的值直接赋给变量，后面就能按同步写法用；async/await 只是 Promise 的语法糖（官方原话 syntactical sugar）。错误处理有两条路：调用处链 .catch()，或函数体内 try...catch。Practice 节把上一课 Giphy 的 Promise 代码五步重构成 async/await 版——顺手钉死一个事实：非模块 script 的顶层不能用 await，得包一层 async 函数。",
      "guide": "以下是官方原课的中文化梳理。这一课没有新概念——它是上一课 Promise 的「换装」：官方开篇就摆出两段完全等价的代码（getPersonsInfo 的 .then() 版与 async/await 版），第二段更像你习惯写的函数，这就是全部卖点：可读性。抓三个核心事实。一，async 关键字：声明异步函数的开关（函数内想用 await 必须先有它）；async 函数自动返回 promise——return 一个值等于 resolve 那个值、throw 等于 reject，所以「async 函数返回什么」的答案永远是 promise。二，await 关键字：「pause until done」——它站在一个 promise 前面，等它 resolve、把产出的值直接交给你赋值，后续代码就能用同步的姿势接着写。三，官方反复敲的重点：async 函数只是 promises 的语法糖——行为一模一样，Promise 的全部知识（包括上一课「404 不进 catch」）原样适用。错误处理两条路都合法：调用处 asyncFunctionCall().catch(...)，或函数体内 try { await ... } catch (error) {...}——选哪条看代码形态，官方说时间久了自然有手感。Practice 节值得亲手跟着走：把 Giphy 的五步 .then() 链重构成 async/await 版，中间会撞到「await 不能用在非模块 script 顶层」的硬限制（官方明文，解法是包一层 async 函数）——以及 response.json() 返回 promise 这个老朋友（所以它前面也要 await）。Assignment 两条文章一条视频：javascript.info 的 async/await 教程（有官方中文版）、codeburst 的示例集（命令行 403、真实浏览器实测可达）、Wes Bos 在 dotJS 2017 的演讲。",
      "understand": [
        "动机：异步代码**事情一多就难跟读**——async 与 await 让异步代码**读起来更像同步代码**：样子更干净，异步的好处保持不变",
        "官方开篇的等价性：getPersonsInfo 的 .then() 版与 async/await 版**做完全相同的事**——从服务器取信息、处理、**都返回 promise**",
        "**async 关键字**：让 JS 引擎知道你在声明异步函数；**函数内使用 await 的前提**；可以用在任何能写普通函数的地方（函数声明/箭头函数/forEach 回调/.then 回调……）",
        "async 函数**自动返回 promise**：函数里 **return = resolve**、**throw = reject**——「async 函数返回什么」的答案永远是 promise",
        "**官方原话：async 函数只是 promises 的语法糖（syntactical sugar）**——不是新机制，是换了写法的 Promise",
        "**await 关键字**：告诉 JS **等异步动作完成再继续**函数——像「pause until done」；用在「本来要 .then() 接值」的地方：把结果直接赋给变量，之后按同步代码的姿势用",
        "错误处理两条路：调用处链 **.catch()**（async 函数返回的就是 promise）；或函数体内 **try...catch**——try 块抛错就跑 catch 块（同步代码同样适用）；怎么选看代码怎么写，官方的建议是跟着感觉走",
        "**硬限制（官方 Practice 明文）**：非模块 script 的**顶层不能用 await**——要包一层 async 函数再调用"
      ],
      "terms": [
        {
          "en": "async",
          "zh": "函数声明前的关键字：标记异步函数、解锁函数体内的 await——该函数从此自动返回 promise"
        },
        {
          "en": "await",
          "zh": "「暂停直到完成」：等一个 promise resolve、把产出的值直接交给赋值——替代 .then() 的取值姿势"
        },
        {
          "en": "Syntactical sugar（语法糖）",
          "zh": "官方定性：async/await 只是 Promise 的另一种写法——机制没变，样子更甜"
        },
        {
          "en": "try...catch",
          "zh": "错误处理语句：try 块抛错就跑 catch 块——配 await 在 async 函数体内就地接错（同步代码也适用）"
        },
        {
          "en": "return = resolve / throw = reject",
          "zh": "async 函数的返回值语义：return 一个值等于 resolve 那个值；抛出错误等于 reject 这个 promise"
        }
      ],
      "tasks": [
        "读 javascript.info 的 Async/await 教程（Assignment 第 1 条，有官方中文版）：扎实的 async/await 入门",
        "读 codeburst 的 Async/Await by Example 示例文（Assignment 第 1 条附带）：好的用例集——命令行访问 403，浏览器打开正常（已实测）",
        "看 Wes Bos 的 Async + Await 视频（Assignment 第 2 条，dotJS 2017 演讲）：官方评价「对 async/await 与其目的的好概览，还带一个特别技巧」",
        "动手（本站补充）：把官方开篇的 server 抽象代码块贴进控制台，再先后跑两个版本的 getPersonsInfo('Thor')——亲眼看官方说的「两个函数行为完全相同、都返回 promise」（.then 打印与 await 包壳各试一次）"
      ],
      "quiz": [
        {
          "question": "async 关键字做了哪三件事？（官方 The async keyword 节的三个事实）",
          "answer": "一，告诉 JS 引擎你在声明异步函数——这也是函数内使用 await 的前提；二，让这个函数自动返回 promise；三，改写函数内 return/throw 的语义：return 一个值等于 resolve 那个值，throw 等于 reject 这个 promise。所以问「async 函数返回什么」，答案永远是 promise——哪怕你 return 的是个字符串。"
        },
        {
          "question": "await 在做什么？它替代了 Promise 写法里的什么部分？",
          "answer": "await 告诉 JS「等这个异步动作完成再继续函数」——官方的比喻是 pause until done 关键字。它用在「本来要 .then() 接值」的地方：不再把后续逻辑包进 .then(fn) 的回调，而是 const result = await somePromise() 直接拿值——之后 result 就像同步代码的变量一样用。"
        },
        {
          "question": "「async 函数只是 promises 的语法糖」——这句话对错误处理意味着什么？",
          "answer": "意味着 Promise 的错误机制原样适用：async 函数抛错 = 它返回的 promise 被 reject。所以两条路都通——调用处链 .catch(err => ...)（跟普通 promise 一样），或在 async 函数体内用 try...catch 把 await 包起来就地接错。选哪条看代码形态，官方说时间久了自然有手感。"
        },
        {
          "question": "官方 Practice 里，为什么不能直接在 <script> 顶层写 await fetch(...)？官方的解法是什么？",
          "answer": "官方明文：await 不能用在非模块 script 的顶层（top level）——那是模块才有的待遇。解法：创建一个 async 函数把 API 调用包进去（官方例子里是 async function getCats() {...}），再调用 getCats()。函数体内部 await 随便用。"
        },
        {
          "question": "Giphy 重构版里，为什么 response.json() 前面也要加 await？",
          "answer": "老朋友：json() 返回的又是一个 Promise（上一课钉过）。await fetch 拿到的 response 与 .then 版里传给回调的是同一个对象——.json() 的 promise 也要 await 才能拿到解析后的数据对象（const catData = await response.json()）。两层 promise，两个 await——语法糖再甜，promise 的本质不变。"
        }
      ],
      "optional": [],
      "note": "知识课。官方正文结构特殊：Introduction 先摆两段等价代码（getPersonsInfo 的 then 版与 async 版）+ server 抽象代码块（官方邀请读者贴进控制台亲手验证等价性——本站 tasks 第 4 条照办），Lesson overview 六条，正文四节（async 关键字 / await 关键字 / 错误处理 / Practice）。Practice 节是上一课 Giphy 代码的五步重构（含「非模块 script 顶层不能用 await」硬限制）——本站 sections 与 examples 忠实呈现。Assignment 的 codeburst 文命令行 403（Medium 系反爬），真实浏览器实测 h1「JavaScript ES 2017: Learn Async/Await by Example」（Brandon Morelli）——按批次 3 Medium 先例不入受限；javascript.info 教程有官方中文版（zh.javascript.info/async-await，实测汉字 2414）。视频一律不声称有中文字幕。",
      "why": "这是异步三部曲的收束：从此你看现代 JS 代码库（以及本课程后面的 Node/后端部分）里满屏的 async/await 都不再是天书——而你知道糖衣之下全是 Promise，「404 不进 catch」「json() 返回 promise」这些事实一条不少地跟着过来。天气应用项目官方明文「promises 和 async/await 随意，但两种都该练熟」——这一课就是让你两只手都会用。写新代码时 async/await 的可读性优势会立刻兑现：错误处理集中在一个 try...catch 里，数据流从上到下一条线。",
      "sections": [
        {
          "h": "为什么需要 async/await：等价的两段代码",
          "p": [
            "官方开场：异步代码**事情一多就难跟读**。async 与 await 是两个能让异步代码**读起来更像同步代码**的关键字——代码样子更干净，异步的好处一样不少。",
            "开篇即证据：两段代码**做完全相同的事**——都从服务器取信息、处理、返回 promise。第一段是 .then() 写法（getPersonsInfo 里 return server.getPeople().then(people => people.find(...))）；第二段：async function getPersonsInfo(name) { const people = await server.getPeople(); const person = people.find(...); return person; }——第二段看起来**更像你习惯写的那种函数**。",
            "官方让你注意两个细节：函数声明前的 **async** 关键字、server.getPeople() 前的 **await** 关键字。想亲手跑：把官方给的 server 抽象代码块（people 数组 + getPeople() 返回一个 setTimeout 两秒后 resolve 的 Promise——模拟延迟网络调用）贴在函数定义前面。「server」怎么工作不重要、只是个抽象——目标是**亲眼看到两个函数行为完全相同、都返回 promise**。"
          ]
        },
        {
          "h": "async 关键字：自动返回 promise 的函数",
          "p": [
            "**async 关键字让 JavaScript 引擎知道你在声明一个异步函数**——这也是在任何函数内使用 await 的前提条件。",
            "三条核心语义（官方原话级）：用 async 声明的函数**自动返回一个 promise**；在 async 函数里 **return 等于 resolve 一个 promise**；同样，**throw 一个错误等于 reject 这个 promise**。",
            "官方划的重点：**async 函数只是 promises 的语法糖（syntactical sugar）**——没有新机制，只有新写法。",
            "async 可以用在**任何创建函数的方式**上——换句话说：**能用普通函数的地方就能用 async 函数**。官方给了三个「可能不那么直观」的例子：const yourAsyncFunction = async () => {...}（箭头函数）；anArray.forEach(async item => {...})（forEach 回调——官方注释：也可以在这里用 .map 返回 promise 数组喂给 Promise.all()）；server.getPeople().then(async people => {...})（.then 回调里的 async）。官方贴心地说：看不懂没关系，做完 Assignment 再回来看。"
          ]
        },
        {
          "h": "await 关键字：pause until done",
          "p": [
            "官方定义：**await 告诉 JavaScript 等一个异步动作完成之后再继续函数**——它像一个「**暂停直到完成**」（pause until done）关键字。",
            "用法上它顶替 .then() 的取值角色：本来要在异步函数后面调 .then() 接值，现在**用 await 把结果赋给变量**——然后就能像同步代码里一样使用这个结果。",
            "对照开篇例子：const people = await server.getPeople() 一行顶掉整段 .then(people => {...}) 包裹——后续逻辑不再嵌进回调，从上到下一条线读完。这就是「读起来更像同步代码」的字面含义。"
          ]
        },
        {
          "h": "错误处理：.catch() 与 try...catch 两条路",
          "p": [
            "官方说 async 函数里处理错误**非常容易**，给了两条路。第一条：promise 有 .catch() 方法接 rejected promise——而 **async 函数返回的就是 promise**，所以调用处直接链：asyncFunctionCall().catch(err => { console.error(err) })。",
            "第二条：官方原话「the mighty **try...catch**」——想在 async 函数**内部**直接处理错误，就用 try...catch 配 async/await：try 块里写 await 的正常流程，JavaScript 在 try 块里抛错就跑 catch 块（官方注：这玩意同步代码也能用）。官方示例是 getPersonsInfo 的 try/catch 全副武装版。",
            "怎么选？官方很实在：try...catch 包起来**可能显得乱**，但它不用在每次调用后面链 .catch()；错误怎么处理由你定，**用哪种方式取决于你的代码是怎么写的**——时间久了自然有手感，Assignment 也会帮你理解错误处理。"
          ]
        },
        {
          "h": "Practice：Giphy 代码五步重构（官方原样）",
          "p": [
            "官方把上一课的 Giphy 练习拉回来重构（没做过的先回去完成 API 课）。起点是 Promise 版五步链（fetch → .then(return response.json()) → .then(img.src = ...) → .catch(console.error)）。",
            "**第 1 步（硬限制登场）**：**await 在非模块 script 的顶层不工作**——所以先建一个 async 函数把 API 调用包起来：async function getCats() {...}（里面暂时还是原样的 .then 链）。",
            "**第 2 步**：把 fetch 换成 await：const response = await fetch(...)；response.json() 暂时还挂着 .then().catch()。**第 3 步**：官方解释为什么 json() 也要 await——response 还是原来那个传给 .then 块的对象，仍要调 .json()，而 **json() 返回 promise**，所以可以 await 赋值：const catData = await response.json(); img.src = catData.data.images.original.url。",
            "**第 4 步**：错误处理从 .catch() 链换成 try...catch——正常代码包进 try 块，catch 块里 console.error(error)。**第 5 步**：调用 getCats() 用起来。",
            "官方收尾定调：这段代码**行为与上一课的版本完全一致**，只是重构后样子不同；async/await 是清理异步 JavaScript 代码的利器；**要紧的是记住：async/await 只是换一种方式写的 promises**。做完 Assignment  dive deeper。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "// 官方开篇的两段等价代码（做完全相同的事，都返回 promise）\nfunction getPersonsInfo(name) {\n  return server.getPeople().then(people => {\n    return people.find(person => { return person.name === name });\n  });\n}\n\nasync function getPersonsInfo2(name) {\n  const people = await server.getPeople();\n  const person = people.find(person => { return person.name === name });\n  return person;\n}\n\n// 官方给的 server 抽象（贴在上面两段之前即可亲手跑——它怎么工作不重要）\nconst server = {\n  people: [\n    { name: \"Odin\", age: 20 },\n    { name: \"Thor\", age: 35 },\n    { name: \"Freyja\", age: 29 },\n  ],\n  getPeople() {\n    return new Promise((resolve, reject) => {\n      // 模拟延迟的网络调用\n      setTimeout(() => { resolve(this.people); }, 2000);\n    });\n  },\n};\n\n// 官方 Practice 终点形态：Giphy 的 async/await 版（try...catch 全副武装）\n// const img = document.querySelector('img');\n// async function getCats() {\n//   try {\n//     const response = await fetch('https://api.giphy.com/v1/gifs/translate?api_key=YOUR_KEY_HERE&s=cats');\n//     const catData = await response.json();     // json() 返回 promise → 也要 await\n//     img.src = catData.data.images.original.url;\n//   } catch (error) {\n//     console.error(error);\n//   }\n// }\n// getCats();   // await 不能在非模块 script 顶层用 → 包函数再调用",
          "note": "官方正文示例代码：等价两段 + server 抽象 + Giphy 重构终点（注释段为官方 Practice 五步的最终形态）。两段 getPersonsInfo 行为完全一致——调用后都得到 promise（.then 接或 await 包壳取均可）。"
        }
      ],
      "pitfalls": [
        {
          "title": "await 前面忘了 async",
          "text": "await 只能住在 async 函数体内（官方明文：async 是函数内使用 await 的前提）——普通函数或 script 顶层里写 await 直接 SyntaxError。看到 await 先检查所在函数有没有 async 前缀。"
        },
        {
          "title": "以为 async 函数直接返回值",
          "text": "async 函数返回的永远是 promise——return person 出来的是 resolved with person 的 promise。调用处想拿值：await 它（在另一个 async 函数里）或 .then() 接；直接 console.log(getPersonsInfo('Thor')) 会看到 Promise { <pending> }。"
        },
        {
          "title": "在非模块 script 顶层写 await",
          "text": "官方 Practice 撞过的硬限制：await 不工作在非模块 script 的顶层——包一层 async 函数再调用（getCats() 模式），或把 script 改成 type=\"module\"。"
        }
      ],
      "official": {
        "assignment": [
          "读这篇 Async 与 Await 文章（javascript.info，有官方中文版）：扎实的 async/await 入门；这篇 Async/Await 示例文（codeburst）也有不错的用例。",
          "看 Wes Bos 的 Async + Await 视频（dotJS 2017 演讲）：对 async/await 与其目的的好概览，还带一个特别技巧。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/asynchronous_javascript_and_apis/async_and_await.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "6659a786959e06aace1e1ecb7e2a05ac756e7e6b231d536f58cb9fd30864a5ff",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-javascript-weather-app",
      "title": "Project: Weather App",
      "zh": "项目：天气应用",
      "group": 3,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-weather-app",
      "summary": "异步三部曲的总装现场：用前面讨论过的一切，基于 Visual Crossing API 做一个天气预报站点——能搜索特定地点、能在华氏/摄氏之间切换显示；页面外观要随数据变化（改背景色、加天气图片，甚至用 Giphy API 找应景的 gif）。官方明文：promises 或 async/await 随意，但两种都该练到舒服。Assignment 八步路线图从空白 HTML 到 push 上 GitHub，中间强制经过「先 console.log 再上 UI」的三段式。项目还附带一节 API key 安全课：「Never trust the client」——以及官方提前打好的预防针：把 key 推上 GitHub 后你可能收到泄露警告，对本项目完全 OK（免费公开 key），但不是所有 key 都这样。",
      "guide": "以下是官方原课的中文化梳理（Project 课：本站不提供成品代码，examples 为空数组——官方正文也没有代码块）。这个项目是「异步代码 → 与 API 协作 → Async 与 Await」三课的验收现场，官方要求全部用上：fetch 取数、Promise 或 async/await 处理（两种都练熟）、JSON 钻取、DOM 渲染、表单交互。八步 Assignment 的路线图值得先看懂再动手：第 1 步空白 HTML 搭好 JS/CSS 链接；第 2、3 步是架构层——「打 API 的函数」（输入地点、返回天气数据）与「处理 JSON 的函数」（从冰山一样的响应里只提取应用需要的字段、返回干净对象）分开写，这两步官方都要求先只 console.log；第 4 步表单接上取数（还是 console.log）；第 5 步才上 UI——信息显示 + 华氏/摄氏切换；第 6 步随你 styling；第 7 步可选 loading 组件（提交到数据回来之间显示，用 DevTools 模拟网速测试）；第 8 步 push 上 GitHub 分享。「先 console.log 再上 UI」的三段式不是啰嗦：它把「取数对不对」「处理对不对」「渲染对不对」三层问题拆开，每层单独可验——直接上 UI 的话三层问题搅在一起没法排。安全节的两句话要带进真实工作：把 key 存服务端、用环境变量、永不发往前端是正解；「Never trust the client」既指别信客户端发来的数据，也指发往客户端的任何东西都等于公开。本项目把 key 放前端是官方允许的例外（免费、公开可得、暴露无后果）——GitHub 可能弹 secret 泄露警告，官方明文说收到也没关系；但别把这个例外推广到任何付费或敏感 key。天气图标若嫌逐个 import 麻烦，官方给了方向：dynamic import（MDN import() 运算符文档），且 Webpack 能读懂动态导入、照样打包相关资源（与不带 import 的纯模板字符串拼接不同）。",
      "understand": [
        "项目目标（官方）：用 **Visual Crossing API** 做天气预报站点——**搜索特定地点** + **华氏/摄氏切换显示**；页面外观**随数据变化**（背景色/天气图片，甚至用 Giphy API 配应景 gif）",
        "官方明文的练习要求：**promises 或 async/await 随意用，但两种都该练到舒服**——这是异步三部曲的总验收",
        "架构分层（Assignment 第 2、3 步的深意）：**打 API 的函数**（地点进、天气数据出）与**处理 JSON 的函数**（从完整响应提取应用所需、返回干净对象）分开——先 console.log 验证再接 UI",
        "**API key 安全**：不是所有 API 都免费——按次计费的 key 是白嫖者的目标；rate limit 也可能被人用你的 key 耗尽；正解是 **key 存服务端、用环境变量、永不发往前端**",
        "**Never trust the client**（官方引用的行话）：通常指别把客户端**发来**的数据当真——同时也指**发往**客户端的任何东西都不能保密",
        "GitHub  secret 扫描：key 公开提交会触发警告——**本项目收到警告完全 OK**（key 免费公开可得、暴露无后果，官方明文）；**不是所有 key 都这样**，后端课程会教安全处理",
        "**dynamic import**（官方第 5 步提示）：天气图标多时可用 MDN 的 import() 运算符按需导入；**Webpack 能读懂动态导入**并照样打包相关资源——与不带 import 的纯模板字符串拼接不同",
        "**loading 组件**（官方可选步骤）：从表单提交到数据回来之间显示——用 DevTools 模拟网络速度测试它"
      ],
      "terms": [
        {
          "en": "Environment variables（环境变量）",
          "zh": "把 API key 等秘密配置放在代码之外的部署环境里——key 只在服务器可用、永不发往前端"
        },
        {
          "en": "Never trust the client",
          "zh": "行话：客户端发来的数据不可信（要校验），发往客户端的东西也不可保密（等于公开）"
        },
        {
          "en": "Rate limit（速率限制）",
          "zh": "API 服务的调用频率上限——key 泄露的另一种损失：别人替你耗尽配额"
        },
        {
          "en": "Dynamic import（动态导入）",
          "zh": "import() 运算符：运行时按需加载模块——官方推荐给「天气图标太多」的场景，Webpack 能读懂并打包"
        },
        {
          "en": "Loading component",
          "zh": "提交到数据返回之间的等待反馈——官方可选步骤，DevTools 模拟慢网速来测"
        }
      ],
      "tasks": [
        "搭空白 HTML 文档，链接好 JavaScript 与 CSS 文件（Assignment 第 1 步）",
        "写「打 API」的函数：接收地点、返回该地点的天气数据——现在只 console.log 信息（Assignment 第 2 步）",
        "写「处理 JSON」的函数：把 API 给的数据加工成只含应用所需字段的对象（Assignment 第 3 步）——响应是冰山（API 课见过），你的应用只需要露出水面的那一角",
        "搭表单：让用户输入地点、触发取天气——仍然只 console.log（Assignment 第 4 步）",
        "把信息显示到网页上，配华氏/摄氏切换（Assignment 第 5 步）——想显示天气图标的话看看 dynamic imports（MDN import() 运算符）：图标多时省得逐个 import，且 Webpack 能读懂动态导入、照样打包相关资源",
        "加上任何你喜欢的样式（Assignment 第 6 步）——官方建议外观随数据变：背景色、天气图片、或 Giphy 应景 gif",
        "可选：加 loading 组件——从表单提交到信息返回期间显示；用 DevTools 模拟网络速度测试（Assignment 第 7 步）",
        "把作品 push 上 GitHub 并分享你的解答（Assignment 第 8 步）——key 在前端会触发 GitHub 泄露警告，官方明文：本项目没关系"
      ],
      "quiz": [
        {
          "question": "官方为什么建议 key「存服务端、用环境变量」？环境变量在这里起什么作用？",
          "answer": "不是所有 API 都免费：按次计费的 key 是白嫖者的目标，rate limit 也可能被拿着你 key 的人耗尽——而发往前端的任何内容都等于公开（Never trust the client 的第二层含义）。环境变量把 key 放进部署环境的配置而非代码：构建/运行时只在服务器可读，前端产物里根本不出现 key，自然无从泄露。"
        },
        {
          "question": "把本项目的 key push 上 GitHub 后收到泄露警告——要不要慌？官方怎么说？这个例外能推广吗？",
          "answer": "不慌。官方明文：跟着本项目做、暴露 key 之后你可能收到 GitHub 的警告——对本项目完全 OK，因为这个 key 是公开可得的（免费注册即有）、暴露没有后果。但官方紧接着划界：这不是说所有 key 都这样——付费/敏感 key 的暴露就是真事故（API 课引过 2375 美元的亚马逊例子），安全处理法后端课程再教。"
        },
        {
          "question": "Assignment 第 2、3 步为什么把「打 API 的函数」和「处理 JSON 的函数」分成两个、且都先 console.log？",
          "answer": "分层验证：取数层（函数对不对、key 对不对、请求通不通）与数据加工层（从冰山响应里提对字段没有）各自独立可查——console.log 让每层的输出直接可见。混在一起直接上 UI，渲染错了你分不清是取数错、加工错还是渲染错。这也是第 3 步「只返回应用所需数据的对象」的意义：UI 层拿到的是干净小对象，不背整个响应。"
        },
        {
          "question": "官方第 5 步提示的 dynamic imports 解决什么问题？为什么特意点名 Webpack？",
          "answer": "天气图标可能有几十张——逐个静态 import 太笨重，import() 运算符可以按运行时的天气状况按需加载对应图标模块。点名 Webpack 是因为：与不带 import 的纯模板字符串拼接路径不同（那种 Webpack 看不见、资源不会进包），Webpack 能读懂动态导入的表达式、仍会把相关资源打进 bundle——按需加载与打包完整性两不误。"
        }
      ],
      "optional": [
        "官方可选步骤（Assignment 第 7 步）：loading 组件——从表单提交到信息返回之间显示；用 DevTools 的网络限速模拟慢网速来测试它"
      ],
      "note": "Project 课（红线课）：examples 为空数组，本站正文只有官方要求中文化 + 八步拆解 + 架构思路 + Hint，不提供任何成品代码——官方正文本身也无代码块。课内含官方专节「API keys, secrets, and security」（Never trust the client / 环境变量 / GitHub 泄露警告对本项目 OK 的明文）。第 5 步的两条外部资料（MDN import() 运算符、Webpack Module Methods 的 dynamic expressions 小节）均已核验：MDN 有官方中文版（zh-CN 实测汉字 3377）；Webpack 文档无官方中文版（沿用既有 C 类口径）。Visual Crossing 注册与 API 细节回指上一课「与 API 协作」。",
      "why": "这是你第一个「数据驱动」的完整应用：从表单交互到网络取数、从 JSON 冰山到干净渲染，异步三部曲的每一块都在这里上岗——写完它，「会用 fetch」才从知识点变成肌肉记忆。它也是作品集常客：一个体面的天气应用（外观随数据变化 + loading 反馈 + 摄氏/华氏切换）足以展示前端基本功。安全节那几句话（key 存服务端、Never trust the client、GitHub 警告的边界）则是带你从「课程项目思维」跨进「生产思维」的第一步——后端课程会把它接完。",
      "sections": [
        {
          "h": "项目目标（官方要求）",
          "p": [
            "官方一句话开题：**用我们一直在讨论的一切**，基于前面课程的 **Visual Crossing API** 做一个天气预报站点。两条功能底线：**能搜索特定地点**；**能切换华氏/摄氏显示**。",
            "观感要求：页面外观要**随数据变化**——改背景色、加描述天气的图片，官方还出了个主意：用 **Giphy API** 找应景的天气 gif 显示上去（API 课的老朋友）。",
            "技术选型官方给了自由度也给了要求：**promises 或 async/await 随意——但你应该两种都练到舒服**。建议：主体用一种写，写完后用另一种重构一遍（async-and-await 课的 Practice 就是这么干的）。"
          ]
        },
        {
          "h": "API key、秘密与安全（官方专节）",
          "p": [
            "官方这一节把 API 课的安全话题讲透。**不是所有 API 都免费**：按使用计费的 API，你的 key 就是「不付钱用你额度的人」的头号目标；还有 **rate limit**——拿到你 key 的人能把你的配额用光。",
            "预防的正解：**把 API key 存在服务器、从一开始就不发往前端**——通常用**环境变量**做到：key 只在代码部署的那台服务器上可用。",
            "行话时间：谈 key 与安全时常听到「**Never trust the client**」（client 指前端）。它的通常含义是：别把客户端**发来**的数据当有效——但它**同时**意味着：**发往客户端的任何东西都不可信地保密**。",
            "正因如此：key 一泄露，**GitHub 会警告你公开提交了 API key**。官方提前打预防针：跟着本项目做、暴露了 key 之后你可能真会收到这个警告——**对本项目完全 OK**：这个 key 是公开可得的，暴露它没有后果。**但这不是说所有 key 都这样**。后端课程会教你安全处理这些话题的方法。"
          ]
        },
        {
          "h": "Assignment 八步路线图",
          "p": [
            "官方步骤原样中文化：① 搭空白 HTML 文档，恰当链接 JS 与 CSS 文件；② 写打 API 的函数——接收地点、返回该地点天气数据，现在只 console.log；③ 写处理 JSON 的函数——从 API 数据里提取应用所需、返回干净对象；④ 搭表单让用户输入地点取天气（仍只 console.log）；⑤ 信息显示上网页 + 华氏/摄氏切换——想要天气图标就看 dynamic imports（MDN import() 运算符；图标多时省得逐个 import，Webpack 能读懂动态导入并照样打包相关资源）；⑥ 加任何你喜欢的样式；⑦ 可选：loading 组件（提交到数据返回之间显示，DevTools 模拟网速测试）；⑧ push 上 GitHub、分享解答。",
            "路线图的形状就是排错策略：**②③④ 三步全在 console.log 阶段**——取数、加工、交互三层各自验证通过后，第 ⑤ 步才把干净数据接上 UI。跳过 console 阶段直接写渲染，等于把三层可能出错的环节焊死在一起。"
          ]
        },
        {
          "h": "Hint：动手前的白板题（本站补充）",
          "p": [
            "架构提示：官方第 3 步「处理 JSON 的函数」是整个项目最值得想清楚的一层——API 课见过 Visual Crossing 的响应是冰山（queryCost、days 数组、每天几十个字段），你的 UI 只需要其中一小把：当前温度、体感、天气状况文案、图标名、风速……**处理函数的返回值就是 UI 与 API 之间的合同**：合同字段定了，UI 层不碰原始响应，将来换 API 只改处理函数。",
            "单位切换的实现路线自己选：华氏/摄氏可以在处理层算好两个值、切换只是显示层挑选（简单可靠）；也可以查 Visual Crossing 文档看有没有单位参数、切换时重新取数（练 API 参数但多一次网络往返）。官方只要求「能切换」，路线自定——白板阶段把选择与理由写下来。",
            "排错提示：请求失败先分层定位——控制台里 fetch 报错（网络/CORS/key 错）看请求层；数据回来了但 undefined（钻取路径不对）看处理层；数据对但页面不显示（DOM 时机/选择器）看渲染层。三段式路线图就是为这种分层定位设计的。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "跳过 console.log 阶段直接上 UI",
          "text": "官方路线图 ②③④ 三步都停在 console.log 是有道理的：取数、加工、渲染三层各自可验。直接写渲染，页面空白时你分不清是 key 错、钻取路径错还是 DOM 时机错——三层问题搅成一团。"
        },
        {
          "title": "把整个 API 响应直接塞给 UI 层",
          "text": "官方第 3 步专门要一个「只返回所需数据」的处理函数：冰山响应（每天几十字段 × 多天）直接进 UI，渲染代码里全是 response.days[0].temp 式的深钻取——换个 API 或改个显示就全线返工。处理层返回干净小对象，UI 只认合同字段。"
        },
        {
          "title": "收到 GitHub 的 key 泄露警告就删库重传",
          "text": "官方明文：本项目的 key 公开可得、暴露无后果——警告收到就收到，不用慌也不用删。反过来也别把这份淡定推广：付费/敏感 key 泄露是真事故，必须吊销换新 + 移进环境变量。两种情况的分界线官方在正文里画好了。"
        }
      ],
      "official": {
        "assignment": [
          "搭一个空白 HTML 文档，恰当链接你的 JavaScript 与 CSS 文件。",
          "写打 API 的函数：接收地点、返回该地点的天气数据——现在只 console.log 信息。",
          "写处理 API 返回的 JSON 数据的函数：只带应用所需数据的对象。",
          "搭一个表单让用户输入地点、取天气信息（仍然只 console.log）。",
          "把信息显示到网页上，配华氏/摄氏切换。想显示天气图标的话：图标可能很多、逐个 import 很烦——看看 dynamic imports（MDN）；与不带 import 的纯模板字符串不同，Webpack 能读懂动态导入并照样打包相关资源。",
          "加任何你喜欢的样式！",
          "可选：加一个 loading 组件——从表单提交到信息从 API 回来期间显示；用 DevTools 模拟网络速度。",
          "把它 push 上 GitHub，在下面分享你的解答！"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "Assignment 第 7 步（官方标注 Optional）：loading 组件——从表单提交到信息返回之间显示，用 DevTools 模拟网络速度测试。"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/asynchronous_javascript_and_apis/project_weather_app.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "a9fe03f911364a159b55b3c69fce38bb476ebbbe1d8aa43d84b0b66f5123f6ae",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-javascript-testing-basics",
      "title": "Testing Basics",
      "zh": "测试基础",
      "group": 4,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-testing-basics",
      "summary": "测试驱动开发（TDD）在现代开发领域是一件大事（官方原话 a big deal）：核心思想是**先写自动化测试，再写被测代码**——本站早在 Fundamentals 阶段的 JavaScript Exercises 就引入过这个概念（官方练习仓库就是测试驱动的）。JavaScript 的测试运行系统很多：Mocha、Jasmine、Tape、Jest——各有绝活，但基本语法几乎相同，官方明说「最终用哪个都不要紧」（为课程选库相当棘手）。本课围绕 **Jest** 展开：它的测试讲解资源与文档在官方看来数一数二。官方定盘星：写测试与其说关乎语法，不如说关乎 TDD 哲学——**最重要的问题是知道我们为什么写测试、测什么，而不是怎么测**。Assignment 五件事：两篇 web.archive.org 存档文（TDD 过程与收益 / TDD 的 why-how-value）、Unit Testing in JavaScript 系列至少前 3 支视频、Jest Getting Started 上手（到 Additional Configuration 为止）、Using Matchers 文档。还有一条分量很重的官方 Tip：Jest 默认不认 ESM——要用 import/export 得装 @babel/preset-env@^7 并建 babel.config.js，Babel 在内存里把 ESM 转成 CJS 再交给 Jest（不改写你的实际文件）。",
      "guide": "以下是官方原课的中文化梳理。这一课是「测试 JavaScript」章的开篇，也是下一章 Project: Testing Practice 的环境准备课——Tip 里的 Babel 设置下一课立刻要用。正文没有新知识块（lesson overview 三条全部由 Assignment 资料承担：TDD 基础在两篇存档文与视频系列里、Jest 上手在 Getting Started 教程里、基本测试写法在 Using Matchers 文档里），本站讲解按「为什么 TDD → 为什么 Jest → 上手边界与 ESLint 注意 → ESM Tip 详解 → Assignment 导读」组织。ESM Tip 值得多看一眼：它衔接「ES6 Modules」课——你已经习惯 import/export，而 Jest 当前版本默认只认 CJS（require/module.exports），官方给的两步方案（装 @babel/preset-env@^7 + 建 babel.config.js）让两者共存：Babel 在内存里转换、不落盘、Jest 照常运行。官方还提醒 ESLint 用户：test/expect 这类 Jest 全局变量要在测试文件里显式 import，否则 linting 报 no-undef（教程「Using ESLint」节）。「写测试哲学高于语法」这句定盘星会在本章后两课反复兑现：testing-practice 让你亲手走一遍「先写测试再让测试通过」，more-testing 讲透隔离、纯函数与 mocking——那时回头看本课的 why/what > how，会更有体感。",
      "understand": [
        "官方定位：TDD（Test Driven Development）在现代开发领域是一件**大事**；核心思想 = **先写自动化测试，再写被测代码**；这样做的收益多多，全部在 Assignment 资料里讨论",
        "本站与 TDD 的第一次相遇（官方点名）：Fundamentals 阶段的 **JavaScript Exercises**——官方练习仓库就是测试驱动的（先给测试、你来写实现）",
        "测试运行系统很多：**Mocha、Jasmine、Tape、Jest**——各有自己的一套绝活，但**基本语法几乎相同**；官方原话：最终用哪个都不要紧（为课程选库「相当棘手」）",
        "本课围绕 **Jest**：官方看中它有**数一数二的 JavaScript 测试讲解资源**与**极佳的文档**",
        "官方定盘星：写测试**与其说关乎语法，不如说关乎 TDD 哲学**——最重要的问题是知道**为什么（why）**我们写测试、**测什么（what）**，而不是怎么测（how）",
        "lesson overview 三条：解释 TDD 的基础 / 让 Jest 跑起来 / 写基本测试——三条全部由 Assignment 资料承担，正文不展开",
        "Jest Getting Started 的上手边界（官方指令）：跟做到 **「Additional Configuration」一节为止**即可",
        "ESLint 用户注意（官方指令）：Jest 提供 test、expect 等**全局变量**——用 ESLint 时需在测试文件里**显式 import** 它们，防止 linting 报错（见同一教程的「Using ESLint」节）",
        "ESM 现状（官方 Tip）：当前版本 Jest **默认不识别 ESM**——所以官方指南都用 CJS 语法（如 module.exports）",
        "官方 Tip 两步方案：① 安装 **@babel/preset-env@^7**（截至官方撰写时 Jest 要求 Babel v7、尚不兼容最新 v8）；② 项目根目录建 **babel.config.js**（presets 配 @babel/preset-env、targets 设 node: current）",
        "配置后的效果：可以写 ESM 的 import/export 而不必用 require/module.exports；教程其余部分**什么都不用改**、Jest 照常运行——幕后 **Babel 在运行 Jest 前把 ESM 转成 CJS**（全在内存里发生，**不会覆写你的实际文件**）"
      ],
      "terms": [
        {
          "en": "TDD（Test Driven Development，测试驱动开发）",
          "zh": "先写自动化测试、再写被测代码的开发方法——现代开发领域的大事（官方原话），Fundamentals 的 JavaScript Exercises 已让你体验过"
        },
        {
          "en": "Jest",
          "zh": "Facebook 出品的 JavaScript 测试框架——本课程选定的测试库：讲解资源与文档数一数二；Mocha/Jasmine/Tape 是语法几乎相同的同类"
        },
        {
          "en": "Test runner（测试运行系统）",
          "zh": "负责执行测试并汇报结果的工具——JavaScript 世界有很多个，基本语法几乎相同，官方说用哪个都不要紧"
        },
        {
          "en": "Matcher（匹配器）",
          "zh": "测试里的断言函数（如 expect(x).toBe(y)）——Jest 的 Using Matchers 文档是 Assignment 指定资料"
        },
        {
          "en": "ESM vs CJS",
          "zh": "import/export 与 require/module.exports 两套模块语法——Jest 默认只认 CJS，ESM 需要 Babel 转换桥"
        },
        {
          "en": "@babel/preset-env",
          "zh": "Babel 的编译预设：把 ESM 转成 CJS（targets: node current 表示按当前 Node 版本转）——在内存里转换、不改写实际文件"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：把「先写测试、再写代码」与「why/what 重于 how」两句定盘星记牢",
        "读 TDD 基本过程与收益一文（Assignment 第 1 条，官方给的是 web.archive.org 存档地址）",
        "看 Unit Testing in JavaScript 视频系列的**至少前 3 支**（Assignment 第 2 条，视频不声称有中文字幕）",
        "跟做 Jest 的 Getting Started 教程到「Additional Configuration」为止（Assignment 第 3 条）：用 ESLint 的话按同教程「Using ESLint」节显式 import test/expect；想写 ESM 就按官方 Tip 装 @babel/preset-env@^7 并建 babel.config.js——下一课的项目立刻要用这套设置",
        "读 Jest 主站的 Using Matchers 文档（Assignment 第 4 条）：它演示了测试里可用的其他有用函数",
        "读 TDD 的 why/how 与价值一文（Assignment 第 5 条，官方给的是 web.archive.org 存档地址）：含很好的 TDD 应用示例"
      ],
      "quiz": [
        {
          "question": "TDD 的核心思想是什么？本站哪个阶段已经让你体验过它？",
          "answer": "核心思想：**先写自动化测试，再写被测代码**（官方原话：start working on your code by writing automated tests before writing the code that is being tested）。体验场：Fundamentals 阶段的 JavaScript Exercises——官方练习仓库先给你测试文件、你写实现让测试通过，那就是 TDD 的「反向」视角（测试已存在，代码追上来）。"
        },
        {
          "question": "测试库一大把（Mocha/Jasmine/Tape/Jest），官方为什么敢说「用哪个都不要紧」？课程又为什么选了 Jest？",
          "answer": "不要紧的原因：各家**基本语法几乎相同**——都有自己的绝活，但 test/expect/describe 这套骨架互通，换库的迁移成本很低。选 Jest 的原因（官方两条）：它有**数一数二的 JavaScript 测试讲解资源**，以及**极佳的文档**——对学习者来说资料质量比库本身的细微差异更重要。官方还坦白：为课程选哪个库「相当棘手」。"
        },
        {
          "question": "官方认为写测试最重要的问题是什么？这句话对下一课的项目有什么指导意义？",
          "answer": "官方定盘星：写测试**与其说关乎语法，不如说关乎 TDD 哲学**——最重要的是知道**为什么写测试、测什么**，而不是怎么测。对 testing-practice 项目的意义：五个函数练习的重点不是背 matcher 语法，而是每个函数**该测哪些情形**——caesar 密码的回绕/大小写/标点就是「what to test」的具体化；语法查 Using Matchers 文档就够。"
        },
        {
          "question": "Jest 默认不识别 ESM——官方的两步解决方案是什么？Babel 会改写你的源文件吗？",
          "answer": "两步：① npm install --save-dev @babel/preset-env@^7（截至官方撰写时 Jest 要求 Babel v7、尚不兼容最新 v8）；② 项目根目录建 babel.config.js，presets 配 [[\"@babel/preset-env\", { targets: { node: \"current\" } }]]。之后照常写 import/export、教程其余部分不用改、Jest 照常运行。**不改写文件**：Babel 的 ESM→CJS 转换全在内存里发生（官方原话：it won't overwrite your actual files）。"
        },
        {
          "question": "用 ESLint 配 Jest 时，为什么要在测试文件里显式 import test/expect？",
          "answer": "test、expect 这些是 Jest 注入的**全局变量**——运行时存在，但 ESLint 静态检查不知道它们的来历，会按 no-undef 规则报「未定义变量」。官方指令：在测试文件里显式 import 它们（Jest 支持这种导入），linting 即可通过——具体做法见 Getting Started 教程的「Using ESLint」节。这正是「Linting」课讲过的原则在测试场景的应用：静态检查只看代码本身。"
        }
      ],
      "optional": [],
      "note": "本课官方原文没有 Knowledge check 一节（official.knowledgeCheck 为空数组是结构事实）。Assignment 第 1、5 条的文章官方给的就是 web.archive.org 存档地址（原站已不稳）；第 2 条视频系列官方只要求「至少前 3 支」。ESM Tip 里「Jest 要求 Babel v7、不兼容 v8」是官方撰写时的版本快照——实际配置时以 Jest 官方文档现行为准，本站如实转述不另作版本判断。examples 收录官方 babel.config.js 原码与安装命令。",
      "why": "在此之前，你验证代码靠「手动点一点、console.log 看一看」——从这一章开始，验证工作交给机器：每次改动后一条命令跑完全部检查，回归问题当场暴露。TDD 还不只是测试技术，它是逼你写出松耦合、可测试代码的架构约束（more-testing 会讲透这层）。往近说：下一课的测试练习项目、最终大项目 Battleship 都要求用 Jest 写测试；往远说：自动化测试是任何严肃团队的标配，也是面试常问项——这一章是你从「写得出代码」迈向「写得住代码」的分水岭。",
      "sections": [
        {
          "h": "TDD：先写测试，再写代码",
          "p": [
            "官方开场就把分量说足：测试驱动开发（TDD）在现代开发领域是一件**大事**（a big deal）。核心思想一句话：**从写自动化测试开始你的代码工作——在被测代码写出来之前**。",
            "这不是新概念在本站的第一次露面：官方点名 Fundamentals 阶段的 **JavaScript Exercises** 就引入过它——你当时 clone 的练习仓库里，测试文件是现成的，你的任务是写实现让测试变绿。那时你是「测试的消费者」，从这一章开始你要成为「测试的作者」。",
            "这样工作的收益多多（官方原话 tons of benefits），具体讨论全部放在 Assignment 的两篇文章与视频系列里——本课正文不展开，先把「为什么值得」留给你在读资料时自己建立。"
          ]
        },
        {
          "h": "为什么是 Jest：语法互通，哲学为王",
          "p": [
            "JavaScript 的测试运行系统很多：官方点了 **Mocha、Jasmine、Tape、Jest** 四个名字。好消息是各家**语法非常相似**——都有自己的绝活，但基本语法几乎相同，**最终用哪个都不要紧**。官方还坦白：为课程选哪个库「相当棘手」（quite tricky）。",
            "本课围绕 **Jest**：官方看中它拥有**数一数二的 JavaScript 测试讲解资源**与**极佳的文档**。",
            "然后是那句值得裱起来的定盘星：**写测试，与其说关乎语法，不如说关乎 TDD 哲学——最重要的问题是知道我们为什么（why）写测试、测什么（what），而不是怎么测（how）**。语法随时可查文档，「该测什么、为什么测」才是测试功力的分界线。"
          ]
        },
        {
          "h": "上手边界与 ESLint 注意",
          "p": [
            "Assignment 第 3 条让你跟做 Jest 的 **Getting Started 教程**，官方划了明确边界：做到 **「Additional Configuration」一节为止**——后面的高级配置现阶段不需要。",
            "同一条里藏着 ESLint 用户的坑位提示：Jest 提供 test、expect 等**全局变量**，但如果你在用 ESLint（「Linting」课配的那套），需要在测试文件里**显式 import** 这些全局量来防止 linting 报错——做法见同一教程的「Using ESLint」节。",
            "这两个提示都是「跟着做就能过」的操作层信息，但背后逻辑值得知道：教程默认你用 CJS（下一节展开）；linting 的 no-undef 规则不认识 Jest 注入的全局量，所以要显式导入。"
          ]
        },
        {
          "h": "官方 Tip：让 Jest 用上 ESM",
          "p": [
            "现状：**当前版本的 Jest 默认不识别 ESM**——这就是为什么 Jest 官方指南全用 CJS 语法（module.exports / require）。而你在「ES6 Modules」课之后已经习惯 import/export，两者要接上，官方 Tip 给了两步。",
            "**第一步**：安装 @babel/preset-env——注意版本：npm install --save-dev @babel/preset-env@^7（截至官方撰写时，Jest 要求 Babel v7、尚不兼容最新的 v8）。",
            "**第二步**：在项目根目录建 babel.config.js，内容见示例区官方原码：export default 一个 presets 数组，配 [\"@babel/preset-env\", { targets: { node: \"current\" } }]（按当前 Node 版本转换）。",
            "配完之后：你可以写 ESM 的 import/export 而不是 require/module.exports；**教程其余部分什么都不用改，Jest 照常运行**。幕后原理：**Babel 在运行 Jest 之前把你的 ESM 转成 CJS——全在内存里发生，不会覆写你的实际文件**。下一课的测试练习项目开头就回指本节：那是这套设置的实战现场。"
          ]
        },
        {
          "h": "Assignment 导读：两篇存档文、一个视频系列、两份 Jest 文档",
          "p": [
            "五件事的分工：**① TDD 基本过程与收益**（web.archive.org 存档文）——建立「为什么」；**② Unit Testing in JavaScript 视频系列至少前 3 支**——看测试怎么组织；**③ Jest Getting Started 上手**（到 Additional Configuration 为止 + ESLint 注意 + ESM Tip）——动手环境；**④ Using Matchers 文档**——断言函数全家福；**⑤ TDD 的 why/how 与价值**（web.archive.org 存档文，jrsinclair 名文）——官方评价：含很好的应用示例。",
            "两篇存档文官方给的就是 web.archive.org 地址（原站已不稳），点开即是存档快照；视频系列只需前 3 支，后面的想看随意。",
            "建议顺序：① → ⑤ 先建认知，② 看组织方式，③④ 动手——环境搭好后立刻去下一课的项目里用。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "bash",
          "code": "npm install --save-dev @babel/preset-env@^7",
          "note": "官方 Tip 第一步原码：安装 Babel 预设。@^7 锁大版本——截至官方撰写时 Jest 要求 Babel v7、尚不兼容最新 v8，装成 v8 会白忙。"
        },
        {
          "lang": "javascript",
          "code": "export default {\n  presets: [[\"@babel/preset-env\", { targets: { node: \"current\" } }]],\n};",
          "note": "官方 Tip 第二步原码：项目根目录的 babel.config.js 全文。targets: node current 表示按当前 Node 版本转换——配好它，测试文件里就能写 ESM 的 import/export，Babel 在内存里转成 CJS 再交给 Jest，不改写你的实际文件。"
        }
      ],
      "pitfalls": [
        {
          "title": "装了 Babel v8 却发现 Jest 用不上",
          "text": "官方 Tip 写明：截至撰写时 Jest 要求 Babel v7、尚不兼容最新 v8——所以安装命令锁的是 @babel/preset-env@^7。跟着新教程装了 v8 的话，ESM 转换不会生效。版本边界以 Jest 官方文档现行为准。"
        },
        {
          "title": "ESLint 项目里 test/expect 满屏报 no-undef",
          "text": "Jest 的 test、expect 是运行时注入的全局变量，ESLint 静态检查看不见它们的来历。官方指令：在测试文件里显式 import（做法见 Getting Started 的「Using ESLint」节）——不是关掉 lint 规则。"
        },
        {
          "title": "没配 Babel 就在测试里写 import/export",
          "text": "Jest 默认只认 CJS——直接写 ESM 会得到语法报错（require/import of ES Modules 之类的提示）。要么按官方 Tip 配 Babel，要么测试文件退回 module.exports/require；混用一半 ESM 一半 CJS 最容易迷惑。"
        },
        {
          "title": "纠结「到底该学哪个测试库」",
          "text": "官方已经替你回答：Mocha/Jasmine/Tape/Jest 基本语法几乎相同，用哪个都不要紧——课程选 Jest 是因为资料与文档最好。把纠结的时间省下来想 why 和 what，那才是官方说的重点。"
        }
      ],
      "official": {
        "assignment": [
          "读这篇讲 TDD 基本过程与收益的文章（官方给的是 web.archive.org 存档地址，原文 The importance of test driven development）。",
          "看 Unit Testing in JavaScript 视频系列的至少前 3 支视频（YouTube 播放列表）。",
          "跟做 Jest 的 Getting Started 教程，直到「Additional Configuration」一节为止。Jest 也提供 test、expect 这样的全局变量，但如果你在用 ESLint，需要在测试文件里显式 import 它们以防止 linting 报错（见同一教程的「Using ESLint」节）。官方 Tip「在 Jest 中使用 ES6 import 语句」：当前版本的 Jest 默认不识别 ESM（所以指南用 CJS 语法如 module.exports）；要用 ESM 需两步——① 安装 @babel/preset-env@^7（截至撰写时 Jest 要求 Babel v7、尚不兼容最新 v8）：npm install --save-dev @babel/preset-env@^7；② 在项目根目录创建 babel.config.js，内容为 export default { presets: [[\"@babel/preset-env\", { targets: { node: \"current\" } }]] }。之后你就可以写 ESM 的 import/export 语法而不必用 require/module.exports；指南其余部分不用改任何东西、Jest 照常运行。幕后，Babel 会在运行 Jest 前把你的 ESM 转成 CJS（不会覆写你的实际文件——全在内存里发生）。",
          "读并跟做 Jest 主站的 Using Matchers 文档——它演示了测试里可用的一些其他有用函数。",
          "读这篇讲 TDD 的 why/how 与其背后价值的文章（官方给的是 web.archive.org 存档地址，jrsinclair 的 One Weird Trick That Will Change The Way You Code Forever: JavaScript TDD）——还包含如何应用 TDD 的很棒的示例。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/testing_javascript/testing_basics.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "9b803205fd8118600c24388691376cb944fafd3c3c476944f07659a07c9d9ba1",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-javascript-testing-practice",
      "title": "Project: Testing Practice",
      "zh": "项目：测试练习",
      "group": 4,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-testing-practice",
      "summary": "测试章的动手现场。官方开场白很实在：测试这件事真的没那么难，但它**相当新**——唯一变舒服的办法是花时间去做的。Assignment 就一句话的骨架：**为下列五个函数先写测试，然后让测试通过**——capitalize（首字母大写）、reverseString（反转字符串）、calculator 对象（add/subtract/divide/multiply 四则运算）、caesarCipher（凯撒密码位移，附四条子要求：测 z 到 a 的回绕、测大小写跟随原文、测标点空格不变、可拆小函数但只测公开的最终函数）、analyzeArray（返回 average/min/max/length 四属性对象，官方给了期望值示例：输入 [1,8,3,4,2,6] 应得 average 4、min 1、max 8、length 6）。开头还有官方前置提醒：Jest 对 ESM 没有内建的稳定支持——先按上一课的 Tip 配好 Babel 转换。五个练习难度递进，caesarCipher 是重头戏：四条子要求就是四组边界用例，还顺带教出一条测试哲学——**你不需要显式测试写下的每一个函数，只测公开的那些**。",
      "guide": "以下是官方原课的中文化梳理（Project 课：本站不提供成品代码，examples 为空数组——官方正文只有 analyzeArray 的期望对象一个代码块，本站按文字转述）。动手前先过环境关：官方在 Assignment 开头就提醒 Jest 对 ESM 没有内建稳定支持——回上一课「Testing Basics」的官方 Tip 配好 Babel（@babel/preset-env@^7 + babel.config.js），npx jest 能跑起来再开工。工作流就是 TDD 全流程：每个函数**先写会失败的测试，再写让它通过的最小实现**——顺序反了就不是练习而是补票。五个练习的梯度：capitalize/reverseString 热身（想清楚边界：空串、单字符、已大写、带空格标点）；calculator 用 describe 分四组，divide 除零是官方没规定的空白——自己先写测试拍板行为；caesarCipher 是主菜，官方四条子要求逐条变成测试（回绕 xyz+3→abc、大小写 HeLLo+3→KhOOr、标点 Hello, World!+3→Khoor, Zruog!、只测公开的最终函数）；analyzeArray 把官方期望对象当合同逐属性断言。官方借第 4 题教的哲学值得反复读：拆出的内部小函数**不需要**每个都显式测试——公开的 caesarCipher 行为对了，小助手大概率各就各位；这不是偷懒，是「测行为不测实现」的起点，more-testing 课的隔离与 mocking 会把它接完。",
      "understand": [
        "官方定位：测试这件事**真的没那么难，但相当新**（it *is* quite new）——唯一变舒服的办法是花时间去做的",
        "工作流（官方指令原话）：**为下列函数写测试，然后让测试通过**——先测试后实现，TDD 全流程走一遍",
        "环境前置（Assignment 开头官方提醒）：Jest 对 ESM **没有内建的稳定支持**——需先按「Testing Basics」课的官方 Tip 设置 Babel 的 ESM/CJS 转换",
        "练习 1 **capitalize**：接收一个字符串，返回**首字符大写**的版本",
        "练习 2 **reverseString**：接收一个字符串，返回**反转**后的它",
        "练习 3 **calculator 对象**：包含基本运算的函数——**add、subtract、divide、multiply**；每个函数接收两个数字、返回正确的计算结果",
        "练习 4 **caesarCipher**：接收一个字符串与一个位移因子，返回每个字符被「位移」后的字符串——官方给了凯撒密码工作原理的参考资料链接",
        "caesarCipher 子要求 ①（官方原话）：别忘了测 **z 到 a 的回绕**——例：caesarCipher('xyz', 3) 应返回 'abc'",
        "caesarCipher 子要求 ②：别忘了测**大小写保留**——位移后的大小写应跟随原字符——例：caesarCipher('HeLLo', 3) 应返回 'KhOOr'",
        "caesarCipher 子要求 ③：别忘了测**标点**——标点、空格与其他非字母字符应保持不变——例：caesarCipher('Hello, World!', 3) 应返回 'Khoor, Zruog!'",
        "caesarCipher 子要求 ④：这一题你可能想把最终函数**拆成几个更小的函数**——测试的一个观念：**你不需要显式测试你写的每一个函数……只测公开的那些**；所以这里只需为最终的 caesarCipher 函数写测试：它按预期工作，你就可以放心小助手函数们各就各位",
        "练习 5 **analyzeArray**：接收一个数字数组，返回带四个属性的对象：**average、min、max、length**——官方示例：输入 [1,8,3,4,2,6]，对象应等于 { average: 4, min: 1, max: 8, length: 6 }"
      ],
      "terms": [
        {
          "en": "Unit test（单元测试）",
          "zh": "针对单个函数/对象的最小粒度验证——本项目五个练习全部是单元测试，也是「Unit Testing in JavaScript」系列视频标题里的那个 unit"
        },
        {
          "en": "Test case（测试用例）",
          "zh": "一条「输入 → 期望输出」对——caesarCipher 的回绕/大小写/标点是官方点名的三组边界用例"
        },
        {
          "en": "Public function（公开函数）",
          "zh": "模块对外暴露的接口——官方测试哲学：只显式测试公开的函数，内部小助手由公开函数的正确性背书"
        },
        {
          "en": "Caesar cipher（凯撒密码）",
          "zh": "每个字母按固定位数位移的替换密码——练习 4 的主题；z 之后回绕到 a，非字母字符不动"
        },
        {
          "en": "Test-first（先写测试）",
          "zh": "TDD 的节奏：先写会失败的测试，再写让它通过的最小实现——官方指令「写测试，然后让测试通过」就是这个节奏"
        },
        {
          "en": "describe / test（Jest 组织块）",
          "zh": "Jest 把相关用例归组（describe）与声明单条用例（test）的基本结构——calculator 四个方法适合按 describe 分组"
        }
      ],
      "tasks": [
        "环境先行（官方前置提醒）：按上一课 Tip 配好 Jest + Babel（@babel/preset-env@^7、babel.config.js）——npx jest 能跑通一个 hello 级测试再开工",
        "capitalize：先写测试再写实现——至少覆盖常规单词、全小写、首字母已大写、单字符、空字符串",
        "reverseString：同样测试先行——带空格、带标点、回文串（反转后不变）都值得各来一条用例",
        "calculator 对象：一个 describe 一组方法（add/subtract/divide/multiply 各若干用例）；divide 除以零官方没规定——先自己拍板行为（返回 Infinity？抛错？）并写成测试，让决定显式化",
        "caesarCipher：官方四条子要求逐条变成测试——回绕（'xyz',3→'abc'）、大小写（'HeLLo',3→'KhOOr'）、标点（'Hello, World!',3→'Khoor, Zruog!'）、负位移与大于 26 的位移也建议各测一条；拆小函数随意，但只给最终的 caesarCipher 写测试（官方哲学）",
        "analyzeArray：把官方示例对象当合同——[1,8,3,4,2,6] → { average: 4, min: 1, max: 8, length: 6 } 逐属性断言；空数组的期望官方没给——自己拍板并写成测试",
        "全部变绿后重读一遍自己的测试文件：哪些用例是「测行为」、哪些不小心「测实现」（断言了内部细节）？——这个自查正是下一课 more-testing 的主题"
      ],
      "quiz": [
        {
          "question": "官方要求「先写测试、再让测试通过」——把顺序反过来（先写实现再补测试）会失去什么？",
          "answer": "失去 TDD 的两个核心收益：① 测试先写逼你**先想清楚接口与边界**（输入什么、期望什么、除零怎么办）——实现后补的测试往往只顺着已有代码测「它做了什么」而不是「它该做什么」；② 先写的测试**必然先失败一次**——这次失败证明测试真的在测东西；后补的测试可能一出生就是绿的，却根本没断言到点子上（橡皮图章）。"
        },
        {
          "question": "caesarCipher 的三条边界子要求（回绕/大小写/标点）分别在防什么 bug？",
          "answer": "回绕（'xyz',3→'abc'）：防「位移出字母表尾巴就变成非字母字符」——charCode 加法不做模运算回绕就会得到 '{' 之类的符号；大小写（'HeLLo',3→'KhOOr'）：防「统一转小写处理忘了转回」或「大写字母位移后落到小写区间」；标点（'Hello, World!',3→'Khoor, Zruog!'）：防「空格逗号也被位移」——非字母字符必须原样通过。三条各代表一类实现失误，缺一条测试，对应 bug 就可能活到上线。"
        },
        {
          "question": "「不需要显式测试每一个函数，只测公开的」——这条官方哲学的逻辑与前提是什么？",
          "answer": "逻辑：公开函数（caesarCipher）的输出是内部小函数协作的**总结果**——总结果对了，说明小函数们大概率各就各位；给每个内部函数再写一套测试是重复劳动，还会把测试焊死在实现细节上（内部一重构测试全红）。前提：内部函数**确实是内部的**（不被别处直接调用）且公开函数的用例**覆盖了各内部的分支**（回绕/大小写/标点用例分别走过对应小函数）。more-testing 课的「隔离」会补上另一面：单个测试别依赖外部函数的正确性。"
        },
        {
          "question": "analyzeArray 的官方示例对象在 TDD 里扮演什么角色？average: 4 这个值怎么来的？",
          "answer": "它是**行为合同**：输入 [1,8,3,4,2,6]、输出对象四个属性各有期望值——先把它写成测试（toBe 逐属性或 toEqual 整对象），实现向它对齐。average 4 = (1+8+3+4+2+6)/6 = 24/6；min 1、max 8、length 6 一眼可验。合同在手的额外好处：重构实现（比如从 forEach 换 reduce）时测试不动——合同测行为，不测实现路径。"
        },
        {
          "question": "动手前官方提醒要完成什么环境设置？为什么这个提醒出现在 Assignment 的第一句？",
          "answer": "Jest 对 ESM **没有内建稳定支持**——要按「Testing Basics」课的官方 Tip 配好 Babel 转换（@babel/preset-env@^7 + babel.config.js）。放在第一句是因为它是最常见的开工翻车点：不配 Babel 直接写 import/export，第一条测试就会收到语法报错——很多人会误以为是自己代码写错，其实是环境没就绪。"
        }
      ],
      "optional": [],
      "note": "Project 课（红线课）：examples 为空数组，本站正文只有官方要求的中文化 + 测试用例设计思路，不提供任何成品代码——官方正文仅含 analyzeArray 期望对象一个代码块，本站在理解点与任务里以文字转述（输入 [1,8,3,4,2,6] → average 4 / min 1 / max 8 / length 6）。caesarCipher 三组官方示例期望输出（'xyz',3→'abc'；'HeLLo',3→'KhOOr'；'Hello, World!',3→'Khoor, Zruog!'）按原文保留。divide 除零与空数组的 analyzeArray 行为官方未规定——本站 tasks 建议「自己拍板并写成测试」，属本站学习建议而非官方要求。凯撒密码原理参考资料（crypto.interactive-maths.com）登记在资源清单按既有口径核验。",
      "why": "这是你第一次以「测试作者」身份完整走一遍 TDD：五个函数从空白到全绿，每一步都由测试牵着走——上一课读的「why/what 重于 how」在这里变成手感。caesarCipher 的四条子要求教你把模糊需求翻译成精确用例（这正是职业开发者每天做的事）；「只测公开函数」的哲学则是测试策略的第一课——它决定了你的测试是资产还是负担。写完这个项目，下一课 more-testing 讲隔离、纯函数与 mocking 时你会有具体的自家代码可对照；最终的 Battleship 大项目要求全程 TDD——这里是那段旅程的第一站。",
      "sections": [
        {
          "h": "项目定位：唯一变舒服的办法是花时间做",
          "p": [
            "官方开场白实在得很：让我们练习！测试这件事**真的没那么难，但它相当新**——唯一变舒服的办法是花时间去做的（原文 it *is* quite new，斜点是官方加的）。",
            "Assignment 的骨架一句话：**为下列函数写测试，然后让测试通过**——五个练习全部按 TDD 节奏走：测试先行、实现跟上、绿了再下一题。",
            "开工前的环境关（官方提醒放在 Assignment 第一句）：Jest 对 ESM 没有内建的稳定支持——先回「Testing Basics」课的官方 Tip 把 Babel 转换配好（@babel/preset-env@^7 + babel.config.js），别在第一条测试上就撞上语法报错。"
          ]
        },
        {
          "h": "五个练习逐一过：从热身到合同",
          "p": [
            "**① capitalize**：接收字符串、返回首字符大写的版本——热身题，但边界不少：空串、单字符、已经大写、全大写，各值得一条用例。",
            "**② reverseString**：接收字符串、返回反转——热身第二题；带空格标点的句子、反转后不变的回文，都是好用例。",
            "**③ calculator 对象**：包含 add、subtract、divide、multiply 四个函数，每个接收两个数字、返回正确计算结果——适合按 describe 分四组；divide 除以零的行为官方没有规定，自己先拍板（返回 Infinity 或抛错）并写成测试，让决定显式化。",
            "**④ caesarCipher**：接收字符串与位移因子，每个字符「位移」后返回——本项目的重头戏，下一节单独讲。",
            "**⑤ analyzeArray**：接收数字数组，返回带 average、min、max、length 四属性的对象——官方给了期望值示例：输入 [1,8,3,4,2,6] 应得 { average: 4, min: 1, max: 8, length: 6 }。把它当合同写成测试，实现向合同对齐。"
          ]
        },
        {
          "h": "caesarCipher：四条子要求就是四组边界用例",
          "p": [
            "官方在这道题下给了四条子要求，条条都是实战边界：**① 测 z 到 a 的回绕**——caesarCipher('xyz', 3) 应返回 'abc'（位移出字母表尾巴要绕回来）；**② 测大小写保留**——位移后的大小写跟随原文，caesarCipher('HeLLo', 3) 应返回 'KhOOr'；**③ 测标点**——标点、空格与其他非字母字符保持不变，caesarCipher('Hello, World!', 3) 应返回 'Khoor, Zruog!'；**④ 可拆小函数**——官方明说你可能想把最终函数拆成几个更小的。",
            "凯撒密码本身：每个字母按固定位数位移的替换密码（官方给了原理参考链接）——位移 3 就是 a→d、b→e……x→a。",
            "这四条子要求的真正身份是**测试用例设计课**：官方把「该测什么」直接写成了清单——回绕、大小写、标点是三类最容易漏的边界。把它们逐条变成测试，你的 caesarCipher 就难写出漏洞了。"
          ]
        },
        {
          "h": "官方借第 4 题教的测试哲学：只测公开的",
          "p": [
            "子要求 ④ 的后半段是本项目最值得读的一段（官方原话大意）：测试的一个观念是——**你不需要显式测试你写的每一个函数……只测公开的那些**。所以这里你只需要为最终的 caesarCipher 函数写测试：**如果它按预期工作，你就可以放心，那些更小的助手函数在做它们该做的事**。",
            "这不是偷懒，是「测行为、不测实现」的起点：内部函数怎么拆、怎么命名、将来怎么重构都随你——只要公开的 caesarCipher 在全部用例下行为正确。反过来，给每个内部小函数都焊一套测试，重构时测试全红、维护成本翻倍，测试从资产变负担。",
            "这条哲学在下一课 more-testing 会有另一面：隔离——单个测试不要**依赖**外部函数的正确性。「只测公开的」与「测试要隔离」合起来，才是完整的测试策略入门。"
          ]
        },
        {
          "h": "动手路线（本站建议）",
          "p": [
            "推荐顺序按官方编号走：①② 热身找节奏（每题都完整走「写测试 → 看它红 → 写实现 → 看它绿」）；③ calculator 练 describe 分组；④ caesarCipher 花最多时间——先把四条子要求全写成失败测试再动实现；⑤ analyzeArray 收尾，练「合同式」断言。",
            "每题之间可以跑一次全量测试（npx jest）：前面题目的绿不该被后面题目的改动打破——这就是回归测试的雏形，也是「为什么写测试」最直观的答案。",
            "全部完成后做一件官方没布置但值得的事：重读自己的测试文件，把「测行为」与「测实现」的用例分开标记——这份自查直接对接下一课。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "先写实现、后补测试",
          "text": "官方指令的顺序是「写测试，然后让测试通过」——反过来测试就成了橡皮图章：顺着已有代码测「它做了什么」而不是「它该做什么」，边界（除零、空串、回绕）最容易被漏掉，而且测试一出生就是绿的、从没证明过自己能抓到 bug。"
        },
        {
          "title": "caesarCipher 只测顺利路径",
          "text": "官方四条子要求点名了三类边界：回绕（xyz→abc）、大小写（HeLLo→KhOOr）、标点（Hello, World!→Khoor, Zruog!）——只测 'hello'→'khoor' 这种顺利路径，实现里少一个取模、少一个大小写判断都发现不了。边界用例才是这道题的练习价值所在。"
        },
        {
          "title": "给每个内部小函数都建测试文件",
          "text": "官方哲学：只测公开的函数——caesarCipher 行为对了，内部小助手大概率各就各位。给拆出来的每个 helper 都焊上测试，等于把测试绑死在实现细节上：将来换个拆法，测试全红，但程序行为其实没变。"
        },
        {
          "title": "跳过 Babel 设置直接写 import/export",
          "text": "Assignment 第一句的官方提醒就是为此：Jest 对 ESM 没有内建稳定支持——不配 Babel 的话第一条测试就报语法错，还容易误判成自己代码的问题。按上一课 Tip 配好 @babel/preset-env@^7 与 babel.config.js 再开工。"
        }
      ],
      "official": {
        "assignment": [
          "官方前置提醒：记住 Jest 对 ESM 没有内建的稳定支持——你需要按「Testing Basics」课的官方 Tip（Using ES6 import statements with Jest）设置 Babel 做 ESM/CJS 转换。为下列函数写测试，然后让测试通过！",
          "一个 capitalize 函数：接收一个字符串，返回它首字符大写的版本。",
          "一个 reverseString 函数：接收一个字符串，返回反转后的它。",
          "一个 calculator 对象：包含基本运算的函数——add、subtract、divide、multiply。每个函数接收两个数字、返回正确的计算结果。",
          "一个 caesarCipher 函数：接收一个字符串和一个位移因子，返回每个字符被「位移」后的字符串（官方附凯撒密码工作原理的参考资料）。官方子项：① 别忘了测试从 z 到 a 的回绕——例如 caesarCipher('xyz', 3) 应返回 'abc'；② 别忘了测试大小写保留——位移后的大小写应跟随原文，例如 caesarCipher('HeLLo', 3) 应返回 'KhOOr'；③ 别忘了测试标点——标点、空格与其他非字母字符应保持不变，例如 caesarCipher('Hello, World!', 3) 应返回 'Khoor, Zruog!'；④ 这一题你可能想把最终函数拆成几个更小的函数。测试的一个观念：你不需要显式测试你写的每一个函数……只测公开的那些。所以这里你只需要为最终的 caesarCipher 函数写测试——如果它按预期工作，你就可以放心那些更小的助手函数在做它们该做的事。",
          "一个 analyzeArray 函数：接收一个数字数组，返回一个带下列属性的对象：average、min、max、length。官方示例：analyzeArray([1,8,3,4,2,6]) 返回的对象应等于 { average: 4, min: 1, max: 8, length: 6 }。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/testing_javascript/project_testing_practice.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "43990fd669b46472db765ebddf6a48728f1f5d10c605dd495a50ad5f76aa6906",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-javascript-more-testing",
      "title": "More Testing",
      "zh": "更多测试",
      "group": 4,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-more-testing",
      "summary": "测试章的概念收束课，开篇给出重要基本概念——**隔离（isolation）**：一次只测一个方法；一个函数的测试**理想上不依赖外部函数的正确行为**（尤其当那函数在别处也被测着；官方坦白：如同一切理想，这并非总是可能或实际）。原因很实际：**测试失败时，你要尽快缩小失败原因**——一个依赖好几个函数的测试，失败时很难判断到底哪儿出了错。正文三块：紧耦合代码难测（guessingGame 反例：prompt、alert 与数字逻辑搅在一个函数里——官方拆解：prompt/alert 是浏览器内建、作者已测过，不必测；要测的是数字逻辑）；**纯函数**重构（evaluateGuess(magicNumber, guess) 只进只出——好测：清晰输入输出、不调外部函数；好扩展：换 DOM 交互、加多轮猜测都更容易）；官方结论：**若一开始就用 TDD 写，它很可能天生就是第二种形态——TDD 鼓励更好的程序架构，因为它鼓励你写纯函数**。紧耦合的第二解是 **mocking**：写一个行为完全按你剧本来的「假」函数——测「从 DOM input 取信息」的函数时，不必真搭网页插内容，造个总返回特定值的假版本用进测试即可。Assignment 五条：纯函数价值文、mocks 视频、Jest 的 Setup and Teardown 与 Mock Functions 两份文档、以及官方评价 amazing 的「测什么」视频（讲 Ruby 但概念放之四海皆准）。",
      "guide": "以下是官方原课的中文化梳理。这一课把「Testing Basics」的哲学与「Testing Practice」的手感收束成三个可复用的概念：隔离、纯函数、mocking——它们也是 OOP Principles 课「松耦合」在测试视角下的续集（官方 overview 第一条干脆就是「解释什么是紧耦合代码」）。guessingGame → evaluateGuess 的重构示范是全文枢纽，两段官方原码都收进了示例区：读的时候对照自己做过的 Tic Tac Toe / Restaurant Page——那些满是 DOM 调用的函数，就是官方说的「早期项目里紧耦合的样子」。官方拆解里最容易忽略的一句是「prompt 和 alert 不必测」：它们是浏览器内建、程序的外部件、写它们的人已经测过——把测试火力集中在**你自己的逻辑**上，这是隔离的另一面。纯函数一节的主句值得背下来：TDD 鼓励更好的程序架构，因为它鼓励你写纯函数——测试不只是验收工具，它在倒逼设计。mocking 是「依赖删不掉时」的第二选择（官方排序很明确：第一且最好的方案是移除依赖）——Jest 的 Mock Functions 文档（Assignment 第 4 条）就是它的工具箱。Assignment 第 5 条视频官方特意打了预防针：讲的是 Ruby——**完全不重要**，概念在任何语言都成立。学完本课，「测试 JavaScript」章收束；下一章「一点计算机科学」换赛道，而这里的隔离与纯函数思维会在算法实现里继续生效。",
      "understand": [
        "**隔离（isolation）**——测试的重要基本概念（官方开篇）：你应当**一次只测一个方法**；一个函数的测试**理想上不依赖外部函数的正确行为**——尤其当那个函数在别处也被测试时",
        "官方的坦白：如同任何理想，这**并非总是可能或实际**（not always possible or practical）——隔离是方向，不是教条",
        "隔离的原因（官方）：测试失败时，你要能**尽快缩小失败的原因**——一个依赖好几个函数的测试，很难判断到底哪里出了错",
        "lesson overview 三条：解释什么是**紧耦合代码** / 描述**纯函数**及其与 TDD 的关系 / 解释什么是 **mocking**",
        "TDD 最大的好处之一起初不明显（官方）：它**帮你写出更好的代码**——回看早期项目你会发现一切紧耦合：函数互相引用、整个代码里满是 DOM 方法或 console.log()",
        "**紧耦合代码难测**：官方反例 guessingGame 把 prompt 取输入、数字比较、alert 显示全搅在一个函数里——想给它写测试无从下手",
        "官方拆解第一步：**prompt 和 alert 不需要测**——它们是浏览器内建、外在于你的程序，写它们的人已经测过了；**真正要测的是数字逻辑**——把它从其他函数里解缠出来就容易得多",
        "官方重构：**evaluateGuess(magicNumber, guess)** 纯函数——只接收输入、只返回消息字符串（TOO BIG / TOO SMALL / YOU DID IT! 🎉 / INVALID INPUT）；guessingGame 退化成薄薄的交互层（prompt 取数 → evaluateGuess 判断 → alert 显示）",
        "重构的两个好处（官方）：**好测**——清晰的输入输出、不调用任何外部函数；**好扩展**——想把 prompt/alert 换成操纵 DOM 的方法、或让用户多轮猜测，都更容易了",
        "官方结论（本课主句）：如果一开始就用 TDD 写这个程序，它**很可能天生就更像第二个例子**——**TDD 鼓励更好的程序架构，因为它鼓励你写纯函数（Pure Functions）**",
        "紧耦合的**两个解法**（官方排序）：第一且最好——像上面那样**把依赖从代码里移除**；并不总是可行，于是第二——**mocking**：写一个「假」版本的函数，行为**完全按你想要的来**",
        "官方 mocking 例子：测一个**从 DOM input 取信息**的函数——你并不想为了跑测试真去搭一个网页、动态往 input 里插内容；用 mock 函数造一个**总返回特定值**的「取输入」假版本，把它用进测试"
      ],
      "terms": [
        {
          "en": "Isolation（隔离）",
          "zh": "一次只测一个方法；测试不依赖外部函数的正确行为——失败时才能尽快缩小原因；官方承认并非总是可能，是方向不是教条"
        },
        {
          "en": "Tightly coupled code（紧耦合代码）",
          "zh": "函数互相引用、满是 DOM 方法与 console.log 的代码——难测的根源；OOP Principles 课从设计角度点过名，本课从测试角度再讲一遍"
        },
        {
          "en": "Pure function（纯函数）",
          "zh": "输入决定输出、不调用外部函数、不产生副作用——好测又好扩展；TDD 鼓励更好架构的原因就是它鼓励你写纯函数"
        },
        {
          "en": "Mocking（ mocking，模拟）",
          "zh": "写一个行为完全按你剧本来的「假」函数替代真实依赖——紧耦合的第二解法（第一且最好是移除依赖）；Jest 有专门的 Mock Functions 文档"
        },
        {
          "en": "Setup and Teardown",
          "zh": "测试前的准备与测试后的清理（Jest 的 beforeEach/afterEach 等）——Assignment 指定文档，官方说练过 TDD 后读它「会很有感觉」"
        },
        {
          "en": "Side effect（副作用）",
          "zh": "函数除了返回值之外对外部世界的改动（弹框、写 DOM、改全局变量）——副作用多的函数难隔离测试，拆纯函数就是把它挤到边缘层"
        }
      ],
      "tasks": [
        "读纯函数的价值一文（Assignment 第 1 条，Medium）：官方评价 quick article——读完对照 evaluateGuess 例子确认自己能给「纯」下定义",
        "看测试中 mocks 的视频（Assignment 第 2 条，视频不声称有中文字幕）",
        "读 Jest 文档的「Setup and Teardown」节（Assignment 第 3 条）：官方说现在你有了 TDD 的练习与语境，这一节应该会很有感觉（make good sense）",
        "读 Jest 的 Mock Functions 文档（Assignment 第 4 条）：官方评价 really handy——mocking 的工具箱就在这里",
        "看「代码库里该测什么」视频（Assignment 第 5 条，官方评价 amazing）：视频专门讲 Ruby 语言的测试——官方明说这完全不重要（doesn't matter *at all*），概念在任何语言都成立，Ruby 足够清晰、跟得上",
        "本站补充练习：翻出你做过的 Tic Tac Toe 或 Restaurant Page，找一个满是 DOM 调用的函数，按 guessingGame → evaluateGuess 的模式在纸上拆成「纯逻辑 + 薄交互层」——不必真重构，拆得动就说明概念到位了"
      ],
      "quiz": [
        {
          "question": "什么是测试里的「隔离」？官方为什么紧接着承认它「并非总是可能或实际」？",
          "answer": "隔离 = 一次只测一个方法，且一个函数的测试理想上不依赖外部函数的正确行为（尤其当那函数在别处也被测着）。目的：测试失败时能**尽快缩小原因**——依赖链越长，失败点越难定位。官方承认不总是可能，是因为真实代码里依赖无法完全消除（模块总要协作）——隔离是**方向**：能拆的拆成纯函数，拆不掉的用 mocking 顶替，剩下的接受并在失败时多想一层。"
        },
        {
          "question": "guessingGame 反例里，官方说哪些部分不需要测？为什么？剩下的要测什么？",
          "answer": "prompt 和 alert **不需要测**：它们是浏览器内建函数、外在于你的程序，**写它们的人已经测过了**——测别人保证过的东西是浪费。真正要测的是**数字逻辑**（猜大了/猜小了/猜中了/无效输入的判断）——把它从 prompt/alert 的包围里解缠出来（重构成 evaluateGuess 纯函数）之后，它就变得好测：清晰的输入输出、不调用任何外部函数。"
        },
        {
          "question": "evaluateGuess 重构带来哪两个好处？「TDD 鼓励更好的程序架构」这句话的因果链是什么？",
          "answer": "两个好处（官方）：① **好测**——纯函数有清晰的输入输出、不调外部函数；② **好扩展**——想把 prompt/alert 换成 DOM 操纵、或加多轮猜测，交互层薄薄一层随便换，逻辑一行不动。因果链：TDD 要求你为每个功能先写测试 → 紧耦合、满副作用的函数**没法写测试** → 你被迫把逻辑拆成可测的纯函数、把副作用挤到边缘 → 拆完的代码天然分层清晰——所以说 TDD 鼓励更好的架构，因为它鼓励你写纯函数；官方还补了一句：若一开始就用 TDD，guessingGame 很可能天生就是第二种形态。"
        },
        {
          "question": "紧耦合代码的两个解法是什么？官方给的 mocking 例子解决什么麻烦？",
          "answer": "官方排序：**第一且最好**——把依赖从代码里移除（重构成纯函数）；不总是可行时**第二**——**mocking**：写一个行为完全按你想要的「假」函数。例子：测一个从 DOM input 取信息的函数——真测它得搭网页、动态往 input 插内容，太重；mock 一个「取输入」的假函数、让它总返回特定值，测试里用它替代真实依赖——测试瞬间变成纯逻辑验证。Jest 的 Mock Functions 文档（Assignment 第 4 条）就是这套工具。"
        },
        {
          "question": "Assignment 最后一支视频讲的是 Ruby 测试——官方为什么说你照样该看？",
          "answer": "官方原话：视频专门讲 Ruby 语言的测试，**但这完全不重要**（doesn't matter at all）——「该测什么」的概念在任何语言都成立（ring true in any language），而且 Ruby 足够清晰，你能顺利跟上。这正呼应本课主题：测试的价值在**策略层**（测什么、隔离、纯函数、mock），语法与语言只是载体——与「Testing Basics」的 why/what 重于 how 是同一条线。"
        }
      ],
      "optional": [],
      "note": "本课官方原文没有 Knowledge check 一节。overview 第一条「解释什么是紧耦合代码」与 OOP Principles 课的「松耦合」条目同源——本站在讲解中如实回指、不重复展开设计视角。guessingGame 反例与 evaluateGuess 重构两段为官方原码（收进示例区）。Assignment 第 1 条为 Medium 文章，按本站对 Medium 的既有核验经验处理（403 反爬则如实登记受限）；第 5 条视频官方明言讲 Ruby 但概念通用。",
      "why": "这一课把前两课的「会用 Jest」升级成「会设计可测的代码」：隔离告诉你测试的组织原则，纯函数告诉你代码的拆分方向，mocking 告诉你依赖拆不掉时的替代手段——三件套合起来，就是职业前端写测试的日常心智。它同时是 OOP Principles 的实战续集：当年「把 DOM 抽出去」的设计建议，这里给出了第二个理由——不抽就没法测。往后所有项目（Battleship 要求 TDD）与所有团队协作（代码要交给别人维护）都建立在这三件套上；面试里「你怎么测一个依赖 DOM 的函数」这类问题，标准答案就是本课的拆分 + mocking。",
      "sections": [
        {
          "h": "隔离：失败时尽快缩小原因",
          "p": [
            "官方开篇给出测试的重要基本概念：**隔离（isolation）**——你应当**一次只测一个方法**；一个函数的测试**理想上不依赖外部函数的正确行为**，尤其当那个函数在别处也被测试时。",
            "紧接着是官方的坦白：如同任何理想，这**并非总是可能或实际**——真实代码里模块总要协作，依赖无法完全消除。隔离是方向，不是教条。",
            "为什么要隔离？官方给的理由非常实际：**当你的测试失败时，你要能尽快缩小失败的原因**——如果一个测试依赖好几个函数，失败时就很难判断到底是哪里出了错。一个测试只压一个方法，红了就是它的问题——定位成本从「排查依赖链」降到「看这一个函数」。"
          ]
        },
        {
          "h": "紧耦合代码难测：guessingGame 反例",
          "p": [
            "TDD 最大的好处之一起初并不明显（官方）：它**帮你写出更好的代码**。官方让你回看自己的早期项目：一切**紧耦合**——函数里到处引用别处的函数，整个代码**满是** DOM 方法或 console.log()。（这正是 OOP Principles 课点名过的紧耦合，这里换测试视角再看一遍。）",
            "**紧耦合代码难测！**官方反例 guessingGame（原码见示例区）：prompt 取猜测、与 magicNumber 比较、alert 弹结果——全在一个函数里。想给它写测试？prompt 和 alert 在 Node 测试环境里根本不存在，逻辑又被它们包着——无从下手。",
            "官方拆解：**prompt 和 alert 不需要测**——它们是浏览器内建、外在于你的程序，**写它们的人已经测过了**。真正要测的是**数字逻辑**——而把它从其他函数里解缠出来之后，它就好测多了。"
          ]
        },
        {
          "h": "纯函数：evaluateGuess 重构",
          "p": [
            "官方重构（原码见示例区）：**evaluateGuess(magicNumber, guess)**——只接收两个参数、只返回消息字符串（TOO BIG / TOO SMALL / YOU DID IT! 🎉 / INVALID INPUT），不碰 prompt 不碰 alert；guessingGame 退化成薄薄的交互层：prompt 取数 → evaluateGuess 判断 → alert 显示结果。",
            "重构后（官方）：真正需要测的只有 evaluateGuess——**清晰的输入输出、不调用任何外部函数**，测试写起来轻而易举。而且这个实现**好得多**：想把 prompt/alert 换成操纵 DOM 的方法？交互层换掉即可；想让用户多轮猜测？逻辑一行不动。",
            "官方结论值得整句记住：**如果一开始就用 TDD 写这个程序，它很可能天生就更像第二个例子——测试驱动开发鼓励更好的程序架构，因为它鼓励你写纯函数（Pure Functions）**。测试不只是验收工具——它在倒逼设计。"
          ]
        },
        {
          "h": "Mocking：依赖删不掉时的第二解法",
          "p": [
            "对「紧耦合代码」问题，官方给了**两个解法**并排了序：**第一，也是最好的**——像上面那样**把依赖从代码里移除**；但这**并不总是可行**。",
            "**第二个选择是 mocking**：写一个「假」版本的函数，让它**永远完全按你想要的行为来**。",
            "官方例子：你在测一个**从 DOM input 取信息**的函数——你并不想为了跑测试，真去搭一个网页、再动态往 input 里插内容。用 mock 函数，你可以造一个**总返回特定值**的「取输入」假版本，把**它**用进测试——测试瞬间回到纯逻辑验证的轨道上。Jest 为此提供了成手的工具（Assignment 第 4 条的 Mock Functions 文档，官方评价 really handy）。"
          ]
        },
        {
          "h": "Assignment 导读：纯函数、mocks 与「该测什么」",
          "p": [
            "五条资料的分工：**① 纯函数的价值**（Medium 快读）——给「纯」下定义；**② mocks 视频**——看 mocking 实战；**③ Jest 的 Setup and Teardown 文档**——官方说：现在你有了 TDD 的练习与语境，这节应该会很有感觉（beforeEach/afterEach 就是隔离的配套工具：每条测试前重置现场）；**④ Jest 的 Mock Functions 文档**——mocking 工具箱；**⑤ 「代码库里该测什么」视频**——官方评价 amazing。",
            "第 ⑤ 条官方特意打预防针：视频专门讲 **Ruby** 语言的测试——**但这完全不重要**（doesn't matter *at all*）：概念在任何语言都成立，而且 Ruby 足够清晰、你跟得上。",
            "建议顺序：①② 建概念 → ③④ 上手 Jest 工具 → ⑤ 拔高到策略层（测什么比怎么测重要——与「Testing Basics」的 why/what 定盘星首尾呼应）。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "function guessingGame() {\n  const magicNumber = 22;\n  const guess = prompt('guess a number between 1 and 100!');\n  if (guess > magicNumber) {\n    alert('YOUR GUESS IS TOO BIG');\n  } else if (guess < magicNumber) {\n    alert('YOUR GUESS IS TOO SMALL');\n  } else if (guess == magicNumber) {\n    alert('YOU DID IT! 🎉');\n  } else {\n    return 'INVALID INPUT';\n  }\n}",
          "note": "官方反例原码：prompt、alert 与数字比较逻辑搅在一个函数里——紧耦合、没法测（prompt/alert 在测试环境不存在，逻辑又被它们包着）。官方拆解：prompt/alert 是浏览器内建、作者已测过、不必测；要测的数字逻辑得先解缠出来。"
        },
        {
          "lang": "javascript",
          "code": "function evaluateGuess(magicNumber, guess) {\n  if (guess > magicNumber) {\n    return 'YOUR GUESS IS TOO BIG';\n  } else if (guess < magicNumber) {\n    return 'YOUR GUESS IS TOO SMALL';\n  } else if (guess == magicNumber) {\n    return 'YOU DID IT! 🎉';\n  } else {\n    return 'INVALID INPUT';\n  }\n}\n\nfunction guessingGame() {\n  const magicNumber = 22;\n  const guess = prompt('guess a number between 1 and 100!');\n  const message = evaluateGuess(magicNumber, guess);\n  alert(message);\n}\n\nguessingGame();",
          "note": "官方重构原码：evaluateGuess 是纯函数——清晰的输入输出、不调用任何外部函数，测试只需断言「输入对 → 返回的消息对」；guessingGame 退化成薄交互层。官方结论：若一开始就用 TDD，程序很可能天生就是这个形态——TDD 鼓励更好的架构，因为它鼓励你写纯函数。"
        }
      ],
      "pitfalls": [
        {
          "title": "一个测试横跨好几层函数",
          "text": "隔离的反面：测试 A 函数却顺带依赖 B、C、D 的正确性——红了以后得排查整条链才能定位。官方原则：一次只测一个方法；依赖删不掉就 mock 掉，让每条测试只对一件事负责。"
        },
        {
          "title": "给 prompt/alert 这类浏览器内建写测试",
          "text": "官方明说：它们外在于你的程序，写它们的人已经测过了。把火力集中在自己的逻辑上——guessingGame 里真正要测的只有数字比较那一段。"
        },
        {
          "title": "逻辑函数里留着 DOM 调用，然后抱怨没法测",
          "text": "难测是设计信号，不是测试框架的锅：按 evaluateGuess 模式把逻辑拆成纯函数、副作用挤到薄交互层——拆完自然可测。官方：TDD 鼓励更好的架构，因为它逼你早点拆。"
        },
        {
          "title": "一上来就 mock 一切",
          "text": "官方给两个解法排了序：第一且最好的是**移除依赖**（重构成纯函数）；mocking 是不总可行时的第二选择。能用设计解决的问题别用替身——mock 多了，测试测的就是你的剧本而不是真实行为。"
        }
      ],
      "official": {
        "assignment": [
          "读这篇关于「纯函数」价值的快读文章（Medium：JavaScript — What are pure functions and why do they matter?）。",
          "看这支关于测试中 mocks 的视频（YouTube，视频不声称有中文字幕）。",
          "现在你对 TDD 有了一些练习和语境，Jest 文档的「Setup and Teardown」一节应该会很有感觉（make good sense）。",
          "读 Jest 非常好用的 mocking functions 文档（官方评价 really handy）。",
          "看这支官方评价 amazing 的视频：代码库里该测什么（what to test in your codebase）。视频专门讲 Ruby 语言的测试——但这完全不重要（doesn't matter at all）：这里的概念在任何语言都成立，而且幸运的是 Ruby 足够清晰，你能顺利跟上。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/testing_javascript/more_testing.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "44d6966e4c3dcf60e7d74f17db93d9f01a0d4f14d544ccef27ab9f5d8d26bdb4",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "javascript-a-very-brief-intro-to-cs",
      "title": "A Very Brief Intro to CS",
      "zh": "计算机科学极简引言",
      "group": 5,
      "url": "https://www.theodinproject.com/lessons/javascript-a-very-brief-intro-to-cs",
      "summary": "「一点计算机科学」章的开篇定调课。官方先给一句扎心的类比：你已经能造出不少酷东西、不需要太多正规教育也能做出像样的网站——但**能写小学水平的英语，不代表你马上能去编辑纽约时报**。编程世界里，「用蛮力解决问题」和「把问题解决得漂亮（WELL）」是两回事：基础编程阶段讲的是写好代码的第一层（拆块组织），接下来几课训练的是**找出最好写的代码——手头问题最优雅（elegant）的解法**。为什么值得学：有些问题需要数组和迭代器之外的工具；别人早已为某类问题想出了好方法，**没必要重新发明轮子**；当你的网站非常成功、开始处理大数据集时，解法质量尤其重要；还有一条实在的动机——**求职面试会直接问到这些**。官方同时把预期放平：要戴一会儿思考帽，但不会做任何太疯狂的事——**贴着材料的实用面走，而不是深陷理论**。lesson overview 只有两条：了解算法（algorithms）、弄清什么是伪代码（pseudocode）——两条全部由 Assignment 的五份外部资料承担（四支视频 + 一条 Quora 回答）。",
      "guide": "以下是官方原课的中文化梳理。这是一课「定调引言」：官方正文不教任何具体算法，只回答「为什么前端开发者要碰计算机科学」——两个 overview 词条（算法、伪代码）的定义与展开全部放进 Assignment 的五份资料里，本站按官方结构如实组织、不额外加戏。读法建议：把正文当「学习动机说明书」，五份资料按序完成——TedEd 的 Introduction to Algorithms 建立「算法思维」第一印象；What is an Algorithm? 给结构化视角；Quora 回答补上「web 开发为什么在乎算法」的行业语境；What is pseudocode? 补 overview 第二条；Telusko 的 DSA 视频收束到「数据结构与算法」全景并顺带回答「公司为什么想招懂 DSA 的人」。这一章接下来的路线官方已排好：递归（recursive-methods + Project: Recursion）→ 复杂度度量（time/space complexity）→ 数据结构与搜索（common data structures + 链表/HashMap/二叉搜索树/骑士之旅四个项目）——本课是这段旅程的门票检查站：动机对了，后面的思考帽才戴得住。",
      "understand": [
        "官方类比（开篇定调）：你已经能造出酷东西、不需要太多额外的正规教育也能做出像样的网站——**但正如能写小学水平的英语不代表能编辑纽约时报**，能跑通的代码与解得漂亮的代码是两回事",
        "编程世界里的分界：**用蛮力（brute force）解决问题** vs **把问题解决得好（WELL）**——基础编程阶段碰过第一层（把代码拆成组织良好的块），接下来几课训练**找出该写的最好代码——手头问题最优雅的解法**",
        "什么时候尤其重要（官方）：当你开始处理**大数据集**——比如你的网站变得非常成功的时候",
        "为什么看这些「更计算机科学」的概念（官方）：它们成为基础是有原因的——**有些问题需要数组和迭代器之外的工具**；别人已经为某类问题想出了好方法，**没必要重新发明轮子**（reinventing the wheel）",
        "实在的动机（官方原话）：这套课程意在为你准备**网页之外的生活**——如果你打算求职，**面试会被直接问到这些东西**",
        "官方的预期管理：这需要你戴上思考帽（put on your thinking cap）——但**不会做任何太疯狂的事**；**贴着材料的实用面走，而不是深陷理论**",
        "lesson overview 只有两条：**了解算法（algorithms）** / **弄清什么是伪代码（pseudocode）**——两条全部由 Assignment 资料承担，正文不展开",
        "Assignment 五份资料的分工：TedEd 的 Introduction to Algorithms（David Malan）看「怎么思考算法」；What is an Algorithm? 看「用算法解决问题的结构化视角」；Quora 回答补「算法对 web 开发的重要性」语境；What is pseudocode? 补第二条 overview；Telusko 的 DSA 视频给「数据结构与算法」快速全景 + 公司为什么想招熟悉 DSA 的候选人"
      ],
      "terms": [
        {
          "en": "Algorithm（算法）",
          "zh": "系统性解决问题的方法——overview 第一条，由 TedEd 与 What is an Algorithm? 两支视频展开"
        },
        {
          "en": "Pseudocode（伪代码）",
          "zh": "用接近自然语言的方式写出解题步骤、不绑定任何编程语言的语法——overview 第二条，由 What is pseudocode? 视频展开"
        },
        {
          "en": "Brute force（蛮力法）",
          "zh": "不管效率、硬碰硬地解决问题——官方用它对照「解得漂亮」：能跑通不等于解得好"
        },
        {
          "en": "Elegant solution（优雅解法）",
          "zh": "官方对这一章的期望：找出该写的最好代码——手头问题最优雅的解法"
        },
        {
          "en": "DSA（Data Structures and Algorithms，数据结构与算法）",
          "zh": "本章内容的行业统称——Telusko 视频的主题，也是面试语境里的高频缩写"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：把「纽约时报类比」与「不重新发明轮子」两句定调记牢",
        "看 TedEd 的 Introduction to Algorithms（David Malan 讲）（Assignment 第 1 条）：学习「怎么思考算法」（视频不声称有中文字幕）",
        "看 What is an Algorithm?（Assignment 第 2 条）：用算法解决问题的更结构化视角",
        "读 Quora 回答「算法对 web 开发的重要性」（Assignment 第 3 条）：为「我们为什么要过这些东西」补上行业语境",
        "看 What is pseudocode?（Assignment 第 4 条）：把 overview 第二条「什么是伪代码」落实",
        "看 Telusko 的数据结构与算法视频（Assignment 第 5 条）：DSA 快速全景 + 公司为什么想招熟悉 DSA 的候选人"
      ],
      "quiz": [
        {
          "question": "官方的「纽约时报」类比想说明什么？",
          "answer": "说明「能做出东西」与「做得专业」之间隔着系统训练：你已经能造出酷网站（相当于能写小学水平的英语），但那不代表你能编辑纽约时报（相当于写出解得漂亮的代码）。类比落到课程上：接下来的 CS 章节不是教你「再多写点网页」，而是训练你**找出最优雅的解法**——从「能跑」升级到「跑得好」。"
        },
        {
          "question": "官方给出的「为什么前端开发者要学 CS 概念」有哪几条理由？",
          "answer": "三条：**① 工具不够用**——有些问题需要数组和迭代器之外的工具，别人早已为某类问题想出好方法，没必要重新发明轮子；**② 规模会来**——当网站非常成功、开始处理大数据集时，解法质量尤其重要；**③ 面试会问**——课程意在为你准备网页之外的生活，求职面试会被直接问到这些东西。官方同时放平预期：贴实用面走、不深陷理论、不做太疯狂的事。"
        },
        {
          "question": "本课 lesson overview 只有两条（算法、伪代码）——官方把它们放在哪里展开？",
          "answer": "全部放在 Assignment 的五份外部资料里：算法由 TedEd 的 Introduction to Algorithms、What is an Algorithm? 两支视频加 Quora 回答展开；伪代码由 What is pseudocode? 视频展开；Telusko 的 DSA 视频再给一个「数据结构与算法」的全景收束。正文本身只做动机定调——这也是本站讲解如实按官方结构组织、不加戏的原因。"
        },
        {
          "question": "「用蛮力解决问题」和「把问题解决得 WELL」的区别，在你写过的代码里对应什么？",
          "answer": "官方语境：蛮力 = 不管效率硬碰硬（比如用嵌套循环把整个数据集扫一遍又一遍）；WELL = 找到该问题最优雅的解法（比如换用更合适的数据结构或已知算法）。对应到你的项目：Tic Tac Toe 的胜负判断、Restaurant Page 的数据组织当时怎么写都能跑——但当数据量上来（网站非常成功的假设），蛮力解法的代价会显形。这一章接下来的递归、复杂度、数据结构就是「WELL」的工具箱。"
        }
      ],
      "optional": [],
      "note": "本课官方正文没有代码块（examples 为空数组是结构事实，与 Project 红线无关），正文也不展开 overview 的两个词条——「算法」「伪代码」的定义与讲解全部由 Assignment 的五份外部资料承担，本站如实按官方结构组织。Assignment 第 3 条为 Quora 回答，官方给的是 qr.ae 短链形式；五份资料中的视频均不声称有中文字幕。",
      "why": "这一课回答的是「为什么」——而「为什么」决定你能走多远。接下来的十一章内容（递归、复杂度、数据结构、四个算法项目）都需要戴思考帽，动机不牢很容易在 time complexity 的渐近记号或二叉搜索树的平衡条件前弃疗。官方给的三条理由里，「面试会问」最现实：前端岗位的算法面试考的就是这一章的内容；「不重新发明轮子」最长期：知道链表/哈希表/二叉树各自擅长什么，你才能在真实工程里选对工具；「大数据集」最工程：网站成功后，O(n²) 的循环就是事故现场。带着这三条动机进章，后面的思考帽才戴得住。",
      "sections": [
        {
          "h": "从「能跑」到「解得漂亮」",
          "p": [
            "官方开场先肯定你：已经学会了造一些酷东西——坦白说，不需要太多额外的正规教育，你大概也能做出像样的网站。**但是**，紧接着是那个著名的类比：**正因为你能写小学水平的英语，不代表你很快能去编辑纽约时报**。",
            "编程世界里的对应分界：**用蛮力方式解决问题**与**把问题解决得好（WELL）**是两回事。官方说，覆盖基础编程时已经碰过第一层——你应该把代码拆成组织良好的块。",
            "如果说那些课都是关于**学习怎么写好代码**，那接下来几课是关于**训练你自己找出该写的最好代码——手头问题最优雅的解法**。官方点名它变得尤其重要的时刻：当你开始处理**大数据集**——比如你的网站变得非常成功的时候。"
          ]
        },
        {
          "h": "为什么学 CS 概念：别重新发明轮子",
          "p": [
            "官方给的第一条理由：我们在这里看一些更「计算机科学」的概念，**因为它们成为基础是有原因的**——有些问题需要你使用**数组和迭代器之外**的工具。",
            "第二条理由藏在谚语里：当别人已经为某些类型的问题想出了好的解决方法时，**重新发明轮子没有意义**（There's no sense reinventing the wheel）——这一章教的链表、哈希表、二叉树、搜索算法，全是别人发明好的轮子。",
            "第三条理由最实在（官方原话）：如果这还不能让你感兴趣，记住这套课程意在为你准备**网页之外的生活**——如果你有兴趣求职，**你会被直接问到这些东西**。"
          ]
        },
        {
          "h": "官方的预期管理：实用面优先",
          "p": [
            "官方知道这一章要戴思考帽（put on your thinking cap——还自嘲了一句 sorry, it had to happen sometime），但立刻把预期放平：**我们不会做任何太疯狂的事**。",
            "路线承诺：**贴着材料的实用面走，而不是过于深陷理论**——这一章的复杂度记号、数据结构都按「够用就好」的深度讲，数学向的延伸官方只在资料里标了「感兴趣随意」。",
            "这份预期管理与本章的课程编排一致：概念课（递归、时间/空间复杂度、常见数据结构）都短小精悍，重量全压在四个动手项目（Recursion、Linked Lists、HashMap、Binary Search Trees、Knights Travails）上——学一点、用一点。"
          ]
        },
        {
          "h": "Assignment 导读：两个词条，五份资料",
          "p": [
            "lesson overview 只有两条——**了解算法**、**弄清什么是伪代码**——官方正文不展开，五份资料各司其职：**① TedEd 的 Introduction to Algorithms**（David Malan）看怎么**思考**算法；**② What is an Algorithm?** 给用算法解决问题的更结构化视角；**③ Quora 回答「算法对 web 开发的重要性」**补行业语境——为什么我们要过这些东西；**④ What is pseudocode?** 落实第二条 overview；**⑤ Telusko 的数据结构与算法视频**给 DSA 快速全景，顺带回答「公司为什么可能想招熟悉 DSA 的候选人」。",
            "五份资料里四支视频、一条 Quora 回答，总量不大——官方对引言课的定位就是「定调 + 建立词条」，别在这里恋战，本章的正菜从下一课递归开始。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "把引言课当正菜啃，陷进理论",
          "text": "官方明说这一章贴实用面走、不深陷理论——引言课的词条（算法/伪代码）看完五份资料就该动身；真正的深度在后面的递归、复杂度与四个项目里。在门票检查站逗留太久，容易还没进园就累了。"
        },
        {
          "title": "觉得「前端不需要 CS」而跳过本章",
          "text": "官方给了三条反驳：有些问题需要数组和迭代器之外的工具；网站成功后大数据集会找上门；求职面试会直接问到这些。跳过本章的代价不在今天——在第一次面试被问 O(n²)、第一次遇到性能事故的时候。"
        },
        {
          "title": "把「蛮力能跑通」当成「解决了」",
          "text": "官方开篇的分界就是冲这个来的：能跑通是小学水平英语，解得漂亮才是纽约时报。本章之后的每个项目（链表、HashMap、BST）都会让你在「能跑」与「跑得对且快」之间做选择——从这一课起养成问一句「这是最优雅的解法吗」的习惯。"
        }
      ],
      "official": {
        "assignment": [
          "看 TedEd 上 David Malan 的 Introduction to Algorithms，学习怎么思考算法。",
          "看 YouTube 上的 What is an Algorithm?，获得用算法解决问题的更结构化的视角。",
          "读这条关于算法对 web 开发的重要性的 Quora 回答（官方给的是 qr.ae 短链），了解我们为什么要过这些东西的语境。",
          "看 What is pseudocode?（什么是伪代码）。",
          "看 Telusko 关于数据结构与算法的视频，快速总览 DSA，以及公司为什么可能有兴趣雇佣熟悉 DSA 的候选人。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/computer_science/a_very_brief_intro_to_cs.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "fa1a8bb0b7f8661b71454dfa305e3f3cf6d10dc59423a6cd7b0e14c3ef8b0b43",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "javascript-recursive-methods",
      "title": "Recursive Methods",
      "zh": "递归方法",
      "group": 5,
      "url": "https://www.theodinproject.com/lessons/javascript-recursive-methods",
      "summary": "递归的定义官方一句话给完：**递归就是函数调用自己的想法，仅此而已**（That is all there is to it）。它的用途是**分而治之（Divide and Conquer）**：把大问题开始拆成越来越小的块，把子问题的解持续喂回原函数，直到得出某种答案、整条链**展开（unwinds）**。官方引用维基对 D&C 的定义：基于多分支递归的重要算法设计范式——递归地把问题拆成两个或更多同类（或相关）的子问题，直到它们简单到可以直接解决；再把子问题的解组合起来，得到原问题的解。但官方立刻泼了清醒的凉水：递归**有用对的和用错的方式**——任何能用递归解决的问题，**也能用你熟爱的迭代器解决**；如果你发现自己在说「为什么我刚才不就用个 while 循环」，那你大概真该用。你不会经常以递归方案收尾，但应该**培养出「什么时候递归可能是好主意」的手感**；还有些问题会拆出太多块、彻底压垮计算机内存——**要有平衡**。lesson overview 六条（递归为何有用 / 递归方案的局限 / 哪类问题更适合循环 / 递归深度概念 / 什么是 stack overflow——概念而非那个网站 / stack overflow 为何与递归问题相关）由 Assignment 资料承担：第 1 条 javascript.info 的递归入门文是核心展开，第 6 条官方练习仓库的 recursion 目录动手。Tip：用调试器！逐层追踪递归很难，别难为自己。",
      "guide": "以下是官方原课的中文化梳理。这一课正文很短（官方本来就是「简要课」），概念展开全在 Assignment 里——本站讲解按「定义 → D&C 引文 → 用对与用错 → Assignment 导读」组织，overview 六条里正文只详写了前两条半（为什么有用、局限、何时用循环），后三条半（递归深度、stack overflow 概念及其与递归的关系）由 Assignment 第 1 条 javascript.info 的 recursion 一文展开——那篇文章正是讲递归深度与调用栈的经典入门，第 5 条维基 D&C 文的「Implementation Issues」节再补局限面。动手部分：第 6 条是官方 javascript-exercises 仓库的 computer_science/recursion/ 目录（按序完成每个练习、先读各自 README）——这是 Fundamentals 阶段同款练习仓库的进阶目录，你已有 fork/clone 经验。Tip「用调试器」值得当真：递归的每一层都有独立的参数与状态，肉眼追栈非常痛苦，断点 + 调用栈面板（Call Stack）是标准工具——「Organizing Your JavaScript Code」章的调试经验在这里直接复用。下一课 Project: Recursion 立刻用两个经典问题（Fibonacci、Merge Sort）验收本课概念。",
      "understand": [
        "官方一句话定义：**递归就是函数调用自己的想法——仅此而已**（That is all there is to it）",
        "递归的用途（官方）：把一个大问题**开始拆成越来越小的块**（「分而治之」Divide and Conquer），把它们的解**持续喂回原函数**，直到得出某种答案、**整条链展开（the whole chain unwinds）**",
        "维基对 D&C 的定义（官方引用）：计算机科学里，分而治之是**基于多分支递归**的重要算法设计范式——递归地把问题拆成**两个或更多同类（或相关）的子问题**，直到它们**简单到可以直接解决**；子问题的解再**组合**起来，给出原问题的解",
        "官方的清醒剂：递归**有用对的和用错的方式**——事实是，**任何你能用递归解决的问题，也能用你熟知且喜爱的迭代器解决**",
        "官方的自检信号：如果你发现自己在说「**为什么我刚才不就用个 while 循环？**」——那你大概真该用 while 循环",
        "预期校准（官方）：你**不会经常**以递归方案收尾，但你应当**培养出对「什么时候递归可能是好主意」的手感**",
        "官方的警告：有些问题会**拆出太多太多的块、彻底压垮你计算机的内存**——递归要有平衡（There's a balance）",
        "官方对本课的定位：这是一课简要介绍——学**何时**与**如何**用递归，然后**下一个项目**里应用（官方原话：不亲手试过大概不会真正记住）",
        "lesson overview 六条：理解递归为何是解决大问题有用的技术 / 认识递归方案的局限 / 识别哪类问题更适合用循环解决 / 学「递归深度（recursive depth）」概念 / 理解什么是「stack overflow」（**概念，不是那个网站**）/ 理解 stack overflow 为何与递归问题相关——后三条由 Assignment 第 1 条的 javascript.info 递归文展开",
        "官方 Tip「**用调试器！**」：逐层追踪递归函数里发生什么可能相当难——**别难为自己**；如果你还没养成解题时用调试器的习惯（没有的话你错过了很多），现在是熟悉它的好时机——它能让追踪代码流容易得多"
      ],
      "terms": [
        {
          "en": "Recursion（递归）",
          "zh": "函数调用自己——把大问题拆成越来越小的同类子问题，解喂回原函数，直到得出答案、整条链展开"
        },
        {
          "en": "Divide and Conquer（D&C，分而治之）",
          "zh": "基于多分支递归的算法设计范式（维基定义，官方引用）：递归拆子问题 → 子问题简单到直接解 → 组合子解得原解"
        },
        {
          "en": "Unwinding（链展开）",
          "zh": "递归触底后逐层返回、把子解一路组合回顶层的过程——官方定义句里的 the whole chain unwinds"
        },
        {
          "en": "Recursive depth（递归深度）",
          "zh": "递归调用叠了多少层——overview 词条，由 javascript.info 递归文展开；深度失控的终点就是 stack overflow"
        },
        {
          "en": "Stack overflow（栈溢出，概念）",
          "zh": "调用栈超出上限——递归层数太深（或缺少触底条件）时发生；官方特意注明是概念、不是那个问答网站"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：记住一句话定义与「while 循环自检信号」",
        "读 javascript.info 的递归入门文（Assignment 第 1 条）：overview 的递归深度、stack overflow 等词条由它展开——官方注明**文末练习不必完成**（You do *not* need to complete the exercises）",
        "看 Web Dev Simplified 的递归讲解视频（Assignment 第 2 条，视频不声称有中文字幕）",
        "看 5 Simple Steps for Solving Any Recursive Problem（Assignment 第 3 条）：解任何递归问题的五个简单步骤",
        "看 CS50 的递归视频（Assignment 第 4 条）",
        "读维基 Divide and conquer algorithm 条目的「Implementation Issues」节（Assignment 第 5 条）：递归局限面的总览——栈深度、内存代价都在这一节",
        "到官方 javascript-exercises 仓库的 computer_science/recursion/ 目录按序完成每个练习（Assignment 第 6 条）：动手前先读各练习的 README；需要的话回仓库主 README 复习 fork/clone/使用方法——官方 Tip：**用调试器**逐层看调用栈，别用肉眼硬追"
      ],
      "quiz": [
        {
          "question": "官方给递归下的定义是什么？D&C 范式里「拆到什么时候为止」？",
          "answer": "定义一句话：**递归就是函数调用自己的想法——仅此而已**。D&C（维基定义、官方引用）：递归地把问题拆成两个或更多**同类（或相关）的子问题**，**直到它们简单到可以直接解决**——这个「直接可解」的最小子问题就是触底点；然后把子问题的解**组合**起来得到原问题的解。整个过程以「整条链展开（unwinds）」收尾：触底后逐层返回、一路组合回顶层。"
        },
        {
          "question": "「任何能用递归解决的问题也能用迭代器解决」——官方想让你建立什么判断习惯？",
          "answer": "官方的自检信号：如果你发现自己在说「**为什么我刚才不就用个 while 循环？**」——那你大概真该用循环。判断习惯是：递归不是目的，是工具——你不会经常以递归方案收尾，但要培养出「什么时候递归**可能**是好主意」的手感（比如问题天然自我相似、拆子问题后结构不变：树、分治排序）。同时记住警告：有些问题会拆出太多块、彻底压垮内存——要有平衡。下一课的 Fibonacci 就是对照实验：迭代与递归各写一遍，手感自己长出来。"
        },
        {
          "question": "overview 里的「stack overflow」指什么？为什么它与递归问题相关？",
          "answer": "官方特意注明：**概念，不是那个问答网站**。每层递归调用都会在调用栈上占一帧（保存该层的参数与返回地址）——**递归深度**（叠了多少层）失控时，栈超出上限就是 stack overflow：程序直接崩溃。与递归相关是因为递归是栈深度增长最常见的原因：缺少触底条件（无限递归）或问题规模太大（对十万个元素逐层递归）都会撞上它。展开面由 Assignment 第 1 条 javascript.info 递归文与第 5 条维基 Implementation Issues 节承担。"
        },
        {
          "question": "官方 Tip 为什么强调「用调试器」？递归场景下调试器最值钱的面板是哪个？",
          "answer": "官方原话：逐层追踪递归函数里发生什么可能相当难——**别难为自己**。递归的每一层有独立的参数与局部状态，肉眼在脑子里维护「现在在第几层、这层的 n 是多少」非常痛苦；调试器的**调用栈（Call Stack）面板**把每一层列出来、点哪层看哪层的变量，断点配合单步（step into/out）能亲眼看「链展开」的过程——官方说没养成调试习惯的话「你错过了很多」，现在是补上的好时机。"
        },
        {
          "question": "Assignment 第 6 条的官方练习仓库要求怎么做？第 1 条的文末练习呢？",
          "answer": "第 6 条：到 The Odin Project 的 javascript-exercises 仓库 **computer_science/recursion/ 目录**，**按序完成每个练习**——每个练习动手前先读它自己的 README；需要时回仓库主 README 复习 fork、clone 与练习的一般说明（Fundamentals 阶段用过同款仓库）。第 1 条相反：javascript.info 递归文**文末的练习不必完成**（官方原话 You do *not* need to complete the exercises at the end of the article）——读文即可，动力量留给官方仓库。"
        }
      ],
      "optional": [
        "官方注明（Assignment 第 1 条）：javascript.info 递归入门文**文末的练习不必完成**——读文章本身即可。"
      ],
      "note": "本课官方正文没有代码块（维基引文是文字引用；examples 为空数组是结构事实）。lesson overview 六条中，正文只详写了「递归为何有用」「局限」「何时用循环」三条；「递归深度」「stack overflow 概念」「其与递归的关系」三条由 Assignment 第 1 条 javascript.info 递归文与第 5 条维基 Implementation Issues 节承担——本站如实按官方分工组织，未自行展开正文。Assignment 第 1 条官方注明文末练习不必完成（已录入 official.optional）。",
      "why": "递归是这一章的「第二把钥匙」：merge sort（下一课项目）、二叉搜索树的遍历与平衡（Project: Binary Search Trees）、深度优先搜索（Project: Knights Travails）全部建立在它之上——不会递归，后面四个项目寸步难行。它也是面试高频考点：斐波那契、阶乘、树遍历几乎都以递归形态出现，而 stack overflow 与「何时改用循环」的取舍是追问定番。更深一层，递归训练的是「相信拆解决」的思维：把问题拆到直接可解、相信每层只做自己的事——这种结构化拆解能力在你读任何大型代码库时都通用。官方把动手项目紧接在概念课后面，就是因为递归「不亲手试过不会真正记住」。",
      "sections": [
        {
          "h": "递归：函数调用自己，仅此而已",
          "p": [
            "官方给定义毫不拖泥带水：**递归就是函数调用自己的想法。仅此而已**（That is all there is to it）。",
            "用途紧随其后：它被用来**把一个大问题开始拆成越来越小的块**（「分而治之」），把子问题的解**持续喂回原函数**，直到得出某种答案、**整条链展开（the whole chain unwinds）**。",
            "画面感版本：递归下潜时每一层带着更小的子问题，触底后开始上浮，每一层把子解组合一点、再交回上一层——直到顶层拿到原问题的完整答案。「下潜-触底-上浮」这个节奏是后面所有递归代码的骨架。"
          ]
        },
        {
          "h": "分而治之：维基定义拆解",
          "p": [
            "官方引用了维基 Divide and Conquer Algorithms 条目的定义：**在计算机科学中，分而治之（D&C）是基于多分支递归的重要算法设计范式。分而治之算法通过递归地把问题拆成两个或更多同类（或相关）的子问题来工作，直到这些子问题简单到可以直接解决。子问题的解随后被组合起来，给出原问题的解。**",
            "三个关键词：**多分支**（一层可以拆出两个以上子问题——merge sort 一层拆两半）、**同类子问题**（子问题与原问题结构相同，所以同一个函数能接着处理——这就是「调用自己」合法的原因）、**简单到直接解决**（触底条件——没有它递归永不下停，直到 stack overflow）。",
            "最后一句「组合起来」同样关键：递归不是拆完就完了——上浮过程里每层要把子解**组合**成本层的解。下一课 merge sort 的「合并」步骤就是这个组合动作的具象化。"
          ]
        },
        {
          "h": "用对的和用错的：while 循环自检信号",
          "p": [
            "官方立刻泼清醒剂：递归**有用对的和用错的方式**。事实是：**任何你能用递归解决的问题，也能用你熟知且喜爱的迭代器解决**。",
            "自检信号（官方原话）：如果你发现自己在说「**为什么我刚才不就用个 while 循环这里？**」——那你大概真该用。",
            "预期校准：你**不会经常**以递归方案收尾，但你应当**培养出对何时递归可能是好主意的手感**（get a feel for when it might be a good idea）——本课与下一课的项目就是练手感的场地。",
            "还有内存警告：有些问题会**拆出太多太多的块、彻底压垮你计算机的内存**（totally overwhelm your computer's memory）——官方收尾一句：**要有平衡**（There's a balance）。overview 里的递归深度与 stack overflow 词条就是这条警告的技术展开（由 Assignment 资料承担）。"
          ]
        },
        {
          "h": "Assignment 导读：一文一仓是主线",
          "p": [
            "六条资料的分工：**① javascript.info 的 intro to recursion**——核心展开（递归深度、stack overflow 词条都在文中），官方注明**文末练习不必完成**；**② Web Dev Simplified 的递归讲解**、**③ 5 Simple Steps for Solving Any Recursive Problem**、**④ CS50 的递归视频**——三个视频视角互补（直觉 → 方法论 → 学院派）；**⑤ 维基 D&C 条目的「Implementation Issues」节**——递归的局限面总览；**⑥ 官方 javascript-exercises 仓库 computer_science/recursion/ 目录**——动手主线：按序完成每个练习、先读各自 README。",
            "官方 Tip「**用调试器！**」配第 ⑥ 条服用：逐层追踪递归相当难，**别难为自己**——调试器的调用栈面板把每层的参数与状态列得清清楚楚；官方还说，如果你一直没在用调试器解题，「你错过了很多」，现在正是熟悉它的好时机。",
            "完成节奏建议：①⑤ 读文建概念 → ②③④ 视频补直觉 → ⑥ 仓库动手（每做完一个练习，用调试器走一遍自己的递归链）——下一课 Project: Recursion 的 Fibonacci 与 merge sort 会直接验收这套手感。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "没有触底条件，递归永不下停",
          "text": "维基定义里「直到子问题简单到可以直接解决」就是触底条件的分量所在——缺了它（或条件永远够不着），每层调用继续叠帧，直到 stack overflow 崩溃。写递归先写触底分支，再写递归分支，是防这类事故的习惯顺序。"
        },
        {
          "title": "什么问题都想用递归秀一把",
          "text": "官方的自检信号：发现自己在说「为什么我刚才不就用个 while 循环」——那就用循环。线性遍历、累加、查找这类问题迭代版更直白也更省栈；递归的主场是天然自我相似的问题（树、分治排序）。要有平衡，不是每把锤子都该敲。"
        },
        {
          "title": "肉眼硬追递归链，不用调试器",
          "text": "官方 Tip 点名：逐层追踪递归相当难，别难为自己。每层有独立的参数与状态，脑子里模拟三层以上就开始出错——断点 + 调用栈面板 + 单步 step out，亲眼看「链展开」，比盯着代码空想快得多也准得多。"
        },
        {
          "title": "无视递归深度的内存代价",
          "text": "官方警告：有些问题会拆出太多块、彻底压垮计算机内存。对超大输入逐层递归（比如十万个元素）时，栈深与每层帧的内存都是实打实的开销——这正是维基 Implementation Issues 节讲局限的原因，也是「同问题迭代版有时更稳」的技术根据。"
        }
      ],
      "official": {
        "assignment": [
          "读这篇 javascript.info 的递归入门（intro to recursion）。你**不**需要完成文章末尾的练习。",
          "看 Web Dev Simplified 的这支递归讲解视频。",
          "看 5 Simple Steps for Solving Any Recursive Problem（解任何递归问题的 5 个简单步骤）。",
          "看 CS50 的这支递归视频（Video on Recursion）。",
          "读维基 Divide and conquer algorithm 条目的「Implementation Issues」节，总览递归的一些局限。",
          "到 The Odin Project 的 JavaScript 练习仓库的 computer_science/recursion/ 目录，按序完成其中的每个练习。完成前务必先读每个练习的 README。如有需要，回顾仓库的 README 复习 fork、clone 与使用练习的一般说明。官方 Tip：用调试器！逐层追踪递归函数里发生什么可能相当难——别难为自己！如果你还没养成解题时用调试器的习惯（没有的话你错过了很多），现在是熟悉它的好时机——它能让追踪代码流容易得多。"
        ],
        "exercise": [
          "官方练习仓库：TheOdinProject/javascript-exercises 的 computer_science/recursion/ 目录——按序完成每个练习，动手前先读各自 README（Assignment 第 6 条）。"
        ],
        "knowledgeCheck": [],
        "optional": [
          "官方注明（Assignment 第 1 条）：javascript.info 递归入门文的文末练习**不必完成**——读文章本身即可。"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/computer_science/recursive_methods.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "1d752f0d0523c33fa7afec86b52aea026a0228403ac8753f22de842c1d5193f3",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "javascript-recursion",
      "title": "Project: Recursion",
      "zh": "项目：递归",
      "group": 5,
      "url": "https://www.theodinproject.com/lessons/javascript-recursion",
      "summary": "递归概念的验收现场：官方开题「用你到目前为止学到的递归知识，攻克两个能发挥递归的经典问题——**Fibonacci 与 Merge Sort**」。第一题 Fibonacci：每个数是它前面两个数之和（0, 1, 1, 2, 3, 5, 8, 13 是前八项）——官方明说你应该已经在想「这或许用迭代就能解」，**你是对的**；但用递归生成这个序列是**更好理解递归的绝佳方式**。Assignment：用迭代写 fibs（接收数字、返回该长度的 Fibonacci 数组，输入 8 应返回 [0, 1, 1, 2, 3, 5, 8, 13]）；再用递归写 fibsRec 解同一问题；用各种长度测试两个版本。第二题 Merge Sort：计算机科学有相当大一块专门研究排序数据，用 D&C 递归的排序算法能把排序问题化小到更小的子问题——merge sort 递归处理未排序数组直到最小子集（**单个元素的数组视为已排序**），再把单元素按序合并回来（官方评价：Pretty clever!）。Assignment：写 mergeSort 函数（接收数组、用递归归并方法返回已排序数组），官方给了五组测试例（空数组、单元素、已排序、乱序含重复、随机四位）。Tips：想清楚 **base case** 是什么、什么行为在一遍遍重复且其实可以**委托给别人（比如同一个函数！）**。Test it out：在 fibsRec 开头加一句 console.log(\"This was printed recursively\")，用 8 调用——实现正确的话应看到它打印 **8 次左右**（7 次也可能，取决于实现方式，官方明说这不是 bug）。环境 Tip：本项目无 GUI 成分，应在**命令行**（node）而非浏览器里跑。",
      "guide": "以下是官方原课的中文化梳理（Project 课：本站不提供成品代码，examples 为空数组——官方正文的代码块只有 Test it out 的一句 console.log 与测试例列表，均按文字转述）。两个题目是一套对照实验：Fibonacci 让你亲手体会「迭代与递归都能解、但递归版是理解工具」——官方特意先让你写迭代版 fibs 再写递归版 fibsRec，顺序本身就是教学（先有可对照的正确答案，再练递归思维）；Merge Sort 则是 D&C 的正经应用——「拆到单元素（触底）→ 按序合并（组合上浮）」与上一课维基定义的每个词一一对应。动手前看环境 Tip：项目无 GUI，用 node 在命令行跑（官方给了 Node CLI 文档链接）——这是你第一次离开浏览器写纯逻辑项目，正好也逼你用上 debugging 课学的 Node 调试。Fibonacci 的 Test it out 是官方埋的「递归直觉检测器」：那句 console.log 打印的次数 = 函数真正被调用的次数，8 次左右或 7 次都正常（取决于你的实现把哪一步当作触底）——重点是亲眼看到「调用次数随输入增长」这件事。merge sort 的背景视频官方给了四组（CS50x 入门、CS50x 讲座片段「只看至 2:04:05」、两支正式讲解）加一个可选可视化工具——先看懂「拆与并」再动手，别硬憋。写 mergeSort 时官方 Tips 的两个问题当脚手架：base case 是什么（单元素或空数组）？什么行为在重复、可以委托给「同一个函数」（对两半分别排序）？",
      "understand": [
        "官方开题：用你到目前为止学到的递归知识，攻克**两个能发挥递归的经典问题**——Fibonacci 与 Merge Sort",
        "**Fibonacci 序列**（官方定义）：每个数是它**前面两个数之和**——例：0, 1, 1, 2, 3, 5, 8, 13 是序列的前八项",
        "官方的坦白：你应该已经在想这**或许能用迭代而非递归来解——你是对的**；尽管如此，**用递归生成该序列是更好理解递归的绝佳方式**（an excellent way to better understand recursion）",
        "fibs 任务（Assignment 原文）：用**迭代**写一个 fibs 函数——接收一个数字，返回包含 Fibonacci 序列中那么多个数的数组；示例输入 8 → 返回 [0, 1, 1, 2, 3, 5, 8, 13]",
        "fibsRec 任务：再写一个函数 fibsRec，用**递归**解决同一问题；然后**用各种长度作参数测试两个版本**",
        "Merge sort 背景（官方）：计算机科学有相当大的部分专门研究**排序数据**；用递归「分而治之」方法的算法能把排序问题化小到更小的子问题——merge sort 是这类排序算法之一，在合适的数据集上可以**比冒泡排序等其他算法快得多**",
        "Merge sort 原理（官方原话）：它**递归处理未排序数组，直到到达最小子集——单个元素**；当然，**单元素数组视为已排序**；然后 merge sort 把这些单项**按序合并回来**——官方评价：Pretty clever!",
        "mergeSort 任务：写一个 mergeSort 函数——接收一个数组、用**递归归并方法**返回已排序数组；官方五组测试例：空数组返回空；[73] 返回 [73]；[1,2,3,4,5] 原样返回；[3,2,1,13,8,5,0,1] 返回 [0,1,1,2,3,5,8,13]；[105,79,100,110] 返回 [79,100,105,110]",
        "官方 Tips：想清楚 **base case 是什么**、什么行为**一遍遍重复发生且其实可以委托给别人**（比如——同一个函数！）；不太理解时回头再看背景视频会有帮助",
        "Test it out（官方验收法）：在 Fibonacci 函数**开头**加一句 console.log(\"This was printed recursively\")；用 8 作参数调用；实现正确的话应看到这句话打印 **8 次左右**——官方注明：取决于实现方式**看到 7 次也正常，这不是 bug**，只取决于函数**实际**被重复了多少次",
        "环境 Tip（官方）：本项目**没有 GUI 成分**，应在**命令行**而非浏览器里运行——JavaScript 文件可以用 nodejs 附带的 node 命令直接从命令行运行（官方给了 Node CLI 文档链接）"
      ],
      "terms": [
        {
          "en": "Fibonacci sequence（斐波那契序列）",
          "zh": "每个数是前两个数之和的序列（0,1,1,2,3,5,8,13…）——递归教学的经典载体，官方明说迭代也能解、递归版是理解工具"
        },
        {
          "en": "Merge sort（归并排序）",
          "zh": "D&C 排序算法：递归拆到单元素（视为已排序），再按序合并回来——在合适数据集上比冒泡排序快得多"
        },
        {
          "en": "Base case（触底情形）",
          "zh": "递归停止的最小子问题——官方 Tips 的第一问：base case 是什么（merge sort 里是单元素/空数组）"
        },
        {
          "en": "Delegation（委托）",
          "zh": "官方 Tips 的第二问：什么行为在重复发生、可以委托给「别人」——比如同一个函数；把子问题交给下一层递归就是委托"
        },
        {
          "en": "Bubble sort（冒泡排序）",
          "zh": "官方拿来对照的慢算法——merge sort 在合适数据集上可以比它快得多；复杂度差距在 time-complexity 课会用记号说清"
        }
      ],
      "tasks": [
        "环境准备（官方 Tip）：本项目无 GUI——在命令行用 node 跑你的脚本（官方给了 Node CLI 文档；Fundamentals 的 command line 经验直接复用）",
        "看 Fibonacci 背景（官方资料）：Khan Academy 的递归 Fibonacci 视频——理解递归版怎么「下潜-上浮」（视频不声称有中文字幕）",
        "写 fibs（迭代版）：接收数字、返回该长度的 Fibonacci 数组——先用官方示例自检：输入 8 应返回 [0, 1, 1, 2, 3, 5, 8, 13]",
        "写 fibsRec（递归版）解同一问题：先答官方 Tips 两问——base case 是什么？什么行为可以委托给函数自己？然后用各种长度测试两个版本、比对输出一致",
        "做官方 Test it out：在 fibsRec 开头加一句 console.log(\"This was printed recursively\")，用 8 调用——应打印 8 次左右（7 次也不是 bug，取决于实现）；想想打印次数与你选的 base case 的关系",
        "看 merge sort 背景（官方资料四组）：CS50x 入门视频 → CS50x 讲座片段（官方注明只看至 2:04:05）→ 需要更正式的讲解再看 The concept of merging 与 Merge Sort -- How it Works 两支；可选：Merge Sort Visualizer 动手感受拆与并",
        "写 mergeSort：接收数组、用递归归并返回已排序数组——对着官方五组测试例逐一自检（空数组 / [73] / 已排序 / 乱序含重复 / 随机四位）",
        "把两个项目 push 上 GitHub（沿用既往项目的分享习惯）——官方在 Fibonacci 与 merge sort 两处都强调「动手试过才会真正记住」"
      ],
      "quiz": [
        {
          "question": "Fibonacci 明明迭代就能解（官方也承认），为什么还要求写递归版 fibsRec？",
          "answer": "官方原话：用递归生成该序列是**更好理解递归的绝佳方式**。教学意图有三层：① Fibonacci 的定义本身自我参照（第 n 项 = 前两项之和），递归版与定义同形——你能直观看到「代码长成问题的样子」；② 先写迭代版再写递归版，两版输出对照，递归的正确性立刻可验；③ Test it out 的 console.log 计数让你**亲眼看到调用次数**——为后面理解递归的代价（time-complexity 课会算 Fibonacci 朴素递归的指数级重复计算）埋下直觉。"
        },
        {
          "question": "merge sort 怎么体现 D&C 范式的三步（拆、触底、组合）？",
          "answer": "对照上一课维基定义：**拆**——递归把数组对半拆成子数组，子问题与原问题同类（都是「排序一个数组」）；**触底**——拆到最小子集即单个元素，官方原话「单元素数组视为已排序」，这就是 base case；**组合**——上浮过程把已排序的两半**按序合并**回来，每层合并一次，顶层得到的就是整个有序数组。「Pretty clever」的 clever 点在于：合并两个有序数组是简单的线性操作，复杂度全被拆解结构消化了——这正是它比冒泡排序快的来源。"
        },
        {
          "question": "官方 Tips 让你想清楚「base case」与「可委托给同一个函数的重复行为」——对 mergeSort 分别是什么？",
          "answer": "base case：数组长度为 0 或 1——直接返回它本身（空数组与单元素都天然有序，官方测试例前两组就是这个）。可委托的重复行为：「对**一半**数组排序」——与「对整个数组排序」是同类问题，委托给 mergeSort 自己递归处理左右两半；本层只负责拆（对半分）与并（合并两个有序半区）。写的时候每层只做这两件事，排序的脏活全在更深层——这就是「委托」的分工。"
        },
        {
          "question": "Test it out 里那句 console.log 打印 8 次左右——为什么 7 次也不是 bug？这个实验在测什么？",
          "answer": "官方原话：取决于你实现函数的方式，你可能看到 7 次而不是 8 次——**这不是 bug**，只取决于函数**实际**被重复了多少次。比如把 n≤1 当 base case 与把 n≤2 当 base case，调用次数就差一层。实验测的是「递归调用次数」的直觉：打印次数 = fibsRec 真正被调用的总次数——它随输入增长得**比线性快得多**（朴素递归 Fibonacci 每层拆两个子调用），这个「调用爆炸」的体感正是 time-complexity 课 O(2ⁿ) 的预告。"
        },
        {
          "question": "这个项目为什么要求在命令行用 node 跑，而不是浏览器？",
          "answer": "官方 Tip 原话：本项目**没有 GUI 成分**——纯逻辑函数（数组进、数组出），不需要 DOM；命令行用 node 直接跑 JS 文件即可（官方给了 Node CLI 文档）。这也是课程编排的深意：算法项目全部脱离浏览器，逼你把「逻辑层」与「呈现层」彻底分开——正是 more-testing 课 evaluateGuess 重构的极端版：没有 prompt/alert 可依赖，只剩纯函数。"
        }
      ],
      "optional": [
        "官方资料列表中标注 (Optional)：Merge Sort Visualizer（hackerearth）——动手玩一玩，更直观地感受 Merge Sort 进行时到底发生了什么。"
      ],
      "note": "Project 课（红线课）：examples 为空数组，本站正文只有官方要求中文化 + 解题思路脚手架，不提供任何成品代码——官方正文的代码块仅 Test it out 的一句 console.log 与 mergeSort 五组测试例，均按文字转述。Fibonacci 示例（输入 8 → [0, 1, 1, 2, 3, 5, 8, 13]）与五组 mergeSort 测试例按官方原文保留。CS50x 讲座片段官方注明「只看至 2:04:05」；Merge Sort Visualizer 官方标注 Optional（已录 official.optional）。环境 Tip 的 Node CLI 文档链接按资源清单口径核验。",
      "why": "这是递归从「概念」变「手感」的一课：Fibonacci 让你看见递归与问题定义同形的优雅（也看见它的调用爆炸——Test it out 的计数就是证据），merge sort 让你完整走一遍 D&C 的拆、触底、组合三步——后面二叉搜索树项目的 buildTree/rebalance、骑士之旅的图遍历，骨架都是这一套。两个题目也是面试的绝对高频：手写 Fibonacci 是递归入门定番，手写 merge sort 是「理解分治」的标准考题。顺带你还完成了两个第一次：第一次在命令行跑纯逻辑项目（离开浏览器的舒适区），第一次用「打印计数」实测算法行为（time-complexity 课的步数模型先在这里长出了直觉）。",
      "sections": [
        {
          "h": "两个经典问题：一套对照实验",
          "p": [
            "官方开题一句话：用你到目前为止学到的递归知识，攻克**两个能发挥递归的经典问题**——Fibonacci 与 Merge Sort。",
            "两题的分工是设计好的：**Fibonacci 是理解工具**——官方明说迭代可解（「你是对的」），递归版的价值在于让你看清递归怎么工作（定义自我参照的问题，递归代码与定义同形）；**Merge Sort 是正经应用**——排序是计算机科学的大课题，D&C 递归是它的标准解法之一。",
            "先做哪个官方已排好序：先 Fibonacci（热身 + 建立直觉），「对用递归解决 Fibonacci 有了牢固把握后」（官方原话），再开新文件做 merge sort。"
          ]
        },
        {
          "h": "Fibonacci：迭代与递归各写一遍",
          "p": [
            "序列定义（官方）：每个数是它**前面两个数之和**——0, 1, 1, 2, 3, 5, 8, 13 是前八项（官方给了维基链接）。",
            "Assignment 三步：**① 用迭代写 fibs**——接收一个数字、返回含那么多个 Fibonacci 数的数组，官方示例：输入 8 应返回 [0, 1, 1, 2, 3, 5, 8, 13]；**② 用递归写 fibsRec** 解同一问题；**③ 用各种长度作参数测试两个版本**——两版输出应完全一致，迭代版就是递归版的对照答案。",
            "官方还配了理解资料：Khan Academy 的递归 Fibonacci 视频——「想进一步理解的话看它」。",
            "**Test it out**（官方验收法）：在函数**开头**加一句 console.log(\"This was printed recursively\")，用 8 作参数调用——实现正确的话应看到它打印 **8 次左右**；官方特意注明：取决于实现方式，**看到 7 次而不是 8 次也正常，这不是 bug**——只取决于函数实际被重复了多少次。"
          ]
        },
        {
          "h": "Merge sort：拆到底，再按序并回来",
          "p": [
            "官方背景：计算机科学有相当大一块专门研究**排序数据**；用递归「分而治之」的算法能把排序问题化小到更小的子问题——**merge sort 是这样的排序算法之一，在合适的数据集上可以比冒泡排序等其他算法快得多**。",
            "原理（官方原话）：merge sort **递归处理未排序数组，直到到达它的最小子集——单个元素**；当然，**单元素数组视为已排序**；merge sort 随后把这些单项**按序合并回来**。官方评价：Pretty clever!",
            "Assignment：写 **mergeSort** 函数——接收数组、用递归归并方法返回已排序数组。官方五组测试例（文字转述）：空数组返回空数组；[73] 返回 [73]；[1,2,3,4,5] 原样返回；[3,2,1,13,8,5,0,1] 返回 [0,1,1,2,3,5,8,13]；[105,79,100,110] 返回 [79,100,105,110]。",
            "官方 Tips 当脚手架：**想清楚 base case 是什么**、什么行为**一遍遍重复发生且其实可以委托给别人（比如——同一个函数！）**；不太理解该发生什么时，回头再看背景视频会有帮助。"
          ]
        },
        {
          "h": "运行环境：命令行，不是浏览器",
          "p": [
            "官方 Tip（原话大意）：你需要一种运行本项目脚本的办法——因为**没有 GUI 成分**，它应该在**命令行**运行而非浏览器。JavaScript 文件可以用 nodejs 安装的 **node** 命令直接从命令行运行（官方给了 Node CLI 文档链接讲常见用法）。",
            "实操就是：node 你的文件名——console.log 的输出直接打在终端里（Test it out 的计数就在终端看）。",
            "这也是课程编排的深意：从这一课起的算法项目全部脱离浏览器——逻辑与呈现彻底分家，正是 more-testing 课「把副作用挤到边缘」的极端形态：这里连边缘都没有，只剩纯函数。"
          ]
        },
        {
          "h": "背景资料导读：先看拆与并，再动手",
          "p": [
            "官方给 merge sort 配了四组资料：**① CS50x 的 merge sort 入门视频**；**② CS50x 讲座里讲 merge sort 工作原理的片段**——官方注明**只看至 2:04:05**；**③ 两支更正式的讲解**（The concept of merging 与 Merge Sort -- How it Works）——「还不清楚的话」再看；**④ 可选：Merge Sort Visualizer**（hackerearth）——动手玩，直观感受 Merge Sort 进行时发生了什么。",
            "Fibonacci 另有一支：Khan Academy 的递归 Fibonacci 视频。",
            "建议路径：① 建直觉 → 动手写 → 卡住再上 ②③ → ④ 可视化工具验证你对「拆与并」的想象是否与实际一致。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "fibsRec 没有 base case 或 base case 够不着",
          "text": "Fibonacci 递归要同时处理「再拆」与「触底」：n 为 0/1（或 1/2，取决于你的序列起点）必须直接返回，否则调用永远下潜。Test it out 的打印次数异常（远超 8 次或直接栈溢出）就是 base case 出问题的信号。"
        },
        {
          "title": "看到打印 7 次以为实现错了，反复改代码",
          "text": "官方明文：取决于实现方式，7 次而不是 8 次**不是 bug**——只取决于函数实际被重复了多少次（base case 选在哪一层）。与其凑次数，不如想清楚每次打印对应哪一层调用——这正是这个实验要教的。"
        },
        {
          "title": "mergeSort 里「合并」步骤没保持有序",
          "text": "拆得对不等于并得对：合并两个已排序半区时必须逐个比较两端头元素、小的先进结果——图省事 concat 再 sort 等于没用上 D&C（也失去 merge sort 的性能意义）。官方五组测试例里乱序含重复的 [3,2,1,13,8,5,0,1] 专门抓这类错。"
        },
        {
          "title": "在浏览器里开 index.html 跑算法项目",
          "text": "官方 Tip：本项目无 GUI 成分，应在命令行运行——node 文件名即可。搬进浏览器不仅多此一举，还会诱使你把逻辑与 DOM 搅在一起；算法项目保持纯函数 + 终端输出，测试与调试都最干净。"
        }
      ],
      "official": {
        "assignment": [
          "Fibonacci——首先创建一个文件，攻克斐波那契序列：① 用迭代写一个 fibs 函数：接收一个数字，返回包含 Fibonacci 序列中那么多个数的数组——示例输入 8，函数应返回数组 [0, 1, 1, 2, 3, 5, 8, 13]；② 现在写另一个函数 fibsRec，用递归解决同一问题；③ 用各种长度作参数测试两个版本的函数。",
          "（官方衔接语）希望你已经能用递归解决这个问题！如果需要帮助理解这个函数里发生的事，下面的「Test it out」一节会帮你。对用递归解决 Fibonacci 有了牢固把握后，创建一个新文件来做 merge sort：写一个 mergeSort 函数——接收一个数组，用递归归并方法返回已排序数组。",
          "官方测试例（文字转述）：mergeSort 空数组应返回空数组；mergeSort([73]) 应返回 [73]；mergeSort([1,2,3,4,5]) 应原样返回 [1,2,3,4,5]；mergeSort([3,2,1,13,8,5,0,1]) 应返回 [0,1,1,2,3,5,8,13]；mergeSort([105,79,100,110]) 应返回 [79,100,105,110]。",
          "官方 Tips：想清楚 base case 是什么、什么行为在一遍遍重复发生且其实可以委托给别人（比如——同一个函数！）；如果不太理解应该发生什么，回头再看背景视频会有帮助。",
          "Test it out（官方验收法）：为展示你的 Fibonacci 函数里实现的递归效果——① 在函数开头加上 console.log(\"This was printed recursively\")；② 用 8 作参数调用函数；③ 如果函数实现正确，你应看到那句话打印 8 次左右（记住：取决于你实现函数的方式，你可能看到 7 次而不是 8 次。这不是 bug！只取决于函数实际被重复了多少次）。",
          "官方环境 Tip：本项目没有 GUI 成分，应在命令行而非浏览器里运行——JavaScript 文件可以用 nodejs 安装的 node 命令直接从命令行运行（官方附 Node CLI 文档链接）。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "官方资料列表中标注 (Optional)：玩一玩 Merge Sort Visualizer（hackerearth 可视化页面），更直观地感受 Merge Sort 进行时到底发生了什么。"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/computer_science/project_recursion.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "92dd4a37195a6e1b203eb8f73fb254ad11d72279927933a072814176597dce27",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "javascript-time-complexity",
      "title": "Time Complexity",
      "zh": "时间复杂度",
      "group": 5,
      "url": "https://www.theodinproject.com/lessons/javascript-time-complexity",
      "summary": "本章最长的一课（官方原文约 21KB），把「代码效率」从零讲到能比较算法。开篇定位：你已经从「写出能跑的代码」进到考虑可读性与可维护性——但还有同样重要的第三个考量：**效率**。度量效率的两种方式：时间复杂度与空间复杂度，本课讲时间。核心方法论是**步数模型**：永远不用执行时长度量算法效率（同一程序两次运行、换台机器都不同）——而是数它完成需要多少「步」；官方用 oddNumbersLessThanTen 完整数出 34 步，再引出关键转折：改成接收参数 maxNumber 后，步数**随输入变化**——不存在具体数字，真正要度量的是「**数据变化时步数如何变化**」（能不能 scale）。工具是**渐近记号**：Big O（上界/最坏情形）、Omega（下界/最好情形）、Theta（上下界之间/平均）——Big O 最常用，因为你必须确保最坏情形可扩展。正文逐个讲八种常见复杂度（快→慢）：O(1) 常数（数组按索引取值；顺带讲「Big O 丢弃偶然常数」）、O(log N) 对数（数据翻倍步数 +1；二分查找完整推演 + 翻倍表）、O(N) 线性（迭代数组）、O(N log N)（对半拆 + 每半 O(N) 处理；merge sort 正是；也提 Cartesian tree 特例）、O(n²) 平方（双层循环；3→9、4→16、10→100 的增长表）、O(n³) 立方（三层循环；10→1000、100→一百万 Ouch!）、O(2ⁿ) 指数（每加一项步数翻倍；10→1024 表）、O(N!) 阶乘（排列组合；10! = 3,628,800）。再讲 Omega（findValue 最好情形 O(1)，但「不认为有用」——目标很少恰在第一个）与 Theta（遍历数组最好=最坏=O(N)）。收尾两个高频问题：**为什么用 Big O**（最坏情形保证在所有结果下可扩展——输入从 10 变一百万时代码不能锁死）；**同复杂度是否一样好**（+1 与 +2 步长两版 oddNumbers 都是 O(N)——Big O 不管常数；但 O(10N) 与 O(n²) 的对照表说明常数在小输入时真的有用——「确保你的代码在其时间复杂度内尽可能高效」）。Assignment 三条：Doable Danny 的 Big O 图解文、Big-O cheat sheet、sahinarslan 的分步分析指南（末尾空间复杂度节可先跳过——下一课就是它）。",
      "guide": "以下是官方原课的中文化梳理。这一课信息密度大，建议按官方的四段结构消化：① 步数模型（为什么不用秒表、34 步怎么数出来、为什么具体数字没用）；② 渐近记号三兄弟与 Big O 的定义（「不是一个能把算法放进去就出结果的工具」——要自己数步数变化再贴记号）；③ 八个复杂度逐个过——重点不是背表，是每个记号配的那个「怎么长」的画面：O(log N) 的翻倍表、O(n²) 的 3→9→16→100、O(2ⁿ) 的 10→1024；④ 两个收尾问题（为什么 Big O、同复杂度怎么比）。例子代码全部收录在示例区（官方原码），其中 oddNumbers 两个版本（+1 与 +2 步长）是「同复杂度不等效」讨论的主角，findValue 是 Omega 的例子。与前后课的钩子：O(N log N) 一节官方点名 merge sort「来自我们上一课 :)」——递归项目的成果在这里获得记号身份；Test it out 里数过的调用次数是 O(2ⁿ) 的直觉前身；Assignment 第 2 条 Big-O cheat sheet 会在下一课空间复杂度里再次出现（官方预告「那时你会有更深的欣赏」）。学完的自检标准：给你一段嵌套循环代码，你能说出它的 Big O 并解释「数据翻倍时步数怎么变」。",
      "understand": [
        "官方定位：可读性与可维护性之外，写代码还有**同样重要的第三个考量——效率**；你需要理解你写的代码会怎么表现、你的选择怎么影响性能，才能**为需求选对数据结构与算法**",
        "度量效率的两种方式（官方）：**时间复杂度**与**空间复杂度**——本课讲时间",
        "第一原则（官方原话）：**永远不要用执行花多久来度量算法的效率**——同一程序重跑可能更快或更慢（取决于电脑在忙什么），换台机器又不同",
        "正确的度量（官方）：评估完成需要多少**「步」（steps）**——一个算法 5 步、另一个 20 步完成同一任务，那么在同一台电脑上 5 步的**总是**更快",
        "官方数步示范：oddNumbersLessThanTen——赋值 1 步 + 每轮循环 3 步（比较/判奇/自增）× 9 轮 = 27 + 输出一半轮次 5 步 + 初始赋值 1 + 退出比较 1 = **34 步**",
        "关键转折：改成 oddNumbers(maxNumber) 后步数**随外部输入变化**——不存在可用的具体数字；真正要度量的是「**数据变化时算法步数如何变化**」——这回答「代码能不能 scale」",
        "**渐近记号（Asymptotic Notations）**三种（官方）：**Big O** = 上界 = **最坏情形**；**Omega** = 下界 = **最好情形**；**Theta** = 兼有上下界 = **平均情形**——Big O 最常被引用，因为你必须确保任何代码的最坏情形随输入增长仍可扩展",
        "Big O 是什么（官方）：一种**一致地**度量算法效率的方法——给出「输入增长时运行时间如何变化」的度量，让你能**直接比较两个算法**选最好的；它**不是一段能把算法放进去就告诉你效率的代码**——你要自己度量步数随数据怎么变，再给它贴记号",
        "八种常见 Big O（官方排序，快→慢）：**O(1)** 常数 / **O(log N)** 对数 / **O(N)** 线性 / **O(N log N)** / **O(n²)** 平方 / **O(n³)** 立方 / **O(2ⁿ)** 指数 / **O(N!)** 阶乘",
        "O(1) 的 gotcha（官方）：技术上不止一步（找数组内存位置 + 跳到索引）——但这些是**偶然（incidental）常数**：一万个元素与两个元素步数相同，不随数据规模变化，所以 Big O **丢弃常数**——它只关心「相对输入规模，复杂度怎么长」",
        "O(log N) 的画面（官方）：**数据翻倍，步数只 +1**——5,000 → 10,000 个元素只多一步，scale 得非常好；代表算法**二分查找**（只对已排序数组有效）：每步用 middleIndex = Math.floor((startIndex + endIndex) / 2) 砍掉一半；官方翻倍表：Size 1/2/4/8/16/32 → Steps 1/2/3/4/5/6",
        "O(N) 的画面：**元素数与步数同速增长**——每次迭代数组就是线性复杂度；O(N log N)：通常是 O(log N) 的对半拆 + 每一半再被 O(N) 的算法处理——**merge sort 正是**（官方：来自我们上一课 :)）；也有 Cartesian tree 这类天生 O(N log N) 的特例——嵌套复合不是唯一来源",
        "O(n²)/O(n³) 的画面（官方数字）：双层循环——3 项 9 子步、4 项 16、10 项 100（4 倍工作量）；三层循环——10 项 1000（8 倍）、100 项一百万（官方：Ouch!）；O(2ⁿ)：**每加一项数据，步数翻倍**——官方表 1→2、5→32、10→1024，「尽可能避开」；O(N!)：排列组合问题——3!=6、4!=24、10!=**3,628,800**，小数据尚可、每加一项跳跃巨大",
        "Omega 例子（官方 findValue）：最坏情形（目标不在数组或恰在末尾）O(N)；最好情形（目标是第一个）一步、O(1)——这就是它的 Omega；官方评价值得注意：Omega **不被认为那么有用**——目标很少恰好是数据结构里的第一个，它给不出「算法会怎么 scale」的信息",
        "Theta（官方）：给出精确值或窄上下界之间的有用范围——比如「遍历数组每一项」的循环，最好与最坏都是 O(N)，Theta 就是 O(N)；官方注明不深入：Big O 是通用的主要记号",
        "**为什么用 Big O**（官方）：用最坏情形能确保算法在**所有结果**下可扩展——可能常数时间也可能线性时间的算法，它的可扩展性由最坏情形决定；你需要有信心：输入突然从 10 个变成一百万个时，代码不会锁死、不让用户抓狂",
        "**同复杂度 ≠ 一样好**（官方）：oddNumbers 每轮 +1 与每轮 +2 两个版本都是 O(N)——后者步数约一半（O(N/2)），但 Big O **不管常数**（不然比较 O(N/2 + 5N) 与 O(N + 5/2N) 既不有趣也不容易）；两者随输入增长**同速 scale**",
        "常数的另一面（官方对照表）：N=1 时 O(10N)=10 > O(n²)=1；N=100 时 1,000 < 10,000（10 倍差）；N=10000 时 100,000 < 100,000,000（1000 倍差）——**实践上小输入时 n² 算法可能比带大常数的 N 算法更快**；官方收尾指令：**确保你写的代码在其时间复杂度内尽可能高效**"
      ],
      "terms": [
        {
          "en": "Time complexity（时间复杂度）",
          "zh": "算法运行时间随输入规模变化的度量——与空间复杂度并列的两种效率度量之一"
        },
        {
          "en": "Big O notation（大 O 记号）",
          "zh": "描述最坏情形（上界）的渐近记号——最常用，因为你必须确保最坏情形可扩展；丢弃常数、只看增长趋势"
        },
        {
          "en": "Asymptotic notation（渐近记号）",
          "zh": "描述运行时间的记号家族：Big O（上界/最坏）、Omega（下界/最好）、Theta（上下界/平均）"
        },
        {
          "en": "Omega notation（Ω）",
          "zh": "最好情形——官方认为不那么有用：目标很少恰在第一位，给不出 scale 信息"
        },
        {
          "en": "Theta notation（Θ）",
          "zh": "窄上下界之间的精确值或有用范围——遍历数组的循环最好=最坏=O(N)，Theta 即 O(N)"
        },
        {
          "en": "Steps（步数）",
          "zh": "度量效率的基本单位：赋值、比较、输出各算一步——不看墙上时钟，数步数；步数随输入的变化趋势才是 Big O 的对象"
        },
        {
          "en": "Constant dropping（丢弃常数）",
          "zh": "Big O 忽略不随数据规模变化的常数（O(N/2) 与 O(10N) 都记 O(N)）——但实践上小输入时常数仍有意义"
        },
        {
          "en": "Binary search（二分查找）",
          "zh": "O(log N) 的代表算法：只对已排序数组有效，每步砍掉一半——数据翻倍步数只 +1"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：重点吃透「步数模型 → 记号」的推导链（34 步为什么没用、Big O 度量的是什么）",
        "读 Doable Danny 的 Big O Notation in JavaScript（Assignment 第 1 条）：常见复杂度配图表与示例——把官方八个记号的「画面」再刷一遍",
        "收藏并通读 Big-O cheat sheet（Assignment 第 2 条，官方评价 amazing resource）：复杂度对照曲线 + 常见数据结构操作与排序算法的时间复杂度——下一课官方还会让你回来看它",
        "读 Step-by-step Big O Complexity Analysis Guide, using JavaScript（Assignment 第 3 条）：分步分析指南——官方注明末尾的 Space Complexity 节可以先跳过（下一课正讲它）",
        "自检练习：回头给 Project: Recursion 的 fibs（迭代版）与 fibsRec（朴素递归版）各标一个 Big O——再对照 cheat sheet 想想为什么官方说朴素递归 Fibonacci 要小心",
        "自检练习 2：翻出你做过的 Todo List 或 Library 项目，找一处嵌套循环（比如按标题查重），说出它的复杂度与「数据翻倍时步数怎么变」"
      ],
      "quiz": [
        {
          "question": "为什么永远不能用「执行花了多久」度量算法效率？官方的替代方案是什么？",
          "answer": "因为时长不稳定：同一程序重跑一次可能更快也可能更慢（取决于电脑当时在忙什么），换台机器结果又不同——时长混入了太多与算法无关的因素。官方替代方案：**数「步」**——评估完成需要多少步（赋值、比较、输出各算一步）；5 步的算法在同一台电脑上总是快过 20 步的。再进一步：具体步数也会随输入变（oddNumbers(maxNumber) 没有固定步数），所以最终度量的是**步数随数据规模变化的趋势**——这就是 Big O 的对象。"
        },
        {
          "question": "官方 oddNumbersLessThanTen 的 34 步是怎么数出来的？为什么这个精确数字「对比较算法没实际帮助」？",
          "answer": "官方分解：初始赋值 1 步；每轮循环 3 步（比较 currentNumber<10、判奇偶、自增）× 9 轮 = 27；输出一半轮次发生 ≈5 步；退出前最后一次比较 1 步——合计 27+5+1+1 = 34。没用的原因：把硬编码 10 换成参数 maxNumber 后，步数**随外部输入变化**——不存在能拿来比较的具体数字。真正该问的是「数据变化时步数**如何**变化」：这个算法是线性的（数据翻倍步数约翻倍），O(N)——精确到 34 反而遮蔽了增长趋势。"
        },
        {
          "question": "O(log N) 为什么被认为「相当高效」？二分查找怎么体现它？",
          "answer": "高效在增长形状：**数据翻倍，步数只 +1**——官方例子：5,000 到 10,000 个元素只多一步；官方表更直观：Size 1→1 步、2→2、4→3、8→4、16→5、32→6。二分查找的体现：只对**已排序**数组有效，每步算 middleIndex = Math.floor((startIndex+endIndex)/2)，比较后**砍掉一半**（找 7：中位 5，7>5，左半全灭；再中位 8，7<8，右半全灭……）——直到剩一个元素比对。每步消灭一半，正是「翻倍只加一步」的机制来源。"
        },
        {
          "question": "为什么 Big O（最坏情形）是主要记号，而 Omega「不被认为那么有用」？",
          "answer": "官方理由：用**最坏情形**能确保算法在**所有结果**下可扩展——一个可能常数时间、最坏线性的算法，输入从 10 涨到一百万时不能锁死、不能让用户抓狂，可扩展性必须由最坏情形背书。Omega（最好情形）没用是因为它太乐观：官方 findValue 例子里最好情形是「目标恰为数组第一个」一步命中 O(1)——但目标很少恰好排在第一位，最好情形给不出「算法会怎么 scale」的任何信息。Theta 居中（精确值或窄范围），但官方注明不深入——Big O 是通用的主要记号。"
        },
        {
          "question": "两版 oddNumbers（每轮 +1 与每轮 +2）都是 O(N)——Big O 为什么不管那个「一半」的差距？官方对照表又补充了什么？",
          "answer": "+2 版步数约是 +1 版的一半，记作 O(N/2)——但 Big O **丢弃常数**：常数不随输入规模变化，不反映「怎么 scale」，而且留着它们比较会既无趣又困难（官方例子：O(N/2+5N) 对 O(N+5/2N)）。两版随输入增长同速，所以同记 O(N)。补充在对照表：N=1 时 O(10N)=10 而 O(n²)=1；N=100 时 1,000 对 10,000；N=10000 时 100,000 对 100,000,000——**常数最终变得无关紧要，但小输入时带大常数的线性算法可能真比平方算法慢**（前两行）；实践上小数据集 n² 有时更快。官方收尾指令因此是双层的：选对复杂度等级，且**在你的复杂度等级内把代码写得尽可能高效**。"
        }
      ],
      "optional": [],
      "note": "本课是「一点计算机科学」章最长的一课（官方原文约 21KB）——八个复杂度、翻倍表、对照表均按官方原文如实转述，例子代码五段收进示例区（官方原码）。O(N log N) 一节官方点名 merge sort「来自我们上一课 :)」——回指 Project: Recursion。official 的八种记号写法保留官方原文形态（含 O(n²)/O(2ⁿ) 的小写 n 变体——官方原文即如此混排，本站如实保留不另作统一）。Assignment 第 3 条官方注明末尾 Space Complexity 节可先跳过（下一课正是空间复杂度）。Cartesian tree 特例官方给了 geeksforgeeks 链接、注明「敏锐的你可以偷看一眼」。",
      "why": "这一课给你一副看代码的新眼镜：从此每写一个循环，你都会下意识问「数据翻倍，步数怎么变」。它的直接受益者是后面每一个项目——链表的方法复杂度、HashMap 的 O(1) 平均与 O(n) 最坏、二叉搜索树的 O(log n) 插入删除，全用这套语言描述；Big-O cheat sheet 会成为你常开的标签页。求职层面它更是硬通货：算法面试的追问定番就是「你这个解法的时间复杂度是多少、能不能更好」。官方把它排在递归项目之后也有深意——你已经亲手写过 O(N) 的迭代 fibs、调用爆炸的朴素 fibsRec 和 O(N log N) 的 merge sort，记号落地时有实物可对。效率意识一旦建立就退不回去：它是「能跑的代码」与「专业的代码」之间最可度量的那条线。",
      "sections": [
        {
          "h": "为什么需要度量效率",
          "p": [
            "官方开篇盘点你的现状：到此你已经写了很多代码，希望你已经从「只求代码能跑」进阶到考虑**可读性与可维护性**——也许会花时间想怎么创建必要的抽象，让代码在需求增长时仍然好打交道。",
            "可读性与可维护性超级重要（官方：毕竟你读代码的时间很可能不少于写代码的时间）——**然而**，写代码时还有另一个可以同样重要的考量：**效率（Efficiency）**。",
            "官方把话说透：你需要理解你写的代码会**怎么表现**；还需要理解你的**选择**怎么影响性能——这样才能**为你的需求选对数据结构与算法**。编程中度量代码效率有两种方式：**时间复杂度**或**空间复杂度**——本课引入时间效率度量的核心概念（空间是下一课）。"
          ]
        },
        {
          "h": "步数模型：别用秒表，数步子",
          "p": [
            "官方先立反面规则：打印 1 到 10 之间奇数的小程序跑起来不到一秒——但重跑一次可能同速、可能更快或更慢（取决于你的电脑在忙什么）；换台电脑又不同。所以：**永远不要用执行花多久来度量算法的效率**。",
            "正确做法：评估完成需要多少**「步」**——如果你知道一个算法要 5 步、另一个要 20 步完成同一任务，那么在同一台电脑上，5 步的**总是**跑得更快。",
            "官方示范数步（oddNumbersLessThanTen，原码见示例区）：赋值 1 步；每轮循环做四件事——比较 currentNumber 是否小于 10（1 步）、判奇（1 步）、奇数则输出（每 2 轮 1 步）、自增（1 步）；退出前还要最后比较一次。合计：每轮 3 步 × 9 轮 = 27，输出约 5 步，初始赋值 1 步，退出比较 1 步——**27 + 5 + 1 + 1 = 34 步**。",
            "然后是转折：把硬编码的 10 换成参数 maxNumber（原码见示例区）——步数还数得出来吗？官方自答：**it depends**。输入 10 是 34 步，换个数字步数就变——**不存在能用来度量效率的具体数字**。所以真正要度量的是：**当数据变化时，算法的步数如何变化**——这帮我们回答「我们写的代码能不能 scale」。要回答它，得进入新概念：**渐近记号**，特别是 Big O。"
          ]
        },
        {
          "h": "渐近记号：Big O、Omega、Theta",
          "p": [
            "渐近记号用来**描述算法的运行时间**。因为运行时间随输入不同而不同，有好几种记号从不同角度度量它。官方给了最常见的三种：**Big O**——表示算法的**上界**，即表现的最坏情形；**Omega**——表示**下界**，即最好情形；**Theta**——同时表示上下界，因而分析**平均**情形复杂度。",
            "**Big O 是你最常见到的那个**——原因官方一句话：你需要确保你写的任何代码的**最坏情形**在应用输入增长时是可扩展的。",
            "官方补充：下面给 Big O 的记号同样适用于 Omega 与 Theta——差别只在「从哪个角度看效率、该用哪个记号」。",
            "Big O 的定义段值得细读：它给我们一种**一致的**度量算法效率的方法——给出「算法运行时间随输入增长如何变化」的度量，让你能**直接比较两个算法的性能、挑最好的那个**。官方特意泼冷水：**Big O 不是一段你能把算法放进去、它就告诉你效率的代码**——你需要自己度量步数随数据怎么变，据此给它贴上一个 Big O 记号，再与其他算法比较。很多情况下你在用交互方式众所周知的数据结构，那时更容易判断它随输入怎么 scale。"
          ]
        },
        {
          "h": "八个常见复杂度逐一过",
          "p": [
            "官方按速度从快到慢排出八种最常见记号：**O(1)** 常数、**O(log N)** 对数、**O(N)** 线性、**O(N log N)**、**O(n²)** 平方、**O(n³)** 立方、**O(2ⁿ)** 指数、**O(N!)** 阶乘——下面逐个给官方画面。",
            "**O(1)**：数组按索引取值——arr[2] 一步拿到 3；数组翻倍成 10 个元素，arr[7] 还是**一步**。数组一直长、永远一步取到任何元素——常数，这就是 O(1)；官方评：一步查到东西，是时间复杂度的天花板。gotcha：技术上计算机要先找数组在内存的位置、再从首元素跳到索引——至少几步，写成 O(1+2(steps)) 也不算错；但那 2 步纯属**偶然**：一万个元素与两个元素步数相同。Big O 不关心这些偶然数字——它们不随数据规模变化，**被丢弃**。Big O 只想告诉我们：相对输入规模，算法复杂度怎么长。（步数真的不要紧吗？要——官方说后面会碰到，即「同复杂度」一节。）",
            "**O(log N)**：**数据翻倍，步数 +1**——5,000 到 10,000 个元素只多一步，scale 得非常好。代表是**二分查找**：只对已排序数组有效。官方完整推演（10 元素数组找 7）：middleIndex = Math.floor((startIndex + endIndex) / 2)——初始 0 与 9，中位索引 4、值 5；数组有序且 7>5，**一步砍掉 5 及其左边全部**；新中位索引 7、值 8，7<8，砍掉 8 及其右边；重复直到只剩一个元素——匹配则找到，否则不在数组里。官方翻倍表：Size 1/2/4/8/16/32 对应 Steps 1/2/3/4/5/6——官方评：Pretty impressive eh!",
            "**O(N)**：最好理解的一个——**元素数增长，步数以完全相同的速率增长**。每次迭代数组都是线性复杂度的例子：5 个元素 5 步、10 个元素 10 步。见到 O(N)，就知道步数与数据结构里的元素数同步涨。",
            "**O(N log N)**：名字起得名副其实（官方玩笑）——通常意味着算法先是 O(log N) 的（像二分查找那样反复对半拆），但**每一半又被另一个 O(N) 的算法处理**。官方点名：**merge sort 正是**——「来自我们上一课 :)」。但并非所有 O(N log N) 都这样构造：官方举 Cartesian tree 特例（geeksforgeeks 链接，「敏锐的你可以偷看它怎么工作」）——算法天生就是 O(N log N)、内部没有 O(N) 或 O(log N) 的小部件；可见嵌套复合常见，但不是达到某个复杂度的唯一方式。",
            "**O(n²)**：你多半在编程之旅里写过它——常见于**循环里再循环**同一数据集。官方数字：3 个元素 3²=9 子步；加 1 个变 4²=16（几乎翻倍）；5 个 25；翻到 10 个，25 → 100——**4 倍工作量**。官方：希望你能看到我们要去哪儿……",
            "**O(n³)**：想想三层嵌套循环吧（官方原话 Think triple nested loops baby）。n 个元素的数组加 1 项，外层、中层、最内层各多一轮——共 n³ 子步：3 项 27；4 项 64（翻倍还多）；5 项 125；10 项 1000——**8 倍**；100 项要 **1,000,000** 子步。官方：Ouch!",
            "**O(2ⁿ)**：每往数据里**加一项，步数翻倍**。官方表：Size 1→2 步、2→4、3→8、5→32、10→**1024**——失控速度可见一斑。官方指令：**尽可能避开**，否则你处理不了多少数据就得等很久。（直觉回连：Project: Recursion 的 Test it out 里，朴素递归 Fibonacci 的调用次数就是这么长的。）",
            "**O(N!)**：阶乘 = 1 到该数所有数的乘积（4! = 4×3×2×1）。官方：凡是要算**排列或组合**就会碰到它——比如算出一个数组能做出的所有组合。小数量尚可管理，但每加一项的跳跃巨大：3!=6、4!=24、10!=**3,628,800**——官方：你能看到事情多快失控。"
          ]
        },
        {
          "h": "Omega 与 Theta：最好情形与精确值",
          "p": [
            "如果 Big O 给的是最坏情形，还有什么替代？官方先讲 **Big Ω（Omega）**：算法的**最好情形**。例子 findValue（原码见示例区）：循环找值 1——**最坏情形**（Big O）是目标不在数组里或恰是最后一个：必须迭代每个元素，**O(N)**，输入翻倍迭代翻倍；**最好情形**是目标恰为**第一个**元素：一步命中——复杂度 O(1)，这就是它的 Omega。",
            "官方对 Omega 的评价要记住：**它不被认为那么有用**——我们的目标不太可能经常是数据结构里的第一个，所以它给不出算法会怎么 scale 的任何信息。",
            "**Big-Θ（Theta）**：Omega 测最好、Big O 测最坏，Theta 则给出**精确值、或窄上下界之间的有用范围**。官方例子：循环遍历数组每一项的代码——数组多大都无所谓，最好与最坏情形都跑 O(N)：所有情形的精确表现都是 O(N)，这就是它的 Theta。其他算法的 Theta 可能代表不同复杂度上下界之间的范围——官方注明不深入：**Big O 是通用算法时间复杂度的主要记号**，本节只是让话题可接近的简化解释，数学向的读者自行搜索有更详细的版本。",
            "**为什么选 Big O**（官方收束）：用最坏情形能确保算法在**所有结果**下都可扩展——如果一个算法可能常数时间运行、最坏却是线性，它能否随输入增长 scale，取决于最坏情形发生时它还能不能工作。你需要有信心：**输入突然从 10 个变成一百万个时，你的代码不会锁死、不会让用户抓狂**。"
          ]
        },
        {
          "h": "同复杂度 ≠ 一样好：常数的两副面孔",
          "p": [
            "官方收尾问题：两个算法复杂度相同，就一样好用吗？例子是两版 oddNumbers（原码见示例区）：+1 版与 +2 版——改动只有自增步长，但对输入 n，+2 版步数**约为一半**：O(N/2)。要不要记成 O(N/2)？官方：不——我们要的不是精确时间，而是**时间相对输入规模怎么长**；Big O 不管常数，因为常数与「怎么 scale」无关，而且留着它们比较「既不有趣也不容易」（官方例子：O(N/2 + 5N) 对 O(N + 5/2N)）。所以两版都是 **O(N)**、随输入同速增长。",
            "另一个视角：**常数最终变得无关紧要**。官方对照表：N=1 时 O(10N)=10、O(n²)=1；N=5 时 50 对 25；N=100 时 1,000 对 10,000（**10 倍差**）；N=1000 时 10,000 对 1,000,000（**100 倍**）；N=10000 时 100,000 对 100,000,000（**1000 倍**）。",
            "表格的推论（官方原话大意）：N 为 100 时 O(10N) 快过 O(n²)；而**实践上，对一些小的输入集合，n² 算法有时真比 N 算法快**——表格前两行就是证据。",
            "官方最后一句是指令也是平衡术：**记住确保你写的代码在它的时间复杂度等级内尽可能高效**——等级选对（别 O(n²) 能 O(N) 就 O(N)），等级内也别浪费（+2 版的半步优化有意义，只是改变不了等级）。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "function oddNumbersLessThanTen() {\n  let currentNumber = 1;\n\n  while (currentNumber < 10) {\n    if (currentNumber % 2 !== 0) {\n      console.log(currentNumber);\n    }\n\n    currentNumber += 1;\n  }\n}",
          "note": "官方数步示范原码：赋值 1 步 + 每轮 3 步（比较/判奇/自增）× 9 轮 + 输出约 5 步 + 退出比较 1 步 = 34 步——但这个精确数字对比较算法没用，下一段就是原因。"
        },
        {
          "lang": "javascript",
          "code": "function oddNumbers(maxNumber) {\n  let currentNumber = 1;\n\n  while (currentNumber < maxNumber) {\n    if (currentNumber % 2 !== 0) {\n      console.log(currentNumber);\n    }\n\n    currentNumber += 1;\n  }\n}",
          "note": "官方关键转折原码：10 换成参数后步数随输入变化——没有可用的具体数字。真正要度量的是「数据变化时步数如何变化」（能不能 scale）——由此引出渐近记号与 Big O；这个函数的答案是 O(N)。"
        },
        {
          "lang": "javascript",
          "code": "arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n\n// 二分查找 7：中位索引公式\nlet middleIndex = Math.floor((startIndex + endIndex) / 2)\n// 初始 startIndex=0、endIndex=9 → 中位索引 4、值 5\n// 7 > 5：砍掉 5 及其左边全部\narr = [-, -, -, -, -, 6, 7, 8, 9, 10]\n// 重算中位 → 索引 7、值 8；7 < 8：砍掉 8 及其右边\narr = [6, 7, -, -, -]\n// 重复直到只剩一个元素：匹配则找到，否则不在数组里",
          "note": "官方 O(log N) 推演原码（数组状态为官方示意写法）：每步砍掉一半——数据翻倍步数只 +1。官方翻倍表：Size 1/2/4/8/16/32 → Steps 1/2/3/4/5/6。前提：只对已排序数组有效。"
        },
        {
          "lang": "javascript",
          "code": "function findValue(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    let item = arr[i];\n    if (item === 1) {\n      return item;\n    }\n  }\n}",
          "note": "官方 Omega 例子原码：最坏情形（目标不在数组或恰在末尾）必须迭代每个元素——O(N)，这是 Big O；最好情形（目标恰为第一个）一步命中——O(1)，这是它的 Omega。官方评：Omega 不被认为那么有用——目标很少恰在第一位，给不出 scale 信息。"
        },
        {
          "lang": "javascript",
          "code": "function oddNumbers(maxNumber) {\n  let currentNumber = 1;\n\n  while (currentNumber < maxNumber) {\n    if (currentNumber % 2 !== 0) {\n      console.log(currentNumber);\n    }\n\n    currentNumber += 2;\n  }\n}",
          "note": "官方「同复杂度比较」原码：与 +1 版只差自增步长，步数约一半（O(N/2)）——但 Big O 丢弃常数，两版都记 O(N)、随输入同速 scale。配套的 O(10N) vs O(n²) 对照表说明：常数最终无关紧要，但小输入时 n² 算法有时真更快——所以要在你的复杂度等级内尽可能高效。"
        }
      ],
      "pitfalls": [
        {
          "title": "用秒表测效率，拿运行时长比较算法",
          "text": "官方第一原则：永远不要用执行花多久度量算法效率——时长混入机器负载、硬件差异等与算法无关的因素。正确姿势是数「步」、看步数随输入规模怎么变（Big O）；要实测也用同一环境比相对趋势，别拿绝对毫秒数下结论。"
        },
        {
          "title": "把 Big O 当成能自动跑出结果的工具",
          "text": "官方明说：Big O 不是一段你把算法放进去、它就告诉你效率的代码——要自己度量步数随数据的变化再贴记号。指望 IDE 或库替你算复杂度，不如练「见循环结构说出记号」的肌肉：单层迭代 O(N)、嵌套 O(n²)、对半拆 O(log N)。"
        },
        {
          "title": "以为同是 O(N) 的算法就一样好",
          "text": "Big O 丢常数是为了看 scale 趋势，不是说常数不存在：+2 步长版步数约一半，O(10N) 在小输入时真会输给 O(n²)（官方对照表前两行）。官方指令是双层的：等级选对，且在等级内把代码写得尽可能高效。"
        },
        {
          "title": "只用最好情形自我安慰（Omega 陷阱）",
          "text": "「平均来说很快」救不了最坏情形：findValue 最好一步命中，但目标很少恰在第一位。官方选 Big O 当主要记号的原因就是可扩展性必须由最坏情形背书——输入从 10 变一百万时，代码不能锁死。"
        },
        {
          "title": "对二分查找用未排序数组",
          "text": "O(log N) 的每步「砍掉一半」完全依赖数组有序——无序数组砍掉的一半里可能正藏着目标。二分查找的前提（官方明文：it only works on sorted arrays）比它的速度更重要；无序数据要么先排序（把成本算进去），要么老实 O(N) 线性找。"
        }
      ],
      "official": {
        "assignment": [
          "通读 Doable Danny 的 Big O Notation in JavaScript——它用图表与示例覆盖了常见复杂度。",
          "Big-O cheat sheet 是一个了不起的资源（官方原话 amazing resource）：它给出复杂度对照图表——你可以看到不同算法随数据规模增长的表现——还给出常见数据结构操作与常见排序算法的时间复杂度。",
          "读 Step-by-step Big O Complexity Analysis Guide, using JavaScript（sahinarslan.tech）——它末尾有一节讲空间复杂度，你现在可以先跳过。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/computer_science/time_complexity.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "78cdf203e610de53a54d2474d96a47fbf66c2c39510d9b074c7477becfe681d6",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "javascript-space-complexity",
      "title": "Space Complexity",
      "zh": "空间复杂度",
      "group": 5,
      "url": "https://www.theodinproject.com/lessons/javascript-space-complexity",
      "summary": "时间复杂度的姊妹课：同一套 Big O 记号，度量的对象从「时间」换成「内存」——**输入变化时算法用掉多少内存**。官方先圈定语义：谈内存指**主存（primary memory）**，即系统执行算法可用的工作内存。空间复杂度 = 算法**输入占的空间 + 辅助空间（auxiliary space）**——辅助空间是算法执行期间创建的临时变量等额外空间，虽不长期占用但执行期间必须计入；所以空间复杂度可理解为**算法需要的全部工作内存**。官方坦率承认它常被忽视：多数效率文章几乎只讲时间复杂度、空间至多是脚注；你写的大多数算法输入规模可控，往往先遇到「慢」才会遇到「内存耗尽」——但反面是：**硬件内存通常固定、不能随手扩**；时间问题可以让程序多跑一会儿等结果，**空间问题不行**。度量方法与时间完全相同：算所有步骤（含常数）再丢常数——线性用内存 + 3 个临时变量 = O(N) + 3 → **O(N)**。例子：multiply 两数相乘只产生一个值——**O(1)**；sumArr 复制数组再累加——N+1 个变量 → **O(N)**（对象版 sumObjectValues 同理）。本课独有的概念是**辅助空间分析（auxiliary space analysis）**：传入的数据结构算不算算法的空间？两种口径都成立——把输入算进去是 O(N)；认为输入由调用前的外部例程分配、只算**额外**空间则是 O(1)。官方用一对函数说明其价值：squareNumsInPlace（原地平方）与 squareNumsNewArr（map 建新数组）传统分析都是 O(N)——说不清两者内存用法的明显差别；辅助空间分析则一眼分明：前者 O(1) 额外、后者 O(N) 额外。收尾官方给了平衡术：多数数据结构都是 O(N) 空间、许多排序算法 O(1) 空间（回看 Big-O cheat sheet 体会更深）；重构时要同时权衡**可读性**——为效率引入 memoization 若让代码难懂得多，值不值？官方建议：**可读性优先，性能有明确影响时再为效率重构**。Assignment 两条：cs.stackexchange 上「分析空间复杂度」问题的第一个回答（空间计数的不同方式）、dev.to 的「递归与空间复杂度」一文。",
      "guide": "以下是官方原课的中文化梳理。这一课结构上是 time-complexity 的「换轴重播」：记号体系、丢常数规则、八个常见 Big O 全部沿用上一课——新增的知识点只有三个：主存语义、辅助空间分析、可读性平衡术。读法建议：① 快速过「什么是空间复杂度」与「为什么重要」（时间可以等、内存不能扩是核心论点）；② 重点吃透**辅助空间分析**——它是本课独有的思维工具，squareNumsInPlace/squareNumsNewArr 对照（示例区官方原码）是理解它的钥匙：同一个「都是 O(N)」的传统结论掩盖了原地修改与新建数组的本质差别，辅助口径把差别显形；③ 收尾段的可读性平衡术值得抄下来——「可读性优先，性能有明确影响时再重构」是对「过早优化」的官方表态。与上一课的钩子：Assignment 第 2 条官方明说回看 Big-O cheat sheet「会有更深的欣赏」——数据结构区几乎清一色 O(N) 空间、排序算法区许多 O(1) 空间；cheat sheet 从此是时间+空间双栏对照表。与下一章的钩子：HashMap 课会讲「增长（growth）操作的复杂度恒为 O(n)」——空间换时间的第一个正式案例；memoization（收尾段提到的维基词条）在动态规划场景里同样是「空间换时间」——权衡思维从这一课开始养成。",
      "understand": [
        "官方定位：上一课从时间角度度量复杂度——本课看**空间复杂度**：同一套已学记号，度量**输入变化对算法内存用量的影响**",
        "语义圈定（官方）：谈内存指**主存（primary memory）**——系统执行算法可用的**工作内存**（官方附 GeeksforGeeks 的 Primary Memory 文章链接）",
        "空间复杂度的构成（官方）：度量空间复杂度要考虑**算法输入占的空间**与**辅助空间（auxiliary space）**——辅助空间是算法用的额外空间（如执行期间创建的临时变量）：不会长期影响内存，但执行期间必须考虑；所以空间复杂度可视为**算法需要的全部工作内存**",
        "与时间一致的方法论（官方）：不像「某一次具体运行」的效率，要看**输入规模变化时效率怎么变**——空间也一样",
        "为什么常被忽视（官方坦率承认）：自查算法效率的资料，多数文章全部或大部分篇幅讲时间复杂度，提到空间也基本是脚注；而且你写的大多数算法输入规模可控——**往往先遇到程序慢的问题，才会遇到内存用尽的问题**",
        "为什么仍然重要（官方反面论证）：硬件通常有**固定量**的内存、多数场景不能随手扩；**时间问题可以让程序多跑一会儿、总会回来结果——空间问题不行**；权衡下来你可能更常遇到时间要紧的问题，但懂得度量空间复杂度，真撞上空间约束时你就有准备",
        "度量方法与时间**完全相同**（官方）：考虑所有步骤（含常数）再在贴记号时丢常数——例：内存用量随输入线性增长 + 创建 3 个临时变量 = O(N) + 3 → 常数不随输入变 → 空间复杂度 **O(N)**",
        "八个最常见 Big O 记号（官方重列，与上一课相同）：O(1) 常数 / O(log N) 对数 / O(N) 线性 / O(N log N) / O(n²) 平方 / O(n³) 立方 / O(2ⁿ) 指数 / O(N!) 阶乘——官方注明只讲最常见的（多数其他复杂度不适用于你最常用的数据结构）",
        "**O(1) 例子**（官方 multiply）：两数相乘——不管传什么参数，只创建**一个**值（乘积）、不随输入变——空间恒为 O(1)",
        "**O(N) 例子**（官方 sumArr/sumObjectValues）：你遇到的**大多数数据结构空间复杂度都是 O(N)**——元素数增加、占用空间线性增加；sumArr 复制传入数组（copyArr）加一个 sum 变量：N + 1 → 丢常数 → O(N)；对象版同理（对象规模增长、占用线性增长）",
        "**辅助空间分析（auxiliary space analysis）**——本课独有概念（官方）：传入的数据结构算不算？一种口径把输入算进去（O(N)）；另一种认为**输入数组的创建属于调用前分配它的外部例程**——于是算法只占 O(1)（其余变量皆常数）。后者就是辅助空间分析：**只算算法额外（extra）占用的空间、输入不计入**——适合描述「额外空间用法不同」的算法",
        "官方对照例（squareNums 一对函数）：都接收数字数组、返回每个数平方后的数组——squareNumsInPlace **直接改输入数组**、squareNumsNewArr 用 map **建新数组**；传统空间分析两者都是 O(N)——**说不清两者内存用法的（非常明显的）差别**；辅助空间分析则说：上面的函数用 **O(1) 额外空间**、下面的用 **O(N)**",
        "其他复杂度（官方）：许多数据结构共享 O(N) 空间复杂度，所以你写不出多少空间复杂度不同的算法；**有些递归函数与排序算法**确实有不同空间复杂度，但通常没多少理由考虑别的。回看上一课 Assignment 的 **Big-O cheat sheet**（官方：现在你会有更深的欣赏）：滚到数据结构区与排序算法区——时间与空间复杂度并排；注意**多少是 O(N)**（数据结构尤甚）、**许多排序算法只有 O(1) 空间**——学排序算法时记在心里。官方明说不给其他记号的空间例子：得编造不代表你日常代码的绕弯例子",
        "收尾平衡术（官方）：度量复杂度（时间或空间）可能很难、需要练习与考量；练习代码阶段你不会想起它——但代码能跑之后、想重构时，**值得停下来想想它是否已尽可能高效**：创建了不必要的变量吗？算法用的数据结构对它的主要用途来说时间复杂度是否更差？还要**平衡可读性**：为更高效引入 **memoization**（维基词条）若让代码难懂得多，这个交易值吗？官方建议：**可读性优先；性能有明确影响时，再为更好的效率重构**"
      ],
      "terms": [
        {
          "en": "Space complexity（空间复杂度）",
          "zh": "算法总内存用量相对输入规模的度量——与时间复杂度并列；同一套 Big O 记号"
        },
        {
          "en": "Primary memory（主存）",
          "zh": "官方圈定的语义：系统执行算法可用的工作内存——不是磁盘、不是缓存层级"
        },
        {
          "en": "Auxiliary space（辅助空间）",
          "zh": "算法执行期间额外用的空间（临时变量、新建的数据结构）——空间复杂度 = 输入空间 + 辅助空间"
        },
        {
          "en": "Auxiliary space analysis（辅助空间分析）",
          "zh": "只算额外空间、输入不计入的口径——能区分「原地修改 O(1) 额外」与「新建数组 O(N) 额外」这类传统分析说不清的差别"
        },
        {
          "en": "In-place（原地）",
          "zh": "直接修改传入的数据结构而不建新副本——squareNumsInPlace 的做法：辅助空间 O(1)，代价是调用方的原数组被改写"
        },
        {
          "en": "Memoization（记忆化）",
          "zh": "把算过的结果存起来避免重算——官方收尾用它提「空间换时间」的可读性权衡：更高效但难懂得多时，值吗？"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：重点吃透辅助空间分析的两种口径与 squareNums 对照例",
        "读 cs.stackexchange「analyzing space complexity of passing data to function by reference」问题的**第一个回答**（Assignment 第 1 条）：空间计数的不同方式——正是正文辅助空间一节的延伸讨论",
        "读 dev.to 的 Recursion and space complexity 一文（Assignment 第 2 条）：给递归函数与其空间复杂度补语境——递归每层栈帧都占空间，连回上一课的递归深度",
        "回看 Big-O cheat sheet（上一课 Assignment 第 2 条，官方本课点名回看）：滚到数据结构与排序算法区——对照时间与空间两栏，注意多少数据结构是 O(N) 空间、多少排序算法是 O(1) 空间",
        "自检练习：给 Project: Recursion 里你写的 mergeSort 标一个辅助空间——合并时新建的临时数组是哪一口径下的什么值？再想想 fibsRec 的栈帧开销",
        "自检练习 2：翻你自己的 Todo List / Library 项目找一处「不必要的复制」（比如只为遍历而 slice 整个数组）——按官方收尾三问检查：变量必要吗？数据结构选对了吗？改了可读性损失多少？"
      ],
      "quiz": [
        {
          "question": "空间复杂度由哪两部分构成？「辅助空间」指什么？",
          "answer": "官方构成：**算法输入占的空间 + 辅助空间（auxiliary space）**。辅助空间是算法**额外**用的空间——执行期间创建的临时变量、新建的数据结构等；它们不会长期影响内存，但算法执行期间必须计入。所以空间复杂度可以理解为**算法需要的全部工作内存**（主存语义：系统执行算法可用的工作内存）。"
        },
        {
          "question": "官方说「你多半先遇到慢、再遇到内存耗尽」——那为什么空间复杂度仍然重要？",
          "answer": "官方的反面论证：硬件通常有**固定量**的内存、多数场景不能随手扩——而时间与空间的性质不同：**时间问题可以让程序多跑一会儿、总会回来结果；空间问题不行**（内存耗尽就是崩溃/失败，没有「多等会儿」的选项）。权衡下来时间约束确实更常见，但懂得度量空间复杂度意味着：真撞上空间约束的场景（大数据集、受限设备、服务端内存配额）时你**有准备**。"
        },
        {
          "question": "sumArr 的官方例子里「N + 1 个变量」怎么得出 O(N)？为什么 copy 一份数组是 O(N) 而 multiply 是 O(1)？",
          "answer": "sumArr 接收数组（规模 N）：copyArr 持有整份复制（N 个元素的空间）+ sum 一个变量——共 N+1；Big O 丢常数（+1 不随输入变）→ **O(N)**。multiply 无论传什么参数只创建**一个**值（乘积）——空间不随输入变 → **O(1)**。分界就在「新占的空间是否随输入规模增长」：复制整个输入结构必然线性增长；只产出固定几个值就是常数。"
        },
        {
          "question": "什么是辅助空间分析？squareNumsInPlace 与 squareNumsNewArr 的对照说明它解决什么问题？",
          "answer": "辅助空间分析 = **只算算法额外占用的空间、输入不计入**（输入数组的创建属于调用前分配它的外部例程）。解决的问题：传统空间分析下，两个 squareNums 函数**都是 O(N)**——但一个直接改输入数组（不建新结构）、一个用 map 建新数组，内存用法的差别非常明显却被同一个记号掩盖。辅助口径一眼分明：**InPlace 版 O(1) 额外、NewArr 版 O(N) 额外**——适合描述「额外空间用法不同」的算法，也提醒你原地修改的隐性代价是改写了调用方的数据。"
        },
        {
          "question": "官方收尾的「可读性平衡术」建议什么？memoization 在其中扮演什么角色？",
          "answer": "官方建议（原话大意）：**可读性优先；性能有明确影响时，再为更好的效率重构**。时机是「代码能跑之后、想重构时」——停下来问三件事：创建了不必要的变量吗？算法用的数据结构对它的主要用途是否时间复杂度更差？以及可读性代价——**memoization**（把算过的结果存起来避免重算，典型的空间换时间）是官方举的例子：为效率引入它之后，代码是否难懂得多？这个交易值不值？最终要你自己拍板（官方原话：you need to make a call on it）——记号是工具，判断是你的。"
        }
      ],
      "optional": [],
      "note": "本课官方正文的八个 Big O 记号列表与上一课完全一致（官方注明「作为提醒」重列）——本站如实保留。official 例子的代码四段收进示例区（multiply、sumArr 啰嗦版、sumArr 精简版、squareNums 一对函数）；sumObjectValues 对象版在理解点转述。官方正文内嵌三条外部链接（GeeksforGeeks 主存文章、Big-O cheat sheet 回看、memoization 维基词条）按资源清单口径登记。Assignment 第 2 条 dev.to 文章按本站对 dev.to 的既有核验口径处理。",
      "why": "这一课补上效率度量的另一半：时间之外，内存同样是硬约束——而且性质更狠（时间可以等，空间不能扩）。它直接服务后面的项目：HashMap 的增长机制（容量翻倍、重散列复制）是「空间换 O(1) 访问」的正式案例，BST 与链表每个节点都在消耗空间，骑士之旅的 BFS 队列规模决定内存峰值——没有空间视角，你只算对了一半账。辅助空间分析还藏着工程判断力：原地修改省内存但改写调用方数据、新建副本安全但费空间——这个取舍在你处理大数组、写 React 状态更新（不可变数据）时天天遇到。收尾的可读性平衡术则是官方给「过早优化」的正式表态：先让代码对与清晰，性能有明确影响时再动手——带上记号做判断，而不是带着记号做焦虑。",
      "sections": [
        {
          "h": "什么是空间复杂度",
          "p": [
            "官方衔接：上一课我们从**时间**角度度量复杂度——学了度量算法复杂度的各种方式、为什么 Big O 是首选、以及它怎么用于时间复杂度。本课聚焦**空间复杂度**：看同一套已学记号怎么度量「**输入变化对算法内存用量的影响**」。",
            "语义先圈定（官方）：谈内存，我们指**主存（primary memory）**——你的系统执行算法可用的**工作内存**（官方附 GeeksforGeeks 的 Primary Memory 文章链接）。",
            "构成（官方）：度量空间复杂度要考虑**算法输入占的空间**与**辅助空间（auxiliary space）**。辅助空间是算法用的额外空间——比如执行期间创建的临时变量：它们不会长期影响内存空间，但算法执行期间必须考虑。因此，你可以把空间复杂度理解为**算法需要的全部工作内存**。方法论也与时间一致：不看某一次具体运行，看**输入规模变化时怎么变**。"
          ]
        },
        {
          "h": "为什么重要：时间可以等，内存不能扩",
          "p": [
            "官方先替你问出疑虑：如果你自查过算法效率的资料，你会以为空间复杂度没那么重要——**多数文章全部或大部分篇幅讲时间复杂度**，提到空间也基本是脚注。而且公平地说，你写的大多数算法输入规模可控、空间不成问题——**你必然先撞上程序慢的问题，才会撞上内存用尽的问题**。",
            "然后官方给出反面论证（本课最锋利的两句）：你的硬件通常有**固定量**的内存，多数场景**不能随手扩**。当问题是时间时，你可以让程序多跑一会儿、它总会带着结果回来——**空间问题你没法这样**。",
            "官方收束权衡：总体上你更常遇到「执行时间比占用空间更要紧」的问题——但**懂得度量空间复杂度意味着：当你真撞上存在空间约束的情况时，你有准备处理它**。"
          ]
        },
        {
          "h": "度量空间复杂度：O(1) 与 O(N)",
          "p": [
            "好消息（官方）：度量空间复杂度与时间**完全相同**——你已经会 Big O，只是思考对象从时间换成**内存怎么用**。规则照旧：考虑所有步骤（含常数），贴记号时**丢常数**——例：内存随输入线性增长 + 创建 3 个临时变量 = O(N) + 3 → 3 个变量不随输入规模变 → 空间复杂度 **O(N)**。",
            "官方重列八个最常见记号作提醒（与上一课相同）：O(1)、O(log N)、O(N)、O(N log N)、O(n²)、O(n³)、O(2ⁿ)、O(N!)——并注明只讲最常见的：多数其他复杂度不适用于你最熟悉、最常用的数据结构。",
            "**O(1) 例子** multiply（原码见示例区）：两数相乘——不管传什么参数，只创建**一个**值（乘积）、不变——空间恒为 **O(1)**。",
            "**O(N) 例子** sumArr（原码见示例区）：官方特意写得啰嗦（copyArr 复制 + sum 累加 + forEach）以便看清——N 个元素的复制加一个变量：N + 1 → 丢常数 → **O(N)**。官方点题：**你遇到的大多数数据结构空间复杂度都是 O(N)**——元素数增加、占用线性增加；数组换成对象（sumObjectValues：扩展运算符复制对象再对值求和）结论相同。官方还卖了个关子：为什么要复制数组？后面（辅助空间一节）讨论。"
          ]
        },
        {
          "h": "辅助空间分析：输入算不算？",
          "p": [
            "官方点名这是空间复杂度**最常引起困惑**的区域之一：算法语境下什么才算「占用空间」。前面的 sumArr 特意复制了参数——如果不复制、直接对传入的 arr 做 forEach（原码见示例区）呢？",
            "两种口径都成立（官方）：数据结构作为参数传入时（尤其是数组按引用传递的语言），可以说这算法要 **O(N)** 空间（把输入规模算进去）；也可以说**输入数组的创建属于调用这个函数之前分配它的外部例程**——于是本算法只占 **O(1)**（其余变量皆常数）。后一种口径就是**辅助空间分析（auxiliary space analysis）**：**只算算法额外（extra）占用的空间——输入不计入**。它适合描述「额外空间用法不同」的算法。",
            "官方对照例（原码见示例区）：两个函数都接收数字数组、返回每个数平方后的数组——**squareNumsInPlace** 直接改输入数组（for 循环原地赋值）；**squareNumsNewArr** 用 map **建新数组**（官方注释提醒：Array.prototype.map 会创建新数组）。传统空间分析下两者**都是 O(N)**——官方评：这没法告诉我们这两个算法内存用法的（非常明显的）差别。辅助空间分析更好：**上面的函数用 O(1) 额外空间，下面的用 O(N)**。",
            "其他复杂度（官方）：许多数据结构共享 O(N) 空间，你写不出多少空间复杂度不同的算法——**有些递归函数与排序算法**确实不同，但通常没多少理由考虑别的。官方请你回看上一课的 **Big-O cheat sheet**（原话：现在再看你会有更深的欣赏）：滚到数据结构区与排序算法区——时间与空间复杂度并排给出；注意**多少是 O(N)**（数据结构尤甚）、**许多排序算法只有 O(1) 空间**——学排序算法时记在心里。官方明说不再给其他记号的空间例子：得编造不代表你日常代码的绕弯例子；你在自己的真实代码里遇到好例子，欢迎告诉官方、可能收进课程。"
          ]
        },
        {
          "h": "收尾：可读性优先的平衡术",
          "p": [
            "官方先把难度说实在：度量算法的复杂度——时间或空间——**可能很难**，需要练习与考量。你写的大多数练习代码不会想起它，尤其是当你还在挣扎着让代码能跑的时候。",
            "但时机总会来（官方）：代码能跑之后、你考虑重构时，**绝对值得停一下想想代码是否已尽可能高效**——你创建了不必要的变量吗？你的算法所用数据结构，对它的主要用途来说，时间复杂度是否比另一个数据结构更差？",
            "在这些考量之上，还要**平衡代码的可读性**：如果为了更高效开始引入 **memoization**（把算过的结果存起来避免重算——官方给了维基词条链接），代码是否因此难懂得多？**这个交易值吗？**官方原话：最终你需要自己拍板（you need to make a call on it）。",
            "官方给出的建议是本章的方法论收束：**可读性优先；性能有明确影响时，再为更好的效率重构**（consider the readability first, and look to refactor for better efficiency if there is a clear impact on performance）。"
          ]
        },
        {
          "h": "Assignment 导读：两种口径与递归的空间账",
          "p": [
            "两条资料正好接住正文两个最细的点：**① cs.stackexchange「分析按引用传数据给函数的空间复杂度」的第一个回答**——空间可以怎么计数的不同思路，正是「辅助空间分析」一节的延伸讨论；**② dev.to 的「递归与空间复杂度」一文**——给递归函数与其空间复杂度补语境：递归每层调用都占一帧栈空间，深度即空间——连回 Recursive Methods 课的递归深度与 stack overflow。",
            "建议顺序：先读 ①（口径问题趁热打铁），再读 ②（把递归项目的空间账算一遍）；读完回看 Big-O cheat sheet 的双栏表格收尾。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "function multiply(num1, num2) {\n  return num1 * num2;\n}",
          "note": "官方 O(1) 例子原码：不管传什么参数，只创建一个值（乘积）、不随输入变——空间恒为 O(1)。这是「新占空间是否随输入规模增长」分界的最简一侧。"
        },
        {
          "lang": "javascript",
          "code": "function sumArr(arr) {\n  const copyArr = arr.slice();\n  let sum = 0;\n  copyArr.forEach((number) => {\n    sum += number;\n  });\n  return sum;\n}",
          "note": "官方 O(N) 例子原码（特意写得啰嗦以便看清）：copyArr 持有整份复制（N 个元素）+ sum 一个变量 = N + 1 → 丢常数 → O(N)。官方点题：你遇到的大多数数据结构空间复杂度都是 O(N)。为什么复制数组？下一段示例揭晓。"
        },
        {
          "lang": "javascript",
          "code": "function sumArr(arr) {\n  let sum = 0;\n  arr.forEach((number) => {\n    sum += number;\n  });\n  return sum;\n}",
          "note": "官方「不复制」版本原码：直接对传入数组迭代——它算 O(N)（输入计入）还是 O(1)（输入属于外部例程、只算额外空间）？两种口径都成立，后者就是辅助空间分析（auxiliary space analysis）：只算算法额外占用的空间。"
        },
        {
          "lang": "javascript",
          "code": "function squareNumsInPlace(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    arr[i] = arr[i] * arr[i];\n  }\n\n  return arr;\n}\n\nfunction squareNumsNewArr(arr) {\n  // note that `Array.prototype.map()` makes a *new* array\n  return arr.map((number) => number * number);\n}",
          "note": "官方辅助空间对照原码：传统分析两者都是 O(N)——说不清内存用法的明显差别；辅助空间分析一眼分明：InPlace 版 O(1) 额外（直接改输入数组）、NewArr 版 O(N) 额外（map 建新数组，官方注释特意提醒）。隐性代价也在这：原地修改改写了调用方的数据。"
        }
      ],
      "pitfalls": [
        {
          "title": "以为「空间复杂度不重要」而从不度量",
          "text": "官方承认空间常被当脚注、你也多半先遇到慢再遇到内存耗尽——但硬件内存固定、不能随手扩，且时间可以等、空间不行。真撞上空间约束（大数据集、受限设备）时没准备就是事故；平时用「新占空间随输入怎么长」一问就能把账算清。"
        },
        {
          "title": "分不清两种口径，辅助空间忽大忽小",
          "text": "同一算法，把输入算进去是 O(N)、只算额外空间可能是 O(1)——两种口径都对，混着用才错。官方给的用途边界：描述「额外空间用法不同」的算法（原地 vs 新建）时用辅助口径；报「全部工作内存」时输入计入。先声明口径，再报记号。"
        },
        {
          "title": "原地修改省了内存，却改坏了调用方的数据",
          "text": "squareNumsInPlace 的 O(1) 额外空间有隐性代价：传入的数组被改写——调用方手里的原数据没了。省空间与不可变（immutability）之间的取舍要显式做：官方对照例把两种都摆出来，就是让你看见各自的账单。"
        },
        {
          "title": "为「更高效」过早引入 memoization，代码变得没人看得懂",
          "text": "官方收尾平衡术：可读性优先，性能有明确影响时再为效率重构——memoization 是典型的空间换时间，但缓存逻辑会让代码难懂得多。先问「性能影响明确吗」，再问「交易值吗」，最终自己拍板；别用记号给过早优化发通行证。"
        }
      ],
      "official": {
        "assignment": [
          "读 cs.stackexchange 上「analyzing space complexity of passing data to function by reference」问题的第一个回答，了解空间可以怎么计数的不同思路。",
          "读这篇关于递归与空间复杂度的文章（dev.to：Recursion and space complexity）——它给递归函数与其空间复杂度补一点语境。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/computer_science/space_complexity.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "234a1fe0830b91e7e982c0fa69063b000e5faac7aedaa60a08c9c1d31aaf6f90",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "javascript-common-data-structures-and-algorithms",
      "title": "Common Data Structures and Algorithms",
      "zh": "常见数据结构与算法",
      "group": 5,
      "url": "https://www.theodinproject.com/lessons/javascript-common-data-structures-and-algorithms",
      "summary": "数据结构与搜索算法的全景导览课。**数据结构**的基本思想：按你特定应用的需要来存数据——你可能想把某类数据全塞进一个巨型数组，但数据量与层级一深，定位特定值就相当费时，所以要看别的选项。一批基本数据结构各有分工，差别通常在**权衡（trade-offs）**：最初填充结构要多久、添加或查找元素要多久、结构在内存里占多大。官方定位本课为「扩工具箱」的引言：细节留给更偏计算机科学的课程，但学完你该能识别并解决「普通 Array、Hash 和 Set 不太够用」的问题——尤其当你要在一大批数据里搜特定值、或提前好几步规划策略时。**算法**一侧：你已在其他课短暂见过（上个项目刚写了 Merge Sort）——排序算法相当常见；另一大领域是**搜索**：毫秒必争，在海量数据里搜索时搜索算法的质量极其重要；在数据树里遍历找特定元素是数据密集型应用的常见相关问题。官方定心丸：这些复杂算法问题**过去都被解决过许多遍了**——理解它们怎么被解决，会给你一些很棒的工具去应用到自己遇到的其他（相似）问题上；**算法其实就是系统性解决问题的方法**。本课聚焦两个你自己写代码时可能撞上的算法：**广度优先搜索（breadth-first-search）与深度优先搜索（depth-first-search）**。overview 四条：数据结构入门 / 认识栈和队列 / 为什么该学算法 / 探索不同搜索算法。Assignment 六条：维基 Data Structures 条目扫一眼 + 五组视频（Why Study Algorithms 前 10 分钟、CS50 二分查找、无序数组建 BST、队列与栈原理、BST 的 BFS/DFS 三部曲）。",
      "guide": "以下是官方原课的中文化梳理。这一课是本章后半程（链表 → HashMap → 二叉搜索树 → 骑士之旅四个项目）的地基：官方正文不展开任何具体结构，只建立两件事——「数据结构 = 按需求权衡的存储方案」与「BFS/DFS 是搜索的两大套路」；全部细节由 Assignment 的六份资料承担，本站如实按官方结构组织。读法建议：正文的「权衡三问」（填充多久/增查多久/占多大内存）值得背下来——它是后面每个项目选型时的检查清单（链表 vs 数组、HashMap 的 O(1)、BST 的 O(log n) 都是这三问的答案）。视频里最重要的是第 5、6 条：队列与栈的原理（官方明说：它们分别是 BFS 与 DFS 使用的概念）与 BST 遍历三部曲（Binary tree traversal / Breadth-first traversal / Depth-first traversal）——这六支视频里的后三支会在 Project: Binary Search Trees 的 levelOrderForEach 与三个深度优先 ForEach 任务里被官方再次点名，骑士之旅项目更是直接要求「DFS 与 BFS 二选一」。Why Study Algorithms 官方注明只看前 10 分钟（其余更数学向、感兴趣随意）。",
      "understand": [
        "**数据结构**的基本思想（官方开篇）：以**满足你特定应用需要**的方式存储数据",
        "官方反例：你或许想把某类数据存进**一个巨型数组**——但数据数量与深度可观时，定位特定值会**相当费时**；所以你需要看其他选项",
        "结构之间的差别（官方）：通常在**权衡（trade-offs）**——**最初填充结构要多久、添加或查找元素要多久、结构在内存里占多大**",
        "官方对本课的定位：数据结构的细节留给更偏计算机科学的课程——本引言**稍微扩展你的工具箱**，让你能**识别并解决「普通 Array、Hash 和 Set 不太够用」的某些问题**",
        "新结构与新策略尤其相关的场景（官方举例）：试着**在一大批数据里搜索特定值**、或**提前好几步规划策略**的时候",
        "算法侧的盘点（官方）：你已在其他课对**算法**有过简短介绍——上个项目还亲手写了 **Merge Sort**；你会发现**排序算法相当常见**",
        "算法的另一大领域是**搜索**（官方）：**毫秒必争**——在巨量数据里搜索时，**搜索算法的质量极其重要**；在数据树里遍历寻找特定元素是相关的常见问题（数据密集型应用里常见）",
        "官方定心丸：幸运的是，这些复杂算法问题**过去都已被解决过许多遍**——理解它们**怎么**被解决，会给你很棒的工具去应用到自己遇到的其他（相似）问题上",
        "算法的定义（官方一句话）：**算法真的只是系统性解决问题的方法**（ways of solving problems systematically）",
        "本课聚焦的两个算法（官方）：你自己写代码时可能撞上的——**广度优先搜索（breadth-first-search）**与**深度优先搜索（depth-first-search）**",
        "lesson overview 四条：获得数据结构入门 / 认识**栈（stack）和队列（queue）** / 弄清为什么该学算法 / 探索不同的搜索算法",
        "Assignment 里官方点名的对应关系：**队列与栈的原理是 BFS 与 DFS 分别使用的概念**（第 5 条视频）；第 6 条的三支视频（二叉树遍历 / 广度优先遍历 / 深度优先遍历）会在二叉搜索树项目里被再次引用"
      ],
      "terms": [
        {
          "en": "Data structure（数据结构）",
          "zh": "按应用需求组织数据的方式——差别在权衡：填充耗时、增查耗时、内存占用"
        },
        {
          "en": "Trade-offs（权衡）",
          "zh": "没有全能结构：每种数据结构都在填充/增查/内存三者间做取舍——选型就是按需求挑取舍"
        },
        {
          "en": "Stack（栈）",
          "zh": "后进先出（LIFO）的线性结构——官方点名：深度优先搜索（DFS）使用的概念"
        },
        {
          "en": "Queue（队列）",
          "zh": "先进先出（FIFO）的线性结构——官方点名：广度优先搜索（BFS）使用的概念"
        },
        {
          "en": "Breadth-first search（BFS，广度优先搜索）",
          "zh": "先扫完同一层再下一层的搜索套路——骑士之旅项目里找最短路径的首选（层数即步数）"
        },
        {
          "en": "Depth-first search（DFS，深度优先搜索）",
          "zh": "一条路走到底再回头的搜索套路——与 BFS 并列的两大搜索算法，本课聚焦对象"
        },
        {
          "en": "Binary search tree（二叉搜索树，BST）",
          "zh": "左小右大的树形结构——Assignment 第 4、6 条视频的主题，二叉搜索树项目的正主"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：把「权衡三问」（填充多久/增查多久/占多大内存）记成选型检查清单",
        "扫一眼维基 Data Structures 条目（Assignment 第 1 条）：官方口径 glance over——高层总览即可，不必深读",
        "看 Why Study Algorithms 的**前 10 分钟**（Assignment 第 2 条，官方注明其余更数学向、感兴趣随意）",
        "看哈佛 CS50 的 how binary search works（Assignment 第 3 条）：二分查找怎么工作——time-complexity 课 O(log N) 的画面版",
        "看 how a binary search tree is constructed from an unordered array（Assignment 第 4 条）：为二叉搜索树项目打前站",
        "看 queues and stacks 的原理视频（Assignment 第 5 条）：官方点名它们是 BFS 与 DFS 分别使用的概念",
        "看 BST 的 BFS/DFS 三部曲（Assignment 第 6 条）：Binary tree traversal → Breadth-first traversal → Depth-first traversal——这三支在二叉搜索树项目里会被官方再次点名"
      ],
      "quiz": [
        {
          "question": "官方说数据结构之间的差别「通常在于权衡」——权衡的是哪三件事？",
          "answer": "官方原话的三项：**最初填充结构要多久**（populate）、**添加或查找元素要多久**（add or find）、**结构在内存里占多大**（size in memory）。这三问就是选型检查清单：数组填充与查找（按索引）快但中间插入慢；链表插入删除容易但按下标查找要遍历；HashMap 用散列换 O(1) 存取但不保插入顺序——后面每个项目都是这三问的具体答卷。"
        },
        {
          "question": "「一个巨型数组」为什么不够用？官方给本课的定位是什么？",
          "answer": "不够用的场景（官方）：数据数量与深度可观时，**定位特定值相当费时**——线性查找 O(N)，数据一大就顶不住。定位：细节留给更偏 CS 的课程，本课**稍微扩展工具箱**——目标是让你能**识别并解决「普通 Array、Hash 和 Set 不太够用」的问题**，尤其在大批数据里搜特定值、或提前好几步规划策略的场景。它是导览不是深潜：具体结构由后面的链表/HashMap/BST 项目逐个动手。"
        },
        {
          "question": "官方一句话定义「算法」是什么？「这些问题过去都被解决过许多遍」对你意味着什么？",
          "answer": "定义：**算法真的只是系统性解决问题的方法**（ways of solving problems systematically）——去神秘化：不是天才专属，是有套路的方法论。意味着：你遇到的复杂问题（排序、搜索、树遍历）大概率有**已被反复验证的标准解法**——理解它们怎么被解决，就获得了可迁移到「其他相似问题」的工具；重新发明轮子既慢又容易错（呼应本章引言课的 don't reinvent the wheel）。"
        },
        {
          "question": "栈和队列分别与哪种搜索算法配对？为什么是这个配法？",
          "answer": "官方点名（Assignment 第 5 条）：**队列是广度优先搜索（BFS）用的概念，栈是深度优先搜索（DFS）用的概念**。配法的道理在两种结构的性质：队列先进先出——先发现的节点先处理，天然形成「一层扫完再下一层」的广度顺序；栈后进先出——最后发现的节点先处理，一条路走到底再回头，正是深度顺序。二叉搜索树项目的 levelOrderForEach（广度）官方提示用数组当队列，骑士之旅的 DFS 变体则会自然用到栈（或递归调用栈）。"
        }
      ],
      "optional": [
        "官方注明（Assignment 第 2 条）：Why Study Algorithms 只看**前 10 分钟**即可——其余部分更数学向，感兴趣再看。"
      ],
      "note": "本课官方正文没有代码块（examples 为空数组是结构事实，与 Project 红线无关），overview 四条的展开全部由 Assignment 六份资料承担——本站如实按官方结构组织、不自行展开具体数据结构细节。Assignment 第 1 条为维基条目（官方口径 glance over）、第 2–6 条为视频（均不声称有中文字幕；第 2 条官方注明只看前 10 分钟，已录 official.optional）。第 6 条三部曲的后两支会在 Project: Binary Search Trees 被官方再次引用。",
      "why": "这一课是本章后半程的地图：接下来的四个项目（链表、HashMap、二叉搜索树、骑士之旅）就是把这里点名的结构逐个亲手造一遍——先看地图再上路，每个项目的「为什么这么设计」都有落点。BFS/DFS 更是通用技能：树遍历、图搜索、爬虫、状态空间搜索（骑士之旅就是棋盘上的状态空间）全是它俩的地盘；面试里「层序遍历」「岛屿数量」类题目就是 BFS/DFS 的换皮。官方的「权衡三问」则伴随你整个职业生涯：每次在 Map 与 Array 之间犹豫、每次设计缓存结构，问的都是填充/增查/内存这三件事。",
      "sections": [
        {
          "h": "数据结构：按需求权衡的存储方案",
          "p": [
            "官方开篇给基本思想：**数据结构**的基本想法，是**以满足你特定应用需要的方式存储数据**。",
            "反例紧随其后：你可能倾向于把某类数据存进**一个巨型数组**——但如果数量与深度可观，**定位特定值会相当费时**（time consuming）；所以你需要看向其他选项。",
            "视应用而定，有一批其他基本数据结构可帮你——官方点出它们差别的本质：通常在**权衡**之间：**最初填充结构要多久、添加或查找元素要多久、结构在内存里占多大**。这三问就是本章后面每个项目的选型暗线。",
            "官方给本课划界：细节留给更偏计算机科学的课程——但这份引言应能**稍微扩展你的工具箱**：让你能**识别并解决「普通 Array、Hash 和 Set 不太够用」的某些问题**。新结构与新策略尤其相关的时刻（官方举例）：你要**在一大批数据里搜索特定值**、或**提前好几步规划策略**的时候。"
          ]
        },
        {
          "h": "算法：系统性解决问题的方法",
          "p": [
            "官方盘点你的存量：**算法**你已在其他课有过简短介绍——上个项目（Project: Recursion）还亲手写了 **Merge Sort**；你会发现**排序算法相当常见**。",
            "另一大领域是**搜索**（官方）：**毫秒必争**（milliseconds count）——当你在巨大的数据宝藏里搜索时，**搜索算法的质量极其重要**；在数据树里遍历寻找特定元素是相关的常见问题，数据密集型应用里常见。",
            "定心丸（官方原话大意）：幸运的是，这些复杂算法问题**过去都被解决过许多遍**——理解它们**怎么**被解决，会给你一些很棒的工具，应用到你自己的其他（相似）问题上。",
            "然后是一句话定义：**算法真的只是系统性解决问题的方法**。本课的聚焦（官方）：两个你自己写代码时可能撞上的算法——**广度优先搜索（breadth-first-search）**与**深度优先搜索（depth-first-search）**。"
          ]
        },
        {
          "h": "栈、队列与两种搜索的配对",
          "p": [
            "overview 第二条「认识栈和队列」由 Assignment 第 5 条视频承担——官方在任务里点明了它们与两种搜索的关系：**队列与栈的原理，分别是广度优先搜索与深度优先搜索使用的概念**。",
            "配对逻辑（本站按官方资料语境梳理）：队列**先进先出**——先发现的先处理，天然形成「一层扫完再下一层」的广度顺序；栈**后进先出**——最后发现的先处理，一条路走到底、走不通再回头，正是深度顺序。",
            "这组配对在后面两个项目里会具象化：二叉搜索树项目的 levelOrderForEach（广度优先层序）官方提示**用数组当队列**；骑士之旅项目官方明说 **DFS 与 BFS 都可行**——但要想清楚各自怎么工作，其中一个需要你处理**可能陷入无尽循环**的可能性。"
          ]
        },
        {
          "h": "Assignment 导读：一条维基 + 五组视频",
          "p": [
            "六条资料的分工：**① 维基 Data Structures 条目**——官方口径「扫一眼」（glance over），高层总览；**② Why Study Algorithms**——官方注明**只看前 10 分钟**，其余更数学向、感兴趣随意；**③ CS50 的二分查找**——time-complexity 课 O(log N) 的画面版；**④ 无序数组怎么建二叉搜索树**——为 BST 项目打前站；**⑤ 队列与栈原理**——BFS/DFS 的概念底座；**⑥ BST 的 BFS/DFS 三部曲**——Binary tree traversal、Breadth-first traversal、Depth-first traversal。",
            "第 ⑥ 条的三支视频值得认真看：后两支（广度优先遍历、深度优先遍历）会在 Project: Binary Search Trees 的 levelOrderForEach 与三个深度优先 ForEach 任务里被官方**再次点名引用**——现在看懂，项目时就不用回头补。",
            "总量提示：六条里五条是视频——这一课官方就是把「看」当主线，动手留给后面四个项目；别在这里停留过久，看完就前进。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "默认「数组能解决一切」",
          "text": "官方反例点名：数据量与深度一上来，巨型数组定位特定值相当费时。每类结构都有自己的三问答卷（填充/增查/内存）——大批数据搜值、提前规划多步策略的场景，普通 Array/Hash/Set 就不够了，这正是本章四个项目要补的洞。"
        },
        {
          "title": "把 BFS/DFS 当背名词，不看队列/栈的配对机制",
          "text": "官方特意安排了队列与栈原理视频并点明配对关系：BFS 用队列（先进先出 → 一层层扫）、DFS 用栈（后进先出 → 一条路到底）。不懂机制，骑士之旅项目里「其中一个要处理无尽循环」的提示就无从想起——DFS 的回头路正是循环风险所在。"
        },
        {
          "title": "在导览课里深挖每个数据结构",
          "text": "官方划界：细节留给更偏 CS 的课程，本课只扩工具箱；维基条目也只是「扫一眼」。在引言课恋战会耗尽进入四个动手项目的耐心——本课的正确姿势是建立地图（权衡三问 + BFS/DFS 配对），细节在项目里长出来。"
        }
      ],
      "official": {
        "assignment": [
          "扫一眼维基的 Data Structures（数据结构）条目，获得一个高层总览。",
          "看 Why Study Algorithms 的前 10 分钟——其余部分更数学向，感兴趣再看。",
          "从哈佛 CS50 的 YouTube 视频学习二分查找（binary search）怎么工作。",
          "现在我们要聚焦二叉搜索树（binary search trees）：先看这支视频，学习一棵二叉搜索树怎么从一个无序数组构造出来。",
          "接着，学习队列（queues）与栈（stacks）的原理——它们分别是广度优先搜索与深度优先搜索使用的概念。",
          "最后，从 YouTube 的这组视频学习二叉搜索树的广度优先与深度优先搜索：Binary tree traversal（二叉树遍历）、Breadth-first traversal（广度优先遍历）、Depth-first traversal（深度优先遍历）。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "官方注明（第 2 条）：Why Study Algorithms 只看前 10 分钟即可——其余部分更数学向，感兴趣再看。"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/computer_science/common_data_structures_algorithms.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "93f56c2edcccc22982f35af6cede1c276dedbc4ef23b8a7e2cb739793f5a61bf",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "javascript-linked-lists",
      "title": "Project: Linked Lists",
      "zh": "项目：链表",
      "group": 5,
      "url": "https://www.theodinproject.com/lessons/javascript-linked-lists",
      "summary": "第一个亲手造数据结构的项目。官方引言先做诚实的铺垫：链表是计算机科学里**最基本、最基础**的数据结构之一，功能上类似数组；相对传统数组的**主要好处**是：列表元素可以**轻易插入或移除、无需重新分配任何其他元素**——在某些语言里数组大小是个问题，链表正是允许动态分配数据的解法之一。但官方马上坦白：**在 JavaScript 里**数组没有大小限制、任意索引的插入删除用内建方法都能轻松做到——那么链表真的有必要吗？短答案是「**看情况**（it depends）」；然而它是**最简单的动态数据结构**，会给你打下扎实基础，让你更容易理解**图（graphs）与二叉树（binary trees）**这类更复杂的结构。结构讲解：链表是称为**节点（nodes）**的数据元素的线性集合，节点靠**指针（pointer）**「指向」下一个节点；每个节点持有单个数据元素与一个到下一节点的链接/指针；**头节点（head）**是第一个、**尾节点（tail）**是最后一个；官方示意：[ NODE(head) ] -> [ NODE ] -> [ NODE(tail) ] -> null。Assignment：两个类或工厂——LinkedList（代表整个列表）与 Node（value 与 nextNode 两属性、默认都为 null）；十个方法（append/prepend/size/head/tail/at/pop/contains/findIndex/toString，各有明确的边界行为规定——空列表返回 undefined、toString 空列表返回空字符串、格式 ( value ) -> … -> null）；Extra credit 两个（insertAt 可插多值、越界抛 RangeError；removeAt 越界抛 RangeError）+ 官方提示：插入移除时考虑对现有节点的影响——有些节点的 nextNode 链接需要更新；Test it out 给了六只动物的填充示例与期望输出。开头另有官方 Tip：Node v22 起自动检测 ES6 模块、无需配置——ESM 报语法错就升级到最新 LTS。",
      "guide": "以下是官方原课的中文化梳理（Project 课：本站不提供成品代码，examples 为空数组——官方正文的代码块是 insertAt 的行为示例与 Test it out 的填充/输出示例，均属需求规格，按文字转述）。这是「造结构」四连项目（链表 → HashMap → BST → 骑士之旅）的第一站：链表是后面一切的地基——HashMap 课官方明说「每个桶将是一条链表」来处理冲突，没有这个项目 HashMap 寸步难行。动手顺序建议严格按官方编号：先 Node 与 LinkedList 两个骨架，再按 append → prepend → size → head/tail → at → pop → contains → findIndex → toString 的顺序逐个「先想边界、再写实现」——官方给每个方法都规定了边界行为（空列表时 head/tail/at/pop 返回什么、findIndex 找不到返回 -1、toString 的精确格式），这些规定就是天然的验收清单，也正好接住上一章的测试思维：每条边界都可以先写成断言再实现。pop() 要特别注意：官方规定它**移除头节点**并返回其值（不是数组 pop 的尾部语义——以官方规格为准）。toString 的格式官方给了精确模板：( value ) -> ( value ) -> ( value ) -> null——括号内空格、箭头两侧空格都要对上，Test it out 的期望输出就是验收样例。Extra credit 的 insertAt(index, ...values) 支持一次插多个值、removeAt 与 insertAt 越界都要抛 RangeError——官方 Tip 提醒想清楚插入/移除对相邻节点 nextNode 的影响（谁的链接要改）。环境 Tip：Node v22（2024 年 10 月转 LTS）自动检测 ES6 模块——遇到 ESM 语法报错先升级 Node（回指 Foundations 的 installing-node-js 课）。",
      "understand": [
        "官方定位：链表是计算机科学里**最基本、最基础的数据结构之一**，功能上**类似数组**",
        "相对传统数组的**主要好处**（官方）：列表元素可以**轻易插入或移除，无需重新分配任何其他元素**（without reallocation of any other elements）",
        "语言背景（官方）：某些编程语言里**数组大小是个问题**——允许动态分配数据的对策之一就是链表",
        "官方的诚实设问：**在 JavaScript 里**，数组没有大小限制、任意索引的插入与删除用合适的内建数组方法都能轻松做到——那么链表真的有必要吗？短答案：**看情况（it depends）**",
        "官方给出的学习理由：它是**最简单的动态数据结构**——会给你**扎实的基础**，让你更容易理解**图与二叉树**这类更复杂的数据结构",
        "结构定义（官方）：链表是称为**节点（nodes）**的数据元素的**线性集合**，节点靠**指针（pointer）**「指向」下一个节点；每个节点持有**单个数据元素**与一个到列表中下一节点的**链接或指针**",
        "官方术语：**头节点（head node）**是列表第一个节点，**尾节点（tail node）**是最后一个；基本表示：[ NODE(head) ] -> [ NODE ] -> [ NODE(tail) ] -> null（尾节点的指针指向 null）",
        "骨架要求（Assignment）：两个类或工厂——**LinkedList**（代表整个列表）与 **Node**（含 **value** 属性与 **nextNode** 属性，两者默认都设为 **null**）",
        "十个方法的官方规格：**append(value)** 把含 value 的新节点加到列表**末尾**；**prepend(value)** 加到**开头**；**size()** 返回节点总数；**head()** 返回第一个节点的**值**（空列表返回 **undefined**）；**tail()** 返回最后一个节点的值（空列表 undefined）；**at(index)** 返回给定索引节点的值（无该索引节点返回 undefined）；**pop()** **移除头节点**并返回其值（空列表返回 undefined）；**contains(value)** 值在列表中返回 true 否则 false；**findIndex(value)** 返回含给定值的节点索引（找不到返回 **-1**；多个匹配返回**第一个**）；**toString()** 把列表表示成字符串（空列表返回**空字符串**；格式：( value ) -> ( value ) -> ( value ) -> null）",
        "Extra credit ①：**insertAt(index, ...values)** 在给定索引插入含给定值的新节点（官方示例：列表 ( 1 ) -> ( 2 ) -> ( 3 ) -> null，insertAt(1, 10, 11) 后变为 ( 1 ) -> ( 10 ) -> ( 11 ) -> ( 2 ) -> ( 3 ) -> null）；索引**越界**（小于 0 或大于列表 size）**抛 RangeError**",
        "Extra credit ②：**removeAt(index)** 移除给定索引的节点；索引越界（小于 0 或大于等于列表 size）**抛 RangeError**；官方 Tip：插入或移除节点时，考虑它怎么影响现有节点——**有些节点需要更新它们的 nextNode 链接**",
        "环境 Tip（官方）：**Node v22**（2024 年 10 月成为 LTS）能**自动检测 ES6 模块**、无需任何进一步配置即可运行——用 ESM 遇到「Node 不认识语法」的报错，把 Node 升级到最新 LTS 版本（官方回指 Foundations 的 installing-node-js 课）"
      ],
      "terms": [
        {
          "en": "Linked list（链表）",
          "zh": "节点的线性集合、靠指针串联——最简单的动态数据结构；插入移除无需重新分配其他元素"
        },
        {
          "en": "Node（节点）",
          "zh": "链表的基本单元：持有单个数据元素（value）与到下一节点的链接（nextNode）——官方要求默认都是 null"
        },
        {
          "en": "Head / Tail（头节点/尾节点）",
          "zh": "列表的第一个与最后一个节点；尾节点的 nextNode 指向 null——官方示意图里的两端"
        },
        {
          "en": "Pointer（指针）",
          "zh": "节点间「指向」关系——JS 里就是对象引用：nextNode 存下一个节点对象的引用"
        },
        {
          "en": "Dynamic data structure（动态数据结构）",
          "zh": "规模随增删变化的结构——链表是最简单的一个；官方：它是理解图与二叉树的扎实基础"
        },
        {
          "en": "RangeError",
          "zh": "JS 内建错误类型——Extra credit 规定 insertAt/removeAt 索引越界时抛出它（而不是返回 undefined 或静默失败）"
        }
      ],
      "tasks": [
        "环境自检（官方 Tip）：node --version 确认 v22+（自动检测 ES6 模块）——版本旧就按官方回指的 Foundations installing-node-js 课升级",
        "看官方资料建立画面：Linked Lists in Plain English（视频）、What's a Linked List, Anyway?（dev.to）、CMU 的图解详述（web.archive.org 存档）、Are Linked Lists necessary?（dev.to，官方诚实设问的延伸）",
        "搭骨架：Node 类/工厂（value 与 nextNode，默认都 null）+ LinkedList 类/工厂（代表整个列表）——先想清楚 LinkedList 该持有什么（头节点引用？size 缓存？）",
        "按官方编号逐个实现十个方法——每个方法先写下官方规定的边界行为再动手：head/tail/at/pop 空列表返回 undefined、contains 返回布尔、findIndex 找不到返回 -1（多匹配取第一个）、toString 空列表返回空字符串",
        "toString 对着官方格式校准：( value ) -> ( value ) -> ( value ) -> null——括号内空格与箭头格式逐字符对上（Test it out 的期望输出是验收样例）",
        "Test it out（官方验收）：建 main.js 导入 LinkedList，依次 append dog/cat/parrot/hamster/snake/turtle，console.log(list.toString()) 应输出 ( dog ) -> ( cat ) -> ( parrot ) -> ( hamster ) -> ( snake ) -> ( turtle ) -> null",
        "Extra credit：insertAt(index, ...values)（一次可插多个值；越界抛 RangeError）与 removeAt(index)（越界抛 RangeError）——官方 Tip：想清楚插入/移除后哪些节点的 nextNode 要更新",
        "把作品 push 上 GitHub（沿用既往项目习惯）——它是 HashMap 项目的直接依赖：官方明说 HashMap 的每个桶将是一条链表"
      ],
      "quiz": [
        {
          "question": "JS 数组明明没有大小限制、插删也轻松——官方为什么还让你造链表？",
          "answer": "官方自己先问了这个问题，短答案「**看情况**」，然后给出真正的理由：链表是**最简单的动态数据结构**——亲手造它会给你**扎实的基础**，让你更容易理解**图与二叉树**这些更复杂的结构。工程上「JS 里链表少用」与学习上「链表必造」不矛盾：造的过程让你理解节点、指针、head/tail、链接更新这些一切结构的通用词汇——下一课 HashMap 的冲突处理官方明说「每个桶是一条链表」，BST 项目里节点与链接的思想也会重逢。"
        },
        {
          "question": "官方对 pop() 的规定与数组的 pop 有什么不同？head()、at() 在空列表/越界时返回什么？",
          "answer": "官方规格：pop() **移除头节点**并返回其值（空列表返回 undefined）——注意这与数组 Array.prototype.pop（移除**尾部**）语义不同，本项目以官方规格为准。边界规定：head() 空列表返回 **undefined**；tail() 空列表同样 undefined；at(index) 无该索引节点返回 undefined；findIndex(value) 找不到返回 **-1**（多个匹配返回第一个的索引）；toString() 空列表返回**空字符串**。这些规定就是验收清单——上一章的测试思维正好用上：每条边界先写成断言。"
        },
        {
          "question": "toString() 的官方格式是什么？为什么格式要求精确到空格？",
          "answer": "官方格式：**( value ) -> ( value ) -> ( value ) -> null**——括号内侧各一个空格、箭头两侧各一个空格、以 null 收尾；空列表返回空字符串。Test it out 的期望输出（六只动物）是逐字符的验收样例。精确到空格的原因：它是这个项目唯一的「可视化」手段——格式不对，Test it out 对不上号，你 debug 时看到的列表形态也会失真；而且官方示例（insertAt 前后的对比）也用同一格式表达行为规格，格式即合同。"
        },
        {
          "question": "insertAt/removeAt 的官方 Tip 提醒什么？为什么越界要抛 RangeError 而不是静默返回？",
          "answer": "Tip：插入或移除节点时，考虑**对现有节点的影响**——有些节点需要更新它们的 **nextNode 链接**（insertAt 要改前驱的 nextNode；removeAt 要把前驱直接连到后继；在头部操作还要动 head）。抛 RangeError 的理由：越界是**调用方的编程错误**（索引小于 0 或超出 size），静默返回 undefined 会把错误吞掉、让 bug 漂移到更远的地方才爆发；抛错让问题在第一现场显形——官方对 insertAt（低于 0 或高于 size）与 removeAt（低于 0 或大于等于 size）都规定了 RangeError。"
        },
        {
          "question": "环境 Tip 说 Node v22 带来了什么便利？遇到 ESM 语法报错怎么办？",
          "answer": "官方 Tip：**Node v22**（2024 年 10 月成为 LTS）能**自动检测 ES6 模块**并直接运行——不再需要 package.json 的 type 字段或 .mjs 扩展名这类进一步配置。如果你用 ES6 模块遇到「Node 不认识语法」的报错，官方指令：把 Node **升级到最新 LTS 版本**（回指 Foundations 的 installing-node-js 课）。这个项目全程在命令行跑（算法项目无 GUI，上一课已立的规矩），main.js 里 import 你的 LinkedList 即可。"
        }
      ],
      "optional": [
        "官方 Extra credit 挑战 ①：insertAt(index, ...values)——在指定索引一次插入多个新值；索引越界（低于 0 或高于列表 size）抛 RangeError。建议十个基本方法全绿后再做。",
        "官方 Extra credit 挑战 ②：removeAt(index)——移除指定索引的节点；越界（低于 0 或大于等于 size）抛 RangeError。官方 Tip：插入/移除后想清楚哪些节点的 nextNode 链接要重接。"
      ],
      "note": "Project 课（红线课）：examples 为空数组，本站正文只有官方规格中文化 + 实现思路脚手架，不提供任何成品代码——官方正文的代码块（insertAt 行为示例、Test it out 的填充与期望输出）均属需求规格，按文字转述。pop() 的「移除头节点」语义为官方原文明确规定（与数组 pop 的尾部语义不同），本站如实转述、以官方规格为准。环境 Tip 回指 Foundations 的 installing-node-js 课内锚点（站内链接）。四份结构资料（视频/dev.to ×2/web.archive.org 存档的 CMU 图解）按资源清单口径核验。",
      "why": "这是你第一次亲手造数据结构——从「用现成容器」跨进「理解容器怎么实现」：节点、指针、head/tail、链接更新，这些词汇是后面一切结构的通用语。直接受益者排着队：HashMap 项目官方明说每个桶就是一条链表（冲突处理的 chaining 法）；BST 项目的 Node 与链接思想同源；骑士之旅的图遍历也建立在「节点 + 连接」的心智模型上。面试层面，链表是算法题的绝对高频（反转链表、合并有序链表、找环），而「JS 里为什么还要学链表」这道官方自问自答的题，本身就是展示你理解「语言便利与底层原理之别」的好素材。造完它，你看 Map/Set/数组的眼光都会不同——你知道它们底下藏着什么了。",
      "sections": [
        {
          "h": "链表是什么：节点 + 指针的线性集合",
          "p": [
            "官方定位：在计算机科学里，**最基本、最基础的数据结构之一就是链表（linked list）**——它功能上**类似数组**。",
            "主要好处（官方）：相对传统数组，链表的列表元素可以**轻易插入或移除，无需重新分配任何其他元素**；在某些编程语言里，数组的大小是个问题——允许**动态分配数据**的对策之一就是链表。",
            "结构定义（官方）：链表是称为**节点（nodes）**的数据元素的**线性集合**，节点靠**指针（pointer）**「指向」下一个节点；每个节点持有**单个数据元素**与一个到列表中下一节点的**链接或指针**；**头节点（head）**是第一个、**尾节点（tail）**是最后一个。官方示意：**[ NODE(head) ] -> [ NODE ] -> [ NODE(tail) ] -> null**——尾节点的指针指向 null，列表到此为止。"
          ]
        },
        {
          "h": "JS 里还需要链表吗：官方的诚实回答",
          "p": [
            "官方先替你问出实话：**在 JavaScript 里**，数组不受限于特定大小，插入与删除用合适的内建数组方法在任意索引都能轻松完成——你不必操心克服那些限制。**那么，链表真的有必要吗？**",
            "短答案（官方原话）：**看情况（it depends）**。接着是学习理由：**它是动态数据结构里最简单的一个，会给你扎实的基础——让你更容易理解图（graphs）与二叉树（binary trees）这类更复杂的数据结构**。",
            "这个「先承认工程上未必常用、再给出学习价值」的答法本身就是官方课程观的示范：造链表不是为了日常替代数组，是为了拿到读懂一切结构的钥匙——下一课 HashMap 立刻用上（每个桶是一条链表），BST 项目的节点思想同源。"
          ]
        },
        {
          "h": "Assignment 规格：两个骨架、十个方法",
          "p": [
            "骨架（官方）：你需要**两个类或工厂**——**LinkedList**（代表整个列表）与 **Node**（含 **value** 与 **nextNode** 两个属性，默认都设为 **null**）。类还是工厂随你（两种模式你都练过）。",
            "十个方法的官方规格逐条（边界行为全部明文规定）：**append(value)** 加新节点到**末尾**；**prepend(value)** 加到**开头**；**size()** 节点总数；**head()** 第一个节点的**值**（空列表 undefined）；**tail()** 最后一个节点的值（空列表 undefined）；**at(index)** 给定索引节点的值（无则 undefined）；**pop()** **移除头节点**并返回其值（空列表 undefined）；**contains(value)** 在列表中 true 否则 false；**findIndex(value)** 含该值的节点索引（找不到 **-1**；多个匹配返回**第一个**）；**toString()** 字符串表示（空列表**空字符串**；格式 **( value ) -> ( value ) -> ( value ) -> null**）。",
            "边界规定就是验收清单：上一章的测试思维直接复用——每个方法先把官方边界写成断言（空列表、越界、多匹配），再写实现；实现完了对照 Test it out 的期望输出做端到端验收。"
          ]
        },
        {
          "h": "Extra credit：insertAt 与 removeAt",
          "p": [
            "**insertAt(index, ...values)**：在给定索引插入含给定值的新节点——官方示例（文字转述）：已有序列 ( 1 ) -> ( 2 ) -> ( 3 ) -> null，调用 insertAt(1, 10, 11) 后 toString 应输出 ( 1 ) -> ( 10 ) -> ( 11 ) -> ( 2 ) -> ( 3 ) -> null；索引**越界**（小于 0 或大于列表 size）**抛 RangeError**。",
            "**removeAt(index)**：移除给定索引的节点；索引越界（小于 0 或**大于等于**列表 size）**抛 RangeError**。",
            "官方 Extra Credit Tip：**当你插入或移除节点时，考虑它怎么影响现有节点——有些节点需要更新它们的 nextNode 链接**（insertAt 要重接前驱；removeAt 要让前驱跳过被删节点直连后继；在头部操作时 head 也要跟着动）——这句话就是两个方法的全部难点所在。"
          ]
        },
        {
          "h": "环境与验收：Node v22 与 Test it out",
          "p": [
            "环境 Tip（官方）：**Node v22**（2024 年 10 月成为 LTS）能**自动检测 ES6 模块**、无需进一步配置即可运行——用 ESM 遇到「Node 不认识语法」的报错，把 Node 升级到最新 LTS（官方回指 Foundations 的 installing-node-js 课）。",
            "Test it out（官方验收流程）：① 建 **main.js**，导入你的 LinkedList 类或工厂——这里就是测试场；② 创建实例并依次 append：**dog、cat、parrot、hamster、snake、turtle**（官方示例用 class 语法 new LinkedList()，工厂写法自行调整）；③ 文件末尾加 console.log(list.toString()) 并运行；④ 一切正常的话输出应为：**( dog ) -> ( cat ) -> ( parrot ) -> ( hamster ) -> ( snake ) -> ( turtle ) -> null**——官方说想用别的值测也随意。",
            "结构资料四份（官方给在 Assignment 前）：Linked Lists in Plain English（视频）、What's a Linked List, Anyway?（dev.to）、CMU 的多图解详述（web.archive.org 存档）、Are Linked Lists necessary?（dev.to）——最后一份正好接着官方「it depends」的诚实设问往下聊。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "拿数组的 pop 语义实现 pop()",
          "text": "官方规格明文：pop() 移除**头节点**并返回其值（空列表返回 undefined）——不是数组 pop 的尾部语义。想当然按直觉写，Test it out 对不上才发现；本项目一切行为以官方规格为准，动手前先把十条规格读一遍。"
        },
        {
          "title": "插入/移除后忘了重接 nextNode",
          "text": "官方 Extra Credit Tip 点名的坑：insertAt/removeAt 会影响现有节点——前驱的 nextNode 要重接（removeAt 还要让前驱跳过被删节点），头部操作要同步 head。链接漏改的症状是 toString 输出断链或成环——打印出来对照期望格式立刻能看出来。"
        },
        {
          "title": "越界静默返回，而不是抛 RangeError",
          "text": "官方对 insertAt/removeAt 的规定是抛 RangeError——越界是调用方的编程错误，静默返回 undefined 会把 bug 吞掉、漂到更远的地方才爆发。抛错让问题在第一现场显形，这是官方规格里藏的工程设计课。"
        },
        {
          "title": "toString 格式差一个空格，验收对不上",
          "text": "官方格式精确到字符：( value ) -> ( value ) -> null——括号内侧空格、箭头两侧空格、null 收尾、空列表返回空字符串。Test it out 的六动物期望输出是逐字符验收：格式即合同，别自创变体。"
        }
      ],
      "official": {
        "assignment": [
          "官方 Tip（Running ES6 modules in Node）：Node v22（2024 年 10 月成为 LTS）现在能自动检测 ES6 模块并直接运行、无需任何进一步配置。如果你使用 ES6 模块时遇到 Node 不认识语法的报错，把 Node 升级到最新 LTS 版本（官方回指 Foundations 的 installing-node-js 课）。",
          "你需要两个类或工厂：① LinkedList 类/工厂——代表整个列表；② Node 类/工厂——含一个 value 属性和一个 nextNode 属性，两者默认都设为 null。",
          "在你的链表类/工厂里构建下列函数：append(value) 把含 value 的新节点加到列表末尾；prepend(value) 把含 value 的新节点加到列表开头；size() 返回列表节点总数；head() 返回列表第一个节点的值（列表为空返回 undefined）；tail() 返回最后一个节点的值（空列表返回 undefined）；at(index) 返回给定索引节点的值（无该索引节点返回 undefined）；pop() 从列表移除头节点并返回其值（空列表上使用则返回 undefined）；contains(value) 传入值在列表中返回 true 否则 false；findIndex(value) 返回含给定值的节点索引（找不到返回 -1；多个节点匹配时返回第一个匹配节点的索引）；toString() 把你的 LinkedList 对象表示成字符串以便打印预览（空列表返回空字符串；格式应为 ( value ) -> ( value ) -> ( value ) -> null）。",
          "Extra credit ①：insertAt(index, ...values)——在给定 index 插入含给定值的新节点（官方示例：已有序列 ( 1 ) -> ( 2 ) -> ( 3 ) -> null，调用 list.insertAt(1, 10, 11) 后 toString 输出 ( 1 ) -> ( 10 ) -> ( 11 ) -> ( 2 ) -> ( 3 ) -> null）；若以越界索引调用（小于 0 或高于列表 size），抛 RangeError。",
          "Extra credit ②：removeAt(index)——移除给定 index 的节点；给定索引越界（小于 0 或大于等于列表 size）则抛 RangeError。Extra Credit Tip：当你插入或移除节点时，考虑它怎么影响现有节点——有些节点需要更新它们的 nextNode 链接。",
          "Test it out（官方验收）：① 创建 main.js 文件并确保它导入你的 LinkedList 类或工厂——我们在这里测试列表；② 创建 LinkedList 实例并用节点填充它（官方示例用 class 语法：new LinkedList() 后依次 append dog、cat、parrot、hamster、snake、turtle）；③ 文件末尾加 console.log(list.toString()) 并运行；④ 如果一切正常，输出应为 ( dog ) -> ( cat ) -> ( parrot ) -> ( hamster ) -> ( snake ) -> ( turtle ) -> null——想用不同的值测试也随意。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "Extra credit（官方）：insertAt(index, ...values)——在给定索引插入含给定值的新节点（可一次多个值）；索引越界（小于 0 或大于列表 size）抛 RangeError。",
          "Extra credit（官方）：removeAt(index)——移除给定索引的节点；索引越界（小于 0 或大于等于列表 size）抛 RangeError。官方 Tip：插入或移除节点时考虑对现有节点的影响——有些节点需要更新 nextNode 链接。"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/computer_science/project_linked_lists.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "63f9d3eb23e05ea8220e74a2c53a40dde1e23e444df1529ec6a99ccef94f9228",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "javascript-hashmap-data-structure",
      "title": "HashMap Data Structure",
      "zh": "HashMap 数据结构",
      "group": 5,
      "url": "https://www.theodinproject.com/lessons/javascript-hashmap-data-structure",
      "summary": "跨语言最常用数据结构的原理课，也是下一个项目的理论地基。官方定义：**hash map 接收键值对（key value pair）、生成一个散列码（hash code）、把这对数据存进一个桶（bucket）**——它类似传统数组，但用「键」当索引而不是无意义的顺序编号，因此**按键查找的速度很快**；如果你用过 JS 对象字面量 {}、Set 或 Map，你就用过基于 hash table 的结构。**散列码**：散列 = 输入进、对应输出出；散列函数应是**纯函数**——同一输入永远返回同一散列码、无随机成分；散列与加密（ciphering）的关键差别是**可逆性**：散列是单向过程（\"Carlos\"→\"C\" 不可逆，Carla/Carrot 也是 C）；Tip：散列很适合安全场景——存密码的散列而非明文，偷走散列也还原不出密码。**桶**：可把数组的每个索引视为一个桶——散列函数返回的数字就是存这对键值的数组索引；取值四步（散列键算索引 → 桶不空则进去 → 比较节点的键与查询键 → 相同返回值否则 null）；**为什么要比较键**：散列码只是位置，不同键可能生成相同散列码。**插入顺序不保证**：散列码到索引的转换不线性、不可预测——迭代频繁就别用 hash map、用数组（JS 的 Map 是保序实现的例外）。**冲突（collisions）**：两个不同键生成完全相同的散列码、落进同一个桶——\"Sara\" 与 \"raSa\" 字符相同顺序不同就是例子；改进：乘质数 31 的 stringToNumber（hashCode = primeNumber * hashCode + charCodeAt）让位置参与散列；Tip：质数能降低散列码被桶长度整除的可能、帮助最小化冲突；冲突无法根除（桶有限）只能最小化；处理法：**每个桶变成一条链表**——空桶插头节点、有头则顺着链表加到末尾。**增长（growth）**：桶数组从小开始（官方用 16——Tip：多数语言默认 16，因为它是 2 的幂、利于位操作性能技巧）；大散列码用**模运算 %** 落进 0–15；节点多于桶必然冲突（鸽笼原理）；增长 = 建双倍大小新数组、把所有节点重新散列复制过去；何时增长：跟踪 **capacity**（桶总数）与 **load factor**（各语言实现用 0.75–1）——两者乘积是阈值，条目数超过就增长（16 × 0.8 = 12.8 → 第 13 条时增长）；设太低空桶耗内存、太高冲突堆积。**计算复杂度**：插入/检索/移除平均 **O(1)**（用数组索引做操作）；最坏 **O(n)**（全部数据散列到同一个桶——复杂度来自遍历链表再插一个节点，正是冲突所致）；增长操作恒为 **O(n)**。Assignment 一条：CS50 讲「用桶实现 hash map」的视频。Additional resources 三条：质数在散列函数中用法的讨论（stackoverflow）、鸽笼原理（维基）、samwho.dev 的 Hashing 深入理解。",
      "guide": "以下是官方原课的中文化梳理。这一课是「原理 → 项目」的标准前置：下一个项目（Project: HashMap）的每个方法规格都建立在本课概念上——hash(key) 的实现官方直接回指本课的质数版 stringToNumber，set 的「同键覆盖 vs 异键冲突」之分、增长逻辑的 capacity/load factor 也全在本课定义。四段官方原文的代码演进是主线（示例区收录官方原码）：charAt(0) 单首字母 → 双首字母 → 全字符求和 stringToNumber → 乘质数 31 的改进版——每一版都在解决上一版暴露的问题（撞车太多 → 分布不均 → 顺序不同散列相同），跟着这条演进线读，散列函数的设计直觉自然长出来。三个容易滑过的要点值得停留：① 「取值为什么还要比较键」——散列码只是位置，位置相同不等于键相同；② 插入顺序不保证——官方给了 Mao/Zach/Xari 的例子，并点明 JS 的 Map 是保序实现（本项目要造的是**无序**版）；③ 最坏 O(n) 的来源——全部数据挤进一个桶时，操作退化成遍历该桶的链表。鸽笼原理（Additional resources）回答「为什么冲突必然发生」：节点数超过桶数，必有桶住两个以上节点——数学保证，与散列函数好坏无关。复杂度一段与 time-complexity 课直接接轨：平均 O(1) 与最坏 O(n) 的区分正是「Big O 度量最坏情形」的活教材。",
      "understand": [
        "官方开篇定位：**hash table（又名 hash map）是跨编程语言最常用的数据结构之一**；它类似传统数组，但用**「键」当索引**而不是对值的无意义顺序编号——这样组织数据，**按键的查找速度很快**",
        "官方拉近距离：如果你用过 JavaScript 对象字面量（{}）、**Set** 或 **Map**，你就已经用过**基于 hash table 的结构**——本课回答它们内部怎么工作、键值对怎么存下来又怎么取回",
        "一句话描述（官方）：**hash map 接收键值对、生成散列码、把这对数据存进桶里**——散列码（hash codes）？桶（buckets）？本课逐个讲透，下个项目亲手实现",
        "什么是散列码（官方）：散列 = **拿一个输入、生成对应的输出**；散列函数应当是**纯函数**——同一输入散列**永远返回同一散列码**、不应有随机生成成分；官方起步例子：取名字首字母的 hash 函数（name.charAt(0)）",
        "散列与加密的关键差别（官方）：**可逆性（reversibility）——散列是单向过程**：\"Carlos\" 散列成 \"C\"，但从 \"C\" 无法还原——可能是 Carlos、也可能是 Carla 或 Carrot，无从知道",
        "官方 Tip「散列的好处」：散列**非常适合安全**——给定密码，你可以存**密码的散列**而非明文；就算有人偷走你的散列，也无法知道原密码——因为他们无法把散列逆转回密码",
        "散列函数的三轮演进（官方 Use cases 的学校文件夹例子）：单首字母（C 目录爆炸）→ **名+姓双首字母**（\"Carlos Smith\"→\"CS\"，摊开更多目录、消除大量重复）→ **stringToNumber 全字符求和**（把整个名字转成数字）——官方解释为什么不干脆用整个名字当散列码：那样确实唯一，但 **hash map 语境里散列码必须是数字**——这个数字将充当**存储键值对的桶的索引**",
        "**桶（buckets）**（官方）：桶是存元素所需的存储——可以把**数组的每个索引视为有一个桶**；对特定键，散列函数决定用哪个桶：返回的数字就是存这对键值的数组索引",
        "官方存值示范（Fred/Smith）：① 把 \"Fred\" 传进散列函数得散列码 **385**；② 找到索引 385 的桶；③ 把键值对存进那个桶（键 \"Fred\"、值 \"Smith\"）；若该桶已有同键 \"Fred\" 的条目？**比较键**确认是同一项，然后**用新值覆盖旧值**——官方点题：**这就是 Set 里只能有唯一值的原理**；Set 类似 hash map，关键差别（官方双关 pun intended）是 Set 的节点**只有键、没有值**",
        "官方取值四步：① 散列键、算出桶的索引；② 桶不空则进入该桶；③ 比较节点的键与用于检索的键是否相同；④ 相同则返回节点的值，否则返回 **null**",
        "为什么要比较键（官方自问自答）：我们已经找到桶的索引了为什么还要比键？记住——**散列码只是位置；不同的键可能生成相同的散列码**：必须比较桶内的两个键才能确认键相同。做到这里，你就有了带 **has、set、get** 的 hash map",
        "**插入顺序不保证**（官方专节）：hash map 迭代时**不保证插入顺序**——散列码到索引的转换**不遵循从头到尾的线性推进**，而是更不可预测、与插入顺序无关；取出键值数组迭代时，顺序不会是插入顺序",
        "官方补充：有些库实现 hash map 时顾及插入顺序——比如 **JavaScript 自己的 Map**；但接下来的项目要实现的是**无序（unordered）hash map**。官方例子：按序插入 Mao、Zach、Xari，迭代器可能返回 [\"Zach\", \"Mao\", \"Xari\"]；结论：**频繁迭代 hash map 是目标的话，这个数据结构不适合——简单数组更好**",
        "**冲突（collisions）**（官方定义）：**两个不同的键生成完全相同的散列码**——散列码相同，它们就落进同一个桶。官方例子：\"Sara\" 与 \"raSa\" 散列相同——两个名字字母相同、只是排列不同（全字符求和的盲区）",
        "官方改进（乘质数版 stringToNumber，原码见示例区）：hashCode = primeNumber * hashCode + string.charCodeAt(i)（primeNumber = 31）——每轮迭代**乘旧散列再加字符码**，字母位置开始参与散列：\"Sara\" 与 \"raSa\" 得到不同散列码",
        "官方 Tip「最小化冲突」：注意用了**质数**——其实选任何数都行，但质数更可取：**乘以质数会降低散列码被桶长度整除的可能性，帮助最小化冲突的发生**",
        "冲突无法根除（官方）：就算改进了散列函数，冲突的可能性**永远存在**——桶的数量有限，**没有办法完全消除冲突**，只能尽量最小化",
        "处理冲突（官方）：到目前为止 hash map 是一维结构——如果桶里的每个 Node 能存不止一个值呢？**请出链表（Linked Lists）：每个桶将是一条链表**——往桶里插入时：桶空则插为链表头；桶里已有头，则顺着链表加到**末尾**。官方点题：到这你大概理解了为什么必须写好散列函数、尽量消除冲突；实际工作里你多半不会亲手写散列函数（语言内建），但**理解散列函数怎么工作很重要**",
        "**增长（growth）**（官方）：内存不无限、桶不能无限多；起步太大也浪费内存（hash map 里只有一个值时）——所以**从小数组开始：官方用大小 16**",
        "官方 Tip「初始大小」：多数编程语言默认 **16**，因为它是 **2 的幂**——有助于一些需要**位操作**索引的性能技巧",
        "大散列码怎么落进 16 个桶（官方）：用**模运算 %**——任何数模 16 得 0 到 15 之间的数；官方配了 \"Manon\" 的散列 + 取模示意图（找它落进哪个桶）",
        "冲突随规模必然化（官方）：不断往桶里加节点，冲突越来越可能；最终**节点数会超过桶数——这保证冲突发生**（好奇为什么的话看 additional resources——鸽笼原理）；理想世界每个桶只有 0 或 1 个节点——所以**增长桶数组**：创建一个**双倍大小**的新数组，把所有现有节点**复制**过去、**把它们的键重新散列**",
        "何时增长（官方）：hash map 类需要跟踪两个新字段——**capacity**（当前桶的总数）与 **load factor**（起始时赋给 hash map 的数，决定何时增长桶数组；**各语言实现的 load factor 在 0.75 与 1 之间**）；两数之积给出一个数——**hash map 里的条目数超过它就增长**：官方例子 16 桶 × 0.8 = 12.8 → **第 13 条**时增长；设太低：空桶太多、耗内存；设太高：数组重定尺寸前桶里冲突堆积",
        "**计算复杂度**（官方）：hash map 的插入、检索、移除操作**非常高效**——因为我们用**数组索引**做这些操作；平均情形 **O(1)**（前提：hash map 写得好）；**最坏 O(n)**——发生在**所有数据散列到完全相同的桶**时：复杂度来自链表——遍历链表往同一个桶里再插一个节点，这正是冲突所致；**增长操作的复杂度恒为 O(n)**"
      ],
      "terms": [
        {
          "en": "Hash map / Hash table（哈希表）",
          "zh": "接收键值对、生成散列码、把数据存进桶的结构——跨语言最常用；JS 的对象字面量、Set、Map 都基于它"
        },
        {
          "en": "Hash code（散列码）",
          "zh": "散列函数对键生成的数字——充当存储键值对的桶的索引；同输入永远同输出（纯函数），单向不可逆"
        },
        {
          "en": "Bucket（桶）",
          "zh": "存元素的存储位——可视为数组的每个索引一个桶；冲突处理下每个桶是一条链表"
        },
        {
          "en": "Collision（冲突）",
          "zh": "两个不同键生成完全相同的散列码、落进同一桶——桶有限所以无法根除，只能最小化（好散列函数）+ 处理（链表 chaining）"
        },
        {
          "en": "Load factor（负载因子）",
          "zh": "决定何时增长桶数组的数（各语言实现取 0.75–1）：capacity × load factor = 条目阈值，超过就双倍扩容并重新散列"
        },
        {
          "en": "Capacity（容量）",
          "zh": "当前桶的总数——官方起步 16（2 的幂利于位操作）；增长即翻倍"
        },
        {
          "en": "Pigeonhole principle（鸽笼原理）",
          "zh": "节点数超过桶数时必然有桶住多个节点——「冲突必然发生」的数学保证（Additional resources 维基条目）"
        },
        {
          "en": "Prime multiplier（质数乘数）",
          "zh": "散列函数里乘质数（官方用 31）：降低散列码被桶长度整除的可能、让字母位置参与散列——最小化冲突的经典手法"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：跟着散列函数三轮演进（首字母 → 双首字母 → 求和 → 乘质数）走一遍，每一版解决什么问题要能自己说出来",
        "看 CS50 讲「用桶实现 hash map」的视频（Assignment 唯一一条，视频不声称有中文字幕）：把正文的桶机制看一遍动态演示",
        "读 stackoverflow 上「质数在散列函数中的用法」讨论（Additional resources：Java 的 String hashCode 为什么用 31 当乘数）——正文质数 Tip 的深入版",
        "读维基鸽笼原理条目（Additional resources）：从数学上理解「节点多于桶必然冲突」——增长机制为什么必须存在",
        "看 samwho.dev 的 Hashing（Additional resources）：想对散列函数有更好的基础理解再读——含散列分布的可视化",
        "自检练习：用官方质数版 stringToNumber 手算 \"Sara\" 与 \"raSa\" 的散列码（不写代码、纸上按公式走），验证它们确实不同——再想想为什么旧的求和版会相同",
        "预读下一课 Project: HashMap 的方法清单（hash/set/get/has/remove/length/clear/keys/values/entries）：对照本课概念给每个方法标出它依赖的机制（散列、桶、冲突链表、增长）——项目动手时会快很多"
      ],
      "quiz": [
        {
          "question": "hash map 与「用数组存数据」的本质区别是什么？为什么它的按键查找快？",
          "answer": "官方定义：hash map 类似传统数组，但用**「键」当索引**而不是对值的无意义顺序编号——存 \"Fred\"/\"Smith\" 时，散列函数把键变成数字（385），这个数字直接充当桶的数组索引。快的原因：查找不用遍历比对每个元素（那是 O(n)），而是**散列键 → 算出索引 → 直达桶**——数组按索引访问是 O(1)，所以插入/检索/移除平均 O(1)（官方复杂度节的结论）。你天天在用的 JS 对象字面量、Set、Map 底下就是这套机制。"
        },
        {
          "question": "散列与加密（ciphering）的关键差别是什么？官方给的密码例子怎么利用这个差别？",
          "answer": "关键差别是**可逆性**：加密可逆（有密钥能还原），**散列是单向过程**——\"Carlos\" 散列成 \"C\" 后无法从 \"C\" 还原（可能是 Carlos、Carla 或 Carrot）。密码例子（官方 Tip）：存**密码的散列**而非明文——就算攻击者偷走全部散列，也无法逆转回原密码；验证时把用户输入再散列一遍比对散列码即可，全程不需要知道原密码。「不可逆」从缺陷变成了安全特性。"
        },
        {
          "question": "取值时已经用散列码定位到了桶，为什么官方还要「比较节点的键」？",
          "answer": "官方自问自答：**散列码只是位置——不同的键可能生成相同的散列码**（冲突）。定位到桶只说明「如果这个键在，它就在这」，不说明桶里住的就是它：桶里可能住着冲突的别的键（\"Sara\" 的桶里可能有 \"raSa\"）。所以必须比较桶内节点的键与查询键——相同才返回值，否则返回 null。跳过比键的实现会把冲突键的值张冠李戴——这是 HashMap 项目里 set/get 规格反复强调「同键覆盖、异键共存」的原因。"
        },
        {
          "question": "冲突为什么无法完全消除？官方的处理方案是什么？load factor 与增长怎么配合？",
          "answer": "无法消除的原因：桶的数量**有限**而键的空间无限——鸽笼原理保证节点数超过桶数时必有桶住多个节点（Additional resources 的数学根据），再好的散列函数也只能最小化、不能根除。处理方案：**每个桶变成一条链表**——插入时空桶插头节点、已有头则顺链表加到末尾（chaining）。增长配合：跟踪 **capacity**（桶总数，起步 16）与 **load factor**（0.75–1）——乘积是阈值（16 × 0.8 = 12.8 → 第 13 条触发），超过就建**双倍大小**新数组、把所有节点**重新散列**复制过去（这一步恒为 O(n)）；太低浪费内存、太高冲突堆积——扩容就是在两者间维持平衡。"
        },
        {
          "question": "hash map 的平均 O(1) 与最坏 O(n) 分别发生在什么条件下？「插入顺序不保证」对使用有什么实际影响？",
          "answer": "官方条件：平均 **O(1)** 的前提是「hash map 写得好」——散列分布均匀，插入/检索/移除都靠数组索引直达；最坏 **O(n)** 发生在**所有数据散列到完全相同的桶**——操作退化为遍历该桶的链表（再插入还要走到链尾），这正是冲突所致。顺序问题的实际影响（官方）：散列码到索引的转换不线性、不可预测——按序插入 Mao、Zach、Xari，迭代可能返回 [\"Zach\", \"Mao\", \"Xari\"]；所以**频繁迭代是目标的话别用 hash map、用简单数组**；要保序的 map 用 JS 的 Map（官方点名它是顾及插入顺序的实现）——下一课项目要造的正是无序版。"
        }
      ],
      "optional": [],
      "note": "本课官方原文含两张示意图（cdn.statically.io 托管：双首字母散列示例、\"Manon\" 散列+取模示例）——本站按既有口径不内嵌官方外链图片，图的内容已在正文文字转述（散列函数演进与「散列码 % 16 落桶」的推演）。四段官方代码（hash 三轮演进 + 质数版 stringToNumber）收进示例区。Additional resources 三条（stackoverflow 质数讨论/维基鸽笼原理/samwho.dev Hashing）按资源清单口径登记核验。Assignment 仅一条（CS50 视频）。下一课 Project: HashMap 的 hash(key) 规格官方直接回指本课质数版实现。",
      "why": "这一课解释的是你每天都在用的魔法：JS 对象字面量、Set、Map 的 O(1) 存取不是理所当然——底下是散列码、桶、冲突链表与负载因子增长这一整套机制。理解了它，三件事随之改变：① 你懂了自己代码的性能——为什么对象键查找快、为什么频繁迭代别用 map 类结构、为什么 Map 保序而自造 hash map 不保序；② 你能读懂下一课项目的每条规格——hash 的取模、set 的同键覆盖异键冲突、增长的阈值触发，全是本课概念的落地；③ 面试里「HashMap 怎么工作」「冲突怎么处理」「为什么容量是 2 的幂」这类高频题，你有一手答案而不是背来的段子。安全视角（密码存散列）与数学视角（鸽笼原理）则是额外的纵深：一个数据结构课同时给你工程、安全、数学三面镜子。",
      "sections": [
        {
          "h": "hash map 是什么：键当索引的数组",
          "p": [
            "官方开篇：**跨编程语言最常用的数据结构之一就是 hash table（又名 hash map）**。它类似传统数组，区别在索引：数组用**无意义的顺序编号**，hash map 用**「键」**——这样组织数据，我们获得**结构中按键的快速查找速度**。",
            "官方拉近距离：如果你用过 JavaScript 对象字面量（{}）、Set 或 Map，**你就用过基于 hash table 的结构**——但它们内部怎么工作？键值对怎么存下来、之后又怎么取回？本课讲透，下个项目你亲手实现一个。",
            "先给一句话描述（官方）：**hash map 接收键值对、生成一个散列码、把这对数据存进一个桶里**。散列码？桶？官方说别慌（Don't fret）——这些概念本课全部讲到。"
          ]
        },
        {
          "h": "散列码：纯函数、单向、必须是数字",
          "p": [
            "什么是散列（官方）：**拿一个输入、生成对应的输出**。散列函数应当是**纯函数**：同一输入散列**永远返回同一散列码**、不应有随机生成成分。官方起步例子（原码见示例区）：取名字首字母——hash(\"Carlos\") 得 \"C\"。",
            "散列与加密的关键差别（官方）：**可逆性——散列是单向过程**。从 \"Carlos\" 能散列出 \"C\"，但从 \"C\" **不可能**还原：可能是 Carlos、也许是 Carla 或 Carrot——无从知道。",
            "官方 Tip「散列的好处」：散列**非常适合安全**——给定密码，你可以存**密码的散列**而非明文；有人偷走你的散列也无法知道原密码——无法把散列逆转回密码。",
            "散列函数的三轮演进（官方 Use cases：学校按首字母分文件夹）：**单首字母**——C 开头的人太多，C 目录爆炸而其他目录空着；**双首字母**（名+姓，\"Carlos Smith\"→\"CS\"，原码见示例区）——摊开更多目录、消除大量重复散列码，但常见首字母组合仍然失衡；**stringToNumber 全字符求和**（原码见示例区）——不再只看首字母，把整个名字逐字符 charCodeAt 转成数字相加。",
            "官方自问：干脆把整个名字存成散列码不是更好？确实会更唯一——**但在 hash map 的语境里，散列码需要是数字**：这个数字将充当**存储键值对的桶的索引**。"
          ]
        },
        {
          "h": "桶：存取键值对的现场",
          "p": [
            "官方定义：**桶是存储我们元素所需的存储**——可以把**数组的每个索引视为有一个桶**。对特定键，散列函数决定用哪个桶：**返回的数字就是存这对键值的数组索引**。",
            "存值示范（官方 Fred/Smith 三步）：① 把 \"Fred\" 传进散列函数得散列码 **385**；② 找到索引 **385** 的桶；③ 把键值对存进去（键 \"Fred\"、值 \"Smith\"）。",
            "同键怎么办（官方）：索引 385 的桶里已有键 \"Fred\" 的条目？**比较键**确认是同一项，然后**用新值覆盖旧值**——官方点题：**这就是 Set 里只能有唯一值的原理**。Set 类似 hash map，关键差别（官方还玩了个双关 pun intended）：Set 的节点**只有键、没有值**。",
            "取值四步（官方）：① 散列键、算出桶的索引；② 桶不空则进入该桶；③ 比较节点的键与检索用的键；④ 相同返回节点的值，否则返回 **null**。**为什么找到了桶还要比键**：散列码只是位置——**不同的键可能生成相同的散列码**，必须比较桶内的键确认。官方收尾：做到这里，你就得到了带 **has、set、get** 的 hash map——正是下一课项目的方法清单雏形。",
            "**插入顺序不保证**（官方专节）：迭代 hash map 时顺序**不是插入顺序**——散列码到索引的转换不线性、不可预测。官方例子：按序插入 Mao、Zach、Xari，迭代器可能返回 [\"Zach\", \"Mao\", \"Xari\"]。有些库顾及插入顺序（**JavaScript 自己的 Map** 就是），但下一课项目实现的是**无序** hash map。官方结论：**频繁迭代是目标的话，hash map 不是对的选择——简单数组更好**。"
          ]
        },
        {
          "h": "冲突：必然发生，只能最小化与处理",
          "p": [
            "官方定义：**冲突（collision）= 两个不同的键生成完全相同的散列码**——散列码相同，它们落进同一个桶。例子：\"Sara\" 与 \"raSa\"——字母相同、排列不同，求和版 stringToNumber 给出相同结果。",
            "改进（官方原码见示例区）：让**位置**参与散列——每轮迭代 **hashCode = primeNumber * hashCode + string.charCodeAt(i)**（primeNumber = 31）：乘旧散列再加字符码，\"Sara\" 与 \"raSa\" 从此不同。",
            "官方 Tip「最小化冲突」：为什么是**质数**？选任何数都行，但质数更可取——**乘以质数会降低散列码被桶长度整除的可能性，帮助最小化冲突的发生**。",
            "但官方把话说死：就算改进了散列函数，冲突的可能性**永远存在**——桶的数量有限，**没有办法完全消除冲突**，只能最小化。（Additional resources 给了数学根据：**鸽笼原理**——节点多于桶时，必然有桶住多个节点。）",
            "处理冲突（官方）：目前 hash map 还是一维的——如果桶里的每个 Node 能存不止一个值呢？**请出链表：每个桶将是一条链表**。插入时：桶空则插为链表头；已有头则顺着链表加到**末尾**——这正是上一课链表项目的直接应用。官方点题：现在你理解了为什么必须写好散列函数；实际工作里你多半不会亲手写散列函数（语言内建），但**理解它们怎么工作很重要**。"
          ]
        },
        {
          "h": "增长：capacity、load factor 与翻倍重散列",
          "p": [
            "官方问题：内存不无限，桶不能无限多；但起步太大也浪费（hash map 里只有一个值时）——解法：**从小数组开始，官方用大小 16**。Tip：**多数编程语言默认 16——它是 2 的幂，有助于一些需要位操作索引的性能技巧**。",
            "散列函数生成 20353924 这样的大数怎么落进 16 个桶？**模运算 %**：任何数模 16 得 0–15（官方配了 \"Manon\" 的散列+取模示意图）。",
            "增长的必然性（官方）：不断加节点，冲突越来越可能；最终**节点数超过桶数——保证冲突发生**（鸽笼原理）。理想世界每桶只有 0 或 1 个节点——所以要**增长桶数组**：创建**双倍大小**的新数组，把所有现有节点**复制**过去、**把键重新散列**。",
            "何时增长（官方）：hash map 类要跟踪两个新字段——**capacity**（当前桶总数）与 **load factor**（起始设定的数，决定何时增长；**各语言实现取 0.75 到 1 之间**）。**两者之积 = 阈值**：条目数超过就增长——官方例子：16 桶 × 0.8 = 12.8 → **第 13 条**时增长。设太低：空桶太多耗内存；设太高：重定尺寸前冲突大量堆积。"
          ]
        },
        {
          "h": "计算复杂度：平均 O(1)，最坏 O(n)",
          "p": [
            "官方结论：hash map 的**插入、检索、移除非常高效**——因为我们用**数组索引**做这些操作；写得好（散列分布均匀）的前提下，三个操作的**平均情形复杂度都是 O(1)**。",
            "**最坏情形 O(n)**（官方条件）：所有数据散列到**完全相同的桶**——复杂度来自链表：遍历链表往同一个桶里再插一个节点，正是冲突所致。（time-complexity 课的「Big O 度量最坏情形」在这里有了活教材。）",
            "官方补一句：**增长操作的复杂度恒为 O(n)**——翻倍扩容要把所有节点重新散列复制一遍；这也解释了为什么 load factor 不能设太低：增长太频繁，O(n) 的扩容成本就摊不掉。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "javascript",
          "code": "function hash(name) {\n  return name.charAt(0);\n}",
          "note": "官方起步例子原码：取名字首字母的散列函数——我们第一个基础散列函数。缺陷在学校文件夹例子里立刻显形：C 开头的人太多，C 目录爆炸而其他目录空着——引出双首字母版。"
        },
        {
          "lang": "javascript",
          "code": "function hash(name, surname) {\n  return name.charAt(0) + surname.charAt(0);\n}\n\n// 改进二：整个名字转数字（求和版）\nfunction stringToNumber(string) {\n  let hashCode = 0;\n  for (let i = 0; i < string.length; i++) {\n    hashCode += string.charCodeAt(i);\n  }\n\n  return hashCode;\n}\n\nfunction hash(name, surname) {\n  return stringToNumber(name) + stringToNumber(surname);\n}",
          "note": "官方演进二、三原码：双首字母（\"Carlos Smith\"→\"CS\"，摊开更多目录、消除大量重复）仍有常见组合失衡问题；求和版不再只看首字母、把整个名字转成数字——但埋着新盲区：字母相同顺序不同的键（\"Sara\"/\"raSa\"）散列相同。"
        },
        {
          "lang": "javascript",
          "code": "function stringToNumber(string) {\n  let hashCode = 0;\n\n  const primeNumber = 31;\n  for (let i = 0; i < string.length; i++) {\n    hashCode = primeNumber * hashCode + string.charCodeAt(i);\n  }\n\n  return hashCode;\n}",
          "note": "官方冲突改进版原码：每轮迭代乘质数 31 再加字符码——字母的位置开始参与散列，\"Sara\" 与 \"raSa\" 得到不同散列码。官方 Tip：质数能降低散列码被桶长度整除的可能、帮助最小化冲突。下一课 Project: HashMap 的 hash(key) 规格官方直接回指这一版。"
        }
      ],
      "pitfalls": [
        {
          "title": "以为定位到桶就等于找到了键",
          "text": "散列码只是位置：不同键可能生成相同散列码（冲突）。取值四步里「比较节点的键」不可省——跳过比键，冲突桶里的值就会张冠李戴。官方在取值与 Set 唯一性两处都强调了这一点。"
        },
        {
          "title": "以为好散列函数能根除冲突",
          "text": "官方把话说死：桶有限，没有办法完全消除冲突——鸽笼原理保证节点多于桶时必然撞桶。正确心态是最小化（质数乘、分布均匀）+ 处理（每桶一条链表）+ 增长（负载因子触发翻倍重散列），三件套缺一不可。"
        },
        {
          "title": "拿 hash map 当有序容器用",
          "text": "官方专节：插入顺序不保证——散列码到索引的转换不线性、不可预测（Mao/Zach/Xari 插入，可能 Zach 先出来）。频繁迭代或需要顺序就用简单数组；要保序的 map 用 JS 的 Map（官方点名它是顾及插入顺序的实现）。"
        },
        {
          "title": "load factor 拍脑袋设极端值",
          "text": "官方给了两头代价：设太低——空桶太多、内存浪费且增长（恒为 O(n)）太频繁；设太高——重定尺寸前冲突大量堆积、操作向最坏 O(n) 退化。各语言实现取 0.75–1 之间不是巧合，是内存与冲突的平衡点。"
        }
      ],
      "official": {
        "assignment": [
          "看 CS50 的这支视频：它解释「用桶实现 hash map」的概念（hash maps using buckets，YouTube）。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/computer_science/hash_map_data_structure.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "527a17aa528548d9ebcbfb2131fec9ed76b2a4dca3b69934d16831e796a3c7b8",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "javascript-hashmap",
      "title": "Project: HashMap",
      "zh": "项目：HashMap",
      "group": 5,
      "url": "https://www.theodinproject.com/lessons/javascript-hashmap",
      "summary": "把上一课的全部概念亲手装进一个类：**你已经知道 hash map 的魔法，现在轮到你写自己的实现**。官方先立一条地基规则（Limitation 专节）：JavaScript 数组的动态天性允许我们插入或检索超出数组大小范围的索引——比如用大小 16 的数组当桶，没有任何东西阻止你往索引 500 存东西；**这会破坏 hash map 限制存储大小的本意**，所以必须强制约束：**凡是通过索引访问桶的地方，都要先做越界检查、越界即抛错**（官方给了检查条件：索引小于 0 或大于等于 buckets.length 时 throw new Error）。Assignment 规格：创建 HashMap 类或工厂，至少两个属性 **load factor** 与 **capacity**——load factor 0.75 对应初始 capacity 16；十个方法：**hash(key)**（接收字符串键产出散列码——官方重申上一课的质数 31 版实现可直接用；两条警告：返回前必须把散列码对当前 capacity 取模；长键可能超出最大安全整数导致计算不准，稳妥做法是**循环内每次迭代都取模**而不是循环完只取一次；另提醒别把键与散列码搞混——桶只能用散列码访问）、**set(key, value)**（同键覆盖旧值；官方强调：两个**不同**键生成相同散列码进同一桶是**冲突不是更新**——Rama 与 Sita 都散列到 3 就同住一桶互不覆盖；超过 load factor 要增长桶至双倍容量——官方建议可以晚点实现，后面的方法能帮你处理增长逻辑）、**get(key)**（找不到返回 undefined）、**has(key)**（布尔）、**remove(key)**（在则移除返回 true、不在返回 false）、**length()**（存储的键数）、**clear()**（移除全部条目）、**keys()** / **values()** / **entries()**（分别返回所有键/所有值/[键,值] 对的数组）。官方提醒：本 hash map **不保留插入顺序**——键值乱序出现是正常且预期的。Test your hash map 官方给了完整流程：load factor 设 0.75 → 用官方 12 组 set（apple/red 到 lion/golden）填满至恰好 0.75 → 满员时试覆盖（只改值不加节点，length 与 capacity 不变）→ set('moon', 'silver') 第 13 条触发增长、capacity 翻倍 → 扩容后负载应远低于 load factor、条目均匀散布 → 再试覆盖 → 把 get/has/remove/length/clear/keys/values/entries 全测一遍确认扩容后依然正常。Extra credit：HashSet 类或工厂——行为与 HashMap 相同但**只有键、没有值**。",
      "guide": "以下是官方原课的中文化梳理（Project 课：本站不提供成品代码，examples 为空数组——官方正文的代码块是越界检查片段、重申的 hash 函数与测试 set 调用，均属规格与已教内容，按文字转述）。这个项目是「原理课 → 实现」的标准闭环，上一课的每个概念都对应明确的代码职责：散列函数（质数 31 版，官方说可直接复用）、桶数组（起步 16）、冲突链表（上一课链表项目的 Node 思想直接上阵）、load factor 触发增长（capacity 翻倍 + 全部重新散列）。动手顺序建议按官方留的口子来：官方明说 set 的增长行为「可以留到后面实现」——所以第一轮先把 hash/set（无增长版）/get/has/remove/length/clear/keys/values/entries 全跑通（容量固定在 16、条目控制在 12 以内），第二轮再补增长逻辑，然后完整走官方 Test your hash map 的七步流程验收——那个流程本身就是精心设计的测试脚本：12 组填满（恰好 0.75）→ 覆盖不加节点 → 第 13 条触发翻倍 → 负载下降、分布均匀 → 扩容后全方法回归。三个官方警告值得贴在屏幕边：① 散列码返回前必须对 capacity 取模（不然索引 385 落不进 16 个桶）；② 长键会超出 Number.MAX_SAFE_INTEGER 导致散列计算不准——稳妥做法是循环内每次迭代都取模；③ 键与散列码别搞混——用户给的是键，桶只认散列码。set 的规格里藏着上一课的核心区分：同键 = 覆盖（更新），异键同桶 = 冲突（共存）——判断依据是比较键而不是比较散列码。Extra credit 的 HashSet 正好呼应上一课 Set 的「只有键没有值」定义。",
      "understand": [
        "官方开题：你已经知道 hash map 的魔法——**现在轮到你写自己的实现**",
        "**Limitation 专节**（官方地基规则）：JavaScript 数组的动态天性允许插入或检索**超出数组大小范围**的索引——大小 16 的桶数组，没有东西阻止你往索引 500 存东西；**这会破坏 hash map 限制存储大小的本意**，所以需要强制约束",
        "官方约束（原文规格）：**凡是通过索引访问桶的地方**都用越界检查——索引小于 0 或大于等于 buckets.length 时**抛出错误**（\"Trying to access index out of bounds\"）",
        "骨架要求：创建 **HashMap 类或工厂函数**（二选一随你）；至少两个属性/变量：**load factor** 与 **capacity**——官方给定起步值：**load factor 0.75、初始 capacity 16**",
        "**hash(key)**：接收字符串键、产出散列码（官方注明：真实世界的 hash map 能容纳数字甚至对象等各种键类型，本项目保持简单只收字符串）；上一课的质数 31 版实现官方原样重贴——可直接用，也可自行研究散列算法（官方警告：那是很深很深的兔子洞）",
        "hash 的两条官方警告：① 要得到装得进桶的索引（无论增长与否），**返回前必须把散列码对当前 capacity 取模（%）**；② 边界情形——**非常长的键可能超出最大安全整数**（Number.MAX_SAFE_INTEGER，官方给 MDN 链接）导致计算不准——稳妥做法是**在循环的每次迭代都对当前 capacity 取模**，而不是循环结束后只取一次",
        "官方的概念纠偏：之后存取键值对时你可能会**把键与散列码搞混**——键是用户提供的、传进散列函数的字符串；散列码是函数返回的数字。**你永远不会用键直接访问桶——只用散列码**",
        "**set(key, value)**：键已存在则**旧值被新值覆盖**；官方强调的区分：两个**不同**键生成相同散列码、进同一个桶——那是**冲突，不是更新**（例：Rama 与 Sita 都散列到 3——同住一桶、互不覆盖；键不同就是冲突）；需要时回看上一课的冲突（collisions）节",
        "set 的增长职责（官方）：**超过 load factor 时把桶增长到双倍容量**——官方明说后面的方法能帮你处理增长逻辑，所以**这一行为可以留到后面实现**",
        "**get(key)**：返回键关联的值——**键不存在返回 undefined**；**has(key)**：键在不在 hash map 里——返回布尔",
        "**remove(key)**：键在则移除该条目并返回 **true**；不在则返回 **false**；**length()**：返回存储的**键**的数量；**clear()**：移除 hash map 的全部条目",
        "**keys() / values() / entries()**：分别返回含全部**键**（不含值）的数组、全部**值**（不含键）的数组、每个键值对各自成数组的数组（官方示例形态：[[firstKey, firstValue], [secondKey, secondValue]]）",
        "官方提醒（再次）：我们的 hash map 取回数据时**不保留插入顺序**——键与值乱序出现是**正常且预期**的",
        "**Test your hash map**（官方验收流程七步）：① 新建 JS 文件；② 创建实例、load factor 设 0.75；③ 用官方 12 组 set 填充（apple/red、banana/yellow、carrot/orange、dog/brown、elephant/gray、frog/green、grape/purple、hat/black、ice cream/white、jacket/blue、kite/pink、lion/golden）；④ 填完后当前负载应恰为 **0.75（满容量）**；⑤ 满员时试覆盖几个节点——应**只覆盖既有节点的值、不新增**：length() 不变、capacity 不变；⑥ 再 set('moon', 'silver') 第 13 条——负载超过 load factor、**触发增长、capacity 翻倍**；实现正确的话扩容后负载应**远低于** load factor、条目**均匀散布**在扩展后的桶里；⑦ 新 map 上再试覆盖，然后把 get/has/remove/length/clear/keys/values/entries 全测一遍——确认扩容后一切照旧",
        "**Extra credit**（官方）：创建 **HashSet** 类或工厂——行为与 HashMap 相同，但**只含键、没有值**"
      ],
      "terms": [
        {
          "en": "HashMap class/factory（本项目骨架）",
          "zh": "至少含 load factor 与 capacity 两个属性——官方起步值 0.75 与 16；十个方法挂在它上面"
        },
        {
          "en": "Out-of-bounds guard（越界检查）",
          "zh": "官方 Limitation 规则：凡按索引访问桶必先检查——索引小于 0 或大于等于 buckets.length 即抛错，防 JS 动态数组破坏容量本意"
        },
        {
          "en": "Modulo indexing（取模定位）",
          "zh": "散列码对当前 capacity 取模得到桶索引——大散列码落进有限桶的唯一通路；长键场景官方建议循环内每次迭代取模"
        },
        {
          "en": "MAX_SAFE_INTEGER（最大安全整数）",
          "zh": "JS 能精确表示的最大整数——质数连乘的散列码超过它就算不准；官方给的对策是迭代内取模把数字压小"
        },
        {
          "en": "Collision vs update（冲突与更新之分）",
          "zh": "同键 → 覆盖旧值（更新）；异键同散列码 → 同住一桶互不覆盖（冲突）——判断依据是比较键，不是比较散列码"
        },
        {
          "en": "HashSet",
          "zh": "Extra credit：只有键没有值的 HashMap——呼应上一课「Set 的节点只有键」的定义"
        }
      ],
      "tasks": [
        "搭骨架：HashMap 类或工厂 + load factor（0.75）与 capacity（16）两属性 + 桶数组（大小 = capacity）——把官方的越界检查规则装进所有按索引访问桶的路径",
        "实现 hash(key)：复用上一课质数 31 版（官方明文允许）；返回前对当前 capacity 取模——长键保险起见按官方建议循环内每次迭代取模",
        "第一轮实现 set（无增长版）/get/has/remove/length/clear/keys/values/entries——官方明说增长可以后补；set 里把「同键覆盖、异键冲突共存」的区分写对（比较键）",
        "小规模自测：12 组官方数据以内填充，逐方法检查（get 找不到返回 undefined、remove 不在返回 false、keys/values/entries 的形态对官方示例）",
        "第二轮补增长逻辑：条目数超过 capacity × load factor 时，新建双倍桶数组、把所有节点重新散列迁入——再跑一遍全方法确认扩容没有丢数据",
        "完整走官方 Test your hash map 七步：12 组填满（负载恰 0.75）→ 覆盖不加节点（length/capacity 不变）→ set('moon','silver') 触发翻倍 → 负载远低于 0.75、条目均匀散布 → 再覆盖 → 全方法回归",
        "Extra credit：HashSet——只有键没有值的同款结构（上一课官方定义：Set 的节点只有键）",
        "把作品 push 上 GitHub（沿用既往项目习惯）——这是本章第二个亲手造的数据结构，下一个是二叉搜索树"
      ],
      "quiz": [
        {
          "question": "官方 Limitation 专节为什么要求「凡按索引访问桶必先越界检查」？不检查会发生什么？",
          "answer": "因为 JS 数组是动态的：大小 16 的桶数组，往索引 500 存东西**没有任何语言层面的阻拦**——数组会自动变长。不检查的后果：散列码没取模或取模错时，条目悄悄住进「第 500 个桶」，容量限制形同虚设——**这破坏了 hash map 限制存储大小的本意**（官方原话），load factor 与增长机制全部失灵（length 与 capacity 的关系失真）。官方给的规格：索引小于 0 或大于等于 buckets.length 时抛 Error——让 bug 在第一现场显形（与链表项目 RangeError 同一哲学）。"
        },
        {
          "question": "hash(key) 为什么要「对当前 capacity 取模」？官方为什么建议循环内每次迭代都取模、而不是算完再取一次？",
          "answer": "取模的原因：质数 31 连乘的散列码可以很大（上一课例子 20353924），而桶只有 capacity 个（16）——**任何数模 16 得 0–15**，取模是把大散列码落进有限桶的唯一通路；「当前 capacity」措辞的关键在增长后桶数翻倍，取模基数必须跟着变。迭代内取模的原因（官方边界情形）：非常长的键会让 hashCode 连乘超出 **Number.MAX_SAFE_INTEGER**——超出后 JS 数字精度丢失、散列计算不准，不同键可能算出相同的「不准散列码」，冲突异常增多；每次迭代先取模把数字压在 capacity 范围内，连乘永远不会失控。"
        },
        {
          "question": "set(key, value) 里「覆盖」与「冲突」怎么区分？官方 Rama/Sita 例子说明什么？",
          "answer": "区分依据是**比较键**，不是比较散列码：**同一个键**再次 set → 旧值被新值**覆盖**（更新）；**两个不同的键**生成相同散列码、落进同一桶 → **冲突**——同住一桶（桶里的链表各占一节）、**互不覆盖**。官方例子：Rama 与 Sita 都散列到 3——它们进同一个桶但谁也不覆盖谁，因为键不同。这个区分正是上一课「取值四步里为什么找到桶还要比较键」的实现侧：set 写错（见同桶就覆盖）会把冲突键的值悄悄吃掉——数据丢失级 bug。"
        },
        {
          "question": "官方 Test your hash map 的第 ⑤⑥ 步（满员覆盖 → 第 13 条触发增长）分别验收什么？",
          "answer": "第 ⑤ 步验收「同键覆盖不扩容」：12 组填满后负载恰为 0.75（16 × 0.75 = 12）——此时**覆盖既有键**只改值、不新增条目：length() 应不变、capacity 应不变；覆盖若被误实现成「冲突新增」，length 立刻超阈值、错误触发增长。第 ⑥ 步验收「超阈值才增长」：set('moon','silver') 是**第 13 条**——条目数超过 12.8 的阈值，触发 capacity 翻倍（16→32）与全部节点重新散列迁入；实现正确的话扩容后负载**远低于** 0.75（13/32 ≈ 0.41）、条目**均匀散布**在扩展后的桶里。两步合起来把 load factor 机制的两边界都钉死了。"
        },
        {
          "question": "keys()/values()/entries() 返回的顺序官方怎么规定？Extra credit 的 HashSet 与 HashMap 差在哪？",
          "answer": "顺序：官方明文**不保证插入顺序**——取回数据时键与值乱序出现是**正常且预期**的（散列码到索引的转换不可预测；上一课 Mao/Zach/Xari 例子的实现侧）。写测试断言时别按插入序比对数组——按集合语义（排序后比、或逐个含入判断）。HashSet：Extra credit 要求行为与 HashMap 相同但**只含键、没有值**——正是上一课官方定义的落地：「Set 类似 hash map，关键差别是节点只有键没有值」；实现上 set/has/remove/length/clear/keys 逻辑可大量复用，去掉值存取即可。"
        }
      ],
      "optional": [
        "官方 Extra credit 挑战：HashSet——与 HashMap 同构但只存键、不存值（呼应上一课官方定义「Set 的节点只有键没有值」）；hash/取模/冲突链表/增长逻辑可大量复用，去掉值的存取即可。"
      ],
      "note": "Project 课（红线课）：examples 为空数组，本站正文只有官方规格中文化 + 实现顺序建议，不提供任何成品代码——官方正文的代码块（越界检查条件、重申的质数 31 版 hash 函数、12+1 组测试 set 调用）均属规格与上一课已教内容，按文字转述。hash 函数官方明文允许直接复用上一课实现（站内回指 hashmap-data-structure 课的冲突节）。官方测试流程的 13 组数据（apple/red 至 lion/golden 加 moon/silver）按原文保留。MDN 的 MAX_SAFE_INTEGER 链接与站内回指链接按资源清单口径登记。",
      "why": "这是「用魔法」到「造魔法」的关键一跳：JS 的对象与 Map 你用了几个月，这个项目让你亲手复现它们底下的全部机制——散列、取模、桶、冲突链表、负载因子、翻倍重散列。造完之后三样东西永久改变：① 你真正理解平均 O(1) 与最坏 O(n) 的条件（time-complexity 课的记号有了实物）；② 你能回答面试高频题「HashMap 怎么工作/冲突怎么处理/为什么扩容」——不是背段子，是「我写过」；③ 上一课的链表项目在这里兑现价值（每个桶就是一条链表）——课程编排「先链表后 HashMap」的用意亲身验证。官方测试流程七步则是一堂微型测试课：边界（恰好 0.75）、回归（扩容后全方法）、状态不变量（覆盖不加节点）——上一章的测试思维在算法项目里继续生效。",
      "sections": [
        {
          "h": "Limitation：先给 JS 数组上规矩",
          "p": [
            "官方开题一句：你已经知道 hash map 的魔法——现在轮到你写自己的实现。但动手前，官方先立地基规则（Limitation 专节）。",
            "问题所在：**JavaScript 数组的动态天性允许我们插入或检索超出数组大小范围的索引**——比如创建大小 16 的数组当桶，**没有任何东西阻止我们往索引 500 存东西**。",
            "后果与对策（官方）：这会**破坏 hash map 限制存储大小的本意**——所以需要强制约束：**每当你通过索引访问桶时**（官方给了检查条件：索引小于 0 或大于等于 buckets.length），**抛出错误**（\"Trying to access index out of bounds\"）。这条规矩要装进所有按索引进桶的路径——存、取、删，一个都不能漏。"
          ]
        },
        {
          "h": "骨架与 hash(key)：两条官方警告",
          "p": [
            "骨架（官方）：创建 **HashMap 类或工厂函数**（随你选）；至少两个属性/变量——**load factor** 与 **capacity**；官方给定起步值：**load factor 0.75、初始 capacity 16**。",
            "**hash(key)** 规格：接收字符串键、产出散列码。官方注明真实世界的 hash map 能容纳各种键类型（数字甚至对象），本项目保持简单。实现来源官方说得很宽：上一课的质数 31 版已经相当好（官方原样重贴、可直接用），也可以自行研究散列算法——但官方警告：**那是很深很深的兔子洞**（a deep, deep rabbit hole）。",
            "**警告一（取模）**：要确保得到装得进桶的索引（**无论增长与否**），必须**在返回前把散列码对当前 capacity 取模（%）**——「当前」二字在增长后性命攸关：桶翻倍，取模基数也得跟着翻倍。",
            "**警告二（长键）**：非常重要的边界情形——**非常长的键可能让散列码超出最大安全整数**（Number.MAX_SAFE_INTEGER，官方给 MDN 链接），计算开始不准。官方对策：**在循环的每次迭代都对当前 capacity 取模**，而不是循环完成后只取一次——数字永远压在安全范围里。",
            "**概念纠偏**（官方预告你会犯的迷糊）：之后存取键值对时你可能会**把键与散列码搞混**——键是用户提供的、传进散列函数的字符串；散列码是函数返回的数字。**你永远不会用键直接访问桶——只用散列码**。"
          ]
        },
        {
          "h": "十个方法的官方规格",
          "p": [
            "**set(key, value)**：键已存在则旧值被新值**覆盖**；官方强调的区分——两个**不同**键生成相同散列码、被分到同一个桶时，那是**冲突，不是更新**（Rama 与 Sita 都散列到 3：同住一桶、互不覆盖；键不同就是冲突——需要时回看上一课的冲突节）。set 还背着增长职责：**超过 load factor 时把桶增长到双倍容量**——官方明说后面的方法能帮你处理增长逻辑，**这一行为可以留到后面实现**。",
            "**get(key)**：返回键关联的值——**键不存在返回 undefined**；**has(key)**：键在不在——返回布尔。",
            "**remove(key)**：键在则移除该条目、返回 **true**；不在返回 **false**；**length()**：存储的**键**数；**clear()**：移除全部条目。",
            "**keys() / values() / entries()**：全部键（不含值）的数组 / 全部值（不含键）的数组 / 每个键值对各自成数组的数组（官方示例形态：[[firstKey, firstValue], [secondKey, secondValue]]）。",
            "官方再提醒一遍：**我们的 hash map 取回数据时不保留插入顺序**——键值乱序出现是正常且预期的（上一课「插入顺序不保证」专节的实现侧）。"
          ]
        },
        {
          "h": "Test your hash map：官方七步验收流程",
          "p": [
            "官方给了完整测试脚本（文字转述）：**①** 新建一个 JavaScript 文件；**②** 创建 hash map 实例、load factor 设 0.75；**③** 用 12 组 set 填充——apple/red、banana/yellow、carrot/orange、dog/brown、elephant/gray、frog/green、grape/purple、hat/black、ice cream/white、jacket/blue、kite/pink、lion/golden；**④** 填完后当前负载应恰为 **0.75（满容量）**。",
            "**⑤** 满员状态下用 set 试覆盖几个节点——应**只覆盖既有节点的值、不新增节点**：length() 仍返回相同值、capacity 保持不变；**⑥** 再填充最后一条 set('moon', 'silver')——负载超过 load factor、**触发增长功能、capacity 翻倍**；实现正确的话，扩容后的负载应**远低于** load factor、条目**均匀散布**在扩展后的桶之间；**⑦** 新 hash map 上再试覆盖（还是只改值），然后把其他方法全测一遍——get/has/remove/length/clear/keys/values/entries，确认**扩容之后**一切照旧。",
            "这个流程本身是精心设计的测试课：第 ④⑤ 步钉「恰好满员 + 覆盖不扩容」的边界；第 ⑥ 步钉「第 13 条触发翻倍」（16 × 0.75 = 12，第 13 条越过阈值）；第 ⑦ 步是扩容后的全方法回归——上一章的测试思维（边界、不变量、回归）在这里全套上岗。"
          ]
        },
        {
          "h": "Extra credit：HashSet",
          "p": [
            "官方加分项：创建 **HashSet 类或工厂函数**——行为与 HashMap 相同，但**只包含键、没有值**。",
            "这正是上一课官方定义的落地：「Set 类似 hash map，关键差别（官方双关 pun intended）是 Set 的节点只有键、没有值」——也解释了上一课那句「这就是 Set 里只能有唯一值的原理」：同键覆盖的机制天然保证唯一。",
            "实现提示（本站按官方规格推导）：hash/取模/越界检查/冲突链表/增长逻辑与 HashMap 完全同构；去掉值的存取后，keys() 即全部数据、values()/entries() 不再适用——官方说「行为与 HashMap 相同」，方法取舍以这个语义为准。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "散列码忘了取模，条目飞出桶数组",
          "text": "质数 31 连乘的散列码动辄几百万——不对当前 capacity 取模，JS 动态数组会照单全收（往索引 20353924 存东西也不报错）：容量限制形同虚设、load factor 失真。官方 Limitation 专节 + hash 规格里的取模要求是同一件事的两道保险，越界抛错则兜住漏网路径。"
        },
        {
          "title": "长键散列超出安全整数，冲突莫名暴增",
          "text": "官方点名的边界情形：非常长的键让 hashCode 连乘超出 Number.MAX_SAFE_INTEGER——精度丢失后不同键算出相同的「不准散列码」。对策是官方给的：循环内每次迭代都对当前 capacity 取模，把数字永远压在安全范围，而不是循环完只取一次。"
        },
        {
          "title": "set 见同桶就覆盖，把冲突键的值吃掉",
          "text": "同键才是覆盖（更新），异键同桶是冲突（共存）——判断依据是比较键，不是比较散列码。Rama 与 Sita 都散列到 3：谁也不覆盖谁。写错的症状是官方测试第 ⑤ 步过不去：覆盖既有键时 length 变了（被当成新条目），或不同键的值神秘消失。"
        },
        {
          "title": "增长只扩数组，不重新散列迁移",
          "text": "增长 = 双倍新数组 + 把所有现有节点的键重新散列、复制过去（上一课原文）——只把桶数组拉长而不迁移重散列，旧条目还按 %16 的老位置住着：新桶大半空着、老桶照样挤，扩容白做。验收看官方第 ⑥ 步的两条：负载远低于 0.75、条目均匀散布。"
        }
      ],
      "official": {
        "assignment": [
          "官方 Limitation（地基规则）：JavaScript 数组的动态天性允许插入或检索超出数组大小范围的索引——比如创建大小 16 的数组代表桶时，没有东西阻止往索引 500 存东西；这会破坏 hash map 限制存储大小的本意，所以要强制约束：每当通过索引访问桶时使用官方的检查片段——索引小于 0 或大于等于 buckets.length 时抛出错误（\"Trying to access index out of bounds\"）。",
          "创建 HashMap 类或工厂函数（二选一随你）：至少要有 load factor 与 capacity 两个属性或变量——load factor 0.75 对应初始 capacity 16。然后创建下列方法。",
          "hash(key)：接收字符串键、用它产出散列码（真实世界的 hash map 能容纳各种键类型——数字甚至其他对象——但我们现在保持简单）。上一课已实现了相当好的 hash 函数（质数 31 版，官方原样重贴）：你可以直接用它，也可以自行研究散列算法——当心，那是很深很深的兔子洞。记住：要确保得到装得进桶的索引（无论增长与否），需要在返回前把散列码对当前 capacity 取模（%）。要注意的重要边界情形：非常长的键可能超出最大安全整数（MDN），计算会变得不准——因此明智的做法是在循环的每次迭代都把散列码对当前 capacity 取模，而不是循环完成后只取一次。之后存取键值对时你可能会把键与散列码搞混：键是用户提供的、传进散列函数的字符串，散列码是函数返回的数字——你永远不会用键直接访问桶，只用散列码。",
          "set(key, value)：接收两个参数——键与要关联到键的值。键已存在于 hash map 时，与它关联的旧值应被新值覆盖。注意：两个不同的键生成相同的散列码、被分到同一个桶时，那是冲突、不是更新（例如 Rama 与 Sita 都散列到 3——它们进同一个桶、互不覆盖；键不同就知道这是冲突不是更新）。需要时回看 hash map 课的冲突（collisions）节。记住：hash map 超过 load factor 时把桶增长到双倍容量——后面提到的方法能帮你处理增长逻辑，所以这个特定行为可以留到后面实现。",
          "get(key)：接收键、返回与之关联的值——键不存在返回 undefined。has(key)：接收键、基于键在不在 hash map 里返回布尔值。",
          "remove(key)：接收键——键在 hash map 里则移除该条目并返回 true；键不在则返回 false。length()：返回 hash map 里存储的键的数量。clear()：移除 hash map 的全部条目。",
          "keys()：返回含 hash map 里全部键（不含值）的数组。values()：返回含全部值（不含键）的数组。entries()：返回每个键值对各自成数组的数组——例如 [[firstKey, firstValue], [secondKey, secondValue]]。记住我们的 hash map 取回数据时不保留插入顺序——键与值不按插入顺序出现是正常且预期的。",
          "Test your hash map（官方验收流程）：① 新建一个 JavaScript 文件；② 创建 hash map 新实例、load factor 设 0.75（官方示例：new HashMap() 或工厂调用）；③ 用 set(key, value) 复制官方 12 组数据填充：apple/red、banana/yellow、carrot/orange、dog/brown、elephant/gray、frog/green、grape/purple、hat/black、ice cream/white、jacket/blue、kite/pink、lion/golden；④ 填完后 hash map 的当前负载水平应恰为 0.75（满容量）；⑤ 满员状态下用 set 试覆盖几个节点——应只覆盖节点的既有值、不新增节点：length() 仍返回相同值、capacity 保持不变；⑥ 之后再填充最后一个节点 set('moon', 'silver')——负载水平超过 load factor、触发 hash map 的增长功能、capacity 翻倍；实现正确的话，扩展后 hash map 的负载水平应远低于 load factor、条目应均匀散布在扩展后的桶之间；⑦ 新 hash map 上再试用 set 覆盖几个节点（还是只覆盖既有值），然后测试其他方法——get、has、remove、length、clear、keys、values、entries——检查扩容后是否仍按预期工作。",
          "Extra credit：创建 HashSet 类或工厂函数——行为与 HashMap 相同，但只包含键、没有值。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "Extra credit（官方）：创建 HashSet 类或工厂函数——行为与 HashMap 相同，但只包含键、没有值。"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/computer_science/project_hash_map.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "78d7c37c6439f8af936f8002f2b0bef2d0cd7ec265d1f614f8032c8bfa0ab880",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "javascript-binary-search-trees",
      "title": "Project: Binary Search Trees",
      "zh": "项目：二叉搜索树",
      "group": 5,
      "url": "https://www.theodinproject.com/lessons/javascript-binary-search-trees",
      "summary": "本章分量最重的数据结构项目：造一棵**平衡二叉搜索树（balanced BST）**。官方引言先复习：你已学过二叉搜索树——把一组数据项变成满是节点的树、**每个左节点比右节点「小」**；树从**根节点（root node）**开始，没有孩子的节点叫**叶节点（leaf node）**；也学过广度优先与深度优先的树遍历算法。现在看**平衡** BST：它让查找、插入、删除数据项都很快（官方给了 geeksforgeeks 的「有序数组建平衡 BST」文章与一支视频——视频不用 JavaScript，但官方说你应该能理解到写出自己的伪代码）。Assignment 总规则：**不要用重复值**——重复值让事情更复杂、让树更难平衡；**务必总是移除重复值、或插入前检查值是否已存在**。十三步规格：**Node** 类/工厂（数据属性 + 左右孩子）；**Tree** 类/工厂（初始化接收数组，root 属性用 buildTree() 的返回值）；**buildTree(array)**（把数字数组——官方例子 [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]——变成节点摆放得当的平衡二叉树，**别忘了排序与去重**；返回 level-0 根节点；可以做成私有——类私有特性或不放进工厂返回对象）；官方 Tip 给了 prettyPrint() 可视化工具函数（把树按结构 console.log 出来，接收根节点）；**includes(value)**（在树中返回 true 否则 false）；**insert(value)**（插入新节点并保持「二叉搜索」性质——每个节点左边的都更小、右边的都更大；**值已存在则什么都不做**）；官方 Note「避免使用原始输入数组」：你可能想用建树的原始数组实现这些方法，但为了效率**不要**——Big-O Cheatsheet 上 BST 插入/删除是 O(log n)，比数组同操作快得多；要拿到这份效率，方法应当**遍历树、操纵节点及其连接**；**deleteItem(value)**（从树移除——按目标节点的孩子数分多种情况处理；值不存在什么都不做）；**levelOrderForEach(callback)**（广度优先层序遍历、对每个**值**（不是节点）调用回调，类似 Array.prototype.forEach；迭代或递归实现都行——**官方鼓励两种都试**；未提供回调则**抛 Error**）；官方 Tip「用队列」：用一个数组充当队列，跟踪尚未遍历的孩子节点并往里加新的；**inOrderForEach / preOrderForEach / postOrderForEach(callback)**（各自的深度优先顺序遍历、每个值传给回调；无回调同样抛 Error）；**height(value)**（含给定值节点的高度——高度定义为**该节点到叶节点最长路径的边数**；值不存在返回 undefined）；**depth(value)**（**该节点到根节点路径的边数**；不存在返回 undefined）；**isBalanced()**（树是否平衡——**每个节点**的左右子树高度差不超过 1、且左右子树自身也平衡）；官方 Tip「检查平衡的陷阱」：常见错误是只检查根的左右孩子高度差——**不够，必须对每个节点检查平衡条件**；**rebalance()**（重新平衡不平衡的树——用一种遍历方法产出新数组、喂给 buildTree()）。最后 Tie it all together 驱动脚本八步：随机数数组（每个 <100）建树 → isBalanced() 确认平衡 → 按 level/pre/post/in 四种顺序打印全部元素 → 插入几个 >100 的数把树搞不平衡 → isBalanced() 确认不平衡 → rebalance() → isBalanced() 再确认平衡 → 再按四种顺序打印。",
      "guide": "以下是官方原课的中文化梳理（Project 课：本站不提供成品代码，examples 为空数组——官方正文的代码块只有 prettyPrint() 可视化工具函数，它是官方提供的调试工具而非项目答案，本站按红线不收录代码、需要时看官方原课 Tip）。实现顺序建议（本站按官方规格推导）：第一轮走「静态树」——Node/Tree/buildTree（排序 + 去重 + 递归对半取中，正是 merge sort 反着用的分治手感）+ prettyPrint 验证形状 + includes/height/depth；第二轮走「动态树」——insert/deleteItem（官方 Note 的红线：遍历树、操纵节点连接，不许回退到原始数组）+ isBalanced（Tip 点名的陷阱：对每个节点递归检查，不是只看根）；第三轮走「遍历家族」——levelOrderForEach（队列版 + 递归版都试，官方鼓励）与三个深度优先 ForEach（in/pre/post 的差别只是「回调时机在左子树前/中/后」）；第四轮 rebalance + 驱动脚本八步收官。三个官方警告值得贴屏幕边：① 重复值会让平衡变难——buildTree 先排序去重、insert 遇已存在值直接不动作；② height/depth 都按**边数**定义（不是节点数），且值不存在返回 undefined；③ isBalanced 必须逐节点检查。回调缺失抛 Error 的规格（levelOrderForEach 与三个 DFS ForEach 一致）是官方埋的防御性编程练习——上一章测试思维里「错误在第一现场显形」的延续。驱动脚本八步是一个完整的「平衡 → 破坏 → 修复」生命周期演示：插入几个 >100 的数会让右侧长出长链（不平衡的典型形态），rebalance 用遍历取出有序数组重新 buildTree——「遍历 + 重建」正是 BST 自我修复的标准手法。",
      "understand": [
        "官方引言复习：你已学过**二叉搜索树（BST）**——把一组数据项变成满是节点的树，**每个左节点比每个右节点「小」**；树从**根节点（root node）**开始；**没有孩子的节点叫叶节点（leaf node）**；也学过广度优先与深度优先的树遍历算法",
        "本课主题（官方）：**平衡二叉搜索树（balanced BST）**——BST 让数据项的**查找、插入、删除都很快**；官方资料：geeksforgeeks「有序数组建平衡 BST」文章 + 一支视频（官方注明视频不用 JavaScript，但你应该能理解到**写出自己的伪代码**）",
        "Assignment 总规则（官方加粗强调）：**不要用重复值**——重复值让事情更复杂、产生**更难平衡**的树；**务必总是移除重复值、或插入前检查值是否已存在**",
        "**Node** 类/工厂（步骤 1）：一个属性存它携带的数据，外加**左、右孩子**",
        "**Tree** 类/工厂（步骤 2）：**初始化时接收一个数组**；应有 **root 属性**——用你接下来要写的 **buildTree()** 的返回值",
        "**buildTree(array)**（步骤 3）：接收数字数组（官方例子 [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]），把它变成**节点摆放得当的平衡二叉树**——**别忘了排序与移除重复值**；返回 **level-0 根节点**；官方允许做成**私有**（类的私有特性、或不放进工厂的返回对象）——只在初始化 root 时调用",
        "官方 Tip「可视化你的树」：提供 **prettyPrint()** 工具函数——把树按结构化格式 console.log 出来；接收树的根节点作为 node 参数（官方给了完整代码——本站按 Project 红线不收录，看官方原课 Tip）",
        "**includes(value)**（步骤 4）：给定值在树中返回 **true**、不在返回 **false**",
        "**insert(value)**（步骤 5）：插入带该值的新节点——**务必以保持「二叉搜索」性质的方式插入**：对每个节点，左边所有节点值更小、右边所有节点值更大；**传入的值已存在于树中时，函数应什么都不做**",
        "官方 Note「避免使用原始输入数组」：你可能忍不住用建树时的原始输入数组实现这些方法——但为了这些操作的效率，**不要这样做**；回看 **Big-O Cheatsheet**：二叉搜索树插入/删除是 **O(log n)** 时间——比数组做同样操作**显著更快**；要拿到这份效率，你的方法实现应当**遍历树、操纵节点与它们的连接**",
        "**deleteItem(value)**（步骤 6）：接收值、把它从树里移除——**按目标节点有几个孩子，要处理多种情况**；给定值不存在时**什么都不做**（官方附 geeksforgeeks 插入/删除文章作补充资料）",
        "**levelOrderForEach(callback)**（步骤 7）：接收回调函数为参数——**广度优先层序**遍历树、遍历中对每个**值**（**不是节点**）调用回调、把值作为参数传给它（类似 Array.prototype.forEach 对数组的工作方式）；**迭代或递归实现都行——两种都试试！**；**未提供回调函数时抛 Error**（官方给 MDN throw 链接）报告需要回调",
        "官方 Tip「用队列」：你会想用一个**数组充当队列**——跟踪所有**尚未遍历的孩子节点**、并把新发现的加进列表（官方附 mycodeschool 层序遍历视频）",
        "**inOrderForEach / preOrderForEach / postOrderForEach(callback)**（步骤 8）：同样接收回调——各自按对应的**深度优先顺序**遍历树、把每个值传给回调；与 levelOrderForEach 一样，**没给回调就抛 Error**（官方附 mycodeschool 的前序/中序/后序遍历视频）",
        "**height(value)**（步骤 9）：返回含给定值节点的**高度**——高度定义为**从该节点到叶节点的最长路径的边数**；值不在树中返回 **undefined**",
        "**depth(value)**（步骤 10）：返回含给定值节点的**深度**——深度定义为**从该节点到根节点的路径的边数**；值不在树中返回 **undefined**",
        "**isBalanced()**（步骤 11）：检查树是否平衡——二叉树被视为平衡的条件：**对树中的每个节点**，左右子树的高度差**不超过 1**、且左右子树**自身也平衡**",
        "官方 Tip「检查平衡的陷阱」：常见错误是**只检查根的左右孩子之间的高度差**——**那不够：你必须对每个节点检查平衡条件**",
        "**rebalance()**（步骤 12）：重新平衡一棵不平衡的树——官方路线：**用一种遍历方法产出新数组、把它提供给 buildTree() 函数**",
        "**Tie it all together**（官方驱动脚本八步）：① 用随机数数组（每个元素值 **小于 100**）创建二叉搜索树（愿意的话可以写一个每次调用返回随机数数组的函数）；② 调 isBalanced() **确认树平衡**；③ 按 **level、pre、post、in** 四种顺序打印全部元素；④ 添加几个**值大于 100** 的数**把树搞不平衡**；⑤ 调 isBalanced() **确认不平衡**；⑥ 调 rebalance() **重新平衡**；⑦ 调 isBalanced() **再确认平衡**；⑧ 再按四种顺序打印全部元素"
      ],
      "terms": [
        {
          "en": "Binary search tree（BST，二叉搜索树）",
          "zh": "每个节点左小右大的树——查找/插入/删除 O(log n)（平衡时）；本项目要求造平衡版"
        },
        {
          "en": "Root / Leaf node（根节点/叶节点）",
          "zh": "树的起点与没有孩子的终点——官方引言复习的两个基本词"
        },
        {
          "en": "Balanced tree（平衡树）",
          "zh": "每个节点的左右子树高度差 ≤ 1 且两子树自身也平衡——官方 Tip：必须逐节点检查，只看根是常见错误"
        },
        {
          "en": "Height / Depth（高度/深度）",
          "zh": "高度 = 该节点到叶节点最长路径的边数；深度 = 该节点到根节点路径的边数——官方定义都按边数计"
        },
        {
          "en": "Level order traversal（层序遍历，BFS）",
          "zh": "广度优先、一层层扫——官方 Tip：用数组充当队列跟踪待遍历的孩子节点；levelOrderForEach 的遍历顺序"
        },
        {
          "en": "In/Pre/Post order（中序/前序/后序遍历，DFS）",
          "zh": "三种深度优先顺序——区别在回调（访问）时机相对左右子树的位置；中序遍历 BST 得到升序序列（rebalance 的取数路线）"
        },
        {
          "en": "Callback（回调）",
          "zh": "ForEach 家族接收的函数参数——遍历中每个值传给它；官方规格：未提供回调抛 Error"
        }
      ],
      "tasks": [
        "预读官方资料：geeksforgeeks「有序数组建平衡 BST」文章 + 官方视频（不用 JS——官方说理解到能写自己的伪代码即可）；把 buildTree 的「排序 → 取中为根 → 两半递归」路线用伪代码写出来再动手",
        "第一轮（静态树）：Node（数据 + 左右孩子）与 Tree（接收数组、root = buildTree(array)）；buildTree 先排序 + 去重（官方加粗规则）再递归对半取中；用官方 Tip 的 prettyPrint() 打印树形验收（代码在官方原课 Tip 里）",
        "第一轮续：includes(value)、height(value)、depth(value)——后两个按官方边数定义实现，值不存在返回 undefined",
        "第二轮（动态树）：insert(value)——保持左小右大、值已存在则什么都不做；deleteItem(value)——按目标节点孩子数分情况（0/1/2 个孩子），值不存在什么都不做；官方 Note 红线：遍历树、操纵节点连接——不许用原始输入数组",
        "第二轮续：isBalanced()——对每个节点递归检查「高度差 ≤ 1 且两子树自身平衡」（官方 Tip 点名的陷阱：只看根不够）",
        "第三轮（遍历家族）：levelOrderForEach(callback)——数组当队列、广度优先，官方鼓励迭代与递归两种都试；inOrderForEach / preOrderForEach / postOrderForEach(callback)——三种深度优先顺序；四个方法的统一规格：回调收到的是值不是节点、未提供回调抛 Error",
        "第四轮：rebalance()——用一种遍历（中序最顺手：BST 的中序就是升序）取出全部值成新数组，喂给 buildTree()",
        "Tie it all together（官方驱动脚本八步）：随机数（<100）建树 → isBalanced() 确认 → 四种顺序打印 → 插入几个 >100 的数破坏平衡 → isBalanced() 确认不平衡 → rebalance() → isBalanced() 再确认 → 再四种顺序打印——八步全过，项目验收完成",
        "把作品 push 上 GitHub（沿用既往项目习惯）——这是「造结构」四连项目的第三站，下一站骑士之旅用它练成的遍历手感"
      ],
      "quiz": [
        {
          "question": "buildTree(array) 的官方规格里，「排序与去重」为什么是加粗的「别忘了」？",
          "answer": "去重的原因官方在 Assignment 总规则里说了：**重复值让事情更复杂、产生更难平衡的树**——务必总是移除重复值或插入前检查已存在（insert 的「值已存在什么都不做」是同一条规则的动态侧）。排序的原因在「平衡」的构造路线里：有序数组**对半取中当根、两半递归**，天然长出高度差最小的树——乱序数组直接对半拆会得到歪树。官方例子里的 [1,7,4,23,8,9,4,3,5,7,9,…] 既有乱序又有重复（4、7、9 各出现两次），两个坑都在一个例子里。"
        },
        {
          "question": "官方 Note 为什么禁止用「原始输入数组」实现 insert/deleteItem 等方法？",
          "answer": "效率与结构语义两层：官方回指 **Big-O Cheatsheet**——BST 的插入/删除是 **O(log n)**，比数组同操作**显著更快**（数组中间插删要搬移后续全部元素，O(n)）；而这份 O(log n) 只有**在树上走**才存在——用原始数组意味着每次操作先线性查找再重建，树白造了。官方给的实现红线：方法应当**遍历树、操纵节点与它们的连接**——从根出发按左小右大下行，改动发生在节点的 child 引用上。这也是「数据结构 = 结构本身承载效率」的直观一课：离开节点连接，BST 就退化成一个无序数组。"
        },
        {
          "question": "isBalanced() 的官方定义是什么？Tip 点名的常见错误为什么不够？",
          "answer": "官方定义：二叉树平衡 = **对树中的每个节点**，左右子树**高度差不超过 1**、且左右子树**自身也平衡**（递归条件）。Tip 点名的常见错误：**只检查根的左右孩子之间的高度差**——不够。反例画面：根的左右孩子高度差 1（表面平衡），但右子树内部某处挂着一条长链（局部高度差远超 1）——只看根会漏掉它。所以检查必须**递归下沉到每个节点**：每层验证「本节点高度差 ≤ 1」且「左右子树各自平衡」。height(value) 的边数定义在这里直接复用。"
        },
        {
          "question": "levelOrderForEach 官方为什么鼓励「迭代与递归两种都试」？队列在迭代版里扮演什么角色？",
          "answer": "两种实现对应两种思维肌肉：迭代版靠**显式队列**——官方 Tip：用一个数组充当队列，跟踪所有尚未遍历的孩子节点、并把新发现的加进列表（出队一个 → 回调其值 → 它的孩子入队）——这是 BFS 的标准机械形态；递归版则要把「层」的概念编码进参数（比如按层收集节点再逐层处理），别扭但练递归思维。官方鼓励都试，也因为两种遍历你都已在概念课见过（队列 = BFS 的概念底座）。统一规格别忘：回调收到的是**值不是节点**；未提供回调**抛 Error**（与三个 DFS ForEach 一致）。"
        },
        {
          "question": "rebalance() 的官方路线「用一种遍历产出新数组喂给 buildTree()」——选哪种遍历最顺手？驱动脚本八步演示了什么生命周期？",
          "answer": "**中序（inOrder）**最顺手：BST 的中序遍历天然产出**升序**序列——正是 buildTree 需要的「排好序、可去重」输入；其他遍历产出的乱序数组还得再排一次。八步驱动脚本演示「**平衡 → 破坏 → 修复**」完整生命周期：随机数（<100）建树 → isBalanced() 确认 → 四种顺序打印 → 插入几个 **>100** 的数（全部落到右子树、右侧长出长链——不平衡的典型形态）→ isBalanced() 确认不平衡 → rebalance() → isBalanced() 再确认 → 再四种顺序打印。它是官方给的项目总验收：每步的输出都是可肉眼核对的证据。"
        }
      ],
      "optional": [],
      "note": "Project 课（红线课）：examples 为空数组，本站正文只有官方规格中文化 + 实现路线建议，不提供任何成品代码——官方正文唯一的代码块是 Tip 里的 prettyPrint() 可视化工具函数（官方提供的调试工具而非项目答案，需要时看官方原课 Tip）。官方资料链接（geeksforgeeks 建平衡 BST 文章与视频、插入/删除两篇、MDN throw、Big-O Cheatsheet、mycodeschool 两支遍历视频）按资源清单口径登记核验；官方注明建平衡 BST 的视频不用 JavaScript、理解到能写伪代码即可。height/depth 的「边数」定义与「值不存在返回 undefined」、四个 ForEach 的「无回调抛 Error」均为官方明文规格，本站如实转述。",
      "why": "这是本章的技术巅峰项目：一棵平衡 BST 把前面所有课串成一条线——buildTree 的「排序 + 对半取中 + 递归」是 merge sort 分治手法的反向应用；四种遍历是 BFS/DFS 概念课与队列/栈配对的落地；O(log n) 的插入删除让 time-complexity 课的记号变成可实测的性能；isBalanced/rebalance 则是「数据结构会退化、需要自我修复」的第一课。数据库索引、文件系统目录、排序容器（Java 的 TreeMap、C++ 的 std::map）底下都是平衡搜索树——造过一棵，这些名词全部祛魅。它也是面试重镇：BST 的验证、遍历、最近公共祖先、删除节点是算法题的常青树，而「只查根不算平衡」这类陷阱你已亲手踩过。做完它，骑士之旅只剩「把棋盘当图」一步之遥。",
      "sections": [
        {
          "h": "从 BST 到平衡 BST：官方复习与总规则",
          "p": [
            "官方引言复习：你已经学过**二叉搜索树**——把一组数据项变成满是节点的树，**每个左节点比每个右节点「小」**；树从**根节点**开始，**没有孩子的节点叫叶节点**；你还学过广度优先与深度优先这类树遍历算法。",
            "现在看**平衡** BST（官方）：BST 允许对数据项的**查找、插入、删除都很快**——官方给了 geeksforgeeks「有序数组建平衡 BST」的文章与一支视频；视频不用 JavaScript，但官方说你应该能理解到**写出自己的伪代码**的程度。",
            "Assignment 总规则（官方加粗）：**不要用重复值**——它们让事情更复杂、产生**更难平衡**的树；**务必总是移除重复值、或插入前检查值是否已存在**。这条规则贯穿 buildTree（排序后去重）与 insert（已存在则什么都不做）。"
          ]
        },
        {
          "h": "骨架三件套：Node、Tree、buildTree",
          "p": [
            "**Node 类/工厂**（步骤 1）：一个属性存它携带的**数据**，外加**左、右孩子**。",
            "**Tree 类/工厂**（步骤 2）：**初始化时接收一个数组**；应有 **root 属性**——用接下来要写的 **buildTree()** 的返回值。",
            "**buildTree(array)**（步骤 3）：接收数字数组（官方例子 [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]），把它变成**节点摆放得当的平衡二叉树**——**别忘了排序与移除重复值**；函数返回 **level-0 根节点**；官方允许做成**私有**（类的私有特性、或不放进工厂返回对象）——只在初始化 root 时调用。",
            "官方 Tip「可视化你的树」：给了 **prettyPrint()** 工具函数——把树按结构化格式 console.log（接收根节点作 node 参数）；本站按 Project 红线不收录代码，函数在官方原课的 Tip 里、复制即用。造树过程中每轮 prettyPrint 一下，形状对不对一目了然。"
          ]
        },
        {
          "h": "动态操作：includes、insert、deleteItem 与那条效率红线",
          "p": [
            "**includes(value)**（步骤 4）：值在树中返回 true、不在返回 false——从根下行、左小右大，O(log n)（平衡时）。",
            "**insert(value)**（步骤 5）：插入新节点、**务必保持「二叉搜索」性质**——对每个节点，左边所有节点更小、右边所有节点更大；**值已存在时什么都不做**（总规则的动态侧）。官方附 geeksforgeeks 插入文章作补充。",
            "官方 Note「**避免使用原始输入数组**」：你可能忍不住用建树的原始数组实现这些方法——但为了操作效率**不要**：Big-O Cheatsheet 上 BST 插入/删除是 **O(log n)**、比数组同操作显著快；要拿到这份效率，实现应当**遍历树、操纵节点与它们的连接**。",
            "**deleteItem(value)**（步骤 6）：把值从树里移除——官方提示**按目标节点有几个孩子分多种情况**（叶节点直接摘；一个孩子则孩子顶替；两个孩子是经典难点——通常用右子树最小值或左子树最大值顶替，官方附 geeksforgeeks 删除文章）；**值不存在时什么都不做**。"
          ]
        },
        {
          "h": "遍历家族：四个 ForEach 与队列 Tip",
          "p": [
            "**levelOrderForEach(callback)**（步骤 7）：**广度优先层序**遍历、对每个**值**（不是节点）调用回调——类似 Array.prototype.forEach 的工作方式；**迭代或递归都行——官方鼓励两种都试**；**未提供回调则抛 Error**（官方给 MDN throw 链接）。",
            "官方 Tip「**用队列**」：用一个**数组充当队列**——跟踪所有尚未遍历的孩子节点、把新发现的加进列表（这正是「常见数据结构」课点名的 BFS 概念底座；官方附 mycodeschool 层序遍历视频）。",
            "**inOrderForEach / preOrderForEach / postOrderForEach(callback)**（步骤 8）：各自按对应的**深度优先顺序**遍历、每个值传给回调；**没给回调同样抛 Error**（官方附 mycodeschool 前序/中序/后序视频——「常见数据结构」课 Assignment 三部曲里的同一支）。",
            "四个方法的统一规格值得注意：回调收到的都是**值**（不是节点对象——树的内构不外泄，正是 more-testing 课「接口干净」的思想）；无回调一律抛 Error（防御性规格：让调用错误在第一现场显形）。中序遍历 BST 的产出是**升序序列**——rebalance 取数就靠它。"
          ]
        },
        {
          "h": "height、depth、isBalanced、rebalance：平衡四件套",
          "p": [
            "**height(value)**（步骤 9）：含给定值节点的**高度** = **该节点到叶节点最长路径的边数**；值不存在返回 **undefined**。**depth(value)**（步骤 10）：**该节点到根节点路径的边数**；不存在同样 undefined——两个定义都按**边数**计（不是节点数），差一层就是对错分界。",
            "**isBalanced()**（步骤 11）：**对树中每个节点**，左右子树**高度差不超过 1**、且左右子树**自身也平衡**。官方 Tip「检查平衡的陷阱」：常见错误是**只检查根的左右孩子高度差**——不够，必须逐节点检查（递归下沉）。",
            "**rebalance()**（步骤 12）：重新平衡不平衡的树——官方路线：**用一种遍历方法产出新数组、提供给 buildTree()**（中序遍历直接给出升序数组，最顺手）。「遍历 + 重建」是 BST 自我修复的标准手法——平衡不是插入时小心翼翼地维持出来的，而是退化后大修回来的。"
          ]
        },
        {
          "h": "Tie it all together：官方驱动脚本八步",
          "p": [
            "官方验收脚本（原样中文化）：**①** 用随机数数组（每个元素值**小于 100**）创建二叉搜索树——愿意的话写一个每次调用返回随机数数组的函数；**②** 调 isBalanced() **确认树是平衡的**；**③** 按 **level、pre、post、in** 四种顺序打印全部元素；**④** 添加几个**值大于 100** 的数**把树搞不平衡**；**⑤** 调 isBalanced() **确认树不平衡了**；**⑥** 调 rebalance() **把树弄平衡**；**⑦** 调 isBalanced() **再确认平衡**；**⑧** 再按 level、pre、post、in 四种顺序打印全部元素。",
            "八步是一个「**平衡 → 破坏 → 修复**」的完整生命周期演示：第 ④ 步插入的数全部大于 100（也就大于树里所有数），会一路向右下挂——右侧长出长链、isBalanced() 应转 false；rebalance() 后中序重排、树重新对半展开——两次四种顺序打印的对比（③ 与 ⑧）就是肉眼可见的修复证据。",
            "这也是本章「验收文化」的延续：链表的六动物 toString、HashMap 的七步测试流程、这里的八步驱动脚本——官方给每个项目都配了可执行的验收剧本，跑完全绿才算交付。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "buildTree 不排序或不排重，树先天歪斜",
          "text": "官方加粗的「别忘了排序与移除重复值」：乱序数组直接对半拆长不出平衡树（对半取中依赖有序）；重复值让树更难平衡（官方总规则）。官方例子 [1,7,4,23,8,9,4,…] 乱序与重复兼备——就是拿来练这两个动作的。"
        },
        {
          "title": "insert/deleteItem 回退到原始输入数组",
          "text": "官方 Note 专门点名：用原始数组实现这些方法会丢掉 BST 的全部效率（Big-O Cheatsheet：树上插删 O(log n)，数组 O(n)）。红线：遍历树、操纵节点与连接——从根按左小右大下行，改动落在 child 引用上。"
        },
        {
          "title": "isBalanced 只查根的高度差",
          "text": "官方 Tip 点名的陷阱：根的左右孩子高度差 ≤1 不代表平衡——某棵子树内部可能挂着长链。定义是递归的：每个节点都要满足「高度差 ≤1 且左右子树自身平衡」，检查必须下沉到每一个节点。"
        },
        {
          "title": "height/depth 按节点数计，或忘记 undefined 分支",
          "text": "官方定义都按边数：高度 = 到叶节点最长路径的边数、深度 = 到根路径的边数——按节点数计会全体差一。值不存在时两个方法都返回 undefined（官方明文）——漏掉这个分支，驱动脚本对不存在的值一查就露馅。"
        },
        {
          "title": "ForEach 家族把节点传给回调，或无回调时静默返回",
          "text": "官方规格：回调收到的是每个值（不是节点）——树的内构不外泄；未提供回调函数要抛 Error 报告「需要回调」——静默返回会让调用方的拼写错误（传错参数名）无声吞掉。四条 ForEach 规格一致，实现时做成统一的入参检查。"
        }
      ],
      "official": {
        "assignment": [
          "官方总规则：你要在这个 Assignment 里构建一棵平衡 BST。不要使用重复值——它们会让事情更复杂、产生更难平衡的树。因此务必总是移除重复值、或插入前检查值是否已存在。",
          "① 构建 Node 类/工厂：应有一个属性存它携带的数据，外加它的左、右孩子。② 构建 Tree 类/工厂：初始化时接收一个数组；Tree 类应有一个 root 属性——用你接下来要写的 buildTree() 的返回值。",
          "③ 写 buildTree(array) 函数：接收一个数字数组（例如 [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]），把它变成一棵节点摆放得当的平衡二叉树（别忘了排序与移除重复值！）；buildTree() 应返回 level-0 根节点。你可以把这个函数做成私有（用类语法的私有特性、或不把它放进工厂的返回对象），只在初始化 root 节点的值时调用它。（官方 Tip：想可视化你的二叉搜索树的话，官方给了 prettyPrint() 函数——把你的树按结构化格式 console.log；它期望接收树的根节点作为 node 参数的值。）",
          "④ 写 includes(value) 函数：接收一个值——给定值在树中返回 true，不在返回 false。",
          "⑤ 写 insert(value) 函数：接收一个值、把带该值的新节点插入树——务必以保持「二叉搜索」性质的方式插入：对每个节点，它左边的每个节点值必须更小、右边的每个节点值必须更大；函数被已存在于树中的值调用时应什么都不做。（官方 Note：避免使用原始输入数组——为了这些操作的效率，方法实现应当遍历树、操纵节点与它们的连接；Big-O Cheatsheet 上 BST 插入/删除是 O(log n)，比数组同操作显著快。补充资料：geeksforgeeks 的 BST 插入文章。）",
          "⑥ 写 deleteItem(value) 函数：接收一个值、把它从树里移除——你要按目标节点有几个孩子处理多种情况；给定值不存在于树中时函数应什么都不做。（补充资料：geeksforgeeks 的 BST 删除文章。）",
          "⑦ 写 levelOrderForEach(callback) 函数：接收一个回调函数作参数——levelOrderForEach() 应按广度优先层序遍历树、遍历中对每个值调用回调、把每个值（不是节点）作为参数传递（类似 Array.prototype.forEach 对数组的工作方式）；可以用迭代或递归实现（两种都试试！）；未提供回调函数时抛出 Error 报告需要回调。（官方 Tip：用一个数组充当队列——跟踪所有尚未遍历的孩子节点、把新的加进列表；可视化资料：mycodeschool 的层序遍历视频。）",
          "⑧ 写 inOrderForEach(callback)、preOrderForEach(callback)、postOrderForEach(callback) 函数：同样接收回调作参数——各自按对应的深度优先顺序遍历树、把每个值传给回调；与 levelOrderForEach() 一样，没给回调参数就抛 Error。（资料：mycodeschool 的 Binary Tree Traversal: Preorder, Inorder, Postorder 视频。）",
          "⑨ 写 height(value) 函数：返回含给定值的节点的高度——高度定义为从该节点到叶节点的最长路径的边数；值不在树中时返回 undefined。⑩ 写 depth(value) 函数：返回含给定值的节点的深度——深度定义为从该节点到根节点的路径的边数；值不在树中时返回 undefined。",
          "⑪ 写 isBalanced() 函数：检查树是否平衡——二叉树被视为平衡，如果对树中的每个节点，其左右子树的高度差不超过 1、且左右子树自身也平衡。（官方 Tip 陷阱提示：常见错误是只检查根的左右孩子之间的高度差——那不够，你必须对每个节点检查平衡条件。）",
          "⑫ 写 rebalance() 函数：重新平衡一棵不平衡的树——你会想用一种遍历方法给 buildTree() 函数提供一个新数组。",
          "Tie it all together（官方驱动脚本）：① 从一个随机数数组（每个元素值小于 100）创建二叉搜索树——愿意的话可以创建一个每次调用返回随机数数组的函数；② 调 isBalanced() 确认树是平衡的；③ 按 level、pre、post、in 四种顺序打印全部元素；④ 添加几个值大于 100 的数把树搞不平衡；⑤ 调 isBalanced() 确认树不平衡了；⑥ 调 rebalance() 把树弄平衡；⑦ 调 isBalanced() 再确认树是平衡的；⑧ 按 level、pre、post、in 四种顺序打印全部元素。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/computer_science/project_binary_search_trees.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "e601c176d552b756870877d70cb0761545eaa230b12fa5d542b7541dc403acc3",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "javascript-knights-travails",
      "title": "Project: Knights Travails",
      "zh": "项目：骑士之旅",
      "group": 5,
      "url": "https://www.theodinproject.com/lessons/javascript-knights-travails",
      "summary": "「一点计算机科学」章的收官项目，也是搜索算法的实战验收：**现在你是 DFS 与 BFS 的行家了——让我们把搜索算法用在一个真实问题上**。官方引言先补一块概念：本项目要用**图（graph）**——一种与二叉树**相似（但不相同）**的数据结构；给了 Khan Academy 的两份资料（「描述图」与「表示图」节——官方说后者会给你在代码里实现图的好想法）。问题本体：**给足够的步数，标准 8×8 棋盘上的马（knight）能从任意格子走到任意其他格子**——基本走法是「向前两步 + 向侧一步」或「向前一步 + 向侧两步」、可以朝任何方向（官方配了一张一步内所有可达位置的示意图，并注明：图只为解释问题，**无需做 GUI**）。官方把棋盘翻译成图语言：**每个格子是节点（顶点）**；**马从任一格出发的合法移动代表顶点之间的边（连接）**——于是「找马的最短路径」变成**图遍历问题**：遍历图（棋盘）、找到两个节点（起点与终点位置）之间的最短路线。顶点与边的规格：顶点 = 棋盘每个可能位置，坐标对 **[x, y]**（x、y 都在 0 到 7 之间）；边 = 合法的马步——例如从 [0,0] 可以到 [2,1]、[1,2] 等。官方还点明表示法：**解题时不需要显式创建带顶点与边的图对象**——可以把图当作**隐式（implicit）**的：马从特定顶点出发，算法在遍历棋盘时**动态探索所有可能的移动（边）**到其他顶点。Assignment：构建 **knightMoves** 函数——显示从一个格子到另一个格子的**最短可能路线**，输出马沿途停留的**所有格子**；调用形态官方示例：knightMoves([0,0],[1,2]) 返回 [[0,0],[1,2]]。官方 Note「多条最短路径」：有时**最快的路不止一条**——任何遵循规则并给出最短可能路径的答案都正确（官方给了 [0,0]→[3,3] 与 [3,3]→[0,0] 各两条合法答案、[0,0]→[7,7] 多条七格路径的例子）。四条官方提示：① 想清楚棋盘与马的规则、确保遵守；② 每个格子有多个可能移动——**选一个能让你处理它们的数据结构**；**不允许任何移动走出棋盘**；③ **DFS 与 BFS 在这里都可行**——但仔细想各自怎么工作：**其中一个会要求你处理「可能陷入无尽循环」的可能性**；④ 用选定的搜索算法找起点到终点的最短路径、输出完整路径——官方给了输出示例：knightMoves([3,3],[4,3]) 输出「You made it in 3 moves! Here's your path:」加逐行格子 [3,3]、[4,5]、[2,4]、[4,3]。",
      "guide": "以下是官方原课的中文化梳理（Project 课：本站不提供成品代码，examples 为空数组——官方正文的代码块只有 knightMoves 的调用/返回形态与输出示例，均属需求规格，按文字转述）。这个项目是本章概念的总验收：图（隐式表示）、BFS/DFS（队列与栈）、 visited 去重（无尽循环的来源）、最短路径（BFS 的天然属性）——四件事在一个 8×8 棋盘上会师。动手前的关键选型是官方提示 ③ 留的思考题：DFS 与 BFS 都「可行」，但**最短路径**与**无尽循环**两个词已经把答案呼之欲出——BFS 一层层扩展，第一次到达终点时的层数就是最少步数（队列 FIFO 保证先发现的先到）；DFS 一条路走到底，先找到的路径未必最短（要穷举所有路径再比较），且马步图是**有环图**（[0,0]→[2,1]→[0,0] 走得回去）——不记录已访问格子就会无限绕圈，这就是官方说的「处理无尽循环的可能性」。本站按红线不给实现，但官方规格已把骨架画清：顶点是 [x,y]（0–7）、边是八种马步偏移、图是隐式的（不需要显式图对象——从当前格动态生成合法移动即可）、边界检查（不出棋盘）+ visited 集合两件套防循环、输出完整路径（不只步数）。验收用官方给的全部例子：[0,0]→[1,2] 一步直达；[0,0]→[3,3] 两步（两条合法路线任选）；[3,3]→[4,3] 三步（官方输出示例）；[0,0]→[7,7] 六步（对角最远）。多解是官方明文允许的——「任何遵循规则并给出最短可能路径的答案都正确」，别为「和示例不一样」而自我怀疑，先数步数。",
      "understand": [
        "官方开题：现在你是 DFS 与 BFS 的**行家（pro）**了——让我们试着把搜索算法用在一个**真实问题**上",
        "本项目需要**图（graph）**：一种与二叉树**相似（但不相同）**的数据结构；官方资料：Khan Academy 的「Describing Graphs」（什么是图的好引言）与「Representing Graphs」节——官方说后者会给你**在代码里实际实现图的好想法**",
        "问题本体（官方）：给足够的步数，**标准 8×8 棋盘上的马能从任意格子走到任意其他格子**；基本移动是**向前两步 + 向侧一步**，或**向前一步 + 向侧两步**——可以朝任何方向",
        "官方配图注：一步内所有可能落点的示意图**只为解释问题——不需要创建 GUI**",
        "棋盘翻译成图（官方）：**每个格子是一个节点（或顶点）**；**马从任一格出发的合法移动代表顶点之间的边（或连接）**——于是「为马的移动找最短路径」变成**图遍历问题**：目标是遍历图（棋盘）、找到两个节点（起点与终点位置）之间的**最短路线**",
        "顶点与边的规格（官方 Vertices and edges 节）：顶点 = 棋盘上每个可能位置，用坐标对 **[x, y]** 表示——**x 与 y 都在 0 和 7 之间**；边 = 顶点之间合法的马步——例如从 **[0,0]** 马可以走到 **[2,1]**、**[1,2]** 等：每个移动代表 [0,0] 与其他可达顶点之间的一条连接",
        "图的表示（官方 Graph representation 节）：解这道题时**不需要显式创建带顶点与边的图对象**——可以把图当作**隐式（implicit）**的：马从一个特定顶点出发，算法在遍历棋盘时**动态探索所有可能的移动（边）**到其他顶点（棋盘上的位置）",
        "Assignment 核心：构建 **knightMoves** 函数——显示从一个格子到另一个格子的**最短可能路线**，方式是**输出马将沿途停留的所有格子**；官方调用示例：knightMoves([0,0],[1,2]) 返回 [[0,0],[1,2]]",
        "官方 Note「多条最短路径」：有时**最快的路不止一条**——**任何遵循规则并给出最短可能路径的答案都正确**；官方例子：knightMoves([0,0],[3,3]) 可能返回 [[0,0],[2,1],[3,3]] **或** [[0,0],[1,2],[3,3]]；knightMoves([3,3],[0,0]) 同理两条；knightMoves([0,0],[7,7]) 可能返回 [[0,0],[2,1],[4,2],[6,3],[4,4],[6,5],[7,7]] 或 [[0,0],[2,1],[4,2],[6,3],[7,5],[5,6],[7,7]] 或其他可能的最短路径",
        "官方提示 ①：**想清楚棋盘与马的规则、确保遵守它们**",
        "官方提示 ②：从每个格子出发**有多个可能的移动**——**选择一个能让你处理它们的数据结构**；**不允许任何移动走出棋盘**",
        "官方提示 ③：**DFS 与 BFS 在这里都可行**——但仔细想它们各自怎么工作：**其中一个会要求你处理「可能陷入无尽循环（endless cycle）」的可能性**",
        "官方提示 ④：用选定的搜索算法找到起点（节点）与终点之间的**最短路径**；**输出完整路径的样子**——官方输出示例：knightMoves([3,3],[4,3]) 输出「You made it in 3 moves! Here's your path:」随后逐行打印 [3,3]、[4,5]、[2,4]、[4,3]"
      ],
      "terms": [
        {
          "en": "Graph（图）",
          "zh": "顶点 + 边的数据结构——与二叉树相似但不相同（可以有环、任意连接）；本项目里棋盘就是图"
        },
        {
          "en": "Vertex / Edge（顶点/边）",
          "zh": "顶点 = 棋盘格子（坐标对 [x,y]，0–7）；边 = 合法马步——从 [0,0] 到 [2,1]、[1,2] 等"
        },
        {
          "en": "Implicit graph（隐式图）",
          "zh": "官方点明的表示法：不显式建图对象——从当前顶点动态生成合法移动（边）即可，遍历时按需探索"
        },
        {
          "en": "Knight move（马步）",
          "zh": "向前两步 + 向侧一步，或向前一步 + 向侧两步、任意方向——八种偏移组合；不允许走出棋盘"
        },
        {
          "en": "Shortest path（最短路径）",
          "zh": "起点到终点的最少步数路线——可能不止一条：官方明文任何给出最短路径的合法答案都正确"
        },
        {
          "en": "Endless cycle（无尽循环）",
          "zh": "官方提示 ③ 的警告：马步图有环（走得回原格）——搜索不记录已访问顶点就会无限绕圈"
        },
        {
          "en": "BFS / DFS（广度/深度优先搜索）",
          "zh": "官方说两者都可行——但「最短路径 + 无尽循环」的提示指向思考各自的工作方式后再选型"
        }
      ],
      "tasks": [
        "读官方资料补图概念：Khan Academy 的 Describing Graphs 与 Representing Graphs 两节——官方点名后者给你「在代码里实现图的好想法」",
        "把规格翻译成白板设计（不写代码先想清楚）：顶点 = [x,y]（0–7）；边 = 八种马步偏移；隐式图 = 从当前格动态生成合法移动；两道防线 = 边界检查（不出棋盘）+ 已访问记录（防无尽循环）",
        "选型思考（官方提示 ③ 的作业）：写下 BFS 与 DFS 各自怎么找路径——哪个天然给出最短路径？哪个必须额外处理循环风险？想明白再动手（本站不代答，官方的提示已经把思考方向画好）",
        "实现 knightMoves(start, end)：输出马沿途停留的所有格子（官方示例形态：knightMoves([0,0],[1,2]) 返回 [[0,0],[1,2]]）——路径要含起点与终点",
        "用官方全部例子验收：[0,0]→[1,2]（一步）；[0,0]→[3,3]（两步，官方给了两条合法路线——你的答案与示例不同先数步数，步数相同即正确）；[3,3]→[4,3]（三步，对照官方输出示例的格式）；[0,0]→[7,7]（官方给了两条七格路径例子）",
        "输出格式对照官方示例：「You made it in N moves! Here's your path:」加逐行格子——N 是移动次数（路径格数减一）",
        "边界自查：起点 = 终点（0 步）怎么处理？坐标越界输入（如 [8,0]）要不要防？——官方没规定，自己拍板并保持行为一致",
        "把作品 push 上 GitHub（沿用既往项目习惯）——这是「一点计算机科学」章的收官之作：链表、HashMap、BST、图遍历四连项目到此集齐"
      ],
      "quiz": [
        {
          "question": "棋盘怎么翻译成图？「隐式图」的官方含义是什么、为什么它让实现更简单？",
          "answer": "翻译规则（官方 Vertices and edges 节）：**每个格子是顶点**——坐标对 [x,y]（x、y 都在 0–7）；**合法马步是边**——从 [0,0] 可到 [2,1]、[1,2] 等，每个移动就是一条连接。「找最短路径」于是变成图遍历问题。隐式图（官方 Graph representation 节）：**不需要显式创建带顶点与边的图对象**——马从特定顶点出发，算法遍历时**动态探索所有可能的移动**：站在任何格子，按八种偏移现场生成合法落点即可。简单在：不用预建 64 个顶点与几百条边的数据结构，「邻居生成器」一个函数就是整张图——边只在需要时存在。"
        },
        {
          "question": "官方提示「DFS 与 BFS 都可行，但其中一个要处理无尽循环的可能性」——循环从哪来？怎么防？",
          "answer": "循环的来源：马步图是**有环图**——[0,0]→[2,1] 之后，[2,1] 的合法移动里又有 [0,0]（马步可逆）；搜索若不记录去过的顶点，就会在两个格子间无限往返（DFS 一条路走到底的形态尤其容易撞上——这正是提示 ③ 让你「仔细想各自怎么工作」的原因）。防法两件套（官方提示 ② 的「选一个能处理它们的数据结构」+ 循环警告合读）：**已访问集合**（visited——进过队的顶点不再进）与**边界检查**（不允许任何移动走出棋盘：x、y 都必须在 0–7）。"
        },
        {
          "question": "官方 Note 说「有时最快的路不止一条」——你的输出与官方示例不同，怎么判断自己对不对？",
          "answer": "官方明文：**任何遵循规则并给出最短可能路径的答案都正确**——[0,0]→[3,3] 返回 [[0,0],[2,1],[3,3]] 或 [[0,0],[1,2],[3,3]] 都对；[0,0]→[7,7] 官方给了两条不同的七格路径还说「或其他可能的最短路径」。判断标准就两条：**步数最短**（与示例路径等长）与**每步合法**（都是马步、都没出棋盘、首尾对得上）。与示例逐格比对反而错——多解是这个问题的固有性质，不是 bug。"
        },
        {
          "question": "knightMoves([3,3],[4,3]) 的官方输出示例里「You made it in 3 moves!」——相邻两格为什么反而要 3 步？输出格式有什么规格？",
          "answer": "因为马步的几何约束：马走「日」字——**从 [3,3] 一步到不了 [4,3]**（那是相邻格，不是合法马步），必须绕出去再回来：官方示例路径 [3,3]→[4,5]→[2,4]→[4,3]，三跳四格。这正是这道题的反直觉之处：近的未必快、远的（[0,0]→[7,7] 六步）未必慢——所以官方让你「想清楚棋盘与马的规则、确保遵守」。输出规格（官方示例）：「You made it in N moves! Here's your path:」随后**逐行**打印路径上的每个格子——N = 移动次数 = 路径格数减一（4 格 3 moves）。"
        },
        {
          "question": "这个项目验收了本章哪些概念？官方为什么说「你是 DFS 与 BFS 的行家了」？",
          "answer": "总验收清单：**图**（顶点/边/隐式表示——Khan Academy 两节资料的概念落地）；**BFS/DFS**（「常见数据结构」课的队列/栈配对在真实问题上选型）；**visited 去重与循环风险**（官方提示 ③ 的核心思考题）；**最短路径**（BFS 层序扩展的天然属性——第一次到达即最短）；连数据结构选型（提示 ②「选一个能处理多个移动的数据结构」）都是「权衡三问」的实操。说「行家」是因为到此你已亲手造过链表、HashMap、平衡 BST——遍历与搜索的肌肉都在，这个项目只给你一个棋盘，规格、选型、防坑全部自己来：官方从「照着规格填方法」升级为「自己设计解法」，正是本章的毕业答辩。"
        }
      ],
      "optional": [],
      "note": "Project 课（红线课）：examples 为空数组，本站正文只有官方规格中文化 + 白板设计清单，不提供任何成品代码——官方正文的代码块只有 knightMoves 调用/返回形态与输出示例（均属需求规格，按文字转述）。官方示意图（一步内所有可达落点，cdn.statically.io 托管）按既有口径不内嵌，内容已文字转述（八种马步偏移）；官方注明该图仅为解释问题、无需 GUI。Khan Academy 两份资料（Describing Graphs / Representing Graphs）按资源清单口径核验。「BFS 天然给出最短路径」的选型分析是本站按官方提示 ③ 的思考方向整理的学习引导，官方原文只说「都可行、仔细想各自怎么工作、其中一个要处理无尽循环」——未直接点名答案。",
      "why": "这是「一点计算机科学」章的毕业答辩：官方第一次不给方法清单、只给问题与提示——图怎么表示、搜索怎么选型、循环怎么防，全部自己拍板；做完它，前面十一课的概念（递归、复杂度、队列/栈、BFS/DFS、图）在一个 8×8 棋盘上全部会师。它也是算法面试的经典原型：「岛屿数量」「单词接龙」「打开转盘锁」全是骑士之旅的换皮——状态空间搜索 + 最短步数 + visited 去重，套路一模一样；马步的几何约束（相邻格反而要绕三步）还会教你尊重问题域的规则而不是想当然。往课程全局看：它是 World 3 四个「造结构」项目的收官——链表、HashMap、BST、图遍历集齐，下一站只剩 Git 进阶与最终的 Battleship 大项目。",
      "sections": [
        {
          "h": "从树到图：官方的概念补丁",
          "p": [
            "官方开题带着毕业意味：**现在你是 DFS 与 BFS 的行家了——让我们试着把搜索算法用在一个真实问题上**。",
            "概念补丁（官方）：这个项目你需要用**图（graph）**——一种与二叉树**相似（但不相同）**的数据结构。相似在「节点 + 连接」的心智模型；不相同在图可以有**环**、连接不必分层——这个差别正是后面「无尽循环」警告的伏笔。",
            "官方资料两份（Khan Academy）：**「Describing Graphs」**——什么是图的好引言；**「Representing Graphs」节**——官方说它会给你**在代码里实际实现图的好想法**（邻接矩阵/邻接表这些表示法就在那一节）。"
          ]
        },
        {
          "h": "问题本体：马、棋盘与八种走法",
          "p": [
            "官方题面：**给足够的步数，标准 8×8 棋盘上的马（knight）能从任意格子走到任意其他格子**。它的基本移动是**向前两步 + 向侧一步**，或**向前一步 + 向侧两步**——可以朝任何方向。",
            "官方配了一张「一步内所有可能落点」的示意图，并注明：**图只为解释问题——不需要创建 GUI**（这是命令行项目，与递归项目同款环境）。",
            "八种落点偏移（按官方走法描述展开，本站整理）：横向 ±2 配纵向 ±1、横向 ±1 配纵向 ±2——从任一格子出发最多八个方向；靠边靠角时部分偏移会**走出棋盘**，官方提示 ② 明令：**不允许任何移动走出棋盘**——边界检查是第一道防线。"
          ]
        },
        {
          "h": "棋盘翻译成图：顶点、边与隐式表示",
          "p": [
            "官方翻译（原话大意）：这个问题里棋盘可以表示为图——**每个格子是一个节点（或顶点）**；**马从任一格出发的合法移动代表顶点之间的边（或连接）**。于是「为马的移动找最短路径」变成**图遍历问题**：遍历图（棋盘）、找到两个节点（起点与终点位置）之间的**最短路线**。",
            "规格细节（官方 Vertices and edges 节）：顶点 = 每个可能位置，坐标对 **[x, y]**——x、y 都在 **0 到 7** 之间；边 = 合法马步——例如从 **[0,0]** 可以到 **[2,1]**、**[1,2]** 等，每个移动代表一条连接。",
            "表示法（官方 Graph representation 节）：解题时**不需要显式创建带顶点与边的图对象**——可以把图当作**隐式（implicit）**的：马从特定顶点出发，算法遍历棋盘时**动态探索所有可能的移动（边）**到其他顶点。落地形态：一个「从当前坐标生成合法落点」的函数就是整张图——不必预建 64 个顶点的结构。"
          ]
        },
        {
          "h": "knightMoves：规格、多解与输出格式",
          "p": [
            "Assignment 核心（官方）：构建 **knightMoves** 函数——显示从一个格子到另一个格子的**最短可能路线**，方式是**输出马将沿途停留的所有格子**；官方调用示例：knightMoves([0,0],[1,2]) 返回 **[[0,0],[1,2]]**（路径含起点与终点）。",
            "官方 Note「多条最短路径」：有时**最快的路不止一条**——**任何遵循规则并给出最短可能路径的答案都正确**。官方例子：[0,0]→[3,3] 可能返回 [[0,0],[2,1],[3,3]] 或 [[0,0],[1,2],[3,3]]；[3,3]→[0,0] 同理；[0,0]→[7,7] 可能返回 [[0,0],[2,1],[4,2],[6,3],[4,4],[6,5],[7,7]] 或 [[0,0],[2,1],[4,2],[6,3],[7,5],[5,6],[7,7]] 或其他最短路径——**与示例不同不等于错：先数步数**。",
            "输出格式（官方提示 ④ 的示例）：knightMoves([3,3],[4,3]) 输出「**You made it in 3 moves! Here's your path:**」随后逐行打印 [3,3]、[4,5]、[2,4]、[4,3]——注意这个例子：相邻两格反而要 3 步（马走日字、一步到不了紧邻格），路径 4 格对应 3 moves（N = 格数减一）。"
          ]
        },
        {
          "h": "官方四条提示逐条读",
          "p": [
            "**① 想清楚棋盘与马的规则、确保遵守**——八种偏移、0–7 边界、路径含起终点；规则想错，后面全错。",
            "**② 从每个格子出发有多个可能移动——选择一个能让你处理它们的数据结构；不允许任何移动走出棋盘**——「多个移动」的收集与消费方式（队列？栈？）就是搜索算法的骨架选型；边界检查是硬性防线。",
            "**③ DFS 与 BFS 在这里都可行——但仔细想它们各自怎么工作：其中一个会要求你处理「可能陷入无尽循环」的可能性**——官方留的核心思考题：马步可逆（图有环），不记录已访问顶点就会无限绕圈；两种搜索与「最短路径」目标的关系，想明白再动手（本站按红线不代答，思考方向官方已画好）。",
            "**④ 用选定的搜索算法找起点到终点的最短路径；输出完整路径的样子**——交付物是路径（所有沿途格子），不是步数一个数字；输出格式照官方示例。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "不记录已访问格子，搜索原地打转",
          "text": "官方提示 ③ 点名的「无尽循环」：马步可逆——[0,0]→[2,1] 之后 [2,1] 又能回 [0,0]，图是有环的。没有 visited 集合的搜索会在两格间无限往返（或指数爆炸）。进队即标记，是图搜索的铁律。"
        },
        {
          "title": "允许马走出棋盘，坐标出现 8 或 -1",
          "text": "官方提示 ② 明令：不允许任何移动走出棋盘——x、y 必须在 0–7。漏掉边界检查的落点会生成非法顶点，轻则路径荒谬（[8,3] 之类）、重则在隐式图里越扩越远收不住。生成落点时先过滤再入队。"
        },
        {
          "title": "输出与官方示例不同就以为做错了",
          "text": "官方 Note 明文：最短路径常常不止一条——[0,0]→[3,3] 两条官方路线都正确，[0,0]→[7,7] 更是「或其他可能的最短路径」。验收标准是两条：步数最短、每步合法——与示例逐格比对是把多解问题当单解题做。"
        },
        {
          "title": "返回步数而不是完整路径",
          "text": "官方规格：输出马将沿途停留的所有格子（示例返回 [[0,0],[1,2]] 这样的坐标数组）+「You made it in N moves! Here's your path:」的逐行打印。只给一个数字不满足交付形态——路径要在搜索时一路记着「怎么来的」（每步携带来路，或终点回溯）。"
        },
        {
          "title": "没想清选型就开写，最短路径拿不到",
          "text": "官方提示 ③ 是思考题不是装饰：两种搜索都「可行」，但「最短路径」目标与「无尽循环」风险的组合指向明确的选型分析——动手前把「各自怎么工作」写下来（BFS 层序扩展 vs DFS 一路到底），选型错了返工的是整个搜索骨架。"
        }
      ],
      "official": {
        "assignment": [
          "你的任务是构建一个 knightMoves 函数——它显示从一个格子到另一个格子的最短可能路线，方式是输出马将沿途停留的所有格子。你可以把棋盘想成二维坐标——调用你的函数因此看起来像：knightMoves([0,0],[1,2]) 返回 [[0,0],[1,2]]。（官方 Note「多条最短路径」：有时最快的路不止一条——任何遵循规则并给出最短可能路径的答案都正确。例：knightMoves([0,0],[3,3]) 可能返回 [[0,0],[2,1],[3,3]] 或 [[0,0],[1,2],[3,3]]；knightMoves([3,3],[0,0]) 可能返回 [[3,3],[2,1],[0,0]] 或 [[3,3],[1,2],[0,0]]；knightMoves([0,0],[7,7]) 可能返回 [[0,0],[2,1],[4,2],[6,3],[4,4],[6,5],[7,7]] 或 [[0,0],[2,1],[4,2],[6,3],[7,5],[5,6],[7,7]] 或其他可能的最短路径。）",
          "官方提示 ①：想清楚棋盘与马的规则，确保遵守它们。",
          "官方提示 ②：从每个格子出发，多个移动都是可能的——选择一个能让你处理它们的数据结构。不允许任何移动走出棋盘。",
          "官方提示 ③：DFS 与 BFS 在这里都可行——但仔细想它们各自怎么工作：其中一个会要求你处理陷入无尽循环的可能性的应对。",
          "官方提示 ④：用选定的搜索算法找到起点（节点）与终点格子之间的最短路径；输出那条完整路径的样子——官方输出示例：knightMoves([3,3],[4,3]) 输出「You made it in 3 moves! Here's your path:」随后逐行 [3,3]、[4,5]、[2,4]、[4,3]。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/computer_science/project_knights_travails.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "b907d1ce3ff7493b171437ffe5df00fb12566cab9f79552aea6694ced2d06bf1",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "javascript-a-deeper-look-at-git",
      "title": "A Deeper Look at Git",
      "zh": "深入 Git",
      "group": 6,
      "url": "https://www.theodinproject.com/lessons/javascript-a-deeper-look-at-git",
      "summary": "官方把这课定位成「继续课程之前**非常重要**的必看内容」：项目越来越复杂，有纪律的 Git 工作流不再是可选项。课程从可视化入手，深入 add / commit / push 之下的真实机制，覆盖三大主题：**改写历史**（五种手法：修补最近一次提交 --amend、交互式 rebase 修改多个提交、squash 合并提交、拆分提交、重排提交）、**reset 的三档危险度**（默认档移 HEAD 并更新暂存区、--soft 只移 HEAD——官方说可以把它想成「更强大的 amend」、--hard 连工作目录一起覆盖——破坏性命令）、**指针模型**（分支不是「一组提交」而是**指向单个提交的指针**；每个提交是快照、同时指向它前面的提交；HEAD 是跟踪当前分支的特殊指针——HEAD~2 就是沿指针链走两步）。官方还强调改史命令的协作纪律：只 amend 未推送的提交、共享仓库 rebase 要有充分理由且让同事知情、--hard 要确切知道为什么用。练习场设置官方刻意安排了一个 typo 提交（'Create send file'）让你在交互 rebase 里亲手改掉。",
      "guide": "以下是官方原课的中文化梳理。这一课的知识主线只有一条：**Git 的一切都是指针**。理解了这个模型，改写历史的每个命令都不再是咒语——amend 是「用新提交替换指针指向的旧提交」、rebase -i 是「把一串提交拆开重放、途中停下来编辑」、reset 是「把分支指针挪到别处（顺带决定暂存区和工作目录跟不跟着挪）」。建议的学习路径：先跟着官方搭练习场（新仓库 + 三个提交，其中第二个的提交信息官方故意写错成 'Create send file'），然后按五种改史手法逐个实操——每做一个就 git log 看一次历史怎么变了。指针一节值得读两遍：它解释了为什么「分支是一组提交」的直觉是错的（分支只是指向单个提交的指针，历史链条靠提交逐个回指），也解释了 HEAD~2 的工作原理。协作纪律是这一课的暗线：--amend / rebase / reset --hard 都在「重写历史」，而重写已发布的历史会破坏同事的工作基础——官方在每一节都重复了这条警告，本站也把它放进了常见错误。注意：官方 Tip 提醒现代 Git 的默认分支通常叫 main 而不是 master。编辑器配置（--amend 与 rebase -i 要打开文本编辑器）官方回指 Foundations 的 Git Basics 课「Changing the Git Commit Message Editor」一节——没配过的先去配，不然命令会卡在 CLI 编辑器里。",
      "understand": [
        "官方定位（原话要义）：Git 命令其实不多，真正的难点在于**可视化正在发生什么**——这一课就是帮你看见 add / commit / push 底下的机制：Remotes、Pointers 与 Changing Git History",
        "官方强调：在继续课程之前看一下这些内容**非常重要**——项目工作越来越复杂，有纪律的 Git 工作流不再是可选项（no longer optional）",
        "练习场（官方 Getting set up）：GitHub 新建一个仓库、克隆到本地，创建四个空文件并提交三次——第一次 'Create first file'、第二次官方**故意写错**成 'Create send file'（后面用交互 rebase 亲手改成 second）、第三次把第三四个文件一起提交 'Create third file and create fourth file'（后面练习拆分）",
        "编辑器前置：--amend 与 rebase -i 会打开文本编辑器——默认 Git 用 CLI 编辑器，可能让你改完存不了关不掉；按官方回指的 Git Basics 课「Changing the Git Commit Message Editor」一节先配好",
        "**改法一：修补最近一次提交**——git add 漏掉的文件后 git commit --amend：先更新暂存区，再用新提交**替换**上一次提交；也可以顺便改提交信息。官方警告（加粗原话要义）：**只 amend 没有推送到任何地方的提交**——amend 不是「编辑」旧提交，而是拿一个全新提交替换它，可能毁掉其他开发者赖以工作的提交",
        "**改法二：修改更早的多个提交**——git rebase -i HEAD~2（编辑最近两个提交）：交互工具里提交**逆序**排列（最新在上）；把要改的那行 pick 改成 edit，保存退出后 Git 停在该提交，改完 git commit --amend、再 git rebase --continue 完成；要删除提交就整行删掉、要重排就调整行序。官方警告：共享仓库里 rebase 必须有充分理由且同事知情",
        "**改法三：squash 合并提交**——git rebase -i --root 回到根提交，把第二行的 pick 改成 squash：保存后编辑器显示被合并提交的提交信息，编辑成一条（官方示例 'Create first and second file'）保存即完成；价值：功能分支开发期的琐碎提交对主线历史是噪音，合并后别人更容易读懂项目历史——有些团队把 squash 定为标准流程",
        "**改法四：拆分提交**——交互 rebase 里把要拆的提交 pick 改 edit，停下后 git reset HEAD~：HEAD 移到前一个提交、**暂存区同步重置**——原本一起提交的两个文件回到未暂存状态，就能分别 add + commit 成两个小提交。适用场景：一个提交描述了太多事（官方例子：'Create third file and create fourth file'）",
        "**reset 三档**：默认档（git reset HEAD~）移 HEAD + 更新暂存区、不动工作目录；**--soft** 只移 HEAD、暂存区工作目录都不动——官方类比「更强大的 amend」：回退多个提交、把它们的改动合成一个新提交；**--hard** 移 HEAD + 更新暂存区 + **覆盖工作目录**——破坏性命令，可能毁数据，用之前必须确切知道为什么、并让同事知情",
        "**指针模型（本课核心）**：提交是**快照**——每次 git commit 都是给全部已暂存文件内容拍照、整个被跟踪的工作区被复制；**分支是指向单个提交的指针**（不是一组提交！）；那分支怎么知道之前的历史？——**每个提交也是指针，指向它前面的提交**；HEAD 是跟踪「你当前在哪个分支」的特殊指针，指向当前分支最近一次提交",
        "HEAD~2 的原理：从 HEAD 出发沿指针链走两步——Git 就是靠这个找到要编辑的两个提交",
        "官方 Tip：现代 Git 环境默认分支通常叫 **main** 而不是 master",
        "改史纪律总结（官方贯穿全文）：commit --amend / rebase / reset 都是「重写历史」——重写已发布的历史可能毁掉同事基于那些提交做的工作；安全做法是只在本地或未共享的分支上改史"
      ],
      "terms": [
        {
          "en": "git commit --amend",
          "zh": "修补最近一次提交：用新提交整体替换旧提交（可同时改提交信息）——只对未推送的提交安全"
        },
        {
          "en": "git rebase -i（interactive rebase）",
          "zh": "交互式变基：把一串提交拆开重放，途中可对单个提交 edit（停下编辑）/ squash（并入前一个）/ 删除 / 重排；HEAD~N 指定范围、--root 回到根提交"
        },
        {
          "en": "squash",
          "zh": "把多个提交合并成一个——交互 rebase 里把 pick 改成 squash，再编辑合并后的提交信息"
        },
        {
          "en": "git reset（默认 / --soft / --hard）",
          "zh": "移动分支指针：默认档同时重置暂存区；--soft 只移指针（改动留在暂存区，可合成新提交）；--hard 连工作目录一起覆盖——破坏性"
        },
        {
          "en": "HEAD",
          "zh": "指向「当前分支最近一次提交」的特殊指针；HEAD~N 表示沿提交链向前数 N 个"
        },
        {
          "en": "Pointer（指针模型）",
          "zh": "分支 = 指向单个提交的指针；提交 = 快照 + 指向前一个提交的指针——Git 历史就是一条指针链"
        },
        {
          "en": "Snapshot（快照）",
          "zh": "提交的本体：对全部已暂存文件内容的一次拍照，整个被跟踪工作区被复制"
        }
      ],
      "tasks": [
        "先搭官方练习场：GitHub 新建仓库并克隆，touch test{1..4}.md，按官方三次提交（保留 'Create send file' 这个故意的错字）——后面所有手法都在这个游乐场里练",
        "配置文本编辑器（官方回指 Git Basics 课的 Changing the Git Commit Message Editor 一节）——没配好 --amend 与 rebase -i 会卡在 CLI 编辑器里",
        "逐个实操五种改史手法，每步之后 git log 对照历史变化：① add test4.md 后 --amend；② rebase -i HEAD~2 把 'Create send file' 的 pick 改 edit，amend 改错字后 --continue；③ rebase -i --root 把第二个提交 squash 进第一个、合并提交信息；④ 对 'Create third file and create fourth file' 用 edit + reset HEAD~ 拆成两个提交",
        "分别试一次 git reset --soft HEAD~ 与 git reset --hard HEAD~（在练习场里！），用 git status 与 git log 观察三档对 HEAD / 暂存区 / 工作目录的不同影响",
        "完成官方 Assignment 三条阅读（资源卡有官方中文版直链）：Pro Git「分支的新建与合并」复习基础、「变基」深入 rebase、「重置揭密」深入 reset 三档",
        "用自己的话向别人（或写下来）解释：为什么说「分支是指向单个提交的指针」而不是「一组提交」？HEAD~2 是怎么找到要编辑的两个提交的？"
      ],
      "quiz": [
        {
          "question": "git commit --amend 到底做了什么？为什么官方警告「只 amend 没有推送过的提交」？",
          "answer": "amend 不是「编辑」上一次提交，而是**用一个全新的提交整体替换它**（先更新暂存区，再生成新提交顶替旧的）。危险在于：如果旧提交已经推送、别人基于它工作，你的替换会让对方的历史与远端对不上——等于毁掉同事工作的基础。所以纪律是：只 amend 还在本地、没推送到任何地方的提交。"
        },
        {
          "question": "交互 rebase（git rebase -i HEAD~2）的工具界面里，提交是按什么顺序排的？pick / edit / squash 分别做什么？",
          "answer": "**逆序**——最新的提交排在最上面，与 git log 一致但和「重放方向」相反。pick = 原样重放这个提交；edit = 重放到这里停下，让你 amend（改内容或改提交信息），改完 git rebase --continue；squash = 把这个提交并入上一个提交，保存后编辑器会让你把几条提交信息合并成一条。整行删除 = 移除该提交；调整行序 = 重排提交。"
        },
        {
          "question": "把一个「一次提交干了两件事」的提交拆成两个，官方的完整操作序列是什么？",
          "answer": "① git rebase -i 打开工具，把目标提交的 pick 改成 edit，保存退出——Git 停在该提交；② git reset HEAD~——HEAD 移到前一个提交、**暂存区同步重置**，两个文件的改动回到未暂存状态（工作目录不动，内容还在）；③ 分别 git add + git commit 两次，得到两个干净的小提交；④ git rebase --continue 完成。"
        },
        {
          "question": "git reset 的默认档、--soft、--hard 分别动了哪几层？官方给 --soft 的类比是什么？",
          "answer": "默认档：移 HEAD + 用 HEAD 新指向的内容更新暂存区（index），工作目录不动——所以文件改动还在、回到未暂存状态；--soft：**只移 HEAD**，暂存区和工作目录都不动——改动全部留在暂存区；--hard：移 HEAD + 更新暂存区 + **覆盖工作目录**——三层全动，可能毁数据。官方类比：--soft 是「更强大的 amend」——amend 只能改最近一个提交，--soft 可以回退多个提交、把它们的改动合成一个新提交。"
        },
        {
          "question": "「分支是一组提交」这个直觉为什么是错的？按官方的指针模型，一条历史链是怎么串起来的？",
          "answer": "官方纠偏：**分支其实是指向单个提交的指针**——就像一根手指指着链条上的某一环。历史链条靠提交自己串：每个提交是快照，同时**指向它前面的提交**；HEAD 是特殊指针，跟踪你当前所在分支、指向该分支最近的提交。所以 git rebase -i HEAD~2 能工作：从 HEAD 出发沿指针链走两步就找到了要编辑的范围。新建提交时分支指针前移，切分支只是把 HEAD 挪到另一根指针上——「多重现实的平行版本」就是这么来的。"
        }
      ],
      "optional": [],
      "note": "官方正文的编辑器配置一节回指 Foundations 的 Git Basics 课（本站第 12 课）「Changing the Git Commit Message Editor」锚点；练习场命令块里官方**故意**留了 'Create send file' 错字（供交互 rebase 修改练习），照抄时不要顺手纠正——纠正了就少一个练手机会。官方 Tip：现代 Git 默认分支通常是 main 而不是 master。Assignment 三条阅读全部来自 Pro Git 书（git-scm.com），三条都有官方中文版（资源卡直链中文章节，其中文标题分别为「分支的新建与合并」「变基」「重置揭密」——官方中译本用「揭密」而非「揭秘」）。",
      "why": "这一课是从「会用 Git」到「理解 Git」的分水岭。在此之前的项目里 Git 是存档按钮；从这里开始它是你职业工具箱里的精密仪器——面试官问「revert 和 reset 的区别」「什么时候能 force push」，答案全在这一课。它也是后面每一个协作场景的地基：下一课讲远程与强推的危险、再下一课的开源工作流里「先把 main 合进你的脏分支」等操作，全都建立在这课的指针模型与改史纪律上。指针模型本身还会在链表、二叉搜索树这些你刚写完的数据结构里反复回响——Git 的历史链就是一条单链表，分支是链表上的命名指针，HEAD 是当前指针：你刚在 HashMap 项目里手写过同构的东西。",
      "sections": [
        {
          "h": "为什么现在必须深入",
          "p": [
            "官方开篇定位：Git 是 crucial skill——无论业余爱好者还是职业开发者。它是「加了猛的保存按钮」，也是无缝协作的基础。命令其实不多，**真正的难点是可视化正在发生什么**。",
            "这一课深入 add / commit / push 之下：Remotes、Pointers、Changing Git History——扩展你对 Git 底层真实机制的理解。",
            "官方加粗强调：在继续课程之前看这些**非常重要**——项目工作正变得越来越复杂，使用有纪律的 Git 工作流**不再是可选项**。学完这课，你应该能更自如地修改 Git 历史、对 Git 整体有更好的理解。"
          ]
        },
        {
          "h": "练习场与五个改史手法",
          "p": [
            "官方先带你搭一个 Git playground：GitHub 新建仓库（名字随意）、克隆到本地、cd 进去创建文件——touch test{1..4}.md，然后三次提交：'Create first file'、'Create send file'（官方注明：including the typo——错字是故意的）、'Create third file and create fourth file'。",
            "编辑器前置：--amend 和 rebase -i 要打开文本编辑器；默认 Git 用 CLI 编辑器，可能改完存不了关不掉——按 Git Basics 课的「Changing the Git Commit Message Editor」一节配置好再往下走。",
            "**手法一（改最近提交）**：git status 与 git log 显示漏了 test4.md——git add test4.md 后 git commit --amend：暂存区更新，新提交**整体替换**旧提交（也可以顺便改提交信息）。官方加粗警告：**只 amend 没推送过的提交**——amend 不是编辑而是替换，可能毁掉别人赖以工作的提交；改史要安全地进行、让同事知情。",
            "**手法二（改更早的多个提交）**：git rebase -i HEAD~2 编辑最近两个提交。工具里提交**逆序**排列；把 'Create send file' 那行的 pick 改成 edit（要删除提交就删行、要重排就挪位置），保存退出后 Git 停在该提交——git commit --amend 改掉错字，git rebase --continue 完成，git log 查看改写后的历史。官方提醒：看似简单，误用即危险；**共享仓库里 rebase 要有非常充分的理由且同事知情**。",
            "**手法三（squash 合并）**：git rebase -i --root 回到根，第二行 pick 改 squash——编辑器显示被并提交的提交信息，改成一条（官方示例 'Create first and second file'）保存即成。价值：功能开发期的琐碎提交对主线是噪音，squash 后历史更好读——有些团队把它定为标准。",
            "**手法四（拆分提交）**：对 'Create third file and create fourth file' 用 edit 停下，git reset HEAD~——HEAD 与暂存区都退回前一个提交（工作目录不动），两个文件回到未暂存状态，分别 add + commit 拆成两个小提交。"
          ]
        },
        {
          "h": "reset 三档：从温柔到破坏",
          "p": [
            "默认档（git reset HEAD~）：移动 HEAD 指向的分支指针 + **用新指向的内容更新暂存区**——这正是拆分提交能工作的原因：改动回到未暂存状态，文件内容还在工作目录。",
            "**--soft**：只执行第一步（移 HEAD），暂存区完全不动——改动全部留在暂存区。官方类比：可以把它想成**更强大的 amend**——不是改最近一个提交，而是回退多个提交、把它们包含的全部改动合成一个新提交。",
            "**--hard**：移 HEAD + 更新暂存区 + **更新（覆盖）工作目录**——把工作目录文件覆盖成 HEAD 新指向处的样子。官方定性：与 --amend 同属**破坏性命令**（destructive，覆写历史），可能毁数据；不是说团队共享仓库里要完全避开它，而是**必须确切知道为什么用它、且同事知道你在用、为什么用**。"
          ]
        },
        {
          "h": "分支是指针：本课的思维内核",
          "p": [
            "官方引入指针（Pointers）时先铺垫：你已经在 Revisiting Rock Paper Scissors 课学过分支——它们保存着文件的多重「平行现实」版本；这一课讲这在底层到底是什么意思。",
            "先说提交：Git Basics 课把提交描述为**快照（Snapshots）**——官方让你按字面理解：每次 git commit，电脑都在给**全部已暂存文件内容**拍照；换句话说，你整个被跟踪的工作区被复制了一份。",
            "那分支是什么？基于直觉你可能以为分支是「一组提交」——**其实不是：分支是指向单个提交的指针**。那一个提交怎么知道它之前的全部历史？答案很简单：**每个提交也是指针，指向它前面的提交**。官方在这里停顿：这需要一点时间消化。",
            "回头验证：git rebase -i HEAD~2 怎么知道要编辑哪两个提交？——靠指针。**HEAD 是跟踪你当前所在分支的特殊指针**，指向当前分支最近的提交；那个提交指向它前面的提交（官方叫它 commit two）——从 HEAD 沿链走两步即得。",
            "官方总结（原话要义）：分支是指向单个提交的指针；提交是快照、也是指向历史中前一个提交的指针。**就这么多（That's it!）**"
          ]
        }
      ],
      "examples": [
        {
          "lang": "bash",
          "code": "touch test{1..4}.md\ngit add test1.md && git commit -m 'Create first file'\ngit add test2.md && git commit -m 'Create send file'\ngit add test3.md && git commit -m 'Create third file and create fourth file'",
          "note": "官方练习场搭建原码：三个提交，第二个的 'send' 是官方故意留的错字（供 rebase -i 修改练习），第三个把两件事塞进一个提交（供拆分练习）。"
        },
        {
          "lang": "bash",
          "code": "git add test4.md\ngit commit --amend",
          "note": "手法一：补上漏掉的文件并修补最近一次提交——amend 用新提交整体替换旧提交。只对未推送的提交安全。"
        },
        {
          "lang": "text",
          "code": "edit eacf39d Create send file\npick 92ad0af Create third file and create fourth file",
          "note": "rebase -i HEAD~2 打开的交互清单形态（提交逆序、最新在上）：把 pick 改成 edit 即在该提交停下；改完 git commit --amend、再 git rebase --continue。官方提醒别照抄哈希——用你自己工具里显示的行。"
        },
        {
          "lang": "text",
          "code": "pick e30ff48 Create first file\nsquash 92aa6f3 Create second file\npick 05e5413 Create third file and create fourth file",
          "note": "squash 形态：第二个提交并入第一个——保存退出后编辑器显示两条提交信息，合并编辑成一条（官方示例 'Create first and second file'）。--root 可从根提交开始。"
        },
        {
          "lang": "bash",
          "code": "git reset HEAD~\ngit add test3.md && git commit -m 'Create third file'\ngit add test4.md && git commit -m 'Create fourth file'",
          "note": "拆分提交原码：edit 停下后 reset HEAD~ 把 HEAD 与暂存区退回前一个提交（工作目录不动），两文件回到未暂存状态，分别提交即拆成两个。"
        }
      ],
      "pitfalls": [
        {
          "title": "amend / rebase / reset 已推送的提交",
          "text": "官方贯穿全文的红线：这三个命令都在重写历史——重写已发布的历史，等于抽掉同事工作的地基。纪律：只 amend 未推送的提交；共享仓库 rebase 要有充分理由且同事知情；已推送的提交不 reset。想撤销已推送的提交，用下一课的 git revert（生成反向新提交，不改历史）。"
        },
        {
          "title": "把「分支」想成一组提交",
          "text": "直觉陷阱：分支其实只是**指向单个提交的指针**，历史链靠提交逐个回指串起来。想错模型会把 rebase / reset 的行为理解成「操作一堆提交」，而实际上 Git 只是在挪指针、重放提交——理解指针模型，HEAD~N 与「平行现实」都自然通了。"
        },
        {
          "title": "git reset --hard 当成撤销键随手敲",
          "text": "--hard 三层全动：移 HEAD、重置暂存区、**覆盖工作目录**——未提交的改动会被直接冲掉，属于可能毁数据的破坏性命令。用它之前必须确切知道为什么；在团队共享仓库里还要让同事知情。只是想撤销暂存用默认档或 --soft，想保改动就别碰 --hard。"
        },
        {
          "title": "编辑器没配置就开 rebase -i",
          "text": "--amend 与 rebase -i 都要打开文本编辑器；Git 默认用 CLI 编辑器，没配置过的人常常改完存不了、关不掉，rebase 卡在中间状态。先按 Git Basics 课「Changing the Git Commit Message Editor」配好编辑器再动手；真卡住了 git rebase --abort 可以退出回到原状。"
        }
      ],
      "official": {
        "assignment": [
          "希望你在 Revisiting Rock Paper Scissors 之后的工作流里已经用上了分支——无论用没用，都复习一下 Pro Git 的 Basic Branching and Merging（基本分支与合并）。",
          "读 git-scm 的 Rebasing（变基）一章，对 rebase 做更深入的钻研。",
          "读 git-scm 的 Reset（重置揭密）一章，深入理解 git reset。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 git/intermediate_git/a_deeper_look_at_git.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "a9f31bfee59c6b92bf30013c2f0808774e4330857e7ddcf4736ff0c839007daa",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "javascript-working-with-remotes",
      "title": "Working with Remotes",
      "zh": "与远程协作",
      "group": 6,
      "url": "https://www.theodinproject.com/lessons/javascript-working-with-remotes",
      "summary": "上一课改了本地历史，这一课把镜头转向远程：当历史已经推送、当仓库不止你一个人，改史命令的危险等级全面上升。官方用一个亲手实验讲透 **git push --force 的破坏力**：先正常 push，再用 rebase -i --root 删掉一个提交，然后 force push——本地和 GitHub 上的第四个文件**双双消失**；协作场景下这就是在销毁同事的工作。push 被拒绝其实是 Git 的**安全机制**（你的历史过时了，强推会覆盖别人的提交），正确解法是 fetch + merge 更新本地再 push。想撤销已推送的提交？用 **git revert**——生成一个反向新提交，完全不需要 force（官方配了 Git Revert vs Git Reset 视频）。--force 的合法场景官方也给了：更新 pull request、清除误传的敏感信息。特别推介 **--force-with-lease**：带保险丝的强推——目标分支被别人更新过就报错拒绝，给你 fetch 的机会，有些公司把它设为默认。最后官方给出五条最佳实践与四个命令的逐条军规（amend 不碰已推送 / rebase 不碰别人依赖的仓库 / reset 不碰已推送 / force 只在适当时且优先 with-lease）。",
      "guide": "以下是官方原课的中文化梳理。这一课的情绪曲线是官方刻意设计的：先让你亲手用 --force 毁掉自己的文件（练习场里做，安全），看着本地与远端的第四个文件一起消失，再告诉你「协作时你毁掉的会是同事的工作」——实验留下的肌肉记忆比十条警告都管用。记住三个替代路径就掌握了这课的操作面：① push 被拒 → 不是强推，而是 fetch + merge（或 pull）更新本地历史再推；② 想撤销已推送的提交 → git revert HEAD（生成反向提交，历史只增不改）；③ 确实需要强推（更新 PR、清敏感信息）→ 优先 git push --force-with-lease（远端被别人动过就拒绝，是带保险丝的版本）。五条最佳实践的精神内核只有一句：**改史命令只在「你独自拥有的、未发布的历史」上随意用；一旦历史进入共享空间，就用只增不改的命令（revert / 新提交）来修正**。Assignment 两条阅读都是长线资产：GitHub 的 merge conflicts 文档教你两种解冲突路径（GitHub 网页上 / 命令行），Think Like (a) Git 是官方点名「写得非常好」的全站通读——它用图解方式把 Git 的内部模型再刷一遍，与上一课的指针模型互为印证。",
      "understand": [
        "情境设定（官方）：你不再独自开发，而是与人协作——想把改过的分支推到远程仓库；通常 Git 只允许你在**本地分支已包含远端最新提交**时推送",
        "push 被拒绝的报错其实是**好事**：这是 Git 的安全机制，防止你覆盖合作者创建的提交（那可能是灾难）——报错的原因是**你的历史过时了**",
        "git push --force 的行为：**用你的本地历史覆写远程仓库**。官方实验：push origin main → rebase -i --root 删掉 'Create fourth file' 提交 → push --force → git log——第四个文件在本地找不到，去 GitHub 上看：**也没了，我们刚刚销毁了它**",
        "官方加粗结论：git push --force 是**非常危险的命令，与他人协作时必须谨慎使用**——你销毁的可能是协作者的工作",
        "过时的历史报错的正确修法：用 **fetch、merge** 更新本地历史，然后再尝试 push",
        "场景二（提交信息写错想撤销）：你会想用 git reset 撤销提交再强推——**但等等**！force push 非常危险，考虑用它之前永远先检查是否适当、有没有更安全的命令；协作中想**撤销**刚做的提交，用 **git revert**——它不需要强推（官方配视频 Git Revert vs Git Reset）",
        "revert 的原理：git revert HEAD 会**反转 HEAD 的改动**（生成一个新提交记录这次反转），然后正常 push 即可——历史只增不改",
        "--force 的合法场景（官方）：最常见的是**更新 pull request**；较少见的场景如**敏感信息被误传到仓库**、需要移除它的所有出现",
        "**git push --force-with-lease**（官方特别提名，有些公司设为默认选项）：它是 fail-safe——**检查你要推的分支是否被别人更新过，更新过就报错**，给你机会先 fetch 更新本地仓库再决定",
        "官方最佳实践五条：① 团队项目里改史前确认安全、且让别人知道你在改；② 理想情况这些命令只用在你独自工作的分支上；③ -f 标志应该让你害怕——用它必须有非常好的理由；④ 不要每个提交都 push——尽量避免改动已发布的历史；⑤ 逐命令军规：**--amend 绝不修补已推送的提交；rebase 绝不变基别人可能基于其工作的仓库；reset 绝不重置已推送的提交；push --force 只在适当时用、谨慎用、最好默认用 --force-with-lease**"
      ],
      "terms": [
        {
          "en": "git push --force",
          "zh": "用本地历史覆写远程仓库——协作中的高危命令；合法场景：更新 PR、清除误传敏感信息"
        },
        {
          "en": "git push --force-with-lease",
          "zh": "带保险丝的强推：目标分支被别人更新过就报错拒绝，先 fetch 再说——有些公司的默认选项"
        },
        {
          "en": "git revert",
          "zh": "生成一个反转指定提交改动的新提交——撤销已推送提交的安全方式，历史只增不改、无需强推"
        },
        {
          "en": "Outdated history（历史过时）",
          "zh": "push 被拒的原因：远端有你本地没有的提交——解法是 fetch + merge 更新本地再推，不是强推"
        },
        {
          "en": "Safety mechanism（安全机制）",
          "zh": "Git 拒绝可能造成冲突的推送——官方定性：这是好事，防止你覆盖协作者的提交"
        },
        {
          "en": "Merge conflict（合并冲突）",
          "zh": "两边改了同一处、Git 无法自动合并——Assignment 的 GitHub 文档给了两种解法：GitHub 网页上与命令行"
        }
      ],
      "tasks": [
        "在上一课的练习场里亲手复现官方灾难实验：push → rebase -i --root 删掉一个提交 → push --force → git log，再打开 GitHub 页面确认远端文件同样消失——官方要你亲眼看到破坏力",
        "接着练正确姿势：git revert HEAD 撤销一个已推送的提交并正常 push——对比 revert 与 reset+force 两条路的历史形态（revert 只增不改）",
        "把 fetch + merge 修「历史过时」的完整序列走一遍：远端有新提交时 push 被拒 → git fetch origin → git merge origin/main → 再 push",
        "读官方 Assignment 第 1 条：GitHub 的 merge conflicts 文档（资源卡有官方中文版直链「合并冲突」）——重点看文档给出的**两种**解冲突方式：在 GitHub 网页上、在命令行",
        "读官方 Assignment 第 2 条：Think Like (a) Git 全站通读（官方评价：写得非常好，对巩固 Git 理解非常有帮助）——用它的图解把上一课的指针模型再刷一遍",
        "记住四个命令的军规并说给自己听一遍：amend 不碰已推送、rebase 不碰共享仓库、reset 不碰已推送、force 优先换成 --force-with-lease"
      ],
      "quiz": [
        {
          "question": "为什么 git push 被拒绝其实是「好事」？官方给的正确处理序列是什么？",
          "answer": "被拒说明远端有你本地没有的提交（你的历史过时了）——Git 在阻止你覆盖协作者的工作，这是**安全机制**。正确序列：**fetch** 拉下远端更新 → **merge** 合入本地分支 → 再 **push**。绝不是 --force 硬推——那会用你的本地历史覆写远端，别人的提交直接消失。"
        },
        {
          "question": "官方灾难实验里，第四个文件是怎么在本地和 GitHub 上同时消失的？",
          "answer": "序列：git push origin main（正常推送）→ git rebase -i --root 并在交互工具里**删掉** 'Create fourth file' 那行（本地历史改写，文件从本地消失）→ git push --force（用改写后的本地历史**覆写**远端）→ git log 与 GitHub 页面双双确认：提交与文件都没了。协作场景下被抹掉的就是同事的工作——这就是官方说 --force「非常危险、协作时必须谨慎」的实验依据。"
        },
        {
          "question": "已推送的提交信息写错了想撤销，revert 和 reset+force 两条路有什么本质区别？",
          "answer": "**git revert HEAD** 生成一个**新提交**、内容是反转原提交的改动——历史只增不改，正常 push 即可，对协作者零风险；**reset + force push** 是把历史本身改写再覆写远端——别人基于旧提交的工作会断链。所以官方的规则是：撤销已推送的提交用 revert；reset 绝不用于已推送的提交。"
        },
        {
          "question": "--force-with-lease 的「保险丝」是什么机制？为什么有些公司把它设为默认？",
          "answer": "它在推送前**检查目标分支是否被别人更新过**：更新过就报错拒绝推送——给你机会先 fetch 别人的工作、更新本地再决定怎么推。相比裸 --force（无条件覆写），它把「不知道远端变了」这类事故直接挡在门外，所以有些公司规定默认只准用它。"
        },
        {
          "question": "官方给 --force 留了哪些合法场景？五条最佳实践的精神内核是什么？",
          "answer": "合法场景两个：① **更新 pull request**（最常见——比如按评审意见改写自己 PR 分支的历史后强推）；② **敏感信息误传**进仓库、需要移除其所有出现（较少见）。五条最佳实践的内核一句话：改史命令（amend / rebase / reset / force）只在你**独自拥有、未发布**的历史上随意用；历史一旦进入共享空间，修正只用「只增不改」的方式（revert、新提交），且 -f 永远需要你有一个非常好的理由。"
        }
      ],
      "optional": [],
      "note": "官方正文的灾难实验与 revert 演示都基于上一课的练习场仓库——两课连做效果最好。正文引用的视频「Git Revert vs Git Reset」（YouTube，Boot dev 频道）已按真实标题登记资源卡（本站一律不声称有中文字幕）。Assignment 第 1 条 GitHub 文档的英文地址已站内迁移到现行路径（pull-requests/reference/merge-conflicts），资源卡中文链接按现役生效路径登记（「合并冲突」，官方中文版实测在位）。第 2 条 Think Like (a) Git 是英文全站（无官方中文版），官方要求 read the entirety、所有小节都读。",
      "why": "这一课保住的是你职业生涯里最贵的资产之一：团队的代码历史。真实工作里 force push 事故是经典灾难片——CI 断了、同事的分支凭空少了提交、review 记录对不上，而事故报告的第一行几乎总是「有人强推了 main」。学完这课你拥有的不只是四个命令的禁令，而是一套判断框架：这个历史发布了吗？有别人基于它工作吗？有没有只增不改的替代方案？这套判断在下一课的开源工作流里立刻兑现——那里每一步 merge 的方向选择，背后都是这课的安全意识。面试里「revert 与 reset 的区别」「什么时候可以 force push」也是 Git 话题的定番考点，答案你已经亲手实验过了。",
      "sections": [
        {
          "h": "push 被拒：Git 在保护你",
          "p": [
            "官方设定情境：到目前为止你一直在推/拉自己的 GitHub 仓库；从现在开始项目不再只有你一个人。你想把改过的分支推到远程——通常 Git 只允许你在本地分支已包含远端最新提交时推送。",
            "没更新本地就推一个会在远端造成冲突的提交？你会收到报错。官方定性：**这其实是好事**——这是防止你覆盖合作者提交的安全机制（那可能是灾难）。报错的原因：**你的历史过时了**。"
          ]
        },
        {
          "h": "亲手实验：--force 的破坏力",
          "p": [
            "你可能会搜到 git push --force——它**用你的本地历史覆写远程仓库**。协作时会发生什么？官方说：先看看对我们自己会发生什么——终端里依次执行 push origin main、rebase -i --root（在交互工具里删掉 'Create fourth file' 提交）、push --force、git log。",
            "结果：本地找不到第四个文件了；去 GitHub 仓库看——**哦不，我们刚刚销毁了它**。官方把话挑明：这个场景的危险在于——你有可能销毁协作者的工作。**git push --force 是非常危险的命令，与他人协作时必须谨慎使用**。",
            "替代方案：过时的历史报错用 **fetch、merge** 更新本地历史修好，然后再尝试 push。"
          ]
        },
        {
          "h": "撤销已推送的提交：revert 与 with-lease",
          "p": [
            "场景二：新建第五个文件提交推送后，发现提交信息写错了——你会想用 git reset 撤销再强推。**但等等**：force push 非常危险；考虑用它之前，永远先检查是否适当、有没有更安全的命令。",
            "协作中想**撤销**刚做的提交：用 **git revert**——它不需要强推。官方配了视频「Git Revert vs Git Reset」。git revert HEAD 反转 HEAD 的改动（生成反向新提交），然后正常 push origin main 即可。",
            "--force 的合法场景：**更新 pull request** 是最常见的一个（协作细节另有专课）；较少见的如**敏感信息被误传**、要移除它的所有出现。要点：--force 只在你**确定适当**的时候用。",
            "官方特别提名 **git push --force-with-lease**——有些公司的默认选项，因为它是 **fail-safe**：检查你要推的分支是否已被别人更新，更新过就送报错——给你机会先 fetch 更新本地仓库。"
          ]
        },
        {
          "h": "危险与最佳实践：四个命令的军规",
          "p": [
            "官方盘点：commit --amend、rebase、reset、push --force——**与他人协作时全都特别危险**，它们能销毁同事创建的工作。改写历史前，永远检查所用命令的具体危险，并遵守最佳实践。",
            "五条总则：① 团队项目里，确认改写历史是安全的、且别人知道你在做；② 理想情况，这些命令只用在你独自工作的分支上；③ 用 -f 强制应该让你害怕——必须有非常好的理由；④ 不要每个提交都 push——尽量避免改动已发布的历史。",
            "⑤ 逐命令军规：**--amend**：绝不修补已推送到远程仓库的提交；**rebase**：绝不变基别人可能基于其工作的仓库；**reset**：绝不重置已推送到远程仓库的提交；**push --force**：只在适当时用、谨慎用，且最好默认使用 --force-with-lease。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "bash",
          "code": "git push origin main\ngit rebase -i --root\ngit push --force\ngit log",
          "note": "官方灾难实验原码：推送后在交互 rebase 里删掉 'Create fourth file' 提交，再强推——本地与远端的第四个文件双双消失。在练习场里亲手做一次，比读十遍警告都记得牢。"
        },
        {
          "lang": "bash",
          "code": "touch test4.md\ngit add test4.md && git commit -m \"Create fifth file\"\ngit push origin main\ngit log",
          "note": "场景二铺垫原码：推送后发现提交信息写错—— tempting 的路是 reset+强推，但官方的路是下面的 revert。"
        },
        {
          "lang": "bash",
          "code": "git revert HEAD\ngit push origin main",
          "note": "官方安全撤销原码：revert HEAD 生成反转改动的新提交（历史只增不改），正常 push 即可——全程不需要 --force。"
        }
      ],
      "pitfalls": [
        {
          "title": "push 被拒就条件反射 --force",
          "text": "被拒是 Git 的安全机制在说话：你的历史过时了，远端有别人的提交。强推 = 用你的历史覆写远端 = 别人的工作消失。标准动作：git fetch → git merge（或 pull）→ 解决可能的冲突 → 再 push。"
        },
        {
          "title": "用 reset + 强推撤销已推送的提交",
          "text": "官方场景二的正解是 git revert：生成反向新提交、历史只增不改、对协作者零风险。reset 改写历史，配上强推就是把改写发布出去——军规原文：reset 绝不用于已推送的提交。"
        },
        {
          "title": "裸 --force 用在共享分支上",
          "text": "确实需要强推（更新自己的 PR 分支、清敏感信息）时，默认换成 --force-with-lease：目标分支被别人更新过就报错拒绝，先 fetch 再决定。裸 --force 无条件覆写，「不知道远端变了」正是事故的主因。"
        },
        {
          "title": "每个提交都立刻 push",
          "text": "官方最佳实践第 4 条容易被忽视：频繁推送已发布的历史，等于把自己的每次小改都变成别人不可重写的基础——之后想 amend、squash 都投鼠忌器。合理节奏：本地攒成有意义的提交单元再推。"
        }
      ],
      "official": {
        "assignment": [
          "通读 GitHub 关于 merge conflicts（合并冲突）的文档——遇上冲突只是时间问题（如果你还没遇上的话）！冲突看似吓人、其实非常简单；慢慢读这份资料，特别看文档建议的**两种**解决方式：在 GitHub 网页上、在命令行。现在也许用不上，但把这个文档来源记在脑子后面，等你真撞上冲突不知所措时会非常宝贵。",
          "完整读完 Think Like (a) Git（全站所有小节）——这份资料同样值得慢慢读，它写得非常好，对巩固你的 Git 理解非常有帮助。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 git/intermediate_git/working_with_remotes.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "8093f9cbf474152d9afb831043811f683e1047e1d13e6637d370228f2edf2d9b",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "javascript-using-git-in-the-real-world",
      "title": "Using Git in the Real World",
      "zh": "真实世界中的 Git",
      "group": 6,
      "url": "https://www.theodinproject.com/lessons/javascript-using-git-in-the-real-world",
      "summary": "Git 进阶章的收官课，官方定位很特别：**这是一课「遇到麻烦时回来查」的参考课**——Git 基础很直白，但掉进错误情境的反面时像无底洞，而且你总怕乱试会丢数据（官方安抚：Git 其实很难「丢」数据，它多半藏在你想不到去找的地方）。课程两大块：① 协作用的提交信息复习——回指 Commit Messages 课，并特别点名 **Conventional Commits**（协作项目里越来越流行的提交标准，让每条提交信息向读者清晰描述目的；官方建议采用、至少读别人仓库时能认出来）；② 一套**生产级开源工作流**——以给 TOP curriculum 仓库贡献代码为例（官方原话：这正是本网站的贡献者们在用的真实工作流）：upstream（原仓库）/ origin（你的 fork）/ local（本地克隆）三角关系（local 只能从 upstream 拉、不能推），初始设置四步（读 CONTRIBUTING 指南 → Fork → clone 自己的 fork → remote add upstream），日常工作流五步（开功能分支 → fetch upstream → 把 upstream/main 合进本地 main → **把 main 合进你的脏功能分支**——官方解释这个看似奇怪的方向：先让脏分支消化冲突，才能保证反向合并干净 → 解冲突），发 PR 三步（push origin 功能分支 → **官方红线：没有被指派 issue 就停在这里，开测试/练习 PR 会被当 spam 直接关闭** → 完成被指派的 issue 后在 GitHub 界面向 upstream 的 main 发 PR）。",
      "guide": "以下是官方原课的中文化梳理。这一课的价值在于它是**唯一一课把前三课全部串成完整工作流的实战剧本**：指针模型（上一课）解释了为什么 merge 方向有讲究，force 的纪律（上上课）解释了为什么 PR 分支可以安全改写。学习建议：第一遍通读建立地图，重点吃透两个官方反复强调的点——① 「**你的功能分支是脏的**」哲学：合并永远先让「资历浅」的分支消化冲突（upstream/main → 本地 main → 功能分支），这样最终 PR 的合并是干净无冲突的，维护者体验最好；② **fetch + merge = pull 的显式拆解**：官方刻意分两步写，让你看清 pull 内部发生了什么——理解这一点，「pull 还是 fetch」的千年争论就消失了。Conventional Commits 值得现在就上手：feat: / fix: / docs: 前缀让 git log 变成可读的变更史，很多团队的 commitlint 直接按它校验。最后把官方的红线记牢：开源贡献的前提是**被指派的 issue**——没有 issue 就开 PR，无论多好心都会被当 spam 关闭；这条纪律保护的是维护者的评审带宽。官方正文有一张 mermaid 工作流图（upstream → local → fork → PR → merge 回 upstream 的循环），本站按同一结构画了概念图放在「三角关系」一章后面。",
      "understand": [
        "官方定位：Git 基础直白，但掉进令人困惑的错误情境的反面时感觉像**无底洞**；双重挫败感来自「乱搞或试错解法可能丢数据」的担心——官方纠偏：Git 里其实**很难「丢」数据**，但它确实可能藏在你想不到去找的地方（没有经验的开发者翻不到的地方）",
        "官方的学习观：除非记忆力惊人，Git **不能靠读学会**——必须上手练：找个想修的问题、撞一次 merge 错误、沿途 Google 学一个新 Git 技法把它修好。这课设计成**遇到麻烦时回来查**的参考",
        "提交信息复习：协作前先重温好的提交信息（回指 Commit Messages 课）；官方特别点名 **Conventional Commits**——协作项目里越来越流行的提交标准，确保提交信息向任何读者清晰描述目的；建议从现在开始采用（如果你还没用），至少在读别人仓库时能认出来",
        "工作流前提（官方设定）：你想给 TOP curriculum 仓库做贡献，但**没有写权限**；官方假设你已在仓库的 open issue 下留言并被指派——没有被指派 issue 的话，仍可跟着做任意更新，但要在「Sending your pull request」一节第 3 步之前停下（你的改动不是合法的）",
        "**三角关系**：upstream（原始 GitHub 仓库）、origin（你 fork 出的仓库）、local（你对 origin 的本地克隆）——官方比喻「快乐三角」，但 **local 只能从 upstream 拉取、不能推送**",
        "初始设置四步（官方 Initial setup）：① 读项目的 TOP contributing guide（CONTRIBUTING.md）；② 浏览器打开 curriculum 仓库，用右上角 Fork 按钮把**整个仓库**（不是单个文件）复制到你自己的 GitHub 账户；③ 把 fork 克隆到本地（git clone git@github.com:your_user_name_here/curriculum.git）；④ 克隆自带指向 origin（你的 fork）的远程——再手动加一个指向原仓库的远程：git remote add upstream git@github.com:TheOdinProject/curriculum.git",
        "分支模型（官方 Ongoing workflow）：仓库只有一条主分支 **main**——production-ready 代码；推到原仓库 main 的代码会经过 staging 测试再上生产。你在**功能分支**上工作、向 main 提交 pull request",
        "日常工作流第 1 步：为要做的功能开新功能分支，按 Revisiting Rock Paper Scissors 课分支一节的实践添加提交",
        "第 2-3 步（同步上游）：功能做完时，upstream 多半已经有了别人的新改动——你的 main 过时了。**git fetch upstream** 取最新副本，然后 git checkout main + **git merge upstream/main** 把上游改动合进本地 main",
        "第 4 步（官方刻意设计的「反直觉」步骤）：本地 main 更新后，**把它合进你的功能分支**——git checkout your_feature_name + git merge main。官方解释：你确实最终要把功能分支合进 main，**但还不是现在**——**你的功能分支是脏的（dirty）**，不知道有没有冲突；任何时候要把「资历更深」的分支合进来（如功能合入 main），都要尽可能干净无冲突——所以先让 main 合进脏分支、在脏分支里消化冲突",
        "第 5 步：可能有合并冲突——用上一课（Working with Remotes）学的技能解决。官方 Note：git fetch upstream + git merge upstream/some_branch 与 git pull upstream some_branch **完全等价**——这里刻意拆开写，是为了显式地走过每一步",
        "发 PR 三步（官方 Sending your pull request）：① 功能分支已经「干净得发光」、确定能干净合入 main——难的部分全结束了；② git push origin your_feature_name 把功能分支推回你的 origin（fork）——你不能直推 upstream（没权限），所以要发 pull request；③ **官方 critical 警告：如果你没有被指派 issue——停在这里**。不要开测试/练习 PR，此类 PR 会被维护者视为 spam、不经评审直接关闭；被指派的 issue 完成后，最后一步是在 GitHub 界面向 upstream 的 main 发 PR",
        "官方收尾（原话）：Shake your moneymaker, you're an OSS contributor!（摇起来，你是开源贡献者了！）"
      ],
      "terms": [
        {
          "en": "upstream",
          "zh": "原始 GitHub 仓库（你 fork 的源头）——local 只能从它拉取、不能推送；惯例远程名，用 git remote add upstream 手动添加"
        },
        {
          "en": "origin",
          "zh": "你 fork 出的 GitHub 仓库——克隆时自动配置的默认远程，功能分支推回这里再发 PR"
        },
        {
          "en": "Fork",
          "zh": "GitHub 右上角按钮：把整个仓库复制到你的账户——开源贡献的起点（你没有原仓库写权限）"
        },
        {
          "en": "Pull Request（PR）",
          "zh": "请求 upstream 把你的功能分支合并进它的 main——通过 GitHub 界面提交；前提是被指派的 issue"
        },
        {
          "en": "Conventional Commits",
          "zh": "协作项目日益流行的提交信息标准（feat: / fix: 等类型前缀）——让每条提交向读者清晰描述目的"
        },
        {
          "en": "Dirty branch（脏分支）",
          "zh": "官方用语：不知道有没有冲突的功能分支——合并纪律是先让脏分支消化冲突（main 合进 feature），保证反向合并干净"
        },
        {
          "en": "main（production-ready）",
          "zh": "唯一主分支：推到原仓库 main 的代码经 staging 测试后上生产——所有功能分支的 PR 都指向它"
        }
      ],
      "tasks": [
        "先读 Conventional Commits 规范（资源卡有官方中文版「约定式提交」直链）——从下一个提交开始试着用 feat: / fix: / docs: 前缀，让 git log 变成可读的变更史",
        "把三角关系画一遍（或对照本站概念图）：upstream / origin / local 三个节点，标出每条边的方向与命令——特别记住 local → upstream 只有拉取（fetch）、没有推送",
        "在脑子里走一遍完整剧本：Fork → clone → remote add upstream → 开功能分支 → fetch upstream → merge upstream/main 进本地 main → merge main 进功能分支（消化冲突）→ push origin → GitHub 界面发 PR",
        "回答官方留下的思考题：为什么第 4 步是「main 合进功能分支」而不是反过来？（关键词：脏分支先消化冲突，保证 PR 合并干净）",
        "弄清 fetch + merge 与 pull 的关系：官方 Note 说 git fetch upstream + git merge upstream/some_branch 与 git pull upstream some_branch 完全等价——想想为什么官方仍选择拆开写（显式走过每一步）",
        "把官方红线抄进你的贡献清单：没有被指派的 issue，绝不开测试/练习 PR（会被当 spam 关闭）；想贡献就先去 issue 列表找想修的、留言认领",
        "（延伸，非官方要求）浏览 TOP curriculum 仓库的 issue 列表与 CONTRIBUTING.md，感受一下真实开源项目的贡献入口长什么样——这是你结课后就能参与的社区"
      ],
      "quiz": [
        {
          "question": "upstream / origin / local 三角关系里，每条边各是什么？哪条边是单向禁推的？",
          "answer": "upstream = 原始 GitHub 仓库（TOP/curriculum），origin = 你 fork 到自己账户的副本，local = 你对 origin 的本地克隆。边：local ↔ origin 双向（clone/pull 拉、push 推）；local ← upstream **只能拉取（fetch），不能推送**——你对原仓库没有写权限，改动只能通过 PR 进入 upstream；origin → upstream 走 GitHub 界面的 Pull Request。"
        },
        {
          "question": "官方工作流第 4 步为什么是「把 main 合进你的功能分支」，而不是把功能分支合进 main？",
          "answer": "官方原话逻辑：你最终确实要把功能合进 main，**但还不是现在**——你的功能分支是**脏的**（dirty）：不知道里面有没有冲突。任何时候把「资历更深」的分支合进来（功能 → main），都希望是干净无冲突的合并——所以先把 main 合进脏分支、**在脏分支里消化掉全部冲突**，之后的 PR 合并就是干净的，维护者不需要替你解冲突。"
        },
        {
          "question": "git fetch upstream 加 git merge upstream/main 与 git pull upstream main 是什么关系？官方为什么选前者？",
          "answer": "**完全等价**——官方 Note 原话：fetch + merge 与 pull 是同一件事。官方刻意拆开写，是为了**显式地走过每一步**：fetch 只是把上游改动取到本地的 upstream/main 引用（不动你的分支），merge 才把它合进当前分支——拆开能让你看清 pull 内部发生的两件事，也方便在 fetch 之后、merge 之前先用 git log upstream/main 看看上游改了什么。"
        },
        {
          "question": "官方对「没有被指派 issue 的人」划了什么红线？为什么？",
          "answer": "critical 级警告：**如果你没有被指派 issue——停在 push 那一步，不要开 PR**。不要开测试/练习性质的 PR；此类 PR 会被维护者视为 **spam**、不经评审直接关闭。原因是维护者的评审带宽是开源项目最稀缺的资源——PR 必须对应一个被认领的 issue，改动才是「合法的」（官方前文：没有 issue 可以跟着做任意更新练习，但要在发 PR 之前停下）。"
        },
        {
          "question": "Conventional Commits 是什么？官方对这课的两个提交信息建议分别是什么？",
          "answer": "一个在协作项目中**越来越流行**的提交信息标准：用类型前缀（如 feat: / fix: / docs:）让每条提交向任何读者清晰描述自己的目的。官方两个建议：① 复习 Foundations 的 Commit Messages 课（好提交信息的基本功）；② 从现在开始采用 Conventional Commits（如果你还没用）——或者至少在你读别人的仓库时能认出它们。"
        }
      ],
      "optional": [],
      "note": "官方正文回指三处站内课页（Commit Messages 复习、Revisiting Rock Paper Scissors 的分支实践、Working with Remotes 的冲突解决技能）——按既有口径站内课页不登记资源卡，正文讲解里已给出回指。Assignment 设定的贡献对象是 TOP curriculum 仓库本体（github.com/TheOdinProject/curriculum 及其 CONTRIBUTING.md 与 issues 页）——TOP 自有仓库与练习操作目标，按既有口径不登记资源卡。正文的 Conventional Commits 为官方点名重点（登记资源卡，有官方中文版「约定式提交」）。官方正文有一张 mermaid 工作流图，本站按同一结构绘制概念图（git-oss-workflow，归位「三角关系」章后）。",
      "why": "这一课是你从「课程学生」变成「开源贡献者」的通行证。它教的不是新命令，而是把前三课的每个零件装进一台真实运转的机器：TOP 自己的网站就是这么维护的——你读的这门课程的每一次更新，都走过你刚学完的这条流水线。结课后你可以立刻用它：curriculum 仓库的 issue 列表里永远有标着 good first issue 的条目在等新人，而全世界绝大多数开源项目的贡献流程与这套剧本同构（fork → 功能分支 → 同步上游 → PR）。求职时它也是简历素材：一个被合并的 PR 比任何「熟悉 Git」的自述都有说服力。至于 Conventional Commits，你入职的第一家使用 commitlint 的公司会替你感谢官方在这一课点了名。",
      "sections": [
        {
          "h": "Git 要靠用学：本课的使用说明",
          "p": [
            "官方开篇共情：Git 基础非常直白，但当你发现自己掉进一个令人困惑的错误情境的**反面**时，它有时感觉像无底洞。双重挫败：你以为搞砸了或试错解法会丢数据。",
            "官方安抚 + 纠偏：Git 里其实**很难「丢」数据**——但它确实可能藏在没有经验的开发者想不到去找的地方。",
            "学习观：除非你有惊人记忆，Git **不能只靠读学会**——需要上手练：找个想修的问题、撞一次 merge 错误、沿途 Google 学个新技法修好它。所以官方把这课设计成：**遇到麻烦时再回来查**。课程两大块：提交信息复习 + 一套真实 GitHub 工作流（就用在 TOP 这个项目上）。"
          ]
        },
        {
          "h": "协作用的提交信息",
          "p": [
            "进入工作流之前，官方先让你花一分钟重温好的提交信息（回指 Commit Messages 课）。",
            "特别点名 **Conventional Commits**：一个在协作项目里**越来越流行**的提交标准——它确保你的提交信息向任何读者清晰描述提交的目的。官方建议：从现在开始采用它们（如果你还没用！），或者至少在你读其他仓库时能意识到它们的存在。"
          ]
        },
        {
          "h": "三角关系：upstream、origin、local",
          "p": [
            "官方设定剧本：假设你想给 TOP curriculum 仓库做贡献。**没有写权限的仓库怎么贡献？**下面是本网站贡献者真实在用的生产级工作流。前提：你已在仓库的 open issue 下留言并被指派——没有被指派也可以跟着做任意更新，但要在「发 PR」一节第 3 步前停下（你的改动不是合法的）。",
            "三个角色：**upstream**（原始 GitHub 仓库）、**origin**（你对该仓库的 fork）、**local**（你对 origin 的本地克隆）。官方比喻：一个快乐三角——除了 **local 只能从 upstream 拉取、不能推送**。",
            "官方正文附一张 mermaid 工作流图，环路是：Upstream（TheOdinProject/curriculum）→ git fetch upstream/main → Local main → git checkout 功能分支 → git push origin 功能分支 → 你的 Fork → 在 GitHub 上向 Upstream 创建 Pull Request → 维护者把 PR 合并进 Upstream → 回到起点。本站按同一结构绘制了概念图。",
            "**初始设置四步**：① 读项目的 TOP contributing guide；② 浏览器打开 curriculum 仓库，用右上角 Fork 按钮把**整个仓库**（不是单个文件）复制进你自己的 GitHub 账户；③ 克隆你 fork 的仓库到本地（形如 git clone git@github.com:your_user_name_here/curriculum.git，地址从仓库页右侧小部件获取）；④ 克隆已自带指向 origin 的远程（用来推改动回 GitHub）——再添加一个能直接从原仓库拉取的远程：git remote add upstream git@github.com:TheOdinProject/curriculum.git。"
          ]
        },
        {
          "h": "日常工作流：脏分支哲学",
          "p": [
            "官方分支模型：仓库只有一条主分支 **main**——production-ready 代码；任何部署到原仓库 main 的代码都会经过 staging 测试再上生产。你在功能分支上工作、向 main 提交 PR。",
            "五步走：① 为想做的功能**开新功能分支**，按 Revisiting Rock Paper Scissors 课分支一节的实践添加提交；② 功能做完时 upstream 多半已被别人更新——你的 main 过时了，**git fetch upstream** 取最新副本；③ git checkout main 确认在主分支上，**git merge upstream/main** 把刚取的上游改动合进本地 main；④ 本地 main 更新后，**把它合进你的功能分支**——git checkout your_feature_name 再 git merge main；⑤ 可能有合并冲突——用 Working with Remotes 课学的技能解决。",
            "官方解释第 4 步的「反直觉」：是的，你没看错，它一开始确实显得奇怪。你难道不想把功能分支合进 main 吗？想，**但还不是现在**——**你的功能分支是脏的**：你不知道它有没有潜伏的冲突。任何时候要把「资历更深」的分支合进来（比如功能合入 main），你都希望那是干净、无冲突的合并——所以先把「深」分支合进你的脏分支，把冲突消化在自己这边。",
            "官方 Note（显式化）：git fetch upstream 接 git merge upstream/some_branch 与 git pull upstream some_branch **完全等价**——这里偏好拆开写，好让我们显式地走过每一步。"
          ]
        },
        {
          "h": "发 PR 与官方红线",
          "p": [
            "① 现在你的功能分支已经 squeaky clean（干净得发光）、你确定它能干净合入 main——**难的部分全结束了**；② 把功能分支送回你的 origin：git push origin your_feature_name——你不能直接送进 upstream（没有权限），所以要发 pull request。",
            "官方 critical 级警告（Don't open unnecessary PRs）：**如果你没有被指派要做的 issue——停在这里**。不要开测试/练习 PR；任何此类 PR 会被视为 **spam**，由维护者不经评审直接关闭。被维护者指派了 issue 才继续下一步。",
            "③ **完成了被指派的 issue** 的话，最后一步是提交 pull request，把你的功能分支合并进原 upstream 仓库的 main 分支——在 GitHub 界面上完成。",
            "官方收尾原话：Shake your moneymaker, you're an OSS contributor!（摇起来——你是开源贡献者了！）"
          ]
        }
      ],
      "examples": [
        {
          "lang": "bash",
          "code": "git remote add upstream git@github.com:TheOdinProject/curriculum.git",
          "note": "初始设置第 4 步原码：给本地仓库添加指向原仓库的第二个远程（惯例名 upstream）——克隆自带的 origin 指向你的 fork，upstream 才是拉取上游更新的来源。"
        },
        {
          "lang": "bash",
          "code": "git fetch upstream\ngit checkout main\ngit merge upstream/main\ngit checkout your_feature_name\ngit merge main",
          "note": "日常工作流 2-4 步原码：取上游 → 本地 main 同步上游 → main 合进功能分支（脏分支先消化冲突）。官方 Note：fetch + merge 与 git pull upstream main 完全等价，拆开写是为了显式走过每一步。"
        },
        {
          "lang": "bash",
          "code": "git push origin your_feature_name",
          "note": "发 PR 第 2 步原码：功能分支推回你的 fork（origin）——不能直推 upstream（没有写权限），随后在 GitHub 界面创建指向 upstream main 的 Pull Request。没有被指派 issue 的话，官方红线：停在这一步。"
        }
      ],
      "pitfalls": [
        {
          "title": "没有 issue 就开练习 PR",
          "text": "官方 critical 级红线：没有被指派的 issue，push 到 fork 之后就停下——测试/练习性质的 PR 会被维护者当 spam 不经评审直接关闭。想练流程就在自己 fork 里走完 push 为止；想真贡献就去 issue 列表认领。这条纪律保护的是维护者最稀缺的评审带宽。"
        },
        {
          "title": "跳过「main 合进功能分支」直接发 PR",
          "text": "第 4 步看似绕（最终不是要功能合进 main 吗），实则是给维护者减负的关键：你的功能分支是脏的——冲突必须在**你这边**消化完，PR 的合并才是干净的。跳过这步，冲突就会暴露在维护者的合并界面上，轻则打回重做、重则 PR 搁置。"
        },
        {
          "title": "直接在本地 main 上开发功能",
          "text": "官方模型里 main 只有一个职责：保持与 upstream/main 同步的 production-ready 基线。功能开发一律开功能分支——main 被功能提交污染后，第 3 步的同步合并就会把「你的改动」和「上游的改动」搅在一起，脏分支哲学的前提（main 是干净的深分支）就塌了。"
        },
        {
          "title": "把 fetch 和 pull 当成两件事学",
          "text": "官方 Note 说透了：git pull upstream some_branch 就是 git fetch upstream + git merge upstream/some_branch——完全等价。把它们当两个独立命令死记，遇到「pull 之后冲突从哪来的」这类问题就会懵；记住 pull = fetch（取）+ merge（合），每一步都显式可控。"
        }
      ],
      "official": {
        "assignment": [
          "设定：你想给 TOP curriculum 仓库做贡献，但没有写权限——下面是本网站贡献者真实在用的生产级工作流。官方假设你已在仓库的 open issue 下留言并被指派；没有被指派的话仍可跟着做任意更新，但要在「Sending your pull request」第 3 步之前停下（你的改动不是合法的）。",
          "Initial setup（初始设置）四步：① 读项目的 TOP contributing guide；② 浏览器打开 curriculum 仓库，用右上角 Fork 按钮把整个仓库复制进你的 GitHub 账户；③ 把 fork 克隆到本地（git clone git@github.com:your_user_name_here/curriculum.git 形态）；④ 在项目文件夹里 git remote add upstream git@github.com:TheOdinProject/curriculum.git——origin 指向你的 fork 用来推送，upstream 指向原仓库用来拉取。",
          "Ongoing workflow（日常工作流）：仓库只有一条 main（production-ready，部署后经 staging 测试上生产）；你在功能分支工作、向 main 提 PR。五步：① 开新功能分支（按 Revisiting Rock Paper Scissors 课分支一节的实践提交）；② 功能做完时 upstream 多半已更新——git fetch upstream 取最新；③ git checkout main 后 git merge upstream/main 同步本地 main；④ git checkout your_feature_name 后 git merge main——你的功能分支是脏的，先让它消化冲突，保证之后反向合并干净；⑤ 有冲突用 Working with Remotes 课的技能解决。（官方 Note：fetch + merge 与 pull 完全等价，拆开是为显式走过每一步。）",
          "Sending your pull request（发 PR）：① 功能分支已干净、确定能干净合入 main——难的部分结束了；② git push origin your_feature_name 推回你的 fork（不能直推 upstream，所以走 PR）；③ **critical 红线：没有被指派的 issue 就停在这里——测试/练习 PR 会被视为 spam、由维护者不经评审直接关闭**；完成被指派的 issue 后，最后一步是在 GitHub 界面向 upstream 的 main 提交 pull request。Shake your moneymaker, you're an OSS contributor!"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 git/intermediate_git/using_git_in_the_real_world.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "b2b89d7354c5009cb7c91a928ceeab846c44deade6115e5eb61736f3ae431f8c",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-javascript-battleship",
      "title": "Project: Battleship",
      "zh": "项目：战斗舰",
      "group": 7,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-battleship",
      "summary": "javascript 课程的收官项目，也是全站 TDD 纪律的期末考：**用测试驱动开发完整实现经典游戏「战斗舰」**。官方开题就说这是「真正活动筋骨」的时刻——TDD 一开始会不舒服，练多了才自然；没玩过规则的可以先读维基条目、玩一局在线版。因为要用 TDD，官方特别提醒**别被吓倒：一次一步，先写测试、再让它通过**；这个项目跨模块的活动部件比以往任何用过测试的项目都多，拿不准测什么、怎么测就回看 More Testing 课。范围红线官方也划了：网页外观的测试需要另一套工具、不在本单元范围——**这个项目不要测 DOM**，尽全力把应用功能与 DOM 操作隔离开。Assignment 五大步：**Ship** 类/工厂（length、被击次数、是否沉没；**只测公开接口**——只有被 ship 对象外部使用的方法或属性才需要单元测试；hit() 增加击中数、isSunk() 按长度与击中数计算）；**Gameboard**（先不做任何 UI——**靠跑测试就知道代码在成形**，别依赖 console.log 或 DOM 方法；按坐标放船；receiveAttack 接一对坐标、判断命中与否、命中就把 hit 送给正确的船、未中记录坐标；跟踪所有 miss 以便正确显示；能报告是否全部船已沉没）；**Player**（real 与 computer 两类，每个玩家对象自带自己的 gameboard）；**DOM 驱动**（把类/工厂导入另一个文件，用事件监听器驱动游戏、建一个管理 DOM 动作的模块：先用预定坐标铺双方棋盘开局；渲染两块棋盘的方法放进合适的模块；事件监听器只调用其他对象的方法逐回合推进——**想写新函数时退一步想它该属于哪个类或模块**；攻击 = 点击敌方棋盘坐标 → 把输入送给对象方法 → 重渲染；玩家轮流攻击；computer 随机但**合法**地打——不许同一坐标打两次；一方全沉即游戏结束——这个函数也适合放这个模块）；**收尾**（实现让玩家摆放自己船的系统：输入坐标、或按钮循环随机摆放）。Extra credit 三条：拖放摆船；双人热座模式（传笔记本或转显示器）+「传递设备」过渡屏防止偷看对方棋盘；computer 命中后尝试相邻格子（打磨智能）。Jest 的 ESM 支持照旧需要 Babel 配置（官方警告块回指 Testing Basics 课）。",
      "guide": "以下是官方原课的中文化梳理（Project 课：本站不提供成品代码，examples 为空数组——官方正文没有成品代码，全部要求按文字转述）。这是测试章节学完之后的「合龙」项目：Testing Basics 教你搭 Jest 环境、Testing Practice 让你逐函数练 TDD、More Testing 给你隔离与 mocking 的心法——Battleship 要求你把三课的全部纪律用在一个真实规模的多模块应用上。动手顺序建议按官方的五大步严格走，而且**每一步内部也保持 TDD 循环**：Ship 最简单（纯逻辑、公开接口就 hit/isSunk/length），先把它测完写完；Gameboard 是主菜（放船合法性、receiveAttack 的命中/未中分流、miss 记录、全沉报告——每一行为都先写会失败的测试）；Player 只是「带类型的 gameboard 持有者」；DOM 模块放最后——官方明说这一步才「适合开始做 UI」，而且**不要测 DOM**：把渲染与事件绑定关在这个模块里，游戏逻辑全部住在可测试的纯对象里。这个「逻辑与 DOM 隔离」正是 More Testing 课「紧耦合代码」讨论的实战版：如果你发现某个行为没法不碰 DOM 就测不了，说明隔离没做好，退回去重新分层。computer 玩家的「随机但合法」是个有趣的测试练习：随机性本身难测，但「不打重复坐标」「只打 10×10 范围内」这些约束完全可以测。Extra credit 的三条（拖放、热座双人 + 传递设备屏、命中后搜相邻格）都在主线完成后做——尤其第三条会让你的 computer 从「乱打」升级成「会 hunting」，值得挑战。",
      "understand": [
        "官方开题：是时候真正活动筋骨了——TDD 一开始肯定不舒服，练习多了会变得自然；我们要实现经典游戏「战斗舰」（Battleship）。没玩过或需要复习规则：可以读维基的 Battleship 规则条目、玩一局在线版",
        "官方 TDD 提醒：因为我们在做 TDD，**别被吓倒（don't get overwhelmed）——一次一步：写一个测试，然后让它通过**。这个项目跨模块的活动部件比之前任何用过测试的项目都多；拿不准测什么或怎么下手时，回看 More Testing 课的思路与 Assignment",
        "**范围红线（官方明说）**：我们还没讲过测试网页**外观**——那需要另一套工具、超出本单元范围（课程后面会讲）。因此这个 Assignment **不要测 DOM**；作为替代，尽全力把每一块应用功能与真正的 DOM 操作部分**隔离**开",
        "**第 1 步 Ship 类/工厂**：船是包含 **length（长度）、被击中次数、是否已沉没**的对象；官方加粗提醒 **REMEMBER：只需要测对象的公开接口**——只有被 ship 对象**外部**使用的方法或属性才需要单元测试；**hit()** 函数增加船的击中数；**isSunk()** 函数基于长度与已受击中数计算船是否算沉没",
        "**第 2 步 Gameboard 类/工厂**：注意我们**还没创建任何用户界面**——官方原话：**我们应该靠运行测试就知道代码在成形**，不应该依赖 console.log 或 DOM 方法来确认代码在做你期望的事。Gameboard 要能：通过调用 ship 工厂或类**在特定坐标放置船**；**receiveAttack** 函数接收一对坐标——判断攻击是否命中，命中就把 hit 函数送给正确的船，未中则**记录未中弹的坐标**；**跟踪所有 miss** 以便正确显示；能**报告是否所有船都已沉没**",
        "**第 3 步 Player 类/工厂**：游戏有两类玩家——**real（真人）**与 **computer（电脑）**；每个玩家对象包含**自己的 gameboard**",
        "**第 4 步 DOM 驱动**：把类/工厂导入另一个文件，用**事件监听器**与对象交互来驱动游戏；创建一个帮你管理 DOM 中应发生动作的**模块**——官方：到这个点才开始做用户界面是适当的。子步骤：创建 Players 开新局（**先用预定坐标**铺每个玩家的 Gameboard——允许玩家自己摆船的系统最后一步再做）；HTML 实现官方留给你，但要**显示双方棋盘**、用 Gameboard 类/工厂的信息渲染（渲染每块棋盘的方法放进合适的模块）；事件监听器**只调用其他对象的方法**、逐回合推进游戏——**任何时候你想写一个新函数，退一步、弄清它该属于哪个类或模块**；攻击：让用户**点击敌方 Gameboard 的坐标**——把用户输入送给你对象上的方法、重渲染棋盘显示新信息；玩家**轮流**攻击敌方棋盘（若要跟踪当前回合，放这个模块里管理是适当的，而不是放别的对象）；游戏对战电脑——让 computer 玩家能**随机出招**：电脑不必聪明，但必须知道一步棋是否**合法**（即不该同一坐标打两次）；创建**游戏结束条件**：一方船全部被击沉即结束——这个函数也适合放这个模块",
        "**第 5 步收尾**：实现让玩家**摆放自己的船**的系统——例如让玩家为每艘船输入坐标，或做一个按钮循环随机摆放",
        "**Extra credit（官方三条）**：① 实现**拖放**摆船；② 创建**双人选项**：传笔记本轮流、或台式机转显示器——并实现「**传递设备**」过渡屏，让玩家看不到对方的棋盘；③ 打磨电脑玩家智能：**命中后尝试相邻格子**"
      ],
      "terms": [
        {
          "en": "Ship（船对象）",
          "zh": "length + 被击中次数 + isSunk 计算；公开接口才写单元测试（hit / isSunk 等被外部调用的方法）"
        },
        {
          "en": "Gameboard（棋盘）",
          "zh": "放船、receiveAttack（命中送 hit / 未中记坐标）、跟踪 miss、报告全沉——纯逻辑对象，靠测试确认成形"
        },
        {
          "en": "receiveAttack",
          "zh": "接收一对坐标：命中 → 把 hit() 送给正确的船；未中 → 记录坐标以便显示"
        },
        {
          "en": "Player（real / computer）",
          "zh": "两类玩家，各自持有自己的 gameboard；computer 随机但合法地出招（不打重复坐标）"
        },
        {
          "en": "DOM module（DOM 管理模块）",
          "zh": "渲染双棋盘、事件监听、回合管理、游戏结束条件全住这里——应用逻辑与 DOM 操作的隔离边界"
        },
        {
          "en": "Public interface（公开接口）",
          "zh": "官方加粗的测试范围纪律：只有被对象外部使用的方法或属性才需要单元测试——内部实现细节不测"
        },
        {
          "en": "predetermined coordinates（预定坐标）",
          "zh": "第 4 步开局的临时方案：先用固定坐标铺船跑通 UI，玩家自主摆船系统留到第 5 步"
        }
      ],
      "tasks": [
        "没玩过先补课：读资源卡里的维基「海战棋」条目（官方中文版）搞清规则，再去在线版玩一局——知道游戏怎么玩，才知道对象该怎么设计",
        "开工前确认环境：Jest 的 ESM 支持需要 Babel 配置（官方警告块回指 Testing Basics 课的对应小节）——npx jest 能跑起来再动手",
        "TDD 做 Ship：先写 hit() 与 isSunk() 的失败测试（长度 3 的船中 2 弹不沉、中 3 弹沉），再写实现让它通过——记住官方纪律：只测公开接口",
        "TDD 做 Gameboard：按行为逐个写测试——放船、receiveAttack 命中分流到正确的船、未中记录坐标、重复攻击同一坐标的处理（官方没规定——自己先写测试拍板）、全沉报告；全程不碰 console.log 与 DOM，靠测试知道代码在成形",
        "做 Player：real 与 computer 两类、各自持有 gameboard——computer 的「随机但合法」（不打重复坐标、在棋盘范围内）值得写测试",
        "最后才做 DOM 模块：预定坐标开局 → 渲染双棋盘 → 点击敌方坐标攻击 → 轮流回合 → 全沉结束；每写一个新函数前退一步问：它该属于哪个类或模块？",
        "收尾第 5 步：玩家自主摆船系统（输入坐标或随机摆放按钮）——做完主线再挑战 Extra credit 三条（拖放 / 热座双人 + 传递设备屏 / 电脑命中后搜相邻格）",
        "全程守住范围红线：不测 DOM——如果发现某个行为不碰 DOM 就没法测，说明逻辑与渲染没隔离好，退回去重新分层"
      ],
      "quiz": [
        {
          "question": "官方为什么明说「不要测 DOM」？替代要求是什么？",
          "answer": "测试网页**外观**需要另一套工具，超出本单元范围（课程后面会讲）。替代要求是**隔离**：尽全力把每一块应用功能与真正的 DOM 操作部分隔离开——游戏逻辑全部住在可被 Jest 直接测试的纯对象里（Ship / Gameboard / Player），DOM 模块只负责渲染与事件转发。这也是检验分层质量的尺子：某个行为不碰 DOM 就没法测 = 隔离没做好。"
        },
        {
          "question": "「只测公开接口」这条官方加粗纪律在 Ship 对象上怎么落地？",
          "answer": "只有被 ship 对象**外部**使用的方法或属性才需要单元测试——hit()（外部棋盘命中时调用）与 isSunk()（外部查询状态）要测；如果内部有用到但不暴露的辅助逻辑（比如私有计数细节），不为它单独立测试。测行为不测实现：断言「中 3 弹后 isSunk() 为 true」，而不是断言内部计数器变量长什么样——这正是 Testing Practice 课 analyzeArray 练过的思路。"
        },
        {
          "question": "Gameboard 阶段官方说「应该靠什么知道代码在成形」？为什么这时不做 UI？",
          "answer": "官方原话：**靠运行测试**就知道代码在成形——不应该依赖 console.log 或 DOM 方法来确认代码在做你期望的事。这时不做 UI 是 TDD 的顺序纪律：Gameboard 是纯逻辑（放船、receiveAttack、miss 记录、全沉报告），先把逻辑用测试钉死，UI 只是它的一个「显示器」——第 4 步官方才说「到这个点开始做用户界面是适当的」。"
        },
        {
          "question": "computer 玩家的官方要求是「聪明」吗？它的合法性约束是什么？哪部分值得写测试？",
          "answer": "不是——官方原话：电脑**不必聪明**，但应该知道一步棋是否**合法**：不该同一坐标打两次。随机性本身难测，但约束完全可测：出招坐标在棋盘范围内、不重复攻击已打过的坐标。Extra credit 第三条才是「聪明」升级：命中后尝试相邻格子（hunting 策略）。"
        },
        {
          "question": "第 4 步开局为什么先用「预定坐标」铺船？事件监听器写法的官方纪律是什么？",
          "answer": "预定坐标是**临时方案**：先把「创建 Players → 渲染双棋盘 → 攻击 → 回合 → 结束」的主循环跑通，玩家自主摆船系统官方明确留到第 5 步再做——一次一步，不被多线任务压垮。事件纪律：监听器**只调用其他对象的方法**、逐回合推进；官方原话——任何时候你想写一个新函数，**退一步、弄清它该属于哪个类或模块**（而不是顺手塞进事件回调里）。回合跟踪与游戏结束条件都适合住 DOM 管理模块。"
        }
      ],
      "optional": [
        {
          "title": "Extra credit ①：拖放摆船",
          "zh": "实现 drag and drop 让玩家摆放自己的船——比输入坐标体验好一个档次，也是第一次在非教程环境碰 HTML5 拖放 API。"
        },
        {
          "title": "Extra credit ②：双人热座 + 传递设备屏",
          "zh": "两位真人轮流（传笔记本或转显示器），并实现「传递设备」过渡屏——换人时遮住棋盘，防止看到对方的船位。"
        },
        {
          "title": "Extra credit ③：电脑 hunting 智能",
          "zh": "computer 命中后尝试相邻格子——从「乱打」升级成「会追猎」：命中意味着附近可能有整条船，优先打上下左右。"
        }
      ],
      "note": "官方 Assignment 开头的警告块：Jest 对 ESM 没有内建稳定支持——需按 Testing Basics 课 Tip 配置 Babel（@babel/preset-env@^7 + babel.config.js）。正文回指 More Testing 课（拿不准测什么就回看）与维基规则条目、在线版游戏（登记资源卡，维基有官方中文版「海战棋」）。官方对「重复攻击同一坐标」等行为未作规定——按 Testing Practice 课 caesarCipher 的先例：官方没规定的空白，自己先写测试拍板行为。DOM 外观测试官方明说后续课程会讲（本站尚未开放对应课程，如实转达）。",
      "why": "这是 javascript 课程的收官项目，也是你第一次在「真实规模」上证明 TDD 不是练习题仪式：五个模块、两类玩家、逻辑与 DOM 的严格隔离——任何一处偷懒（先写实现再补测试、把游戏逻辑漏进事件回调），项目后半段都会用纠缠不清的 bug 还给你。它同时是前四章的总汇：Ship/Gameboard 用类或工厂（组织代码章）、回合与事件用 DOM 模块（基础章）、全部行为用 Jest 钉死（测试章）、电脑玩家与棋盘搜索延续算法思维（CS 章——Extra credit 的 hunting 策略甚至能让你回味 BFS）。做完它，你的作品集里就有了第一个「带完整测试套件」的应用——这在求职市场是稀缺品：绝大多数初级候选人的项目没有一个测试。",
      "sections": [
        {
          "h": "开题：TDD 的期末考",
          "p": [
            "官方开题：是时候真正活动筋骨了（flex your muscles）。TDD 一开始肯定会不舒服，但练习会让它变得自然。我们要实现经典游戏「战斗舰」——没玩过或需要复习，可以读维基的 Battleship 规则条目、玩一局在线版（资源卡有直链，维基条目有官方中文版「海战棋」）。",
            "官方 TDD 纪律提醒：因为在做 TDD，**别被吓倒——一次一步：写一个测试，然后让它通过**。这个项目跨模块的活动部件比以往任何用过测试的项目都多；拿不准测什么、怎么下手，回看 More Testing 课的思路与 Assignment。",
            "**范围红线**：我们还没讨论过测试网页外观——那需要另一套工具、超出本单元范围（课程后面会讲）。因此：**不要测 DOM**；替代要求是尽全力把每一块应用功能与真正的 DOM 操作部分隔离开。"
          ]
        },
        {
          "h": "五大步：从 Ship 到摆船系统",
          "p": [
            "**第 1 步 Ship**：创建 Ship 类/工厂（二选一随你）。船是包含 length、被击中次数、是否沉没的对象；官方加粗 **REMEMBER：只测公开接口**——只有被 ship 对象外部使用的方法或属性才需要单元测试。hit() 增加击中数；isSunk() 基于长度与击中数计算是否沉没。",
            "**第 2 步 Gameboard**：注意还没创建任何 UI——官方原话：**我们应该靠运行测试就知道代码在成形**，不依赖 console.log 或 DOM 方法。要求：通过调用 ship 工厂/类在特定坐标放船；receiveAttack 接收一对坐标、判断命中、命中把 hit 送给正确的船、未中记录坐标；跟踪 miss 以便正确显示；能报告是否全部船已沉没。",
            "**第 3 步 Player**：两类玩家——real 与 computer；每个玩家对象包含自己的 gameboard。",
            "**第 4 步 DOM 驱动**：把类/工厂导入另一个文件，用事件监听器驱动游戏；创建管理 DOM 动作的模块——**到这个点开始做 UI 是适当的**。先用预定坐标开局；显示双方棋盘、用 Gameboard 的信息渲染（渲染方法放合适的模块）；监听器只调用其他对象的方法逐回合推进——**想写新函数就退一步想它属于哪个类/模块**；点击敌方棋盘坐标攻击 → 输入送给对象方法 → 重渲染；玩家轮流；computer 随机但合法（不打同一坐标两次）；一方全沉即结束（结束条件也住这个模块）。",
            "**第 5 步收尾**：实现玩家摆放自己船的系统——输入坐标、或按钮循环随机摆放。"
          ]
        },
        {
          "h": "Extra credit 与工程余味",
          "p": [
            "官方三条加分项：① 拖放摆船；② 双人热座（传笔记本或转显示器）+「传递设备」过渡屏防偷看；③ computer 命中后尝试相邻格子（hunting 智能）。",
            "本站建议的验收姿势（非官方内容）：跑一遍你的测试套件——它应该是这个游戏唯一的「说明书」：每个测试名说清一条行为，全绿即游戏逻辑全部按规格工作；DOM 模块薄到只剩渲染与事件转发。这正是 More Testing 课「隔离」的实战标准。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "先写实现再补测试（TDD 顺序反转）",
          "text": "官方开题就压了这个纪律：一次一步——**写一个测试，然后让它通过**。Battleship 模块多，先写实现再补测试的诱惑比以往任何项目都大；一旦反转，测试就退化成「验证我写的东西」而不是「定义它该做什么」——receiveAttack 的命中/未中分流、重复坐标处理这些边界恰恰是反转后最容易漏测的。"
        },
        {
          "title": "把游戏逻辑漏进 DOM 模块",
          "text": "官方红线是「不测 DOM + 隔离功能与 DOM 操作」——如果回合推进、胜负判断、攻击判定写进了事件回调或渲染函数，它们就测不到了。分层标准：DOM 模块只做渲染与事件转发，每个行为都能落回 Ship/Gameboard/Player 的某个方法；想写新函数时按官方纪律退一步问它属于哪个类/模块。"
        },
        {
          "title": "用 console.log 确认代码在工作",
          "text": "官方在 Gameboard 一步点名这个习惯：**应该靠运行测试就知道代码在成形**——console.log 与 DOM 检查都不是证据。测试全绿才是。这个习惯带到工作里就是 CI 的雏形：行为有断言背书，重构才有安全网。"
        },
        {
          "title": "computer 玩家打出非法棋",
          "text": "官方对电脑的要求只有一条：随机但**合法**——不该同一坐标打两次（且坐标得在棋盘内）。实现时给已打坐标记账（Set 或标记数组），出招前先过滤；这条约束本身就该有测试：模拟多次出招，断言无重复。"
        },
        {
          "title": "一上来就做摆船 UI",
          "text": "官方把「玩家自主摆船」明确排在第 5 步——第 4 步先用**预定坐标**开局跑通主循环。顺序反了会同时在两条战线上调试（摆船交互 + 游戏主循环），违反「一次一步」；先用硬编码坐标把回合、攻击、胜负全部跑通，再回头做摆船系统。"
        }
      ],
      "official": {
        "assignment": [
          "（官方警告块）Jest 对 ESM 没有内建稳定支持——需要为 Jest 的 ESM/CJS 转换设置 Babel（回指 Testing Basics 课的 Using ES6 import statements with Jest 小节）。",
          "第 1 步：创建 Ship 类/工厂（你的选择）。船是包含 length、被击中次数、是否沉没的对象；**REMEMBER：只需测对象的公开接口**——只有被 ship 对象外部使用的方法或属性需要单元测试；hit() 增加击中数；isSunk() 基于长度与击中数计算是否沉没。",
          "第 2 步：创建 Gameboard 类/工厂。注意还没创建任何 UI——**应该靠运行测试就知道代码在成形**，不依赖 console.log 或 DOM 方法；Gameboard 能通过调用 ship 工厂/类在特定坐标放船；receiveAttack 接收一对坐标、判断攻击是否命中、把 hit 送给正确的船或记录未中坐标；跟踪 miss 以便正确显示；能报告是否所有船已沉没。",
          "第 3 步：创建 Player 类/工厂——两类玩家 real 与 computer；每个玩家对象包含自己的 gameboard。",
          "第 4 步：把类/工厂导入另一个文件，用事件监听器驱动游戏；创建管理 DOM 动作的模块。到这个点开始做 UI 是适当的：创建 Players 开新局（先用预定坐标铺棋盘，自主摆船后面再做）；HTML 实现留给你，但要显示双方棋盘、用 Gameboard 的信息渲染（渲染方法放合适的模块）；监听器只用其他对象的方法逐回合推进——想写新函数就退一步弄清它属于哪个类/模块；攻击 = 点击敌方棋盘坐标、把输入送给对象方法、重渲染；玩家轮流攻击（回合跟踪适合住这个模块）；computer 随机但合法（不打同一坐标两次）；一方全沉即游戏结束（也适合住这个模块）。",
          "第 5 步：收尾——实现让玩家摆放自己船的系统：例如输入每艘船的坐标，或按钮循环随机摆放。",
          "Extra credit：① 拖放摆船；② 双人热座（传笔记本/转显示器）+「传递设备」屏防偷看对方棋盘；③ computer 命中后尝试相邻格子。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": [
          "Extra credit ①：实现拖放（drag and drop）让玩家摆放船。",
          "Extra credit ②：双人选项——传笔记本或转显示器轮流，实现「传递设备」屏让玩家看不到对方棋盘。",
          "Extra credit ③：打磨电脑智能——命中后尝试相邻格子。"
        ]
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/finishing_up_with_javascript/project_battleship.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "0765df5e7330579a4425133f0f0563f56a67f0c8e55fb568ff2cb789b2624141",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-javascript-conclusion",
      "title": "Conclusion",
      "zh": "课程结语",
      "group": 7,
      "url": "https://www.theodinproject.com/lessons/node-path-javascript-conclusion",
      "summary": "javascript 课程的收官结语——官方原文很短，是一封祝贺信：完成 JavaScript 课程是一个**重大里程碑**，恭喜你！你已经学了一大堆重量级概念：原型（prototypes）、闭包（closures）、Promise、事件循环（event loops）——官方让你花点时间回顾自己走了多远。此刻你已经能用**纯 vanilla JavaScript** 创建出色而动态的前端。但前端还没有结束：接下来的课程会学**可访问性（accessibility）**、**响应式设计**，以及 **React**——一个用于创建界面的库。官方点出你与 React 之间的那座桥：你已经亲身体验过「底层数据一变就要手动更新 DOM」的痛苦——**那正是 React 简化流程的地方**。进入下一部分之前，官方请你填写 JavaScript 课程反馈表（你的反馈对改进课程与理解用户体验很重要）。临别赠言（Parting thoughts）：最后官方想重申——**学习不会到此为止**。拥抱成长型思维（growth mindset），继续探索吧。Good luck!",
      "guide": "以下是官方原课的中文化梳理（结语课：官方原文只有一页祝贺信，本站按原文如实梳理、不扩写官方没讲的内容）。这课没有知识点要啃，但值得认真做官方布置的两件「小事」：① **回顾**——官方原话「花点时间反思你走了多远」：建议真的花十分钟翻一遍你在本课程里写过的项目清单（Library、Tic Tac Toe、Restaurant Page、Todo List、Weather App、Testing Practice、Recursion、Linked Lists、HashMap、Binary Search Trees、Knights Travails，以及收官的 Battleship），对照第一课时你的水平——这种可见的进步幅度是撑过后面课程（React、Node）的燃料；② **反馈表**——官方在进入下一部分前请你填写 JavaScript 课程反馈表（Google 表单，属课程行政入口，本站按惯例不登记为学习资料、如实转达入口存在）。关于下一站：官方预告的三样东西都有明确指向——accessibility 与 responsive design 住在接下来的「高级 HTML 与 CSS」课程，React 是它自己的课程（World 5）；「手动更新 DOM 的痛苦 → React 简化它」这句是你已经攒下的学习动机：Todo List 与 Weather App 里每一次 render() 全量重绘，都在为「声明式 UI」这个概念铺垫。Parting thoughts 的 growth mindset 呼应课程引言（How This Course Will Work）的学习心态——首尾闭环，官方的课程设计如此。",
      "understand": [
        "官方祝贺：完成 JavaScript 课程是一个**重大里程碑（major milestone）**——恭喜你！",
        "官方盘点你学到的重量级概念（原话列举）：**prototypes（原型）、closures（闭包）、promises、event loops（事件循环）**",
        "官方指令：花点时间**反思你走了多远**（reflect on how far you've come）",
        "现状定位：此刻你可以创建**出色而动态的前端**——全部用 **vanilla JavaScript**（纯原生，无框架）",
        "预告下一站：前端还没有结束——接下来的课程会学 **accessibility（可访问性）**、**responsive design（响应式设计）**与 **React**（一个用于创建界面的库）",
        "官方点出的动机之桥：你已经**亲身体验过**「相对于底层数据变化手动更新 DOM」的痛苦——**那正是 React 简化流程的地方**",
        "官方请求：进入下一部分之前，填写 **JavaScript 课程反馈表**（Google 表单）——你的反馈对改进课程、理解用户体验很重要",
        "**Parting thoughts（临别赠言）**：最后官方重申——**学习不会到此为止（learning doesn't stop here）**；拥抱**成长型思维（growth mindset）**并继续探索。Good luck!"
      ],
      "terms": [
        {
          "en": "vanilla JavaScript",
          "zh": "纯原生 JavaScript（无框架无库）——官方对「你现在的装备」的定位"
        },
        {
          "en": "React",
          "zh": "用于创建界面的库——下一门大课（World 5）；它简化的正是「数据变了手动更新 DOM」的痛苦"
        },
        {
          "en": "accessibility（可访问性）",
          "zh": "接下来「高级 HTML 与 CSS」课程的主题之一"
        },
        {
          "en": "responsive design（响应式设计）",
          "zh": "接下来「高级 HTML 与 CSS」课程的主题之一"
        },
        {
          "en": "growth mindset（成长型思维）",
          "zh": "官方临别赠言的关键词——与课程引言的学习心态首尾呼应"
        }
      ],
      "tasks": [
        "按官方指令做回顾：翻一遍你在本课程完成的全部项目（Library / Tic Tac Toe / Restaurant Page / Todo List / Weather App / Testing Practice / Recursion / Linked Lists / HashMap / Binary Search Trees / Knights Travails / Battleship），对照开课时你的水平，具体说出「我走了多远」",
        "进入下一部分之前填写官方的 JavaScript 课程反馈表（入口在官方原课页内——课程行政表单，本站如实转达）",
        "把官方点名的四个概念各用一句话讲给自己听：prototypes、closures、promises、event loops——讲不顺的回去翻对应章节（组织代码 / 异步与 API）",
        "预习心态准备：回想 Todo List 或 Weather App 里「数据一变就手动 render 重绘 DOM」的代码——那就是官方说的「痛苦」，React 将用声明式 UI 把它简化",
        "规划下一站：本站尚未开放「高级 HTML 与 CSS」（accessibility / responsive design）与 React 课程的中文内容——可以先去官方路线页看课程结构，或按 Choose Your Path Forward 课的建议继续在真实项目里练手"
      ],
      "quiz": [
        {
          "question": "官方在这封「结课信」里盘点你学到了哪四个重量级概念？",
          "answer": "官方原话列举：**prototypes（原型）、closures（闭包）、promises、event loops（事件循环）**——分别对应「组织 JavaScript 代码」章（原型与闭包）与「异步 JavaScript 与 API」章（Promise 与事件循环）的核心内容。"
        },
        {
          "question": "官方说 React 将简化你的哪种「痛苦」？这个痛苦你在哪些项目里亲身体验过？",
          "answer": "官方原话：你已经体验过**相对于底层数据的变化手动更新 DOM** 的痛苦——那正是 React 简化流程的地方。亲身体验的位置：Todo List（增删任务后手动重渲染列表）、Weather App（数据到手后逐字段填 DOM）、Battleship（每次攻击后重渲染双棋盘）——这些项目里「数据变了 → 手动同步 DOM」的样板代码，正是声明式 UI 要消灭的东西。"
        },
        {
          "question": "官方在结语里请你做的两件「小事」是什么？",
          "answer": "① **反思**：花点时间回顾你走了多远（reflect on how far you've come）——完成 JavaScript 课程是重大里程碑；② **填反馈表**：进入下一部分之前填写 JavaScript 课程反馈表——你的反馈对改进课程与理解用户体验很重要。临别赠言则是：学习不会到此为止，拥抱成长型思维、继续探索。"
        }
      ],
      "optional": [],
      "note": "官方原文很短（约 1.2KB 的祝贺信），无 Assignment 节（sources.json 登记 hasAssignment: false——全站第三门，与 choose-your-path-forward、how-this-course-will-work 同口径）；本站正文按原文如实梳理、不扩写官方没讲的内容。正文的反馈表为 Google 表单（课程行政入口，按 Admin Dashboard 反馈表先例不登记资源卡、如实转达）；React 官网登记资源卡（官方中文版 zh-hans.react.dev 实测在位）。结语课不配概念图（无结构可画）、不出 Boss 题（finishing-up 章按知识点判断不配 Boss——本章可出题的只有本课，而它是无知识点的告别信；battleship 为 Project 课不出题）。",
      "why": "这封信的价值在于官方替你按下「确认键」：里程碑要被承认才算里程碑。回顾你写完的十二个项目——从 DOM 玩具到带完整测试套件的多模块应用——这条曲线就是「成长型思维」的实物证据，也是你简历项目栏的初稿。往前看，官方预告的三站（accessibility、responsive design、React）各自解决你已亲身撞上的墙：语义与可访问性（写 Todo List 时被屏幕阅读器忽略的按钮）、响应式（Admin Dashboard 的移动端布局）、声明式 UI（手动 render 的样板地狱）。结语不是终点线，而是下一门课的起点姿态：learning doesn't stop here——这句话你在引言课读过一次，现在它有了十二个项目的重量。",
      "sections": [
        {
          "h": "重大里程碑：你已拥有的",
          "p": [
            "官方开篇：**JavaScript 课程的终点！完成它是一个重大里程碑——恭喜你！**",
            "你已经学了一大堆重量级 JavaScript 概念——官方点名：**prototypes、closures、promises、event loops**。官方请你：花点时间**反思自己走了多远**。",
            "此刻的能力定位（官方原话要义）：你已经可以创建**出色而动态的前端**——全部用 vanilla JavaScript。"
          ]
        },
        {
          "h": "前端还没结束：官方预告的下一站",
          "p": [
            "官方预告：接下来的课程会学 **accessibility（可访问性）**、**responsive design（响应式设计）**，以及 **React**——一个用于创建界面的库（资源卡有 React 官方中文文档直链）。",
            "官方点出的动机之桥：你已经**亲身体验过**「底层数据一变就要手动更新 DOM」的痛苦——**而那正是 React 简化流程的地方**。你的 Todo List、Weather App、Battleship 里的每一次手动重渲染，都是这句预告的注脚。"
          ]
        },
        {
          "h": "反馈表与临别赠言",
          "p": [
            "官方请求（Give your feedback）：在进入下一部分之前，请填写 **JavaScript 课程反馈表**（Google 表单）——你的反馈对改进课程、理解用户体验很重要。（表单入口在官方原课页内；课程行政表单按本站惯例不登记为学习资料、如实转达。）",
            "**Parting thoughts（临别赠言）**：最后官方想重申——**学习不会到此为止**。拥抱**成长型思维**，继续探索。**Good luck!**"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "跳过反思直接冲进下一门课",
          "text": "官方专门布置了「reflect on how far you've come」——这不是客套话。没有对进步的显式确认，十二个项目的辛苦会在记忆里扁平成「学过 JS」四个字；下一次撞墙（React 的 hooks 心智模型、Node 的后端思维）时，你将缺少「我曾经从不会到会」的自证。十分钟翻一遍项目清单，是官方设计好的续航动作。"
        },
        {
          "title": "以为「学完 JS」等于「前端学完了」",
          "text": "官方原话：前端还没有结束——accessibility、responsive design、React 都在后面。vanilla JavaScript 给了你创建动态前端的能力，但可访问性（屏幕阅读器用户能不能用你的页面）与响应式（手机上会不会散架）是独立的必修课；把它们当成「已经会了」的一部分，会在真实项目里付出返工代价。"
        }
      ],
      "official": {
        "assignment": [],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 javascript/finishing_up_with_javascript/conclusion.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "50bb177755115de7d9a2ad5900a9366f179635299fd7202f78343c281c19051e",
        "verifiedAt": "2026-09-27"
      }
    }
  ]
};
