/* ------------------------------------------------------------------
 *  ステップ⑤：ステークホルダー分析
 * ----------------------------------------------------------------*/
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../App';
import './UpstreamCommon.css';

/** 新規追加時のテンプレ */
const emptyRow = () => ({
  id: null,
  name: '',
  role: '',
  influence: '中',      // H | 中 | L で統一
  interest:  '中',      // H | 中 | L
});

export default function StakeholdersPage() {
  /* ---------------- state ---------------- */
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- 初期ロード ---------------- */
  useEffect(() => { load(); }, []);

  /** 一覧取得 */
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/stakeholders`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setRows(await res.json());
    } catch (e) {
      console.error('❌ ステークホルダー取得失敗:', e);
      alert('ステークホルダーの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- 追加 ---------------- */
  const addRow = () => setRows([...rows, emptyRow()]);

  /* ---------------- 行編集 ---------------- */
  const updateCell = (id, key, value) =>
    setRows(rows.map(r => (r.id === id ? { ...r, [key]: value } : r)));

  /** 保存（id あり＝PUT / なし＝POST） */
  const saveRow = async row => {
    if (!row.name.trim()) return;               // 名前必須
    const url    = `${API_BASE_URL}/stakeholders${row.id ? `/${row.id}` : ''}`;
    const method = row.id ? 'PUT' : 'POST';

    try {
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(row),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      load();                                   // 再取得して同期
    } catch (e) {
      console.error('❌ 保存失敗:', e);
      alert('保存に失敗しました');
    }
  };

  /* ---------------- 削除 ---------------- */
  const deleteRow = async id => {
    if (!id) {                     // まだ保存していない行はローカル削除のみ
      setRows(rows.filter(r => r.id));
      return;
    }
    if (!window.confirm('削除しますか？')) return;
    try {
      const r = await fetch(`${API_BASE_URL}/stakeholders/${id}`, { method:'DELETE' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      load();
    } catch (e) {
      console.error('❌ 削除失敗:', e);
      alert('削除に失敗しました');
    }
  };

  /* ---------------- 画面 ---------------- */
  if (loading) return <p className="up-loading">読み込み中…</p>;

  return (
    <div className="up-card">
      <h2>🧑‍🤝‍🧑 ステークホルダー分析</h2>

      <table className="up-table">
        <thead>
          <tr>
            <th>氏名 / 部署</th>
            <th>役割・立場</th>
            <th>影響度</th>
            <th>関心度</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id ?? `tmp-${i}`}>
              {/* 氏名 */}
              <td>
                <input
                  value={r.name}
                  onChange={e => updateCell(r.id, 'name', e.target.value)}
                  onBlur={() => saveRow(r)}
                />
              </td>

              {/* 役割 */}
              <td>
                <input
                  value={r.role}
                  onChange={e => updateCell(r.id, 'role', e.target.value)}
                  onBlur={() => saveRow(r)}
                />
              </td>

              {/* 影響度 */}
              <td>
                <select
                  value={r.influence}
                  onChange={e => updateCell(r.id, 'influence', e.target.value)}
                  onBlur={() => saveRow(r)}
                >
                  <option value="高">高</option>
                  <option value="中">中</option>
                  <option value="低">低</option>
                </select>
              </td>

              {/* 関心度 */}
              <td>
                <select
                  value={r.interest}
                  onChange={e => updateCell(r.id, 'interest', e.target.value)}
                  onBlur={() => saveRow(r)}
                >
                  <option value="高">高</option>
                  <option value="中">中</option>
                  <option value="低">低</option>
                </select>
              </td>

              {/* 削除 */}
              <td>
                <button onClick={() => deleteRow(r.id)}>🗑</button>
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