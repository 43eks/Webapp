package taskmanager.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import taskmanager.model.Knowledge;
import taskmanager.service.KnowledgeService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/knowledge")
public class KnowledgeController {

    @Autowired
    private KnowledgeService knowledgeService;

    // ナレッジ一覧を取得
    @GetMapping
    public List<Knowledge> getAllKnowledge() {
        return knowledgeService.getAllKnowledge();
    }

    // IDで単一のナレッジを取得
    @GetMapping("/{id}")
    public ResponseEntity<Knowledge> getKnowledgeById(@PathVariable Long id) {
        Knowledge knowledge = knowledgeService.getKnowledgeById(id);
        if (knowledge != null) {
            return ResponseEntity.ok(knowledge);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ナレッジを新規作成
    @PostMapping
    public ResponseEntity<Knowledge> createKnowledge(@Valid @RequestBody Knowledge knowledge) {
        Knowledge createdKnowledge = knowledgeService.createKnowledge(knowledge);
        return ResponseEntity.ok(createdKnowledge);
    }

    // ナレッジを更新
    @PutMapping("/{id}")
    public ResponseEntity<String> updateKnowledge(@PathVariable Long id, @Valid @RequestBody Knowledge knowledgeDetails) {
        Knowledge updatedKnowledge = knowledgeService.updateKnowledge(id, knowledgeDetails);
        if (updatedKnowledge != null) {
            return ResponseEntity.ok("ナレッジが正常に更新されました");
        } else {
            return ResponseEntity.status(404).body("指定されたナレッジが見つかりませんでした");
        }
    }

    // ナレッジを削除
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteKnowledge(@PathVariable Long id) {
        boolean deleted = knowledgeService.deleteKnowledge(id);
        if (deleted) {
            return ResponseEntity.ok("ナレッジが正常に削除されました");
        } else {
            return ResponseEntity.status(404).body("指定されたナレッジが見つかりませんでした");
        }
    }
}