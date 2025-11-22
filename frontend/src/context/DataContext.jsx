import { createContext, useContext, useState, useEffect } from 'react'
import { 
  productsAPI, 
  warehousesAPI, 
  receiptsAPI, 
  deliveriesAPI, 
  transfersAPI, 
  adjustmentsAPI, 
  historyAPI 
} from '../services/api'
import { normalizeItems } from '../utils/helpers'

const DataContext = createContext(null)

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [receipts, setReceipts] = useState([])
  const [deliveries, setDeliveries] = useState([])
  const [transfers, setTransfers] = useState([])
  const [adjustments, setAdjustments] = useState([])
  const [history, setHistory] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [
        productsData,
        warehousesData,
        receiptsData,
        deliveriesData,
        transfersData,
        adjustmentsData,
        historyData
      ] = await Promise.all([
        productsAPI.getAll(),
        warehousesAPI.getAll(),
        receiptsAPI.getAll(),
        deliveriesAPI.getAll(),
        transfersAPI.getAll(),
        adjustmentsAPI.getAll(),
        historyAPI.getAll({ limit: 100 })
      ])

      // Normalize data to use consistent 'id' field
      setProducts(normalizeItems(productsData.data || []))
      setWarehouses(normalizeItems(warehousesData.data || []))
      setReceipts(normalizeItems(receiptsData.data || []))
      setDeliveries(normalizeItems(deliveriesData.data || []))
      setTransfers(normalizeItems(transfersData.data || []))
      setAdjustments(normalizeItems(adjustmentsData.data || []))
      setHistory(normalizeItems(historyData.data || []))
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Product operations
  const addProduct = async (product) => {
    try {
      const response = await productsAPI.create(product)
      if (response.success) {
        setProducts([...products, response.data])
        await loadData() // Refresh all data
        return response.data
      }
    } catch (error) {
      console.error('Error adding product:', error)
      throw error
    }
  }

  const updateProduct = async (id, updates) => {
    try {
      // Use _id for API call (MongoDB ID)
      const mongoId = products.find(p => p.id === id)?._id || id
      const response = await productsAPI.update(mongoId, updates)
      if (response.success) {
        await loadData()
      }
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  const deleteProduct = async (id) => {
    try {
      // Use _id for API call (MongoDB ID)
      const mongoId = products.find(p => p.id === id)?._id || id
      const response = await productsAPI.delete(mongoId)
      if (response.success) {
        await loadData()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  // Warehouse operations
  const addWarehouse = async (warehouse) => {
    try {
      const response = await warehousesAPI.create(warehouse)
      if (response.success) {
        setWarehouses([...warehouses, response.data])
        await loadData()
        return response.data
      }
    } catch (error) {
      console.error('Error adding warehouse:', error)
      throw error
    }
  }

  const updateWarehouse = async (id, updates) => {
    try {
      const mongoId = warehouses.find(w => w.id === id)?._id || id
      const response = await warehousesAPI.update(mongoId, updates)
      if (response.success) {
        await loadData()
      }
    } catch (error) {
      console.error('Error updating warehouse:', error)
      throw error
    }
  }

  const deleteWarehouse = async (id) => {
    try {
      const mongoId = warehouses.find(w => w.id === id)?._id || id
      const response = await warehousesAPI.delete(mongoId)
      if (response.success) {
        await loadData()
      }
    } catch (error) {
      console.error('Error deleting warehouse:', error)
      throw error
    }
  }

  // Receipt operations
  const addReceipt = async (receipt) => {
    try {
      const response = await receiptsAPI.create(receipt)
      if (response.success) {
        setReceipts([...receipts, response.data])
        await loadData()
        return response.data
      }
    } catch (error) {
      console.error('Error adding receipt:', error)
      throw error
    }
  }

  const updateReceipt = async (id, updates) => {
    try {
      const mongoId = receipts.find(r => r.id === id)?._id || id
      // Use updateStatus endpoint if only status is being updated
      if (updates.status && Object.keys(updates).length === 1) {
        const response = await receiptsAPI.updateStatus(mongoId, updates.status)
        if (response.success) {
          await loadData() // Refresh to get updated stock
        }
      }
    } catch (error) {
      console.error('Error updating receipt:', error)
      throw error
    }
  }

  // Delivery operations
  const addDelivery = async (delivery) => {
    try {
      const response = await deliveriesAPI.create(delivery)
      if (response.success) {
        setDeliveries([...deliveries, response.data])
        await loadData()
        return response.data
      }
    } catch (error) {
      console.error('Error adding delivery:', error)
      throw error
    }
  }

  const updateDelivery = async (id, updates) => {
    try {
      const mongoId = deliveries.find(d => d.id === id)?._id || id
      // Use updateStatus endpoint if only status is being updated
      if (updates.status && Object.keys(updates).length === 1) {
        const response = await deliveriesAPI.updateStatus(mongoId, updates.status)
        if (response.success) {
          await loadData() // Refresh to get updated stock
        }
      }
    } catch (error) {
      console.error('Error updating delivery:', error)
      throw error
    }
  }

  // Transfer operations
  const addTransfer = async (transfer) => {
    try {
      const response = await transfersAPI.create(transfer)
      if (response.success) {
        setTransfers([...transfers, response.data])
        await loadData()
        return response.data
      }
    } catch (error) {
      console.error('Error adding transfer:', error)
      throw error
    }
  }

  const updateTransfer = async (id, updates) => {
    try {
      const mongoId = transfers.find(t => t.id === id)?._id || id
      // Use updateStatus endpoint if only status is being updated
      if (updates.status && Object.keys(updates).length === 1) {
        const response = await transfersAPI.updateStatus(mongoId, updates.status)
        if (response.success) {
          await loadData() // Refresh to get updated data
        }
      }
    } catch (error) {
      console.error('Error updating transfer:', error)
      throw error
    }
  }

  // Adjustment operations
  const addAdjustment = async (adjustment) => {
    try {
      const response = await adjustmentsAPI.create(adjustment)
      if (response.success) {
        setAdjustments([...adjustments, response.data])
        await loadData() // Refresh to get updated stock
        return response.data
      }
    } catch (error) {
      console.error('Error adding adjustment:', error)
      throw error
    }
  }

  const value = {
    products,
    receipts,
    deliveries,
    transfers,
    adjustments,
    history,
    warehouses,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    addWarehouse,
    updateWarehouse,
    deleteWarehouse,
    addReceipt,
    updateReceipt,
    addDelivery,
    updateDelivery,
    addTransfer,
    updateTransfer,
    addAdjustment,
    loadData
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}
