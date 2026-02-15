'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface FeedItem {
    id: string;
    type: 'buy' | 'sell' | 'info';
    text: string;
    timestamp: string;
}

interface ActivityFeedProps {
    items: FeedItem[];
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
    return (
        <div className="glass-panel p-6 rounded-2xl flex flex-col" style={{ height: 'calc(100vh - 12rem)' }}>
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="text-monad-blue" />
                    Live Agent Activity
                </h2>
                <div className="flex items-center gap-2">
                    <span className="animate-pulse w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-xs text-green-500 font-mono">ONLINE</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#7c3aed #1a1a2e'
            }}>
                <AnimatePresence initial={false}>
                    {items.length === 0 ? (
                        <div className="text-gray-500 text-center py-10 font-mono text-sm">
                            Waiting for network activity...
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className={`p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all ${item.type === 'buy' ? 'bg-green-500/10 border-green-500/20' :
                                    item.type === 'sell' ? 'bg-red-500/10 border-red-500/20' :
                                        'bg-monad-purple/5 border-monad-purple/10'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 p-2 rounded-lg flex-shrink-0 ${item.type === 'buy' ? 'bg-green-500/20 text-green-400' :
                                        item.type === 'sell' ? 'bg-red-500/20 text-red-400' :
                                            'bg-monad-purple/20 text-monad-purple'
                                        }`}>
                                        {item.type === 'buy' ? <TrendingUp size={14} /> :
                                            item.type === 'sell' ? <TrendingDown size={14} /> :
                                                <Terminal size={14} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-gray-300">
                                                {(item as any).agent || 'Sovereign Scout'}
                                                <span className="ml-2 px-1.5 py-0.5 rounded-md bg-white/5 text-[9px] text-gray-400 uppercase tracking-tighter">
                                                    m/{(item as any).submolt || 'crypto'}
                                                </span>
                                            </span>
                                            <span className="text-[10px] font-mono text-gray-500 flex-shrink-0 ml-2">
                                                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        {(item as any).title && (
                                            <h4 className="text-xs font-bold text-monad-blue mb-1 uppercase tracking-tight">
                                                {(item as any).title}
                                            </h4>
                                        )}
                                        <p className="text-sm text-gray-200 font-medium leading-snug break-words">
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
