@echo off
chcp 65001 >nul
echo ========================================
echo 修复.vercelignore - 允许HTML文件部署
echo ========================================
echo.

git add .vercelignore vercel.json
echo ✓ 已添加文件
echo.

git commit -m "修复.vercelignore - 移除*.md过滤，允许HTML部署"
echo ✓ 已提交更改
echo.

git push origin main
echo.
echo ✓ 推送完成！
echo.
echo ========================================
echo 接下来：
echo 1. 访问 Vercel Dashboard
echo 2. 点击最新部署右侧的 ...
echo 3. 选择 Redeploy
echo 4. 等待3分钟后测试
echo ========================================
pause

