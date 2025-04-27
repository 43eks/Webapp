import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../App'; // ←これOK

const DAYS = 7;

// ✅ コンポーネント本体！
function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/habits`)
      .then(res => res.json())
      .then(data => setHabits(data))
      .catch(err => console.error('習慣の取得に失敗しました:', err));
  }, []);

  useEffect(() => {
    const today = new Date();
    const recentDates = Array.from({ length: DAYS }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (DAYS - 1 - i));
      return d.toISOString().split('T')[0];
    });
    setDates(recentDates);
  }, []);

  // ✅ 君がくれた handleToggle
  const handleToggle = async (habitId, date) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const current = habit.records?.[date] || false;
    const updatedRecords = {
      ...habit.records,
      [date]: !current
    };

    try {
      const res = await fetch(`${API_BASE_URL}/habits/${habitId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: updatedRecords })
      });

      if (!res.ok) {
        throw new Error('更新に失敗しました');
      }

      const updatedHabit = await res.json();

      setHabits(prev =>
        prev.map(h => (h.id === habitId ? updatedHabit : h))
      );
    } catch (err) {
      console.error('更新エラー:', err);
      alert('記録の更新に失敗しました');
    }
  };

  return (
    <div>
      <h2>Habit Tracker</h2>
      {/* ここにhabit表示のUIを書く */}
    </div>
  );
}

// ✅ 忘れずに export default！
export default HabitTracker;