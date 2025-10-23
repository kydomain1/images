@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 AI图片生成器 - 一键启动
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查 Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未安装 Node.js！
    echo 请先安装: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js 已安装
echo.

echo [2/3] 启动服务器...
start "AI图片生成器服务器" cmd /k "node server-with-r2.js"
timeout /t 3 /nobreak >nul

echo ✅ 服务器已启动
echo.

echo [3/3] 打开浏览器...
start http://localhost:3000/tool.html

echo.
echo ========================================
echo ✅ 完成！
echo.
echo 🌐 网址: http://localhost:3000/tool.html
echo 📝 不要关闭服务器窗口
echo 🛑 按 Ctrl+C 可停止服务器
echo ========================================
echo.

timeout /t 3


