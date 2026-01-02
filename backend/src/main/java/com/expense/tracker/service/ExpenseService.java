package com.expense.tracker.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.expense.tracker.entity.Expenses;
import com.expense.tracker.entity.User;
import com.expense.tracker.repo.ExpensesRepo;

@Service
public class ExpenseService {

    @Autowired
    private ExpensesRepo repository;

    public List<Expenses> getAllExpensesByUser(User user) {
        return repository.findByUser(user);
    }

    public Expenses saveExpense(Expenses expense, User user) {
        expense.setUser(user);
        
        // Calculate spends only for the current month/year of the new expense
        List<Expenses> userHistory = repository.findByUser(user);
        
        double totalSpends = userHistory.stream()
                .filter(e -> "EXPENSE".equalsIgnoreCase(e.getType()))
                .mapToDouble(Expenses::getAmount)
                .sum();

        if ("EXPENSE".equalsIgnoreCase(expense.getType())) {
            totalSpends += expense.getAmount();
        }

        expense.setCurrentTotalSpends(totalSpends);
        expense.setRemainingBalance(expense.getCurrentTotalIncome() - totalSpends);

        return repository.save(expense);
    }
}