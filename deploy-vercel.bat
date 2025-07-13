@echo off
echo 🚀 Deploying to Vercel...
echo.
echo Config check:
findstr "teknik-servis-backend.onrender.com" src\config.js
if %errorlevel% == 0 (
    echo ✅ Configuration is correct
) else (
    echo ❌ Configuration needs updating
)
echo.
echo 📋 Deployment URLs:
echo Frontend: https://bilgisayar-teknik-servis-takip.vercel.app
echo Backend:  https://teknik-servis-backend.onrender.com
echo.
echo 👉 Please manually redeploy on Vercel dashboard
echo    or drag-drop the project folder to Vercel
pause 