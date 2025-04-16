import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '20px' }}>📋 タスク一覧</h2>
      {tasks.length === 0 ? (
        <p>タスクがありません。</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {tasks.map(task => (
            <div
              key={task.id}
              style={{
                padding: '15px',
                borderRadius: '10px',
                backgroundColor: task.completed ? '#f0f0f0' : '#ffffff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  onClick={() => toggleTaskCompletion(task.id)}
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: task.completed ? '#999' : '#333',
                    marginBottom: '5px',
                  }}
                >
                  {task.taskName}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  期限: {task.dueDate || 'なし'} / カテゴリ: {task.category || '未分類'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginLeft: '10px' }}>
                <Link to={`/tasks/${task.id}`} style={linkButtonStyle}>詳細</Link>
                <Link to={`/tasks/${task.id}/edit`} style={linkButtonStyle}>編集</Link>
                <button onClick={() => deleteTask(task.id)} style={deleteButtonStyle}>削除</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const linkButtonStyle = {
  padding: '6px 12px',
  backgroundColor: '#4caf50',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '6px',
  fontSize: '12px',
};

const deleteButtonStyle = {
  padding: '6px 12px',
  backgroundColor: '#f44336',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '12px',
  cursor: 'pointer',
};

export default Home;