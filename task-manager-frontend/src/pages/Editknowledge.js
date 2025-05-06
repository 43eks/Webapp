import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditKnowledge() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      alert('IDが指定されていません');
      navigate('/knowledges');
      return;
    }

    fetch(`http://localhost:8080/knowledge/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category || '');
        setLoading(false);
      })
      .catch(error => {
        console.error('取得エラー:', error);
        alert('記事の取得に失敗しました');
        navigate('/knowledges');
      });
  }, [id, navigate]);

  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedKnowledge = {
      id,
      title,
      content,
      category,
      updatedAt: new Date().toISOString(),
    };

    fetch(`http://localhost:8080/knowledge/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedKnowledge),
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        alert('✅ 更新完了');
        navigate('/knowledges');
      })
      .catch(error => {
        console.error('更新エラー:', error);
        alert('更新に失敗しました');
      });
  };

  if (loading) return <p>読み込み中...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>✏️ 記事を編集</h2>
      <form onSubmit={handleUpdate} style={formStyle}>
        <label>タイトル:</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />

        <label>カテゴリ（任意）:</label>
        <input type="text" value={category} onChange={e => setCategory(e.target.value)} style={inputStyle} />

        <label>本文:</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} required rows={8} style={textareaStyle} />

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

export default EditKnowledge;