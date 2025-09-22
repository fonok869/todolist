package com.todolist.controller;

import com.todolist.dto.MessageResponse;
import com.todolist.entity.User;
import com.todolist.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/mail")
public class ValidationController {

    @Autowired
    UserRepository userRepository;

    @GetMapping("/validate-email")
    public ResponseEntity<?> validateEmail(@RequestParam("token") String token) {
        if (token == null || token.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Invalid validation token."));
        }

        User user = userRepository.findByEmailValidationToken(token)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Invalid validation token."));
        }

        if (user.getEmailValidationTokenExpiry().isBefore(LocalDateTime.now())) {
            userRepository.delete(user);
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Validation token has expired. User account has been removed. Please register again."));
        }

        if (user.isEmailValidated()) {
            return ResponseEntity.ok(new MessageResponse("Email is already validated."));
        }

        user.setEmailValidated(true);
        user.setEmailValidationToken(null);
        user.setEmailValidationTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Email validated successfully! You can now log in."));
    }
}
