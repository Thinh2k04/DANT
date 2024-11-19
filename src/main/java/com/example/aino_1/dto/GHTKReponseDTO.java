package com.example.aino_1.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


public class GHTKReponseDTO {
    private boolean success;

    @JsonProperty("fee")
    private int fee; // Phí giao hàng, đơn vị: VNĐ

    @JsonProperty("delivery_time")
    private String deliveryTime; // Thời gian giao hàng, ví dụ: "1-2 ngày"

    private String message; // Thông báo từ hệ thống

    // Getters và Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public int getFee() {
        return fee;
    }

    public void setFee(int fee) {
        this.fee = fee;
    }

    public String getDeliveryTime() {
        return deliveryTime;
    }

    public void setDeliveryTime(String deliveryTime) {
        this.deliveryTime = deliveryTime;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
