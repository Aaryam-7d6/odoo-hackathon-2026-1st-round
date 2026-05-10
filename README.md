# Traveloop

> Personalized multi-city travel planning made easy.

## Team

- [Aaryam] — Lead Developer

## Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
cp .env.example .env

# Seed the database with cities and activities
python seed.py

# Run the backend server
uvicorn app.main:app --reload
```

The backend runs at `http://localhost:8000`. API docs available at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend runs at `http://localhost:5173`.

### Database

SQLite is used as the database. The file `traveloop.db` is created automatically on first run. No external database server needed.

## Features

- Multi-city itinerary builder with drag-to-reorder
- City and activity discovery with search
- Automatic budget estimation and cost breakdown
- Public trip sharing via unique URL
- Packing checklist with progress tracking
- Trip notes and journal
- Responsive — works on mobile and desktop
- JWT authentication with secure password hashing
- Full CRUD for all entities with real-time persistence

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Zustand, React Router v6, Recharts, dnd-kit
- **Backend:** FastAPI, SQLAlchemy, SQLite, JWT auth (python-jose + bcrypt)
- **Database:** SQLite (relational, file-based)
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **HTTP:** Axios with interceptors

## API Docs

Run the backend and visit: http://localhost:8000/docs

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, Zustand
- Backend: FastAPI, SQLAlchemy, SQLite, JWT auth
- Charts: Recharts

## Development

### Git Workflow

- `main` — submission branch (clean, always working)
- `dev` — integration branch
- `feature/*` — feature branches

### Conventions

- Conventional commits (`feat:`, `fix:`, `chore:`, etc.)
- Zod validation on all forms
- Pydantic schemas for all API request/response bodies
- SQLAlchemy ORM with proper foreign keys and cascade deletes
- JWT with 24h expiry
- bcrypt password hashing
