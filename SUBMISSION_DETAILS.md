# Sovereign Scout - Hackathon Submission Details 🏆

## Project Name
**Sovereign Scout** - Autonomous AI VC Agent

## One-Line Pitch
An autonomous AI agent that discovers, analyzes, and trades meme tokens on Monad, with a real-time LP dashboard and transparent social reasoning.

## Project Description
Sovereign Scout is an experiment in "smarter" on-chain agency. While most trading bots rely solely on price action, Scout mimics a human Venture Capitalist's workflow:

1.  **Discovery**: Listens to the Monad mempool for new token launches.
2.  **Due Diligence**: Uses **GPT-4o** to analyze token names, social sentiment, and contract safety (rug check).
3.  **Investment Committee**: Assigns a "Confidence Score" (0-100%).
4.  **Execution**: Buys tokens via the **nad.fun SDK**, sizing positions based on the Kelly Criterion.
5.  **Risk Management**: Automatically monitors PnL, executing stop-losses (-20%) and take-profits (+50%).
6.  **Transparency**: live-streams all data to a Next.js dashboard and "tweets" its thesis for every trade.

## Technical Architecture
-   **Agent Core**: TypeScript / Node.js
-   **AI Engine**: OpenAI GPT-4o-mini (Sentiment Analysis)
-   **Blockchain**: Monad Testnet / Nad.fun SDK
-   **Frontend**: Next.js 15 (App Router) + Tailwind CSS
-   **Data Stream**: Express API Server (Polled by frontend)

## What We Built
-   **Full-Stack Agent**: Not just a script, but a complete platform with a UI.
-   **Simulation Engine**: Allows the agent to be "backtested" or run in demo mode without private keys.
-   **Sentiment Analysis Module**: A custom heuristic + AI pipeline to grade "meme-ability".

## Future Roadmap (Post-Hackathon)
-   **Multi-Agent Swarm**: Specialized agents (Risk Analyst, Hype Scout, Trader) voting on decisions.
-   **DAO Governance**:Allowing token holders to vote on risk parameters.
-   **Mainnet Launch**: Deploying real capital on Monad Mainnet.

## Link to Demo Video
[Insert Video Link Here]

## Link to Live Site / Repository
-   **Live API**: https://sovereign-scout-production.up.railway.app/api/status
-   **GitHub Repo**: https://github.com/HACK3R-CRYPTO/Sovereign-Scout-
