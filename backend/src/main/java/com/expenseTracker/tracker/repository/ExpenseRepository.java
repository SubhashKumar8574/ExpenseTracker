package com.expenseTracker.tracker.repository;

import com.expenseTracker.tracker.model.Expense;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ExpenseRepository extends MongoRepository<Expense, ObjectId> {
    List<Expense> findByUserId(ObjectId userId);
}