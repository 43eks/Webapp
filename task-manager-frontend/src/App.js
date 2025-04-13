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
  Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');

  const fetchTasks = () => {
    fetch('http://localhost:8080/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = () => {
    if (!taskName) return;

    const newTask = {
      taskName: taskName,
      completed: false,
      dueDate: dueDate || null,
      category: category || '',
    };

    fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    })
      .then(() => {
        fetchTasks();
        setTaskName('');
        setDueDate('');
        setCategory('');
      })
      .catch(error => console.error('Error:', error));
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:8080/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.error('Error:', error));
  };

  const toggleTaskCompletion = (id) => {
    const updatedTask = tasks.find(task => task.id === id);
    if (!updatedTask) return;

    updatedTask.completed = !updatedTask.completed;

    fetch(`http://localhost:8080/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    })
      .then(() => fetchTasks())
      .catch(error => console.error('Error:', error));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        タスク管理ツール
      </Typography>

      {/* タスク追加フォーム */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <TextField
          label="タスク名"
          variant="outlined"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <TextField
          label="カテゴリ"
          variant="outlined"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <TextField
          label="期日"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
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
              <Checkbox
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
              />
              <ListItemText
                primary={`${task.taskName} (${task.category || '未分類'})`}
                secondary={`期日: ${task.dueDate || 'なし'} ／ ${task.completed ? '完了' : '未完了'}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default App;