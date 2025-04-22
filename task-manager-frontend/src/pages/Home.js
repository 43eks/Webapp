import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    padding: '20px',
  };

  const cardStyle = {
    backgroundColor: '#f0f0f0',
    borderRadius: '12px',
    padding: '30px',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
    fontSize: '18px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
  };

  const disabledCardStyle = {
    ...cardStyle,
    color: '#999',
    backgroundColor: '#e0e0e0',
    cursor: 'not-allowed',
    pointerEvents: 'none',
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '30px' }}>マイライフ管理アプリ</h1>
      <p style={{ textAlign: 'center' }}>使いたい機能を選んでください：</p>
      <div style={gridStyle}>
        {/* 実装済みリンク */}
        <Link to="/tasks" style={cardStyle}>📝 タスク管理</Link>
        <Link to="/tasks/create" style={cardStyle}>➕ タスクを追加</Link>
        <Link to="/knowledges" style={cardStyle}>📚 ナレッジ管理</Link>
        <Link to="/knowledges/create" style={cardStyle}>➕ ナレッジを追加</Link>
        <Link to="/habits" style={cardStyle}>🔥 習慣トラッカー</Link>
        <Link to="/habits/create" style={cardStyle}>➕ 習慣を追加</Link>

        {/* 未実装（準備中） */}
        <div style={disabledCardStyle}>📅 月間ビュー（準備中）</div>
        <div style={disabledCardStyle}>🏷️ カテゴリ別（準備中）</div>
        <div style={disabledCardStyle}>📔 日記（予定）</div>
      </div>
    </div>
  );
}

export default Home;