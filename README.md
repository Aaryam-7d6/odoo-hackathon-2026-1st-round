# Traveloop

> Personalized multi-city travel planning made easy.

## Team

- [Aaryam] — Lead Developer

## How to Run This Project

### 1. Clone the Repository

```bash
git clone https://github.com/Aaryam-7d6/odoo-hackathon-2026-1st-round.git
cd odoo-hackathon-2026-1st-round
```

### 2. Set Up the Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Linux/macOS
# venv\Scripts\activate         # Windows (PowerShell)
# venv\Scripts\activate.bat      # Windows (CMD)

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
cp .env.example .env

# Seed the database with cities and activities
python seed.py

# Run the backend server
uvicorn app.main:app --reload
```

The backend runs at **http://localhost:8000**
API documentation available at **http://localhost:8000/docs**

### 3. Set Up the Frontend

```bash
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Run the development server
npm run dev
```

The frontend runs at **http://localhost:5173**

### 4. Open the App

1. Go to **http://localhost:5173**
2. Register a new account
3. Start creating trips and building itineraries

### Test Account (for Jury)

A pre-seeded test user is available:

- **Email:** `test@traveloop.com`
- **Password:** `Test@1234`

> Note: The test user is seeded automatically by running `python seed.py`.

## Features

- Multi-city itinerary builder with drag-to-reorder
- City and activity discovery with debounced search
- Budget tracking with pie and bar charts (Recharts)
- Packing checklist with progress bar and optimistic toggle
- Trip notes and journal
- Public trip sharing via unique URL
- JWT authentication with bcrypt password hashing
- Full CRUD for all entities with immediate DB persistence
- Responsive — works on mobile and desktop

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS v3, Zustand, React Router v6, Recharts, dnd-kit
- **Backend:** FastAPI, SQLAlchemy 2.0, SQLite, JWT auth (python-jose + bcrypt)
- **Database:** SQLite (relational, file-based — `traveloop.db`)
- **Forms:** React Hook Form + Zod validation
- **HTTP:** Axios with token interceptors and 401 redirect

## API Docs

Run the backend and visit: http://localhost:8000/docs

## Database

SQLite is used. The file `traveloop.db` is created automatically on first run. No external database server needed. All tables are created via SQLAlchemy on startup.

## Development

### Git Workflow

- `main` — submission branch (clean, always working)
- `dev` — integration branch
- `feature/*` — feature branches

### Conventions

- Conventional commits (`feat:`, `fix:`, `chore:`, etc.)
- Zod validation on all forms with inline error messages
- Pydantic schemas for all API request/response bodies
- SQLAlchemy ORM with proper foreign keys and cascade deletes
- JWT with 24h expiry, bcrypt password hashing
- Ownership checks on all mutation endpoints

### Branch Strategy

1. Development happens in `feature/*` branches
2. Features are merged into `dev` for integration
3. `dev` is merged into `main` at the end for submission
