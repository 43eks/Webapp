package main.Java.taskmanager;

import java.util.List;

import main.Java.taskmanager.model.Task;
import main.Java.taskmanager.repository.TaskRepository;

//ビジネスロジック
public class service {
	@Service
	public class TaskService {
	    @Autowired
	    private TaskRepository repository;

	    public List<Task> findAll() {
	        return repository.findAll();
	    }

	    public Task addTask(Task task) {
	        return repository.save(task);
	    }

	    public void deleteTask(int id) {
	        repository.deleteById(id);
	    }

	    public Task updateTask(int id, String newName) {
	        Task task = repository.findById(id).orElseThrow();
	        task.setTaskName(newName);
	        return repository.save(task);
	    }
	}
}
