# 🎓 E-Learning Platform

A modern, full-stack e-learning platform built with **Spring Boot**, **React**, and **Keycloak** for secure, role-based course management.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Frontend](https://img.shields.io/badge/frontend-React-61dafb)
![Backend](https://img.shields.io/badge/backend-Spring%20Boot-6db33f)
![Auth](https://img.shields.io/badge/auth-Keycloak-blue)


## Architecture

```
┌─────────────────┐
│   React (Vite)  │  Frontend (Port 3000)
│   + Keycloak.js │
└────────┬────────┘
         │ HTTP + JWT
         ↓
┌─────────────────┐
│  Spring Boot    │  Backend API (Port 8081)
│  + Spring       │
│    Security     │
└────────┬────────┘
         │ OAuth2
         ↓
┌─────────────────┐
│    Keycloak     │  Auth Server (Port 8080)
│  elearning-realm│
└─────────────────┘
```

---

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/me` | Any authenticated user | Get user info and roles |
| GET | `/api/courses` | STUDENT, ADMIN | List all courses |
| POST | `/api/courses` | ADMIN only | Create a new course |

---

## Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Keycloak server running on port 8080
- Maven or Gradle

### 1. Start Backend
```bash
cd course
./mvnw spring-boot:run
# Runs on http://localhost:8081
```

### 2. Start Frontend
```bash
cd elearning-frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### 3. Configure Keycloak
- **Realm**: `elearning-realm`
- **Client**: `elearning-client`
- **Roles**: `ROLE_STUDENT`, `ROLE_ADMIN`
- **Users**: Create users with appropriate roles

## Project Structure

```
e-learning/
├── course/                          # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/zakaria/course/
│   │       ├── CourseApplication.java
│   │       ├── config/
│   │       │   └── SecurityConfig.java
│   │       ├── model/
│   │       │   └── Course.java
│   │       ├── security/
│   │       │   └── KeycloakRealmRoleConverter.java
│   │       └── web/
│   │           └── CourseController.java
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
│
├── elearning-frontend/              # React Frontend
│   ├── src/
│   │   ├── App.jsx                 # Main app component
│   │   ├── App.css                 # App styles
│   │   ├── AvailableCourses.jsx   # Course list component
│   │   ├── AvailableCourses.css   # Course list styles
│   │   ├── AdminCourses.jsx       # Admin panel component
│   │   ├── AdminCourses.css       # Admin panel styles
│   │   ├── AuthContext.jsx        # Authentication context
│   │   ├── keycloak.js            # Keycloak config
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── test-endpoints.sh                # Automated API tests
├── API_DOCUMENTATION.md             # Complete API reference
├── SUMMARY.md                       # Project summary
└── README.md                        # This file
```

---

## Design System

![img.png](img.png)

### Components
- **Cards**: White background, shadows, rounded corners
- **Buttons**: Gradient effects, hover animations
- **Inputs**: Focus states with colored borders
- **Badges**: Color-coded role indicators
- **Alerts**: Success (green) and error (red) messages

---

## 📖 Documentation

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference with curl examples
- **[SUMMARY.md](./SUMMARY.md)** - Detailed project summary and changes
- **[test-endpoints.sh](./test-endpoints.sh)** - Automated testing script

---

## 🧪 Testing

### Run Automated Tests
```bash
./test-endpoints.sh
```

### Manual Testing Checklist
- [ ] Backend starts on port 8081
- [ ] Frontend starts on port 5173
- [ ] Keycloak login redirects properly
- [ ] STUDENT can view courses
- [ ] STUDENT cannot create courses (403)
- [ ] ADMIN can view courses
- [ ] ADMIN can create courses
- [ ] New courses appear in list
- [ ] Error messages display correctly
- [ ] Responsive design works on mobile

---

## 🎯 User Flows

### Student User
1. **Login** → Keycloak authentication
2. **View Courses** → See list of available courses
3. **Access Denied** → Cannot create new courses
4. **Logout** → Return to login

### Admin User
1. **Login** → Keycloak authentication
2. **View Courses** → See list of available courses
3. **Create Course** → Fill form and submit
4. **Success** → See confirmation message
5. **Refresh** → New course appears in list
6. **Logout** → Return to login

---

## Technologies

### Backend
- **Spring Boot 3.x** - Application framework
- **Spring Security** - Security and OAuth2
- **Spring Web** - REST API
- **Java 17+** - Programming language

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Keycloak.js** - Authentication client
- **CSS3** - Styling with modern features

### Authentication
- **Keycloak** - Identity and access management
- **OAuth2 / OIDC** - Authentication protocol
- **JWT** - Token format


