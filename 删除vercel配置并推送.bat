@echo off
chcp 65001 >nul
echo ========================================
echo 删除vercel.json - 使用Vercel默认配置
echo ========================================
echo.

del vercel.json
echo ✓ 已删除 vercel.json
echo.

git add -A
echo ✓ 已添加更改
echo.

git commit -m "删除vercel.json - 使用Vercel默认静态站点配置"
echo ✓ 已提交
echo.

git push origin main
echo.
echo ✓ 推送完成！
echo.
echo ========================================
echo 接下来：
echo 1. 访问 Vercel Dashboard
echo 2. 等待自动部署完成（2-3分钟）
echo 3. 测试网站
echo ========================================
pause

