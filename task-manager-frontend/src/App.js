// src/App.js
import './App.css';                          // 共通スタイル
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

/* 既存ページ */
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

/* ⬇︎ 新しく追加した「上流工程支援モジュール」 */
import UpstreamDashboard    from './pages/upstream/UpstreamDashboard';

import CharacterAvatar      from './components/CharacterAvatar';

export const API_BASE_URL = 'http://localhost:8080';

/* ---------------------------------- */

function App() {
  return (
    <>
      <Router>
        {/* ナビゲーションバー */}
        <nav style={navBarStyle}>
          <NavLink to="/"             label="🏠 ホーム"      />
          <NavLink to="/tasks"        label="📝 タスク"      />
          <NavLink to="/knowledges"   label="📚 ナレッジ"    />
          <NavLink to="/habits"       label="📅 習慣"        />
          <NavLink to="/goals"        label="🎯 ゴール"      />
          <NavLink to="/slides/create"label="🎞️ スライド"   />
          <NavLink to="/character"    label="🧍 キャラクター"/>
          <NavLink to="/datasource"   label="🧬 データソース"/>
          <NavLink to="/fields"       label="🧩 項目定義"    />
          <NavLink to="/modeling"     label="🧱 モデリング"  />
          <NavLink to="/advice"       label="🧠 アドバイス"  />
          <NavLink to="/dashboard"    label="📊 ダッシュボード"/>
          {/* ★ 上流工程 */}
          <NavLink to="/upstream"     label="🛠 上流工程"    />
        </nav>

        {/* メインルーティング */}
        <main className="app-overlay">
          <Routes>
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
            {/* キャラクター */}
            <Route path="/character"              element={<CharacterUpload />} />
            {/* DWH */}
            <Route path="/datasource"             element={<DataSourceStep />} />
            <Route path="/fields"                 element={<FieldDefinitionStep />} />
            <Route path="/modeling"               element={<ModelingStep />} />
            {/* アドバイス・ダッシュボード */}
            <Route path="/advice"                 element={<AdviceLogPage />} />
            <Route path="/dashboard"              element={<DashboardPage />} />
            {/* ★ 上流工程支援 */}
            <Route path="/upstream/*"             element={<UpstreamDashboard />} />
          </Routes>
        </main>
      </Router>

      {/* 画面右下に常駐するキャラクター */}
      {/* ※ CharacterAvatar 内部で画像とコメントをフェッチする実装に合わせて props は最小限 */}
      <CharacterAvatar initialMood="happy" />
    </>
  );
}

/* 共通リンク生成コンポーネント */
function NavLink({ to, label }) {
  return <Link to={to} style={navLinkStyle}>{label}</Link>;
}

/* --- スタイル --- */
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

export default App;