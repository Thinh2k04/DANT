package com.example.aino_1.restController;


import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.Cpu;
import com.example.aino_1.entity.CuaHang;
import com.example.aino_1.repository.CuaHangInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/cuaHang") //đường dẫn chung cho các phương thức http bên dưới
public class CuaHangRestController {

    @Autowired
    CuaHangInterface csi;

    @GetMapping("/getAll")
    public List<CuaHang> getAll() {
        return csi.findAllByTrangThai(1);
    }


    @GetMapping("/getByID/{id}")
    public CuaHang getAll(@PathVariable Integer id) {
        return csi.findById(id).get();
    }

    @PostMapping("/add")
    public CuaHang create(@RequestBody CuaHang cuaHang) {
        return csi.save(cuaHang);
    }

    @PostMapping("/update")
    public CuaHang update(@RequestBody CuaHang cuaHang) {
        return csi.save(cuaHang);
    }

    @PostMapping("/del")
    public void delete(@RequestBody CuaHang cuaHang) {
        cuaHang.setTrangThai(0);
        csi.save(cuaHang);
    }
    @GetMapping("/getThungRac")
    public void getThungRac(){
        csi.findAllByTrangThai(0);
    }
}
