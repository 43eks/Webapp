import React, { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  // タスクの取得
  useEffect(() => {
    fetch('http://localhost:8080/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error:', error));
  }, []);

  // タスクの追加
  const addTask = () => {
    if (!taskName) return;
    
    const newTask = { taskName: taskName, completed: false };
    
    fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then(response => response.json())
      .then(data => {
        setTasks([...tasks, data]);
        setTaskName('');
      })
      .catch(error => console.error('Error:', error));
  };

  // タスクの削除
  const deleteTask = (id) => {
    fetch(`http://localhost:8080/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className="App">
      <h1>タスク管理</h1>
      
      {/* タスク追加フォーム */}
      <div>
        <input 
          type="text" 
          placeholder="新しいタスク" 
          value={taskName} 
          onChange={(e) => setTaskName(e.target.value)} 
        />
        <button onClick={addTask}>タスクを追加</button>
      </div>

      {/* タスク一覧 */}
      <div>
        <button onClick={() => setTasks([])}>タスク一覧を表示</button>
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              {task.taskName} 
              <button onClick={() => deleteTask(task.id)}>削除</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;