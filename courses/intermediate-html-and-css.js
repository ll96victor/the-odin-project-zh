/* courses/intermediate-html-and-css.js — World 2「中级 HTML 与 CSS」已开放课程正文（v2 自足格式）。
 *
 * 为什么按 World 分文件（2026-09-25 路径课试点批次 1）：lessons.js 继续作为 Foundations
 * 的唯一事实源不动（46 课已发布上线，是稳定资产）；路径课程按官方 World 分文件进 courses/，
 * 每批只新增/修改一个文件、回滚干净；避免 lessons.js 涨到数 MB。
 *
 * 数据约定（规划 20260925-1700 §4.5，实测拍板）：
 *   - 本文件每课的 id 就是 curriculum.js 里的原始 slug，原样沿用、不得改写、不得手工起名
 *     （「剥离 node-path-<course>- 前缀」方案已被实测推翻：前缀规则不统一，且剥离后
 *     how-this-course-will-work / conclusion 等与 Foundations 撞名——唯一性是共享进度
 *     存储的前提）；
 *   - group 字段是本文件 groups 数组的数字下标（与 lessons.js 同构），从 0 起且
 *     在本文件内连续；
 *   - 课的字段结构与 lessons.js 完全同构（19 字段 v2 自足格式），content.test.cjs
 *     的结构钉对合并后的全量课程生效。
 *   - 本文件只放已开放的课程（当前：第 1 章节「中级 HTML 概念」3 课）；未开放的
 *     章节与课程不得夹带正文（红线：未开放课程的正文绝不进数据文件）。
 *   - 中文课名按 catalog.js 惯例自拟，登记在本文件头注释与 SOURCES.md：
 *     Introduction → 中级 HTML 与 CSS 导读；SVG → SVG；Tables → HTML 表格。
 *     第二批（2026-09-25，v4.11.21）「中级 CSS 概念」前 5 课：Default Styles → 浏览器默认样式；
 *     CSS Units → CSS 单位；More Text Styles → 更多文本样式；More CSS Properties → 更多 CSS 属性；
 *     Advanced Selectors → 高级选择器。
 *     World 2 Grid 批（2026-09-26，v4.11.22，通宵轮批次 3）「Grid 布局」章节 6 课：
 *     Introduction to Grid → Grid 布局导读；Creating a Grid → 创建网格；
 *     Positioning Grid Elements → 定位网格元素；Advanced Grid Properties → 高级网格属性；
 *     Using Flexbox and Grid → 搭配使用 Flexbox 与 Grid；
 *     Project: Admin Dashboard → 项目：管理仪表盘（Project 红线课，examples 空数组）。
 *     该章节 6/6 全开，World 2「中级 HTML 与 CSS」22 课就此全部开放（四个章节收组）。 */
window.ODIN_COURSE_INTERMEDIATE_HTML_CSS = {
  version: 1,
  course: {
    id: 'intermediate-html-and-css',
    en: 'Intermediate HTML and CSS',
    zh: '中级 HTML 与 CSS',
    url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/intermediate-html-and-css'
  },
  groups: [
    { en: 'Intermediate HTML Concepts', zh: '中级 HTML 概念' },
    { en: 'Intermediate CSS Concepts', zh: '中级 CSS 概念' },
    { en: 'Forms', zh: '表单' },
    { en: 'Grid', zh: 'Grid 布局' }
  ],
  lessons: [
    {
      "id": "node-path-intermediate-html-and-css-introduction",
      "title": "Introduction",
      "zh": "中级 HTML 与 CSS 导读",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-introduction",
      "summary": "两段式「中级 HTML 与 CSS」课程的导读课：Foundations 刻意只教了「够用就好」的表层，现在要放慢脚步往深挖——表单、表格、CSS 变量、函数、阴影与 Grid 布局都在前方。本课只有两篇「先混个眼熟」的浏览任务，不要求记住任何东西。",
      "guide": "以下是官方原课的中文化梳理。这是路径课程的真正起点：Foundations 的定位是「尽快让你上手做出东西」，所以刻意只覆盖了表层；这门中级课的目标反过来——放慢节奏，把 HTML 与 CSS 的重要部分补齐。学完它你将能复刻互联网上几乎任何网页设计。本课没有新知识点，只有两个浏览任务：翻一遍 HTML 元素参考、瞄一眼 CSS 速查表，目的是让你对「还剩多少要学」建立直觉，后面的课讲到时更容易挂住。",
      "understand": [
        "Foundations 的取舍是刻意的：只给你上手所需的最必要内容，尽快变得能产出——现在到了放慢脚步深挖的时候",
        "HTML 还有很多元素没讲（本课程将覆盖表单与表格等重要元素）",
        "CSS 的深水区在前方：变量、函数、阴影、Grid 布局——学完本课程能复刻互联网上几乎任何网页设计",
        "作品集好看很重要：即使不冲前端岗，能把自己的项目页面做漂亮也是让你脱颖而出的技能",
        "动画、无障碍与响应式设计不在这门课——它们在后面的「高级 HTML 与 CSS」课程里"
      ],
      "terms": [
        {
          "en": "Intermediate",
          "zh": "中级：本课程是 Full Stack JavaScript 路径的第二门课（两段式中级课程的第一段）"
        },
        {
          "en": "Grid",
          "zh": "CSS Grid 布局：两维网格布局系统，本课程的压轴内容（Foundations 阶段刻意只教了 Flexbox）"
        }
      ],
      "tasks": [
        "通读 MDN 的 HTML 元素参考页，对可用元素建立全貌感（不要求记住——后面的课会逐个讲到重要部分，现在扫一眼是为了之后更容易记住）",
        "瞄一眼 CSS Cheat Sheet 速查表，感受「还剩多少要学」（同样不要求学或记任何具体内容）"
      ],
      "quiz": [
        {
          "question": "为什么 Foundations 课程刻意只覆盖了 HTML 与 CSS 的表层？",
          "answer": "Foundations 的设计目标是「尽快让你上手并能有产出」——只给最必要的起步内容。中级课程的目标相反：放慢节奏、往深挖，把重要元素（表单、表格）与 CSS 深水区（变量、函数、阴影、Grid）补齐。"
        },
        {
          "question": "本课两个浏览任务（HTML 元素参考 + CSS 速查表）的正确打开方式是什么？",
          "answer": "只求「混个眼熟」、不求记住：现在扫一遍是为了建立「还剩多少要学」的直觉，等后面的课讲到这些内容时更容易挂住。官方原话——不需要背，也不需要学具体内容。"
        },
        {
          "question": "动画、无障碍与响应式设计在哪学？",
          "answer": "不在本课程——它们在后续路径的「高级 HTML 与 CSS」课程里。本课程聚焦表单、表格与 CSS 的中级概念（变量 / 函数 / 阴影 / Grid）。"
        }
      ],
      "optional": [],
      "note": "本课是纯导读课：官方只有两篇浏览任务（明确说明「不要求记住」），无知识点考核；本站自测聚焦定位与学习策略而非语法细节。",
      "why": "这是你在 Foundations 毕业后的第一门路径课程。它先校准预期——中级阶段的节奏与目标都变了；再给你一张「剩余地图」：扫一眼 HTML 元素全集与 CSS 速查表，后面二十几课的学习会更有方向感。",
      "sections": [
        {
          "h": "从「够用」到「深挖」",
          "p": [
            "官方开场：这是两段式课程的第一段，我们要往 HTML 与 CSS 的深处挖了。",
            "Foundations 的课**刻意只抓了表层**——目标是把你上手所需的最必要内容给你，让你尽快进入「能做出点东西」的状态。但现在，该放慢脚步、认真往深处走了。",
            "你可能已经察觉：HTML 的元素远不止 Foundations 提过的那些。本课程会覆盖其余的重要元素——比如**表单（forms）与表格（tables）**。",
            "CSS 这边还有**一大片**天地：变量、函数、阴影，当然还有 **Grid 布局**。系好安全带——学完这门课，你将能复刻互联网上几乎任何你找到的网页设计……这是一项值得带走的技能。就算你不冲前端专门的岗位，能把自己的作品集页面做好看，对让你脱颖而出也很重要。"
          ]
        },
        {
          "h": "本课程不包含什么",
          "p": [
            "动画、无障碍与响应式设计在课程体系中**更靠后**——在「高级 HTML 与 CSS」课程里。先把中级的元素与概念打牢。"
          ]
        },
        {
          "h": "先混个眼熟（本课的全部任务）",
          "p": [
            "两个浏览任务，都明确「不要求记住」：",
            "翻完之后，你对「前方还有什么」会有直觉——这正是导读课的全部目的。"
          ],
          "list": [
            "**HTML 元素参考**（MDN，有官方中文版）：扫一遍还有哪些元素可用——后面的课会讲到重要部分，现在看一眼能让内容更容易挂住",
            "**CSS Cheat Sheet 速查表**：看着有点吓人？正常——它就是用来让你感受「还剩多少要学」的"
          ]
        }
      ],
      "examples": [
        {
          "lang": "text",
          "code": "两个浏览任务均无代码产出——本课的正确产物是「眼熟感」，不是笔记或记忆",
          "note": "官方原文的两条 Assignment 都是阅读浏览型任务，明确写了 No need to commit this to memory / we don't need you to learn anything specific。"
        }
      ],
      "pitfalls": [
        {
          "title": "试图背下 HTML 元素参考",
          "text": "官方明确说不要求记住——现在硬背效率极低，后面课程讲到时再学，现在只需建立「有这个东西」的印象。"
        },
        {
          "title": "被 CSS 速查表吓退",
          "text": "那张表是「剩余地图」不是「必背清单」。它的作用是让你对学习范围有真实预期——看到密密麻麻是正常的、预期的。"
        },
        {
          "title": "以为这门课会教动画 / 响应式",
          "text": "动画、无障碍、响应式设计在后面的「高级 HTML 与 CSS」课程。本课程聚焦表单、表格与 CSS 中级概念——按官方顺序走，不要跳。"
        }
      ],
      "official": {
        "assignment": [
          "通读 MDN 的 HTML 元素参考页，对可用元素建立概览——不要求记住（后面的课会讲到重要部分，现在扫一眼有助于之后的内容挂住）。",
          "瞄一眼 CSS Cheat Sheet 速查表——同样不要求学或记住任何具体内容，只用它感受「还剩多少要学」。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/intermediate_html_concepts/introduction.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "fce79598e8ea0738cefc232e3669c6c2107d802a234f700d52adaad71b04dfbd",
        "verifiedAt": "2026-09-25"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-svg",
      "title": "SVG",
      "zh": "SVG",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-svg",
      "summary": "SVG 是什么、为什么它是网页上最常见的图片格式之一：矢量图形用数学公式而非像素网格定义图像——任意缩放不损质量、文件不变大；源码是 XML（人类可读、可与 HTML 互操作）。本课拆解 SVG 的解剖结构（xmlns / viewBox / 基础元素）与两种嵌入方式（链接 vs 内联）的取舍。",
      "guide": "以下是官方原课的中文化梳理。SVG 初看容易发懵（一堆坐标与标签），但拆开看只有三件事：① 它是矢量格式——图像由公式定义，缩放无损、体积不变；② 它的源码是 XML——和 HTML 长得像、能直接贴进网页、成为 DOM 元素后可用 CSS/JS 操作；③ 用它有两种方式——链接（干净简单）与内联（解锁全部动态能力但有代价）。官方还诚实交代了 SVG 的短板：存储复杂图像（照片、细腻纹理）极其低效。",
      "understand": [
        "SVG = Scalable Vector Graphics（可缩放矢量图形）：图像由数学公式定义，不是像素网格",
        "矢量的优势：任意缩放不损质量、文件大小不变——这是它叫 scalable 的原因",
        "SVG 常用于：图标、图表、大型简单图像、图案背景、给其他元素施加 SVG 滤镜效果",
        "SVG 源码是 XML：人类可读（对比 JPEG 打开是乱码）、与 HTML 互操作（可直接贴进 HTML 并成为 DOM 元素）",
        "成为 DOM 元素意味着：可用 CSS 定位样式、用已会的 Element API 操作——第 41 课的 DOM 工具直接复用",
        "短板：每个细节都要写成 XML——存照片级真实或细腻纹理的图像极其低效，那种场景该用位图",
        "解剖五要点：xmlns（XML 方言声明，缺了浏览器可能不渲染）、viewBox（边界 + 宽高比 + 原点）、class/id（与 HTML 同义）、circle/rect/path/text 等基础元素、fill/stroke 等属性可被 CSS 改",
        "嵌入两法：链接（img / background-image，干净但内部不可访问）与内联（直接贴代码，可动态操作但代码更难读、缓存更差）"
      ],
      "terms": [
        {
          "en": "Vector graphics",
          "zh": "矢量图形：用公式定义形状与线条的图像——没有像素网格，缩放不影响质量与体积"
        },
        {
          "en": "Raster graphics",
          "zh": "位图（栅格图形）：用像素网格定义的图像（JPEG/PNG）——放大要补像素、文件随尺寸变大"
        },
        {
          "en": "XML",
          "zh": "可扩展标记语言：类 HTML 语法，用于 API、RSS、办公软件等；SVG 源码就是 XML"
        },
        {
          "en": "viewBox",
          "zh": "SVG 的边界框：定义元素坐标的参照系 + 宽高比 + 原点——一个属性干三件事"
        },
        {
          "en": "Inline SVG",
          "zh": "内联 SVG：把 SVG 代码直接贴进 HTML——属性对代码可见、可动态改，代价是可读性 / 缓存 / 加载顺序"
        }
      ],
      "tasks": [
        "读懂官方正文：矢量 vs 位图的本质差异、XML 的两个好处、SVG 的短板与适用场景",
        "玩官方 CodePen 示例：改 viewBox 数值、改元素属性，感受「公式定义图像」怎么运作",
        "读 Josh Comeau 的 A Friendly Introduction to SVG（有交互演示），读到动画一节停（动画在后面的课程）"
      ],
      "quiz": [
        {
          "question": "SVG 相比位图（JPEG/PNG）的本质差异是什么？",
          "answer": "位图用像素网格定义图像——细节受限于网格大小，放大必须决定新像素长什么样（无简单解法），且网格越大文件越大。矢量用公式定义形状线条——缩放到任何大小都不影响质量与文件体积。代价是复杂图像（照片、细腻纹理）要写成海量 XML，SVG 极其不擅长。"
        },
        {
          "question": "「SVG 源码是 XML」带来了哪两个关键好处？",
          "answer": "① 人类可读——文本编辑器打开 SVG 看到的是标签与属性（对比 JPEG 的乱码）；② 与 HTML 互操作——SVG 代码可以原样贴进 HTML 文件直接显示，且成为 DOM 元素后可用 CSS 定位、用已会的 Element API（第 41 课）操作——本站的概念图全是这个原理。"
        },
        {
          "question": "链接 SVG 与内联 SVG 各自的取舍是什么？默认该选哪个？",
          "answer": "链接（img / background-image）：干净简单、正常缩放，但 SVG 内容对网页代码不可见——不能动态改。内联：属性对 CSS/JS 可见、解锁全部动态潜力，但代码更难读、页面缓存性变差、大 SVG 可能阻塞后续 HTML 加载。官方建议：默认链接，除非需要随 HTML 一起调 SVG 代码才内联（React / webpack 等工具能缓解内联缺点，但那是后面的事）。"
        },
        {
          "question": "xmlns 和 viewBox 各管什么？",
          "answer": "xmlns 声明「这是哪种 XML 方言」——这里是 SVG 语言规范，缺了它部分浏览器不渲染或渲染错。viewBox 定义 SVG 的边界——内部元素的坐标都以它为参照，同时它还定义宽高比与原点，一个属性干三件事。"
        }
      ],
      "optional": [],
      "note": "",
      "why": "SVG 是网页图标的行业标准（本站的概念图、你的作品集图标、各大网站的 logo 大多都是 SVG）。理解「公式定义图像 + XML 互操作」后，你会知道什么时候它是对的工具、怎么用 CSS 控制它——这是中级前端的看家技能之一。",
      "sections": [
        {
          "h": "SVG 是什么",
          "p": [
            "SVG 是网页上非常常见的图片格式。初学可能有点懵，但一旦会用，它是给网站创建高质量、动态图像的极其强大的工具。",
            "SVG 是**可缩放**的图像格式——轻松缩放到任何尺寸、保持质量、文件体积不增。如果你需要用程序创建或修改图像，它也特别有用——属性可以通过 CSS 和 JavaScript 改。",
            "SVG 常用于：图标、图表、大型简单图像、图案背景、通过 SVG 滤镜给其他元素施加效果。"
          ]
        },
        {
          "h": "矢量 vs 位图",
          "p": [
            "SVG 全称 Scalable Vector Graphics（可缩放矢量图形）。**矢量图形**用数学定义图像；传统**位图**（raster graphics）用像素网格定义。",
            "位图的细节受限于网格大小：想放大图像就得扩大网格——新像素该长什么样？没有简单的答案。且网格越大文件越大。",
            "矢量没有网格，只有形状与线条的公式——缩放到任何大小都不影响质量与体积。",
            "SVG 的另一个有趣之处：它用 XML 定义。XML（可扩展标记语言）是类 HTML 语法，用于 API、RSS、办公软件等很多地方。"
          ]
        },
        {
          "h": "XML 带来的两个好处",
          "p": [
            "第一个好处：**人类可读**。用文本编辑器打开 JPEG 看到的是天书；打开 SVG 看到的是这样的：",
            "可能还是有点懵，但——这些是词！标签！属性！对比 JPEG 这类二进制格式，我们已经站在熟悉的领域了。",
            "第二个好处：XML 设计上就与 HTML **互操作**——上面的代码原样贴进 HTML 文件就能显示。而且它成为 DOM 元素后，和 HTML 元素一样可以用 CSS 定位、用你已经会的 Element API（第 41 课学的）创建操作。"
          ],
          "list": [
            "```html",
            "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\">",
            "  <rect x=0 y=0 width=100 height=50 />",
            "  <circle class=\"svg-circle\" cx=\"50\" cy=\"50\" r=\"10\"/>",
            "</svg>",
            "```"
          ]
        },
        {
          "h": "短板：什么时候别用 SVG",
          "p": [
            "SVG 确实强大，但**不是**「把所有图都换成 SVG」的意思。图像的每一个细节都要写成 XML——存复杂图像极其低效。如果你的图像要照片级真实、或有细腻的细节与纹理（官方举例：grunge 粗粝纹理），SVG 是错误的工具——该用位图。"
          ]
        },
        {
          "h": "解剖一个 SVG",
          "p": [
            "实践中你通常不会从零手写 SVG——多数时候从网站或图像编辑器下载 / 复制（Material icons 与 Feather icons 是流行的 SVG 图标库）。但下载后想微调是很常见的需求，认识每个零件很有用。玩官方 CodePen 示例（改 viewBox、改属性）找感觉："
          ],
          "list": [
            "**xmlns**：XML NameSpace——声明用的是哪种 XML 方言（这里是 SVG 语言规范），缺了它部分浏览器不渲染或渲染错",
            "**viewBox**：定义 SVG 的边界——元素坐标的参照系，同时定义宽高比与原点，一个属性干三件事",
            "**class / id**：与 HTML 同义——用于 CSS/JS 定位，或用 use 元素复用",
            "**基础元素**：circle / rect / path / text 等，由 SVG 命名空间定义——复杂图像也大多由十几个基础元素拼成",
            "**CSS 可改的属性**：fill、stroke 等很多 SVG 属性可以在 CSS 里改（css-tricks 有专文）"
          ]
        },
        {
          "h": "嵌入 SVG 的两种方式",
          "p": [
            "把 SVG 放进文档有两条主路：**链接**与**内联**。",
            "**链接**：和链接普通图片一样——`<img>` 或 CSS 的 `background-image: url(./my-image.svg)`。正常缩放，但 SVG 内容对网页不可访问（不能动态改）。",
            "**内联**：把 SVG 代码直接贴进网页代码。照样渲染，且属性对代码可见——可以用 CSS/JS 动态改图。",
            "内联解锁全部潜力，但也有实打实的缺点：代码更难读、页面缓存性变差、大 SVG 可能延迟后续 HTML 加载。这些缺点在学了 React 之类的库或 webpack 之类的构建工具后可以规避——现在先把这话放脑子里。现阶段：**哪个适合用哪个；链接通常更干净简单，除非需要随 HTML 一起调 SVG 代码，否则优先链接**。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "html",
          "code": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\">\n  <rect x=\"0\" y=\"0\" width=\"100\" height=\"50\" />\n  <circle class=\"svg-circle\" cx=\"50\" cy=\"50\" r=\"10\" />\n</svg>",
          "note": "官方正文的示例（中文化注释）：xmlns 声明方言；viewBox「0 0 100 100」= 原点在左上、宽高各 100；rect 画矩形、circle 画圆（cx/cy 圆心、r 半径）。改 viewBox 数值看图形怎么变——这是官方建议的动手方式。"
        },
        {
          "lang": "css",
          "code": "/* 内联 SVG 的 circle 可以直接用 CSS 改样式 */\n.svg-circle {\n  fill: #51408f;\n  stroke: #252b3d;\n  stroke-width: 2;\n}",
          "note": "fill / stroke 等属性可被 CSS 控制——前提是内联（链接的 SVG 内部对页面不可见）。这正是本站概念图随主题换色的原理。"
        }
      ],
      "pitfalls": [
        {
          "title": "漏写 xmlns",
          "text": "xmlns 声明这是 SVG 方言——缺了它部分浏览器不渲染或渲染错。从图标库复制的 SVG 一般都带；手写时别忘。"
        },
        {
          "title": "把照片 / 细腻纹理存成 SVG",
          "text": "每个细节都要写成 XML——照片级图像的 SVG 会巨大且低效。SVG 适合图标、图表、简单图形；照片用位图。"
        },
        {
          "title": "不需要动态改图却内联",
          "text": "内联的代价（可读性 / 缓存 / 加载顺序）只有在你需要 CSS/JS 控制 SVG 时才值得付。默认链接，确有需要再内联。"
        },
        {
          "title": "把 viewBox 只当「尺寸」理解",
          "text": "它同时管边界（坐标参照系）、宽高比、原点三件事——改它不只是缩放，图形的参照系都变了。官方建议动手改数值找感觉。"
        }
      ],
      "official": {
        "assignment": [
          "① 读 Josh Comeau 的 A Friendly Introduction to SVG（带交互演示的形状与缩放指南）——**读到动画一节就停**（动画在课程体系更后面）。另：玩官方 CodePen 示例（改 viewBox / 元素属性）是正文的动手建议，不是 Assignment。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/intermediate_html_concepts/svgs.md（注意：文件名是复数 svgs，slug 是单数 svg；本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "8f1fcf6afc54acfcc41c8b76f629af466391c5c199c657133da60809ec4f7e73",
        "verifiedAt": "2026-09-25"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-tables",
      "title": "Tables",
      "zh": "HTML 表格",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-tables",
      "summary": "HTML 表格：用行与列组织的两维数据结构。上手很容易（table / tr / th / td 四个标签起步），高级特性（跨行跨列、语义分区）稍 tricky。本课是「官方指路 + MDN 教程跟做 + 一个实战评估」的组装课——官方正文只给起点，语法细节全在 MDN 两篇教程里。",
      "guide": "以下是官方原课的中文化梳理。官方正文很短——只有「表格是什么 + 一个 CodePen 起点示例」，把真正的教学交给了 MDN 的两篇教程（基础 + 进阶，都有官方中文版）与一个结构化行星数据的评估练习。本站正文把四个起步标签讲透（table / tr / th / td），其余按官方指路：**跟做** MDN 教程（Make sure to code along!——官方原话），再做评估练手。",
      "understand": [
        "表格的本质：**两维数据**的展示——行与列；有些数据就是真的需要表格来呈现",
        "表格没有按钮、链接、列表常用，但特定场景它是完美工具",
        "起步四标签：`<table>` 包住整张表；`<tr>` 一行；`<th>` 表头单元格；`<td>` 数据单元格",
        "官方起点示例：一个 table、两行 tr——第一行两个 th（表头），第二行两个 td（数据）",
        "高级特性（跨行跨列 rowspan/colspan、语义分区 thead/tbody/tfoot、caption）设置起来稍 tricky——在 MDN 进阶教程里学",
        "官方学习方式：MDN 基础 + 进阶两篇教程**必须跟做**（code along，不是干读），再用行星数据评估练手"
      ],
      "terms": [
        {
          "en": "table",
          "zh": "表格容器元素：一切表格结构的根，行与单元格都住在里面"
        },
        {
          "en": "tr (table row)",
          "zh": "表格行：一行内容的容器，表头行与数据行都是它"
        },
        {
          "en": "th (table header)",
          "zh": "表头单元格：默认加粗居中，语义上是「这一列/行的标签」"
        },
        {
          "en": "td (table data)",
          "zh": "数据单元格：表格正文的每一个格子"
        }
      ],
      "tasks": [
        "读官方正文：表格的定位与起点示例（CodePen 里玩一玩结构）",
        "跟做 MDN 的 Tables Basics 与 Tables Advanced 两篇教程（都有官方中文版）——官方原话 Make sure to code along，边读边敲",
        "完成 MDN 的「结构化行星数据」评估练习，把刚学的表格技能用起来"
      ],
      "quiz": [
        {
          "question": "官方起点示例的表格结构是怎样的？",
          "answer": "一个 table 元素装两行 tr：第一行放两个 th（表头——如「姓名」「年龄」这样的列标签），第二行放两个 td（数据）。这就是最小可用的表格——复杂表格都是在这个骨架上加东西。"
        },
        {
          "question": "官方对 MDN 两篇教程的学习方式有什么明确要求？",
          "answer": "Make sure to code along——必须跟着敲代码，不是干读。两篇教程（基础 + 进阶）覆盖全部表格语法，官方说这些语法 pretty straightforward，但动手跟做才能真的学会。"
        },
        {
          "question": "什么时候该用表格？什么时候不该？",
          "answer": "有些数据**真的**需要两维呈现——行与列交叉引用的数据（时刻表、对照表、统计数据）表格是完美工具。但表格比按钮/链接/列表少见得多——不要拿它做页面布局（那是 CSS 的活），只在展示两维数据时用。"
        }
      ],
      "optional": [],
      "note": "",
      "why": "表格是数据展示的原始武器：作品集里的技能对照、项目数据、后续课程的浏览器兼容性表都会用到。MDN 的行星数据评估是一次真刀真枪的结构化练习——把一堆真实数据装进语义正确的表格，正是「中级 HTML」该有的手感。",
      "sections": [
        {
          "h": "有些数据就该用表格",
          "p": [
            "有些数据**真的**需要一个表格来展示。HTML 表格也许没有按钮、链接、列表和之前学的一切那么常用，但在特定场景下它是**完美**的工具。",
            "高级特性（跨行跨列、语义分区）设置起来会有点 tricky，但起步相当容易：用 `<table></table>` 标签创建表格，行、列、表头等元素都放在里面。"
          ]
        },
        {
          "h": "最小表格：四标签起步",
          "p": [
            "看官方 CodePen 示例：一个 table 元素、两行 tr——第一行两个表头（th），第二行两个数据格（td）。",
            "就这么多——这就是表格的骨架。把这段敲进你自己的 HTML 里改改内容找感觉："
          ],
          "list": [
            "`<table>` —— 整张表的容器",
            "`<tr>` —— 一行（table row）",
            "`<th>` —— 表头单元格（table header），默认加粗居中",
            "`<td>` —— 数据单元格（table data）"
          ]
        },
        {
          "h": "剩下的交给 MDN（官方指路）",
          "p": [
            "官方正文到此为止——表格语法的完整教学在 MDN 的两篇教程里（都有官方中文版）：**Tables Basics**（基础结构）与 **Tables Advanced**（进阶：跨行跨列、语义分区等）。",
            "官方原话：**Make sure to code along!**——边读边敲，不是干读。",
            "读完做 **Structuring planet data** 评估：把一组真实的行星数据装进结构正确的表格——这是把刚学的技能落地的练习。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "html",
          "code": "<table>\n  <tr>\n    <th>行星</th>\n    <th>直径（km）</th>\n  </tr>\n  <tr>\n    <td>地球</td>\n    <td>12,742</td>\n  </tr>\n</table>",
          "note": "官方 CodePen 起点示例的中文化版：table 装两行 tr——首行两个 th 是列标签，次行两个 td 是数据。加更多 tr 就是更多行；MDN 教程在此基础上加 thead/tbody、rowspan/colspan 等。"
        }
      ],
      "pitfalls": [
        {
          "title": "干读 MDN 教程不跟做",
          "text": "官方原话 Make sure to code along——表格语法直白但琐碎，不跟着敲记不住结构关系。两篇教程都是为跟做设计的。"
        },
        {
          "title": "跳过行星数据评估",
          "text": "评估练习是把语法转化为实战能力的唯一一步——官方把它列为 Assignment 第二条，不是可选项。"
        },
        {
          "title": "拿表格做页面布局",
          "text": "古老年代的做法，现在是反模式。表格只用于展示两维数据；布局是 CSS（Flexbox/Grid）的职责——你已经在 Foundations 学过了。"
        }
      ],
      "official": {
        "assignment": [
          "读 MDN 的 Tables Basics 与 Tables Advanced 两篇教程（都有官方中文版）——学全部表格语法，官方原话 pretty straightforward，且 Make sure to code along（务必跟做）。",
          "完成 MDN 的 Structuring planet data（结构化行星数据）评估——把新学的技能用于练习。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/intermediate_html_concepts/tables.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "f15de7c5a880e3d5e5d304c3a4e08a5ea0f83ecf3a6fad0054ba383e41207f45",
        "verifiedAt": "2026-09-25"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-default-styles",
      "title": "Default Styles",
      "zh": "浏览器默认样式",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-default-styles",
      "summary": "浏览器给每个网页自带一套默认样式（user-agent 样式表）：h1 更大更粗、链接蓝色带下划线、各种默认 margin/padding——且各浏览器略有差异。不喜欢？两条路：直接写自己的规则覆盖（你的样式优先级更高），或用 CSS reset 统一出厂设置。Reset 是「有观点的」选择，不是必修。",
      "guide": "以下是官方原课的中文化梳理。这一课解释一个你天天遇到却可能没想过的问题：为什么 h1 天生就大、链接天生就蓝、明明没写 margin 却有间距——因为浏览器自带一套 user-agent 样式表在替你「先写了一版 CSS」。理解这一层之后，CSS reset 是什么、reset 为什么「有观点」、什么时候该自己覆盖而不是上 reset，就都顺了。本课正文短，Assignment 是三篇文章：reset 的历史与哲学、2023 年 normalize 与 reset 的对比、Josh Comeau 逐条讲解他自己的定制 reset。",
      "understand": [
        "浏览器对每个网页都应用一套默认样式，来自 user-agent 样式表——h1 更大更粗、a 链接蓝色带下划线、元素自带默认 margin/padding",
        "每个浏览器有自己的 user-agent 样式表，所以默认样式在浏览器之间略有差异——这是 reset 存在的动因之一",
        "几乎没有改不掉的默认：你自己写的规则优先级高于 user-agent 的规则，直接覆盖即可",
        "CSS reset = 一份专门用来移除或修改默认样式的样式表：消除浏览器间不一致、给 styling 一个干净统一的起点",
        "Reset 不是强制的：它天然「有观点」（opinionated，反映制作者的偏好）——有人不用、有人自己写、有人用现成的，你自己决定"
      ],
      "terms": [
        {
          "en": "User-agent stylesheet",
          "zh": "浏览器（user-agent）自带的默认样式表：没有你的 CSS 时网页也有基本样式的来源，各浏览器内容略有差异"
        },
        {
          "en": "CSS reset",
          "zh": "重置样式表：一份用来移除或修改浏览器默认样式的 CSS，目的是跨浏览器一致 + 干净的起点"
        },
        {
          "en": "Opinionated",
          "zh": "「有观点的」：reset 反映制作者的取舍偏好，不存在唯一正确答案——官方强调这是选择而非标准"
        }
      ],
      "tasks": [
        "读官方正文与本站讲解：弄清默认样式从哪来、你的规则为什么能覆盖它",
        "读 CSS-Tricks 的 Reboot, Resets, and Reasoning——reset 的历史与「有观点」意味着什么",
        "读 Matt Brictson 的 Making the case for CSS normalize and reset stylesheets in 2023——各种 reset 的差异与选择理由",
        "读 Josh Comeau 的 custom CSS reset——他逐条解释自己 reset 里每条规则的思路，顺带学「怎么为这些决定做推理」"
      ],
      "quiz": [
        {
          "question": "网页在没有任何自定义 CSS 时为什么已经有样式（h1 大且粗、链接蓝且带下划线）？",
          "answer": "浏览器自带 user-agent 样式表，对每个网页应用一套默认样式，保证没有 CSS 的网页也有基本可读的呈现。每个浏览器的默认样式表内容略有差异，所以同一页在不同浏览器里默认长相可能不完全一样。"
        },
        {
          "question": "不喜欢某个默认样式，官方给出的两条路分别是什么？",
          "answer": "① 直接写自己的 CSS 规则——你的样式表优先级高于 user-agent 的规则，几乎任何默认都能这样覆盖（官方说只有极少的例外）；② 用 CSS reset——一份专门移除或修改默认样式的样式表，一次性拿到跨浏览器一致的干净起点。"
        },
        {
          "question": "为什么说 CSS reset 是「有观点的」（opinionated）？这对你用它意味着什么？",
          "answer": "reset 抹掉哪些默认、保留哪些、改成什么样，反映的是制作者的个人偏好，没有唯一正确答案。所以 reset 不是必需品：有人不用、有人自己写、有人用现成的（如 normalize.css / reboot）——你应当理解它的取舍后自己决定，而不是不加思考地照抄。"
        }
      ],
      "optional": [],
      "note": "",
      "why": "「这个 margin 是哪来的？」——每个项目里你都会问出这句话，答案几乎都是浏览器默认样式。这一课让你把样式的控制权从浏览器手里拿回来：知道默认从哪来、知道覆盖的优先级机制、知道 reset 在重置什么——之后读到任何 reset 文件（包括本站和你自己的项目模板）都能看懂每条规则的意图。",
      "sections": [
        {
          "h": "浏览器在替你写第一版 CSS",
          "p": [
            "做项目的过程中你多半见过这些现象：`h1` 不用写就更大更粗、`a` 链接不用写就是蓝色带下划线，还有那些来路不明的默认 margin 和 padding——你甚至可能为它们头疼过。",
            "这些样式来自 **user-agent 样式表**：浏览器自带的默认样式，保证一个完全没有 CSS 的网页也有基本呈现。",
            "注意一个细节：**每个浏览器有自己的 user-agent 样式表**，所以默认样式在浏览器之间**略有差异**——这正是后面 CSS reset 存在的理由之一。"
          ]
        },
        {
          "h": "不喜欢默认？两条路",
          "p": [
            "第一条路几乎总是可行：**直接写你自己的 CSS 规则**。你的样式表优先级高于 user-agent 的规则，写上去就把默认覆盖了（官方原话：只有极少的例外）。",
            "第二条路是 **CSS reset**：一份专门用来移除或修改默认样式的样式表。为了消除浏览器之间的不一致、给样式一个统一的起点，一些开发者开始用它——reset 能提供一块「干净的画布」，让你的样式不受默认值干扰。"
          ]
        },
        {
          "h": "Reset 是观点，不是标准",
          "p": [
            "CSS reset 至今仍很常用，但**不是必需品**：有人选择不用，有人自己写一份，有人用现成的。",
            "关键是理解：reset 天然是**主观的、有观点的（opinionated）**——它反映的是制作者本人的偏好。怎么做，由你自己决定。Assignment 的三篇文章正好给你三种视角：历史与哲学（CSS-Tricks）、2023 年的横向对比（Matt Brictson）、一份现代定制 reset 的逐条推理（Josh Comeau）。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "css",
          "code": "/* 浏览器默认（user-agent 样式表，示意）：a 是蓝色带下划线、h1 大且粗、body 有默认 margin */\n\n/* 第一条路：直接覆盖——你的规则优先级更高 */\na {\n  color: inherit;          /* 不再蓝色，跟随正文颜色 */\n  text-decoration: none;   /* 去掉下划线 */\n}\n\n/* 第二条路（reset 的一小角）：先抹平默认，再开始设计 */\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}",
          "note": "本站示意代码（官方正文无代码块）：上半演示「自己的规则覆盖默认」，下半是最常见 reset 的开头几行。真实 reset 更长、取舍更多——读 Assignment 第三篇 Josh Comeau 的逐条解释，看一个现代 reset 的每条规则为什么在。"
        }
      ],
      "pitfalls": [
        {
          "title": "把默认样式当成「玄学间距」",
          "text": "「没写 margin 却有间距」不是 bug——是 user-agent 样式表。打开 DevTools 的 Styles 面板，勾上显示 user-agent 样式，来路一目了然。先诊断，再决定是覆盖还是 reset。"
        },
        {
          "title": "以为所有浏览器的默认样式一样",
          "text": "每个浏览器的 user-agent 样式表略有差异——同一页的默认长相可能不同。跨浏览器一致性正是 reset/normalize 要解决的问题之一。"
        },
        {
          "title": "把「必须上 reset」当教条",
          "text": "官方明说 reset 不是强制的，而且每份 reset 都是有观点的取舍。不理解每条规则就整份照抄，等于把别人的偏好当成自己的设计决定——三篇 Assignment 文章就是教你怎么自己做这个决定。"
        }
      ],
      "official": {
        "assignment": [
          "读 CSS-Tricks 的 Reboot, Resets, and Reasoning——reset 的历史，以及「一个 reset 是有观点的」到底意味着什么。",
          "读 Matt Brictson 的 Making the case for CSS normalize and reset stylesheets in 2023——它把各种 reset 的差异和「为什么你会选它」讨论得很清楚。",
          "读 Josh Comeau 的 custom CSS reset——他对所用每条规则的思考过程做了很棒的拆解，能让你学会怎么为这些决定做推理。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/intermediate_css_concepts/default_styles.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "7a5a63fa654931a3a641cecad1b7094f6290be76317b8cd4a58c070f954142d1",
        "verifiedAt": "2026-09-25"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-css-units",
      "title": "CSS Units",
      "zh": "CSS 单位",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-css-units",
      "summary": "CSS 尺寸单位分两类：绝对单位（px——网页项目里你唯一该用的绝对单位，in/cm 那些属于打印场景）与相对单位（em/rem 挂字号、vh/vw 挂视口、% 挂父元素）。经验法则：优先 rem。官方更教了比「背单位表」有用的思维方式：先想清楚「这个尺寸该跟着什么变」，再选单位。",
      "guide": "以下是官方原课的中文化梳理。这一课把 CSS 单位劈成两半：**绝对单位**在任何上下文里都一样（px 是网页里唯一该用的）；**相对单位**随上下文变——rem 跟根字号、em 跟自身/父级字号、vh/vw 跟视口、% 跟父元素。官方给的经验法则是「优先 rem」，但更值钱的是一节方法论：单位多到背不完（光长度单位就一大把），别找「什么场景用什么单位」的死规则——想清楚你要元素怎么表现、这个尺寸该随什么缩放，再去查哪个单位能表达它。查资料不丢人，这是官方明说的。",
      "understand": [
        "绝对单位在任何上下文里都恒定：px 是像素、不随页面上别的东西变——网页项目里你唯一该用的绝对单位就是 px（in/cm 等物理单位属于打印场景）",
        "1em = 该元素的 font-size（若用 em 设 font-size 则参照父元素）：16px 字号下 4em 宽 = 64px",
        "1rem = 根元素（html / :root）的 font-size——数学和 em 一样，但不用追踪父级字号，经验法则：优先 rem",
        "依赖 em 意味着上下文一变尺寸就变——这多半不是你想要的行为",
        "用 rem 之类的相对单位定义全站字号是被推荐的：很多浏览器允许用户改基础字号提升可读性，应当尊重",
        "1vh = 视口高度的 1%、1vw = 视口宽度的 1%——全高 hero、全屏 app 式界面这类「跟着视口走」的尺寸用它们",
        "单位多到背不完是常态：先想「我要什么行为」（跟根字号？跟父级？跟视口？固定？），再查哪个单位表达它"
      ],
      "terms": [
        {
          "en": "Absolute unit",
          "zh": "绝对单位：任何上下文里都恒定不变——网页里指 px；in/cm 等物理单位属于打印"
        },
        {
          "en": "Relative unit",
          "zh": "相对单位：随参照物变化——rem/em 参照字号、vh/vw 参照视口、% 参照父元素"
        },
        {
          "en": "rem",
          "zh": "root em：根元素（html）字号的倍数——全站可控、不受父级影响，官方经验法则的首选"
        },
        {
          "en": "em",
          "zh": "元素自身 font-size 的倍数（设 font-size 时参照父元素）——会随上下文漂移，用前要三思"
        },
        {
          "en": "Viewport units (vh / vw)",
          "zh": "视口单位：1vh = 视口高度的 1%，1vw = 视口宽度的 1%"
        }
      ],
      "tasks": [
        "读 MDN 的 CSS values and units（有官方中文版）——全部可用单位的总览",
        "读 Cody Loyd 的 CSS units 一文（官方给的是存档快照地址）——em / rem / px 该在什么时候用，讲得很深",
        "看 CSS-Tricks 的 Fun with Viewport Units——vh/vw 能玩出的一些有趣效果",
        "（本地动作）打开你项目里任意一段 CSS，把其中的 rem/em/px 各找一处，用 DevTools 的 Computed 面板看它们的实际像素值"
      ],
      "quiz": [
        {
          "question": "一个元素 font-size 是 16px，把它的 width 设为 4em 等于多少像素？em 和 rem 的关键差异是什么？",
          "answer": "4 × 16 = 64px。em 参照的是元素自身（设 font-size 时是父元素）的字号，rem 参照的是根元素（html）的字号——数学相同，但 rem 不用追踪父级字号，不会因为嵌套上下文变化而漂移。所以经验法则是优先 rem。"
        },
        {
          "question": "为什么官方推荐用 rem 这类相对单位定义全站字号？",
          "answer": "很多浏览器允许用户修改基础字号来提升可读性。用相对单位定义字号会跟随用户的设置缩放——尊重用户对字号的意愿（官方：if at all possible，应当尊重）。全用 px 写死就架空了这个能力。"
        },
        {
          "question": "vh/vw 是什么？各举一个官方给出的适用场景。",
          "answer": "1vh = 视口高度的 1%，1vw = 视口宽度的 1%——尺寸跟着浏览器视口走。官方例子：全高 hero 区块（如 100vh）、全屏 app 式界面。想要「元素尺寸 = 视口的某个百分比」时才用它们。"
        },
        {
          "question": "面对多到背不完的 CSS 单位，官方建议的决策方式是什么？",
          "answer": "不要找「什么场景用什么单位」的死规则，也别指望背下来（官方明说短期内背不会、背了也没多大用）。像对待其他代码一样：先想你要元素表现成什么样、想写什么指令——比如 margin 该随根字号缩放就用 rem、该固定就用 px、宽度要占父级一半用 50%、要占视口一半宽用 50vw——再查哪个单位能表达。需要时再查资料，这在编程旅程里对任何知识都成立。"
        }
      ],
      "optional": [],
      "note": "",
      "why": "单位是每一行 CSS 的地基：间距、字号、宽高、断点全都要选单位。这一课给你两样东西——一张「参照物地图」（px 固定、rem 跟根字号、% 跟父级、vw/vh 跟视口）和一种比背表耐用的决策方式（先想行为再选单位）。之后写响应式布局、调排版时，你不会再在 px 和 rem 之间凭感觉摇摆。",
      "sections": [
        {
          "h": "绝对单位：px 是网页里唯一该用的",
          "p": [
            "绝对单位在任何上下文里**都一样**：px 是绝对的——一个像素的大小不随页面上的其他东西变。",
            "事实上，**px 是你在网页项目里唯一应该使用的绝对单位**。其余绝对单位（in 英寸、cm 厘米这类物理单位）在**打印**场景才有意义。"
          ]
        },
        {
          "h": "em 与 rem：都挂在字号上",
          "p": [
            "`em` 和 `rem` 都指一个字号，虽然它们常被用来定义别的尺寸。两个你都会经常见到，所以都讲——但经验法则：**优先 `rem`**。",
            "`1em` = 该元素的 `font-size`（如果是用 em 来设 font-size，则参照父元素的字号）。例：元素字号 16px，把宽度设成 `4em` 就是 64px（16 × 4）。",
            "`1rem` = **根元素**（`:root` 或 `html`）的 font-size。数学和 em 完全一样，但少了「追踪父级字号」的复杂度。",
            "依赖 `em` 意味着：上下文一变，尺寸就跟着变——这**多半不是**你想要的行为。"
          ]
        },
        {
          "h": "视口单位 vh / vw",
          "p": [
            "`vh` 和 `vw` 挂的是**视口**的尺寸：`1vh` = 视口高度的 1%，`1vw` = 视口宽度的 1%。",
            "任何「尺寸要相对视口」的场合都用得上——官方例子：**全高 hero**、**全屏 app 式界面**。"
          ]
        },
        {
          "h": "单位这么多！别背，想行为",
          "p": [
            "去查 CSS 全部可用单位——哪怕只查长度单位（MDN 的 length 参考页）——你会看到**多到离谱**的一堆。怎么知道该用哪个？",
            "官方给的路子不是背表：**别找「什么情境用什么单位」的规则**。每个单位做的事不同，像写其他代码一样——先想你要元素**表现成什么样**、想写什么**指令**，再看哪个单位能帮你表达。",
            "同一课里的对比例子：想让某个 margin 随根字号缩放 → `rem`；另一个 margin 就该钉死 → `px`；想让这个 div 是**父级**的一半宽 → `50%`；想让那个 div 是**视口**的一半宽 → `%` 不对，该用 `vw`。",
            "官方原话：这些你短期内背不下来，背了也没多大用——**需要的时候再查**（这条对你编程旅程里的一切知识都成立）。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "css",
          "code": "html {\n  font-size: 16px; /* 根字号：rem 的参照物 */\n}\n\n.card {\n  font-size: 16px;\n  width: 4em;        /* = 64px：挂自身字号 */\n  padding: 1.5rem;   /* = 24px：挂根字号，不受 .card 字号影响 */\n  margin-bottom: 8px; /* 钉死不缩放：px */\n}\n\n.hero {\n  min-height: 100vh; /* 全高 hero：挂视口 */\n  width: 50vw;       /* 视口宽度的一半 */\n}",
          "note": "本站示意代码（官方正文用文字给出 16px × 4em = 64px 的算例）：同一段里四种参照物并存——em 挂自身字号、rem 挂根字号、px 固定、vh/vw 挂视口。改 html 的 font-size 看 rem 全跟着变、改 .card 的 font-size 看只有 em 跟着变——这就是「先想参照物」的手感。"
        }
      ],
      "pitfalls": [
        {
          "title": "在深层嵌套里用 em 定尺寸",
          "text": "em 挂的是自身/父级字号——嵌套一深、或某层改了 font-size，尺寸就跟着漂。官方经验法则：优先 rem，除非你明确要「随本地字号缩放」的行为。"
        },
        {
          "title": "全站字号写死 px",
          "text": "很多浏览器允许用户调大基础字号提升可读性——rem 会跟随，px 不会。官方明确建议：尽可能尊重用户对字号的意愿。"
        },
        {
          "title": "想占视口宽度却写了 %",
          "text": "% 参照的是父元素的尺寸，不是视口——父级不满屏时 50% ≠ 半屏。要挂视口用 vw/vh；要挂父级才用 %。官方在正文里专门用这对反例提醒你。"
        },
        {
          "title": "试图背下单位表",
          "text": "光长度单位就一大把，官方明说背不下来也没必要。记住参照物地图（px 固定 / rem 根字号 / em 本地字号 / % 父级 / vw、vh 视口），具体单位用到再查。"
        }
      ],
      "official": {
        "assignment": [
          "读 MDN 的 CSS values and units（有官方中文版）——覆盖全部可用单位。",
          "读 Cody Loyd 的文章 CSS units（官方给的是 web.archive.org 存档快照地址）——深入讲 em、rem、px 该在何时用。",
          "看 CSS-Tricks 的 Fun with Viewport Units——演示 vh 和 vw 能做出的一些有趣东西。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/intermediate_css_concepts/css_units.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "5eb947700212d845d475ff0878943c7cc4b9b3d8bb195cc7e50790a0dcdebb6e",
        "verifiedAt": "2026-09-25"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-more-text-styles",
      "title": "More Text Styles",
      "zh": "更多文本样式",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-more-text-styles",
      "summary": "文本与字体的中级课：上半讲字体从哪来——系统字体栈（font stack 的存在理由与 system-ui 思路）、Web 字体（在线字体库 link/@import 与自托管 @font-face，都要带 fallback，还有性能与 GDPR 隐私考量）；下半是六个文本属性——font-style（样式归 CSS、语义归 em）、letter-spacing、line-height、text-transform、text-shadow、省略号三件套（nowrap + hidden + ellipsis）。",
      "guide": "以下是官方原课的中文化梳理。这一课分两大块。**字体来源**：指定了用户机器上没有的字体就会落到 fallback——所以项目里常见一长串字体栈；想用设备上没有的字体就得从线上引入（字体库或自托管），两条路各有性能与可靠性代价，还牵出 GDPR 这样的隐私合规问题。**文本属性**：六个常用属性各配一小节——最值得记的是 font-style 与 `<em>` 的分工原则（纯视觉用 CSS、语义强调用 HTML 元素）和省略号三件套（text-overflow 单写不生效，必须配 white-space: nowrap 与 overflow: hidden）。官方在 letter-spacing 与 line-height 两处放了 CodePen 演示（在官方原课页面里），本站按惯例不嵌第三方演示。",
      "understand": [
        "指定了用户设备上没有的字体（如 Impact）会显示 fallback 字体；没定义 fallback 就用默认 HTML 字体（往往丑）——所以项目里常见长长的字体栈",
        "系统字体栈的思路：font-family 列表按顺序逐个尝试直到命中已安装字体；流行的 CSS-Tricks system font stack 以 system-ui 打头——用系统 UI 默认字体，效果中性耐看",
        "Web 字体两条引入路：在线字体库（复制 <link> 或 @import 片段）与自托管（@font-face 声明本地字体文件）——引入后都像普通 font-family 一样用",
        "无论哪条路都必须配 fallback 字体：外部 API 的 URL 可能变、服务可能挂——fallback 保证出事时站点不至于完全破相",
        "引入字体有性能问题（Assignment 的 web.dev 文章细讲）——设计允许时优先字体栈；另有合规考量：德国法院裁定用 Google Fonts API 违反欧盟 GDPR（IP 传给 Google），在意合规就下载自托管",
        "字体文件格式有多种（fileinfo 有清单），浏览器支持不一（W3Schools 有对照表）——选格式要留心",
        "font-style 与 <em> 的分工：纯视觉的斜体/加粗用 CSS 属性；要语义强调就用正确的 HTML 元素（em）——MDN 的 em 文档强调同一观点",
        "letter-spacing 调字母间距（慎用，别把可读性弄丢）；line-height 调行距（加一点提升可读性）；text-transform 改大小写（全大写标题/每词首字母大写）；text-shadow 给文字加阴影（省着用，标题上效果好）",
        "省略号截断是三件套：white-space: nowrap + overflow: hidden + text-overflow: ellipsis——文字印出容器默认不算 overflow（官方原话：我们知道这很confusing），所以三件缺一不可"
      ],
      "terms": [
        {
          "en": "Font stack / fallback",
          "zh": "字体栈：font-family 里按顺序排的一串字体——逐个尝试直到命中已安装的；fallback 是其中兜底的通用字体"
        },
        {
          "en": "system-ui",
          "zh": "关键字字体：直接取当前操作系统 UI 的默认字体——系统字体栈的打头项，效果中性"
        },
        {
          "en": "Web font",
          "zh": "从线上引入的字体（字体库或自托管资产）——用户设备没有的字体靠它，代价是性能与可靠性"
        },
        {
          "en": "@font-face",
          "zh": "自托管字体的 CSS 规则：声明字体名与文件地址（src），之后像普通 font-family 一样使用"
        },
        {
          "en": "text-overflow: ellipsis",
          "zh": "溢出文字截成省略号——必须与 white-space: nowrap、overflow: hidden 三件同写才生效"
        }
      ],
      "tasks": [
        "读 MDN 的 Web fonts 一文（有官方中文版）并做文中练习——官方要求 and do the exercises",
        "读 web.dev 的 font best practices——理解引入字体的性能考量与缓解手段",
        "读 web.dev 的 typography 一文——理解排版对开发者的重要考量",
        "（本地动作）给你自己的一个项目页面写一条带 fallback 的字体栈（可以直接用官方正文里的 system font stack），DevTools 里确认实际命中的是哪款字体"
      ],
      "quiz": [
        {
          "question": "为什么项目里的 font-family 往往是一长串字体？system font stack 的打头项 system-ui 是什么思路？",
          "answer": "指定的字体用户设备上可能没装——没装就落到 fallback；一串字体是按顺序逐个尝试直到命中已安装的。system-ui 直接取当前操作系统 UI 的默认字体：不用引入任何 Web 字体就得到中性、和系统一致的观感——这是 CSS-Tricks 那份流行字体栈的核心思路。"
        },
        {
          "question": "引入 Web 字体（无论字体库还是自托管）为什么必须配 fallback？除了可靠性还有什么代价？",
          "answer": "外部 API 的 URL 可能变、服务可能挂——合理的 fallback 保证出事时站点不至于完全破相；自托管也可能有文件问题，同理要配。代价还有性能（引入文件拖慢加载，web.dev 文章细讲缓解手段）与合规（德国法院裁定 Google Fonts API 把用户 IP 传给 Google、违反 GDPR——在意合规就下载字体自托管）。"
        },
        {
          "question": "想让文字变斜体，什么时候用 font-style: italic，什么时候用 <em>？",
          "answer": "看意图：纯视觉/样式目的的斜体（比如所有标题都斜体）用 CSS 的 font-style；表达「这段文字有语义上的强调」用 <em> 元素——它不只斜体，还携带强调语义（读屏器等能感知）。官方给的三句 「I never said he stole your money」示例展示 em 换位置强调点就变——这是语义，不是样式。"
        },
        {
          "question": "单行省略号截断需要哪三个属性？为什么缺一不可？",
          "answer": "white-space: nowrap（强制单行不折行）+ overflow: hidden（制造「溢出被裁剪」的容器状态）+ text-overflow: ellipsis（把被裁处画成省略号）。关键坑：文字印到容器外默认不算 overflow（官方原话承认这很 confusing）——不写 nowrap 和 hidden，text-overflow 根本不会触发。官方还打趣：做好每次用都要回来查这段的准备。"
        }
      ],
      "optional": [],
      "note": "",
      "why": "排版是作品集观感的第一变量：字体选择、行距、字号直接影响「像不像专业作品」。这一课把字体从哪来（栈/库/自托管）与文本怎么调（六个属性）一次讲清，还顺带覆盖两个职业级考量——Web 字体的性能账与 GDPR 合规。省略号三件套则是界面开发里复用率最高的片段之一。",
      "sections": [
        {
          "h": "字体栈：为什么 font-family 那么长",
          "p": [
            "Foundations 里学过用 `font-family` 换字体，当时有些细节略过了。现在补上：如果你指定 `Impact` 或 `Times New Roman` 这类字体，而用户电脑上**恰好没装**，就会显示 **fallback 字体**；如果你没定义 fallback，就用默认 HTML 字体——往往有点丑。",
            "所以项目里常见一长串字体列表。一个流行的选择是 CSS-Tricks 的 **system font stack**：",
            "这串「长得有点荒谬」的字体列表，目的是**用系统 UI 的默认字体**：按顺序逐个尝试，命中第一个已安装的就用。用这样的栈往往效果不错——尤其当你想要「中性」的字体风格时。"
          ],
          "list": [
            "```css",
            "body {",
            "  font-family: system-ui, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";",
            "}",
            "```"
          ]
        },
        {
          "h": "Web 字体：引入与 fallback",
          "p": [
            "想用用户设备上**没有**的字体，就得从线上引入——字体库或你站点上的资产。两种方式都会把字体引进来、供 CSS 的 `font-family` 使用。",
            "记住：**一定要加 fallback 字体**。链接外部 API 时，你无法保证 URL 不变、服务不挂——合理的 fallback 意味着出问题时站点至少不会完全破相。",
            "引入文件还有**性能问题**（Assignment 的阅读里细讲）。所以：**设计允许时优先用字体栈**，但确实有想用的引入字体时，也自当用。"
          ]
        },
        {
          "h": "在线字体库与隐私合规",
          "p": [
            "拿设备外字体最流行省事的办法是**在线字体库**：去网站选好字体，复制一段代码把字体从他们的服务器引入你的网站——给你一个放进 HTML 的 `<link>` 标签，或一段放在 CSS 文件顶部的 `@import`。",
            "常见的在线字体库有（不限于）Font Library、Font Bunny 和 Google Fonts。",
            "用字体库有个重要考量：**库的隐私政策与你需要遵守的法规**。例：德国法院裁定**使用 Google Fonts API 违反欧盟 GDPR**（页面加载会把访客 IP 传给 Google）。如果你在意这类合规，可以把字体从库里**下载下来自己托管**。"
          ],
          "list": [
            "```html",
            "<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">",
            "<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>",
            "<link href=\"https://fonts.googleapis.com/css2?family=Roboto&display=swap\" rel=\"stylesheet\">",
            "```",
            "```css",
            "/* 或者用 @import 放在 CSS 文件顶部 */",
            "@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');",
            "```"
          ]
        },
        {
          "h": "自托管字体：@font-face",
          "p": [
            "从网上下载的字体也能用：在 CSS 里用 `@font-face` 规则引入并定义自定义字体，之后像任何 font-family 一样使用。",
            "字体文件格式有多种（fileinfo.com 有格式清单），选择要留心——**有些格式并非所有浏览器都支持**（W3Schools 有浏览器×格式对照表）。",
            "这条路**可能**比依赖第三方字体 API 更可靠，但配 fallback 永远是明智的。"
          ],
          "list": [
            "```css",
            "@font-face {",
            "  font-family: my-cool-font;",
            "  src: url(../fonts/the-font-file.woff);",
            "}",
            "h1 {",
            "  font-family: my-cool-font, sans-serif; /* 依然带 fallback */",
            "}",
            "```"
          ]
        },
        {
          "h": "font-style 与 em：样式归 CSS，语义归 HTML",
          "p": [
            "`font-style` 通常用来把字体变斜体。你学过 HTML 的 `<em>` 标签——它显示为斜体，但它**同时**表示「所包文字重要、应被强调」。",
            "好的经验法则：只想让文字**看起来**斜体（或加粗、下划线、高亮）——用 CSS 属性；文字应当有**语义上的强调**——用正确的 HTML 元素。MDN 的 Emphasis 元素文档强调的正是这一点。",
            "例：想让所有标题都斜体 → `font-style`；想让一句话**中间的某个词**斜体以示强调 → `em` 元素。看官方示例——同一句话，em 的位置不同，强调的语义完全不同："
          ],
          "list": [
            "```css",
            "/* 样式目的的斜体：用 CSS */",
            "h1 { font-style: italic; }",
            "```",
            "```html",
            "<!-- 语义目的的强调：用 em -->",
            "<p>I <em>never</em> said he stole your money</p>",
            "<p>I never said <em>he</em> stole your money</p>",
            "<p>I never said he stole <em>your</em> money</p>",
            "```"
          ]
        },
        {
          "h": "四个轻量文本属性",
          "p": [
            "这些规则都简单自明，细节随时查文档（MDN 的 text-transform 与 text-shadow 页都有清晰示例，资源区有直达）：",
            "官方在 letter-spacing 与 line-height 两节各放了一个 CodePen 演示（在官方原课页面里，本站不嵌第三方演示）。"
          ],
          "list": [
            "**letter-spacing**：调单词内字母间距——可用于微调你觉得过挤/过松的自定义字体，标题上也常好看。**省着用、小心用：别把站点弄得难读！**",
            "**line-height**：调折行文本的行间距——加一点行高能提升可读性",
            "**text-transform**：改文字大小写——比如强制标题全大写、或每词首字母大写",
            "**text-shadow**：给选中元素的文字加阴影——最好省着用，但用在标题等展示性文字上效果可以很好"
          ]
        },
        {
          "h": "单行省略号：三件套",
          "p": [
            "这不是单个属性，是个值得放进工具箱的技巧：用 `text-overflow` 把溢出的文字截成省略号。",
            "但**让「溢出」发生**需要另外两个属性配合——因为文字印到容器外面，默认**不算** `overflow`（官方原话：我们知道这很 confusing，抱歉）。",
            "官方还打趣：做好准备——每次想用都得回来查一遍这段。完整片段："
          ],
          "list": [
            "```css",
            ".overflowing {",
            "  white-space: nowrap;   /* 强制单行 */",
            "  overflow: hidden;      /* 裁剪溢出 */",
            "  text-overflow: ellipsis; /* 裁口画省略号 */",
            "}",
            "```"
          ]
        }
      ],
      "examples": [
        {
          "lang": "css",
          "code": "body {\n  font-family: system-ui, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n}",
          "note": "官方正文的 CSS-Tricks 系统字体栈原样：system-ui 打头（取系统 UI 字体），后面是按流行度排的 fallback 链，最后还带上表情符号字体。逐个尝试直到命中——这就是「字体栈」。"
        },
        {
          "lang": "html",
          "code": "<p>I <em>never</em> said he stole your money</p>\n<p>I never said <em>he</em> stole your money</p>\n<p>I never said he stole <em>your</em> money</p>",
          "note": "官方示例：三句话字面完全相同，em 的位置不同、强调的语义就不同（否认「说过」/ 否认「他」/ 否认「你的」）。这是「语义强调用 em、纯视觉斜体用 font-style」的最好论据。"
        },
        {
          "lang": "css",
          "code": ".overflowing {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}",
          "note": "官方省略号三件套完整片段。三件缺一不可：不 nowrap 文字会折行（没有「单行溢出」）、不 hidden 文字只是印出容器（默认不算 overflow）、只写 ellipsis 什么都不会发生。"
        }
      ],
      "pitfalls": [
        {
          "title": "引入 Web 字体不配 fallback",
          "text": "外部 API 会变会挂、自托管文件可能出问题——没有 fallback 时字体一失效页面就落回默认 HTML 字体（往往很丑）。官方反复强调：fallback 永远要配。"
        },
        {
          "title": "拿 font-style 冒充语义强调（或反过来）",
          "text": "「I never said he stole your money」三句示例说明：em 携带的是语义（读屏器能感知），font-style 只是视觉。样式目的用 CSS，语义目的用 HTML 元素——混用会让强调信息丢失或语义污染。"
        },
        {
          "title": "只写 text-overflow: ellipsis",
          "text": "文字印出容器默认不算 overflow——必须 white-space: nowrap + overflow: hidden 同时在场，省略号才会出现。三件套背不下来没关系（官方也这么说），但要记住「缺件就不生效」这个事实。"
        },
        {
          "title": "letter-spacing / text-shadow 用过头",
          "text": "官方对两个属性的提醒一模一样：省着用（sparingly）。字母间距拉太开或压太紧都伤可读性，阴影太重则脏——它们都是「微调」工具，不是主料。"
        }
      ],
      "official": {
        "assignment": [
          "读 MDN 的 Web fonts 一文（有官方中文版）并做文中的练习（官方原话 and do the exercises）。",
          "读 web.dev 的 font best practices 一文——理解引入字体的性能考量与缓解问题的办法。",
          "读 web.dev 的 typography 一文——理解排版方面对开发者重要的一些考量。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/intermediate_css_concepts/more_text_styles.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "9e1166c7c8e0aea63b62caaee3ef22ca84b46906fe04b016809175c9a463ca1e",
        "verifiedAt": "2026-09-25"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-more-css-properties",
      "title": "More CSS Properties",
      "zh": "更多 CSS 属性",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-more-css-properties",
      "summary": "官方自称格式特殊的一课：本质是一份「常用 CSS 属性清单」——background（8 合 1 简写，能放图、能多层）、border 与 border-radius、box-shadow（官方叮嘱：省着用、用轻的）、overflow（内容装不下时怎么办）、opacity（透明度）。CSS 属性多到不可能全背，日常常用的其实是一小撮——这课覆盖的就是那一小撮的大部分。",
      "guide": "以下是官方原课的中文化梳理。官方开门见山：CSS 属性**非常多**，但你日常真正会用到的少得多——本课就是把「你以后会经常用到的那批」过一遍。格式和别的课不同：每个属性一小节，给一段描述 + 文档链接，**不要求记住**每个属性的确切顺序和语法——知道它们存在、大概能干什么就够。五个主角：background（其实是 8 个属性的简写，不止能设背景色）、border/border-radius（比 background 简单得多的简写）、box-shadow（制造层次感，但要克制）、overflow（内容太大装不下时的行为）、opacity（透明度，做 hover 与叠层的利器）。",
      "understand": [
        "CSS 属性极多，但日常常用的少得多——本课覆盖常用的大部分；不需要记住确切语法，知道存在与用途即可",
        "background 是 8 个背景相关属性的简写：不止背景色——还能设背景图、位置、尺寸、重复/平铺方式，且支持多个背景层",
        "background 的子属性完全可以单独写——有些场合单独写比默认用简写更容易、更清晰（与 flex/margin/padding 这些「几乎总是该用简写」的属性形成对比）",
        "background 文档里的 Formal Syntax 一节非常吓人——官方安抚：别被劝退，因为简写的许多子属性可选、位置灵活，基本语法本来就难定义",
        "border 也是简写但简单得多：定好尺寸、样式、颜色三样即可；border-radius 做圆角——每个角不同半径的花式玩法很少有用，归入「需要时再查」",
        "box-shadow 给元素四周加阴影：制造页面层次感与元素间的微妙分离；用法直白，但最好省着用、用得微妙——优先更轻、几乎看不见的阴影，而非更深更亮的",
        "overflow 定义内容大到装不下时元素的行为：最常见用法是给网页内的元素加滚动条（如可滚动的卡片）",
        "opacity 让元素更透明/更不透明：做 hover 效果、把元素叠在别的元素上时很有用"
      ],
      "terms": [
        {
          "en": "Shorthand property",
          "zh": "简写属性：一条声明同时设置多个相关属性——background 是 8 合 1，border 是尺寸/样式/颜色的简写"
        },
        {
          "en": "box-shadow",
          "zh": "给元素四周加阴影效果的属性——层次感与分离感来源，官方叮嘱克制使用"
        },
        {
          "en": "overflow",
          "zh": "内容超出元素盒子时的处理行为——最常见的是给元素加滚动条"
        },
        {
          "en": "opacity",
          "zh": "元素透明度（0 全透明 ~ 1 不透明）——hover 效果与叠层的常用工具"
        }
      ],
      "tasks": [
        "读官方正文与本站讲解：对五个属性建立「存在 + 用途」的印象（不要求记语法）",
        "把 Assignment 的 6 个 MDN 属性文档过一遍（background / border / border-radius / box-shadow / overflow / opacity，都有官方中文版）——看每个属性有哪些可用值",
        "（本地动作）给你项目里的一个按钮或卡片加一层几乎看不见的轻阴影（box-shadow），再做一个定高滚动容器（overflow: auto）——把清单里最常用的两个变成手感"
      ],
      "quiz": [
        {
          "question": "为什么说 background「其实是一个顶八个」？什么时候值得拆开子属性单独写？",
          "answer": "background 是 8 个背景相关属性的简写：背景色、背景图、位置、尺寸、重复/平铺方式等都能一条搞定，还支持多个背景层。官方特别指出：这些子属性完全可以单独用，有些场合单独写比一律用简写更容易、更清晰——这与 flex/margin/padding 那类「几乎总是优先简写」的属性形成对比。"
        },
        {
          "question": "官方对 box-shadow 的使用建议是什么？",
          "answer": "省着用（sparingly）、用得微妙（subtly）：优先更轻、几乎看不见的阴影，而不是更深或更亮的颜色。它的价值是制造页面层次感与元素间的微妙分离——重阴影会显得脏而不是有层次。"
        },
        {
          "question": "background 文档的 Formal Syntax 一节为什么「crazy」？官方让你怎么对待它？",
          "answer": "因为组成简写的许多子属性是可选的、还能出现在定义的不同位置——基本语法本来就很难精确写出来，所以那节看起来吓人。官方的态度：别被它劝退（Don't let it deter you），你也根本不需要记住确切顺序和语法——知道属性存在、大概能干什么就够了。"
        }
      ],
      "optional": [],
      "note": "",
      "why": "这一课是「从会布局到会打磨」的过渡：背景层、圆角、阴影、滚动容器、透明度——作品集页面从「能看」到「精致」差的往往就是这几样。官方把它们集中成一课并明确「不用背」，就是让你先建立属性地图，做项目时知道该回来查什么。",
      "sections": [
        {
          "h": "不用背的属性清单",
          "p": [
            "到现在你对 CSS 的重要基础概念应该已经握得挺牢，但 CSS 能做的事还多得多——是时候过一遍那些能给项目「上光」的实用小特性了。",
            "CSS 属性**非常多**。好在不用全背：日常真正用到的少得多。本课覆盖你以后会经常用到的大部分。",
            "本课格式有点特别——本质上就是一份 CSS 属性清单：每个属性给一小段描述，再链到文档让你看全部可用值。官方原话：**不需要记住**每个属性的确切顺序和语法——知道它们存在、对用途有个大致概念就够。"
          ]
        },
        {
          "h": "background：一个顶八个",
          "p": [
            "你多半已经试过设背景色，但 `background` 能做的远不止这些：它其实是 **8 个**背景相关属性的**简写**（全部子属性见文档链接）。",
            "除了背景色，还能：指定**背景图**、改背景图的**位置与尺寸**、改背景图**重复/平铺**的方式（图太小铺不满容器时），甚至可以有**多个背景层**。",
            "注意：这些子属性**可以单独使用**——有些场合单独写比默认用简写**更容易也更清晰**。这和一些别的简写属性相反（flex、margin、padding 那些几乎总是优先用简写）。",
            "文档里关于这个简写和全部子属性的信息量很大。之前说过：**不需要背**确切顺序和语法。还有一个提醒：它的 **Formal Syntax** 一节长得**吓人**——别被劝退。基本语法之所以难定义，是因为组成简写的许多属性可选、或能出现在定义的不同位置。"
          ]
        },
        {
          "h": "border 与 border-radius",
          "p": [
            "`border` 和 `border-radius` 你多半已经用过。`border` 也是简写，但比 background 的简写**简单得多**：基本上定好**尺寸、样式、颜色**三样就行。",
            "`border-radius` 用来做圆角。文档里你会看到可以玩出花——给元素的每个角定不同的半径——但这**很少有用**。把这类信息归入「有需要时再去查」的类别。"
          ]
        },
        {
          "h": "box-shadow：省着用，用轻的",
          "p": [
            "顾名思义，`box-shadow` 给元素四周加阴影效果。用途：给页面制造**层次感**、在元素之间加**微妙的分离**。",
            "用法直白，但记住：最好**省着用、用得微妙**——优先更轻、几乎看不见的阴影，而不是更深或更亮的颜色。"
          ]
        },
        {
          "h": "overflow 与 opacity",
          "p": [
            "`overflow` 定义**内容太大装不下时**元素怎么办。最常见的用法：给网页内的元素加**滚动条**——比如一个内容可滚动的 card 式元素。",
            "`opacity` 是另一个简单但某些场合非常好用的属性：让元素**更透明或更不透明**。做 hover 效果、把元素**叠**在别的元素上时都用得到。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "css",
          "code": ".card {\n  /* background 简写之外，子属性也常单独写（官方：有时更清晰） */\n  background-color: #fff;\n  background-image: url(texture.png);\n  background-size: cover;\n\n  border: 1px solid #ddd;   /* 尺寸 + 样式 + 颜色，三样就够 */\n  border-radius: 8px;        /* 四角同半径；逐角定制很少有用 */\n\n  /* 轻到几乎看不见的阴影（官方的克制口径） */\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);\n}\n\n.scroll-box {\n  height: 12rem;\n  overflow: auto;  /* 装不下就给滚动条 */\n}\n\n.card:hover {\n  opacity: 0.9;  /* hover 反馈的最轻做法 */\n}",
          "note": "本站示意代码（官方正文无代码块，属性与口径均出自官方描述）：一张卡片把五个属性全用上——border 三要素、克制的轻阴影、定高滚动容器、hover 透明度。背景三层子属性单独写正是官方说的「有时比简写更清晰」的场景。"
        }
      ],
      "pitfalls": [
        {
          "title": "试图记住简写的语法顺序",
          "text": "官方两次明说不需要背（尤其 background 的 Formal Syntax「crazy」是预期内的）。知道属性存在、会查文档，就是这课要的全部。"
        },
        {
          "title": "阴影又深又亮",
          "text": "box-shadow 的官方建议是 sparingly + subtly：轻到几乎看不见的阴影制造层次，深而亮的阴影只显脏。拿不准就把透明度调低、模糊调大。"
        },
        {
          "title": "以为 border-radius 逐角定制是常规操作",
          "text": "官方原话：每个角不同半径的花式玩法 rarely useful——归入「需要时再查」。日常就是四角同一个值。"
        }
      ],
      "official": {
        "assignment": [
          "过一遍下列属性的 MDN 文档（都有官方中文版）：background、border、border-radius、box-shadow、overflow、opacity。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/intermediate_css_concepts/more_css_properties.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "7bb6c2bcb1ec0b0a3b48a9bfcc92a035502a4c4b63fea521387373021ec555b7",
        "verifiedAt": "2026-09-25"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-advanced-selectors",
      "title": "Advanced Selectors",
      "zh": "高级选择器",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-advanced-selectors",
      "summary": "选择器的进阶工具箱，四大家族：子代/兄弟组合器（> 只选直接子级、+ 选紧邻的下一个兄弟、~ 选后面全部兄弟）；伪类（单冒号，选已存在元素的状态或位置——:hover/:focus/:active、:root/:nth-child 等，特异性同类）；伪元素（双冒号，选标记里不存在的部分——::before/::after/::marker 等，特异性同元素）；属性选择器（[attr] / [attr=\"v\"] / ^= / $= / *=，按属性值精确或按部分匹配）。在不能或不想改 HTML 时尤其有用。",
      "guide": "以下是官方原课的中文化梳理。基础选择器（类型/类/ID）你已经熟了，这一课给的是「CSS 外科医生」的精细工具——在**不能（或不想）改 HTML 标记**时尤其有用。高级选择器多到本课不可能穷举，官方选讲最有用最常见的四族，并给你自学余下的概念与词汇：① **组合器** > + ~——不靠类名按结构关系抓元素；② **伪类**（单冒号）——按状态（:hover/:focus/:active/:link/:visited）或结构位置（:root/:first-child/:nth-child…）选已存在的元素；③ **伪元素**（双冒号）——操作标记里根本不存在的部分（::before/::after/::marker/::first-letter/::first-line/::selection）；④ **属性选择器**——[attr]、[attr=\"v\"] 精确匹配与 ^=/$=/*= 部分匹配（语法神似正则）。两串特异性数字要记牢：伪类=类=(0,0,1,0)，伪元素=元素=(0,0,0,1)。官方鼓励：打开编辑器边学边试——practice makes perfect。",
      "understand": [
        "高级选择器的典型场景：不能或不想改 HTML 标记时，按结构关系/状态/属性精细定位元素",
        "子代组合器 > 只选直接子级（下一层缩进）；main div（后代，空格）选所有深度；main > div > div 抓到孙辈",
        "下一个兄弟 + 只选紧邻其后的一个同级元素；通用兄弟 ~ 选其后全部同级——两者都只能向后看，不能向前",
        "组合器没有特殊特异性规则：得分由组成部分（类/元素等）算出，组合器本身不加分",
        "伪类单冒号：针对 HTML 里已存在的元素的另一种选取方式（状态或结构位置）；特异性同类 (0,0,1,0)，且大多可以链式叠加",
        "伪元素双冒号：针对标记里通常不存在的部分；特异性同元素 (0,0,0,1)",
        "动态伪类：:focus（光标或键盘选中中）、:hover（鼠标指针下）、:active（正被点击）——给按钮和链接「可交互感」与「触感反馈」；:link/:visited 解释了未样式化链接为什么蓝、点过为什么紫（浏览器默认样式），可接管自定义",
        "结构伪类：:root（文档最顶层，≈html 但有细微差别；全局规则如 CSS 变量、box-sizing 放这里）、:first-child/:last-child、:empty（无任何子节点）、:only-child（无兄弟）、:nth-child(5 / 3n / 3n+3 / even)（最灵活）",
        "常用伪元素：::marker（定制 li 的项目符号/编号）、::first-letter/::first-line（首字母/首行）、::selection（用户选中文字的高亮样式）、::before/::after（用 CSS 而不是 HTML 往页面加内容，常配 content 做装饰）",
        "属性选择器：[attribute] 有即选（值随意）、selector[attribute] 与其他选择器组合、[attribute=\"value\"] 精确值；部分匹配 ^= 开头、$= 结尾、*= 任意位置（类似正则）；class 也是属性；特异性同类 (0,0,1,0)；大小写不敏感匹配、连字符分词等更多玩法见 MDN"
      ],
      "terms": [
        {
          "en": "Combinator",
          "zh": "组合器：表达元素间结构关系的选择器符号——空格（后代）、>（子代）、+（下一个兄弟）、~（通用兄弟）"
        },
        {
          "en": "Pseudo-class",
          "zh": "伪类（单冒号）：按状态或结构位置选取已存在元素——:hover、:nth-child 等；特异性同普通类"
        },
        {
          "en": "Pseudo-element",
          "zh": "伪元素（双冒号）：选取标记中不存在的部分——::before、::marker 等；特异性同普通元素"
        },
        {
          "en": "Attribute selector",
          "zh": "属性选择器：按属性的存在或值（精确/前缀/后缀/包含）选取元素——[src$='.jpg'] 式"
        },
        {
          "en": "Specificity notation",
          "zh": "特异性记法 (a,b,c,d)：伪类与属性选择器记 (0,0,1,0)（同 class），伪元素记 (0,0,0,1)（同元素）——算法见 CSS-Tricks 特异性专文"
        }
      ],
      "tasks": [
        "通关 CSS Diner（flukeout.github.io）——前几关的内容你应该已熟悉，但练习和复习总没坏处；别忘读右侧的示例与解释",
        "读 Shay Howe 的 Complex Selectors 一文——比本课更细地覆盖大部分内容；注意该文有时用单冒号写伪元素，现行标准是双冒号（官方专门提醒）",
        "完成 MDN 的 Selectors Assessment（选择器评估练习，有官方中文版）——把新学的选择器知识用起来"
      ],
      "quiz": [
        {
          "question": "对官方示例标记（main.parent 下三个 div.child 各含一个 grand-child），main div、main > div、.group1 + div、.group1 ~ div 各选中什么？",
          "answer": "main div（后代组合器）：所有深度的 div——三个 child 加三个 grand-child 共 6 个。main > div：只选直接子级——三个 child。grand-child 要再下一层：main > div > div。.group1 + div：只选紧邻 group1 之后的那一个同级 div——group2。.group1 ~ div：选 group1 之后的全部同级 div——group2 和 group3。"
        },
        {
          "question": "伪类和伪元素的本质区别是什么？各自的特异性等于什么？",
          "answer": "伪类（单冒号）是 targeting HTML 里已存在元素的另一种方式——按状态（:hover）或结构位置（:nth-child）；特异性与普通类相同 (0,0,1,0)，且大多可链式叠加。伪元素（双冒号）针对标记里通常不存在的部分——::before/::after 甚至能用 CSS 凭空加内容；特异性与普通元素相同 (0,0,0,1)。"
        },
        {
          "question": ":root 是什么？全局规则为什么放这里？它和 html 是一回事吗？",
          "answer": ":root 代表文档的最顶层——唯一没有父元素的那个元素；在 Web 里基本等价于 html 元素，但两者有细微差别（官方链了一个 StackOverflow 讨论）。自定义属性/CSS 变量、box-sizing: border-box 这类「想全站可用」的全局规则惯例上放 :root。"
        },
        {
          "question": "[src]、[src=\"puppy.jpg\"]、[src$=\".jpg\"] 三个选择器分别匹配什么？^= 和 *= 又是什么？",
          "answer": "[src]：任何带 src 属性的元素（值是什么无所谓）；[src=\"puppy.jpg\"]：src 恰好等于 puppy.jpg 的元素；[src$=\".jpg\"]：src 以 .jpg 结尾的元素（puppy.jpg、kitten.jpg 都中）。^= 从字符串开头匹配、*= 匹配字符串内任意位置（通配）。这组语法与正则类似；class 也是属性，[class^='aus'] 能选 austria 和 australia。"
        }
      ],
      "optional": [],
      "note": "",
      "why": "改不动 HTML 的时候（第三方组件、旧项目、动态生成的内容），选择器就是你唯一的手术刀。四大家族各解决一类问题：组合器按结构抓、伪类按状态和位置抓、伪元素抓不存在的部分、属性选择器按元数据抓。配合特异性两串数字（伪类=类、伪元素=元素），你能预判每条规则会不会被覆盖——这是从「能写 CSS」到「能控制 CSS」的分水岭。",
      "sections": [
        {
          "h": "什么时候需要高级选择器",
          "p": [
            "用类型、类、ID 抓元素你应该已经毫无压力。但要当一名真正的「CSS 外科医生」，有时需要更专业的工具——这一课就是更细粒度 targeting 元素的高级选择器。",
            "它们在**不能（或不想）改 HTML 标记**时尤其有用。",
            "高级选择器**非常多**，逐个讲完超出本课范围——官方选讲最有用、最常见的一批，同时给你概念与词汇去自学其余的。官方原话：随时打开代码编辑器做自己的实验——**practice makes perfect**！"
          ]
        },
        {
          "h": "子代与兄弟组合器：> + ~",
          "p": [
            "先看不靠类名访问元素的更多方式——三个新选择器。官方全程用这段示例标记讲解（main.parent 下三个 div.child，class 分别是 group1/2/3，每个里面各有一个同组名的 grand-child）：",
            "你在 Intro to CSS 学过的**后代组合器**（空格）：`main div` 选中 main 里面**所有深度**的 child 和 grand-child div。",
            "想更具体、**只**选 child 或只选 grand-child？**子代组合器 `>`** 上场：与后代组合器不同，它只选**直接子级**——「往下一层缩进」的元素：`main > div` 选中三个 child；孙辈要再写一层：`main > div > div`。",
            "要选**紧挨着**目标的元素（紧随其后、同层缩进）？**下一个兄弟组合器 `+`**：`.group1 + div` 只选中 group2 那个 div；`.group1 + div + div` 选中 group3。",
            "要选某元素之后的**全部**兄弟（不只第一个）？**通用兄弟组合器 `~`**：`.group1 ~ div` 选中 group1 的所有 div 兄弟——这里是第 2、3 个 child。",
            "和后代组合器一样，这些选择器**没有特殊特异性规则**——得分由组成部分算出。想再深入，MDN 的组合器一文有很好的总览（资源区有中文版直达）。"
          ],
          "list": [
            "```html",
            "<main class=\"parent\">",
            "  <div class=\"child group1\">",
            "    <div class=\"grand-child group1\"></div>",
            "  </div>",
            "  <div class=\"child group2\">",
            "    <div class=\"grand-child group2\"></div>",
            "  </div>",
            "  <div class=\"child group3\">",
            "    <div class=\"grand-child group3\"></div>",
            "  </div>",
            "</main>",
            "```",
            "```css",
            "main div { /* 后代：所有深度——6 个 div 全中 */ }",
            "main > div { /* 子代：只有三个 child */ }",
            "main > div > div { /* 孙辈：三个 grand-child */ }",
            ".group1 + div { /* 下一个兄弟：只有 group2 */ }",
            ".group1 + div + div { /* 链两次：只有 group3 */ }",
            ".group1 ~ div { /* 通用兄弟：group2 和 group3 */ }",
            "```"
          ]
        },
        {
          "h": "伪类 vs 伪元素：一个冒号和两个冒号",
          "p": [
            "进入伪选择器之前，先分清**伪类**与**伪元素**（MDN 有专文，资源区直达）：",
            "**伪类**选择器前缀是**单冒号**，是 targeting HTML 里**已存在**元素的另一种方式；**伪元素**前缀是**双冒号**，用来 targeting 标记里**通常不存在**的元素。",
            "一下没懂没关系——下面的例子会讲透。两族的特异性也不同：伪类与常规类相同 **(0, 0, 1, 0)**，且大多可以像常规类一样**链式叠加**；伪元素与常规元素相同 **(0, 0, 0, 1)**。（这串记法的算法在 CSS-Tricks 的特异性专文「Calculating CSS Specificity Value」一节，资源区有直达。）"
          ]
        },
        {
          "h": "动态与用户行为伪类",
          "p": [
            "这一类能让页面「活」起来（每个选择器官方都链了 CSS-Tricks almanac 条目，资源区全部直达）：",
            "**:focus**——元素正被用户选中：鼠标点选或键盘导航都算。**:hover**——鼠标指针底下的一切：给按钮和链接加「可交互」的劲头、或触发下拉菜单。**:active**——正被点击的元素：告诉用户「你的动作生效了」，给按钮加「触感」反馈特别好用。",
            "有没有想过：为什么未样式化的 HTML 里链接是蓝色、点过之后变紫色？因为**浏览器默认样式**就是这么实现的。想接管链接的自定义样式，用 **:link**（未访问）和 **:visited**（点过的）这对伪类："
          ],
          "list": [
            "```css",
            "a { text-decoration: underline; }  /* 所有链接 */",
            "a:link { color: blue; }            /* 未访问的链接 */",
            "a:visited { color: purple; }       /* 用户点过的链接 */",
            "```"
          ]
        },
        {
          "h": "结构伪类",
          "p": [
            "按元素在 DOM 里的**位置**来选——强大的一族：",
            "**:root** 代表文档最顶层——唯一没有父元素的元素。Web 里它基本等价于 `html` 元素，但两者有些**细微差别**（官方链了 StackOverflow 讨论，资源区直达）。:root 通常是你放**全局规则**的地方——想让它们全站可用：自定义属性与 CSS 变量、`box-sizing: border-box` 这类。",
            "**:first-child / :last-child**——匹配是第一个/最后一个兄弟的元素；**:empty**——完全没有子节点的元素；**:only-child**——没有任何兄弟的元素。",
            "更动态的是 **:nth-child**，一个选择器好几种用法："
          ],
          "list": [
            "```css",
            ".myList:nth-child(5) { /* 第 5 个 */ }",
            ".myList:nth-child(3n) { /* 每第 3 个 */ }",
            ".myList:nth-child(3n + 3) { /* 每第 3 个，从第 3 个起 */ }",
            ".myList:nth-child(even) { /* 全部偶数位 */ }",
            "```",
            "完整的伪类清单随时查 MDN 的 pseudo-classes 文档（资源区有中文版直达）。"
          ]
        },
        {
          "h": "伪元素",
          "p": [
            "伪类基于状态或结构去「另一种方式地」操作已有元素；伪元素更抽象——它们让你操作 HTML 里**根本不是元素**的部分。常用的这些（官方逐个链了 almanac 条目，资源区直达）：",
            "**::marker**——定制 `<li>` 的项目符号或编号样式。**::first-letter / ::first-line**——给一段文字的首字母/首行特殊样式。**::selection**——改用户选中页面文字时的高亮样式。",
            "**::before 和 ::after**——用 CSS（而不是 HTML）往页面上**加**元素，常见用途是给文字做各种装饰。官方例子——给一个 span 前后各加一串 emoji：",
            "渲染结果：Let's 😎 😄 🤓 emojify 🤓 😄 😎 this span!",
            "还有更多！MDN 的 pseudo-elements 文档（资源区中文版直达）有完整清单。"
          ],
          "list": [
            "```html",
            "<style>",
            "  .emojify::before { content: '😎 😄 🤓'; }",
            "  .emojify::after  { content: '🤓 😄 😎'; }",
            "</style>",
            "<body>",
            "  <div> Let's <span class=\"emojify\">emojify</span>this span!</div>",
            "</body>",
            "```"
          ]
        },
        {
          "h": "属性选择器",
          "p": [
            "工具箱的最后一件：**属性选择器**。属性 = HTML 开始标签里的任何东西——`src='picture.jpg'`、`href=\"www.theodinproject.com\"` 都是。属性值是**我们自己写的**，所以需要更灵活的匹配系统。属性选择器的特异性**同类与伪类**：(0, 0, 1, 0)。",
            "基本用法三式：**[attribute]**——有这个属性就选，值是什么无所谓；**selector[attribute]**——可与类/元素选择器组合（如 `img[src]`）；**[attribute=\"value\"]**——精确匹配特定值。",
            "要更泛的匹配——比如只关心 src **以 .jpg 结尾**的 img？部分匹配三式（见过的话会觉得神似**正则**）：**^=** 从开头匹配、**$=** 从结尾匹配、***=** 通配——字符串内任意位置匹配。",
            "更多玩法（大小写不敏感匹配、按连字符分词的子串匹配等）见 MDN 的 attribute selectors 文档（资源区中文版直达）。"
          ],
          "list": [
            "```css",
            "[src] { /* 任何带 src 属性的元素 */ }",
            "img[src] { /* 只限带 src 的 img */ }",
            "img[src=\"puppy.jpg\"] { /* src 恰好是 puppy.jpg 的 img */ }",
            "[class^='aus'] { /* class 也是属性！以 aus 开头：austria、australia 都中 */ }",
            "[src$='.jpg'] { /* 以 .jpg 结尾：puppy.jpg、kitten.jpg */ }",
            "[for*='ill'] { /* 任意位置含 ill：bill、jill、silly、ill 全中 */ }",
            "```"
          ]
        }
      ],
      "examples": [
        {
          "lang": "css",
          "code": "/* 对官方示例标记：main.parent > 三个 div.child（group1/2/3）各含一个 grand-child */\nmain div        { /* 后代：所有深度的 div——6 个全中 */ }\nmain > div      { /* 子代：只有三个 .child（直接子级） */ }\nmain > div > div { /* 再下一层：三个 .grand-child */ }\n\n.group1 + div   { /* 下一个兄弟：只有 group2 */ }\n.group1 ~ div   { /* 通用兄弟：group2 与 group3 */ }",
          "note": "官方正文的组合器对照示例：同一份标记，五个选择器五种命中集合。注意 + 和 ~ 都只能「向后看」——group1 之前的元素它们够不到。"
        },
        {
          "lang": "css",
          "code": ".myList:nth-child(5)      { /* 第 5 个 .myList 元素 */ }\n.myList:nth-child(3n)     { /* 每第 3 个 */ }\n.myList:nth-child(3n + 3) { /* 每第 3 个，从第 3 个开始 */ }\n.myList:nth-child(even)   { /* 全部偶数位 */ }",
          "note": "官方正文的 nth-child 四种写法。3n 与 3n+3 在这个例子里命中同一批（都从第 3 个起每 3 个）——差别在偏移量为 0 或超出一轮时（如 3n+1 从第 1 个起）。动手改 n 的系数与偏移找感觉。"
        },
        {
          "lang": "css",
          "code": "[src]                { /* 有 src 属性即选中，值随意 */ }\nimg[src=\"puppy.jpg\"] { /* 精确匹配特定值 */ }\n[class^='aus']       { /* ^= 开头：austria / australia */ }\n[src$='.jpg']        { /* $= 结尾：puppy.jpg / kitten.jpg */ }\n[for*='ill']         { /* *= 任意位置：bill / jill / silly / ill */ }",
          "note": "官方正文的属性选择器全家族：存在性、精确值、三种部分匹配（^= 开头 / $= 结尾 / *= 包含）。class 与 for 也是属性——选择器对它们一视同仁。"
        }
      ],
      "pitfalls": [
        {
          "title": "以为 > 能隔层选",
          "text": "main > div 只命中直接子级——孙辈必须显式再写一层（main > div > div）。「往下一层缩进」是 > 的精确语义，不是「里面的都算」。"
        },
        {
          "title": "伪元素写成单冒号",
          "text": "::before 写成 :before 在多数浏览器还能跑（历史兼容），但现行标准是双冒号——Assignment 第二篇 Shay Howe 文章就有时用单冒号，官方专门提醒：记住双冒号才是现在的标准。"
        },
        {
          "title": "以为组合器会加特异性",
          "text": "官方明说：组合器没有特殊特异性规则——main > div 的得分就是 main（元素）+ div（元素），> 本身不加分。写覆盖关系时别把组合器算进去。"
        },
        {
          "title": "+ 和 ~ 的方向搞反",
          "text": "两个兄弟组合器都只向后看：+ 是紧邻其后的一个，~ 是其后全部同级。想选「前面那个兄弟」没有直接选择器——那是 :has() 的时代话题，超出本课范围，先按官方词汇表把 + ~ 的方向记牢。"
        }
      ],
      "official": {
        "assignment": [
          "通关 CSS Diner（flukeout.github.io）——前几关的大部分内容你应该已经熟悉，但练习和复习总没坏处！别忘记读右侧的示例与解释。",
          "读 Shay Howe 的 Complex Selectors 一文——它以更细的粒度覆盖了本课的大部分内容。注意：文中有时用单冒号写伪元素——官方提醒，请记住双冒号才是现行标准。",
          "完成 MDN 的 Selectors Assessment（选择器评估练习）——帮你把新学的选择器知识付诸实践。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/intermediate_css_concepts/advanced_selectors.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "ef4a51524a4f9d2c47f2b261c073e66ddd83905a6e34f7b4968c9f5cd8ce525f",
        "verifiedAt": "2026-09-25"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-positioning",
      "title": "Positioning",
      "zh": "定位",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-positioning",
      "summary": "你一直在用的 margin / padding / flexbox 都建立在 CSS 的默认定位模式（position: static）上。除此之外还有四种：relative（相对自身正常位置偏移，仍占位）、absolute（脱离文档流，相对最近的定位祖先精确定位）、fixed（脱离文档流，相对视口定位、滚动不动）、sticky（滚过之前像普通元素、滚过之后像 fixed，且不脱离文档流）。官方提醒：绝对定位用途很窄，整页布局优先 flexbox / grid。",
      "guide": "以下是官方原课的中文化梳理。这一课把「元素到底待在哪、由谁决定」这件事讲清楚：先认下你一直在用的默认模式 static，再逐个看 relative / absolute / fixed / sticky 四种——重点是它们各自**相对谁**定位、**是否脱离文档流**（脱流意味着既不影响别人也不受别人影响）。官方给绝对定位划了明确边界：适合模态框、图上的说明文字、叠在其他元素上的图标，**不适合做整页布局**。Assignment 是一个视频加三篇文章：Web Dev Simplified 的 9 分钟可视化讲解、MDN 的 position 参考页、CSS-Tricks 的对比文，以及 Kevin Powell 专讲 fixed 与 sticky 的区别。",
      "understand": [
        "position: static 是每个元素的默认定位模式——你此前用 margin / padding / flexbox 移动元素，全都建立在它之上；static 元素的 top / right / bottom / left 不起作用",
        "relative 与 static 几乎一样，差别是 top / right / bottom / left 会让元素**相对它在文档流中的正常位置**发生偏移；元素仍然占据原来的空间",
        "absolute 把元素**移出正常文档流**，再相对某个祖先元素定位——脱流的元素既不影响其他元素，也不受其他元素影响；配合 top / right / bottom / left 可以把元素放到屏幕上的精确位置",
        "fixed 同样脱离文档流，但它相对**视口（viewport）**定位：用 top / right / bottom / left 放好之后，用户滚动页面它也待在那儿不动",
        "sticky 是混合行为：滚动到它之前像普通元素（**不脱离文档流**），一旦滚过它就开始表现得像 fixed 元素",
        "典型用途对号入座：absolute → 模态框 / 图片上的说明文字 / 叠在其他元素上的图标；fixed → 导航栏、悬浮聊天按钮；sticky → 分区标题（在商店里滚动时仍能看到当前分类）",
        "官方的免责声明：绝对定位的适用场景很具体，能用 flexbox 或 grid 就优先用它们，**不要拿绝对定位做整页布局**"
      ],
      "terms": [
        {
          "en": "position",
          "zh": "定位属性：取 static / relative / absolute / fixed / sticky 五个值，决定元素用哪种定位模式"
        },
        {
          "en": "static",
          "zh": "静态定位：默认值，元素按文档流正常排列，top / right / bottom / left 对它无效"
        },
        {
          "en": "relative",
          "zh": "相对定位：相对元素自己在文档流中的正常位置偏移，原空间仍然保留"
        },
        {
          "en": "absolute",
          "zh": "绝对定位：脱离文档流，相对祖先元素定位到屏幕上的精确一点"
        },
        {
          "en": "fixed",
          "zh": "固定定位：脱离文档流，相对视口定位，滚动时不动"
        },
        {
          "en": "sticky",
          "zh": "粘性定位：滚过之前是普通元素（不脱流），滚过之后表现得像 fixed"
        },
        {
          "en": "normal document flow",
          "zh": "正常文档流：元素按 HTML 顺序依次排布的默认机制；「脱离文档流」= 不再参与这套排布"
        },
        {
          "en": "viewport",
          "zh": "视口：浏览器中显示网页的那块可见区域，fixed 定位的参照物"
        }
      ],
      "tasks": [
        "读官方正文与本站讲解：把四种定位模式各自的「相对谁定位」和「是否脱离文档流」两栏在心里列成表",
        "看 Web Dev Simplified 的 Learn CSS Position 视频（9 分钟）——节奏偏快，但各种定位行为的可视化很直观",
        "读 MDN 的 position 文档——定位相关的全部概念细节都在这一页",
        "读 CSS-Tricks 的 Absolute, Relative, Fixed Positioning：How Do They Differ?——换一个视角把三者的差别讲透",
        "读 Kevin Powell 的 fixed 与 sticky 的区别一文——这两个最容易混，专文对比很有帮助",
        "动手试：官方正文里那个 sticky 演示笔（商店分类吸顶）自己滚一遍，再在自己的项目里挑一个分区标题改成 sticky"
      ],
      "quiz": [
        {
          "question": "relative 与 absolute 最本质的两个差别是什么？",
          "answer": "① 参照物不同：relative 是相对**元素自己在文档流中的正常位置**偏移，absolute 是相对**祖先元素**定位到精确一点；② 是否脱离文档流：relative 不脱流、原来的空间仍然保留（周围元素不会补上来），absolute 脱流、既不影响其他元素也不受其他元素影响（周围元素会当它不存在）。"
        },
        {
          "question": "fixed 和 sticky 都「滚动时不动」，它们的区别在哪？",
          "answer": "fixed 从一开始就脱离文档流、相对**视口**定位，永远钉在同一个位置；sticky **不脱离文档流**，在滚动到它之前它就是一个普通元素（占位、跟着文档走），只有当你滚过它之后才开始表现得像 fixed。所以 sticky 适合「先正常排布、滚到这儿才吸住」的分区标题，fixed 适合导航栏、悬浮按钮这类一开始就要钉住的元素。"
        },
        {
          "question": "官方对绝对定位给了什么明确的使用边界？",
          "answer": "绝对定位的适用场景很具体——模态框、图片上的说明文字、叠在其他元素上的图标这类「精确放在某一点、且不希望干扰周围元素」的需求；**能用 flexbox 或 grid 就优先用它们，不要拿绝对定位去做整页布局**。"
        }
      ],
      "optional": [],
      "note": "",
      "why": "「为什么这个元素跑到那儿去了」——布局调不动的时候，答案常常是某个祖先被设了 position，或者某个元素悄悄脱了流。这一课给你四种定位模式的准确心智模型：谁相对谁定位、谁还占着位置、谁已经不管别人了。之后读到任何一份 CSS 里的 position 声明，你都能立刻说出它的意图；反过来，想做悬浮导航、模态框、吸顶标题时，也知道该选哪一种而不是到处试。",
      "sections": [
        {
          "h": "你一直在用的那个默认值：static",
          "p": [
            "到现在为止，你用 margin、padding、flexbox 在屏幕上挪元素，靠的都是 CSS 的**默认定位模式**。这个默认模式很符合直觉，而且你后续几乎所有的布局需求都会继续用它。",
            "它的名字叫 `position: static`。static 与 relative 的差别其实很简单：**static 是每个元素的默认位置**，`top`、`right`、`bottom`、`left` 这四个属性对它**不起作用**。",
            "而 relative 与 static 几乎一样，只多了一件事：`top` / `right` / `bottom` / `left` 会让元素**相对它在文档流中的正常位置**发生位移。换句话说，它偏移了，但原来那块地方还给它留着。"
          ]
        },
        {
          "h": "absolute：放到精确一点，且不打扰别人",
          "p": [
            "`position: absolute` 让你把某个东西放到屏幕上的**精确一点**，同时**不打扰它周围的其他元素**。",
            "更准确地说：对一个元素使用绝对定位，会把它**从正常文档流中移出**，同时让它**相对某个祖先元素**定位。换个说法就是——被移出正常文档流的元素，既不影响其他元素，也不受其他元素影响。",
            "配合 `top`、`right`、`bottom`、`left`，你可以把元素放到屏幕上的任何位置。这个属性在「我要把某样东西精确放在某一点、又不想动到别的元素」时非常好用。官方给的几个典型场景是：**模态框（modals）**、**图片上叠着的说明文字**、**叠在其他元素之上的图标**。",
            "官方正文里就有一个用绝对定位把文字显示在图片上的演示笔（CodePen），可以自己滚一遍看效果。"
          ]
        },
        {
          "h": "官方的免责声明：别用它做整页布局",
          "p": [
            "这一条官方专门写了一段，值得单独拎出来：**绝对定位的适用场景非常具体，只要可能，就应当优先使用 flexbox 或 grid**。",
            "**绝对定位不应该被用来做整个页面的布局。** 它擅长的是「局部叠加」，不擅长的是「整体结构」——拿它搭页面，你会得到一堆互相不知道对方存在的元素，改一处就得手动重算其他所有处。"
          ]
        },
        {
          "h": "fixed：钉在视口上，滚动不动",
          "p": [
            "fixed 元素同样**被移出正常文档流**，但它是**相对视口（viewport）定位**的。",
            "你基本上就是用 `top`、`right`、`bottom`、`left` 把它放好，然后它会**一直待在那儿，即使用户滚动页面**。",
            "这类行为在**导航栏**和**悬浮聊天按钮**这种东西上特别有用。"
          ]
        },
        {
          "h": "sticky：滚过之前普通，滚过之后吸住",
          "p": [
            "sticky 元素在你滚动到它之前，**表现得像普通元素**；一旦滚过它，它就**开始表现得像 fixed 元素**。",
            "还有一点容易忽略：sticky 元素**并没有被移出正常文档流**（这一点和 fixed、absolute 都不同）。",
            "听起来可能有点绕，官方给了一个 sticky 定位的演示笔（CodePen 上 theanam 的例子），滚一遍就清楚了。它的典型用途是**分区标题**：还记得在商店里滚动浏览时，仍然能看到自己当前在哪个分类吗？那就是这么做出来的。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "css",
          "code": "/* 1. static：默认值，top/left 写了也不起作用 */\n.box-static {\n  position: static;\n  top: 20px;        /* 无效 */\n}\n\n/* 2. relative：相对自己原本的位置偏移，原空间仍保留 */\n.box-relative {\n  position: relative;\n  top: 20px;        /* 往下挪 20px，但原来的位置还给它留着 */\n  left: 12px;\n}\n\n/* 3. absolute：脱离文档流，相对最近的「已定位」祖先 */\n.card { position: relative; }        /* 给子元素一个参照物 */\n.card .badge {\n  position: absolute;\n  top: -8px;\n  right: -8px;                       /* 角标叠在卡片右上角 */\n}\n\n/* 4. fixed：相对视口，滚动不动 */\n.site-nav {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n}\n\n/* 5. sticky：滚过之前普通，滚过之后吸住（不脱流） */\n.section-title {\n  position: sticky;\n  top: 0;                            /* 必须给出至少一个方向的阈值，否则不生效 */\n}",
          "note": "本站示意代码（官方正文用的是 CodePen 演示笔，没有代码块）。五段对应五种定位模式，注意三点差别：relative 仍占位、absolute 与 fixed 脱流、sticky 不脱流但需要阈值。absolute 那段的 `.card { position: relative; }` 是常见配套写法——给绝对定位的子元素一个明确的参照祖先，否则它会一路往外找。"
        }
      ],
      "pitfalls": [
        {
          "title": "absolute 元素「跑到了意料之外的地方」",
          "text": "绝对定位是相对**祖先元素**定位的。如果没有任何祖先被设过 position（relative / absolute / fixed / sticky 都算），它就会一路往外找，最终相对整个页面定位——看起来就像「飞出去了」。修法：给你想要的那个参照容器加 `position: relative`（它本身不偏移，只是当一个锚点）。"
        },
        {
          "title": "拿绝对定位搭整页布局",
          "text": "官方明确写了不要这么做。脱流的元素互相不知道对方存在，内容一变长就要手动重算所有坐标，也无法响应式。整页结构请用 flexbox 或 grid，把绝对定位留给「局部叠加」：角标、图上文字、模态框。"
        },
        {
          "title": "sticky 不生效",
          "text": "两个常见原因：① 没有给出任何方向的阈值——`position: sticky` 必须至少配一个 `top` / `bottom` / `left` / `right`，否则它和普通元素没区别；② 某个祖先设了 `overflow: hidden`（或 auto / scroll），粘性滚动会在那个容器内被截断。先查这两处。"
        },
        {
          "title": "fixed 导航栏盖住了正文开头",
          "text": "fixed 元素脱离文档流，不再占据空间，所以正文会从视口顶端开始排、被导航栏压住第一条。给正文容器加一个等于导航栏高度的 `padding-top`（或用 scroll-margin-top 处理锚点跳转）即可。"
        },
        {
          "title": "以为 relative 偏移后原来的位置会被后面的元素补上",
          "text": "不会。relative 元素偏移后，它在文档流中原本占据的空间**仍然保留**，后面的元素照常排在原处——这正是它与 absolute 的关键区别。想要「移走且不占位」用 absolute，想要「微调但保持队列」用 relative。"
        }
      ],
      "official": {
        "assignment": [
          "Web Dev Simplified 的 Learn CSS Position 视频节奏很快，但对各种定位行为给了很好的可视化呈现。去看一遍。",
          "MDN 关于 position 的文档覆盖了定位相关的全部概念细节。",
          "CSS-Tricks 的 Absolute, Relative, Fixed Positioning：How Do They Differ? 一页会给你关于这个主题的另一种视角。也读一下。",
          "最后，Kevin Powell 的文章讨论了 fixed 与 sticky 定位之间的区别。想更好地理解两者差别，这是一篇很好的读物。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/intermediate_css_concepts/positioning.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "bac6bb97560ad6e12cd2ccf410751b6dce47aad76b5433f18a7eeaeadac4ab34",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-css-functions",
      "title": "CSS Functions",
      "zh": "CSS 函数",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-css-functions",
      "summary": "属性值写成「一个词 + 一对括号」时（如 background-color: rgb(0, 0, 0)），你用的就是 CSS 函数。和编程语言一样，它接收参数、完成特定任务——但 CSS 不允许你自己定义函数，只能用语言自带的那一批。本课讲布局与尺寸上最常用的四个：calc()（混合单位、可嵌套）、min()（取最小）、max()（取最大）、clamp()（最小值 + 缩放值 + 最大值，做流体响应式）。",
      "guide": "以下是官方原课的中文化梳理。这一课先认出一件你早就在用的事：`rgb()`、`linear-gradient()` 这类写法就是**函数调用**——括号里是参数，函数拿参数算出一个值。与 JavaScript 不同的是，CSS **不让你自己写函数**，只能用语言内置的那一批；所以学习方式是「知道有哪些、各自解决什么问题」。主体是四个和布局尺寸有关的函数：`calc()` 能在一个表达式里混用 vh / rem / px 还能嵌套，`min()` 与 `max()` 分别取一组值里的最小与最大（`min()` 里还能直接做基础运算、不必套 `calc()`），`clamp()` 用「最小值 + 缩放值 + 最大值」三值做出既随视口缩放又不会过头的流体尺寸——响应式排版的主力。Assignment 两条：MDN 的 CSS 函数完整清单（知道可能性边界）与 web.dev 专讲 min / max / clamp 的实战文。",
      "understand": [
        "识别 CSS 函数的基本构成：属性值写成「一个词 + 一对括号、括号里放信息」时就是函数——如 `background-color: rgb(0, 0, 0)`；括号里的东西叫**参数（arguments）**，函数按各自的方式使用它们",
        "`rgb()` 接收数字参数、算出对应的 rgb 颜色；`linear-gradient(90deg, blue, red)` 按给定参数生成渐变图像——至少需要两个颜色参数（过渡的起止色），还可以设渐变线的角度、加更多颜色值",
        "**CSS 不允许你创建自己的函数**（这点与 TOP 后面要学的编程语言不同）：语言自带一批预制函数，用来解决最常见的样式问题",
        "`calc()` 最有力的两个用途：**混合不同单位**、以及**可以嵌套**（`calc( calc() - calc() )`）；官方示例用 `--main: calc(100vh - calc(var(--header) + var(--footer)))` 表达「main = 100vh − (header + footer)」，即使混用 vh / rem / px 也由 calc 替你算",
        "`min()` 接收逗号分隔的一组值、返回其中**最小**的那个（行为对应 JavaScript 的 `Math.min()`、Ruby 的 `Array#min`）；`width: min(150px, 100%)` 的意思是「若父元素宽度的 100% 比 150px 窄就占满容器，否则就是 150px」",
        "**`min()` 里可以直接做基础运算**，例如 `width: min(80ch, 100vw - 2rem);`——这种情况下甚至不需要 `calc()`",
        "`max()` 与 `min()` 同理、方向相反（对应 `Math.max()` / `Array#max`），返回括号里**最大**的那个值：`width: max(100px, 4em, 50%)` 会三个值比较后取最大",
        "`max()` 在**视口特别小**或**用户用浏览器缩放放大内容**时最有用；一开始你可能用不上它，但在重视无障碍（accessibility）的项目里它是个好工具",
        "`clamp()` 接收三个值：**最小值**、**缩放值**、**最大值**——如 `font-size: clamp(1.5rem, 5vw, 3rem)`：字号随视口宽度按 5vw 缩放，但被限制在 1.5rem 与 3rem 之间，是让元素「流体化、响应式」的好办法"
      ],
      "terms": [
        {
          "en": "CSS function",
          "zh": "CSS 函数：属性值位置上「名字 + 括号参数」的可复用计算单元；CSS 只提供内置函数，不能自定义"
        },
        {
          "en": "argument",
          "zh": "参数：写在函数括号里、由函数按各自规则使用的值"
        },
        {
          "en": "calc()",
          "zh": "计算函数：在一个表达式里做四则运算，可混用不同单位、可嵌套"
        },
        {
          "en": "min() / max()",
          "zh": "取最小 / 取最大：从逗号分隔的一组值里返回最小或最大的那个；min() 内可直接做基础运算"
        },
        {
          "en": "clamp()",
          "zh": "钳制函数：三参数（最小值、缩放值、最大值），让值随视口缩放但不越界——流体排版的主力"
        },
        {
          "en": "linear-gradient()",
          "zh": "线性渐变函数：按角度与颜色参数生成渐变图像，至少需要两个颜色"
        },
        {
          "en": "fluid / responsive sizing",
          "zh": "流体尺寸：尺寸随视口连续变化而非在断点处跳变，clamp() 是实现它的常用手段"
        }
      ],
      "tasks": [
        "读官方正文与本站讲解：能一眼认出属性值里的函数调用，并说出括号里每个参数的角色",
        "把四个函数的分工记成一句话：calc 算、min 取小、max 取大、clamp 限幅",
        "动手试官方那个 calc 例子：把 --header / --footer 改成别的值，看 --main 怎么跟着变（顺便预习下一课的自定义属性）",
        "动手试 min()：把一个固定宽度的盒子改成 width: min(150px, 100%)，然后把浏览器窗口拖窄，观察它在什么时候开始跟随容器",
        "浏览 MDN 的 CSS 函数完整清单——目的是知道「有哪些可能性」，不必逐个记住",
        "读 web.dev 关于 min、max、clamp 的实战文章，看这三个函数在真实响应式场景里怎么用"
      ],
      "quiz": [
        {
          "question": "CSS 的函数与你在 JavaScript 里写的函数有一个根本差别，是什么？",
          "answer": "**CSS 不允许你创建自己的函数。** 语言自带一批预制函数（如 rgb()、linear-gradient()、calc()、min()、max()、clamp()），你只能调用它们来解决最常见的样式问题；不能像编程语言那样定义新函数、封装自己的逻辑。"
        },
        {
          "question": "`width: min(150px, 100%)` 实际行为是什么？`width: min(80ch, 100vw - 2rem)` 里的减法为什么不需要 calc()？",
          "answer": "min() 会比较「父元素宽度的 100%」与「150px」，返回较小的那个：如果 100% 比 150px 窄，元素就占满容器宽度；否则元素就是 150px 宽——这是一种「最多 150px，但小屏时能缩」的响应式写法。而 min()（以及 max()、clamp()）**内部本来就允许直接做基础数学运算**，所以 `100vw - 2rem` 不必再套一层 calc()。"
        },
        {
          "question": "`font-size: clamp(1.5rem, 5vw, 3rem)` 三个参数各是什么角色，整体效果如何？",
          "answer": "三个参数依次是**最小值 1.5rem**、**缩放值 5vw**、**最大值 3rem**。效果：字号按视口宽度的 5% 连续缩放（流体），但被钳制在 1.5rem 与 3rem 之间——视口再窄也不会小于 1.5rem，再宽也不会大于 3rem。这正是「既响应式又不出格」的排版尺寸写法。"
        },
        {
          "question": "官方说 max() 在什么情况下最有用？为什么这与无障碍有关？",
          "answer": "在**视口异常小**、或者**用户用浏览器的缩放功能把内容放大**时最有用——它保证元素尺寸不会小于你给出的下限（例如 `width: max(100px, 4em, 50%)` 会取三者中最大的）。这与无障碍相关：放大内容是低视力用户的常见需求，如果尺寸只按比例缩小、没有下限，放大后布局可能挤到不可用；max() 给了一个可依赖的最小值。官方也说：一开始你可能用不上它，但在重视无障碍的项目里值得知道。"
        }
      ],
      "optional": [],
      "note": "",
      "why": "响应式布局里最难的不是「大屏怎么排」，而是「中间那些尺寸怎么平滑过渡」。这四个函数就是为这件事准备的：calc() 让你在一条规则里混用不同单位（例如「视口高度减去页头页脚」），min() / max() 给尺寸加上上限与下限，clamp() 一行就写完「随视口缩放但不越界」的流体字号。学完这一课，你会开始把写死的一堆媒体查询断点换成几个函数——代码更短，行为也更连续。",
      "sections": [
        {
          "h": "什么样子算「函数」",
          "p": [
            "你可能已经注意到，CSS 里有些属性值的写法有点不一样：当值是一个词、后面跟着一对括号、括号里夹着信息时——比如 `background-color: rgb(0, 0, 0)`——**你用的就是 CSS 函数**。",
            "和编程语言类似，CSS 里的函数是**可复用的代码片段，用来完成特定任务**。函数在括号里接收**参数（arguments）**，每个参数都会被函数按特定方式使用。官方给的两个例子：",
            "`color: rgb(0, 42, 255);` —— `color` 的值是函数 `rgb()`，它接收数字形式的参数，处理这些数字、算出三个值对应的 rgb 颜色。",
            "`background: linear-gradient(90deg, blue, red);` —— `linear-gradient` 用给定的参数生成一张渐变图像。它**至少需要两个颜色参数**（要过渡的两个颜色）；此外你还可以设置渐变线的方向角度（例子里就是这么做的）、加更多颜色值等等。"
          ]
        },
        {
          "h": "一个关键限制：不能自己写函数",
          "p": [
            "与你在 TOP 后面会用到的编程语言不同，**CSS 不允许我们创建自己的函数**。",
            "取而代之的是：这门语言**自带一批预制函数**，帮你解决最常见的样式问题。",
            "除了定义颜色，还有若干 CSS 函数在设计网站的**布局与尺寸**时很有用——当你开始考虑响应式设计，它们就变得重要了。本课要过的就是这几个：`calc()`、`min()`、`max()` 与 `clamp()`。"
          ]
        },
        {
          "h": "calc()：混合单位，还能嵌套",
          "p": [
            "官方说 `calc` 最有力的用例包括：**混合单位**，以及**能够嵌套**（`calc( calc () - calc () )`）。",
            "看官方给的这段（配合下一课要学的自定义属性）：`--header: 3rem;`、`--footer: 40px;`、`--main: calc(100vh - calc(var(--header) + var(--footer)));`",
            "它把 main 设成 `100vh - (3rem + 40px)` 的结果；换句话说就是 `main = 100vh - (header + footer)`。**即使我们把 vh、rem 和 px 混在一起用，`calc()` 也替我们处理了这些数学**。与 CSS 变量结合，`calc()` 能省下重复写 CSS 规则的麻烦。",
            "官方还专门放了一条提示：上面只是 `calc()` 影响布局的一个**示例**，但要记住 `calc()` 很可能**不是**实现这个布局的最佳方式——布局的事后面几课还会讲。（本站提醒：这条提示本身就是有价值的判断，别把 calc 当成布局工具。）"
          ]
        },
        {
          "h": "min()：取最小的那个",
          "p": [
            "`min()` 在帮我们做响应式网站这件事上表现出色。官方示例：`#iconHolder { width: min(150px, 100%); height: min(150px, 100%); }`。",
            "`min()` 的工作方式就像 JavaScript 的 `Math.min()` 和 Ruby 的 `Array#min`：它接收**逗号分隔的一串值，返回其中最小的一个**。",
            "上面这段的含义是：检查父元素宽度的 `100%` 是否比 `150px` 小。如果 `100%` 比 `150px` 窄，元素就占满容器的整宽（`100%`）；否则它就是 `150px` 宽。",
            "还有个实用细节：**你可以在 `min()` 内部做基础数学运算**。例如 `width: min(80ch, 100vw - 2rem);`——这种情况下**你甚至不需要 `calc()`**。"
          ]
        },
        {
          "h": "max()：取最大的那个，以及它与无障碍",
          "p": [
            "`max()` 的工作方式与 `min()` 相同、只是方向相反，类似 JavaScript 的 `Math.max()` 和 Ruby 的 `Array#max`：它会**从括号里选出尽可能大的那个值**。",
            "官方示例 `width: max(100px, 4em, 50%);` 会比较这三个值，把元素宽度设为其中最大的那个：如果父容器的 `50%` 比 `100px` 和 `4em` 都大，宽度就是 `50%`；如果 `4em` 比其他两个大，就用 `4em`。",
            "**max 函数在视口异常小、或者用户用浏览器缩放功能放大内容时最有用。** 一开始你可能发现 max 用处不大，但在无障碍（accessibility）很重要的项目里，它是一个值得知道的好工具。"
          ]
        },
        {
          "h": "clamp()：最小值、缩放值、最大值",
          "p": [
            "`clamp()` 是让元素**流体化、响应式**的好办法。它接收 3 个值，官方示例：`h1 { font-size: clamp(1.5rem, 5vw, 3rem); }`。",
            "三个值依次是：① **最小值** `1.5rem`；② **缩放值** `5vw`；③ **最大值** `3rem`。",
            "`clamp()` 用这三个值设定最小值、缩放值与最大值。在上面的例子里，这意味着可接受的最小字号是 `1.5rem`、最大是 `3rem`；中间的 `5vw` 让字号**随视口宽度缩放**，但尺寸被我们设定的最小值与最大值限制住。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "css",
          "code": ":root {\n  --header: 3rem;\n  --footer: 40px;\n  /* 官方示例：混合 vh / rem / px，并嵌套 calc */\n  --main: calc(100vh - calc(var(--header) + var(--footer)));\n}\n\n/* min()：最多 150px，容器更窄时跟随容器 */\n#iconHolder {\n  width: min(150px, 100%);\n  height: min(150px, 100%);\n}\n\n/* min() 内部可直接做运算，不需要 calc() */\n.prose { width: min(80ch, 100vw - 2rem); }\n\n/* max()：三个候选取最大，给尺寸一个下限 */\n.thumb { width: max(100px, 4em, 50%); }\n\n/* clamp()：流体字号，随视口缩放但不越界 */\nh1 { font-size: clamp(1.5rem, 5vw, 3rem); }",
          "note": "代码取自官方正文的四段示例（calc 的 :root 变量、min 的 iconHolder、min 内联运算、max 的三值比较、clamp 的字号），本站按顺序合并到一张表里便于对照。官方的提示别忘了：calc 那段只是演示函数能力，**不是**推荐的主内容区布局做法——真实布局请用 flexbox / grid。"
        }
      ],
      "pitfalls": [
        {
          "title": "以为 CSS 里能自己封装函数",
          "text": "不能。CSS 只提供内置函数，没有「定义一个自己的函数然后到处调用」这种能力。想复用一段计算，做法是配合自定义属性（下一课）：把表达式存进一个变量，在需要的地方 var() 引用——那是 CSS 里最接近「封装」的手段。"
        },
        {
          "title": "calc() 里忘写运算符两侧的空格",
          "text": "`calc(100vh-3rem)` 是无效的——加号与减号**两侧必须有空格**（乘除没有这个要求，但统一加空格最省心）。这是 calc 最常见的语法坑，报错往往表现为「整条声明被忽略」而不是明显错误。"
        },
        {
          "title": "clamp() 三个参数的顺序记反",
          "text": "顺序固定是 **最小值、缩放值、最大值**。把最大值写在第一位不会报语法错误，但结果完全不是你想要的（字号会被钉死在最小值）。写之前默念一遍「小 — 缩 — 大」。"
        },
        {
          "title": "把 calc() 当成布局方案",
          "text": "官方专门加了一条提示：那个 100vh 减页头页脚的例子只是演示函数能力，很可能不是实现该布局的最佳方式。用 calc 手工算高度做整页布局，遇到内容变长、页面内嵌套滚动、移动端地址栏伸缩时都容易崩；主结构请用 flexbox / grid，把 calc 留给局部微调。"
        },
        {
          "title": "min() 与 max() 的语义直觉搞反",
          "text": "容易记混：`min(150px, 100%)` 得到的是「不超过 150px」的**上限**效果，`max(100px, 50%)` 得到的是「不小于 100px」的**下限**效果。判断办法：min 返回较小值 → 结果被压低 → 起到封顶作用；max 返回较大值 → 结果被抬高 → 起到保底作用。"
        }
      ],
      "official": {
        "assignment": [
          "看一看 CSS 函数的完整清单（MDN）以及它们的用法，这样你对「有哪些可能性」有个概念。",
          "更深入地看一下 min、max 与 clamp 这三个 CSS 函数的实战表现（web.dev）。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/intermediate_css_concepts/css_functions.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "d1b7d5510836d2f084c055bf196ac84999a50c4f9ee7544024d8a9de29355bd1",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-custom-properties",
      "title": "Custom Properties",
      "zh": "自定义属性",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-custom-properties",
      "summary": "自定义属性（CSS 变量）让你把一个值存起来、在整份文件里引用任意多次：改一处就改到位，不必在七个选择器里逐个改同一个红色。声明用双横线开头（--name，kebab-case、区分大小写），读取用 var(--name)，var() 的第二个参数是回退值、还能嵌套回退。作用域由选择器决定（含其后代），所以把变量声明在 :root 上就能全文件通用；在不同上下文里重新定义同一批变量，就是做主题（深色/浅色）的办法——既可以靠给根元素换 class，也可以靠 prefers-color-scheme 媒体查询跟随系统设置。",
      "guide": "以下是官方原课的中文化梳理。这一课是「CSS 里最接近封装的机制」：先把一个值存成变量，再到处引用——于是「这个红色太浅了」从改七处变成改一处，项目的配色也天然保持一致。要点分四层：① 语法（双横线声明、kebab-case、区分大小写、var() 读取）；② 回退值（var() 的第二个参数，可以一路嵌套下去）；③ **作用域由选择器决定**，包含该选择器自身与它的后代——所以想让全文件都能用，就声明在 `:root` 上（`:root` 基本等同于 `html`，只是优先级更高）；④ 主题：在不同上下文里**重新定义**同一批变量，靠给根元素切 class 或者靠 `prefers-color-scheme` 媒体查询跟随系统偏好，官方同时给出后者的三条限制（只有 dark / light 两个合法值、light 也覆盖「没有设置偏好」的情况、用户无法自己切换）。Assignment 四条：一个入门视频、MDN「使用 CSS 自定义属性」页（从「自定义属性的继承」一节开始读）、Kevin Powell 的视频，以及打开官方课程页的 DevTools 看看 TOP 自己是怎么用自定义属性的。",
      "understand": [
        "自定义属性（也叫 CSS 变量）让你**在一份文件里引用某个 CSS 值任意多次**；要改的时候只改一处——自定义属性本身，而不是把某个具体值出现的每个地方都改一遍（官方例子：「这个红色太浅了，把这七个选择器里的色号都换掉」）",
        "自定义属性还能帮你在整个项目里**保持颜色一致**，项目越大这一点越有用",
        "声明语法：双横线 `--` 开头，后接一个**区分大小写、用连字符分隔**的属性名（`color-error-text` 与 `Color-Error-Text` 不是同一个）；名字随你起，但 **kebab-case（单连字符分词）很重要，因为空格是非法的**（`--color error text` 不成立）",
        "自定义属性里可以存**任何合法的 CSS 值**：颜色值、简写值，甚至更复杂的函数（如 `calc(2rem + 5vw)`）",
        "读取用 `var()` 函数：把它写在某个 CSS 属性的值的位置，括号里放自定义属性（**含开头的双横线**）",
        "`var()` 其实接收两个参数：第一个是要用的自定义属性，第二个是**可选的回退值**——当自定义属性无效或尚未声明时使用回退值；**还可以把另一个自定义属性当回退值传进去，而它自己也能有自己的回退值**（嵌套）",
        "**作用域由选择器决定**：范围包含「声明该自定义属性的那个选择器」以及**它的任何后代**；如果你熟悉 JavaScript 的作用域，这种行为会有点相似",
        "`:root` 选择器基本等同于 `html` 选择器，只是**优先级更高**；把自定义属性声明在 `:root` 上，文件里**任何**其他合法选择器都能访问它——因为其他选择器都算 `:root` 的后代",
        "做主题的办法：在 `:root` 上为不同上下文创建**两套作用域**（例如根元素带 `dark` class 时一套、带 `light` class 时一套），其他选择器只管 `var()` 引用，具体取到哪套取决于根元素当前带哪个 class",
        "另一种主题来源是**用户自己的系统或浏览器设置**：用 `prefers-color-scheme` 媒体查询，按用户设备或设置（屏幕尺寸、明暗偏好等）应用不同样式",
        "官方给 `prefers-color-scheme` 的推荐写法：先在媒体查询**外面**的 `:root` 上声明一套自定义属性作为**默认主题**（用户没设偏好、或浏览器不支持该查询时用它；官方示例用 light 配色作默认），再为「用户设了深色」加一条媒体查询",
        "使用 `prefers-color-scheme` 要注意三件事：① 只有 `dark` 与 `light` 是合法值，做不了这两种之外的主题；② `light` 这个值同时覆盖「用户指定了浅色」**和**「用户没有设置偏好」两种情况；③ 它**不允许用户自己切换主题**——而用户出于各种原因想用与系统相反的主题时，这一点仍然重要"
      ],
      "terms": [
        {
          "en": "custom property / CSS variable",
          "zh": "自定义属性（CSS 变量）：以 -- 开头声明、用 var() 读取的可复用 CSS 值；作用域随选择器，可被后代继承与在上下文中重定义"
        },
        {
          "en": "var()",
          "zh": "读取自定义属性的函数；第二个参数是可选回退值，回退值本身也可以是另一个 var()（可嵌套）"
        },
        {
          "en": "fallback value",
          "zh": "回退值：自定义属性无效或未声明时实际使用的值"
        },
        {
          "en": "kebab-case",
          "zh": "短横线命名法：单词之间用单个连字符连接（CSS 自定义属性名的通行写法，空格非法）"
        },
        {
          "en": "scope",
          "zh": "作用域：自定义属性由声明它的选择器决定可见范围，含该选择器自身与其后代"
        },
        {
          "en": ":root",
          "zh": "根选择器：基本等同 html 但优先级更高；在其上声明自定义属性可获得全文件可用的「全局」范围"
        },
        {
          "en": "prefers-color-scheme",
          "zh": "媒体查询：检测用户在操作系统或浏览器里选了深色还是浅色主题；合法值只有 dark 与 light"
        }
      ],
      "tasks": [
        "读官方正文与本站讲解：能说清声明语法、var() 的两个参数、以及作用域是怎么由选择器决定的",
        "亲手跑一遍官方的回退值例子，确认 background-color 得到 black、color 得到 white，再把 --color-text 删掉看它变成 yellow",
        "看官方那个「主题切换」演示笔（CodePen）：打开设置里的默认 class（dark / light）改一改，看两套作用域怎么切换",
        "看官方那个 prefers-color-scheme 演示笔，然后**真的去改一下你操作系统或浏览器的主题**，看页面实时更新",
        "看 Assignment 第 1 条的入门视频（CSS custom properties）",
        "读 MDN 的「使用 CSS 自定义属性」页，**从「自定义属性的继承」这一节开始读**（官方指定起点）",
        "看 Kevin Powell 的 Using CSS custom properties 视频，里面有一些自定义属性的巧妙用法",
        "打开官方课程页的 DevTools 检查样式，看看 Odin 自己用了哪些自定义属性"
      ],
      "quiz": [
        {
          "question": "`var()` 的第二个参数是什么？把另一个自定义属性当作它传进去会发生什么？",
          "answer": "第二个参数是**可选的回退值**：当第一个参数指向的自定义属性无效或还没声明时，就用这个回退值。而回退值本身**可以又是一个自定义属性（另一个 var()）**，那个 var() 还能有自己的回退值——于是形成一条回退链。官方例子里 `color: var(--undeclared-again, var(--color-text, yellow))`：--undeclared-again 未声明 → 退到 --color-text（已声明为 white）→ 最终得到 white；如果 --color-text 也无效或不存在，才退到 yellow。"
        },
        {
          "question": "自定义属性的作用域由什么决定？为什么官方推荐把「全文件都要用」的变量声明在 :root 上？",
          "answer": "作用域**由选择器决定**：范围包含声明该自定义属性的那个选择器，以及它的**任何后代**（行为与 JavaScript 的作用域有相似之处）。所以官方例子里，只有 .cool-div 内部的 .cool-paragraph 能拿到 --main-bg，而外面的 .boring-paragraph 拿不到。想让许多互不相关的选择器都能用同一批变量，一个笨办法是在一堆选择器上重复声明——但那就违背了自定义属性「一处改动、多处生效」的初衷；更好的办法是声明在 `:root` 上，因为任何其他选择器都是 `:root` 的后代，于是全文件都能访问（`:root` 基本等同 html，但优先级更高）。"
        },
        {
          "question": "用 prefers-color-scheme 跟随系统主题时，官方建议在媒体查询**外面**先声明一套自定义属性，为什么？还有哪三条限制要知道？",
          "answer": "先在媒体查询外面的 `:root` 上声明一套，是为了给「用户没有在系统或浏览器里设置偏好」以及「浏览器不支持这个媒体查询」两种情况留一个**默认主题**（官方示例用 light 配色作默认），然后再为「用户设了深色」加一条媒体查询覆盖它。三条限制：① 只有 `dark` 和 `light` 是合法值，做不了这两种之外的主题；② `light` 同时覆盖「用户明确选了浅色」和「用户没设偏好」两种情况；③ 它**不允许用户自己切换主题**——而用户可能出于各种原因想用与系统相反的主题，所以很多站点仍会另外提供手动切换（官方主题切换演示笔就是给根元素换 class 的做法）。"
        }
      ],
      "optional": [],
      "note": "",
      "why": "这一课是「站点能不能被维护」的分水岭。没有变量时，主色散落在几十条规则里，改一次配色要在文件里翻半天，深色模式更是几乎不可能干净地做出来；有了自定义属性，配色变成一个可以整体替换的表——`:root` 里一份、`[data-theme=\"dark\"]` 里一份，其余规则只写 `var(--color-…)`。你正在用的这个学习站就是这么做的：30 套主题共用同一批语义变量名，换主题只换 `:root` 的取值，不重写任何组件规则。学完这一课再去看任何一份现代 CSS，你会立刻认出它的骨架。",
      "sections": [
        {
          "h": "自定义属性解决什么问题",
          "p": [
            "自定义属性（也叫 **CSS 变量**）在写 CSS 文件时可以是一个非常有用的强大工具。简单说，它们让我们**在一份文件里想引用多少次就引用多少次某个 CSS 值**。",
            "用了自定义属性之后，就不必把某个具体值出现的每一处都更新一遍（官方举的例子是：「这个红色太浅了，把这七个选择器里的色号都换掉」）——**我们只需要更新一处：自定义属性本身**。",
            "不止如此，自定义属性还能帮我们在整个项目里**保持颜色一致**，随着项目变大，这一点会非常有用。",
            "我们甚至可以**在不同的上下文里重新定义自定义属性**，这一点对做主题极其有用——比如你在很多网站上见到的深色与浅色主题。"
          ]
        },
        {
          "h": "声明与读取",
          "p": [
            "声明和访问自定义属性的语法，与我们写普通规则声明差别不大。官方示例：`.error-modal { --color-error-text: red; --modal-border: 1px solid black; --modal-font-size: calc(2rem + 5vw); color: var(--color-error-text); border: var(--modal-border); font-size: var(--modal-font-size); }`。",
            "就这样。首先，我们用**双横线**开头声明自定义属性，后面接一个**区分大小写、用连字符分隔**的属性名（`color-error-text` 与 `Color-Error-Text` 不是同一个），名字想叫什么就叫什么。",
            "这里使用 **kebab-case（用单个连字符分隔单词）非常重要，因为空格是非法的**（`--color error text` 不行）。",
            "然后我们可以往这个新声明的自定义属性里存**任何合法的 CSS 值**：颜色值、简写值，甚至更复杂的函数——这只是几个例子。",
            "想访问自定义属性时，我们把 `var()` 函数写在某个 CSS 属性的**值**的位置，然后把自定义属性放进括号里（**包括开头的双横线**）。"
          ]
        },
        {
          "h": "回退值，以及回退值的回退值",
          "p": [
            "`var()` 函数其实接收**两个**参数。第一个我们已经讲过了，就是要赋的自定义属性；第二个是**可选的回退值（fallback value）**。",
            "当除了自定义属性之外还给了回退值时，如果那个自定义属性**无效或还没被声明**，就会使用回退值。",
            "我们甚至可以**把另一个自定义属性作为回退值传进去，而它也可以有自己的回退值**。官方示例：`.fallback { --color-text: white; background-color: var(--undeclared-property, black); color: var(--undeclared-again, var(--color-text, yellow)); }`。",
            "在上面的例子里，`background-color` 的值会是 `black`（因为 --undeclared-property 没声明，直接退到回退值），而 `color` 的值会是 `white`（--undeclared-again 没声明 → 退到 var(--color-text, yellow) → --color-text 已声明为 white）。如果 `--color-text` 无效或不存在，「回退值的回退值」就会接手，`color` 的值会是 `yellow`。"
          ]
        },
        {
          "h": "作用域：由选择器决定",
          "p": [
            "在上面第一个例子里你可能已经注意到，我们是在**同一个声明块里**声明并使用自定义属性的。这是因为**自定义属性的作用域由选择器决定**。",
            "这个作用域包含「该自定义属性是为哪个选择器声明的」，以及**那个选择器的任何后代**。如果你熟悉 JavaScript 里作用域的工作方式，这种行为会让你觉得有点相似。",
            "官方给的例子里，只有带 `cool-paragraph` class 的元素会得到红色背景，因为它是我们声明自定义属性的那个元素（`.cool-div`）的**后代**；HTML 里那个在它外面的 `boring-paragraph` 虽然也写了 `background-color: var(--main-bg)`，但**不在作用域内**，所以拿不到值。"
          ]
        },
        {
          "h": ":root —— 把作用域放到全文件",
          "p": [
            "有时你确实想限制某个自定义属性的作用域；但有时你希望在**许多互不相关的选择器**上都能用到某些自定义属性。",
            "一种绕法是把同一个自定义属性在一堆选择器上重复声明——但那就**违背了使用自定义属性的初衷之一**（一次改动多处值的便利）。",
            "更好的解法是把它们声明在 **`:root`** 选择器上。`:root` 基本上和 `html` 选择器是一回事，只是**优先级更高**。",
            "在官方例子里，把自定义属性声明在 `:root` 上之后，我们就能在 CSS 文件里**任何**其他合法选择器上访问它——因为任何其他选择器都会被视为 `:root` 的后代。"
          ]
        },
        {
          "h": "用自定义属性做主题（切 class 的做法）",
          "p": [
            "除了让我们能更全局地访问自定义属性，`:root` 选择器还给了我们**一种给页面加主题的办法**。官方用了一个「主题切换」演示笔（CodePen）。",
            "它的做法是：先给根元素一个默认的 `dark` class（因为 CodePen 的 HTML 面板里拿不到根元素，官方是在设置菜单里加的——你可以打开那个笔改设置看行为），然后在 CSS 里**为 `:root` 创建两套自定义属性的作用域**：一套是 `html`（根）元素带 `dark` class 时的，另一套是带 `light` class 时的。",
            "其余选择器只管用这些自定义属性的值——**具体取到哪一套，取决于根元素当前带的是哪个 class**。这就是主题切换的全部机制。"
          ]
        },
        {
          "h": "另一种主题来源：prefers-color-scheme",
          "p": [
            "让用户能自己切主题很好，但设置主题还有另一个选择，你可能在某些网站或应用上遇到过：**使用用户操作系统或用户代理（比如浏览器）里的主题设置**。",
            "这可以用 `prefers-color-scheme` 媒体查询做到——它让你能按用户的设备或设置（屏幕尺寸、明暗偏好等）应用不同样式。这个查询检查用户是否在其操作系统或浏览器里选了某个主题。（官方说媒体查询后面还会详细讲，现在你可以先试着改一改自己的系统或浏览器主题，看示例实时更新。）",
            "官方示例的结构值得照抄：先在**媒体查询外面**的 `:root` 上加自定义属性，这样在「用户没有在系统或用户代理里设置偏好」或「浏览器不支持这个媒体查询」时有一个**默认主题**——示例里用的是 light 配色；然后再加一条 `prefers-color-scheme` 媒体查询，处理用户设了深色的情况。",
            "用这个媒体查询对用户挺有帮助，因为不需要他们手动把主题改成自己喜欢的。但官方提醒有三件事要注意：**① 只有 `dark` 与 `light` 是合法值**，所以你没法用它实现这两种基础主题之外的任何主题；**② `light` 这个值实际上对应「用户指定了浅色主题」*或*「用户没有设置偏好」**；**③ 它不允许用户自己更改主题**——而当用户出于任何原因想用与其系统/用户代理偏好相反的主题时，这一点仍然可能很重要。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "css",
          "code": "/* 声明 + 读取：双横线声明，var() 读取（含双横线） */\n.error-modal {\n  --color-error-text: red;\n  --modal-border: 1px solid black;\n  --modal-font-size: calc(2rem + 5vw);   /* 存的可以是复杂函数 */\n\n  color: var(--color-error-text);\n  border: var(--modal-border);\n  font-size: var(--modal-font-size);\n}\n\n/* 回退值，以及回退值的回退值 */\n.fallback {\n  --color-text: white;\n  background-color: var(--undeclared-property, black);          /* → black */\n  color: var(--undeclared-again, var(--color-text, yellow));    /* → white */\n}\n\n/* 作用域：只有 .cool-div 的后代拿得到 */\n.cool-div { --main-bg: red; }\n.cool-paragraph   { background-color: var(--main-bg); }   /* 生效（后代） */\n.boring-paragraph { background-color: var(--main-bg); }   /* 不生效（不在作用域内） */\n\n/* 全局：声明在 :root，全文件任何选择器都能用 */\n:root { --main-color: red; }\n\n/* 主题（切 class 的做法）：同一批变量名，两套取值 */\n:root.dark  { --bg: #16161d; --fg: #e8e6f0; }\n:root.light { --bg: #fbf7f8; --fg: #3d2a32; }\n\n/* 主题（跟随系统）：查询外先给默认，再用媒体查询覆盖 */\n:root { --bg: #fbf7f8; --fg: #3d2a32; }              /* 默认 = light */\n@media (prefers-color-scheme: dark) {\n  :root { --bg: #16161d; --fg: #e8e6f0; }\n}",
          "note": "前四段取自官方正文的原示例（声明与读取、回退值、作用域、:root），后两段是本站按官方「主题切换演示笔」与「prefers-color-scheme 演示笔」两套做法写的最小等价代码（官方用的是 CodePen 嵌入，没有列出源码）。注意最后一段的顺序：**默认主题写在媒体查询外面**，这样没设偏好或浏览器不支持时仍有可用配色。"
        }
      ],
      "pitfalls": [
        {
          "title": "变量名里写了空格或用了驼峰",
          "text": "自定义属性名**空格非法**（`--color error text` 直接不成立），必须用 kebab-case 连字符分词；而且名字**区分大小写**——`--color-error-text` 与 `--Color-Error-Text` 是两个不同的属性。写错时不会报错，只会静默地取不到值、然后落到回退值（或让整条声明失效），很难查。"
        },
        {
          "title": "在 :root 之外的选择器上声明，然后期望全局可用",
          "text": "作用域由选择器决定，且只向下覆盖后代。在 `.card` 上声明的变量，`.card` 外面和它的兄弟元素都拿不到。需要全文件可用的变量就声明在 `:root` 上；只在某个组件内部用的才放组件选择器里（这其实是特性：可以做组件级主题）。"
        },
        {
          "title": "以为 prefers-color-scheme 能做「第三套主题」",
          "text": "这个媒体查询**只有 dark 与 light 两个合法值**，做不了品牌主题、护眼主题之类。需要多套主题就走「给根元素切 class / data-theme」的做法（官方主题切换演示笔），或者两者结合：用媒体查询定默认、用 class 让用户手动覆盖。"
        },
        {
          "title": "只写媒体查询、不留默认值",
          "text": "如果所有配色都写在 `@media (prefers-color-scheme: dark)` 与 `... light` 里，那么「用户没设偏好」或「浏览器不支持该查询」时就可能完全没有值。官方示例的做法是：默认主题写在**查询外面**的 `:root`，查询里只做覆盖。"
        },
        {
          "title": "用 var() 引用了未声明的变量，又没给回退值",
          "text": "`color: var(--not-defined)` 不会报错，但该属性会变成「无效值」，最终继承或用初始值——表现常常是「颜色莫名不对」。在可能缺失的场景（组件库、跨文件引用）里养成给回退值的习惯：`var(--x, #333)`。"
        }
      ],
      "official": {
        "assignment": [
          "这个关于 CSS 自定义属性的视频是很好的入门。去看一遍。",
          "通读 MDN 的「使用 CSS 自定义属性」页面，**从「自定义属性的继承」这一节开始读**。",
          "看 Kevin Powell 的 Using CSS custom properties 视频，它展示了自定义属性的一些巧妙用法。",
          "打开本页的检查器（inspector）检查样式，看看 Odin 是怎么使用一些自定义属性的。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/intermediate_css_concepts/custom_properties.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "9d6b60f83f8e209ef7c7bbbe5ac9e9b03be948e7187aa390574e41771e6baef3",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-browser-compatibility",
      "title": "Browser Compatibility",
      "zh": "浏览器兼容性",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-browser-compatibility",
      "summary": "你的用户可能用 Chrome、Edge、Firefox、Safari 中任何一个，而且移动端占比还在快速增长。不同浏览器用不同引擎（Chrome / Chromium 用 Blink，Safari 用 WebKit），所以同一份代码的表现可能不一样；W3C 负责制定标准与新 CSS 特性，浏览器再逐步实现——用新特性前先用 Can I Use 查支持情况，等主流浏览器都支持了再用。移动端有两条特别要记住：iOS / iPadOS 上无论装什么浏览器都跑 WebKit；浏览器里的设备模拟只模拟屏幕尺寸，模拟不出来操作系统本身的差异。",
      "guide": "以下是官方原课的中文化梳理。这一课不讲某个具体属性，讲的是**判断「这个特性能不能用、要在哪些浏览器上测」的方法**，分三段：① 历史——从 1990 年 Tim Berners-Lee 在 CERN 写的 WorldWideWeb（后改名 Nexus）到 Mosaic、Opera、Netscape、IE（一度超过 90% 用户）、Mozilla/Firefox、Safari（2003）、Chrome（2008），理解「为什么曾经每个浏览器都要单独适配」；② 机制——不同浏览器用不同引擎（Blink / WebKit），W3C 是制定 Web 标准与新 CSS 特性的权威、与社区和浏览器厂商协作，浏览器再实现；因为 Chrome 主导，绝大多数应用是照 Chromium 顺跑来设计的，其他浏览器成了次要目标；③ 实操——用 **Can I Use** 查特性支持情况（哪些浏览器、哪些平台、甚至哪些版本支持），一般建议等大多数常见浏览器都支持了再上；以及移动端两条硬事实：iOS / iPadOS 上你装的 Chrome / Firefox 并不是完整浏览器、仍在用 Safari 的 WebKit 引擎，所以面向 Apple 用户就必须保证 WebKit 可用；浏览器里的设备模拟**只模拟屏幕尺寸**，操作系统层面的特性模拟不出来。Assignment 两条：去 Can I Use 上查一遍你到目前为止遇到的技术是否都被主流浏览器支持，以及读一篇关于 iOS 上浏览器的文章。",
      "understand": [
        "随着你继续 Web 开发，要记住你作品的最终用户可能在用各种浏览器：Chrome、Microsoft Edge、Firefox、Safari 等等；同时使用移动操作系统的用户数量正在快速增长，因此你还应该考虑不同浏览器的**移动版本**",
        "现代浏览的历史始于 **1990 年 12 月**发布的 WorldWideWeb 浏览器，由 **Tim Berners-Lee** 在为欧洲核研究组织 **CERN** 工作时编写；后来为避免与 World Wide Web 混淆而改名为 **Nexus**",
        "Nexus 是同类中的第一个：能查看基本样式表、阅读新闻组，甚至还有拼写检查——今天看不算什么，但在当时是真正开创性的",
        "此后十年出现 Mosaic Browser（迅速流行、成为全球最受欢迎的浏览器），接着 Opera 与 Netscape Navigator 发布、万维网爆发式增长；**1995 年**第一版 Internet Explorer 问世并成为市场主导者，一度有超过 **90%** 的用户在用它",
        "为对抗这种主导，Netscape 发起了后来的 **Mozilla 基金会**（开发并维护 Firefox）；**2003 年** Apple 发布 Safari，**2008 年** Google 发布 Chrome。直到今天浏览器之间仍有大量竞争，尽管 **Chrome（以及 Chromium）是市场主导者**",
        "我们已经见证从独立应用程序向 **HTML5 与渐进式 Web 应用（PWA）**的转变——应用可以完全在浏览器内运行（例如 Word 与 Excel 曾经只能作为独立应用运行，现在通过任何浏览器就能用、无需安装任何文件）",
        "随着公司争夺市场份额，不同浏览器使用**不同引擎**来显示网页信息：**Chrome 与 Chromium 用 Blink，Safari 用 WebKit**。因为这些差异，你的应用在不同浏览器里**可能表现不同**",
        "由于 Chrome 的主导地位，**绝大多数应用是被设计成在 Chromium 上顺畅工作的**，在其他浏览器里提供同样好的性能退居次要位置",
        "想让项目触达更广，就必须针对**用户最可能使用的浏览器**测试：Chrome、Safari、Firefox 以及其他基于 Chromium 的浏览器（Microsoft Edge、Brave 等）在普通用户中更常见；也可能因为用户群或公司要求而需要支持不那么常见的浏览器。**对 Chromium 系浏览器：如果在 Chrome 里能跑，在其他相关浏览器里应该也能跑**",
        "**W3C（World Wide Web Consortium，万维网联盟）**是制定 Web 标准的权威，目标是最大化 Web 体验的无障碍性与一致性；W3C 也是**开发 CSS 新特性**的权威，这是与 Web 社区及浏览器厂商紧密协作的过程",
        "在 Nexus、Netscape 那个年代还没有 W3C 这样的组织来提升兼容性：你的应用在每个浏览器里可能看起来和功能都不一样，甚至可能完全不可用；开发者不得不为每个浏览器做特定调整，而并非每个开发者都有足够资源做到人人可用",
        "今天标准在演进、开发者开始在代码库里实现新特性，浏览器就必须为这些新特性提供支持；**如果因为浏览器缺乏支持而影响了用户体验，用户可能会转投竞争对手**",
        "实现新特性虽然令人兴奋，但**有仓促的风险**——典型事故是「原本在 Firefox 里好好的，改了代码库之后在 Firefox 里不可用了，却在 Safari 里好好的」",
        "**「Can I Use」是验证新特性是否被浏览器支持的好资源**：它提供哪些浏览器与平台支持新技术的统计数据，甚至能查到这些浏览器的**哪些版本**支持特定特性",
        "一般的好建议是：**当新特性被大多数常见浏览器支持时再去实现它**，这样你更不容易遇到大量用户都会碰到的问题",
        "传统上 Web 是桌面电脑优先的，但随着智能手机普及，每年都有越来越多用户把移动设备当作主要的上网设备；**在世界上某些地区，移动用户占绝大多数**",
        "移动设备主要是智能手机与平板；最流行的移动操作系统是 **Android** 与 Apple 的 **iOS**",
        "**在 iOS 与 iPadOS 上，大多数地区唯一受支持的浏览器是 Safari**：你确实可以安装 Chrome 或 Firefox、甚至把它们设为默认，但它们**不是完整的浏览器**——它们仍在使用 Safari 的渲染引擎（**WebKit**）。因此要让 Web 应用对 Apple 用户可用，你必须确保对 WebKit 及 Safari 所用其他技术的支持",
        "**移动浏览器与它们的桌面版并不是一一对应的**：在桌面版 Safari 里能跑的项目，在同名浏览器的移动版上可能仍需要调整",
        "另一件要考虑的事是**屏幕尺寸差异的量级**：几乎不可能拥有每一台实体设备来测试，好在浏览器提供了模拟其他设备的方式。但**重要的一点是：当你在 Chrome 里模拟一台 iPhone 时，你模拟的只是屏幕尺寸**——操作系统层面的任何特定考量都不可复现，所以即使模拟时一切正常，在真机上仍可能表现不同"
      ],
      "terms": [
        {
          "en": "browser compatibility",
          "zh": "浏览器兼容性：同一份代码在不同浏览器（及其移动版）里能否一致地正常工作"
        },
        {
          "en": "rendering engine",
          "zh": "渲染引擎：浏览器用来解析并显示网页的组件——Chrome / Chromium 用 Blink，Safari 用 WebKit"
        },
        {
          "en": "Blink / WebKit",
          "zh": "两大主流渲染引擎：Blink 支撑 Chrome、Chromium 及基于它们的 Edge、Brave 等；WebKit 支撑 Safari，也是 iOS 上所有浏览器的实际引擎"
        },
        {
          "en": "W3C（World Wide Web Consortium）",
          "zh": "万维网联盟：制定 Web 标准（含 CSS 新特性）的权威组织，与社区和浏览器厂商协作"
        },
        {
          "en": "Can I Use",
          "zh": "caniuse.com：查特性支持情况的工具站，给出哪些浏览器、哪些平台、哪些版本支持某项技术"
        },
        {
          "en": "Progressive Web App（PWA）",
          "zh": "渐进式 Web 应用：能完全在浏览器内运行的应用形态，取代一部分独立桌面应用"
        },
        {
          "en": "device emulation",
          "zh": "设备模拟：浏览器开发者工具里模拟其他设备——但只模拟屏幕尺寸，不复现操作系统层面的差异"
        }
      ],
      "tasks": [
        "读官方正文与本站讲解：能说清「引擎差异 → 表现差异」这条因果，以及 Chrome 主导带来的实际后果",
        "打开 Can I Use，把你到目前为止学过的技术逐个查一遍（flexbox、grid、position: sticky、clamp()、CSS 嵌套、:has() 等）——官方的问题就是「你到目前为止遇到的技术是否都被主流浏览器支持？」",
        "挑一个你打算在下一个项目里用的新特性，在 Can I Use 上看清「哪些浏览器的哪些版本支持」，再决定现在用还是等一等",
        "读 Assignment 第 2 条那篇关于 iOS 上浏览器的文章（adactio）——理解「装了 Chrome 也还是 WebKit」这件事的来龙去脉",
        "看正文里那个「浏览器竞争」的视频，把浏览器简史串成时间线",
        "动手测：在 Chrome 的设备模拟里选一台 iPhone 看你的页面，然后**记住这只是屏幕尺寸**——如果条件允许，用真机或身边人的手机再看一次，把差异记下来"
      ],
      "quiz": [
        {
          "question": "为什么「同一份 CSS 在不同浏览器里表现不同」是结构性的问题，而不是某个浏览器的 bug？",
          "answer": "因为不同浏览器用**不同的渲染引擎**来显示网页：Chrome 与 Chromium 用 Blink，Safari 用 WebKit。引擎不同，对新特性的实现进度、对边界的处理都可能不同。再加上 Chrome 的主导地位，绝大多数应用是被设计成「在 Chromium 上顺畅工作」的，其他浏览器的表现退居次要——所以差异是这套生态结构的必然产物。实际的推论是：面向普通用户至少要测 Chrome、Safari、Firefox 以及其他 Chromium 系（Edge、Brave）；而对 Chromium 系来说，**在 Chrome 里能跑，在其他相关浏览器里应该也能跑**。"
        },
        {
          "question": "新 CSS 特性是怎么走到「你可以在项目里用」这一步的？判断「现在能不能用」的官方推荐做法是什么？",
          "answer": "**W3C 是制定 Web 标准与开发 CSS 新特性的权威**，这个过程与 Web 社区以及开发浏览器的公司紧密协作；标准演进后，开发者开始在代码里实现新特性，浏览器就必须提供支持——如果因为浏览器缺乏支持而影响了用户体验，用户可能转投竞争对手。判断能不能用的推荐做法是查 **Can I Use**：它给出哪些浏览器与平台支持某项技术，甚至能查到这些浏览器的哪些版本支持。一般建议是**等大多数常见浏览器都支持了再实现**，这样更不容易遇到大量用户都会碰到的问题（反面教材就是「原本 Firefox 好好的，改完代码只在 Safari 里能用」）。"
        },
        {
          "question": "关于移动端浏览器，官方点名要记住的两件事是什么？",
          "answer": "① **在 iOS 与 iPadOS 上，大多数地区唯一受支持的浏览器是 Safari**：你可以安装 Chrome 或 Firefox 并设为默认，但它们不是完整的浏览器，仍在使用 Safari 的渲染引擎 WebKit——所以要支持 Apple 用户，你必须确保 WebKit（及 Safari 用的其他技术）可用。并且移动浏览器与桌面版不是一一对应的，桌面 Safari 能跑的项目在移动 Safari 上可能仍要调整。② **设备模拟只模拟屏幕尺寸**：在 Chrome 里模拟 iPhone 时，操作系统层面的特定考量都不可复现，所以模拟时一切正常，真机上仍可能表现不同；再加上屏幕尺寸差异的量级很大，几乎不可能拥有每台实体设备来测。"
        }
      ],
      "optional": [],
      "note": "",
      "why": "这一课教的是一种判断力，而不是一条属性：什么时候可以放心用一个新特性、要在哪些浏览器上测、为什么「在我机器上是好的」不构成结论。你之后写每一个稍微新一点的 CSS（sticky、clamp()、嵌套、:has()）都会遇到同一个问题，答案都是先查 Can I Use 再决定。移动端那两条更是省事的关键——知道 iOS 上装什么都跑 WebKit，你就不会浪费时间给 iOS 上的「Chrome」单独做适配；知道模拟器只模拟尺寸，你就不会把「Chrome 里模拟 iPhone 看着没问题」当成真机结论。",
      "sections": [
        {
          "h": "你的用户不一定在用你这个浏览器",
          "p": [
            "随着你继续 Web 开发之旅，重要的是记住：**你作品的最终用户可能在用各种各样的浏览器**——Chrome、Microsoft Edge、Firefox、Safari，只举几个例子。",
            "与此同时，使用移动操作系统的用户数量正在快速增长，因此你还应该考虑**不同浏览器的移动版本**。",
            "这一课要回答三件事：浏览器兼容性是什么、它的历史；新的 CSS 特性是怎么进入浏览器的；以及怎么去查兼容性。"
          ]
        },
        {
          "h": "浏览器简史",
          "p": [
            "现代浏览的历史要回到 **1990 年 12 月**，WorldWideWeb 浏览器发布。它由 **Tim Berners-Lee** 编写，当时他正为欧洲核研究组织（**CERN**）工作。后来它被改名为 **Nexus**，以避免与 World Wide Web 混淆。",
            "Nexus 是同类中的第一个，它允许用户查看基本样式表、阅读新闻组，甚至还有拼写检查！今天看来这算不上什么，但在当时确实是开创性的。",
            "不过 Nexus 的发布只是个开始：接下来十年里，人们见证了 **Mosaic Browser** 等浏览器的首次发布——它迅速走红，成为全球最受欢迎的浏览器。从那以后，随着 **Opera** 与 **Netscape Navigator** 的发布，万维网的增长爆发了。",
            "**1995 年**，世界迎来了第一版 **Internet Explorer**，它成为市场的主导者。在某个时期，超过 **90%** 的用户都在用 Internet Explorer。为了对抗这种主导地位，Netscape 发起了后来成为 **Mozilla 基金会**的组织——它开发并维护 Firefox。",
            "紧接着，**2003 年** Apple 发布了 Safari，**2008 年** Google 发布了 Chrome。这些名字你多半都熟悉。直到今天，浏览器之间仍有大量竞争（官方正文在这里放了一个视频），尽管 **Chrome（以及 Chromium）是市场的主导者**。"
          ]
        },
        {
          "h": "什么是浏览器兼容性",
          "p": [
            "今天已经无法想象没有浏览器的 Web。我们见证了一场转变：从独立应用程序转向 **HTML5 与渐进式 Web 应用**——应用可以完全在浏览器内运行。举例来说，Microsoft Word 与 Excel 在很长一段时间里只能通过独立应用运行；现在你可以在任何浏览器里使用它们，无需安装任何文件。",
            "随着公司争夺市场份额，**不同浏览器使用不同的引擎来显示网页上的信息**。例如 Chrome 与 Chromium 使用 **Blink**，而 Safari 使用 **WebKit**。",
            "由于这些差异，**你的应用在不同浏览器里可能表现不同**。而由于 Chrome 的主导地位，**绝大多数应用是被设计成在 Chromium 上顺畅工作的**，在其他浏览器里提供同样好的性能则退居次要。",
            "为了让你的 Web 开发项目触达更广，你必须确保**针对用户最可能使用的浏览器测试你的应用**。Chrome、Safari、Firefox 以及其他基于 Chromium 的浏览器（Microsoft Edge、Brave 等）在普通用户中更常见；但你也可能发现，取决于用户群或你所在的公司，你需要支持一些不那么常见的浏览器。**对 Chromium 系浏览器而言：如果它在 Chrome 里能跑，在其他相关浏览器里应该也能跑。**"
          ]
        },
        {
          "h": "浏览器发布与新 CSS 特性",
          "p": [
            "**W3C（World Wide Web Consortium，万维网联盟）是制定 Web 标准背后的权威**，目标是最大化 Web 体验的无障碍性（accessibility）与一致性。W3C 也是**开发 CSS 新特性**的权威。这是一个与 Web 社区以及开发浏览器的公司紧密协作的过程。",
            "当 Nexus 与 Netscape 这些浏览器发布时，还没有 W3C 这样的组织来帮助提升兼容性。你的应用在每个浏览器里可能看起来和功能都不同；更糟的是，你的应用可能**完全不可用**。Web 开发者不得不为每个浏览器做特定调整，而并不是每个开发者都有足够的资源让它在所有浏览器上都能用。",
            "今天，随着 Web 标准演进变化、Web 开发者开始在代码库里实现新特性，**浏览器必须为这些新特性提供支持**。如果用户体验因为浏览器缺乏支持而受到影响，用户可能会找到通往竞争对手的路。"
          ]
        },
        {
          "h": "什么时候用新特性才安全",
          "p": [
            "实现新特性虽然令人兴奋，但**存在仓促的风险**。对你的用户来说，发现「你的应用原本在 Firefox 里工作良好，但由于代码库的改动，现在它在 Firefox 里不可用了、却在 Safari 里工作良好」绝不是什么好体验。",
            "好在有一个工具能帮你避免这种情况：**「Can I Use」（caniuse.com）是验证新特性是否被浏览器支持的极好资源**。它提供统计数据，说明哪些浏览器与平台支持新技术，甚至能告诉你这些浏览器的**哪些版本**支持特定特性。",
            "一般的好建议是：**当新特性被大多数常见浏览器支持时再去实现它**。这样你更不容易遇到那种大量用户都会碰到的问题。"
          ]
        },
        {
          "h": "移动浏览器：两件事必须记住",
          "p": [
            "传统上，Web 是桌面电脑优先的：应用在桌面浏览器上跑得好就算成功。但随着智能手机越来越普及，每年都有更多用户把移动设备当作他们主要的上网设备。**在世界上某些地区，移动用户占绝大多数。**",
            "移动设备主要由智能手机与平板组成，最流行的移动操作系统是 **Android** 与 Apple 的 **iOS**。开发应用时，你还必须考虑你的应用是否应该完全兼容移动端——关于移动浏览器，有几件特别的事要记住。",
            "**第一件：在 iOS 与 iPadOS 上，大多数地区唯一受支持的浏览器是 Safari。** 是的，你可以安装 Chrome 或 Firefox，你甚至可以把它们设为默认，但**它们不是完整的浏览器**——它们仍在使用 Safari 的渲染引擎（**WebKit**）。因此，为了让你的 Web 应用对 Apple 用户可用，你必须确保支持 WebKit 以及 Safari 使用的其他技术。还要记住：**移动浏览器与它们的桌面对应物并不是一一对应的**——在桌面版 Safari 里能跑的项目，在同名浏览器的移动版上可能仍需要调整。",
            "**第二件：屏幕尺寸差异的量级。** 几乎不可能拥有每一台实体设备来做测试，好在浏览器提供了模拟其他设备的方式。要记住的关键一点是：**当你在 Chrome 里模拟一台 iPhone 时，你所模拟的只是屏幕尺寸**。请记住，操作系统的任何特定考量都是不可复现的。这意味着，即使模拟某台设备时在 Chrome 里一切功能正常，它在真实的手机或平板设备上仍可能表现不同。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "text",
          "code": "查一个新特性该不该现在用（Can I Use 的读法）：\n\n特性：position: sticky\n  Chrome / Edge（Blink）    支持（注意版本起点）\n  Firefox（Gecko）          支持\n  Safari（WebKit）          支持，但历史上曾有前缀与祖先 overflow 的差异\n  → 结论：主流都支持，可以用；但仍要注意「祖先设了 overflow 会让 sticky 失效」\n    这类实现差异，以及移动 Safari 与桌面 Safari 不是一一对应。\n\n上线前的最小测试矩阵（官方点名的常见组合）：\n  1. Chrome（Chromium 系代表——在 Chrome 里能跑，Edge / Brave 等相关浏览器通常也能跑）\n  2. Safari（WebKit 代表，且是 iOS / iPadOS 上所有浏览器的实际引擎）\n  3. Firefox（独立引擎，最容易暴露「只在 Chromium 上验证过」的问题）\n  4. 移动端：真机优先；只有真机不可得时才用设备模拟，\n     并记住模拟只覆盖屏幕尺寸，不复现操作系统差异。",
          "note": "本站示意（官方正文没有代码块，讲的是方法与工具）。要点是把「查支持情况」和「定测试矩阵」变成固定动作：先用 Can I Use 看清哪些浏览器的哪些版本支持，再按 Blink / WebKit / Gecko 三个引擎各挑一个代表来测，而不是只在自己日常用的那个浏览器里看一眼。"
        }
      ],
      "pitfalls": [
        {
          "title": "只在自己日常用的浏览器里验证",
          "text": "这是「在我机器上是好的」的根源。由于 Chrome 主导，绝大多数代码是照 Chromium 顺跑写的，问题往往在 Safari（WebKit）或 Firefox 上才暴露。最小做法：Blink / WebKit / Gecko 各测一个代表（Chrome / Safari / Firefox）。"
        },
        {
          "title": "给 iOS 上的「Chrome」单独做适配",
          "text": "白费力气。iOS 与 iPadOS 上安装的 Chrome、Firefox 都不是完整浏览器，实际用的仍是 Safari 的 WebKit 引擎。要支持 Apple 移动用户，你要保证的是 **WebKit 可用**，而不是逐个适配那些壳。"
        },
        {
          "title": "把设备模拟当成真机结论",
          "text": "在 Chrome 里模拟 iPhone 只模拟**屏幕尺寸**：操作系统的特定考量（键盘行为、滚动惯性、地址栏伸缩、字体渲染、触摸手势细节）都不可复现。模拟通过只能说「布局在这个尺寸下没崩」，不能说「真机没问题」。"
        },
        {
          "title": "新特性一发布就上生产",
          "text": "官方明确提醒仓促的风险：典型事故是改完代码后应用只在某一个浏览器里能用。先查 Can I Use 看「哪些浏览器的哪些版本支持」，等大多数常见浏览器支持了再用；确实要提前用，就配回退方案（例如 @supports 检测 + 退化样式）。"
        },
        {
          "title": "以为桌面版正常就等于移动版正常",
          "text": "同一个浏览器的移动版与桌面版并不是一一对应的：桌面 Safari 能跑的项目，移动 Safari 上可能仍要调整（视口、触摸目标尺寸、100vh 的含义、滚动容器行为都可能不同）。移动端要单独过一遍。"
        }
      ],
      "official": {
        "assignment": [
          "复习 Can I Use。你到目前为止遇到的所有技术都被流行浏览器支持吗？",
          "读这篇关于 iOS 上浏览器的文章（adactio）。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/intermediate_css_concepts/browser_compatibility.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "88665898691a54ea6462db405324f67738cb1929802e639f1fdfa981e61f484d",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-frameworks-and-preprocessors",
      "title": "Frameworks and Preprocessors",
      "zh": "框架与预处理器",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-frameworks-and-preprocessors",
      "summary": "CSS 框架（Bootstrap / Tailwind / Bulma / Foundation）是一捆别人写好的 CSS，你按它规定的结构与 class 名来用；预处理器（SASS / LESS / Stylus）是写起来更方便的扩展语言，编译后产出原生 CSS。两者在职场很常见，值得知道是什么、需要时去哪儿学。但官方明确建议：**在你学习的这个阶段，继续在项目里用原生 CSS**——所有框架与预处理器都是围绕 CSS 建的，基本功扎实之后学与切换都容易得多；而且预处理器最吸引人的那些能力（变量、嵌套）已经进入原生 CSS。框架也有代价：网站同质化、太早学会让基本功练不够、覆盖样式与调试变难、一旦用上很难移除。",
      "guide": "以下是官方原课的中文化梳理。这一课与前面几课不同：它不教你写某个新语法，而是**教你怎么看待两类工具，以及为什么现在不该用它们**。两类工具是：CSS **框架**（别人打包好的一捆 CSS，你按它期望的网站结构和 class 名来用——Bootstrap 那种「把常用 CSS、图标、交互都替你打包好」的路线，和 Tailwind 那种「用预命名 class 改变你写 CSS 的语法、每个 class 通常只对应一行 CSS」的路线，目标并不相同）与 CSS **预处理器**（写起来更省事的扩展语言，能写循环、条件、合并多个样式表，运行后产出可导入项目的原生 CSS）。官方在这一课里给了一个**明确的阶段建议**：在你学习的这个时点，**建议继续在项目里使用原生 CSS**——因为所有框架与预处理器都是围绕 CSS 建立的，基本功扎实会让你日后学习和在任意框架/预处理器之间切换**显著更容易**；在课程期间去学一个，长期看不如把原生 CSS 基本功练好划算。它还点出预处理器**最有用的那些能力已经进了原生 CSS**：自定义属性（上一课）过去只有预处理器能做，CSS 嵌套也曾是某些预处理器的常见优势、现在已进入原生 CSS 并开始获得更多浏览器支持。框架的代价也讲得很直白：网站之间高度相似、太多新人在教育早期就跳去学框架（「不用练原生 CSS」的诱惑很大）导致基本功不扎实、覆盖框架样式与调试样式问题会变难（**必须理解框架在「引擎盖下」做了什么**）、上手快但长期可能形成约束、项目一旦用上框架就很难移除。Assignment 三条：一篇 CSS 框架简介（Medium）、一篇 SASS / LESS / Stylus 概览（可略读，LambdaTest）、一篇讲预处理器缺点的文章（Adam Silver）——官方特别提示：那篇文章写成之后，CSS 已经有了嵌套与通过自定义属性实现的变量。",
      "understand": [
        "到现在你已经写了相当多的原生（vanilla）HTML 与 CSS，也学了不少设计技巧；在这个过程中你可能见过关于 **CSS 框架**与**预处理器**（preprocessors，也叫 precompilers 预编译器）的信息——这两类工具都能让写 CSS 更顺畅、更少枯燥",
        "值得了解它们的一个现实理由：**它们在工作场所很常见**。虽然入门级岗位的面试官更可能考察 CSS 基本功（即使那份工作用了某个框架或预处理器），但知道这些工具是什么、以及一旦你确定需要学它们时该去哪儿找，仍然有用",
        "**官方明确的阶段建议：在你学习的这个时点，建议继续在项目里使用原生 CSS。** 所有这些框架与预处理器都是**围绕 CSS 建立**的，因此打下扎实的基本功会让你日后**显著更容易**地学习并在任意框架或预处理器之间切换；在课程期间去学一个，从长期看不会比提升原生 CSS 基本功更有产出、更有价值",
        "框架各有不同目标：**Bootstrap 这类**替你做了大量重活——把常用 CSS 代码打包好，甚至包括图标与交互（如菜单下拉）；它们的设计意图是**把「编写直观、可复用、响应式元素」这个过程抽象掉**。**Tailwind 这类**则旨在**通过一种不同的语法改变我们应用 CSS 的方式**——提供预命名的 class，每个通常只应用一行 CSS",
        "**CSS 框架归根结底就是一捆你可以使用和访问的 CSS**，通过框架定义的 class 来用。例如许多框架提供一个叫 `.btn` 的 class，它会给你的按钮加上全部所需样式，而你一行 CSS 都不用写",
        "一般来说，要使用一个框架，你需要理解**它期望你怎样组织网站结构**，以及**它用哪些 class 来应用它那套特定样式**",
        "除 Bootstrap 与 Tailwind，你可能还会遇到 **Bulma** 与 **Foundation**，但市面上的框架远不止这些",
        "框架的长处：**很适合快速产出界面、让最终用户能轻松交互**。但你逛完几个流行框架之后会开始注意到，由于框架的相似用法，**你遇到的很多网站之间有非常多的相似之处**",
        "**太多新开发者也在他们学习过程的太早阶段就跳去学框架**——「不必练习写原生 CSS」这个前景非常诱人。结果是许多开发者的 CSS 练习量不足以把这门重要语言的基本功巩固下来",
        "此外，**如果你的 CSS 基本功较弱，覆盖框架的样式、或调试页面上的样式问题会变得非常困难**。**理解一个框架在「引擎盖下」做了什么**是必须的，这样你之后才有能力处理这些问题（官方原话：相信我们，你一定会遇到）",
        "归根结底：框架能帮你快速起步，**但长期来看可能约束你**。一个项目一旦用框架开始，**要把它移除可能很困难**。将来你（或你的雇主！）可能必须决定一个项目要不要用框架，以及用哪一个",
        "**预处理器是帮你更轻松地写 CSS 的语言**：它们能减少代码重复，提供各种省时省码的特性，例如允许你写**循环与条件**、以及**合并多个样式表**",
        "CSS 预处理器本质上是**对原生 CSS 的扩展**，提供一些额外功能。**当你运行预处理器时，它接收你的代码、把它变成原生 CSS**，然后你可以把这些原生 CSS 导入项目",
        "预处理器确实有一些独特而有用的工具，但**它们最有用的许多特性已经在原生 CSS 中实现**了，因此除非你认为自己真的需要这些特性，学习一个预处理器可能不值得那份额外成本。官方给的两个例子：你已经学过的**自定义属性**过去是只有预处理器才能做到的事；**CSS 嵌套**也曾是某些预处理器的常见优势，但现在已经进入原生 CSS，并且最近开始获得更多浏览器支持",
        "使用中的标准预处理器有 **SASS**、**LESS** 与 **Stylus**"
      ],
      "terms": [
        {
          "en": "CSS framework",
          "zh": "CSS 框架：一捆可直接使用与访问的现成 CSS，通过框架定义的 class 名来用；使用前需要理解它期望的网站结构与 class 约定"
        },
        {
          "en": "vanilla CSS",
          "zh": "原生 CSS：不经框架或预处理器、直接写标准 CSS；官方在本阶段明确建议继续用它"
        },
        {
          "en": "preprocessor / precompiler",
          "zh": "预处理器（预编译器）：写 CSS 更省事的扩展语言（可写循环、条件、合并样式表），运行后产出原生 CSS"
        },
        {
          "en": "Bootstrap / Tailwind / Bulma / Foundation",
          "zh": "常见 CSS 框架：Bootstrap 打包常用样式与交互；Tailwind 用预命名的原子 class 改变写法；Bulma 与 Foundation 是另外两个常见选择"
        },
        {
          "en": "SASS / LESS / Stylus",
          "zh": "使用中的标准 CSS 预处理器三种"
        },
        {
          "en": "utility class",
          "zh": "工具类：Tailwind 路线的核心——预命名的 class，每个通常只应用一行 CSS，靠组合它们来表达样式"
        },
        {
          "en": "under the hood",
          "zh": "「引擎盖下」：框架内部实际做了什么。官方强调必须理解这一层，否则覆盖样式与调试会非常困难"
        }
      ],
      "tasks": [
        "读官方正文与本站讲解：能分别用一句话说清「框架是什么」和「预处理器是什么」，以及两者的根本差别（一个是现成 CSS，一个是要编译的语言）",
        "记住官方的阶段建议，并把它变成行动：**本项目阶段继续写原生 CSS**，不要在课程期间去学一个框架或预处理器",
        "去认一眼几个名字（不必学）：Bootstrap、Tailwind、Bulma、Foundation；SASS、LESS、Stylus——知道需要时去哪儿找",
        "读 Assignment 第 1 条那篇 CSS 框架简介（Medium，HTML All The Things）",
        "略读 Assignment 第 2 条那篇 SASS、LESS 与 Stylus 概览（LambdaTest）——官方用的是 skim（略读），目的是建立印象",
        "读 Assignment 第 3 条那篇讲 CSS 预处理器缺点的文章（Adam Silver），并注意官方提示：**那篇文章写成之后，CSS 已经有了嵌套与通过自定义属性实现的变量**——读的时候自己核对哪些批评已被原生 CSS 解决",
        "回头对照上一课：自定义属性与 CSS 嵌套正是「预处理器的优势被原生 CSS 吸收」的两个实例，把这条因果讲给自己听一遍"
      ],
      "quiz": [
        {
          "question": "官方对「现在该不该学一个框架或预处理器」给了什么明确建议？理由是什么？",
          "answer": "**建议在你学习的这个时点继续在项目里使用原生 CSS。** 理由有两层：① 所有框架与预处理器都是**围绕 CSS 建立**的，所以把基本功打扎实，会让你日后学习以及在任意框架/预处理器之间切换**显著更容易**；② 在课程期间去学一个，从长期看**不会比提升原生 CSS 基本功更有产出、更有价值**。另外官方也给了现实定位：这些工具在职场很常见，入门级面试官更可能考基本功，所以你现在需要的是「知道它们是什么、需要时去哪儿学」，而不是现在就上手。"
        },
        {
          "question": "CSS 框架归根结底是什么？用之前你必须先理解哪两件事？Bootstrap 与 Tailwind 的路线差别在哪？",
          "answer": "框架**归根结底就是一捆你可以使用和访问的 CSS**，通过框架定义的 class 来用（例如很多框架提供 `.btn`，一行 CSS 都不写就能给按钮加全套样式）。用之前必须理解：① **它期望你怎样组织网站结构**；② **它用哪些 class 来应用它那套特定样式**。路线差别在目标：**Bootstrap 这类**替你打包好常用 CSS、甚至图标与交互（如下拉菜单），意图是把「编写直观、可复用、响应式元素」的过程抽象掉；**Tailwind 这类**则用一种不同语法改变你应用 CSS 的方式——提供预命名的 class，每个通常只对应一行 CSS，靠组合它们表达样式。"
        },
        {
          "question": "官方列出的框架代价有哪些？其中哪一条与「基本功」直接相关？",
          "answer": "代价包括：① 由于框架的相似用法，很多网站之间出现**大量相似之处**（同质化）；② **太多新开发者在学习的太早阶段就跳去学框架**——「不必练原生 CSS」的诱惑很大，结果 CSS 练习量不足以巩固基本功；③ **基本功较弱时，覆盖框架样式或调试样式问题会变得非常困难**，所以必须理解框架在「引擎盖下」做了什么（官方说：相信我们，你一定会遇到这些问题）；④ 框架帮你快速起步，但**长期可能约束你**，而且项目一旦用框架开始，**移除它可能很困难**。与基本功直接相关的是 ② 与 ③：前者是练不够，后者是练不够之后要付的账。"
        },
        {
          "question": "预处理器是什么、产出什么？为什么官方说「现在学一个可能不值得那份成本」？",
          "answer": "预处理器（也叫预编译器）是**帮你更轻松写 CSS 的语言**：能减少代码重复，提供循环、条件、合并多个样式表等省时省码的特性。它本质上是**对原生 CSS 的扩展**——**运行预处理器时，它接收你的代码并把它变成原生 CSS**，你再把这些原生 CSS 导入项目。官方说可能不值得，是因为**预处理器最有用的许多特性已经在原生 CSS 中实现了**：你已经学过的**自定义属性**过去只有预处理器能做到，**CSS 嵌套**也曾是某些预处理器的常见优势、如今已进入原生 CSS 并开始获得更多浏览器支持。所以除非你确实需要那些还没进原生 CSS 的特性，否则不必为此付出学习成本。（Assignment 第三篇讲预处理器缺点的文章也要注意这一点：官方提示它写成之后 CSS 已经有了嵌套与变量。）"
        }
      ],
      "optional": [],
      "note": "",
      "why": "这一课的价值不在工具本身，而在**时机判断**。你迟早会在招聘要求、同事代码、开源项目里遇到 Bootstrap、Tailwind、SASS——那时你需要的是「看懂它在干什么」的能力，而这种能力来自原生 CSS 基本功，不来自提前学一个框架。官方把话说得很直白：太早跳去学框架的人，往往练不够原生 CSS，等到要覆盖框架样式或调试样式问题时才发现自己没能力处理。所以这一课的正确读法是：记住名字、理解代价、然后**继续写原生 CSS**——等你需要时，切换成本会比你想象的低得多。",
      "sections": [
        {
          "h": "为什么现在要「知道但不学」",
          "p": [
            "到这里，你已经写了相当多的原生 HTML 与 CSS，也学了不少你会随着成长继续使用的设计技巧。在这些经历中，你可能遇到过关于 **CSS 框架**与**预处理器**（preprocessors，也叫 precompilers 预编译器）的信息。**这两类工具都能让写 CSS 更顺畅、更少枯燥。**",
            "值得了解 CSS 框架与预处理器的一个有用理由是：**它们在工作场所很常见**。虽然入门级岗位的面试官更可能把重点放在 CSS 基本功上（即使那份工作使用了某个特定框架或预处理器），但知道这些工具是什么、以及一旦你确定需要学习它们时该去哪儿找，仍然很有帮助。",
            "**你应该意识到：在你学习的这个时点，建议继续在你的项目里使用原生 CSS。** 所有这些框架与预处理器都是**围绕 CSS 建立**的，因此培养扎实的基本功，会让你将来学习并在任意框架或预处理器之间切换**显著更容易**。在这门课程期间去学一个，从长期看不会比提升你的原生 CSS 基本功更有产出、更有价值。",
            "这一课的目标因此是四个「知道」：知道 CSS 框架是什么、知道有哪些框架、知道预处理器是什么、知道有哪些预处理器。"
          ]
        },
        {
          "h": "框架概览：两条不同的路线",
          "p": [
            "**不同的框架有不同的目标。** 像 **Bootstrap** 这样的框架替你做了大量重活——把常用的 CSS 代码打包好，甚至包括图标与交互（比如菜单下拉）。它们被设计用来**把「编写直观、可复用、响应式元素」这个过程抽象掉**。",
            "而像 **Tailwind** 这样的东西，目标是**通过一种不同的语法来改变我们应用 CSS 的方式**——它提供预命名的 class，这些 class 通常每个只应用一行 CSS。",
            "**CSS 框架归根结底就是一捆你可以使用和访问的 CSS**，通过框架定义的 class 来用。举个例子，许多框架提供一个叫 `.btn` 的 class，它会给你的按钮加上全部所需样式，而你不需要写任何 CSS。",
            "一般来说，要使用一个框架，你需要理解**它期望你怎样组织你的网站结构**，以及**它使用哪些 class 来应用它那套特定的样式**。",
            "你还应该知道，市面上可用的框架相当多。你可能遇到的另外两个框架是 **Bulma** 与 **Foundation**，但外面还有很多。"
          ]
        },
        {
          "h": "框架的代价",
          "p": [
            "框架很适合**快速产出界面、让最终用户能轻松交互**的网站。然而，一旦你逛完几个比较流行的框架，你会开始注意到：由于框架的相似用法，**你遇到的很多网站之间有非常多的相似之处**。",
            "除此之外还有一个问题：**太多新开发者也在他们教育的太早阶段就跳去学习框架**；「不必练习写原生 CSS」这个前景非常诱人。结果是，许多开发者的 CSS 练习量不足以把这门非常重要语言的基本功巩固下来。",
            "另外，**如果你的 CSS 基本功较弱，覆盖一个框架的样式、或者调试你页面上的样式问题，会变得非常困难**。**理解一个框架在「引擎盖下」做什么，是必须的**，这样你才有能力在之后处理这些问题（相信我们，你一定会遇到的）。",
            "归根结底：框架能帮你快速起步并跑起来——**但长期来看它们可能约束你**。一个项目一旦使用框架开始，**要移除它可能很困难**。将来，你（或者你的雇主！）可能必须决定一个项目要不要使用框架，以及如果用，用哪一个。"
          ]
        },
        {
          "h": "预处理器概览：编译成原生 CSS 的扩展语言",
          "p": [
            "**预处理器（也叫预编译器）是帮你更轻松地写 CSS 的语言。** 它们能减少代码重复，并提供各种省时省码的特性——举例来说，允许你写**循环与条件**，以及**合并多个样式表**。",
            "CSS 预处理器本质上是**对原生 CSS 的扩展**，提供一些额外功能。**当你运行预处理器时，它接收你的代码，把它变成原生 CSS**，然后你可以把这些原生 CSS 导入你的项目。",
            "所以它与框架的根本差别在这里：框架给你**现成的 CSS**（你直接引用它的 class），预处理器给你**一门要先编译的语言**（编译产物才是浏览器读的 CSS）。"
          ]
        },
        {
          "h": "预处理器的优势正在被原生 CSS 吸收",
          "p": [
            "预处理器确实有一些独特而有用的工具，但**它们最有用的许多特性已经在原生 CSS 中被实现**了。因此，**除非你认为自己真的需要这些特性，学习一个预处理器可能不值得那份额外成本**。",
            "官方给了两个例子：你已经学过的**自定义属性**（上一课），过去是只有预处理器才可能做到的事情；**CSS 嵌套**也曾是某些预处理器的常见优势，但现在已经进入原生 CSS，并且最近开始获得更多浏览器支持。",
            "使用中的标准预处理器有 **SASS**、**LESS** 与 **Stylus**。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "html",
          "code": "<!-- 框架路线：你不写 CSS，只按框架约定的 class 组合结构 -->\n\n<!-- Bootstrap 风格：框架提供 .btn / .btn-primary 这类现成 class -->\n<button class=\"btn btn-primary\">提交</button>\n\n<!-- Tailwind 风格：预命名的工具类，每个通常只对应一行 CSS -->\n<button class=\"px-4 py-2 rounded bg-blue-600 text-white\">提交</button>\n\n<!-- 原生路线（本课阶段官方建议你继续这么写）：自己定 class，样式在自己的 CSS 里 -->\n<button class=\"btn\">提交</button>",
          "note": "本站示意代码（官方正文没有代码块，只点名了工具与概念）。三种写法的差别一眼可见：前两种是「按框架约定拼 class」，第三种是「自己的语义 class + 自己写的规则」。要用框架，就得先理解它期望的网站结构与 class 约定——这也是官方说「用框架前先搞清它怎么想」的意思。"
        },
        {
          "lang": "css",
          "code": "/* 原生路线：上面第三个 button 的样式 */\n.btn {\n  padding: .5rem 1rem;\n  border-radius: var(--radius-small);\n  background: var(--color-accent);\n  color: #fff;\n}\n\n/* 预处理器的「优势」如今大多已有原生写法 —— 这是官方说「可能不值得那份成本」的依据 */\n\n/* ① 变量：过去只有预处理器能做 → 现在是自定义属性（上一课） */\n:root { --space-md: 1rem; }\n.card { padding: var(--space-md); }\n\n/* ② 嵌套：过去是预处理器的常见优势 → 现在原生 CSS 也支持（支持情况查 Can I Use） */\n.card {\n  padding: var(--space-md);\n\n  & h2 { margin: 0; }\n}",
          "note": "本站示意代码。注意这两段正是「预处理器的能力被原生 CSS 吸收」的两个实例：变量对应自定义属性，嵌套对应原生 CSS 嵌套。按上一课的方法，用之前先在 Can I Use 上确认目标浏览器的支持版本。"
        }
      ],
      "pitfalls": [
        {
          "title": "在课程期间跳去学一个框架",
          "text": "官方专门点名了这个陷阱：「不必练习写原生 CSS」的诱惑很大，太早学框架的人往往练不够基本功。按官方建议——**这个阶段继续用原生 CSS**。基本功扎实之后，学与切换框架都会显著更容易。"
        },
        {
          "title": "用了框架却看不懂它生成的样式",
          "text": "覆盖框架样式或调试样式问题时，基本功弱会非常吃力。必须理解框架在「引擎盖下」做了什么——具体做法是用 DevTools 看它给某个 class 实际加了哪些声明、优先级是多少，而不是靠猜着加 !important。"
        },
        {
          "title": "把框架和预处理器当成同一类东西",
          "text": "不是。框架是**一捆现成 CSS**（你引用它的 class，浏览器直接读）；预处理器是**一门要先编译的语言**（SASS/LESS/Stylus 源码要先跑一遍，产出原生 CSS 才能导入项目）。两者可以同时用，但解决的问题不同。"
        },
        {
          "title": "为了「变量和嵌套」而引入预处理器",
          "text": "这两个正是已经被原生 CSS 吸收的能力：变量 = 自定义属性（var()），嵌套 = 原生 CSS 嵌套。除非你确实需要还没进原生 CSS 的特性（如 mixin、函数、批量运算），否则引入预处理器只是给项目加一道构建步骤——而这个项目的红线是零构建。"
        },
        {
          "title": "项目开了头才想换掉框架",
          "text": "官方提醒：一旦项目用框架开始，移除它可能很困难（结构、class 命名、组件依赖都已经长进去了）。所以「要不要用框架、用哪个」是**开工前**的决定，不是中途能轻松反悔的——将来你或你的雇主需要认真做这个判断。"
        }
      ],
      "official": {
        "assignment": [
          "读这篇关于 CSS 框架的简要概览（Medium，HTML All The Things）。",
          "略读这篇关于 SASS、LESS 与 Stylus 的概览（LambdaTest）。",
          "读一读关于使用 CSS 预处理器的一些缺点（Adam Silver）。注意：自那篇文章写成以来，CSS 现在已经有了嵌套，以及通过自定义属性实现的变量。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/intermediate_css_concepts/frameworks_and_preprocessors.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "ba3e0ee0f915fdeb3a0f320efd1e93694b6523345103b40505aac2d45b6848bb",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-form-basics",
      "title": "Form Basics",
      "zh": "表单基础",
      "group": 2,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-form-basics",
      "summary": "表单是用户把数据交给你的唯一正规入口：`<form>` 用 action 说明数据送到哪、用 method 说明用哪种 HTTP 方法送；里面装的各种表单控件（input / textarea / select / button）各自负责一类数据。这一课把「一个能用的表单」需要的零件一次讲全：每个控件怎么写、label 的 for 与 input 的 id 为什么要配对、name 属性为什么不能省、radio 靠什么成组、按钮的 type 默认值会怎么坑你，以及大表单怎么用 fieldset + legend 分块。",
      "guide": "以下是官方原课的中文化梳理。这一课信息密度高但结构很整齐：先认容器（form 与它的两个必要属性），再逐个认控件（文本类 → 选择类 → 按钮），最后讲怎么把一堆控件组织成人能读完的表单。学的时候建议手边开一个 HTML 文件跟着敲——表单是那种「看一眼就懂、敲一遍才记住」的东西。官方正文里有若干 CodePen 演示（提交到 httpbin 看回显、把控件放在 form 外面用），本站按既有口径只链接不搬运，你在「官方任务」一节能看到对应说明；其中「提交到 httpbin 看回显」这个实验强烈建议亲手做一遍，它是理解 name 属性最直接的办法。本课要求的外部文章与本站的中文导读都在「官方任务」一节末尾的「本课外部资料」里。",
      "understand": [
        "`<form>` 是容器元素（和 div 同类），把用户会交互的所有输入包在里面；它有两个必要属性——`action` 给出处理数据的 URL（数据送到哪），`method` 告诉浏览器用哪种 HTTP 请求方法提交",
        "GET 用于**从服务器取东西**（例如搜索引擎的搜索请求：它 *get* 回搜索结果）；POST 用于**改变服务器上的东西**（例如注册账号、付款）。这两个是你最常用的方法",
        "表单控件（form controls）= 用户在表单上会去操作的那些元素的统称：文本框、下拉菜单、复选框、按钮等。`<input>` 是其中最多面手的一个，靠 `type` 属性决定它接收什么数据、浏览器怎么渲染它",
        "光有 input 没用——用户不知道该填什么。`<label>` 用 `for` 属性与某个 input 的 `id`（两者取值相同）配对；配对后**点击 label 会把光标聚焦到对应 input**，这也是依赖辅助技术的用户能正常使用表单的前提",
        "`placeholder` 用来示范「这里该填什么格式」；`name` 才是提交时数据的标识——**没有 name 的输入项在提交时会被直接忽略**。可以把 name 理解成这个输入的变量名",
        "表单控件可以脱离 `<form>` 单独使用（哪怕你没有后端）：常见做法是用 JavaScript 读取控件里的值，再显示到页面别处——路线后面的项目就会这么做",
        "`type` 换值就换控件：`email`（移动端弹带 @ 的键盘、并校验格式）、`password`（用 * 或 • 掩码）、`number`（只接受数字）、`date`（渲染日期选择器）。`<textarea>` 严格说不是 input，它接受多行文本、**有闭合标签**（可以包初始内容），并用 `rows` / `cols` 控制初始高宽",
        "选择类控件三种：`<select>` + `<option>`（下拉，option 的 `value` 才是提交给服务器的值、没有 value 就用标签内文本；`selected` 设默认选中；`<optgroup label>` 可把选项分组）；`type=\"radio\"`（单选，**靠相同的 name 成组**，选一个会自动取消同组另一个，`checked` 设默认）；`type=\"checkbox\"`（可多选，也可只放一个当「是/否」开关）",
        "`<button>` 的 `type` 有三种：`submit`（提交所在表单，**也是默认值**）、`reset`（清空并恢复初始值）、`button`（什么也不做，常配 JS 做交互）。因此表单里任何**不是**用来提交的按钮都必须显式写 type，否则点一下就会意外提交表单",
        "大表单要分块：`<fieldset>` 把相关输入组成一个逻辑单元，`<legend>` 紧跟在 fieldset 开始标签之后给这一组一个标题。最典型的用法是用 fieldset 把一组 radio 框起来、用 legend 说明这组选项到底在问什么",
        "样式化表单有两个现实困难：**每个浏览器对表单控件都有自己的默认样式**（要跨浏览器一致就得自己覆盖），以及**部分控件很难甚至无法样式化**（radio / checkbox 有成熟做法与新属性 `accent-color`；日历 / 日期选择器这类则基本只能用 JS 自建控件或引库）"
      ],
      "terms": [
        {
          "en": "form element",
          "zh": "表单元素：容器元素，包住用户会交互的全部输入；靠 action 指定数据去向、靠 method 指定 HTTP 方法"
        },
        {
          "en": "action attribute",
          "zh": "action 属性：一个 URL，告诉表单把数据送到哪里去处理（路线后面会用它把前端表单接到后端）"
        },
        {
          "en": "method attribute",
          "zh": "method 属性：告诉浏览器用哪种 HTTP 请求方法提交表单，最常用 GET（取数据）与 POST（改数据）"
        },
        {
          "en": "form control",
          "zh": "表单控件：用户在表单上会操作的元素的统称——文本框、下拉、复选框、按钮等"
        },
        {
          "en": "label / for attribute",
          "zh": "标签与 for 属性：label 的 for 与 input 的 id 取值相同即完成关联；点 label 会聚焦该 input，也是无障碍的基本要求"
        },
        {
          "en": "placeholder attribute",
          "zh": "placeholder 属性：输入框里的示范文字，用来演示该怎么填、什么格式（不是标签的替代品）"
        },
        {
          "en": "name attribute",
          "zh": "name 属性：提交后后端识别这份数据的引用名，可以理解为该输入的变量名；缺失则该输入被忽略"
        },
        {
          "en": "textarea",
          "zh": "多行文本框：接受跨行文本（评论、留言），有闭合标签可包初始内容，用 rows / cols 控制初始高度与宽度"
        },
        {
          "en": "select / option / optgroup",
          "zh": "下拉选择：select 包住若干 option（value 是提交值，selected 设默认），optgroup 用 label 给选项分组"
        },
        {
          "en": "radio button",
          "zh": "单选按钮：同 name 的多个 radio 构成一组，只能选中其中一个；checked 设默认选中"
        },
        {
          "en": "checkbox",
          "zh": "复选框：可一次选中多个；也可以只放一个，当「要 / 不要」的开关（例如是否订阅通讯）"
        },
        {
          "en": "submit / reset / button",
          "zh": "按钮的三种 type：提交所在表单（默认值）/ 清空并恢复初始值 / 不做事（常配 JS）"
        },
        {
          "en": "fieldset / legend",
          "zh": "字段集与图例：fieldset 把相关输入组成一个逻辑单元，legend 紧跟其后给这组一个标题或说明"
        },
        {
          "en": "accent-color",
          "zh": "CSS 属性 accent-color：近年新增，让 radio 与 checkbox 的着色变得简单（不必再全靠 hack）"
        }
      ],
      "tasks": [
        "能不查资料写出一个最小可用表单：form（带 action 与 method）+ label（for 与 id 配对）+ input（带 name）+ submit 按钮",
        "说清 GET 与 POST 各自用在什么场景，并能举例（搜索 vs 注册/付款）",
        "把 name 的作用讲给同事听：为什么少了 name，填了也白填",
        "分清三种选择控件的适用场景：选项多且省空间用 select、5 个以内直接摊开用 radio、可多选或单个开关用 checkbox",
        "记住按钮 type 的默认值陷阱，并能在 code review 里一眼看出「表单里那个非提交按钮漏写 type」",
        "给一个大表单做分块：fieldset 分组 + legend 标题，尤其是给一组 radio 加说明",
        "按官方 Assignment 读 MDN 的表单入门教程与「不同的表单控件」两组指南，跟着敲一遍",
        "按官方 Assignment 读 MDN 的表单样式教程（可跳过依赖很新 CSS 特性、浏览器支持还不广的「Customizable select」两篇）与 internetingishard 的表单指南"
      ],
      "quiz": [
        {
          "question": "一个 input 既有 label（for 配对正确）也写了 placeholder，但提交后后端就是收不到这个字段的值。最可能漏了什么？",
          "answer": "**漏了 `name` 属性。** label 与 placeholder 都是给人看的（前者还兼无障碍职责），而提交时数据的标识是 `name`——官方明确写了：表单输入应当总是带 name，否则提交时会被忽略。把它理解成这个输入的变量名：没有变量名，值就无处安放。"
        },
        {
          "question": "form 的 method 该选 GET 还是 POST？判断依据是什么？",
          "answer": "**看这次提交是要「取」还是要「改」。** 想从服务器取回东西用 GET（官方例子：Google 搜索就是 GET，因为它 *get* 回搜索结果）；想改变服务器上的状态用 POST（官方例子：用户注册账号、在网站付款）。"
        },
        {
          "question": "三个 radio 放在一起，用户却可以同时选中两个。问题出在哪？",
          "answer": "**它们的 `name` 不相同。** 浏览器判断「这几个 radio 属于同一组选项」靠的就是相同的 name；同组内选中一个会自动取消另一个。要让它们互斥，就给同一组的每个 radio 写同一个 name（各自的 value 不同）。"
        },
        {
          "question": "表单里放了一个「点击切换主题」的按钮，结果一点它整个表单就提交了。为什么？怎么修？",
          "answer": "**因为 `<button>` 的 `type` 默认值就是 `submit`**（不写 type、或写了无效值都算）。表单里任何不是用来提交的按钮都必须显式写 `type=\"button\"`，否则就会发出不必要的请求、把数据提交回服务器。这正是官方那条 tip 强调的内容。"
        }
      ],
      "optional": [],
      "note": "",
      "why": "表单是网站里少数「用户主动把数据交给你」的地方，也是最容易做错的地方：漏一个 name，数据静默消失；按钮漏写 type，点一下意外提交；label 不用 for 配对，用键盘和读屏软件的人直接卡住。这些错误有个共同点——页面看起来完全正常，问题只在交互或提交时才暴露，所以很难靠肉眼发现。把这一课的零件与各自职责一次记牢，后面写注册页、评论框、筛选器时就是在做组合，而不是每次重新猜。",
      "sections": [
        {
          "h": "表单是什么，以及为什么控件类型很重要",
          "p": [
            "表单是网站上最关键的部分之一。它是你的用户通向后端的入口——**用户在表单里提供数据，你拿这些数据去做事**。",
            "有一件事需要在一开始就建立意识：同一份数据往往有好几种收集方式，但**只有一种对用户最省事**。所以你要为每一类数据挑合适的输入类型——收集日期就别让人手打「2026年9月26日」，给日期选择器；收集邮箱就别用普通文本框，用 email 类型（移动端会弹出带 @ 的键盘）。",
            "这一课要做的事就是两件：把 HTML 表单的基础零件认全，以及知道手上有哪些输入类型可用。"
          ]
        },
        {
          "h": "form 元素：容器，加两个必要属性",
          "p": [
            "`<form>` 是一个**容器元素**，和前面学过的 div 同类：它把用户在表单上会交互的所有输入包在里面。",
            "它接受两个必要属性。第一个是 `action`，取值是一个 URL，告诉表单**数据该送到哪里去处理**。路线后面会学到怎么用这个属性把后端系统接到前端表单上；现在只需要知道它是干什么用的。",
            "第二个是 `method`，告诉浏览器**该用哪种 HTTP 请求方法**来提交表单。你会最常用到的是 GET 与 POST 两种：",
            "- **GET**：想从服务器**取**东西时用。例如你在 Google 搜索，它发的就是 GET 请求——顾名思义，它是在「取回」（get）搜索结果。",
            "- **POST**：想**改变**服务器上的东西时用。例如用户注册账号、或在网站上付款。",
            "写出来长这样：`<form action=\"example.com/path\" method=\"post\">` … `</form>`。"
          ]
        },
        {
          "h": "表单控件：用户真正会去操作的那些元素",
          "p": [
            "要开始收集用户数据，就得用**表单控件（form controls）**。这是所有「用户会在表单上与之交互」的元素的统称：文本框、下拉菜单、复选框、按钮等等。",
            "接下来几节会把最常用的几类控件过一遍。你会发现 HTML 在这件事上的设计相当经济：一个 `<input>` 元素靠换 `type` 就变出了大半个控件家族。"
          ]
        },
        {
          "h": "input 元素与 label：为什么它们必须成对出现",
          "p": [
            "`<input>` 是所有表单控件里**最多面手**的一个。它接受一个 `type` 属性，告诉浏览器该期望什么类型的数据、以及该怎么渲染这个输入框。最基础的文本输入就是 `<input type=\"text\">`——它接受任何文本，典型用途是收集姓、名这类内容。",
            "但一个光秃秃的 input 没什么用：**用户不知道该填什么**。所以要给它配一个标签，用 `<label>` 元素，要显示的文字放在开始与结束标签之间。",
            "配对靠两个属性：label 的 `for`，与 input 的 `id`，**两者取值相同**。例如 `<label for=\"first_name\">First Name:</label>` 配 `<input type=\"text\" id=\"first_name\">`。",
            "配对成功后有一个立刻能感觉到的好处：**点击 label 就会把光标聚焦到那个 input 上**，用户直接就能开始输入。这不是小便利——对依赖辅助技术（读屏软件等）的用户来说，label 与控件的正确关联是表单能不能用的前提。"
          ]
        },
        {
          "h": "placeholder：示范格式，不是替代标签",
          "p": [
            "想提示用户「这里该填成什么样」，可以在输入框里放占位文字：给 input 加 `placeholder` 属性，属性值就是要显示的占位文本，例如 `<input type=\"text\" id=\"first_name\" placeholder=\"Bob...\">`。",
            "官方对它的定位很明确：**用占位文字来演示该怎么填、格式是什么**。它是 label 的补充，不是替代——占位文字在用户开始输入后就消失了，而标签需要一直在。"
          ]
        },
        {
          "h": "name：提交时数据的标识，漏了就白填",
          "p": [
            "label 是给**用户**看的，让他们明白这个框里填的东西代表什么；同样地，你也需要让**后端**（数据的接收方）明白每份数据代表什么。这件事靠 `name` 属性：`<input type=\"text\" id=\"first_name\" name=\"first_name\">`。",
            "`name` 是提交之后对这份数据的引用。**可以把它想成这个输入的变量名。** 官方给的规则很硬：表单输入应当总是带 `name` 属性，否则**提交时它会被忽略**。",
            "想直观看到这件事，官方建议把表单提交到 httpbin.org 这个服务——它会把收到的数据回显出来，你就能看到提交了什么。回显里我们关心的是 \"form\" 这个对象，形如 `{\"age\": \"33\", \"first_name\": \"John\", \"last_name\": \"Doe\"}`。官方的练习是：改掉某几个输入框的 name、或者干脆把 name 删掉，再提交一次，看回显里的表单数据怎么变。",
            "**这个实验值得亲手做一遍**：删掉 name 之后那个字段从回显里彻底消失，比读十遍「会被忽略」都记得牢。"
          ]
        },
        {
          "h": "控件可以脱离 form 单独用",
          "p": [
            "有一点值得单独说：HTML 提供的这些表单控件**都可以用在 `<form>` 元素外面**，哪怕你根本没有可以接收数据的后端服务器。",
            "典型用法是：放一个 input 从用户那里拿到一些数据，然后用 JavaScript 把它显示到页面的别处。官方在这里放了一个 CodePen 演示（本站按既有口径只链接不搬运）。",
            "这不是边角技巧——**路线后面的项目里就会这样操作表单控件的数据**（例如本 World 最后的 Sign-up Form 项目，以及 JavaScript 那一段的多个项目）。"
          ]
        },
        {
          "h": "type 换值就换控件：email / password / number / date",
          "p": [
            "**`email`** 是专门为邮箱地址准备的文本输入。它和普通文本框的差别有两点：在移动设备上会显示**带 @ 符号的键盘**，输入邮箱更省事；它还会**校验格式**是否是合法的邮箱地址（校验这件事下一课细讲）。写法：`<input type=\"email\" id=\"user_email\" name=\"email\" placeholder=\"you@example.com\">`。",
            "**`password`** 是另一种特化文本输入。差别在于它会**把输入的内容掩码掉**——通常显示成星号（*）或圆点（•），防止旁边的人看到输了什么。写法：`<input type=\"password\" id=\"user_password\" name=\"password\">`。",
            "**`number`** 只接受数值，用户试图输入的其他字符会被忽略。写法：`<input type=\"number\" id=\"amount\" name=\"amount\">`。",
            "**`date`** 用来收集日期。它的特别之处在于**用户体验更好**：浏览器会渲染一个日期选择器日历，而不是让人手打日期串。写法：`<input type=\"date\" id=\"dob\" name=\"dob\">`。"
          ]
        },
        {
          "h": "textarea：多行文本，而且它有闭合标签",
          "p": [
            "严格说 `<textarea>` 不是 input 元素，但它提供的是一个能接受**跨多行文本**的输入框，典型用途是用户评论、留言。它还可以拖拽右下角来放大缩小。",
            "和 input 不一样，**textarea 有闭合标签**——因此你可以在里面包一份初始内容：`<textarea>Some initial content</textarea>`。",
            "它还接受两个别的控件没有的属性：`rows` 与 `cols`，用来控制初始的高度（行数）与宽度（列数），例如 `<textarea rows=\"20\" cols=\"60\"></textarea>`。"
          ]
        },
        {
          "h": "select 下拉：value 才是提交值，optgroup 可以分组",
          "p": [
            "有时你希望用户**从一份预先定义好的清单里选一个值**，这时用 select 元素。它渲染成一个下拉列表。语法上它和无序列表有点像：`<select>` 包住若干 `<option>`，每个 option 就是一个可选项。",
            "关键细节：**每个 option 都应该有 `value` 属性**（没有的话就用标签内的文本），提交表单时送到服务器的是这个 value。例如 `<option value=\"mercedes\">Mercedes</option>`——用户看到的是 Mercedes，服务器收到的是 mercedes。",
            "想让某一项在浏览器首次渲染表单时就是选中的，给那一项加 `selected` 属性。",
            "选项多的时候还可以用 `<optgroup>` 把它们分组，optgroup 接受一个 `label` 属性，浏览器用它作为每组的组名。官方的例子是一个服饰下拉，分成 Clothing（T 恤 / 毛衣 / 外套）与 Foot Wear（运动鞋 / 靴子 / 凉鞋）两组。"
          ]
        },
        {
          "h": "radio 单选：靠相同 name 成组",
          "p": [
            "下拉列表的优点是**省页面空间**，适合选项很多的情况。但如果选项只有 5 个或更少，**直接把选项摊在页面上通常体验更好**——不必先点开下拉再选。这时用单选按钮（radio buttons）。",
            "radio 让你给出多个选项、用户只能选其中一个。写法还是那个万能的 input，`type=\"radio\"`。",
            "**成组的机制是 name**：当你选中一个 radio 再去选另一个时，第一个会自动取消选中——radio 之所以知道要这么做，是因为它们**有相同的 `name` 属性**。这就是浏览器判断「这些元素属于同一组选项」的依据。官方的例子是票种选择（child / adult / senior），三个 input 的 name 都是 `ticket_type`，各自的 value 不同。",
            "设置默认选中项：给它加 `checked` 属性。"
          ]
        },
        {
          "h": "checkbox 复选框：多选，或者只当一个开关",
          "p": [
            "复选框和 radio 相似，都是让用户从预定义选项里挑；**区别是 checkbox 允许一次选中多个**。写法是 `type=\"checkbox\"`。官方的例子是披萨配料（香肠 / 洋葱 / 意式辣肠 / 蘑菇），四个 checkbox 的 name 都是 `topping`、value 各自不同——用户勾几个就提交几个。",
            "另一种常见用法是**只放一个 checkbox**，用来让用户切换某件事的真假，例如注册账号时勾选「给我发通讯邮件」。",
            "想让复选框在页面加载时就是勾选状态，同样用 `checked` 属性。"
          ]
        },
        {
          "h": "button 的三种 type，以及默认值埋的坑",
          "p": [
            "`<button>` 元素创建可点击的按钮，用户用它提交表单、或触发别的动作。要显示在按钮里的文字放在开始与结束标签之间，例如 `<button>Click Me</button>`。",
            "button 也接受 `type` 属性，告诉浏览器这是哪种按钮。一共三种：",
            "- **submit**：用户填完表单需要一个提交途径，这就是提交按钮。点击它会提交它所在的那个表单。**`type` 的默认值就是 submit**——也就是说，不写 type、或者写了个无效值，都按 submit 处理。",
            "- **reset**：清空用户已填入的全部数据，把表单里所有输入恢复到初始状态。",
            "- **button**：第三种是通用按钮，什么也不做，通常配 JavaScript 用来做交互界面。",
            "官方专门用一条 tip 强调这个坑：**表单里 type 为 submit（也就是默认值）的按钮，总会试图发起新请求、把数据提交回服务器**。所以表单内那些用于其他目的的按钮，**必须显式写明 type**，避免误提交带来的意外后果。"
          ]
        },
        {
          "h": "fieldset 与 legend：把大表单切成能读完的块",
          "p": [
            "给数据挑对了输入类型，表单就已经友好了一大半。但**表单一大，用户就容易被吓退**——要填的东西太多时会感到压力和放弃。",
            "HTML 提供了两个元素来解决这件事，把表单分成视觉上各自独立、读起来不吃力的若干段。",
            "**`<fieldset>`** 是容器元素，用来把相关的表单输入**组成一个逻辑单元**：想放在一起的输入就写在 fieldset 的开始与结束标签之间（例如把 First Name 与 Last Name 两个输入框进同一个 fieldset）。",
            "**`<legend>`** 给 fieldset 一个标题或说明，让用户看出这一组输入是干什么用的。位置有要求：**legend 应当紧跟在 fieldset 的开始标签之后**。官方例子把一张配送表单切成「Contact Details」（姓名 / 电话 / 邮箱）与「Delivery Details」（街道 / 城市 / 邮编）两个 fieldset，各带一个 legend。",
            "这两个元素最典型的配合是：**用 fieldset 把一组 radio 框起来，用 legend 告诉用户这组选项到底在问什么**——例如 legend 写「你想喝点什么？」，里面是 coffee / tea / soda 三个 radio。"
          ]
        },
        {
          "h": "关于给表单做样式：两个现实困难",
          "p": [
            "深入的表单样式资料在下一节「官方任务」里（MDN 的表单样式教程与 internetingishard 的指南）。在那之前，先说清给 HTML 表单做样式会遇到什么麻烦。",
            "**困难一：浏览器的默认样式各不相同。** 每个浏览器对表单控件都有自己的一套默认样式，于是同一份表单在不同浏览器里看起来不一样。想要跨浏览器一致的设计，就得**覆盖这些默认样式、自己来写**。",
            "**困难二：有些控件很难、甚至根本没法样式化。** 文本类控件（text、email、password、textarea）相当直接——它们和别的 HTML 元素一样工作，大多数 CSS 属性都能用。radio 与 checkbox 就麻烦了：想自定义样式需要技巧，网上有很多现成指南（官方给了 moderncss.dev 那篇纯 CSS 自定义复选框的指南），另外近年还新增了 CSS 属性（`accent-color`）让这件事简单很多。而另一些东西是**真的没法样式化**的，例如日历或日期选择器——想要自定义外观，只能用 JavaScript 自建表单控件，或用现成的 JS 库。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "html",
          "code": "<!-- 最小可用表单：容器 + 两个必要属性 -->\n<form action=\"example.com/path\" method=\"post\">\n\n  <!-- label 的 for 与 input 的 id 取值相同 = 完成关联；name 是提交时的标识，不能省 -->\n  <label for=\"first_name\">First Name:</label>\n  <input type=\"text\" id=\"first_name\" name=\"first_name\" placeholder=\"Bob...\">\n\n  <!-- type 换值就换控件 -->\n  <label for=\"user_email\">Email Address:</label>\n  <input type=\"email\" id=\"user_email\" name=\"email\" placeholder=\"you@example.com\">\n\n  <label for=\"user_password\">Password:</label>\n  <input type=\"password\" id=\"user_password\" name=\"password\">\n\n  <label for=\"amount\">Amount:</label>\n  <input type=\"number\" id=\"amount\" name=\"amount\">\n\n  <label for=\"dob\">Date of Birth:</label>\n  <input type=\"date\" id=\"dob\" name=\"dob\">\n\n  <!-- textarea 有闭合标签，可包初始内容；rows / cols 控制初始高宽 -->\n  <textarea rows=\"20\" cols=\"60\">Some initial content</textarea>\n\n  <!-- 表单内的非提交按钮必须显式写 type，否则默认 submit 会误提交 -->\n  <button type=\"submit\">Submit</button>\n  <button type=\"reset\">Reset</button>\n  <button type=\"button\">Click to Toggle</button>\n\n</form>",
          "note": "代码取自官方正文的分段示例（form 容器、label 配对、placeholder、name、四种 type、textarea、三种按钮），本站按「一个表单里依次出现」的顺序合并，便于对照。注意每个 input 都带了 name——这是官方强调的硬规则。"
        },
        {
          "lang": "html",
          "code": "<!-- 选择类控件：select（含分组与默认选中） -->\n<select name=\"fashion\">\n  <optgroup label=\"Clothing\">\n    <option value=\"t_shirt\">T-Shirts</option>\n    <option value=\"sweater\">Sweaters</option>\n    <option value=\"coats\" selected>Coats</option>\n  </optgroup>\n  <optgroup label=\"Foot Wear\">\n    <option value=\"sneakers\">Sneakers</option>\n    <option value=\"boots\">Boots</option>\n  </optgroup>\n</select>\n\n<!-- radio：同 name 成组，选中一个自动取消同组另一个；checked 设默认 -->\n<fieldset>\n  <legend>What would you like to drink?</legend>\n  <div>\n    <input type=\"radio\" name=\"drink\" id=\"coffee\" value=\"coffee\">\n    <label for=\"coffee\">Coffee</label>\n  </div>\n  <div>\n    <input type=\"radio\" name=\"drink\" id=\"tea\" value=\"tea\" checked>\n    <label for=\"tea\">Tea</label>\n  </div>\n</fieldset>\n\n<!-- checkbox：同 name 可多选；也可以只放一个当「是/否」开关 -->\n<div>\n  <input type=\"checkbox\" id=\"sausage\" name=\"topping\" value=\"sausage\">\n  <label for=\"sausage\">Sausage</label>\n</div>\n<div>\n  <input type=\"checkbox\" id=\"newsletter\" name=\"news_letter\">\n  <label for=\"newsletter\">Send me the news letter</label>\n</div>",
          "note": "取自官方正文的三段示例（optgroup 分组的 select、fieldset + legend 框起来的 radio 组、checkbox 的多选与单开关两种用法），本站把 selected / checked 合并进同一份代码里演示默认值写法。"
        }
      ],
      "pitfalls": [
        {
          "title": "input 没写 name，提交后数据静默消失",
          "text": "页面看起来完全正常，label 也配了、placeholder 也写了，但后端收不到这个字段——因为提交时数据的标识是 name，官方明确说：没有 name 的输入项在提交时会被忽略。把 name 当成这个输入的变量名，每个控件都写上。想亲眼看到后果，就照官方的做法把表单提交到 httpbin 看回显里的 \"form\" 对象。"
        },
        {
          "title": "表单里的普通按钮忘了写 type，一点就提交",
          "text": "`<button>` 的 type 默认值是 submit，所以表单内任何不是用来提交的按钮（切换主题、添加一行、打开弹窗）都必须显式写 `type=\"button\"`。漏写的后果是点一下发出一次意外请求、把半成品数据提交回服务器——这正是官方那条 tip 要提醒的事。"
        },
        {
          "title": "一组 radio 用了不同的 name，结果能同时选中多个",
          "text": "浏览器判断「这几个 radio 是同一组」只看 name 是否相同。name 各不相同，它们就各自独立、互不互斥，单选变成了多选。同一组的每个 radio 写同一个 name，各自的 value 不同。"
        },
        {
          "title": "用 placeholder 代替 label",
          "text": "占位文字在用户开始输入后就消失了，之后用户看不到这个框是干什么的；而且它对辅助技术的支持也远不如正确关联的 label。官方的定位是：placeholder 用来演示该怎么填、什么格式，是 label 的补充。两者都写，别二选一。"
        },
        {
          "title": "label 没有用 for/id 与控件配对",
          "text": "只是把 label 放在 input 旁边、视觉上挨着，并不构成关联。要让「点 label 聚焦控件」和读屏软件的播报生效，必须 label 的 for 与控件的 id 取同一个值。这是无障碍的基本要求，不是可选优化。"
        },
        {
          "title": "以为 option 里显示的文字就是提交的值",
          "text": "提交给服务器的是 option 的 value 属性；没有 value 时才退回用标签内文本。想让后端拿到稳定的标识（不受显示文案改动影响），就给每个 option 写 value——官方的例子里显示 Mercedes、提交 mercedes。"
        },
        {
          "title": "指望跨浏览器不写样式就长一样，或硬要样式化日期选择器",
          "text": "两件事都会碰壁：每个浏览器对表单控件有自己的默认样式，想一致就得自己覆盖；而日历 / 日期选择器这类控件的外观基本无法用 CSS 改，要自定义只能上 JavaScript（自建控件或用现成库）。radio 与 checkbox 居中——能改但要技巧，近年可以用 accent-color 省力不少。"
        }
      ],
      "official": {
        "assignment": [
          "阅读并跟着做 MDN 的表单「入门教程」（Introductory Tutorials）那一组。",
          "阅读并跟着做 MDN 的「不同的表单控件」（The Different Form Controls）那组指南。",
          "阅读并跟着做 MDN 的表单样式教程（Form Styling Tutorials）。其中「Customizable select elements」与「Customizable select listbox」两篇可以跳过——它们依赖很新的 CSS 特性，很多浏览器还不支持。",
          "阅读并跟着做 internetingishard 的表单指南。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/forms/form_basics.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "10ce6fa3a8e99215a1b190bcdd4ba904959a17699bf06a6c46df090c01823008",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-form-validation",
      "title": "Form Validation",
      "zh": "表单校验",
      "group": 2,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-form-validation",
      "summary": "校验就是给输入框立规矩：不符合规矩就不让提交，并告诉用户哪里错了、怎么改。HTML 自带一批够用的规矩——`required` 必填、`minlength` / `maxlength` 管文本长度、`min` / `max` 管数值范围、`pattern` 用正则管格式，还能叠着用；CSS 的 `:user-valid` / `:user-invalid` 负责把「过了 / 没过」画出来，且只在用户真正交互过之后才变色。这一课同时讲清内置校验的边界：像「两次密码是否一致」「用户名是否已被占用」这类做不到，得靠 JavaScript；而且客户端校验从来不是银弹，服务端也必须再校验一遍。",
      "guide": "以下是官方原课的中文化梳理。这一课的内容几乎都是「加一个属性就生效」，所以最好边读边在一个 HTML 文件里试：每加一个属性就故意填错一次、点提交，看浏览器给什么提示——提示文案是浏览器自带的，不同浏览器措辞略有差异，这一点官方的例子（CodePen 演示，本站按既有口径只链接不搬运）里能直接看到。两个反直觉的点值得特别留意：一是 `minlength` **不等于** `required`（空着照样能提交）；二是 `pattern` 校验失败时浏览器的默认提示是「请匹配要求的格式」，它没告诉你该怎么改，所以官方建议配 `placeholder` 给个格式示范。本课要求的外部文章与本站的中文导读都在「官方任务」一节末尾的「本课外部资料」里。",
      "understand": [
        "校验（validation）= 给输入设定约束或规则，决定用户能填什么；填的内容违反规则时会出现一条消息，说明哪里不对、怎么改。它是设计良好的表单的关键成分：既保护后端不收错误数据，也让填表体验尽可能简单直白",
        "必填用 `required` 属性。同时官方强调：**为了体验与无障碍，应当总是标明哪些字段是必填**——常见做法是在必填字段的 label 上加一个星号（*），也可以再加一句说明星号含义的话",
        "文本长度：`minlength` 给最小字符数、`maxlength` 给最大字符数，取值都是整数。两者的行为不同——**maxlength 会让浏览器直接阻止用户输入超出上限的字符**；minlength 只在提交时校验",
        "**`minlength` 不隐含 `required`**：什么都不填也能提交成功。官方引 MDN 的解释是「约束校验只在用户改动过值时才应用」（Constraint validation is only applied when the value is changed by the user）。要「必须填且不少于 N 字」就得两个属性一起写",
        "校验可以叠加：一个控件上想加几个加几个，例如给发帖的 `<textarea>` 同时写 `minlength` 与 `maxlength`",
        "数值范围用 `min` 与 `max`，设定允许输入的下界与上界。**它们只对数值类控件有效**（number、date、time 这类），完整的支持清单见 MDN 的 max 属性文档。真实用例：商品订购表单限制数量、订机票选乘客人数",
        "格式用 `pattern`，取值是一个**正则表达式**；`pattern` **只能用在 `<input>` 上**。官方例子用美国邮编（5 位数字，后面可选一个连字符再加 4 位数字）",
        "关于正则，官方给了很实用的建议：**不必为此深挖正则**。正则本身可以很复杂，而且写在 HTML 属性里、写在 JS 字符串里、写成 JS 正则字面量时语法还有差别——实践中更好的做法是去搜一个现成的、被验证过的正则来用，而不是自己从零拼",
        "pattern 校验失败时浏览器给的默认提示是「Please match the requested format」（请匹配要求的格式）——**这条提示没什么用，因为它没说该怎么改**。好的做法是用 `placeholder` 给用户一个期望格式的示例",
        "有些 input 类型**自带格式校验**：`email` 会确保填的是合法邮箱，`url` 会检查是否以 http 或 https 开头，不必再手写 pattern",
        "给校验结果上色用 `:user-valid` 与 `:user-invalid` 两个伪类，它们只命中「已通过 / 未通过校验」的控件，**并且保证在用户交互之前输入框保持中性外观**。行为细节：一开始两个框都是浏览器默认样式（中性）；用户填了非法值并**点击或 Tab 离开该输入框**（这算完成一次完整交互）后边框变红；此后边框会随内容合法性在红绿之间自动切换",
        "内置校验的边界：它们加起来快、能走很远，但有些事做不到——例如校验「密码」与「确认密码」两个输入是否一致、校验用户名是否已被注册占用；校验提示的样式与文案能改的范围也有限。这些情况需要用 JavaScript + CSS 自建校验（JS 校验在路线后面的课里讲）",
        "**客户端校验不是银弹**：要保证进入系统的数据可靠，服务端也必须有校验。这一侧在路线后面覆盖"
      ],
      "terms": [
        {
          "en": "validation",
          "zh": "校验：给输入设定的约束或规则；违反时给出反馈消息，说明哪里不对与怎么改"
        },
        {
          "en": "required attribute",
          "zh": "required 属性：把字段设为必填；同时应在界面上标明哪些是必填（常见做法是 label 加星号）"
        },
        {
          "en": "minlength / maxlength",
          "zh": "最小 / 最大长度：整数字符数下限与上限；maxlength 直接阻止继续输入，minlength 在提交时校验"
        },
        {
          "en": "constraint validation",
          "zh": "约束校验：浏览器对表单控件规则的统称；关键性质是「只在用户改动过值时才应用」，所以 minlength 不等于 required"
        },
        {
          "en": "min / max",
          "zh": "最小 / 最大值：数值类控件（number、date、time 等）的取值下界与上界"
        },
        {
          "en": "pattern attribute",
          "zh": "pattern 属性：取值为正则表达式的格式校验，只能用在 input 上；失败提示不含修复指引，需配 placeholder 给格式示例"
        },
        {
          "en": "regular expression (regex)",
          "zh": "正则表达式：描述字符串模式的写法；官方建议直接找现成的成熟正则，不必为此深挖"
        },
        {
          "en": ":user-valid / :user-invalid",
          "zh": "两个伪类：分别命中已通过 / 未通过校验的控件，且在用户完成一次完整交互之前保持中性外观"
        },
        {
          "en": "client-side / server-side validation",
          "zh": "客户端 / 服务端校验：前者改善体验但不构成安全边界，后者才是数据完整性的保障，两边都要有"
        }
      ],
      "tasks": [
        "能给一个登录表单加上「邮箱必填 + 密码必填且不少于 8 位」，并说出为什么要额外标星号",
        "解释 minlength 与 required 的差别，并能用「什么都不填直接提交」这个动作验证给别人看",
        "知道 maxlength 与 minlength 的行为差异：一个在输入时就拦，一个在提交时才判",
        "给一个数量输入框加 min / max，并说清这两个属性只对数值类控件有效",
        "需要格式校验时先查有没有现成的 input 类型（email / url / date / number），再考虑 pattern",
        "用 pattern 时同时写 placeholder 给格式示范，别让用户对着「请匹配要求的格式」猜",
        "用 :user-valid / :user-invalid 给输入框做「过了绿、没过红、没动过中性」的三态外观",
        "按官方 Assignment 读 MDN 的客户端表单校验指南（可跳过「用 JavaScript 校验表单」一节，那是后面的课）与 SitePoint 的 HTML 表单与约束校验完全指南（可跳过其中 JS 与 Constraint Validation API、自建校验器两节）",
        "按官方 Assignment 看那条关于表单校验 UX 该做与不该做的讨论串"
      ],
      "quiz": [
        {
          "question": "给一个 textarea 写了 minlength=\"3\"，用户什么都没填就点提交，结果提交成功了。这是 bug 吗？",
          "answer": "**不是，这是规范行为：`minlength` 不隐含 `required`。** 官方引 MDN 的解释是「约束校验只在用户改动过值时才应用」——空着等于没改动，所以不触发。要「必须填、且至少 3 个字符」，就把 `required` 和 `minlength` 一起写上。"
        },
        {
          "question": "maxlength 和 minlength 除了方向相反，行为上还有一个明显差别，是什么？",
          "answer": "**maxlength 在输入阶段就拦，minlength 在提交阶段才判。** 加了 maxlength 后浏览器会直接阻止用户输入超过上限的字符（你根本打不进去）；minlength 则允许你随便填，等到提交时才报错。"
        },
        {
          "question": "为什么官方建议用 pattern 时顺手加一个 placeholder？",
          "answer": "**因为 pattern 校验失败时浏览器的默认提示是「Please match the requested format」（请匹配要求的格式）——它只说「不对」，没说「该长什么样」。** 用 placeholder 给一个期望格式的示例，用户在填之前就知道该怎么写，等于把修复指引前置了。"
        },
        {
          "question": ":user-invalid 与 :invalid 的关键差别在哪？为什么官方选前者做样式？",
          "answer": "**`:user-valid` / `:user-invalid` 会等到用户完成一次完整交互之后才命中**，所以输入框在用户还没动它之前保持中性外观。用 `:invalid` 的话，页面一加载那些空的必填框就立刻是「非法」状态，用户还没开始填就看到一片红——那是制造焦虑而不是给反馈。官方的例子里：填了非法值并点击或 Tab 离开该框之后，边框才变红，此后随内容合法性在红绿之间自动切换。"
        },
        {
          "question": "「确认密码」要和「密码」一致，用 HTML 内置校验能实现吗？为什么？",
          "answer": "**不能，得用 JavaScript 自建校验。** 内置校验的规则都是针对单个控件的（必填、长度、数值范围、正则格式），无法表达「两个控件的值之间有关系」这类跨字段约束；同样做不到的还有「用户名是否已被占用」这种需要问服务器的校验。官方明说这是内置校验的局限之一，做法是用 JS + CSS 自定义（JS 校验在路线后面的课里讲）。"
        }
      ],
      "optional": [],
      "note": "",
      "why": "没有校验的表单等于把数据质量完全交给运气：后端会收到空邮箱、8 位数的邮编、0 件的商品数量，而用户只会看到一句「提交失败」。内置校验的价值在于**几乎零成本就把大部分错误挡在提交之前**，并且反馈是浏览器给的、用户已经熟悉的那一套。同时这一课也划清了它的边界——跨字段一致性与「是否已被占用」这类校验做不到，客户端校验也永远不能替代服务端校验。知道边界在哪，比多记几个属性更重要：否则你会在需要 JS 的地方硬拼一个正则，或者误以为前端拦住了就安全了。",
      "sections": [
        {
          "h": "校验解决什么问题",
          "p": [
            "校验让我们能设定**具体的约束或规则**，决定用户能往输入框里填什么数据。当用户填的内容违反了规则，就会出现一条消息，反馈**哪里不对、以及怎么改**。",
            "在设计良好的表单里，校验是关键成分。它做两件事：**保护我们的后端系统不收错误数据**，以及**让用户与表单打交道的过程尽可能简单直白**（官方的原话是 dead-stupid-simple）。",
            "这一课会过一遍 HTML 表单可用的内置校验，以及怎么用 CSS 给校验结果做样式。"
          ]
        },
        {
          "h": "required：必填，而且要把「必填」说出来",
          "p": [
            "我们经常需要确保某些字段填了才允许提交，例如登录表单里的邮箱和密码。做法是给字段加 `required` 属性。",
            "官方在这里补了一条容易被忽略的要求：**为了保证良好的用户体验、也为了符合无障碍指南，我们应当总是标明哪些字段是必填的。** 常见做法是在必填字段的 label 上加一个星号（*），就像官方示例那样；你也可以再加一句话，把星号的含义讲清楚。",
            "换句话说，`required` 只解决了「不让空着提交」，但用户是在**提交失败之后**才知道这一项必填的——提前标出来才是好体验。"
          ]
        },
        {
          "h": "minlength：以及它为什么不等于 required",
          "p": [
            "有时我们希望用户填入的文本不少于（或不多于）某个长度。真实例子：X（原 Twitter）状态框早年那个 140 字上限，或者用户名字段的最小 / 最大长度限制。",
            "最小长度用 `minlength` 属性，取值是一个整数，表示允许的最小字符数。官方示例里给发帖的 textarea 设了 3 个字符的下限：填不到 3 个字就点发布，会看到校验提示。",
            "这里有一个**反直觉但很重要**的性质：官方专门用一条 tip 指出——**`minlength` 并不隐含 `required`**。你可以在示例里什么都不填直接提交，它照样成功。原因引自 MDN 的 minlength 文档：「**约束校验只在用户改动过值时才应用**」（Constraint validation is only applied when the value is changed by the user）。",
            "所以要表达「必须填、且至少 N 个字符」，两个属性都得写。"
          ]
        },
        {
          "h": "maxlength：这次浏览器直接拦住你的手",
          "p": [
            "最大长度用 `maxlength` 属性，取值是整数，表示允许的最大字符数。",
            "它和 minlength 的行为差别很直观：**加了 maxlength 之后，浏览器会阻止用户输入超过上限的字符**——你根本打不进去，而不是等到提交时才报错。官方建议你在示例里亲手试一下这个区别。"
          ]
        },
        {
          "h": "校验可以叠加",
          "p": [
            "HTML 允许我们给一个表单控件加**任意多个**校验。例如给发帖的 `<textarea>` 同时写上 `minlength` 与 `maxlength`，就得到了「必须填、不少于 3 字、不超过 200 字」这样一条完整的规则。",
            "这给了我们相当大的空间来控制用户能输入什么——而且全部是声明式的属性，不需要写一行 JavaScript。"
          ]
        },
        {
          "h": "min / max：只管数值类控件",
          "p": [
            "就像经常需要控制文本长度一样，很多场景需要控制**数值类控件能填的取值范围**。这靠 `min` 与 `max` 两个属性，分别设定下界与上界。",
            "有一个限制要记住：**min 与 max 只对数值类的表单控件有效**，例如 number、date、time 这些输入类型。完整的支持元素清单可以在 MDN 的 `max` 属性文档里查到（本站在「本课外部资料」里接了中文版的对应小节）。",
            "真实用例：商品订购表单里限制购买数量、订机票时选择乘客人数。官方两个示例分别演示了「数量填 0 提交」和「乘客填 7 人提交」时会看到什么。"
          ]
        },
        {
          "h": "pattern：用正则管格式，以及官方的实用建议",
          "p": [
            "为了确保拿到正确的信息，我们经常需要让数据**符合某个特定格式**。真实应用包括检查密码、信用卡号或邮编的格式是否正确。",
            "做法是给控件加 `pattern` 属性，取值是一个**正则表达式**（regex）。官方的例子用美国邮编：5 位数字，后面可选一个连字符再加 4 位数字。",
            "关于正则，官方给了一条很实在的建议：**你其实不必为这件事深挖正则。** 正则能复杂到什么程度不用多说，更要命的是同一件事写在 HTML 属性里、写在 JavaScript 字符串里、写成 JavaScript 正则字面量时语法还有差别——所以实践中**更好的做法是去搜一个针对你的需求的、已经确立的正则**，而不是自己从头拼一个。",
            "还有一个体验问题：填了格式不对的邮编并提交，浏览器会显示「Please match the requested format」（请匹配要求的格式）。**这条提示帮助有限，因为它没有说明该怎么修。** 好的做法是用 `placeholder` 属性给用户展示一个期望格式的示例。",
            "两个补充事实：**`pattern` 只能用在 `<input>` 元素上**；而且有些 input 类型**本身就带格式校验**——email 输入框会确保填的是合法邮箱，url 输入框会检查是否以 http 或 https 开头，这些都不需要你再手写 pattern。"
          ]
        },
        {
          "h": "用 CSS 给校验结果上色：:user-valid 与 :user-invalid",
          "p": [
            "`:user-valid` 与 `:user-invalid` 这两个伪类，让我们能命中「已通过校验」与「未通过校验」的表单控件，**同时确保输入框在用户交互之前保持中性外观**。",
            "官方用邮箱与个人网站两个字段演示完整过程：",
            "- **一开始**，两个字段都是浏览器默认样式，代表中性状态——因为用户还没和它们交互过。我们先给「合法」的输入设一个绿色边框。",
            "- 当用户填入一个非法值，并**点击别处或按 Tab 离开这个输入框**（这构成一次完整的用户交互）之后，边框切换成红色。",
            "- **从那以后**，边框会随着内容的合法性在绿与红之间自动变化。官方的练习是：填一个格式错误的邮箱或网址、点别处触发校验，然后在「格式正确」与「格式错误」之间来回改，观察边框跟着变。",
            "这就是为什么官方选这两个伪类而不是 `:valid` / `:invalid`：后者在页面刚加载、用户还没动笔时就会把空的必填框判为非法，一屏红框只会制造压力。"
          ]
        },
        {
          "h": "内置校验的边界，以及为什么服务端还得再校验一遍",
          "p": [
            "内置校验能带你走很远，而且加起来又快又简单。但它们有自己的局限。",
            "**有些事内置校验做不到。** 例如校验「密码」与「确认密码」两个输入的值是否相同，或者校验一个用户名是否已经被别人占用——前者是跨字段的关系，后者需要问服务器，两者都超出单个控件属性能表达的范围。此外，**校验提示的样式与其中的内容能改到什么程度也有限**。",
            "这些情况下就需要发挥创意，用 JavaScript 与 CSS 自建校验。怎么用 JavaScript 做校验，路线后面的课会讲。",
            "最后一条同样重要：**客户端校验不是确保用户填入正确数据的银弹。** 要保证进入系统的任何用户数据的完整性，我们还应当有服务端校验。这一侧的内容在路线后面覆盖。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "html",
          "code": "<form action=\"example.com/signup\" method=\"post\">\n\n  <!-- required：必填。label 上的星号是给用户的提示，required 是给浏览器的规则，两件事都要做 -->\n  <label for=\"email\">Email: *</label>\n  <input type=\"email\" id=\"email\" name=\"email\" required>\n\n  <!-- 长度校验叠加：必须填 + 至少 3 字 + 最多 200 字（maxlength 在输入阶段就拦） -->\n  <label for=\"post\">Post: *</label>\n  <textarea id=\"post\" name=\"post\" required minlength=\"3\" maxlength=\"200\"></textarea>\n\n  <!-- 数值范围：只对数值类控件有效 -->\n  <label for=\"qty\">Quantity:</label>\n  <input type=\"number\" id=\"qty\" name=\"quantity\" min=\"1\" max=\"6\" value=\"1\">\n\n  <!-- pattern：只能用正则；配 placeholder 给出格式示范，弥补默认提示不含修复指引 -->\n  <label for=\"zip\">Zip Code:</label>\n  <input type=\"text\" id=\"zip\" name=\"zip\" pattern=\"[0-9]{5}(-[0-9]{4})?\" placeholder=\"12345 或 12345-6789\">\n\n  <!-- email / url 自带格式校验，不必再写 pattern -->\n  <label for=\"site\">Website:</label>\n  <input type=\"url\" id=\"site\" name=\"website\" placeholder=\"https://example.com\">\n\n  <button type=\"submit\">Sign up</button>\n</form>",
          "note": "代码按官方正文逐个演示的属性（required、minlength / maxlength、min / max、pattern + placeholder、email 与 url 的自带校验）合并成一个完整表单，便于对照。zip 的正则对应官方描述的「5 位数字，后面可选一个连字符再加 4 位数字」。"
        },
        {
          "lang": "css",
          "code": "/* 三态外观：没动过 = 中性（浏览器默认），过了 = 绿，没过 = 红。\n   关键是用 :user-valid / :user-invalid —— 它们只在用户完成一次完整交互后才命中，\n   页面刚加载时不会把空的必填框判红。 */\ninput:user-valid,\ntextarea:user-valid {\n  border: 2px solid green;\n}\n\ninput:user-invalid,\ntextarea:user-invalid {\n  border: 2px solid red;\n}\n\n/* 必填字段的星号：把「必填」在提交之前就告诉用户（无障碍与体验都要求标明） */\nlabel .req { color: crimson; }",
          "note": "对应官方「Styling validations」一节的演示：先给合法输入设绿色边框；用户填入非法值并点击或 Tab 离开该框（一次完整交互）后边框变红；此后随内容合法性自动在红绿之间切换。"
        }
      ],
      "pitfalls": [
        {
          "title": "以为写了 minlength 就等于必填",
          "text": "不是。官方专门用一条 tip 提醒：minlength 不隐含 required——什么都不填直接提交会成功，因为按 MDN 的说法「约束校验只在用户改动过值时才应用」。要「必须填且不少于 N 字」，required 与 minlength 一起写。"
        },
        {
          "title": "只加 required，不在界面上标明哪些是必填",
          "text": "required 只负责拦提交，用户要到提交失败才知道这一项必填。官方的要求是为了体验与无障碍都应当总是标明必填字段：常见做法是 label 上加星号，必要时再补一句星号含义的说明。"
        },
        {
          "title": "给文本框写 min / max，指望它管字符数",
          "text": "min 与 max 是数值范围校验，只对数值类控件（number、date、time 这类）有效；管文本长度的是 minlength 与 maxlength。两套属性各管一边，写错的那一套不会报错、只会静默不起作用。"
        },
        {
          "title": "用 pattern 却不给格式示范，用户对着「请匹配要求的格式」猜",
          "text": "pattern 校验失败时浏览器的默认提示不含修复指引。配一个 placeholder 展示期望格式（例如邮编写「12345 或 12345-6789」），把「该怎么填」前置到用户动手之前。另外记住 pattern 只能用在 input 上，textarea 用不了。"
        },
        {
          "title": "自己从零拼一个复杂正则",
          "text": "官方的建议很直接：不必为此深挖正则。同一模式写在 HTML 属性里、JS 字符串里、JS 正则字面量里语法还有差别，自己拼很容易出错。实践中去搜一个针对该需求的、已被广泛使用的正则更稳。"
        },
        {
          "title": "用 :invalid / :valid 做样式，页面一加载就一片红",
          "text": "这两个伪类不管用户有没有交互：空的必填框在加载瞬间就是 :invalid，于是用户还没开始填就看到满屏红框。改用 :user-valid / :user-invalid——它们保证在用户完成一次完整交互（填入内容后点击或 Tab 离开）之前，输入框保持中性外观。"
        },
        {
          "title": "以为前端校验过了，数据就安全了",
          "text": "客户端校验不是银弹：它可以被绕过（禁用 JS、直接构造请求），也管不到跨字段一致性与「是否已被占用」这类需要问服务器的规则。官方明确要求服务端也必须有校验，那一侧在路线后面覆盖。"
        }
      ],
      "official": {
        "assignment": [
          "阅读并跟着做 MDN 的客户端表单校验指南（Client-Side Form Validation Guide）。其中「用 JavaScript 校验表单」那一节可以跳过——后面的课会讲。",
          "通读 SitePoint 的「HTML 表单与约束校验完全指南」。其中「JavaScript 与 Constraint Validation API」和「创建自定义表单校验器」两节可以跳过。",
          "看一看这条 X 讨论串，内容是表单校验用户体验的该做与不该做（本站接的是官方给出的 threadreaderapp 镜像地址）。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/forms/form_validations.md（注意官方文件名是复数 validations，与本站 slug form-validation 不同形；本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "acf051a6656bb48d9784dc111f6b15c1fe68fea79628120c2a5f8e76ee27a9f8",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-sign-up-form",
      "title": "Project: Sign-up Form",
      "zh": "项目：注册表单",
      "group": 2,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-sign-up-form",
      "summary": "照着官方给的一张设计图，从零做一个注册表单页面：左边是一张大幅背景图加 logo 区，右边是表单与页脚。这个项目把前两课的零件全用上——form 容器与 method、label 与 input 的 for/id 配对、每个控件的 name、合适的 type（email / password / tel / text）、按钮的 type，以及这一课的校验与三态样式（`:user-invalid` 红框、`:focus` 蓝框加轻微 box-shadow）。官方给了几个具体色值与三条明确边界（不必做移动端、密码一致性校验需要 JS 所以先各字段单独校验、先搭结构再逐块推进）。",
      "guide": "以下是官方原课要求的中文化梳理与拆解。这是 Project 课：**本站不提供成品代码**，正文只把官方的每一步要求讲清楚、给出推进顺序与验收清单，代码全部由你自己写。官方的 Assignment 分三步（准备与规划 / 收集素材 / 若干提示），本站按同样的顺序中文化，并把散在提示里的具体值（按钮色 `#596D48`、输入框默认边框色 `#E5E7EB`、logo 区那层深色半透明底）集中列出来，方便你边做边对照。设计图需要你自己下载（官方给了全分辨率地址，在「官方任务」里），布局细节以那张图为准——本站不复述图里的具体字段与栏宽，避免你用二手描述代替一手设计稿。",
      "understand": [
        "这个项目的目的是练手前几课刚吸收的内容：HTML 表单的全部零件（form / label / input / textarea / select / button 及各自的属性）+ 这一课的校验与校验样式",
        "推进顺序官方给了建议：**先搭出页面的结构骨架，再逐个区块推进**（scaffold first, then tackle the various sections one by one）——不要一上来就抠某一块的像素",
        "第一步是准备：建 git 仓库（不熟就回看之前的项目）、先建 HTML 与 CSS 文件并放点占位内容确认两者正确关联、下载全分辨率设计图并想清楚 HTML 文档该怎么布局",
        "第二步是收集素材：设计图里有一张大幅背景图，自己找一张想要的图下载（官方用的那张在 Unsplash 上，也欢迎自选）——**记得给图片作者署名**；logo 区用一款外部字体（官方用的是 Norse Bold，也可以换成任何你喜欢的）；侧栏里那个 Odin logo 官方也给了下载地址",
        "logo 背后那块区域的实现要点：它是一个 **div，带深色但半透明的背景色**。这层半透明底的作用是**提升文字在繁忙背景图上的可读性**——不是装饰，是为了让 ODIN 这几个字能被看清",
        "官方给了具体色值：Create Account 按钮的颜色是 `#596D48`，选它的理由是**与背景图里的色调接近**；输入框默认有一条很浅的边框 `#E5E7EB`",
        "输入框有两个状态变化要做：① **密码框在密码非法时应显示红色边框**——用上一课学的 `:user-invalid` 伪类就能处理；② **被选中（聚焦）的输入框应有蓝色边框加一点轻微的 box-shadow**——用更早学过的 `:focus` 伪类",
        "官方明确划了两条边界：**不必让项目在移动端好看**（响应式设计在路线后面才讲）；**「两个密码框是否一致」的校验需要 JavaScript**，而用 JS 校验表单是后面课的内容，所以**现在只需对各字段分别做校验**",
        "本站红线：不提供成品代码。结构、样式、状态变化都由你自己实现——遇到卡住先看本站前两课的讲解与「本课外部资料」里的中文导读，而不是找现成答案"
      ],
      "terms": [
        {
          "en": "scaffolding",
          "zh": "搭骨架：先把页面的结构区块摆出来（不追求样式），再逐块细化的推进方式，官方在本项目里明确推荐"
        },
        {
          "en": "background-image",
          "zh": "背景图像：本项目左侧那张大幅图；官方提示它是设计里的主要视觉块，素材需自己找并署名"
        },
        {
          "en": "semi-transparent background",
          "zh": "半透明背景：logo 区那层深色但透明的底，作用是提升文字在繁忙背景图上的可读性"
        },
        {
          "en": ":user-invalid",
          "zh": "伪类：命中「用户交互过后仍未通过校验」的控件，本项目用它给非法密码框加红色边框"
        },
        {
          "en": ":focus",
          "zh": "伪类：命中当前聚焦的控件，本项目用它给选中输入框加蓝色边框与轻微 box-shadow"
        },
        {
          "en": "external font",
          "zh": "外部字体：logo 区用的 Norse Bold（或你自选的字体）；不是系统自带字体，需要引入"
        }
      ],
      "tasks": [
        "建好 git 仓库，并建 HTML 与 CSS 两个文件、放占位内容确认关联正确（官方 Step 1）",
        "下载官方给的全分辨率设计图，看着它先想清楚整页要怎么分块、HTML 文档结构怎么搭（官方 Step 1）",
        "收集素材：一张大幅背景图（官方那张在 Unsplash，也可自选，**记得给作者署名**）、一款 logo 用的外部字体（官方用 Norse Bold）、侧栏的 Odin logo（官方 Step 2）",
        "先搭结构骨架，再逐个区块推进——不要一上来抠像素（官方 Step 3 第 1 条）",
        "做出 logo 区那层深色半透明底，确认 ODIN 文字在繁忙背景图上清晰可读（官方 Step 3 第 2 条）",
        "Create Account 按钮用 `#596D48`；输入框默认边框用很浅的 `#E5E7EB`（官方 Step 3 第 3、4 条）",
        "用 `:user-invalid` 让非法密码框显示红色边框；用 `:focus` 让聚焦的输入框显示蓝色边框 + 轻微 box-shadow（官方 Step 3 第 4、5 条）",
        "表单本体按前两课的标准写：每个控件都有配对的 label（for 与 id 同值）与 name；type 选合适的（邮箱用 email、密码用 password 等）；提交按钮显式写 type=\"submit\"，其他按钮显式写 type=\"button\"",
        "对各字段分别做校验（必填 / 长度 / 格式按需），**不做**「两次密码是否一致」的校验——那需要 JavaScript，官方明确留到后面的课（官方 Step 3 第 7 条）",
        "不必做移动端适配（官方 Step 3 第 6 条：响应式在路线后面才讲）",
        "完成后提交代码、并按本站「我的学习进度」勾选；卡住时先看本站讲解与外部资料的中文导读，不要直接找成品"
      ],
      "quiz": [
        {
          "question": "官方建议的推进顺序是什么？为什么不直接从最难看的那块开始做？",
          "answer": "**先搭出页面的结构骨架，再逐个区块推进**（官方 Step 3 第 1 条：it is wise to begin by scaffolding out the structure of the page, and then tackle the various sections one by one）。先有骨架，你能尽早确认分块与文档结构是否合理；反过来先抠某一块的像素，往往在结构变化时白做。"
        },
        {
          "question": "logo 背后那层深色底，官方是怎么描述的？它的作用是什么？",
          "answer": "**它是一个 div，带深色但半透明的背景色。** 作用是**提升文字在繁忙背景图上的可读性**——背景图内容杂乱时，纯文字很难看清，垫一层半透明深色底就把对比度拉回来了。注意它是半透明而不是不透明：要透出背景图，只是压暗。"
        },
        {
          "question": "「密码非法时输入框变红」和「聚焦时输入框变蓝加阴影」分别用哪个伪类？为什么前者不用 :invalid？",
          "answer": "**红色边框用 `:user-invalid`，蓝色边框加轻微 box-shadow 用 `:focus`**（官方 Step 3 第 4、5 条分别点名了这两个伪类）。不用 `:invalid` 的原因在上一课：它不管用户有没有交互，页面一加载空的必填框就是非法状态，会让用户还没开始填就看到红框；`:user-invalid` 只在用户完成一次完整交互后才命中。"
        },
        {
          "question": "设计图里有「密码」和「确认密码」两个框。这个项目要做「两次输入是否一致」的校验吗？",
          "answer": "**不做。** 官方 Step 3 第 7 条明确说明：校验两个密码字段是否一致需要 JavaScript，而用 JS 校验表单是后面的课的内容——**现在只需对各字段分别做校验**。（内置校验的规则都是针对单个控件的，表达不了「两个控件的值之间有关系」这种跨字段约束。）"
        }
      ],
      "optional": [],
      "note": "本课为 Project 红线课：examples 为空数组，本站不提供成品代码（页面结构、左图右表单的两栏布局、logo 区的半透明底、输入框的 :user-invalid 与 :focus 两个状态样式、各字段的校验属性，全部由你自己写）；正文只提供官方要求的中文化、推进顺序拆解与验收清单。官方明确的两条边界照办：不必做移动端适配；不做「两次密码是否一致」的校验（需要 JavaScript，后面的课才讲）。",
      "why": "前两个项目（Landing Page、Recipes）练的是「照设计稿排版」，这一个多了一层：**表单是有行为的界面**。同样的视觉稿，字段少写一个 name 就静默丢数据、按钮漏写 type 就误提交、label 不配对就用不了键盘和读屏软件——这些错误在设计稿上完全看不出来，只有真正去填一遍才会暴露。所以这个项目的价值不在「做得像」，而在于逼你把前两课那些属性用对：type 选得合不合适、校验规则加没加、`:user-invalid` 与 `:focus` 的状态区分做没做。做完之后，「一张注册页」对你就不再是一张图，而是一组有明确契约的控件。",
      "sections": [
        {
          "h": "这是个什么项目",
          "p": [
            "官方的定位很直接：这个项目是给你一个机会，**把过去几课吸收的新东西练一遍**。这次做的是一张**注册表单**（sign-up form），服务于一个假想的服务。",
            "你会用到的是刚学完的两课：表单基础（form 容器与它的 action / method、各类控件、label 的 for 与 id 配对、name、按钮的三种 type、fieldset 与 legend）与表单校验（required / minlength / maxlength / min / max / pattern，以及 `:user-valid` / `:user-invalid` 的样式）。",
            "交付形态是一个**照着官方设计图还原**的静态页面：左侧一张大幅背景图与 logo 区，右侧表单与页脚。"
          ]
        },
        {
          "h": "第一步：建仓库、建文件、下载设计图（官方 Step 1）",
          "p": [
            "官方 Step 1「Set up and planning」三条，逐条中文化：",
            "1. **建好你的 git 仓库**（如果需要复习，回看之前的项目怎么做的）。",
            "2. **建好 HTML 与 CSS 文件，先放一些占位内容**——目的只是确认你把两边正确关联起来了（样式真的能作用到页面上）。",
            "3. **下载一份全分辨率的设计图**（官方在 Assignment 里给了地址），并对**你需要怎么在 HTML 文档里布局**形成一个大致想法。",
            "第 3 条是这一步的重点：不要下载完就开始写代码。先看着图问自己几件事——整页分成几大块？每块在文档里是什么容器？左图右表单这种两栏用什么实现（你刚学完 flexbox 与 grid，两种都能做）？文字、输入框、按钮各自的层级关系是什么？",
            "**布局细节以你下载的那张图为准。** 本站刻意不复述图里的具体字段名、栏宽与间距——用二手描述代替一手设计稿，是这个项目最常见的走偏方式。"
          ]
        },
        {
          "h": "第二步：收集素材（官方 Step 2）",
          "p": [
            "官方 Step 2「Gather assets」三条：",
            "1. **设计图里有一张大幅背景图**，所以去找一张你想用的图下载。设计图里那一张可以在 Unsplash 上找到（官方给了链接），但你完全可以选自己的图。**务必给你用的图片的作者署名（credit the creator）。**",
            "2. **给 logo 区挑一款外部字体。** 官方用的是 Norse Bold（给了下载页链接），你也可以用任何你喜欢的字体。",
            "3. **图片侧栏里那个 Odin logo**，官方也给了下载地址，直接用即可。",
            "两个实操提醒：背景图会占据左栏整块，**文件体积别太大**（一张几 MB 的图会让本地打开都明显变慢）；署名不是可选礼节——把它写进页面或仓库的 README 都行，但要写。"
          ]
        },
        {
          "h": "第三步：官方给的七条提示（逐条中文化）",
          "p": [
            "官方 Step 3「Some tips!」共七条，逐条中文化如下——这些提示里藏着本项目的全部具体数值与边界：",
            "1. **怎么下手基本由你决定，但明智的做法是先把页面结构骨架搭出来，然后逐个区块解决。**",
            "2. **「ODIN」logo 背后那块区域是一个 div，带深色但半透明的背景色。这样做是为了提升文字在繁忙背景图上的可读性。**",
            "3. **我们为 Create Account 按钮选的颜色与背景图里的色调接近。具体是 `#596D48`。**",
            "4. **输入框默认有一条很浅的边框（`#E5E7EB`），但我们准备了两种变化。第一种：密码框在包含非法密码时应显示红色边框——用你上一课学的 `:user-invalid` 伪类就能处理。**",
            "5. **另一种变化是被选中的输入框：它应有蓝色边框和一点轻微的 box-shadow。这可以用你在更早的课里学过的 `:focus` 伪类做到。**",
            "6. **不必担心让项目在移动端好看。响应式设计要到路线后面才讲。**",
            "7. **校验两个密码字段是否彼此一致需要 JavaScript。用 JavaScript 校验表单会在后面的课里讲；现在只需对各字段分别做校验。**"
          ]
        },
        {
          "h": "把提示变成实现要点",
          "p": [
            "上面七条里，有三条需要一点转译才能落到代码上：",
            "**半透明底怎么调。** 要点是「深色 + 半透明」两个条件同时成立：不透明会让背景图断掉一块，太透明又压不住图、文字还是看不清。做法上有几种途径（带 alpha 的颜色写法、或在色值里直接给透明度），你自己选一种，验收标准只有一条——**ODIN 这几个字在背景图最亮的那块区域上仍然清晰可读**。",
            "**`:user-invalid` 与 `:focus` 会不会打架。** 会，而且这是本项目最值得你想清楚的一处样式问题：一个密码框可能同时「聚焦中」和「内容非法」。你需要决定这种情况下谁赢（官方的描述里两者是并列的两种变化，没有规定优先级），并确保**用户能分辨出「我正在改这个非法字段」和「这个字段非法」两种状态**。别忘了上一课的关键性质：`:user-invalid` 只在用户完成一次完整交互后才命中，所以刚加载时不会一屏红框。",
            "**「对各字段分别做校验」是什么意思。** 意思是：每个字段自己该必填就 `required`、该限长度就 `minlength` / `maxlength`、邮箱用 `type=\"email\"`（自带格式校验）——但**不要**尝试写「确认密码必须等于密码」这条规则，那需要 JavaScript。"
          ]
        },
        {
          "h": "验收清单（做完逐条自查）",
          "p": [
            "**结构与前两课的标准**",
            "- 每个输入控件都有配对的 `<label>`（label 的 `for` 与控件的 `id` 取同一个值），点击 label 能聚焦到对应控件。",
            "- 每个控件都有 `name` 属性（少了就会在提交时被静默忽略）。",
            "- `type` 选得合适：邮箱用 `email`、密码用 `password`、电话用 `tel`、纯文本用 `text`。",
            "- 提交按钮显式写 `type=\"submit\"`；表单内任何**不是**用来提交的按钮显式写 `type=\"button\"`（默认值是 submit，漏写会误提交）。",
            "- `<form>` 有 `method`（注册这类「改变服务器状态」的动作用 POST）；`action` 在这个静态项目里可以指向占位地址。",
            "**视觉与素材**",
            "- 左侧大幅背景图到位，且**给图片作者署了名**。",
            "- logo 区用了外部字体，且 logo 背后那层深色半透明底让文字在背景图上清晰可读。",
            "- Create Account 按钮颜色为 `#596D48`；输入框默认边框为浅色 `#E5E7EB`。",
            "**状态与校验**",
            "- 密码非法时该输入框显示红色边框（`:user-invalid`），且页面刚加载时不会满屏红。",
            "- 聚焦的输入框显示蓝色边框 + 轻微 box-shadow（`:focus`）；同时聚焦且非法时状态可分辨。",
            "- 各字段按需要加了校验（必填 / 长度 / 类型自带格式校验），且**没有**实现「两次密码一致」的跨字段校验。",
            "**边界（官方明确要求不做的）**",
            "- 没有为移动端做适配（这不是遗漏，是官方划的边界）。",
            "- 没有从本站或别处复制成品代码——本站本项目不提供成品代码。"
          ]
        },
        {
          "h": "常见卡点与提示（不含成品代码）",
          "p": [
            "**两栏布局选哪个。** 左图右表单这种「一块固定比例 + 一块自适应」的结构，flexbox 与 grid 都能做。选你更熟的那个即可——本项目的考核点不在布局技术选型，而在表单零件用得对不对。",
            "**左栏要占满整个视口高度怎么办。** 这是个高度问题而不是布局问题：想想「视口高度的单位」那一课里的 vh，以及父元素高度没有显式给出时百分比高度会怎么表现。",
            "**背景图被拉伸或裁掉了。** 回忆背景图像相关属性：图怎么铺（重复 / 不重复）、怎么缩放（contain 与 cover 的差别）、铺在哪个位置。设计图里那张是铺满整块左栏的，想想这三个取值分别该选哪个。",
            "**输入框看起来「样式改不动」。** 上一课讲过原因：浏览器对表单控件有自己的默认样式，要跨浏览器一致就得自己覆盖；而且不同浏览器对输入框的默认外观（包括内边距与边框）处理不一样。先把你想要的边框、内边距、字号显式写出来，别依赖默认值。",
            "**红色边框「一加载就出现」。** 那是用了 `:invalid` 而不是 `:user-invalid`——回到上一课的那一节，官方演示的正是这个区别。",
            "**想让「确认密码」实时比对。** 打住：官方第 7 条明确说这需要 JavaScript，本课不做。把它记进你的待办，等 JS 校验那一课再回来加。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "控件漏写 name，表单提交后数据静默消失",
          "text": "本项目最容易犯、也最难发现的错误：页面看着完全正常，label 也配了，但漏了 name 的字段在提交时会被直接忽略（上一课的硬规则）。自查办法是逐个控件问一句「后端要靠什么名字拿到这个值」。"
        },
        {
          "title": "表单内的非提交按钮漏写 type，一点就误提交",
          "text": "`<button>` 的 type 默认值是 submit。设计图里如果还有别的按钮（例如页脚那些链接式的按钮），要么用 `<a>`，要么显式写 `type=\"button\"`，否则点一下就会发出一次意外提交。"
        },
        {
          "title": "用 placeholder 代替 label，或者 label 不用 for/id 配对",
          "text": "两种都会让表单变难用：占位文字一输入就消失、之后看不出这框是干什么的；label 只是视觉上挨着而不构成关联，则点击 label 不会聚焦、读屏软件也播不出字段名。设计图上看着像「只有占位文字」的字段，也请配上真实 label（可以用视觉隐藏的做法，但关联必须在）。"
        },
        {
          "title": "把 logo 区那层底做成不透明",
          "text": "官方的描述是「深色但半透明」，目的是提升文字在繁忙背景图上的可读性。做成不透明会把背景图断掉一块，视觉上变成一个色块；太透明又压不住图。验收标准只有一条：ODIN 文字在背景图最亮的区域上仍清晰可读。"
        },
        {
          "title": "用 :invalid 做红框，页面一加载就满屏红",
          "text": "`:invalid` 不管用户有没有交互，空的必填框在加载瞬间就命中，于是用户还没开始填就看到一片红。改用 `:user-invalid`——它只在用户完成一次完整交互（填了内容后点击或 Tab 离开）之后才命中。"
        },
        {
          "title": "硬做「两次密码一致」校验，或硬做移动端适配",
          "text": "两件事官方都明确划到边界外：跨字段一致性校验需要 JavaScript（后面的课才讲，现在只对各字段分别校验）；响应式设计也在路线后面。把它们记进待办，别在本项目里绕路实现——尤其别为了「密码一致」去写一段自己也没学过的脚本。"
        },
        {
          "title": "拿本站或网上的成品代码交差",
          "text": "本站对本项目不提供成品代码，这是刻意的设计：表单的错误（漏 name、漏 type、label 不配对）在成品代码里是看不见的，只有你自己写一遍、再填一遍才会撞到。照抄不仅学不到东西，还会把上面那几条坑原样带进后面的项目。"
        }
      ],
      "official": {
        "assignment": [
          "第一步 · 准备与规划：① 建好你的 git 仓库（需要复习就回看之前的项目）；② 建好 HTML 与 CSS 文件并放些占位内容，确认两边正确关联；③ 下载全分辨率的设计图（官方给了地址），对怎么在 HTML 文档里布局形成大致想法。",
          "第二步 · 收集素材：① 设计里有一张大幅背景图，去找一张你想用的下载——设计里那张在 Unsplash 上（官方给了链接），也可以自选，**务必给图片作者署名**；② 给 logo 区挑一款外部字体（官方用 Norse Bold，也给了链接，你可以用任何喜欢的字体）；③ 图片侧栏用的 Odin logo 官方也给了下载地址。",
          "第三步 · 若干提示：① 怎么下手由你，但明智的做法是先搭结构骨架、再逐个区块解决；② ODIN logo 背后那块是一个带深色**半透明**背景色的 div，用来提升文字在繁忙背景图上的可读性；③ Create Account 按钮的颜色与背景图色调接近，具体是 #596D48；④ 输入框默认有很浅的边框 #E5E7EB，另有两种变化——密码非法时红色边框（用上一课的 :user-invalid）；⑤ 另一种是被选中的输入框：蓝色边框 + 轻微 box-shadow（用更早学过的 :focus）；⑥ 不必让项目在移动端好看，响应式在路线后面才讲；⑦ 校验两个密码字段是否一致需要 JavaScript（后面的课讲），现在只对各字段分别做校验。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/forms/project_sign_up_form.md（注意官方文件名带 project_ 前缀、与本站 slug sign-up-form 不同形；同目录另有 project_sign_up_form/ 子目录存放设计图；本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "c4c5c5877d9845b6ecb274b6cc00564d3fbe19cfaf0b05e3d61512fce2e1ceb5",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-introduction-to-grid",
      "title": "Introduction to Grid",
      "zh": "Grid 布局导读",
      "group": 3,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-introduction-to-grid",
      "summary": "World 2 最后一个章节的导读课：先快速回看 Flexbox（一维布局、两根轴、对齐与放大缩小），再正面介绍 CSS Grid——一个从报纸杂志的网格排版里获得灵感的两维布局系统，1996 年就有了想法、2017 年才进入全部主流浏览器。本课没有作业（官方原话是「惊喜！」），任务是建立心智地图：Grid 是什么、它和 Flex 差在哪、两者怎么分工。章节的终点是用 Grid 重建一个管理仪表盘项目。",
      "guide": "以下是官方原课的中文化梳理。这是纯导读课：官方没有布置作业，也没有外部资料，只有两件事——带你回看一遍 Foundations 学过的 Flexbox，再告诉你 Grid 是什么、为什么值得单开一个章节。不必急着记属性；把「Flexbox 是一维工具、Grid 是两维工具、两者是分工不是替代」这张地图装进脑子，后面四课（创建网格 → 定位元素 → 高级属性 → 两者搭配）学起来会顺很多。",
      "understand": [
        "本章的路线与终点：创建网格 → 定位网格项目 → 高级属性 → Flexbox 与 Grid 的深度对比，最终用 Grid 完成管理仪表盘（Admin Dashboard）项目",
        "Flexbox 复习要点：沿两根轴（主轴与交叉轴）摆放项目、设置对齐、用 grow / shrink 让项目伸缩——一维布局不靠浮动或 hack 就能排好",
        "两维布局用 flex-wrap 也能凑合（行换行、列换列），但「行列联动」往往不容易——卡片布局练习的痛苦你经历过；同样的两维布局，CSS Grid 做起来容易得多",
        "Grid 的想法很老：CSS 的共同创造者 Bert Bos 博士 1996 年就开始研究这个布局模型，灵感来自报纸与杂志的网格排版；2017 年才被全部主流浏览器支持",
        "Grid 以「两维摆放项目容易」著称，但一维布局同样能做；一个实际好处是可以先只摆一行项目，之后再按需加行",
        "Flex 与 Grid 相似处很多（父容器 + 子项目、对齐与定位的属性名相近），差异也不少；且两者的能力边界随模块更新在变——gap 曾只属于 Grid，现在 Flex 也支持了，看旧资料要留意发布时间",
        "Grid 不是来替代 Flexbox 的：两者各有用武之地，还可以配对使用——这正是本章最后一课的内容"
      ],
      "terms": [
        {
          "en": "CSS Grid",
          "zh": "CSS 网格布局：两维布局系统，一次管理行与列；2017 年进入全部主流浏览器"
        },
        {
          "en": "two-dimensional layout",
          "zh": "两维布局：同时控制行与列两个方向的布局；对应地，Flexbox 是一维的（一次一行或一列）"
        },
        {
          "en": "flex-wrap",
          "zh": "Flexbox 的换行属性：能把项目折到下一行，可以凑合两维需求，但行列联动不如 Grid 直接"
        },
        {
          "en": "gap",
          "zh": "行与列之间的间距属性：曾只属于 Grid，如今 Flexbox 也支持——两个模块能力边界演进的例子"
        }
      ],
      "tasks": [
        "通读本站中文讲解：Flexbox 回看、两维布局的痛点、Grid 的来历与定位",
        "如果 Flexbox 已经生疏，按官方建议先回 Foundations 的 Flexbox 课（Introduction to Flexbox 起五课）热身再继续",
        "记住本课的核心结论：Grid 是工具箱里的新工具，不是 Flexbox 的替代品——「什么时候用哪个」在本章最后一课展开"
      ],
      "quiz": [
        {
          "question": "Flexbox 与 Grid 各自适合什么样的布局？各用一句话概括。",
          "answer": "Flexbox 是一维布局工具：把一行（或一列）项目沿主轴摆好，靠 grow / shrink / basis 这类弹性规则分配空间。Grid 是两维布局工具：先定义行与列的轨道，再把项目放进格子——行与列一次管住。用 Flexbox 做「行列联动」要靠 flex-wrap 绕路，用 Grid 则是正面解决。"
        },
        {
          "question": "为什么官方提醒看旧的 Flex vs Grid 资料时要留意时间？",
          "answer": "因为两个模块的能力边界一直在变：gap 属性曾只在 Grid 里可用，如今 Flexbox 也支持了。旧文章里「X 只有 Grid 能做」这类绝对化结论可能已经过时——差异本身会随模块更新而改变。"
        },
        {
          "question": "这一课的 Assignment 写着「惊喜：没有作业！」——那本课该做什么？",
          "answer": "官方确实没留作业，本课是纯导读。官方给的动作是「继续往下学」：接下来几课内容会多起来。唯一建议的准备工作是——如果 Flexbox 完全生疏了，先回 Foundations 把 Flex 课过一遍，因为本章最后一课会把两者放在一起正面对比。"
        }
      ],
      "optional": [],
      "note": "本课是全站第三个零外部资料课（前两个是第 26 课 Introduction to Flexbox 与第 32 课 Installing Node.js）：官方原文的外链全部是 TOP 自有课页（四条 Flexbox 复习课链接）、课内 CodePen 演示与练习配图，按本站既有口径均不收入资料清单；Assignment 为官方「Surprise! No assignment!」的无作业声明。",
      "why": "这是 World 2 最后一个章节的入口。学 Flexbox 时你多半尝过「卡片要排成整齐的网格，却要靠一层层包裹和取巧才能对齐」的挫败——Grid 就是为这类两维需求发明的：先画好行列，再往格子里放东西，布局与内容从此解耦。本课不教任何属性，它负责把三件事说清：Grid 从哪来（报纸杂志的网格）、它和 Flex 是什么关系（分工，不是替代）、这个章节要带你去哪（管理仪表盘项目）。地图装好，后面四课的密度就不难消化。",
      "sections": [
        {
          "h": "本章去哪：从一维到两维，终点是一个仪表盘",
          "p": [
            "官方开场：接下来几课会系统讲 CSS Grid，让页面布局变得容易得多。路线是先快速回看一遍 Flexbox（还记得 Flexbox 吧！？），然后进入 Grid。",
            "后面几课的安排是：**创建一个网格 → 定位网格项目 → 学一批高级属性 → 再深入对比 Flexbox 与 Grid**。",
            "最终目标：用 Grid 构建一个**管理仪表盘（dashboard）项目**——也就是本章的 Project 课。整章的知识都会在那个项目里汇合。"
          ]
        },
        {
          "h": "回看 Flexbox：一维布局的看家本领",
          "p": [
            "Foundations 的 Flexbox 课教过三件事：沿**两根轴（主轴与交叉轴）**摆放项目、设置 **flex 对齐**、让项目**放大、缩小或改变尺寸**（grow / shrink / basis）。",
            "这正是 Flexbox 真正的妙处——项目可以「flex」，能伸能缩。排一行或一列项目时，它是方便的一维布局工具：**不需要靠浮动（float）或 CSS hack** 就能把项目对齐。",
            "官方顺带给了一句实在话：如果你对 Flex 已经完全没感觉了，先回 Foundations 的 Flex 课过一遍再继续。本章最后一课会把 Flex 与 Grid 放在一起正面对比，没有底子会听得天书。"
          ]
        },
        {
          "h": "Flexbox 的难处：两维布局",
          "p": [
            "两维布局方面，你学过一点 `flex-wrap`：让 flex 项目折行——一行折成多行，或一列折成多列。",
            "还记得卡片布局练习（07-flex-layout-2）解得有多费劲吗？官方原话：我们知道那一题很折磨人，**但折磨正是练习目的的一部分**。",
            "Flexbox 确实能拼出「行 + 列」的布局，但并不总是容易：每一行是独立的 flex 上下文，行与行之间要对齐、要等宽，往往还要再包一层容器或算百分比。",
            "而同样的两维卡片布局，用 CSS Grid 搭建会**容易得多**——官方用同一个例子的两种写法做了对比：行列结构直接声明在容器上，项目自动落进格子。"
          ]
        },
        {
          "h": "Grid 是什么：从报纸网格到浏览器标准",
          "p": [
            "Grid 虽然是 CSS 里较新的模块，但这个布局工具的想法由来已久。冷知识：CSS 的共同创造者 **Bert Bos 博士**（与 Wes Bos 无亲缘关系——官方特意开了这个玩笑）**1996 年**就开始研究这个布局模型。",
            "灵感来自其它媒体里的**网格排版**：报纸与杂志的版面从来都沿着看不见的网格分栏、对齐、留白。",
            "经过多年充分的演示与打磨，CSS Grid 于 **2017 年**进入全部主流浏览器。",
            "Grid 常因「两维布局中摆放项目很容易」被称赞，但它**一维布局也能做**。对开发者还有个实际好处：可以先只摆一行项目，之后再按需加行——布局跟着内容长。"
          ]
        },
        {
          "h": "Flex 与 Grid：相似、差异与「分工不替代」",
          "p": [
            "相似处很多：两者都是**父容器 + 子项目**的模型，对齐与定位的属性名也相近——你学 Flex 时建立的容器 / 项目心智模型可以直接迁移。",
            "差异也不少，社区对「两个模块各自该怎么用」一直有各种观点。一个体感例子：如果你曾为「让一排 Flex 项目大小完全一致」挣扎过，Grid 做这类布局要容易得多。",
            "官方特别提醒：回看旧资料时记住，**Flex 与 Grid 的差异会随模块更新而变化**。最典型的例子是 `gap` 属性——它曾是 Grid 专属，如今 Flexbox 也支持了（下一课正式讲）。",
            "曾有人认为 CSS Grid 是来替代 Flexbox 的。学完本章你会得到相反结论：**Grid 只是工具袋里的又一件工具**——两者各有用武之地，还可以配对使用。这些都放在最后一课讲。现在，先去学怎么真正创建一个网格。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "css",
          "code": "/* 同一个「两列卡片」需求：两种工具的形状差异 */\n.flex-way {\n  display: flex;\n  flex-wrap: wrap;   /* 折行凑出第二排 */\n}\n.flex-way > .card {\n  width: calc(50% - 8px);  /* 宽度要自己算，还要留给间距 */\n}\n\n.grid-way {\n  display: grid;\n  grid-template-columns: 1fr 1fr;  /* 两列等宽，声明在容器上 */\n  gap: 16px;                        /* 间距一行搞定 */\n}",
          "note": "这正是官方对比演示的核心：Flex 的两维要靠 wrap + 手算宽度凑；Grid 把行列结构直接写在容器上（下一课展开 grid-template-columns 与 gap）。"
        }
      ],
      "pitfalls": [
        {
          "title": "把 Grid 当成 Flexbox 的「升级替代品」",
          "text": "Grid 不是来替代 Flexbox 的：一维的内容流（一条导航、一行按钮）用 Flex 往往更顺手，两维的版面结构才是 Grid 的主场。本章最后一课专门讲两者的分工——现在不必预设「谁更强」的立场。"
        },
        {
          "title": "Flexbox 没热身就直接冲 Grid",
          "text": "官方明确说：如果 Flex 已经完全生疏，先回 Foundations 的 Flexbox 课。本章的对比课与搭配课都以 Flex 为参照系，跳过热身会让后面两课事倍功半。"
        },
        {
          "title": "拿旧文章的能力边界当现状",
          "text": "Flex 与 Grid 的差异在持续演进：gap 曾是 Grid 专属，如今 Flex 也支持。看到「这个只有 Grid / Flex 能做」的绝对化结论，先看文章的发布时间，再到 MDN 核实现状。"
        }
      ],
      "official": {
        "assignment": [
          "惊喜：这一课没有作业！接下来几课你会学到更多，继续往下走就好。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/grid/introduction_to_grid.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "ab46bdaf144de31451b95aa14df730145b14a3898381fedfb64502f2e2e76417",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-creating-a-grid",
      "title": "Creating a Grid",
      "zh": "创建网格",
      "group": 3,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-creating-a-grid",
      "summary": "Grid 的第一课实操：`display: grid` 一行把元素变成网格容器，直接子元素自动成为网格项目（孙元素不算）；用 `grid-template-columns` / `grid-template-rows` 定义轨道（track），`grid-template` 简写一次写两向（行在斜杠前、列在斜杠后）；项目超出已定义轨道时进入**隐式网格**——`grid-auto-rows` / `grid-auto-columns` 给隐式轨道定尺寸，`grid-auto-flow: column` 改变自动流向；最后用 `column-gap` / `row-gap` / `gap` 拉开行列间距。",
      "guide": "以下是官方原课的中文化梳理，带可动手的代码片段与常见错误卡片。这一课官方带你从零搭出第一个网格，全程围绕一个 2×2 的容器示例逐步加码。学完你应该能回答四个问题：谁会成为网格项目（只有直接子元素）、行列怎么定义（template 两属性 + 简写）、多出来的项目去哪了（隐式网格）、间距怎么留（gap 家族）。这一课的外部资料与练习入口都在「官方任务」一节末尾的「本课外部资料」。",
      "understand": [
        "网格的两角色与 Flexbox 同构：带 display: grid（或 inline-grid）的元素是**网格容器**，它的**直接子元素**自动成为网格项目——不需要给每个子元素单独写属性",
        "只有直接子级算项目：项目内部再嵌的元素不是网格项目；但网格项目自己也可以再设 display: grid——网格套网格是合法且常用的",
        "网格线（line）与轨道（track）是看不见的：没有边框时页面上不显示，但用开发者工具的 Grid overlay 能把线、轨道与区域画出来（Elements 面板里网格元素旁有 grid 徽标）",
        "grid-template-columns / grid-template-rows 定义轨道：写几个值就有几条轨道；本课先用像素值，后面的课学百分比与 fr 分数单位",
        "grid-template 是两属性的简写：**行写在斜杠前、列写在斜杠后**（grid-template: 50px 50px / 50px 50px 50px 是两行三列）",
        "轨道值可以不相等：想让第一列是其它列的五倍宽，就把第一个值写成五倍",
        "项目多于已定义轨道时，Grid 自动创建**隐式轨道**接住它们（默认向下加行）——显式定义的尺寸不会自动带进隐式轨道，要用 grid-auto-rows / grid-auto-columns 单独定",
        "grid-auto-flow: column 让多余内容改沿列方向排（横向加列），配套用 grid-auto-columns 定尺寸；默认是 row（纵向加行）",
        "行列间距的术语叫 gutter 或 alley：column-gap 管列间、row-gap 管行间、gap 是两者的简写"
      ],
      "terms": [
        {
          "en": "grid container",
          "zh": "网格容器：display: grid 或 inline-grid 的元素，「装下」整个网格"
        },
        {
          "en": "grid item",
          "zh": "网格项目：容器的直接子元素；孙元素不算，但项目自己可以再做容器"
        },
        {
          "en": "grid track",
          "zh": "网格轨道：两条相邻网格线之间的空间——一条行轨道或一条列轨道"
        },
        {
          "en": "grid line",
          "zh": "网格线：轨道之间的分界线，页面上不可见，开发者工具的 Grid overlay 可以显示"
        },
        {
          "en": "explicit grid",
          "zh": "显式网格：你用 grid-template-columns / rows 明确定义出来的轨道部分"
        },
        {
          "en": "implicit grid",
          "zh": "隐式网格：项目超出显式定义时 Grid 自动创建的轨道；尺寸由 grid-auto-rows / columns 控制"
        },
        {
          "en": "gutter / alley",
          "zh": "沟槽：网格行与列之间间距的叫法，对应 gap 家族属性"
        }
      ],
      "tasks": [
        "跟着本站讲解把第一个网格搭出来：容器 + 四个项目 + 两行两列轨道（边读边敲，官方假设你在 code along）",
        "打开开发者工具：找到网格元素旁的 grid 徽标，在 Layout 面板开启 Grid overlay，亲眼看一次不可见的线与轨道",
        "做一个「第五个项目」实验：不改 template 直接加项目，观察它落进自动创建的第三行；再用 grid-auto-rows 给隐式行定尺寸",
        "读 CSS-Tricks Grid 指南的「Introduction」与「Key Terms」两节（官方 Assignment 第 1 条，无中文版，卡内有本站导读）",
        "看 Wes Bos 的短视频：implicit vs explicit tracks（官方 Assignment 第 2 条，英文视频）",
        "翻一遍 Chrome DevTools 检查 CSS Grid 的官方文档（官方 Assignment 第 3 条），知道布局调试入口在哪"
      ],
      "quiz": [
        {
          "question": "一个 div 设了 display: grid，它内部的段落里又有一个 span——span 是网格项目吗？为什么？",
          "answer": "不是。只有网格容器的**直接子元素**会成为网格项目；span 藏在段落里面，是孙辈，不参与外层网格的摆放。如果想让 span 也进网格逻辑，要么把它提到容器直接子级，要么给段落再设 display: grid——网格项目自己也可以成为网格容器（网格套网格）。"
        },
        {
          "question": "grid-template: 50px 50px / 50px 50px 50px 定义了一个什么样的网格？",
          "answer": "两行三列：简写里**斜杠前是行、斜杠后是列**。行两条各 50px，列三条各 50px。它等价于 grid-template-rows: 50px 50px 加 grid-template-columns: 50px 50px 50px。记不住顺序时回想官方口诀：rows before the slash, columns after。"
        },
        {
          "question": "2×2 的网格里放进第五个项目会发生什么？它的行高由谁决定？",
          "answer": "第五个项目会被自动放进一条**新创建的第三行**——这就是隐式网格：轨道不够时 Grid 自己补。注意显式定义的 50px **不会**带进隐式轨道，新行的高度默认由内容撑开；想让隐式行也用固定尺寸，写 grid-auto-rows: 50px（横向补列则用 grid-auto-columns，并配 grid-auto-flow: column 改流向）。"
        },
        {
          "question": "row-gap、column-gap 和 gap 三个属性是什么关系？",
          "answer": "gap 是 row-gap 与 column-gap 的简写：gap: 10px 让行列间距都是 10px；gap: 10px 20px 第一个值管行、第二个管列（与 padding 简写的前两个值同序）。行列间距在排版术语里叫 gutter 或 alley。gap 曾是 Grid 专属属性，现在 Flexbox 也支持。"
        }
      ],
      "optional": [],
      "note": "",
      "why": "这一课把 Grid 的地基一次打好：容器 / 项目两角色（从 Flexbox 直接迁移）、轨道与线（下一课定位的坐标系）、显式与隐式（内容超出时的兜底行为）、gap（间距的唯一正规解）。四个概念里最容易埋雷的是隐式网格——「多出来的项目去哪了、为什么行高变了」这类灵异现象，根源几乎都是显式轨道没有覆盖到全部内容。现在把行为看明白，比日后调试省得多。",
      "sections": [
        {
          "h": "网格容器：一行 display 声明",
          "p": [
            "CSS Grid 的思维方式和 Flexbox 一样，是**容器 + 项目**：把一个元素设为网格容器，它就「装下」整个网格。",
            "声明只有两选一：`display: grid`（块级网格）或 `display: inline-grid`（行内网格，像 inline-block 一样不独占一行）。",
            "容器设好后，**每个直接子元素自动成为网格项目**——这是 Grid 最省事的地方：不需要给每个子元素写任何属性。",
            "两个边界要记清：① 只有**直接子级**算项目，项目内部再嵌的元素（孙辈）不参与外层网格；② 网格项目自己也可以再设 `display: grid`——**网格套网格**完全合法，本章的项目课就靠这招逐区细化。"
          ],
          "list": [
            "display: grid —— 块级网格容器，独占一行",
            "display: inline-grid —— 行内网格容器，尺寸随内容",
            "直接子元素 = 网格项目，自动生效，零额外声明"
          ]
        },
        {
          "h": "看不见的线与轨道：用开发者工具把它们画出来",
          "p": [
            "跟着示例敲代码时你会发现：页面看起来一点也不「网格」——很多 Grid 教程一上来就给你看带格线的漂亮示意图，但**只要容器和项目没有边框，页面上就什么线都看不到**。",
            "别担心，线一直都在。打开开发者工具：网格元素的代码旁会出现 **grid 徽标**；在 **Layout 选项**里勾选 overlay，就能把这些看不见的**线（lines）、轨道（tracks）与区域（areas）**直接叠加显示在页面上。",
            "轨道就是「两条相邻线之间的空间」——一条行轨道或一条列轨道。下一课（定位网格元素）会正式用线与轨道做坐标系，这一课先在 devtools 里亲眼见一次；Assignment 里也有一份 Chrome DevTools 检查 Grid 的文档给你翻。"
          ]
        },
        {
          "h": "定义列与行：grid-template-columns / rows",
          "p": [
            "容器与项目就位，接下来定义行列——也就是定义**网格轨道**。两个属性：`grid-template-columns` 定义列轨道，`grid-template-rows` 定义行轨道。",
            "本课先用最直白的**像素值**：写几个值就有几条轨道。给 2×2 的四个项目定轨道，就是两个属性各写两个 50px。",
            "想加第三列？给 `grid-template-columns` 多写一个值即可——**值与轨道一一对应**。",
            "轨道值不必相同：想让第一列是其它列的**五倍宽**，把第一个值写成 250px、其余 50px 就行。",
            "百分比与 **fr 分数单位**是更好用的定义方式，但那是两课之后（高级网格属性）的内容——本课先守住像素值，把「值 ↔ 轨道」的对应关系练熟。"
          ]
        },
        {
          "h": "grid-template 简写：行在斜杠前，列在斜杠后",
          "p": [
            "两个 template 属性有一条简写：`grid-template`。**斜杠前定义行、斜杠后定义列**——顺序记反是这一课最常见的翻车点。",
            "比如 `grid-template: 50px 50px / 50px 50px 50px;` 等价于两行（各 50px）三列（各 50px）——与分开写两条属性的效果完全一致，只是少写一行。"
          ]
        },
        {
          "h": "显式网格 vs 隐式网格：第五个项目去哪了",
          "p": [
            "做个实验：2×2 的网格（四个项目、两行两列都定义好了），直接往容器里再塞**第五个项目**，不改任何 template 属性。",
            "结果：第五个项目好好地摆在了**自动出现的第三行**里。这就是 Grid 的**隐式网格（implicit grid）**机制——当项目需要的轨道超出你显式定义的数量，Grid 自动创建新轨道接住它们。",
            "两个属性名的分工由此而来：`grid-template-columns` / `grid-template-rows` 定义的是**显式网格**；内容超出时自动补的是**隐式网格**。",
            "关键细节：显式轨道的尺寸**不会**自动延续到隐式轨道——第三行的高度默认由内容撑开，跟你定义的 50px 无关。",
            "想让隐式轨道也听话，用专门的两属性：`grid-auto-rows` 定隐式行高、`grid-auto-columns` 定隐式列宽。比如 `grid-auto-rows: 50px` 让每条自动补出来的行都保持 50px。",
            "方向也能改：Grid 默认**向下补行**（内容纵向增长）。想让多余内容横向补列，写 `grid-auto-flow: column`，隐式列的尺寸配套用 `grid-auto-columns` 定。横向增长的场景少得多，但知道开关在哪，遇到列表类布局时就有得选。"
          ]
        },
        {
          "h": "gap：行列间距的正规解",
          "p": [
            "网格行与列之间的间距有个排版术语：**gutter** 或 **alley**（沟槽）。",
            "三个属性：`column-gap` 管列与列之间，`row-gap` 管行与行之间，`gap` 是两者的简写（`gap: 10px` 行列同宽；`gap: 10px 20px` 先行后列）。",
            "在 Flexbox 时代你曾用 margin 手算间距、还要处理边缘多余的那一条——gap 把这件事变成一行声明，而且**间距只出现在轨道之间**，网格外缘不会多出一圈。",
            "顺带把本课的示例收个尾：官方为了让你不依赖 devtools 也能看清项目位置，给项目加了边框；再给列加一点 column-gap、给行加大一点的 row-gap，两个方向的间距差异一眼可见。你可以再试试 gap 简写一次设两向。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "html",
          "code": "<!-- 容器与四个项目：子元素零声明，自动成为网格项目 -->\n<div class=\"container\">\n  <div>Item 1</div>\n  <div>Item 2\n    <p>我不是网格项目！（孙元素不参与外层网格）</p>\n  </div>\n  <div>Item 3</div>\n  <div>Item 4</div>\n</div>",
          "note": "官方示例的要点藏在 Item 2 里：段落是容器的孙辈，不会被外层网格摆放——但 Item 2 自己随时可以再设 display: grid，让段落进入它自己的内层网格。"
        },
        {
          "lang": "css",
          "code": "/* 第一个网格：两行两列 + 间距 */\n.container {\n  display: grid;\n  grid-template-columns: 50px 50px;\n  grid-template-rows: 50px 50px;\n  gap: 10px;            /* 行列间距一行搞定 */\n}",
          "note": "值与轨道一一对应：两列各 50px、两行各 50px。想让第一列五倍宽，把 grid-template-columns 改成 250px 50px 即可。"
        },
        {
          "lang": "css",
          "code": "/* grid-template 简写：行在斜杠前、列在斜杠后 */\n.container {\n  display: grid;\n  grid-template: 50px 50px / 50px 50px 50px;\n  /* 等价于：\n     grid-template-rows: 50px 50px;\n     grid-template-columns: 50px 50px 50px;  */\n}",
          "note": "两行三列。简写顺序记反（列写在斜杠前）是这一课最高频的错误——默念一遍 rows before, columns after 再下手。"
        },
        {
          "lang": "css",
          "code": "/* 隐式网格：让自动补出来的行保持固定高度 */\n.container {\n  display: grid;\n  grid-template-columns: 50px 50px;\n  grid-template-rows: 50px 50px;\n  grid-auto-rows: 50px;   /* 第五个项目落进的第三行也是 50px */\n\n  /* 想让多余内容横向补列而不是纵向补行： */\n  /* grid-auto-flow: column;\n     grid-auto-columns: 50px; */\n}",
          "note": "显式定义的 50px 不会带进隐式轨道——grid-auto-rows 才是隐式行的尺寸来源。grid-auto-flow 默认是 row（向下补行）。"
        }
      ],
      "pitfalls": [
        {
          "title": "grid-template 简写把行列顺序写反",
          "text": "简写的固定顺序是**行 / 列**（斜杠前行、斜杠后列）。写成列在前不会报错，只会得到一个行列颠倒的网格——症状是「布局莫名其妙转置了」。分开写两条属性可以完全避开这个坑，熟练后再用简写。"
        },
        {
          "title": "以为显式轨道的尺寸会延续到隐式轨道",
          "text": "grid-template-rows: 50px 50px 只管你定义的那两行；项目超出后自动补的行由内容撑高，跟 50px 无关。要统一尺寸就补一条 grid-auto-rows: 50px——「多出来的那一行为什么高度不一样」十有八九是这个原因。"
        },
        {
          "title": "试图用外层网格直接摆孙元素",
          "text": "只有直接子元素是网格项目。想控制更深一层的排布，给中间那层项目再设 display: grid，让它成为内层网格的容器——「网格套网格」是官方项目课的标准做法，不是绕路。"
        },
        {
          "title": "用 margin 手算间距，忘了 gap",
          "text": "margin 方案要处理边缘多余间距、还要把间距从宽度里扣掉（calc 连串）。gap 只作用于轨道之间、外缘零多余，且行列可分别控制——Grid 里的间距一律先想 gap。"
        }
      ],
      "official": {
        "assignment": [
          "读 CSS-Tricks 的 Grid Layout 指南中的「Introduction」与「Key Terms」两节（该页现已更名 A Complete Guide to CSS Grid Layout，旧地址自动跳转；无官方中文版，资源卡内有本站中文导读）。",
          "观看 Wes Bos CSS Grid 课程里关于 implicit vs explicit tracks（隐式与显式轨道）的短视频。",
          "翻一遍开发者工具文档：Inspecting CSS Grid in Chrome DevTools（检查 Chrome DevTools 里的 CSS Grid），学会用 Layout 面板的 overlay 显示网格线。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/grid/creating_a_grid.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "a6108269f0f1e90af82182ced399f883faf1e4d3244de20221f91be22b8bcdc5",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-positioning-grid-elements",
      "title": "Positioning Grid Elements",
      "zh": "定位网格元素",
      "group": 3,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-positioning-grid-elements",
      "summary": "Grid 定位的坐标系与两套写法。先立术语：轨道（track，一条行或列）、网格线（line，随轨道隐式诞生、从 1 开始编号、还有从另一端倒数的负数线）、单元格（cell，一行轨道 × 一列轨道的交集，像电子表格）。定位第一套写法按线号：`grid-column-start` / `grid-column-end` 与 `grid-row-start` / `grid-row-end` 指定项目跨哪几条线，简写 `grid-column` / `grid-row` 用斜杠合并，更短的 `grid-area` 一行写四个值（行起 / 列起 / 行止 / 列止）。第二套写法按名字：给每个项目起 `grid-area` 名，再用 `grid-template-areas` 在容器上「用文字画出」整个版面，`.` 表示空格子——官方用一个 5×5 的公寓户型图把两套写法都走了一遍。",
      "guide": "以下是官方原课的中文化梳理，带可动手的代码片段与常见错误卡片。这一课的官方示例是一个好玩的公寓户型图：5×5 网格当房子的总面积，各房间（项目）按线号摆进去，客厅跨多格、卫生间和厨房要挪到一起省管道钱——跟着做一遍，两套定位写法就都上手了。本课的外部资料与练习入口都在「官方任务」一节末尾的「本课外部资料」。",
      "understand": [
        "术语三件套：**track**（轨道）= 任意一条行或列；**line**（网格线）= 轨道之间的分界；**cell**（单元格）= 一条行轨道与一条列轨道共享的空间，像电子表格的一格",
        "网格线是**隐式诞生**的：定义了轨道，线就自动有了——不能直接「创建」线；n 条轨道对应 n+1 条线（3×3 网格的行列线各是 1 到 4）",
        "线号从 1 开始，从左到右、从上到下编号；DevTools 的 Grid overlay（Layout 面板勾选 show line numbers）能直接把线号画在页面上",
        "负数线号从**相反方向**倒数（-1 是最右 / 最下那条线）——「贴到最后一列」不用数轨道数，写 -2 / -1 即可",
        "默认每个直接子元素占**一个**单元格、自动摆放；要改位置或跨多格，才需要定位属性",
        "按线定位四属性：grid-column-start / grid-column-end 管横向跨哪几条列线，grid-row-start / grid-row-end 管纵向；值写线号",
        "两组简写：grid-column: 起 / 止（列向两值合一）、grid-row: 起 / 止（行向）；再合一就是 grid-area: 行起 / 列起 / 行止 / 列止——**四个值的顺序是行在前、每对都是起在前**",
        "grid-area 还有第二人格：给它写一个**名字**（grid-area: living-room），项目就有名有姓；容器上用 grid-template-areas 把名字按行列排成「文字版画布」，整个版面一目了然",
        "grid-template-areas 里用 `.` 占位空格子；每行一个字符串、字符串里按列写名字——版面结构直接可读，改布局像改画稿",
        "「grid area」一词有时也指**一组单元格**：项目跨多格占出来的那块区域就是一个 area（就像公寓里四面墙围出的一个房间）"
      ],
      "terms": [
        {
          "en": "grid track",
          "zh": "网格轨道：网格上的任意一条行或列——用 grid-template 定义的就是轨道"
        },
        {
          "en": "grid line",
          "zh": "网格线：轨道之间的分界线，随轨道定义隐式产生；从 1 起编号，另有负数线从另一端倒数"
        },
        {
          "en": "grid cell",
          "zh": "网格单元格：一条行轨道与一条列轨道的交集，网格里的最小空间单位，类比电子表格的一格"
        },
        {
          "en": "grid-column-start / grid-column-end",
          "zh": "列向定位属性：项目从哪条列线开始、到哪条列线结束；行向同款是 grid-row-start / grid-row-end"
        },
        {
          "en": "grid-area",
          "zh": "双重身份：① 四值简写（行起 / 列起 / 行止 / 列止）；② 给项目起名字，配合容器的 grid-template-areas 画版面"
        },
        {
          "en": "grid-template-areas",
          "zh": "容器属性：用名字按行列「画出」整个版面，每行一个字符串，. 表示空格子"
        },
        {
          "en": "span",
          "zh": "跨轨道：项目横跨多条轨道；下一课的 Assignment 里会遇到 span 与 auto 关键字"
        }
      ],
      "tasks": [
        "跟着官方示例搭一遍 5×5 公寓户型图：先摆单格房间，再让客厅用 grid-column-start / end 跨多格",
        "解开示例里注释掉的 grid-row-start / grid-row-end，看客厅怎么变得更大；再动手把卫生间挪到厨房旁边（官方留的练习：改浴室、卧室、壁橱的起止线）",
        "把四值写法练熟：给客厅写一条 grid-area: 1 / 1 / 3 / 6，对照 start/end 版本确认理解顺序",
        "用 grid-template-areas 重画一遍户型图：给每个房间起名，在容器上按行拼版面，用 . 留出热水器与洗衣机的空位",
        "读 MDN 的 Line-based Placement with CSS Grid（官方 Assignment 第 1 条，有官方中文版）",
        "玩 CSS Grid Garden 第 1–17 关（官方 Assignment 第 2 条；后面的关卡超出本课范围，留给下一课）",
        "做 css-exercises 仓库 intermediate-html-css/positioning-grid 目录的 01-basic-holy-grail 练习（官方 Assignment 第 3 条，说明在 README 里；可以查任何文档，别翻答案）"
      ],
      "quiz": [
        {
          "question": "一个 3×3 的网格有多少条列网格线？为什么不是 3 条？",
          "answer": "4 条。线是轨道的分界：3 条列轨道的左右边界一共 4 条线，编号 1 到 4。规律是 **n 条轨道对应 n+1 条线**——「网格线数 = 轨道数 + 1」，写 grid-column: 1 / 4 才是横跨整个 3 列网格。另外还有一套从另一端倒数的负数线（-1 是最右），贴边定位时很好用。"
        },
        {
          "question": "grid-area: 1 / 1 / 3 / 6 四个值各是什么？它等价于哪四条属性？",
          "answer": "顺序是**行起 / 列起 / 行止 / 列止**：从行线 1 到行线 3（跨两行）、列线 1 到列线 6（跨五列）。等价于 grid-row-start: 1; grid-column-start: 1; grid-row-end: 3; grid-column-end: 6。记忆要点：行在前列在后（与 grid-template 简写同向），每对里 start 在前 end 在后。"
        },
        {
          "question": "grid-template-areas 里的 . 是什么意思？这套写法相比线号定位的优势在哪？",
          "answer": ". 表示**空格子**（该位置不放任何命名区域）。优势是可读性与可维护性：版面结构以「文字画布」的形式直接呈现——每行一个字符串、名字排在哪一眼看清；改布局时挪名字就行，不用重算一堆线号。前提是先用 grid-area: 名字 给每个项目注册过名字。"
        },
        {
          "question": "网格线可以直接创建吗？「grid area」除了四值简写外还有什么含义？",
          "answer": "不能。线是在你定义轨道时**隐式产生**的——先有轨道，才有轨道之间的线；没有任何「创建线」的属性。另外「grid area」作为术语还可以指**一组单元格**：项目跨多格占出的那块区域（比如客厅的四壁之内）就是一个 area——与公寓的「房间」是同一个比喻。"
        }
      ],
      "optional": [],
      "note": "",
      "why": "创建网格解决「格子怎么画」，这一课解决「东西怎么放」。Grid 的定位能力全部建立在**线号坐标系**上：理解了「n 条轨道有 n+1 条线」，四属性、两组简写、grid-area 四值就是同一件事的三种啰嗦程度；而 grid-template-areas 又把坐标系升级成「画版面」——名字排成文字画布，布局第一次变得像排版软件一样直观。下一课的 span 与 auto、以及仪表盘项目里「侧栏 + 头部 + 主区」的摆放，全部以这一课的坐标系为地基。",
      "sections": [
        {
          "h": "先立术语：track 是一条行或列",
          "p": [
            "进入定位之前，把部件名称立清楚。上一课你用 `grid-template` 定义的就是**轨道（tracks）**：**网格轨道 = 网格上的任意一条行或列**。",
            "例：要一个 3×3、行列都是 100px 的网格，就是定义 **3 条高 100px 的行轨道 + 3 条宽 100px 的列轨道**。",
            "官方示例里还藏了两个小实验（CodePen 里被注释掉的两条属性）：解开 `.first-row` 的注释，能看到第一条与第二条**行线**之间的那条行轨道；解开 `.last-column`，看到第三条与第四条**列线**之间的列轨道——「轨道夹在两条线之间」这句话从此有了画面。"
          ]
        },
        {
          "h": "网格线：随轨道隐式诞生，从 1 开始编号",
          "p": [
            "关键认知：**只要你创建了轨道，网格线就隐式产生了**。线不能被显式创建——没有「添加一条线」的属性，线永远跟着轨道走。",
            "每条轨道都有起始线与结束线。编号规则：**从左到右、从上到下，从 1 开始**。所以 3×3 网格的列线是 1 到 4、行线也是 1 到 4（n 条轨道 → n+1 条线）。",
            "网格线就是用来**定位项目**的——马上讲到。先用开发者工具看线：Chrome DevTools 的 **Layout 面板**里有 Grid overlay 设置，勾上 **show line numbers**、选中对应元素（比如示例里的 div.container），线号就直接叠印在页面上。",
            "注意 overlay 还会显示一套**负数线号**：从相反方向倒数（-1 是最右 / 最下的线）。现在不必深究，但记住有这个选项——「贴到最右边」这类定位用它最省事。"
          ]
        },
        {
          "h": "单元格：网格里的电子表格",
          "p": [
            "**单元格（cell）**：一条行轨道与一条列轨道共享的空间——可以完全按电子表格理解：一个由「行、列」坐标定出的格子。",
            "默认情况下，网格容器的每个直接子元素**占一个单元格**、按文档顺序自动摆放。3×3 网格有 9 个单元格，9 个子元素各就各位。",
            "用线号描述位置：示例里标 A 的项目占的单元格在**行轨道 1**（行线 1 与 2 之间）×**列轨道 1**（列线 1 与 2 之间）；标 H 的项目在**行轨道 3**（行线 3 与 4 之间）×**列轨道 2**（列线 2 与 3 之间）。",
            "那么——想改变项目的顺序呢？想让一个项目占**不止一格**呢？这就是接下来定位属性要回答的两个问题。"
          ]
        },
        {
          "h": "按线定位：5×5 的公寓户型图",
          "p": [
            "官方的示例好玩又直观：把一个 5×5 网格当作一套公寓的总面积（容器给了背景色、用 `display: inline-grid` 避免块级拉伸，纯粹为了看得清），往里面摆「房间」。",
            "大部分房间就是一个单元格；但客厅要大——用两条属性把它撑开：`grid-column-start` 与 `grid-column-end`，值写**列线号**：从哪条线开始、到哪条线结束。",
            "行向同款：`grid-row-start` / `grid-row-end`（示例里被注释掉了，解开就能看到客厅进一步变大——占住行线 1 到 3 之间的两条行轨道）。",
            "这四条属性的本质：**用现成的网格线告诉每个项目该横跨几行几列**。线号记不清就开 DevTools 的 Grid overlay 对照着看。",
            "官方还留了个动手练习：现在卫生间和厨房隔着整套房子——把管道接到一起才省钱。试着改浴室、卧室、壁橱的起止线，**让卫生间紧挨厨房**（长短属性都行）。"
          ]
        },
        {
          "h": "两组简写：grid-column 与 grid-row",
          "p": [
            "start / end 成对出现，自然有简写：`grid-column` = grid-column-start + grid-column-end，**两个线号之间用斜杠**；`grid-row` 同理管行向。",
            "示例里的 #kitchen 用的就是简写形式——四条属性收敛成两条，语义不变。"
          ]
        },
        {
          "h": "grid-area 四值：一行写完行与列",
          "p": [
            "还有更短的：`grid-area` 把**行起 / 列起 / 行止 / 列止四个值写进一行**。上面的客厅可以写成：",
            "`#living-room { grid-area: 1 / 1 / 3 / 6; }`——行线 1 到 3、列线 1 到 6。",
            "顺序是这一条唯一的坑：**行在前、列在后；每对里 start 在前、end 在后**。与 margin 的四值顺序（上右下左）不同，别按那个直觉写。",
            "但 grid-area 能指的东西不止于此——它还有第二种用法，见下。"
          ]
        },
        {
          "h": "grid-template-areas：用文字画出整个版面",
          "p": [
            "不用线号、改用**名字**定位：给网格上的每个项目用 `grid-area` 起一个名字——客厅就是 `grid-area: living-room;`。",
            "全部房间都有名之后，在**容器**上用 `grid-template-areas` 把整个结构「画」出来：每一行轨道写一个字符串，字符串里按列写名字。官方示例把 CodePen 拉大逐行读，整套房子的版面就是一段可读的文字。",
            "还能用 `.` 表示**空格子**：假设公寓要添热水器和洗衣烘干机、位置还没定——从浴室和厨房里各让出一块，用点号占住，版面照样成立。",
            "同一个 grid-area，两种完全不同的用法（四值线号 vs 区域命名），这是 Grid 术语最容易混的一处。顺带把词义补齐：「grid area」作为术语也可以指**一组单元格**——客厅所有格子合起来就是一个 area，正如公寓里四面墙围出一个房间。"
          ]
        },
        {
          "h": "收尾：span 与 auto 在 Assignment 里等你",
          "p": [
            "做官方 Assignment 时你还会遇到两个定位关键字：`span`（跨 N 条轨道，不用算结束线号）与 `auto`（占满到网格尽头）。",
            "另外 Grid 也有一套与 Flexbox 相似的 justify / align 属性用来对齐项目与整张网格——本课先不展开。",
            "官方的结语很实在：这些术语和定位手法，**最好的学法就是大量练习**——Grid Garden 的 17 关和 holy grail 练习正是为此准备的。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "css",
          "code": "/* 按线定位：客厅横跨列线 1→6、行线 1→3 */\n#living-room {\n  grid-column-start: 1;\n  grid-column-end: 6;\n  grid-row-start: 1;\n  grid-row-end: 3;\n\n  /* 两组简写，效果相同： */\n  /* grid-column: 1 / 6;\n     grid-row: 1 / 3; */\n\n  /* 最短写法，四值顺序 = 行起 / 列起 / 行止 / 列止： */\n  /* grid-area: 1 / 1 / 6 / 3; ← 错！行止与列止写反，成了跨 5 行 2 列 */\n  grid-area: 1 / 1 / 3 / 6;\n}",
          "note": "三种写法从啰嗦到紧凑，语义完全一致。四值顺序「行起 / 列起 / 行止 / 列止」与 margin 的「上右下左」不同——刻意把错误示范注释在这里，因为这是最高频的翻车点。"
        },
        {
          "lang": "css",
          "code": "/* 按名字定位：项目注册名字，容器画版面 */\n#living-room { grid-area: living-room; }\n#kitchen     { grid-area: kitchen; }\n#bathroom    { grid-area: bathroom; }\n\n.container {\n  display: grid;\n  grid-template-columns: repeat(5, 1fr);\n  grid-template-areas:\n    \"living-room living-room living-room kitchen kitchen\"\n    \"living-room living-room living-room kitchen kitchen\"\n    \"bathroom    bedroom     closet      kitchen kitchen\";\n}",
          "note": "版面即文档：名字排在哪、跨几格，逐行可读。改布局 = 改这张「文字画布」，不用重算线号。（repeat 与 fr 下一课细讲，这里先感受形状。）"
        },
        {
          "lang": "css",
          "code": "/* . 占空格子：留一块还没想好用途的位置 */\n.container {\n  grid-template-areas:\n    \"living-room living-room kitchen kitchen\"\n    \"bathroom    .           .       kitchen\";\n}",
          "note": "点号格不属于任何命名区域，渲染为空白。官方示例用它给「热水器 + 洗衣烘干机」预留位置——版面没定也能先画出来。"
        }
      ],
      "pitfalls": [
        {
          "title": "grid-area 四值按 margin 的顺序写",
          "text": "margin / padding 的四值是「上右下左」，grid-area 是「**行起 / 列起 / 行止 / 列止**」——两套顺序毫无关系。写反不会报错，项目会安静地摆到错误位置。下手前默念一遍顺序，或先用 start / end 四属性写明白再收拢。"
        },
        {
          "title": "把线号当轨道数：3×3 网格写 grid-column: 1 / 3 以为横跨全部",
          "text": "1 / 3 只跨两条轨道（线 1 到线 3 之间是轨道 1 和 2）。横跨整个 3 列网格要到**线 4**：grid-column: 1 / 4。记「n 条轨道 = n+1 条线」，不确定就开 DevTools 的线号 overlay 对照；想省事也可以用负数线（1 / -1 从第一条线到最后的线）。"
        },
        {
          "title": "写了 grid-template-areas 却忘了给项目起名",
          "text": "areas 画布上出现的每个名字，都必须有对应项目用 grid-area: 名字 注册过——没注册的名字会被忽略，那块区域渲染为空。反过来，起了名但画布里没安排的项目也不显示。两边要对得上。"
        },
        {
          "title": "想「创建」一条网格线",
          "text": "线不能直接创建：定义轨道，线就隐式有了。如果你发现自己在找「加一条线」的属性，真正要改的是轨道定义（grid-template-* 或 grid-auto-*）。"
        }
      ],
      "official": {
        "assignment": [
          "读 MDN 的 Line-based Placement with CSS Grid（基于线的 CSS Grid 定位；有官方中文版，资源卡直达）。",
          "玩 CSS Grid Garden 第 1 到 17 关，练习定位项目。注意其余关卡超出本课范围（留给下一课的 Assignment）。",
          "做我们 CSS exercises 仓库 intermediate-html-css/positioning-grid 目录里的练习 01-basic-holy-grail（说明在 README 里）。做练习时请用上一切你需要的文档与资源——现阶段**不要求背下这些属性**，查文档、搜索都行（除了翻答案）。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/grid/positioning_grid_elements.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "491c26da427cce651df21c6bf52cc8c2af57b5ddf55edc37d5e6fe6f2534b5c2",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-advanced-grid-properties",
      "title": "Advanced Grid Properties",
      "zh": "高级网格属性",
      "group": 3,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-advanced-grid-properties",
      "summary": "让网格从「静态」变「动态」的一课，也是本章概念密度最高的一课。五组工具：`repeat()` 批量生成轨道（不必手写 N 个值）；`fr` 分数单位按份分配剩余空间（可与 px 混用）；`min()` / `max()` 给轨道设动态的上限与下限；`minmax()`（Grid 四个轨道属性专用）与 `clamp()`（哪都能用的三值夹逼）给轨道设范围；压轴的 `auto-fit` / `auto-fill` 配 `repeat()` 与 `minmax()`，做出「列数随容器宽度自动增减、每列自动伸缩」的响应式网格——官方用一行 `repeat(auto-fit, minmax(150px, 1fr))` 演示了整套机制，并逐步拆解浏览器的计算过程；两者的差别只在项目填不满一行时才显现。",
      "guide": "以下是官方原课的中文化梳理，带可动手的代码片段与常见错误卡片。官方把这一课设计成动手课：一个可以拖角改变大小的 5×2 实验网格贯穿始终（CodePen 示例带 resize: both，建议把缩放调到 0.5x 或 0.25x 留出拖拽空间）。这一课的属性多，但主线只有一条——**从静态尺寸走向动态尺寸**：repeat 解决「写起来累」，fr 解决「不会伸缩」，min / max / minmax / clamp 解决「伸缩过头」，auto-fit / auto-fill 解决「列数写死」。抓住这条主线，十几个属性就是同一路径上的五站。本课的外部资料与练习入口都在「官方任务」一节末尾的「本课外部资料」。",
      "understand": [
        "本课的实验台：5 列 × 2 行、每轨 150px 的静态网格；容器带 resize: both（可拖右下角改变大小）与 overflow: auto（缩小到装不下时出滚动条）——后面每个属性都在这个可拖拽的环境里看效果",
        "repeat(N, 尺寸) 把「手写 N 个值」收成一条：repeat(5, 150px) 等价于五个 150px；可以和普通值混排，也能一段 2fr 一段 1fr",
        "fr（fractional unit，分数单位）分配的是**剩余空间**：四列各 1fr = 每列拿四分之一；2fr 对 1fr = 前者拿后者两倍的空间",
        "fr 可与静态单位混用（如 200px 1fr 1fr）：静态部分先扣掉，剩下的空间再按 fr 分——侧栏定宽 + 主区弹性的经典写法",
        "网格缩到最小时有个底线：项目不会无限缩小，最小到 **min-content**（内容不溢出的最小尺寸）为止——这个关键字很深，本课只需知道存在",
        "min() 返回参数里最小的值、max() 返回最大的：全给静态值没有意义（结果恒定）；**掺进动态值才解锁真本事**——min(200px, 50%) 给轨道设上限（相当于 max-height），max(120px, 15%) 设下限",
        "minmax(最小, 最大) 是 **Grid 专用**函数，只能用在 grid-template-columns / grid-template-rows / grid-auto-columns / grid-auto-rows 四个属性里；两个参数都用静态值也合理（轨道在 150px–200px 之间随容器伸缩）",
        "clamp(最小, 理想, 最大) **哪里都能用**（不限 Grid）：理想值通常用动态单位，最小 / 最大通常用静态值兜底——width: clamp(500px, 80%, 1000px) 是同一思路的非网格例子",
        "auto-fit / auto-fill 是 repeat() 规范的一部分：返回「不让项目溢出容器的**最大可能正整数**」——列数从此随容器宽度自动定（W3 规范原话 the largest possible positive integer）",
        "黄金组合 repeat(auto-fit, minmax(150px, 1fr)) 的计算分三步：① 拿容器内容盒宽度；② 用 minmax 的**最小值**算最多能塞几列（500px ÷ 150px → 3 列）；③ 把每列从最小值**拉伸到最大值**（1fr = 三等分剩余空间）——窗口每变一次，实时重算一次",
        "auto-fit 与 auto-fill 大多数情况完全一样；差别只在**项目填不满一行**时：auto-fit 把项目保持拉伸到 max（用项目填满行），auto-fill 则让项目缩回 min、把空出来的轨道位保留着（哪怕没有项目可放）",
        "minmax / clamp 这对工具的价值：让网格响应的同时**不越过让版面变难看的关键断点**——图片与容易溢出的元素尤其需要"
      ],
      "terms": [
        {
          "en": "repeat()",
          "zh": "Grid 模板属性的函数：按「次数 + 轨道定义」批量生成轨道，免去手写重复值"
        },
        {
          "en": "fr (fractional unit)",
          "zh": "分数单位：把网格内的剩余空间按份分配；1fr = 一份，2fr = 两份"
        },
        {
          "en": "static vs dynamic",
          "zh": "静态尺寸（如 150px，固定不变）与动态尺寸（如 fr、%，随容器变化）——本课的主线就是从前者走向后者"
        },
        {
          "en": "min-content",
          "zh": "CSS 关键字：内容不溢出所需的最小尺寸——网格项目缩小的天然底线（深入用法超出本课范围）"
        },
        {
          "en": "minmax()",
          "zh": "Grid 专用函数：给轨道设最小与最大尺寸，只允许用于四个 grid 轨道属性"
        },
        {
          "en": "clamp()",
          "zh": "通用三值函数（最小, 理想, 最大）：不限 Grid，任何长度值都能夹逼"
        },
        {
          "en": "auto-fit / auto-fill",
          "zh": "repeat() 的特殊次数值：按容器宽度自动算出最多能放几列；两者的差别只在项目填不满一行时显现"
        }
      ],
      "tasks": [
        "跟着官方把实验台搭起来：5×2 网格 + resize: both，之后每个属性都拖动容器角看实时效果（CodePen 缩放调到 0.5x / 0.25x）",
        "把手写的五段 150px 改写成 repeat(5, 150px)；再改成 repeat(2, 2fr) repeat(3, 1fr) 看不等分效果",
        "做一组 fr 实验：全 1fr → 混入 200px 静态列 → 拖动容器，总结「静态先扣、剩余按份分」",
        "分别用 min(200px, 50%)（行）与 max(120px, 15%)（列）给轨道设上限与下限，拖动观察什么时候「顶住」了",
        "把列轨道换成 minmax(150px, 200px) 与 clamp(150px, 20%, 200px) 各跑一遍，对比两者的伸缩区间",
        "重点实验：grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))，拖动容器数列数变化；再把 auto-fit 换成 auto-fill、把项目减少到两个，找出两者行为的分岔点",
        "读 CSS-Tricks Grid 指南的「CSS Grid Properties」「Special Units, Values, & Functions」「Subgrid」三节（官方 Assignment 第 1 条）",
        "玩 CSS Grid Garden 第 18–28 关（官方 Assignment 第 2 条，接上一课的 1–17 关）",
        "做 css-exercises 仓库 intermediate-html-css/advanced-grid 目录的 01-responsive-holy-grail 与 02-holy-grail-mockup 两个练习，按顺序（官方 Assignment 第 3 条；可查一切文档，别翻答案）"
      ],
      "quiz": [
        {
          "question": "repeat(2, 2fr) repeat(3, 1fr) 一共几列？空间怎么分？",
          "answer": "5 列：前 2 列各拿 2 份、后 3 列各拿 1 份，一共 2×2 + 3×1 = 7 份——前两列各占剩余空间的 2/7，后三列各占 1/7。容器变大变小时，**比例不变、像素同涨同跌**：前两列永远是后三列的两倍宽。repeat 的两个参数是「重复次数 + 每次的轨道定义」，可以连续多段混排。"
        },
        {
          "question": "minmax() 与 clamp() 都是「给尺寸设范围」，它们的关键区别是什么？",
          "answer": "两点：① **适用面**——minmax() 是 Grid 专用，只能用于 grid-template-columns / grid-template-rows / grid-auto-columns / grid-auto-rows 四个属性；clamp() 哪里都能用（任何长度值）。② **参数**——minmax(最小, 最大) 两个参数，轨道在两值之间随容器伸缩，全静态也合理；clamp(最小, 理想, 最大) 三个参数，中间多一个「理想值」（通常用动态单位如 %），只有理想值越界时才落到最小 / 最大兜底。"
        },
        {
          "question": "repeat(auto-fit, minmax(150px, 1fr)) 在内容盒宽 500px 时渲染几列？浏览器是怎么算的？",
          "answer": "3 列。官方拆解的三步：① 取容器**内容盒**宽度（不含 margin / border / padding）= 500px；② 用 minmax 的**最小值**算最多能塞下几列——500 ÷ 150 = 3.33，取最大可能正整数 3 列（第 4 列会溢出）；③ 列数定了之后，把每列从 150px **拉伸到最大值**——max 是 1fr，所以三列平分 500px，各约 166.7px。窗口尺寸一变，这三步实时重算。"
        },
        {
          "question": "auto-fit 与 auto-fill 什么时候才有可观察的差别？各是什么行为？",
          "answer": "只在**项目数量填不满一行**、而容器还有空间再放一列时：auto-fit 让现有项目**保持拉伸到 max**（用项目把行填满）；auto-fill 则不管有没有项目可放，都**保留空轨道位**——项目缩回 min 尺寸，空位留在行尾。项目够多能填满行时，两者渲染结果完全一样。"
        },
        {
          "question": "为什么给 min() / max() 全传静态值「很傻」？怎样才算用对？",
          "answer": "全静态时计算没有意义：min(100px, 200px, 500px) 永远返回 100px——结果恒定，等于直接写 100px。用对的方式是**掺进动态值**，让浏览器在运行时比较：min(200px, 50%) 意思是「取容器高的一半，但绝不超过 200px」（给行轨道设了上限）；max(120px, 15%) 是「至少 120px，容器够宽就按 15% 走」（设下限）。动态与静态相遇，函数才开始干活。"
        }
      ],
      "optional": [],
      "note": "本课中文讲解 12 章，达到本站长课章节导航阈值（≥12 章）：正文开头会自动出现「本课章节」目录。章数按官方结构自然形成（官方原文约 24 KB，是 Grid 章节最大的一课），未为凑或躲任何阈值增删。",
      "why": "前两课的网格是「静态」的：轨道尺寸写死、列数写死，容器一变就溢出或留白。这一课补齐的是 Grid 真正统治现代布局的原因——**一行声明做出会呼吸的网格**：repeat(auto-fit, minmax(150px, 1fr)) 这十来个字符，就是各大全站卡片流「宽屏五列、窄屏两列、手机一列」的底层答案。学完它，你手里就有了从「固定版面」到「响应式版面」的完整工具链，下一课讨论 Flexbox 与 Grid 怎么分工时，也才知道 Grid 这一侧的筹码是什么。",
      "sections": [
        {
          "h": "实验台：一个能拖动的 5×2 静态网格",
          "p": [
            "官方把这一课设计成**动手课**：先搭一个 5 列 × 2 行、每轨 150px 的网格，配上样式方便观察——之后每个新属性都在它身上做实验。",
            "实验台上有几个与本课知识无关、但要说明的样式：`resize: both` 让你能**拖容器右下角改变大小**（后面看动态属性全靠它）；`overflow: auto` 让容器缩到装不下网格时出现滚动条；`gap` 与 `padding` 留出沟槽方便看清每个项目；边框与背景色纯粹为了好看。",
            "官方提示：看 CodePen 嵌入时把缩放调到 **0.5x 或 0.25x**，留出拖拽的空间。",
            "现在的轨道定义是「手写五遍」：grid-template-rows: 150px 150px; grid-template-columns: 150px 150px 150px 150px 150px。本课就从这里的 tedious（烦）说起。"
          ]
        },
        {
          "h": "repeat()：说一次，重复 N 遍",
          "p": [
            "2×5 的网格手写十个值还不算累；想象一个要装几百个项目的网格，每行每列都手写一遍尺寸——那才是灾难。",
            "`repeat()` 是 Grid 模板属性专用的 CSS 函数：**报一个次数、报一份轨道定义**，批量生成轨道。手写五遍 150px 收敛成：",
            "grid-template-rows: repeat(2, 150px); grid-template-columns: repeat(5, 150px);",
            "两种写法完全等价——自己去 CodePen 里验证。repeat 还能与普通值、其它 repeat 段混排（后面 fr 一节就有现成例子）。"
          ]
        },
        {
          "h": "fr 分数单位：把剩余空间按份分",
          "p": [
            "会快速造轨道了，下一步让轨道**动起来**。这里的「动态（dynamic）」指灵活、随容器响应；反义词是「静态（static）」——固定尺寸，比如实验台的 150px。",
            "让项目动态化最基础的工具是**分数单位 fr（fractional unit）**：它分配的是网格里**剩下的全部空间**。",
            "官方的算例：四列网格总宽 400px，每列 1fr——四个项目各拿 400px 的**一份**，每列 100px。",
            "把实验台的 150px 全换成 1fr，拖动容器看：项目始终铺满整个网格的宽与高——容器多大，它们就多大。"
          ]
        },
        {
          "h": "不等分与混用：2fr、px + fr",
          "p": [
            "剩余空间也可以**不等分**：5 列里前两列给 2fr、后三列给 1fr——前两条轨道拿到的空间是后三条的两倍。写成一条就是：",
            "grid-template-columns: repeat(2, 2fr) repeat(3, 1fr);",
            "（官方在提示块里补了一句：这里继续用 repeat 只是顺手，老写法把五段全列出来也一样。）拖动容器：项目**按份数比例**伸缩，2fr 的永远是 1fr 的两倍宽。",
            "静态单位与动态单位也能混：比如一列 200px 定死、其余 1fr 分剩余——「侧栏定宽 + 主区弹性」的经典布局就是一行声明的事。"
          ]
        },
        {
          "h": "min-content：缩到极小时的底线",
          "p": [
            "拖动实验台你会发现一个细节：放大方向上项目可以无限大；**缩小方向上却有一个明显的极限**——小到某个尺寸就不再缩了。",
            "那个极限是项目内容的 **min-content** 值：`<p>` 或 `<img>` 不溢出所需的最小尺寸。这个 CSS 关键字非常有用，但展开讲超出本课范围——想深挖看资源卡里的 MDN min-content 文档（有官方中文版）。",
            "知道底线存在就好；下一节的问题是：**别依赖这个底线**——多小算多小、多大算多大，应该由你显式决定。"
          ]
        },
        {
          "h": "min() 与 max()：复习 + 动态值才是真本事",
          "p": [
            "这两个函数在「CSS 函数」一课学过：`min()` 返回参数里**最小**的值，`max()` 返回**最大**的——min(100px, 200px) 永远得 100px，max(100px, 200px) 永远得 200px；参数想给几个给几个。",
            "所以全给静态值**很傻**：计算毫无悬念，结果恒定——上例的网格行永远 100px、列永远 500px，不如直接写死。",
            "掺进**动态值**，函数才在 Grid 语境里解锁真正的潜力：",
            "grid-template-rows: repeat(2, min(200px, 50%)); —— 行高取「容器高的 50%」与「200px」中较小者。语义：行高跟着容器走，**但不许超过 200px**——相当于给轨道设了 max-height（上限）。",
            "grid-template-columns: repeat(5, max(120px, 15%)); —— 列宽取「容器宽的 15%」与「120px」中较大者。语义：列宽随容器伸缩，**但绝不窄于 120px**——设的是下限。",
            "拖动官方示例，看行与列分别在什么时候「顶住」不再变化。"
          ]
        },
        {
          "h": "minmax()：Grid 专用的轨道范围",
          "p": [
            "`minmax()` 是**只服务于 Grid** 的函数，允许出现的位置只有四个属性：grid-template-columns、grid-template-rows、grid-auto-columns、grid-auto-rows。",
            "两个参数直白：**轨道最小能到多少、最大能到多少**。与 min() / max() 不同，minmax 的两个参数**全用静态值也完全合理**：",
            "grid-template-columns: repeat(5, minmax(150px, 200px));",
            "效果：容器横向伸缩时列宽跟着变，但**缩到 150px 为止、涨到 200px 封顶**——轨道被夹在区间里。官方的感叹是：Talk about flexibility!（这才叫弹性。）"
          ]
        },
        {
          "h": "clamp()：三值夹逼，哪里都能用",
          "p": [
            "`clamp()` 与 minmax 相对：**不限 Grid，任何长度值都能用**。语法三个参数：clamp(最小, 理想, 最大)——尺寸先按「理想值」走，越界才落到最小 / 最大兜底。",
            "因为目的是「带约束的弹性尺寸」，**理想值通常用动态单位**；最小 / 最大通常用静态值（动态值也允许）。",
            "非网格的例子先感受形状：.non-grid-example { width: clamp(500px, 80%, 1000px); } —— 宽度是父容器的 80%，但不低于 500px、不高于 1000px。",
            "搬进网格：grid-template-columns: repeat(5, clamp(150px, 20%, 200px)); —— 轨道保持容器宽的 20%，直到顶住 150px 下限或 200px 上限。拖动示例，观察「跟着 20% 走」与「顶住不动」两段行为。",
            "官方点题：minmax 与 clamp 是让网格**响应式**的绝佳手段——伸缩自如，同时不撞上让页面变难看的关键断点；图片与容易溢出的元素被推到极端尺寸时尤其需要这层保险。"
          ]
        },
        {
          "h": "auto-fit 与 auto-fill：列数不再写死",
          "p": [
            "这两个值其实是 `repeat()` 规范的一部分，官方压轴才讲——因为要先懂 minmax() 才看得出它们的用处。",
            "用例一句话说清：**让列数随容器尺寸自动定**。容器 200px 宽就一列、400px 就两列……以此类推。",
            "按 W3 规范（资源卡里有原文 #auto-repeat 一节）：auto-fill 与 auto-fit 都返回「**不让项目溢出容器的最大可能正整数**」（the largest possible positive integer）。",
            "先看定宽版本：容器 1000px、repeat(auto-fit, 200px)——只要有至少五个项目，永远渲染 5 列（这个场景下 auto-fill 结果相同，差别稍后讲）。",
            "真正的魔法要配上 minmax()：告诉网格「列数尽可能多，每列尺寸按 minmax 的约束来，但别溢出」——",
            "grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));",
            "拖动官方示例：列数随宽度**自动增减**，每列还自动伸缩铺满。官方的原话：如果你觉得这都不酷，最好摸摸自己的脉搏！"
          ]
        },
        {
          "h": "拆开看：repeat(auto-fit, minmax(150px, 1fr)) 到底算了什么",
          "p": [
            "官方逐步拆解了这行「魔法」的计算过程，值得慢慢过一遍：",
            "第一步：浏览器取网格**内容盒**的宽度——不算 margin、border、padding。设它是 500px。",
            "第二步：算这个宽度**最多塞得下几条列轨道**。用 minmax 的**最小值**算（最小值出的列数最多）：500 ÷ 150 = 3.33 → **3 列**（auto-fit 返回的最大可能正整数；第 4 列需要 600px，会溢出）。",
            "第三步：列数定了，再把每列**从最小值拉伸到最大值**——我们的 max 是 1fr，于是三列平分全部可用空间，各约 166.7px。",
            "窗口每变一次，这三步就实时重算一次——这就是拖动时列数与列宽同时「活」起来的原因。"
          ]
        },
        {
          "h": "auto-fill 呢？差别只在填不满的时候",
          "p": [
            "大多数情况下，`auto-fill` 与 `auto-fit` **行为完全一致**。差别只在一种场景能被看见：**项目数量填不满一整行**、而容器宽度还有富余时。",
            "当网格被拉宽到「还能再放一列」而项目已经用完：",
            "**auto-fit**：现有项目**保持在 max 尺寸**——把整行填满，不留空位。",
            "**auto-fill**：项目**缩回 min 尺寸**，把空出来的轨道位保留着（哪怕没有项目可渲染）；容器继续变宽，它继续「预留 → 缩回」的循环。",
            "官方给了两个并排示例（一个 auto-fit、一个 auto-fill），横向拖动对比——分岔点肉眼可见。",
            "选择口径：想让项目撑满行宽用 fit；想保持项目尺寸、给未来的新项目留位用 fill。"
          ]
        },
        {
          "h": "收尾：Grid Master 之路",
          "p": [
            "官方结语：到这里，你已经走在成为 **Grid Master** 的路上了。",
            "回头串一遍主线：repeat 让轨道**写起来**省（说一次重复 N 遍）→ fr 让轨道**会伸缩**（按份分剩余空间）→ min / max / minmax / clamp 让伸缩**有边界**（上下限与夹逼）→ auto-fit / auto-fill 让列数**自己定**（最大可能正整数）。",
            "四站走完，「一行声明的响应式网格」就没有秘密了——去 Assignment 里把 CSS-Tricks 的三个小节读完、Grid Garden 后半程打通、两个 holy grail 练习做掉，本章就只剩「Flexbox 与 Grid 怎么分工」一课和压轴项目了。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "css",
          "code": "/* repeat：手写五遍收敛成一条，可多段混排 */\n.grid-container {\n  display: grid;\n  grid-template-rows: repeat(2, 150px);\n  grid-template-columns: repeat(5, 150px);\n\n  /* 前 2 列各 2 份、后 3 列各 1 份（共 7 份）： */\n  /* grid-template-columns: repeat(2, 2fr) repeat(3, 1fr); */\n}",
          "note": "官方主线示例：从静态手写起步，为后面的 fr 与 auto 系列铺路。repeat 段之间、repeat 与普通值之间都能混排。"
        },
        {
          "lang": "css",
          "code": "/* fr 与静态单位混用：侧栏定宽 + 主区弹性 */\n.layout {\n  display: grid;\n  grid-template-columns: 200px 1fr 1fr;\n  /* 200px 先扣掉，剩余空间由两条 1fr 平分 */\n}\n\n/* 给轨道设上下限：min 封顶 / max 保底 / minmax 夹区间 */\n.bounded {\n  grid-template-rows: repeat(2, min(200px, 50%));   /* ≤200px */\n  grid-template-columns: repeat(5, max(120px, 15%)); /* ≥120px */\n  /* 或一条搞定区间：repeat(5, minmax(150px, 200px)) */\n}",
          "note": "三个函数分工：min() 设上限、max() 设下限、minmax() 设区间（Grid 四属性专用）。全静态参数时 min/max 结果恒定、意义不大——动态值参与才见真章。"
        },
        {
          "lang": "css",
          "code": "/* 一行声明的响应式卡片网格（本课的「魔法行」） */\n.card-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  gap: 16px;\n}\n/* 浏览器三步算：内容盒宽 → 按 150px 求最多列数 → 每列拉伸到 1fr 平分 */\n/* 把 auto-fit 换成 auto-fill：项目填不满一行时，空轨道位会被保留 */",
          "note": "各大全站「宽屏五列、窄屏两列、手机一列」的卡片流，底层就是这一行。fit 与 fill 只在项目数填不满一行时有可见差别。"
        },
        {
          "lang": "css",
          "code": "/* clamp：不限 Grid 的三值夹逼 */\n.non-grid-example {\n  width: clamp(500px, 80%, 1000px);\n  /* 理想 = 父容器的 80%；低于 500px 按 500px，高于 1000px 按 1000px */\n}\n\n.grid-container {\n  grid-template-columns: repeat(5, clamp(150px, 20%, 200px));\n  /* 轨道保持容器宽的 20%，顶住 150px 下限或 200px 上限才停 */\n}",
          "note": "clamp(最小, 理想, 最大) 与 minmax(最小, 最大) 的差别：多一个理想值、且哪里都能用。理想值用动态单位、两端用静态兜底是典型配法。"
        }
      ],
      "pitfalls": [
        {
          "title": "给 min() / max() 全传静态值",
          "text": "min(100px, 200px, 500px) 永远返回 100px——全静态时函数退化成一个常量，写了等于没写。这两个函数的价值在「动态值与静态值相遇」：min(200px, 50%) 才是上限，max(120px, 15%) 才是下限。检查口诀：参数里至少要有一个会随环境变的值（% / fr / vw / vh 等）。"
        },
        {
          "title": "把 minmax() 用到 Grid 之外的属性上",
          "text": "minmax() 是 Grid 专用函数，合法位置只有 grid-template-columns / grid-template-rows / grid-auto-columns / grid-auto-rows 四个。写在 width 或 font-size 上不会生效——那些场景要用的是 clamp()（三值、通用）。"
        },
        {
          "title": "repeat(auto-fit, 200px) 期望得到响应式，结果列数不变",
          "text": "定宽轨道的 auto-fit 只是「按 200px 算能塞几列」，列宽本身不会伸缩；真正的响应式组合是 auto-fit/auto-fill **配 minmax**——minmax(150px, 1fr) 让列数自动定的同时每列还能拉伸铺满。少了 minmax 这一段，网格要么溢出要么留大片空白。"
        },
        {
          "title": "认为 auto-fit 与 auto-fill 可以无脑互换",
          "text": "项目填得满行时两者确实一样；**填不满**时分道扬镳：fit 把项目拉伸到 max 填满行，fill 让项目缩回 min、保留空轨道位。卡片数量少又想让卡片撑满整行的场景，错用 fill 会得到一排「缩在左边的小卡 + 右边一串空位」。"
        },
        {
          "title": "忘记 fr 分配的是「剩余」空间",
          "text": "混排 200px 1fr 1fr 时，fr 分的是**扣掉静态轨道与 gap 之后**剩下的空间，不是容器全宽。按全宽心算列宽会对不上——先扣静态、再按份分，顺序不能反。"
        }
      ],
      "official": {
        "assignment": [
          "读 CSS-Tricks Grid Layout 指南中的「CSS Grid Properties」「Special Units, Values, & Functions」与「Subgrid」三节（无官方中文版，资源卡内有本站中文导读；该页与上一课 Assignment 是同一份指南的不同小节）。",
          "玩 CSS Grid Garden 第 18 到 28 关，继续练习定位项目（接上一课的 1–17 关）。",
          "按顺序做我们 CSS exercises 仓库 intermediate-html-css/advanced-grid 目录里的练习：01-responsive-holy-grail、02-holy-grail-mockup（说明在 README 里）。做练习时请用上一切你需要的文档与资源——现阶段不要求背下这些属性，查文档、搜索都行（除了翻答案）。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/grid/advanced_grid_properties.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "55f75a3d70db6c8f788fbe7557e3bf9ab2f191a4918e066807e6c10a7cb9ad29",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-using-flexbox-and-grid",
      "title": "Using Flexbox and Grid",
      "zh": "搭配使用 Flexbox 与 Grid",
      "group": 3,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-using-flexbox-and-grid",
      "summary": "Grid 章节的收官讨论课：「Grid 与 Flexbox 谁更强」是个伪辩题——两者是互补工具，各有各的位置。判断口径是**内容优先还是布局优先**：从内容出发（项目怎么伸缩、怎么相互让位）选 Flexbox，布局是弹出来的结果；从版面出发（先定好行列格局、再往里填内容）选 Grid，内容只能填进轨道。一维布局用 Grid 也能做且漂亮，但要挪动项目、控制伸缩时 Flex 更直觉。两者还能**嵌套搭配**：外层 Grid 精确摆放大区块，区块内部再用 Flex 自由排内容。官方收尾：这些是建议不是对错——多写项目，形成自己的判断。",
      "guide": "以下是官方原课的中文化梳理，带可动手的代码片段与常见错误卡片。这一课没有新属性，讲的是「怎么选工具」：一个判断口径（内容优先 / 布局优先）、一个事实（一维布局两者都行、各有所长）、一个组合技（外 Grid 内 Flex），最后是官方的收尾观点——推荐不是教条，判断力靠多写项目练出来。这一课学完，Grid 章节只剩压轴的仪表盘项目。本课的外部资料与练习入口都在「官方任务」一节末尾的「本课外部资料」。",
      "understand": [
        "「Grid vs Flexbox 谁取代谁」的争论是伪命题：官方立场是两者**互补**（complementary tools），在 CSS 世界里各有各的位置",
        "选工具看设计从哪头出发：**内容优先**（content first）——先想清内容本身怎么伸缩、怎么相互让位，布局随之弹出来 → Flexbox 的主场；**布局优先**（layout first）——先定好区块怎么摆，再往里填内容 → Grid 的主场",
        "Flexbox 给你的是对内容**行为**的控制：grow / shrink、理想尺寸、相互位置关系——最终布局是容器尺寸的「结果」，容器一变布局可能大变",
        "Grid 给你的是对**版面**的控制：定义行列轨道后，内容只能填进显式或隐式轨道留出的空间——大格局先定，心里有整张图",
        "内容优先 / 布局优先**不强制**你用哪个工具：一维的一排盒子用 Grid 也能摆（官方演示：能做且漂亮）；但想日后挪盒子、让第三个盒子换行拉伸时，Grid 也做得到——只是当「控制布局」不是优先项时，Flexbox 更直觉、更称手",
        "嵌套搭配是常规操作：整体版面用 Grid（两维精确摆放），**网格项目自己再当 flex 容器**——区块内部的内容用 Flex 自由流动；两层各管各的，互不打架",
        "官方收尾观点：本课给的是**推荐**（recommendations），不是「对 / 错」——最终取决于个人偏好与开发者对具体任务的手感；两个工具都进工具箱之后，最好的学习法是多写项目、形成自己的判断"
      ],
      "terms": [
        {
          "en": "content first design",
          "zh": "内容优先设计：从「内容应该怎么表现」出发，布局随之而来——Flexbox 的适用信号"
        },
        {
          "en": "layout first design",
          "zh": "布局优先设计：先决定区块怎么摆、再填内容——Grid 的适用信号"
        },
        {
          "en": "complementary tools",
          "zh": "互补工具：Grid 与 Flexbox 的关系定位——不是谁取代谁，而是各有位置、可以配合"
        },
        {
          "en": "nesting layouts",
          "zh": "布局嵌套：网格项目同时做 flex 容器（或反过来）——外层管大格局、内层管内容流"
        }
      ],
      "tasks": [
        "读完本站讲解，把「内容优先 → Flex / 布局优先 → Grid」的判断口径记住——这是本课唯一要带走的心法",
        "重看你最近做过的一个布局（比如 Landing Page 项目），逐块标注：哪块是内容优先、哪块是布局优先、当时用的工具选得对不对",
        "练一次嵌套：外层 Grid 摆三个区块，其中一个区块内部用 Flex 排一行导航——体会「两层各管各的」",
        "读 CSS-Tricks 的 Does CSS Grid Replace Flexbox?（官方 Assignment 第 1 条，标题就是本课结论的反问式表达）",
        "看 Kevin Powell 的视频：Grid 与 Flexbox 的真实世界用例（官方 Assignment 第 2 条，英文视频）",
        "读 Tuts+ 的 Flexbox vs CSS Grid: Which Should You Use and When?（官方 Assignment 第 3 条，「何时用哪个、为什么」的系统版）"
      ],
      "quiz": [
        {
          "question": "「内容优先」与「布局优先」分别指向哪个工具？各自的理由是什么？",
          "answer": "内容优先 → **Flexbox**：你关心的是项目的行为（怎么伸缩、理想尺寸、相互让位），布局是这些弹性规则作用后的**结果**——容器尺寸一变，布局跟着变，这正是内容驱动想要的。布局优先 → **Grid**：你先决定区块的摆放格局（行列轨道），内容只能填进轨道留出的空间——大格局由你完全掌控，适合「心里已有整张图」的场景。"
        },
        {
          "question": "一维的一排盒子，用 Grid 摆行不行？官方对这种场景的建议是什么？",
          "answer": "行——官方专门演示了用 Grid 摆一维项目，「能做，而且漂亮」。但建议是：如果后续想挪动盒子、或想让某个盒子换行拉伸而其它盒子不过度收缩，Grid 也都做得到，**只是当控制布局不是优先项时，Flexbox 更直觉、更称手**。一维内容流默认还是 Flex。"
        },
        {
          "question": "「整体版面用 Grid、卡片内部用 Flex」这种嵌套是官方推荐的用法吗？两层怎么分工？",
          "answer": "是——这正是官方「Combining flexbox and grid」一节的例子：网格项目同时充当 flex 父容器。分工：**Grid 层**负责两维精确摆放（卡片在版面里的位置），**Flex 层**负责卡片内部内容的自由排布（比如图标一行、标题描述一列）。两层各管各的：外层挪卡片不影响内部排布，内部改排版不影响外层格局。"
        },
        {
          "question": "官方在本课结尾对「到底该用哪个」给出的最终答案是什么？",
          "answer": "没有标准答案——官方明说本课给的是**推荐**（recommendations），不是「对 / 错」的用法：最终取决于个人偏好和开发者对具体任务觉得哪个更顺手。两个工具都已进你的工具箱，你也见过它们单独与配合使用的样子；剩下的路是**多做项目**，在实践里形成自己的判断。"
        }
      ],
      "optional": [],
      "note": "",
      "why": "工具学会了，剩下的问题是「什么时候拿哪把」。这一课给的不是属性而是判断力：内容优先还是布局优先，一个问题就能把大多数选择定下来；定不下来的，嵌套——外 Grid 内 Flex——几乎总能兜底。它也负责给整个 Grid 章节收束情绪：官方的态度从头到尾是「推荐，不是教条」，这与本章导读课的结论（Grid 是工具袋里的又一件工具，不是 Flexbox 的替代品）首尾呼应。带着这套判断口径去做仪表盘项目，你会发现自己不再纠结「这块用 Grid 还是 Flex」——答案会自己浮出来。",
      "sections": [
        {
          "h": "伪辩题：谁取代谁",
          "p": [
            "有人会说，Grid 与 Flexbox 之间存在一场「谁更优越、谁取代谁」的辩论。官方的回答很干脆：**现实里两者是互补的工具**（complementary tools），可以协同工作，在 CSS 的世界里各有各的位置。",
            "这一课就做三件事：给你一个选工具的判断口径、演示一次两者的嵌套搭配、然后诚实告诉你——这些都是建议，不是对错。"
          ]
        },
        {
          "h": "判断口径：内容优先还是布局优先",
          "p": [
            "在 Grid 与 Flexbox 之间做选择，一个有效的思路是看你的设计**从哪头出发**：从内容出发，还是从布局出发。",
            "**内容优先设计（Content First Design）**：先想清楚内容本身应该怎样，布局随之而来。这是 Flexbox 的大好场景——它的弹性本质让你控制项目的**行为**：怎么放大、怎么收缩、理想尺寸多大、相互之间的位置关系。布局因此是「活」的：flex 容器的尺寸一变，整体布局可能变化很大——内容说了算。",
            "**布局优先设计（Layout First Design）**：先决定各个区块怎么摆，再往里填内容。这是 Grid 发光的场景——定义好行与列的轨道，你对布局有**完全的控制**；网格里的内容只能填进显式或隐式轨道留出的空间。心里已经有容器的整张大图时，Grid 是不二的选择。"
          ]
        },
        {
          "h": "口径不站队：一维布局用 Grid 也成立",
          "p": [
            "注意：内容优先 / 布局优先**并不强制**你只能用某一个工具。官方现场演示：用 Grid 摆一维的一排项目——很多人以为一维是 Flexbox 的专属——结果是「能做，而且**漂亮**」。",
            "但接着官方把话锋转回来：想象你之后想**挪动这些盒子**的位置，或者想让第三个盒子**换行拉伸**到第二行、免得所有盒子在一行里被挤得太瘦——这两件事 Grid 都**做得到**；可是当「控制布局」并不是你的优先项时，**Flexbox 更直觉、更称手**。",
            "这就是口径的正确用法：它给出默认选择（一维内容流默认 Flex、两维版面默认 Grid），但不禁止另一种——按任务的实际重心选。"
          ]
        },
        {
          "h": "组合技：外层 Grid，内层 Flex",
          "p": [
            "两者真正的默契在**嵌套**：一维的内容交给 Flex 控制排布，两维的复杂版面交给 Grid 精确摆放——同一个页面里两层并存。",
            "官方给的形态：整体布局是一张网格，而**网格项目自己充当 flex 父容器**。这样，项目用 Grid 的两维精确摆位挪到该在的地方，项目**内部**的内容再用 Flex 自由流动。",
            "外层管大格局、内层管内容流，两层互不打架——你之前做的「网格套网格」是同一思路的 Grid 版；套 Flex 同样天经地义。官方示例就来自 CSS-Tricks 的一个 CodePen（卡片外框走 Grid、卡片内容走 Flex）。"
          ]
        },
        {
          "h": "官方收尾：推荐，不是对错",
          "p": [
            "官方的结语值得原样转述：本课包含的是**推荐**（recommendations），不是使用 Flexbox 或 Grid 的「对 / 错」之道。",
            "说到底，选择取决于**个人偏好**，取决于开发者觉得哪个对眼前任务更顺手。此刻你已经把两件工具都收进工具箱，也见过它们单独使用与配合使用的样子。",
            "学会 Flexbox 与 Grid 的最好方式，是**用它们多写项目**——在不同场景里各用几次，形成你自己在各种情况下「用哪个」的判断。下一章的仪表盘项目，就是第一次正式的综合演练。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "css",
          "code": "/* 一维布局的 Grid 写法：成立，但通常 Flex 更直觉 */\n.one-d-grid {\n  display: grid;\n  grid-auto-flow: column;      /* 项目沿列方向排（一维） */\n  gap: 12px;\n}\n\n.one-d-flex {\n  display: flex;               /* 同一需求的一维经典解 */\n  gap: 12px;\n}",
          "note": "官方用 Grid 摆一排盒子的演示说明：一维不是 Flex 的专属。但当「控制布局」不是优先项（只想让内容排成一行、能伸缩）时，Flex 的语义更直接。"
        },
        {
          "lang": "css",
          "code": "/* 外 Grid 内 Flex：两层各管各的 */\n.page {\n  display: grid;\n  grid-template-columns: 200px 1fr;   /* Grid 层：侧栏 + 主区的两维格局 */\n  grid-template-rows: auto 1fr;\n}\n\n.card {                                /* 卡片是网格项目，同时是 flex 容器 */\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;      /* Flex 层：卡片内部内容自由排布 */\n}",
          "note": "官方组合技的形状：网格项目自己充当 flex 父容器——外层用 Grid 精确摆区块，内层用 Flex 排内容。挪卡片不动内部、改内部不动格局。"
        }
      ],
      "pitfalls": [
        {
          "title": "陷入「哪个更强」的立场之争",
          "text": "官方开篇就拆了这个题：两者互补，各有位置。争论「Grid 是否取代 Flexbox」（Assignment 第一篇阅读材料的标题就是反问句）没有产出——产出的是判断口径：这块布局是内容优先还是布局优先，以及要不要嵌套。"
        },
        {
          "title": "所有布局无脑上 Grid",
          "text": "Grid 什么都能摆，不等于什么都该用它摆：一条导航、一排按钮这类一维内容流，Flex 的 grow / shrink / align 语义更直接、代码更少。「能做」与「称手」是两回事——官方演示一维 Grid 正是为了说明选择权在你，而不是逼你统一工具。"
        },
        {
          "title": "觉得嵌套两层布局是混乱的信号",
          "text": "恰恰相反：外 Grid 内 Flex 是官方示范的正规组合技，也是真实项目里最常见的形态。两层职责分明——外层管两维格局、内层管一维内容流；发现自己在单层里跟对齐细节搏斗时，往往正是该拆两层的时候。"
        }
      ],
      "official": {
        "assignment": [
          "读 CSS-Tricks 的 Does CSS Grid Replace Flexbox?（CSS Grid 会取代 Flexbox 吗——标题即本课结论的反问式表达；无官方中文版，资源卡内有本站中文导读）。",
          "看 Kevin Powell 的这条视频：Grid 与 Flexbox 在真实世界里的用例（英文视频，资源卡内有本站导读）。",
          "读 Tuts+ 的 Flexbox vs CSS Grid: Which Should You Use and When?（何时用 Grid、何时用 Flexbox、为什么；无官方中文版，资源卡内有本站中文导读）。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/grid/using_flexbox_and_grid.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "e3c1853e598bb83680d7c4ec156ee8dda3f0e78659fcc58086fe66252c04ea03",
        "verifiedAt": "2026-09-26"
      }
    },
    {
      "id": "node-path-intermediate-html-and-css-admin-dashboard",
      "title": "Project: Admin Dashboard",
      "zh": "项目：管理仪表盘",
      "group": 3,
      "url": "https://www.theodinproject.com/lessons/node-path-intermediate-html-and-css-admin-dashboard",
      "summary": "World 2「中级 HTML 与 CSS」的压轴项目：照官方设计图从零做一个完整的管理仪表盘（dashboard）页面——左侧边栏、顶栏（搜索 + 用户信息 + 按钮）、主内容区（项目卡片 + 公告 + 趋势）。工具随你挑，但官方要求**布局的主力必须是 Grid**：先摆三大块的宏观网格，再逐区嵌套内层网格（网格套网格）细化到导航、搜索栏、卡片流。不必像素级还原、不要求响应式（想做可以加）、图标从 Material Design Icons 下载 SVG、字体自选（示例用 Roboto）。做完推上 GitHub 并用 GitHub Pages 发布。本站不提供成品代码：正文只有官方要求的中文化、推进顺序拆解与验收清单。",
      "guide": "以下是官方原课要求的中文化梳理与拆解。这是 Project 课：**本站不提供成品代码**，正文只把官方六步要求逐步讲清、给出推进顺序建议与验收清单，代码全部由你自己写。设计图需要你自己下载（官方给了全分辨率地址，在「官方任务」里）——布局细节以那张图为准，本站刻意不复述图里的具体栏目与间距，避免你用二手描述代替一手设计稿。这个项目是整个 World 2 的毕业考：四个章节（中级 HTML 概念 / 中级 CSS 概念 / 表单 / Grid）学过的东西都会被自然用到，而官方点名的主角是 Grid。",
      "understand": [
        "项目目标：把练了整整一个章节的 Grid 用足——做一个**完整的仪表盘设计**；官方原话：需要什么工具就用什么工具，但**布局工作的主力尽量压在 Grid 上**",
        "生疏了就回头：官方明确说可以回看之前的课程或练习作业再动手——这个项目的定位是「综合演练」，不是「闭卷考试」",
        "推进主线是官方六步：准备与规划 → 用 Grid 摆三大块 → 逐区嵌套内层网格 → 收集素材（图标 / 字体）→ 五条提示 → 提交课程反馈",
        "宏观结构三大块：**sidebar（侧边栏）、header（顶栏）、main-content（主内容区）**——先把这三个容器的 HTML 写出来，再用 Grid 把基本布局摆好；这是整个项目的骨架",
        "细化的手法是**嵌套**：一个区一个区来，把子元素挂进父元素；侧边栏内部再用网格排「导航 + 品牌区」，顶栏内部再用网格排「搜索栏 + 用户信息 + 按钮」，主内容区内部再用网格排「项目卡片 + 公告 + 趋势」——网格容器里套网格容器，上一章学的东西在这里全部汇合",
        "素材口径：图标从 Material Design Icons（Pictogrammers）按名搜索、下载 SVG；字体自选——官方示例用 Roboto（Google Fonts 可取），引入外部字体的做法回看「更多文本样式」一课",
        "官方五条提示划清边界：给容器加背景色或边框帮助可视化网格；轨道用 px 还是 fr 由你；**不要求响应式**（想做的话，可以让项目卡片区域随窗口伸缩）；**不必像素级还原**设计图（把它当成练自己 CSS 手感的机会）；做完推 GitHub、用 GitHub Pages 发布",
        "本站红线：不提供成品代码——三大块怎么摆、内层网格怎么分、卡片怎么做，全部由你自己实现；卡住时回看本章前四课与「本课外部资料」，不要找现成答案"
      ],
      "terms": [
        {
          "en": "dashboard",
          "zh": "仪表盘：把多类信息（导航、数据卡片、公告、趋势）汇总在一屏的管理页面——本项目的交付物形态"
        },
        {
          "en": "sidebar / header / main content",
          "zh": "侧边栏 / 顶栏 / 主内容区：仪表盘设计的三大宏观区块，也是本项目外层网格的三个大格子"
        },
        {
          "en": "nested grids",
          "zh": "嵌套网格：网格项目自己再设 display: grid——官方 Step 3 的细化手法，「你可以一直往网格里套网格」"
        },
        {
          "en": "placeholder content",
          "zh": "占位内容与占位图：先把格子填上假内容，定位所有网格项目——结构对了再谈美化"
        },
        {
          "en": "pixel perfect",
          "zh": "像素级还原：与设计图逐像素一致——官方明确**不要求**，本项目重在布局练习"
        }
      ],
      "tasks": [
        "第一步 · 准备与规划：建 git 仓库（生疏就回看之前的项目）；建 HTML 与 CSS 文件、放占位内容确认两边正确关联；下载全分辨率设计图（官方 Assignment 里有地址），对着图想清楚 HTML 文档要怎么分块布局",
        "第二步 · 宏观布局：写出 sidebar、header、main-content 三大块的 HTML 元素；在 CSS 里用 Grid 属性把这三块的基本布局摆出来",
        "第三步 · 逐区嵌套：一个区一个区来，把子元素挂进父元素——侧边栏内用网格排导航与品牌区；顶栏内用网格排搜索栏、用户信息与按钮；主内容区内用网格排项目卡片、公告与趋势条目",
        "填占位内容与占位图，把所有网格项目先定位到位——结构验收通过后再进入美化",
        "第四步 · 收集素材：网格布局完成后，可以照设计图还原，也可以做自己的设计；图标从 Material Design Icons（Pictogrammers）下载 SVG；字体自选（示例是 Roboto，Google Fonts 可取；引入方法回看「更多文本样式」一课）",
        "第五步 · 对照官方五条提示自查：容器加过背景色 / 边框可视化网格了吗；px 还是 fr 想清楚了吗；要不要加响应式（不要求）；接受「不必像素级还原」了吗；完成后 push 到 GitHub 并用 GitHub Pages 发布了吗",
        "第六步 · 提交官方课程反馈表（Intermediate HTML and CSS 课程反馈，地址在「官方任务」里）——官方非常希望听到你对这门课的意见",
        "做完在本站勾选「本课已完成」，并回看验收清单逐项打钩"
      ],
      "quiz": [
        {
          "question": "官方对「用什么工具做这个项目」的要求是什么？",
          "answer": "官方原话：需要什么工具就用什么工具（use whatever tools you need），但**布局工作的主力尽量压在 Grid 上**（lean on Grid for the majority of the layout work）。也就是说：细节修饰可以用你顺手的任何手段，但三大块的宏观布局与各区的内部排布应当由 Grid 承担——这正是本章五课练的东西。生疏了可以回看课程或练习作业，官方明确允许。"
        },
        {
          "question": "官方 Step 3「嵌套」的具体做法是什么？三大区各自的内层网格排什么？",
          "answer": "一个区一个区来（one section at a time），把子元素在 HTML 里挂进父元素，记住**网格容器里可以继续做网格容器**。分区任务：侧边栏——用更多网格排「导航」与「品牌区」；顶栏——排「搜索栏、用户信息、按钮」；主内容区——排「项目卡片、公告、趋势条目」。最后填占位内容与占位图，把所有网格项目定位到位。"
        },
        {
          "question": "这个项目要求响应式吗？要求像素级还原设计图吗？",
          "answer": "都**不强制**。响应式：官方明说「这个项目不必是响应式的」——但如果你想练，可以让项目卡片区域随浏览器窗口缩放而扩展或收缩（上一章 auto-fit + minmax 正好用得上）。像素级还原：官方明说「不必与设计图像素级一致」，并把它定位成「用你自己的设计练 CSS 手感的机会」。唯一明确的发布要求是：push 到 GitHub、用 GitHub Pages 发布到线上。"
        },
        {
          "question": "图标和字体分别从哪来？",
          "answer": "图标：Material Design Icons（Pictogrammers 站点）——按名搜索、下载 SVG，官方说「全部图标及更多都能在这下到」。字体：完全自选；官方示例用 Roboto，Google Fonts 上有——怎么把外部字体引回项目，回看「更多文本样式」一课（Web 字体与字体栈那两节）。"
        }
      ],
      "optional": [],
      "note": "本课为 Project 红线课：examples 为空数组，本站不提供成品代码（三大块的宏观网格、各区内层网格、卡片与公告的排布、侧边栏导航，全部由你自己写）；正文只提供官方六步要求的中文化、推进顺序拆解与验收清单。官方明确的两条宽松边界照办：不要求响应式；不必像素级还原设计图。官方另有一条课程反馈表（Step 6），属课程行政环节、不是学习内容，本站在「官方任务」里如实转达。",
      "why": "这是 World 2 的毕业考，也是你第一个「整页级」的 Grid 实战。之前的练习都在单点发力——一道 holy grail、一个卡片流；仪表盘则要求你把整章的工具链串成流水线：先看懂设计图（规划）、再用外层网格定三大块（结构）、再逐区嵌套细化（递归拆解）、最后收素材做美化（呈现）。这个「宏观定格局、微观再嵌套」的做事顺序，比任何单个属性都更接近真实工作里的布局开发；而官方「不必像素级、不要求响应式」的两条松绑，恰恰把注意力逼回到唯一重要的事情上——**用 Grid 把结构做对**。做完它，「中级 HTML 与 CSS」这门课就完整收官了。",
      "sections": [
        {
          "h": "这是个什么项目",
          "p": [
            "官方的开场：Grid 已经练得够多了，现在来做一个**完整的仪表盘设计**（full dashboard design）。",
            "工具政策很宽松：**需要什么工具就用什么**——但官方要求你**尽量把布局工作的主力压在 Grid 上**（lean on Grid for the majority of the layout work）。",
            "生疏了怎么办：官方明确说，需要复习就**回看之前的课程或练习作业**——这个项目是综合演练，不是闭卷考试。",
            "交付形态：照官方设计图（Assignment 里给了全分辨率下载地址）做出一个仪表盘页面——左侧边栏、顶栏、主内容区三大块，块内各有细分内容。**布局细节以你下载的设计图为准**，本站不复述图里的具体栏目与间距。"
          ]
        },
        {
          "h": "Step 1：准备与规划（官方 Step 1: Set up and planning）",
          "p": [
            "官方第一步三条，逐条中文化：",
            "1. **建好你的 git 仓库**（需要复习就回看之前的项目怎么建的）。",
            "2. **建好 HTML 与 CSS 文件，放一些占位内容**——只为确认两边正确关联（样式真的作用到页面上）。",
            "3. **下载全分辨率的设计图**（官方给了地址），对「HTML 文档里要怎么布局」**形成大致想法**。",
            "第 3 条是这一步的重心，也是最容易被跳过的一步：不要下载完图就开始写代码。先对着图问自己——整页分几大块？每块在文档里是什么容器？三大块之间用几行几列的外层网格？哪些区块之后需要自己的内层网格？把答案在纸上或注释里写下来，后面每一步都有据可依。"
          ]
        },
        {
          "h": "Step 2：用 Grid 摆出三大块（官方 Step 2: Layout）",
          "p": [
            "官方第二步两条：",
            "1. **先写出三大块容器的 HTML 元素**：sidebar（侧边栏）、header（顶栏）、main-content（主内容区）。",
            "2. **在 CSS 文件里运用 Grid 属性，把这个基本布局搭出来**。",
            "这一步的产物应当是一个「空但结构正确」的页面：三大块各占各的格子，比例接近设计图。给每个容器加上背景色或边框（官方提示第 1 条）——可视化你的网格，确认外层格局对了再往下走。",
            "轨道用 px 还是 fr，官方说**由你决定**（提示第 2 条）：定宽侧栏 + fr 主区是最常见的搭配，但两种都试试看，感受差别。"
          ]
        },
        {
          "h": "Step 3：嵌套——网格里再做网格（官方 Step 3: Nesting）",
          "p": [
            "官方第三步五条，是本项目工作量最大的一步：",
            "1. **一个区一个区来**（one section at a time），把子元素在 HTML 里挂进父元素。记住：**网格容器里可以继续做网格容器**。",
            "2. **侧边栏**：用更多网格排「导航」与「品牌区」两块。",
            "3. **顶栏**：用更多网格排「搜索栏、用户信息、按钮」。",
            "4. **主内容区**：用更多网格排「项目卡片、公告、趋势条目」。",
            "5. **填占位内容与占位图**，把所有网格项目定位到位。",
            "节奏建议：每完成一个区，退后看一眼整体——嵌套网格最容易犯的错是在某个内层里越改越深、忘了外层格局已经歪了。占位内容阶段不追求好看，追求**每个格子都有东西、每个东西都在该在的格子里**。"
          ]
        },
        {
          "h": "Step 4：收集素材（官方 Step 4: Gather assets）",
          "p": [
            "官方第四步三条：",
            "1. **网格布局完成后**，你可以照上面的仪表盘示例还原，**也可以做你自己的设计**——两条路都合法。",
            "2. **图标**：全部图标及更多，都能从 **Material Design Icons**（Pictogrammers 站点）下载为 SVG——按名搜索、直接下文件（资源卡里有直达入口）。",
            "3. **字体自选**：设计示例用的是 **Roboto**，Google Fonts 上有。怎么把外部字体引入项目，回看「更多文本样式」一课的 Web 字体与字体栈两节。",
            "顺序提醒：素材是**布局完成之后**的事——先结构后美化，是官方六步里藏着的纪律。"
          ]
        },
        {
          "h": "Step 5：官方五条提示（逐条中文化）",
          "p": [
            "官方 Step 5「Some tips!」五条，逐条中文化：",
            "1. **搭布局时，给容器加背景色或边框**——帮你把网格「看见」。",
            "2. **轨道用像素、fr 还是两者混用，由你决定。**",
            "3. **这个项目不要求响应式**；但如果你想做，可以让项目卡片区域在窗口缩放时扩展或收缩（上一章 repeat(auto-fit, minmax(...)) 的用武之地）。",
            "4. **不必与设计图像素级一致**——把它当成用你自己的设计练 CSS 手感的机会。",
            "5. **别忘了把完成的仪表盘 push 到 GitHub，并用 GitHub Pages 发布**给全世界看。"
          ]
        },
        {
          "h": "Step 6：课程反馈表（官方 Step 6: Section feedback）",
          "p": [
            "官方最后一条：继续往下走之前，官方**非常希望你提交对「中级 HTML 与 CSS」课程的反馈**（一份 Google 表单，地址在「官方任务」第 6 步里）。",
            "这是课程的行政环节、不是学习内容——但反馈会直接影响官方怎么改这门课，花两分钟值得。"
          ]
        },
        {
          "h": "验收清单（本站整理）",
          "p": [
            "对照官方六步，本站把「做完」拆成可打钩的清单：",
            "结构——三大块（sidebar / header / main-content）由**外层网格**摆放；三个区内部各有**嵌套网格**（侧边栏：导航 + 品牌；顶栏：搜索 + 用户信息 + 按钮；主区：项目卡片 + 公告 + 趋势）。",
            "内容——占位内容与占位图就位，所有网格项目定位到位；图标来自 Material Design Icons（SVG）；字体已按「更多文本样式」课的方法引入（示例 Roboto 或自选）。",
            "边界——没做响应式不算欠账（官方不要求）；与设计图有出入不算失败（官方明说不必像素级）；但如果加了响应式卡片区域，拖动窗口验证一下伸缩行为。",
            "交付——代码 push 到 GitHub；GitHub Pages 已发布、线上地址能打开；课程反馈表已提交（可选但官方很想要）。",
            "红线自查——全程自己写：本站不提供成品代码，网上翻到的完整实现不要抄——抄了不仅学不到东西，下一门课（JavaScript）会立刻暴露地基问题。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "跳过规划直接开写，写到一半推倒重来",
          "text": "官方 Step 1 第 3 条要求「对 HTML 文档怎么布局形成大致想法」，这一步最容易被当成废话跳过。仪表盘是三区嵌套结构，不先想清楚外层网格几行几列、哪些区要内层网格，写到主内容区时几乎必然返工。设计图下载后先花十分钟标区块，比写一小时再拆划算。"
        },
        {
          "title": "外层格局没验证就急着钻内层",
          "text": "嵌套网格的正确节奏是「外层对了再进内层」：三大块的位置与比例先靠背景色 / 边框可视化确认（官方提示第 1 条），再一个区一个区细化。反过来的话，内层做得越精致、外层歪掉的代价越大。"
        },
        {
          "title": "把「不必像素级还原」当成「结构也可以随便」",
          "text": "官方松绑的是**视觉细节**（间距、字号、配色可以按你的设计来），不是**结构要求**：三大块 + 各区嵌套网格 + 图标字体素材，这些是作业本体。自己的设计可以很美，但 Grid 主力布局这条要求仍然要满足。"
        },
        {
          "title": "找成品代码交差",
          "text": "本站对本项目不提供成品代码，这是刻意的设计：仪表盘的价值在「宏观定格局、微观再嵌套」的完整决策过程，成品代码里这些决策全部不可见。真卡住了，回看本章前四课与两个 holy grail 练习——它们的组合就是这个项目。"
        }
      ],
      "official": {
        "assignment": [
          "第一步 · 准备与规划：① 建好 git 仓库（需要复习就回看之前的项目）；② 建好 HTML 与 CSS 文件、放占位内容确认正确关联；③ 下载全分辨率设计图（https://cdn.statically.io/gh/TheOdinProject/curriculum/43cc6ab69fdfbef40d431a65677d2144668930ac/intermediate_html_css/grid/project_admin_dashboard/imgs/dashboard-project.png），对 HTML 文档怎么布局形成大致想法。",
          "第二步 · 布局：① 先写出 sidebar、header、main-content 三大块的 HTML 元素；② 在 CSS 里运用 Grid 属性把这个基本布局搭出来。",
          "第三步 · 嵌套：① 一个区一个区来，把子元素挂进父元素——网格容器里可以继续做网格容器；② 侧边栏内用更多网格排导航与品牌区；③ 顶栏内用更多网格排搜索栏、用户信息与按钮；④ 主内容区内用更多网格排项目卡片、公告与趋势；⑤ 填占位内容与占位图，定位所有网格项目。",
          "第四步 · 收集素材：① 网格布局完成后，照示例还原或做自己的设计均可；② 全部图标及更多可从 Material Design Icons（https://pictogrammers.com/library/mdi/）下载 SVG；③ 字体自选——示例用 Roboto（Google Fonts 有），引入外部字体的方法回看 More Text Styles 一课。",
          "第五步 · 提示五条：① 搭布局时给容器加背景色或边框帮助可视化网格；② 轨道用像素、fr 或两者皆可；③ 项目不要求响应式（想做可以让项目卡片区域随窗口伸缩）；④ 不必与设计图像素级一致，当成练自己 CSS 设计的机会；⑤ 完成后 push 到 GitHub，用 GitHub Pages 发布。",
          "第六步 · 章节反馈：继续往下之前，官方希望你提交对 Intermediate HTML and CSS 课程的反馈（Google 表单：https://docs.google.com/forms/d/e/1FAIpQLSf_hNwIjvqcPZyl9Lx41mgJNQKp04qOro03SI8ABw4Zp7U_4w/viewform?usp=sf_link）。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 intermediate_html_css/grid/project_admin_dashboard.md（注意官方文件名带 project_ 前缀、与本站 slug admin-dashboard 不同形；同目录另有 project_admin_dashboard/imgs/ 子目录存放设计图；本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "b6ca5d2487886f60b4e56c5e0a7f0ab97d0afb909647b1b32aeac05569ce66a8",
        "verifiedAt": "2026-09-26"
      }
    }
  ]
};
