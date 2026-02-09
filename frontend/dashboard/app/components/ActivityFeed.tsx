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
        <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="text-monad-blue" />
                    Live Agent Activity
                </h2>
                <div className="flex items-center gap-2">
                    <span className="animate-pulse w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-xs text-green-500 font-mono">ONLINE</span>
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
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
                                className={`p-3 rounded-xl border border-white/5 ${item.type === 'buy' ? 'bg-green-500/10 border-green-500/20' :
                                    item.type === 'sell' ? 'bg-red-500/10 border-red-500/20' :
                                        'bg-monad-purple/5 border-monad-purple/10'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 p-1.5 rounded-md ${item.type === 'buy' ? 'bg-green-500/20 text-green-400' :
                                        item.type === 'sell' ? 'bg-red-500/20 text-red-400' :
                                            'bg-monad-purple/20 text-monad-purple'
                                        }`}>
                                        {item.type === 'buy' ? <TrendingUp size={16} /> :
                                            item.type === 'sell' ? <TrendingDown size={16} /> :
                                                <Terminal size={16} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <span className={`text-xs font-mono mb-1 block opacity-70 ${item.type === 'buy' ? 'text-green-300' :
                                                item.type === 'sell' ? 'text-red-300' :
                                                    'text-monad-purple'
                                                }`}>
                                                {new Date(item.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-200 whitespace-pre-line font-medium leading-relaxed">
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
