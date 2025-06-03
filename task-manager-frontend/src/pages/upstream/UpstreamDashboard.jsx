// src/pages/upstream/UpstreamDashboard.jsx
// ― 上流工程ダッシュボード

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

/* ------ 各ステップの画面 ------ */
import OverviewForm       from './OverviewForm';        // ① 概要フォーム（Scope）
import RequirementsPage   from './RequirementsPage';    // ② 要求定義
import FeatureList        from './FeatureList';         // ③ 機能一覧
import WbsPage            from './WbsPage';             // ④ WBS／マイルストーン
import StakeholdersPage   from './StakeholdersPage';    // ⑤ ステークホルダー分析（任意）

import './UpstreamCommon.css';  // 共通スタイル（既存）

export default function UpstreamDashboard() {
  return (
    <div className="upstream-container">
      {/* ─────────── 左メニュー ─────────── */}
      <aside className="up-nav">
        <NavItem to=""               label="① 概要フォーム" />
        <NavItem to="requirements"   label="② 要求定義"     />
        <NavItem to="features"       label="③ 機能一覧"     />
        <NavItem to="wbs"            label="④ WBS / マイルストーン" />
        <NavItem to="stakeholders"   label="⑤ ステークホルダー"     />
      </aside>

      {/* ─────────── 右ペイン（ルーティング） ─────────── */}
      <section className="up-main">
        <Routes>
          {/* index（/upstream）で表示するのは概要フォーム */}
          <Route index                element={<OverviewForm />} />
          <Route path="requirements"  element={<RequirementsPage />} />
          <Route path="features"      element={<FeatureList />} />
          <Route path="wbs"           element={<WbsPage />} />
          <Route path="stakeholders"  element={<StakeholdersPage />} />
        </Routes>
      </section>
    </div>
  );
}

/* 使い回し用ナビリンク */
function NavItem({ to, label }) {
  return (
    <Link to={to} className="up-nav-link">
      {label}
    </Link>
  );
}