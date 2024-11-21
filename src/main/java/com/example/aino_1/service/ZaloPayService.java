package com.example.aino_1.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import org.apache.commons.codec.binary.Hex;
import java.util.UUID;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

@Service
public class ZaloPayService {


    private static final String APP_ID = "2554"; // Đặt ID ứng dụng của bạn
    private static final String KEY1 = "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn"; // Khóa 1 của ứng dụng
    private static final String CREATE_ORDER_URL = "https://sb-openapi.zalopay.vn/v2/create"; // API endpoint

    public Map<String, Object> createOrder(Map<String, Object> params) {
        try {
            // Kiểm tra null cho total_amount và các tham số khác
            String totalAmount = (String) params.get("amount");
            if (totalAmount == null || totalAmount.isEmpty()) {
                throw new IllegalArgumentException("Total amount is required");
            }

            long amount = Long.parseLong(totalAmount); // Lấy số tiền từ map
            long timestamp = System.currentTimeMillis() / 1000; // Thời gian hiện tại (giây)

            // Tạo các tham số cần thiết cho việc gửi yêu cầu
            Map<String, Object> order = new HashMap<>();
            order.put("app_id", params.get("app_id"));
            order.put("app_trans_id", getCurrentTimeString("yyMMdd") + "_" + UUID.randomUUID().toString());
            order.put("app_time", System.currentTimeMillis());
            order.put("app_user", params.get("app_user"));
            order.put("amount", amount);
            order.put("description", "Lazada - Payment for the order #" + UUID.randomUUID().toString());
            order.put("bank_code", "zalopayapp");
            order.put("item", params.get("item"));
            order.put("embed_data", "{}");

            // Tạo chuỗi dữ liệu cho việc tính toán MAC
            String data = order.get("app_id") + "|" +
                    order.get("app_trans_id") + "|" +
                    order.get("app_user") + "|" +
                    order.get("amount") + "|" +
                    order.get("app_time") + "|" +
                    order.get("embed_data") + "|" +
                    order.get("item");

            // Tạo MAC
            String mac = generateMac(data);
            order.put("mac", mac);

            // Gửi yêu cầu đến ZaloPay
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(order, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(CREATE_ORDER_URL, request, Map.class);

            return response.getBody(); // Kết quả trả về từ ZaloPay
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return errorResponse;
        }
    }

    // Hàm tạo chữ ký HMAC SHA-256
    private String generateMac(String data) {
        try {
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(KEY1.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256Hmac.init(secretKey);
            byte[] hash = sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Hex.encodeHexString(hash);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Error generating MAC", e);
        }
    }

    // Hàm lấy ngày hiện tại theo định dạng yyMMdd
    private String getCurrentTimeString(String format) {
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        sdf.setTimeZone(TimeZone.getTimeZone("GMT+7"));
        return sdf.format(Calendar.getInstance().getTime());
    }
}
