
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


### Filtering & Search
- 🔍 Global search across title and description
- 🎛️ Filter by priority (All / Low / Medium / High)
- 👥 Filter by assignee
- One-click **Reset** to clear all filters

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
