'use client';

import { useState, useEffect } from 'react';
import {
  Zap,
  Wallet,
  Activity,
  Settings,
  Search,
  Bell,
  Cpu,
  Globe,
  TrendingUp,
  ShieldCheck,
  Menu
} from 'lucide-react';

import StatusCard from './components/StatusCard';
import ActivityFeed from './components/ActivityFeed';
import HoldingsTable from './components/HoldingsTable';
import LayoutWrapper from './components/LayoutWrapper';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [socialFeed, setSocialFeed] = useState<any[]>([]);

  // Config
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchData = async () => {
    try {
      const [portfolioRes, statusRes, socialRes] = await Promise.all([
        fetch(`${API_URL}/api/portfolio`),
        fetch(`${API_URL}/api/status`),
        fetch(`${API_URL}/api/social`)
      ]);

      const portfolioData = await portfolioRes.json();
      const statusData = await statusRes.json();
      const socialData = await socialRes.json();

      if (portfolioData.success) setData(portfolioData.data);
      if (statusData.success) setStatus(statusData.data);
      if (socialData.success) setSocialFeed(socialData.data.posts);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // 5s refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <LayoutWrapper>
      <div className="h-screen overflow-hidden p-4 md:p-8 font-sans text-gray-100 flex gap-6">

        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:flex w-64 glass-panel flex-col rounded-2xl p-6 h-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-monad-purple p-2 rounded-xl shadow-[0_0_20px_rgba(131,110,249,0.5)]">
              <Zap className="text-white" fill="white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">Sovereign<span className="text-monad-purple">Scout</span></h1>
              <div className="text-xs text-green-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                SYSTEM ONLINE
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {[
              { name: 'Dashboard', path: '/' },
              { name: 'Agent Config', path: '/agent-config' },
              { name: 'Strategies', path: '/strategies' },
              { name: 'Analytics', path: '/analytics' },
              { name: 'Wallet', path: '/wallet' }
            ].map((item, i) => (
              <a
                key={item.name}
                href={item.path}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${i === 0
                  ? 'bg-monad-purple/10 text-monad-purple border border-monad-purple/20'
                  : 'hover:bg-white/5 text-gray-400 hover:text-white'
                  }`}
              >
                <span>{item.name}</span>
                {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-monad-purple" />}
              </a>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="bg-gradient-to-br from-monad-dark to-black p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-1.5 bg-monad-blue/20 rounded-lg text-monad-blue">
                  <Cpu size={16} />
                </div>
                <span className="text-xs font-semibold text-gray-300">AGENT STATUS</span>
              </div>
              <div className="space-y-2 text-xs font-mono text-gray-400">
                <div className="flex justify-between">
                  <span>Mode</span>
                  <span className="text-white">{status?.mode === 'live' ? 'LIVE TRADING' : 'READ-ONLY'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Utime</span>
                  <span className="text-white">{status?.cycleCount || 0} cycles</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6 h-full overflow-hidden">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel p-4 rounded-2xl shrink-0">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search tokens, pools, or contracts..."
                className="w-full bg-black/40 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-monad-purple/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5">
                <Globe size={14} className="text-monad-blue" />
                <span className="text-xs font-medium text-gray-300">Monad Mainnet</span>
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <button className="p-2 rounded-xl bg-black/40 border border-white/5 hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                <Bell size={20} />
              </button>
              <button className="p-2 rounded-xl bg-black/40 border border-white/5 hover:bg-white/5 text-gray-400 hover:text-white transition-colors lg:hidden">
                <Menu size={20} />
              </button>
              {status?.wallet && (
                <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-gray-400">Connected Wallet</div>
                    <div className="text-xs font-mono text-white">
                      {status.wallet.substring(0, 6)}...{status.wallet.substring(38)}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 shadow-lg" />
                </div>
              )}
            </div>
          </header>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
            <StatusCard
              title="Total Balance"
              value={data ? `${data.totalValue.toFixed(4)} MON` : '...'}

              icon={Wallet}
              delay={0.1}
              trend="up"
            />
            <StatusCard
              title="Active Positions"
              value={data ? Object.keys(data.holdings).length.toString() : '0'}
              subValue="2 Pending Entry"
              icon={Activity}
              delay={0.2}
              trend="neutral"
            />
            <StatusCard
              title="24h PnL"
              value="+12.4%"
              subValue="+0.008 MON"
              icon={TrendingUp}
              delay={0.3}
              trend="up"
            />
            <StatusCard
              title="Risk Shield"
              value="ACTIVE"
              subValue="Stop-loss at -15%"
              icon={ShieldCheck}
              delay={0.4}
              trend="neutral"
            />
          </div>

          {/* Dashboard Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
            {/* Left Column: Holdings */}
            <div className="lg:col-span-2 h-full">
              <HoldingsTable
                holdings={data?.holdings || {}}
              />
            </div>

            {/* Right Column: Feed */}
            <div className="h-full">
              <ActivityFeed items={socialFeed} />
            </div>
          </div>
        </main>
      </div>
    </LayoutWrapper>
  );
}
