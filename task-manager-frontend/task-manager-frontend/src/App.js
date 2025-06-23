// frontend/src/features/tasks/pages/TaskPage.tsx
import React, { useEffect, useState, KeyboardEvent } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Box,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * 環境変数があれば優先、なければ localhost
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export interface Task {
  id: number;
  taskName: string;
  completed: boolean;
}

/**
 * ページ本体
 */
export default function TaskPage() {
  const {
    tasks,
    loading,
    taskName,
    setTaskName,
    addTask,
    toggleDone,
    deleteTask,
  } = useTasks();

  return (
    <div>
      {/* ---- ヘッダー ---- */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">簡易タスク管理</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {/* ---- 追加フォーム ---- */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            新しいタスクを追加
          </Typography>
          <Box display="flex" gap={2}>
            <TextField
              label="タスク名"
              variant="outlined"
              fullWidth
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                e.key === "Enter" && addTask()
              }
            />
            <Button
              variant="contained"
              onClick={addTask}
              disabled={!taskName.trim()}
            >
              追加
            </Button>
          </Box>
        </Paper>

        {/* ---- タスク一覧 ---- */}
        <Typography variant="h6" sx={{ mt: 4 }}>
          タスク一覧
        </Typography>
        {loading ? (
          <Box textAlign="center" sx={{ mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {tasks.map((task) => (
              <ListItem
                key={task.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => deleteTask(task.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleDone(task)}
                />
                <ListItemText
                  primary={task.taskName}
                  sx={{ textDecoration: task.completed ? "line-through" : "none" }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Container>
    </div>
  );
}

/**
 * タスクを操作するカスタムフック
 */
function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState("");
  const [loading, setLoading] = useState(true);

  /* 初期ロード */
  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 一覧取得 */
  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`);
      const json = (await res.json()) as Task[];
      setTasks(json);
    } catch (e) {
      console.error(e);
      alert("タスク一覧の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  /** 追加 */
  const addTask = async () => {
    const name = taskName.trim();
    if (!name) return;

    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskName: name, completed: false }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const saved: Task = await res.json();
      setTasks((prev) => [...prev, saved]);
      setTaskName("");
    } catch (e) {
      console.error(e);
      alert("タスク追加に失敗しました");
    }
  };

  /** 完了状態トグル */
  const toggleDone = async (task: Task) => {
    const updated = { ...task, completed: !task.completed };
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const returned = (await res.json()) as Task;
      setTasks((prev) => prev.map((t) => (t.id === returned.id ? returned : t)));
    } catch (e) {
      console.error(e);
      alert("更新に失敗しました");
    }
  };

  /** 削除 */
  const deleteTask = async (id: number) => {
    if (!window.confirm("削除しますか？")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`${res.status}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.error(e);
      alert("削除に失敗しました");
    }
  };

  return {
    tasks,
    loading,
    taskName,
    setTaskName,
    addTask,
    toggleDone,
    deleteTask,
  };
}
