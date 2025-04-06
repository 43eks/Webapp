package taskmanager.respository;

import org.springframework.data.jpa.repository.JpaRepository;

import taskmanager.model.Task;

public interface TaskPepository extends JpaRepository<Task, Long> {
    // 必要に応じてカスタムクエリを追加できます
}