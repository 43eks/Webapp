import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../App';

// 表示する日数（例：過去7日分）
const DAYS = 7;

function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [dates, setDates] = useState([]);

  // 習慣データを取得
  useEffect(() => {
    fetch(`${API_BASE_URL}/habits`)
      .then(res => res.json())
      .then(data => setHabits(data))
      .catch(err => console.error('習慣の取得に失敗しました:', err));
  }, []);

  // 直近の日付リストを生成
  useEffect(() => {
    const today = new Date();
    const recentDates = Array.from({ length: DAYS }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (DAYS - 1 - i));
      return d.toISOString().split('T')[0]; // yyyy-mm-dd
    });
    setDates(recentDates);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>📅 習慣トラッカー</h2>

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={cellStyle}>習慣</th>
            {dates.map(date => (
              <th key={date} style={cellStyle}>
                {new Date(date).toLocaleDateString('ja-JP', {
                  month: 'short',
                  day: 'numeric'
                })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map(habit => (
            <tr key={habit.id}>
              <td style={cellStyle}>{habit.name}</td>
              {dates.map(date => (
                <td key={date} style={cellStyle}>
                  {habit.records?.[date] ? '✅' : '❌'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// セルスタイル
const cellStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'center'
};

export default HabitTracker;