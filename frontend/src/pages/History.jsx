import { useData } from '../context/DataContext'
import Layout from '../components/Layout'
import { formatDateTime } from '../utils/storage'
import { History as HistoryIcon, Download, Upload, Repeat, Settings, Package, Edit, Trash2 } from 'lucide-react'

const History = () => {
  const { history } = useData()

  const getActionIcon = (action, type) => {
    if (type === 'receipt') return Download
    if (type === 'delivery') return Upload
    if (type === 'transfer' || type === 'product' && action === 'move') return Repeat
    if (type === 'adjustment') return Settings
    if (action === 'create') return Package
    if (action === 'update') return Edit
    if (action === 'delete') return Trash2
    return HistoryIcon
  }

  const getActionColor = (action) => {
    if (action === 'create') return 'text-emerald-400 bg-emerald-950/40 border border-emerald-800'
    if (action === 'update') return 'text-cyan-400 bg-cyan-950/40 border border-cyan-800'
    if (action === 'delete') return 'text-rose-400 bg-rose-950/40 border border-rose-800'
    if (action === 'move') return 'text-violet-400 bg-violet-950/40 border border-violet-800'
    return 'text-slate-400 bg-slate-800 border border-slate-700'
  }

  const getActionLabel = (action) => {
    if (action === 'create') return 'Created'
    if (action === 'update') return 'Updated'
    if (action === 'delete') return 'Deleted'
    if (action === 'move') return 'Moved'
    return action
  }

  const renderDataSummary = (entry) => {
    const { data, type, action } = entry

    if (type === 'receipt' && action === 'create') {
      return `Receipt for ${data.product || 'product'} (${data.quantity || 0} units)`
    }

    if (type === 'delivery' && action === 'update') {
      return `Delivery ${data.id} status changed to ${data.status}`
    }

    if (type === 'product' && action === 'move') {
      return `${data.quantity} units from ${data.fromLocation} to ${data.toLocation}`
    }

    if (type === 'adjustment') {
      return `${data.product || 'Product'} adjusted by ${data.difference || 0}`
    }

    if (action === 'create') {
      return `New ${type} created`
    }

    if (action === 'update') {
      return `${type} updated`
    }

    if (action === 'delete') {
      return `${type} deleted`
    }

    return JSON.stringify(data).substring(0, 50)
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">Move History</h1>
          <p className="text-slate-400 mt-1">Complete audit trail of all inventory operations</p>
        </div>

        <div className="card">
          {/* Timeline */}
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <HistoryIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400">No history entries yet</p>
                <p className="text-sm text-slate-500 mt-2">All operations will be logged here</p>
              </div>
            ) : (
              history.map((entry, index) => {
                const Icon = getActionIcon(entry.action, entry.type)
                const isLast = index === history.length - 1

                return (
                  <div key={entry.id} className="relative flex gap-4 pb-4">
                    {/* Timeline Line */}
                    {!isLast && (
                      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-700"></div>
                    )}

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getActionColor(entry.action)}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-4 hover:bg-slate-700 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-slate-900 border border-slate-700 mr-2 text-slate-300">
                            {getActionLabel(entry.action)}
                          </span>
                          <span className="text-sm font-medium text-slate-300 capitalize">
                            {entry.type}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {formatDateTime(entry.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-300">
                        {renderDataSummary(entry)}
                      </p>

                      {/* Data Details */}
                      {entry.data.id && (
                        <div className="mt-2 text-xs text-slate-500">
                          ID: {entry.data.id}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="card">
            <p className="text-sm text-slate-400 mb-1">Total Entries</p>
            <p className="text-2xl font-bold text-slate-100">{history.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-400 mb-1">Created</p>
            <p className="text-2xl font-bold text-emerald-400">
              {history.filter(h => h.action === 'create').length}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-400 mb-1">Updated</p>
            <p className="text-2xl font-bold text-cyan-400">
              {history.filter(h => h.action === 'update').length}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-400 mb-1">Moved</p>
            <p className="text-2xl font-bold text-violet-400">
              {history.filter(h => h.action === 'move').length}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default History
