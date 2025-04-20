import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import KnowledgeList from './pages/knowledgeList';  // ナレッジ一覧ページ
import Createknowledge from './pages/Createknowledge';  // ナレッジ作成ページ
import Editknowledge from './pages/Editknowledge';  // ナレッジ編集ページ
import Viewknowledge from './pages/Viewknowledge';  // ナレッジ詳細表示ページ
import Home from './pages/Home';  // 機能選択ページ
import TaskList from './pages/TaskList';  // タスク一覧ページ
import CreateTask from './pages/CreateTask';  // タスク追加ページ

// ✅ ここに追加（どのファイルからでも使えるように後でexportしてもOK）
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
          <Route path="/knowledges/create" element={<Createknowledge />} />
          <Route path="/knowledges/:id/edit" element={<Editknowledge />} />
          <Route path="/knowledges/:id" element={<Viewknowledge />} />
          {/* タスク機能 */}
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/create" element={<CreateTask />} />
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