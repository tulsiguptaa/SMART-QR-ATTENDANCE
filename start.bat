@echo off
echo Starting Smart QR Attendance System...
echo.

echo Installing dependencies...
call npm run install:all

echo.
echo Starting development servers...
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000
echo.

call npm run start:dev

pause
