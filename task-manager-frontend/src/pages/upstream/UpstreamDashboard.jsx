/*  ------------------------------------------------------------
 *  UpstreamDashboard.jsx
 *  ─ 上流工程ダッシュボード（レイアウト専用）
 *     右ペインの中身は <Outlet/> に差し込まれます。
 *  ------------------------------------------------------------ */
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './UpstreamCommon.css';      // 共通スタイル

/* ============================================================ */
export default function UpstreamDashboard() {
  return (
    <div className="upstream-container">
      {/* ---------- 左メニュー ---------- */}
      <aside className="up-nav">
        <SideLink to=""               label="① 概要フォーム"          end />
        <SideLink to="requirements"   label="② 要求定義"              />
        <SideLink to="features"       label="③ 機能一覧"              />
        <SideLink to="wbs"            label="④ WBS / マイルストーン" />
        <SideLink to="stakeholders"   label="⑤ ステークホルダー"      />
      </aside>

      {/* ---------- 右メインペイン ---------- */}
      <section className="up-main">
        {/* 子ルート（Overview / Requirements / …）がここに差し込まれる */}
        <Outlet />
      </section>
    </div>
  );
}

/* -------------------------------------------------------------
 * 左サイドメニュー用リンク
 * active 時に .active クラスを付与
 * ----------------------------------------------------------- */
function SideLink({ to, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}                             /* index ルートの active 判定 */
      className={({ isActive }) =>
        'up-nav-link' + (isActive ? ' active' : '')
      }
    >
      {label}
    </NavLink>
  );
}