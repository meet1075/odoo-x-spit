import { body, param, query, validationResult } from 'express-validator'

// Validation error handler
export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    })
  }
  next()
}

// Auth validation
export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['manager', 'staff']).withMessage('Invalid role'),
  validate
]

export const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
]

// Product validation
export const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('category').isIn(['raw', 'finished', 'consumables']).withMessage('Invalid category'),
  body('unitOfMeasure').trim().notEmpty().withMessage('Unit of measure is required'),
  // body('location').trim().notEmpty().withMessage('Location is required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative number'),
  body('minStock').optional().isInt({ min: 0 }).withMessage('Minimum stock must be a non-negative number'),
  // body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  validate
]

// Warehouse validation
export const warehouseValidation = [
  body('name').trim().notEmpty().withMessage('Warehouse name is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('zipCode').trim().notEmpty().withMessage('Zip code is required'),
  body('capacity').isInt({ min: 0 }).withMessage('Capacity must be a positive number'),
  body('type').isIn(['main', 'distribution', 'production']).withMessage('Invalid warehouse type'),
  validate
]

// Receipt validation
export const receiptValidation = [
  body('supplier').trim().notEmpty().withMessage('Supplier is required'),
  body('warehouse').trim().notEmpty().withMessage('Warehouse is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  validate
]

// Delivery validation
export const deliveryValidation = [
  body('customer').trim().notEmpty().withMessage('Customer is required'),
  body('warehouse').trim().notEmpty().withMessage('Warehouse is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  validate
]

// Transfer validation
export const transferValidation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('fromLocation').trim().notEmpty().withMessage('From location is required'),
  body('toLocation').trim().notEmpty().withMessage('To location is required'),
  validate
]

// Adjustment validation
export const adjustmentValidation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  // body('location').trim().notEmpty().withMessage('Location is required'),
  body('newQuantity').isInt({ min: 0 }).withMessage('New quantity must be a non-negative number'),
  body('reason').trim().notEmpty().withMessage('Reason is required'),
  validate
]

// ID validation
export const idValidation = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validate
]

// Status update validation
export const statusValidation = [
  body('status').isIn(['draft', 'waiting', 'ready', 'done', 'canceled']).withMessage('Invalid status'),
  validate
]
