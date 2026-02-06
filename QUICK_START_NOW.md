# 🚀 Quick Start Guide: Launch Token & Fetch Real Data

## Current Status

✅ **Wallet Ready**: `0xa91D5A0a64ED5eeF11c4359C4631279695A338ef`  
⚠️ **Needs Testnet Funds**: Required for token deployment  
⚠️ **Nad.fun API**: Endpoints returning 404 (may need different API structure)

---

## Step 1: Get Testnet Funds (REQUIRED)

### Option A: Monad Faucet
```bash
# Visit the faucet
open https://faucet.monad.xyz
```
Enter your wallet: `0xa91D5A0a64ED5eeF11c4359C4631279695A338ef`

### Option B: Discord
1. Join: https://discord.gg/monaddev
2. Go to #faucet channel
3. Request testnet MON tokens

**You need ~0.1-0.5 MON for token deployment**

---

## Step 2: Launch Your $SCOUT Token

Once you have testnet funds:

```bash
cd /Users/ucheekezie/Documents/web3work/monadagent/backend
npx ts-node launch_scout_token.ts
```

Expected output:
```
🚀 Initializing Sovereign Scout Token Launch...
✅ SDK Initialized.
📤 Uploading metadata and deploying contract...
(This may take up to 30 seconds due to Salt Mining...)

🎉 TOKEN DEPLOYMENT SUCCESSFUL! 🎉
-----------------------------------------
Token Name:    Sovereign Scout
Symbol:        SCOUT
Transaction:   0x...
Token Address: 0x...
-----------------------------------------
```

**Save the token address immediately!**

---

## Step 3: Update Your Environment

After successful launch, add the token address to `.env`:

```bash
# Add this line to backend/.env
SCOUT_TOKEN_ADDRESS=0x...  # Your deployed token address
```

---

## Fetching Real Tokens from Nad.fun

### Current Issue
The nad.fun API endpoints are returning 404. This could mean:
1. API structure has changed
2. Different endpoints for testnet vs mainnet
3. Authentication required

### Workaround Options

#### Option 1: Use the Nad.fun SDK Directly
Your `token_discovery.ts` already uses the nad.fun SDK. The SDK should handle API calls internally:

```typescript
import { initSDK } from '@nadfun/sdk';

const nadSDK = initSDK({
    rpcUrl: 'https://testnet-rpc.monad.xyz/',
    privateKey: process.env.MONAD_PRIVATE_KEY as `0x${string}`,
    network: 'testnet',
});

// The SDK should have methods to query tokens
// Check SDK documentation for available methods
```

#### Option 2: Scrape from Nad.fun Website
Visit https://nad.fun and look at the network requests in browser DevTools to see the actual API endpoints being used.

#### Option 3: Use Mock Data (For Hackathon Demo)
Your agent already has mock data fallback in `nadfun_api.ts`. For the demo, this is acceptable since you're showing the **concept and functionality**.

---

## Testing Your Agent

### Quick Test Run

**Terminal 1 - API Server:**
```bash
cd backend
npm run start:api
```

**Terminal 2 - Scout Agent:**
```bash
cd backend
npm run start:scout
```

**Terminal 3 - Dashboard:**
```bash
cd frontend/dashboard
npm run dev
```

The agent will:
- Use mock tokens for discovery (acceptable for hackathon)
- Demonstrate AI analysis with GPT-4
- Show risk management
- Update dashboard in real-time

---

## For Hackathon Submission

### What You MUST Do:
1. ✅ Launch $SCOUT token (once you have testnet funds)
2. ✅ Record demo video showing the full system
3. ✅ Submit before Feb 15, 23:59 ET

### What's ACCEPTABLE:
- Using mock token data for discovery
- Simulation mode without real trades
- Demonstrating the AI logic and dashboard

### Why This is Fine:
The judges are evaluating:
- Your AI integration (GPT-4) ✅
- Risk management logic ✅
- Full-stack implementation ✅
- Innovation and completeness ✅

Real token data is a "nice-to-have" but not critical for winning.

---

## Immediate Next Steps

1. **Get Testnet Funds** (5 minutes)
   - Visit faucet or Discord

2. **Launch Token** (1 minute)
   ```bash
   npx ts-node launch_scout_token.ts
   ```

3. **Test Full System** (5 minutes)
   - Start all 3 terminals
   - Verify everything works

4. **Record Demo** (15 minutes)
   - Follow DEMO_SCRIPT.md
   - Show terminal output
   - Show dashboard

5. **Submit** (5 minutes)
   - Update docs with token address
   - Upload video
   - Fill submission form

**Total time needed: ~30 minutes**

---

## Alternative: Try These SDK Methods

Check if the nad.fun SDK has methods like:

```typescript
// Possible SDK methods (check documentation)
await nadSDK.getTokens({ limit: 10 });
await nadSDK.getLatestTokens();
await nadSDK.getTrendingTokens();
await nadSDK.searchTokens('agent');
```

Try this script:
```bash
cd backend
npx ts-node -e "
import { initSDK } from '@nadfun/sdk';
const sdk = initSDK({
  rpcUrl: 'https://testnet-rpc.monad.xyz/',
  privateKey: process.env.MONAD_PRIVATE_KEY,
  network: 'testnet'
});
console.log('Available SDK methods:', Object.keys(sdk));
"
```

---

## Need Help?

- **Monad Discord**: https://discord.gg/monaddev
- **Nad.fun Discord**: Check for nad.fun community
- **Your docs**: Check TOKEN_LAUNCH_GUIDE.md and FINAL_CHECKLIST.md

---

**Focus on launching your token first! That's the critical blocker. Token data can use mock for the demo.**
