// src/pages/ModelingStep.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../App';

function ModelingStep() {
  const [tables, setTables] = useState([]);
  const [newTableName, setNewTableName] = useState('');

  // 初期読み込み
  useEffect(() => {
    fetch(`${API_BASE_URL}/tables`)
      .then(res => res.json())
      .then(data => setTables(data))
      .catch(err => console.error('❌ テーブル取得エラー:', err));
  }, []);

  // テーブル追加
  const addTable = () => {
    if (!newTableName.trim()) return;
    const newTable = { name: newTableName };
    fetch(`${API_BASE_URL}/tables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTable)
    })
      .then(res => res.json())
      .then(data => {
        setTables(prev => [...prev, data]);
        setNewTableName('');
      })
      .catch(err => console.error('❌ テーブル追加エラー:', err));
  };

  // テーブル削除
  const deleteTable = (id) => {
    fetch(`${API_BASE_URL}/tables/${id}`, { method: 'DELETE' })
      .then(() => setTables(prev => prev.filter(t => t.id !== id)))
      .catch(err => console.error('❌ 削除エラー:', err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧩 DWHデータモデリング（ステップ3）</h2>

      <div style={{ marginTop: '20px' }}>
        {tables.map(table => (
          <div key={table.id} style={tableStyle}>
            📁 {table.name}
            <button onClick={() => deleteTable(table.id)} style={deleteButton}>🗑️</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
          placeholder="新しいテーブル名"
          style={inputStyle}
        />
        <button onClick={addTable} style={addButton}>追加</button>
      </div>
    </div>
  );
}

// --- スタイル ---
const tableStyle = {
  padding: '10px',
  backgroundColor: '#f9f9f9',
  border: '1px solid #ccc',
  borderRadius: '6px',
  marginBottom: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const inputStyle = {
  padding: '8px',
  fontSize: '14px',
  width: '200px',
  marginRight: '10px'
};

const addButton = {
  padding: '8px 14px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const deleteButton = {
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px'
};

export default ModelingStep;
