@echo off
chcp 65001 >nul
cls
echo.
echo ========================================================
echo    🎨 背景移除功能 - 改进版本 v3.1
echo ========================================================
echo.
echo ✨ 最新改进：
echo    [1] 自适应阈值算法
echo    [2] 更温和的形态学处理
echo    [3] 边缘保护机制
echo    [4] 预设模式选择
echo    [5] 详细的处理日志
echo.
echo 🎯 预设模式：
echo    👤 人物照片   → 敏感度 12（宽松）
echo    📦 产品图     → 敏感度 22（严格）
echo    🐱 宠物照片   → 敏感度 14（适中）
echo    🎨 图标/Logo  → 敏感度 25（很严格）
echo    🌄 复杂场景   → 敏感度 8（很宽松）
echo.
echo 💡 使用建议：
echo    1. 先选择图片类型预设
echo    2. 如果效果不满意，切换到"自定义"
echo    3. 微调敏感度滑块
echo    4. 查看控制台日志了解处理详情
echo.

start http://localhost:3000/tool.html

timeout /t 2 /nobreak >nul

echo ✅ 页面已刷新！
echo.
echo 🔍 测试步骤：
echo    1. 打开浏览器开发者工具（F12）查看日志
echo    2. 点击"图片编辑器"标签页
echo    3. 选择图片类型预设（如：人物照片）
echo    4. 上传图片
echo    5. 点击"移除背景"
echo    6. 查看控制台的处理统计
echo.
echo 📊 控制台会显示：
echo    • 阈值分析（adaptiveThreshold）
echo    • 处理统计（移除/保留比例）
echo    • 各阶段进度信息
echo.
pause

