import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import { formatDateTime, getStatusColor } from '../utils/storage'
import { 
  ClipboardList,
  Download, 
  Upload, 
  Repeat,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react'

const StaffDashboard = () => {
  const { user } = useAuth()
  const { receipts, deliveries, transfers } = useData()
  const navigate = useNavigate()
  
  // Get tasks assigned to staff - all non-completed items (draft, waiting, ready)
  const myReceipts = receipts.filter(r => 
    r.status !== 'done' && r.status !== 'canceled'
  )
  
  const myDeliveries = deliveries.filter(d => 
    d.status !== 'done' && d.status !== 'canceled'
  )
  
  const myTransfers = transfers.filter(t => 
    t.status !== 'done' && t.status !== 'canceled'
  )

  const totalTasks = myReceipts.length + myDeliveries.length + myTransfers.length
  const completedToday = [...receipts, ...deliveries, ...transfers].filter(item => {
    const today = new Date().toDateString()
    return item.status === 'done' && new Date(item.createdAt).toDateString() === today
  }).length

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}! Here are your pending tasks.</p>
        </div>

        {/* Task Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-1">Total Tasks</p>
                <p className="text-4xl font-bold">{totalTasks}</p>
              </div>
              <ClipboardList className="w-12 h-12 text-blue-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 mb-1">Receive Goods</p>
                <p className="text-4xl font-bold">{myReceipts.length}</p>
              </div>
              <Download className="w-12 h-12 text-green-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 mb-1">Pick & Pack</p>
                <p className="text-4xl font-bold">{myDeliveries.length}</p>
              </div>
              <Upload className="w-12 h-12 text-orange-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 mb-1">Transfers</p>
                <p className="text-4xl font-bold">{myTransfers.length}</p>
              </div>
              <Repeat className="w-12 h-12 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/receipts')}
              className="p-6 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center"
            >
              <Download className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Receive Goods</p>
              <p className="text-xs text-gray-600 mt-1">{myReceipts.length} pending</p>
            </button>

            <button
              onClick={() => navigate('/deliveries')}
              className="p-6 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center"
            >
              <Upload className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Pick & Pack</p>
              <p className="text-xs text-gray-600 mt-1">{myDeliveries.length} pending</p>
            </button>

            <button
              onClick={() => navigate('/transfers')}
              className="p-6 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center"
            >
              <Repeat className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Transfer Items</p>
              <p className="text-xs text-gray-600 mt-1">{myTransfers.length} pending</p>
            </button>

            <button
              onClick={() => navigate('/adjustments')}
              className="p-6 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center"
            >
              <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium text-gray-900">Stock Count</p>
              <p className="text-xs text-gray-600 mt-1">Submit counts</p>
            </button>
          </div>
        </div>

        {/* Pending Tasks Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Receipts */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Download className="w-5 h-5 text-green-600" />
                Pending Receipts
              </h3>
              <span className="badge badge-waiting">{myReceipts.length}</span>
            </div>
            <div className="space-y-3">
              {myReceipts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <p>No pending receipts</p>
                </div>
              ) : (
                myReceipts.slice(0, 5).map((receipt) => (
                  <div
                    key={receipt.id}
                    className="p-4 bg-gray-50 hover:bg-green-50 rounded-lg transition-colors border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{receipt.id}</span>
                      <span className={`badge ${getStatusColor(receipt.status)}`}>
                        {receipt.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{receipt.supplier}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(receipt.date)}
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => navigate('/receipts')}
                        className="w-full btn btn-primary text-xs py-2"
                      >
                        Process Receipt
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Deliveries */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Upload className="w-5 h-5 text-orange-600" />
                Pending Deliveries
              </h3>
              <span className="badge badge-waiting">{myDeliveries.length}</span>
            </div>
            <div className="space-y-3">
              {myDeliveries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <p>No pending deliveries</p>
                </div>
              ) : (
                myDeliveries.slice(0, 5).map((delivery) => (
                  <div
                    key={delivery.id}
                    className="p-4 bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{delivery.id}</span>
                      <span className={`badge ${getStatusColor(delivery.status)}`}>
                        {delivery.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{delivery.customer}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(delivery.date)}
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => navigate('/deliveries')}
                        className="w-full btn btn-primary text-xs py-2"
                      >
                        Process Delivery
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="card mt-8 bg-gradient-to-r from-primary-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Today's Performance</h3>
              <p className="text-gray-600">You've completed {completedToday} tasks today. Great work!</p>
            </div>
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default StaffDashboard
