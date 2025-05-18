// src/pages/ModelingStep.jsx
import React, { useState } from 'react';
import { API_BASE_URL } from '../App';

function ModelingStep() {
  const [tables, setTables] = useState([
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
  const [newTableName, setNewTableName] = useState('');

  const addTable = () => {
    if (!newTableName.trim()) return;
    const newTable = {
      id: Date.now(),
      name: newTableName,
      fields: [],
      relations: [],
    };
    setTables([...tables, newTable]);
    setNewTableName('');
  };

  const deleteTable = (id) => {
    setTables(tables.filter(t => t.id !== id));
  };

  const addField = (tableId) => {
    setTables(tables.map(t => t.id === tableId ? {
      ...t,
      fields: [...t.fields, { name: '', type: 'string' }],
    } : t));
  };

  const updateField = (tableId, index, key, value) => {
    setTables(tables.map(t => t.id === tableId ? {
      ...t,
      fields: t.fields.map((f, i) => i === index ? { ...f, [key]: value } : f),
    } : t));
  };

  const deleteField = (tableId, index) => {
    setTables(tables.map(t => t.id === tableId ? {
      ...t,
      fields: t.fields.filter((_, i) => i !== index),
    } : t));
  };

  const addRelation = (tableId) => {
    setTables(tables.map(t => t.id === tableId ? {
      ...t,
      relations: [...t.relations, { targetTable: '', targetField: '' }],
    } : t));
  };

  const updateRelation = (tableId, index, key, value) => {
    setTables(tables.map(t => t.id === tableId ? {
      ...t,
      relations: t.relations.map((r, i) => i === index ? { ...r, [key]: value } : r),
    } : t));
  };

  const saveModeling = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/dwh/modeling`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tables }),
      });
      if (res.ok) alert('保存しました');
      else alert('保存に失敗しました');
    } catch (err) {
      console.error('❌ 保存エラー:', err);
      alert('保存エラーが発生しました');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📘 DWHステップ3：データモデリング</h2>

      <input
        type="text"
        value={newTableName}
        onChange={(e) => setNewTableName(e.target.value)}
        placeholder="テーブル名を入力"
        style={{ padding: '8px', marginRight: '10px' }}
      />
      <button onClick={addTable}>➕ テーブル追加</button>

      {tables.map((table, tIdx) => (
        <div key={table.id} style={{ marginTop: '30px', border: '1px solid #ccc', padding: '15px' }}>
          <h3>{table.name}</h3>
          <button onClick={() => deleteTable(table.id)} style={{ marginBottom: '10px' }}>🗑️ テーブル削除</button>

          <h4>🧱 フィールド一覧</h4>
          {table.fields.map((field, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <input
                type="text"
                value={field.name}
                onChange={(e) => updateField(table.id, index, 'name', e.target.value)}
                placeholder="項目名"
              />
              <select
                value={field.type}
                onChange={(e) => updateField(table.id, index, 'type', e.target.value)}
              >
                <option value="string">文字列</option>
                <option value="number">数値</option>
                <option value="date">日付</option>
                <option value="boolean">真偽値</option>
              </select>
              <button onClick={() => deleteField(table.id, index)}>🗑️</button>
            </div>
          ))}
          <button onClick={() => addField(table.id)}>➕ フィールド追加</button>

          <h4 style={{ marginTop: '15px' }}>🔗 リレーション</h4>
          {table.relations.map((rel, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
              <select
                value={rel.targetTable}
                onChange={(e) => updateRelation(table.id, index, 'targetTable', e.target.value)}
              >
                <option value="">-- 対象テーブル --</option>
                {tables.filter(t => t.id !== table.id).map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
              <input
                type="text"
                value={rel.targetField}
                onChange={(e) => updateRelation(table.id, index, 'targetField', e.target.value)}
                placeholder="外部キー"
              />
            </div>
          ))}
          <button onClick={() => addRelation(table.id)}>➕ リレーション追加</button>
        </div>
      ))}

      <button onClick={saveModeling} style={{ marginTop: '30px', padding: '10px' }}>💾 保存</button>
    </div>
  );
}

export default ModelingStep;
