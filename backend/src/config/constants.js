export const ROLES = {
  MANAGER: 'manager',
  STAFF: 'staff'
}

export const STATUS = {
  DRAFT: 'draft',
  WAITING: 'waiting',
  READY: 'ready',
  DONE: 'done',
  CANCELED: 'canceled'
}

export const CATEGORIES = {
  RAW: 'raw',
  FINISHED: 'finished',
  CONSUMABLES: 'consumables'
}

export const WAREHOUSE_TYPES = {
  MAIN: 'main',
  DISTRIBUTION: 'distribution',
  PRODUCTION: 'production'
}

export const PERMISSIONS = {
  // Product permissions
  VIEW_PRODUCTS: 'view_products',
  CREATE_PRODUCT: 'create_product',
  EDIT_PRODUCT: 'edit_product',
  DELETE_PRODUCT: 'delete_product',
  
  // Receipt permissions
  VIEW_RECEIPTS: 'view_receipts',
  CREATE_RECEIPT: 'create_receipt',
  PROCESS_RECEIPT: 'process_receipt',
  VALIDATE_RECEIPT: 'validate_receipt',
  
  // Delivery permissions
  VIEW_DELIVERIES: 'view_deliveries',
  CREATE_DELIVERY: 'create_delivery',
  PROCESS_DELIVERY: 'process_delivery',
  VALIDATE_DELIVERY: 'validate_delivery',
  
  // Transfer permissions
  VIEW_TRANSFERS: 'view_transfers',
  CREATE_TRANSFER: 'create_transfer',
  PROCESS_TRANSFER: 'process_transfer',
  
  // Adjustment permissions
  VIEW_ADJUSTMENTS: 'view_adjustments',
  CREATE_ADJUSTMENT: 'create_adjustment',
  APPROVE_ADJUSTMENT: 'approve_adjustment',
  
  // Warehouse permissions
  VIEW_WAREHOUSES: 'view_warehouses',
  MANAGE_WAREHOUSES: 'manage_warehouses',
  
  // Settings permissions
  VIEW_SETTINGS: 'view_settings',
  MANAGE_SETTINGS: 'manage_settings',
  RESET_DATA: 'reset_data',
  
  // History permissions
  VIEW_HISTORY: 'view_history'
}

export const ROLE_PERMISSIONS = {
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.EDIT_PRODUCT,
    PERMISSIONS.DELETE_PRODUCT,
    PERMISSIONS.VIEW_RECEIPTS,
    PERMISSIONS.CREATE_RECEIPT,
    PERMISSIONS.PROCESS_RECEIPT,
    PERMISSIONS.VALIDATE_RECEIPT,
    PERMISSIONS.VIEW_DELIVERIES,
    PERMISSIONS.CREATE_DELIVERY,
    PERMISSIONS.PROCESS_DELIVERY,
    PERMISSIONS.VALIDATE_DELIVERY,
    PERMISSIONS.VIEW_TRANSFERS,
    PERMISSIONS.CREATE_TRANSFER,
    PERMISSIONS.PROCESS_TRANSFER,
    PERMISSIONS.VIEW_ADJUSTMENTS,
    PERMISSIONS.CREATE_ADJUSTMENT,
    PERMISSIONS.APPROVE_ADJUSTMENT,
    PERMISSIONS.VIEW_WAREHOUSES,
    PERMISSIONS.MANAGE_WAREHOUSES,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.RESET_DATA,
    PERMISSIONS.VIEW_HISTORY
  ],
  [ROLES.STAFF]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.VIEW_RECEIPTS,
    PERMISSIONS.PROCESS_RECEIPT,
    PERMISSIONS.VIEW_DELIVERIES,
    PERMISSIONS.PROCESS_DELIVERY,
    PERMISSIONS.VIEW_TRANSFERS,
    PERMISSIONS.PROCESS_TRANSFER,
    PERMISSIONS.VIEW_ADJUSTMENTS,
    PERMISSIONS.VIEW_WAREHOUSES,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.VIEW_HISTORY
  ]
}
