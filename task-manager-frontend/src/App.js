import React, { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // バックエンドAPIからタスクを取得
    fetch('http://localhost:8080/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="App">
      <h1>Task List</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.taskName}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;