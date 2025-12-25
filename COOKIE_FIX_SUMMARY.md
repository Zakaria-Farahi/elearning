# Cookie Authentication Fix Summary

## Problem
The frontend was showing "Non authentifié" after Keycloak login because cookies were not being stored/sent properly in cross-origin requests between:
- Frontend: `http://localhost:3000` (or 5173)
- Backend: `http://localhost:8081`
- Keycloak: `http://localhost:8080`

## Changes Made

### 1. Frontend Changes

#### `keycloak.js`
- ✅ Enabled Keycloak logging for debugging

#### `AuthContext.jsx`
- ✅ Added `credentials: 'include'` to all fetch calls
- ✅ Updated Keycloak init with better options:
  - `enableLogging: true` for debugging
  - `pkceMethod: 'S256'` for better security
  - `flow: 'standard'` for OAuth flow

#### `AvailableCourses.jsx`
- ✅ Added `credentials: 'include'` to course fetch request

#### `AdminCourses.jsx`
- ✅ Added `credentials: 'include'` to course creation request

### 2. Backend Changes

#### `application.yml`
- ✅ Added session cookie configuration:
  ```yaml
  server:
    servlet:
      session:
        cookie:
          same-site: lax      # Allow cross-site with safe methods
          secure: false        # false for localhost (use true in production with HTTPS)
          http-only: true      # Prevent XSS attacks
  ```

#### `SecurityConfig.java` (Already configured)
- ✅ CORS configuration with `allowCredentials(true)`
- ✅ Allowed origins: `localhost:3000` and `localhost:5173`

### 3. Keycloak Client Configuration (Manual Check Required)

Ensure your Keycloak client (`react-client`) has these settings:

1. **Valid Redirect URIs:**
   - `http://localhost:3000/*`
   - `http://localhost:5173/*`

2. **Valid Post Logout Redirect URIs:**
   - `http://localhost:3000/*`
   - `http://localhost:5173/*`

3. **Web Origins:**
   - `http://localhost:3000`
   - `http://localhost:5173`
   - `+` (to allow all Valid Redirect URIs)

4. **Access Type/Client Authentication:**
   - Public or Standard Flow enabled

## Testing Instructions

### 1. Restart Backend
```bash
cd course
./mvnw spring-boot:run
```

### 2. Restart Frontend
```bash
cd elearning-frontend
npm run dev
```

### 3. Test Flow
1. Open `http://localhost:3000` (or 5173)
2. You should be redirected to Keycloak login
3. Login with your credentials
4. After successful login, you should:
   - See your user info in the header
   - See your roles (STUDENT/ADMIN)
   - Be able to view courses
   - (If ADMIN) Be able to create courses

### 4. Debug with Browser DevTools
Open DevTools (F12) and check:

**Console Tab:**
- Look for Keycloak logs
- Check for any CORS errors
- Verify token is present

**Network Tab:**
- Check requests to `/api/courses` and `/api/me`
- Verify `Authorization: Bearer <token>` header is sent
- Check if cookies are being sent (Cookies column)

**Application Tab (Chrome) / Storage Tab (Firefox):**
- Check if cookies are stored under `localhost:8080`, `localhost:8081`
- Look for session cookies

## Common Issues & Solutions

### Issue: Still seeing "Non authentifié"
**Solution:** 
- Clear browser cache and cookies
- Restart both backend and frontend
- Verify Keycloak client configuration

### Issue: CORS errors in console
**Solution:**
- Check backend SecurityConfig has correct origins
- Verify `allowCredentials(true)` is set
- Restart backend after changes

### Issue: Token not being sent
**Solution:**
- Verify `credentials: 'include'` is in all fetch calls
- Check browser is allowing cookies (not in incognito with strict settings)

### Issue: 401 Unauthorized
**Solution:**
- Check token expiration (default is 5 minutes)
- Verify token refresh is working
- Check Keycloak is running on port 8080

## Key Concepts

### Why `credentials: 'include'`?
By default, browsers don't send cookies in cross-origin requests. Setting `credentials: 'include'` tells the browser to include cookies even when the request is to a different origin.

### Why `allowCredentials(true)` in Backend?
The backend must explicitly allow credentials (cookies) in CORS responses. Without this, the browser will block the response even if credentials are sent.

### Why `same-site: lax`?
- `strict`: Cookies never sent cross-site (too restrictive)
- `lax`: Cookies sent on safe methods (GET) and top-level navigation (good for our case)
- `none`: Cookies always sent (requires `secure: true` and HTTPS)

## Production Notes

For production deployment:
1. Set `secure: true` in cookie configuration
2. Use HTTPS for all services
3. Update allowed origins to production URLs
4. Consider using `same-site: strict` for enhanced security
5. Enable PKCE (already configured)
6. Use environment variables for URLs

