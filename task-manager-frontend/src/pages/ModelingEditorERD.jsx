// src/pages/ModelingEditorERD.jsx
import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { API_BASE_URL } from '../App';

function ModelingEditorERD() {
  const [tables, setTables] = useState([]);
  const [relations, setRelations] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/dwh/tables`)
      .then(res => res.json())
      .then(data => setTables(data || []));

    fetch(`${API_BASE_URL}/dwh/relations`)
      .then(res => res.json())
      .then(data => setRelations(data || []));
  }, []);

  const updateTablePosition = (id, x, y) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, x, y } : t));
  };

  const handleSave = async () => {
    const body = { tables, relations };
    const res = await fetch(`${API_BASE_URL}/dwh/model`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) alert('保存しました');
    else alert('保存失敗');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📘 ER図エディタ</h2>
      <button onClick={handleSave} style={{ marginBottom: '10px' }}>💾 保存</button>
      <div style={{ position: 'relative', width: '100%', height: '80vh', border: '1px solid #ccc' }}>
        {tables.map(table => (
          <Draggable
            key={table.id}
            defaultPosition={{ x: table.x || 0, y: table.y || 0 }}
            onStop={(_, data) => updateTablePosition(table.id, data.x, data.y)}
          >
            <div style={{ position: 'absolute', padding: '10px', background: '#f9f9f9', border: '1px solid #aaa', borderRadius: '6px', minWidth: '160px' }}>
              <strong>{table.name}</strong>
              <ul style={{ margin: '6px 0', paddingLeft: '16px' }}>
                {table.fields.map((field, i) => (
                  <li key={i}>{field.name} <small style={{ color: '#666' }}>{field.type}</small></li>
                ))}
              </ul>
            </div>
          </Draggable>
        ))}
        {/* リレーションの線描画は簡易のため未実装 */}
      </div>
    </div>
  );
}

export default ModelingEditorERD;
