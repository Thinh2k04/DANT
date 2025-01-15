package com.example.aino_1.restController;

import com.example.aino_1.dto.ProductDiscountDTO;
import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.entity.*;
import com.example.aino_1.repository.DiscountCampaignInterface;
import com.example.aino_1.repository.ProductDiscountInterface;
import com.example.aino_1.service.DiscountService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/rest/discount")
@Component
public class DiscountRestController {
    @Autowired
    private DiscountService discountService;

    @Autowired
    private DiscountCampaignInterface discountCampaignInterface;

    @Autowired
    private ProductDiscountInterface productDiscountInterface;

    @GetMapping("/active")
    public List<SanPhamChiTietDto> getActiveDiscounts() {
        return discountService.getActiveDiscountsOrProducts();
    }

    @GetMapping("/getAllCampaign")
    public List<DiscountCampaign> getAllDiscountCampaign(){
        return discountCampaignInterface.findAll();
    }

    @GetMapping("/getAllProductDiscount")
    public List<ProductDiscount> getAllProductDiscount(){
        return productDiscountInterface.findAll();
    }

    // Thêm đợt giảm giá
    @PostMapping("/addDiscount")
    public ResponseEntity<Map<String, Object>> addDiscountCampaign(
            @RequestBody Map<String, Object> discountCampaignRequest
    ) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()); // Đăng ký xử lý LocalDateTime
        String username = objectMapper.convertValue(discountCampaignRequest.get("username"), String.class);
        DiscountCampaign discountCampaign = objectMapper.convertValue(discountCampaignRequest.get("campaigns"), DiscountCampaign.class);
        List<Integer> productIds = objectMapper.convertValue(discountCampaignRequest.get("products"), new TypeReference<List<Integer>>() {});

        Map<String, Object> result = discountService.addDiscountCampaign( username,discountCampaign, productIds);

        if (result.containsKey("Lỗi")) {
            return ResponseEntity.badRequest().body(result);
        }

        return ResponseEntity.ok(result);
    }



    // Sửa đợt giảm giá
    @PutMapping("/updateDiscount/{id}")
    public DiscountCampaign updateDiscountCampaign(@PathVariable Integer id, @RequestBody DiscountCampaign updatedCampaign) {
        return discountService.updateDiscountCampaign(id, updatedCampaign);
    }

    @PutMapping("/updateDiscountForRealTime/{id}")
    public DiscountCampaign updateDiscountCampaignForRealTime(@PathVariable Integer id) {
        return discountService.updateDiscountCampaignForRealTime(id);
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
