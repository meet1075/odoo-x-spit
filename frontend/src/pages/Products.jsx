import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import PermissionGuard from '../components/PermissionGuard'
import { formatDate, getCategoryName, getStatusColor } from '../utils/storage'
import { hasPermission } from '../utils/permissions'
import { PERMISSIONS } from '../utils/permissions'
import { Plus, Edit, Trash2, Package, Search, AlertCircle, X } from 'lucide-react'

const Products = () => {
  const { user } = useAuth()
  const { products, warehouses, addProduct, updateProduct, deleteProduct } = useData()
  const canEdit = hasPermission(user?.role, PERMISSIONS.EDIT_PRODUCT)
  const canDelete = hasPermission(user?.role, PERMISSIONS.DELETE_PRODUCT)
  const canCreate = hasPermission(user?.role, PERMISSIONS.CREATE_PRODUCT)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'raw',
    unitOfMeasure: 'units',
    warehouses: []
  })
  const [selectedWarehouses, setSelectedWarehouses] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const productData = {
      ...formData,
      warehouses: selectedWarehouses
    }
    console.log('Submitting product data:', productData)
    
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
      } else {
        await addProduct(productData)
      }
      closeModal()
    } catch (error) {
      console.error('=== PRODUCT SUBMIT ERROR ===')
      console.error('Error object:', error)
      console.error('Error message:', error.message)
      console.error('Product data sent:', productData)
      console.error('===========================')
      alert(`Failed to save product: ${error.message}`)
    }
  }

  const openModal = (product = null) => {
    console.log('Available warehouses:', warehouses) // Debug log
    if (product) {
      setEditingProduct(product)
      setFormData(product)
      setSelectedWarehouses(product.warehouses || [])
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        sku: '',
        category: 'raw',
        unitOfMeasure: 'units',
        warehouses: []
      })
      setSelectedWarehouses([])
    }
    setIsModalOpen(true)
  }

  const addWarehouseToProduct = () => {
    if (warehouses.length > 0) {
      const availableWarehouse = warehouses.find(
        wh => !selectedWarehouses.some(sw => sw.warehouseName === wh.name)
      )
      if (availableWarehouse) {
        setSelectedWarehouses([...selectedWarehouses, {
          warehouseName: availableWarehouse.name,
          stock: 0,
          minStock: 10
        }])
      }
    }
  }

  const removeWarehouseFromProduct = (index) => {
    setSelectedWarehouses(selectedWarehouses.filter((_, i) => i !== index))
  }

  const updateWarehouseData = (index, field, value) => {
    const updated = [...selectedWarehouses]
    updated[index][field] = value
    setSelectedWarehouses(updated)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-500 mt-1">{canEdit ? 'Manage your inventory products' : 'View inventory products'}</p>
          </div>
          <PermissionGuard permission={PERMISSIONS.CREATE_PRODUCT}>
            <button onClick={() => openModal()} className="btn btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </PermissionGuard>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Categories</option>
              <option value="raw">Raw Materials</option>
              <option value="finished">Finished Goods</option>
              <option value="consumables">Consumables</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const totalStock = product.warehouses?.reduce((sum, wh) => sum + wh.stock, 0) || 0
            const hasLowStock = product.warehouses?.some(wh => wh.stock <= wh.minStock) || false
            return (
              <div key={product.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      hasLowStock ? 'bg-red-100' : 'bg-primary-100'
                    }`}>
                      <Package className={`w-6 h-6 ${hasLowStock ? 'text-red-600' : 'text-primary-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <PermissionGuard permission={PERMISSIONS.EDIT_PRODUCT}>
                      <button
                        onClick={() => openModal(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </PermissionGuard>
                    <PermissionGuard permission={PERMISSIONS.DELETE_PRODUCT}>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </PermissionGuard>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{getCategoryName(product.category)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Stock:</span>
                    <span className={`font-bold ${hasLowStock ? 'text-red-600' : 'text-green-600'}`}>
                      {totalStock} {product.unitOfMeasure}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600 block mb-1">Warehouses:</span>
                    <div className="space-y-1">
                      {product.warehouses?.map((wh, idx) => {
                        const isLow = wh.stock <= wh.minStock
                        return (
                          <div key={idx} className="flex justify-between text-xs pl-2">
                            <span className="text-gray-600">{wh.warehouseName}:</span>
                            <span className={`font-medium ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                              {wh.stock} / {wh.minStock} min
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {hasLowStock && (
                  <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-red-700 font-medium">Low Stock in Some Warehouses!</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="card text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU / Code *
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input"
                  required
                >
                  <option value="raw">Raw Materials</option>
                  <option value="finished">Finished Goods</option>
                  <option value="consumables">Consumables</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit of Measure *
                </label>
                <select
                  value={formData.unitOfMeasure}
                  onChange={(e) => setFormData({ ...formData, unitOfMeasure: e.target.value })}
                  className="input"
                  required
                >
                  <option value="units">Units</option>
                  <option value="kg">Kilograms</option>
                  <option value="pieces">Pieces</option>
                  <option value="boxes">Boxes</option>
                  <option value="sheets">Sheets</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warehouses *
              </label>
              <div className="space-y-3">
                {selectedWarehouses.map((wh, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <select
                        value={wh.warehouseName}
                        onChange={(e) => updateWarehouseData(index, 'warehouseName', e.target.value)}
                        className="input text-sm flex-1 mr-2"
                        required
                      >
                        <option value="">Select warehouse</option>
                        {warehouses && warehouses.length > 0 ? (
                          warehouses.map((warehouse) => (
                            <option 
                              key={warehouse.id} 
                              value={warehouse.name}
                              disabled={selectedWarehouses.some((sw, i) => i !== index && sw.warehouseName === warehouse.name)}
                            >
                              {warehouse.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>No warehouses available</option>
                        )}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeWarehouseFromProduct(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-600">Initial Stock</label>
                        <input
                          type="number"
                          value={wh.stock}
                          onChange={(e) => updateWarehouseData(index, 'stock', parseInt(e.target.value) || 0)}
                          className="input text-sm mt-1"
                          min="0"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Min Stock</label>
                        <input
                          type="number"
                          value={wh.minStock}
                          onChange={(e) => updateWarehouseData(index, 'minStock', parseInt(e.target.value) || 0)}
                          className="input text-sm mt-1"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {warehouses.length > 0 && selectedWarehouses.length < warehouses.length && (
                  <button
                    type="button"
                    onClick={addWarehouseToProduct}
                    className="btn btn-secondary text-sm w-full"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Warehouse
                  </button>
                )}
                {warehouses.length === 0 && (
                  <p className="text-sm text-red-500 italic">No warehouses available. Please add warehouses first.</p>
                )}
                {selectedWarehouses.length === 0 && warehouses.length > 0 && (
                  <p className="text-sm text-gray-500 italic">Add at least one warehouse</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={closeModal} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              {editingProduct ? 'Update' : 'Create'} Product
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}

export default Products
