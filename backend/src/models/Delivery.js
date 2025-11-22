import mongoose from 'mongoose'
import { STATUS } from '../config/constants.js'

const deliverySchema = new mongoose.Schema({
  deliveryId: {
    type: String,
    unique: true
  },
  customer: {
    type: String,
    required: [true, 'Customer is required'],
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
  shippingAddress: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// Generate delivery ID before saving
deliverySchema.pre('save', async function(next) {
  if (!this.deliveryId) {
    // Get the highest delivery number
    const lastDelivery = await mongoose.model('Delivery').findOne({}, { deliveryId: 1 })
      .sort({ deliveryId: -1 })
      .lean()
    
    let nextNumber = 1
    if (lastDelivery && lastDelivery.deliveryId) {
      const match = lastDelivery.deliveryId.match(/DEL-(\d+)/)
      if (match) {
        nextNumber = parseInt(match[1]) + 1
      }
    }
    
    this.deliveryId = `DEL-${String(nextNumber).padStart(4, '0')}`
  }
  next()
})

// Virtual for 'id' field to return deliveryId
deliverySchema.virtual('id').get(function() {
  return this.deliveryId
})

// Ensure virtuals are included in JSON
deliverySchema.set('toJSON', { virtuals: true })
deliverySchema.set('toObject', { virtuals: true })

// Index for faster queries
deliverySchema.index({ status: 1 })
deliverySchema.index({ createdBy: 1 })
deliverySchema.index({ date: -1 })

const Delivery = mongoose.model('Delivery', deliverySchema)

export default Delivery
