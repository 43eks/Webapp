// ──────────────────────────────────────────────
//  src/App.js
//  アプリ全体のルーティング定義 & ナビゲーションバー
// ──────────────────────────────────────────────
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

/* ===== 上流工程モジュール（ネストルート） ===== */
import UpstreamDashboard    from './pages/upstream/UpstreamDashboard';

/* ===== 画面右下キャラクター ===== */
import CharacterAvatar      from './components/CharacterAvatar';

/* ===== API ベース URL ===== */
export const API_BASE_URL = 'http://localhost:8080';

/* ────────────────────────────────────────────── */

export default function App() {
  return (
    <>
      <Router>
        {/* --------------- ナビゲーションバー --------------- */}
        <nav style={navBarStyle}>
          <NavItem to="/"              label="🏠 ホーム"         />
          <NavItem to="/tasks"         label="📝 タスク"         />
          <NavItem to="/knowledges"    label="📚 ナレッジ"       />
          <NavItem to="/habits"        label="📅 習慣"           />
          <NavItem to="/goals"         label="🎯 ゴール"         />
          <NavItem to="/slides/create" label="🎞️ スライド作成"   />
          <NavItem to="/character"     label="🧍 キャラクター"   />
          <NavItem to="/datasource"    label="🧬 データソース"   />
          <NavItem to="/fields"        label="🧩 項目定義"       />
          <NavItem to="/modeling"      label="🧱 モデリング"     />
          <NavItem to="/advice"        label="🧠 アドバイス"     />
          <NavItem to="/dashboard"     label="📊 ダッシュボード" />
          {/* ▼ 上流工程モジュール */}
          <NavItem to="/upstream"      label="🛠 上流工程"       />
        </nav>

        {/* --------------- メインルーティング --------------- */}
        <main className="app-overlay">
          <Routes>
            {/* ホーム */}
            <Route path="/"                       element={<Home />} />

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

            {/* キャラクター管理 */}
            <Route path="/character"              element={<CharacterUpload />} />

            {/* DWH 関連 */}
            <Route path="/datasource"             element={<DataSourceStep />} />
            <Route path="/fields"                 element={<FieldDefinitionStep />} />
            <Route path="/modeling"               element={<ModelingStep />} />

            {/* アドバイス & ダッシュボード */}
            <Route path="/advice"                 element={<AdviceLogPage />} />
            <Route path="/dashboard"              element={<DashboardPage />} />

            {/* ★ 上流工程モジュール（子ルートを UpstreamDashboard が保持） */}
            <Route path="/upstream/*"             element={<UpstreamDashboard />} />
          </Routes>
        </main>
      </Router>

      {/* --------------- 常駐キャラクター --------------- */}
      {/* ※画像・吹き出しは <CharacterAvatar /> 内部で自動フェッチ */}
      <CharacterAvatar initialMood="happy" />
    </>
  );
}

/* ---------- 共通リンク ---------- */
function NavItem({ to, label }) {
  return (
    <Link to={to} style={navLinkStyle}>
      {label}
    </Link>
  );
}

/* ---------- スタイル ---------- */
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