package com.example.aino_1.restController;

import com.example.aino_1.dto.TTTKDTO;
import com.example.aino_1.entity.ThongTinTaiKhoan;
import com.example.aino_1.repository.ThongTinTaiKhoaninterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/tttk") //đường dẫn chung cho các phương thức http bên dưới
public class ThongTinTaiKhoanController {
    @Autowired
    ThongTinTaiKhoaninterface tttksi;

    @GetMapping("/getAll")
    public List<ThongTinTaiKhoan> getAllSanPhamChiTietDto() {
        return tttksi.findAll();
    }

    @GetMapping("/getById/{id}")
    public ThongTinTaiKhoan getById(@PathVariable Integer id) {
        return tttksi.findById(id).get();
    }

    @PostMapping("/update")
    public ThongTinTaiKhoan update(@RequestBody ThongTinTaiKhoan tk) {
        return tttksi.save(tk);
    }

    @PostMapping("/add")
    public ThongTinTaiKhoan create(@RequestBody ThongTinTaiKhoan tk) {
        return tttksi.save(tk);
    }

    @GetMapping("/timSDT/{SDT}")
    public TTTKDTO timTTTKBySDT(@PathVariable String SDT) {
        return tttksi.timTTTKBySDT(SDT);
    }

    @PostMapping("/del/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        Optional<ThongTinTaiKhoan> optionalThongTinTaiKhoan = tttksi.findById(id);

        if (!optionalThongTinTaiKhoan.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ram with ID " + id + " not found");
        }

        ThongTinTaiKhoan thongTinTaiKhoan = optionalThongTinTaiKhoan.get();
        thongTinTaiKhoan.setTrangThai(0);
        ThongTinTaiKhoan saved = tttksi.save(thongTinTaiKhoan);

        return ResponseEntity.ok(saved);
    }

}
