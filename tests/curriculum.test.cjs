/* v4.4 curriculum.js 快照测试（交接 F1/F3/F5 + §13.9/13.10）。
 *
 * curriculum.js 是官方 Full Stack JavaScript Path 的结构快照（纯数据）。
 * 这里钉住三类会真实伤害用户的事：
 *   1. 快照结构完整且自洽（F5：8 course、sections、lessons、总数对得上，
 *      元数据带 snapshotAt 与来源——官方变化时可维护刷新，不是散落硬编码）；
 *   2. Foundations 与 catalog.js 完全一致（两文件不重复存明细，但口径必须同源：
 *      46 课、8 分组、5 个 Project、总数字一致——漂移会让世界地图和目录打架）；
 *   3. 占位红线（F3）：未中文化课程只有 { slug, title, type } 三个字段——
 *      没有任何正文/中文译名/链接字段可以伪装成"已开放内容"。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
let checks = 0;
const check = label => { checks += 1; return label; };

function loadData(file, globalName) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox);
  return JSON.parse(JSON.stringify(sandbox.window[globalName]));
}

const curriculum = loadData('curriculum.js', 'ODIN_CURRICULUM');
const catalog = loadData('catalog.js', 'ODIN_CATALOG');

/* ===================== 1. 快照元数据（F5） ===================== */
{
  assert.equal(curriculum.version, 1, check('快照带版本号'));
  assert.match(curriculum.snapshotAt, /^\d{4}-\d{2}-\d{2}$/, check('snapshotAt 是 YYYY-MM-DD（交接 F5：记录快照日期）'));
  assert.ok(curriculum.source.includes('theodinproject.com'), check('来源 URL 指向官方站点'));
  assert.ok(curriculum.curriculumRepo.includes('github.com/TheOdinProject/curriculum'), check('记录官方 curriculum 仓库（刷新方法的数据源）'));
  assert.ok(typeof curriculum.license === 'string' && curriculum.license.length > 10, check('许可说明在位'));
}

/* ===================== 2. course 结构（F2：官方 Path 层级） ===================== */
{
  assert.equal(curriculum.courses.length, 8, check('官方全路线共 8 个 course/World'));
  curriculum.courses.forEach((course, index) => {
    assert.equal(course.order, index + 1, check(`${course.id}: order 连续且等于数组顺序`));
    assert.ok(typeof course.en === 'string' && course.en.trim(), check(`${course.id}: 有英文原名`));
    assert.ok(typeof course.zh === 'string' && course.zh.trim(), check(`${course.id}: 有本站自译中文名`));
    assert.match(course.url, /^https:\/\/www\.theodinproject\.com\/paths\//, check(`${course.id}: url 指向官方 path 页`));
    assert.ok(Number.isInteger(course.totalLessons) && course.totalLessons > 0, check(`${course.id}: totalLessons 是正整数`));
  });
  /* 官方 FSJS path 的 course 顺序（2026-09-11 快照核验） */
  assert.deepEqual(curriculum.courses.map(c => c.id), [
    'foundations', 'intermediate-html-and-css', 'javascript', 'advanced-html-and-css',
    'react', 'databases', 'nodejs', 'getting-hired'
  ], check('course id 顺序 = 官方路线顺序（Foundations 前置 + FSJS 7 门）'));
  const total = curriculum.courses.reduce((sum, c) => sum + c.totalLessons, 0);
  assert.equal(total, 197, check(`全路线合计 197 课（2026-09-11 官方快照）`));
}

/* ===================== 3. Foundations 与 catalog.js 同源一致 ===================== */
{
  const foundations = curriculum.courses.find(c => c.id === 'foundations');
  assert.equal(foundations.lessonsInCatalog, true, check('Foundations 明细复用 catalog.js（不重复存）'));
  assert.equal(foundations.totalLessons, catalog.lessons.length, check('Foundations 总数与 catalog.js 一致（46）'));
  assert.equal(foundations.totalLessons, 46, check('Foundations 46 课'));
  assert.ok(!foundations.sections, check('Foundations 不重复携带 sections 明细'));
  assert.equal(foundations.url, catalog.courseUrl, check('Foundations 官方 URL 与 catalog.js 一致'));
}

/* ===================== 4. 后续 course 的 sections / lessons 结构 ===================== */
{
  const later = curriculum.courses.filter(c => !c.lessonsInCatalog);
  assert.equal(later.length, 7, check('7 个后续 course 都带结构明细'));
  for (const course of later) {
    assert.ok(Array.isArray(course.sections) && course.sections.length > 0, check(`${course.id}: sections 非空`));
    let lessonCount = 0;
    const slugs = [];
    for (const sec of course.sections) {
      assert.ok(typeof sec.id === 'string' && sec.id.trim(), check(`${course.id}/${sec.id}: section id 非空`));
      assert.ok(typeof sec.en === 'string' && sec.en.trim(), check(`${course.id}/${sec.id}: section 英文原名`));
      assert.ok(typeof sec.zh === 'string' && sec.zh.trim(), check(`${course.id}/${sec.id}: section 本站自译中文名`));
      assert.ok(Array.isArray(sec.lessons) && sec.lessons.length > 0, check(`${course.id}/${sec.id}: lessons 非空`));
      for (const lesson of sec.lessons) {
        /* F3 占位红线：只有三个字段——没有任何正文字段、中文译名字段或链接字段 */
        assert.deepEqual(Object.keys(lesson).sort(), ['slug', 'title', 'type'],
          check(`${course.id}/${lesson.slug}: lesson 只有 slug/title/type 三字段（无正文、无伪装字段）`));
        assert.ok(typeof lesson.slug === 'string' && lesson.slug.trim(), check(`${lesson.slug}: slug 非空`));
        assert.ok(typeof lesson.title === 'string' && lesson.title.trim(), check(`${lesson.slug}: 英文原题非空`));
        assert.ok(['lesson', 'project'].includes(lesson.type), check(`${lesson.slug}: type 合法`));
        slugs.push(lesson.slug);
        lessonCount += 1;
      }
    }
    assert.equal(lessonCount, course.totalLessons, check(`${course.id}: sections 内 lesson 总数 = totalLessons（${lessonCount}）`));
    assert.equal(new Set(slugs).size, slugs.length, check(`${course.id}: course 内 slug 不重复`));
  }
  /* 官方 Project 节点被正确标记（后续路线里项目是重要路标） */
  const projectCount = later.reduce((n, c) => n + c.sections.reduce((m, s) => m + s.lessons.filter(l => l.type === 'project').length, 0), 0);
  assert.ok(projectCount >= 10, check(`后续 course 的官方 Project 节点已标记（实际 ${projectCount} 个）`));
}

console.log(`通过：curriculum.js 官方全路线快照 ${checks} 项断言（快照元数据、8 course 顺序与 197 课总数、Foundations 与 catalog.js 同源、7 个后续 course 的 section/lesson 结构、占位三字段红线）。`);
