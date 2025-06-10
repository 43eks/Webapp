/*  ------------------------------------------------------------
 *  src/pages/upstream/UpstreamDashboard.jsx
 *  ─ 上流工程ダッシュボード
 *     ・左側にステップ用メニュー
 *     ・右側 <Outlet /> に各ステップページを差し込む
 *  ------------------------------------------------------------ */
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './UpstreamCommon.css';              // 共通スタイル

/* ──────────────────────────────────────────────
 * 左側メニューで使うリンク情報を配列でまとめておく
 * ──────────────────────────────────────────── */
const MENU = [
  { path: '.',            label: '① 概要フォーム',        end: true },
  { path: 'requirements', label: '② 要求定義'               },
  { path: 'features',     label: '③ 機能一覧'               },
  { path: 'wbs',          label: '④ WBS / マイルストーン'   },
  { path: 'stakeholders', label: '⑤ ステークホルダー分析'   },
];

/* ------------------------------------------------------------ */

export default function UpstreamDashboard() {
  return (
    <div className="upstream-container">
      {/* ---------- 左メニュー ---------- */}
      <aside className="up-nav">
        {MENU.map(({ path, label, end }) => (
          <SideLink key={path} to={path} label={label} end={end} />
        ))}
      </aside>

      {/* ---------- 右メインペイン ---------- */}
      <section className="up-main">
        {/* 子ルート（Routes は App.js 側でネスト定義済み） */}
        <Outlet />
      </section>
    </div>
  );
}

/* ------------------------------------------------------------
 * NavLink をラップして共通クラスと active 判定を付与
 *   - `end` を渡すと「完全一致」で active 判定
 *     （トップ = “.” のリンクで使用）
 * ---------------------------------------------------------- */
function SideLink({ to, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `up-nav-link${isActive ? ' active' : ''}`
      }
    >
      {label}
    </NavLink>
  );
}