// StakeholdersPage.jsx  ─ ステップ③：ステークホルダー整理
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../App';
import './UpstreamCommon.css';   // ★ 既存共通スタイル

export default function StakeholdersPage() {
  /* ――― state ――― */
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);

  /* ――― 初期ロード ――― */
  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE_URL}/stakeholders`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setRows(await r.json());
    } catch (e) {
      console.error('❌ ステークホルダー取得失敗:', e);
      alert('ステークホルダー一覧の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  /* ――― 行追加 ――― */
  const handleAdd = async () => {
    const blank = { name:'', role:'', influence:'中', interest:'中', notes:'' };
    const r     = await fetch(`${API_BASE_URL}/stakeholders`, {
      method : 'POST',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify(blank)
    });
    if (r.ok) load();
  };

  /* ――― 行更新（セル編集） ――― */
  const updateCell = (id, key, val) => {
    setRows(rows.map(row => row.id === id ? { ...row, [key]: val } : row));
  };

  const saveRow = async (row) => {
    await fetch(`${API_BASE_URL}/stakeholders/${row.id}`, {
      method : 'PUT',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify(row)
    });
  };

  /* ――― 削除 ――― */
  const handleDelete = async (id) => {
    if (!window.confirm('削除してよろしいですか？')) return;
    await fetch(`${API_BASE_URL}/stakeholders/${id}`, { method:'DELETE' });
    load();
  };

  /* ――― 描画 ――― */
  if (loading) return <p>読み込み中…</p>;

  return (
    <div className="up-card">
      <h2>🧑‍🤝‍🧑 ステークホルダー整理</h2>

      <table className="up-table">
        <thead>
          <tr>
            <th>氏名／部署</th>
            <th>役割</th>
            <th>影響度</th>
            <th>関心度</th>
            <th>メモ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td><input
                    value={r.name}
                    onChange={e=>updateCell(r.id,'name',e.target.value)}
                    onBlur={()=>saveRow(r)} /></td>
              <td><input
                    value={r.role}
                    onChange={e=>updateCell(r.id,'role',e.target.value)}
                    onBlur={()=>saveRow(r)} /></td>
              <td>
                <select
                  value={r.influence}
                  onChange={e=>{updateCell(r.id,'influence',e.target.value); saveRow({...r,influence:e.target.value});}}
                >
                  <option value="高">高</option>
                  <option value="中">中</option>
                  <option value="低">低</option>
                </select>
              </td>
              <td>
                <select
                  value={r.interest}
                  onChange={e=>{updateCell(r.id,'interest',e.target.value); saveRow({...r,interest:e.target.value});}}
                >
                  <option value="高">高</option>
                  <option value="中">中</option>
                  <option value="低">低</option>
                </select>
              </td>
              <td><input
                    value={r.notes}
                    onChange={e=>updateCell(r.id,'notes',e.target.value)}
                    onBlur={()=>saveRow(r)} /></td>
              <td><button onClick={()=>handleDelete(r.id)}>🗑</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-btn" onClick={handleAdd}>➕ 行を追加</button>
    </div>
  );
}