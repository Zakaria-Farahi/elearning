#!/bin/bash

# Backend Endpoint Testing Script
# E-Learning Platform - Course Service (Port 8081)
# Keycloak Server (Port 8080)

echo "=========================================="
echo "E-Learning Backend Endpoint Testing"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
KEYCLOAK_URL="http://localhost:8080"
BACKEND_URL="http://localhost:8081"
REALM="elearning-realm"
CLIENT_ID="elearning-client"

echo -e "${BLUE}Testing with STUDENT role${NC}"
echo "==========================================="
echo ""

# Get token for STUDENT user
echo "1. Getting access token for STUDENT..."
STUDENT_TOKEN=$(curl -s -X POST "${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user1&password=password&grant_type=password&client_id=${CLIENT_ID}" | jq -r '.access_token')

if [ "$STUDENT_TOKEN" == "null" ] || [ -z "$STUDENT_TOKEN" ]; then
    echo -e "${RED}❌ Failed to get STUDENT token${NC}"
    echo "Trying with student1/password credentials..."
    STUDENT_TOKEN=$(curl -s -X POST "${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token" \
      -H "Content-Type: application/x-www-form-urlencoded" \
      -d "username=student1&password=password&grant_type=password&client_id=${CLIENT_ID}" | jq -r '.access_token')
fi

if [ "$STUDENT_TOKEN" == "null" ] || [ -z "$STUDENT_TOKEN" ]; then
    echo -e "${RED}❌ Failed to get STUDENT token with both credentials${NC}"
else
    echo -e "${GREEN}✓ Token obtained (${#STUDENT_TOKEN} chars)${NC}"
    echo ""

    # Test 1: GET /api/me (STUDENT)
    echo "2. GET /api/me (Student user info)"
    echo "-----------------------------------"
    curl -s -X GET "${BACKEND_URL}/api/me" \
      -H "Authorization: Bearer ${STUDENT_TOKEN}" | jq '.'
    echo ""

    # Test 2: GET /api/courses (STUDENT)
    echo "3. GET /api/courses (List all courses - STUDENT access)"
    echo "--------------------------------------------------------"
    curl -s -X GET "${BACKEND_URL}/api/courses" \
      -H "Authorization: Bearer ${STUDENT_TOKEN}" | jq '.'
    echo ""

    # Test 3: POST /api/courses (STUDENT - should fail with 403)
    echo "4. POST /api/courses (Try to create course - should FAIL with 403)"
    echo "-------------------------------------------------------------------"
    curl -i -X POST "${BACKEND_URL}/api/courses" \
      -H "Authorization: Bearer ${STUDENT_TOKEN}" \
      -H "Content-Type: application/json" \
      -d '{"title":"Unauthorized Course","description":"This should fail"}' 2>&1 | head -15
    echo ""
fi

echo ""
echo -e "${BLUE}Testing with ADMIN role${NC}"
echo "==========================================="
echo ""

# Get token for ADMIN user
echo "5. Getting access token for ADMIN..."
ADMIN_TOKEN=$(curl -s -X POST "${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin1&password=password&grant_type=password&client_id=${CLIENT_ID}" | jq -r '.access_token')

if [ "$ADMIN_TOKEN" == "null" ] || [ -z "$ADMIN_TOKEN" ]; then
    echo -e "${RED}❌ Failed to get ADMIN token${NC}"
    echo "Trying with admin1/password credentials..."
    ADMIN_TOKEN=$(curl -s -X POST "${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token" \
      -H "Content-Type: application/x-www-form-urlencoded" \
      -d "username=admin1&password=password&grant_type=password&client_id=${CLIENT_ID}" | jq -r '.access_token')
fi

if [ "$ADMIN_TOKEN" == "null" ] || [ -z "$ADMIN_TOKEN" ]; then
    echo -e "${RED}❌ Failed to get ADMIN token${NC}"
else
    echo -e "${GREEN}✓ Token obtained (${#ADMIN_TOKEN} chars)${NC}"
    echo ""

    # Test 4: GET /api/me (ADMIN)
    echo "6. GET /api/me (Admin user info)"
    echo "---------------------------------"
    curl -s -X GET "${BACKEND_URL}/api/me" \
      -H "Authorization: Bearer ${ADMIN_TOKEN}" | jq '.'
    echo ""

    # Test 5: GET /api/courses (ADMIN)
    echo "7. GET /api/courses (List all courses - ADMIN access)"
    echo "------------------------------------------------------"
    curl -s -X GET "${BACKEND_URL}/api/courses" \
      -H "Authorization: Bearer ${ADMIN_TOKEN}" | jq '.'
    echo ""

    # Test 6: POST /api/courses (ADMIN - should succeed)
    echo "8. POST /api/courses (Create new course - should SUCCEED)"
    echo "---------------------------------------------------------"
    curl -s -X POST "${BACKEND_URL}/api/courses" \
      -H "Authorization: Bearer ${ADMIN_TOKEN}" \
      -H "Content-Type: application/json" \
      -d '{"title":"Advanced Docker","description":"Master containerization with Docker"}' | jq '.'
    echo ""

    # Test 7: GET /api/courses again to see the new course
    echo "9. GET /api/courses (Verify new course was added)"
    echo "--------------------------------------------------"
    curl -s -X GET "${BACKEND_URL}/api/courses" \
      -H "Authorization: Bearer ${ADMIN_TOKEN}" | jq '.'
    echo ""
fi

echo ""
echo -e "${BLUE}Testing without authentication${NC}"
echo "==========================================="
echo ""

# Test 8: GET /api/courses without token (should fail with 401)
echo "10. GET /api/courses (No token - should FAIL with 401)"
echo "-------------------------------------------------------"
curl -i -X GET "${BACKEND_URL}/api/courses" 2>&1 | head -15
echo ""

echo ""
echo "=========================================="
echo "Endpoint Testing Complete!"
echo "=========================================="
echo ""
echo "Summary of Available Endpoints:"
echo "-------------------------------"
echo "1. GET  ${BACKEND_URL}/api/me"
echo "   - Returns JWT claims for authenticated user"
echo "   - Requires: Any authenticated user"
echo ""
echo "2. GET  ${BACKEND_URL}/api/courses"
echo "   - Returns list of all courses"
echo "   - Requires: STUDENT or ADMIN role"
echo ""
echo "3. POST ${BACKEND_URL}/api/courses"
echo "   - Creates a new course"
echo "   - Requires: ADMIN role only"
echo "   - Body: {\"title\": \"...\", \"description\": \"...\"}"
echo ""

