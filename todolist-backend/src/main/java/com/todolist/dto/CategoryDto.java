package com.todolist.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.Objects;

public class CategoryDto {
    
    private Long id;
    
    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name must not exceed 100 characters")
    private String name;
    
    private LocalDateTime dateCreated;
    private LocalDateTime auditDateCreated;
    private LocalDateTime auditDateModified;
    
    private Long todoCount;

    // Constructors
    public CategoryDto() {
    }

    public CategoryDto(Long id, String name, LocalDateTime dateCreated, 
                      LocalDateTime auditDateCreated, LocalDateTime auditDateModified, 
                      Long todoCount) {
        this.id = id;
        this.name = name;
        this.dateCreated = dateCreated;
        this.auditDateCreated = auditDateCreated;
        this.auditDateModified = auditDateModified;
        this.todoCount = todoCount;
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

    public Long getTodoCount() {
        return todoCount;
    }

    public void setTodoCount(Long todoCount) {
        this.todoCount = todoCount;
    }

    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CategoryDto that = (CategoryDto) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(name, that.name) &&
               Objects.equals(dateCreated, that.dateCreated) &&
               Objects.equals(auditDateCreated, that.auditDateCreated) &&
               Objects.equals(auditDateModified, that.auditDateModified) &&
               Objects.equals(todoCount, that.todoCount);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, dateCreated, auditDateCreated, auditDateModified, todoCount);
    }

    // toString
    @Override
    public String toString() {
        return "CategoryDto{" +
               "id=" + id +
               ", name='" + name + '\'' +
               ", dateCreated=" + dateCreated +
               ", auditDateCreated=" + auditDateCreated +
               ", auditDateModified=" + auditDateModified +
               ", todoCount=" + todoCount +
               '}';
    }
}