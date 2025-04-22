import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../App';

function CreateHabit() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newHabit = {
      id: crypto.randomUUID(),
      name: name,
      records: {}  // 最初は空の記録
    };

    fetch(`${API_BASE_URL}/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newHabit)
    })
      .then((res) => {
        if (!res.ok) throw new Error('習慣の追加に失敗しました');
        return res.json();
      })
      .then(() => {
        navigate('/habits'); // 一覧ページに戻る（あとで作ります）
      })
      .catch((err) => {
        console.error('エラー:', err);
        alert('習慣の追加に失敗しました');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>➕ 習慣の追加</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label>習慣の名前:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>追加</button>
      </form>
    </div>
  );
}

// スタイル定義
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  maxWidth: '400px'
};

const inputStyle = {
  padding: '8px',
  fontSize: '16px'
};

const buttonStyle = {
  padding: '10px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  fontSize: '16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

export default CreateHabit;