'use client';

import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';
import Link from 'next/link';

export default function ComingSoon({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-monad-purple/10 p-6 rounded-full inline-block mb-6 border border-monad-purple/20 shadow-[0_0_30px_rgba(131,110,249,0.2)]">
                    <Construction size={64} className="text-monad-purple" />
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
                <p className="text-gray-400 mb-8 max-w-md">
                    This module is currently under active development.
                    Check back soon for advanced {title.toLowerCase()} features.
                </p>

                <Link
                    href="/"
                    className="px-6 py-3 rounded-xl bg-monad-purple text-white font-medium hover:bg-monad-purple/90 transition-colors shadow-lg shadow-monad-purple/20"
                >
                    Return to Dashboard
                </Link>
            </motion.div>
        </div>
    );
}
