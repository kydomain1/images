@echo off
echo 正在推送更新到GitHub...
git add vercel.json
git commit -m "修复Vercel配置 - 使用rewrites替代routes"
git push origin main
echo.
echo 推送完成！
echo 现在请返回Vercel Dashboard，进入现有的images项目查看部署状态。
echo.
pause

