interface Holding {
  symbol: string
  amount: number
  avgPrice: number
}

interface Portfolio {
  holdings: Record<string, Holding>
  totalValue: number
  availableBalance: number
  totalPnL: number
}

interface PortfolioCardProps {
  portfolio: Portfolio | null
}

export default function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const holdings = portfolio?.holdings || {}
  const holdingsArray = Object.values(holdings)

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 shadow-xl hover:shadow-2xl hover:border-green-500/50 transition-all duration-300">
      <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
        <span className="text-xl">💰</span>
        Portfolio Overview
      </h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Portfolio Value</p>
            <p className="text-white font-mono text-xl">{portfolio?.totalValue || 0} units</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Available</p>
            <p className="text-green-400 font-mono text-xl">{portfolio?.availableBalance?.toFixed(2) || 0} units</p>
          </div>
        </div>
        
        <div>
          <p className="text-gray-400 text-sm mb-2">Holdings ({holdingsArray.length})</p>
          {holdingsArray.length === 0 ? (
            <p className="text-gray-500 italic">No active positions</p>
          ) : (
            <div className="space-y-2">
              {holdingsArray.map((holding, index) => (
                <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-900/50 rounded">
                  <div>
                    <p className="text-white font-semibold">{holding.symbol}</p>
                    <p className="text-gray-400 text-sm">{holding.amount > 1000 ? (holding.amount/1e6).toFixed(2) + 'M' : holding.amount.toFixed(0)} tokens</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white">{(holding.amount * holding.avgPrice).toFixed(4)} MON</p>
                    <p className="text-gray-400 text-xs">@{holding.avgPrice.toFixed(8)} MON</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}