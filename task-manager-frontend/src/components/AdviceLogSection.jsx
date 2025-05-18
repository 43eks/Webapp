// src/components/AdviceLogSection.jsx
import React, { useEffect, useState } from 'react';

function AdviceLogSection() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/advice/logs')
      .then(res => res.json())
      .then(data => setLogs(data.slice(-3).reverse())) // 最新3件を表示
      .catch(err => console.error('❌ アドバイスログ取得エラー:', err));
  }, []);

  return (
    <div style={{ marginTop: '40px' }}>
      <h3>🧠 最近のアドバイス</h3>
      {logs.length === 0 ? (
        <p>アドバイスがまだありません。</p>
      ) : (
        <ul>
          {logs.map((log, index) => (
            <li key={index}>
              <strong>{new Date(log.timestamp).toLocaleString()}</strong>：{log.message}
              {log.source && <span>（{log.source}）</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdviceLogSection;