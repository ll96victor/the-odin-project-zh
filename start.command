#!/bin/sh
# macOS launcher: keep the service in this Terminal window, like start.bat.
# serve.py opens the default browser after it has bound the local port.

set -u

SCRIPT_DIR=$(CDPATH= cd "$(dirname "$0")" && pwd) || {
  printf '%s\n' '无法定位本站目录，请从项目文件夹中重新运行 start.command。'
  exit 1
}
cd "$SCRIPT_DIR" || exit 1

PYTHON=''
if command -v python3 >/dev/null 2>&1; then
  PYTHON='python3'
elif command -v python >/dev/null 2>&1; then
  PYTHON='python'
fi

if [ -z "$PYTHON" ]; then
  printf '%s\n' '=============================================='
  printf '%s\n' '  Odin 中文学习站 · The Odin Project 中文学习辅助'
  printf '%s\n' '=============================================='
  printf '\n%s\n' '[无法启动] macOS 上没有找到 Python 3。'
  printf '%s\n' '仍可以双击 index.html 阅读课程，但学习进度无法可靠保存。'
  printf '%s\n' '请从 https://www.python.org/ 安装 Python 3，然后再次运行 start.command。'
  if [ -t 0 ]; then
    printf '\n%s' '按回车关闭此窗口。'
    IFS= read -r _
  fi
  exit 1
fi

"$PYTHON" serve.py "$@"
RESULT=$?

# A successful Ctrl+C/close follows serve.py's normal exit path. Keep the
# Terminal readable only when startup or serving failed, matching start.bat.
if [ "$RESULT" -ne 0 ]; then
  printf '\n%s\n' "学习服务因错误停止（退出码 ${RESULT}）。请查看上面的提示。"
  if [ -t 0 ]; then
    printf '%s' '按回车关闭此窗口。'
    IFS= read -r _
  fi
fi

exit "$RESULT"
