@echo off
echo Starting E-Commerce App...

REM Start the frontend server
start cmd /k "cd frontend && npx http-server -p 8001"

REM Start the backend server
start cmd /k "$env:Path += ";$env:USERPROFILE\tools\apache-maven-3.9.6\bin"; mvn spring-boot:run"

echo Frontend running at: http://localhost:8001
echo Backend running at: http://localhost:8080

echo.
echo Press any key to open the app in your browser...
pause > nul
start "" http://localhost:8001 