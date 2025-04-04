# Start the E-Commerce App

Write-Host "Starting E-Commerce App..." -ForegroundColor Cyan

# Kill any existing http-server or Java processes
Write-Host "Stopping any running servers..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.MainWindowTitle -match "http-server"} | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name "java" -ErrorAction SilentlyContinue | Where-Object {$_.MainWindowTitle -match "spring"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Start the frontend server
Write-Host "Starting frontend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location './frontend'; Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; npx http-server -p 8001"

# Start the backend server
Write-Host "Starting backend server..." -ForegroundColor Green
$env:Path += ";$env:USERPROFILE\tools\apache-maven-3.9.6\bin"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; mvn spring-boot:run"

Write-Host "`nFrontend running at: http://localhost:8001" -ForegroundColor Cyan
Write-Host "Backend running at: http://localhost:8080" -ForegroundColor Cyan
Write-Host "H2 Console: http://localhost:8080/h2-console" -ForegroundColor Cyan

# Wait a moment for servers to start
Start-Sleep -Seconds 3

# Open the app in the default browser
Write-Host "`nOpening app in browser..." -ForegroundColor Magenta
Start-Process "http://localhost:8001" 