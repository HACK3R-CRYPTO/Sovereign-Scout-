# 🏆 Enter the Moltiverse - Submission Answers

Here are the **exact** answers to copy-paste into the submission form.

---

## 👥 Team Information

**Team Name**:
> Sovereign Scout (or your preferred team name)

**Team Size**:
> **A (1)** (Assuming you are solo, select based on your actual team)

---

## 📝 Project Information

**Which track are you submitting for?**
> **A (Agent + Token)**

**Project Title**:
> **Sovereign Scout**

**Project Description**:
> **The First Autonomous AI Venture Capital Agent on Monad.**
>
> Sovereign Scout is a fully autonomous on-chain agent that acts as a hedge fund manager. It monitors the Monad blockchain in real-time to discover new token launches on nad.fun.
>
> Unlike simple sniper bots, Scout uses **GPT-4o-mini** to analyze the social sentiment and "vibe" of a token's creator. It combines this AI insight with on-chain metrics (liquidity, volume) to make calculated investment decisions.
>
> It features a professional-grade Risk Management engine utilizing the **Kelly Criterion**, automatic Stop-Loss (-20%), and Take-Profit (+50%) mechanisms. Users can watch the agent work live through a comprehensive Next.js dashboard that streams its "thought process" and portfolio performance in real-time.

**Describe your agent's capabilities**:
> 1.  **Autonomous Discovery**: Listens to `CurveCreate` events on Monad Mainnet to find new tokens instantly.
> 2.  **AI Due Diligence**: Uses LLMs to analyze token metadata, names, and ticker symbols for "rug pull" indicators vs. viral potential.
> 3.  **Algorithmic Trading**: Executes buy/sell orders directly via the Bonding Curve contract (bypassing slow UIs).
> 4.  **Risk Management**: Automatically manages position sizes and exits losing trades to preserve capital.
> 5.  **Self-Healing State**: Reconstructs its portfolio from on-chain history if the server restarts.
> 6.  **Transparency**: Streams all logs and decisions to a public dashboard.

**Monad Integration (How does your agent leverage Monad?)**:
> Sovereign Scout is built specifically for Monad's high-throughput environment.
>
> 1.  **Real-Time Event Listening**: It leverages Monad's 1-second block times to ingest and process `CurveCreate` events instantly, allowing it to "snipe" efficiently.
> 2.  **Direct Contract Interaction**: The agent interacts directly with the **Nad.fun Bonding Curve** contracts deployed on Monad, conducting complex multicall-like operations for analysis and trading.
> 3.  **Low-Cost Frequency**: Monad's low gas fees enable the agent to perform continuous "heartbeat" checks (every 30 seconds) and micro-rebalancing transactions that would be cost-prohibitive on other chains.

**Project Github Repo**:
> https://github.com/HACK3R-CRYPTO/Sovereign-Scout-

**2-Min Demo Video Link**:
> *[Paste your Loom/YouTube link here once recorded]*

**Token Contract Address**:
> `0xaD324baD55eD7f737a7b029B00c3568E56cC7777`

**Link to deployed app**:
> *[Paste your Railway URL here, e.g., https://sovereign-scout-production.up.railway.app]*

**Tweet link**:
> *[Paste your tweet link here]*
> *Draft Tweet:* "Introducing Sovereign Scout: The first AI VC Agent on @monad_xyz. It hunts, it thinks, it trades. 🤖💸 Built for the Moltiverse Hackathon. [Link to Video/Github]"

**[Optional] Agent Moltbook Link**:
> *[Leave blank if not set up]*

**[Optional] Associated Addresses**:
> `0xa91D5A0a64ED5eeF11c4359C4631279695A338ef` (The Agent's Wallet)
