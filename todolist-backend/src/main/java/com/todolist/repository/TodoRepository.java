package com.todolist.repository;

import com.todolist.entity.Todo;
import com.todolist.entity.Category;
import com.todolist.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    
    List<Todo> findByUserAndCategoryOrderByRankingAsc(User user, Category category);
    
    List<Todo> findByUserAndCategoryAndDoneOrderByRankingAsc(User user, Category category, Boolean done);
    
    @Query("SELECT t FROM Todo t WHERE t.user = :user AND t.category = :category AND t.ranking = :ranking AND t.done = false")
    Optional<Todo> findByUserAndCategoryAndRankingAndNotDone(@Param("user") User user, @Param("category") Category category, @Param("ranking") Integer ranking);
    
    @Query("SELECT t FROM Todo t WHERE t.user = :user AND t.category = :category AND t.ranking >= :ranking AND t.done = false ORDER BY t.ranking ASC")
    List<Todo> findByUserAndCategoryAndRankingGreaterThanEqualAndNotDoneOrderByRanking(@Param("user") User user, @Param("category") Category category, @Param("ranking") Integer ranking);
    
    @Query("SELECT COUNT(t) FROM Todo t WHERE t.user = :user AND t.category = :category")
    Long countByUserAndCategory(@Param("user") User user, @Param("category") Category category);
    
    @Query("SELECT t FROM Todo t WHERE t.user = :user ORDER BY t.category.name ASC, t.done ASC, t.ranking ASC")
    List<Todo> findByUserOrderedByCategoryAndCompletion(@Param("user") User user);
    
    Optional<Todo> findByIdAndUser(Long id, User user);
}