import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('stockmaster_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Demo authentication - Manager
    if (email === 'demo@stockmaster.com' && password === 'demo123') {
      const userData = {
        id: '1',
        name: 'Demo Manager',
        email: 'demo@stockmaster.com',
        role: 'manager'
      }
      setUser(userData)
      localStorage.setItem('stockmaster_user', JSON.stringify(userData))
      navigate('/dashboard')
      return { success: true }
    }
    
    // Demo authentication - Staff
    if (email === 'staff@stockmaster.com' && password === 'staff123') {
      const userData = {
        id: '2',
        name: 'Demo Staff',
        email: 'staff@stockmaster.com',
        role: 'staff',
        warehouse: 'Main Warehouse'
      }
      setUser(userData)
      localStorage.setItem('stockmaster_user', JSON.stringify(userData))
      navigate('/staff-dashboard')
      return { success: true }
    }
    
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('stockmaster_users') || '[]')
    const foundUser = users.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const { password, ...userData } = foundUser
      setUser(userData)
      localStorage.setItem('stockmaster_user', JSON.stringify(userData))
      // Redirect based on role
      if (userData.role === 'staff') {
        navigate('/staff-dashboard')
      } else {
        navigate('/dashboard')
      }
      return { success: true }
    }
    
    return { success: false, message: 'Invalid credentials' }
  }

  const signup = (name, email, password, role) => {
    const users = JSON.parse(localStorage.getItem('stockmaster_users') || '[]')
    
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already exists' }
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role
    }
    
    users.push(newUser)
    localStorage.setItem('stockmaster_users', JSON.stringify(users))
    
    const { password: _, ...userData } = newUser
    setUser(userData)
    localStorage.setItem('stockmaster_user', JSON.stringify(userData))
    // Redirect based on role
    if (userData.role === 'staff') {
      navigate('/staff-dashboard')
    } else {
      navigate('/dashboard')
    }
    
    return { success: true }
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
