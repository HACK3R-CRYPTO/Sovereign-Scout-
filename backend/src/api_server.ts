import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import logger from './logger';
import portfolioManager from './portfolio_manager';
import { moltbookClient } from './moltbook_client';
import { moltbookAuth } from './moltbook_auth';

const app = express();
const PORT = process.env.API_PORT || 3001;

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
        const portfolioPath = path.join(__dirname, '..', 'portfolio.json');
        if (fs.existsSync(portfolioPath)) {
            const portfolio = JSON.parse(fs.readFileSync(portfolioPath, 'utf8'));
            
            // Calculate invested amount for available balance
            const invested = Object.values(portfolio.holdings || {}).reduce(
                (sum: number, h: any) => sum + (h.amount * h.avgPrice), 
                0
            ) as number;

            res.json({
                success: true,
                data: {
                    holdings: portfolio.holdings || {},
                    totalValue: portfolio.totalBalance || 1000,
                    availableBalance: ((portfolio.totalBalance || 1000) as number) - invested,
                    totalPnL: 0 // Could calculate if we store start balance
                }
            });
        } else {
            res.json({
                success: true,
                data: {
                    holdings: {},
                    totalValue: 1000,
                    availableBalance: 1000,
                    totalPnL: 0
                }
            });
        }
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
        // Get recent trades from portfolio manager
        const recentTrades = portfolioManager.getRecentTrades(10).map(trade => ({
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

        res.json({
            success: true,
            data: {
                isRunning: true,
                mode: 'live',
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
app.get('/api/social', (req, res) => {
    try {
        // Read trades and format as Twitter-style posts
        const tradesPath = path.join(__dirname, '..', 'trades.json');
        const posts: any[] = [];

        if (fs.existsSync(tradesPath)) {
            const trades = JSON.parse(fs.readFileSync(tradesPath, 'utf8'));
            
            // Convert recent trades to Twitter-style posts
            trades.slice(-10).reverse().forEach((trade: Trade) => {
                const action = trade.action === 'BUY' ? '🚨 BUY' : '💰 SELL';
                const emoji = trade.action === 'BUY' ? '📈' : '📉';
                
                posts.push({
                    id: `trade-${trade.timestamp}`,
                    timestamp: new Date(trade.timestamp).toISOString(),
                    text: `${action} ${emoji}\n\n$${trade.symbol} (${trade.symbol})\n\nAmount: ${trade.amount.toFixed(2)} tokens\nPrice: ${trade.price.toFixed(8)} MON\n\n#Monad #Moltiverse #SovereignScout $${trade.symbol}`,
                    type: trade.action.toLowerCase()
                });
            });
        }

        // Add system updates
        posts.push({
            id: 'system-1',
            timestamp: new Date().toISOString(),
            text: '🤖 Scout Agent is actively monitoring nad.fun for new token launches.\n\nThresholds: High 6.0+ | Moderate 4.5+\n\n#Monad #AutomatedTrading',
            type: 'info'
        });

        res.json({
            success: true,
            data: { posts: posts.slice(0, 20) } // Last 20 posts
        });
    } catch (error) {
        logger.error('Error fetching social feed', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    logger.info(`API server running on port ${PORT}`);
    console.log(`🌐 Dashboard API: http://localhost:${PORT}`);
});

export default app;