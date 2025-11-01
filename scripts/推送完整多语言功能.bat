@echo off
chcp 65001 >nul
echo ========================================
echo 推送完整多语言功能到GitHub
echo ========================================
echo.

cd /d "%~dp0\.."

echo [1/3] 添加文件...
git add index.html tool.html js/i18n.js docs/

echo [2/3] 提交更改...
git commit -m "feat: 完整多语言支持 - 覆盖所有功能区域" -m "修复内容:" -m "1. 首页语言键统一(zh-CN→zh, zh-TW→zh-tw)" -m "2. 推荐提示词支持多语言切换" -m "3. 加载状态文本支持所有13种语言" -m "4. 为7种语言添加缺失的加载状态翻译" -m "5. 更新tool.html脚本版本号" -m "6. 添加调试日志方便排查问题"

echo [3/3] 推送到GitHub...
git push origin main

echo.
echo ========================================
echo ✅ 推送完成！
echo ========================================
echo.
echo 请等待 Vercel 部署完成（1-2分钟）
echo 然后刷新浏览器测试
echo.
pause

