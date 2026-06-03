export function isTaskOverdue(dueDateStr: string, status: string): boolean {
  if (status !== "Pending") return false;
  if (!dueDateStr) return false;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr);
    return dueDate < today;
  } catch {
    return false;
  }
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "No due date";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function formatDateTime(isoStr: string): string {
  if (!isoStr) return "";
  try {
    const date = new Date(isoStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoStr;
  }
}

export function getAssigneeMeta(name: string): { initials: string; bg: string } {
  const clean = name || "Team Member";
  const parts = clean.split(" ");
  const initials = parts
    .map((p) => p[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  let sum = 0;
  for (let i = 0; i < clean.length; i++) sum += clean.charCodeAt(i);
  const colors = ["#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#06b6d4"];
  const bg = colors[sum % colors.length];
  return { initials, bg };
}
