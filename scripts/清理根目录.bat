@echo off
chcp 65001 >nul
echo ========================================
echo    清理根目录文件
echo ========================================
echo.

cd /d "%~dp0.."

echo 📁 移动帮助文档到docs目录...
if exist "优化完成总结.txt" (
    move /y "优化完成总结.txt" "docs\" >nul 2>&1
    echo    ✅ 优化完成总结.txt → docs\
)
if exist "快速整理指南.txt" (
    move /y "快速整理指南.txt" "docs\" >nul 2>&1
    echo    ✅ 快速整理指南.txt → docs\
)
if exist "整理完成.txt" (
    move /y "整理完成.txt" "docs\" >nul 2>&1
    echo    ✅ 整理完成.txt → docs\
)
echo.

echo 📁 检查uploads目录...
if exist "uploads\*" (
    del /q "uploads\*" 2>nul
    echo    ✅ uploads目录已清空
) else (
    echo    ℹ️  uploads目录已经是空的
)
echo.

echo ========================================
echo ✅ 清理完成！
echo ========================================
echo.
echo 📊 清理结果：
echo    ✅ 3个帮助文档已移至docs\
echo    ✅ uploads目录已清空
echo.
echo 📂 根目录现在简洁清爽：
echo    ✓ 只保留核心项目文件
echo    ✓ 文档统一在docs\
echo    ✓ 测试文件在test\
echo.

pause


