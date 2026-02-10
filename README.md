# The Sovereign Scout 🔍

**The First Autonomous AI VC Fund for Agent Tokens on Monad**

An autonomous AI agent that discovers, analyzes, and trades agent tokens on Monad in real-time using GPT-4 sentiment analysis, professional risk management, and transparent social updates—with a live portfolio dashboard.

**Hackathon**: Moltiverse by Nad.fun & Monad  
**Track**: Agent+Token ($140K Prize Pool)  
**Status**: ✅ LIVE & TRADING ON MAINNET

---

## 🎯 What It Does

The Sovereign Scout is a fully autonomous VC fund that:
- 🔍 **Discovers** new agent tokens on nad.fun in real-time (blockchain event monitoring)
- 🧠 **Analyzes** token sentiment using GPT-4o-mini (creator intent, social signals)
- 📊 **Evaluates** with multi-factor scoring (sentiment 40% + liquidity 30% + on-chain 30%)
- 💰 **Trades** automatically using pure Viem (no SDK required)
- 🛡️ **Manages Risk** with automatic stop-loss/take-profit triggers
- 📈 **Tracks** portfolio with live Next.js dashboard + Twitter-style feed
- 🔄 **BUY & SELL** - Both proven working on mainnet with real transactions

### 🎯 The $SCOUT Token

**Official Token Address**: [`0xaD324baD55eD7f737a7b029B00c3568E56cC7777`](https://nad.fun/token/0xaD324baD55eD7f737a7b029B00c3568E56cC7777)  
**Network**: Monad Mainnet (Chain ID 143)  
**Buy/Trade**: [nad.fun](https://nad.fun/token/0xaD324baD55eD7f737a7b029B00c3568E56cC7777)

**Live Performance**: 
- ✅ Active Holdings: **READ**, **LOVELACE**
- ✅ Real Blockchain Transactions - BUY & SELL Both Working
- ✅ Autonomous 30-second Trading Cycles
- ✅ Real-time Price Tracking via Direct Curve Interaction

---

## ✨ Key Features

### 🤖 Autonomous Intelligence
- **GPT-4o-mini Integration**: AI-powered sentiment analysis for token evaluation
- **30-Second Cycles**: Real-time blockchain monitoring and response
- **Multi-Factor Scoring**: Sentiment (40%) + Liquidity (30%) + On-Chain Metrics (30%)
- **Pure Viem Implementation**: Direct blockchain interaction without SDK dependencies. **Optimized for Monad Mainnet.**

### 💼 Professional Risk Management
- **Automatic Stop-Loss** (-20%) - Protects from heavy losses
- **Automatic Take-Profit** (+50%) - Locks in gains
- **Max Position Age** (72 hours) - Prevents stale positions
- Position size limits (10% max per token)
- Portfolio diversification tracking

### 📊 Live Dashboard
- Real-time portfolio visualization with current holdings
- Twitter-style social feed showing all trades
- Trade history with blockchain transaction links
- Agent status monitoring with cycle counts
- Performance metrics and balance tracking

### 🔒 Production Ready
- **Robust RPC Handling**: Auto-switching and error suppression for stability
- **Self-Healing Sync**: Automatically restores portfolio from on-chain history
- Full TypeScript type safety
- Comprehensive error handling
- Winston logging system
- Persistent state management

---

## 🏗️ Architecture

```
Sovereign Scout Platform
│
├── Backend Agent (TypeScript/Node.js)
│   ├── Token Discovery → Monitors nad.fun launches
│   ├── Sentiment Analyzer → GPT-4o-mini AI analysis
│   ├── Investment Evaluator → Multi-factor scoring (0-100%)
│   ├── Trade Executor → Nad.fun SDK integration
│   ├── Risk Manager → Kelly Criterion + Stop Loss/TP
│   ├── Portfolio Manager → Position tracking & persistence
│   └── Social Poster → Transparency & reasoning output
│
├── API Server (Express.js)
│   ├── /api/portfolio → Current holdings & balance
│   ├── /api/status → Agent state & recent trades
│   └── /api/health → System health check
│
└── Dashboard (Next.js 15)
    ├── Header → Wallet connection
    ├── PortfolioCard → Holdings visualization
    ├── StatusCard → Agent monitoring
    └── TradesCard.tsx → Trade history
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- OpenAI API Key
- **Reliable Monad RPC**: We recommend `https://infra.originstake.com/monad/evm` for stability.

### Installation & Setup

**Step 1: Clone & Install Backend**
```bash
git clone https://github.com/HACK3R-CRYPTO/Sovereign-Scout-.git
cd monadagent/backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your keys (see Configuration section below)
```

**Step 2: Install Frontend**
```bash
cd ../frontend/dashboard
npm install
```

### Running the Full Stack

You need **3 terminal windows**:

**Terminal 1 - API Server:**
```bash
cd backend
npm run start:api
# Server will run on http://localhost:3001
```

**Terminal 2 - Scout Agent:**
```bash
cd backend
npm run start:scout
# Agent will begin 30-second analysis cycles
```

**Terminal 3 - Dashboard:**
```bash
cd frontend/dashboard
npm run dev
# Dashboard will open on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) to view the live dashboard!

---

## ⚙️ Configuration

Create a `.env` file in the `backend/` directory:

```env
# Blockchain
MONAD_RPC_URL=https://infra.originstake.com/monad/evm
MONAD_PRIVATE_KEY=your_private_key_here

# AI Analysis
OPENAI_API_KEY=sk-your_openai_key_here

# Moltbook Identity (Optional - for social reputation)
MOLTBOOK_API_KEY=moltdev_your_key_here
MOLTBOOK_API_URL=https://api.moltbook.xyz

# Social (Optional)
TWITTER_API_KEY=your_twitter_key
TWITTER_API_SECRET=your_twitter_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret

# Risk Parameters (Optional - has defaults)
MAX_POSITION_SIZE_USD=100
STOP_LOSS_PERCENT=20
TAKE_PROFIT_PERCENT=50
MIN_CONFIDENCE_SCORE=70
```

**Note:** For demo/testing, you can run in **simulation mode** without a real wallet—the agent will generate mock trades.

---

## 📁 Project Structure

```
monadagent/
├── backend/                      # Agent Core & API
│   ├── src/
│   │   ├── scout_agent.ts        # Main orchestrator (30s loop)
│   │   ├── api_server.ts         # Express API for dashboard
│   │   ├── token_discovery.ts    # Nad.fun monitoring
│   │   ├── sentiment_analyzer.ts # GPT-4 AI analysis
│   │   ├── investment_evaluator.ts # Multi-factor scoring
│   │   ├── trade_executor.ts     # Nad.fun SDK trading
│   │   ├── risk_manager.ts       # Kelly Criterion + SL/TP
│   │   ├── portfolio_manager.ts  # Position tracking
│   │   ├── social_poster.ts      # Transparency layer
│   │   ├── nadfun_client.ts      # Direct Blockchain interactions
│   │   ├── twitter_client.ts     # Social sentiment
│   │   ├── logger.ts             # Winston logging
│   │   ├── config.ts             # Environment configuration
│   │   └── types.ts              # TypeScript interfaces
│   ├── scripts/
│   │   └── generate-wallet.ts    # Wallet generation utility
│   ├── logs/                     # Winston log files
│   ├── portfolio.json            # Persistent portfolio state
│   ├── launch_scout_token.ts     # Token deployment script
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── frontend/
    └── dashboard/                # Next.js Dashboard
        ├── app/
        │   ├── page.tsx          # Main dashboard page
        │   ├── layout.tsx        # App layout
        │   ├── globals.css       # Global styles
        │   └── components/
        │       ├── Header.tsx         # Wallet connection
        │       ├── PortfolioCard.tsx  # Holdings display
        │       ├── StatusCard.tsx     # Agent status
        │       └── TradesCard.tsx     # Recent trades
        ├── public/
        ├── package.json
        ├── next.config.ts
        └── tailwind.config.js
```

---

## 🚀 Future Roadmap

### Phase 1: Token Launch (Post-Hackathon)
- Launch $SCOUT token on nad.fun
- Enable LP revenue sharing
- Community governance features

### Phase 2: Multi-Agent System
- Specialized sub-agents (Risk Analyst, Hype Scout, Trader)
- Consensus-based decision making
- Agent reputation system

### Phase 3: DAO Governance
- Token holder voting on risk parameters
- Treasury management
- Community-proposed strategies

### Phase 4: Mainnet & Scale
- Deploy on Monad Mainnet with real capital
- Partnership with crypto VCs
- Cross-chain token discovery

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **Monad Foundation** - For the incredible high-performance blockchain
- **Nad.fun Team** - For the SDK and platform
- **OpenAI** - For GPT-4 API access
- **Moltiverse Organizers** - For hosting this amazing hackathon

---

## 📞 Contact & Links

- **GitHub**: https://github.com/HACK3R-CRYPTO/Sovereign-Scout-

---

**Built with 🤖 for the Moltiverse Hackathon 2026**

*Sovereign Scout: Where AI Meets Venture Capital on the Blockchain*
