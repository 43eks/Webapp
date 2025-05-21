// src/components/AdviceLogSection.jsx
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../App';
import './AdviceLogSection.css'; // 後述のスタイル用

function AdviceLogSection() {
  const [logs, setLogs] = useState([]);
  const [newAdvice, setNewAdvice] = useState('');
  const [source, setSource] = useState('');

  // 取得: 最新3件
  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/advice/logs`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLogs(data.slice(-3).reverse());
    } catch (err) {
      console.error('❌ アドバイスログ取得エラー:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 追加
  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = newAdvice.trim();
    if (!msg) return;
    const payload = { message: msg, source: source.trim() || 'ホーム画面' };

    try {
      const res = await fetch(`${API_BASE_URL}/advice/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setNewAdvice('');
      setSource('');
      fetchLogs();
    } catch (err) {
      console.error('❌ アドバイスログ送信エラー:', err);
      alert('アドバイスの送信に失敗しました');
    }
  };

  return (
    <div className="advice-section">
      <h3>🧠 最近のアドバイス</h3>

      <form onSubmit={handleSubmit} className="advice-form">
        <input
          type="text"
          value={newAdvice}
          onChange={e => setNewAdvice(e.target.value)}
          placeholder="アドバイスを入力"
          className="advice-input"
        />
        <input
          type="text"
          value={source}
          onChange={e => setSource(e.target.value)}
          placeholder="出所（任意）"
          className="advice-input small"
        />
        <button type="submit" className="advice-button">追加</button>
      </form>

      {logs.length === 0 ? (
        <p className="no-logs">アドバイスがまだありません。</p>
      ) : (
        <ul className="advice-list">
          {logs.map((log, i) => (
            <li key={i} className="advice-item">
              <span className="advice-time">
                {new Date(log.timestamp).toLocaleString()}
              </span>
              ： {log.message}
              {log.source && <small className="advice-source">（{log.source}）</small>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdviceLogSection;