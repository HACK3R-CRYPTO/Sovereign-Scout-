# 🚀 Deploying Sovereign Scout Backend to Railway

Since we deleted the previous guide, here is how to deploy your backend to Railway.

## Step 1: Push Your Latest Code

Make sure all your changes (including the `start:prod` script) are pushed to GitHub:
```bash
git add .
git commit -m "chore: ready for deployment"
git push
```

## Step 2: Create Railway Project

1.  Go to [Railway.app](https://railway.video) and login.
2.  Click **"New Project"** -> **"Deploy from GitHub repo"**.
3.  Select your repo: `HACK3R-CRYPTO/Sovereign-Scout-`.

## Step 3: Configure Root Directory

**CRITICAL STEP**:
1.  Click on your project in Railway.
2.  Go to **Settings** -> **General** -> **Root Directory**.
3.  Change it to: `/backend`
4.  (This tells Railway to ignore the frontend folder and focus on the backend).

## Step 4: Configure Environment Variables

1.  Go to the **Variables** tab.
2.  Add these variables (copy from your local `.env`):
    *   `MONAD_RPC_URL`: `https://infra.originstake.com/monad/evm`
    *   `MONAD_PRIVATE_KEY`: (Your Private Key)
    *   `OPENAI_API_KEY`: (Your OpenAI Key)
    *   `PORT`: `3001`

## Step 5: Set Start Command

1.  Go to **Settings** -> **Build & Deploy**.
2.  Set **Start Command** to:
    ```bash
    npm install && npm run build && npm run start:prod
    ```

## Step 6: Deploy & Verify

1.  Railway will auto-deploy.
2.  Once green, click the generated URL (e.g., `https://sovereign-scout.up.railway.app`).
3.  Add `/api/status` to the end of the URL to check if it's alive.

---

## ❌ Troubleshooting "You must specify a workspaceId"

If you see this error in your terminal:
> `Error: You must specify a workspaceId to create a project`

It means your Railway CLI doesn't know where to put the project.

**Solution 1 (Recommended): Use the Website**
1.  Ignore the terminal.
2.  Go to [Railway Dashboard](https://railway.video/dashboard).
3.  Click **New Project** -> **Deploy from GitHub repo**.
4.  Pick your repo. It will work immediately.

**Solution 2 (If you MUST use CLI)**
1.  Run `railway login` (if not logged in).
2.  Run `railway link`.
3.  Select your project from the list.
4.  Then run `railway up` again.

---

**Note**: Your `portfolio.json` will reset on every deployment. This is expected behavior on Railway. The agent will auto-sync with the blockchain on startup.
