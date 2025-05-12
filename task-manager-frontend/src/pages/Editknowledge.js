import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditKnowledge() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/knowledge/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setTitle(data.title || '');
        setContent(data.content || '');
        setCategory(data.category || '');
        setImageUrl(data.imageUrl || '');
      })
      .catch(err => {
        console.error('❌ 取得エラー:', err);
        alert('記事の取得に失敗しました');
      });
  }, [id]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedImageUrl = imageUrl;

    // 新しい画像があればアップロード
    if (newImageFile) {
      const formData = new FormData();
      formData.append('image', newImageFile);

      try {
        const res = await fetch('http://localhost:8080/upload', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) throw new Error('画像アップロード失敗');
        const data = await res.json();
        updatedImageUrl = data.url;
      } catch (err) {
        console.error('❌ 画像アップロード失敗:', err);
        alert('画像アップロードに失敗しました');
        return;
      }
    }

    // 記事更新リクエスト
    const updatedKnowledge = {
      title,
      content,
      category,
      imageUrl: updatedImageUrl,
      updatedAt: new Date().toISOString()
    };

    fetch(`http://localhost:8080/knowledge/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedKnowledge)
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        navigate('/knowledges');
      })
      .catch(err => {
        console.error('❌ 更新失敗:', err);
        alert('記事の更新に失敗しました');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>✏️ 記事編集</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label>タイトル:</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />

        <label>カテゴリ:</label>
        <input type="text" value={category} onChange={e => setCategory(e.target.value)} style={inputStyle} />

        <label>本文:</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} required style={textareaStyle} />

        <label>画像:</label>
        {imageUrl && (
          <div>
            <img
              src={`http://localhost:8080${imageUrl}`}
              alt="現在の画像"
              style={{ maxWidth: '100%', marginBottom: '10px' }}
            />
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <button type="submit" style={submitButtonStyle}>更新する</button>
      </form>
    </div>
  );
}

// --- スタイル ---
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
 