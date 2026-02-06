import chalk from 'chalk';
import axios from 'axios';
import logger from './logger';

interface MoltbookAgent {
    id: string;
    name: string;
    description: string;
    karma: number;
    avatar_url: string;
    is_claimed: boolean;
    created_at: string;
    follower_count: number;
    stats: {
        posts: number;
        comments: number;
    };
    owner?: {
        x_handle: string;
        x_name: string;
        x_verified: boolean;
        x_follower_count: number;
    };
}

interface MoltbookPost {
    content: string;
    metadata?: {
        action?: string;
        token?: string;
        amount?: string;
        price?: string;
    };
}

class MoltbookClient {
    private apiKey: string;
    private apiUrl: string;
    private identityToken: string | null = null;
    private profile: MoltbookAgent | null = null;

    constructor() {
        this.apiKey = process.env.MOLTBOOK_API_KEY || '';
        this.apiUrl = process.env.MOLTBOOK_API_URL || 'https://api.moltbook.xyz';
        
        if (!this.apiKey || this.apiKey === 'your_moltbook_api_key') {
            logger.warn('Moltbook API key not configured. Social features disabled.');
            console.log(chalk.yellow('⚠️  Moltbook integration disabled - set MOLTBOOK_API_KEY in .env'));
        }
    }

    /**
     * Check if Moltbook is properly configured
     */
    isConfigured(): boolean {
        return !!this.apiKey && this.apiKey !== 'your_moltbook_api_key';
    }

    /**
     * Generate identity token for the agent
     */
    async generateIdentityToken(): Promise<string | null> {
        if (!this.isConfigured()) return null;

        try {
            const response = await axios.post(
                `${this.apiUrl}/api/v1/agents/me/identity-token`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            this.identityToken = (response.data as any).token;
            logger.info('Moltbook identity token generated');
            return this.identityToken;
        } catch (error: any) {
            logger.error('Failed to generate Moltbook identity token', error?.response?.data || error.message);
            return null;
        }
    }

    /**
     * Get the agent's profile from Moltbook
     */
    async getProfile(): Promise<MoltbookAgent | null> {
        if (!this.isConfigured()) return null;

        try {
            const response = await axios.get(
                `${this.apiUrl}/api/v1/agents/me`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            this.profile = (response.data as any).agent;
            logger.info(`Moltbook profile loaded: ${this.profile?.name} (${this.profile?.karma} karma)`);
            return this.profile;
        } catch (error: any) {
            logger.error('Failed to fetch Moltbook profile', error?.response?.data || error.message);
            return null;
        }
    }

    /**
     * Post an update to Moltbook
     */
    async post(content: string, metadata?: MoltbookPost['metadata']): Promise<boolean> {
        if (!this.isConfigured()) return false;

        try {
            await axios.post(
                `${this.apiUrl}/api/v1/posts`,
                {
                    content,
                    metadata
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            logger.info('Posted to Moltbook');
            console.log(chalk.blue(`📱 Moltbook: ${content}`));
            return true;
        } catch (error: any) {
            logger.error('Failed to post to Moltbook', error?.response?.data || error.message);
            return false;
        }
    }

    /**
     * Announce a trade on Moltbook
     */
    async announceTrade(
        action: 'BUY' | 'SELL',
        symbol: string,
        amount: number,
        confidence: number
    ): Promise<boolean> {
        if (!this.isConfigured()) return false;

        const emoji = action === 'BUY' ? '🚀' : '💰';
        const content = `${emoji} ${action} ${symbol}\n\nConfidence: ${(confidence * 100).toFixed(0)}%\nAmount: $${amount.toFixed(2)}\n\n#MonadAgent #DeFi #AITrading`;

        return await this.post(content, {
            action,
            token: symbol,
            amount: amount.toString()
        });
    }

    /**
     * Get cached profile or null
     */
    getCachedProfile(): MoltbookAgent | null {
        return this.profile;
    }

    /**
     * Initialize Moltbook client (generate token and load profile)
     */
    async initialize(): Promise<boolean> {
        if (!this.isConfigured()) {
            console.log(chalk.gray('Moltbook: Not configured, skipping...'));
            return false;
        }

        console.log(chalk.blue('🔗 Connecting to Moltbook...'));

        // Generate identity token
        const token = await this.generateIdentityToken();
        if (!token) {
            console.log(chalk.yellow('⚠️  Failed to generate Moltbook identity token'));
            return false;
        }

        // Load profile
        const profile = await this.getProfile();
        if (!profile) {
            console.log(chalk.yellow('⚠️  Failed to load Moltbook profile'));
            return false;
        }

        console.log(chalk.green('✅ Moltbook connected'));
        console.log(chalk.gray(`   Agent: ${profile.name}`));
        console.log(chalk.gray(`   Karma: ${profile.karma}`));
        console.log(chalk.gray(`   Followers: ${profile.follower_count}`));
        
        return true;
    }
}

export const moltbookClient = new MoltbookClient();
