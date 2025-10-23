@echo off
chcp 65001 >nul
cls
echo.
echo ========================================================
echo    🎨 配置 Remove.bg API
echo ========================================================
echo.
echo 正在创建 .env 配置文件...
echo.

(
echo # ============================================
echo # AI图片生成器 - 环境变量配置
echo # ============================================
echo.
echo # ==================== Remove.bg API ====================
echo # 背景移除 API
echo REMOVEBG_API_KEY=haL8i6ppfcmj679J2WKyW31L
echo.
echo # ==================== 通义万相 API ====================
echo TONGYI_API_KEY=
echo.
echo # ==================== Cloudflare R2 存储 ====================
echo R2_ACCESS_KEY_ID=
echo R2_SECRET_ACCESS_KEY=
echo R2_BUCKET_NAME=
echo R2_ENDPOINT=
echo R2_PUBLIC_URL=
echo.
echo # ==================== 服务器配置 ====================
echo PORT=3000
echo.
echo # ==================== Hugging Face API ====================
echo HUGGINGFACE_API_KEY=
) > .env

echo ✅ .env 文件创建成功！
echo.
echo 📝 配置内容：
echo    REMOVEBG_API_KEY = haL8i6ppfcmj679J2WKyW31L
echo.
echo ========================================================
echo.
echo 现在需要重启服务器以加载新配置...
echo.
pause

echo.
echo 正在关闭旧的服务器进程...
taskkill /F /IM node.exe >nul 2>&1

echo 等待 2 秒...
timeout /t 2 /nobreak >nul

echo.
echo 正在启动服务器...
start "Remove.bg API 服务器" node server-with-r2.js

timeout /t 3 /nobreak >nul

echo.
echo ========================================================
echo    ✅ 配置完成！
echo ========================================================
echo.
echo 📡 服务器已启动
echo 🔗 访问: http://localhost:3000/tool.html
echo.
echo 🎯 使用方法：
echo    1. 点击"图片编辑器"标签页
echo    2. 上传图片
echo    3. 点击"移除背景"
echo    4. 现在会使用 Remove.bg AI 处理！
echo.
echo 💳 API 额度：
echo    免费额度: 50 次/月
echo    每次处理后会显示剩余额度
echo.

start http://localhost:3000/tool.html

echo ✅ 页面已打开！现在测试背景移除功能！
echo.
pause

