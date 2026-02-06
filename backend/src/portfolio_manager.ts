import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { Token, Portfolio, PortfolioHolding } from './types';

interface TradeHistory {
    timestamp: number;
    action: 'BUY' | 'SELL';
    symbol: string;
    address: string;
    amount: number;
    price: number;
    txHash?: string;
    pool?: string;
}

class PortfolioManager {
    private portfolioFile: string;
    private tradesFile: string;
    private state: Portfolio;
    private trades: TradeHistory[] = [];
    private maxPositionSize: number = 0.15; // Max 15% per position
    private minPositionSize: number = 0.02; // Min 2% per position

    constructor() {
        this.portfolioFile = path.join(__dirname, '..', 'portfolio.json');
        this.tradesFile = path.join(__dirname, '..', 'trades.json');
        this.state = this._loadPortfolio();
        this.trades = this._loadTrades();
    }

    /**
     * Calculate position size based on confidence and portfolio balance
     * @param confidence Confidence score (0-1)
     * @returns Position size in AUSD
     */
    calculatePositionSize(confidence: number): number {
        // Kelly Criterion inspired: scale position by confidence
        // Position = Base * Confidence, capped by max/min
        const baseSize = this.state.totalBalance * 0.10; // 10% base position
        const scaledSize = baseSize * confidence;
        
        // Apply limits
        const maxSize = this.state.totalBalance * this.maxPositionSize;
        const minSize = this.state.totalBalance * this.minPositionSize;
        
        return Math.max(minSize, Math.min(maxSize, scaledSize));
    }

    /**
     * Get available balance for trading
     */
    getAvailableBalance(): number {
        const invested = Object.values(this.state.holdings).reduce(
            (sum, holding) => sum + (holding.amount * holding.avgPrice), 
            0
        );
        return Math.max(0, this.state.totalBalance - invested);
    }

    /**
     * Get total portfolio value
     */
    getTotalValue(): number {
        return this.state.totalBalance;
    }

    /**
     * Get all holdings for risk management
     */
    getHoldings(): { [address: string]: PortfolioHolding } {
        return { ...this.state.holdings };
    }

    /**
     * Get starting balance
     */
    getStartingBalance(): number {
        return 1000; // Initial balance
    }

    /**
     * Get recent trade history
     */
    getRecentTrades(limit: number = 20): TradeHistory[] {
        return this.trades.slice(-limit).reverse();
    }

    /**
     * Updates the portfolio based on trade action
     * @param token Token that was traded
     * @param action 'BUY' or 'SELL'
     * @param amount Actual amount of tokens
     * @param price Price per token in MON
     */
    async update(token: Token, action: 'BUY' | 'SELL', amount: number, price: number): Promise<void> {
        console.log(chalk.cyan(`📈 Updating portfolio for ${token.symbol}`));

        if (action === 'BUY') {
            if (!this.state.holdings[token.address]) {
                this.state.holdings[token.address] = {
                    symbol: token.symbol,
                    amount: amount,
                    avgPrice: price,
                    timestamp: Date.now(),
                    pool: token.pool // Save pool address for sells
                };
            } else {
                const existing = this.state.holdings[token.address];
                const totalCost = (existing.amount * existing.avgPrice) + (amount * price);
                existing.amount += amount;
                existing.avgPrice = totalCost / existing.amount;
                // Update pool if not set
                if (!existing.pool && token.pool) {
                    existing.pool = token.pool;
                }
            }
            console.log(chalk.gray(`Bought: ${amount.toFixed(2)} ${token.symbol} @ ${price.toFixed(6)} MON`));
        } else if (action === 'SELL') {
            if (this.state.holdings[token.address]) {
                delete this.state.holdings[token.address];
            }
        }

        // Record trade in history
        const trade: TradeHistory = {
            timestamp: Date.now(),
            action,
            symbol: token.symbol,
            address: token.address,
            amount,
            price,
            pool: token.pool
        };
        this.trades.push(trade);
        
        // Keep only last 100 trades
        if (this.trades.length > 100) {
            this.trades = this.trades.slice(-100);
        }

        this.state.updatedAt = Date.now();
        this._savePortfolio();
        this._saveTrades();
        this.displaySummary();
    }

    displaySummary(): void {
        console.log(chalk.bold.white('\n--- Current Portfolio ---'));
        console.log(chalk.gray(`Total Balance: $${this.state.totalBalance.toFixed(2)}`));
        console.log(chalk.gray(`Available: $${this.getAvailableBalance().toFixed(2)}`));
        console.log('');
        
        const tokens = Object.values(this.state.holdings);
        if (tokens.length === 0) {
            console.log(chalk.gray('No active holdings.'));
        } else {
            tokens.forEach((t: PortfolioHolding) => {
                const value = t.amount * t.avgPrice;
                console.log(`${chalk.green('•')} ${t.symbol}: ${t.amount.toFixed(2)} units ($${value.toFixed(2)})`);
            });
        }
        console.log(chalk.bold.white('-------------------------\n'));
    }

    private _loadPortfolio(): Portfolio {
        try {
            if (fs.existsSync(this.portfolioFile)) {
                const data = fs.readFileSync(this.portfolioFile, 'utf8');
                const parsed = JSON.parse(data);
                if (parsed.holdings) return parsed;
                return {
                    holdings: parsed,
                    totalBalance: 1000,
                    updatedAt: Date.now()
                };
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            console.error('Error loading portfolio:', errorMessage);
        }
        return {
            holdings: {},
            totalBalance: 1000,
            updatedAt: Date.now()
        };
    }

    private _savePortfolio(): void {
        try {
            fs.writeFileSync(this.portfolioFile, JSON.stringify(this.state, null, 2));
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            console.error('Error saving portfolio:', errorMessage);
        }
    }

    private _loadTrades(): TradeHistory[] {
        try {
            if (fs.existsSync(this.tradesFile)) {
                const data = fs.readFileSync(this.tradesFile, 'utf8');
                return JSON.parse(data);
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            console.error('Error loading trades:', errorMessage);
        }
        return [];
    }

    private _saveTrades(): void {
        try {
            fs.writeFileSync(this.tradesFile, JSON.stringify(this.trades, null, 2));
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            console.error('Error saving trades:', errorMessage);
        }
    }
}

export default new PortfolioManager();
