# 🎬 Sovereign Scout: The Perfect Demo Script

**Target Audience**: Hackathon Judges & Investors
**Duration**: 2-3 Minutes
**Goal**: Prove the agent is **autonomous**, **intelligent**, and **real**.

---

## 🛠️ Step 0: Pre-Demo Setup (Do this 5 mins before)

1.  **Clear the decks**:
    ```bash
    # In backend/
    rm logs/* 
    # Optional: Backup your real portfolio.json if you want a blank slate, 
    # BUT for the best demo, keep your current 'READ' and 'LOVELACE' holdings 
    # to show the "Monitoring" feature immediately.
    ```

2.  **Open 3 Terminal Tabs** (Zoom in for readability! CMD +):
    *   **Tab 1 (API)**: `npm run start:api`
    *   **Tab 2 (Agent)**: `npm run start:scout` (Leave this running to build up logs)
    *   **Tab 3 (Frontend)**: `npm run dev`

3.  **Open Browser**:
    *   Go to date `http://localhost:3000`
    *   Open `nad.fun` in a separate tab to show the "Real" tokens.

---

## 🎥 Scene 1: The Hook - "Meet the Scout" (0:00 - 0:45)

**Visual**: **The Dashboard (http://localhost:3000)**
*   *Action*: Scroll slowly down the page. Hover over the "Status: Active" card.

**Script**:
> "Welcome to Sovereign Scout. The problem with crypto agents today is they are either blindly sniping or just chatting on Twitter.
>
> Sovereign Scout is different. It is a fully autonomous **Hedge Fund Agent** active right now on the **Monad Mainnet**.
>
> What you are seeing here is the live command center. Unlike a static wallet, this dashboard streams the agent's brain in real-time. It monitors the blockchain 24/7 so I don't have to."

---

## 🧠 Scene 2: The Brain - "Intelligence Over Speed" (0:45 - 1:30)

**Visual**: **Terminal 2 (Agent Logs)**
*   *Action*: Switch to the terminal. Highlight a block of logs where it analyzes a token (Blue/Cyan text).

**Script**:
> "Let's look under the hood. Most bots just buy anything that moves. Scout uses **GPT-4** to actually *think*.
>
> Look at this log here [Highlight 'Sentiment Analysis'].
> The agent discovered a new token. Instead of just buying, it read the metadata and analyzed the creator's intent.
>
> It assigned a **Confidence Score of 4.7/10**.
> Evaluating Risk... Checking Liquidity...
> Only when the math checks out does it pull the trigger. It's not gambling; it's executing a strategy."

---

## 💰 Scene 3: The Proof - "Real Execution" (1:30 - 2:15)

**Visual**: **Back to Dashboard -> 'Recent Trades' Section**
*   *Action*: Point to the latest **BUY** order for `READ` or `LOVELACE`.
*   *Action*: Click the "Tx" link (if clickable) or copy the hash to a Monad Explorer tab.

**Script**:
> "And this isn't a simulation. These are real transactions on Monad.
>
> Here you can see it bought **$READ** tokens automatically.
> It managed the gas, interacted with the bonding curve contract directly, and updated my portfolio.
>
> [Point to 'Active Holdings' card]
> It is currently managing these positions. If `READ` goes up 50%, it sells. If it drops 20%, it cuts losses. I haven't touched my keyboard once."

---

## 🚀 Scene 4: The Closing - "The Future" (2:15 - End)

**Visual**: **The 'Agent Status' Card (Pulse animation)**

**Script**:
> "Sovereign Scout solves the biggest bottleneck in crypto: Attention.
> While we sleep, Scout is hunting.
>
> Built with Monad's speed and OpenAI's intelligence, this is the future of decentralized finance.
>
> Thank you."

---

## 🌟 Pro-Tips for the Demo

*   **If no new tokens appear**: "As you can see, the market is quiet right now. The agent is smart enough *not* to force trades. It is currently monitoring our existing bag of READ tokens for exit opportunities."
*   **If it buys during the demo**: "Boom! It just found something live! Look at that log!" (This is the jackpot moment).
*   **The "Secret Weapon"**: If asked about the tech, mention "We reverse-engineered the bonding curve contract because the SDK wasn't fast enough. We are interacting directly with the chain." (Judges love this).
