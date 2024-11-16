package com.example.aino_1.restController;

import com.example.aino_1.entity.HinhAnh;
import com.example.aino_1.entity.HoaDon;
import com.example.aino_1.entity.SanPham;
import com.example.aino_1.repository.HinhAnhInterface;
import com.example.aino_1.repository.HoaDonInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/hoa_don") //đường dẫn chung cho các phương thức http bên dưới
public class HoaDonController {
    @Autowired
    HoaDonInterface hdsi;
    @GetMapping("/getAll")
    public List<HoaDon> getAll() {
        return hdsi.findAll();
    }
    @GetMapping("/getById/{id}")
    public HoaDon getById(@PathVariable Integer id) {
        return hdsi.findById(id).get();
    }
    @PostMapping("/add")
    public HoaDon create(@RequestBody HoaDon HoaDon) {
        return hdsi.save(HoaDon);
    }

    @PutMapping("/update/{id}")
    public HoaDon update(@RequestBody HoaDon HoaDon) {
        return hdsi.save(HoaDon);
    }

    @DeleteMapping("/del/{id}")
    public void delete(@PathVariable Integer id) {
        hdsi.deleteById(id);
    }
}
