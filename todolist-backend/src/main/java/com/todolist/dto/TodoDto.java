package com.todolist.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
}