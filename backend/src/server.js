import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import connectDB from './config/database.js'
import { errorHandler, notFound } from './middleware/error.js'

// Load env vars
dotenv.config()

// Connect to database
connectDB()

// Initialize app
const app = express()

// Security middleware
app.use(helmet())

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Compression
app.use(compression())

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Routes
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import warehouseRoutes from './routes/warehouseRoutes.js'
import receiptRoutes from './routes/receiptRoutes.js'
import deliveryRoutes from './routes/deliveryRoutes.js'
import transferRoutes from './routes/transferRoutes.js'
import adjustmentRoutes from './routes/adjustmentRoutes.js'
import historyRoutes from './routes/historyRoutes.js'

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/warehouses', warehouseRoutes)
app.use('/api/receipts', receiptRoutes)
app.use('/api/deliveries', deliveryRoutes)
app.use('/api/transfers', transferRoutes)
app.use('/api/adjustments', adjustmentRoutes)
app.use('/api/history', historyRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  })
})

// Error handlers
app.use(notFound)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`)
  server.close(() => process.exit(1))
})

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...')
  server.close(() => {
    console.log('✅ Process terminated')
  })
})

export default app
