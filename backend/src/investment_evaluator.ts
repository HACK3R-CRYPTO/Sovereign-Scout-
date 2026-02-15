import chalk from 'chalk';
import { Token, InvestmentDecision } from './types';
import logger from './logger';

interface ScoringFactors {
    sentiment: number;
    liquidity: number;
    marketCap: number;
    age: number;
    risk: number;
}

class InvestmentEvaluator {
    private minSentimentScore: number = 6.0;
    private maxInvestmentPerToken: number = 100;
    private minLiquidity: number = 5000; // Minimum liquidity in USD
    private maxMarketCap: number = 100000; // Max market cap for early entry

    /**
     * Evaluates whether to buy, sell, or hold a token
     * @param token Token to evaluate
     * @param sentimentScore Sentiment score from analyzer
     * @returns Investment decision with confidence and reason
     */
    async evaluate(token: Token, sentimentScore: number): Promise<InvestmentDecision> {
        console.log(chalk.yellow(`🤔 Evaluating investment for ${token.symbol}...`));

        // Calculate multi-factor score
        const factors = this.calculateFactors(token, sentimentScore);
        const finalScore = this.calculateFinalScore(factors);
        const riskLevel = this.assessRisk(token, factors);

        // Log detailed analysis
        logger.debug(`${token.symbol} Analysis:`, {
            sentiment: factors.sentiment,
            liquidity: factors.liquidity,
            marketCap: factors.marketCap,
            age: factors.age,
            risk: factors.risk,
            finalScore,
            riskLevel
        });

        // Decision logic with highly selective trading parameters
        if (finalScore >= 8.0 && riskLevel <= 6.0) {
            return {
                action: 'BUY',
                confidence: this.calculateConfidence(finalScore, riskLevel),
                reason: `Strong signal (score: ${finalScore.toFixed(1)}, risk: ${riskLevel.toFixed(1)})`
            };
        } else if (finalScore >= 7.5 && riskLevel <= 5.0) {
            return {
                action: 'BUY',
                confidence: this.calculateConfidence(finalScore, riskLevel),
                reason: `Moderate signal (score: ${finalScore.toFixed(1)}, risk: ${riskLevel.toFixed(1)})`
            };
        } else if (finalScore <= 3.0 || riskLevel > 10) {
            return {
                action: 'SELL',
                confidence: 0.8,
                reason: `High risk or negative signal (score: ${finalScore.toFixed(1)}, risk: ${riskLevel.toFixed(1)})`
            };
        }

        return {
            action: 'HOLD',
            confidence: 0.5,
            reason: `Neutral signal (score: ${finalScore.toFixed(1)}, risk: ${riskLevel.toFixed(1)})`
        };
    }

    /**
     * Calculate individual scoring factors
     */
    private calculateFactors(token: Token, sentimentScore: number): ScoringFactors {
        const factors: ScoringFactors = {
            sentiment: sentimentScore,
            liquidity: 5.0,
            marketCap: 5.0,
            age: 5.0,
            risk: 5.0
        };

        // Liquidity score (0-10)
        if (token.liquidity !== undefined) {
            if (token.liquidity >= 50000) {
                factors.liquidity = 9.0;
            } else if (token.liquidity >= 20000) {
                factors.liquidity = 7.5;
            } else if (token.liquidity >= 10000) {
                factors.liquidity = 6.0;
            } else if (token.liquidity >= 5000) {
                factors.liquidity = 4.0;
            } else {
                factors.liquidity = 2.0; // Low liquidity is risky
            }
        }

        // Market cap score (0-10) - lower is better for early entry
        if (token.marketCap !== undefined) {
            if (token.marketCap < 10000) {
                factors.marketCap = 9.0; // Micro cap, high potential
            } else if (token.marketCap < 50000) {
                factors.marketCap = 7.5;
            } else if (token.marketCap < 100000) {
                factors.marketCap = 6.0;
            } else if (token.marketCap < 500000) {
                factors.marketCap = 4.0;
            } else {
                factors.marketCap = 2.0; // Already established
            }
        }

        // Age score (0-10) - prefer fresh launches
        if (token.createdAt) {
            const ageInHours = (Date.now() - token.createdAt.getTime()) / (1000 * 60 * 60);
            if (ageInHours < 1) {
                factors.age = 9.0; // Brand new
            } else if (ageInHours < 6) {
                factors.age = 7.5;
            } else if (ageInHours < 24) {
                factors.age = 6.0;
            } else if (ageInHours < 72) {
                factors.age = 4.0;
            } else {
                factors.age = 2.0; // Old news
            }
        }

        return factors;
    }

    /**
     * Calculate final weighted score
     */
    private calculateFinalScore(factors: ScoringFactors): number {
        // Weighted average: sentiment is most important
        const weights = {
            sentiment: 0.4,
            liquidity: 0.25,
            marketCap: 0.20,
            age: 0.15
        };

        const score = (
            factors.sentiment * weights.sentiment +
            factors.liquidity * weights.liquidity +
            factors.marketCap * weights.marketCap +
            factors.age * weights.age
        );

        return parseFloat(score.toFixed(1));
    }

    /**
     * Assess risk level (0-10, higher = more risky)
     */
    private assessRisk(token: Token, factors: ScoringFactors): number {
        let risk = 5.0; // Base risk

        // Low liquidity increases risk
        if (factors.liquidity < 4.0) {
            risk += 2.0;
        }

        // Extremely low market cap increases risk (might be rug)
        if (token.marketCap !== undefined && token.marketCap < 5000) {
            risk += 1.5;
        }

        // Very new tokens have unknown risk
        if (factors.age > 8.0) {
            risk += 1.0;
        }

        // Low holder count is risky
        if (token.holderCount !== undefined && token.holderCount < 10) {
            risk += 2.0;
        }

        // Pattern matching for risky names
        const riskyPatterns = ['safe', 'moon', 'elon', 'doge', 'shib'];
        const lowerName = token.name.toLowerCase();
        const lowerSymbol = token.symbol.toLowerCase();

        if (riskyPatterns.some(pattern =>
            lowerName.includes(pattern) || lowerSymbol.includes(pattern)
        )) {
            risk += 1.0;
        }

        return Math.min(10, parseFloat(risk.toFixed(1)));
    }

    /**
     * Calculate confidence based on score and risk
     */
    private calculateConfidence(score: number, risk: number): number {
        // Higher score and lower risk = higher confidence
        const baseConfidence = score / 10;
        const riskPenalty = risk / 20;
        const confidence = Math.max(0.1, Math.min(0.95, baseConfidence - riskPenalty));

        return parseFloat(confidence.toFixed(2));
    }
}

export default new InvestmentEvaluator();
