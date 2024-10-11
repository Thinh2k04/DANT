package com.example.aino_1.restController;

import com.example.aino_1.entity.DonHang;
import com.example.aino_1.serviceInter.DonHangServiceInter;
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
@RequestMapping("/rest/don_hang") //đường dẫn chung cho các phương thức http bên dưới
public class DonHangRestController {
    @Autowired
    DonHangServiceInter dhsi;

    @GetMapping("/getAll")
    public List<DonHang> getAll() {
        return dhsi.read();
    }

    @PostMapping("/add")
    public DonHang create(@RequestBody DonHang donHang) {
        return dhsi.create(donHang);
    }

    @PutMapping("/update/{id}")
    public DonHang update(@RequestBody DonHang donHang) {
        return dhsi.update(donHang);
    }

    @DeleteMapping("/del/{id}")
    public void delete(@PathVariable Integer id) {
        dhsi.delete(id);
    }
}
