/* lesson-sources.test.cjs —— 汇总层四条钉子（2026-09-25 路径课试点批次 1）。
 *
 * 为什么需要这个文件：lesson-sources.js 的合并若没有测试，就是「隐式的、无法审计的」
 * ——courses/* 什么时候进、进了几课、id 是否撞车、降级是否安全，全靠跑起来碰运气。
 * 四条断言对应规划 20260925-1700 §11.1 的四个必须项：
 *   1. 全站 slug 唯一（lessons.js + courses/* 合并后 id 全局唯一）——共享进度存储
 *      的前提（规划 §4.5 实测过剥离前缀会撞名：how-this-course-will-work / conclusion）；
 *   2. 合并幂等（lesson-sources.js 重复执行不加两遍）；
 *   3. 降级安全（courses/*.js 缺失时 ODIN_GUIDE 仍是合法的 Foundations 46 课）；
 *   4. groups 下标不回退（content.test 已有断言在合并后的全量上仍须成立——此处
 *      钉「Foundations 分组下标 0–7 不被路径课挤占」，content.test 钉全量连续性）。
 * 负向验证（交付前实跑）：给 course 里塞一个与 Foundations 重复的 id → 本文件红；
 * 移除 course 后按「降级安全」重新组装 → 断言 Foundations 46 课仍在。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

let checks = 0;
const check = label => { checks += 1; return label; };
const root = path.resolve(__dirname, '..');

/* ---------- 组装工具：按 HTML 加载顺序在独立 sandbox 执行脚本 ---------- */
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const assemble = ({ withoutCourse, extraCourseSource } = {}) => {
  const sandbox = { window: {} };
  vm.runInNewContext(read('lessons.js'), sandbox, { filename: 'lessons.js' });
  if (!withoutCourse) {
    /* courses 目录下全部 *.js（未来按 World 增加文件时自动纳入） */
    const coursesDir = path.join(root, 'courses');
    fs.readdirSync(coursesDir).filter(f => f.endsWith('.js')).sort().forEach(f => {
      vm.runInNewContext(fs.readFileSync(path.join(coursesDir, f), 'utf8'), sandbox, { filename: 'courses/' + f });
    });
  }
  if (extraCourseSource) {
    vm.runInNewContext(extraCourseSource, sandbox, { filename: 'courses/extra-test-course.js' });
  }
  vm.runInNewContext(read('lesson-sources.js'), sandbox, { filename: 'lesson-sources.js' });
  return sandbox.window.ODIN_GUIDE;
};

/* ---------- 1. 全站 slug 唯一 ---------- */
{
  const guide = assemble();
  const ids = guide.lessons.map(l => l.id);
  assert.equal(new Set(ids).size, ids.length,
    check('全站 slug 唯一：lessons.js + courses/* 合并后无重复 id（共享进度存储的前提）'));
  console.log(`  slug 唯一：合并后 ${ids.length} 门课程全部唯一`);
}

/* ---------- 2. 合并幂等 ---------- */
{
  const sandbox = { window: {} };
  vm.runInNewContext(read('lessons.js'), sandbox, { filename: 'lessons.js' });
  const coursesDir = path.join(root, 'courses');
  fs.readdirSync(coursesDir).filter(f => f.endsWith('.js')).sort().forEach(f => {
    vm.runInNewContext(fs.readFileSync(path.join(coursesDir, f), 'utf8'), sandbox, { filename: 'courses/' + f });
  });
  const before = sandbox.window.ODIN_GUIDE.lessons.length;
  /* v4.11.21 World 2 第二批迁移：追加数不再硬编码（原「+3」在第二批 5 课后连环红）——
   * 期望值从 courses/* 全局对象现算，扩下一批课时本断言自动前进。 */
  const courseLessonTotal = Object.keys(sandbox.window)
    .filter(k => k.startsWith('ODIN_COURSE_'))
    .reduce((n, k) => {
      const c = sandbox.window[k];
      return n + (c && Array.isArray(c.lessons) ? c.lessons.length : 0);
    }, 0);
  vm.runInNewContext(read('lesson-sources.js'), sandbox, { filename: 'lesson-sources.js' });
  const afterFirst = sandbox.window.ODIN_GUIDE.lessons.length;
  vm.runInNewContext(read('lesson-sources.js'), sandbox, { filename: 'lesson-sources.js' });
  const afterSecond = sandbox.window.ODIN_GUIDE.lessons.length;
  assert.equal(afterFirst, before + courseLessonTotal, check('合并生效：lesson-sources.js 首次执行追加 courses/* 全部课（追加数现算）'));
  assert.equal(afterSecond, afterFirst, check('合并幂等：lesson-sources.js 重复执行不加两遍'));
  console.log(`  幂等：${before} → ${afterFirst} → ${afterSecond}（第二次执行零变化）`);
}

/* ---------- 3. 降级安全：缺 courses/*.js 时仍是合法 Foundations ---------- */
{
  const guide = assemble({ withoutCourse: true });
  assert.equal(guide.lessons.length, 46,
    check('降级安全：courses/*.js 缺失时 ODIN_GUIDE 仍是合法的 Foundations 46 课'));
  assert.ok(guide.lessons.every(l => !/^node-path-/.test(l.id)),
    check('降级安全： Foundations 内无路径课 id 混入'));
  console.log('  降级：无 courses/* 时 46 门 Foundations 课程完整');
}

/* ---------- 4. Foundations 分组下标不被挤占（content.test 钉全量连续性） ---------- */
{
  /* vm sandbox 的对象跨 Realm：直接 deepEqual 会报「same structure but not
   * reference-equal」（数组与字符串的原型链不同）——JSON 往返切断跨 Realm 引用，
   * 与 doc-numbers.test.cjs loadData 的先例同一做法。 */
  const guide = JSON.parse(JSON.stringify(assemble()));
  /* World 3 批次 4 迁移：路径课的判定不再用 /^node-path-/ 前缀——javascript 课程有
   * 16 个官方 slug 不带 node-path- 前缀（本批开放了其中 2 个：javascript-es6-modules
   * 与 javascript-webpack），前缀谓词会漏数。改为「id 属于 courses/* 文件」的集合判定，
   * 期望值全部从课程文件现算。 */
  const courseSandbox = { window: {} };
  fs.readdirSync(path.join(root, 'courses')).filter(f => f.endsWith('.js')).sort().forEach(f => {
    vm.runInNewContext(fs.readFileSync(path.join(root, 'courses', f), 'utf8'), courseSandbox, { filename: 'courses/' + f });
  });
  /* 批次 5 阶段 1 迁移（第三个课程文件暴露的顺序假设缺口）：课程的**真实合并顺序**
   * 由 lesson-sources.js 的 extras 数组决定（按 World 顺序登记，注释钉住不得调换），
   * 不是文件名字母序——advanced-html-and-css.js 字母序第一、合并序第三，两种顺序
   * 自此分叉（此前两文件恰好一致，断言隐含了错误假设）。期望顺序改为从
   * lesson-sources.js 源码解析 extras 数组的全局名序列——extras 数组是顺序的
   * 唯一事实源；并新增覆盖钉：课程文件定义了全局却忘登记进 extras 时红
   * （降级安全钉的是「缺文件」，这条钉的是「漏登记」，两者互补）。
   * 后续批次新增课程文件时本文件断言零迁移。 */
  const lsSource = read('lesson-sources.js');
  const extrasBlock = /var extras = \[([\s\S]*?)\]\.filter\(Boolean\)/.exec(lsSource);
  assert.ok(extrasBlock, check('前提：lesson-sources.js 源码可解析出 extras 数组（合并顺序的唯一事实源）'));
  const mergeOrder = [...extrasBlock[1].matchAll(/window\.(ODIN_COURSE_[A-Z0-9_]+)/g)].map(m => m[1]);
  const allCourseKeys = Object.keys(courseSandbox.window).filter(k => k.startsWith('ODIN_COURSE_'));
  assert.deepEqual([...mergeOrder].sort(), [...allCourseKeys].sort(),
    check('extras 数组覆盖全部课程文件（新增 courses/*.js 忘登记进 lesson-sources.js 时本断言红）'));
  const courseIds = new Set();          /* 全部路径课 id */
  const fileGroupOf = {};               /* 路径课 id → 文件内 group 下标 */
  const courseOfLesson = {};            /* 路径课 id → 所属 course 对象 */
  const courseList = [];                /* courses/* 里的课程对象（extras 合并序） */
  const courseGroupNames = [];          /* 课程文件里的分组英文名，按合并序拼接 */
  let courseLessonTotal = 0;
  let courseGroupTotal = 0;
  for (const key of mergeOrder) {
    const course = courseSandbox.window[key];
    assert.ok(course && Array.isArray(course.lessons) && Array.isArray(course.groups),
      check(`前提：extras 里的 ${key} 对应已加载且结构完整的课程对象`));
    courseList.push(course);
    courseLessonTotal += course.lessons.length;
    courseGroupTotal += course.groups.length;
    course.groups.forEach(g => courseGroupNames.push(g.en));
    course.lessons.forEach(l => {
      courseIds.add(l.id);
      fileGroupOf[l.id] = l.group;
      courseOfLesson[l.id] = course;
    });
  }
  /* lessons.js 的分组下标 0–7 在合并后必须仍是原含义（路径课追加在尾部） */
  const foundationsEnd = guide.lessons.findIndex(l => courseIds.has(l.id));
  assert.equal(foundationsEnd, 46,
    check('Foundations 46 课占据合并后数组前 46 位（路径课追加在尾部，不插入中间）'));
  const groupIds = guide.groups.map(g => g.en);
  assert.deepEqual(groupIds.slice(0, 8),
    ['Introduction', 'Prerequisites', 'Git Basics', 'HTML Foundations', 'CSS Foundations', 'Flexbox', 'JavaScript Basics', 'Conclusion'],
    check('Foundations 八分组下标 0–7 保持原位（路径课分组从下标 8 追加）'));
  /* 批次 3 补钉（负向验证抓出的错位 bug）：courses/*.js 里课的 group 是文件内下标，
   * 合并层必须加偏移——World 3 批次 4 起偏移不再恒为 8：第二个课程文件的分组接在
   * 第一个之后（javascript 的偏移 = 8 + World 2 的 4 组 = 12）。每课期望
   * group = 所属课程首组在合并后 groups 里的下标 + 文件内下标，两边都现算。 */
  const w2 = guide.lessons.filter(l => courseIds.has(l.id));
  /* 批次 6 阶段 1 迁移（2026-09-27）：偏移不再按组名 findIndex 搜索，改为按 extras
   * 合并序累计现算。原按名搜索在只有 javascript 首组叫 Introduction（与 Foundations
   * 组 0 同名、靠 i>=8 收窄）时成立；react 课程首组 en 也叫 Introduction，按名搜索
   * 会命中 javascript 的组（下标 8）而不是 react 自己的偏移（23）——与 map-boss 的
   * duplicateSectionIds 撞名事实同源。累计定位顺带把「每课偏移 = 8 + 之前课程组数」
   * 钉死（javascript=8、advanced-html-and-css=20、react=23），比按名搜索更强。 */
  const courseOffset = new Map();
  let groupCursor = 8;
  for (const course of courseList) {
    const label = (course.course && course.course.id) || '(未命名课程)';
    assert.equal(guide.groups[groupCursor] && guide.groups[groupCursor].en, course.groups[0].en,
      check(`课程 ${label} 的首组位于合并后 groups 的累计偏移 ${groupCursor} 处（8 + 之前课程组数）`));
    courseOffset.set(course, groupCursor);
    groupCursor += course.groups.length;
  }
  assert.equal(w2.length, courseLessonTotal,
    check(`路径课合并数 = courses/* 全部课数（现算 ${courseLessonTotal}，实际 ${w2.length}）`));
  assert.equal(guide.groups.length, 8 + courseGroupTotal,
    check('合并后分组总数 = Foundations 八分组 + courses/* 全部分组'));
  assert.ok(w2.every(l => l.group === courseOffset.get(courseOfLesson[l.id]) + fileGroupOf[l.id]),
    check('路径课 group 偏移：每课合并后 group = 所属课程分组起点 + 文件内下标（指向自己的章节分组，不是 Foundations 分组）'));
  /* World 2 第四批迁移：期望值不再硬编码两个分组名，改为从课程文件现算——
   * 追加的分组必须与 courses/*.js 里 groups 的顺序逐字一致（官方章节序），
   * 少一组、多一组、顺序调换都会红，而后续批次新增章节时本断言零迁移。
   * 批次 5 阶段 1 起「现算」的顺序基准是 lesson-sources.js extras 数组的合并序。 */
  assert.deepEqual([...guide.groups.slice(8)].map(g => g.en), courseGroupNames,
    check(`追加分组顺序与 extras 合并序一致（现算 ${courseGroupNames.length} 组：${courseGroupNames.join(' → ')}）`));
  console.log(`  分组：Foundations 0–7 原位，路径课分组自下标 8 起（当前共 ${groupIds.length} 组），路径课 group 值 ${[...new Set(w2.map(l => l.group))].join('/')}（现算偏移）`);
}

console.log(`通过：lesson-sources 汇总层 ${checks} 项断言（slug 唯一 / 合并幂等 / 降级安全 / 分组下标不挤占）。`);
