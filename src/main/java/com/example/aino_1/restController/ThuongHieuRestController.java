package com.example.aino_1.restController;

import com.example.aino_1.entity.ThongTinTaiKhoan;
import com.example.aino_1.entity.ThuongHieu;
import com.example.aino_1.repository.ThongTinTaiKhoaninterface;
import com.example.aino_1.repository.ThuongHieuInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/rest/thuong-hieu") //đường dẫn chung cho các phương thức http bên dưới
public class ThuongHieuRestController {
    @Autowired
    ThuongHieuInterface thsi;

    @GetMapping("/getAll")
    public List<ThuongHieu> getAllSanPhamChiTietDto() {
        return thsi.findAll();
    }

    @GetMapping("/getById/{id}")
    public ThuongHieu getById(@PathVariable Integer id) {
        return thsi.findById(id).get();
    }

    @PutMapping("/update/{id}")
    public ThuongHieu update(@RequestBody ThuongHieu tk) {
        return thsi.save(tk);
    }

    @PostMapping("/add")
    public ThuongHieu create(@RequestBody ThuongHieu tk) {
        return thsi.save(tk);
    }
}
