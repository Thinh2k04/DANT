package com.example.aino_1.repository;

import com.example.aino_1.entity.ProductDiscount;
import com.example.aino_1.entity.SanPhamChiTiet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDiscountInterface extends JpaRepository<ProductDiscount,Integer> {
    List<ProductDiscount> findByDiscountCampaignId(Integer discountCampaignId);
    List<ProductDiscount> findByProductId(Integer productId);
}
