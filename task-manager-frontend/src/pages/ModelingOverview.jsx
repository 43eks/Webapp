import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../App';

function ModelingOverview() {
  const [tables, setTables] = useState([]);

  // 初期データ読み込み
  useEffect(() => {
    fetch(`${API_BASE_URL}/dwh/modeling`)
      .then(res => res.json())
      .then(data => setTables(data))
      .catch(err => console.error('❌ データ取得エラー:', err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📘 DWH モデリング概要（ER図風）</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tables.map((table, index) => (
          <div key={index} className="border rounded-xl p-4 shadow bg-white">
            <h3 className="font-semibold text-lg mb-2">📁 {table.tableName}</h3>
            <ul className="text-sm space-y-1">
              {table.fields.map((field, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span>{field.name}</span>
                  <span className="text-gray-500 text-xs">
                    {field.type}
                    {field.foreignKey && ` → 🔗 ${field.foreignKey.table}.${field.foreignKey.field}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModelingOverview;
