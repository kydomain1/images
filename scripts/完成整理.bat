@echo off
chcp 65001 >nul
echo ========================================
echo 📁 完成项目整理
echo ========================================
echo.

cd /d "%~dp0.."

echo 移动Vercel相关文件...
if exist "Vercel-404问题完整解决方案.md" move /Y "Vercel-404问题完整解决方案.md" "docs\vercel\" >nul 2>&1
if exist "Vercel-Settings配置指南.md" move /Y "Vercel-Settings配置指南.md" "docs\vercel\" >nul 2>&1
if exist "Vercel-最终解决方案.md" move /Y "Vercel-最终解决方案.md" "docs\vercel\" >nul 2>&1
if exist "vercel部署修复说明.md" move /Y "vercel部署修复说明.md" "docs\vercel\" >nul 2>&1
if exist "Vercel部署指南.md" move /Y "Vercel部署指南.md" "docs\vercel\" >nul 2>&1
if exist "删除vercel配置并推送.bat" move /Y "删除vercel配置并推送.bat" "docs\vercel\" >nul 2>&1
if exist "快速修复-Vercel-Settings.txt" move /Y "快速修复-Vercel-Settings.txt" "docs\vercel\" >nul 2>&1
if exist "检查Vercel部署文件.md" move /Y "检查Vercel部署文件.md" "docs\vercel\" >nul 2>&1
if exist "立即部署到Vercel.md" move /Y "立即部署到Vercel.md" "docs\vercel\" >nul 2>&1
if exist "触发Vercel重新部署.md" move /Y "触发Vercel重新部署.md" "docs\vercel\" >nul 2>&1

echo 移动GitHub相关文件...
if exist "GitHub推送成功.md" move /Y "GitHub推送成功.md" "docs\github\" >nul 2>&1
if exist "推送到GitHub.bat" move /Y "推送到GitHub.bat" "docs\github\" >nul 2>&1
if exist "立即修复并推送.bat" move /Y "立即修复并推送.bat" "docs\github\" >nul 2>&1

echo 移动API相关文件...
if exist "API配置和密钥管理.md" move /Y "API配置和密钥管理.md" "docs\api\" >nul 2>&1

echo.
echo ========================================
echo ✅ 整理完成！
echo ========================================
echo.
echo 📚 文档位置：
echo    - Vercel: docs\vercel\
echo    - GitHub: docs\github\
echo    - API:    docs\api\
echo.
echo 📄 完整报告: docs\项目整理完成报告-2025-10-25.md
echo.
pause

