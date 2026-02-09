'use client';

import { motion } from 'framer-motion';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-transparent"
        >
            {children}
        </motion.div>
    );
}
