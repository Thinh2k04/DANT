package com.example.aino_1.restController;

import com.example.aino_1.dto.SanPhamDTO;
import com.example.aino_1.entity.SanPham;
import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.repository.SanPhamChiTietInterface;
import com.example.aino_1.repository.SanPhamInterface;
import com.example.aino_1.service.SanPhamChiTietService;
import com.example.aino_1.service.SanPhamService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/san_pham") //đường dẫn chung cho các phương thức http bên dưới
public class SanPhamRestController {

    @Autowired
    SanPhamInterface spsi;
    @Autowired
    SanPhamService spsv;

    @Autowired
    SanPhamChiTietInterface spctsi;




    @GetMapping("/getAll")
    public List<SanPham> getAll() {
        return spsi.findAll();
    }

    @GetMapping("/getById/{id}")
    public SanPham getById(@PathVariable Integer id) {
        return spsi.findById(id).get();
    }

    @PostMapping("/addOrUpdate")
    public ResponseEntity<String> create(@RequestBody Map<String, Object> requestData) {
        try {
            // Tạo một ObjectMapper dùng chung
            ObjectMapper objectMapper = new ObjectMapper();

            // Lấy thông tin sản phẩm chi tiết từ JSON
            if (!requestData.containsKey("sanPhamChiTiet")) {
                return ResponseEntity.badRequest().body("Thiếu thông tin 'sanPhamChiTiet'");
            }
            SanPhamChiTiet sanPhamChiTiet = objectMapper.convertValue(requestData.get("sanPhamChiTiet"), SanPhamChiTiet.class);

            // Lấy thông tin sản phẩm từ JSON
            if (!requestData.containsKey("sanPham")) {
                return ResponseEntity.badRequest().body("Thiếu thông tin 'sanPham'");
            }
            SanPham sanPham = objectMapper.convertValue(requestData.get("sanPham"), SanPham.class);

            // Lấy danh sách URL ảnh từ JSON
            if (!requestData.containsKey("imageUrls")) {
                return ResponseEntity.badRequest().body("Thiếu danh sách URL ảnh 'imageUrls'");
            }
            List<String> imageUrls = objectMapper.convertValue(requestData.get("imageUrls"), new TypeReference<List<String>>() {});

//            // Lấy danh sách IMEU từ JSON
//            if (!requestData.containsKey("listImei")) {
//                return ResponseEntity.badRequest().body("Thiếu danh sách IMEI");
//            }
//            List<String> listImei = objectMapper.convertValue(requestData.get("listImei"), new TypeReference<List<String>>() {});

            // Gọi service để thêm sản phẩm
            boolean result = spsv.addSanPham(sanPhamChiTiet, sanPham, imageUrls);

            if (result) {
                return ResponseEntity.ok("Thêm sản phẩm thành công");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Thêm sản phẩm thất bại");
            }
        } catch (IllegalArgumentException e) {
            // Lỗi khi chuyển đổi JSON
            return ResponseEntity.badRequest().body("Dữ liệu không hợp lệ: " + e.getMessage());
        } catch (Exception e) {
            // Các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi: " + e.getMessage());
        }
    }

    @PostMapping("/Update")
    public ResponseEntity<String> update(@RequestBody Map<String, Object> requestData) {
        try {
            // Tạo một ObjectMapper dùng chung
            ObjectMapper objectMapper = new ObjectMapper();

            // Lấy thông tin sản phẩm chi tiết từ JSON
            if (!requestData.containsKey("sanPhamChiTiet")) {
                return ResponseEntity.badRequest().body("Thiếu thông tin 'sanPhamChiTiet'");
            }
            SanPhamChiTiet sanPhamChiTiet = objectMapper.convertValue(requestData.get("sanPhamChiTiet"), SanPhamChiTiet.class);

            // Lấy thông tin sản phẩm từ JSON
            if (!requestData.containsKey("sanPham")) {
                return ResponseEntity.badRequest().body("Thiếu thông tin 'sanPham'");
            }
            SanPham sanPham = objectMapper.convertValue(requestData.get("sanPham"), SanPham.class);

            // Lấy danh sách URL ảnh từ JSON
            if (!requestData.containsKey("imageUrls")) {
                return ResponseEntity.badRequest().body("Thiếu danh sách URL ảnh 'imageUrls'");
            }
            List<String> imageUrls = objectMapper.convertValue(requestData.get("imageUrls"), new TypeReference<List<String>>() {});

//            // Lấy danh sách IMEU từ JSON
//            if (!requestData.containsKey("listImei")) {
//                return ResponseEntity.badRequest().body("Thiếu danh sách IMEI");
//            }
//            List<String> listImei = objectMapper.convertValue(requestData.get("listImei"), new TypeReference<List<String>>() {});

            // Gọi service để thêm sản phẩm
            boolean result = spsv.addSanPham(sanPhamChiTiet, sanPham, imageUrls);

            if (result) {
                return ResponseEntity.ok("Thêm sản phẩm thành công");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Thêm sản phẩm thất bại");
            }
        } catch (IllegalArgumentException e) {
            // Lỗi khi chuyển đổi JSON
            return ResponseEntity.badRequest().body("Dữ liệu không hợp lệ: " + e.getMessage());
        } catch (Exception e) {
            // Các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi: " + e.getMessage());
        }
    }


    @PutMapping("/update/{id}")
    public void UpdateSanPham(@RequestBody SanPham sanPham){
        spsi.save(sanPham);
    }


    @DeleteMapping("/del/{id}")
    public void delete(@PathVariable Integer id) {
        spsi.deleteById(id);
    }
}
