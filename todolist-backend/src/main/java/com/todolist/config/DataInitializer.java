package com.todolist.config;

import com.todolist.entity.Category;
import com.todolist.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// @Component  // Disabled - categories are now user-specific
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final CategoryRepository categoryRepository;
    
    public DataInitializer(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    
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