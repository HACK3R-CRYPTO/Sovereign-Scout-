import chalk from 'chalk';
import { Token } from './types';
import twitterClient from './twitter_client';
import logger from './logger';

class SocialPoster {
    constructor() {
        // Twitter client initialized in twitter_client.ts
    }

    /**
     * Posts an investment update to Moltbook
     * @param token Token that was traded
     * @param action 'BUY' or 'SELL'
     * @param reason Reason for the decision
     */
    async postUpdate(token: Token, action: 'BUY' | 'SELL', reason: string): Promise<boolean> {
        const message = `🚨 SCOUT UPDATE: Just executed a ${action} order for $${token.symbol} (${token.name}).\n\nReason: ${reason}\n\n#Monad #Moltiverse #SovereignScout $${token.symbol}`;
        
        console.log(chalk.bold.blue('\n📢 POSTING TO TWITTER:'));
        console.log(chalk.italic.white(message));
        console.log(chalk.gray('-------------------------\n'));

        try {
            // Post to Twitter if configured
            if (twitterClient.isAvailable()) {
                const success = await twitterClient.tweet(message);
                if (success) {
                    logger.success('Posted update to Twitter');
                    return true;
                }
            } else {
                logger.debug('Twitter not configured - update logged only');
            }
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(chalk.red('Error posting social update:'), errorMessage);
            return false;
        }
    }
}

export default new SocialPoster();
