'use client'

import { useState, useEffect } from 'react'
import PortfolioCard from './components/PortfolioCard'
import StatusCard from './components/StatusCard'
import TradesCard from './components/TradesCard'
import SocialCard from './components/SocialCard'
import Header from './components/Header'

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
  activityLog?: string[]
}

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [status, setStatus] = useState<AgentStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const [portfolioRes, statusRes] = await Promise.all([
        fetch(`${baseUrl}/api/portfolio`),
        fetch(`${baseUrl}/api/status`)
      ])

      const portfolioData = await portfolioRes.json()
      const statusData = await statusRes.json()

      if (portfolioData.success) setPortfolio(portfolioData.data)
      if (statusData.success) setStatus(statusData.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Status Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <div>
                <h2 className="text-2xl font-bold text-white">System Online</h2>
                <p className="text-purple-300">Monitoring nad.fun • Trading Active • Risk Management Enabled</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">${portfolio?.totalValue.toFixed(2) || '0.00'}</div>
              <div className="text-sm text-gray-400">Total Balance (MON)</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <StatusCard status={status} />
          <PortfolioCard portfolio={portfolio} />
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 shadow-xl hover:shadow-2xl hover:border-yellow-500/50 transition-all duration-300">
              <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                <span className="text-xl">📊</span>
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Cycles Run:</span>
                  <span className="text-white font-mono">{status?.cycleCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Mode:</span>
                  <span className="text-yellow-400 font-semibold">{status?.mode || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Balance:</span>
                  <span className="text-green-400 font-mono">${portfolio?.availableBalance || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TradesCard trades={status?.recentTrades || []} />

          {/* Social Feed */}
          <SocialCard />
        </div>
      </main>
    </div>
  )
}
