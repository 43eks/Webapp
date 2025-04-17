import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogList from './pages/BlogList';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import ViewBlog from './pages/ViewBlog';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/blogs/create" element={<CreateBlog />} />
          <Route path="/blogs/:id/edit" element={<EditBlog />} />
          <Route path="/blogs/:id" element={<ViewBlog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;