package com.example.aino_1.restController;

import com.example.aino_1.entity.HinhAnh;
import com.example.aino_1.serviceInter.HinhAnhServiceInter;
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
@RequestMapping("/rest/hinh_anh") //đường dẫn chung cho các phương thức http bên dưới
public class HinhAnhRestController {
    @Autowired
    HinhAnhServiceInter hasi;
    @GetMapping("/getAll")
    public List<HinhAnh> getAll() {
        return hasi.read();
    }

    @PostMapping("/add")
    public HinhAnh create(@RequestBody HinhAnh hinhAnh) {
        return hasi.create(hinhAnh);
    }

    @PutMapping("/update/{id}")
    public HinhAnh update(@RequestBody HinhAnh hinhAnh) {
        return hasi.update(hinhAnh);
    }

    @DeleteMapping("/del/{id}")
    public void delete(@PathVariable Integer id) {
        hasi.delete(id);
    }
}
