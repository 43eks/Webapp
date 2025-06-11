// src/pages/SimpleTaskApp.jsx
import React, { useEffect, useState } from 'react';
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
  Checkbox
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

/* ===== API ベース URL ===== */
const API_BASE_URL = 'http://localhost:8080';

export default function SimpleTaskApp() {
  /* ---------------- state ---------------- */
  const [tasks, setTasks]       = useState([]);     // { id, taskName, completed }
  const [taskName, setTaskName] = useState('');

  /* ---------------- 初期ロード ---------------- */
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res  = await fetch(`${API_BASE_URL}/tasks`);
      const json = await res.json();
      setTasks(json);
    } catch (e) {
      console.error('❌ タスク取得失敗:', e);
      alert('タスク一覧の取得に失敗しました');
    }
  };

  /* ---------------- 追加 ---------------- */
  const addTask = async () => {
    const name = taskName.trim();
    if (!name) return;

    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method : 'POST',
        headers: { 'Content-Type':'application/json' },
        body   : JSON.stringify({ taskName: name, completed:false })
      });
      if (!res.ok) throw new Error(res.status);
      const saved = await res.json();
      setTasks(prev => [...prev, saved]);
      setTaskName('');
    } catch (e) {
      console.error('❌ 追加失敗:', e);
      alert('タスク追加に失敗しました');
    }
  };

  /* ---------------- 完了状態トグル ---------------- */
  const toggleDone = async (task) => {
    const updated = { ...task, completed: !task.completed };

    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${task.id}`, {
        method : 'PUT',
        headers: { 'Content-Type':'application/json' },
        body   : JSON.stringify(updated)
      });
      if (!res.ok) throw new Error(res.status);
      setTasks(prev => prev.map(t => (t.id === task.id ? updated : t)));
    } catch (e) {
      console.error('❌ 完了更新失敗:', e);
      alert('更新に失敗しました');
    }
  };

  /* ---------------- 削除 ---------------- */
  const deleteTask = async (id) => {
    if (!window.confirm('削除しますか？')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, { method:'DELETE' });
      if (!res.ok) throw new Error(res.status);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      console.error('❌ 削除失敗:', e);
      alert('削除に失敗しました');
    }
  };

  /* ---------------- 画面 ---------------- */
  return (
    <div>
      {/* --- ヘッダー --- */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">簡易タスク管理</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {/* --- 追加フォーム --- */}
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
              onChange={e => setTaskName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
            />
            <Button variant="contained" onClick={addTask}>
              追加
            </Button>
          </Box>
        </Paper>

        {/* --- タスク一覧 --- */}
        <Typography variant="h6" sx={{ mt: 4 }}>
          タスク一覧
        </Typography>
        <List>
          {tasks.map(task => (
            <ListItem
              key={task.id}
              secondaryAction={
                <IconButton edge="end" color="error" onClick={() => deleteTask(task.id)}>
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
                sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </div>
  );
}