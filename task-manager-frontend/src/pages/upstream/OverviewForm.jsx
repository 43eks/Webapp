// -------------------------------------------------------------
//  OverviewForm.jsx   ― ステップ① : プロジェクト概要フォーム
// -------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../App';   // ← 追加：API URL
import './OverviewForm.css';               // 専用スタイル
import './UpstreamCommon.css';             // 共通スタイル

/* 入力欄の初期値をまとめて定義 ------------- */
const EMPTY = {
  projectName: '',
  owner      : '',
  purpose    : '',
  deadline   : '',
};

export default function OverviewForm() {
  /* ---------------- state ---------------- */
  const [form   , setForm]   = useState(EMPTY); // 入力内容
  const [saving , setSaving] = useState(false); // 保存中フラグ
  const [loaded , setLoaded] = useState(false); // 初回読込フラグ

  /* ---------------- 既存データ読込 ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/scope`);
        if (!res.ok) throw new Error(res.status);
        const data = await res.json();
        // 既存スコープがあればフォームへ反映
        if (data && Object.keys(data).length) setForm({ ...EMPTY, ...data });
      } catch (err) {
        console.error('❌ Scope load error:', err);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  /* ---------------- 入力ハンドラ ---------------- */
  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------------- 保存 ---------------- */
  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE_URL}/scope`, {
        method : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(form),
      });
      if (!res.ok) throw new Error(res.status);

      // ✅ 完了メッセージ & 入力欄リセット
      alert('概要を保存しました');
      setForm(EMPTY);
    } catch (err) {
      console.error('❌ Scope save error:', err);
      alert('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- 画面 ---------------- */
  if (!loaded) return <p>読み込み中…</p>;

  return (
    <div className="up-card overview-card">
      <h2>① プロジェクト概要</h2>

      <form onSubmit={handleSubmit} className="ov-form">
        {/* ---- プロジェクト名 ---- */}
        <div className="ov-row">
          <span className="ov-label">プロジェクト名</span>
          <input
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
            required
          />
        </div>

        {/* ---- オーナー ---- */}
        <div className="ov-row">
          <span className="ov-label">オーナー / 責任者</span>
          <input
            name="owner"
            value={form.owner}
            onChange={handleChange}
          />
        </div>

        {/* ---- 目的・背景 ---- */}
        <div className="ov-row">
          <span className="ov-label">目的・背景</span>
          <textarea
            name="purpose"
            className="ov-purpose"
            value={form.purpose}
            onChange={handleChange}
          />
        </div>

        {/* ---- 目標期限 ---- */}
        <div className="ov-row">
          <span className="ov-label">目標期限</span>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />
        </div>

        {/* ---- ボタン ---- */}
        <div className="ov-actions">
          <button
            type="submit"
            className="ov-save-btn"
            disabled={saving}
          >
            {saving ? '保存中…' : '💾 保存'}
          </button>
        </div>
      </form>
    </div>
  );
}