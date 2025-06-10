// src/pages/upstream/OverviewForm.jsx
// ────────────────────────────────────────────────
// ステップ① : 概要情報入力フォーム
//   - /scope へ GET／PUT して基本情報を保存
// ────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../App';          // ← 共通定義

export default function OverviewForm() {
  /* ---------------- ローカル state ---------------- */
  const [form, setForm]   = useState({
    projectName: '',
    owner      : '',
    purpose    : '',
    deadline   : '',
  });
  const [loading, setLoading] = useState(true);

  /* ---------------- 初期読み込み ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/scope`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setForm({ ...form, ...data });             // 既存値をマージ
      } catch (e) {
        console.warn('⚠️ 既存 Scope なし（新規作成モード）');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- 入力ハンドラ ---------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------------- 保存 ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/scope`, {
        method : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      alert('概要を保存しました ✅');
    } catch (err) {
      console.error('❌ 概要保存失敗:', err);
      alert('概要の保存に失敗しました');
    }
  };

  /* ---------------- 画面描画 ---------------- */
  if (loading) return <p>読み込み中…</p>;

  return (
    <div style={{ maxWidth: 640 }}>
      <h3>① 概要フォーム</h3>
      <form onSubmit={handleSubmit} style={formGrid}>
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

/* ---------------- スタイル ---------------- */
const formGrid = {
  display: 'grid',
  gap    : 12,
};

const saveBtnStyle = {
  padding      : '8px 16px',
  background   : '#4CAF50',
  color        : '#fff',
  border       : 'none',
  borderRadius : 6,
  cursor       : 'pointer',
};