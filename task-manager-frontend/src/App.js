// 修正点：fetch URL を `/api/tasks` に変更（Spring Boot 側に合わせる）

const fetchTasks = () => {
  fetch('http://localhost:8080/api/tasks')
    .then(response => response.json())
    .then(data => setTasks(data))
    .catch(error => console.error('Error:', error));
};

const addTask = () => {
  if (!taskName) return;

  const newTask = {
    taskName: taskName,
    completed: false,
    dueDate: dueDate || null,
    category: category || '',
  };

  fetch('http://localhost:8080/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('タスクの追加に失敗しました');
      }
      return response.json(); // レスポンスを利用する場合はこちらを活用
    })
    .then(() => {
      fetchTasks(); // 追加成功後に再取得
      setTaskName('');
      setDueDate('');
      setCategory('');
    })
    .catch(error => console.error('Error:', error));
};

const deleteTask = (id) => {
  fetch(`http://localhost:8080/api/tasks/${id}`, {
    method: 'DELETE',
  })
    .then(() => fetchTasks()) // こちらも直接再取得に
    .catch(error => console.error('Error:', error));
};

const toggleTaskCompletion = (id) => {
  const updatedTask = tasks.find(task => task.id === id);
  if (!updatedTask) return;

  const newTask = { ...updatedTask, completed: !updatedTask.completed };

  fetch(`http://localhost:8080/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask),
  })
    .then(() => fetchTasks())
    .catch(error => console.error('Error:', error));
};