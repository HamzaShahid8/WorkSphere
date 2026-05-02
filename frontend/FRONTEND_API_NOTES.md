# WorkSphere frontend — API integration notes

This document records how the React app talks to the Django REST Framework backend and how to run full-stack locally **without hardcoding hosts or ports in application source**.

## Frontend API base URL (`VITE_API_BASE_URL`)

All Axios paths live under `src/services/` and use `src/lib/api.js`. The API origin comes **only** from environment variables.

| Mode | `.env` | Behavior |
|------|--------|----------|
| **Direct** | `VITE_API_BASE_URL=http://127.0.0.1:8000` | Browser calls Django directly; backend **must** allow your Vite origin via `CORS_ALLOWED_ORIGINS`. |
| **Proxied (dev)** | `VITE_API_BASE_URL=` (empty) | Requests are same-origin to the Vite dev server; `vite.config.js` proxies `/api` and `/accounts` to `VITE_API_PROXY_TARGET` (default `http://127.0.0.1:8000`). No browser CORS issue for those routes in dev. |

Override proxy target only via `.env`:

```
VITE_API_PROXY_TARGET=http://127.0.0.1:8000
```

## Backend CORS (browser → Django)

The backend uses **`django-cors-headers`**. Allowed origins are configurable via environment variable (comma-separated):

```
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Defaults in `load_roles/settings.py` include common Vite dev and preview ports if unset. See `backend/load_roles/.env.example` for optional variables (`CORS_ALLOWED_ORIGINS`, `DJANGO_ALLOWED_HOSTS`).

## Confirmed API endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/task/` | List tasks (scoped by backend role rules) |
| GET | `/api/task/:id/` | Task detail |
| POST | `/api/task/` | Create task (manager-only on backend) |
| PATCH | `/api/task/:id/` | Partial update (e.g. status) |
| DELETE | `/api/task/:id/` | Delete task |
| GET | `/api/task/summary/` | Aggregated counts by status |
| GET | `/accounts/user/` | List users (admin permission on backend) |
| GET | `/accounts/user/:id/` | User detail |
| POST/PATCH/DELETE | `/accounts/user/` … | User CRUD (admin-gated where applicable) |
| POST | `/accounts/register/` | Public signup (**employee** role only; password + confirm) |
| POST | `/accounts/login/` | JWT obtain pair (used by the **Sign in** screen) |
| POST | `/accounts/refresh/` | JWT refresh (automatic retry on 401 when refresh token exists) |

## Authentication

- **Backend:** `REST_FRAMEWORK` uses `JWTAuthentication` on API views (`TaskViewSet`, `UserViewSet`).
- **Frontend:** **Sign in** → `src/pages/LoginPage.jsx` → `authService.loginWithPassword` → tokens in **`localStorage`** (`src/lib/authStorage.js`). Axios sends **`Authorization: Bearer <access>`**; if unset in dev, **`VITE_DEV_BEARER_TOKEN`** is used as a fallback.
- **Refresh:** `src/lib/api.js` retries once after **`POST /accounts/refresh/`** on **401** when a refresh token exists.
- **JWT settings:** Django **`SIMPLE_JWT`** (`djangorestframework-simplejwt`).

Until you sign in (or use the dev env token), protected endpoints return **401** — blocked states, not mock data.

## React Router not used

Navigation is internal state (`activePage`) only.

## Backend protected API behavior

- Without valid JWT: expect **401** on protected routes.
- With JWT but wrong role: expect **403** or filtered lists per backend logic.

## Task creation (`POST /api/task/`)

`TaskViewSet.perform_create` saves with **`serializer.save(created_by=request.user)`** so creates persist correctly for managers.

## Other backend notes

- Task serializer exposes `assigned_by` and `created_by` as foreign key **IDs** unless serializers are extended.

## Frontend files to read

- `src/lib/api.js` — Axios, bearer + refresh retry; `src/lib/authStorage.js` — tokens.
- `vite.config.js` — Dev proxy for `/api` and `/accounts`.
- `src/services/taskService.js` / `userService.js` — Endpoints only.
