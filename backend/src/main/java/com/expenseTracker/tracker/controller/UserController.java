package com.expenseTracker.tracker.controller;

import com.expenseTracker.tracker.model.User;
import com.expenseTracker.tracker.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}")
    public User getUser(@PathVariable ObjectId id) {
        return userRepository.findById(id).orElse(null);
    }

    // Add this endpoint for best practice
    @GetMapping("/by-username/{username}")
    public User getUserByUsername(@PathVariable String username) {
        return userRepository.findByUsername(username);
    }

    @GetMapping("/by-email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email);
    }
}