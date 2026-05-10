# Traveloop — Project Explanation

## Overview

Traveloop is a full-stack multi-city travel planning web application built for the Odoo Hackathon 2026 Virtual Round. Users can register, create trips, build multi-city itineraries, track budgets, manage packing lists, write trip notes, and share itineraries via a public URL.

## Architecture

### Frontend (`/frontend`)
React 18 + Vite + Tailwind CSS SPA. All pages are lazy-loaded via `React.lazy` + `Suspense` for code splitting.

**Key files:**
- `src/App.jsx` — Router with protected/public routes and toast notifications
- `src/api/index.js` — Axios instance with JWT interceptors (auto-attaches token, redirects to `/login` on 401)
- `src/store/authStore.js` — Zustand store for auth state (token + user in localStorage)
- `src/store/tripStore.js` — Zustand store for current trip cache
- `src/components/ui/` — Reusable UI components (Button, Input, Card, Modal, etc.)
- `src/components/layout/` — Navbar + BottomNav + Layout wrapper

**State management:** Zustand stores persist token/user to localStorage. All API calls go through the `api/` layer. No React Query — data is fetched per-page with `useEffect`.

**Forms:** React Hook Form + Zod resolver. Every field shows an inline error on invalid input. Buttons are disabled while a request is in flight.

### Backend (`/backend`)
FastAPI + SQLAlchemy 2.0 + SQLite. All tables are created via `Base.metadata.create_all()` on startup (no Alembic migrations — emergency shortcut).

**Key files:**
- `app/main.py` — FastAPI app, CORS middleware, router registration, startup DB init
- `app/core/database.py` — Engine, session factory, `get_db` dependency
- `app/core/security.py` — `get_password_hash`, `verify_password`, `create_access_token`, `get_current_user`
- `app/core/config.py` — Environment variables via Pydantic settings
- `app/api/__init__.py` — Central router aggregating all route files
- `app/api/routes/` — One file per resource: auth, trips, stops, cities, activities, budget, packing, notes, users, admin
- `app/models/` — One file per SQLAlchemy model
- `app/schemas/` — One file per Pydantic schema set (request/response)
- `seed.py` — Populates 20 cities and 50+ activities into SQLite

**DB schema:** 10 tables with proper FKs, cascade deletes, indexes on `user_id`, `trip_id`, `stop_id` columns, and `created_at`/`updated_at` timestamps on all main entities.

## API Design

All routes prefixed `/api/v1/`. Protected routes use `Bearer <token>` in the `Authorization` header.

| Endpoint | Method | Description |
|---|---|---|
| `/auth/register` | POST | Register + return JWT |
| `/auth/login` | POST | Login + return JWT |
| `/auth/me` | GET | Get current user |
| `/trips` | GET/POST | List/create trips |
| `/trips/:id` | GET/PUT/DELETE | Trip CRUD |
| `/trips/:id/share` | GET | Generate share token |
| `/trips/share/:token` | GET | Public share view |
| `/trips/:id/stops` | GET/POST | List/add stops |
| `/stops/:id` | PUT/DELETE | Update/delete stop |
| `/stops/reorder` | PATCH | Reorder stops array |
| `/cities` | GET | Search cities (debounced 300ms) |
| `/cities/:id/activities` | GET | Activities per city |
| `/stops/:id/activities` | POST/DELETE | Add/remove activity |
| `/trips/:id/budget` | GET/PUT | Budget CRUD |
| `/trips/:id/expenses` | GET/POST | Expense CRUD |
| `/trips/:id/packing` | GET/POST | Packing list CRUD |
| `/packing/:id` | PATCH/DELETE | Toggle/delete item |
| `/trips/:id/notes` | GET/POST | Notes list/create |
| `/notes/:id` | PUT/DELETE | Note update/delete |
| `/users/me` | PUT | Update profile |
| `/admin/stats` | GET | Admin stats |

## Key Implementation Decisions

1. **SQLite over PostgreSQL** — Required by Odoo hackathon rules. File-based, zero setup, judges can inspect `.db` directly.

2. **JWT in localStorage** — Simple auth for hackathon. HttpOnly cookies would be better for production.

3. **`create_all()` over Alembic** — Emergency shortcut. All tables, FKs, indexes, cascades are defined in model classes. Works fine for SQLite.

4. **Recharts + dnd-kit** — Recharts for budget pie/bar charts. dnd-kit included but up/down arrows used as primary reorder method.

5. **No React Query** — Zustand + per-page `useEffect` data fetching. Simpler for a hackathon.

6. **Budget on-trip-create** — A `Budget` row is auto-created when a `Trip` is created (`trips.py:42-44`). No explicit budget creation step needed.

7. **Share token** — UUID generated on-demand when user clicks "Share". Stored in `trips.share_token`. Public URL: `/trip/share/:token`.

8. **Optimistic UI on packing toggle** — Checkbox toggles immediately; rolls back + shows toast on API error.
