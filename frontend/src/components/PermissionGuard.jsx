import { useAuth } from '../context/AuthContext'
import { hasPermission } from '../utils/permissions'

/**
 * PermissionGuard - Conditionally render children based on user permissions
 * @param {string} permission - Required permission
 * @param {React.ReactNode} children - Content to render if permission granted
 * @param {React.ReactNode} fallback - Optional fallback content if permission denied
 */
const PermissionGuard = ({ permission, children, fallback = null }) => {
  const { user } = useAuth()
  
  if (!user) return fallback
  
  const userHasPermission = hasPermission(user.role, permission)
  
  return userHasPermission ? children : fallback
}

export default PermissionGuard
