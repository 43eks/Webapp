package taskmanager.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import taskmanager.model.Task;
import taskmanager.repository.TaskRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // タスクの取得
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // タスクの作成（作成したTaskを返す）
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    // タスクの更新
    public Task updateTask(Long id, Task taskDetails) {
        Optional<Task> task = taskRepository.findById(id);
        if (task.isPresent()) {
            Task existingTask = task.get();
            existingTask.setTaskName(taskDetails.getTaskName());
            existingTask.setCompleted(taskDetails.isCompleted());
            return taskRepository.save(existingTask);
        }
        return null;
    }

    // タスクの削除
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}