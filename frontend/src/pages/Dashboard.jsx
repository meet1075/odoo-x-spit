import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import Layout from '../components/Layout'
import { formatDateTime, getStatusColor, getCategoryName } from '../utils/storage'
import { 
  Package, 
  AlertTriangle, 
  Download, 
  Upload, 
  Repeat, 
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

const Dashboard = () => {
  const { products, receipts, deliveries, transfers, history } = useData()
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    warehouse: 'all',
    category: 'all'
  })
  const [filteredOperations, setFilteredOperations] = useState([])

  // Calculate KPIs
  const totalProducts = products.reduce((sum, p) => sum + (p.stock || 0), 0)
  const lowStock = products.filter(p => (p.stock || 0) <= (p.minStock || 0)).length
  const pendingReceipts = receipts.filter(r => r.status === 'waiting' || r.status === 'ready').length
  const pendingDeliveries = deliveries.filter(d => d.status === 'waiting' || d.status === 'ready').length
  const internalTransfersCount = transfers.filter(t => t.status !== 'done' && t.status !== 'canceled').length

  useEffect(() => {
    // Combine all operations for the table
    const allOps = [
      ...receipts.map(r => ({ ...r, type: 'receipt', icon: Download })),
      ...deliveries.map(d => ({ ...d, type: 'delivery', icon: Upload })),
      ...transfers.map(t => ({ ...t, type: 'transfer', icon: Repeat }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Apply filters
    let filtered = allOps

    if (filters.type !== 'all') {
      filtered = filtered.filter(op => {
        if (filters.type === 'receipts') return op.type === 'receipt'
        if (filters.type === 'deliveries') return op.type === 'delivery'
        if (filters.type === 'transfers') return op.type === 'transfer'
        return true
      })
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(op => op.status === filters.status)
    }

    if (filters.warehouse !== 'all') {
      filtered = filtered.filter(op => 
        op.warehouse === filters.warehouse || 
        op.fromLocation === filters.warehouse ||
        op.toLocation === filters.warehouse
      )
    }

    setFilteredOperations(filtered.slice(0, 10))
  }, [receipts, deliveries, transfers, filters])

  const lowStockProducts = products.filter(p => (p.stock || 0) <= (p.minStock || 0))

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's your inventory overview</p>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  In Stock
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Low Stock</p>
                <p className="text-3xl font-bold text-red-600">{lowStock}</p>
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  Items
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Receipts</p>
                <p className="text-3xl font-bold text-green-600">{pendingReceipts}</p>
                <p className="text-xs text-gray-500 mt-1">Incoming</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Download className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Deliveries</p>
                <p className="text-3xl font-bold text-orange-600">{pendingDeliveries}</p>
                <p className="text-xs text-gray-500 mt-1">Outgoing</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Internal Transfers</p>
                <p className="text-3xl font-bold text-purple-600">{internalTransfersCount}</p>
                <p className="text-xs text-gray-500 mt-1">Scheduled</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Repeat className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Filter Operations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="input"
            >
              <option value="all">All Documents</option>
              <option value="receipts">Receipts</option>
              <option value="deliveries">Deliveries</option>
              <option value="transfers">Internal Transfers</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="waiting">Waiting</option>
              <option value="ready">Ready</option>
              <option value="done">Done</option>
              <option value="canceled">Canceled</option>
            </select>

            <select
              value={filters.warehouse}
              onChange={(e) => setFilters({ ...filters, warehouse: e.target.value })}
              className="input"
            >
              <option value="all">All Warehouses</option>
              <option value="Main Warehouse">Main Warehouse</option>
              <option value="Production Floor">Production Floor</option>
              <option value="Warehouse 2">Warehouse 2</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="input"
            >
              <option value="all">All Categories</option>
              <option value="raw">Raw Materials</option>
              <option value="finished">Finished Goods</option>
              <option value="consumables">Consumables</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Operations */}
          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-semibold mb-4">Recent Operations</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Location</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOperations.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500">
                        No operations found
                      </td>
                    </tr>
                  ) : (
                    filteredOperations.map((op) => {
                      const Icon = op.icon
                      return (
                        <tr key={op.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium">{op.id}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-gray-500" />
                              <span className="text-sm capitalize">{op.type}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatDateTime(op.createdAt)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {op.warehouse || `${op.fromLocation} → ${op.toLocation}`}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`badge ${getStatusColor(op.status)}`}>
                              {op.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Alerts
            </h3>
            <div className="space-y-3">
              {lowStockProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No alerts</p>
              ) : (
                lowStockProducts.map((product) => (
                  <div key={product.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-600 mt-1">SKU: {product.sku}</p>
                        <p className="text-xs text-gray-600">{getCategoryName(product.category)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">
                          {product.stock} {product.unitOfMeasure}
                        </p>
                        <p className="text-xs text-gray-600">Min: {product.minStock}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
