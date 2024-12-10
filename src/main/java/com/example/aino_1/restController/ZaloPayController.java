package com.example.aino_1.restController;

import com.example.aino_1.service.ZaloPayService;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class ZaloPayController {

    @Autowired
    private ZaloPayService zaloPayService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/create")
    public Map<String, Object> createOrder(@RequestBody Map<String, Object> request) {
        try {
            return zaloPayService.createOrder(request);
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", "An error occurred: " + e.getMessage());
        }
    }


    @GetMapping(value = "/order-status", produces = "application/json")
    public ResponseEntity<String> getOrderStatus(@RequestParam String appTransId) {
        try {
            JSONObject jsonResponse = zaloPayService.getOrderStatus(appTransId);
            return ResponseEntity.ok(jsonResponse.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\": \"An error occurred: " + e.getMessage() + "\"}");
        }
    }


//    @PostMapping("/callback")
//    public ResponseEntity<String> handleCallback(@RequestBody Map<String, Object> payload) {
//        try {
//            // Log payload callback nhận được từ ZaloPay
//            System.out.println("Callback payload received: " + payload);
//
//            // Xác minh callback từ ZaloPay
//            boolean isValid = zaloPayService.verifyCallback(payload);
//            if (!isValid) {
//                return ResponseEntity.badRequest().body("Invalid signature");
//            }
//
//            // Xử lý logic đơn hàng sau khi thanh toán
//            zaloPayService.processCallback(payload);
//
//            // Gửi thông báo qua WebSocket cho frontend
//            String orderId = (String) payload.get("app_trans_id");
//            messagingTemplate.convertAndSend("/topic/payment-status", Map.of(
//                    "orderId", orderId,
//                    "status", "SUCCESS"
//            ));
//
//            return ResponseEntity.ok("Callback processed successfully");
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
//        }
//    }

}
