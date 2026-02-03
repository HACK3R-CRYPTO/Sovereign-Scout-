# The Sovereign Scout 🔍

**The First AI Venture Capital Fund for Agent Tokens**

An AI agent that autonomously discovers, analyzes, and invests in other agent tokens on nad.fun, using social sentiment and on-chain metrics to build a high-performing portfolio.

**Hackathon**: Moltiverse by Nad.fun & Monad  
**Track**: Agent+Token ($140K Prize Pool)  
**Status**: BACKUP PROJECT (use if Molti-Maker pivot needed)

---

## 🎯 What It Does

The Sovereign Scout is an autonomous VC fund that:
- 🔍 **Discovers** new agent tokens on nad.fun
- 📊 **Analyzes** social sentiment from Moltbook/Discord
- 💰 **Invests** in high-potential agent tokens
- 📈 **Manages** a diversified portfolio
- 💬 **Posts** investment decisions publicly (transparency)

---

## 🏗️ Architecture

```
The Sovereign Scout
├── Token Discovery → Monitors nad.fun launches
├── Sentiment Analyzer → Gauges community buzz
├── Investment Evaluator → Scores tokens (0-10)
├── Trade Executor → Executes buys/sells
├── Portfolio Manager → Tracks holdings & P&L
└── Social Poster → Posts to Moltbook
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Monad wallet with testnet tokens
- Nad.fun account

### Installation

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your keys

# Start scout agent
npm run start:scout

# Start dashboard
cd frontend
npm run dev
```

---

## 📁 Project Structure

```
sovereign-scout/
├── src/                    # Scout agent core
│   ├── scout_agent.js      # Main orchestrator
│   ├── token_discovery.js  # Nad.fun monitoring
│   ├── sentiment_analyzer.js
│   ├── investment_evaluator.js
│   ├── trade_executor.js
│   └── portfolio_manager.js
├── contracts/              # Smart contracts (minimal)
│   └── ScoutTreasury.sol   # Multi-sig treasury
├── frontend/               # Dashboard UI
│   ├── pages/
│   ├── components/
│   └── lib/
├── scripts/                # Deployment & utilities
└── docs/                   # Documentation
```

---

## 🎬 Demo Flow

1. **Token Discovery**: Scout detects new agent token on nad.fun
2. **Sentiment Analysis**: Analyzes Moltbook mentions + holder growth
3. **Investment Decision**: Scores 8.5/10 → BUY signal
4. **Trade Execution**: Buys 500 USDC worth
5. **Social Post**: Posts reasoning to Moltbook
6. **Portfolio Update**: Dashboard shows new holding

---

## 🔧 Tech Stack

- **Framework**: OpenClaw
- **Blockchain**: Monad
- **Tokens**: Nad.fun
- **Frontend**: Next.js 14 + TailwindCSS
- **Backend**: Node.js

---

## 📊 Code Attribution

**Existing Code (80% reuse)**:
- ✅ ChainSniper - Automated trading, price monitoring
- ✅ Aegis - Risk management, circuit breakers
- ✅ AgentMarket - x402 payments (optional)

**Original Code (20% new)**:
- ⚠️ Token discovery engine
- ⚠️ Sentiment analyzer
- ⚠️ Investment evaluator
- ⚠️ Social poster

---

## 📝 Development Status

See [task.md](./task.md) for detailed development checklist.

---

## 📄 License

MIT License

---

**Backup Project for Moltiverse Hackathon 2026** 🚀
