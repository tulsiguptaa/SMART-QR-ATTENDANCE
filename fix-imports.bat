@echo off
echo Fixing import issues...

echo.
echo Replacing ViewIcon and ViewOffIcon imports...

cd frontend\src\pages

echo Fixing Login.jsx...
powershell -Command "(Get-Content Login.jsx) -replace 'import { ViewIcon, ViewOffIcon, QrCode } from ''lucide-react''', 'import { QrCode } from ''lucide-react''`nimport { ViewIcon, ViewOffIcon } from ''@chakra-ui/icons''' | Set-Content Login.jsx"

echo Fixing Register.jsx...
powershell -Command "(Get-Content Register.jsx) -replace 'import { ViewIcon, ViewOffIcon, QrCode } from ''lucide-react''', 'import { QrCode } from ''lucide-react''`nimport { ViewIcon, ViewOffIcon } from ''@chakra-ui/icons''' | Set-Content Register.jsx"

echo.
echo ✅ Import fixes applied!
echo.
echo You can now run: npm run start:dev

pause

