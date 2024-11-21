package com.example.aino_1.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    private String userId;
    private List<Item> items;
    private long totalAmount;

    // getters and setters
}

