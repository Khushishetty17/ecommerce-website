# Test the e-commerce API endpoints

$baseUrl = "http://localhost:8080"
$authToken = ""

Write-Host "E-Commerce API Test Script" -ForegroundColor Blue
Write-Host "==========================" -ForegroundColor Blue
Write-Host 

# Function to check if the server is up
function Check-Server {
    Write-Host "Checking if server is running..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri $baseUrl -Method Get -UseBasicParsing -ErrorAction SilentlyContinue
        Write-Host "Server is running! Status code: $($response.StatusCode)" -ForegroundColor Green
        return $true
    } catch {
        # Check if the error is 401 Unauthorized, which means the server is running
        if ($_.Exception.Response -and $_.Exception.Response.StatusCode.value__ -eq 401) {
            Write-Host "Server is running! (Received 401 Unauthorized)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "Server is not responding correctly. Error: $($_.Exception.Message)" -ForegroundColor Red
            return $false
        }
    }
}

# Function to safely invoke a web request and handle errors
function Invoke-SafeWebRequest {
    param(
        [string]$Uri,
        [string]$Method = "Get",
        [string]$Body = $null,
        [string]$ContentType = "application/json",
        [string]$Authorization = $null
    )
    
    $headers = @{}
    if ($Authorization) {
        $headers.Add("Authorization", "Bearer $Authorization")
    }
    
    try {
        $params = @{
            Uri = $Uri
            Method = $Method
            UseBasicParsing = $true
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $params.Add("Body", $Body)
            $params.Add("ContentType", $ContentType)
        }
        
        if ($headers.Count -gt 0) {
            $params.Add("Headers", $headers)
        }
        
        $response = Invoke-WebRequest @params
        return $response
    } catch {
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.value__
            $statusDescription = $_.Exception.Response.StatusDescription
            
            # Try to get response body for more details
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            $reader.Close()
            
            return @{
                IsSuccess = $false
                StatusCode = $statusCode
                StatusDescription = $statusDescription
                Content = $responseBody
                Error = $_.Exception.Message
            }
        } else {
            return @{
                IsSuccess = $false
                Error = $_.Exception.Message
            }
        }
    }
}

# Function to test the public endpoint
function Test-PublicEndpoint {
    Write-Host "`nTesting public endpoint..." -ForegroundColor Yellow
    $response = Invoke-SafeWebRequest -Uri "$baseUrl/api/test/public"
    
    if ($response.IsSuccess -eq $false) {
        Write-Host "Failed to access public endpoint. Status: $($response.StatusCode) - $($response.Error)" -ForegroundColor Red
    } else {
        Write-Host "Success! Status code: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
    }
}

# Function to test the categories
function Test-Categories {
    Write-Host "`nTesting categories endpoint..." -ForegroundColor Yellow
    $response = Invoke-SafeWebRequest -Uri "$baseUrl/api/categories"
    
    if ($response.IsSuccess -eq $false) {
        Write-Host "Failed to access categories endpoint. Status: $($response.StatusCode) - $($response.Error)" -ForegroundColor Red
    } else {
        Write-Host "Success! Status code: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
    }
}

# Function to test the products
function Test-Products {
    Write-Host "`nTesting products endpoint..." -ForegroundColor Yellow
    $response = Invoke-SafeWebRequest -Uri "$baseUrl/api/products"
    
    if ($response.IsSuccess -eq $false) {
        Write-Host "Failed to access products endpoint. Status: $($response.StatusCode) - $($response.Error)" -ForegroundColor Red
    } else {
        Write-Host "Success! Status code: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
    }
}

# Function to authenticate
function Authenticate {
    Write-Host "`nAuthenticating as admin..." -ForegroundColor Yellow
    $loginRequest = @{
        username = "admin"
        password = "adminpassword"
    } | ConvertTo-Json
    
    $response = Invoke-SafeWebRequest -Uri "$baseUrl/api/auth/signin" -Method "Post" -Body $loginRequest
    
    if ($response.IsSuccess -eq $false) {
        Write-Host "Authentication failed. Status: $($response.StatusCode) - $($response.Error)" -ForegroundColor Red
        return $false
    } else {
        try {
            $responseObj = $response.Content | ConvertFrom-Json
            $script:authToken = $responseObj.token
            
            if ($script:authToken) {
                Write-Host "Authentication successful! Token received." -ForegroundColor Green
                return $true
            } else {
                Write-Host "Authentication failed. No token in response." -ForegroundColor Red
                return $false
            }
        } catch {
            Write-Host "Authentication failed. Could not parse response: $($_.Exception.Message)" -ForegroundColor Red
            return $false
        }
    }
}

# Test sequence
if (Check-Server) {
    Test-PublicEndpoint
    Test-Categories
    Test-Products
    
    if (Authenticate) {
        Write-Host "`nAuthentication successful!" -ForegroundColor Green
    } else {
        Write-Host "`nCouldn't authenticate. Some tests may fail." -ForegroundColor Yellow
    }
} else {
    Write-Host "Cannot proceed with tests because the server is not running." -ForegroundColor Red
} 