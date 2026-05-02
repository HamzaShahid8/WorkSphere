# WorkSphere (full stack)

Django REST API + React (Vite) task dashboard. All hosts and ports are configuration-only—see each project’s `.env.example`.

## Repository layout

| Path | Description |
|------|-------------|
| `backend/load_roles/` | Django project (`manage.py`, `load_roles/settings.py`) |
| `frontend/` | React + Vite SPA |

## One-time setup

### Backend

```bash
cd backend
pip install -r requirements.txt
cd load_roles
cp .env.example .env
# Edit .env if you need custom CORS or hosts (optional)
python manage.py migrate
```

Create users and tasks with Django admin, the `load_roles_and_users` management command if present, or the API (with JWT from `/accounts/login/`).

```bash
python manage.py runserver
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
```

**Recommended for local dev (Vite proxy, no browser CORS):** keep `VITE_API_BASE_URL` empty in `.env` and set `VITE_API_PROXY_TARGET` to your API (default `http://127.0.0.1:8000`).

**Sign up:** open the app and use **Sign up** to create an **employee** account (`POST /accounts/register/`). **Sign in** uses `POST /accounts/login/`; tokens are stored in the browser. Managers/admins are still usually created in Django admin.

**Optional:** `VITE_DEV_BEARER_TOKEN` in `.env` still works for `npm run dev` if you prefer not to use the form.

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Production / preview

Build the frontend with a real API origin:

```bash
cd frontend
# Set VITE_API_BASE_URL to your public API before building
npm run build
npm run preview
```

Ensure the backend’s `CORS_ALLOWED_ORIGINS` includes the origin that serves the SPA (or place API and static files on the same host).

## Documentation

- `frontend/README.md` — frontend commands and env variables
- `frontend/FRONTEND_API_NOTES.md` — API map, CORS, proxy, auth behavior
- `backend/load_roles/.env.example` — optional Django environment variables (copy to `.env`)

## Quality checks

```bash
cd backend/load_roles && python manage.py check && python manage.py test
cd ../../frontend && npm run lint && npm run build
```
