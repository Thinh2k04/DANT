package com.example.aino_1.restController;

import com.example.aino_1.entity.*;
import com.example.aino_1.repository.HoaDonInterface;
import com.example.aino_1.service.HoaDonService;
import com.example.aino_1.service.JwtUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/hoa_don") //đường dẫn chung cho các phương thức http bên dưới

public class HoaDonController {
    @Autowired
    HoaDonInterface hdsi;
    @Autowired
    HoaDonService hdsv;

    @Autowired
    JwtUtils jwtUtils;

    @GetMapping("/getAll")
    public List<HoaDon> getAll() {
        return hdsi.findAll();
    }

    @PutMapping("/update/{id}")
    public HoaDon update(@RequestBody HoaDon HoaDon) {
        return hdsi.save(HoaDon);
    }

    @PostMapping("/updateTTTT")
    public void delete(@RequestBody HoaDon HoaDon) {
        HoaDon.setTrangThaiThanhToan(1);
        hdsi.save(HoaDon);
    }

    @GetMapping("/getById/{id}")
    public HoaDon getByidHD(@PathVariable Integer id){
        return hdsi.findById(id).get();
    }

    @PutMapping("GiveHD")
    public void givehd(){
    }

    @PostMapping("addHD")
    public ResponseEntity<?> addHoaDon(@RequestBody Map<String, Object> requestData) {
        try {
            System.out.println("HOADONCONTROLLER: chạy vào phần try");
            ObjectMapper objectMapper = new ObjectMapper();

            String username = objectMapper.convertValue(requestData.get("username"),String.class);
            // Ánh xạ dữ liệu từ requestData
            ThongTinTaiKhoan thongTinTaiKhoan = objectMapper.convertValue(requestData.get("tttk"), ThongTinTaiKhoan.class);
            HoaDon hd = objectMapper.convertValue(requestData.get("hd"), HoaDon.class);
            List<HoaDonChiTiet> lhdct = objectMapper.convertValue(requestData.get("lhdct"), new TypeReference<List<HoaDonChiTiet>>() {});
            Voucher voucher = objectMapper.convertValue(requestData.get("hd.voucher"), Voucher.class);
            List<Imei> imeiList = objectMapper.convertValue(requestData.get("listImei"), new TypeReference<List<Imei>>() {});

            if (hd == null || lhdct == null || lhdct.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Dữ liệu đầu vào không hợp lệ."
                ));
            }

            // Gọi service để xử lý hóa đơn
            Map<String, Object> result = hdsv.hamXuLiHoaDon(username, thongTinTaiKhoan, hd, lhdct, voucher,imeiList);

            // Trả về kết quả dựa trên trạng thái
            if ((boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
            }

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Đã xảy ra lỗi: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/xac-nhan/{maHoaDon}")
    public ResponseEntity<?> xacNhanDonHang(
            @PathVariable String maHoaDon, // Sử dụng PathVariable thay vì RequestParam
            @RequestBody List<Imei> imeiList
    ) {
        try {
            Map<String, Object> result = hdsv.xacNhanDonHang(maHoaDon, imeiList);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }



    // sủa lại apapi dưới sang phái admin
    // sét trang  thái thanh toán là 1 khi khách hàng đã thanh toán hóa đơn
    @PostMapping("/updateTrangThaiThanhToan")
    public void setTTTT(@RequestBody HoaDon hoaDon){
        hoaDon.setTrangThaiThanhToan(1);
        hdsi.save(hoaDon);
    }

    // sét trang thái thanh toán là 0 khi khác hàng hủy hóa đơn
        @PostMapping("/huyHoaDon")
        public void huyHoaDon(@RequestBody HoaDon hoaDon){
        hoaDon.setTrangThai(0);
        hdsi.save(hoaDon);
        }

        // Tra cứu hóa đơn
        @GetMapping("/traCuu")
        public ResponseEntity<?> traCuuDonHang(
                @RequestParam(required = false) String soDienThoai,
                @RequestParam(required = false) String maHoaDon) {

            // Xác thực tham số đầu vào
            if ((soDienThoai == null || soDienThoai.isBlank()) && (maHoaDon == null || maHoaDon.isBlank())) {
                return ResponseEntity.badRequest().body("Vui lòng cung cấp mã Đơn hàng.");
            }

            // Gọi service để xử lý logic
            try {
                Object result = hdsv.traCuuDonHang(soDienThoai, maHoaDon);
                return ResponseEntity.ok(result);
            } catch (NoSuchElementException ex) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
            }
        }

}

