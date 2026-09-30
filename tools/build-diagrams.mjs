#!/usr/bin/env node
/* build-diagrams.mjs — 本站原创 SVG 概念图生成器（v4.11.5 交接 3.D）。
 *
 * 定位：**开发期工具，不进运行时**。运行时仍是零构建零依赖——本脚本产出的
 * .svg 是静态文件、入库提交，页面照旧用 <img> 引用（惰性、file:// 双击可用、
 * 不联网，见 app.js「SVG 概念图」注释与 AGENTS.md 红线 1/2/9）。
 * 只有「改了图的数据」时才需要在仓库根目录跑一次：
 *
 *   node tools/build-diagrams.mjs           # 重新生成 assets/diagrams/ 下的生成图
 *   node tools/build-diagrams.mjs --check   # 只比对不写盘（tests/diagrams.test.cjs 同款校验）
 *
 * 纪律：
 *   · 零依赖：只用 node:fs / node:path / node:url / node:vm（vm 仅用于读取
 *     diagrams.js 清单，与测试同一手法）。
 *   · 幂等：布局全部由数据确定性计算（无时间、无随机、坐标取整），连续两次
 *     运行产出字节一致——diagrams.test.cjs 钉住「入库 SVG = 生成器产出」。
 *   · 8 种图型：flow 流程链 / sequence 时序图 / compare 对比（nested 包含、
 *     columns 双栏）/ tree 层级树 / anatomy 解剖标注 / cycle 循环图 /
 *     stack 分层堆叠 / map 概念关系图。
 *   · 配色：中性灰阶 + 单一强调色（PALETTE），不用饱和色——深色主题靠
 *     style.css 的 invert + hue-rotate 近似反相，饱和色反相后会失真。
 *   · 产出必须过 tests/diagrams.test.cjs 全部检查：<svg 开头、width/height 与
 *     viewBox 一致、role="img" + title/desc、系统字体白名单、XML 良构（属性
 *     一律双引号）、无远程引用与脚本、文字为简体中文。
 *   · 文字换行用确定性估算（全角 = 1em、半角 ≈ 0.55em）——SVG 没有自动换行，
 *     也不允许为此引入 canvas/浏览器依赖。
 *
 * 分工：图的**文字与归属**（zhTitle / alt / caption / points / lessonId /
 * sectionIndex）住在 diagrams.js（运行时清单，单一事实源）；本文件只存
 * **图形几何数据**（GEOMETRY_SPECS：图型 + 节点 + 连线 + 文字排布所需内容）。
 * 两份数据由 tests/diagrams.test.cjs 交叉钉住一致性。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const TOOL_DIR = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(TOOL_DIR, '..');

/* 用 vm 读取运行时清单（diagrams.js 是 window 全局脚本，不是 ESM）。 */
export function loadManifest(rootDir = ROOT) {
  const sandbox = { window: {} };
  vm.runInNewContext(readFileSync(join(rootDir, 'diagrams.js'), 'utf8'), sandbox);
  return JSON.parse(JSON.stringify(sandbox.window.ODIN_DIAGRAMS));
}

/* ---------- 配色：中性灰阶 + 单一强调色（与既有手绘图同族的低饱和绿） ---------- */
export const PALETTE = {
  fill: '#f4f5f2',        /* 普通节点底 */
  edge: '#c9cec8',        /* 普通描边 / 生命线 */
  line: '#8b918b',        /* 次级连线（关系辐条等） */
  ink: '#2f3430',         /* 正文 */
  muted: '#68706a',       /* 次要文字 */
  accent: '#276148',      /* 唯一强调色（同既有手绘图） */
  accentFill: '#e8eee9',  /* 强调底 */
  accentEdge: '#a9bcb0',
  chip: '#fbfbfa'         /* 小芯片底 */
};
const FONT_STACK = '"PingFang SC", "Microsoft YaHei", system-ui, sans-serif';

/* ---------- 确定性文本度量与换行 ---------- */
/* 全角区间（CJK 统一表意、圈号①…、CJK 标点「」、全角形式（）等）按 1em，
 * 其余按 0.55em 估算。估算略有偏差没关系：盒宽都留了内边距，换行宁早勿晚。
 * 用 \u 转义而不是字面字符——字面区间在编辑器/编码转换里容易被悄悄改坏。 */
const FULLWIDTH = /[①-⓿⺀-꓏가-힣豈-﫿︰-﹏＀-￯]/;

export function textWidth(text, fontSize) {
  let width = 0;
  for (const char of String(text)) width += FULLWIDTH.test(char) ? fontSize : fontSize * 0.55;
  return width;
}

/* 贪心换行：全角字符逐字成 token，西文按空白切词；行尾不留空格。
 * 两条排版纪律（否则窄盒里会出现「。」独占一行的孤行）：
 *   · 悬挂标点：句读点不允许单独起新行，宁可压线留在上一行；
 *   · 孤字回收：末行只剩 1 个字时并回上一行（允许溢出约一个字的内边距）。 */
const HANGING_PUNCT = /^[、。，；：！？）」』】]$/;

export function wrapText(text, maxWidth, fontSize) {
  const tokens = String(text).match(/[①-⓿⺀-꓏가-힣豈-﫿︰-﹏＀-￯]|[^\s①-⓿⺀-꓏가-힣豈-﫿︰-﹏＀-￯]+|\s+/g) || [];
  const lines = [];
  let current = '';
  for (const token of tokens) {
    const candidate = current + token;
    if (current && textWidth(candidate, fontSize) > maxWidth && !HANGING_PUNCT.test(token)) {
      lines.push(current.replace(/\s+$/, ''));
      current = token.replace(/^\s+/, '');
    } else {
      current = candidate;
    }
  }
  if (current.trim()) lines.push(current.replace(/\s+$/, ''));
  /* 孤行处理：末行过短（单个字或一个短西文词，如换行后只剩「Search」）时，
   * 把上一行的最后一个词整体移下来凑行；整行合并会让内容溢出盒宽（实测踩过）。 */
  if (lines.length > 1 && textWidth(lines[lines.length - 1], fontSize) < fontSize * 2.5) {
    const prev = lines[lines.length - 2];
    const prevWords = prev.split(' ');
    if (prevWords.length > 1) {
      const moved = prevWords.pop();
      lines[lines.length - 2] = prevWords.join(' ').replace(/\s+$/, '');
      lines[lines.length - 1] = moved + ' ' + lines[lines.length - 1];
    } else {
      const prevChars = [...prev];
      const moved = prevChars.pop();
      lines[lines.length - 2] = prevChars.join('');
      lines[lines.length - 1] = moved + lines[lines.length - 1];
    }
  }
  return lines.length ? lines : [''];
}

/* ---------- SVG 基元 ---------- */
const rd = value => Math.round(value);
const esc = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function rect(x, y, w, h, cls, rx = 6) {
  return `  <rect class="${cls}" x="${rd(x)}" y="${rd(y)}" width="${rd(w)}" height="${rd(h)}" rx="${rx}"/>`;
}

function line(x1, y1, x2, y2, cls) {
  return `  <path class="${cls}" d="M${rd(x1)},${rd(y1)} L${rd(x2)},${rd(y2)}"/>`;
}

function arrow(x1, y1, x2, y2, { dashed = false, marker = 'arr', curve = null } = {}) {
  const cls = dashed ? 'dash' : 'edge';
  const d = curve
    ? `M${rd(x1)},${rd(y1)} Q${rd(curve.x)},${rd(curve.y)} ${rd(x2)},${rd(y2)}`
    : `M${rd(x1)},${rd(y1)} L${rd(x2)},${rd(y2)}`;
  return `  <path class="${cls}" d="${d}" marker-end="url(#${marker})"/>`;
}

/* 多行文本块：以 (cx, cy) 为整块文字的视觉中心；anchor 默认居中。 */
function textBlock(cx, cy, lines, cls, { fontSize = 13.5, lineHeight = null, anchor = 'middle' } = {}) {
  const lh = lineHeight === null ? fontSize + 4.5 : lineHeight;
  const firstBaseline = cy - ((lines.length - 1) * lh) / 2 + fontSize * 0.36;
  const spans = lines
    .map((text, index) => (index === 0
      ? `<tspan x="${rd(cx)}">${esc(text)}</tspan>`
      : `<tspan x="${rd(cx)}" dy="${rd(lh)}">${esc(text)}</tspan>`))
    .join('');
  return `  <text class="${cls}" x="${rd(cx)}" y="${rd(firstBaseline)}" text-anchor="${anchor}">${spans}</text>`;
}

/* 左对齐多行文本：x 为左缘，y 为首行基线。 */
function textLines(x, y, lines, cls, { lineHeight = 18 } = {}) {
  const spans = lines
    .map((text, index) => (index === 0
      ? `<tspan x="${rd(x)}">${esc(text)}</tspan>`
      : `<tspan x="${rd(x)}" dy="${lineHeight}">${esc(text)}</tspan>`))
    .join('');
  return `  <text class="${cls}" x="${rd(x)}" y="${rd(y)}" text-anchor="start">${spans}</text>`;
}

/* 注释条：圆角底 + 居中换行文字，返回 { markup, height }。 */
function noteBox(x, y, width, text, { fontSize = 12.5, pad = 12 } = {}) {
  const lines = wrapText(text, width - pad * 2, fontSize);
  const height = lines.length * (fontSize + 5) + pad * 1.4;
  const markup = [
    rect(x, y, width, height, 'note'),
    textBlock(x + width / 2, y + height / 2, lines, 's', { fontSize, lineHeight: fontSize + 5 })
  ].join('\n');
  return { markup, height };
}

const STYLE_BLOCK = `  <style>
    text { font-family: ${FONT_STACK}; fill: ${PALETTE.ink}; }
    .h { font-size: 15px; font-weight: 700; }
    .hb { font-size: 13.5px; font-weight: 700; fill: ${PALETTE.accent}; }
    .b { font-size: 13.5px; }
    .s { font-size: 12.5px; fill: ${PALETTE.muted}; }
    .box { fill: ${PALETTE.fill}; stroke: ${PALETTE.edge}; stroke-width: 1.5; }
    .accentbox { fill: ${PALETTE.accentFill}; stroke: ${PALETTE.accentEdge}; stroke-width: 1.5; }
    .head { fill: ${PALETTE.accentFill}; stroke: ${PALETTE.accent}; stroke-width: 1.5; }
    .chip { fill: ${PALETTE.chip}; stroke: ${PALETTE.edge}; stroke-width: 1.25; }
    .note { fill: ${PALETTE.fill}; stroke: ${PALETTE.edge}; stroke-width: 1.5; }
    .edge { stroke: ${PALETTE.accent}; stroke-width: 2; fill: none; }
    .dash { stroke: ${PALETTE.muted}; stroke-width: 2; fill: none; stroke-dasharray: 5 5; }
    .life { stroke: ${PALETTE.edge}; stroke-width: 1.5; stroke-dasharray: 5 5; fill: none; }
    .spoke { stroke: ${PALETTE.line}; stroke-width: 1.5; fill: none; }
    .divider { stroke: ${PALETTE.edge}; stroke-width: 1.5; fill: none; }
    .outline { fill: none; stroke: ${PALETTE.edge}; stroke-width: 1.5; }
  </style>`;

function defsBlock() {
  return `  <defs>
    <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="${PALETTE.accent}"/>
    </marker>
    <marker id="arrm" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="${PALETTE.muted}"/>
    </marker>
  </defs>`;
}

/* 从盒子中心朝目标点方向，求射线与盒边的出口坐标（连线起止用）。 */
function boxExit(cx, cy, w, h, tx, ty) {
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const halfW = w / 2;
  const halfH = h / 2;
  const scaleX = dx === 0 ? Infinity : halfW / Math.abs(dx);
  const scaleY = dy === 0 ? Infinity : halfH / Math.abs(dy);
  const scale = Math.min(scaleX, scaleY);
  return { x: cx + dx * scale, y: cy + dy * scale };
}

/* ---------- 8 种图型布局：每个返回 { width, height, body } ---------- */

/* 1. flow 流程链：横向盒子 + 箭头；>4 步自动折成两行（第二行左起，肘形连接）。 */
function layoutFlow(spec) {
  const { steps, note } = spec.data;
  const margin = 26;
  const gapX = 52;
  const rowGap = 62;
  const fontSize = 13.5;
  const padX = 12;
  const hasSub = steps.some(step => step.sub);
  const boxH = hasSub ? 62 : 46;
  const labelWidths = steps.map(step => textWidth(step.label, fontSize));
  const boxW = rd(Math.min(152, Math.max(98, Math.max(...labelWidths) + padX * 2)));
  const wrapW = boxW - padX * 2;
  const split = steps.length <= 4 ? steps.length : Math.ceil(steps.length / 2);
  const rows = steps.length <= 4 ? [steps] : [steps.slice(0, split), steps.slice(split)];
  const rowWidths = rows.map(row => row.length * boxW + (row.length - 1) * gapX);
  const width = Math.max(...rowWidths) + margin * 2;
  const parts = [];
  const boxCenters = [];
  let y = margin;
  rows.forEach((row, rowIndex) => {
    const centers = [];
    row.forEach((step, index) => {
      const x = margin + index * (boxW + gapX);
      parts.push(rect(x, y, boxW, boxH, index === row.length - 1 && rowIndex === rows.length - 1 ? 'accentbox' : 'box'));
      const cx = x + boxW / 2;
      if (hasSub) {
        const labelLines = wrapText(step.label, wrapW, fontSize);
        parts.push(textBlock(cx, y + (step.sub ? 24 : boxH / 2), labelLines, 'hb', { fontSize }));
        if (step.sub) {
          const subLines = wrapText(step.sub, wrapW, 12);
          parts.push(textBlock(cx, y + 45, subLines, 's', { fontSize: 12, lineHeight: 15 }));
        }
      } else {
        const labelLines = wrapText(step.label, wrapW, fontSize);
        parts.push(textBlock(cx, y + boxH / 2, labelLines, 'b', { fontSize }));
      }
      centers.push({ cx, x, y });
      if (index > 0) {
        const prev = centers[index - 1];
        parts.push(arrow(prev.x + boxW, y + boxH / 2, x - 7, y + boxH / 2));
      }
    });
    boxCenters.push(centers);
    y += boxH + rowGap;
  });
  /* 两行之间的肘形连接：行1末盒底部 → 下行 → 左行 → 行2首盒顶部 */
  if (rows.length > 1) {
    const last = boxCenters[0][boxCenters[0].length - 1];
    const first = boxCenters[1][0];
    const midY = last.y + boxH + rowGap / 2;
    parts.push(`  <path class="edge" d="M${rd(last.cx)},${rd(last.y + boxH)} L${rd(last.cx)},${rd(midY)} L${rd(first.cx)},${rd(midY)} L${rd(first.cx)},${rd(first.y - 7)}" marker-end="url(#arr)"/>`);
  }
  let height = (rows.length - 1) * (boxH + rowGap) + boxH + margin;
  if (note) {
    const notePart = noteBox(margin, height + 6, width - margin * 2, note);
    parts.push(notePart.markup);
    height += notePart.height + 6 + margin;
  } else {
    height += margin;
  }
  return { width, height, body: parts.join('\n') };
}

/* 2. sequence 时序图：顶部角色盒 + 竖直生命线 + 水平消息箭头 + 底部注释。 */
function layoutSequence(spec) {
  const { actors, messages, note } = spec.data;
  const margin = 24;
  const width = 760;
  const slot = (width - margin * 2) / actors.length;
  const actorX = index => margin + slot * index + slot / 2;
  const parts = [];
  /* 角色头盒：文字换行决定头高 */
  const headLines = actors.map(actor => wrapText(actor, slot - 26, 14));
  const headH = Math.max(...headLines.map(lines => 22 + lines.length * 18));
  const headY = margin;
  actors.forEach((actor, index) => {
    const w = Math.min(slot - 16, Math.max(120, textWidth(actor, 14) + 30, ...headLines[index].map(l => textWidth(l, 14) + 30)));
    parts.push(rect(actorX(index) - w / 2, headY, w, headH, 'head'));
    parts.push(textBlock(actorX(index), headY + headH / 2, headLines[index], 'hb', { fontSize: 14, lineHeight: 18 }));
  });
  /* 消息：固定竖直节奏，标签在箭头上方居中换行 */
  const firstMsgY = headY + headH + 46;
  const msgGap = 58;
  messages.forEach((message, index) => {
    const y = firstMsgY + index * msgGap;
    const x1 = actorX(message.from);
    const x2 = actorX(message.to);
    const labelLines = wrapText(message.label, width - margin * 2 - 40, 12.5);
    parts.push(textBlock((x1 + x2) / 2, y - 12 - ((labelLines.length - 1) * 16) / 2, labelLines, 'b', { fontSize: 12.5, lineHeight: 16 }));
    const dir = x2 > x1 ? 1 : -1;
    parts.push(arrow(x1 + dir * 4, y, x2 - dir * 8, y, { dashed: Boolean(message.dashed), marker: message.dashed ? 'arrm' : 'arr' }));
  });
  const lastMsgY = firstMsgY + (messages.length - 1) * msgGap;
  /* 生命线：头盒底 → 最后一条消息之下 */
  const lifeBottom = lastMsgY + 26;
  actors.forEach((actor, index) => {
    parts.push(`  <path class="life" d="M${rd(actorX(index))},${rd(headY + headH)} L${rd(actorX(index))},${rd(lifeBottom)}"/>`);
  });
  let height = lifeBottom;
  if (note) {
    const notePart = noteBox(margin, height + 14, width - margin * 2, note);
    parts.push(notePart.markup);
    height += notePart.height + 14 + margin;
  } else {
    height += margin;
  }
  return { width, height, body: parts.join('\n') };
}

/* 3a. compare/nested 包含关系：外→内嵌套盒，每层顶部放名称与一句话定义；
 *     outsiders（属于外层不属于内层的事物）画成芯片放在夹层里。 */
function layoutCompareNested(spec) {
  const { layers, outsiders, note } = spec.data;
  if (layers.length !== 3) throw new Error('compare:nested 目前只支持恰好 3 层包含关系');
  const margin = 20;
  const width = 720;
  const insetX = 22;
  const headH = 56; /* 每层顶部留给「名称 + 定义」两行 */
  const parts = [];
  /* 先定横向几何（全部由 width 常量推导），再用真实可用宽度换行、算高度 */
  const outerX = margin;
  const outerY = margin;
  const outerW = width - margin * 2;
  const midX = outerX + insetX;
  const midY = outerY + headH;
  const midW = outerW - insetX * 2;
  const innerX = midX + insetX;
  const innerW = Math.round(midW * 0.58) - insetX;
  const chipX = innerX + innerW + 18;
  const chipW = midX + midW - 16 - chipX;
  /* 各层文字换行（按真实盒宽） */
  const outerDescLines = wrapText(layers[0].desc, outerW - 32, 12.5);
  const midDescLines = wrapText(layers[1].desc, midW - 32, 12.5);
  const inner = layers[2];
  const innerLines = wrapText(inner.desc, innerW - 32, 12.5);
  const headingLines = outsiders ? wrapText(outsiders.heading, chipW, 12.5) : [];
  /* 由内向外算高度 */
  const innerY = midY + headH;
  const innerH = headH + innerLines.length * 17 + 18;
  const chipTopOffset = outsiders ? 10 + headingLines.length * 16 + 6 : 0;
  const chipCount = outsiders ? outsiders.items.length : 0;
  const chipColH = outsiders ? chipTopOffset + chipCount * 42 - 10 + 10 : 0;
  const midContentH = Math.max(innerH, chipColH);
  const midH = headH + midContentH + 18;
  const outerH = headH + midH + 18;
  /* 外层 */
  parts.push(rect(outerX, outerY, outerW, outerH, 'box'));
  parts.push(textLines(outerX + 16, outerY + 24, [layers[0].label], 'hb', { lineHeight: 18 }));
  parts.push(textLines(outerX + 16, outerY + 44, outerDescLines, 's', { lineHeight: 16 }));
  /* 中层 */
  parts.push(rect(midX, midY, midW, midH, 'accentbox'));
  parts.push(textLines(midX + 16, midY + 24, [layers[1].label], 'hb', { lineHeight: 18 }));
  parts.push(textLines(midX + 16, midY + 44, midDescLines, 's', { lineHeight: 16 }));
  /* 内层 */
  parts.push(rect(innerX, innerY, innerW, innerH, 'box'));
  parts.push(textLines(innerX + 16, innerY + 24, [inner.label], 'hb', { lineHeight: 18 }));
  parts.push(textLines(innerX + 16, innerY + 44, innerLines, 's', { lineHeight: 17 }));
  /* 夹层芯片：在中层里、内层外（属于外层、不属于内层的事物） */
  if (outsiders) {
    parts.push(textLines(chipX, innerY + 16, headingLines, 's', { lineHeight: 16 }));
    outsiders.items.forEach((item, index) => {
      const chipY = innerY + chipTopOffset + index * 42;
      const chipBoxW = Math.min(chipW, Math.max(96, textWidth(item, 13) + 28));
      parts.push(rect(chipX, chipY, chipBoxW, 32, 'chip'));
      parts.push(textBlock(chipX + chipBoxW / 2, chipY + 16, [item], 'b', { fontSize: 13 }));
    });
  }
  let height = outerY + outerH;
  if (note) {
    const notePart = noteBox(margin, height + 14, width - margin * 2, note);
    parts.push(notePart.markup);
    height += notePart.height + 14 + margin;
  } else {
    height += margin;
  }
  return { width, height, body: parts.join('\n') };
}

/* 3b. compare/columns 对比双栏：两个列盒（标题带 + 条目行），底部注释。 */
function layoutCompareColumns(spec) {
  const { left, right, note } = spec.data;
  const margin = 22;
  const width = 740;
  const gap = 26;
  const colW = (width - margin * 2 - gap) / 2;
  const fontSize = 13;
  const parts = [];
  const columns = [
    { column: left, x: margin },
    { column: right, x: margin + colW + gap }
  ];
  let maxH = 0;
  columns.forEach(({ column, x }) => {
    const itemLines = column.items.map(item => wrapText(item, colW - 34, fontSize));
    const headH = 40;
    const bodyH = itemLines.reduce((sum, lines) => sum + lines.length * 18 + 12, 0) + 10;
    const h = headH + bodyH;
    maxH = Math.max(maxH, h);
  });
  columns.forEach(({ column, x }) => {
    parts.push(rect(x, margin, colW, maxH, 'box', 8));
    parts.push(`  <path class="divider" d="M${rd(x)},${rd(margin + 40)} L${rd(x + colW)},${rd(margin + 40)}"/>`);
    parts.push(rect(x, margin, colW, 40, 'head', 8));
    parts.push(rect(x, margin + 26, colW, 14, 'head', 0)); /* 补方角遮住头带下圆角 */
    parts.push(`  <path class="divider" d="M${rd(x)},${rd(margin + 40)} L${rd(x + colW)},${rd(margin + 40)}"/>`);
    parts.push(textBlock(x + colW / 2, margin + 20, wrapText(column.title, colW - 20, 14), 'hb', { fontSize: 14 }));
    let y = margin + 40 + 24;
    column.items.forEach(item => {
      const lines = wrapText(item, colW - 34, fontSize);
      parts.push(`  <circle cx="${rd(x + 20)}" cy="${rd(y - 4)}" r="2.5" fill="${PALETTE.accent}"/>`);
      parts.push(textLines(x + 30, y, lines, 'b', { lineHeight: 18 }));
      y += lines.length * 18 + 12;
    });
  });
  let height = margin + maxH;
  if (note) {
    const notePart = noteBox(margin, height + 14, width - margin * 2, note);
    parts.push(notePart.markup);
    height += notePart.height + 14 + margin;
  } else {
    height += margin;
  }
  return { width, height, body: parts.join('\n') };
}

/* 4. tree 层级树：根在上、子层在下，肘形连线；支持任意层子级（数据递归）。 */
function layoutTree(spec) {
  const { root } = spec.data;
  const margin = 26;
  const levelGap = 56;
  const siblingGap = 24;
  const fontSize = 13;
  /* 自底向上：量每个节点的文字与盒宽，并算出子树占位宽度 */
  const measure = node => {
    const lines = wrapText(node.label, 160, fontSize);
    node._lines = lines;
    node._w = rd(Math.min(184, Math.max(96, Math.max(...lines.map(text => textWidth(text, fontSize))) + 24)));
    node._h = 24 + lines.length * 17;
    if (!node.children || !node.children.length) {
      node._span = node._w + siblingGap;
      node._depth = 0;
      return;
    }
    node.children.forEach(measure);
    node._span = Math.max(node._w + siblingGap, node.children.reduce((sum, child) => sum + child._span, 0));
    node._depth = 1 + Math.max(...node.children.map(child => child._depth));
  };
  measure(root);
  const width = Math.max(640, rd(root._span + margin * 2));
  /* 每层的 y：按该层最大盒高递推 */
  const depthMaxH = [];
  const collectHeights = (node, depth) => {
    depthMaxH[depth] = Math.max(depthMaxH[depth] || 0, node._h);
    (node.children || []).forEach(child => collectHeights(child, depth + 1));
  };
  collectHeights(root, 0);
  const levelY = [margin];
  for (let depth = 1; depth <= root._depth; depth += 1) {
    levelY.push(levelY[depth - 1] + depthMaxH[depth - 1] + levelGap);
  }
  /* 自顶向下：节点在自身子树占位里居中 */
  const assign = (node, left, depth) => {
    node._cx = left + node._span / 2;
    node._y = levelY[depth];
    if (node.children && node.children.length) {
      const childrenSpan = node.children.reduce((sum, child) => sum + child._span, 0);
      let childLeft = node._cx - childrenSpan / 2;
      node.children.forEach(child => {
        assign(child, childLeft, depth + 1);
        childLeft += child._span;
      });
    }
  };
  assign(root, (width - root._span) / 2, 0);
  const parts = [];
  const draw = node => {
    (node.children || []).forEach(child => {
      const midY = node._y + node._h + levelGap / 2;
      parts.push(`  <path class="spoke" d="M${rd(node._cx)},${rd(node._y + node._h)} L${rd(node._cx)},${rd(midY)} L${rd(child._cx)},${rd(midY)} L${rd(child._cx)},${rd(child._y - 6)}" marker-end="url(#arr)"/>`);
    });
    parts.push(rect(node._cx - node._w / 2, node._y, node._w, node._h, node === root ? 'accentbox' : 'box'));
    parts.push(textBlock(node._cx, node._y + node._h / 2, node._lines, node === root ? 'hb' : 'b', { fontSize }));
    (node.children || []).forEach(draw);
  };
  draw(root);
  const height = levelY[root._depth] + depthMaxH[root._depth] + margin;
  return { width, height, body: parts.join('\n') };
}

/* 5. anatomy 解剖标注：顶部小流程带（可选）+ 主体横条按 parts 分段 + 分段下方
 *     引出线接注释文字。 */
function layoutAnatomy(spec) {
  const { band, subject, parts: segmentList, callouts } = spec.data;
  const margin = 24;
  const width = 760;
  const parts = [];
  let y = margin;
  /* 顶部小流程带 */
  if (band && band.length) {
    const fontSize = 12.5;
    const gap = 40;
    const boxW = rd(Math.min(160, Math.max(104, Math.max(...band.map(text => textWidth(text, fontSize))) + 22)));
    const totalW = band.length * boxW + (band.length - 1) * gap;
    let x = (width - totalW) / 2;
    band.forEach((text, index) => {
      parts.push(rect(x, y, boxW, 38, 'chip'));
      parts.push(textBlock(x + boxW / 2, y + 19, wrapText(text, boxW - 14, fontSize), 'b', { fontSize }));
      if (index > 0) parts.push(arrow(x - gap + 4, y + 19, x - 7, y + 19));
      x += boxW + gap;
    });
    y += 38 + 40;
  }
  /* 主体标题 */
  parts.push(textBlock(width / 2, y + 10, [subject.label], 'h', { fontSize: 15 }));
  y += 34;
  /* 主体横条：按 parts 分段 */
  const barX = margin;
  const barW = width - margin * 2;
  const barH = 54;
  const weights = segmentList.map(segment => Math.max(1.15, textWidth(segment.label, 13.5) / 13.5));
  const weightSum = weights.reduce((a, b) => a + b, 0);
  let cursorX = barX;
  const segmentCenters = [];
  segmentList.forEach((segment, index) => {
    const segW = index === segmentList.length - 1 ? barX + barW - cursorX : rd((barW * weights[index]) / weightSum);
    parts.push(index === 0 ? rect(cursorX, y, segW, barH, 'accentbox', 6) : `  <rect class="box" x="${rd(cursorX)}" y="${rd(y)}" width="${rd(segW)}" height="${rd(barH)}"/>`);
    parts.push(textBlock(cursorX + segW / 2, y + barH / 2, wrapText(segment.label, segW - 16, 13.5), 'hb', { fontSize: 13.5 }));
    if (index > 0) parts.push(line(cursorX, y, cursorX, y + barH, 'divider'));
    segmentCenters.push({ cx: cursorX + segW / 2, segW });
    cursorX += segW;
  });
  /* 外框统一圆角描边（分段矩形之上再描一圈） */
  parts.push(`  <rect class="outline" x="${rd(barX)}" y="${rd(y)}" width="${rd(barW)}" height="${rd(barH)}" rx="6"/>`);
  y += barH;
  /* 引出线 + 注释：注释列在画布内均布（按分段中心放会让首尾两列伸出画布），
   * 引出线从分段底部先垂直一小段，再折向注释列顶部。 */
  const colW = Math.min(224, (barW - 40) / callouts.length);
  const stepX = callouts.length > 1 ? (barW - colW) / (callouts.length - 1) : 0;
  const leaderTop = y + 6;
  const elbowY = y + 16;
  const textTop = y + 34;
  let maxCalloutH = 0;
  callouts.forEach((callout, index) => {
    const center = segmentCenters[callout.part];
    const ccx = margin + colW / 2 + index * stepX;
    parts.push(`  <path class="spoke" d="M${rd(center.cx)},${rd(leaderTop)} L${rd(center.cx)},${rd(elbowY)} L${rd(ccx)},${rd(elbowY + 12)}"/>`);
    const lines = wrapText(callout.text, colW - 12, 12.5);
    maxCalloutH = Math.max(maxCalloutH, lines.length * 17);
    parts.push(textBlock(ccx, textTop + 10 + ((lines.length - 1) * 17) / 2, lines, 's', { fontSize: 12.5, lineHeight: 17 }));
  });
  const leaderBottom = textTop + maxCalloutH;
  const height = leaderBottom + margin;
  return { width, height, body: parts.join('\n') };
}

/* 6. cycle 循环图：n 个节点均匀分布在椭圆上，相邻节点以微弯箭头首尾相接。 */
function layoutCycle(spec) {
  const { steps, note, numbered = true } = spec.data;
  const margin = 26;
  const width = 720;
  const n = steps.length;
  const rx = 238;
  const ry = 168;
  const fontSize = 13;
  const CIRCLED = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫';
  const nodes = steps.map((step, index) => {
    const label = numbered ? `${CIRCLED[index] || index + 1} ${step.label}` : step.label;
    const lines = wrapText(label, 140, fontSize);
    const w = rd(Math.min(172, Math.max(104, Math.max(...lines.map(l => textWidth(l, fontSize))) + 24)));
    const h = step.sub ? 58 : 24 + lines.length * 17;
    const angle = (-90 + (360 / n) * index) * (Math.PI / 180);
    return { ...step, label, lines, w, h, cx: width / 2 + rx * Math.cos(angle), cy: 0, angle };
  });
  const maxH = Math.max(...nodes.map(node => node.h));
  const height = (ry + maxH / 2 + margin) * 2 + (note ? 70 : 0);
  const cy = height / 2 - (note ? 30 : 0);
  nodes.forEach(node => { node.cy = cy + ry * Math.sin(node.angle); });
  const parts = [];
  nodes.forEach((node, index) => {
    const next = nodes[(index + 1) % n];
    const start = boxExit(node.cx, node.cy, node.w + 10, node.h + 8, next.cx, next.cy);
    const end = boxExit(next.cx, next.cy, next.w + 14, next.h + 12, node.cx, node.cy);
    const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
    const control = { x: mid.x + (width / 2 - mid.x) * 0.28, y: mid.y + (cy - mid.y) * 0.28 };
    parts.push(arrow(start.x, start.y, end.x, end.y, { curve: control }));
  });
  nodes.forEach(node => {
    parts.push(rect(node.cx - node.w / 2, node.cy - node.h / 2, node.w, node.h, 'box'));
    if (node.sub) {
      parts.push(textBlock(node.cx, node.cy - 9, node.lines, 'hb', { fontSize }));
      parts.push(textBlock(node.cx, node.cy + 15, wrapText(node.sub, node.w - 14, 11.5), 's', { fontSize: 11.5, lineHeight: 14 }));
    } else {
      parts.push(textBlock(node.cx, node.cy, node.lines, 'b', { fontSize }));
    }
  });
  let finalHeight = height;
  if (note) {
    const notePart = noteBox(margin, cy + ry + maxH / 2 + 20, width - margin * 2, note);
    parts.push(notePart.markup);
    finalHeight = cy + ry + maxH / 2 + 20 + notePart.height + margin;
  }
  return { width, height: rd(finalHeight), body: parts.join('\n') };
}

/* 7. stack 分层堆叠：数组第一项画在最上层（离用户最近），自上而下堆叠。 */
function layoutStack(spec) {
  const { layers, note } = spec.data;
  const margin = 26;
  const width = 700;
  const gap = 10;
  const fontSize = 13.5;
  const parts = [];
  let y = margin;
  let maxLayerH = 0;
  layers.forEach((layer, index) => {
    const descLines = layer.desc ? wrapText(layer.desc, width - 260, 12.5) : [];
    const labelLines = wrapText(layer.label, 210, fontSize);
    const h = Math.max(48, 20 + Math.max(labelLines.length * 18, descLines.length * 17));
    maxLayerH = Math.max(maxLayerH, h);
    parts.push(rect(margin, y, width - margin * 2, h, index === 0 ? 'accentbox' : 'box'));
    parts.push(textBlock(margin + 120, y + h / 2, labelLines, 'hb', { fontSize }));
    if (descLines.length) {
      parts.push(textBlock(margin + 250 + (width - margin * 2 - 250) / 2, y + h / 2, descLines, 's', { fontSize: 12.5, lineHeight: 17 }));
    }
    y += h + gap;
  });
  let height = y - gap;
  if (note) {
    const notePart = noteBox(margin, height + 14, width - margin * 2, note);
    parts.push(notePart.markup);
    height += notePart.height + 14 + margin;
  } else {
    height += margin;
  }
  void maxLayerH;
  return { width, height, body: parts.join('\n') };
}

/* 8. map 概念关系图：中心主题 + 环绕卫星盒（标题 + 一句话定义），辐条连线。 */
function layoutMap(spec) {
  const { center, satellites } = spec.data;
  const margin = 20;
  const satW = 228;
  const fontSize = 12.5;
  const sats = satellites.map((satellite, index, all) => {
    const descLines = wrapText(satellite.desc, satW - 22, fontSize);
    const h = 34 + descLines.length * 17 + 8;
    const angle = (-90 + (360 / all.length) * index) * (Math.PI / 180);
    return { ...satellite, descLines, h, angle };
  });
  const maxSatH = Math.max(...sats.map(sat => sat.h));
  const rx = Math.round(satW / 2 + 118);
  const ry = Math.round(maxSatH / 2 + 128);
  const centerLines = wrapText(center.label, 210, 15);
  const centerSubLines = center.sub ? wrapText(center.sub, 210, 12) : [];
  const centerW = rd(Math.max(180, Math.max(...centerLines.map(l => textWidth(l, 15))) + 40));
  const centerH = 30 + centerLines.length * 19 + centerSubLines.length * 16 + 8;
  const width = (rx + satW / 2 + margin) * 2;
  const height = (ry + maxSatH / 2 + margin) * 2;
  const cx = width / 2;
  const cy = height / 2;
  const parts = [];
  /* 先画辐条（被盒子盖住端点） */
  sats.forEach(sat => {
    const sx = cx + rx * Math.cos(sat.angle);
    const sy = cy + ry * Math.sin(sat.angle);
    const from = boxExit(cx, cy, centerW, centerH, sx, sy);
    const to = boxExit(sx, sy, satW, sat.h, cx, cy);
    parts.push(line(from.x, from.y, to.x, to.y, 'spoke'));
    sat.sx = sx;
    sat.sy = sy;
  });
  /* 中心盒 */
  parts.push(rect(cx - centerW / 2, cy - centerH / 2, centerW, centerH, 'accentbox', 10));
  parts.push(textBlock(cx, cy - (centerSubLines.length ? centerSubLines.length * 8 : 0), centerLines, 'hb', { fontSize: 15, lineHeight: 19 }));
  if (centerSubLines.length) {
    parts.push(textBlock(cx, cy + centerLines.length * 9, centerSubLines, 's', { fontSize: 12, lineHeight: 16 }));
  }
  /* 卫星盒 */
  sats.forEach(sat => {
    parts.push(rect(sat.sx - satW / 2, sat.sy - sat.h / 2, satW, sat.h, 'box'));
    parts.push(textBlock(sat.sx, sat.sy - sat.h / 2 + 18, [sat.label], 'hb', { fontSize: 13.5 }));
    parts.push(textBlock(sat.sx, sat.sy - sat.h / 2 + 34 + ((sat.descLines.length - 1) * 17) / 2, sat.descLines, 's', { fontSize, lineHeight: 17 }));
  });
  return { width: rd(width), height: rd(height), body: parts.join('\n') };
}

const LAYOUTS = {
  flow: layoutFlow,
  sequence: layoutSequence,
  'compare:nested': layoutCompareNested,
  'compare:columns': layoutCompareColumns,
  tree: layoutTree,
  anatomy: layoutAnatomy,
  cycle: layoutCycle,
  stack: layoutStack,
  map: layoutMap
};

function layoutKey(spec) {
  if (spec.type === 'compare') return `compare:${spec.data.mode || 'columns'}`;
  return spec.type;
}

/* ---------- 组装完整 SVG（entry 来自 diagrams.js，spec 来自 GEOMETRY_SPECS） ---------- */
export function buildSvg(entry, spec) {
  const layout = LAYOUTS[layoutKey(spec)];
  if (!layout) throw new Error(`未知图型：${spec.type}（${spec.id}）`);
  const { width, height, body } = layout(spec);
  const w = rd(width);
  const h = rd(height);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="t-${entry.id} d-${entry.id}">
  <title id="t-${entry.id}">${esc(entry.zhTitle)}</title>
  <desc id="d-${entry.id}">${esc(entry.alt)}</desc>
${defsBlock()}
${STYLE_BLOCK}

${body}
</svg>
`;
}

/* ---------- 图形几何数据（第 6 课试点，交接 3.E） ----------
 * 内容与 lessons.js 第 6 课（how-does-the-web-work）各章正文逐段核对后编写；
 * id / file / lessonId / sectionIndex 必须与 diagrams.js 清单一致（测试钉住）。 */
export const GEOMETRY_SPECS = [
  {
    id: 'network-internet-web',
    file: 'network-internet-web.svg',
    lessonId: 'how-does-the-web-work',
    sectionIndex: 1,
    type: 'compare',
    data: {
      mode: 'nested',
      layers: [
        { label: '网络（network）', desc: '把多台设备互联起来，让它们能互相通信——你家的手机、电脑、路由器就是一个小网络' },
        { label: '互联网（internet）', desc: '把全世界无数小网络连接成一个超大网络，跨城市、跨国通信；本义就是「网络之间」' },
        { label: 'Web（万维网）', desc: '建立在互联网之上的一种服务：网页通过它提供' }
      ],
      outsiders: { heading: '同样跑在互联网上：', items: ['电子邮件', '文件传输'] },
      note: 'Web 不等于互联网：它只是互联网上的一种服务。分清三层包含关系，是建立正确心智模型的第一步。'
    }
  },
  {
    id: 'home-to-server-route',
    file: 'home-to-server-route.svg',
    lessonId: 'how-does-the-web-work',
    sectionIndex: 3,
    type: 'flow',
    data: {
      steps: [
        { label: '你家设备', sub: '数据包出发' },
        { label: '家用路由器', sub: '决定下一跳' },
        { label: 'ISP 运营商', sub: '接入互联网' },
        { label: '沿途路由器', sub: '逐跳接力转发' },
        { label: '目标服务器', sub: '收到请求' }
      ],
      note: '网络上每台设备都靠 IP 地址定位——就像寄快递要写收件地址；路由器像一个个路口，只看数据包上的目标地址决定下一跳往哪边走。'
    }
  },
  {
    id: 'packet-anatomy',
    file: 'packet-anatomy.svg',
    lessonId: 'how-does-the-web-work',
    sectionIndex: 4,
    type: 'anatomy',
    data: {
      band: ['完整文件', '拆成许多数据包', '各自独立寻路', '到达后按序重组'],
      subject: { label: '一个数据包（packet）' },
      parts: [
        { label: '序号' },
        { label: '目标 IP 地址' },
        { label: '数据片段' }
      ],
      callouts: [
        { part: 0, text: '这个包是文件的第几片；到达后按序号重组还原' },
        { part: 1, text: '包要送去哪里；不同包可能走不同路线、到达顺序可能打乱' },
        { part: 2, text: '原文件的一小份内容；丢失或损坏只需重传这一个包' }
      ]
    }
  },
  {
    id: 'client-server-roles',
    file: 'client-server-roles.svg',
    lessonId: 'how-does-the-web-work',
    sectionIndex: 5,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '客户端 · 发出请求的一方',
        items: [
          '发出请求（request）：「请把这个页面给我」',
          '最常见的是浏览器；手机 App、命令行工具也算',
          '收到响应后，把它渲染成你看到的页面'
        ]
      },
      right: {
        title: '服务器 · 提供服务的一方',
        items: [
          '长期运行的专用机器，随时等待请求',
          '存储网页文件与数据',
          '收到请求后处理，把内容作为响应（response）发回'
        ]
      },
      note: '点餐比方：客户端点单，服务器上菜。两个角色是相对的——同一台设备在这次通信里是客户端，在另一次通信里可能就是服务器。'
    }
  },
  {
    id: 'five-web-concepts',
    file: 'five-web-concepts.svg',
    lessonId: 'how-does-the-web-work',
    sectionIndex: 6,
    type: 'map',
    data: {
      center: { label: '五个最容易混淆的概念', sub: '官方指定文章逐个区分' },
      satellites: [
        { label: '网页（web page）', desc: '一个可以在浏览器里显示的文档；你现在读的每一页都是' },
        { label: '网站（website）', desc: '许多网页的集合，通常挂在同一个域名下' },
        { label: 'Web 服务器（web server）', desc: '存储网页、收到请求就把它们发出去的软件与机器' },
        { label: '浏览器（web browser）', desc: '发出请求、接收页面文件并渲染成可见页面的软件，如 Chrome、Firefox' },
        { label: '搜索引擎（search engine）', desc: '帮你查找网页的服务，如 Google Search' }
      ]
    }
  },
  {
    id: 'dns-resolution',
    file: 'dns-resolution.svg',
    lessonId: 'how-does-the-web-work',
    sectionIndex: 7,
    type: 'sequence',
    data: {
      actors: ['你的浏览器', 'DNS 解析器（通讯录）', '权威服务器（总登记处）'],
      messages: [
        { from: 0, to: 1, label: '① www.example.com 的 IP 是多少？（浏览器与系统缓存都没查到才来问）' },
        { from: 1, to: 2, label: '② 没有现成答案时层层查询：根域名服务器 → 顶级域服务器 → 权威服务器' },
        { from: 2, to: 1, label: '③ 该域名对应的 IP 是 93.184.216.34', dashed: true },
        { from: 1, to: 0, label: '④ 把 IP 返回给浏览器，并沿途缓存，下次不必重查', dashed: true }
      ],
      note: '⑤ 浏览器拿到 IP 之后，才向服务器发出真正的页面请求（完整链路见上一章的时序图）。DNS 就是互联网的通讯录：你记住的是名字，网络定位设备要靠查出来的 IP 号码。'
    }
  },
  /* ---------- v4.11.6（交接 §3.4）：按章配图精简铺开，新增 33 张 ----------
   * 判据住 LESSON-PAGE-GUIDE.md 第 4 节（概念形态 / 使用频次 / 是否重复 /
   * 比喻类 / 对「坚持」五条）；图型只用既有 8 种，零图型库扩展。
   * 内容逐段对照 lessons.js 对应章正文编写，sectionIndex 即章节下标（0-based）。
   * 文字纪律：SVG 里不得出现 href="http…" 形态的字面量（diagrams.test 的
   * 远程引用扫描按源码正则匹配，教学示例一律用「目的地地址」占位或裸域名文字）。 */
  {
    id: 'lesson-structure-tree',
    file: 'lesson-structure-tree.svg',
    lessonId: 'how-this-course-will-work',
    sectionIndex: 1,
    type: 'tree',
    data: {
      root: {
        label: 'TOP 的一课（聚合式结构）',
        children: [
          { label: '主题介绍与背景' },
          {
            label: '外部资料 = 正课本身',
            children: [
              { label: 'MDN 等文章' },
              { label: 'YouTube 等视频' },
              { label: '官方文档' }
            ]
          },
          { label: 'Assignment（必做任务）' },
          { label: 'Exercise（部分课有）' }
        ]
      }
    }
  },
  {
    id: 'frontend-backend-fullstack',
    file: 'frontend-backend-fullstack.svg',
    lessonId: 'introduction-to-web-development',
    sectionIndex: 1,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '前端（front end）',
        items: [
          '你在浏览器里看到的网站内容：呈现方式与界面元素（如导航栏）',
          '工具：HTML、CSS、JavaScript 及相关框架',
          '职责：内容有效呈现、用户获得优秀的使用体验'
        ]
      },
      right: {
        title: '后端（back end）',
        items: [
          '应用的「内脏」，住在服务器上',
          '存储并提供程序数据，确保前端拿到它需要的东西',
          '工具：Java、Python、Ruby、JavaScript 等语言；用户量大时非常复杂'
        ]
      },
      note: '全栈（full stack）= 前端和后端都能上手。官方在这里给了明确答案：TOP 教的是全栈开发，覆盖网页开发的各个方面。'
    }
  },
  {
    id: 'tools-learning-map',
    file: 'tools-learning-map.svg',
    lessonId: 'introduction-to-web-development',
    sectionIndex: 4,
    type: 'flow',
    data: {
      steps: [
        { label: '文本编辑器', sub: '第 8 课上手上' },
        { label: '命令行', sub: '第 9 课学' },
        { label: 'Git 与 GitHub', sub: '第 10–12 课学' },
        { label: '搜索 / Stack Overflow', sub: '遇到问题反复用' }
      ],
      note: '现在只需先认个脸：知道这些工具存在、各自解决什么问题。真正的熟练来自后面一课一课地用，不必先去自学一遍。'
    }
  },
  {
    id: 'focus-diffuse-modes',
    file: 'focus-diffuse-modes.svg',
    lessonId: 'motivation-and-mindset',
    sectionIndex: 1,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '专注模式（focus mode）',
        items: [
          '你有意识地在学习',
          '阅读、看视频、做项目',
          '注意力直接对着学习材料'
        ]
      },
      right: {
        title: '发散模式（diffuse mode）',
        items: [
          '潜意识在工作：你没有主动学习的时候',
          '发生在洗碗、运动、睡觉时',
          '把正在学的和已经知道的东西连接起来——突破往往在这里发生'
        ]
      },
      note: '官方学习观三步：理解它、练习它、最后把它讲给别人听（understand it, practice it, teach it）。学习时大脑在两种模式之间不断切换。'
    }
  },
  {
    id: 'stuck-three-tools',
    file: 'stuck-three-tools.svg',
    lessonId: 'motivation-and-mindset',
    sectionIndex: 3,
    type: 'flow',
    data: {
      steps: [
        { label: '卡住了', sub: '概念理解不了 / 项目不正常' },
        { label: '① 去研究', sub: '一定有人在你之前遇到过' },
        { label: '② 休息一下', sub: '让发散模式去处理' },
        { label: '③ 到 Discord 求助', sub: '带着你做过的研究去问' }
      ],
      note: '官方说你一定会在某个点卡住。求助时带着自己做过的研究——当别人看到你已经自己下过功夫，会更愿意帮你。'
    }
  },
  {
    id: 'problem-solving-loop',
    file: 'problem-solving-loop.svg',
    lessonId: 'motivation-and-mindset',
    sectionIndex: 4,
    type: 'cycle',
    data: {
      steps: [
        { label: '做这一课' },
        { label: '练习这个概念' },
        { label: '研究和试验', sub: '不知道怎么解决时' },
        { label: '寻求指导', sub: '研究过仍没头绪时' },
        { label: '指导讲得通吗', sub: '讲通回练习；不通重做本课' }
      ],
      note: '不管走哪个分支，最终都回到「练习这个概念」。这套流程防止你在「重看课程」和「直接放弃」之间二选一——它总是把你推回动手。'
    }
  },
  {
    id: 'two-question-principles',
    file: 'two-question-principles.svg',
    lessonId: 'asking-for-help',
    sectionIndex: 2,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '原则一 · 永远提供代码和上下文',
        items: [
          '给出代码、错误消息、终端命令、服务器输出等相关细节',
          '把问题收敛到具体的点：某个函数、某个行号',
          '不带上下文的代价：大量不必要的来回，答案仍解决不了问题',
          '例外：概念性问题就在问题里说明清楚'
        ]
      },
      right: {
        title: '原则二 · 问手头的问题，不问解法',
        items: [
          '别问「作业 Step 5 该怎么做」——想出解法思路是学习旅程必不可少的一部分',
          '更好的问法：「我在试着返回胜者字符串，但第 12 行报语法错误，怎么修？这是我的代码」',
          '好处：别人知道你试过什么，能针对你当前这版代码调试，而不是让你从头重来'
        ]
      },
      note: '两条原则同一个内核：把你的尝试和卡点亮出来，别人才帮得到「当前版本的你」。'
    }
  },
  {
    id: 'before-asking-three-steps',
    file: 'before-asking-three-steps.svg',
    lessonId: 'join-the-odin-community',
    sectionIndex: 2,
    type: 'flow',
    data: {
      steps: [
        { label: '停下来喘口气', sub: '拆成小块，找到真正阻碍（橡皮鸭调试法）' },
        { label: '用搜索引擎找信息', sub: '也回头翻之前的课程找工具' },
        { label: '仍无解法 → 社区求助', sub: '去 Odin Discord' }
      ],
      note: '有时问题出在你的思路（approach）上，而不是代码上——对自己要往哪里去有大致想法，在提问时特别重要。'
    }
  },
  {
    id: 'question-context-anatomy',
    file: 'question-context-anatomy.svg',
    lessonId: 'join-the-odin-community',
    sectionIndex: 3,
    type: 'anatomy',
    data: {
      band: ['别问「能不能问」', '直接把问题问出来', '更快得到答案'],
      subject: { label: '一个合格提问的五项上下文（don’t ask to ask）' },
      parts: [
        { label: '问题是什么' },
        { label: '期望发生什么' },
        { label: '实际发生什么' },
        { label: '怎么走到这步' },
        { label: '试过什么' }
      ],
      callouts: [
        { part: 0, text: 'What do you think the problem is?' },
        { part: 1, text: 'What exactly do you want to happen?' },
        { part: 2, text: 'What is actually happening?' },
        { part: 3, text: 'How did you get there?' },
        { part: 4, text: 'What have you tried so far?' }
      ]
    }
  },
  {
    id: 'skip-this-lesson',
    file: 'skip-this-lesson.svg',
    lessonId: 'installations',
    sectionIndex: 1,
    type: 'flow',
    data: {
      steps: [
        { label: '判断① 操作系统', sub: 'macOS / Ubuntu / 官方风味版？' },
        { label: '判断② 浏览器', sub: 'Google Chrome 装好了？' },
        { label: '都是 → 跳过这一课', sub: '任一否 → 按说明搭建环境' }
      ],
      note: '已经符合条件还重装一遍环境，是这一课最常见的无谓折腾。Assignment 里重复了同一个判断：不是受支持系统才需要跟安装说明走。'
    }
  },
  {
    id: 'four-setup-options',
    file: 'four-setup-options.svg',
    lessonId: 'installations',
    sectionIndex: 6,
    type: 'flow',
    data: {
      steps: [
        { label: 'VirtualBox 虚拟机', sub: '官方推荐给初学者：像普通程序一样装，不喜欢可移除' },
        { label: '双系统', sub: '全部硬件资源、快得多；改动分区有风险，仔细按说明做' },
        { label: 'ChromeOS / Flex', sub: 'Chromebook 或旧硬件用户' },
        { label: 'WSL2（高级）', sub: 'Windows 内直接跑 Linux；两系统缺视觉分隔，不推荐初学者' }
      ],
      note: '读完这一切还是不确定选哪个？官方推荐 VirtualBox，有非常清晰的分步说明。不要试着把来自其他来源的说明混着用。WSL2 不等于 WSL1，TOP 只支持 WSL2。'
    }
  },
  {
    id: 'word-vs-plaintext',
    file: 'word-vs-plaintext.svg',
    lessonId: 'text-editors',
    sectionIndex: 1,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '富文本编辑器（Word / Writer）',
        items: [
          '很适合写一篇文章、制作漂亮格式化文档',
          '文件里嵌入的不只是文字：还有「怎样在屏幕上显示这些文字」的信息',
          '还包含「怎样显示文档中嵌入图形」的数据',
          '这些额外信息让解释器无法把文件当代码读取'
        ]
      },
      right: {
        title: '纯文本编辑器（VSCode / Sublime）',
        items: [
          '不保存任何额外信息，只保存文字',
          '其他程序——比如 Ruby 的解释器——能把文件当作代码读取并执行',
          '写代码必须用它'
        ]
      },
      note: '恰恰是那些让富文本编辑器擅长漂亮文档的功能，使它们不适合写代码。'
    }
  },
  {
    id: 'prompt-anatomy',
    file: 'prompt-anatomy.svg',
    lessonId: 'command-line-basics',
    sectionIndex: 2,
    type: 'anatomy',
    data: {
      band: ['打开终端', '大部分空白', '只有一行文字'],
      subject: { label: '终端里那一行文字的解剖' },
      parts: [
        { label: 'alex@ubuntu:~/Documents' },
        { label: '$（提示符）' },
        { label: 'whoami（你输入的命令）' }
      ],
      callouts: [
        { part: 0, text: '谁@哪台机器:当前目录——告诉你「我在哪」' },
        { part: 1, text: '提示符表示终端在等你输入命令。Linux 与旧 Mac 是 $，较新 Mac 是 %，一回事' },
        { part: 2, text: '输入命令按 Enter 执行；whoami 返回你的用户名' }
      ]
    }
  },
  {
    id: 'tab-completion',
    file: 'tab-completion.svg',
    lessonId: 'command-line-basics',
    sectionIndex: 6,
    type: 'flow',
    data: {
      steps: [
        { label: '输入 cd D 按 Tab', sub: '主目录常有 Documents 和 Downloads' },
        { label: '列出所有匹配', sub: '终端告诉你它不确定你要哪一个' },
        { label: '再输一点按 Tab', sub: '匹配唯一 → 替你补全名字' }
      ],
      note: '官方例子：一条完整路径最少可以只敲 cd Doc[tab]O[tab]f[tab]j[tab]cal[tab]（取决于你电脑上还存在哪些别的文件夹）。试一下，你会爱上它的。'
    }
  },
  {
    id: 'git-vs-github',
    file: 'git-vs-github.svg',
    lessonId: 'setting-up-git',
    sectionIndex: 0,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: 'Git',
        items: [
          '一个非常流行的版本控制系统（version control system）',
          '是软件，装在你自己的电脑上',
          '整套 TOP 里你会对它变得非常熟悉——后面有很多专门讲 Git 的课'
        ]
      },
      right: {
        title: 'GitHub',
        items: [
          '一个服务（网站）',
          '让你能用 Git 上传、托管和管理你的代码',
          '提供一个好用的网页界面'
        ]
      },
      note: '官方特别强调：虽然 GitHub 和 Git 听起来很像，它们并不是同一个东西，甚至不是由同一家公司创建的。'
    }
  },
  {
    id: 'git-identity-config',
    file: 'git-identity-config.svg',
    lessonId: 'setting-up-git',
    sectionIndex: 5,
    type: 'anatomy',
    data: {
      band: ['让本地 Git 用户和 GitHub 关联', '团队里能看到每行代码是谁提交的', '配完用 --get 验证'],
      subject: { label: '告诉 Git 你是谁的三条配置' },
      parts: [
        { label: 'git config --global user.name' },
        { label: 'git config --global user.email' },
        { label: 'git config --global init.defaultBranch main' }
      ],
      callouts: [
        { part: 0, text: '引号里填你自己的名字（保留引号本身）' },
        { part: 1, text: 'GitHub 上选了邮箱私有的话，用专用私有邮箱，形如 123456789+odin@users.noreply.github.com' },
        { part: 2, text: 'GitHub 已把新仓库默认分支从 master 改成 main，这条命令让 Git 跟上' }
      ]
    }
  },
  {
    id: 'ssh-key-pair',
    file: 'ssh-key-pair.svg',
    lessonId: 'setting-up-git',
    sectionIndex: 7,
    type: 'map',
    data: {
      center: { label: 'SSH 密钥对', sub: '标识你这台机器的「超长密码」' },
      satellites: [
        { label: '私钥 id_ed25519', desc: '留在你自己电脑上，绝不交给任何人；passphrase 用来加密它' },
        { label: '公钥 id_ed25519.pub', desc: '交给 GitHub（下一步），GitHub 用它认出你这台机器、允许上传' },
        { label: 'ssh-keygen -t ed25519', desc: '生成密钥对的命令；保存位置直接按 Enter；passphrase 愿意就设，不是必需' },
        { label: '先检查是否已有', desc: 'ls ~/.ssh/id_ed25519.pub：出现 No such file or directory 才需要新建' },
        { label: '多台机器多对密钥', desc: 'GitHub 允许一个账号关联多个密钥对；每台机器单独设置一对' }
      ]
    }
  },
  {
    id: 'git-save-vs-editor-save',
    file: 'git-save-vs-editor-save.svg',
    lessonId: 'introduction-to-git',
    sectionIndex: 1,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '文本编辑器的保存',
        items: [
          '一次保存 = 把文档所有文字记录成单个文件',
          '只有一个文件记录，比如 essay.doc',
          '想要历史只能自己做副本：essay-draft1、draft2、final——很难记得做、很难追踪'
        ]
      },
      right: {
        title: 'Git 的保存',
        items: [
          '一次保存记录的是文件和文件夹的差异',
          '保留每一次保存的历史记录',
          '历史是系统自动记录的、可以回看和恢复的一串状态——官方评价：game changer'
        ]
      },
      note: '差别的关键：副本方案里「历史」是一堆自己命名、彼此无关的文件；Git 方案里不需要靠文件名去记「哪一版才是最终版」。'
    }
  },
  {
    id: 'staging-waiting-room',
    file: 'staging-waiting-room.svg',
    lessonId: 'git-basics',
    sectionIndex: 7,
    type: 'stack',
    data: {
      layers: [
        { label: 'git commit 快照', desc: '把等候室里的全部改动打包成一个快照，进入本地仓库历史' },
        { label: '暂存区（等候室）', desc: 'git add 文件名 把挑出的改动请进来；git add . 请进当前目录及全部子目录的改动' },
        { label: '工作区的改动', desc: '你编辑的文件，改动还没有被请进等候室' }
      ],
      note: '两步提交的好处：改了很多文件时，可以挑一部分一起提交，其余留到下次——「原子提交」最佳实践正是建立在这个机制上。'
    }
  },
  {
    id: 'git-command-anatomy',
    file: 'git-command-anatomy.svg',
    lessonId: 'git-basics',
    sectionIndex: 13,
    type: 'anatomy',
    data: {
      band: ['git | add | .', 'git | commit -m | "message"', 'git | status |（无目标）'],
      subject: { label: 'git push origin main = program | action | destination' },
      parts: [
        { label: 'git（program）' },
        { label: 'push（action）' },
        { label: 'origin main（destination）' }
      ],
      callouts: [
        { part: 0, text: '程序永远是 git' },
        { part: 1, text: '动作：push 上传 / add 暂存 / commit 记录 / status 查看' },
        { part: 2, text: '目标：origin 远端 + main 分支；add . 的句点 = 当前目录所有内容' }
      ]
    }
  },
  {
    id: 'atomic-commits',
    file: 'atomic-commits.svg',
    lessonId: 'git-basics',
    sectionIndex: 14,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '原子提交（官方推荐）',
        items: [
          '一次提交只包含与一个功能或一个任务相关的改动',
          '某个改动被证明造成问题时，只回退这个具体改动，不牵连其他',
          '每条提交消息只讲清楚一件事，未来的协作者一看就懂'
        ]
      },
      right: {
        title: '混在一起的提交',
        items: [
          '一次提交混入多个不相关的改动',
          '出问题时无法只回退其中某一个改动',
          '消息要一次讲清多件事，几个月后的自己也难回看'
        ]
      },
      note: 'Git 不只在与他人协作时有用——独立工作时同样重要：将来回看旧代码，你会越来越依赖自己留下的提交历史。'
    }
  },
  {
    id: 'semantic-html',
    file: 'semantic-html.svg',
    lessonId: 'elements-and-tags',
    sectionIndex: 4,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '用对标签（语义化 HTML）',
        items: [
          '写标签前先想「这段内容是什么」：段落、标题还是列表',
          '搜索引擎靠标签理解页面内容的结构——影响搜索排名',
          '屏幕阅读器等辅助技术靠标签「听」懂页面——影响可访问性'
        ]
      },
      right: {
        title: '用错标签的代价',
        items: [
          '页面看起来可能一样，但内容语义丢了',
          '搜索引擎读不懂结构，排名受损',
          '依赖辅助技术的用户无法理解页面'
        ]
      },
      note: '标签的价值不在让页面上的字好看，而在让所有读页面的「人」和程序都明白这段内容是什么。这个习惯课程后面会深入展开。'
    }
  },
  {
    id: 'newline-vs-paragraph',
    file: 'newline-vs-paragraph.svg',
    lessonId: 'working-with-text',
    sectionIndex: 1,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '源代码里的换行',
        items: [
          '浏览器遇到 HTML 里的换行，会把它们压缩成一个单独的空格',
          '结果：所有文字挤成一长行',
          '看起来像两段 ≠ 显示成两段（官方反直觉例子）'
        ]
      },
      right: {
        title: '<p> 段落元素',
        items: [
          '用一个 <p> 标签把文字内容包起来',
          '浏览器在每个段落之后添加一个新行',
          '想在 HTML 里创建段落，就需要使用段落元素'
        ]
      },
      note: '官方例子：空行隔开的两段文字被浏览器压成一长行；改成 p 元素包起来，问题就解决了。'
    }
  },
  {
    id: 'heading-levels',
    file: 'heading-levels.svg',
    lessonId: 'working-with-text',
    sectionIndex: 2,
    type: 'tree',
    data: {
      root: {
        label: 'h1：整个页面的标题',
        children: [
          {
            label: 'h2：大部分内容的标题',
            children: [
              { label: 'h3：较大部分的标题' },
              { label: 'h3：另一个较大部分（兄弟）' }
            ]
          },
          { label: 'h2：另一个大部分（兄弟）' }
        ]
      }
    }
  },
  {
    id: 'nesting-relations',
    file: 'nesting-relations.svg',
    lessonId: 'working-with-text',
    sectionIndex: 5,
    type: 'tree',
    data: {
      root: {
        label: 'body（父元素）',
        children: [
          { label: 'p（子元素）' },
          { label: 'p（另一个子元素，与前者是兄弟）' }
        ]
      }
    }
  },
  {
    id: 'ul-vs-ol',
    file: 'ul-vs-ol.svg',
    lessonId: 'lists',
    sectionIndex: 2,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '无序列表 <ul>',
        items: [
          '顺序不重要时用：购物清单（可按任意顺序买）',
          '每一项用列表项元素 <li> 创建',
          '显示效果：每项以项目符号（bullet point）开头'
        ]
      },
      right: {
        title: '有序列表 <ol>',
        items: [
          '顺序重要时用：菜谱分步说明、十大电视节目',
          '每一项同样用 <li> 创建',
          '显示效果：每项以一个数字开头'
        ]
      },
      note: '怎么选，一个问题就够：顺序重要吗？真正要选的只是外层容器——里面的列表项都是 li。'
    }
  },
  {
    id: 'href-attribute-anatomy',
    file: 'href-attribute-anatomy.svg',
    lessonId: 'links-and-images',
    sectionIndex: 3,
    type: 'anatomy',
    data: {
      band: ['属性 = 名字 + 值', '给元素提供额外信息', '总是放在开始标签里'],
      subject: { label: '一个链接的解剖：<a href="目的地地址">链接文字</a>' },
      parts: [
        { label: '<a' },
        { label: 'href="目的地地址"' },
        { label: '链接文字' },
        { label: '</a>' }
      ],
      callouts: [
        { part: 0, text: 'anchor 开始标签；并非所有属性都需要值' },
        { part: 1, text: 'href = hypertext reference，值是链接去的目的地；可指向 HTML 文档、视频、pdf、图片（如 theodinproject.com 的 About 页）' },
        { part: 2, text: '有 href 时浏览器给文字加蓝色和下划线；没有 href 看起来就是普通文本' },
        { part: 3, text: '结束标签；改完记得刷新浏览器让改动生效' }
      ]
    }
  },
  {
    id: 'broken-link-after-move',
    file: 'broken-link-after-move.svg',
    lessonId: 'links-and-images',
    sectionIndex: 8,
    type: 'flow',
    data: {
      steps: [
        { label: 'index 链接 about.html', sub: '同目录：href 直接写文件名，正常' },
        { label: '把 about.html 移进 pages/', sub: '组织更好的网站目录' },
        { label: '链接断了', sub: '文件位置变了，href 还指向旧位置' },
        { label: 'href="pages/about.html"', sub: '按相对新位置更新，恢复正常' }
      ],
      note: '相对链接不包含域名，路径相对于「创建链接的那个页面」计算——文件位置变了，路径要跟着变。'
    }
  },
  {
    id: 'town-museum-rooms',
    file: 'town-museum-rooms.svg',
    lessonId: 'links-and-images',
    sectionIndex: 10,
    type: 'map',
    data: {
      center: { label: '域名 town.com', sub: '一座城镇' },
      satellites: [
        { label: '/museum 目录', desc: '你的网站所在的目录 = 城镇里的一座博物馆' },
        { label: 'movie_room.html', desc: '网站上的每个页面 = 博物馆里的一个房间（这间是电影放映室）' },
        { label: 'shops/coffee_shop.html', desc: '子目录里的页面 = 博物馆里的商店房间' },
        { label: '相对链接 ./shops/coffee_shop.html', desc: '从当前房间到另一个房间的路线指引' },
        { label: '绝对链接', desc: '完整路线：协议（https）+ 域名（town.com）+ 从域名开始的路径（/museum/shops/coffee_shop.html）' }
      ]
    }
  },
  {
    id: 'parent-directory-tree',
    file: 'parent-directory-tree.svg',
    lessonId: 'links-and-images',
    sectionIndex: 18,
    type: 'tree',
    data: {
      root: {
        label: 'odin-links-and-images（项目目录）',
        children: [
          {
            label: 'pages/',
            children: [
              { label: 'about.html（你在这里）' }
            ]
          },
          {
            label: 'images/',
            children: [
              { label: 'dog.jpg' }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'bad-vs-good-commit',
    file: 'bad-vs-good-commit.svg',
    lessonId: 'commit-messages',
    sectionIndex: 2,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '坏提交说明',
        items: [
          '官方例子：「fix a bug」',
          '描述了你做了什么，但太含糊',
          '让团队里的其他开发者困惑：修了什么？为什么修？'
        ]
      },
      right: {
        title: '好提交说明',
        items: [
          '解释改动背后的为什么（why）',
          '说清改动解决了什么问题',
          '说清它是怎样解决的'
        ]
      },
      note: '「有没有解释为什么」是好坏提交说明的分水岭——这是官方给的标准。'
    }
  },
  {
    id: 'commit-subject-body',
    file: 'commit-subject-body.svg',
    lessonId: 'commit-messages',
    sectionIndex: 3,
    type: 'anatomy',
    data: {
      band: ['有效的提交 = 两个独立部分', 'subject：一句话总结', 'body：讲清问题与做法'],
      subject: { label: '一条有效提交的解剖' },
      parts: [
        { label: 'subject（主题）' },
        { label: 'body（正文）' }
      ],
      callouts: [
        { part: 0, text: '对所做改动的简要总结；GitHub 有 72 字符的限制，官方推荐把主题控制在这个数量以内' },
        { part: 1, text: '简洁但清楚的描述：你的提交解决了什么问题、以及怎样解决的' }
      ]
    }
  },
  {
    id: 'commit-length-50-72',
    file: 'commit-length-50-72.svg',
    lessonId: 'commit-messages',
    sectionIndex: 10,
    type: 'anatomy',
    data: {
      band: ['两个数字容易混', '50 = 写作建议', '72 = 显示上限'],
      subject: { label: 'subject 字符数的两个口径' },
      parts: [
        { label: '往 50 字符靠' },
        { label: '72 字符封顶' }
      ],
      callouts: [
        { part: 0, text: '出自官方 Assignment 指定文章的「七条规则」：把 subject 限制在 50 字符左右——更严格的写作建议' },
        { part: 1, text: '出自本课 tip 框：GitHub 的 72 字符显示限制。日常写法 subject 尽量短、整条不超 72 字符宽，两个口径同时满足' }
      ]
    }
  },
  /* ---------- v4.11.17（第 21–23 课）新增两张 ----------
   * 判据住 LESSON-PAGE-GUIDE.md 第 4 节：课 21「三种加 CSS 的方式及优先级」是分层
   * 覆盖关系，用 stack（第一项画最上层，天然表达「内联 > 内部 > 外部」）；
   * 课 22「层叠的判定顺序」是标准流程，用 flow。
   * 课 23 是打开 DevTools 跟着做的操作课，按判据第一条（一次性操作不配图）不配。 */
  {
    id: 'css-three-methods-stack',
    file: 'css-three-methods-stack.svg',
    lessonId: 'intro-to-css',
    sectionIndex: 15,
    type: 'stack',
    data: {
      layers: [
        { label: '内联 CSS', desc: '写在元素的 style 属性上，没有选择器；优先级最高，压过另外两种' },
        { label: '内部 CSS', desc: '写在 HTML 文件自己的 style 标签里，只作用于这一个页面' },
        { label: '外部 CSS', desc: '写在单独的 .css 文件里，用 link 元素链进来；最常用、最好维护' }
      ],
      note: '三种方式写的是同一套规则语言，区别只在规则放在哪里；同一个元素被多种方式命中时，内联压过内部与外部。'
    }
  },
  {
    id: 'cascade-decision-order',
    file: 'cascade-decision-order.svg',
    lessonId: 'the-cascade',
    sectionIndex: 10,
    type: 'flow',
    data: {
      steps: [
        { label: '直接命中', sub: '直接命中的规则赢过继承来的值' },
        { label: '比选择器类型', sub: 'ID 胜过任意数量的类，类胜过任意数量的类型' },
        { label: '比同类数量', sub: '类型打平时，同类选择器多的赢' },
        { label: '比规则顺序', sub: '仍分不出胜负时，写在后面的那条生效' }
      ],
      note: '通配选择器与组合器符号本身不贡献特异性；浏览器的默认样式也参与比较，但权重通常很低。'
    }
  },
  {
    id: 'box-model-four-layers',
    file: 'box-model-four-layers.svg',
    lessonId: 'the-box-model',
    sectionIndex: 3,
    type: 'anatomy',
    data: {
      band: ['一切皆矩形盒', '四层由内到外叠加', '布局就是安排这些盒子'],
      subject: { label: '一个元素盒子（box model）' },
      parts: [
        { label: 'content 内容' },
        { label: 'padding 内边距' },
        { label: 'border 边框' },
        { label: 'margin 外边距' }
      ],
      callouts: [
        { part: 0, text: '装文字与图片的那一层；默认盒模型的 width / height 只量它' },
        { part: 1, text: '边框与内容之间的空间，把内容往里撑——增加的是自己内部的空间' },
        { part: 2, text: '包住 padding 与内容的一道框，哪怕只有一两个像素也占地方' },
        { part: 3, text: '盒子的边框与相邻盒子的边框之间的空间，把别的盒子推开' }
      ]
    }
  },
  {
    id: 'display-types-map',
    file: 'display-types-map.svg',
    lessonId: 'block-and-inline',
    sectionIndex: 5,
    type: 'map',
    data: {
      center: { label: '元素的显示类型', sub: '由 display 属性决定' },
      satellites: [
        { label: 'block 块级', desc: '独占一行、每个新元素另起一行往下堆叠；段落、标题都是默认块级' },
        { label: 'inline 行内', desc: '不换行，排在文字流里与邻居同行，链接最典型；一般别硬加 padding / margin' },
        { label: 'inline-block 行内块', desc: '中间地带：像行内一样并排，又保留块级盒子的尺寸与间距行为；排一行盒子实际更多用 flexbox' }
      ]
    }
  },
  {
    id: 'flex-axes-compare',
    file: 'flex-axes-compare.svg',
    lessonId: 'axes',
    sectionIndex: 1,
    type: 'compare',
    data: {
      left: {
        title: 'flex-direction: row（默认）',
        items: [
          '主轴：水平，从左到右（项目排布方向）',
          '交叉轴：垂直',
          'justify-content 管水平分布',
          'align-items 管垂直对齐',
          'flex-basis 对应 width'
        ]
      },
      right: {
        title: 'flex-direction: column',
        items: [
          '主轴：垂直，从上到下',
          '交叉轴：水平',
          'justify-content 变成管垂直分布',
          'align-items 变成管水平对齐',
          'flex-basis 对应 height'
        ]
      },
      note: '两根轴永远互相垂直；flex-direction 一换，整组坐标旋转——对齐与尺寸属性的方向全部跟着转。'
    }
  },
  {
    id: 'flex-shorthand-anatomy',
    file: 'flex-shorthand-anatomy.svg',
    lessonId: 'growing-and-shrinking',
    sectionIndex: 2,
    type: 'anatomy',
    data: {
      band: ['写一条声明 flex: 1', '展开成三份', '各管一件事'],
      subject: { label: 'flex 简写（flex: 1）' },
      parts: [
        { label: 'flex-grow: 1' },
        { label: 'flex-shrink: 1' },
        { label: 'flex-basis: 0' }
      ],
      callouts: [
        { part: 0, text: '放大因子：容器有富余空间时按这个比例增长；因子 1 与 2 的项目宽度比是 1 : 2' },
        { part: 1, text: '缩小因子：所有项目装不下时按这个比例收缩；默认 1 均匀收缩，0 绝不收缩' },
        { part: 2, text: '初始尺寸：伸缩的起点；0 从零开始按比例分，auto 会参考项目的 width 声明' }
      ]
    }
  },
  /* ---- 路径课试点批次 3（World 2 · 中级 HTML 概念 3 课，2026-09-25）----
   * 判据五条逐条过的结论（LESSON-PAGE-GUIDE §4.1）：
   * · 导读课（introduction）不配——纯定位与浏览任务，无回看心智模型；
   * · SVG 课配 2 张，都是「会反复回看的选择决策」compare columns（同 ul-vs-ol 先例）；
   * · tables 课配 1 张 tree——四标签嵌套骨架，写表格时回看（同 nesting-relations 先例）。 */
  {
    id: 'svg-vector-vs-raster',
    file: 'svg-vector-vs-raster.svg',
    lessonId: 'node-path-intermediate-html-and-css-svg',
    sectionIndex: 1,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '矢量图形（SVG）',
        items: [
          '图像由数学公式定义：形状与线条，没有像素网格',
          '任意缩放，质量与文件体积都不变',
          '源码是 XML：人类可读、可贴进 HTML 成为 DOM 元素',
          '适合：图标、图表、大型简单图像、图案背景'
        ]
      },
      right: {
        title: '位图（JPEG / PNG）',
        items: [
          '图像由像素网格定义：细节受限于网格大小',
          '放大要给新像素决定长相（无简单解法），网格越大文件越大',
          '二进制格式：文本编辑器打开是乱码',
          '适合：照片、细腻纹理（grunge 等）'
        ]
      },
      note: '怎么选：要照片级真实或细腻纹理就位图；要任意缩放、程序化修改（CSS/JS 改属性）就 SVG。'
    }
  },
  {
    id: 'svg-link-vs-inline',
    file: 'svg-link-vs-inline.svg',
    lessonId: 'node-path-intermediate-html-and-css-svg',
    sectionIndex: 5,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '链接（img / background-image）',
        items: [
          '和链接普通图片一样：干净、简单',
          '页面正常缓存',
          'SVG 内容对网页代码不可见——不能动态改'
        ]
      },
      right: {
        title: '内联（代码直接贴进 HTML）',
        items: [
          '属性对 CSS / JavaScript 可见——可动态改图',
          '代价：代码更难读、页面缓存性变差',
          '大 SVG 可能延迟后续 HTML 加载'
        ]
      },
      note: '官方建议：默认链接；只有要随 HTML 一起调 SVG 代码时才内联（学了 React / webpack 后内联缺点可规避）。'
    }
  },
  {
    id: 'tables-four-tags-tree',
    file: 'tables-four-tags-tree.svg',
    lessonId: 'node-path-intermediate-html-and-css-tables',
    sectionIndex: 1,
    type: 'tree',
    data: {
      root: {
        label: 'table（整张表）',
        children: [
          {
            label: 'tr（第 1 行：表头行）',
            children: [
              { label: 'th（表头单元格，默认加粗居中）' },
              { label: 'th（列标签，如「姓名」）' }
            ]
          },
          {
            label: 'tr（第 2 行：数据行）',
            children: [
              { label: 'td（数据单元格）' },
              { label: 'td（数据，如「地球」）' }
            ]
          }
        ]
      }
    }
  },
  /* ---- World 2 第二批（中级 CSS 概念前 5 课，2026-09-25，v4.11.21）----
   * 判据五条逐条过的结论（LESSON-PAGE-GUIDE §4.1）：
   * · default-styles 不配——短课、「默认存在且可覆盖」是一次性认知，且与
   *   cascade 课既有图信息重叠（判据 2/3）；
   * · css-units 配 1 张 compare——「参照物地图」是每写一行 CSS 都会回看的
   *   心智模型（判据 1/2/5 全过，任务预告的强候选）；
   * · more-text-styles 不配——属性清单 + 一次性字体配置操作（判据 1/2 不过）；
   * · more-css-properties 不配——官方自称「本质是属性清单」，文字列表已够
   *   清楚（判据 1 不过）；
   * · advanced-selectors 配 2 张 compare——组合器命中范围与伪类/伪元素之分
   *   都是会反复回看的空间/区分概念，本批最重一课的核心心智模型（判据
   *   1/2/5）；属性选择器语法表文字已够清楚，不配第三张（判据 1）。 */
  {
    id: 'css-units-absolute-vs-relative',
    file: 'css-units-absolute-vs-relative.svg',
    lessonId: 'node-path-intermediate-html-and-css-css-units',
    sectionIndex: 2,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '绝对单位（px）',
        items: [
          '任何上下文里都恒定——不随页面上别的东西变',
          '网页项目里你唯一该用的绝对单位',
          'in / cm 等物理单位属于打印场景'
        ]
      },
      right: {
        title: '相对单位（随参照物变）',
        items: [
          'rem = 根元素字号的倍数（经验法则：优先）',
          'em = 自身/父级字号的倍数（随上下文漂移）',
          '% = 父元素对应尺寸的比例',
          'vh / vw = 视口高/宽的 1%'
        ]
      },
      note: '选单位先答「这个尺寸该跟着什么变」：固定 → px；跟根字号 → rem；跟父级 → %；跟视口 → vw/vh。'
    }
  },
  {
    id: 'selector-combinators-reach',
    file: 'selector-combinators-reach.svg',
    lessonId: 'node-path-intermediate-html-and-css-advanced-selectors',
    sectionIndex: 1,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '纵向：子代 main > div',
        items: [
          '只选直接子级——「往下一层缩进」',
          '孙辈要再写一层：main > div > div',
          '对照：后代（空格）选所有深度'
        ]
      },
      right: {
        title: '横向：兄弟 .group1 + div / ~ div',
        items: [
          '+ 只选紧邻其后的一个同级（group2）',
          '~ 选其后全部同级（group2 与 group3）',
          '两者都只向后看，够不到之前的兄弟'
        ]
      },
      note: '组合器不加分：特异性得分由组成部分算出（官方明说无特殊规则）。'
    }
  },
  {
    id: 'pseudo-class-vs-element',
    file: 'pseudo-class-vs-element.svg',
    lessonId: 'node-path-intermediate-html-and-css-advanced-selectors',
    sectionIndex: 2,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '伪类 :（单冒号）',
        items: [
          '选 HTML 里已存在的元素——按状态或结构位置',
          ':hover / :focus / :active / :link / :visited',
          ':root / :first-child / :empty / :nth-child',
          '特异性同类 (0,0,1,0)，大多可链式叠加'
        ]
      },
      right: {
        title: '伪元素 ::（双冒号）',
        items: [
          '选标记里通常不存在的部分——用 CSS 操作',
          '::before / ::after 能凭空加内容（配 content）',
          '::marker / ::first-letter / ::first-line / ::selection',
          '特异性同元素 (0,0,0,1)'
        ]
      },
      note: '现行标准：伪元素双冒号（旧文章常用单冒号，官方 Assignment 专门提醒）。'
    }
  },
  /* ===== World 2 第三批（2026-09-26）：「中级 CSS 概念」后 5 课，+2 张 =====
   * 判据五条逐课结论（LESSON-PAGE-GUIDE.md §4.1）：
   *   positioning → **配**（五种模式的「参照谁 + 是否脱流」是看不见的空间关系、
   *     写任何布局都会回看、与现有 59 张零重叠、非比喻、属难课核心概念）→ map；
   *   custom-properties → **配**（作用域与继承是层级结构、主题机制会反复回看、
   *     无重叠、非比喻、核心概念）→ tree；
   *   css-functions → **不配**（判据 1：四个函数各一句话即说清，文字列表已够；
   *     方向易混点已由 pitfalls 的「min 封顶 / max 保底 / clamp 小-缩-大」文字判据覆盖，
   *     画图是复述正文）；
   *   browser-compatibility → **不配**（判据 1：引擎归属用列表已明确；判据 2：浏览器简史
   *     属一次性知识；本课主体是方法论与判断，不是空间/层级结构）；
   *   frameworks-and-preprocessors → **不配**（判据 1 与 4：本课是分类 + 阶段建议的论述，
   *     文字已把取舍说清，画出来是复述）。 */
  {
    id: 'positioning-five-modes-map',
    file: 'positioning-five-modes-map.svg',
    lessonId: 'node-path-intermediate-html-and-css-positioning',
    sectionIndex: 4,
    type: 'map',
    data: {
      center: { label: 'position 的五种模式', sub: '看两件事：参照谁定位 · 是否脱离文档流' },
      satellites: [
        { label: 'static 静态', desc: '默认值：按文档流正常排列，top / right / bottom / left 一律不起作用' },
        { label: 'relative 相对', desc: '参照自己原本的位置偏移；不脱流，原空间仍保留（后面的元素不补位）' },
        { label: 'absolute 绝对', desc: '脱离文档流；参照最近的已定位祖先，放到精确一点——模态框、图上文字、角标' },
        { label: 'fixed 固定', desc: '脱离文档流；参照视口定位，滚动时钉住不动——导航栏、悬浮按钮' },
        { label: 'sticky 粘性', desc: '不脱流；滚过之前是普通元素，滚过之后才像 fixed——分区标题吸顶' }
      ]
    }
  },
  {
    id: 'custom-property-scope-tree',
    file: 'custom-property-scope-tree.svg',
    lessonId: 'node-path-intermediate-html-and-css-custom-properties',
    sectionIndex: 5,
    type: 'tree',
    data: {
      root: {
        label: ':root（全局声明 --main-color）',
        children: [
          {
            label: '.cool-div（局部声明 --main-bg）',
            children: [
              { label: '.cool-paragraph：取到 --main-bg（是后代，在作用域内）' },
              { label: '.card：重定义 --main-bg → 只改这一支，别处不受影响' }
            ]
          },
          { label: '.boring-paragraph：取不到 --main-bg（不是 .cool-div 的后代）' },
          { label: '[data-theme="dark"]：同名变量换一套取值 = 主题' }
        ]
      }
    }
  },
  /* World 2 第四批（表单 3 课）判据五条逐课取舍：
   * - form-validation **配 1 张**（user-valid-state-timeline，flow 型，sectionIndex 7）：
   *   判据 1 概念形态 ✓（校验样式的生效时机是状态流转，看不见摸不着）；判据 2 使用频次 ✓
   *   （写表单样式时会反复回看）；判据 3 不重复 ✓（现有 61 张无同类，最近的是地图节点状态色，
   *   那是地图语义）；判据 4 非比喻 ✓；判据 5 对「坚持」✓（本课最反直觉的核心概念，也是
   *   :invalid 误用的直接解药）。
   * - form-basics **不配**：判据 1 落在「不配」——全课是控件清单与属性说明（type 有哪些、
   *   按钮三种 type、select/radio/checkbox 各自怎么写），文字列表已够清楚；硬套 map 图型只会
   *   把清单换个形状再抄一遍（判据 3 与 4 同样不配）。
   * - sign-up-form **不配**：Project 课是任务型课，按既有口径不配图（与 Recipes / Landing Page /
   *   Etch-a-Sketch / Calculator 四门一致）；且本站对该课不提供成品代码，配图会变相给出布局答案。 */
  {
    id: 'user-valid-state-timeline',
    file: 'user-valid-state-timeline.svg',
    lessonId: 'node-path-intermediate-html-and-css-form-validation',
    sectionIndex: 7,
    type: 'flow',
    data: {
      steps: [
        { label: '页面刚加载', sub: '中性外观' },
        { label: '填入非法值', sub: '仍未完成交互' },
        { label: '点击别处 / Tab 离开', sub: '变红（:user-invalid）' },
        { label: '改成合法值', sub: '自动变绿' },
        { label: '再改回非法', sub: '自动变回红' }
      ],
      note: ':user-valid 与 :user-invalid 只在用户完成一次完整交互后才命中——所以页面刚加载时不会满屏红框，这正是它们与 :invalid / :valid 的关键差别。'
    }
  },
  /* ---------- World 2 第五批（2026-09-26，v4.11.22）：「Grid 布局」章节 6 课配图取舍 ----------
   * 按 LESSON-PAGE-GUIDE §4.1 判据五条逐课过一遍（整段理由按纪律写在这里）：
   * - introduction-to-grid **不配**：判据 1 落在「不配」——全课是定位与历史叙述（一维 vs
   *   两维、Bert Bos 与 1996、gap 的演进），没有可解剖的结构；「一维 / 两维」的对比文字
   *   已够清楚，硬画只能复述（判据 4 同型）。且 Flexbox 一课已有主轴 / 交叉轴对比图
   *   （flex-axes-compare 族），再画一维两维对比会与之信息重叠（判据 3）。
   * - creating-a-grid **配 1 张**（grid-explicit-vs-implicit，compare columns 型，
   *   sectionIndex 4，落「显式网格 vs 隐式网格」章后）：判据 1 ✓（隐式轨道是「看不见」的
   *   自动行为，空间结构类）；判据 2 ✓（「多出来的项目去哪了、行高为什么不一样」是写
   *   Grid 会反复撞到的问题，显式 / 隐式的心智模型值得回看）；判据 3 ✓（全站无同类图）；
   *   判据 5 ✓（本课核心概念）。轨道 / 线的基础结构解剖刻意不在本课画——它是下一课
   *   （定位）的坐标系主角，一图一主，不重复。
   * - positioning-grid-elements **配 1 张**（grid-lines-and-cells，anatomy 型，
   *   sectionIndex 2，按 §4.3「一图覆盖相邻两章时放后一章之后」落「单元格」章后，
   *   覆盖「网格线」与「单元格」两章）：判据 1 ✓（线与单元格在页面上不可见，须 devtools
   *   overlay 才能看到——正是「看不见摸不着的空间结构」的强候选）；判据 2 ✓（线号坐标系
   *   是之后每一次 grid-column / grid-area 定位都要回看的心智模型）；判据 3 ✓；判据 5 ✓
   *   （难课核心概念，span / 负数线都建立在这套部件关系上）。
   * - advanced-grid-properties **配 1 张**（grid-auto-fit-vs-fill，compare columns 型，
   *   sectionIndex 10，落「auto-fill 呢」章后，覆盖 auto-fit 三章的行为对比）：判据 1 ✓
   *   （两者的行为差异是「容器拉伸时空轨道怎么处理」的动态空间行为，肉眼要靠反复拖拽
   *   才能看见）；判据 2 ✓（每次写响应式卡片网格都要在 fit / fill 之间做选择）；判据 3 ✓；
   *   判据 5 ✓（本课最易混的一对概念）。两个落选候选如实记录：① minmax() vs clamp()
   *   对比——判据 1 落在「不配」，函数签名与适用面的差异用文字表格已足够清楚，画图是
   *   复述；② repeat(auto-fit, minmax()) 三步计算流程（flow 型）——判据 3 落在「不配」，
   *   与本张对比图在「auto-fit 拉伸行为」上信息重叠，且三步拆解正文已逐步展开、判据 2
   *   的「反复回看」价值弱（理解一次即可）。本课 12 章为全站长课，但按「宁可不配图，
   *   也不硬套图型」的纪律只配最有价值的 1 张。
   * - using-flexbox-and-grid **不配**：判据 1 落在「不配」——全课是判断口径的论述
   *   （内容优先 / 布局优先），正文的两段对照已把口径说清；候选「fit vs grid 决策树」
   *   与正文判断句式一一对应，画出来是复述（判据 4 同型）。
   * - admin-dashboard **不配**：Project 课是任务型课，按既有口径不配图（与 Recipes /
   *   Landing Page / Etch-a-Sketch / Calculator / Sign-up Form 五门一致）；且本站对该课
   *   不提供成品代码，画三大块的网格分解图会变相给出布局答案（红线）。 */
  {
    id: 'grid-explicit-vs-implicit',
    file: 'grid-explicit-vs-implicit.svg',
    lessonId: 'node-path-intermediate-html-and-css-creating-a-grid',
    sectionIndex: 4,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '显式网格 explicit · 你画好的部分',
        items: [
          'grid-template-columns / rows 定义的轨道',
          '数量与尺寸都由你说了算',
          '像图纸：先画好、再施工'
        ]
      },
      right: {
        title: '隐式网格 implicit · Grid 自动补的部分',
        items: [
          '项目超出显式定义时自动创建的轨道',
          '尺寸不继承显式轨道，默认由内容撑开',
          'grid-auto-rows / columns 定尺寸，grid-auto-flow 定方向'
        ]
      },
      note: '同一张网格的两半：显式画完，隐式接管——「第五个项目去哪了」的答案永远在隐式轨道里。'
    }
  },
  {
    id: 'grid-lines-and-cells',
    file: 'grid-lines-and-cells.svg',
    lessonId: 'node-path-intermediate-html-and-css-positioning-grid-elements',
    sectionIndex: 2,
    type: 'anatomy',
    data: {
      band: ['用 grid-template 定义轨道', '线与单元格隐式产生', '项目按线号 / 区域名落位'],
      subject: { label: '3×3 网格（容器）' },
      parts: [
        { label: '网格线 line' },
        { label: '轨道 track' },
        { label: '单元格 cell' },
        { label: '网格项目 item' }
      ],
      callouts: [
        { part: 0, text: '随轨道定义隐式产生，不能直接创建；从 1 编号，n 条轨道对应 n+1 条线，负数线从另一端倒数' },
        { part: 1, text: '两条相邻线之间的空间——一条行轨道或一条列轨道' },
        { part: 2, text: '一条行轨道 × 一条列轨道的交集，像电子表格的一格；默认每个项目占一格' },
        { part: 3, text: '容器的直接子元素；按线号或区域名定位，可以跨多格' }
      ]
    }
  },
  {
    id: 'grid-auto-fit-vs-fill',
    file: 'grid-auto-fit-vs-fill.svg',
    lessonId: 'node-path-intermediate-html-and-css-advanced-grid-properties',
    sectionIndex: 10,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: 'auto-fit · 用项目填满行',
        items: [
          '空轨道被折叠，项目拉伸到最大值（如 1fr）',
          '项目比列数少时：撑满整行',
          '典型场景：卡片流要占满容器宽度'
        ]
      },
      right: {
        title: 'auto-fill · 保留空轨道',
        items: [
          '空轨道被保留，项目缩回最小值（如 150px）',
          '项目比列数少时：行尾留空位',
          '典型场景：给未来的项目预留格位、尺寸稳定'
        ]
      },
      note: '只在「项目填不满一行」时有差别；填满行时渲染完全一样——选择依据：空出来时，要项目撑满还是留格位。'
    }
  },
  /* ---------- World 3 批次 4 阶段 1（2026-09-26，v4.11.23）：javascript 课程新增 9 张 ----------
   * 判据住 LESSON-PAGE-GUIDE.md §4.1 五条；图型只用既有 flow / compare columns，零图型库
   * 扩展。逐课决策记录：
   * - how-this-course-will-work **不配**：判据 3——课程结构导览与 World 3 路线信息重叠
   *   （首页路线图与课程详情面板已承载），文字章已够清楚（判据 1）。
   * - organizing-code-with-objects **不配**：判据 1——对象哲学课，「散装变量 → 命名空间」
   *   正文代码示例已经直观；候选「procedural vs OOP 对比」落判据 4（正文已把两种范式
   *   的差别说清，画出来是复述）。
   * - object-constructors **配 2 张**：① proto-vs-prototype-naming（compare columns，
   *   sectionIndex 3）——判据 1 ✓（.prototype 与 [[Prototype]] 的关系是看不见的链接
   *   结构）、判据 2 ✓（此后每读一段原型代码都要回看的高频混淆点）、判据 5 ✓（难课
   *   核心概念）；② prototype-chain-lookup（flow，sectionIndex 4）——判据 1 ✓（链式
   *   查找路径不可见）、判据 2 ✓（整个 JS 课程后续章节反复使用的查找模型）。两张信息
   *   不重叠：一张讲「两个名字各是什么」，一张讲「查找怎么走」。
   * - factory-functions-and-the-module-pattern **配 1 张**（closure-private-factory，
   *   flow，sectionIndex 4）：判据 1 ✓（作用域存活与闭包携带完全不可见）、判据 2 ✓
   *   （私有变量模式在 Todo List 项目与模块模式章反复回看）、判据 3 ✓（与既有图零
   *   重叠——Foundations 未画过闭包图）。落选候选：「工厂 vs 构造器」对比——判据 1
   *   落「不配」，正文两个历史槽点已用文字列表说清。
   * - classes **配 1 张**（class-vs-prototype-mapping，compare columns，sectionIndex 1）：
   *   判据 1 ✓（糖衣映射是两套语法间的对应关系）、判据 2 ✓（官方明说「每见一个 class
   *   特性就翻译回既有知识」——这张图就是翻译表）、判据 5 ✓（本课核心定性）。
   *   sectionIndex 按 §4.3「一图覆盖相邻两章放后一章之后」落 [1]（覆盖 [0] 糖衣定性
   *   与 [1] 基本语法两章）。
   * - es6-modules **配 1 张**（module-dependency-graph，flow，sectionIndex 5）：判据 1 ✓
   *   （依赖图与加载顺序不可见）、判据 2 ✓（下一课 webpack 的依赖图概念直接复用）、
   *   判据 5 ✓。落选候选：「named vs default 导出」对比——判据 1 落「不配」，语法
   *   差异文字并排已够清楚。
   * - npm **配 1 张**（npm-install-flow，flow，sectionIndex 3）：判据 1 ✓（清单 → 仓库
   *   → 本地库房的三方关系不可见）、判据 2 ✓（此后每个项目都要跑 install）。落选候选：
   *   「dependencies vs devDependencies」对比——判据 1 落「不配」，一条判断句（用户
   *   浏览器里要跑它吗）已够。
   * - webpack **配 1 张**（webpack-bundle-flow，flow，sectionIndex 1）：判据 1 ✓（打包
   *   过程不可见）、判据 2 ✓（入口/依赖图/输出是之后所有 webpack 课的共同底座）、
   *   判据 3 ✓（与 module-dependency-graph 不重叠：那张讲浏览器加载，这张讲打包器
   *   合并输出）。
   * - revisiting-webpack **配 1 张**（dev-vs-prod-mode，compare columns，sectionIndex 2）：
   *   判据 1 ✓（两种模式的取向差异）、判据 2 ✓（每次搭项目都要选 mode 与配置拆分）。
   * - json **配 1 张**（json-round-trip，flow，sectionIndex 2）：判据 1 ✓（序列化往返
   *   与「函数丢失」不可见）、判据 2 ✓（Todo List 持久化的架构基础，短课但模型长寿）、
   *   判据 5 ✓。
   * - oop-principles **不配**：判据 1 落「不配」——单一职责与松耦合是决策原则，正文
   *   的判断句式与反例已够清楚；候选「紧耦合 vs 松耦合对比」画出来是文字列表的复述。
   * - 4 门 Project 课（library / tic-tac-toe / restaurant-page / todo-list）**不配**：
   *   任务纪律——Project 课不提供成品代码，画结构分解图会变相给出实现答案（与
   *   admin-dashboard 同一口径）。 */
  {
    id: 'proto-vs-prototype-naming',
    file: 'proto-vs-prototype-naming.svg',
    lessonId: 'node-path-javascript-object-constructors',
    sectionIndex: 3,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: 'Constructor.prototype · 函数上的属性',
        items: [
          '构造器函数自己的属性',
          '决定 new 出的实例 [[Prototype]] 挂到谁',
          '共享方法与属性放这里，全体实例一份'
        ]
      },
      right: {
        title: '对象的 [[Prototype]] · 内部链接',
        items: [
          '每个对象都有一个：查找向上走的路',
          '读 getPrototypeOf()、写 setPrototypeOf()',
          '.__proto__ 是非标准已废弃的旧写法'
        ]
      },
      note: '交点：new Player() 造出的实例，其 [[Prototype]] 正好指向 Player.prototype——「函数上的属性」决定了「对象里的链接」。'
    }
  },
  {
    id: 'prototype-chain-lookup',
    file: 'prototype-chain-lookup.svg',
    lessonId: 'node-path-javascript-object-constructors',
    sectionIndex: 4,
    type: 'flow',
    data: {
      steps: [
        { label: 'player1 自身', sub: 'valueOf 是自己的吗？不是' },
        { label: 'Player.prototype', sub: '这里也没定义' },
        { label: 'Object.prototype', sub: '找到了：valueOf 定义在这' },
        { label: 'null（链尾）', sub: '查到这还没有 → undefined' }
      ],
      note: '查找沿 [[Prototype]] 链逐级向上；一个对象只有一个 [[Prototype]]（没有多继承），Object.prototype 的原型是 null——链不会无限延伸。'
    }
  },
  {
    id: 'closure-private-factory',
    file: 'closure-private-factory.svg',
    lessonId: 'node-path-javascript-factory-functions-and-the-module-pattern',
    sectionIndex: 4,
    type: 'flow',
    data: {
      steps: [
        { label: '调用 createUser("josh")', sub: '函数体执行一遍' },
        { label: 'let reputation = 0', sub: '变量出生在这次调用的作用域' },
        { label: '返回对象只带两个闭包', sub: 'getReputation / giveReputation' },
        { label: '作用域没有销毁', sub: '闭包让变量随方法活着' },
        { label: 'josh.reputation → undefined', sub: '外界只能走留下的两个函数' }
      ],
      note: '对象简写 { reputation } 只是复制当时的值，不是返回变量本身——访问私有变量的唯一途径是闭包。'
    }
  },
  {
    id: 'class-vs-prototype-mapping',
    file: 'class-vs-prototype-mapping.svg',
    lessonId: 'node-path-javascript-classes',
    sectionIndex: 1,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: 'class 语法（ES6）',
        items: [
          'class Player { ... } 包住整个蓝图',
          'constructor 在 new 时自动执行、装实例数据',
          '类体里的方法自动住在 prototype 上',
          '漏写 new 直接抛 TypeError（防护内置）'
        ]
      },
      right: {
        title: '构造器 + 原型（上一课）',
        items: [
          'function Player(...) 的函数体装实例数据',
          '手动写 Player.prototype.method 赋值',
          '方法住在原型上、全体实例共享',
          '漏写 new 静默错误（自己加 new.target）'
        ]
      },
      note: '底层机制没有变、没有经典继承在发生——class 是构造器 + 原型的新语法；类体自动严格模式、方法默认不可枚举。'
    }
  },
  {
    id: 'module-dependency-graph',
    file: 'module-dependency-graph.svg',
    lessonId: 'javascript-es6-modules',
    sectionIndex: 5,
    type: 'flow',
    data: {
      steps: [
        { label: 'HTML 只挂一个 script', sub: 'type=module 指向入口 two.js' },
        { label: 'two.js import one.js', sub: 'one.js 成为依赖' },
        { label: '浏览器加载入口', sub: '看到依赖，把 one.js 也加载进来' },
        { label: '依赖图可以继续长', sub: 'three.js / 间接依赖，入口不变' }
      ],
      note: '入口永远是依赖链最上游的消费者——用 one.js 当入口就坏事：two.js 的代码根本不会被用到。type=module 自动延迟、不必 defer；file:// 直开的页面加载不了 ES 模块，需要本地服务器。'
    }
  },
  {
    id: 'npm-install-flow',
    file: 'npm-install-flow.svg',
    lessonId: 'node-path-javascript-npm',
    sectionIndex: 3,
    type: 'flow',
    data: {
      steps: [
        { label: 'package.json', sub: '清单：依赖名与版本号' },
        { label: 'npm install', sub: '命令行工具读清单' },
        { label: 'npm 仓库', sub: '巨型仓库按清单下载' },
        { label: 'node_modules/', sub: '包代码存放本地，可 import' },
        { label: 'scripts 就绪', sub: 'npm run 的命令能跑了' }
      ],
      note: '仓库本身不包含依赖代码——谁 clone 谁跑 install，npm 替你把代码抓来；装包 / 卸载时 npm 自动更新 package.json。'
    }
  },
  {
    id: 'webpack-bundle-flow',
    file: 'webpack-bundle-flow.svg',
    lessonId: 'javascript-webpack',
    sectionIndex: 1,
    type: 'flow',
    data: {
      steps: [
        { label: '入口文件', sub: '给打包器一个 entry' },
        { label: '构建依赖图', sub: '顺着 import 找出所有相关文件' },
        { label: '合并打包', sub: '输出包含全部代码的单一文件' },
        { label: '额外优化（可选）', sub: '压缩 / 图片优化 / 摇树' }
      ],
      note: '入口与依赖图的概念在 ESM 课学过，打包语境原样适用；额外优化大多超出本课程范围——本课专注基础 JS 打包与 HTML、CSS、图片的处理。'
    }
  },
  {
    id: 'dev-vs-prod-mode',
    file: 'dev-vs-prod-mode.svg',
    lessonId: 'node-path-javascript-revisiting-webpack',
    sectionIndex: 2,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: 'development 模式 · 为开发调优',
        items: [
          '代码可读、报错好定位',
          '配合 webpack serve：改动自动重建',
          '开发期一直用它，产物不拿去部署'
        ]
      },
      right: {
        title: 'production 模式 · 为部署调优',
        items: [
          '压缩、摇树等部署向优化',
          'bundle 变成「更加华丽的一团乱码」',
          '体积更小、加载更快'
        ]
      },
      note: '官方口径：真的不需要知道优化细节——知道两种模式存在、各为特定目的设计就很好。两份配置文件 + build / dev 两个 npm script（--config 各指一份），webpack-merge 管公共部分。'
    }
  },
  {
    id: 'json-round-trip',
    file: 'json-round-trip.svg',
    lessonId: 'node-path-javascript-json',
    sectionIndex: 2,
    type: 'flow',
    data: {
      steps: [
        { label: 'JS 对象', sub: '带着方法的数据' },
        { label: 'JSON.stringify()', sub: '序列化：对象 → JSON 文本' },
        { label: '存储 / 传输', sub: 'localStorage、发给服务器' },
        { label: 'JSON.parse()', sub: '解析：JSON 文本 → 对象' },
        { label: '方法没了', sub: '函数不进 JSON，要自己装回' }
      ],
      note: '方向记清：存 / 传之前 stringify，收到 / 读出之后 parse；Todo List 的持久化正是这一趟往返——怎么把行为装回对象，是官方留给你的思考题。'
    }
  },
  /* ---------- World 3 批次 4 阶段 2（2026-09-27，v4.11.24）：javascript 课程第三、四章新增 5 张 ----------
   * 判据住 LESSON-PAGE-GUIDE.md §4.1 五条；图型只用既有 flow / compare columns，零图型库
   * 扩展。逐课决策记录：
   * - linting **配 1 张**（linter-vs-formatter，compare columns，sectionIndex 2）：
   *   判据 1 ✓（两类工具的职能边界靠并排表格才一目了然）、判据 2 ✓（此后每个项目
   *   开局都要装两者、分清谁管什么）。覆盖 [1] Linter 与 [2] Formatter 两章，按 §4.3
   *   「一图覆盖相邻两章放后一章之后」落 [2]。
   * - form-validation-with-javascript **配 1 张**（html-vs-js-validation，compare
   *   columns，sectionIndex 1）：判据 1 ✓（两层校验的能力边界是「哪些做得到/做不到」
   *   的对照关系）、判据 2 ✓（Library 改造与之后一切表单都按这张图分层）、判据 3 ✓
   *   （World 2 form-validation 课未画过 JS 层——那张课与本站此图零重叠）。
   * - ecmascript **配 1 张**（es-naming-timeline，flow，sectionIndex 1）：判据 1 ✓
   *   （版本号命名到年份命名的改制与「widely available 滞后」是时间轴关系）、判据 2 ✓
   *   （读任何文档/招聘遇到 ES+数字都要换算一次）。短课但命名模型长寿（同 json 先例）。
   * - asynchronous-code **配 1 张**（callback-hell-vs-promise-chain，compare columns，
   *   sectionIndex 3）：判据 1 ✓（金字塔嵌套 vs 平铺链的形状差异不可见——官方正文只
   *   点名 callback hell 未给示例代码，图是唯一形态呈现）、判据 2 ✓（下两课 fetch 链
   *   与 async/await 全部构建在链式模型上）、判据 5 ✓（异步三部曲第一课核心概念）。
   *   覆盖 [1] 回调与 [2][3] Promise 诸章，落后章 [3]。
   * - working-with-apis **配 1 张**（fetch-two-promises，flow，sectionIndex 5）：
   *   判据 1 ✓（两层 Promise 的嵌套结构不可见——「json() 返回的又是一个 Promise」是
   *   本课最高频困惑点）、判据 2 ✓（此后所有 fetch 代码都走这五步）、判据 5 ✓（长课
   *   核心概念）。覆盖 [4] Giphy 实战与 [5] 错误处理真相两章，落后章 [5]。
   * - async-and-await **不配**：判据 1 落「不配」——官方开篇即把 then 版与 async 版
   *   两段等价代码并排展示（正文 example 原样呈现），等价性已由代码对照直观说清；
   *   候选「then 版 vs await 版对比图」画出来是代码块的复述（判据 4）。错误处理两条
   *   路同理：正文两个代码示例已并排。
   * - weather-app **不配**：任务纪律——Project 课不提供成品代码，画架构/数据流图会
   *   变相给出实现答案（与 library / admin-dashboard 等同一口径）。 */
  {
    id: 'linter-vs-formatter',
    file: 'linter-vs-formatter.svg',
    lessonId: 'node-path-javascript-linting',
    sectionIndex: 2,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: 'Linter（ESLint）· 管对不对',
        items: [
          '按风格规则扫描代码、报告违规',
          '有些问题能自动修复',
          '规则可配置：包含/排除、逐条开关'
        ]
      },
      right: {
        title: 'Formatter（Prettier）· 管齐不齐',
        items: [
          '只管排版：空格、缩进、换行',
          '不找风格错误、不判代码对错',
          '高度有观点：几乎没有可配置项'
        ]
      },
      note: '两者都装成 devDependency、可以共存：用 ESLint 默认推荐规则集时与 Prettier 无冲突，无需 eslint-config-prettier（官方明文）。IDE 扩展只是便利层——项目里的包与配置文件才是事实源。'
    }
  },
  {
    id: 'html-vs-js-validation',
    file: 'html-vs-js-validation.svg',
    lessonId: 'node-path-javascript-form-validation-with-javascript',
    sectionIndex: 1,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: 'HTML 内置校验（World 2 已学）',
        items: [
          'required / minlength / pattern 单字段约束',
          '浏览器自动拦截 + 内置提示气泡',
          '文案与样式不可定制；跨字段逻辑做不到'
        ]
      },
      right: {
        title: 'JS Constraint Validation API（本课）',
        items: [
          'checkValidity() / validity 查原因',
          'setCustomValidity() 塞自定义文案',
          '跨字段逻辑（密码确认）+ live inline 校验'
        ]
      },
      note: '两层是分工不是替代：HTML 属性设置标准约束（validity 状态照常可查），JS 接管逻辑与文案。form 加 novalidate 关掉浏览器自动拦截——全部校验由你的 JS 负责（官方练习模式）。'
    }
  },
  {
    id: 'es-naming-timeline',
    file: 'es-naming-timeline.svg',
    lessonId: 'node-path-javascript-ecmascript',
    sectionIndex: 1,
    type: 'flow',
    data: {
      steps: [
        { label: 'ES5 及以前', sub: '版本号命名 · 攒大招式发布' },
        { label: 'ES6 = ES2015', sub: '2015 年夏 · TC39 改用年份命名' },
        { label: 'ES2016 起', sub: '有人叫 ES7 · 每年一版' },
        { label: '每版少量新增', sub: '特性细水长流进来' },
        { label: 'widely available', sub: '常滞后几年 · 必要时 Babel 转译' }
      ],
      note: '「ES+数字」与「ES+年份」是同一条时间线的两套叫法。新特性从定稿到主流浏览器普遍支持常要几年——个人开发的自动更新浏览器感知不到，面向公众的产品要查支持状态（Babel 按 targets 转译）。'
    }
  },
  {
    id: 'callback-hell-vs-promise-chain',
    file: 'callback-hell-vs-promise-chain.svg',
    lessonId: 'node-path-javascript-asynchronous-code',
    sectionIndex: 3,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '回调串联 · 回调地狱',
        items: [
          '每步嵌进上一步的回调体',
          '缩进长成金字塔、越来越深',
          '逻辑分散、错误处理各自为政'
        ]
      },
      right: {
        title: 'Promise 链 · 平铺直叙',
        items: [
          '.then() 一环接一环排成一条线',
          '值沿链流动：return 即传给下一环',
          '.catch() 在链尾统一接错'
        ]
      },
      note: '官方 getData() 的教训：同步思维取异步数据拿到 undefined——Promise 是「未来某个时刻可能产出一个值的对象」，.then() 告诉代码「等 resolved 再跑里面的函数」。单个回调没问题（addEventListener 天天用），失控发生在按顺序串联好几个的时候。'
    }
  },
  {
    id: 'fetch-two-promises',
    file: 'fetch-two-promises.svg',
    lessonId: 'node-path-javascript-working-with-apis',
    sectionIndex: 5,
    type: 'flow',
    data: {
      steps: [
        { label: 'fetch 请求', sub: 'url 进、Promise 出——返回 Promise #1' },
        { label: 'Response 外壳', sub: '查 ok / status —— 404 也 resolve' },
        { label: 'response.json()', sub: '解析响应体 · 返回 Promise #2' },
        { label: '数据对象', sub: '层层钻取：data.images.original.url' },
        { label: '上屏', sub: 'img.src = …（赋值渲染）' }
      ],
      note: '两层 Promise、两个 .then()（async/await 版就是两个 await）。fetch 只在网络层失败时 reject——API 有响应就算有效，非 2XX 要在 .then() 里查 Response.ok / status 手动分支（官方 Assignment 明文）。'
    }
  },
  /* ---------- World 3 批次 4 阶段 3（2026-09-27，v4.11.25）：javascript 课程第五、六章新增 5 张 ----------
   * 判据住 LESSON-PAGE-GUIDE.md §4.1 五条；图型只用既有 flow / compare columns，零图型库
   * 扩展。逐课决策记录：
   * - testing-basics **配 1 张**（tdd-red-green-refactor，flow，sectionIndex 0）：
   *   判据 1 ✓（「测试先行」的循环时序在文字里是抽象口号——红绿重构的节奏需要形状）、
   *   判据 2 ✓（下一课项目与 Battleship 全流程用它）。循环理念官方正文只给一句核心
   *   思想、展开在 Assignment 两篇存档文——图的 note 如实标明出处，不冒充正文内容。
   * - testing-practice **不配**：Project 课任务纪律（流程图会变相给出实现顺序提示）。
   * - more-testing **不配**：判据 4 落「不配」——官方 guessingGame 反例与 evaluateGuess
   *   重构两段原码已在课页示例区并排呈现（前后对照直观），拆分对比图是代码块的复述
   *   （与 async-and-await「两段等价代码已直观」同一先例）。
   * - recursive-methods **配 1 张**（recursion-dive-and-unwind，flow，sectionIndex 0）：
   *   判据 1 ✓（「下潜-触底-上浮」的链展开是递归最大认知门槛、正文无代码无图）、
   *   判据 2 ✓（下一课项目与 BST/骑士之旅全部构建其上）、判据 5 ✓（本课核心概念）。
   * - recursion **不配**：Project 课任务纪律（拆并流程图等于给 mergeSort 画答案）。
   * - time-complexity **配 1 张**（big-o-fast-vs-slow，compare columns，
   *   sectionIndex 3）：判据 1 ✓（八个记号的增长形状差异散在正文八个小节与三张数字
   *   表里——并排对照才看得出「快侧翻倍加一点 vs 慢侧翻倍翻几番」）、判据 2 ✓（此后
   *   每个项目的复杂度讨论与面试都用这张地图）、判据 5 ✓（本章最长课的核心概念）。
   * - space-complexity **不配**：判据 4 落「不配」——squareNumsInPlace/NewArr 对照
   *   原码已在示例区并排（辅助空间差异由代码直呈）；候选「时间 vs 空间双轴图」是
   *   上一课记号体系的复述。
   * - common-data-structures-and-algorithms **配 1 张**（bfs-vs-dfs-shapes，compare
   *   columns，sectionIndex 2）：判据 1 ✓（两种搜索的形状差异靠容器配对才说得清——
   *   正文只有文字点名）、判据 2 ✓（BST 项目四种遍历与骑士之旅选型直接消费）。
   * - linked-lists / hashmap / binary-search-trees / knights-travails **不配**：
   *   Project 课任务纪律（结构图/遍历图会变相给出实现答案——与 weather-app 同口径）。
   * - hashmap-data-structure **配 1 张**（hashmap-key-to-bucket，flow，sectionIndex 2）：
   *   判据 1 ✓（「键 → 散列码 → 取模 → 桶 → 比键」的一跳到位链路是本课核心魔法、
   *   官方只有文字三步与两张外链示意图——本站不内嵌外链图，原创流程图补位）、
   *   判据 2 ✓（下一课项目的每个方法都沿这条链路）、判据 5 ✓（知识课核心概念）。
   * 禁词自查：5 张图的 label/sub/note 均无 fetch(、XMLHttpRequest、innerHTML、
   * document.cookie 字样（diagrams.test 源码级断言）。 */
  {
    id: 'tdd-red-green-refactor',
    file: 'tdd-red-green-refactor.svg',
    lessonId: 'node-path-javascript-testing-basics',
    sectionIndex: 0,
    type: 'flow',
    data: {
      steps: [
        { label: '写测试', sub: '测试先失败——功能还不存在' },
        { label: '写实现', sub: '让测试通过的最小代码' },
        { label: '重构', sub: '测试保护下整理 · 行为不变' },
        { label: '下一个功能', sub: '循环重复——测试永远先行' },
        { label: '回归保障', sub: '全量跑测试 · 旧行为破坏当场红' }
      ],
      note: '官方核心思想：先写自动化测试，再写被测代码（TDD）。测试先失败一次，证明它真的在测东西；先写测试逼你先想清楚接口与边界——这是「TDD 鼓励更好的程序架构」的机制（more-testing 课展开）。循环理念由 Assignment 的两篇存档文章展开。'
    }
  },
  {
    id: 'recursion-dive-and-unwind',
    file: 'recursion-dive-and-unwind.svg',
    lessonId: 'javascript-recursive-methods',
    sectionIndex: 0,
    type: 'flow',
    data: {
      steps: [
        { label: '大问题', sub: '原始调用进来' },
        { label: '拆解下潜', sub: '函数调用自己 · 子问题更小' },
        { label: '触底', sub: 'base case：小到直接可解' },
        { label: '上浮组合', sub: '每层组合子解 · 返回上层' },
        { label: '顶层答案', sub: '整条链展开 · 原问题得解' }
      ],
      note: '官方定义：递归就是函数调用自己的想法——把大问题拆成越来越小的块（分而治之），把子解持续喂回原函数，直到得出答案、整条链展开。每层调用占一帧调用栈：深度失控就是 stack overflow（Assignment 第 1 条 javascript.info 文章展开，中文官方版在位）。'
    }
  },
  {
    id: 'big-o-fast-vs-slow',
    file: 'big-o-fast-vs-slow.svg',
    lessonId: 'javascript-time-complexity',
    sectionIndex: 3,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '快侧 · 数据翻倍步数温和',
        items: [
          'O(1) 常数：按索引取值永远一步',
          'O(log N)：每步砍半——翻倍只加一步',
          'O(N) 线性：步数与元素同速增长',
          'O(N log N)：对半拆 + 每半线性（merge sort）'
        ]
      },
      right: {
        title: '慢侧 · 数据翻倍步数暴涨',
        items: [
          'O(n²)：双层循环——10 项 100 步',
          'O(n³)：三层循环——100 项一百万步',
          'O(2ⁿ)：每加一项翻倍——10 项 1024 步',
          'O(N!)：排列组合——10! = 3,628,800'
        ]
      },
      note: 'Big O 度量「步数随数据规模怎么变」并丢弃常数（O(N/2) 与 O(10N) 都记 O(N)）——但小输入时常数真的有用：官方对照表里 N=1 时 O(n²) 一步反而快过 O(10N) 十步。等级选对，且在等级内尽可能高效。'
    }
  },
  {
    id: 'hashmap-key-to-bucket',
    file: 'hashmap-key-to-bucket.svg',
    lessonId: 'javascript-hashmap-data-structure',
    sectionIndex: 2,
    type: 'flow',
    data: {
      steps: [
        { label: '键 "Fred"', sub: '用户给的字符串 · 不直接访问桶' },
        { label: '散列函数', sub: '质数 31 逐字符乘加' },
        { label: '散列码 385', sub: '纯数字——桶索引的候选地址' },
        { label: '取模 % 16', sub: '385 % 16 → 落进 0–15 的桶' },
        { label: '桶：比键取值', sub: '冲突共存——键相同才返回值' }
      ],
      note: '官方存值三步：散列键得散列码 → 找到该索引的桶 → 存入键值对。取值多一步比键：散列码只是位置，不同键可能同码（冲突必然发生——鸽笼原理）；每个桶是一条链表，住多个节点时键是唯一身份。平均 O(1)，最坏 O(n)（全部数据散列到同一个桶）。'
    }
  },
  {
    id: 'bfs-vs-dfs-shapes',
    file: 'bfs-vs-dfs-shapes.svg',
    lessonId: 'javascript-common-data-structures-and-algorithms',
    sectionIndex: 2,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: 'BFS 广度优先 · 用队列',
        items: [
          '先进先出：先发现的先处理',
          '一层扫完再下一层',
          '第一次到达的层数即最少步数'
        ]
      },
      right: {
        title: 'DFS 深度优先 · 用栈',
        items: [
          '后进先出：最后发现的先处理',
          '一条路走到底 · 走不通再回头',
          '必须记录已访问——有环会无尽循环'
        ]
      },
      note: '官方点名：队列与栈的原理分别是广度优先搜索与深度优先搜索使用的概念。骑士之旅项目官方说两者都可行——但其中一个需要你处理「陷入无尽循环」的可能性；目标是「最短路径」时，先想清楚哪种搜索的层数即步数。'
    }
  },
  /* ---------- World 3 批次 4 阶段 4（2026-09-27，v4.11.26，通宵轮）：「Git 进阶」+「JS 收尾」5 课
   * 逐课判据决策：
   * - a-deeper-look-at-git **配 1 张**（git-reset-three-levels，flow，sectionIndex 2）：
   *   reset 三档是「同一条三步流水线停在第几步」的递进关系，官方行文按档分段、
   *   三层（HEAD/暂存区/工作目录）的递进不直观——flow 三步把「每深一档多动一层」
   *   画成叠加结构。
   * - working-with-remotes **配 1 张**（revert-vs-reset-force，compare columns，
   *   sectionIndex 2）：本课核心就是两条撤销路的对比（只增不改 vs 改写覆写），
   *   compare 双列是天然形态。
   * - using-git-in-the-real-world **配 1 张**（git-oss-workflow，flow，sectionIndex 2）：
   *   官方正文自带 mermaid 工作流图——本站按同一结构用既有 flow 图型复刻（禁嵌
   *   第三方渲染器），环路五步 + 红线说明。
   * - battleship **不配**：Project 课任务纪律（流程图会变相给实现提示，与全部
   *   Project 课同口径）。
   * - conclusion **不配**：官方原文为约 1.2KB 的结语祝贺信，无结构可画（与
   *   choose-your-path-forward 结语课同判据）。 ---------- */
  {
    id: 'git-reset-three-levels',
    file: 'git-reset-three-levels.svg',
    lessonId: 'javascript-a-deeper-look-at-git',
    sectionIndex: 2,
    type: 'flow',
    data: {
      steps: [
        { label: '--soft', sub: '只移 HEAD——改动留在暂存区' },
        { label: '默认档', sub: '+ 重置暂存区——改动退回未暂存' },
        { label: '--hard', sub: '+ 覆盖工作目录——三层全动 · 破坏性' }
      ],
      note: 'reset 的完整流程是三步：移 HEAD、用新指向更新暂存区、覆盖工作目录——标志位决定做到第几步停。--soft 是「更强大的 amend」（回退多个提交、改动合成新提交）；默认档是拆分提交的原理（改动回到未暂存、分别再提交）；--hard 可能毁数据——用之前必须确切知道为什么，共享仓库里还要让同事知情。'
    }
  },
  {
    id: 'revert-vs-reset-force',
    file: 'revert-vs-reset-force.svg',
    lessonId: 'javascript-working-with-remotes',
    sectionIndex: 2,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: 'revert · 只增不改（官方正解）',
        items: [
          '生成反转原提交改动的新提交',
          '历史只增不改——旧提交全部还在',
          '正常 push 即可 · 对协作者零风险'
        ]
      },
      right: {
        title: 'reset + force · 改写覆写（禁区）',
        items: [
          'reset 改写本地历史',
          'force 用改写后的历史覆写远端',
          '别人基于旧提交的工作直接断链',
          '确需强推优先 --force-with-lease'
        ]
      },
      note: '分界线只有一条：历史发布了吗？发布了就用 revert（只增不改），没发布才轮到 reset。官方灾难实验：push 后 rebase 删提交再 force——第四个文件本地远端双双消失。--force-with-lease 是带保险丝的强推：目标分支被别人更新过就报错拒绝，先 fetch 再决定；合法强推场景只有更新 PR 与清除误传的敏感信息。'
    }
  },
  {
    id: 'git-oss-workflow',
    file: 'git-oss-workflow.svg',
    lessonId: 'javascript-using-git-in-the-real-world',
    sectionIndex: 2,
    type: 'flow',
    data: {
      steps: [
        { label: 'Upstream 原仓库', sub: '只读：local 只能 fetch 不能 push' },
        { label: '本地 main', sub: 'fetch upstream + merge 同步基线' },
        { label: '功能分支', sub: '先把 main 合进脏分支消化冲突' },
        { label: '你的 fork（origin）', sub: 'push origin 功能分支' },
        { label: 'Pull Request', sub: '维护者评审合并——环路回起点' }
      ],
      note: '按官方正文 mermaid 工作流图同一结构绘制：Upstream → fetch → Local main → checkout 功能分支 → push origin → Fork → Create PR → 维护者 Merge → 回 Upstream。官方红线：没有被指派的 issue 就停在 push——测试/练习 PR 会被视为 spam、不经评审直接关闭。fetch + merge 与 pull 完全等价，官方拆开写是为了显式走过每一步。'
    }
  },
  /* ---------- World 4 批次 5 阶段 1（2026-09-27，v4.11.27，通宵轮）：「动画」3 课
   * 逐课判据决策（LESSON-PAGE-GUIDE §4.1 五条逐条过）：
   * - transforms **配 1 张**（transforms-chain-order，compare columns，sectionIndex 3）：
   *   链式顺序的坐标系语义是看不见的空间推理（判据①配）——红盒沿斜轴跑、蓝盒
   *   直走再自转，文字描述远不如并排对照直观；每次写链式变换都会回看（判据②配）；
   *   全站既有 87 张无变换类图（判据③不重复）；非比喻（判据④不适用）；本章
   *   开篇课核心概念（判据⑤配）。
   * - transitions **不配**：候选是层叠上下文的 stack 图——但本课正文只有一段工程
   *   结论（「transform 会创建上下文、堆多了 repaint 连坐」），机制的正式讲解是
   *   Assignment 指定的 Josh Comeau 专文；给一段结论画图是复述不是补充（判据①
   *   文字已够 + 判据④同型），与阶段 3 space-complexity「官方代码已并排、图为
   *   复述」同一取舍。四子属性拆解为文字列表已足（判据①不配）。
   * - keyframes **配 1 张**（keyframes-timeline，flow，sectionIndex 3）：百分比
   *   时间轴是流程结构（判据①配）；「一次 iteration = 单向周期」是官方专门设防
   *   的误区、写动画必回看（判据②⑤配）；全站无同类图（判据③不重复）。一图
   *   覆盖 @keyframes 时间轴与 iteration 语义相邻两章，按「放在后一章之后做小结」
   *   取 sectionIndex 3。图型只用既有 compare / flow，零图型库扩展。 ---------- */
  {
    id: 'transforms-chain-order',
    file: 'transforms-chain-order.svg',
    lessonId: 'node-path-advanced-html-and-css-transforms',
    sectionIndex: 3,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '先转后移 · rotate(45deg) translate(200%)',
        items: [
          '① 旋转 45 度——自己的 X/Y 轴跟着斜掉',
          '② 沿斜掉的 X 轴平移 200%',
          '终点：斜着滑出去，落在右下方'
        ]
      },
      right: {
        title: '先移后转 · translate(200%) rotate(45deg)',
        items: [
          '① 沿原始 X 轴平移 200%——水平走到正右方',
          '② 在新位置原地旋转 45 度',
          '终点：直走再自转，停在正右方'
        ]
      },
      note: '两个盒子起点相同、函数组合相同，只是顺序不同，终点就完全不同——链式变换从左到右依次生效，后一个函数作用在「前一个变换之后」的坐标系上。顺序的唯一例外是 perspective：与多个函数同写时必须放最前（最左），否则三维效果不成立。'
    }
  },
  {
    id: 'keyframes-timeline',
    file: 'keyframes-timeline.svg',
    lessonId: 'node-path-advanced-html-and-css-keyframes',
    sectionIndex: 3,
    type: 'flow',
    data: {
      steps: [
        { label: 'from / 0%', sub: '起点帧：红色（from 是 0% 的别名 · 第 0 秒）' },
        { label: '50%', sub: '中间帧只能百分比：变蓝 + scale(2) 放大' },
        { label: 'to / 100%', sub: '终点帧：绿色（to 是 100% 的别名 · 第 2 秒）' }
      ],
      note: '三步合起来是 @keyframes 定义的「一个动画周期」（按 duration 2s 折算秒数）。iteration-count 数的是单向周期：count 2 + alternate = 红→绿、绿→红然后停；不写 alternate 则每周期结束跳回起点重播。别把一次 iteration 当成一个来回——官方专门设防的误区。'
    }
  },
  /* ---------- World 4 批次 5 阶段 2（2026-09-27，v4.11.28，通宵轮）：「无障碍」8 课
   * 逐课判据决策（LESSON-PAGE-GUIDE §4.1 五条逐条过）：
   * - introduction-to-web-accessibility **不配**：动机定调课——电梯比喻与残障类型
   *   是叙述性框架，无可解剖的空间/流程/对比结构（判据①不配；CS 引言课「动机
   *   定调课无结构可画」同型先例）。
   * - wcag **不配**：候选是 POUR 四原则图——但官方正文即带反例的四条编号列表，
   *   平行列表文字已足，画图是复述（判据①文字已够）；三级符合度是两个数字
   *   两行文字，同样不足配图。
   * - semantic-html **不配**：候选是七个地标在页面的分布图——官方正文自带示意
   *   配图（本课页面自身的地标结构截图），「官方配图已足」按 introduction-to-
   *   flexbox 先例不配；div vs button 播报对比已在示例区代码并排（判据①复述）。
   * - accessible-colors **配 1 张**（contrast-thresholds，compare columns，
   *   sectionIndex 1）：AA 与 AAA 两档 × 正常/大号文本四阈值是数值门槛关系——
   *   并排对照防「记串档位」（判据①数值对比配；Big-O 快慢对比先例）；选色定稿
   *   必回看（判据②配）；全站无对比度阈值图（判据③不重复）；本章核心数字
   *   （判据⑤配）。大号文本界线与三类例外收进两列与图注。
   * - keyboard-navigation **配 1 张**（hidden-content-paths，compare columns，
   *   sectionIndex 3）：隐藏内容两种方案（子项 tabindex=-1 vs 容器 display:none）
   *   在「键盘焦点 / 辅助技术播报」两维度的覆盖差异是本课最易做错的结构——部分
   *   修复 vs 完整修复的对照（判据①对比配）；写菜单/模态框必回看（判据②配）；
   *   全站无同类图（判据③不重复）。tabindex 三值语义文字列表已足不另配。
   * - meaningful-text **不配**：报错三级进化与链接好坏对照的官方代码已在示例区
   *   并排——「官方代码已并排、图为复述」按 more-testing / space-complexity
   *   先例不配（判据①复述）。
   * - wai-aria **配 1 张**（aria-attributes-map，map，sectionIndex 4）：四个
   *   aria-* 属性各自修改无障碍树的哪个属性（名称/描述/节点存在）是跨两节的
   *   结构映射——正文分节讲、一图收拢「谁改哪里」（判据①结构映射配）；写任何
   *   ARIA 前必回看（判据②配）；全站无 ARIA 类图（判据③不重复）；本章技术
   *   密度最高课的核心骨架（判据⑤配）。按「放后一节做小结」取 sectionIndex 4
   *   （aria-hidden 节，覆盖标签属性与隐藏两大节）。ARIA 五规则是编号列表、
   *   文字已足不另配。
   * - accessibility-auditing **不配**：候选是三工具分工对比——正文三段已每工具
   *   一段、guide 里给了分工结论，表格化对照是复述（判据①文字已够；transitions
   *   同一取舍）。
   * 图型只用既有 compare / map，零图型库扩展。 ---------- */
  {
    id: 'contrast-thresholds',
    file: 'contrast-thresholds.svg',
    lessonId: 'node-path-advanced-html-and-css-accessible-colors',
    sectionIndex: 1,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: 'AA 级（最低要求）· 行业默认目标',
        items: [
          '正常文本：对比度至少 4.5 : 1',
          '大号文本：对比度至少 3 : 1',
          '大号界线：≥ 18pt/24px（粗体 ≥ 14pt/18.66px）'
        ]
      },
      right: {
        title: 'AAA 级（增强）· 不建议全站追求',
        items: [
          '正常文本：对比度至少 7 : 1',
          '大号文本：对比度至少 4.5 : 1',
          '三类例外两级同免：偶然性文本 / 禁用组件 / logo'
        ]
      },
      caption: '对比度 = 两色亮度差（白底白字 1:1 到白底黑字 21:1）；数字不用背——WebAIM Contrast Checker 或 DevTools 替你算'
    }
  },
  {
    id: 'hidden-content-paths',
    file: 'hidden-content-paths.svg',
    lessonId: 'node-path-advanced-html-and-css-keyboard-navigation',
    sectionIndex: 3,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '子项逐个 tabindex="-1" · 部分修复',
        items: [
          '键盘焦点：移出 Tab 序列 ✓',
          '辅助技术：仍能访问并播报 ✗',
          '代价：每个子项都要加，新增子项易漏'
        ]
      },
      right: {
        title: '容器 display:none / visibility:hidden · 正解',
        items: [
          '键盘焦点：整容器移出 Tab 序列 ✓',
          '辅助技术：不再播报 ✓',
          '显示时：移除或覆盖该属性即可'
        ]
      },
      caption: '菜单 / 模态框未展开时，内容要对键盘与辅助技术同时隐藏——只藏一边就会「焦点消失在看不见的元素里」'
    }
  },
  {
    id: 'aria-attributes-map',
    file: 'aria-attributes-map.svg',
    lessonId: 'node-path-advanced-html-and-css-wai-aria',
    sectionIndex: 4,
    type: 'map',
    data: {
      center: { label: '无障碍树', sub: 'ARIA 只改这棵树——外观、行为、可聚焦、键盘事件都改不了' },
      satellites: [
        { label: 'aria-label', desc: '改「名称」：字符串覆盖原生标签；对 div/span 等无角色元素无效；别当注音用' },
        { label: 'aria-labelledby', desc: '改「名称」：优先级最高；拼接多个 id 引用、可自引用；引用目标可视觉隐藏' },
        { label: 'aria-describedby', desc: '改「描述」：名称之外追加播报补充说明（如密码格式要求）' },
        { label: 'aria-hidden="true"', desc: '整节点移出树：视觉保留；子元素连坐且 false 救不回；可聚焦元素禁用' }
      ]
    }
  },
  /* ---------- World 4 批次 5 阶段 3（2026-09-27，v4.11.29，通宵轮，World 4 收组）：
   * 「响应式设计」5 课逐课判据决策（LESSON-PAGE-GUIDE §4.1 五条逐条过）：
   * - introduction-to-responsive-design **不配**：动机定调课——「术语名不副实 /
   *   2007 年起硬性要求 / 320px 下限与 max-width 居中上限」全部是叙述性结论，
   *   无可解剖的空间/流程/对比结构（判据①不配；introduction-to-web-accessibility
   *   「动机定调课无结构可画」同型先例）。
   * - natural-responsiveness **不配**：候选是「天然响应贴士清单」图——正文即五条
   *   贴士的平行列表（viewport / 避免固定宽高 / 别设 height / 小尺寸可写死 /
   *   flex-grid），列表文字已足，画成清单图是复述（判据①文字已够；wcag POUR
   *   列表同一取舍）。max-width vs width 的行为差异已在示例区代码并排（复述）。
   * - responsive-images **配 1 张**（image-fit-two-families，compare columns，
   *   sectionIndex 2）：背景图一族（background-size/position 只认容器背景）与
   *   img 一族（object-fit 只认替换元素、默认 fill 危险）的**作用对象分工**是
   *   看不见的选择规则——选错族属性静默无效是本课最易踩的坑（判据①对比配）；
   *   每次处理图片都要先问「图是怎么放进来的」（判据②配）；全站无图片适配类图
   *   （判据③不重复）；两族 cover/contain 语义相通的关系图比文字两段更易记
   *   （判据⑤配）。按「一图覆盖相邻两章放后一章做小结」取 sectionIndex 2
   *   （object-fit 章后，收拢 §2 背景图族与 §3 img 族）。height:auto 底线写法
   *   与 picture 换图路线文字已足不另配。
   * - media-queries **不配**：候选一是断点区间带图——官方立场明说断点取值
   *   「意见相当纷纭」「具体位置不重要」，把 500/1000/1200/2000 参考值固化成图
   *   有把参考值变成规范的风险（判据①不配——文字枚举已足且图形化违背原文精神）；
   *   候选二是 @media 语法解剖——语法只有「条件 + 样式块」两层，正文代码已直观
   *   （复述）。缩放改变有效分辨率、print、容器查询均为单点事实无结构。
   * - homepage **不配**：Project 课按任务型课口径不配（既有纪律）。
   * 图型只用既有 compare，零图型库扩展。 ---------- */
  {
    id: 'image-fit-two-families',
    file: 'image-fit-two-families.svg',
    lessonId: 'node-path-advanced-html-and-css-responsive-images',
    sectionIndex: 2,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '背景图一族 · background-size / -position',
        items: [
          '写在容器上，只认 CSS 背景图（对 <img> 无效）',
          'size: cover 铺满容器、裁剪最少',
          'position: center 装不下也永远居中'
        ]
      },
      right: {
        title: 'img 一族 · object-fit / -position',
        items: [
          '写在 <img> 上，专为替换元素设计',
          '默认 fill：拉伸变形——务必显式声明',
          'cover 填满裁边 / contain 完整留边'
        ]
      },
      caption: '两族共享 cover/contain 语义，选择只看图怎么放进来：background-image 还是 <img>；底线写法（弹性宽 + height: auto）先于两族'
    }
  },
  /* ---------- World 5 批次 6 阶段 1（2026-09-27，v4.11.30，通宵轮，World 5 开篇）：
   * react 课程「引言」+「React 入门」两章 8 课逐课判据决策（LESSON-PAGE-GUIDE
   * §4.1 五条逐条过）：
   * - how-this-course-will-work（react 版）**不配**：开课导语课——课程路线图 /
   *   JS 前置 / 心态预告全部是叙述性内容，无可解剖的空间/流程/对比结构
   *   （判据①不配；javascript 引言课同型先例）。
   * - introduction-to-react **不配**：动机定调课（React 是什么 + 四条理由）——
   *   叙述性结论清单（判据①不配；introduction-to-responsive-design「动机定调课
   *   无结构可画」同型先例）；库 vs 框架的「谁调用谁」判据是一句话结论、文字
   *   两段已足（判据④比喻/结论类文字已说清）。
   * - setting-up-a-react-environment **不配**：环境配置操作课——命令、交互问答、
   *   GitHub 连接是一次性操作（照做完就不再回看，判据②不配；auditing 工具操作课
   *   同型）；main.jsx 五步与目录结构已在示例区逐行编号注释（代码并排即复述）。
   * - react-components **不配**：组件拆解示例官方已配插图（statically 00.png，
   *   官方课页可看）——官方配图已足（semantic-html 同型先例）；大小写判别规则是
   *   单点事实无结构（判据①不配）。
   * - what-is-jsx **不配**：三条规则（单根/闭合/驼峰）官方正反例代码已在示例区
   *   并排（meaningful-text「官方代码已并排」同型先例——图为复述）；「JSX 是
   *   createElement 语法糖」是一句话本质（判据④文字已说清）；转换实战是逐错
   *   修复的过程叙述、正文四段已足。
   * - passing-data-between-components **不配**：候选是 props 单向数据流图——核心
   *   是「父传子、改动不回流」一句工程结论，正文一段已说清、画箭头图是复述
   *   （transitions「层叠上下文一段结论画图为复述」同一取舍，判据①④）；
   *   Button 演化史四版代码已在示例区并排对照。
   * - rendering-techniques **配 1 张**（conditional-rendering-toolbox，map
   *   center+satellites，sectionIndex 3）：三套条件渲染工具的**选型规则**（何时用
   *   哪套 + 各自的坑）是看不见的决策知识——正文分节教「每套怎么用」，但「怎么
   *   选」从未并排呈现，图补的正是决策表视角（判据①配——中心辐射型概念区分）；
   *   写任何条件渲染都要先选型（判据②反复回看）；全站无条件渲染类图（判据③
   *   不重复）；&& 数字坑是官方专门设警告块的点（判据⑤难课核心）。按「一图覆盖
   *   相邻两章放后一章做小结」取 sectionIndex 3（收拢 §2 三元与 && / §3 if 守卫）。
   * - keys-in-react **配 1 张**（keys-matching-flow，flow，sectionIndex 1）：
   *   虚拟 DOM 重建 → 按 key 逐项配对 → 保实例/重建分叉 → 最小化写真实 DOM 是
   *   **看不见的运行时机制**、本课最难抓手（判据①流程配）；每次渲染列表都要想
   *   key 从哪来（判据②反复回看）；全站无 key/虚拟 DOM 类图（判据③不重复）；
   *   World 5 前段最难课的核心概念（判据⑤配）。一图覆盖 §0§1 两章按「放后一章
   *   做小结」取 sectionIndex 1；第 5 步副线兼顾 §3「换 key 重置」第二用途。
   * 图型只用既有 map 与 flow，零图型库扩展。 ---------- */
  {
    id: 'conditional-rendering-toolbox',
    file: 'conditional-rendering-toolbox.svg',
    lessonId: 'node-path-react-new-rendering-techniques',
    sectionIndex: 3,
    type: 'map',
    data: {
      center: { label: '条件渲染工具箱', sub: '先数分支再挑工具——挑什么都是 JSX 大括号里的 JS 表达式' },
      satellites: [
        { label: '三元 ? :', desc: '二选一：成立渲染 A、否则渲染 B；「什么都不渲染」的分支写 null' },
        { label: '&& 运算符', desc: '满足才渲染：假时渲染空；坑——左边别放数字，0 会被渲染出来' },
        { label: 'if 守卫提前返回', desc: '多分支与边界先行：Loading 与空态先接住，两关都过再渲染主列表' },
        { label: '嵌套组合', desc: '嵌套三元与多段 && 等价但「看着吓人」——分支多时优先守卫' }
      ]
    }
  },
  {
    id: 'keys-matching-flow',
    file: 'keys-matching-flow.svg',
    lessonId: 'node-path-react-new-keys-in-react',
    sectionIndex: 1,
    type: 'flow',
    data: {
      steps: [
        { label: '状态/数据变化', sub: '触发重渲染' },
        { label: '重建虚拟 DOM', sub: '组件函数再跑一遍' },
        { label: '新旧对比（diff）', sub: '列表项按 key 逐项配对' },
        { label: 'key 没变 → 实例保留', sub: '状态延续、最小更新' },
        { label: 'key 变了 → 全新实例', sub: '状态清零；故意换 key = 强制重开' },
        { label: '写真实 DOM', sub: '只动真正变化的部分' }
      ],
      note: '动态列表的 key 必须唯一且稳定：从数据推出（每项的 id）、不现场生成、会变的列表慎用 index'
    }
  },
  /* ---------- World 5 批次 6 阶段 2（2026-09-28，v4.11.31）新增 2 张 ----------
   * 配图判据逐课结论登记在 diagrams.js 清单的同批注释（五课不配理由在彼处）；
   * 图型只用既有 map 与 compare columns，零图型库扩展。
   * - useeffect-forms-selector（map，side-effects §2）：三形态选型是看不见的
   *   决策规则——conditional-rendering-toolbox（同为 map 选型图）先例同型。
   * - lifecycle-useeffect-mapping（compare columns，lifecycle-methods §3）：
   *   两套 API 的四行对应关系，columns 双列并排是映射知识的自然形状。 */
  {
    id: 'useeffect-forms-selector',
    file: 'useeffect-forms-selector.svg',
    lessonId: 'node-path-react-new-how-to-deal-with-side-effects',
    sectionIndex: 2,
    type: 'map',
    data: {
      center: { label: 'useEffect 三形态选型', sub: '依赖数组决定何时执行，返回的清理函数决定如何退场' },
      satellites: [
        { label: '无依赖数组', desc: '每次渲染后都执行——Clock 第 2 车的原因，绝大多数场景是误用信号' },
        { label: '空数组 []', desc: '只在挂载时执行一次：一次性初始化与取数据的家，配 cleanup 卸载退场' },
        { label: '依赖 [a, b]', desc: '挂载时 + a 或 b 变化时执行：跟随某个值同步外部系统的标准形态' },
        { label: '返回清理函数', desc: '叠加项非第四种数组：重跑前与卸载时执行——定时器、订阅、监听器的退场通道' }
      ]
    }
  },
  {
    id: 'lifecycle-useeffect-mapping',
    file: 'lifecycle-useeffect-mapping.svg',
    lessonId: 'node-path-react-new-component-lifecycle-methods',
    sectionIndex: 3,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '类组件生命周期方法',
        items: [
          'render()：唯一必需，挂载与更新都跑，必须纯',
          'componentDidMount()：挂载进 DOM 后——取数据的家',
          'componentDidUpdate()：每次重渲染后——setState 必须加 prevProps 条件防无限循环',
          'componentWillUnmount()：卸载销毁前——取消请求、清定时器的家'
        ]
      },
      right: {
        title: 'useEffect 对应形态',
        items: [
          '执行体每次渲染后跑，由依赖数组收敛时机',
          '空依赖数组 []：只挂载时执行 ≙ didMount',
          '带依赖 [a, b]：挂载 + 依赖变化时 ≙ didMount 与带条件 didUpdate',
          '回调返回的清理函数：重跑前与卸载时 ≙ willUnmount'
        ]
      },
      note: '同一件事两种写法：读旧代码用类方法名思考，写新代码用 effect 形态实现'
    }
  },
  /* ---------- World 5 批次 6 阶段 3（2026-09-28，v4.11.32，World 5 收组）新增 3 张 ----------
   * 配图判据逐课结论登记在 diagrams.js 清单的同批注释（七课不配理由在彼处）；
   * 图型只用既有 compare columns / flow / map，零图型库扩展。
   * - testing-query-families（compare columns，intro-to-react-testing §2）：
   *   前缀 × ByX 二维矩阵——columns 双列各管一维是矩阵知识的自然形状。
   * - router-nested-outlet（flow 5 步，react-router §2）：URL 到组件的匹配链条
   *   ——keys-matching-flow（同为跨渲染机制 flow）先例同型。
   * - memoization-toolbox（map，refs-and-memoization §4）：四工具选型——
   *   useeffect-forms-selector（同为选型 map）先例同型。 */
  {
    id: 'testing-query-families',
    file: 'testing-query-families.svg',
    lessonId: 'node-path-react-new-introduction-to-react-testing',
    sectionIndex: 2,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '前缀三家族：找不到时的行为',
        items: [
          'getBy…：找不到立即抛错——找「应该在」的元素',
          'queryBy…：找不到返回 null——断言「不该在」只能用它',
          'findBy…：返回 Promise 异步等待——等延迟渲染的内容（要 await）'
        ]
      },
      right: {
        title: 'ByX 抓手：官方优先级从高到低',
        items: [
          'ByRole 首选：按 ARIA 角色配 name——天然校验可访问性',
          'ByLabelText / ByPlaceholderText：表单元素专用',
          'ByText：按可见文本；ByAltText / ByTitle：图片与提示',
          'ByTestId 垫底：前几种都不可用时的逃生舱'
        ]
      },
      note: '一次查询 = 前缀 × ByX（如 getByRole、findByText）：先想用户怎么感知选 ByX，再想该不该在选前缀'
    }
  },
  {
    id: 'router-nested-outlet',
    file: 'router-nested-outlet.svg',
    lessonId: 'node-path-react-new-react-router',
    sectionIndex: 2,
    type: 'flow',
    data: {
      steps: [
        '地址 /profile/popeye：Link 点击或手输到达',
        'router 逐段匹配路由树：profile 命中父路由、children 的 popeye 命中子路由',
        '渲染父组件 Profile：页面骨架与导航就位',
        'Outlet 位置被替换成子组件 Popeye——index 路由则是 /profile 不带子段时的默认填充',
        '任何一段没匹配：渲染 errorElement 错误页兜底'
      ],
      note: '嵌套路由 = 父模板 + Outlet 洞 + children 填充物；动态段 :name 把「匹配」变「取值」，useParams 读出'
    }
  },
  {
    id: 'memoization-toolbox',
    file: 'memoization-toolbox.svg',
    lessonId: 'node-path-react-new-refs-and-memoization',
    sectionIndex: 4,
    type: 'map',
    data: {
      center: { label: 'React 缓存工具箱', sub: '先用 Profiler 测量再动手——过早优化是万恶之源' },
      satellites: [
        { label: 'useMemo', desc: '缓存任何值：昂贵计算只在依赖变化时重算，否则返回缓存' },
        { label: 'useCallback', desc: '只缓存函数：useMemo(() => fn, deps) 的简写——配 memo 子组件防引用变化' },
        { label: 'memo()', desc: '包裹组件：props 引用相等跳过重渲染——父渲染不连带' },
        { label: 'React Compiler', desc: '构建期自动记忆化：多数场景不再手写——手动知识仍必修' }
      ]
    }
  },
  /* 超长轮批次 7 阶段 1（2026-09-28，v4.11.33，World 6 收组）：sql-join-four-flavors
   * （map，databases-and-sql §4）——四种 JOIN「各保留哪些行」决策卡片，判据见 diagrams.js 清单注释。 */
  {
    id: 'sql-join-four-flavors',
    file: 'sql-join-four-flavors.svg',
    lessonId: 'node-path-databases-databases-and-sql',
    sectionIndex: 4,
    type: 'map',
    data: {
      center: { label: 'JOIN 四种取舍', sub: '左表 = FROM 里那张；ON 给拉链列' },
      satellites: [
        { label: 'INNER JOIN', desc: '只保留两表匹配上的行——95% 场景；没匹配的两侧都丢' },
        { label: 'LEFT OUTER', desc: '左表全保留、右表匹配的加进来；右表没对上的格子填 NULL' },
        { label: 'RIGHT OUTER', desc: '右表全保留、左表匹配的加进来；左表没对上的格子填 NULL' },
        { label: 'FULL OUTER', desc: '两表所有行全保留；任何对不上的格子都填 NULL' }
      ]
    }
  },
  /* 超长轮批次 7 阶段 2（2026-09-28，v4.11.34，NodeJS 入门 6 课 + Express 11 课开放）：5 张
   * ——express-request-journey（flow，intro-express §3）/ mvc-middleman（map，controllers §0）/
   * static-vs-dynamic-hosting（compare，deployment §1）/ prg-pattern（flow，forms §1）/
   * parameterized-query（compare，using-postgresql §4）。判据五条逐课过筛记录（含 12 课
   * 不配理由）住 diagrams.js 清单批次注释。 */
  {
    id: 'express-request-journey',
    file: 'express-request-journey.svg',
    lessonId: 'node-path-nodejs-introduction-to-express',
    sectionIndex: 3,
    type: 'flow',
    data: {
      steps: [
        { label: '浏览器发 GET /', sub: '地址栏导航的本质' },
        { label: '包进 request 对象', sub: 'Express 收请求' },
        { label: '穿过中间件链', sub: '逐环处理或放行' },
        { label: '第一个匹配的路由接手', sub: '动词 + 路径双检查' },
        { label: 'req / res 传进回调', sub: '第一、二参数' },
        { label: 'res.send 结束循环', sub: '浏览器收到响应' }
      ],
      note: '路由顺序很重要：Express 把请求交给第一个匹配动词与路径的路由——后面的同形路由永远轮不到。'
    }
  },
  {
    id: 'mvc-middleman',
    file: 'mvc-middleman.svg',
    lessonId: 'nodejs-controllers',
    sectionIndex: 0,
    type: 'map',
    data: {
      center: { label: '控制器 Controller', sub: '终极中间人：知道该做什么，难活全委派' },
      satellites: [
        { label: '模型 Model', desc: '数据住这里——控制器知道问什么，数据库重活模型自己干' },
        { label: '视图 View', desc: 'HTML 在这里拼——控制器定渲染哪个视图，细节视图自己管' },
        { label: '路由 Route', desc: '请求入口——动词加路径匹配后交给对应控制器函数' },
        { label: '响应 Response', desc: '控制器拿渲染结果经 res 发回浏览器、结束循环' }
      ]
    }
  },
  {
    id: 'static-vs-dynamic-hosting',
    file: 'static-vs-dynamic-hosting.svg',
    lessonId: 'node-path-nodejs-deployment',
    sectionIndex: 1,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '静态网站（发文件）',
        items: [
          '预先写好的 HTML 页面',
          '每个访问者看到相同内容',
          '只需 HTML / CSS / JavaScript',
          'GitHub Pages、Netlify、Vercel 就能托管'
        ]
      },
      right: {
        title: '动态网站（跑程序）',
        items: [
          '内容随访问用户变化——X 时间线因人而异',
          '额外需要服务端应用与数据库',
          'Pages / Netlify / Vercel 跑不了 Node、没有数据库',
          '要用 PaaS（Railway / Render）或云厂商（AWS / GCP / Azure）'
        ]
      },
      note: '托管选型只问一个问题：网站需不需要「跑程序」？发文件就够走静态托管，要跑 Node 加数据库走 PaaS。'
    }
  },
  {
    id: 'prg-pattern',
    file: 'prg-pattern.svg',
    lessonId: 'nodejs-forms-and-data-handling',
    sectionIndex: 1,
    type: 'flow',
    data: {
      steps: [
        { label: '提交表单 POST /new', sub: '带表单数据' },
        { label: '控制器处理', sub: '与数据库沟通、存数据' },
        { label: '响应重定向', sub: '303 → /' },
        { label: '浏览器改发 GET /', sub: '自动跟随' },
        { label: '渲染最新视图', sub: '新留言上首页' }
      ],
      note: '重定向后刷新只重放无害的 GET——不重复插数据；POST 后直接渲染的话，刷新就是重复提交。'
    }
  },
  {
    id: 'parameterized-query',
    file: 'parameterized-query.svg',
    lessonId: 'nodejs-using-postgresql',
    sectionIndex: 4,
    type: 'compare',
    data: {
      mode: 'columns',
      left: {
        title: '字符串拼接（危险）',
        items: [
          '用户输入直接拼进 SQL 字符串',
          '输入混进指令、成为 SQL 的一部分',
          '输入 sike\'); DROP TABLE usernames; -- 整张表被删',
          '这就是 SQL 注入'
        ]
      },
      right: {
        title: '参数化查询（pg 解法）',
        items: [
          'SQL 结构先定死：VALUES ($1) 占位',
          '输入放进数组作 query 第二参数',
          '$1 永远是数据、不可能变成指令',
          '转义与类型处理由 pg 代劳'
        ]
      },
      note: '与表单课「转义在输出处做」同一总纲：数据与指令的边界必须有人守——参数化是数据库这侧的守门人。'
    }
  },
  {
    "id": "auth-session-chain",
    "file": "auth-session-chain.svg",
    "lessonId": "node-path-nodejs-authentication-basics",
    "sectionIndex": 3,
    "type": "flow",
    "data": {
      "steps": [
        {
          "label": "登录 POST /log-in",
          "sub": "passport.authenticate 触发"
        },
        {
          "label": "LocalStrategy 查库比对",
          "sub": "bcrypt.compare 明文与哈希"
        },
        {
          "label": "serializeUser 存 user.id",
          "sub": "只把 id 写进会话数据"
        },
        {
          "label": "connect.sid cookie 下发",
          "sub": "express-session 幕后创建"
        },
        {
          "label": "后续请求带 cookie 回来",
          "sub": "passport 匹配到会话"
        },
        {
          "label": "deserializeUser 按 id 查库",
          "sub": "用户对象挂上 req.user"
        }
      ],
      "note": "三个函数只定义不手动调用：LocalStrategy 管「验证」、序列化对管「存取」——登录态住在 cookie，服务器每次按 id 还原用户。"
    }
  },
  {
    "id": "prisma-three-pillars",
    "file": "prisma-three-pillars.svg",
    "lessonId": "nodejs-prisma-orm",
    "sectionIndex": 4,
    "type": "map",
    "data": {
      "center": {
        "label": "Prisma ORM",
        "sub": "schema 是单一事实源"
      },
      "satellites": [
        {
          "label": "Schema",
          "desc": "PSL 定义 models 与 relations——住进代码库、被版本控制追踪（治「代码库看不懂表」）"
        },
        {
          "label": "Client",
          "desc": "npx prisma generate 按 schema 定制生成——prisma.message.create/findMany（治「重复查询代码」）"
        },
        {
          "label": "Migrate",
          "desc": "把 schema 变更应用到数据库——migrations 文件夹追踪、变更日志标准化（治「手写迁移易错」）"
        }
      ]
    }
  },
  {
    "id": "monolith-vs-decoupled",
    "file": "monolith-vs-decoupled.svg",
    "lessonId": "nodejs-api-basics",
    "sectionIndex": 0,
    "type": "compare",
    "data": {
      "mode": "columns",
      "left": {
        "title": "单体（渲染模板）",
        "items": [
          "一个 Express 应用包办一切",
          "路由 render EJS 模板回 HTML",
          "业务逻辑与视图逻辑混在一起",
          "前后端同一仓库、同一次部署"
        ]
      },
      "right": {
        "title": "前后端分离（Jamstack）",
        "items": [
          "后端只出 JSON（res.json）",
          "前端独立静态托管（Pages / Netlify）",
          "一个后端服务多个前端（网站/桌面/移动）",
          "分开部署——跨域要靠 CORS 放行"
        ]
      },
      "note": "分离的技术含量只有一行 res.json()；架构红利是模块化 + 一后端多前端；代价是跨域（CORS）与两次部署要各自照看。"
    }
  },
  {
    "id": "session-vs-token",
    "file": "session-vs-token.svg",
    "lessonId": "nodejs-api-security",
    "sectionIndex": 2,
    "type": "compare",
    "data": {
      "mode": "columns",
      "left": {
        "title": "会话认证（cookie）",
        "items": [
          "登录建会话，浏览器持 connect.sid",
          "服务器端存会话数据",
          "cookie 随每个请求自动带上",
          "前后端分离跨域时 cookie 复杂化"
        ]
      },
      "right": {
        "title": "令牌认证（JWT）",
        "items": [
          "登录签发一个令牌给前端",
          "服务器不存会话（无状态）",
          "令牌放 Authorization: Bearer 头",
          "可设过期，适合跨域 API"
        ]
      },
      "note": "换载体不换流程：Passport 仍是「检查载体 → 认证或拒绝」，只是载体从 cookie 换成令牌——Blog API 前后端分离后的认证形态。"
    }
  },
  {
    "id": "supertest-chain",
    "file": "supertest-chain.svg",
    "lessonId": "nodejs-testing-routes-and-controllers",
    "sectionIndex": 2,
    "type": "flow",
    "data": {
      "steps": [
        {
          "label": "测试文件建迷你 app",
          "sub": "挂被测 router、不调用 listen"
        },
        {
          "label": "request(app).get / .post",
          "sub": "supertest 直接对 app 发请求"
        },
        {
          "label": ".expect 链式断言",
          "sub": "响应头 / 响应体 / 状态码"
        },
        {
          "label": "POST 用 .then 串 GET",
          "sub": "验证写操作的副作用"
        },
        {
          "label": "done 传进最后一个 expect",
          "sub": "SuperTest 替我们标记完成"
        }
      ],
      "note": "app.js 只管启动（listen）不测；index.js 导出 router 才测——测试里另建一个不 listen 的 app，避免启动真服务器、还能跳过无关配置。"
    }
  },
  {
    "id": "dev-vs-test-db",
    "file": "dev-vs-test-db.svg",
    "lessonId": "node-path-nodejs-testing-database-operations",
    "sectionIndex": 3,
    "type": "compare",
    "data": {
      "mode": "columns",
      "left": {
        "title": "开发环境",
        "items": [
          "NODE_ENV=development",
          "连 DATABASE_URL",
          "inventory_application 库",
          "node app.js（可用 --env-file）"
        ]
      },
      "right": {
        "title": "测试环境",
        "items": [
          "Jest 默认 NODE_ENV=test",
          "连 TEST_DATABASE_URL",
          "test_ 前缀独立库",
          "process.loadEnvFile()（--env-file 用不了）"
        ]
      },
      "note": "同一份代码按 NODE_ENV 三元式切连接串：开发连开发库、Jest 里自动连测试库——绝不对生产库跑测试；再配 beforeEach 事务重置 + --runInBand 串行才隔离干净。"
    }
  },
  /* ---------- 超长续轮批次 7 阶段 4（2026-09-29，v4.11.36，World 8 求职 14 课、全站收官）新增 5 张 ----------
   * job-search-nine-steps（flow，strategy §1）/ interview-funnel（flow，interview §0）/
   * hidden-vs-visible-market（compare，networking §1）/ hiring-three-factors（map，
   * companies-want §2）/ lead-source-priority（flow，collect §1）。
   * 14 课判据五条过筛：配 5 张（全为知识课），9 课不配理由住 diagrams.js 清单批次注释。 */
  {
    "id": "job-search-nine-steps",
    "file": "job-search-nine-steps.svg",
    "lessonId": "node-path-getting-hired-strategy",
    "sectionIndex": 1,
    "type": "flow",
    "data": {
      "steps": [
        {
          "label": "弄清你的需求与技能",
          "sub": "一切从你开始"
        },
        {
          "label": "弄清公司要什么给什么",
          "sub": "三要素视角"
        },
        {
          "label": "提前铺垫提高胜率",
          "sub": "技能/叙事/作品集/形象"
        },
        {
          "label": "收集工作线索",
          "sub": "电子表格主数据库"
        },
        {
          "label": "筛选工作线索",
          "sub": "期望值 = 概率 × 价值"
        },
        {
          "label": "接触并申请",
          "sub": "迭代式、走侧门"
        },
        {
          "label": "面试",
          "sub": "七步漏斗"
        },
        {
          "label": "处理 offer",
          "sub": "别立刻接受"
        },
        {
          "label": "Profit??",
          "sub": "官方原文自带双问号"
        }
      ],
      "note": "第 1–3 步 =「准备求职」章，第 4–8 步 =「投递与面试」章。没有计划：要么海投简历纳闷为什么没回音，要么走完漫长流程才发现根本不想要那份工作。"
    }
  },
  {
    "id": "interview-funnel",
    "file": "interview-funnel.svg",
    "lessonId": "node-path-getting-hired-preparing-to-interview-and-interviewing",
    "sectionIndex": 0,
    "type": "flow",
    "data": {
      "steps": [
        {
          "label": "电话筛选",
          "sub": "常为 HR 约半小时"
        },
        {
          "label": "技术面试",
          "sub": "现场编码 / 逻辑题 / 白板"
        },
        {
          "label": "技术挑战",
          "sub": "带回家，最多一整天"
        },
        {
          "label": "契合面试",
          "sub": "见全团队，一票否决"
        },
        {
          "label": "Job Offer",
          "sub": "让细节落邮件"
        },
        {
          "label": "Offer 谈判",
          "sub": "另一 offer 是最强筹码"
        },
        {
          "label": "接受 Offer",
          "sub": "签约前别买房子"
        }
      ],
      "note": "技术挑战的位置随公司浮动——有时先做 take-home 再电话筛选；很多公司跳过轻量寒暄直接进技术筛选——按上限准备。"
    }
  },
  {
    "id": "hidden-vs-visible-market",
    "file": "hidden-vs-visible-market.svg",
    "lessonId": "node-path-getting-hired-professional-networking",
    "sectionIndex": 1,
    "type": "compare",
    "data": {
      "mode": "columns",
      "left": {
        "title": "隐藏就业市场（高达 80%）",
        "items": [
          "多数职位从不发布在网上——靠推荐与内推成交",
          "公司省去发布、筛选、面试的全部流程成本——宁愿走隐藏市场",
          "许多公司给成功内推的员工发奖金——传名激励双向",
          "入场券：让网络把你视作「拥有特定技能集的可靠个人」"
        ]
      },
      "right": {
        "title": "公开招聘职位（约 20%）",
        "items": [
          "刷招聘板只能看到约 20% 的职位——仍值得投",
          "海投 = 进入羊群：与海量申请者竞争更少的职位",
          "质量优先于数量：少量定制化申请好过几百份雷同简历",
          "选你觉得有趣、核心价值观你认同的公司"
        ]
      },
      "note": "比例因来源不同有出入，但隐藏市场真实存在且规模可观——策略不打它的主意，就是在自削胜算。"
    }
  },
  {
    "id": "hiring-three-factors",
    "file": "hiring-three-factors.svg",
    "lessonId": "node-path-getting-hired-what-companies-want",
    "sectionIndex": 2,
    "type": "map",
    "data": {
      "center": {
        "label": "招聘经理找什么",
        "sub": "两个门槛项 + 一个决定项"
      },
      "satellites": [
        {
          "label": "能力 Capability",
          "desc": "尽快创造价值——相关经验 + 技术门槛；新人用项目/开源/实习做社会证明破 catch-22"
        },
        {
          "label": "动机 Motivation",
          "desc": "成长曲线而非静态直线——自学走到这里 + 真实职业目标 + 学得飞快"
        },
        {
          "label": "契合 Fit",
          "desc": "团队想不想整天与你共事——几乎所有流程让全团队评估后期候选人，常是决定性一票"
        }
      ]
    }
  },
  {
    "id": "lead-source-priority",
    "file": "lead-source-priority.svg",
    "lessonId": "node-path-getting-hired-collecting-job-leads",
    "sectionIndex": 1,
    "type": "flow",
    "data": {
      "steps": [
        {
          "label": "你的人脉",
          "sub": "含社区认识的人——最高概率/质量"
        },
        {
          "label": "直达真人的直接发布",
          "sub": "开发者发本公司空缺——另一端是真人"
        },
        {
          "label": "直接发布",
          "sub": "公司官网招聘页——通常也到具体的人"
        },
        {
          "label": "招聘板",
          "sub": "pretty much awful——你在羊群里了"
        }
      ],
      "note": "优先级 = 概率 × 质量递减：每条进表的线索先查 Connections 列——能找到一个真人，就能把第 4 级线索升级成第 2 级通道。"
    }
  }
];

/* ---------- CLI ---------- */
const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const checkOnly = process.argv.includes('--check');
  const manifest = loadManifest();
  for (const spec of GEOMETRY_SPECS) {
    const entry = manifest.diagrams.find(item => item.id === spec.id);
    if (!entry) {
      console.error(`diagrams.js 清单缺少 ${spec.id} 的条目`);
      process.exitCode = 1;
      continue;
    }
    if (entry.file !== spec.file) {
      console.error(`${spec.id}: 清单 file=${entry.file} 与几何数据 file=${spec.file} 不一致`);
      process.exitCode = 1;
      continue;
    }
    const svg = buildSvg(entry, spec);
    const filePath = join(ROOT, manifest.directory, spec.file);
    if (checkOnly) {
      const onDisk = readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
      if (onDisk !== svg) {
        console.error(`不一致：${spec.file} —— 数据改过但没有重新生成，请运行 node tools/build-diagrams.mjs`);
        process.exitCode = 1;
      }
    } else {
      writeFileSync(filePath, svg, 'utf8');
      console.log(`生成 ${spec.file}（${Buffer.byteLength(svg, 'utf8')} B）`);
    }
  }
  if (checkOnly && !process.exitCode) {
    console.log(`一致性检查通过：${GEOMETRY_SPECS.length} 张生成图与 diagrams.js 清单 + 几何数据逐字节一致`);
  }
}
