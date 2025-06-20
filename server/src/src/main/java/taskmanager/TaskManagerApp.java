package taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {
    "taskmanager",                      // 既存のコード（モデルやサービス用）
    "com.example.webapp.controller"     // ✅ これを追加：Webコントローラ用
})
@EnableJpaRepositories(basePackages = "taskmanager.repository")
@EntityScan(basePackages = "taskmanager.model")
public class TaskManagerApp {

    public static void main(String[] args) {
        SpringApplication.run(TaskManagerApp.class, args);
    }
}