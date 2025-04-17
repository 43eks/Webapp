import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8080/api/blogs/${id}`)
      .then(response => response.json())
      .then(data => {
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category || '');
      })
      .catch(error => {
        console.error('取得エラー:', error);
        alert('記事の取得に失敗しました');
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedBlog = {
      title,
      content,
      category,
      updatedAt: new Date().toISOString()
    };

    fetch(`http://localhost:8080/api/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBlog)
    })
      .then(response => {
        if (response.ok) {
          navigate('/');
        } else {
          alert('更新に失敗しました');
        }
      })
      .catch(error => {
        console.error('更新エラー:', error);
        alert('更新時にエラーが発生しました');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>✏️ 記事を編集</h2>
      <form onSubmit={handleUpdate} style={formStyle}>
        <label>タイトル:</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />

        <label>カテゴリ（任意）:</label>
        <input type="text" value={category} onChange={e => setCategory(e.target.value)} style={inputStyle} />

        <label>本文:</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} required style={textareaStyle} />

        <button type="submit" style={submitButtonStyle}>更新する</button>
      </form>
    </div>
  );
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  maxWidth: '600px'
};

const inputStyle = {
  padding: '8px',
  fontSize: '16px'
};

const textareaStyle = {
  padding: '8px',
  fontSize: '16px',
  minHeight: '150px'
};

const submitButtonStyle = {
  marginTop: '10px',
  padding: '10px',
  backgroundColor: '#2196F3',
  color: '#fff',
  fontSize: '16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

export default EditBlog;