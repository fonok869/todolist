package com.todolist.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;

@Entity
@Table(name = "todos")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}