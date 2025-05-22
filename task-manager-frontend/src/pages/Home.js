// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // ✅ 共通スタイル読み込み
import AdviceLogSection from '../components/AdviceLogSection'; // ✅ アドバイスログ表示を追加 ← 追加箇所

function Home() {
  return (
    <div className="app-overlay home-container">
      <h1 className="home-title">🧠 マイライフ管理アプリ</h1>
      <p className="home-subtitle">自分を整えるツールを選んでください：</p>

      {/* --- メニューカード一覧 --- */}
      <div className="card-grid">
        {/* --- 実装済み機能リンク --- */}
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

        {/* --- 準備中リンク（無効化） --- */}
        <div className="card disabled">🏷️ カテゴリ別（準備中）</div>
        <div className="card disabled">📔 日記（予定）</div>
      </div>

      {/* --- アドバイスログセクション --- */}
      <div style={{ marginTop: '40px' }}>
        <h2 className="section-title" style={{ fontSize: '20px', marginBottom: '10px' }}>
          💡 最近のアドバイスログ
        </h2>
        <AdviceLogSection /> {/* ✅ 追加したログ表示部分 */}
      </div>
    </div>
  );
}

export default Home;