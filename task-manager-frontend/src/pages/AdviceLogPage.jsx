import React, { useState, useEffect } from 'react';

function AdviceLogSection() {
  const [logs, setLogs] = useState([]);
  const [newAdvice, setNewAdvice] = useState('');

  // ログ取得
  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:8080/advice/logs');
      const data = await res.json();
      setLogs(data.reverse().slice(0, 5)); // 最新5件だけ表示
    } catch (err) {
      console.error('❌ ログ取得エラー:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 追加
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAdvice.trim()) return;

    const log = {
      message: newAdvice,
      source: 'ホーム画面',
    };

    try {
      const res = await fetch('http://localhost:8080/advice/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });

      if (res.ok) {
        setNewAdvice('');
        fetchLogs();
      } else {
        alert('送信に失敗しました');
      }
    } catch (err) {
      console.error('❌ 送信エラー:', err);
      alert('送信時にエラーが発生しました');
    }
  };

  return (
    <div style={sectionStyle}>
      <h3 style={{ marginBottom: '10px' }}>🧠 最近のアドバイス</h3>

      <form onSubmit={handleSubmit} style={{ marginBottom: '12px' }}>
        <input
          type="text"
          value={newAdvice}
          onChange={(e) => setNewAdvice(e.target.value)}
          placeholder="新しいアドバイスを追加"
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>➕</button>
      </form>

      <ul style={{ paddingLeft: '20px' }}>
        {logs.map((log, index) => (
          <li key={index} style={{ marginBottom: '6px' }}>
            {log.message}
          </li>
        ))}
      </ul>

      <a href="/advice" style={{ fontSize: '14px' }}>➡️ アドバイス一覧へ</a>
    </div>
  );
}

// --- スタイル定義 ---
const sectionStyle = {
  marginTop: '30px',
  padding: '15px',
  backgroundColor: '#fefefe',
  borderRadius: '10px',
  border: '1px solid #ddd',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
};

const inputStyle = {
  padding: '6px',
  fontSize: '14px',
  width: '70%',
  marginRight: '8px',
};

const buttonStyle = {
  padding: '6px 10px',
  fontSize: '14px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default AdviceLogSection;