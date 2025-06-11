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
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

/* ===== API ベース URL ===== */
const API_BASE_URL = 'http://localhost:8080';

export default function SimpleTaskApp() {
  /* ---------------- state ---------------- */
  const [tasks, setTasks]   = useState([]);
  const [taskName, setTask] = useState('');

  /* ---------------- 初期ロード ---------------- */
  useEffect(() => {
    fetch(`${API_BASE_URL}/tasks`)
      .then(r => r.json())
      .then(setTasks)
      .catch(e => console.error('❌ タスク取得失敗:', e));
  }, []);

  /* ---------------- 追加 ---------------- */
  const addTask = async () => {
    const name = taskName.trim();
    if (!name) return;

    try {
      const res  = await fetch(`${API_BASE_URL}/tasks`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ name, completed:false })
      });
      if (!res.ok) throw new Error(res.status);
      const saved = await res.json();
      setTasks(prev => [...prev, saved]);
      setTask('');
    } catch (e) {
      console.error('❌ 追加失敗:', e);
      alert('タスク追加に失敗しました');
    }
  };

  /* ---------------- 削除 ---------------- */
  const deleteTask = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/tasks/${id}`, { method:'DELETE' });
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      console.error('❌ 削除失敗:', e);
      alert('削除に失敗しました');
    }
  };

  /* ---------------- 画面 ---------------- */
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">タスク管理アプリ</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {/* 追加フォーム */}
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
              onChange={(e) => setTask(e.target.value)}
            />
            <Button variant="contained" onClick={addTask}>
              追加
            </Button>
          </Box>
        </Paper>

        {/* 一覧 */}
        <Typography variant="h6" sx={{ mt: 4 }}>
          タスク一覧
        </Typography>
        <List>
          {tasks.map(({ id, name }) => (
            <ListItem
              key={id}
              secondaryAction={
                <IconButton edge="end" color="error" onClick={() => deleteTask(id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </List>
      </Container>
    </div>
  );
}