import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import PermissionGuard from '../components/PermissionGuard'
import { formatDateTime, getStatusColor } from '../utils/storage'
import { hasPermission } from '../utils/permissions'
import { PERMISSIONS } from '../utils/permissions'
import { Plus, Upload, Check, X, Package } from 'lucide-react'

const Deliveries = () => {
  const { user } = useAuth()
  const { deliveries, products, addDelivery, updateDelivery } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)
  const canCreate = hasPermission(user?.role, PERMISSIONS.CREATE_DELIVERY)
  const canProcess = hasPermission(user?.role, PERMISSIONS.PROCESS_DELIVERY)
  const [formData, setFormData] = useState({
    customer: '',
    warehouse: 'Main Warehouse',
    items: [{ productId: '', quantity: 0 }]
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const items = formData.items.map(item => {
      const product = products.find(p => p.id === item.productId)
      return {
        productId: item.productId,
        productName: product?.name || '',
        quantity: parseInt(item.quantity),
        unit: product?.unitOfMeasure || 'units'
      }
    })

    addDelivery({
      ...formData,
      items,
      status: 'draft',
      date: new Date().toISOString()
    })
    
    closeModal()
  }

  const openModal = () => {
    setFormData({
      customer: '',
      warehouse: 'Main Warehouse',
      items: [{ productId: '', quantity: 0 }]
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 0 }]
    })
  }

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    })
  }

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value
    setFormData({ ...formData, items: newItems })
  }

  const handleStatusUpdate = (id, status) => {
    updateDelivery(id, { status })
    const statusMessages = {
      waiting: 'Items picked successfully',
      ready: 'Items packed successfully',
      done: 'Delivery validated! Stock updated.',
      canceled: 'Delivery canceled'
    }
    setSuccessMessage(statusMessages[status] || 'Status updated')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  // Separate pending and completed deliveries
  const pendingDeliveries = deliveries.filter(d => d.status !== 'done' && d.status !== 'canceled')
  const completedDeliveries = deliveries.filter(d => d.status === 'done' || d.status === 'canceled')

  return (
    <Layout>
      <div className="p-8">
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-2 animate-pulse">
            <Check className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user?.role === 'staff' ? 'Pick & Pack' : 'Deliveries (Outgoing Stock)'}</h1>
            <p className="text-gray-500 mt-1">{user?.role === 'staff' ? 'Pick, pack and ship orders to customers' : 'Manage outgoing deliveries to customers'}</p>
          </div>
          <PermissionGuard permission={PERMISSIONS.CREATE_DELIVERY}>
            <button onClick={openModal} className="btn btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Delivery
            </button>
          </PermissionGuard>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setShowCompleted(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !showCompleted ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending ({pendingDeliveries.length})
          </button>
          <button
            onClick={() => setShowCompleted(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showCompleted ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed ({completedDeliveries.length})
          </button>
        </div>

        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Delivery ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Warehouse</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(showCompleted ? completedDeliveries : pendingDeliveries).length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      {showCompleted ? 'No completed deliveries' : 'No pending deliveries'}
                    </td>
                  </tr>
                ) : (
                  (showCompleted ? completedDeliveries : pendingDeliveries).map((delivery) => (
                    <tr key={delivery.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium">{delivery.id}</td>
                      <td className="py-3 px-4 text-sm">{delivery.customer}</td>
                      <td className="py-3 px-4 text-sm">{delivery.warehouse}</td>
                      <td className="py-3 px-4 text-sm">
                        {delivery.items?.length || 0} item(s)
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDateTime(delivery.date)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${getStatusColor(delivery.status)}`}>
                          {delivery.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {user?.role === 'staff' && delivery.status !== 'done' && delivery.status !== 'canceled' && (
                          <div className="flex gap-2">
                            {delivery.status === 'draft' && (
                              <button
                                onClick={() => handleStatusUpdate(delivery.id, 'waiting')}
                                className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                                title="Pick Items"
                              >
                                Pick
                              </button>
                            )}
                            {delivery.status === 'waiting' && (
                              <button
                                onClick={() => handleStatusUpdate(delivery.id, 'ready')}
                                className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                title="Pack Items"
                              >
                                Pack
                              </button>
                            )}
                            {delivery.status === 'ready' && (
                              <button
                                onClick={() => handleStatusUpdate(delivery.id, 'done')}
                                className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center gap-1"
                                title="Validate Delivery"
                              >
                                <Check className="w-3 h-3" />
                                Validate
                              </button>
                            )}
                            <button
                              onClick={() => handleStatusUpdate(delivery.id, 'canceled')}
                              className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
                            >
                              <X className="w-3 h-3" />
                              Cancel
                            </button>
                          </div>
                        )}
                        {user?.role === 'manager' && (
                          <span className="text-xs text-gray-500 italic">Staff will process</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workflow Info */}
        <div className={`mt-6 card border ${user?.role === 'staff' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}`}>
          <h3 className={`font-semibold mb-2 flex items-center gap-2 ${user?.role === 'staff' ? 'text-orange-900' : 'text-blue-900'}`}>
            <Package className="w-5 h-5" />
            {user?.role === 'staff' ? 'Pick & Pack Workflow Guide' : 'Delivery Workflow'}
          </h3>
          <div className={`flex items-center gap-4 text-sm flex-wrap ${user?.role === 'staff' ? 'text-orange-800' : 'text-blue-800'}`}>
            <div className="flex items-center gap-2">
              <span className="badge badge-draft">Draft</span>
              <span className="text-xs">{user?.role === 'staff' ? 'Created by manager' : 'Created'}</span>
            </div>
            <span>→</span>
            <div className="flex items-center gap-2">
              <span className="badge badge-waiting">Pick</span>
              <span className="text-xs">Collect items from warehouse</span>
            </div>
            <span>→</span>
            <div className="flex items-center gap-2">
              <span className="badge badge-ready">Pack</span>
              <span className="text-xs">Package for shipping</span>
            </div>
            <span>→</span>
            <div className="flex items-center gap-2">
              <span className="badge badge-done">Validate</span>
              <span className="text-xs font-semibold">Stock decreases ✓</span>
            </div>
          </div>
          {user?.role === 'staff' && (
            <p className="text-xs text-orange-700 mt-3">
              💡 <strong>Your role:</strong> Pick items from warehouse, pack them securely, then validate to complete delivery and decrease stock.
            </p>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create New Delivery" size="lg">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                className="input"
                placeholder="Enter customer name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warehouse *
              </label>
              <select
                value={formData.warehouse}
                onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                className="input"
                required
              >
                <option value="Main Warehouse">Main Warehouse</option>
                <option value="Production Floor">Production Floor</option>
                <option value="Warehouse 2">Warehouse 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Products *
              </label>
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <select
                    value={item.productId}
                    onChange={(e) => updateItem(index, 'productId', e.target.value)}
                    className="input flex-1"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku}) - Stock: {p.stock}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className="input w-32"
                    placeholder="Qty"
                    min="1"
                    required
                  />
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="btn btn-danger"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="btn btn-secondary text-sm mt-2"
              >
                + Add Item
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={closeModal} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              Create Delivery
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}

export default Deliveries
