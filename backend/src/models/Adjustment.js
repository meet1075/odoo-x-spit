import mongoose from 'mongoose'

const adjustmentSchema = new mongoose.Schema({
  adjustmentId: {
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
  warehouse: {
    type: String,
    required: [true, 'Warehouse is required'],
    trim: true
  },
  oldQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Quantity cannot be negative']
  },
  newQuantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity cannot be negative']
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true
  },
  status: {
    type: String,
    default: 'done'
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
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Generate adjustment ID before saving
adjustmentSchema.pre('save', async function(next) {
  if (!this.adjustmentId) {
    // Get the highest adjustment number
    const lastAdjustment = await mongoose.model('Adjustment').findOne({}, { adjustmentId: 1 })
      .sort({ adjustmentId: -1 })
      .lean()
    
    let nextNumber = 1
    if (lastAdjustment && lastAdjustment.adjustmentId) {
      const match = lastAdjustment.adjustmentId.match(/ADJ-(\d+)/)
      if (match) {
        nextNumber = parseInt(match[1]) + 1
      }
    }
    
    this.adjustmentId = `ADJ-${String(nextNumber).padStart(4, '0')}`
  }
  next()
})

// Virtual field for difference
adjustmentSchema.virtual('difference').get(function() {
  return this.newQuantity - this.oldQuantity
})

// Virtual for 'id' field to return adjustmentId
adjustmentSchema.virtual('id').get(function() {
  return this.adjustmentId || this._id?.toString() || 'UNKNOWN'
})

// Ensure virtuals are included in JSON
adjustmentSchema.set('toJSON', { virtuals: true })
adjustmentSchema.set('toObject', { virtuals: true })

// Index for faster queries
adjustmentSchema.index({ createdBy: 1 })
adjustmentSchema.index({ date: -1 })

const Adjustment = mongoose.model('Adjustment', adjustmentSchema)

export default Adjustment
