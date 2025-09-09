package com.todolist.service;

import com.todolist.dto.CategoryDto;
import com.todolist.entity.Category;
import com.todolist.entity.User;
import com.todolist.repository.CategoryRepository;
import com.todolist.repository.TodoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final TodoRepository todoRepository;
    private final UserService userService;
    
    public CategoryService(CategoryRepository categoryRepository, TodoRepository todoRepository, UserService userService) {
        this.categoryRepository = categoryRepository;
        this.todoRepository = todoRepository;
        this.userService = userService;
    }
    
    public List<CategoryDto> getAllCategories() {
        User currentUser = userService.getCurrentUser();
        return categoryRepository.findByUserOrderByCreated(currentUser)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public CategoryDto getCategoryById(Long id) {
        User currentUser = userService.getCurrentUser();
        Category category = categoryRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return convertToDto(category);
    }
    
    public CategoryDto getCategoryByName(String name) {
        User currentUser = userService.getCurrentUser();
        Category category = categoryRepository.findByUserAndName(currentUser, name)
                .orElseThrow(() -> new RuntimeException("Category not found with name: " + name));
        return convertToDto(category);
    }
    
    public CategoryDto createCategory(CategoryDto categoryDto) {
        User currentUser = userService.getCurrentUser();
        if (categoryRepository.existsByUserAndName(currentUser, categoryDto.getName())) {
            throw new RuntimeException("Category with name '" + categoryDto.getName() + "' already exists");
        }
        
        Category category = new Category();
        category.setName(categoryDto.getName());
        category.setUser(currentUser);
        
        Category saved = categoryRepository.save(category);
        return convertToDto(saved);
    }
    
    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {
        User currentUser = userService.getCurrentUser();
        Category category = categoryRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        
        // Check if new name already exists for a different category
        if (!category.getName().equals(categoryDto.getName()) && 
            categoryRepository.existsByUserAndName(currentUser, categoryDto.getName())) {
            throw new RuntimeException("Category with name '" + categoryDto.getName() + "' already exists");
        }
        
        category.setName(categoryDto.getName());
        Category saved = categoryRepository.save(category);
        return convertToDto(saved);
    }
    
    public void deleteCategory(Long id) {
        User currentUser = userService.getCurrentUser();
        Category category = categoryRepository.findByIdAndUser(id, currentUser)
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
        dto.setTodoCount(todoRepository.countByUserAndCategory(category.getUser(), category));
        return dto;
    }
}