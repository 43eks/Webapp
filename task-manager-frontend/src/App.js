// src/App.js
import './App.css';               // ✅ 背景・スタイルのCSSを読み込み
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// 📄 各ページ読み込み
import Home from './pages/Home';
import KnowledgeList from './pages/knowledgeList';
import CreateKnowledge from './pages/Createknowledge';
import EditKnowledge from './pages/Editknowledge';
import ViewKnowledge from './pages/Viewknowledge';
import TaskList from './pages/TaskList';
import CreateTask from './pages/CreateTask';
import TaskDetail from './pages/TaskDetail';
import CreateHabit from './pages/CreateHabit';
import HabitTracker from './pages/HabitTracker';
import MonthlyView from './pages/MonthlyView';
import GoalPage from './pages/GoalPage';
import GoalForm from './pages/GoalForm';
import SlideVideoPage from './pages/SlideVideoPage';
import CharacterUpload from './pages/CharacterUpload';
import DataSourceStep from './pages/DataSourceStep';
import FieldDefinitionStep from './pages/FieldDefinitionStep';
import ModelingStep from './pages/ModelingStep';
import AdviceLogPage from './pages/AdviceLogPage';
import DashboardPage from './pages/DashboardPage';

// 🧍 キャラクター表示
import CharacterAvatar from './components/CharacterAvatar';

// ✅ 共通APIベースURL
export const API_BASE_URL = 'http://localhost:8080';

function App() {
  return (
    <>
      <Router>
        {/* --- ナビゲーションバー --- */}
        <nav style={navBarStyle}>
          <Link to="/" style={navLinkStyle}>🏠 ホーム</Link>
          <Link to="/tasks" style={navLinkStyle}>📝 タスク</Link>
          <Link to="/knowledges" style={navLinkStyle}>📚 ナレッジ</Link>
          <Link to="/habits" style={navLinkStyle}>📅 習慣</Link>
          <Link to="/goals" style={navLinkStyle}>🎯 ゴール</Link>
          <Link to="/slides/create" style={navLinkStyle}>🎞️ スライド</Link>
          <Link to="/character" style={navLinkStyle}>🧍 キャラクター</Link>
          <Link to="/datasource" style={navLinkStyle}>🧬 データソース</Link>
          <Link to="/fields" style={navLinkStyle}>🧩 項目定義</Link>
          <Link to="/modeling" style={navLinkStyle}>🧱 モデリング</Link>
          <Link to="/advice" style={navLinkStyle}>🧠 アドバイス</Link>
          <Link to="/dashboard" style={navLinkStyle}>📊 ダッシュボード</Link>
        </nav>

        {/* --- メイン画面 --- */}
        <main className="app-overlay">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/knowledges" element={<KnowledgeList />} />
            <Route path="/knowledges/create" element={<CreateKnowledge />} />
            <Route path="/knowledges/:id/edit" element={<EditKnowledge />} />
            <Route path="/knowledges/:id" element={<ViewKnowledge />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/create" element={<CreateTask />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route path="/habits" element={<HabitTracker />} />
            <Route path="/habits/create" element={<CreateHabit />} />
            <Route path="/habits/monthly" element={<MonthlyView />} />
            <Route path="/goals" element={<GoalPage />} />
            <Route path="/goals/new" element={<GoalForm />} />
            <Route path="/slides/create" element={<SlideVideoPage />} />
            <Route path="/character" element={<CharacterUpload />} />
            <Route path="/datasource" element={<DataSourceStep />} />
            <Route path="/fields" element={<FieldDefinitionStep />} />
            <Route path="/modeling" element={<ModelingStep />} />
            <Route path="/advice" element={<AdviceLogPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
      </Router>

      {/* --- 常駐キャラクター表示 --- */}
      <CharacterAvatar
        // サーバーから取得した最初の画像URLを props で渡しても良いですし、
        // Component 内で自動フェッチする場合は props は不要です。
        imageUrl="/uploads/your-uploaded-character.png"
        message="今日もがんばろう！"
        mood="happy"
      />
    </>
  );
}

// --- ナビゲーションバー用スタイル ---
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