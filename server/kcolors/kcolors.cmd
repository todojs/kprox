@echo off
:run
cls
set NODE_PATH=C:\Program Files\nodejs\node_modules;C:\Users\palmun\AppData\Roaming\npm\node_modules;
node.exe %CD%\kcolors.js
pause
goto run