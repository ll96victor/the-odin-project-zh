/* 共享 DOM stub 基础设施（v4.4 从 dom-mount.test.cjs 抽出）。
 *
 * 与 progress.test.cjs 等纯逻辑测试不同，这套 stub 在 Node vm 沙箱里跑 app.js
 * 的真实挂载路径（index.html 的完整脚本加载顺序），复刻浏览器的关键语义——
 * 尤其是“未连接进 document 的元素 getBoundingClientRect 返回 0×0、
 * display:none 的元素也返回 0×0”。
 *
 * 使用者：dom-mount.test.cjs（v4.3 Core A 组回归）、home-ia.test.cjs（v4.4
 * 首页信息架构）及后续需要真实挂载路径的 UI 测试。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const FIRST_LESSON = 'how-this-course-will-work';
const SCRIPTS = [
  'version.js',
  'lessons.js', 'external-resources.js', 'diagrams.js', 'avatars.js', 'icons.js',
  'catalog.js', 'companions.js', 'companion-registry.js', 'companion-view.js', 'companion-wardrobe.js', 'themes.js', 'bosses.js', 'curriculum.js', 'map.js', 'economy.js',
  'collections.js', 'daily.js', 'stats.js', 'challenges.js', 'tiers.js',
  'history.js', 'progress.js', 'app.js'
].map(name => ({ name, src: fs.readFileSync(path.join(root, name), 'utf8') }));


/* ===================== 最小 DOM stub ===================== */

/* 按钮类元素的实测尺寸表：.assistant-trigger 按 style.css 渲染约 152×44。
 * 其它元素给一个通用非零尺寸。0×0 只出现在“未连接”或 display:none 时——
 * 与真实浏览器一致，这是 A1 测试能区分新旧挂载顺序的关键。 */
const SIZE_BY_CLASS = { 'assistant-trigger': { width: 152, height: 44 } };
const DEFAULT_SIZE = { width: 100, height: 20 };

function makeDom(pageOptions = {}) {
  const rectTrace = [];
  const scrollIntoViewCalls = [];

  class StubElement {
    constructor(tagName) {
      this.tagName = String(tagName).toUpperCase();
      this.childNodes = [];
      this.parentNode = null;
      this.style = {};
      this.dataset = {};
      this.attributes = {};
      this.listeners = {};
      this.className = '';
      this.id = '';
      this._text = '';
      this.type = '';
      this.value = '';
      this.checked = false;
      this.selected = false;
      this.disabled = false;
      this.hidden = false;
      this.open = false;
      this.href = '';
      this.title = '';
      this.maxLength = 0;
      this.accept = '';
    }
    get children() { return this.childNodes.filter(child => child instanceof StubElement); }
    get textContent() {
      return this._text + this.children.map(child => child.textContent).join('');
    }
    set textContent(value) {
      this._text = value === undefined || value === null ? '' : String(value);
      this.childNodes.forEach(child => { child.parentNode = null; });
      this.childNodes = [];
    }
    append(...nodes) {
      nodes.forEach(child => {
        if (child === null || child === undefined) return;
        if (child.parentNode) child.parentNode.removeNode(child);
        child.parentNode = this;
        this.childNodes.push(child);
      });
    }
    replaceChildren(...nodes) {
      this.childNodes.forEach(child => { child.parentNode = null; });
      this.childNodes = [];
      this.append(...nodes);
    }
    removeNode(child) {
      const index = this.childNodes.indexOf(child);
      if (index >= 0) this.childNodes.splice(index, 1);
    }
    replaceChild(newChild, oldChild) {
      const index = this.childNodes.indexOf(oldChild);
      if (index < 0) return null;
      if (newChild.parentNode) newChild.parentNode.removeNode(newChild);
      oldChild.parentNode = null;
      newChild.parentNode = this;
      this.childNodes[index] = newChild;
      return oldChild;
    }
    remove() {
      if (this.parentNode) this.parentNode.removeNode(this);
      this.parentNode = null;
    }
    get classList() {
      const self = this;
      const tokens = () => self.className.split(/\s+/).filter(Boolean);
      const write = list => { self.className = list.join(' '); };
      return {
        add(...names) { const set = tokens(); names.forEach(n => { if (!set.includes(n)) set.push(n); }); write(set); },
        remove(...names) { write(tokens().filter(n => !names.includes(n))); },
        contains(name) { return tokens().includes(name); },
        toggle(name, force) {
          const has = tokens().includes(name);
          const want = force === undefined ? !has : Boolean(force);
          if (want && !has) this.add(name);
          if (!want && has) this.remove(name);
          return want;
        }
      };
    }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    getAttribute(name) { return name in this.attributes ? this.attributes[name] : null; }
    hasAttribute(name) { return name in this.attributes; }
    addEventListener(type, fn) { (this.listeners[type] = this.listeners[type] || []).push(fn); }
    removeEventListener(type, fn) {
      if (!this.listeners[type]) return;
      this.listeners[type] = this.listeners[type].filter(handler => handler !== fn);
    }
    isConnected() {
      let cursor = this;
      while (cursor) {
        if (cursor === dom.body || cursor === dom.documentElement) return true;
        cursor = cursor.parentNode;
      }
      return false;
    }
    /* 真实浏览器语义：未连接进 document 或 display:none 时全部为 0 */
    getBoundingClientRect() {
      const connected = this.isConnected();
      const visible = this.style.display !== 'none' && !this.hidden;
      let size = DEFAULT_SIZE;
      for (const [cls, dimensions] of Object.entries(SIZE_BY_CLASS)) {
        if (this.classList.contains(cls)) { size = dimensions; break; }
      }
      const width = connected && visible ? size.width : 0;
      const height = connected && visible ? size.height : 0;
      const left = parseFloat(this.style.left) || 0;
      const top = parseFloat(this.style.top) || 0;
      const rect = { width, height, left, top, right: left + width, bottom: top + height };
      rectTrace.push({ cls: this.className, connected, width, height });
      return rect;
    }
    focus() { dom.activeElement = this; }
    /* v4.4 阅读位置条 2.0：章节跳转用。记录调用供测试断言（真实浏览器会滚动） */
    scrollIntoView(opts) {
      scrollIntoViewCalls.push({ cls: this.className, text: (this.textContent || '').slice(0, 20), opts: opts || null });
    }
    setPointerCapture() {}
    releasePointerCapture() {}
    showModal() { this.open = true; }
    close() { this.open = false; }
    querySelector(selector) { return querySelect(this, selector); }
    click() { dispatch(this, 'click', {}); }
  }

  const dom = {
    body: new StubElement('body'),
    documentElement: new StubElement('html'),
    title: '',
    visibilityState: 'visible',
    activeElement: null,
    listeners: {},
    consoleWarnings: [],
    addEventListener(type, fn) { (dom.listeners[type] = dom.listeners[type] || []).push(fn); },
    createElement(tag) { return new StubElement(tag); },
    getElementById(id) { return querySelect(dom.body, '#' + id); },
    querySelector(selector) { return querySelect(dom.documentElement, selector); }
  };
  dom.documentElement.append(dom.body);
  /* 可写：阅读位置条测试用它模拟长页面（真实值 = 内容总高） */
  dom.documentElement.scrollHeight = pageOptions.scrollHeight || 2400;
  dom.body.dataset.page = pageOptions.page || 'home';

  /* index.html 的静态骨架：skip-link、site-header（仅品牌；目录由 app.js 挂载）、#main、footer */
  const header = new StubElement('header');
  header.className = 'site-header';
  const brand = new StubElement('a');
  brand.className = 'brand';
  brand.textContent = 'Odin 中文学习站';
  header.append(brand);
  const main = new StubElement('main');
  main.id = 'main';
  /* v4.5（交接 A2）：footer 进骨架——mountFooterVersion 的版本行挂在这里，
   * 与真实 index.html 的结构对齐 */
  const footer = new StubElement('footer');
  footer.className = 'site-footer';
  dom.body.append(header, main, footer);

  /* window stub。innerWidth/innerHeight 可被测试改写以模拟 resize。 */
  const windowListeners = {};
  const storage = pageOptions.storage;
  const sandbox = {
    document: dom,
    console: {
      warn(...args) { dom.consoleWarnings.push(args.map(String).join(' ')); },
      log() {}, error() {}
    },
    location: {
      protocol: pageOptions.protocol || 'http:',
      host: pageOptions.host || '127.0.0.1:8765',
      href: pageOptions.href || 'http://127.0.0.1:8765/index.html',
      search: pageOptions.search || ''
    },
    innerWidth: pageOptions.innerWidth || 1280,
    innerHeight: pageOptions.innerHeight || 800,
    scrollY: 0,
    /* v4.4 阅读位置条 2.0：百分比 = scrollY / (scrollHeight - innerHeight)。
     * 测试可改写 documentElement.scrollHeight 与 window.scrollY 后触发 scroll。 */
    matchMedia(query) { return { matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }; },
    localStorage: storage || null,
    addEventListener(type, fn) { (windowListeners[type] = windowListeners[type] || []).push(fn); },
    setInterval(fn) { return 0; },
    clearInterval() {},
    setTimeout(fn) { return 0; },
    clearTimeout() {},
    scrollTo() {},
    confirm: () => true,
    URLSearchParams,
    URL,
    FileReader: class { addEventListener() {} readAsDataURL() {} readAsText() {} },
    Image: class {},
    Blob: class {},
    navigator: { userAgent: 'node-dom-stub' }
  };
  sandbox.window = sandbox;

  function fireWindow(type, event) {
    const handlers = (windowListeners[type] || []).slice();
    const payload = Object.assign({ type, persisted: false, key: null }, event);
    handlers.forEach(handler => handler(payload));
    return payload;
  }

  return { dom, sandbox, windowListeners, fireWindow, rectTrace, scrollIntoViewCalls, StubElement };
}

/* 简单选择器：'.class' / '#id' / 'tag'。app.js 只用这三种。 */
function querySelect(root, selector) {
  const matches = el => {
    if (selector.startsWith('.')) {
      const wanted = selector.slice(1);
      return String(el.className || '').split(/\s+/).includes(wanted);
    }
    if (selector.startsWith('#')) return el.id === selector.slice(1);
    return el.tagName === selector.toUpperCase();
  };
  const stack = [...(root.children || [])];
  if (matches(root)) return root;
  while (stack.length) {
    const element = stack.shift();
    if (matches(element)) return element;
    stack.unshift(...element.children);
  }
  return null;
}

function collectByClass(root, className) {
  const found = [];
  const stack = [root];
  while (stack.length) {
    const element = stack.shift();
    if (String(element.className || '').split(/\s+/).includes(className)) found.push(element);
    stack.unshift(...element.children);
  }
  return found;
}

function dispatch(element, type, props) {
  const handlers = (element.listeners[type] || []).slice();
  const event = Object.assign({
    type,
    target: element,
    currentTarget: element,
    clientX: 0,
    clientY: 0,
    button: 0,
    pointerId: 1,
    key: '',
    _stopped: false,
    stopImmediatePropagation() { this._stopped = true; },
    stopPropagation() { this._stopped = true; },
    preventDefault() {}
  }, props);
  for (const handler of handlers) {
    if (event._stopped) break;
    handler.call(element, event);
  }
  return event;
}

/* localStorage 桩：与浏览器同源语义一致，每个实例就是一个独立源 */
function makeStorage(overrides = {}) {
  const map = new Map();
  return Object.assign({
    setItem(key, value) { map.set(String(key), String(value)); },
    getItem(key) { return map.has(String(key)) ? map.get(String(key)) : null; },
    removeItem(key) { map.delete(String(key)); },
    key(index) { return [...map.keys()][index]; },
    get length() { return map.size; }
  }, overrides);
}

/* 发布准备轮（改名迁移）：当前 key 使用公开仓命名空间 the-odin-project-zh；
 * LEGACY_STORAGE_KEY 是改名前的历史 key，仅供迁移测试播种“改名前的老档案”。 */
const STORAGE_KEY = 'the-odin-project-zh.progress.v1';
const LEGACY_STORAGE_KEY = 'odin-foundations-zh.progress.v1';

/* 载入一个完整“页面”：index.html 的骨架 + 全部脚本按 defer 顺序执行 */
function newPage(options = {}) {
  const page = makeDom(options);
  for (const script of SCRIPTS) vm.runInNewContext(script.src, page.sandbox, { filename: script.name });
  page.progress = page.sandbox.window.ODIN_PROGRESS;
  return page;
}

/* 构造一份合法 v3 档案 JSON（可带覆盖字段） */
function archiveJson(overrides = {}) {
  return JSON.stringify(Object.assign({
    app: 'the-odin-project-zh',
    schemaVersion: 3,
    lessons: {},
    daily: {},
    totalActiveSeconds: 0,
    xp: 0,
    minuteXpAwarded: 0,
    rewardFlags: {},
    coins: 0,
    coinMinuteAwarded: 0,
    coinFlags: {},
    achievements: {},
    lastLessonId: null,
    reviewEverMarked: false,
    profile: { nickname: '学习者', avatarId: 'terminal', avatarData: null, equippedFrameId: 'frame-basic' },
    cosmetics: { purchases: {}, companionId: 'sprout', themeId: 'garden' },
    settings: { dailyGoalMinutes: 20, companionPos: null, showCompanion: true, showAchievementNotes: true, showReadingPosition: true, showUnavailableLessons: true, showEnglishTitles: true, shortcutsEnabled: true },
    history: []
  }, overrides));
}

const lessonEntryJson = fields => Object.assign({
  started: false, completed: false, needsReview: false,
  officialCompleted: false, quizCompleted: false,
  activeSeconds: 0, startedAt: null, lastVisitedAt: null,
  completedAt: null, officialCompletedAt: null, quizCompletedAt: null
}, fields);

function dom_consoleHas(page, text) {
  return page.dom.consoleWarnings.some(line => line.includes(text));
}

module.exports = {
  FIRST_LESSON, SCRIPTS, STORAGE_KEY, LEGACY_STORAGE_KEY,
  makeDom, querySelect, collectByClass, dispatch, makeStorage,
  newPage, archiveJson, lessonEntryJson, dom_consoleHas
};
