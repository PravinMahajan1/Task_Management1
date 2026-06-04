# TaskBoard — Task Management Application

A full-stack task management application built with **React + TypeScript** on the frontend and **Node.js + Express** on the backend. Features a polished Kanban board, sortable list view, per-task comments, team member management, and real-time CRUD backed by a JSON file store.

---

## Live Demo

| Service | URL |
|---|---|
| **Frontend** | [Deployed on Vercel](https://task-man-frontend-xi.vercel.app) |
| **Backend API** | [Deployed on Render](https://task-management1-udoa.onrender.com) |

---

## Features

### Task Management
- ✅ **Create, Read, Update, Delete** tasks with full validation
- 🏷️ **Priority levels** — Low, Medium, High (colour-coded)
- 📊 **Status workflow** — Pending → In Progress → Completed → Launched
- 📅 **Due dates** with overdue detection and visual warning
- 👤 **Assignee** per task, chosen from a shared team member list
- 💬 **Per-task comments** — add and delete inline with timestamps

### Two View Modes
| List View | Board View (Kanban) |
|---|---|
| Sortable table (by title, priority, status, due date) | 4 drag-and-drop columns |
| Colour-coded priority & status chips | Animated card transitions (Framer Motion) |
| Avatar initials with consistent colour per assignee | Arrow buttons to move tasks between stages |

### Filtering & Search
- 🔍 Global search across title and description
- 🎛️ Filter by priority (All / Low / Medium / High)
- 👥 Filter by assignee
- One-click **Reset** to clear all filters

### Team Management
- Add new team members from within the task form
- Members list persisted on the backend (`members.json`)
- Prevent duplicate member names

### Statistics Dashboard
Four live summary cards at the top of every page:
- **Total Tasks** | **In Progress** | **Overdue** | **Completed**

### UX Details
- Skeleton loading placeholders while data fetches
- Confirmation dialog before any destructive delete
- Snackbar toast notifications for every action
- Mobile-responsive sidebar with overlay + hamburger toggle
- Framer Motion animations on all Kanban card transitions

---

## Tech Stack

### Frontend
| Layer | Library / Tool |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Routing | React Router DOM v6 |
| UI Library | Material UI (MUI) v9 |
| CSS Baseline | Bootstrap 5 + custom CSS |
| Animations | Framer Motion (motion/react) |
| HTTP Client | Axios |

### Backend
| Layer | Library / Tool |
|---|---|
| Runtime | Node.js |
| Framework | Express 4 |
| Language | TypeScript (compiled via esbuild) |
| Data Store | JSON files (`tasks.json`, `members.json`) |
| Rate Limiting | express-rate-limit |
| CORS | cors |
| ID Generation | uuid v4 |

---

## Project Structure

```
Task-Manager/
├── backend/
│   ├── src/
│   │   └── server.ts         # Express app — all routes & business logic
│   ├── tasks.json            # Persisted task data (seed file)
│   ├── members.json          # Persisted team members (seed file)
│   ├── .env.example          # Backend env var template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Root component — state, routing, layout
│   │   ├── main.tsx          # React entry point with BrowserRouter
│   │   ├── types.ts          # Shared TypeScript interfaces & types
│   │   ├── components/
│   │   │   ├── TaskList.tsx      # Sortable table view
│   │   │   ├── TaskBoardView.tsx # Kanban board with drag-and-drop
│   │   │   ├── TaskModal.tsx     # Create/edit dialog (form + comments)
│   │   │   ├── TaskForm.tsx      # Task input form with member add dialog
│   │   │   └── TaskComments.tsx  # Per-task comment thread
│   │   ├── services/
│   │   │   └── taskService.ts    # All Axios API calls (tasks + members)
│   │   ├── styles/
│   │   │   └── tasks.css         # Custom CSS overrides
│   │   └── utils/
│   │       └── taskHelpers.ts    # isTaskOverdue, formatDate, getAssigneeMeta
│   ├── .env.example
│   └── package.json
│
├── vercel.json               # Vercel deploy config (frontend only)
├── render.yaml               # Render deploy config (backend only)
├── package.json              # Monorepo root with npm workspaces
└── .gitignore
```

---

## API Reference

**Base URL (local):** `http://localhost:3000`  
**Base URL (production):** your Render URL

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks |
| `GET` | `/api/tasks/:id` | Get a single task by ID |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update an existing task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `POST` | `/api/tasks/:id/comments` | Add a comment to a task |
| `DELETE` | `/api/tasks/:id/comments/:commentId` | Delete a comment |

### Members

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/members` | Get all team members |
| `POST` | `/api/members` | Add a new member |
| `DELETE` | `/api/members/:name` | Remove a member by name |

### Task Schema

```json
{
  "id": "uuid-v4",
  "title": "string (required, max 200 chars)",
  "description": "string (max 2000 chars)",
  "completed": false,
  "priority": "Low | Medium | High",
  "status": "Pending | In Progress | Completed | Launched",
  "dueDate": "YYYY-MM-DD",
  "assigneeName": "string",
  "comments": [
    {
      "id": "uuid-v4",
      "text": "string (max 1000 chars)",
      "createdAt": "ISO 8601 timestamp"
    }
  ]
}
```

---

## Local Development Setup

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9 (with workspace support)
- **Git**

### 1 — Clone the repository

```bash
git clone https://github.com/PravinMahajan1/Task_Management1.git
cd Task_Management1
git checkout S2
```

### 2 — Install all dependencies (root — installs both workspaces)

```bash
npm install
```

### 3 — Configure environment variables

**Backend** (`backend/.env`):
```env
PORT=3000
NODE_ENV=development
ALLOWED_ORIGIN=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```env
# Leave empty for local dev — Vite proxy routes /api/* to localhost:3000
VITE_API_URL=
```

### 4 — Run both servers concurrently

```bash
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| API Health | http://localhost:3000/ |

---

## Available Scripts

Run from the **repo root**:

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both backend and frontend in watch mode |
| `npm run dev:backend` | Start only the Express backend (tsx watch) |
| `npm run dev:frontend` | Start only the Vite dev server |
| `npm run build` | Build both backend and frontend for production |
| `npm run build:backend` | Compile backend via esbuild → `backend/dist/server.cjs` |
| `npm run build:frontend` | Compile frontend via `tsc` + Vite → `frontend/dist/` |
| `npm start` | Start the compiled backend (production) |

---

## Deployment

### Frontend → Vercel

The `vercel.json` at the repo root configures everything automatically:

```json
{
  "installCommand": "npm install",
  "buildCommand":   "npm run build:frontend",
  "outputDirectory": "frontend/dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Required environment variable in Vercel Dashboard:**

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-render-backend.onrender.com` |

> ⚠️ No trailing slash. This must be the full Render URL.

---

### Backend → Render

The `render.yaml` at the repo root configures everything automatically:

```yaml
services:
  - type: web
    name: task-manager-backend
    runtime: node
    rootDir: backend
    buildCommand: npm install --include=dev && npm run build
    startCommand: npm start
```

**Required environment variables in Render Dashboard:**

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `ALLOWED_ORIGIN` | `https://your-vercel-frontend.vercel.app` |

> ⚠️ ALLOWED_ORIGIN must exactly match your Vercel deployment URL (no trailing slash).

---

## Wiring Them Together

After deploying both services:

1. Copy your **Render backend URL** → paste into Vercel's `VITE_API_URL` env var → Redeploy frontend
2. Copy your **Vercel frontend URL** → paste into Render's `ALLOWED_ORIGIN` env var → Redeploy backend
3. Open the Vercel URL → tasks should load from Render

---

## Data Persistence Note

The backend stores all data in `tasks.json` and `members.json` inside the `backend/` directory. These files are committed to the repo as seed data.

> **Important:** Render's free tier uses an **ephemeral filesystem** — file changes (new tasks, comments, members) are lost on each redeploy or instance restart. For persistent data across deploys, integrate a hosted database such as MongoDB Atlas, PlanetScale, or Supabase.

---

## Git Workflow

| Branch | Purpose |
|--------|---------|
| `S2` | Main development branch (currently deployed) |

```bash
# Create a feature branch
git checkout -b feature/your-feature

# Commit and push
git add .
git commit -m "feat: describe your change"
git push origin feature/your-feature
```

---

## Known Limitations

| Area | Detail |
|------|--------|
| Auth | No authentication — all endpoints are public |
| Persistence | JSON file store resets on Render redeploy (free tier) |
| Real-time | No WebSocket sync — data requires manual refresh |
| 404 page | Invalid routes show an empty content area, no custom 404 message |
| Favicon | Not configured — browser shows default blank icon |
