package com.example.aino_1.restController;

import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.serviceInter.SanPhamChiTietServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
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

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/san_pham_chi_tiet") //đường dẫn chung cho các phương thức http bên dưới
public class SanPhamChiTietRestController {
    @Autowired
    SanPhamChiTietServiceInter spctsi;

    @GetMapping("/getAll")
    public List<SanPhamChiTiet> getAll() {
        return spctsi.read();
    }

    @PostMapping("/add")
    public SanPhamChiTiet create(@RequestBody SanPhamChiTiet spct) {
        return spctsi.create(spct);
    }

    @PutMapping("/update/{maDinhDanh}")
    public SanPhamChiTiet update(@RequestBody SanPhamChiTiet spct) {
        return spctsi.update(spct);
    }

    @DeleteMapping("/del/{maDinhDanh}")
    public void delete(@PathVariable String maDinhDanh) {
        spctsi.delete(maDinhDanh);
    }
}
