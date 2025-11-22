import mongoose from 'mongoose'
import { STATUS } from '../config/constants.js'

const transferSchema = new mongoose.Schema({
  transferId: {
    type: String,
    unique: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  fromLocation: {
    type: String,
    required: [true, 'From location is required'],
    trim: true
  },
  toLocation: {
    type: String,
    required: [true, 'To location is required'],
    trim: true
  },
  status: {
    type: String,
    enum: Object.values(STATUS),
    default: STATUS.DRAFT
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// Generate transfer ID before saving
transferSchema.pre('save', async function(next) {
  if (!this.transferId) {
    // Get the highest transfer number
    const lastTransfer = await mongoose.model('Transfer').findOne({}, { transferId: 1 })
      .sort({ transferId: -1 })
      .lean()
    
    let nextNumber = 1
    if (lastTransfer && lastTransfer.transferId) {
      const match = lastTransfer.transferId.match(/TRF-(\d+)/)
      if (match) {
        nextNumber = parseInt(match[1]) + 1
      }
    }
    
    this.transferId = `TRF-${String(nextNumber).padStart(4, '0')}`
  }
  next()
})

// Virtual for 'id' field to return transferId
transferSchema.virtual('id').get(function() {
  return this.transferId
})

// Ensure virtuals are included in JSON
transferSchema.set('toJSON', { virtuals: true })
transferSchema.set('toObject', { virtuals: true })

// Index for faster queries
transferSchema.index({ status: 1 })
transferSchema.index({ createdBy: 1 })
transferSchema.index({ date: -1 })

const Transfer = mongoose.model('Transfer', transferSchema)

export default Transfer
