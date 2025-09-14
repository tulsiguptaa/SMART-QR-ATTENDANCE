@echo off
title Smart QR Attendance - Quick Start
color 0A

echo.
echo ========================================
echo    Smart QR Attendance System
echo ========================================
echo.

echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is installed

echo.
echo [2/4] Checking MongoDB...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB not found in PATH. Please ensure MongoDB is running.
    echo    You can start MongoDB manually or install it from: https://www.mongodb.com/
) else (
    echo ✅ MongoDB is available
)

echo.
echo [3/4] Installing dependencies...
call npm run install:all
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully

echo.
echo [4/4] Setting up environment files...
if not exist "backend\.env" (
    copy "backend\env.example" "backend\.env" >nul
    echo ✅ Created backend/.env file
) else (
    echo ✅ Backend .env file already exists
)

if not exist "frontend\.env" (
    copy "frontend\env.example" "frontend\.env" >nul
    echo ✅ Created frontend/.env file
) else (
    echo ✅ Frontend .env file already exists
)

echo.
echo ========================================
echo    Setup Complete! 🎉
echo ========================================
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5000
echo.
echo Demo Accounts:
echo   Admin:   admin@demo.com / password123
echo   Teacher: teacher@demo.com / password123
echo   Student: student@demo.com / password123
echo.
echo Starting the application...
echo Press Ctrl+C to stop the servers
echo.

call npm run start:dev

