/* courses/advanced-html-and-css.js — World 4「高级 HTML 与 CSS」已开放课程正文（v2 自足格式）。
 *
 * 沿用 courses/ 按 World 分文件的架构（2026-09-25 路径课试点批次 1 首建，
 * 复用事实见 REUSE-NOTES.md「路径课试点轮复用事实」节）：lessons.js 继续作为
 * Foundations 的唯一事实源不动（46 课已发布上线，是稳定资产）；本文件只放
 * World 4 已开放的课程，未开放的章节与课程不得夹带正文（红线）。
 *
 * 数据约定（与 intermediate-html-and-css.js / javascript.js 同一套）：
 *   - 每课的 id 就是 curriculum.js 里的原始 slug，原样沿用、不得改写；
 *   - group 字段是本文件 groups 数组的数字下标（从 0 起且在本文件内连续）；
 *     groups 按官方章节顺序一次写全 3 项（含尚未开放章节——分组名是官方结构
 *     事实，不是课程内容，不构成「批量灌入正文」）；
 *   - 课的字段结构与 lessons.js 完全同构（19 字段 v2 自足格式）；
 *   - 中文课名按 catalog.js 惯例自拟，登记在本文件头注释与 SOURCES.md：
 *     批次 5 阶段 1（2026-09-27，v4.11.27）「动画」3 课：
 *     Transforms → 变换（MDN 中文版对 transform 的官方译名「变换」）；
 *     Transitions → 过渡（MDN 中文版对 transition 的官方译名「过渡」）；
 *     Keyframes → 关键帧（MDN 中文版对 @keyframes 的通行译名「关键帧」）。
 *     批次 5 阶段 2（2026-09-27，v4.11.28）「无障碍」8 课（译名沿 W3C/MDN
 *     官方中文资料通行用法）：
 *     Introduction to Web Accessibility → Web 无障碍导论；
 *     The Web Content Accessibility Guidelines (WCAG) → Web 内容无障碍指南（WCAG）；
 *     Semantic HTML → 语义化 HTML；Accessible Colors → 无障碍色彩；
 *     Keyboard Navigation → 键盘导航；Meaningful Text → 有意义的文本；
 *     WAI-ARIA → WAI-ARIA（缩写沿用，全称中文见课内术语表）；
 *     Accessibility Auditing → 无障碍审计。
 *   - 官方 Markdown 住在 curriculum 仓 advanced_html_css/animation/ 目录
 *     （GitHub API 实列确认：transforms.md 13306 B / transitions.md 6839 B /
 *     keyframes.md 8488 B，文件名与 slug 同形，本批无不同形）；三课 slug 全带
 *     node-path-advanced-html-and-css- 前缀。
 *   - 批次 5 阶段 2：「无障碍」8 课官方 Markdown 住在 advanced_html_css/
 *     accessibility/ 目录（GitHub API 实列确认：8 个 .md 文件名与 slug 全同形，
 *     含长文件名 the_web_content_accessibility_guidelines_wcag.md；另有
 *     semantic_html/ 同名配图子目录按既有口径剔除）；8 课 slug 全带
 *     node-path-advanced-html-and-css- 前缀；**accessible_colors.md 官方无
 *     Assignment 节**（sources.json 登记 hasAssignment: false——全站第四门，
 *     与 choose-your-path-forward / how-this-course-will-work / conclusion
 *     同口径）；8 课均无 Knowledge Check 与 Additional Resources 节。
 *   - 批次 5 阶段 3（2026-09-27，v4.11.29）「响应式设计」5 课：
 *     Introduction to Responsive Design → 响应式设计导论；
 *     Natural Responsiveness → 自然响应；Responsive Images → 响应式图片
 *     （MDN zh-CN 官方教程标题「响应式图片」）；Media Queries → 媒体查询
 *     （MDN zh-CN「使用媒体查询」）；Project: Homepage → 项目：个人主页
 *     （portfolio 官方语境译「作品集」）。
 *   - 批次 5 阶段 3：「响应式设计」5 课官方 Markdown 住在 advanced_html_css/
 *     responsive_design/ 目录（GitHub API 实列确认：5 个 .md，其中
 *     project_homepage.md 对 slug homepage 为 project_ 前缀去前缀直译第 16 例，
 *     其余 4 个文件名与 slug 同形；另有 project_personal_portfolio/ 子目录存放
 *     三张设计稿配图，与本站无关、按既有口径剔除——官方 Assignment 以 statically
 *     CDN 链接引用它们，任务文字原样转达）；5 课 slug 全带
 *     node-path-advanced-html-and-css- 前缀；**World 4 全 16 课就此收组**。
 *   - 批次 5 阶段 3 正文的官方 CodePen 演示（natural-responsiveness 2 处 /
 *     responsive-images 2 处 / media-queries 2 处）同前口径不收录，examples 区
 *     给等效可敲代码；homepage 为 Project 红线课 examples 空数组。
 *   - 官方三课正文的交互演示全部走课页内嵌 CodePen（transforms 7 处 /
 *     transitions 1 处 / keyframes 2 处），按既有口径 CodePen 演示笔不收录为
 *     外部资料；本站 examples 区提供等效可敲代码，note 指向官方课页看交互演示。 */
window.ODIN_COURSE_ADVANCED_HTML_CSS = {
  version: 1,
  course: {
    id: 'advanced-html-and-css',
    en: 'Advanced HTML and CSS',
    zh: '高级 HTML 与 CSS',
    url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/advanced-html-and-css'
  },
  groups: [
    { en: 'Animation', zh: '动画' },
    { en: 'Accessibility', zh: '无障碍' },
    { en: 'Responsive Design', zh: '响应式设计' }
  ],
  lessons: [
    {
      "id": "node-path-advanced-html-and-css-transforms",
      "title": "Transforms",
      "zh": "变换",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-transforms",
      "summary": "「动画」章节的开篇课：transform 属性用一组变换函数改变元素的外观，却完全不影响文档流——页面布局纹丝不动，只有元素自己的视觉形态在变。二维四件套 rotate / scale / skew / translate 各管旋转、缩放、倾斜、平移；链式变换里顺序即语义，每个函数都作用在前一个变换之后的坐标系上；三维变换靠 perspective 制造纵深感，且 perspective 必须写在最前面。收尾讲 transform 为什么是性能明星：它在像素管线的合成阶段生效、还能交给 GPU 硬件加速——这正是后两课（过渡与动画）都围着它转的原因。",
      "guide": "以下是官方原课的中文化梳理。这是 World 4 的第一课，也是整个「动画」章节的地基：后两课的 transition 与 animation 动起来的「东西」，绝大多数时候就是本课的 transform（和 opacity）。本课的心智转变只有一个——链式变换不是「各自独立地做几件事」，而是「后一个函数在前一个变换过的坐标系里继续做」：先旋转再平移会沿着斜掉的轴跑，先平移再旋转才会直走再原地转。官方用两个盒子（红先转、蓝先移）让你先猜再验，本站示例区给了同样的代码。三维部分官方明确说「别玩太深跑偏了」——知道 perspective 必须打头、translateZ 要配 perspective 才有纵深感，就够用了。matrix 一节只需知道存在。最后的性能小节是全章的「为什么」：transform 在合成阶段生效、可 GPU 加速，所以过渡与动画的最佳实践都指向它。",
      "understand": [
        "transform 属性的值是一个或多个**变换函数**（transform function），函数再带自己的参数——通常是角度（45deg）或数字（1.5）",
        "几乎所有元素都能应用 transform，例外只有 <col>、<colgroup> 与**非替换行内元素**——非替换指内容就在 HTML 文档里的元素（span / b / em），替换元素的内容在文档外、元素本身被外部内容顶替（video / iframe / img）；transform 不生效时先想想是不是这个原因",
        "二维变换四类函数：rotate() 旋转、scale()/scaleX()/scaleY() 缩放、skew()/skewX()/skewY() 倾斜、translate()/translateX()/translateY() 平移",
        "**链式变换顺序即语义**：多个函数用空格分隔、从左到右依次生效，每个函数作用在「前一个变换之后」的坐标系上——rotate(45deg) translate(200%) 沿斜轴跑到右下，translate(200%) rotate(45deg) 先直走再原地转",
        "顺序的唯一例外是 **perspective**：有多个变换函数时它必须声明在最前（最左），设置的是「观察者到 z=0 平面的距离」——相当于告诉浏览器从多远看这个舞台",
        "三维扩展：rotateX/Y/Z 与 rotate3d、scaleZ 与 scale3d、translateZ 与 translate3d；translateZ 单独用几乎没有视觉变化，必须与 perspective 搭配才产生三维纵深错觉",
        "matrix()/matrix3d() 能把所有变换函数合并成一个矩阵——可读性差、几乎没人手写，知道存在与大致原理即可，不必用它构建",
        "transform 的关键优势：它在**合成（composition）**阶段生效，比大多数会触发布局或绘制的 CSS 属性便宜得多，还能经设备 GPU 硬件加速——这个优势在过渡与动画里被放大"
      ],
      "terms": [
        {
          "en": "Transform function",
          "zh": "变换函数：transform 属性的取值单位（rotate / scale / skew / translate / perspective 等），每个函数带自己的角度或数值参数"
        },
        {
          "en": "Non-replaced element",
          "zh": "非替换元素：内容直接包含在 HTML 文档里的元素（span / b / em）——非替换**行内**元素不支持 transform；替换元素（video / iframe / img）的内容在文档外、由外部内容顶替元素本身"
        },
        {
          "en": "Chaining transforms",
          "zh": "链式变换：空格分隔写多个变换函数，从左到右依次生效，后一个作用在前一个变换后的坐标系上——顺序不同结果不同"
        },
        {
          "en": "Perspective",
          "zh": "透视：设置观察者到 z=0 平面的距离，是三维效果的前提；链式变换中必须写在最前（最左）"
        },
        {
          "en": "Composition",
          "zh": "合成：浏览器像素管线（layout → paint → composite）的最后阶段——transform 在这里生效，不触发布局与绘制，所以便宜"
        },
        {
          "en": "GPU (Graphics Processing Unit)",
          "zh": "图形处理器：transform 可经它硬件加速——不必懂 GPU 内部原理，但要知道这个词与它意味着什么"
        },
        {
          "en": "Matrix / matrix3d",
          "zh": "矩阵变换：把所有变换函数合并成一个矩阵值的函数——可读性差、几乎不手写，认识即可"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：重点建立「链式 = 作用在前一个变换后的坐标系上」的直觉，官方 7 处 CodePen 交互演示可在官方课页打开把玩",
        "亲手敲本站示例区的红盒 / 蓝盒链式顺序：先猜两个盒子各会停在哪，再跑一遍验证——猜错的地方就是坐标系直觉还没建立的地方",
        "完成官方 Assignment 四条：rotate3d 演示与 QHMIT 文章、desandro 的 perspective 一章、translate3d 演示、Josh Comeau 的 The World of CSS Transforms 长文（本站资料区有逐条导读）",
        "回看你自己做过的项目页（比如悬停卡片、按钮效果），找出哪些视觉效果其实可以用 transform 实现——为后两课的过渡与动画攒素材"
      ],
      "quiz": [
        {
          "question": "哪些元素不能应用 transform？「非替换元素」是什么意思？",
          "answer": "三类例外：<col>、<colgroup>，以及非替换行内元素。「非替换」指元素的内容就包含在 HTML 文档里（span、b、em 都是）；相对地，「替换」元素的内容在文档之外、元素本身被外部内容顶替（video、iframe、img）。不必背全清单，但 transform 莫名其妙不生效时，先看看目标是不是行内 span 之类——改成 inline-block 或 block 就能变换了。"
        },
        {
          "question": "红盒写 rotate(45deg) translate(200%)、蓝盒写 translate(200%) rotate(45deg)，两个盒子起点相同，为什么终点完全不同？",
          "answer": "因为链式变换从左到右依次生效，且每个函数都作用在「前一个变换之后」的坐标系上。红盒先转 45 度——它的 X 轴跟着斜掉了，随后的 translate(200%) 沿着斜轴走，落到右下方；蓝盒先沿原始 X 轴平移到正右方，再原地旋转 45 度。想「先挪再转」就把 translate 写前面。唯一的顺序例外是 perspective：它必须写在最前面。"
        },
        {
          "question": "translateZ(100px) 单独写几乎没有视觉变化，为什么？怎么补救？",
          "answer": "因为没有 perspective。三维纵深是「错觉」：perspective 设置观察者到 z=0 平面的距离，translateZ 把元素沿 z 轴推近或推远，两者配合浏览器才能算出「离观察者更近所以显得更大」的透视效果。补救是把 perspective 写在同一条 transform 的最前面（如 perspective(500px) translateZ(100px)）。"
        },
        {
          "question": "为什么说 transform 是「便宜」的属性？它在像素管线的哪个阶段生效？",
          "answer": "浏览器渲染要走像素管线：布局（layout）→ 绘制（paint）→ 合成（composite）。大多数属性（如改宽高、改背景色）会触发布局或绘制，而 transform 只在最后的合成阶段生效——不动布局、不重绘像素，还能交给 GPU 硬件加速。所以性能敏感的场景（过渡、动画）官方推荐只动 transform 与 opacity。"
        }
      ],
      "optional": [],
      "note": "官方正文的 7 处交互演示全部走课页内嵌 CodePen（rotate / scale / skew / translate 各一、链式顺序、3D rotate、translateZ），本站不内嵌第三方组件——想拖动参数把玩，打开官方课页即可；本站示例区给了等效的可敲代码。matrix 一节按官方口径只要求「知道存在与大致原理」，不必练手写。",
      "why": "transform 是现代网页视觉效果的主力：卡片悬浮、图标旋转、菜单滑入、3D 翻转——几乎所有「动起来」的效果，位移与形变部分都由它承担。它还是唯一一条既不动文档流、又走 GPU 合成的高速通道，这就是后两课的过渡与动画反复强调「只动 transform 和 opacity」的原因。把这一课的坐标系直觉（尤其链式顺序）练扎实，后面写动画时你才不会靠试错碰运气。",
      "sections": [
        {
          "h": "transform 是什么：改外观、不动文档流",
          "p": [
            "官方开篇一句话定位：`transform` 是在**不影响自然文档流**的前提下改变元素外观的强大工具。你在自己喜欢的网站上大概率见过它——动画效果十有八九用它实现。",
            "「不影响文档流」是它与改 margin / position 的本质区别：元素被旋转、放大、挪走之后，**周围元素的位置纹丝不动**，页面布局不会跟着抖。变的只是元素自己的视觉形态。",
            "语法上，`transform` 的值是一个或多个**变换函数**（CSS transform function），函数再带自己的参数——通常是角度（`45deg`）或数字（`1.5`）。"
          ]
        },
        {
          "h": "谁能被变换：非替换行内元素的例外",
          "p": [
            "几乎所有元素都能应用 `transform`，例外只有三类：`<col>`、`<colgroup>`，以及**非替换行内元素**。",
            "「非替换」（non-replaced）指内容就包含在 HTML 文档里的元素——`<span>`、`<b>`、`<em>` 是典型；「替换」（replaced）元素的内容在文档之外，元素本身被外部内容顶替——`<video>`、`<iframe>`、`<img>` 是典型。",
            "官方明说不必背清单：记住这个概念，等你哪天对着一个 `span` 写 transform 却发现毫无反应时，知道该往哪儿查就行（把它改成 `inline-block` 或 `block` 即可变换）。"
          ]
        },
        {
          "h": "二维变换四件套：rotate / scale / skew / translate",
          "p": [
            "**rotate()**——在二维平面上旋转元素，正角度顺时针：`transform: rotate(45deg)`。",
            "**scale()**——缩放：`scale(1.5)` 放大到 1.5 倍、`scale(0.5)` 缩到一半；也可以 `scaleX()` / `scaleY()` 只动一个方向。",
            "**skew()**——倾斜（把矩形推成平行四边形）：`skewX()` / `skewY()` 各沿一个轴，`skew(20deg, 10deg)` 两个参数分别给 X、Y。",
            "**translate()**——平移：`translate(50px, 20px)` 把元素挪到别处，同样不影响文档流里其他元素的位置；`translateX()` / `translateY()` 单轴版。参数可以用长度，也可以用百分比（相对元素自身尺寸——`translate(200%)` 就是挪两个自己的宽度）。",
            "官方给每个函数都配了一个 CodePen 交互演示（在官方课页内嵌），拖动参数看效果是最快的建立直觉方式。"
          ]
        },
        {
          "h": "链式变换：顺序即语义",
          "p": [
            "多个变换函数用空格分隔就能**链式**组合，但这里藏着本课最重要的心智模型：**从左到右依次生效，每个函数都作用在「前一个变换之后」的坐标系上**。",
            "官方的经典对照实验：两个起点相同的盒子，红盒 `transform: rotate(45deg) translate(200%)`，蓝盒 `transform: translate(200%) rotate(45deg)`。",
            "结果完全不同——蓝盒先沿原始 X 轴平移 200% 到正右方，再**原地**旋转 45 度；红盒先旋转 45 度，它的 X 轴已经斜掉了，随后的平移沿着**斜轴**走，落到右下方。",
            "换句话说：变换不是「各自独立地做几件事」，而是一条流水线——前一步把坐标系整个（连同原点与轴向）变了，后一步在新坐标系里继续。写链式变换前先问自己：我要的到底是「先挪再转」还是「先转再沿新方向挪」？",
            "顺序基本随意，**唯一例外是 `perspective`**——它必须写在最前面，下一节展开。"
          ]
        },
        {
          "h": "三维变换与 perspective：纵深是算出来的错觉",
          "p": [
            "`rotate`、`scale`、`translate` 都不限于二维：`rotateX()` / `rotateY()` / `rotateZ()` / `rotate3d()`、`scaleZ()` / `scale3d()`、`translateZ()` / `translate3d()` 是三维扩展。",
            "但要**看出**三维效果，需要 `perspective()`：它设置「观察者到 z=0 平面的距离」——本质是告诉浏览器：把这个物体当作从 z 轴上某个特定距离观看的样子来渲染。距离越小透视越夸张（近大远小越明显），越大越平缓。",
            "两条纪律：其一，`perspective` 与其他函数同写时**必须声明在最前（最左）**——这是链式顺序唯一例外；其二，`translateZ` 单独用几乎没有视觉变化，它与 `perspective` 配合才产生「离观察者更近 / 更远」的三维距离错觉。",
            "官方在这里特意提醒：往后的例子更复杂，尽管动手玩，但**别玩太深跑偏了**——三维变换在日常开发里用得有限，建立概念比练熟技巧优先。",
            "最后登场的 `matrix()` / `matrix3d()` 把所有变换函数合并成一个矩阵：功能上是全集，可读性上是灾难，几乎没人手写（通常是工具生成的计算结果）。官方口径：知道它们存在、大致怎么工作就够了。"
          ]
        },
        {
          "h": "为什么 transform 高性能：合成阶段与 GPU",
          "p": [
            "要理解 transform 为什么「好」，得先知道 **CSS 触发器**（CSS triggers）：浏览器渲染一帧要走像素管线（The Pixel Pipeline）——布局（layout）→ 绘制（paint）→ 合成（composite），不同属性改动会触发管线里不同深度的重算。",
            "改宽高位置会触发布局（周围元素全要重排），改颜色背景会触发绘制（像素重画）——而 **transform 只发生在合成阶段**：把已经画好的图层挪一挪、转一转，布局与绘制都不用重来。这让它比大多数 CSS 属性便宜得多。",
            "第二个优势：transform 可以经设备的 **GPU** 硬件加速（不必懂 GPU 内部原理，知道这个词与含义即可）。这两个优势在接下来的过渡与动画里会被放大——「性能敏感的动画只动 transform 与 opacity」这条最佳实践的根据就在这一节。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "css",
          "code": "/* 二维四件套——每个盒子一个函数 */\n.rotate-me { transform: rotate(45deg); }          /* 旋转：正角度顺时针 */\n.scale-me  { transform: scale(1.5); }             /* 缩放：>1 放大、<1 缩小；可拆 scaleX()/scaleY() */\n.skew-me   { transform: skew(20deg, 10deg); }     /* 倾斜：两参数分给 X、Y 轴；可拆 skewX()/skewY() */\n.move-me   { transform: translate(50px, 20px); }  /* 平移：只挪视觉位置，文档流里其他元素不动 */\n\n/* 链式：顺序即语义——从左到右，后一个作用在前一个变换后的坐标系上 */\n.red-box  { transform: rotate(45deg) translate(200%); } /* 先转：X 轴斜掉，平移沿斜轴 → 右下 */\n.blue-box { transform: translate(200%) rotate(45deg); } /* 先移：沿原 X 轴直走，再原地转 */\n\n/* 三维：perspective 必须写在最前，否则后面的 3D 函数看不出纵深 */\n.stage { transform: perspective(500px) rotateY(30deg); }\n.pop   { transform: perspective(500px) translateZ(100px); } /* 向观察者推近 100px——显得更大 */",
          "note": "本站示例代码：官方 7 处 CodePen 演示（四件套各一、链式顺序、3D rotate、translateZ）的等效改写，交互演示在官方课页可打开把玩。链式顺序是本课最大的心智转变——先猜红盒蓝盒各停在哪，再跑一遍验证。"
        }
      ],
      "pitfalls": [
        {
          "title": "以为链式变换「顺序无所谓」",
          "text": "rotate 与 translate 换个顺序结果完全不同：每个函数作用在前一个变换后的坐标系上。先转后移会沿斜轴跑，先移后转才是直走再原地转。写之前先想清楚要哪种语义；唯一的硬性顺序规则是 perspective 必须打头。"
        },
        {
          "title": "对着行内 span 写 transform 没反应",
          "text": "非替换行内元素（span / b / em 这类内容在文档里的行内元素）不支持 transform——这是三类例外之一（另两类是 col 与 colgroup）。把 display 改成 inline-block 或 block 就能变换了。"
        },
        {
          "title": "translateZ 写了没效果、perspective 写在后面",
          "text": "translateZ 单独用几乎没有视觉变化——纵深是 perspective 与 translateZ 配合算出来的错觉。且 perspective 与其他函数同写时必须放最前（最左），写在后面不生效。"
        }
      ],
      "official": {
        "assignment": [
          "看 MDN 的 rotate3d 演示，再读 QHMIT 的 rotate3d 文章深入了解这个属性（官方第 1 条含两个链接）",
          "学习 desandro 3D 变换教程的 perspective 一章：CSS 中的透视",
          "看 MDN 的另一个精彩演示：translate3d 的用法",
          "通读 Josh Comeau 的 The World of CSS Transforms——变换的全景长文"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 advanced_html_css/animation/transforms.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "9ecabf818202706faa4f41639edbe6434d6da3233806f44f8f5c4163b3eed0c3",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-advanced-html-and-css-transitions",
      "title": "Transitions",
      "zh": "过渡",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-transitions",
      "summary": "过渡让元素从初始状态到结束状态的变化「平滑地发生」而不是瞬间跳变：按钮悬停时背景色在一秒里从白渐变到黑，就是 transition 在工作。它是四个子属性的简写——transition-property（过渡哪个属性）、transition-duration（历时多久）、transition-timing-function（速度曲线怎么走）、transition-delay（等多久开始）；触发方式除了 :hover 等伪类，还可以用 JavaScript 增删类名。性能小节是本课的另一半价值：层叠上下文（stacking context）如何被 transform / opacity / filter 创建、为什么堆积过多会让过渡越 repaint 越卡，以及官方建议——追求极致性能时动画只动 opacity 与 transform 两个属性。",
      "guide": "以下是官方原课的中文化梳理。这一课教的是「让变化有过程」：上一课的 transform 给了你瞬间改变外观的能力，这一课的 transition 把「瞬间」拉长成一段可控的平滑变化。四个子属性各管一件事，简写只是把它们排在一行——真正要建立的直觉是 timing-function（速度曲线）与 delay（延迟）对「手感」的影响。触发方式别只想到 :hover：JavaScript 增删类名同样触发过渡，下拉菜单、模态框的展开收起都是这个模式。性能小节值得放慢速度读：层叠上下文是 CSS 里出了名的「看不见但无处不在」的概念，本课只需要拿到工程结论——transform 等属性会创建新上下文、上下文堆多了 repaint 会连坐、所以高频动画尽量只动 opacity 与 transform。想深挖层叠上下文，Assignment 里 Josh Comeau 那篇是官方指定的深入阅读。",
      "understand": [
        "CSS 过渡让元素从**初始状态**到**结束状态**的变化在一段时间里平滑发生——悬停按钮的背景色从白到黑渐变而不是瞬间跳变",
        "transition 是四个子属性的简写：transition-property（过渡哪个 CSS 属性）、transition-duration（过渡历时多久）、transition-timing-function（速度曲线，如 ease-out 表示开头快结尾慢）、transition-delay（触发后等多久开始）",
        "简写形态 transition: background-color 1s ease-out 0.25s——两个时间值时第一个是 duration、第二个是 delay",
        "触发过渡的两条路：伪类（:hover、:focus 等）改变状态，或 **JavaScript 增删类名**——点击按钮给下拉菜单加 open 类，就能触发展开过渡",
        "**层叠上下文**（stacking context）：HTML 元素沿 z 轴（纵深维度）的堆叠与分层；元素在上下文内的位置只相对同一上下文内的其他元素；z-index 控制重叠时谁前谁后",
        "transform、opacity、filter 等多个 CSS 属性都会**触发新层叠上下文的创建**——过渡一个 transform 属性就创建了一个上下文；上下文经各种手段越积越多时，渲染变换要 repaint 的不只是目标元素，还有**同一上下文里叠在它上面的每个元素**，丝滑的过渡会变慢变粗糙",
        "追求最佳动画性能时，官方建议动画**只影响 opacity 与 transform**——连改 background-color 这种看似简单的操作本身就是昂贵的"
      ],
      "terms": [
        {
          "en": "Transition",
          "zh": "过渡：让属性变化在一段时间里平滑发生的机制；transition 是四个 transition-* 子属性的简写"
        },
        {
          "en": "transition-timing-function",
          "zh": "过渡速度曲线：控制变化在持续时间里的快慢节奏——ease-out 开头快结尾慢，linear 匀速"
        },
        {
          "en": "transition-delay",
          "zh": "过渡延迟：状态改变后等多久才开始过渡"
        },
        {
          "en": "Stacking context",
          "zh": "层叠上下文：元素沿 z 轴堆叠的分层范围——元素的层叠位置只相对同一上下文内的其他元素比较；transform / opacity / filter 等属性会创建新上下文"
        },
        {
          "en": "z-index",
          "zh": "z 轴层级：控制元素重叠时显示在前还是在后"
        },
        {
          "en": "Repaint",
          "zh": "重绘：浏览器重新绘制像素的过程——层叠上下文堆积过多时，一次变换的 repaint 会连坐叠在上面的所有元素"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：重点把四个子属性各自管什么、简写里两个时间值的顺序敲进肌肉记忆",
        "亲手敲本站示例区三段代码：longhand 四子属性、简写、JS 增删类触发——改改 duration 与 delay 感受手感差异",
        "完成官方 Assignment 六条：MDN 过渡教程（含 Defining transitions 小节内链接，跟着敲）、Josh Comeau 层叠上下文文章、层叠上下文检查器扩展、CSS Triggers 对照表、过渡交互指南、repaint 调试实录（本站资料区有逐条导读）",
        "对照 CSS Triggers 表看一遍自己常用属性的触发深度：background-color 与 transform 各触发管线里的哪些阶段——把「只动 opacity 与 transform」从口号变成有依据的选择"
      ],
      "quiz": [
        {
          "question": "transition 简写展开是哪四个子属性？各管什么？",
          "answer": "transition-property（过渡哪个 CSS 属性，如 background-color）、transition-duration（过渡历时多久，如 1s）、transition-timing-function（速度曲线，如 ease-out 开头快结尾慢）、transition-delay（触发后等多久才开始，如 0.25s）。简写 transition: background-color 1s ease-out 0.25s 里两个时间值的顺序是：第一个 duration、第二个 delay。"
        },
        {
          "question": "除了 :hover 这类伪类，还有什么办法触发过渡？举一个官方给的场景。",
          "answer": "用 JavaScript 增删类名。官方例子：点击按钮给下拉菜单追加 open 类，类里定义的样式差异就会触发展开过渡。这是下拉菜单、模态框、抽屉这类组件的标准做法——状态由 JS 管，动画由 CSS 过渡管，各司其职。"
        },
        {
          "question": "什么是层叠上下文？为什么过渡 transform 时要留意它？",
          "answer": "层叠上下文是元素沿 z 轴（纵深）堆叠的分层范围：元素的层叠位置只相对同一上下文内的其他元素比较，z-index 控制重叠时的前后。transform、opacity、filter 等属性都会触发新上下文的创建——过渡一个 transform 就创建了一个。如果页面经各种手段积累了很多上下文，渲染这个变换时要 repaint 的不只是目标 div，还有同一上下文里叠在它上面的每个元素——放任不管，丝滑的过渡会变慢变粗糙。"
        },
        {
          "question": "官方对「最佳动画性能」给出的属性建议是什么？连 background-color 都被点名说明了什么？",
          "answer": "只让动画影响 opacity 与 transform 两个属性。官方特意说明：连第一个例子里那种「只改 background-color」的过渡，本身就已经是昂贵的操作（要触发绘制）——而 transform 只在合成阶段生效、opacity 同样走合成，所以这两个是性能天花板最高的选择。需要其他属性时照常过渡（比如官方说的「按钮悬停变彩虹，你就得能过渡那个彩虹」），但要有代价意识。"
        }
      ],
      "optional": [],
      "note": "官方正文的 1 处交互演示走课页内嵌 CodePen（transition longhand 示例），本站不内嵌第三方组件——想看交互效果打开官方课页即可；本站示例区给了等效代码。层叠上下文一节官方只给了工程结论，深入阅读是 Assignment 指定的 Josh Comeau 文章。",
      "why": "过渡是「界面手感」的直接来源：同一个下拉菜单，瞬间弹开和 200ms 平滑展开给用户的感受完全不同——而实现只差三行 CSS。这一课的另一半价值在性能观：层叠上下文与「只动 opacity / transform」的建议，是你以后排查「动画为什么卡」时的地图。学完它，你写的每个悬停、每次展开收起都会既顺滑又不拖累页面。",
      "sections": [
        {
          "h": "什么是过渡：把瞬间跳变拉成平滑过程",
          "p": [
            "官方用最常见的场景开场：一个白底按钮，鼠标不在上面时它就干放着——无聊；鼠标悬停上去，背景色在一段时间里从白**平滑地**经过灰渐变到黑。这就是 CSS 过渡（transition）。",
            "术语上：鼠标不在时按钮处于**初始状态**；悬停引入了**结束状态**（hover 态）；过渡负责让两个状态之间的变化「有过程」而不是瞬间跳变。",
            "实现它的就是 `transition` 属性——它其实是四个子属性的**简写**。"
          ]
        },
        {
          "h": "四个子属性与简写形态",
          "p": [
            "longhand 写法一项项来：`transition-property: background-color`（过渡哪个属性）、`transition-duration: 1s`（变化历时 1 秒逐渐完成）、`transition-timing-function: ease-out`（速度曲线——开头比结尾快）、`transition-delay: 0.25s`（光标落上去四分之一秒后才开始变化）。",
            "简写把它们收进一行：`transition: background-color 1s ease-out 0.25s;`，配合 `button:hover { background-color: black; }` 就构成了完整的悬停过渡。",
            "简写里有两个时间值时，**第一个永远是 duration、第二个是 delay**——顺序错了整个语义就变了。"
          ]
        },
        {
          "h": "触发过渡的两条路：伪类与 JS 增删类",
          "p": [
            "上面的例子靠 `:hover` 伪类触发。实际上任何能造成「状态差」的机制都能触发过渡——其他伪类（`:focus` 等）同理。",
            "第二条路是 **JavaScript 增删类名**：官方例子是点击按钮给下拉菜单追加 `open` 类，类里与类外的样式差异就会触发开合过渡。这是现代前端组件（下拉、模态、抽屉、侧栏）的标准分工——状态切换交给 JS，视觉过渡交给 CSS。"
          ]
        },
        {
          "h": "性能其一：层叠上下文与 repaint 连坐",
          "p": [
            "官方先给定心丸：一般情况下保持过渡的性能不是问题。但有两件事要放在心上，第一件是**层叠上下文**（stacking context）。",
            "层叠上下文指 HTML 元素在父容器里沿 z 轴（纵深维度）的堆叠与分层。关键性质：元素在上下文内的位置**只相对同一上下文内的其他元素**比较；`z-index` 控制重叠时元素显示得多靠后或多靠前。",
            "除了直接设 `z-index`，**多个 CSS 属性都会触发新层叠上下文的创建**——`transform`、`opacity`、`filter` 等。所以过渡一个 transform 属性（悬停旋转 180 度这类）本身就创建了一个上下文。",
            "代价在哪：如果页面经各种手段创建了**一大堆**层叠上下文，那么渲染最初那个变换时，浏览器要 repaint 的不只是目标 `div`，还有**同一上下文里叠在它上面的每一个元素**。放任不管，曾经黄油般丝滑的过渡就会变慢、变粗糙。"
          ]
        },
        {
          "h": "性能其二：极致性能只动 opacity 与 transform",
          "p": [
            "第二件事：想要网页动画的**绝对最佳性能**，就让动画只影响 `opacity` 与 `transform` 两个属性。",
            "官方坦率地自我指认：本课第一个例子只改了 background-color——但**即便如此，那本身也已经是昂贵的操作**（要触发绘制；对照上一课：transform 只在合成阶段生效）。",
            "官方收尾很务实：重要的是把这些概念理解扎实、需要时能应用——毕竟，如果你真要把按钮悬停变成彩虹，你就得有能力过渡那个彩虹。原则是「知道代价再做选择」，不是「除了两个属性都不许动」。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "css",
          "code": "/* longhand：四个子属性各管一件事 */\nbutton {\n  background-color: white;\n  transition-property: background-color;   /* 过渡哪个属性 */\n  transition-duration: 1s;                 /* 历时多久 */\n  transition-timing-function: ease-out;    /* 速度曲线：开头快、结尾慢 */\n  transition-delay: 0.25s;                 /* 悬停后等多久开始 */\n}\nbutton:hover { background-color: black; }\n\n/* 简写：属性 时长 速度曲线 延迟（两个时间值时第 1 个是 duration、第 2 个是 delay） */\nbutton { transition: background-color 1s ease-out 0.25s; }\n\n/* JS 增删类同样触发过渡——下拉菜单 / 模态框的标准模式 */\n.menu {\n  opacity: 0;\n  transform: translateY(-8px);\n  transition: opacity 0.3s ease-out, transform 0.3s ease-out; /* 多属性用逗号并列 */\n}\n.menu.open { opacity: 1; transform: translateY(0); }\n/* JS：btn.addEventListener('click', () => menu.classList.toggle('open')); */",
          "note": "本站示例代码：第一、二段是官方 longhand / 简写演示（官方 CodePen 在官方课页可交互把玩）的等效写法；第三段按官方「点击按钮给下拉菜单追加 open 类」的场景补全了可敲的完整形态——只动 opacity 与 transform，正是性能小节的建议落地。"
        }
      ],
      "pitfalls": [
        {
          "title": "简写里两个时间值写反",
          "text": "transition: background-color 0.25s ease-out 1s 的意思是「过渡 0.25 秒、延迟 1 秒」——第一个时间值永远是 duration、第二个才是 delay。写反后动画时长与等待时间互换，手感完全不对还很难看出原因。"
        },
        {
          "title": "过渡一个根本不可动画的属性",
          "text": "不是所有 CSS 属性都能平滑插值：display 这类离散属性没有中间态，transition 对它无效（会瞬间跳变）。写过渡前先确认目标属性可动画——MDN 过渡教程（Assignment 第 1 条）有可动画属性清单。"
        },
        {
          "title": "无节制地给一切加过渡",
          "text": "transform / opacity / filter 都会创建层叠上下文；上下文堆多了，一次变换的 repaint 会连坐叠在上面的所有元素，页面越动越卡。高频、大面积的动画收敛到 opacity 与 transform，其他属性的过渡按需使用。"
        }
      ],
      "official": {
        "assignment": [
          "读 MDN 的 Using CSS transitions 一文，包括文中 Defining transitions 小节里的链接；跟着示例敲代码熟悉语法（官方第 1 条含两个链接）",
          "读 Josh Comeau 讲层叠上下文（stacking context）的文章",
          "试用 CSS Stacking Context inspector 浏览器扩展：探索页面上的层叠上下文、查看它们的层级结构、排查布局与重绘问题",
          "学习 CSS Triggers（官方给的存档版）：理解可动画属性如何影响渲染与性能，对照 background-color 与 transform 等属性，看不同的 CSS 改动分别触发浏览器渲染管线的哪些阶段",
          "读 Josh Comeau 的过渡交互指南",
          "学习如何捕捉并调试 repaint 问题（dzhavat 的实录文章：由 CSS transition 触发的布局重绘问题排查全过程）"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 advanced_html_css/animation/transitions.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "e761f1c067eef06b02da3a68ee545e558fb6c2e09351bee664e82ba8d640085f",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-advanced-html-and-css-keyframes",
      "title": "Keyframes",
      "zh": "关键帧",
      "group": 0,
      "url": "https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-keyframes",
      "summary": "CSS 动画（animation）与 @keyframes 关键帧：动画与过渡的三大区别——动画为循环而设计（过渡能循环但不是为此设计的）、动画不需要触发器（定义好就自己跑，过渡要靠伪类或 JS 增删类）、动画比过渡灵活得多（过渡是从 A 到 B 的直线，关键帧给整段旅程排时间轴）。写一个动画分两半：配置阶段在元素上声明 animation-duration / animation-name / animation-iteration-count / animation-direction 等属性，再用 @keyframes 规则定义一个周期的时间轴——from/to 是 0%/100% 的别名，中间帧只能用百分比。最容易踩的坑官方专门点了：一次 iteration 是「从头到尾的单个周期」，不是「一个来回的完整循环」。",
      "guide": "以下是官方原课的中文化梳理。这是「动画」章节的收官课：前两课给了你 transform（形变能力）与 transition（让变化有过程），这一课的 animation + @keyframes 把控制权扩展到整段旅程——你可以在时间轴的任意百分比处安排任意样式，可以让动画无限循环、来回交替，甚至不需要任何用户交互就自己播放。理解路径建议按官方结构走：先把「动画 vs 过渡」的三大区别想透（这决定你以后遇到需求选哪个工具），再拆官方那个变色球的例子——配置四属性 + @keyframes 两半结构，最后收下官方专门设防的那个误区：iteration-count 数的是「单向周期」，alternate 时第二周期反向跑，不 alternate 时跳回起点重来。做完 Assignment 的三个练习（按钮悬停、弹窗、下拉菜单），本章就完整落地了。",
      "understand": [
        "动画与过渡的三大区别：**循环**——过渡能循环但不是为此设计的，动画就是为显式支持循环而生；**触发**——过渡需要触发器（:hover 等伪类或 JS 增删类），动画定义好后按指示立即自己跑；**灵活性**——过渡是从 A 点到 B 点的直线旅程（timing-function 只调节奏），动画用关键帧控制整段旅程",
        "选型判断：active 时改个透明度用动画是杀鸡用牛刀——过渡就够；更复杂的编排才轮到动画出场",
        "写动画分两半：**配置阶段**在元素上声明动画属性，**@keyframes 规则**定义一个周期的时间轴——两半靠 animation-name 与规则名对接",
        "animation-duration：一个周期历时多久；animation-name：绑定哪个 @keyframes 规则——它只是自定义名字（叫 pineapples 也行），不是 CSS 关键字",
        "animation-iteration-count：播放几个周期——可以是 1、2、任意次或 infinite（永远跑）；animation-direction：alternate 表示每个周期结束后**反向**播放（平滑变回起点），否则跳回起点重来",
        "@keyframes 用百分比标记时间点：from 与 to 分别是 0% 与 100% 的**别名**（选一种风格并保持一致即可）；**中间帧只能用百分比**（如 50% { … }），from/to 只属于两端",
        "一次 iteration ≠ 一个完整来回：它是「从头到尾的单个周期」（alternate 时是「从尾到头」）——iteration-count: 2 + alternate 的效果是红→绿、绿→红，然后停",
        "关键帧里可以放任何可动画的 CSS 属性（50% 帧同时改颜色与 transform: scale(2) 放大），想加几个帧就加几个——这就是动画灵活性的来源"
      ],
      "terms": [
        {
          "en": "@keyframes",
          "zh": "关键帧规则：定义一个动画周期里各时间点的样式——用百分比标记时间，from/to 是 0%/100% 的别名"
        },
        {
          "en": "animation-name",
          "zh": "动画名：把元素上的动画配置绑定到同名 @keyframes 规则——纯自定义标识符，不是 CSS 关键字"
        },
        {
          "en": "animation-iteration-count",
          "zh": "迭代次数：动画播放几个周期——数字或 infinite；一次迭代是单向的一个周期，不是一个来回"
        },
        {
          "en": "animation-direction",
          "zh": "播放方向：alternate 让每个周期结束后反向播放（平滑折返），normal 则跳回起点重播"
        },
        {
          "en": "Animation cycle",
          "zh": "动画周期：@keyframes 规则定义的从 0% 到 100% 的完整一遍——迭代次数与方向都以它为单位"
        },
        {
          "en": "Shorthand (animation)",
          "zh": "animation 简写：把 duration、name、iteration-count、direction 等子属性收进一行，如 animation: 2s change-color infinite alternate"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：重点吃透「动画 vs 过渡」三大区别与「一次 iteration = 单向一个周期」的官方警告",
        "亲手敲本站示例区的变色球：先写配置四属性 + from/to 两帧版，再加 50% 中间帧（变色 + 放大），把 iteration-count 从 infinite 改成 2 观察 alternate 的折返",
        "完成官方 Assignment 前三条：MDN Using CSS animations 跟着敲、@keyframes 参考深读、Josh Comeau 关键帧交互指南（本站资料区有逐条导读）",
        "完成官方练习：css-exercises 仓库 advanced-html-css/animation 目录的三个练习按序做——01-button-hover、02-pop-up、03-dropdown-menu（说明在各练习的 README）"
      ],
      "quiz": [
        {
          "question": "动画与过渡的三大区别是什么？各举一个官方给的说明。",
          "answer": "① 循环：过渡能循环但不是为此设计的，动画是显式为支持循环而设计（iteration-count: infinite 一行搞定）；② 触发：过渡需要触发器（:hover / :focus 伪类或 JS 增删类），动画不需要——元素与 CSS 就位后，按指示立即自己开始跑；③ 灵活性：过渡像送元素沿直线从 A 点到 B 点（timing-function 只能调这条线的节奏），动画用关键帧给整段旅程排时间轴。选型：active 时改透明度用动画是杀鸡用牛刀，复杂编排才用动画。"
        },
        {
          "question": "animation-name 与 @keyframes 规则是怎么对接的？这个名字有什么讲究？",
          "answer": "两半结构靠名字绑定：元素上的 animation-name: change-color 指向 @keyframes change-color { … } 规则。名字纯属自定义标识符——不是任何 CSS 关键字，官方原话是「想叫它 pineapples 也行」，起个能说明用途的名字（如 change-color）方便自己维护。"
        },
        {
          "question": "from / to 与百分比是什么关系？中间帧能写 from 或 to 吗？",
          "answer": "from 与 to 分别是 0% 与 100% 的别名——from/0% 读作「第 0 秒」（周期起点），to/100% 读作「第 2 秒」（按例子里 duration: 2s 算，周期终点）。中间帧只能用百分比（如 50% { background-color: blue; transform: scale(2); }），from/to 只属于两端。两端用 from/to 还是 0%/100% 没有硬性规则，选一种风格保持一致即可。"
        },
        {
          "question": "animation-iteration-count: 2 加 animation-direction: alternate，红→绿的变色球会怎么动？官方警告的误区是什么？",
          "answer": "球先从红变绿（第一个周期，0%→100%），再从绿变红（第二个周期，alternate 反向播放），然后动画停止。官方警告的误区：别把一次 iteration 当成「一个完整来回的循环」——它是「从头到尾的单个周期」（alternate 时是「从尾到头的单个周期」）；count: 2 数的是两个单向周期，不是一个往返。不写 alternate 时，每个周期结束会跳回起点重播而不是平滑折返。"
        }
      ],
      "optional": [],
      "note": "官方正文的 2 处交互演示走课页内嵌 CodePen（变色球 longhand 与 shorthand 两版），本站不内嵌第三方组件——想看动画跑起来的样子打开官方课页即可；本站示例区给了等效可敲代码。本课 Assignment 第 4 条是本章的动手收官：三个练习分别对应按钮悬停、弹窗、下拉菜单三种最常见的动画场景。",
      "why": "这一课把「动画」章节收拢成完整的工具观：过渡管「两个状态之间的平滑」，动画管「整段时间轴的编排」——加载转圈、弹窗入场、脉冲提示这些不需要用户触发就要动的效果，全靠 @keyframes。学完它，你做 Assignment 三个练习（按钮、弹窗、下拉菜单）时会发现自己已经在按场景选工具：简单两态用 transition、多阶段或自动播放用 animation。这也是 World 4 第一章的终点——动画能力从此进入你的日常工具箱。",
      "sections": [
        {
          "h": "动画 vs 过渡：三大区别与选型",
          "p": [
            "官方开门见山：动画（animation）让你把元素从一种样式配置动到另一种——听起来和过渡一模一样？没错，但动画在三个方向上大幅扩展了过渡做不到的能力。",
            "**区别一：循环。**过渡是为「从一个状态到另一个状态」设计的——它*能*循环，但那不是它的设计目的；动画则是**为显式支持循环而生**（一个 iteration-count 属性就管到底）。",
            "**区别二：触发。**过渡需要触发器：`:hover`、`:focus` 这类伪类，或 JavaScript 增删类名。动画不需要——元素与 CSS 定义就位后，只要你让它跑，它**立即自己开始**。",
            "**区别三：灵活性。**定义过渡像送元素沿直线从 A 点走到 B 点——`transition-timing-function` 能给这条线的节奏加点变化，但与动画的灵活度不在一个量级：动画用关键帧给整段旅程的任意时间点安排任意样式。",
            "官方给的选型判断很务实：两者各有用武之地，用你的判断力——active 时改个透明度，用动画是杀鸡用牛刀（overkill）；要做更复杂的编排，动画会给你需要的工具。"
          ]
        },
        {
          "h": "配置阶段：元素的四个动画属性",
          "p": [
            "写一个动画分两半。第一半叫**配置阶段**：在目标元素上声明动画属性。官方例子（一个不停变色的球）用了四个：",
            "`animation-duration: 2s`——球完成**一个动画周期**要两秒。",
            "`animation-name: change-color`——绑定接下来要定义的 `@keyframes` 规则。这个名字纯属自定义，不是特定 CSS 值——官方原话：想叫它 pineapples 也行，只是 change-color 更贴切。",
            "`animation-iteration-count: infinite`——动画永远跑下去；也可以设 1、2 或任意次数。",
            "`animation-direction: alternate`——决定每个周期结束时是**反向交替**播放还是跳回起点重播。设成 alternate 后，球会平滑地变回原色，而不是「跳」回红色。",
            "这四个属性也有简写：`animation: 2s change-color infinite alternate;`——与 transition 简写同理，是子属性收进一行。"
          ]
        },
        {
          "h": "@keyframes：给一个周期排时间轴",
          "p": [
            "第二半是 `@keyframes` at 规则——它引用你在 animation-name 里起的名字，定义**一个动画周期**的时间轴：",
            "最简单的两帧版：`from { background-color: red; } to { background-color: green; }`——from 与 to 把球的背景色从红安排到绿。",
            "关键认知：关键帧用**百分比**标记动画发生的时间点，`from` 与 `to` 其实分别是 `0%` 与 `100%` 的**别名**。按例子里 duration: 2s 算，from/0% 读作「第 0 秒」、to/100% 读作「第 2 秒」。两端用 from/to 还是 0%/100% 没有硬性规定——选一种风格，保持一致。",
            "加中间帧只能用百分比：官方进阶例子在 `50%` 处同时改了颜色（blue）与大小（`transform: scale(2)` 放大一倍）——球在旅程中点变蓝变大，然后继续走向绿色终点。想加几个帧就加几个、想控制哪些可动画属性就控制哪些——这就是 @keyframes 的权力。"
          ]
        },
        {
          "h": "一次 iteration 不是一个来回",
          "p": [
            "官方专门设防的误区：`@keyframes` 规则定义的是**一个动画周期**——把例子的 iteration-count 从 infinite 改成 2，球会红→绿（第一周期），再绿→红（第二周期，因为 alternate 反向），然后停止。",
            "所以千万别把「一次 iteration」想成「一个完整循环（来回）」——它是**从头到尾的单个周期**（alternate 反向时是「从尾到头」的单个周期）。",
            "这个区分在你数动画次数、对齐多个动画的节奏时会反复用到：count 数的是单向周期数，方向交给 direction 管。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "css",
          "code": "/* 第一半：配置——在元素上声明动画属性 */\n#ball {\n  background-color: red;\n  animation-duration: 2s;              /* 一个周期历时 2 秒 */\n  animation-name: change-color;        /* 绑定下方 @keyframes 规则名（纯自定义，叫 pineapples 也行） */\n  animation-iteration-count: infinite; /* 周期数：1、2、任意次或 infinite 永远跑 */\n  animation-direction: alternate;      /* 每周期结束反向播放——平滑折返，不跳回起点 */\n}\n\n/* 第二半：@keyframes 定义一个周期的时间轴 */\n@keyframes change-color {\n  from { background-color: red; }                     /* from = 0% 的别名（第 0 秒） */\n  50%  { background-color: blue; transform: scale(2); } /* 中间帧只能写百分比：中点变色 + 放大一倍 */\n  to   { background-color: green; }                   /* to = 100% 的别名（第 2 秒） */\n}\n\n/* 简写：duration name iteration-count direction */\n#ball { animation: 2s change-color infinite alternate; }\n\n/* 官方警告的误区演示：count 数的是单向周期——\n   iteration-count: 2 + alternate = 红→绿、绿→红，然后停（不是一个来回算 1） */",
          "note": "本站示例代码：官方变色球 longhand 与 shorthand 两个 CodePen 演示的等效改写（交互动画在官方课页可看）。把 iteration-count 改成 2、direction 改成 normal 各跑一遍，亲眼确认「单向周期」与「折返」的区别——这是本课官方专门设防的误区。"
        }
      ],
      "pitfalls": [
        {
          "title": "中间帧写 from / to",
          "text": "from 与 to 只是 0% 与 100% 的别名，专属两端——中间时间点必须用百分比（50% { … }）。想在旅程中段安排样式时写 to 会把帧挤到终点，时间轴就乱了。"
        },
        {
          "title": "把一次 iteration 当成「一个来回」",
          "text": "一次迭代是「从头到尾的单个周期」，不是往返循环：iteration-count: 2 + alternate 的实际效果是红→绿、绿→红共两个单向周期。数错周期数，多动画对齐节奏时就会差半拍。"
        },
        {
          "title": "简单两态切换也上动画",
          "text": "active 时改个透明度这类「一个状态到另一个状态」的需求，transition 就够了——官方原话：用动画是 overkill。动画留给多阶段时间轴、自动播放（无触发器）、无限循环这些过渡干不了的场景。"
        }
      ],
      "official": {
        "assignment": [
          "跟着敲 MDN 的 Using CSS animations 一文",
          "读 MDN 的 @keyframes 参考，深入理解关键帧的实现机制",
          "读 Josh Comeau 的关键帧交互指南",
          "动手做点酷动画：在官方 css-exercises 仓库的 advanced-html-css/animation 目录（说明在各练习的 README）按顺序完成三个练习——01-button-hover、02-pop-up、03-dropdown-menu"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 advanced_html_css/animation/keyframes.md（本站自行编写简体讲解，未改编自任何第三方中文课程）",
        "sha256": "e9c6adbd38051504244efc3f3542c0b95d9aa592c179ded7827bc657dc8ec695",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-advanced-html-and-css-introduction-to-web-accessibility",
      "title": "Introduction to Web Accessibility",
      "zh": "Web 无障碍导论",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-introduction-to-web-accessibility",
      "summary": "「无障碍」章节的开篇课，回答的是「为什么」：Web 无障碍（web accessibility，缩写 a11y——首尾字母之间有 11 个字母）指网站、工具与技术的设计和开发，让残障人士与受情境限制的用户都能以尽可能少的障碍使用它们。残障分听觉、肢体/运动、认知、视觉等类型，可以是永久的（全盲、全聋）也可以是临时的（手臂骨折）；情境限制（强光下看手机、单手操作、网速慢带宽贵）不是残障，却同样在提醒你把网站做得更宽容。官方用电梯作比：楼是你的网站，电梯是各种无障碍特性的集合——没有电梯，轮椅用户到不了一楼以上。还有一个常被忽视的理由：在不少国家，无障碍是法律要求。",
      "guide": "以下是官方原课的中文化梳理。这是整个「无障碍」章节的地基课——后面七课全部是「怎么做」，只有这一课讲「为什么值得做」。本课没有代码，要带走的是一套看问题的框架：无障碍服务的对象远不止「盲人用户」这个刻板印象——临时残障（骨折）、能力变化（年老）、情境限制（强光、单手、慢网络）加在一起，几乎每个用户在某些时刻都会成为「受限用户」。电梯比喻值得记住：无障碍特性不是给「别人」装的特供设施，而是让整栋楼对所有人都可用的电梯。Assignment 的两份 W3C 资料（多样能力与障碍、视角视频）都是本课框架的真实案例集，值得认真过一遍。",
      "understand": [
        "**Web 无障碍**的定义：网站、工具与技术被设计和开发得让**残障人士**与**受情境限制的用户**都能以尽可能少的障碍使用；缩写 **a11y** 来自 accessibility 首尾字母之间有 11 个字母",
        "残障的类型包括但不限于**听觉、肢体/运动、认知、视觉**四类；且残障可以是**永久的**（全盲、全聋的用户）、**临时的**（手臂骨折的用户），一个人同一时间可能有多重残障；**老年人随年龄变化的能力**可能与残障状况类似",
        "**情境限制**（situational limitations）与残障不同：只在特定情境出现——强光下用手机、忙着别的事只能单手浏览、所在地区网速慢或带宽贵；开发时同样要纳入考虑",
        "**电梯比喻**：没有电梯的多层楼对轮椅用户等于「一楼以上不可达」——楼是你的网站，电梯是各种无障碍特性与工具的集合；你为用户开发网站，就得让用户**真的能用**它",
        "无障碍受益者不只残障用户：老年人、不太懂技术的人、有情境限制的人都是用户，网站应当对他们同等可用；此外**视国家而定，法律可能强制要求**实现无障碍"
      ],
      "terms": [
        {
          "en": "Web accessibility (a11y)",
          "zh": "Web 无障碍：网站、工具与技术的设计开发让残障人士与情境受限用户尽可能少障碍地使用；缩写 a11y 因首尾字母间有 11 个字母得名"
        },
        {
          "en": "Disabilities (auditory / physical-motor / cognitive / visual)",
          "zh": "残障：听觉、肢体/运动、认知、视觉等类型；可为永久（全盲）或临时（骨折），可多重叠加；老年能力变化会产生类似状况"
        },
        {
          "en": "Situational limitations",
          "zh": "情境限制：只在特定情境出现的障碍——强光下看屏幕、单手操作、慢网络高带宽费；不是残障，但同样要求网站宽容"
        },
        {
          "en": "Assistive technologies",
          "zh": "辅助技术：屏幕阅读器、语音识别软件等帮助用户感知与操作内容的工具；本章节后续课程反复出现的核心词"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：把「永久残障 / 临时残障 / 情境限制」三个类别各对上两个生活实例",
        "完成官方 Assignment 两条：通读 W3C 的 Diverse Abilities and Barriers 一文（各类残障用户被不可访问网站影响的真实案例集）；观看 W3C 的 Web Accessibility Perspectives 系列视频（每支都很短、带音频描述与文字稿，页面也有 YouTube 合集链接）——注意体会「同一特性如何同时帮到多类用户」",
        "想一个你自己最近做过的页面：它在强光下、单手操作时、只用键盘时还可用吗？把这三个问题记下来，后面七课会逐一给你答案"
      ],
      "quiz": [
        {
          "question": "什么是 Web 无障碍？a11y 这个缩写是怎么来的？",
          "answer": "Web 无障碍指网站、工具与技术被设计和开发得让残障人士与其他受情境限制的用户都能以尽可能少的障碍使用。a11y 是 accessibility 的缩写：首字母 a 与尾字母 y 之间恰好有 11 个字母，所以写成 a11y。"
        },
        {
          "question": "临时残障、永久残障与情境限制各举一例，并说明为什么开发时三者都要考虑。",
          "answer": "永久残障：全盲或全聋的用户；临时残障：手臂骨折的用户（暂时无法用鼠标）；情境限制：强光下看不清手机屏、忙着别的事只能单手浏览、所在地区网速慢或带宽贵。三者都要考虑，是因为它们对网站提出的要求高度重叠——为永久残障做的改进（如键盘可操作、文本可感知）往往同时服务临时残障与情境限制用户；几乎每个用户在某些时刻都会落入后两类。"
        },
        {
          "question": "复述电梯比喻：楼和电梯分别对应什么？这个比喻想说明什么？",
          "answer": "楼是你的网站，电梯是各种无障碍特性与工具的集合（官方调侃：这是个大电梯）。没有电梯的多层楼，对轮椅用户来说一楼以上就等于不可达——即便有人帮忙抬轮椅，也艰难得多。比喻想说明：无障碍特性不是给少数人的特殊待遇，而是让「楼」对所有用户真正可用的基础设施；缺少它，一部分用户会被整体挡在门外。"
        },
        {
          "question": "除了「对用户好」，官方还给出了什么现实理由说明无障碍很重要？",
          "answer": "法律要求：视所在国家而定，可能有法律强制要求网站实现无障碍。也就是说无障碍不只是道德与体验问题，在不少司法辖区它是合规义务——这也是行业把 WCAG AA 当作默认验收线的原因之一。"
        }
      ],
      "optional": [],
      "note": "本课是纯概念课，没有代码示例。Assignment 的 W3C 视频均带音频描述与文字稿（本身就是无障碍示范）；两份 W3C 资料官方无中文版，本站资料区给了中文速览导读。术语「无障碍」为 W3C 与 MDN 官方中文资料的通行译名，本章节全程沿用。",
      "why": "你可能已经写过不少「看起来没问题」的页面——但它们的「没问题」只在「视力正常 + 用鼠标 + 光线良好 + 网络快」这一种用户画像下成立。本课把用户画像拆开：残障（永久/临时）、年老、不懂技术、情境受限——你会发现宽容的设计服务的是所有人，包括未来某天骨折的自己。这组后续七课的每一条技术规则，动机都在这一课里。",
      "sections": [
        {
          "h": "什么是 Web 无障碍：a11y 的定义与对象",
          "p": [
            "走到这里，你已经在所选路径里学过大量有价值的概念、做过拿得出手的项目，对 HTML 与 CSS 的理解也深了一层——甚至可能已经开始享受写 CSS 了。但有一个主题你大概率还没系统碰过：**无障碍**（accessibility），业界缩写 **a11y**（首字母 a 与尾字母 y 之间有 11 个字母）。",
            "官方定义：**Web 无障碍意味着网站、工具与技术被设计和开发得让残障人士与其他受情境限制的用户能够以尽可能少的障碍使用它们**。很遗憾，这是一个许多人要么不了解、要么开发时干脆不考虑的主题——如果你属于这两类人，你可能已经养成了一些对 a11y 不友好的习惯。在动手改习惯之前，先把「是什么」弄清楚。",
            "残障有不同的类型，包括但不限于**听觉、肢体/运动、认知、视觉**四类。残障可以是**永久的**——比如完全失明或失聪的用户；也可以是**临时的**——比如手臂骨折的用户。一个用户在同一时间可能有多重残障。而**能力随年龄变化的老年用户**，其状况可能与残障人士类似。"
          ]
        },
        {
          "h": "情境限制：不是残障，同样是障碍",
          "p": [
            "**情境限制**（situational limitations）与残障稍有不同：它们只在特定情境中出现。官方给的三个例子都来自日常——**在室外强光下用手机**（屏幕几乎看不清）、**一只手忙着别的事、只能单手浏览网站**、**生活在网速慢或带宽贵的地区**（重资源页面等于不可用）。",
            "这些限制不像残障那样持久，但对「那个情境里的用户」而言，障碍是真实存在的。开发网站时把它们一并纳入考虑，你的设计就会天然更宽容——而宽容的设计最终惠及所有人，包括只是「今天恰好单手抱着咖啡」的你。"
          ]
        },
        {
          "h": "为什么重要：电梯比喻与法律要求",
          "p": [
            "官方先用一个非 Web 的例子给视角：想象一栋**没有电梯的多层建筑**。对一些人这只是小麻烦——「哦，没电梯，那就走几层楼梯呗」；但对轮椅用户，这意味着**一楼以上根本去不了**，即便有人帮忙把轮椅抬上每一级台阶，过程也艰难得多。要点是：一部电梯本可以让这栋楼对所有人可用。",
            "**楼就是你的网站，电梯就是各种无障碍特性与工具的集合**（官方补了句玩笑：这是部相当大的电梯）。你为用户开发网站，就需要网站**真的能被他们使用**。残障人士、能力变化的老年人、不太懂技术的人、有情境限制的人——他们都仍然是用户，网站应当对他们同等可用。",
            "还有一个很现实的理由：视国家而定，可能存在**法律强制要求**实现无障碍。这不是远虑——不少国家的公共部门与商业网站都受无障碍法规约束，诉讼与整改通知都是真实存在的行业风险。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "把无障碍等同于「给盲人做的功能」",
          "text": "无障碍服务对象覆盖听觉、肢体/运动、认知、视觉四类残障，外加临时残障（骨折）、老年能力变化与情境限制（强光、单手、慢网络）。只想着屏幕阅读器会漏掉键盘导航、对比度、认知负担等同样关键的大头——POUR 四原则就是为了防这种以偏概全。"
        },
        {
          "title": "「我的用户里没有残障人士」",
          "text": "你无法知道谁在用你的网站——残障用户不会先声明身份再访问。而且情境限制人人都会遇到：强光、单手、疲劳、慢网络。把「没有人需要」当作不做无障碍的理由，实际是在赌自己的用户画像永远不包括任何受限时刻的任何人。"
        }
      ],
      "official": {
        "assignment": [
          "通读 W3C 的 Diverse Abilities and Barriers（多样能力与障碍）一文，更好地理解不可访问的网站如何影响各类残障用户",
          "观看 W3C 的 Web Accessibility Perspectives（无障碍视角）系列视频，看哪些用户如何从无障碍特性中受益——每支视频都很短且带音频描述与文字稿；愿意的话，页面也提供了全部视频在 YouTube 上的合集链接"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 advanced_html_css/accessibility/introduction_to_web_accessibility.md（本站自行编写简体讲解，未改编自任何第三方中文课程；官方原文无 Knowledge Check 节）",
        "sha256": "139ce0ccfc25a80817e8d0baa56c0db949a320c4804f50298ab6a9df7351cb11",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-advanced-html-and-css-the-web-content-accessibility-guidelines-wcag",
      "title": "The Web Content Accessibility Guidelines (WCAG)",
      "zh": "Web 内容无障碍指南（WCAG）",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-the-web-content-accessibility-guidelines-wcag",
      "summary": "无障碍的「共同标准」课：WCAG（Web Content Accessibility Guidelines，Web 内容无障碍指南）由 W3C 的 WAI 维护，把「怎样才算无障碍」拆成可核对的成功准则。全部准则围绕四大原则组织——可感知（Perceivable）、可操作（Operable）、可理解（Understandable）、健壮（Robust），合称 POUR。符合程度分三级：A（基本支持）、AA（理想支持，多数组织的目标）、AAA（专门支持，不建议全站追求）。官方反复强调两件事：WCAG 是指南不是终点线，以及没有网站能 100% 无障碍——迈出前几步本身就意义重大。",
      "guide": "以下是官方原课的中文化梳理。上一课回答了「为什么」，本课给出「照着什么做」的坐标系。你不需要背下任何成功准则——官方的要求只是「知道它们存在」。真正要带走的是三样东西：POUR 四原则（后面每一课其实都在展开其中某一原则——语义化 HTML 主要服务可感知与可操作，色彩对比服务可感知，键盘导航服务可操作，有意义的文本服务可理解）；三级符合度的名字与含义（AA 是行业默认目标，本课之后色彩一节的 4.5:1 就来自 AA 级）；以及心态校准——指南是工具不是终点线，没有站点能 100% 无障碍，别因为做不到完美而干脆不做。",
      "understand": [
        "WCAG 的存在是为了给 Web 无障碍建立**共同标准**：把「无障碍」这个目的地拆成一条条可核对的**成功准则**（success criteria，即规则）——官方比喻：无障碍是目的地，WCAG 是帮你靠近它的工具之一",
        "四大原则 **POUR**：**可感知 Perceivable**（用户必须能感知到呈现的信息与界面——浅底浅字对视力障碍用户就不可感知）、**可操作 Operable**（用户必须能操作界面与导航——只靠鼠标悬停展开的菜单对键盘用户就不可操作）、**可理解 Understandable**（信息与界面必须能懂——「Error 113: Bad data」这种报错就不可理解）、**健壮 Robust**（内容必须能被当下的辅助技术访问，且随技术进步保持可访问）",
        "三级符合度（conformance levels）：**A 级** = 基本支持（essential），最低符合级；**AA 级** = 理想支持（ideal），多数组织努力达成的级别，达成 AA 必须同时满足 A；**AAA 级** = 专门支持（specialized），不建议整站达成——有些内容天然做不到，达成 AAA 须先满足 A 与 AA",
        "WCAG **是指南（guidelines）不是终点线**：它只能帮你把网站做得「更」无障碍；同时它也不是无障碍知识的全部——本课程后面几课只覆盖最常见的概念",
        "两条心态纪律：**没有网站能 100% 无障碍**（有些站点的目的本身就要求某些方面不可达）；**迈出前几步与后面无数步同样重要**——你以为微不足道的一个 a11y 改进，对某些用户可能是巨大改善，别因为无法一次做全就干脆不做"
      ],
      "terms": [
        {
          "en": "WCAG (Web Content Accessibility Guidelines)",
          "zh": "Web 内容无障碍指南：W3C 维护的 Web 无障碍共同标准，由围绕四大原则组织的成功准则构成；译名沿 W3C 官方中文资料的通行用法"
        },
        {
          "en": "POUR (Perceivable / Operable / Understandable / Robust)",
          "zh": "WCAG 四大原则的首字母缩写：可感知、可操作、可理解、健壮——实现任何无障碍特性时都应过一遍这四问"
        },
        {
          "en": "Success criteria",
          "zh": "成功准则：WCAG 里一条条可核对的规则，符合度级别由满足的准则集合定义"
        },
        {
          "en": "Conformance levels (A / AA / AAA)",
          "zh": "符合度级别：A 基本支持（最低级）、AA 理想支持（行业默认目标）、AAA 专门支持（不建议全站追求）；高级别包含低级别"
        },
        {
          "en": "Assistive technologies",
          "zh": "辅助技术：屏幕阅读器、盲文显示器、语音识别软件等帮助用户感知与操作内容的工具——「健壮」原则要求内容对它们保持可访问"
        }
      ],
      "tasks": [
        "通读本站中文讲解，把 POUR 四原则各自的一句话定义与一个反例对上号（浅底浅字 / 悬停菜单 / Error 113 / 过时技术）",
        "完成官方 Assignment 两条：通读 W3C 的 WCAG Overview 页（目标是熟悉这个站，以后要常来）；略读 WebAIM 的 WCAG 2 Checklist——注意页首免责声明，现在只需对常见无障碍问题混个脸熟，把书签存好，等你真正动手做无障碍时它是顺手清单",
        "回看你在本课程里做过的任意一个页面，用 POUR 四问各自扫一遍：有没有感知不到、操作不了、理解不了的内容？先不必修，建立「扫一遍」的习惯"
      ],
      "quiz": [
        {
          "question": "WCAG 的四大原则（POUR）分别是什么？各举一个官方给出的反例。",
          "answer": "可感知 Perceivable——用户必须能感知呈现的信息，反例：浅色背景上的浅色文字，视力障碍用户难以感知。可操作 Operable——用户必须能操作界面与导航，反例：只靠鼠标悬停展开的下拉菜单，键盘用户无法触达。可理解 Understandable——信息与界面必须能懂，反例：「Error 113: Bad data」这种没人看得懂的报错。健壮 Robust——内容必须能被当下的辅助技术访问并随技术进步保持可访问。"
        },
        {
          "question": "A、AA、AAA 三个符合度级别各是什么定位？多数组织的目标是哪一级？",
          "answer": "A 级是基本支持（essential support），WCAG 的最低符合级；AA 级是理想支持（ideal support），多数组织努力达成的级别，达成它必须先满足 A 级；AAA 级是专门支持（specialized support），不建议整站达成——有些内容天然无法满足该级，达成它须先满足 A 与 AA。行业默认目标是 AA，比如正文对比度 4.5:1 就出自 AA 级。"
        },
        {
          "question": "「WCAG 不是无障碍的终点线」是什么意思？",
          "answer": "两层：其一，WCAG 如其名只是「指南」，它的作用是帮你把网站做得「更」无障碍，满足了全部准则也不等于无障碍工作已经完成；其二，无障碍的最佳信息源之一是真正依赖无障碍特性的用户，指南无法完全替代真实用户反馈。所以把 WCAG 当作打地基的共同标准，而不是做完即止的清单。"
        },
        {
          "question": "官方说「没有网站能 100% 无障碍」，那刚起步时应该持什么心态？",
          "answer": "不要因为做不到完美而干脆不做。官方的原话精神是：迈向无障碍的前几步与之后的无数步同样重要——哪怕现在只给网站加上一个 a11y 特性，你以为微不足道的小改进，对某些用户可能是巨大的改善。有些站点的目的本身甚至要求某些内容以不可达的方式呈现，所以「100% 无障碍」是个不该瞄准的不可能目标。"
        }
      ],
      "optional": [],
      "note": "本课是标准与心态课，没有代码。WCAG 原文与 WebAIM 清单都是英文；WCAG Overview 页官方无中文版，本站资料区给了中文速览导读。级别名 A/AA/AAA 与 POUR 缩写在后续课程与工具（Lighthouse、axe）的报告里会反复出现，混个脸熟即可，不必背准则编号。",
      "why": "没有坐标系的努力容易白费：POUR 让你在做任何界面决策时有四个可自查的问题，AA 级让你知道行业验收线画在哪里（本课之后色彩、键盘、语义各课的具体数字与规则几乎都能回溯到这两个框架）。等你将来接到「网站要符合无障碍规范」的需求时，你知道那指的是 WCAG 2.x AA——这句话本身就是本课的价值。",
      "sections": [
        {
          "h": "WCAG 是什么：无障碍的共同标准",
          "p": [
            "上一课你已经知道无障碍为什么重要；这一课回答「照着什么做」。业界的答案是 **WCAG**——Web Content Accessibility Guidelines，Web 内容无障碍指南，由 W3C 的 Web 无障碍倡议（WAI）维护。它把「怎样才算无障碍」拆成一条条可核对的**成功准则**（success criteria，也就是规则），是全世界引用最广的 Web 无障碍标准。",
            "官方给了一个准确的比喻：**把 Web 无障碍想成目的地，WCAG 是帮你靠近它的工具之一**。共同标准的意义在于「可核对」：团队之间、甲方乙方之间、法律与审计之间，都能指着同一份文件说话，而不是各自凭感觉。",
            "但要注意官方紧接着的提醒：WCAG 虽然对打地基极其有用，**它不是无障碍的终点线**。如其名，它只是指南（guidelines），只会帮你把网站做得「更」无障碍；而且本课程后续几课也只覆盖最常见的概念，不是无障碍的全部版图。"
          ]
        },
        {
          "h": "四大原则 POUR：一切准则的坐标系",
          "p": [
            "WCAG 的全部准则围绕四个核心原则组织，首字母合称 **POUR**。实现任何无障碍特性时，这四问都值得过一遍：",
            "**1. 可感知（Perceivable）**：用户必须能够感知到呈现的信息与用户界面。反例：浅色背景上的浅色文字——部分视力障碍用户无法感知。",
            "**2. 可操作（Operable）**：用户必须能够操作任何用户界面与导航，且界面不得要求用户做不到的交互。反例：只有鼠标悬停才展开的下拉菜单——键盘用户把焦点移到菜单项上时它根本不展开。",
            "**3. 可理解（Understandable）**：用户必须能够理解呈现的信息与界面的操作方式。反例：提交表单后收到「Error 113: Bad data」——用户既不知道错在哪，也不知道怎么改。",
            "**4. 健壮（Robust）**：内容必须能被当下的辅助技术（屏幕阅读器、盲文显示器等）与其他用户代理访问，并且随着这些技术进步**保持**可访问。"
          ]
        },
        {
          "h": "三级符合度：A、AA、AAA",
          "p": [
            "WCAG 把符合程度分成三级，每级由一组必须满足的成功准则构成。级别名很好记：",
            "**A 级（Level A）**——基本支持（essential support），最低符合级。**AA 级（Level AA）**——理想支持（ideal support），多数组织努力达成的级别；满足 AA 必然已满足 A。**AAA 级（Level AAA）**——专门支持（specialized support），**不建议整站追求**：有些内容会让 AAA 根本无法达成；满足 AAA 须先满足 A 与 AA。",
            "本课程不要求你达成任何级别——你只需要知道它们存在。但记住 **AA 是行业默认目标**：后面色彩一课的对比度 4.5:1 / 3:1 两个数字，正是 AA 级对正常文本与大号文本的要求。"
          ]
        },
        {
          "h": "动手之前的心态：100% 不存在，第一步就算数",
          "p": [
            "官方在带你进入具体技术课之前，专门花了一节校准心态，两个要点都值得原样带走：",
            "第一，**没有网站能 100% 无障碍**——不要把不可能的目标当靶子。有时站点的目的或概念本身，就要求某些东西以「某种方式不可达」的形态存在。",
            "第二，**迈出前几步与之后的无数步同样重要**。哪怕你现在只给网站加上一个 a11y 特性，这个你自以为微不足道的改进，对某些用户可能是超乎你想象的巨大改善。所以别觉得必须一次做全、必须完美——尤其在刚起步的时候。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "把 WCAG 当终点线：过了清单就算无障碍",
          "text": "WCAG 如其名只是指南，满足准则只代表「更接近」无障碍。真正依赖辅助技术的用户是最好的信息源之一——审计工具与清单查不出的问题，用户一用就碰到。把符合 WCAG 当底线而非上限。"
        },
        {
          "title": "一上来就瞄准 AAA 或 100% 无障碍",
          "text": "AAA 级连官方都不建议整站追求（有些内容天然做不到），「100% 无障碍」更是不存在的靶子。瞄准这种目标的结果往往是挫败后干脆不做——AA 级 + 持续改进才是行业现实路径。"
        },
        {
          "title": "觉得改进太小就不做",
          "text": "「就加个 alt 而已」「就改个对比度而已」——对依赖这些特性的用户，一个小改进可能是能用与不能用的区别。官方原话精神：你以为的小改进，对用户的改善可能远超你的想象。"
        }
      ],
      "official": {
        "assignment": [
          "通读 W3C 的 WCAG Overview 页——现在不用管页面上的其他链接，目标是读懂概览、并熟悉这个网站本身，以后需要深查时你不迷路",
          "略读 WebAIM 的 WCAG 2 Checklist，注意先读页首的重要免责声明——现阶段目标只是对常见无障碍问题建立印象（其中不少你学完这一组课就有能力修），并把这个资源加入书签：将来真正动手做无障碍时，拿它当清单非常顺手"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 advanced_html_css/accessibility/the_web_content_accessibility_guidelines_wcag.md（本站自行编写简体讲解，未改编自任何第三方中文课程；官方原文无 Knowledge Check 节）",
        "sha256": "62fc20c0983cd9106aa0949231ddf241a0facd52dac02d60cdd2958add7ad2ca",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-advanced-html-and-css-semantic-html",
      "title": "Semantic HTML",
      "zh": "语义化 HTML",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-semantic-html",
      "summary": "无障碍的第一技术课，也是投入产出比最高的一课：用语义正确的元素，而不是给 div 补无障碍补丁。div 与 span 语义中性——屏幕阅读器只会念出它们的文字，不提供任何「这是什么、能不能操作」的上下文；button 则自带语义与上下文（播报为「石头，按钮」）。正确使用的检查单：可点击的用 button、表格数据用 table、输入框配 label（for 关联或包裹两种写法）、input 用对的 type、列表用 ol/ul/dl。另一半是页面的骨架：h1–h6 标题与七个地标元素（aside / footer / form / header / main / nav / section）让屏幕阅读器用户能像看目录一样跳读页面，而不是从头滚到尾。",
      "guide": "以下是官方原课的中文化梳理。这一课的核心只有一句话：**语义化 HTML 是无障碍的地基，用对元素比事后补救便宜得多**。官方的石头剪刀布例子值得亲手验证：同样的三个「按钮」，div 版对屏幕阅读器用户就是三段莫名其妙的纯文本，button 版则播报「石头，按钮」——用户立刻知道这是什么、能做什么。第二个重点是七个地标元素与标题层级：屏幕阅读器用户靠它们在页面里「跳转」，全靠 div 堆出来的页面等于一本没有目录、没有章节名的书。Assignment 强烈建议你真的装一个屏幕阅读器用一用（Windows 装 NVDA 免费、macOS 内置旁白、Linux 内置 Orca、ChromeOS 内置 ChromeVox）——亲手用过之后，你对本课每条规则的理解都会变。",
      "understand": [
        "语义化 HTML 对无障碍重要，是因为它同时提供**含义**（semantic meaning）与**上下文**（context）：<p> 有含义但播报时不提供操作上下文；<button> 既有含义又带上下文（屏幕阅读器会播报角色，如「石头，按钮」）",
        "<div> 与 <span> 是**语义中性**的：自身无含义、不给辅助技术任何上下文——用户可能不知道某个元素能交互、甚至不知道它存在；它们的正当用途是通用容器（布局、通用文本）",
        "正确用元素的检查单：**该点击的用 <button>**（用户能知道可点）；**表格数据用 <table>** 及相关元素（便于导航与理解数据）；**input 必须与 <label> 建立关联**（播报时带上标签内容，且扩大可点区域）；**input 用最贴切的 type**（tel/email 在移动端会给出更合适的键盘）；**列表用 <ol>/<ul>/<dl>** 与对应列表项（用户能知道进入/离开列表、列表有几项）",
        "label 关联 input 的两种写法：<label for=\"id\"> 配 input 的 id；或 <label> 直接包裹 input（无需 id）",
        "**标题**（h1–h6）是各区块的标题；**地标**（landmarks）是充当页面区域的元素，原生共七个：<aside>、<footer>、<form>、<header>、<main>、<nav>、<section>",
        "正确使用地标与标题后，屏幕阅读器用户可以用键盘导航命令（或阅读器的菜单）**按地标和标题跳读页面**，且这些元素的角色会被播报提供额外上下文；全 div 堆砌的页面则只能从头到尾滚一遍，还分不清什么是标题什么是区域"
      ],
      "terms": [
        {
          "en": "Semantic HTML",
          "zh": "语义化 HTML：选用含义与用途匹配的元素（button 表示可点、table 表示表格数据）——含义与上下文都由元素本身携带，辅助技术无需猜测"
        },
        {
          "en": "Semantically neutral",
          "zh": "语义中性：div 与 span 的属性——自身无语义、不向辅助技术提供上下文；正当用途是通用容器"
        },
        {
          "en": "Screen reader",
          "zh": "屏幕阅读器：把界面内容播报给用户的辅助技术（Windows 的 NVDA、macOS 的旁白 VoiceOver、Linux 的 Orca、ChromeOS 的 ChromeVox）"
        },
        {
          "en": "Landmark",
          "zh": "地标：充当页面区域的 HTML 元素，原生七个——aside / footer / form / header / main / nav / section；屏幕阅读器可按地标跳转"
        },
        {
          "en": "Role (角色播报)",
          "zh": "角色：辅助技术播报元素类型提供的上下文——button 播报「按钮」、nav 播报「导航地标」；div 没有角色可播报"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：把「含义 vs 上下文」的区别用 <p> 与 <button> 各说一遍",
        "亲手验证石头剪刀布对比例：把本站示例区的 div 版与 button 版各跑一遍，用 Tab 键走一遍焦点、再用浏览器 DevTools 的 Accessibility 面板看两版的角色差异",
        "完成官方 Assignment 四条（官方编号 1 内含四个操作系统的屏幕阅读器工具，任选其一）：装一个屏幕阅读器实际玩一玩——Windows 装 NVDA（免费）、macOS 用内置旁白、Linux 用内置 Orca、ChromeOS 用内置 ChromeVox；读 tink.uk 的 How screen readers navigate data tables（看正规 table 到底提供多少上下文）；看两支视频——Introduction to accessible tables and a screen reader demo（表格播报演示）与 Why headings and landmarks are so important（标题与地标如何被使用）",
        "回看你最近做过的一个页面：数一数用了几处「该是 button 的 div」、有没有 main/nav/header/footer 地标——为下一课的键盘导航攒问题清单"
      ],
      "quiz": [
        {
          "question": "为什么屏幕阅读器用户面对三个「看起来像按钮」的 div 会不知所措，而 button 不会？",
          "answer": "div 语义中性：屏幕阅读器只会播报它的文字内容（「石头」），没有任何上下文说明这是可交互元素——用户可能以为那只是页面上的普通文字。button 自带语义与上下文，播报为「石头，按钮」：用户立刻知道这是什么、能做什么。视觉样式可以骗过眼睛，骗不过屏幕阅读器。"
        },
        {
          "question": "列出定义页面地标区域的七个原生 HTML 元素。",
          "answer": "aside、footer、form、header、main、nav、section。它们是屏幕阅读器用户跳读页面的骨架：配合 h1–h6 标题，用户可以用阅读器的导航命令直接跳到某个区域或某个标题，而不必从头滚到尾。"
        },
        {
          "question": "label 与 input 建立关联的两种写法是什么？label 除了播报上下文还有什么实际好处？",
          "answer": "写法一：<label for=\"name\"> 配 input 的 id=\"name\"——需要 input 本身有 id 时用；写法二：<label> 直接包裹 input——无需任何 id。除了让屏幕阅读器每次播报 input 时带上标签内容，正确的 label 还扩大 input 的可点击区域（点标签文字等于点输入框），对难以点小目标的用户很实用。"
        },
        {
          "question": "为什么给电话输入框写 type=\"tel\" 而不是 type=\"text\" 也算无障碍？",
          "answer": "因为 type 决定设备给出的输入界面：type=\"tel\" 在手机与平板上会显示更大的纯数字键盘，用户填电话号码容易得多；type=\"email\" 会带 @ 的键盘。用对 type 是让「正确的输入方式」自动出现，而不是让用户跟通用键盘搏斗——这正是 POUR 里「可操作」与「可理解」的日常实践。"
        },
        {
          "question": "如果一个页面全部用 div 搭建地标与标题（只靠 CSS 调出视觉样式），屏幕阅读器用户会遇到什么？",
          "answer": "两个问题：一是无法跳读——没有地标与标题角色，阅读器的导航命令无处可跳，用户只能把整个页面从头到尾听一遍才能到达想去的区块；二是无法分辨——视觉上明明是大标题与侧边栏，播报出来却全是无差别的纯文本，用户分不清什么是标题、什么是区域。"
        }
      ],
      "optional": [],
      "note": "官方正文的配图（本课页面自身的地标结构示意）走 statically CDN，按既有口径不收录；图的内容本站已在「标题与地标」一节用文字完整转述。屏幕阅读器四件套按操作系统任选其一即可：NVDA（Windows，免费，WSL2 用户同样适用）、旁白 VoiceOver（macOS 内置）、Orca（Linux 内置）、ChromeVox（ChromeOS 内置）——资料区给了各官方入口（旁白与 ChromeVox 有官方中文文档）。",
      "why": "这一课是无障碍章节里杠杆最大的一课：语义化写对了，后面的键盘导航课有一半问题根本不会发生（button 天生可聚焦、自带键盘事件），ARIA 课的第一条规则也是「能用原生元素就别用 ARIA」。反过来，div 堆出来的界面要用 tabindex、事件补丁、ARIA 属性一层层往回补——补丁永远比地基贵。你此前做过的每一个项目，都值得用这一课重新审视一遍。",
      "sections": [
        {
          "h": "语义与上下文：p 与 button 的区别",
          "p": [
            "div 与 span 作为通用容器很好用，但它们不总是对无障碍最友好的选择。虽然「什么都用它们」可能更省事——从布局容器到交互区域——但你不仅应该检查某些场合有没有更合适的元素，还应该检查**你有没有用对一个元素**。",
            "为什么语义化 HTML 对无障碍重要？因为它提供**含义**与**上下文**。有的元素有语义含义、但播报时不提供什么上下文，比如 <p>；有的元素既有语义含义、又会带着上下文被播报，帮用户感知与操作，比如 <button>。",
            "而你用得最多的两个元素——div 与 span——是**语义中性**的：它们自身没有语义含义，也不向辅助技术提供任何上下文，这让依赖辅助技术的用户更难感知、操作与理解它们。但这不代表你从此再也不能用 div 或 span——它们作为通用容器（布局、通用文本）依然有正当用途。"
          ]
        },
        {
          "h": "石头剪刀布：同一个界面，两个世界",
          "p": [
            "官方的例子来自你做过的真实项目：石头剪刀布、计算器、井字棋——任何需要用户点击的东西。如果你当时用 div 或 span 做了可点击区域，**对你自己来说一切正常**：看起来像按钮、点起来有反应。",
            "视力正常的用户只要元素「看起来能点」就能玩下去。但屏幕阅读器用户完全不知道这些元素是什么意思：阅读器只会播报元素的文字内容（「石头」「布」「剪刀」），用户可能以为那只是页面上的普通文本，然后就划走了。**没有任何上下文告诉用户这些元素应该交互、甚至「可以」交互**。",
            "换成语义化的 <button>，问题就地消失：因为 button 有语义含义并提供上下文，屏幕阅读器会播报文字内容**加上元素的角色**——「石头，按钮」。用户立刻知道：这是按钮，我可以按它。本站示例区给了两版对照代码。"
          ]
        },
        {
          "h": "正确使用语义化 HTML：五条检查单",
          "p": [
            "正确使用语义化 HTML，要想的是「我给用户的意图是什么、我需要提供什么上下文」。场合不同答案不同，但以下几条是你从现在起就该每次检查的：",
            "**该点击的用 <button>**：无论它视觉上是不是「按钮」，只要用户要点它，就用 button——让用户知道这个元素可以点击交互。**表格数据用 <table>** 及其配套元素：让用户更容易导航与理解数据。**input 必须关联 <label>**：label 给辅助技术提供「这个输入框是干什么的」上下文，每次播报 input 都会带上标签内容；正确的 label 还能扩大输入框的可点区域，对点击小目标困难的用户很实用。两种写法：label 的 for 指向 input 的 id，或 label 直接包裹 input（不需要 id）。",
            "**input 用最贴切的 type**：姓名地址用 text，邮箱用 email，电话用 tel——某些设备上正确的 type 只显示所需的按键：type=\"tel\" 在手机与平板上给出更大的纯数字键盘，填电话容易得多。**列表用对应的列表元素**（ol / ul / dl）与列表项：用户能知道自己何时进入、离开一个列表，以及列表里有多少项。"
          ]
        },
        {
          "h": "标题与地标：页面的骨架",
          "p": [
            "**标题**是 h1 到 h6，如字面所示充当页面各区块的标题。**地标**（landmarks）则是充当页面「区域」的 HTML 元素。原生定义地标区域的元素共**七个**：aside、footer、form、header、main、nav、section。",
            "官方配了一张「典型的 Odin 课程页如何使用语义化 HTML」的示意图（nav、header、main、section、aside、footer 各就各位，可在官方课页查看，也可以直接开 DevTools 检查本课页面本身）。",
            "正确使用地标与标题，等于给辅助技术用户一个**可操作、可理解**的页面：屏幕阅读器用户可以用键盘导航命令（或打开阅读器的菜单）**按地标与标题跳读**，而且这些元素的角色会被播报出来提供额外上下文。反过来，如果你全用 div 充当这些地标与标题、只靠 CSS 调出视觉样式，屏幕阅读器用户想到某个区块就得把整页听完，还可能根本分不清页面上什么是标题、什么是地标。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "html",
          "code": "<!-- ✗ div 版「按钮」：屏幕阅读器只播报「石头」，无上下文 -->\n<div class=\"button-container\">\n  <div class=\"rock\">Rock</div>\n  <div class=\"paper\">Paper</div>\n  <div class=\"scissors\">Scissors</div>\n</div>\n\n<!-- ✓ button 版：播报「石头，按钮」——语义与上下文自带 -->\n<div class=\"button-container\">\n  <button class=\"rock\">Rock</button>\n  <button class=\"paper\">Paper</button>\n  <button class=\"scissors\">Scissors</button>\n</div>",
          "note": "官方对比例。容器仍然可以是 div（通用容器的正当用途），变的只是交互元素本身。"
        },
        {
          "lang": "html",
          "code": "<!-- label 关联 input 的两种写法 -->\n\n<!-- 写法一：input 需要 id 时用 for 关联 -->\n<label for=\"name\">Name</label>\n<input type=\"text\" id=\"name\">\n\n<!-- 写法二：直接包裹——不需要任何 id -->\n<label>\n  Name\n  <input type=\"text\">\n</label>\n\n<!-- type 用对：电话框给数字键盘 -->\n<label for=\"phone\">Phone</label>\n<input type=\"tel\" id=\"phone\">",
          "note": "官方示例。两种写法效果等价；包裹写法在不需要 id 时更省心。"
        }
      ],
      "pitfalls": [
        {
          "title": "「看起来一样」就以为等价：给 div 画出按钮样式",
          "text": "视觉样式骗得过眼睛，骗不过屏幕阅读器：div 再像按钮，播报出来也只是纯文本。判断标准不是「长什么样」而是「用户要拿它做什么」——要点按的一律用 button，要跳转的用 a。"
        },
        {
          "title": "input 裸奔：没有 label 或只放 placeholder",
          "text": "没有 label 的输入框，屏幕阅读器播报时无从知道它是干什么的；placeholder 不能替代 label（输入后消失、对比度常不达标）。label 还顺带扩大可点区域——一举两得的事别省。"
        },
        {
          "title": "整页 div 汤：没有地标与标题层级",
          "text": "全 div 的页面对屏幕阅读器用户是一本没有目录的书：无法按地标跳转、无法按标题跳读，只能从头听到尾。main / nav / header / footer / section / aside 加 h1–h6 是页面的骨架，不是装饰。"
        }
      ],
      "official": {
        "assignment": [
          "理解屏幕阅读器怎么工作的最好办法就是用一个！花点时间探索相关的指南/文档并实际上手玩——按你的操作系统选择：Windows 用户（含 WSL2）可免费安装 NVDA；macOS 内置旁白（VoiceOver）；Linux 内置 Orca；ChromeOS 内置 ChromeVox。随着后续课程引入更多无障碍概念与特性，用屏幕阅读器亲身体验的价值不可估量——你甚至会发现自己改变了建站方式",
          "阅读 How screen readers navigate data tables（屏幕阅读器如何导航数据表格）——看一个正规的 table 元素到底提供了多少上下文的好例子",
          "观看 Introduction to accessible tables and a screen reader demo（无障碍表格入门与屏幕阅读器演示），看屏幕阅读器如何播报一个表格",
          "观看 Why headings and landmarks are so important（为什么标题与地标如此重要），看屏幕阅读器如何与标题、地标元素交互"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 advanced_html_css/accessibility/semantic_html.md（本站自行编写简体讲解，未改编自任何第三方中文课程；官方原文无 Knowledge Check 节；semantic_html/ 同名配图子目录按既有口径剔除）",
        "sha256": "b767c44b0ac4040f7fc808616c2cae42b4ae905d83a4022d7beab51a1362cd79",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-advanced-html-and-css-accessible-colors",
      "title": "Accessible Colors",
      "zh": "无障碍色彩",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-accessible-colors",
      "summary": "色彩的两条硬规则。第一条关于对比度：对比度是两色亮度之差，从白底白字的 1:1 到白底黑字的 21:1；正常文本（小于 18pt/24px，粗体小于 14pt/18.66px）在 AA 级要求至少 4.5:1、大号文本至少 3:1，AAA 级则分别是 7:1 与 4.5:1；偶然性文本、禁用态组件、品牌 logo 三类例外不必遵守。数字不用背——WebAIM Contrast Checker 输入两个 HEX 即出结果，Chrome DevTools 也能就地查看。第二条关于信息传达：**不要只用颜色传达信息**——全色盲模拟下，「红色按钮」对部分用户根本不存在；必填项要「红字 + 星号」双通道，而不是只靠红字。",
      "guide": "以下是官方原课的中文化梳理。这一课没有 Assignment（官方原文就没有作业节），但它是全站动手频率最高的规则课之一：从今往后你每选一组前景/背景色，都值得丢进对比度检查器过一遍。要带走两个数字感（AA 级：正常文本 4.5:1、大号文本 3:1）和一个习惯（颜色永远不单独扛信息——加图标、加文字、加形状）。顺带一提：本站自身的 30 套主题全部按「正文对比度 ≥ 4.5:1」核验过，这一课讲的正是那条纪律的出处。",
      "understand": [
        "**对比度**（contrast ratio）是两种颜色的亮度差，以比值表达：白字白底最低 **1:1**，黑字白底最高 **21:1**；对比度规则同时适用于普通文本与**图片形式的文本**",
        "**正常文本** = 字号小于 18pt/24px（粗体则小于 14pt/18.66px）；**大号文本** = 至少 18pt/24px（粗体至少 14pt/18.66px）",
        "**AA 级（最低要求）**：正常文本对比度至少 **4.5:1**、大号文本至少 **3:1**；**AAA 级（增强）**：分别至少 **7:1** 与 **4.5:1**",
        "三类**例外**不必遵守对比度规则：**偶然性文本**（incidental，如恰好出现在含其他重要视觉内容的图片里的字、纯装饰文字）；**禁用/未激活组件**里的文本（如降了透明度的禁用按钮）；**logo 或品牌名**中的文本",
        "不用背也不用手算：**WebAIM Contrast Checker** 输入前景与背景 HEX 码即给出通过的级别（页内还有链接专用检查器——无下划线文本链接的对比度要求）；**Chrome DevTools** 也可就地查看：Elements 面板的元素拾取器悬停即显示对比度，或选中元素后点 Styles 里 color 属性的取色器",
        "**不要只用颜色传达信息**：官方用全色盲（achromatopsia，完全色盲）模拟图演示——「哪个按钮是红色的」对模拟视图下的用户无解；表单必填项的正确做法是**红字 + 星号**双通道，而不是只写「红色即必填」"
      ],
      "terms": [
        {
          "en": "Contrast ratio",
          "zh": "对比度：两色亮度差的比值（1:1 到 21:1）；文本与图片文本都受对比度规则约束"
        },
        {
          "en": "Normal text / Large text",
          "zh": "正常文本与大号文本：以 18pt/24px（粗体 14pt/18.66px）为界；大号文本的对比度要求更低"
        },
        {
          "en": "Incidental text",
          "zh": "偶然性文本：恰好出现在图片里、或纯装饰的文字——对比度规则的例外之一"
        },
        {
          "en": "Achromatopsia (total color blindness)",
          "zh": "全色盲：完全无法分辨颜色的视觉状况——官方用它演示「只用颜色传达信息」为什么不可靠"
        },
        {
          "en": "WebAIM Contrast Checker",
          "zh": "WebAIM 对比度检查器：输入前景/背景 HEX 码即算出对比度与通过级别的在线工具（本课 Assignment 之外的正文推荐）"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：记住 AA 级两个数字（4.5:1 / 3:1）与三类例外",
        "打开 WebAIM Contrast Checker，把你最近项目里用过的三组前景/背景色各查一遍——不达 AA 的当场换成达标的",
        "练习 Chrome DevTools 就地检查：元素拾取器悬停看对比度提示，再选中一个文本元素从 Styles 面板的 color 取色器看详细结果",
        "审一遍你项目里的所有「用颜色表意」的地方（必填标记、成功/失败状态、选中态）：每一处都补上颜色之外的第二通道（星号、图标、文字、形状）"
      ],
      "quiz": [
        {
          "question": "AA 级对正常文本与大号文本的对比度要求各是多少？「大号文本」的界线是什么？",
          "answer": "AA 级：正常文本至少 4.5:1，大号文本至少 3:1（AAA 级分别是 7:1 与 4.5:1）。界线：字号至少 18pt/24px 为大号文本；粗体至少 14pt/18.66px 即算大号。正常文本就是小于这两个界线的文本。"
        },
        {
          "question": "哪三类文本不必遵守对比度规则？",
          "answer": "一是偶然性文本：恰好出现在含其他重要视觉内容的图片里的文字，或纯装饰性文字；二是未激活/禁用界面组件里的文本，比如降了透明度的禁用按钮；三是 logo 或品牌名中的文本。除这三类例外，正文与图片文本都要过对比度线。"
        },
        {
          "question": "为什么「必填项用红字标注」不够？官方的替代方案是什么？",
          "answer": "因为色盲或难以分辨某些颜色的用户，只靠文字颜色根本无法感知「哪些是必填」——官方用全色盲模拟图演示：模拟视图下「哪个按钮是红的」完全无解。替代方案是双通道：红字之外再加星号（或图标、文字说明），让信息不依赖颜色也能到达。"
        },
        {
          "question": "不背数字、不手算，检查对比度有哪两条现成路径？",
          "answer": "一是 WebAIM Contrast Checker：输入前景与背景的 HEX 码，直接告诉你通过哪些级别（页面还带链接专用检查器，管无下划线链接的对比度）；二是 Chrome DevTools：Elements 面板用元素拾取器悬停元素即显示对比度提示，或选中带文本的元素、点 Styles 面板里 color 属性的取色器查看详情。"
        }
      ],
      "optional": [],
      "note": "官方原文没有 Assignment 节（全站第四门无作业课），学习闭环靠上面 tasks 里的动手项。正文的三张示意配图（对比度问题示例、色盲模拟、双通道标注）托管在 GitHub 附件域，按既有口径不收录；图的核心信息本站已在正文转述——色盲模拟的结论是「按钮 4 才是红色的，但模拟视图下无从分辨」。",
      "why": "对比度是「看不见就用不了」级别的硬门槛：4.2:1 与 4.5:1 之间没有商量余地。而「只靠颜色」是最容易被视力正常开发者忽视的坑——你能分辨红绿，不代表你的用户能。这一课的两个习惯（选色先查对比度、表意必给第二通道）成本几乎为零，却能拦住无障碍审计里最大类的问题。",
      "sections": [
        {
          "h": "对比度：从 1:1 到 21:1",
          "p": [
            "给页面加颜色能让它更好看，但**错误的颜色组合**或**只靠颜色传达信息**，会让部分用户更难感知与理解内容。这不是让你在配色上束手束脚，而是让你在实际「使用」颜色时多一分留心。",
            "官方开篇放了一张三个例子的对比图（是的，三个）问你能否轻松读出全部文字——读不出，就是对比度太低。**对比度**（contrast ratio）是两种颜色的亮度差，以比值表达：白底白字是最低比值 **1:1**，白底黑字是最高 **21:1**。对比度规则既管普通文本，也管**图片形式的文本**。",
            "两档文本的定义要分清：**正常文本**指字号小于 18pt/24px 的文本（粗体则小于 14pt/18.66px）；**大号文本**指至少 18pt/24px（粗体至少 14pt/18.66px）。"
          ]
        },
        {
          "h": "两档标准与三类例外",
          "p": [
            "对比度有两级符合度标准，各自对正常文本与大号文本给出规则：**AA 级（最低要求）**——正常文本至少 **4.5:1**、大号文本至少 **3:1**；**AAA 级（增强）**——正常文本至少 **7:1**、大号文本至少 **4.5:1**。",
            "两级标准都有三类**例外**，不必遵守对比度规则：**偶然性文本**——比如恰好出现在一张含有其他重要视觉内容的图片里的文字，或纯装饰性的文字；**未激活或禁用的界面组件**里的文本——比如降低了透明度的禁用按钮；**logo 或品牌名**里的文本。",
            "你可能会想：「18.66 像素？4.5:1？这些数字怎么记得住？再说比值到底怎么算？」好消息是——都不用你算。"
          ]
        },
        {
          "h": "检查工具：WebAIM 与 DevTools",
          "p": [
            "**WebAIM Contrast Checker** 是检查对比度的绝佳工具：输入前景色与背景色的 HEX 码，它直接算出这个比值通过哪些符合度级别（如果有通过的话）。页面里还有一个**链接对比度检查器**的入口，专门讲「文本链接不带下划线时」对比度应该达到多少。",
            "浏览器 DevTools 也能就地检查元素内文本的对比度。以 **Chrome** 为例：在 Elements 面板点「元素拾取器」工具，悬停到页面元素上，Accessibility 区块的提示浮层里就显示对比度；或者在 Elements 面板选中一个带文本的元素，点 Styles 面板里 color 属性的取色器工具，同样能看到对比度。"
          ]
        },
        {
          "h": "别只用颜色传达信息",
          "p": [
            "现在你知道给文本和背景配色时要考虑对比度了；再看看另一个坑。官方放了一张色盲模拟图问你：图中的按钮哪个是红色的？**答案是按钮 4**——这张图模拟的是**全色盲**（achromatopsia，即完全色盲）。它说明了用色的一条关键规则：**不要只用颜色传达信息**。确有不得不只靠颜色的例外场合，但一般情况下都该遵守这条规则。",
            "再看一个例子：假设你做一个表单，说明文字写「必填项以红色文字标出」。如果用户是色盲、或难以分辨某些颜色，只靠文字颜色就会让表单难以感知甚至无法操作。正确的做法是给必填项**红字 + 星号**双通道——颜色之外，永远再给一条不依赖颜色的信息路径。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "html",
          "code": "<!-- ✗ 只用颜色：色盲用户无法知道哪些是必填 -->\n<p class=\"hint\">必填项以红色文字标出</p>\n<label class=\"required-red\">Email <input type=\"email\"></label>\n\n<!-- ✓ 双通道：红字 + 星号，颜色失效信息仍在 -->\n<p class=\"hint\">带 * 的为必填项</p>\n<label class=\"required-red\">Email * <input type=\"email\" required></label>",
          "note": "按官方配图（红色文字 vs 红色文字加星号）给出的等效代码。第二通道可以是星号、图标或文字，原则是信息不单独依赖颜色。"
        }
      ],
      "pitfalls": [
        {
          "title": "凭感觉选色，差一点点不达标也不管",
          "text": "4.4:1 与 4.5:1 视觉上几乎无差，但对依赖对比度的用户是「可用」与「吃力」的分界，审计工具也会如实报不达标。选色先过 WebAIM 检查器或 DevTools，达标了再落地——顺手的事，别靠眼睛赌。"
        },
        {
          "title": "用 placeholder 当标签、又指望灰色够浅「不抢眼」",
          "text": "浅灰 placeholder 是双重坑：对比度常年不达标，而且它不能替代 label（输入后消失、屏幕阅读器上下文缺失）。标签用 label 实体呈现，placeholder 只放格式示例，两者的颜色都要过对比度线。"
        },
        {
          "title": "状态只给颜色：成功绿、失败红、选中蓝",
          "text": "红绿色盲是最常见的色觉障碍，红绿状态对相当比例的用户是同一个颜色。每个颜色状态都配上第二通道：图标（✓/✗）、文字（成功/失败）、形状或位置变化——官方表单例子（红字加星号）就是这个原则。"
        }
      ],
      "official": {
        "assignment": [],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 advanced_html_css/accessibility/accessible_colors.md（本站自行编写简体讲解，未改编自任何第三方中文课程；官方原文无 Assignment 节与 Knowledge Check 节——全站第四门无作业课；正文三张示意配图托管于 GitHub 附件域，按既有口径不收录）",
        "sha256": "58c5147a48fea6e71c3a42f3632b3fa31ffe3f3549d1846a752ab253d9ecaaa8",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-advanced-html-and-css-keyboard-navigation",
      "title": "Keyboard Navigation",
      "zh": "键盘导航",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-keyboard-navigation",
      "summary": "键盘用户（以及用语音识别等模拟键盘输入的辅助技术用户）的四条生存规则。其一，交互元素必须**可聚焦**且**自带键盘事件处理**——div「按钮」要补 tabindex=\"0\" 和手写的 Space/Enter 监听，而原生 button 生来就有；这正是语义化 HTML 的又一次回报。其二，**永远不要彻底移除焦点样式**——outline: none 会让键盘用户彻底迷失，要么保留默认样式，要么换上你自己的焦点样式。其三，**Tab 顺序默认等于 HTML 源码顺序**——用 CSS（float/order）改视觉顺序或用 tabindex 改聚焦顺序时，必须保证 Tab 顺序与视觉顺序一致，最稳的办法是直接在 HTML 里按期望的聚焦顺序排元素。其四，隐藏内容要对辅助技术也隐藏——tabindex=\"-1\" 只解决键盘焦点，display: none / visibility: hidden 才是把内容同时移出 Tab 顺序与播报的正解。",
      "guide": "以下是官方原课的中文化梳理。这一课是语义化 HTML 课的直接续集：上一课说「div 按钮对屏幕阅读器不友好」，这一课说它对键盘用户同样不友好——而且给出了补救清单（tabindex + 手动事件），让你亲身体会「补丁比地基贵」。四条规则里最容易被无心破坏的是第二条：很多教程教你 outline: none 去「美化」，官方直接把话挑明——**永远不要彻底移除焦点样式**。第三条与第四条是两类高频事故：Tab 顺序与视觉顺序打架（用户按视觉预期按 Tab，焦点却去了别处）、隐藏菜单吃焦点（焦点「消失」在看不见的元素里）。学完本课请立刻用键盘完整走一遍你最近的项目：只用 Tab / Shift+Tab / Space / Enter，看能不能完成所有操作。",
      "understand": [
        "有些用户无法使用鼠标，靠**键盘**或能模拟键盘输入的辅助技术（如语音识别软件）操作；也有用户单纯偏爱键盘或键鼠混用——他们都需要正确的键盘导航",
        "交互元素必须同时具备两样东西：**可聚焦**（focusable）与**键盘事件处理**。div/span 默认两样都没有：要手动补 tabindex=\"0\"（让元素可聚焦）+ 监听 click 与 keydown（Space 或 Enter 触发）；而 **<button> 默认两者兼备**——聚焦后按 Space/Enter 即触发 click 事件",
        "**焦点样式**（focus styles）是元素获得焦点时的轮廓或边框：**永远不要彻底移除**（*:focus { outline: none } 是反模式）——要么保留默认，要么替换成自己的样式（transform: scale()、自定义 outline、加粗边框等）；彻底移除会让键盘用户失去「焦点在哪」的唯一视觉线索，页面等于不可导航",
        "**Tab 顺序**（tab order）= 按 Tab 键时元素获得焦点的顺序，默认与 HTML 文件里元素的排列顺序一致；用 CSS（float / order）改视觉顺序、或用 tabindex 改聚焦顺序时，**必须保证 Tab 顺序与视觉顺序一致**——不一致会让用户困惑受挫；最佳实践：直接在 HTML 里按期望的聚焦顺序放置元素",
        "**隐藏内容**（菜单、模态框等未展开内容）必须同时对辅助技术隐藏：给每个子项 tabindex=\"-1\" 只能挡住键盘焦点（其他辅助技术仍能读到并播报）；**正解是容器用 display: none 或 visibility: hidden**——既移出 Tab 顺序、也不被辅助技术播报，需要显示时再移除或覆盖该属性",
        "tabindex 三个值的语义：**0** = 按源码顺序加入 Tab 序列；**-1** = 不进入 Tab 序列但仍可用 JS 的 focus() 聚焦；**正数** = 人为指定聚焦次序（官方视频演示它如何制造混乱，实际开发中避免使用）"
      ],
      "terms": [
        {
          "en": "Keyboard navigation",
          "zh": "键盘导航：只用键盘（Tab/Shift+Tab 移焦点、Space/Enter 激活）完成页面全部操作的能力；语音识别等模拟键盘输入的辅助技术同样依赖它"
        },
        {
          "en": "Focusable / Focus",
          "zh": "可聚焦与焦点：元素能接收键盘焦点才可被键盘操作；原生交互元素默认可聚焦，div/span 默认不可"
        },
        {
          "en": "Focus styles",
          "zh": "焦点样式：元素获得焦点时的视觉指示（轮廓/边框）；永远不要彻底移除，只能保留默认或替换为自定义样式"
        },
        {
          "en": "Tab order",
          "zh": "Tab 顺序：按 Tab 键时焦点遍历元素的顺序，默认等于 HTML 源码顺序；必须与视觉顺序一致"
        },
        {
          "en": "tabindex (0 / -1 / 正数)",
          "zh": "控制聚焦行为的属性：0 按源码序加入 Tab 序列；-1 移出 Tab 序列但可被 JS focus()；正数强行指定次序——制造混乱，避免使用"
        },
        {
          "en": "Skip links",
          "zh": "跳转链接（Assignment 阅读概念）：让键盘用户一键跳过重复导航直达主内容的链接，对逐 Tab 困难的用户尤其有用"
        }
      ],
      "tasks": [
        "立刻做一次键盘实测：打开你最近的项目，把鼠标放到一边，只用 Tab / Shift+Tab / Space / Enter 完成一遍核心操作——卡住的每一处都是本课规则的现形",
        "把本站示例区的 div 补丁版与原生 button 版各敲一遍，体会「补丁比地基贵」：tabindex + keydown 监听 + 角色缺失，一样都不能少",
        "完成官方 Assignment 三条：看 What is Focus? 视频（改 Tab 顺序引发的问题实拍）；接着看 Controlling focus with tabindex 视频（tabindex 如何影响 Tab 顺序）；读 WebAIM 的 Skip Links 一文——键盘无障碍的另一种形态，对逐 Tab 费力的用户尤其有用",
        "检查你项目里所有 outline: none：每一处要么恢复默认焦点样式，要么换成看得见的自定义样式（本站示例区给了三种替换思路）"
      ],
      "quiz": [
        {
          "question": "交互元素对键盘用户必须同时具备哪两样东西？div「按钮」分别怎么补？",
          "answer": "可聚焦 + 键盘事件处理。div 默认两样都没有：补 tabindex=\"0\" 让它可聚焦；再手动监听 click 与 keydown，在按下 Space（e.key === ' '）或 Enter 时触发同样的动作。而原生 button 默认两者兼备——聚焦后按 Space/Enter 就会触发 click 事件，什么都不用补。"
        },
        {
          "question": "为什么永远不要彻底移除焦点样式？合法的替代做法是什么？",
          "answer": "焦点样式是键盘用户「焦点现在在哪」的唯一视觉线索。彻底移除后，用户只能默默数自己按了几次 Tab、还得猜哪些元素可聚焦——等于让人用隐形的鼠标指针浏览网页。合法做法只有两种：保留默认焦点样式，或替换成自己的样式（比如按钮加 transform: scale()、链接加自定义 outline、输入框加粗边框并提高不透明度）。"
        },
        {
          "question": "Tab 顺序默认由什么决定？用 CSS order 或 float 改了视觉顺序后要注意什么？",
          "answer": "默认与 HTML 文件里元素的排列顺序一致。用 CSS 改变元素的视觉位置后，Tab 顺序不会跟着变——焦点会按源码顺序跳，与用户看到的布局打架（眼睛看到 A 在 B 前面，Tab 却先到 B）。纪律：保证 Tab 顺序与视觉顺序一致；最佳实践是直接在 HTML 里按期望的聚焦顺序放置元素，少用视觉层重排。"
        },
        {
          "question": "隐藏菜单为什么不能只给子项加 tabindex=\"-1\"？正解是什么？",
          "answer": "tabindex=\"-1\" 只挡住了键盘焦点（元素仍能被 JS focus()），其他辅助技术照样能访问并播报这些「看不见」的内容——两套信息不一致。正解是给隐藏内容的容器本身加 display: none 或 visibility: hidden：容器连同全部子项一起移出 Tab 顺序、也不再被辅助技术播报；需要显示时移除或覆盖该属性即可。"
        },
        {
          "question": "tabindex 的 0、-1、正数三种取值分别是什么语义？哪种应该避免？",
          "answer": "0：元素按源码顺序加入 Tab 序列（给 div 补可聚焦性的标准做法）。-1：元素不进入 Tab 序列，但仍可用 JavaScript 的 focus() 方法聚焦（适合程序化管理焦点的场景，如模态框打开时聚焦到第一个控件）。正数：人为指定聚焦次序（tabindex=\"1\" 会排在所有自然序元素之前）——官方视频演示的正是它制造的混乱，实际开发中避免使用。"
        }
      ],
      "optional": [],
      "note": "官方正文引用了语义化 HTML 课的石头剪刀布例子，本站示例区把它扩展成「补丁版 vs 原生版」对照。两支 Assignment 视频同属 Chrome for Developers 的 A11ycasts 系列（第 3、4 集），均无中文字幕声明；Skip Links 一文来自 WebAIM（无官方中文版，资料区有中文速览）。",
      "why": "键盘是辅助技术的地基：屏幕阅读器靠键盘命令导航，语音识别软件模拟键盘输入，很多运动障碍用户只能用键盘。「鼠标能用」不代表「能用」——键盘走不通的页面，对这整批用户就是关着的门。而修复成本极低：用对 button/a、别删 outline、按视觉顺序写 HTML、隐藏容器用 display:none——四条纪律就能挡住绝大多数键盘事故。",
      "sections": [
        {
          "h": "焦点：交互元素的两件必需品",
          "p": [
            "有些用户无法用鼠标导航或操作电脑——自然也包括他们访问的网站。这些用户转而依赖**键盘**，或依赖能**模拟键盘输入**的辅助技术（比如语音识别软件）；还有用户单纯更爱用键盘、或键鼠混用。他们都需要正确的**键盘导航**——而这一点在开发网站时很容易被忽视。",
            "还记得语义化 HTML 课里那个「没用语义元素」的石头剪刀布吗？div 与 span 还有一个问题：**默认不可聚焦、也没有任何事件处理**。要给键盘用户补救，得做两件额外的事——给每个「按钮」加 tabindex=\"0\" 让它可聚焦；再手动补上鼠标与键盘两套事件监听（click，以及 keydown 里判断 Space 或 Enter）。",
            "而且这么补完，对屏幕阅读器用户反而**更**不可理解了（这些「按钮」依然不提供任何角色上下文）。对比之下，<button> 不仅给屏幕阅读器用户需要的上下文，还**默认**可聚焦、默认带键盘事件处理：button 获得焦点时按 Space 或 Enter，就会触发 click 事件。结论与上一课一脉相承：**正确的语义化 HTML 让键盘无障碍几乎免费**；非要用默认不可聚焦的元素，就得把可聚焦与事件处理两样都手动补齐。"
          ]
        },
        {
          "h": "焦点样式：永远不要彻底移除",
          "p": [
            "可聚焦元素的另一面是**焦点样式**（focus styles）——元素获得焦点时环绕它的轮廓或边框。你可能干过（或仍在干）这件事：用类似 *:focus { outline: none; border: none; } 的 CSS 把它们彻底干掉，因为「太丑了」。",
            "你大概已经猜到官方要说什么了：**永远不要彻底移除焦点样式**。要么别动默认样式，要么**替换**成你自己的焦点样式——给按钮加 transform: scale()、给链接加 outline、给输入框加粗边框并提高不透明度，都行；「换成自己的」是你唯一应该考虑的替代方案。",
            "为什么这么绝对？彻底移除焦点样式会让页面对键盘用户**不可导航、不可操作**：他们没有任何视觉线索知道焦点现在在哪个元素上，只能一边默数按了几次 Tab、一边猜哪些元素「到底」可聚焦。想象用一只隐形的鼠标浏览网页，悬停到链接或按钮上时没有任何视觉反馈——不太妙，对吧？"
          ]
        },
        {
          "h": "Tab 顺序：与视觉顺序保持一致",
          "p": [
            "**Tab 顺序**是按 Tab 键时页面元素获得焦点的顺序，默认与元素在 HTML 文件里列出的顺序一致——源码里第一个元素最先获得焦点，第二个其次，以此类推。",
            "有时你会想改变顺序：用 CSS（比如 float 或 order 属性）改元素的**视觉**顺序，或用 tabindex 属性改元素本身的**聚焦**顺序。无论用哪种手段，纪律是同一条：**保证 Tab 顺序与元素的视觉顺序一致**。两者不一致时，键盘用户会困惑甚至受挫——他们按视觉布局预期下一个焦点在某个元素上，结果焦点跑去了别处。",
            "避免这类问题的最佳方式很简单：**在 HTML 文件里就按你希望元素实际获得焦点的顺序放置它们**，让源码顺序、视觉顺序、Tab 顺序三者天然一致。"
          ]
        },
        {
          "h": "隐藏内容：对辅助技术也要藏好",
          "p": [
            "有时你想把内容藏起来，等特定事件发生再显示——比如点按钮才展开的菜单或模态框。为这类目的隐藏内容时，要确保它不仅**视觉上**隐藏，还要在「该显示之前」对**辅助技术**隐藏。",
            "藏得不彻底会出事故：键盘用户会在不该的时候 Tab 进这些内容——焦点指示器「消失」进了看不见的元素里，用户失去页面上的视觉焦点线索，困惑甚至受挫。",
            "一种补救是给隐藏内容里的**每个**子项 tabindex=\"-1\"（阻止元素经键盘获得焦点，但仍可用 JavaScript 的 focus() 聚焦）。这修好了键盘侧，**其他辅助技术却仍能访问并播报这些隐藏内容**。更好的方案：给隐藏内容的**容器本身**加 display: none 或 visibility: hidden，需要显示时再移除或覆盖该属性——容器内容既被移出 Tab 顺序，也不会被辅助技术播报，一次解决两个世界的问题。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "html",
          "code": "<!-- div「按钮」的键盘补丁：tabindex 让它可聚焦 -->\n<div class='button-container'>\n  <div class='rock button' tabindex='0'>Rock</div>\n  <div class='paper button' tabindex='0'>Paper</div>\n  <div class='scissors button' tabindex='0'>Scissors</div>\n</div>",
          "note": "官方补丁版。注意：补了 tabindex 还缺角色上下文（屏幕阅读器仍不知道这是按钮）——这正是「用原生 button 多好」的反面教材。"
        },
        {
          "lang": "javascript",
          "code": "// 补丁版还要手动补鼠标 + 键盘两套事件\nconst buttons = document.querySelectorAll('.button');\n\nfunction nameAlerter(e) {\n  if (e.type === 'click' || e.key === ' ' || e.key === 'Enter') {\n    alert(e.target.textContent);\n  }\n}\n\nbuttons.forEach(button => {\n  button.addEventListener('click', nameAlerter)\n  button.addEventListener('keydown', nameAlerter)\n})\n// 原生 <button> 不需要以上任何一行：聚焦后按 Space/Enter 自动触发 click",
          "note": "官方 JS 补丁。keydown 里判断空格（' '）与回车，是模拟原生按钮键盘行为的最小集。"
        },
        {
          "lang": "css",
          "code": "/* ✗ 反模式：彻底移除焦点样式 = 键盘用户失明 */\n*:focus {\n  outline: none;\n  border: none;\n}\n\n/* ✓ 合法替代：换成看得见的自定义焦点样式 */\n.button:focus { transform: scale(1.05); }\na:focus { outline: 2px solid currentColor; outline-offset: 2px; }\ninput:focus { border-width: 2px; opacity: 1; }",
          "note": "官方规则：要么保留默认焦点样式，要么替换为自己的——「彻底移除」不在选项里。"
        }
      ],
      "pitfalls": [
        {
          "title": "outline: none 一时爽",
          "text": "觉得默认焦点框丑就全局干掉，是键盘无障碍的头号事故源：用户瞬间失去焦点位置的唯一线索。丑可以换样式（scale、自定义 outline、加粗边框），不能没有。"
        },
        {
          "title": "CSS 重排视觉顺序，忘了 Tab 顺序不跟随",
          "text": "order / float / 绝对定位改的是「看起来」，Tab 顺序仍按 HTML 源码走——视觉与焦点打架，用户按预期按 Tab 却跳到看不见的地方。重排后必须键盘实测一遍；根治办法是按目标顺序写 HTML。"
        },
        {
          "title": "隐藏菜单只藏视觉不藏焦点",
          "text": "opacity: 0 或移到屏幕外的「隐藏」，键盘照样 Tab 得进去——焦点消失在不可见元素里。容器级 display: none / visibility: hidden 才能同时移出 Tab 顺序与辅助技术播报。"
        },
        {
          "title": "用正数 tabindex 微调聚焦次序",
          "text": "tabindex=\"1\" 会插队到所有自然序元素之前，多个正数混用后焦点路径变成没人看得懂的迷宫（官方视频实拍演示）。次序问题回到 HTML 源码顺序解决；只用 0 和 -1。"
        }
      ],
      "official": {
        "assignment": [
          "观看 What is Focus?（什么是焦点）视频，看试图改变 Tab 顺序时会发生的一些问题；接着观看 Controlling focus with tabindex（用 tabindex 控制焦点），看 tabindex 属性如何影响 Tab 顺序",
          "阅读 WebAIM 的 Skip Links（跳转链接）——键盘用户的另一种无障碍形态，对需要更费力地 Tab 过页面内容的用户尤其有帮助"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 advanced_html_css/accessibility/keyboard_navigation.md（本站自行编写简体讲解，未改编自任何第三方中文课程；官方原文无 Knowledge Check 节）",
        "sha256": "c944ce7e1ecb16e098db96cbf4e28d6b4c546810a1c6759bc2aa20ebadd04535",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-advanced-html-and-css-meaningful-text",
      "title": "Meaningful Text",
      "zh": "有意义的文本",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-meaningful-text",
      "summary": "让每一段文字「脱离上下文也能被立刻理解」：屏幕阅读器用户常在链接之间跳转、逐个听链接——「点击这里」离开所在句子就毫无意义，链接文本应指明去向且简短（约 100 字符内）；会打开或下载文件的链接要写明文件类型与大小；target=\"_blank\" 新开的链接要以某种方式告知。表单报错要给足三样信息：哪个输入错了、为什么错、怎么改——「Error: Invalid input」三样全缺。说明文字要放对位置：单个输入的专属说明放输入框旁边，全表单通用的说明放表单顶部或标签旁。alt 文本有两种合法形态：内容图给描述（播报为「Odin，图形」），纯装饰图给空字符串 alt=\"\"（null 值——故意告知辅助技术跳过；省略 alt 属性反而会连图片存在都被播报）。",
      "guide": "以下是官方原课的中文化梳理。这一课的检验标准特别好用：**把文字单独念出来，听的人能不能懂**。链接文本念出「点击这里，链接」就是失败，念出「The Odin Project，链接」就是成功；报错念出「输入无效」是失败，念出「'JohnSmith@@test.com' 无效，有效示例：example@yourdomain.com」是成功。alt 一节有个反直觉的要点：装饰图的 alt=\"\" 不是偷懒，是**有意义的「无文本」**——它明确告诉辅助技术「跳过我」，而省略 alt 属性反而会让图片的存在（可能连同随机文件名）被播报出来。写文案时多念一遍，是这一课全部规则的实操心法。",
      "understand": [
        "**有意义的文本**的标准：用户读到或听到一段文字时，**不需要周围上下文**就能立刻明白它的意思；缺失有意义的文本影响所有用户，对依赖辅助技术的用户尤甚",
        "链接三规则：① <a> 的文本内容要能**指明去向**且**简短**（约 100 字符内）——避免「点击这里」「这个页面」；② 链接会**打开或下载文件**时，写明**文件类型与大小**（如「2021 报名统计（PDF，1MB）」）；③ 链接带 target=\"_blank\" **自动新开标签页/窗口**时，要以某种方式告知用户（如「GitHub（新标签页打开）」）",
        "屏幕阅读器用户可以**在同类元素之间跳转**（比如逐个遍历页面上的全部链接）——链接文本脱离上下文被单独播报，这就是「点击这里」致命的技术原因；同页多个「点击这里」更是灾难",
        "表单报错的三级进化：「Error: Invalid input」（哪个错了？为何错？怎么改？全不知道）→「Error: Email is invalid」（至少知道去哪改，但不知道为什么）→「Error: 'JohnSmith@@test.com' is not valid. Example of a valid email: example@yourdomain.com.」（错在哪、怎么改都齐了）；报错应告诉用户**哪个输入出了问题**，并尽可能说明**怎么修或为什么错**",
        "表单**说明文字**的位置纪律：某个输入**专属**的说明（如密码规则「至少含一个大写字母和一个数字」）放在**输入框旁边**；**全表单通用**的说明（如哪些是必填）放**表单顶部**（「* 表示必填」）或**输入框/标签旁边**（「姓名（必填）」）",
        "**alt 文本两种合法形态**：内容图写描述——屏幕阅读器播报「Odin，图形」，让用户知道有图、图是什么；**纯装饰图或不重要的图用空字符串 alt=\"\"**（称为 null 值，勿与 JS 的 null 数据类型混淆）——明确让辅助技术跳过；**省略 alt 属性是错的**：图片存在仍可能被播报（文件名是随机字符串时尤其莫名其妙）"
      ],
      "terms": [
        {
          "en": "Meaningful text",
          "zh": "有意义的文本：脱离周围上下文也能被立刻理解的文字——链接、报错、说明、alt 都按这个标准写"
        },
        {
          "en": "Alternative text (alt)",
          "zh": "替代文本：img 的 alt 属性内容，屏幕阅读器用它播报图片；内容图写描述，装饰图写空字符串"
        },
        {
          "en": "Null value (空 alt)",
          "zh": "alt=\"\" 的专名：故意留空、告知辅助技术跳过该图——与「省略 alt 属性」是两回事，也与 JS 的 null 无关"
        },
        {
          "en": "Context-free comprehensibility",
          "zh": "脱离上下文可理解：屏幕阅读器用户按元素类型跳转收听（逐个链接、逐个标题），每段文字都必须单独成立"
        }
      ],
      "tasks": [
        "把「念一遍」心法用在你最近的页面上：逐个念出所有链接文本——听不出去向的当场改写",
        "完成官方 Assignment 两条：读 WebAIM 的 Alternative Text 一文（按图片功能与上下文决定 alt 怎么写的完整方法论）；读 WebAIM 的 Usable and Accessible Form Validation and Error Recovery（报错呈现方式大全与各自利弊）",
        "审一遍你项目里的表单报错：对照「哪个错了 / 为什么错 / 怎么改」三问，把只答零问或一问的报错全部升级到三问",
        "给你项目里所有 img 补 alt：内容图写描述、装饰图写空字符串——检查有没有「干脆没写 alt」的漏网之鱼"
      ],
      "quiz": [
        {
          "question": "为什么「点击这里」对屏幕阅读器用户是坏链接文本？技术上发生了什么？",
          "answer": "因为屏幕阅读器用户常在同类元素间跳转——比如逐个遍历页面上所有链接，链接文本会被脱离上下文单独播报。「点击这里，链接」听不出任何去向；如果一页有多个「点击这里」，用户听到的是一串毫无区别的重复指令。对照官方例句：「The Odin Project，链接」脱离上下文依然成立。规则：链接文本指明去向、保持简短（约 100 字符内）。"
        },
        {
          "question": "会下载文件的链接和 target=\"_blank\" 的链接，各要额外告知什么？",
          "answer": "文件链接要写明文件类型与大小，比如「2021 报名统计（PDF，1MB）」——用户需要知道点开会发生什么、要下载多大的东西。target=\"_blank\" 的链接要以某种方式告知会新开标签页或窗口，比如「GitHub（新标签页打开）」——否则用户前进后退的心智模型会被突然多出的标签页打乱。"
        },
        {
          "question": "把报错「Error: Invalid input」按官方三级进化改到最好，并说明每级补了什么。",
          "answer": "二级：「Error: Email is invalid」——补了「哪个输入错了」，用户知道去哪改，但还不知道为什么无效。三级：「Error: 'JohnSmith@@test.com' is not valid. Example of a valid email: example@yourdomain.com.」——再补「为什么错 + 怎么改」：回显了无效的原值、给出有效格式示例。原则：报错要指明肇事的输入，并尽可能说明修复方法或出错原因。"
        },
        {
          "question": "装饰性图片的 alt 应该写什么？为什么「省略 alt 属性」反而更糟？",
          "answer": "写空字符串 alt=\"\"（称为 null 值——故意留空，与 JS 的 null 数据类型无关）：它明确告诉辅助技术「这张图纯装饰，跳过」，用户不会被打扰。省略 alt 属性则不同：图片的存在仍可能被播报，用户会听到一个莫名的「图形」——如果文件名是随机字母数字串，播报出来更是莫名其妙。所以 alt=\"\" 是有意义的「无文本」，不是偷懒。"
        }
      ],
      "optional": [],
      "note": "本课代码示例全部来自官方正文（链接好坏对照、报错三级、alt 两形态），示例区原样收录。两份 WebAIM 阅读资料无官方中文版，资料区给了中文速览导读。写中文界面时同一套规则适用于中文文案：「点击这里」的问题在中文里一模一样。",
      "why": "这一课改的是你每天都在写的东西——链接文字、报错提示、图片说明。成本是零（反正要写字，写好一点不多花时间），收益直接落在「可理解」原则上：脱离上下文可理解的文字，让逐个链接跳转的用户、听不懂模糊报错的用户、依赖 alt 感知图片的用户都能独立完成任务。也是从本课开始，你会发现无障碍很多时候不是技术问题，而是把话说清楚的问题。",
      "sections": [
        {
          "h": "链接：脱离上下文也要成立",
          "p": [
            "**有意义的文本**这件事很直白：用户读到或听到一段文字时，应该**不需要任何周围上下文**就能立刻明白它的意思。缺失有意义的文本会影响所有用户，但对依赖辅助技术的用户影响尤甚。",
            "先看两个链接写法。例 1：「<a>点击这里</a> 开启你的 Web 开发生涯！」——对视力正常的用户完全没问题；但屏幕阅读器用户除了在标题与地标间导航，还常常**在同类元素之间跳转**，比如逐个遍历页面上的所有链接。这时例 1 被播报出来只有「点击这里，链接」——「这里」是哪里？脱离上下文，这个链接毫无意义；同页多个「点击这里」时，用户更是被反复告知去点一个不知所指的「这里」。例 2「访问 <a>The Odin Project</a> 开启你的 Web 开发生涯！」则不管在不在上下文里都成立：「The Odin Project，链接」。",
            "给页面加链接时遵守三条规则：**①** <a> 的文本内容要能指明链接去向、并且简短（**100 字符上下**）——避免「点击这里」「这个页面」这类短语；**②** 链接会打开或下载文件时，写明**文件类型与大小**（「2021 报名统计（PDF，1MB）」）；**③** 链接带 target=\"_blank\" 会自动新开标签页或窗口时，**以某种方式告知用户**（「GitHub（新标签页打开）」）。",
            "官方还给了一个自查心法：下次写链接时，**把元素内容念出声**——它能合理指明去向吗（页面、文章或视频的标题）？你会不会知道它要新开标签页、或弹出下载？如果你已经在练屏幕阅读器，更好的办法是直接用它来测。"
          ]
        },
        {
          "h": "表单：报错与说明都要「有意义」",
          "p": [
            "填表或提交表单时，有意义的报错能把体验从「令人受挫」变成……好吧，也许谈不上有趣，至少没那么挫败。官方给了报错的三级进化：**例 1**「Error: Invalid input.」——什么输入无效？为什么无效？怎么改？一个问题都没回答；**例 2**「Error: Email is invalid.」——至少知道去改邮箱了，但它仍是个模糊的报错：我们不知道邮箱**为什么**无效；**例 3**「Error: 'JohnSmith@@test.com' is not valid. Example of a valid email: example@yourdomain.com.」——哪个值错了、怎样才算对，全齐了。",
            "再想想辅助技术用户的处境：他们可能**看不到报错渲染在页面哪里**，听到的只有一句「输入无效」——例 1 对他们等于没有信息。所以告知表单错误时，你应该说明**哪个输入引发了错误**，并尽可能说明**怎么修复或为什么会错**。",
            "表单里另一种有意义的文本是**说明文字**（instructions）：比如密码框列出必须包含的字符（「至少含一个大写字母和一个数字……」）。位置纪律：**某个输入专属**的说明放在**输入框旁边**；**全表单通用**的说明——比如指明哪些输入必填——放在**表单顶部**（「* 表示必填项」）或**输入框或其标签旁边**（「姓名（必填）」）。"
          ]
        },
        {
          "h": "alt 文本：描述与「有意义的空白」",
          "p": [
            "img 元素的 alt 属性你应该已经很熟了。官方先出了一道判断题：例 1 alt='' 与例 2 alt='Odin'，哪个合法？**答案：两个都合法**——而且例 1 那种「没有文本」同样重要。",
            "当图片**纯粹是装饰**、或用户根本不需要知道它的存在时，你一般不希望辅助技术用户被打扰。这种情况**永远用空字符串** alt=\"\"（这被称为 **null 值**——别和 JavaScript 的 null 数据类型混淆）。反过来，**如果你干脆省略 alt 属性**，图片的存在仍可能被播报出来——用户会听到一个莫名其妙的「图形」，文件名是随机字母数字串时更是灾难。",
            "内容图则写描述：例 2 会被播报为「Odin，图形」——用户知道这里有张图、图的是什么。一张图的替代文本到底该写什么，最终取决于多种因素（图片的功能与上下文）——这正是 Assignment 里 WebAIM 那篇 Alternative Text 要展开讲的方法论。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "html",
          "code": "<!-- ✗ 例 1：「这里」是哪里？ -->\n<a href='...'>Click here</a> to start your career in web development!\n\n<!-- ✓ 例 2：脱离上下文也成立 -->\nVisit <a href='...'>The Odin Project</a> to start your career in web development!\n\n<!-- ✓ 文件链接：写明类型与大小 -->\n<a href='...'>2021 Sign Up Statistics (PDF, 1MB)</a>\n\n<!-- ✓ 新开标签页：明确告知 -->\n<a href='...'>GitHub (opens in new tab)</a>",
          "note": "官方链接四例。自查心法：把链接文字念出声——听得出去向吗？"
        },
        {
          "lang": "html",
          "code": "<!-- 报错三级进化 -->\n<!-- ✗ 例 1：哪个错了？为何错？怎么改？全无 -->\n<div class='input-error'>Error: Invalid input.</div>\n\n<!-- △ 例 2：知道去哪改，不知道为什么 -->\n<div class='input-error'>Error: Email is invalid.</div>\n\n<!-- ✓ 例 3：错值回显 + 有效示例 -->\n<div class='input-error'>Error: 'JohnSmith@@test.com' is not valid. Example of a valid email: example@yourdomain.com.</div>\n\n<!-- alt 两种合法形态 -->\n<img src='...' alt='' />          <!-- 装饰图：null 值，辅助技术跳过 -->\n<img src='...' alt='Odin' />      <!-- 内容图：播报「Odin，图形」 -->",
          "note": "官方报错三例与 alt 两例。注意 alt='' 与「不写 alt」是两回事。"
        }
      ],
      "pitfalls": [
        {
          "title": "「点击这里」与「更多信息」满天飞",
          "text": "视觉用户靠上下文理解链接，屏幕阅读器用户靠逐个链接跳转收听——脱离上下文的「这里」什么都指不了。链接文字本身写清去向（目标页/文章/视频的标题），这同时对 SEO 与可扫读性有利。"
        },
        {
          "title": "装饰图省略 alt 属性",
          "text": "以为「不写 alt」等于「没有 alt」——实际上省略后图片存在仍可能被播报（还可能连随机文件名一起念出来）。装饰图要显式写 alt=\"\"（null 值），明确让辅助技术跳过。"
        },
        {
          "title": "报错只说「无效」",
          "text": "「Invalid input」对看不到报错位置的用户等于零信息。三问自查：哪个输入错了？为什么错？怎么改？——能答几问答几问，例 3 那种「回显错值 + 给有效示例」是标杆。"
        }
      ],
      "official": {
        "assignment": [
          "阅读 WebAIM 的 Alternative Text（替代文本）一文，学习按图片的功能与所处上下文决定何时、如何为图片添加替代文本",
          "阅读 WebAIM 的 Usable and Accessible Form Validation and Error Recovery（可用且无障碍的表单校验与错误恢复），了解向用户呈现错误的不同方式及各自的利弊"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 advanced_html_css/accessibility/meaningful_text.md（本站自行编写简体讲解，未改编自任何第三方中文课程；官方原文无 Knowledge Check 节）",
        "sha256": "8ea028bbe1c072ed7e5633c9b42a0e704a58733f3cba8ac7eaa27e191c496445",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-advanced-html-and-css-wai-aria",
      "title": "WAI-ARIA",
      "zh": "WAI-ARIA",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-wai-aria",
      "summary": "ARIA（Web Accessibility Initiative's Accessible Rich Internet Applications，WAI 的「可访问富互联网应用」规范）在原生 HTML 无法表达语义时补位——它只修改元素在**无障碍树**（accessibility tree，基于 DOM、只含辅助技术所需信息的平行树）里的语义与上下文，**改不了**外观、行为，**加不了**可聚焦性与键盘事件。因此有「ARIA 五规则」，第一条就是能用原生元素就用原生——**没有 ARIA 好过错误的 ARIA**。本课重点讲四个属性：aria-label（覆盖原生标签成为无障碍名称；对 div/span 等无角色元素无效；别拿它改发音）、aria-labelledby（优先级更高，拼接多个 id 引用、可自引用、被引用元素可视觉隐藏；但不带 label 的点击聚焦行为）、aria-describedby（提供「描述」而非「名称」）、aria-hidden（从无障碍树隐藏但视觉保留——子元素连带隐藏且无法用 false 反隐藏，可聚焦元素禁用）。",
      "guide": "以下是官方原课的中文化梳理。这是本章技术密度最高的一课，官方的自我克制值得注意：ARIA 水很深，本课只讲「你能从中榨出大量价值」的少数属性。先立骨架——ARIA 只能改语义与上下文，四个「不能」（外观、行为、可聚焦、键盘事件）意味着它永远不是偷懒用 div 的借口（键盘导航课的补丁照样得打）。再记优先级链：aria-labelledby > aria-label > 原生标签。然后逐个吃透四个属性的脾气：aria-label 对 div/span 无效、不能当注音用；aria-labelledby 可拼接可自引用、引用目标可以藏起来、但没有点击聚焦联动；aria-describedby 管「补充说明」（密码要求那种）；aria-hidden 是「视觉留、播报删」，注意它连坐子元素且 focusable 元素禁用。学完用一条总纲收束：**没有 ARIA 好过错误的 ARIA**——拿不准就别加。",
      "understand": [
        "**WAI-ARIA** = Web Accessibility Initiative's Accessible Rich Internet Applications specification（WAI 的可访问富互联网应用规范），常简称 ARIA；用途：当原生 HTML 无法做到时，定义一条让 Web 内容更无障碍的路——**填补原生 HTML 留下的无障碍缺口**",
        "ARIA **只能**修改元素的语义或上下文；**不能**：修改外观、修改行为、添加可聚焦性、添加键盘事件处理——用 ARIA 时通常仍要额外补齐缺失的语义或功能（回想键盘导航课给 div「按钮」补的事件）",
        "**ARIA 五规则**：① 能用原生 HTML 元素与属性就绝不用 ARIA；② 绝不改变原生语义，除非别无选择；③ 所有交互式 ARIA 控件必须可用键盘操作；④ 绝不在可聚焦元素上用 role=\"presentation\" 或 aria-hidden=\"true\"；⑤ 所有交互元素必须有无障碍名称。总纲：**没有 ARIA 好过错误的 ARIA**（no ARIA is better than bad ARIA）",
        "**无障碍树**（accessibility tree）基于 DOM：DOM 表示构成网页的节点与对象，无障碍树只包含辅助技术要用的无障碍相关信息；ARIA 的工作方式就是修改这棵树里对象的属性——本课关注两个：**Name（无障碍名称**，辅助技术播报的名字，区分同类型元素；可由元素文本、<label>、alt 等一个或多个原生标签设定）与 **Description（描述**，在名称之外补充播报的内容）",
        "**aria-label**：覆盖元素的原生标签、改写名称属性——最适合元素本来没有原生标签的场合（如只有「X」的关闭按钮）；**对部分 HTML 元素无效**（如 div、span 这类无角色元素）；**不要**用它改单词的发音读法——某些辅助技术（如盲文显示器）会把你的「注音」原样输出成乱码",
        "**aria-labelledby**：覆盖原生标签**和 aria-label**（优先级更高）；无障碍名称 = 按传入顺序拼接被引用 id 元素的文本内容或 alt；可传任意多个 id 引用、可**自引用**（同一 id 重复传入会被忽略）；被引用元素即使视觉隐藏（hidden 属性或 CSS）仍然生效；但它**没有** <label> 那样的默认事件处理（点击标签聚焦输入框的行为要自己用 JS 补）",
        "**aria-describedby**：修改无障碍树的**描述**属性；用法同 aria-labelledby（传其他元素的 id，可指向视觉隐藏元素）——名称之外追加播报补充说明（如密码格式要求）",
        "**aria-hidden=\"true\"**：把元素从**无障碍树**隐藏、但**视觉上保留**——典型用途是藏装饰性图标（按钮里的 Material Icons 字符），避免图标字符被拼进无障碍名称（「Add add book，按钮」→「Add book，按钮」）；**连坐规则**：子元素全部随之隐藏，且子元素写 aria-hidden=\"false\" 也**无法反隐藏**；**可聚焦元素禁用**——聚焦时什么都不播报，键盘 + 屏幕阅读器用户会彻底困惑"
      ],
      "terms": [
        {
          "en": "WAI-ARIA / ARIA",
          "zh": "WAI 的「可访问富互联网应用」规范（Accessible Rich Internet Applications）：原生 HTML 表达不了语义时的补位属性集；业界惯用英文缩写 ARIA"
        },
        {
          "en": "Accessibility tree",
          "zh": "无障碍树：基于 DOM、只含辅助技术所需无障碍信息的平行树；ARIA 通过修改树中对象的属性起作用"
        },
        {
          "en": "Accessible name / Description",
          "zh": "无障碍名称与描述：无障碍树对象的两个属性——名称是播报的「名字」（区分同类元素），描述是名称之外追加播报的补充说明"
        },
        {
          "en": "aria-label / aria-labelledby / aria-describedby",
          "zh": "三个加标签的属性：aria-label 直接给字符串（覆盖原生标签）；aria-labelledby 拼接其他元素文本（优先级更高，可多引用可自引用）；aria-describedby 提供描述（补充说明）"
        },
        {
          "en": "aria-hidden",
          "zh": "从无障碍树隐藏（视觉保留）：装饰图标的标准处理；子元素连坐、false 无法反隐藏、可聚焦元素禁用"
        },
        {
          "en": "ARIA live regions",
          "zh": "ARIA 实时区域（Assignment 概念）：让页面动态更新被辅助技术主动播报的另一类 ARIA 属性"
        }
      ],
      "tasks": [
        "背下 ARIA 五规则的第一条与总纲（能用原生就用原生；没有 ARIA 好过错误的 ARIA），再用「四个不能」自查一遍：你是否有用 ARIA 掩盖「该用 button 却用了 div」的地方？",
        "把本站示例区四段代码各敲一遍：关闭按钮 aria-label、多引用 + 自引用的 aria-labelledby、密码要求 aria-describedby、图标 aria-hidden——每段都用屏幕阅读器或 DevTools Accessibility 面板听/看播报差异",
        "完成官方 Assignment 两条：通读 W3C「ARIA in HTML」规范第 1–5 节（很详尽，不要求背诵、得其大意即可——将来做前端测试时很多工具用 ARIA 角色选取元素，你会常回来查）；浏览 MDN 的 ARIA live regions（让动态更新被播报的另一类 ARIA 属性，有官方中文版）",
        "给你项目里的图标按钮做一次 aria-hidden 巡检：所有「图标 + 文字」按钮的图标 span 都该 aria-hidden=\"true\"，所有「纯图标」按钮都该有 aria-label"
      ],
      "quiz": [
        {
          "question": "ARIA 能做什么、不能做什么（四不能）？这对「div + ARIA 当按钮」意味着什么？",
          "answer": "ARIA 只能修改元素的语义或上下文；不能修改外观、不能修改行为、不能添加可聚焦性、不能添加键盘事件处理。所以「div + role=button」依然是残废的：可聚焦（tabindex）与键盘事件（Space/Enter）照样要手动补——ARIA 只是给屏幕阅读器一个角色播报，替代不了原生 button 的任何行为。这正是五规则第一条「能用原生就用原生」的根据。"
        },
        {
          "question": "复述 ARIA 五规则。",
          "answer": "① 能用原生 HTML 元素与属性时就绝不用 ARIA；② 绝不改变原生语义，除非别无选择；③ 所有交互式 ARIA 控件必须可用键盘操作；④ 绝不在可聚焦元素上使用 role=\"presentation\" 或 aria-hidden=\"true\"；⑤ 所有交互元素必须有无障碍名称。背后的总纲：用对了很强大、用错了同样危险——没有 ARIA 好过错误的 ARIA，哪怕你出于好意。"
        },
        {
          "question": "aria-label、aria-labelledby、原生标签三者的覆盖优先级？aria-label 有哪两个使用禁忌？",
          "answer": "aria-labelledby 覆盖 aria-label，aria-label 覆盖原生标签——aria-labelledby 优先级最高。aria-label 两禁忌：① 对部分无角色的 HTML 元素（如 div、span）根本无效——W3C 的 aria 仓库 issue #756 专门讨论此事；② 不要用它改单词的发音读法——你可能「修好」了屏幕阅读器的读音，但盲文显示器等其他辅助技术会把注音字符串原样输出，弄巧成拙。"
        },
        {
          "question": "aria-labelledby 有哪些独特能力？它比原生 label 少什么？",
          "answer": "三个独特能力：可传任意多个 id 引用、无障碍名称按传入顺序拼接（「Shirts」+「Shop Now」→「Shirts, shop now, button」，让页面上多个「立即购买」彼此可区分）；可以自引用（把自己的 id 也传进去；同一 id 重复传会被忽略）；被引用的标签元素即使视觉隐藏（hidden 属性或 CSS）依然生效——能给辅助技术用户专属的标签。少的是事件处理：原生 label 点击会聚焦关联输入框，aria-labelledby 没有这个默认行为，要用 JS 自己补。"
        },
        {
          "question": "aria-hidden=\"true\" 的用途、连坐规则与禁用场合是什么？",
          "answer": "用途：把元素从无障碍树隐藏但视觉保留——典型场景是按钮里的装饰图标（Material Icons 的字符「add」不加隐藏会拼进名称变成「Add add book，按钮」）。连坐规则：给了 aria-hidden=\"true\" 的元素，其全部子元素一起从无障碍树消失，且子元素写 aria-hidden=\"false\" 也无法反隐藏。禁用场合：可聚焦元素——聚焦时什么都不会播报，键盘加屏幕阅读器的用户会彻底迷失（这也是 ARIA 五规则第④条的原因）。"
        }
      ],
      "optional": [],
      "note": "ARIA 全名很长（Web Accessibility Initiative's Accessible Rich Internet Applications specification），业界口语与文档一律直接说 ARIA，本站沿用；「无障碍名称」「无障碍树」等译名沿 MDN 官方中文文档用法。官方本课只覆盖两个属性族（标签类 + aria-hidden），live regions 等留待 Assignment 与后续课程（前端测试工具大量使用 ARIA 角色选择器）。aria-label 对 div/span 无效的事实出处是 W3C aria 仓库 issue #756，资料区有直达链接。",
      "why": "现代 Web 应用里有大量原生 HTML 没有对应物的交互模式（自定义下拉、标签页、动态提示），ARIA 是让辅助技术理解它们的唯一途径——前端测试库（Testing Library 一族）也按 ARIA 角色选取元素，写对 ARIA 同时服务用户与测试。但 ARIA 是把双刃剑：写错比不写更糟（把语义搞乱还自以为无障碍）。这一课教的四个属性覆盖日常九成需求，五规则则让你知道什么时候该收手。",
      "sections": [
        {
          "h": "WAI-ARIA 是什么：填补缺口的四个「不能」",
          "p": [
            "前几课你已经学了不少让网站更无障碍的方法，但那些只是无障碍冰山的一角。**WAI-ARIA** 引入了一组属性，通过修改元素的语义与上下文让网站**更**无障碍——给你对这些元素如何被辅助技术感知的更大控制力。这个话题可以无限深，所以官方只讲两个（本站按属性族展开为四个）你能榨出大量价值的属性。",
            "WAI-ARIA 的全名要深吸一口气才念得完：**Web Accessibility Initiative's Accessible Rich Internet Applications specification**——WAI 的可访问富互联网应用规范，通常简称 **ARIA**。它的用途一句话：**当原生 HTML 无能为力时，定义一条让 Web 内容更无障碍的路**。把 ARIA 想成填补原生 HTML 留下的无障碍缺口的材料。",
            "关键认知：ARIA **只能**修改元素的语义或上下文。它**不能**修改元素的外观、**不能**修改元素的行为、**不能**添加可聚焦性、**不能**添加键盘事件处理。所以用 ARIA 时你通常还得额外动手补齐缺失的语义或功能——还记得键盘导航课里给 div「按钮」补的那套东西吗？ARIA 不替你干那些活。"
          ]
        },
        {
          "h": "ARIA 五规则：没有 ARIA 好过错误的 ARIA",
          "p": [
            "用对了，ARIA 极其强大；用错了，它同样极其危险。所以先把总纲刻在脑子里：**没有 ARIA 好过错误的 ARIA**（no ARIA is better than bad ARIA）——哪怕你出于最好的意图。",
            "WCAG 有一套「**ARIA 五规则**」：**①** 只要可能，永远优先用原生 HTML 元素与属性，而不是 ARIA；**②** 绝不改变原生语义，除非你别无选择；**③** 所有交互式 ARIA 控件必须能用键盘操作；**④** 绝不在可聚焦元素上使用 role=\"presentation\" 或 aria-hidden=\"true\"；**⑤** 所有交互元素必须有无障碍名称。",
            "下面的术语你暂时不会全部学到，但规则本身值得现在就理解——尤其当你决定自行深入 ARIA 的时候。"
          ]
        },
        {
          "h": "无障碍树：ARIA 改的到底是哪棵树",
          "p": [
            "在动手用属性之前，先搞清楚它们在改什么。**无障碍树**（accessibility tree）基于 DOM——后者你已经很熟。DOM 表示构成网页的节点与对象；无障碍树则**只包含辅助技术要使用的无障碍相关信息**。ARIA 的工作方式，就是修改构成这棵无障碍树的对象的属性。",
            "本课只关注其中两个属性：**Name（名称）**——也叫「无障碍名称」（accessible name），是辅助技术向用户播报的名字，也是同类型元素彼此区分的依据；名称可以由一个或多个原生标签设定——元素的文本内容、<label> 元素、alt 属性等都算。**Description（描述）**——辅助技术在名称之外追加播报的内容。",
            "接下来三个 aria-* 标签属性，分别对应的就是「改名称」与「改描述」这两件事。"
          ]
        },
        {
          "h": "三个标签属性：aria-label / aria-labelledby / aria-describedby",
          "p": [
            "ARIA 标签通过**覆盖原生标签**或**提供补充描述**帮辅助技术用户理解页面内容。与 <label> 不同，它们不局限于少数几种元素——但也有自己的脾气。先说共性：其中 aria-labelledby 与 aria-describedby 需要**另一个元素有 id**——你把那个 id 值传进属性，就在两个元素间建立了关联（类似 label 的 for 指向 input 的 id）。你可能记得课程前面警告过别滥用 id——这几位就是「id 真正必要」的场合。",
            "**aria-label**：覆盖元素的任何原生标签、改写无障碍树里的名称属性——最适合元素本来没有原生标签的场合。典型用例是菜单或模态框的「关闭」按钮：<button type=\"button\" aria-label=\"Close menu\">X</button>——屏幕阅读器不再播报莫名其妙的「X，按钮」，而是「Close menu，按钮」。地标元素也能用它区分多个同类区域：<nav aria-label=\"main navigation\"> 会播报「Main navigation，navigation landmark」。两个禁忌：**aria-label 对部分 HTML 元素无效**（比如 div、span 这类无角色元素——W3C aria 仓库 issue #756）；**别用它改单词的发音读法**——就算你把屏幕阅读器的读音「修好」了，盲文显示器之类的其他辅助技术会把你的注音原样摸出来，弄巧成拙。",
            "**aria-labelledby**：覆盖原生标签**和** aria-label（优先级最高）。无障碍名称 = 按传入顺序**拼接**被引用 id 元素的文本内容或 alt。它的妙处：可以传**任意多个** id 引用；可以让元素**引用自己**（注意同一 id 传多次只有第一次生效，后续会被忽略）——官方例子：<h2 id=\"label\">Shirts</h2> 配 <button id=\"shop-btn\" aria-labelledby=\"label shop-btn\">Shop Now</button>，播报为「Shirts, shop now, button」——一页多个「立即购买」从此彼此可区分。而且被引用的标签元素**即使视觉隐藏**（hidden 属性或 CSS）依然生效——你可以给辅助技术用户专属标签而不打扰视力正常用户。它像 <label> 却少一样东西：**没有默认事件处理**——点击 label 聚焦输入框的行为，aria-labelledby 没有，要自己用 JS 补。",
            "**aria-describedby**：修改的是无障碍树的**描述**属性（不是名称）。用法与 aria-labelledby 相同——传其他元素的 id，被引用元素同样可以视觉隐藏。官方例子是密码框：input aria-describedby=\"password-requirements\" 指向一句「密码至少 10 个字符」的说明——输入框获得焦点时，屏幕阅读器播报「Password, edit protected, password must be at least ten characters long」，用户一聚焦就知道密码要求。"
          ]
        },
        {
          "h": "aria-hidden：视觉留着，播报删掉",
          "p": [
            "就像 hidden 属性与 display/visibility 能把元素视觉隐藏一样，**aria-hidden** 属性可以把特定元素（比如装饰性图片与图标）从**无障碍树**里隐藏——区别在于：**元素对视力正常的用户依然可见**。",
            "典型场景是「图标 + 文字」的按钮：Material Icons 的图标本质是一个装着字符的 span（如 <span class=\"material-icons\">add</span>）。不加 aria-hidden 时，span 的字符与按钮文字被拼接成无障碍名称——播报成「Add add book，按钮」；给 span 加 aria-hidden=\"true\" 后，字符不进名称，播报正确地变成「Add book，按钮」。",
            "两条注意事项：**其一（连坐）**：元素一旦 aria-hidden=\"true\"，它的**全部子元素**也从无障碍树消失——而且给子元素写 aria-hidden=\"false\" **不起作用**，父级藏着就是藏着。**其二（禁用场合）**：**可聚焦元素绝不加 aria-hidden=\"true\"**——元素获得焦点时什么都不会播报，靠键盘加屏幕阅读器导航的用户会彻底困惑。这正是 ARIA 五规则第④条的由来。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "html",
          "code": "<!-- aria-label：无原生标签的元素给名称 -->\n<button type=\"button\" aria-label=\"Close menu\">X</button>\n<!-- 播报：「Close menu，按钮」（而不是「X，按钮」） -->\n\n<!-- 地标重名区分 -->\n<nav aria-label=\"main navigation\">...</nav>\n<!-- 播报：「Main navigation，navigation landmark」 -->",
          "note": "官方例。注意 aria-label 对 div/span 这类无角色元素无效。"
        },
        {
          "lang": "html",
          "code": "<!-- aria-labelledby：多引用拼接 + 自引用 -->\n<h2 id=\"label\">Shirts</h2>\n<button type=\"button\" id=\"shop-btn\" aria-labelledby=\"label shop-btn\">Shop Now</button>\n<!-- 播报：「Shirts, shop now, button」——多个 Shop Now 彼此可区分 -->\n\n<!-- aria-describedby：聚焦时追加播报说明 -->\n<label>\n  Password:\n  <input type=\"password\" aria-describedby=\"password-requirements\">\n</label>\n<span id=\"password-requirements\">Password must be at least 10 characters long.</span>\n<!-- 聚焦播报：「Password, edit protected, password must be at least ten characters long.」 -->",
          "note": "官方例。labelledby 改「名称」、describedby 加「描述」；两者的引用目标都可以视觉隐藏。"
        },
        {
          "lang": "html",
          "code": "<!-- ✗ 例 1：图标字符被拼进名称——「Add add book，按钮」 -->\n<button type=\"button\">\n  <span class=\"material-icons\">add</span>\n  Add Book\n</button>\n\n<!-- ✓ 例 2：aria-hidden 藏图标——「Add book，按钮」 -->\n<button type=\"button\">\n  <span class=\"material-icons\" aria-hidden=\"true\">add</span>\n  Add Book\n</button>",
          "note": "官方对比例：两版视觉完全相同，差别只在无障碍树。"
        }
      ],
      "pitfalls": [
        {
          "title": "拿 ARIA 当 div 的遮羞布",
          "text": "role=\"button\" 不会让 div 可聚焦、不会有键盘事件、不会长得像按钮——四个「不能」一个都绕不过。补丁照打不误，还不如一开始就写 button。五规则第一条：能用原生就用原生。"
        },
        {
          "title": "aria-label 用在 div/span 上，或拿来「注音」",
          "text": "对无角色元素 aria-label 直接无效（issue #756）；把「read」写成「red」式注音更糟——屏幕阅读器是顺了，盲文显示器会把注音字符串原样输出。读音问题不是 aria-label 的职责。"
        },
        {
          "title": "aria-hidden 用在可聚焦元素上",
          "text": "焦点到达时零播报——键盘 + 屏幕阅读器用户当场迷失（五规则第④条明令禁止）。同理注意连坐：把可聚焦元素套进 aria-hidden 容器里，等于间接犯了同一条。"
        },
        {
          "title": "以为 aria-labelledby 等于 label",
          "text": "播报效果相似，但点击行为完全不同：原生 label 点击聚焦输入框，labelledby 没有默认事件处理——需要就得 JS 自己补。"
        }
      ],
      "official": {
        "assignment": [
          "通读 W3C「ARIA in HTML」的第 1–5 节——文档非常详尽，照例不要求记住任何内容、得其大意即可；后面课程（尤其到前端测试时）很多工具用 ARIA 角色来引导你从一开始就带着无障碍思维构建，你大概率会回来查这份文档或类似资源",
          "浏览 MDN 的 ARIA live regions（ARIA 实时区域）——另一类非常有用的 ARIA 属性，让页面的动态更新能被辅助技术主动播报"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 advanced_html_css/accessibility/wai_aria.md（本站自行编写简体讲解，未改编自任何第三方中文课程；官方原文无 Knowledge Check 节；正文内联的 Semantic HTML 课页回链与 braille 维基词条分别按 TOP 自有课页剔除与知识点链接收录口径处理）",
        "sha256": "b23d74f5992eb78863f335e8a6a4a5a7929ca5416b58d55b2aee7d5b7469f7ca",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-advanced-html-and-css-accessibility-auditing",
      "title": "Accessibility Auditing",
      "zh": "无障碍审计",
      "group": 1,
      "url": "https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-accessibility-auditing",
      "summary": "章节收尾课：怎么验证你的无障碍做对了。两条路径。第一条是浏览器 DevTools 自带的无障碍面板——当「快速审计」用：查对比度、看各种无障碍属性、直接查看无障碍树。第二条是第三方审计工具，官方点名三个：axe DevTools（Chrome 扩展，问题按严重度排序、另有需人工核对项）、Lighthouse（Chrome DevTools 内置或命令行运行，除无障碍外还测性能、最佳实践、SEO、PWA，问题按类别分组）、WebAIM 的 WAVE（网页版输入 URL 即用，也有浏览器扩展与 API；返回页面预览 + 图标覆盖层，问题分 alerts / warnings / contrast errors 三类；图标可能弄乱布局，但相比查出的问题算小事）。官方最后提醒：最好的检查方式之一是听真实用户的反馈；而现阶段审计后只需修与本课程概念相关的问题。",
      "guide": "以下是官方原课的中文化梳理。这是「无障碍」章节的最后一课——前七课给了你规则，这一课给你「验收」的手段。建立的习惯是：每次交付页面前跑一遍快速审计（DevTools 面板）+ 一次完整审计（三选一工具）。三个工具的定位差异值得记：axe 专注无障碍、按严重度排序最适合日常；Lighthouse 是全家桶、给分数与分类报告，适合上线前体检；WAVE 的图标覆盖层最直观、适合视觉化排查。同时要校准预期：工具只能查出机械性问题（对比度、缺 alt、缺 label），POUR 里「可理解」「可操作」的深层问题仍要靠键盘实测与真实用户反馈——所以官方说审计后「现阶段只修与本课程概念相关的问题」，别被报告里的长清单吓退。",
      "understand": [
        "验证 a11y 的两条路径：**浏览器 DevTools 的无障碍面板**（快速审计：对比度、各种无障碍属性、无障碍树都能直接看）与**第三方审计工具**（完整审计）",
        "**axe DevTools for Chrome**：浏览器扩展形态；返回按**严重度排序**的问题清单，并会标出需要**人工核对**的问题",
        "**Lighthouse for Chrome**：Chrome DevTools 默认内置（也可能叫 Auditing 标签页）或命令行运行；不只审计无障碍——还包括性能、最佳实践、SEO 与 PWA（如适用）；问题**按类别分组**，同样可能给出需人工核对的清单",
        "**WebAIM 的 WAVE**：网页版工具，输入要审计的页面 URL 即用，也有浏览器扩展与 API；返回**页面预览 + 图标覆盖层**，问题分三类：**alerts（警报）、warnings（警告）、contrast errors（对比度错误）**；已知缺点：覆盖图标可能把页面布局弄乱——但如果你更关心查出的 a11y 问题，这算小事",
        "**用户反馈是最好的检查方式之一**：依赖无障碍特性的真实用户能发现工具查不出的问题；这并不总是容易做到，但受你网站无障碍（或缺乏无障碍）影响的人的声音值得听",
        "现阶段纪律：养成审计习惯、追踪你漏掉的 a11y 问题，但**只聚焦修复与本课程这部分概念相关的问题**——审计报告可能很长，别超出当前所学范围去追打全部条目"
      ],
      "terms": [
        {
          "en": "Accessibility auditing",
          "zh": "无障碍审计：用 DevTools 面板或第三方工具系统性检查页面的无障碍问题；应成为交付前的固定习惯"
        },
        {
          "en": "axe DevTools",
          "zh": "Chrome 扩展形态的审计工具：问题按严重度排序，标出需人工核对项；日常快速审计的首选"
        },
        {
          "en": "Lighthouse",
          "zh": "Chrome DevTools 内置（或命令行）的多维审计工具：无障碍 + 性能 + 最佳实践 + SEO + PWA，问题按类别分组"
        },
        {
          "en": "WAVE (WebAIM)",
          "zh": "WebAIM 的网页版审计工具（另有扩展与 API）：页面预览加图标覆盖层，问题分 alerts / warnings / contrast errors 三类"
        },
        {
          "en": "Vision deficiency emulation",
          "zh": "视觉缺陷模拟（Assignment 概念）：Chrome DevTools 可模拟色盲等视觉状况，亲眼看你的页面在受限视觉下的样子"
        }
      ],
      "tasks": [
        "打开 Chrome DevTools 找到无障碍相关面板：用元素拾取器看一个元素的 Accessibility 区块（名称、角色、对比度），再打开完整的无障碍树视图对照 DOM 树看一遍",
        "三选一装好工具并审计你最近的项目页：axe DevTools 扩展 / DevTools 里的 Lighthouse / WAVE 网页版——把发现的问题按「本课程学过的概念」过滤，逐条修复后重跑对比",
        "完成官方 Assignment 四条阅读：Chrome DevTools 无障碍功能参考（从 Accessibility tab 一节读起）；Chrome 83 更新页的 Emulate vision deficiencies 一节（学会用 DevTools 模拟色盲视角）；Open the Issues tab 一节（只需学会打开 Issues 面板——非无障碍内容可略过）；MDN 文档的 Features of the Accessibility panel 一节（Firefox 向的内容，对 Chrome 用户同样有用）",
        "建立习惯：以后每次交付页面前跑一遍「键盘实测（上一课）+ 快速审计（本课）」的组合拳"
      ],
      "quiz": [
        {
          "question": "DevTools 的无障碍面板能当「快速审计」用，具体能查什么？",
          "answer": "至少三样：对比度（色彩一课提过的就地检查）、元素的各种无障碍属性（名称、角色、状态——ARIA 课学的那棵树的对象属性）、以及整个无障碍树视图。它的价值在「快」：不用装任何东西，选中元素就能看它在辅助技术眼里的样子。"
        },
        {
          "question": "axe DevTools、Lighthouse、WAVE 三个工具各自的形态与特点是什么？",
          "answer": "axe DevTools：Chrome 扩展，返回按严重度排序的问题清单，并标出需人工核对的问题——专注无障碍。Lighthouse：Chrome DevTools 默认内置（或叫 Auditing 标签页）也可命令行跑，多维审计——无障碍之外还测性能、最佳实践、SEO、PWA，问题按类别分组。WAVE：WebAIM 的网页版工具（输入 URL 即用，另有扩展与 API），返回页面预览加图标覆盖层，问题分 alerts / warnings / contrast errors 三类；已知缺点是覆盖图标可能弄乱布局。"
        },
        {
          "question": "工具审计之外，官方说「最好的检查方式之一」是什么？为什么？",
          "answer": "获取依赖无障碍特性的真实用户的反馈。因为工具只能查机械性问题（对比度、缺 alt、缺 label），而「可理解」「可操作」层面的深层障碍——流程是否讲得通、报错是否帮得上忙——只有真实使用者能告诉你。这不总是容易做到，但值得争取。"
        },
        {
          "question": "第一次跑审计工具，报告里几十条问题，现阶段官方建议你修哪些？",
          "answer": "只聚焦修复与本课程这部分概念相关的问题——对比度、alt、label、语义元素、键盘可达这些你刚学过的。审计报告天然冗长（工具覆盖的准则远超课程范围），现阶段追打全部条目既不现实也没必要；养成「每次交付前审计 + 按所学修复」的习惯才是本课的目的。"
        }
      ],
      "optional": [],
      "note": "Assignment 的四份阅读都是官方文档节选（Chrome 开发者文档 ×3 + MDN 的 Firefox 文档 ×1），官方明确说非无障碍内容可略过；Chrome 开发者文档的两页经核验有官方中文版（?hl=zh-cn 参数形态），资料区给了中文直达。三个工具名（axe DevTools / Lighthouse / WAVE）按业界惯例保留英文。",
      "why": "规则学得再多，不验收就等于没做。这一课把「无障碍」从一次性知识变成可重复的工程习惯：DevTools 面板随手查、axe/Lighthouse/WAVE 定期体检、键盘实测补盲区、用户反馈兜底。这也是本章八课的闭环——第一问「为什么」，中间六问「怎么做」，最后一问「怎么知道做对了」。",
      "sections": [
        {
          "h": "DevTools：随手可做的快速审计",
          "p": [
            "现在你已经装备了让网站对更多用户无障碍的必要知识，问题随之而来：**怎么验证 a11y 特性实现对了？**有没有该修正的错误、可以改进的余地？本课就是来回答这些问题的，把你的 a11y 技能推过头顶。",
            "浏览器 DevTools 的用处你早就知道——查样式、调代码。但你可能不知道：DevTools 还能**直接查看各种无障碍特性**，当「快速审计」非常好用。你能查对比度（色彩一课提过）、查看元素的各种无障碍属性、查看整棵**无障碍树**等等。"
          ]
        },
        {
          "h": "三个第三方审计工具",
          "p": [
            "第三方无障碍审计工具很多、各有优劣，官方只点名三个。养成审计习惯后，你就能追查出漏网的 a11y 问题。无论你用这三个之一还是别的顺手的工具——**现阶段只聚焦修复与本课程这部分概念相关的问题**。",
            "**axe DevTools for Chrome**：扩展形态的工具，返回**按严重度排序**的问题清单，并会把需要**人工核对**的问题单独标出。",
            "**Lighthouse for Chrome**：Chrome DevTools **默认内置**（也可能列为 Auditing 标签页），也可以从**命令行**运行。它提供的不止 a11y 审计——还包括性能、最佳实践、搜索引擎优化（SEO）与渐进式 Web 应用（PWA，如适用）；问题**按类别分组**，与 axe 一样也可能给出需人工核对的问题清单。",
            "**WebAIM 的 WAVE**：**网页版**工具——输入想审计的页面 URL 即可，另有浏览器扩展与 API 选项。WAVE 返回**页面预览并在其上覆盖图标**，问题分为 **alerts（警报）、warnings（警告）与 contrast errors（对比度错误）**三类。已知缺点：放到页面上的图标可能**把布局弄乱**——但如果你更关心查出来的 a11y 问题，这只能算小事。"
          ]
        },
        {
          "h": "用户反馈：工具查不出的那一半",
          "p": [
            "当然，检查网站无障碍**最好的方式之一**，是从**依赖这些无障碍特性的用户**那里获取反馈。这并不总是容易做到，但那些可能受你网站无障碍（或缺乏无障碍）影响的人，他们的声音值得你去听。",
            "工具与用户反馈是互补的：工具负责机械性问题（对比度数值、缺失的 alt、没有 label 的输入框），用户负责体验性问题（流程讲不讲得通、报错帮不帮得上忙、键盘路径顺不顺）。两条腿都要有。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "审计工具全绿 = 无障碍达标",
          "text": "工具只覆盖机械性准则：语义、键盘流、认知负担这些深层问题它查不出。全绿只代表「没有低级错误」，键盘实测与用户反馈仍是必经环节。"
        },
        {
          "title": "被长报告吓退，或反过来逐条追打全部问题",
          "text": "工具的准则覆盖远超课程范围，第一次跑动辄几十条。官方口径：现阶段只修与本课程概念相关的问题——按所学过滤、逐条修复、重跑对比，比囫囵吞枣或干脆放弃都好。"
        },
        {
          "title": "只在开发机深色主题大屏上验对比度",
          "text": "对比度与视觉问题的暴露依赖真实环境：亮底主题、小屏、强光。WAVE 的覆盖层与 DevTools 的视觉缺陷模拟（Assignment 第 2 条）就是让你换个眼睛看自己的页面。"
        }
      ],
      "official": {
        "assignment": [
          "读 Chrome 开发者文档的 Accessibility features reference（无障碍功能参考），从 Accessibility tab 一节读起——它概览了 DevTools 里的各项无障碍功能",
          "读 Chrome 83 更新页里的 Emulate vision deficiencies（模拟视觉缺陷）一节——学会在 DevTools 里模拟色盲等视觉状况",
          "读 Open the Issues tab（打开 Issues 面板）一节——这页里与无障碍无关的内容可以略过，官方只想让你学会打开这个面板；打开后你就能看到 a11y 问题与其他被发现的问题",
          "虽然不同浏览器之间有差异（比如 role 属性的取值、无障碍属性的呈现方式），也看看 MDN 文档里 Features of the Accessibility panel（无障碍面板的特性）一节——内容更贴 Firefox，但对 Chrome 用户同样有有用的信息"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 advanced_html_css/accessibility/accessibility_auditing.md（本站自行编写简体讲解，未改编自任何第三方中文课程；官方原文无 Knowledge Check 节）",
        "sha256": "f9c0a1963aae5778077b890c1a359be57bf558b3880823ce2a96212ebf24ca87",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-advanced-html-and-css-introduction-to-responsive-design",
      "title": "Introduction to Responsive Design",
      "zh": "响应式设计导论",
      "group": 2,
      "url": "https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-introduction-to-responsive-design",
      "summary": "「响应式设计」章节的开篇课，回答「这是什么、为什么重要、要支持到多宽」。响应式设计（Responsive Design）描述的是让网站对浏览器尺寸的变化作出响应、从而在任何设备上都能正常工作的做法——官方坦白这个词有点名不副实：design 一词指向的是「决定什么好看、打磨用户体验」的视觉设计，而这几课真正教的是实现响应式的技术。自 2007 年第一代 iPhone 发布起，你的 Web 项目就必须在从桌面显示器到小手机屏的一切设备上正常工作——这是硬性要求，而响应式通常不会自动发生。支持范围的下限好定：常见小手机很少窄过 320px，在 320px 能用的站任何小设备都能用；上限难定：超宽显示器不罕见，通行的解法是给全部内容设一个 max-width 再在页面上居中。",
      "guide": "以下是官方原课的中文化梳理。这是全章的定调课，没有代码，要带走的是三个认知：一，「响应式设计」这个术语的重心在「响应」不在「设计」——它是一套让站点适应任何屏幕的技术集合，不是视觉设计课；二，320px 是可靠的下限目标，本站自己的课页验证也一直用它；三，上限靠「内容 max-width + 居中」兜底，而不是为超宽屏单独设计。官方 Assignment 只有一条：Chrome DevTools 的 device-mode 指南——学会在桌面浏览器里模拟各种移动设备，这是后面每一课动手验证的基础工具，建议现在就打开跟着操作一遍。",
      "understand": [
        "**响应式设计**（Responsive Design）：让网站对浏览器尺寸变化作出**响应**、在任何设备上都能工作的做法；官方提醒这个短语因 design 一词而**有点误导**——这几课的重点不是视觉设计决策（什么好看、用户体验怎么打磨、项目该长什么样），而是实现响应式的**技术**；但该短语已被普遍采用，所以沿用",
        "自 **2007 年第一代 iPhone** 发布起，Web 项目在从普通桌面显示器到小手机屏的一切设备上正常工作就成为**硬性要求**；这种响应式通常**不会自动发生**——项目一旦比纯文本复杂就会出问题（你最早的纯 HTML 菜谱项目在手机上大概还好用，只是图片会被裁掉）",
        "**响应式 Web 设计**（Responsive Web Design）= 一组让站点在任何尺寸屏幕上都可用的**技术**；既有让设计足够灵活、适应大多数屏幕的办法，也有在特定尺寸大幅改变页面布局的办法——多数项目会**两者都靠**",
        "**下限 320px**：常见流通中最小的手机很少窄过 320px，把它当可靠的下限目标——网站在 320px 宽能用，就能在任何小设备上用",
        "**上限**：超超宽显示器如今不罕见，要为站点被看在「荒谬地宽」的显示器上的可能性做打算；通行做法是给**全部内容**设一个 max-width、然后在页面上居中——这样内容在超宽分辨率下也好看"
      ],
      "terms": [
        {
          "en": "Responsive Design / Responsive Web Design (RWD)",
          "zh": "响应式设计 / 响应式 Web 设计：让网站响应浏览器尺寸变化、在任何设备上可用的做法与技术集合；术语重心在「响应」，不在视觉「设计」"
        },
        {
          "en": "Breakpoint（本词在媒体查询一课正式定义）",
          "zh": "断点：触发布局切换的屏幕尺寸；本课先建立「有些尺寸下布局会大幅改变」的直觉，语法与取值在 Media Queries 一课展开"
        },
        {
          "en": "max-width（内容居中方案）",
          "zh": "最大宽度：给全部内容设 max-width 再居中，是应对超宽屏的通行做法——内容不会被拉到荒谬的行宽，两侧留白自然吸收多余空间"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：用一句话说清「响应式设计」为什么名不副实、它的重心在哪",
        "完成官方 Assignment：读 Chrome DevTools 的 device-mode 指南，并在自己电脑上打开 DevTools 实际切换一次设备模拟（选一个 320px 宽的小机型看看任意常用网站的表现）",
        "回顾你最近写过的一个页面：找出它身上「不会自动响应」的第一处问题（固定宽度？被裁的图？溢出的行？），先记下来——本章后面四课会逐一给你工具"
      ],
      "quiz": [
        {
          "question": "官方说「Responsive Design」这个短语为什么有点误导？这几课的真正重点是什么？",
          "answer": "因为 design 一词指向视觉设计决策——决定什么好看、打磨用户体验、决定项目长什么样；而这几课的重点是实现响应式的技术，不是设计本身。只是因为这个短语已被普遍采用，才继续沿用。"
        },
        {
          "question": "「响应式会随 HTML 自动发生」这个说法对吗？官方用什么例子说明？",
          "answer": "不对。响应式通常不会自动发生，项目一旦比纯文本复杂尤其如此。官方的例子：你第一个纯 HTML 的菜谱项目在手机上大概工作正常——但图片已经被裁掉了；这说明「勉强能看」不等于「响应式」。"
        },
        {
          "question": "支持屏幕宽度的可靠下限是多少？为什么是它？",
          "answer": "320px。因为常见流通中最小的手机很少窄过 320px——网站在 320px 宽能正常工作，就应该能在任何小设备上工作。"
        },
        {
          "question": "面对超宽显示器，官方给出的通行做法是什么？",
          "answer": "给全部内容设置一个 max-width，然后把它在页面上居中。这样即使站点被显示在超宽分辨率上，内容也保持可读的行宽、看起来正常，两侧留白自然吸收多余空间。"
        }
      ],
      "optional": [],
      "note": null,
      "why": "这是「响应式设计」章节的定调课，也是整个高级 HTML 与 CSS 课程的最后一块拼图：前面你学会了让单个元素动起来（动画）、让所有用户都能用（无障碍），这一章要解决的是「让所有屏幕都能用」。320px 下限与 max-width 居中上限这两个数字，会成为你之后每一个项目的边界条件——本站自己的课页在 320px 零横向溢出的验证口径，正是这一课的工程化落地。",
      "sections": [
        {
          "h": "术语：「响应式设计」有点名不副实",
          "p": [
            "「响应式设计」（Responsive Design）描述的是这样一个概念：创建对浏览器尺寸变化作出**响应**的网站，让它在任何设备上都能工作。官方坦白：这个短语因为 design 这个词而**有点误导**。",
            "design 指的是做视觉决策——决定什么样的东西好看、打磨用户体验、精确决定一个项目该长什么样。这几课里会零星撒一点这方面的贴士，但它**不是主焦点**；主焦点是你可以用来在网站上实现响应式的**技术**。不过，既然这个短语已经被普遍采用，这里也就随大流沿用「响应式设计」的说法。"
          ]
        },
        {
          "h": "它是什么：2007 年起的硬性要求",
          "p": [
            "自 2007 年第一代 iPhone 发布以来，你的 Web 项目在从普通桌面显示器到小手机屏的**一切设备**上正常工作，就成了一项**硬性要求**（requirement）。",
            "你可能已经发现：这种响应式**不会自动发生**——项目一旦比「页面上的纯文本」复杂就尤其如此。你第一个纯 HTML 的菜谱项目在手机上大概工作得不错，但图片会被裁掉。所以说到底，「响应式 Web 设计」就是**一组技术**，用它们让你的站点在任何尺寸的屏幕上都能工作。",
            "有办法让你的设计足够灵活、在大多数屏幕上都表现良好；也有办法在特定尺寸下**大幅改变**页面布局。多数项目里，你最终会**两种都靠**。"
          ]
        },
        {
          "h": "该支持哪些屏幕宽度：320px 下限与超宽上限",
          "p": [
            "**下限**：常见流通中最小的手机很少窄过 **320px**，所以把它当作可靠的下限目标就好——你的网站在 320px 宽能用，那它在任何小设备上都应该能用。",
            "**上限**就难说清了：如今超超超宽显示器并不罕见，你应当为「站点可能被显示在某块荒谬地宽的显示器上」的可能性做打算。常见的做法是：给**全部**内容设置一个 max-width，然后把它在页面上**居中**——这样布置之后，即使在超宽分辨率下，你的内容看起来也没问题。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "把「响应式设计」当成视觉设计课来上",
          "text": "这几课教的是让布局适应屏幕的技术（viewport、弹性尺寸、图片策略、媒体查询），不是配色排版的美学。指望本章告诉你「移动端该长什么样」会落空——设计决策留给你自己的项目，工具在这里。"
        },
        {
          "title": "只在自己的屏幕上测",
          "text": "你自己的显示器既不是 320px 的小手机、也不是 2000px+ 的带鱼屏。官方 Assignment 让你学 device-mode 正是为此：桌面浏览器里就能模拟从手表到平板的一切宽度。养成每个项目都拖一遍宽度滑块的习惯，边界问题当场暴露。"
        },
        {
          "title": "为超宽屏堆内容而不是设上限",
          "text": "内容被拉满 3000px 宽时，一行文字长到眼球追不动。正解不是为超宽屏做特别设计，而是给内容设 max-width 再居中——两侧留白自然吸收多余宽度，一套布局通吃所有大屏。"
        }
      ],
      "official": {
        "assignment": [
          "读这份 Chrome DevTools 指南：如何模拟移动设备显示（how to simulate mobile device displays）——学会用 device mode 在桌面浏览器里查看站点在各种手机尺寸下的表现"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 advanced_html_css/responsive_design/introduction_to_responsive_design.md（本站自行编写简体讲解，未改编自任何第三方中文课程；官方原文无 Knowledge Check 节）",
        "sha256": "0cf8929a188363c8cd01c3c875e220c5291a33f33f7acaa56de2ffa826c343d0",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-advanced-html-and-css-natural-responsiveness",
      "title": "Natural Responsiveness",
      "zh": "自然响应",
      "group": 2,
      "url": "https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-natural-responsiveness",
      "summary": "做响应式网站的第一步，是用天生就灵活的技术——在多数情况下，先靠 flexbox 与 grid 让页面适应大范围屏幕，比急着用媒体查询重排页面更可取。这一课是一串保持「天然响应性」的实操贴士：一，纯 HTML（不带 CSS）本身就是响应的——大多数元素天生响应，直到你用 CSS 亲手改掉这一点；二，几乎所有项目的 head 里都该有 viewport meta 标签（width=device-width, initial-scale=1），让手机按真实分辨率渲染而不是模拟大屏再缩小；三，灵活性的头号敌人是固定宽度——width: 600px 永远缩不下去，多数场景的简单修法是把 width/height 换成 max-width/min-height；四，多数情况干脆别设 height，用 margin 和 padding 撑空间；固定宽度只在「小尺寸」时可接受（32px 图标、250px 侧边栏）；五，flex-wrap 与 grid 的 minmax/auto-fill 能用很少的额外工作做出惊人响应式的布局。",
      "guide": "以下是官方原课的中文化梳理。这一课的思维方式比任何一个属性都重要：**默认响应，例外固定**——HTML 元素本来就是弹性的，是写死的 width/height 把它们钉死了，所以每次写下固定尺寸时都要能说出理由。viewport meta 是照抄即可的仪式感代码，但你要知道它在防什么（早期手机浏览器「模拟大屏再缩小」的历史包袱）。官方两处 CodePen 演示（固定宽度溢出 vs max-width 收缩、固定高度溢出 vs min-height 生长）本站在代码示例区给了等效可敲版本，交互演示可回官方课页操作。Assignment 两条：MDN 的 viewport meta 专文补背景，以及一篇讲「百分比的坑」的存档文章——按官方提示，别太纠结文中的 @media 部分，媒体查询下一课就讲。",
      "understand": [
        "做响应式的**第一步**是用**天然灵活**的技术：后面会学按屏幕尺寸彻底重排页面（媒体查询），但多数情况下**先靠 flexbox 与 grid** 让页面在宽范围屏幕上工作更可取",
        "**纯 HTML（无 CSS）就是响应的**：官方给了一个无 CSS 的纯 HTML 页面，把浏览器缩到手机大小它工作得完美——甚至在 Apple Watch 上都能读；你项目里大多数元素**天生响应，直到你用 CSS 改掉这一点**——带着这个心态做项目并尽力维持天然响应性，你会发现要让站点正确响应，需要额外做的**没有那么多**",
        "**viewport meta 标签**：早期手机浏览器因多数网站没优化小屏而**模拟一块更大的屏幕**、显示缩小版页面；如今我们几乎从不想要这种行为，所以要声明按**真实的、未缩放的**屏幕分辨率查看——`<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">` 放进几乎每个项目的 `<head>`；它把网页初始宽度设为实际屏幕大小、且告诉浏览器不要缩放；用 Emmet 生成样板（`!` + 回车）的话你多半已经在用它了",
        "**避免固定宽高**：灵活性的头号敌人是元素上的固定宽度——`width: 600px` 让它永远不能缩到 600px 以下，多数手机屏放不下；固定高度在内容装不下时会溢出；多数场景的简单修法是换成 **max-width / min-height**（min-width 与 max-height 视语境也合法有用）——max-width 语义是「不超过该宽度、屏幕太小就收缩」，min-height 语义是「通常保持该高度、内容挤爆时生长而不是溢出」",
        "**多数情况干脆别设 height**：宁可让内容决定高度，用 **margin 和 padding** 增加内容周围的空间——无论内部内容怎么变，元素都保持灵活；例外大概只有 header 与 footer 这类。而固定宽度**在尺寸小的时候是可接受的**：32px 的图标用 max-width 没有意义（你多半**不想**让它缩），250px 的侧边栏多半需要**永远**是 250px——越小的宽度越可以放心写死",
        "**用 flex 和 grid 干活**：flexbox 就是**为**创建灵活布局而生的；用它们不保证完美响应，但极其有用——`flex-wrap`、grid 的 `minmax`、`auto-fill` 这类属性能用不多的额外工作做出**惊人响应式**的布局"
      ],
      "terms": [
        {
          "en": "Natural responsiveness",
          "zh": "天然响应性：HTML 元素不带 CSS 时默认就有的弹性；响应式的第一步是维持它、而不是先想着用媒体查询重排"
        },
        {
          "en": "Viewport meta tag",
          "zh": "视口 meta 标签：<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">——让移动浏览器按真实设备宽度渲染、不模拟大屏再缩小；几乎每个项目都要放进 head"
        },
        {
          "en": "max-width / min-height",
          "zh": "最大宽度 / 最小高度：固定宽高的柔性替代——「不超过、可收缩」与「通常保持、可生长」；对付溢出与挤压的第一修法"
        },
        {
          "en": "flex-wrap / minmax() / auto-fill",
          "zh": "换行 / 最小最大轨道 / 自动填充：flexbox 与 grid 里让布局随空间自动调整的三件套——不加媒体查询就能得到相当好的响应式行为"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：打开官方给的无 CSS 纯 HTML 演示页，把浏览器窗口拖到手机宽度，亲眼看一次「天然响应」",
        "检查你手头的 HTML 样板（或 Emmet 的 ! 展开结果）：确认 viewport meta 标签在 head 里，并能说出 width=device-width 与 initial-scale=1 各管什么",
        "在你最近的一个页面里全局搜一遍 width: 和 height:——对每一处固定值回答「为什么这里必须写死」；答不上来的，试着换成 max-width / min-height 或直接删掉",
        "完成官方 Assignment 两条阅读：MDN viewport meta 专文 + Using Percentages in CSS 存档文（按官方提示略读其中 @media 部分）"
      ],
      "quiz": [
        {
          "question": "为什么说「纯 HTML 就是响应的」？这个事实对写 CSS 有什么指导意义？",
          "answer": "不带任何 CSS 的 HTML 页面在从手表到桌面的任何宽度下都能正常阅读——元素默认随可用空间流动。指导意义是：大多数元素天生响应，直到你用 CSS（尤其是固定宽高）改掉这一点；所以写样式时默认维持弹性，每写一个固定尺寸都要有明确理由。"
        },
        {
          "question": "viewport meta 标签在防什么历史行为？width=device-width 和 initial-scale=1 各是什么意思？",
          "answer": "早期手机浏览器因为多数网站没为小屏优化，会模拟一块更大的屏幕、把页面整体缩小显示；这个标签声明「按真实屏幕分辨率渲染、不要缩放」。width=device-width 把页面初始宽度设为实际设备宽度，initial-scale=1 告诉浏览器初始缩放为 100%（不放大不缩小）。"
        },
        {
          "question": "width: 600px 和 height: 300px 各自的典型故障是什么？对应的简单修法？",
          "answer": "固定宽度永远缩不到 600px 以下——窄屏上元素溢出屏幕；修法是换 max-width: 600px（不超过 600px、屏幕小就收缩）。固定高度在内容装不下时溢出容器；修法是换 min-height: 300px（通常保持 300px、内容多就生长）。多数情况甚至应该完全不设 height，用 margin/padding 撑空间。"
        },
        {
          "question": "什么时候用固定宽度是合适的？官方的经验法则是什么？",
          "answer": "宽度越小，写死越可接受：32px 的图标不该用 max-width（你本来就不想让它缩），250px 的侧边栏通常需要永远保持 250px。经验法则是「没有普适规则，但小尺寸固定通常安全、大尺寸固定通常危险」——按语境权衡，选最合适的。"
        }
      ],
      "optional": [],
      "note": "官方正文的两处 CodePen 交互演示（固定宽度溢出 vs max-width 收缩；固定高度溢出 vs min-height 生长）按既有口径不在本站内嵌，本站「代码示例」节给出了等效可敲代码；想看可拖拽的实时对比，回官方课页操作即可。",
      "why": "这一课给整个响应式章节定了方法论基调：先天然、后干预。媒体查询是「特定尺寸下改变样式」的重武器，但在动用重武器之前，viewport meta、max-width/min-height、flex-wrap、minmax/auto-fill 这些「天生灵活」的工具已经能覆盖绝大多数场景——本站首页那套从 320px 到超宽屏都不破的卡片流，靠的正是这一课的清单，媒体查询只兜了最后一小段。",
      "sections": [
        {
          "h": "纯 HTML 天生就是响应的",
          "p": [
            "做响应式网站的第一步，是使用**天然灵活**的技术。后面的课会教你按屏幕尺寸彻底重排页面上的元素，但多数情况下，**先**靠 flexbox 和 grid 这类工具让页面在宽范围的屏幕上工作，是更可取的做法。",
            "不带 CSS 的纯 HTML 就是响应的。官方给了一个**无 CSS 的纯 HTML 页面**，让你把浏览器缩到手机大小试试——它工作得完美，你甚至能在 Apple Watch 上读那个站。",
            "当然，不是每个网站都能简陋到只有纯文本；但要记住：**你用来搭项目的大多数元素都是响应的——直到「你」用 CSS 改掉这一点**。带着这个心态做项目、尽力维持这种天然响应性，你会发现要让站点正确地响应，需要额外做的事**没有那么多**。这一课剩下的部分，就是一串维持天然响应性的贴士。"
          ]
        },
        {
          "h": "viewport meta 标签",
          "p": [
            "手机刚开始有浏览器那会儿，大多数网站**没有**为这么小的屏幕分辨率做优化。为了绕开这个问题，多数手机浏览器会**模拟一块更大的屏幕**、显示页面的缩小版。而如今，我们几乎从不想要那种行为——所以必须显式声明：我们要求网站按**实际的、未缩放的**屏幕分辨率显示。",
            "因此，几乎每个项目的 HTML `<head>` 里都该加上这段：`<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`。它把网页的初始宽度设为你正在用的实际屏幕大小，并告诉浏览器不要做放大缩小。就这么简单。",
            "如果你一直用 Emmet 生成 HTML 样板（`!` + 回车），那你多半**已经**在用这个标签了。"
          ]
        },
        {
          "h": "避免固定宽度和高度",
          "p": [
            "灵活性的**头号敌人**是元素上的固定宽度。给任何东西写上 `width: 600px`，它就永远不能缩到 600px 以下——你想让它塞进多数手机屏的机会就此泡汤。同样，给元素钉一个固定高度，内容一旦装不下就会出问题。",
            "具体怎么办要看语境，但多数场景有个简单修法：把 `width` 或 `height` 换成 **`max-width`** 或 **`min-height`**（`min-width` 和 `max-height` 也合法，视语境可能有用）。定义了 max-width 后，元素**不会超过**该宽度，但屏幕太小放不下时**会收缩**；min-height 则让容器平时保持该高度、内容挤爆时**生长**而不是溢出。官方用两个交互演示分别展示了固定宽度的溢出与 max-width 的收缩、固定高度的溢出与 min-height 的生长。",
            "**多数情况干脆完全避免设 height**。这条规则有例外（header 和 footer 也许可以），但更该优先用 **margin 和 padding** 来增加内容周围的空间——用它们，无论里面的内容怎么变，元素都保持灵活。",
            "**什么时候固定宽度是合适的**？很难定一条普适规则，但大体上：**宽度越小，写死越可接受**。页面上一个 32px 的图标用 max-width 不会带来任何好处——你多半**不想**让它缩；同样，一个 250px 的侧边栏多半需要**永远**是 250px。跟一切一样，权衡你的选项、挑最合适的。"
          ]
        },
        {
          "h": "让 flex 和 grid 干活",
          "p": [
            "有句话明显到听起来像笑话：**flexbox 就是为创建灵活布局而生的**。用 flex 和 grid 不保证得到完美的响应式，但它们真的非常有用。",
            "相关属性你都已经学过了：`flex-wrap`、grid 的 `minmax`、`auto-fill` 这一类属性，能用不多的额外工作做出**惊人响应式**的布局。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "html",
          "code": "<!-- 几乎每个项目的 <head> 里都有这一行 -->\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<!-- width=device-width：初始宽度 = 实际设备宽度 -->\n<!-- initial-scale=1：初始缩放 100%，不模拟大屏再缩小 -->",
          "note": "官方正文代码块的等效呈现。用 Emmet 的 ! + 回车生成样板时它已包含在内——但你要知道它在防什么：早期手机浏览器「模拟大屏显示缩小版」的历史行为。"
        },
        {
          "lang": "css",
          "code": "/* ✗ 固定宽度：窄屏溢出屏幕 */\n.box-bad  { width: 600px; }\n/* ✓ 最大宽度：不超过 600px，屏幕小就收缩 */\n.box-good { max-width: 600px; }\n\n/* ✗ 固定高度：内容装不下就溢出 */\n.card-bad  { height: 300px; }\n/* ✓ 最小高度：平时 300px，内容多就生长 */\n.card-good { min-height: 300px; }\n\n/* 更多数情况：干脆不设 height，用 margin/padding 撑空间 */\n.card-best { padding: 24px; margin-bottom: 16px; }",
          "note": "官方两处 CodePen 演示（GRMpreM / qBjxVYg）的等效代码：max-width 的「不超过、可收缩」与 min-height 的「通常保持、可生长」。交互对比可回官方课页拖窗口实测。"
        }
      ],
      "pitfalls": [
        {
          "title": "全站搜不出一个 width，却仍被固定尺寸钉死",
          "text": "固定尺寸不只在 width 里：flex-basis、grid-template-columns 的 px 轨道、img 的 HTML width 属性都会钉死元素。排查时把所有写死的像素值过一遍，大尺寸的问自己「它凭什么不能缩」。"
        },
        {
          "title": "给图标和小部件也套 max-width: 100%",
          "text": "「一切皆弹性」用过头也是坑：32px 图标、头像、按钮内的小图本来就该保持固定——官方明说小尺寸写死是可接受的。弹性留给容器和大块内容，小部件钉死反而省心。"
        },
        {
          "title": "在真机上验证前就相信桌面浏览器的窄窗口",
          "text": "把桌面窗口拖窄和真手机不完全等价：device-mode 会模拟真实视口、像素比与触摸行为。device-mode 也仍是模拟——关键页面（尤其带 position: fixed 和 100vh 的）值得在真机上再看一眼。"
        }
      ],
      "official": {
        "assignment": [
          "读 MDN 的 Using the viewport meta tag（使用 viewport meta 标签），为 viewport meta 标签与屏幕分辨率的本质补充一点背景和细节",
          "读 Using Percentages in CSS（在 CSS 中使用百分比）一文——它处理另一个常见陷阱；按官方提示：不用太纠结其中的 @media 部分，媒体查询我们很快就讲"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 advanced_html_css/responsive_design/natural_responsiveness.md（本站自行编写简体讲解，未改编自任何第三方中文课程；官方原文无 Knowledge Check 节）",
        "sha256": "42836bbf7d9fe47419467a116c7f69189f0cf22442024288ca96f99fd9cf7b1c",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-advanced-html-and-css-responsive-images",
      "title": "Responsive Images",
      "zh": "响应式图片",
      "group": 2,
      "url": "https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-responsive-images",
      "summary": "图片在响应式网站上需要特别照顾。最基础的问题是宽高比（aspect ratio）：只缩宽度不管高度，图就会变形——解法极简单，宽弹性、高设 auto，比例自动保住。想让图「缩进容器但不整体缩小变形」时，有两族工具：background-size 与 background-position 只作用于背景图（对 img 标签无效）——background-position: center 让图永远居中、background-size: cover 让图铺满容器且裁剪最少；object-fit 则专为 img 标签而生——指定宽高后告诉图怎么适配：默认值 fill 会把图拉伸变形（这正是多数事故来源），cover 与 contain 才是常用解。要更强的控制，可以为不同屏幕真的换用不同的图（比如小屏用预先裁好的版本），两条路里最灵活的是 <picture> 标签。",
      "guide": "以下是官方原课的中文化梳理。这一课的工具分两族，先分清作用对象再记值：**背景图一族**（background-size / background-position，写在容器上）与 **img 一族**（object-fit，写在图片上）——两族共享 cover / contain 的语义，但 object-fit 多一个危险的默认值 fill（拉伸变形）。本站配了一张两族分工对比图插在讲解之后。官方两处 CodePen 演示（background 一族与 object-fit）按既有口径不内嵌，等效可敲代码在示例区。Assignment 三条把深度补齐：MDN 三个属性文档（一条任务三个链接，页内演示很直观）、MDN 的 Responsive Images 教程（HTML 侧的响应式图片入门）、CSS-Tricks 的响应式图片语法指南（srcset / sizes / picture 的落地细节）。",
      "understand": [
        "**宽高比**（aspect ratio）是响应式图片最基础的问题：宽度与高度的关系——小屏上只收窄图片宽度而不动高度，图就会**变形**；解法极其简单（早前课已提过）：**不要同时定义宽和高**——给图一个弹性的宽度、高度设 `auto`，比例就自动保住",
        "**background-size 与 background-position 只作用于带背景图的元素，对普通 `<img>` 标签无效**：`background-position: center` 保证图永远在容器中**居中**——即使容器小到装不下整张图；`background-size: cover` 缩放图片使其**始终完全填满**容器、同时**裁剪尽可能少**",
        "**object-fit 作用类似，但专为 `<img>` 标签而生**：有了它你**可以**同时指定宽和高，再告诉图片怎么适配这组尺寸；**默认值是 `fill`**——把图拉伸到填满尺寸（比例失真，多数「图变形了」事故的来源）；和 background-size 一样也可以选 **`cover`**（填满、裁边）或 **`contain`**（完整显示、留边）",
        "**更强的控制：不同屏幕用不同的图**——字面意义上换图，这给你图片在各分辨率下如何显示的最大控制权；例如与其指望 object-fit 把照片主体留在框内，不如在小屏上直接给一张**预先裁好的版本**；实现有两条路，最灵活的是 **`<picture>` 标签**（细节在 Assignment 的教程里）"
      ],
      "terms": [
        {
          "en": "Aspect ratio",
          "zh": "宽高比：图片宽度与高度的比例关系；响应式缩图的第一原则是保住它——弹性宽 + height: auto"
        },
        {
          "en": "background-size / background-position",
          "zh": "背景尺寸 / 背景位置：只作用于 CSS 背景图的两个属性（对 img 标签无效）；cover 填满且少裁、center 永远居中"
        },
        {
          "en": "object-fit (fill / cover / contain)",
          "zh": "对象适配：img 标签在指定宽高下如何自处——fill 默认拉伸变形、cover 填满裁边、contain 完整留边"
        },
        {
          "en": "<picture> / srcset",
          "zh": "picture 元素 / 源集：按屏幕条件真的换用不同图片文件的 HTML 机制——艺术指导（小屏用预裁版本）的最灵活工具"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：对照概念图，把「背景图一族」与「img 一族」的工具各归各位，并说出 object-fit 默认值为什么危险",
        "给任意一张照片同时写三版：height: auto 弹性宽、object-fit: cover 固定框、object-fit: contain 固定框——拖窗口对比三者行为差异",
        "完成官方 Assignment 三条阅读：MDN background-size / background-position / object-fit 三个属性文档（页内演示直接看行为）、MDN Responsive Images 教程、CSS-Tricks 响应式图片语法指南（重点看 srcset 与 picture 的写法）"
      ],
      "quiz": [
        {
          "question": "响应式图片最基础的问题是什么？最简单的解法？",
          "answer": "宽高比：小屏上只收窄宽度不管高度，图会变形。解法是不同时定义宽和高——给图片弹性宽度、height 设 auto，宽高比自动保住。"
        },
        {
          "question": "background-size / background-position 和 object-fit 各作用于什么元素？能互换吗？",
          "answer": "前者只作用于设置了 CSS 背景图的元素，对普通 img 标签无效；后者专为 img 标签设计。不能互换——作用对象不同；但 cover / contain 的行为语义在两族里是相通的。"
        },
        {
          "question": "object-fit 的默认值是什么？为什么它是事故高发区？cover 和 contain 的区别？",
          "answer": "默认值是 fill：把图片拉伸到填满指定尺寸——宽高比失真，「图怎么变形了」多数源于忘了显式设置 object-fit。cover 填满容器、超出部分裁掉（可能裁掉主体边缘）；contain 完整显示整张图、容器多余空间留白。"
        },
        {
          "question": "什么场景下应该用 <picture> 换图，而不是靠 object-fit 裁剪？",
          "answer": "当「裁同一张图」满足不了构图时——比如横版照片的主体在两侧，小屏方框里无论怎么裁都会丢主体；这时应为小屏准备一张预先裁好（或重新构图）的版本，用 picture/srcset 按屏幕条件真的换图，获得最大控制权。"
        }
      ],
      "optional": [],
      "note": "官方正文的两处 CodePen 交互演示（background 一族与 object-fit）按既有口径不在本站内嵌，本站「代码示例」节给出等效可敲代码；想拖窗口看实时行为，回官方课页操作即可。",
      "why": "图片是响应式布局里最容易「看起来还能用、细看全是伤」的一环：变形、模糊、小屏加载巨图三种事故各有各的根源。这一课把工具分成两族（背景图一族与 img 一族）加一条换图逃生通道（picture），配齐了从「保住比例」到「精确控制每个分辨率下看到什么」的完整梯度——下一课项目里的三尺寸设计稿，图片策略就靠这一课。",
      "sections": [
        {
          "h": "基础：宽高比与 height: auto",
          "p": [
            "做响应式图片时你要面对的最基础问题，是**宽高比**（aspect ratio）——宽度与高度之间的关系。在小屏上收窄图片的宽度却不处理高度，图就会**显得变形**！",
            "这个问题的解法极其简单，而且我们在早前的课里已经提过：**不要同时定义宽度和高度**。给图片一个弹性的宽度、高度设为 `auto`，它就能正确保住宽高比。"
          ]
        },
        {
          "h": "background-size 与 background-position：背景图一族",
          "p": [
            "如果你不想让图（宽和高都）缩呢？`background-size` 和 `object-fit` 这两个属性能为「宽高比怎么处理」提供更多灵活性。",
            "`background-position` 和 `background-size` 作用于**带背景图的元素**，对普通 `<img>` 标签**无效**。用这两个属性，你能对背景图的显示与摆放获得相当大的控制：比如 `background-position: center` 保证图**永远在容器里居中**——即使容器小到装不下整张图；`background-size: cover` 会缩放图片，使它**始终完全填满容器**、同时**裁剪尽可能少**。具体的例子与细节在后面的阅读任务里，官方还配了一处可拖玩的演示。"
          ]
        },
        {
          "h": "object-fit：img 标签一族",
          "p": [
            "`object-fit` 的作用类似，但它是给 **`<img>` 标签**用的。有了 object-fit，你**可以**给图片同时指定宽度和高度，然后告诉它该怎么把自己适配进这组尺寸。",
            "object-fit 的**默认值是 `fill`**：把图片拉伸到填满尺寸——比例就此失真。和 background-size 很像，你也可以让它 **`cover`**（填满、裁边）或 **`contain`**（完整、留边）。官方在这里放了一处演示：在 CodePen 打开并缩放浏览器，看图片如何反应。"
          ]
        },
        {
          "h": "更强的控制：不同屏幕换不同的图",
          "p": [
            "还可以字面意义上为不同屏幕尺寸使用**不同的图片**。这给你「图片在各分辨率下到底怎么显示」的**最大控制权**：比如，与其指望 object-fit 把照片主体留在画框里，不如在小屏幕上直接呈现一张**预先裁好的版本**。",
            "实现这一点有两条路，其中最灵活的是 **`<picture>` 标签**——你会在 Assignment 的阅读里学到更多。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "css",
          "code": "/* 第一原则：弹性宽 + auto 高，比例自动保住 */\nimg { max-width: 100%; height: auto; }",
          "note": "响应式图片的底线写法，也是多数事故的免疫针——只动宽、不钉高。"
        },
        {
          "lang": "css",
          "code": "/* img 一族：指定宽高后，告诉图怎么适配 */\n.avatar {\n  width: 200px;\n  height: 200px;\n  object-fit: cover;   /* 填满方框、裁掉超出——常用 */\n  /* object-fit: contain;  完整显示、两侧留白 */\n  /* object-fit: fill;     默认值：拉伸变形——慎用 */\n}\n\n/* 背景图一族：写在容器上，对 <img> 无效 */\n.hero {\n  background-image: url(banner.jpg);\n  background-size: cover;      /* 铺满容器、裁剪最少 */\n  background-position: center; /* 装不下也永远居中 */\n}",
          "note": "官方两处 CodePen 演示（powxJXV / NWgOGGX）的等效代码。两族共享 cover/contain 语义；object-fit 的默认值 fill 会拉伸变形，固定框场景务必显式声明。"
        },
        {
          "lang": "html",
          "code": "<!-- 换图逃生通道：小屏用预裁版本，宽屏用原图 -->\n<picture>\n  <source media=\"(max-width: 600px)\" srcset=\"photo-cropped.jpg\">\n  <img src=\"photo-full.jpg\" alt=\"团队合影\">\n</picture>",
          "note": "<picture> 的基本形态（细节在 Assignment 的 MDN 教程与 CSS-Tricks 指南里）：source 按媒体条件命中时换用 srcset 的图，否则回落到 img。艺术指导（小屏重新构图）的标准工具。"
        }
      ],
      "pitfalls": [
        {
          "title": "写了 object-fit: cover 却没给宽高，或给了宽高却忘了 object-fit",
          "text": "object-fit 只在「图片尺寸与固有比例不一致」时起作用：不给宽高，图按固有比例显示、cover 无从谈起；给了宽高却不写 object-fit，默认 fill 直接拉伸。两个条件都满足才有你想要的裁剪行为。"
        },
        {
          "title": "对 <img> 写 background-size，或对背景图写 object-fit",
          "text": "两族工具作用对象不同、互不生效：background-* 只认 CSS 背景图，object-fit 只认 img（及 video 等替换元素）。写了没效果时先检查图到底是怎么放进来的——<img src> 还是 background-image。"
        },
        {
          "title": "用 cover 硬扛构图问题，主体被裁掉一半",
          "text": "cover 的「裁剪最少」不等于「保住主体」：横向长图的主体在两端时，窄容器的 cover 必裁主体。这时该走换图路线——为小屏准备预裁版本（picture/srcset），这是官方说的「最大控制权」。"
        }
      ],
      "official": {
        "assignment": [
          "先看 MDN 的 background-size、background-position 与 object-fit 三个属性的文档（官方原文此条含三个链接，任务映射逐一附上）——那些页面上的演示应该能把用法讲清楚",
          "读 MDN 的 Responsive Images（响应式图片）——它是在 HTML 里提供响应式图片的入门介绍",
          "读 CSS-Tricks 的 Guide to the Responsive Images Syntax in HTML（HTML 响应式图片语法指南）——这篇好文更深入地讲了响应式图片的实际落地写法"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 advanced_html_css/responsive_design/responsive_images.md（本站自行编写简体讲解，未改编自任何第三方中文课程；官方原文无 Knowledge Check 节）",
        "sha256": "ac44cdbca0bc91bf3a820c7deb55743d77f25762a38ee627f042d93df2129699",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-advanced-html-and-css-media-queries",
      "title": "Media Queries",
      "zh": "媒体查询",
      "group": 2,
      "url": "https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-media-queries",
      "summary": "有了媒体查询，就能按用户屏幕尺寸彻底改变 Web 项目的样式。此前的课都在确保布局里的单个元素尽可能灵活，但有时你确实需要为特定屏幕尺寸实际改掉一些 CSS 值：可以是微调 margin、padding、font-size 往屏幕里塞更多内容，也可以是布局的大改——具体改什么取决于设计，底层技术是同一个。基本语法是 @media (max-width: 600px) { … }：max-width 查询在「小于等于」该值的屏幕上生效，min-width 则相反，max-height / min-height 也合法。但官方紧接着泼冷水：媒体查询可以无限写，最好却尽量少写、更多依靠布局的天然弹性。断点（触发查询的屏幕尺寸）取值意见纷纭——手机常在 500px 以下、平板 500–1000px、更大是桌面、超宽可过 2000px——但这不意味着开局就按设备铺查询：只设你需要的断点，基础布局一个 500–600px 的移动断点常常就够。另有两个易忘的事实：浏览器缩放会改变页面的有效分辨率、触发媒体查询；@media print 能给打印与打印预览单独一套样式。容器查询（@container）则把条件从视口换成某个容器元素。",
      "guide": "以下是官方原课的中文化梳理。这一课的重心与其说是语法（语法真的只有几行），不如说是**克制**：官方的「Limit media queries」一节明确说，能少写就少写，先靠上一课的天然弹性。断点参考区间（500 / 1000 / 2000px）要当「别人的经验」而不是「规范」来记——官方原话是取值意见纷纭、对你的项目合理就行。两个容易被忘的实务点值得单独留心：页面缩放会改变有效分辨率（断点「不按预期触发」的头号原因就是你忘了自己缩放过了）；@media print 可以给打印场景藏按钮、去颜色。容器查询是媒体查询的近亲——条件对象从视口换成容器，本站正文只做官方给的一段式引介，深入留给 MDN。Assignment 只有一条：MDN 的 Using media queries，里面还有几手不常用但值得知道的用法。",
      "understand": [
        "**媒体查询**让你按用户屏幕尺寸**彻底改变**项目的样式；此前的课都在让单个元素尽可能灵活，但有时需要**实际改掉**一些 CSS 值来适配特定尺寸——可以是微调（margin / padding / font-size 塞进更多内容），也可以是布局的大改；具体改什么取决于设计，**底层技术相同**",
        "**基本语法**：`@media (max-width: 600px) { body { margin: 8px; } }`——在**小于等于** 600px 的屏幕上 margin 是 8px，大于 600px 保持外面的 24px；就这么多——单靠这一点知识就能做出相当复杂的切换布局；一个文档里可以写**不限数量**的媒体查询，一个查询里也可以放**不限数量**的样式定义；**min-width**（大于等于时生效）、max-height 与 min-height 也都合法",
        "**克制使用**：能无限写不等于该无限写——最好**尽量少用**媒体查询、更多依靠布局的天然弹性；官方示例「my cool site」只需要**一个**媒体查询就照顾了所有桌面与移动尺寸，实在没必要再多建",
        "**断点**（breakpoint）= 触发媒体查询的屏幕尺寸；该设在哪**意见纷纭**；一般参考：手机通常在 **500px 以下**、平板常在 **500–1000px**、超过 1000px 多半是普通浏览器窗口、超宽屏可能**超过 2000px**——但这**不**意味着开局就按每类设备铺媒体查询；每个项目需求不同，**断点只设你需要的**：许多相对基础的布局只要一个 **500–600px 左右**的移动断点；更复杂的布局可以做三档——1200px 以上全尺寸、600–1200px 之间「平板」变体、600px 以下移动版；真正的要点是：**断点具体设在哪并不重要，对你的项目合理就行**",
        "**缩放会改变有效分辨率**：多数浏览器里，**放大页面会改变该页的有效分辨率**——窗口恰好 1000px 宽时，放大后页面的行为就像屏幕变**小**了，按模拟/缩放后的分辨率触发媒体查询；**缩小**则方便调试比你屏幕更大的尺寸；忘了自己缩放过，断点不肯在正确位置触发时会造成真正的困惑",
        "**打印样式**：常见 `@media screen and (max-width: 480px)` 里的 **screen 不是必需的**——目前学的一切都面向屏幕，写 screen 是冗余；但它指向另一个有用能力：按**媒体类型**换样式——`@media print` 为打印机或打印预览单独定义一套样式；常见做法是改颜色（转黑白）与 `display: none` 藏起对纸质无用的元素（按钮、导航链接）；课程不深入，但值得考虑利用。**容器查询**（`@container`）：媒体查询按视口/设备特征条件化样式，容器查询按某个**容器元素**的特征做同样的事——哪种更合理取决于你要条件化应用的样式；语法有细微差异、概念相同，文档照例齐全",
        "本站补充（非官方正文）：容器查询在既有课里其实已经见过实战形态——本站课页的章节导航补偿值就是「≤40rem 一档、更宽一档」的视口条件写法；若换成容器查询，条件可以挂在课页主容器上而不依赖视口。两者的取舍官方留给你按样式判断。"
      ],
      "terms": [
        {
          "en": "Media query (@media)",
          "zh": "媒体查询：按条件（屏幕尺寸、媒体类型等）应用样式的 CSS 规则块；max-width 小于等于生效、min-width 大于等于生效"
        },
        {
          "en": "Breakpoint",
          "zh": "断点：触发媒体查询的屏幕尺寸；官方口径——取值意见纷纭、只设需要的、对项目合理即可"
        },
        {
          "en": "Effective resolution（zooming）",
          "zh": "有效分辨率：浏览器缩放后页面「以为」的屏幕尺寸——放大让页面表现得像更小的屏，断点会按缩放后的分辨率触发"
        },
        {
          "en": "@media print",
          "zh": "打印媒体类型：为打印/打印预览单独定义样式；常见用法是转黑白、display:none 藏按钮与导航"
        },
        {
          "en": "Container query (@container)",
          "zh": "容器查询：条件对象从视口换成某个容器元素的特征；与媒体查询概念相同、语法有细微差异"
        }
      ],
      "tasks": [
        "通读本站中文讲解与官方原文：默写 @media (max-width: 600px) 的基本形态，并说清 max-width 与 min-width 的生效方向",
        "给任意一个你写过的页面加一个移动断点（500–600px 之间自选）：只改真正需要的值（margin？字号？栏数？），然后刻意克制、不再多加",
        "做一次缩放实验：把浏览器缩放到 150%，观察页面断点行为的变化——亲眼见一次「缩放改变有效分辨率」",
        "完成官方 Assignment：读 MDN 的 Using media queries，记下两三种你此前不知道的媒体特性写法"
      ],
      "quiz": [
        {
          "question": "@media (max-width: 600px) 的生效方向是什么？min-width 呢？",
          "answer": "max-width 查询在小于等于 600px 的屏幕上生效（任何不超过该值的屏幕都命中）；min-width 相反，在大于等于给定值的屏幕上生效。max-height / min-height 同理合法。"
        },
        {
          "question": "官方对「媒体查询写多少」的态度是什么？理由？",
          "answer": "尽量少写：可以无限建不等于该无限建，更多依靠布局的天然弹性。官方示例「my cool site」只需要一个媒体查询就照顾了所有桌面与移动尺寸，没必要再多建——查询越多，样式越难维护，天然弹性越被架空。"
        },
        {
          "question": "官方的断点参考区间是什么？为什么说「这不意味着开局就按设备铺查询」？",
          "answer": "参考：手机通常 500px 以下、平板 500–1000px、1000px 以上多半是普通浏览器屏、超宽可超过 2000px。但每个项目的设计需求不同，断点只设你需要的——许多基础布局一个 500–600px 左右的移动断点就够；真正的要点是断点具体位置不重要，对项目合理就行。按设备铺查询会把「别人的经验值」当成规范，产出大量用不上的分支。"
        },
        {
          "question": "为什么断点有时「不在预期的位置触发」？",
          "answer": "最常见的元凶是忘了自己缩放过页面：多数浏览器里缩放会改变页面的有效分辨率——放大让页面表现得像更小的屏、按缩放后的分辨率触发媒体查询。调试断点问题先确认缩放是 100%。"
        },
        {
          "question": "@media screen and (…) 里的 screen 是必需的吗？@media print 的典型用途？",
          "answer": "不必需：目前学的样式都面向屏幕，写 screen 是冗余的——但它的存在指向「按媒体类型换样式」的能力。@media print 为打印与打印预览定义单独样式：常见做法是把颜色转黑白、用 display: none 藏起对纸质无用的元素（按钮、导航链接）。"
        }
      ],
      "optional": [],
      "note": "官方正文的两处 CodePen 交互演示（Media Queries 1 / 2）按既有口径不在本站内嵌，等效可敲代码在示例区；想拖窗口看断点切换的实时行为，回官方课页操作即可。容器查询本站按官方口径只做引介，深入用法见 MDN 的 container queries 文档。",
      "why": "媒体查询是响应式三部曲的最后一件工具：上一课把布局做成天然弹性的，这一课处理「弹性到某个点就必须换形态」的时刻——三栏变一栏、导航收进抽屉、字号整体下调。但这一课真正的价值是官方的克制哲学：断点不是越多越好，很多项目一个移动断点就够。加上缩放改变有效分辨率、print 媒体类型两个易忘事实，你对「样式为什么没按预期生效」的排查能力会上一个台阶。",
      "sections": [
        {
          "h": "语法：@media 条件化应用样式",
          "p": [
            "有了媒体查询，就可以按用户屏幕的大小**彻底改变** Web 项目的样式。到目前为止的所有课都在确保布局里的单个元素尽可能灵活，但有时你确实需要**实际改掉**一些 CSS 值来适配特定屏幕尺寸：这些改变可以是细微的调整——改 margin、padding 或 font-size 往屏幕里塞更多内容——也可以是布局上明显的大改。具体改什么取决于你的设计，但底层技术是同一个。",
            "基本语法如下：`body { margin: 24px; }` 之外再写 `@media (max-width: 600px) { body { margin: 8px; } }`——在**小于等于** 600px 的一切屏幕上 margin 是 8px，在大于 600px 的屏幕上是 24px。",
            "真的，就这么点事。单靠这一点知识你就能做出相当复杂的切换布局：一个文档里可以创建**不限数量**的媒体查询，一个媒体查询里也可以放**不限数量**的样式定义。上面的查询用的是 **max-width**——在小于等于指定值的分辨率上生效；也可以定义 **min-width**——在大于等于给定值的分辨率上生效；`max-height` 与 `min-height` 同样合法。"
          ]
        },
        {
          "h": "克制：媒体查询要少写",
          "p": [
            "如前所说，你可以为每一种可能的屏幕尺寸建不限数量的媒体查询。**但是**，最好把媒体查询的用量压到最小、更多依靠布局的天然弹性。",
            "想想官方的第二个内嵌示例（「my cool site」）：它只需要**一个**媒体查询就照顾了所有桌面与移动尺寸，实在没有必要再多建。"
          ]
        },
        {
          "h": "常见断点：参考区间与「按需」原则",
          "p": [
            "「断点」（breakpoint）就是触发媒体查询的屏幕尺寸。关于断点到底该设在哪，你会发现**意见相当纷纭**。一般来说，想一想你的用户会用的设备与屏幕类型是有帮助的：手机通常在 **500px 以下**；平板常在 **500px 到 1000px** 之间；超过 1000px 的多半是普通浏览器窗口；超宽屏也越来越常见——你的站点**可能**被显示在宽过 2000px 的屏幕上！",
            "这**不**意味着你应该在项目开局就为每类设备各写一个媒体查询。每个项目基于你要实现的设计会有不同的需求；如前所述，把断点限制在你**需要**的范围内：许多相对基础的布局，只要一个 **500–600px 左右**的、以移动为中心的断点就能过；更复杂的布局可能受益于做全套——1200px 以上是全尺寸布局、600px 到 1200px 之间是改动过的「平板」布局、600px 以下是移动版。这里真正要带走的是：**断点具体设在哪其实不重要，对你的项目合理就行**。"
          ]
        },
        {
          "h": "缩放会改变有效分辨率",
          "p": [
            "在多数浏览器里，**放大网页会改变该页的有效分辨率**。如果你的浏览器窗口恰好 1000px 宽，放大将使页面的行为仿佛屏幕变**小**了一样——按模拟/缩放后的屏幕分辨率触发媒体查询。",
            "**缩小**则可以用来调试那些出现在比你自己屏幕更大的尺寸上的问题。而忘了自己正在放大或缩小网页，会在断点拒绝于正确位置触发时造成真正的困惑。"
          ]
        },
        {
          "h": "打印样式与容器查询",
          "p": [
            "你常会看到带 **screen** 关键字的媒体查询，比如 `@media screen and (max-width: 480px) {}`。这**不是必需的**——但它确实指向媒体查询的另一个很有用的能力：**按媒体类型换样式**。目前讲的一切都是给「某种屏幕上观看」准备的，所以指定 screen 是冗余；不过，你可以用 **print** 关键字为「发往打印机或在打印预览里查看」的场景创建另一套样式：`@media print { /* 打印样式写在这里 */ }`。",
            "课程不会聚焦于此，但某些场景值得考虑利用：相当常见的做法是改一些颜色（比如转成黑/白）、给在打印环境里没用的元素（按钮、导航链接等）加 `display: none` 藏起来。",
            "**容器查询**：媒体查询允许你按视口或设备等事物的特征条件化地应用样式；**容器查询**（`@container`）做的是同一件事，但条件基于某个**容器元素**的特征。取决于你确切想条件化应用的样式，两者可能各有更合理的场景。语法上当然有细微差异，但概念最终是相同的，文档照例齐全。"
          ]
        }
      ],
      "examples": [
        {
          "lang": "css",
          "code": "/* 基本形态：大于 600px 用 24px，小于等于 600px 改 8px */\nbody { margin: 24px; }\n\n@media (max-width: 600px) {\n  body { margin: 8px; }\n}\n\n/* min-width 方向相反：大于等于 1200px 才生效 */\n@media (min-width: 1200px) {\n  .layout { grid-template-columns: 250px 1fr 250px; }\n}",
          "note": "官方正文代码块与「其他查询」一节的等效呈现。max-width 是「往下兜」、min-width 是「往上加」，一个文档里可以写任意多个查询。"
        },
        {
          "lang": "css",
          "code": "/* 打印样式：纸质场景藏交互件、转黑白 */\n@media print {\n  .site-header button,\n  .nav-links,\n  .companion-fab { display: none; }\n\n  body { color: #000; background: #fff; }\n}",
          "note": "官方 print 一节的等效代码：常见做法就是两类——display: none 藏起对纸面无用的元素（按钮、导航）、颜色转黑白。screen 关键字可写可不写，面向屏幕的样式里它是冗余的。"
        }
      ],
      "pitfalls": [
        {
          "title": "断点不在预期位置触发，先怀疑缩放",
          "text": "多数浏览器里缩放会改变有效分辨率：150% 放大下 1000px 的窗口表现得像更小的屏。调试断点前把缩放回 100%，能省掉一半的「灵异现象」排查。"
        },
        {
          "title": "为每类设备预设断点，开局就铺五个查询",
          "text": "500/768/1024/1200/2000 的「标准断点表」是别人的经验，不是你的需求。官方口径：只设你需要的——基础布局一个移动断点常常就够；每多一个查询就多一份维护成本，而且天然弹性被架空。"
        },
        {
          "title": "把媒体查询当布局工具，而不是最后的微调",
          "text": "正确的顺序是先让 flex/grid 天然弹性地干活，弹性到极限、某个点必须换形态时才动用查询。反过来——用一堆查询硬拼出「伪弹性」——就是官方 Limit media queries 一节要拦的路。"
        }
      ],
      "official": {
        "assignment": [
          "把 MDN 的 Using media queries（使用媒体查询）过一遍——媒体查询还有几手不常用但值得知道的用法"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 advanced_html_css/responsive_design/media_queries.md（本站自行编写简体讲解，未改编自任何第三方中文课程；官方原文无 Knowledge Check 节；正文末段「本站补充」为本站注明的非官方内容）",
        "sha256": "5c3b5b3eae511101638104b25eb2019cda08bd4aab0082f4d8f947319754e13b",
        "verifiedAt": "2026-09-27"
      }
    },
    {
      "id": "node-path-advanced-html-and-css-homepage",
      "title": "Project: Homepage",
      "zh": "项目：个人主页",
      "group": 2,
      "url": "https://www.theodinproject.com/lessons/node-path-advanced-html-and-css-homepage",
      "summary": "HTML/CSS 线的最后一个项目：做一个响应式主页——类似作品集（portfolio）网站上会出现的那种。官方给了完整设计的三种尺寸版本（桌面 / 平板 / 移动），要求对各自视口尽量贴近还原，并确保布局在 320 到 1920 像素宽之间的任何尺寸都不破。字体与颜色可以自选、头图不必用图库照片——重点是实现指定的布局与响应式行为，而不是做出一个完整作品集。四步走：搭文件下载设计图并规划布局 → 收集素材（pexels 图库照片、Google Fonts 的 Playfair Display 与 Roboto、devicon 与 Material Design Icons 的图标）→ 按自己的节奏推进（官方作者的习惯是先摆大块再从上往下填细节；响应式何时怎么做都行，只要 320–1920px 不破——「移动优先」派有道理但最终有效就行）→ 完成后 push 到 GitHub 并用 GitHub Pages 发布。",
      "guide": "以下是官方原课的中文化梳理与本站拆解。这是 World 4 也是整个 HTML/CSS 线的毕业项目——和落地页、管理仪表盘一样按设计稿还原，但第一次把「任何宽度 320–1920px 都不破」写成硬性验收线：前两课的工具（天然弹性、响应式图片、媒体查询）会在这里全部用上，而且用不用得好一拖窗口就知道。本站不提供成品代码：正文给要求中文化、四步拆解与本站自拟的验收清单。三张设计稿的下载链接在「官方任务」第一步里原样转达（statically CDN 地址）。官方 Step 4 的课程反馈表属行政环节，如实转达、不算学习内容。做完记得发布——这是你第一个可以拿去给别人看的响应式页面。",
      "understand": [
        "这是你的**最后一个 HTML/CSS 项目**：创建一个**响应式主页**——类似作品集（portfolio）站点上会看到的那种；将来想分享作品或求职时有个设计良好的作品集很有用，但现阶段先把这些更高级的 HTML/CSS 概念练熟",
        "与落地页、管理仪表盘两个项目同型：按**给定设计稿**构建——官方提供完整设计的**三种尺寸**版本：**桌面、平板、移动**；对各自视口**尽可能贴近还原**，并确保布局在 **320 到 1920 像素宽之间的任何尺寸**都好看",
        "**可自由发挥的边界**：字体与颜色可以自选、头图不必用图库照片——重点在**实现指定的布局与响应式行为**，不是做出一个完整作品集",
        "**素材清单（官方指定来源）**：人像用的是 pexels.com 的图库照片（手头没自己照片就先拿占位图）；设计用了 **Playfair Display** 与 **Roboto** 两款字体（都在 Google Fonts）；GitHub / LinkedIn / X（原 Twitter）的图标链接来自 **devicon.dev**；电话、邮件、外链三个图标是从 **materialdesignicons.com** 下载的 SVG（该站现已迁至 Pictogrammers）",
        "**推进建议（官方 Step 3）**：怎么组织工作随你——过去几课给了很多建议，你多半已经习惯从空白页开始；如果要人指路：本课作者最舒服的方式是**先摆大块**（header、projects、contact 等各就各位，先不管具体样式与内容细节），**再从上往下**回填、上样式、做清理；响应式**何时做、怎么做都不重要**——只要 320–1920px 之间布局不破；有人会说必须从移动端做起再用媒体查询往外扩——「移动优先」派**确实有道理**（自己去搜），但最终**怎么实现不重要，有效就行**",
        "**收尾**：完成后 push 到 GitHub、用 GitHub Pages 发布到全世界——你该为自己完成的东西感到骄傲"
      ],
      "terms": [
        {
          "en": "Portfolio homepage",
          "zh": "作品集主页：展示个人作品与联系方式的门面页——本项目的场景设定；完整作品集留到未来，这一项目练的是它的布局与响应式行为"
        },
        {
          "en": "Design brief（三种尺寸）",
          "zh": "设计任务书：官方给桌面 / 平板 / 移动三张设计稿，各自视口贴近还原；「贴近」不等于像素级复刻——字体颜色可自选"
        },
        {
          "en": "320–1920px 验收线",
          "zh": "本项目的硬性响应式要求：布局在 320 到 1920 像素宽之间的任何视口都不破——呼应导论课的 320px 下限"
        },
        {
          "en": "Mobile-first",
          "zh": "移动优先：先做移动端样式、再用媒体查询向大屏扩展的流派；官方口径——有道理，但怎么实现不重要、有效就行"
        }
      ],
      "tasks": [
        "读官方任务四步与本站拆解：把三张设计稿下载到手，逐张数出大块区域（header / 项目区 / 联系区等），写下你打算用什么布局工具搭每一块（grid？flex？）",
        "收集素材：挑好占位人像（pexels 或任意占位图服务）、定字体（Playfair Display + Roboto 或自选）、下载所需图标（devicon / Material Design Icons）",
        "按「先大块后细节」推进：各区域先就各位（可以丑），再从上往下回填内容与样式；响应式随时做——每完成一块就拖一遍 320–1920px 检查",
        "对照本站验收清单逐项打勾后，push 到 GitHub 并用 GitHub Pages 发布；把发布链接记进你的学习档案"
      ],
      "quiz": [
        {
          "question": "这个项目对响应式的硬性要求是什么？它和本章导论课的哪个数字呼应？",
          "answer": "布局在 320 到 1920 像素宽之间的任何尺寸都不破、且三种尺寸的设计稿在各自视口尽量贴近还原。320px 正是导论课说的「可靠下限」——常见最小手机的宽度；在这里它从知识点变成了验收线。"
        },
        {
          "question": "设计稿要求「尽量贴近还原」，但官方明确给了哪些自由？重点到底在哪？",
          "answer": "字体和颜色可以自选、头图可以不用图库照片。重点是实现指定的布局与响应式行为，而不是做出一个完整作品集——「贴近」针对的是结构与断点行为，不是像素与配色。"
        },
        {
          "question": "官方对「必须移动优先」的说法持什么态度？",
          "answer": "承认它有道理（「移动优先」派确实有好论点，官方还让你自己去搜），但明确说响应式何时做、怎么做都不重要——只要 320 到 1920 之间布局不破，怎么实现都行、有效就行。"
        },
        {
          "question": "官方作者推荐的推进顺序是什么？为什么这个顺序对响应式项目特别合适？",
          "answer": "先把大块摆就位（header、projects、contact 等各就各位，忽略具体样式与内容细节），再从上往下回填、上样式、清理。先定大块等于先定布局骨架——骨架用 grid/flex 做成天然弹性的，之后填内容时响应式行为已经成立，只需在个别断点微调。"
        }
      ],
      "optional": [],
      "note": "本课为 Project 红线课：examples 为空数组，本站不提供成品代码（三尺寸布局、项目卡片流、断点策略、图标与字体接入，全部由你自己写）；正文只提供官方四步要求的中文化、推进顺序拆解与验收清单。三张设计稿为官方 statically CDN 图片链接，按既有口径不收录为学习资料、在官方任务文字里原样转达。官方 Step 4 的课程反馈表（Google 表单）属课程行政环节、不是学习内容，本站在「官方任务」里如实转达。本站自拟验收清单（非官方内容）：① viewport meta 在位；② 320px 无横向溢出、内容可读；③ 三张设计稿在桌面 / 平板 / 移动各自视口贴近还原；④ 320–1920 之间任意宽度拖动无破版（重点检查中间过渡宽度）；⑤ 字体与图标全部加载（无方框字与裂图）；⑥ 图片全部走本课工具（height: auto / object-fit / picture 按需）；⑦ GitHub Pages 发布链接可访问。",
      "why": "这是 HTML/CSS 线的毕业考，也是第一次有明确数字的响应式验收：320–1920px 之间任何宽度都不破。之前的项目各自考一个主题——落地页考排版与盒模型、仪表盘考 Grid 嵌套、注册表单考表单与校验；这个项目把所有工具合在一起，还叠加了本章前三课的全部内容：天然弹性是地基、响应式图片管素材、媒体查询管断点。做完并发布，你就有了一个可以真的发给别人看的响应式页面——这也是「作品集」这个场景的意义：代码好不好，拖一下窗口就知道。",
      "sections": [
        {
          "h": "项目概览：三尺寸设计稿与 320–1920 验收线",
          "p": [
            "这是你的最后一个 HTML/CSS 项目：创建一个**响应式主页**——你在作品集（portfolio）类站点上会看到的那种。当你想开始分享自己的作品或申请职位时，有个设计良好的作品集可以分享会很有用。虽然现在还不做完整作品集——你要先用这些更高级的 HTML 与 CSS 概念练手——但就把这当作练习它们的机会！",
            "和之前的落地页、管理仪表盘两个项目类似，你的任务是构建一份**给定的设计任务书**：官方提供完整设计的**三种不同尺寸**版本——**桌面、平板、移动**。对各自的视口**尽可能贴近地**还原每份设计，并确保你的布局在 **320 到 1920 像素宽之间**的任何屏幕尺寸都好看。",
            "字体和颜色可以随意挑，头图也可以不用图库照片。**主要焦点是实现指定的布局与响应式行为**，而不是做出一个完整的作品集。"
          ]
        },
        {
          "h": "第 1 步：搭架子与规划",
          "p": [
            "建好 HTML 与 CSS 文件、放一些占位内容，先确认所有东西都正确关联。",
            "下载三张**全分辨率设计稿**（桌面 / 平板 / 移动，下载链接在下方「官方任务」里原样转达），对「HTML 文档需要怎么布局」形成大致想法——数一数有几个大块、每块内部是行是列，想好各用什么工具（grid / flex）再动手。"
          ]
        },
        {
          "h": "第 2 步：收集素材",
          "p": [
            "设计稿里的人像是从 **pexels.com** 下载的图库照片；手头没有自己的照片，就先去拿一张占位图。",
            "选字体：设计用的是 **Playfair Display** 和 **Roboto**，两款都在 Google Fonts 上。设计里还有 GitHub、LinkedIn 与 X（原 Twitter）的图标链接——你自己的站当然想加什么链接都行；那些图标来自 **devicon.dev**。其余图标（电话、邮件、外链）是从 **materialdesignicons.com** 下载的 SVG（该站现已迁至 Pictogrammers 名下）。"
          ]
        },
        {
          "h": "第 3 步：推进建议",
          "p": [
            "不出所料，这个项目怎么组织随你便。过去几课给了很多建议，你多半已经能舒服地从一张白纸开始。",
            "如果你喜欢有人告诉你怎么做：本课作者最舒服的方式是**从布局的大块开始**、然后**从页面顶部往下**推进——换句话说，先让各个大区（header、projects、contact 等）大致就位（忽略大量具体样式与内容细节），再回头从上到下地回填、上样式、清理一切。",
            "这个项目的响应式**什么时候做、怎么做都不要紧**——只要你的布局在 320 到 1920 像素宽之间的视口不破就行。会有人告诉你应该永远从移动端体验做起、再用媒体查询教布局怎么往外扩展。「移动优先」派**确实有道理**（去搜搜看！），但说到底，**怎么实现不重要，有效就行**。祝好运！",
            "做完别忘了 push 到 GitHub、用 GitHub Pages 把它发布给全世界——你该为自己完成的东西感到骄傲！"
          ]
        },
        {
          "h": "第 4 步：课程反馈（行政环节）",
          "p": [
            "官方原文的最后一步是请你给 Advanced HTML and CSS 课程提交反馈（Google 表单，链接在下方「官方任务」里如实转达）。这是课程的行政环节、不是学习内容——是否提交完全自愿，不影响本项目完成。"
          ]
        }
      ],
      "examples": [],
      "pitfalls": [
        {
          "title": "只对照三张设计稿的三个宽度，忽略中间过渡宽度",
          "text": "验收线是 320–1920 之间的「任何」尺寸：设计稿只给了三个采样点，760px、1100px 这些中间宽度才是破版高发区。拖动窗口连续扫一遍全程，而不是跳着看三个点。"
        },
        {
          "title": "一上手就抠像素，大块骨架迟迟不定",
          "text": "官方作者的建议是先摆大块再从上往下填：骨架（各区就各位、grid/flex 定好）比颜色间距优先。顺序反了会导致改一处样式牵动全局，响应式行为也无从验证。"
        },
        {
          "title": "把「移动优先」当教条，或把它当耳旁风",
          "text": "官方口径是两头都不站：移动优先确有道理，但怎么实现不重要、有效就行。别为了「派别」重写已经工作的布局，也别完全无视窄屏——验收线只有一个：320–1920 不破。"
        },
        {
          "title": "素材缺位就放着裂图和方框字交差",
          "text": "占位人像、字体、图标都在第 2 步清单里：pexels 或任意占位图服务、Google Fonts 两款字体、devicon 与 Material Design Icons。裂图与回退字体在验收清单第 ⑤ 条会被抓——素材先行，别留到最后。"
        }
      ],
      "official": {
        "assignment": [
          "第一步 · 搭建与规划：① 建好 HTML 与 CSS 文件、放占位内容，确认全部正确关联；② 下载全分辨率设计稿——桌面版（https://cdn.statically.io/gh/TheOdinProject/curriculum/fd6d4d2e2abbac4a3bd183bba6b6eaf1548a1458/advanced_html_css/responsive_design/project_personal_portfolio/imgs/portfolio.png）、平板版（https://cdn.statically.io/gh/TheOdinProject/curriculum/ca8588077887c9b653898537e84b1346967a4f0b/advanced_html_css/responsive_design/project_personal_portfolio/imgs/portfolio%20tablet.png）、移动版（https://cdn.statically.io/gh/TheOdinProject/curriculum/1c8b5c739efd263e8cc48703988b18d6e3afe034/advanced_html_css/responsive-design/project_personal_portfolio/imgs/portfolio%20mobile.png），对 HTML 文档怎么布局形成大致想法。",
          "第二步 · 收集素材：① 设计里的人像是 pexels.com（https://www.pexels.com/）的图库照片，没有自己的照片就先拿占位图；② 选字体——设计用 Playfair Display 与 Roboto，都在 Google Fonts；③ 设计里有 GitHub、LinkedIn 与 X（原 Twitter）的图标链接，自己的站想加什么链接都行，图标来自 devicon（https://devicon.dev/）；④ 其余图标（电话、邮件、外链）是从 Material Design Icons（https://materialdesignicons.com/）下载的 SVG。",
          "第三步 · 推进建议：① 怎么组织工作随你，过去几课已给了很多建议；② 如果要人指路——作者习惯先摆大块（header、projects、contact 等大致就位、忽略样式细节），再从上往下回填、上样式、清理；③ 响应式何时怎么做都行，只要 320–1920px 之间布局不破——「移动优先」派有道理，但最终有效就行；④ 完成后 push 到 GitHub、用 GitHub Pages 发布。",
          "第四步 · 课程反馈：继续往下之前，官方希望你提交对 Advanced HTML and CSS 课程的反馈（Google 表单：https://docs.google.com/forms/d/e/1FAIpQLSdVvT-2TiczhXP9qGfr28Aq6w6wzct0ypDqcpztaocA9bypXw/viewform?usp=sf_link）——行政环节、完全自愿。"
        ],
        "exercise": [],
        "knowledgeCheck": [],
        "optional": []
      },
      "sources": {
        "basedOn": "TOP 官方 advanced_html_css/responsive_design/project_homepage.md（本站自行编写简体讲解，未改编自任何第三方中文课程；官方原文无 Knowledge Check 节；文件名 project_homepage.md 对 slug homepage 为去前缀直译；验收清单与本站拆解为本站自拟内容、已在 note 标明）",
        "sha256": "fc15a8310d5f358d30022d605aaeb7f2dfe8de2149ae05601a0883dd71f03f30",
        "verifiedAt": "2026-09-27"
      }
    }
  ]
};
