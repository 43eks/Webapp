package taskmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import taskmanager.model.Knowledge;

@Repository
public interface KnowledgeRepository extends JpaRepository<Knowledge, Long> {
    // 必要であればカスタムクエリをここに追加できます
}
