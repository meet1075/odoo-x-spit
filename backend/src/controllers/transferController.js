import Transfer from '../models/Transfer.js'
import Product from '../models/Product.js'
import History from '../models/History.js'

// @desc    Get all transfers
// @route   GET /api/transfers
// @access  Private
export const getTransfers = async (req, res, next) => {
  try {
    const { status } = req.query
    let query = {}

    if (status) query.status = status

    const transfers = await Transfer.find(query)
      .populate('createdBy', 'name email')
      .populate('processedBy', 'name email')
      .populate('productId', 'name sku stock')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: transfers.length,
      data: transfers
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create transfer
// @route   POST /api/transfers
// @access  Private
export const createTransfer = async (req, res, next) => {
  try {
    const { productId, quantity, fromLocation, toLocation, notes } = req.body

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    const transfer = await Transfer.create({
      productId,
      productName: product.name,
      quantity,
      fromLocation,
      toLocation,
      notes,
      createdBy: req.user._id
    })

    // Create history entry
    await History.create({
      action: 'create',
      type: 'transfer',
      data: {
        id: transfer.transferId,
        product: product.name,
        from: fromLocation,
        to: toLocation,
        quantity
      },
      userId: req.user._id,
      userName: req.user.name
    })

    res.status(201).json({
      success: true,
      message: 'Transfer created successfully',
      data: transfer
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update transfer status
// @route   PUT /api/transfers/:id/status
// @access  Private (Staff can process)
export const updateTransferStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const transfer = await Transfer.findById(req.params.id)

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      })
    }

    const oldStatus = transfer.status
    transfer.status = status
    transfer.processedBy = req.user._id

    // If status is 'done', transfer stock between warehouses
    if (status === 'done') {
      const product = await Product.findById(transfer.productId)
      if (product) {
        // Find source warehouse
        const fromWarehouse = product.warehouses.find(
          wh => wh.warehouseName === transfer.fromLocation
        )
        
        if (!fromWarehouse || fromWarehouse.stock < transfer.quantity) {
          return res.status(400).json({
            success: false,
            message: 'Insufficient stock in source warehouse'
          })
        }
        
        // Decrease stock in source warehouse
        fromWarehouse.stock -= transfer.quantity
        
        // Find or create destination warehouse
        let toWarehouse = product.warehouses.find(
          wh => wh.warehouseName === transfer.toLocation
        )
        
        if (toWarehouse) {
          // Warehouse exists, increase stock
          toWarehouse.stock += transfer.quantity
        } else {
          // Warehouse doesn't exist, add it
          product.warehouses.push({
            warehouseName: transfer.toLocation,
            stock: transfer.quantity,
            minStock: 10 // Default minimum stock
          })
        }
        
        await product.save()
      }
    }

    await transfer.save()

    // Create history entry
    await History.create({
      action: 'update',
      type: 'transfer',
      data: { id: transfer.transferId, statusChange: { from: oldStatus, to: status } },
      userId: req.user._id,
      userName: req.user.name
    })

    res.status(200).json({
      success: true,
      message: `Transfer status updated to ${status}`,
      data: transfer
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete transfer
// @route   DELETE /api/transfers/:id
// @access  Private (Manager only)
export const deleteTransfer = async (req, res, next) => {
  try {
    const transfer = await Transfer.findByIdAndDelete(req.params.id)

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      })
    }

    // Create history entry
    await History.create({
      action: 'delete',
      type: 'transfer',
      data: { id: transfer.transferId },
      userId: req.user._id,
      userName: req.user.name
    })

    res.status(200).json({
      success: true,
      message: 'Transfer deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}
