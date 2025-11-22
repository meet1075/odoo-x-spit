// Demo data initialization and storage utilities
import demoData from '../data/demoData.json'

export const initializeDemoData = () => {
  // Always load from the centralized JSON file to ensure consistency
  localStorage.setItem('stockmaster_products', JSON.stringify(demoData.products))
  localStorage.setItem('stockmaster_receipts', JSON.stringify(demoData.receipts))
  localStorage.setItem('stockmaster_deliveries', JSON.stringify(demoData.deliveries))
  localStorage.setItem('stockmaster_transfers', JSON.stringify(demoData.transfers))
  localStorage.setItem('stockmaster_adjustments', JSON.stringify(demoData.adjustments))
  localStorage.setItem('stockmaster_warehouses', JSON.stringify(demoData.warehouses))
  localStorage.setItem('stockmaster_history', JSON.stringify(demoData.history))
  localStorage.setItem('stockmaster_initialized', 'true')
}

export const getFromStorage = (key) => {
  const data = localStorage.getItem(`stockmaster_${key}`)
  return data ? JSON.parse(data) : []
}

export const saveToStorage = (key, data) => {
  localStorage.setItem(`stockmaster_${key}`, JSON.stringify(data))
}

export const clearStorage = () => {
  const keys = ['products', 'receipts', 'deliveries', 'transfers', 'adjustments', 'warehouses', 'history']
  keys.forEach(key => localStorage.removeItem(`stockmaster_${key}`))
  localStorage.removeItem('stockmaster_initialized')
}

export const resetToFreshDemo = () => {
  // Clear all existing data
  clearStorage()
  // Force reinitialize with fresh demo data from JSON
  initializeDemoData()
  return true
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getStatusColor = (status) => {
  const colors = {
    draft: 'badge-draft',
    waiting: 'badge-waiting',
    ready: 'badge-ready',
    done: 'badge-done',
    canceled: 'badge-canceled'
  }
  return colors[status] || 'badge-draft'
}

export const getCategoryName = (category) => {
  const names = {
    raw: 'Raw Materials',
    finished: 'Finished Goods',
    consumables: 'Consumables'
  }
  return names[category] || category
}
