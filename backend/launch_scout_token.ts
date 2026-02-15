import dotenv from 'dotenv';
dotenv.config();

import { initSDK } from '@nadfun/sdk';
import logger from './src/logger';
import fs from 'fs';
import path from 'path';

async function launchToken() {
    console.log("🚀 Initializing Sovereign Scout Token Launch...");

    const rpcUrl = process.env.MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz/';
    const privateKey = process.env.MONAD_PRIVATE_KEY;

    if (!privateKey) {
        console.error("❌ No private key found in .env");
        return;
    }

    try {
        const network = (process.env.NADFUN_NETWORK || 'testnet') as 'testnet' | 'mainnet';
        const apiUrl = process.env.NADFUN_API_URL;
        console.log(`🌍 Connecting to ${network}... ${apiUrl ? `(API: ${apiUrl})` : ''}`);

        const nadSDK = initSDK({
            rpcUrl: rpcUrl,
            privateKey: privateKey as `0x${string}`,
            network: network,
            ...(apiUrl ? { apiUrl } : {}),
        });

        console.log("✅ SDK Initialized.");

        console.log("📤 Loading token image...");
        const imagePath = path.join(__dirname, '../frontend/dashboard/public/scout.png');
        const imageBuffer = fs.readFileSync(imagePath);

        console.log("📤 Deploying token with metadata...");
        console.log("(This may take up to 30 seconds due to Salt Mining...)");

        const result = await nadSDK.createToken({
            name: "Sovereign Scout",
            symbol: "SCOUT",
            description: "The Official Token of the Sovereign Scout AI Agent. A fully autonomous trading bot living on Monad. #Moltiverse #AI #Agent",
            image: imageBuffer,
            imageContentType: "image/png",
            twitter: "https://x.com/MonadScout",
            website: "https://scout.monad.xyz",
            initialBuyAmount: 0n // Launch with 0 initial buy
        });

        console.log("\n🎉 TOKEN DEPLOYMENT SUCCESSFUL! 🎉");
        console.log("-----------------------------------------");
        console.log("Token Name:    Sovereign Scout");
        console.log("Symbol:        SCOUT");
        console.log("Transaction:   ", result.transactionHash);
        console.log("Token Address: ", result.tokenAddress); // Assuming SDK returns this, checking...
        console.log("-----------------------------------------");
        console.log("👉 COPY THE TOKEN ADDRESS FOR YOUR FORM!");

        fs.writeFileSync('scout_token_address.txt', result.tokenAddress);
        console.log("Saved address to scout_token_address.txt");

    } catch (error) {
        console.error("❌ Token Launch Failed:", error);
    }
}

launchToken();
