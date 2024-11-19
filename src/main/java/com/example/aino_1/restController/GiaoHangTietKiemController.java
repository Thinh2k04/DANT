package com.example.aino_1.restController;

import com.example.aino_1.service.GiaoHangTietKiemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ghtk")
public class GiaoHangTietKiemController {

    @Autowired
    private GiaoHangTietKiemService ghtkService;

    @PostMapping("/create-order")
    public Map<String, Object> createOrder(@RequestBody Map<String, Object> orderData) {
        return ghtkService.createOrder(orderData);
    }

    @PostMapping("/calculate-fee")
    public Map<String, Object> calculateFee(@RequestBody Map<String, Object> feeRequest) {
        return ghtkService.calculateShippingFee(feeRequest);
    }
}
