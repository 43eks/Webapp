import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateKnowledge() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  // 画像アップロード処理
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setImageUrl(data.url);
    } catch (error) {
      console.error('画像アップロードエラー:', error);
      alert('画像のアップロードに失敗しました');
    }
  };

  // 投稿処理
  const handleSubmit = (e) => {
    e.preventDefault();

    const newBlog = {
      title,
      content,
      category,
      imageUrl, // ✅ 画像パスも保存
      createdAt: new Date().toISOString()
    };

    fetch('http://localhost:8080/knowledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBlog)
    })
      .then(response => {
        if (response.ok) {
          navigate('/knowledges');
        } else {
          alert('記事の作成に失敗しました');
        }
      })
      .catch(error => {
        console.error('エラー:', error);
        alert('エラーが発生しました');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>➕ 新規記事作成</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label>タイトル:</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />

        <label>カテゴリ（任意）:</label>
        <input type="text" value={category} onChange={e => setCategory(e.target.value)} style={inputStyle} />

        <label>本文:</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} required style={textareaStyle} />

        <label>画像を添付:</label>
        <input type="file" onChange={handleImageChange} accept="image/*" />

        {imageUrl && (
          <img
            src={`http://localhost:8080${imageUrl}`}
            alt="プレビュー"
            style={{ maxWidth: '300px', marginTop: '10px' }}
          />
        )}

        <button type="submit" style={submitButtonStyle}>投稿する</button>
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
  backgroundColor: '#4CAF50',
  color: '#fff',
  fontSize: '16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

export default CreateKnowledge;