package com.expense.tracker.controller;

import com.expense.tracker.dto.AuthRequest;
import com.expense.tracker.service.AuthService;
import com.expense.tracker.service.UserService;
// CHANGE: Import YOUR User entity, NOT Spring Security's User
import com.expense.tracker.entity.User;
import com.expense.tracker.repo.UserRepository;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
// IMPORTANT: Updated CrossOrigin for Session support
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {
	
    @Autowired
    private AuthService authService;
	
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository repo;
    
    @Autowired
    private BCryptPasswordEncoder encoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser, HttpSession session) {
        User user = repo.findByEmail(loginUser.getEmail());
        if (user != null && encoder.matches(loginUser.getPassword(), user.getPassword())) {
            session.setAttribute("userId", user.getId()); 
            return ResponseEntity.ok("Login Successful");
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (repo.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body("User already exists");
        }
        // Hash the password before saving
        user.setPassword(encoder.encode(user.getPassword()));
        repo.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate(); // Destroys the session on the server
        return ResponseEntity.ok("Logged out successfully");
    }
}