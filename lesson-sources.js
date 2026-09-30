/* lesson-sources.js —— 路径课程汇总层：把已开放的 courses/*.js 并入 window.ODIN_GUIDE。
 *
 * 为什么需要它（2026-09-25 路径课试点批次 1，规划 20260925-1700 §11.1）：
 * app.js 全篇通过 window.ODIN_GUIDE 读取课程（第 5 行 const data = window.ODIN_GUIDE 是
 * 唯一集中入口）——合并发生在这里可以让 app.js 对「课程从哪来」零感知、零改动
 * （它是 40 万字符的大文件，改得越少越安全）。
 *
 * 加载顺序（index.html 与 lesson.html 一致，本文件必须在 lessons.js 与 courses/*.js
 * 之后、app.js 之前）：
 *   lessons.js（Foundations 46 课，唯一事实源，不动）
 *   → courses/*.js（路径课程按 World 分文件）
 *   → lesson-sources.js（本文件：合并）
 *   → app.js
 *
 * 职责与约束：
 *   - 把每个已开放 course 的 groups 与 lessons 追加进 ODIN_GUIDE；
 *   - **幂等**：重复执行不会把课程加两遍（以 course id 为键去重——courses/*.js 里
 *     每个 course 对象有唯一 course.id，ODIN_GUIDE 侧用合并标记防重入）；
 *   - **降级安全**：任一 courses/*.js 缺失（加载失败 / 被移除）时，ODIN_GUIDE 仍是
 *     合法的 Foundations 46 课——extras 数组 filter(Boolean) + 逐 course 守卫；
 *   - **全站 slug 唯一**由 lesson-sources.test.cjs 钉住（合并后发现重复 id 即红，
 *     这是共享进度存储的前提——见规划 §4.5 的撞名实测）；
 *   - 本文件不修改 lessons.js 的任何现有内容（铁律：46 课是已发布稳定资产）。 */
(function () {
  'use strict';
  var base = window.ODIN_GUIDE;
  /* 降级：无 base（lessons.js 未加载）时不动作——app.js 侧有自己的降级路径 */
  if (!base || !Array.isArray(base.lessons) || !Array.isArray(base.groups)) return;
  /* 幂等：已合并过就不再动（重复执行本文件不会重复追加） */
  if (base.__coursesMerged) return;

  var extras = [
    window.ODIN_COURSE_INTERMEDIATE_HTML_CSS,
    /* World 3 批次 4 阶段 1（2026-09-26，v4.11.23）：javascript 课程前两章 15 课开放。
     * 顺序即合并顺序：groups 追加下标与课的 group 偏移都按此计算，不得调换。 */
    window.ODIN_COURSE_JAVASCRIPT,
    /* World 4 批次 5 阶段 1（2026-09-27，v4.11.27）：advanced-html-and-css 课程
     * 「动画」章节 3 课开放（该课程 groups 全 3 项已在课程文件写全）。
     * 顺序即合并顺序：本课程的 group 偏移为 20（Foundations 8 + World 2 4 + World 3 8）。 */
    window.ODIN_COURSE_ADVANCED_HTML_CSS,
    /* World 5 批次 6 阶段 1（2026-09-27，v4.11.30）：react 课程「引言」+「React 入门」
     * 两章 8 课开放（该课程 groups 全 8 项已在课程文件写全）。
     * 顺序即合并顺序：本课程的 group 偏移为 23（Foundations 8 + World 2 4 + World 3 8 + World 4 3）。 */
    window.ODIN_COURSE_REACT,
    /* World 6 超长轮批次 7 阶段 1（2026-09-28，v4.11.33）：databases 课程「数据库」
     * 单章 3 课开放（该课程 groups 全 1 项已在课程文件写全）。
     * 顺序即合并顺序：本课程的 group 偏移为 31（Foundations 8 + World 2 4 + World 3 8 + World 4 3 + World 5 8）。 */
    window.ODIN_COURSE_DATABASES,
    /* World 7 超长续轮批次 7 阶段 1（2026-09-28，v4.11.34）：nodejs 课程「NodeJS 入门」
     * 6 课 +「Express」11 课开放（该课程 groups 全 8 项已在课程文件写全）。
     * 顺序即合并顺序：本课程的 group 偏移为 32（Foundations 8 + World 2 4 + World 3 8 + World 4 3 + World 5 8 + World 6 1；批次 7 阶段 4 订正原「34 / World 6 3」笔误——databases 实际只贡献 1 个 group，运行时以现算 base.groups.length 为准，行为从未受影响）。 */
    window.ODIN_COURSE_NODEJS,
    /* World 8 超长续轮批次 7 阶段 4（2026-09-29，v4.11.36）：getting-hired 课程
     * 「准备求职」7 课 +「投递与面试」7 课开放（该课程 groups 全 2 项已在课程
     * 文件写全）——World 8 收组即全站 197 课收官，无未开放课程。
     * 顺序即合并顺序：本课程的 group 偏移为 40（Foundations 8 + World 2 4 +
     * World 3 8 + World 4 3 + World 5 8 + World 6 1 + World 7 8，现算为准）。 */
    window.ODIN_COURSE_GETTING_HIRED
  ].filter(Boolean);

  var mergedGroupCount = 0;
  extras.forEach(function (course) {
    /* 逐 course 守卫：结构不完整时跳过该 course（降级安全），不给 ODIN_GUIDE 塞坏数据 */
    if (!course || !Array.isArray(course.lessons) || !Array.isArray(course.groups)) return;
    /* courses/*.js 里课的 group 是**文件内**下标（从 0 起）；合并到 ODIN_GUIDE 后
     * 该 course 的 groups 追加在尾部（下标 8 起），因此每课的 group 必须加上
     * 偏移量 base.groups.length（合并 groups 之前的长度），否则课会指向 Foundations
     * 的分组（content.test 的「group 必须在 data.groups 范围内 + 不回退」与渲染分组
     * 都会错）。浅拷贝课对象再改，不污染 courses 文件的源对象。 */
    var groupOffset = base.groups.length;
    course.groups.forEach(function (group) { base.groups.push(group); });
    course.lessons.forEach(function (lesson) {
      var merged = {};
      for (var key in lesson) merged[key] = lesson[key];
      if (Number.isInteger(merged.group)) merged.group += groupOffset;
      base.lessons.push(merged);
    });
    mergedGroupCount += 1;
  });

  /* 幂等标记：标记后重复执行直接返回（上面第一条守卫读它）。
   * 不用 Symbol / 不可枚举属性：保持与 lessons.js 数据文件的朴素对象风格一致，
   * 且 content.test 等测试按 window.ODIN_GUIDE 浅结构断言，多一个标记字段无影响。 */
  base.__coursesMerged = true;
  base.__coursesMergedCount = mergedGroupCount;
})(typeof window !== 'undefined' ? window : globalThis);
