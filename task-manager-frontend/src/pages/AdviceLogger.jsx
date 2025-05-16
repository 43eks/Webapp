import React, { useEffect, useState } from 'react';

function AdviceLogger() {
  const [logs, setLogs] = useState([]);
  const [input, setInput] = useState('');

  // ログ送信
  const submitLog = async () => {
    if (!input.trim()) return;
    await fetch('http://localhost:8080/advice-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });
    setInput('');
    fetchLogs();
  };

  // ログ取得
  const fetchLogs = async () => {
    const res = await fetch('http://localhost:8080/advice-log');
    const data = await res.json();
    setLogs(data.reverse());
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧠 アドバイスログ</h2>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={4}
        style={{ width: '100%', marginBottom: '10px' }}
        placeholder="アドバイス用ログを記録..."
      />
      <button onClick={submitLog} style={{ padding: '8px 16px' }}>📩 送信</button>

      <ul style={{ marginTop: '20px' }}>
        {logs.map((log, idx) => (
          <li key={idx} style={{ marginBottom: '10px' }}>
            <strong>{new Date(log.createdAt).toLocaleString()}</strong><br />
            {log.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdviceLogger;