/* 本站原创 SVG 概念图的清单（纯数据文件，零依赖）。
 *
 * 为什么要单独一个数据文件：图本身是 assets/diagrams/ 下的 .svg 文件，但“哪张图属于
 * 哪一课、图的文字替代说明是什么”必须有个地方存。放在 lessons.js 里会改动 19 课的
 * 正文数据（交接 §0 禁止重写课程正文），所以沿用 external-resources.js 的做法：
 * 单独一个清单文件，app.js 只读取并渲染。
 *
 * 交接 §9 的约束逐条对应：
 *   · 只做真正能减少抽象理解成本的图 —— 这里 8 张，全部对应官方课程里初学者
 *     最容易卡在“看不见摸不着”的概念（请求怎么走到服务器、Git 的几个区域到底
 *     在哪、路径从哪算起……），不做装饰插画。
 *   · 简洁线条图 / 流程图风格 —— 全部是方框、箭头、文字标注，没有渐变与阴影堆砌。
 *   · 尽量每张 < 20 KB、总体 < 200 KB —— 实际每张 3-5 KB，总共约 29 KB。
 *   · 使用系统字体，不打包字体 —— SVG 里写的是 PingFang SC / Microsoft YaHei /
 *     system-ui 与 ui-monospace / Consolas，没有任何 @font-face 或字体文件。
 *   · 手机可看、不依赖网络 —— SVG 用 viewBox 等比缩放，CSS 里宽度 100%；
 *     文件全在本地，没有任何远程引用。
 *   · 每张图配 figcaption 或等价文字说明 —— 每张都有 alt（给读屏软件）、caption
 *     （渲染成 figcaption）与 points（看图要抓住的几点，同时是图的文字等价物）。
 *   · 不替代正文 —— 图插在「中文讲解」之后作为补充，正文一字未改。
 *   · 不用图片生成服务、不引入第三方图片版权 —— 8 张全部手工编写 SVG 源码。
 */
window.ODIN_DIAGRAMS = {
  version: 1,
  directory: 'assets/diagrams/',
  license: '本站原创线条图，随本项目内容采用 CC BY-NC-SA 4.0；未使用图片生成服务，未引入任何第三方图片。',
  diagrams: [
    {
      id: 'how-the-web-works',
      file: 'how-the-web-works.svg',
      lessonId: 'how-does-the-web-work',
      zhTitle: '在浏览器输入网址之后发生了什么',
      alt: '时序图。浏览器先向 DNS 服务器询问域名 example.com 对应的 IP 地址，DNS 回答 93.184.216.34；浏览器再用这个 IP 向 Web 服务器发出 HTTP 请求，服务器返回 HTML 文件；最后浏览器解析 HTML 并渲染成网页。',
      caption: '域名是给人记的名字，网络上真正用来找到服务器的是 IP 地址，DNS 负责在两者之间翻译。',
      points: [
        '一次访问至少要两轮往返：先问 DNS 拿 IP，再向服务器拿文件。',
        '服务器发回来的是文本文件（HTML），不是一张已经画好的图片。',
        '“渲染”是浏览器把 HTML 文本解析成你看到的页面这一步，发生在你自己的电脑上。'
      ]
    },
    {
      id: 'command-line-tree',
      file: 'command-line-tree.svg',
      lessonId: 'command-line-basics',
      zhTitle: '目录树与 pwd、ls、cd',
      alt: '左边是一棵目录树：C 盘下有 Users，Users 下有 alex，alex 是当前所在目录，里面有 Documents（含 notes.txt 与 report.md）、Downloads（含 setup.exe）、Pictures（含 cat.jpg）。右边四个命令卡片：pwd 打印当前目录的完整路径，ls 列出当前目录里有什么，cd Documents 进入子目录，cd 加两个点回到上一级目录。',
      caption: '命令行里没有图标可点，你必须随时知道“我在哪个目录”，再决定往哪走。',
      points: [
        'pwd 回答“我在哪”，ls 回答“这里有什么”，cd 回答“我要去哪”。',
        '迷路时的固定动作：先 pwd，再 ls，再决定 cd 到哪里。',
        '两个点 .. 永远代表上一级目录，这是往回走最可靠的办法。'
      ]
    },
    {
      id: 'git-areas',
      file: 'git-areas.svg',
      /* v4.11.2 B：归属从 introduction-to-git 修正为 git-basics。
       * introduction-to-git 的 6 章全部是概念介绍（版本控制是什么、Git 与文本
       * 编辑器保存的区别、本地与远端的分工），不讲暂存区与四区域工作流；
       * git-basics 的第 6/8/10 章（git status / add / commit / push 工作流）
       * 才是这张图的内容。alt / caption / points 在 git-basics 语境下逐条核对
       * 仍成立，未改措辞。introduction-to-git 因此暂时没有配图——它的概念章
       * 没有「看不见摸不着」到需要图解的结构，宁缺毋滥（§9 图是补充不是主体）。 */
      lessonId: 'git-basics',
      zhTitle: 'Git 的四个区域',
      alt: '从左到右四个方框：工作区是你正在编辑的文件，改动只发生在这里；git add 把挑出来的改动放进暂存区；git commit 把暂存区的内容记录成本地仓库里的一次提交；git push 把本地仓库的提交上传到 GitHub 上的远端仓库。另有一条虚线箭头从远端仓库指回本地仓库，表示 git pull 或 git clone 可以把远端内容取回本地。',
      caption: 'Git 不是“自动保存”：改动要经过 add、commit 两步才真正进入版本历史，再经过 push 才会出现在 GitHub 上。',
      points: [
        'add 只是挑出这次要记录哪些改动，commit 才是真的记下一个版本。',
        '没有 add 的改动不会进 commit；没有 push 的 commit 只存在你自己这台电脑上。',
        '本地仓库已经足够让你查历史和回退，GitHub 是额外的一份共享副本。'
      ]
    },
    {
      id: 'roles-html-css-js',
      file: 'roles-html-css-js.svg',
      lessonId: 'introduction-to-html-and-css',
      zhTitle: 'HTML、CSS、JavaScript 的分工',
      alt: '三个并列的方框：HTML 负责结构与内容，也就是页面里有什么，例如标题、段落、图片、链接；CSS 负责样式与外观，也就是看起来是什么样，例如颜色、字号、间距、布局；JavaScript 负责行为与交互，也就是能做什么反应，例如响应点击、更新内容、校验输入。三个方框各有一条向下的箭头，汇入底部的“浏览器里的同一个网页”。',
      caption: '三门技术各管一件事，合起来才是完整网页。这一阶段只学 HTML 与 CSS，JavaScript 要等到 Foundations 后半段。',
      points: [
        'HTML 决定页面里有什么内容，它不管好不好看。',
        'CSS 决定这些内容长什么样，它不改内容本身。',
        'JavaScript 决定页面能对操作做出什么反应；本课还不需要写它。'
      ]
    },
    {
      id: 'structure-and-style',
      file: 'structure-and-style.svg',
      lessonId: 'introduction-to-html-and-css',
      zhTitle: '结构与样式如何合成一个网页',
      alt: '左边是 HTML 文件，里面有一个 class 为 title 的 h1 元素，内容是“你好”，还有一个段落“这是一段文字。”。右边是 CSS 文件，里面有一条 .title 规则，把颜色设为深绿色、字号设为 32 像素。两个方框之间有一条虚线，说明 CSS 的选择器 .title 与 HTML 元素的 class 同名，因此匹配成功。两个方框各有一条箭头指向底部的渲染结果：深绿色的大号“你好”和正常大小的“这是一段文字。”。',
      caption: '同一份 HTML，配不同的 CSS 就是不同的外观；HTML 一个字不改，页面样子也能完全变。',
      points: [
        'CSS 靠选择器找到 HTML 里的元素，class 同名是最常用的对法。',
        '结构与样式分开写，才能一处改样式、整个站点生效。'
      ]
    },
    {
      id: 'tag-anatomy',
      file: 'tag-anatomy.svg',
      lessonId: 'elements-and-tags',
      zhTitle: '一个元素的解剖：开始标签、内容、嵌套、结束标签',
      alt: '一行代码：一个 p 元素，内容是“你好，”加上一个嵌套的 strong 元素，strong 里是“世界”。绿色的部分是开始标签 p 和结束标签 /p，深色的部分是元素内容，红棕色的部分是嵌套的 strong 元素。下方四张卡片分别解释开始标签、元素内容、嵌套元素和结束标签。',
      caption: '元素 = 开始标签 + 内容 + 结束标签。嵌套时，里层元素必须完整地被包在外层的内容里。',
      points: [
        '结束标签带斜杠，标签名必须与开始标签一致。',
        '嵌套不能交叉：先开的后关，里层要完整闭合再关外层。',
        '少数元素（例如 img、br）没有内容也没有结束标签，叫空元素。'
      ]
    },
    {
      id: 'html-boilerplate',
      file: 'html-boilerplate.svg',
      lessonId: 'html-boilerplate',
      zhTitle: 'HTML 文档骨架：每一行是干什么的',
      alt: '左边是一份最小的 HTML 文档骨架代码，从上到下依次是 DOCTYPE 声明、html 根元素（带 lang 属性）、head 里的 meta charset 与 title、body 里的 h1 与 p，最后是闭合的 body 与 html。右边逐行解释：DOCTYPE 声明这是 HTML5 文档且不是标签；html 是包住整个页面的根元素；head 里放给浏览器和搜索引擎看的信息，不显示在页面上；meta charset 决定字符编码，缺了中文容易乱码；title 显示在浏览器标签页与搜索结果上；body 里放用户真正看到的全部内容。',
      caption: '这 11 行是每个页面都要有的骨架。编辑器一般能一键生成，但你得知道每行的作用，出问题才知道去哪里找。',
      points: [
        'head 里的内容不显示在页面上，body 里的才会。',
        'meta charset 缺了，中文很容易显示成乱码。',
        'title 出现在浏览器标签页与搜索结果里，它不是页面正文的大标题。'
      ]
    },
    {
      id: 'url-and-paths',
      file: 'url-and-paths.svg',
      lessonId: 'links-and-images',
      zhTitle: '绝对 URL、相对路径与图片路径',
      alt: '三个部分。第一部分：一个绝对 URL 由协议、域名和路径三段组成，可以指向互联网上任何地方。第二部分：假设当前文件是 /courses/html/index.html，写 about.html 或 ./about.html 都指向同目录下的 /courses/html/about.html，写 ../css/style.css 会先回到上一级、指向 /courses/css/style.css，以斜杠开头的 /images/cat.jpg 则从网站根目录算起。第三部分：img 元素的 src 属性用的就是同一套路径规则。',
      caption: '链接和图片用的都是路径。写错路径最常见的后果不是报错，而是页面上出现一个打不开的链接或一张裂开的图。',
      points: [
        '以 / 开头：从网站根目录算。不以 / 开头：从当前文件所在目录算。',
        '两个点 .. 表示上一级目录，可以连着用，例如 ../../。',
        '站点内部用相对路径，指向别的网站才用完整的绝对 URL。'
      ]
    }
  ]
};
