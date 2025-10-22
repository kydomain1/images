@echo off
chcp 65001 >nul
echo ========================================
echo    启动完整后端服务器（支持图生图）
echo ========================================
echo.
echo 🔍 检查环境...
echo.

cd /d "%~dp0.."

:: 检查Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未找到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

:: 检查依赖
if not exist "node_modules\" (
    echo 📦 首次运行，正在安装依赖...
    call npm install
    echo.
)

:: 停止旧的http-server进程
echo 🛑 停止旧的服务器进程...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq http-server*" >nul 2>nul
timeout /t 1 >nul

echo.
echo ========================================
echo 🚀 启动后端服务器
echo ========================================
echo.
echo 📌 功能说明：
echo    ✅ 文字生成图片（通义万相）
echo    ✅ 真实图生图功能
echo    ✅ 图片高清放大
echo    ✅ R2永久存储
echo.
echo 💡 提示：
echo    - 如果没有配置API密钥，图生图会返回模拟数据
echo    - 配置方法参见 docs/图生图免费API推荐.md
echo.
echo ⌛ 正在启动服务器...
echo.

:: 启动服务器
node server-with-r2.js

pause

