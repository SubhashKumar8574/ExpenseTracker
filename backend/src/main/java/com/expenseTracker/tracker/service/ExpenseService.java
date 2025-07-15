package com.expenseTracker.tracker.service;

import com.expenseTracker.tracker.model.Expense;
import com.expenseTracker.tracker.repository.ExpenseRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {
    @Autowired
    private ExpenseRepository expenseRepository;

    public List<Expense> getExpensesByUser(ObjectId userId) {
        return expenseRepository.findByUserId(userId);
    }

    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Expense updateExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public void deleteExpense(ObjectId id) {
        expenseRepository.deleteById(id);
    }

    public Expense getExpenseById(ObjectId id) {
        return expenseRepository.findById(id).orElse(null);
    }
}