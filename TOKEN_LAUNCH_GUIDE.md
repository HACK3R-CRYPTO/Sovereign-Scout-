# 🪙 Token Launch Guide

## Prerequisites

Before launching the $SCOUT token, you need:

1. **Monad Testnet Tokens**
   - Your wallet: `0xa91D5A0a64ED5eeF11c4359C4631279695A338ef`
   - Get testnet tokens from: https://faucet.monad.xyz (or check Monad Discord)
   - Estimated cost: ~0.1-0.5 MON for deployment

2. **Verified Configuration**
   - ✅ Private key configured in `.env`
   - ✅ Nad.fun SDK initialized
   - ✅ Token metadata prepared

---

## Launch Steps

### Step 1: Get Testnet Funds

```bash
# Check current balance
cd backend
npx ts-node -e "
import { ethers } from 'ethers';
const provider = new ethers.JsonRpcProvider('https://testnet-rpc.monad.xyz/');
const wallet = new ethers.Wallet('0x051452255cf2fdf4c9021a39d68dd1372ffe564406864cc4b35cf5b5b377b9e7', provider);
wallet.getBalance().then(b => console.log('Balance:', ethers.formatEther(b), 'MON'));
"
```

If balance is 0, visit:
- **Monad Faucet**: https://faucet.monad.xyz
- **Discord**: https://discord.gg/monaddev (check #faucet channel)

### Step 2: Launch Token

Once you have funds:

```bash
cd backend
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
Token Address:  0x...
-----------------------------------------
👉 COPY THE TOKEN ADDRESS FOR YOUR FORM!
Saved address to scout_token_address.txt
```

### Step 3: Update Documentation

After successful deployment, update these files with the token address:

1. **backend/.env**
   ```env
   SCOUT_TOKEN_ADDRESS=0x... # paste your token address
   ```

2. **HACKATHON_SUBMISSION.md**
   - Find "Token Address:" section
   - Replace with your deployed address

3. **README.md**
   - Update "Token on nad.fun" link
   - Add: `https://nad.fun/token/[YOUR_TOKEN_ADDRESS]`

### Step 4: Verify on nad.fun

Visit your token page:
```
https://nad.fun/token/[YOUR_TOKEN_ADDRESS]
```

Check:
- ✅ Token name: "Sovereign Scout"
- ✅ Symbol: "SCOUT"
- ✅ Description visible
- ✅ Social links working

---

## Token Details

### Metadata
- **Name**: Sovereign Scout
- **Symbol**: SCOUT
- **Description**: "The Official Token of the Sovereign Scout AI Agent. A fully autonomous trading bot living on Monad. #Moltiverse #AI #Agent"
- **Image**: 1x1 green pixel (placeholder for hackathon)
- **Twitter**: https://x.com/MonadScout
- **Website**: https://scout.monad.xyz

### Launch Parameters
- **Initial Buy**: 0 (saving gas for hackathon demo)
- **Network**: Monad Testnet
- **Chain ID**: 10143

---

## Troubleshooting

### Error: Insufficient Balance
```
The total cost exceeds the balance of the account
```

**Solution**: Get testnet tokens from faucet first (see Step 1)

### Error: RPC Connection Failed
```
Could not connect to RPC endpoint
```

**Solution**: 
- Check if Monad testnet is operational
- Try alternative RPC: `https://rpc.testnet.monad.xyz`
- Check Discord for RPC status

### Error: SDK Initialization Failed
```
initSDK is not a function
```

**Solution**:
```bash
cd backend
npm install @nadfun/sdk@latest
```

### Error: Salt Mining Timeout
```
Transaction timeout after 30 seconds
```

**Solution**: This is normal for complex deployments. The script will retry automatically or you can run again.

---

## Alternative: Manual Token Launch

If the script fails, you can launch manually:

1. Visit: https://nad.fun
2. Click "Create Token"
3. Fill in:
   - Name: Sovereign Scout
   - Symbol: SCOUT
   - Description: [Copy from launch_scout_token.ts]
   - Upload image (any image)
   - Add social links

4. Copy the deployed token address
5. Update documentation as in Step 3 above

---

## Post-Launch Actions

After successful token launch:

1. **Announce on Social Media** (Optional)
   - Twitter/X post about your agent
   - Tag @monad, @nadfun, #Moltiverse

2. **Test Token Trading** (Optional)
   - Try buying a small amount on nad.fun
   - Verify your agent can detect it

3. **Add to Dashboard** (Optional)
   - Update dashboard to show $SCOUT token info
   - Display current price/holders

---

## Important Notes

⚠️ **For Hackathon Demo**:
- You don't need a large initial buy
- Focus on demonstrating the agent's capabilities
- The token is primarily for track compliance

✅ **Good Practice**:
- Save the token address immediately
- Take screenshot of successful deployment
- Backup the transaction hash

🚀 **Next Steps**:
After token launch, proceed to:
1. Record demo video
2. Update all documentation
3. Submit to hackathon!

---

**Need Help?**
- Monad Discord: https://discord.gg/monaddev
- Nad.fun Support: https://discord.gg/nadfun
- Check FINAL_CHECKLIST.md for submission steps
