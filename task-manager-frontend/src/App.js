import React, { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('エラー:', error));
  }, []);

  const handleAddTask = () => {
    const newTask = { taskName, completed };
    fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    })
      .then(response => response.json())
      .then(data => {
        setTasks([...tasks, data]);
        setTaskName('');
        setCompleted(false);
      })
      .catch(error => console.error('エラー:', error));
  };

  const handleDeleteTask = (id) => {
    fetch(`http://localhost:8080/tasks/${id}`, { method: 'DELETE' })
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.error('エラー:', error));
  };

  return (
    <div className="App">
      <h1>タスクリスト</h1>
      <input
        type="text"
        placeholder="タスク名を入力"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <button onClick={handleAddTask}>タスクを追加</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.taskName} - {task.completed ? '完了' : '未完了'}
            <button onClick={() => handleDeleteTask(task.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;