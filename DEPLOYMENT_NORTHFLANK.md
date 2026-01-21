# Deploying to Northflank

This guide outlines the steps to deploy your Anonym application to Northflank.

## Prerequisites

1.  **Git Repository**: Ensure your code is pushed to a remote repository (GitHub, GitLab, or Bitbucket) that Northflank can access.
2.  **Account**: You need a [Northflank account](https://northflank.com/).
3.  **Supabase Credentials**: Have your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` ready from your `.env.local` file.

## Step 1: Prepare the Code (Already Done)
We have already updated `server.js` to:
*   Use `process.env.PORT` instead of a hardcoded 3000.
*   Use `process.env.REDIS_URL` to connect to the Northflank Redis addon.

**Action**: Commit and push these changes to your repository.
```bash
git add server.js
git commit -m "Update server for production deployment"
git push
```

## Step 2: Create a Project in Northflank
1.  Log in to the Northflank Dashboard.
2.  Click **Create New** -> **Project**.
3.  Name it `anonym-prod` (or similar) and select your preferred region.
4.  Click **Create Project**.

## Step 3: Create a Redis Database
The app requires Redis for rate limiting and session management.
1.  In your new project, click **Create New** -> **Addon**.
2.  Select **Redis**.
3.  Name it `redis-db`.
4.  Choose the **Development** plan (it's free/cheaper for testing) or **Production**.
5.  Click **Create Addon**.
6.  Once created, click on the `redis-db` addon to view its details.
7.  Find the **Connection Details** section. Look for the `REDIS_URL` or a connection string (e.g., `redis://:password@host:port`). You will need this for the web service.
    *   *Tip: Northflank can also auto-inject this if you link them, but manual setup is clearer.*

## Step 4: Deploy the Web Service
1.  Go back to your Project Dashboard.
2.  Click **Create New** -> **Service**.
3.  Select **Combined Service** (Build & Deploy).
4.  **Service Type**: Select **Web Server**.
5.  **Repository**:
    *   Link your Git account if not already done.
    *   Select the `anonym` repository and the `main` branch.
6.  **Build Options**:
    *   **Build Type**: `Buildpack` (Recommended).
    *   **Language**: `Node.js`.
    *   Northflank will automatically detect `package.json`.
7.  **Runtime Environment** (Crucial Step):
    *   Go to the **Environment Variables** section.
    *   Add the following variables:
        *   `NEXT_PUBLIC_SUPABASE_URL`: (Paste your value from `.env.local`)
        *   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`: (Paste your value from `.env.local`)
        *   `REDIS_URL`: (Paste the Redis Connection String from Step 3. Usually looks like `redis://...`)
        *   `NODE_ENV`: `production`
    *   *Note: If you linked the Redis addon, `REDIS_URL` might be available as a secret automatically, usually named `REDIS_SRV_CONNECTION_STRING` or similar. Check the "Linked Addons" tab if preferred.*
8.  **Networking**:
    *   **Port**: `3000` (The app listens on this internal port).
    *   **Protocol**: `HTTP`.
    *   Tick **Publicly accessible** to get a `.northflank.app` domain.
9.  **Resources**:
    *   Choose a plan (e.g., **nf-compute-10** for a small app).
10. Click **Create Service**.

## Step 5: Verify Deployment
1.  Northflank will start the **Build** phase. It will run `npm install` and `npm run build`.
2.  Once built, it will start the **Deployment**.
3.  Check the **Logs** tab. You should see:
    ```
    > Server Ready on http://localhost:3000 (Ed25519 Mode)
    ```
4.  Click the **Open App** button (top right) or the generated URL.
5.  Test the WebSocket connection by opening the app.

## Troubleshooting
*   **Build Fails**: Check if `npm run build` works locally. Ensure `next build` is in your `package.json`.
*   **App Crash**: Check the **Logs**.
    *   If "Redis Error", check your `REDIS_URL`.
    *   If "Port in use" (unlikely in container), check networking config.
