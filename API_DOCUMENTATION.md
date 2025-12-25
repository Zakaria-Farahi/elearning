# E-Learning Platform - API Documentation & Testing Guide

## 📋 Backend Endpoints Summary

### Base URL
- **Backend API**: `http://localhost:8081`
- **Keycloak**: `http://localhost:8080`
- **Realm**: `elearning-realm`
- **Client ID**: `elearning-client`

---

## 🔐 Authentication

All endpoints require a Bearer token from Keycloak.

### Get Access Token

```bash
# Get token (replace username/password with your credentials)
curl -X POST "http://localhost:8080/realms/elearning-realm/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=YOUR_USERNAME&password=YOUR_PASSWORD&grant_type=password&client_id=elearning-client"
```

---

## 📚 API Endpoints

### 1. GET /api/me
**Description**: Get JWT claims for the authenticated user  
**Access**: Any authenticated user  
**Response**: JSON object with JWT claims including roles

```bash
curl -X GET "http://localhost:8081/api/me" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "realm_access": {
    "roles": ["ROLE_STUDENT", "ROLE_ADMIN"]
  }
}
```

---

### 2. GET /api/courses
**Description**: Get all available courses  
**Access**: STUDENT or ADMIN role  
**Response**: Array of course objects

```bash
curl -X GET "http://localhost:8081/api/courses" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
[
  {
    "id": 1,
    "title": "Spring Boot Basics",
    "description": "Introduction à Spring Boot"
  },
  {
    "id": 2,
    "title": "React Fundamentals",
    "description": "Bases de React pour SPA"
  }
]
```

---

### 3. POST /api/courses
**Description**: Create a new course  
**Access**: ADMIN role only  
**Request Body**: Course object (without ID)  
**Response**: Created course with generated ID

```bash
curl -X POST "http://localhost:8081/api/courses" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Docker",
    "description": "Master containerization with Docker"
  }'
```

**Response Example**:
```json
{
  "id": 3,
  "title": "Advanced Docker",
  "description": "Master containerization with Docker"
}
```

---

## 🧪 Testing Script

A comprehensive testing script has been created: `test-endpoints.sh`

### Run All Tests

```bash
# Make script executable (if not already)
chmod +x test-endpoints.sh

# Run tests
./test-endpoints.sh
```

### What the Script Tests

1. ✅ Student authentication
2. ✅ GET /api/me (STUDENT role)
3. ✅ GET /api/courses (STUDENT role)
4. ❌ POST /api/courses (STUDENT role - should fail with 403)
5. ✅ Admin authentication
6. ✅ GET /api/me (ADMIN role)
7. ✅ GET /api/courses (ADMIN role)
8. ✅ POST /api/courses (ADMIN role - should succeed)
9. ✅ Verify new course was added
10. ❌ GET /api/courses without token (should fail with 401)

---

## 🎨 Frontend Features

### Fixed Issues
1. ✅ **Keycloak Client ID**: Updated from `react-client` to `elearning-client` to match backend
2. ✅ **Authentication Flow**: Proper token handling with AuthContext
3. ✅ **Error Handling**: Comprehensive error messages for all API calls
4. ✅ **Loading States**: Beautiful loading spinners and states

### New Styling Features
1. 🎨 **Modern Design System**: 
   - Custom CSS variables for colors, shadows, spacing
   - Gradient backgrounds
   - Professional color palette (primary: indigo, secondary: green)

2. 🎯 **Responsive Layout**:
   - Mobile-first design
   - Grid layout that adapts to screen size
   - Touch-friendly buttons and inputs

3. 💅 **Beautiful Components**:
   - **App.jsx**: Header with user info, role badges, gradient background
   - **AvailableCourses**: Card-based course list with hover effects
   - **AdminCourses**: Form with validation, success/error alerts, info box

4. ✨ **Animations**:
   - Fade-in animations on load
   - Smooth transitions on hover
   - Loading spinners
   - Transform effects

5. 🎯 **UX Improvements**:
   - Clear visual hierarchy
   - Accessible form labels with icons
   - Success/error messages with auto-dismiss
   - Empty states with helpful messages
   - Info boxes with tips

### Component Structure

```
elearning-frontend/
├── src/
│   ├── App.jsx                  # Main app with header, layout, footer
│   ├── App.css                  # App-specific styles
│   ├── AvailableCourses.jsx    # Course list with loading/error states
│   ├── AvailableCourses.css    # Course list styles
│   ├── AdminCourses.jsx        # Course creation form
│   ├── AdminCourses.css        # Admin form styles
│   ├── AuthContext.jsx         # Keycloak authentication provider
│   ├── keycloak.js             # Keycloak config (FIXED)
│   ├── main.jsx                # App entry point
│   └── index.css               # Global styles & design system
```

---

## 🚀 Running the Application

### Backend (Spring Boot)
```bash
cd course
./mvnw spring-boot:run
# OR if already running, it's on http://localhost:8081
```

### Keycloak
```bash
# Should be running on http://localhost:8080
# Make sure elearning-realm is configured with:
# - Client: elearning-client
# - Users with ROLE_STUDENT and/or ROLE_ADMIN
```

### Frontend (React + Vite)
```bash
cd elearning-frontend
npm install  # if not already done
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port Vite assigns).

---

## 🔑 Expected Keycloak Setup

### Realm: `elearning-realm`

### Client: `elearning-client`
- Access Type: public
- Valid Redirect URIs: `http://localhost:5173/*`
- Web Origins: `http://localhost:5173`

### Realm Roles
- `STUDENT` - Can view courses
- `ADMIN` - Can view and create courses

### Sample Users

#### Student User
- Username: `student` or `student1`
- Password: `password` (or `student`)
- Roles: `ROLE_STUDENT`

#### Admin User
- Username: `admin` or `admin1`
- Password: `password` (or `admin`)
- Roles: `ROLE_ADMIN`, `ROLE_STUDENT`

---

## 📝 Course Model

```java
{
  "id": Long,           // Auto-generated
  "title": String,      // Required
  "description": String // Required
}
```

---

## ⚠️ Common Issues & Solutions

### 1. 401 Unauthorized
**Problem**: Invalid or expired token  
**Solution**: Refresh the page to get a new token, or check Keycloak configuration

### 2. 403 Forbidden
**Problem**: User doesn't have required role  
**Solution**: 
- For viewing courses: User needs `ROLE_STUDENT` or `ROLE_ADMIN`
- For creating courses: User needs `ROLE_ADMIN`

### 3. CORS Errors
**Problem**: Cross-origin request blocked  
**Solution**: Check Spring Security configuration in `SecurityConfig.java`

### 4. Connection Refused
**Problem**: Backend or Keycloak not running  
**Solution**: 
- Verify backend is running on port 8081
- Verify Keycloak is running on port 8080

### 5. Client ID Mismatch
**Problem**: Frontend can't authenticate  
**Solution**: ✅ FIXED - Now using `elearning-client` in both frontend and backend

---

## 🎯 Testing Checklist

- [ ] Backend is running on port 8081
- [ ] Keycloak is running on port 8080
- [ ] Realm `elearning-realm` exists
- [ ] Client `elearning-client` is configured
- [ ] Users exist with proper roles
- [ ] Run `./test-endpoints.sh` successfully
- [ ] Frontend loads without errors
- [ ] Can login via Keycloak
- [ ] Student can see courses
- [ ] Student cannot create courses
- [ ] Admin can see courses
- [ ] Admin can create courses
- [ ] New courses appear in the list

---

## 📊 HTTP Status Codes

| Code | Meaning | When it happens |
|------|---------|----------------|
| 200 | OK | Successful GET request |
| 201 | Created | Successful POST request |
| 401 | Unauthorized | No token or invalid token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 500 | Server Error | Backend error |

---

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (#4f46e5)
- **Secondary**: Green (#10b981)
- **Danger**: Red (#ef4444)
- **Warning**: Amber (#f59e0b)

### Typography
- Font: Inter, system-ui, sans-serif
- Base size: 16px
- Line height: 1.6

### Shadows
- Small: Subtle elevation
- Medium: Card hover state
- Large: Modal/dropdown
- XL: Prominent overlays

### Border Radius
- Small: 0.375rem
- Medium: 0.5rem
- Large: 0.75rem
- XL: 1rem

---

## 📚 Resources

- [Spring Security OAuth2 Resource Server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [React Keycloak](https://www.keycloak.org/securing-apps/react)
- [Vite Documentation](https://vitejs.dev/)

---

## 🤝 Contributing

When adding new features:
1. Update this documentation
2. Add curl examples to `test-endpoints.sh`
3. Update frontend components with proper styling
4. Test with both STUDENT and ADMIN roles
5. Ensure responsive design works on mobile

---

**Last Updated**: December 25, 2025  
**Version**: 1.0.0

