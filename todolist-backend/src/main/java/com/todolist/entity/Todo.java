package com.todolist.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "todos")
public class Todo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must not exceed 100 characters")
    @Column(nullable = false)
    private String title;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    @Min(value = 1, message = "Ranking must be at least 1")
    @Max(value = 100, message = "Ranking must not exceed 100")
    @Column(nullable = false)
    private Integer ranking;
    
    @Column(nullable = false)
    private Boolean done = false;
    
    @Column(name = "date_created")
    private LocalDateTime dateCreated;
    
    @Column(name = "audit_date_created")
    private LocalDateTime auditDateCreated;
    
    @Column(name = "audit_date_modified")
    private LocalDateTime auditDateModified;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonBackReference
    private Category category;
    
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        dateCreated = now;
        auditDateCreated = now;
        auditDateModified = now;
        if (done == null) {
            done = false;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        auditDateModified = LocalDateTime.now();
    }

    // Constructors
    public Todo() {
    }

    public Todo(Long id, String title, String description, Integer ranking, Boolean done, 
                LocalDateTime dateCreated, LocalDateTime auditDateCreated, 
                LocalDateTime auditDateModified, Category category) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.ranking = ranking;
        this.done = done;
        this.dateCreated = dateCreated;
        this.auditDateCreated = auditDateCreated;
        this.auditDateModified = auditDateModified;
        this.category = category;
    }

    // Getters and Setters
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getRanking() {
        return ranking;
    }

    public void setRanking(Integer ranking) {
        this.ranking = ranking;
    }

    public Boolean getDone() {
        return done;
    }

    public void setDone(Boolean done) {
        this.done = done;
    }

    public LocalDateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

    public LocalDateTime getAuditDateCreated() {
        return auditDateCreated;
    }

    public void setAuditDateCreated(LocalDateTime auditDateCreated) {
        this.auditDateCreated = auditDateCreated;
    }

    public LocalDateTime getAuditDateModified() {
        return auditDateModified;
    }

    public void setAuditDateModified(LocalDateTime auditDateModified) {
        this.auditDateModified = auditDateModified;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Todo todo = (Todo) o;
        return Objects.equals(id, todo.id) &&
               Objects.equals(title, todo.title) &&
               Objects.equals(description, todo.description) &&
               Objects.equals(ranking, todo.ranking) &&
               Objects.equals(done, todo.done) &&
               Objects.equals(dateCreated, todo.dateCreated) &&
               Objects.equals(auditDateCreated, todo.auditDateCreated) &&
               Objects.equals(auditDateModified, todo.auditDateModified);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, description, ranking, done, dateCreated, 
                           auditDateCreated, auditDateModified);
    }

    // toString
    @Override
    public String toString() {
        return "Todo{" +
               "id=" + id +
               ", title='" + title + '\'' +
               ", description='" + description + '\'' +
               ", ranking=" + ranking +
               ", done=" + done +
               ", dateCreated=" + dateCreated +
               ", auditDateCreated=" + auditDateCreated +
               ", auditDateModified=" + auditDateModified +
               '}';
    }
}