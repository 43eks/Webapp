import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateTask() {
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
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
        navigate('/tasks');
      })
      .catch(error => console.error('Error:', error));
  };

  const fetchSuggestions = () => {
    setLoading(true);
    setSuggestions([]);

    const userSummary = window.prompt('今週の状況ややりたいことを簡単に入力してください：');

    if (!userSummary) {
      setLoading(false);
      return;
    }

    fetch('http://localhost:8080/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userSummary })
    })
      .then(res => res.json())
      .then(data => {
        setSuggestions(data.suggestions || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('提案取得エラー:', err);
        alert('提案の取得に失敗しました');
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>タスク追加</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
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

        <hr />

        <button onClick={fetchSuggestions} disabled={loading}>
          🧠 今週のタスクを提案してもらう
        </button>

        {loading && <p>読み込み中...</p>}

        {suggestions.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <p>💡 提案されたタスクをクリックすると上に反映されます：</p>
            <ul>
              {suggestions.map((s, idx) => (
                <li key={idx} style={{ cursor: 'pointer', color: '#007bff' }}
                    onClick={() => setTaskName(s.replace(/^\d+[\.\)]\s*/, ''))}>
                  {s}
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