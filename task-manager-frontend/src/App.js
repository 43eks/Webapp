
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreateTask from './pages/CreateTask';

function App() {
  return (
    <Router>
      <nav style={{ padding: '10px', borderBottom: '1px solid gray' }}>
        <Link to="/" style={{ marginRight: '10px' }}>ホーム</Link>
        <Link to="/create">タスク追加</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateTask />} />
      </Routes>
    </Router>
  );
}

export default App;