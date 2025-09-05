package com.todolist.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name must not exceed 100 characters")
    @Column(nullable = false, unique = true)
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
}