package com.todolist.controller;

import com.todolist.dto.*;
import com.todolist.entity.User;
import com.todolist.repository.UserRepository;
import com.todolist.security.JwtTokenUtil;
import com.todolist.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtTokenUtil jwtTokenUtil;

    @Autowired
    EmailService emailService;

    @PostMapping("/auth/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                                                      loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEmailValidated()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Email not validated. Please check your email and click the validation link."));
        }

        String jwt = jwtTokenUtil.generateToken(userDetails);

        return ResponseEntity.ok(new JwtResponse(jwt,
                                               user.getId(),
                                               user.getUsername(),
                                               user.getEmail()));
    }

    @PostMapping("/auth/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(signUpRequest.getUsername(),
                           signUpRequest.getEmail(),
                           encoder.encode(signUpRequest.getPassword()));

        String validationToken = UUID.randomUUID().toString();
        user.setEmailValidationToken(validationToken);
        user.setEmailValidationTokenExpiry(LocalDateTime.now().plusHours(24));
        user.setEmailValidated(false);

        userRepository.save(user);

        boolean emailSent = emailService.sendEmailValidation(user.getEmail(), validationToken);
        if (!emailSent) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("User registered but failed to send validation email. Please contact support."));
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully! Please check your email to validate your account."));
    }

    @GetMapping("/mail/validate-email")
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