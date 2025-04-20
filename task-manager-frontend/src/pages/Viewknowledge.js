import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ViewBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/blogs/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('記事が見つかりません');
        }
        return response.json();
      })
      .then(data => setBlog(data))
      .catch(error => {
        console.error('取得エラー:', error);
        alert('記事の取得に失敗しました');
      });
  }, [id]);

  if (!blog) {
    return <p style={{ padding: '20px' }}>読み込み中...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>{blog.title}</h2>
      <p><strong>カテゴリ:</strong> {blog.category || '未分類'}</p>
      <p><strong>作成日:</strong> {new Date(blog.createdAt).toLocaleDateString()}</p>
      <div style={contentStyle}>
        {blog.content}
      </div>
      <div style={{ marginTop: '20px' }}>
        <Link to={`/blogs/${blog.id}/edit`}>
          <button style={buttonStyle}>✏️ 編集</button>
        </Link>
        <Link to="/blogs">
          <button style={backButtonStyle}>← 戻る</button>
        </Link>
      </div>
    </div>
  );
}

const contentStyle = {
  marginTop: '20px',
  padding: '10px',
  backgroundColor: '#f9f9f9',
  border: '1px solid #ccc',
  borderRadius: '6px',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap'
};

const buttonStyle = {
  marginRight: '10px',
  padding: '8px 14px',
  fontSize: '14px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  backgroundColor: '#ffecb3',
  cursor: 'pointer'
};

const backButtonStyle = {
  padding: '8px 14px',
  fontSize: '14px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  backgroundColor: '#f1f1f1',
  cursor: 'pointer'
};

export default ViewBlog;