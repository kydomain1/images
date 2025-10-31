@echo off
echo ===================================
echo 双平台部署脚本
echo Vercel + Cloudflare
echo ===================================
echo.

echo [1/4] 检查Git状态...
git status
echo.

echo [2/4] 添加所有文件...
git add .
echo.

echo [3/4] 提交更改...
set /p commit_msg="请输入提交信息 (默认: 更新双平台部署): "
if "%commit_msg%"=="" set commit_msg=更新双平台部署

git commit -m "%commit_msg%"
echo.

echo [4/4] 推送到GitHub...
git push origin main
echo.

echo ===================================
echo 推送完成！
echo ===================================
echo.
echo Vercel部署: 自动进行中...
echo 查看状态: https://vercel.com/dashboard
echo.
echo Cloudflare部署: 自动进行中...
echo 查看状态: https://dash.cloudflare.com/
echo.
echo 预计2-3分钟后完成部署
echo ===================================
pause

