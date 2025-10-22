@echo off
echo ========================================
echo   清理敏感信息并推送到 GitHub
echo ========================================
echo.

echo [1/7] 删除本地 Git 历史...
rmdir /s /q .git 2>nul
echo.

echo [2/7] 重新初始化 Git 仓库...
git init
echo.

echo [3/7] 添加所有文件到暂存区...
git add .
echo.

echo [4/7] 提交更改...
git commit -m "Initial commit: AI图片生成器 - 已移除敏感信息"
echo.

echo [5/7] 设置主分支为 main...
git branch -M main
echo.

echo [6/7] 添加远程仓库...
git remote add origin https://github.com/kydomain1/images.git
echo.

echo [7/7] 强制推送到 GitHub (覆盖之前的提交)...
git push -u origin main --force
echo.

echo ========================================
echo   推送完成！
echo ========================================
echo.
echo 访问您的 GitHub 仓库：
echo https://github.com/kydomain1/images
echo.
echo 注意: 已强制推送，之前包含敏感信息的提交已被清除
echo.
pause


