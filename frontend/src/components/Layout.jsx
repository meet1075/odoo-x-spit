import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  LayoutDashboard, 
  Package, 
  Download, 
  Upload, 
  Repeat, 
  Settings as SettingsIcon, 
  History, 
  LogOut, 
  User,
  Building2,
  ClipboardList
} from 'lucide-react'

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  // Navigation for managers - full access
  const managerNavigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Receipts', path: '/receipts', icon: Download },
    { name: 'Deliveries', path: '/deliveries', icon: Upload },
    { name: 'Internal Transfers', path: '/transfers', icon: Repeat },
    { name: 'Stock Adjustments', path: '/adjustments', icon: SettingsIcon },
    { name: 'Move History', path: '/history', icon: History },
    { name: 'Settings', path: '/settings', icon: Building2 }
  ]

  // Navigation for staff - task-focused
  const staffNavigation = [
    { name: 'My Tasks', path: '/staff-dashboard', icon: ClipboardList },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Receive Goods', path: '/receipts', icon: Download },
    { name: 'Pick & Pack', path: '/deliveries', icon: Upload },
    { name: 'Transfers', path: '/transfers', icon: Repeat },
    { name: 'Stock Count', path: '/adjustments', icon: SettingsIcon },
    { name: 'History', path: '/history', icon: History },
    { name: 'Profile', path: '/settings', icon: User }
  ]

  // Select navigation based on role
  const navigation = user?.role === 'staff' ? staffNavigation : managerNavigation

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Building2 className="w-8 h-8" />
            StockMaster
          </h1>
          <p className="text-sm text-slate-400 mt-1">Inventory Management</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  isActive(item.path)
                    ? 'bg-slate-800 text-slate-100 font-medium border border-slate-700'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-lg p-4 mb-3 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-300 border border-slate-600">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-100 truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-950">
        {children}
      </main>
    </div>
  )
}

export default Layout
