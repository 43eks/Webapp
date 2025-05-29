// src/pages/ProjectOverview.jsx
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../App';

export default function ProjectOverview() {
  // フォーム項目
  const [overview, setOverview] = useState({
    title: '',
    background: '',
    purpose: '',
    scopeIn: '',
    scopeOut: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(true);

  /* ---------- 初期読み込み ---------- */
  useEffect(() => {
    fetch(`${API_BASE_URL}/overview`)
      .then(res => (res.ok ? res.json() : {}))
      .then(data => setOverview({ ...overview, ...data }))
      .finally(() => setLoading(false))
      .catch(console.error);
    // eslint-disable-next-line
  }, []);

  /* ---------- 共通ハンドラ ---------- */
  const handleChange = (key, v) => setOverview(o => ({ ...o, [key]: v }));

  /* ---------- 保存 ---------- */
  const handleSave = async () => {
    const method = 'PUT';              // 常に 1 件だけ扱う前提
    const res = await fetch(`${API_BASE_URL}/overview`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(overview),
    });
    if (res.ok) alert('保存しました');
    else alert('保存に失敗しました');
  };

  if (loading) return <p style={{ padding: 20 }}>読み込み中…</p>;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2>🚀 プロジェクト概要（ステップ1）</h2>

      <label>プロジェクト名 *</label>
      <input
        value={overview.title}
        onChange={e => handleChange('title', e.target.value)}
        style={inputStyle}
        required
      />

      <label>背景 / 課題</label>
      <textarea
        value={overview.background}
        onChange={e => handleChange('background', e.target.value)}
        style={textareaStyle}
      />

      <label>目的 / 成果目標</label>
      <textarea
        value={overview.purpose}
        onChange={e => handleChange('purpose', e.target.value)}
        style={textareaStyle}
      />

      <label>スコープ IN（含まれる作業範囲）</label>
      <textarea
        value={overview.scopeIn}
        onChange={e => handleChange('scopeIn', e.target.value)}
        style={textareaStyle}
      />

      <label>スコープ OUT（対象外）</label>
      <textarea
        value={overview.scopeOut}
        onChange={e => handleChange('scopeOut', e.target.value)}
        style={textareaStyle}
      />

      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label>開始予定日</label>
          <input
            type="date"
            value={overview.startDate}
            onChange={e => handleChange('startDate', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>終了予定日</label>
          <input
            type="date"
            value={overview.endDate}
            onChange={e => handleChange('endDate', e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      <button onClick={handleSave} style={saveBtnStyle}>💾 保存</button>
    </div>
  );
}

/* --- 簡易スタイル --- */
const inputStyle = {
  width: '100%',
  padding: 8,
  marginBottom: 12,
  fontSize: 14,
};
const textareaStyle = {
  ...inputStyle,
  minHeight: 80,
  resize: 'vertical',
};
const saveBtnStyle = {
  marginTop: 20,
  padding: '10px 18px',
  fontSize: 15,
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};