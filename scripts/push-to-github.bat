@echo off
echo ========================================
echo   推送项目到 GitHub
echo ========================================
echo.

REM 检查是否已经是 Git 仓库
if not exist .git (
    echo [1/6] 初始化 Git 仓库...
    git init
    echo.
) else (
    echo [1/6] Git 仓库已存在
    echo.
)

echo [2/6] 添加所有文件到暂存区...
git add .
echo.

echo [3/6] 提交更改...
git commit -m "Initial commit: AI图片生成器完整项目 - 多语言支持、通义万相API集成、SEO优化"
echo.

echo [4/6] 设置主分支为 main...
git branch -M main
echo.

echo [5/6] 添加远程仓库...
git remote remove origin 2>nul
git remote add origin https://github.com/kydomain1/images.git
echo.

echo [6/6] 推送到 GitHub...
git push -u origin main
echo.

echo ========================================
echo   推送完成！
echo ========================================
echo.
echo 访问您的 GitHub 仓库：
echo https://github.com/kydomain1/images
echo.
pause

