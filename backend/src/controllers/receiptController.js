import Receipt from '../models/Receipt.js'
import Product from '../models/Product.js'
import History from '../models/History.js'

// @desc    Get all receipts
// @route   GET /api/receipts
// @access  Private
export const getReceipts = async (req, res, next) => {
  try {
    const { status, warehouse } = req.query
    let query = {}

    if (status) query.status = status
    if (warehouse) query.warehouse = warehouse

    console.log('Fetching receipts with query:', query)
    
    const receipts = await Receipt.find(query)
      .populate('createdBy', 'name email')
      .populate('processedBy', 'name email')
      .sort({ createdAt: -1 })

    console.log(`Found ${receipts.length} receipts`)

    // Ensure items array exists for all receipts (for backwards compatibility)
    const sanitizedReceipts = receipts.map((receipt, index) => {
      try {
        const receiptObj = receipt.toObject()
        if (!receiptObj.items) {
          console.log(`Receipt at index ${index} has no items, setting to empty array`)
          receiptObj.items = []
        }
        return receiptObj
      } catch (err) {
        console.error(`Error processing receipt at index ${index}:`, err.message)
        console.error('Receipt data:', JSON.stringify(receipt, null, 2))
        throw err
      }
    })

    console.log('Successfully sanitized all receipts')

    res.status(200).json({
      success: true,
      count: sanitizedReceipts.length,
      data: sanitizedReceipts
    })
  } catch (error) {
    console.error('Error in getReceipts:', error)
    next(error)
  }
}

// @desc    Get single receipt
// @route   GET /api/receipts/:id
// @access  Private
export const getReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('processedBy', 'name email')

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      })
    }

    const receiptObj = receipt.toObject()
    if (!receiptObj.items) {
      receiptObj.items = []
    }

    res.status(200).json({
      success: true,
      data: receiptObj
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create receipt
// @route   POST /api/receipts
// @access  Private (Manager only)
export const createReceipt = async (req, res, next) => {
  try {
    const { supplier, warehouse, items, notes } = req.body

    // Populate product names
    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId)
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`)
        }
        return {
          productId: item.productId,
          productName: product.name,
          quantity: item.quantity,
          unit: product.unitOfMeasure
        }
      })
    )

    const receipt = await Receipt.create({
      supplier,
      warehouse,
      items: populatedItems,
      notes,
      createdBy: req.user._id
    })

    // Create history entry
    await History.create({
      action: 'create',
      type: 'receipt',
      data: { id: receipt.receiptId, supplier, itemsCount: items.length },
      userId: req.user._id,
      userName: req.user.name
    })

    res.status(201).json({
      success: true,
      message: 'Receipt created successfully',
      data: receipt
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update receipt status
// @route   PUT /api/receipts/:id/status
// @access  Private (Staff can process)
export const updateReceiptStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const receipt = await Receipt.findById(req.params.id)

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      })
    }

    const oldStatus = receipt.status
    receipt.status = status
    receipt.processedBy = req.user._id

    // If status is 'done', update product stock in the specific warehouse
    if (status === 'done') {
      for (const item of receipt.items) {
        const product = await Product.findById(item.productId)
        if (product) {
          // Find the warehouse in the product's warehouses array
          const warehouseEntry = product.warehouses.find(
            wh => wh.warehouseName === receipt.warehouse
          )
          
          if (warehouseEntry) {
            // Warehouse exists, update stock
            warehouseEntry.stock += item.quantity
          } else {
            // Warehouse doesn't exist, add it
            product.warehouses.push({
              warehouseName: receipt.warehouse,
              stock: item.quantity,
              minStock: 10 // Default minimum stock
            })
          }
          
          await product.save()
        }
      }
    }

    await receipt.save()

    // Create history entry
    await History.create({
      action: 'update',
      type: 'receipt',
      data: { id: receipt.receiptId, statusChange: { from: oldStatus, to: status } },
      userId: req.user._id,
      userName: req.user.name
    })

    res.status(200).json({
      success: true,
      message: `Receipt status updated to ${status}`,
      data: receipt
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete receipt
// @route   DELETE /api/receipts/:id
// @access  Private (Manager only)
export const deleteReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findByIdAndDelete(req.params.id)

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      })
    }

    // Create history entry
    await History.create({
      action: 'delete',
      type: 'receipt',
      data: { id: receipt.receiptId, supplier: receipt.supplier },
      userId: req.user._id,
      userName: req.user.name
    })

    res.status(200).json({
      success: true,
      message: 'Receipt deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}
