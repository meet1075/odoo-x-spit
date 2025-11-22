import Adjustment from '../models/Adjustment.js'
import Product from '../models/Product.js'
import History from '../models/History.js'

// @desc    Get all adjustments
// @route   GET /api/adjustments
// @access  Private
export const getAdjustments = async (req, res, next) => {
  try {
    const adjustments = await Adjustment.find()
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .populate('productId', 'name sku stock')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: adjustments.length,
      data: adjustments
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create adjustment
// @route   POST /api/adjustments
// @access  Private (Manager only)
export const createAdjustment = async (req, res, next) => {
  try {
    const { productId, warehouse, newQuantity, reason } = req.body

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Find or create warehouse entry
    let warehouseEntry = product.warehouses.find(
      wh => wh.warehouseName === warehouse
    )
    
    const oldQuantity = warehouseEntry?.stock || 0

    const adjustment = await Adjustment.create({
      productId,
      productName: product.name,
      warehouse,
      oldQuantity,
      newQuantity,
      reason,
      createdBy: req.user._id,
      approvedBy: req.user._id
    })

    // Update product stock in the specific warehouse
    if (warehouseEntry) {
      // Warehouse exists, update stock
      warehouseEntry.stock = newQuantity
    } else {
      // Warehouse doesn't exist, add it
      product.warehouses.push({
        warehouseName: warehouse,
        stock: newQuantity,
        minStock: 10 // Default minimum stock
      })
    }
    
    await product.save()

    // Create history entry
    await History.create({
      action: 'create',
      type: 'adjustment',
      data: {
        id: adjustment.adjustmentId,
        product: product.name,
        change: { from: oldQuantity, to: newQuantity },
        reason
      },
      userId: req.user._id,
      userName: req.user.name
    })

    res.status(201).json({
      success: true,
      message: 'Adjustment created and stock updated successfully',
      data: adjustment
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete adjustment
// @route   DELETE /api/adjustments/:id
// @access  Private (Manager only)
export const deleteAdjustment = async (req, res, next) => {
  try {
    const adjustment = await Adjustment.findByIdAndDelete(req.params.id)

    if (!adjustment) {
      return res.status(404).json({
        success: false,
        message: 'Adjustment not found'
      })
    }

    // Create history entry
    await History.create({
      action: 'delete',
      type: 'adjustment',
      data: { id: adjustment.adjustmentId },
      userId: req.user._id,
      userName: req.user.name
    })

    res.status(200).json({
      success: true,
      message: 'Adjustment deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}
