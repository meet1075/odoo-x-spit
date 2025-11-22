import express from 'express'
import { getHistory, getDashboardStats } from '../controllers/historyController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, getHistory)
router.get('/dashboard/stats', protect, getDashboardStats)

export default router
