'use client';

import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';

interface Holding {
    symbol: string;
    amount: number;
    avgPrice: number;
    pool?: string;
}

interface HoldingsTableProps {
    holdings: { [key: string]: Holding };
    currentPrices?: { [key: string]: number }; // Optional for now
}

export default function HoldingsTable({ holdings }: HoldingsTableProps) {
    const holdingList = Object.values(holdings);

    return (
        <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Wallet className="text-monad-purple" />
                    Active Holdings
                </h2>
                <span className="bg-monad-dark px-3 py-1 rounded-full text-xs font-mono text-gray-400 border border-white/5">
                    {holdingList.length} ASSETS
                </span>
            </div>

            <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-white/5">
                            <th className="pb-3 pl-2 font-medium">Asset</th>
                            <th className="pb-3 font-medium text-right">Balance</th>
                            <th className="pb-3 font-medium text-right">Avg Entry</th>
                            <th className="pb-3 font-medium text-right">Value (Est)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {holdingList.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-gray-600 font-mono text-sm">
                                    No active positions
                                </td>
                            </tr>
                        ) : (
                            holdingList.map((holding) => (
                                <motion.tr
                                    key={holding.symbol}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="group hover:bg-white/5 transition-colors"
                                >
                                    <td className="py-4 pl-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-monad-purple to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-monad-purple/20">
                                                {holding.symbol.substring(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white group-hover:text-monad-blue transition-colors">
                                                    ${holding.symbol}
                                                </div>
                                                {holding.pool && (
                                                    <a
                                                        href={`https://testnet.monadexplorer.com/address/${holding.pool}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[10px] text-gray-500 hover:text-white flex items-center gap-1"
                                                    >
                                                        View Contract <ExternalLink size={8} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-right font-mono text-gray-300">
                                        {holding.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-4 text-right font-mono text-gray-400">
                                        {holding.avgPrice.toFixed(6)} MON
                                    </td>
                                    <td className="py-4 text-right font-mono text-white font-medium">
                                        {(holding.amount * holding.avgPrice).toFixed(4)} MON
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
