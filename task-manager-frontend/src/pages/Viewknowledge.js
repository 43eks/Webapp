import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ViewKnowledge() {
  const { id } = useParams();
  const [knowledge, setKnowledge] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/knowledge/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setKnowledge(data))
      .catch(err => {
        console.error('❌ 取得エラー:', err);
        alert('記事の取得に失敗しました');
      });
  }, [id]);

  if (!knowledge) {
    return <p>読み込み中...</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>{knowledge.title}</h2>
      <p style={{ color: '#555' }}>
        カテゴリ: {knowledge.category || '未分類'}<br />
        投稿日: {new Date(knowledge.createdAt).toLocaleDateString()}
      </p>

      {/* 添付画像の表示 */}
      {knowledge.imageUrl && (
        <img
          src={`http://localhost:8080${knowledge.imageUrl}`}
          alt="添付画像"
          style={{ maxWidth: '100%', marginTop: '20px', borderRadius: '8px' }}
        />
      )}

      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
        {knowledge.content}
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link to={`/knowledges/${id}/edit`}>
          <button style={buttonStyle}>✏️ 編集</button>
        </Link>
        <Link to="/knowledges" style={{ marginLeft: '10px' }}>
          <button style={buttonStyle}>⬅️ 戻る</button>
        </Link>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  cursor: 'pointer'
};

export default ViewKnowledge;