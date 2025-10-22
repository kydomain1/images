@echo off
chcp 65001 >nul
echo ========================================
echo 通义万相API代理服务器启动脚本
echo ========================================
echo.

REM 检查Node.js是否安装
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误: 未检测到Node.js
    echo.
    echo 请先安装Node.js:
    echo 1. 访问: https://nodejs.org/
    echo 2. 下载并安装LTS版本
    echo 3. 重新运行此脚本
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js已安装
node --version
echo.

REM 检查是否已安装依赖
if not exist "node_modules" (
    echo 📦 首次运行，正在安装依赖...
    echo.
    call npm install
    echo.
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装成功
    echo.
)

echo 🚀 启动服务器...
echo.
node server.js

pause


