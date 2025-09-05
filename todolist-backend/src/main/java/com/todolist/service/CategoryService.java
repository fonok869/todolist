package com.todolist.service;

import com.todolist.dto.CategoryDto;
import com.todolist.entity.Category;
import com.todolist.repository.CategoryRepository;
import com.todolist.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final TodoRepository todoRepository;
    
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAllOrderByCreated()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return convertToDto(category);
    }
    
    public CategoryDto getCategoryByName(String name) {
        Category category = categoryRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Category not found with name: " + name));
        return convertToDto(category);
    }
    
    public CategoryDto createCategory(CategoryDto categoryDto) {
        if (categoryRepository.existsByName(categoryDto.getName())) {
            throw new RuntimeException("Category with name '" + categoryDto.getName() + "' already exists");
        }
        
        Category category = new Category();
        category.setName(categoryDto.getName());
        
        Category saved = categoryRepository.save(category);
        return convertToDto(saved);
    }
    
    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        
        // Check if new name already exists for a different category
        if (!category.getName().equals(categoryDto.getName()) && 
            categoryRepository.existsByName(categoryDto.getName())) {
            throw new RuntimeException("Category with name '" + categoryDto.getName() + "' already exists");
        }
        
        category.setName(categoryDto.getName());
        Category saved = categoryRepository.save(category);
        return convertToDto(saved);
    }
    
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        
        // This will cascade delete all todos in this category
        categoryRepository.delete(category);
    }
    
    private CategoryDto convertToDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDateCreated(category.getDateCreated());
        dto.setAuditDateCreated(category.getAuditDateCreated());
        dto.setAuditDateModified(category.getAuditDateModified());
        dto.setTodoCount(todoRepository.countByCategory(category));
        return dto;
    }
}