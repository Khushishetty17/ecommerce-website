@echo off
echo Starting E-Commerce Application...

REM Check if Java is installed
where java >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Java not found! Please install Java 21 or higher.
    exit /b 1
)

REM Check Java version
java -version 2>&1 | findstr /i "version"
echo.

REM Set Spring Boot profile to dev
set SPRING_PROFILES_ACTIVE=dev

REM Check if the target directory exists
if not exist "target" (
    echo Building the application...
    call mvn clean package -DskipTests
    if %ERRORLEVEL% neq 0 (
        echo Build failed!
        exit /b 1
    )
)

REM Run the application
echo Starting the application with Dev profile...
start java -jar target/ecommerce-website-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev

echo.
echo Application is starting...
echo.
echo H2 Console: http://localhost:8080/h2-console
echo API Test URL: http://localhost:8080/api/test/public
echo.
echo Press Ctrl+C to stop the application. 