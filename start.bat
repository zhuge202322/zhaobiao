@echo off
cd /d "%~dp0"
echo 正在启动 Next.js 开发服务器...
echo 端口: 4003
echo.
node node_modules\next\dist\bin\next dev -p 4003
pause
