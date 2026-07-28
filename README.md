# Platform Admin Web (Next.js)

Admin console for managing Jameen platform tenants: companies, users, subscriptions, invoice templates, invoice runs, and login sessions.

## Requirements

- **Node.js 20+**
- Access to the Platform Admin API (see `NEXT_PUBLIC_API_URL`)

## Local development

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment**

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Use the base URL of your API (no trailing slash). The browser calls this origin directly, so the API must allow CORS from your Next.js origin.

> Tip: if the API already uses port `3000`, run the admin UI on another port:
>
> ```bash
> npm run dev -- -p 3001
> ```

3. **Start the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port you chose).

4. **Sign in** with a platform admin account against  
   `POST {NEXT_PUBLIC_API_URL}/v1/platform_admin/auth/session`.

### Useful scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm start` | Serve the production build (`next start`) |
| `npm run lint` | ESLint |

## Production deployment (Netlify)

This app is deployed from **GitHub `main`** to **[Netlify](https://app.netlify.com)** using Next.js (not Create React App).

After the CRA → Next.js migration, Netlify must **not** publish the old CRA `build/` folder. That is why deploys fail with:

`Deploy directory 'build' does not exist`

### One-time Netlify site settings

In [app.netlify.com](https://app.netlify.com) → your site → **Site configuration**:

#### 1. Build & deploy

| Setting | Value |
|---|---|
| **Build command** | `npm run build` |
| **Publish directory** | `.next` (or clear the UI field and rely on [`netlify.toml`](netlify.toml)) |
| **Base directory** | *(leave empty / repo root)* |

Do **not** use:

- Publish directory: `build` (CRA)
- Build command: `CI= npm run build` with CRA assumptions

This repo includes [`netlify.toml`](netlify.toml) with:

- `command = "npm run build"`
- `publish = ".next"`
- `@netlify/plugin-nextjs` (required for Next.js App Router on Netlify)
- `NODE_VERSION = "20"`

If UI settings conflict with `netlify.toml`, prefer the file (or clear the outdated UI publish path).

#### 2. Environment variables

Under **Environment variables**, set for **Production** (and Preview if needed):

| Key | Example | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://api.jameen.com` | **Required.** No trailing slash. Inlined at build time. |
| `NODE_VERSION` | `20` | Optional if already set in `netlify.toml` |

Remove or stop using the old CRA variables:

- `REACT_APP_API_URL` → replace with `NEXT_PUBLIC_API_URL`
- `GENERATE_SOURCEMAP` → optional / unused by Next

After changing env vars, **trigger a new deploy** (Clear cache and deploy site is safest).

#### 3. Node version

Use Node **20** (set in `netlify.toml`). In UI: **Build settings** → **Dependency management** → Node version `20` if needed.

### Auto deploy from GitHub

1. Site is linked to the GitHub repo.
2. **Production branch**: `main`.
3. Push to `main` → Netlify runs `npm run build` + Next.js plugin → deploy.

```bash
git add .
git commit -m "Configure Netlify for Next.js"
git push origin main
```

### Fix checklist for the current error

1. Publish directory is still `build` → change to `.next` (or clear UI and use `netlify.toml`).
2. Install deps so the plugin is present: `npm install` (includes `@netlify/plugin-nextjs`).
3. Set `NEXT_PUBLIC_API_URL` in Netlify (not `REACT_APP_API_URL`).
4. Redeploy with cleared cache.

### Verify a successful Netlify build log

You should see the Next.js plugin run and **no** message about missing `build/`. The site should serve routes like `/login` and `/companies`.

---

## Optional: Docker / self-hosted Node

For non-Netlify hosts, builds outside Netlify still use `output: "standalone"` (see [`next.config.js`](next.config.js)).

```bash
NEXT_PUBLIC_API_URL=https://api.example.com npm run build
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
cd .next/standalone && PORT=3000 node server.js
```

A sample [`Dockerfile`](Dockerfile) is included for container deploys.

## Project structure (high level)

```
app/                  # Next.js App Router pages & layouts
netlify.toml          # Netlify build + Next.js plugin
src/
  components/         # Shared UI, Sidebar, AdminShell
  contexts/           # Auth provider
  hooks/useApi.js     # API client hook used by screens
  lib/api.js          # fetch helpers
  views/              # Screen components (client)
  assets/             # SCSS / images / CSS
```

## Auth notes

- After login, the API token is stored in `localStorage` as `platform_token`.
- Authenticated requests send `Authorization: <token>`.
- Unauthenticated users are redirected to `/login`.

## Migrated from Create React App

This project previously used CRA (`react-scripts`) and published static files to `build/`. It now uses **Next.js App Router**. Netlify must use `@netlify/plugin-nextjs` and `NEXT_PUBLIC_API_URL` instead of the old CRA publish directory and `REACT_APP_*` env vars.
