import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, authReady } = useAuth()

  // ⏳ Wait until auth is fully initialized
  if (!authReady) {
    return <div className="p-6 text-center">Loading...</div>
  }

  // 🔐 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // 🚫 Logged in but wrong role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  // ✅ Authorized
  return children
}
