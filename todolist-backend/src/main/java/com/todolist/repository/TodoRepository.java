package com.todolist.repository;

import com.todolist.entity.Todo;
import com.todolist.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    
    List<Todo> findByCategoryOrderByRankingAsc(Category category);
    
    List<Todo> findByCategoryAndDoneOrderByRankingAsc(Category category, Boolean done);
    
    @Query("SELECT t FROM Todo t WHERE t.category = :category AND t.ranking = :ranking AND t.done = false")
    Optional<Todo> findByCategoryAndRankingAndNotDone(@Param("category") Category category, @Param("ranking") Integer ranking);
    
    @Query("SELECT t FROM Todo t WHERE t.category = :category AND t.ranking >= :ranking AND t.done = false ORDER BY t.ranking ASC")
    List<Todo> findByCategoryAndRankingGreaterThanEqualAndNotDoneOrderByRanking(@Param("category") Category category, @Param("ranking") Integer ranking);
    
    @Query("SELECT COUNT(t) FROM Todo t WHERE t.category = :category")
    Long countByCategory(@Param("category") Category category);
    
    @Query("SELECT t FROM Todo t ORDER BY t.category.name ASC, t.done ASC, t.ranking ASC")
    List<Todo> findAllOrderedByCategoryAndCompletion();
}