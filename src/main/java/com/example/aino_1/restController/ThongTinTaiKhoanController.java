package com.example.aino_1.restController;

import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.entity.HoaDon;

import com.example.aino_1.entity.SanPham;
import com.example.aino_1.entity.ThongTinTaiKhoan;
import com.example.aino_1.repository.ThongTinTaiKhoaninterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @PostMapping("/add")
    public ThongTinTaiKhoan getByid(@RequestBody ThongTinTaiKhoan ThongTinTaiKhoan) {
        return tttksi.save(ThongTinTaiKhoan);
    }
    @PutMapping("/update/{id}")
    public ThongTinTaiKhoan update(@RequestBody ThongTinTaiKhoan tttk) {
        return tttksi.save(tttk);
    }
    @DeleteMapping("/del/{id}")
    public void delete(@PathVariable Integer id) {
        tttksi.deleteById(id);
    }
}
