import chalk from 'chalk';
import { Token } from './types';
import logger from './logger';
import { nadFunClient, type TokenCreateEvent } from './nadfun_client';
import type { Address } from 'viem';

class TokenDiscovery {
    private seenTokens: Set<string>;
    private lastCheckTime: number = 0;
    private pollingInterval: number = 60000; // Check every 60 seconds

    constructor() {
        this.seenTokens = new Set<string>();
    }

    /**
     * Fetches new tokens from nad.fun using the Indexer API
     * Uses the /indexer/curve/create endpoint
     * @returns List of new token objects
     */
    async getNewTokens(): Promise<Token[]> {
        try {
            logger.info('Checking for new tokens on nad.fun using Indexer API...');

            // Fetch latest token creation events from the Indexer API
            const createEvents = await nadFunClient.getTokenCreationEvents(50, 0);

            if (createEvents && createEvents.length > 0) {
                logger.info(`Found ${createEvents.length} token creation events from API`);

                // Convert API events to our Token format and fetch real metadata
                const tokens: Token[] = await Promise.all(
                    createEvents.map(async (event: TokenCreateEvent) => {
                        // Use event data directly (metadata fetch can fail for brand new tokens)
                        // const metadata = await nadFunClient.getTokenMetadata(event.token);

                        const token = {
                            name: event.name || 'Unknown',
                            symbol: event.symbol || 'UNK',
                            address: event.token,
                            pool: event.pool, // Store pool address for trading
                            launchTime: parseInt(event.blockTimestamp) * 1000, // Convert to milliseconds
                            creator: event.creator,
                            liquidity: 0,
                            marketCap: 0
                        };

                        logger.info(`🔧 Token created: ${token.symbol}`, {
                            address: token.address,
                            pool: token.pool,
                            hasPool: !!token.pool
                        });

                        return token;
                    })
                );

                // Filter out tokens we've already seen
                const newTokens = tokens.filter(token => {
                    if (this.seenTokens.has(token.address)) {
                        logger.info(`Token ${token.symbol} (${token.address}) already seen. Skipping.`);
                        return false;
                    }
                    return true;
                });

                if (newTokens.length > 0) {
                    logger.success(`Discovered ${newTokens.length} NEW tokens!`);

                    // Add to seen set and log each discovery
                    newTokens.forEach(token => {
                        this.seenTokens.add(token.address);
                        logger.tokenDiscovered(token.symbol, token.address);
                    });

                    return newTokens;
                } else {
                    logger.info('No new tokens found (all tokens already seen)');
                    return [];
                }
            } else {
                logger.info('No token creation events found from API');
                return [];
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger.error('Error fetching tokens from NadFun Indexer API', { error: errorMessage });
            return [];
        }
    }

    /**
     * Enriches token data with additional metrics from on-chain data
     */
    async enrichTokenData(token: Token): Promise<Token> {
        try {
            // Skip enrichment for now (getCurveState can be slow and fail for brand new tokens)
            // const curveState = await nadFunClient.getCurveState(token.address as Address);

            // if (curveState) {
            //     const liquidityMON = Number(curveState.realMonReserve) / 1e18;
            //     const marketCapMON = liquidityMON * 2; // Approximate market cap

            //     return {
            //         ...token,
            //         liquidity: liquidityMON,
            //         marketCap: marketCapMON,
            //     };
            // }

            return token;
        } catch (error) {
            logger.warn(`Failed to enrich token ${token.symbol}`, { error });
            return token;
        }
    }
}

export default new TokenDiscovery();
