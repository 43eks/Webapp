// -------------------------------------------------------------
//  OverviewForm.jsx   （ステップ① : プロジェクト概要フォーム）
// -------------------------------------------------------------
import React, { useState } from 'react';
import './UpstreamCommon.css';                   // 既存共通スタイル

export default function OverviewForm() {
  const [form, setForm] = useState({
    projectName: '',
    owner      : '',
    purpose    : '',
    deadline   : '',
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* --- 送信（★いまはローカル表示のみ） --- */
  const handleSubmit = e => {
    e.preventDefault();
    console.table(form);
    alert('概要を保存しました（仮）');
  };

  return (
    <div className="up-card">
      <h2>① 概要フォーム</h2>

      <form onSubmit={handleSubmit} className="scope-form">
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

        <button className="add-btn">💾 保存</button>
      </form>
    </div>
  );
}