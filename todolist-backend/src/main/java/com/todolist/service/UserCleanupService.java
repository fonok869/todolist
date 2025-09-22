package com.todolist.service;

import com.todolist.entity.User;
import com.todolist.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserCleanupService {

    private static final Logger logger = LoggerFactory.getLogger(UserCleanupService.class);

    @Autowired
    private UserRepository userRepository;

    @Scheduled(fixedRate = 86400000)
    public void cleanupExpiredUnvalidatedUsers() {
        try {
            LocalDateTime now = LocalDateTime.now();
            List<User> expiredUsers = userRepository.findExpiredUnvalidatedUsers(now);

            if (!expiredUsers.isEmpty()) {
                logger.info("Found {} expired unvalidated users to delete", expiredUsers.size());

                for (User user : expiredUsers) {
                    logger.info("Deleting expired unvalidated user: {} ({})", user.getUsername(), user.getEmail());
                }

                userRepository.deleteAll(expiredUsers);
                logger.info("Successfully deleted {} expired unvalidated users", expiredUsers.size());
            } else {
                logger.debug("No expired unvalidated users found for cleanup");
            }
        } catch (Exception e) {
            logger.error("Error during user cleanup: {}", e.getMessage(), e);
        }
    }
}