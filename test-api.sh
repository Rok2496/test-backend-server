#!/bin/bash

BASE_URL="http://localhost:3000"

echo "🚀 Testing JWT Authentication Backend"
echo "======================================"

# Create test user
echo "1. Creating test user..."
curl -X POST $BASE_URL/setup -H "Content-Type: application/json"
echo -e "\n\n"

# Login
echo "2. Logging in..."
LOGIN_RESPONSE=$(curl -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}' \
  -c cookies.txt -b cookies.txt)
echo $LOGIN_RESPONSE
echo -e "\n\n"

# Access protected route
echo "3. Accessing protected route..."
PROFILE_RESPONSE=$(curl -X GET $BASE_URL/profile \
  -H "Content-Type: application/json" \
  -c cookies.txt -b cookies.txt)
echo $PROFILE_RESPONSE
echo -e "\n\n"

# Refresh token
echo "4. Refreshing token..."
REFRESH_RESPONSE=$(curl -X POST $BASE_URL/auth/refresh \
  -H "Content-Type: application/json" \
  -c cookies.txt -b cookies.txt)
echo $REFRESH_RESPONSE
echo -e "\n\n"

# Access protected route again
echo "5. Accessing protected route after refresh..."
PROFILE_RESPONSE2=$(curl -X GET $BASE_URL/profile \
  -H "Content-Type: application/json" \
  -c cookies.txt -b cookies.txt)
echo $PROFILE_RESPONSE2
echo -e "\n\n"

# Logout
echo "6. Logging out..."
LOGOUT_RESPONSE=$(curl -X POST $BASE_URL/auth/logout \
  -H "Content-Type: application/json" \
  -c cookies.txt -b cookies.txt)
echo $LOGOUT_RESPONSE
echo -e "\n\n"

# Try to access protected route after logout
echo "7. Trying to access protected route after logout (should fail)..."
PROFILE_RESPONSE3=$(curl -X GET $BASE_URL/profile \
  -H "Content-Type: application/json" \
  -c cookies.txt -b cookies.txt)
echo $PROFILE_RESPONSE3
echo -e "\n\n"

# Clean up
rm -f cookies.txt

echo "✅ Test completed!" 