// Role-based access control utilities

export const ROLES = {
  MANAGER: 'manager',
  STAFF: 'staff'
}

export const PERMISSIONS = {
  // Dashboard
  VIEW_FULL_DASHBOARD: 'view_full_dashboard',
  VIEW_STAFF_DASHBOARD: 'view_staff_dashboard',
  
  // Products
  VIEW_PRODUCTS: 'view_products',
  CREATE_PRODUCT: 'create_product',
  EDIT_PRODUCT: 'edit_product',
  DELETE_PRODUCT: 'delete_product',
  
  // Receipts
  VIEW_RECEIPTS: 'view_receipts',
  CREATE_RECEIPT: 'create_receipt',
  PROCESS_RECEIPT: 'process_receipt',
  VALIDATE_RECEIPT: 'validate_receipt',
  DELETE_RECEIPT: 'delete_receipt',
  
  // Deliveries
  VIEW_DELIVERIES: 'view_deliveries',
  CREATE_DELIVERY: 'create_delivery',
  PROCESS_DELIVERY: 'process_delivery',
  VALIDATE_DELIVERY: 'validate_delivery',
  DELETE_DELIVERY: 'delete_delivery',
  
  // Transfers
  VIEW_TRANSFERS: 'view_transfers',
  CREATE_TRANSFER: 'create_transfer',
  PROCESS_TRANSFER: 'process_transfer',
  VALIDATE_TRANSFER: 'validate_transfer',
  DELETE_TRANSFER: 'delete_transfer',
  
  // Adjustments
  VIEW_ADJUSTMENTS: 'view_adjustments',
  CREATE_ADJUSTMENT: 'create_adjustment',
  APPROVE_ADJUSTMENT: 'approve_adjustment',
  
  // Warehouses
  VIEW_WAREHOUSES: 'view_warehouses',
  MANAGE_WAREHOUSES: 'manage_warehouses',
  
  // History
  VIEW_HISTORY: 'view_history',
  VIEW_FULL_HISTORY: 'view_full_history',
  
  // Settings
  VIEW_SETTINGS: 'view_settings',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_USERS: 'manage_users',
  RESET_DATA: 'reset_data'
}

// Role permission mappings
const rolePermissions = {
  [ROLES.MANAGER]: [
    // Full access to everything
    PERMISSIONS.VIEW_FULL_DASHBOARD,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.EDIT_PRODUCT,
    PERMISSIONS.DELETE_PRODUCT,
    PERMISSIONS.VIEW_RECEIPTS,
    PERMISSIONS.CREATE_RECEIPT,
    PERMISSIONS.PROCESS_RECEIPT,
    PERMISSIONS.VALIDATE_RECEIPT,
    PERMISSIONS.DELETE_RECEIPT,
    PERMISSIONS.VIEW_DELIVERIES,
    PERMISSIONS.CREATE_DELIVERY,
    PERMISSIONS.PROCESS_DELIVERY,
    PERMISSIONS.VALIDATE_DELIVERY,
    PERMISSIONS.DELETE_DELIVERY,
    PERMISSIONS.VIEW_TRANSFERS,
    PERMISSIONS.CREATE_TRANSFER,
    PERMISSIONS.PROCESS_TRANSFER,
    PERMISSIONS.VALIDATE_TRANSFER,
    PERMISSIONS.DELETE_TRANSFER,
    PERMISSIONS.VIEW_ADJUSTMENTS,
    PERMISSIONS.CREATE_ADJUSTMENT,
    PERMISSIONS.APPROVE_ADJUSTMENT,
    PERMISSIONS.VIEW_WAREHOUSES,
    PERMISSIONS.MANAGE_WAREHOUSES,
    PERMISSIONS.VIEW_FULL_HISTORY,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.RESET_DATA
  ],
  
  [ROLES.STAFF]: [
    // Limited operational access
    PERMISSIONS.VIEW_STAFF_DASHBOARD,
    PERMISSIONS.VIEW_PRODUCTS, // View only
    PERMISSIONS.VIEW_RECEIPTS,
    PERMISSIONS.PROCESS_RECEIPT, // Can process but not create/delete
    PERMISSIONS.VIEW_DELIVERIES,
    PERMISSIONS.PROCESS_DELIVERY, // Can pick & pack
    PERMISSIONS.VIEW_TRANSFERS,
    PERMISSIONS.PROCESS_TRANSFER, // Can execute transfers
    PERMISSIONS.VIEW_ADJUSTMENTS,
    PERMISSIONS.CREATE_ADJUSTMENT, // Can submit counts
    PERMISSIONS.VIEW_WAREHOUSES, // View only
    PERMISSIONS.VIEW_HISTORY, // Limited history
    PERMISSIONS.VIEW_SETTINGS // View profile only
  ]
}

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (userRole, permission) => {
  if (!userRole) return false
  const permissions = rolePermissions[userRole] || []
  return permissions.includes(permission)
}

/**
 * Check if user has any of the permissions
 */
export const hasAnyPermission = (userRole, permissionsList) => {
  return permissionsList.some(permission => hasPermission(userRole, permission))
}

/**
 * Check if user has all permissions
 */
export const hasAllPermissions = (userRole, permissionsList) => {
  return permissionsList.every(permission => hasPermission(userRole, permission))
}

/**
 * Get all permissions for a role
 */
export const getRolePermissions = (userRole) => {
  return rolePermissions[userRole] || []
}

/**
 * Check if user is manager
 */
export const isManager = (userRole) => {
  return userRole === ROLES.MANAGER
}

/**
 * Check if user is staff
 */
export const isStaff = (userRole) => {
  return userRole === ROLES.STAFF
}

/**
 * Filter navigation items based on user role
 */
export const getNavigationForRole = (userRole) => {
  const allNavigation = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      permission: PERMISSIONS.VIEW_FULL_DASHBOARD 
    },
    { 
      name: 'Products', 
      path: '/products', 
      permission: PERMISSIONS.VIEW_PRODUCTS 
    },
    { 
      name: 'Receipts', 
      path: '/receipts', 
      permission: PERMISSIONS.VIEW_RECEIPTS 
    },
    { 
      name: 'Deliveries', 
      path: '/deliveries', 
      permission: PERMISSIONS.VIEW_DELIVERIES 
    },
    { 
      name: 'Internal Transfers', 
      path: '/transfers', 
      permission: PERMISSIONS.VIEW_TRANSFERS 
    },
    { 
      name: 'Stock Adjustments', 
      path: '/adjustments', 
      permission: PERMISSIONS.VIEW_ADJUSTMENTS 
    },
    { 
      name: 'Move History', 
      path: '/history', 
      permission: PERMISSIONS.VIEW_HISTORY 
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      permission: PERMISSIONS.VIEW_SETTINGS 
    }
  ]

  return allNavigation.filter(item => hasPermission(userRole, item.permission))
}
