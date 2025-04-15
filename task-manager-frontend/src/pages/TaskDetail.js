import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/api/tasks/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('タスクが見つかりません');
        return res.json();
      })
      .then((data) => setTask(data))
      .catch((err) => {
        console.error(err);
        alert('タスクの取得に失敗しました');
      });
  }, [id]);

  if (!task) return <div>読み込み中...</div>;

  return (
    <div>
      <h2>タスク詳細</h2>
      <p>タスク名: {task.taskName}</p>
      <p>期限: {task.dueDate || 'なし'}</p>
      <p>カテゴリ: {task.category || '未分類'}</p>
      <p>状態: {task.completed ? '完了' : '未完了'}</p>
      <button onClick={() => navigate(`/edit/${task.id}`)}>編集</button>
      <button onClick={() => navigate(-1)}>戻る</button>
    </div>
  );
}

export default TaskDetail;