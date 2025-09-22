package com.todolist.repository;

import com.todolist.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Optional<User> findByEmailValidationToken(String emailValidationToken);

    @Query("SELECT u FROM User u WHERE u.emailValidated = false AND u.emailValidationTokenExpiry < :expiry")
    List<User> findExpiredUnvalidatedUsers(LocalDateTime expiry);
}