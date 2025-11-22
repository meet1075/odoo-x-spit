// Helper function to get ID from either _id (MongoDB) or id (local)
export const getId = (item) => {
  return item?._id || item?.id
}

// Helper to normalize item with consistent id field
export const normalizeItem = (item) => {
  if (!item) return item
  return {
    ...item,
    id: getId(item)
  }
}

// Helper to normalize array of items
export const normalizeItems = (items) => {
  if (!Array.isArray(items)) return []
  return items.map(normalizeItem)
}

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount || 0)
}

// Get status badge class
export const getStatusClass = (status) => {
  const statusClasses = {
    draft: 'bg-gray-100 text-gray-800',
    waiting: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}
