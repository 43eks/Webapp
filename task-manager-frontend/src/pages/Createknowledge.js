import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateKnowledge() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const navigate = useNavigate();

  // 複数画像アップロード処理
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      const res = await fetch('http://localhost:8080/upload/multiple', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setImageUrls(data.urls || []);
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
      images: imageUrls, // ✅ 複数画像を配列で送信
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

        <label>画像を添付（複数可）:</label>
        <input type="file" onChange={handleImageChange} accept="image/*" multiple />

        {/* アップロード済み画像のプレビュー */}
        {imageUrls.length > 0 && (
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={`http://localhost:8080${url}`}
                alt={`preview-${index}`}
                style={{ maxWidth: '150px', borderRadius: '6px' }}
              />
            ))}
          </div>
        )}

        <button type="submit" style={submitButtonStyle}>投稿する</button>
      </form>
    </div>
  );
}

// スタイル
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