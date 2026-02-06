import axios from 'axios';
import logger from './logger';
import { Token } from './types';

interface NadFunToken {
    id: string;
    name: string;
    symbol: string;
    address: string;
    creator: string;
    createdAt: number;
    marketCap?: number;
    liquidity?: number;
    holders?: number;
}

class NadFunAPI {
    private client: any;
    private apiKey: string | undefined;
    private isConfigured: boolean = false;

    constructor(apiUrl: string, apiKey?: string) {
        this.apiKey = apiKey;
        this.client = axios.create({
            baseURL: apiUrl,
            timeout: 10000,
            headers: apiKey ? {
                'X-API-KEY': apiKey,
                'Content-Type': 'application/json'
            } : {
                'Content-Type': 'application/json'
            }
        });

        this.isConfigured = !!apiKey;
    }

    /**
     * Fetches the latest tokens from nad.fun
     */
    async getLatestTokens(limit: number = 10): Promise<Token[]> {
        try {
            if (!this.isConfigured) {
                logger.warn('Nad.fun API not configured, using mock data');
                return this.getMockTokens();
            }

            const response = await this.client.get('/v1/tokens/latest', {
                params: { limit }
            });

            return this.transformTokens(response.data);
        } catch (error) {
            logger.error('Failed to fetch latest tokens from nad.fun', { error });
            return this.getMockTokens();
        }
    }

    /**
     * Gets detailed information about a specific token
     */
    async getTokenDetails(address: string): Promise<Token | null> {
        try {
            if (!this.isConfigured) {
                logger.warn('Nad.fun API not configured');
                return null;
            }

            const response = await this.client.get(`/v1/tokens/${address}`);
            const tokens = this.transformTokens([response.data]);
            return tokens[0] || null;
        } catch (error) {
            logger.error(`Failed to fetch token details for ${address}`, { error });
            return null;
        }
    }

    /**
     * Gets trending tokens on nad.fun
     */
    async getTrendingTokens(limit: number = 5): Promise<Token[]> {
        try {
            if (!this.isConfigured) {
                return this.getMockTokens();
            }

            const response = await this.client.get('/v1/tokens/trending', {
                params: { limit }
            });

            return this.transformTokens(response.data);
        } catch (error) {
            logger.error('Failed to fetch trending tokens', { error });
            return [];
        }
    }

    /**
     * Searches for tokens by name or symbol
     */
    async searchTokens(query: string): Promise<Token[]> {
        try {
            if (!this.isConfigured) {
                logger.warn('Nad.fun API not configured');
                return [];
            }

            const response = await this.client.get('/v1/tokens/search', {
                params: { q: query }
            });

            return this.transformTokens(response.data);
        } catch (error) {
            logger.error(`Failed to search tokens for query: ${query}`, { error });
            return [];
        }
    }

    /**
     * Transforms nad.fun API response to our Token interface
     */
    private transformTokens(data: NadFunToken[]): Token[] {
        return data.map(token => ({
            name: token.name,
            symbol: token.symbol,
            address: token.address,
            launchTime: token.createdAt,
            creator: token.creator,
            marketCap: token.marketCap,
            liquidity: token.liquidity
        }));
    }

    /**
     * Returns mock token data for development/testing
     */
    private getMockTokens(): Token[] {
        const now = Date.now();
        return [
            {
                name: 'ClawBot Agent',
                symbol: 'CLAW',
                address: '0x1234567890abcdef1234567890abcdef12345678',
                launchTime: now - 3600000,
                creator: '0xabcdef1234567890abcdef1234567890abcdef12',
                liquidity: 50000,
                marketCap: 150000
            },
            {
                name: 'MoltMind AI',
                symbol: 'MIND',
                address: '0xabcdef1234567890abcdef1234567890abcdef12',
                launchTime: now - 7200000,
                creator: '0x1234567890abcdef1234567890abcdef12345678',
                liquidity: 30000,
                marketCap: 80000
            }
        ];
    }

    isApiConfigured(): boolean {
        return this.isConfigured;
    }
}

export default NadFunAPI;
