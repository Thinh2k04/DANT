package com.example.aino_1.restController;

import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.entity.HinhAnh;
import com.example.aino_1.entity.SanPham;
import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.repository.SanPhamChiTietInterface;
import com.example.aino_1.service.SanPhamChiTietService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/spctDTO") //đường dẫn chung cho các phương thức http bên dưới
public class    SPCTDTORestController {

    @Autowired
    SanPhamChiTietInterface spctsi;

    @Autowired
    SanPhamChiTietService spctsv;

    @GetMapping("/getAll")
    public List<SanPhamChiTietDto> getAllSanPhamChiTietDto() {
        return spctsv.getListForHome();
    }

    @GetMapping("/getThungRac")
    public List<SanPhamChiTietDto> getAllSanPhamChiTietDtoThungRac() {
        return spctsv.getListThungRac();
    }

    @GetMapping("/getById/{id}")
    public SanPhamChiTietDto getByIDSPCT(@PathVariable Integer id){
        return spctsi.getSanPhamChiTietById(id);
    }

    @PostMapping("/add")
    public ResponseEntity<String> create(@RequestBody Map<String, Object> requestData) {
        try {
            // Lấy thông tin sản phẩm từ JSON
            ObjectMapper objectMapper = new ObjectMapper();
            SanPhamChiTiet sanPhamChiTiet = objectMapper.convertValue(requestData.get("sanPhamChiTiet"), SanPhamChiTiet.class);
            SanPham sanPham = objectMapper.convertValue(requestData.get("sanPham"), SanPham.class);

            // Lấy danh sách URL ảnh từ JSON
            List<String> imageUrls = (List<String>) requestData.get("imageUrls");

            // Gọi phương thức lưu dữ liệu
            boolean isSaved = spctsv.saveSanPhamChiTietWithImage(sanPhamChiTiet, sanPham, imageUrls);

            // Kiểm tra kết quả lưu
            if (isSaved) {
                return ResponseEntity.ok("Sản phẩm chi tiết đã được lưu thành công.");
            } else {
                return ResponseEntity.status(   HttpStatus.INTERNAL_SERVER_ERROR).body("Không thể lưu sản phẩm chi tiết.");
            }
        } catch (IllegalArgumentException e) {
            // Xử lý lỗi dữ liệu không hợp lệ
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Dữ liệu không hợp lệ: " + e.getMessage());
        } catch (Exception e) {
            // Xử lý lỗi chung
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi: " + e.getMessage());
        }
    }

    @PostMapping("/update")
    public ResponseEntity<String> update(@RequestBody Map<String, Object> requestData) {
        try {
            // Lấy thông tin sản phẩm từ JSON
            ObjectMapper objectMapper = new ObjectMapper();
            SanPhamChiTiet sanPhamChiTiet = objectMapper.convertValue(requestData.get("sanPhamChiTiet"), SanPhamChiTiet.class);
            SanPham sanPham = objectMapper.convertValue(requestData.get("sanPham"), SanPham.class);

            // Lấy danh sách URL ảnh từ JSON
            List<String> imageUrls = (List<String>) requestData.get("imageUrls");

            // Gọi phương thức lưu dữ liệu
            boolean isSaved = spctsv.saveSanPhamChiTietWithImage(sanPhamChiTiet, sanPham, imageUrls);

            // Kiểm tra kết quả lưu
            if (isSaved) {
                return ResponseEntity.ok("Sản phẩm chi tiết đã được lưu thành công.");
            } else {
                return ResponseEntity.status(   HttpStatus.INTERNAL_SERVER_ERROR).body("Không thể lưu sản phẩm chi tiết.");
            }
        } catch (IllegalArgumentException e) {
            // Xử lý lỗi dữ liệu không hợp lệ
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Dữ liệu không hợp lệ: " + e.getMessage());
        } catch (Exception e) {
            // Xử lý lỗi chung
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi: " + e.getMessage());
        }
    }

    @PostMapping("/del")
    public void deleteSPCTDTO(@RequestBody SanPhamChiTiet spctdto){
        spctdto.setTrangThai(0);
        spctsi.save(spctdto);
    }
    }

