import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BlogList from './pages/knowledgeList';  // ナレッジ一覧ページ
import CreateBlog from './pages/Createknowledge';  // ナレッジ作成ページ
import EditBlog from './pages/Editknowledge';  // ナレッジ編集ページ
import ViewBlog from './pages/Viewknowledge';  // ナレッジ詳細表示ページ
import Home from './pages/Home';  // 機能選択ページ
import TaskList from './pages/TaskList';  // タスク一覧ページ
import CreateTask from './pages/CreateTask';  // タスク追加ページ

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
          <Route path="/knowledges" element={<BlogList />} />
          <Route path="/knowledges/create" element={<CreateBlog />} />
          <Route path="/knowledges/:id/edit" element={<EditBlog />} />
          <Route path="/knowledges/:id" element={<ViewBlog />} />
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