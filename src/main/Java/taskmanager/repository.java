package main.Java.taskmanager;

import main.Java.taskmanager.model.Task;

//DBアクセス
public class repository {
	@Repository
	public interface TaskRepository extends JpaRepository<Task, Integer> {
	    // JPAがSQLを自動生成してくれる！
	}
}
