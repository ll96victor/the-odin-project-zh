/* 本站原创 SVG 概念图的清单（纯数据文件，零依赖）。
 *
 * 为什么要单独一个数据文件：图本身是 assets/diagrams/ 下的 .svg 文件，但“哪张图属于
 * 哪一课、图的文字替代说明是什么”必须有个地方存。放在 lessons.js 里会改动 19 课的
 * 正文数据（交接 §0 禁止重写课程正文），所以沿用 external-resources.js 的做法：
 * 单独一个清单文件，app.js 只读取并渲染。
 *
 * v4.11.6 起，配图纪律的**事实源住在 LESSON-PAGE-GUIDE.md 第 4 节「概念图规范」**
 * （要不要画的判据五条、8 图型选择指引、sectionIndex 插入位置、配色纪律、
 * 文字等价物要求、生产流程），本文件不再复制全文——改纪律先改那份文档，
 * 再同步这里与测试。历史纪律要点（v4 §9 首轮的“只做减少抽象理解成本的图、
 * 简洁线条图、系统字体、本地零网络、原创不引第三方版权”）全部由该文档承接，
 * 并由 tests/diagrams.test.cjs 逐条钉住（单张 <20KB、合计 <600KB、字体白名单、
 * XML 良构、无远程引用、简体中文、按章归位）。
 *
 * v4.11.5（交接 3.D/3.E）：图的产出方式分两代，运行时形态完全相同（静态 .svg
 * 文件 + <img> 引用，零构建零依赖）：
 *   · 手工编写（8 张，v4 首轮）：how-the-web-works / command-line-tree /
 *     git-areas / roles-html-css-js / structure-and-style / tag-anatomy /
 *     html-boilerplate / url-and-paths；
 *   · 生成器产出（第 6 课试点起）：tools/build-diagrams.mjs 按结构化数据生成，
 *     生成图的文字与归属仍住在本清单（单一事实源），几何数据住生成器，
 *     两者一致性由 diagrams.test.cjs 钉住——改了数据必须重新生成，否则测试红。
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
      /* v4.11.5（交接 3.E）：归位到第 3 章「在地址栏输入网址后，大致发生什么」
       * 之后——这张图画的正是该章的六步链路（手工图，SVG 文件本体未改）。 */
      sectionIndex: 2,
      zhTitle: '在浏览器输入网址之后发生了什么',
      alt: '时序图。浏览器先向 DNS 服务器询问域名 example.com 对应的 IP 地址，DNS 回答 93.184.216.34；浏览器再用这个 IP 向 Web 服务器发出 HTTP 请求，服务器返回 HTML 文件；最后浏览器解析 HTML 并渲染成网页。',
      caption: '域名是给人记的名字，网络上真正用来找到服务器的是 IP 地址，DNS 负责在两者之间翻译。',
      points: [
        '一次访问至少要两轮往返：先问 DNS 拿 IP，再向服务器拿文件。',
        '服务器发回来的是文本文件（HTML），不是一张已经画好的图片。',
        '“渲染”是浏览器把 HTML 文本解析成你看到的页面这一步，发生在你自己的电脑上。'
      ]
    },
    /* ---------- v4.11.5（交接 3.E）：第 6 课「Web 是如何运作的」按章配图试点 ----------
     * 6 张新图由 tools/build-diagrams.mjs 生成（几何数据在生成器内，文字与归属在
     * 本清单）；连同上方归位的 how-the-web-works，第 6 课 8 章里除第 1 章
     * （「本课的特殊之处」是学习路线说明，无「看不见摸不着」的结构可画）外每章一图。
     * 内容逐段对照 lessons.js 第 6 课各章正文编写，sectionIndex 即章节下标。 */
    {
      id: 'network-internet-web',
      file: 'network-internet-web.svg',
      lessonId: 'how-does-the-web-work',
      sectionIndex: 1,
      zhTitle: '网络、互联网与 Web：三层包含关系',
      alt: '三层嵌套方框示意图。最外层是网络（network）：把多台设备互联起来，让它们能互相通信，你家的手机、电脑、路由器就是一个小网络；中间层是互联网（internet）：把全世界无数小网络连接成一个超大网络，跨城市、跨国通信，本义就是「网络之间」；最内层是 Web（万维网）：建立在互联网之上的一种服务，网页通过它提供。中间层内、最内层外还画有电子邮件与文件传输两个小方框，表示它们同样跑在互联网上，但不属于 Web。',
      caption: 'Web 不等于互联网：它只是互联网上的一种服务。分清三层包含关系，是建立正确心智模型的第一步。',
      points: [
        '网络是把设备互联起来通信；你家的手机、电脑、路由器连在一起就是一个小网络。',
        '互联网把全世界无数小网络连成一个；「internet」的本义就是「网络之间」。',
        'Web、电子邮件、文件传输都是互联网上的服务，只有网页相关的才属于 Web。'
      ]
    },
    {
      id: 'home-to-server-route',
      file: 'home-to-server-route.svg',
      lessonId: 'how-does-the-web-work',
      sectionIndex: 3,
      zhTitle: '数据包从你家到目标服务器的路径',
      alt: '分两行排列的流程图。第一行从左到右：你家设备（数据包出发）、家用路由器（决定下一跳）、ISP 运营商（接入互联网）；随后折向第二行：沿途路由器（逐跳接力转发）、目标服务器（收到请求）。方框之间用箭头连接，底部注释说明：网络上每台设备都靠 IP 地址定位，就像寄快递要写收件地址；路由器像一个个路口，只看数据包上的目标地址决定下一跳往哪边走。',
      caption: '你家不是直接连到目标服务器的：数据包要经过家用路由器、ISP 和沿途许多路由器，像接力一样逐跳转发。',
      points: [
        'IP 地址是网络上每台设备的「门牌号码」，数据包必须写明目标 IP。',
        '路由器像路口：只看目标地址，决定下一跳往哪边走。',
        'ISP 是你付费上网的运营商，为家庭网络提供接入互联网的入口。'
      ]
    },
    {
      id: 'packet-anatomy',
      file: 'packet-anatomy.svg',
      lessonId: 'how-does-the-web-work',
      sectionIndex: 4,
      zhTitle: '一个数据包的解剖：序号、目标地址与数据片段',
      alt: '图分两部分。上方是四步小流程：完整文件被拆成许多数据包，各自独立寻路，到达后按序重组。中间是一个横条，代表一个数据包（packet），从左到右分成三段：序号、目标 IP 地址、数据片段。下方三条注释分别说明：序号标记这个包是文件的第几片，到达后按序号重组还原；目标地址标记包要送去哪里，不同包可能走不同路线、到达顺序可能打乱；数据片段是原文件的一小份内容，丢失或损坏只需重传这一个包。',
      caption: '大文件不整块发送：切成一个个带寻址信息的数据包独立穿行，到达后按序重组还原。',
      points: [
        '同一个文件的不同数据包可能走不同路线，到达顺序也可能打乱。',
        '每个包都带序号与目标地址，所以能各自寻路、又能按序还原。',
        '某个包丢了只需重传那一个包，不用重传整个文件——拆包因此又高效又可靠。'
      ]
    },
    {
      id: 'client-server-roles',
      file: 'client-server-roles.svg',
      lessonId: 'how-does-the-web-work',
      sectionIndex: 5,
      zhTitle: '客户端与服务器：要的一方与给的一方',
      alt: '两个并列方框。左边是客户端，即发出请求的一方：发出请求（request）「请把这个页面给我」；最常见的是浏览器，手机 App、命令行工具也算；收到响应后把它渲染成你看到的页面。右边是服务器，即提供服务的一方：长期运行的专用机器，随时等待请求；存储网页文件与数据；收到请求后处理，把内容作为响应（response）发回。底部注释用点餐打比方：客户端点单，服务器上菜；两个角色是相对的。',
      caption: '客户端是「要」的一方，服务器是「给」的一方：你向它点单，它给你上菜。',
      points: [
        '当前阶段最常见的组合：浏览器作为客户端发请求，Web 服务器返回响应。',
        '角色是相对的：同一台设备在这次通信里是客户端，在另一次通信里可能是服务器。',
        '服务器通常指机房里长期运行的专用机器，以及机器上存储并返回内容的软件。'
      ]
    },
    {
      id: 'five-web-concepts',
      file: 'five-web-concepts.svg',
      lessonId: 'how-does-the-web-work',
      sectionIndex: 6,
      zhTitle: '五个最容易混淆的 Web 概念',
      alt: '概念关系图。中心是「五个最容易混淆的概念」，向四周辐射连线到五个方框：网页（web page）是可以在浏览器里显示的一个文档；网站（website）是许多网页的集合，通常挂在同一个域名下；Web 服务器（web server）是存储网页、收到请求就把它们发出去的软件与机器；浏览器（web browser）是发出请求、接收页面文件并渲染成可见页面的软件，如 Chrome、Firefox；搜索引擎（search engine）是帮你查找网页的服务，如 Google Search。',
      caption: '网页、网站、Web 服务器、浏览器、搜索引擎——五个概念各管一件事，逐个记牢就不会混。',
      points: [
        'Chrome 是浏览器，Google Search 是搜索引擎；用 Chrome 打开 Google 是两个东西配合。',
        '网页文件本体存放在 Web 服务器上，你看到的是浏览器下载到本地渲染出的结果。',
        '网站是网页的集合，通常挂在同一个域名下。'
      ]
    },
    {
      id: 'dns-resolution',
      file: 'dns-resolution.svg',
      lessonId: 'how-does-the-web-work',
      sectionIndex: 7,
      zhTitle: '一次 DNS 查询如何把域名变成 IP 地址',
      alt: '时序图。三条竖直生命线分别代表你的浏览器、DNS 解析器（类比通讯录，通常由 ISP 提供）和权威服务器（类比总登记处）。浏览器先问解析器：www.example.com 的 IP 是多少（浏览器与系统缓存都没查到才来问）；解析器没有现成答案时，按根域名服务器、顶级域服务器、权威服务器的顺序层层查询；权威服务器回答该域名对应的 IP；解析器把 IP 返回给浏览器并沿途缓存。底部注释：浏览器拿到 IP 之后才发出真正的页面请求。',
      caption: 'DNS 像互联网的通讯录：你记住的是名字，网络定位设备要靠查出来的 IP 号码。',
      points: [
        '域名方便人记忆；网络定位设备靠 IP 地址，DNS 负责在两者之间翻译。',
        '解析器没有现成答案时，按根域名、顶级域、权威服务器的顺序层层查询。',
        '查询结果会被沿途缓存，下次再问同一域名不必重走全程。'
      ]
    },
    {
      id: 'command-line-tree',
      file: 'command-line-tree.svg',
      lessonId: 'command-line-basics',
      /* v4.11.6（交接 §3.5）：归位到第 12 章「练习二：自己搭一个网站目录结构」
       * 之后——该章正是用 mkdir / touch / cd 动手搭目录树的练习，与这张
       * 「目录树 + pwd/ls/cd」图内容对应（手工图，SVG 文件本体未改）。 */
      sectionIndex: 11,
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
       * 仍成立，未改措辞。introduction-to-git 自 v4.11.6 起有自己的配图
       * （git-save-vs-editor-save，见下方清单）。
       * v4.11.6（交接 §3.5）：归位到第 6 章「第一轮工作流：创建、暂存、提交」
       * 之后——该章正是 touch/add/commit/status/log 的四区域实操。 */
      lessonId: 'git-basics',
      sectionIndex: 5,
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
      /* v4.11.6（交接 §3.5）：归位到第 2 章「HTML 和 CSS 各自负责什么」之后——
       * 该章讲两种语言的分工，这张图补上 JavaScript 的角色凑齐三门技术的分工全景。 */
      sectionIndex: 1,
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
      /* v4.11.6（交接 §3.5）：归位到第 2 章「HTML 和 CSS 各自负责什么」之后
       *（与 roles-html-css-js 同章，紧随其后）——该章「HTML 把信息放到网页上、
       * CSS 摆放信息给它颜色」正是这张「结构与样式合成一个网页」图的正文对应。 */
      sectionIndex: 1,
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
      /* v4.11.6（交接 §3.5）：归位到第 3 章「元素 = 标签 + 内容」之后——
       * 该章逐件拆解开始标签 / 内容 / 结束标签，与这张解剖图逐段对应。 */
      sectionIndex: 2,
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
      /* v4.11.6（交接 §3.5）：归位到第 1 章「什么是 boilerplate，为什么需要它」
       * 之后——这张图是整套骨架的逐行总览，先看全景、再进后面各章逐件细讲
       *（DOCTYPE / html / head / meta+title / body 各章）。 */
      sectionIndex: 0,
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
      /* v4.11.6（交接 §3.5）：归位到第 8 章「相对链接」之后——该章讲完
       * 「路径相对于当前页面计算」，这张图把绝对 URL 三段、同目录 / 上一级 /
       * 根目录起算与 img src 同规则一次收拢；后续章（./ 的作用、父目录 ../）
       * 再逐个深化，各有自己的新图。 */
      sectionIndex: 7,
      zhTitle: '绝对 URL、相对路径与图片路径',
      alt: '三个部分。第一部分：一个绝对 URL 由协议、域名和路径三段组成，可以指向互联网上任何地方。第二部分：假设当前文件是 /courses/html/index.html，写 about.html 或 ./about.html 都指向同目录下的 /courses/html/about.html，写 ../css/style.css 会先回到上一级、指向 /courses/css/style.css，以斜杠开头的 /images/cat.jpg 则从网站根目录算起。第三部分：img 元素的 src 属性用的就是同一套路径规则。',
      caption: '链接和图片用的都是路径。写错路径最常见的后果不是报错，而是页面上出现一个打不开的链接或一张裂开的图。',
      points: [
        '以 / 开头：从网站根目录算。不以 / 开头：从当前文件所在目录算。',
        '两个点 .. 表示上一级目录，可以连着用，例如 ../../。',
        '站点内部用相对路径，指向别的网站才用完整的绝对 URL。'
      ]
    },
    /* ---------- v4.11.6（交接 §3.4）：按章配图精简铺开，新增 33 张 ----------
     * 全部由 tools/build-diagrams.mjs 生成（几何数据在生成器 GEOMETRY_SPECS，
     * 文字与归属在本清单，一致性由 diagrams.test.cjs 交叉钉住）。
     * 取舍判据住 LESSON-PAGE-GUIDE.md 第 4 节：只画「看不见摸不着、会反复回看」
     * 的结构；一次性操作、文字已够清楚、与已有图重复、纯装饰一律不画。
     * 全站合计 47 张（14 存量 + 33 新增），覆盖 19 课中的 19 课。 */
    {
      id: 'lesson-structure-tree',
      file: 'lesson-structure-tree.svg',
      lessonId: 'how-this-course-will-work',
      sectionIndex: 1,
      zhTitle: 'TOP 的一课是怎么组织的',
      alt: '层级树示意图。根节点是 TOP 的一课（聚合式结构），向下分出四个分支：主题介绍与背景；外部资料——它本身就是正课，再分为 MDN 等文章、YouTube 等视频、官方文档三类；Exercise 练习（部分课才有）；Knowledge Check 自查题。整棵树说明：一课的学习闭环是读正文和它指定的外部资料、动手做练习、回答自查题确认理解，再进入下一课。',
      caption: '一课不只是一页文字：外部资料就是正课本身，闭环是读 → 练 → 自查 → 下一课。',
      points: [
        'TOP 靠聚合工作：课文把你指向外部文章、视频与文档，那就是正课本身。',
        'Knowledge Check 让你在前进前确认自己理解了；部分课另有 Exercise。',
        'Project 穿插在整个课程中，靠真正动手构建加深理解。'
      ]
    },
    {
      id: 'frontend-backend-fullstack',
      file: 'frontend-backend-fullstack.svg',
      lessonId: 'introduction-to-web-development',
      sectionIndex: 1,
      zhTitle: '前端、后端与全栈',
      alt: '双栏对比图。左栏是前端（front end）：你在浏览器里看到的网站内容，包括呈现方式与界面元素如导航栏；使用 HTML、CSS、JavaScript 及相关框架；职责是内容有效呈现、用户获得优秀体验。右栏是后端（back end）：应用的「内脏」，住在服务器上；存储并提供程序数据，确保前端拿到它需要的东西；使用 Java、Python、Ruby、JavaScript 这类语言，用户量达数百万时非常复杂。底部注释：全栈是对两端都能上手——官方明确说 TOP 教的是全栈开发。',
      caption: '前端管「你看到什么」，后端管「数据从哪来」；TOP 教的是两端都覆盖的全栈。',
      points: [
        '前端是浏览器里看到的内容与界面，工具是 HTML、CSS、JavaScript。',
        '后端住在服务器上，存储并提供数据，是应用的「内脏」。',
        '全栈 = 前后端都上手；官方明确 TOP 教的是全栈开发。'
      ]
    },
    {
      id: 'tools-learning-map',
      file: 'tools-learning-map.svg',
      lessonId: 'introduction-to-web-development',
      sectionIndex: 4,
      zhTitle: '工具清单就是后面的学习地图',
      alt: '四步流程图，从左到右：文本编辑器——第 8 课上手上；命令行——第 9 课学；Git 与 GitHub——第 10 到 12 课学；搜索引擎与 Stack Overflow——遇到具体问题时反复用。底部注释说明：这一课只需要先认个脸，知道这些工具存在、各自解决什么问题；真正的熟练来自后面一课一课地用，不必因为不认识它们而先去自学一遍。',
      caption: '不认识这些工具不用慌：第 8、9、10–12 课会逐个带你上手，这份清单就是后面的课程地图。',
      points: [
        '编辑器第 8 课、命令行第 9 课、Git 第 10–12 课——工具按课程顺序教。',
        '这一课的任务只是「认脸」：知道它们存在、各解决什么问题。',
        '熟练来自后面一课一课地用，不是现在先自学一遍。'
      ]
    },
    {
      id: 'focus-diffuse-modes',
      file: 'focus-diffuse-modes.svg',
      lessonId: 'motivation-and-mindset',
      sectionIndex: 1,
      zhTitle: '专注模式与发散模式',
      alt: '双栏对比图。左栏是专注模式（focus mode）：你有意识地在学习——阅读、看视频、做项目，注意力直接对着学习材料。右栏是发散模式（diffuse mode）：潜意识在工作，发生在你没有主动学习的时候，比如洗碗、运动、睡觉；大脑把正在学的东西和已经知道的其他东西连接起来，突破往往就发生在这里。底部注释：官方学习观浓缩成三步——理解它、练习它、最后把它讲给别人听；学习时大脑在两种模式之间不断切换。',
      caption: '学习不只在书桌前：散步洗碗时的发散模式把新旧知识连起来，突破常在这时发生。',
      points: [
        '专注模式是有意识的输入：阅读、看视频、做项目。',
        '发散模式是潜意识的后台处理：不学习的时候大脑仍在连接新旧知识。',
        '官方三步学习观：理解它、练习它、把它讲给别人听。'
      ]
    },
    {
      id: 'stuck-three-tools',
      file: 'stuck-three-tools.svg',
      lessonId: 'motivation-and-mindset',
      sectionIndex: 3,
      zhTitle: '卡住了怎么办：三件工具',
      alt: '四盒流程图，从左到右：卡住了——可能是某个概念理解不了，或项目里有什么东西不正常；第一件工具「去研究」——一定有人在你之前遇到过同样的问题，用搜索引擎快速搜一下常常就能找到解法；第二件工具「休息一下」——让发散学习状态去处理这个问题；第三件工具「到 TOP Discord 服务器求助」——带着你做过的研究去问。底部注释：当别人看到你已经自己下过功夫，会更愿意帮你。',
      caption: '官方保证你一定会卡住：先研究、再休息、最后带着研究去求助——三件工具按序用。',
      points: [
        '先去研究：一定有人在你之前遇到过同样的问题。',
        '休息一下，把问题交给发散模式后台处理。',
        '求助时带着你做过的研究去 TOP Discord，别人更愿意帮你。'
      ]
    },
    {
      id: 'problem-solving-loop',
      file: 'problem-solving-loop.svg',
      lessonId: 'motivation-and-mindset',
      sectionIndex: 4,
      zhTitle: '官方的「解决问题步骤」：总是回到练习的循环',
      alt: '五节点循环图，首尾相接：做这一课；练习这个概念；不知道怎么解决时先研究和试验；研究过仍没头绪时寻求指导；拿到指导后判断它讲不讲得通——讲得通回到练习这个概念，讲不通回到重做这一课。底部注释指出：不管走哪个分支，最终都会回到「练习这个概念」；这套流程的真正用意是防止你在「重看课程」和「直接放弃」之间二选一，它总是把你推回动手。',
      caption: '哪个分支都不是出口：研究、提问、重做本课，所有路最后都把你推回「练习这个概念」。',
      points: [
        '核心是一个不断回到练习的循环，防止放弃或无脑重看。',
        '不知道怎么办时的升级顺序：研究和试验 → 寻求指导 → 重做本课。',
        '拿到指导要判断讲不讲得通：讲得通回练习，讲不通回课程。'
      ]
    },
    {
      id: 'two-question-principles',
      file: 'two-question-principles.svg',
      lessonId: 'asking-for-help',
      sectionIndex: 2,
      zhTitle: '提问的两条原则',
      alt: '双栏对比图。左栏是原则一「永远提供你的代码和上下文」：给出代码、错误消息、终端命令、服务器输出等相关细节；把问题收敛到具体的点，比如某个具体函数或行号；不带上下文的代价是大量不必要的来回对话，且信息不完整时给出的任何答案都解决不了问题；例外是概念性问题，应在问题里说明清楚。右栏是原则二「问手头的问题，不要问解法本身」：别直接问作业某一步该怎么做——想出解法思路是学习旅程必不可少的部分；更好的问法是描述目标、报错行号并附上代码；这样别人知道你试过什么，能针对你当前这版代码调试，而不是让你从头重来。底部注释：两条原则同一个内核——把你的尝试和卡点亮出来。',
      caption: '好的提问长一个样：带上代码和上下文，说你手头卡住的问题——而不是让别人替你想解法。',
      points: [
        '原则一：代码、错误消息、命令与输出，上下文越多越好帮。',
        '原则二：问「第 12 行报语法错误怎么修」，不问「Step 5 该怎么做」。',
        '把问题收敛到具体的点：某个函数、某个行号。'
      ]
    },
    {
      id: 'before-asking-three-steps',
      file: 'before-asking-three-steps.svg',
      lessonId: 'join-the-odin-community',
      sectionIndex: 2,
      zhTitle: '求助之前先做三件事',
      alt: '三步流程图，从左到右：第一步「停下来喘口气」——把问题拆成小块，判断到底是什么在真正阻碍你，官方称这个技巧为 rubber duck debugging（橡皮鸭调试法）；第二步「用搜索引擎找相关信息」——也可以回头翻之前的课程，找能用在当前任务上的工具；第三步「仍无解法就去 Odin 社区求助」——到 Discord 提问。底部注释：有时问题出在你的思路（approach）上而不是代码上，对自己要往哪里去有大致想法在提问时特别重要。',
      caption: '打开 Discord 之前的正确姿势：拆问题 → 搜索 → 仍无解法才求助。',
      points: [
        '橡皮鸭调试法：把问题拆成小块，找到真正阻碍你的东西。',
        '搜索引擎和之前的课程是免费的第一轮求助对象。',
        '都没用了再去社区——问题有时出在思路而不是代码。'
      ]
    },
    {
      id: 'question-context-anatomy',
      file: 'question-context-anatomy.svg',
      lessonId: 'join-the-odin-community',
      sectionIndex: 3,
      zhTitle: '一个合格的提问：五项上下文',
      alt: '解剖图。顶部三个小盒：别问「能不能问」（don’t ask to ask）、直接把问题问出来、这样更快得到答案也让别人更自在愿意帮你。主体横条从左到右把一个提问拆成五段：你认为问题是什么、你究竟希望发生什么、实际发生的是什么、你是怎么走到这一步的、到目前为止你试过什么；每段下方引出线接对应的英文原句（What do you think the problem is? 等五问）。',
      caption: '官方要求提问带五项上下文——别问能不能问，把这五项组织好直接问。',
      points: [
        'don’t ask to ask：「能不能问个问题」浪费一轮，直接问。',
        '五项上下文：问题、期望、实际、来路、尝试，一项不缺。',
        '把问题组织好，就是帮社区帮你。'
      ]
    },
    {
      id: 'skip-this-lesson',
      file: 'skip-this-lesson.svg',
      lessonId: 'installations',
      sectionIndex: 1,
      zhTitle: '能不能跳过这一课：先判断两个条件',
      alt: '三盒流程图，从左到右：先判断操作系统——是否在用 macOS、Ubuntu 或 Ubuntu 官方风味版；再判断浏览器——是否已装好 Google Chrome；两个都是——可以跳过这一课，任何一个不是——按安装说明搭建你的开发环境。底部注释：已经符合条件的情况下重装一遍环境，是这一课最常见的无谓折腾；Assignment 里重复了同一个判断，只有不是受支持系统才需要跟某一组安装说明走。',
      caption: '这一课先做判断题再动手：系统在支持名单 + Chrome 已装好，才可以跳过。',
      points: [
        '跳过条件：macOS / Ubuntu / 官方风味版 + 已装 Google Chrome。',
        '任一条件不满足，就按安装说明搭建开发环境。',
        '已符合条件还重装环境，是最常见的无谓折腾。'
      ]
    },
    {
      id: 'four-setup-options',
      file: 'four-setup-options.svg',
      lessonId: 'installations',
      sectionIndex: 6,
      zhTitle: '四种搭建方式怎么选',
      alt: '四盒流程图，从左到右按选择优先级排列：VirtualBox 虚拟机——官方推荐给初学者，虚拟机是在现有系统内运行的电脑仿真，安装像任何程序一样直接、没有风险，不喜欢 Linux 可以轻松移除；双系统——开机时选择启动哪个系统，操作系统能用电脑全部资源、运行快得多，但改动硬盘分区会有一些风险，不着急仔细按说明做就没问题；ChromeOS / ChromeOS Flex——给 Chromebook 拥有者或想在旧硬件上安装的用户，很多 Chromebook 有内置 Linux 支持；WSL2——官方标为高级，让你在 Windows 内直接运行 Linux，但两个系统之间没有多少视觉分隔、容易操作到错误的系统，不推荐初学者。底部注释：读完还是不确定就选官方推荐的 VirtualBox；不要把来自其他来源的说明混着用；WSL2 不等于 WSL1，TOP 只支持 WSL2。',
      caption: '拿不定主意就选 VirtualBox（官方推荐）；双系统快但动分区；WSL2 标了高级，初学慎入。',
      points: [
        'VirtualBox：官方推荐，安装直接、零风险，不喜欢可移除。',
        '双系统：全部硬件资源、运行快得多，但改分区要仔细按说明做。',
        'WSL2：官方标高级——两系统缺少视觉分隔，容易操作错系统。'
      ]
    },
    {
      id: 'word-vs-plaintext',
      file: 'word-vs-plaintext.svg',
      lessonId: 'text-editors',
      sectionIndex: 1,
      zhTitle: '为什么不能用 Microsoft Word 写代码',
      alt: '双栏对比图。左栏是富文本编辑器（Microsoft Word、LibreOffice Writer）：很适合写一篇文章、制作漂亮格式化文档；但文件里嵌入的不只是文字，还有「怎样在屏幕上显示这些文字」的信息与「怎样显示文档中嵌入图形」的数据，这些额外信息让其他程序无法把文件当代码读取。右栏是纯文本编辑器（VSCode、Sublime）：不保存任何额外信息、只保存文字；只保存文字，才能让其他程序——比如 Ruby 的解释器——把文件当作代码来读取并执行。底部注释：恰恰是那些让富文本编辑器擅长漂亮文档的功能，使它们不适合写代码。',
      caption: 'Word 的文件里除了文字还有「怎么显示」的数据，解释器没法把它当代码读——所以要纯文本编辑器。',
      points: [
        '富文本文件嵌入了显示信息与图形数据，不只是文字。',
        '纯文本编辑器只保存文字，解释器才能读取并执行。',
        '让 Word 擅长漂亮文档的功能，恰恰让它不能写代码。'
      ]
    },
    {
      id: 'prompt-anatomy',
      file: 'prompt-anatomy.svg',
      lessonId: 'command-line-basics',
      sectionIndex: 2,
      zhTitle: '提示符是什么',
      alt: '解剖图。顶部三个小盒：打开终端后窗口大部分是空白的，只有一行文字，具体内容随操作系统不同。主体横条把这一行文字从左到右拆成三段：alex@ubuntu:~/Documents——谁@哪台机器:当前目录，告诉你「我在哪」；$ 提示符——表示终端在等你输入命令，Linux 和较旧的 Mac 以 $ 结尾，较新的 Mac 以 % 结尾，两者是一回事；whoami——你输入的命令，按 Enter 执行后返回你的用户名。阅读约定：教程写 $ whoami 时，$ 只是标记，不要输入它。',
      caption: '提示符（$ 或 %）的意思是「终端在等你输入命令」；教程里的 $ 是阅读约定，不要输入。',
      points: [
        '提示符是行尾那个符号：Linux 与旧 Mac 是 $，较新 Mac 是 %，一回事。',
        '它表示终端在等你输入命令。',
        '教程写 $ whoami 时不要输入那个 $——它只是「这是命令」的标记。'
      ]
    },
    {
      id: 'tab-completion',
      file: 'tab-completion.svg',
      lessonId: 'command-line-basics',
      sectionIndex: 6,
      zhTitle: 'Tab 补全遇到多个匹配时会怎样',
      alt: '三步流程图，从左到右：输入 cd D 然后按 Tab——主目录里通常同时有 Documents 和 Downloads 两个文件夹；终端通过显示所有匹配你已输入内容的选项（列出 Documents/ 和 Downloads/），告诉你它不确定你要哪一个；只要你再多输入一点，它就会替你补全名字。底部注释：官方例子——一条完整的文件路径最少可以只敲 cd Doc[tab]O[tab]f[tab]j[tab]cal[tab] 就打出来，具体取决于你电脑上还存在哪些别的文件夹；试一下熟悉它，你会爱上它的。',
      caption: '多个匹配时 Tab 会列出候选；再多输一点它就替你补全——这是终端「不确定」时的正确反应。',
      points: [
        'cd D 加 Tab：匹配多个时列出所有候选名字，不是出错。',
        '再输入一点按 Tab：匹配唯一就自动补全。',
        'Tab 补全大幅减少敲键，也减少打错名字。'
      ]
    },
    {
      id: 'git-vs-github',
      file: 'git-vs-github.svg',
      lessonId: 'setting-up-git',
      sectionIndex: 0,
      zhTitle: 'Git 和 GitHub 不是一回事',
      alt: '双栏对比图。左栏 Git：一个非常流行的版本控制系统（version control system），是装在你自己电脑上的软件；整套 TOP 里你会对这款软件变得非常熟悉，后面有很多专门讲 Git 的课，现在不必太担心理解它。右栏 GitHub：一个服务，让你能用 Git 上传、托管和管理你的代码，并提供一个好用的网页界面。底部注释：官方特别强调——虽然 GitHub 和 Git 听起来很像，它们并不是同一个东西，甚至不是由同一家公司创建的。',
      caption: 'Git 是装在你电脑上的版本控制软件；GitHub 是用 Git 托管代码的在线服务——名字像，不是一回事。',
      points: [
        'Git：版本控制系统，装在你自己的电脑上。',
        'GitHub：用 Git 上传、托管和管理代码的服务，带网页界面。',
        '两者甚至不是同一家公司创建的。'
      ]
    },
    {
      id: 'git-identity-config',
      file: 'git-identity-config.svg',
      lessonId: 'setting-up-git',
      sectionIndex: 5,
      zhTitle: '告诉 Git 你是谁：三条配置',
      alt: '解剖图。顶部三个小盒说明这一步的目的：让本地的 Git 用户（也就是你）和 GitHub 关联起来；在团队里工作时让人们能看到你提交了什么、每一行代码是谁提交的；配置完用 git config --get 验证输出。主体横条从左到右三段命令：git config --global user.name——引号里填入你自己的信息但保留引号本身；git config --global user.email——如果你在 GitHub 上选择了让邮箱保持私有，就使用那个特殊的 GitHub 私有邮箱，示例形如 123456789+odin@users.noreply.github.com；git config --global init.defaultBranch main——GitHub 已把新仓库默认分支从 master 改成 main，用这条命令修改 Git 的默认分支。',
      caption: '用 Git 之前先自我介绍：名字和邮箱会写进每一次提交；邮箱私有的话用 GitHub 的 noreply 专用邮箱。',
      points: [
        'user.name 与 user.email 是你写进每次提交的身份。',
        '邮箱保持私有时，用 …@users.noreply.github.com 专用邮箱。',
        '默认分支已是 main——官方给了命令让 Git 跟上 GitHub 的改动。'
      ]
    },
    {
      id: 'ssh-key-pair',
      file: 'ssh-key-pair.svg',
      lessonId: 'setting-up-git',
      sectionIndex: 7,
      zhTitle: 'SSH 密钥对：私钥和公钥各去哪里',
      alt: '概念关系图。中心是 SSH 密钥对——一个密码学上安全的标识符，像一个用来标识你这台机器的超长密码；GitHub 用它允许你上传到仓库，而不必每次输入用户名和密码。周围五个卫星：私钥 id_ed25519——留在你自己电脑上，绝不交给任何人，passphrase 口令短语用来加密它，不用口令短语则任何能访问你电脑的人都能修改你所有的 GitHub 仓库；公钥 id_ed25519.pub——交给 GitHub，GitHub 用它认出你这台机器；生成命令 ssh-keygen -t ed25519——提示保存位置时直接按 Enter，口令短语愿意就设但不是必需；先检查是否已有——ls ~/.ssh/id_ed25519.pub，出现 No such file or directory 才需要新建；多台机器多对密钥——GitHub 允许一个账号关联多个密钥对，每台机器再按说明设置一对。',
      caption: '私钥留在你电脑、公钥交给 GitHub——密钥对让 GitHub 免密码认出你；每次用私钥走 SSH 都要输口令短语（若设了）。',
      points: [
        '私钥留在本机、公钥交给 GitHub，两把钥匙是一对。',
        '口令短语加密私钥：不设的话，能碰你电脑的人就能改你所有仓库。',
        '动手前先用 ls ~/.ssh/id_ed25519.pub 检查是否已有密钥。'
      ]
    },
    {
      id: 'git-save-vs-editor-save',
      file: 'git-save-vs-editor-save.svg',
      lessonId: 'introduction-to-git',
      sectionIndex: 1,
      zhTitle: 'Git 的保存和文本编辑器的保存有什么不同',
      alt: '双栏对比图。左栏是文本编辑器的保存：一次保存把文档里所有文字记录成单个文件；你只会有一个文件记录，比如 essay.doc；除非自己做重复副本——essay-draft1、essay-draft2、essay-final——而这很难记得去做、也很难追踪。右栏是 Git 的保存：一次保存记录的是文件和文件夹的差异，并且保留每一次保存的历史记录；官方评价这个特性是改变游戏规则的（a game changer）。底部注释：副本方案里「历史」是一堆你自己命名的、彼此无关的文件；Git 方案里历史是系统自动记录的、可以回看和恢复的一串状态，你不需要靠文件名去记「哪一版才是最终版」。',
      caption: '编辑器的保存覆盖一个文件；Git 的保存记录差异并保留全部历史——不再靠 draft1/final 文件名记版本。',
      points: [
        'Git 记录的是差异，不是整份复制，每次保存都进历史。',
        '历史由系统自动记录，可以回看和恢复。',
        'draft1/draft2/final 的手工副本方案很难记得做、很难追踪。'
      ]
    },
    {
      id: 'staging-waiting-room',
      file: 'staging-waiting-room.svg',
      lessonId: 'git-basics',
      sectionIndex: 7,
      zhTitle: '两步提交：暂存区是「等候室」',
      alt: '分层堆叠图，自上而下三层：最上层是 git commit 快照——commit 时把等候室里的全部改动打包成一个快照，进入本地仓库的历史；中间层是暂存区——官方让你把它想象成改动的「等候室」，git add 文件名把挑出来的改动请进等候室，git add . 则把当前目录及其全部子目录的改动都请进来；最下层是工作区的改动——你编辑的文件里还没有被请进等候室的改动。底部注释：两步提交的好处是改了很多文件时可以挑选其中一部分一起提交、其余留到下次；后面要讲的「原子提交」最佳实践正是建立在这个两步机制上。',
      caption: '先 add 把改动请进「等候室」，再 commit 把等候室打包成快照——两步设计让你能只挑一部分改动提交。',
      points: [
        '暂存区 = 等候室：add 请改动进来，commit 打包送走。',
        'git add . 请进当前目录及全部子目录的改动。',
        '挑一部分改动提交、其余留到下次——原子提交的机制基础。'
      ]
    },
    {
      id: 'git-command-anatomy',
      file: 'git-command-anatomy.svg',
      lessonId: 'git-basics',
      sectionIndex: 13,
      zhTitle: '三段式语法：program | action | destination',
      alt: '解剖图。顶部三个小盒演示用同一模式读命令：git | add | .，句点代表当前目录里的所有内容；git | commit -m | "message"；git | status |（没有目标）。主体横条把 git push origin main 拆成三段：program（程序，永远是 git）、action（动作）、destination（目标，origin 远端仓库加 main 分支）。下方注释逐段解释：动作说明做什么——push 上传、add 暂存、commit 记录、status 查看；目标说明对什么做——可以是远端分支、文件或当前目录。学会用这个模式去读，以后见到新命令就不会慌。',
      caption: '每条 Git 命令都能读成「程序 | 动作 | 目标」——学会这个模式，见到新命令就不会慌。',
      points: [
        'git push origin main：程序 git、动作 push、目标 origin 的 main 分支。',
        'git add . 的句点代表当前目录里的所有内容。',
        'git status 没有目标——三段式不总是三段都齐。'
      ]
    },
    {
      id: 'atomic-commits',
      file: 'atomic-commits.svg',
      lessonId: 'git-basics',
      sectionIndex: 14,
      zhTitle: '最佳实践：原子提交',
      alt: '双栏对比图。左栏是原子提交（atomic commit，官方推荐）：一次提交只包含与一个功能或一个任务相关的改动；如果某个改动后来被证明造成了问题，可以只回退这个具体改动、不牵连其他改动；提交消息更有用——每条消息只需要讲清楚一件事，未来的协作者（包括几个月后的你自己）一看就懂。右栏是不这样做的混合提交：一次提交混入多个不相关的改动；出问题时无法只回退其中某一个改动；消息要一次讲清多件事，回看困难。底部注释：Git 不只在与他人协作时有用——独立工作时同样重要，将来回看旧代码你会越来越依赖自己留下的提交历史。',
      caption: '一次提交只做一件事：回退不牵连别人、消息一看就懂——官方特意强调现在就建立这个习惯。',
      points: [
        '原子提交：一次提交只含一个功能或任务相关的改动。',
        '好处一：改动出问题时只回退它自己，不牵连其他改动。',
        '好处二：每条提交消息只讲一件事，几个月后的自己也看得懂。'
      ]
    },
    {
      id: 'semantic-html',
      file: 'semantic-html.svg',
      lessonId: 'elements-and-tags',
      sectionIndex: 4,
      zhTitle: '用对标签：语义化 HTML',
      alt: '双栏对比图。左栏是用对标签（官方称之为语义化 HTML）：写标签前先想「这段内容是什么」——是段落、标题还是列表，再选对应的标签；搜索引擎靠标签理解页面内容的结构，影响站点在搜索里的排名；依赖屏幕阅读器等辅助技术上网的用户靠标签「听」懂页面，影响可访问性。右栏是用错标签的代价：页面看起来可能一样，但内容的语义丢了；搜索引擎读不懂结构，排名受损；辅助技术无法理解页面，造成访问障碍。底部注释：标签的价值不在让页面上的字好看，而在让所有读页面的「人」和程序都明白这段内容是什么。',
      caption: '写标签前先问「这段内容是什么」——用对标签决定搜索引擎和屏幕阅读器能不能懂你的页面。',
      points: [
        '语义化 HTML：给内容用正确的标签，现在就要种下的习惯。',
        '搜索引擎靠标签理解页面结构——影响搜索排名。',
        '屏幕阅读器用户靠标签「听」懂页面——影响可访问性。'
      ]
    },
    {
      id: 'newline-vs-paragraph',
      file: 'newline-vs-paragraph.svg',
      lessonId: 'working-with-text',
      sectionIndex: 1,
      zhTitle: '段落：源代码里的换行不等于分段',
      alt: '双栏对比图。左栏是源代码里的换行：浏览器在 HTML 里遇到换行时，会把它们压缩成一个单独的空格；结果所有文字挤成一长行；看起来像两段不等于显示成两段——这是官方一上来就给的反直觉例子。右栏是 p 段落元素：用一个 <p> 标签把文字内容包起来；浏览器会在每个段落之后添加一个新行；想在 HTML 里创建段落，就需要使用段落元素。底部注释：把官方那个空行隔开的两段文字的例子改成使用段落元素，问题就解决了。',
      caption: '浏览器把源代码里的换行压缩成一个空格——分段必须用 <p> 元素，空行不管用。',
      points: [
        'HTML 里的换行与空行会被浏览器压缩成一个单独的空格。',
        '<p> 元素会在每个段落之后添加一个新行。',
        '想要段落就用 <p> 包文字，别指望源代码里的空行。'
      ]
    },
    {
      id: 'heading-levels',
      file: 'heading-levels.svg',
      lessonId: 'working-with-text',
      sectionIndex: 2,
      zhTitle: '标题：六个级别，级别代表层级',
      alt: '层级树示意图。根节点是 h1——最大、最重要的标题，应当总是用于整个页面的标题；h1 下挂两个 h2 子节点（页面中较大部分内容的标题，互为兄弟）；第一个 h2 下再挂两个 h3 子节点（更小部分内容的标题，同样互为兄弟）。标题一共有 6 个不同级别，从 <h1> 到 <h6>：标签里的数字代表级别，h1 最大，h6 是最低级别里最小的标题；创建方式与段落类似，把标题文字包进对应标签。使用正确级别很重要，因为级别为内容提供了层级结构（hierarchy）。',
      caption: 'h1 到 h6，数字就是层级：h1 是整页标题，越低的级别管越小的内容——级别用对，结构才对。',
      points: [
        '六个级别的标题：h1 最大最重要，h6 最小。',
        'h1 应当总是用于整个页面的标题。',
        '级别为内容提供层级结构（hierarchy）——这是要用对级别的原因。'
      ]
    },
    {
      id: 'nesting-relations',
      file: 'nesting-relations.svg',
      lessonId: 'working-with-text',
      sectionIndex: 5,
      zhTitle: '嵌套与缩进：父、子、兄弟',
      alt: '层级树示意图。根节点是 body 元素——它是父元素（parent）；下面挂着两个 p 段落元素，它们是被嵌套在 body 里的子元素（children），两个 p 处在同一嵌套层级、互为兄弟（siblings）。官方在所有示例里把位于其他元素内部的元素做了缩进（每层嵌套缩进两个空格）——缩进让嵌套层级对自己和将来处理这份 HTML 的其他开发者清晰可读。这些关系在后面用 CSS 加样式、用 JavaScript 添加行为时会变得重要得多；现在需要的是知道元素之间怎样关联，以及描述这些关系的术语。',
      caption: '外面的是父、里面的是子、同层的是兄弟；缩进不是装饰，是让嵌套层级看得清。',
      points: [
        '嵌套创建父子关系：被嵌套的元素是子元素，包住它的是父元素。',
        '处在同一嵌套层级的元素互为兄弟。',
        '每层嵌套缩进两个空格——为了可读性，不是浏览器要求。'
      ]
    },
    {
      id: 'ul-vs-ol',
      file: 'ul-vs-ol.svg',
      lessonId: 'lists',
      sectionIndex: 2,
      zhTitle: '无序列表 vs 有序列表',
      alt: '双栏对比图。左栏是无序列表（unordered list）：做顺序不重要的项目列表时用——比如购物清单，里面的东西可以按任意顺序买；用 <ul> 元素创建，列表里的每一项用列表项元素 <li> 创建；显示效果是每个列表项以一个项目符号（bullet point）开头。右栏是有序列表（ordered list）：顺序确实重要时用——比如菜谱的分步说明，或你最喜欢的十大电视节目；用 <ol> 元素创建，每个单独项目同样用 <li> 创建；显示效果是每个列表项以一个数字开头。底部注释：怎么选，一个问题就够——顺序重要吗；真正要选的只是外层容器，里面的列表项都是 li。',
      caption: '选择只问一句：顺序重要吗？不重要用 ul（项目符号），重要用 ol（数字）；列表项都是 li。',
      points: [
        'ul：顺序不重要，每项以项目符号开头。',
        'ol：顺序重要，每项以数字开头。',
        '两者列表项都用 <li>——真正要选的只是外层容器。'
      ]
    },
    {
      id: 'href-attribute-anatomy',
      file: 'href-attribute-anatomy.svg',
      lessonId: 'links-and-images',
      sectionIndex: 3,
      zhTitle: '属性是什么，href 干什么',
      alt: '解剖图。顶部三个小盒给出属性的定义：一个 HTML 属性给元素提供额外信息；总是放在元素的开始标签里；属性通常由一个名字和一个值组成，不过并非所有属性都需要值。主体横条把一个 anchor 元素从左到右拆成四段：<a 开始标签；href="目的地地址"——href 是 hypertext reference（超文本引用），值就是想让链接去的目的地，可以指向互联网上任何类型的资源，不只是 HTML 文档，还有视频、pdf、图片等；链接文字——默认情况下有 href 时浏览器给文字加蓝色和下划线表明它是链接，被 anchor 包住但没有 href 的文字看起来像普通文本；</a> 结束标签。改完记得刷新浏览器让新改动生效。',
      caption: 'href 是链接的「目的地地址」：有了它文字才变成蓝色下划线的可点链接，没有它就只是普通文字。',
      points: [
        '属性给元素提供额外信息，总在开始标签里，名字 + 值。',
        'href 的值 = 链接目的地，可指向文档、视频、pdf、图片。',
        '没有 href 的 anchor 文字显示为普通文本。'
      ]
    },
    {
      id: 'broken-link-after-move',
      file: 'broken-link-after-move.svg',
      lessonId: 'links-and-images',
      sectionIndex: 8,
      zhTitle: '移动文件之后链接为什么断了',
      alt: '四盒流程图，从左到右：起初 index.html 与 about.html 在同一个目录里，href 直接写 about.html 就能正常跳转——因为可以用文件名作为链接的 href 值；接着为了把网站目录组织得更好，创建 pages 目录并把 about.html 移进去；刷新 index 页面再点链接——它断了，因为 about 页面文件的位置变了而 href 还指向旧位置；修法很简单——把 pages/ 目录包含进 href 值，写成 pages/about.html，那是 about 文件相对于 index 文件的新位置，刷新后链接恢复正常。底部注释：相对链接不包含域名，路径相对于创建链接的那个页面计算——文件位置变了，路径要跟着变。',
      caption: '相对路径按「链接所在页面」的位置算——移动了文件，href 就要按新的相对位置更新，否则链接断掉。',
      points: [
        '同目录时 href 直接写文件名，如 about.html。',
        '文件移进 pages/ 后链接断了——href 还指着旧位置。',
        '修法：href 更新为 pages/about.html（相对新位置）。'
      ]
    },
    {
      id: 'town-museum-rooms',
      file: 'town-museum-rooms.svg',
      lessonId: 'links-and-images',
      sectionIndex: 10,
      zhTitle: '城镇、博物馆和房间：官方的链接比喻',
      alt: '概念关系图。中心是域名 town.com——把它想成一座城镇。周围五个卫星：/museum 目录——你的网站所在的目录，是城镇里的一座博物馆；movie_room.html——网站上的每个页面是博物馆里的一个房间，这间是电影放映室；shops/coffee_shop.html——子目录里的页面，是博物馆里的商店房间；相对链接 ./shops/coffee_shop.html——从当前房间（电影放映室）到另一个房间（商店）的路线指引；绝对链接——完整的路线指引，包含协议（https）、域名（town.com），以及从那个域名开始的路径（/museum/shops/coffee_shop.html）。',
      caption: '域名是城镇、网站目录是博物馆、页面是房间：相对链接是房间到房间的指路，绝对链接是写全的完整地址。',
      points: [
        '域名 = 城镇，网站目录 = 博物馆，每个页面 = 一个房间。',
        '相对链接：从当前房间到另一个房间的路线指引。',
        '绝对链接：协议 + 域名 + 从域名开始的路径，完整路线。'
      ]
    },
    {
      id: 'parent-directory-tree',
      file: 'parent-directory-tree.svg',
      lessonId: 'links-and-images',
      sectionIndex: 18,
      zhTitle: '父目录：用 ../ 往上走一级',
      alt: '层级树示意图。根节点是 odin-links-and-images 项目目录，下面两个子目录：pages 目录里放着 about.html——你当前正在这个文件里；images 目录里放着 dog.jpg 图片。要在 about 页面里用那张狗的图片，img 的 src 写 ../images/dog.jpg，这条路径拆成三步：首先用两个点从 pages 目录往上走一级、走到它的父目录 odin-links-and-images；然后从父目录出发进入 images 目录；最后访问 dog.jpg 文件。',
      caption: '两个点 .. 代表往上走一级的父目录：../images/dog.jpg = 走出 pages → 进 images → 拿 dog.jpg。',
      points: [
        '../ 先从当前目录往上走一级——走到父目录再出发。',
        '../images/dog.jpg 三步：上到项目目录 → 进 images → 拿文件。',
        '路径永远从「当前文件所在目录」算起。'
      ]
    },
    {
      id: 'bad-vs-good-commit',
      file: 'bad-vs-good-commit.svg',
      lessonId: 'commit-messages',
      sectionIndex: 2,
      zhTitle: '坏提交和好提交的差别',
      alt: '双栏对比图。左栏是坏提交说明：官方给的例子是「fix a bug」——尽管它描述了你做了什么，这条消息太含糊，会让团队里的其他开发者困惑：修了什么 bug、为什么修，全都看不出来。右栏是好提交说明：解释你改动背后的为什么（why）；换句话说，一条提交说明描述的是你的改动解决了什么问题，以及它是怎样解决的。底部注释：「有没有解释为什么」是官方给的好坏提交说明的分水岭。',
      caption: '「fix a bug」只说了做了什么；好提交说的是为什么——解决了什么问题、怎样解决的。',
      points: [
        '坏消息含糊到费解：官方例子就是「fix a bug」。',
        '好消息解释改动背后的为什么（why）。',
        '标准：说清改动解决了什么问题 + 怎样解决的。'
      ]
    },
    {
      id: 'commit-subject-body',
      file: 'commit-subject-body.svg',
      lessonId: 'commit-messages',
      sectionIndex: 3,
      zhTitle: '一条有效提交的两个部分：subject 与 body',
      alt: '解剖图。顶部三个小盒：有效的提交由两个独立部分组成；subject 是一句话的简要总结；body 讲清问题与做法。主体横条从左到右两段：subject（主题）——对你给项目所做改动的一个简要总结，官方示意文字是 This is the change I made to the codebase；GitHub 有一个 72 字符的限制，所以官方推荐把提交的主题控制在这个数量以内。body（正文）——对你做了什么的一个简洁但清楚的描述：描述你的提交解决了什么问题，以及怎样解决的（Describe the problem your commit solves and how）。',
      caption: 'subject 一句话总结（GitHub 有 72 字符限制），body 讲清解决什么问题、怎样解决——两部分各司其职。',
      points: [
        'subject：对改动的简要总结，控制在 72 字符以内。',
        'body：简洁但清楚地描述解决了什么问题、怎样解决。',
        '72 字符是 GitHub 的限制，所以官方推荐主题不超它。'
      ]
    },
    {
      id: 'commit-length-50-72',
      file: 'commit-length-50-72.svg',
      lessonId: 'commit-messages',
      sectionIndex: 10,
      zhTitle: '两个字符数口径的关系：50 与 72',
      alt: '解剖图。顶部三个小盒：这一课涉及两个容易混的数字；50 是写作建议；72 是显示上限。主体横条把 subject 字符数画成一把尺，从左到右两段：往 50 字符靠——出自官方 Assignment 指定要读的那篇文章的「七条规则」，把 subject 限制在 50 字符左右，是更严格的写作建议；72 字符封顶——出自本课官方 tip 框，GitHub 有一个 72 字符的限制。下方注释说明两者关系：日常写法上 subject 尽量短、往 50 靠，整条说明不超过 72 字符宽，两个口径就都满足了；本站两个口径都保留，不把建议描述成 Git 命令自身的硬限制。',
      caption: '50 是写作建议（尽量短），72 是 GitHub 显示限制（不能超）——往 50 靠、72 内收尾，两个口径同时满足。',
      points: [
        '50 字符：官方指定文章「七条规则」的更严格写作建议。',
        '72 字符：GitHub 的显示限制，出自本课 tip 框。',
        '往 50 靠、不超 72——日常写法两个口径同时满足。'
      ]
    }
  ]
};
