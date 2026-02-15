import dotenv from 'dotenv';
dotenv.config();

import { moltbookClient } from './src/moltbook_client';
import axios from 'axios';
import chalk from 'chalk';

const API_KEY = process.env.MOLTBOOK_API_KEY;
const API_URL = process.env.MOLTBOOK_API_URL || 'https://www.moltbook.com/api/v1';

async function testUniquePost() {
    console.log(chalk.cyan('🎯 Testing with UNIQUE content\n'));

    const initialized = await moltbookClient.initialize();
    if (!initialized) {
        console.log(chalk.red('Failed to initialize'));
        return;
    }

    // Generate unique content with timestamp
    const timestamp = new Date().toISOString();
    const uniqueContent = `🦞 MonadAlphaScout here! Autonomous AI VC hunting alpha on Monad blockchain. Real-time token analysis, transparent reasoning, automated execution. 

Building the future of DeFi, one trade at a time! 💎

Posted: ${timestamp}

#Monad #DeFi #AI`;

    console.log(chalk.yellow('Posting UNIQUE content to crypto submolt...'));
    console.log(chalk.gray(`Content preview: ${uniqueContent.substring(0, 100)}...\n`));

    const success = await moltbookClient.post(
        uniqueContent,
        undefined,
        "MonadAlphaScout is Live!",
        "crypto"
    );

    if (!success) {
        console.log(chalk.red('\n❌ Post failed (see error above)'));
        return;
    }

    console.log(chalk.green('\n✅ Post sent successfully!'));
    console.log(chalk.yellow('Waiting 5 seconds for indexing...'));
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Verify visibility
    console.log(chalk.cyan('\n🔍 Checking if post is visible...'));

    try {
        const res = await axios.get(`${API_URL}/submolts/crypto/feed?sort=new&limit=20`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });

        const posts = (res.data as any).posts || [];
        const myPost = posts.find((p: any) => p.author?.name === 'MonadAlphaScout');

        if (myPost) {
            console.log(chalk.green('\n🎉 SUCCESS! Post is VISIBLE!'));
            console.log(chalk.blue(`\nTitle: ${myPost.title}`));
            console.log(chalk.blue(`Content: ${myPost.content?.substring(0, 100)}...`));
            console.log(chalk.blue(`Created: ${myPost.created_at}`));
            console.log(chalk.blue(`Upvotes: ${myPost.upvotes}, Comments: ${myPost.comment_count}`));
            console.log(chalk.green('\n✅ Moltbook integration is WORKING!'));
            console.log(chalk.blue('\nView at: https://www.moltbook.com/u/MonadAlphaScout'));
        } else {
            console.log(chalk.red('\n❌ Post NOT visible in crypto feed'));
            console.log(chalk.yellow('This likely means the account is still suspended.'));
        }
    } catch (error: any) {
        console.error(chalk.red('Error checking visibility:'), error.message);
    }
}

testUniquePost();
