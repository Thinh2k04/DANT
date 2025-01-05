package com.example.aino_1.restController;

import com.example.aino_1.entity.*;
import com.example.aino_1.repository.ImeiInterface;
import com.example.aino_1.service.ImeiService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/imei")
public class ImeiController {

    @Autowired
    ImeiInterface ii;

    @Autowired
    ImeiService imsv;

    @GetMapping("/getAll")
    public List<Imei> getdata(){
        return ii.findAll();
    }




    @PostMapping("/createOrUpdate")
    public ResponseEntity<Map<String, Object>> createOrUpdate(@RequestBody Map<String, Object> requestData) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            System.out.println("IMEI Controller: hàm createOrUpdate");
            // Lấy id từ sanPhamChiTiet
            Map<String, Object> spctData = (Map<String, Object>) requestData.get("spct");
            Integer idSPCT = (Integer) spctData.get("id");

            // Lấy danh sách Imei từ JSON
            List<Imei> listImei = objectMapper.convertValue(requestData.get("listImei"), new TypeReference<List<Imei>>() {});

            // Gọi service để thêm hoặc cập nhật imei
            Map<String, Object> result = imsv.addOrUpdateImei(idSPCT, listImei);

            // Trả về thông báo cho FE
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            // Xử lý trường hợp trùng IMEI
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi xử lý yêu cầu: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }




    @GetMapping("/getById/{id}")
    public Imei getByidHD(@PathVariable Integer id){
        return ii.findById(id).get();
    }

    @GetMapping("/checkidSPCT/{id}")
    public ResponseEntity<?> checkSPCT(@PathVariable Integer id) {
        // Gọi phương thức để kiểm tra số lượng thiếu
        Integer soLuongThieu = imsv.checkImeiIDSPCT(id);

        System.out.println("check cho id: " + id + ", số lượng thiếu: " + soLuongThieu);

        if (soLuongThieu == -1) {
            // Trả về nếu sản phẩm chi tiết không tồn tại
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "message", "Sản phẩm chi tiết không tồn tại."
                    ));
        }

        if (soLuongThieu == 0) {
            // Trả về nếu đã nhập đủ số lượng IMEI
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã nhập đủ số lượng IMEI cho sản phẩm."
            ));
        } else if (soLuongThieu > 0) {
            // Trả về nếu còn thiếu IMEI cần bổ sung
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Còn thiếu " + soLuongThieu + " IMEI cần bổ sung cho sản phẩm.",
                    "soLuongBoSung", soLuongThieu // Bổ sung thêm số lượng còn thiếu
            ));
        } else {
            // Trả về nếu dữ liệu không hợp lệ
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "success", false,
                            "message", "Dữ liệu sản phẩm hoặc IMEI không hợp lệ."
                    ));
        }
    }



    @DeleteMapping("/del/{maSo}")
    public void delete(@PathVariable Integer maSo) {
        ii.deleteById(maSo);
    }


    @GetMapping("/getTopImei")
    public ResponseEntity<?> getTopImeiBySanPhamChiTietIdAndTrangThai(
            @RequestParam("idSpct") Integer idSpct,
            @RequestParam("idHDCT") Integer idHDCT,
            @RequestParam("soLuong") Integer soLuong) {
        try {
            // Gọi service để xử lý logic
            String result = imsv.updateTopImeiTrangThai(idSpct, soLuong, idHDCT);

            // Kiểm tra kết quả trả về
            if (result.startsWith("Số lượng không đủ")) {
                return ResponseEntity.badRequest().body(result);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi: " + e.getMessage());
        }
    }

    }

