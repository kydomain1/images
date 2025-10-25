@echo off
cd /d D:\images
git add vercel.json
git commit -m "修复Vercel配置 - 使用新版rewrites替代routes"
git push origin main
pause

