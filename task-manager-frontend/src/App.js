import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BlogList from './pages/BlogList';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import ViewBlog from './pages/ViewBlog';
import Home from './pages/Home'; // ← 機能選択ページを読み込む

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
          <Route path="/" element={<Home />} /> {/* ← ホームを機能選択ページに変更 */}
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blogs/create" element={<CreateBlog />} />
          <Route path="/blogs/:id/edit" element={<EditBlog />} />
          <Route path="/blogs/:id" element={<ViewBlog />} />
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