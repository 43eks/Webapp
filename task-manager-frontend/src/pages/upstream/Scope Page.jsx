// スコープ・目的入力   /upstream/scope
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../App';
import './UpstreamCommon.css';   /* 既存共通 CSS */

export default function ScopePage() {
  const [scope, setScope]   = useState({
    purpose: '',
    background: '',
    kpi: '',
    outOfScope: ''
  });
  const [loading, setLoading] = useState(true);

  /* ---------- 初期ロード ---------- */
  useEffect(() => { load(); }, []);
  const load = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE_URL}/scope`);
      const json = await res.json();
      setScope({ ...scope, ...json });          // 値があれば上書き
    } catch (e) {
      console.warn('初回スコープ未登録（問題なし）');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- 保存 ---------- */
  const save = async (key, value) => {
    const newScope = { ...scope, [key]: value };
    setScope(newScope);

    await fetch(`${API_BASE_URL}/scope`, {
      method : 'PUT',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify(newScope)
    });
  };

  if (loading) return <p>読み込み中…</p>;

  return (
    <div className="up-card">
      <h2>📌 スコープ・目的定義</h2>

      <label className="up-label">■ 目的 / Goal</label>
      <textarea
        className="up-textarea"
        value={scope.purpose}
        placeholder="プロジェクトの最終目的を記述"
        onChange={e => save('purpose', e.target.value)}
      />

      <label className="up-label">■ 背景 / Background</label>
      <textarea
        className="up-textarea"
        value={scope.background}
        placeholder="現状の課題や経緯など"
        onChange={e => save('background', e.target.value)}
      />

      <label className="up-label">■ 成功指標 (KPI)</label>
      <textarea
        className="up-textarea"
        value={scope.kpi}
        placeholder="定量・定性指標を列挙"
        onChange={e => save('kpi', e.target.value)}
      />

      <label className="up-label">■ 対象外範囲 / Out-of-Scope</label>
      <textarea
        className="up-textarea"
        value={scope.outOfScope}
        placeholder="本プロジェクトで扱わない範囲"
        onChange={e => save('outOfScope', e.target.value)}
      />
    </div>
  );
}