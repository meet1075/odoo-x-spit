import History from '../models/History.js'

// @desc    Get history
// @route   GET /api/history
// @access  Private
export const getHistory = async (req, res, next) => {
  try {
    const { type, action, userId, limit = 100 } = req.query

    let query = {}
    if (type) query.type = type
    if (action) query.action = action
    if (userId) query.userId = userId

    const history = await History.find(query)
      .populate('userId', 'name email role')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const Product = (await import('../models/Product.js')).default
    const Receipt = (await import('../models/Receipt.js')).default
    const Delivery = (await import('../models/Delivery.js')).default
    const Transfer = (await import('../models/Transfer.js')).default
    const Warehouse = (await import('../models/Warehouse.js')).default

    const [
      totalProducts,
      lowStockProducts,
      pendingReceipts,
      pendingDeliveries,
      pendingTransfers,
      totalWarehouses,
      recentHistory
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ $expr: { $lt: ['$stock', '$minStock'] } }),
      Receipt.countDocuments({ status: { $in: ['draft', 'waiting', 'ready'] } }),
      Delivery.countDocuments({ status: { $in: ['draft', 'waiting', 'ready'] } }),
      Transfer.countDocuments({ status: { $in: ['draft', 'waiting', 'ready'] } }),
      Warehouse.countDocuments({ isActive: true }),
      History.find().sort({ timestamp: -1 }).limit(10).populate('userId', 'name')
    ])

    res.status(200).json({
      success: true,
      data: {
        products: {
          total: totalProducts,
          lowStock: lowStockProducts
        },
        operations: {
          pendingReceipts,
          pendingDeliveries,
          pendingTransfers
        },
        warehouses: totalWarehouses,
        recentActivity: recentHistory
      }
    })
  } catch (error) {
    next(error)
  }
}
