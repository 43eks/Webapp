// src/pages/ModelingEditorERD.jsx
import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { API_BASE_URL } from '../App';

function ModelingEditorERD() {
  const [tables, setTables] = useState([]);
  const [relations, setRelations] = useState([]);

  // 初回ロードでテーブル／リレーションを取得
  useEffect(() => {
    fetch(`${API_BASE_URL}/dwh/tables`)
      .then(res => res.json())
      .then(data => setTables(data || []))
      .catch(err => console.error('テーブル取得エラー:', err));

    fetch(`${API_BASE_URL}/dwh/relations`)
      .then(res => res.json())
      .then(data => setRelations(data || []))
      .catch(err => console.error('リレーション取得エラー:', err));
  }, []);

  // ドラッグ終了時にテーブルの座標を更新
  const updateTablePosition = (id, x, y) => {
    setTables(prev =>
      prev.map(t => (t.id === id ? { ...t, x, y } : t))
    );
  };

  // 全体モデルを保存
  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/dwh/model`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tables, relations })
      });
      if (res.ok) {
        alert('モデルを保存しました');
      } else {
        console.error('保存失敗:', res.statusText);
        alert('モデルの保存に失敗しました');
      }
    } catch (err) {
      console.error('保存エラー:', err);
      alert('保存時にエラーが発生しました');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📘 ER図エディタ</h2>
      <button
        onClick={handleSave}
        style={{
          marginBottom: '12px',
          padding: '8px 16px',
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        💾 保存
      </button>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '80vh',
          border: '1px solid #ccc',
          overflow: 'auto',
          backgroundColor: '#fafafa'
        }}
      >
        {tables.map(table => (
          <Draggable
            key={table.id}
            defaultPosition={{ x: table.x || 0, y: table.y || 0 }}
            onStop={(_, data) => updateTablePosition(table.id, data.x, data.y)}
          >
            <div
              style={{
                position: 'absolute',
                padding: '10px',
                background: '#fff',
                border: '1px solid #aaa',
                borderRadius: '6px',
                minWidth: '160px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'move'
              }}
            >
              <strong>{table.name}</strong>
              <ul style={{ margin: '6px 0', paddingLeft: '16px' }}>
                {(table.fields || []).map((field, i) => (
                  <li key={i}>
                    {field.name}{' '}
                    <small style={{ color: '#666' }}>
                      ({field.type})
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          </Draggable>
        ))}

        {/* TODO: relations を線で描画するロジックをここに実装 */}
      </div>
    </div>
  );
}

export default ModelingEditorERD;