import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('stockmaster_user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      // Verify token is still valid
      verifyToken()
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async () => {
    try {
      const response = await authAPI.getMe()
      if (response.success && response.data) {
        setUser(response.data)
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      
      if (response.success && response.data) {
        const userData = {
          ...response.data.user,
          token: response.data.token
        }
        setUser(userData)
        localStorage.setItem('stockmaster_user', JSON.stringify(userData))
        
        // Redirect based on role
        if (response.data.user.role === 'staff') {
          navigate('/staff-dashboard')
        } else {
          navigate('/dashboard')
        }
        
        return { success: true }
      }
      
      return { success: false, message: response.message || 'Login failed' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: error.message || 'Invalid credentials' }
    }
  }

  const signup = async (name, email, password, role) => {
    try {
      const response = await authAPI.register(name, email, password, role)
      
      if (response.success && response.data) {
        const userData = {
          ...response.data.user,
          token: response.data.token
        }
        setUser(userData)
        localStorage.setItem('stockmaster_user', JSON.stringify(userData))
        
        // Redirect based on role
        if (response.data.user.role === 'staff') {
          navigate('/staff-dashboard')
        } else {
          navigate('/dashboard')
        }
        
        return { success: true }
      }
      
      return { success: false, message: response.message || 'Registration failed' }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, message: error.message || 'Registration failed' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('stockmaster_user')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
