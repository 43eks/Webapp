import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>タスク管理アプリへようこそ</h1>
      <p>機能を選んでください:</p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Link to="/tasks">
          <button style={buttonStyle}>📋 タスク一覧</button>
        </Link>
        <Link to="/create">
          <button style={buttonStyle}>➕ タスクを追加</button>
        </Link>
        {/* ここに新機能があれば増やしていける */}
        <button style={buttonStyle} disabled>📅 月間ビュー（準備中）</button>
        <button style={buttonStyle} disabled>🏷️ カテゴリ別（準備中）</button>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  borderRadius: '8px',
  border: '1px solid #ccc',
  backgroundColor: '#f8f8f8',
  transition: 'all 0.3s',
};

export default Home;