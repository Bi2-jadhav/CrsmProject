# Recruitment Portal - React JSX Frontend

A complete three-role based recruitment platform built with React, JSX, and functional components.

## Features

### Student Dashboard
- Browse available job listings with search and filters
- Apply to jobs with one click
- Upload and manage resume/CV
- Track all applications and their statuses
- View detailed job descriptions and company information

### Company Dashboard
- Post new job openings
- Manage active job listings
- View all applicants for each position
- Accept or reject applications
- Track hiring pipeline and metrics

### Admin Dashboard
- Manage all platform users (Students, Companies)
- Verify company accounts
- View comprehensive platform analytics
- Monitor total jobs, applications, and user activity
- System statistics and insights

## Technology Stack

- **React** - UI library with functional components
- **JSX** - JavaScript XML syntax
- **React Hooks** - useState, useEffect, useContext, useCallback
- **Next.js 16** - App Router framework
- **Axios** - HTTP client with interceptors
- **Context API** - State management for authentication
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Pre-built UI components
- **Lucide Icons** - Icon library
- **Sonner** - Toast notifications

## Project Structure

```
recruitment-platform/
├── app/
│   ├── layout.jsx              # Root layout with AuthProvider
│   ├── page.jsx                # Home landing page
│   ├── login/
│   │   └── page.jsx            # Login form
│   ├── signup/
│   │   └── page.jsx            # Signup with 3 role selection
│   ├── unauthorized/
│   │   └── page.jsx            # Access denied page
│   └── dashboard/
│       ├── page.jsx            # Role-based router
│       ├── student/
│       │   └── page.jsx        # Student dashboard
│       ├── company/
│       │   └── page.jsx        # Company dashboard
│       └── admin/
│           └── page.jsx        # Admin dashboard
│
├── components/
│   ├── navbar.jsx              # Navigation bar
│   ├── protected-route.jsx     # Route protection wrapper
│   ├── student/
│   │   ├── jobs-tab.jsx        # Job listings and search
│   │   ├── applications-tab.jsx # Track applications
│   │   └── profile-tab.jsx     # Resume upload & profile
│   ├── company/
│   │   ├── job-listings-tab.jsx    # Manage posted jobs
│   │   ├── applicants-tab.jsx      # View applicants
│   │   └── post-job-tab.jsx        # Create new job
│   ├── admin/
│   │   ├── users-tab.jsx       # User management
│   │   ├── companies-tab.jsx   # Company verification
│   │   └── analytics-tab.jsx   # Platform analytics
│   └── ui/                     # Shadcn UI components
│
├── lib/
│   ├── auth-context.jsx        # Auth context & hooks
│   └── api.jsx                 # Axios API client setup
│
├── globals.css                 # Global styles
├── package.json                # Dependencies
├── next.config.mjs             # Next.js config
└── tsconfig.json               # TypeScript config (for JSX)
```

## Authentication Flow

1. **Signup Page** - User selects role (Student, Company, Admin)
   - Fills name, email, password
   - Account created via API call

2. **Login Page** - JWT-based authentication
   - Email and password verification
   - Token stored in localStorage
   - Automatic dashboard routing by role

3. **Protected Routes** - Role-based access control
   - Redirects to login if not authenticated
   - Redirects to unauthorized page if wrong role
   - AuthContext provides user data

## API Integration

All API calls use Axios with automatic token injection:

```jsx
// lib/api.jsx
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080'
})

// Interceptor adds JWT token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

## Key JSX Components

### Authentication Context
```jsx
// lib/auth-context.jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Login, signup, logout functions
  // Token management
  // Auto-login on mount
}

export const useAuth = () => useContext(AuthContext)
```

### Protected Route Component
```jsx
// components/protected-route.jsx
export default function ProtectedRoute({ 
  children, 
  requiredRoles = [] 
}) {
  const { user, isAuthenticated } = useAuth()
  
  // Check authentication and role
  // Redirect if unauthorized
}
```

### Functional Components with Hooks
```jsx
// Example: JobsTab Component
export default function JobsTab() {
  const [jobs, setJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    fetchJobs() // Load data on mount
  }, [])

  const handleApply = async (jobId) => {
    // Call API, show toast
  }

  return (
    // JSX with filtered jobs, search, apply button
  )
}
```

## Setup Instructions

### 1. Prerequisites
- Node.js 16+ 
- npm or pnpm

### 2. Installation

```bash
# Clone or download project
cd recruitment-platform

# Install dependencies
npm install
# or
pnpm install
```

### 3. Environment Setup

Create `.env.local`:
```env
REACT_APP_API_URL=http://localhost:8080
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 4. Run Development Server

```bash
npm run dev
# or
pnpm dev
```

Visit `http://localhost:3000`

### 5. Test Accounts

**Student:**
- Email: student@example.com
- Password: password123
- Role: STUDENT

**Company:**
- Email: company@example.com
- Password: password123
- Role: COMPANY

**Admin:**
- Email: admin@example.com
- Password: password123
- Role: ADMIN

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout

### Student Routes
- `GET /api/student/jobs` - Get all jobs
- `POST /api/student/apply` - Apply to job
- `GET /api/student/applications` - Get my applications
- `POST /api/student/resume` - Upload resume

### Company Routes
- `POST /api/company/jobs` - Create job posting
- `GET /api/company/jobs` - Get my job listings
- `GET /api/company/applicants` - Get applicants
- `PUT /api/company/applicants/{id}` - Accept/reject

### Admin Routes
- `GET /api/admin/users` - List all users
- `GET /api/admin/companies` - List companies
- `PUT /api/admin/companies/{id}/verify` - Verify company
- `GET /api/admin/analytics` - Platform analytics

## Usage Examples

### Login Flow
```jsx
const { login } = useAuth()

const handleLogin = async (email, password) => {
  try {
    await login(email, password)
    // User logged in, redirected to dashboard
  } catch (error) {
    toast.error(error.message)
  }
}
```

### Fetching Jobs
```jsx
const [jobs, setJobs] = useState([])

useEffect(() => {
  const fetchJobs = async () => {
    try {
      const response = await api.get('/api/student/jobs')
      setJobs(response.data)
    } catch (error) {
      toast.error('Failed to fetch jobs')
    }
  }
  fetchJobs()
}, [])
```

### Applying to Job
```jsx
const handleApply = useCallback(async (jobId) => {
  try {
    await api.post('/api/student/apply', { jobId })
    toast.success('Application submitted!')
    // Refresh applications list
  } catch (error) {
    toast.error('Failed to apply')
  }
}, [])
```

## Styling

- **Tailwind CSS** - Utility classes for responsive design
- **Shadcn/UI** - Pre-built accessible components
- **Custom CSS** - `globals.css` for global styles
- **Mobile-First** - Responsive design for all screen sizes

## Code Standards

- **Functional Components** - All React components use functions
- **React Hooks** - useState, useEffect, useContext, useCallback
- **JSX Syntax** - JavaScript XML for UI structure
- **Error Handling** - Try-catch with user-friendly messages
- **Loading States** - Disabled buttons and spinners during requests
- **Toast Notifications** - User feedback via Sonner

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms

```bash
# Build production bundle
npm run build

# Start server
npm start
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Issue: 401 Unauthorized
- Check if token is valid in localStorage
- Re-login to get new token
- Verify API server is running

### Issue: CORS Errors
- Ensure API server has CORS enabled
- Check REACT_APP_API_URL is correct
- Verify request headers include token

### Issue: Components Not Rendering
- Check if AuthProvider is wrapping app
- Verify JSX syntax in component
- Check browser console for errors

## License

MIT License

## Support

For issues or questions, contact: support@recruitmentportal.com
