package com.todolist.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.Objects;

public class TodoDto {
    
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    @Min(value = 1, message = "Ranking must be at least 1")
    @Max(value = 100, message = "Ranking must not exceed 100")
    @NotNull(message = "Ranking is required")
    private Integer ranking;
    
    private Boolean done = false;
    
    private LocalDateTime dateCreated;
    private LocalDateTime auditDateCreated;
    private LocalDateTime auditDateModified;
    
    @NotNull(message = "Category is required")
    private String categoryName;
    
    private Long categoryId;

    // Constructors
    public TodoDto() {
    }

    public TodoDto(Long id, String title, String description, Integer ranking, Boolean done,
                   LocalDateTime dateCreated, LocalDateTime auditDateCreated, 
                   LocalDateTime auditDateModified, String categoryName, Long categoryId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.ranking = ranking;
        this.done = done;
        this.dateCreated = dateCreated;
        this.auditDateCreated = auditDateCreated;
        this.auditDateModified = auditDateModified;
        this.categoryName = categoryName;
        this.categoryId = categoryId;
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

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TodoDto todoDto = (TodoDto) o;
        return Objects.equals(id, todoDto.id) &&
               Objects.equals(title, todoDto.title) &&
               Objects.equals(description, todoDto.description) &&
               Objects.equals(ranking, todoDto.ranking) &&
               Objects.equals(done, todoDto.done) &&
               Objects.equals(dateCreated, todoDto.dateCreated) &&
               Objects.equals(auditDateCreated, todoDto.auditDateCreated) &&
               Objects.equals(auditDateModified, todoDto.auditDateModified) &&
               Objects.equals(categoryName, todoDto.categoryName) &&
               Objects.equals(categoryId, todoDto.categoryId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, description, ranking, done, dateCreated, 
                           auditDateCreated, auditDateModified, categoryName, categoryId);
    }

    // toString
    @Override
    public String toString() {
        return "TodoDto{" +
               "id=" + id +
               ", title='" + title + '\'' +
               ", description='" + description + '\'' +
               ", ranking=" + ranking +
               ", done=" + done +
               ", dateCreated=" + dateCreated +
               ", auditDateCreated=" + auditDateCreated +
               ", auditDateModified=" + auditDateModified +
               ", categoryName='" + categoryName + '\'' +
               ", categoryId=" + categoryId +
               '}';
    }
}