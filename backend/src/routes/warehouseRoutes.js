import express from 'express'
import {
  getWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse
} from '../controllers/warehouseController.js'
import { protect, authorize } from '../middleware/auth.js'
import { warehouseValidation, idValidation } from '../middleware/validation.js'
import { ROLES } from '../config/constants.js'

const router = express.Router()

router.route('/')
  .get(protect, getWarehouses)
  .post(protect, authorize(ROLES.MANAGER), warehouseValidation, createWarehouse)

router.route('/:id')
  .get(protect, idValidation, getWarehouse)
  .put(protect, authorize(ROLES.MANAGER), idValidation, warehouseValidation, updateWarehouse)
  .delete(protect, authorize(ROLES.MANAGER), idValidation, deleteWarehouse)

export default router
