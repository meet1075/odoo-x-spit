import mongoose from 'mongoose'
import { STATUS } from '../config/constants.js'

const receiptSchema = new mongoose.Schema({
  receiptId: {
    type: String,
    unique: true
  },
  supplier: {
    type: String,
    required: [true, 'Supplier is required'],
    trim: true
  },
  warehouse: {
    type: String,
    required: [true, 'Warehouse is required']
  },
  items: {
    type: [{
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
        required: true,
        min: [1, 'Quantity must be at least 1']
      },
      unit: {
        type: String,
        required: true
      }
    }],
    default: []
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

// Generate receipt ID before saving
receiptSchema.pre('save', async function(next) {
  if (!this.receiptId) {
    // Get the highest receipt number
    const lastReceipt = await mongoose.model('Receipt').findOne({}, { receiptId: 1 })
      .sort({ receiptId: -1 })
      .lean()
    
    let nextNumber = 1
    if (lastReceipt && lastReceipt.receiptId) {
      const match = lastReceipt.receiptId.match(/RCP-(\d+)/)
      if (match) {
        nextNumber = parseInt(match[1]) + 1
      }
    }
    
    this.receiptId = `RCP-${String(nextNumber).padStart(4, '0')}`
  }
  next()
})

// Virtual for 'id' field to return receiptId
receiptSchema.virtual('id').get(function() {
  return this.receiptId || this._id?.toString() || 'UNKNOWN'
})

// Ensure virtuals are included in JSON
receiptSchema.set('toJSON', { virtuals: true })
receiptSchema.set('toObject', { virtuals: true })

// Index for faster queries
receiptSchema.index({ status: 1 })
receiptSchema.index({ createdBy: 1 })
receiptSchema.index({ date: -1 })

const Receipt = mongoose.model('Receipt', receiptSchema)

export default Receipt
