import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogList from './components/BlogList';
import CreateBlog from './components/CreateBlog'; // まだ未実装なら後ほど作成します

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/blogs/create" element={<CreateBlog />} />
          {/* 今後編集ページを追加するときはこちらも追加 */}
          {/* <Route path="/blogs/:id/edit" element={<EditBlog />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;