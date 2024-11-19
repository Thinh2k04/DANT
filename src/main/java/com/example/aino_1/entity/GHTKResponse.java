package com.example.aino_1.entity;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;



@JsonIgnoreProperties(ignoreUnknown = true)
public class GHTKResponse {

    private boolean success; // Trạng thái thành công hay thất bại
    private String message; // Thông điệp trả về
    private Map<String, Object> order; // Thông tin chi tiết đơn hàng

    // Getters và Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Map<String, Object> getOrder() {
        return order;
    }

    public void setOrder(Map<String, Object> order) {
        this.order = order;
    }

}
