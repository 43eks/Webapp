import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../App';

function MonthlyView() {
  const [habits, setHabits] = useState([]);
  const [selectedHabitId, setSelectedHabitId] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetch(`${API_BASE_URL}/habits`)
      .then(res => res.json())
      .then(data => setHabits(data))
      .catch(err => console.error('習慣の取得に失敗しました:', err));
  }, []);

  const getDatesInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const result = [];
    while (date.getMonth() === month) {
      result.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return result;
  };

  const changeMonth = (amount) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + amount);
    setCurrentMonth(newMonth);
  };

  const selectedHabit = habits.find(h => h.id === selectedHabitId);
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const days = getDatesInMonth(year, month);

  return (
    <div style={{ padding: '20px' }}>
      <h2>📅 月間習慣ビュー</h2>

      {/* 月切り替え & 習慣選択 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
        <button onClick={() => changeMonth(-1)}>⏮️ 前月</button>
        <strong>{year}年 {month + 1}月</strong>
        <button onClick={() => changeMonth(1)}>⏭️ 翌月</button>
        <select
          value={selectedHabitId}
          onChange={(e) => setSelectedHabitId(e.target.value)}
          style={{ marginLeft: 'auto', fontSize: '16px' }}
        >
          <option value="">-- 習慣を選択 --</option>
          {habits.map(habit => (
            <option key={habit.id} value={habit.id}>{habit.name}</option>
          ))}
        </select>
      </div>

      {/* カレンダー */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '10px'
      }}>
        {days.map(date => {
          const key = date.toISOString().split('T')[0];
          const status = selectedHabit?.records?.[key];
          return (
            <div
              key={key}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                backgroundColor: status ? '#e8ffe8' : '#fff'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{date.getDate()}</div>
              {selectedHabitId && (
                <div style={{ fontSize: '20px' }}>
                  {status ? '✅' : '❌'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthlyView;