
## Local Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Steps
. **Install all dependencies**:
   ```bash
   npm install
   ```

   ```

. **Start the development server**:
   ```bash
   npm run dev
   ```
   Now open `http://localhost:3000` in your web browser.

. **Build for production**:
   To compile the frontend assets and bundle the backend code, run:
   ```bash
   npm run build
   ```

---

## API Routes

All endpoints are hosted under `/api` (or fallback `/` paths):

- `GET /api/tasks` - Returns all tasks.
- `POST /api/tasks` - Creates a task.
- `PUT /api/tasks/:id` - Updates a task.
- `DELETE /api/tasks/:id` - Deletes a task.
- `POST /api/tasks/:id/comments` - Adds a comment to a task.
- `DELETE /api/tasks/:id/comments/:commentId` - Deletes a comment.
- `GET /api/members` - Returns all team members.
- `POST /api/members` - Adds a new member.
- `DELETE /api/members/:name` - Removes a member.

