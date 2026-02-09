
import { createPublicClient, http, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, '../.env') });

const PRIVATE_KEY = process.env.MONAD_PRIVATE_KEY;
if (!PRIVATE_KEY) {
    console.error('No private key found!');
    process.exit(1);
}

const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);
console.log(`Wallet Address: ${account.address}`);

const RPC_URL = process.env.MONAD_RPC_URL || 'https://monad-mainnet.drpc.org';
const client = createPublicClient({
    transport: http(RPC_URL)
});

const LOVELACE = '0xBCcf0FA1ab655446d011540d0Fe4947e57827777';

async function check() {
    console.log(`Checking balance of LOVELACE (${LOVELACE})...`);
    try {
        const bal = await client.readContract({
            address: LOVELACE as `0x${string}`,
            abi: parseAbi(["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"]),
            functionName: "balanceOf",
            args: [account.address]
        });

        const decimals = await client.readContract({
            address: LOVELACE as `0x${string}`,
            abi: parseAbi(["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"]),
            functionName: "decimals"
        });

        console.log(`Raw Balance: ${bal}`);
        console.log(`Decimals: ${decimals}`);
        console.log(`Formatted: ${Number(bal) / 10 ** decimals}`);

    } catch (e) {
        console.error('Error:', e);
    }
}

check();
