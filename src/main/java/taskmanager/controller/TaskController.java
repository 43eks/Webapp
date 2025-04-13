package taskmanager.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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

@CrossOrigin(origins = "http://localhost:3000") // ← Reactからの通信を許可！
@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // タスクの取得
    @GetMapping
    public List<Task> getTasks() {
        return taskService.getAllTasks();
    }

    // タスクの作成
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        try {
            Task createdTask = taskService.createTask(task);
            return ResponseEntity.ok(createdTask); // 作成したタスクを返す
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // タスクの更新
    @PutMapping("/{id}")
    public ResponseEntity<String> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        try {
            Task updatedTask = taskService.updateTask(id, taskDetails);
            if (updatedTask != null) {
                return ResponseEntity.ok("タスクが正常に更新されました");
            } else {
                return ResponseEntity.status(404).body("指定されたタスクが見つかりませんでした");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("タスクの更新中にエラーが発生しました");
        }
    }

    // タスクの削除
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok("タスクが正常に削除されました");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("タスクの削除中にエラーが発生しました");
        }
    }
}