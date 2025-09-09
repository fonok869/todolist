package com.todolist.repository;

import com.todolist.entity.Category;
import com.todolist.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    Optional<Category> findByUserAndName(User user, String name);
    
    boolean existsByUserAndName(User user, String name);
    
    @Query("SELECT c FROM Category c WHERE c.user = :user ORDER BY c.auditDateCreated ASC")
    List<Category> findByUserOrderByCreated(@Param("user") User user);
    
    Optional<Category> findByIdAndUser(Long id, User user);
}