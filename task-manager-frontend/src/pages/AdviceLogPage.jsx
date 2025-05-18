// src/pages/AdviceLogPage.jsx
import React, { useState, useEffect } from 'react';

function AdviceLogPage() {
  const [logs, setLogs] = useState([]);
  const [newAdvice, setNewAdvice] = useState('');
  const [source, setSource] = useState('');

  // ログの取得
  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:8080/advice/logs');
      const data = await res.json();
      setLogs(data.reverse());
    } catch (err) {
      console.error('❌ ログ取得エラー:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // ログの投稿
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
        alert('アドバイスの送信に失敗しました');
      }
    } catch (err) {
      console.error('❌ 送信エラー:', err);
      alert('エラーが発生しました');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🧠 アドバイスログページ</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <textarea
          value={newAdvice}
          onChange={(e) => setNewAdvice(e.target.value)}
          placeholder="アドバイス内容を入力..."
          style={{
            width: '100%',
            height: '100px',
            fontSize: '16px',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="出所（任意）"
          style={{
            width: '60%',
            padding: '8px',
            fontSize: '14px',
            marginRight: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          登録
        </button>
      </form>

      <h3>📋 全てのアドバイス</h3>
      <ul>
        {logs.map((log, index) => (
          <li key={index} style={{ marginBottom: '12px' }}>
            <strong>{new Date(log.timestamp).toLocaleString()}</strong> - {log.message}
            {log.source && <span>（出所: {log.source}）</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdviceLogPage;