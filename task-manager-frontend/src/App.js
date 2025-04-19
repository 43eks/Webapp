import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BlogList from './pages/knowledgeList';
import CreateBlog from './pages/Createknowledge';
import EditBlog from './pages/Editknowledge';
import ViewBlog from './pages/Viewknowledge';
import Home from './pages/Home'; // 機能選択ページ
import TaskList from './pages/TaskList'; // ← タスク一覧ページ
import CreateTask from './pages/CreateTask'; // ← タスク追加ページ

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
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blogs/create" element={<CreateBlog />} />
          <Route path="/blogs/:id/edit" element={<EditBlog />} />
          <Route path="/blogs/:id" element={<ViewBlog />} />
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