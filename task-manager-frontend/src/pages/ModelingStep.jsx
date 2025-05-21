// src/pages/ModelingStep.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../App';

function ModelingStep() {
  const [tables, setTables] = useState([]);
  const [newTableName, setNewTableName] = useState('');

  // 初期データの読み込み
  useEffect(() => {
    fetch(`${API_BASE_URL}/dwh/model`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        // サーバーから { tables, relations } を返す想定なら data.tables を使う
        if (Array.isArray(data.tables)) {
          setTables(data.tables);
        } else {
          // サンプル初期データにフォールバック
          setTables([
            {
              id: Date.now(),
              name: 'サンプルテーブル',
              fields: [
                { name: 'id', type: 'string' },
                { name: 'name', type: 'string' },
              ],
              relations: [],
            },
          ]);
        }
      })
      .catch(err => {
        console.error('❌ モデル取得エラー:', err);
        // 初期サンプルデータ
        setTables([
          {
            id: Date.now(),
            name: 'サンプルテーブル',
            fields: [
              { name: 'id', type: 'string' },
              { name: 'name', type: 'string' },
            ],
            relations: [],
          },
        ]);
      });
  }, []);

  const addTable = () => {
    if (!newTableName.trim()) return;
    setTables([
      ...tables,
      { id: Date.now(), name: newTableName.trim(), fields: [], relations: [] }
    ]);
    setNewTableName('');
  };

  const deleteTable = (id) => {
    setTables(tables.filter(t => t.id !== id));
  };

  const addField = (tableId) => {
    setTables(tables.map(t =>
      t.id === tableId
        ? { ...t, fields: [...t.fields, { name: '', type: 'string' }] }
        : t
    ));
  };

  const updateField = (tableId, idx, key, value) => {
    setTables(tables.map(t =>
      t.id === tableId
        ? {
            ...t,
            fields: t.fields.map((f, i) =>
              i === idx ? { ...f, [key]: value } : f
            )
          }
        : t
    ));
  };

  const deleteField = (tableId, idx) => {
    setTables(tables.map(t =>
      t.id === tableId
        ? { ...t, fields: t.fields.filter((_, i) => i !== idx) }
        : t
    ));
  };

  const addRelation = (tableId) => {
    setTables(tables.map(t =>
      t.id === tableId
        ? { ...t, relations: [...t.relations, { targetTable: '', targetField: '' }] }
        : t
    ));
  };

  const updateRelation = (tableId, idx, key, value) => {
    setTables(tables.map(t =>
      t.id === tableId
        ? {
            ...t,
            relations: t.relations.map((r, i) =>
              i === idx ? { ...r, [key]: value } : r
            )
          }
        : t
    ));
  };

  const saveModeling = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/dwh/model`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tables })
      });
      if (res.ok) {
        alert('モデル情報を保存しました');
      } else {
        alert('モデル情報の保存に失敗しました');
      }
    } catch (err) {
      console.error('❌ 保存エラー:', err);
      alert('保存エラーが発生しました');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📘 DWHステップ3：データモデリング</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newTableName}
          onChange={e => setNewTableName(e.target.value)}
          placeholder="テーブル名を入力"
          style={{ padding: '8px', marginRight: '8px' }}
        />
        <button onClick={addTable}>➕ テーブル追加</button>
      </div>

      {tables.map((table) => (
        <div key={table.id} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>{table.name}</h3>
            <button onClick={() => deleteTable(table.id)}>🗑️ テーブル削除</button>
          </div>

          <h4>🧱 フィールド一覧</h4>
          {table.fields.map((field, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <input
                type="text"
                value={field.name}
                onChange={e => updateField(table.id, idx, 'name', e.target.value)}
                placeholder="項目名"
              />
              <select
                value={field.type}
                onChange={e => updateField(table.id, idx, 'type', e.target.value)}
              >
                <option value="string">文字列</option>
                <option value="number">数値</option>
                <option value="date">日付</option>
                <option value="boolean">真偽値</option>
              </select>
              <button onClick={() => deleteField(table.id, idx)}>🗑️</button>
            </div>
          ))}
          <button onClick={() => addField(table.id)}>➕ フィールド追加</button>

          <h4 style={{ marginTop: '15px' }}>🔗 リレーション</h4>
          {table.relations.map((rel, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <select
                value={rel.targetTable}
                onChange={e => updateRelation(table.id, idx, 'targetTable', e.target.value)}
              >
                <option value="">-- 対象テーブル --</option>
                {tables.filter(t => t.id !== table.id).map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
              <input
                type="text"
                value={rel.targetField}
                onChange={e => updateRelation(table.id, idx, 'targetField', e.target.value)}
                placeholder="外部キー"
              />
            </div>
          ))}
          <button onClick={() => addRelation(table.id)}>➕ リレーション追加</button>
        </div>
      ))}

      <button onClick={saveModeling} style={{ marginTop: '20px', padding: '10px 16px' }}>💾 保存</button>
    </div>
  );
}

export default ModelingStep;