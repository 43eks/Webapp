/* ------------------------------------------------------------
 *  上流工程ダッシュボード
 *    ・左 = ステップメニュー（絶対パスで遷移）
 *    ・右 = <Routes> で各ステップを表示
 * ---------------------------------------------------------- */
import React from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import './UpstreamCommon.css';

/* ===== 各ステップ画面 ===== */
import OverviewForm       from './OverviewForm';
import RequirementsPage   from './RequirementsPage';
import FeatureList        from './FeatureList';
import WbsPage            from './WbsPage';
import StakeholdersPage   from './StakeholdersPage';

/* ----------------------------------------------------------------
 * 左メニュー（**すべて絶対パス**）
 * ---------------------------------------------------------------- */
const MENU = [
  { path: '/upstream',              label: '① 概要フォーム',        end: true },
  { path: '/upstream/requirements', label: '② 要求定義'               },
  { path: '/upstream/features',     label: '③ 機能一覧'               },
  { path: '/upstream/wbs',          label: '④ WBS / マイルストーン'   },
  { path: '/upstream/stakeholders', label: '⑤ ステークホルダー分析'   },
];

/* ============================================================ */
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
        <Routes>
          {/* /upstream                         */}
          <Route path="/"               element={<OverviewForm />} />
          {/* /upstream/requirements           */}
          <Route path="requirements"    element={<RequirementsPage />} />
          {/* /upstream/features               */}
          <Route path="features"        element={<FeatureList />} />
          {/* /upstream/wbs                    */}
          <Route path="wbs"             element={<WbsPage />} />
          {/* /upstream/stakeholders           */}
          <Route path="stakeholders"    element={<StakeholdersPage />} />
          {/* 404 フォールバック                */}
          <Route path="*" element={<p>ページが見つかりません</p>} />
        </Routes>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------
 * active 判定付きリンク
 * ---------------------------------------------------------- */
function SideLink({ to, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}                      /* `/upstream` 用に完全一致させる */
      className={({ isActive }) =>
        `up-nav-link${isActive ? ' active' : ''}`
      }
    >
      {label}
    </NavLink>
  );
}