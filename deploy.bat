@echo off
chcp 65001 > nul
echo ========================================================
echo   Nursing Study AI — رفع التحديثات إلى GitHub و Vercel
echo ========================================================
echo.

cd /d "c:\Users\OS_10\Desktop\nursing-study-ai"

echo [1/2] جاري رفع الكود إلى GitHub...
git add .
git commit -m "Update platform features"
git push -u origin main

echo.
echo [2/2] النشر على Vercel...
echo إن كنت متصلاً بـ Vercel يمكنك تشغيل: npx vercel --prod
echo.
pause
