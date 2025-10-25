@echo off
echo 正在推送修复...
git add vercel.json
git commit -m "添加vercel.json - 明确指定为静态网站"
git push origin main
echo.
echo 完成！等待Vercel重新部署...
pause

