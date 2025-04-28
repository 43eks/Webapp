// src/pages/GoalPage.jsx
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../App'; // ← APIベースURL使う
import { Link } from 'react-router-dom'; // ← 新規作成ページに飛ぶために使う

function GoalPage() {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/goals`);
      const data = await res.json();
      setGoals(data);
    } catch (err) {
      console.error('ゴール取得エラー:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🎯 ゴール一覧</h2>

      {/* 新規ゴール作成ボタン */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/goals/new">
          <button style={{ padding: '8px 16px', fontSize: '14px' }}>
            ➕ 新しいゴールを作成
          </button>
        </Link>
      </div>

      {/* ゴール一覧テーブル */}
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={cellStyle}>タイトル</th>
            <th style={cellStyle}>説明</th>
            <th style={cellStyle}>締切</th>
          </tr>
        </thead>
        <tbody>
          {goals.map(goal => (
            <tr key={goal.id}>
              <td style={cellStyle}>{goal.title}</td>
              <td style={cellStyle}>{goal.description}</td>
              <td style={cellStyle}>
                {goal.deadline ? new Date(goal.deadline).toLocaleDateString('ja-JP') : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// テーブルセル共通スタイル
const cellStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'center'
};

export default GoalPage;