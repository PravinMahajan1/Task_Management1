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
- **👥 Team Member Management**: Manage project assignees. Invite new team members dynamically, delete members (with active task assignment validation), and display initials-based colored avatars.

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
| **Data Storage** | **JSON Files (`tasks.json`, `members.json`)** | Persistent storage for tasks and team members |

---

## API Documentation

The backend service exposes REST API endpoints for tasks, comments, and team members under `/api` (or directly `/` for compatibility).

### Tasks API
- `GET /api/tasks` - Retrieve all tasks.
- `POST /api/tasks` - Create a new task.
  - Constraints: `title` (required, max 200 chars), `description` (optional, max 2000 chars).
- `PUT /api/tasks/:id` - Update an existing task.
- `DELETE /api/tasks/:id` - Delete a task.

### Comments API
- `POST /api/tasks/:id/comments` - Add a comment to a task.
  - Constraints: `text` (required, max 1000 chars).
- `DELETE /api/tasks/:id/comments/:commentId` - Delete a comment.

### Members API
- `GET /api/members` - Retrieve all team members.
- `POST /api/members` - Add a new team member.
  - Constraints: `name` (required, max 100 chars).
- `DELETE /api/members/:name` - Remove a team member.

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

