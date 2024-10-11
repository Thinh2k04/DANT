package com.example.aino_1.restController;

import com.example.aino_1.entity.TaiKhoanNguoiDung;
import com.example.aino_1.serviceInter.TaiKhoanNguoiDungServiceInter;
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
@RequestMapping("/rest/tai_khoan_nguoi_dung") //đường dẫn chung cho các phương thức http bên dưới
public class TaiKhoanNguoiDungRestController {
    @Autowired
    TaiKhoanNguoiDungServiceInter tkndsi;

    @GetMapping("/getAll")
    public List<TaiKhoanNguoiDung> getAll() {
        return tkndsi.read();
    }

    @PostMapping("/add")
    public TaiKhoanNguoiDung create(@RequestBody TaiKhoanNguoiDung taiKhoanNguoiDung) {
        return tkndsi.create(taiKhoanNguoiDung);
    }

    @PutMapping("/update/{id}")
    public TaiKhoanNguoiDung update(@RequestBody TaiKhoanNguoiDung taiKhoanNguoiDung) {
        return tkndsi.update(taiKhoanNguoiDung);
    }

    @DeleteMapping("/del/{id}")
    public void delete(@PathVariable Integer id) {
        tkndsi.delete(id);
    }
}
