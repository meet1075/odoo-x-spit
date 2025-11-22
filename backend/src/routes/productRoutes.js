import express from 'express'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
} from '../controllers/productController.js'
import { protect, authorize } from '../middleware/auth.js'
import { productValidation, idValidation } from '../middleware/validation.js'
import { ROLES } from '../config/constants.js'

const router = express.Router()

router.route('/')
  .get(protect, getProducts)
  .post(protect, authorize(ROLES.MANAGER), productValidation, createProduct)

router.route('/:id')
  .get(protect, idValidation, getProduct)
  .put(protect, authorize(ROLES.MANAGER), idValidation, productValidation, updateProduct)
  .delete(protect, authorize(ROLES.MANAGER), idValidation, deleteProduct)

router.put('/:id/stock', protect, idValidation, updateStock)

export default router
