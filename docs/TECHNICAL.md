# Technical Documentation

## 🏗️ Architecture Overview

Sovereign Scout is built with a modular architecture consisting of three main components:

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     SOVEREIGN SCOUT                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐                                       │
│  │  Event Monitor   │  Listens for TokenCreated events      │
│  │  (Discovery)     │  Filters by creator quality           │
│  └────────┬─────────┘                                       │
│           │                                                  │
│           ▼                                                  │
│  ┌──────────────────┐                                       │
│  │  Token Analyzer  │  Multi-factor scoring system          │
│  │  (Evaluation)    │  - Sentiment Analysis (40%)           │
│  │                  │  - Liquidity Check (30%)              │
│  │                  │  - On-chain Metrics (30%)             │
│  └────────┬─────────┘                                       │
│           │                                                  │
│           ▼                                                  │
│  ┌──────────────────┐                                       │
│  │  Trade Executor  │  Executes BUY/SELL via Viem           │
│  │  (Trading)       │  Manages positions & risk             │
│  └────────┬─────────┘                                       │
│           │                                                  │
│           ▼                                                  │
│  ┌──────────────────┐                                       │
│  │  Social Poster   │  Announces trades on Moltbook         │
│  │  (Updates)       │  Posts to Twitter (optional)          │
│  └──────────────────┘                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
monadagent/
├── backend/
│   ├── src/
│   │   ├── scout_agent.ts          # Main agent loop
│   │   ├── token_analyzer.ts       # Scoring & evaluation
│   │   ├── trade_executor.ts       # Trading logic
│   │   ├── sentiment_analyzer.ts   # AI sentiment analysis
│   │   ├── moltbook_client.ts      # Social integration
│   │   ├── api_server.ts           # REST API for dashboard
│   │   └── types.ts                # TypeScript definitions
│   ├── persona/
│   │   └── scout_prompt.md         # AI personality
│   ├── narrative/
│   │   └── tenets.md               # Investment philosophy
│   ├── .env                        # Configuration
│   └── package.json
│
└── frontend/dashboard/
    ├── app/
    │   ├── page.tsx                # Main dashboard
    │   ├── layout.tsx              # App layout
    │   └── api/                    # API routes
    ├── components/
    │   ├── PortfolioOverview.tsx   # Holdings display
    │   ├── ActivityFeed.tsx        # Trade feed
    │   └── AgentStatus.tsx         # System status
    └── package.json
```

---

## 🔧 Setup & Configuration

### Environment Variables

Create `backend/.env` with the following:

```bash
# Blockchain
MONAD_RPC_URL=https://rpc.monad.xyz
PRIVATE_KEY=your_wallet_private_key    # ⚠️ See security warning below

# AI Services
OPENAI_API_KEY=sk-proj-...          # For sentiment analysis
GEMINI_API_KEY=...                  # For Moltbook verification

# Social (Optional)
MOLTBOOK_API_KEY=moltbook_sk_...    # For trade announcements
TWITTER_API_KEY=...                 # For Twitter posts

# nad.fun Integration
NADFUN_API_URL=https://api.nadapp.net
NADFUN_NETWORK=mainnet
```

### ⚠️ CRITICAL: Private Key Setup

**The bot requires your wallet private key to execute trades autonomously.**

#### Security Best Practices

1. **Use a Dedicated Trading Wallet**
   ```bash
   # Generate a new wallet specifically for the bot
   npx ts-node -e "
   const { Wallet } = require('ethers');
   const wallet = Wallet.createRandom();
   console.log('Address:', wallet.address);
   console.log('Private Key:', wallet.privateKey);
   "
   ```

2. **Fund with Limited Amount**
   - Only deposit what you're willing to risk
   - Recommended: 1-5 MON for testing
   - Never use your main wallet

3. **Store Private Key Securely**
   ```bash
   # Add to .env (already in .gitignore)
   PRIVATE_KEY=0x1234...your_private_key_here
   
   # Verify .env is NOT tracked by git
   git status | grep .env  # Should return nothing
   ```

4. **Monitor Wallet Activity**
   - Check transactions: https://explorer.monad.xyz
   - Set up alerts for large transfers
   - Review bot logs regularly

#### How the Bot Uses Your Private Key

```typescript
// The bot signs transactions to:
- Buy tokens on nad.fun bonding curve
- Sell tokens when stop-loss/take-profit triggers
- Approve token spending (if needed)

// Your private key is:
✅ Stored only in .env (not committed to git)
✅ Never sent to external services
✅ Only used for Monad blockchain transactions
```

#### Risks

- ⚠️ Bot has full access to wallet funds
- ⚠️ Bugs could result in loss of funds
- ⚠️ Compromised .env = compromised wallet
- ⚠️ No recovery if private key is lost

**By using this bot, you accept these risks.**

### Installation

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (separate terminal)
cd frontend/dashboard
npm install
npm run dev
```

---

## 🔌 API Reference

### REST API Endpoints

**Base URL**: `http://localhost:3001/api`

#### GET `/portfolio`
Returns current portfolio holdings.

**Response:**
```json
{
  "tokens": [
    {
      "symbol": "READ",
      "name": "Reader Agent",
      "address": "0x...",
      "balance": 1000000,
      "entryPrice": 0.0001,
      "currentPrice": 0.00015,
      "pnl": 50.0,
      "pnlPercent": 50.0
    }
  ],
  "totalValue": 150.0,
  "totalPnl": 50.0
}
```

#### GET `/trades`
Returns trade history.

**Response:**
```json
{
  "trades": [
    {
      "id": "1",
      "timestamp": "2026-02-15T10:00:00Z",
      "action": "BUY",
      "symbol": "READ",
      "amount": 1000000,
      "price": 0.0001,
      "reasoning": "Strong sentiment score (0.85)",
      "txHash": "0x..."
    }
  ]
}
```

#### GET `/status`
Returns agent status.

**Response:**
```json
{
  "isRunning": true,
  "cycleCount": 1234,
  "lastCycle": "2026-02-15T12:00:00Z",
  "balance": 1.5,
  "activePositions": 2
}
```

---

## 🔗 Blockchain Integration

### Pure Viem Implementation

Sovereign Scout uses **Viem** directly (no SDK) for maximum control:

```typescript
// Example: Buy token
const tx = await walletClient.writeContract({
  address: BONDING_CURVE_ADDRESS,
  abi: bondingCurveAbi,
  functionName: 'buy',
  args: [tokenAddress, minTokensOut],
  value: parseEther(amountInMON.toString())
});
```

### Event Monitoring

Listens for `TokenCreated` events:

```typescript
const logs = await publicClient.getLogs({
  address: BONDING_CURVE_ADDRESS,
  event: parseAbiItem('event TokenCreated(address indexed token, address indexed creator, string name, string symbol)'),
  fromBlock: lastBlock,
  toBlock: currentBlock
});
```

---

## 🛡️ Risk Management

### Position Limits

- **Max Position Size**: 10% of portfolio per token
- **Max Position Age**: 72 hours
- **Stop Loss**: -20% from entry
- **Take Profit**: +50% from entry

### Portfolio Diversification

```typescript
const maxPositionValue = totalPortfolioValue * 0.10;
if (positionValue > maxPositionValue) {
  // Reject trade
}
```

---

## 🧪 Testing

### Run Tests

```bash
cd backend
npm test
```

### Manual Testing

```bash
# Test sentiment analysis
npx ts-node src/test_sentiment.ts

# Test trade execution
npx ts-node src/test_trade.ts

# Test Moltbook integration
npx ts-node test_unique.ts
```

---

## 🔍 Monitoring & Logging

### Winston Logger

Logs are stored in `backend/logs/`:

- `combined.log` - All logs
- `error.log` - Errors only

### Log Levels

```typescript
logger.info('Trade executed');
logger.warn('Low liquidity detected');
logger.error('RPC connection failed');
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Set all environment variables
- [ ] Test RPC connection
- [ ] Verify wallet has MON balance
- [ ] Test AI API keys
- [ ] Enable Moltbook integration
- [ ] Start agent with `npm run start:prod`
- [ ] Monitor logs for errors

### Running in Production

```bash
# Use PM2 for process management
npm install -g pm2
pm2 start npm --name "sovereign-scout" -- run start:prod
pm2 logs sovereign-scout
```

---

## 🐛 Troubleshooting

### Common Issues

**RPC Connection Errors**
```bash
# Solution: Check RPC URL and network connectivity
curl https://rpc.monad.xyz
```

**Insufficient Balance**
```bash
# Solution: Fund wallet with MON
# Check balance: https://explorer.monad.xyz
```

**AI API Rate Limits**
```bash
# Solution: Reduce cycle frequency or upgrade API plan
```

**Moltbook Suspension**
```bash
# Solution: Use unique content generator (test_unique.ts)
# Wait for suspension to lift (24 hours)
```

---

## 📊 Performance Optimization

### RPC Optimization

- Automatic RPC switching on failure
- Request batching for efficiency
- Error suppression for stability

### Memory Management

- Periodic state cleanup
- Log rotation
- Portfolio sync from blockchain

---

## 🔐 Security

### Best Practices

- Never commit `.env` files
- Use environment variables for all secrets
- Rotate API keys regularly
- Monitor wallet activity
- Use separate wallets for testing/production

### Wallet Security

```bash
# Generate new wallet
npx ts-node scripts/generate_wallet.ts

# Export private key (store securely)
```

---

## 📚 Additional Resources

- [Viem Documentation](https://viem.sh)
- [Monad Documentation](https://docs.monad.xyz)
- [nad.fun API](https://nad.fun/docs)
- [OpenAI API](https://platform.openai.com/docs)

---

## 🤝 Contributing

See main [README.md](../README.md#contributing) for contribution guidelines.
