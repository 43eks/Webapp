// ------------------------------------------------------------------
//  OverviewForm.jsx   – ① プロジェクト概要フォーム（リファイン版）
// ------------------------------------------------------------------
import React, { useState } from 'react';
import './UpstreamCommon.css';   // 既存共通カード等
import './OverviewForm.css';    // ⭐ 今回の専用スタイル

export default function OverviewForm() {
  /* ---------------- state ---------------- */
  const [form, setForm] = useState({
    projectName: '',
    owner      : '',
    purpose    : '',
    deadline   : '',
  });

  /* ---------------- handler ---------------- */
  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: /scope エンドポイントへ PUT するなど実装
    console.table(form);
    alert('概要を保存しました（仮実装）');
  };

  /* ---------------- view ---------------- */
  return (
    <div className="up-card overview-card">
      <h2>📄 プロジェクト概要</h2>

      <form className="ov-form" onSubmit={handleSubmit}>
        <FormRow label="プロジェクト名 *">
          <input
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
            required
          />
        </FormRow>

        <FormRow label="オーナー / 責任者">
          <input
            name="owner"
            value={form.owner}
            onChange={handleChange}
          />
        </FormRow>

        <FormRow label="目的・背景">
          <textarea
            name="purpose"
            rows={4}
            className="ov-purpose"
            placeholder="例）業務効率化のため ×× を Web 化し、△△% の工数削減を目指す…"
            value={form.purpose}
            onChange={handleChange}
          />
        </FormRow>

        <FormRow label="目標期限">
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />
        </FormRow>

        <div className="ov-actions">
          <button type="submit" className="ov-save-btn">💾 保存</button>
        </div>
      </form>
    </div>
  );
}

/* ---------- 行レイアウトの小コンポーネント ---------- */
function FormRow({ label, children }) {
  return (
    <label className="ov-row">
      <span className="ov-label">{label}</span>
      {children}
    </label>
  );
}