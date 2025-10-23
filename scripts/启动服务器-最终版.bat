@echo off
echo ========================================
echo 启动 AI 图片生成器服务器
echo ========================================
echo.

cd /d D:\images

echo 正在启动服务器...
echo.
echo 服务器地址: http://localhost:3000
echo 图片工具页: http://localhost:3000/tool.html
echo.
echo 按 Ctrl+C 可停止服务器
echo ========================================
echo.

node server-with-r2.js

pause


