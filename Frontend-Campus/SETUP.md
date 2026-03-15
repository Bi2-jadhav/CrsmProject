# React JS Recruitment Portal - Setup Guide

## Project Overview

This is a **pure React JS** recruitment platform with **NO TypeScript** and **NO Next.js**. It's built with:

- **React 19** - UI library
- **Vite** - Build tool & dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Sonner** - Toast notifications

## Project Structure

```
src/
├── App.jsx                    # Main router configuration
├── main.jsx                   # Entry point
├── index.css                  # Global styles
│
├── pages/                     # Page components
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx         # 3-role selection
│   ├── StudentDashboard.jsx
│   ├── CompanyDashboard.jsx
│   ├── AdminDashboard.jsx
│   └── UnauthorizedPage.jsx
│
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── ui/                    # Simple UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Tabs.jsx
│   │   └── Dialog.jsx
│   ├── student/
│   │   ├── JobsTab.jsx
│   │   ├── ApplicationsTab.jsx
│   │   └── ProfileTab.jsx
│   ├── company/
│   │   ├── JobListingsTab.jsx
│   │   ├── ApplicantsTab.jsx
│   │   └── PostJobTab.jsx
│   └── admin/
│       ├── UsersTab.jsx
│       ├── CompaniesTab.jsx
│       └── AnalyticsTab.jsx
│
├── context/
│   └── AuthContext.jsx        # React Context for auth
│
└── utils/
    └── api.jsx                # Axios configuration & API calls

public/
├── index.html                 # Entry HTML file

package.json                   # Dependencies
vite.config.js                 # Vite configuration
tailwind.config.js             # Tailwind configuration
postcss.config.js              # PostCSS configuration
```

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API URL

Edit `src/utils/api.jsx` and `src/context/AuthContext.jsx`:

Change `http://localhost:8080` to your Spring Cloud Gateway URL:

```javascript
const API_BASE_URL = 'http://your-api-url:8080'
```

### 3. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### 5. Preview Production Build

```bash
npm run preview
```

## Features

### Three Role-Based Dashboards

#### Student Dashboard
- Browse available jobs
- Apply to jobs
- Track application status
- Upload resume
- View profile

#### Company Dashboard
- Post job listings
- View all applicants
- Accept/reject applications
- Manage job postings

#### Admin Dashboard
- View all users
- Manage company verification
- View platform analytics
- Monitor user activity

## Authentication Flow

1. User signs up/logs in with email & password
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in all API requests via Axios interceptor
5. Protected routes check token and user role
6. Invalid/expired tokens redirect to login

## API Integration

All API calls go through `src/utils/api.jsx`:

```javascript
// Example: Login
const response = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})
```

## Environment Variables

No `.env` file needed. API URL is hardcoded in:
- `src/context/AuthContext.jsx`
- `src/utils/api.jsx`

Update these files to change the API URL.

## Technologies Used

- **React 19** - Component framework
- **Vite 5** - Build tool & dev server
- **React Router 6** - Routing
- **Axios 1.13** - HTTP client
- **Tailwind CSS 3.4** - Styling
- **Lucide React 0.544** - Icons
- **Sonner 1.7** - Toast notifications

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port Already in Use

If port 3000 is busy, Vite will use the next available port.

### CORS Errors

Ensure your Spring Cloud Gateway CORS configuration allows requests from `http://localhost:3000`.

### Components Not Importing

All imports are relative. Make sure paths are correct:
- `./` for same folder
- `../` for parent folder
- `../utils/` for utils folder

## File Conversion Notes

All files are **pure JavaScript JSX** with:
- ✅ No TypeScript
- ✅ No Next.js
- ✅ No complex build setup
- ✅ Simple Vite-based project
- ✅ React Router for routing (not file-based)

## Notes

- State management uses React Context + Hooks
- No Redux or Zustand
- Components are functional components
- All styling via Tailwind CSS
- Minimal, reusable UI components
