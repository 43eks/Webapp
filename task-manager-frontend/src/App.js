import './App.css'; // ✅ 背景・スタイルのCSSを読み込み
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

// 🧬 DWHデータソースステップ1
import DataSourceStep from './pages/DataSourceStep'; // ✅ 追加

// 🧩 DWHデータ項目定義ステップ2
import FieldDefinitionStep from './pages/FieldDefinitionStep'; // ✅ 追加

// ✅ 共通APIベースURL
export const API_BASE_URL = 'http://localhost:8080';

function App() {
  return (
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
        <Link to="/datasource" style={navLinkStyle}>🧬 データソース</Link> {/* ✅ 追加 */}
        <Link to="/fields" style={navLinkStyle}>🧩 項目定義</Link> {/* ✅ ステップ2への追加リンク */}
      </nav>

      {/* --- 背景オーバーレイ付きメイン画面 --- */}
      <main className="app-overlay">
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

          {/* スライド */}
          <Route path="/slides/create" element={<SlideVideoPage />} />

          {/* キャラクター */}
          <Route path="/character" element={<CharacterUpload />} />

          {/* ✅ DWH機能 */}
          <Route path="/datasource" element={<DataSourceStep />} />
          <Route path="/fields" element={<FieldDefinitionStep />} /> {/* ✅ ステップ2追加 */}
        </Routes>
      </main>
    </Router>
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