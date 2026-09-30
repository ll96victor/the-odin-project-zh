"""仅访问公开的 TOP 课程页与全部已开放 lesson，检查状态、标题、锚点和课程顺序。

2026-09-25 FIX 轮起按**多课程**核对（路径课试点后本站不再只有 Foundations 一门课）：
- 课的归属：sources.json 每条 lesson 的 `course` 字段（路径课带该字段，值 =
  curriculum.js courses[] 的 id；Foundations 课不带，视为 'foundations'）——
  与 tests/content.test.cjs 的 URL 前缀分层判断同一口径。
- 课程页 URL：Foundations 用 sources.json 顶层 courseUrl；路径课从 curriculum.js
  的 courses[] 提取（现成事实源，本脚本不另抄第二份 URL）；两处对 Foundations
  的记载必须一致，不一致即红。
- 期望课页 URL：直接取每条 lesson 自带 url 的 path 部分，**不再拼 slug 前缀**
  （旧版硬拼 '/lessons/foundations-' + id，路径课的 node-path-* slug 出现后断裂）。
- 顺序核对（per course）：已开放课必须构成该课程页链接序列的**前缀**——
  比「子集 + 顺序一致」更强：官方任何调序、插入、移除已开放课都会先红。
  本站按官方课序逐批开放，前缀不变量由设计保证；若未来某批需要跳课开放，
  必须先有意识地修改这里（跳课会让前缀失配，这是刻意的复核触发器）。

v4.11.17：官方于 2026-09-23 移除全部 Knowledge Check（PR #31412，只删不补），
本站同步下线。因此本脚本不再要求 `knowledge-check` 锚点，并把它改成**反向断言**：
官方页若重新出现该锚点，本脚本先红，逼人复核「是否要跟随恢复这一节」，
而不是让一个悄悄回来的锚点被无视。

课型判断（有无 Assignment）按 sources.json 的 `hasAssignment` 字段数据驱动，
不再硬编码课号——记录为 True 的课页面必须有 assignment 锚点，记录为 False 的
课必须没有（官方曾对结语课声明结构豁免；官方若给任何课增删该节，记录与事实
不符会先红，逼人复核是否跟随）。
"""
import concurrent.futures
import json
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
SOURCES = json.loads((ROOT / 'sources.json').read_text(encoding='utf-8'))

class PageInfo(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.h1 = []
        self.in_h1 = False
        self.finished_h1 = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'h1' and not self.finished_h1:
            self.in_h1 = True

    def handle_endtag(self, tag):
        if tag == 'h1':
            self.in_h1 = False
            self.finished_h1 = True

    def handle_data(self, value):
        if self.in_h1:
            self.h1.append(value)

def get(url):
    # 刻意收 bytes 再自己 decode('utf-8')，不用 text=True：
    # text=True 走系统区域编码（本机是 GBK），解码官方 UTF-8 页面时偶发
    # UnicodeDecodeError（World 2 第三批实跑撞到 0x93 非法 GBK 字节）；更坑的是
    # 该异常发生在 subprocess 的 reader 线程里，check_output 不抛出而是**返回 None**，
    # 下游只会看到一个莫名其妙的 TypeError: expected string... got 'NoneType'。
    # 自己 decode 让编码问题在主线程如实炸出来，且官方页固定 UTF-8（Next.js charset）。
    raw = subprocess.check_output([
        'curl', '--location', '--fail', '--silent', '--show-error',
        '--max-time', '40', url
    ], timeout=45)
    return raw.decode('utf-8')

def course_page_urls():
    """course id → 课程页 URL。

    路径课 URL 从 curriculum.js 的 courses[] 提取：course 对象的结构是
    id → order → en → zh → url 五连（section 只有 id/en/zh/lessons，
    没有 order 和 url，不会被误匹配）。Foundations 以 sources.json 的
    courseUrl 为准，并与 curriculum.js 的记载交叉核对（双记录防漂移；
    catalog.test.cjs / curriculum.test.cjs 在 Node 侧钉同一一致性）。
    """
    text = (ROOT / 'curriculum.js').read_text(encoding='utf-8')
    pattern = re.compile(
        r"id:\s*'([a-z0-9-]+)',\s*order:\s*\d+,\s*en:\s*'(?:[^'\\]|\\.)*',"
        r"\s*zh:\s*'(?:[^'\\]|\\.)*',\s*url:\s*'([^']+)'")
    urls = dict(pattern.findall(text))
    assert urls, 'curriculum.js 未提取到任何 course URL——courses[] 结构可能已变化，需复核'
    assert 'foundations' in urls and urls['foundations'] == SOURCES['courseUrl'], (
        'sources.json 的 courseUrl 与 curriculum.js 的 foundations URL 不一致，'
        f"两处事实源打架：{SOURCES['courseUrl']} vs {urls.get('foundations')}")
    return urls

def groups_by_course():
    """按 course 字段分组，组内按 order 升序；保持课程首次出现顺序。"""
    groups = {}
    for lesson in SOURCES['lessons']:
        groups.setdefault(lesson.get('course', 'foundations'), []).append(lesson)
    for lessons in groups.values():
        lessons.sort(key=lambda item: item['order'])
    return groups

def page_lesson_paths(url):
    html = get(url)
    return list(dict.fromkeys(
        re.findall(r'href="(?:https://www.theodinproject.com)?(/lessons/[^"?#]+)"', html)))

def check_course_order(course_id, lessons, urls):
    """该课程已开放课必须是课程页链接序列的前缀（⊆ 且顺序一致的最强形态）。"""
    expected = []
    for lesson in lessons:
        parts = urlsplit(lesson['url'])
        assert parts.netloc == 'www.theodinproject.com' and parts.path.startswith('/lessons/'), (
            f"sources.json 的 lesson url 异常（应为官方 /lessons/ 绝对地址）: {lesson['url']}")
        expected.append(parts.path)
    page = page_lesson_paths(urls[course_id])
    if page[:len(expected)] != expected:
        missing = [path for path in expected if path not in page]
        if missing:
            raise AssertionError(
                f'{course_id} 课程页不再列出已开放课（官方可能移除或改了 slug），'
                f'需复核: {missing}（课程页现列 {len(page)} 课）')
        first = next(i for i, pair in enumerate(zip(page, expected)) if pair[0] != pair[1])
        raise AssertionError(
            f'{course_id} 官方课序变化，需复核：课程页第 {first + 1} 位是 {page[first]}，'
            f'本站已开放课记录是 {expected[first]}（课程页共 {len(page)} 课）')
    return course_id, len(expected), len(page)

def check(lesson):
    parser = PageInfo()
    parser.feed(get(lesson['url']))
    title = ' '.join(''.join(parser.h1).split())
    assert title == lesson['title'], f"标题变化: {lesson['url']} => {title}"
    # 官方课页结构（2026-09-24 实抓核对）：hasAssignment 记录本站对官方课节的
    # 核对结论，页面锚点必须与记录双向一致（数据驱动，不硬编码课号）。
    # Knowledge Check 已于 2026-09-23 全部移除，hasKnowledgeCheck 与
    # hasAdditionalResources 同为记录侧复核。
    if lesson['hasAssignment']:
        assert 'assignment' in parser.ids, f"缺失 Assignment 锚点: {lesson['url']}"
    else:
        assert 'assignment' not in parser.ids, (
            "官方页出现 assignment 锚点——sources.json 记录该课无 Assignment，"
            f"官方可能补了该节，需人工复核是否跟随收录: {lesson['url']}")
    assert 'knowledge-check' not in parser.ids, (
        "官方页重新出现 knowledge-check 锚点——官方可能恢复了 Knowledge Check 一节，"
        f"需人工复核是否跟随恢复: {lesson['url']}")
    assert lesson['hasKnowledgeCheck'] is False, f"记录与事实不符: {lesson['url']}"
    # Additional resources 与 hasAssignment 同口径数据驱动（World 3 批次 4 阶段 3 起
    # hashmap-data-structure 为全站首个带该节的课，sources.json 已如实记录）：
    # 记录为有的课官方页必须有锚点，记录为无的课官方页不得新出现该节。
    if lesson['hasAdditionalResources']:
        assert 'additional-resources' in parser.ids, (
            f"sources.json 记录该课有 Additional resources 节，官方页却缺锚点: {lesson['url']}")
    else:
        assert 'additional-resources' not in parser.ids, (
            "官方页出现 additional-resources 锚点——sources.json 记录该课无此节，"
            f"官方可能新增了补充资料，需人工复核是否跟随收录: {lesson['url']}")
    return f"OK {lesson['order']:02} {title}"

def main():
    urls = course_page_urls()
    groups = groups_by_course()
    unknown = sorted(set(groups) - set(urls))
    assert not unknown, (
        f'sources.json 的 course 归属在 curriculum.js 里找不到对应课程页: {unknown}')
    summary = [check_course_order(course_id, lessons, urls)
               for course_id, lessons in groups.items()]
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for result in pool.map(check, SOURCES['lessons']):
            print(result)
    assignments = sum(1 for lesson in SOURCES['lessons'] if lesson['hasAssignment'])
    detail = '；'.join(
        f'{course_id} 开放 {opened}/{listed} 课' for course_id, opened, listed in summary)
    print(f"通过：按课程核对官方目录顺序（{detail}，前缀一致）、"
          f"{len(SOURCES['lessons'])} 个课页面、{assignments} 个 Assignment 锚点"
          "（按 hasAssignment 数据驱动，记录为无的课官方页确无该节）；"
          "Knowledge Check 锚点确认为零（官方 2026-09-23 已移除）；"
          "Additional resources 锚点按 hasAdditionalResources 数据驱动"
          "（记录为有的课官方页锚点在位，记录为无的课官方页确无该节）。")

if __name__ == '__main__':
    try:
        main()
    except (AssertionError, subprocess.SubprocessError, UnicodeDecodeError) as error:
        print(f'未通过：{error}', file=sys.stderr)
        sys.exit(1)
