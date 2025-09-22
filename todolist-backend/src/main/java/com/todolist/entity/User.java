package com.todolist.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Column(unique = true, nullable = false)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Column(nullable = false)
    private String password;

    @Column(name = "date_created")
    private LocalDateTime dateCreated;

    @Column(name = "audit_date_created")
    private LocalDateTime auditDateCreated;

    @Column(name = "audit_date_modified")
    private LocalDateTime auditDateModified;

    @Column(name = "email_validated", nullable = false)
    private boolean emailValidated = false;

    @Column(name = "email_validation_token")
    private String emailValidationToken;

    @Column(name = "email_validation_token_expiry")
    private LocalDateTime emailValidationTokenExpiry;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Todo> todos = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Category> categories = new ArrayList<>();

    public User() {}

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.dateCreated = LocalDateTime.now();
        this.auditDateCreated = LocalDateTime.now();
        this.auditDateModified = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        this.dateCreated = LocalDateTime.now();
        this.auditDateCreated = LocalDateTime.now();
        this.auditDateModified = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.auditDateModified = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public boolean isEmailValidated() {
        return emailValidated;
    }

    public void setEmailValidated(boolean emailValidated) {
        this.emailValidated = emailValidated;
    }

    public String getEmailValidationToken() {
        return emailValidationToken;
    }

    public void setEmailValidationToken(String emailValidationToken) {
        this.emailValidationToken = emailValidationToken;
    }

    public LocalDateTime getEmailValidationTokenExpiry() {
        return emailValidationTokenExpiry;
    }

    public void setEmailValidationTokenExpiry(LocalDateTime emailValidationTokenExpiry) {
        this.emailValidationTokenExpiry = emailValidationTokenExpiry;
    }
}