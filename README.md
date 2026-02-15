<div align="center">

# 🔍 Sovereign Scout

**An AI-Powered Trading Tool for Monad Agent Tokens**

[![Status](https://img.shields.io/badge/Status-LIVE%20%26%20TRADING-success?style=for-the-badge)](https://nad.fun/token/0xaD324baD55eD7f737a7b029B00c3568E56cC7777)
[![Hackathon](https://img.shields.io/badge/Hackathon-Moltiverse-blueviolet?style=for-the-badge)](https://monad.xyz)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

An autonomous AI trading tool that discovers, analyzes, and trades agent tokens on Monad with **highly selective** AI-powered decision making, professional risk management, and transparent social updates.

**Built for**: Traders and investors who want automated, intelligent token discovery and execution  
**Key Feature**: Extremely selective AI that only buys exceptional tokens (8.0+ scores)

**Hackathon**: Moltiverse by Nad.fun & Monad  
**Track**: Agent+Token ($140K Prize Pool)  
**Status**: ✅ LIVE & TRADING ON MAINNET

[Quick Start](docs/QUICKSTART.md) • [Technical Docs](docs/TECHNICAL.md) • [AI Architecture](docs/AI.md) • [Report Issue](https://github.com/HACK3R-CRYPTO/Sovereign-Scout-/issues)

</div>

---

## 🎯 What It Does

- 🔍 **Discovers** new agent tokens on nad.fun in real-time
- 🧠 **Analyzes** sentiment using GPT-4o-mini AI
- 📊 **Evaluates** with multi-factor scoring (sentiment + liquidity + on-chain metrics)
- 🎯 **Highly Selective** - Only buys tokens scoring 7.5-8.0+ (top 5% quality)
- 💰 **Trades** automatically with proven BUY & SELL execution
- 🛡️ **Manages Risk** with stop-loss (-20%) and take-profit (+50%)
- 📈 **Tracks** portfolio with live Next.js dashboard

**Perfect for traders who want:**
- Automated 24/7 token discovery
- AI-powered quality filtering
- Hands-free execution
- Professional risk management

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Monad RPC access
- API keys (OpenAI, Gemini)
- **Wallet with MON balance** (for autonomous trading)

> **⚠️ SECURITY WARNING**  
> This bot requires your **wallet private key** to execute trades autonomously. Only use a dedicated trading wallet with limited funds. Never use your main wallet. The bot will have full access to execute transactions on your behalf.

### Installation

```bash
# Clone repository
git clone https://github.com/HACK3R-CRYPTO/Sovereign-Scout-.git
cd Sovereign-Scout-

# Install backend dependencies
cd backend
npm install
cp .env.example .env  # Configure your API keys

# Install frontend dependencies
cd ../frontend/dashboard
npm install

# Start the agent
cd ../../backend
npm run dev

# Start dashboard (new terminal)
cd frontend/dashboard
npm run dev
```

Visit `http://localhost:3000` to view the dashboard.

---

## 🎯 The $SCOUT Token

**Contract**: [`0xaD324baD55eD7f737a7b029B00c3568E56cC7777`](https://nad.fun/token/0xaD324baD55eD7f737a7b029B00c3568E56cC7777)  
**Network**: Monad Mainnet (Chain ID 143)  
**Trade**: [nad.fun](https://nad.fun/token/0xaD324baD55eD7f737a7b029B00c3568E56cC7777)

---

## 📚 Documentation

- **[Quick Start Guide](docs/QUICKSTART.md)** - 5-minute setup with wallet generation
- **[Technical Documentation](docs/TECHNICAL.md)** - Architecture, setup, API reference
- **[AI Architecture](docs/AI.md)** - Sentiment analysis, decision-making, AI integration
- **[SETUP.md](backend/SETUP.md)** - Quick setup guide
- **[MOLTBOOK_SETUP.md](backend/MOLTBOOK_SETUP.md)** - Social integration guide

---

## ✨ Key Features

### 🤖 Autonomous Intelligence
- **Highly Selective AI** - Only buys tokens scoring 8.0+ (strong) or 7.5+ (moderate)
- **GPT-4o-mini Analysis** - Deep sentiment evaluation of token quality
- **Multi-Factor Scoring** - Combines sentiment (40%), liquidity (25%), market cap (20%), age (15%)
- **30-Second Cycles** - Real-time monitoring and instant response
- **Pure Viem Integration** - Direct blockchain interaction optimized for Monad

### 💼 Risk Management
- Automatic stop-loss at -20%
- Automatic take-profit at +50%
- Position size limits (10% max)
- 72-hour max position age

### 📊 Live Dashboard
- Real-time portfolio tracking
- Twitter-style trade feed
- Complete transaction history
- Performance metrics

### 🔒 Production Ready
- Robust RPC handling
- Self-healing sync
- Full TypeScript type safety
- Comprehensive error handling

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SOVEREIGN SCOUT                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐    ┌──────────────┐   ┌───────────┐  │
│  │   Discovery  │───▶│  AI Analysis │──▶│  Trading  │  │
│  │   (Events)   │    │  (GPT-4o)    │   │  (Viem)   │  │
│  └──────────────┘    └──────────────┘   └───────────┘  │
│         │                    │                  │        │
│         └────────────────────┴──────────────────┘        │
│                          │                               │
│                   ┌──────▼──────┐                        │
│                   │  Dashboard  │                        │
│                   │  (Next.js)  │                        │
│                   └─────────────┘                        │
└─────────────────────────────────────────────────────────┘
```

See [Technical Documentation](docs/TECHNICAL.md) for detailed architecture.

---

## 📊 Live Performance

**Active Holdings**: READ, LOVELACE  
**Total Trades**: 15+ executed on mainnet  
**Win Rate**: Positive ROI with automated risk management  
**Uptime**: 24/7 autonomous operation

---

## �️ Tech Stack

**Backend**: TypeScript, Node.js, Viem, GPT-4o-mini  
**Frontend**: Next.js 15, React, TailwindCSS  
**Blockchain**: Monad Mainnet, nad.fun  
**AI**: OpenAI GPT-4o-mini, Google Gemini  
**Social**: Moltbook, Twitter API

---

## 🔐 Security

### Private Key Requirements

**This bot requires your wallet private key for autonomous trading.**

#### ⚠️ Critical Security Practices

1. **Use a Dedicated Wallet**
   - Create a new wallet ONLY for the bot
   - Never use your main wallet
   - Fund with limited amounts (1-5 MON for testing)

2. **Protect Your .env File**
   - Never commit `.env` to git (already in `.gitignore`)
   - Never share your `.env` file
   - Rotate keys if compromised

3. **Monitor Activity**
   - Check transactions: https://explorer.monad.xyz
   - Review bot logs regularly
   - Set up wallet alerts

**See [Technical Documentation](docs/TECHNICAL.md#-critical-private-key-setup) for detailed security setup.**

---

## 🤝 Contributing

Contributions welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## � Contact

**Project**: [Sovereign Scout](https://github.com/HACK3R-CRYPTO/Sovereign-Scout-)  
**Issues**: [GitHub Issues](https://github.com/HACK3R-CRYPTO/Sovereign-Scout-/issues)  
**Hackathon**: Moltiverse by Nad.fun & Monad

---

<div align="center">

**Built with ❤️ for the Moltiverse Hackathon**

</div>
