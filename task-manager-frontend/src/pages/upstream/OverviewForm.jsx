// ────────────────────────────────────────────────
// ステップ1：概要情報入力フォーム（プロジェクト基本情報など）
// ────────────────────────────────────────────────
import React, { useState } from 'react';

export default function OverviewForm() {
  const [form, setForm] = useState({
    projectName: '',
    owner: '',
    purpose: '',
    deadline: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // ★ ここでバックエンドへ POST するなど保存処理を追加予定
    console.table(form);
    alert('概要を保存しました（仮実装）');
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h3>① 概要フォーム</h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          プロジェクト名
          <input
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          オーナー / 責任者
          <input
            name="owner"
            value={form.owner}
            onChange={handleChange}
          />
        </label>

        <label>
          目的・背景
          <textarea
            name="purpose"
            rows={4}
            value={form.purpose}
            onChange={handleChange}
          />
        </label>

        <label>
          目標期限
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />
        </label>

        <button style={saveBtnStyle}>💾 保存</button>
      </form>
    </div>
  );
}

const saveBtnStyle = {
  padding: '8px 16px',
  background: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};