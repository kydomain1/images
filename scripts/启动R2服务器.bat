@echo off
chcp 65001 >nul
echo ========================================
echo 通义万相 + R2存储 服务器启动脚本
echo ========================================
echo.

REM 检查.env文件
if not exist ".env" (
    echo ⚠️  警告: .env 文件不存在
    echo.
    echo 正在从模板创建 .env 文件...
    copy .env.example .env
    echo.
    echo ✅ .env 文件已创建
    echo.
    echo ⚠️  重要: 请先配置R2公开访问URL！
    echo.
    echo 步骤:
    echo 1. 登录 Cloudflare 控制台
    echo 2. 进入 R2 存储桶 "images"
    echo 3. 点击 "设置" - "公共访问"
    echo 4. 启用 r2.dev 域名或连接自定义域名
    echo 5. 获取公开URL
    echo 6. 编辑 .env 文件，设置 R2_PUBLIC_URL
    echo.
    pause
)

REM 检查Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误: 未检测到Node.js
    pause
    exit /b 1
)

echo ✅ Node.js已安装
node --version
echo.

REM 检查依赖
if not exist "node_modules\@aws-sdk" (
    echo 📦 安装R2所需的新依赖...
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

echo 🚀 启动R2版本服务器...
echo.
echo ⚠️  注意: 如果R2公开URL未配置，图片将无法显示！
echo.
node server-with-r2.js

pause


