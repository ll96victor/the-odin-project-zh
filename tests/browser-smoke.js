async page => {
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const base = await page.evaluate(() => new URL('./', location.href).href);
  const pageErrors = [];
  const onError = error => pageErrors.push(error.message);
  page.on('pageerror', onError);
  const errors = [];
  const onConsole = message => { if (message.type() === 'error') errors.push(message.text()); };
  page.on('console', onConsole);
  try {
    await page.goto(base + 'index.html');
    // v4.4 首页 IA（交接 §3/§13.1）：三件事结构在位，大块内容默认不平铺
    assert(await page.locator('.continue-card').count() === 1, '首页应有继续学习主卡');
    assert(await page.locator('.today-strip').count() === 1, '首页应有今日摘要条');
    assert(await page.locator('.entry-card').count() === 3, 'v4.5.1：首页应有 3 个主入口卡');
    assert(await page.locator('.lesson-link').count() === 0, 'v4.4：首页默认不平铺目录行');
    assert(await page.locator('.stat').count() === 0, 'v4.4：首页默认不平铺统计格');
    assert(await page.locator('.skill-list').count() === 0, 'v4.4：首页默认不平铺技能路线');
    // hero CTA 直达课程页（交接 §13.2 的真实浏览器子集）
    await page.locator('.continue-card .button').first().click();
    assert(page.url().includes('lesson.html?id='), 'hero CTA 未进入课程页');
    await page.goto(base + 'index.html');
    // 目录住在 dialog：打开后恰好 19 条已开放 + 27 课灰化（20-46 无链接红线不变）
    await page.locator('.catalog-trigger').click();
    assert(await page.locator('.catalog-dialog .lesson-link').count() === 19, '目录 dialog 应显示 19 课');
    assert(await page.locator('.catalog-dialog .lesson-locked').count() === 27, '目录 dialog 应灰化 27 课');
    assert(await page.locator('.catalog-dialog .catalog-official-link').count() === 1, '目录 dialog 应含官方目录外链');
    await page.locator('.catalog-dialog .dialog-close').click();
    const lessons = await page.evaluate(() => window.ODIN_GUIDE.lessons.map(l => ({id:l.id,zh:l.zh,title:l.title,url:l.url,quiz:l.quiz.length,hasSections:Array.isArray(l.sections),hasExamples:Array.isArray(l.sections)&&Array.isArray(l.examples)&&l.examples.length>0})));
    // v2 试点课使用自足中文讲解布局（h2 序列不同）；其余 15 课保持旧布局。
    // v4.11.4：「回到官方原课」末节移除（官方入口只剩页顶 .official-start，
    // 署名与非官方声明由 lesson.html 页脚承担——见 CONTENT-STYLE-GUIDE.md 第 6 节）。
    // v4.11.6：h2 序列的**事实源搬到 LESSON-PAGE-GUIDE.md 第 2 节**（课页规范手册）；
    // 这里的常量只是同步钉子——改序列必须先改该文档、再同步本文件（避免两处事实源）。
    const V1_H2 = ['中文导读', '重要英文术语', '今天实际要做什么', '简单自测'];
    const V2_H2_WITH_CODE = ['这一课为什么重要', '中文讲解', '重要英文术语', '代码示例', '常见错误', '官方任务', '简单自测'];
    const V2_H2_NO_CODE = ['这一课为什么重要', '中文讲解', '重要英文术语', '常见错误', '官方任务', '简单自测'];
    // v4.11.6（交接 §3.2/§3.6）：任务与资料对应关系标注的每课数量名单
    //（KC 6 课 + Assignment 3 课，command-line-basics 双份 = 2；其余 13 课 0）。
    // 文案与数字跟数据的一致性由 tests/task-resource-note.test.cjs 钉住，
    // 这里只钉真实浏览器里的存在性与落点。
    const NOTE_COUNTS = {
      'how-does-the-web-work': 1, 'commit-messages': 1, 'command-line-basics': 2,
      'introduction-to-git': 1, 'introduction-to-html-and-css': 1, 'links-and-images': 1,
      'setting-up-git': 1, 'git-basics': 1
    };
    for (const [index, lesson] of lessons.entries()) {
      await page.goto(base + `lesson.html?id=${lesson.id}`);
      assert(await page.locator('h1').textContent() === lesson.zh, `课程显示错误：${lesson.id}`);
      assert((await page.title()).includes(lesson.title), '浏览器标题缺少英文课名');
      const sections = await page.locator('main h2').allTextContents();
      const expectedH2 = lesson.hasSections ? (lesson.hasExamples ? V2_H2_WITH_CODE : V2_H2_NO_CODE) : V1_H2;
      assert(JSON.stringify(sections) === JSON.stringify(expectedH2), `学习页章节顺序不一致：${lesson.id}`);
      if (lesson.hasSections) {
        // v2 布局不再使用旧导读的两个 h3；出现即说明分流或渲染错误
        assert(await page.getByRole('heading', {name:'这一课是干什么的',exact:true}).count() === 0, `v2 课不应出现旧 h3：${lesson.id}`);
        assert(await page.getByRole('heading', {name:'你必须理解什么',exact:true}).count() === 0, `v2 课不应出现旧 h3：${lesson.id}`);
      } else {
        assert(await page.getByRole('heading', {name:'这一课是干什么的',exact:true}).count() === 1, '课程用途缺失');
        assert(await page.getByRole('heading', {name:'你必须理解什么',exact:true}).count() === 1, '必须理解的内容缺失');
      }
      assert(await page.locator('details').count() === lesson.quiz, '自测数量不匹配');
      assert(await page.locator('details[open]').count() === 0, '答案默认必须隐藏');
      assert(await page.locator('.answer').first().isVisible() === false, '答案应不可见');
      // v4.11.5（交接 3.A/3.B）：官方任务节折叠头 = button[aria-expanded]（零新增 details，
      // 上方 details === quiz 断言即「零新增」的钉子）；默认展开；点击收起/再点恢复；
      // 跳转入口在 Assignment 标题内指向资源区锚点，目标始终可见（资源区不折叠）。
      const collapseToggles = page.locator('.section-official .collapse-toggle');
      assert(await collapseToggles.count() === 2, `官方任务节应恰有 2 个折叠头：${lesson.id}`);
      assert(await page.locator('.section-official .collapse-body[hidden]').count() === 0, `默认应展开：${lesson.id}`);
      assert(await collapseToggles.first().getAttribute('aria-expanded') === 'true', `折叠头默认 aria-expanded=true：${lesson.id}`);
      assert(await page.locator('.section-official > a').count() === 0, `官方任务节不得有节级直接子链接：${lesson.id}`);
      await collapseToggles.first().click();
      assert(await page.locator('#official-assignment-body').evaluate(el => el.hidden) === true, `点击折叠头后 Assignment 列表应收起：${lesson.id}`);
      assert(await collapseToggles.first().getAttribute('aria-expanded') === 'false', `收起后 aria-expanded=false：${lesson.id}`);
      await collapseToggles.first().click();
      assert(await page.locator('#official-assignment-body').evaluate(el => el.hidden) === false, `再次点击应恢复展开（恢复出口=折叠头）：${lesson.id}`);
      assert(await collapseToggles.first().getAttribute('aria-expanded') === 'true', `恢复后 aria-expanded=true：${lesson.id}`);
      assert(await page.locator('.section-official h3 .resource-jump').getAttribute('href') === '#lesson-resources', `跳转入口应指向资源区锚点：${lesson.id}`);
      await page.locator('.section-official h3 .resource-jump').click();
      assert(await page.locator('#lesson-resources').isVisible(), `跳转后资源区标题必须可见（资源区永不折叠）：${lesson.id}`);
      // v4.11.6：标注存在性 + 落点（section-official 直接子 p、h3 与折叠容器之间）
      assert(await page.locator('.section-official > p.task-resource-note').count() === (NOTE_COUNTS[lesson.id] || 0), `任务与资料标注数量：${lesson.id}`);
      if (NOTE_COUNTS[lesson.id]) {
        const notesOk = await page.evaluate(() => [...document.querySelectorAll('.section-official > p.task-resource-note')].every(p => {
          const prev = p.previousElementSibling;
          const next = p.nextElementSibling;
          return Boolean(prev && prev.tagName === 'H3' && next
            && (next.id === 'official-assignment-body' || next.id === 'official-kc-body')
            && p.querySelectorAll('a').length === 0);
        }));
        assert(notesOk, `标注应落在 h3 与折叠容器之间且不含链接：${lesson.id}`);
      }
      await page.locator('summary').first().click();
      assert(await page.locator('.answer').first().isVisible(), '点击后应显示答案');
      await page.locator('summary').first().click();
      assert(!await page.locator('.answer').first().isVisible(), '再次点击应关闭答案');
      // v4.11.5 修复存量缺陷：官方按钮 class 是 button-secondary（v4.11.4 起），
      // 旧选择器 .official-start .button 匹配不到任何元素（本文件此前多轮未实跑，
      // 首次真实执行即超时暴露）。断言语义不变：官方入口 href/target 指向原课。
      assert(await page.locator('.official-start .button-secondary').getAttribute('href') === lesson.url, '原课入口错误');
      assert(await page.locator('.official-start .button-secondary').getAttribute('target') === '_blank', '原课应新标签页打开');
      // v4.11.4 反向钉子：正文跳转按钮已删，官方入口全页只剩页顶一个
      //（官方按钮 class 是 button-secondary，用 a 计数，勿用 .button 类选择器）
      assert(await page.locator('.official-start a').count() === 1, `官方入口应只剩页顶一个：${lesson.id}`);
      assert((await page.locator('main h2').allTextContents()).includes('回到官方原课') === false, `不应再有「回到官方原课」末节：${lesson.id}`);
      assert(await page.evaluate(() => Array.from(document.querySelectorAll('main a')).filter(a => a.textContent.includes('在原课中')).length) === 0, `正文不应有「在原课中」跳转链接：${lesson.id}`);
      assert(await page.getByRole('link', {name:'下一课导读 →', exact:true}).count() === (index === 18 ? 0 : 1), '下一课边界错误');
      assert(await page.getByRole('link', {name:'← 上一课导读', exact:true}).count() === (index === 0 ? 0 : 1), '上一课边界错误');
    }
    await page.goto(base + 'index.html');
    // v4.4：首页课程行进目录 dialog，先打开再点首课
    await page.locator('.catalog-trigger').click();
    await page.locator('.catalog-dialog .lesson-link').first().click();
    assert(page.url().includes('id=how-this-course-will-work'), '首页点击未进入首课');
    await page.getByRole('link', {name:'下一课导读 →', exact:true}).click();
    assert(page.url().includes('id=introduction-to-web-development'), '下一课顺序错误');
    await page.getByRole('link', {name:'← 上一课导读', exact:true}).click();
    await page.locator('summary').first().focus();
    await page.keyboard.press('Enter');
    assert(await page.locator('.answer').first().isVisible(), '键盘应可展开答案');
    await page.keyboard.press('Space');
    assert(!await page.locator('.answer').first().isVisible(), '键盘应可关闭答案');
    await page.getByRole('link', {name:'课程列表', exact:true}).click();
    assert(await page.locator('.continue-card').count() === 1, '回到首页失败');
    const widths = [320, 375, 390, 414, 768, 1280];
    for (const width of widths) {
      await page.setViewportSize({width, height:900});
      for (const route of ['index.html', ...lessons.map(l => `lesson.html?id=${l.id}`)]) {
        await page.goto(base + route);
        const overflow = await page.evaluate(() => {
          const w = document.documentElement.clientWidth;
          return [...document.querySelectorAll('main, main *, header, footer')].filter(e => {
            if (!e.getClientRects().length) return false;
            const r = e.getBoundingClientRect();
            return r.right > w + 1 || r.left < -1;
          }).map(e => e.tagName + '.' + e.className);
        });
        assert(overflow.length === 0, `布局越界 ${width} ${route}: ${overflow.join(',')}`);
      }
    }
    await page.goto(base + 'lesson.html');
    assert(await page.locator('h1').textContent() === '未找到这节课', '缺少编号应有提示');
    await page.goto(base + 'lesson.html?id=recipes');
    assert(await page.locator('h1').textContent() === '未找到这节课', '不得显示范围外课程');
    await page.goto(base + 'lesson.html?id=%3Cscript%3E');
    assert(await page.locator('h1').textContent() === '未找到这节课', '未知参数安全提示');
    await page.setViewportSize({width:1280,height:900});
    await page.goto(base + 'lesson.html?id=links-and-images');
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), '文字放大不应水平溢出');
    await page.goto(base + 'index.html');
    assert(pageErrors.length === 0, '运行异常：' + pageErrors.join(';'));
    assert(errors.length === 0, '控制台错误：' + errors.join(';'));
    return {passed:true,lessons:19,quizQuestions:65,viewports:widths,checks:'v4.5.1 首页 IA（3 主入口 + 唯一 hero CTA + 本站目录 dialog 19+27 与官方次级外链）、列表、标题、结构、默认隐藏、鼠标/键盘展开关闭、v4.11.5 官方任务节折叠头（button[aria-expanded] 恰 2 个、默认展开、点击收起/恢复、零新增 details、节级零直接子链接）与页内跳转（#lesson-resources 目标可见）、v4.11.6 任务与资料对应关系标注（KC 6 课 / Assignment 3 课 / 其余 13 课零出现，落点在 h3 与折叠容器之间且零链接）、翻页边界、120 个页面尺寸组合、未知编号、200% 文字放大、零控制台错误'};
  } finally {
    page.off('pageerror', onError);
    page.off('console', onConsole);
  }
}
