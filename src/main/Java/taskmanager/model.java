package main.Java.taskmanager;
//タスクエンティティ
public class model {
	@Entity
	@Table(name = "tasks")
	public class Task {
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int id;

	    @Column(name = "task_name")
	    private String taskName;

	    // getter / setter
	}
}
