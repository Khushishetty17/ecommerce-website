@echo off
echo Testing the E-Commerce API...
echo ===========================
echo.

set BASE_URL=http://localhost:8080

echo Checking if server is running...
curl -s -o nul -w "%%{http_code}" %BASE_URL%
if %ERRORLEVEL% neq 0 (
    echo Server is not running!
    exit /b 1
)
echo Server is running!
echo.

echo Testing public endpoint...
curl -s %BASE_URL%/api/test/public
echo.
echo.

echo Testing categories endpoint...
curl -s %BASE_URL%/api/categories
echo.
echo.

echo Testing products endpoint...
curl -s %BASE_URL%/api/products
echo.
echo.

echo Testing authentication...
curl -s -X POST %BASE_URL%/api/auth/signin -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"adminpassword\"}"
echo.
echo.

echo Testing completed!
pause 