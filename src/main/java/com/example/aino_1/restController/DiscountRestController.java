package com.example.aino_1.restController;

import com.example.aino_1.dto.ProductDiscountDTO;
import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.entity.DiscountCampaign;
import com.example.aino_1.entity.ProductDiscount;
import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/rest/discount")
@Component
public class DiscountRestController {
    @Autowired
    private DiscountService discountService;

    @GetMapping("/active")
    public List<Object> getActiveDiscounts() {
        return discountService.getActiveDiscountsOrProducts();
    }

    @PostMapping("/update-active")
    public ResponseEntity<String> updateActiveStatus() {
        discountService.updateActiveStatusesForProductDiscount();
        discountService.updateActiveDiscountCampaigns();
        return ResponseEntity.ok("Updated active status based on real-time.");
    }

    @GetMapping("/calculate/{discountChampaignId}")
    public List<SanPhamChiTietDto> calculateDiscountedPrice(@PathVariable Integer discountChampaignId) {
        return discountService.getSanPhamWithDiscounts(discountChampaignId);
    }

    // Thêm đợt giảm giá
    @PostMapping("/addDiscount")
    public DiscountCampaign addDiscountCampaign(@RequestBody DiscountCampaign discountCampaign) {
        return discountService.addDiscountCampaign(discountCampaign);
    }

    // Sửa đợt giảm giá
    @PutMapping("/updateDiscount/{id}")
    public DiscountCampaign updateDiscountCampaign(@PathVariable Integer id, @RequestBody DiscountCampaign updatedCampaign) {
        return discountService.updateDiscountCampaign(id, updatedCampaign);
    }

    // API thêm ProductDiscount
    @PostMapping("/addProduct")
    public ResponseEntity<ProductDiscount> createProductDiscount(
            @RequestParam Integer productId,
            @RequestParam Integer campaignId,
            @RequestBody ProductDiscount productDiscount
    ) {
        return ResponseEntity.ok(discountService.createProductDiscount(productId, campaignId, productDiscount));
    }

    // API sửa ProductDiscount
    @PutMapping("/updateProduct/{discountId}")
    public ResponseEntity<ProductDiscount> updateProductDiscount(
            @PathVariable Integer discountId,
            @RequestBody ProductDiscount updatedProductDiscount
    ) {
        return ResponseEntity.ok(discountService.updateProductDiscount(discountId, updatedProductDiscount));
    }


    // API lấy danh sách ProductDiscount theo Campaign ID
    @GetMapping("/getProductByCampaignId/{campaignId}")
    public ResponseEntity<List<ProductDiscount>> getProductDiscountsByCampaign(@PathVariable Integer campaignId) {
        return ResponseEntity.ok(discountService.getProductDiscountsByCampaign(campaignId));
    }

    // API lấy danh sách ProductDiscount theo Product ID
    @GetMapping("/getProductByProductId/{productId}")
    public ResponseEntity<List<ProductDiscount>> getProductDiscountsByProduct(@PathVariable Integer productId) {
        return ResponseEntity.ok(discountService.getProductDiscountsByProduct(productId));
    }
}
