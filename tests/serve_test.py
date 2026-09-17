#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""serve.py 与 start.bat 的静态检查 + 真实行为测试（对应 v4 交接 §7、§13 Server）。

只用 Python 标准库，不安装任何依赖。运行方式：
    python -X utf8 tests/serve_test.py

静态检查覆盖：只绑定 127.0.0.1、不安装依赖、不主动结束其他进程、
§7 要求的三行中文提示原文照录、start.bat 不再派生第二个服务窗口。

行为测试覆盖：真实启动 server 并取回首页 / 课页 / JS 文件（HTTP 200 且内容正确）、
端口被占用时明确报错且**不杀掉已在运行的那个服务**、Ctrl+C 能优雅停止、
停止后端口释放（不留孤儿进程）。
"""

import functools
import http.client
import http.server
import json
import os
import re
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVE = os.path.join(ROOT, 'serve.py')
START = os.path.join(ROOT, 'start.bat')
INDEX = os.path.join(ROOT, 'index.html')

REQUIRED_CONSOLE_LINES = (
    '学习服务正在运行。',
    '此窗口在学习期间需要保持打开。',
    '关闭此窗口或按 Ctrl+C 即停止服务。',
)

# 行为测试用独立端口，避免与用户真实学习时占用的 8765 互相干扰。
TEST_PORT = 8791

checks = 0
failures = []


def check(label, condition, detail=''):
    global checks
    checks += 1
    if not condition:
        failures.append(f'{label}{("：" + detail) if detail else ""}')
    return condition


def read(path, binary=False):
    mode = 'rb' if binary else 'r'
    kwargs = {} if binary else {'encoding': 'utf-8'}
    with open(path, mode, **kwargs) as handle:
        return handle.read()


def free_port(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        probe.settimeout(0.5)
        return probe.connect_ex(('127.0.0.1', port)) != 0


def fetch(port, path, timeout=6):
    """取回状态码与响应体；连接失败返回 (None, b'')。

    必须捕获 HTTPError：urllib 把 4xx/5xx 当异常抛出，否则“返回 404”这类
    断言会误判成连接失败。
    """
    try:
        with urllib.request.urlopen(f'http://127.0.0.1:{port}{path}', timeout=timeout) as response:
            return response.status, response.read()
    except urllib.error.HTTPError as error:
        try:
            return error.code, error.read()
        except Exception:
            return error.code, b''
    except Exception:
        return None, b''


def fetch_raw(port, path, timeout=6):
    """按原样发送请求路径，不做任何规范化。

    urllib 会先把 /../ 折叠掉，因此用它测路径穿越等于没测：请求根本没带 .. 出门。
    """
    try:
        conn = http.client.HTTPConnection('127.0.0.1', port, timeout=timeout)
        conn.request('GET', path)
        response = conn.getresponse()
        body = response.read()
        conn.close()
        return response.status, body
    except Exception:
        return None, b''


def fetch_headers(port, path, headers=None, timeout=6):
    """带自定义请求头取回 (状态码, 响应头 dict, 响应体)。

    v4.5 Batch 9：静态资源的 Cache-Control 与条件请求（If-Modified-Since → 304）
    都要看响应头，fetch/fetch_raw 只回状态码与正文，不够用。
    """
    try:
        conn = http.client.HTTPConnection('127.0.0.1', port, timeout=timeout)
        conn.request('GET', path, headers=headers or {})
        response = conn.getresponse()
        body = response.read()
        header_map = {k.lower(): v for k, v in response.getheaders()}
        conn.close()
        return response.status, header_map, body
    except Exception:
        return None, {}, b''


def fetch_with_host(port, path, host, timeout=6):
    """带着指定的 Host 头取回 (状态码, Location 头, 响应体)。

    v4.2 交接 §2 的 P0 根因：localhost 与 127.0.0.1 是两个不同的浏览器源，
    localStorage 互不相通。serve.py 把 localhost 请求 301 回 127.0.0.1，
    让两条入口收敛到同一个源。这里用自定义 Host 头复刻用户手输
    localhost 地址时浏览器发出的请求。
    """
    try:
        conn = http.client.HTTPConnection('127.0.0.1', port, timeout=timeout)
        conn.request('GET', path, headers={'Host': host})
        response = conn.getresponse()
        body = response.read()
        location = response.getheader('Location')
        conn.close()
        return response.status, location, body
    except Exception:
        return None, None, b''


# ---------------------------------------------------------------- 静态检查

def static_checks():
    serve = read(SERVE)
    bat_raw = read(START, binary=True)
    bat = bat_raw.decode('ascii', errors='replace')

    # §13：serve.py 只绑定 127.0.0.1
    check('serve.py 绑定 127.0.0.1', "HOST = '127.0.0.1'" in serve)
    check('serve.py 不出现 0.0.0.0（不监听局域网）', '0.0.0.0' not in serve)
    check('serve.py 默认端口为 8765', 'DEFAULT_PORT = 8765' in serve)
    check('serve.py 以服务目录为站点根，不依赖当前工作目录', 'directory=ROOT' in serve
          and 'ROOT = os.path.dirname(os.path.abspath(__file__))' in serve)

    # §13：不安装依赖；只用标准库
    check('serve.py 不含 pip / install / requirements', not re.search(r'pip\s+install|pip3|requirements\.txt|easy_install', serve))
    imports = set()
    for match in re.finditer(r'^\s*(?:import|from)\s+([A-Za-z_][A-Za-z0-9_]*)', serve, re.M):
        imports.add(match.group(1))
    stdlib = getattr(sys, 'stdlib_module_names', frozenset())
    non_stdlib = sorted(name for name in imports if stdlib and name not in stdlib)
    check('serve.py 只导入标准库', not non_stdlib, f'非标准库导入 {non_stdlib}')
    check('serve.py 无第三方 HTTP 框架', not re.search(r'\bflask\b|\bdjango\b|\btornado\b|\baiohttp\b|\bfastapi\b', serve, re.I))

    # §7：不主动结束其他进程
    check('serve.py 不调用 taskkill / os.kill / terminate / psutil',
          not re.search(r'taskkill|os\.kill|psutil|\.terminate\(|kill\s*/F', serve))
    check('serve.py 不用 subprocess 派生其他程序', 'subprocess' not in serve)

    # §7：前台运行，Ctrl+C 与关窗都能停
    check('serve.py 前台 serve_forever', 'serve_forever' in serve)
    check('serve.py 处理 KeyboardInterrupt', 'KeyboardInterrupt' in serve)
    check('serve.py 结束时主动关闭 server', 'server_close()' in serve and 'shutdown()' in serve)
    check('serve.py 不在后台派生自身（无 start /min 式写法）', 'CREATE_NO_WINDOW' not in serve
          and 'DETACHED_PROCESS' not in serve)
    # 先绑定再开浏览器，因此不需要延时等待。
    # 注意要找**调用点**而不是函数定义：'def open_in_browser(url):' 里也含有
    # 'open_in_browser(url' 这个子串，直接 find 会匹配到定义而得出相反结论。
    bind_at = serve.find('ThreadingHTTPServer((HOST, port)')
    browser_at = serve.find('if open_in_browser(url):')
    check('serve.py 先绑定端口再打开浏览器（无需延时 hack）',
          0 < bind_at < browser_at, f'bind@{bind_at} browser@{browser_at}')
    check('serve.py 不使用 ping / sleep 延时等浏览器', not re.search(r'\bping\b|time\.sleep', serve))
    # 停止路径抽成独立函数，才能被确定性测试（见 shutdown_path_checks）
    check('serve.py 把停止路径抽成 run_until_stopped', 'def run_until_stopped(httpd):' in serve
          and 'run_until_stopped(httpd)' in serve)

    # §7：三行控制台提示原文照录
    for line in REQUIRED_CONSOLE_LINES:
        check(f'serve.py 控制台提示含「{line}」', line in serve)

    # 端口占用时给中文提示
    check('serve.py 端口占用有中文说明', '已经被本机上的另一个程序占用' in serve)
    check('serve.py 端口占用时说明不会结束其他程序', '不会去结束其他程序' in serve)
    # v4.2 P0：换端口的建议必须同时警告数据隔离，否则用户照做后会
    # 看到一份空进度并误以为数据丢了。
    check('serve.py 建议换端口时警告进度与地址绑定', '与打开地址绑定' in serve)
    check('serve.py 说明换端口是不同的存储空间', '两个不同的存储空间' in serve)
    check('serve.py 抑制逐条访问日志（避免淹没说明）', 'def log_message' in serve)
    # 编码：交互控制台走 Python 原生 Unicode 通道，重定向时切 UTF-8
    check('serve.py 只在非 tty 时改 stdout 编码', 'isatty()' in serve and "encoding='utf-8'" in serve)

    # v4.5（交接 A2/A3）：版本身份单一事实源与旧服务识别
    version_js_path = os.path.join(ROOT, 'version.js')
    check('version.js 存在（版本身份单一事实源）', os.path.isfile(version_js_path))
    if os.path.isfile(version_js_path):
        version_js = read(version_js_path)
        check('version.js 含 app 标识', re.search(r"app:\s*'the-odin-project-zh'", version_js) is not None)
        check('version.js 含 product 与 version 字段',
              re.search(r"product:\s*'[^']+'", version_js) is not None
              and re.search(r"version:\s*'[^']+'", version_js) is not None)
    check('serve.py 从 version.js 读版本（不另立事实源）',
          'version.js' in serve and 'read_product_version' in serve)
    check('serve.py 不硬编码产品版本字符串（注释里的版本标注除外）',
          "'4.5'" not in serve and '"4.5"' not in serve)
    check('serve.py 提供 /version.json 只读端点', '/version.json' in serve)
    check('serve.py 静态资源加 Cache-Control: no-cache（杜绝陈旧文件错觉）',
          'def end_headers' in serve and 'no-cache' in serve)
    check('serve.py 旧服务识别只做只读 HTTP 探测',
          'probe_existing_service' in serve and 'urlopen' in serve)
    check('serve.py 的 Git 信息为纯文件解析（无外部进程）',
          'read_git_info' in serve and "'.git'" in serve)
    check('serve.py 启动打印服务目录', '服务目录：' in serve)
    check('serve.py 启动打印产品版本', '产品版本：' in serve)
    check('serve.py 启动打印 Git 分支与提交', 'Git 分支：' in serve and 'Git 提交：' in serve)
    check('serve.py 识别旧服务时提示先关旧窗口', '请先关闭旧的服务窗口' in serve)

    # §7 / §13：start.bat 不再产生第二个需要用户理解的服务窗口。
    # 必须先剥掉 rem 注释行再检查：注释里为了说明“为什么不再这么做”会照录
    # start /min、http.server、taskkill、ping 这些字样，直接匹配会把自己的
    # 解释性注释判成违规（v3 就踩过同一类坑）。
    code_lines = [line for line in bat.split('\n')
                  if not line.strip().lower().startswith('rem') and not line.strip().startswith('::')]
    code = '\n'.join(code_lines)
    check('start.bat 的可执行行已剥离注释后再检查', len(code_lines) < len(bat.split('\n')))
    check('start.bat 不再用 start /min 派生服务窗口',
          not re.search(r'\bstart\b\s+.*?/min', code) and '/min' not in code)
    check('start.bat 不再直接调用 python -m http.server', 'http.server' not in code)
    check('start.bat 不再用 taskkill 收尾', 'taskkill' not in code)
    check('start.bat 不再需要 ping 延时', not re.search(r'\bping\b', code))
    check('start.bat 调用 serve.py', 'serve.py' in code)
    check('start.bat 前台调用 python serve.py', re.search(r'^\s*python serve\.py\s*$', code, re.M) is not None)
    check('start.bat 前台调用 py -3 serve.py 作为回退', re.search(r'^\s*py -3 serve\.py\s*$', code, re.M) is not None)
    check('start.bat 切换到脚本所在目录', 'cd /d "%~dp0"' in code)
    check('start.bat 检测 python', 'where python' in code)
    check('start.bat 检测 py 启动器', 'where py' in code)

    # 无 Python 时的降级提示（§7：仍可双击 index.html 阅读，但进度无法可靠保存）
    check('start.bat 无 Python 时提到 index.html', 'index.html' in bat)
    check('start.bat 无 Python 时说明进度不会可靠保存', 'not be saved reliably' in bat)
    check('start.bat 无 Python 时给出安装指引', 'python.org' in bat)
    check('start.bat 失败时 pause 保留可读信息', 'pause' in bat)

    # start.bat 保持纯 ASCII：cmd 以 OEM 代码页读取 .bat，UTF-8 中文会乱码
    non_ascii = [(i + 1, line) for i, line in enumerate(bat.split('\n'))
                 if any(ord(ch) > 126 and ch != '\r' for ch in line)]
    check('start.bat 为纯 ASCII（避免 GBK 代码页下中文乱码）', not non_ascii, f'非 ASCII 行 {non_ascii[:3]}')

    # .bat 必须 CRLF，否则 goto 标签在部分环境下解析异常
    crlf = bat_raw.count(b'\r\n')
    total = bat_raw.count(b'\n')
    check('start.bat 全部使用 CRLF 行尾', crlf == total and total > 0, f'CRLF={crlf} 总换行={total}')
    gitattributes = read(os.path.join(ROOT, '.gitattributes'))
    check('.gitattributes 固定 start.bat 为 CRLF', 'start.bat text eol=crlf' in gitattributes)

    # goto 标签与跳转必须一一配对（批处理最容易出的静默错误）。
    # 同样只看剥掉注释后的可执行行，否则注释里的“goto labels”会被当成跳转目标。
    labels = set(re.findall(r'^:([A-Za-z_][A-Za-z0-9_]*)', code, re.M))
    gotos = set(m.lower() for m in re.findall(r'\bgoto\s+([A-Za-z_][A-Za-z0-9_]*)', code, re.I))
    check('start.bat 每个 goto 都有对应标签', gotos <= {l.lower() for l in labels},
          f'缺标签 {sorted(gotos - {l.lower() for l in labels})}，现有标签 {sorted(labels)}')
    check('start.bat 存在 no_python 降级分支', 'no_python' in labels)


# ---------------------------------------------------------------- 行为测试

def behaviour_checks():
    if not free_port(TEST_PORT):
        failures.append(f'测试端口 {TEST_PORT} 已被占用，无法做行为测试（不是 serve.py 的问题）')
        return

    index_bytes = read(INDEX, binary=True)
    proc = subprocess.Popen(
        [sys.executable, SERVE, str(TEST_PORT), '--no-browser'],
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
        creationflags=getattr(subprocess, 'CREATE_NEW_PROCESS_GROUP', 0),
    )
    output = b''
    try:
        # 等服务起来（最多 12 秒）
        status = None
        for _ in range(120):
            if proc.poll() is not None:
                output = proc.stdout.read()
                break
            status, body = fetch(TEST_PORT, '/')
            if status == 200:
                break
            time.sleep(0.1)

        check('serve.py 能真实启动并监听测试端口', status == 200, f'最后状态 {status}')
        if status == 200:
            check('首页内容与磁盘上的 index.html 逐字节一致', body == index_bytes,
                  f'取回 {len(body)} 字节，磁盘 {len(index_bytes)} 字节')

            for path in ['/lesson.html', '/lessons.js', '/progress.js', '/app.js',
                         '/external-resources.js', '/style.css', '/tokens.css', '/version.js']:
                code, payload = fetch(TEST_PORT, path)
                check(f'{path} 返回 200', code == 200, f'实际 {code}')
                if code == 200:
                    on_disk = read(os.path.join(ROOT, path.lstrip('/')), binary=True)
                    check(f'{path} 内容与磁盘一致', payload == on_disk)

            # v4.5（交接 A3）：/version.json 动态端点——与磁盘 version.js 同事实源
            code, payload = fetch(TEST_PORT, '/version.json')
            check('/version.json 返回 200', code == 200, f'实际 {code}')
            if code == 200:
                info = json.loads(payload.decode('utf-8'))
                version_js = read(os.path.join(ROOT, 'version.js'))
                vm = re.search(r"version:\s*'([^']+)'", version_js)
                pm = re.search(r"product:\s*'([^']+)'", version_js)
                check('/version.json 的 app 标识可用于旧服务识别',
                      info.get('app') == 'the-odin-project-zh', f'实际 {info.get("app")}')
                check('/version.json 的 version 与 version.js 一致',
                      info.get('version') == (vm.group(1) if vm else None))
                check('/version.json 的 product 与 version.js 一致',
                      info.get('product') == (pm.group(1) if pm else None))
            code, _ = fetch(TEST_PORT, '/version.json?probe=1')
            check('/version.json 带查询串同样命中（探测方拼参不出错）', code == 200, f'实际 {code}')

            # v4.5 Batch 9：静态资源统一 Cache-Control: no-cache——浏览器必须带
            # If-Modified-Since 回源校验（未改动 304、有改动 200），杜绝「升级了
            # 代码、刷新页面仍是旧 JS/CSS」的启发式缓存错觉（本批真实浏览器验证
            # 时实际撞上）；/version.json 是动态端点，保持 no-store 不被覆盖。
            code, hdrs, _ = fetch_headers(TEST_PORT, '/app.js')
            check('静态 .js 带 Cache-Control: no-cache（必须回源校验）',
                  code == 200 and hdrs.get('cache-control') == 'no-cache',
                  f'实际 {code} cache-control={hdrs.get("cache-control")}')
            code, hdrs_css, _ = fetch_headers(TEST_PORT, '/style.css')
            check('静态 .css 同样带 no-cache', code == 200 and hdrs_css.get('cache-control') == 'no-cache')
            code, hdrs_vj, _ = fetch_headers(TEST_PORT, '/version.json')
            check('/version.json 仍是 no-store（动态端点不被静态 no-cache 覆盖）',
                  code == 200 and hdrs_vj.get('cache-control') == 'no-store',
                  f'实际 cache-control={hdrs_vj.get("cache-control")}')
            last_modified = hdrs.get('last-modified')
            check('静态 .js 带 Last-Modified（条件请求的校验依据）', bool(last_modified))
            if last_modified:
                code304, _, body304 = fetch_headers(TEST_PORT, '/app.js', {'If-Modified-Since': last_modified})
                check('未改动文件带 If-Modified-Since 回源得 304 且不重传正文（no-cache 比 no-store 省流量）',
                      code304 == 304 and len(body304) == 0, f'实际 {code304}')

            code, _ = fetch(TEST_PORT, '/definitely-missing-file.txt')
            check('不存在的文件返回 404 而不是崩溃', code == 404, f'实际 {code}')

            # v4.2 P0 修复：localhost 请求 301 收敛到 127.0.0.1，防止
            # “localhost 与 127.0.0.1 各存一份进度、另一边永远 0/46”。
            code, location, _ = fetch_with_host(TEST_PORT, '/', f'localhost:{TEST_PORT}')
            check('Host 为 localhost 的请求被 301 重定向', code == 301, f'实际 {code}')
            check('重定向目标收敛到 127.0.0.1',
                  location == f'http://127.0.0.1:{TEST_PORT}/', f'实际 {location}')
            code, location, _ = fetch_with_host(TEST_PORT, '/lesson.html?id=git-basics',
                                                f'localhost:{TEST_PORT}')
            check('localhost 重定向保留路径与查询串',
                  code == 301 and location == f'http://127.0.0.1:{TEST_PORT}/lesson.html?id=git-basics',
                  f'实际 {code} {location}')
            code, location, _ = fetch_with_host(TEST_PORT, '/', f'[::1]:{TEST_PORT}')
            check('Host 为 [::1] 的请求同样收敛到 127.0.0.1',
                  code == 301 and location == f'http://127.0.0.1:{TEST_PORT}/',
                  f'实际 {code} {location}')
            # 正常的 127.0.0.1 Host 不受影响
            code, location, _ = fetch_with_host(TEST_PORT, '/', f'127.0.0.1:{TEST_PORT}')
            check('Host 为 127.0.0.1 的请求不受重定向影响', code == 200 and location is None,
                  f'实际 {code} {location}')
            # 路径穿越的判据必须是“站点根**之外**的文件有没有被读出来”。
            # 不能拿 serve.py 当判据——它本身就在站点根内，handler 把 /../serve.py
            # 折叠成 /serve.py 后返回 200 是正确行为，不是逃逸。
            outside = os.path.join(os.path.dirname(ROOT), '.gitignore')
            outside_bytes = read(outside, binary=True) if os.path.isfile(outside) else b'\x00never-match\x00'
            check('测试判据有效：站点根之外确实存在可比对的文件', len(outside_bytes) > 5)
            for evil in ['/../.gitignore', '/..%2f.gitignore', '/%2e%2e/.gitignore',
                         '/../../.gitignore', '/..\\..\\.gitignore']:
                code, body = fetch_raw(TEST_PORT, evil)
                check(f'路径穿越 {evil} 没有读出站点根之外的文件',
                      body != outside_bytes and b'.tmpfiles/' not in body,
                      f'状态 {code}，响应 {len(body)} 字节')
            # 折叠后落在根内的请求属于正常静态服务：确认 server 没有因为 .. 而崩溃
            code, body = fetch_raw(TEST_PORT, '/../index.html')
            check('含 .. 的请求被折叠到站点根而不是报错', code == 200 and body == index_bytes,
                  f'状态 {code}')

        # §7 / §13：端口被占用时明确报错，且不杀掉已在运行的那个服务
        second = subprocess.run(
            [sys.executable, SERVE, str(TEST_PORT), '--no-browser'],
            stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=30,
        )
        second_text = second.stdout.decode('utf-8', errors='replace')
        check('端口被占用时以非零码退出', second.returncode != 0, f'实际 {second.returncode}')
        check('端口被占用时给出中文说明', '已经被本机上的另一个程序占用' in second_text)
        check('端口被占用时说明如何自查', '上一次的学习服务窗口还开着' in second_text)
        check('端口被占用时声明不会结束其他程序', '不会去结束其他程序' in second_text)
        check('端口被占用时给出换端口的办法', '换一个端口启动' in second_text)
        still_status, _ = fetch(TEST_PORT, '/')
        check('端口冲突后原服务仍在运行（未被杀掉）', still_status == 200, f'实际 {still_status}')
        check('第二个进程没有留下监听', second.returncode != 0)

        # 子进程的结束方式：Windows 上把 CTRL_BREAK_EVENT 投给一个 stdout 被重定向、
        # 且没有真实控制台的子进程，得到的是 STATUS_CONTROL_C_EXIT(0xC000013A) 而不是
        # Python 的 KeyboardInterrupt 路径——那测的是控制台子系统，不是 serve.py 的逻辑。
        # 因此这里按“关闭窗口”的真实语义直接结束进程，只断言用户可见的保证：
        # 进程结束后端口立即释放、不留孤儿监听。优雅停止路径另由
        # shutdown_path_checks() 在同进程内确定性验证。
        try:
            proc.terminate()
            output = proc.communicate(timeout=15)[0]
        except Exception:
            output = b''
        text = output.decode('utf-8', errors='replace')

        check('启动提示包含 §7 要求的三行原文',
              all(line in text for line in REQUIRED_CONSOLE_LINES),
              f'实际输出前 400 字：{text[:400]!r}')
        check('启动提示给出本机学习地址', f'http://127.0.0.1:{TEST_PORT}/' in text)
        check('启动提示说明只允许本机访问', '只允许本机访问' in text)
        check('启动提示说明服务目录与本站一致', 'Odin 中文学习站' in text)
        # v4.5（交接 A2）：启动即亮明身份
        check('启动提示打印服务目录绝对路径', f'服务目录：{ROOT}' in text, f'实际输出前 400 字：{text[:400]!r}')
        check('启动提示打印产品版本（Odin 中文学习站 vX.Y）',
              re.search(r'产品版本：Odin 中文学习站 v\d+\.\d+', text) is not None)
        check('启动提示打印 Git 分支（值或优雅降级）', 'Git 分支：' in text)
        check('启动提示打印 Git 提交（值或优雅降级）', 'Git 提交：' in text)
        check('--no-browser 时不声称已打开浏览器', '已尝试打开你的默认浏览器' not in text)
        check('启动输出中没有 Python 堆栈', 'Traceback' not in text)
        check('没有逐条访问日志淹没说明文字', text.count('127.0.0.1 - -') == 0)

        # §13：停止后不残留本任务启动的 server 进程
        released = False
        for _ in range(50):
            if free_port(TEST_PORT):
                released = True
                break
            time.sleep(0.1)
        check('进程结束后端口已释放（无孤儿监听）', released)
        check('子进程已结束', proc.poll() is not None, f'poll={proc.poll()}')
    finally:
        if proc.poll() is None:
            try:
                proc.terminate()
                proc.communicate(timeout=10)
            except Exception:
                pass
        # 兜底：即使断言失败也不能把测试服务留在后台
        for _ in range(30):
            if free_port(TEST_PORT):
                break
            time.sleep(0.1)
        if not free_port(TEST_PORT):
            failures.append(f'测试结束后端口 {TEST_PORT} 仍被占用，请手工检查是否有残留进程')


def load_serve_module():
    """把 serve.py 当模块导入，以便在同进程内确定性验证停止路径。"""
    import importlib.util
    spec = importlib.util.spec_from_file_location('odin_serve', SERVE)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def shutdown_path_checks():
    """§7「Ctrl+C 即可结束 server」的确定性验证。

    在真实控制台里按 Ctrl+C 会触发 KeyboardInterrupt，随后进入 run_until_stopped
    的 finally 做 shutdown() + server_close()。跨进程投递控制台信号在无控制台的
    管道环境下不可复现，因此这里直接调用 httpd.shutdown()——这正是 Ctrl+C 之后
    发生的同一件事——然后断言监听端口被释放、且打印了停止说明。
    """
    import io as _io
    import threading
    import contextlib

    port = TEST_PORT + 1
    if not free_port(port):
        failures.append(f'端口 {port} 被占用，跳过停止路径测试')
        return

    serve = load_serve_module()
    check('serve.py 可作为模块导入（无 import 期副作用）', hasattr(serve, 'run_until_stopped'))

    httpd = http.server.ThreadingHTTPServer(
        (serve.HOST, port), functools.partial(serve.QuietHandler))
    captured = _io.StringIO()

    def run_capturing():
        # redirect_stdout 是上下文管理器，且 sys.stdout 是进程级全局的：
        # 这里只在 worker 线程运行期间改写，主线程在此期间不打印任何东西，
        # 全部输出都留到 worker.join() 之后，因此不会丢测试自身的输出。
        with contextlib.redirect_stdout(captured):
            serve.run_until_stopped(httpd)

    worker = threading.Thread(target=run_capturing, daemon=True)
    worker.start()

    # 确认它真的在服务
    served = False
    for _ in range(60):
        code, _ = fetch(port, '/')
        if code == 200:
            served = True
            break
        time.sleep(0.1)
    check('停止路径测试：服务确实起来了', served)

    httpd.shutdown()          # 等价于 Ctrl+C 之后发生的事
    worker.join(timeout=15)
    text = captured.getvalue()

    check('shutdown() 后 run_until_stopped 正常返回（线程已结束）', not worker.is_alive())
    check('停止后打印「学习服务已停止」', '学习服务已停止' in text, f'实际输出 {text[-200:]!r}')
    check('停止后提示可以关闭窗口', '现在可以关闭这个窗口' in text)

    released = False
    for _ in range(50):
        if free_port(port):
            released = True
            break
        time.sleep(0.1)
    check('优雅停止后监听端口已释放（不留孤儿监听）', released)

    code, _ = fetch(port, '/')
    check('停止后不再响应请求', code is None, f'实际 {code}')


def old_service_detection_checks():
    """v4.5（交接 A3）：端口被占用时识别对方是不是本站旧服务。

    用户真实踩坑：旧服务还在跑，浏览器打开的是旧版本页面，控制台只说“端口被占用”，
    不知道对方是谁。这里起两个假服务分别验证“能识别”与“识别不了”的路径，
    并断言两条路径都绝不结束对方进程。"""
    import threading

    port = TEST_PORT + 2
    if not free_port(port):
        failures.append(f'端口 {port} 被占用，跳过旧服务识别测试')
        return

    version_js = read(os.path.join(ROOT, 'version.js'))
    current = re.search(r"version:\s*'([^']+)'", version_js)
    check('当前 version.js 可解析出版本号', current is not None)
    current_version = current.group(1) if current else None

    class OldSiteHandler(http.server.BaseHTTPRequestHandler):
        """假装是一个跑着旧版本（v4.4）的本站服务。

        刻意使用改名前的历史 app 标识 'odin-foundations-zh' 与旧品牌名：
        验证 serve.py 的双标识识别——改名前启动的旧服务仍要被认出来，
        而不是退化成「未知程序」。"""

        def do_GET(self):
            if self.path.split('?')[0] == '/version.json':
                payload = json.dumps({
                    'app': 'odin-foundations-zh',
                    'product': 'Learning Garden',
                    'version': '4.4',
                }).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(payload)))
                self.end_headers()
                self.wfile.write(payload)
            else:
                self.send_response(404)
                self.send_header('Content-Length', '0')
                self.end_headers()

        def log_message(self, *args):
            return

    httpd = http.server.ThreadingHTTPServer(('127.0.0.1', port), OldSiteHandler)
    worker = threading.Thread(target=httpd.serve_forever, daemon=True)
    worker.start()
    try:
        result = subprocess.run(
            [sys.executable, SERVE, str(port), '--no-browser'],
            stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=30,
        )
        text = result.stdout.decode('utf-8', errors='replace')
        check('识别到旧服务时仍以非零码退出（不抢端口）', result.returncode != 0)
        check('明确说出该端口正在运行本站', '该端口正在运行本站' in text, f'实际输出前 300 字：{text[:300]!r}')
        check('给出旧服务的版本 v4.4', 'v4.4' in text)
        check('给出当前目录的版本', f'你当前目录是 Odin 中文学习站 v{current_version}' in text)
        check('版本不一致时提示先关旧窗口再重启', '请先关闭旧的服务窗口' in text)
        check('保留通用占用说明', '已经被本机上的另一个程序占用' in text)
        check('声明不会结束其他程序', '不会去结束其他程序' in text)
        still, _ = fetch(port, '/version.json')
        check('识别后旧服务仍在运行（绝不杀进程）', still == 200, f'实际 {still}')
    finally:
        httpd.shutdown()
        httpd.server_close()
        worker.join(timeout=10)

    class UnknownHandler(http.server.BaseHTTPRequestHandler):
        """假装是 v4.4 之前的旧服务（没有 /version.json）或任意其它程序。"""

        def do_GET(self):
            self.send_response(404)
            self.send_header('Content-Length', '0')
            self.end_headers()

        def log_message(self, *args):
            return

    httpd2 = http.server.ThreadingHTTPServer(('127.0.0.1', port), UnknownHandler)
    worker2 = threading.Thread(target=httpd2.serve_forever, daemon=True)
    worker2.start()
    try:
        result = subprocess.run(
            [sys.executable, SERVE, str(port), '--no-browser'],
            stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=30,
        )
        text = result.stdout.decode('utf-8', errors='replace')
        check('无法识别时仍以非零码退出', result.returncode != 0)
        check('无法识别时不谎称已识别本站', '已识别' not in text and '该端口正在运行本站' not in text)
        check('无法识别时回退通用占用提示', '已经被本机上的另一个程序占用' in text)
        check('无法识别时也不结束其他程序', '不会去结束其他程序' in text)
        still, _ = fetch(port, '/')
        check('无法识别路径对方程序仍在运行', still == 404, f'实际 {still}')
    finally:
        httpd2.shutdown()
        httpd2.server_close()
        worker2.join(timeout=10)


def git_info_checks():
    """v4.5（交接 A2）：serve.py 的 Git 信息纯文件解析正确性 + 优雅降级。

    期望值用 git 命令独立读取——测试端允许 subprocess（红线只约束 serve.py
    本体不派生进程）。环境里没有 git 或处于 detached HEAD 时跳过对比。"""
    import tempfile

    serve = load_serve_module()

    try:
        expected_branch = subprocess.run(
            ['git', 'rev-parse', '--abbrev-ref', 'HEAD'],
            cwd=ROOT, capture_output=True, timeout=10).stdout.decode('utf-8', errors='replace').strip()
        expected_sha = subprocess.run(
            ['git', 'rev-parse', '--short=7', 'HEAD'],
            cwd=ROOT, capture_output=True, timeout=10).stdout.decode('utf-8', errors='replace').strip()
    except Exception:
        expected_branch = expected_sha = ''

    branch, sha = serve.read_git_info()
    if expected_branch and expected_branch != 'HEAD' and expected_sha:
        check('read_git_info 分支与 git 命令一致（分支名中的斜杠完整保留）',
              branch == expected_branch, f'解析={branch} 期望={expected_branch}')
        check('read_git_info short sha 与 git 命令一致',
              sha == expected_sha, f'解析={sha} 期望={expected_sha}')
    else:
        check('git 不可用/detached 时 read_git_info 不抛异常', True)

    # 优雅降级：version.js 缺失 → None（启动打印走「未知」分支，服务照常起）
    original = serve.VERSION_JS
    try:
        serve.VERSION_JS = os.path.join(ROOT, 'definitely-missing-version.js')
        check('version.js 缺失时 read_product_version 返回 None（优雅降级）',
              serve.read_product_version() is None)
    finally:
        serve.VERSION_JS = original
    check('version.js 存在时 read_product_version 返回完整信息',
          isinstance(serve.read_product_version(), dict)
          and serve.read_product_version().get('app') == 'the-odin-project-zh')

    # 优雅降级：worktree 的 gitdir 指针损坏 → None，而不是抛异常
    with tempfile.TemporaryDirectory() as tmp:
        with open(os.path.join(tmp, '.git'), 'w', encoding='utf-8') as handle:
            handle.write('gitdir: /definitely/not/here\n')
        check('gitdir 指针损坏时 find_git_dir 返回 None（服务不受影响）',
              serve.find_git_dir(tmp) is None)
        os.remove(os.path.join(tmp, '.git'))
        # 普通目录（无 .git，且此处不向上遍历到真实仓库——tmp 根下无 .git 时
        # find_git_dir 会继续向上，Windows 临时目录的祖先没有 .git 才成立；
        # 因此这里只在确认祖先无 .git 时断言）
        probe = tmp
        ancestor_git = False
        while True:
            if os.path.exists(os.path.join(probe, '.git')):
                ancestor_git = True
                break
            parent = os.path.dirname(probe)
            if parent == probe:
                break
            probe = parent
        if not ancestor_git:
            check('无 .git 的目录返回 None（非 git 环境优雅降级）',
                  serve.find_git_dir(tmp) is None)


def main():
    static_checks()
    behaviour_checks()
    shutdown_path_checks()
    old_service_detection_checks()
    git_info_checks()

    print(f'已执行 {checks} 项检查')
    if failures:
        print('\n失败项：')
        for item in failures:
            print('  X ' + item)
        print('\nSERVE TEST FAILED')
        return 1
    print('\nSERVE TEST PASSED（静态检查 + 真实启动/取回/端口冲突/Ctrl+C 停止/端口释放）')
    return 0


if __name__ == '__main__':
    sys.exit(main())
