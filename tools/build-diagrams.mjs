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
          { label: 'Exercise（部分课有）' },
          { label: 'Knowledge Check 自查题' }
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
