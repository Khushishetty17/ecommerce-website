#!/bin/bash

BASE_URL="http://localhost:8080"
AUTH_TOKEN=""

echo "E-Commerce API Test Script"
echo "=========================="
echo

# Function to check if the server is up
check_server() {
  echo "Checking if server is running..."
  response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL)
  if [ $response -eq 200 ] || [ $response -eq 404 ] || [ $response -eq 401 ]; then
    echo "Server is running!"
    return 0
  else
    echo "Server is not responding (status: $response). Please make sure the application is running."
    return 1
  fi
}

# Function to perform authentication
authenticate() {
  echo -e "\nAuthenticating as admin..."
  response=$(curl -s -X POST "$BASE_URL/api/auth/signin" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin", "password":"adminpassword"}')
  
  echo "Authentication response: $response"
  
  # Extract token using grep and sed
  AUTH_TOKEN=$(echo "$response" | grep -o '"token":"[^"]*"' | sed 's/"token":"//;s/"//')
  
  if [ -n "$AUTH_TOKEN" ]; then
    echo "Authentication successful! Token received."
    return 0
  else
    echo "Authentication failed. No token received."
    return 1
  fi
}

# Function to get all categories
get_categories() {
  echo -e "\nFetching categories..."
  response=$(curl -s -X GET "$BASE_URL/api/categories" \
    -H "Content-Type: application/json")
  
  echo "Categories response: $response"
}

# Function to get all products
get_products() {
  echo -e "\nFetching products..."
  response=$(curl -s -X GET "$BASE_URL/api/products" \
    -H "Content-Type: application/json")
  
  echo "Products response: $response"
}

# Function to test cart operations (requires authentication)
test_cart() {
  if [ -z "$AUTH_TOKEN" ]; then
    echo "Cannot test cart without authentication"
    return 1
  fi
  
  echo -e "\nTesting cart operations..."
  
  # Get current cart
  echo "Getting current cart..."
  curl -s -X GET "$BASE_URL/api/cart" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $AUTH_TOKEN"
  
  # Add item to cart
  echo -e "\nAdding item to cart..."
  curl -s -X POST "$BASE_URL/api/cart/add" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -d '{"productId": 1, "quantity": 2}'
  
  # Get updated cart
  echo -e "\nGetting updated cart..."
  curl -s -X GET "$BASE_URL/api/cart" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $AUTH_TOKEN"
}

# Main test sequence
main() {
  check_server
  if [ $? -ne 0 ]; then
    exit 1
  fi
  
  get_categories
  get_products
  
  authenticate
  if [ $? -eq 0 ]; then
    test_cart
  fi
  
  echo -e "\nAPI tests completed!"
}

# Run the main function
main 