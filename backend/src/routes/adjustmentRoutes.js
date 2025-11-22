import express from 'express'
import {
  getAdjustments,
  createAdjustment,
  deleteAdjustment
} from '../controllers/adjustmentController.js'
import { protect, authorize } from '../middleware/auth.js'
import { adjustmentValidation, idValidation } from '../middleware/validation.js'
import { ROLES } from '../config/constants.js'

const router = express.Router()

router.route('/')
  .get(protect, getAdjustments)
  .post(protect, authorize(ROLES.MANAGER), adjustmentValidation, createAdjustment)

router.delete('/:id', protect, authorize(ROLES.MANAGER), idValidation, deleteAdjustment)

export default router
