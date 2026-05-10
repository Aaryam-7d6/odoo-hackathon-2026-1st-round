<div align="center">

# 🌍 Traveloop

### Personalized Multi-City Travel Planning — Made Easy

*Built for the Odoo Hackathon 2026 — Virtual Round*

![Stack](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?style=flat-square&logo=react)
![Stack](https://img.shields.io/badge/Backend-FastAPI%20%2B%20SQLAlchemy-009688?style=flat-square&logo=fastapi)
![Stack](https://img.shields.io/badge/Database-SQLite%20%28SQL%29-003B57?style=flat-square&logo=sqlite)
![Stack](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-F59E0B?style=flat-square)

</div>

---

## What Is Traveloop?

Traveloop is a full-stack web application that solves the chaos of planning multi-city trips. Instead of juggling seven browser tabs, a Google Sheet, and a WhatsApp group — users get one clean app to build itineraries, discover activities, track budgets, manage packing lists, journal trip notes, and share plans publicly via a unique URL.

**The core flow:**
Register → Create a trip → Add cities as stops → Discover and assign activities → Track budget → Share with friends

---

## Team

| Name | Role |
|------|------|
| Aarya R. Thakar | Lead Developer - Architecture, Backend and AI |
| Ansh B. Patel | Frontend Developer + Backend|
| Darshan B. Kyada | Frontend Developer |
| Elvis T. Fernandes | Backend + Integration |

---

## Features

- **Multi-city itinerary builder** — add cities as stops, assign travel dates, reorder with up/down controls
- **City & activity discovery** — debounced search (300ms) with country/region filters, cost index, and popularity ratings
- **Automatic budget estimation** — real-time totals computed from activities; pie and bar charts via Recharts
- **Packing checklist** — categorized items with progress bar, optimistic toggle, and reset
- **Trip notes / journal** — per-trip and per-stop notes with timestamps
- **Public itinerary sharing** — unique UUID share token, read-only public view at `/trip/share/:token`
- **JWT authentication** — bcrypt hashed passwords, 24h token expiry, axios interceptors for auto-attach and 401 redirect
- **Full CRUD with immediate DB persistence** — every action writes through to SQLite instantly; refresh = same state
- **Robust form validation** — Zod on frontend (inline field errors), Pydantic on backend (422 responses surfaced to UI)
- **Responsive UI** — mobile-first; bottom nav on mobile, sidebar on desktop; tested at 375px, 768px, 1280px
- **Auto-generated API docs** — FastAPI `/docs` with full interactive endpoint explorer

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 (lazy-loaded pages) |
| State management | Zustand |
| Forms + validation | React Hook Form + Zod |
| HTTP client | Axios (JWT interceptors + 401 redirect) |
| Charts | Recharts (PieChart + BarChart) |
| Drag-and-drop | @dnd-kit/core |
| Notifications | react-hot-toast |
| Backend framework | FastAPI (Python) |
| ORM | SQLAlchemy 2.0 |
| Database | SQLite — `traveloop.db` (SQL only, no NoSQL) |
| Auth | JWT via python-jose + bcrypt |
| Config | pydantic-settings + python-dotenv |
| Date utilities | date-fns |

---

## Project Structure

```
odoo-hackathon-2026-1st-round/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py         ← Central router (aggregates all routes)
│   │   │   └── routes/
│   │   │       ├── auth.py         ← Register, login, /me
│   │   │       ├── trips.py        ← Trip CRUD + share token
│   │   │       ├── stops.py        ← Stop CRUD + reorder
│   │   │       ├── cities.py       ← City search + filter
│   │   │       ├── activities.py   ← Activity search + stop assignment
│   │   │       ├── budget.py       ← Budget CRUD + expense tracking
│   │   │       ├── packing.py      ← Packing checklist CRUD + toggle
│   │   │       ├── notes.py        ← Trip notes CRUD
│   │   │       ├── users.py        ← Profile update
│   │   │       └── admin.py        ← Admin stats (optional)
│   │   ├── core/
│   │   │   ├── config.py           ← Env vars via Pydantic settings
│   │   │   ├── database.py         ← Engine, session factory, get_db dependency
│   │   │   └── security.py         ← bcrypt, JWT create/verify, get_current_user
│   │   ├── models/                 ← SQLAlchemy models (one per table)
│   │   ├── schemas/                ← Pydantic request/response schemas
│   │   └── main.py                 ← App init, CORS, router mount, DB create_all
│   ├── seed.py                     ← Seeds 20 cities + 50+ activities into DB
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js            ← Axios instance + interceptors
│   │   ├── components/
│   │   │   ├── ui/                 ← Button, Input, Card, Modal, Spinner, etc.
│   │   │   └── layout/             ← Navbar, BottomNav, Layout wrapper
│   │   ├── pages/                  ← One file per screen (lazy-loaded)
│   │   ├── store/
│   │   │   ├── authStore.js        ← Zustand: token + user (localStorage)
│   │   │   └── tripStore.js        ← Zustand: current trip cache
│   │   ├── hooks/                  ← Custom hooks (useTrips, useItinerary, etc.)
│   │   ├── utils/                  ← Date formatters, currency helpers
│   │   ├── types/                  ← TypeScript-style JSDoc interfaces
│   │   └── App.jsx                 ← Router, PrivateRoute, Suspense, Toaster
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── .gitignore
├── Agents.md                       ← AI coding agent instructions
├── explanation.md                  ← Architecture deep-dive for judges
└── README.md
```

---

## Setup & Running Locally

### Prerequisites

- Python 3.10+
- Node.js 18+
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Aaryam-7d6/odoo-hackathon-2026-1st-round.git
cd odoo-hackathon-2026-1st-round
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate          # Linux / macOS
# venv\Scripts\activate           # Windows PowerShell
# venv\Scripts\activate.bat       # Windows CMD

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env if needed (SECRET_KEY is pre-set for hackathon use)

# Seed database with cities and activities
python seed.py

# Start the backend
uvicorn app.main:app --reload
```

Backend runs at: **http://localhost:8000**
API docs (interactive): **http://localhost:8000/docs**

### 3. Frontend Setup

```bash
# In a new terminal, from the project root
cd frontend

npm install --legacy-peer-deps

npm run dev
```

Frontend runs at: **http://localhost:5173**

### 4. Use the App

Navigate to **http://localhost:5173**, register a new account, and start creating trips.

---

## Test Account (For Jury / Evaluators)

A pre-seeded demo user is available after running `python seed.py`:

| Field | Value |
|-------|-------|
| Email | `test@traveloop.com` |
| Password | `Test@1234` |

The demo account has a pre-built multi-city trip with stops, activities, budget entries, and packing items — so the full feature set is immediately visible without any setup.

---

## Database

- **Engine:** SQLite (relational SQL — no MongoDB, no NoSQL)
- **File:** `backend/traveloop.db` (created automatically on first run)
- **No external DB server required** — fully self-contained and offline-capable
- **Schema:** 10 tables with proper foreign keys, cascade deletes, indexes, and `created_at`/`updated_at` timestamps on all main entities
- **Seed data:** 20 cities across multiple regions, 50+ activities with types, durations, and estimated costs

To inspect the database directly: open `traveloop.db` in [DB Browser for SQLite](https://sqlitebrowser.org/) or run:
```bash
sqlite3 backend/traveloop.db ".tables"
sqlite3 backend/traveloop.db ".schema trips"
```

---

## API Overview

All endpoints prefixed with `/api/v1/`. Protected routes require:
```
Authorization: Bearer <jwt_token>
```

| Resource | Endpoints |
|----------|-----------|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Trips | `GET/POST /trips`, `GET/PUT/DELETE /trips/:id` |
| Share | `GET /trips/:id/share`, `GET /trips/share/:token` (public) |
| Stops | `GET/POST /trips/:id/stops`, `PUT/DELETE /stops/:id`, `PATCH /stops/reorder` |
| Cities | `GET /cities?search=&country=&region=`, `GET /cities/:id` |
| Activities | `GET /cities/:id/activities`, `POST/DELETE /stops/:id/activities` |
| Budget | `GET/PUT /trips/:id/budget`, `GET/POST /trips/:id/expenses` |
| Packing | `GET/POST /trips/:id/packing`, `PATCH/DELETE /packing/:id` |
| Notes | `GET/POST /trips/:id/notes`, `PUT/DELETE /notes/:id` |
| Profile | `PUT /users/me` |
| Admin | `GET /admin/stats` |

Full interactive documentation: **http://localhost:8000/docs**

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#F59E0B` | Amber — CTAs, highlights |
| `--secondary` | `#0F766E` | Teal — accents, success states |
| `--background` | `#0F172A` | Deep navy — page background |
| `--surface` | `#1E293B` | Card backgrounds |
| `--error` | `#EF4444` | Validation errors, alerts |
| `--text-primary` | `#F8FAFC` | Main content |
| `--text-secondary` | `#94A3B8` | Labels, metadata |

Fonts: **Playfair Display** (headings) + **DM Sans** (body)

---

## Security Practices

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with 24h expiry (`exp` claim)
- Ownership verified on every mutation — users cannot modify other users' trips
- All inputs sanitized via Pydantic on backend (prevents SQL injection via SQLAlchemy parameterized queries)
- Secrets stored in `.env` (excluded from Git via `.gitignore`)
- 401 responses automatically clear token and redirect to login

---

## Git Workflow

```
main        ← submission branch (clean, always deployable)
dev         ← integration branch
feature/*   ← one branch per feature/screen
```

- All development happened in `feature/*` branches
- Features merged into `dev` for integration testing
- `dev` merged into `main` for final submission
- Conventional commit messages throughout (`feat:`, `fix:`, `chore:`, etc.)
- Every team member has meaningful commits

---

## Evaluation Criteria Mapping

| Criterion | Implementation |
|-----------|---------------|
| Coding Standards | TypeScript-style JSDoc, ESLint, Conventional Commits, single-responsibility functions |
| Logic | Edge cases handled (empty trips, duplicate email, over-budget, date conflicts) |
| Scalability | Services layer, indexed DB columns, paginated list endpoints |
| Security | bcrypt + JWT + Pydantic + ownership checks + parameterized queries |
| Modularity | One component/file, one model/file, one route file/resource, Zustand stores |
| Frontend Design | Consistent color palette, Tailwind, Playfair + DM Sans, mobile-first |
| Performance | 300ms debounced search, React.lazy lazy-loading, SQLAlchemy joinedload |
| Usability | Inline form errors, loading states, toast notifications, no dead-end navigation |
| Debugging | Structured try/catch, specific error messages, no silent failures |
| DB Design | 10-table schema, FK constraints, cascade deletes, indexes, timestamps |

---

*Odoo Hackathon 2026 — Virtual Round Submission*
