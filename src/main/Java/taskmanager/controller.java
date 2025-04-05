package main.Java.taskmanager;
//APIのエンドポイント
public class controller {
	@RestController
	@RequestMapping("/api/tasks")
	public class TaskController {
	    @Autowired
	    private TaskService service;

	    @GetMapping
	    public List<Task> getAll() {
	        return service.findAll();
	    }

	    @PostMapping
	    public Task create(@RequestBody Task task) {
	        return service.addTask(task);
	    }

	    @DeleteMapping("/{id}")
	    public void delete(@PathVariable int id) {
	        service.deleteTask(id);
	    }

	    @PutMapping("/{id}")
	    public Task update(@PathVariable int id, @RequestBody Task updatedTask) {
	        return service.updateTask(id, updatedTask.getTaskName());
	    }
	}
}
