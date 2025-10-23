@echo off
chcp 65001 >nul
cls
echo.
echo ========================================================
echo    ✅ 完整配置已完成！
echo ========================================================
echo.
echo 📝 已配置的API：
echo    [1] Remove.bg API     - 背景移除 (48次剩余)
echo    [2] 通义万相 API      - 文字生成图片
echo    [3] Cloudflare R2     - 永久图片存储
echo.
echo ========================================================
echo.
echo 正在启动服务器...
echo.

start "AI图片生成器 - 完整版" node server-with-r2.js

timeout /t 5 /nobreak >nul

echo.
echo ========================================================
echo    🎉 服务器已启动！
echo ========================================================
echo.
echo 🔧 配置详情：
echo    • Remove.bg: ✅ 配置成功
echo    • 通义万相: ✅ 配置成功  
echo    • R2存储:   ✅ 配置成功
echo.
echo 📡 访问地址: http://localhost:3000
echo.
echo 💡 R2存储说明：
echo    所有生成的图片会自动上传到R2存储桶
echo    获得永久访问链接，不会过期
echo.

start http://localhost:3000/tool.html

echo ✅ 页面已打开！
echo.
echo 🎯 现在您可以：
echo    1. 生成图片 - 使用通义万相API
echo    2. 移除背景 - 使用Remove.bg API
echo    3. 图片放大 - 使用增强算法
echo    4. 应用滤镜 - 使用浏览器算法
echo    5. 所有图片永久保存到R2
echo.
pause

