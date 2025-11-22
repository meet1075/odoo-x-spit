import mongoose from 'mongoose'
import { CATEGORIES } from '../config/constants.js'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  category: {
    type: String,
    enum: Object.values(CATEGORIES),
    required: [true, 'Category is required']
  },
  unitOfMeasure: {
    type: String,
    required: [true, 'Unit of measure is required'],
    trim: true
  },
  warehouses: [{
    warehouseName: {
      type: String,
      required: true,
      trim: true
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative']
    },
    minStock: {
      type: Number,
      default: 0,
      min: [0, 'Minimum stock cannot be negative']
    }
  }],
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative']
  }
}, {
  timestamps: true
})

// Virtual for total stock across all warehouses
productSchema.virtual('totalStock').get(function() {
  if (!this.warehouses || !Array.isArray(this.warehouses)) {
    return 0
  }
  return this.warehouses.reduce((total, wh) => total + (wh.stock || 0), 0)
})

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true })
productSchema.set('toObject', { virtuals: true })

// Index for faster searches
productSchema.index({ name: 'text', sku: 'text' })
productSchema.index({ category: 1 })
productSchema.index({ 'warehouses.warehouseName': 1 })

const Product = mongoose.model('Product', productSchema)

export default Product
