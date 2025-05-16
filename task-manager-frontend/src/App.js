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

  // ログの追加
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
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <textarea
          value={newAdvice}
          onChange={(e) => setNewAdvice(e.target.value)}
          placeholder="アドバイス内容を入力"
          style={{ width: '100%', height: '100px', fontSize: '16px' }}
        />
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="出所（任意）"
          style={{ width: '50%', marginTop: '8px', padding: '6px', fontSize: '14px' }}
        />
        <br />
        <button type="submit" style={{ marginTop: '10px', padding: '10px 16px' }}>追加</button>
      </form>

      <ul>
        {logs.map((log, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <strong>{log.timestamp}</strong>：{log.message} {log.source && `(出所: ${log.source})`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdviceLogPage;
