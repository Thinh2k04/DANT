package com.example.aino_1.restController;

import com.example.aino_1.entity.GioHangChiTiet;
import com.example.aino_1.entity.Gpu;
import com.example.aino_1.serviceInter.GHCTServiceInter;
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
@RequestMapping("/rest/ghct") //đường dẫn chung cho các phương thức http bên dưới
public class GHCTRestController {
    @Autowired
    GHCTServiceInter gsi;

    @GetMapping("/getAll")
    public List<GioHangChiTiet> getAll() {
        return gsi.read();
    }

    @PostMapping("/add")
    public GioHangChiTiet create(@RequestBody GioHangChiTiet ghct) {
        return gsi.create(ghct);
    }

    @PutMapping("/update/{id}")
    public GioHangChiTiet update(@RequestBody GioHangChiTiet ghct) {
        return gsi.update(ghct);
    }

    @DeleteMapping("/del/{id}")
    public void delete(@PathVariable Integer id) {
        gsi.delete(id);
    }
}

