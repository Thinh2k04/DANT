package com.example.aino_1.restController;

import com.example.aino_1.entity.GioHangChiTiet;
import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.repository.GioHangChiTietInterface;
import com.example.aino_1.service.GioHangChiTietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/ghct") //đường dẫn chung cho các phương thức http bên dưới
public class GHCTRestController {
    @Autowired
    GioHangChiTietInterface gsi;

    @Autowired
    GioHangChiTietService gioHangChiTietService;

    @GetMapping("/getAll")
    public List<GioHangChiTiet> getAll() {
        return gsi.findAll();
    }

    @GetMapping("/getByID/{id}")
    public GioHangChiTiet getAll(@PathVariable Integer id) {
        return gsi.findById(id).get();
    }

    @PostMapping("/add")
    public GioHangChiTiet create(@RequestBody GioHangChiTiet ghct) {
        return gsi.save(ghct);
    }

    @PutMapping("/update/{id}")
    public GioHangChiTiet update(@RequestBody GioHangChiTiet ghct) {
        return gsi.save(ghct);
    }

    @DeleteMapping("/del")
    public void delete(@RequestBody GioHangChiTiet ghct) {
        ghct.setTrangThai(0);
        gsi.save(ghct);
    }

    // hàm dành cho nút mua hàng, check giỏi hàng trước khi đẩy qua màn xác nhận đơn hàng
    @PostMapping("/check")
    public ResponseEntity<?> checkGioHang(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody(required = false) List<SanPhamChiTiet> listSPCT) {
        try {
            // Gọi service kiểm tra giỏ hàng (truyền token và danh sách sản phẩm)
            Map<String, Object> result = gioHangChiTietService.checkGioHang(token, listSPCT);

            if ((boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi: " + e.getMessage());
        }
    }

    @PostMapping("/changQuantity")
    public ResponseEntity<?> updateProductQuantityInCart(
            @RequestBody Map<String, Object> requestData) {
        try {
            Integer productId = (Integer) requestData.get("productId");
            Integer quantityChange = (Integer) requestData.get("quantityChange"); // 1 để thêm, -1 để giảm

            if (productId == null || quantityChange == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "productId", productId,
                        "soLuongTonKho", null,
                        "message", "Dữ liệu không hợp lệ: sản phẩm hoặc thay đổi số lượng không hợp lệ."
                ));
            }
            String username =  requestData.get("username").toString();

            Map<String, Object> response = gioHangChiTietService.updateProductQuantityInCart(username, productId, quantityChange);

            if ((boolean) response.get("success")) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "productId", null,
                    "soLuongTonKho", null,
                    "message", "Lỗi khi cập nhật giỏ hàng: " + e.getMessage()
            ));
        }
    }
}

