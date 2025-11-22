import express from 'express'
import {
  getTransfers,
  createTransfer,
  updateTransferStatus,
  deleteTransfer
} from '../controllers/transferController.js'
import { protect, authorize } from '../middleware/auth.js'
import { transferValidation, idValidation, statusValidation } from '../middleware/validation.js'
import { ROLES } from '../config/constants.js'

const router = express.Router()

router.route('/')
  .get(protect, getTransfers)
  .post(protect, transferValidation, createTransfer)

router.route('/:id')
  .delete(protect, authorize(ROLES.MANAGER), idValidation, deleteTransfer)

router.put('/:id/status', protect, idValidation, statusValidation, updateTransferStatus)

export default router
