import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function KnowledgeList() {
  const [knowledges, setKnowledges] = useState([]);

  // 記事一覧を取得
  const fetchKnowledges = () => {
    fetch('http://localhost:8080/knowledge')
      .then(response => response.json())
      .then(data => setKnowledges(data))  // ✅ 関数名一致！
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
        .then(() => fetchKnowledges())
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
                <button onClick={() => deleteKnowledge(knowledge.id)} style={smallButtonStyle}>🗑️ 削除</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// スタイル定義（同じ）
const buttonStyle = { /* 省略 */ };
const cardStyle = { /* 省略 */ };
const smallButtonStyle = { /* 省略 */ };

// ✅ コンポーネント名と一致した名前でエクスポート！
export default KnowledgeList;