import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // App.css に背景やボタンスタイル定義がある前提

function Home() {
  return (
    <div className="app-overlay home-container">
      <h1 className="home-title">🧠 マイライフ管理アプリ</h1>
      <p className="home-subtitle">自分を整えるツールを選んでください：</p>

      <div className="card-grid">
        {/* 実装済みリンク */}
        <Link to="/tasks" className="card">📝 タスク管理</Link>
        <Link to="/tasks/create" className="card">➕ タスクを追加</Link>
        <Link to="/knowledges" className="card">📚 ナレッジ管理</Link>
        <Link to="/knowledges/create" className="card">➕ ナレッジを追加</Link>
        <Link to="/habits" className="card">🔥 習慣トラッカー</Link>
        <Link to="/habits/create" className="card">➕ 習慣を追加</Link>
        <Link to="/habits/monthly" className="card">📅 月間ビュー</Link>
        <Link to="/goals" className="card">🎯 ゴール一覧</Link>
        <Link to="/slides/create" className="card">🎞️ 動画スライド作成</Link>
        <Link to="/character" className="card">🧍 キャラクター管理</Link>

        {/* 未実装 or 準備中リンク */}
        <div className="card disabled">🏷️ カテゴリ別（準備中）</div>
        <div className="card disabled">📔 日記（予定）</div>
      </div>
    </div>
  );
}

export default Home;