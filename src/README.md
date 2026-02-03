# Source Code Directory

This directory contains the core scout agent logic.

## Files

### `scout_agent.js`
Main orchestrator. Coordinates token discovery, analysis, and trading.

### `token_discovery.js`
Monitors nad.fun for new agent token launches.

### `sentiment_analyzer.js`
Analyzes social sentiment from Moltbook and Discord.

### `investment_evaluator.js`
Scores tokens (0-10) based on multiple factors and decides buy/hold/sell.

### `trade_executor.js`
Executes trades on Monad. Adapted from ChainSniper.

### `portfolio_manager.js`
Tracks holdings, calculates P&L, and manages rebalancing.

### `social_poster.js`
Posts investment decisions to Moltbook for transparency.

## Usage

```bash
# Start the scout agent
node src/scout_agent.js

# Run discovery standalone
node src/token_discovery.js

# Test sentiment analysis
node src/sentiment_analyzer.js --token 0x...
```
