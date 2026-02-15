import chalk from 'chalk';
import axios from 'axios';
import logger from './logger';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

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
        postCooldown: 30 * 60 * 1000, // 30 minutes (Standard for active agents)
        commentCooldown: 65 * 1000 // 65 seconds
    };
    private gemini: GoogleGenerativeAI;
    private personaPrompt: string = "";
    private tenets: string = "";

    constructor() {
        this.apiKey = process.env.MOLTBOOK_API_KEY || '';
        this.apiUrl = process.env.MOLTBOOK_API_URL || 'https://www.moltbook.com/api/v1';

        if (!this.apiKey || this.apiKey === 'your_moltbook_api_key') {
            logger.warn('Moltbook API key not configured. Social features disabled.');
            console.log(chalk.yellow('⚠️  Moltbook integration disabled - set MOLTBOOK_API_KEY in .env'));
        }

        this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        this.loadPersona();
    }

    private loadPersona() {
        try {
            this.personaPrompt = fs.readFileSync(path.resolve(__dirname, '../persona/scout_prompt.md'), 'utf8');
            this.tenets = fs.readFileSync(path.resolve(__dirname, '../narrative/tenets.md'), 'utf8');
        } catch (e) {
            this.personaPrompt = "You are Sovereign_Scout, an elite autonomous AI Venture Capital Agent.";
            this.tenets = "Transparency is alpha.";
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
                    submolt: submolt || 'crypto',
                    title: title || 'Scout Update',
                    content
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

            // Handle verification challenge if present
            const responseData = response.data as any;
            if (responseData.verification_required && responseData.verification) {
                logger.info('Verification challenge received, solving...');
                const verified = await this.handleVerification(responseData);
                if (!verified) {
                    logger.warn('Verification failed, post may not be visible');
                    return false;
                }
            }

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
     * Get recent posts from Moltbook (optionally filtered by submolt)
     */
    async getRecentPosts(submolt?: string): Promise<any[]> {
        if (!this.isConfigured()) return [];

        try {
            const url = submolt
                ? `${this.apiUrl}/posts?submolt=${submolt}`
                : `${this.apiUrl}/posts`;

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data as any;
            return data.posts || [];
        } catch (error: any) {
            logger.error('Failed to fetch Moltbook posts', error?.response?.data || error.message);
            return [];
        }
    }

    /**
     * Generate social content using Gemini
     */
    async generateSocialUpdate(context: string): Promise<string | null> {
        if (!process.env.GEMINI_API_KEY) return null;

        const prompt = `${this.personaPrompt}\n\nTenets:\n${this.tenets}\n\n[CONTEXT]: ${context}\n[TASK]: Write a short, high-alpha social update. Be concise (under 280 chars). Stay in your elite scout persona.`;

        try {
            const model = this.gemini.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await model.generateContent(prompt);
            return result.response.text().trim();
        } catch (e: any) {
            logger.error('Gemini generation failed', e.message);
            return null;
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

        const context = `Just executed a ${action} for ${amount.toFixed(2)} ${symbol} at $${price.toFixed(6)}. Reasoning: ${reasoning || 'Market pattern recognized.'}`;

        let content = await this.generateSocialUpdate(context);

        // Fallback if AI fails
        if (!content) {
            const emoji = action === 'BUY' ? '🟢' : '💰';
            const actionText = action === 'BUY' ? 'Bought' : 'Sold';
            content = `${emoji} Just ${actionText.toLowerCase()} ${amount.toFixed(2)} ${symbol} at $${price.toFixed(6)}\n\n🔍 Live dashboard: https://sovereign-scout-production.up.railway.app/`;
        } else {
            content += `\n\n🔍 Live: https://sovereign-scout-production.up.railway.app/`;
        }

        return await this.post(content, {
            action,
            token: symbol,
            amount: amount.toString(),
            price: price.toString()
        }, `${action === 'BUY' ? '📈' : '📉'} ${action} ${symbol}`, 'crypto');
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

    /**
     * Handle Moltbook verification challenge
     */
    private async handleVerification(data: any): Promise<boolean> {
        if (!data.verification_required || !data.verification) {
            return true;
        }

        const vCode = data.verification.code || data.verification.verification_code;
        const challenge = data.verification.challenge;

        logger.info(`Solving verification challenge: "${challenge}"`);

        const answer = await this.solveChallenge(challenge);
        if (!answer) {
            logger.error('Failed to solve verification challenge');
            return false;
        }

        return await this.verifyContent(vCode, answer);
    }

    /**
     * Solve a verification challenge using Gemini
     */
    private async solveChallenge(challenge: string): Promise<string | null> {
        try {
            // Clean the challenge
            const cleaned = challenge.replace(/[^a-zA-Z0-9\s.,?!']/g, '').replace(/\s+/g, ' ').trim();
            logger.info(`Cleaned challenge: "${cleaned}"`);

            if (!process.env.GEMINI_API_KEY) {
                logger.warn('GEMINI_API_KEY not set, cannot solve challenges');
                return null;
            }

            const prompt = `Solve this math problem and return ONLY the numerical answer to 2 decimal places. No extra text.\n\nProblem: ${cleaned}`;

            const model = this.gemini.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await model.generateContent(prompt);
            const answer = result.response.text().trim();

            logger.info(`Gemini solved: ${cleaned} = ${answer}`);
            return answer;

        } catch (error: any) {
            logger.error('Error solving challenge:', error.message);
            return null;
        }
    }

    /**
     * Submit verification answer to Moltbook
     */
    private async verifyContent(verificationCode: string, answer: string): Promise<boolean> {
        try {
            const response = await axios.post(
                `${this.apiUrl}/verify`,
                {
                    verification_code: verificationCode,
                    answer
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const data = response.data as any;
            if (data.success) {
                logger.info('✅ Verification successful!');
                return true;
            } else {
                logger.error(`Verification failed: ${data.error}`);
                return false;
            }
        } catch (error: any) {
            logger.error('Verification network error:', error.message);
            return false;
        }
    }
}

export const moltbookClient = new MoltbookClient();
