@echo off
chcp 65001 >nul
echo ========================================
echo 推送多语言提示词功能到GitHub
echo ========================================
echo.

cd /d "%~dp0\.."

echo [1/3] 添加文件...
git add tool.html js/i18n.js docs/提示词多语言功能说明.md

echo [2/3] 提交更改...
git commit -m "feat: 推荐提示词完整支持多语言切换" -m "- 更新 i18n.js 和 tool.html 版本号" -m "- 添加调试日志帮助诊断" -m "- 强制浏览器重新加载最新版本"

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

