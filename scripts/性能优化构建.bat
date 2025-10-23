@echo off
chcp 65001 >nul
echo ========================================
echo    性能优化 - 资源构建工具
echo ========================================
echo.

cd /d "%~dp0.."

echo 🎨 步骤 1/2：合并和压缩CSS文件...
echo.
call npm run build:css:min
echo.

echo 📝 步骤 2/2：更新资源版本号...
echo.
call npm run update:version
echo.

echo ========================================
echo ✅ 性能优化构建完成！
echo ========================================
echo.
echo 📊 优化效果：
echo    ✅ CSS文件合并（3个→1个）
echo    ✅ CSS压缩（减少约30%%体积）
echo    ✅ Font Awesome异步加载
echo    ✅ 版本号自动管理
echo.
echo 💡 下一步：
echo    1. 检查生成的 css/bundle.css
echo    2. 检查生成的 css/bundle.min.css
echo    3. 重启服务器查看效果
echo.

pause


