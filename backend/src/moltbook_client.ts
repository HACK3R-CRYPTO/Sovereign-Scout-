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
    title?: string;
    submolt?: string;
    metadata?: {
        action?: string;
        token?: string;
        amount?: string;
        price?: string;
    };
}

interface RateLimitInfo {
    lastPostTime: number;
    lastCommentTime: number;
    postCooldown: number; // milliseconds
    commentCooldown: number; // milliseconds
}

class MoltbookClient {
    private apiKey: string;
    private apiUrl: string;
    private identityToken: string | null = null;
    private profile: MoltbookAgent | null = null;
    private rateLimit: RateLimitInfo = {
        lastPostTime: 0,
        lastCommentTime: 0,
        postCooldown: 2 * 60 * 60 * 1000, // 2 hours for new agents
        commentCooldown: 60 * 1000 // 60 seconds
    };

    constructor() {
        this.apiKey = process.env.MOLTBOOK_API_KEY || '';
        this.apiUrl = process.env.MOLTBOOK_API_URL || 'https://www.moltbook.com/api/v1';

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
                `${this.apiUrl}/agents/me/identity-token`,
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
                `${this.apiUrl}/agents/me`,
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
     * Check if posting is allowed (respecting rate limit)
     */
    canPost(): boolean {
        const now = Date.now();
        const timeSinceLastPost = now - this.rateLimit.lastPostTime;
        return timeSinceLastPost >= this.rateLimit.postCooldown;
    }

    /**
     * Get time until next post is allowed (in minutes)
     */
    getMinutesUntilNextPost(): number {
        const now = Date.now();
        const timeSinceLastPost = now - this.rateLimit.lastPostTime;
        const timeRemaining = this.rateLimit.postCooldown - timeSinceLastPost;
        return Math.ceil(timeRemaining / 60000);
    }

    /**
     * Post an update to Moltbook
     */
    async post(content: string, metadata?: MoltbookPost['metadata'], title?: string, submolt?: string): Promise<boolean> {
        if (!this.isConfigured()) return false;

        // Check rate limit
        if (!this.canPost()) {
            const minutesRemaining = this.getMinutesUntilNextPost();
            logger.warn(`⏰ Post cooldown active. Can post again in ${minutesRemaining} minutes.`);
            console.log(chalk.yellow(`⏰ Moltbook post cooldown: ${minutesRemaining} minutes remaining`));
            return false;
        }

        try {
            const response = await axios.post(
                `${this.apiUrl}/posts`,
                {
                    content,
                    title: title || 'Scout Update',
                    submolt: submolt || 'general',
                    metadata
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Update rate limit on successful post
            this.rateLimit.lastPostTime = Date.now();

            logger.info('Posted to Moltbook');
            console.log(chalk.blue(`📱 Moltbook: ${title} - ${content.substring(0, 50)}...`));
            return true;
        } catch (error: any) {
            const errorData = error?.response?.data;
            logger.error('Failed to post to Moltbook', errorData || error.message);

            // If we hit rate limit, update our tracking
            if (errorData?.retry_after_minutes) {
                this.rateLimit.lastPostTime = Date.now() - (this.rateLimit.postCooldown - (errorData.retry_after_minutes * 60000));
                console.log(chalk.yellow(`⏰ Rate limited: retry in ${errorData.retry_after_minutes} minutes`));
            }

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
        price: number,
        reasoning?: string
    ): Promise<boolean> {
        if (!this.isConfigured()) return false;

        const emoji = action === 'BUY' ? '�' : '💰';
        const actionText = action === 'BUY' ? 'Bought' : 'Sold';

        let content = `${emoji} Just ${actionText.toLowerCase()} ${amount.toFixed(2)} ${symbol} at $${price.toFixed(6)}\n\n`;

        if (reasoning) {
            content += `📊 Analysis:\n${reasoning.substring(0, 200)}...\n\n`;
        }

        content += `🔍 Live dashboard: https://sovereign-scout-production.up.railway.app/\n\n`;
        content += `#MonadAgent #DeFi #MemecoinsOnMonad`;

        return await this.post(content, {
            action,
            token: symbol,
            amount: amount.toString(),
            price: price.toString()
        }, `${emoji} ${actionText} ${symbol}`, 'general');
    }

    /**
     * Get cached profile or null
     */
    getCachedProfile(): MoltbookAgent | null {
        return this.profile;
    }

    /**
     * Initialize Moltbook client (load profile if possible)
     */
    async initialize(): Promise<boolean> {
        if (!this.isConfigured()) {
            console.log(chalk.gray('Moltbook: Not configured, skipping...'));
            return false;
        }

        console.log(chalk.blue('🔗 Connecting to Moltbook...'));

        // Try to load profile (optional - posting works without it)
        const profile = await this.getProfile();
        if (profile) {
            console.log(chalk.green('✅ Moltbook connected'));
            console.log(chalk.gray(`   Agent: ${profile.name}`));
            console.log(chalk.gray(`   Karma: ${profile.karma}`));
            console.log(chalk.gray(`   Followers: ${profile.follower_count}`));
        } else {
            console.log(chalk.yellow('⚠️  Could not load profile, but posting will still work'));
        }

        return true;
    }
}

export const moltbookClient = new MoltbookClient();
