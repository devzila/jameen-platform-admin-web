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

Use the base URL of your API (no trailing slash). The browser calls this origin directly, so the API must allow CORS from the Next.js origin (default `http://localhost:3001` if you run `next dev -p 3001`, or `http://localhost:3000` if the API is elsewhere and you run Next on another port).

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

## Production deployment

This app is configured with **`output: 'standalone'`** in [`next.config.js`](next.config.js), which produces a minimal Node server under `.next/standalone`.

### 1. Build

```bash
npm ci
npm run build
```

Ensure `NEXT_PUBLIC_API_URL` is set at **build time** (it is inlined into the client bundle):

```bash
NEXT_PUBLIC_API_URL=https://api.example.com npm run build
```

### 2. Run with Node (standalone)

After build, copy static assets next to the standalone server (Next does not always copy them automatically depending on version/setup):

```bash
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

cd .next/standalone
PORT=3000 NODE_ENV=production node server.js
```

### 3. Docker (example)

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

Build & run:

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.example.com -t platform-admin-web .
docker run -p 3000:3000 platform-admin-web
```

### 4. Vercel

1. Import the repo into Vercel.
2. Set environment variable `NEXT_PUBLIC_API_URL` to your API base URL.
3. Deploy. Framework preset: **Next.js**.

`standalone` output is fine on Vercel; Vercel uses its own Next runtime and ignores the local `server.js` packaging.

## Project structure (high level)

```
app/                  # Next.js App Router pages & layouts
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

This project previously used CRA (`react-scripts`) and `react-router-dom`. It now uses Next.js App Router. Old CRA entrypoints under `src/index.js` / `src/layouts/Admin.js` are unused and can be removed safely after you confirm the Next app.
