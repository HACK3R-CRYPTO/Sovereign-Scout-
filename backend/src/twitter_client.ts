import { TwitterApi } from 'twitter-api-v2';
import logger from './logger';

/**
 * Twitter API Client for social sentiment and posting
 */
class TwitterClient {
    private client: TwitterApi | null = null;
    private isConfigured: boolean = false;

    constructor() {
        this.initialize();
    }

    private initialize(): void {
        const apiKey = process.env.TWITTER_API_KEY;
        const apiSecret = process.env.TWITTER_API_SECRET;
        const accessToken = process.env.TWITTER_ACCESS_TOKEN;
        const accessSecret = process.env.TWITTER_ACCESS_SECRET;

        if (apiKey && apiSecret && accessToken && accessSecret) {
            try {
                this.client = new TwitterApi({
                    appKey: apiKey,
                    appSecret: apiSecret,
                    accessToken: accessToken,
                    accessSecret: accessSecret,
                });
                this.isConfigured = true;
                logger.success('Twitter API client initialized');
            } catch (error) {
                logger.error('Failed to initialize Twitter client', error);
                this.isConfigured = false;
            }
        } else {
            logger.warn('Twitter API credentials not configured - social features disabled');
            this.isConfigured = false;
        }
    }

    /**
     * Search for tweets mentioning a token
     */
    async searchTweets(query: string, maxResults: number = 10): Promise<any[]> {
        if (!this.isConfigured || !this.client) {
            logger.debug('Twitter not configured, skipping search');
            return [];
        }

        try {
            const tweets = await this.client.v2.search(query, {
                max_results: maxResults,
                'tweet.fields': ['public_metrics', 'created_at', 'author_id'],
            });

            return tweets.data.data || [];
        } catch (error) {
            logger.error(`Twitter search failed for query: ${query}`, error);
            return [];
        }
    }

    /**
     * Post a tweet
     */
    async tweet(message: string): Promise<boolean> {
        if (!this.isConfigured || !this.client) {
            logger.debug('Twitter not configured, skipping tweet');
            return false;
        }

        try {
            const result = await this.client.v2.tweet(message);
            logger.success('Tweet posted successfully', { id: result.data.id });
            return true;
        } catch (error) {
            logger.error('Failed to post tweet', error);
            return false;
        }
    }

    /**
     * Get tweet metrics for sentiment analysis
     */
    async getTweetMetrics(query: string): Promise<{
        count: number;
        totalLikes: number;
        totalRetweets: number;
        avgEngagement: number;
    }> {
        const tweets = await this.searchTweets(query, 50);

        if (tweets.length === 0) {
            return { count: 0, totalLikes: 0, totalRetweets: 0, avgEngagement: 0 };
        }

        const totalLikes = tweets.reduce((sum, tweet) => sum + (tweet.public_metrics?.like_count || 0), 0);
        const totalRetweets = tweets.reduce((sum, tweet) => sum + (tweet.public_metrics?.retweet_count || 0), 0);
        const avgEngagement = tweets.length > 0 ? (totalLikes + totalRetweets) / tweets.length : 0;

        return {
            count: tweets.length,
            totalLikes,
            totalRetweets,
            avgEngagement,
        };
    }

    isAvailable(): boolean {
        return this.isConfigured;
    }
}

export default new TwitterClient();
