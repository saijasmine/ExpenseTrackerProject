package com.expense.tracker.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
public class Expenses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull(message = "Amount cannot be null")
    @PositiveOrZero(message = "Amount must be zero or positive")
    private Double amount;
    private String description; 
    @NotNull(message = "Type is required")
    private String type; // EXPENSE, SETTING
    
    private Double currentTotalIncome;
    private Double currentTotalSpends;
    private Double remainingBalance;

    private LocalDateTime createdAt; // New Field

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Double getCurrentTotalIncome() { return currentTotalIncome; }
    public void setCurrentTotalIncome(Double currentTotalIncome) { this.currentTotalIncome = currentTotalIncome; }
    public Double getCurrentTotalSpends() { return currentTotalSpends; }
    public void setCurrentTotalSpends(Double currentTotalSpends) { this.currentTotalSpends = currentTotalSpends; }
    public Double getRemainingBalance() { return remainingBalance; }
    public void setRemainingBalance(Double remainingBalance) { this.remainingBalance = remainingBalance; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}