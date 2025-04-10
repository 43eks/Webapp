import React, { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);  // タスクの一覧
  const [taskName, setTaskName] = useState("");  // 新しいタスク名
  const [isLoading, setIsLoading] = useState(false);  // ローディング状態

  // バックエンドAPIからタスクを取得
  const fetchTasks = () => {
    setIsLoading(true);
    fetch('http://localhost:8080/tasks')
      .then(response => response.json())
      .then(data => {
        setTasks(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        setIsLoading(false);
      });
  };

  // タスクをバックエンドに追加
  const handleAddTask = (e) => {
    e.preventDefault();
    const newTask = { taskName: taskName, completed: false };

    fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then(response => response.json())
      .then(() => {
        setTaskName("");  // フォームをクリア
        fetchTasks();  // 最新のタスク一覧を取得
      })
      .catch(error => console.error('Error adding task:', error));
  };

  // タスクを削除
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        fetchTasks();  // 最新のタスク一覧を取得
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  // コンポーネントがマウントされた時にタスクを取得
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      <h1>Task Manager</h1>

      {/* タスク追加フォーム */}
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Add a new task"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      {/* タスク一覧表示ボタン */}
      <button onClick={fetchTasks} disabled={isLoading}>
        {isLoading ? "Loading..." : "Show Tasks"}
      </button>

      {/* タスク一覧 */}
      <ul>
        {tasks.length === 0 && <li>No tasks available</li>}
        {tasks.map((task) => (
          <li key={task.id}>
            {task.taskName}{" "}
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;