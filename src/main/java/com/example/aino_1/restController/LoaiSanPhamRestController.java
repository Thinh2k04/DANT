package com.example.aino_1.restController;

import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.LoaiSanPham;
import com.example.aino_1.repository.LoaiSanPhamInterface;
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
@RequestMapping("/rest/loai_san_pham") //đường dẫn chung cho các phương thức http bên dưới
public class LoaiSanPhamRestController {
    @Autowired
    LoaiSanPhamInterface lspsi;

    @GetMapping("/getAll")
    public List<LoaiSanPham> getAll() {
        return lspsi.findAll();
    }

    @GetMapping("/getByID/{id}")
    public LoaiSanPham getAll(@PathVariable Integer id) {
        return lspsi.findById(id).get();
    }

    @PostMapping("/add")
    public LoaiSanPham create(@RequestBody LoaiSanPham loaiSanPham) {
        return lspsi.save(loaiSanPham);
    }

    @PostMapping("/update")
    public LoaiSanPham update(@RequestBody LoaiSanPham loaiSanPham) {
        return lspsi.save(loaiSanPham);
    }

    @PostMapping("/del")
    public void delete(@RequestBody LoaiSanPham loaiSanPham) {
        loaiSanPham.setTrangThai(0);
        lspsi.save(loaiSanPham);
    }
}
