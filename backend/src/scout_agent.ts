import dotenv from 'dotenv';
dotenv.config();

import chalk from 'chalk';
import config from './config';
import logger from './logger';
import tokenDiscovery from './token_discovery';
import sentimentAnalyzer from './sentiment_analyzer';
import investmentEvaluator from './investment_evaluator';
import tradeExecutor from './trade_executor';
import portfolioManager from './portfolio_manager';
import socialPoster from './social_poster';
import riskManager from './risk_manager';
import { moltbookClient } from './moltbook_client';
import { nadFunClient } from './nadfun_client';
import { Token } from './types';

// Global state
let isHealthy: boolean = true;
let lastHealthCheck: Date = new Date();

async function initializeServices(): Promise<boolean> {
    console.log(chalk.bold.green('🚀 Sovereign Scout Agent Starting...\n'));

    // Validate configuration
    const configValid = config.validate();
    if (!configValid) {
        logger.error('Configuration validation failed');
        return false;
    }

    config.displaySummary();

    // Initialize NadFun Client (pure viem implementation)
    const cfg = config.getConfig();

    try {
        if (cfg.monad.privateKey && cfg.monad.privateKey !== 'your_private_key_here') {
            logger.info('Initializing NadFun client with wallet...');
            await nadFunClient.initialize(cfg.monad.privateKey);
        } else {
            logger.warn('No private key configured - Running in READ-ONLY mode');
            await nadFunClient.initialize();
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Failed to initialize NadFun client', { error: errorMessage });
        logger.warn('Continuing in read-only mode...');
        await nadFunClient.initialize();
    }

    // Initialize Moltbook (optional - won't fail if not configured)
    await moltbookClient.initialize();

    logger.success('All services initialized successfully!\n');
    return true;
}

async function performHealthCheck(): Promise<void> {
    try {
        lastHealthCheck = new Date();

        // Check if NadFun client is working
        if (nadFunClient.publicClient) {
            // Test connection by getting latest block number
            await nadFunClient.publicClient.getBlockNumber();
            isHealthy = true;
        } else {
            isHealthy = true; // Still healthy even without client
            logger.info('Health check: Client not fully initialized');
        }
    } catch (error) {
        isHealthy = false;
        logger.error('Health check failed', { error });
    }
}

async function displayStatus(): Promise<void> {
    console.log(chalk.bold.cyan('\n📊 Agent Status Report'));
    console.log(chalk.gray('─────────────────────────'));
    console.log(chalk.white(`Health: ${isHealthy ? chalk.green('✓ Healthy') : chalk.red('✗ Unhealthy')}`));
    console.log(chalk.white(`Last Check: ${lastHealthCheck.toLocaleTimeString()}`));

    console.log(chalk.white(`Network: ${chalk.green('mainnet')}`));

    if (nadFunClient.account) {
        console.log(chalk.white(`Wallet: ${chalk.green('Connected')}`));
        console.log(chalk.white(`Address: ${chalk.gray(nadFunClient.account.address)}`));
    } else {
        console.log(chalk.white(`Mode: ${chalk.yellow('Read-Only')}`));
    }

    // Check portfolio health
    const totalValue = portfolioManager.getTotalValue();
    const startingValue = portfolioManager.getStartingBalance();
    const health = riskManager.checkPortfolioHealth(totalValue, startingValue);

    if (!health.isHealthy) {
        console.log(chalk.red(`⚠️  Drawdown: ${health.drawdown.toFixed(1)}%`));
    }

    portfolioManager.displaySummary();
}

async function monitorRisk(): Promise<void> {
    // Sync with real wallet balance
    await portfolioManager.syncWithWallet();

    const holdings = portfolioManager.getHoldings();
    logger.info(`💊 Checking ${Object.keys(holdings).length} positions for risk triggers...`);
    const positions = await riskManager.checkPositions(holdings);

    // Check for positions that need to be closed
    for (const position of positions) {
        if (position.shouldClose) {
            logger.warn(`⚠️  Position ${position.token.symbol} should close: ${position.reason}`);
            console.log(chalk.yellow(`⚠️  SELL TRIGGER: ${position.token.symbol} - ${position.reason}`));

            // Create a mock token for the trade
            const token: Token = {
                name: position.token.symbol,
                symbol: position.token.symbol,
                address: Object.keys(holdings).find(addr => holdings[addr].symbol === position.token.symbol) || '',
                launchTime: position.token.timestamp,
                creator: '0x0',
                pool: position.token.pool
            };

            const decision = {
                action: 'SELL' as const,
                confidence: 0.9,
                reason: position.reason || 'Risk management',
                riskLevel: 1
            };

            logger.info(`💸 Executing SELL for ${token.symbol}: ${position.reason}`);
            const result = await tradeExecutor.execute(decision, token, position.token.amount);
            if (result.success) {
                logger.tradeExecuted('SELL', token.symbol, result.amount);
                await portfolioManager.update(token, 'SELL', result.amount, result.price);
                await socialPoster.postUpdate(token, 'SELL', decision.reason);

                // Note: socialPoster already handles Moltbook posting
            }
        }
    }

    // Check if rebalancing is needed
    const totalValue = portfolioManager.getTotalValue();
    const needsRebalance = riskManager.checkRebalanceNeeded(holdings, totalValue);

    if (needsRebalance) {
        logger.warn('Portfolio rebalancing recommended');
    }
}

async function main(): Promise<void> {
    // Initialize all services
    const initialized = await initializeServices();
    if (!initialized) {
        logger.error('Failed to initialize services. Exiting...');
        process.exit(1);
    }

    console.log(chalk.bold.green('🔄 Starting main agent loop...\n'));
    logger.info('Agent loop started');

    let cycleCount = 0;

    // Main loop
    while (true) {
        try {
            cycleCount++;
            logger.info(`Starting cycle #${cycleCount}`);

            // Monitor existing positions for stop-loss/take-profit
            await monitorRisk();

            const newTokens = await tokenDiscovery.getNewTokens();

            for (const token of newTokens) {
                logger.tokenDiscovered(token.symbol, token.address);

                const sentimentScore = await sentimentAnalyzer.analyze(token);
                logger.sentimentAnalyzed(token.symbol, sentimentScore);

                const decision = await investmentEvaluator.evaluate(token, sentimentScore);

                if (decision.action !== 'HOLD') {
                    logger.info(`Investment decision: ${decision.action} ${token.symbol}`, { reason: decision.reason });

                    // Calculate position size based on confidence and available balance
                    const availableBalance = portfolioManager.getAvailableBalance();
                    let positionSize = 0;

                    if (decision.action === 'BUY') {
                        positionSize = portfolioManager.calculatePositionSize(decision.confidence);

                        // Check if we have enough balance
                        if (positionSize > availableBalance) {
                            logger.warn(`Insufficient balance for ${token.symbol}. Required: $${positionSize.toFixed(2)}, Available: $${availableBalance.toFixed(2)}`);
                            continue;
                        }

                        logger.info(`Position size: $${positionSize.toFixed(2)} (${(decision.confidence * 100).toFixed(0)}% confidence)`);
                    }

                    const result = await tradeExecutor.execute(decision, token, positionSize);
                    if (result.success) {
                        logger.tradeExecuted(decision.action, token.symbol, result.amount);
                        await portfolioManager.update(token, decision.action, result.amount, result.price);
                        await socialPoster.postUpdate(token, decision.action, decision.reason);

                        // Note: socialPoster already handles Moltbook posting
                    }
                }
            }

            // Perform health check every 10 cycles
            if (cycleCount % 10 === 0) {
                await performHealthCheck();
                await displayStatus();
            }

            logger.info(`Cycle #${cycleCount} completed. Waiting 30 seconds...`);

            // Wait for 30 seconds before next check
            await new Promise(resolve => setTimeout(resolve, 30000));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger.error('Error in main loop', { error: errorMessage });
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
}

if (require.main === module) {
    main().catch(error => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(chalk.red('Critical Failure:'), errorMessage);
        process.exit(1);
    });
}
