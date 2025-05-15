import React, { useState } from 'react';

function DataSourceDefinition() {
  const [sources, setSources] = useState([]);
  const [newSource, setNewSource] = useState({ name: '', type: 'CSV', url: '' });

  const handleChange = (e) => {
    setNewSource({ ...newSource, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!newSource.name.trim()) return alert('データソース名を入力してください');
    setSources([...sources, { ...newSource, id: Date.now().toString() }]);
    setNewSource({ name: '', type: 'CSV', url: '' });
  };

  const handleDelete = (id) => {
    setSources(sources.filter(s => s.id !== id));
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🗂️ データソース定義</h2>

      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">新しいデータソース</h3>
        <div className="flex flex-col gap-2">
          <input
            name="name"
            value={newSource.name}
            onChange={handleChange}
            placeholder="データソース名"
            className="border p-2 rounded"
          />
          <select
            name="type"
            value={newSource.type}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="CSV">CSV</option>
            <option value="API">API</option>
            <option value="Manual">手動入力</option>
          </select>
          <input
            name="url"
            value={newSource.url}
            onChange={handleChange}
            placeholder="接続先URLまたはパス（任意）"
            className="border p-2 rounded"
          />
          <button onClick={handleAdd} className="bg-blue-600 text-white py-2 px-4 rounded mt-2">
            ➕ 追加
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-lg font-semibold mb-2">📋 登録済みソース</h3>
        {sources.length === 0 ? (
          <p className="text-gray-500">まだ登録されていません。</p>
        ) : (
          <ul className="space-y-2">
            {sources.map((s) => (
              <li key={s.id} className="border p-2 rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{s.name} ({s.type})</div>
                  <div className="text-sm text-gray-500">{s.url}</div>
                </div>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-red-500 hover:underline"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DataSourceDefinition;
