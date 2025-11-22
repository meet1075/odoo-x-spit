import Warehouse from '../models/Warehouse.js'
import History from '../models/History.js'


export const getWarehouses = async (req, res, next) => {
  try {
    const { type, isActive } = req.query
    let query = {}

    if (type) query.type = type
    if (isActive !== undefined) query.isActive = isActive === 'true'

    const warehouses = await Warehouse.find(query).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: warehouses.length,
      data: warehouses
    })
  } catch (error) {
    next(error)
  }
}


export const getWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id)

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      })
    }

    res.status(200).json({
      success: true,
      data: warehouse
    })
  } catch (error) {
    next(error)
  }
}


export const createWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.create(req.body)

    // Create history entry
    await History.create({
      action: 'create',
      type: 'warehouse',
      data: { id: warehouse._id, name: warehouse.name, location: warehouse.location },
      userId: req.user._id,
      userName: req.user.name
    })

    res.status(201).json({
      success: true,
      message: 'Warehouse created successfully',
      data: warehouse
    })
  } catch (error) {
    next(error)
  }
}


export const updateWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      })
    }

    // Create history entry
    await History.create({
      action: 'update',
      type: 'warehouse',
      data: { id: warehouse._id, name: warehouse.name, updates: req.body },
      userId: req.user._id,
      userName: req.user.name
    })

    res.status(200).json({
      success: true,
      message: 'Warehouse updated successfully',
      data: warehouse
    })
  } catch (error) {
    next(error)
  }
}


export const deleteWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id)

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      })
    }

    // Create history entry
    await History.create({
      action: 'delete',
      type: 'warehouse',
      data: { id: warehouse._id, name: warehouse.name },
      userId: req.user._id,
      userName: req.user.name
    })

    res.status(200).json({
      success: true,
      message: 'Warehouse deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}
