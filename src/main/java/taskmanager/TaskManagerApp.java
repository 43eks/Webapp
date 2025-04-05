package taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TaskManagerApp {
    public static void main(String[] args) {
        SpringApplication.run(TaskManagerApp.class, args);
        System.out.println("🌟 タスクマネージャーアプリ起動完了！");
    }
}