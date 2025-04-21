import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateTask() {
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const addTask = () => {
    if (!taskName) return;

    const newTask = {
      taskName,
      completed: false,
      dueDate: dueDate || null,
      category: category || '',
    };

    fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    })
      .then(response => {
        if (!response.ok) throw new Error('タスクの追加に失敗しました');
        return response.json();
      })
      .then(() => {
        navigate('/');
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>タスク追加</h2>
      <div>
        <input
          type="text"
          placeholder="タスク名"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="カテゴリ"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button onClick={addTask}>追加</button>
      </div>
    </div>
  );
}

export default CreateTask;