import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function KnowledgeList() {
  const [knowledges, setKnowledges] = useState([]);

  const fetchKnowledges = () => {
    fetch('http://localhost:8080/knowledge')
      .then(res => res.json())
      .then(data => {
        const valid = data.filter(k => typeof k.id === 'string' && k.id.trim() !== '');
        setKnowledges(valid);
      })
      .catch(err => console.error('❌ 取得エラー:', err));
  };

  useEffect(() => {
    fetchKnowledges();
  }, []);

  const deleteKnowledge = (id) => {
    if (!id) return;
    if (window.confirm('この記事を削除しますか？')) {
      fetch(`http://localhost:8080/knowledge/${id}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          fetchKnowledges();
        })
        .catch(err => console.error('❌ 削除エラー:', err));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📚 ナレッジ一覧</h2>

      <Link to="/knowledges/create">
        <button style={buttonStyle}>➕ 新規記事作成</button>
      </Link>

      <div style={gridStyle}>
        {knowledges.length === 0 ? (
          <p>記事がまだありません。</p>
        ) : (
          knowledges.map(k => (
            <div key={k.id} style={cardStyle}>
              {Array.isArray(k.images) && k.images.length > 0 && (
                <img
                  src={`http://localhost:8080${k.images[0]}`}
                  alt="thumbnail"
                  style={imageStyle}
                />
              )}
              <h3 style={{ margin: '10px 0' }}>{k.title}</h3>
              <p style={{ color: '#666' }}>
                {k.category || '未分類'} /{' '}
                {k.createdAt ? new Date(k.createdAt).toLocaleDateString() : '日付不明'}
              </p>
              <div style={{ marginTop: '10px' }}>
                <Link to={`/knowledges/${k.id}/edit`}>
                  <button style={smallButton}>✏️ 編集</button>
                </Link>{' '}
                <button onClick={() => deleteKnowledge(k.id)} style={smallButton}>
                  🗑️ 削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  fontSize: '16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  marginBottom: '20px'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '20px'
};

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '12px',
  backgroundColor: '#fff',
  padding: '15px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
  textAlign: 'center'
};

const imageStyle = {
  width: '100%',
  height: '180px',
  objectFit: 'cover',
  borderRadius: '8px'
};

const smallButton = {
  padding: '6px 12px',
  margin: '0 5px',
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default KnowledgeList;