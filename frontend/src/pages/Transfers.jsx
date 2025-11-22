import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import PermissionGuard from '../components/PermissionGuard'
import { formatDateTime, getStatusColor } from '../utils/storage'
import { hasPermission } from '../utils/permissions'
import { PERMISSIONS } from '../utils/permissions'
import { Plus, Repeat, Check, X, ArrowRight, Clock } from 'lucide-react'

const Transfers = () => {
  const { user } = useAuth()
  const { transfers, products, warehouses, addTransfer, updateTransfer } = useData()
  const canCreate = hasPermission(user?.role, PERMISSIONS.CREATE_TRANSFER)
  const canProcess = hasPermission(user?.role, PERMISSIONS.PROCESS_TRANSFER)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 0,
    fromLocation: '',
    toLocation: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const product = products.find(p => p.id === formData.productId)
    
    addTransfer({
      ...formData,
      productName: product?.name || '',
      quantity: parseInt(formData.quantity),
      status: 'draft',
      date: new Date().toISOString()
    })
    
    closeModal()
  }

  const openModal = () => {
    setFormData({
      productId: '',
      quantity: 0,
      fromLocation: warehouses.length > 0 ? warehouses[0].name : '',
      toLocation: warehouses.length > 1 ? warehouses[1].name : ''
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleStatusUpdate = (id, status) => {
    updateTransfer(id, { status })
    const statusMessages = {
      waiting: 'Transfer started',
      ready: 'Transfer ready for completion',
      done: 'Transfer completed! Stock moved between warehouses.',
      canceled: 'Transfer canceled'
    }
    setSuccessMessage(statusMessages[status] || 'Status updated')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  // Separate pending and completed transfers
  const pendingTransfers = transfers.filter(t => t.status !== 'done' && t.status !== 'canceled')
  const completedTransfers = transfers.filter(t => t.status === 'done' || t.status === 'canceled')

  return (
    <Layout>
      <div className="p-8">
        {successMessage && (
          <div className="mb-4 p-4 bg-emerald-950/30 border border-emerald-800 text-emerald-300 rounded-lg flex items-center gap-2 animate-pulse">
            <Check className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role === 'staff' ? 'Internal Transfers' : 'Internal Transfers'}
            </h1>
            <p className="text-gray-500 mt-1">
              {user?.role === 'staff' 
                ? 'Process stock movements between warehouses' 
                : 'Create and manage stock movements between warehouses'}
            </p>
          </div>
          <PermissionGuard permission={PERMISSIONS.CREATE_TRANSFER}>
            <button onClick={openModal} className="btn btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Transfer
            </button>
          </PermissionGuard>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setShowCompleted(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !showCompleted ? 'bg-primary-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Pending ({pendingTransfers.length})
          </button>
          <button
            onClick={() => setShowCompleted(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showCompleted ? 'bg-primary-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Completed ({completedTransfers.length})
          </button>
        </div>

        {/* Workflow Info for Staff */}
        {user?.role === 'staff' && (
          <div className="mb-6 card bg-violet-950/20 border border-violet-800">
            <h3 className="font-semibold text-violet-300 mb-2 flex items-center gap-2">
              <Repeat className="w-5 h-5" />
              Transfer Workflow Guide
            </h3>
            <div className="flex items-center gap-4 text-sm text-slate-300 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="badge badge-draft">Draft</span>
                <span className="text-xs">Created by manager</span>
              </div>
              <span>→</span>
              <div className="flex items-center gap-2">
                <span className="badge badge-waiting">In Progress</span>
                <span className="text-xs">Moving items</span>
              </div>
              <span>→</span>
              <div className="flex items-center gap-2">
                <span className="badge badge-ready">Ready</span>
                <span className="text-xs">Items moved, ready to confirm</span>
              </div>
              <span>→</span>
              <div className="flex items-center gap-2">
                <span className="badge badge-done">Complete</span>
                <span className="text-xs font-semibold">Stock locations updated ✓</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              💡 <strong>Your role:</strong> Execute transfers by moving items between locations and confirm completion.
            </p>
          </div>
        )}

        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Transfer ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Quantity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">From → To</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(showCompleted ? completedTransfers : pendingTransfers).length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      {showCompleted ? 'No completed transfers' : 'No pending transfers'}
                    </td>
                  </tr>
                ) : (
                  (showCompleted ? completedTransfers : pendingTransfers).map((transfer) => (
                    <tr key={transfer.id} className="border-b border-slate-800 hover:bg-slate-800">
                      <td className="py-3 px-4 text-sm font-medium">{transfer.id}</td>
                      <td className="py-3 px-4 text-sm">{transfer.productName}</td>
                      <td className="py-3 px-4 text-sm font-semibold">{transfer.quantity}</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {transfer.fromLocation}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span className="px-2 py-1 bg-primary-100 rounded text-xs">
                            {transfer.toLocation}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDateTime(transfer.date)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${getStatusColor(transfer.status)}`}>
                          {transfer.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {user?.role === 'staff' && transfer.status !== 'done' && transfer.status !== 'canceled' && (
                          <div className="flex gap-2">
                            {transfer.status === 'draft' && (
                              <button
                                onClick={() => handleStatusUpdate(transfer.id, 'waiting')}
                                className="text-xs px-3 py-1 bg-amber-950/40 text-amber-300 rounded hover:bg-amber-900/60 border border-amber-800"
                              >
                                Start Transfer
                              </button>
                            )}
                            {transfer.status === 'waiting' && (
                              <button
                                onClick={() => handleStatusUpdate(transfer.id, 'ready')}
                                className="text-xs px-3 py-1 bg-cyan-950/40 text-cyan-300 rounded hover:bg-cyan-900/60 border border-cyan-800"
                              >
                                Mark Ready
                              </button>
                            )}
                            {transfer.status === 'ready' && (
                              <button
                                onClick={() => handleStatusUpdate(transfer.id, 'done')}
                                className="text-xs px-3 py-1 bg-emerald-950/40 text-emerald-300 rounded hover:bg-emerald-900/60 border border-emerald-800 flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                Complete
                              </button>
                            )}
                            <button
                              onClick={() => handleStatusUpdate(transfer.id, 'canceled')}
                              className="text-xs px-3 py-1 bg-rose-950/40 text-rose-300 rounded hover:bg-rose-900/60 border border-rose-800 flex items-center gap-1"
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

        {/* Info Card - Only for Manager */}
        {user?.role === 'manager' && (
          <div className="mt-6 card bg-violet-950/20 border border-violet-800">
            <h3 className="font-semibold text-violet-300 mb-2 flex items-center gap-2">
              <Repeat className="w-5 h-5" />
              How Internal Transfers Work
            </h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Move stock between warehouses or specific locations</li>
              <li>• Total stock quantity remains unchanged</li>
              <li>• Stock locations are updated when transfer is completed by staff</li>
              <li>• All movements are logged in the stock history</li>
            </ul>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Internal Transfer" size="md">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product *
              </label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="input"
                required
              >
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku}) - Stock: {p.stock}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="input"
                placeholder="Enter quantity"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Location *
              </label>
              <select
                value={formData.fromLocation}
                onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                className="input"
                required
              >
                <option value="">Select warehouse</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.name}>{warehouse.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Location *
              </label>
              <select
                value={formData.toLocation}
                onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                className="input"
                required
              >
                <option value="">Select warehouse</option>
                {warehouses.filter(warehouse => warehouse.name !== formData.fromLocation).map(warehouse => (
                  <option key={warehouse.id} value={warehouse.name}>{warehouse.name}</option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-cyan-950/30 rounded-lg border border-cyan-800">
              <p className="text-sm text-slate-300">
                <strong>Note:</strong> This transfer will move the selected quantity from{' '}
                <strong>{formData.fromLocation}</strong> to <strong>{formData.toLocation}</strong>.
                The total inventory will remain the same.
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={closeModal} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              Create Transfer
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}

export default Transfers
