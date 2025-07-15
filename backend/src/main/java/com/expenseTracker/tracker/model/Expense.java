package com.expenseTracker.tracker.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NonNull;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "expenses")
public class Expense {
    @Id
    private ObjectId id;
    @NonNull
    private String title;
    @NonNull
    private double amount;
    @NonNull
    private String category;
    @NonNull
    private String date;
    private ObjectId userId;

    @JsonProperty("id")
    public String getIdAsString() {
        return id.toHexString();
    }

    @JsonProperty("userId")
    public String getUserIdAsString() {
        return userId.toHexString();
    }


}