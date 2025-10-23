@echo off
chcp 65001 >nul
color 0A
echo.
echo ╔════════════════════════════════════════╗
echo ║   🔧 强制重启服务器 - 解决404错误   ║
echo ╚════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [步骤 1/4] 强制停止所有Node.js进程...
echo.
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✅ 已停止旧的Node.js进程
) else (
    echo ℹ️  没有运行中的Node.js进程
)
echo.

timeout /t 2 /nobreak >nul

echo [步骤 2/4] 清理端口占用...
echo.
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    echo 发现占用端口的进程 PID: %%a
    taskkill /F /PID %%a 2>nul
)
echo ✅ 端口已清理
echo.

timeout /t 1 /nobreak >nul

echo [步骤 3/4] 启动新服务器（加载最新代码）...
echo.
start "AI图片生成器服务器" cmd /k "echo ╔════════════════════════════════════════╗ && echo ║   🚀 AI图片生成器服务器            ║ && echo ╚════════════════════════════════════════╝ && echo. && echo ⏳ 正在启动服务器... && echo. && node server-with-r2.js"

timeout /t 4 /nobreak >nul
echo ✅ 新服务器已启动
echo.

echo [步骤 4/4] 打开浏览器...
echo.
start http://localhost:3000/tool.html
echo ✅ 浏览器已打开
echo.

echo.
echo ╔════════════════════════════════════════╗
echo ║            ✅ 全部完成！              ║
echo ╚════════════════════════════════════════╝
echo.
echo 📝 接下来请：
echo.
echo   1️⃣  在浏览器中按 Ctrl+F5 强制刷新
echo   2️⃣  重新上传图片
echo   3️⃣  点击"移除背景"
echo   4️⃣  等待 5-10 秒（使用API）
echo   5️⃣  看到专业级效果！⭐⭐⭐⭐⭐
echo.
echo ⚠️  重要提示：
echo   - 不要关闭"AI图片生成器服务器"窗口
echo   - 在控制台(F12)查看是否显示"API成功"
echo   - 如果仍然404，请再次运行此脚本
echo.
echo ════════════════════════════════════════
echo.

pause


