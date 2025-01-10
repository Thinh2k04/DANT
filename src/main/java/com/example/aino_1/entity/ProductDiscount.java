package com.example.aino_1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "product_discount")
public class ProductDiscount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "product_id", nullable = false)
    private SanPhamChiTiet product;

    @ManyToOne
    @JoinColumn(name = "discount_campaign_id", nullable = false)
    private DiscountCampaign discountCampaign;

    @Column(name = "active", nullable = false)
    private Integer active;
}

