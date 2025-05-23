import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sortable from 'sortablejs';

function CreateKnowledge() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const previewRef = useRef(null);
  const navigate = useNavigate();

  // 画像アップロード処理
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
      setImageUrls(prev => [...prev, ...(data.urls || [])]);
    } catch (error) {
      console.error('画像アップロードエラー:', error);
      alert('画像のアップロードに失敗しました');
    }
  };

  // 並べ替え機能
  useEffect(() => {
    if (!previewRef.current || imageUrls.length === 0) return;

    const sortable = Sortable.create(previewRef.current, {
      animation: 150,
      onEnd: (evt) => {
        const updated = [...imageUrls];
        const [moved] = updated.splice(evt.oldIndex, 1);
        updated.splice(evt.newIndex, 0, moved);
        setImageUrls(updated);
      }
    });

    return () => sortable.destroy();
  }, [imageUrls]);

  // 投稿処理
  const handleSubmit = (e) => {
    e.preventDefault();

    const newBlog = {
      title,
      content,
      category,
      images: imageUrls,
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

  // 画像の削除
  const handleRemoveImage = (index) => {
    const updated = [...imageUrls];
    updated.splice(index, 1);
    setImageUrls(updated);
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

        {/* プレビューと並べ替え */}
        {imageUrls.length > 0 && (
          <div ref={previewRef} style={previewListStyle}>
            {imageUrls.map((url, index) => (
              <div key={index} style={previewItemStyle}>
                <img src={`http://localhost:8080${url}`} alt={`preview-${index}`} style={imageStyle} />
                <button type="button" onClick={() => handleRemoveImage(index)} style={removeButtonStyle}>×</button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" style={submitButtonStyle}>投稿する</button>
      </form>
    </div>
  );
}

// --- スタイル定義 ---
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

const previewListStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginTop: '10px'
};

const previewItemStyle = {
  position: 'relative'
};

const imageStyle = {
  maxWidth: '150px',
  borderRadius: '6px'
};

const removeButtonStyle = {
  position: 'absolute',
  top: '-8px',
  right: '-8px',
  background: 'red',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '24px',
  height: '24px',
  cursor: 'pointer'
};

export default CreateKnowledge;
