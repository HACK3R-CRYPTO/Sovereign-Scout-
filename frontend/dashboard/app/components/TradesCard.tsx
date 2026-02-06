interface Trade {
  timestamp: string
  action: string
  symbol: string
  time: number
  amount?: number
  price?: number
}

interface TradesCardProps {
  trades: Trade[]
}

export default function TradesCard({ trades }: TradesCardProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-purple-400 mb-4">Recent Trades History</h3>
      
      {trades.length === 0 ? (
        <p className="text-gray-500 italic">No trades executed yet</p>
      ) : (
        <div className="space-y-3">
          {trades.map((trade, index) => (
            <div key={index} className="flex justify-between items-center py-3 px-4 bg-gray-900/50 rounded border-l-4 border-l-purple-400">
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  trade.action === 'BUY' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {trade.action}
                </span>
                <div>
                  <p className="text-white font-semibold">{trade.symbol}</p>
                  {trade.amount && (
                    <p className="text-xs text-gray-500">
                      {trade.amount.toFixed(2)} units
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                {trade.price && (
                  <p className="text-green-400 font-mono text-sm font-semibold">
                    {trade.price.toFixed(8)} MON
                  </p>
                )}
                <p className="text-gray-400 text-xs">
                  {new Date(trade.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}