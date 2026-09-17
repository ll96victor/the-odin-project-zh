@echo off
setlocal
cd /d "%~dp0"

rem All Chinese wording is printed by serve.py, which writes Unicode through the
rem Windows console API. This batch file stays ASCII-only on purpose: cmd reads
rem .bat bytes under the OEM code page (GBK on Simplified Chinese Windows), so
rem UTF-8 Chinese inside an echo line would turn into mojibake.

where python >nul 2>nul
if not errorlevel 1 goto use_python
where py >nul 2>nul
if not errorlevel 1 goto use_py
goto no_python

:use_python
rem Foreground call, deliberately NOT "start /min": this window IS the server
rem window, so closing it or pressing Ctrl+C stops the server directly and
rem cannot leave an orphan python process behind.
python serve.py
goto done

:use_py
py -3 serve.py
goto done

:no_python
echo ==============================================
echo  The Odin Project Chinese Learning Companion
echo ==============================================
echo.
echo [ERROR] Python was not found on this computer.
echo.
echo You can still double-click index.html to read every lesson,
echo but your study progress will not be saved reliably.
echo.
echo To save progress, install Python 3 from https://www.python.org/
echo and tick "Add python.exe to PATH" during the installation,
echo then run start.bat again.
echo.
pause
exit /b 1

:done
rem serve.py already printed everything the user needs. Only pause when it
rem failed, so an error message stays readable instead of the window vanishing.
rem Written as goto labels rather than a parenthesised if-block: batch blocks
rem break on stray parentheses inside echo text, and labels never do.
if "%ERRORLEVEL%"=="0" goto clean_exit
echo.
echo The study server stopped with an error. Please read the message above.
pause
endlocal
exit /b 1

:clean_exit
endlocal
exit /b 0
