package com.example.aino_1.restController;

import com.example.aino_1.service.ZaloPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class ZaloPayController {

    @Autowired
    private ZaloPayService zaloPayService;

    @PostMapping("/create")
    public Map<String, Object> createOrder(@RequestBody Map<String, Object> request) {
        try {
            return zaloPayService.createOrder(request);
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", "An error occurred: " + e.getMessage());
        }
    }
}
