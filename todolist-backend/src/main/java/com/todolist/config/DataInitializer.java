package com.todolist.config;

import com.todolist.entity.Category;
import com.todolist.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final CategoryRepository categoryRepository;
    
    @Override
    public void run(String... args) throws Exception {
        initializeDefaultCategories();
    }
    
    private void initializeDefaultCategories() {
        if (categoryRepository.count() == 0) {
            log.info("Initializing default categories...");
            
            Category personalGoals = new Category();
            personalGoals.setName("Personal Goals");
            categoryRepository.save(personalGoals);
            
            Category professionalGoals = new Category();
            professionalGoals.setName("Professional Goals");
            categoryRepository.save(professionalGoals);
            
            log.info("Default categories created successfully");
        } else {
            log.info("Categories already exist, skipping initialization");
        }
    }
}