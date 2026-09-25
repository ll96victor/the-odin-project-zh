"""仅访问公开的 TOP 目录与全部已开放 lesson，检查状态、标题、锚点和课程顺序。

v4.11.17：官方于 2026-09-23 移除全部 Knowledge Check（PR #31412，只删不补），
本站同步下线。因此本脚本不再要求 `knowledge-check` 锚点，并把它改成**反向断言**：
官方页若重新出现该锚点，本脚本先红，逼人复核「是否要跟随恢复这一节」，
而不是让一个悄悄回来的锚点被无视。
"""
import concurrent.futures
import json
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCES = json.loads((ROOT / 'sources.json').read_text())

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
    return subprocess.check_output([
        'curl', '--location', '--fail', '--silent', '--show-error',
        '--max-time', '40', url
    ], text=True, timeout=45)

def check(lesson):
    parser = PageInfo()
    parser.feed(get(lesson['url']))
    title = ' '.join(''.join(parser.h1).split())
    assert title == lesson['title'], f"标题变化: {lesson['url']} => {title}"
    # 官方课页结构（2026-09-24 实抓核对）：每课必有 Assignment 锚点；
    # Knowledge Check 已于 2026-09-23 全部移除。sources.json 的 hasKnowledgeCheck
    # 与 hasAdditionalResources 记录的是本站对官方课节的核对结论，一并复核。
    # v4.11.20 第九批：第 46 课 Choose Your Path Forward 是官方唯一的无 Assignment 课
    # （结语课，官方文件顶部声明结构豁免）——它必须没有 assignment 锚点，其余课必须有。
    if lesson['id'] == 'choose-your-path-forward':
        assert 'assignment' not in parser.ids, (
            "官方页出现 assignment 锚点——官方可能给结语课补了 Assignment，"
            f"需人工复核是否跟随收录: {lesson['url']}")
    else:
        assert 'assignment' in parser.ids, f"缺失 Assignment 锚点: {lesson['url']}"
    assert 'knowledge-check' not in parser.ids, (
        "官方页重新出现 knowledge-check 锚点——官方可能恢复了 Knowledge Check 一节，"
        f"需人工复核是否跟随恢复: {lesson['url']}")
    assert lesson['hasKnowledgeCheck'] is False, f"记录与事实不符: {lesson['url']}"
    assert 'additional-resources' not in parser.ids, f"新增补充资料，需复核: {lesson['url']}"
    return f"OK {lesson['order']:02} {title}"

def main():
    course = get(SOURCES['courseUrl'])
    slugs = list(dict.fromkeys(re.findall(r'href="(?:https://www.theodinproject.com)?(/lessons/[^"?#]+)"', course)))
    # v4.11.20 第九批（46/46 全开）：excludedBoundary 已置空，无排除边界——
    # 官方目录的 46 个课 slug 必须与本站收录逐字一致（顺序与全集双重核对）。
    expected = ['/lessons/foundations-' + item['id'] for item in SOURCES['lessons']]
    assert slugs[:len(expected)] == expected, '官方课序变化，需复核'
    assert len(expected) == 46, '本站应收录全部 46 课'
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for result in pool.map(check, SOURCES['lessons']):
            print(result)
    print(f"通过：官方目录顺序、{len(SOURCES['lessons'])} 个原课页面、"
          f"{len(SOURCES['lessons']) - 1} 个 Assignment 锚点（第 46 课结语课官方无该节）；Knowledge Check 锚点确认为零（官方 2026-09-23 已移除）；"
          "没有新增补充栏目。")

if __name__ == '__main__':
    try:
        main()
    except (AssertionError, subprocess.SubprocessError) as error:
        print(f'未通过：{error}', file=sys.stderr)
        sys.exit(1)
