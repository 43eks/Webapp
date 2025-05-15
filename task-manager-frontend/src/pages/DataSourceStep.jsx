import React, { useState, useRef, useEffect } from 'react';
import Sortable from 'sortablejs';

function DataSourceStep() {
  const [sources, setSources] = useState([
    { id: 'ds1', name: '顧客マスタ', type: 'CSV' },
    { id: 'ds2', name: '売上データ', type: 'DB' },
    { id: 'ds3', name: '商品情報', type: 'API' }
  ]);
  const [editing, setEditing] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    Sortable.create(listRef.current, {
      animation: 150,
      onEnd: (evt) => {
        const updated = [...sources];
        const [removed] = updated.splice(evt.oldIndex, 1);
        updated.splice(evt.newIndex, 0, removed);
        setSources(updated);
      }
    });
  }, [sources]);

  const handleEdit = (id, field, value) => {
    setSources(prev => prev.map(ds => ds.id === id ? { ...ds, [field]: value } : ds));
  };

  const handleDelete = (id) => {
    if (window.confirm('本当に削除しますか？')) {
      setSources(prev => prev.filter(ds => ds.id !== id));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Step 1: データソース定義</h2>
      <ul ref={listRef} className="space-y-2">
        {sources.map(source => (
          <li key={source.id} className="bg-white rounded shadow p-4 flex items-center justify-between">
            <div className="flex-1">
              <input
                value={source.name}
                onChange={e => handleEdit(source.id, 'name', e.target.value)}
                className="border px-2 py-1 rounded w-1/2 mr-2"
              />
              <select
                value={source.type}
                onChange={e => handleEdit(source.id, 'type', e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option value="CSV">CSV</option>
                <option value="DB">DB</option>
                <option value="API">API</option>
              </select>
            </div>
            <button
              onClick={() => handleDelete(source.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataSourceStep;
