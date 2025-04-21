import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import KnowledgeList from './pages/KnowledgeList';        // ナレッジ一覧
import CreateKnowledge from './pages/CreateKnowledge';    // ナレッジ作成
import EditKnowledge from './pages/EditKnowledge';        // ナレッジ編集
import ViewKnowledge from './pages/ViewKnowledge';        // ナレッジ詳細

import Home from './pages/Home';                          // ホーム画面

import TaskList from './pages/TaskList';                  // タスク一覧
import CreateTask from './pages/CreateTask';              // タスク追加
import TaskDetail from './pages/TaskDetail';              // タスク詳細 ← 追加！

// ✅ 共通APIエンドポイント
export const API_BASE_URL = 'http://localhost:8080';

function App() {
  return (
    <Router>
      {/* ナビゲーションバー */}
      <div style={{ padding: '10px', backgroundColor: '#eee' }}>
        <Link to="/" style={navLinkStyle}>🏠 ホーム</Link>
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
          <Route path="/tasks/:id" element={<TaskDetail />} /> {/* ← これが警告解消の鍵！ */}
        </Routes>
      </div>
    </Router>
  );
}

const navLinkStyle = {
  textDecoration: 'none',
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold'
};

export default App;