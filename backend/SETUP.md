# Sovereign Scout - Full Stack Setup Guide 🚀

## Overview
Sovereign Scout is the first AI Venture Capital Fund for Agent Tokens on Monad. This repository contains the complete full-stack implementation:

- **Backend Agent**: Autonomous trading bot (TypeScript/Node.js)
- **API Server**: Data provider for the dashboard
- **Frontend Dashboard**: Real-time interface (Next.js 15)

## 📦 Prerequisites
- Node.js v18+
- npm or yarn
- Monad Wallet Private Key (optional for simulation mode)
- OpenAI API Key (for sentiment analysis)

## 🚀 Quick Start (All-in-One)

You will need three terminal windows to run the full stack.

### 1. Setup Backend & API
Navigate to the `backend` directory:
```bash
cd backend
npm install
cp .env.example .env # Configure your keys here
```

**Terminal 1 (Agent):**
Start the autonomous scout agent:
```bash
npm run start:scout
```

**Terminal 2 (API Server):**
Start the API server to feed data to the dashboard:
```bash
npm run start:api
```

### 2. Setup Frontend Dashboard
**Terminal 3 (Dashboard):**
Navigate to the `frontend/dashboard` directory:
```bash
cd frontend/dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the Sovereign Scout Dashboard.

---

## 🛠 Configuration

### Environment Variables (`backend/.env`)
```env
# Blockchain
MONAD_RPC_URL=https://testnet-rpc.monad.xyz/
PRIVATE_KEY=your_private_key_here

# AI & Social
OPENAI_API_KEY=sk-...
TWITTER_API_KEY=...

# Risk Management
MAX_POSITION_SIZE_USD=100
STOP_LOSS_PERCENT=20
TAKE_PROFIT_PERCENT=50
```

## 🏗 Project Structure

```
monadagent/
├── backend/                 # Agent Logic & API
│   ├── src/
│   │   ├── scout_agent.ts   # Core Logic
│   │   ├── api_server.ts    # Dashboard API
│   │   └── ...modules
│   └── package.json
│
└── frontend/
    └── dashboard/           # Next.js UI
        ├── app/             # App Router
        ├── components/      # UI Components
        └── package.json
```

## 📜 Commands Reference

### Backend (`/backend`)
- `npm run dev`: Run agent with hot-reload
- `npm run start:scout`: Run agent (production)
- `npm run start:api`: Run API server
- `npm run build`: Compile TypeScript

### Frontend (`/frontend/dashboard`)
- `npm run dev`: Start dev server
- `npm run build`: Build for production
- `npm run start`: Start production server

## 🧪 Simulation Mode
If no private key is provided in `.env`, the agent automatically runs in **Simulation Mode**, allowing you to test trading logic and dashboard updates without spending real funds.

Happy Scouting! 🦅
