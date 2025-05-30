import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../App';

// テーブル行の初期テンプレ
const blankRow = () => ({
  id: null,
  name: '',
  overview: '',
  priority: 'M',
  owner: '',
});

/* ------------------------------ */

export default function FeatureList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // 一覧取得
  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE_URL}/features`);
      const data = await res.json();
      setRows(data);
    } catch (e) {
      console.error('❌ 機能一覧取得失敗:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeatures(); }, []);

  // 追加
  const addRow = () => setRows([...rows, blankRow()]);

  // 行更新
  const updateRow = (idx, key, value) => {
    setRows(rows.map((r, i) => (i === idx ? { ...r, [key]: value } : r)));
  };

  // 行削除
  const deleteRow = (idx) => {
    const target = rows[idx];
    if (target.id) {
      // 既存行なら DELETE
      fetch(`${API_BASE_URL}/features/${target.id}`, { method: 'DELETE' })
        .then(() => fetchFeatures());
    } else {
      // 未保存行ならフロントで消すだけ
      setRows(rows.filter((_, i) => i !== idx));
    }
  };

  // 保存（新規は POST, 既存は PUT）
  const saveAll = async () => {
    for (const r of rows) {
      // 空行はスキップ
      if (!r.name.trim()) continue;

      if (r.id) {
        await fetch(`${API_BASE_URL}/features/${r.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(r),
        });
      } else {
        await fetch(`${API_BASE_URL}/features`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(r),
        });
      }
    }
    alert('保存しました');
    fetchFeatures();
  };

  /* -------------- 画面 -------------- */
  if (loading) return <p>読み込み中…</p>;

  return (
    <div>
      <h3>📋 機能一覧</h3>

      <table className="feature-table">
        <thead>
          <tr>
            <th style={{ width: 200 }}>機能名</th>
            <th>概要</th>
            <th style={{ width: 80 }}>優先度</th>
            <th style={{ width: 120 }}>担当</th>
            <th style={{ width: 60 }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id ?? `new-${idx}`}>
              <td>
                <input
                  value={row.name}
                  onChange={e => updateRow(idx, 'name', e.target.value)}
                />
              </td>
              <td>
                <input
                  value={row.overview}
                  onChange={e => updateRow(idx, 'overview', e.target.value)}
                />
              </td>
              <td>
                <select
                  value={row.priority}
                  onChange={e => updateRow(idx, 'priority', e.target.value)}
                >
                  <option value="H">H</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                </select>
              </td>
              <td>
                <input
                  value={row.owner}
                  onChange={e => updateRow(idx, 'owner', e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => deleteRow(idx)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12 }}>
        <button onClick={addRow}>➕ 行を追加</button>
        <button onClick={saveAll} style={{ marginLeft: 8 }}>💾 保存</button>
      </div>
    </div>
  );
}