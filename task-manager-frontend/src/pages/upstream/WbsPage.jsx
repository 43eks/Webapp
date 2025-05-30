// WbsPage.jsx  ― ステップ④：WBS／マイルストーン入力
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../App';
import './UpstreamCommon.css';           // 共通スタイル（任意）

export default function WbsPage() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);

  /* ------------------------ 初期ロード ------------------------ */
  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE_URL}/wbs`);
      const json = await res.json();
      setRows(json);
    } catch (e) {
      console.error('❌ WBS 取得失敗:', e);
      alert('WBS の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------ 追加 ------------------------ */
  const handleAdd = async () => {
    const blank = { title:'', owner:'', start:'', end:'', progress:0 };
    const res   = await fetch(`${API_BASE_URL}/wbs`, {
      method : 'POST',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify(blank)
    });
    if (res.ok) load();
  };

  /* ------------------------ 更新セル ------------------------ */
  const updateCell = (id, key, value) => {
    setRows(rows.map(r => r.id === id ? { ...r, [key]: value } : r));
  };

  const saveRow = async (row) => {
    await fetch(`${API_BASE_URL}/wbs/${row.id}`, {
      method : 'PUT',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify(row)
    });
  };

  /* ------------------------ 削除 ------------------------ */
  const del = async (id) => {
    if (!window.confirm('削除しますか？')) return;
    await fetch(`${API_BASE_URL}/wbs/${id}`, { method:'DELETE' });
    load();
  };

  /* ------------------------ 描画 ------------------------ */
  if (loading) return <p>読み込み中…</p>;

  return (
    <div className="up-card">
      <h2>🗓️ WBS / マイルストーン</h2>

      <table className="wbs-table">
        <thead>
          <tr>
            <th>タスク / マイルストーン</th>
            <th>担当</th>
            <th>開始日</th>
            <th>終了日</th>
            <th>進捗(%)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td><input  value={r.title}
                          onChange={e=>updateCell(r.id,'title',e.target.value)}
                          onBlur={()=>saveRow(r)} /></td>
              <td><input  value={r.owner}
                          onChange={e=>updateCell(r.id,'owner',e.target.value)}
                          onBlur={()=>saveRow(r)} /></td>
              <td><input  type="date"
                          value={r.start}
                          onChange={e=>updateCell(r.id,'start',e.target.value)}
                          onBlur={()=>saveRow(r)} /></td>
              <td><input  type="date"
                          value={r.end}
                          onChange={e=>updateCell(r.id,'end',e.target.value)}
                          onBlur={()=>saveRow(r)} /></td>
              <td><input  type="number" min="0" max="100"
                          value={r.progress}
                          onChange={e=>updateCell(r.id,'progress',e.target.value)}
                          onBlur={()=>saveRow(r)} /></td>
              <td><button onClick={()=>del(r.id)}>🗑</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-btn" onClick={handleAdd}>➕ 行を追加</button>
    </div>
  );
}