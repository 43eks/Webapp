import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function KnowledgeList() {
  const [knowledges, setKnowledges] = useState([]);

  // 記事一覧を取得
  const fetchKnowledges = () => {
    fetch('http://localhost:8080/knowledge')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => setKnowledges(data))
      .catch(error => console.error('取得エラー:', error));
  };

  useEffect(() => {
    fetchKnowledges();
  }, []);

  const deleteKnowledge = (id) => {
    if (window.confirm('この記事を削除しますか？')) {
      fetch(`http://localhost:8080/knowledge/${id}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          fetchKnowledges();
        })
        .catch(error => console.error('削除エラー:', error));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📚 ナレッジ一覧</h2>

      <Link to="/knowledges/create">
        <button style={buttonStyle}>➕ 新規記事作成</button>
      </Link>

      <div style={{ marginTop: '20px' }}>
        {knowledges.length === 0 ? (
          <p>記事がまだありません。</p>
        ) : (
          knowledges.map(knowledge => (
            <div key={knowledge.id} style={cardStyle}>
              <h3>{knowledge.title}</h3>
              <p style={{ color: '#666' }}>
                {knowledge.category || '未分類'} /{' '}
                {knowledge.createdAt
                  ? new Date(knowledge.createdAt).toLocaleDateString()
                  : '日付不明'}
              </p>
              <div style={{ marginTop: '10px' }}>
                <Link to={`/knowledges/${knowledge.id}/edit`}>
                  <button style={smallButtonStyle}>✏️ 編集</button>
                </Link>{' '}
                <button onClick={() => deleteKnowledge(knowledge.id)} style={smallButtonStyle}>🗑️ 削除</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// --- スタイル定義 ---
const buttonStyle = {
  padding: '10px 16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  fontSize: '16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '15px',
  marginBottom: '15px',
  backgroundColor: '#f9f9f9'
};

const smallButtonStyle = {
  padding: '6px 12px',
  marginRight: '10px',
  fontSize: '14px',
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default KnowledgeList;