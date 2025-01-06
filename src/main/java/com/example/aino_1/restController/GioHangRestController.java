package com.example.aino_1.restController;

import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.GioHang;

import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.repository.GioHangInterface;
import com.example.aino_1.service.GioHangService;
import org.springframework.beans.factory.annotation.Autowired;
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

import java.util.List;
import java.util.Map;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/gio_hang") //đường dẫn chung cho các phương thức http bên dưới
public class GioHangRestController {
    @Autowired
    GioHangInterface gsi;

    @Autowired
    GioHangService gioHangService;

    @GetMapping("/getAll")
    public List<GioHang> getAll() {
        return gsi.findAll();
    }

    @GetMapping("/getByID/{id}")
    public GioHang getAll(@PathVariable Integer id) {
        return gsi.findById(id).get();
    }

    @GetMapping("/check/{id}")
    public ResponseEntity<?> checkGioHang(@PathVariable Integer id) {
        Map<String, Object> result = gioHangService.checkGioHang(id);

        if ((boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    @GetMapping("/checkNotLogin")
    public ResponseEntity<?> checkGioHang(@RequestBody List<SanPhamChiTiet> listSPCT) {
        // Gọi phương thức kiểm tra số lượng
        List<Map<String, Object>> resultList = gioHangService.checkSPSoLuong(listSPCT);

        // Kiểm tra nếu tất cả sản phẩm đủ số lượng
        boolean allSufficient = resultList.stream()
                .allMatch(record -> (boolean) record.get("message")); // Kiểm tra giá trị "message"

        if (allSufficient) {
            return ResponseEntity.ok("Tất cả sản phẩm đủ số lượng.");
        } else {
            return ResponseEntity.badRequest().body(resultList);
        }
    }





    @PostMapping("/add")
    public GioHang create(@RequestBody GioHang gioHang) {
        return gsi.save(gioHang);
    }

    @PutMapping("/update/{id}")
    public GioHang update(@RequestBody GioHang gioHang) {
        return gsi.save(gioHang);
    }

    @DeleteMapping("/del/{id}")
    public void delete(@PathVariable Integer id) {
        gsi.deleteById(id);
    }
}
