package com.expenseTracker.tracker.repository;

import com.expenseTracker.tracker.model.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, ObjectId> {
    User findByUsername(String username);
    User findByEmail(String email);
}