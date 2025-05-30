// 上流工程ダッシュボード（親コンテナ）
import React from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import FeatureList from './FeatureList';

export default function UpstreamDashboard() {
  return (
    <div style={{ padding: 20 }}>
      <h2>🛠 上流工程ダッシュボード</h2>

      {/* サブメニュー */}
      <nav style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Link to="features">📋 機能一覧</Link>
        {/* 今後ステップが増えたらここに追加 */}
      </nav>

      {/* ネストルート */}
      <Routes>
        <Route path="/"        element={<Navigate to="features" replace />} />
        <Route path="features" element={<FeatureList />} />
      </Routes>
    </div>
  );
}