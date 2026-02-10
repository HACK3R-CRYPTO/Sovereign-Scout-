# 🚀 Deploying Sovereign Scout Backend to Railway

Railway is the perfect place to host this because we need **two processes** running simultaneously:
1.  **API Server** (for the dashboard)
2.  **Scout Agent** (the background loop)

## Step 1: Prepare the Project

1.  **Update `package.json`**:
    We need a single command to start BOTH processes in production. We will use `concurrently` (which is already installed) or a simple script.

    Add this to `backend/package.json` scripts:
    ```json
    "start:prod": "concurrently \"npm run start:api\" \"npm run start:scout\""
    ```

2.  **Commit Changes**:
    ```bash
    git add .
    git commit -m "chore: add start:prod script for railway"
    git push
    ```

## Step 2: Create Railway Project

1.  Go to [Railway.app](https://railway.video) and login/signup.
2.  Click **"New Project"** -> **"Deploy from GitHub repo"**.
3.  Select your repo: `HACK3R-CRYPTO/Sovereign-Scout-`.
4.  **Important**: Railway might try to deploy the "Root". We need it to deploy the `backend` folder.
    *   Go to **Settings** -> **General** -> **Root Directory**.
    *   Change it to: `/backend`

## Step 3: Configure Variables (The Secret Sauce)

1.  Go to the **Variables** tab.
2.  Add ALL variables from your local `.env` file:
    *   `MONAD_RPC_URL`: `https://infra.originstake.com/monad/evm`
    *   `MONAD_PRIVATE_KEY`: (Paste your key)
    *   `OPENAI_API_KEY`: (Paste your key)
    *   `PORT`: `3001` (Or let Railway assign one, but commonly 3000/8080)

## Step 4: Set Start Command

1.  Go to **Settings** -> **Build & Deploy**.
2.  **Start Command**:
    ```bash
    npm install && npm run build && npm run start:prod
    ```
    *(Note: If you don't have a build step, just `npm install && npm run start:prod`)*

## Step 5: Verify Deployment

1.  Click the **URL** Railway gives you (e.g., `https://sovereign-scout-production.up.railway.app`).
2.  Add `/api/status` to the end.
3.  If you see the JSON status, **IT IS LIVE!** 🚀

---

## ⚠️ Important Note on Persistence

Railway restarts ephemeral filesystems.
*   **Problem**: `portfolio.json` will reset on every deploy.
*   **Solution**: Since we already implemented **Self-Healing Sync**, this is FINE! The agent will just read the blockchain and rebuild the portfolio automatically on startup.
