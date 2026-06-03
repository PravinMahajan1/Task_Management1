import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import { Task } from "../types";
import { addComment, deleteComment } from "../services/taskService";
import { getAssigneeMeta, formatDateTime } from "../utils/taskHelpers";

interface TaskCommentsProps {
  task: Task;
  onTaskUpdated: (updatedTask: Task) => void;
}

export default function TaskComments({ task, onTaskUpdated }: TaskCommentsProps) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const commentsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [task.comments]);

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      const res = await addComment(task.id, text);
      onTaskUpdated(res.task);
      setText("");
    } catch (err: any) {
      console.error("Comment submit error:", err);
      setError("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      setError(null);
      const res = await deleteComment(task.id, commentId);
      onTaskUpdated(res.task);
    } catch (err: any) {
      console.error("Failed to delete comment:", err);
      setError("Failed to delete comment.");
    }
  };

  const activeComments = task.comments || [];
  const mate = getAssigneeMeta(task.assigneeName);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", gap: 2, p: 1.5 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#475569", display: "flex", alignItems: "center", gap: 1 }}>
        <ChatIcon sx={{ color: "#6366f1", fontSize: "20px" }} /> Comments
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          flexGrow: 1,
          maxHeight: "260px",
          overflowY: "auto",
          bgcolor: "#f8fafc",
          borderRadius: "12px",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          border: "1px solid #e2e8f0"
        }}
      >
        {activeComments.length === 0 ? (
          <Box sx={{ m: "auto", textAlign: "center", color: "#94a3b8" }}>
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              No comments yet.
            </Typography>
          </Box>
        ) : (
          activeComments.map((comment) => (
            <Box
              key={comment.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 0.5,
                p: 1.5,
                bgcolor: "#ffffff",
                border: "1px solid #e1e8ed",
                borderRadius: "12px",
                position: "relative",
                width: "100%",
                "&:hover .delete-btn": { opacity: 1 }
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar sx={{ width: 22, height: 22, fontSize: "10px", bgcolor: mate.bg }}>
                    {mate.initials}
                  </Avatar>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569" }}>
                    {task.assigneeName}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "10px" }}>
                    {formatDateTime(comment.createdAt)}
                  </Typography>

                  <IconButton
                    size="small"
                    className="delete-btn"
                    onClick={() => handleDeleteComment(comment.id)}
                    sx={{
                      opacity: 0,
                      transition: "opacity 0.2s",
                      color: "#ef4444",
                      p: 0.25,
                      marginLeft: 1
                    }}
                    title="Delete comment"
                  >
                    <DeleteIcon sx={{ fontSize: "14px" }} />
                  </IconButton>
                </Box>
              </Box>

              <Typography variant="body2" sx={{ color: "#1e293b", pl: 0.5, pr: 1, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {comment.text}
              </Typography>
            </Box>
          ))
        )}
        <div ref={commentsEndRef} />
      </Paper>

      {error && (
        <Typography variant="caption" sx={{ color: "#ef4444", fontWeight: 600, display: "block", textAlign: "center" }}>
          ⚠️ {error}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSendText} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          placeholder="Type a comment..."
          fullWidth
          size="small"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={submitting}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              bgcolor: "#ffffff"
            }
          }}
        />

        <IconButton
          type="submit"
          disabled={!text.trim() || submitting}
          sx={{
            bgcolor: (text.trim() && !submitting) ? "#6366f1" : "#f1f5f9",
            color: (text.trim() && !submitting) ? "#ffffff" : "#94a3b8",
            "&:hover": { bgcolor: "#4f46e5" }
          }}
        >
          {submitting ? <CircularProgress size={20} /> : <SendIcon sx={{ fontSize: "16px" }} />}
        </IconButton>
      </Box>
    </Box>
  );
}
