package com.example.aino_1.restController;

import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.Voucher;

import com.example.aino_1.repository.VoucherInterface;
import com.example.aino_1.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/voucher") //đường dẫn chung cho các phương thức http bên dưới
public class VoucherRestController {
    @Autowired
    VoucherInterface vsi;

    @Autowired
    VoucherService voucherService;

    @GetMapping("/getAll")
    public List<Voucher> getAll() {
        voucherService.updateActiveVoucher();
        return vsi.findAllByTrangThai(1);
    }

    @PostMapping("/add")
    public Voucher create(@RequestBody Voucher voucher) {
        return vsi.save(voucher);
    }

    @GetMapping("/getByID/{id}")
    public Voucher getAll(@PathVariable Integer id) {
        return vsi.findById(id).get();
    }

    @PostMapping("/checkVoucher")
    public ResponseEntity<Map<String, Object>> checkVoucher(@RequestBody Map<String, Object> requestData) {
        try {
            // Lấy sdt và maVoucher từ request body
            String sdt = (String) requestData.get("sdt");
            String maVoucher = (String) requestData.get("maVoucher");

            // Kiểm tra tình trạng voucher
            boolean isVoucherUsed = voucherService.checkVoucherUsed(sdt, maVoucher);

            // Tạo đối tượng phản hồi
            Map<String, Object> response = new HashMap<>();

            if (isVoucherUsed) {
                response.put("success", true);
                response.put("message", "Voucher chưa được sử dụng.");
            } else {
                response.put("success", false);
                response.put("message", "Voucher đã được sử dụng.");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Lỗi khi kiểm tra voucher: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PutMapping("/update/{id}")
    public Voucher update(@RequestBody Voucher voucher) {
        return vsi.save(voucher);
    }

    @PostMapping("/del")
    public void delete(@RequestBody Voucher voucher) {
        voucher.setTrangThai(0);
        vsi.save(voucher);
    }
    @GetMapping("/getThungRac")
    public List<Voucher> getThungRac(){
        return vsi.findAllByTrangThai(0);
    }

    @GetMapping("/getVoucher/{voucher}")
    public Voucher getVoucher(@PathVariable String voucher){
       return voucherService.findVoucher(voucher);
    }
}
