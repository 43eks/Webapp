import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/tasks/${id}`)
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
    <div style={{ padding: '20px' }}>
      <h2>📝 タスク詳細</h2>
      <p><strong>タスク名:</strong> {task.title}</p>
      <p><strong>カテゴリ:</strong> {task.category || '未分類'}</p>
      <p><strong>作成日:</strong> {new Date(task.createdAt).toLocaleDateString()}</p>
      <p><strong>状態:</strong> {task.done ? '完了' : '未完了'}</p>

      <button onClick={() => navigate(`/tasks/${task.id}/edit`)} style={buttonStyle}>✏️ 編集</button>
      <button onClick={() => navigate(-1)} style={buttonStyle}>↩️ 戻る</button>
    </div>
  );
}

const buttonStyle = {
  marginRight: '10px',
  padding: '8px 12px',
  fontSize: '14px',
  cursor: 'pointer',
  borderRadius: '6px',
  border: '1px solid #ccc',
  backgroundColor: '#f9f9f9'
};

export default TaskDetail;