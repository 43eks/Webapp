/*  ------------------------------------------------------------
 *  src/pages/upstream/UpstreamDashboard.jsx         ★修正版★
 *  ─ 上流工程ダッシュボード  (左:メニュー / 右:<Outlet />)
 *  ------------------------------------------------------------ */
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './UpstreamCommon.css';

/* ------------------------------------------------------------
 * 左サイドメニュー  
 *   - ルートは *すべて絶対パス* に統一  
 *   - index（=概要フォーム）は `/upstream` を end 指定で active 判定
 * ---------------------------------------------------------- */
const MENU = [
  { to: '/upstream',              label: '① 概要フォーム',        end: true },
  { to: '/upstream/requirements', label: '② 要求定義'                           },
  { to: '/upstream/features',     label: '③ 機能一覧'                           },
  { to: '/upstream/wbs',          label: '④ WBS / マイルストーン'               },
  { to: '/upstream/stakeholders', label: '⑤ ステークホルダー分析'               },
];

/* ============================================================ */
export default function UpstreamDashboard() {
  return (
    <div className="upstream-container">
      {/* ---------- 左メニュー ---------- */}
      <aside className="up-nav">
        {MENU.map(({ to, label, end }) => (
          <SideLink key={to} to={to} label={label} end={end} />
        ))}
      </aside>

      {/* ---------- 右側：子ルートを表示 ---------- */}
      <section className="up-main">
        <Outlet />  {/* App.js 側でネスト指定した画面がここに挿入される */}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------
 * NavLink ラッパー  … active 時に .active クラスを付与
 * ---------------------------------------------------------- */
function SideLink({ to, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `up-nav-link${isActive ? ' active' : ''}`}
    >
      {label}
    </NavLink>
  );
}