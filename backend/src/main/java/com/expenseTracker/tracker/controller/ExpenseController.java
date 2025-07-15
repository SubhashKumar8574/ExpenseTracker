package com.expenseTracker.tracker.controller;

import com.expenseTracker.tracker.model.Expense;
import com.expenseTracker.tracker.model.User;
import com.expenseTracker.tracker.repository.UserRepository;
import com.expenseTracker.tracker.service.ExpenseService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Expense> getExpenses(Principal principal) {
        User user = userRepository.findByUsername(principal.getName());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
        }
        return expenseService.getExpensesByUser(user.getId());
    }


    @PostMapping
    public Expense addExpense(@RequestBody Expense expense, Principal principal) {
        User user = userRepository.findByUsername(principal.getName());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
        }
        expense.setUserId(user.getId());
        return expenseService.addExpense(expense);
    }

    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable String id, @RequestBody Expense expense, Principal principal) {
        ObjectId objectId;
        try {
            objectId = new ObjectId(id);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid expense ID format");
        }

        Expense existing = expenseService.getExpenseById(objectId);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found");
        }

        User user = userRepository.findByUsername(principal.getName());
        if (user == null || !existing.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to update this expense");
        }

        existing.setTitle(expense.getTitle());
        existing.setAmount(expense.getAmount());
        existing.setCategory(expense.getCategory());
        existing.setDate(expense.getDate());

        return expenseService.updateExpense(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable String id, Principal principal) {
        ObjectId objectId;
        try {
            objectId = new ObjectId(id);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid expense ID format");
        }

        Expense existing = expenseService.getExpenseById(objectId);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found");
        }

        User user = userRepository.findByUsername(principal.getName());
        if (user == null || !existing.getUserId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to delete this expense");
        }

        expenseService.deleteExpense(objectId);
    }
}
