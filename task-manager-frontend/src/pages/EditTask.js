import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({ taskName: '', dueDate: '', category: '' });

  useEffect(() => {
    fetch(`http://localhost:8080/tasks/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('タスクが見つかりません');
        return res.json();
      })
      .then(data => setTask(data))
      .catch(err => {
        console.error('エラー:', err);
        alert('タスクの取得に失敗しました');
      });
  }, [id]);

  const handleSave = () => {
    fetch(`http://localhost:8080/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
      .then(res => {
        if (!res.ok) throw new Error('保存に失敗しました');
        navigate(`/tasks/${id}`);
      })
      .catch(err => {
        console.error('エラー:', err);
        alert('保存に失敗しました');
      });
  };

  return (
    <div>
      <h2>タスク編集</h2>
      <div>
        <input
          placeholder="タスク名"
          value={task.taskName}
          onChange={(e) => setTask({ ...task, taskName: e.target.value })}
        />
      </div>
      <div>
        <input
          type="date"
          value={task.dueDate || ''}
          onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
        />
      </div>
      <div>
        <input
          placeholder="カテゴリ"
          value={task.category}
          onChange={(e) => setTask({ ...task, category: e.target.value })}
        />
      </div>
      <div>
        <button onClick={handleSave}>保存</button>
        <button onClick={() => navigate(-1)}>キャンセル</button>
      </div>
    </div>
  );
}

export default EditTask;