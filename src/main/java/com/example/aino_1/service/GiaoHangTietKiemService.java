package com.example.aino_1.service;

import com.example.aino_1.entity.GHTKResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.util.Map;

@Service
public class GiaoHangTietKiemService {

    @Value("${ghtk.api.base-url}")
    private String baseUrl;

    @Value("${ghtk.api.token}")
    private String apiToken;

    private final RestTemplate restTemplate;

    public GiaoHangTietKiemService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }


    public Map<String, Object> createOrder(Map<String, Object> orderData) {
        String url = baseUrl + "/services/shipment/order";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", apiToken);
        headers.set("Content-Type", "application/json");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(orderData, headers);

        try {
            ResponseEntity<GHTKResponse> response = restTemplate.postForEntity(url, request, GHTKResponse.class);

            // Chuyển đối tượng GHTKResponse thành Map
            GHTKResponse responseBody = response.getBody();
            return Map.of(
                    "success", responseBody.isSuccess(),
                    "message", responseBody.getMessage(),
                    "order", responseBody.getOrder()
            );
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of(
                    "success", false,
                    "message", "Có lỗi xảy ra khi gọi API GHTK: " + e.getMessage()
            );
        }
    }

    public Map<String, Object> calculateShippingFee(Map<String, Object> feeRequest) {
        String url = baseUrl + "/services/shipment/fee";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", apiToken);
        headers.set("Content-Type", "application/json");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(feeRequest, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("success", false, "message", "Có lỗi xảy ra khi tính phí: " + e.getMessage());
        }
    }

}
