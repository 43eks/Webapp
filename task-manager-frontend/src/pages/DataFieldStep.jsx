import React, { useState } from 'react';

function DataFieldStep() {
  const [fields, setFields] = useState([
    { name: '', type: '', description: '' }
  ]);

  const handleChange = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const handleAddField = () => {
    setFields([...fields, { name: '', type: '', description: '' }]);
  };

  const handleRemoveField = (index) => {
    const updated = [...fields];
    updated.splice(index, 1);
    setFields(updated);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 ステップ2：データ項目定義</h2>

      {fields.map((field, index) => (
        <div key={index} style={fieldRowStyle}>
          <input
            placeholder="項目名"
            value={field.name}
            onChange={e => handleChange(index, 'name', e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="データ型 (string, int, date)"
            value={field.type}
            onChange={e => handleChange(index, 'type', e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="説明"
            value={field.description}
            onChange={e => handleChange(index, 'description', e.target.value)}
            style={inputStyle}
          />
          <button onClick={() => handleRemoveField(index)} style={removeButtonStyle}>🗑</button>
        </div>
      ))}

      <button onClick={handleAddField} style={addButtonStyle}>➕ 項目を追加</button>
    </div>
  );
}

const fieldRowStyle = {
  display: 'flex',
  gap: '10px',
  marginBottom: '10px',
  alignItems: 'center'
};

const inputStyle = {
  padding: '8px',
  flex: 1,
  fontSize: '14px'
};

const addButtonStyle = {
  marginTop: '10px',
  padding: '8px 12px',
  backgroundColor: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const removeButtonStyle = {
  padding: '6px 10px',
  backgroundColor: '#e11d48',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

export default DataFieldStep;