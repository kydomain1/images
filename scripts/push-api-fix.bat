@echo off
echo ===================================
echo 修复API路径配置
echo ===================================
git add vercel.json js/config.js js/tongyi-api.js
git commit -m "修复API路径和Vercel无服务器函数配置"
git push origin main
echo.
echo ===================================
echo 推送完成！
echo 等待Vercel重新部署（约1-2分钟）
echo ===================================
pause

