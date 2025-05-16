// src/pages/AdviceLogPage.jsx
import React, { useState, useEffect } from 'react';

function AdviceLogPage() {
  const [logs, setLogs] = useState([]);
  const [newAdvice, setNewAdvice] = useState('');
  const [source, setSource] = useState('');

  // --- アドバイスログ取得 ---
  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:8080/advice/logs');
      const data = await res.json();
      setLogs(data.reverse()); // 新しい順に表示
    } catch (err) {
      console.error('❌ ログ取得エラー:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // --- アドバイスログ投稿 ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAdvice.trim()) return;

    const log = {
      message: newAdvice,
      source: source || '手動入力',
    };

    try {
      const res = await fetch('http://localhost:8080/advice/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });

      if (res.ok) {
        setNewAdvice('');
        setSource('');
        fetchLogs();
      } else {
        alert('ログの送信に失敗しました');
      }
    } catch (err) {
      console.error('❌ ログ送信エラー:', err);
      alert('ログ送信時にエラーが発生しました');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧠 アドバイスログ</h2>

      {/* --- 入力フォーム --- */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <textarea
          value={newAdvice}
          onChange={(e) => setNewAdvice(e.target.value)}
          placeholder="アドバイス内容を入力"
          style={{ width: '100%', height: '100px', fontSize: '16px', padding: '10px' }}
        />
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="出所（任意）"
          style={{ width: '50%', marginTop: '8px', padding: '6px', fontSize: '14px' }}
        />
        <br />
        <button
          type="submit"
          style={{
            marginTop: '10px',
            padding: '10px 16px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          追加
        </button>
      </form>

      {/* --- ログ表示 --- */}
      <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
        {logs.map((log, index) => (
          <li
            key={index}
            style={{
              marginBottom: '10px',
              padding: '10px',
              background: '#f9f9f9',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div><strong>{new Date(log.timestamp).toLocaleString()}</strong></div>
            <div>{log.message}</div>
            {log.source && <div style={{ color: '#666', fontSize: '14px' }}>出所: {log.source}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdviceLogPage;