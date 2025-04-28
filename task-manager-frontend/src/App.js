import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import KnowledgeList from './pages/knowledgeList';        // ナレッジ一覧
import CreateKnowledge from './pages/Createknowledge';    // ナレッジ作成
import EditKnowledge from './pages/Editknowledge';        // ナレッジ編集
import ViewKnowledge from './pages/Viewknowledge';        // ナレッジ詳細

import Home from './pages/Home';                          // ホーム画面

import TaskList from './pages/TaskList';                  // タスク一覧
import CreateTask from './pages/CreateTask';              // タスク追加
import TaskDetail from './pages/TaskDetail';              // タスク詳細

import CreateHabit from './pages/CreateHabit';            // 習慣追加
import HabitTracker from './pages/HabitTracker';          // 習慣トラッカー一覧
import MonthlyView from './pages/MonthlyView';            // 月間ビュー

import GoalPage from './pages/GoalPage';                  // 🎯 ゴール一覧
import GoalForm from './pages/GoalForm';                  // ➕ ゴール作成 ← ✅ 新規追加！

// ✅ 共通APIエンドポイント
export const API_BASE_URL = 'http://localhost:8080';

function App() {
  return (
    <Router>
      {/* ナビゲーションバー */}
      <div style={{ padding: '10px', backgroundColor: '#eee' }}>
        <Link to="/" style={navLinkStyle}>🏠 ホーム</Link>{' '}
        <Link to="/tasks" style={navLinkStyle}>📝 タスク</Link>{' '}
        <Link to="/knowledges" style={navLinkStyle}>📚 ナレッジ</Link>{' '}
        <Link to="/habits" style={navLinkStyle}>📅 習慣</Link>{' '}
        <Link to="/goals" style={navLinkStyle}>🎯 ゴール</Link> {/* ← ✅ 追加済み */}
      </div>

      {/* ページルーティング */}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* ナレッジ機能 */}
          <Route path="/knowledges" element={<KnowledgeList />} />
          <Route path="/knowledges/create" element={<CreateKnowledge />} />
          <Route path="/knowledges/:id/edit" element={<EditKnowledge />} />
          <Route path="/knowledges/:id" element={<ViewKnowledge />} />

          {/* タスク機能 */}
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/create" element={<CreateTask />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />

          {/* 習慣トラッカー機能 */}
          <Route path="/habits/create" element={<CreateHabit />} />
          <Route path="/habits" element={<HabitTracker />} />
          <Route path="/habits/monthly" element={<MonthlyView />} />

          {/* 🎯 ゴール管理機能 */}
          <Route path="/goals" element={<GoalPage />} />
          <Route path="/goals/new" element={<GoalForm />} /> {/* ← ✅ ゴール作成ページ追加 */}
        </Routes>
      </div>
    </Router>
  );
}

const navLinkStyle = {
  textDecoration: 'none',
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  marginRight: '10px'
};

export default App;