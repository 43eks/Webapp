package com.example.taskmanager;  // パッケージ名はあなたのプロジェクトに合わせてください

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication  // これがSpring Bootアプリケーションの起点です
public class TaskManagerApplication {
    public static void main(String[] args) {
        SpringApplication.run(TaskManagerApplication.class, args);  // アプリケーションの起動
    }
}