import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [editTaskName, setEditTaskName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  // 初期タスクをロード
  useEffect(() => {
    fetch('http://localhost:8080/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error:', error));
  }, []);

  // タスクの追加
  const addTask = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskName: newTaskName, completed: false }),
    })
      .then(response => response.json())
      .then(data => {
        setTasks([...tasks, data]);
        setNewTaskName('');
      })
      .catch(error => console.error('Error:', error));
  };

  // タスクの更新
  const updateTask = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/tasks/${currentTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskName: editTaskName, completed: false }),
    })
      .then(response => response.json())
      .then(data => {
        setTasks(tasks.map(task => (task.id === currentTaskId ? data : task)));
        setIsEditing(false);
        setEditTaskName('');
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
      <h1>Task Manager</h1>

      <h2>{isEditing ? 'Edit Task' : 'Add New Task'}</h2>

      <form onSubmit={isEditing ? updateTask : addTask}>
        <input
          type="text"
          value={isEditing ? editTaskName : newTaskName}
          onChange={e => isEditing ? setEditTaskName(e.target.value) : setNewTaskName(e.target.value)}
          placeholder="Enter task name"
        />
        <button type="submit">{isEditing ? 'Update Task' : 'Add Task'}</button>
      </form>

      <h2>Task List</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.taskName} 
            <button onClick={() => { setIsEditing(true); setEditTaskName(task.taskName); setCurrentTaskId(task.id); }}>Edit</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;