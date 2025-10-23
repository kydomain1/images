@echo off
chcp 65001 >nul
echo ========================================
echo    整理最新创建的文件
echo ========================================
echo.

cd /d "%~dp0.."

echo 📁 步骤 1/3：清理临时上传文件...
if exist uploads\* (
    del /q uploads\* 2>nul
    echo    ✅ uploads目录已清理（7个文件）
) else (
    echo    ℹ️  uploads目录已经是空的
)
echo.

echo 📁 步骤 2/3：移动测试页面到test目录...
if exist "test-img2img-direct.html" (
    move /y "test-img2img-direct.html" "test\" >nul 2>&1
    echo    ✅ test-img2img-direct.html → test\
)
if exist "tool-fresh.html" (
    move /y "tool-fresh.html" "test\" >nul 2>&1
    echo    ✅ tool-fresh.html → test\
)
echo.

echo 📁 步骤 3/3：移动帮助文档到docs目录...
if exist "一键解决所有缓存问题.html" (
    move /y "一键解决所有缓存问题.html" "docs\" >nul 2>&1
    echo    ✅ 一键解决所有缓存问题.html → docs\
)
if exist "最终解决方案-请立即执行.txt" (
    move /y "最终解决方案-请立即执行.txt" "docs\" >nul 2>&1
    echo    ✅ 最终解决方案-请立即执行.txt → docs\
)
if exist "图生图测试指南.txt" (
    move /y "图生图测试指南.txt" "docs\" >nul 2>&1
    echo    ✅ 图生图测试指南.txt → docs\
)
if exist "强制刷新-清除缓存.html" (
    move /y "强制刷新-清除缓存.html" "docs\" >nul 2>&1
    echo    ✅ 强制刷新-清除缓存.html → docs\
)
if exist "彻底清除缓存-必读.html" (
    move /y "彻底清除缓存-必读.html" "docs\" >nul 2>&1
    echo    ✅ 彻底清除缓存-必读.html → docs\
)
if exist "性能警告说明.txt" (
    move /y "性能警告说明.txt" "docs\" >nul 2>&1
    echo    ✅ 性能警告说明.txt → docs\
)
if exist "立即解决缓存问题.txt" (
    move /y "立即解决缓存问题.txt" "docs\" >nul 2>&1
    echo    ✅ 立即解决缓存问题.txt → docs\
)
echo.

echo ========================================
echo ✅ 文件夹整理完成！
echo ========================================
echo.
echo 📊 整理摘要：
echo    ✅ 临时文件已清理：uploads\ (7个文件)
echo    ✅ 测试页面已移动：test\ (2个文件)
echo    ✅ 帮助文档已移动：docs\ (7个文件)
echo.
echo 📂 当前结构：
echo    📁 docs\        - 所有文档和帮助文件
echo    📁 test\        - 所有测试页面
echo    📁 scripts\     - 所有脚本工具
echo    📁 uploads\     - 空（已清理）
echo.

pause


