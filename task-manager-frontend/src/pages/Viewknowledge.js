import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function ViewKnowledge() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [knowledge, setKnowledge] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/knowledge/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setKnowledge(data))
      .catch(err => {
        console.error('❌ 詳細取得エラー:', err);
        alert('記事の取得に失敗しました');
      });
  }, [id]);

  const handleDelete = () => {
    if (!id) return;
    if (window.confirm('この記事を削除しますか？')) {
      fetch(`http://localhost:8080/knowledge/${id}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          navigate('/knowledges');
        })
        .catch(err => {
          console.error('❌ 削除エラー:', err);
          alert('削除に失敗しました');
        });
    }
  };

  if (!knowledge) return <div style={{ padding: '20px' }}>読み込み中...</div>;

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: '10px' }}>{knowledge.title}</h2>
      <p style={{ color: '#666' }}>
        {knowledge.category || '未分類'} /{' '}
        {knowledge.createdAt ? new Date(knowledge.createdAt).toLocaleDateString() : '日付不明'}
      </p>

      {knowledge.image && (
        <img
          src={knowledge.image}
          alt="記事の画像"
          style={{
            width: '100%',
            maxWidth: '600px',
            height: 'auto',
            borderRadius: '12px',
            marginTop: '20px'
          }}
        />
      )}

      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
        {knowledge.content}
      </div>

      <div style={{ marginTop: '30px' }}>
        <Link to={`/knowledges/${id}/edit`}>
          <button style={buttonStyle}>✏️ 編集</button>
        </Link>
        <button onClick={handleDelete} style={{ ...buttonStyle, backgroundColor: '#e53935' }}>
          🗑️ 削除
        </button>
      </div>
    </div>
  );
}

const containerStyle = {
  padding: '20px',
  maxWidth: '800px',
  margin: '0 auto',
  backgroundColor: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
};

const buttonStyle = {
  marginRight: '10px',
  padding: '10px 16px',
  backgroundColor: '#2196F3',
  color: '#fff',
  fontSize: '16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

export default ViewKnowledge;