import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import logger from './logger';
import config from './config';

// Reload config after dotenv load (imported modules cache process.env state)
config.reload();

import portfolioManager from './portfolio_manager';
import { privateKeyToAccount } from 'viem/accounts';
import { nadFunClient } from './nadfun_client';
import { moltbookClient } from './moltbook_client';
import { moltbookAuth } from './moltbook_auth';

const app = express();
const PORT = process.env.PORT || process.env.API_PORT || 3001;

// Middleware
app.use(cors()); // More permissive for debugging
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Portfolio endpoint
app.get('/api/portfolio', (req, res) => {
    try {
        portfolioManager.reload(); // Refresh data from disk
        const holdings = portfolioManager.getHoldings();
        const totalValue = portfolioManager.getTotalValue();
        const availableBalance = portfolioManager.getAvailableBalance();

        res.json({
            success: true,
            data: {
                holdings,
                totalValue,
                availableBalance,
                totalPnL: 0 // Could calculate if we store start balance
            }
        });
    } catch (error) {
        logger.error('Error fetching portfolio', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Trade interface for type safety
interface Trade {
    timestamp: string;
    action: string;
    symbol: string;
    time: number;
    amount: number;
    price: number;
}

// Agent status endpoint
app.get('/api/status', (req, res) => {
    try {
        portfolioManager.reload(); // Refresh data from disk
        const recentTrades = portfolioManager.getRecentTrades(5).map(trade => ({
            timestamp: new Date(trade.timestamp).toISOString(),
            action: trade.action,
            symbol: trade.symbol,
            time: trade.timestamp,
            amount: trade.amount,
            price: trade.price
        }));

        // Get recent log entries for activity feed
        const activityLog: string[] = [];
        const logsDir = path.join(__dirname, '..', 'logs');
        if (fs.existsSync(logsDir)) {
            const logFiles = fs.readdirSync(logsDir)
                .filter(f => f.startsWith('scout-'))
                .sort()
                .reverse();

            if (logFiles.length > 0) {
                const latestLog = path.join(logsDir, logFiles[0]);
                const logContent = fs.readFileSync(latestLog, 'utf-8');
                const lines = logContent.split('\n').filter(l => l.trim());
                activityLog.push(...lines.slice(-20)); // Last 20 log lines
            }
        }

        // Determine mode from config
        const privateKey = config.getConfig().monad.privateKey;
        const isLive = privateKey && privateKey !== 'your_private_key_here';
        let walletAddress = null;

        if (isLive) {
            try {
                const account = privateKeyToAccount(privateKey as `0x${string}`);
                walletAddress = account.address;
            } catch (e) {
                logger.error('Invalid private key in config', e);
            }
        }

        res.json({
            success: true,
            data: {
                isRunning: true,
                mode: isLive ? 'live' : 'read-only',
                wallet: walletAddress,
                lastUpdate: new Date().toISOString(),
                recentTrades,
                cycleCount: Math.floor(Date.now() / 30000),
                activityLog
            }
        });
    } catch (error) {
        logger.error('Error fetching status', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, status: 'healthy', timestamp: new Date().toISOString() });
});

// Authenticated Agent Profile (Sign-in with Moltbook)
app.get('/api/agent/me', moltbookAuth, (req, res) => {
    res.json({
        success: true,
        agent: req.agent
    });
});

// Moltbook profile endpoint
app.get('/api/moltbook/profile', (req, res) => {
    try {
        const profile = moltbookClient.getCachedProfile();
        if (profile) {
            res.json({ success: true, data: profile });
        } else {
            res.json({ success: false, message: 'Moltbook not configured or profile not loaded' });
        }
    } catch (error) {
        logger.error('Error fetching Moltbook profile', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Social feed endpoint (Twitter-style updates)
app.get('/api/social', async (req, res) => {
    try {
        const submolt = (req.query.submolt as string) || 'crypto';

        // 1. Try to fetch real posts from Moltbook
        const moltbookPosts = await moltbookClient.getRecentPosts(submolt);

        if (moltbookPosts && moltbookPosts.length > 0) {
            const formattedPosts = moltbookPosts.map((post: any) => ({
                id: post.id || Math.random().toString(36).substr(2, 9),
                timestamp: post.created_at || new Date().toISOString(),
                text: post.content,
                title: post.title,
                type: post.metadata?.action?.toLowerCase() || 'info',
                agent: post.agent?.name || 'Sovereign Scout',
                submolt: post.submolt?.name || submolt
            }));

            return res.json({
                success: true,
                data: { posts: formattedPosts.slice(0, 50) }
            });
        }

        // 2. Fallback to local trades if Moltbook is unavailable
        const tradesPath = path.join(__dirname, '..', 'trades.json');
        const posts: any[] = [];

        if (fs.existsSync(tradesPath)) {
            const trades = JSON.parse(fs.readFileSync(tradesPath, 'utf8'));
            trades.slice(-10).reverse().forEach((trade: Trade) => {
                posts.push({
                    id: `trade-${trade.timestamp}`,
                    timestamp: new Date(trade.timestamp).toISOString(),
                    text: `🚨 ${trade.action} update for $${trade.symbol}. Reasoning: Market pattern recognized in Monad liquidity pools.\n\n#SovereignScout #Monad`,
                    type: trade.action.toLowerCase()
                });
            });
        }

        return res.json({
            success: true,
            data: { posts: posts.slice(0, 20) }
        });
    } catch (error) {
        logger.error('Error fetching social feed', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Start server with initialization
const startServer = async () => {
    try {
        await nadFunClient.initialize(config.getConfig().monad.privateKey);

        const server = app.listen(PORT, () => {
            logger.info(`API server running on port ${PORT}`);
            console.log(`🌐 Dashboard API: http://localhost:${PORT}`);
        });

        server.on('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
                logger.error(`Port ${PORT} is already in use. Please kill the existing process or use a different port.`);
                console.error(`❌ Port ${PORT} is busy! Run: lsof -i :${PORT} | awk 'NR!=1 {print $2}' | xargs kill -9`);
            } else {
                logger.error('Server error', err);
            }
            process.exit(1);
        });

    } catch (error) {
        logger.error('Failed to start API server', error);
        process.exit(1);
    }
};

// Debug handlers for crash investigation
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    console.error('🔥 UNCAUGHT EXCEPTION:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', { promise, reason });
    console.error('🔥 UNHANDLED REJECTION:', reason);
});

process.on('exit', (code) => {
    if (code !== 0) {
        console.log(`⚠️ Process exited with code ${code}`);
    }
});

startServer();

export default app;