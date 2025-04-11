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

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  // タスクの取得
  useEffect(() => {
    fetch('http://localhost:8080/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error:', error));
  }, []);

  // タスクの追加
  const addTask = () => {
    if (!taskName) return;

    const newTask = { taskName: taskName, completed: false };

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
      .catch(error => console.error('Error:', error));
  };

  // タスクの削除
  const deleteTask = (id) => {
    fetch(`http://localhost:8080/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        タスク管理ツール
      </Typography>

      {/* タスク追加フォーム */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="新しいタスク"
          variant="outlined"
          fullWidth
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <Button variant="contained" onClick={addTask}>
          追加
        </Button>
      </Box>

      {/* タスク一覧 */}
      <Paper elevation={3}>
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => deleteTask(task.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={task.taskName} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default App;