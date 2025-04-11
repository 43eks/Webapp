// App.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('エラー:', error));
  }, []);

  const addTask = () => {
    if (!taskName.trim()) return;

    const newTask = { taskName: taskName.trim(), completed: false };

    fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    })
      .then(response => response.json())
      .then(data => {
        setTasks([...tasks, data]);
        setTaskName('');
      })
      .catch(error => console.error('エラー:', error));
  };

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
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        タスク管理アプリ
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="新しいタスクを入力"
          variant="outlined"
          fullWidth
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={addTask}
          startIcon={<PlaylistAddIcon />}
        >
          追加
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          現在のタスク
        </Typography>
        {tasks.length === 0 ? (
          <Typography color="text.secondary">タスクはありません</Typography>
        ) : (
          <List>
            {tasks.map((task) => (
              <ListItem
                key={task.id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => deleteTask(task.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={task.taskName} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}

export default App;