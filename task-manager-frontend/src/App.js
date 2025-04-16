import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import TaskList from './pages/TaskList';
import CreateTask from './pages/CreateTask';
import TaskDetail from './pages/TaskDetail';
import EditTask from './pages/EditTask';

function App() {
  return (
    <Router>
      <nav style={{ padding: '10px', borderBottom: '1px solid gray' }}>
        <Link to="/" style={{ marginRight: '10px' }}>🏠 ホーム</Link>
        <Link to="/tasks" style={{ marginRight: '10px' }}>📋 タスク一覧</Link>
        <Link to="/create">➕ タスク追加</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/create" element={<CreateTask />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="/tasks/:id/edit" element={<EditTask />} />
      </Routes>
    </Router>
  );
}

export default App;