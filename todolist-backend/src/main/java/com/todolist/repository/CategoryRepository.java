package com.todolist.repository;

import com.todolist.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    Optional<Category> findByName(String name);
    
    boolean existsByName(String name);
    
    @Query("SELECT c FROM Category c ORDER BY c.auditDateCreated ASC")
    List<Category> findAllOrderByCreated();
}