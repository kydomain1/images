@echo off
cd /d D:\images
git add vercel.json
git commit -m "添加vercel.json配置 - 指定静态网站部署"
git push origin main
echo.
echo 推送完成！
pause

