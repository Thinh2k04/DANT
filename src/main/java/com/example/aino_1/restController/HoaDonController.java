package com.example.aino_1.restController;

import com.example.aino_1.entity.*;
import com.example.aino_1.repository.HoaDonInterface;
import com.example.aino_1.service.HoaDonService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/hoa_don") //đường dẫn chung cho các phương thức http bên dưới
public class HoaDonController {
    @Autowired
    HoaDonInterface hdsi;
    @Autowired
    HoaDonService hdsv;

    @GetMapping("/getAll")
    public List<HoaDon> getAll() {
        return hdsi.findAll();
    }

    @PutMapping("/update/{id}")
    public HoaDon update(@RequestBody HoaDon HoaDon) {
        return hdsi.save(HoaDon);
    }

    @DeleteMapping("/del/{id}")
    public void delete(@PathVariable Integer id) {
        hdsi.deleteById(id);
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
            ObjectMapper objectMapper = new ObjectMapper();

            // Ánh xạ dữ liệu từ requestData
            ThongTinTaiKhoan tttk = objectMapper.convertValue(requestData.get("tttk"), ThongTinTaiKhoan.class);
            HoaDon hd = objectMapper.convertValue(requestData.get("hd"), HoaDon.class);
            List<HoaDonChiTiet> lhdct = objectMapper.convertValue(requestData.get("lhdct"), new TypeReference<List<HoaDonChiTiet>>() {});

            // Kiểm tra dữ liệu đầu vào
            if (tttk == null || hd == null || lhdct == null || lhdct.isEmpty()) {
                return ResponseEntity.badRequest().body("Dữ liệu đầu vào không hợp lệ.");
            }

            // Gọi service để xử lý
            String result = hdsv.hamXuLiHoaDon(tttk, hd, lhdct);
            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Lỗi dữ liệu đầu vào: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi: " + e.getMessage());
        }
    }

}

