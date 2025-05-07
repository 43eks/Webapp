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
    <div style={{ padding: '30px', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>📅 月間習慣ビュー</h2>

      {/* 月切り替え & 習慣選択 */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '20px',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <button onClick={() => changeMonth(-1)} style={navButtonStyle}>⏮️ 前月</button>
        <strong style={{ fontSize: '20px' }}>{year}年 {month + 1}月</strong>
        <button onClick={() => changeMonth(1)} style={navButtonStyle}>⏭️ 翌月</button>

        <select
          value={selectedHabitId}
          onChange={(e) => setSelectedHabitId(e.target.value)}
          style={selectStyle}
        >
          <option value="">-- 習慣を選択 --</option>
          {habits.map(habit => (
            <option key={habit.id} value={habit.id}>{habit.name}</option>
          ))}
        </select>
      </div>

      {/* カレンダー表示 */}
      {selectedHabitId ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
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
                  borderRadius: '10px',
                  padding: '10px',
                  textAlign: 'center',
                  backgroundColor: status ? '#d1fae5' : '#fff',
                  color: status ? '#065f46' : '#333',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{date.getDate()}</div>
                <div style={{ fontSize: '22px' }}>
                  {status ? '✅' : '❌'}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '30px', color: '#666' }}>
          習慣を選択してください。
        </p>
      )}
    </div>
  );
}

// --- スタイル ---
const navButtonStyle = {
  padding: '8px 16px',
  fontSize: '16px',
  backgroundColor: '#4f46e5',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const selectStyle = {
  padding: '8px',
  fontSize: '16px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  minWidth: '200px'
};

export default MonthlyView;