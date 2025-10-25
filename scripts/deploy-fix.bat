@echo off
echo ===================================
echo 推送API环境自适应修复
echo ===================================
git add js/tongyi-api.js vercel.json
git commit -m "修复Vercel部署 - API地址自动适配开发/生产环境"
git push origin main
echo.
echo 完成！等待Vercel重新部署...
echo 预计1-2分钟后可以访问
pause

