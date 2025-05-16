import React, { useState } from 'react';
import Sortable from 'sortablejs';
import { useEffect, useRef } from 'react';

function FieldDefinitionStep() {
  const [fields, setFields] = useState([
    { id: 1, name: '顧客ID', type: 'string', description: '顧客を一意に識別するID' },
    { id: 2, name: '購入日', type: 'date', description: '購入が行われた日付' },
    { id: 3, name: '金額', type: 'number', description: '購入金額' },
  ]);

  const [newField, setNewField] = useState({ name: '', type: 'string', description: '' });
  const sortableRef = useRef(null);

  // --- 並び替えを有効化 ---
  useEffect(() => {
    if (sortableRef.current) {
      Sortable.create(sortableRef.current, {
        animation: 150,
        onEnd: (evt) => {
          const newOrder = [...fields];
          const [moved] = newOrder.splice(evt.oldIndex, 1);
          newOrder.splice(evt.newIndex, 0, moved);
          setFields(newOrder);
        },
      });
    }
  }, [fields]);

  const handleChange = (e) => {
    setNewField({ ...newField, [e.target.name]: e.target.value });
  };

  const handleAddField = () => {
    if (!newField.name.trim()) return;
    setFields([
      ...fields,
      { id: Date.now(), ...newField },
    ]);
    setNewField({ name: '', type: 'string', description: '' });
  };

  const handleDelete = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧩 ステップ2：データ項目定義</h2>
      <p>各データ項目を追加・並べ替え・削除できます。</p>

      <ul ref={sortableRef} style={{ listStyle: 'none', padding: 0 }}>
        {fields.map((field, index) => (
          <li key={field.id} style={cardStyle}>
            <strong>{field.name}</strong>（{field.type}）<br />
            <span style={{ color: '#555' }}>{field.description}</span>
            <button onClick={() => handleDelete(field.id)} style={deleteButton}>🗑️</button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '30px' }}>
        <h4>➕ 新規項目を追加</h4>
        <input
          name="name"
          placeholder="項目名"
          value={newField.name}
          onChange={handleChange}
          style={inputStyle}
        />
        <select
          name="type"
          value={newField.type}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="string">文字列</option>
          <option value="number">数値</option>
          <option value="boolean">真偽値</option>
          <option value="date">日付</option>
        </select>
        <input
          name="description"
          placeholder="説明"
          value={newField.description}
          onChange={handleChange}
          style={inputStyle}
        />
        <button onClick={handleAddField} style={addButton}>追加</button>
      </div>
    </div>
  );
}

// --- スタイル ---
const cardStyle = {
  backgroundColor: '#f9f9f9',
  border: '1px solid #ddd',
  padding: '12px',
  borderRadius: '6px',
  marginBottom: '10px',
  position: 'relative'
};

const deleteButton = {
  position: 'absolute',
  right: '10px',
  top: '10px',
  background: '#ef4444',
  color: '#fff',
  border: 'none',
  padding: '4px 8px',
  borderRadius: '4px',
  cursor: 'pointer'
};

const inputStyle = {
  padding: '8px',
  marginRight: '10px',
  marginBottom: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '14px'
};

const addButton = {
  padding: '8px 12px',
  backgroundColor: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default FieldDefinitionStep;
