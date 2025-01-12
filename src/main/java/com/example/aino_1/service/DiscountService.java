package com.example.aino_1.service;

import com.example.aino_1.dto.ProductDiscountDTO;
import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.entity.DiscountCampaign;
import com.example.aino_1.entity.Imei;
import com.example.aino_1.entity.ProductDiscount;
import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.repository.DiscountCampaignInterface;
import com.example.aino_1.repository.ImeiInterface;
import com.example.aino_1.repository.ProductDiscountInterface;
import com.example.aino_1.repository.SanPhamChiTietInterface;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DiscountService {
    @Autowired
    private DiscountCampaignInterface discountCampaignInterface;

    @Autowired
    private SanPhamChiTietInterface sanPhamChiTietInterface;

    @Autowired
    private ProductDiscountInterface productDiscountInterface;

    @Autowired
    private ImeiService imeiService;

    @Autowired
    private SanPhamChiTietService sanPhamChiTietService;

    @Autowired
    private JwtUtils jwtUtils;

    public List<SanPhamChiTietDto> getActiveDiscountsOrProducts() {
        LocalDateTime now = LocalDateTime.now();

        updateActiveStatusesForProductDiscount();
        updateActiveDiscountCampaigns();

        // Lấy danh sách chiến dịch giảm giá đang hoạt động
        List<DiscountCampaign> campaigns = discountCampaignInterface
                .findByActiveTrueAndStartDateBeforeAndEndDateAfter(now, now);

        List<SanPhamChiTietDto> list = new ArrayList<>();

        for (DiscountCampaign discountCampaign : campaigns){
            list = getSanPhamWithDiscounts(discountCampaign.getId());
        }

        if (campaigns == null || campaigns.isEmpty()) {
            // Không có chiến dịch giảm giá đang hoạt động, lấy danh sách sản phẩm
            List<SanPhamChiTietDto> products = sanPhamChiTietService.getListForHome();

            // Xóa thông tin giảm giá trên sản phẩm
            for (SanPhamChiTietDto product : products) {
                product.setDiscountedPrice(product.getDonGia()); // Giá giảm = Giá gốc
                product.setDiscountPercentage(0); // Không có giảm giá
            }

            System.out.println("No active campaigns found. Returning all products.");
            return new ArrayList<>(products);
        }

        // Trả về danh sách chiến dịch giảm giá đang hoạt động
        return list;
    }


    // Cron Job cho ProductDiscount
//    @Scheduled(fixedRate =1000000000) // Chạy mỗi 60 giây
    public void updateActiveStatusesForProductDiscount() {
        updateActiveBasedOnRealTimeForProductDiscount();
    }

    // updateActive cho ProductDiscount
    @Transactional
    public void updateActiveBasedOnRealTimeForProductDiscount() {
        LocalDateTime now = LocalDateTime.now();

        // Lấy danh sách tất cả ProductDiscount
        List<ProductDiscount> productDiscounts = productDiscountInterface.findAll();

        for (ProductDiscount productDiscount : productDiscounts) {
            DiscountCampaign discountCampaign = productDiscount.getDiscountCampaign();

            SanPhamChiTiet product = productDiscount.getProduct();

//            Integer sIMEISPCT = imeiService.getListImeibySPCT(product.getId()).size();
//            // Kiểm tra số lượng tồn kho của sản phẩm
//            if(sIMEISPCT== 0) {
//                // Nếu sản phẩm hết hàng, set active = 0
//                productDiscount.setActive(0);
//                continue; // Bỏ qua các bước kiểm tra khác
//            }

            // Kiểm tra thời gian bắt đầu và kết thúc của chiến dịch giảm giá
            if (discountCampaign.getStartDate().isBefore(now) && discountCampaign.getEndDate().isAfter(now)) {
                // Nếu trong khoảng thời gian hoạt động, set active = 1
                productDiscount.setActive(1);
            } else {
                // Nếu ngoài khoảng thời gian hoạt động, set active = 0
                productDiscount.setActive(0);
            }
        }

        // Lưu danh sách đã cập nhật
        productDiscountInterface.saveAll(productDiscounts);
    }


    @Scheduled(fixedRate = 100000000) // Cập nhật mỗi 60 giây
    public void updateActiveCampaigns() {
        updateActiveDiscountCampaigns();

    }

    @Transactional
    public void updateActiveDiscountCampaigns() {
        LocalDateTime now = LocalDateTime.now();

        // Lấy danh sách tất cả các DiscountCampaign
        List<DiscountCampaign> campaigns = discountCampaignInterface.findAll();

        for (DiscountCampaign campaign : campaigns) {
            if (campaign.getStartDate().isBefore(now) && campaign.getEndDate().isAfter(now)) {
                // Trong khoảng thời gian hoạt động, set active = true
                campaign.setActive(1);
            } else {
                // Ngoài khoảng thời gian hoạt động, set active = false
                campaign.setActive(0);
            }
        }

        // Lưu danh sách đã cập nhật
        discountCampaignInterface.saveAll(campaigns);
    }


    public List<SanPhamChiTietDto> getSanPhamWithDiscounts(Integer discountCampaignId) {
        // Lấy danh sách sản phẩm chi tiết DTO
        List<SanPhamChiTietDto> sanPhamList = sanPhamChiTietInterface.getAllDTO();

        // Lấy danh sách giảm giá từ discountCampaignId
        List<ProductDiscount> discounts = productDiscountInterface.findByDiscountCampaignId(discountCampaignId);

        // Kiểm tra trạng thái của chiến dịch khuyến mãi
        Optional<DiscountCampaign> campaignOpt = discountCampaignInterface.findById(discountCampaignId);
        if (campaignOpt.isPresent()) {
            DiscountCampaign campaign = campaignOpt.get();
            LocalDateTime now = LocalDateTime.now();
            if (campaign.getEndDate().isBefore(now) || campaign.getStartDate().isAfter(now)) {
                discounts = Collections.emptyList(); // Nếu campaign không hợp lệ
            }
        } else {
            discounts = Collections.emptyList(); // Campaign không tồn tại
        }

        // Ánh xạ giảm giá theo ID sản phẩm
        Map<Integer, ProductDiscount> discountMap = discounts.stream()
                .collect(Collectors.toMap(discount -> discount.getProduct().getId(), discount -> discount));

        // Duyệt qua danh sách sản phẩm để tính giá sau giảm
        sanPhamList.forEach(sanPham -> {
            Integer productId = sanPham.getId();

            if (discountMap.containsKey(productId)) {
                // Có giảm giá áp dụng
                ProductDiscount discount = discountMap.get(productId);
                Integer discountPercentage = discount.getDiscountCampaign().getDiscountPercentage();

                BigDecimal originalPrice = BigDecimal.valueOf(sanPham.getDonGia());
                BigDecimal discountAmount = originalPrice.multiply(
                        BigDecimal.valueOf(discountPercentage).divide(BigDecimal.valueOf(100)));
                BigDecimal discountedPrice = originalPrice.subtract(discountAmount);

                sanPham.setDiscountedPrice(discountedPrice.floatValue()); // Giá sau giảm
                sanPham.setDiscountPercentage(discountPercentage); // Phần trăm giảm giá
            } else {
                // Không có giảm giá
                sanPham.setDiscountedPrice(sanPham.getDonGia().floatValue()); // Giá gốc
                sanPham.setDiscountPercentage(0); // Không có giảm giá
            }
        });

        return sanPhamList;
    }

    @Transactional
    public Map<String, Object> addDiscountCampaign(String token, DiscountCampaign discountCampaign, List<Integer> productIds) {
        Map<String, Object> result = new HashMap<>();

        // Kiểm tra quyền admin
        Map<String, Object> tokenDetails = jwtUtils.validateToken(token);
        if (tokenDetails == null || !"ROLE_ADMIN".equals(tokenDetails.get("role"))) {
            result.put("Trái phép", "Truy cập bị từ chối. Cần có đặc quyền của quản trị viên.");
            return result;
        }

        // Kiểm tra nếu tên chiến dịch đã tồn tại
        if (discountCampaignInterface.existsByName(discountCampaign.getName())) {
            result.put("Lỗi", "Tên chiến dịch đã tồn tại.");
            return result;
        }

        try {
            // Lưu chiến dịch giảm giá
            DiscountCampaign savedCampaign = discountCampaignInterface.save(discountCampaign);

            for (Integer productId : productIds) {
                // Tìm sản phẩm theo ID
                SanPhamChiTiet product = sanPhamChiTietInterface.findById(productId)
                        .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại. Tên sản phẩm: " + sanPhamChiTietInterface.getSanPhamChiTietById(productId).getTenSanPhamChiTiet()));

                SanPhamChiTietDto sanPhamChiTietDto = sanPhamChiTietInterface.getSanPhamChiTietById(productId);

                // Kiểm tra nếu sản phẩm đã thuộc một chiến dịch đang hoạt động
                Optional<ProductDiscount> existingDiscountOpt = productDiscountInterface.findByProductAndActive(product, 1);

                if (existingDiscountOpt.isPresent()) {
                    ProductDiscount existingDiscount = existingDiscountOpt.get();
                    DiscountCampaign existingCampaign = existingDiscount.getDiscountCampaign();

                    LocalDateTime now = LocalDateTime.now();

                    // Nếu đợt khuyến mại cũ không hoạt động
                    if (existingCampaign.getEndDate().isBefore(now) || existingCampaign.getActive() == 0) {
                        existingDiscount.setActive(0); // Vô hiệu hóa đợt khuyến mại cũ
                        productDiscountInterface.save(existingDiscount);
                    } else {
                        // Nếu đợt khuyến mại cũ đang hoạt động, bỏ qua sản phẩm
                        result.put("Lỗi", "Sản phẩm "+ sanPhamChiTietInterface.getSanPhamChiTietById(existingDiscountOpt.get().getId()).getTenSanPhamChiTiet() +"đã có trong một chiến dịch đang hoạt động: " + existingCampaign.getName());
                        continue;
                    }
                }


                // Thêm sản phẩm vào chiến dịch mới
                ProductDiscount newProductDiscount = new ProductDiscount();
                newProductDiscount.setProduct(product);
                newProductDiscount.setDiscountCampaign(savedCampaign);
                newProductDiscount.setActive(1);
                productDiscountInterface.save(newProductDiscount);
            }

            result.put("Thành công", savedCampaign);
        } catch (Exception e) {
            result.put("Lỗi", "Đã xảy ra lỗi không mong muốn: " + e.getMessage());
        }

        return result;
    }


    public DiscountCampaign updateDiscountCampaign(Integer id, DiscountCampaign updatedCampaign) {
        return discountCampaignInterface.findById(id).map(existingCampaign -> {
            existingCampaign.setName(updatedCampaign.getName());
            existingCampaign.setDiscountPercentage(updatedCampaign.getDiscountPercentage());
            existingCampaign.setStartDate(updatedCampaign.getStartDate());
            existingCampaign.setEndDate(updatedCampaign.getEndDate());
            existingCampaign.setActive(updatedCampaign.getActive());
            return discountCampaignInterface.save(existingCampaign);
        }).orElseThrow(() -> new EntityNotFoundException("Discount campaign not found"));
    }

    public DiscountCampaign updateDiscountCampaignForRealTime(Integer id) {
        return discountCampaignInterface.findById(id).map(existingCampaign -> {
            LocalDateTime now = LocalDateTime.now();

            // Cập nhật thời gian kết thúc thành thời gian hiện tại
            existingCampaign.setEndDate(now);

            // Nếu endTime đã vượt qua now, tự động set active = 0
            existingCampaign.setActive(0); // Tắt chiến dịch

            return discountCampaignInterface.save(existingCampaign);
        }).orElseThrow(() -> new EntityNotFoundException("Discount campaign not found"));
    }



    public void deleteDiscountCampaign(Integer id) {
        if (discountCampaignInterface.existsById(id)) {
            discountCampaignInterface.deleteById(id);
        } else {
            throw new EntityNotFoundException("Discount campaign not found");
        }
    }

    public ProductDiscount createProductDiscount(Integer productId, Integer campaignId, ProductDiscount productDiscount) {
        // Tìm sản phẩm
        SanPhamChiTiet product = sanPhamChiTietInterface.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Tìm chiến dịch khuyến mãi
        DiscountCampaign campaign = discountCampaignInterface.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Discount Campaign not found"));

        // Kiểm tra xem sản phẩm có đang thuộc đợt khuyến mãi nào khác không
        Optional<ProductDiscount> existingDiscount = productDiscountInterface
                    .findByProductAndActive(product, 1); // Kiểm tra active = 1

        if (existingDiscount.isPresent()) {
            ProductDiscount activeDiscount = existingDiscount.get();
            DiscountCampaign activeCampaign = activeDiscount.getDiscountCampaign();

            // Nếu chiến dịch cũ đang hoạt động, ném ngoại lệ
            if (activeCampaign.getEndDate().isAfter(LocalDateTime.now())) {
                throw new RuntimeException("Product is already in an active discount campaign.");
            }

            // Nếu chiến dịch cũ đã hết hạn, vô hiệu hóa
            activeDiscount.setActive(0);
            productDiscountInterface.save(activeDiscount);
        }

        // Tạo mới ProductDiscount
        productDiscount.setProduct(product);
        productDiscount.setDiscountCampaign(campaign);
        productDiscount.setActive(1); // Đặt mặc định là "active"

        return productDiscountInterface.save(productDiscount);
    }


    // Sửa ProductDiscount
    public ProductDiscount updateProductDiscount(Integer discountId, ProductDiscount updatedProductDiscount) {
        ProductDiscount existingProductDiscount = productDiscountInterface.findById(discountId)
                .orElseThrow(() -> new RuntimeException("Product Discount not found"));

        existingProductDiscount.setProduct(updatedProductDiscount.getProduct());
        existingProductDiscount.setActive(updatedProductDiscount.getActive());
        return productDiscountInterface.save(existingProductDiscount);
    }

    // Xóa ProductDiscount
    public void deleteProductDiscount(Integer discountId) {
        if (!productDiscountInterface.existsById(discountId)) {
            throw new RuntimeException("Product Discount not found");
        }
        productDiscountInterface.deleteById(discountId);
    }
    // Lấy danh sách ProductDiscount theo Campaign ID
    public List<ProductDiscount> getProductDiscountsByCampaign(Integer campaignId) {
        return productDiscountInterface.findByDiscountCampaignId(campaignId);
    }

    // Lấy danh sách ProductDiscount theo Product ID
    public List<ProductDiscount> getProductDiscountsByProduct(Integer productId) {
        return productDiscountInterface.findByProductId(productId);
    }

}

