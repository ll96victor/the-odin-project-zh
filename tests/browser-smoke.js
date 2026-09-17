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
    const V1_H2 = ['中文导读', '重要英文术语', '今天实际要做什么', '简单自测', '回到官方原课'];
    const V2_H2_WITH_CODE = ['这一课为什么重要', '中文讲解', '重要英文术语', '代码示例', '常见错误', '官方任务', '简单自测', '回到官方原课'];
    const V2_H2_NO_CODE = ['这一课为什么重要', '中文讲解', '重要英文术语', '常见错误', '官方任务', '简单自测', '回到官方原课'];
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
      await page.locator('summary').first().click();
      assert(await page.locator('.answer').first().isVisible(), '点击后应显示答案');
      await page.locator('summary').first().click();
      assert(!await page.locator('.answer').first().isVisible(), '再次点击应关闭答案');
      assert(await page.locator('.official-start .button').getAttribute('href') === lesson.url, '原课入口错误');
      assert(await page.locator('.official-start .button').getAttribute('target') === '_blank', '原课应新标签页打开');
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
    return {passed:true,lessons:19,quizQuestions:65,viewports:widths,checks:'v4.5.1 首页 IA（3 主入口 + 唯一 hero CTA + 本站目录 dialog 19+27 与官方次级外链）、列表、标题、结构、默认隐藏、鼠标/键盘展开关闭、翻页边界、120 个页面尺寸组合、未知编号、200% 文字放大、零控制台错误'};
  } finally {
    page.off('pageerror', onError);
    page.off('console', onConsole);
  }
}
