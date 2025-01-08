package com.example.aino_1.restController;

import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.GioHangChiTiet;
import com.example.aino_1.entity.Gpu;
import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.repository.GioHangChiTietInterface;
import com.example.aino_1.repository.GioHangInterface;
import com.example.aino_1.service.GioHangChiTietService;
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

    @GetMapping("/check/{username}")
    public ResponseEntity<?> checkGioHang(@PathVariable String username) {
        Map<String, Object> result = gioHangChiTietService.checkGioHang(username);

        if ((boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    @GetMapping("/checkNotLogin")
    public ResponseEntity<?> checkGioHang(@RequestBody List<SanPhamChiTiet> listSPCT) {
        // Gọi phương thức kiểm tra số lượng
        List<Map<String, Object>> resultList = gioHangChiTietService.checkSPSoLuong(listSPCT);

        // Kiểm tra nếu tất cả sản phẩm đủ số lượng
        boolean allSufficient = resultList.stream()
                .allMatch(record -> (boolean) record.get("message")); // Kiểm tra giá trị "message"

        if (allSufficient) {
            return ResponseEntity.ok("Tất cả sản phẩm đủ số lượng.");
        } else {
            return ResponseEntity.badRequest().body(resultList);
        }
    }
}

