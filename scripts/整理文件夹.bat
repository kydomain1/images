@echo off
chcp 65001 >nul
echo ========================================
echo    文件夹整理工具
echo ========================================
echo.

cd /d "%~dp0.."

echo 📁 步骤 1/3：清理临时上传文件...
if exist uploads\* (
    del /q uploads\* 2>nul
    echo    ✅ uploads目录已清理
) else (
    echo    ℹ️  uploads目录已经是空的
)
echo.

echo 📁 步骤 2/3：归档已完成的文档...

rem GitHub相关
if exist "docs\GitHub推送完成准备.md" move /y "docs\GitHub推送完成准备.md" "docs\archive\" >nul 2>&1
if exist "docs\准备推送-最终步骤.txt" move /y "docs\准备推送-最终步骤.txt" "docs\archive\" >nul 2>&1
if exist "docs\快速推送到GitHub.txt" move /y "docs\快速推送到GitHub.txt" "docs\archive\" >nul 2>&1
if exist "docs\GitHub推送指南.md" move /y "docs\GitHub推送指南.md" "docs\archive\" >nul 2>&1
echo    ✅ GitHub相关文档已归档

rem 功能完成报告
if exist "docs\图生图功能开发完成报告.md" move /y "docs\图生图功能开发完成报告.md" "docs\archive\" >nul 2>&1
if exist "docs\文件夹整理完成.txt" move /y "docs\文件夹整理完成.txt" "docs\archive\" >nul 2>&1
if exist "docs\文件夹整理说明.md" move /y "docs\文件夹整理说明.md" "docs\archive\" >nul 2>&1
if exist "docs\敏感信息已清理说明.md" move /y "docs\敏感信息已清理说明.md" "docs\archive\" >nul 2>&1
echo    ✅ 功能完成报告已归档

rem 翻译相关
if exist "docs\隐私政策翻译-待添加内容.txt" move /y "docs\隐私政策翻译-待添加内容.txt" "docs\archive\" >nul 2>&1
if exist "docs\隐私政策翻译-立即测试指南.md" move /y "docs\隐私政策翻译-立即测试指南.md" "docs\archive\" >nul 2>&1
if exist "docs\隐私政策翻译-补充计划.md" move /y "docs\隐私政策翻译-补充计划.md" "docs\archive\" >nul 2>&1
if exist "docs\政策页面多语言功能说明.txt" move /y "docs\政策页面多语言功能说明.txt" "docs\archive\" >nul 2>&1
echo    ✅ 翻译相关文档已归档

rem 检查报告
if exist "docs\网站检查总结.txt" move /y "docs\网站检查总结.txt" "docs\archive\" >nul 2>&1
if exist "docs\死链检查报告.md" move /y "docs\死链检查报告.md" "docs\archive\" >nul 2>&1
if exist "docs\FIXES_APPLIED.md" move /y "docs\FIXES_APPLIED.md" "docs\archive\" >nul 2>&1
echo    ✅ 检查报告已归档

echo.

echo 📁 步骤 3/3：清理根目录（如果有）...
if exist "准备推送-最终步骤.txt" move /y "准备推送-最终步骤.txt" "docs\archive\" >nul 2>&1
if exist "敏感信息已清理说明.md" move /y "敏感信息已清理说明.md" "docs\archive\" >nul 2>&1
if exist "clean-and-push.bat" move /y "clean-and-push.bat" "scripts\" >nul 2>&1
echo    ✅ 根目录已检查
echo.

echo ========================================
echo ✅ 文件夹整理完成！
echo ========================================
echo.
echo 📊 整理摘要：
echo    ✅ 临时文件已清理
echo    ✅ 历史文档已归档到 docs\archive\
echo    ✅ 活跃文档保留在 docs\
echo.
echo 📂 文档分类：
echo    📁 docs\archive\     - 历史归档
echo    📁 docs\             - 活跃文档
echo    📁 scripts\          - 脚本工具
echo.

pause


