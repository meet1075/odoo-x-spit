import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import PermissionGuard from '../components/PermissionGuard'
import { formatDateTime, getStatusColor } from '../utils/storage'
import { hasPermission } from '../utils/permissions'
import { PERMISSIONS } from '../utils/permissions'
import { Plus, Download, Check, X } from 'lucide-react'

const Receipts = () => {
  const { user } = useAuth()
  const { receipts, products, addReceipt, updateReceipt } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)
  const canCreate = hasPermission(user?.role, PERMISSIONS.CREATE_RECEIPT)
  const canProcess = hasPermission(user?.role, PERMISSIONS.PROCESS_RECEIPT)
  const [formData, setFormData] = useState({
    supplier: '',
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

    addReceipt({
      ...formData,
      items,
      status: 'draft',
      date: new Date().toISOString()
    })
    
    closeModal()
  }

  const openModal = () => {
    setFormData({
      supplier: '',
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
    updateReceipt(id, { status })
    const statusMessages = {
      waiting: 'Receipt marked as Waiting',
      ready: 'Receipt marked as Ready',
      done: 'Receipt validated successfully! Stock updated.',
      canceled: 'Receipt canceled'
    }
    setSuccessMessage(statusMessages[status] || 'Status updated')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  // Separate pending and completed receipts
  const pendingReceipts = receipts.filter(r => r.status !== 'done' && r.status !== 'canceled')
  const completedReceipts = receipts.filter(r => r.status === 'done' || r.status === 'canceled')

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
            <h1 className="text-3xl font-bold text-gray-900">{user?.role === 'staff' ? 'Receive Goods' : 'Receipts (Incoming Stock)'}</h1>
            <p className="text-gray-500 mt-1">{user?.role === 'staff' ? 'Process incoming goods from suppliers' : 'Manage incoming goods from suppliers'}</p>
          </div>
          <PermissionGuard permission={PERMISSIONS.CREATE_RECEIPT}>
            <button onClick={openModal} className="btn btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Receipt
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
            Pending ({pendingReceipts.length})
          </button>
          <button
            onClick={() => setShowCompleted(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showCompleted ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed ({completedReceipts.length})
          </button>
        </div>

        {/* Workflow Info for Staff */}
        {user?.role === 'staff' && (
          <div className="mb-6 card bg-green-50 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Receipt Workflow Guide
            </h3>
            <div className="flex items-center gap-4 text-sm text-green-800 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="badge badge-draft">Draft</span>
                <span className="text-xs">Created by manager</span>
              </div>
              <span>→</span>
              <div className="flex items-center gap-2">
                <span className="badge badge-waiting">Waiting</span>
                <span className="text-xs">Goods arrived, ready to receive</span>
              </div>
              <span>→</span>
              <div className="flex items-center gap-2">
                <span className="badge badge-ready">Ready</span>
                <span className="text-xs">Checked and verified</span>
              </div>
              <span>→</span>
              <div className="flex items-center gap-2">
                <span className="badge badge-done">Validate</span>
                <span className="text-xs font-semibold">Stock increases ✓</span>
              </div>
            </div>
            <p className="text-xs text-green-700 mt-3">
              💡 <strong>Your role:</strong> Process receipts through each stage. Validate when goods are received and verified to increase stock.
            </p>
          </div>
        )}

        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Receipt ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Supplier</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Warehouse</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(showCompleted ? completedReceipts : pendingReceipts).length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      {showCompleted ? 'No completed receipts' : 'No pending receipts'}
                    </td>
                  </tr>
                ) : (
                  (showCompleted ? completedReceipts : pendingReceipts).map((receipt) => (
                    <tr key={receipt.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium">{receipt.id}</td>
                      <td className="py-3 px-4 text-sm">{receipt.supplier}</td>
                      <td className="py-3 px-4 text-sm">{receipt.warehouse}</td>
                      <td className="py-3 px-4 text-sm">
                        {receipt.items?.length || 0} item(s)
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDateTime(receipt.date)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${getStatusColor(receipt.status)}`}>
                          {receipt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {user?.role === 'staff' && receipt.status !== 'done' && receipt.status !== 'canceled' && (
                          <div className="flex gap-2">
                            {receipt.status === 'draft' && (
                              <button
                                onClick={() => handleStatusUpdate(receipt.id, 'waiting')}
                                className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                              >
                                Mark Waiting
                              </button>
                            )}
                            {receipt.status === 'waiting' && (
                              <button
                                onClick={() => handleStatusUpdate(receipt.id, 'ready')}
                                className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                              >
                                Mark Ready
                              </button>
                            )}
                            {receipt.status === 'ready' && (
                              <button
                                onClick={() => handleStatusUpdate(receipt.id, 'done')}
                                className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                Validate
                              </button>
                            )}
                            <button
                              onClick={() => handleStatusUpdate(receipt.id, 'canceled')}
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
      </div>

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create New Receipt" size="lg">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier Name *
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="input"
                placeholder="Enter supplier name"
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
                        {p.name} ({p.sku})
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
              Create Receipt
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}

export default Receipts
