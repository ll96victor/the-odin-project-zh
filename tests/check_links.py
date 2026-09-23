"""仅访问公开的 TOP 目录与 20 个 lesson，检查状态、标题、锚点和课程顺序。"""
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
    # v4.11.16 按课型分支：Project 课（recipes）官方页只有 Assignment、没有
    # Knowledge Check（2026-09-23 实抓核对），锚点要求以 sources.json 的
    # hasKnowledgeCheck 为准——官方若给 Project 课新增 KC，此处会先红再复核。
    required = {'assignment'}
    if lesson['hasKnowledgeCheck']:
        required.add('knowledge-check')
    assert required <= parser.ids, f"章节锚点变化: {lesson['url']}"
    assert 'additional-resources' not in parser.ids, f"新增补充资料，需复核: {lesson['url']}"
    return f"OK {lesson['order']:02} {title}"

def main():
    course = get(SOURCES['courseUrl'])
    slugs = list(dict.fromkeys(re.findall(r'href="(?:https://www.theodinproject.com)?(/lessons/[^"?#]+)"', course)))
    boundary = '/lessons/foundations-intro-to-css'
    assert boundary in slugs, '官方目录未找到 Intro to CSS 边界（第 20 课已开放，边界随 excludedBoundary 推进）'
    before = slugs[:slugs.index(boundary)]
    assert before == ['/lessons/foundations-' + item['id'] for item in SOURCES['lessons']], '官方课序变化，需复核'
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for result in pool.map(check, SOURCES['lessons']):
            print(result)
    anchors = sum(1 + item['hasKnowledgeCheck'] for item in SOURCES['lessons'])
    print(f"通过：官方目录顺序、{len(SOURCES['lessons'])} 个原课页面、{anchors} 个 Assignment / Knowledge Check 锚点；没有新增补充栏目。")

if __name__ == '__main__':
    try:
        main()
    except (AssertionError, subprocess.SubprocessError) as error:
        print(f'未通过：{error}', file=sys.stderr)
        sys.exit(1)
