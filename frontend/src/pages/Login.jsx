import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { LogIn, UserPlus } from 'lucide-react'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'manager'
  })
  const [error, setError] = useState('')
  const { login, signup } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password)
        if (!result.success) {
          setError(result.message || 'Login failed')
        }
      } else {
        if (!formData.name || !formData.email || !formData.password) {
          setError('Please fill in all fields')
          return
        }
        const result = await signup(formData.name, formData.email, formData.password, formData.role)
        if (!result.success) {
          setError(result.message || 'Registration failed')
        }
      }
    } catch (error) {
      setError(error.message || 'An error occurred')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 text-slate-100 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🏭</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-100">StockMaster</h1>
          <p className="text-slate-400 mt-2">Inventory Management System</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => {
              setIsLogin(true)
              setError('')
            }}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              isLogin
                ? 'text-slate-100 border-b-2 border-slate-500'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <LogIn className="w-5 h-5 inline mr-2" />
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false)
              setError('')
              setFormData({ ...formData, email: '', password: '' })
            }}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              !isLogin
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <UserPlus className="w-5 h-5 inline mr-2" />
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-rose-950/30 border border-rose-800 text-rose-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input"
                required={!isLogin}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              className="input"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="input"
              required
            />
          </div>

          {!isLogin && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="manager">Inventory Manager</option>
                <option value="staff">Warehouse Staff</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full text-lg py-3">
            {isLogin ? 'Login' : 'Create Account'}
          </button>

          {isLogin && (
            <div className="mt-4 p-4 bg-slate-900/40 border border-slate-800 rounded-lg text-xs text-slate-400">
              <p>
                Need access? Sign in with your company credentials. New here? Switch to
                <span className="font-medium text-slate-200"> Sign Up </span>
                or contact your administrator to get started.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Login
