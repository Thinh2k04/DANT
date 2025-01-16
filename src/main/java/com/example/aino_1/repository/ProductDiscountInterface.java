package com.example.aino_1.repository;

import com.example.aino_1.entity.ProductDiscount;
import com.example.aino_1.entity.SanPhamChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductDiscountInterface extends JpaRepository<ProductDiscount,Integer> {
    List<ProductDiscount> findByDiscountCampaignId(Integer discountCampaignId);
    Optional<ProductDiscount> findByProductIdAndActive(Integer productID,Integer active);
}
