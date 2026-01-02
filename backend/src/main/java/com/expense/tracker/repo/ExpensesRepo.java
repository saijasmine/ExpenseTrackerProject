
package com.expense.tracker.repo;

import com.expense.tracker.entity.Expenses;
import com.expense.tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpensesRepo extends JpaRepository<Expenses, Long> {
    List<Expenses> findByUser(User user);
}