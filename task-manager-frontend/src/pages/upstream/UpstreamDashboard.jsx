// src/pages/upstream/UpstreamDashboard.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './UpstreamCommon.css';

/* 左メニュー情報（相対パス・末尾スラッシュ不要） */
const MENU = [
  { path: '',            label: '① 概要フォーム',        end: true },
  { path: 'requirements', label: '② 要求定義'            },
  { path: 'features',     label: '③ 機能一覧'            },
  { path: 'wbs',          label: '④ WBS / マイルストーン'},
  { path: 'stakeholders', label: '⑤ ステークホルダー分析'},
];

export default function UpstreamDashboard() {
  return (
    <div className="upstream-container">
      {/* 左メニュー */}
      <aside className="up-nav">
        {MENU.map(({ path, label, end }) => (
          <NavLink
            key={path || 'index'}
            to={path}         /* ← 相対パス */
            end={end}
            className={({ isActive }) =>
              `up-nav-link${isActive ? ' active' : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </aside>

      {/* 右ペインに子ルートを表示 */}
      <section className="up-main">
        <Outlet />
      </section>
    </div>
  );
}