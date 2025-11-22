import express from 'express'
import {
  getDeliveries,
  getDelivery,
  createDelivery,
  updateDeliveryStatus,
  deleteDelivery
} from '../controllers/deliveryController.js'
import { protect, authorize } from '../middleware/auth.js'
import { deliveryValidation, idValidation, statusValidation } from '../middleware/validation.js'
import { ROLES } from '../config/constants.js'

const router = express.Router()

router.route('/')
  .get(protect, getDeliveries)
  .post(protect, authorize(ROLES.MANAGER), deliveryValidation, createDelivery)

router.route('/:id')
  .get(protect, idValidation, getDelivery)
  .delete(protect, authorize(ROLES.MANAGER), idValidation, deleteDelivery)

router.put('/:id/status', protect, idValidation, statusValidation, updateDeliveryStatus)

export default router
