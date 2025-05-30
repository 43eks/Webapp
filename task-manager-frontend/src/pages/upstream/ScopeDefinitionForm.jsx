// ────────────────────────────────────────────────
// ステップ2：要件定義フォーム（ユーザ要求・業務要件など）
// ────────────────────────────────────────────────
import React, { useState } from 'react';

export default function ScopeDefinitionForm() {
  const [requirements, setRequirements] = useState([
    { id: Date.now(), text: '' },
  ]);

  /* --------------- ハンドラ --------------- */
  const updateReq = (id, value) =>
    setRequirements(reqs =>
      reqs.map(r => (r.id === id ? { ...r, text: value } : r)),
    );

  const addReq = () =>
    setRequirements(reqs => [...reqs, { id: Date.now(), text: '' }]);

  const removeReq = id =>
    setRequirements(reqs => reqs.filter(r => r.id !== id));

  const save = e => {
    e.preventDefault();
    // TODO: バックエンドへ保存 POST
    console.table(requirements);
    alert('要件を保存しました（仮実装）');
  };

  /* --------------- 画 面 --------------- */
  return (
    <div style={{ maxWidth: 700 }}>
      <h3>② 要件定義フォーム</h3>
      <form onSubmit={save} style={{ display: 'grid', gap: 16 }}>
        {requirements.map((r, idx) => (
          <div key={r.id} style={{ display: 'flex', gap: 8 }}>
            <textarea
              value={r.text}
              onChange={e => updateReq(r.id, e.target.value)}
              placeholder={`要件 ${idx + 1}`}
              rows={2}
              style={{ flex: 1 }}
              required
            />
            {requirements.length > 1 && (
              <button
                type="button"
                onClick={() => removeReq(r.id)}
                style={delBtn}
                title="削除"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <div>
          <button
            type="button"
            onClick={addReq}
            style={addBtn}
          >
            ➕ 要件を追加
          </button>
        </div>
        <button style={saveBtn}>💾 保存</button>
      </form>
    </div>
  );
}

/* --- 簡易スタイル --- */
const addBtn = {
  padding: '6px 12px',
  background: '#1976D2',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 14,
};
const delBtn = {
  padding: '0 8px',
  background: '#E53935',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};
const saveBtn = {
  padding: '8px 16px',
  background: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};