import React, { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');

  // タスク一覧取得
  const fetchTasks = () => {
    fetch('http://localhost:8080/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error:', error));
  };

  // 初回ロード時に取得
  useEffect(() => {
    fetchTasks();
  }, []);

  // タスク追加
  const addTask = () => {
    if (!taskName) return;

    const newTask = {
      taskName: taskName,
      completed: false,
      dueDate: dueDate || null,
      category: category || '',
    };

    fetch('http://localhost:8080/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('タスクの追加に失敗しました');
        }
        return response.json();
      })
      .then(() => {
        fetchTasks();
        setTaskName('');
        setDueDate('');
        setCategory('');
      })
      .catch(error => console.error('Error:', error));
  };

  // タスク削除
  const deleteTask = (id) => {
    fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(() => fetchTasks())
      .catch(error => console.error('Error:', error));
  };

  // 完了状態の切り替え
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
    <div className="App">
      <h1>タスク管理アプリ</h1>

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

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                marginRight: '10px',
              }}
              onClick={() => toggleTaskCompletion(task.id)}
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

export default App;