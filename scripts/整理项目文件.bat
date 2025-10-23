@echo off
chcp 65001 >nul
cls
echo.
echo ========================================================
echo    📁 整理项目文件
echo ========================================================
echo.

:: 创建归档文件夹
echo 创建归档文件夹...
if not exist "docs\archive\2025-10-23-session" mkdir "docs\archive\2025-10-23-session"

echo.
echo 正在移动临时文件...
echo.

:: 移动HTML测试文件（保留index.html和tool.html）
echo [1/5] 移动临时HTML文件...
for %%f in (*.html) do (
    if not "%%f"=="index.html" (
        if not "%%f"=="tool.html" (
            move "%%f" "docs\archive\2025-10-23-session\" >nul 2>&1
            echo   移动: %%f
        )
    )
)

:: 移动临时MD文件（保留README.md）
echo.
echo [2/5] 移动临时MD文件...
for %%f in (*.md) do (
    if not "%%f"=="README.md" (
        move "%%f" "docs\archive\2025-10-23-session\" >nul 2>&1
        echo   移动: %%f
    )
)

:: 移动临时TXT文件
echo.
echo [3/5] 移动临时TXT文件...
for %%f in (*.txt) do (
    move "%%f" "docs\archive\2025-10-23-session\" >nul 2>&1
    echo   移动: %%f
)

:: 移动临时BAT文件（保留关键脚本）
echo.
echo [4/5] 移动临时BAT文件...
for %%f in (*.bat) do (
    if not "%%f"=="启动服务器-最终版.bat" (
        if not "%%f"=="一键启动并打开.bat" (
            move "%%f" "docs\archive\2025-10-23-session\" >nul 2>&1
            echo   移动: %%f
        )
    )
)

:: 删除未使用的CSS
echo.
echo [5/5] 清理未使用的CSS文件...
if exist "css\image-editor-v2.css" (
    del "css\image-editor-v2.css"
    echo   删除: image-editor-v2.css
)
if exist "css\image-editor-v3.css" (
    del "css\image-editor-v3.css"
    echo   删除: image-editor-v3.css
)

echo.
echo ========================================================
echo    ✅ 整理完成！
echo ========================================================
echo.
echo 📁 临时文件已移动到:
echo    docs\archive\2025-10-23-session\
echo.
echo 📋 保留的文件:
echo    • index.html
echo    • tool.html
echo    • README.md
echo    • 启动服务器-最终版.bat
echo    • 一键启动并打开.bat
echo.
pause

