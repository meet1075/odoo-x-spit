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
    if (action === 'create') return 'text-green-600 bg-green-100'
    if (action === 'update') return 'text-blue-600 bg-blue-100'
    if (action === 'delete') return 'text-red-600 bg-red-100'
    if (action === 'move') return 'text-purple-600 bg-purple-100'
    return 'text-gray-600 bg-gray-100'
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
          <h1 className="text-3xl font-bold text-gray-900">Move History</h1>
          <p className="text-gray-500 mt-1">Complete audit trail of all inventory operations</p>
        </div>

        <div className="card">
          {/* Timeline */}
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <HistoryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No history entries yet</p>
                <p className="text-sm text-gray-400 mt-2">All operations will be logged here</p>
              </div>
            ) : (
              history.map((entry, index) => {
                const Icon = getActionIcon(entry.action, entry.type)
                const isLast = index === history.length - 1

                return (
                  <div key={entry.id} className="relative flex gap-4 pb-4">
                    {/* Timeline Line */}
                    {!isLast && (
                      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                    )}

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getActionColor(entry.action)}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-white border border-gray-200 mr-2">
                            {getActionLabel(entry.action)}
                          </span>
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {entry.type}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(entry.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        {renderDataSummary(entry)}
                      </p>

                      {/* Data Details */}
                      {entry.data.id && (
                        <div className="mt-2 text-xs text-gray-500">
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
            <p className="text-sm text-gray-600 mb-1">Total Entries</p>
            <p className="text-2xl font-bold text-gray-900">{history.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Created</p>
            <p className="text-2xl font-bold text-green-600">
              {history.filter(h => h.action === 'create').length}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Updated</p>
            <p className="text-2xl font-bold text-blue-600">
              {history.filter(h => h.action === 'update').length}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Moved</p>
            <p className="text-2xl font-bold text-purple-600">
              {history.filter(h => h.action === 'move').length}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default History
