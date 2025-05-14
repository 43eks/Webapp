import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sortable from 'sortablejs';

function EditKnowledge() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const imageListRef = useRef(null);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/knowledge/${id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title);
        setCategory(data.category);
        setContent(data.content);
        setImages(data.images || []);
      })
      .catch(err => {
        console.error('❌ 詳細取得エラー:', err);
        alert('記事の取得に失敗しました');
      });
  }, [id]);

  useEffect(() => {
    if (imageListRef.current) {
      Sortable.create(imageListRef.current, {
        animation: 150,
        onEnd: ({ oldIndex, newIndex }) => {
          const reordered = [...images];
          const [moved] = reordered.splice(oldIndex, 1);
          reordered.splice(newIndex, 0, moved);
          setImages(reordered);
        }
      });
    }
  }, [images]);

  const handleNewImageChange = async (e) => {
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
      setImages([...images, ...(data.urls || [])]);
    } catch (error) {
      console.error('画像アップロードエラー:', error);
      alert('画像のアップロードに失敗しました');
    }
  };

  const handleImageDelete = (url) => {
    if (!window.confirm('この画像を削除しますか？')) return;
    const fileName = url.split('/').pop();
    fetch(`http://localhost:8080/character/${fileName}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setImages(images.filter(img => img !== url));
        } else {
          alert('削除に失敗しました');
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedKnowledge = {
      title,
      category,
      content,
      images,
      updatedAt: new Date().toISOString()
    };

    fetch(`http://localhost:8080/knowledge/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedKnowledge)
    })
      .then(res => {
        if (!res.ok) throw new Error();
        navigate('/knowledges');
      })
      .catch(err => {
        console.error('❌ 更新エラー:', err);
        alert('記事の更新に失敗しました');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>✏️ 記事を編集</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label>タイトル:</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />

        <label>カテゴリ:</label>
        <input type="text" value={category} onChange={e => setCategory(e.target.value)} style={inputStyle} />

        <label>本文:</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} required style={textareaStyle} />

        <label>画像:</label>
        <div ref={imageListRef} style={imageListStyle}>
          {images.map((url, index) => (
            <div key={index} style={imageItemStyle}>
              <img src={`http://localhost:8080${url}`} alt={`img-${index}`} style={imageStyle} />
              <button type="button" onClick={() => handleImageDelete(url)} style={deleteButtonStyle}>🗑️</button>
            </div>
          ))}
        </div>

        <input type="file" accept="image/*" multiple onChange={handleNewImageChange} />

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

const imageListStyle = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
  marginBottom: '10px'
};

const imageItemStyle = {
  position: 'relative'
};

const imageStyle = {
  maxWidth: '150px',
  borderRadius: '6px'
};

const deleteButtonStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: '#dc2626',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
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

export default EditKnowledge;