package com.example.aino_1.restController;

import com.example.aino_1.service.ZaloPayService;
import lombok.SneakyThrows;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Map;
import javax.xml.
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/payment")
public class ZaloPayController {

    @Autowired
    private ZaloPayService zaloPayService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private Logger logger = Logger.getLogger(this.getClass().getName());
    private String key2 = "eG4r0GcoNtRGbO8";
    private Mac HmacSHA256;

    public void CallbackController() throws Exception  {
        HmacSHA256 = Mac.getInstance("HmacSHA256");
        HmacSHA256.init(new SecretKeySpec(key2.getBytes(), "HmacSHA256"));
    }

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

    @SneakyThrows
    @PostMapping("/callback")
    public String callback(@RequestBody String jsonStr) {
        JSONObject result = new JSONObject();

        try {
            JSONObject cbdata = new JSONObject(jsonStr);
            String dataStr = cbdata.getString("data");
            String reqMac = cbdata.getString("mac");

            byte[] hashBytes = HmacSHA256.doFinal(dataStr.getBytes());
            String mac = DatatypeConverter.printHexBinary(hashBytes).toLowerCase();

            // kiểm tra callback hợp lệ (đến từ ZaloPay server)
            if (!reqMac.equals(mac)) {
                // callback không hợp lệ
                result.put("return_code", -1);
                result.put("return_message", "mac not equal");
            } else {
                // thanh toán thành công
                // merchant cập nhật trạng thái cho đơn hàng
                JSONObject data = new JSONObject(dataStr);
                logger.info("update order's status = success where app_trans_id = " + data.getString("app_trans_id"));

                result.put("return_code", 1);
                result.put("return_message", "success");
            }
        } catch (Exception ex) {
            result.put("return_code", 0); // ZaloPay server sẽ callback lại (tối đa 3 lần)
            result.put("return_message", ex.getMessage());
        }

        // thông báo kết quả cho ZaloPay server
        return result.toString();
    }

}
