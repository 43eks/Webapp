package taskmanager.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import taskmanager.model.Knowledge;
import taskmanager.repository.KnowledgeRepository;

@Service
public class KnowledgeService {

    @Autowired
    private KnowledgeRepository knowledgeRepository;

    // すべてのナレッジを取得
    public List<Knowledge> getAllKnowledge() {
        return knowledgeRepository.findAll();
    }

    // IDでナレッジを取得
    public Knowledge getKnowledgeById(Long id) {
        Optional<Knowledge> knowledge = knowledgeRepository.findById(id);
        return knowledge.orElse(null); // 存在しなければ null を返す
    }

    // ナレッジを作成
    public Knowledge createKnowledge(Knowledge knowledge) {
        return knowledgeRepository.save(knowledge);
    }

    // ナレッジを更新
    public Knowledge updateKnowledge(Long id, Knowledge knowledgeDetails) {
        Optional<Knowledge> existingKnowledge = knowledgeRepository.findById(id);

        if (existingKnowledge.isPresent()) {
            Knowledge updatedKnowledge = existingKnowledge.get();
            updatedKnowledge.setTitle(knowledgeDetails.getTitle());
            updatedKnowledge.setContent(knowledgeDetails.getContent());
            updatedKnowledge.setCategory(knowledgeDetails.getCategory());
            return knowledgeRepository.save(updatedKnowledge);
        } else {
            return null; // ナレッジが存在しない場合は null を返す
        }
    }

    // ナレッジを削除
    public boolean deleteKnowledge(Long id) {
        Optional<Knowledge> knowledge = knowledgeRepository.findById(id);
        if (knowledge.isPresent()) {
            knowledgeRepository.delete(knowledge.get());
            return true;
        } else {
            return false;
        }
    }
}