import React, { useEffect, useState } from 'react';

function Home() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = () => {
    fetch('http://localhost:8080/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = (id) => {
    fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(() => fetchTasks())
      .catch(error => console.error('Error:', error));
  };

  const toggleTaskCompletion = (id) => {
    const updatedTask = tasks.find(task => task.id === id);
    if (!updatedTask) return;

    const newTask = { ...updatedTask, completed: !updatedTask.completed };

    fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    })
      .then(() => fetchTasks())
      .catch(error => console.error('Error:', error));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>タスク一覧</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span
              onClick={() => toggleTaskCompletion(task.id)}
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                marginRight: '10px',
                cursor: 'pointer'
              }}
            >
              {task.taskName}（{task.dueDate || '期限なし'} / {task.category || '未分類'}）
            </span>
            <button onClick={() => deleteTask(task.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;