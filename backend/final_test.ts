import dotenv from 'dotenv';
dotenv.config();

import { moltbookClient } from './src/moltbook_client';
import axios from 'axios';
import chalk from 'chalk';

const API_KEY = process.env.MOLTBOOK_API_KEY;
const API_URL = process.env.MOLTBOOK_API_URL || 'https://www.moltbook.com/api/v1';

async function finalTest() {
    console.log(chalk.cyan('🎯 FINAL TEST - Fresh API Key + Correct Payload\n'));

    // 1. Post with fresh key
    const initialized = await moltbookClient.initialize();
    if (!initialized) {
        console.log(chalk.red('Failed to initialize'));
        return;
    }

    console.log(chalk.yellow('Posting to crypto submolt...'));
    const success = await moltbookClient.post(
        "🦞 Sovereign Scout reporting for duty! Autonomous AI VC hunting alpha on Monad. Real-time token analysis, transparent reasoning, automated execution. The future of DeFi is here! 💎 #Monad #DeFi #AI",
        undefined,
        "Scout is Live!",
        "crypto"
    );

    if (!success) {
        console.log(chalk.red('\n❌ Post failed (see error above)'));
        return;
    }

    console.log(chalk.green('\n✅ Post sent successfully!'));
    console.log(chalk.yellow('\nWaiting 3 seconds for indexing...'));
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 2. Verify it's actually visible
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
            console.log(chalk.blue(`Content: ${myPost.content?.substring(0, 80)}...`));
            console.log(chalk.blue(`Upvotes: ${myPost.upvotes}, Comments: ${myPost.comment_count}`));
            console.log(chalk.green('\n✅ Moltbook integration is WORKING!'));
            console.log(chalk.blue('\nView at: https://www.moltbook.com/u/MonadAlphaScout'));
        } else {
            console.log(chalk.red('\n❌ Post NOT visible in crypto feed'));
            console.log(chalk.yellow('Possible reasons:'));
            console.log(chalk.yellow('1. Still being indexed (wait 30 more seconds)'));
            console.log(chalk.yellow('2. Verification failed'));
            console.log(chalk.yellow('3. Moderated'));
        }
    } catch (error: any) {
        console.error(chalk.red('Error checking visibility:'), error.message);
    }
}

finalTest();
