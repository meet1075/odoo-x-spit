import Delivery from '../models/Delivery.js'
import Product from '../models/Product.js'
import History from '../models/History.js'

// @desc    Get all deliveries
// @route   GET /api/deliveries
// @access  Private
export const getDeliveries = async (req, res, next) => {
  try {
    const { status, warehouse } = req.query
    let query = {}

    if (status) query.status = status
    if (warehouse) query.warehouse = warehouse

    const deliveries = await Delivery.find(query)
      .populate('createdBy', 'name email')
      .populate('processedBy', 'name email')
      .sort({ createdAt: -1 })

    // Ensure items array exists for all deliveries
    const sanitizedDeliveries = deliveries.map(delivery => {
      const deliveryObj = delivery.toObject()
      if (!deliveryObj.items) {
        deliveryObj.items = []
      }
      return deliveryObj
    })

    res.status(200).json({
      success: true,
      count: sanitizedDeliveries.length,
      data: sanitizedDeliveries
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single delivery
// @route   GET /api/deliveries/:id
// @access  Private
export const getDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('processedBy', 'name email')

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      })
    }

    const deliveryObj = delivery.toObject()
    if (!deliveryObj.items) {
      deliveryObj.items = []
    }

    res.status(200).json({
      success: true,
      data: deliveryObj
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create delivery
// @route   POST /api/deliveries
// @access  Private (Manager only)
export const createDelivery = async (req, res, next) => {
  try {
    const { customer, warehouse, items, shippingAddress, notes } = req.body

    // Populate product names and check stock
    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId)
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`)
        }
        
        // Check stock in the specific warehouse
        const warehouseEntry = product.warehouses.find(
          wh => wh.warehouseName === warehouse
        )
        
        if (!warehouseEntry || warehouseEntry.stock < item.quantity) {
          const available = warehouseEntry?.stock || 0
          throw new Error(`Insufficient stock for ${product.name} in ${warehouse}. Available: ${available}`)
        }
        
        return {
          productId: item.productId,
          productName: product.name,
          quantity: item.quantity,
          unit: product.unitOfMeasure
        }
      })
    )

    const delivery = await Delivery.create({
      customer,
      warehouse,
      items: populatedItems,
      shippingAddress,
      notes,
      createdBy: req.user._id
    })

    // Create history entry
    await History.create({
      action: 'create',
      type: 'delivery',
      data: { id: delivery.deliveryId, customer, itemsCount: items.length },
      userId: req.user._id,
      userName: req.user.name
    })

    res.status(201).json({
      success: true,
      message: 'Delivery created successfully',
      data: delivery
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update delivery status
// @route   PUT /api/deliveries/:id/status
// @access  Private (Staff can process)
export const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const delivery = await Delivery.findById(req.params.id)

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      })
    }

    const oldStatus = delivery.status
    delivery.status = status
    delivery.processedBy = req.user._id

    // If status is 'done', update product stock in the specific warehouse
    if (status === 'done') {
      for (const item of delivery.items) {
        const product = await Product.findById(item.productId)
        if (product) {
          // Find the warehouse in the product's warehouses array
          const warehouseEntry = product.warehouses.find(
            wh => wh.warehouseName === delivery.warehouse
          )
          
          if (warehouseEntry) {
            // Decrease stock in this warehouse
            warehouseEntry.stock = Math.max(0, warehouseEntry.stock - item.quantity)
            await product.save()
          }
        }
      }
    }

    await delivery.save()

    // Create history entry
    await History.create({
      action: 'update',
      type: 'delivery',
      data: { id: delivery.deliveryId, statusChange: { from: oldStatus, to: status } },
      userId: req.user._id,
      userName: req.user.name
    })

    res.status(200).json({
      success: true,
      message: `Delivery status updated to ${status}`,
      data: delivery
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete delivery
// @route   DELETE /api/deliveries/:id
// @access  Private (Manager only)
export const deleteDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id)

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      })
    }

    // Create history entry
    await History.create({
      action: 'delete',
      type: 'delivery',
      data: { id: delivery.deliveryId, customer: delivery.customer },
      userId: req.user._id,
      userName: req.user.name
    })

    res.status(200).json({
      success: true,
      message: 'Delivery deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}
