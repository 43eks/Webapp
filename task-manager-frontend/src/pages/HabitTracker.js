// ✅ トグル
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
      body: JSON.stringify({ records: updatedRecords }) // ✅ recordsを送る
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