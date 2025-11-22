import Product from '../models/Product.js'
import History from '../models/History.js'


export const getProducts = async (req, res, next) => {
  try {
    const { category, location, search, lowStock } = req.query

    let query = {}

    if (category) query.category = category
    if (location) query.location = location
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ]
    }
    if (lowStock === 'true') {
      query.$expr = { $lt: ['$stock', '$minStock'] }
    }

    const products = await Product.find(query).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    })
  } catch (error) {
    next(error)
  }
}


export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    res.status(200).json({
      success: true,
      data: product
    })
  } catch (error) {
    next(error)
  }
}


export const createProduct = async (req, res, next) => {
  try {
    console.log('=========================================')
    console.log('CREATE PRODUCT REQUEST')
    console.log('=========================================')
    console.log('Received product data:', JSON.stringify(req.body, null, 2))
    console.log('User:', req.user?.name, req.user?.email)
    console.log('Request body keys:', Object.keys(req.body))
    console.log('Warehouses type:', typeof req.body.warehouses, Array.isArray(req.body.warehouses))
    console.log('=========================================')
    
    // Validate warehouses array
    if (!req.body.warehouses || !Array.isArray(req.body.warehouses) || req.body.warehouses.length === 0) {
      console.log('❌ VALIDATION ERROR: No warehouses provided or invalid format')
      console.log('Warehouses value:', req.body.warehouses)
      return res.status(400).json({
        success: false,
        message: 'At least one warehouse is required and must be an array'
      })
    }

    // Validate each warehouse has required fields
    for (let i = 0; i < req.body.warehouses.length; i++) {
      const wh = req.body.warehouses[i]
      if (!wh.warehouseName) {
        console.log(`❌ VALIDATION ERROR: Warehouse at index ${i} missing warehouseName`)
        return res.status(400).json({
          success: false,
          message: `Warehouse at index ${i} must have a warehouseName`
        })
      }
    }

    console.log('✓ Warehouses validation passed')
    console.log('Attempting to create product...')

    const product = await Product.create(req.body)

    console.log('✓ Product created successfully:', product._id)

    // Create history entry
    await History.create({
      action: 'create',
      type: 'product',
      data: { id: product._id, name: product.name, sku: product.sku },
      userId: req.user._id,
      userName: req.user.name
    })

    console.log('✓ History entry created')
    console.log('=========================================')

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    })
  } catch (error) {
    console.error('=========================================')
    console.error('❌ ERROR CREATING PRODUCT')
    console.error('=========================================')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    if (error.errors) {
      console.error('Validation errors:')
      Object.keys(error.errors).forEach(key => {
        console.error(`  - ${key}: ${error.errors[key].message}`)
      })
    }
    console.error('Full error:', error)
    console.error('=========================================')
    next(error)
  }
}


export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Create history entry
    await History.create({
      action: 'update',
      type: 'product',
      data: { id: product._id, name: product.name, updates: req.body },
      userId: req.user._id,
      userName: req.user.name
    })

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    })
  } catch (error) {
    next(error)
  }
}


export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Create history entry
    await History.create({
      action: 'delete',
      type: 'product',
      data: { id: product._id, name: product.name, sku: product.sku },
      userId: req.user._id,
      userName: req.user.name
    })

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}


export const updateStock = async (req, res, next) => {
  try {
    const { quantity, operation } = req.body
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    const oldStock = product.stock

    if (operation === 'add') {
      product.stock += quantity
    } else if (operation === 'subtract') {
      product.stock = Math.max(0, product.stock - quantity)
    } else {
      product.stock = quantity
    }

    await product.save()

    // Create history entry
    await History.create({
      action: 'update',
      type: 'product',
      data: {
        id: product._id,
        name: product.name,
        stockChange: { old: oldStock, new: product.stock, operation }
      },
      userId: req.user._id,
      userName: req.user.name
    })

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: product
    })
  } catch (error) {
    next(error)
  }
}
