// UpstreamDashboard.jsx  ― 上流工程ダッシュボード
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import OverviewForm   from './OverviewForm';   // ステップ①
import FeatureList    from './FeatureList';    // ステップ③
import WbsPage        from './WbsPage';        // ⭐ ステップ④ ←追加

export default function UpstreamDashboard() {
  return (
    <div className="upstream-container">
      {/* 左メニュー */}
      <aside className="up-nav">
        <Link to=""          >① 概要フォーム</Link>
        <Link to="features"  >③ 機能一覧</Link>
        <Link to="wbs"       >④ WBS / マイルストーン</Link>{/* ⭐ */}
      </aside>

      {/* 右ペイン */}
      <section className="up-main">
        <Routes>
          <Route path="/"         element={<OverviewForm />} />
          <Route path="features"  element={<FeatureList />} />
          <Route path="wbs"       element={<WbsPage />} />   {/* ⭐ */}
        </Routes>
      </section>
    </div>
  );
}