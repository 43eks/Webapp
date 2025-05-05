import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// 🏠 ホーム画面
import Home from './pages/Home';

// 📚 ナレッジ関連
import KnowledgeList from './pages/knowledgeList';
import CreateKnowledge from './pages/Createknowledge';
import EditKnowledge from './pages/Editknowledge';
import ViewKnowledge from './pages/Viewknowledge';

// 📝 タスク管理
import TaskList from './pages/TaskList';
import CreateTask from './pages/CreateTask';
import TaskDetail from './pages/TaskDetail';

// 📅 習慣トラッカー
import CreateHabit from './pages/CreateHabit';
import HabitTracker from './pages/HabitTracker';
import MonthlyView from './pages/MonthlyView';

// 🎯 ゴール管理
import GoalPage from './pages/GoalPage';
import GoalForm from './pages/GoalForm';

// 🎞️ スライド動画作成
import SlideVideoPage from './pages/SlideVideoPage';

// 🧍 キャラクター画像アップロード
import CharacterUpload from './pages/CharacterUpload';

// ✅ 共通APIベースURL（バックエンドと同一ポートであること）
export const API_BASE_URL = 'http://localhost:8080';

function App() {
  return (
    <Router>
      {/* --- ナビゲーションバー --- */}
      <nav style={{ padding: '10px', backgroundColor: '#eee' }}>
        <Link to="/" style={navLinkStyle}>🏠 ホーム</Link>
        <Link to="/tasks" style={navLinkStyle}>📝 タスク</Link>
        <Link to="/knowledges" style={navLinkStyle}>📚 ナレッジ</Link>
        <Link to="/habits" style={navLinkStyle}>📅 習慣</Link>
        <Link to="/goals" style={navLinkStyle}>🎯 ゴール</Link>
        <Link to="/slides/create" style={navLinkStyle}>🎞️ スライド作成</Link>
        <Link to="/character" style={navLinkStyle}>🧍 キャラクター</Link>
      </nav>

      {/* --- ページルーティング --- */}
      <main style={{ padding: '20px' }}>
        <Routes>
          {/* ホーム */}
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
          <Route path="/habits" element={<HabitTracker />} />
          <Route path="/habits/create" element={<CreateHabit />} />
          <Route path="/habits/monthly" element={<MonthlyView />} />

          {/* ゴール */}
          <Route path="/goals" element={<GoalPage />} />
          <Route path="/goals/new" element={<GoalForm />} />

          {/* スライド作成 */}
          <Route path="/slides/create" element={<SlideVideoPage />} />

          {/* キャラクター画像アップロード */}
          <Route path="/character" element={<CharacterUpload />} />
        </Routes>
      </main>
    </Router>
  );
}

// --- ナビゲーション用スタイル ---
const navLinkStyle = {
  textDecoration: 'none',
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  marginRight: '10px'
};

export default App;