/* v4.11.14 发布轮新增：导出白名单覆盖性测试（防同类缺口复发）。
 *
 * 背景（同类缺口已发生两次，见 release/PUBLIC-REPO-PLAN.md §10.2 与 §12）：
 *   - v4.11.5：tools/build-diagrams.mjs 未登记白名单 → diagrams.test.cjs 在公开仓硬崩；
 *   - v4.11.8：visual-assets.js 未登记白名单 → visual-assets.test.cjs 在公开仓硬崩。
 * 两次都是「私人仓新增了根级代码文件，但 release/export-public-repo.py 的
 * WHITELIST_ROOT_FILES 没同步登记」，且都只能等到发布轮的门禁 B（真实导出目录内
 * 跑测试）才被抓到。本测试把这件事提前到日常 `node tests/*.test.cjs` 就能暴露。
 *
 * 断言的不变量（刻意选宽松口径，避免第二事实源）：
 *   根级**代码/数据文件**（.js .cjs .mjs .css .html .json .py .bat .command）
 *   必须全部登记在导出白名单内；且白名单中同扩展名的条目必须真实存在。
 *
 * 为什么不逐个解析「测试引用了哪些文件」：实测 tests/*.cjs 里有 37 处
 * `path.join(root, 变量)` 形态无法静态求值（循环变量 / 函数参数），
 * 做引用提取只能覆盖约六成，会给出「看似全覆盖」的假保护。
 * 改为钉住根级文件全集这一不变量后，新增根级代码文件必然触发本测试，
 * 覆盖完整且不依赖正则的脆弱度。
 *
 * 公开仓内 release/ 不存在（属排除项）→ 本测试显式跳过：
 * 打印跳过原因、退出码 0，不计入 assertions，不冒充通过（沿用
 * userscript-gm-sync.test.cjs / heavy-lesson.test.cjs 的既有 skip 先例）。
 *
 * 运行：node tests/export-whitelist.test.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const exportScriptPath = path.join(root, 'release', 'export-public-repo.py');

if (!fs.existsSync(exportScriptPath)) {
  console.log(
    'export-whitelist.test.cjs：显式跳过——release/export-public-repo.py 不存在'
    + '（公开仓排除 release/，导出脚本属内部工具），本文件在公开仓内无法校验白名单。'
    + '未冒充通过。');
  process.exit(0);
}

let checks = 0;
const check = label => { checks += 1; return label; };

const CODE_EXTENSIONS = new Set([
  '.js', '.cjs', '.mjs', '.css', '.html', '.json', '.py', '.bat', '.command'
]);

/* ---- 1. 解析导出脚本的根级白名单 ---- */
const scriptSource = fs.readFileSync(exportScriptPath, 'utf8');
function parseList(variableName) {
  const start = scriptSource.indexOf(`${variableName} = [`);
  assert.ok(start > -1, `${variableName} 必须存在于 release/export-public-repo.py`);
  const end = scriptSource.indexOf('\n]', start);
  assert.ok(end > start, `${variableName} 的列表必须以行首 ] 结束`);
  const body = scriptSource.slice(start, end);
  const entries = [];
  for (const m of body.matchAll(/'([^']+)'|"([^"]+)"/g)) entries.push(m[1] ?? m[2]);
  return entries;
}

const whitelistRootFiles = parseList('WHITELIST_ROOT_FILES');
assert.ok(whitelistRootFiles.length > 20,
  check(`WHITELIST_ROOT_FILES 解析正常（${whitelistRootFiles.length} 条，防解析失败后静默放行）`));
const whitelistSet = new Set(whitelistRootFiles);

/* ---- 2. 正向：根级代码/数据文件必须全部在白名单内 ---- */
const rootEntries = fs.readdirSync(root, { withFileTypes: true });
const rootCodeFiles = rootEntries
  .filter(entry => entry.isFile() && CODE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
  .map(entry => entry.name)
  .sort();
assert.ok(rootCodeFiles.length > 20,
  check(`根级代码/数据文件清点正常（${rootCodeFiles.length} 个）`));

const unlisted = rootCodeFiles.filter(name => !whitelistSet.has(name));
assert.deepEqual(unlisted, [],
  check('每个根级代码/数据文件都已登记进导出白名单'
    + (unlisted.length ? `——缺登记：${unlisted.join('、')}（不登记则该文件不在公开仓；若其测试硬读它，'
      + '公开仓内会 ENOENT 硬崩，且只能等发布轮门禁 B 才抓得到）` : '')));

/* ---- 3. 反向：白名单里的代码/数据条目必须真实存在（防改名/删除后残留） ---- */
const staleEntries = whitelistRootFiles.filter(name =>
  CODE_EXTENSIONS.has(path.extname(name).toLowerCase()) && !fs.existsSync(path.join(root, name)));
assert.deepEqual(staleEntries, [],
  check('白名单中的代码/数据条目都真实存在（无改名/删除后的残留条目）'));

console.log(`export-whitelist.test.cjs：全部 ${checks} 项断言通过 ✔`
  + `（根级代码/数据文件 ${rootCodeFiles.length} 个，白名单根级条目 ${whitelistRootFiles.length} 条）`);
