@echo off
echo ===================================
echo 切换到免费的Pollinations AI
echo ===================================
git add js/api-config.js
git commit -m "临时切换到Pollinations免费API进行测试"
git push origin main
echo.
echo ===================================
echo 完成！等待Vercel重新部署...
echo ===================================
pause

