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

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  // タスクの取得
  useEffect(() => {
    fetch('http://localhost:8080/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('エラー:', error));
  }, []);

  // タスクの追加
  const addTask = () => {
    if (!taskName) return;

    const newTask = { taskName: taskName, completed: false };

    fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then(response => response.json())
      .then(data => {
        setTasks([...tasks, data]);
        setTaskName('');
      })
      .catch(error => console.error('エラー:', error));
  };

  // タスクの削除
  const deleteTask = (id) => {
    fetch(`http://localhost:8080/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.error('エラー:', error));
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">タスク管理アプリ</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 3 }}>
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
            />
            <Button variant="contained" onClick={addTask}>
              追加
            </Button>
          </Box>
        </Paper>

        <Typography variant="h6" sx={{ marginTop: 4 }}>
          タスク一覧
        </Typography>
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              secondaryAction={
                <IconButton edge="end" color="error" onClick={() => deleteTask(task.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={task.taskName} />
            </ListItem>
          ))}
        </List>
      </Container>
    </div>
  );
}

export default App;