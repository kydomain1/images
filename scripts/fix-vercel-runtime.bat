@echo off
echo 修复Vercel Runtime配置...
git add vercel.json
git commit -m "修复Vercel runtime配置错误"
git push origin main
echo.
echo 完成！等待Vercel重新部署...
pause

