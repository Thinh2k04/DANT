package com.example.aino_1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor

public class ProductDiscountDTO {
    private Integer productId;
    private Integer discountCampaignID;
}

