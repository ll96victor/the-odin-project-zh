const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const sandbox = { window: {} };
/* 路径课试点批次 3（2026-09-25）：课程数据按 HTML 同序合并加载
 * （lessons.js → courses/*.js → lesson-sources.js）——结构断言对合并后的全量生效，
 * 与线上渲染口径一致（courses/*.js 未来按 World 增加文件时自动纳入）。 */
vm.runInNewContext(fs.readFileSync(path.join(root, 'lessons.js'), 'utf8'), sandbox);
{
  const coursesDir = path.join(root, 'courses');
  fs.readdirSync(coursesDir).filter(f => f.endsWith('.js')).sort().forEach(f => {
    vm.runInNewContext(fs.readFileSync(path.join(coursesDir, f), 'utf8'), sandbox, { filename: 'courses/' + f });
  });
}
vm.runInNewContext(fs.readFileSync(path.join(root, 'lesson-sources.js'), 'utf8'), sandbox);
const data = JSON.parse(JSON.stringify(sandbox.window.ODIN_GUIDE));
const sources = JSON.parse(fs.readFileSync(path.join(root, 'sources.json'), 'utf8'));
const expectedIds = [
  'how-this-course-will-work', 'introduction-to-web-development', 'motivation-and-mindset',
  'asking-for-help', 'join-the-odin-community', 'how-does-the-web-work', 'installations',
  'text-editors', 'command-line-basics', 'setting-up-git', 'introduction-to-git', 'git-basics',
  'introduction-to-html-and-css', 'elements-and-tags', 'html-boilerplate', 'working-with-text',
  'lists', 'links-and-images', 'commit-messages', 'recipes',
  'intro-to-css', 'the-cascade', 'inspecting-html-and-css', 'the-box-model', 'block-and-inline',
  'introduction-to-flexbox', 'growing-and-shrinking', 'axes', 'alignment', 'landing-page',
  'variables-and-operators', 'installing-node-js', 'data-types-and-conditionals',
  'javascript-developer-tools', 'function-basics', 'problem-solving', 'understanding-errors',
  'rock-paper-scissors', 'clean-code', 'loops-and-arrays',
  'dom-manipulation-and-events', 'revisiting-rock-paper-scissors', 'etch-a-sketch', 'object-basics', 'calculator', 'choose-your-path-forward',
  /* 路径课试点批次 3：World 2「中级 HTML 与 CSS」第 1 章节 3 课（正文在
   * courses/intermediate-html-and-css.js，id 原样沿用官方 slug，规划 20260925-1700 §4.5）。
   * v4.11.21 World 2 第二批：第 2 章节「中级 CSS 概念」前 5 课（同文件 group 1）。
 * World 2 第三批（2026-09-26）：同章节后 5 课（该章节 10/10 全开，同文件 group 1）。 */
  'node-path-intermediate-html-and-css-introduction', 'node-path-intermediate-html-and-css-svg', 'node-path-intermediate-html-and-css-tables',
  'node-path-intermediate-html-and-css-default-styles', 'node-path-intermediate-html-and-css-css-units', 'node-path-intermediate-html-and-css-more-text-styles', 'node-path-intermediate-html-and-css-more-css-properties', 'node-path-intermediate-html-and-css-advanced-selectors',
  'node-path-intermediate-html-and-css-positioning', 'node-path-intermediate-html-and-css-css-functions', 'node-path-intermediate-html-and-css-custom-properties', 'node-path-intermediate-html-and-css-browser-compatibility', 'node-path-intermediate-html-and-css-frameworks-and-preprocessors',
  /* World 2 第四批（2026-09-26）：第 3 章节「表单」3 课（同文件 group 2；含 Project: Sign-up Form，
   * 红线课 examples 为空数组）。注意官方文件名与 slug 的两处不同形：form_validations.md（复数）
   * 对应 slug form-validation（单数）、project_sign_up_form.md 对应 slug sign-up-form。 */
  'node-path-intermediate-html-and-css-form-basics', 'node-path-intermediate-html-and-css-form-validation', 'node-path-intermediate-html-and-css-sign-up-form',
  /* World 2 第五批（2026-09-26，v4.11.22，通宵轮批次 3）：第 4 章节「Grid 布局」6 课
   * （同文件 group 3；含 Project: Admin Dashboard，红线课 examples 为空数组）。
   * 官方文件名：5 个知识课均为 slug 的下划线直译；project_admin_dashboard.md 带
   * project_ 前缀对 slug admin-dashboard（不同形第 3 例，前两例见上方第四批注释）。
   * 该章节 6/6 全开，World 2 22/22 收组。 */
  'node-path-intermediate-html-and-css-introduction-to-grid', 'node-path-intermediate-html-and-css-creating-a-grid', 'node-path-intermediate-html-and-css-positioning-grid-elements', 'node-path-intermediate-html-and-css-advanced-grid-properties', 'node-path-intermediate-html-and-css-using-flexbox-and-grid', 'node-path-intermediate-html-and-css-admin-dashboard',
  /* World 3 批次 4 阶段 1（2026-09-26，v4.11.23，通宵轮批次 4）：javascript 课程
   * 「引言」1 课 + 「组织 JavaScript 代码」14 课（正文在 courses/javascript.js，
   * group 0 与 1；含 4 门 Project——library / tic-tac-toe / restaurant-page /
   * todo-list，红线课 examples 为空数组）。官方 slug 与文件名的不同形重点核对项：
   * 本批 15 课里 13 课带 node-path-javascript- 前缀，2 课不带（javascript-es6-modules
   * 与 javascript-webpack，官方 slug 原样沿用）；object_constructors.md 对 slug
   * object-constructors、factory_functions_and_the_module_pattern.md 对 slug
   * factory-functions-and-the-module-pattern 等均为下划线直译。 */
  'node-path-javascript-how-this-course-will-work', 'node-path-javascript-organizing-code-with-objects', 'node-path-javascript-object-constructors', 'node-path-javascript-library', 'node-path-javascript-factory-functions-and-the-module-pattern', 'node-path-javascript-tic-tac-toe', 'node-path-javascript-classes', 'javascript-es6-modules', 'node-path-javascript-npm', 'javascript-webpack', 'node-path-javascript-restaurant-page', 'node-path-javascript-revisiting-webpack', 'node-path-javascript-json', 'node-path-javascript-oop-principles', 'node-path-javascript-todo-list',
  /* 批次 4 阶段 2（2026-09-27，v4.11.24）：真实世界 JS 3 课 + 异步与 API 4 课（courses/javascript.js 内顺序即此） */
  'node-path-javascript-linting', 'node-path-javascript-form-validation-with-javascript', 'node-path-javascript-ecmascript', 'node-path-javascript-asynchronous-code', 'node-path-javascript-working-with-apis', 'node-path-javascript-async-and-await', 'node-path-javascript-weather-app',
  /* World 3 批次 4 阶段 3（2026-09-27，v4.11.25，通宵轮批次 4）：「测试 JavaScript」3 课
   * + 「一点计算机科学」11 课（courses/javascript.js group 4 与 5；含 6 门 Project——
   * testing-practice / recursion / linked-lists / hashmap / binary-search-trees /
   * knights-travails，红线课 examples 为空数组）。slug 与官方文件名的不同形重点核对项：
   * testing 3 课 slug 全带 node-path-javascript- 前缀；CS 11 课 slug **全部不带**前缀
   * （16 个不带前缀 slug 的重点核对对象）；文件名不同形 2 例：hash_map_data_structure.md
   * 对 slug hashmap-data-structure（下划线 vs 连写）、common_data_structures_algorithms.md
   * 对 slug common-data-structures-and-algorithms（文件名少 and）；project_*.md 带前缀对
   * slug 去前缀（testing-practice / recursion / linked-lists / hashmap /
   * binary-search-trees / knights-travails，同类先例第 9–14 例）。 */
  'node-path-javascript-testing-basics', 'node-path-javascript-testing-practice', 'node-path-javascript-more-testing',
  'javascript-a-very-brief-intro-to-cs', 'javascript-recursive-methods', 'javascript-recursion', 'javascript-time-complexity', 'javascript-space-complexity', 'javascript-common-data-structures-and-algorithms', 'javascript-linked-lists', 'javascript-hashmap-data-structure', 'javascript-hashmap', 'javascript-binary-search-trees', 'javascript-knights-travails',
  /* World 3 批次 4 阶段 4（2026-09-27，v4.11.26，通宵轮批次 4 收组）：「Git 进阶」3 课
   * + 「JavaScript 收尾」2 课（courses/javascript.js group 6 与 7）——World 3 全 41 课
   * 就此收组。slug 形态：Git 三课全不带 node-path-javascript- 前缀（官方 URL 即
   * lessons/javascript-a-deeper-look-at-git 形态，16 个不带前缀 slug 的最后 3 个）；
   * 收尾两课带前缀（battleship 为 project_battleship.md 去前缀直译第 15 例；
   * conclusion 为结语课——官方无 Assignment 节，全站第三门 hasAssignment:false）。
   * 官方文件位置实测：Git 三课在仓库顶层 git/intermediate_git/（不在 javascript/
   * 下——阶段 1 实列已预警，GitHub API 实查证实）。 */
  'javascript-a-deeper-look-at-git', 'javascript-working-with-remotes', 'javascript-using-git-in-the-real-world',
  'node-path-javascript-battleship', 'node-path-javascript-conclusion',
  /* World 4 批次 5 阶段 1（2026-09-27，v4.11.27，通宵轮批次 5）：「高级 HTML 与 CSS」
   * 课程「动画」章节 3 课（courses/advanced-html-and-css.js group 0——该课程文件
   * 本批新建，groups 按官方章节顺序写全 3 项）。slug 全带
   * node-path-advanced-html-and-css- 前缀；官方文件在 advanced_html_css/animation/
   * 目录（GitHub API 实列：transforms.md / transitions.md / keyframes.md，文件名
   * 与 slug 同形，本批无不同形）；三课均有 Assignment、无 KC / AR。 */
  'node-path-advanced-html-and-css-transforms', 'node-path-advanced-html-and-css-transitions', 'node-path-advanced-html-and-css-keyframes',
  /* 批次 5 阶段 2（2026-09-27，v4.11.28）：World 4「无障碍」章节 8 课（8/8 全开）。
   * 官方文件在 advanced_html_css/accessibility/ 目录（GitHub API 实列：8 个 .md
   * 文件名与 slug 全同形，含长名 the_web_content_accessibility_guidelines_wcag.md；
   * semantic_html/ 同名配图子目录按既有口径剔除）；8 课 slug 全带
   * node-path-advanced-html-and-css- 前缀；**accessible-colors 官方无 Assignment
   * 节**（全站第四门 hasAssignment:false，conclusion 先例）；8 课均无 KC / AR。 */
  'node-path-advanced-html-and-css-introduction-to-web-accessibility', 'node-path-advanced-html-and-css-the-web-content-accessibility-guidelines-wcag', 'node-path-advanced-html-and-css-semantic-html', 'node-path-advanced-html-and-css-accessible-colors', 'node-path-advanced-html-and-css-keyboard-navigation', 'node-path-advanced-html-and-css-meaningful-text', 'node-path-advanced-html-and-css-wai-aria', 'node-path-advanced-html-and-css-accessibility-auditing',
  /* 批次 5 阶段 3（2026-09-27，v4.11.29，World 4 收组）：「响应式设计」章节 5 课
   * （5/5 全开、World 4 全 16 课收组）。官方文件在 advanced_html_css/
   * responsive_design/ 目录（GitHub API 实列：5 个 .md；project_homepage.md 对
   * slug homepage 为 project_ 前缀去前缀直译第 16 例，其余 4 个文件名与 slug
   * 同形；project_personal_portfolio/ 设计稿子目录与本站无关按口径剔除）；
   * 5 课 slug 全带 node-path-advanced-html-and-css- 前缀；homepage 为 Project
   * 红线课（examples 空数组）；5 课均有 Assignment 节、均无 KC / AR。 */
  'node-path-advanced-html-and-css-introduction-to-responsive-design', 'node-path-advanced-html-and-css-natural-responsiveness', 'node-path-advanced-html-and-css-responsive-images', 'node-path-advanced-html-and-css-media-queries', 'node-path-advanced-html-and-css-homepage',
  /* World 5 批次 6 阶段 1（2026-09-27，v4.11.30，World 5 开篇）：react 课程「引言」3 课 +
   * 「React 入门」5 课（两章各自全开）。官方文件在 react/introduction/ 与
   * react/getting_started_with_react/ 目录（GitHub API 实列：3 + 5 个 .md，8 个文件名
   * 与 slug 去 node-path-react-new- 中缀后全同形；setting_up_a_react_environment/、
   * react_components/、what_is_jsx/ 三个配图子目录按既有口径剔除）；8 课 slug 全带
   * node-path-react-new- 中缀（World 5 slug 形态，仅结语课无 new——阶段 3 涉及）。
   * **react 版 how-this-course-will-work 官方无 Assignment 节**（全站第五门
   * hasAssignment:false，javascript 引言课同口径）；其余 7 课均有 Assignment；
   * 8 课均无 KC / AR。官方线上课页实测恰列 25 课与 curriculum.js 快照一致
   * （仓库另有 react_and_the_backend/ 3 文件未上线，如实记录不处置）。 */
  'node-path-react-new-how-this-course-will-work', 'node-path-react-new-introduction-to-react', 'node-path-react-new-setting-up-a-react-environment', 'node-path-react-new-react-components', 'node-path-react-new-what-is-jsx', 'node-path-react-new-passing-data-between-components', 'node-path-react-new-rendering-techniques', 'node-path-react-new-keys-in-react',
  /* World 5 批次 6 阶段 2（2026-09-28，v4.11.31）：react 课程「状态与副作用」5 课 +
   * 「类组件」2 课（两章各自全开）。官方文件在 react/states_and_effects/（5 个 .md +
   * introduction_to_state/ 与 more_on_state/ 两个配图子目录按既有口径剔除）与
   * react/class_components/（2 个 .md）；project_cv_application.md 与
   * project_memory_card.md 对 slug cv-application / memory-card 为 project_ 前缀
   * 去前缀直译第 17、18 例，其余 5 个文件名与 slug 去 node-path-react-new- 中缀后
   * 全同形。**章节课序以 curriculum.js 快照为准：CV Application 居第 3 位**
   * （introduction-to-state / more-on-state / cv-application /
   * how-to-deal-with-side-effects / memory-card）。7 课均有 Assignment、均无
   * KC / AR；两门 Project 课 examples 空数组红线（全站第 21、22 门 Project）。 */
  'node-path-react-new-introduction-to-state', 'node-path-react-new-more-on-state', 'node-path-react-new-cv-application', 'node-path-react-new-how-to-deal-with-side-effects', 'node-path-react-new-memory-card', 'node-path-react-new-class-based-components', 'node-path-react-new-component-lifecycle-methods',
  /* World 5 批次 6 阶段 3（2026-09-28，v4.11.32，World 5 收组）：react 课程
   * 「React 测试」2 课 +「React 生态」4 课 +「更多 React 概念」3 课 +「结语」1 课
   * （四章各自全开——World 5 全 25 课收组）。官方文件在 react/react_testing/（2 个 .md）、
   * react/the_react_ecosystem/（4 个 .md）、react/more_react_concepts/（3 个 .md +
   * managing_state_with_context_api/ 配图子目录按既有口径剔除）与 react/conclusion/
   * （双路径文件取 conclusion_full_stack_javascript.md——经线上课页 edit 链接核对，
   * conclusion_ruby_on_rails.md 属 Ruby 路径不取用）。**两处文件名与 slug 不同形**：
   * managing_state_with_context_api.md 少一个 the（slug 带 the）；conclusion 课 slug
   * 为 node-path-react-conclusion **无 new 中缀**（阶段 1 预警兑现）。10 课均有
   * Assignment、均无 KC / AR；shopping-cart 为 Project 红线课 examples 空数组
   * （全站第 23 门 Project，project_ 前缀去前缀直译第 19 例）；react 版 conclusion
   * 的 Assignment 唯一条目为课程反馈表单按行政表单口径剔除——hasAssignment 仍为
   * true（与 accessible-colors「官方无 Assignment 节」不同型）。 */
  'node-path-react-new-introduction-to-react-testing', 'node-path-react-new-mocking-callbacks-and-components', 'node-path-react-new-react-router', 'node-path-react-new-fetching-data-in-react', 'node-path-react-new-styling-react-applications', 'node-path-react-new-shopping-cart', 'node-path-react-new-managing-state-with-the-context-api', 'node-path-react-new-reducing-state', 'node-path-react-new-refs-and-memoization', 'node-path-react-conclusion',
  /* 超长轮批次 7 阶段 1（2026-09-28，v4.11.33，World 6 收组）：databases 课程「数据库」章节 3 课（导论 / 数据库与 SQL / SQL Zoo 项目） */
  'node-path-databases', 'node-path-databases-databases-and-sql', 'node-path-databases-sql-zoo',
  /* 超长续轮批次 7 阶段 1（2026-09-28，v4.11.34，World 7 开篇）：nodejs 课程
   * 「NodeJS 入门」6 课 +「Express」11 课（courses/nodejs.js group 0 与 1；含
   * 3 门 Project——basic-informational-site / mini-message-board /
   * inventory-application，全站第 25、26、27 门，红线课 examples 空数组）。
   * 官方文件三处特殊事实（GitHub API 实列 + 17/17 课页 edit 链接实证）：
   * NodeJS 目录为驼峰 nodeJS/；两门共有课住 shared/the_back_end/
   * （introduction_to_the_backend_lesson.md 与 introduction_to_frameworks.md，
   * NodeJS 与 Ruby 路径共用）；routing.md 对 slug nodejs-routes 为文件名
   * 不同形新例。slug 前缀混杂：13 课 nodejs- 前缀 + 4 课 node-path-nodejs-
   * 前缀（introduction-to-express / mini-message-board / deployment /
   * inventory-application），官方 URL 事实原样沿用。7 课官方有 Additional
   * resources 节（what-is-nodejs / getting-started / routes / controllers /
   * views / deployment / forms-and-data-handling）——AR 豁免名单 1 → 8 课；
   * 10 课官方 Assignment 条目 < 3——tasks 豁免表驱动化（「不凑数」先例同型）。 */
  'nodejs-introduction-to-the-back-end', 'nodejs-introduction-what-is-nodejs', 'nodejs-getting-started', 'nodejs-debugging-node', 'nodejs-basic-informational-site', 'nodejs-environment-variables',
  'nodejs-introduction-to-frameworks', 'node-path-nodejs-introduction-to-express', 'nodejs-routes', 'nodejs-controllers', 'nodejs-views', 'node-path-nodejs-mini-message-board', 'node-path-nodejs-deployment', 'nodejs-forms-and-data-handling', 'nodejs-installing-postgresql', 'nodejs-using-postgresql', 'node-path-nodejs-inventory-application',
  /* 超长续轮批次 7 阶段 3（2026-09-29，v4.11.35）World 7 后六章 13 课——收组：
   * 身份认证 2（authentication-basics / members-only）+ ORM 2（prisma-orm /
   * file-uploader）+ API 3（api-basics / api-security / blog-api）+ 测试 Express 2
   * （testing-routes-and-controllers / testing-database-operations）+ 全栈项目 2
   * （wheres-waldo / messaging-app——官方 Markdown 住 react/react_and_the_backend/
   * 跨路径共用课）+ 最终项目 2（odin-book / conclusion）。slug 前缀混杂 5 门带
   * node-path-nodejs-（authentication-basics / members-only / blog-api /
   * testing-database-operations / odin-book）。 */
  'node-path-nodejs-authentication-basics', 'node-path-nodejs-members-only', 'nodejs-prisma-orm', 'nodejs-file-uploader', 'nodejs-api-basics', 'nodejs-api-security', 'node-path-nodejs-blog-api', 'nodejs-testing-routes-and-controllers', 'node-path-nodejs-testing-database-operations', 'nodejs-where-s-waldo-a-photo-tagging-app', 'nodejs-messaging-app', 'node-path-nodejs-odin-book', 'nodejs-conclusion',
  /* 超长续轮批次 7 阶段 4（2026-09-29，v4.11.36）World 8 求职 14 课——全站收官：
   * 「准备求职」7 课（how-this-course-will-work / professional-networking / strategy /
   * it-starts-with-you / what-companies-want / what-you-can-do-to-prepare /
   * building-your-personal-website[Project]）+「投递与面试」7 课（collecting-job-leads /
   * qualifying-job-leads / building-your-resume[Project] / applying-for-web-development-jobs /
   * preparing-to-interview-and-interviewing / handling-a-job-offer / conclusion）。
   * 14 课 slug 全带 node-path-getting-hired- 前缀、无混杂（与 World 7 前缀混杂形态不同）；
   * 官方文件名不同形 7 处（it-starts-with-you↔starts_with_you /
   * building-your-personal-website↔project_portfolio / collecting-job-leads↔collect_leads /
   * qualifying-job-leads↔qualify_leads / building-your-resume↔project_resume /
   * applying-for-web-development-jobs↔applying / handling-a-job-offer↔handling_an_offer，
   * 全部课页 edit 链接实证）。2 课官方有 Additional resources 节（professional-networking /
   * strategy）——AR 豁免名单 12 → 14 课；5 课官方无 Assignment 节（htcww / starts-with-you /
   * resume / interview / conclusion——全站第六至第十门 hasAssignment:false）；三门零资料课
   * （htcww / starts-with-you / conclusion——conclusion 的 Discord 邀请与反馈表单按既有
   * 口径剔除后零条目）。两门 Project（全站第 34、35 门）examples 空数组红线。 */
  'node-path-getting-hired-how-this-course-will-work', 'node-path-getting-hired-professional-networking', 'node-path-getting-hired-strategy',
  'node-path-getting-hired-it-starts-with-you', 'node-path-getting-hired-what-companies-want', 'node-path-getting-hired-what-you-can-do-to-prepare', 'node-path-getting-hired-building-your-personal-website',
  'node-path-getting-hired-collecting-job-leads', 'node-path-getting-hired-qualifying-job-leads', 'node-path-getting-hired-building-your-resume', 'node-path-getting-hired-applying-for-web-development-jobs',
  'node-path-getting-hired-preparing-to-interview-and-interviewing', 'node-path-getting-hired-handling-a-job-offer', 'node-path-getting-hired-conclusion'
];
assert.deepEqual(data.lessons.map(l => l.id), expectedIds, '包含官方全部 197 课（Foundations 46 课全开 + World 2 四个章节 22 课 + World 3 javascript 课程全八章 41 课——收组 + World 4「动画」「无障碍」「响应式设计」三章节 16 课——收组 + World 5 react 课程「引言」「React 入门」「状态与副作用」「类组件」「React 测试」「React 生态」「更多 React 概念」「结语」八章节 25 课——收组 + World 6 databases 课程「数据库」章节 3 课——收组 + World 7 nodejs 课程「NodeJS 入门」「Express」「身份认证」「ORM」「API」「测试 Express」「全栈项目」「最终项目」全八章节 30 课——收组 + World 8 getting-hired 课程「准备求职」「投递与面试」两章节 14 课——收组，全站 197 课全部开放），顺序一致');
assert.deepEqual(data.lessons.map(l => l.title), sources.lessons.map(l => l.title), '英文名称与官方记录一致');
assert.deepEqual(data.lessons.map(l => l.url), sources.lessons.map(l => l.url), '每课来源 URL 一致');
assert.deepEqual(data.groups.map(g => g.en).slice(0, 8), ['Introduction', 'Prerequisites', 'Git Basics', 'HTML Foundations', 'CSS Foundations', 'Flexbox', 'JavaScript Basics', 'Conclusion'],
  'Foundations 八分组下标 0–7 保持原位（路径课分组从下标 8 追加）');
assert.equal(data.verifiedAt, sources.verifiedAt);
/* v4.11.17：官方 2026-09-23 的 PR #31412 把全部课程的课末自查题一节整体移除
 * （216 文件 +190/-2309，只删不补；官方 LAYOUT_STYLE_GUIDE 已无该节且无替代节），
 * 本站全面跟随上游，把已开放课程里的官方自查题一并下线。因此 v4.11.16 的
 * 「按课型分支」不再存在，本文件改为**统一的反向钉子**：全部课程都必须为零，
 * 而不是恰好为空——任何人往任意一课塞回一道自查题、或在任务文案里写回该节名称，
 * 这里先红。反向验证（交付前实跑）：给任意一课塞回一条自查题 → 本文件与
 * lesson-reader-fixes.test.cjs 必须变红。
 * 节名只在这一个常量里出现一次，供下面的反向断言使用；改这里等于改被钉的字符串。 */
const KC_SECTION_NAME = 'Knowledge Check';
/* hasAdditionalResources 豁免名单（Set 表驱动——超长续轮批次 7 阶段 1 由单课
 * 特判迁移：World 7 nodejs 课程 7 课官方带「Additional resources」节，逐课
 * if/else 特判会膨胀成 8 分支，改 Set 后断言语义不变：名单内必须 true、
 * 名单外必须 false，任何漂移都红）：
 * - javascript-hashmap-data-structure（World 3 批次 4 阶段 3）：全站首例——
 *   官方明言该节「isn't required, so consider it supplemental」，三条资料按
 *   optional 登记（质数 31 讨论 / 鸽笼原理 / samwho.dev Hashing）；
 * - World 7 批次 7 续轮阶段 1（2026-09-28）新增 7 课：nodejs 课程的
 *   what-is-nodejs（teamtreehouse 7 awesome things）/ getting-started
 *   （Net Ninja 12 集播放列表）/ routes（Express Routes 视频）/ controllers
 *   （Using Express Middleware 文档）/ views（LogRocket EJS 文）/ deployment
 *   （free-for.dev）/ forms-and-data-handling（Web Dev Simplified 视频 +
 *   自定义校验器文档）——该节资料全部按 optional 登记。 */
const AR_LESSONS = new Set(['javascript-hashmap-data-structure',
  'nodejs-introduction-what-is-nodejs', 'nodejs-getting-started', 'nodejs-routes',
  'nodejs-controllers', 'nodejs-views', 'node-path-nodejs-deployment',
  'nodejs-forms-and-data-handling',
  /* 超长续轮批次 7 阶段 3（v4.11.35）World 7 后六章新增 4 课官方有 Additional
   * resources 节：authentication-basics（密码存储视频 + 加密哈希维基）/ prisma-orm
   * （Traversy Prisma 速成）/ api-basics（简单英语维基 REST）/ api-security
   * （laptrinhx 存档 JWT 指南 + Medium stateless auth + 反方 JWT 视频）。
   * conclusion 的「Other resources」节不计入 AR 口径（javascript/react 版结语课同型，
   * hasAdditionalResources 为 false）。 */
  'node-path-nodejs-authentication-basics', 'nodejs-prisma-orm',
  'nodejs-api-basics', 'nodejs-api-security',
  /* 超长续轮批次 7 阶段 4（v4.11.36，World 8 收组、全站收官）新增 2 课官方有
   * Additional resources 节：professional-networking（YouTube LinkedIn 视频 +
   * arc.dev 远程人脉指南 + firstrubyfriend 导师制）/ strategy（InformationWeek +
   * 签证指南 + Robert Heaton 硅谷求职复盘）/ what-you-can-do-to-prepare
   * （AR 节存在但官方写明「暂无附加资源」——占位节零条目；收尾 check_links
   * 抓到官方页 additional-resources 锚点在位，暴露「按无实质资源登记 false」与
   * 页面锚点断言的口径矛盾，本轮按机制语义「官方有该节即 true」订正入名单，
   * sources.json 与 method 段同步——全站首个 AR 占位节课）。其余 11 课无 AR 节。 */
  'node-path-getting-hired-professional-networking',
  'node-path-getting-hired-strategy',
  'node-path-getting-hired-what-you-can-do-to-prepare']);
for (const [i, lesson] of data.lessons.entries()) {
  for (const key of ['id', 'zh', 'title', 'summary', 'guide', 'url']) assert.ok(lesson[key].trim(), `${lesson.id}: ${key}`);
  /* v4.11.16 加固：分组下标不再硬编码边界三元式（i<5?0:…，扩到第 21 课
   * css-foundations 时会静默出错），改为按 data.groups 推导——下标必须合法
   * 且随课序不回退（官方分组是连续段）；与 catalog 的逐课分组归属一致性
   * 由 catalog.test.cjs 第 6 节双向钉住。 */
  assert.ok(Number.isInteger(lesson.group) && lesson.group >= 0 && lesson.group < data.groups.length,
    `${lesson.id}: group 下标 ${lesson.group} 必须在 data.groups 范围内`);
  if (i > 0) assert.ok(lesson.group >= data.lessons[i - 1].group, `${lesson.id}: 分组下标不得回退（官方分组连续）`);
  assert.ok(lesson.understand.length >= 3);
  /* tasks 条数豁免表（表驱动——超长续轮批次 7 阶段 1 由单课特判迁移：World 7
   * nodejs 课程官方 Assignment「少而精」，8 课官方条目 < 3，逐课 if 特判会膨胀
   * 成 8 分支；表内钉的是**准确条数**（不是下限放宽），任何漂移都红）：
   * - node-path-intermediate-html-and-css-introduction（路径课试点批次 3 首例，
   *   先例：choose-your-path-forward 的 hasAssignment 特判）：官方 Assignment
   *   只有 2 条浏览任务（通读元素参考 + 瞄一眼速查表），本站 tasks 忠实翻译
   *   官方 2 条，不凑数加第三条；
   * - World 7 批次 7 续轮阶段 1（2026-09-28）新增 7 课，全部为官方 Assignment
   *   原始条目数（tasks 忠实翻译不凑数、不拆分——官方若增加任务，先复核原文
   *   再迁移此表）：debugging-node 2（视频 + 文档）/ environment-variables 1
   *   （Node 官方环境变量文档）/ introduction-to-frameworks 2（Dev.to + MDN）/
   *   introduction-to-express 2（摸文档 + 重写旧项目）/ routes 1（Routing
   *   primer）/ controllers 2（Medium 文 + MVC 视频）/ installing-postgresql 1
   *   （按系统选安装指南，条目内含 Linux 与 macOS 双链接）。
   * 同批 3 课按官方结构忠实拆分后达标不需豁免：deployment 3（官方 1 大项 +
   * 2 官方子项）/ forms-and-data-handling 5（官方任务二自带 4 个编号步骤）/
   * basic-informational-site 3（官方 2 条 + Introduction 的「卡住回起步课」
   * 官方指引）。 */
  const TASK_COUNT_EXEMPT = {
    'node-path-intermediate-html-and-css-introduction': 2,
    'nodejs-debugging-node': 2,
    'nodejs-environment-variables': 1,
    'nodejs-introduction-to-frameworks': 2,
    'node-path-nodejs-introduction-to-express': 2,
    'nodejs-routes': 1,
    'nodejs-controllers': 2,
    'nodejs-installing-postgresql': 1,
    /* 超长续轮批次 7 阶段 3（2026-09-29，v4.11.35）World 7 后六章新增 7 课官方
     * Assignment 条目 < 3（tasks 忠实翻译不凑数、不拆分；官方若增加任务先复核原文
     * 再迁移此表）：authentication-basics 2（视频列表 + Hidden Manual）/ prisma-orm 2
     * （Quickstart + 九篇文档）/ api-basics 2（RESTful 设计 + robinwieruch 教程）/
     * api-security 2（两个 JWT 视频）/ testing-routes-and-controllers 2（SuperTest +
     * SuperAgent 文档）/ testing-database-operations 1（pg tests 目录）/ conclusion 2
     * （Express 缓存文档 + Discord）。同批 6 课按官方结构达标不需豁免：members-only 10 /
     * file-uploader 7 / blog-api 9 / wheres-waldo 7 / messaging-app 4 / odin-book 11。 */
    'node-path-nodejs-authentication-basics': 2,
    'nodejs-prisma-orm': 2,
    'nodejs-api-basics': 2,
    'nodejs-api-security': 2,
    'nodejs-testing-routes-and-controllers': 2,
    'node-path-nodejs-testing-database-operations': 1,
    'nodejs-conclusion': 2,
    /* 超长续轮批次 7 阶段 4（2026-09-29，v4.11.36）World 8 求职 14 课中 12 课官方
     * Assignment 条目 < 3（tasks 忠实翻译不凑数、不拆分；官方若增加任务先复核原文
     * 再迁移此表）：htcww 0（官方无 Assignment 节，导论课）/ networking 2（线下机会
     * 盘点 + 虚拟平台选定，两条大条目各带子弹列表）/ strategy 1（Happy Bear 存档文）/
     * starts-with-you 0（官方无 Assignment 节，自评课）/ companies-want 2（招聘方视角
     * 五篇 + 实习两条）/ collect 1（九招聘板清单）/ qualify 1（Hire Beware）/
     * resume 1（Project 本体任务——官方无 Assignment 节，4 工具链接住正文）/
     * applying 1（The Muse 侧门文）/ interview 0（官方无 Assignment 节，30 链接全住
     * 正文七小节）/ handling 2（谈判十规则 + 股权存档文）/ conclusion 0（官方无
     * Assignment 节，结语祝贺信）。同批 2 课达标不需豁免：prepare 4（转型文 +
     * GitHub 三篇 + 品牌四篇 + 书籍摘要）/ portfolio 3（Project 本体 + Forbes +
     * Write the Docs）。 */
    'node-path-getting-hired-how-this-course-will-work': 0,
    'node-path-getting-hired-professional-networking': 2,
    'node-path-getting-hired-strategy': 1,
    'node-path-getting-hired-it-starts-with-you': 0,
    'node-path-getting-hired-what-companies-want': 2,
    'node-path-getting-hired-collecting-job-leads': 1,
    'node-path-getting-hired-qualifying-job-leads': 1,
    'node-path-getting-hired-building-your-resume': 1,
    'node-path-getting-hired-applying-for-web-development-jobs': 1,
    'node-path-getting-hired-preparing-to-interview-and-interviewing': 0,
    'node-path-getting-hired-handling-a-job-offer': 2,
    'node-path-getting-hired-conclusion': 0,
  };
  if (TASK_COUNT_EXEMPT[lesson.id] !== undefined) {
    assert.equal(lesson.tasks.length, TASK_COUNT_EXEMPT[lesson.id], `${lesson.id}: 官方 Assignment 原始条目数（不凑数；官方若增加任务，先复核原文再迁移此表）`);
  } else {
    assert.ok(lesson.tasks.length >= 3);
  }
  /* 同上（纯导读课豁免）：World 2 导读课官方无术语表，本站自拟 2 条站得住的
   * 术语——数量豁免但结构断言（每条 en/zh 完整）不放宽。 */
  if (lesson.id === 'node-path-intermediate-html-and-css-introduction') {
    assert.equal(lesson.terms.length, 2, `${lesson.id}: 纯导读课官方无术语表，本站自拟 2 条（官方若出现术语节，先复核再迁移）`);
    assert.ok(lesson.terms.every(t => t.en && t.zh));
  } else {
    assert.ok(lesson.terms.length >= 3 && lesson.terms.every(t => t.en && t.zh));
  }
  assert.ok(lesson.quiz.length >= 3 && lesson.quiz.length <= 5);
  assert.ok(lesson.quiz.every(q => q.question && q.answer));
  assert.ok(!lesson.tasks.some(t => t.includes(KC_SECTION_NAME)),
    `${lesson.id}: 官方已下线该节，任务文案不得再出现「${KC_SECTION_NAME}」（发现即说明有人把已删除的课节写回来了）`);
  /* 无 Assignment 课的豁免名单（sources.json 的 hasAssignment 必须为 false）：
   * choose-your-path-forward（结语课，官方文件顶部声明结构豁免）、
   * node-path-javascript-how-this-course-will-work（World 3 批次 4：官方
   * how_this_course_will_work.md 无 Assignment 节，同一口径）与
   * node-path-javascript-conclusion（World 3 批次 4 阶段 4：官方 conclusion.md
   * 为 javascript 课程结语祝贺信、无 Assignment 节，全站第三门，同一口径）与
   * node-path-advanced-html-and-css-accessible-colors（World 4 批次 5 阶段 2：
   * 官方 accessible_colors.md 无 Assignment 节，全站第四门，同一口径）与
   * node-path-react-new-how-this-course-will-work（World 5 批次 6 阶段 1：
   * 官方 react 版 how_this_course_will_work.md 无 Assignment 节，全站第五门，
   * 与 javascript 课程同名引言课同一口径）。
   * 若官方给任何一课补了 Assignment 节，先复核原文再迁移对应断言。 */
  if (lesson.id === 'choose-your-path-forward' || lesson.id === 'node-path-javascript-how-this-course-will-work' || lesson.id === 'node-path-javascript-conclusion' || lesson.id === 'node-path-advanced-html-and-css-accessible-colors' || lesson.id === 'node-path-react-new-how-this-course-will-work' || lesson.id === 'node-path-getting-hired-how-this-course-will-work' || lesson.id === 'node-path-getting-hired-it-starts-with-you' || lesson.id === 'node-path-getting-hired-building-your-resume' || lesson.id === 'node-path-getting-hired-preparing-to-interview-and-interviewing' || lesson.id === 'node-path-getting-hired-conclusion') {
    assert.equal(sources.lessons[i].hasAssignment, false, `${lesson.id}: 官方无 Assignment（结构豁免）`);
  } else {
    assert.ok(sources.lessons[i].hasAssignment, `${lesson.id}: 官方有 Assignment`);
  }
  assert.equal(sources.lessons[i].hasKnowledgeCheck, false,
    `${lesson.id}: hasKnowledgeCheck 必须为 false（官方 2026-09-23 已移除该节；官方若恢复，先复核原文再迁移）`);
  /* hasAdditionalResources 断言（Set 表驱动，名单定义见循环前 AR_LESSONS 注释） */
  if (AR_LESSONS.has(lesson.id)) {
    assert.equal(sources.lessons[i].hasAdditionalResources, true, `${lesson.id}: 官方有 Additional resources 节（豁免名单在册）`);
  } else {
    assert.equal(sources.lessons[i].hasAdditionalResources, false, `${lesson.id}: 官方无 Additional resources 节（若官方新增该节，先复核原文再进 AR_LESSONS 名单）`);
  }
  /* 路径课试点批次 3：URL 前缀按课程分层——Foundations 课页是 foundations- 前缀。
   * World 3 批次 4 迁移：路径课不再断言 node-path- 前缀——javascript 课程有 16 个
   * 官方 slug 不带 node-path-javascript- 前缀（本批含 javascript-es6-modules 与
   * javascript-webpack 两课），前缀不是不变量；真正的不变量是「URL 末段与课 id
   * 逐字一致」（官方 slug 原样沿用），改按它断言。分层判断以 sources.json 的
   * course 字段为准（路径课条目带 course，Foundations 条目不带）。 */
  if (sources.lessons[i].course) {
    assert.match(lesson.url, /^https:\/\/www\.theodinproject\.com\/lessons\/[a-z0-9-]+$/, `${lesson.id}: 路径课 URL 形态`);
    assert.equal(lesson.url, `https://www.theodinproject.com/lessons/${lesson.id}`, `${lesson.id}: 路径课 URL 末段与 id 逐字一致`);
  } else {
    assert.match(lesson.url, /^https:\/\/www\.theodinproject\.com\/lessons\/foundations-[a-z-]+$/);
  }
}
// 高遗漏风险任务：不是只查字段存在，而是保护官方的具体实践与可选边界。
const full = id => JSON.stringify(data.lessons.find(l => l.id === id));
for (const [id, fragments] of Object.entries({
  'motivation-and-mindset': ['AI', 'Success Stories', '第 5 课'],
  'join-the-odin-community': ['GitHub', 'Discord', 'rules', 'faq', 'Optional'],
  'text-editors': ['Disable AI Features', '不必跟写'],
  'command-line-basics': ['Download files', 'Introducing the Shell', 'Navigating Files and Directories', 'Working With Files and Directories', '第一组', '第二组', 'test.txt', '删除'],
  'setting-up-git': ['.DS_Store', '指纹', '.pub', '2FA'],
  'introduction-to-git': ['1.1–1.4', 'Where do I start?', 'contributors'],
  'git-basics': ['git_test', 'Add README', 'SSH', 'hello_world.txt', '推送', '提交编辑器'],
  'html-boilerplate': ['跟做', 'validator'],
  'working-with-text': ['博客文章页', '粗体', '斜体'],
  'lists': ['食物', '待办', '想去', '五个电子游戏或电影'],
  'links-and-images': ['Preparation', 'dog.jpg', 'alt', 'width', 'height', '三个视频', '阅读并跟做', '四种图片格式'],
  'commit-messages': ['72', '50', 'seven rules', '没有要求另做'],
  /* v4.11.16 Project 课的高遗漏风险点：仓库名 / 外部灵感站 / 不提供成品代码的边界声明 /
   * GitHub Pages 可选项——漏掉任何一条都意味着项目要求或红线边界被删改。
   * v4.11.19 第三批新增课 30 的同族要点。 */
  'recipes': ['odin-recipes', 'Allrecipes', '不提供成品代码', 'GitHub Pages', 'Iteration'],
  'landing-page': ['不提供成品代码', 'GitHub Pages', '设计图', '一次只做一个区块', '像素级'],
  /* v4.11.20 第三批新增课 38 的同族要点：六步结构 / 两个官方 Hint 的边界词 /
   * 数学与输入两个 MDN 落点 / 不做 GUI / 不需要数组。 */
  'rock-paper-scissors': ['不提供成品代码', 'Hello World', 'Math.random', 'prompt', '大小写不敏感', '五轮', '数组不是必需的', 'commit early'],
  /* v4.11.20 第六批新增课 43 的同族要点：四步主线 / Flexbox 专属（官方明令不碰
   * CSS Grid）/ 悬停事件边界词 / prompt 上限 100 / Extra credit 两项。 */
  'etch-a-sketch': ['不提供成品代码', '16×16', 'Flexbox', 'CSS Grid', 'mouseenter', 'prompt', '100', '960px', 'Extra credit', 'opacity', 'commit early'],
  /* v4.11.20 第八批新增课 45 的同族要点：四运算函数 / operate 调度 / eval 禁令 /
   * 单对运算链的 12+7-1 演示 / 连续运算符只认最后一个 / 除以 0 不崩 / Extra credit 三项。 */
  'calculator': ['不提供成品代码', 'eval', 'new Function', 'add', 'subtract', 'multiply', 'divide', 'operate', 'clear', '12 + 7', '19 - 1', '除以 0', 'Extra credit', '键盘', '小数点', 'backspace', 'commit early'],
  /* 路径课试点批次 3 新增课的同族要点：
   * 导读课——两个浏览任务的「不要求记住」边界 + 课程范围声明（动画/无障碍/响应式在后面）；
   * SVG——公式 vs 像素的本质 + viewBox 三职责 + 链接/内联取舍 + 官方「读到动画一节就停」；
   * tables——code along 官方原话 + 行星数据评估 + 不拿表格做布局。 */
  'node-path-intermediate-html-and-css-introduction': ['不要求记住', '混个眼熟', '表单', '表格', 'Grid', '高级 HTML 与 CSS', '作品集'],
  'node-path-intermediate-html-and-css-svg': ['公式', '像素网格', 'XML', '人类可读', '互操作', 'xmlns', 'viewBox', '宽高比', '链接', '内联', '缓存', '动画一节就停', '图标库', 'Material'],
  'node-path-intermediate-html-and-css-tables': ['两维', 'code along', '行星', 'rowspan', 'colspan', 'thead', '页面布局', '跟做'],
  /* v4.11.21 World 2 第二批（中级 CSS 概念前 5 课）新增课的同族要点：
   * default-styles——user-agent 来源 + 浏览器差异 + 覆盖优先级 + reset 是观点不是标准；
   * css-units——px 唯一绝对 + rem 优先经验法则 + em 漂移陷阱 + vh/vw 定义 + 尊重用户字号 + 别背单位表；
   * more-text-styles——字体栈机制 + fallback 必配 + GDPR 裁定 + @font-face + em/font-style 分工 + 省略号三件套；
   * more-css-properties——background 8 合 1 + 子属性可单写 + Formal Syntax 别被吓退 + 阴影克制口径 + border-radius 花式少用；
   * advanced-selectors——四族命中范围 + 双冒号现行标准 + 两串特异性数字 + 组合器不加分 + 属性部分匹配三式。 */
  'node-path-intermediate-html-and-css-default-styles': ['user-agent', '略有差异', '优先级高于', '干净的画布', 'opinionated', '不是必需品', '自己决定'],
  'node-path-intermediate-html-and-css-css-units': ['唯一应该使用的绝对单位', '打印', '根元素', '父元素', '优先 `rem`', '视口高度的 1%', '尊重', '需要的时候再查', '50%'],
  'node-path-intermediate-html-and-css-more-text-styles': ['system-ui', 'fallback', 'GDPR', '自己托管', '@font-face', '性能问题', '语义', 'white-space: nowrap', 'text-overflow', '省着用'],
  'node-path-intermediate-html-and-css-more-css-properties': ['8 个', '简写', '单独使用', 'Formal Syntax', '很少有用', '省着用', '微妙', '滚动条', '不需要背'],
  'node-path-intermediate-html-and-css-advanced-selectors': ['直接子级', '紧邻', '向后看', '单冒号', '双冒号', '0, 0, 1, 0', '0, 0, 0, 1', ':root', 'nth-child', 'content', '不加分', '正则', 'practice makes perfect'],
  /* World 2 第三批（2026-09-26，「中级 CSS 概念」后 5 课）新增课的同族要点：
   * positioning——五种模式的参照物与是否脱流 + 官方「别用绝对定位做整页布局」的边界 + sticky 阈值；
   * css-functions——CSS 不能自定义函数 + calc 混合单位与嵌套 + min 封顶 / max 保底 + clamp 三值顺序；
   * custom-properties——双横线与 kebab-case + 回退值可嵌套 + 作用域由选择器决定含后代 + :root 全局 + prefers-color-scheme 的两值限制；
   * browser-compatibility——Blink / WebKit 引擎差异 + W3C 定标准 + Can I Use 查支持 + iOS 上都是 WebKit + 设备模拟只模拟屏幕尺寸；
   * frameworks-and-preprocessors——官方阶段建议继续写原生 CSS + 框架是现成 CSS 而预处理器要编译 + 引擎盖下 + 变量与嵌套已被原生吸收。 */
  'node-path-intermediate-html-and-css-positioning': ['正常文档流', '视口', '模态框', '分区标题', 'flexbox 或 grid', 'position: relative', '阈值'],
  'node-path-intermediate-html-and-css-css-functions': ['rgb(', 'linear-gradient', '自己的函数', '混合单位', '嵌套', 'Math.min', '封顶', '三个值', '5vw'],
  'node-path-intermediate-html-and-css-custom-properties': ['双横线', 'kebab-case', '回退值', ':root', '作用域', 'prefers-color-scheme', '后代', '区分大小写'],
  'node-path-intermediate-html-and-css-browser-compatibility': ['Blink', 'WebKit', 'W3C', 'Can I Use', 'Tim Berners-Lee', 'CERN', 'Nexus', '90%', '屏幕尺寸', 'iOS'],
  'node-path-intermediate-html-and-css-frameworks-and-preprocessors': ['Bootstrap', 'Tailwind', 'SASS', 'LESS', 'Stylus', '原生 CSS', '引擎盖下', '编译', 'Bulma', '.btn'],
  /* World 2 第五批（2026-09-26，「Grid 布局」6 课）新增课的同族要点：
   * introduction-to-grid——一维/两维分工 + Bert Bos 1996 与 2017 全线支持的史实 + gap 的能力边界演进 + 「不是替代」结论；
   * creating-a-grid——直接子元素边界 + grid-template 简写斜杠前后顺序 + 隐式网格三件套（auto-rows / auto-flow）+ gutter 术语 + devtools grid 徽标；
   * positioning-grid-elements——n+1 条线规律 + 负数线号 + 电子表格类比 + grid-area 四值顺序 + grid-template-areas 文字画布 + 公寓户型图示例；
   * advanced-grid-properties——repeat/fr/min-content/minmax/clamp/auto-fit/auto-fill 全家族 + W3「最大可能正整数」定义 + resize: both 实验台 + 内容盒三步计算；
   * using-flexbox-and-grid——内容优先/布局优先判断口径 + 互补关系 + 嵌套组合技 + 「推荐不是对错」官方收尾；
   * admin-dashboard——Project 红线声明 + 三大块（sidebar/header/main-content）+ 嵌套手法 + MDI 图标与 Roboto 字体素材 + 像素级/响应式两条宽松边界 + GitHub Pages 发布 + 反馈表环节。 */
  'node-path-intermediate-html-and-css-introduction-to-grid': ['两维', 'flex-wrap', 'Bert Bos', '1996', '2017', 'gap', '不是来替代', '报纸'],
  'node-path-intermediate-html-and-css-creating-a-grid': ['直接子元素', 'grid-template', '斜杠前', '隐式', 'grid-auto-rows', 'grid-auto-flow', 'gutter', 'grid 徽标'],
  'node-path-intermediate-html-and-css-positioning-grid-elements': ['n+1', '负数', '电子表格', 'grid-area', 'grid-template-areas', '行起 / 列起 / 行止 / 列止', '公寓'],
  'node-path-intermediate-html-and-css-advanced-grid-properties': ['repeat(', 'min-content', 'minmax(', 'clamp(', 'auto-fit', 'auto-fill', '最大可能正整数', 'resize: both', '内容盒'],
  'node-path-intermediate-html-and-css-using-flexbox-and-grid': ['内容优先', '布局优先', '互补', '嵌套', '推荐'],
  'node-path-intermediate-html-and-css-admin-dashboard': ['不提供成品代码', 'sidebar', 'header', 'main-content', 'Material Design Icons', 'Roboto', '像素级', '响应式', 'GitHub Pages', '反馈']
})) for (const fragment of fragments) assert.ok(full(id).includes(fragment), `${id} 漏掉 ${fragment}`);
assert.ok(data.lessons.find(l => l.id === 'installations').understand.some(s => s.includes('允许跳过')));
/* Project 红线结构钉（v4.11.20 第三批加固）：所有 Project 课 examples 必须为空数组——
 * 塞入任何成品代码这里先红。此前该红线只靠「写课时留空 + 片段表」，无机械保障。 */
for (const lesson of data.lessons.filter(l => /Project/i.test(l.title))) {
  assert.ok(Array.isArray(lesson.examples) && lesson.examples.length === 0,
    `${lesson.id}: Project 课 examples 必须为空数组（红线：不给成品代码）`);
}
// v2 自足中文讲解格式：全部 197 课（Foundations 46 课含五个 Project + World 2 四个章节 22 课含两个 Project + World 3 javascript 课程全八章 41 课含十二个 Project + World 4 三章节 16 课含一个 Project——homepage + World 5 react 课程八章节 25 课含三个 Project——CV 简历应用、记忆卡片与购物车 + World 6 databases 课程 3 课含一个 Project——SQL Zoo + World 7 nodejs 课程八章节 30 课含九个 Project——基本信息站点、迷你留言板、库存管理应用、会员专属俱乐部、文件上传站、博客 API、沃尔多在哪里、聊天应用与 Odin-Book + World 8 getting-hired 课程两章节 14 课含两个 Project——个人网站与简历）都满足 v2 数据结构。
const V2_LESSONS = data.lessons.map(l => l.id);
assert.equal(V2_LESSONS.length, 197, '全部 197 课（Foundations 46 + World 2 四个章节 22 课 + World 3 javascript 全八章 41 课 + World 4 三章节 16 课——收组 + World 5 react 八章节 25 课——收组 + World 6 databases 3 课——收组 + World 7 nodejs 八章节 30 课——收组 + World 8 getting-hired 两章节 14 课——收组，全站收官）都应进入 v2 数据结构');
// 动手 / 命令 / 代码类课程必须有示例；理念类课程 examples 为空数组即可
const EXAMPLES_REQUIRED = ['asking-for-help', 'join-the-odin-community', 'text-editors', 'command-line-basics', 'setting-up-git', 'git-basics', 'elements-and-tags', 'html-boilerplate', 'working-with-text', 'lists', 'links-and-images', 'commit-messages', 'intro-to-css', 'the-cascade'];
const TRADITIONAL_CHARS = '個們來時說後過發對還進種會學將無現點實樣經麼頭開問間馬鳥魚車東長書電話腦見觀視聽寫讀記憶體軟網頁連線圖檔資訊號設計劃輸處變據庫係統應執碼鍵數單雙復複選擇載陣類參屬監觸獲擊佈顏';
for (const id of V2_LESSONS) {
  const lesson = data.lessons.find(l => l.id === id);
  assert.ok(lesson.why && lesson.why.trim(), `${id}: why 非空`);
  assert.ok(Array.isArray(lesson.sections) && lesson.sections.length >= 3, `${id}: sections >= 3`);
  for (const part of lesson.sections) {
    for (const key of Object.keys(part)) assert.ok(['h', 'p', 'list'].includes(key), `${id}: section 非法字段 ${key}`);
    assert.ok(part.h && part.h.trim(), `${id}: section 标题非空`);
    assert.ok(Array.isArray(part.p) && part.p.length && part.p.every(s => s.trim()), `${id}: ${part.h} 段落非空`);
    if (part.list !== undefined) assert.ok(Array.isArray(part.list) && part.list.every(s => s.trim()), `${id}: ${part.h} 列表项非空`);
  }
  assert.ok(Array.isArray(lesson.examples) && lesson.examples.every(e => e.lang && e.code && e.note), `${id}: examples 结构`);
  if (EXAMPLES_REQUIRED.includes(id)) assert.ok(lesson.examples.length >= 1, `${id}: 动手课需要代码示例`);
  assert.ok(Array.isArray(lesson.pitfalls) && lesson.pitfalls.length >= 2 && lesson.pitfalls.every(p => p.title && p.text), `${id}: pitfalls >= 2`);
  /* 无 Assignment 课的豁免名单（official.assignment 必须为空数组而非缺失）：
   * - choose-your-path-forward（v4.11.20 第九批）：结语课，官方文件顶部声明结构豁免；
   * - node-path-javascript-how-this-course-will-work（World 3 批次 4）：官方
   *   how_this_course_will_work.md 同样没有 Assignment 节（sources.json 已登记
   *   hasAssignment:false，与结语课同一口径）。
   * - node-path-javascript-conclusion（World 3 批次 4 阶段 4，v4.11.26）：官方
   *   conclusion.md 为 javascript 课程结语祝贺信（约 1.2KB），无 Assignment 节
   *   （sources.json 已登记 hasAssignment:false，全站第三门、与两门结语课同口径）。
   * - node-path-advanced-html-and-css-accessible-colors（World 4 批次 5 阶段 2，
   *   v4.11.28）：官方 accessible_colors.md 无 Assignment 节（sources.json 已登记
   *   hasAssignment:false，全站第四门、同一口径；正文点名的 Contrast Checker 为
   *   reference 类资料）。
   * - node-path-react-new-how-this-course-will-work（World 5 批次 6 阶段 1，
   *   v4.11.30）：官方 react 版 how_this_course_will_work.md 无 Assignment 节
   *   （sources.json 已登记 hasAssignment:false，全站第五门、与 javascript 课程
   *   同名引言课同一口径；正文两链均 TOP 自有课页，该课同时是全站第五个
   *   零外部资料课）。
   * 官方若给任何一课补了该节，先复核原文再迁移对应断言。 */
  if (id === 'choose-your-path-forward' || id === 'node-path-javascript-how-this-course-will-work' || id === 'node-path-javascript-conclusion' || id === 'node-path-advanced-html-and-css-accessible-colors' || id === 'node-path-react-new-how-this-course-will-work' || id === 'node-path-getting-hired-how-this-course-will-work' || id === 'node-path-getting-hired-it-starts-with-you' || id === 'node-path-getting-hired-building-your-resume' || id === 'node-path-getting-hired-preparing-to-interview-and-interviewing' || id === 'node-path-getting-hired-conclusion') {
    assert.ok(lesson.official && Array.isArray(lesson.official.assignment) && lesson.official.assignment.length === 0, `${id}: 官方无 Assignment（结构豁免），assignment 应为空数组`);
  } else {
    assert.ok(lesson.official && Array.isArray(lesson.official.assignment) && lesson.official.assignment.length >= 1, `${id}: official.assignment 非空`);
  }
  assert.ok(Array.isArray(lesson.official.exercise), `${id}: official.exercise 数组`);
  /* v4.11.17：官方 2026-09-23 已移除课末自查题一节，本站同步下线——
   * 字段保留（语义＝本站收录的官方自查题数）但必须为空数组，不是缺失、
   * 也不是凑数假条目。反向验证：塞回任意一条即红（见文件头说明）。 */
  assert.ok(Array.isArray(lesson.official.knowledgeCheck) && lesson.official.knowledgeCheck.length === 0,
    `${id}: 官方已下线该节，自查题必须为空数组`);
  assert.ok(Array.isArray(lesson.official.optional), `${id}: official.optional 数组`);
  assert.ok(lesson.sources && lesson.sources.basedOn.trim() && lesson.sources.verifiedAt.trim(), `${id}: sources 非空`);
  assert.equal(lesson.sources.sha256, sources.lessons.find(s => s.id === id).sha256, `${id}: sha256 与 sources.json 一致`);
  // 路线 A 保险：每课整课对象不得出现常见繁体字，防误抄第三方繁体课程内容
  const serialized = JSON.stringify(lesson);
  for (const char of TRADITIONAL_CHARS) assert.ok(!serialized.includes(char), `${id}: 出现繁体字 ${char}`);
  // 渲染时 official.optional 与旧字段 optional 会被合并显示，两者不得有重复条目
  for (const item of lesson.official.optional) assert.ok(!lesson.optional.includes(item), `${id}: optional 条目重复`);
}
// 不再存在 v1 薄导读课：每课都必须带 sections，全部走 v2 渲染路径
for (const lesson of data.lessons) {
  assert.ok(Array.isArray(lesson.sections), `${lesson.id}: 仍是 v1 薄导读格式，缺少 sections`);
  for (const key of ['why', 'examples', 'pitfalls', 'official', 'sources']) {
    assert.notEqual(lesson[key], undefined, `${lesson.id}: 缺少 v2 字段 ${key}`);
  }
}
for (const file of ['index.html', 'lesson.html']) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  assert.match(html, /lang="zh-CN"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /charset="UTF-8"/);
  for (const [, ref] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(https:|data:|#)/.test(ref)) continue;
    assert.ok(fs.existsSync(path.join(root, ref.split('?')[0])), `${file}: 本地引用 ${ref}`);
  }
}
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
assert.ok(!/\bfetch\(|XMLHttpRequest|localStorage|innerHTML/.test(app), '离线阅读无接口依赖，内容以文本渲染');
/* v3 断言迁移说明：学习进度需要持久化，但存储职责已整体移出 app.js，
 * 集中在职责单一的 progress.js。因此这里保留“app.js 禁用 localStorage”的原断言不放宽，
 * progress.js 的命名空间 key、敏感字段防护与导入白名单断言迁移至 tests/progress.test.cjs。
 * 两个模块都仍然不得联网、不得使用 innerHTML。 */
const progressSource = fs.readFileSync(path.join(root, 'progress.js'), 'utf8');
assert.ok(!/\bfetch\(|XMLHttpRequest|innerHTML/.test(progressSource), 'progress.js 不联网、不使用 innerHTML');
assert.match(progressSource, /the-odin-project-zh\.progress\.v\d+/, 'progress.js 使用公开仓命名空间的 storage key（发布准备轮改名；旧命名空间仅作只读回落）');
assert.ok(!/document\.cookie/.test(progressSource), 'progress.js 不读写 cookie');

/* ===== v3 外部资料清单（交接 §3、§4 第 11–13 项）===== */
const resourceSandbox = { window: {} };
vm.createContext(resourceSandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'external-resources.js'), 'utf8'), resourceSandbox);
const resourceData = JSON.parse(JSON.stringify(resourceSandbox.window.ODIN_RESOURCES));
const RES = resourceData.resources;
const RESOURCE_FIELDS = ['lessonId', 'title', 'titleZh', 'type', 'requirement', 'zone', 'originalUrl',
  'sourceDomain', 'originalUrlStatus', 'license', 'handling', 'verifiedAt', 'note'];
const GUIDE_FIELDS = ['why', 'points', 'terms', 'focus', 'takeaway'];
assert.ok(Array.isArray(RES) && RES.length > 0, '外部资料清单为非空数组');
assert.ok('zhUrl' in RES[0] && 'zhType' in RES[0], '每条资源都显式声明 zhUrl 与 zhType（无中文版时为 null，而不是缺字段）');

/* §4-12 lessonId 必须属于已开放课程，不得出现未开放课程的编号 */
const lessonIds = new Set(data.lessons.map(l => l.id));
RES.forEach(r => assert.ok(lessonIds.has(r.lessonId), `资源 ${r.title} 的 lessonId ${r.lessonId} 属于已开放课程之内`));
/* v4.11.19：零外部资料课的显式豁免集合（先例：KC 下线前的 PROJECT_NO_KC 写法）。
 * 课 26 Introduction to Flexbox 官方原文的 3 条外链全部是 statically CDN 课程
 * 配图（非学习资料，按盘点范围剔除），Assignment 仅一句无作业声明——官方该课
 * 就没有任何外部学习资料。不凑数、不登记配图。集合里每加一课都必须在这里写明
 * 理由；除此集合外，每课至少一条的断言不放宽。 */
const NO_RESOURCE_LESSONS = new Set(['introduction-to-flexbox', 'installing-node-js',
  /* World 2 第五批（2026-09-26）新增：Grid 布局导读课官方 Assignment 是「Surprise!
   * No assignment!」无作业声明，正文外链全部为 TOP 自有课页（4 条 Flexbox 复习课）、
   * 课内 CodePen 演示笔与 cpwebassets 脚本、练习结果配图（i.postimg.cc，链向 TOP 自有
   * css-exercises 仓库）——官方该课没有任何第三方学习资料，不凑数、不登记配图。 */
  'node-path-intermediate-html-and-css-introduction-to-grid',
  /* World 3 批次 4（2026-09-26）新增：本站第四个零外部资料课。官方
   * organizing_code_with_objects.md 的 Assignment 是「No assignment for this
   * particular lesson!」无作业声明；正文唯一外链是 TOP 自有的 Foundations
   * Object Basics 课页（回链复习）——按既有口径剔除不凑数、不登记。 */
  'node-path-javascript-organizing-code-with-objects',
  /* World 5 批次 6 阶段 1（2026-09-27）新增两课：react 版引言课官方无 Assignment
   * 节、正文仅两处 TOP 自有课页链接（JavaScript 课程页与 Todo List 课页），按既有
   * 口径剔除后零第三方资料——全站第五个零资料课；react-components 为**全站首个
   * 「跨课合并后零条目」课**——官方唯一外链（MDN export 语句文档 #description）与
   * javascript es6-modules 课既有条目同页（同页合并 + 跨课合并归属首现课），不重复
   * 登记；配图（statically 拆解示例图）剔除后本课条目为 0。两课均不凑数。 */
  'node-path-react-new-how-this-course-will-work',
  'node-path-react-new-react-components',
  /* 超长续轮批次 7 阶段 1（2026-09-28）新增三门：World 7 nodejs 课程的三门
   * Project 课官方 Assignment 全部为本地动手操作、无任何第三方外链——
   * basic-informational-site 唯一外链是回指 Getting Started 的 TOP 自有课页
   * （回链复习口径剔除）；mini-message-board 13 条全本地操作 + submissions
   * 提交区（TOP 自有口径剔除）；inventory-application 8 条 + Extra credit
   * 2 条全本地操作。三门均不凑数、不登记——全站第六、七、八个零资料课，
   * 也是全站首个「整批三门 Project 课全部零资料」批次（官方 NodeJS Project
   * 课的资料都在正文知识课里，Project 课只给动手步骤的形态特征）。 */
  'nodejs-basic-informational-site',
  'node-path-nodejs-mini-message-board',
  'node-path-nodejs-inventory-application',
  /* 超长续轮批次 7 阶段 3（v4.11.35）World 7 后六章新增两门零资料课：
   * - members-only：Project 课，官方 Assignment 10 条全部本地动手；唯一第三方外链
   *   express-validator customizing 与 forms-and-data-handling 课既有条目同址（跨课
   *   合并归首现课），部署课页为 TOP 自有——合并后本课零条目，react-components
   *   「跨课合并后零条目」先例同型（全站第 2 门）；
   * - messaging-app：Project 课，官方全文约 2KB、正文与 Assignment 无任何第三方外链
   *   （第 4 条「on our Discord」为纯文字无 URL）——全站第 9 门零外部资料课。
   * 两门均不凑数、不登记。 */
  'node-path-nodejs-members-only',
  'nodejs-messaging-app',
  /* 超长续轮批次 7 阶段 4（2026-09-29，v4.11.36）新增三门零资料课：htcww（导论课
   * 官方全文无外链）/ starts-with-you（自评课官方全文无外链）/ getting-hired 版
   * conclusion（结语祝贺信仅 Discord 邀请与课程反馈表两链接，均按既有口径剔除——
   * 全站第十二门零资料课）。 */
  'node-path-getting-hired-how-this-course-will-work',
  'node-path-getting-hired-it-starts-with-you',
  'node-path-getting-hired-conclusion']);
const coveredIds = new Set(RES.map(r => r.lessonId));
data.lessons.forEach(l => {
  if (NO_RESOURCE_LESSONS.has(l.id)) return;
  assert.ok(coveredIds.has(l.id), `${l.id} 应至少有一条外部资料（零资料课必须在 NO_RESOURCE_LESSONS 登记理由）`);
});
assert.equal(coveredIds.size, data.lessons.length - NO_RESOURCE_LESSONS.size, '有外部资料的课数 = 总课数 − 零资料豁免集合');

/* §4-11 数据结构完整性 */
RES.forEach(r => {
  RESOURCE_FIELDS.forEach(f => assert.equal(typeof r[f], 'string', `${r.title} 缺少字符串字段 ${f}`));
  assert.ok(r.lessonId && r.title && r.titleZh && r.originalUrl, `${r.title} 关键字段非空`);
  assert.ok(['required', 'optional', 'reference'].includes(r.requirement), `${r.title} 的 requirement 合法`);
  GUIDE_FIELDS.forEach(f => assert.ok(r.zhGuide && r.zhGuide[f] !== undefined, `${r.title} 缺少 zhGuide.${f}`));
  assert.ok(Array.isArray(r.zhGuide.points) && r.zhGuide.points.length >= 2, `${r.title} 的中文要点至少 2 条`);
  assert.ok(Array.isArray(r.zhGuide.terms) && r.zhGuide.terms.length >= 1, `${r.title} 至少给出 1 个重要英文词`);
  r.zhGuide.points.forEach(p => assert.ok(typeof p === 'string' && p.length > 10, `${r.title} 的要点为有意义的中文句子`));
  /* v4.11.1 B 档：每条资源都有中文速览 overview——沿用 points 的「有意义的中文句子」同类标准 */
  assert.ok(typeof r.zhGuide.overview === 'string' && r.zhGuide.overview.trim().length > 10, `${r.title} 缺少有意义的 zhGuide.overview 中文速览`);
  /* zhUrl 与 zhType 必须成对：给出中文地址就必须说明它的性质，反之亦然 */
  assert.ok(r.zhUrl === null || typeof r.zhUrl === 'string', `${r.title} 的 zhUrl 为字符串或 null`);
  assert.ok(r.zhType === null || typeof r.zhType === 'string', `${r.title} 的 zhType 为字符串或 null`);
  assert.equal(Boolean(r.zhUrl), Boolean(r.zhType), `${r.title} 的 zhUrl 与 zhType 必须同时存在或同时为空`);
  if (r.zhUrl) assert.match(r.verifiedAt, /^\d{4}-\d{2}-\d{2}$/, `${r.title} 的中文版有核验日期`);
});

/* §4-13 URL 格式与域名一致性校验 */
/* 官方短链域名到主域名的显式映射：youtu.be 是 YouTube 官方短链形式，指向同一站点。
 * 这里用白名单而不是放宽比较，避免出现 sourceDomain 与真实主机名任意不符也通过的情况。 */
const DOMAIN_ALIAS = { 'youtu.be': 'youtube.com' };
RES.forEach(r => {
  const u = new URL(r.originalUrl);
  assert.ok(['http:', 'https:'].includes(u.protocol), `${r.title} 的 originalUrl 为 http(s)`);
  assert.ok(u.hostname === r.sourceDomain || u.hostname === `www.${r.sourceDomain}`
    || DOMAIN_ALIAS[u.hostname] === r.sourceDomain,
    `${r.title} 的 sourceDomain 与 originalUrl 主机名一致`);
  if (r.zhUrl) {
    const z = new URL(r.zhUrl);
    assert.ok(['http:', 'https:'].includes(z.protocol), `${r.title} 的 zhUrl 为 http(s)`);
    assert.ok(!/\s/.test(r.zhUrl), `${r.title} 的 zhUrl 不含空白字符`);
  }
  /* 中文地址必须落在可信来源上：原站自身的语言版本或同项目的中文站点，不接受机器翻译镜像 */
  const MIRROR = /(translate\.google|translate\.bing|--zh\.|\.translate\.goog|fanyi\.|mt\.google)/;
  if (r.zhUrl) assert.ok(!MIRROR.test(r.zhUrl), `${r.title} 的中文版不是机器翻译镜像`);
});

/* 清单自洽：stats 与 audit.perLesson 必须与真实条数一致，防止统计数字与数据脱节 */
assert.equal(RES.length, resourceData.stats.total, 'stats.total 与实际条数一致');
assert.equal(RES.filter(r => r.zhUrl).length, resourceData.stats.withZh, 'stats.withZh 与实际中文条数一致');
assert.equal(RES.filter(r => !r.zhUrl).length, resourceData.stats.guideOnly, 'stats.guideOnly 与实际导读条数一致');
const counted = {};
RES.forEach(r => { counted[r.lessonId] = (counted[r.lessonId] || 0) + 1; });
Object.keys(resourceData.audit.perLesson).forEach(id => {
  assert.equal(counted[id], resourceData.audit.perLesson[id], `audit.perLesson 中 ${id} 的条数与实际一致`);
});
assert.equal(Object.values(resourceData.audit.perLesson).reduce((a, b) => a + b, 0), RES.length, 'audit.perLesson 合计等于总条数');

/* §3.2 没有可靠证据证明有中文字幕的视频，一律不得提供中文地址或声称有中文版 */
RES.filter(r => r.type === '视频').forEach(r => {
  assert.equal(r.zhUrl, null, `视频《${r.title}》未核验到中文字幕或中文版，zhUrl 必须为 null`);
  assert.equal(r.zhType, null, `视频《${r.title}》不得声称存在中文版`);
  assert.ok(!/有?中文字幕/.test(JSON.stringify(r.zhGuide)) || /不声称有中文字幕|没有可靠证据证明/.test(JSON.stringify(r.zhGuide)),
    `视频《${r.title}》的导读未声称有中文字幕`);
});

/* §3.3 不使用 iframe、不代理网页、不注入第三方页面。
 * v4.11.1（C3）：handling 允许两个值——link-only（只链接与本站原创导读）与
 * zh-translation（对许可明确为 CC 系列的来源提供本站中文精译，译文采用与原作
 * 相同的 CC 许可并带署名）。精译是本站的译文内容，不改变“不代理、不 iframe、
 * 不注入第三方页面”的边界；除这两个值外不得出现其他处理方式。 */
assert.ok(RES.every(r => ['link-only', 'zh-translation'].includes(r.handling)), '所有资源的处理方式为 link-only 或 zh-translation，不得为其他值');
/* handling 与数据一致：当且仅当条目带有 zhTranslation 时才允许标 zh-translation */
RES.forEach(r => {
  assert.equal(Boolean(r.zhTranslation), r.handling === 'zh-translation', `${r.title}: handling 与 zhTranslation 存在性一致`);
});

/* ===== v4.11.1 C 档：中文精译的完整性与范围纪律 ===== */
const TRANSLATED = RES.filter(r => r.handling === 'zh-translation');
assert.equal(TRANSLATED.length, 14, 'zh-translation 共 14 条（15 条 CC 且无官方中文版中，shell-lesson-data.zip 为二进制数据文件无文本可译，保持 link-only）');
assert.equal(resourceData.stats.withTranslation, TRANSLATED.length, 'stats.withTranslation 与实际精译条数一致');
TRANSLATED.forEach(r => {
  const t = r.zhTranslation;
  /* C2：每篇精译必须带署名与来源标注、相同 CC 许可声明、译者与修改说明 */
  for (const f of ['attribution', 'licenseNote', 'translatorNote', 'modifications']) {
    assert.ok(typeof t[f] === 'string' && t[f].trim(), `${r.title}: zhTranslation.${f} 非空`);
  }
  assert.ok(['full', 'core'].includes(t.kind), `${r.title}: kind 为 full 或 core`);
  assert.ok(/CC/.test(t.licenseNote) && /相同/.test(t.licenseNote), `${r.title}: 许可声明写明采用与原作相同的 CC 许可`);
  assert.ok(Array.isArray(t.body) && t.body.length >= 3 && t.body.every(line => typeof line === 'string' && line.trim()), `${r.title}: body 为不少于 3 行的非空字符串数组`);
  /* C4：只有许可明确为 CC 系列的条目才允许精译 */
  assert.ok(/CC[ -]?BY/i.test(r.license), `${r.title}: 仅许可明确为 CC 系列的条目可为 zh-translation`);
  /* 已有官方中文版的条目不需要本站译文（官方中文版优先） */
  assert.equal(r.zhUrl, null, `${r.title}: zh-translation 条目应无官方中文版（有则应直接给官方链接）`);
});
/* C4 反向：许可未明确 CC 的条目一律保持 link-only、不得携带译文 */
RES.filter(r => !/CC[ -]?BY/i.test(r.license)).forEach(r => {
  assert.equal(r.handling, 'link-only', `${r.title}: 许可未明确为 CC 的条目保持 link-only`);
  assert.ok(!r.zhTranslation, `${r.title}: 许可未明确为 CC 的条目不得携带译文`);
});

/* ===== v4.11.1 A1 数据前提：受限地址可精确匹配、恰好分布于 3 课 ===== */
const LIMITED = resourceData.audit.verifyLimitedUrls;
assert.ok(Array.isArray(LIMITED) && LIMITED.length === 49, 'verifyLimitedUrls 共 49 条（v4.11.17 起含课 21 的 W3Schools 颜色值参考页，v4.11.18 起含课 25 的三条 W3Schools 字体与块级清单参考页，v4.11.19 起含课 30 的 Pixabay 免费图库——同批登记的 Pexels 于批次 6 阶段 0（2026-09-27，用户拍板）升级 A 类并移出本清单：真实浏览器直连 /zh-cn/ 实测 responseStatus 200、标题「免费素材图片」、界面全中文，命令行双 UA 403 属站点反爬、双通路事实记 originalUrlStatus，v4.11.20 起含课 33 的 W3Schools 字符串方法教程，第四批起含课 39 的 reddit 缩进玩笑帖与 onextrapixel 原则清单，第八批起含课 45 的 StackOverflow eval 对比讨论，第九批起含课 46 的 Medium 选语言指南，v4.11.21 World 2 第二批起含更多文本样式课的 W3Schools 字体支持表与高级选择器课的 StackOverflow :root 讨论，World 2 第三批起含框架与预处理器课的 Medium CSS 框架简介，World 3 批次 4 起含 npm 课的 npmjs 包页与 OOP 原则课的 Medium SOLID 文，阶段 3 起含更多测试课的 Medium 纯函数文、CS 引言课的 Quora 短链、空间复杂度课的 cs.stackexchange 讨论、HashMap 原理课的 StackOverflow 质数讨论与骑士之旅课的两条 Khan Academy 图文章——后两条命令行返回 200 但内容为反爬挑战页无法确认正文，同按验证受限登记；World 5 批次 6 阶段 1 起含 React 简介课的 Medium JS 框架生命周期文——命令行 403、真实浏览器挑战自动通过后可达并取得标题与 h1，同轮阶段 0 pexels 移出 1 条，29 → 28 → 29；World 5 批次 6 阶段 3 起含模拟回调与组件课的 Medium mock 子组件文——命令行 403、真实浏览器核验可达并取得标题与 h1（无登录墙拦截正文，官方注明可能需注册如实转达），29 → 30；超长轮批次 7 阶段 1（World 6 收组）起含数据库导论课的可汗学院 SQL 欢迎页——命令行 Client Challenge、真实浏览器可达，与数据库与 SQL 课的两条 W3Schools（SQL JOIN 教程页与 GROUP BY 游乐场）——默认 UA 403、浏览器 UA 复核 200，30 → 33；超长轮批次 7 阶段 2（NodeJS 17 课）起含环境变量课的 npmjs dotenv 包页与 Express 入门课的 npmjs nodemon 包页——Cloudflare 人机验证双 UA 均 403、控制器课的 Medium 中间件揭秘文——Cloudflare 拦截双 UA 均 403、使用 PostgreSQL 课的 StackOverflow package.json scripts 回答——「Just a moment...」挑战双 UA 均 403，33 → 37；超长轮批次 7 阶段 3（NodeJS 后六章 13 课）起含身份认证基础课的 npmjs connect-pg-simple 包页——Cloudflare 双 UA 403、API 安全课的 Medium stateless auth 文——Cloudflare「Attention Required」双 UA 403、Prisma ORM 课的 StackOverflow Serial/Identity 回答——「Just a moment...」双 UA 403、Odin-Book 课的 gravatar 首页——命令行 curl 连接失败 000（疑站点对命令行/数据中心请求限制），37 → 41；超长续轮批次 7 阶段 4（World 8 求职 14 课、全站收官）起含职业人脉课的 Forbes 80% 隐藏市场文、准备课的 Forbes GitHub 招聘工具文与个人网站课的 Forbes 个人网站文——forbes.com 命令行 000、真实浏览器 ERR_CONNECTION_TIMED_OUT 双通路不可达，公司想要什么课的 MetaFilter 实习帖——双通路不可达（000 + 浏览器超时），准备课的 programmers.stackexchange 网络形象问答——301 站点迁移至 softwareengineering.stackexchange.com 后 403、真实浏览器 Cloudflare 挑战页，准备课的 Medium pramp 数字形象文——命令行 403、真实浏览器 ERR_CERT_AUTHORITY_INVALID（本轮网络通路证书异常）双通路不可达，面试课的 Monster 电话筛选文——301 至显式 :443 端口形态后命令行 000、真实浏览器同证书异常双通路不可达，面试课的 LeetCode explore——命令行 403、真实浏览器 Cloudflare 安全验证挑战页（中文站 leetcode.cn 另行 A 类登记），41 → 49。同轮命令行受限但真实浏览器可达的 4 条不入清单：comparably 403 / workatastartup 406 / insights.dice 2013 与 2014 两篇 301 后 000——浏览器均 200 取得标题，jsbin 先例口径）');
LIMITED.forEach(entry => {
  const url = entry.split('（')[0];
  assert.ok(RES.some(r => r.originalUrl === url), `受限地址 ${url} 能按全角括号前缀与某条资源 originalUrl 精确匹配`);
});
const limitedLessons = new Set();
RES.forEach(r => { if (LIMITED.some(e => e.split('（')[0] === r.originalUrl)) limitedLessons.add(r.lessonId); });
assert.deepEqual([...limitedLessons].sort(), ["block-and-inline","calculator","choose-your-path-forward","clean-code","data-types-and-conditionals","html-boilerplate","intro-to-css","javascript-a-very-brief-intro-to-cs","javascript-hashmap-data-structure","javascript-knights-travails","javascript-space-complexity","join-the-odin-community","landing-page","links-and-images","node-path-databases","node-path-databases-databases-and-sql","node-path-getting-hired-building-your-personal-website","node-path-getting-hired-preparing-to-interview-and-interviewing","node-path-getting-hired-professional-networking","node-path-getting-hired-what-companies-want","node-path-getting-hired-what-you-can-do-to-prepare","node-path-intermediate-html-and-css-advanced-selectors","node-path-intermediate-html-and-css-form-validation","node-path-intermediate-html-and-css-frameworks-and-preprocessors","node-path-intermediate-html-and-css-more-text-styles","node-path-intermediate-html-and-css-sign-up-form","node-path-javascript-more-testing","node-path-javascript-npm","node-path-javascript-oop-principles","node-path-nodejs-authentication-basics","node-path-nodejs-introduction-to-express","node-path-nodejs-odin-book","node-path-react-new-introduction-to-react","node-path-react-new-mocking-callbacks-and-components","nodejs-api-security","nodejs-controllers","nodejs-environment-variables","nodejs-prisma-orm","nodejs-using-postgresql"],
  '受限条目恰好分布于 39 课——「按课显示提示」的数据前提（v4.11.21 World 2 第二批起含更多文本样式课与高级选择器课，第三批起含框架与预处理器课，第四批起含表单校验课与注册表单项目课，World 3 批次 4 起含 npm 课与 OOP 原则课，阶段 3 起含更多测试课、CS 引言课、空间复杂度课、HashMap 原理课与骑士之旅课，World 5 批次 6 阶段 1 起含 React 简介课——landing-page 于阶段 0 移出 pexels 后仍有 Pixabay 在案、课数不减，批次 6 阶段 3 起含模拟回调与组件课，超长轮批次 7 阶段 1 起含数据库导论课与数据库与 SQL 课，批次 7 阶段 2 起含 Express 入门课、控制器课、环境变量课与使用 PostgreSQL 课，批次 7 阶段 3 起含身份认证基础课、Prisma ORM 课、API 安全课与 Odin-Book 课，超长续轮批次 7 阶段 4 起含职业人脉课（Forbes 80% 文双通路不可达）、公司想要什么课（MetaFilter 双通路不可达）、你可以做的准备课（Forbes GitHub 文与 programmers.SE 迁移后 Cloudflare 与 Medium pramp 双通路不可达）、个人网站项目课（Forbes 个人网站文双通路不可达）与面试课（Monster 电话筛选双通路不可达 + LeetCode explore Cloudflare 挑战页）——五课新增，34 → 39）');
const resourceSource = fs.readFileSync(path.join(root, 'external-resources.js'), 'utf8');
assert.ok(!/\bfetch\(|XMLHttpRequest|innerHTML|<iframe/.test(resourceSource), 'external-resources.js 不联网、不使用 innerHTML、不含 iframe');
/* §2.2 清单是公开教学数据，不得夹带任何账号凭据值 */
assert.ok(!/document\.cookie/.test(resourceSource), 'external-resources.js 不读写 cookie');
assert.ok(!/(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{10,})/.test(resourceSource), '清单中不含任何真实 token');
/* 沿用全站繁体保险，覆盖新增的中文导读文本与 v4.11.1 的速览 / 精译文本 */
const resourceChinese = RES.map(r => r.titleZh + JSON.stringify(r.zhGuide) + JSON.stringify(r.zhTranslation || '') + r.note).join('');
TRADITIONAL_CHARS.split('').forEach(ch => {
  assert.ok(!resourceChinese.includes(ch), `外部资料导读与译文未使用繁体字「${ch}」`);
});
assert.ok(!fs.existsSync(path.join(root, 'package.json')), '无构建与运行依赖');

/* ===== v4.11.1 渲染验证：A1 按课提示 / B 档速览 / C 档译文（dom-stub 真实挂载路径） ===== */
const { newPage, makeStorage, collectByClass } = require('./dom-stub.cjs');
const textOf = el => (!el ? '' : el._text ? el._text : (el.childNodes || []).map(textOf).join(''));
const mountLesson = id => newPage({ storage: makeStorage(), page: 'lesson', search: `?id=${id}`, href: `http://127.0.0.1:8765/lesson.html?id=${id}` });
const noticeTexts = page => collectByClass(page.dom.body, 'notice').map(textOf).filter(t => t.includes('自动核验受限'));

/* A1（v4.11.4 反向钉子）：块级「自动核验受限」提示已从课页移除
 * （CONTENT-STYLE-GUIDE.md 第 1 节「读者页面零审计信息」）；受限条目由
 * 单卡「核验说明」（resource.note）承担——20 课全部不得出现块级提示，
 * 含此前确有受限条目的 join-the-odin-community / html-boilerplate / links-and-images。 */
for (const lesson of data.lessons) {
  assert.equal(noticeTexts(mountLesson(lesson.id)).length, 0, `${lesson.id} 课页零块级「自动核验受限」提示`);
}
{
  /* 受限条目的诚实记录仍在单卡核验说明里（唯一例外，不是全局审计块） */
  const page = mountLesson('join-the-odin-community');
  const notes = collectByClass(page.dom.body, 'resource-note').map(textOf);
  assert.ok(notes.some(t => t.includes('核验说明')), 'join-the-odin-community 单卡核验说明仍在（诚实记录保留）');
}
/* B 档：速览渲染为导读 dl 的第一行；C 档：译文块静态展开且署名可见 */
{
  const page = mountLesson('how-this-course-will-work');
  const dls = collectByClass(page.dom.body, 'resource-guide');
  assert.equal(dls.length, 2, '课01 两张资料卡');
  dls.forEach(dl => {
    const dtTexts = dl.childNodes.filter(n => n.tagName === 'DT').map(textOf);
    assert.equal(dtTexts[0], '中文速览', '导读第一行是中文速览');
  });
  const trs = collectByClass(page.dom.body, 'resource-translation');
  assert.equal(trs.length, 2, '课01 两条 CC 条目都有译文块');
  const firstText = textOf(trs[0]);
  assert.ok(firstText.includes('署名与来源：'), '译文块含署名与来源标注');
  assert.ok(firstText.includes('许可声明：') && firstText.includes('相同的'), '译文块含相同许可声明');
  assert.ok(firstText.includes('译者说明：') && firstText.includes('修改说明：'), '译文块含译者与修改说明');
  /* 译文块不得引入 details/summary（browser-smoke 钉住课页 details 数 = quiz 数；资源卡纪律为静态展开） */
  let detailsInTranslation = 0;
  const walk = n => { if (n.tagName === 'DETAILS' || n.tagName === 'SUMMARY') detailsInTranslation += 1; (n.childNodes || []).forEach(walk); };
  trs.forEach(walk);
  assert.equal(detailsInTranslation, 0, '译文块零 details/summary');
}
/* C 档反向：无 CC 精译条目的课不渲染译文块 */
assert.equal(collectByClass(mountLesson('working-with-text').dom.body, 'resource-translation').length, 0, '课16 无译文块');

const quizTotal = data.lessons.reduce((n, l) => n + l.quiz.length, 0);
console.log(`通过：197 课顺序与来源（Foundations 46 + World 2 四个章节 22 课 + World 3 javascript 全八章 41 课 + World 4 三章节 16 课——收组 + World 5 react 八章节 25 课——收组 + World 6 databases 3 课——收组 + World 7 nodejs 八章节 30 课——收组 + World 8 getting-hired 两章节 14 课——收组，全站 197 课全部开放）、每课六类内容、${quizTotal} 道自测、${V2_LESSONS.length} 课 v2 自足讲解格式与繁体保险、重点任务及范围边界（官方已下线课末自查题节，全课自查题为空数组且任务文案零残留，反向钉住）、本地资源和无构建依赖、${RES.length} 条外部资料（其中 ${resourceData.stats.withZh} 条有已核验中文版、${resourceData.stats.guideOnly} 条为本站中文导读 + 英文原文；${RES.length} 条全部带中文速览、${TRANSLATED.length} 条 CC 来源带本站中文精译；v4.11.4 课页零块级受限提示、单卡核验说明保留）。`);
