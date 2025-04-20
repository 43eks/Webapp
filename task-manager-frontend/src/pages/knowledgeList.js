import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function knowledgeList() {
  const [knowledges, setknowledges] = useState([]);

  // 記事一覧を取得
  const fetchBlogs = () => {
    fetch('http://localhost:8080/knowledge')
      .then(response => response.json())
      .then(data => setBlogs(data))
      .catch(error => console.error('取得エラー:', error));
  };

  // 初回マウント時に実行
  useEffect(() => {
    fetchknowledges();
  }, []);

  // 削除処理
  const deleteknowledge = (id) => {
    if (window.confirm('この記事を削除しますか？')) {
      fetch(`http://localhost:8080/knowledge/${id}`, {
        method: 'DELETE'
      })
        .then(() => fetchknowledges())
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
                {knowledge.category || '未分類'} / {new Date(knowledge.createdAt).toLocaleDateString()}
              </p>
              <div style={{ marginTop: '10px' }}>
                <Link to={`/knowledges/${knowledge.id}/edit`}>
                  <button style={smallButtonStyle}>✏️ 編集</button>
                </Link>
                <button onClick={() => deleteknowledge(knowledge.id)} style={smallButtonStyle}>🗑️ 削除</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// スタイル定義
const buttonStyle = {
  padding: '10px 16px',
  fontSize: '16px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const cardStyle = {
  border: '1px solid #ddd',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '15px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const smallButtonStyle = {
  marginRight: '10px',
  padding: '6px 10px',
  fontSize: '14px',
  cursor: 'pointer',
  borderRadius: '6px',
  border: '1px solid #ccc',
  backgroundColor: '#f1f1f1'
};

export default knowledgeList;