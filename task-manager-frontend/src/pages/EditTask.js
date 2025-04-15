import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({ taskName: '', dueDate: '', category: '' });

  useEffect(() => {
    fetch(`http://localhost:8080/api/tasks/${id}`)
      .then(res => res.json())
      .then(data => setTask(data));
  }, [id]);

  const handleSave = () => {
    fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
      .then(() => navigate(`/tasks/${id}`));
  };

  return (
    <div>
      <h2>タスク編集</h2>
      <input value={task.taskName} onChange={(e) => setTask({ ...task, taskName: e.target.value })} />
      <input type="date" value={task.dueDate || ''} onChange={(e) => setTask({ ...task, dueDate: e.target.value })} />
      <input value={task.category} onChange={(e) => setTask({ ...task, category: e.target.value })} />
      <button onClick={handleSave}>保存</button>
      <button onClick={() => navigate(-1)}>キャンセル</button>
    </div>
  );
}