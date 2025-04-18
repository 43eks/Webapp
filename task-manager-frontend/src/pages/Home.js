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
        {/* 実装済みのルートへリンク */}
        <Link to="/blogs" style={cardStyle}>📚 ナレッジ管理</Link>
        <Link to="/blogs/create" style={cardStyle}>➕ ナレッジを追加</Link>

        {/* 将来対応予定（未実装） */}
        <div style={disabledCardStyle}>📝 タスク管理（準備中）</div>
        <div style={disabledCardStyle}>📅 月間ビュー（準備中）</div>
        <div style={disabledCardStyle}>🏷️ カテゴリ別（準備中）</div>
        <div style={disabledCardStyle}>🔥 習慣トラッカー（予定）</div>
        <div style={disabledCardStyle}>📔 日記（予定）</div>
      </div>
    </div>
  );
}

export default Home;