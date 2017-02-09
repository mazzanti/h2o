ECHO "Build release..."

for /F "usebackq tokens=1,2 delims==" %%i in (`wmic os get LocalDateTime /VALUE 2^>NUL`) do if '.%%i.'=='.LocalDateTime.' set ldt=%%j
set ldt=%ldt:~0,4%-%ldt:~4,2%-%ldt:~6,2% %ldt:~8,2%:%ldt:~10,2%:%ldt:~12,6%

ROBOCOPY src\base\js\sdk src\base\js\sdk_release /s /e

DEL src\base\js\sdk_release\zmain.js

ECHO "Single file..."
TYPE src\base\js\sdk_release\*.js > src\base\js\release.js
TYPE src\base\js\sdk_release\form\*.js >> src\base\js\release.js
REM COPY /b src\base\js\sdk_release\*.js src\base\js\release.js
ECHO var g_oGlobal = g_oGlobal ^|^| {}; g_oGlobal.release = "%ldt%"; g_oGlobal.manager1 = new nsNessuno.oManager("wrapper", "wrapper_manager1"); g_oGlobal.manager1.setOwner(g_oGlobal.manager1); >> src\base\js\release.js

ECHO "Minifier..."
minify src\base\js\release.js --template {{filename}}.{{ext}}
REM minify src\base\js\release.js



PAUSE
