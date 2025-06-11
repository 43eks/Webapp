/*  ------------------------------------------------------------
 *  src/pages/upstream/UpstreamDashboard.jsx   2025-06 修正版
 *  上流工程ダッシュボード
 *    ├─ 左: ステップメニュー
 *    └─ 右: 選択中ステップの画面を表示
 *  ---------------------------------------------------------- */
import React from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import './UpstreamCommon.css';

/* ===== ステップごとの画面 ===== */
import OverviewForm       from './OverviewForm';        // ①
import RequirementsPage   from './RequirementsPage';    // ②
import FeatureList        from './FeatureList';         // ③
import WbsPage            from './WbsPage';             // ④
import StakeholdersPage   from './StakeholdersPage';    // ⑤

/* ===== 左メニュー定義（相対パス） ===== */
const MENU = [
  { path: '',             label: '① 概要フォーム',        end: true },
  { path: 'requirements', label: '② 要求定義'               },
  { path: 'features',     label: '③ 機能一覧'               },
  { path: 'wbs',          label: '④ WBS / マイルストーン'   },
  { path: 'stakeholders', label: '⑤ ステークホルダー分析'   },
];

/* ============================================================ */
export default function UpstreamDashboard() {
  return (
    <div className="upstream-container">
      {/* ---------- 左メニュー ---------- */}
      <aside className="up-nav">
        {MENU.map(({ path, label, end }) => (
          <SideLink key={path || 'index'} to={path} label={label} end={end} />
        ))}
      </aside>

      {/* ---------- 右メインペイン ---------- */}
      <section className="up-main">
        <Routes>
          <Route index               element={<OverviewForm />} />
          <Route path="requirements" element={<RequirementsPage />} />
          <Route path="features"     element={<FeatureList />} />
          <Route path="wbs"          element={<WbsPage />} />
          <Route path="stakeholders" element={<StakeholdersPage />} />
          {/* 万一の 404 */}
          <Route path="*" element={<p>ページが見つかりません</p>} />
        </Routes>
      </section>
    </div>
  );
}

/* ---------- サイドバー用リンク ---------- */
function SideLink({ to, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}                             /* index (= "") では完全一致 */
      className={({ isActive }) =>
        'up-nav-link' + (isActive ? ' active' : '')
      }
    >
      {label}
    </NavLink>
  );
}