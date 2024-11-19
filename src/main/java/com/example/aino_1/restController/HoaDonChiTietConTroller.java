package com.example.aino_1.restController;

import com.example.aino_1.entity.HoaDon;
import com.example.aino_1.entity.HoaDonChiTiet;
import com.example.aino_1.repository.HDCTInterFace;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/hdct") //đường dẫn chung cho các phương thức http bên dưới
public class HoaDonChiTietConTroller {

    @Autowired
    HDCTInterFace hdctsi;

    @GetMapping("/getAll")
    public List<HoaDonChiTiet> getdata(){
        return hdctsi.findAll();
    }
    @GetMapping("/getById/{id}")
    public HoaDonChiTiet getByidHDCT(@PathVariable Integer id){
        return hdctsi.findById(id).get();
    }

    @GetMapping("/Byidhd/{id}")
    public List<HoaDonChiTiet> getHDCT(@PathVariable Integer id){
        return  hdctsi.findHoaDonWithDetailsById(id);
    }
}