const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Get token from localStorage
const getToken = () => {
  const user = localStorage.getItem('stockmaster_user')
  if (user) {
    const userData = JSON.parse(user)
    return userData.token
  }
  return null
}

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data,
        endpoint: endpoint
      })
      throw new Error(data.message || data.error || 'Something went wrong')
    }

    return data
  } catch (error) {
    console.error('API Request Failed:', error)
    throw error
  }
}

// Auth API
export const authAPI = {
  login: (email, password) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (name, email, password, role = 'staff') =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    }),

  getMe: () => apiRequest('/auth/me'),

  updateProfile: (data) =>
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  changePassword: (currentPassword, newPassword) =>
    apiRequest('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    })
}

// Products API
export const productsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/products${query ? `?${query}` : ''}`)
  },

  getById: (id) => apiRequest(`/products/${id}`),

  create: (data) =>
    apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  update: (id, data) =>
    apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  delete: (id) =>
    apiRequest(`/products/${id}`, {
      method: 'DELETE'
    }),

  updateStock: (id, operation, quantity) =>
    apiRequest(`/products/${id}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ operation, quantity })
    })
}

// Warehouses API
export const warehousesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/warehouses${query ? `?${query}` : ''}`)
  },

  getById: (id) => apiRequest(`/warehouses/${id}`),

  create: (data) =>
    apiRequest('/warehouses', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  update: (id, data) =>
    apiRequest(`/warehouses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  delete: (id) =>
    apiRequest(`/warehouses/${id}`, {
      method: 'DELETE'
    })
}

// Receipts API
export const receiptsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/receipts${query ? `?${query}` : ''}`)
  },

  getById: (id) => apiRequest(`/receipts/${id}`),

  create: (data) =>
    apiRequest('/receipts', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateStatus: (id, status) =>
    apiRequest(`/receipts/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),

  delete: (id) =>
    apiRequest(`/receipts/${id}`, {
      method: 'DELETE'
    })
}

// Deliveries API
export const deliveriesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/deliveries${query ? `?${query}` : ''}`)
  },

  getById: (id) => apiRequest(`/deliveries/${id}`),

  create: (data) =>
    apiRequest('/deliveries', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateStatus: (id, status) =>
    apiRequest(`/deliveries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),

  delete: (id) =>
    apiRequest(`/deliveries/${id}`, {
      method: 'DELETE'
    })
}

// Transfers API
export const transfersAPI = {
  getAll: () => apiRequest('/transfers'),

  create: (data) =>
    apiRequest('/transfers', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateStatus: (id, status) =>
    apiRequest(`/transfers/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),

  delete: (id) =>
    apiRequest(`/transfers/${id}`, {
      method: 'DELETE'
    })
}

// Adjustments API
export const adjustmentsAPI = {
  getAll: () => apiRequest('/adjustments'),

  create: (data) =>
    apiRequest('/adjustments', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  delete: (id) =>
    apiRequest(`/adjustments/${id}`, {
      method: 'DELETE'
    })
}

// History API
export const historyAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/history${query ? `?${query}` : ''}`)
  },

  getDashboardStats: () => apiRequest('/history/dashboard/stats')
}

export default {
  auth: authAPI,
  products: productsAPI,
  warehouses: warehousesAPI,
  receipts: receiptsAPI,
  deliveries: deliveriesAPI,
  transfers: transfersAPI,
  adjustments: adjustmentsAPI,
  history: historyAPI
}
