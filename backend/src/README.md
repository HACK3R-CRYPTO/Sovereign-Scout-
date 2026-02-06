# Backend Source Code

This directory contains the core autonomous trading agent logic for Monad mainnet.

## Core Modules

### `scout_agent.ts`
**Main orchestrator** - Coordinates the autonomous trading loop:
- 30-second discovery cycles
- Real-time blockchain event monitoring
- Integrates all modules (discovery → analysis → evaluation → execution)
- Risk monitoring and portfolio rebalancing
- Moltbook announcements

### `nadfun_client.ts`
**Blockchain integration** - Pure viem implementation:
- Monad mainnet connection (Chain 143)
- CurveCreate event monitoring with indexed fields
- BondingCurveRouter integration (0x6F6B8F1a20703309951a5127c45B49b1CD981A22)
- Real transaction execution with proper gas handling
- Wallet management and balance tracking

### `token_discovery.ts`
**Token discovery** - Monitors nad.fun for new launches:
- Blockchain event parsing (CurveCreate events)
- Pool address extraction from indexed event fields
- Token metadata retrieval (name, symbol, creator)
- Deduplication and state management

### `sentiment_analyzer.ts`
**AI analysis** - GPT-4o-mini sentiment evaluation:
- Creator intent analysis from token metadata
- Social signal detection (Moltbook, community)
- Sentiment scoring (0-10 scale)
- Confidence calculation for investment decisions

### `investment_evaluator.ts`
**Investment engine** - Multi-factor scoring and decision making:
- **Production Thresholds**: score ≥7.0 (high confidence), ≥5.5 (moderate)
- Multi-factor scoring: sentiment (40%) + liquidity (30%) + on-chain (30%)
- Risk assessment and confidence calculation
- BUY/SELL/HOLD decision logic

### `trade_executor.ts`
**Trade execution** - Real blockchain transactions:
- BondingCurveRouter buy/sell calls (not individual pools)
- Transaction signing and submission via viem
- Gas estimation and deadline management
- Transaction confirmation and error handling
- 0.5 MON per trade configuration

### `portfolio_manager.ts`
**Portfolio tracking** - State persistence and P&L:
- Holdings tracking in portfolio.json
- Average price calculation
- Total value and available balance
- Position size management
- Trade history logging

### `risk_manager.ts`
**Risk management** - Professional safeguards:
- Stop-loss (-20%) and take-profit (+50%) monitoring
- Portfolio diversification checks
- Maximum position limits (10% per token)
- Drawdown tracking and circuit breakers
- Rebalancing recommendations

### `social_poster.ts`
**Transparency layer** - Public investment thesis:
- Moltbook integration for trade announcements
- Investment reasoning publication
- Community engagement tracking

### `moltbook_client.ts`
**Agent identity** - Universal AI agent system:
- Agent registration and reputation
- Cross-platform identity
- Social credential verification

## Configuration

### `config.ts`
Environment configuration and validation:
- Network settings (mainnet/testnet)
- API keys (OpenAI, Monad RPC)
- Contract addresses
- Trading parameters

### `types.ts`
TypeScript interfaces and types for type safety throughout the system.

## Usage

```bash
# Start the autonomous scout agent
npm run start:scout

# Start the API server
npm run start:api

# Generate a new wallet
npx ts-node scripts/generate-wallet.ts
```
