import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // ✅ Load auth safely on app start
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error loading auth from storage:", error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setAuthReady(true) // 🔥 VERY IMPORTANT
    }
  }, [])

  // ✅ LOGIN (FIXED)
  const login = useCallback(async (email, password) => {
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Invalid email or password')
      }

      const data = await response.json()

      // 🔥 Validate token exists
      if (!data.token) {
        throw new Error("Token not received from server")
      }

      // ✅ Decode token safely
      const decoded = jwtDecode(data.token)

      const userData = {
        email: decoded.sub,
        role: decoded.role?.replace('ROLE_', '').toUpperCase(),
      }

      // ✅ Save to state
      setToken(data.token)
      setUser(userData)

      // ✅ Save to localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(userData))

      return userData

    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ✅ LOGOUT (IMPROVED)
  const logout = useCallback(() => {
    setUser(null)
    setToken(null)

    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // 🔥 Important: force clean navigation
    window.location.replace('/login')
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authReady,
        isLoading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}