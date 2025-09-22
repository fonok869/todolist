package com.todolist.config;

import com.todolist.entity.Category;
import com.todolist.entity.User;
import com.todolist.repository.CategoryRepository;
import com.todolist.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(CategoryRepository categoryRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public void run(String... args) throws Exception {
        initializeDefaultUser();
        initializeDefaultCategories();
    }

    private void initializeDefaultUser() {
        String defaultEmail = "test@test.hu";

        if (!userRepository.existsByEmail(defaultEmail)) {
            log.info("Initializing default user...");

            User defaultUser = new User();
            defaultUser.setUsername("testuser");
            defaultUser.setEmail(defaultEmail);
            defaultUser.setPassword(passwordEncoder.encode("HalekTamasAKiraly"));
            defaultUser.setEmailValidated(true);
            userRepository.save(defaultUser);

            log.info("Default user created successfully with email: {}", defaultEmail);
        } else {
            log.info("Default user already exists, skipping initialization");
        }
    }

    private void initializeDefaultCategories() {
        if (categoryRepository.count() == 0) {
            log.info("Initializing default categories...");

            User defaultUser = userRepository.findByEmail("test@test.hu")
                .orElseThrow(() -> new RuntimeException("Default user not found"));

            Category personalGoals = new Category();
            personalGoals.setName("Personal Goals");
            personalGoals.setUser(defaultUser);
            categoryRepository.save(personalGoals);

            Category professionalGoals = new Category();
            professionalGoals.setName("Professional Goals");
            professionalGoals.setUser(defaultUser);
            categoryRepository.save(professionalGoals);

            log.info("Default categories created successfully");
        } else {
            log.info("Categories already exist, skipping initialization");
        }
    }
}