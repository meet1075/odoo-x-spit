import { createContext, useContext, useState, useEffect } from 'react'
import { initializeDemoData, getFromStorage, saveToStorage } from '../utils/storage'

const DataContext = createContext(null)

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [receipts, setReceipts] = useState([])
  const [deliveries, setDeliveries] = useState([])
  const [transfers, setTransfers] = useState([])
  const [adjustments, setAdjustments] = useState([])
  const [history, setHistory] = useState([])
  const [warehouses, setWarehouses] = useState([])

  useEffect(() => {
    // Always initialize from centralized JSON to ensure consistency
    if (!localStorage.getItem('stockmaster_initialized')) {
      initializeDemoData()
    }
    loadData()
  }, [])

  const loadData = () => {
    setProducts(getFromStorage('products'))
    setReceipts(getFromStorage('receipts'))
    setDeliveries(getFromStorage('deliveries'))
    setTransfers(getFromStorage('transfers'))
    setAdjustments(getFromStorage('adjustments'))
    setHistory(getFromStorage('history'))
    setWarehouses(getFromStorage('warehouses'))
  }

  // Product operations
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    const updated = [...products, newProduct]
    setProducts(updated)
    saveToStorage('products', updated)
    addToHistory('create', 'product', newProduct)
    return newProduct
  }

  const updateProduct = (id, updates) => {
    const updated = products.map(p => p.id === id ? { ...p, ...updates } : p)
    setProducts(updated)
    saveToStorage('products', updated)
    addToHistory('update', 'product', { id, ...updates })
  }

  const deleteProduct = (id) => {
    const updated = products.filter(p => p.id !== id)
    setProducts(updated)
    saveToStorage('products', updated)
    addToHistory('delete', 'product', { id })
  }

  // Warehouse operations
  const addWarehouse = (warehouse) => {
    const newWarehouse = {
      ...warehouse,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    const updated = [...warehouses, newWarehouse]
    setWarehouses(updated)
    saveToStorage('warehouses', updated)
    addToHistory('create', 'warehouse', newWarehouse)
    return newWarehouse
  }

  const updateWarehouse = (id, updates) => {
    const updated = warehouses.map(w => w.id === id ? { ...w, ...updates } : w)
    setWarehouses(updated)
    saveToStorage('warehouses', updated)
    addToHistory('update', 'warehouse', { id, ...updates })
  }

  const deleteWarehouse = (id) => {
    const updated = warehouses.filter(w => w.id !== id)
    setWarehouses(updated)
    saveToStorage('warehouses', updated)
    addToHistory('delete', 'warehouse', { id })
  }

  // Receipt operations
  const addReceipt = (receipt) => {
    const newReceipt = {
      ...receipt,
      id: `RCP-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: receipt.status || 'draft'
    }
    const updated = [...receipts, newReceipt]
    setReceipts(updated)
    saveToStorage('receipts', updated)
    addToHistory('create', 'receipt', newReceipt)
    return newReceipt
  }

  const updateReceipt = (id, updates) => {
    const updated = receipts.map(r => r.id === id ? { ...r, ...updates } : r)
    setReceipts(updated)
    saveToStorage('receipts', updated)
    
    // If validated, update product stock
    if (updates.status === 'done') {
      const receipt = receipts.find(r => r.id === id)
      if (receipt && receipt.items) {
        receipt.items.forEach(item => {
          updateProductStock(item.productId, item.quantity, 'add', receipt.warehouse)
        })
      }
    }
    
    addToHistory('update', 'receipt', { id, ...updates })
  }

  // Delivery operations
  const addDelivery = (delivery) => {
    const newDelivery = {
      ...delivery,
      id: `DEL-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: delivery.status || 'draft'
    }
    const updated = [...deliveries, newDelivery]
    setDeliveries(updated)
    saveToStorage('deliveries', updated)
    addToHistory('create', 'delivery', newDelivery)
    return newDelivery
  }

  const updateDelivery = (id, updates) => {
    const updated = deliveries.map(d => d.id === id ? { ...d, ...updates } : d)
    setDeliveries(updated)
    saveToStorage('deliveries', updated)
    
    // If validated, update product stock
    if (updates.status === 'done') {
      const delivery = deliveries.find(d => d.id === id)
      if (delivery && delivery.items) {
        delivery.items.forEach(item => {
          updateProductStock(item.productId, item.quantity, 'subtract', delivery.warehouse)
        })
      }
    }
    
    addToHistory('update', 'delivery', { id, ...updates })
  }

  // Transfer operations
  const addTransfer = (transfer) => {
    const newTransfer = {
      ...transfer,
      id: `TRF-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: transfer.status || 'draft'
    }
    const updated = [...transfers, newTransfer]
    setTransfers(updated)
    saveToStorage('transfers', updated)
    addToHistory('create', 'transfer', newTransfer)
    return newTransfer
  }

  const updateTransfer = (id, updates) => {
    const updated = transfers.map(t => t.id === id ? { ...t, ...updates } : t)
    setTransfers(updated)
    saveToStorage('transfers', updated)
    
    // If validated, update location
    if (updates.status === 'done') {
      const transfer = transfers.find(t => t.id === id)
      if (transfer) {
        // Update product location without changing total quantity
        updateProductLocation(transfer.productId, transfer.fromLocation, transfer.toLocation, transfer.quantity)
      }
    }
    
    addToHistory('update', 'transfer', { id, ...updates })
  }

  // Adjustment operations
  const addAdjustment = (adjustment) => {
    const newAdjustment = {
      ...adjustment,
      id: `ADJ-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'done'
    }
    
    // Update stock immediately
    const product = products.find(p => p.id === adjustment.productId)
    if (product) {
      const currentStock = product.stock || 0
      const difference = adjustment.newQuantity - currentStock
      updateProductStock(adjustment.productId, Math.abs(difference), difference > 0 ? 'add' : 'subtract', adjustment.location)
    }
    
    const updated = [...adjustments, newAdjustment]
    setAdjustments(updated)
    saveToStorage('adjustments', updated)
    addToHistory('create', 'adjustment', newAdjustment)
    return newAdjustment
  }

  // Helper: Update product stock
  const updateProductStock = (productId, quantity, operation, location) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const currentStock = p.stock || 0
        const newStock = operation === 'add' 
          ? currentStock + quantity 
          : currentStock - quantity
        return { ...p, stock: Math.max(0, newStock) }
      }
      return p
    })
    setProducts(updated)
    saveToStorage('products', updated)
  }

  const updateProductLocation = (productId, fromLocation, toLocation, quantity) => {
    // In a real app, this would update location-specific stock
    addToHistory('move', 'product', { productId, fromLocation, toLocation, quantity })
  }

  // History
  const addToHistory = (action, type, data) => {
    const entry = {
      id: Date.now().toString(),
      action,
      type,
      data,
      timestamp: new Date().toISOString()
    }
    const updated = [entry, ...history].slice(0, 100) // Keep last 100 entries
    setHistory(updated)
    saveToStorage('history', updated)
  }

  const value = {
    products,
    receipts,
    deliveries,
    transfers,
    adjustments,
    history,
    warehouses,
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
