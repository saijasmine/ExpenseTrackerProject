package com.expense.tracker.controller;

import java.util.List;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.expense.tracker.entity.Expenses;
import com.expense.tracker.entity.User;
import com.expense.tracker.repo.ExpensesRepo;
import com.expense.tracker.service.ExpenseService;
import com.expense.tracker.repo.UserRepository;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;
    
    @Autowired
    private ExpensesRepo repository;
    
    @Autowired
    private UserRepository repo;

//    @GetMapping
//    public List<Expenses> getAll(HttpSession session) {
//        // 1. Get the user from the session
//        User user = (User) session.getAttribute("user");
//        
//        // 2. If no user in session, they aren't logged in
//        if (user == null) {
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please login first");
//        }
//        
//        return expenseService.getAllExpensesByUser(user);
//    }

    @GetMapping
    public List<Expenses> getAll(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please login first");
        }
        User user = repo.findById(userId).get();
        return expenseService.getAllExpensesByUser(user);
    }

    @PostMapping
    public Expenses add(@Valid @RequestBody Expenses expense, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Session expired");
        }
        User user = repo.findById(userId).get();
        return expenseService.saveExpense(expense, user);
    }
    
//    @PostMapping
//    public Expenses add(@Valid @RequestBody Expenses expense, HttpSession session) {
//        User user = (User) session.getAttribute("user");
//        if (user == null) {
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Session expired");
//        }
//        return expenseService.saveExpense(expense, user);
//    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id, HttpSession session) {
        // 1. Get userId (as Long) from session
        Long userId = (Long) session.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session expired");
        }

        return repository.findById(id).map(expense -> {
            // 2. Check if the expense belongs to the logged-in user ID
            if (expense.getUser().getId().equals(userId)) {
                repository.deleteById(id);
                return ResponseEntity.ok("Deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not your expense!");
            }
        }).orElse(ResponseEntity.notFound().build());
    }
}