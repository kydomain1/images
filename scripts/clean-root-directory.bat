@echo off
echo ===================================
echo 整理项目根目录
echo ===================================

echo.
echo 正在移动批处理文件到scripts目录...
move check-and-push.bat scripts\ 2>nul
move deploy-fix.bat scripts\ 2>nul
move final-push.bat scripts\ 2>nul
move fix-vercel-runtime.bat scripts\ 2>nul
move push-api-fix.bat scripts\ 2>nul
move push-delete-vercel.bat scripts\ 2>nul
move push-now.bat scripts\ 2>nul
move push-vercel-fix.bat scripts\ 2>nul
move quick-push.bat scripts\ 2>nul
move switch-to-free-api.bat scripts\ 2>nul
move 删除vercel配置并推送.bat scripts\ 2>nul
move 立即修复并推送.bat scripts\ 2>nul

echo.
echo 正在移动Vercel文档到docs\vercel目录...
move "Vercel-404问题完整解决方案.md" docs\vercel\ 2>nul
move "Vercel-Settings配置指南.md" docs\vercel\ 2>nul
move "Vercel-最终解决方案.md" docs\vercel\ 2>nul
move "vercel部署修复说明.md" docs\vercel\ 2>nul
move "Vercel部署指南.md" docs\vercel\ 2>nul
move "检查Vercel部署文件.md" docs\vercel\ 2>nul
move "立即部署到Vercel.md" docs\vercel\ 2>nul
move "触发Vercel重新部署.md" docs\vercel\ 2>nul
move "快速修复-Vercel-Settings.txt" docs\vercel\ 2>nul

echo.
echo 正在移动其他文档到docs目录...
move "GitHub推送成功.md" docs\github\ 2>nul
move "API配置和密钥管理.md" docs\api\ 2>nul

echo.
echo 正在删除临时/错误文件...
del "how HEAD --oneline --no-patch" 2>nul

echo.
echo ===================================
echo 整理完成！
echo ===================================
echo.
echo 已整理的文件：
echo - 批处理文件 → scripts\
echo - Vercel文档 → docs\vercel\
echo - GitHub文档 → docs\github\
echo - API文档 → docs\api\
echo - 已删除临时文件
echo.
pause

