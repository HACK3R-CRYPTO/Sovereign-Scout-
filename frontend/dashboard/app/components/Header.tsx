'use client'

import { useState } from 'react'

interface EthereumProvider {
  request: (args: { method: string }) => Promise<string[]>
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

export default function Header() {
  const [address, setAddress] = useState<string | null>(null)

  const handleConnect = async () => {
    // Check if window.ethereum is available (Metamask, etc.)
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts.length > 0) {
          const addr = accounts[0]
          setAddress(`${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`)
        }
      } catch {
        console.error('User rejected connection')
        // Fallback to mock for demo if rejection occurs
        setAddress('0x42...88f2')
      }
    } else {
      // Fallback to mock for demo
      setAddress(address ? null : '0x42...88f2')
    }
  }

  return (
    <header className="py-6 mb-8 border-b border-gray-800 backdrop-blur-md sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Sovereign Scout
          </h1>
          <p className="text-gray-400 text-sm mt-1 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            AI VC Agent • Monad Testnet
          </p>
        </div>
        
        <div className="flex space-x-4">
          <div className="px-4 py-2 bg-gray-800 rounded-full border border-gray-700 flex items-center space-x-2">
            <span className="text-sm text-gray-300">Phase:</span>
            <span className="text-sm font-semibold text-purple-400">Launchpad</span>
          </div>
          <button 
            onClick={handleConnect}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white text-sm font-semibold transition-all cursor-pointer border border-purple-500 shadow-lg shadow-purple-500/20 active:scale-95"
          >
            {address ? address : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </header>
  )
}