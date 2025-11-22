import mongoose from 'mongoose'

const historySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete', 'move', 'validate']
  },
  type: {
    type: String,
    required: true,
    enum: ['product', 'receipt', 'delivery', 'transfer', 'adjustment', 'warehouse', 'user']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
})

// Index for faster queries
historySchema.index({ timestamp: -1 })
historySchema.index({ userId: 1 })
historySchema.index({ type: 1 })

// Auto-delete old history after 90 days (optional)
historySchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }) // 90 days

const History = mongoose.model('History', historySchema)

export default History
