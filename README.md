<div align="center">

# 🔍 Sovereign Scout

**The First Autonomous AI VC Fund for Agent Tokens on Monad**

[![Status](https://img.shields.io/badge/Status-LIVE%20%26%20TRADING-success?style=for-the-badge)](https://nad.fun/token/0xaD324baD55eD7f737a7b029B00c3568E56cC7777)
[![Hackathon](https://img.shields.io/badge/Hackathon-Moltiverse-blueviolet?style=for-the-badge)](https://monad.xyz)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

An autonomous AI agent that discovers, analyzes, and trades agent tokens on Monad in real-time using GPT-4 sentiment analysis, professional risk management, and transparent social updates—with a live portfolio dashboard.

**Hackathon**: Moltiverse by Nad.fun & Monad  
**Track**: Agent+Token ($140K Prize Pool)  
**Status**: ✅ LIVE & TRADING ON MAINNET

[View Dashboard](#-quick-start) • [Documentation](#-table-of-contents) • [Report Issue](https://github.com/HACK3R-CRYPTO/Sovereign-Scout-/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [The $SCOUT Token](#-the-scout-token)
- [Architecture](#️-architecture)
- [Quick Start](#-quick-start)
- [Configuration](#️-configuration)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 Overview

Sovereign Scout is a fully autonomous VC fund that operates 24/7 on the Monad blockchain. It combines cutting-edge AI analysis with professional trading strategies to identify and invest in promising agent tokens.

### What It Does

- 🔍 **Discovers** new agent tokens on nad.fun in real-time through blockchain event monitoring
- 🧠 **Analyzes** token sentiment using GPT-4o-mini to evaluate creator intent and social signals
- 📊 **Evaluates** with multi-factor scoring: sentiment (40%) + liquidity (30%) + on-chain metrics (30%)
- 💰 **Trades** automatically using pure Viem implementation (no SDK dependencies)
- 🛡️ **Manages Risk** with automatic stop-loss (-20%) and take-profit (+50%) triggers
- 📈 **Tracks** portfolio performance with a live Next.js dashboard and Twitter-style activity feed
- 🔄 **Executes** both BUY & SELL operations - proven working on mainnet with real transactions

---

## ✨ Key Features

### 🤖 Autonomous Intelligence
- **GPT-4o-mini Integration**: AI-powered sentiment analysis evaluates token quality and potential
- **30-Second Cycles**: Real-time blockchain monitoring ensures immediate response to new opportunities
- **Multi-Factor Scoring**: Holistic evaluation combining sentiment (40%), liquidity (30%), and on-chain metrics (30%)
- **Pure Viem Implementation**: Direct blockchain interaction optimized for Monad Mainnet without SDK dependencies

### 💼 Professional Risk Management
- **Automatic Stop-Loss** at -20% to protect capital from heavy losses
- **Automatic Take-Profit** at +50% to lock in gains systematically
- **Max Position Age** of 72 hours prevents stale positions
- **Position Size Limits** (10% max per token) ensure proper diversification
- **Portfolio Diversification Tracking** maintains balanced exposure

### 📊 Live Dashboard
- Real-time portfolio visualization showing current holdings and performance
- Twitter-style social feed displaying all trades with reasoning
- Complete trade history with blockchain transaction links for verification
- Agent status monitoring displaying cycle counts and system health
- Performance metrics and balance tracking with historical data

### 🔒 Production Ready
- **Robust RPC Handling**: Automatic RPC switching and error suppression for maximum stability
- **Self-Healing Sync**: Automatically restores portfolio state from on-chain transaction history
- **Full TypeScript Type Safety**: Comprehensive type definitions prevent runtime errors
- **Comprehensive Error Handling**: Graceful degradation and recovery mechanisms
- **Winston Logging System**: Structured logging for debugging and monitoring
- **Persistent State Management**: Reliable data storage and recovery

---

## 🎯 The $SCOUT Token

**Official Token Address**: [`0xaD324baD55eD7f737a7b029B00c3568E56cC7777`](https://nad.fun/token/0xaD324baD55eD7f737a7b029B00c3568E56cC7777)  
**Network**: Monad Mainnet (Chain ID 143)  
**Buy/Trade**: [nad.fun](https://nad.fun/token/0xaD324baD55eD7f737a7b029B00c3568E56cC7777)

### Live Performance

- ✅ **Active Holdings**: READ, LOVELACE
- ✅ **Real Blockchain Transactions**: Both BUY & SELL operations verified on-chain
- ✅ **Autonomous Trading**: 30-second analysis and execution cycles
- ✅ **Real-time Pricing**: Direct bonding curve price tracking

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Sovereign Scout Platform                    │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
┌───────▼────────┐                         ┌────────▼────────┐
│ Backend Agent  │                         │   Frontend      │
│ (TypeScript)   │◄────────API─────────────┤   (Next.js 15)  │
└────────────────┘                         └─────────────────┘
        │
        ├─► Token Discovery (Blockchain Events)
        ├─► Sentiment Analyzer (GPT-4o-mini)
        ├─► Investment Evaluator (Multi-factor)
        ├─► Trade Executor (Pure Viem)
        ├─► Risk Manager (Kelly + SL/TP)
        ├─► Portfolio Manager (State + Persistence)
        └─► Social Poster (Transparency)
```

### Technology Stack

**Backend:**
- Node.js 18+ with TypeScript
- Viem for blockchain interactions
- OpenAI GPT-4o-mini for sentiment analysis
- Winston for structured logging
- Express.js for REST API

**Frontend:**
- Next.js 15 with App Router
- React 18+ with TypeScript
- Tailwind CSS for styling
- Real-time data polling

**Blockchain:**
- Monad Mainnet (Chain ID 143)
- Direct bonding curve interaction
- Event-driven token discovery

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **OpenAI API Key** for GPT-4o-mini sentiment analysis
- **Monad Wallet** with MONAD tokens (for live trading)
- **Reliable RPC Endpoint** - We recommend `https://infra.originstake.com/monad/evm`

### Installation

**1. Clone the Repository**

```bash
git clone https://github.com/HACK3R-CRYPTO/Sovereign-Scout-.git
cd Sovereign-Scout-
```

**2. Install Backend Dependencies**

```bash
cd backend
npm install
```

**3. Configure Environment**

```bash
cp .env.example .env
# Edit .env with your configuration (see Configuration section)
```

**4. Install Frontend Dependencies**

```bash
cd ../frontend/dashboard
npm install
```

### Running the Application

You need **3 terminal windows** running concurrently:

**Terminal 1 - API Server:**
```bash
cd backend
npm run start:api
# API server starts on http://localhost:3001
```

**Terminal 2 - Scout Agent:**
```bash
cd backend
npm run start:scout
# Agent begins 30-second analysis and trading cycles
```

**Terminal 3 - Dashboard:**
```bash
cd frontend/dashboard
npm run dev
# Dashboard opens on http://localhost:3000
```

**Access the Dashboard:** Open [http://localhost:3000](http://localhost:3000) in your browser to view the live portfolio and trading activity.

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory with the following configuration:

```env
# ═══════════════════════════════════════════════════════
#  BLOCKCHAIN CONFIGURATION (Required)
# ═══════════════════════════════════════════════════════

# Monad RPC endpoint - recommendation: https://infra.originstake.com/monad/evm
MONAD_RPC_URL=https://infra.originstake.com/monad/evm

# Private key of your trading wallet (hex format with 0x prefix)
MONAD_PRIVATE_KEY=0xyour_private_key_here

# ═══════════════════════════════════════════════════════
#  AI ANALYSIS (Required)
# ═══════════════════════════════════════════════════════

# OpenAI API key for GPT-4o-mini sentiment analysis
OPENAI_API_KEY=sk-your_openai_key_here

# ═══════════════════════════════════════════════════════
#  SOCIAL INTEGRATION (Optional)
# ═══════════════════════════════════════════════════════

# Moltbook API for on-chain social reputation
MOLTBOOK_API_KEY=moltdev_your_key_here
MOLTBOOK_API_URL=https://api.moltbook.xyz

# ═══════════════════════════════════════════════════════
#  RISK MANAGEMENT (Optional - Defaults Provided)
# ═══════════════════════════════════════════════════════

# Maximum position size in USD per token
MAX_POSITION_SIZE_USD=100

# Stop-loss trigger percentage (default: 20 = -20%)
STOP_LOSS_PERCENT=20

# Take-profit trigger percentage (default: 50 = +50%)
TAKE_PROFIT_PERCENT=50

# Minimum confidence score (0-100) to execute trades
MIN_CONFIDENCE_SCORE=70
```

### Configuration Parameters Explained

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `MONAD_RPC_URL` | Yes | - | Monad blockchain RPC endpoint |
| `MONAD_PRIVATE_KEY` | Yes* | - | Trading wallet private key (*can skip for simulation mode) |
| `OPENAI_API_KEY` | Yes | - | OpenAI API key for GPT-4o-mini |
| `MOLTBOOK_API_KEY` | No | - | Moltbook API key for social features |
| `MOLTBOOK_API_URL` | No | https://api.moltbook.xyz | Moltbook API endpoint |
| `MAX_POSITION_SIZE_USD` | No | 100 | Max USD per position |
| `STOP_LOSS_PERCENT` | No | 20 | Stop-loss trigger (%) |
| `TAKE_PROFIT_PERCENT` | No | 50 | Take-profit trigger (%) |
| `MIN_CONFIDENCE_SCORE` | No | 70 | Minimum score to trade (0-100) |

### Simulation Mode

For testing without real funds, you can run the agent in **simulation mode** by omitting `MONAD_PRIVATE_KEY`. The agent will generate mock trades and analyze real tokens without executing actual blockchain transactions.

---

## 📁 Project Structure

```
Sovereign-Scout-/
│
├── backend/                          # Agent Core & API Server
│   ├── src/
│   │   ├── scout_agent.ts            # Main orchestrator (30s loop)
│   │   ├── api_server.ts             # Express REST API
│   │   ├── token_discovery.ts        # Nad.fun blockchain monitoring
│   │   ├── sentiment_analyzer.ts     # GPT-4o-mini AI analysis
│   │   ├── investment_evaluator.ts   # Multi-factor scoring engine
│   │   ├── trade_executor.ts         # Trading execution logic
│   │   ├── risk_manager.ts           # Kelly Criterion + SL/TP
│   │   ├── portfolio_manager.ts      # Position tracking & persistence
│   │   ├── social_poster.ts          # Social media integration
│   │   ├── nadfun_client.ts          # Direct blockchain interactions (Viem)
│   │   ├── moltbook_client.ts        # Moltbook API integration
│   │   ├── moltbook_auth.ts          # Moltbook authentication
│   │   ├── logger.ts                 # Winston logging configuration
│   │   ├── config.ts                 # Environment configuration
│   │   └── types.ts                  # TypeScript type definitions
│   │
│   ├── scripts/
│   │   └── generate-wallet.ts        # Wallet generation utility
│   │
│   ├── logs/                         # Winston log files (date-based)
│   ├── portfolio.json                # Persistent portfolio state
│   ├── trades.json                   # Trade history
│   ├── launch_scout_token.ts         # $SCOUT token deployment script
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example                  # Environment template
│
└── frontend/
    └── dashboard/                    # Next.js Live Dashboard
        ├── app/
        │   ├── page.tsx              # Main dashboard
        │   ├── layout.tsx            # App layout
        │   ├── globals.css           # Global styles
        │   ├── wallet/               # Wallet management page
        │   │   └── page.tsx
        │   ├── analytics/            # Analytics dashboard
        │   │   └── page.tsx
        │   ├── strategies/           # Trading strategies page
        │   │   └── page.tsx
        │   ├── agent-config/         # Agent configuration page
        │   │   └── page.tsx
        │   └── components/
        │       ├── Header.tsx        # Wallet connection header
        │       ├── PortfolioCard.tsx # Holdings visualization
        │       ├── StatusCard.tsx    # Agent status display
        │       ├── TradesCard.tsx    # Trade history feed
        │       ├── SocialCard.tsx    # Social feed display
        │       ├── HoldingsTable.tsx # Holdings data table
        │       ├── ActivityFeed.tsx  # Activity log feed
        │       ├── LayoutWrapper.tsx # Layout wrapper
        │       └── ComingSoon.tsx    # Coming soon placeholder
        │
        ├── public/                   # Static assets
        ├── package.json
        ├── next.config.ts
        └── tailwind.config.js
```

---

## 📡 API Documentation

The backend exposes a REST API on `http://localhost:3001` for the dashboard and external integrations.

### Endpoints

#### `GET /api/portfolio`

Returns current portfolio holdings and balance.

**Response:**
```json
{
  "balance": "1000.50",
  "holdings": [
    {
      "tokenAddress": "0x...",
      "tokenName": "READ",
      "amount": "1000000",
      "entryPrice": "0.0001",
      "currentPrice": "0.00012",
      "pnl": "+20%",
      "purchaseTimestamp": 1706543210
    }
  ],
  "totalValue": "1120.50"
}
```

#### `GET /api/status`

Returns agent operational status and recent activity.

**Response:**
```json
{
  "isRunning": true,
  "cycleCount": 142,
  "lastUpdate": "2026-02-12T19:00:00Z",
  "recentTrades": [
    {
      "action": "BUY",
      "token": "READ",
      "amount": "1000000",
      "price": "0.0001",
      "timestamp": "2026-02-12T18:30:00Z",
      "txHash": "0x..."
    }
  ]
}
```

#### `GET /api/health`

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "uptime": 3600,
  "version": "1.0.0"
}
```

#### `GET /api/social`

Returns social feed with trade announcements in a Twitter-style format.

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "trade-1706543210",
        "timestamp": "2026-02-12T18:30:00Z",
        "text": "🚨 BUY 📈\n\n$READ (READ)\n\nAmount: 1000000.00 tokens\nPrice: 0.00010000 MON\n\n#Monad #Moltiverse #SovereignScout $READ",
        "type": "buy"
      }
    ]
  }
}
```

#### `GET /api/moltbook/profile`

Returns cached Moltbook profile for the agent (if configured).

**Response:**
```json
{
  "success": true,
  "data": {
    "agentId": "scout-agent",
    "reputation": 95,
    "totalTrades": 42
  }
}
```

---

## 🧪 Testing

### Running Tests

```bash
cd backend
npm test
```

### Manual Testing Checklist

- [ ] Agent discovers new tokens within 30 seconds of launch
- [ ] Sentiment analysis returns scores between 0-100
- [ ] BUY transactions execute successfully on mainnet
- [ ] SELL transactions execute successfully on mainnet
- [ ] Stop-loss triggers at -20% PnL
- [ ] Take-profit triggers at +50% PnL
- [ ] Dashboard displays real-time portfolio updates
- [ ] API endpoints return valid data
- [ ] Logs are written to `backend/logs/`

---

## 🔧 Troubleshooting

### Common Issues

#### Agent Not Discovering Tokens

**Problem:** No new tokens detected after 5+ minutes.

**Solution:**
1. Verify RPC endpoint is responding:
   ```bash
   curl -X POST https://infra.originstake.com/monad/evm \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
   ```
2. Check if nad.fun is actively launching tokens
3. Review logs in `backend/logs/scout-YYYY-MM-DD.log`

#### Transaction Failures

**Problem:** BUY/SELL transactions fail or revert.

**Solution:**
1. Ensure wallet has sufficient MONAD for gas fees
2. Verify `MONAD_PRIVATE_KEY` is correctly formatted (0x prefix)
3. Check RPC endpoint stability
4. Review gas price settings in `nadfun_client.ts`

#### Dashboard Not Updating

**Problem:** Frontend shows stale data or "Loading..."

**Solution:**
1. Verify API server is running on port 3001:
   ```bash
   curl http://localhost:3001/api/health
   ```
2. Check browser console for CORS or network errors
3. Restart the API server: `npm run start:api`

#### OpenAI API Errors

**Problem:** Sentiment analysis failing with 401/429 errors.

**Solution:**
1. Verify `OPENAI_API_KEY` is valid and has credits
2. Check OpenAI dashboard for rate limit status
3. Consider upgrading OpenAI plan for higher limits

### Getting Help

- **GitHub Issues**: [Report a bug](https://github.com/HACK3R-CRYPTO/Sovereign-Scout-/issues)
- **Documentation**: Review this README carefully
- **Logs**: Check `backend/logs/` for detailed error traces

---

## 🚀 Roadmap

### Phase 1: Community Features ✅
- [x] Launched $SCOUT token on nad.fun
- [ ] Enable LP revenue sharing for token holders
- [ ] Implement community governance features

### Phase 2: Multi-Agent System
- [ ] Deploy specialized sub-agents (Risk Analyst, Hype Scout, Trader)
- [ ] Implement consensus-based decision making
- [ ] Build agent reputation scoring system

### Phase 3: DAO Governance
- [ ] Token holder voting on risk parameters
- [ ] Decentralized treasury management
- [ ] Community-proposed trading strategies

### Phase 4: Scale & Expand
- [ ] Increase capital deployment on Monad Mainnet
- [ ] Establish partnerships with crypto VCs
- [ ] Expand to cross-chain token discovery

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/HACK3R-CRYPTO/Sovereign-Scout-.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, documented code
   - Follow existing TypeScript conventions
   - Add tests if applicable

4. **Commit Your Changes**
   ```bash
   git commit -m "Add: Your feature description"
   ```

5. **Push and Create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Contribution Guidelines

- Follow the existing code style and architecture
- Write clear commit messages
- Update documentation for new features
- Test thoroughly before submitting PR
- Be respectful and constructive in discussions

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Monad Foundation** - For building an incredible high-performance blockchain
- **Nad.fun Team** - For the innovative agent token platform and SDK
- **OpenAI** - For GPT-4 API enabling advanced sentiment analysis
- **Moltiverse Organizers** - For hosting this amazing hackathon and fostering innovation

---

## 📞 Contact & Links

- **GitHub Repository**: [HACK3R-CRYPTO/Sovereign-Scout-](https://github.com/HACK3R-CRYPTO/Sovereign-Scout-)
- **Token on Nad.fun**: [Trade $SCOUT](https://nad.fun/token/0xaD324baD55eD7f737a7b029B00c3568E56cC7777)
- **Report Issues**: [GitHub Issues](https://github.com/HACK3R-CRYPTO/Sovereign-Scout-/issues)

---

<div align="center">

**Built with 🤖 for the Moltiverse Hackathon 2026**

*Sovereign Scout: Where AI Meets Venture Capital on the Blockchain*

[![Star on GitHub](https://img.shields.io/github/stars/HACK3R-CRYPTO/Sovereign-Scout-?style=social)](https://github.com/HACK3R-CRYPTO/Sovereign-Scout-)

</div>
