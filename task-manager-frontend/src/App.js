import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import KnowledgeList from './pages/knowledgeList';
import CreateKnowledge from './pages/Createknowledge';
import EditKnowledge from './pages/Editknowledge';
import ViewKnowledge from './pages/Viewknowledge';

import Home from './pages/Home';

import TaskList from './pages/TaskList';
import CreateTask from './pages/CreateTask';
import TaskDetail from './pages/TaskDetail';

import CreateHabit from './pages/CreateHabit';
import HabitTracker from './pages/HabitTracker';
import MonthlyView from './pages/MonthlyView';

import GoalPage from './pages/GoalPage';
import GoalForm from './pages/GoalForm';

import SlideVideoPage from './pages/SlideVideoPage';      // 🎞️ スライド動画ページ
import CharacterUpload from './pages/CharacterUpload';    // 🧍 キャラクターアップロード

// ✅ APIベースURL（バックエンドとポートが一致しているか確認）
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
        <Link to="/goals" style={navLinkStyle}>🎯 ゴール</Link>{' '}
        <Link to="/slides/create" style={navLinkStyle}>🎞️ スライド作成</Link>{' '}
        <Link to="/character" style={navLinkStyle}>🧍 キャラクター</Link>
      </div>

      {/* ページルーティング */}
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* ナレッジ */}
          <Route path="/knowledges" element={<KnowledgeList />} />
          <Route path="/knowledges/create" element={<CreateKnowledge />} />
          <Route path="/knowledges/:id/edit" element={<EditKnowledge />} />
          <Route path="/knowledges/:id" element={<ViewKnowledge />} />

          {/* タスク */}
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/create" element={<CreateTask />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />

          {/* 習慣 */}
          <Route path="/habits/create" element={<CreateHabit />} />
          <Route path="/habits" element={<HabitTracker />} />
          <Route path="/habits/monthly" element={<MonthlyView />} />

          {/* ゴール */}
          <Route path="/goals" element={<GoalPage />} />
          <Route path="/goals/new" element={<GoalForm />} />

          {/* スライド動画 */}
          <Route path="/slides/create" element={<SlideVideoPage />} />

          {/* キャラクター */}
          <Route path="/character" element={<CharacterUpload />} />
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