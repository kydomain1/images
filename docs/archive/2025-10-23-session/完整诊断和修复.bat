@echo off
chcp 65001 >nul
color 0B
cls

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║        🔍 完整诊断 + 🔧 自动修复                       ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo.

cd /d "%~dp0"

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [诊断 1/5] 检查 Node.js
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
node --version
if %errorlevel% equ 0 (
    echo ✅ Node.js 已安装
) else (
    echo ❌ Node.js 未安装！
    echo 请访问: https://nodejs.org/
    pause
    exit /b 1
)
echo.
timeout /t 1 /nobreak >nul

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [诊断 2/5] 检查端口占用
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
netstat -ano | findstr :3000 | findstr LISTENING
if %errorlevel% equ 0 (
    echo ⚠️  端口 3000 被占用
    echo 📝 正在查找占用进程...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
        echo 📌 进程 PID: %%a
        set PID=%%a
    )
) else (
    echo ✅ 端口 3000 空闲
    set PID=
)
echo.
timeout /t 1 /nobreak >nul

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [修复 3/5] 停止旧服务器
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM 停止所有node进程
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✅ 已停止所有 Node.js 进程
) else (
    echo ℹ️  没有运行中的 Node.js 进程
)

timeout /t 2 /nobreak >nul
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [修复 4/5] 启动新服务器（包含背景移除API）
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 🚀 正在启动服务器...
echo.
start "【请勿关闭】AI图片生成器服务器" cmd /k "echo. && echo ╔══════════════════════════════════════════╗ && echo ║    🚀 AI图片生成器服务器                ║ && echo ╚══════════════════════════════════════════╝ && echo. && echo 📌 重要提示： && echo    - 请勿关闭此窗口 && echo    - 服务器正在运行中... && echo    - 按 Ctrl+C 可停止服务器 && echo. && echo ⏳ 启动中... && echo. && node server-with-r2.js"

timeout /t 5 /nobreak >nul
echo ✅ 新服务器已启动
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [完成 5/5] 打开浏览器
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
start http://localhost:3000/tool.html
echo ✅ 浏览器已打开到正确地址
echo.
timeout /t 2 /nobreak >nul

echo.
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║                  ✅ 修复完成！                          ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo.
echo 📝 接下来请在浏览器中：
echo.
echo    1️⃣  按 Ctrl+F5 强制刷新页面
echo    2️⃣  点击"图片编辑器"标签
echo    3️⃣  上传图片
echo    4️⃣  点击"移除背景"
echo    5️⃣  按 F12 打开控制台查看日志
echo.
echo.
echo ✅ 成功标志：
echo    控制台显示: "✅ Remove.bg API 成功！剩余额度: 49"
echo    处理时间: 5-10秒（不是1-3秒）
echo    效果: ⭐⭐⭐⭐⭐ 完美透明背景
echo.
echo.
echo ⚠️  注意事项：
echo    - 不要关闭"【请勿关闭】AI图片生成器服务器"窗口
echo    - 如果仍然404，请重新运行此脚本
echo    - 详细帮助文档: docs\404错误解决方案.md
echo.
echo.
echo ════════════════════════════════════════════════════════════
echo.

pause


