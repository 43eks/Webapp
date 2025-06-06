// src/pages/upstream/StakeholdersPage.jsx
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../App';
import './UpstreamCommon.css';

export default function StakeholdersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchList(); }, []);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/stakeholders`);
      setRows(await res.json());
    } catch (e) {
      console.error('❌ ステークホルダー取得失敗:', e);
      alert('ステークホルダーの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const addRow = async () => {
    const blank = { name: '', role: '', influence: 'M' };
    const res = await fetch(`${API_BASE_URL}/stakeholders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blank),
    });
    if (res.ok) fetchList();
  };

  const updateCell = (id, key, value) =>
    setRows(rows.map(r => (r.id === id ? { ...r, [key]: value } : r)));

  const saveRow = async row => {
    await fetch(`${API_BASE_URL}/stakeholders/${row.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    });
  };

  const delRow = async id => {
    if (!window.confirm('削除しますか？')) return;
    await fetch(`${API_BASE_URL}/stakeholders/${id}`, { method: 'DELETE' });
    fetchList();
  };

  if (loading) return <p>読み込み中…</p>;

  return (
    <div className="up-card">
      <h2>🧑‍🤝‍🧑 ステークホルダー分析</h2>

      <table className="up-table">
        <thead>
          <tr>
            <th>名前</th>
            <th>役割 / 立場</th>
            <th>影響度</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>
                <input
                  value={r.name}
                  onChange={e => updateCell(r.id, 'name', e.target.value)}
                  onBlur={() => saveRow(r)}
                />
              </td>
              <td>
                <input
                  value={r.role}
                  onChange={e => updateCell(r.id, 'role', e.target.value)}
                  onBlur={() => saveRow(r)}
                />
              </td>
              <td>
                <select
                  value={r.influence}
                  onChange={e => updateCell(r.id, 'influence', e.target.value)}
                  onBlur={() => saveRow(r)}
                >
                  <option value="H">H</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                </select>
              </td>
              <td>
                <button onClick={() => delRow(r.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-btn" onClick={addRow}>
        ➕ 行を追加
      </button>
    </div>
  );
}