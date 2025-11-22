import { useState } from 'react'
import { useData } from '../context/DataContext'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import { formatDateTime } from '../utils/storage'
import { Plus, AlertTriangle } from 'lucide-react'

const Adjustments = () => {
  const { adjustments, products, warehouses, addAdjustment } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    productId: '',
    warehouse: '',
    newQuantity: 0,
    reason: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const product = products.find(p => p.id === formData.productId)
    const warehouseEntry = product?.warehouses?.find(wh => wh.warehouseName === formData.warehouse)
    const currentStock = warehouseEntry?.stock || 0
    
    addAdjustment({
      ...formData,
      productName: product?.name || '',
      oldQuantity: currentStock,
      newQuantity: parseInt(formData.newQuantity),
      date: new Date().toISOString()
    })
    
    closeModal()
  }

  const openModal = () => {
    setFormData({
      productId: '',
      warehouse: warehouses.length > 0 ? warehouses[0].name : '',
      newQuantity: 0,
      reason: ''
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const selectedProduct = products.find(p => p.id === formData.productId)
  const selectedWarehouseEntry = selectedProduct?.warehouses?.find(wh => wh.warehouseName === formData.warehouse)
  const currentStock = selectedWarehouseEntry?.stock || 0
  const difference = selectedProduct ? formData.newQuantity - currentStock : 0

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stock Adjustments</h1>
            <p className="text-gray-500 mt-1">Correct inventory mismatches and physical count discrepancies</p>
          </div>
          <button onClick={openModal} className="btn btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Adjustment
          </button>
        </div>

        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Adjustment ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Warehouse</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Old Qty</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">New Qty</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Difference</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Reason</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {adjustments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-500">
                      No adjustments found. Create your first stock adjustment!
                    </td>
                  </tr>
                ) : (
                  adjustments.map((adjustment) => {
                    const diff = adjustment.newQuantity - adjustment.oldQuantity
                    return (
                      <tr key={adjustment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium">{adjustment.id}</td>
                        <td className="py-3 px-4 text-sm">{adjustment.productName}</td>
                        <td className="py-3 px-4 text-sm">{adjustment.warehouse}</td>
                        <td className="py-3 px-4 text-sm">{adjustment.oldQuantity}</td>
                        <td className="py-3 px-4 text-sm font-semibold">{adjustment.newQuantity}</td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {diff > 0 ? '+' : ''}{diff}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{adjustment.reason}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDateTime(adjustment.date)}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 card bg-yellow-50 border border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            When to Use Stock Adjustments
          </h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• <strong>Physical Count Discrepancies:</strong> When physical inventory doesn't match system records</li>
            <li>• <strong>Damaged Items:</strong> Record losses due to damage or expiration</li>
            <li>• <strong>Theft or Loss:</strong> Document missing inventory</li>
            <li>• <strong>Found Stock:</strong> Record unexpected inventory discoveries</li>
            <li>• <strong>System Corrections:</strong> Fix data entry errors</li>
          </ul>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Stock Adjustment" size="md">
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
                {products.map(p => {
                  const totalStock = p.warehouses?.reduce((sum, wh) => sum + wh.stock, 0) || 0
                  return (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) - Total Stock: {totalStock}
                    </option>
                  )
                })}
              </select>
            </div>

            {selectedProduct && formData.warehouse && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Current Stock in {formData.warehouse}:</strong> {currentStock} {selectedProduct.unitOfMeasure}
                </p>
              </div>
            )}

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
                <option value="">Select warehouse</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.name}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Counted Quantity *
              </label>
              <input
                type="number"
                value={formData.newQuantity}
                onChange={(e) => setFormData({ ...formData, newQuantity: parseInt(e.target.value) || 0 })}
                className="input"
                placeholder="Enter physical count"
                min="0"
                required
              />
            </div>

            {selectedProduct && formData.warehouse && formData.newQuantity !== currentStock && (
              <div className={`p-4 rounded-lg border ${
                difference > 0 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={`text-sm font-semibold ${
                  difference > 0 ? 'text-green-900' : 'text-red-900'
                }`}>
                  Difference: {difference > 0 ? '+' : ''}{difference} {selectedProduct.unitOfMeasure}
                </p>
                <p className={`text-xs mt-1 ${
                  difference > 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {difference > 0 
                    ? 'Stock will be increased in this warehouse' 
                    : 'Stock will be decreased in this warehouse'}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason *
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="input"
                rows="3"
                placeholder="Explain the reason for this adjustment (e.g., damaged items, physical count, etc.)"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={closeModal} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary flex-1"
              disabled={!formData.productId}
            >
              Create Adjustment
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}

export default Adjustments
