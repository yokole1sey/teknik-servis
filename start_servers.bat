@echo off
echo Backend sunucusu baslatiliyor...
start cmd /k "cd backend && npm start"

echo 5 saniye bekleniyor...
timeout /t 5 /nobreak >nul

echo Frontend sunucusu baslatiliyor...
start cmd /k "node simple-server.js"

echo Sunucular baslatildi!
echo Backend: http://localhost:3001  
echo Frontend: http://localhost:8080
echo.
echo Raporlama sorunlari duzeltildi:
echo - API endpoint tutarsizligi cozuldu
echo - Filtreleme mantigi duzeltildi  
echo - Tarih ve fiyat filtreleri iyilestirildi
echo.
echo Simdi localhost:8080 adresine gidip test edin!
pause 