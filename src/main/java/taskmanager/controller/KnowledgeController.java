package taskmanager.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import taskmanager.model.Knowledge;
import taskmanager.service.KnowledgeService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/knowledges")
public class KnowledgeController {

    @Autowired
    private KnowledgeService knowledgeService;

    @GetMapping
    public List<Knowledge> getKnowledges() {
        return knowledgeService.getAllKnowledges();
    }

    // 追加・更新・削除なども同様に書けます
}