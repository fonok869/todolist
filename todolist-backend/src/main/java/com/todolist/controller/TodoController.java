package com.todolist.controller;

import com.todolist.dto.TodoDto;
import com.todolist.service.TodoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/todos")
public class TodoController {
    
    private final TodoService todoService;
    
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }
    
    @GetMapping
    public ResponseEntity<List<TodoDto>> getAllTodos() {
        List<TodoDto> todos = todoService.getAllTodos();
        return ResponseEntity.ok(todos);
    }
    
    @GetMapping("/category/{categoryName}")
    public ResponseEntity<List<TodoDto>> getTodosByCategory(@PathVariable String categoryName) {
        List<TodoDto> todos = todoService.getTodosByCategory(categoryName);
        return ResponseEntity.ok(todos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TodoDto> getTodoById(@PathVariable Long id) {
        TodoDto todo = todoService.getTodoById(id);
        return ResponseEntity.ok(todo);
    }
    
    @PostMapping
    public ResponseEntity<TodoDto> createTodo(@Valid @RequestBody TodoDto todoDto) {
        TodoDto created = todoService.createTodo(todoDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TodoDto> updateTodo(@PathVariable Long id, @Valid @RequestBody TodoDto todoDto) {
        TodoDto updated = todoService.updateTodo(id, todoDto);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TodoDto> toggleTodo(@PathVariable Long id) {
        TodoDto toggled = todoService.toggleTodo(id);
        return ResponseEntity.ok(toggled);
    }
    
    @PutMapping("/reorder")
    public ResponseEntity<List<TodoDto>> reorderTodos(@RequestBody List<TodoDto> todos) {
        List<TodoDto> reordered = todoService.reorderTodos(todos);
        return ResponseEntity.ok(reordered);
    }
}