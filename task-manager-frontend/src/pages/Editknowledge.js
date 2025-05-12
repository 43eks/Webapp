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
  const [removeImage, setRemoveImage] = useState(false);

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
      setRemoveImage(false); // 新規画像選択時は削除フラグを解除
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setRemoveImage(true);
    setNewImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedImageUrl = imageUrl;

    if (removeImage) {
      updatedImageUrl = '';
    } else if (newImageFile) {
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
        {imageUrl && !removeImage && (
          <div style={{ marginBottom: '10px' }}>
            <img
              src={`http://localhost:8080${imageUrl}`}
              alt="現在の画像"
              style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '6px' }}
            />
            <br />
            <button type="button" onClick={handleRemoveImage} style={removeButtonStyle}>
              🗑️ 画像を削除
            </button>
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
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const removeButtonStyle = {
  marginTop: '8px',
  padding: '6px 12px',
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default EditKnowledge;