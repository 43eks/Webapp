// ③ 機能一覧ページ
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../App';
import './UpstreamCommon.css';         // 既存の共通スタイルを流用

// 新規行のテンプレート
const newFeature = () => ({
  id: null,               // ← 未保存行は id が無い
  name: '',
  overview: '',
  priority: 'M',          // H / M / L
  owner: '',
});

export default function FeatureList() {
  /* -------------------- state -------------------- */
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);

  /* ------------------ CRUD ------------------ */
  /** 一覧取得 */
  const load = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE_URL}/features`);
      const data = await res.json();
      setRows(data);
    } catch (e) {
      console.error('❌ 機能一覧取得失敗:', e);
      alert('機能一覧の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  /** 行追加（未保存行をテーブルに挿入） */
  const addRow = () => setRows(prev => [...prev, newFeature()]);

  /** セル編集 */
  const updateCell = (index, key, value) =>
    setRows(prev => prev.map((r, i) => (i === index ? { ...r, [key]: value } : r)));

  /** 行削除（保存済みなら DELETE、未保存ならフロントだけ削除） */
  const deleteRow = async index => {
    const target = rows[index];
    if (target.id) {
      if (!window.confirm('サーバーからも削除します。よろしいですか？')) return;
      await fetch(`${API_BASE_URL}/features/${target.id}`, { method: 'DELETE' });
    }
    setRows(prev => prev.filter((_, i) => i !== index));
  };

  /** 保存：POST（新規） or PUT（更新）を一括で走らせる */
  const saveAll = async () => {
    try {
      for (const r of rows) {
        // 空行はスキップ
        if (!r.name.trim()) continue;

        const method = r.id ? 'PUT' : 'POST';
        const url    = r.id
          ? `${API_BASE_URL}/features/${r.id}`
          : `${API_BASE_URL}/features`;

        await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(r),
        });
      }
      alert('保存しました');
      load();                      // リロードして最新状態を反映
    } catch (e) {
      console.error('❌ 保存失敗:', e);
      alert('保存に失敗しました');
    }
  };

  /* -------------------- UI -------------------- */
  if (loading) return <p>読み込み中…</p>;

  return (
    <div className="up-card">
      <h2>🛠 機能一覧</h2>

      <table className="up-table">
        <thead>
          <tr>
            <th style={{ width: 200 }}>機能名</th>
            <th>概要</th>
            <th style={{ width: 90 }}>優先度</th>
            <th style={{ width: 120 }}>担当</th>
            <th style={{ width: 50 }}></th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id ?? `tmp-${idx}`}>
              {/* 機能名 */}
              <td>
                <input
                  value={row.name}
                  onChange={e => updateCell(idx, 'name', e.target.value)}
                />
              </td>

              {/* 概要 */}
              <td>
                <input
                  value={row.overview}
                  onChange={e => updateCell(idx, 'overview', e.target.value)}
                />
              </td>

              {/* 優先度 */}
              <td>
                <select
                  value={row.priority}
                  onChange={e => updateCell(idx, 'priority', e.target.value)}
                >
                  <option value="H">H</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                </select>
              </td>

              {/* 担当 */}
              <td>
                <input
                  value={row.owner}
                  onChange={e => updateCell(idx, 'owner', e.target.value)}
                />
              </td>

              {/* 削除ボタン */}
              <td>
                <button onClick={() => deleteRow(idx)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 行追加 & 保存 */}
      <div style={{ marginTop: 14 }}>
        <button className="add-btn" onClick={addRow}>➕ 行を追加</button>
        <button
          className="add-btn"
          style={{ marginLeft: 8, background: '#28a745' }}
          onClick={saveAll}
        >
          💾 保存
        </button>
      </div>
    </div>
  );
}