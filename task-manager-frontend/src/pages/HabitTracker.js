import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../App';

const DAYS = 7;

function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [dates, setDates] = useState([]);
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // 習慣取得
  useEffect(() => {
    fetch(`${API_BASE_URL}/habits`)
      .then(res => res.json())
      .then(data => setHabits(data))
      .catch(err => console.error('習慣の取得に失敗しました:', err));
  }, []);

  // 日付生成
  useEffect(() => {
    const today = new Date();
    const recentDates = Array.from({ length: DAYS }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (DAYS - 1 - i));
      return d.toISOString().split('T')[0];
    });
    setDates(recentDates);
  }, []);

  // ✅ トグル
  const handleToggle = (habitId, date) => {
    const habit = habits.find(h => h.id === habitId);
    const current = habit.records?.[date] || false;
    const updatedRecords = {
      ...habit.records,
      [date]: !current
    };

    fetch(`${API_BASE_URL}/habits/${habitId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ records: updatedRecords })
    })
      .then(res => res.json())
      .then(updated => {
        setHabits(prev => prev.map(h => (h.id === habitId ? updated : h)));
      })
      .catch(err => {
        console.error('更新エラー:', err);
        alert('記録の更新に失敗しました');
      });
  };

  // 📊 達成率
  const calculateRate = (habit) => {
    const total = dates.length;
    const success = dates.filter(date => habit.records?.[date]).length;
    return Math.round((success / total) * 100);
  };

  // 📝 編集
  const startEdit = (habit) => {
    setEditingHabitId(habit.id);
    setEditingName(habit.name);
  };

  const saveEdit = (habitId) => {
    fetch(`${API_BASE_URL}/habits/${habitId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingName })
    })
      .then(res => res.json())
      .then(updated => {
        setHabits(prev => prev.map(h => (h.id === habitId ? updated : h)));
        setEditingHabitId(null);
        setEditingName('');
      })
      .catch(err => {
        console.error('名前変更エラー:', err);
        alert('習慣名の変更に失敗しました');
      });
  };

  // 🗑️ 削除
  const deleteHabit = (habitId) => {
    if (!window.confirm('本当にこの習慣を削除しますか？')) return;

    fetch(`${API_BASE_URL}/habits/${habitId}`, {
      method: 'DELETE'
    })
      .then(() => {
        setHabits(prev => prev.filter(h => h.id !== habitId));
      })
      .catch(err => {
        console.error('削除エラー:', err);
        alert('削除に失敗しました');
      });
  };

  // 📤 エクスポート
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(habits, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'habits_backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 📥 インポート
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedHabits = JSON.parse(event.target.result);

        for (const habit of importedHabits) {
          await fetch(`${API_BASE_URL}/habits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(habit)
          });
        }

        const res = await fetch(`${API_BASE_URL}/habits`);
        const data = await res.json();
        setHabits(data);
        alert('インポートが完了しました！');
      } catch (err) {
        console.error('インポートエラー:', err);
        alert('インポートに失敗しました');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📅 習慣トラッカー</h2>

      {/* インポート／エクスポート */}
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleExport}>📤 エクスポート</button>
        <input type="file" accept="application/json" onChange={handleImport} />
      </div>

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
            <th style={cellStyle}>🏆 達成率</th>
            <th style={cellStyle}>✏️ 編集</th>
            <th style={cellStyle}>🗑️ 削除</th>
          </tr>
        </thead>
        <tbody>
          {habits.map(habit => (
            <tr key={habit.id}>
              <td style={cellStyle}>
                {editingHabitId === habit.id ? (
                  <>
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      style={{ fontSize: '14px' }}
                    />
                    <button onClick={() => saveEdit(habit.id)}>保存</button>
                  </>
                ) : (
                  habit.name
                )}
              </td>
              {dates.map(date => (
                <td
                  key={date}
                  style={{ ...cellStyle, cursor: 'pointer' }}
                  onClick={() => handleToggle(habit.id, date)}
                >
                  {habit.records?.[date] ? '✅' : '❌'}
                </td>
              ))}
              <td style={cellStyle}>{calculateRate(habit)}%</td>
              <td style={cellStyle}>
                <button onClick={() => startEdit(habit)}>✏️</button>
              </td>
              <td style={cellStyle}>
                <button onClick={() => deleteHabit(habit.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cellStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'center'
};

export default HabitTracker;