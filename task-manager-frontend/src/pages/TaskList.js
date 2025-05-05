import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filterCategory, setFilterCategory] = useState('すべて');

  const fetchTasks = () => {
    fetch('http://localhost:8080/tasks')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setTasks(data);
      })
      .catch(error => console.error('❌ タスク取得エラー:', error));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = (id) => {
    fetch(`http://localhost:8080/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        fetchTasks();
      })
      .catch(error => console.error('❌ タスク削除エラー:', error));
  };

  const toggleTaskCompletion = (id) => {
    const targetTask = tasks.find(task => task.id === id);
    if (!targetTask) return;

    const updatedTask = { ...targetTask, completed: !targetTask.completed };

    fetch(`http://localhost:8080/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        fetchTasks();
      })
      .catch(error => console.error('❌ 完了切替エラー:', error));
  };

  const categories = ['すべて', ...Array.from(new Set(tasks.map(task => task.category || '未分類')))];
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

      <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {filteredTasks.length === 0 ? (
          <p>該当するタスクはありません。</p>
        ) : (
          filteredTasks.map((task, index) => (
            <div key={task.id || index} style={cardStyle}>
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
  borderRadius: '10px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  backgroundColor: '#fff'
};

export default TaskList;