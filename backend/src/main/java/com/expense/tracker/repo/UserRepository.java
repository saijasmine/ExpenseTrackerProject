package com.expense.tracker.repo;


import org.springframework.data.jpa.repository.JpaRepository;

import com.expense.tracker.entity.User;

public interface UserRepository extends JpaRepository<User, Long>{
	User findByEmail(String email);
}
