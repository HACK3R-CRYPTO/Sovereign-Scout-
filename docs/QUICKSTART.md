# Quick Setup Guide

## ⚡ 5-Minute Setup

### Step 1: Clone & Install

```bash
git clone https://github.com/HACK3R-CRYPTO/Sovereign-Scout-.git
cd Sovereign-Scout-/backend
npm install
```

### Step 2: Create Dedicated Trading Wallet

```bash
# Generate a new wallet
npx ts-node -e "
const { Wallet } = require('ethers');
const wallet = Wallet.createRandom();
console.log('Address:', wallet.address);
console.log('Private Key:', wallet.privateKey);
"
```

**⚠️ SAVE THESE CREDENTIALS SECURELY**

### Step 3: Fund Wallet

1. Copy the wallet address
2. Send 1-5 MON to this address
3. Verify balance: https://explorer.monad.xyz

### Step 4: Configure Environment

```bash
cd backend
cp .env.example .env
nano .env  # or use your preferred editor
```

**Required Variables:**

```bash
# Blockchain (REQUIRED)
MONAD_RPC_URL=https://rpc.monad.xyz
PRIVATE_KEY=0x...your_private_key_from_step_2

# AI (REQUIRED)
OPENAI_API_KEY=sk-proj-...
GEMINI_API_KEY=...

# Social (OPTIONAL)
MOLTBOOK_API_KEY=moltbook_sk_...
```

### Step 5: Start the Bot

```bash
npm run dev
```

**Expected Output:**
```
🔍 Sovereign Scout initialized
✅ Wallet: 0x...
💰 Balance: 5.0 MON
🔄 Starting monitoring cycle...
```

### Step 6: Start Dashboard (Optional)

```bash
# New terminal
cd frontend/dashboard
npm install
npm run dev
```

Visit: http://localhost:3000

---

## 🔑 Getting API Keys

### OpenAI API Key

1. Visit: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy key (starts with `sk-proj-`)
4. Add to `.env`: `OPENAI_API_KEY=sk-proj-...`

### Gemini API Key

1. Visit: https://aistudio.google.com/app/apikey
2. Click "Create API key"
3. Copy key
4. Add to `.env`: `GEMINI_API_KEY=...`

### Moltbook API Key (Optional)

1. Run: `npx ts-node register_agent.ts "YourAgentName" "Description"`
2. Copy API key from output
3. Visit claim URL and verify
4. Add to `.env`: `MOLTBOOK_API_KEY=moltbook_sk_...`

---

## ✅ Verification Checklist

Before running the bot, verify:

- [ ] Dedicated wallet created (not your main wallet)
- [ ] Wallet funded with 1-5 MON
- [ ] `.env` file configured with all required keys
- [ ] `.env` is in `.gitignore` (verify with `git status`)
- [ ] OpenAI API key is valid
- [ ] Gemini API key is valid
- [ ] RPC connection works (`curl https://rpc.monad.xyz`)

---

## 🚨 Troubleshooting

### "Insufficient balance" error

```bash
# Check wallet balance
npx ts-node -e "
const { createPublicClient, http } = require('viem');
const { monad } = require('viem/chains');
const client = createPublicClient({
  chain: monad,
  transport: http('https://rpc.monad.xyz')
});
client.getBalance({ address: 'YOUR_WALLET_ADDRESS' })
  .then(b => console.log('Balance:', b.toString()));
"
```

### "Invalid API key" error

- Verify API keys are correct in `.env`
- Check for extra spaces or quotes
- Ensure keys are active (not revoked)

### "RPC connection failed" error

```bash
# Test RPC
curl https://rpc.monad.xyz
```

### Bot not finding tokens

- Verify Monad RPC is working
- Check bot logs: `backend/logs/combined.log`
- Ensure wallet has MON for gas

---

## 📊 Monitoring Your Bot

### View Logs

```bash
# Real-time logs
tail -f backend/logs/combined.log

# Errors only
tail -f backend/logs/error.log
```

### Check Transactions

Visit: https://explorer.monad.xyz/address/YOUR_WALLET_ADDRESS

### Dashboard

Visit: http://localhost:3000

---

## 🛑 Stopping the Bot

```bash
# Press Ctrl+C in the terminal running the bot
# Or kill the process:
pkill -f "ts-node src/scout_agent.ts"
```

---

## 📚 Next Steps

- Read [Technical Documentation](docs/TECHNICAL.md)
- Read [AI Architecture](docs/AI.md)
- Join the community
- Monitor your first trades!

---

## ⚠️ Important Reminders

1. **Never share your private key**
2. **Only use dedicated trading wallet**
3. **Start with small amounts (1-5 MON)**
4. **Monitor bot activity regularly**
5. **Review logs for errors**
6. **Understand the risks** (see [Technical Docs](docs/TECHNICAL.md#-critical-private-key-setup))
