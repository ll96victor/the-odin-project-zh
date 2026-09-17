/* 官方 The Odin Project Foundations 的完整 46 课目录（纯数据文件，零依赖）。
 *
 * 为什么要与 lessons.js 分开：lessons.js 装的是本站已经写好中文自足讲解的 19 课，
 * 每课带正文、术语、任务、自测等大量内容；本文件只装“官方 Foundations 一共有哪些课、
 * 顺序是什么、本站开放到哪一课”，用来渲染完整目录与真实总进度。
 * 交接 §6.1 明确要求不要把 20-46 课的课程正文塞进 lessons.js —— 那 27 课本站还没有
 * 中文正文，塞进去只会得到一堆空壳，也会让人误以为已经写完。
 *
 * 字段说明：
 *   order     官方目录里的序号，1-46，连续且不重复
 *   slug      官方课程页 URL 末段，与 lessons.js 的 id 对已开放的 19 课逐字相同
 *   title     官方英文标题，作为次级文字原样保留
 *   zh        简体中文标题。01-19 沿用 lessons.js 已定稿的译名（tests/catalog.test.cjs
 *             会断言两边逐字一致）；20-46 由本站自行编写，尚未有正文。
 *   group     所属官方分组的 id，对应下面的 groups
 *   type      'lesson' 或 'project'；project 在界面上明确标记“项目”
 *   available 本站是否已经开放中文正文。true 的 19 课可以点进去；false 的 27 课
 *             一律灰化显示“暂未开放”，并且不生成任何可进入正文的链接。
 *
 * 注意：本文件的分组是官方 8 个分组，而 lessons.js 的 groups 只列已开放课程涉及的
 * 前 4 个分组，progress.js 的 unit-* 成就按 lessons.js 的分组下标判定。两者刻意不合并：
 * 成就语义是“完成本站已开放的这个单元”，不是“完成官方这个单元”。
 */
window.ODIN_CATALOG = {
  version: 1,
  /* 官方目录的核对日期。官方若调整顺序或增删课程，需要重新核对并更新本文件。 */
  verifiedAt: '2026-09-09',
  courseUrl: 'https://www.theodinproject.com/paths/foundations/courses/foundations',
  /* 官方 Foundations 全部课程数，UI 的总进度分母直接取 lessons.length，
   * 不另写一个常量，避免两处数字打架。 */
  groups: [
    { id: 'introduction', en: 'Introduction', zh: '开始之前', count: 5 },
    { id: 'prerequisites', en: 'Prerequisites', zh: '准备工具', count: 5 },
    { id: 'git-basics', en: 'Git Basics', zh: 'Git 入门', count: 2 },
    { id: 'html-foundations', en: 'HTML Foundations', zh: 'HTML 基础', count: 8 },
    { id: 'css-foundations', en: 'CSS Foundations', zh: 'CSS 基础', count: 5 },
    { id: 'flexbox', en: 'Flexbox', zh: 'Flexbox 布局', count: 5 },
    { id: 'javascript-basics', en: 'JavaScript Basics', zh: 'JavaScript 基础', count: 15 },
    { id: 'conclusion', en: 'Conclusion', zh: '结语与下一步', count: 1 },
  ],
  lessons: [
    { order: 1, slug: 'how-this-course-will-work', title: 'How This Course Will Work', zh: '这套课程怎么学', group: 'introduction', type: 'lesson', available: true },
    { order: 2, slug: 'introduction-to-web-development', title: 'Introduction to Web Development', zh: '认识网页开发', group: 'introduction', type: 'lesson', available: true },
    { order: 3, slug: 'motivation-and-mindset', title: 'Motivation and Mindset', zh: '动力与学习心态', group: 'introduction', type: 'lesson', available: true },
    { order: 4, slug: 'asking-for-help', title: 'Asking For Help', zh: '怎样有效求助', group: 'introduction', type: 'lesson', available: true },
    { order: 5, slug: 'join-the-odin-community', title: 'Join the Odin Community', zh: '加入 Odin 社区', group: 'introduction', type: 'lesson', available: true },
    { order: 6, slug: 'how-does-the-web-work', title: 'How Does the Web Work?', zh: '网页是怎样工作的', group: 'prerequisites', type: 'lesson', available: true },
    { order: 7, slug: 'installations', title: 'Installations', zh: '准备开发环境', group: 'prerequisites', type: 'lesson', available: true },
    { order: 8, slug: 'text-editors', title: 'Text Editors', zh: '使用代码编辑器', group: 'prerequisites', type: 'lesson', available: true },
    { order: 9, slug: 'command-line-basics', title: 'Command Line Basics', zh: '命令行基础', group: 'prerequisites', type: 'lesson', available: true },
    { order: 10, slug: 'setting-up-git', title: 'Setting up Git', zh: '安装与配置 Git', group: 'prerequisites', type: 'lesson', available: true },
    { order: 11, slug: 'introduction-to-git', title: 'Introduction to Git', zh: '认识 Git', group: 'git-basics', type: 'lesson', available: true },
    { order: 12, slug: 'git-basics', title: 'Git Basics', zh: 'Git 基础操作', group: 'git-basics', type: 'lesson', available: true },
    { order: 13, slug: 'introduction-to-html-and-css', title: 'Introduction to HTML and CSS', zh: '认识 HTML 与 CSS', group: 'html-foundations', type: 'lesson', available: true },
    { order: 14, slug: 'elements-and-tags', title: 'Elements and Tags', zh: '元素与标签', group: 'html-foundations', type: 'lesson', available: true },
    { order: 15, slug: 'html-boilerplate', title: 'HTML Boilerplate', zh: 'HTML 基本骨架', group: 'html-foundations', type: 'lesson', available: true },
    { order: 16, slug: 'working-with-text', title: 'Working with Text', zh: '处理网页文字', group: 'html-foundations', type: 'lesson', available: true },
    { order: 17, slug: 'lists', title: 'Lists', zh: '列表', group: 'html-foundations', type: 'lesson', available: true },
    { order: 18, slug: 'links-and-images', title: 'Links and Images', zh: '链接与图片', group: 'html-foundations', type: 'lesson', available: true },
    { order: 19, slug: 'commit-messages', title: 'Commit Messages', zh: '写清楚提交说明', group: 'html-foundations', type: 'lesson', available: true },
    { order: 20, slug: 'recipes', title: 'Project: Recipes', zh: '项目：菜谱网页', group: 'html-foundations', type: 'project', available: false },
    { order: 21, slug: 'intro-to-css', title: 'Intro to CSS', zh: '认识 CSS', group: 'css-foundations', type: 'lesson', available: false },
    { order: 22, slug: 'the-cascade', title: 'The Cascade', zh: 'CSS 层叠规则', group: 'css-foundations', type: 'lesson', available: false },
    { order: 23, slug: 'inspecting-html-and-css', title: 'Inspecting HTML and CSS', zh: '检查 HTML 与 CSS', group: 'css-foundations', type: 'lesson', available: false },
    { order: 24, slug: 'the-box-model', title: 'The Box Model', zh: '盒模型', group: 'css-foundations', type: 'lesson', available: false },
    { order: 25, slug: 'block-and-inline', title: 'Block and Inline', zh: '块级与行内', group: 'css-foundations', type: 'lesson', available: false },
    { order: 26, slug: 'introduction-to-flexbox', title: 'Introduction to Flexbox', zh: '认识 Flexbox', group: 'flexbox', type: 'lesson', available: false },
    { order: 27, slug: 'growing-and-shrinking', title: 'Growing and Shrinking', zh: '放大与缩小', group: 'flexbox', type: 'lesson', available: false },
    { order: 28, slug: 'axes', title: 'Axes', zh: '主轴与交叉轴', group: 'flexbox', type: 'lesson', available: false },
    { order: 29, slug: 'alignment', title: 'Alignment', zh: '对齐方式', group: 'flexbox', type: 'lesson', available: false },
    { order: 30, slug: 'landing-page', title: 'Project: Landing Page', zh: '项目：落地页', group: 'flexbox', type: 'project', available: false },
    { order: 31, slug: 'variables-and-operators', title: 'Variables and Operators', zh: '变量与运算符', group: 'javascript-basics', type: 'lesson', available: false },
    { order: 32, slug: 'installing-node-js', title: 'Installing Node.js', zh: '安装 Node.js', group: 'javascript-basics', type: 'lesson', available: false },
    { order: 33, slug: 'data-types-and-conditionals', title: 'Data Types and Conditionals', zh: '数据类型与条件判断', group: 'javascript-basics', type: 'lesson', available: false },
    { order: 34, slug: 'javascript-developer-tools', title: 'JavaScript Developer Tools', zh: 'JavaScript 开发者工具', group: 'javascript-basics', type: 'lesson', available: false },
    { order: 35, slug: 'function-basics', title: 'Function Basics', zh: '函数基础', group: 'javascript-basics', type: 'lesson', available: false },
    { order: 36, slug: 'problem-solving', title: 'Problem Solving', zh: '解决问题的思路', group: 'javascript-basics', type: 'lesson', available: false },
    { order: 37, slug: 'understanding-errors', title: 'Understanding Errors', zh: '读懂报错信息', group: 'javascript-basics', type: 'lesson', available: false },
    { order: 38, slug: 'rock-paper-scissors', title: 'Project: Rock Paper Scissors', zh: '项目：石头剪刀布', group: 'javascript-basics', type: 'project', available: false },
    { order: 39, slug: 'clean-code', title: 'Clean Code', zh: '整洁代码', group: 'javascript-basics', type: 'lesson', available: false },
    { order: 40, slug: 'loops-and-arrays', title: 'Loops and Arrays', zh: '循环与数组', group: 'javascript-basics', type: 'lesson', available: false },
    { order: 41, slug: 'dom-manipulation-and-events', title: 'DOM Manipulation and Events', zh: '操作 DOM 与处理事件', group: 'javascript-basics', type: 'lesson', available: false },
    { order: 42, slug: 'revisiting-rock-paper-scissors', title: 'Revisiting Rock Paper Scissors', zh: '重做石头剪刀布', group: 'javascript-basics', type: 'lesson', available: false },
    { order: 43, slug: 'etch-a-sketch', title: 'Project: Etch-a-Sketch', zh: '项目：像素画板', group: 'javascript-basics', type: 'project', available: false },
    { order: 44, slug: 'object-basics', title: 'Object Basics', zh: '对象基础', group: 'javascript-basics', type: 'lesson', available: false },
    { order: 45, slug: 'calculator', title: 'Project: Calculator', zh: '项目：计算器', group: 'javascript-basics', type: 'project', available: false },
    { order: 46, slug: 'choose-your-path-forward', title: 'Choose Your Path Forward', zh: '选择接下来的方向', group: 'conclusion', type: 'lesson', available: false },
  ]
};
