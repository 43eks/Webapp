import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filterCategory, setFilterCategory] = useState('すべて');

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

  // カテゴリ一覧を生成（重複排除）
  const categories = ['すべて', ...Array.from(new Set(tasks.map(task => task.category || '未分類')))];

  // カテゴリで絞り込み
  const filteredTasks =
    filterCategory === 'すべて'
      ? tasks
      : tasks.filter(task => (task.category || '未分類') === filterCategory);

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 タスク一覧</h2>

      {/* カテゴリフィルター */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>カテゴリで絞り込み:</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ fontSize: '16px', padding: '4px 8px' }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* タスクカード一覧 */}
      <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {filteredTasks.length === 0 ? (
          <p>該当するタスクはありません。</p>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} style={cardStyle}>
              <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.taskName}
              </h3>
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
          ))
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  padding: '15px',
  border: '1px solid #ddd',
 