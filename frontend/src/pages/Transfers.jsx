import { useState } from 'react'
import { useData } from '../context/DataContext'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import { formatDateTime, getStatusColor } from '../utils/storage'
import { Plus, Repeat, Check, X, ArrowRight } from 'lucide-react'

const Transfers = () => {
  const { transfers, products, addTransfer, updateTransfer } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 0,
    fromLocation: 'Main Warehouse',
    toLocation: 'Production Floor'
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
      fromLocation: 'Main Warehouse',
      toLocation: 'Production Floor'
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleStatusUpdate = (id, status) => {
    updateTransfer(id, { status })
  }

  const locations = ['Main Warehouse', 'Production Floor', 'Warehouse 2', 'Rack A', 'Rack B']

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Internal Transfers</h1>
            <p className="text-gray-500 mt-1">Move stock between warehouses and locations</p>
          </div>
          <button onClick={openModal} className="btn btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Transfer
          </button>
        </div>

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
                {transfers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No transfers found. Create your first internal transfer!
                    </td>
                  </tr>
                ) : (
                  transfers.map((transfer) => (
                    <tr key={transfer.id} className="border-b hover:bg-gray-50">
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
                        {transfer.status !== 'done' && transfer.status !== 'canceled' && (
                          <div className="flex gap-2">
                            {transfer.status === 'draft' && (
                              <button
                                onClick={() => handleStatusUpdate(transfer.id, 'waiting')}
                                className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                              >
                                Start
                              </button>
                            )}
                            {transfer.status === 'waiting' && (
                              <button
                                onClick={() => handleStatusUpdate(transfer.id, 'ready')}
                                className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                              >
                                Ready
                              </button>
                            )}
                            {transfer.status === 'ready' && (
                              <button
                                onClick={() => handleStatusUpdate(transfer.id, 'done')}
                                className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                Complete
                              </button>
                            )}
                            <button
                              onClick={() => handleStatusUpdate(transfer.id, 'canceled')}
                              className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
                            >
                              <X className="w-3 h-3" />
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 card bg-purple-50 border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
            <Repeat className="w-5 h-5" />
            How Internal Transfers Work
          </h3>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Move stock between warehouses, production floors, or specific locations</li>
            <li>• Total stock quantity remains unchanged</li>
            <li>• Location is updated when transfer is completed</li>
            <li>• All movements are logged in the stock ledger</li>
          </ul>
        </div>
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
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
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
                {locations.filter(loc => loc !== formData.fromLocation).map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
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
