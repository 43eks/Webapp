// src/pages/GoalForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../App';

function GoalForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('タイトルと説明は必須です！');
      return;
    }

    const newGoal = {
      id: `goal_${Date.now()}`,  // 一意なID
      title: title.trim(),
      description: description.trim(),
      deadline: deadline ? new Date(deadline).toISOString() : null,
      taskIds: [],
      completed: false,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${API_BASE_URL}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal)
      });

      if (!res.ok) {
        throw new Error('ゴール作成に失敗しました');
      }

      console.log('✅ ゴール作成成功');
      navigate('/goals'); // 作成後にゴール一覧に戻る
    } catch (error) {
      console.error('作成エラー:', error);
      alert('ゴール作成に失敗しました');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>➕ 新しいゴール作成</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="ゴールタイトル（必須）"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="ゴール説明（必須）"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={inputStyle}
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>作成する</button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: '8px',
  fontSize: '14px'
};

const buttonStyle = {
  padding: '10px',
  fontSize: '16px',
  fontWeight: 'bold',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  cursor: 'pointer'
};

export default GoalForm;