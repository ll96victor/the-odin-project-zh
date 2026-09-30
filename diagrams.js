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
      alt: '层级树示意图。根节点是 TOP 的一课（聚合式结构），向下分出四个分支：主题介绍与背景；外部资料——它本身就是正课，再分为 MDN 等文章、YouTube 等视频、官方文档三类；Assignment 必做任务；Exercise 练习（部分课才有）。整棵树说明：一课的学习闭环是读正文和它指定的外部资料、动手做练习与任务，再进入下一课。',
      caption: '一课不只是一页文字：外部资料就是正课本身，闭环是读 → 练 → 完成必做任务 → 下一课。',
      points: [
        'TOP 靠聚合工作：课文把你指向外部文章、视频与文档，那就是正课本身。',
        'Assignment 是每课都有的必做任务；部分课另有 Exercise 练习。',
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
    },
    {
      id: 'css-three-methods-stack',
      file: 'css-three-methods-stack.svg',
      lessonId: 'intro-to-css',
      sectionIndex: 15,
      zhTitle: '三种把 CSS 加进 HTML 的方式',
      alt: '分层堆叠图，自上而下三层：最上层是内联 CSS——把声明直接写在元素的 style 属性上，没有选择器，优先级最高，会压过另外两种方式；中间层是内部 CSS——把规则写在 HTML 文件自己的 style 标签里，只作用于这一个页面，规则一多文件就会变大；最下层是外部 CSS——把规则写在单独的 .css 文件里，用 link 元素链进来，是三种里最常用、也最好维护的一种。底部注释：三种方式写的是同一套规则语言，区别只在规则放在哪里；同一个元素被多种方式命中时，内联压过内部与外部。',
      caption: '三种方式写的是同一套规则语言，区别只在「规则放在哪里」；冲突时内联压过内部与外部。',
      points: [
        '外部 CSS 最常用：规则单独成文件，用 link 元素链进来，多页共用好维护。',
        '内部 CSS 写在 HTML 自己的 style 标签里，只作用于当前页面。',
        '内联 CSS 写在元素的 style 属性上，优先级最高，官方不推荐常用。'
      ]
    },
    {
      id: 'cascade-decision-order',
      file: 'cascade-decision-order.svg',
      lessonId: 'the-cascade',
      sectionIndex: 10,
      zhTitle: '层叠的判定顺序',
      alt: '四步流程图，依次回答四个问题来确定多条冲突的 CSS 规则里哪一条生效。第一步：这条规则是直接命中该元素，还是从祖先继承来的？直接命中永远赢过继承。第二步：都比选择器类型——ID 选择器胜过任意数量的类选择器，类选择器胜过任意数量的类型选择器。第三步：类型上打平时比同类选择器的数量，数量多的赢。第四步：仍然分不出胜负时比规则顺序，写在后面的那条生效。底部注释：通配选择器与组合器符号本身不贡献任何特异性，浏览器的默认样式也参与比较，但权重通常很低。',
      caption: '冲突的规则按「直接命中 → 选择器类型 → 同类数量 → 规则顺序」依次比下去，先分出差别的那个因素就定胜负。',
      points: [
        '第一步永远是「直接命中还是继承」：直接命中赢过一切继承来的值。',
        '比特异性先比类型（ID 类 类型），类型打平才比同类数量。',
        '最后才比规则顺序：写到后面的那条生效。',
        '通配选择器与组合器符号本身不加特异性。'
      ]
    },
    /* ---------- v4.11.18（第 24–25 课，css-foundations 收组）：各配 1 张 ----------
     * 24 课用 anatomy 画盒模型四层剖面（一段一层、逐段标注——盒模型是四层，
     * nested 图型恰 3 层、columns 恰 2 栏都套不下，剖面是图型容量决定的有意取舍）；
     * 25 课用 map 画三种显示类型（中心 = display 决定的显示类型，卫星 = 三档行为）。 */
    {
      id: 'box-model-four-layers',
      file: 'box-model-four-layers.svg',
      lessonId: 'the-box-model',
      sectionIndex: 3,
      zhTitle: '盒模型的四层：由内到外',
      alt: '解剖图。主体横条从左到右四段，把一个元素盒子从内到外切开：第一段 content（内容）——装文字与图片的那一层，width / height 默认只量它；第二段 padding（内边距）——边框与内容之间的空间，把内容往里撑；第三段 border（边框）——包住 padding 与内容的一道框，哪怕只有一两个像素也占地方；第四段 margin（外边距）——盒子的边框与相邻盒子的边框之间的空间，把别的盒子推开。底部注释：布局一个网页，本质上就是在决定这些盒子怎样嵌套、怎样堆叠。',
      caption: '四层从内到外：内容、内边距、边框、外边距——padding 撑自己内部，margin 推别人，border 是两层之间实打实的一道线。',
      points: [
        'content 装内容，默认盒模型的 width 只量这一层。',
        'padding 在边框与内容之间，增加的是自己内部的空间。',
        'margin 在两边盒子的边框之间，把相邻的盒子推开。',
        'border 本身占宽度，画上去就生效。'
      ]
    },
    {
      id: 'display-types-map',
      file: 'display-types-map.svg',
      lessonId: 'block-and-inline',
      sectionIndex: 5,
      zhTitle: '三种显示类型：block、inline、inline-block',
      alt: '概念关系图。中心是「元素的显示类型（display 属性）」，三颗卫星环绕：block（块级）——独占一行、每个新元素另起一行往下堆叠，段落和标题都是默认块级；inline（行内）——不换行，排在文字流里与邻居同行，链接是典型代表，但一般别往它身上加 padding 或 margin；inline-block（行内块）——中间地带：像行内元素一样并排，又保留块级盒子的 padding 与 margin 行为，想并排摆能设尺寸的盒子时可用，不过实际项目排一行盒子更多直接用 flexbox。',
      caption: 'display 决定盒子行为：block 独占一行、inline 挤在文字流里、inline-block 并排又能设尺寸间距。',
      points: [
        'block：独占一行、往下堆叠，段落标题都是默认块级。',
        'inline：不换行、排在文字流里，链接最典型；别硬加 padding / margin。',
        'inline-block：并排放置 + 正常的尺寸间距行为，是中间地带。',
        '排一排盒子的需求，官方说实际更多用下一课的 flexbox。'
      ]
    },
    {
      id: 'flex-shorthand-anatomy',
      file: 'flex-shorthand-anatomy.svg',
      lessonId: 'growing-and-shrinking',
      sectionIndex: 2,
      zhTitle: 'flex 简写的解剖：一条声明，三个分量',
      alt: '解剖图。上方小流程：写一条声明 flex: 1，展开成三份，分别管一件事。中间一个横条代表 flex 简写（flex: 1），从左到右分成三段：flex-grow: 1、flex-shrink: 1、flex-basis: 0。下方三条注释分别说明：flex-grow 是放大因子，容器有富余空间时按这个比例增长，因子 1 与 2 的项目宽度比是 1 : 2；flex-shrink 是缩小因子，所有项目装不下时按这个比例收缩，默认 1 均匀收缩、0 绝不收缩；flex-basis 是初始尺寸即伸缩的起点，0 从零开始按比例分、auto 会参考项目的 width 声明。',
      caption: 'flex: 1 = flex-grow: 1 + flex-shrink: 1 + flex-basis: 0——放大、缩小、初始尺寸三件事一条声明说完。',
      points: [
        'flex 是简写属性：一条声明同时设置 grow、shrink、basis 三个值。',
        'grow 管富余空间怎么分蛋糕，shrink 管装不下时怎么收缩。',
        'basis 是伸缩起点：0 等分的关键，auto 才参考 width。',
        '顺序固定 grow → shrink → basis，flex: 2 0 auto 即按序对应。'
      ]
    },
    {
      id: 'flex-axes-compare',
      file: 'flex-axes-compare.svg',
      lessonId: 'axes',
      sectionIndex: 1,
      zhTitle: '主轴与交叉轴：随 flex-direction 旋转的一对坐标',
      alt: '对比图。左列标题 flex-direction: row（默认）：主轴水平、从左到右，是项目排布的方向；交叉轴垂直；justify-content 管水平分布、align-items 管垂直对齐；flex-basis 对应 width。右列标题 flex-direction: column：主轴垂直、从上到下；交叉轴水平；justify-content 变成管垂直分布、align-items 变成管水平对齐；flex-basis 对应 height。底部注释：两根轴永远互相垂直，flex-direction 一换、整组坐标旋转 90 度——对齐与尺寸属性的方向全部跟着转。',
      caption: 'row 主轴水平、column 主轴垂直；justify 永远沿主轴、align 永远沿交叉轴，basis 永远沿主轴度量。',
      points: [
        'row（默认）：主轴水平左→右，交叉轴垂直。',
        'column：主轴垂直上→下，交叉轴水平——整组坐标旋转。',
        'justify-content 沿主轴、align-items 沿交叉轴，方向随轴转。',
        'flex-basis 沿主轴度量：row 对应 width、column 对应 height。'
      ]
    },
    /* ---- 路径课试点批次 3（World 2 · 中级 HTML 概念，2026-09-25）----
     * 判据结论见 build-diagrams.mjs 同批次注释：导读课不配、SVG 课 2 张
     * 选择决策对比、tables 课 1 张嵌套骨架树。 */
    {
      id: 'svg-vector-vs-raster',
      file: 'svg-vector-vs-raster.svg',
      lessonId: 'node-path-intermediate-html-and-css-svg',
      sectionIndex: 1,
      zhTitle: '矢量 vs 位图：公式定义，还是像素网格',
      alt: '对比图。左列标题「矢量图形（SVG）」：图像由数学公式定义，形状与线条、没有像素网格；任意缩放，质量与文件体积都不变；源码是 XML，人类可读、可贴进 HTML 成为 DOM 元素；适合图标、图表、大型简单图像、图案背景。右列标题「位图（JPEG / PNG）」：图像由像素网格定义，细节受限于网格大小；放大要给新像素决定长相（没有简单解法），网格越大文件越大；二进制格式，文本编辑器打开是乱码；适合照片、细腻纹理。底部注释：怎么选——要照片级真实或细腻纹理就位图；要任意缩放、程序化修改（CSS/JS 改属性）就 SVG。',
      caption: '矢量 = 公式，缩放无损体积不变；位图 = 像素网格，放大补像素文件变大。照片用位图，图标用 SVG。',
      points: [
        '矢量用公式定义形状线条：缩放不影响质量与体积——SVG 名字里 scalable 的由来。',
        '位图细节受限于网格：放大必须决定新像素长什么样，且网格越大文件越大。',
        'SVG 源码是 XML：可读、与 HTML 互操作，成为 DOM 元素后可用 CSS/JS 操作。',
        '复杂图像（照片、细腻纹理）写成 XML 极其低效——那种场景位图才是对的工具。'
      ]
    },
    {
      id: 'svg-link-vs-inline',
      file: 'svg-link-vs-inline.svg',
      lessonId: 'node-path-intermediate-html-and-css-svg',
      sectionIndex: 5,
      zhTitle: '链接还是内联：两种嵌入方式的取舍',
      alt: '对比图。左列标题「链接（img / background-image）」：和链接普通图片一样，干净、简单；页面正常缓存；但 SVG 内容对网页代码不可见——不能动态改。右列标题「内联（代码直接贴进 HTML）」：属性对 CSS / JavaScript 可见，可动态改图；代价是代码更难读、页面缓存性变差；大 SVG 可能延迟后续 HTML 加载。底部注释：官方建议默认链接，只有要随 HTML 一起调 SVG 代码时才内联——学了 React / webpack 之后内联的缺点可以规避。',
      caption: '链接干净但不能动态改；内联全能但难读难缓存。默认链接，确要 CSS/JS 控制才内联。',
      points: [
        '链接：与普通图片同一套用法（img / background-image），干净简单。',
        '内联的唯一理由：SVG 属性对代码可见，可用 CSS/JS 动态改图。',
        '内联三代价：可读性差、缓存差、大 SVG 拖慢后续 HTML 加载。',
        '官方建议：默认链接；React / webpack 等工具能规避内联缺点，那是后面的事。'
      ]
    },
    {
      id: 'tables-four-tags-tree',
      file: 'tables-four-tags-tree.svg',
      lessonId: 'node-path-intermediate-html-and-css-tables',
      sectionIndex: 1,
      zhTitle: '最小表格的骨架：四个标签的嵌套关系',
      alt: '层级树。根节点 table（整张表）。它有两个子节点：tr（第 1 行：表头行）与 tr（第 2 行：数据行）。表头行下有两个子节点：th（表头单元格，默认加粗居中）与 th（列标签，如「姓名」）；数据行下有两个子节点：td（数据单元格）与 td（数据，如「地球」）。',
      caption: 'table 装行、tr 装格：表头行的格子是 th、数据行的格子是 td——复杂表格都在这副骨架上加东西。',
      points: [
        'table 是整张表的容器，一切表格结构都住在里面。',
        'tr 是行：表头行与数据行都是它。',
        'th 表头单元格（默认加粗居中），td 数据单元格。',
        '加更多 tr 就是更多行；thead/tbody、rowspan/colspan 是进阶教程的内容。'
      ]
    },
    /* ---- World 2 第二批（中级 CSS 概念前 5 课，2026-09-25，v4.11.21）----
     * 判据结论见 build-diagrams.mjs 同批次注释：default-styles / more-text-styles /
     * more-css-properties 三课不配；css-units 1 张参照物对比、advanced-selectors
     * 2 张选择器区分对比。 */
    {
      id: 'css-units-absolute-vs-relative',
      file: 'css-units-absolute-vs-relative.svg',
      lessonId: 'node-path-intermediate-html-and-css-css-units',
      sectionIndex: 2,
      zhTitle: 'CSS 单位参照物地图：绝对还是相对',
      alt: '对比图。左列标题「绝对单位（px）」：任何上下文里都恒定——不随页面上别的东西变；网页项目里你唯一该用的绝对单位；in / cm 等物理单位属于打印场景。右列标题「相对单位（随参照物变）」：rem = 根元素字号的倍数（经验法则：优先）；em = 自身/父级字号的倍数（随上下文漂移）；% = 父元素对应尺寸的比例；vh / vw = 视口高/宽的 1%。底部注释：选单位先答「这个尺寸该跟着什么变」——固定用 px、跟根字号用 rem、跟父级用 %、跟视口用 vw/vh。',
      caption: '绝对单位恒定（网页只用 px）；相对单位各挂各的参照物——rem 根字号、em 本地字号、% 父级、vw/vh 视口。',
      points: [
        'px 是网页项目里唯一该用的绝对单位；in/cm 属于打印。',
        'rem 挂根元素字号——官方经验法则：优先 rem。',
        'em 挂自身/父级字号，上下文一变尺寸就漂——多半不是你想要的。',
        '选单位先想「该跟着什么变」：固定 px、根字号 rem、父级 %、视口 vw/vh。'
      ]
    },
    {
      id: 'selector-combinators-reach',
      file: 'selector-combinators-reach.svg',
      lessonId: 'node-path-intermediate-html-and-css-advanced-selectors',
      sectionIndex: 1,
      zhTitle: '组合器的命中范围：纵向子代与横向兄弟',
      alt: '对比图。左列标题「纵向：子代 main > div」：只选直接子级——「往下一层缩进」；孙辈要再写一层 main > div > div；对照后代组合器（空格）选所有深度。右列标题「横向：兄弟 .group1 + div / ~ div」：加号只选紧邻其后的一个同级（group2）；波浪号选其后全部同级（group2 与 group3）；两者都只向后看，够不到之前的兄弟。底部注释：组合器不加分——特异性得分由组成部分算出（官方明说无特殊规则）。',
      caption: '> 向下一层、空格穿所有层；+ 紧邻后一个、~ 后面全部——兄弟组合器只向后看。',
      points: [
        '> 只选直接子级；孙辈要显式再下一层。',
        '后代（空格）与 > 的差别：所有深度 vs 仅一层。',
        '+ 选紧邻其后的一个同级，~ 选其后全部同级。',
        '组合器本身不加特异性——得分由组成部分算出。'
      ]
    },
    {
      id: 'pseudo-class-vs-element',
      file: 'pseudo-class-vs-element.svg',
      lessonId: 'node-path-intermediate-html-and-css-advanced-selectors',
      sectionIndex: 2,
      zhTitle: '伪类与伪元素：一个冒号和两个冒号',
      alt: '对比图。左列标题「伪类 :（单冒号）」：选 HTML 里已存在的元素——按状态或结构位置；例 :hover / :focus / :active / :link / :visited 与 :root / :first-child / :empty / :nth-child；特异性同类 (0,0,1,0)，大多可链式叠加。右列标题「伪元素 ::（双冒号）」：选标记里通常不存在的部分——用 CSS 操作；::before / ::after 能凭空加内容（配 content）；例 ::marker / ::first-letter / ::first-line / ::selection；特异性同元素 (0,0,0,1)。底部注释：现行标准伪元素用双冒号——旧文章常用单冒号，官方 Assignment 专门提醒。',
      caption: '伪类单冒号选「已存在元素的状态/位置」，特异性同类；伪元素双冒号选「不存在的部分」，特异性同元素。',
      points: [
        '伪类 = 单冒号：已存在元素的另一种选法（状态或结构位置）。',
        '伪元素 = 双冒号：标记里不存在的部分，::before/::after 能凭空加内容。',
        '特异性两串数字：伪类同类 (0,0,1,0)、伪元素同元素 (0,0,0,1)。',
        '现行标准是双冒号——旧文章的单冒号写法不要学。'
      ]
    },
    /* World 2 第三批（2026-09-26）：「中级 CSS 概念」后 5 课配 2 张（判据五条逐课结论
     * 与三课不配的理由，记在 tools/build-diagrams.mjs 的同批注释里）。 */
    {
      id: 'positioning-five-modes-map',
      file: 'positioning-five-modes-map.svg',
      lessonId: 'node-path-intermediate-html-and-css-positioning',
      sectionIndex: 4,
      zhTitle: '定位的五种模式：参照谁定位、是否脱离文档流',
      alt: '概念关系图。中心是「position 的五种模式」，副标题提示看两件事：参照谁定位、是否脱离文档流。五颗卫星环绕：static 静态——默认值，按文档流正常排列，top、right、bottom、left 一律不起作用；relative 相对——参照自己原本的位置偏移，不脱离文档流，原空间仍保留，后面的元素不会补位；absolute 绝对——脱离文档流，参照最近的已定位祖先，放到精确一点，适合模态框、图上文字与角标；fixed 固定——脱离文档流，参照视口定位，滚动时钉住不动，适合导航栏与悬浮按钮；sticky 粘性——不脱离文档流，滚过之前是普通元素，滚过之后才像 fixed，适合分区标题吸顶。',
      caption: '五种模式只看两件事：参照谁定位、是否脱离文档流——absolute 与 fixed 脱流，relative 与 sticky 不脱流。',
      points: [
        'static 是默认值：四个方向属性对它无效。',
        'relative 参照自己原本的位置，仍占位；absolute 参照最近的已定位祖先，脱流。',
        'fixed 参照视口、滚动不动；sticky 不脱流、滚过之后才吸住。',
        'absolute 跑偏多半是「没有已定位的祖先」——给参照容器加 position: relative。'
      ]
    },
    {
      id: 'custom-property-scope-tree',
      file: 'custom-property-scope-tree.svg',
      lessonId: 'node-path-intermediate-html-and-css-custom-properties',
      sectionIndex: 5,
      zhTitle: '自定义属性的作用域：声明在选择器上，覆盖范围是它和它的后代',
      alt: '层级树。根节点是「:root（全局声明 --main-color）」，表示声明在根选择器上的变量全文件任何选择器都能取到，因为其他选择器都是它的后代。根下有三个子节点：第一个是「.cool-div（局部声明 --main-bg）」，它自己又有两个子节点——「.cool-paragraph：取到 --main-bg，因为它是后代、在作用域内」与「.card：重定义 --main-bg，只改这一支、别处不受影响」；第二个是「.boring-paragraph：取不到 --main-bg，因为它不是 .cool-div 的后代」；第三个是「[data-theme="dark"]：同名变量换一套取值，这就是主题」。',
      caption: '作用域由选择器决定，范围是它自己加它的后代——所以全局变量声明在 :root，主题则是给同名变量在不同上下文换值。',
      points: [
        '作用域 = 声明它的那个选择器 + 它的所有后代（与 JavaScript 作用域直觉相似）。',
        '想全文件可用就声明在 :root：其他选择器都是 :root 的后代。',
        '在子树上重定义同名变量 = 只影响那一支，这是组件级主题的基础。',
        '换主题的本质：给同一批变量名在不同上下文（class 或 data-theme）里换一套取值。'
      ]
    },
    {
      "id": "user-valid-state-timeline",
      "file": "user-valid-state-timeline.svg",
      "lessonId": "node-path-intermediate-html-and-css-form-validation",
      "sectionIndex": 7,
      "zhTitle": "校验样式的三态时间线：:user-valid 与 :user-invalid 什么时候才命中",
      "alt": "流程图，五个节点从左到右依次推进。第一步「页面刚加载」，副标题「中性外观」——用户还没碰过任何输入框，:user-valid 与 :user-invalid 都不命中，输入框保持浏览器默认样式。第二步「填入非法值」，副标题「仍未完成交互」——只是输入了错误内容但没有离开这个框，边框不会变红。第三步「点击别处 / Tab 离开」，副标题「变红（:user-invalid）」——这构成一次完整的用户交互，伪类开始命中，边框切换成红色。第四步「改成合法值」，副标题「自动变绿」——:user-valid 命中，边框自动切换成绿色。第五步「再改回非法」，副标题「自动变回红」——此后边框会随内容的合法性在红绿之间自动来回切换，不需要再写任何脚本。图下方的说明是：:user-valid 与 :user-invalid 只在用户完成一次完整交互后才命中，所以页面刚加载时不会满屏红框，这正是它们与 :invalid / :valid 的关键差别。",
      "caption": "三态时间线：加载中中性 → 完成一次交互后非法变红 → 改对自动变绿；关键是「先有一次完整交互」。",
      "points": [
    "页面刚加载时两个伪类都不命中，输入框保持浏览器默认的中性外观。",
    "只填入非法值但不离开该框，仍然不变红——必须完成一次完整交互（点击别处或按 Tab 离开）。",
    "交互过一次之后，边框随内容合法性在红绿之间自动切换，不需要写脚本。",
    "换成 :invalid 做同一件事，会在加载瞬间就把空的必填框判红，用户还没开始填就看到满屏红框。"
      ]
    },
    {
      "id": "grid-explicit-vs-implicit",
      "file": "grid-explicit-vs-implicit.svg",
      "lessonId": "node-path-intermediate-html-and-css-creating-a-grid",
      "sectionIndex": 4,
      "zhTitle": "显式网格 vs 隐式网格：轨道的两种来历",
      "alt": "左右两栏对比图。左栏标题「显式网格（explicit）」：你用 grid-template-columns / grid-template-rows 定义出来的部分；轨道数量与尺寸都由你说了算；相当于图纸——先画好、再施工。右栏标题「隐式网格（implicit）」：项目超出显式定义时，Grid 自动创建的轨道；尺寸不继承显式轨道，默认由内容撑开；用 grid-auto-rows / grid-auto-columns 控制尺寸，用 grid-auto-flow 控制补轨道的方向。图下说明：两者是同一张网格的两半，显式部分画完后隐式部分自动接管——「第五个项目去哪了」的答案永远在隐式轨道里。",
      "caption": "你定义的轨道是显式网格；内容超出时 Grid 自动补的轨道是隐式网格——两者的尺寸互不继承。",
      "points": [
        "显式：grid-template-columns / rows 定义的轨道，数量与尺寸都由你指定。",
        "隐式：项目超出时自动补，尺寸默认由内容撑开、不继承显式值。",
        "隐式轨道的尺寸用 grid-auto-rows / grid-auto-columns 定，补的方向用 grid-auto-flow 改。"
      ]
    },
    {
      "id": "grid-lines-and-cells",
      "file": "grid-lines-and-cells.svg",
      "lessonId": "node-path-intermediate-html-and-css-positioning-grid-elements",
      "sectionIndex": 2,
      "zhTitle": "网格部件解剖：线、轨道、单元格与项目",
      "alt": "结构解剖图，顶部三个阶段带：用 grid-template 定义轨道、线与单元格随之隐式产生、项目按线号或区域名落位。中央被拆解的主体是「3×3 网格（容器）」，拆出四个部件：网格线 line——随轨道定义隐式产生、不能直接创建，从 1 开始编号，n 条轨道对应 n+1 条线，负数线号从另一端倒数；轨道 track——两条相邻线之间的空间，一条行轨道或一条列轨道；单元格 cell——一条行轨道与一条列轨道的交集，类似电子表格的一格，默认每个项目占一格；网格项目 item——容器的直接子元素，按线号或区域名定位、可以跨多格。",
      "caption": "定义轨道产生线，线与线围出单元格，项目落进单元格——Grid 定位坐标系的四件套。",
      "points": [
        "线随轨道隐式产生：n 条轨道对应 n+1 条线，编号从 1 开始。",
        "单元格 = 行轨道 × 列轨道的交集，默认一个直接子元素占一格。",
        "定位说的是线不是格：start / end 线号决定项目跨几行几列。"
      ]
    },
    {
      "id": "grid-auto-fit-vs-fill",
      "file": "grid-auto-fit-vs-fill.svg",
      "lessonId": "node-path-intermediate-html-and-css-advanced-grid-properties",
      "sectionIndex": 10,
      "zhTitle": "auto-fit vs auto-fill：填不满时的分岔",
      "alt": "左右两栏对比图，比较 repeat() 的两个自动计数值在项目填不满一行时的差异。左栏标题「auto-fit · 用项目填满行」：空轨道被折叠，现有项目拉伸到最大值（例如 1fr）；项目比列数少时，项目撑满整行；典型场景是卡片流，希望卡片占满容器宽度。右栏标题「auto-fill · 保留空轨道」：空轨道被保留，项目缩回最小值（例如 150px）；项目比列数少时，行尾留着空位；典型场景是给未来的项目预留格位、保持项目尺寸稳定。图下说明：两者只在项目填不满一行时有差别；项目填满行时渲染结果完全一样，因此选择依据是「空出来的时候，你要项目撑满还是留格位」。",
      "caption": "填不满时：fit 折叠空轨道、项目拉伸撑满行；fill 保留空轨道、项目停在最小值。",
      "points": [
        "项目填满行时，两者渲染结果完全一样——差别只在填不满时出现。",
        "auto-fit：折叠空轨道，项目拉伸到最大值（1fr 即平分撑满）。",
        "auto-fill：保留空轨道位，项目缩回最小值，行尾留空。"
      ]
    },
    /* ---------- World 3 批次 4 阶段 1（2026-09-26，v4.11.23）：javascript 课程 9 张 ----------
     * 判据五条逐课过筛（LESSON-PAGE-GUIDE.md §4.1）：4 门 Project 课按任务纪律不配图；
     * how-this-course-will-work（课程导览，World 3 地图已由首页承载，判据 3 重叠）与
     * organizing-code-with-objects（对象哲学课，文字与代码示例已足够清楚，判据 1）不配；
     * oop-principles（松耦合/单一职责为决策原则，文字列表已够清楚，判据 1）不配；
     * npm 课正文无 install 三产物解剖的可画结构、改为 package.json 中心流程（§[3] 正文
     * 的 clone→install→读清单→抓代码→scripts 可用链路）。全部为生成器图（tools/
     * build-diagrams.mjs GEOMETRY_SPECS 同步新增 9 条），图型只用既有 flow / compare，
     * 零图型库扩展；内容逐段对照 courses/javascript.js 对应章正文编写。 */
    {
      id: 'proto-vs-prototype-naming',
      file: 'proto-vs-prototype-naming.svg',
      lessonId: 'node-path-javascript-object-constructors',
      sectionIndex: 3,
      zhTitle: '.prototype 与 [[Prototype]]：名字像，是两个东西',
      alt: '左右两栏对比图。左栏标题「Constructor.prototype——函数上的属性」：它是构造器函数自己的属性；决定 new 出来的实例的 [[Prototype]] 挂到谁；共享方法与属性就放这里，全体实例共用一份。右栏标题「对象的 [[Prototype]]——内部链接」：每个对象都有一个，是属性查找向上走的那条路；读用 Object.getPrototypeOf()、写用 Object.setPrototypeOf()；旧写法 .__proto__ 非标准且已废弃。图下说明：两个概念的交点——new Player() 造出的实例，其 [[Prototype]] 正好指向 Player.prototype。',
      caption: '.prototype 是函数上的属性，决定实例的原型挂谁；[[Prototype]] 是对象内部的链接，属性查找沿它向上——交点在 new 的那一刻。',
      points: [
        '.prototype 只存在于函数上：它是「new 时实例原型挂谁」的答案。',
        '[[Prototype]] 每个对象都有：读 getPrototypeOf、写 setPrototypeOf。',
        '.__proto__ 是非标准已废弃写法——旧代码里认得出，自己不要写。'
      ]
    },
    {
      id: 'prototype-chain-lookup',
      file: 'prototype-chain-lookup.svg',
      lessonId: 'node-path-javascript-object-constructors',
      sectionIndex: 4,
      zhTitle: '原型链查找：player1.valueOf() 是怎么找到的',
      alt: '四步流程图，展示一次属性查找沿原型链逐级向上的过程。第一步「player1 自身」：valueOf 是自己的属性吗——不是。第二步「Player.prototype」：也没有定义 valueOf。第三步「Object.prototype」：找到了，valueOf 定义在这里，调用成功。第四步「null（链尾）」：如果查到终点还没有，返回 undefined。图下说明：查找沿 [[Prototype]] 链逐级向上，一个对象只有一个 [[Prototype]]（没有多继承），Object.prototype 的原型是 null——链不会无限延伸。',
      caption: '属性查找一路向上：先问自己，再逐级问原型，终点是 null；查到终点还没有就返回 undefined。',
      points: [
        '查找顺序：实例自身 → Constructor.prototype → Object.prototype → null。',
        '省内存的原因：公共方法在原型上只存一份，全体实例共享。',
        '一个对象只有一个 [[Prototype]]——JavaScript 没有多继承。'
      ]
    },
    {
      id: 'closure-private-factory',
      file: 'closure-private-factory.svg',
      lessonId: 'node-path-javascript-factory-functions-and-the-module-pattern',
      sectionIndex: 4,
      zhTitle: '工厂函数的私有变量：闭包把作用域留了下来',
      alt: '五步流程图。第一步「调用 createUser(josh)」：函数体执行一遍。第二步「let reputation = 0」：变量出生在这次调用的作用域里。第三步「返回只带两个闭包的对象」：getReputation 与 giveReputation，reputation 本体不在返回对象里。第四步「作用域没有销毁」：闭包让变量随方法一起活着。第五步「josh.reputation 是 undefined」：外界摸不到变量本体，只能走留下的两个函数。图下说明：对象简写 { reputation } 只是复制当时的值，不是返回变量本身——访问私有变量的唯一途径是闭包。',
      caption: '每次调用工厂，参数与内部变量活进一份新作用域；返回对象里的方法是闭包，外界只能走它们留下的口子。',
      points: [
        '私有 = 返回对象里没有变量本体、也没有它的副本，只有操作它的闭包函数。',
        '对象简写展开是复制当时的值——新属性不「追踪」原变量。',
        '工程理由：把能做的事限定在设计好的轨道内，杜绝手滑直改。'
      ]
    },
    {
      id: 'class-vs-prototype-mapping',
      file: 'class-vs-prototype-mapping.svg',
      lessonId: 'node-path-javascript-classes',
      sectionIndex: 1,
      zhTitle: 'class 语法 ↔ 构造器 + 原型：逐条对照',
      alt: '左右两栏对比图。左栏「class 语法（ES6）」：class Player { ... } 声明包住整个蓝图；constructor 在 new 时自动执行、装实例数据；类体里直接写的方法自动住在 prototype 上；漏写 new 直接抛 TypeError（防护内置）。右栏「构造器 + 原型（上一课）」：function Player(...) 的函数体装实例数据；手动写 Player.prototype.method 赋值；方法住在原型上、全体实例共享；漏写 new 静默错误行为（要自己加 new.target 防护）。图下说明：底层机制没有变、没有经典继承在发生——class 是构造器 + 原型的新语法；另外类体自动严格模式、方法默认不可枚举。',
      caption: '每见一个 class 特性就翻译回原型知识：constructor 对函数体、类体方法对 prototype 赋值、内置的 new 防护对手写的 new.target。',
      points: [
        'class 是语法糖：底层机制没变，没有经典继承在发生。',
        '类体方法自动住 prototype——等价于手写 prototype 赋值。',
        '独特属性：自动严格模式、方法默认不可枚举、漏写 new 抛 TypeError。'
      ]
    },
    {
      id: 'module-dependency-graph',
      file: 'module-dependency-graph.svg',
      lessonId: 'javascript-es6-modules',
      sectionIndex: 5,
      zhTitle: '入口与依赖图：一个 script 标签管全部',
      alt: '四步流程图。第一步「HTML 只挂一个 script 标签」：type=module 指向入口文件 two.js。第二步「two.js import one.js」：one.js 成为 two.js 的依赖。第三步「浏览器加载入口 two.js」：看到依赖，把 one.js 的代码也加载进来。第四步「依赖图可以继续长」：three.js 导出给 two.js，或经 one.js 间接依赖，入口不变。图下说明：入口永远是依赖链最上游的消费者——用 one.js 当入口就坏事，它不依赖任何文件，two.js 的代码根本不会被用到；type=module 自动延迟执行、不必写 defer；file:// 直开的页面不能加载 ES 模块，需要本地服务器。',
      caption: '浏览器从入口出发沿 import 递归加载依赖——只需要一个 script 标签，也不需要 defer。',
      points: [
        '入口 = 依赖链最上游的消费者；挂错入口，下游代码根本不会执行。',
        'type="module" 自动延迟执行，defer 不用写。',
        'ES 模块不能在 file:// 页面里加载——用本地服务器（如 Live Preview 扩展）。'
      ]
    },
    {
      id: 'npm-install-flow',
      file: 'npm-install-flow.svg',
      lessonId: 'node-path-javascript-npm',
      sectionIndex: 3,
      zhTitle: 'npm install 的一趟旅行：从清单到可用的包',
      alt: '五步流程图。第一步「package.json」：项目清单，存着名字、依赖及版本号。第二步「npm install」：命令行工具读清单。第三步「npm 仓库」：插件、库与工具的巨型仓库，按清单把包下载下来。第四步「node_modules/」：所有已安装包的代码存放在本地，可以 import 进自己的文件。第五步「scripts 就绪」：package.json 里 npm run 的命令能跑了。图下说明：仓库本身不包含依赖代码——谁 clone 谁跑 install，npm 替你把代码抓来；用 npm 装新包或卸载时，它会自动更新 package.json。',
      caption: 'package.json 是清单、npm 仓库是货源地、node_modules 是本地库房——install 就是把清单变成库房里现货的一趟旅行。',
      points: [
        'npm 的一切围绕 package.json 转：按正确版本安装列出的全部依赖。',
        '仓库不携带依赖代码：clone 之后必须跑 install 才有 node_modules。',
        '装包 / 卸载时 npm 自动更新 package.json——清单和库房保持同步。'
      ]
    },
    {
      id: 'webpack-bundle-flow',
      file: 'webpack-bundle-flow.svg',
      lessonId: 'javascript-webpack',
      sectionIndex: 1,
      zhTitle: '打包器的一趟工作：入口进，单文件出',
      alt: '四步流程图。第一步「入口文件」：给打包器一个 entry，从这里开始。第二步「构建依赖图」：顺着 import 找出所有相关文件。第三步「合并打包」：把所有相关文件合并到一起，输出一个包含全部必要代码的单一文件。第四步「额外优化（可选）」：压缩代码、图片优化、摇树（把没用到的代码摇出产物）。图下说明：入口与依赖图的概念在 ESM 课学过，在打包语境原样适用；额外优化大多超出本课程范围——本课专注基础 JS 打包与 HTML、CSS、图片的处理。',
      caption: '打包 = 从入口构建依赖图，把所有相关文件合并成单一输出文件；压缩与摇树是顺带的加分项。',
      points: [
        '入口 + 依赖图 + 单文件输出——ESM 课的概念在打包语境原样适用。',
        '摇树：把「导出了但没人用」的代码摇出产物。',
        '本课范围：基础 JS 打包与 HTML / CSS / 图片处理。'
      ]
    },
    {
      id: 'dev-vs-prod-mode',
      file: 'dev-vs-prod-mode.svg',
      lessonId: 'node-path-javascript-revisiting-webpack',
      sectionIndex: 2,
      zhTitle: '两种 mode：为开发调优，还是为部署调优',
      alt: '左右两栏对比图。左栏「development 模式」：为开发体验调优，代码可读、报错好定位；配合 webpack serve 改动自动重建，不用手动重打包；开发期一直用它，产物不拿去部署。右栏「production 模式」：为部署产物调优，做压缩、摇树等优化；bundle 变成「更加华丽的一团乱码」——体积更小、加载更快；每次手改模式太蠢，用两份配置文件各管各的。图下说明：官方口径——真的不需要知道每项优化细节，知道两种模式存在、各为特定目的设计就很好；build 与 dev 两个 npm script 用 --config 各指一份配置，webpack-merge 管公共部分。',
      caption: 'development 为开发体验调优、production 为部署产物调优；两份配置文件 + 两个 npm script，设置一次就忘掉它。',
      points: [
        '改一次 mode 就能亲眼看到 bundle 从可读变成「华丽的一团乱码」。',
        '两份配置文件（dev / prod）各管各的，--config 指定用哪份。',
        '官方定调：不必知道优化细节，知道两种模式的存在与目的就够。'
      ]
    },
    {
      id: 'json-round-trip',
      file: 'json-round-trip.svg',
      lessonId: 'node-path-javascript-json',
      sectionIndex: 2,
      zhTitle: 'JSON 往返：stringify 存进去，parse 取出来',
      alt: '五步流程图，展示数据在 JSON 形态与 JavaScript 对象形态之间的一次往返。第一步「JS 对象」：带着方法的数据。第二步「JSON.stringify()」：序列化，对象变成 JSON 文本。第三步「存储 / 传输」：存进 localStorage、或发给服务器。第四步「JSON.parse()」：解析，JSON 文本变回对象。第五步「方法没了」：JSON 里不能存函数，取回后要自己把方法装回对象。图下说明：方向记清——存/传之前 stringify、收到/读出之后 parse；Todo List 的持久化正是这一趟往返，怎么把行为装回去是官方留给你的思考题。',
      caption: 'stringify 是对象变文本（存/传之前），parse 是文本变对象（读回之后）——函数挤不进 JSON，往返一圈要自己装回方法。',
      points: [
        '方向别记反：stringify 序列化出去、parse 解析回来。',
        'JSON 里不能存函数——取回的是纯数据，行为要重建。',
        'localStorage 就用 JSON 存取：Todo List 持久化的架构基础。'
      ]
    },
    {
      id: 'linter-vs-formatter',
      file: 'linter-vs-formatter.svg',
      lessonId: 'node-path-javascript-linting',
      sectionIndex: 2,
      zhTitle: 'Linter 与 Formatter：一个管对不对，一个管齐不齐',
      alt: '两列对比图。左列「Linter（ESLint）· 管对不对」：按风格规则扫描代码、报告违规；有些问题能自动修复；规则可配置（包含/排除、逐条开关）。右列「Formatter（Prettier）· 管齐不齐」：只管排版（空格、缩进、换行）；不找风格错误、不判代码对错；高度有观点、几乎没有可配置项。图下说明：两者都装成 devDependency、可以共存——用 ESLint 默认推荐规则集时与 Prettier 无冲突、无需 eslint-config-prettier（官方明文）；IDE 扩展只是便利层，项目里的包与配置文件才是事实源。',
      caption: 'Linter 找「违反规则的写法」，Formatter 做「排版决定」——职能不同、可以共存，都住在项目 devDependencies 里。',
      points: [
        'ESLint 管对错与规则违规，Prettier 只管代码长相。',
        '默认推荐规则集下两者无冲突——直接装，无需 eslint-config-prettier。',
        'IDE 扩展是便利层：项目里的包与配置才是事实源。'
      ]
    },
    {
      id: 'html-vs-js-validation',
      file: 'html-vs-js-validation.svg',
      lessonId: 'node-path-javascript-form-validation-with-javascript',
      sectionIndex: 1,
      zhTitle: '两层表单校验：HTML 内置管标准约束，JS 管逻辑与文案',
      alt: '两列对比图。左列「HTML 内置校验（World 2 已学）」：required、minlength、pattern 单字段约束；浏览器自动拦截加内置提示气泡；文案与样式不可定制、跨字段逻辑做不到。右列「JS Constraint Validation API（本课）」：checkValidity() 与 validity 查不合规原因；setCustomValidity() 塞自定义文案；跨字段逻辑（如密码确认）加 live inline 校验。图下说明：两层是分工不是替代——HTML 属性设置标准约束（validity 状态照常可查），JS 接管逻辑与文案；form 加 novalidate 关掉浏览器自动拦截，全部校验由你的 JS 负责（官方练习模式）。',
      caption: '内置校验是浏览器白送的第一层；跨字段逻辑与自定义文案必须 JS 接管——novalidate 一加，大权全在你的代码。',
      points: [
        'HTML 层管单字段标准约束，JS 层管跨字段逻辑与文案。',
        'validity 对象给每个不合规原因一个名字——分支判断有据可依。',
        'novalidate 关的是「浏览器自动执行」，不是「约束本身」。'
      ]
    },
    {
      id: 'es-naming-timeline',
      file: 'es-naming-timeline.svg',
      lessonId: 'node-path-javascript-ecmascript',
      sectionIndex: 1,
      zhTitle: 'ECMAScript 命名与发布时间线：从攒大招到每年一版',
      alt: '五步流程时间线。第一步「ES5 及以前」：版本号命名、攒大招式发布。第二步「ES6 = ES2015」：2015 年夏发布，TC39 委员会改用年份命名。第三步「ES2016 起」：有人叫它 ES7，从此每年一版。第四步「每版少量新增」：特性细水长流进来。第五步「widely available」：新特性到主流浏览器普遍支持常滞后几年，必要时用 Babel 按 targets 转译。图下说明：「ES+数字」与「ES+年份」是同一条时间线的两套叫法；个人开发的自动更新浏览器感知不到滞后，面向公众的产品要查支持状态。',
      caption: 'ES6 就是 ES2015——TC39 改制后每年一版、每版少量新增；新特性到「哪都能跑」常要几年，中间靠 Babel 转译。',
      points: [
        '两套命名一条线：ES6 = ES2015、ES7 = ES2016。',
        '发布节奏改制：攒大招 → 年度小步。',
        'widely available 滞后是现实——真实产品要查支持矩阵、配 Babel targets。'
      ]
    },
    {
      id: 'callback-hell-vs-promise-chain',
      file: 'callback-hell-vs-promise-chain.svg',
      lessonId: 'node-path-javascript-asynchronous-code',
      sectionIndex: 3,
      zhTitle: '回调地狱与 Promise 链：金字塔与一条线的差别',
      alt: '两列对比图。左列「回调串联 · 回调地狱」：每步嵌进上一步的回调体；缩进长成金字塔、越来越深；逻辑分散、错误处理各自为政。右列「Promise 链 · 平铺直叙」：.then() 一环接一环排成一条线；值沿链流动（return 即传给下一环）；.catch() 在链尾统一接错。图下说明：官方 getData() 的教训——同步思维取异步数据拿到 undefined；Promise 是「未来某个时刻可能产出一个值的对象」，.then() 告诉代码「等 resolved 再跑里面的函数」。单个回调没问题（addEventListener 天天用），失控发生在按顺序串联好几个的时候。',
      caption: '回调串联长成金字塔，Promise 把它拉平成一条链——值沿链流动，错误在链尾统一接。',
      points: [
        '回调地狱的成因：顺序依赖的异步各要一个回调、层层嵌套。',
        'Promise 链的结构性优势：平铺、可传值、统一 catch。',
        'Promise 本质：未来某刻可能产出值的对象——.then() 等它 resolve。'
      ]
    },
    {
      id: 'fetch-two-promises',
      file: 'fetch-two-promises.svg',
      lessonId: 'node-path-javascript-working-with-apis',
      sectionIndex: 5,
      zhTitle: 'fetch 的两层 Promise：从请求到上屏的五步',
      alt: '五步流程图。第一步「fetch 请求」：url 进、Promise 出——发起请求即返回 Promise #1。第二步「Response 外壳」：查 ok 与 status——404 也会 resolve。第三步「response.json()」：解析响应体，返回 Promise #2。第四步「数据对象」：层层钻取（如 data.images.original.url）。第五步「上屏」：img.src 赋值渲染。图下说明：两层 Promise、两个 .then()（async/await 版就是两个 await）；fetch 只在网络层失败时 reject——API 有响应就算有效，非 2XX 要在 .then() 里查 Response.ok / status 手动分支（官方 Assignment 明文）。',
      caption: 'fetch 一层 Promise、json() 又一层——两个 .then()（或两个 await）；404 不进 catch，ok/status 手动查。',
      points: [
        '两层 Promise：Response 外壳与 json() 解析各是一层。',
        '404 也是有效响应——fetch 只为网络层失败 reject。',
        '非 2XX 在 .then() 里查 ok / status 手动分支。'
      ]
    },
    /* ---------- World 3 批次 4 阶段 3（2026-09-27，v4.11.25，通宵轮）：javascript 课程
     * 第五、六章新增 5 张（生成器产出；判据与逐课决策记录住 tools/build-diagrams.mjs
     * 同批注释）。Project 课（testing-practice / recursion / linked-lists / hashmap /
     * binary-search-trees / knights-travails）一律不配——任务纪律：流程/架构图会变相
     * 给出实现提示（与 weather-app 同口径）。 ---------- */
    {
      id: 'tdd-red-green-refactor',
      file: 'tdd-red-green-refactor.svg',
      lessonId: 'node-path-javascript-testing-basics',
      sectionIndex: 0,
      zhTitle: 'TDD 工作循环：测试先行，实现跟上',
      alt: '五步流程图。第一步「写测试」：测试先失败——功能还不存在。第二步「写实现」：写让测试通过的最小代码。第三步「重构」：在测试保护下整理代码、行为不变。第四步「下一个功能」：循环重复、测试永远走在实现前面。第五步「回归保障」：每次改动后全量跑测试，旧功能被改坏会当场变红。图下说明：官方的 TDD 核心思想是「先写自动化测试，再写被测代码」；测试先失败一次证明它真的在测东西；先写测试逼你先想清楚接口与边界——这是「TDD 鼓励更好的程序架构」的机制，循环理念由 Assignment 的两篇存档文章展开。',
      caption: '先写测试再写代码——测试先红一次才证明它真的在测东西；实现追着测试跑，重构有保护网。',
      points: [
        '顺序即方法：测试先行，实现是让测试变绿的最小代码。',
        '第一次失败是特性不是事故——没红过的测试没证明过自己能抓 bug。',
        '全量测试是回归保障：改动打破旧行为当场变红。'
      ]
    },
    {
      id: 'recursion-dive-and-unwind',
      file: 'recursion-dive-and-unwind.svg',
      lessonId: 'javascript-recursive-methods',
      sectionIndex: 0,
      zhTitle: '递归的下潜与上浮：整条链怎么展开',
      alt: '五步流程图。第一步「大问题」：原始调用。第二步「拆解下潜」：函数调用自己、把更小的子问题传下去。第三步「触底」：base case——子问题小到可以直接解决。第四步「上浮组合」：每层把子问题的解组合起来、返回给上一层。第五步「顶层答案」：整条链展开完毕、原问题得解。图下说明：官方定义——递归就是函数调用自己的想法，把大问题拆成越来越小的块（分而治之），把子解持续喂回原函数，直到得出答案、整条链展开；每层调用占一帧调用栈，深度失控就是 stack overflow（Assignment 第 1 条的 javascript.info 文章展开）。',
      caption: '递归 = 下潜拆解 + 触底 + 上浮组合——每层只信「下一层会给我子解」，触底条件是唯一的安全网。',
      points: [
        '下潜：每层把更小的同类子问题交给函数自己。',
        '触底：base case 直接可解——没有它链永远不停。',
        '上浮：子解逐层组合回顶层——「整条链展开」就是这个过程。'
      ]
    },
    {
      id: 'big-o-fast-vs-slow',
      file: 'big-o-fast-vs-slow.svg',
      lessonId: 'javascript-time-complexity',
      sectionIndex: 3,
      zhTitle: '八个 Big O 记号：快慢两侧的增长形状',
      alt: '两列对比图。左列「快侧：数据翻倍、步数温和」：O(1) 常数——按索引取值永远一步；O(log N)——二分查找每步砍半、数据翻倍步数只加一；O(N) 线性——步数与元素数同速增长；O(N log N)——对半拆加每半线性处理（merge sort）。右列「慢侧：数据翻倍、步数暴涨」：O(n²) 双层循环——3 项 9 步、10 项 100 步；O(n³) 三层循环——10 项 1000 步、100 项一百万；O(2ⁿ) 指数——每加一项步数翻倍、10 项 1024；O(N!) 阶乘——排列组合、10! 等于 3,628,800。图下说明：Big O 度量步数随数据规模怎么变、丢弃常数（O(N/2) 与 O(10N) 都记 O(N)）；但小输入时常数真的有用——官方对照表里 N=1 时 O(n²) 一步反而快过 O(10N) 十步。等级选对，且在等级内尽可能高效。',
      caption: '记号的本质是增长形状：快侧翻倍加一点，慢侧翻倍翻几番——等级选对，等级内再抠常数。',
      points: [
        '快侧四记号：O(1)、O(log N)、O(N)、O(N log N)——大规模数据的可用区。',
        '慢侧四记号：O(n²)、O(n³)、O(2ⁿ)、O(N!)——数据一多就失控。',
        'Big O 丢常数看趋势；小输入场景常数仍决定快慢。'
      ]
    },
    {
      id: 'hashmap-key-to-bucket',
      file: 'hashmap-key-to-bucket.svg',
      lessonId: 'javascript-hashmap-data-structure',
      sectionIndex: 2,
      zhTitle: 'hash map 的一跳到位：从键到桶的五步',
      alt: '五步流程图。第一步「键」：用户提供的字符串——永远不直接用键访问桶。第二步「散列函数」：质数 31 逐字符乘加，字母位置参与散列。第三步「散列码」：一个纯数字，桶索引的候选地址（例如 385）。第四步「取模」：散列码对当前容量取模（385 % 16），落进 0 到 15 的桶。第五步「桶：比键取值」：不同键可能同桶（冲突）——比较键相同才返回值，否则 null。图下说明：官方存值三步——散列键得散列码、找到该索引的桶、存入键值对；取值多一步比键，因为散列码只是位置、冲突必然发生（鸽笼原理）——桶里的链表住多个节点时，键是唯一身份。平均 O(1)，最坏 O(n)（全部数据散列到同一个桶）。',
      caption: '键进、散列码出、取模落桶、比键取值——「算出位置」代替「挨个找」，这就是 O(1) 的来源。',
      points: [
        '散列码只是位置不是身份——取值必须比键（冲突必然存在）。',
        '取模把任意大的散列码压进有限的桶数组。',
        '每个桶是一条链表：冲突的键值对共存、互不覆盖。'
      ]
    },
    {
      id: 'bfs-vs-dfs-shapes',
      file: 'bfs-vs-dfs-shapes.svg',
      lessonId: 'javascript-common-data-structures-and-algorithms',
      sectionIndex: 2,
      zhTitle: 'BFS 与 DFS：容器决定搜索形状',
      alt: '两列对比图。左列「BFS 广度优先 · 用队列」：先进先出——先发现的先处理；一层扫完再下一层；第一次到达目标的层数就是最少步数。右列「DFS 深度优先 · 用栈」：后进先出——最后发现的先处理；一条路走到底、走不通再回头；必须记录已访问顶点——图有环时会陷入无尽循环。图下说明：官方点名——队列与栈的原理分别是广度优先搜索与深度优先搜索使用的概念；骑士之旅项目官方说两者都可行，但其中一个需要你处理「陷入无尽循环」的可能性；目标是「最短路径」时，先想清楚哪种搜索的层数即步数。',
      caption: '换容器就换算法：队列的 FIFO 长成一层层的 BFS，栈的 LIFO 长成一条路的 DFS。',
      points: [
        'BFS 配队列：层数即步数——最短路径类问题的首选直觉。',
        'DFS 配栈：一条路到底再回头——注意环与已访问记录。',
        '两种搜索的差别不在聪明程度，在容器的出队秩序。'
      ]
    },
    /* ---------- World 3 批次 4 阶段 4（2026-09-27，v4.11.26，通宵轮）：「Git 进阶」3 课
     * 各 1 张（生成器产出；判据与逐课决策记录住 tools/build-diagrams.mjs 同批注释）。
     * battleship（Project 课）与 conclusion（结语信无结构可画）不配。 ---------- */
    {
      id: 'git-reset-three-levels',
      file: 'git-reset-three-levels.svg',
      lessonId: 'javascript-a-deeper-look-at-git',
      sectionIndex: 2,
      zhTitle: 'reset 三档：每深一档多动一层',
      alt: '三步流程图。第一步「--soft」：只移 HEAD——改动全部留在暂存区，官方类比「更强大的 amend」：回退多个提交、把改动合成一个新提交。第二步「默认档」：再重置暂存区——改动退回工作目录未暂存状态，文件内容还在；拆分提交的手法就靠它。第三步「--hard」：再覆盖工作目录——三层全动，未提交的改动直接冲掉，属可能毁数据的破坏性命令。图下说明：reset 的完整流程是三步——移 HEAD、用新指向更新暂存区、覆盖工作目录；标志位决定做到第几步停。--hard 之前必须确切知道为什么用它，团队共享仓库里还要让同事知情。',
      caption: 'reset 是同一条三步流水线：--soft 停在第一步、默认档停在第二步、--hard 走完全程——走得越深，毁得越多。',
      points: [
        '--soft 只移 HEAD：改动留在暂存区——「更强大的 amend」。',
        '默认档多重置暂存区：改动退回未暂存——拆分提交的原理。',
        '--hard 连工作目录一起覆盖：破坏性命令，用前必须知道为什么。'
      ]
    },
    {
      id: 'revert-vs-reset-force',
      file: 'revert-vs-reset-force.svg',
      lessonId: 'javascript-working-with-remotes',
      sectionIndex: 2,
      zhTitle: '撤销已推送的提交：两条路的分界',
      alt: '两列对比图。左列「revert：只增不改（官方正解）」：生成反转原提交改动的新提交；历史只增不改、旧提交全部还在；正常 push 即可——对协作者零风险；git revert HEAD 后照常推送。右列「reset + force：改写 + 覆写（军规禁区）」：reset 改写本地历史；force 用改写后的历史覆写远端；别人基于旧提交的工作直接断链——官方灾难实验里第四个文件本地远端双双消失；军规：reset 绝不用于已推送的提交；确需强推（更新 PR、清敏感信息）优先 --force-with-lease。图下说明：分界线只有一条——历史发布了吗？发布了就用 revert（只增不改），没发布才轮到 reset；--force-with-lease 是带保险丝的强推：目标分支被别人更新过就报错拒绝，先 fetch 再决定。',
      caption: '已发布的历史用 revert 修正——只增不改；force push 用你的历史覆写远端，覆掉的可能正是同事的工作。',
      points: [
        'revert 生成反向新提交：历史只增不改，可安全推送。',
        'reset + force 改写并覆写历史：协作中的军规禁区。',
        '确需强推时用 --force-with-lease：远端被别人动过就拒绝——带保险丝。'
      ]
    },
    {
      id: 'git-oss-workflow',
      file: 'git-oss-workflow.svg',
      lessonId: 'javascript-using-git-in-the-real-world',
      sectionIndex: 2,
      zhTitle: '开源贡献工作流：三角关系的完整环路',
      alt: '五步流程图。第一步「Upstream 原仓库」：你没有写权限——local 只能从它 fetch、不能 push。第二步「本地 main」：git fetch upstream 加 merge upstream/main 保持同步基线。第三步「功能分支」：开发在功能分支；发 PR 前先把 main 合进这条脏分支、在自己这边消化冲突。第四步「你的 fork（origin）」：git push origin 功能分支推回自己的副本。第五步「Pull Request」：GitHub 界面向 upstream 的 main 发 PR；维护者评审合并——环路回到起点。图下说明：本站图按官方正文 mermaid 工作流图同一结构绘制（Upstream → fetch → Local main → checkout 功能分支 → push origin → Fork → Create PR → 维护者 Merge → 回 Upstream）。官方红线：没有被指派的 issue 就停在 push 这一步——测试或练习性质的 PR 会被视为 spam、不经评审直接关闭。',
      caption: 'upstream 只拉不推、origin 是你的出口、PR 是唯一入口——冲突永远先在自己这边消化。',
      points: [
        '三角关系：local 从 upstream 只能 fetch，推送只到自己的 fork。',
        '发 PR 前先把 main 合进功能分支——脏分支先消化冲突，PR 合并才干净。',
        '没有被指派的 issue 不开 PR——官方红线：练习 PR 会被当 spam 关闭。'
      ]
    },
    /* ---------- World 4 批次 5 阶段 1（2026-09-27，v4.11.27）：「动画」3 课配 2 张 ---------- */
    {
      id: 'transforms-chain-order',
      file: 'transforms-chain-order.svg',
      lessonId: 'node-path-advanced-html-and-css-transforms',
      sectionIndex: 3,
      zhTitle: '链式变换：顺序即语义',
      alt: '两列对比图。左列「先转后移：rotate(45deg) translate(200%)」（红盒）：第一步旋转 45 度——元素自己的 X 轴与 Y 轴跟着一起斜掉；第二步沿已经斜掉的 X 轴平移 200%——盒子斜着滑出去，落在右下方。右列「先移后转：translate(200%) rotate(45deg)」（蓝盒）：第一步沿原始 X 轴平移 200%——水平走到正右方；第二步原地旋转 45 度——盒子在新位置自转。两个盒子起点相同、函数组合相同，只是顺序不同，终点就完全不同。图下说明：链式变换从左到右依次生效——后一个函数作用在「前一个变换之后」的坐标系上，就像流水线上每道工序都接手上一道改过的工件。顺序的唯一例外是 perspective：与多个函数同写时必须放最前（最左），否则三维效果不成立。',
      caption: '同一组函数换个顺序，盒子就去了完全不同的地方——链式变换不满足交换律。',
      points: [
        '从左到右依次生效：后一个函数作用在前一个变换后的坐标系上。',
        '先转后移沿斜轴跑到右下；先移后转直走再原地自转。',
        '顺序唯一例外：perspective 必须写在最前面。'
      ]
    },
    {
      id: 'keyframes-timeline',
      file: 'keyframes-timeline.svg',
      lessonId: 'node-path-advanced-html-and-css-keyframes',
      sectionIndex: 3,
      zhTitle: '@keyframes 时间轴：一个周期长什么样',
      alt: '三步流程图。第一步「from / 0%」：起点帧——官方例子里是 background-color red；from 是 0% 的别名，duration 为 2 秒时读作第 0 秒。第二步「50%」：中间帧只能用百分比——例子里在中点同时改颜色为 blue 并 scale(2) 放大一倍。第三步「to / 100%」：终点帧——background-color green；to 是 100% 的别名，读作第 2 秒。三步合起来是 @keyframes 规则定义的「一个动画周期」。图下说明：iteration-count 数的是单向周期——count 为 2 且 direction 为 alternate 时，效果是红到绿、再绿到红，然后停；不写 alternate 则每个周期结束跳回起点重播。别把一次 iteration 当成一个来回的完整循环，这是官方专门设防的误区。',
      caption: '一次 iteration 是「从头到尾的单向周期」，不是一个来回——alternate 时下一周期反向跑。',
      points: [
        'from / to 是 0% / 100% 的别名；中间帧只能写百分比。',
        '@keyframes 定义一个周期；iteration-count 数单向周期数。',
        'alternate 让周期结束平滑折返；normal 跳回起点重播。'
      ]
    },
    /* ===== World 4 批次 5 阶段 2（v4.11.28）：「无障碍」章节 3 张（判据决策整段
     * 记录在 tools/build-diagrams.mjs 批次 5 阶段 2 注释——8 课中 5 课按判据不配）。
     * 图型只用既有 compare / map，零图型库扩展。 ===== */
    {
      id: 'contrast-thresholds',
      file: 'contrast-thresholds.svg',
      lessonId: 'node-path-advanced-html-and-css-accessible-colors',
      sectionIndex: 1,
      zhTitle: '对比度阈值：AA 与 AAA 两档并排',
      alt: '两列对比图。左列「AA 级（最低要求）· 行业默认目标」：正常文本对比度至少 4.5 比 1；大号文本至少 3 比 1；大号文本的界线是字号至少 18pt/24px，粗体至少 14pt/18.66px。右列「AAA 级（增强）· 不建议全站追求」：正常文本至少 7 比 1；大号文本至少 4.5 比 1；三类例外在两级下同样豁免——偶然性文本（图片里恰好出现的字或纯装饰文字）、禁用组件里的文本、logo 与品牌名。图下说明：对比度是两色亮度差的比值，从白底白字的 1 比 1 到白底黑字的 21 比 1；数字不用背，WebAIM Contrast Checker 或 Chrome DevTools 替你算。',
      caption: 'AA 是行业验收线（4.5:1 / 3:1），AAA 是增强档（7:1 / 4.5:1）——记串档位是最常见的错误。',
      points: [
        'AA：正常文本 ≥ 4.5:1、大号文本 ≥ 3:1——行业默认目标。',
        'AAA：正常文本 ≥ 7:1、大号文本 ≥ 4.5:1——不建议全站追求。',
        '大号界线 18pt/24px（粗体 14pt/18.66px）；偶然性文本 / 禁用组件 / logo 三类例外两级同免。'
      ]
    },
    {
      id: 'hidden-content-paths',
      file: 'hidden-content-paths.svg',
      lessonId: 'node-path-advanced-html-and-css-keyboard-navigation',
      sectionIndex: 3,
      zhTitle: '隐藏内容的两种方案：部分修复与正解',
      alt: '两列对比图。左列「子项逐个 tabindex=-1 · 部分修复」：键盘焦点维度——子项被移出 Tab 序列，打勾；辅助技术维度——其他辅助技术仍能访问并播报这些看不见的内容，打叉；代价是每个子项都要加、新增子项容易漏。右列「容器 display:none 或 visibility:hidden · 正解」：键盘焦点维度——整个容器连同子项移出 Tab 序列，打勾；辅助技术维度——同样不再播报，打勾；需要显示时移除或覆盖该属性即可。图下说明：菜单与模态框未展开时，内容要对键盘与辅助技术同时隐藏——只藏一边就会出现「焦点消失在看不见的元素里」的事故。',
      caption: 'tabindex=-1 只挡住键盘；display:none / visibility:hidden 一次挡住两个世界。',
      points: [
        'tabindex=-1：移出 Tab 序列，但辅助技术仍能读到——部分修复。',
        'display:none / visibility:hidden：键盘与播报同时隐藏——正解。',
        '显示时机到了就移除或覆盖该属性；别用「移出屏幕」当隐藏。'
      ]
    },
    {
      id: 'aria-attributes-map',
      file: 'aria-attributes-map.svg',
      lessonId: 'node-path-advanced-html-and-css-wai-aria',
      sectionIndex: 4,
      zhTitle: '四个 aria-* 属性各改无障碍树的哪里',
      alt: '中心辐射图。中心是「无障碍树」，副题注明 ARIA 只改这棵树——外观、行为、可聚焦、键盘事件都改不了。四个卫星节点：aria-label——改「名称」属性，字符串覆盖原生标签，对 div/span 等无角色元素无效，别当注音用；aria-labelledby——也改「名称」，优先级最高，拼接多个 id 引用、可自引用，引用目标可以视觉隐藏；aria-describedby——改「描述」属性，在名称之外追加播报补充说明（如密码格式要求）；aria-hidden 为 true——把整个节点移出树，视觉保留，子元素连坐且 false 救不回，可聚焦元素禁用。',
      caption: 'ARIA 的世界只有这棵树：labelledby 与 label 改名称、describedby 加描述、hidden 删节点。',
      points: [
        '优先级：aria-labelledby > aria-label > 原生标签。',
        'describedby 改的是「描述」不是「名称」——播报时机在名称之后。',
        'aria-hidden 子元素连坐、可聚焦元素禁用（ARIA 五规则第④条）。'
      ]
    },
    /* ===== World 4 批次 5 阶段 3（v4.11.29，World 4 收组）：「响应式设计」章节 1 张
     * （判据决策整段记录在 tools/build-diagrams.mjs 批次 5 阶段 3 注释——5 课中
     * 4 课按判据不配）。图型只用既有 compare，零图型库扩展。 ===== */
    {
      id: 'image-fit-two-families',
      file: 'image-fit-two-families.svg',
      lessonId: 'node-path-advanced-html-and-css-responsive-images',
      sectionIndex: 2,
      zhTitle: '图片适配两族工具：背景图一族与 img 一族',
      alt: '两列对比图。左列「背景图一族 · background-size 与 background-position」：写在容器上，只认 CSS 背景图，对 img 标签无效；background-size 的 cover 让图铺满容器且裁剪最少；background-position 的 center 让图永远居中，容器装不下整图时露出中间。右列「img 一族 · object-fit 与 object-position」：写在图片元素上，专为 img 等替换元素设计；默认值 fill 把图拉伸到填满尺寸，比例失真，是多数图变形事故的根源；cover 填满裁边、contain 完整留边，与左族语义相通；object-position 调整裁剪时保留哪部分。图下说明：两族共享 cover 与 contain 的语义，选择依据只有一个——图是 background-image 放进来的还是 img 标签放进来的；另外弹性宽加 height auto 是保比例的底线写法，先于两族工具。',
      caption: 'cover 与 contain 两族通用；先看图是背景还是 img 标签，再选对属性——默认 fill 会拉伸。',
      points: [
        '背景图一族写在容器上：background-size 管多大、background-position 管摆哪。',
        'img 一族写在图片上：object-fit 默认 fill 拉伸变形，固定框务必显式声明 cover 或 contain。',
        '底线写法先于两族：弹性宽 + height: auto，比例自动保住。'
      ]
    },
    /* ===== World 5 批次 6 阶段 1（v4.11.30，World 5 开篇）：react 课程「引言」+「React 入门」
     * 两章 8 课配 2 张（判据决策整段记录在 tools/build-diagrams.mjs 批次 6 阶段 1
     * 注释——8 课中 6 课按判据不配）。图型只用既有 map 与 flow，零图型库扩展。 ===== */
    {
      id: 'conditional-rendering-toolbox',
      file: 'conditional-rendering-toolbox.svg',
      lessonId: 'node-path-react-new-rendering-techniques',
      sectionIndex: 3,
      zhTitle: '条件渲染工具箱：三元、逻辑与、if 守卫',
      alt: '中心辐射图。中心是「条件渲染工具箱」，副题注明先数分支再挑工具，挑什么都是 JSX 大括号里的 JavaScript 表达式。四个卫星节点：三元运算符——二选一场景，条件成立渲染 A 否则渲染 B，什么都不渲染的分支写 null；&& 运算符——满足才渲染场景，条件为假时渲染空，坑是左边别放数字，0 会被渲染到页面上；if 守卫提前返回——多分支与边界先行场景，先接住数据未到位的 Loading 与空列表提示，两关都过再渲染主列表；嵌套组合——嵌套三元与多段 && 连用逻辑上等价但看着吓人，分支多时优先守卫写法。',
      caption: '先数分支再挑工具：二选一用三元、满足才渲染用 &&（左边别放数字）、多分支用 if 守卫提前返回。',
      points: [
        '三元的「不渲染」分支写 null——false 与 null 在 JSX 里都渲染为空。',
        '&& 左边放数字是官方专门设防的坑：0 是假值但会被渲染出来，改成 length > 0 &&。',
        '守卫式 if 提前返回是 API 场景标配：Loading 与空态先接住，主逻辑平铺不嵌套。'
      ]
    },
    {
      id: 'keys-matching-flow',
      file: 'keys-matching-flow.svg',
      lessonId: 'node-path-react-new-keys-in-react',
      sectionIndex: 1,
      zhTitle: '一次重渲染里，key 是怎么配对的',
      alt: '流程图，六步。第一步状态或数据变化，触发重渲染；第二步重建虚拟 DOM，组件函数再跑一遍，map 又生成一批元素；第三步新旧对比，React 用 key 把旧列表项与新列表项逐项配对；第四步分叉之一，key 没变的项被认成同一实例，状态延续，只做最小更新；第五步分叉之二，key 变了的项被认成全新实例，带全新状态重建，故意换 key 就是利用这一步做强制重置；第六步把真正变化的部分写进真实 DOM，其余不动。图下注：动态列表的 key 必须唯一且稳定——从数据本身推出（如每项的 id），不在渲染时现场生成，会变的列表慎用数组下标。',
      caption: 'key 是跨渲染认人的 ID：没变保实例保状态，变了就整个重建——列表更新只动真正变化的项。',
      points: [
        '硬编码列表 React 自动管 key；map 出来的动态列表数量与顺序都会变，必须手动给。',
        'key 从数据推出（造数据时发的 id）——渲染时现场生成等于每次全体重建。',
        '故意换 key = 强制重开实例（游戏重置一行搞定），这是 key 的第二用途。'
      ]
    },
    /* World 5 批次 6 阶段 2（2026-09-28，v4.11.31）新增 2 张：
     * - how-to-deal-with-side-effects **配 1 张**（useeffect-forms-selector，map，
     *   sectionIndex 2）：依赖数组三形态的选择规则是**看不见的决策知识**（判据①），
     *   每次写 effect 都要选形态（判据②），全站无同型图（判据③），本章是 World 5
     *   前段机制最密的课（判据⑤）；一图覆盖 §2 依赖数组与 cleanup 全节。
     * - component-lifecycle-methods **配 1 张**（lifecycle-useeffect-mapping，compare
     *   columns，sectionIndex 3）：类方法与 useEffect 的四行对应关系是纯映射知识、
     *   文字表格读不出「同一件事两种写法」的结构（判据①），维护遗留代码时反复查
     *   （判据②），全站无生命周期对照图（判据③），收束两课的双世界观（判据⑤）。
     * 五课按判据不配：introduction-to-state（rerender 机制已被 keys-matching-flow
     *   覆盖 + 官方配图在位 + useState 模式代码已并排）、more-on-state（BAD/GOOD 与
     *   快照时间线代码已并排——jsx 课同型）、cv-application 与 memory-card（Project
     *   课按 recipes 先例零配图）、class-based-components（函数版与类版官方代码已
     *   全程并排对照——passing-data「代码已并排」同型）。 */
    {
      id: 'useeffect-forms-selector',
      file: 'useeffect-forms-selector.svg',
      lessonId: 'node-path-react-new-how-to-deal-with-side-effects',
      sectionIndex: 2,
      zhTitle: 'useEffect 三形态：依赖数组定时机，返回值定退场',
      alt: '中心辐射图。中心是 useEffect 三形态选型，副题注明依赖数组决定何时执行、回调返回的清理函数决定如何退场。四个卫星节点：无依赖数组——每次渲染后都执行，Clock 第 2 车的原因，绝大多数场景是误用信号；空数组——只在挂载时执行一次，一次性初始化与取数据的家，配 cleanup 在卸载时退场；列出依赖 a 与 b——挂载时加 a 或 b 变化时执行，跟随某个值同步外部系统的标准形态；返回清理函数——不是第四种数组形态而是叠加项，下次 effect 重跑前与组件卸载时执行，定时器、订阅、监听器的退场通道。图下注：先问有没有外部系统要同步，再选形态；依赖不用手搓，linter 报什么修什么。',
      caption: '先问「有外部系统要同步吗」，再按依赖数组选时机：[] 只挂载、[a,b] 跟随变化、无数组每次渲染（警惕）；返回函数管退场。',
      points: [
        '空数组 = 挂载跑一次：取数据、建定时器的标准形态——Clock 的终点。',
        '列出依赖 = 跟随值变化重新同步；依赖清单交给 linter 管，报了就修不要压。',
        'cleanup 不是可选装饰：建了资源就要给退场通道，StrictMode 双挂载会立刻检验你。'
      ]
    },
    {
      id: 'lifecycle-useeffect-mapping',
      file: 'lifecycle-useeffect-mapping.svg',
      lessonId: 'node-path-react-new-component-lifecycle-methods',
      sectionIndex: 3,
      zhTitle: '类生命周期方法与 useEffect 对照词典',
      alt: '左右两列对照图。左列是类组件生命周期方法：render 方法，唯一必需，挂载与更新都跑，必须纯；componentDidMount，挂载进 DOM 后执行，取数据的家；componentDidUpdate，每次重渲染后执行，内部更新状态必须加 prevProps 条件防无限循环；componentWillUnmount，卸载销毁前执行，取消请求与清定时器的家。右列是 useEffect 的对应形态：执行体在每次渲染后跑，由依赖数组收敛时机；空依赖数组，只在挂载时执行，等价于 componentDidMount；带依赖数组，挂载加依赖变化时执行，等价于 didMount 与带条件的 didUpdate 组合；回调返回的清理函数，重跑前与卸载时执行，等价于 componentWillUnmount。图下注：同一件事两种写法——读旧代码用类方法名思考，写新代码用 effect 形态实现。',
      caption: 'useEffect 是三合一：[] 对应 didMount、返回函数对应 willUnmount、依赖数组对应带条件的 didUpdate——这张表是读旧写新的翻译词典。',
      points: [
        'render 必须纯：不改状态、同输入同输出、不碰浏览器——effect 与事件都不住这里。',
        'didUpdate 里 setState 必须加 prevProps 条件，否则无限循环——effect 里同型错误是 set 了自己依赖的状态。',
        'willUnmount 的清理职责在 effect 里由返回的 cleanup 函数承接——建了什么就要清什么。'
      ]
    },
    /* World 5 批次 6 阶段 3（2026-09-28，v4.11.32，World 5 收组）新增 3 张：
     * - introduction-to-react-testing **配 1 张**（testing-query-families，compare
     *   columns，sectionIndex 2）：查询「前缀 × ByX」是二维矩阵知识——正文文字读不出
     *   两个维度各管什么（判据①），写每条测试都要选（判据②），全站无同型图（判据③），
     *   本章是测试课决策密度最高处（判据⑤）。
     * - react-router **配 1 张**（router-nested-outlet，flow 5 步，sectionIndex 2）：
     *   URL 到组件的匹配与 Outlet 替换链条是**跨层不可见机制**（判据①），嵌套路由
     *   每次调试都在走这条链（判据②），全站无路由匹配图（判据③）。
     * - refs-and-memoization **配 1 张**（memoization-toolbox，map，sectionIndex 4）：
     *   useMemo / useCallback / memo / Compiler 四工具选型是看不见的决策矩阵
     *   （判据①），官方明说是面试题与日常选型（判据②），与 useeffect-forms-selector
     *   同为选型 map 先例同型（判据③⑤）。
     * 七课按判据不配：mocking-callbacks-and-components（AAA 三段文字已足 + 官方测试
     *   代码已并排——复述型）、fetching-data-in-react（瀑布时序官方指定 react-examples
     *   交互演示实测 + 文字链条已足）、styling-react-applications（四族方案清单文字
     *   已足——media-queries 贴士清单同型）、shopping-cart（Project 课按任务型口径
     *   不配；且本站不提供成品代码，画状态层级图会变相给出设计答案——
     *   admin-dashboard 同由）、managing-state-with-the-context-api（prop drilling 与
     *   Context 前后官方代码已全程并排——passing-data「代码已并排」同型）、
     *   reducing-state（dispatch→reducer→新状态一句话链条 + 官方代码已并排——
     *   transitions 一段结论同型）、react 版 conclusion（祝贺信无结构可画——
     *   javascript conclusion 先例同型）。 */
    {
      id: 'testing-query-families',
      file: 'testing-query-families.svg',
      lessonId: 'node-path-react-new-introduction-to-react-testing',
      sectionIndex: 2,
      zhTitle: 'RTL 查询两个维度：前缀定行为，ByX 定抓手',
      alt: '左右两列对照图。左列是前缀三家族（找不到元素时的行为）：getBy，找不到立即抛错——找「应该在」的元素用它；queryBy，找不到返回 null 不抛错——断言「不该在」的元素只能用它；findBy，返回 Promise 异步等待元素出现——等延迟渲染的内容。右列是 ByX 抓手（按什么找元素，官方优先级从高到低）：ByRole 首选，按 ARIA 角色配 name 选项，天然校验可访问性；ByLabelText 与 ByPlaceholderText，表单元素专用；ByText 按可见文本；ByAltText 与 ByTitle，图片与提示文本；ByTestId 垫底，前几种都不可用时的逃生舱。图下注：一次查询等于前缀乘 ByX 的组合，如 getByRole、findByText——先想用户怎么感知元素选 ByX，再想元素该不该在选前缀。',
      caption: '查询方法 = 前缀 × ByX 两维组合：前缀管「找不到怎么办」（抛错 / null / 等待），ByX 管「按什么找」（ByRole 首选、ByTestId 垫底）。',
      points: [
        '断言元素不存在只能用 queryBy——getBy 找不到会先抛错、断言轮不上。',
        'ByRole 配 name 选项是官方首选：贴近用户感知、顺带校验可访问性。',
        'findBy 是异步的——要 await；延迟出现的元素（取数后渲染）归它管。'
      ]
    },
    {
      id: 'router-nested-outlet',
      file: 'router-nested-outlet.svg',
      lessonId: 'node-path-react-new-react-router',
      sectionIndex: 2,
      zhTitle: '一次嵌套路由访问：URL 怎么变成两层组件',
      alt: '流程图，五步。第一步浏览器地址是 /profile/popeye，Link 点击或手输都算；第二步 router 拿 URL 逐段匹配路由树，path profile 命中父路由、children 里的 popeye 命中子路由；第三步先渲染父组件 Profile，页面骨架与导航就位；第四步父组件模板里的 Outlet 位置被替换成子组件 Popeye——index 路由则是 /profile 不带子段时渲染默认组件；第五步任何一段没匹配上，渲染挂在路由上的 errorElement 错误页兜底。图下注：嵌套路由等于父模板加 Outlet 洞加 children 填充物；动态段 :name 把「匹配」变成「取值」，useParams 读出。',
      caption: 'URL 逐段匹配路由树：父路由渲染骨架、子组件填进 Outlet 的洞——index 管默认、errorElement 管兜底。',
      points: [
        'Outlet 是父组件模板里的「洞」——子路径命中时被替换成对应子组件。',
        '{ index: true } 子路由 = 父路径不带子段时的默认填充物。',
        '动态段 :name 匹配任意值——useParams() 把匹配结果变成数据。'
      ]
    },
    {
      id: 'memoization-toolbox',
      file: 'memoization-toolbox.svg',
      lessonId: 'node-path-react-new-refs-and-memoization',
      sectionIndex: 4,
      zhTitle: 'React 缓存工具箱：四件工具各管一段',
      alt: '中心辐射图。中心是 React 缓存工具箱，副题注明先用 Profiler 测量再动手，过早优化是万恶之源。四个卫星节点：useMemo，缓存任何值——昂贵计算只在依赖变化时重算；useCallback，只缓存函数——等价于 useMemo 返回函数的简写，配 memo 子组件防引用变化；memo，包裹组件——props 引用相等时跳过重渲染，父渲染不连带；React Compiler，构建期自动记忆化——多数场景不再手写，但手动知识仍必修。图下注：值用 useMemo、函数用 useCallback、组件用 memo、自动交给 Compiler——先测量，确实需要才出手。',
      caption: '四件工具分工：useMemo 管值、useCallback 管函数、memo 管组件跳过重渲染、Compiler 管自动——前提都是 Profiler 先测量。',
      points: [
        'memo 子组件必须配缓存过的 props（useCallback/useMemo）——裸函数引用每次都是新的，memo 白包。',
        'useCallback(fn, deps) 就是 useMemo(() => fn, deps)——区别只在缓存值的类型。',
        '官方警语：过早优化是万恶之源——Profiler 测出真瓶颈再动手。'
      ]
    },
    /* 超长轮批次 7 阶段 1（2026-09-28，v4.11.33，World 6 收组）新增 1 张：
     * - databases-and-sql **配 1 张**（sql-join-four-flavors，map，sectionIndex 4）：
     *   四种 JOIN「各保留哪些行」是二维并列决策——线性文字读不出矩阵关系（判据①），
     *   写每条多表查询都要选 JOIN 类型（判据②），map 选型图有 memoization-toolbox /
     *   useeffect-forms-selector 先例但 JOIN 主题全站无（判据③），本章是 World 6 知识
     *   主体、SQL 决策密度最高处（判据⑤）。角度是「保留哪些行」决策卡片、非韦恩图，
     *   与官方推荐的 codinghorror 韦恩图互补不复述。
     * 另两课按判据不配：node-path-databases（导论课，动机定调无结构可画——
     *   introduction 类先例同型）、node-path-databases-sql-zoo（Project 课按任务型
     *   口径不配，且本站不提供成品答案、画查询分解图会变相给答案——admin-dashboard 同由）。 */
    {
      id: 'sql-join-four-flavors',
      file: 'sql-join-four-flavors.svg',
      lessonId: 'node-path-databases-databases-and-sql',
      sectionIndex: 4,
      zhTitle: '四种 JOIN：各保留哪些行',
      alt: '中心辐射图。中心是「JOIN 四种取舍」，副题注明左表等于 FROM 里那张、ON 给拉链列。四个卫星节点：INNER JOIN，只保留两表匹配上的行——95% 场景，没匹配的两侧都丢；LEFT OUTER JOIN，左表全保留、右表匹配的加进来、右表没对上的格子填 NULL；RIGHT OUTER JOIN，右表全保留、左表匹配的加进来、左表没对上的格子填 NULL；FULL OUTER JOIN，两表所有行全保留、任何对不上的格子都填 NULL。图下注：选哪种 JOIN 本质是问「要不要保留没匹配上的行」——要保左表用 LEFT、要保右表用 RIGHT、都保用 FULL、只要匹配的用 INNER。',
      caption: '选 JOIN = 问「要不要留没匹配上的行」：INNER 只留匹配、LEFT 保左表、RIGHT 保右表、FULL 全保——缺失侧填 NULL。',
      points: [
        'INNER JOIN 是 95% 场景：没匹配上的行两侧都丢——只要「两边都有」的数据。',
        'OUTER JOIN 保留某一侧全部行、对不上的格子填 NULL——LEFT 保左表（FROM 那张）、RIGHT 保右表。',
        '「左表」永远是 FROM 子句里那张原表——判断 LEFT / RIGHT 先认清楚谁在 FROM。'
      ]
    },
    /* ---------- 超长轮批次 7 阶段 2（2026-09-28，v4.11.34，NodeJS 入门 6 课 + Express 11 课开放） ----------
     * 17 课逐课过判据五条，配 5 张、不配 12 课。
     * 配 5 张：
     * - intro-express **express-request-journey**（flow，§3）：请求穿过中间件链到响应的
     *   旅程是 Express 全课程的心智模型底座（判据①看不见的流程、②routes/controllers/
     *   forms 课反复回看、③全站无请求生命周期图——「fetch 的两层 Promise」画的是浏览器侧、
     *   本图画服务器侧、⑤本批最重机制），画在首现课。
     * - controllers **mvc-middleman**（map，§0）：「终极中间人」是 MVC 的空间结构（判据①），
     *   后续图书馆/库存/留言板项目全部按 MVC 组织文件夹（判据②），全站无 MVC 分工图
     *   （判据③——「开源贡献工作流」三角图是 git 主题），本课 10 章 23KB 为本批最重知识课（判据⑤）。
     * - deployment **static-vs-dynamic-hosting**（compare，§1）：静态/动态托管分界是每次
     *   部署选型都要过的判断（判据②⑤），两列对比正是 compare 图型本义（判据①），全站无
     *   部署主题图（判据③——CV 项目部署任务接的是平台文档链接、非概念图）。
     * - forms **prg-pattern**（flow，§1）：POST→重定向→GET 三步链是防重复提交的正确性
     *   设计（判据①流程、②之后每个写表单的项目都用、③全站无 PRG 图、⑤留言板项目刚手写
     *   过 redirect、此图给动作装上理论名字）。
     * - using-pg **parameterized-query**（compare，§4）：拼接 vs 参数化是「数据与指令分家」
     *   的安全心智模型（判据①②⑤），与 forms 课「输出处转义」同族但机制不同不复述
     *   （判据③），sike 删表演示文字震撼但两列机制对比线性文字读不出（判据①）。
     * 不配 12 课理由：back-end（前后端分工已有 frontend-backend-fullstack 图——判据③；
     *   酒馆比喻文字已说清——判据④）；what-is-nodejs（官方定义三块拼图正文分点已够清楚——
     *   判据①；事件驱动与 World 3「回调地狱与 Promise 链」同族且正文充分——判据③）；
     *   getting-started（五站式阅读路线是一次性操作清单——判据②）；debugging-node
     *   （1170B 短课、视频+文档导览无结构可画——判据①）；env-vars（三种加载方式是操作
     *   列表、process.env 访问正文已清——判据①②）；frameworks（打包回收比喻文字已说清——
     *   判据④；三章短课无空间结构——判据①）；routes（顺序警告用正文两路由代码例比图更
     *   精确——判据①；动词+路径匹配已含在 express-request-journey——判据③）；views
     *   （res.render 两入一出代码例已示——判据①；View 职责已含在 mvc-middleman——判据③）；
     *   installing-pg（一次性安装操作——判据②）；basic-info-site / mini-message-board /
     *   inventory-application（三门 Project 课按任务型口径不配——recipes / shopping-cart 先例）。 */
    {
      id: 'express-request-journey',
      file: 'express-request-journey.svg',
      lessonId: 'node-path-nodejs-introduction-to-express',
      sectionIndex: 3,
      zhTitle: '一个请求在 Express 里的旅程',
      alt: '流程图，六步折两行。第一步浏览器发 GET / 请求；第二步 Express 把请求包进 request 对象；第三步请求穿过中间件函数链；第四步第一个动词与路径都匹配的路由接手；第五步 req 与 res 作为第一、二参数传进回调；第六步 res.send 发出响应、请求-响应循环结束。图下注：路由顺序很重要——Express 把请求交给第一个匹配动词与路径的路由，后面的同形路由永远轮不到。',
      caption: '请求进 Express 后不是直达你的回调：它先被包进 req 对象、穿过中间件链，由第一个「动词 + 路径」都匹配的路由接手，直到某个函数用 res 结束循环。',
      points: [
        'Express 把每个请求包进 request 对象（req）、给你一个 response 对象（res）——回调的前两个参数。',
        '中间件链是请求的必经之路：链上任何一环都可以处理请求或放行给下一环。',
        '匹配规则是「动词 + 路径」双重检查、按定义顺序取第一个命中——所以 /user/new 必须写在 /user/:id 前面。'
      ]
    },
    {
      id: 'mvc-middleman',
      file: 'mvc-middleman.svg',
      lessonId: 'nodejs-controllers',
      sectionIndex: 0,
      zhTitle: 'MVC：控制器是终极中间人',
      alt: '中心辐射图。中心是控制器（Controller），副题「终极中间人：知道该做什么，把难活全委派出去」。四个卫星节点：模型（Model），数据住在这里——控制器知道问它什么，数据库操作的重活它自己干；视图（View），HTML 在这里拼——控制器决定渲染哪个视图，页面细节视图自己管；路由（Route），请求的入口——动词加路径匹配后把请求交给对应控制器函数；响应（Response），控制器拿着渲染结果经 res 发回浏览器、结束请求循环。图下注：控制器是整场运作的大脑，但它自己不碰数据库、不拼 HTML——MVC 模式里它只是一个职责明确的函数。',
      caption: '控制器的聪明在于「不亲自干活」：向模型要数据、让视图拼 HTML、经路由迎来请求、用响应送走结果——四件事都委派，它只做调度。',
      points: [
        'Model 管数据与业务重活（数据库查询住这里），View 管拼 HTML，Controller 只管「该做什么」。',
        '控制器说到底只是 MVC 模式里一个职责明确的函数——不是类、不是框架魔法。',
        '之后每个项目文件夹的 routes/ controllers/ models/ views/ 四分，就是这张图落进目录结构。'
      ]
    },
    {
      id: 'static-vs-dynamic-hosting',
      file: 'static-vs-dynamic-hosting.svg',
      lessonId: 'node-path-nodejs-deployment',
      sectionIndex: 1,
      zhTitle: '静态托管 vs 动态托管：发文件还是跑程序',
      alt: '两列对比图。左列静态网站：预先写好的 HTML 页面；每个访问者看到相同内容；只需要 HTML、CSS、JavaScript；GitHub Pages、Netlify、Vercel 就能托管。右列动态网站：内容随访问用户变化——X 的首页时间线因人而异；额外需要服务端应用与数据库；Pages、Netlify、Vercel 跑不了 Node 服务器、没有数据库服务；要用 PaaS（Railway、Render）或云厂商（AWS、Google Cloud、Azure）。图下注：托管选型只问一个问题——网站需不需要「跑程序」？发文件就够的走静态托管，要跑 Node 加数据库的走 PaaS。',
      caption: 'Pages / Netlify / Vercel 不是不好——它们只会「发文件」，而 Node 应用需要托管商「跑程序 + 供数据库」，这正是 PaaS 的活。',
      points: [
        '静态 = 每个访问者看到相同内容；动态 = 内容随用户变化（额外需要服务端应用与数据库）。',
        'GitHub Pages / Netlify / Vercel 跑不了 Node.js、没有数据库服务——React 课部署经验到这里换赛道。',
        '动态站的免费层现实：PaaS（Railway / Render / Neon / Aiven）对新手友好，大云厂商（AWS / GCP / Azure）复杂得多。'
      ]
    },
    {
      id: 'prg-pattern',
      file: 'prg-pattern.svg',
      lessonId: 'nodejs-forms-and-data-handling',
      sectionIndex: 1,
      zhTitle: 'PRG 模式：POST 之后必须重定向',
      alt: '流程图，五步折两行。第一步用户提交表单——POST /new 带表单数据；第二步控制器接手处理——与数据库沟通、存入新数据；第三步响应一个重定向——303 跳转到 /；第四步浏览器自动改发 GET /；第五步服务器渲染最新视图——新留言出现在首页。图下注：重定向之后再刷新页面，重放的只是无害的 GET——不会重复插入数据；若 POST 后直接渲染响应，刷新就会重复提交表单。',
      caption: 'Post/Redirect/Get 三步链：POST 处理完不直接回页面，而是重定向让浏览器再发一次 GET——刷新永远无害，重复提交从此绝迹。',
      points: [
        '表单 action 指向服务器端点，控制器处理数据后经重定向送回最新视图——这就是 PRG 全程。',
        '不重定向的代价：用户刷新页面 = 重放上一个 POST = 重复下单、重复留言。',
        '留言板项目里 router.post 末尾那句 res.redirect("/") 不是导航便利，是防重复提交的正确性设计。'
      ]
    },
    {
      id: 'parameterized-query',
      file: 'parameterized-query.svg',
      lessonId: 'nodejs-using-postgresql',
      sectionIndex: 4,
      zhTitle: '参数化查询：数据与指令分家',
      alt: '两列对比图。左列字符串拼接（危险写法）：用户输入直接拼进 SQL 字符串；输入混进指令、成为 SQL 的一部分；输入 sike 单引号分号 DROP TABLE usernames 分号双双减号就能把整张表删掉；这就是 SQL 注入。右列参数化查询（pg 的解法）：SQL 结构先定死——VALUES ($1) 占位；用户输入放进数组作为 query 的第二个参数；$1 永远是数据、不可能变成指令；转义与类型处理由 pg 代劳。图下注：与表单课「转义在输出处做」同一总纲——数据与指令的边界必须有人守，参数化就是数据库这一侧的守门人。',
      caption: '拼接把用户输入当指令的一部分，参数化把 SQL 结构先定死、输入永远只是数据——一个占位符 $1 就是数据与指令的国境线。',
      points: [
        '危险写法：VALUES (\'" + username + "\')——输入 sike\'); DROP TABLE usernames; -- 会连表一起删。',
        'pg 解法：VALUES ($1) 加第二参数数组 [username]——SQL 结构在执行前已定死，输入无法改写它。',
        '纪律与 XSS 转义同族：用户输入永远当数据对待，「在使用的上下文里」做防御。'
      ]
    },
    /* ---------- 超长续轮批次 7 阶段 3（2026-09-29，v4.11.35，World 7 后六章 13 课收组） ----------
     * 13 课逐课过判据五条，配 6 张、不配 7 课。
     * 配 6 张（全为知识课）：
     * - authentication-basics **auth-session-chain**（flow，§3）：登录态从比对密码到 req.user
     *   的六步链路是认证章的心智模型底座（判据①看不见的流程、②Members Only/Blog API/
     *   Odin-Book 三个项目反复回看、③全站无 passport 会话链路图、⑤本批最重机制）。
     * - prisma-orm **prisma-three-pillars**（map，§4）：Schema/Client/Migrate 三件套对
     *   raw SQL 三痛点是 ORM 章的空间结构（判据①层级关系、②后续 file-uploader/blog-api/
     *   odin-book 全用 Prisma 建模、③全站无 Prisma 图、⑤三件套是三库文件的分工地图）。
     * - api-basics **monolith-vs-decoupled**（compare，§0）：单体 vs 前后端分离是 API 章
     *   的架构转折（判据①两列对比是 compare 本义、②blog-api 一后端两前端直接落地、
     *   ③全站无分离架构图、⑤分离是 World 7 后半程的架构基线）。
     * - api-security **session-vs-token**（compare，§2）：会话 cookie vs JWT 令牌是认证
     *   载体的核心对比（判据①②blog-api 官方明令用 JWT、③与 auth-session-chain 不重复
     *   ——那图画链路本图画载体对照、⑤选型判断每次做 API 认证都要过）。
     * - testing-routes **supertest-chain**（flow，§2）：建 app→发请求→expect→done 的
     *   测试链是 HTTP 测试的可复用心智模型（判据①流程、②每个带测试的项目都用、
     *   ③全站无 supertest 图、⑤把「HTTP 层怎么测」可视化）。
     * - testing-database **dev-vs-test-db**（compare，§3）：NODE_ENV 切开发库/测试库是
     *   数据库测试的隔离基线（判据①两环境对比、②每个碰库的测试都这么切、③全站无
     *   测试库切换图、⑤「绝不对生产库跑测试」的机制可视化）。
     * 不配 7 课：
     * - 6 门 Project 课（members-only / file-uploader / blog-api / wheres-waldo /
     *   messaging-app / odin-book）——按 Project 课纪律不配图（设计本体即作业，官方
     *   NodeJS Project 课全部不配的先例延续）。
     * - conclusion（结语课）——祝贺信 + 方向指引，无可考知识点、无空间/流程结构，
     *   finishing-up / react-conclusion 结语课不配先例同型。 */
    {
      "id": "auth-session-chain",
      "file": "auth-session-chain.svg",
      "lessonId": "node-path-nodejs-authentication-basics",
      "sectionIndex": 3,
      "zhTitle": "登录态链路：从比对密码到 req.user",
      "alt": "流程图，六步折两行。第一步登录 POST /log-in——passport.authenticate 触发；第二步 LocalStrategy 查库比对——bcrypt.compare 拿明文与库里哈希比；第三步 serializeUser 存 user.id——只把 id 写进会话数据；第四步 connect.sid cookie 下发——express-session 在幕后创建；第五步后续请求带 cookie 回来——passport 匹配到会话；第六步 deserializeUser 按 id 查库——把用户对象挂上 req.user。图下注：三个函数只定义不手动调用——LocalStrategy 管验证、序列化对管存取，登录态住在 cookie，服务器每次按 id 还原用户。",
      "caption": "登录一次、之后每个请求靠 connect.sid cookie 认人：serializeUser 存 id、deserializeUser 按 id 查库挂 req.user——三个函数都只定义、由 passport 幕后调用。",
      "points": [
        "LocalStrategy 用 bcrypt.compare 比对明文与哈希，done 三态报告成败——验证环节。",
        "serializeUser 只把 user.id 存进会话（connect.sid cookie 关联），不存整个对象。",
        "deserializeUser 在后续请求按 id 查库还原用户、挂上 req.user——登录态由此跨请求保持。"
      ]
    },
    {
      "id": "prisma-three-pillars",
      "file": "prisma-three-pillars.svg",
      "lessonId": "nodejs-prisma-orm",
      "sectionIndex": 4,
      "zhTitle": "Prisma 三件套：Schema / Client / Migrate",
      "alt": "概念关系图，中心一个节点 Prisma ORM（schema 是单一事实源），三条辐条连向三个卫星节点。Schema：用 PSL 定义 models 与 relations，住进代码库、被版本控制追踪，治「代码库看不懂表结构」的痛点。Client：npx prisma generate 按 schema 定制生成，prisma.message.create/findMany，治「重复查询代码」的痛点。Migrate：把 schema 变更应用到数据库，migrations 文件夹追踪、变更日志标准化，治「手写迁移易错」的痛点。三件套各对应 raw SQL 的一个痛点。",
      "caption": "Prisma 三件套各治一个 raw SQL 痛点：Schema 让数据结构进代码库、Client 按 schema 生成查询 API、Migrate 把变更标准化为可追踪迁移——schema 是三者的单一事实源。",
      "points": [
        "Schema（PSL）把表与关系写进代码库、进版本控制——不登库也能看懂数据结构。",
        "Client 由 npx prisma generate 按 schema 定制——create/findMany 替代手写 SQL，复杂查询仍留 raw 出口。",
        "Migrate 把 schema 变更变成 migrations 文件夹里的可追踪迁移——职业工作里可能隔天就要跑一次。"
      ]
    },
    {
      "id": "monolith-vs-decoupled",
      "file": "monolith-vs-decoupled.svg",
      "lessonId": "nodejs-api-basics",
      "sectionIndex": 0,
      "zhTitle": "单体 vs 前后端分离：渲染模板还是出 JSON",
      "alt": "两列对比图。左列单体（渲染模板）：一个 Express 应用包办一切；路由 render EJS 模板回 HTML；业务逻辑与视图逻辑混在一起；前后端同一仓库、同一次部署。右列前后端分离（Jamstack）：后端只出 JSON（res.json）；前端独立静态托管（GitHub Pages、Netlify）；一个后端服务多个前端（网站、桌面、移动）；分开部署，跨域要靠 CORS 放行。图下注：分离的技术含量只有一行 res.json()，架构红利是模块化加一后端多前端，代价是跨域（CORS）与两次部署要各自照看。",
      "caption": "从「一个应用渲染模板」到「后端出 JSON + 前端独立托管」——技术只差一行 res.json()，架构换来模块化与一后端多前端，代价是 CORS 与两次部署。",
      "points": [
        "单体：路由 render 模板回 HTML，业务与视图逻辑混在一个应用、一次部署。",
        "分离：后端只 res.json 出 JSON，前端上 Pages/Netlify 静态托管，一个后端可服务网站/桌面/移动多前端。",
        "分离的代价：前后端不同域名触发同源策略，服务器要配 CORS 放行——开发可允所有源，生产只放自己的前端。"
      ]
    },
    {
      "id": "session-vs-token",
      "file": "session-vs-token.svg",
      "lessonId": "nodejs-api-security",
      "sectionIndex": 2,
      "zhTitle": "会话 cookie vs JWT 令牌：认证的两种载体",
      "alt": "两列对比图。左列会话认证（cookie）：登录建会话，浏览器持 connect.sid；服务器端存会话数据；cookie 随每个请求自动带上；前后端分离跨域时 cookie 复杂化。右列令牌认证（JWT）：登录签发一个令牌给前端；服务器不存会话（无状态）；令牌放 Authorization Bearer 头；可设过期，适合跨域 API。图下注：换载体不换流程——Passport 仍是检查载体后认证或拒绝，只是载体从 cookie 换成令牌，这是 Blog API 前后端分离后的认证形态。",
      "caption": "会话把状态存服务器、靠 cookie 认人；令牌把状态交给客户端、靠 Authorization 头的 JWT 认人——前后端分离跨域时令牌更顺手，Passport 的检查流程不变。",
      "points": [
        "会话认证：服务器存会话数据，浏览器 connect.sid cookie 自动随请求带上——跨域分离时 cookie 细节变复杂。",
        "令牌认证：登录签发 JWT，服务器无状态，令牌放 Authorization: Bearer 头——可过期、跨域友好。",
        "流程一致：Passport 都是「检查载体（cookie 或令牌）→ 认证或拒绝」，换的只是载体。"
      ]
    },
    {
      "id": "supertest-chain",
      "file": "supertest-chain.svg",
      "lessonId": "nodejs-testing-routes-and-controllers",
      "sectionIndex": 2,
      "zhTitle": "supertest 测试链：建 app → 发请求 → expect → done",
      "alt": "流程图，五步。第一步测试文件建迷你 app——挂被测 router、不调用 listen；第二步 request(app).get 或 .post——supertest 直接对 app 对象发请求；第三步 .expect 链式断言——查响应头、响应体、状态码；第四步 POST 用 .then 串一个 GET——验证写操作的副作用（先操作后验证）；第五步 done 传进最后一个 expect——SuperTest 替我们标记异步测试完成。图下注：app.js 只管启动（listen）不测，index.js 导出 router 才测，测试里另建一个不 listen 的 app，避免启动真服务器还能跳过无关配置。",
      "caption": "supertest 把 HTTP 测试变成函数调用：建一个不 listen 的迷你 app、request(app) 发请求、.expect 链断言头/体/状态码、done 收尾——被测的必须是导出的 router 模块。",
      "points": [
        "可测性前提：被测代码必须在导出模块里——app.js 只 listen 不测，index.js 导出 router 才测。",
        "测试里新建不 listen 的迷你 app 挂上 router——避免启动真服务器、还能跳过无关配置。",
        ".expect 链断言响应头/体/状态码，done 传进最后一个 expect 由 SuperTest 调用；POST 用 .then 串 GET 验副作用。"
      ]
    },
    {
      "id": "dev-vs-test-db",
      "file": "dev-vs-test-db.svg",
      "lessonId": "node-path-nodejs-testing-database-operations",
      "sectionIndex": 3,
      "zhTitle": "NODE_ENV 切连接串：开发库 vs 测试库",
      "alt": "两列对比图。左列开发环境：NODE_ENV=development；连 DATABASE_URL；inventory_application 库；node app.js 可用 --env-file 加载环境变量。右列测试环境：Jest 默认 NODE_ENV=test；连 TEST_DATABASE_URL；test_ 前缀独立库；用 process.loadEnvFile 加载（--env-file 用不了，因为 Jest 不直接调 node）。图下注：同一份代码按 NODE_ENV 三元式切连接串——开发连开发库、Jest 里自动连测试库，绝不对生产库跑测试，再配 beforeEach 事务重置加 --runInBand 串行才隔离干净。",
      "caption": "一个 NODE_ENV 三元式切换连接串：开发连 DATABASE_URL、Jest 默认 NODE_ENV=test 自动连 TEST_DATABASE_URL——同一份代码、两个库，绝不动生产库。",
      "points": [
        "Jest 不直接调 node，--env-file 用不了——改用 process.loadEnvFile() 放进 Jest global setup file。",
        "Jest 默认把 NODE_ENV 设为 test，覆盖 .env 的 development——正好被切库三元式利用，测试自动连 test_ 前缀库。",
        "隔离两层：beforeEach 用 $transaction 重置表 + --runInBand 让多文件串行跑（Jest 默认并行会搅混数据库操作）。"
      ]
    },
    /* ---------- 超长续轮批次 7 阶段 4（2026-09-29，v4.11.36，World 8 求职 14 课、全站 197 课收官） ----------
     * 14 课逐课过判据五条，配 5 张、不配 9 课（全站 112 → 117 张）。
     * 配 5 张（全为知识课）：
     * - strategy **job-search-nine-steps**（flow，§1）：九步路径是整门求职课的空间骨架、
     *   后续 12 课都在其中一格（判据①章节地图式结构、②每课回看、③全站无求职路径图、
     *   ⑤全课程最重结构）。
     * - interview **interview-funnel**（flow，§0）：漏斗七步是 13.7KB 最重课的导航图
     *   （判据①看不见的多阶段流程、②handling 课直接承接第 5–7 步、③全站无招聘漏斗图、
     *   ⑤七步各考点不同必须整体在胸）。
     * - networking **hidden-vs-visible-market**（compare，§1）：80/20 两个市场是全课程
     *   最大的认知翻转（判据①两列对比是 compare 本义、②strategy/collect/applying 三课
     *   反复消费、③全站无就业市场对比图、⑤隐藏市场是人脉课存在的理由）。
     * - companies-want **hiring-three-factors**（map，§2）：能力/动机/契合三要素是雇主
     *   视角的中心辐射结构（判据①层级关系、②resume/interview/fit 面试三处落地、
     *   ③全站无招聘三要素图、⑤三要素决定全部材料的组织方式）。
     * - collect **lead-source-priority**（flow，§1）：四级来源优先级是线索分发的决策链
     *   （判据①递减序列、②applying「走侧门」直接消费、③全站无来源分级图、⑤每进一条
     *   线索都要过这个分级）。
     * 不配 9 课理由：how-this-course-will-work（课程使用说明，四步结构文字已足——判据④）、
     * it-starts-with-you（三组自评问题清单即载体本身——判据④）、what-you-can-do-to-prepare
     * （五件准备事是并列清单非机制——判据④）、building-your-personal-website（Project 课，
     * 文档四件套与 17 站参照无抽象机制——判据①不满足）、building-your-resume（Project 课，
     * 10 秒规则与三标题项文字已结构化——判据④）、qualifying-job-leads（期望值=概率×价值
     * 一行公式已足——space-complexity「官方已并排」同型理由）、applying-for-web-development-jobs
     * （七小节是纪律集合而非单一机制——判据①不满足）、handling-a-job-offer（力量反转是论述
     * 性文字、三操作已列点——判据④）、conclusion（结语祝贺信无可考知识点——finishing-up
     * 先例）。 ---------- */
    {
      "id": "job-search-nine-steps",
      "file": "job-search-nine-steps.svg",
      "lessonId": "node-path-getting-hired-strategy",
      "sectionIndex": 1,
      "zhTitle": "通往工作的官方九步路径",
      "alt": "流程图，九个方框分两行。第一行依次为：①弄清你的需求与技能（一切从你开始）、②弄清公司要什么给什么（三要素视角）、③提前铺垫提高胜率（技能/叙事/作品集/形象）、④收集工作线索（电子表格主数据库）、⑤筛选工作线索（期望值 = 概率 × 价值）；第二行依次为：⑥接触并申请（迭代式、走侧门）、⑦面试（七步漏斗）、⑧处理 offer（别立刻接受）、⑨Profit??（官方原文自带双问号）。图下注：第 1–3 步 =「准备求职」章，第 4–8 步 =「投递与面试」章。没有计划：要么海投简历纳闷为什么没回音，要么走完漫长流程才发现根本不想要那份工作。",
      "caption": "九步路径是整门求职课的骨架：前三步对应「准备求职」章，第 4–8 步对应「投递与面试」章，第 9 步 Profit?? 是官方的程序员玩笑。",
      "points": [
        "每课都是路径上的一格：先看地图再走路，任何时刻都知道自己在第几步、下一步是什么",
        "有些事比其他的更可选，但你必须有计划——结构是反海投的解药，不是束缚",
        "没有计划的两种死法：往每个招聘板狂发简历纳闷没成果；或走完漫长痛苦流程才发现根本不想要那份工作"
      ]
    },
    {
      "id": "interview-funnel",
      "file": "interview-funnel.svg",
      "lessonId": "node-path-getting-hired-preparing-to-interview-and-interviewing",
      "sectionIndex": 0,
      "zhTitle": "技术招聘漏斗七步",
      "alt": "流程图，七个方框分两行。第一行依次为：①电话筛选（常为 HR 约半小时）、②技术面试（现场编码 / 逻辑题 / 白板）、③技术挑战（带回家，最多一整天）、④契合面试（见全团队，一票否决）；第二行依次为：⑤Job Offer（让细节落邮件）、⑥Offer 谈判（另一 offer 是最强筹码）、⑦接受 Offer（签约前别买房子）。图下注：技术挑战的位置随公司浮动——有时先做 take-home 再电话筛选；很多公司跳过轻量寒暄直接进技术筛选——按上限准备。",
      "caption": "招聘漏斗七步：每一步的考点与对策都不同——先知道自己走到哪一步，再决定怎么准备。",
      "points": [
        "电话筛选的真实目的：确认你能过后两关——按技术+契合的轻量版准备，别当聊天",
        "技术面试的隐藏考点：把你推到极限看你面对「不会」的反应——诚实与求知欲是最大资产",
        "契合面试一票否决：任何团队成员反对就不雇——这也是你带问题清单反向测试他们的机会",
        "Offer 之后还有两步：谈判与接受——不立刻接受、签约前别买房子"
      ]
    },
    {
      "id": "hidden-vs-visible-market",
      "file": "hidden-vs-visible-market.svg",
      "lessonId": "node-path-getting-hired-professional-networking",
      "sectionIndex": 1,
      "zhTitle": "隐藏就业市场 vs 公开招聘职位",
      "alt": "两列对比图。左列「隐藏就业市场（高达 80%）」：多数职位从不发布在网上、靠推荐与内推成交；公司省去发布、筛选、面试的全部流程成本，宁愿走隐藏市场；许多公司给成功内推的员工发奖金，传名激励双向；入场券是让网络把你视作拥有特定技能集的可靠个人。右列「公开招聘职位（约 20%）」：刷招聘板只能看到约 20% 的职位，仍值得投；海投等于进入羊群，与海量申请者竞争更少的职位；质量优先于数量，少量定制化申请好过几百份雷同简历；选你觉得有趣、核心价值观你认同的公司。图下注：比例因来源不同有出入，但隐藏市场真实存在且规模可观——策略不打它的主意，就是在自削胜算。",
      "caption": "高达 80% 的工作不发布在网上——招聘板只让你进入最小、最卷的市场；隐藏市场的入场券是人脉。",
      "points": [
        "公司视角解释隐藏市场为什么存在：招聘很痛、很贵——职位一开就有可靠候选人出现最省钱",
        "进入隐藏市场的方式就是人脉课的三个动作：真实连接、信息面试、持续维护",
        "公开招聘不放弃但质量优先于数量：定制化少量申请好过霰弹枪式海投"
      ]
    },
    {
      "id": "hiring-three-factors",
      "file": "hiring-three-factors.svg",
      "lessonId": "node-path-getting-hired-what-companies-want",
      "sectionIndex": 2,
      "zhTitle": "招聘经理找的三样东西",
      "alt": "辐射结构图。中央方框：招聘经理找什么（两个门槛项 + 一个决定项）；三个卫星框以连线围绕：能力 Capability（尽快创造价值——相关经验 + 技术门槛；新人用项目/开源/实习做社会证明破 catch-22）、动机 Motivation（成长曲线而非静态直线——自学走到这里 + 真实职业目标 + 学得飞快）、契合 Fit（团队想不想整天与你共事——几乎所有流程让全团队评估后期候选人，常是决定性一票）。",
      "caption": "三要素：能力与动机是「被考虑」的最低门槛，契合决定成败——几乎所有招聘流程都会让全团队评估后期候选人。",
      "points": [
        "招聘经理的处境决定标准：大忙人 + 每周上百个不合格申请 + 只想回去构建产品",
        "求职 catch-22：证明可雇用的最容易方式是曾被雇用过——破解靠「其他人曾相信你到愿意使用你的工作」",
        "实习的三原则：必须有薪（没人珍惜免费的东西）、更看成长潜力、本质是冲着转正的超长面试"
      ]
    },
    {
      "id": "lead-source-priority",
      "file": "lead-source-priority.svg",
      "lessonId": "node-path-getting-hired-collecting-job-leads",
      "sectionIndex": 1,
      "zhTitle": "四级职位来源：概率与质量递减",
      "alt": "流程图，四个方框一排，箭头依次连接：①你的人脉（含社区认识的人——最高概率/质量）、②直达真人的直接发布（开发者发本公司空缺——另一端是真人）、③直接发布（公司官网招聘页——通常也到具体的人）、④招聘板（pretty much awful——你在羊群里了）。图下注：优先级 = 概率 × 质量递减；每条进表的线索先查 Connections 列——能找到一个真人，就能把第 4 级线索升级成第 2 级通道。",
      "caption": "四级来源按概率与质量排序：越往后人越多、命中率越低——招聘板是最宽的漏斗口，也是官方原话「相当糟糕」的羊群入口。",
      "points": [
        "从人脉开始——哪怕它很小：Facebook 好友与好友的好友里就可能有招聘线索",
        "第 2 级的灵魂是「邮件另一端是另一个真人」：开发者（不是招聘官）发到本地邮件列表的空缺",
        "招聘板不是不用，是别当主战场：九站产出的每条线索进表后先找连接升级通道"
      ]
    },
  ]
};
