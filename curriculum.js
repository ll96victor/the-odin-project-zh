/* The Odin Project 官方 Full Stack JavaScript Path 全路线结构快照（纯数据，零依赖）。
 *
 * 为什么要有这个文件（v4.4 交接 Core F）：用户不应该只看到 Foundations 46 课，
 * 应该知道官方完整路线有多长——从 Foundations 到 Getting Hired 共 8 个 course、
 * 197 课。本文件只存**结构占位**（course / section / lesson 的名称与顺序），
 * 不含任何课程正文：未中文化的内容只显示名称与路线位置，明确「尚未开放中文
 * 内容」，不生成任何进入本站正文的链接，也不计入「本站已完成中文课程」统计。
 *
 * 数据来源与核验（交接 F1/F5）：
 *   snapshotAt     2026-09-11，curl 抓取 theodinproject.com 各 course 页面原文解析；
 *   source         https://www.theodinproject.com/paths/full-stack-javascript
 *                  （Foundations 属独立前置 path：/paths/foundations/courses/foundations）
 *   curriculumRepo https://github.com/TheOdinProject/curriculum （内容仓库，交叉核对用）
 *   核验           Foundations 的 46 个 slug / 英文标题 / 8 个分组 / 5 个 Project
 *                  与本站 catalog.js 逐字一致（tests/curriculum.test.cjs 钉住）。
 *
 * 刷新方法（官方课程结构变化时）：
 *   1. curl 抓取上面 source 里每个 course 页面（8 个 URL）；
 *   2. 解析 section 锚点（<a id="..."><h3>）与 lesson 列表
 *      （data-test-id="lesson-list" 里的 <a href=".../lessons/..."> + <title>Lesson|Project</title>）；
 *   3. 与本文件 diff，人工补新 section 的中文短名（SECTION_ZH 惯例：本站自译导航名）；
 *   4. 更新 snapshotAt 并跑 tests/curriculum.test.cjs。
 *
 * 字段说明：
 *   order          官方路线顺序（1 = Foundations，前置 path；2-8 = FSJS path 内顺序）
 *   lessonsInCatalog  true 仅 Foundations：其 46 课明细复用 catalog.js（两文件不重复存，
 *                  避免两处漂移）；其余 course 的 sections/lessons 就在本文件里
 *   sections[].lessons[]  { slug, title, type }——slug 是官方 URL 末段（纯标识），
 *                  title 保留英文原题，type: lesson | project
 *   available      刻意不存在：本文件里的所有 lesson 都未开放本站中文正文
 */
window.ODIN_CURRICULUM = {
  version: 1,
  snapshotAt: '2026-09-11',
  source: 'https://www.theodinproject.com/paths/full-stack-javascript',
  foundationsUrl: 'https://www.theodinproject.com/paths/foundations/courses/foundations',
  curriculumRepo: 'https://github.com/TheOdinProject/curriculum',
  license: '课程结构为事实数据（名称与顺序）；中文导航短名为本站自译，随本项目内容采用 CC BY-NC-SA 4.0。',
  courses: [
    {
      id: 'foundations',
      order: 1,
      en: 'Foundations',
      zh: 'Foundations 前端基础',
      url: 'https://www.theodinproject.com/paths/foundations/courses/foundations',
      totalLessons: 46,
      lessonsInCatalog: true
    },
    {
      id: 'intermediate-html-and-css',
      order: 2,
      en: 'Intermediate HTML and CSS',
      zh: '中级 HTML 与 CSS',
      url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/intermediate-html-and-css',
      totalLessons: 22,
      sections: [
        {
          id: 'intermediate-html-concepts',
          en: 'Intermediate HTML Concepts',
          zh: '中级 HTML 概念',
          lessons: [
            { slug: 'node-path-intermediate-html-and-css-introduction', title: 'Introduction', type: 'lesson' },
            { slug: 'node-path-intermediate-html-and-css-svg', title: 'SVG', type: 'lesson' },
            { slug: 'node-path-intermediate-html-and-css-tables', title: 'Tables', type: 'lesson' }
          ]
        },
        {
          id: 'intermediate-css-concepts',
          en: 'Intermediate CSS Concepts',
          zh: '中级 CSS 概念',
          lessons: [
            { slug: 'node-path-intermediate-html-and-css-default-styles', title: 'Default Styles', type: 'lesson' },
            { slug: 'node-path-intermediate-html-and-css-css-units', title: 'CSS Units', type: 'lesson' },
            { slug: 'node-path-intermediate-html-and-css-more-text-styles', title: 'More Text Styles', type: 'lesson' },
            { slug: 'node-path-intermediate-html-and-css-more-css-properties', title: 'More CSS Properties', type: 'lesson' },
            { slug: 'node-path-intermediate-html-and-css-advanced-selectors', title: 'Advanced Selectors', type: 'lesson' },
            { slug: 'node-path-intermediate-html-and-css-positioning', title: 'Positioning', type: 'lesson' },
            { slug: 'node-path-intermediate-html-and-css-css-functions', title: 'CSS Functions', type: 'lesson' },
            { slug: 'node-path-intermediate-html-and-css-custom-properties', title: 'Custom Properties', type: 'lesson' },
            { slug: 'node-path-intermediate-html-and-css-browser-compatibility', title: 'Browser Compatibility', type: 'lesson' },
            { slug: 'node-path-intermediate-html-and-css-frameworks-and-preprocessors', title: 'Frameworks and Preprocessors', type: 'lesson' }
          ]
        },
        {
          id: 'forms',
          en: 'Forms',
          zh: '表单',
          lessons: [
            { slug: 'node-path-intermediate-html-and-css-form-basics', title: 'Form Basics', type: 'lesson' },
            { slug: 'node-path-intermediate-html-and-css-form-validation', title: 'Form Validation', type: 'lesson' },
            { slug: 'node-path-intermediate-html-and-css-sign-up-form', title: 'Project: Sign-up Form', type: 'project' }
          ]
        },
        {
          id: 'grid',
          en: 'Grid',
          zh: 'Grid 布局',
          lessons: [
            { slug: 'node-path-intermediate-html-and-css-introduction-to-grid', title: 'Introduction to Grid', type: 'lesson' },
            { slug: 'node-path-intermediate-html-and-css-creating-a-grid', title: 'Creating a Grid', type: 'lesson' },
            { slug: 'node-path-intermediate-html-and-css-positioning-grid-elements', title: 'Positioning Grid Elements', type: 'lesson' },
            { slug: 'node-path-intermediate-html-and-css-advanced-grid-properties', title: 'Advanced Grid Properties', type: 'lesson' },
            { slug: 'node-path-intermediate-html-and-css-using-flexbox-and-grid', title: 'Using Flexbox and Grid', type: 'lesson' },
            { slug: 'node-path-intermediate-html-and-css-admin-dashboard', title: 'Project: Admin Dashboard', type: 'project' }
          ]
        }
      ]
    },
    {
      id: 'javascript',
      order: 3,
      en: 'JavaScript',
      zh: 'JavaScript',
      url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript',
      totalLessons: 41,
      sections: [
        {
          id: 'introduction',
          en: 'Introduction',
          zh: '引言',
          lessons: [
            { slug: 'node-path-javascript-how-this-course-will-work', title: 'How This Course Will Work', type: 'lesson' }
          ]
        },
        {
          id: 'organizing-your-javascript-code',
          en: 'Organizing Your JavaScript Code',
          zh: '组织 JavaScript 代码',
          lessons: [
            { slug: 'node-path-javascript-organizing-code-with-objects', title: 'Organizing Code with Objects', type: 'lesson' },
            { slug: 'node-path-javascript-object-constructors', title: 'Object Constructors', type: 'lesson' },
            { slug: 'node-path-javascript-library', title: 'Project: Library', type: 'project' },
            { slug: 'node-path-javascript-factory-functions-and-the-module-pattern', title: 'Factory Functions and the Module Pattern', type: 'lesson' },
            { slug: 'node-path-javascript-tic-tac-toe', title: 'Project: Tic Tac Toe', type: 'project' },
            { slug: 'node-path-javascript-classes', title: 'Classes', type: 'lesson' },
            { slug: 'javascript-es6-modules', title: 'ES6 Modules', type: 'lesson' },
            { slug: 'node-path-javascript-npm', title: 'npm', type: 'lesson' },
            { slug: 'javascript-webpack', title: 'Webpack', type: 'lesson' },
            { slug: 'node-path-javascript-restaurant-page', title: 'Project: Restaurant Page', type: 'project' },
            { slug: 'node-path-javascript-revisiting-webpack', title: 'Revisiting Webpack', type: 'lesson' },
            { slug: 'node-path-javascript-json', title: 'JSON', type: 'lesson' },
            { slug: 'node-path-javascript-oop-principles', title: 'OOP Principles', type: 'lesson' },
            { slug: 'node-path-javascript-todo-list', title: 'Project: Todo List', type: 'project' }
          ]
        },
        {
          id: 'javascript-in-the-real-world',
          en: 'JavaScript in the Real World',
          zh: '真实世界的 JavaScript',
          lessons: [
            { slug: 'node-path-javascript-linting', title: 'Linting', type: 'lesson' },
            { slug: 'node-path-javascript-form-validation-with-javascript', title: 'Form Validation with JavaScript', type: 'lesson' },
            { slug: 'node-path-javascript-ecmascript', title: 'ECMAScript', type: 'lesson' }
          ]
        },
        {
          id: 'asynchronous-javascript-and-apis',
          en: 'Asynchronous JavaScript and APIs',
          zh: '异步 JavaScript 与 API',
          lessons: [
            { slug: 'node-path-javascript-asynchronous-code', title: 'Asynchronous Code', type: 'lesson' },
            { slug: 'node-path-javascript-working-with-apis', title: 'Working with APIs', type: 'lesson' },
            { slug: 'node-path-javascript-async-and-await', title: 'Async and Await', type: 'lesson' },
            { slug: 'node-path-javascript-weather-app', title: 'Project: Weather App', type: 'project' }
          ]
        },
        {
          id: 'testing-javascript',
          en: 'Testing JavaScript',
          zh: '测试 JavaScript',
          lessons: [
            { slug: 'node-path-javascript-testing-basics', title: 'Testing Basics', type: 'lesson' },
            { slug: 'node-path-javascript-testing-practice', title: 'Project: Testing Practice', type: 'project' },
            { slug: 'node-path-javascript-more-testing', title: 'More Testing', type: 'lesson' }
          ]
        },
        {
          id: 'a-bit-of-computer-science',
          en: 'A Bit of Computer Science',
          zh: '一点计算机科学',
          lessons: [
            { slug: 'javascript-a-very-brief-intro-to-cs', title: 'A Very Brief Intro to CS', type: 'lesson' },
            { slug: 'javascript-recursive-methods', title: 'Recursive Methods', type: 'lesson' },
            { slug: 'javascript-recursion', title: 'Project: Recursion', type: 'project' },
            { slug: 'javascript-time-complexity', title: 'Time Complexity', type: 'lesson' },
            { slug: 'javascript-space-complexity', title: 'Space Complexity', type: 'lesson' },
            { slug: 'javascript-common-data-structures-and-algorithms', title: 'Common Data Structures and Algorithms', type: 'lesson' },
            { slug: 'javascript-linked-lists', title: 'Project: Linked Lists', type: 'project' },
            { slug: 'javascript-hashmap-data-structure', title: 'HashMap Data Structure', type: 'lesson' },
            { slug: 'javascript-hashmap', title: 'Project: HashMap', type: 'project' },
            { slug: 'javascript-binary-search-trees', title: 'Project: Binary Search Trees', type: 'project' },
            { slug: 'javascript-knights-travails', title: 'Project: Knights Travails', type: 'project' }
          ]
        },
        {
          id: 'intermediate-git',
          en: 'Intermediate Git',
          zh: 'Git 进阶',
          lessons: [
            { slug: 'javascript-a-deeper-look-at-git', title: 'A Deeper Look at Git', type: 'lesson' },
            { slug: 'javascript-working-with-remotes', title: 'Working with Remotes', type: 'lesson' },
            { slug: 'javascript-using-git-in-the-real-world', title: 'Using Git in the Real World', type: 'lesson' }
          ]
        },
        {
          id: 'finishing-up-with-javascript',
          en: 'Finishing Up with JavaScript',
          zh: 'JavaScript 收尾',
          lessons: [
            { slug: 'node-path-javascript-battleship', title: 'Project: Battleship', type: 'project' },
            { slug: 'node-path-javascript-conclusion', title: 'Conclusion', type: 'lesson' }
          ]
        }
      ]
    },
    {
      id: 'advanced-html-and-css',
      order: 4,
      en: 'Advanced HTML and CSS',
      zh: '高级 HTML 与 CSS',
      url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/advanced-html-and-css',
      totalLessons: 16,
      sections: [
        {
          id: 'animation',
          en: 'Animation',
          zh: '动画',
          lessons: [
            { slug: 'node-path-advanced-html-and-css-transforms', title: 'Transforms', type: 'lesson' },
            { slug: 'node-path-advanced-html-and-css-transitions', title: 'Transitions', type: 'lesson' },
            { slug: 'node-path-advanced-html-and-css-keyframes', title: 'Keyframes', type: 'lesson' }
          ]
        },
        {
          id: 'accessibility',
          en: 'Accessibility',
          zh: '无障碍',
          lessons: [
            { slug: 'node-path-advanced-html-and-css-introduction-to-web-accessibility', title: 'Introduction to Web Accessibility', type: 'lesson' },
            { slug: 'node-path-advanced-html-and-css-the-web-content-accessibility-guidelines-wcag', title: 'The Web Content Accessibility Guidelines (WCAG)', type: 'lesson' },
            { slug: 'node-path-advanced-html-and-css-semantic-html', title: 'Semantic HTML', type: 'lesson' },
            { slug: 'node-path-advanced-html-and-css-accessible-colors', title: 'Accessible Colors', type: 'lesson' },
            { slug: 'node-path-advanced-html-and-css-keyboard-navigation', title: 'Keyboard Navigation', type: 'lesson' },
            { slug: 'node-path-advanced-html-and-css-meaningful-text', title: 'Meaningful Text', type: 'lesson' },
            { slug: 'node-path-advanced-html-and-css-wai-aria', title: 'WAI-ARIA', type: 'lesson' },
            { slug: 'node-path-advanced-html-and-css-accessibility-auditing', title: 'Accessibility Auditing', type: 'lesson' }
          ]
        },
        {
          id: 'responsive-design',
          en: 'Responsive Design',
          zh: '响应式设计',
          lessons: [
            { slug: 'node-path-advanced-html-and-css-introduction-to-responsive-design', title: 'Introduction to Responsive Design', type: 'lesson' },
            { slug: 'node-path-advanced-html-and-css-natural-responsiveness', title: 'Natural Responsiveness', type: 'lesson' },
            { slug: 'node-path-advanced-html-and-css-responsive-images', title: 'Responsive Images', type: 'lesson' },
            { slug: 'node-path-advanced-html-and-css-media-queries', title: 'Media Queries', type: 'lesson' },
            { slug: 'node-path-advanced-html-and-css-homepage', title: 'Project: Homepage', type: 'project' }
          ]
        }
      ]
    },
    {
      id: 'react',
      order: 5,
      en: 'React',
      zh: 'React',
      url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/react',
      totalLessons: 25,
      sections: [
        {
          id: 'introduction',
          en: 'Introduction',
          zh: '引言',
          lessons: [
            { slug: 'node-path-react-new-how-this-course-will-work', title: 'How This Course Will Work', type: 'lesson' },
            { slug: 'node-path-react-new-introduction-to-react', title: 'Introduction To React', type: 'lesson' },
            { slug: 'node-path-react-new-setting-up-a-react-environment', title: 'Setting Up A React Environment', type: 'lesson' }
          ]
        },
        {
          id: 'getting-started-with-react',
          en: 'Getting Started With React',
          zh: 'React 入门',
          lessons: [
            { slug: 'node-path-react-new-react-components', title: 'React Components', type: 'lesson' },
            { slug: 'node-path-react-new-what-is-jsx', title: 'What Is JSX?', type: 'lesson' },
            { slug: 'node-path-react-new-passing-data-between-components', title: 'Passing Data Between Components', type: 'lesson' },
            { slug: 'node-path-react-new-rendering-techniques', title: 'Rendering Techniques', type: 'lesson' },
            { slug: 'node-path-react-new-keys-in-react', title: 'Keys In React', type: 'lesson' }
          ]
        },
        {
          id: 'states-and-effects',
          en: 'States And Effects',
          zh: '状态与副作用',
          lessons: [
            { slug: 'node-path-react-new-introduction-to-state', title: 'Introduction To State', type: 'lesson' },
            { slug: 'node-path-react-new-more-on-state', title: 'More On State', type: 'lesson' },
            { slug: 'node-path-react-new-cv-application', title: 'Project: CV Application', type: 'project' },
            { slug: 'node-path-react-new-how-to-deal-with-side-effects', title: 'How To Deal With Side Effects', type: 'lesson' },
            { slug: 'node-path-react-new-memory-card', title: 'Project: Memory Card', type: 'project' }
          ]
        },
        {
          id: 'class-components',
          en: 'Class Components',
          zh: '类组件',
          lessons: [
            { slug: 'node-path-react-new-class-based-components', title: 'Class Based Components', type: 'lesson' },
            { slug: 'node-path-react-new-component-lifecycle-methods', title: 'Component Lifecycle Methods', type: 'lesson' }
          ]
        },
        {
          id: 'react-testing',
          en: 'React Testing',
          zh: 'React 测试',
          lessons: [
            { slug: 'node-path-react-new-introduction-to-react-testing', title: 'Introduction To React Testing', type: 'lesson' },
            { slug: 'node-path-react-new-mocking-callbacks-and-components', title: 'Mocking Callbacks And Components', type: 'lesson' }
          ]
        },
        {
          id: 'the-react-ecosystem',
          en: 'The React Ecosystem',
          zh: 'React 生态',
          lessons: [
            { slug: 'node-path-react-new-react-router', title: 'React Router', type: 'lesson' },
            { slug: 'node-path-react-new-fetching-data-in-react', title: 'Fetching Data In React', type: 'lesson' },
            { slug: 'node-path-react-new-styling-react-applications', title: 'Styling React Applications', type: 'lesson' },
            { slug: 'node-path-react-new-shopping-cart', title: 'Project: Shopping Cart', type: 'project' }
          ]
        },
        {
          id: 'more-react-concepts',
          en: 'More React Concepts',
          zh: '更多 React 概念',
          lessons: [
            { slug: 'node-path-react-new-managing-state-with-the-context-api', title: 'Managing State With The Context API', type: 'lesson' },
            { slug: 'node-path-react-new-reducing-state', title: 'Reducing State', type: 'lesson' },
            { slug: 'node-path-react-new-refs-and-memoization', title: 'Refs And Memoization', type: 'lesson' }
          ]
        },
        {
          id: 'conclusion',
          en: 'Conclusion',
          zh: '结语',
          lessons: [
            { slug: 'node-path-react-conclusion', title: 'Conclusion', type: 'lesson' }
          ]
        }
      ]
    },
    {
      id: 'databases',
      order: 6,
      en: 'Databases',
      zh: '数据库',
      url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/databases',
      totalLessons: 3,
      sections: [
        {
          id: 'databases',
          en: 'Databases',
          zh: '数据库',
          lessons: [
            { slug: 'node-path-databases', title: 'Databases', type: 'lesson' },
            { slug: 'node-path-databases-databases-and-sql', title: 'Databases and SQL', type: 'lesson' },
            { slug: 'node-path-databases-sql-zoo', title: 'Project: SQL Zoo', type: 'project' }
          ]
        }
      ]
    },
    {
      id: 'nodejs',
      order: 7,
      en: 'NodeJS',
      zh: 'NodeJS',
      url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs',
      totalLessons: 30,
      sections: [
        {
          id: 'introduction-to-nodejs',
          en: 'Introduction to NodeJS',
          zh: 'NodeJS 入门',
          lessons: [
            { slug: 'nodejs-introduction-to-the-back-end', title: 'Introduction to the Back End', type: 'lesson' },
            { slug: 'nodejs-introduction-what-is-nodejs', title: 'Introduction: What is NodeJS?', type: 'lesson' },
            { slug: 'nodejs-getting-started', title: 'Getting Started', type: 'lesson' },
            { slug: 'nodejs-debugging-node', title: 'Debugging Node', type: 'lesson' },
            { slug: 'nodejs-basic-informational-site', title: 'Project: Basic Informational Site', type: 'project' },
            { slug: 'nodejs-environment-variables', title: 'Environment Variables', type: 'lesson' }
          ]
        },
        {
          id: 'express',
          en: 'Express',
          zh: 'Express',
          lessons: [
            { slug: 'nodejs-introduction-to-frameworks', title: 'Introduction to Frameworks', type: 'lesson' },
            { slug: 'node-path-nodejs-introduction-to-express', title: 'Introduction to Express', type: 'lesson' },
            { slug: 'nodejs-routes', title: 'Routes', type: 'lesson' },
            { slug: 'nodejs-controllers', title: 'Controllers', type: 'lesson' },
            { slug: 'nodejs-views', title: 'Views', type: 'lesson' },
            { slug: 'node-path-nodejs-mini-message-board', title: 'Project: Mini Message Board', type: 'project' },
            { slug: 'node-path-nodejs-deployment', title: 'Deployment', type: 'lesson' },
            { slug: 'nodejs-forms-and-data-handling', title: 'Forms and Data Handling', type: 'lesson' },
            { slug: 'nodejs-installing-postgresql', title: 'Installing PostgreSQL', type: 'lesson' },
            { slug: 'nodejs-using-postgresql', title: 'Using PostgreSQL', type: 'lesson' },
            { slug: 'node-path-nodejs-inventory-application', title: 'Project: Inventory Application', type: 'project' }
          ]
        },
        {
          id: 'authentication',
          en: 'Authentication',
          zh: '身份认证',
          lessons: [
            { slug: 'node-path-nodejs-authentication-basics', title: 'Authentication Basics', type: 'lesson' },
            { slug: 'node-path-nodejs-members-only', title: 'Project: Members Only', type: 'project' }
          ]
        },
        {
          id: 'orms',
          en: 'ORMs',
          zh: 'ORM',
          lessons: [
            { slug: 'nodejs-prisma-orm', title: 'Prisma ORM', type: 'lesson' },
            { slug: 'nodejs-file-uploader', title: 'Project: File Uploader', type: 'project' }
          ]
        },
        {
          id: 'apis',
          en: 'APIs',
          zh: 'API',
          lessons: [
            { slug: 'nodejs-api-basics', title: 'API Basics', type: 'lesson' },
            { slug: 'nodejs-api-security', title: 'API Security', type: 'lesson' },
            { slug: 'node-path-nodejs-blog-api', title: 'Project: Blog API', type: 'project' }
          ]
        },
        {
          id: 'testing-express',
          en: 'Testing Express',
          zh: '测试 Express',
          lessons: [
            { slug: 'nodejs-testing-routes-and-controllers', title: 'Testing Routes and Controllers', type: 'lesson' },
            { slug: 'node-path-nodejs-testing-database-operations', title: 'Testing Database Operations', type: 'lesson' }
          ]
        },
        {
          id: 'full-stack-projects',
          en: 'Full Stack Projects',
          zh: '全栈项目',
          lessons: [
            { slug: 'nodejs-where-s-waldo-a-photo-tagging-app', title: 'Project: Where\'s Waldo (A Photo Tagging App)', type: 'project' },
            { slug: 'nodejs-messaging-app', title: 'Project: Messaging App', type: 'project' }
          ]
        },
        {
          id: 'final-project',
          en: 'FINAL PROJECT',
          zh: '最终项目',
          lessons: [
            { slug: 'node-path-nodejs-odin-book', title: 'Project: Odin-Book', type: 'project' },
            { slug: 'nodejs-conclusion', title: 'Conclusion', type: 'lesson' }
          ]
        }
      ]
    },
    {
      id: 'getting-hired',
      order: 8,
      en: 'Getting Hired',
      zh: '求职之路',
      url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/getting-hired',
      totalLessons: 14,
      sections: [
        {
          id: 'preparing-for-your-job-search',
          en: 'Preparing for Your Job Search',
          zh: '准备求职',
          lessons: [
            { slug: 'node-path-getting-hired-how-this-course-will-work', title: 'How This Course Will Work', type: 'lesson' },
            { slug: 'node-path-getting-hired-professional-networking', title: 'Professional Networking', type: 'lesson' },
            { slug: 'node-path-getting-hired-strategy', title: 'Strategy', type: 'lesson' },
            { slug: 'node-path-getting-hired-it-starts-with-you', title: 'It Starts with YOU', type: 'lesson' },
            { slug: 'node-path-getting-hired-what-companies-want', title: 'What Companies Want', type: 'lesson' },
            { slug: 'node-path-getting-hired-what-you-can-do-to-prepare', title: 'What You Can Do to Prepare', type: 'lesson' },
            { slug: 'node-path-getting-hired-building-your-personal-website', title: 'Project: Building Your Personal Website', type: 'project' }
          ]
        },
        {
          id: 'applying-to-and-interviewing-for-jobs',
          en: 'Applying to and Interviewing for Jobs',
          zh: '投递与面试',
          lessons: [
            { slug: 'node-path-getting-hired-collecting-job-leads', title: 'Collecting Job Leads', type: 'lesson' },
            { slug: 'node-path-getting-hired-qualifying-job-leads', title: 'Qualifying Job Leads', type: 'lesson' },
            { slug: 'node-path-getting-hired-building-your-resume', title: 'Project: Building Your Resume', type: 'project' },
            { slug: 'node-path-getting-hired-applying-for-web-development-jobs', title: 'Applying for Web Development Jobs', type: 'lesson' },
            { slug: 'node-path-getting-hired-preparing-to-interview-and-interviewing', title: 'Preparing to Interview and Interviewing', type: 'lesson' },
            { slug: 'node-path-getting-hired-handling-a-job-offer', title: 'Handling a Job Offer', type: 'lesson' },
            { slug: 'node-path-getting-hired-conclusion', title: 'Conclusion', type: 'lesson' }
          ]
        }
      ]
    }
  ]
};
