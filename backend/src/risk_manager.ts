import chalk from 'chalk';
import { Token, Portfolio, PortfolioHolding } from './types';
import logger from './logger';

interface RiskLimits {
    stopLossPercent: number; // -20% = sell
    takeProfitPercent: number; // +50% = sell
    maxPositionAge: number; // Max hours to hold
    maxDrawdown: number; // Max portfolio loss before halting
}

interface PositionStatus {
    token: PortfolioHolding;
    currentPrice: number;
    entryPrice: number;
    pnlPercent: number;
    ageHours: number;
    shouldClose: boolean;
    reason?: string;
}

class RiskManager {
    private limits: RiskLimits = {
        stopLossPercent: -20,
        takeProfitPercent: 50, // Back to normal (50% profit triggers sell)
        maxPositionAge: 72, // 3 days
        maxDrawdown: -30 // -30% total portfolio
    };

    /**
     * Check all positions for stop-loss and take-profit triggers
     */
    async checkPositions(holdings: { [address: string]: PortfolioHolding }): Promise<PositionStatus[]> {
        const statuses: PositionStatus[] = [];

        for (const [address, holding] of Object.entries(holdings)) {
            const status = await this.evaluatePosition(address, holding);
            statuses.push(status);

            if (status.shouldClose) {
                logger.warn(`Position ${holding.symbol} should be closed: ${status.reason}`);
            }
        }

        return statuses;
    }

    /**
     * Evaluate a single position
     */
    private async evaluatePosition(address: string, holding: PortfolioHolding): Promise<PositionStatus> {
        // Skip positions without pool address (restored legacy holdings)
        if (!holding.pool) {
            return {
                token: holding,
                currentPrice: holding.avgPrice,
                entryPrice: holding.avgPrice,
                pnlPercent: 0,
                ageHours: 0,
                shouldClose: false,
                reason: 'No pool address (legacy position)'
            };
        }

        // Get current price (mock for now, would use SDK in production)
        const currentPrice = await this.getCurrentPrice(address);
        const entryPrice = holding.avgPrice;
        const pnlPercent = ((currentPrice - entryPrice) / entryPrice) * 100;
        
        // Calculate position age
        const ageMs = Date.now() - holding.timestamp;
        const ageHours = ageMs / (1000 * 60 * 60);

        let shouldClose = false;
        let reason: string | undefined;

        // Check stop-loss
        if (pnlPercent <= this.limits.stopLossPercent) {
            shouldClose = true;
            reason = `Stop-loss triggered: ${pnlPercent.toFixed(1)}% loss`;
        }
        // Check take-profit
        else if (pnlPercent >= this.limits.takeProfitPercent) {
            shouldClose = true;
            reason = `Take-profit triggered: ${pnlPercent.toFixed(1)}% gain`;
        }
        // Check max age
        else if (ageHours >= this.limits.maxPositionAge) {
            shouldClose = true;
            reason = `Position too old: ${ageHours.toFixed(1)} hours`;
        }

        return {
            token: holding,
            currentPrice,
            entryPrice,
            pnlPercent,
            ageHours,
            shouldClose,
            reason
        };
    }

    /**
     * Mock price fetching (would use real SDK in production)
     */
    private async getCurrentPrice(address: string): Promise<number> {
        // Simulate price movement: random walk ±10%
        const randomChange = (Math.random() - 0.5) * 0.2; // -10% to +10%
        return 1.0 * (1 + randomChange);
    }

    /**
     * Check if portfolio rebalancing is needed
     */
    checkRebalanceNeeded(holdings: { [address: string]: PortfolioHolding }, totalValue: number): boolean {
        if (Object.keys(holdings).length === 0) return false;

        // Check if any position is over 20% of portfolio
        for (const holding of Object.values(holdings)) {
            const positionValue = holding.amount * holding.avgPrice;
            const positionPercent = (positionValue / totalValue) * 100;
            
            if (positionPercent > 20) {
                logger.warn(`Position ${holding.symbol} is ${positionPercent.toFixed(1)}% of portfolio (max 20%)`);
                return true;
            }
        }

        return false;
    }

    /**
     * Check overall portfolio health
     */
    checkPortfolioHealth(totalValue: number, startingValue: number): {
        isHealthy: boolean;
        drawdown: number;
        shouldHalt: boolean;
    } {
        const drawdown = ((totalValue - startingValue) / startingValue) * 100;
        const shouldHalt = drawdown <= this.limits.maxDrawdown;

        if (shouldHalt) {
            logger.error(`CRITICAL: Portfolio drawdown ${drawdown.toFixed(1)}% exceeds limit ${this.limits.maxDrawdown}%`);
        }

        return {
            isHealthy: drawdown > this.limits.maxDrawdown,
            drawdown,
            shouldHalt
        };
    }

    /**
     * Get risk limits
     */
    getLimits(): RiskLimits {
        return { ...this.limits };
    }

    /**
     * Update risk limits
     */
    setLimits(newLimits: Partial<RiskLimits>): void {
        this.limits = { ...this.limits, ...newLimits };
        logger.info('Risk limits updated', this.limits);
    }
}

export default new RiskManager();
