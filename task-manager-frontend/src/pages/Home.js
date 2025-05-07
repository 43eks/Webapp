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
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    padding: '30px',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#111827',
    fontWeight: 'bold',
    fontSize: '18px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const cardHoverStyle = {
    ...cardStyle,
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
    },
  };

  const disabledCardStyle = {
    ...cardStyle,
    color: '#9ca3af',
    backgroundColor: '#e5e7eb',
    cursor: 'not-allowed',
    pointerEvents: 'none',
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '30px', fontSize: '28px', fontWeight: 'bold' }}>
        🧠 マイライフ管理アプリ
      </h1>
      <p style={{ textAlign: 'center', color: '#6b7280' }}>
        自分を整えるツールを選んでください：
      </p>

      <div style={gridStyle}>
        {/* 実装済みリンク */}
        <Link to="/tasks" style={cardStyle}>📝 タスク管理</Link>
        <Link to="/tasks/create" style={cardStyle}>➕ タスクを追加</Link>
        <Link to="/knowledges" style={cardStyle}>📚 ナレッジ管理</Link>
        <Link to="/knowledges/create" style={cardStyle}>➕ ナレッジを追加</Link>
        <Link to="/habits" style={cardStyle}>🔥 習慣トラッカー</Link>
        <Link to="/habits/create" style={cardStyle}>➕ 習慣を追加</Link>
        <Link to="/habits/monthly" style={cardStyle}>📅 月間ビュー</Link>
        <Link to="/goals" style={cardStyle}>🎯 ゴール一覧</Link>
        <Link to="/slides/create" style={cardStyle}>🎞️ 動画スライド作成</Link>
        <Link to="/character" style={cardStyle}>🧍 キャラクター管理</Link>

        {/* 未実装 or 準備中リンク */}
        <div style={disabledCardStyle}>🏷️ カテゴリ別（準備中）</div>
        <div style={disabledCardStyle}>📔 日記（予定）</div>
      </div>
    </div>
  );
}

export default Home;