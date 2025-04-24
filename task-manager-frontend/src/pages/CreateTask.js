import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateTask() {
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [suggestions, setSuggestions] = useState([]);
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

  const suggestTasks = () => {
    // 今後AI連携できるように仮実装中（手動で候補生成）
    const sampleSuggestions = [
      "月末のレポートまとめる",
      "運動する（30分）",
      "冷蔵庫の食材チェック",
      "メール返信まとめて行う",
      "読書タイムを確保（1時間）"
    ];
    setSuggestions(sampleSuggestions);
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
          style={{ marginBottom: '10px', display: 'block', width: '100%' }}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ marginBottom: '10px', display: 'block', width: '100%' }}
        />
        <input
          type="text"
          placeholder="カテゴリ"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginBottom: '10px', display: 'block', width: '100%' }}
        />
        <button onClick={addTask}>追加</button>

        <hr style={{ margin: '20px 0' }} />

        <button onClick={suggestTasks} style={{ marginBottom: '10px' }}>
          🧠 今週やるべきことを提案
        </button>

        {suggestions.length > 0 && (
          <div>
            <p>提案タスク（クリックで入力）:</p>
            <ul>
              {suggestions.map((s, index) => (
                <li key={index} style={{ cursor: 'pointer', color: '#0077cc' }}
                    onClick={() => setTaskName(s)}>
                  👉 {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateTask;