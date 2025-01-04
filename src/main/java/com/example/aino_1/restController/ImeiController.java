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
    public ResponseEntity<String> createOrUpdate(@RequestBody Map<String, Object> requestData) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();

            // Lấy id từ sanPhamChiTiet
            Map<String, Object> spctData = (Map<String, Object>) requestData.get("spct");
            Integer idSPCT = (Integer) spctData.get("id");

            // Lấy danh sách Imei từ JSON
            List<Imei> listImei = objectMapper.convertValue(requestData.get("listImei"), new TypeReference<List<Imei>>() {});

            // Gọi service để thêm hoặc cập nhật imei
            String resultMessage = imsv.addOrUpdateImei(idSPCT, listImei);

            // Trả về thông báo cho FE
            return ResponseEntity.ok(resultMessage);
        } catch (RuntimeException e) {
            // Xử lý trường hợp trùng IMEI
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xử lý yêu cầu: " + e.getMessage());
        }
    }



    @GetMapping("/getById/{id}")
    public Imei getByidHD(@PathVariable Integer id){
        return ii.findById(id).get();
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

