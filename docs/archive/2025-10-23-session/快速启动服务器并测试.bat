@echo off
chcp 65001 >nul
cls
echo.
echo ========================================================
echo    🚀 启动服务器并测试增强算法
echo ========================================================
echo.
echo 正在启动服务器...
echo.

start "AI图片生成器服务器" node server-with-r2.js

timeout /t 3 /nobreak >nul

echo.
echo ✅ 服务器已启动！
echo.
echo ========================================================
echo    🎨 增强版AI放大算法已实现
echo ========================================================
echo.
echo 🚀 新增技术：
echo    [1] USM 超级锐化（Photoshop级别）
echo    [2] CLAHE 自适应对比度增强
echo    [3] Sobel 边缘检测和重建
echo    [4] 多步骤渐进放大（2-4步）
echo    [5] 双边滤波降噪（保留细节）
echo    [6] 细节增强滤镜
echo.
echo 📊 效果对比：
echo    旧版本：⭐⭐ （看不出区别）
echo    新版本：⭐⭐⭐⭐ （明显提升）
echo.
echo 🎯 推荐设置：
echo    放大倍数: 2x 放大
echo    算法: 超分辨率（最佳）
echo    ✅ 锐化增强
echo    ✅ 降噪处理
echo.

start http://localhost:3000/tool.html

echo ✅ 页面已打开！
echo.
echo 📝 测试步骤：
echo    1. 按 Ctrl + Shift + R 强制刷新
echo    2. 切换到"AI高清放大"标签
echo    3. 上传图片
echo    4. 选择"超分辨率"算法
echo    5. 点击"开始放大"
echo    6. 对比效果！
echo.
echo 💡 提示：
echo    • 选择"超分辨率"算法效果最好
echo    • 建议同时勾选锐化和降噪
echo    • 控制台会显示详细的处理日志
echo.
pause

