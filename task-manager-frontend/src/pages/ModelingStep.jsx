import React, { useState } from 'react';

function ModelingStep() {
  const [tables, setTables] = useState([
    { name: 'users', fields: ['id', 'name', 'email'] },
    { name: 'tasks', fields: ['id', 'title', 'user_id'] },
  ]);
  const [newTable, setNewTable] = useState('');

  const handleAddTable = () => {
    if (!newTable.trim()) return;
    setTables([...tables, { name: newTable.trim(), fields: [] }]);
    setNewTable('');
  };

  const handleAddField = (tableIndex, fieldName) => {
    if (!fieldName.trim()) return;
    const updatedTables = [...tables];
    updatedTables[tableIndex].fields.push(fieldName.trim());
    setTables(updatedTables);
  };

  const handleRemoveField = (tableIndex, fieldIndex) => {
    const updatedTables = [...tables];
    updatedTables[tableIndex].fields.splice(fieldIndex, 1);
    setTables(updatedTables);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 ステップ3：データモデリング</h2>

      {/* テーブル追加欄 */}
      <div style={{ marginBottom: '20px' }}>
        <input
          value={newTable}
          onChange={(e) => setNewTable(e.target.value)}
          placeholder="テーブル名を入力"
          style={{ padding: '6px', marginRight: '10px' }}
        />
        <button onClick={handleAddTable}>➕ テーブル追加</button>
      </div>

      {/* テーブル一覧表示 */}
      {tables.map((table, i) => (
        <div key={i} style={{ marginBottom: '30px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>📁 {table.name}</h3>

          <ul style={{ paddingLeft: '20px' }}>
            {table.fields.map((field, j) => (
              <li key={j}>
                {field}
                <button
                  onClick={() => handleRemoveField(i, j)}
                  style={{ marginLeft: '10px', color: 'red' }}>
                  ❌
                </button>
              </li>
            ))}
          </ul>

          <AddFieldInput onAdd={(fieldName) => handleAddField(i, fieldName)} />
        </div>
      ))}
    </div>
  );
}

function AddFieldInput({ onAdd }) {
  const [fieldName, setFieldName] = useState('');

  const handleSubmit = () => {
    if (!fieldName.trim()) return;
    onAdd(fieldName);
    setFieldName('');
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <input
        value={fieldName}
        onChange={(e) => setFieldName(e.target.value)}
        placeholder="フィールド名"
        style={{ padding: '6px', marginRight: '10px' }}
      />
      <button onClick={handleSubmit}>＋ フィールド追加</button>
    </div>
  );
}

export default ModelingStep;
