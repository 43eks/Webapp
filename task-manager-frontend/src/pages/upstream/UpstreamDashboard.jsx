/*  ------------------------------------------------------------
 *  src/pages/upstream/UpstreamDashboard.jsx
 *  ─ 上流工程ダッシュボード
 *  ------------------------------------------------------------ */
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './UpstreamCommon.css';

/* ------------------------------------------------------------
 * 左メニュー定義
 *   - すべて “/upstream/…” で始まる **絶対パス** に統一
 *   - トップページ（概要フォーム）は `/upstream` を end 指定
 * ---------------------------------------------------------- */
const MENU = [
  { path: '/upstream',              label: '① 概要フォーム',        end: true },
  { path: '/upstream/requirements', label: '② 要求定義'               },
  { path: '/upstream/features',     label: '③ 機能一覧'               },
  { path: '/upstream/wbs',          label: '④ WBS / マイルストーン'   },
  { path: '/upstream/stakeholders', label: '⑤ ステークホルダー分析'   },
];

export default function UpstreamDashboard() {
  return (
    <div className="upstream-container">
      {/* ---------- 左メニュー ---------- */}
      <aside className="up-nav">
        {MENU.map(({ path, label, end }) => (
          <SideLink key={path} to={path} label={label} end={end} />
        ))}
      </aside>

      {/* ---------- 右メインペイン（子ルート挿入） ---------- */}
      <section className="up-main">
        <Outlet />
      </section>
    </div>
  );
}

/* ------------------------------------------------------------
 * サイドリンク共通コンポーネント
 *   - active 時は .active クラスを付与
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