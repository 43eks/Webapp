import React, { useState } from 'react';

function ModelingStep() {
  const [tables, setTables] = useState([
    { id: 'table_1', name: 'users', fields: ['id', 'name', 'email'] },
    { id: 'table_2', name: 'tasks', fields: ['id', 'user_id', 'title'] }
  ]);

  const [newTableName, setNewTableName] = useState('');

  const handleAddTable = () => {
    if (!newTableName.trim()) return;
    const newTable = {
      id: `table_${Date.now()}`,
      name: newTableName,
      fields: []
    };
    setTables([...tables, newTable]);
    setNewTableName('');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🧱 データモデリング - ステップ3</h2>

      <div className="mb-6">
        <input
          type="text"
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
          placeholder="新しいテーブル名"
          className="border rounded px-3 py-2 mr-2"
        />
        <button
          onClick={handleAddTable}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ➕ テーブル追加
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tables.map((table) => (
          <div key={table.id} className="border rounded-lg p-4 bg-white shadow">
            <h3 className="font-bold mb-2">📄 {table.name}</h3>
            <ul className="list-disc ml-5 text-sm">
              {table.fields.map((field, idx) => (
                <li key={idx}>{field}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModelingStep;
