import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditKnowledge() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/knowledge/${id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title);
        setCategory(data.category);
        setContent(data.content);
        setImage(data.image || '');
        setPreviewURL(data.image || '');
      })
      .catch(err => {
        console.error('❌ 詳細取得エラー:', err);
        alert('記事の取得に失敗しました');
      });
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImageFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const confirmImageDelete = () => {
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const handleImageDelete = async () => {
    setShowConfirm(false);
    if (!image) return;
    const filename = image.split('/').pop();
    const res = await fetch(`http://localhost:8080/character/${filename}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      setImage('');
      setPreviewURL('');
      setNewImageFile(null);
      alert('画像を削除しました');
    } else {
      alert('画像の削除に失敗しました');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = image;

    if (newImageFile) {
      const formData = new FormData();
      formData.append('image', newImageFile);

      const uploadRes = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadRes.ok) {
        alert('画像のアップロードに失敗しました');
        return;
      }

      const uploadData = await uploadRes.json();
      imageUrl = uploadData.url;
    }

    const updatedKnowledge = {
      title,
      category,
      content,
      image: imageUrl || '',
      updatedAt: new Date().toISOString()
    };

    fetch(`http://localhost:8080/knowledge/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedKnowledge)
    })
      .then(res => {
        if (!res.ok) throw new Error();
        navigate(`/knowledges`);
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
        {previewURL && (
          <div>
            <img src={previewURL} alt="プレビュー" style={imagePreviewStyle} />
            <button type="button" onClick={confirmImageDelete} style={deleteButtonStyle}>🗑️ 画像を削除</button>
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <button type="submit" style={submitButtonStyle}>更新する</button>
      </form>

      {/* 確認モーダル */}
      {showConfirm && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <p>本当に画像を削除しますか？</p>
            <div>
              <button onClick={handleImageDelete} style={{ ...submitButtonStyle, marginRight: '10px' }}>削除する</button>
              <button onClick={cancelDelete} style={{ ...deleteButtonStyle, backgroundColor: '#999' }}>キャンセル</button>
            </div>
          </div>
        </div>
      )}
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

const imagePreviewStyle = {
  width: '100%',
  maxWidth: '400px',
  marginTop: '10px',
  borderRadius: '8px'
};

const deleteButtonStyle = {
  marginTop: '10px',
  padding: '6px 10px',
  backgroundColor: '#dc2626',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
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

const modalOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1050
 
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  textAlign: 'center'
};

export default EditKnowledge;