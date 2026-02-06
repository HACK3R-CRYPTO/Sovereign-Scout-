# Sovereign Scout - Demo Video Script 🎥

**Duration**: ~120 Seconds
**Goal**: Showcase the AI Agent's autonomy, real-time decision making, and the user-facing dashboard.

---

## Scene 1: Introduction (0:00 - 0:20)
**Visual**: Slide/Graphic with "Sovereign Scout: AI VC for Monad" logo.
**Voiceover**: 
"Welcome to Sovereign Scout, the first autonomous AI Venture Capital agent built on Monad. Unlike traditional bots that just snipe, Scout acts as an intelligent investor—analyzing sentiment, managing risk, and building a portfolio completely on its own."

## Scene 2: The Brain - Terminal View (0:20 - 0:50)
**Visual**: Screen recording of **Terminal 1** (`npm run start:scout`).
**Action**: 
- Show the "Agent Starting" log.
- Highlight a "Token Discovered" event.
- **Key Moment**: Pause on the "AI Analysis" log showing "GPT-4o Evaluation: Bullish".
**Voiceover**: 
"Here in the agent's core, you can see it scanning the Monad Mempool in real-time. It doesn't just buy random tokens. It uses GPT-4 to analyze social sentiment and on-chain metrics. Look here—it just discovered a new token, analyzed the 'hype factor', and decided to take a position."

## Scene 3: The Dashboard - Live Portfolio (0:50 - 1:10)
**Visual**: Switch to **Localhost:3000** (Dashboard).
**Action**: 
- Scroll through the "Recent Trades" list.
- Hover over the "Portfolio Value" chart.
**Voiceover**: 
"All this data is streamed live to the Scout Dashboard. LPs can track the fund's performance, see current holdings, and monitor every trade decision as it happens. The dashboard updates every 5 seconds, giving full transparency into the AI's operations."

## Scene 4: Risk Management & Execution (1:10 - 1:40)
**Visual**: Split screen: Terminal (Risk Manager log) + Dashboard (Stats Card).
**Action**: 
- Show a "Stop Loss Triggered" or "Take Profit" log in terminal.
- Show the trade appear on the dashboard.
**Voiceover**: 
"Crucially, Scout manages its own risk. It automatically sets stop-losses and position sizes based on its confidence score. It's not just checking price; it's managing a portfolio mathematically."

## Scene 5: Conclusion (1:40 - 2:00)
**Visual**: "Twitter/X" Mockup showing the Agent "tweeting" its trade.
**Voiceover**: 
"And finally, Scout is social. It publicly announces its moves to build a following. Sovereign Scout isn't just a bot; it's an on-chain entity. Live now on the Monad Testnet."

**Call to Action**: "Check out the repo and start scouting."

---

## Preparation Checklist
1. Clear `portfolio.json` to start fresh (optional).
2. Ensure `npm run start:api` is running to feed the dashboard.
3. Have 3-4 "mock" tokens appear in the discovery loop for visual variety.
