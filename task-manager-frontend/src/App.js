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
  Checkbox, // 追加
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  // タスクの取得
  const fetchTasks = () => {
    fetch('http://localhost:8080/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // タスクの追加（修正済み）
  const addTask = () => {
    if (!taskName) return;

    const newTask = { taskName: taskName, completed: false };

    fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    })
      .then(() => {
        fetchTasks(); // ← 追加後に再取得
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

  // タスクの完了状態の更新
  const toggleTaskCompletion = (id) => {
    const updatedTask = tasks.find(task => task.id === id);
    if (!updatedTask) return;

    updatedTask.completed = !updatedTask.completed;

    fetch(`http://localhost:8080/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    })
      .then(() => fetchTasks()) // 状態更新後、再度タスクを取得
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
              <Checkbox
                checked={task.completed} // チェックボックスの状態を反映
                onChange={() => toggleTaskCompletion(task.id)} // 完了状態の切り替え
              />
              <ListItemText
                primary={task.taskName}
                secondary={task.completed ? '完了' : '未完了'} // 完了/未完了の表示
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default App;