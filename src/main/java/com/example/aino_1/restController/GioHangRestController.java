package com.example.aino_1.restController;

import com.example.aino_1.entity.GioHang;
import com.example.aino_1.entity.Gpu;
import com.example.aino_1.serviceInter.GioHangServiceInter;
import com.example.aino_1.serviceInter.GpuServiceInter;
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
@RequestMapping("/rest/gio_hang") //đường dẫn chung cho các phương thức http bên dưới
public class GioHangRestController {
    @Autowired
    GioHangServiceInter gsi;

    @GetMapping("/getAll")
    public List<GioHang> getAll() {
        return gsi.read();
    }

    @PostMapping("/add")
    public GioHang create(@RequestBody GioHang gioHang) {
        return gsi.create(gioHang);
    }

    @PutMapping("/update/{id}")
    public GioHang update(@RequestBody GioHang gioHang) {
        return gsi.update(gioHang);
    }

    @DeleteMapping("/del/{id}")
    public void delete(@PathVariable Integer id) {
        gsi.delete(id);
    }
}
