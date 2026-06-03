# TaskManager (TaskBoard)

A premium, modern, and highly interactive full-stack Task Manager application. Featuring a sleek user interface combining **Material UI** elements, **Bootstrap** layouts, and smooth spring animations (via **Motion**). It includes a Kanban Board, tabular List View, and a Timeline Calendar.

---

## Key Features

- **📊 Dynamic Kanban Board View**: Drag cards across workflow stages (Pending, In Progress, Completed, Launched) with premium spring animations, layout transitions, and instant server updates.
- **📋 Tabular List View**: A clean, spreadsheet-like interface for managing tasks, supporting real-time searches, assignee filtering, and priority badge categorization.
- **📅 Timeline Calendar**: Visualizes task deadlines in a calendar grid with priority indicators and daily task overview tooltips.
- **💬 Task Comments**: Add and delete written comments directly inside a task's details panel for team collaboration.
- **⚙️ Sidebar Navigation**: A collapsible sidebar for project folders (Mock projects: Design Project, Landing Page) and workspaces.
- **🔔 Real-time Feedback**: Toast notifications via Material UI Snackbars confirm every task creation, status transition, and comment modification.

---

## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **React (v19)** | UI rendering and component architecture |
| **Routing** | **React Router (v6)** | Route-based navigation (`/list`, `/board`, `/calendar`) |
| **Component Library** | **Material UI (v9)** | Dialogs, form inputs, tooltips, avatars, and UI framework |
| **UI Styling** | **Bootstrap (v5) & CSS** | Responsive styling grids and badge elements |
| **Animations** | **Motion (framer-motion v12)** | Kanban layout shifts and spring transitions |
| **HTTP Client** | **Axios** | Communicating with Express REST endpoints |
| **Backend Framework** | **Node.js + Express** | Serving REST endpoints and the client-side SPA bundle |
| **Data Storage** | **JSON File (`tasks.json`)** | Persistent storage for tasks |

---

## Local Development Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Steps
1. **Clone the repository** and navigate to the project directory:
   ```bash
   cd Task-Manager
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

4. **Build for production**:
   To compile the React client files and bundle the Express server into `dist/`:
   ```bash
   npm run build
   ```

---

## Cloud Deployment Guide

Because this is a full-stack application (an Express backend serving the React client bundle) utilizing local JSON files (`tasks.json`) for data storage, choose your hosting platform according to the guidelines below:

### 🚀 Deploying on Render (Recommended)
Render is ideal for stateful Node.js apps because it supports persistent disk mounts to keep the JSON database from resetting.

1. Create a new **Web Service** on [Render](https://render.com/).
2. Link your GitHub repository.
3. Configure the service settings:
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/server.cjs`
4. Add the following **Environment Variables** in Render's dashboard:
   - `NODE_ENV`: `production`
5. **Persistent Disk (Optional but Recommended)**:
   - To keep your task database persistent between server restarts, mount a Render Disk at `/data` and update your backend file writing path to save `tasks.json` in `/data/tasks.json`.

---

### ⚡ Deploying on Vercel
Vercel is serverless, making it excellent for rendering the frontend, but it uses ephemeral read-only filesystem environments (the `tasks.json` database resets periodically).

#### Option A: Split Frontend & Backend (Recommended)
1. **Backend**: Host the Express server on Render (following the steps above).
2. **Frontend**: Deploy the React app to Vercel:
   - Link your repo and choose **Vite** as the framework preset.
   - Set the build settings to:
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Add the environment variable:
     - `VITE_API_URL`: `https://your-render-backend-url.onrender.com/api/tasks`

#### Option B: Serverless Express Monorepo
To deploy both the frontend and backend together on Vercel, create a `vercel.json` file in your root folder:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```
*Note: Due to the serverless execution model, changes made to `tasks.json` will be temporary and reset during cold restarts. For production Vercel apps, it is recommended to replace the JSON filesystem storage with an external database (e.g., MongoDB, PostgreSQL).*