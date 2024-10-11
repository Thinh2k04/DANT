package com.example.aino_1.restController;

import com.example.aino_1.entity.ChucVu;
import com.example.aino_1.serviceInter.ChucVuServiceInter;
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
@RequestMapping("/rest/chuc_vu") //đường dẫn chung cho các phương thức http bên dưới
public class ChucVuRestController {
    @Autowired
    ChucVuServiceInter cvsi;

    @GetMapping("/getAll")
    public List<ChucVu> getAll() {
        return cvsi.read();
    }

    @PostMapping("/add")
    public ChucVu create(@RequestBody ChucVu chucVu) {
        return cvsi.create(chucVu);
    }

    @PutMapping("/update/{maChucVu}")
    public ChucVu update(@RequestBody ChucVu chucVu) {
        return cvsi.update(chucVu);
    }

    @DeleteMapping("/del/{maChucVu}")
    public void delete(@PathVariable String maChucVu) {
        cvsi.delete(maChucVu);
    }
}
