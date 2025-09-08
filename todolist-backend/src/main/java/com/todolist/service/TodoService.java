package com.todolist.service;

import com.todolist.dto.TodoDto;
import com.todolist.entity.Category;
import com.todolist.entity.Todo;
import com.todolist.repository.CategoryRepository;
import com.todolist.repository.TodoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class TodoService {
    
    private final TodoRepository todoRepository;
    private final CategoryRepository categoryRepository;
    
    public TodoService(TodoRepository todoRepository, CategoryRepository categoryRepository) {
        this.todoRepository = todoRepository;
        this.categoryRepository = categoryRepository;
    }
    
    public List<TodoDto> getAllTodos() {
        return todoRepository.findAllOrderedByCategoryAndCompletion()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<TodoDto> getTodosByCategory(String categoryName) {
        Category category = categoryRepository.findByName(categoryName)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryName));
        
        return todoRepository.findByCategoryOrderByRankingAsc(category)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public TodoDto getTodoById(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));
        return convertToDto(todo);
    }
    
    public TodoDto createTodo(TodoDto todoDto) {
        Category category = categoryRepository.findByName(todoDto.getCategoryName())
                .orElseThrow(() -> new RuntimeException("Category not found: " + todoDto.getCategoryName()));
        
        // Check for ranking conflicts
        Optional<Todo> conflictingTodo = todoRepository.findByCategoryAndRankingAndNotDone(category, todoDto.getRanking());
        if (conflictingTodo.isPresent()) {
            // Shift rankings if there's a conflict
            shiftRankingsDown(category, todoDto.getRanking());
        }
        
        Todo todo = new Todo();
        todo.setTitle(todoDto.getTitle());
        todo.setDescription(todoDto.getDescription());
        todo.setRanking(todoDto.getRanking());
        todo.setDone(todoDto.getDone() != null ? todoDto.getDone() : false);
        todo.setCategory(category);
        
        Todo saved = todoRepository.save(todo);
        return convertToDto(saved);
    }
    
    public TodoDto updateTodo(Long id, TodoDto todoDto) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));
        
        // Update category if changed
        if (todoDto.getCategoryName() != null && !todoDto.getCategoryName().equals(todo.getCategory().getName())) {
            Category newCategory = categoryRepository.findByName(todoDto.getCategoryName())
                    .orElseThrow(() -> new RuntimeException("Category not found: " + todoDto.getCategoryName()));
            todo.setCategory(newCategory);
        }
        
        // Check for ranking conflicts if ranking changed
        if (todoDto.getRanking() != null && !todoDto.getRanking().equals(todo.getRanking())) {
            Optional<Todo> conflictingTodo = todoRepository.findByCategoryAndRankingAndNotDone(todo.getCategory(), todoDto.getRanking());
            if (conflictingTodo.isPresent() && !conflictingTodo.get().getId().equals(todo.getId())) {
                shiftRankingsDown(todo.getCategory(), todoDto.getRanking());
            }
            todo.setRanking(todoDto.getRanking());
        }
        
        if (todoDto.getTitle() != null) {
            todo.setTitle(todoDto.getTitle());
        }
        if (todoDto.getDescription() != null) {
            todo.setDescription(todoDto.getDescription());
        }
        if (todoDto.getDone() != null) {
            todo.setDone(todoDto.getDone());
        }
        
        Todo saved = todoRepository.save(todo);
        return convertToDto(saved);
    }
    
    public void deleteTodo(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));
        todoRepository.delete(todo);
    }
    
    public TodoDto toggleTodo(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));
        
        todo.setDone(!todo.getDone());
        Todo saved = todoRepository.save(todo);
        return convertToDto(saved);
    }
    
    public List<TodoDto> reorderTodos(List<TodoDto> todoDtos) {
        for (TodoDto dto : todoDtos) {
            Todo todo = todoRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Todo not found with id: " + dto.getId()));
            todo.setRanking(dto.getRanking());
            todoRepository.save(todo);
        }
        
        return todoDtos.stream()
                .map(dto -> getTodoById(dto.getId()))
                .collect(Collectors.toList());
    }
    
    private void shiftRankingsDown(Category category, Integer fromRanking) {
        List<Todo> todosToShift = todoRepository.findByCategoryAndRankingGreaterThanEqualAndNotDoneOrderByRanking(category, fromRanking);
        
        for (Todo todo : todosToShift) {
            todo.setRanking(todo.getRanking() + 1);
            todoRepository.save(todo);
        }
    }
    
    private TodoDto convertToDto(Todo todo) {
        TodoDto dto = new TodoDto();
        dto.setId(todo.getId());
        dto.setTitle(todo.getTitle());
        dto.setDescription(todo.getDescription());
        dto.setRanking(todo.getRanking());
        dto.setDone(todo.getDone());
        dto.setDateCreated(todo.getDateCreated());
        dto.setAuditDateCreated(todo.getAuditDateCreated());
        dto.setAuditDateModified(todo.getAuditDateModified());
        dto.setCategoryName(todo.getCategory().getName());
        dto.setCategoryId(todo.getCategory().getId());
        return dto;
    }
}