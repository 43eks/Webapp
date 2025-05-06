import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditKnowledge() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

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
      })
      .catch(error => {
        console.error('取得エラー:', error);
        alert('記事の取得に失敗しました');
      });
  }, [id, navigate]);

  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedknowledge = {
      title,
      content,
      category,
      updatedAt: new Date().toISOString()
    };

    fetch(`http://localhost:8080/knowledge/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedknowledge)
    })
      .then(res => {
        if (res.ok) {
          navigate('/knowledges');
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
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '600px' }}>
        <label>タイトル:</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />

        <label>カテゴリ（任意）:</label>
        <input type="text" value={category} onChange={e => setCategory(e.target.value)} />

        <label>本文:</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} required rows={8} />

        <button type="submit">更新する</button>
      </form>
    </div>
  );
}

export default EditKnowledge;