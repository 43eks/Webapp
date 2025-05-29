// ────────────────────────────────────────────────
// 上流工程ダッシュボード
// - ここから“概要フォーム(ステップ1)”などを段階的に呼び出す
// ────────────────────────────────────────────────
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

/* ▼ ステップ1：概要入力フォーム（下で作成） */
import OverviewForm from './OverviewForm';

export default function UpstreamDashboard() {
  return (
    <div style={{ padding: 24 }}>
      <h2>🛠 上流工程支援ダッシュボード</h2>

      {/* サブメニュー（必要に応じて増やす） */}
      <nav style={{ margin: '20px 0', display: 'flex', gap: 12 }}>
        <Link to="overview"   style={linkStyle}>① 概要フォーム</Link>
        {/* ②以降を増やすときはここにリンク追加 */}
      </nav>

      {/* ネストされたルーティング */}
      <Routes>
        <Route path="overview" element={<OverviewForm />} />
        {/* ②以降のステップ用 <Route> をここへ追加 */}
        <Route
          path="*"
          element={<p style={{ color: '#666' }}>左のリンクから開始してください。</p>}
        />
      </Routes>
    </div>
  );
}

const linkStyle = {
  textDecoration: 'none',
  padding: '6px 12px',
  border: '1px solid #ccc',
  borderRadius: 6,
  background: '#fafafa',
  fontSize: 14,
};