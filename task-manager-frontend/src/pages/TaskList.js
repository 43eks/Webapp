import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function TaskList() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = () => {
    fetch('http://localhost:8080/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = (id) => {
    fetch(`http://localhost:8080/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(() => fetchTasks())
      .catch(error => console.error('Error:', error));
  };

  const toggleTaskCompletion = (id) => {
    const updatedTask = tasks.find(task => task.id === id);
    if (!updatedTask) return;

    const newTask = { ...updatedTask, completed: !updatedTask.completed };

    fetch(`http://localhost:8080/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    })
      .then(() => fetchTasks())
      .catch(error => console.error('Error:', error));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 タスク一覧</h2>
      <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {tasks.map(task => (
          <div key={task.id} style={cardStyle}>
            <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.taskName}</h3>
            <p>🗓️ 期限: {task.dueDate || 'なし'}</p>
            <p>🏷️ カテゴリ: {task.category || '未分類'}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button onClick={() => toggleTaskCompletion(task.id)}>
                {task.completed ? '未完了にする' : '完了にする'}
              </button>
              <Link to={`/tasks/${task.id}`}>
                <button>詳細</button>
              </Link>
              <button onClick={() => deleteTask(task.id)}>削除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const cardStyle = {
  padding: '15px',
  border: '1px solid #ddd',
  borderRadius: '10px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  backgroundColor: '#fff',
};

export default TaskList;