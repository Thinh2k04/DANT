package com.example.aino_1.restController;

import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.ManHinh;
import com.example.aino_1.repository.ManHinhInterface;
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
@RequestMapping("/rest/man_hinh") //đường dẫn chung cho các phương thức http bên dưới
public class ManHinhRestController {
    @Autowired
    ManHinhInterface mhsi;

    @GetMapping("/getAll")
    public List<ManHinh> getAll() {
        return mhsi.findAllByTrangThai(1);
    }

    @GetMapping("/getByID/{id}")
    public ManHinh getAll(@PathVariable Integer id) {
        return mhsi.findById(id).get();
    }

    @PostMapping("/add")
    public ManHinh create(@RequestBody ManHinh manHinh) {
        return mhsi.save(manHinh);
    }

    @PostMapping("/update")
    public ManHinh update(@RequestBody ManHinh manHinh) {
        return mhsi.save(manHinh);
    }

    @PostMapping("/del")
    public void delete(@RequestBody ManHinh manHinh) {
        manHinh.setTrangThai(0);
        mhsi.save(manHinh);
    }
    @GetMapping("/getThungRac")
    public void getThungRac(){
        mhsi.findAllByTrangThai(0);
    }
}
