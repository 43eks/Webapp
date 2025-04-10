package taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "taskmanager.repository")  // Repository パッケージのスペル修正
@EntityScan(basePackages = "taskmanager.model")  // Entity パッケージをスキャン
public class TaskManagerApp {

    public static void main(String[] args) {
        SpringApplication.run(TaskManagerApp.class, args);
    }
}