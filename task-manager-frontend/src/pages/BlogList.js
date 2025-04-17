import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function BlogList() {
  const [blogs, setBlogs] = useState([]);

  // 記事一覧を取得
  const fetchBlogs = () => {
    fetch('http://localhost:8080/api/blogs')
      .then(response => response.json())
      .then(data => setBlogs(data))
      .catch(error => console.error('取得エラー:', error));
  };

  // 初回マウント時に実行
  useEffect(() => {
    fetchBlogs();
  }, []);

  // 削除処理
  const deleteBlog = (id) => {
    if (window.confirm('この記事を削除しますか？')) {
      fetch(`http://localhost:8080/api/blogs/${id}`, {
        method: 'DELETE'
      })
        .then(() => fetchBlogs())
        .catch(error => console.error('削除エラー:', error));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📚 ナレッジ一覧</h2>
      
      <Link to="/blogs/create">
        <button style={buttonStyle}>➕ 新規記事作成</button>
      </Link>

      <div style={{ marginTop: '20px' }}>
        {blogs.length === 0 ? (
          <p>記事がまだありません。</p>
        ) : (
          blogs.map(blog => (
            <div key={blog.id} style={cardStyle}>
              <h3>{blog.title}</h3>
              <p style={{ color: '#666' }}>
                {blog.category || '未分類'} / {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <div style={{ marginTop: '10px' }}>
                <Link to={`/blogs/${blog.id}/edit`}>
                  <button style={smallButtonStyle}>✏️ 編集</button>
                </Link>
                <button onClick={() => deleteBlog(blog.id)} style={smallButtonStyle}>🗑️ 削除</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// スタイル定義
const buttonStyle = {
  padding: '10px 16px',
  fontSize: '16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const cardStyle = {
  border: '1px solid #ddd',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '15px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const smallButtonStyle = {
  marginRight: '10px',
  padding: '6px 10px',
  fontSize: '14px',
  cursor: 'pointer',
  borderRadius: '6px',
  border: '1px solid #ccc',
  backgroundColor: '#f1f1f1'
};

export default BlogList;