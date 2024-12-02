package com.example.aino_1.restController;


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
        return csi.findAll();
    }

    @PostMapping("/add")
    public CuaHang create(@RequestBody CuaHang cuaHang) {
        return csi.save(cuaHang);
    }

    @PutMapping("/update/{maSo}")
    public CuaHang update(@RequestBody CuaHang cuaHang) {
        return csi.save(cuaHang);
    }

    @DeleteMapping("/del/{id}")
    public void delete(@PathVariable Integer id) {
        csi.deleteById(id);
    }
}
