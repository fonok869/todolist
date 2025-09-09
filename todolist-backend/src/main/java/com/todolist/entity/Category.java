package com.todolist.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "categories")
public class Category {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name must not exceed 100 characters")
    @Column(nullable = false)
    private String name;
    
    @Column(name = "date_created")
    private LocalDateTime dateCreated;
    
    @Column(name = "audit_date_created")
    private LocalDateTime auditDateCreated;
    
    @Column(name = "audit_date_modified")
    private LocalDateTime auditDateModified;
    
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Todo> todos;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;
    
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        dateCreated = now;
        auditDateCreated = now;
        auditDateModified = now;
    }
    
    @PreUpdate
    protected void onUpdate() {
        auditDateModified = LocalDateTime.now();
    }

    // Constructors
    public Category() {
    }

    public Category(Long id, String name, LocalDateTime dateCreated, 
                   LocalDateTime auditDateCreated, LocalDateTime auditDateModified, 
                   List<Todo> todos) {
        this.id = id;
        this.name = name;
        this.dateCreated = dateCreated;
        this.auditDateCreated = auditDateCreated;
        this.auditDateModified = auditDateModified;
        this.todos = todos;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public List<Todo> getTodos() {
        return todos;
    }

    public void setTodos(List<Todo> todos) {
        this.todos = todos;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Category category = (Category) o;
        return Objects.equals(id, category.id) &&
               Objects.equals(name, category.name) &&
               Objects.equals(dateCreated, category.dateCreated) &&
               Objects.equals(auditDateCreated, category.auditDateCreated) &&
               Objects.equals(auditDateModified, category.auditDateModified);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, dateCreated, auditDateCreated, auditDateModified);
    }

    // toString
    @Override
    public String toString() {
        return "Category{" +
               "id=" + id +
               ", name='" + name + '\'' +
               ", dateCreated=" + dateCreated +
               ", auditDateCreated=" + auditDateCreated +
               ", auditDateModified=" + auditDateModified +
               '}';
    }
}