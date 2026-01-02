package com.expense.tracker.service;



import com.expense.tracker.entity.User;
import com.expense.tracker.repo.UserRepository;
import com.expense.tracker.dto.AuthRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

 @Autowired
 private UserRepository userRepository;

 @Autowired
 private BCryptPasswordEncoder passwordEncoder;
 
 public String registerUser(AuthRequest request) {
     // Business Logic: Check if email is already taken
     if (userRepository.findByEmail(request.getEmail()) != null) {
         return "Email is already in use!";
     }

     // Create Entity from DTO
     User newUser = new User();
     newUser.setEmail(request.getEmail());
     String encodedPassword = passwordEncoder.encode(request.getPassword());
     newUser.setPassword(encodedPassword);
     
     userRepository.save(newUser);
     return "SUCCESS";
 }

 public boolean authenticateUser(AuthRequest request) {
     User user = userRepository.findByEmail(request.getEmail());
     if (user != null ) {
         return passwordEncoder.matches(request.getPassword(), user.getPassword());
     }
     return false;
 }
}