package com.example.aino_1.restController;

import com.example.aino_1.entity.NguonNhap;
import com.example.aino_1.repository.NguonNhapInterface;
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
@RequestMapping("/rest/nguon_nhap") //đường dẫn chung cho các phương thức http bên dưới
public class NguonNhapRestController {
    @Autowired
    NguonNhapInterface nnsi;

    @GetMapping("/getAll")
    public List<NguonNhap> getAll() {
        return nnsi.findAll();
    }

    @PostMapping("/add")
    public NguonNhap create(@RequestBody NguonNhap nguonNhap) {
        return nnsi.save(nguonNhap);
    }

    @PutMapping("/update/{maNhaCungUng}")
    public NguonNhap update(@RequestBody NguonNhap nguonNhap) {
        return nnsi.save(nguonNhap);
    }

    @DeleteMapping("/del/{maNhaCungUng}")
    public void delete(@PathVariable String maNhaCungUng) {
        nnsi.deleteById(maNhaCungUng);
    }
}
