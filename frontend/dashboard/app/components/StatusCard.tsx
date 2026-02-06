interface Trade {
  timestamp: string
  action: string
  symbol: string
  time: number
}

interface AgentStatus {
  isRunning: boolean
  mode: string
  lastUpdate: string
  recentTrades: Trade[]
  cycleCount: number
}

interface StatusCardProps {
  status: AgentStatus | null
}

export default function StatusCard({ status }: StatusCardProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-blue-400 mb-4">Agent Status</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            status?.isRunning ? 'bg-green-400 animate-pulse' : 'bg-red-400'
          }`}></div>
          <span className="text-white font-semibold">
            {status?.isRunning ? 'Running' : 'Stopped'}
          </span>
        </div>
        
        <div>
          <p className="text-gray-400 text-sm">Mode</p>
          <p className="text-yellow-400 font-semibold capitalize">
            {status?.mode || 'Unknown'}
          </p>
        </div>
        
        <div>
          <p className="text-gray-400 text-sm">Last Update</p>
          <p className="text-white font-mono text-sm">
            {status?.lastUpdate ? 
              new Date(status.lastUpdate).toLocaleTimeString() : 
              'Never'
            }
          </p>
        </div>
        
        <div>
          <p className="text-gray-400 text-sm">Recent Trades</p>
          <p className="text-purple-400 font-semibold">
            {status?.recentTrades?.length || 0} trades
          </p>
        </div>
      </div>
    </div>
  )
}