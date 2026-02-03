# Sovereign Scout Development Task List

**NOTE**: This is a BACKUP project. Only use if Molti-Maker pivot is needed by Day 7.

## Phase 1: Setup & Core Agent (Day 1-2)
- [ ] Project initialization
  - [ ] Set up OpenClaw framework
  - [ ] Initialize Monad SDK
  - [ ] Configure nad.fun API
- [ ] Scout agent core
  - [ ] Create `src/scout_agent.js`
  - [ ] Implement main loop
  - [ ] Add logging

## Phase 2: Discovery & Analysis (Day 3-4)
- [ ] Token discovery
  - [ ] Create `src/token_discovery.js`
  - [ ] Integrate nad.fun API
  - [ ] Monitor new launches
- [ ] Sentiment analyzer
  - [ ] Create `src/sentiment_analyzer.js`
  - [ ] Integrate Moltbook API
  - [ ] Implement scoring algorithm

## Phase 3: Trading & Portfolio (Day 5-6)
- [ ] Investment evaluator
  - [ ] Create `src/investment_evaluator.js`
  - [ ] Implement composite scoring
  - [ ] Add buy/hold/sell logic
- [ ] Trade executor (from ChainSniper)
  - [ ] Copy ChainSniper trading code
  - [ ] Adapt for nad.fun
  - [ ] Add slippage protection
- [ ] Portfolio manager
  - [ ] Create `src/portfolio_manager.js`
  - [ ] Track holdings
  - [ ] Calculate P&L

## Phase 4: Social & Dashboard (Day 7-8)
- [ ] Social poster
  - [ ] Create `src/social_poster.js`
  - [ ] Integrate Moltbook
  - [ ] Post investment decisions
- [ ] Dashboard
  - [ ] Build Next.js frontend
  - [ ] Display portfolio
  - [ ] Show recent trades

## Phase 5: Demo & Submission (Day 9-10)
- [ ] Demo video
- [ ] Documentation
- [ ] Testing
- [ ] Submit

## Pivot Trigger
- [ ] If Molti-Maker fails by Day 7, activate this project
- [ ] Copy reusable code from Molti-Maker
- [ ] Focus on core features only
- [ ] Submit by Day 10
