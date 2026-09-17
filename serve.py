#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""本站的本地学习服务（只使用 Python 标准库，不安装任何依赖）。

为什么需要它：浏览器在 file:// 下不提供可靠的本地存储，直接双击 index.html
虽然能读全部课程，但学习进度无法保证保存。用 http://127.0.0.1 打开就能保存。

设计要点：
- 只绑定 127.0.0.1，不监听局域网，其他设备无法访问；
- 服务在当前控制台**前台**运行，因此按 Ctrl+C 或直接关闭这个窗口就会结束服务，
  不会留下需要用户单独理解和关闭的第二个窗口，也不会留下孤儿进程；
- 先完成端口绑定再打开浏览器，不需要任何延时等待；
- 端口被占用时只给出清楚的中文提示，绝不主动结束其他进程；
- 不打印每个请求的访问日志，避免淹没上面的说明文字。

用法（一般由 start.bat 调用，不需要手工输入）：
    python serve.py                 # 绑定 127.0.0.1:8765 并打开浏览器
    python serve.py 8766            # 端口被占用时换一个端口（仅供排错）
    python serve.py --no-browser    # 不自动打开浏览器（仅供测试）
"""

import functools
import http.server
import json
import os
import re
import socket
import sys
import urllib.request

HOST = '127.0.0.1'
DEFAULT_PORT = 8765
ROOT = os.path.dirname(os.path.abspath(__file__))
INDEX = 'index.html'
VERSION_JS = os.path.join(ROOT, 'version.js')

# §7 要求控制台明确写出的三行说明，原文照录。
RUNNING_LINES = (
    '学习服务正在运行。',
    '此窗口在学习期间需要保持打开。',
    '关闭此窗口或按 Ctrl+C 即停止服务。',
)


def read_product_version():
    """从 version.js（版本身份单一事实源，交接 A2）解析产品版本信息。

    不复制版本字符串到本文件：serve.py 启动打印、/version.json 端点、
    旧服务识别全部读同一处。文件缺失或解析不出 version 字段时返回 None，
    调用方必须优雅降级（服务照常起，只是不显示版本）。
    """
    try:
        with open(VERSION_JS, 'r', encoding='utf-8') as handle:
            source = handle.read()
    except OSError:
        return None
    app = re.search(r"app:\s*'([^']+)'", source)
    product = re.search(r"product:\s*'([^']+)'", source)
    version = re.search(r"version:\s*'([^']+)'", source)
    if not version:
        return None
    return {
        'app': app.group(1) if app else 'the-odin-project-zh',
        'product': product.group(1) if product else 'Odin 中文学习站',
        'version': version.group(1),
    }


def find_git_dir(start):
    """从 start 逐级向上找 .git：普通仓库是目录，worktree 是 `gitdir: 路径` 文本文件。

    只读解析文件，不派生任何外部进程（静态红线：serve.py 不派生程序；
    且用户机器可能没装 git——纯文件解析两种情况都成立）。"""
    current = start
    while True:
        candidate = os.path.join(current, '.git')
        if os.path.isdir(candidate):
            return candidate
        if os.path.isfile(candidate):
            try:
                with open(candidate, 'r', encoding='utf-8', errors='replace') as handle:
                    content = handle.read().strip()
            except OSError:
                return None
            if content.startswith('gitdir:'):
                git_dir = content[len('gitdir:'):].strip()
                if not os.path.isabs(git_dir):
                    git_dir = os.path.normpath(os.path.join(current, git_dir))
                return git_dir if os.path.isdir(git_dir) else None
            return None
        parent = os.path.dirname(current)
        if parent == current:
            return None
        current = parent


def read_ref_sha(git_dir, ref):
    """把 refs/heads/xxx 解析成 sha：worktree 松散 ref → 主仓库（commondir）→ packed-refs。"""
    search_dirs = [git_dir]
    commondir_file = os.path.join(git_dir, 'commondir')
    if os.path.isfile(commondir_file):
        try:
            with open(commondir_file, 'r', encoding='utf-8', errors='replace') as handle:
                common = handle.read().strip()
            if common:
                if not os.path.isabs(common):
                    common = os.path.normpath(os.path.join(git_dir, common))
                if os.path.isdir(common):
                    search_dirs.append(common)
        except OSError:
            pass
    relative = ref.replace('/', os.sep)
    for directory in search_dirs:
        loose = os.path.join(directory, relative)
        if os.path.isfile(loose):
            try:
                with open(loose, 'r', encoding='utf-8', errors='replace') as handle:
                    sha = handle.read().strip()
                if sha:
                    return sha
            except OSError:
                pass
    for directory in search_dirs:
        packed = os.path.join(directory, 'packed-refs')
        if not os.path.isfile(packed):
            continue
        try:
            with open(packed, 'r', encoding='utf-8', errors='replace') as handle:
                for line in handle:
                    parts = line.split()
                    if len(parts) == 2 and parts[1] == ref:
                        return parts[0]
        except OSError:
            pass
    return None


def read_git_info():
    """只读解析 .git 文件拿 (分支, short sha)；任何一步读不到都优雅返回 None。"""
    try:
        git_dir = find_git_dir(ROOT)
        if not git_dir:
            return None, None
        head_file = os.path.join(git_dir, 'HEAD')
        if not os.path.isfile(head_file):
            return None, None
        with open(head_file, 'r', encoding='utf-8', errors='replace') as handle:
            head = handle.read().strip()
        branch = None
        sha = None
        if head.startswith('ref:'):
            ref = head[4:].strip()
            # 分支名本身可以带斜杠（如 feature/odin-zh-v4.5），只剥 refs/heads/ 前缀
            if ref.startswith('refs/heads/'):
                branch = ref[len('refs/heads/'):]
            else:
                branch = ref or None
            sha = read_ref_sha(git_dir, ref) if ref else None
        elif re.fullmatch(r'[0-9a-f]{7,40}', head):
            sha = head  # detached HEAD：HEAD 内容就是 sha
        return branch, (sha[:7] if sha else None)
    except OSError:
        return None, None


def prepare_stdout():
    """让中文提示在两种情况下都不乱码。

    交互控制台：Python 3.6+ 在 Windows 上通过控制台 API 以 Unicode 直接输出，
    中文本来就能正确显示，此时不要改动编码（改成按字节写反而会在 GBK 代码页下乱码）。
    输出被重定向（管道、文件、CI）：默认会退回系统 ANSI 代码页（简体中文 Windows 上是
    GBK），遇到中文可能报 UnicodeEncodeError，因此显式切到 UTF-8。
    """
    try:
        if not sys.stdout.isatty() and hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        if not sys.stderr.isatty() and hasattr(sys.stderr, 'reconfigure'):
            sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        # 编码调整失败不应该让服务起不来；退化为忽略无法编码的字符。
        pass


def say(text=''):
    print(text, flush=True)


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    """静态文件服务，但不逐条打印访问日志。

    同时做主机名收敛：localhost 与 127.0.0.1 在浏览器里是两个不同的源
    （scheme + host + port 任意一项不同即不同源），localStorage 完全隔离。
    用户在 127.0.0.1 记的学习进度，换用 localhost 打开时会看到一份全空的
    进度，且无论刷新多少次都不会出现——这正是 v4.2 交接 §2 记录的真实
    P0 Bug（首页 0/46、成就 0/35）。本服务只绑定 127.0.0.1，因此把任何
    localhost 请求 301 重定向到 127.0.0.1，让两条入口永远落在同一个源上。
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def _hostname_of_request(self):
        """取请求 Host 头的主机名部分（去掉端口与 IPv6 方括号）。"""
        host = (self.headers.get('Host') or '').strip().lower()
        if host.startswith('['):
            return host[1:host.index(']')] if ']' in host else ''
        return host.split(':')[0]

    def _requested_path(self):
        """去掉查询串与片段后的请求路径。"""
        return (self.path or '/').split('?', 1)[0].split('#', 1)[0]

    def do_GET(self):
        # v4.5（交接 A3）：/version.json 是动态只读端点（内容由 version.js
        # 实时解析，不落第二份版本文件）。新起的 serve.py 用它识别
        # “占用端口的对方是不是本站、是哪个版本”；旧版本服务没有这个端点，
        # 探测会拿到 404，按“未知程序”处理——这正是设计内行为。
        if self._requested_path() == '/version.json':
            return self._send_version_json()
        return super().do_GET()

    def do_HEAD(self):
        if self._requested_path() == '/version.json':
            return self._send_version_json(write_body=False)
        return super().do_HEAD()

    def _send_version_json(self, write_body=True):
        info = read_product_version()
        payload = json.dumps(info or {'app': None, 'product': None, 'version': None},
                             ensure_ascii=False).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(payload)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        if write_body:
            self.wfile.write(payload)

    def send_head(self):
        hostname = self._hostname_of_request()
        if hostname in ('localhost', '::1'):
            port = self.server.server_address[1]
            self.send_response(301)
            self.send_header('Location', f'http://127.0.0.1:{port}{self.path}')
            self.send_header('Content-Length', '0')
            self.end_headers()
            return None
        return super().send_head()

    def end_headers(self):
        # v4.5（交接 A2/A3 同源问题）：静态资源（.js/.css/.html/.svg 等）统一加
        # Cache-Control: no-cache——浏览器每次导航/刷新都必须带 If-Modified-Since
        # 回源校验，命中则 304（不重传正文）、有改动则 200（拿到新文件）。
        # SimpleHTTPRequestHandler 默认只发 Last-Modified、不发 Cache-Control，
        # 浏览器会按“启发式新鲜期”在一段时间内直接用本地副本而不回源，导致
        # “升级了代码、刷新页面却仍是旧 JS/CSS”的错觉（本批真实浏览器验证时
        # 实际撞上：新增装扮部件被浏览器缓存挡掉，需绕过缓存才可见）。no-cache
        # 比 no-store 更省流量（未改动仍走 304），且彻底消除陈旧文件错觉。
        # /version.json 已在 _send_version_json 里显式 no-store，这里跳过避免重复头。
        if self._requested_path() != '/version.json':
            self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def log_message(self, fmt, *args):
        return

    def log_error(self, fmt, *args):
        return

    def version_string(self):
        return 'odin-zh-study-server'


def parse_args(argv):
    port = DEFAULT_PORT
    open_browser = True
    for arg in argv:
        if arg == '--no-browser':
            open_browser = False
        elif arg.isdigit():
            port = int(arg)
        else:
            say(f'忽略无法识别的参数：{arg}')
    if not 1 <= port <= 65535:
        say(f'端口号 {port} 不在 1–65535 范围内，改用默认端口 {DEFAULT_PORT}。')
        port = DEFAULT_PORT
    return port, open_browser


def port_in_use(host, port):
    """只做只读探测，不结束任何进程。"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        probe.settimeout(0.5)
        return probe.connect_ex((host, port)) == 0


def probe_existing_service(port):
    """端口被占用时，只读探测对方是不是本站（GET /version.json，1.5 秒超时）。

    识别依据是 version.js 里的 app 标识 + 非空 version 字段。旧版本服务没有
    /version.json（404）、其它程序不会返回本站格式的 JSON——都识别不了，
    按“未知程序”的既有提示处理。只发这一个只读请求，绝不杀进程。"""
    expected_app = (read_product_version() or {}).get('app', 'the-odin-project-zh')
    # 发布准备轮改名：改名前启动的旧服务仍上报历史 app 标识 'odin-foundations-zh'。
    # 识别范围同时接受新旧两个标识，保证「端口上是本站旧服务」的友好提示
    # 不因改名退化成「未知程序」。
    accepted_apps = {expected_app, 'odin-foundations-zh'}
    try:
        with urllib.request.urlopen(f'http://127.0.0.1:{port}/version.json', timeout=1.5) as response:
            payload = json.loads(response.read().decode('utf-8', errors='replace'))
        if isinstance(payload, dict) and payload.get('app') in accepted_apps and payload.get('version'):
            return payload
    except Exception:
        pass
    return None


def explain_port_conflict(port, url, remote=None):
    say('')
    say(f'[无法启动] 端口 {port} 已经被本机上的另一个程序占用。')
    if remote:
        # v4.5（交接 A3）：识别出对方是本站旧服务时，把两边的版本摆在一起说清楚——
        # 用户实际踩过“旧服务还在跑，浏览器打开的是旧页面却以为代码没更新”的坑。
        current = read_product_version() or {}
        remote_name = f"{remote.get('product') or 'Odin 中文学习站'} v{remote.get('version')}"
        say('')
        say(f'已识别：该端口正在运行本站 {remote_name}。')
        if current.get('version'):
            say(f"你当前目录是 {current['product']} v{current['version']}。")
            if remote.get('version') != current['version']:
                say('两边版本不一致：请先关闭旧的服务窗口，再重新运行 start.bat；')
                say('否则浏览器打开的仍是旧版本的页面。')
        else:
            say('当前目录的 version.js 缺失或无法解析，无法比对版本；')
            say('请先关闭旧的服务窗口，再重新运行 start.bat。')
    say('')
    say('最常见的原因是：上一次的学习服务窗口还开着。')
    say('请先找到那个窗口并关闭它，然后重新运行 start.bat。')
    say('')
    say(f'如果 {url} 现在就能正常打开本站，说明服务其实已经在运行，')
    say('直接用浏览器访问它就可以，不需要再启动一次。')
    say('')
    say(f'也可以换一个端口启动，例如：python serve.py {port + 1}')
    say('')
    say(f'注意：学习进度保存在浏览器里，与打开地址绑定。{port + 1} 端口与')
    say(f'{port} 端口是两个不同的存储空间，换端口打开会看到一份全新的空进度；')
    say('原来的进度还在原来的地址里，用导出/导入学习档案可以搬过去。')
    say('')
    say('本脚本不会去结束其他程序：占用端口的进程可能是你正在使用的其他软件，')
    say('由你自己确认后再处理更安全。')
    say('')


def open_in_browser(url):
    """打开系统默认浏览器；失败时把地址交给用户手动复制。"""
    try:
        import webbrowser
        if webbrowser.open(url):
            return True
    except Exception:
        pass
    return False


def run_until_stopped(httpd):
    """前台运行服务，直到 Ctrl+C 或窗口被关闭。

    单独抽成函数是为了让停止路径可以被确定性测试：测试可以在另一个线程里调用
    httpd.shutdown()（这正是 Ctrl+C 之后发生的事情），然后断言监听端口已释放。
    finally 里的清理保证无论如何都不会留下孤儿监听。
    """
    try:
        httpd.serve_forever(poll_interval=0.3)
    except KeyboardInterrupt:
        say('')
        say('已收到 Ctrl+C，正在停止学习服务。')
    finally:
        # serve_forever 已经返回，这里的 shutdown() 只是补一次幂等调用；
        # 真正释放端口的是 server_close()。ThreadingHTTPServer 的
        # daemon_threads 为真，因此关闭时不会阻塞在残留的请求线程上。
        try:
            httpd.shutdown()
        except Exception:
            pass
        try:
            httpd.server_close()
        except Exception:
            pass
        say('学习服务已停止。现在可以关闭这个窗口。')
        say('')


def main(argv=None):
    prepare_stdout()
    port, want_browser = parse_args(list(sys.argv[1:] if argv is None else argv))
    url = f'http://{HOST}:{port}/'

    say('')
    say('==============================================')
    say('  Odin 中文学习站 · The Odin Project 中文学习辅助')
    say('==============================================')
    say('')

    if not os.path.isfile(os.path.join(ROOT, INDEX)):
        say(f'[无法启动] 在 {ROOT} 找不到 {INDEX}。')
        say('请确认 serve.py 与本站的 HTML / JS / CSS 文件放在同一个文件夹里。')
        say('')
        return 1

    # v4.5（交接 A2）：启动即亮明身份——服务目录 / 产品版本 / Git 分支与提交。
    # 用户实际踩过“旧服务在跑、浏览器开的是旧页面”的坑；控制台与页面 footer、
    # 「关于本站」三处版本同源（version.js），一眼可对。Git 信息只读解析 .git
    # 文件，读不到就显示（不可用），绝不影响服务启动。
    version = read_product_version()
    if version:
        say(f'服务目录：{ROOT}')
        say(f"产品版本：{version['product']} v{version['version']}")
    else:
        say(f'服务目录：{ROOT}')
        say('产品版本：未知（version.js 缺失或无法解析，不影响使用）')
    branch, sha = read_git_info()
    say(f'Git 分支：{branch or "（不可用）"}')
    say(f'Git 提交：{sha or "（不可用）"}')
    say('')

    if port_in_use(HOST, port):
        explain_port_conflict(port, url, probe_existing_service(port))
        return 1

    handler = functools.partial(QuietHandler)
    try:
        httpd = http.server.ThreadingHTTPServer((HOST, port), handler)
    except OSError as error:
        say(f'[无法启动] 绑定 {HOST}:{port} 失败：{error}')
        say('')
        explain_port_conflict(port, url, probe_existing_service(port))
        return 1

    # 绑定成功后再打开浏览器，因此不需要任何“等服务起来”的延时。
    say(f'本机学习地址：{url}')
    say('只允许本机访问（127.0.0.1），同一网络里的其他设备打不开这个地址。')
    say('请始终用上面这个地址打开本站：localhost 与 127.0.0.1、或不同端口，')
    say('在浏览器里是不同的存储空间，混着用会看不到彼此的学习进度。')
    say('（用 localhost 地址打开时会自动跳回 127.0.0.1。）')
    say('')
    for line in RUNNING_LINES:
        say(line)
    say('')

    if want_browser:
        if open_in_browser(url):
            say('已尝试打开你的默认浏览器。')
        else:
            say('没能自动打开浏览器，请把上面这个地址复制到浏览器里打开。')
        say('')

    try:
        run_until_stopped(httpd)
    except Exception as error:
        say(f'[服务异常] {error}')
        return 1
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        # 关闭窗口或 Ctrl+C 属于正常结束，不打印堆栈。
        sys.exit(0)
