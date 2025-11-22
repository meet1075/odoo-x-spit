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
          <h1 className="text-3xl font-bold text-slate-100">My Tasks</h1>
          <p className="text-slate-400 mt-1">Welcome back, {user?.name}! Here are your pending tasks.</p>
        </div>

        {/* Task Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-slate-800 border-slate-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 mb-1">Total Tasks</p>
                <p className="text-4xl font-bold">{totalTasks}</p>
              </div>
              <ClipboardList className="w-12 h-12 text-slate-400" />
            </div>
          </div>

          <div className="card bg-emerald-950/40 border-emerald-800 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 mb-1">Receive Goods</p>
                <p className="text-4xl font-bold">{myReceipts.length}</p>
              </div>
              <Download className="w-12 h-12 text-emerald-400" />
            </div>
          </div>

          <div className="card bg-amber-950/40 border-amber-800 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-300 mb-1">Pick & Pack</p>
                <p className="text-4xl font-bold">{myDeliveries.length}</p>
              </div>
              <Upload className="w-12 h-12 text-amber-400" />
            </div>
          </div>

          <div className="card bg-violet-950/40 border-violet-800 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-300 mb-1">Transfers</p>
                <p className="text-4xl font-bold">{myTransfers.length}</p>
              </div>
              <Repeat className="w-12 h-12 text-violet-400" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/receipts')}
              className="p-6 bg-emerald-950/30 hover:bg-emerald-900/50 rounded-lg transition-colors text-center border border-emerald-800"
            >
              <Download className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-medium text-slate-100">Receive Goods</p>
              <p className="text-xs text-slate-400 mt-1">{myReceipts.length} pending</p>
            </button>

            <button
              onClick={() => navigate('/deliveries')}
              className="p-6 bg-amber-950/30 hover:bg-amber-900/50 rounded-lg transition-colors text-center border border-amber-800"
            >
              <Upload className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="font-medium text-slate-100">Pick & Pack</p>
              <p className="text-xs text-slate-400 mt-1">{myDeliveries.length} pending</p>
            </button>

            <button
              onClick={() => navigate('/transfers')}
              className="p-6 bg-violet-950/30 hover:bg-violet-900/50 rounded-lg transition-colors text-center border border-violet-800"
            >
              <Repeat className="w-8 h-8 text-violet-400 mx-auto mb-2" />
              <p className="font-medium text-slate-100">Transfer Items</p>
              <p className="text-xs text-slate-400 mt-1">{myTransfers.length} pending</p>
            </button>

            <button
              onClick={() => navigate('/adjustments')}
              className="p-6 bg-cyan-950/30 hover:bg-cyan-900/50 rounded-lg transition-colors text-center border border-cyan-800"
            >
              <Package className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="font-medium text-slate-100">Stock Count</p>
              <p className="text-xs text-slate-400 mt-1">Submit counts</p>
            </button>
          </div>
        </div>

        {/* Pending Tasks Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Receipts */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-100">
                <Download className="w-5 h-5 text-emerald-400" />
                Pending Receipts
              </h3>
              <span className="badge badge-waiting">{myReceipts.length}</span>
            </div>
            <div className="space-y-3">
              {myReceipts.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                  <p>No pending receipts</p>
                </div>
              ) : (
                myReceipts.slice(0, 5).map((receipt) => (
                  <div
                    key={receipt.id}
                    className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-100">{receipt.id}</span>
                      <span className={`badge ${getStatusColor(receipt.status)}`}>
                        {receipt.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{receipt.supplier}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(receipt.date)}
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-700">
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
              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-100">
                <Upload className="w-5 h-5 text-amber-400" />
                Pending Deliveries
              </h3>
              <span className="badge badge-waiting">{myDeliveries.length}</span>
            </div>
            <div className="space-y-3">
              {myDeliveries.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                  <p>No pending deliveries</p>
                </div>
              ) : (
                myDeliveries.slice(0, 5).map((delivery) => (
                  <div
                    key={delivery.id}
                    className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-100">{delivery.id}</span>
                      <span className={`badge ${getStatusColor(delivery.status)}`}>
                        {delivery.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{delivery.customer}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(delivery.date)}
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-700">
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
        <div className="card mt-8 bg-slate-800 border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-1">Today's Performance</h3>
              <p className="text-slate-300">You've completed {completedToday} tasks today. Great work!</p>
            </div>
            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default StaffDashboard
