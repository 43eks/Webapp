import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import TaskList from './pages/TaskList';
import CreateTask from './pages/CreateTask';
import TaskDetail from './pages/TaskDetail';
import EditTask from './pages/EditTask';
import BlogList from './pages/BlogList'; // 新規追加

function App() {
  return (
    <Router>
      <nav style={{
        padding: '10px 20px',
        borderBottom: '1px solid #ccc',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        gap: '15px',
        alignItems: 'center'
      }}>
        <Link to="/" style={navLinkStyle}>🏠 ホーム</Link>
        <Link to="/tasks" style={navLinkStyle}>📋 タスク一覧</Link>
        <Link to="/create" style={navLinkStyle}>➕ タスク追加</Link>
        <Link to="/blogs" style={navLinkStyle}>📚 ナレッジ</Link>
        {/* 今後追加予定のリンクをコメントで残すのも◎ */}
        {/* <Link to="/habits">🔥 習慣</Link> */}
        {/* <Link to="/diary">📔 日記</Link> */}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/create" element={<CreateTask />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="/tasks/:id/edit" element={<EditTask />} />
        <Route path="/blogs" element={<BlogList />} /> {/* 新規追加ルート */}
      </Routes>
    </Router>
  );
}

const navLinkStyle = {
  textDecoration: 'none',
  color: '#333',
  fontWeight: 'bold',
  padding: '8px 12px',
  borderRadius: '6px',
  transition: 'background-color 0.3s',
};

export default App;