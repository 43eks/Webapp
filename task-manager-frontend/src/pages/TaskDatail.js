import { useParams, Link } from 'react-router-dom';

function TaskDetail() {
  const { id } = useParams();
  // useEffect で fetch(`http://localhost:8080/api/tasks/${id}`)

  return (
    <div>
      <h2>タスク詳細</h2>
      <p>タスクID: {id}</p>
      {/* タスク名やカテゴリなど表示 */}
      <Link to={`/tasks/${id}/edit`}>編集する</Link><br />
      <Link to="/">戻る</Link>
    </div>
  );
}