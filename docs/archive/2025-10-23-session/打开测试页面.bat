@echo off
chcp 65001 >nul
cls
echo.
echo ========================================================
echo    🎨 背景移除功能升级完成！
echo ========================================================
echo.
echo ✨ 主要改进：
echo    [1] 全新智能算法（7个处理阶段）
echo    [2] 可调节参数（敏感度、边缘平滑）
echo    [3] 实时进度显示
echo    [4] 边缘检测保护
echo    [5] 形态学优化
echo.
echo 🎯 使用建议：
echo    • 简单背景 → 敏感度调高（20-25）
echo    • 复杂背景 → 敏感度调低（10-15）
echo    • 始终启用边缘平滑
echo.
echo 正在打开测试页面...
echo.

start http://localhost:3000/tool.html

echo ✅ 页面已在浏览器中打开！
echo.
echo 📝 测试步骤：
echo    1. 点击"图片编辑器"标签页
echo    2. 上传图片
echo    3. 展开"高级设置"调整参数
echo    4. 点击"移除背景"
echo    5. 查看对比效果
echo.
pause

