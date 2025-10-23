@echo off
echo ========================================
echo 启动 AI 图片生成器后端服务器
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] 检查 Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未安装 Node.js！
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
echo.

echo [2/2] 启动服务器...
echo ========================================
echo.
echo 🚀 服务器地址: http://localhost:3000
echo 🎨 图片编辑器: http://localhost:3000/tool.html
echo.
echo ⚠️  按 Ctrl+C 可停止服务器
echo ========================================
echo.

node server-with-r2.js

pause


