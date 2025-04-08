package taskmanager.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;  // 追加
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import taskmanager.model.Task;
import taskmanager.service.TaskService;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:3000")  // 追加: Reactアプリケーションがアクセスできるように設定
public class TaskController {

    @Autowired
    private TaskService taskService;

    // タスクの一覧取得
    @GetMapping
    public List<Task> getTasks() {
        return taskService.getAllTasks();
    }

    // タスクの作成
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }

    // タスクの更新
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        return taskService.updateTask(id, task);
    }

    // タスクの削除
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}