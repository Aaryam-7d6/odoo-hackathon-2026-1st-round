# AGENTS.md — Traveloop Hackathon Coding Agent Instructions

> This file is the single source of truth for the AI coding agent (OpenCode + Qwen2.5-Code-7b).
> Read this entire file before writing a single line of code.
> Re-read the relevant section before starting each task.

---

## 0. WHO YOU ARE AND WHAT THIS IS

You are a coding agent assisting in an 8-hour hackathon virtual round for Odoo.
The project is **Traveloop** — a personalized multi-city travel planning web application.
The human lead is a final-year B.Tech CSE student specializing in AI/ML and Cybersecurity,
working with a team. They will review your output and merge only what is good.

Your job: write clean, working, production-quality code — fast but not sloppy.

---

## 1. GIT WORKFLOW — CRITICAL, NON-NEGOTIABLE

### Submission Requirement (Read This First)

> Odoo requires the Team Leader to submit **a single branch** containing all final code.
> The submission branch is `main`.
>
> This does NOT mean you develop everything on main.
> It means: during the hackathon you work in feature branches,
> and at the end you merge everything into `main` before submitting.
> `main` is what judges see. Keep it clean and always working.

### Branch Strategy

```
main          ← SUBMISSION BRANCH — judges see this. Always working. Final merge target.
dev           ← integration branch (merge feature/* here first, then merge dev → main at the end)
feature/*     ← one branch per feature/screen (your working area)
fix/*         ← bug fixes only
```

### The Two-Phase Workflow

**Phase 1 (Hours 0–7:30): Build in feature branches**

- All development happens in `feature/*` branches
- Merge completed features into `dev` for integration testing
- `main` stays untouched during this phase

**Phase 2 (Hour 7:30–8:00): Final merge and submission**

- Once everything on `dev` is tested and working, merge `dev` → `main`
- Do a final smoke test on `main`
- Team Leader submits the `main` branch link to Odoo

### Installation of Dependency, file Creation and edit

1. The Team leader (Me) use Linux (WSL2-ubuntu), while the other teammates use Windows 11.
2. You are free to install any dependency, related to project such as nodejs, sqllite, react, python, fastapi, tailwindcss, lucideicon-react etc.
3. Feel Free edit `.gitignore` for .env, binaries, chack-points and such files to remove them from repo. and if you need to create an `.env` file then you must crete `.env copy` file so it user can understand and edit it, make sure `.env copy` domot contains any real data, it just have real variable name used in code but with demo or summy values.
4. Edit `READEME.md` file, with deatails and instruction for users, like how to set things up etc.. for both Linux and Windows.
5. Use Industry Practice, and other things here.
6. Maintain and create Professional And clean Project structure or repository structure For this project.
7. Write Clean and Quality code.

### Rules You Must Follow

1. **NEVER commit directly to `main` during development.** Only the final merge goes there.
2. **NEVER commit broken/incomplete code to `dev`.** Only merge a feature branch into `dev` when that feature works.
3. For every new task or screen, create a new branch from `dev`:

   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/<screen-or-task-name>
   ```

   Examples:
   - `feature/login-signup`
   - `feature/dashboard`
   - `feature/itinerary-builder`
   - `feature/budget-breakdown`
   - `feature/city-search`
   - `feature/db-models`
   - `feature/api-auth`

4. After completing a feature iteration, commit with a clear message:

   ```bash
   git add .
   git commit -m "feat(login): add email/password validation and JWT flow"
   git push origin feature/<name>
   ```

5. **Commit message format** (Conventional Commits):

   ```
   feat(scope): short description
   fix(scope): short description
   refactor(scope): short description
   style(scope): short description
   docs(scope): short description
   ```

6. Push every iteration — even incomplete ones — to the feature branch.
   The human will review and cherry-pick what goes to `dev` → `main`.

7. One commit per logical unit of work. Do not batch unrelated changes in one commit.

8. Always include a short description in the PR body when done:
   - What was built
   - What works
   - What is not done yet
   - Any known issues

### Final Merge Commands (Hour 7:30)

-> Before Final Merge Review the Code once and ensure the code Quality plus Industrial practises. Then create `Explanation.md` file which contains the informanation of code, functions and files with simple explaination of it's working and why it's needed here and commit it. Only Then you are allowd for final Merge

```bash
# Step 1: Make sure dev is up to date and working
git checkout dev
git pull origin dev

# Step 2: Merge dev into main
git checkout main
git merge dev --no-ff -m "chore: final submission merge — all features integrated"

# Step 3: Smoke test the app from main one more time

# Step 4: Push main
git push origin main

# Step 5: Team Leader submits the main branch link to Odoo
```

---

## 2. PROJECT OVERVIEW

**App name:** Traveloop  
**Type:** Full-stack web application  
**Time limit:** 8 hours  
**Goal:** Multi-city travel planning — itineraries, budgets, activities, sharing
**The Problem in One Sentence:**
Build a web app where users plan multi-city trips — add stops, discover activities, track budgets, and share itineraries. Think Google Trips + a budget spreadsheet, but all in one clean app backed by a real relational database.

### 14 Screens (Build in Priority Order)

| Priority      | Screen                       | Branch Name                 |
| ------------- | ---------------------------- | --------------------------- |
| P0            | Login / Signup               | `feature/login-signup`      |
| P0            | Dashboard / Home             | `feature/dashboard`         |
| P0            | Create Trip                  | `feature/create-trip`       |
| P0            | My Trips (Trip List)         | `feature/trip-list`         |
| P0            | Itinerary Builder            | `feature/itinerary-builder` |
| P1            | Itinerary View               | `feature/itinerary-view`    |
| P1            | City Search                  | `feature/city-search`       |
| P1            | Trip Budget & Cost Breakdown | `feature/budget-breakdown`  |
| P2            | Activity Search              | `feature/activity-search`   |
| P2            | Packing Checklist            | `feature/packing-checklist` |
| P2            | Shared/Public Itinerary View | `feature/public-itinerary`  |
| P3            | User Profile / Settings      | `feature/user-profile`      |
| P3            | Trip Notes / Journal         | `feature/trip-notes`        |
| P3 (optional) | Admin / Analytics Dashboard  | `feature/admin-dashboard`   |

**Focus P0 first. P3 only if time allows.**

---

## 3. TECH STACK

### Frontend

- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS v3
- **Routing:** React Router v6
- **State:** Zustand (lightweight, no boilerplate)
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts (budget pie/bar, admin stats)
- **Icons:** Lucide React
- **HTTP client:** Axios with interceptors
- **Date handling:** date-fns

### Backend

- **Framework:** FastAPI (Python)
- **Auth:** JWT (python-jose) + bcrypt password hashing
- **ORM:** SQLAlchemy 2.0
- **DB:** SQLite for hackathon (file-based, zero setup, relational — judges can inspect it)
- **Migrations:** Alembic
- **API docs:** Auto-generated via FastAPI `/docs`
- **CORS:** FastAPI middleware (allow localhost:5173)

### Database — SQL ONLY (Non-Negotiable, Confirmed by Odoo Video)

- **SQLite** — confirmed and only acceptable database for this project
- Odoo explicitly stated in their expectations video: **SQL databases only. No MongoDB. No NoSQL of any kind.**
- Do NOT use PostgreSQL, MySQL, or any NoSQL alternative — SQLite is correct: local, zero-setup, fully relational, judges can open and inspect the `.db` file directly
- Use SQLAlchemy ORM — write Python model classes, not raw SQL strings
- Use Prepared statements, and others basic security related coding practice in such a way that it can prevent basic Web exploites, and Vulnerabilities Such as Sql injection etc.
- Alembic for migrations (shows professionalism even in a hackathon)
- **"Database up to date" requirement (from video):** every user action — add stop, add activity, update budget, check packing item — must immediately persist to the DB. No stale in-memory state that delays writes. Write-through on every mutation. If a user refreshes the page, they must see exactly the same data.

-> accept images within the size limit till 3 MB, and accpet only `.png`, `.jpg` abd `.jpeg` formates.

### Dev Tools

- Git + GitHub
- Vite dev server (frontend)
- Uvicorn (backend)
- Postman / FastAPI /docs for API testing

---

## 4. DATABASE SCHEMA

Design these tables. This is the relational core judges will evaluate.

```sql
users
  id, email, password_hash, name, photo_url, language_pref, created_at

trips
  id, user_id (FK→users), name, description, cover_photo_url,
  start_date, end_date, is_public, share_token, created_at, updated_at

stops
  id, trip_id (FK→trips), city_id (FK→cities), order_index,
  arrival_date, departure_date, notes

cities
  id, name, country, region, cost_index, popularity_score, description

activities
  id, city_id (FK→cities), name, type, duration_hours,
  estimated_cost, description, image_url

stop_activities
  id, stop_id (FK→stops), activity_id (FK→activities),
  scheduled_time, actual_cost, is_confirmed

budgets
  id, trip_id (FK→trips), transport_budget, stay_budget,
  activities_budget, meals_budget, misc_budget, total_budget

expenses
  id, trip_id (FK→trips), stop_id (FK→stops, nullable),
  category (transport/stay/activity/meal/misc),
  amount, description, date

packing_items
  id, trip_id (FK→trips), name, category, is_packed, created_at

trip_notes
  id, trip_id (FK→trips), stop_id (FK→stops, nullable),
  content, created_at, updated_at
```

---

## 5. API DESIGN

All routes prefixed with `/api/v1/`.
Protected routes require `Authorization: Bearer <token>` header.

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me

GET    /api/v1/trips              (user's trips)
POST   /api/v1/trips
GET    /api/v1/trips/:id
PUT    /api/v1/trips/:id
DELETE /api/v1/trips/:id
GET    /api/v1/trips/:id/share    (public share view)

GET    /api/v1/trips/:id/stops
POST   /api/v1/trips/:id/stops
PUT    /api/v1/stops/:id
DELETE /api/v1/stops/:id
PATCH  /api/v1/stops/reorder      (array of {id, order_index})

GET    /api/v1/cities?search=&country=&region=
GET    /api/v1/cities/:id
GET    /api/v1/cities/:id/activities

GET    /api/v1/activities?city_id=&type=&max_cost=
POST   /api/v1/stops/:id/activities
DELETE /api/v1/stop-activities/:id

GET    /api/v1/trips/:id/budget
PUT    /api/v1/trips/:id/budget
GET    /api/v1/trips/:id/expenses
POST   /api/v1/trips/:id/expenses

GET    /api/v1/trips/:id/packing
POST   /api/v1/trips/:id/packing
PATCH  /api/v1/packing/:id        (toggle packed)
DELETE /api/v1/packing/:id

GET    /api/v1/trips/:id/notes
POST   /api/v1/trips/:id/notes
PUT    /api/v1/notes/:id
DELETE /api/v1/notes/:id

GET    /api/v1/admin/stats        (protected, admin only)
```

---

## 6. FOLDER STRUCTURE

### Frontend (`/frontend`)

```
src/
  api/          ← axios instances, all API call functions
  components/   ← reusable UI components
    ui/         ← buttons, inputs, modals, cards
    layout/     ← Navbar, Sidebar, PageWrapper
  pages/        ← one file per screen
  store/        ← Zustand stores (auth, trips, ui)
  hooks/        ← custom hooks
  utils/        ← formatters, validators, helpers
  types/        ← TypeScript interfaces
  router/       ← React Router setup
  styles/       ← global CSS, Tailwind config
```

### Assets
- Logo file is named as `travel-poopm.png`
- Use it in Navbar.
- Use it in Login/Signup page header.
- Use it in browser tab: set in index.html as <link rel="icon" href="/travel-poopm.png" />
- Do NOT inline the logo as base64. Always reference from /public/

### Backend (`/backend`)

```
app/
  api/
    routes/     ← one file per resource (auth, trips, cities, etc.)
  models/       ← SQLAlchemy models
  schemas/      ← Pydantic request/response schemas
  services/     ← business logic layer (not in routes)
  core/
    config.py   ← env vars, settings
    security.py ← JWT, bcrypt
    database.py ← engine, session
  main.py       ← FastAPI app, CORS, router registration
alembic/        ← migrations
seed.py         ← seed cities and activities data
```

---

## 7. SEED DATA REQUIREMENT

The app must NOT rely on static JSON in the final product.
However, seed data for cities and activities is acceptable as initial data loaded into the DB.

Create `backend/seed.py` that populates:

- 20+ cities with country, region, cost_index (1-10 scale), popularity_score
- 5-10 activities per city with type, duration, estimated_cost

Run it once: `python seed.py`

This satisfies the "real database, not static JSON" requirement from judges.

---

## 8. CODING STANDARDS — DOS AND DON'TS

> These standards directly map to Odoo's evaluation rubric (confirmed via expectations video):
> Coding Standards · Logic · Scalability · Security · Modularity · Frontend Design ·
> Performance · Usability · Debugging Skills · DB Design

### DO — Coding Standards & Logic

- Write TypeScript on the frontend. No `any` types unless absolutely necessary.
- Use Pydantic schemas for all FastAPI request bodies and responses.
- Keep functions small and single-purpose. One function = one job.
- Write self-documenting variable and function names (`getTripById`, not `getData`).
- Comment non-obvious logic. One-line comments explaining "why", not "what".
- Use async/await properly in FastAPI (`async def` for all route handlers).
- Obey and follow Industry standards Practises.

### DO — Security

- Hash passwords with bcrypt — never store plaintext.
- Use JWT with expiry (`exp` claim). Set to 24 hours for hackathon.
- Validate that the requesting user owns the resource before any mutation (authorization check, not just authentication).
- Use httponlycookies if possible for better security.
- Use environment variables for all secrets via `.env` + `python-dotenv`.
- Add `.env` to `.gitignore` on the very first commit — before any secrets are added.
- Add `.env.example` showing required keys without values.
- Sanitize all string inputs on the backend before DB writes (Pydantic handles most of this).
- Use parameterized queries via SQLAlchemy — never string-interpolate into SQL (prevents SQL injection).
- Obey and follow Industry standards Practises.

### DO — Validation & Error Display (Explicitly Required by Odoo Video)

- **Every form field must show an inline error message when invalid input is given.**
- Frontend validation (Zod) fires on blur and on submit — never silently fail.
- Error messages must be specific: not "Invalid input" but "Email must be a valid email address" or "Password must be at least 8 characters".
- Backend validation errors (422 from FastAPI/Pydantic) must be caught and displayed in the UI — not swallowed silently.
- API errors (401, 403, 404, 500) must show a user-friendly toast notification with the actual reason.
- Write a clean creation and exit like 200,201, etc in API paylod and in json.
- Form submit buttons must be disabled while a request is in flight — prevent double submission.
- Show loading spinners on all async operations.
- On network error, show: "Connection failed. Please check your connection and try again."
- Obey and follow Industry standards Practises.

### DO — Scalability & Modularity

- Keep route handlers thin — all business logic goes in `services/` layer.
- One SQLAlchemy model per file in `models/`.
- One React component per file. No 300-line component files.
- Use Zustand stores to separate concerns: `authStore`, `tripStore`, `uiStore`.
- Use custom hooks to encapsulate data-fetching logic (`useTrips`, `useItinerary`).
- DB schema must use proper foreign keys, not stored IDs as plain integers without constraints.
- Add indexes on frequently queried columns: `trips.user_id`, `stops.trip_id`, `stop_activities.stop_id`.
- Obey and follow Industry standards Practises.

### DO — Performance

- Debounce all search inputs (300ms) — don't fire API calls on every keypress.
- Use pagination or limit on list endpoints — never fetch unlimited rows.
- Lazy-load page components in React Router (`React.lazy` + `Suspense`).
- Use `select_related` equivalents in SQLAlchemy (`.options(joinedload(...))`) to avoid N+1 queries.
- Add `loading` and `error` states to every component that fetches data.
- Use optimistic UI updates for toggle actions (packing checklist, activity add/remove).
- Obey and follow Industry standards Practises.

### DO — DB Design (Judges Will Inspect This)

- Every table has a primary key `id` (integer autoincrement or UUID).
- Every foreign key is explicitly declared in SQLAlchemy with `ForeignKey(...)`.
- Use `cascade="all, delete-orphan"` on relationships so deleting a trip deletes its stops, activities, notes, etc.
- Add `created_at` and `updated_at` timestamps to all main entities.
- `updated_at` must auto-update on every write — use `onupdate=datetime.utcnow`.
- Use SQLAlchemy `Enum` types for categorical fields (activity type, expense category, packing category).
- Write seed data that demonstrates all relationships — not just isolated rows.
- Obey and follow Industry standards Practises.

### DO — General

- Use environment variables for secrets (JWT secret key, etc.) via `.env` + `python-dotenv`.
- Add a `.env.example` file showing required variables (without real values).
- Write one component per file on the frontend.
- Use Tailwind utility classes — no inline `style={{}}` unless for dynamic computed values.
- Handle loading and error states on every API call in the UI.
- Obey and follow Industry standards Practises.

### DON'T

- Don't use MongoDB, NoSQL, or any non-SQL database. Odoo said SQL only — this is final.
- Don't commit `.env`, `__pycache__`, `node_modules`, `*.db` , `binaries`, etc files to Git. DOn't commit Unnecessary files to git.
- Don't use `useState` for server data — use proper API fetch + Zustand.
- Don't put business logic in React components — extract to hooks or services.
- Don't copy-paste code without understanding it. Adapt every snippet — judges may ask you to explain any line.
- Don't use `alert()` for user feedback — use toast notifications (react-hot-toast).
- Don't ignore the mobile view — Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) are mandatory.
- Don't hardcode user IDs or tokens anywhere in the codebase.
- Don't leave `console.log` statements in committed code.
- Don't use `SELECT *` or SQLAlchemy equivalent — always specify columns/relationships explicitly.
- Don't block the main thread — heavy computations must be async.
- Don't build the admin dashboard before all P0 and P1 screens work.
- Don't use `any` as a Pydantic field type.
- Don't silently swallow errors — every try/catch must either handle the error visibly or re-raise it.
- Don't show raw exception messages to the user — map backend errors to human-readable strings.
- Don't allow a form to submit with invalid data — Zod schema must gate the submit handler.

---

## 9. UI/UX REQUIREMENTS

### Color Scheme (Traveloop Brand)

```css
--primary: #f59e0b /* amber — warm, travel energy */ --primary-dark: #d97706
  --secondary: #0f766e /* teal — ocean, adventure */ --background: #0f172a
  /* deep navy — premium dark */ --surface: #1e293b /* card background */
  --surface-2: #334155 /* elevated surface */ --text-primary: #f8fafc
  --text-secondary: #94a3b8 --success: #10b981 --warning: #f59e0b
  --error: #ef4444 --border: #334155;
```

### Typography

- Display/Headings: `Playfair Display` (Google Fonts) — conveys travel, editorial feel
- Body: `DM Sans` — clean, modern, highly readable
- Mono (code/dates): `JetBrains Mono`

### Layout Rules

- Navbar: fixed top, height 64px
- Sidebar (desktop): 240px width, collapsible on mobile → bottom nav
- Content area: max-width 1280px, centered, padding 24px
- Cards: rounded-2xl, subtle shadow, hover lift effect
- All interactive elements: minimum 44px touch target
- Transitions: 200ms ease on hover, 300ms on page transitions

### Responsive Breakpoints

- Mobile first. Test at 375px, 768px, 1280px.
- Bottom navigation on mobile (5 tabs: Home, Trips, Search, Budget, Profile)
- Sidebar on desktop

---

## 10. AUTHENTICATION FLOW

1. User registers → POST `/auth/register` → returns JWT token
2. Token stored in `localStorage` as `traveloop_token`
3. Axios interceptor adds `Authorization: Bearer <token>` to every request
4. On 401 response → clear token → redirect to `/login`
5. Protected routes via React Router `<PrivateRoute>` wrapper
6. FastAPI dependency `get_current_user` validates token on every protected endpoint

---

## 11. FEATURE-SPECIFIC NOTES

### Itinerary Builder (Most Complex Screen)

- Drag-to-reorder stops using `@dnd-kit/core` (lightweight DnD)
- Each stop is a card with: city name, dates, activities list
- "Add Stop" opens a city search modal
- Activities can be added to each stop from within the builder
- Auto-calculate days between arrival/departure per stop

### Budget Breakdown

- Use Recharts `PieChart` for category breakdown
- Use `BarChart` for per-day cost visualization
- Real-time total updates as user adds/removes activities
- Color-coded alerts when a category exceeds its budget

### City Search

- Debounced search input (300ms) — don't hit API on every keypress
- Filter chips: country, region, cost range
- City card shows: name, country, cost_index (displayed as $ symbols), popularity stars

### Share Feature

- Generate a `share_token` (UUID) when user enables public sharing
- Public URL: `/trip/share/:share_token`
- Read-only view, no auth required
- "Copy Trip" button copies full itinerary to logged-in user's account

### Packing Checklist

- Categories: Clothing, Documents, Electronics, Toiletries, Misc
- Checkbox to mark as packed — optimistic update
- Progress bar showing X/Y items packed
- "Reset" button unchecks all

### Expense Splitting (Splitwise-style)

- Each trip has `participants` — users added to a trip as collaborators
- `expenses` table already exists — add `paid_by` (FK→users) and `split_between` (JSON array of user IDs)
- Split types: Equal split, Custom amount, Percentage
- New table: `expense_splits` — id, expense_id, user_id, amount_owed, is_settled
- New screen: `feature/expense-splitting` — shows who owes whom, settle up button
- Endpoint: GET /api/v1/trips/:id/balances — returns net balance per participant
- Keep it simple: calculate balances on read, don't pre-compute

---

## 12. WHAT JUDGES WILL LOOK FOR

> Odoo confirmed their evaluation rubric in the expectations video. Every item below is explicitly scored.
> Design every decision with this rubric in mind.

| Criterion            | What It Means for You                                        | How We Address It                                                      |
| -------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| **Coding Standards** | Clean, readable, consistent code style                       | TypeScript + ESLint + Conventional Commits                             |
| **Logic**            | Correct algorithms, no obvious bugs, handles edge cases      | Services layer, unit-testable functions                                |
| **Scalability**      | Code that could grow — not hardcoded, not monolithic         | Modular folder structure, indexed DB, paginated APIs                   |
| **Security**         | No exposed secrets, proper auth, input sanitization          | bcrypt + JWT + Pydantic + parameterized queries                        |
| **Modularity**       | Separation of concerns, reusable components                  | One component/file, services layer, Zustand stores                     |
| **Frontend Design**  | Consistent, attractive, responsive UI                        | Defined color palette, Tailwind, Playfair + DM Sans                    |
| **Performance**      | Fast loads, no N+1 queries, debounced inputs                 | joinedload, React.lazy, 300ms debounce                                 |
| **Usability**        | Intuitive flows, clear error messages, no dead ends          | Inline validation errors (required by video), toasts, loading states   |
| **Debugging Skills** | Structured error handling, meaningful logs                   | Try/catch everywhere, specific error messages, no swallowed exceptions |
| **DB Design**        | Proper normalization, FK constraints, indexes, relationships | Full schema with cascade deletes, indexes, timestamps                  |

### The Three Explicit Requirements from the Video

1. **SQL only, no MongoDB** — SQLite is our confirmed choice. No deviation.
2. **Database up to date** — every action writes through to DB immediately. Refresh = same state.
3. **UI must display errors for wrong input** — inline field errors on every form, every time, no exceptions.

These three are the easiest to check during a demo. Make sure all three are visible and obvious.

---

## 13. TIME ALLOCATION GUIDE (8 Hours)

| Time        | Task                                                                     |
| ----------- | ------------------------------------------------------------------------ |
| 0:00 – 0:30 | Repo setup, branch strategy, Vite + FastAPI scaffold, DB init, seed data |
| 0:30 – 1:30 | Auth (login/signup) — backend + frontend                                 |
| 1:30 – 2:30 | Dashboard + Create Trip + Trip List (P0 screens)                         |
| 2:30 – 4:00 | Itinerary Builder (most complex, highest value)                          |
| 4:00 – 5:00 | City Search + Activity Search                                            |
| 5:00 – 5:45 | Budget Breakdown                                                         |
| 5:45 – 6:15 | Packing Checklist + Trip Notes                                           |
| 6:15 – 6:45 | Public Share view + Profile Settings                                     |
| 6:45 – 7:30 | Polish UI, fix bugs, test all P0+P1 flows end-to-end                     |
| 7:30 – 8:00 | README, cleanup, final commit to main, demo prep                         |

**If behind schedule:** drop P3 screens entirely. A polished P0+P1 beats a broken P0-P3.

---

## 14. README TEMPLATE (Fill before final push)

```markdown
# Traveloop 🌍

> Personalized multi-city travel planning made easy.

## Team

- [Name 1] — [Role]
- [Name 2] — [Role]
- [Name 3] — [Role]
- [Name 4] — [Role]

## Setup

### Backend

cd backend
pip install -r requirements.txt
cp .env.example .env
python seed.py
uvicorn app.main:app --reload

### Frontend

cd frontend
npm install
npm run dev

## Features

- Multi-city itinerary builder with drag-to-reorder
- Automatic budget estimation and cost breakdown
- City and activity discovery
- Public trip sharing via unique URL
- Packing checklist and trip notes
- Responsive — works on mobile and desktop

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, Zustand
- Backend: FastAPI, SQLAlchemy, SQLite, JWT auth
- Charts: Recharts

## API Docs

Run backend and visit: http://localhost:8000/docs
```

---

## 15. EMERGENCY SHORTCUTS (If Time Is Critical)

If you're running out of time, apply these in order:

1. Skip Alembic migrations — use `Base.metadata.create_all()` directly.
2. Skip drag-to-reorder — use simple up/down arrow buttons instead.
3. Skip activity images — use emoji or color-coded category badges.
4. Skip the admin dashboard entirely (it's optional per the problem statement).
5. Use mock budget numbers (computed from activity costs) instead of a full expense tracker.
6. Skip the "Copy Trip" feature on public share — show read-only view only.

**Do not skip:** Auth, Create Trip, Itinerary Builder, City Search, Budget view. These are the core.

---

## 16. FINAL CHECKLIST BEFORE PUSHING TO MAIN

### Odoo Video Requirements (Check These First)

- [ ] Database is SQLite (SQL) — confirmed no MongoDB or NoSQL anywhere in the codebase
- [ ] Every user action (add/edit/delete) immediately persists to DB — verified by refresh test
- [ ] Every form shows inline error messages for invalid input — tested manually on every form
- [ ] Error messages are specific and human-readable — not raw exceptions or generic "Error"

### Code Quality

- [ ] All P0 screens work end-to-end
- [ ] Login → Dashboard → Create Trip → Build Itinerary → View Budget flow is complete
- [ ] No hardcoded credentials or tokens in code
- [ ] `.env` is in `.gitignore`
- [ ] `seed.py` runs without errors and populates all tables with relational data
- [ ] Mobile view tested at 375px width — no broken layouts
- [ ] No `console.log` in committed code
- [ ] README is complete with setup instructions
- [ ] All team members have at least one meaningful commit
- [ ] API docs accessible at `http://localhost:8000/docs`
- [ ] App starts from scratch with `npm run dev` and `uvicorn app.main:app --reload` without errors
- [ ] Cascade deletes work — deleting a trip removes its stops, activities, notes, packing items
- [ ] Auth flow works — logout clears token, protected routes redirect to login

### Evaluation Rubric Self-Check

- [ ] **Coding standards** — no linting errors, consistent naming, small focused functions
- [ ] **Logic** — edge cases handled (empty trip, no stops, over-budget, duplicate email on register)
- [ ] **Scalability** — services layer exists, no business logic in route handlers or components
- [ ] **Security** — passwords hashed, JWT validated, ownership checked before mutations
- [ ] **Modularity** — one component per file, one model per file, one route file per resource
- [ ] **Frontend design** — consistent colors, typography, spacing throughout all screens
- [ ] **Performance** — search inputs debounced, no N+1 queries visible in server logs
- [ ] **Usability** — loading states on all async ops, no dead ends in navigation
- [ ] **Debugging** — all try/catch blocks show meaningful errors, no silently swallowed exceptions
- [ ] **DB design** — all FKs declared, indexes added, timestamps on all entities, cascade configured

### Submission (Odoo Requirement — Single Branch)

- [ ] All feature branches merged into `dev`
- [ ] `dev` tested and working end-to-end
- [ ] `dev` merged into `main` with: `git merge dev --no-ff -m "chore: final submission"`
- [ ] `main` pushed to GitHub: `git push origin main`
- [ ] App verified to work from a clean clone of `main`
- [ ] Team Leader submits the `main` branch link via the "Submit Github Repo Link" button

---

_Last updated: Odoo Hackathon 2026 Virtual Round — updated after "Our Expectations" video_
_Agent: Read this file at the start of every session. Never skip it._
