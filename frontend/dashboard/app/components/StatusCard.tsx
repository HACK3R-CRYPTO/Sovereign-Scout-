'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  delay?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export default function StatusCard({ title, value, subValue, icon: Icon, delay = 0, trend }: StatusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon size={64} className="text-monad-purple" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-monad-purple/10 text-monad-purple">
            <Icon size={20} />
          </div>
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        </div>

        <div className="mt-2">
          <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
          {subValue && (
            <div className={`text-sm mt-1 font-medium ${trend === 'up' ? 'text-green-400' :
                trend === 'down' ? 'text-red-400' : 'text-gray-500'
              }`}>
              {subValue}
            </div>
          )}
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-monad-purple/20 blur-[50px] rounded-full group-hover:bg-monad-purple/30 transition-all duration-500" />
    </motion.div>
  );
}