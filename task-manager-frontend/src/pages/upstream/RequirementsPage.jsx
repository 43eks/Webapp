// src/pages/upstream/RequirementsPage.jsx
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../App';
import './UpstreamCommon.css';

export default function RequirementsPage() {
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- 取得 ---------- */
  useEffect(() => { fetchList(); }, []);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API_BASE_URL}/requirements`);
      const data = await res.json();
      setRows(data);
    } catch (e) {
      console.error('❌ 要求一覧取得失敗:', e);
      alert('要求一覧の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- 追加 ---------- */
  const addRow = async () => {
    const blank = {
      title:   '',
      detail:  '',
      type:    'FR',
      priority:'M',
      status:  '検討中'
    };
    const res = await fetch(`${API_BASE_URL}/requirements`, {
      method : 'POST',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify(blank)
    });
    if (res.ok) fetchList();
  };

  /* ---------- 更新 ---------- */
  const updateCell = (id, key, val) =>
    setRows(rows.map(r => (r.id === id ? { ...r, [key]: val } : r)));

  const saveRow = async row => {
    await fetch(`${API_BASE_URL}/requirements/${row.id}`, {
      method : 'PUT',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify(row)
    });
  };

  /* ---------- 削除 ---------- */
  const delRow = async id => {
    if (!window.confirm('削除しますか？')) return;
    await fetch(`${API_BASE_URL}/requirements/${id}`, { method:'DELETE' });
    fetchList();
  };

  /* ---------- 描画 ---------- */
  if (loading) return <p>読み込み中…</p>;

  return (
    <div className="up-card">
      <h2>📋 要求定義</h2>

      <table className="up-table">
        <thead>
          <tr>
            <th>要求タイトル</th>
            <th>詳細</th>
            <th>タイプ</th>
            <th>優先度</th>
            <th>状態</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              {/* タイトル */}
              <td>
                <input
                  value={r.title}
                  onChange={e => updateCell(r.id, 'title', e.target.value)}
                  onBlur={() => saveRow(r)}
                />
              </td>

              {/* 詳細 */}
              <td>
                <input
                  value={r.detail}
                  onChange={e => updateCell(r.id, 'detail', e.target.value)}
                  onBlur={() => saveRow(r)}
                />
              </td>

              {/* タイプ */}
              <td>
                <select
                  value={r.type}
                  onChange={e => updateCell(r.id, 'type', e.target.value)}
                  onBlur={() => saveRow(r)}
                >
                  <option value="FR">FR</option>
                  <option value="NFR">NFR</option>
                </select>
              </td>

              {/* 優先度 */}
              <td>
                <select
                  value={r.priority}
                  onChange={e => updateCell(r.id, 'priority', e.target.value)}
                  onBlur={() => saveRow(r)}
                >
                  <option value="H">H</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                </select>
              </td>

              {/* 状態 */}
              <td>
                <select
                  value={r.status}
                  onChange={e => updateCell(r.id, 'status', e.target.value)}
                  onBlur={() => saveRow(r)}
                >
                  <option value="検討中">検討中</option>
                  <option value="合意">合意</option>
                  <option value="却下">却下</option>
                </select>
              </td>

              {/* 削除 */}
              <td>
                <button onClick={() => delRow(r.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-btn" onClick={addRow}>➕ 行を追加</button>
    </div>
  );
}