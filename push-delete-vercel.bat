@echo off
echo 正在删除vercel.json并推送...
git add -A
git commit -m "删除vercel.json - 让Vercel自动处理静态网站"
git push origin main
echo.
echo 推送完成！
echo 请等待1-2分钟让Vercel重新部署。
pause

