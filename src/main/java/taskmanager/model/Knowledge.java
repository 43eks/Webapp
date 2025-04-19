package taskmanager.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
public class Knowledge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "タイトルは必須です")
    @Size(max = 100, message = "タイトルは最大100文字までです")
    private String title;

    @NotBlank(message = "内容は必須です")
    @Size(max = 1000, message = "内容は最大1000文字までです")
    private String content;

    private String category;  // 例えば「プログラミング」「ビジネス」などのカテゴリー

    // デフォルトコンストラクタ
    public Knowledge() {}

    public Knowledge(Long id, String title, String content, String category) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.category = category;
    }

    // Getter & Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "Knowledge{" +
               "id=" + id +
               ", title='" + title + '\'' +
               ", content='" + content + '\'' +
               ", category='" + category + '\'' +
               '}';
    }
}