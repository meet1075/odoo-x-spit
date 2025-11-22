import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import PermissionGuard from '../components/PermissionGuard'
import { clearStorage, initializeDemoData, resetToFreshDemo } from '../utils/storage'
import { hasPermission } from '../utils/permissions'
import { PERMISSIONS } from '../utils/permissions'
import { Building2, User, Database, AlertTriangle, Plus, Edit2, Trash2, MapPin } from 'lucide-react'

const Settings = () => {
  const { warehouses, addWarehouse, updateWarehouse, deleteWarehouse, loadData } = useData()
  const { user } = useAuth()
  const canManageWarehouses = hasPermission(user?.role, PERMISSIONS.MANAGE_WAREHOUSES)
  const canManageSettings = hasPermission(user?.role, PERMISSIONS.MANAGE_SETTINGS)
  const canResetData = hasPermission(user?.role, PERMISSIONS.RESET_DATA)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showWarehouseModal, setShowWarehouseModal] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState(null)
  const [warehouseForm, setWarehouseForm] = useState({
    name: '',
    location: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    capacity: '',
    type: 'main',
    contact: '',
    phone: '',
    email: ''
  })

  const handleResetData = () => {
    if (showResetConfirm) {
      resetToFreshDemo()
      loadData()
      setShowResetConfirm(false)
      // Reload the page to ensure all components get fresh data
      window.location.reload()
    } else {
      setShowResetConfirm(true)
      setTimeout(() => setShowResetConfirm(false), 5000)
    }
  }

  const openWarehouseModal = (warehouse = null) => {
    if (warehouse) {
      setEditingWarehouse(warehouse)
      setWarehouseForm(warehouse)
    } else {
      setEditingWarehouse(null)
      setWarehouseForm({
        name: '',
        location: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        capacity: '',
        type: 'main',
        contact: '',
        phone: '',
        email: ''
      })
    }
    setShowWarehouseModal(true)
  }

  const closeWarehouseModal = () => {
    setShowWarehouseModal(false)
    setEditingWarehouse(null)
  }

  const handleWarehouseSubmit = (e) => {
    e.preventDefault()
    
    if (!warehouseForm.name || !warehouseForm.location || !warehouseForm.capacity) {
      alert('Please fill in all required fields')
      return
    }

    const warehouseData = {
      ...warehouseForm,
      capacity: parseInt(warehouseForm.capacity) || 0
    }

    if (editingWarehouse) {
      updateWarehouse(editingWarehouse.id, warehouseData)
    } else {
      addWarehouse(warehouseData)
    }
    
    closeWarehouseModal()
  }

  const handleDeleteWarehouse = (id) => {
    if (window.confirm('Are you sure you want to delete this warehouse? This action cannot be undone.')) {
      deleteWarehouse(id)
    }
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage warehouses and system preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My Profile</h3>
                <p className="text-sm text-gray-500">User information</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Name</label>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Email</label>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Role</label>
                <p className="font-medium capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Warehouses */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Warehouses</h3>
                  <p className="text-sm text-gray-500">Manage multiple warehouse locations</p>
                </div>
              </div>
              <PermissionGuard permission={PERMISSIONS.MANAGE_WAREHOUSES}>
                <button
                  onClick={() => openWarehouseModal()}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Warehouse
                </button>
              </PermissionGuard>
            </div>

            {warehouses.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">No warehouses yet</p>
                <p className="text-sm text-gray-500 mb-4">{canManageWarehouses ? 'Add your first warehouse location to get started' : 'No warehouses configured'}</p>
                <PermissionGuard permission={PERMISSIONS.MANAGE_WAREHOUSES}>
                  <button
                    onClick={() => openWarehouseModal()}
                    className="btn btn-primary inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Warehouse
                  </button>
                </PermissionGuard>
              </div>
            ) : (
              <div className="space-y-3">
                {warehouses.map((warehouse) => (
                  <div key={warehouse.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{warehouse.name}</h4>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">
                            {warehouse.type || 'main'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{warehouse.location}</span>
                          </div>
                          {warehouse.city && (
                            <div className="text-gray-600">
                              📍 {warehouse.city}{warehouse.state ? `, ${warehouse.state}` : ''}
                            </div>
                          )}
                          {warehouse.contact && (
                            <div className="text-gray-600">
                              👤 {warehouse.contact}
                            </div>
                          )}
                          {warehouse.phone && (
                            <div className="text-gray-600">
                              📞 {warehouse.phone}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <div className="text-right mr-4">
                          <p className="text-xs text-gray-500">Capacity</p>
                          <p className="font-semibold text-gray-900">{warehouse.capacity.toLocaleString()}</p>
                        </div>
                        <PermissionGuard permission={PERMISSIONS.MANAGE_WAREHOUSES}>
                          <button
                            onClick={() => openWarehouseModal(warehouse)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Warehouse"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </PermissionGuard>
                        <PermissionGuard permission={PERMISSIONS.MANAGE_WAREHOUSES}>
                          <button
                            onClick={() => handleDeleteWarehouse(warehouse.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Warehouse"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </PermissionGuard>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Data Management */}
          <PermissionGuard permission={PERMISSIONS.RESET_DATA}>
            <div className="lg:col-span-3 card bg-yellow-50 border border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Database className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900">Data Management</h3>
                <p className="text-sm text-yellow-700">Reset or backup your data</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-yellow-300">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Reset to Demo Data</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    This will delete all current data and restore the demo dataset. This action cannot be undone.
                  </p>
                  <button
                    onClick={handleResetData}
                    className={`btn ${showResetConfirm ? 'btn-danger' : 'btn-secondary'} text-sm`}
                  >
                    {showResetConfirm ? '⚠️ Click Again to Confirm' : 'Reset Data'}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-yellow-300">
                <h4 className="font-semibold text-gray-900 mb-2">System Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Storage:</span>
                    <span className="ml-2 font-medium">Browser LocalStorage</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Version:</span>
                    <span className="ml-2 font-medium">1.0.0</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Platform:</span>
                    <span className="ml-2 font-medium">React 18 + Vite</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Styling:</span>
                    <span className="ml-2 font-medium">Tailwind CSS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </PermissionGuard>

          {/* Feature Info */}
          <div className="lg:col-span-3 card bg-primary-50 border border-primary-200">
            <h3 className="font-semibold text-primary-900 mb-3">✨ StockMaster Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-primary-800">
              <div>
                <strong>✓ Product Management</strong>
                <p className="text-xs text-primary-700">Create, update, and track products</p>
              </div>
              <div>
                <strong>✓ Receipts (Incoming Stock)</strong>
                <p className="text-xs text-primary-700">Manage vendor deliveries</p>
              </div>
              <div>
                <strong>✓ Delivery Orders</strong>
                <p className="text-xs text-primary-700">Pick, pack, and ship to customers</p>
              </div>
              <div>
                <strong>✓ Internal Transfers</strong>
                <p className="text-xs text-primary-700">Move between locations</p>
              </div>
              <div>
                <strong>✓ Stock Adjustments</strong>
                <p className="text-xs text-primary-700">Fix discrepancies</p>
              </div>
              <div>
                <strong>✓ Move History</strong>
                <p className="text-xs text-primary-700">Complete audit trail</p>
              </div>
              <div>
                <strong>✓ Low Stock Alerts</strong>
                <p className="text-xs text-primary-700">Automated notifications</p>
              </div>
              <div>
                <strong>✓ Multi-Warehouse</strong>
                <p className="text-xs text-primary-700">Manage multiple locations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse Modal */}
      <Modal
        isOpen={showWarehouseModal}
        onClose={closeWarehouseModal}
        title={editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
        size="md"
      >
        <form onSubmit={handleWarehouseSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warehouse Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={warehouseForm.name}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                  className="input"
                  placeholder="e.g., Main Warehouse"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location/Building <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={warehouseForm.location}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, location: e.target.value })}
                  className="input"
                  placeholder="e.g., Building A"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity (units) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={warehouseForm.capacity}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, capacity: e.target.value })}
                  className="input"
                  placeholder="e.g., 10000"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Address Details</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={warehouseForm.address}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, address: e.target.value })}
                  className="input"
                  placeholder="e.g., 123 Industrial Blvd"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={warehouseForm.city}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, city: e.target.value })}
                    className="input"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={warehouseForm.state}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, state: e.target.value })}
                    className="input"
                    placeholder="State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={warehouseForm.zipCode}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, zipCode: e.target.value })}
                    className="input"
                    placeholder="ZIP"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={warehouseForm.country}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, country: e.target.value })}
                    className="input"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={warehouseForm.contact}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, contact: e.target.value })}
                  className="input"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={warehouseForm.phone}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, phone: e.target.value })}
                  className="input"
                  placeholder="e.g., +1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={warehouseForm.email}
                  onChange={(e) => setWarehouseForm({ ...warehouseForm, email: e.target.value })}
                  className="input"
                  placeholder="e.g., warehouse@company.com"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={closeWarehouseModal}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingWarehouse ? 'Update Warehouse' : 'Add Warehouse'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}

export default Settings
