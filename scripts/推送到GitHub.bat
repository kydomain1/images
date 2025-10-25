@echo off
chcp 65001 >nul
echo ======================================
echo 推送修复到GitHub
echo ======================================
echo.

git add vercel.json .vercelignore public/.gitkeep
echo ✓ 已添加文件
echo.

git commit -m "🔧 极简Vercel配置 - 解决404问题"
echo ✓ 已提交更改
echo.

git push origin main
echo.
echo ✓ 推送完成！
echo.
echo ======================================
echo 请等待3-5分钟后测试网站
echo ======================================
pause

