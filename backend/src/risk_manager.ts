import chalk from 'chalk';
import { Token, Portfolio, PortfolioHolding } from './types';
import logger from './logger';
import { nadFunClient } from './nadfun_client';

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

        // Get current price
        let currentPrice = await this.getCurrentPrice(address);
        const entryPrice = holding.avgPrice;

        // Safety check: If price is invalid (0, NaN, or fetch failed), assume price hasn't changed
        if (!currentPrice || currentPrice <= 0 || isNaN(currentPrice)) {
            logger.warn(`⚠️  Price fetch failed for ${holding.symbol} (value: ${currentPrice}). Assuming stable price to avoid panic sell.`);
            currentPrice = entryPrice;
        }

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
     * Get real token price from bonding curve
     */
    private async getCurrentPrice(address: string): Promise<number> {
        const price = await nadFunClient.getTokenPrice(address as `0x${string}`);
        // Fallback to entry price if fetch fails (to avoid false triggers)
        return price > 0 ? price : 0;
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
