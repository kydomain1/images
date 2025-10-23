@echo off
chcp 65001 >nul
echo ========================================
echo 🔄 重启服务器
echo ========================================
echo.

echo [1/2] 停止旧服务器...
taskkill /F /FI "WINDOWTITLE eq AI图片生成器服务器*" 2>nul
taskkill /F /FI "WINDOWTITLE eq *server-with-r2.js*" 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul
echo ✅ 已停止旧服务器
echo.

echo [2/2] 启动新服务器...
cd /d "%~dp0"
start "AI图片生成器服务器" cmd /k "echo 🚀 服务器启动中... && node server-with-r2.js"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo ✅ 服务器已重启！
echo.
echo 🌐 访问地址: http://localhost:3000/tool.html
echo 📝 服务器窗口已打开（不要关闭）
echo.
echo 现在请：
echo   1. 刷新浏览器 (Ctrl+F5)
echo   2. 重新测试背景移除
echo ========================================
echo.
pause


