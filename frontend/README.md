# WorkSphere Frontend

Professional role-aware task management dashboard UI for the WorkSphere Django backend. Built with React, Vite, and Tailwind CSS.

## Tech stack

- React 19 (JSX)
- Vite
- Axios for HTTP
- Tailwind CSS
- Lucide React (icons)
- Recharts (dashboard and reports charts)
- React Hot Toast (notifications)

## Install

```bash
npm install
```

Copy environment defaults:

```bash
cp .env.example .env
```

Edit `.env` if your API host or port differs.

## Run the frontend

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Configure the API (no hardcoded URLs in code)

Everything goes through `src/lib/api.js` using **environment variables only**. Copy `.env.example` to `.env`.

**Direct to Django** (browser calls API host; backend must allow your origin via `CORS_ALLOWED_ORIGINS`):

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

**Vite dev proxy** (recommended for `npm run dev` — same-origin requests, no browser CORS):

```
VITE_API_BASE_URL=
VITE_API_PROXY_TARGET=http://127.0.0.1:8000
```

`vite.config.js` proxies `/api` and `/accounts` to `VITE_API_PROXY_TARGET`.

Production / preview builds usually set **`VITE_API_BASE_URL`** to your deployed API origin (or leave relative only if the SPA and API share an origin).

## Optional local dev API token (not a login UI)

To call protected endpoints while developing, you can paste a JWT **access** token from `POST /accounts/login/` into `.env`:

```
VITE_DEV_BEARER_TOKEN=your_access_token_here
```

Axios adds `Authorization: Bearer …` only when `npm run dev` is running (`import.meta.env.DEV` is true). **Production builds (`npm run build`) never read this variable**, so it is not a substitute for a real auth strategy in deployed apps.

## Navigation (no React Router)

This app does **not** use React Router or browser routes such as `/dashboard`. Navigation is driven by React state (`activePage`) so the sidebar switches views without changing the URL.

## Authentication (JWT sign-in)

Use **Sign up** to register (`POST /accounts/register/`) as an **employee**, or **Sign in** with an existing account. The app POSTs to `/accounts/login/`, stores **access** and **refresh** in `localStorage`, and sends `Authorization: Bearer <access>`. Expired access tokens are refreshed via `/accounts/refresh/` when possible.

Optional **`VITE_DEV_BEARER_TOKEN`** still works in **`npm run dev`** only if you prefer env-based tokens.

See `FRONTEND_API_NOTES.md` for CORS, proxy, and endpoint details.

## Data sources (no hardcoded domain data)

Tasks, users, and summaries are loaded only from the live backend. There are no mock JSON files, fake users, or fabricated dashboard numbers in production views.

## Backend (reference commands)

From the repository root:

```bash
cd backend
pip install -r requirements.txt
cd load_roles
python manage.py migrate
python manage.py runserver
```

Reinstall after pulling: `pip install -r requirements.txt` (includes **`django-cors-headers`** for browser integration).

Optional backend env vars are documented in `backend/load_roles/.env.example` (`CORS_ALLOWED_ORIGINS`, `DJANGO_ALLOWED_HOSTS`).

Match the frontend `.env` mode above so the SPA reaches Django on the host/port you run.

## Additional documentation

- `FRONTEND_API_NOTES.md` — endpoint map, auth behavior, CORS notes, and known backend observations.
