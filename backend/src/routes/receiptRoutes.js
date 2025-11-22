import express from 'express'
import {
  getReceipts,
  getReceipt,
  createReceipt,
  updateReceiptStatus,
  deleteReceipt
} from '../controllers/receiptController.js'
import { protect, authorize } from '../middleware/auth.js'
import { receiptValidation, idValidation, statusValidation } from '../middleware/validation.js'
import { ROLES } from '../config/constants.js'

const router = express.Router()

router.route('/')
  .get(protect, getReceipts)
  .post(protect, authorize(ROLES.MANAGER), receiptValidation, createReceipt)

router.route('/:id')
  .get(protect, idValidation, getReceipt)
  .delete(protect, authorize(ROLES.MANAGER), idValidation, deleteReceipt)

router.put('/:id/status', protect, idValidation, statusValidation, updateReceiptStatus)

export default router
