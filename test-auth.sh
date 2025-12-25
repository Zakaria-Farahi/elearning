#!/bin/bash

echo "🔍 Testing E-Learning Application Cookie Authentication"
echo "========================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if services are running
echo "📡 Checking if services are running..."
echo ""

# Check backend
if curl -s http://localhost:8081/actuator/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running on port 8081${NC}"
else
    echo -e "${RED}❌ Backend is NOT running on port 8081${NC}"
    echo "   Start it with: cd course && ./mvnw spring-boot:run"
fi

# Check Keycloak
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Keycloak is running on port 8080${NC}"
else
    echo -e "${RED}❌ Keycloak is NOT running on port 8080${NC}"
    echo "   Start it with: docker-compose up -d (in course directory)"
fi

# Check frontend (try both ports)
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is running on port 3000${NC}"
elif curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is running on port 5173${NC}"
else
    echo -e "${RED}❌ Frontend is NOT running${NC}"
    echo "   Start it with: cd elearning-frontend && npm run dev"
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Make sure all services are running (backend, Keycloak, frontend)"
echo "2. Open your browser at http://localhost:3000 (or 5173)"
echo "3. Open DevTools (F12) -> Console tab"
echo "4. You should see Keycloak authentication logs"
echo "5. After login, check if cookies are stored:"
echo "   - Go to Application tab (Chrome) or Storage tab (Firefox)"
echo "   - Check Cookies section"
echo "6. Verify API calls work:"
echo "   - Go to Network tab"
echo "   - Look for requests to /api/courses"
echo "   - Check if Authorization header is present"
echo ""
echo "${YELLOW}⚠️  If you still see 'Non authentifié':${NC}"
echo "   - Clear browser cache and cookies"
echo "   - Restart backend: cd course && ./mvnw spring-boot:run"
echo "   - Check COOKIE_FIX_SUMMARY.md for detailed troubleshooting"
echo ""

