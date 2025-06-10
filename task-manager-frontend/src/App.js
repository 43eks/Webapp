/*  ------------------------------------------------------------
 *  src/App.js   （2025/06 修正版）
 *  アプリ全体のルーティング定義 & ナビゲーションバー
 *  ------------------------------------------------------------ */
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

/* ===== 既存ページ ===== */
import Home                 from './pages/Home';
import KnowledgeList        from './pages/knowledgeList';
import CreateKnowledge      from './pages/Createknowledge';
import EditKnowledge        from './pages/Editknowledge';
import ViewKnowledge        from './pages/Viewknowledge';
import TaskList             from './pages/TaskList';
import CreateTask           from './pages/CreateTask';
import TaskDetail           from './pages/TaskDetail';
import CreateHabit          from './pages/CreateHabit';
import HabitTracker         from './pages/HabitTracker';
import MonthlyView          from './pages/MonthlyView';
import GoalPage             from './pages/GoalPage';
import GoalForm             from './pages/GoalForm';
import SlideVideoPage       from './pages/SlideVideoPage';
import CharacterUpload      from './pages/CharacterUpload';
import DataSourceStep       from './pages/DataSourceStep';
import FieldDefinitionStep  from './pages/FieldDefinitionStep';
import ModelingStep         from './pages/ModelingStep';
import AdviceLogPage        from './pages/AdviceLogPage';
import DashboardPage        from './pages/DashboardPage';

/* ===== 上流工程ダッシュボード（ネスト先） ===== */
import UpstreamDashboard    from './pages/upstream/UpstreamDashboard';

/* ===== 右下キャラクター ===== */
import CharacterAvatar      from './components/CharacterAvatar';

/* ===== API ベース URL ===== */
export const API_BASE_URL = 'http://localhost:8080';

/* ------------------------------------------------------------ */
export default function App() {
  return (
    <>
      <Router>
        {/* ===== ナビゲーションバー ===== */}
        <nav style={navBarStyle}>
          {NAV_ITEMS.map(({ to, label }) => (
            <NavItem key={to} to={to} label={label} />
          ))}
        </nav>

        {/* ===== ルーティング ===== */}
        <main className="app-overlay">
          <Routes>
            {/* ホーム */}
            <Route path="/" element={<Home />} />

            {/* ナレッジ */}
            <Route path="/knowledges"             element={<KnowledgeList />} />
            <Route path="/knowledges/create"      element={<CreateKnowledge />} />
            <Route path="/knowledges/:id/edit"    element={<EditKnowledge />} />
            <Route path="/knowledges/:id"         element={<ViewKnowledge />} />

            {/* タスク */}
            <Route path="/tasks"                  element={<TaskList />} />
            <Route path="/tasks/create"           element={<CreateTask />} />
            <Route path="/tasks/:id"              element={<TaskDetail />} />

            {/* 習慣 */}
            <Route path="/habits"                 element={<HabitTracker />} />
            <Route path="/habits/create"          element={<CreateHabit />} />
            <Route path="/habits/monthly"         element={<MonthlyView />} />

            {/* ゴール */}
            <Route path="/goals"                  element={<GoalPage />} />
            <Route path="/goals/new"              element={<GoalForm />} />

            {/* スライド */}
            <Route path="/slides/create"          element={<SlideVideoPage />} />

            {/* キャラクター */}
            <Route path="/character"              element={<CharacterUpload />} />

            {/* DWH 関連 */}
            <Route path="/datasource"             element={<DataSourceStep />} />
            <Route path="/fields"                 element={<FieldDefinitionStep />} />
            <Route path="/modeling"               element={<ModelingStep />} />

            {/* アドバイス & ダッシュボード */}
            <Route path="/advice"                 element={<AdviceLogPage />} />
            <Route path="/dashboard"              element={<DashboardPage />} />

            {/* ★ 上流工程モジュール  (子ルートは UpstreamDashboard 内で完結) */}
            <Route path="/upstream/*"             element={<UpstreamDashboard />} />
          </Routes>
        </main>
      </Router>

      {/* ===== 画面右下キャラクター ===== */}
      <CharacterAvatar initialMood="happy" />
    </>
  );
}

/* ------------------------------------------------------------
 * ナビゲーションバー構成
 * ここを編集するだけでリンクが増減出来る
 * ---------------------------------------------------------- */
const NAV_ITEMS = [
  { to: '/',              label: '🏠 ホーム' },
  { to: '/tasks',         label: '📝 タスク' },
  { to: '/knowledges',    label: '📚 ナレッジ' },
  { to: '/habits',        label: '📅 習慣' },
  { to: '/goals',         label: '🎯 ゴール' },
  { to: '/slides/create', label: '🎞️ スライド作成' },
  { to: '/character',     label: '🧍 キャラクター' },
  { to: '/datasource',    label: '🧬 データソース' },
  { to: '/fields',        label: '🧩 項目定義' },
  { to: '/modeling',      label: '🧱 モデリング' },
  { to: '/advice',        label: '🧠 アドバイス' },
  { to: '/dashboard',     label: '📊 ダッシュボード' },
  { to: '/upstream',      label: '🛠 上流工程' },
];

/* ------------------------------------------------------------
 * 小さな NavLink ヘルパー
 * ---------------------------------------------------------- */
function NavItem({ to, label }) {
  return (
    <Link to={to} style={navLinkStyle}>
      {label}
    </Link>
  );
}

/* ------------------------------------------------------------
 * スタイル
 * ---------------------------------------------------------- */
const navBarStyle = {
  padding: '10px',
  backgroundColor: '#f0f0f0',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
};

const navLinkStyle = {
  textDecoration: 'none',
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
};