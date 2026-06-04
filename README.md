# Task Manager Monorepo

A modern, company-standard task management application refactored into a decoupled frontend/backend monorepo using **npm workspaces**.

## Architecture Overview

The codebase is split into two main packages:
- **`frontend/`**: A React + TypeScript SPA styled with Material-UI and Bootstrap, bundled using Vite. It runs on port `5173` and contains development proxies to redirect API calls to the backend.
- **`backend/`**: A lightweight Node.js + Express API server running on port `3000`. It features request rate limiting, TypeScript compilation, and file-based JSON persistence.

```
Task-Manager/
├── backend/                  # Express API Server
│   ├── src/
│   │   └── server.ts         # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── tasks.json            # Data storage
│   └── members.json          # Data storage
├── frontend/                 # React SPA
│   ├── src/                  # React components, services, utils
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts        # Vite dev server + proxy config
├── package.json              # Monorepo workspaces config
└── README.md
```

---

## Local Setup & Development

### Prerequisites
- [Node.js](https://nodejs.org/) (version 20+ recommended)

### Steps

1. **Install Dependencies**:
   Install all dependencies for both frontend and backend workspace packages at once from the root directory:
   ```bash
   npm install
   ```

2. **Set up Environment Variables**:
   Both directories contain `.env.example` templates.
   - For **backend**, copy `backend/.env.example` to `backend/.env`.
   - For **frontend**, copy `frontend/.env.example` to `frontend/.env`.

3. **Start the Development Servers**:
   Run the following command in the root folder to spin up both the Express server (port `3000`) and the Vite React app (port `5173`) concurrently:
   ```bash
   npm run dev
   ```
   Now, open your browser and navigate to `http://localhost:5173`. The frontend dev server will proxy API calls automatically to the backend on port `3000`.

---

## Build & Production

To compile the frontend assets and bundle the backend code for production, run the following command in the root folder:
   ```bash
   npm run build
   ```

This will run:
- Frontend production build: outputting compiled static assets in `frontend/dist`.
- Backend production build: compiling `server.ts` to `backend/dist/server.cjs`.

To start the production server:
   ```bash
   npm run start
   ```

---

## API Documentation

The backend service hosts the following API endpoints under `/api`:

### Tasks
- `GET /api/tasks` - Returns all tasks.
- `POST /api/tasks` - Creates a new task.
- `PUT /api/tasks/:id` - Updates an existing task.
- `DELETE /api/tasks/:id` - Deletes a task.

### Comments
- `POST /api/tasks/:id/comments` - Adds a comment to a task.
- `DELETE /api/tasks/:id/comments/:commentId` - Deletes a comment.

### Team Members
- `GET /api/members` - Returns all team members.
- `POST /api/members` - Adds a new member.
- `DELETE /api/members/:name` - Removes a member.
